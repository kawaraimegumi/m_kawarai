$(function() {

	//////////////////////////////////////////////
	// View
	MDCMV0220SelectorView = Backbone.View.extend({

		screenId : "MDCMV0220",
		validator: null,

		// 組織区分チェックボックス用テンプレート
		orgKindLITemplate: _.template(''
			+ '<li><label class="checkbox">'
			+ '<input type="checkbox" value="<%= type_id %>" data-toggle="checkbox">'
			+ '<%- name %>'
			+ '</label></li>'),

		// 押下イベント
		events: {
			"click #ca_MDCMV0220_search"		:	"_onSearchClick",		// 検索ボタン押下
			"click #searchAgain"				:	"_onSearchAgainClick",	// 検索条件を再指定ボタン押下
			"click #ca_MDCMV0220_add"			:	"_onAddClick",			// 追加ボタン押下

			"click .ca_MDCMV0220_edit_del"		:	"_onEditDelClick",		// 単一削除ボタン押下
			"click #ca_MDCMV0220_edit_delall"	:	"_onEditDelAllClick",	// すべて削除ボタン押下

			"click #ca_MDCMV0220_clear"			:	"_onClearClick",		// クリアボタン押下
			"click #ca_MDCMV0220_commit"		:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_MDCMV0220_show_MDCMV0170"		:	"_onShowMDCMV0170Click",		// 組織選択ボタン押下

			"click #ca_MDCMV0220_main th.ca_th_sort"	:	"_onThSortClick",				// テーブルヘッダ押下

			"click #ca_MDCMV0220_main .close"	:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_MDCMV0220_cancel"		:	"_onCancelClick",	// キャンセルボタン押下時
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
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), this.isAnalyse_mode);

			var _this = this;
			clutil.inputlimiter(this.$el);

			// 単一選択モード
			if (this.select_mode == clutil.cl_single_select) {
				this.$('.ca_MDCMV0220_multi').remove();
				this.$('#ca_MDCMV0220_chkall').remove();
			}
			//選択した内容のスクロール
			this.$('#innerScroll').perfectScrollbar();

			// カレンダー
			clutil.datepicker(this.$("#ca_MDCMV0220_open_iymd_from"));
			clutil.datepicker(this.$("#ca_MDCMV0220_open_iymd_to"));
			clutil.datepicker(this.$("#ca_MDCMV0220_close_iymd_from"));
			clutil.datepicker(this.$("#ca_MDCMV0220_close_iymd_to"));
			// カレンダーの日付をクリア
			clutil.viewClear(this.$('#ca_MDCMV0220_searchArea'), false);

			clutil.initUIelement(this.$el);

			// 全選択チェックボックスを初期化
			this.chkall = clutil.checkallbox(this.$('#ca_MDCMV0220_chkall'),
					this.$('#ca_MDCMV0220_tbl'),
					this.$('#ca_MDCMV0220_tbody')
					);

			// 分析画面以外からのモード
			if (this.isAnalyse_mode == false) {
				this.$('.ca_MDCMV0220_multi').remove();
				this.$('#mainColumninBox').addClass('noLeftColumn');
				this.$('#mainColumnFooter').addClass('noLeftColumn');
			} else {
				this.$('#mainColumnFooter').addClass('analytics');
			}

			if (this.isAnalyse_mode && this.select_mode != clutil.cl_single_select){
				this.$('#mainColumnFooter').addClass('analytics');
				// 条件表示エリアの設定
				this.addtoSelected = clutil.addtoSelected(
						this.$('#ca_MDCMV0220_add'),
						this.$('#selected'),
						this.$('#mainColumn'));
			}

			// 検索条件を再指定ボタンを隠す
			this.srchArea = clutil.controlSrchArea(this.$('#ca_MDCMV0220_searchArea'),
					this.$('#ca_MDCMV0220_search'),
					this.$('#result'),
					this.$('#searchAgain'));

			// 組織選択画面
			this.MDCMV0220_MDCMV0170Selector = new  MDCMV0170SelectorView({
				el : this.$('#ca_MDCMV0220_MDCMV0170_dialog'),	// 配置場所
				$parentView		: this.$('#ca_MDCMV0220_main'),
				isAnalyse_mode	: this.isAnalyse_mode,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_single_select,	// 単一選択モード
				anaProc			: this.anaProc
			});
			this.MDCMV0220_MDCMV0170Selector.render();

			// エキスパンダ
			this.$('.expandFieldUnits').click(function(){
				$('.fieldUnitsHidden').slideToggle();
				$(this).find('span').fadeToggle();
				$("div#ca_MDCMV0220_searchArea").parent().css('height', 'auto');
			});

			// 組織区分
			clutil.checkall(this.$('#ca_MDCMV0220_orgkind_chkall'), this.$('#ca_MDCMV0220_orgkind'));
		},

		/**
		 * 選択画面の初期化処理
		 */
		render: function() {
//			var url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
			var url = clcom.getAnaSubPaneURI(this.screenId);

			// HTMLソースを読み込む
			clutil.loadHtml(url, _.bind(function(data) {
				this.html_source = data;
			}, this));

			return this;
		},

		/**
		 * ページャーの初期化
		 * @param itemsOnPage
		 * @param totalCount
		 */
		initPager: function(pageNumber, itemsOnPage, totalCount) {
			var _this = this;
			this.$('#ca_MDCMV0220_pager1').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_MDCMV0220_pager_displaypanel1'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時
					_this.onPageClick(pageNumber, itemsOnPage, true);
				},
				onSelectChange: function(itemsOnPage) {
					// 表示件数変更時
					_this.onPageClick(1, itemsOnPage, true);
				}
			});
			this.$('#ca_MDCMV0220_pager2').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_MDCMV0220_pager_displaypanel2'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時
					_this.onPageClick(pageNumber, itemsOnPage);
				},
				onSelectChange: function(itemsOnPage) {
					// 表示件数変更時
					_this.onPageClick(1, itemsOnPage, true);
				}
			});
		},

		show: function(editList, isSubDialog) {

			// 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
			if (isSubDialog == null) {
				$('.cl_dialog').empty();
			}

			this.$parentView.hide();

			// htmlソースからダイアログを作成する
			this.$el.html('');
			this.$el.html(this.html_source);

			// 組織区分の選択肢を再構築
			if(true){
				var $ul = this.$('#ca_MDCMV0220_orgkind');
				var orgTypes = clcom.getTypeList(amcm_type.AMCM_TYPE_ORG_KIND);
				if(_.isEmpty(orgTypes)){
					// 組織区分の検索条件を隠しておく
					$ul.closest('.fieldUnit').hide();
				}else{
					var html = '';
					for(var i = 0; i < orgTypes.length; i++){
						var orgTyp = orgTypes[i];
						// 店舗/本部/倉庫の選択のみ表示する #20150110
						switch(orgTyp.type_id){
						 case amcm_type.AMCM_VAL_ORG_KIND_STORE:
						 case amcm_type.AMCM_VAL_ORG_KIND_CENTER:
						 case amcm_type.AMCM_VAL_ORG_KIND_HQ:
							break;
						 default:
							continue;
						}
						html += this.orgKindLITemplate(orgTyp);
					}
					$ul.html(html);
				}
				// "店舗"選択部品なので、組織種別の選択は要らんだろう #20141005 OTK
				// 店舗/本部/倉庫の選択は表示する #20150110
				////$ul.closest('.fieldUnit').hide();
			}

			// 画面の初期化
			this.initUIelement();

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_MDCMV0220_main'), {
				echoback		: $('.cl_echoback')
			});

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
				this.$('#ca_MDCMV0220_edit_tbl').html(html_source);
			} else if (this.addtoSelected != null) {
				this.addtoSelected.right_side_hide();
			}

			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode({
				view : this.$el
			});

			// フォーカスの設定
			this.setFocus();
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus(this.$('#ca_MDCMV0220_code'));
		},

		/**
		 * 組織選択ボタン押下
		 */
		_onShowMDCMV0170Click: function(e) {
			var _this = this;

			// 選択された情報を初期値として検索する
			var initData = {};
			initData.func_id = this.$('#ca_MDCMV0220_func_id').val();
			initData.org_id = this.$('#ca_MDCMV0220_org_id').val();

			if (this.isAnalyse_mode) {
				// 分析条件部分を閉じる
				clutil.closeCondition();
			}

			this.MDCMV0220_MDCMV0170Selector.show(null, true, null, null, initData);
			//サブ画面復帰後処理
			this.MDCMV0220_MDCMV0170Selector.okProc = function(data) {
				if(data != null && data.length > 0) {
					_this.$('#ca_MDCMV0220_orgname').val(data[0].code + ":" + data[0].name);
					_this.$('#ca_MDCMV0220_org_id').val(data[0].val);
					_this.$('#ca_MDCMV0220_func_id').val(data[0].func_id);
				}
				// ボタンにフォーカスする
				$(e.target).focus();
			}
		},

		/**
		 * テーブルヘッダ click
		 */
		_onThSortClick: function(e) {
			var th = $(e.target).closest('th');
			var key = $(th).attr('key');
			if (key == null) {
				return;
			}

			// 昇順クラスがついていなかったら昇順にする
			// 昇順クラスがついていたら降順にする
			var isAsc = $(th).hasClass('sortAsc') ? false : true;
			var sort_order = isAsc ? am_proto_sort_req.AM_PROTO_SORT_ORDER_ASCENDING :
				am_proto_sort_req.AM_PROTO_SORT_ORDER_DESCENDING;

			// ソートキー初期化
			this.initSort();

			// ソートキーを挿入
			this.req['sortreq'] = {
					sort_key : gsan_se_store_srch_if['GSAN_PROTO_SORT_KEY_' + key],
					sort_order : sort_order,
					key : key
			};

			// 検索エリアは隠さない
			this.onPageClick(1, clcom.itemsOnPage, true);
		},

		/**
		 * ソートIDが存在すればヘッダにマークをつける
		 */
		setSort: function(req) {
			if (req == null || req.sortreq == null) {
				return;
			}
			var sortreq = req.sortreq;
			var th = this.$('#ca_MDCMV0220_tbl').find('th[key=' + sortreq.key + ']');
			if (sortreq.sort_order == am_proto_sort_req.AM_PROTO_SORT_ORDER_ASCENDING) {
				$(th).addClass('sortAsc');
			} else {
				$(th).addClass('sortDsc');
			}
		},

		/**
		 * ソートキー初期化
		 */
		initSort: function() {
			this.$('th.ca_th_sort').removeClass('sortAsc');
			this.$('th.ca_th_sort').removeClass('sortDsc');
		},

		/**
		 * 検索ボタン押下
		 */
		_onSearchClick: function() {
			var retStat = true;
			if(!this.validator.valid()){
				retStat = false;
			}
			// 範囲反転チェック
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_MDCMV0220_open_iymd_from',
				edval : 'ca_MDCMV0220_open_iymd_to'
			});
			chkInfo.push({
				stval : 'ca_MDCMV0220_close_iymd_from',
				edval : 'ca_MDCMV0220_close_iymd_to'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}
			if (!retStat) {
				return;
			}

			// 画面の情報を取得する
			var searchData = clutil.view2data(this.$('#ca_MDCMV0220_searchArea'), 'ca_MDCMV0220_');
			// 全角、半角対応
			if (searchData.name.length > 0) {
				searchData.namezen = clutil.han2zen(searchData.name);
				searchData.namehan = clutil.zen2han(searchData.name);
			}

			// 組織区分の条件
			if(true){
				var selectedOrgIds = [];
				this.$('#ca_MDCMV0220_orgkind input:checked').each(function(){
					var orgTypId = this.value;
					if(_.isFinite(orgTypId)){
						selectedOrgIds.push(parseInt(orgTypId));
					}else{
						console.warn('orgTypId[' + orgTypId + '] not Number, ignore.');
					}
				});
				searchData.org_type = selectedOrgIds;
			}

			searchData['srch_iymd'] =  clutil.getMstSrchDate(this.isAnalyse_mode, this.anaProc, 'org');

			this.req = {
					cond : searchData
			};

			//結果表示(ページャー)
			this.onPageClick(1, clcom.itemsOnPage);
		},

		// ページャークリック
		onPageClick: function(pageNumber, itemsOnPage, isPager) {

			// 結果状態をクリアする
			this.clearResult();

			var index = itemsOnPage * (pageNumber - 1);
			var pagedata = {
				start_record : index,			// index番目のデータから(0～)
				page_size : itemsOnPage			// 1ページに表示する件数を要求
			};

			this.req.pagereq = pagedata;

			// データを取得
			var uri = 'gsan_se_store_srch';
			clutil.postAnaJSON(uri, this.req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					this.resultList = data.list;

					if (this.resultList == null || this.resultList.length == 0) {
						this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
						this.$('#result').show();
					} else {

						var no = 1;	//表示番号セット
						// 取得したデータを表示する
						$.each(this.resultList, function() {
							this.numList = no++;
						});

						// 選択モード（nullの場合は単一選択）
						switch (this.select_mode) {
						case clutil.cl_multiple_select:
							$select_template = this.$('#ca_MDCMV0220_tbody_multiple_tmp');
							break;
						case clutil.cl_single_select:
						default:
							$select_template = this.$('#ca_MDCMV0220_tbody_single_tmp');
							break;
						}
						// 取得したデータを表示する
						$select_template.tmpl(this.resultList).appendTo('#ca_MDCMV0220_tbody');

						clutil.initUIelement(this.$('#ca_MDCMV0220_tbl'));

						// 検索ボタン押下時は検索条件エリアを閉じる
						if (!isPager) {
							this.srchArea.show_result();
							// エキスパンダ
							$('.fieldUnitsHidden').hide();
							$('.expand').show();
							$('.unexpand').hide();
						}

						// 総レコード数
						var totalRec = data.pagersp.total_record;
						// ページャーの初期化
						this.initPager(pageNumber, itemsOnPage, totalRec);

						// ヘッダソートが存在すればマークを付加する
						this.setSort(this.req);
					}

				} else {
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					// ページャーの初期化
					this.initPager(1, itemsOnPage, 0);
				}

				if (this.$('#searchAgain').css('display') == 'none') {
					// 検索ボタンにフォーカスする
					this.$('#ca_MDCMV0220_search').focus();
				} else {
					// 再検索ボタンにフォーカスする
					this.$('#searchAgain').focus();
				}
			}, this));
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// テーブルをクリア
			this.$('#ca_MDCMV0220_tbody').empty();
			// ソートキー初期化
			this.initSort();
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
			clutil.viewClear(this.$('#ca_MDCMV0220_searchArea'), false);
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
			$.each(this.$('#ca_MDCMV0220_tbody').find("[name=ca_MDCMV0220_chk]:checked"), function() {
				var tr = $(this).closest('tr');
				chkId.push(tr.get(0).id);
			});

			if (chkId.length > 0) {
				var selectlist = this.getData(chkId);
				// 編集領域のIDリストを取得する
				var idlist = [];
				var html_source = '';

				$.each(this.$('#ca_MDCMV0220_edit_tbl li'), function() {
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
					if(idlist.indexOf(select.store_id) != -1){
						// 重複する場合は追加しない
						continue;
					}
					// 重複していない場合は追加
					var newdata = {};
					newdata.val = select.store_id;
					newdata.code = select.code;
					newdata.name = select.name;
					// 種別を挿入する
					newdata.kind = amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_COUPON_STORE;

					html_source += this.makeEditTmp(newdata);
					num++;
					editlist.push(newdata);
				}
				this.$('#ca_MDCMV0220_edit_tbl').append(html_source);
			} else {
				// なにもしない
			}
			// 全選択チェックボックスを初期化
			this.chkall.init();
			// アニメーション表示のための初期化
			clutil.initUIelement(this.$el);
		},

		// Idより選択されたデータを取得
		getData : function(chkId){
			var selectData = [];
			for (var i = 0; i < this.resultList.length; i++) {
				var data = this.resultList[i];
				for (var j = 0; j < chkId.length; j++) {
					var selectId = chkId[j];
					if (data.store_id == selectId) {
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
			html_source += data.code + '</span><span class="btn-delete ca_MDCMV0220_edit_del"></span>'
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
			$(e.target).closest("li").fadeOut(300).queue( function(){ this.remove() });
			this.$('#ca_MDCMV0220_add').focus();
		},

		/**
		 * 編集領域すべて削除ボタン押下
		 */
		_onEditDelAllClick: function() {
			// 削除対象IDリストを取得する
			var idlist = [];
			var html_source = '';
			this.$('#ca_MDCMV0220_edit_tbl').html("");
			this.$('#innerScroll').perfectScrollbar('update');
		},

		/**
		 * テーブルに表示されている編集リストを取得する
		 */
		getEditList : function() {
			var editlist = [];
			editlist = clutil.tableview2data(this.$('#ca_MDCMV0220_edit_tbl').children());
			return editlist;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			this.validator.clear();
			var editlist = [];

			// 単一選択モード、分析画面ではない画面から呼び出された場合
			if (this.select_mode == clutil.cl_single_select ||
					this.isAnalyse_mode == false) {
				var chkId = [];
				$.each(this.$('#ca_MDCMV0220_tbody').find("[name=ca_MDCMV0220_chk]:checked"), function() {
					var tr = $(this).closest('tr');
					chkId.push(tr.get(0).id);
				});


				if (chkId.length > 0) {
					var selectlist = this.getData(chkId);

					for (var i = 0; i < selectlist.length; i++) {
						var select = selectlist[i];

						var newdata = {};
						newdata.val = select.store_id;
						newdata.code = select.code;
						newdata.name = select.name;
						// 種別を挿入する
						newdata.kind = amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_COUPON_STORE;

						editlist.push(newdata);
					}
					this.$parentView.show();
					this.okProc(editlist);
					this.$el.html('');
					clutil.leaveEnterFocusMode();
					clutil.enterFocusMode();
				} else {
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clmsg.ca_MDCMV0220_0001});
				}
			} else {
				// 編集リストを取得
				this.$parentView.show();
				this.okProc(this.getEditList());
				this.$el.html('');
				clutil.leaveEnterFocusMode();
				clutil.enterFocusMode();
			}
		},

		// 選択時処理  呼び出し側で override する
		okProc : function(){
			// 上位で上書きする。
		},

		/**
		 * キャンセル
		 */
		_onCancelClick: function() {
			this.$parentView.show();
			this.okProc(null);
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
		}
	});

});
