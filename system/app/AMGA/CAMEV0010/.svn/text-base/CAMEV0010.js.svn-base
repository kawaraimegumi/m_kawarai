$(function(){

	// 黒帯ヘッダの「＜」戻るボタン戻り先設定
	if(clcom.pageArgs && clcom.pageArgs.homeUrl){
		clcom.homeUrl = clcom.pageArgs.homeUrl;
	}

	//////////////////////////////////////////////
	// View
	var ListView = Backbone.View.extend({
		// 要素
		el						: $('#ca_main'),

		validator: null,

		// Eventes
		events: {
			"change #ca_elem_func"	:	"_onElemFuncSelect",		// 組織種別変更

			"click .editable span.edit"				:	"_onEditSpanClick",		// テーブル上でリスト名編集
			'blur #ca_tbl input[name="name"]' : function(e){					// テーブル上でリスト名編集エディタを刈り取る
				this.removeNameEdit();
			},
			"keydown .editable input[type=text]"	:	"_onEditSpanKeyPress",	// テーブル上でリスト名編集確定

			"click #ca_search"		:	"_onSearchClick",		// 検索ボタン押下
			"click #searchAgain"	:	"_onSearchAgainClick",	// 検索条件を再指定ボタン押下

			"click th.ca_th_sort"	:	"_onThSortClick",	// テーブルヘッダ押下

			"click #ca_entry"		:	"_onEntryClick",	// 新規作成ボタン押下
			"click #ca_edit"		:	"_onEditClick",		// 編集ボタン押下
			"click #ca_copy"		:	"_onCopyClick",		// 複製ボタン押下
			"click #ca_del"			:	"_onDelClick",		// 削除ボタン押下
			"click #ca_clear"		:	"_onClearClick"		// クリアボタン押下
		},



		initialize: function() {
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validatorWithTicker(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			// 店舗リスト名 - カウンタ
			this.listNameCounter0 = new clutil.view.InputCounter({
				$input: this.$('#ca_name'),
				className: 'wt280',
				noCounter: true,
				maxLength: clcom.domain.MtGenList.name.maxLen
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			var _this = this;

			clutil.inputlimiter(this.$el);

			//公開区分と階層種別selector作成
			clutil.initcltypeselector($('#ca_div_f_open'),
					amcm_type.AMCM_TYPE_OPEN,
					1, null,
					{id : "ca_f_open", name : "info"}, "mbn wt280 flleft");

			clutil.initcltypeselector2(
					$('#ca_div_elem_func'), this.funclist, 1, null,
					'func_id', 'func_name', 'func_code',
					{id : "ca_elem_func", name : "info"}, "mbn wt280 flleft");

			//階層レベルselector作成(階層種別によって内容変化)
			var func_id = $('#ca_elem_func').val();
			clutil.initcltypeselector2(
					$('#ca_div_elem_lvl'), this.levelList[func_id], 1, null,
					'lvl_id', 'lvl_name', 'lvl_code',
					{id : "ca_elem_lvl", name : "info"}, "mbn wt280 flleft");

			// 検索条件を再指定ボタンを隠す
			this.srchArea = clutil.controlSrchArea(this.$('#ca_searchArea'),
					this.$('#ca_search'),
					this.$('#result'),
					this.$('#searchAgain'));

			// 結果状態をクリアする
			this.clearResult();

		},

		/**
		 * 画面描写
		 */
		render: function() {
			this.listNameCounter0.render();
			return this;
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			clutil.setFocus($('#ca_elem_func'));
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
		 * 種別変更
		 */
		_onElemFuncSelect: function(e) {
			//階層種別によって階層レベルを入れ替える
			var func_id = $(e.target).val();
			clutil.initcltypeselector2(
					$('#ca_div_elem_lvl'), this.levelList[func_id], 1, null,
					'lvl_id', 'lvl_name', 'lvl_code',
					{id : "ca_elem_lvl", name : "info"}, "mbn wt280 flleft");
		},

		/**
		 * リスト名編集
		 */
		_onEditSpanClick: function(e) {
			var _this = this;

			// クリックされた行のIDを取得する
			var tr = $(e.target).closest('tr');
			var genlist_id = tr.get(0).id;
			var is_upd = $(tr).attr('is_upd');


			//編集権限がある場合
			if(is_upd == "1") {
				//一度テーブル全体の編集セルモードを解除
				_this.removeNameEdit();

				//編集前のリスト名文字列取得
				var data = $(e.target).parent().find('.data').text();

				//リスト名確認エリアに保存しておく
				$("#ca_chk_name").val(data);
				$("#ca_change_id").val(genlist_id);

				//押下したセルのみを編集モードへ
				var $input = $(e.target).parent().find('input');
				$input.val(data);
				$(e.target).parent().find('span').hide();
				$(e.target).parent().addClass('pdg0');
				$input.show();
				this.listNameCounter = new clutil.view.InputCounter({
					$input: $input,
					maxLength: clcom.domain.MtAnaCatalog.name.maxLen
				}).render();
				this.listNameCounter.showCounter();
				$input.focus();
			}
			else {
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clmsg.is_upd_false});
				return this;
			}
		},


		/**
		 *
		 * リスト名編集確定
		 */
		_onEditSpanKeyPress: function(e, ev) {
			var _this = this;

			var key = e.which ? e.which : e.keyCode;

			if (key == 13) {
				//エンターが押下されたら実行
				//変更前後のリスト名を取得
				var afterName = $("#ca_tbl").find('.pdg0').find('.ca_after_name').val();
				var beforeName = $("#ca_chk_name").val();


				//変更するリストid取得
				var tr = $("#ca_tbl").find('.pdg0').parent();
				var genlist_id = tr.get(0).id;

				if(afterName != beforeName) {
					if(this.listNameCounter && this.listNameCounter.getCounterState() != 'normal'){
						// アラートメッセージは既に表示中のはず。
						this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
						return;
					}
					if (clutil.chkzen2han(afterName) == -1){
						this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
						this.validator.setErrorMsg($("#ca_tbl").find('.pdg0').find('.ca_after_name'), clmsg.cl_input);
						return;
					}
					if(clutil.chkStr(afterName)) {
						// イベントリセット
						e.preventDefault();

						// spanを変更後の値に書き換える
						var span = $(e.target).closest('td.editable').find('span.data');
						$(span).html(afterName);

						//ok押下時用にidとリスト名を渡す
						var obj = {
								id : genlist_id,
								name : afterName,
								$span : $(span),
								beforeName : beforeName
						}

						//リスト名が変更されていたら登録確認ダイアログ
						clutil.updConfirmDialog(this.updOkcallback, this.updCancelcallback, obj);
					} else {
						//文字がなければ編集モード解除
						this.removeNameEdit();

//						//変更後のリスト名に文字がなかったらバリデーター
//						_this.validator.setErrorMsg($(".pdg0").find(".ca_after_name"), clmsg.cl_required);
//						_this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
//						_this.validator.setErrorMsg($(".pdg0").find(".ca_after_name"), clmsg.cl_required);
					}
				}
				else {
					//変更されなかったら編集モード解除
					this.removeNameEdit();
					//フォーカスの設定をしたい?
//					$("#ca_edit").focus();
				}
			}
			else if(key == 9) {
				//タブが押下されたら編集モード解除
				this.removeNameEdit();
				$("#ca_edit").focus();
			}
		},

		/**
		 * リスト名編集モード解除
		 */
		removeNameEdit: function() {
			// リスト名編集バリデーター解除
			this.validator.clear();

			if(this.listNameCounter){
				_.defer(function(listNameCounter){
					listNameCounter.destroy();
				}, this.listNameCounter);
				this.listNameCounter = null;
			}

			$('.editable').removeClass('pdg0');
			$('.editable').find('input').hide();
			$('.editable').find('span').show();
		},


		/**
		 * 登録確認ダイアログよりCancelで戻る
		 */
		updCancelcallback: function(obj) {
			// キャンセルの場合は変更前の値に戻す
			if (obj.$span != null) {
				obj.$span.html(obj.beforeName);
			}

			//セルの編集モード解除
			this.removeNameEdit();

			$("#ca_edit").focus();

			return;
		},

		/**
		 * 登録確認ダイアログよりOKで戻る
		 */
		updOkcallback: function(obj) {
			var _this = this;

			var genlist_id = obj.id;
			var afterName = obj.name;


			// リストデータ取得
			var uri = 'gsan_cm_genlist_get';
			var get_req = {
					cond : {
						genlist_id : genlist_id,
						f_genlist : am_proto_defs.AMDB_DEFS_F_GENLIST_STORE
					}
			};

			clutil.postAnaJSON(uri, get_req, _.bind(function(data, dataType) {
				var _this = this;

				//セルの編集モード解除
				_this.removeNameEdit();

				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					var appdata = data.genlist;
					if (appdata != null) {
						var resultdata = appdata;

						//リスト名変更
						resultdata.name = afterName;

						//リストデータ更新
						var upd_req = {
								rtype : am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
								genlist : resultdata
						};

						var uri = 'gsan_cm_genlist_upd';
						clutil.postAnaJSON(uri,  upd_req, _.bind(function(data, dataType) {
							if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
								// 更新完了ダイアログを出す
								clutil.updMessageDialog(_this.updConfirmcallback);

							} else {
								// ヘッダーにメッセージを表示
								_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
							}
						}, this));

					}
					else {
						// エラーの場合は変更前の値に戻す
						if (obj.$span != null) {
							obj.$span.html(obj.beforeName);
						}
						// ヘッダーにメッセージを表示
						_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					}
				}
				else {
					// エラーの場合は変更前の値に戻す
					if (obj.$span != null) {
						obj.$span.html(obj.beforeName);
					}
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}

			}, this));

		},

		/**
		 * 更新完了ダイアログよりOKで戻る
		 */
		updConfirmcallback: function() {
			// 再表示
			this.clearResult();
			this.onPageClick(1, clcom.itemsOnPage);
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
			var th = $('#ca_tbl').find('th[key=' + sortreq.key + ']');
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

			//リスト種別設定
			searchData.f_genlist = am_proto_defs.AMDB_DEFS_F_GENLIST_STORE;

			this.req = {
					cond : searchData
			};

			// 結果状態をクリアする
			this.clearResult();

			this.onPageClick(1, clcom.itemsOnPage);
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function() {
			/**
			 * 10/16確認
			 *
			 * 検索後に[再指定]でもう一度検索領域を出すと、領域がずれるバグ
			 * マトリクス分析中のCUCMV0040でも同様のバグあり
			 */

			// validatorの初期化
			this.validator.clear();

			//検索条件エリア表示
			this.srchArea.show_srch();
		},


		/**
		 * ページャーの初期化
		 * @param itemsOnPage
		 * @param totalCount
		 */
		initPager: function(pageNumber, itemsOnPage, totalCount) {
			var _this = this;

			//上ページャーの設定
			this.$('#ca_pager1').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_pager_displaypanel1'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時関数
					_this.onPageClick(pageNumber, itemsOnPage, true);
				},
				onSelectChange: function(itemsOnPage) {
					// 表示件数変更時
					_this.onPageClick(1, itemsOnPage, true);
				}
			});

			//下ページャーの設定
			this.$('#ca_pager2').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_pager_displaypanel2'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時関数
					_this.onPageClick(pageNumber, itemsOnPage, true);
				},
				onSelectChange: function(itemsOnPage) {
					// 表示件数変更時
					_this.onPageClick(1, itemsOnPage, true);
				}
			});
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

					//サーバーから帰ってきたリスト一覧を変数に代入
					_this.resultList = data.list;

					//リストの中身がなかったらエラー表示
					if (_this.resultList == null || _this.resultList.length == 0) {
						_this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
						$("#result").show();
					}
					else {
						var no = 1;	//表示番号セット

						// 取得したデータを表示する
						$.each(_this.resultList, function() {
							this.numList = no++;
							// 日付、時刻を表示用に変換
							this['upd_iymd'] = clutil.dateFormat(this.upd_iymd, 'yyyy/mm/dd');
							this['upd_time'] = clutil.timeFormat(this.upd_time, 'hh:mm');
						});

						// 取得したデータを表示する
						_this.$('#ca_tbody_tmpl').tmpl(_this.resultList).appendTo('#ca_tbody');
						clutil.initUIelement(_this.$('#ca_tbl'));		//再描画で選択ボタン表示

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

						// 右クリックメニュー作成
						$('.contextmenu').contextmenu({
					        'ctrl':false,
					        'menu':{
					            '編集': 'ca_edit',
					            '削除': 'ca_del',
					            '複製': 'ca_copy'
					        },
					        'callback': _this.onClickContextmenu
					    });
					}
				}
				else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					// ページャーの初期化
					_this.initPager(1, itemsOnPage, 0);
				}


				// 検索結果の表示有無でフォーカス対象差分
				if (_this.$('#searchAgain').css('display') == 'none') {
					// 再表示ボタンがなければ検索ボタンにフォーカス
					_this.$('#ca_search').focus();
				}
				else {
					// 再検索ボタンにフォーカスする
					_this.$('#searchAgain').focus();
				}

			}, this));
		},

		/**
		 * コンテキストメニュー click
		 */
		onClickContextmenu: function(val, id) {

	////is_upd取得用////////////////////////////

			//検索結果テーブル取得
			var genlist = [];
			genlist = clutil.tableview2data($('#ca_tbody').children());

			//ループで指定idのis_upd取得
			var num = 0;
			for(num = 0; num < genlist.length ; num++){
				if(genlist[num].genlist_id == id) {
					var is_upd = genlist[num].is_upd;
					break;
				}
			}
	//////////////////////////////////

			switch (val) {
				case 'ca_edit' :
					this.showEditpage(am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD, id, is_upd);
					break;

				case 'ca_copy' :
					this.showEditpage(am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW, id, is_upd);
					break;

				case 'ca_del' :
					if(is_upd == "1") {
						//更新権限がある場合
						var obj = {
								tgt : $('#ca_del'),	//ダイアログから戻った際のフォーカス対象
								genlist_id : id
						}
						// 削除確認ダイアログを表示
						clutil.delConfirmDialog(this.delOkcallback, this.delCancelcallback, obj);
						break;
					}
					else {
						//更新権限がない場合
						// ヘッダーにメッセージを表示
						this.validator.setErrorInfo({_eb_: clmsg.del_false});
						return this;
					}
				default:
					break;
			}
		},


		/**
		 * 新規登録ボタン click
		 */
		_onEntryClick: function(){
			//新規モードで画面遷移
			this.showEditpage(am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW);
		},

		/**
		 * 編集ボタン click
		 */
		_onEditClick: function() {

			// ラジオボタンチェック有無確認
			var radio = this.$('#ca_tbody').find("[name=ca_chk]:checked");

			//チェックされているボタンがなければヘッダにエラーメッセージ
			if (radio.length == 0) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_select_required});
				return;
			}

			// クリックされた行のIDを取得する
			var tr = $(radio).closest('tr');
			var genlist_id = tr.get(0).id;
			var is_upd = $(tr).attr('is_upd');

			//編集モードで画面遷移
			this.showEditpage(am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD, genlist_id ,is_upd);
		},

		/**
		 * コピーボタン click
		 */
		_onCopyClick: function() {
//			// ラジオボタンチェック有無確認
			var radio = this.$('#ca_tbody').find("[name=ca_chk]:checked");

			//チェックされているボタンがなければヘッダにエラーメッセージ
			if (radio.length == 0) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_select_required});
				return;
			}

			// クリックされた行のIDを取得する
			var tr = $(radio).closest('tr');
			var genlist_id = tr.get(0).id;
			var is_upd = $(tr).attr('is_upd');

			//複製モードで画面遷移
			this.showEditpage(am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW, genlist_id ,is_upd);
		},

		/**
		 * 登録画面へ遷移する
		 */
		showEditpage : function(ope_mode, genlist_id, is_upd){
			//引数にidがなかったらエラー(新規モードならOK)
			if (genlist_id == null && ope_mode != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				return;
			}

			var args = {
				ope_mode : ope_mode,		//遷移後の画面表示モード
				genlist_id : genlist_id,	//リストid
				is_upd : is_upd,			//サーバーからの編集可否フラグ
				homeUrl: clcom.homeUrl
			};

			// 画面の情報を取得する
			var searchData = clutil.view2data($('#ca_searchArea'));
			var data = {
				cond : searchData,
				req : this.req
			};

			clcom.pushPage(
				'../CAMEV0020/CAMEV0020.html',	// 遷移先url
				args,		// 画面引数
				data		// 保存データ
			);
		},

		/**
		 * 削除ボタン click
		 */
		_onDelClick: function() {
			// エラーメッセージのクリア
			this.validator.clear();

			// ラジオボタンチェック有無確認
			var radio = this.$('#ca_tbody').find("[name=ca_chk]:checked");

			//チェックされているボタンがなければヘッダにエラーメッセージ
			if (radio.length == 0) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_select_required});
				return;
			}

			// クリックされた行のIDを取得する
			var tr = $(radio).closest('tr');
			var genlist_id = tr.get(0).id;
			var is_upd = $(tr).attr('is_upd');

			if(is_upd == "1") {
				//更新権限がある場合
				var obj = {
						tgt : $('#ca_del'),
						genlist_id : genlist_id
				}

				// 削除確認ダイアログを表示
				clutil.delConfirmDialog(this.delOkcallback, this.delCancelcallback, obj);
			}
			else {
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clmsg.del_false});
				return this;
			}
		},

		/**
		 * 削除確認ダイアログよりCancelで戻る
		 */
		delCancelcallback: function(obj) {
			//キャンセル後のフォーカス対象取得
			var tgt = obj.tgt;

			$(tgt).focus();
			return;
		},

		/**
		 * 削除確認ダイアログよりOKで戻る
		 */
		delOkcallback: function(obj) {
			var _this = this;

			//引数よりID取得
			var genlist_id = obj.genlist_id;

			var req = {
					rtype : am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL,
					genlist : {
						id : genlist_id
					}
			};


			//サーバーにアップ
			var uri = 'gsan_cm_genlist_upd';
			clutil.postAnaJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
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
			this.onPageClick(1, clcom.itemsOnPage);
		},

		/**
		 * クリアボタン click
		 */
		_onClearClick: function() {
			// validatorの初期化
			this.validator.clear();

			//Shimizu追加
			$('#ca_div_elem_lvl').html('');
			//検索条件クリア
			clutil.viewClear($('#ca_searchArea'));
		}
	});


	listView = new ListView();
	listView.render();

	// 初期情報を取得する
	var req = {
			cond : {
				f_genlist : am_proto_defs.AMDB_DEFS_F_GENLIST_STORE,
				srch_iymd : clutil.getMstSrchDate(this.isAnalyse_mode, this.anaProc, 'org')
			}
	};

	var uri = 'gsan_cm_genlist_init';
	clutil.postIniJSON(uri, req, _.bind(function(data, dataType) {
		//////////////////////////////////////////////
		// ヘッダー部品
		headerView = new HeaderView();
		headerView.render(function(){

			if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

				listView.funclist = data.func_list;
				listView.lvllist = data.lvl_list;

				listView.levelList = {
						0 : []
				};

				// 種別から階層リストを作成する
				for (var i = 0; i < listView.funclist.length; i++) {
					var func = listView.funclist[i];
					listView.levelList[func.func_id] = [];
				}
				for (var i = 0; i < listView.lvllist.length; i++) {
					var lvl = listView.lvllist[i];
					listView.levelList[lvl.lvl_func_id].push(lvl);
				}

				// 区分selectorを初期化する
				listView.initUIelement();

				listView.setFocus();

			}
			else {
				// ヘッダーにメッセージを表示
				listView.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
			}

			// 編集画面から戻ってきた場合
			if(clcom.pageData != null){
				listView.req = clcom.pageData.req;
				var cond = clcom.pageData.cond;


				var func_id = cond.elem_func;
				clutil.initcltypeselector2(
						$('#ca_div_elem_lvl'), listView.levelList[func_id], 1, null,
						'lvl_id', 'lvl_name', 'lvl_code',
						{id : "ca_elem_lvl", name : "info"}, "mbn wt280 flleft");

				$('#ca_div_elem_lvl').html('');
				clutil.data2view(listView.$('#ca_searchArea'), cond);
				clutil.data2view(listView.$('#ca_div_elem_lvl'), cond);

				if (listView.req != null) {
					listView.onPageClick(1, clcom.itemsOnPage);
				}
			}

			listView.setFocus();
		});
		//////////////////////////////////////////////
	}, this)).done(function(){
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
