$(function() {

	//////////////////////////////////////////////
	// View
	AMPAV0030SelectorView = Backbone.View.extend({

		screenId : "AMPAV0030",
		categoryId : "AMPA",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_AMPAV0030_search"		:	"_onSearchClick",		// 検索ボタン押下
			"click #searchAgain"				:	"_onSearchAgainClick",	// 検索条件を再指定ボタン押下
			"click #ca_AMPAV0030_add"			:	"_onAddClick",			// 追加ボタン押下

			"click .ca_AMPAV0030_edit_del"		:	"_onEditDelClick",		// 単一削除ボタン押下
			"click #ca_AMPAV0030_edit_delall"	:	"_onEditDelAllClick",	// すべて削除ボタン押下

			"click #ca_AMPAV0030_clear"			:	"_onClearClick",		// クリアボタン押下
			"click #ca_AMPAV0030_commit"		:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_AMPAV0030_show_AMPAV0040"		:	"_onShowAMPAV0040Click",		// 商品分類選択ボタン押下

			"click #ca_AMPAV0030_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_AMPAV0030_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_AMPAV0030_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
		},

		/**
		 * 引数
		 * ・$parentView		: 親画面のjQueryオブジェクト (例：$('#ca_main'))
		 * ・select_mode		: チェックボックス/ラジオボタン選択
		 * 						  nullの場合はラジオ
		 * ・isAnalyse_mode		: false 分析モードでない場合
		 * 						: true  分析モードの場合、デフォルト
		 * ・ymd				: 検索日
		 *						  指定がない場合は運用日
		 */
		initialize: function(opt) {
			var defaults = {
				search_date: clcom.ope_date,			// 運用日
				select_mode: clutil.cl_single_select,	// 単一選択モード
				isAnalyse_mode: true					// 分析画面で利用
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {

			//選択した内容のスクロール
			this.$('#innerScroll').perfectScrollbar();

			clutil.inputlimiter(this.$el);

			// 単一選択モード
			if (this.select_mode == clutil.cl_single_select) {
				this.$('.ca_AMPAV0030_multi').remove();
				this.$('#ca_AMPAV0030_chkall').remove();
			}
			clutil.initUIelement(this.$el);

			// 全選択チェックボックスを初期化
			this.chkall = clutil.checkallbox(this.$('#ca_AMPAV0030_chkall'),
					this.$('#ca_AMPAV0030_tbl'),
					this.$('#ca_AMPAV0030_tbody')
					);

			// 分析画面以外からのモード
			if (this.isAnalyse_mode == false) {
				this.$('.ca_AMPAV0030_multi').remove();
				this.$('#mainColumninBox').addClass('noLeftColumn');
				this.$('#mainColumnFooter').addClass('noLeftColumn');
			} else {
				this.$('#mainColumnFooter').addClass('analytics');
			}

			if (this.isAnalyse_mode && this.select_mode != clutil.cl_single_select){
				// 条件表示エリアの設定
				this.addtoSelected = clutil.addtoSelected(
						this.$('#ca_AMPAV0030_add'),
						this.$('#selected'),
						this.$('#mainColumn'));
			}

			// 検索条件を再指定ボタンを隠す
			this.srchArea = clutil.controlSrchArea(this.$('#ca_AMPAV0030_searchArea'),
					this.$('#ca_AMPAV0030_search'),
					this.$('#result'),
					this.$('#searchAgain'));

			// 商品分類選択画面
			this.AMPAV0030_AMPAV0040Selector = new  AMPAV0040SelectorView({
				el : this.$('#ca_AMPAV0030_AMPAV0040_dialog'),	// 配置場所
				$parentView		: this.$('#ca_AMPAV0030_main'),
				isAnalyse_mode	: this.isAnalyse_mode,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_single_select
			});
			this.AMPAV0030_AMPAV0040Selector.render();

		},

		/**
		 * 選択画面の初期化処理
		 */
		render: function() {

			var url = clcom.urlRoot + "/system/app/" + this.categoryId + "/" + this.screenId + "/" + this.screenId + ".html";

			// HTMLソースを読み込む
			var _this = this;
			clutil.loadHtml(url, function(data) {
				_this.html_source = data;
			});

			return this;
		},

		/**
		 * ページャーの初期化
		 * @param itemsOnPage
		 * @param totalCount
		 */
		initPager: function(pageNumber, itemsOnPage, totalCount) {
			var _this = this;
			this.$('#ca_AMPAV0030_pager1').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_AMPAV0030_pager_displaypanel1'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時
					_this.onPageClick(pageNumber, itemsOnPage, true);
				}
			});
			this.$('#ca_AMPAV0030_pager2').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_AMPAV0030_pager_displaypanel2'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時
					_this.onPageClick(pageNumber, itemsOnPage, true);
				}
			});
		},

		show: function(editList, isSubDialog) {
			var _this = this;

			// 画面切り替え前のスクロール位置
			this.savedPos = {
				top: $('body').scrollTop(),
				left: $('body').scrollLeft()
			};

			// 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
			if (isSubDialog == null) {
				$('.cl_dialog').empty();
			}

			this.$parentView.hide();

			// htmlソースからダイアログを作成する
			this.$el.html('');
			this.$el.html(this.html_source);

			// 画面の初期化
			this.initUIelement();

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_AMPAV0030_main'), {
				echoback		: $('.cl_echoback')
			});
			// フォーカスの設定
			this.setFocus();

			// 複数選択モードで編集データがある場合
			if (this.select_mode == clutil.cl_multiple_select &&
					editList != null && editList.length > 0) {
				var html_source = '';
				for (var i = 0; i < editList.length; i++) {
					if (i == editList.length) {
						break;
					}
					html_source += this.makeEditTmp(editList[i]);
				}
				this.$('#ca_AMPAV0030_edit_tbl').html(html_source);
			} else if (this.addtoSelected != null) {
				this.addtoSelected.right_side_hide();
			}

			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode({
				view : this.$el
			});

			// 初期スクロール位置は原点に。
			$('body').scrollTop(0).scrollLeft(0);
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus(this.$('#ca_AMPAV0030_code'));
		},

		/**
		 * 商品分類選択ボタン押下
		 */
		_onShowAMPAV0040Click: function(e) {
			var _this = this;

			// 選択された情報を初期値として検索する
			var initData = {};
			initData.func_id = this.$('#ca_AMPAV0030_itgrpfunc_id').val();
			initData.itgrp_id = this.$('#ca_AMPAV0030_itgrp_id').val();

			if (this.isAnalyse_mode) {
				// 分析条件部分を閉じる
				clutil.closeCondition();
			}

			this.AMPAV0030_AMPAV0040Selector.show(null, true, null, null, initData);
			//サブ画面復帰後処理
			this.AMPAV0030_AMPAV0040Selector.okProc = function(data) {
				if(data != null && data.length > 0) {
					_this.$('#ca_AMPAV0030_itgrpname').val(data[0].code + ":" + data[0].name);
					_this.$('#ca_AMPAV0030_itgrp_id').val(data[0].val);
					_this.$('#ca_AMPAV0030_itgrpfunc_id').val(data[0].func_id);
					_this.$('#ca_AMPAV0030_itgrplvl_id').val(data[0].lvl_id);
				}
				// ボタンにフォーカスする
				$(e.target).focus();
			}
		},

		/**
		 * 検索ボタン押下
		 */
		_onSearchClick: function() {
			// 画面の情報を取得する
			var searchData = clutil.view2data(this.$('#ca_AMPAV0030_searchArea'), 'ca_AMPAV0030_');
			// 全角、半角対応
			if (searchData.name.length > 0) {
				searchData.namezen = clutil.han2zen(searchData.name);
				searchData.namehan = clutil.zen2han(searchData.name);
			}
			this.req = {
					cond : searchData
			};

			//結果表示(ページャー)
			this.onPageClick(1, clcom.itemsOnPage);
		},

		// ページャークリック
		onPageClick: function(pageNumber, itemsOnPage, isPager) {
			var _this = this;

			// 結果状態をクリアする
			this.clearResult();

			var index = itemsOnPage * (pageNumber - 1);
			var pagedata = {
					start_record : index,			// index番目のデータから(0～)
					page_size : itemsOnPage			// 1ページに表示する件数を要求
			};

			this.req.pagereq = pagedata;

			// データを取得
			var uri = 'am_pa_item_srch';
			clutil.postJSON(uri, this.req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					_this.resultList = data.list;

					if (_this.resultList == null || _this.resultList.length == 0) {
						_this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
						_this.$('#result').show();
					} else {

						var no = 1;	//表示番号セット
						// 取得したデータを表示する
						$.each(_this.resultList, function() {
							this.numList = no++;
						});

						// 選択モード（nullの場合は単一選択）
						switch (_this.select_mode) {
						case clutil.cl_multiple_select:
							$select_template = _this.$('#ca_AMPAV0030_tbody_multiple_tmp');
							break;
						case clutil.cl_single_select:
						default:
							$select_template = _this.$('#ca_AMPAV0030_tbody_single_tmp');
							break;
						}
						// 取得したデータを表示する
						$select_template.tmpl(_this.resultList).appendTo('#ca_AMPAV0030_tbody');

						clutil.initUIelement(_this.$('#ca_AMPAV0030_tbl'));

						// 検索ボタン押下時は検索条件エリアを閉じる
						if (!isPager) {
							_this.srchArea.show_result();
						}

						// 総レコード数
						var totalRec = data.pagersp.total_record;
						// ページャーの初期化
						_this.initPager(pageNumber, itemsOnPage, totalRec);

					}

				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					// ページャーの初期化
					_this.initPager(1, itemsOnPage, 0);
				}

				if (_this.$('#searchAgain').css('display') == 'none') {
					// 検索ボタンにフォーカスする
					_this.$('#ca_AMPAV0030_search').focus();
				} else {
					// 条件を追加ボタンにフォーカスする
					_this.$('#ca_AMPAV0030_add').focus();
				}
			}, this));
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// テーブルをクリア
			this.$('#ca_AMPAV0030_tbody').empty();
			// ページャーの初期化
			this.initPager(1, clcom.itemsOnPage, 0);
			// validatorの初期化
			this.validator.clear();
			// 全選択チェックボックスを初期化
			this.chkall.init();
			// 確定時用のデータを初期化
			this.resultList = [];
		},

		/**
		 * クリアボタン押下
		 */
		_onClearClick: function() {
			clutil.viewClear(this.$('#ca_AMPAV0030_searchArea'));
			// validatorの初期化
			this.validator.clear();
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function() {
			this.srchArea.show_srch();
		},

		/**
		 * 追加ボタン押下
		 */
		_onAddClick:function() {
			// 編集領域を閉じる際はなにもしない
			if (this.addtoSelected.right_side()) {
				return;
			}
			var chkId = [];
			$.each(this.$('#ca_AMPAV0030_tbody').find("[name=ca_AMPAV0030_chk]:checked"), function() {
				var tr = $(this).closest('tr');
				chkId.push(tr.get(0).id);
			});

			if (chkId.length > 0) {
				var selectlist = this.getData(chkId);
				// 編集領域のIDリストを取得する
				var idlist = [];
				var html_source = '';

				$.each(this.$('#ca_AMPAV0030_edit_tbl li'), function() {
					idlist.push(Number(this.id));
				});

				// 現在の要素数を取得
				var num = idlist.length;
				var editlist = [];

				for (var i = 0; i < selectlist.length; i++) {
					var select = selectlist[i];

					// 追加可能な要素数を超えている場合はこれ以上追加しない
					if (num == clcom.list_max) {
						this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.number_overflow, [clcom.list_max])});
						break;
					}
					// 重複チェック
					if(idlist.indexOf(select.item_id) != -1){
						// 重複する場合は追加しない
						continue;
					}
					// 重複していない場合は追加
					var newdata = {};
					newdata.val = select.item_id;
					newdata.code = select.code;
					newdata.name = select.name;
					// 種別を挿入する
					newdata.kind = amdb_defs.AM_PA_DEFS_KIND_ITEM;

					html_source += this.makeEditTmp(newdata);
					num++;
					editlist.push(newdata);
				}
				this.$('#ca_AMPAV0030_edit_tbl').append(html_source);
			} else {
				// なにもしない
			}
			// 全選択チェックボックスを初期化
			this.chkall.init();
		},

		// Idより選択されたデータを取得
		getData : function(chkId){
			var selectData = [];
			for (var i = 0; i < this.resultList.length; i++) {
				var data = this.resultList[i];
				for (var j = 0; j < chkId.length; j++) {
					var selectId = chkId[j];
					if (data.item_id == selectId) {
						selectData.push(data);
						break;
					}
				}
			}
			return selectData;
		},

		/**
		 * 編集領域テンプレート
		 */
		makeEditTmp: function(data) {
			var html_source = '';
			html_source += '<li id="' + data.val + '"><span>' + data.name + '</span><span class="code">';
			html_source += data.code + '</span><span class="btn-delete ca_AMPAV0030_edit_del"></span>'
			html_source += '<input type="hidden" name="kind" value="' + data.kind + '">';
			html_source += '<input type="hidden" name="val" value="' + data.val + '">';
			html_source += '<input type="hidden" name="code" value="' + data.code + '">';
			html_source += '<input type="hidden" name="name" value="' + data.name + '">';
			html_source += '</li>';

			return html_source;
		},

		/**
		 * 編集領域単一削除ボタン
		 */
		_onEditDelClick: function(e) {
			// クリックされた行を削除する
			$(e.target).closest("li").remove();
			this.$('#ca_AMPAV0030_add').focus();
		},

		/**
		 * 編集領域すべて削除ボタン押下
		 */
		_onEditDelAllClick: function() {
			// 削除対象IDリストを取得する
			var idlist = [];
			var html_source = '';
			this.$('#ca_AMPAV0030_edit_tbl').html("");
		},

		/**
		 * テーブルに表示されている編集リストを取得する
		 */
		getEditList : function() {
			var editlist = [];
			editlist = clutil.tableview2data(this.$('#ca_AMPAV0030_edit_tbl').children());
			return editlist;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			this.validator.clear();
			var editlist = [];

			// 単一選択モード
			if (this.select_mode == clutil.cl_single_select ||
					this.isAnalyse_mode == false) {
				var chkId = [];
				$.each(this.$('#ca_AMPAV0030_tbody').find("[name=ca_AMPAV0030_chk]:checked"), function() {
					var tr = $(this).closest('tr');
					chkId.push(tr.get(0).id);
				});

				if (chkId.length > 0) {
					var selectlist = this.getData(chkId);

					for (var i = 0; i < selectlist.length; i++) {
						var select = selectlist[i];

						var newdata = {};
						newdata.val = select.item_id;
						newdata.code = select.code;
						newdata.name = select.name;
						// 種別を挿入する
						newdata.kind = amdb_defs.AM_PA_DEFS_KIND_ITEM;

						editlist.push(newdata);
					}
					this.$parentView.show();
					this._okProc(editlist);
					this.$el.html('');
					clutil.leaveEnterFocusMode();
					clutil.enterFocusMode();
				} else {
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clmsg.ca_AMPAV0030_0001});
				}
			} else {
				// 編集リストを取得
				this.$parentView.show();
				this._okProc(this.getEditList());
				this.$el.html('');
				clutil.leaveEnterFocusMode();
				clutil.enterFocusMode();
			}
		},

		// 選択時処理  呼び出し側で override する
		okProc : function(){
			// 上位で上書きする。
		},
		_okProc: function(){
			// Appコールバック呼び出し
			if(_.isFunction(this.okProc)){
				this.okProc.apply($, arguments);
			}
			// サブ画面からの復帰後のスクロール位置調整
			if(this.savedPos){
				_.defer(function(top, left){
					$('body').scrollTop(top).scrollLeft(left);
				}, this.savedPos.top, this.savedPos.left);
			}
		},

		/**
		 * キャンセル
		 */
		_onCancelClick: function() {
			this.$parentView.show();
			this._okProc(null);
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
		}
	});

});
