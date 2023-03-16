$(function() {

	/**
	 * @module AMPAV0010SelectorView
	 */
	/**
	 * # 店舗選択画面
	 *
	 * ### 注意事項
	 *
	 * options.isAnalyse_modeは利用されません
	 *
	 * ### バグ
	 *
	 * show()の呼び出し前に必ずrender()を呼び出さなければならないが、
	 * render()は非同期でhtmlテンプレートを取得する(clutil.loadHtml())
	 * ためshow()呼び出しのタイミングによっては何も描画されない。以下の
	 * 例は必ず失敗するだろう。
	 *
	 * @class AMPAV0010SelectorView
	 * @extends Backbone.View
	 * @constructor
	 * @param {Object} options
	 * @param {jQuery} options.$parentView
	 *  親画面のjQueryオブジェクト (例：$('#ca_main'))
	 * @param {clutil.cl_single_select|cl_multiple_select} [options.select_mode=cl_single_select]
	 *  チェックボックス(複数)/ラジオボタン選択(単一)
	 * @param {Ymd} [options.ymd=clcom.ope_date] 検索日
	 * @example
	 * ```js
	 * var view = new AMPAV0020SelectorView({
	 *   el: "#ca_AMPAV0010",
	 *   $parentView: $("#mainColumn")
	 * });
	 * view.render();
	 * view.okProc = function(data){
	 *   if (data && data.length === 1){
	 *     var code = data[0].code;
	 *     var name = data[0].name;
	 *     var store = code + ":" + name;
	 *     $("#ca_store").val(store);
	 *   }
	 * };
	 * view.show();
	 * ```
	 */
	AMPAV0010SelectorView = Backbone.View.extend({

		screenId : "AMPAV0010",
		categoryId : "AMPA",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_AMPAV0010_search"		:	"_onSearchClick",		// 検索ボタン押下
			"click #searchAgain"				:	"_onSearchAgainClick",	// 検索条件を再指定ボタン押下
			"click #ca_AMPAV0010_add"			:	"_onAddClick",			// 追加ボタン押下

			"click .ca_AMPAV0010_edit_del"		:	"_onEditDelClick",		// 単一削除ボタン押下
			"click #ca_AMPAV0010_edit_delall"	:	"_onEditDelAllClick",	// すべて削除ボタン押下

			"click #ca_AMPAV0010_clear"			:	"_onClearClick",		// クリアボタン押下
			"click #ca_AMPAV0010_commit"		:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_AMPAV0010_show_AMPAV0020"		:	"_onShowAMPAV0020Click",		// 組織選択ボタン押下

			"click #ca_AMPAV0010_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_AMPAV0010_cancel"			:	"_onCancelClick"	// キャンセルボタン押下時
		},

		initialize: function(opt) {
			var defaults = {
				search_date: clcom.ope_date,			// 運用日
				select_mode: clutil.cl_single_select	// 単一選択モード
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);

		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			var _this = this;
			clutil.inputlimiter(this.$el);

			this.$('#mainColumninBox').addClass('noLeftColumn');
			this.$('#mainColumnFooter').addClass('noLeftColumn');

			// 単一選択モード
			if (this.select_mode == clutil.cl_single_select) {
				this.$('.ca_AMPAV0010_multi').remove();
				this.$('#ca_AMPAV0010_chkall').remove();
			}
			//選択した内容のスクロール
			this.$('#innerScroll').perfectScrollbar();

			// カレンダー
			clutil.datepicker(this.$("#ca_AMPAV0010_open_iymd_from"));
			clutil.datepicker(this.$("#ca_AMPAV0010_open_iymd_to"));
			clutil.datepicker(this.$("#ca_AMPAV0010_close_iymd_from"));
			clutil.datepicker(this.$("#ca_AMPAV0010_close_iymd_to"));
			// カレンダーの日付をクリア
			clutil.viewClear(this.$('#ca_AMPAV0010_searchArea'), false);
			// ↑仕様変更でクリアできないので以下 gotan
			this.$("#ca_AMPAV0010_open_iymd_from").datepicker("setIymd");
			this.$("#ca_AMPAV0010_open_iymd_to").datepicker("setIymd");
			this.$("#ca_AMPAV0010_close_iymd_from").datepicker("setIymd");
			this.$("#ca_AMPAV0010_close_iymd_to").datepicker("setIymd");
			// 以上 gotan

			clutil.initUIelement(this.$el);

			// 全選択チェックボックスを初期化
			this.chkall = clutil.checkallbox(this.$('#ca_AMPAV0010_chkall'),
					this.$('#ca_AMPAV0010_tbl'),
					this.$('#ca_AMPAV0010_tbody')
					);

			// 分析画面以外からのモード TODO これは何をつけてる?
			// if (this.isAnalyse_mode) {
			// 	// this.$('#mainColumnFooter').addClass('analytics'); // TODO このクラスはなに?
			// }

			if (this.select_mode != clutil.cl_single_select){
				// this.$('#mainColumnFooter').addClass('analytics'); // TODO このクラスはなに?
				// 条件表示エリアの設定
				this.addtoSelected = clutil.addtoSelected(
						this.$('#ca_AMPAV0010_add'),
						this.$('#selected'),
						this.$('#mainColumn'));
			}

			// 検索条件を再指定ボタンを隠す
			this.srchArea = clutil.controlSrchArea(this.$('#ca_AMPAV0010_searchArea'),
					this.$('#ca_AMPAV0010_search'),
					this.$('#result'),
					this.$('#searchAgain'));

			// 組織選択画面
			this.AMPAV0010_AMPAV0020Selector = new  AMPAV0020SelectorView({
				el : this.$('#ca_AMPAV0010_AMPAV0020_dialog'),	// 配置場所
				$parentView		: this.$('#ca_AMPAV0010_main'),
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_single_select,	// 複数選択モード
				anaProc			: this.anaProc
			});
			this.AMPAV0010_AMPAV0020Selector.render();
		},

		/**
		 * 選択画面の初期化処理
		 *
		 * 初期化後にshow()の呼び出し前に必ず呼び出すこと
		 *
		 * @method render
		 */
		render: function() {
			var url = clcom.urlRoot + "/system/app/" + this.categoryId + "/" + this.screenId + "/" + this.screenId + ".html";

			// HTMLソースを読み込む
			clutil.loadHtml(url, _.bind(function(data) {
				this.html_source = data;
			}, this));

			return this;
		},

		/**
		 * ページャーの初期化
		 *
		 * @method initPager
		 * @private
		 * @param itemsOnPage
		 * @param totalCount
		 */
		initPager: function(pageNumber, itemsOnPage, totalCount) {
			var _this = this;
			this.$('#ca_AMPAV0010_pager1').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_AMPAV0010_pager_displaypanel1'),
				onSelectChange: function(itemsOnPage){
					// ページ変更時
					_this.onPageClick(1, itemsOnPage, true);
				},
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時
					_this.onPageClick(pageNumber, itemsOnPage, true);
				},
				onSelectChangeBefore: function(ev) {
					var that = this;
					var commit = ev.commit;
					ev.commit = function(){
						commit.call(ev);
						that.onSelectChange(ev.itemsOnPage);
					};
					//clutil.mediator.trigger('onSelectChangeBefore', this.groupid, ev);
				},
			});
			this.$('#ca_AMPAV0010_pager2').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_AMPAV0010_pager_displaypanel2'),
				onSelectChange: function(itemsOnPage){
					_this.onPageClick(1, itemsOnPage, true);
				},
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時
					_this.onPageClick(pageNumber, itemsOnPage, true);
				},
				onSelectChangeBefore: function(ev) {
					var that = this;
					var commit = ev.commit;
					ev.commit = function(){
						commit.call(ev);
						that.onSelectChange(ev.itemsOnPage);
					};
					//clutil.mediator.trigger('onSelectChangeBefore', this.groupid, ev);
				},
			});
		},

		/**
		 * 描画を行う。先にrender()を実行すること
		 *
		 * @method show
		 * @param {Array} [editList] - 編集領域に保存されているリスト
		 * @param {Array} [isSubDialog] - ダイアログからダイアログを表示したときにのみtrueを設定
		 * @param {Object} [options]
		 * @param {Array} [options.editList] - 編集領域に保存されているリスト
		 * @param {Array} [options.isSubDialog] - ダイアログからダイアログを表示したときにのみtrueを設定
		 * @param {Integer} [options.func_id] - 組織種別を設定する。組織階層選択の組織種別も固定されます。
		 * @param {Integer} [options.org_id] 組織IDを設定する。
		 * 組織階層選択では指定された組織の下位組織のみが設定可能になります。
		 * このオプションを指定する場合は必ずfunc_idも指定すること。
		 * @param {Array} [options.org_kind_set] 検索対象とする組織区分を指定する。
		 * @param {Integer|Function} [options.f_ignore_perm] 権限無視フラグ。 1の場合は、権限を見ないで検索します。org_idも指定すること
		 *
		 * 指定可能な値は以下で、配列で指定する
		 * - am_pa_store.AM_PA_STORE_ORG_KIND_HD HD
		 * - am_pa_store.AM_PA_STORE_ORG_KIND_CORP 会社
		 * - am_pa_store.AM_PA_STORE_ORG_KIND_UNIT 事業ユニット
		 * - am_pa_store.AM_PA_STORE_ORG_KIND_ZONE ゾーン
		 * - am_pa_store.AM_PA_STORE_ORG_KIND_AREA エリア
		 * - am_pa_store.AM_PA_STORE_ORG_KIND_STORE 店舗
		 * - am_pa_store.AM_PA_STORE_ORG_KIND_CENTER 倉庫
		 * - am_pa_store.AM_PA_STORE_ORG_KIND_HQ 本部部署
		 * - am_pa_store.AM_PA_STORE_ORG_KIND_OTHER その他
		 *
		 * @param {integer} [options.f_stockmng=0] 在庫有無フラグ 1:在庫有り店舗のみ
		 */
		show: function(editList, isSubDialog, options) {
			// 画面切り替え前のスクロール位置
			this.savedPos = {
				top: $('body').scrollTop(),
				left: $('body').scrollLeft()
			};

			if (arguments.length === 1 && _.isObject(editList) && !_.isArray(editList)){
				options = editList;
				editList = options.editList;
				isSubDialog = options.isSubDialog;
			}

			options || (options = {});

			this.f_ignore_perm = options.f_ignore_perm || 0;

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
			this.validator = clutil.validator(this.$('#ca_AMPAV0010_main'), {
				echoback		: $('.cl_echoback')
			});

			// 指定された組織情報を設定する。
			this.func_id = parseInt(options.func_id, 10) || null;
			this.r_org_id = parseInt(options.org_id, 10) || null;

			// 検索組織区分を保存しておく
			this.org_kind_set = options.org_kind_set;

			// 在庫管理フラグ
			this.f_stockmng = options.f_stockmng || 0;

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
				this.$('#ca_AMPAV0010_edit_tbl').html(html_source);
			} else if (this.addtoSelected != null) {
				this.addtoSelected.right_side_hide();
			}

			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode({
				view : this.$el
			});

			// フォーカスの設定
			this.setFocus();

			// 初期スクロール位置は原点に。
			$('body').scrollTop(0).scrollLeft(0);
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus(this.$('#ca_AMPAV0010_code'));
		},

		/**
		 * 組織選択ボタン押下
		 */
		_onShowAMPAV0020Click: function(e) {
			var _this = this;

			// 選択された情報を初期値として検索する
			var initData = {};
			// デフォルトは基本組織
			initData.func_id = parseInt(this.$('#ca_AMPAV0010_func_id').val(), 10) ||
				parseInt(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'), 10) ||
				null;
			initData.org_id = parseInt(this.$('#ca_AMPAV0010_org_id').val(), 10) ||
				null;

			// FIXME:何の機能か不明(当初からAOKMDにcloseConditionは定義無し)	//
			// スキップしておきますので、不要か確認して削除してください	gotan	//
//			if (this.isAnalyse_mode) {
//				// 分析条件部分を閉じる
//				clutil.closeCondition();
//			}
			// 以上																//

			this.AMPAV0010_AMPAV0020Selector.show(null, true, this.func_id, null, initData, this.r_org_id, this.f_stockmng, this.f_ignore_perm);
			//サブ画面復帰後処理
			this.AMPAV0010_AMPAV0020Selector.okProc = function(data) {
				if(data != null && data.length > 0) {
					if (data[0]._nameonly) {
						_this.$('#ca_AMPAV0010_orgname').val(data[0].name);
					} else {
						_this.$('#ca_AMPAV0010_orgname').val(data[0].code + ":" + data[0].name);
					}
					_this.$('#ca_AMPAV0010_org_id').val(data[0].val);
					_this.$('#ca_AMPAV0010_func_id').val(data[0].func_id);
				}
				// ボタンにフォーカスする
				_.defer(function(){
					$(e.target).focus();
				});
			};
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
				stval : 'ca_AMPAV0010_open_iymd_from',
				edval : 'ca_AMPAV0010_open_iymd_to'
			});
			chkInfo.push({
				stval : 'ca_AMPAV0010_close_iymd_from',
				edval : 'ca_AMPAV0010_close_iymd_to'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}
			if (!retStat) {
				return;
			}

			// 画面の情報を取得する
			var searchData = clutil.view2data(this.$('#ca_AMPAV0010_searchArea'), 'ca_AMPAV0010_');
			// 全角、半角対応
			if (searchData.name.length > 0) {
				searchData.namezen = clutil.han2zen(searchData.name);
				searchData.namehan = clutil.zen2han(searchData.name);
			}
			// showで上位から指定されたorg_idをデフォルト値に設定する
			if (!parseInt(searchData.org_id, 10) && this.r_org_id){
				searchData.org_id = this.r_org_id;
			}
			if (!parseInt(searchData.func_id, 10) && this.func_id) {
				searchData.func_id = this.func_id;
			}

			searchData.org_kind_set = _.reduce(this.org_kind_set, function(set, value){
				return set | value;
			}, 0);

			// 在庫管理フラグ
			searchData.f_stockmng = this.f_stockmng;

			// 権限無視フラグ
			searchData.f_ignore_perm = this.f_ignore_perm;

			this.req = {
					cond : searchData
			};

			//結果表示(ページャー)
			this.onPageClick(1, clcom.itemsOnPage);
		},

		// ページャークリック
		onPageClick: function(pageNumber, itemsOnPage, isPager) {

			// 結果状態をクリアする
			this.clearResult(itemsOnPage);

			var index = itemsOnPage * (pageNumber - 1);
			var pagedata = {
				start_record : index,			// index番目のデータから(0～)
				page_size : itemsOnPage			// 1ページに表示する件数を要求
			};

			this.req.pagereq = pagedata;

			// データを取得
			var uri = 'am_pa_store';
			clutil.postJSON(uri, this.req, _.bind(function(data, dataType) {
				var $select_template;
				var expanderPromise = null;
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
							$select_template = this.$('#ca_AMPAV0010_tbody_multiple_tmp');
							break;
						case clutil.cl_single_select:
						default:
							$select_template = this.$('#ca_AMPAV0010_tbody_single_tmp');
							break;
						}
						// 取得したデータを表示する
						$select_template.tmpl(this.resultList).appendTo('#ca_AMPAV0010_tbody');

						clutil.initUIelement(this.$('#ca_AMPAV0010_tbl'));

						// 検索ボタン押下時は検索条件エリアを閉じる
						if (!isPager) {
							expanderPromise = this.srchArea.show_result();
							// エキスパンダ
							this.$('.fieldUnitsHidden').hide();
							this.$('.expand').show();
							this.$('.unexpand').hide();
						}

						// 総レコード数
						var totalRec = data.pagersp.total_record;
						// ページャーの初期化
						this.initPager(pageNumber, itemsOnPage, totalRec);

					}

				} else {
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					// ページャーの初期化
					this.initPager(1, itemsOnPage, 0);
				}

				// フォーカスセットする
				var focusSetting = _.bind(function(){
					if (this.$('#searchAgain').css('display') == 'none') {
						// 検索ボタンにフォーカスする
						this.$('#ca_AMPAV0010_search').focus();
					} else {
						// 条件を追加ボタンにフォーカスする
						this.$('#ca_AMPAV0010_add').focus();
					}
				}, this);
				if(expanderPromise){
					expanderPromise.done(focusSetting);
				}else{
					focusSetting();
				}

			}, this));
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function(itemsOnPage) {
			// テーブルをクリア
			this.$('#ca_AMPAV0010_tbody').empty();
			// ページャーの初期化
			if(itemsOnPage == null){
				itemsOnPage = clcom.itemsOnPage;
			}
			this.initPager(1, itemsOnPage, 0);
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
			clutil.viewClear(this.$('#ca_AMPAV0010_searchArea'), false);
			this.$('#ca_AMPAV0010_orgname').val('');
			this.$('#ca_AMPAV0010_org_id').val('');
			this.$('#ca_AMPAV0010_func_id').val('');
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
			$.each(this.$('#ca_AMPAV0010_tbody').find("[name=ca_AMPAV0010_chk]:checked"), function() {
				var tr = $(this).closest('tr');
				chkId.push(tr.get(0).id);
			});

			if (chkId.length > 0) {
				var selectlist = this.getData(chkId);
				// 編集領域のIDリストを取得する
				var idlist = [];
				var html_source = '';

				$.each(this.$('#ca_AMPAV0010_edit_tbl li'), function() {
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

					html_source += this.makeEditTmp(newdata);
					num++;
					editlist.push(newdata);
				}
				this.$('#ca_AMPAV0010_edit_tbl').append(html_source);
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
			html_source += data.code + '</span><span class="btn-delete ca_AMPAV0010_edit_del"></span>';
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
			$(e.target).closest("li").fadeOut(300).queue(
				function(){ this.remove() });
			this.$('#ca_AMPAV0010_add').focus();
		},

		/**
		 * 編集領域すべて削除ボタン押下
		 */
		_onEditDelAllClick: function() {
			// 削除対象IDリストを取得する
			this.$('#ca_AMPAV0010_edit_tbl').html("");
		},

		/**
		 * テーブルに表示されている編集リストを取得する
		 */
		getEditList : function() {
			var editlist = [];
			editlist = clutil.tableview2data(this.$('#ca_AMPAV0010_edit_tbl').children());
			return editlist;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			this.validator.clear();
			var editlist = [];

			// 単一選択モード、分析画面ではない画面から呼び出された場合
			if (this.select_mode == clutil.cl_single_select) {
				var chkId = [];
				$.each(this.$('#ca_AMPAV0010_tbody').find("[name=ca_AMPAV0010_chk]:checked"), function() {
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
						newdata.org_typeid = select.org_typeid;
						newdata.parentList = select.parentList;
						// unit_id属性を付与する
						var unitLevelId = parseInt(
							clcom.getSysparam('PAR_AMMS_UNIT_LEVELID'), 10);
						var unit = _.where(select.parentList, {
							orglevel_id: unitLevelId})[0];
						newdata.unit_id = unit && unit.store_id;
						// 種別を挿入する
						// newdata.kind = amdb_defs.AM_PA_DEFS_KIND_STORE; // TODO kindはなにを設定する?

						editlist.push(newdata);
					}
					this.$parentView.show();
					this._okProc(editlist);
					this.$el.html('');
					clutil.leaveEnterFocusMode();
					clutil.enterFocusMode();
				} else {
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clmsg.ca_AMPAV0010_0001});
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

		/**
		 * 選択時処理コールバック
		 *
		 * 呼び出し側で override すること
		 *
		 * @method okProc
		 * @param {Array} data 選択アイテムのリスト
		 */
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
