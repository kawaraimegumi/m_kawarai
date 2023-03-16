$(function() {

	//////////////////////////////////////////////
	// View
	MDCMV1280SelectorView = Backbone.View.extend({

		screenId : "MDCMV1280",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_MDCMV1280_add"			:	"_onAddClick",			// 追加ボタン押下

			"click .ca_MDCMV1280_edit_del"		:	"_onEditDelClick",		// 単一削除ボタン押下
			"click #ca_MDCMV1280_edit_delall"	:	"_onEditDelAllClick",	// すべて削除ボタン押下

			"click #ca_MDCMV1280_clear"			:	"_onClearClick",		// クリアボタン押下
			"click #ca_MDCMV1280_commit"		:	"_onCommitClick",		// 確定ボタン押下

			"change #ca_MDCMV1280_anaattr"		:	"_onAnaAttrSelect",		// 属性値変更

			// 2015/9/24 No79対応 藤岡
			// 押下イベント追加
			"click #ca_MDCMV1280_search"			:	"_onSearchboxSearchClick",			// 検索ボタン押下
			"click #ca_MDCMV1280_searchbox_clear"	:	"_onSearchboxClearClick",	// クリアボタン押下
			"click #searchAgain"					:	"_onSearchboxSearchAgainClick",		// 検索条件を再指定ボタン押下
			"click #ca_MDCMV1280_main th.ca_th_sort"		:	"_onSearchboxThSortClick",	// テーブルヘッダ押下
			// 2015/9/24 No79対応 ここまで

			"click #ca_MDCMV1280_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_MDCMV1280_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_MDCMV1280_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
		},

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
				this.$('.ca_MDCMV1280_multi').remove();
				this.$('#ca_MDCMV1280_chkall').remove();
			}
			// 分析画面以外からのモード
			if (this.isAnalyse_mode == false) {
				this.$('#mainColumninBox').addClass('noLeftColumn');
				this.$('#mainColumnFooter').addClass('noLeftColumn');
			} else {
				this.$('#mainColumnFooter').addClass('analytics');
			}


			//選択した内容のスクロール
			this.$('#innerScroll').perfectScrollbar();
			// 条件表示エリアの設定
			this.addtoSelected = clutil.addtoSelected(
					this.$('#ca_MDCMV1280_add'),
					this.$('#selected'),
					this.$('#mainColumn'));

			// 属性リストを取得
			this.attrlist = _.union([
				{
					actype: am_proto_defs.AM_PROTO_ACTYPE_DMPROM,
					attr: 0,
					kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_DMPROM,
					name: "POS読取実績(DM割引)",
					off_name: "",
					on_name: "",
					xtype: 0,
				},
				{
					actype: am_proto_defs.AM_PROTO_ACTYPE_POSPROM,
					attr: 0,
					kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_POSPROM,
					name: "POS読取実績(固定割引)",
					off_name: "",
					on_name: "",
					xtype: 0,
				},
				{
					actype: 0,
					attr: 0,
					kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_T_DISC_PROM,
					name: "企画種別",
					off_name: "",
					on_name: "",
					xtype: amcm_type.AMCM_TYPE_DISC_PROM,
				},
			], clcom.getTranAttrList());

			// 売上マトリクスのときは新規顧客区分を除く 2014/02/10追加
			if (clcom.pageId == 'CAANV0090' &&
					this.attrlist != null &&
					this.attrlist.length > 0) {
				for (var i = this.attrlist.length-1; i >= 0; i--) {
					if (this.attrlist[i].kind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_NEWMEMB) {
						this.attrlist.splice(i,1);
						break;
					}
				}
			}

			// コンボボックスの中身を作成
			clutil.cltypeselector2(this.$('#ca_MDCMV1280_anaattr'), this.attrlist, 0,
					1, 'kind', 'name');
			if (this.attrlist != null && this.attrlist.length > 0) {
				this.showData(this.attrlist[0]);
			}

			clutil.initUIelement(this.$el);

		},

		/**
		 * 選択画面の初期化処理
		 */
		render: function() {
			var _this = this;

//			var url = "";
//			url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
			var url = clcom.getAnaSubPaneURI(this.screenId);

			// HTMLソースを読み込む
			clutil.loadHtml(url, function(data) {
				_this.html_source = data;
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
			this.validator = clutil.validator(this.$('#ca_MDCMV1280_main'), {
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
				this.$('#ca_MDCMV1280_edit_tbl').html(html_source);
			} else {
				this.addtoSelected.right_side_hide();
			}

			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode({
				view : this.$el
			});
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus(this.$('#ca_MDCMV1280_anaattr'));
		},

		/**
		 * 種別変更
		 */
		_onAnaAttrSelect: function(e) {
			this.validator.clear();
			this.showData(this.getAnaAttr());
		},

		/**
		 * 現在の種別を取得
		 */
		getAnaAttr: function() {
			var kind = this.$('#ca_MDCMV1280_anaattr').val();
			var anaattr = {};
			for (var i = 0; i < this.attrlist.length; i++) {
				if (this.attrlist[i].kind == kind) {
					anaattr = this.attrlist[i];
					break;
				}
			}
			return anaattr;
		},

		/**
		 * 初期表示
		 */
		showData: function(anaattr) {
			var template = "";
			// 最大桁数
			var maxlen = anaattr.maxlen == null ? 9 : anaattr.maxlen;
			switch (Number(anaattr.actype)) {
			case am_proto_defs.AM_PROTO_ACTYPE_DMPROM:
			case am_proto_defs.AM_PROTO_ACTYPE_POSPROM:
				anaattr.maxCodelen = 6;
				anaattr.maxNamelen = 30;
				anaattr.maxKanalen = 40;
				break;
			// 2015/10/30 No79対応 藤岡
			// 文字数制限追加
			case  am_proto_defs.AM_PROTO_ACTYPE_BUSIASS:
				anaattr.maxCodelen = 2;
				anaattr.maxNamelen = 30;
				break;
			case am_proto_defs.AM_PROTO_ACTYPE_UNIV:
				anaattr.maxCodelen = 4;
				anaattr.maxNamelen = 30;
				anaattr.maxKanalen = 40;
				break;
			case am_proto_defs.AM_PROTO_ACTYPE_TIEUP:
				anaattr.maxCodelen = 5;	// KOKYAKU-822 【PGM開発】提携団体コードのケタ数変更(2019/11/28)
				anaattr.maxNamelen = 30;
				anaattr.maxKanalen = 32;
				break;
			// 2015/10/30 No79対応 ここまで
			}

			switch (Number(anaattr.actype)) {
			case am_proto_defs.AM_PROTO_ACTYPE_TEXT:
				template = "ca_MDCMV1280_text_template";
				break;
			case am_proto_defs.AM_PROTO_ACTYPE_NUMRANGE:
			case am_proto_defs.AM_PROTO_ACTYPE_NUMRANGE100:
				template = "ca_MDCMV1280_text_fromto_template";
				break;
			case am_proto_defs.AM_PROTO_ACTYPE_YMDRANGE:
				template = "ca_MDCMV1280_date_fromto_template";
				break;
			case am_proto_defs.AM_PROTO_ACTYPE_ONOFF:
				template = "ca_MDCMV1280_onoff_template";
				break;
			case am_proto_defs.AM_PROTO_ACTYPE_TYPE:
			case am_proto_defs.AM_PROTO_ACTYPE_CDNAME:
			case am_proto_defs.AM_PROTO_ACTYPE_STAFFCDNAME:
			case am_proto_defs.AM_PROTO_ACTYPE_MARKETTYPE:		// MD商品分析 - マーケット
			case am_proto_defs.AM_PROTO_ACTYPE_AGETYPE:			// MD商品分析 - 客層
				template = "ca_MDCMV1280_table_template";
				break;
			case am_proto_defs.AM_PROTO_ACTYPE_ORG:
				template = "ca_MDCMV1280_org_template";
				break;
			// 2015/10/30 No79対応 藤岡
			// 表示用テンプレート宣言
			case am_proto_defs.AM_PROTO_ACTYPE_DMPROM:
			case am_proto_defs.AM_PROTO_ACTYPE_POSPROM:
			case am_proto_defs.AM_PROTO_ACTYPE_BUSIASS:
			case am_proto_defs.AM_PROTO_ACTYPE_UNIV:
			case am_proto_defs.AM_PROTO_ACTYPE_TIEUP:
				template = "ca_MDCMV1280_searchbox_tmp";
				break;
			// 2015/10/30 No79対応 ここまで
			default:
				if (Number(anaattr.kind) == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_T_DISC_PROM) {
					template = "ca_MDCMV1280_table_template";
				}
				break;
			}

			this.$('#ca_MDCMV1280_result').empty();
			this.$('#' + template).tmpl().appendTo('#ca_MDCMV1280_result');

			switch (Number(anaattr.actype)) {
			case am_proto_defs.AM_PROTO_ACTYPE_TEXT:
				// 全角
				this.$('#ca_MDCMV1280_val').addClass("ime-active");
				this.$('#ca_MDCMV1280_val').attr("data-limit", "len:" + maxlen);
//				// 半角カナチェックボックス表示 2013/09/06
////				this.$('.ca_MDCMV1280_check').show();
				break;
			case am_proto_defs.AM_PROTO_ACTYPE_TYPE:
			case am_proto_defs.AM_PROTO_ACTYPE_CDNAME:
			case am_proto_defs.AM_PROTO_ACTYPE_STAFFCDNAME:
			case am_proto_defs.AM_PROTO_ACTYPE_MARKETTYPE:		// MD商品分析 - マーケット
			case am_proto_defs.AM_PROTO_ACTYPE_AGETYPE:			// MD商品分析 - 客層
				switch (Number(anaattr.actype)) {
				case am_proto_defs.AM_PROTO_ACTYPE_TYPE:
					this.typelist = clutil.gettypecustlist(anaattr.xtype);
					this.$('#ca_MDCMV1280_tbody_type_tmp').tmpl(this.typelist).appendTo('#ca_MDCMV1280_tbody');
					break;
				case am_proto_defs.AM_PROTO_ACTYPE_CDNAME:
					this.typelist = clutil.getcdnamelist(anaattr.xtype);
					this.$('#ca_MDCMV1280_tbody_cdname_tmp').tmpl(this.typelist).appendTo('#ca_MDCMV1280_tbody');
					break;
				case am_proto_defs.AM_PROTO_ACTYPE_STAFFCDNAME:
					this.typelist = clutil.getstaffcdnamelist(anaattr.xtype);
					this.$('#ca_MDCMV1280_tbody_cdname_tmp').tmpl(this.typelist).appendTo('#ca_MDCMV1280_tbody');
					break;
				case am_proto_defs.AM_PROTO_ACTYPE_MARKETTYPE:	// MD商品分析 - マーケット
					this.typelist = clcom.getStoredValue('market_list');
					this.$('#ca_MDCMV1280_tbody_cdname2_tmp').tmpl(this.typelist).appendTo('#ca_MDCMV1280_tbody');
					break;
				case am_proto_defs.AM_PROTO_ACTYPE_AGETYPE:		// MD商品分析 - 客層
					this.typelist = clcom.getStoredValue('sexage_list');
					this.$('#ca_MDCMV1280_tbody_cdname2_tmp').tmpl(this.typelist).appendTo('#ca_MDCMV1280_tbody');
					break;
				}

				var _this = this;
				// 全選択チェックボックスを初期化
				this.chkall = clutil.checkallbox(this.$('#ca_MDCMV1280_chkall'),
						this.$('.ca_MDCMV1280_tbl'),
						this.$('#ca_MDCMV1280_tbody')
						);
				break;
				$(window).scrollTo(1);	// ダブルスクロール防止
//			case am_proto_defs.AM_PROTO_ITEM_TYPE_TEXTHAN:
//				// 半角
//				this.$('#ca_MDCMV1280_text').addClass("ime-disabled");
//				this.$('#ca_MDCMV1280_text').attr("data-limit", "len:" + maxlen);
//				break;
//			case am_proto_defs.AM_PROTO_ITEM_TYPE_TEXTNUM:
//				// 半角数値
//				this.$('#ca_MDCMV1280_text').addClass("ime-disabled");
//				this.$('#ca_MDCMV1280_text').attr("data-limit", "len:" + maxlen + " digit");
//				break;
			case am_proto_defs.AM_PROTO_ACTYPE_YMDRANGE:
				clutil.datepicker(this.$("#ca_MDCMV1280_val"));
				clutil.datepicker(this.$("#ca_MDCMV1280_val2"));
				break;
				// 2015/10/30 No79対応 藤岡
			case am_proto_defs.AM_PROTO_ACTYPE_BUSIASS:
				// カナ検索領域非表示
				this.$('#ca_MDCMV1280_kanaArea').hide();
				//検索先サーバー分岐用フラグ
				this.srchKind = anaattr.kind;
				// 全選択チェックボックスを初期化
				this.chkall = clutil.checkallbox(this.$('#ca_MDCMV1280_chkall'),
						this.$('#ca_MDCMV1280_tbl'),
						this.$('#ca_MDCMV1280_tbody')
						);
				// 検索条件の文字制限指定
				this.$('#ca_MDCMV1280_code').attr("data-limit", "digit len:" + anaattr.maxCodelen);
				this.$('#ca_MDCMV1280_name').attr("data-limit", "len:" + anaattr.maxNamelen);
				break;
			case am_proto_defs.AM_PROTO_ACTYPE_DMPROM:
			case am_proto_defs.AM_PROTO_ACTYPE_POSPROM:
			case am_proto_defs.AM_PROTO_ACTYPE_UNIV:
			case am_proto_defs.AM_PROTO_ACTYPE_TIEUP:
				// カナ検索領域表示
				this.$('#ca_MDCMV1280_kanaArea').show();
				//検索先サーバー分岐用フラグ
				this.srchKind = anaattr.kind;
				// 全選択チェックボックスを初期化
				this.chkall = clutil.checkallbox(this.$('#ca_MDCMV1280_chkall'),
						this.$('#ca_MDCMV1280_tbl'),
						this.$('#ca_MDCMV1280_tbody')
						);
				// 検索条件の文字制限指定
				this.$('#ca_MDCMV1280_code').attr("data-limit", "digit len:" + anaattr.maxCodelen);
				this.$('#ca_MDCMV1280_name').attr("data-limit", "len:" + anaattr.maxNamelen);
				this.$('#ca_MDCMV1280_kana').attr("data-limit", "len:" + anaattr.maxKanalen);
				break;
			// 2015/10/30 No79対応 ここまで
			default:
				if (Number(anaattr.kind) == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_T_DISC_PROM) {
					this.typelist = clutil.gettypelist(anaattr.xtype);
					this.$('#ca_MDCMV1280_tbody_type_tmp').tmpl(this.typelist).appendTo('#ca_MDCMV1280_tbody');

					this.chkall = clutil.checkallbox(
						this.$('#ca_MDCMV1280_chkall'),
						this.$('.ca_MDCMV1280_tbl'),
						this.$('#ca_MDCMV1280_tbody')
					);
				}
				break;
			}

			// 2015/10/30 [選択追加]ボタン制御 藤岡
			if(Number(anaattr.actype) == am_proto_defs.AM_PROTO_ACTYPE_DMPROM
					|| Number(anaattr.actype) == am_proto_defs.AM_PROTO_ACTYPE_POSPROM
					|| Number(anaattr.actype) == am_proto_defs.AM_PROTO_ACTYPE_BUSIASS
					|| Number(anaattr.actype) == am_proto_defs.AM_PROTO_ACTYPE_UNIV
					|| Number(anaattr.actype) == am_proto_defs.AM_PROTO_ACTYPE_TIEUP){
				// 検索系テンプレの場合は追加ボタン非表示
				this.$('#ca_MDCMV1280_add').hide();
			}
			else{
				$('#ca_MDCMV1280_add').show();
			}
			// 2015/10/30 [選択追加]ボタン制御 ここまで
			
			// 単位の表示
			this.$('#ca_MDCMV1280_item_unit').html(clutil.cStr(anaattr.item_unit));

			// 画面の初期化
			clutil.initUIelement(this.$el);
			clutil.inputlimiter(this.$el);
			// Enterキーによるフォーカスをする。
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode({
				view : $('.cl_dialog')
			});
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// テーブルをクリア
			this.$('#ca_MDCMV1280_tbody').empty();
			// ページャーの初期化
			this.onSearchboxInitPager(1, clcom.itemsOnPage, 0);
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
			clutil.viewClear(this.$('#ca_MDCMV1280_searchArea'));
			// validatorの初期化
			this.validator.clear();
		},

		/**
		 * 追加ボタン押下
		 */
		_onAddClick:function() {
			// 編集領域を閉じる際はなにもしない
			if (this.addtoSelected.right_side()) {
				return;
			}
			var retStat = true;
			if(!this.validator.valid()) {
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clmsg.ca_select_attr});
				retStat = false;
			}
			// 画面の情報を取得する
			var searchData = clutil.view2data(this.$('#ca_MDCMV1280_result'), 'ca_MDCMV1280_');

			var anaattr = this.getAnaAttr();

			// 編集領域のIDリストを取得する
			var idlist = {};
			$.each(this.$('#ca_MDCMV1280_edit_tbl li'), function() {
				if (this.id == anaattr.kind) {
					var val = $(this).find('input[name=val]').val();
					idlist[val] = true;
				}
			});
			// 現在の要素数を取得
			var num = this.$('#ca_MDCMV1280_edit_tbl li').length;

			switch (Number(anaattr.actype)) {
			case am_proto_defs.AM_PROTO_ACTYPE_TEXT:
			case am_proto_defs.AM_PROTO_ACTYPE_NUMRANGE:
			case am_proto_defs.AM_PROTO_ACTYPE_NUMRANGE100:
			case am_proto_defs.AM_PROTO_ACTYPE_YMDRANGE:
				if(!retStat) {
					return;
				}
				var newdata = {};
				newdata.name2 = anaattr.name;
				newdata.kind = anaattr.kind;
				newdata.attr = anaattr.attr;
				switch (Number(anaattr.actype)) {
				case am_proto_defs.AM_PROTO_ACTYPE_TEXT:
					newdata.val = searchData.val;
					newdata.name = searchData.val;
					break;
				case am_proto_defs.AM_PROTO_ACTYPE_NUMRANGE:
				case am_proto_defs.AM_PROTO_ACTYPE_NUMRANGE100:
					// 範囲反転チェック
					var chkInfo = [];
					chkInfo.push({
						stval : 'ca_MDCMV1280_val',
						edval : 'ca_MDCMV1280_val2'
					});
					if(!this.validator.validFromTo(chkInfo) || !retStat){
						return;
					}
					newdata.val = searchData.val;
					newdata.val2 = searchData.val2;
					newdata.name = clutil.comma(searchData.val) + '～' + clutil.comma(searchData.val2);
					break;
				case am_proto_defs.AM_PROTO_ACTYPE_YMDRANGE:
					// 範囲反転チェック
					var chkInfo = [];
					chkInfo.push({
						stval : 'ca_MDCMV1280_val',
						edval : 'ca_MDCMV1280_val2'
					});
					if(!this.validator.validFromTo(chkInfo) || !retStat){
						return;
					}
					newdata.val = searchData.val;
					newdata.val2 = searchData.val2;
					newdata.name = clutil.dateFormat(searchData.val, 'yyyy/mm/dd') +
						"～" + clutil.dateFormat(searchData.val2, 'yyyy/mm/dd');
					break;
				default:
					break;
				}
				this.$('#ca_MDCMV1280_edit_tbl').append(this.makeEditTmp(newdata));
				break;
			case am_proto_defs.AM_PROTO_ACTYPE_ONOFF:
				break;
//			case gs_proto_defs.buttontype:
//				if(!retStat) {
//					return;
//				}
//				var newdata = {};
//				newdata.name = anaattr.name;
//				newdata.kind = anaattr.kind;
//				newdata.attr = anaattr.attr;
//				newdata.val = searchData.val;
//				newdata.name2 = searchData.name;
//				// 重複チェック
//				if(idlist[newdata.val]){
//					// 重複する場合は追加しない
//					break;
//				}
//				this.$('#ca_MDCMV1280_edit_tbl').append(this.makeEditTmp(newdata));
//				break;
			case am_proto_defs.AM_PROTO_ACTYPE_TYPE:
			case am_proto_defs.AM_PROTO_ACTYPE_CDNAME:
			case am_proto_defs.AM_PROTO_ACTYPE_STAFFCDNAME:
			case am_proto_defs.AM_PROTO_ACTYPE_MARKETTYPE:		// MD商品分析 - マーケット
			case am_proto_defs.AM_PROTO_ACTYPE_AGETYPE:			// MD商品分析 - 客層
				var chkId = [];
				$.each(this.$('#ca_MDCMV1280_tbody').find("[name=ca_MDCMV1280_chk]:checked"), function() {
					var tr = $(this).closest('tr');
					chkId.push(tr.get(0).id);
				});

				var idname = '';
				switch (Number(anaattr.actype)) {
				case am_proto_defs.AM_PROTO_ACTYPE_TYPE:
					idname = 'type_id';
					break;
				case am_proto_defs.AM_PROTO_ACTYPE_STAFFCDNAME:
				case am_proto_defs.AM_PROTO_ACTYPE_CDNAME:
					idname = 'cn_id';
					break;
				default:
					idname = 'id';								// MD商品分析
				}

				if (chkId.length > 0) {
					var selectlist = this.getData(chkId, idname);
					var html_source = '';
					for (var i = 0; i < selectlist.length; i++) {
						var select = selectlist[i];

						// 追加可能な要素数を超えている場合はこれ以上追加しない
						if (num == clcom.list_max) {
							this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.number_overflow, [clcom.list_max])});
							break;
						}
						// 重複チェック
						if(idlist[select[idname]]){
							// 重複する場合は追加しない
							continue;
						}
						// 重複していない場合は追加
						var newdata = {};
						newdata.val = select[idname];
						newdata.code = select.code;
						newdata.name = select.name;
						newdata.kind = anaattr.kind;
						newdata.name2 = anaattr.name;

						html_source += this.makeEditTmp(newdata, idname);
						num++;
					}
					this.$('#ca_MDCMV1280_edit_tbl').append(html_source);
				} else {
					// なにもしない
				}
				// 全選択チェックボックスを初期化
				this.chkall.init();


				break;
			case am_proto_defs.AM_PROTO_ACTYPE_ORG:
				break;
			case am_proto_defs.AM_PROTO_ACTYPE_DMPROM:
			case am_proto_defs.AM_PROTO_ACTYPE_POSPROM:
			case am_proto_defs.AM_PROTO_ACTYPE_BUSIASS:
			case am_proto_defs.AM_PROTO_ACTYPE_UNIV:
			case am_proto_defs.AM_PROTO_ACTYPE_TIEUP:
				// No79対応 2015/9/24 藤岡
				// 選択済項目のIDを取得
				var chkId = [];
				$.each(this.$('#ca_MDCMV1280_tbody').find("[name=ca_MDCMV1280_chk]:checked"), function() {
					var tr = $(this).closest('tr');
					chkId.push(tr.get(0).id);
				});
				
				// チェックに使用するID名称を判別
				var idname = '';
				if (anaattr.kind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_DMPROM){
					idname = 'dmprom_id';
				}
				else if (anaattr.kind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_POSPROM){
					idname = 'posprom_id';
				}
				else if (anaattr.kind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_UNIV){
					idname = 'univ_id';
				}
				else if (anaattr.kind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_TIEUP){
					idname = 'tieup_id';
				}
				else if (anaattr.kind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_BUSIASS){
					idname = 'busiass_id';
				}
				
				if (chkId.length > 0) {
					// 検索結果から選択項目を取得
					var selectlist = this.getSearchBoxData(chkId, this.resultList);
					var html_source = '';
					for (var i = 0; i < selectlist.length; i++) {
						var select = selectlist[i];
						
						// 追加可能な要素数を超えている場合はこれ以上追加しない
						if (num == clcom.list_max) {
							this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.number_overflow, [clcom.list_max])});
							break;
						}
						// 重複チェック
						if(idlist[select[idname]]){
							// 重複する場合は追加しない
							continue;
						}
						// 重複していない場合は追加
						var newdata = {};
						newdata.val = select[idname];
						newdata.code = select.code;
						newdata.name = select.name;
						newdata.attr = anaattr.attr;
						newdata.name2 = anaattr.name;
						newdata.kind = anaattr.kind;
						
						// 選択済領域のhtml作成
						html_source += this.makeEditTmp(newdata, idname);
						num++;
					}
					// 追加項目を選択済領域に描画
					this.$('#ca_MDCMV1280_edit_tbl').append(html_source);				
				} else {
					// なにもしない
				}
				// 全選択チェックボックスを初期化
				this.chkall.init();
				// No79対応ここまで
			default:
				if (Number(anaattr.kind) == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_T_DISC_PROM) {
					var chkId = [];
					$.each(this.$('#ca_MDCMV1280_tbody').find("[name=ca_MDCMV1280_chk]:checked"), function() {
						var tr = $(this).closest('tr');
						chkId.push(tr.get(0).id);
					});
	
					var idname = 'type_id';
	
					if (chkId.length > 0) {
						var selectlist = this.getData(chkId, idname);
						var html_source = '';
						for (var i = 0; i < selectlist.length; i++) {
							var select = selectlist[i];
	
							// 追加可能な要素数を超えている場合はこれ以上追加しない
							if (num == clcom.list_max) {
								this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.number_overflow, [clcom.list_max])});
								break;
							}
							// 重複チェック
							if(idlist[select[idname]]){
								// 重複する場合は追加しない
								continue;
							}
							// 重複していない場合は追加
							var newdata = {};
							newdata.val = select[idname];
							newdata.code = select.code;
							newdata.name = select.name;
							newdata.kind = anaattr.kind;
							newdata.name2 = anaattr.name;
	
							html_source += this.makeEditTmp(newdata, idname);
							num++;
						}
						this.$('#ca_MDCMV1280_edit_tbl').append(html_source);
					}
					// 全選択チェックボックスを初期化
					this.chkall.init();
				}
				break;
			}
			// アニメーション表示のための初期化
			clutil.initUIelement(this.$el);
		},

		// Idより選択されたデータを取得
		getData : function(chkId, idname){
			var selectData = [];
			for (var i = 0; i < this.typelist.length; i++) {
				var data = this.typelist[i];
				for (var j = 0; j < chkId.length; j++) {
					var selectId = chkId[j];
					if (data[idname] == selectId) {
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
			html_source += '<li id="' + data.kind + '"><span>';
			if (clutil.chkStr(data.code)) {
				html_source +=  data.code + ':';
			} else {
				data.code = "";
			}
			html_source +=  data.name + '</span><span class="code">';
			html_source += data.name2 + '</span><span class="btn-delete ca_MDCMV1280_edit_del"></span>'
			html_source += '<input type="hidden" name="kind" value="' + data.kind + '">';
//			html_source += '<input type="hidden" name="attr" value="' + data.attr + '">';
			html_source += '<input type="hidden" name="val" value="' + data.val + '">';
			if(data.val2){
				html_source += '<input type="hidden" name="val2" value="' + data.val2 + '">';
			}
			html_source += '<input type="hidden" name="name" value="' + data.name + '">';
			html_source += '<input type="hidden" name="name2" value="' + data.name2 + '">';
			html_source += '<input type="hidden" name="code" value="' + data.code + '">';
			html_source += '</li>';

			return html_source;
		},

		/**
		 * 編集領域単一削除ボタン
		 */
		_onEditDelClick: function(e) {
			// クリックされた行を削除する
			$(e.target).closest("li").fadeOut(300).queue( function(){ this.remove() });
			this.$('#ca_MDCMV1280_add').focus();
		},

		/**
		 * 編集領域すべて削除ボタン押下
		 */
		_onEditDelAllClick: function() {
			// 削除対象IDリストを取得する
			var idlist = [];
			var html_source = '';
			this.$('#ca_MDCMV1280_edit_tbl').html("");
			this.$('#innerScroll').perfectScrollbar('update');
		},

		/**
		 * テーブルに表示されている編集リストを取得する
		 */
		getEditList : function() {
			var editlist = [];
			editlist = clutil.tableview2data(this.$('#ca_MDCMV1280_edit_tbl').children());
			return editlist;
		},

		
		// 2015/9/24 No79対応 藤岡
		/**
		 * 検索ボタン押下
		 */
		_onSearchboxSearchClick: function() {
			var retStat = true;
			if(!this.validator.valid()){
				retStat = false;
			}
			
			// 画面の情報を取得する
			var searchData = clutil.view2data(this.$('#ca_MDCMV1280_searchbox_div'), 'ca_MDCMV1280_');
			this.req = {
					cond : searchData
			};
			
			//結果表示(ページャー)
			this.onSearchboxPageClick(1, clcom.itemsOnPage);
		},
		
		/**
		 * クリアボタン押下
		 */
		_onSearchboxClearClick: function() {
			clutil.viewClear(this.$('#ca_MDCMV1280_searchbox_div'));
			// validatorの初期化
			this.validator.clear();
		},
		
		// ページャークリック
		onSearchboxPageClick: function(pageNumber, itemsOnPage, isPager) {

			// 結果状態をクリアする
			var _this = this;
			this.clearResult();
			
			var index = itemsOnPage * (pageNumber - 1);
			var pagedata = {
				start_record : index,			// index番目のデータから(0～)
				page_size : itemsOnPage			// 1ページに表示する件数を要求
			};

			this.req.pagereq = pagedata;

			// データを取得
			var uri = '';
			
			
			if (this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_DMPROM){
				uri = 'aman_se_dmprom_srch';
			}
			else if (this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_POSPROM){
				uri = 'aman_se_posprom_srch';
			}
			else if (this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_UNIV){
				uri = 'aman_se_univ_srch';
			}
			else if (this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_TIEUP){
				uri = 'aman_se_tieup_srch';
			}
			else if (this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_BUSIASS){
				uri = 'aman_se_busiass_srch';
			}
			else {
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				// ページャーの初期化
				this.onSearchboxInitPager(1, itemsOnPage, 0);
				return;
			}
			
			clutil.postJSON(uri, this.req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
			
					this.resultList = data.list;
					
					// 追加ボタン表示
					$('#ca_MDCMV1280_add').show();
					
//					this.typelist = clutil.gettypelist(anaattr.xtype);
//					this.$('#ca_MDCMV1280_tbody_type_tmp').tmpl(this.typelist).appendTo('#ca_MDCMV1280_tbody');
			
					if (this.resultList == null || this.resultList.length == 0) {
						this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
						this.$('#result').show();
					} else {
			
						var no = 1;	//表示番号セット
						// 取得したデータを表示する
						$.each(this.resultList, function() {
							this.numList = no++;
							if (_this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_DMPROM){
								this.id = this.dmprom_id;
							}
							else if (_this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_POSPROM){
								this.id = this.posprom_id;
							}
							else if (_this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_UNIV){
								this.id = this.univ_id;
							}
							else if (_this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_TIEUP){
								this.id = this.tieup_id;
							}
							else if (_this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_BUSIASS){
								this.id = this.busiass_id;
							}
						});

						// 選択モード（nullの場合は単一選択）
						switch (this.select_mode) {
						case clutil.cl_multiple_select:
							if(_this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_BUSIASS){
								$select_template = this.$('#ca_MDCMV1280_tbody_multiple_tmp');
							}
							else{
								$select_template = this.$('#ca_MDCMV1280_tbody_multiple_kana_tmp');
							}
							break;
						default:
							if(_this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_BUSIASS){
								$select_template = this.$('#ca_MDCMV1280_tbody_single_tmp');
							}
							else{
								$select_template = this.$('#ca_MDCMV1280_tbody_single_kana_tmp');
							}
							break;
						}
						// 取得したデータを表示する
						$select_template.tmpl(this.resultList).appendTo('#ca_MDCMV1280_tbody');
						clutil.initUIelement(this.$('#ca_MDCMV1280_tbl'));
						
						// 検索ボタン押下時は検索条件エリアを閉じる
						if (!isPager) {
							$('#ca_MDCMV1280_searchbox_div').addClass("dispn");
							$('#ca_MDCMV1280_searchArea').addClass("dispn");
							$('#searchAgain').fadeIn();
							$('#result').removeClass("dispn");
							// エキスパンダ
							$('.fieldUnitsHidden').hide();
							$('.expand').show();
							$('.unexpand').hide();
						}
						// 総レコード数
						var totalRec = data.pagersp.total_record;
						// ページャーの初期化
						this.onSearchboxInitPager(pageNumber, itemsOnPage, totalRec);

						// ヘッダソートが存在すればマークを付加する
						this.onSearchboxSetSort(this.req);
					}
					
				} else {
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					// ページャーの初期化
					this.onSearchboxInitPager(1, itemsOnPage, 0);
				}
				
				if(_this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_BUSIASS){
					this.$('.ca_th_kana').hide();
				}
				else{
					this.$('.ca_th_kana').show();
				}

				if (this.$('#searchAgain').css('display') == 'none') {
					// 検索ボタンにフォーカスする
					this.$('#ca_MDCMV1280_search').focus();
				} else {
					// 再検索ボタンにフォーカスする
					this.$('#searchAgain').focus();
				}
			}, this));
		},
		
		/**
		 * ソートIDが存在すればヘッダにマークをつける
		 */
		onSearchboxSetSort: function(req) {
			if (req == null || req.sortreq == null) {
				return;
			}
			var sortreq = req.sortreq;
			var th = this.$('#ca_MDCMV1280_tbl').find('th[key=' + sortreq.key + ']');
			if (sortreq.sort_order == am_proto_sort_req.AM_PROTO_SORT_ORDER_ASCENDING) {
				$(th).addClass('sortAsc');
			} else {
				$(th).addClass('sortDsc');
			}
		},
		
		/**
		 * ソートキー初期化
		 */
		onSearchboxInitSort: function() {
			this.$('th.ca_th_sort').removeClass('sortAsc');
			this.$('th.ca_th_sort').removeClass('sortDsc');
		},
		
		/**
		 * テーブルヘッダ click
		 */
		_onSearchboxThSortClick: function(e) {
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
			this.onSearchboxInitSort();
			
			if (this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_DMPROM){
				sortKey = aman_se_dmprom_srch_if['AMAN_PROTO_SORT_KEY_' + key];
			}
			else if (this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_POSPROM){
				sortKey = aman_se_posprom_srch_if['AMAN_PROTO_SORT_KEY_' + key];
			}
			else if (this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_UNIV){
				sortKey = aman_se_univ_srch_if['AMAN_PROTO_SORT_KEY_' + key]; 
			}
			else if (this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_TIEUP){
				sortKey = aman_se_tieup_srch_if['AMAN_PROTO_SORT_KEY_' + key]; 
			}
			else if (this.srchKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_TRANATTR_BUSIASS){
				sortKey = aman_se_busiass_srch_if['AMAN_PROTO_SORT_KEY_' + key]; 
			}
			
			// ソートキーを挿入
			this.req['sortreq'] = {
					sort_key : sortKey,
					sort_order : sort_order,
					key : key
			};

			// 検索エリアは隠さない
			this.onSearchboxPageClick(1, clcom.itemsOnPage, true);
		},
		
		/**
		 * 検索結果から選択条件取得
		 */
		getSearchBoxData:function(idList, resultList){
			var sendList = [];
			var i = 0;
			var j = 0;
			
			for(i=0;i<resultList.length;i++){
				for(j=0;j<idList.length;j++){
					if(resultList[i].id == idList[j]){
						sendList.push(resultList[i]);
					}
				}
			}
			return sendList;
		},
		
		
		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchboxSearchAgainClick: function() {
			$('#ca_MDCMV1280_searchbox_div').removeClass("dispn");
			$('#ca_MDCMV1280_searchArea').removeClass("dispn");
			$('#searchAgain').fadeOut();
			$('#result').addClass("dispn");
			$('#ca_MDCMV1280_add').hide();
		},
		
		/**
		 * ページャーの初期化
		 * @param itemsOnPage
		 * @param totalCount
		 */
		onSearchboxInitPager: function(pageNumber, itemsOnPage, totalCount) {
			var _this = this;
			this.$('#ca_MDCMV1280_pager1').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_MDCMV1280_pager_displaypanel1'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時
					_this.onSearchboxPageClick(pageNumber, itemsOnPage, true);
				},
				onSelectChange: function(itemsOnPage) {
					// 表示件数変更時
					_this.onSearchboxPageClick(1, itemsOnPage, true);
				}
			});
			this.$('#ca_MDCMV1280_pager2').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_MDCMV1280_pager_displaypanel2'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時
					_this.onSearchboxPageClick(pageNumber, itemsOnPage);
				},
				onSelectChange: function(itemsOnPage) {
					// 表示件数変更時
					_this.onSearchboxPageClick(1, itemsOnPage, true);
				}
			});
		},
		
		// 2015/9/24 No79対応 ここまで
		
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
