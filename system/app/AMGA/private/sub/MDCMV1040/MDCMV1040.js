$(function() {

	//////////////////////////////////////////////
	// View
	MDCMV1040SelectorView = Backbone.View.extend({

		screenId : "MDCMV1040",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_MDCMV1040_search"					:	"_onSearchClick",		// 検索ボタン押下
			"click #searchAgain"							:	"_onSearchAgainClick",	// 検索条件を再指定ボタン押下
			"click #ca_MDCMV1040_add"						:	"_onAddClick",			// 追加ボタン押下

			"click .ca_MDCMV1040_edit_del"					:	"_onEditDelClick",		// 単一削除ボタン押下

			//			"click #ca_MDCMV1040_main .ca_MDCMV1040_tr"		:	"_onTrClick",			// テーブル行選択
			"click #ca_MDCMV1040_clear"						:	"_onClearClick",		// クリアボタン押下
			"click #ca_MDCMV1040_commit"					:	"_onCommitClick",		// 確定ボタン押下

			"change #ca_MDCMV1040_elem_func"				:	"_onElemFuncSelect",	// 種別変更
//			"keyup #ca_MDCMV1040_elem_func"					:	"_onElemFuncSelect",	// 種別変更
//			"keydown #ca_MDCMV1040_elem_func"				:	"_onElemFuncSelect",	// 種別変更

			"click #ca_MDCMV1040_main th.ca_th_sort"		:	"_onThSortClick",				// テーブルヘッダ押下

			"click #ca_MDCMV1040_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_MDCMV1040_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_MDCMV1040_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
		},

		/**
		 * 引数
		 * ・$parentView		: 親画面のjQueryオブジェクト (例：$('#ca_main'))
		 * ・$dialog_main		: 自身のjQueryオブジェクト (例：$('#ca_MDCMV1040_dialog'))
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

			clutil.inputlimiter(this.$el);

			// 分析画面以外からのモード
			if (this.isAnalyse_mode == false) {
				this.$('.ca_MDCMV1030_multi').remove();
				this.$('#mainColumninBox').addClass('noLeftColumn');
				this.$('#mainColumnFooter').addClass('noLeftColumn');
			} else {
				this.$('#mainColumnFooter').addClass('analytics');
			}

			if (this.isAnalyse_mode && this.select_mode != clutil.cl_single_select){
				// 条件表示エリアの設定
				this.addtoSelected = clutil.addtoSelected(
						this.$('#ca_MDCMV1040_add'),
						this.$('#selected'),
						this.$('#mainColumn'));
			}

			// 検索条件を再指定ボタンを隠す
			this.srchArea = clutil.controlSrchArea(this.$('#ca_MDCMV1040_searchArea'),
					this.$('#ca_MDCMV1040_search'),
					this.$('#result'),
					this.$('#searchAgain'));

			this.isEdit_id = null;
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 * コンボボックスの作成
		 */
		initTypeSelector: function() {
			clutil.cltypeselector(this.$('#ca_MDCMV1040_f_open'), amcm_type.AMCM_TYPE_OPEN, 1);
			clutil.cltypeselector2(this.$('#ca_MDCMV1040_elem_func'), this.funclist, 1,
					null,
					'func_id', 'func_name', 'func_code');
			clutil.initcltypeselector2(
					$('#ca_MDCMV1040_elem_lvl_div'), null, 1, null,
					null, null, null,
					{id : "ca_MDCMV1040_elem_lvl", name : "info"}, "mbn wt280 flleft");

			clutil.initUIelement(this.$el);
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
			},this));

			return this;
		},

		/**
		 * ページャーの初期化
		 * @param itemsOnPage
		 * @param totalCount
		 */
		initPager: function(pageNumber, itemsOnPage, totalCount) {
			var _this = this;
			this.$('#ca_MDCMV1040_pager1').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_MDCMV1040_pager_displaypanel1'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時
					_this.onPageClick(pageNumber, itemsOnPage, true);
				},
				onSelectChange: function(itemsOnPage) {
					// 表示件数変更時
					_this.onPageClick(1, itemsOnPage, true);
				}
			});
			this.$('#ca_MDCMV1040_pager2').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_MDCMV1040_pager_displaypanel2'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時
					_this.onPageClick(pageNumber, itemsOnPage, true);
				},
				onSelectChange: function(itemsOnPage) {
					// 表示件数変更時
					_this.onPageClick(1, itemsOnPage, true);
				}
			});
		},

		/**
		 * ページャーの初期化（要素リスト）
		 * 一旦使用中止
		 * @param itemsOnPage
		 * @param totalCount
		 */
		initElemPager: function(pageNumber, itemsOnPage, totalCount) {
			var _this = this;
			this.$('#ca_MDCMV1040_elem_pager').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_MDCMV1040_elem_pager_displaypanel'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時
					_this.onPageElemClick(pageNumber, itemsOnPage, true);
				}
			});
		},


		show: function(editList, isSubDialog) {
			var _this = this;

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
			this.validator = clutil.validator(this.$('#ca_MDCMV1040_main'), {
				echoback		: $('.cl_echoback')
			});


			// 初期情報を取得する
			var req = {
					cond : {
						f_genlist : am_proto_defs.AMDB_DEFS_F_GENLIST_STORE,
						srch_iymd : clutil.getMstSrchDate(this.isAnalyse_mode, this.anaProc, 'org')
					}
			};

			// データを取得
			var uri = 'gsan_cm_genlist_init';
			clutil.postAnaJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					this.funclist = data.func_list;
					this.lvllist = data.lvl_list;

					this.levelList = {
						0 : []
					};

					// 種別から階層リストを作成する
					for (var i = 0; i < this.funclist.length; i++) {
						var func = this.funclist[i];
						this.levelList[func.func_id] = [];
					}
					for (var i = 0; i < this.lvllist.length; i++) {
						var lvl = this.lvllist[i];
						this.levelList[lvl.lvl_func_id].push(lvl);
					}

					// 編集データがある場合
					if (editList != null && editList.length > 0) {
						var html_source = '';
						for (var i = 0; i < editList.length; i++) {
							if (i == editList.length) {
								break;
							}
							html_source += this.makeEditTmp(editList[i]);
						}
						this.$('#ca_MDCMV1040_edit_tbl').html(html_source);
						// サーバーに検索
						this.isEdit_id = editList[0].val;
						this.req = {
								cond : {
									genlist_id : this.isEdit_id
								}
						};
						//結果表示(ページャー)
						this.onPageClick(1, clcom.itemsOnPage);
					} else if (this.addtoSelected != null) {
						this.addtoSelected.right_side_hide();
					}

					clutil.leaveEnterFocusMode();
					clutil.enterFocusMode({
						view : this.$el
					});

				} else {
//					// ヘッダーにメッセージを表示
//					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}

				// コンボボックスの作成
				this.initTypeSelector();

				// フォーカスの設定
				this.setFocus();

			}, this));
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus(this.$('#ca_MDCMV1040_elem_func'));
		},

		/**
		 * 種別変更
		 */
		_onElemFuncSelect: function(e) {
			var func_id = $(e.target).val();

			clutil.initcltypeselector2(
					$('#ca_MDCMV1040_elem_lvl_div'),this.levelList[func_id], 1, null,
					'lvl_id', 'lvl_name', 'lvl_code',
					{id : "ca_MDCMV1040_elem_lvl", name : "info"}, "mbn wt280 flleft");
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
					sort_key : gsan_cm_genlist_srch_if['GSAN_PROTO_SORT_KEY_' + key],
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
			var th = this.$('#ca_MDCMV1040_tbl').find('th[key=' + sortreq.key + ']');
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
			// 編集データをクリアする
			if (this.isEdit_id != null) {
				this.isEdit_id = null;
			}
			// 画面の情報を取得する
			var searchData = clutil.view2data(this.$('#ca_MDCMV1040_searchArea'), 'ca_MDCMV1040_');
			searchData['f_genlist'] = am_proto_defs.AMDB_DEFS_F_GENLIST_STORE;
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
			var uri = 'gsan_cm_genlist_srch';
			clutil.postAnaJSON(uri, this.req, _.bind(function(data, dataType) {
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
							// 日付、時刻を表示用に変換
							this['upd_iymd_disp'] = clutil.dateFormat(this.upd_iymd, 'yyyy/mm/dd');
							this['upd_time_disp'] = clutil.timeFormat(this.upd_time, 'hh:mm');
						});
						_this.$('#ca_MDCMV1040_tbody_tmp').tmpl(_this.resultList).appendTo('#ca_MDCMV1040_tbody');

						// ラジオボタンの初期化
						clutil.initUIelement(_this.$('#ca_MDCMV1040_tbl'));

						// 検索ボタン押下時は検索条件エリアを閉じる
						if (!isPager) {
							_this.srchArea.show_result();
						}

						// 総レコード数
						var totalRec = data.pagersp.total_record;
						// ページャーの初期化
						_this.initPager(pageNumber, itemsOnPage, totalRec);

						// ヘッダソートが存在すればマークを付加する
						_this.setSort(_this.req);

						// 遷移元画面より編集データが渡された場合
						if (_this.isEdit_id != null) {
							var tr = _this.$('#ca_MDCMV1040_tbl tr[id=' + _this.isEdit_id + ']')
							$(tr).find('[data-toggle="radio"]').radio('check');
//							tr.addClass('ca_MDCMV1040_select');
//							tr.css('background-color', 'yellow');

//							// リストIDを設定
//							_this.elemreq = {
//									cond : {
//										genlist_id : _this.isEdit_id,
//										f_genlist : am_proto_defs.AMDB_DEFS_F_GENLIST_STORE
//									}
//							};
//
//							// 結果表示(ページャー)
//							_this.onPageElemClick(1, clcom.itemsOnPage);
						}
					}

				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					// ページャーの初期化
					_this.initPager(1, itemsOnPage, 0);
				}
					if (_this.$('#searchAgain').css('display') == 'none') {
						// 検索ボタンにフォーカスする
						_this.$('#ca_MDCMV1040_search').focus();
					} else {
						// 再検索ボタンにフォーカスする
						_this.$('#searchAgain').focus();
					}

			}, this));
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// テーブルをクリア
			this.$('#ca_MDCMV1040_tbody').empty();
			// ソートキー初期化
			this.initSort();
			// ページャーの初期化
			this.initPager(1, clcom.itemsOnPage, 0);
			// validatorの初期化
			this.validator.clear();
			// 確定時用のデータを初期化
			this.resultList = [];
//			// 要素テーブルをクリア
//			$('#ca_MDCMV1040_elem_tbody').empty();
		},

		/**
		 * 結果のクリア（要素）
		 * 一旦使用中止
		 */
		clearElemResult: function() {
			// テーブルをクリア
			this.$('#ca_MDCMV1040_elem_tbody').empty();
			// validatorの初期化
			this.validator.clear();
		},

		/**
		 * クリアボタン押下
		 */
		_onClearClick: function() {
			// 階層リストはクリアしておく
			$('#ca_MDCMV1040_elem_lvl_div').html('');

			clutil.viewClear(this.$('#ca_MDCMV1040_searchArea'));
			// validatorの初期化
			this.validator.clear();
		},

		/**
		 * 検索条件を再指定押下
		 */
		_onSearchAgainClick:function() {
			this.srchArea.show_srch();
		},

		/**
		 * 行選択
		 * 一旦使用中止
		 */
		_onTrClick:function(e) {
			var tr = $(e.target).closest('tr');
			// 既に選択されている場合はなにもしない
			if (tr.hasClass('ca_MDCMV1040_select')) {
				return;
			}
			this.$('#ca_MDCMV1040_tbl tr.ca_MDCMV1040_select').css('background-color', '');
			this.$('#ca_MDCMV1040_tbl tr.ca_MDCMV1040_select').removeClass('ca_MDCMV1040_select');

			tr.addClass('ca_MDCMV1040_select');
			tr.css('background-color', 'yellow');

			// リストIDを設定
			this.elemreq = {
					cond : {
						genlist_id : tr.get(0).id,
						f_genlist : am_proto_defs.AMDB_DEFS_F_GENLIST_STORE
					}
			};

			// 結果表示(ページャー)
			this.onPageElemClick(1, clcom.itemsOnPage);
		},

		// ページャークリック 一旦使用中止
		onPageElemClick: function(pageNumber, itemsOnPage, isPager) {
			var _this = this;

			// 結果状態をクリアする
			this.clearElemResult();

			var index = itemsOnPage * (pageNumber - 1);
			var pagedata = {
					start_record : index,			// index番目のデータから(0～)
					page_size : itemsOnPage			// 1ページに表示する件数を要求
			};

			this.elemreq.pagereq = pagedata;

			// データを取得
			var uri = 'gsan_cm_genlist_get';
			clutil.postAnaJSON(uri, this.elemreq, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					var genlist = data.genlist;

					if (genlist != null) {
						var resultElemList = genlist.elem;

						if (resultElemList == null || resultElemList.length == 0) {
							_this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
						} else {

							var no = 1;	//表示番号セット
							// 取得したデータを表示する
							$.each(resultElemList, function() {
								this.numList = no++;
							});
							_this.$('#ca_MDCMV1040_elem_tbody_tmp').tmpl(resultElemList).appendTo('#ca_MDCMV1040_elem_tbody');

							// 総レコード数
							var totalRec = data.pagersp.total_record;
							// ページャーの初期化
							_this.initElemPager(pageNumber, itemsOnPage, totalRec);
						}
					}

				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					// ページャーの初期化
					_this.initElemPager(1, itemsOnPage, 0);
				}

				if (_this.$('#ca_MDCMV1040_showSearchArea').css('display') == 'none') {
					// 検索ボタンにフォーカスする
					_this.$('#ca_MDCMV1040_search').focus();
				} else {
					// 検索条件を再指定ボタンにフォーカスする
					_this.$('#ca_MDCMV1040_showSearchArea').focus();
				}
			}, this));
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
			$.each(this.$('#ca_MDCMV1040_tbody').find("[name=ca_MDCMV1040_chk]:checked"), function() {
				var tr = $(this).closest('tr');
				chkId.push(tr.get(0).id);
			});

			if (chkId.length > 0) {
				var selectlist = this.getData(chkId);

				var html_source = '';

				for (var i = 0; i < selectlist.length; i++) {
					var select = selectlist[i];

					var newdata = {};
					newdata.val = select.genlist_id;
//					newdata.code = select.code;
					newdata.name = select.name;
					// 種別を挿入する
					newdata.kind = amgbp_AnaDefs.AMGBA_DEFS_KIND_STORELIST;

					html_source += this.makeEditTmp(newdata);
				}
				// 編集領域を上書きする
				this.$('#ca_MDCMV1040_edit_tbl').html();
				this.$('#ca_MDCMV1040_edit_tbl').html(html_source);
			} else {
				// なにもしない
			}
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
					if (data.genlist_id == selectId) {
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
			if (!clutil.chkStr(data.code)) {
				data.code = "";
			}
			html_source += '<li id="' + data.val + '"><span>' + data.name + '</span><span class="code">';
			html_source += '</span><span class="btn-delete ca_MDCMV1040_edit_del"></span>'
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
			this.$('#ca_MDCMV1040_add').focus();
		},

		/**
		 * テーブルに表示されている編集リストを取得する
		 */
		getEditList : function() {
			var editlist = [];
			editlist = clutil.tableview2data(this.$('#ca_MDCMV1040_edit_tbl').children());
			return editlist;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			this.validator.clear();

			var editlist = [];

			// 編集リストを取得
			this.$parentView.show();
			this.okProc(this.getEditList());
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
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
