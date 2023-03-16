$(function() {

	//////////////////////////////////////////////
	// View
	CACMV0250SelectorView = Backbone.View.extend({

		screenId : "CACMV0250",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_CACMV0250_search"		:	"_onSearchClick",		// 検索ボタン押下
			"click #searchAgain"				:	"_onSearchAgainClick",	// 検索条件を再指定ボタン押下

			"click #ca_CACMV0250_clear"			:	"_onClearClick",		// クリアボタン押下
			"click #ca_CACMV0250_commit"		:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_CACMV0250_main th.ca_th_sort"	:	"_onThSortClick",	// テーブルヘッダ押下

			"click #ca_CACMV0250_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_CACMV0250_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
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
				this.$('.ca_CACMV0250_multi').remove();
				this.$('#ca_CACMV0250_chkall').remove();
			}

			clutil.initUIelement(this.$el);

			// 全選択チェックボックスを初期化
			this.chkall = clutil.checkallbox(this.$('#ca_CACMV0250_chkall'),
					this.$('#ca_CACMV0250_tbl'),
					this.$('#ca_CACMV0250_tbody')
					);

			// 分析画面以外からのモード
			if (this.isAnalyse_mode == false) {
				this.$('.ca_CACMV0250_multi').remove();
				this.$('#mainColumninBox').addClass('noLeftColumn');
				this.$('#mainColumnFooter').addClass('noLeftColumn');
			} else {
				this.$('#mainColumnFooter').addClass('analytics');
			}

			// 検索条件を再指定ボタンを隠す
			this.srchArea = clutil.controlSrchArea(this.$('#ca_CACMV0250_searchArea'),
					this.$('#ca_CACMV0250_search'),
					this.$('#result'),
					this.$('#searchAgain'));

			// 公開区分
			clutil.initcltypeselector($('#ca_CACMV0250_f_open_div'), gsdb_defs.MTTYPETYPE_F_OPEN,
					1, null,
					{id : "ca_CACMV0250_f_open", name : "info"}, "mbn wt280 flleft");

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
			this.$('#ca_CACMV0250_pager1').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_CACMV0250_pager_displaypanel1'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時
					_this.onPageClick(pageNumber, itemsOnPage, true);
				},
				onSelectChange: function(itemsOnPage) {
					// 表示件数変更時
					_this.onPageClick(1, itemsOnPage, true);
				}
			});
			this.$('#ca_CACMV0250_pager2').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_CACMV0250_pager_displaypanel2'),
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

		show: function(isSubDialog) {

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
			this.validator = clutil.validator(this.$('#ca_CACMV0250_main'), {
				echoback		: $('.cl_echoback')
			});

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
			clutil.setFocus(this.$('#ca_CACMV0250_name'));
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
					sort_key : gsan_sg_cond_srch_if['GSAN_PROTO_SORT_KEY_' + key],
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
			var th = this.$('#ca_CACMV0250_tbl').find('th[key=' + sortreq.key + ']');
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

			// 画面の情報を取得する
			var searchData = clutil.view2data(this.$('#ca_CACMV0250_searchArea'), 'ca_CACMV0250_');
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

			// 結果状態をクリアする
			this.clearResult();

			var index = itemsOnPage * (pageNumber - 1);
			var pagedata = {
				start_record : index,			// index番目のデータから(0～)
				page_size : itemsOnPage			// 1ページに表示する件数を要求
			};

			this.req.pagereq = pagedata;

			// データを取得
			var uri = 'gsan_sg_cond_srch';
			clutil.postAnaJSON(uri, this.req, _.bind(function(data, dataType) {
				if (data.head.status == gs_proto_defs.GS_PROTO_COMMON_RSP_STATUS_OK) {

					this.resultList = data.list;

					if (this.resultList == null || this.resultList.length == 0) {
						this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
					} else {

						var no = 1;	//表示番号セット
						// 取得したデータを表示する
						$.each(this.resultList, function() {
							this.numList = no++;
							// 日付、時刻を表示用に変換
							this['cre_iymd_disp'] = clutil.dateFormat(this.cre_iymd, 'yyyy/mm/dd');
							this['cre_hhmm_disp'] = clutil.timeFormat(this.cre_hhmm, 'hh:mm');
						});

						// 選択モード（nullの場合は単一選択）
						switch (this.select_mode) {
						case clutil.cl_multiple_select:
							$select_template = this.$('#ca_CACMV0250_tbody_multiple_tmp');
							break;
						case clutil.cl_single_select:
						default:
							$select_template = this.$('#ca_CACMV0250_tbody_single_tmp');
							break;
						}
						// 取得したデータを表示する
						$select_template.tmpl(this.resultList).appendTo('#ca_CACMV0250_tbody');

						clutil.initUIelement(this.$('#ca_CACMV0250_tbl'));

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
					this.$('#ca_CACMV0250_search').focus();
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
			this.$('#ca_CACMV0250_tbody').empty();
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
			clutil.viewClear(this.$('#ca_CACMV0250_searchArea'));
			// validatorの初期化
			this.validator.clear();
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function() {
			this.srchArea.show_srch();
		},

		// Idより選択されたデータを取得
		getData : function(chkId){
			var selectData = [];
			for (var i = 0; i < this.resultList.length; i++) {
				var data = this.resultList[i];
				for (var j = 0; j < chkId.length; j++) {
					var selectId = chkId[j];
					if (data.cond_id == selectId) {
						selectData.push(data);
						break;
					}
				}
			}
			return selectData;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			this.validator.clear();
			var editlist = [];

			var chkId = [];
			$.each(this.$('#ca_CACMV0250_tbody').find("[name=ca_CACMV0250_chk]:checked"), function() {
				var tr = $(this).closest('tr');
				chkId.push(tr.get(0).id);
			});

			if (chkId.length > 0) {
				var selectlist = this.getData(chkId);

				for (var i = 0; i < selectlist.length; i++) {
					var select = selectlist[i];

					var newdata = {};
					newdata.val = select.cond_id;
					newdata.code = select.code;
					newdata.name = select.name;

					editlist.push(newdata);
				}
				this.$parentView.show();
				this.okProc(editlist);
				this.$el.html('');
				clutil.leaveEnterFocusMode();
				clutil.enterFocusMode();
			} else {
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clmsg.ca_CACMV0250_0001});
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
