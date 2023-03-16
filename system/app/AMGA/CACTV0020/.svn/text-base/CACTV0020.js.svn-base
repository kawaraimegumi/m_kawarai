$(function(){

	// 黒帯ヘッダの「＜」戻るボタン戻り先設定
	if(clcom.pageArgs && clcom.pageArgs.homeUrl){
		clcom.homeUrl = clcom.pageArgs.homeUrl;
	}
	if(clcom.pageData && clcom.pageData.homeUrl){
		clcom.homeUrl = clcom.pageData.homeUrl;
	}

	//////////////////////////////////////////////
	// View
	var ListView = Backbone.View.extend({
		// 要素
		el						: $('#ca_main'),

		validator: null,

		// Eventes
		events: {
			"click #ca_search"		:	"_onSearchClick",		// 検索ボタン押下
			"click #searchAgain"	:	"_onSearchAgainClick",	// 検索条件を再指定ボタン押下
			"click #ca_clear"		:	"_onClearClick",		// クリアボタン押下

			"click th.ca_th_sort"	:	"_onThSortClick",	// テーブルヘッダ押下

			"click #ca_edit"		:	"_onEditClick",			// 編集ボタン押下
			"click #ca_anaproc"		:	"_onAnaProcClick",		// 分析実行ボタン押下
			"click #ca_anaproc_xls"	:	"_onAnaProcXlsClick",	// 分析実行ボタン押下
			"click #ca_anaproc_csv"	:	"_onAnaProcCsvClick",	// 分析実行ボタン押下
			"click #ca_sch"			:	"_onAnaScheduleClick",	// スケジュールを登録ボタン押下
			"click #ca_del"			:	"_onDelClick"			// 削除ボタン押下
		},

		initialize: function() {
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validatorWithTicker(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			// 分析カタログ名 - カウンタ
			this.catalogNameCounter = new clutil.view.InputCounter({
				$input: this.$('#ca_name'),
				className: 'wt280',
				noCounter: true,
				maxLength: clcom.domain.MtAnaCatalog.name.maxLen
			});

			// 作成者 - カウンタ
			this.creatorNameCounter = new clutil.view.InputCounter({
				$input: this.$('#ca_cre_staff_name'),
				className: 'wt280',
				noCounter: true,
				maxLength: clcom.domain.MtStaff.name.maxLen
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

			clutil.initcltypeselector($('#ca_f_open_div'), amcm_type.AMCM_TYPE_OPEN,
					1, null,
					{id : "ca_f_open", name : "info"}, "mbn wt280 flleft");

			// 検索条件を再指定ボタンを隠す
			this.srchArea = clutil.controlSrchArea(this.$('#ca_searchArea'),
					this.$('#ca_search'),
					this.$('#result'),
					this.$('#searchAgain'));

			// 結果状態をクリアする
			this.clearResult();

		},

		/**
		 * ページャーの初期化
		 * @param itemsOnPage
		 * @param totalCount
		 */
		initPager: function(pageNumber, itemsOnPage, totalCount) {
			var _this = this;
			this.$('#ca_pager1').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_pager_displaypanel1'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時
					_this.onPageClick(pageNumber, itemsOnPage, true);
				},
				onSelectChange: function(itemsOnPage) {
					// 表示件数変更時
					_this.onPageClick(1, itemsOnPage, true);
				}
			});
			this.$('#ca_pager2').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_pager_displaypanel2'),
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
		 * 画面描写
		 */
		render: function() {
			this.catalogNameCounter.render();
			this.creatorNameCounter.render();
			return this;
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus($('#ca_name'));
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// テーブルをクリア
			this.$('#ca_tbody').empty();
			// ソートキー初期化
			this.initSort();
			// ページャーの初期化
			this.initPager(1, clcom.itemsOnPage, 0);
			// validatorの初期化
			this.validator.clear();
			// 確定時用のデータを初期化
			this.resultList = [];
		},

		/**
		 * クリアボタン押下
		 */
		_onClearClick: function() {
			clutil.viewClear($('#ca_searchArea'));
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
			var sort_order = isAsc ? gs_proto_sort_req.GS_PROTO_SORT_ORDER_ASCENDING :
				gs_proto_sort_req.GS_PROTO_SORT_ORDER_DESCENDING;

			// ソートキー初期化
			this.initSort();

			// ソートキーを挿入
			this.req['sortreq'] = {
					sort_key : gsan_ct_catalog_srch_if['GSAN_PROTO_SORT_KEY_' + key],
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
			var th = $('#ca_tbl').find('th[key=' + sortreq.key + ']');
			if (sortreq.sort_order == gs_proto_sort_req.GS_PROTO_SORT_ORDER_ASCENDING) {
				$(th).addClass('sortAsc');
			} else {
				$(th).addClass('sortDsc');
			}
		},

		/**
		 * ソートキー初期化
		 */
		initSort: function() {
			$('th.ca_th_sort').removeClass('sortAsc');
			$('th.ca_th_sort').removeClass('sortDsc');
		},

		/**
		 * 検索ボタン click
		 */
		_onSearchClick: function(e) {
			if(!this.validator.valid()){
				return;
			}

			// 画面の情報を取得する
			var searchData = clutil.view2data($('#ca_searchArea'));
			this.req = {
					cond : searchData
			};

			this.onPageClick(1, clcom.itemsOnPage);

		},

		/**
		 * ページャー click
		 */
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
			var uri = 'gsan_ct_catalog_srch';
			clutil.postAnaJSON(uri, this.req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					_this.resultList = data.list;

					if (_this.resultList == null || _this.resultList.length == 0) {
						_this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
						$('#result').show();
					} else {

						var no = 1;	//表示番号セット
						// 取得したデータを表示する
						$.each(_this.resultList, function() {
							this.numList = no++;
							// 日付、時刻を表示用に変換
							this['cre_iymd_disp'] = clutil.dateFormat(this.cre_iymd, 'yyyy/mm/dd');
							this['cre_hhmm_disp'] = clutil.timeFormat(this.cre_hhmm, 'hh:mm');
						});

						$('#ca_tbody_tmp').tmpl(_this.resultList).appendTo('#ca_tbody');

						clutil.initUIelement($('#ca_tbl'));

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

						$('.contextmenu').contextmenu({
					        'ctrl':false,
					        'menu':{
					            '編集'		: 'ca_edit',
					            '削除'		: 'ca_del',
						        '分析を実行'	: 'ca_catalog',
						        '分析を実行してXLS出力'	: 'ca_catalog_xls',
						        '分析を実行してCSV出力'	: 'ca_catalog_csv',
						        'スケジュール登録・修正'	: 'ca_schedule'
					        },
					        'callback': _this.onClickContextmenu
					    });
					}
				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					// ページャーの初期化
					_this.initPager(1, itemsOnPage, 0);
				}
				if ($('#searchAgain').css('display') == 'none') {
					// 検索ボタンにフォーカスする
					$('#ca_search').focus();
				} else {
					// 再検索ボタンにフォーカスする
					$('#searchAgain').focus();
				}
			}, this));
		},

		/**
		 * コンテキストメニュー click
		 */
		onClickContextmenu: function(val, id) {
			var $tr = $('#ca_tbody').find('tr[id=' + id + ']');
			var is_upd = Number($tr.attr('is_upd'));

			switch (val) {
			case 'ca_edit' :
				this.showEditpage(am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD, id, is_upd);
				break;
			case 'ca_catalog' :
				this.showCatalogpage(id, null);
				break;
			case 'ca_catalog_xls' :
				this.showCatalogpage(id, "xls");
				break;
			case 'ca_catalog_csv' :
				this.showCatalogpage(id, "csv");
				break;
			case 'ca_schedule' :
				var ope_mode = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
				this.showSchpage(ope_mode, id, is_upd);
				break;
			case 'ca_del' :
				if (is_upd == 1) {
					//更新権限がある場合
					var obj = {
							tgt : $('#ca_del'),
							catalog_id : id
					};
					// 削除確認ダイアログを表示
					clutil.delConfirmDialog(this.delOkcallback, this.delCancelcallback, obj);
				} else {
					// 更新権限がない場合
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clmsg.del_false});
				}
				break;
			default:
				break;
			}
		},

		/**
		 * 分析実行ボタン click
		 */
		_onAnaProcClick: function(e) {
			// クリックされた行のIDを取得する
			var radio = this.$('#ca_tbody').find("[name=ca_chk]:checked");
			if (radio.length == 0) {
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clmsg.cl_select_required});
				return;
			}
			var tr = $(radio).closest('tr');
			var catalog_id = tr.get(0).id;
			this.showCatalogpage(catalog_id, null);
		},
		_onAnaProcXlsClick: function(e) {
			// クリックされた行のIDを取得する
			var radio = this.$('#ca_tbody').find("[name=ca_chk]:checked");
			if (radio.length == 0) {
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clmsg.cl_select_required});
				return;
			}
			var tr = $(radio).closest('tr');
			var catalog_id = tr.get(0).id;
			this.showCatalogpage(catalog_id, "xls");
		},
		_onAnaProcCsvClick: function(e) {
			// クリックされた行のIDを取得する
			var radio = this.$('#ca_tbody').find("[name=ca_chk]:checked");
			if (radio.length == 0) {
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clmsg.cl_select_required});
				return;
			}
			var tr = $(radio).closest('tr');
			var catalog_id = tr.get(0).id;
			this.showCatalogpage(catalog_id, "csv");
		},

		_onAnaScheduleClick: function(e) {
			console.log(e);
			// クリックされた行のIDを取得する
			var radio = this.$('#ca_tbody').find("[name=ca_chk]:checked");
			if (radio.length == 0) {
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clmsg.cl_select_required});
				return;
			}
			var tr = $(radio).closest('tr');
			var catalog_id = tr.get(0).id;
			var is_upd = Number($(tr).attr('is_upd'));
			var ope_mode = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
			this.showSchpage(ope_mode, catalog_id, is_upd);
		},

		/**
		 * スケジュール登録画面へ遷移する
		 */
		showSchpage : function(ope_mode, catalog_id, is_upd){
console.log("DEBUG: catalog_id[" + catalog_id + "]");
			if (catalog_id == null && ope_mode != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// エラー
				return;
			}
			var args = {
				homeUrl: clcom.homeUrl,//window.location.href,	// MD 追加。「＜」ボタンのホーム設定を本メニューへと向けさせる。
				ope_mode : ope_mode,
				catalog_id : catalog_id,
				is_upd : is_upd
			};
			// 画面の情報を取得する
			var searchData = clutil.view2data($('#ca_searchArea'));
			var data = {
				homeUrl: clcom.homeUrl,
				cond : searchData,
				req : this.req
			};

			clcom.pushPage(
				'../CACTV0050/CACTV0050.html',	// 遷移先url
				args,		// 画面引数
				data		// 保存データ
			);
		},

		// Idより選択されたデータを取得
		getData : function(chkId){
			for (var i = 0; i < this.resultList.length; i++) {
				var data = this.resultList[i];
				if (data.catalog_id == chkId) {
					return data;
					break;
				}
			}
			return null;
		},

		/**
		 * カタログを実行する
		 */
		showCatalogpage : function(catalog_id, directExec){
			var catalog = this.getData(catalog_id);
			if (catalog == null) {
				// エラー
				return;
			}
			var args = {
				homeUrl: clcom.homeUrl,	//window.location.href,	// MD 追加。「＜」ボタンのホーム設定を分析メニューへと向けさせる。
				func_id : catalog.func_id,
				func_code : catalog.func_code,
				catalog_id : catalog_id,
				catalog_name : catalog.catalog_name,
				f_anakind : catalog.f_anakind,
				anamenuitem_name: catalog.catalog_name,
				directExec: directExec
			};
			var pageData = null;//{ homeUrl: clcom.homeUrl };

			clcom.pushPage(clcom.appRoot + '/AMGA/' + catalog.func_code + '/' + catalog.func_code + '.html',
					args, pageData, null, true);
		},

		/**
		 * 編集ボタン click
		 */
		_onEditClick: function(e) {
			// クリックされた行のIDを取得する
			var radio = this.$('#ca_tbody').find("[name=ca_chk]:checked");
			if (radio.length == 0) {
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clmsg.cl_select_required});
				return;
			}
			var tr = $(radio).closest('tr');
			var catalog_id = tr.get(0).id;
			var is_upd = Number($(tr).attr('is_upd'));
			this.showEditpage(am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD, catalog_id, is_upd);
		},

		/**
		 * 登録画面へ遷移する
		 */
		showEditpage : function(ope_mode, catalog_id, is_upd){
console.log("DEBUG: catalog_id[" + catalog_id + "]");
			if (catalog_id == null && ope_mode != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// エラー
				return;
			}
			var args = {
				homeUrl: clcom.homeUrl,//window.location.href,	// MD 追加。「＜」ボタンのホーム設定を本メニューへと向けさせる。
				ope_mode : ope_mode,
				catalog_id : catalog_id,
				is_upd : is_upd
			};
			// 画面の情報を取得する
			var searchData = clutil.view2data($('#ca_searchArea'));
			var data = {
				homeUrl: clcom.homeUrl,
				cond : searchData,
				req : this.req
			};

			clcom.pushPage(
				'../CACTV0030/CACTV0030.html',	// 遷移先url
				args,		// 画面引数
				data		// 保存データ
			);
		},

		/**
		 * 削除ボタン click
		 */
		_onDelClick: function(e) {
			// クリックされた行のIDを取得する
			var radio = this.$('#ca_tbody').find("[name=ca_chk]:checked");
			if (radio.length == 0) {
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clmsg.cl_select_required});
				return;
			}
			var tr = $(radio).closest('tr');
			var catalog_id = tr.get(0).id;
			var is_upd = Number($(tr).attr('is_upd'));

			if (is_upd == 1) {
				// 更新権限がある場合
				var obj = {
						tgt : $(e.target),
						catalog_id : catalog_id
				}
				// 削除確認ダイアログを表示
				clutil.delConfirmDialog(this.delOkcallback, this.delCancelcallback, obj);
			}
			else {
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clmsg.del_false});
			}
		},

		/**
		 * 削除確認ダイアログよりCancelで戻る
		 */
		delCancelcallback: function(obj) {
			obj.tgt.focus();
			return;
		},

		/**
		 * 削除確認ダイアログよりOKで戻る
		 */
		delOkcallback: function(obj) {
			var _this = this;

			var req = {
					rtype : am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL,
					catalog : {
						id : obj.catalog_id
					}
			};

			var uri = 'gsan_ct_catalog_upd';
			clutil.postAnaJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					var menustore = clcom.getMenuStore();
					if(menustore != null) {
						// カタログ更新フラグを立てる
						menustore.catalog_upd = true;
						clcom.setMenuStore(menustore);
					}

					// 削除完了ダイアログを出す
					clutil.delMessageDialog(_this.delConfirmcallback);

				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}
			}, this));
		},

		/**
		 * 削除完了ダイアログよりOKで戻る
		 */
		delConfirmcallback: function() {
			// 再表示
			this.clearResult();
			this.onPageClick(this.pageNumber, clcom.itemsOnPage);
		}
	});

	listView = new ListView();
	listView.render();

	// 初期データを取る
	clutil.getIniJSON(null, null, _.bind(function(data, dataType) {
		//////////////////////////////////////////////
		// ヘッダー部品
		headerView = new HeaderView();
		headerView.render(function(){
			// 区分selectorを初期化する
			listView.initUIelement();
			listView.setFocus();

			// 編集画面から戻ってきた場合
			if(clcom.pageData != null){
				listView.req = clcom.pageData.req;
				var cond = clcom.pageData.cond;
				clutil.data2view(listView.$('#ca_searchArea'), cond);

				if (listView.req != null) {
					listView.onPageClick(1, clcom.itemsOnPage);
				}
			}
		});
		//////////////////////////////////////////////
	},this)).done(function(){
		// スクロール表示の微調整
		ch_height();
		var sc = $('html').css('overflow-y');
		if(sc == 'scroll'){
			$('html').css('overflow-y', 'auto');
			_.defer(function(sc){
				$('html').css('overflow-y', sc);
			}, sc);
		}
	});
});
