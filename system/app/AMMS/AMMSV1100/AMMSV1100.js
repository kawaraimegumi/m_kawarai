useSelectpicker2();

var iagfunc = {
		 ITEMATTRGRPFUNC_ID_SUBCLS1:      1,   // サブクラス1
		 ITEMATTRGRPFUNC_ID_SUBCLS2:      2,   // サブクラス2
		 ITEMATTRGRPFUNC_ID_USETYPE:      3,   // 用途区分
		 ITEMATTRGRPFUNC_ID_COLOR:        4,   // カラー
		 ITEMATTRGRPFUNC_ID_SEASON:       5,   // シーズン
		 ITEMATTRGRPFUNC_ID_BRAND:        6,   // ブランド
		 ITEMATTRGRPFUNC_ID_STYLE:        7,   // スタイル
		 ITEMATTRGRPFUNC_ID_DESIGN:       8,   // 柄
		 ITEMATTRGRPFUNC_ID_MATERIAL:     9,   // 素材
		 ITEMATTRGRPFUNC_ID_COUNTRY:      10,  // 国
		 ITEMATTRGRPFUNC_ID_FACTORY:      11,  // 縫製工場
		 ITEMATTRGRPFUNC_ID_PARTS:        12,  // 部位
		 ITEMATTRGRPFUNC_ID_TAGMATERIAL:  13,  // 素材(タグ用)
		 ITEMATTRGRPFUNC_ID_SUBDESIGN:    14,  // サブ柄
		 ITEMATTRGRPFUNC_ID_DESIGNCOLOR:  15,  // ベース色(柄色)
		 ITEMATTRGRPFUNC_ID_CURRENCY:     16,  // 通貨
		 ITEMATTRGRPFUNC_ID_MODELNOPLACE: 17,  // 部位(型番)
		 ITEMATTRGRPFUNC_ID_ITOLOX:       18,  // 糸LOX
};

var MATERIAL_CODE_OTHER = '999';	/* 素材コード（その他）or（手入力） */
var IMPORT_CODE_JAPAN = '001';		/* 国コード（日本） */
var IMPORT_ID_OTHER = 32767;		/* 国ID（その他） */
var FACTORY_ID_OTHER = 32767;		/* 縫製工場ID（その他） */

var OpeType = {
	AMMSV1100_OPETYPE_TMP_SAVE:		101,	// 保存
	AMMSV1100_OPETYPE_TAG_APPLY:	102,	// タグ発行申請
	AMMSV1100_OPETYPE_TAG_RETURN:	103,	// タグ発行差戻し
	AMMSV1100_OPETYPE_TAG_APPROVE:	104,	// タグ発行承認
	AMMSV1100_OPETYPE_LAST_APPLY:	105,	// 最終承認申請
	AMMSV1100_OPETYPE_LAST_RETURN:	106,	// 最終承認差戻し
	AMMSV1100_OPETYPE_LAST_APPROVE:	107,	// 最終承認
	AMMSV1100_OPETYPE_OUTPUT:		201,
};

var TagType = {
	'111': [
		'#div_ca_name',
		'div[name="div_color"]',
		'div[name="div_size"]',
		'#div_ca_makerID',
		'#div_ca_kiTypeID',
		'#div_ca_makerItemCode',
		'#div_ca_itemTypeID',
		'#div_ca_year',
		'#div_ca_seasonID',
		'#div_ca_itgrpID',
		'#div_ca_priceIntax',
		'#div_ca_setupFlagg',
		'#div_ca_selloutYear',
	],
	'112': [
			'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
	],
	'113': [
			'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
	],
	'114': [
			'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_priceIntax',
			'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
	],
	'115': [
			'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_priceIntax',
			'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
	],
	'116': [
			'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_priceIntax',
			'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
	],
	'131': [
			'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_priceIntax',
			'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
	],
	'132': [
			//'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			//'#div_ca_makerID',
			//'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			//'#div_ca_itemTypeID',
			//'#div_ca_year',
			//'#div_ca_seasonID',
			//'#div_ca_itgrpID',
			//'#div_ca_priceIntax',
			//'#div_ca_price',
			//'#div_ca_setupFlagg',
			//'#div_ca_selloutYear',
	],
	'133': [
			'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_priceIntax',
			'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
	],
	'171': [
	],
	'172': [
	],
	'173': [
	],
	'174': [
	],
	'175': [
	],
	'176': [
	],
	'811': [
			//'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			//'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			//'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_priceIntax',
			'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
			'#div_ca_tagImportID',
			'#div_ca_tagHighlight',
			'#div_ca_table_material',
	],
	'812': [
			//'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			//'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			//'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_priceIntax',
			'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
			'#div_ca_tagImportID',
			'#div_ca_tagHighlight',
			'#div_ca_table_material',
	],
	'813': [
			//'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			//'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			//'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_priceIntax',
			'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
			'#div_ca_tagImportID',
			'#div_ca_tagHighlight',
			'#div_ca_table_material',
	],
	'814': [
			//'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			//'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			//'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_priceIntax',
			'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
			'#div_ca_tagImportID',
			'#div_ca_tagHighlight',
			'#div_ca_table_material',
	],
	'815': [
			//'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			//'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			//'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_priceIntax',
			'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
			'#div_ca_tagImportID',
			//'#div_ca_tagHighlight',
			//'#div_ca_table_material',
	],
	'816': [
			//'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			//'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			//'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_priceIntax',
			'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
			'#div_ca_tagImportID',
			//'#div_ca_tagHighlight',
			//'#div_ca_table_material',
	],
	'831': [
			//'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			//'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			//'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_priceIntax',
			'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
			'#div_ca_tagImportID',
			//'#div_ca_tagHighlight',
			//'#div_ca_table_material',
	],
	'832': [
			//'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			//'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			//'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			//'#div_ca_priceIntax',
			//'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
			'#div_ca_tagImportID',
			//'#div_ca_tagHighlight',
			//'#div_ca_table_material',
	],
	'833': [
			//'#div_ca_name',
			'div[name="div_color"]',
			'div[name="div_size"]',
			'#div_ca_makerID',
			//'#div_ca_kiTypeID',
			'#div_ca_makerItemCode',
			//'#div_ca_itemTypeID',
			'#div_ca_year',
			'#div_ca_seasonID',
			'#div_ca_itgrpID',
			'#div_ca_priceIntax',
			'#div_ca_price',
			'#div_ca_setupFlagg',
			'#div_ca_selloutYear',
			'#div_ca_tagImportID',
			//'#div_ca_tagHighlight',
			//'#div_ca_table_material',
	],
};

$(function() {

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var offset = $("#ca_name").offset();
	$(window).scroll(function() {
		try {
			/* header出したり @tori 2013/3/26 */
			if(offset){
				st = $(window).scrollTop();
				if(offset.top > st){
					$("#masterHeaditem").hide();
				}else{
					// 表示内容をかき集める

					// 事業ユニット
					var unitID = $("#ca_unitID").val();
					if (unitID != 0) {
						var unitTxt = $("#ca_unitID").find('option:selected').text();
						var tmp = unitTxt.split(':');
						if (tmp.length > 1) {
							unitTxt = tmp[1];
						}
						$("#mhi_unitID").text(unitTxt);
						$("#mhi_unitID").removeClass('unfilled');
					} else {
						$("#mhi_unitID").text("未入力");
						$("#mhi_unitID").addClass('unfilled');
					}

					// 品種
					var itgrpID = $("#ca_itgrpID").autocomplete('clAutocompleteItem');
					var itgrpTxt = (itgrpID != null && itgrpID.name != null) ? itgrpID.name : "";
					if (itgrpTxt != "") {
						$("#mhi_itgrpID").text(itgrpTxt);
						$("#mhi_itgrpID").removeClass('unfilled');
					} else {
						$("#mhi_itgrpID").text("未入力");
						$("#mhi_itgrpID").addClass('unfilled');
					}

					// メーカー名
					var makerID = $("#ca_makerID").autocomplete('clAutocompleteItem');
					var makerTxt = (makerID != null && makerID.name != null) ? makerID.name : "";
					if (makerTxt != "") {
						$("#mhi_makerID").text(makerTxt);
						$("#mhi_makerID").removeClass('unfilled');
					} else {
						$("#mhi_makerID").text("未入力");
						$("#mhi_makerID").addClass('unfilled');
					}

					// メーカー品番
					var makerItemCode = $("#ca_makerItemCode").val();
					if (makerItemCode != "") {
						$("#mhi_makerItemCode").text(makerItemCode);
						$("#mhi_makerItemCode").removeClass('unfilled');
					} else {
						$("#mhi_makerItemCode").text("未入力");
						$("#mhi_makerItemCode").addClass('unfilled');
					}

					// 商品名
					var name = $("#ca_name").val();
					if (name != "") {
						$("#mhi_name").text(name);
						$("#mhi_name").removeClass('unfilled');
					} else {
						$("#mhi_name").text("未入力");
						$("#mhi_name").addClass('unfilled');
					}

					$("#masterHeaditem").fadeIn();
				}
			}
		} catch (e) {

		}
	});

	//////////////////////////////////////////////
	// 上代履歴ダイアログView
	var AMMSV1102DialogView = Backbone.View.extend({

		screenId : "AMMSV1100",
		dialogId : "AMMSV1102",
		categoryId : "AMMS",
		validator: null,

		events: {
			"click #ca_AMMSV1102_commit": "_onCommitClick",
		},

		initialize: function(opt) {
			var defaults = {
				search_date: clcom.getOpeDate(),			// 運用日
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

			this.$('#mainColumninBox').addClass('noLeftColumn');
			this.$('#mainColumnFooter').addClass('noLeftColumn');

			clutil.initUIelement(this.$el);
		},

		/**
		 * 選択画面の初期化処理
		 *
		 * 初期化後にshow()の呼び出し前に必ず呼び出すこと
		 *
		 * @method render
		 * @for AMPAV0010SelectorView
		 */
		render: function() {
			var url = clcom.urlRoot + "/system/app/" + this.categoryId + "/" + this.screenId + "/" + this.dialogId + ".html";

			// HTMLソースを読み込む
			clutil.loadHtml(url, _.bind(function(data) {
				this.html_source = data;
			}, this));

			return this;
		},

		show: function(histList, isSubDialog, options) {
			if (arguments.length === 1 && _.isObject(histList) && !_.isArray(histList)){
				options = histList;
				histList = options.histList;
				isSubDialog = options.isSubDialog;
			}

			options || (options = {});

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
			this.validator = clutil.validator(this.$('#ca_AMMSV1102_main'), {
				echoback		: $('.cl_echoback')
			});

			var _this = this;
			// 上代履歴テーブル描画
			var $tbody = this.$("#ca_table_price_hist_tbody");

			$.each(histList, function() {
				var tr = _.template(_this.$("#ca_rec_template_hist").html(), this);
				$tbody.append(tr);
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
			clutil.setFocus(this.$('#ca_AMMSV1102_commit'));
		},

		/**
		 * 戻る
		 */
		_onCommitClick: function() {
			this.$parentView.show();
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
		}

	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		editTypes: {},

		UNITID_AOKI: 0,
		UNITID_ORI: 0,

		warningMsg: '必須項目が入力されていません。このまま一時保存しますか？',
		f_confirm: true,

		events: {
			'click #ca_srch': "_onSrchClick",

			// 事業ユニット変更イベント
			'change #ca_unitID': '_onUnitIDChange',

			'change #ca_materialID': "_onMaterialIDChange",
			'change #ca_inputJanFlag': "_onInputJanFlagChange",
			'change #ca_orderFlag': "_onOrderFlagChange",
			'change #ca_tagIssueFlag': '_onTagIssueFlagChange',
			'change #ca_tagTypeID': '_onTagTypeChange',

			// 納品形態変更イベント
			'change #ca_dlvroute1TypeID': '_onDlvrouteTypeChange',
			'change #ca_dlvroute2TypeID': '_onDlvrouteTypeChange',

			'change #ca_seasonID': '_onSeasonChange',
			'change #ca_subSeasonID': '_onSubSeasonChange',

			'change #ca_importID': '_onImportChange',
			'change #ca_salesStartDate': 'setDefaultYear',
			'clDatepickerOnSelect #ca_salesStartDate': 'setDefaultYear',

			'click #expand_cloth': "_onExpandClothClick",
			'click #expand_spec': "_onExpandSpecClick",
			'click #expand_cost': "_onExpandCostClick",
			'click #expand_price': "_onExpandPriceClick",
			'click #expand_any': "_onExpandAnyClick",

			// タグイメージ
			'click .viewTag': '_onViewTagClick',

			'click #btn_price_hist': "_onPriceHistClick",

			'click #ca_table_modelno_tfoot td[name="modelno_add_btn_tfoot"]': "_onModelNoAddRow",
			'click #ca_table_modelno_tbody td[name="modelno_del_btn_tbody"]': "_onModelNoDelRow",

			'click td[name="color_add_btn_tfoot"]': "_onColorAddRow",
			'click td[name="color_del_btn_tbody"]': "_onColorDelRow",

			'click td[name="price_zone_add"]': "_onPriceZoneAddRow",
			'click td[name="org_del_btn_tbody"]': "_onPriceOrgDelRow",

			'click td[name="price_store_add"]': "_onPriceStoreAddRow",

			'click td[name="tgt_add_btn_tfoot"]': "_onTgtAddRow",
			'click td[name="tgt_del_btn_tbody"]': "_onTgtDelRow",

			'change #ca_sizePtnID': "_onSizePtnChange",
			'click [name="span_addColorSize"]': "_onAddColorSizeClick",

			// カラー・サイズ削除
			'click div[name="del_color_size"]': '_onDelColorSizeClick',

			'click #span_addOrderInfo': "_onAddOrderInfoClick",

			'change tbody[name="ca_table_size_tbody"] [name="select_head_all"]': '_onSizeSelectHeadAll',
			'change tbody[name="ca_table_size_tbody"] [name="select_head_col"]': '_onSizeSelectHeadCol',

			'change tbody[name="ca_table_size_tbody"] input[name="select_row_all"]': '_onSizeSelectRowAll',
			//'click tbody[name="ca_table_size_tbody"] input[name="select_col"]': '_onSizeSelectCol',

			'change #ca_limitFlag': "_onLimitFlagChanged",

			'change select[name="ca_placeID"]': '_onPlaceChange',
			'change select[name="ca_tagMaterialID"]': '_onTagMaterialChange',

			'click div.fieldBox.mainPic>div.hover': "_onPhotoSelectClick",

			'change input[name="ca_orderQy"]': 'changeOrderQty',
			// カラーテーブル
			'change tbody[name="ca_table_color_tbody"] [name="ca_colorID"]': '_onColorIDChanged',
			'change tbody[name="ca_table_size_tbody"] [name="select_col"]': '_onSelectColChanged',

			// 上代
			'change #ca_priceIntax': '_onPriceIntaxChange',
			// 上代(税抜)
			'change #ca_price': '_onPriceChange',
			// 下代
			'change #ca_cost': '_onCostChange',
			// 組合せ販売
			'click #btn_bundleView': '_onBundleViewClick',
			// メーカーID変更
			'cl_change #ca_makerID': '_onMakerIDChange',
			// 下代構成
			'change #ca_table_cost_in_tbody input[name="ca_costDtl"]': '_onCostDtlChanged',
			// 指定上代
			'change input[name="ca_orgPriceIntax"]': '_onOrgPriceIntraxChanged',

			// 商品仕様
			'change select[name="ca_specID"]': '_onChangeSpecID',

			// MD-3529 商品マスタ「タグ送付先」の入力制御変更_PGM開発：タグ発行区分
			'cl_change #div_ca_tagIssueID': '_onTagIssueIDChange',
		},

		/**
		 * 初期化
		 * @param opt
		 */
		initialize: function(opt){
			_.bindAll(this);

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var subtitle = clutil.opeTypeIdtoString(o.opeTypeId);
				var mdOpt = {
					title: '商品マスタ',
					subtitle: subtitle,
					confirmLeaving: true,
					opeTypeId: o.opeTypeId,
					btns_dl: [
						{
							opeTypeId: 201,
							label: '商品発注台帳出力(A4)'
						},
						{
							opeTypeId: 202,
							label: '商品発注台帳出力(B4)'
						}
					],
//					btn_csv: false,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					isConfirmLeaving: this._isConfirmLeaving,

					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined
				};
				if(o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					// 参照モード以外は、下部 Ope ボタンをカスタマイズする。
					_.extend(mdOpt, {
						opeTypeId: [
							{
								opeTypeId: 101,
								label: '一時保存'
							},
							{
								opeTypeId: 102,
								label: 'タグ発行申請'
							},
							{
								opeTypeId: 103,
								label: '最終承認申請'
							},
						],
						btn_cancel: true,
						btn_submit: true,
						btn_csv: false
					});
				}
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			// アプリ個別の View や部品をインスタンス化するとか・・・

			var ids = [];
			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				ids = [amcm_type.AMCM_VAL_ITEM_EDIT_NEW];
				this.setEditTypeSelect(ids);
				this.f_confirm = false;
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}
			clutil.mediator.on('onOperation', this._doOpeAction);	// PDF出力用

			this.opeTypeId = fixopt.opeTypeId;	// 処理区分を保存

			clutil.mediator.on('onSizePtnJanChanged', this._onSizePtnJanChanged);

			// 事業ユニットのIDをシスパラから取得
			this.UNITID_AOKI = clcom.getSysparam(amcm_sysparams.PAR_AMMS_UNITID_AOKI);
			this.UNITID_ORI = clcom.getSysparam(amcm_sysparams.PAR_AMMS_UNITID_ORI);
			sizeptn_sort_col_row = clcom.getSysparam("PAR_AMCM_SIZEPTN_SORT_COL_ROW");
			if (sizeptn_sort_col_row != null) {
				this.SIZEPTN_SORT_COL_ROW_LIST = sizeptn_sort_col_row.split(",");
			}

			// SPCチェック対象品種IDをシスパラから取得
			var spcitgrp_str = clcom.getSysparam("PAR_AMMS_SPC_CHECK_ITGRPIDS");
			var tmp_scpitgrp_array = spcitgrp_str == null ? [] : spcitgrp_str.split(",");
			this.scpitgrp_array = [];
			for (var i=0; i < tmp_scpitgrp_array.length; i++) {
				var obj = tmp_scpitgrp_array[i];
				var num = parseInt(obj, 10);
				if (!_.isNaN(num)) {
					this.scpitgrp_array.push(num);
				}
			}
		},

		setEditTypeSelect: function(ids) {
			var $select = $("#ca_editTypeID");
			var typeList = clcom.getTypeList(amcm_type.AMCM_TYPE_ITEM_EDIT, ids);

			clutil.cltypeselector2($select, typeList, 1, null, 'type_id');
			if (ids.length == 1) {
				$select.selectpicker('val', typeList[0].type_id);
			}
		},

		/**
		 * Submit 応答のイベントを受ける
		 */
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.mdBaseView.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				/*
				 * 個別JANエラー対応
				 */
				var rspHead = args.data.rspHead;
				if (rspHead.fieldMessages != null && rspHead.fieldMessages.length > 0) {
					var $tbody_jan = $('tbody[name="ca_table_jan_tbody"]');
					_.each(rspHead.fieldMessages, _.bind(function(fm) {
						// 対象は"janCode"
						if (fm.field_name != "janCode") {
							return;
						}
						var janCode = fm.args[5];
						_.each($tbody_jan.find('input[name="ca_janCode"]'), _.bind(function(tgt) {
							var $input = $(tgt);
							if ($input.val() == janCode) {
								var msgcode = clutil.getclmsg(fm.message);
								var msg = clutil.fmtargs(msgcode, fm.args);
								this.validator.setErrorMsg($input, msg);
							}
						}, this));
					}, this));
				}
				if (rspHead.message == "EMS0168") {
					this.validator.setErrorMsg($("#ca_tagTypeID"), clmsg.EMS0168);
				}
				break;
			}
		},

		/**
		 * 検索条件部(?)再現用のオブジェクトを作成
		 * @param item
		 * @returns
		 */
		_createReq: function(item) {
			item = item == null ? {} : item;
			var req = {
				itemID: item.id,
				unitID: item.unitID,
				itgrpID: {
					id: item.itgrpID,
					code: item.itgrpCode,
					name: item.itgrpName,
				},
				editTypeID: 0,	// TODO
			};
			return req;
		},

		/**
		 * 基本情報部再現用オブジェクトを作成
		 * @param item 商品マスタレコード
		 * @param attr 商品属性マスタ(基本)レコード
		 * @returns {___anonymous3334_3596}
		 */
		_createBaseInfo: function(item, attr, info) {
			item = item == null ? {} : item;
			attr = attr == null ? {} : attr;
			info = info == null ? {} : info;

			var fromDate = (item.fromDate == null || item.fromDate == 0) ? 0 : item.fromDate;
			var toDate = (item.toDate == null || item.toDate == 0) ? 0 : item.toDate;
			var clothOrderDate = attr.clothOrderDate < clcom.min_date ? 0 : attr.clothOrderDate;
			var clothDlvDate = attr.clothDlvDate < clcom.min_date ? 0 : attr.clothDlvDate;

			var base = {
				approveLimitDate: info.approveLimitDate,
				fromDate: fromDate,
				toDate: toDate,
				id: item.id,
				makerID: {
					id: item.makerID,
					code: item.makerCode,
					name: item.makerName,
				},
				makerItemCode: item.makerItemCode,
				name: item.name,
				itemTypeID: attr.itemTypeID,
				seasonID: attr.seasonID,
				subSeasonID: attr.subSeasonID,
				subcls1ID: attr.subcls1ID,		// サブクラス1用のコンボボックスを作成
				subcls2ID: attr.subcls2ID,		// サブクラス2用のコンボボックスを作成
				brandID: attr.brandID,			// ブランド用のコンボボックスを作成
				styleID: attr.styleID,			// スタイル
				materialID: attr.materialID,	// 素材
				materialText: attr.materialText,// 素材テキスト
				designID: attr.designID,		// 柄ID
				subDesignID: attr.subDesignID,	// サブ柄ID
				//designColorID: attr.designColorID, // ベース色
				usetypeID: attr.usetypeID,		// 用途区分

				centerStockFlag: attr.centerStockFlag,	// 倉庫在庫開示フラグ
				inputJanFlag: attr.inputJanFlag,		// JAN手入力フラグ
				orderFlag: attr.orderFlag,				// 仕入無しフラグ

				// 生地情報
				quality: attr.quality,
				clothMaker: attr.clothMaker,
				tmpClothCode: attr.tmpClothCode,
				clothCode: attr.clothCode,
				clothOrderDate: clothOrderDate,
				clothDlvDate: clothDlvDate,

				// 商品仕様
				specComment: attr.specComment,
				specCommentID: attr.specCommentID,
			};
			return base;
		},

		_createHead: function(item, attr, info, price, orderDtlList) {
			var profitRate = "";
			var orderQy = 0;
			var maxOrderSeq = 0;
			if (orderDtlList != null) {
				_.each(orderDtlList, function(o) {
					if (maxOrderSeq < o.orderSeq) {
						maxOrderSeq = o.orderSeq;
					}
				});
				var filterList = _.filter(orderDtlList, function(o) {
					return o.orderSeq == maxOrderSeq;
				});
				_.each(filterList, _.bind(function(o) {
					orderQy += o.orderQy;
				}, this));
			}
			var kiTypeList = clcom.getTypeList(amcm_type.AMCM_TYPE_KI, [attr.kiTypeID]);
			var kiCode = "",
				kiName = "";
			if (kiTypeList != null && kiTypeList.length > 0) {
				kiCode = kiTypeList[0].code;
				kiName = kiTypeList[0].name;
			}

			var head = {
				makerID: this.getCodeName(item.makerCode, item.makerName),	// メーカー
				makerItemCode: item.makerItemCode,							// メーカー品番
				name: item.name,											// 商品名
				subcls1ID: this.getCodeName(attr.subcls1Code, attr.subcls1Name), // サブクラス1
				subcls2ID: this.getCodeName(attr.subcls2Code, attr.subcls2Name), // サブクラス2
				kiTypeID: this.getCodeName(kiCode, kiName),
				cost: "",
				profitRate: profitRate,
				priceIntax: "",
				price: "",
				orderQy: "",
				orderPrice: "",
			};
			if (price != null) {
				if (price.price != 0) {
					profitRate = (price.price - price.cost) / price.price;
					profitRate = (Math.round(profitRate*1000) / 10);
				}
				head.cost = price.cost;
				head.orderQy = orderQy;
				head.orderPrice = price.cost * orderQy;
				head.profitRate = profitRate;
				head.priceIntax = price.priceIntax;
				head.price = price.price;
			}
			return head;
		},

		/**
		 * タグ情報再現用オブジェクトを作成
		 * @param attr 商品属性マスタ(基本)レコード
		 */
		_createTagInfo: function(attr) {
			attr = attr == null ? {} : attr;
			var tagTypeID = [];
			if (attr.tagTypeID) {
				tagTypeID.push(attr.tagTypeID);
			}
			if (attr.tagType2ID) {
				tagTypeID.push(attr.tagType2ID);
			}

			var tag = {
				tagIssueFlag: attr.tagIssueFlag,
				tagIssueID: attr.tagIssueID,
				tagTypeID: tagTypeID,
				fixedFormTag1Code: {
					id: attr.fixedFormTag1Code,
					code: attr.fixedFormTag1Code,
					name: attr.fixedFormTag1Name,
				},
				fixedFormTag2Code: {
					id: attr.fixedFormTag2Code,
					code: attr.fixedFormTag2Code,
					name: attr.fixedFormTag2Name,
				},
				itoloxID: attr.itoloxID,
				tagHighlight: attr.tagHighlight,
			};
			return tag;
		},

		/**
		 * カラー・サイズデータ作成
		 * @param item
		 * @returns {___anonymous10317_10355}
		 */
		_createColorSizeInfo: function(item) {
			item = item == null ? {} : item;
			var cs = {
				sizePtnID: item.sizePtnID,
			};
			return cs;
		},

		curGroupNO: 0,	// 現在のグループID（追加する時は+1すること）
		curOrderSeq: 0, // 現在の発注枝番（追加する時は+1すること）
		groupNoList: [],	// 存在するグループIDの配列

		getTgtColorID: function(tgtColor) {
			var colorID = tgtColor[0].tgtColorID;

			_.each(tgtColor, _.bind(function(c) {
				if (this.curTgtSizeMap[c.tgtColorID] != null) {
					colorID = c.tgtColorID;
					return false;
				}
			}, this));
			return colorID;
		},

		/**
		 * カラーサイズ情報描画処理
		 * @param item 商品マスタ
		 * @param citemList カラー商品マスタレコード
		 * @param csitemList カラーサイズ商品マスタレコード
		 * @param sizeRowList サイズ行レコード
		 * @param sizeColList サイズ列レコード
		 * @param sizeRecList サイズレコード
		 * @param tgtColorList 商品展開カラーレコード
		 * @param tgtSizeList 商品展開サイズレコード
		 * @param csitemList
		 */
		renderColorSizeInfo: function(item, citemList, csitemList, sizeRowList, sizeColList, sizeRecList, tgtColorList, tgtSizeList, csitemList) {
			var $div_cs = $('div[name="div_colorsize"]');
			var groupNOs = [];
			var gno2approve = {};	// グループNoが承認済みか
			var gNO2tgtColor = {};	// カラーID→商品展開カラーレコード
			var cID2CItem = {};		// カラーID→カラー商品レコード
			var cID2CSItem = {};	// カラーID→カラーサイズ商品レコード
			var cID2TgtSize = {};

			if (this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				this.groupNoList = [];	// クリア
			}

			/* カラーサイズリスト領域のクリア */
			$div_list = $div_cs.find('div[name="div_colorsize_list"]');
			if (this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && $div_list != null) {
				$div_list.empty();
			}

			/*
			 * カラーID→カラー商品レコードマップ作成
			 */
			_.each(citemList, _.bind(function(citem) {
				cID2CItem[citem.colorID] = citem;
			}, this));

			/*
			 * カラーID→カラーサイズ商品レコードマップ作成
			 */
			_.each(csitemList, _.bind(function(csitem) {
				var cID = csitem.janColorID;
				if (cID2CSItem[cID] == null) {
					cID2CSItem[cID] = [];
				}
				cID2CSItem[cID].push(csitem);
			}, this));

			/*
			 * 1.tgtColorListからgroupIDのリストを取得する。ついでにgroupID→tgtColoListを作る
			 */
			_.each(tgtColorList, _.bind(function(tgtColor) {
				groupNOs.push(tgtColor.groupNo);
				if (gNO2tgtColor[tgtColor.groupNo] == null) {
					gNO2tgtColor[tgtColor.groupNo] = [];
				}
				gNO2tgtColor[tgtColor.groupNo].push(tgtColor);

				gno2approve[tgtColor.groupNo] = tgtColor.approveFlag == 1 ? true : false;
			}, this));
			groupNOs = _.uniq(groupNOs);

			/*
			 * 2.tgtSizeListからcolorID,sizeID→tgtSizeListなオブジェクトを作成
			 */
			_.each(tgtSizeList, _.bind(function(tgtSize) {
				var cID = tgtSize.tgtColorID;
				var sID = tgtSize.tgtSizeID;

				if (cID2TgtSize[cID] == null) {
					cID2TgtSize[cID] = {};
				}
				cID2TgtSize[cID][sID] = tgtSize;
			}, this));

			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD && groupNOs.length == 0) {
				// サイズグループは一つは作っておこう
				groupNOs.push(1);
			}

			/*
			 * 1.tgtColorListの個数分{div_color,div_size,div_jan}を作成する
			 */
			_.each(groupNOs, _.bind(function(grpno) {
				this.curGroupNO = grpno;
				this.groupNoList.push(grpno);
				var obj = { groupNo: grpno };
				var html = _.template(this.$("#ca_rec_template_colorsize").html(), obj);
				$div_cs.append(html);

				var $div_cs_last = $div_cs.find('div[name="div_colorsize_list"]:last');

				// カラーテーブル描画
				var tgtColor = gNO2tgtColor[grpno];	// 配列
				var $table_color = $div_cs_last.find('table[name="ca_table_color"]');
				var $tbody_color = $table_color.children('tbody');

				if (tgtColor == null) {
					tgtColor = [];
				}
				this.renderTableColor($tbody_color, tgtColor, cID2CItem, item.itgrpID);

				// サイズテーブル描画
				var $table_size = $div_cs_last.find('table[name="ca_table_size"]');
				var $thead_size = $table_size.children('thead');
				var $tbody_size = $table_size.children('tbody');

				//var colorID = tgtColor[0].tgtColorID;
				var colorID = this.getTgtColorID(tgtColor);
				var sID2TgtSize = cID2TgtSize[colorID];
				this.renderTableSize($thead_size, $tbody_size, sizeRowList, sizeColList, sizeRecList, grpno, sID2TgtSize);

				// JANテーブル描画
				var $table_jan = $div_cs_last.find('table[name="ca_table_jan"]');
				var $thead_jan = $table_jan.children('thead');
				var $tbody_jan = $table_jan.children('tbody');

				this.renderTableJan($thead_jan, $tbody_jan, $tbody_color, $tbody_size, sizeRecList, csitemList);

			}, this));
			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// 新規の場合はカラーの選択肢をセット
				this.renderTableColorNew();
			}
		},

		renderTableColorNew: function() {
			var attrColorList = this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_COLOR];

			// カラーselect
			_.each($('select[name="ca_colorID"]'), _.bind(function(tgt) {
				var $select = $(tgt);
				clutil.cltypeselector2($select, attrColorList, 1, 0,
						'iagID', 'iagName', 'iagCode');
			}, this));

			// サブカラーselect
			_.each($('select[name="ca_designColorID"]'), _.bind(function(tgt) {
				var $select = $(tgt);
				this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_DESIGNCOLOR, 0, 0, 1);
			}, this));
		},

		/**
		 * JANテーブル描画処理
		 * @param $thead_jan JANテーブルのthead
		 * @param $tbody_jan JANテーブルのtbody
		 * @param $tbody_color カラーテーブルのtbody
		 * @param $tbody_size サイズテーブルのtbody
		 * @param sizeRecList サイズレコード
		 * @param csitemList カラーサイズ商品レコード
		 */
		renderTableJan: function(
				$thead_jan, $tbody_jan, $tbody_color, $tbody_size,
				sizeRecList, csitemList) {
			var _this = this;
			var col = [];
			var csitemMap = {};

			// まずクリア
			$thead_jan.empty();
			$tbody_jan.empty();

			if (csitemList != null) {
				$.each(csitemList, function() {
					var key = this.janColorID + ":" + this.janSizeID;
					csitemMap[key] = this;
				});
			}

			/*
			 * 1. 横軸の確認（サイズテーブルを走査）
			 */
			$.each($tbody_size.find('input[name="select_col"]:checked'), function() {
				var $checkbox = $(this);
				var colno = $checkbox.val();	// 列番号
				var sizeID = $checkbox.attr('sizeID');	// サイズID

				var $tr = $checkbox.parents('tr');
				var rowno = $tr.attr('name');	// 行番号

				// 列番号から
				var colObj = {
					col: _this._getSizeColRec(colno),
					row: _this._getSizeRowRec(rowno),
					sizeID: sizeID,
				};
				col.push(colObj);
			});

			var row = [];
			/*
			 * 2. 縦軸の確認（カラーテーブルを走査）
			 */
			$.each($tbody_color.children('tr'), function() {
				var $tr = $(this);
				var $select = $tr.find('select[name="ca_colorID"]');
				var colorID = $select.val();
				if (colorID == null || colorID <= 0) {
					return;
				}
				var colorObj = _this._getColorRec(colorID);
				row.push(colorObj);
			});

			/*
			 * 3. theadの描画
			 *    ついでにtbody用のhtmlも作成してしまう
			 */
			var thead_html = '<tr><th class="th_fixed1">カラー／サイズ</th>';
			thead_html += '<th class="ruler"></th>';
			$.each(col, function() {
				var colObj = this.col;
				var rowObj = this.row;
				var txt = rowObj.sizeRowName + colObj.sizeColName;
				var attr = 'rowno="' + rowObj.sizeRowNo + '" colno="' + colObj.sizeColNo + '"';
				thead_html += '<th class="th_jan" ' + attr + '>' + txt + '</th>';

			});
			thead_html += '</tr>';
			$thead_jan.append(thead_html);

			/*
			 * 4. tbodyの描画
			 */
			$.each(row, function() {
				var colorID = this.iagID == null ? 0 : this.iagID;
				var tr_html = '<tr colorID="' + colorID + '">';
				tr_html += '<td class="td_fixed1" name="' + this.iagID + '">' + this.iagName + '</td>';
				tr_html += '<td class="ruler"></td>';	// 調整用

				// csitemList反映のためループする（やりたくなかった）
				$.each(col, function() {
					var sizeID = this.sizeID;
					var key = colorID + ":" + sizeID;
					var csitem = csitemMap[key];
					var val = "";
					var csitemID = 0;
					if (csitem != null) {
						val = csitem.janCode;
						csitemID = csitem.csitemID;
					}
					var ids = 'colorID="' + colorID + '" sizeID="' + sizeID + '" csitemID="' + csitemID + '"';
					tr_html += '<td class="editable pdg0">';
					tr_html += '<input type="text" class="form-control" name="ca_janCode" ' + ids + ' data-limit="len:13 digit" data-validator="maxlen:13 digit" value="' + val + '" />';
					tr_html += '</td>';
				});
				tr_html += '</tr>';

				$tbody_jan.append(tr_html);
			});
		},

		vendorTagAddr: [],

		/**
		 * メーカー変更イベント（タグ送付先）
		 * @param e
		 */
		_onMakerIDChange: function(e) {
			var $tgt = $(e.target);
			var data = $tgt.autocomplete('clAutocompleteItem');
			console.log(data);
			if (data == null || data.id == null || data.id == 0) {
				return;
			}
			var makerID = data.id;
			var $select = $('select[name0="ca_tagaddrNo"]');
			this.createTagAddrNoSelect($select, makerID, 0);
		},
		/**
		 * タグ送付先
		 * @param $select
		 * @param makerID
		 * @param tagAddrNo
		 */
		createTagAddrNoSelect: function($select, makerID, tagAddrNo) {
			if (makerID == null || makerID == "" || makerID == 0) {
				return;
			}
			var _this = this;
			var from = clutil.dateFormat($("#ca_fromDate").val(), "yyyymmdd");
			if (!from) {
				from = clcom.getOpeDate();	// 開始日が未設定の場合は運用日を使用
			}
			var uri = "AMMSV1100";
			var AMMSV0100TagAddrGetReq = {
				srchMakerID: makerID,
				srchDate: from,
			};
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				AMMSV0100GetReq: {},
				AMMSV0100UpdReq: {},
				AMMSV0100FormatGetReq: {},
				AMMSV0100SizeGetReq: {},
				AMMSV0100TagAddrGetReq: AMMSV0100TagAddrGetReq,
				AMMSV0100PriceHistGetReq: {},
			};
			// タグ送付先取得
			clutil.postJSON(uri, req).done(_.bind(function(data) {
				// 成功

				// MD-3690 商品マスタ「タグ送付先」の入力制御変更_PGM開発
				// (タグ送付先_選択肢の番号表示)
				// tagAddrNo を文字列化して cltypeselector3() に渡すよう変更(namedisp オプションも 0 に変更)
//				_this.tagAddrList = data.AMMSV0100TagAddrGetRsp.tagAddrList;
				_this.tagAddrList = [];
				for (var i = 0; i < data.AMMSV0100TagAddrGetRsp.tagAddrList.length; i++) {
					var src = data.AMMSV0100TagAddrGetRsp.tagAddrList[i];
					var dst = {
						tagAddrNo   : String(src.tagAddrNo),
						tagAddrName : src.tagAddrName,
					};
					_this.tagAddrList.push(dst);
				}

				// MD-3529 商品マスタ「タグ送付先」の入力制御変更_PGM開発
				// 「タグ送付先」に必須マークがついている場合、list が1件だと「clutil.cltypeselector2」では
				// 未選択の選択肢がなくなってしまうので、「clutil.cltypeselector3」に変更する
//				clutil.cltypeselector2($select, _this.tagAddrList, 1, 1,
//						'tagAddrNo', 'tagAddrName', 'tagAddrNo');
				var tagAddrNoSelectArgs = {
						$select: $select,
						list: _this.tagAddrList,
						unselectedflag: 1,
						namedisp: 0,
						idname: 'tagAddrNo',
						namename: 'tagAddrName',
						codename: 'tagAddrNo'
				};
				clutil.cltypeselector3(tagAddrNoSelectArgs);

				if (tagAddrNo != null && tagAddrNo != 0) {
					// 値を設定
					$select.selectpicker('val', tagAddrNo);
				}
				var $div = $select.parent();
				clutil.viewRemoveReadonly($div);
			}, this)).fail(_.bind(function(data) {
				return;
			}, this));
		},
		/**
		 * 発注情報描画処理
		 * @param item 商品マスタレコード
		 * @param attr 商品属性マスタレコード
		 * @param orderHeadList 商品発注ヘッダリスト
		 * @param orderDtlList 商品発注明細リスト
		 * @param sizeRowList
		 * @param sizeColList
		 * @param sizeRecList
		 */
		renderOrderInfo: function(
				item,
				attr,
				orderHeadList,
				orderDtlList,
				tgtColorList,
				tgtSizeList,
				sizeRowList,
				sizeColList,
				sizeRecList,
				info) {

			var _this = this;
			var makerData = $("#ca_makerID").autocomplete('clAutocompleteItem');
			var makerID = makerData != null ? makerData.id : 0;
			// メーカーID設定救済 #20150405 OTK
			if( makerID == 0 ){
				makerID = (item != null ? item.makerID : 0);
			}
			var seq2orderDtl = {};
			var grpnoList = [];
			var grpno2tgtColor = {};
			var cID2tgtSize = {};

			if (tgtColorList != null) {
				$.each(tgtColorList, function() {
					grpnoList.push(this.groupNo);

					if (grpno2tgtColor[this.groupNo] == null) {
						grpno2tgtColor[this.groupNo] = [];
					}
					grpno2tgtColor[this.groupNo].push(this);
				});
			}
			grpnoList = _.uniq(grpnoList);
			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD && grpnoList.length == 0) {
				// 発注テーブルは一つは作っておこう
				grpnoList.push(1);
			}
			if (tgtSizeList != null) {
				$.each(tgtSizeList, function() {
					var colorID = this.tgtColorID;
					if (cID2tgtSize[colorID] == null) {
						cID2tgtSize[colorID] = [];
					}
					cID2tgtSize[colorID].push(this);
				});
			}

			if (orderDtlList != null) {
				$.each(orderDtlList, function() {
					if (seq2orderDtl[this.orderSeq] == null) {
						seq2orderDtl[this.orderSeq] = [];
					}
					seq2orderDtl[this.orderSeq].push(this);
				});
			}


			var $div = $('div#ca_orderInfoFixed');

			// 商品発注明細解析
			var dtlList = {};
			$.each(orderDtlList, function() {
				if (dtlList[this.orderSeq] == null) {
					dtlList[this.orderSeq] = [];
				}
				dtlList[this.orderSeq].push(this);
			});
			// 生産国
			var $import = $div.find('select#ca_importID');
			this.clitemattrselector($import, iagfunc.ITEMATTRGRPFUNC_ID_COUNTRY, item.itgrpID, attr.importID, 1);

			// 縫製工場
			var $factory = $div.find('select#ca_factoryID');
			this.clitemattrselector($factory, iagfunc.ITEMATTRGRPFUNC_ID_FACTORY, item.itgrpID, attr.factoryID, 1);

			// Ki区分
			var $ki = $div.find('select#ca_kiTypeID');
			clutil.cltypeselector($ki, amcm_type.AMCM_TYPE_KI, 1);
			$ki.selectpicker('val', attr.kiTypeID);

			// 発注ロット
			var $lotCount = $div.find('input#ca_lotCount');
			if (attr.lotCount == 0) {
				$lotCount.val("");
			} else {
				$lotCount.val(attr.lotCount);
			}

			var ids = [
				amcm_type.AMCM_VAL_DLV_ROUTE_DIRECT,
				amcm_type.AMCM_VAL_DLV_ROUTE_TC1,
				amcm_type.AMCM_VAL_DLV_ROUTE_DC1,
				amcm_type.AMCM_VAL_DLV_ROUTE_DC2,
				amcm_type.AMCM_VAL_DLV_ROUTE_DC3,
			];
			// 納品形態（初回）
			var $dlvroute1TypeID = $div.find('select#ca_dlvroute1TypeID');
			clutil.cltypeselector({
				$select:$dlvroute1TypeID,
				kind:amcm_type.AMCM_TYPE_DLV_ROUTE,
				unselectedflag:1,
				ids:ids,
			});

			$dlvroute1TypeID.selectpicker('val', attr.dlvroute1TypeID);

			// 納品形態（2回目以降）
			var $dlvroute2TypeID = $div.find('select#ca_dlvroute2TypeID');
			clutil.cltypeselector({
				$select:$dlvroute2TypeID,
				kind:amcm_type.AMCM_TYPE_DLV_ROUTE,
				unselectedflag:1,
				ids:ids,
			});
			$dlvroute2TypeID.selectpicker('val', attr.dlvroute2TypeID);

			// 振分先センター
			//var centerObj = {
			//	id: attr.centerID,
			//	code: attr.centerCode,
			//	name: attr.centerName,
			//};
			this.fieldRelation.done(_.bind(function() {
				var $centerID = $div.find('select#ca_centerID');
				var val = $centerID.val();
				console.log("1:$centerID.val()=" + val);
				$centerID.selectpicker('val', attr.centerID.toString());
				val = $centerID.val();
				console.log("2:$centerID.val()=" + val);
			}, this));
			//$centerID.autocomplete('clAutocompleteItem', centerObj);

			// まずクリア
            var $div_ord = $('div[name="div_order_info"]');
            if (this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
    			$div_ord.empty();
            }

			/*
			 * 1. orderHeadListから発注情報がいくつあるか数える(orderNum)
			 * 2. orderNum個の発注情報を作成する
			 */
			var orderNum = 0;
			var cur_seq = -1;
			$.each(orderHeadList, function() {
				if (this.orderSeq != cur_seq) {
					orderNum++;
					cur_seq = this.orderSeq;
				}
			});
			$.each(orderHeadList, function(i) {
				_this.curOrderSeq = this.orderSeq;	// 発注枝番を記録
				_this.renderOrderInfoList(
						this,
						orderDtlList,
						grpnoList,
						grpno2tgtColor,
						cID2tgtSize,
						makerID,
						info);
			});

			// MD-3529 商品マスタ「タグ送付先」の入力制御変更_PGM開発：タグ送付先の必須設定制御
			this.setTagAddrNoRequired();

			// 最後が承認済みか確認
			var lastOrderHead = orderHeadList.length > 0 ? orderHeadList[orderHeadList.length-1] : null;
			if (lastOrderHead != null) {
				if (lastOrderHead.approveFlag != 0) {
					// 承認済みなら、追加ボタンを表示
					$("#div_addOrderInfo").show();
				} else {
					// 未承認なら、追加ボタンを非表示
					$("#div_addOrderInfo").hide();
				}
			}
		},

		/**
		 * 発注情報（複数）描画
		 * @param orderHeadRec 発注情報ヘッダ（中身を設定すること）
		 * @param orderDtlList 発注情報詳細
		 * @param grpno2tgtColor 商品展開カラーレコード
		 * @param cID2tgtSize 商品展開サイズレコード
		 * @param makerID メーカーID
		 */
		renderOrderInfoList: function(
				orderHeadRec,
				orderDtlList,
				grpnoList,
				grpno2tgtColor,
				cID2tgtSize,
				makerID,
				info) {

			var _this = this;
			// templateを使用
			var $div_order = $('div[name="div_order_info"]');
			var html = _.template($("#ca_rec_template_order_info").html(), orderHeadRec);
			$div_order.append(html);
			clutil.initUIelement($div_order);
			$('[name="help_dlvDate"]').tooltip({html: true});


			/*
			 * 値設定
			 */
			var $div = $div_order.find('div[name="div_order_info_list"]:last');


			// 発注対象
			var $select = $div.find('select[name0="ca_orderTgtTypeID"]');
			clutil.cltypeselector($select, amcm_type.AMCM_TYPE_ORDERKIND, 1);
			$select.selectpicker('val', orderHeadRec.orderTgtTypeID);

			// タグ送付先
			$select = $div.find('select[name0="ca_tagaddrNo"]');
			this.createTagAddrNoSelect($select, makerID, orderHeadRec.tagaddrNo);

			_.defer(_.bind(function() {
				// datepicker
				clutil.datepicker($div.find('input.cl_date'));
				// 製品仕上げ日
				var $date = $div.find('input[name0="ca_finishDate"]');
				$date.datepicker('setIymd', orderHeadRec.finishDate);
				// センター着予定日
				$date = $div.find('input[name0="ca_centerDlvDate"]');
				$date.datepicker('setIymd', orderHeadRec.centerDlvDate);
				// 仕入予定日
				$date = $div.find('input[name0="ca_dlvDate"]');
				$date.datepicker('setIymd', orderHeadRec.dlvDate);
				// 発注日
				$date = $div.find('input[name0="ca_orderDate"]');
				$date.datepicker('setIymd', orderHeadRec.orderDate);

				if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
					clutil.inputReadonly($div.find('input.cl_date'));
				}
			}, this));
			clutil.inputReadonly($div.find('input[name0="ca_orderDate"]'));		// 常に操作不可

			// 発注書番号
			if (orderHeadRec.orderNo != null && orderHeadRec.orderNo != 0) {
				$div.find('input[name0="ca_orderNo"]').val(orderHeadRec.orderNo);
			} else {
				// 念のためクリア
				$div.find('input[name0="ca_orderNo"]').val("");
			}

			// タグ増産率
			if (orderHeadRec.tagIncRate != null && orderHeadRec.tagIncRate != 0) {
				$div.find('input[name0="ca_tagIncRate"]').val(orderHeadRec.tagIncRate);
			} else {
				// 初期値ゼロ設定
				$div.find('input[name0="ca_tagIncRate"]').val("0");
			}

			// 発注取消
			var $checkbox = $div.find('input[type="checkbox"]');
			if (orderHeadRec.cancelFlag) {
				$checkbox.attr('checked', true).closest('label').addClass('checked');
			} else {
				$checkbox.attr('checked', false).closest('label').removeClass('checked');
			}

			var $div_order_table = $div.find('div[name="div_order_table_list"]');
			// カラー／サイズテーブル
			for (var i = 0; i < grpnoList.length; i++) {
				var no = grpnoList[i];
				var tgtColor = grpno2tgtColor[no];
				_this.renderTableOrderDtl($div_order_table, orderDtlList, tgtColor, cID2tgtSize);
			}
		},

		/**
		 * 発注詳細テーブルの描画(描画するテーブルは一つだけ)
		 * @param $div テーブルを追加する場所
		 */
		renderTableOrderDtl: function($div, orderDtlList, grpno2tgtColor, cID2tgtSize) {
			/*
			 *
			 */
			var orderSeq = $div.parent().attr('count');
			var groupNo = 0;

			// orderDtlListをcolorID,sizeIDで引けるようにする
			var orderDtlMap = {};
			$.each(orderDtlList, function() {
				if (this.orderSeq != orderSeq) {
					// オーダー番号が違うデータは対象外
					return;
				}
				var cID = this.orderColorID;
				var sID = this.orderSizeID;

				if (orderDtlMap[cID] == null) {
					orderDtlMap[cID] = {};
				}
				orderDtlMap[cID][sID] = this;
			});

			// grpno2tgtColorでループするのではなく、先頭のレコードを使用する
			var colorID = 0;
			if (grpno2tgtColor != null && grpno2tgtColor.length > 0) {
				colorID = grpno2tgtColor[0].tgtColorID;
				groupNo = grpno2tgtColor[0].groupNo;
			}
			// カラーIDから対象のサイズレコードを取得する
			var tgtSizeList = cID2tgtSize[colorID];
			if (tgtSizeList == null) {
				// 念のため
				tgtSizeList = [];
			}
			// tableはテンプレートを使用して追加する
			var data = {groupNo: groupNo};
			var html = _.template($("#ca_template_table_order").html(), data);
			$div.append(html);

			var $table = $div.find('table[name="ca_table_order"]:last');
			var $thead = $table.children('thead');
			var $tbody = $table.children('tbody');

			// thead
			var thead_html = '<tr>';
			thead_html += '<th class="th_fixed1">カラー／サイズ</th>';
			thead_html += '<th class="th_fixed2">合計</th>';
			thead_html += '<th class="ruler"></th>';

			$.each(tgtSizeList, function() {
				// thead
				thead_html += '<th class="th_size" sizeID="' + this.tgtSizeID + '">';
				thead_html += this.tgtSizeName;
				thead_html += '</th>';
			});
			thead_html += '</tr>';
			$thead.append(thead_html);

			if (tgtSizeList == null || tgtSizeList.length == 0) {
				return;
			}
			// tbody
			$.each(grpno2tgtColor, function() {
				var colorID = this.tgtColorID;
				if (colorID == 0) {
					return true;
				}
				var tbody_html = '<tr colorID="' + colorID + '">';

				tbody_html += '<td class="td_fixed1">' + this.tgtColorName + '</td>';
				tbody_html += '<td class="td_fixed2 txtar" name="total"></td>';	// 合計は後で設定する
				tbody_html += '<td class="ruler"></td>';	// 調整用
				var total = 0;

				$.each(tgtSizeList, function() {
					var sizeID = this.tgtSizeID;
					var orderDtl = {
						orderQy: 0,
						csitemID: 0,
					};
					if (orderDtlMap[colorID] != null && orderDtlMap[colorID][sizeID] != null) {
						orderDtl = orderDtlMap[colorID][sizeID];
					}

					var idtxt = 'colorID="' + colorID +
								'" sizeID="' + sizeID +
								'" csitemID="' + orderDtl.csitemID + '"';

					tbody_html += '<td ' + idtxt + ' class="ca_c_link editable pdg0">';
					tbody_html += '<input type="text" class="form-control txtar cl_valid" name="ca_orderQy" data-validator="int:5 min:0" data-filter="comma" value="' + clutil.comma(orderDtl.orderQy) + '" />';
					tbody_html += '</td>';

					total += orderDtl.orderQy;
				});

				tbody_html += '</tr>';
				$tbody.append(tbody_html);

				var $tr = $tbody.children('tr:last');
				$td_total = $tr.children('td[name="total"]');
				$td_total.text(clutil.comma(total));
			});
		},

		/**
		 * 発注数合計計算
		 * @param e
		 */
		changeOrderQty: function(e) {
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');
			var total = 0;

			$.each($tr.find('input[name="ca_orderQy"]'), function() {
				var $this = $(this);
				var qty = $.inputlimiter.unmask($this.val(), {
					limit: $this.attr('data-limit'),
					filter: $this.attr('data-filter'),
				});
				var val = parseInt(qty);
				if (_.isNaN(val)) {
					val = 0;
				}
				total += val;
			});
			$tr.children('td[name="total"]').text(clutil.comma(total));
		},

		/**
		 * 発注テーブル作成用にカラーサイズ展開テーブルを走査する
		 * @returns {___anonymous32414_32488}
		 */
		scanColorSizeInfo: function() {
			var _this = this;
			var grpno2tgtColor = {};	// groupNo->tgtColorなマップ
			var cID2tgtSize = {};		// colorID->tgtSizeなマップ
			var colorList = _this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_COLOR];

			var colorIDs = [];

			for (var i = 0; i < this.groupNoList.length; i++) {
				var grpno = this.groupNoList[i];
				grpno2tgtColor[grpno] = [];

				// 該当グループのカラーテーブルを調べる
				var $div_color = $('div[name="div_color"][groupno="' + grpno + '"]');
				var $div_size = $div_color.parent().children('div[name="div_size"]');
				var $tbody_color = $div_color.find('tbody[name="ca_table_color_tbody"]');
				var tmp_colorID = 0;
				$.each($tbody_color.find('tr'), function() {
					var $select = $(this).find('select[name="ca_colorID"]');
					var colorID = $select.val();
					var tgtColorName = "";
					if (colorList != null) {
						$.each(colorList, function() {
							if (this.iagID == colorID) {
								tgtColorName = this.iagName;
								return false;
							}
						});
					}
					var tgtColor = {
						tgtColorID: colorID,
						tgtColorName: tgtColorName,
						groupNo: grpno,
					};
					grpno2tgtColor[grpno].push(tgtColor);
					if (tmp_colorID == 0) {
						tmp_colorID = colorID;
						cID2tgtSize[colorID] = [];
						colorIDs.push(colorID);
					}
				});

				var $tbody_size = $div_size.find('tbody[name="ca_table_size_tbody"]');
				$.each($tbody_size.find('input[name="select_col"]:checked'), function() {
					var $checkbox = $(this);
					var groupNO = $checkbox.attr('groupNO');
					var sizeID = $checkbox.attr('sizeID');
					var rowno = $checkbox.attr('rowno');
					var colno = $checkbox.attr('colno');
					var tgtColor = grpno2tgtColor[groupNO];
					var colorID = 0;
					if (tgtColor != null && tgtColor.length > 0) {
						colorID = tgtColor[0].tgtColorID;
					}
					var tgtSizeName = "";
					$.each(_this.sizeRecList, function() {
						if (this.sizeID == sizeID) {
							tgtSizeName = this.sizeName;
							return false;
						}
					});
					var tgtSize = {
						tgtColorID: colorID,
						tgtSizeID: sizeID,
						tgtSizeName: tgtSizeName,
						rowno: rowno,
						colno: colno,
					};
					if (cID2tgtSize[colorID] == null) {
						cID2tgtSize[colorID] = [];
						colorIDs.push(colorID);
					}
					cID2tgtSize[colorID].push(tgtSize);
				});
			}

			var sizeptnID = $("#ca_sizePtnID").selectpicker('val');
			var sizeptnCode = $("#ca_sizePtnID").find('option[value='+ sizeptnID + ']').text().split(":")[0];

			console.log(sizeptnCode);

			if (_.indexOf(this.SIZEPTN_SORT_COL_ROW_LIST, sizeptnCode) >= 0) {
				for (var i = 0; i < colorIDs.length; i++) {
					cID2tgtSize[colorIDs[i]] = _.sortBy(cID2tgtSize[colorIDs[i]], function(obj) {
						return Number(obj.colno) * 100 + Number(obj.rowno);
					});
				}
			}

//			_.each(cID2tgtSize, _.bind(function(elem) {
//				elem = _.sortBy(elem, function(obj) {
//					return obj.colno * 100 + obj.rowno;
//				});
//				console.log(elem);
//			}, this));

			return {
				grpno2tgtColor: grpno2tgtColor,
				cID2tgtSize: cID2tgtSize,
			};
		},

		/**
		 * 現在の発注テーブルを走査する
		 * @returns {Array}
		 */
		scanOrderTable: function() {
			var orderDtlList = [];
			var table = $('table[name="ca_table_order"]');
			$.each(table, function() {
				var $table = $(this);
				//var grouno = $table.attr('groupNo');
				var $tbody = $table.children('tbody');

				var $pdiv = $table.parents('div[name="div_order_info_list"]');
				var orderSeq = $pdiv.attr('count');

				// セルでループ
				$.each($tbody.find('input[name="ca_orderQy"]'), function() {
					var $input = $(this);
					var colorID = $input.attr('colorID');
					var sizeID = $input.attr('sizeID');
					var csitemID = $input.attr('csitemID');
					var val = $.inputlimiter.unmask($input.val(), {
						limit: $input.attr('data-limit'),
						filter: $input.attr('data-filter')
					});

					var orderDtl = {
						orderSeq: orderSeq,
						csitemID: csitemID,
						orderColorID: colorID,
						orderSizeID: sizeID,
						orderQy: val,
					};
					orderDtlList.push(orderDtl);
				});
			});

			return orderDtlList;
		},

		/**
		 * カラーサイズ展開変更による発注テーブルの変更
		 */
		renderOrderTablesByColorSizeChange: function() {
//			var _this = this;
			var maps = this.scanColorSizeInfo();
			var orderDtlList = this.scanOrderTable();

			/*
			 * 1.div_order_info_listでループ
			 *   1-1. orderSeqを取得（使うかな？）
			 *   1-2. div_order_table_listをクリア
			 *   1-3. grouNoListでループ
			 *     1-3-1. groupNoに関する発注テーブルを描画
			 */
			var $div_orderInfo = $('div[name="div_order_info"]');
			var $div_orderList = $div_orderInfo.find('div[name="div_order_info_list"]');

			_.each($div_orderList, _.bind(function(div) {
				var $div_order = $(div);
				var $ca_approveFlag = $div_order.find('input[name0="ca_approveFlag"]');
				var approveFlag = $ca_approveFlag.val();
				if (approveFlag == 1) {
					// 承認済みなので再描画しない
					return;
				}
				var $div_order_table_list = $div_order.find('div[name="div_order_table_list"]');
				$div_order_table_list.empty();

				_.each(this.groupNoList, _.bind(function(grpno) {
					var tgtColor = maps.grpno2tgtColor[grpno];
					this.renderTableOrderDtl($div_order_table_list, orderDtlList, tgtColor, maps.cID2tgtSize);
				}, this));
			}, this));

//			$.each($div_orderList, function() {
//				var $div_order = $(this);
//				var $div_order_table_list = $div_order.find('div[name="div_order_table_list"]');
//				$div_order_table_list.empty();
//
//				$.each(_this.groupNoList, function() {
//					var tgtColor = maps.grpno2tgtColor[this];
//					_this.renderTableOrderDtl($div_order_table_list, orderDtlList, tgtColor, maps.cID2tgtSize);
//				});
//			});

		},

		itemAttrObj: {},

		/**
		 * 商品属性コンボボックスの初期化
		 * @param $select
		 * @param iagfuncId
		 * @param itgrpId
		 * @param val
		 * @param unselectedflag
		 */
		clitemattrselector: function($select, iagfuncId, itgrpId, val, unselectedflag) {
			var attrItemList = this.attrItemMap[iagfuncId];
			clutil.cltypeselector2($select, attrItemList, unselectedflag,
					null, 'iagID', 'iagName', 'iagCode');
			$select.selectpicker('val', val);
		},

		/**
		 * 商品仕様フォーマットリストを解析する
		 * @param specFormatList 商品仕様フォーマットリスト
		 * @returns {___anonymous12603_12604}
		 */
		_parseSpecFormatList: function(specFormatList) {
			var sflist = {};

			$.each(specFormatList, function() {
				sflist[this.specItemID] = this.specItemName;
			});

			return sflist;
		},

		/**
		 * 商品仕様商品仕様選択肢レコードを解析する
		 * @param specChoiceList 商品仕様選択肢レコード
		 * @returns {___anonymous12927_12928}
		 */
		_parseSpecChoiceList: function(specChoiceList) {
			var sclist = {};

			$.each(specChoiceList, function() {
				if (sclist[this.specItemID] == null) {
					sclist[this.specItemID] = [];
				}
				sclist[this.specItemID].push(this);
			});

			return sclist;
		},

		_parseSpecList: function(specList) {
			var slist = {};

			if (specList != null) {
				$.each(specList, function() {
					slist[this.specItemID] = this;
				});
			}
			return slist;
		},

		modelnoList: [],

		/**
		 * 型番テーブルの描画
		 * @param modelNoList 型番リスト
		 * @param itgrpId 品種ID
		 * @returns
		 */
		renderTableModelNo: function(modelNoList, itgrpId) {
			var $tbody = $("#ca_table_modelno_tbody");
			// 一旦クリア
			$tbody.empty();

			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				var len = modelNoList.length;
				for (var i = len; i < 5; i++) {
					// 空データ
					var add_tmp = {
						fromDate: 0,
						toDate: 0,
						id: 0,
						modelnoSeq: 0,
						modelnoPlaceID: 0,
						modelnoPlaceCode: "",
						modelnoPlaceName: "",
						modelno: "",
					};
					modelNoList.push(add_tmp);
				}
			}

			// 商品属性項目マップから部位を取出す
			var modelnoplaceList = this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_MODELNOPLACE];

			$.each(modelNoList, function() {
				var tr = _.template($("#ca_rec_template_modelno").html(), this);
				$tbody.append(tr);

				var $tr_last = $tbody.find('tr:last');
				clutil.initUIelement($tr_last);

				var $select = $tr_last.find('select[name="ca_modelnoPlaceID"]');

				clutil.cltypeselector2($select, modelnoplaceList, 0,
						null, 'iagID', 'iagName', 'iagCode');

				$select.selectpicker('val', this.modelnoPlaceID);
			});
		},

		/**
		 * 型番テーブル行追加処理
		 * @param e
		 * @returns
		 */
		_onModelNoAddRow: function(e) {
			var $tgt = $(e.target);
			var $table = $tgt.parents('table');
			if ($table.hasClass('readonly')) {
				// 参照モードなのでなにもしない
				return;
			}
			// 空データ
			var add_tmp = {
				fromDate: 0,
				toDate: 0,
				id: 0,
				modelnoSeq: 0,
				modelnoPlaceID: 0,
				modelnoPlaceCode: "",
				modelnoPlaceName: "",
				modelno: "",
			};
			// 商品属性項目マップから部位を取出す
			var modelnoplaceList = this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_MODELNOPLACE];

			var tr = _.template($("#ca_rec_template_modelno").html(), add_tmp);
			var $tbody = $("#ca_table_modelno_tbody");

			$tbody.append(tr);

			var $tr_last = $tbody.find('tr:last');
			clutil.initUIelement($tr_last);

			var $select = $tr_last.find('select[name="ca_modelnoPlaceID"]');

			clutil.cltypeselector2($select, modelnoplaceList, 1,
					null, 'iagID', 'iagName', 'iagCode');
		},

		/**
		 * 型番テーブル行削除処理
		 * @param e
		 */
		_onModelNoDelRow: function(e) {
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');
			var $table = $tgt.parents('table');
			if ($table.hasClass('readonly')) {
				// 参照モードなのでなにもしない
				return;
			}

			$tr.remove();
		},



		/**
		 * 商品仕様テーブル描画
		 * @param specList
		 * @param specChoiceList
		 * @param specFormatList
		 */
		renderTableSpec: function(specList, specChoiceList, specFormatList) {
			var _this = this;
			// 商品仕様選択肢リストを解析する
			var sclist = this._parseSpecChoiceList(specChoiceList);
			// 商品仕様レコードを解析する
			var slist = this._parseSpecList(specList);

			var $tbody = $("#ca_table_spec_tbody");
			// 一旦クリア
			$tbody.empty();

			$.each(specFormatList, function() {
				var spec = slist[this.specItemID];
				var ex = {
					specText: "",
				};
				if (spec != null) {
					ex.specText = spec.specText;
				}
				var specFormat = _.extend(this, ex);
				// 追加業のHTMLを作成する
				var tr = _.template($("#ca_rec_template_spec").html(), specFormat);
				// tbodyに追加
				$tbody.append(tr);

				var $tr_last = $tbody.find('tr:last');
				clutil.initUIelement($tr_last);

				// 仕様selectの初期化
				var $select = $tr_last.find('select[name="ca_specID"]');
				var list = sclist[this.specItemID];
				clutil.cltypeselector2($select, list, 1, 0, 'specID', 'specName', 'specCode');
				// 仕様selectに値設定
				if (spec != null && spec.specID != null) {
					$select.selectpicker('val', spec.specID);
				}
				_this._onChangeSpecID_main($select);
				var $ca_specText = $tr_last.find('input[name="ca_specText"]');
				if (list == null || list.length == 0) {
					clutil.inputRemoveReadonly($ca_specText);
				}
//				else {
//					clutil.inputReadonly($ca_specText);
//				}
			});
		},

		/**
		 * 仕様 変更イベント
		 * @param ev
		 */
		_onChangeSpecID: function(ev) {
			this._onChangeSpecID_main($(ev.currentTarget));
		},

		/**
		 * 仕様 変更イベント
		 * @param ev
		 */
		_onChangeSpecID_main: function($select) {
			var val = $select.selectpicker('val');
			console.log(val);
			var $tr = $select.parents('tr');
			var $ca_specText = $tr.find('input[name="ca_specText"]');

			if (val == 0 || val == null) {
				// 未選択状態
				clutil.inputRemoveReadonly($ca_specText);
			} else {
				clutil.inputReadonly($ca_specText);
				$ca_specText.val("");
			}
		},

		/**
		 * フリー入力の操作可不可の制御だけここでやる
		 */
		rerenderTableSpec: function(specChoiceList, mode) {
			// 商品仕様選択肢リストを解析する
			var sclist = this._parseSpecChoiceList(specChoiceList);
			var $tr_list = $("#ca_table_spec_tbody tr");

			_.each($tr_list, _.bind(function(tr) {
				var $tr = $(tr);
				var $ca_specText = $tr.find('input[name="ca_specText"]');
				var $ca_specItemID = $tr.find('input[name="ca_specItemID"]');
				var $select = $tr.find('select[name="ca_specID"]');
				var $selectP = $select.parent();
				var specItemID = $ca_specItemID.val();
				var list = sclist[specItemID];

				if (mode == null || (mode != 7 && mode != 8)) {
					this._onChangeSpecID_main($select);
					if (list == null || list.length == 0) {
						clutil.inputRemoveReadonly($ca_specText);
						clutil.viewReadonly($selectP);
					} else {
//						clutil.inputReadonly($ca_specText);
						clutil.viewRemoveReadonly($selectP);
					}
				}
			}, this));
		},

		itemAttrPlaceList: [],
		itemAttrMaterialList: [],


		renderTableMaterial: function(materialList, itgrpId) {
			var attrModelnoPlaceList = this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_PARTS];
			var attrMaterialList = this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_TAGMATERIAL];

			var $tbody = $("#ca_table_material_tbody");

			$tbody.empty();		// まずクリア

			for (var i = 0; i < 10; i++) {
				var mate = materialList[i] != null ? materialList[i] : {
					fromDate: 0,
					toDate: 0,
					id: 0,
					tagSeq: i+1,
					placeID: 0,
					placeCode: "",
					placeName: "",
					tagMaterialID: 0,
					tagMaterialCode: "",
					tagMaterialName: "",
					materialRatio: "",
					tagManual: "",
				};

				// 追加業のHTMLを作成する
				var tr = _.template($("#ca_rec_template_material").html(), mate);
				// tbodyに追加
				$tbody.append(tr);

				var $tr = $tbody.find('tr:last');

				// 部位select
				var $select_place = $tr.find('select[name="ca_placeID"]');
				clutil.cltypeselector2($select_place, attrModelnoPlaceList, 1, 0,
						'iagID', 'iagName', 'iagCode');
				// 仕様selectに値設定
				$select_place.selectpicker('val', mate.placeID);

				// 素材
				var $select_mate = $tr.find('select[name="ca_tagMaterialID"]');
				clutil.cltypeselector2($select_mate, attrMaterialList, 1, 0,
						'iagID', 'iagName', 'iagCode');
				$select_mate.selectpicker('val', mate.tagMaterialID);
			}
			var txt = clutil.getclsysparam('PAR_AMCM_DEFAULT_PERCENT');
			$('input[name="ca_materialRatio"]').attr('placeholder', txt);
		},

		itemAttrColorList: [],

		/**
		 * カラーテーブル描画処理
		 * @param $tbody tbody
		 * @param tgtColorList 商品展開カラーレコード
		 * @param cID2CItem カラー商品レコード
		 * @param itgrpId 品種ID
		 */
		renderTableColor: function($tbody, tgtColorList, cID2CItem, itgrpId) {
			//var $table = $tbody.parent();
			var attrColorList = this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_COLOR];
			var len = tgtColorList.length;

			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				for (var i = len; i < 5; i++) {
					var add_tmp = {
							fromDate: 0,
							toDate: 0,
							id: 0,
							citemID: 0,
							colorID: 0,
							makerColor: "",
						};
					tgtColorList.push(add_tmp);
				}
			}
			var _this = this;
			$.each(tgtColorList, function() {
				var tgtColor = this;
				var obj = {
					colorID: tgtColor.tgtColorID,
					makerColor: "",
					citemID: 0,
					designColorID: 0,
					fNotEdit: 0,
				};
				if (cID2CItem != null && cID2CItem[tgtColor.tgtColorID] != null) {
					var citem = cID2CItem[tgtColor.tgtColorID];
					obj.makerColor = citem.makerColor;
					obj.citemID = citem.citemID;
					obj.designColorID = citem.designColorID;
				}
				if (_this.curTgtColorMap[tgtColor.tgtColorID] != null) {
					obj.fNotEdit = 1;
				}
				// 追加業のHTMLを作成する
				var tr = _.template($("#ca_rec_template_color").html(), obj);
				// tbodyに追加
				$tbody.append(tr);

				var $tr = $tbody.find('tr:last');
				clutil.initUIelement($tr);

				// カラーselect
				var $select = $tr.find('select[name="ca_colorID"]');

				clutil.cltypeselector2($select, attrColorList, 1, 0,
						'iagID', 'iagName', 'iagCode');
				$select.selectpicker('val', tgtColor.tgtColorID);

				// サブカラーselect
				var $sub = $tr.find('select[name="ca_designColorID"]');

				_this.clitemattrselector($sub, iagfunc.ITEMATTRGRPFUNC_ID_DESIGNCOLOR, 0, obj.designColorID, 1);
			});
		},

		/**
		 * カラーテーブル行追加処理
		 * @param e
		 * @returns
		 */
		_onColorAddRow: function(e) {
			var attrColorList = this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_COLOR];

			var $tgt = $(e.target);
			var $table = $tgt.parents('table');
			if ($table.hasClass('readonly')) {
				// 参照モードなのでなにもしない
				return;
			}

			if (this.infoRec != null && this.infoRec.tagApprovalTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE) {
				// タグ申請済の場合は、編集不可
				return;
			}

			// 空データ
			var add_tmp = {
				fromDate: 0,
				toDate: 0,
				id: 0,
				citemID: 0,
				colorID: 0,
				makerColor: "",
				designColorID: 0,
				fNotEdit: 0,
			};

			var tr = _.template($("#ca_rec_template_color").html(), add_tmp);
			var $tbody = $table.children('tbody');

			$tbody.append(tr);

			var $tr_last = $tbody.find('tr:last');
			clutil.initUIelement($tr_last);

			var $select = $tr_last.find('select[name="ca_colorID"]');

			clutil.cltypeselector2($select, attrColorList, 1,
					null, 'iagID', 'iagName', 'iagCode');

			// サブカラーselect
			var $sub = $tr_last.find('select[name="ca_designColorID"]');
			this.clitemattrselector($sub, iagfunc.ITEMATTRGRPFUNC_ID_DESIGNCOLOR, 0, 0, 1);
		},

		/**
		 * カラーテーブル行削除処理
		 * @param e
		 */
		_onColorDelRow: function(e) {
			var $tgt = $(e.target);
			var $table = $tgt.parents('table');
			var $tr = $tgt.parents('tr');
			if ($table.hasClass('readonly') || $tr.hasClass('readonly')) {
				// 参照モードなのでなにもしない
				return;
			}
			if (this.infoRec != null && this.infoRec.tagApprovalTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE) {
				// タグ申請済の場合は、編集不可
				return;
			}

			var $tr = $tgt.parents('tr');
			var $tbody_color = $tr.parents('tbody');
			var $pdiv = $tgt.parents('div[name="div_colorsize_list"]');
			var $table_size = $pdiv.find('table[name="ca_table_size"]');
			var $tbody_size = $table_size.children('tbody');
			var $table_jan = $pdiv.find('table[name="ca_table_jan"]');
			var $thead_jan = $table_jan.children('thead');
			var $tbody_jan = $table_jan.children('tbody');

			$tr.remove();

			// JANテーブル＆発注テーブルへの反映
			var csitemList = this.view2dataJanTable($tbody_jan);

			this.renderTableJan($thead_jan, $tbody_jan, $tbody_color, $tbody_size, this.sizeRecList, csitemList);

			this.renderOrderTablesByColorSizeChange();
		},

		/**
		 * サイズテーブル描画処理
		 * @param rowList 行データ
		 * @param colList 列データ
		 * @param recList カラムデータ
		 */
		renderTableSize: function($thead, $tbody, rowList, colList, recList, groupNO, sID2TgtSize) {
			var _this = this;
			sID2TgtSize = sID2TgtSize == null ? {} : sID2TgtSize;
			var $table = $thead.parent();
			$thead.empty();
			$tbody.empty();

			var recMap ={};
			$.each(recList, function() {
				var key = this.sizeRowNo + ":" + this.sizeColNo;
				recMap[key] = this;
			});

			/*
			 * thead描画
			 */
			var tr = '<tr>';
			tr += '<th></th>';
			tr += '<th class="txtac">選択</th>';
			$.each(colList, function() {
				tr += '<th class="txtac" name="' + this.sizeColNo + '">' + this.sizeColName + '</th>';
			});
			tr += '</tr>';
			$thead.append(tr);
			clutil.initUIelement($thead);

			var tmpl_tdlabel = '<td class="cellCheckbox"><label class="checkbox" for="">';
			var tmpl_tdlabel2 = '</label></td>';
			var tmpl_tdsel = '<td class="cellCheckbox reference"><label class="checkbox" for="">';
			var tmpl_tdsel2 = '</label></td>';
			/*
			 * tbody描画
			 */
			tr = '<tr name="select_head">';
			tr += '<td>選択</td>';
			tr += tmpl_tdsel;
			tr += '<input type="checkbox" name="select_head_all" value="all" data-toggle="checkbox">';
			tr += tmpl_tdsel2;

			//<td width="" class="cellCheckbox"><label class="checkbox" for=""><input type="checkbox" value="" id="" data-toggle="checkbox"></label></td>

			// 選択行
			$.each(colList, function() {
				tr += tmpl_tdsel;
				tr += '<input type="checkbox" name="select_head_col" value="' + this.sizeColNo + '" data-toggle="checkbox">';
				tr += tmpl_tdsel2;
			});
			tr += '</tr>';
			$tbody.append(tr);
			clutil.initUIelement($tbody);

			// 行追加
			$.each(rowList, function() {
				var rowNo = this.sizeRowNo;
				tr = '<tr name="' + this.sizeRowNo + '">';
				// 名前
				tr += '<td>' + this.sizeRowName + '</td>';
				// 行選択
				tr += tmpl_tdsel;
				tr += '<input type="checkbox" name="select_row_all" data-toggle="checkbox"></label></td>';
				tr += tmpl_tdsel2;
				// 列
				$.each(colList, function() {
					var key = rowNo + ":" + this.sizeColNo;
					if (recMap[key] != null) {
						var sizeID = recMap[key].sizeID;
						console.log("sizeID=" + sizeID + ", " + sID2TgtSize[sizeID]);
						var colorID = (sID2TgtSize[sizeID] != null && sID2TgtSize[sizeID].tgtColorID != null) ? sID2TgtSize[sizeID].tgtColorID : 0;

						var sizeIDValue = 'sizeID="' + sizeID + '" groupNO="' + groupNO + '" value="' + this.sizeColNo + '"';
						tr += tmpl_tdlabel;
						tr += '<input type="checkbox" name="select_col" ' + sizeIDValue + ' rowno="' + rowNo + '" colno="' + this.sizeColNo + '" data-toggle="checkbox">';
						if (_this.curTgtSizeMap[colorID] != null && _this.curTgtSizeMap[colorID][sizeID] != null) {
							tr += '<input type="hidden" name="ca_fNotEdit" value="1" />';
						} else {
							tr += '<input type="hidden" name="ca_fNotEdit" value="0" />';
						}
						tr += tmpl_tdlabel2;
					} else {
						// sizeRecがない
						var sizeID = 0;
						var sizeIDValue = 'sizeID="' + sizeID + '" groupNO="' + groupNO + '" value="' + this.sizeColNo + '"';
						tr += '<td>';
						tr += '<input type="hidden" name="select_col" ' + sizeIDValue + '>';
						tr += '<input type="hidden" name="ca_fNotEdit" value="0" />';
						tr += '</td>';
					}
				});
				tr += '</tr>';
				$tbody.append(tr);

				// チェックと入れるか
				var $tr_last = $tbody.find('tr:last');
				clutil.initUIelement($tr_last);

				$.each($tr_last.find('input[name="select_col"]'), function() {
					var $this = $(this);
					var sID = $this.attr('sizeID');
					var tgtSize = sID2TgtSize[sID];
					var type = $this.attr('type');
					if (type == 'checkbox') {
						if (tgtSize != null) {
							$this.attr("checked", true).closest("label").addClass("checked");
						} else {
							$this.attr("checked", false).closest("label").removeClass("checked");
						}
					}
				});
			});
			clutil.initUIelement($table);
		},

		/**
		 * サイズテーブル全選択
		 * @param e
		 */
		_onSizeSelectHeadAll: function(e) {
			var $tgt = $(e.target);
			var $tbody = $tgt.parents('tbody');

			var checked = $tgt.prop('checked') ? 1 : 0;

			// 全てのチェックボックスをcheckedにする
			$.each($tbody.find('input[name="select_col"]'), function() {
				var $this = $(this);

				if(checked){
					// チェックをつける
					$this.attr("checked", true).closest("label").addClass("checked");
				} else {
					// チェックを外す
					$this.attr("checked", false).closest("label").removeClass("checked");
				}
			});

			var $div_cs = $tbody.parents('div[name="div_colorsize_list"]');
			var $thead_jan = $div_cs.find('thead[name="ca_table_jan_thead"]');
			var $tbody_jan = $div_cs.find('tbody[name="ca_table_jan_tbody"]');
			var $tbody_color = $div_cs.find('tbody[name="ca_table_color_tbody"]');

			// 現在のJANテーブルの内容を取得する
			var csitemList = this.view2dataJanTable($tbody_jan);

			this.renderTableJan($thead_jan, $tbody_jan, $tbody_color, $tbody, this.sizeRecList, csitemList);

			this.renderOrderTablesByColorSizeChange();
		},

		/**
		 * カラム全選択
		 */
		_onSizeSelectHeadCol: function(e) {
			/*
			 * 1. 自分のsizeColNoを取得
			 * 2.
			 */
			var $tgt = $(e.target);
			var checked = $tgt.attr('checked');
			var no = $tgt.val();
			var $tbody = $tgt.parents('tbody');
			var $checkbox = $tbody.find('input[value="' + no + '"]');
			$.each($checkbox, function() {
				var $this = $(this);
				if (checked == 'checked') {
					$this.attr("checked", true).closest("label").addClass("checked");
				} else {
					$this.attr("checked", false).closest("label").removeClass("checked");
				}
			});

			var $div_cs = $tbody.parents('div[name="div_colorsize_list"]');
			var $thead_jan = $div_cs.find('thead[name="ca_table_jan_thead"]');
			var $tbody_jan = $div_cs.find('tbody[name="ca_table_jan_tbody"]');
			var $tbody_color = $div_cs.find('tbody[name="ca_table_color_tbody"]');

			// 現在のJANテーブルの内容を取得する
			var csitemList = this.view2dataJanTable($tbody_jan);

			this.renderTableJan($thead_jan, $tbody_jan, $tbody_color, $tbody, this.sizeRecList, csitemList);

			this.renderOrderTablesByColorSizeChange();
		},

		/**
		 * 行全選択
		 * @param e
		 */
		_onSizeSelectRowAll: function(e) {
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');
			var $input = $tr.find('input[name="select_col"]');

			var checked = $tgt.prop('checked') ? 1 : 0;
			if (checked) {
				$input.attr('checked', true).closest('label').addClass('checked');
			} else {
				$input.attr('checked', false).closest('label').removeClass('checked');
			}

			var $tbody = $tgt.parents('tbody');
			var $div_cs = $tbody.parents('div[name="div_colorsize_list"]');
			var $thead_jan = $div_cs.find('thead[name="ca_table_jan_thead"]');
			var $tbody_jan = $div_cs.find('tbody[name="ca_table_jan_tbody"]');
			var $tbody_color = $div_cs.find('tbody[name="ca_table_color_tbody"]');

			// 現在のJANテーブルの内容を取得する
			var csitemList = this.view2dataJanTable($tbody_jan);

			this.renderTableJan($thead_jan, $tbody_jan, $tbody_color, $tbody, this.sizeRecList, csitemList);

			this.renderOrderTablesByColorSizeChange();
		},

		view2dataJanTable: function($tbody) {
			var csitemList = [];

			$.each($tbody.find('input'), function() {
				var $input = $(this);
				var colorID = $input.attr('colorID');
				var sizeID = $input.attr('sizeID');
				var csitemID = $input.attr('csitemID');
				var janCode = $input.val();

				var csitem = {
					colorID: colorID,
					sizeID: sizeID,
					csitemID: csitemID,
					janCode: janCode,
				};
				csitemList.push(csitem);
			});

			return csitemList;
		},

		_getSizeColRec: function(sizeColNo) {
			var retobj = null;
			$.each(this.sizeColList, function() {
				if (this.sizeColNo == sizeColNo) {
					retobj = this;
				}
			});
			return retobj;
		},

		_getSizeRowRec: function(sizeRowNo) {
			var retobj = null;
			$.each(this.sizeRowList, function() {
				if (this.sizeRowNo == sizeRowNo) {
					retobj = this;
				}
			});
			return retobj;
		},

		_getColorRec: function(colorID) {
			var retObj = null;
			var colorList = this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_COLOR];
			$.each(colorList, function() {
				if (this.iagID == colorID) {
					retObj = this;
					return false;
				}
			});
			return retObj;
		},

		/**
		 * JANコードテーブル構成変更イベント
		 * @param data
		 * @param e
		 */
		_onSizePtnJanChanged: function(data, e) {
			var _this = this;
			/*
			 * 1. 横軸の確認（サイズテーブルを走査）
			 *     ca_table_size_tbodyのinput[type="checkbox"]:checkedを取得
			 *     各々のcheckboxの列(sizeColNo)と行(sizeRowNo)を取得
			 *     Noから行・列のオブジェクトを取得して、記録する
			 * 2. 縦軸の確認（カラーテーブルを走査）
			 *     ca_table_color_tbodyのca_colorIDを取得して記録
			 * 3. theadの描画
			 *     1.からtheadを作成
			 * 4. tbodyの描画
			 * 言葉で書くと簡単そうだけど…
			 */
			var $tbody = data.$tbody;
			if ($tbody == null) {
				$tbody = $('tbody[name="ca_table_size_tbody"]');
			}
			$.each($tbody, function() {
				var $tbody_size = $(this);
				var $table_size = $tbody_size.parent();

				var $div_size = $table_size.parent().parent();

				var $div_color = $div_size.prev().prev();
				var $table_color = $div_color.find('table[name="ca_table_color"]');
				var $tbody_color = $table_color.children('tbody');

				var $div_jan = $div_size.next().next();
				var $table_jan = $div_jan.find('table[name="ca_table_jan"]');
				var $table_jan_thead = $table_jan.children('thead');
				var $table_jan_tbody = $table_jan.children('tbody');

				var col = [];
				/*
				 * 1. 横軸の確認（サイズテーブルを走査）
				 */
				// ca_table_size_tbodyのinput[type="checkbox"]:checkedを取得
				$.each($tbody_size.find('input[type="checkbox"]:checked'), function() {
					var $checkbox = $(this);
					var name = $checkbox.attr('name');
					if (name == 'select_head_all' || name == 'select_head_col' || name == 'select_row_all') {
						return;	// 対象外
					}
					var colno = $checkbox.val();	// 列番号

					var $tr = $checkbox.parent().parent().parent();
					var rowno = $tr.attr('name');	// 行番号

					// 列番号から
					var colObj = {
						col: _this._getSizeColRec(colno),
						row: _this._getSizeRowRec(rowno),
					};
					col.push(colObj);
				});

				var row = [];
				/*
				 * 2. 縦軸の確認（カラーテーブルを走査）
				 */
				$.each($tbody_color.children('tr'), function() {
					var $tr = $(this);
					var $select = $tr.find('select[name="ca_colorID"]');
					var colorID = $select.val();
					if (colorID == null || colorID <= 0) {
						return;
					}
					var colorObj = _this._getColorRec(colorID);
					row.push(colorObj);
				});

				/*
				 * 3. theadの描画
				 *    ついでにtbody用のhtmlも作成してしまう
				 */
				var input_html = '';
				var thead_html = '<tr><th>カラー／サイズ</th>';
				$.each(col, function() {
					var colObj = this.col;
					var rowObj = this.row;
					var txt = rowObj.sizeRowName + colObj.sizeColName;
					var attr = 'rowno="' + rowObj.sizeRowNo + '" colno="' + colObj.sizeColNo + '"';
					thead_html += '<th ' + attr + '>' + txt + '</th>';

					input_html += '<td class="editable pdg0">';
					input_html += '<input type="text" class="form-control" name="ca_janCode" no="' + colObj.sizeColNo + '" class="form-control" data-limit="len:13 digit" data-validator="maxlen:13 digit" />';
					input_html += '</td>';
				});
				thead_html += '</tr>';
				$table_jan_thead.append(thead_html);

				/*
				 * 4. tbodyの描画
				 */
				$.each(row, function() {
					var tr_html = '<tr>';
					tr_html += '<td name="' + this.iagID + '">' + this.iagName + '</td>';
					tr_html += input_html;
					tr_html += '</tr>';

					$table_jan_tbody.append(tr_html);
				});
			});
		},

		/**
		 * 下代構成テーブル描画
		 * @param costDtlList
		 * @param costFormatList
		 */
		renderTableCostIn: function(costDtlList, costFormatList, attr) {
			// 小数点2桁入力
			var __DEC2__ = clcom.getSysparam('PAR_AMMS_COSTITEM_DECIMAL2');
			var dec2 = __DEC2__ != null ? __DEC2__.split(',') : [];
			var dec2map = {};
			_.each(dec2, _.bind(function(d) {
				dec2map[d] = true;
			}, this));

			// 生産国
			var importID;
			if (attr != null && attr.importID != null) {
				importID = attr.importID;
			} else {
				importID = Number($("#ca_importID").val());
			}
			var importList = this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_COUNTRY];
			var f_japan = false;
			_.each(importList, _.bind(function(im) {
				if (im.iagID == importID) {
					if (im.iagCode == IMPORT_CODE_JAPAN) {
						// 日本
						f_japan = true;
					} else {
						f_japan = false;
					}
					return false;
				}
			}, this));

			// 日本・海外でタイトルを買える
			if (f_japan) {
				$("#ca_cost_in").show();
				$("#ca_cost_out").hide();
			} else {
				$("#ca_cost_in").hide();
				$("#ca_cost_out").show();
			}

			// 日本・海外で下代構成リストを作成する
			var cfList = [];
			_.each(costFormatList, _.bind(function(cf) {
				if (f_japan) {
					if (cf.costFormatTypeID == amcm_type.AMCM_VAL_COSTFMT_COMMON
						|| cf.costFormatTypeID == amcm_type.AMCM_VAL_COSTFMT_JAPAN) {
						cfList.push(cf);
					}
				} else {
					if (cf.costFormatTypeID == amcm_type.AMCM_VAL_COSTFMT_COMMON
						|| cf.costFormatTypeID == amcm_type.AMCM_VAL_COSTFMT_FOREIGN) {
						cfList.push(cf);
					}
				}
			}, this));

			/*
			 * 下代構成リストから構成のcolspanを求める
			 */
			var cs = 0;
			var maxlevel = 0;
			// まずは最大レベルを見つける
			_.each(cfList, _.bind(function(cf) {
				if (cf.formulaLevel > maxlevel) {
					maxlevel = cf.formulaLevel;
				}
			}, this));
			// colspan はmaxlevel+1
			cs = maxlevel + 1;

			// ヘッダのcolspanを設定
			var $thead = $("#ca_table_cost_in_thead");
			var $th_struct = $thead.find('th[name="th_struct"]');
			$th_struct.attr('colspan', cs);

			var $tbody = $("#ca_table_cost_in_tbody");
			// 一旦クリア
			$tbody.empty();

			var costList = {};
			_.each(costDtlList, _.bind(function(cd) {
				costList[cd.costItemID] = cd;
			}, this));

			_.each(cfList, _.bind(function(cf) {
				var cost = costList[cf.costItemID];
				cf.costDtl = (cost != null && cost.costDtl != null) ? cost.costDtl : "";

				// 追加業のHTMLを作成する（テンプレートは使わない）
				var tr = '<tr name="' + cf.costSeq + '">';
				var colspan = cs - cf.formulaLevel;	// この構成のcolspan

				/*
				 * 構成
				 */
				// formulaLevel個のindentを挿入
				for (var i = 0; i < cf.formulaLevel; i++) {
					if (i == 0) {
						tr += '<td style="min-width:8px; max-width:8px; width:8px" class="indent reference"></td>';
					} else if (i== (cf.formulaLevel-1)) {
						tr += '<td style="min-width:8px; max-width:8px; width:8px" class="indent"></td>';
					} else {
						tr += '<td style="min-width:8px; max-width:8px; width:8px" class="indent"></td>';
					}
				}
				// colspanを挿入
				if (colspan > 1) {
					tr += '<td class="ca_c_link" colspan="' + colspan + '">' + cf.costItemName;
				} else {
					tr += '<td class="ca_c_link">' + cf.costItemName;
				}
				// input
				tr += '<input type="hidden" name="ca_costItemID" value="' + cf.costItemID + '" /></td>';

				/*
				 * 下代
				 */
				tr += '<td class="ca_c_link editable pdg0">';
				//if (dec2map[cf.costItemName] === true) {
				//	tr += '<input type="text" class="form-control txtar cl_valid" name="ca_costDtl" data-validator="decimal:7,2 min:0" data-filter="comma" value="' + clutil.comma(cf.costDtl) + '" />';
				//} else if (cf.costItemTypeID == amcm_type.AMCM_VAL_COSTITEM_CALC) {
				//	tr += '<input type="text" class="form-control txtar cl_valid" name="ca_costDtl" data-filter="comma" value="' + clutil.comma(cf.costDtl) + '" />';
				//} else {
				//	tr += '<input type="text" class="form-control txtar cl_valid" name="ca_costDtl" data-validator="int:7 min:0" data-filter="comma" value="' + clutil.comma(cf.costDtl) + '" />';
				//}
				if (cf.costItemTypeID == amcm_type.AMCM_VAL_COSTITEM_CALC) {
					tr += '<input type="text" class="form-control txtar cl_valid" name="ca_costDtl" data-filter="comma" value="' + clutil.comma(cf.costDtl) + '" />';
				} else {
					tr += '<input type="text" class="form-control txtar cl_valid" name="ca_costDtl" data-validator="decimal:7,2 min:0" data-filter="comma" value="' + clutil.comma(cf.costDtl) + '" />';
				}
				tr += '</td>';

				/*
				 * costItemTypeID
				 */
				tr += '<td class="dispn">';
				tr += '<input type="hidden" name="ca_costItemTypeID" value="' + cf.costItemTypeID + '" />';
				tr += '</td>';

				/*
				 * formula
				 */
				tr += '<td class="dispn">';
				tr += '<input type="hidden" name="ca_formula" value="' + cf.formula + '" />';
				tr += '</td>';

				//var tr = _.template($("#ca_rec_template_cost_in").html(), cf);

				// tbodyに追加
				$tbody.append(tr);

				if (cf.costItemTypeID == amcm_type.AMCM_VAL_COSTITEM_CALC) {
					var $tr = $tbody.find('tr:last');
					var $input = $tr.find('input[name="ca_costDtl"]');
					$input.attr('disabled', true);

					if (cf.formulaLevel == 0) {
						$tr.addClass('reference');
					}
				}

			}, this));
		},

		/**
		 * 下代構成変更イベント
		 * @param e
		 */
		_onCostDtlChanged: function(e) {

			var $tbody = $("#ca_table_cost_in_tbody");
			var seqObj = {};
			var calcSeqArray = [];
			// 計算用オブジェクトの作成
			_.each($tbody.children('tr'), _.bind(function(tr) {
				var $tr = $(tr);
				var $ca_costDtl = $tr.find('input[name="ca_costDtl"]');
				var $ca_costItemTypeID = $tr.find('input[name="ca_costItemTypeID"]');
				var costSeq = $tr.attr('name');
				var costDtl = Number($ca_costDtl.val().split(',').join(''));
				var costItemTypeID = Number($ca_costItemTypeID.val());

				seqObj[costSeq] = costDtl;
				if (costItemTypeID == amcm_type.AMCM_VAL_COSTITEM_CALC) {
					calcSeqArray.push(costSeq);
				}
			}, this));

			_.each(calcSeqArray, _.bind(function(seq) {
				this.calcCost(seq, calcSeqArray, seqObj);
			}, this));
		},

		calcCost: function(seq, calcSeqArray, seqObj) {
			var $tbody = $("#ca_table_cost_in_tbody");
			var $tr = $tbody.children('tr[name="' + seq + '"]');
			var $ca_costDtl = $tr.find('input[name="ca_costDtl"]');
			var $ca_formula = $tr.find('input[name="ca_formula"]');
			var formula = $ca_formula.val();

			// 計算式の中に計算項目があるか確認
			var tmp = _.clone(formula);
			tmp = tmp.replace(/\{/g, '').split('}');
			_.each(tmp, _.bind(function(str) {
				var seq2 = str.replace(/[+*]/, '');
				if (_.indexOf(calcSeqArray, seq2) >= 0) {
					// 計算式なので、先に計算する
					this.calcCost(seq2, calcSeqArray, seqObj);
				}
			}, this));
			var cost = eval(this.costFormat(formula, seqObj));
			cost = Math.round(cost * 100) / 100;
			seqObj[seq] = cost;
			$ca_costDtl.val(clutil.comma(cost));
		},

		costFormat: function(template, replacement) {
            if (typeof replacement != "object") {
            	 // 可変長引数時はreplacementを詰め替え
                replacement = Array.prototype.slice.call(arguments, 1);
            }
            return template.replace(/\{(.+?)\}/g, function(m, c) {
                return (replacement[c] != null) ? replacement[c] : m;
            });

		},


		/**
		 * 組織別上代テーブル描画
		 * @param priceOrgList
		 */
		renderTablePrice: function(priceOrgList) {
			//var _this = this;
			var $tbody_zone = $("#ca_table_price_zone_tbody");
			var $tbody_store = $("#ca_table_price_store_tbody");
			var orgfunc_id = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
			var __SYSPAR_ZONE__ = clcom.getSysparam(amcm_sysparams.PAR_AMMS_ZONE_LEVELID);
			var __SYSPAR_STORE__ = clcom.getSysparam(amcm_sysparams.PAR_AMMS_STORE_LEVELID);

			//var id = (_this.orgTypeID == amcm_type.AMCM_VAL_ORG_KIND_ZONE) ? __SYSPAR_ZONE__ : __SYSPAR_STORE__;

			// 一旦クリア
			$tbody_zone.empty();
			$tbody_store.empty();

			var priceZoneList = [];
			var priceStoreList = [];

			_.each(priceOrgList, _.bind(function(item) {
				if (item.orgTypeID == amcm_type.AMCM_VAL_ORG_KIND_ZONE) {
					priceZoneList.push(item);
				} else {
					priceStoreList.push(item);
				}
			}, this));

			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				var len = priceZoneList.length;
				for (var i = len; i < 5; i++) {
					var add_tmp = {
							fromDate: 0,
							toDate: 0,
							id: 0,
							orgID: 0,
							orgCode: "",
							orgName: "",
							orgTypeID: amcm_type.AMCM_VAL_ORG_KIND_ZONE,
							orgPrice: "",
							orgPriceIntax: "",
						};
					priceZoneList.push(add_tmp);
				}
				len = priceStoreList.length;
				for (var i = len; i < 5; i++) {
					var add_tmp = {
							fromDate: 0,
							toDate: 0,
							id: 0,
							orgID: 0,
							orgCode: "",
							orgName: "",
							orgTypeID: amcm_type.AMCM_VAL_ORG_KIND_STORE,
							orgPrice: "",
							orgPriceIntax: "",
						};
					priceStoreList.push(add_tmp);
				}
			}
			_.each(priceZoneList, _.bind(function(item) {
				var dataOrg = {
						id: item.orgID,
						//code: item.orgCode,
						name: item.orgName,
					};
				var $tbody = $tbody_zone;

				// 追加業のHTMLを作成する
				var tr = _.template($("#ca_rec_template_price").html(), item);
				// tbodyに一旦追加
				$tbody.append(tr);

				var $tr_last = $tbody.find('tr:last');


				// 組織オートコンプリート初期化
				var $input = $tr_last.find('input[name="ca_orgID"]');
				var opt = {
					el: $input,
					dependAttrs: {
						orgfunc_id: orgfunc_id,
						orglevel_id: __SYSPAR_ZONE__,
					},
				};
				clutil.clorgcode(opt);
				// 改めて値を設定
				$input.autocomplete('clAutocompleteItem', dataOrg);
			}, this));

			_.each(priceStoreList, _.bind(function(item) {
				var dataOrg = {
						id: item.orgID,
						code: item.orgCode,
						name: item.orgName,
					};
				var $tbody = $tbody_store;

				// 追加業のHTMLを作成する
				var tr = _.template($("#ca_rec_template_price").html(), item);
				// tbodyに一旦追加
				$tbody.append(tr);

				var $tr_last = $tbody.find('tr:last');


				// 組織オートコンプリート初期化
				var $input = $tr_last.find('input[name="ca_orgID"]');
				var opt = {
					el: $input,
					dependAttrs: {
						orgfunc_id: orgfunc_id,
						orglevel_id: __SYSPAR_STORE__,
						f_stockmng: 1,
					},
				};
				clutil.clorgcode(opt);
				// 改めて値を設定
				$input.autocomplete('clAutocompleteItem', dataOrg);

			}, this));

//			$.each(priceOrgList, function() {
//				var dataOrg = {
//					id: this.orgID,
//					code: this.orgCode,
//					name: this.orgName,
//				};
//				var $tbody = this.orgTypeID == amcm_type.AMCM_VAL_ORG_KIND_ZONE ? $tbody_zone : $tbody_store;
//
//				// 追加業のHTMLを作成する
//				var tr = _.template($("#ca_rec_template_price").html(), this);
//				// tbodyに一旦追加
//				$tbody.append(tr);
//
//				var $tr_last = $tbody.find('tr:last');
//
//
//				// 組織オートコンプリート初期化
//				var $input = $tr_last.find('input[name="ca_orgID"]');
//				var opt = {
//					el: $input,
//					dependAttrs: {
//						orgfunc_id: orgfunc_id,
//						orglevel_id: id,
//					},
//				};
//				if (_this.orgTypeID == amcm_type.AMCM_VAL_ORG_KIND_STORE) {
//					opt.dependAttrs.f_stockmng = 1;
//				}
//				clutil.clorgcode(opt);
//				// 改めて値を設定
//				$input.autocomplete('clAutocompleteItem', dataOrg);
//			});
		},

		/**
		 * ゾーン別上代テーブル行追加処理
		 * @param e
		 * @returns
		 */
		_onPriceZoneAddRow: function(e) {
			var $tgt = $(e.target);
			var $table = $tgt.parents('table');
			if ($table.hasClass('readonly')) {
				// 参照モードなのでなにもしない
				return;
			}
			var __SYSPAR_ZONE__ = clcom.getSysparam(amcm_sysparams.PAR_AMMS_ZONE_LEVELID);

			// 空データ
			var add_tmp = {
				fromDate: 0,
				toDate: 0,
				id: 0,
				orgID: 0,
				orgCode: "",
				orgName: "",
				orgTypeID: amcm_type.AMCM_VAL_ORG_KIND_ZONE,
				orgPrice: 0,
				orgPriceIntax: 0,
			};

			var tr = _.template($("#ca_rec_template_price").html(), add_tmp);
			var $tbody = $("#ca_table_price_zone_tbody");

			$tbody.append(tr);

			var $tr_last = $tbody.find('tr:last');
			clutil.initUIelement($tr_last);

			// 組織オートコンプリート初期化
			var opt = {
				getOrgFuncId: function() {
					return 1;
				},
				getOrgLevelId: function() {
					return __SYSPAR_ZONE__;
				},
			};
			var $input = $tr_last.find('input[name="ca_orgID"]');
			clutil.clorgcode($input, opt);
		},

		/**
		 * 税率を取得する
		 * @param vendor_id メーカーID
		 * @param iymd 取得日
		 */
		getTaxRate: function(vendor_id, iymd) {
			// 取引先別税率を取得
			var taxrt = clcom.getVendorTaxHist(vendor_id, iymd);
			if (taxrt == null) {
				// 取引先別がなければデフォルト税率を取得
				taxrt = clcom.getTaxHist(iymd);
			}
			return taxrt;
		},

		_onOrgPriceIntraxChanged: function(e) {
			var $input = $(e.target);
			var $tgt = $input.parent().next();
			var intax = Number($input.val().split(',').join(''));
			var maker = $("#ca_makerID").autocomplete('clAutocompleteItem');
			var maker_id = 0;
			if (maker && maker.id) {
				maker_id = maker.id;
			}
			var taxrt = this.getTaxRate(maker_id, clcom.getOpeDate());
			var obj = clutil.parseTax(intax, taxrt);
			$tgt.text(clutil.comma(obj.withoutTax));
		},

		/**
		 * 店舗別上代テーブル行追加処理
		 * @param e
		 * @returns
		 */
		_onPriceStoreAddRow: function(e) {
			var $tgt = $(e.target);
			var $table = $tgt.parents('table');
			if ($table.hasClass('readonly')) {
				// 参照モードなのでなにもしない
				return;
			}
			var __SYSPAR_STORE__ = clcom.getSysparam(amcm_sysparams.PAR_AMMS_STORE_LEVELID);
			var orgfunc_id = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));

			// 空データ
			var add_tmp = {
				fromDate: 0,
				toDate: 0,
				id: 0,
				orgID: 0,
				orgCode: "",
				orgName: "",
				orgTypeID: amcm_type.AMCM_VAL_ORG_KIND_STORE,
				orgPrice: 0,
				orgPriceIntax: 0,
			};

			var tr = _.template($("#ca_rec_template_price").html(), add_tmp);
			var $tbody = $("#ca_table_price_store_tbody");

			$tbody.append(tr);

			var $tr_last = $tbody.find('tr:last');
			clutil.initUIelement($tr_last);

			// 組織オートコンプリート初期化
			var $input = $tr_last.find('input[name="ca_orgID"]');
			var opt = {
				el: $input,
				dependAttrs: {
					orgfunc_id: orgfunc_id,
					orglevel_id: __SYSPAR_STORE__,
					f_stockmng: 1,
				},
			};
			clutil.clorgcode(opt);
		},

		_onPriceOrgDelRow: function(e) {
			var $tgt = $(e.target);
			var $table = $tgt.parents('table');
			if ($table.hasClass('readonly')) {
				// 参照モードなのでなにもしない
				return;
			}

			var $tr = $tgt.parents('tr');
			$tr.remove();
		},

		renderTableTgtStore: function(tgtStoreList) {
			var $tbody = $("#ca_table_tgt_tbody");
			var orgfunc_id = clcom.getSysparam(amcm_sysparams.PAR_AMMS_DEFAULT_ORG_FUNCID);
			var __SYSPAR_STORE__ = clcom.getSysparam(amcm_sysparams.PAR_AMMS_STORE_LEVELID);

			// 一旦クリア
			$tbody.empty();

			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				var len = tgtStoreList.length;
				for (var i = len; i < 5; i++) {
					// 空データ
					var add_tmp = {
						fromDate: 0,
						toDate: 0,
						id: 0,
						tgtOrgID: 0,
						tgtOrgCode: "",
						tgtOrgName: "",
					};
					tgtStoreList.push(add_tmp);
				}
			}

			$.each(tgtStoreList, function() {
				var dataOrg = {
					id: this.tgtOrgID,
					code: this.tgtOrgCode,
					name: this.tgtOrgName,
				};

				// 追加業のHTMLを作成する
				var tr = _.template($("#ca_rec_template_tgt").html(), this);
				// tbodyに一旦追加
				$tbody.append(tr);

				var $tr_last = $tbody.find('tr:last');

				// 組織オートコンプリート初期化
//				var opt = {
//					getOrgFuncId: function() {
//						return 1;
//					},
//					getOrgLevelId: function() {
//						var id = __SYSPAR_STORE__;
//						return id;
//					},
//
//				};
				var $input = $tr_last.find('input[name="ca_tgtOrgID"]');
				var opt = {
					el: $input,
					dependAttrs: {
						orgfunc_id: orgfunc_id,
						orglevel_id: __SYSPAR_STORE__,
						f_stockmng: 1,
					},
				};
				clutil.clorgcode(opt);
				// 改めて値を設定
				$input.autocomplete('clAutocompleteItem', dataOrg);
			});

			var limitFlag = $("#ca_limitFlag").prop("checked") ? 1 : 0;
			if (limitFlag == 0) {
				$("#div_tgt_store").hide();
			} else {
				$("#div_tgt_store").show();
			}
		},

		/**
		 * 対象店舗テーブル行追加処理
		 * @param e
		 * @returns
		 */
		_onTgtAddRow: function(e) {
			var $tgt = $(e.target);
			var $table = $tgt.parents('table');
			if ($table.hasClass('readonly')) {
				// 参照モードなのでなにもしない
				return;
			}
			var orgfunc_id = clcom.getSysparam(amcm_sysparams.PAR_AMMS_DEFAULT_ORG_FUNCID);
			var __SYSPAR_STORE__ = clcom.getSysparam(amcm_sysparams.PAR_AMMS_STORE_LEVELID);

			// 空データ
			var add_tmp = {
				fromDate: 0,
				toDate: 0,
				id: 0,
				tgtOrgID: 0,
				tgtOrgCode: "",
				tgtOrgName: "",
			};

			var tr = _.template($("#ca_rec_template_tgt").html(), add_tmp);
			var $tbody = $("#ca_table_tgt_tbody");

			$tbody.append(tr);

			var $tr_last = $tbody.find('tr:last');
			clutil.initUIelement($tr_last);

			// 組織オートコンプリート初期化
//			var opt = {
//				getOrgFuncId: function() {
//					return 1;
//				},
//				getOrgLevelId: function() {
//					var id = __SYSPAR_STORE__;
//					return id;
//				},
//
//			};
			var $input = $tr_last.find('input[name="ca_tgtOrgID"]');
			var opt = {
					el: $input,
					dependAttrs: {
						orgfunc_id: orgfunc_id,
						orglevel_id: __SYSPAR_STORE__,
						f_stockmng: 1,
					},
				};
			clutil.clorgcode(opt);
		},

		/**
		 * 対象店舗テーブル行削除処理
		 * @param e
		 */
		_onTgtDelRow: function(e) {
			var $tgt = $(e.target);
			var $table = $tgt.parents('table');
			if ($table.hasClass('readonly')) {
				// 参照モードなのでなにもしない
				return;
			}

			var $tr = $tgt.parents('tr');
			$tr.remove();
		},

		parseAttrAnyList: function(attrAnyList) {
			var anyList = {};

			$.each(attrAnyList, function() {
				anyList[this.iagfuncID] = this;
			});

			return anyList;
		},

		/**
		 * 任意属性描画処理
		 * @param attrDefList
		 * @param attrAnyList
		 * @param itgrpId
		 */
		renderItemAttrAny: function(attrDefList, attrAnyList, itgrpId) {
			var _this = this;
			var lf = '<div class="clear"></div>';
			var $div_info = $("#any_info");
			var anyList = this.parseAttrAnyList(attrAnyList);

			// 一旦クリア
			$div_info.empty();

			var n = 0;
			$.each(attrDefList, function() {
				// 任意属性テンプレート
				var div = _.template($("#ca_rec_template_any").html(), this);
				// 一旦追加
				$div_info.append(div);
				n++;
				if ((n%2) == 0) {
					// 改行
					$div_info.append(lf);
				}


				var $div = $div_info.find('div[name="div_any"]:last');
				clutil.initUIelement($div);

				var any = anyList[this.iagfuncID];
				var attrItemList = _this.attrItemMap[this.iagfuncID];

				var $select = $div.find('select.ca_iagID');

				clutil.cltypeselector2($select, attrItemList, 1,
						null, 'iagID', 'iagName', 'iagCode');
				if (any != null) {
					$select.selectpicker('val', any.iagID);
				}
			});
		},

		/**
		 * 画像描画
		 * @param $view
		 * @param photoList
		 */
		renderPhotoList: function($view, photoList) {
			$("#ul_otherThumbs").empty();	// サムネイルを一旦消去

			var count = 0;
			if (photoList != null) {
				if (photoList.length > 0) {

					// 画像表示部をクリア
					$("#img_mainPhoto").removeAttr('src');
					$("#img_mainPhoto").removeAttr('alt');
					$("#img_clothPhoto").removeAttr('src');
					$("#img_clothPhoto").removeAttr('alt');

					$.each(photoList, function() {
						var photo = this;
						if (photo.mainFlag != 0) {
							// メイン画像
							$("#img_mainPhoto").attr('src', photo.photoURL);
							$("#img_mainPhoto").attr('alt', photo.photoComment); // altは画像コメントにしておこう

							// この後サイズ調整がいる？
						} else if (photo.clothFlag != 0) {
							// 生地画像
							$("#img_clothPhoto").attr('src', photo.photoURL);
							$("#img_clothPhoto").attr('alt', photo.photoComment); // altは画像コメントにしておこう
							// この後サイズ調整がいる？
						} else {
							// その他画像
							var html = _.template($("#ca_rec_template_photo").html(), photo);
							$("#ul_otherThumbs").append(html);

							// この後サイズ調整がいる？
						}
						count++;
					});
				} else {
					// 画像を消去
					$("#img_mainPhoto").removeAttr('src');
					$("#img_mainPhoto").removeAttr('alt');
					$("#img_clothPhoto").removeAttr('src');
					$("#img_clothPhoto").removeAttr('alt');
				}
			}
			$("#span_photo_count").text(count);
		},

		/**
		 * 表示用下代情報の作成
		 * @param item
		 * @param price
		 * @returns {___anonymous57941_58103}
		 */
		_createCostInfo: function(item, price) {
			var profitRate = "";
			var cost = {
				cost: "",	// 下代
				profitRate: "",	// 経準率
				currencyID: 0,	// 通貨区分
				exchangeRate: 0,	// 為替レート
			};
			if (price != null) {
				if (price.price != 0) {
					profitRate = (price.price - price.cost) / price.price;
					profitRate = (Math.round(profitRate*1000) / 10);
				}

				cost = {
					cost: price.cost,	// 下代
					profitRate: profitRate,	// 経準率
					currencyID: price.currencyID,	// 通貨区分
					exchangeRate: price.exchangeRate,	// 為替レート
				};
			}
			if (cost.cost == 0 && this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				cost.cost = "";
			}

			return cost;
		},

		/**
		 * 表示用販売情報の作成
		 * @param item
		 * @param price
		 * @param attr
		 * @param info
		 * @returns {___anonymous58320_58720}
		 */
		_createSaleInfo: function(item, price, attr, info) {
			var ca_saleInfo = {
				priceIntax: "",
				price: "",
				year: 0,
				salesStartDate: 0,
				salesEndDate: 0,
				selloutYear: 0,
				selloutSeasonID: 0,
				setupFlag: 0,
				bundleID: 0,
				bundleView: "",
				limitFlag: 0,
			};
			if (price != null) {
				ca_saleInfo.priceIntax = price.priceIntax;
				ca_saleInfo.price = price.price;
			}
			if (item != null) {
				ca_saleInfo.year = item.year;
			}
			if (attr != null) {
				ca_saleInfo.salesStartDate = attr.salesStartDate;
				ca_saleInfo.salesEndDate = attr.salesEndDate;
				ca_saleInfo.selloutYear = attr.selloutYear;
				ca_saleInfo.selloutSeasonID = attr.selloutSeasonID;
				ca_saleInfo.setupFlag = attr.setupFlag;
				ca_saleInfo.limitFlag = attr.limitFlag;
			}
			if (info != null) {
				ca_saleInfo.bundleID = info.bundleID;
				ca_saleInfo.bundleView = info.bundleCode + ":" + info.bundleName;
				if (ca_saleInfo.bundleView == ":") {
					ca_saleInfo.bundleView = "";
				}
			}
			if (ca_saleInfo.priceIntax == 0 && this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				ca_saleInfo.priceIntax = "";
				ca_saleInfo.price = "";
			}
			return ca_saleInfo;
		},

		/**
		 * 差戻し理由描画
		 * @param commentList
		 * @param orderHeadList
		 */
		renderComment: function(commentList) {
			if (clcom.srcId == 'AMMSV1090') {
				// 商品マスタ一覧から来た時は、差戻し理由を入力不可に
				clutil.inputReadonly($("#ca_comment"));
			} else {
				// それ以外（承認一覧）から来た時は、差戻し理由を入力可に
				clutil.inputRemoveReadonly($("#ca_comment"));
			}
			var $tbody = $("#ca_table_comment_thead");
			// 一旦クリア
			$tbody.empty();

			var commentSeq = 0;
			var orderSeq = 0;
			$.each(commentList, function() {
				var comment = this;
				if (commentSeq < comment.commentSeq) {
					commentSeq = comment.commentSeq;
					orderSeq = comment.orderSeq;
				}
				var html = _.template($("#ca_rec_template_comment").html(), comment);
				$tbody.append(html);
			});

			$("#ca_commentSeq").val(commentSeq+1);
			$("#ca_orderSeq").val(orderSeq+1);
		},

		/**
		 * タグ発行承認後の編集可能項目
		 * @param info
		 */
		tagApprovalInputControl: function(info) {
			var tagApproveTypeID = info != null ? info.tagApproveTypeID : 0;

			switch (tagApproveTypeID) {
			case amcm_type.AMCM_VAL_APPROVE_APPROVE:
				// タグ発行承認済みなら、以下を入力不可にする

				// タグ情報
				clutil.viewReadonly($("#ca_tagInfo"));

				// カラーサイズ展開
				clutil.viewReadonly($("#ca_colorSizeInfo"));

				// 発注数
				clutil.viewReadonly($('div[name="div_order_table"]'));

				// タグ印字項目
				clutil.viewReadonly($('div.tag'));
				break;
			case amcm_type.AMCM_VAL_APPROBE_APPLY:
				// タグ発行承認申請中で承認一覧からの場合は、差戻し理由以外は編集不可
				if (clcom.srcId == 'AMMSV0130') {
					clutil.viewReadonly($("#ca_form"));
					clutil.viewRemoveReadonly($("#ca_coomentListInfo"));
				}
				break;
			}
		},

		/**
		 * 最終承認後の編集可能項目
		 * @param info
		 */
		lastApprovalInputControl: function(info) {
			var approveTypeID = info != null ? info.approveTypeID : 0;

			if (approveTypeID != amcm_type.AMCM_VAL_APPROVE_APPROVE) {
				return;
			}

			var editTypeID = Number($("#ca_editTypeID").val());

			// まず全体を編集不可にする
			clutil.viewReadonly($('#ca_main'));

			// 画像確認は可能にする
			$("#mainPicHover").removeClass('notDialog');

			// 編集内容により編集可能な項目を活性化する
			switch (editTypeID) {
			case amcm_type.AMCM_VAL_ITEM_EDIT_ADDORDER:
				// 追加発注
				clutil.viewRemoveReadonly($('.additionalOrder'));
				break;
			case amcm_type.AMCM_VAL_ITEM_EDIT_CANCELORDER:
				// 発注取消
				clutil.viewRemoveReadonly($('.orderCancel'));
				// 発注停止をオンにする
				$('#ca_cancelFlag').attr('checked', true).closest('label').addClass('checked');
				break;
			case amcm_type.AMCM_VAL_ITEM_EDIT_UPD:
				// 承認不要変更(編集)
				clutil.viewRemoveReadonly($('.updateEdit'));
				// 素材変更イベントを飛ばしておく
				$('#ca_materialID').trigger('change');
				break;
			case amcm_type.AMCM_VAL_ITEM_EDIT_UPDBASIC:
				// 基本属性変更
				clutil.viewRemoveReadonly($('.updateBasic'));
				// 素材変更イベントを飛ばしておく
				$('#ca_materialID').trigger('change');
				// シーズンの変更イベント発行
				$("#ca_seasonID").trigger('change');

				// 商品区分の特別処理
				var itemTypeID = $("#ca_itemTypeID").val();
				if (itemTypeID == amcm_type.AMCM_VAL_ITEM_REGULAR) {
					// 定番の場合のみ編集可
					clutil.viewRemoveReadonly($('#ca_itemTypeID'));
				}
				break;
			}
		},

		priceHistList: null,
		csitemList: null,
		photoList: null,
		infoRec: null,
		attrItemMap: {},

		curTgtColorMap: {},
		curTgtSizeMap: {},

		/**
		 * カレント商品展開カラーのハッシュマップ作成
		 */
		initCurTgtColorMap: function() {
			this.curTgtColorMap = {};

			if (this.savedData == null
					|| this.savedData.AMMSV0100CurGetRsp == null
					|| this.savedData.AMMSV0100CurGetRsp.tgtColorList == null
					|| this.savedData.AMMSV0100CurGetRsp.tgtColorList.length == 0) {
				return;
			}
			_.each(this.savedData.AMMSV0100CurGetRsp.tgtColorList, _.bind(function(tgtColor) {
				this.curTgtColorMap[tgtColor.tgtColorID] = tgtColor;
			}, this));
		},

		initCurTgtSizeMap: function() {
			this.curTgtSizeMap = {};

			if (this.savedData == null
					|| this.savedData.AMMSV0100CurGetRsp == null
					|| this.savedData.AMMSV0100CurGetRsp.tgtSizeList == null
					|| this.savedData.AMMSV0100CurGetRsp.tgtSizeList.length == 0) {
				return;
			}
			_.each(this.savedData.AMMSV0100CurGetRsp.tgtSizeList, _.bind(function(tgtSize) {
				if (this.curTgtSizeMap[tgtSize.tgtColorID] == null) {
					this.curTgtSizeMap[tgtSize.tgtColorID] = {};
				}
				this.curTgtSizeMap[tgtSize.tgtColorID][tgtSize.tgtSizeID] = tgtSize;
			}, this));

		},

		/**
		 * GET 応答のイベントを受ける
		 */
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			var data = args.data;
			this.savedData = _.deepClone(data);	// 検索結果を保存しておく

			this.initCurTgtColorMap();
			this.initCurTgtSizeMap();

			var AMMSV0100GetRsp = data.AMMSV0100GetRsp;

			var item = (AMMSV0100GetRsp != null) ? AMMSV0100GetRsp.item : {};

			var req = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
				AMMSV0100GetReq: {
				},
				// 商品分類マスタ更新リクエスト
				AMMSV0100UpdReq: {
				},
				AMMSV0100FormatGetReq: {
					srchItgrpID: item.itgrpID,
					srchDate: item.fromDate,
				},
				AMMSV0100SizeGetReq:{
					srchSizePtnID: item.sizePtnID,
					srchDate: item.fromDate,
				},
				AMMSV0100TagAddrGetReq:{
					srchMakerID: item.makerID,
					srchDate: item.fromDate,
				},
				AMMSV0100PriceHistGetReq:{
				},
			};
			var uri = "AMMSV1100";

			switch(args.status){
			case 'OK':
			case 'DONE':		// 確定済

				clutil.postJSON(uri, req).done(_.bind(function(data2) {
					data.AMMSV0100FormatGetRsp = data2.AMMSV0100FormatGetRsp;
					data.AMMSV0100SizeGetRsp = data2.AMMSV0100SizeGetRsp;
					data.AMMSV0100TagAddrGetRsp = data2.AMMSV0100TagAddrGetRsp;
					// 正常終了
					var args2 = {
						status: args.status,
						data: data,
					};
					this._onFormatGetCompleted(args2, e);
				}, this)).fail(_.bind(function(data) {
					// エラー終了
					clutil.mediator.trigger('onTicker', data.rspHead);
				}, this));

				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), form);
				//clutil.data2view(this.$("#ca_form"), itgrpRel);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			}
		},

		/**
		 * #ca_itemの商品属性コンボボックスを初期化
		 */
		renderCAItem: function(attr, itgrpID) {
			itgrpID = itgrpID == null ? 0 : itgrpID;
			// サブクラス1
			var $select = $("#ca_subcls1ID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_SUBCLS1, 0, attr.subcls1ID, 1);
			// サブクラス2
			$select = $("#ca_subcls2ID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_SUBCLS2, 0, attr.subcls2ID, 1);
			// 属性ブランド
			$select = $("#ca_brandID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_BRAND, 0, attr.brandID, 1);
			// スタイル
			$select = $("#ca_styleID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_STYLE, 0, attr.styleID, 1);
			// テイスト
			clutil.cltypeselector2(
				this.$('#ca_テイスト'),
				[
					{ id: 1, code: '001', name: 'ベーシック' },
					{ id: 2, code: '002', name: 'タウン' },
					{ id: 3, code: '003', name: 'ヨーロピアン' },
					{ id: 4, code: '004', name: 'モード' },
				]
			);
			// 素材
			$select = $("#ca_materialID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_MATERIAL, 0, attr.materialID, 1);
			// 色
			this.clitemattrselector($('#ca_色'), iagfunc.ITEMATTRGRPFUNC_ID_COLOR, 0, 0, 1);
			// サブ色
			this.clitemattrselector($('#ca_サブ色'), iagfunc.ITEMATTRGRPFUNC_ID_DESIGNCOLOR, 0, 0, 1);
			// 柄
			$select = $("#ca_designID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_DESIGN, 0, attr.designID, 1);
			// サブ柄
			$select = $("#ca_subDesignID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_SUBDESIGN, 0, attr.subDesignID, 1);
			//// ベース色
			//$select = $("#ca_designColorID");
			//this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_DESIGNCOLOR, 0, attr.designColorID, 1);
			// 用途区分
			$select = $("#ca_usetypeID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_USETYPE, 0, attr.usetypeID, 1);
			// 販促企画
			clutil.cltypeselector2(
				this.$('#ca_販促企画'),
				[
					{ id: 1, code: '001', name: 'キャリア' },
					{ id: 2, code: '002', name: '就活' },
					{ id: 4, code: '004', name: 'セットアップ' },
				]
			);
			// 糸LOX
			$select = $("#ca_itoloxID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_ITOLOX, 0, attr.itoloxID, 1);

		},

		getCodeName: function(code, name) {
			var codename = "";

			if (code != "" || name != "") {
				codename = code + ":" + name;
			}
			return codename;
		},

		/**
		 *
		 * @param args
		 * @param e
		 */
		_onFormatGetCompleted: function(args, e) {
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data, formatData: formatData}
			var _this = this;

			// 一旦Readonlyを解除する XXX いらない？
			//this.initReadonly();

			var data = args.data;
			var AMMSV0100GetRsp = data.AMMSV0100GetRsp;
			var AMMSV0100FormatGetRsp = data.AMMSV0100FormatGetRsp;
			var AMMSV0100SizeGetRsp = data.AMMSV0100SizeGetRsp;
			var AMMSV0100TagAddrGetRsp = data.AMMSV0100TagAddrGetRsp;
			var AMMSV0100PriceHistGetRsp = data.AMMSV0100PriceHistGetRsp;

			var itgrpId = 0;

			var item = null;
			var citemList = null;
			var csitemList = null;
			var attr = null;
			var attrAnyList = null;
			var tgtColorList = null;
			var tgtSizeList = null;
			var tgtStoreList = null;
			var price = null;
			var priceOrgList = null;
			var materialList = null;
			var modelNoList = null;
			var specList = null;
			var photoList = null;
			var costDtlList = null;
			var orderHeadList = null;
			var orderDtlList = null;
			var commentList = null;
			var info = null;

			var specFormatList = null;
			var costFormatList = null;
			var attrDefList = null;
			var attrItemList = null;

			var sizeRowList = null;
			var sizeColList = null;
			var sizeRecList = null;

			var tagAddrList = null;

			var histList = null;


			if (AMMSV0100GetRsp != null) {
				item = AMMSV0100GetRsp.item;
				citemList = AMMSV0100GetRsp.citemList;
				csitemList = AMMSV0100GetRsp.csitemList;
				attr = AMMSV0100GetRsp.attr;
				attrAnyList = AMMSV0100GetRsp.attrAnyList;
				tgtColorList = AMMSV0100GetRsp.tgtColorList;
				tgtSizeList = AMMSV0100GetRsp.tgtSizeList;
				tgtStoreList = AMMSV0100GetRsp.tgtStoreList;
				price = AMMSV0100GetRsp.price;
				priceOrgList = AMMSV0100GetRsp.priceOrgList;
				materialList = AMMSV0100GetRsp.materialList;
				modelNoList = AMMSV0100GetRsp.modelNoList;
				specList = AMMSV0100GetRsp.specList;
				photoList = AMMSV0100GetRsp.photoList;
				costDtlList = AMMSV0100GetRsp.costDtlList;
				orderHeadList = AMMSV0100GetRsp.orderHeadList;
				orderDtlList = AMMSV0100GetRsp.orderDtlList;
				commentList = AMMSV0100GetRsp.commentList;
				info = AMMSV0100GetRsp.info;
			}
			if (item != null) {
				itgrpId = item.itgrpID;
			}
			if (AMMSV0100FormatGetRsp != null) {
				specFormatList = AMMSV0100FormatGetRsp.specFormatList;
				specChoiceList = AMMSV0100FormatGetRsp.specChoiceList;
				costFormatList = AMMSV0100FormatGetRsp.costFormatList;
				attrDefList = AMMSV0100FormatGetRsp.attrDefList;
				attrItemList = AMMSV0100FormatGetRsp.attrItemList;
			}

			if (AMMSV0100SizeGetRsp != null) {
				sizeRowList = AMMSV0100SizeGetRsp.sizeRowList;
				sizeColList = AMMSV0100SizeGetRsp.sizeColList;
				sizeRecList = AMMSV0100SizeGetRsp.sizeRecList;
			}
			if (AMMSV0100TagAddrGetRsp != null) {
				tagAddrList = AMMSV0100TagAddrGetRsp.tagAddrList;
			}

			if (AMMSV0100PriceHistGetRsp != null) {
				histList = AMMSV0100PriceHistGetRsp.histList;
			}

			this.priceHistList = histList;
			this.csitemList = csitemList;

			// 保存しておく
			this.sizeRowList = sizeRowList;
			this.sizeColList = sizeColList;
			this.sizeRecList = sizeRecList;
			this.photoList = photoList;
			this.infoRec = info;
			this.tagAddrList = tagAddrList;
			this.costFormatList = costFormatList;
			this.orderHeadList = orderHeadList;

			if (this.costFormatList != null && this.costFormatList.length > 0) {
				// 1レコード目の原価構成表区分IDを保存
				this.savedCostFormatType = this.costFormatList[0].costFormatTypeID;
			}
			if (attrItemList != null) {
				// 商品属性項目を定義ID毎にまとめる
				_this.attrItemMap = {};
				$.each(attrItemList, function() {
					var attrItem = this;
					var key = attrItem.iagfuncID;
					if (_this.attrItemMap[key] == null) {
						_this.attrItemMap[key] = [];
					}
					_this.attrItemMap[key].push(attrItem);
				});
			}

			// ca_req
			var ca_req = this._createReq(item);
			var ca_baseInfo = this._createBaseInfo(item, attr, info);
			var ca_tagInfo = this._createTagInfo(attr);
			// カラー、サイズ、JANのテーブル用オブジェクト生成
			var ca_colorSizeInfo = this._createColorSizeInfo(item);
			var ca_costInfo = this._createCostInfo(item, price);
			var ca_saleInfo = this._createSaleInfo(item, price, attr, info);

			var ca_head = this._createHead(item, attr, info, price, orderDtlList);

			/*
			 * 下部ボタンのための材料を集める
			 */
			// 処理区分
			var ope_id = this.opeTypeId;
			// タグ発行承認区分ID
			var tagApproveTypeID = info != null ? info.tagApproveTypeID : 0;
			// 最終承認区分ID
			var approveTypeID = info != null ? info.approveTypeID : 0;
			// 承認回数
			var approveCount = info != null ? info.approveCount : 0;
			// 編集内容
			var editTypeID = $("#ca_editTypeID").val();
			// 遷移元画面
			var srcId = clcom.srcId;
			var opt = {
				opeTypeId: ope_id,
				tagApproveTypeID: tagApproveTypeID,
				approveTypeID: approveTypeID,
				approveCount: approveCount,
				editTypeID: editTypeID,
				srcId: srcId,
			};

			var f_head = false;

			if (opt.tagApproveTypeID == amcm_type.AMCM_VAL_APPROVE_APPLY
					|| opt.tagApproveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE1	// タグ承認申請
					|| opt.approveTypeID == amcm_type.AMCM_VAL_APPROVE_APPLY
					|| opt.approveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE1		// 最終承認申請
					|| this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL
					|| this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
				f_head = true;
			}

			var ids = [];
			switch(args.status){
			case 'OK':
				// 編集内容の変更
				switch (this.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
					// 新規作成＆複製
					ids.push(amcm_type.AMCM_VAL_ITEM_EDIT_NEW);
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					// 編集
					if (info.approveCount == 0 &&
							info.approveTypeID != amcm_type.AMCM_VAL_APPROVE_APPROVE) {
						// 未承認
						ids.push(amcm_type.AMCM_VAL_ITEM_EDIT_EDIT);
					} else {
						// 承認済み
						switch (this.reapproveTypeID) {
						case amcm_type.AMCM_VAL_ITEM_REAPPROVE_ODADD:
							// 追: 追加発注のみ
							ids.push(amcm_type.AMCM_VAL_ITEM_EDIT_ADDORDER);
							break;
						case amcm_type.AMCM_VAL_ITEM_REAPPROVE_ODCANCEL:
							// 消: 発注取消のみ
							ids.push(amcm_type.AMCM_VAL_ITEM_EDIT_CANCELORDER);
							break;
						case amcm_type.AMCM_VAL_ITEM_REAPPROVE_MST:
							// 再: 基本属性変更のみ
							ids.push(amcm_type.AMCM_VAL_ITEM_EDIT_UPDBASIC);
							break;
						default:
							// 追加発注、発注取消、基本属性変更、承認不要変更
							ids.push(amcm_type.AMCM_VAL_ITEM_EDIT_ADDORDER);
							ids.push(amcm_type.AMCM_VAL_ITEM_EDIT_CANCELORDER);
							ids.push(amcm_type.AMCM_VAL_ITEM_EDIT_UPDBASIC);
							ids.push(amcm_type.AMCM_VAL_ITEM_EDIT_UPD);
							break;
						}
					}
					break;
				}
				this.setEditTypeSelect(ids);
				if (ids.length == 1) {
					ca_req.editTypeID = ids[0];
				}

				// フッターボタンの変更
				this.setFooterButtons(opt);

				// args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				if (this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
					clutil.data2view(this.$("#ca_req"), ca_req);
				}
				this.renderCAItem(attr, item.itgrpID);

				// タグ種別決定
				var unit_id = $("#ca_unitID").val();
				var typeList = clcom.getTypeList(amcm_type.AMCM_TYPE_TAG);
				typeList = _.filter(typeList, _.bind(function(item) {
					var ret = false;	// 一旦全て非対象

					switch (unit_id) {
					case this.UNITID_AOKI:
						// AOKIの場合は1xxか999なら対象
						console.log("AMCM_VAL_TAG_BOX:" + amcm_type.AMCM_VAL_TAG_BOX);
						console.log("AMCM_VAL_TAG_HAND:" + amcm_type.AMCM_VAL_TAG_HAND);
						if (item.type_id <= amcm_type.AMCM_VAL_TAG_AT_GOODS_WEAK || item.type_id == amcm_type.AMCM_VAL_TAG_OWN) {
							ret = true;
						}
						break;
					case this.UNITID_ORI:
						// ORIHICAの場合は8xxか999なら対象
						console.log("AMCM_VAL_TAG_ORHAND:" + amcm_type.AMCM_VAL_TAG_ORHAND);
						if (item.type_id >= amcm_type.AMCM_VAL_TAG_ORBUS1 || item.type_id == amcm_type.AMCM_VAL_TAG_OWN) {
							ret = true;
						}
						break;
					default:
						ret = true;
						break;
					}
					return ret;
				}, this));
				clutil.cltypeselector2(this.$('#ca_tagTypeID'), typeList, 0, null, "type_id");

				clutil.data2view(this.$("#ca_head"), ca_head, "ca2_");

				clutil.data2view(this.$("#ca_item"), ca_baseInfo);
				clutil.data2view(this.$("#ca_tagInfo"), ca_tagInfo);
				clutil.data2view(this.$("#ca_colorSizeInfo"), ca_colorSizeInfo);

				// 生産国（タグ表示用）
				var $tagImport = $("#ca_tagImportID");
				this.clitemattrselector($tagImport, iagfunc.ITEMATTRGRPFUNC_ID_COUNTRY, item.itgrpID, attr.tagImportID, 1);

				// 画像
				this.renderPhotoList(this.$("#ca_photo"), this.photoList);

				// 素材テーブル
				this.renderTableMaterial(materialList, itgrpId);

				// カラー・サイズ展開
				this.renderColorSizeInfo(item, citemList, csitemList, sizeRowList, sizeColList, sizeRecList, tgtColorList, tgtSizeList, csitemList);

				// 発注情報
				this.renderOrderInfo(
						item,
						attr,
						orderHeadList,
						orderDtlList,
						tgtColorList,
						tgtSizeList,
						sizeRowList,
						sizeColList,
						sizeRecList,
						info);

				// 下代情報
				clutil.data2view(this.$("#ca_costInfo"), ca_costInfo);

				// 下代詳細テーブル
				this.renderTableCostIn(costDtlList, costFormatList, attr);
				this._onImportChangeNoIvent();

				// コメント
				clutil.data2view(this.$("#ca_commentInfo"), attr);

				// 販売情報
				clutil.data2view(this.$("#ca_saleInfo"), ca_saleInfo);

				// 組織別上代
				this.renderTablePrice(priceOrgList);

				// 対象店舗テーブル
				this.renderTableTgtStore(tgtStoreList);

				// 任意属性
				this.renderItemAttrAny(attrDefList, attrAnyList, itgrpId);

				// 型番テーブル
				this.renderTableModelNo(modelNoList, itgrpId);	// ここは非同期で処理

				// 商品仕様テーブル
				this.renderTableSpec(specList, specChoiceList, specFormatList);

				// カラーテーブル
				//this.renderTableColor(citemList, itgrpId);

				// 差戻し理由
				this.renderComment(commentList, orderHeadList);

				// 仕入無し変更イベントを発行
				$("#ca_orderFlag").trigger('change');
				// JAN手入力変更イベントを発行
				$("#ca_inputJanFlag").trigger('change');
				$("#ca_unitID").trigger('change');
				// タグ発行フラグ変更イベント
				$("#ca_tagIssueFlag").trigger('change');

				this.fieldRelation.done(_.bind(function() {
					/*
					 * 1. clcom.srcId == 'AMMSV1090'の場合
					 */
					switch (this.opeTypeId) {
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
						// 発注を一つ表示する
						this._onAddOrderInfoClick(null);
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
						this.setReadonly_req(1);
						this.setReadonly_item(0);
						this.setReadonly_tagInfo(0);
						this.setReadonly_colorSizeInfo(0);
						this.setReadonly_orderInfo(0);
						this.setReadonly_costInfo(0);
						this.setReadonly_comment(0);
						this.setReadonly_saleInfo(0);
						this.setReadonly_anyAttrInfo(0);
						this.setReadonly_commentListInfo(0);

						//clutil.viewRemoveReadonly($("#ca_item"));
						$("#mainPicHover").removeClass('notDialog');
						//clutil.viewRemoveReadonly($("#ca_tagInfo"));
						//clutil.viewRemoveReadonly($("#ca_colorSizeInfo"));
						//clutil.viewRemoveReadonly($("#ca_orderInfo"));
						//clutil.viewRemoveReadonly($("#ca_costInfo"));
						//clutil.viewRemoveReadonly($("#ca_commentInfo"));
						//clutil.viewRemoveReadonly($("#ca_saleInfo"));
						//clutil.viewRemoveReadonly($("#ca_anyAttrInfo"));
						// 素材変更イベントを飛ばしておく
						$('#ca_materialID').trigger('change');
						// シーズンの変更イベント発行
						$("#ca_seasonID").trigger('change');
						// タグ発行フラグ変更イベント
						$("#ca_tagIssueFlag").trigger('change');

						//clutil.inputReadonly($('input[name0="ca_orderDate"]'));

						this.rerenderTableSpec(specChoiceList);

						this.mdBaseView.setSubmitEnable(true);	// フッターを活性化
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
						var m = null;
						if (clcom.srcId == 'AMMSV1090') {
							if (ids.length > 1) {
								// 商品マスタ一覧からの遷移の場合、編集内容の選択を行う
								this.setReadonly_req(0);
								this.setReadonly_item(1);
								this.setReadonly_tagInfo(1);
								this.setReadonly_colorSizeInfo(1);
								this.setReadonly_orderInfo(1);
								this.setReadonly_costInfo(1);
								this.setReadonly_comment(1);
								this.setReadonly_saleInfo(1);
								this.setReadonly_anyAttrInfo(1);
								this.setReadonly_commentListInfo(1);
								//clutil.viewReadonly($("#ca_form"));
								//clutil.viewRemoveReadonly($("#ca_req"));
							} else {
								m = this.getReadonlyMode();
								// 選択肢が一件なので上部選択はなし
								this._onSrchClick(null);
							}
						} else {
							// 商品マスタ一覧以外からの遷移の場合、上部の選択はスルー
							this.setReadonly_req(7);
							this.setReadonly_item(7);
							this.setReadonly_tagInfo(7);
							this.setReadonly_colorSizeInfo(7);
							this.setReadonly_orderInfo(7);
							this.setReadonly_costInfo(7);
							this.setReadonly_comment(7);
							this.setReadonly_saleInfo(7);
							this.setReadonly_anyAttrInfo(7);
							this.setReadonly_commentListInfo(7);
							m = 7;
						}
						clutil.inputReadonly($('input[name0="ca_orderDate"]'));
						this.rerenderTableSpec(specChoiceList, m);
						this.mdBaseView.setSubmitEnable(true);	// フッターを活性化
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
						clutil.viewReadonly($("#ca_form"));
						//clutil.inputRemoveReadonly($('#ca_fromDate'));

						// 追加ボタンを非表示
						$(".addFieldUnits").hide();
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
						// 照会モードの場合はブラウザ戻るボタン［×］ボタンの Confirm を行わない。
						clcom._preventConfirm = true;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
						this.setReadonly_req(0);
						clutil.viewReadonly($("#ca_form"));

						// 追加ボタンを非表示
						$(".addFieldUnits").hide();
						// 各テーブルをreadonlyに
						$('table').addClass('readonly');
						// カラーサイズをreadonlyに
						$('div[name="del_color_size"]').addClass('readonly');
						$('div[name="del_color_size"]').removeClass('delFieldUnits');
						// 上代履歴を押下可能に
						clutil.inputRemoveReadonly($("#btn_price_hist"));

						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL:
						// 承認の場合は、差戻し理由以外は入力不可
						clutil.viewReadonly($("#ca_form"));
						clutil.viewRemoveReadonly($("#div_comment"));

						// 追加ボタンを非表示
						$(".addFieldUnits").hide();
						break;
					}
					$("#mainPicHover").removeClass('notDialog');

					// 適用期間は編集不可
					clutil.inputReadonly($("#ca_fromDate"));
					clutil.inputReadonly($("#ca_toDate"));

					clutil.inputReadonly($('input[name0="ca_orderDate"]'));

					var $div = $('div#ca_orderInfoFixed');
					var $centerID = $div.find('select#ca_centerID');
					var val = $centerID.val();
					console.log("1:$centerID.val()=" + val);
					$centerID.selectpicker('val', attr.centerID.toString());
					val = $centerID.val();
					console.log("2:$centerID.val()=" + val);

					if (approveCount == 0) {
						$('select[name0="ca_orderTgtTypeID"]').selectpicker('val', 1);
						clutil.viewReadonly($('select[name0="ca_orderTgtTypeID"]').parent('div'));
					}

				}, this));

				this.f_confirm = true;
				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_req"), ca_req);
				this.renderCAItem(attr, item.itgrpID);

				clutil.data2view(this.$("#ca_head"), ca_head, "ca2_");

				clutil.data2view(this.$("#ca_item"), ca_baseInfo);
				clutil.data2view(this.$("#ca_tagInfo"), ca_tagInfo);
				clutil.data2view(this.$("#ca_colorSizeInfo"), ca_colorSizeInfo);

				// 画像
				this.renderPhotoList(this.$("#ca_photo"), this.photoList);

				// 素材テーブル
				this.renderTableMaterial(materialList, itgrpId);

				// カラー・サイズ展開
				this.renderColorSizeInfo(item, citemList, csitemList, sizeRowList, sizeColList, sizeRecList, tgtColorList, tgtSizeList, csitemList);

				// 発注情報
				this.renderOrderInfo(
						item,
						attr,
						orderHeadList,
						orderDtlList,
						tgtColorList,
						tgtSizeList,
						sizeRowList,
						sizeColList,
						sizeRecList,
						info);

				// 下代情報
				clutil.data2view(this.$("#ca_costInfo"), ca_costInfo);

				// 下代詳細テーブル
				this.renderTableCostIn(costDtlList, costFormatList, attr);

				// コメント
				clutil.data2view(this.$("#ca_commentInfo"), attr);

				// 販売情報
				clutil.data2view(this.$("#ca_saleInfo"), ca_saleInfo);

				// 組織別上代
				this.renderTablePrice(priceOrgList);

				// 対象店舗テーブル
				this.renderTableTgtStore(tgtStoreList);

				// 任意属性
				this.renderItemAttrAny(attrDefList, attrAnyList, itgrpId);

				// 型番テーブル
				this.renderTableModelNo(modelNoList, itgrpId);	// ここは非同期で処理

				// 商品仕様テーブル
				this.renderTableSpec(specList, specChoiceList, specFormatList);

				// カラーテーブル
				//this.renderTableColor(citemList, itgrpId);

				// 差戻し理由
				this.renderComment(commentList, orderHeadList);

				$("#ca_unitID").trigger('change');

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadonly();

				// 追加ボタンを非表示
				$(".addFieldUnits").hide();
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				this.setReadonly();

				// 追加ボタンを非表示
				$(".addFieldUnits").hide();
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_req"), ca_req);
				this.renderCAItem(attr, item.itgrpID);

				clutil.data2view(this.$("#ca_head"), ca_head, "ca2_");

				clutil.data2view(this.$("#ca_item"), ca_baseInfo);
				clutil.data2view(this.$("#ca_tagInfo"), ca_tagInfo);
				clutil.data2view(this.$("#ca_colorSizeInfo"), ca_colorSizeInfo);

				// 画像
				this.renderPhotoList(this.$("#ca_photo"), this.photoList);

				// 素材テーブル
				this.renderTableMaterial(materialList, itgrpId);

				// カラー・サイズ展開
				this.renderColorSizeInfo(item, citemList, csitemList, sizeRowList, sizeColList, sizeRecList, tgtColorList, tgtSizeList, csitemList);

				// 発注情報
				this.renderOrderInfo(
						item,
						attr,
						orderHeadList,
						orderDtlList,
						tgtColorList,
						tgtSizeList,
						sizeRowList,
						sizeColList,
						sizeRecList,
						info);

				// 下代情報
				clutil.data2view(this.$("#ca_costInfo"), ca_costInfo);

				// 下代詳細テーブル
				this.renderTableCostIn(costDtlList, costFormatList, attr);

				// コメント
				clutil.data2view(this.$("#ca_commentInfo"), attr);

				// 販売情報
				clutil.data2view(this.$("#ca_saleInfo"), ca_saleInfo);

				// 組織別上代
				this.renderTablePrice(priceOrgList);

				// 対象店舗テーブル
				this.renderTableTgtStore(tgtStoreList);

				// 任意属性
				this.renderItemAttrAny(attrDefList, attrAnyList, itgrpId);

				// 型番テーブル
				this.renderTableModelNo(modelNoList, itgrpId);	// ここは非同期で処理

				// 商品仕様テーブル
				this.renderTableSpec(specList, specChoiceList, specFormatList);

				// カラーテーブル
				//this.renderTableColor(citemList, itgrpId);

				// 差戻し理由
				this.renderComment(commentList, orderHeadList);

				$("#ca_unitID").trigger('change');

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadonly();

				// 追加ボタンを非表示
				$(".addFieldUnits").hide();
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadonly();

				// 追加ボタンを非表示
				$(".addFieldUnits").hide();
				break;
			}

			this.getDivCode(item.itgrpID);
			if (item != null) {
				this.itgrpInfo = {
					id: item.itgrpID,
					code: item.itgrpCode,
					name: item.itgrpName,
				};
			} else {
				var xx = $("#ca_itgrpID").autocomplete('alAutocompleteItem');
				this.itgrpInfo = xx;
			}

			if (f_head) {
				$("#ca_head").show();
			} else {
				$("#ca_head").hide();
			}
		},

		getReadonlyMode: function() {
			/*
			 * リードオンリーのモードを決定する
			 * 0: 全て操作可能
			 * 1: 全て操作不可
			 * 2: 追加発注モード
			 * 3: 発注取消モード
			 * 4: 承認不要編集モード
			 * 5: 基本属性変更モード
			 * 6: タグ承認後モード
			 * 7: 承認モード
			 * 8: 追加発注モード（差戻し）
			 */
			var mode = 0;

			var editTypeID = Number($("#ca_editTypeID").val());
			var tagApproveTypeID = this.infoRec != null ? this.infoRec.tagApproveTypeID : 0;
			var approveTypeID = this.infoRec != null ? this.infoRec.approveTypeID : 0;
			var approveCount = this.infoRec != null ? this.infoRec.approveCount : 0;

			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
					&& (tagApproveTypeID == amcm_type.AMCM_VAL_APPROVE_APPLY
						|| tagApproveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE1
						|| approveTypeID == amcm_type.AMCM_VAL_APPROVE_APPLY
						|| approveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE1)) {
				mode = 1;
			} else if (approveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE || approveCount > 0) {
				// 承認済みなので2～5のモード
				switch (editTypeID) {
				case amcm_type.AMCM_VAL_ITEM_EDIT_ADDORDER:
					// 追加発注
					if (approveTypeID == amcm_type.AMCM_VAL_APPROVE_RETURN) {
						mode = 8;
					} else {
						mode = 2;
					}
					break;
				case amcm_type.AMCM_VAL_ITEM_EDIT_UPDBASIC:
					// 基本属性変更
					mode = 5;
					break;
				case amcm_type.AMCM_VAL_ITEM_EDIT_UPD:
					// 承認不要編集
					mode = 4;
					break;
				case amcm_type.AMCM_VAL_ITEM_EDIT_CANCELORDER:
					// 発注取消
					mode = 3;
					break;
				default:
					// その他の場合は読取専用
					mode = 1;
					break;
				}
			} else if (tagApproveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE) {
				// タグ発行承認済み
				mode = 6;
			} else if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL) {
				// 参照
				mode = 1;
			} else if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL) {
				mode = 7;
			}
			return mode;
		},

		/**
		 * 全体を入力可能状態にする
		 */
		initReadonly: function() {
			/*
			 * 本当は各ブロックをViewにすべきだったんだろうな
			 */
			// 条件部(#ca_req)
			this.initReadonly_req();

			// 基本情報
			this.initReadonly_item();

			// タグ情報
			this.initReadonly_tagInfo();

			// カラーサイズ情報
			this.initReadonly_colorSizeInfo();

			// 発注情報
			this.initReadonly_orderInfo();

			// 下代構成
			this.initReadonly_costInfo();

			// コメント
			this.initReadonly_comment();

			// 販売情報
			this.initReadonly_saleInfo();

			// 任意属性
			this.initReadonly_anyAttrInfo();

			// 差戻し理由
			this.initReadonly_commentListInfo();
		},

		/**
		 * 条件部(#ca_req)を入力可能状態にする
		 */
		initReadonly_req: function() {
			// 事業ユニット
			var $div = $("#ca_unitID").parent();
			clutil.viewRemoveReadonly($div);

			// 編集内容
			$div = $("#ca_editTypeID").parent();
			clutil.viewRemoveReadonly($div);

			// 品種
			clutil.inputRemoveReadonly($("#ca_itgrpID"));

			// 決定
			clutil.inputRemoveReadonly($("#ca_srch"));
		},

		/**
		 * 基本情報部(#ca_item)を入力可能状態にする
		 */
		initReadonly_item: function() {
			var $div;

			// 承認期限日
			clutil.inputRemoveReadonly($("#ca_approveLimitDate"));
			// 適用期間は入力不可のまま
			// 契約番号
			clutil.inputRemoveReadonly($("#ca_契約番号"));
			// メーカー担当者
			clutil.inputRemoveReadonly($("#ca_メーカー担当者"));
			// メーカーの読取り固定を解除
			clutil.unfixReadonly($("#ca_makerID"));
			// メーカー
			clutil.inputRemoveReadonly($("#ca_makerID"));

			// メーカー品番
			clutil.inputRemoveReadonly($("#ca_makerItemCode"));
			// 商品名
			clutil.inputRemoveReadonly($("#ca_name"));
			// 商品区分
			$div = $("#ca_itemTypeID").parent();
			clutil.viewRemoveReadonly($div);
			// シーズン
			$div = $("#ca_seasonID").parent();
			clutil.viewRemoveReadonly($div);
			// サブシーズンはここではいじらない

			// サブクラス１
			$div = $("#ca_subcls1ID").parent();
			clutil.viewRemoveReadonly($div);
			// サブクラス２
			$div = $("#ca_subcls2ID").parent();
			clutil.viewRemoveReadonly($div);
			// 属性ブランド
			$div = $("#ca_brandID").parent();
			clutil.viewRemoveReadonly($div);
			// スタイル
			$div = $("#ca_styleID").parent();
			clutil.viewRemoveReadonly($div);
			// テイスト
			$div = $("#ca_テイスト").parent();
			clutil.viewRemoveReadonly($div);
			// 素材
			$div = $("#ca_materialID").parent();
			clutil.viewRemoveReadonly($div);
			// 素材手入力欄はここではいじらない
			// 色
			$div = $("#ca_色").parent();
			clutil.viewRemoveReadonly($div);
			// サブ色
			$div = $("#ca_サブ色").parent();
			clutil.viewRemoveReadonly($div);
			// 柄
			$div = $("#ca_designID").parent();
			clutil.viewRemoveReadonly($div);
			// サブ柄
			$div = $("#ca_subDesignID").parent();
			clutil.viewRemoveReadonly($div);
			// ベース色
			$div = $("#ca_designColorID").parent();
			clutil.viewRemoveReadonly($div);
			// 用途区分
			$div = $("#ca_usetypeID").parent();
			clutil.viewRemoveReadonly($div);
			// 販促企画
			$div = $("#ca_販促企画").parent();
			clutil.viewRemoveReadonly($div);

			// 画像は特になし

			// 倉庫在庫開示
			clutil.inputRemoveReadonly("#ca_centerStockFlag");
			// JAN手入力
			clutil.inputRemoveReadonly("#ca_inputJanFlag");
			// 仕入無し
			clutil.inputRemoveReadonly("#ca_orderFlag");

			/*
			 * 生地情報
			 */
			// 品質
			clutil.inputRemoveReadonly("#ca_quality");
			// 生地メーカー名
			clutil.inputRemoveReadonly("#ca_clothMaker");
			// 仮生地品番
			clutil.inputRemoveReadonly("#ca_tmpClothCode");
			// 生地品番
			clutil.inputRemoveReadonly("#ca_clothCode");
			// 原反発注日
			clutil.inputRemoveReadonly("#ca_clothOrderDate");
			// 原反工場着日
			clutil.inputRemoveReadonly("#ca_clothDlvDate");

			/*
			 * 商品仕様
			 */
			// 型番
			clutil.viewRemoveReadonly($("#ca_table_modelno"));
			$("#ca_table_modelno").removeClass('readonly');

			// 商品仕様
			clutil.viewRemoveReadonly($("#ca_table_spec"));
			$("#ca_table_spec").removeClass('readonly');

			// 商品仕様追加メモ
			clutil.inputRemoveReadonly($("#ca_specComment"));
		},

		/**
		 * タグ情報部(#ca_tagInfo)を入力可能状態にする
		 */
		initReadonly_tagInfo: function() {
			var $div, $table;

			// タグ発行フラグ
			clutil.inputRemoveReadonly($("#ca_tagIssueFlag"));
			// タグ発行区分とタグ種別はここではいじらない

			// 追加定形タグ番号１
			clutil.inputRemoveReadonly($("#ca_fixedFormTag1Code"));
			// 追加定形タグ番号２
			clutil.inputRemoveReadonly($("#ca_fixedFormTag2Code"));
			// 糸LOX
			$div = $("#ca_itoloxID").parent();
			clutil.viewRemoveReadonly($div);
			// 素材
			$table = $("#ca_table_material");
			clutil.viewRemoveReadonly($table);
			$table.removeClass('readonly');
			// 強調表示
			clutil.inputRemoveReadonly($("#ca_tagHighlight"));
			// 生産国（タグ表示用）
			$div = $("#ca_tagImportID").parent();
			clutil.viewRemoveReadonly($div);
		},

		/**
		 * カラーサイズ情報部(#ca_colorSizeInfo)を入力可能状態にする
		 */
		initReadonly_colorSizeInfo: function() {
			var $div, $div_list, $table;

			// サイズパターンの読取り固定を解除
			clutil.unfixReadonly($("#ca_sizePtnID"));

			// サイズパターン
			$div = $("#ca_sizePtnID").parent();
			clutil.viewRemoveReadonly($div);

			$div_list = $('div[name="div_colorsize_list"]');
			_.each($div_list, _.bind(function(d) {
				$div = $(d);
				// カラーテーブル
				$table = $div.find('table[name="ca_table_color"]');
				clutil.viewRemoveReadonly($table);
				$table.removeClass('readonly');
				// サイズテーブル
				$table = $div.find('table[name="ca_table_size"]');
				clutil.viewRemoveReadonly($table);
				$table.removeClass('readonly');
				// JANテーブル
				$table = $div.find('table[name="ca_table_jan"]');
				clutil.viewRemoveReadonly($table);
				$table.removeClass('readonly');

				$div.find('div[name="del_color_size"]').removeClass('readonly');
				$div.find('div[name="del_color_size"]').addClass('delFieldUnits');
			}, this));

			$("#div_addColorSize").show();
		},

		/**
		 * カラーサイズ情報部(#ca_colorSizeInfo)を入力可能状態にする
		 */
		initReadonly_colorSizeInfo5: function() {
			var $div, $div_list, $table, $tbody;

			// サイズパターンの読取り固定を解除
			//clutil.unfixReadonly($("#ca_sizePtnID"));

			// サイズパターン
			//$div = $("#ca_sizePtnID").parent();
			//clutil.viewRemoveReadonly($div);

			$div_list = $('div[name="div_colorsize_list"]');
			_.each($div_list, _.bind(function(d) {
				var fNotEdit = false;
				$div = $(d);
				// カラーテーブル
				$table = $div.find('table[name="ca_table_color"]');
				clutil.viewRemoveReadonly($table);
				$table.removeClass('readonly');

				$tbody = $table.children('tbody');
				_.each($tbody.find('tr'), _.bind(function(tr) {
					var $tr = $(tr);
					var f_notedit = $tr.find('input[name="ca_fNotEdit"]').val();
					if (f_notedit == 1) {
						clutil.viewReadonly($tr);
						$tr.addClass('readonly');
						fNotEdit = true;
					} else {
						clutil.viewRemoveReadonly($tr);
						$tr.removeClass('readonly');
					}
				}, this));
				// サイズテーブル
				$table = $div.find('table[name="ca_table_size"]');
				clutil.viewRemoveReadonly($table);
				$table.removeClass('readonly');

				$tbody = $table.children('tbody');
				_.each($tbody.find('input[name="ca_fNotEdit"]'), _.bind(function(f) {
					var $fEdit = $(f);
					var $td = $fEdit.parents('td');
					if ($fEdit.val() == 1) {
						clutil.viewReadonly($td);
					}
				}, this));
				// JANテーブル
				$table = $div.find('table[name="ca_table_jan"]');
				clutil.viewRemoveReadonly($table);
				$table.removeClass('readonly');

				if (fNotEdit) {
					$div.find('div[name="del_color_size"]').addClass('readonly');
					$div.find('div[name="del_color_size"]').removeClass('delFieldUnits');
				}
			}, this));

			$("#div_addColorSize").show();
		},

		/**
		 * 発注情報部(#ca_colorSizeInfo)を入力可能状態にする
		 */
		initReadonly_orderInfo: function() {
			var $div;
			// 生産国
			$div = $("#ca_importID").parent();
			clutil.viewRemoveReadonly($div);
			// 縫製工場
			$div = $("#ca_factoryID").parent();
			clutil.viewRemoveReadonly($div);
			// KI区分
			$div = $("#ca_kiTypeID").parent();
			clutil.viewRemoveReadonly($div);
			// 発注ロット単位数
			clutil.inputRemoveReadonly($('#ca_lotCount'));
			// 納品形態（初回）
			$div = $("#ca_dlvroute1TypeID").parent();
			clutil.viewRemoveReadonly($div);
			// 納品形態（2回目以降）
			$div = $("#ca_dlvroute2TypeID").parent();
			clutil.viewRemoveReadonly($div);
			// 振分先センター
			$div = $('#ca_centerID').parent();
			clutil.viewRemoveReadonly($div);

			/*
			 * 詳細
			 */
			var $div_list = $('div[name="div_order_info_list"]');
			_.each($div_list, _.bind(function(d, i) {
				var $div_o = $(d);
				var $ca_approveFlag = $div_o.find('input[name0="ca_approveFlag"]');
				var approveFlag = $ca_approveFlag.val();

				if (approveFlag == 0) {
					// 未承認は入力可

					// 発注対象
					$div = $div_o.find('select[name0="ca_orderTgtTypeID"]').parent();
					clutil.viewRemoveReadonly($div);
					// タグ送付先
					$div = $div_o.find('select[name0="ca_tagaddrNo"]').parent();
					clutil.viewRemoveReadonly($div);
					// 発注日はいじらない

					// 製品仕上げ日
					var $input = $div_o.find('input[name0="ca_finishDate"]');
					clutil.inputRemoveReadonly($input);
					// センター着予定日
					var $input = $div_o.find('input[name0="ca_centerDlvDate"]');
					clutil.inputRemoveReadonly($input);
					// 仕入予定日
					var $input = $div_o.find('input[name0="ca_dlvDate"]');
					clutil.inputRemoveReadonly($input);
					// 発注番号はいじらない

					// タグ増産率
					var $input = $div_o.find('input[name0="ca_tagIncRate"]');
					clutil.inputRemoveReadonly($input);
					// 発注取消
					var $input = $div_o.find('input[name0="ca_cancelFlag"]');
					clutil.inputRemoveReadonly($input);

					// 発注テーブル
					var $table = $div_o.find('table[name="ca_table_order"]');
					clutil.viewRemoveReadonly($table);
					$table.removeClass('readonly');
				} else {
					// 承認済みは入力不可
					// 発注対象
					$div = $div_o.find('select[name0="ca_orderTgtTypeID"]').parent();
					clutil.viewReadonly($div);
					// タグ送付先
					$div = $div_o.find('select[name0="ca_tagaddrNo"]').parent();
					clutil.viewReadonly($div);
					// 発注日はいじらない

					// 製品仕上げ日
					var $input = $div_o.find('input[name0="ca_finishDate"]');
					clutil.inputReadonly($input);
					// センター着予定日
					var $input = $div_o.find('input[name0="ca_centerDlvDate"]');
					clutil.inputReadonly($input);
					// 仕入予定日
					var $input = $div_o.find('input[name0="ca_dlvDate"]');
					clutil.inputReadonly($input);
					// 発注番号はいじらない

					// タグ増産率
					var $input = $div_o.find('input[name0="ca_tagIncRate"]');
					clutil.inputReadonly($input);
					// 発注取消
					var $input = $div_o.find('input[name0="ca_cancelFlag"]');
					clutil.inputReadonly($input);

					// 発注テーブル
					var $table = $div_o.find('table[name="ca_table_order"]');
					clutil.viewReadonly($table);
					$table.addClass('readonly');

				}


			}, this));

			// 発注情報をコピー
			clutil.inputRemoveReadonly($("#ca_copy"));
		},

		/**
		 * 下代情報部(#ca_costInfo)を入力可能状態にする
		 */
		initReadonly_costInfo: function() {
			var $div, $table;
			// 下代（税抜）
			clutil.inputRemoveReadonly($("#ca_cost"));
			// 経準率はいじらない

			/*
			 * 下代構成
			 */
			// 通貨
			$div = $("#ca_currencyID").parent();
			clutil.viewRemoveReadonly($div);
			// 工賃通貨
			$div = $("#ca_工賃通貨").parent();
			clutil.viewRemoveReadonly($div);
			// 為替レート
			clutil.inputRemoveReadonly($("#ca_exchangeRate"));
			// 工賃為替
			clutil.inputRemoveReadonly($("#ca_工賃為替"));
			// 下代構成テーブル
			$table = $("#ca_table_cost_in");
			clutil.viewRemoveReadonly($table);
			$table.removeClass('readonly');
		},

		/**
		 * コメント情報部(#ca_commentInfo)を入力可能状態にする
		 */
		initReadonly_comment: function() {
			// セールスポイント
			clutil.inputRemoveReadonly($("#ca_salesPoint"));
			// 店舗通知欄
			clutil.inputRemoveReadonly($("#ca_memoForStore"));
		},

		/**
		 * 販売情報部(#ca_saleInfo)を入力可能状態にする
		 */
		initReadonly_saleInfo: function() {
			var $div, $table;

			// 指定上代はいじらない
			//clutil.inputRemoveReadonly($("#ca_priceIntax"));

			// 指定上代（税抜）はいじらない
			clutil.inputRemoveReadonly($("#ca_price"));

			// 状態履歴を確認
			clutil.inputRemoveReadonly($("#btn_price_hist"));

			/*
			 * 組織別
			 */
			// ゾーン別
			$table = $("#ca_table_price_zone");
			clutil.viewRemoveReadonly($table);
			$table.removeClass('readonly');
			// 店舗別
			$table = $("#ca_table_price_store");
			clutil.viewRemoveReadonly($table);
			$table.removeClass('readonly');

			// 商品展開年はいじらない

			// 販売開始日
			clutil.inputRemoveReadonly($("#ca_salesStartDate"));
			// 販売終了日
			clutil.inputRemoveReadonly($("#ca_salesEndDate"));
			// 売り切り年
			$div = $("#ca_selloutYear").parent();
			clutil.viewRemoveReadonly($div);
			// 売り切りシーズン
			$div = $("#ca_selloutSeasonID").parent();
			clutil.viewRemoveReadonly($div);
			// セットアップフラグ
			clutil.inputRemoveReadonly($("#ca_setupFlag"));
			// セットアップ品番
			clutil.inputRemoveReadonly($("#ca_セットアップ品番1"));
			clutil.inputRemoveReadonly($("#ca_セットアップ品番2"));
			clutil.inputRemoveReadonly($("#ca_セットアップ品番3"));
			// 組合せ販売紐付け
			clutil.inputRemoveReadonly($("#btn_bundleView"));
			clutil.inputRemoveReadonly($("#btn_bundleClear"));
			// 限定販売商品
			clutil.inputRemoveReadonly($("#ca_limitFlag"));

			// 限定店舗商品
			clutil.inputRemoveReadonly($("#ca_limitFlag"));
			// 対象店舗
			$table = $("#ca_table_tgt");
			clutil.viewRemoveReadonly($table);
			$table.removeClass('readonly');
		},

		/**
		 * 任意属性情報部(#ca_anyAttrInfo)を入力可能状態にする
		 */
		initReadonly_anyAttrInfo: function() {
			var $div_any = $('div#any_info');
			_.each($div_any.find('select'), _.bind(function(sel) {
				var $select = $(sel);
				var $div = $select.parent();
				clutil.viewRemoveReadonly($div);
			}, this));
		},

		/**
		 * 差戻し理由情報部(#ca_coomentListInfo)を入力可能状態にする
		 */
		initReadonly_commentListInfo: function() {
			clutil.inputRemoveReadonly($("#ca_comment"));
		},

		/**
		 * 読み取り専用にする
		 */
		setReadonly: function() {
			this.setReadonly_req(1);
			this.setReadonly_item(1);
			this.setReadonly_tagInfo(1);
			this.setReadonly_colorSizeInfo(1);
			this.setReadonly_orderInfo(1);
			this.setReadonly_costInfo(1);
			this.setReadonly_comment(1);
			this.setReadonly_saleInfo(1);
			this.setReadonly_anyAttrInfo(1);
			this.setReadonly_commentListInfo(1);
		},

		/**
		 * 条件部を読み取り専用にする
		 * @param mode
		 */
		setReadonly_req: function(mode) {
			var $div;
			switch (mode) {
			case 0: // 全て操作可
				$div = $("#ca_unitID").parent();
				clutil.viewRemoveReadonly($div);

				// 編集内容
				$div = $("#ca_editTypeID").parent();
				clutil.viewRemoveReadonly($div);

				// 品種
				clutil.inputRemoveReadonly($("#ca_itgrpID"));

				// 決定
				clutil.inputRemoveReadonly($("#ca_srch"));
				break;
			default:
				// 事業ユニット
				 $div = $("#ca_unitID").parent();
				clutil.viewReadonly($div);

				// 編集内容
				$div = $("#ca_editTypeID").parent();
				clutil.viewReadonly($div);

				// 品種
				clutil.inputReadonly($("#ca_itgrpID"));

				// 決定
				clutil.inputReadonly($("#ca_srch"));
				break;
			}
		},

		/**
		 * 基本情報部を読み取り専用にする
		 * @param mode
		 */
		setReadonly_item: function(mode) {
			/*
			 * mode
			 * 0: 全てRW
			 * 1: 全てRO
			 */
			switch (mode) {
			case 0: // 全て編集可
			case 6: // タグ承認後モード
				this.initReadonly_item();
				break;
			case 1:	// 全て編集不可
			case 2:	// 追加発注モード
			case 3:	// 発注取消
			case 7: // 承認モード
			case 8: // 追加発注モード（差戻し）
				if (mode == 2 || mode == 3 || mode == 8) {
					// 承認期限日
					clutil.inputRemoveReadonly($("#ca_approveLimitDate"));
				} else {
					// 承認期限日
					clutil.inputReadonly($("#ca_approveLimitDate"));
				}
				// 適用期間は入力不可のまま
				// 契約番号
				clutil.inputReadonly($("#ca_契約番号"));
				// メーカー担当者
				clutil.inputReadonly($("#ca_メーカー担当者"));
				// メーカー
				clutil.inputReadonly($("#ca_makerID"));
				// メーカーを読取り固定にする
				clutil.fixReadonly($("#ca_makerID"));

				// メーカー品番
				clutil.inputReadonly($("#ca_makerItemCode"));
				// 商品名
				clutil.inputReadonly($("#ca_name"));
				// 商品区分
				$div = $("#ca_itemTypeID").parent();
				clutil.viewReadonly($div);
				// シーズン
				$div = $("#ca_seasonID").parent();
				clutil.viewReadonly($div);
				// サブシーズン
				$div = $("#ca_subSeasonID").parent();
				clutil.viewReadonly($div);

				// サブクラス１
				$div = $("#ca_subcls1ID").parent();
				clutil.viewReadonly($div);
				// サブクラス２
				$div = $("#ca_subcls2ID").parent();
				clutil.viewReadonly($div);
				// 属性ブランド
				$div = $("#ca_brandID").parent();
				clutil.viewReadonly($div);
				// スタイル
				$div = $("#ca_styleID").parent();
				clutil.viewReadonly($div);
				// テイスト
				$div = $("#ca_テイスト").parent();
				clutil.viewReadonly($div);
				// 素材
				$div = $("#ca_materialID").parent();
				clutil.viewReadonly($div);
				// 素材手入力欄はここではいじらない
				clutil.inputReadonly($("#ca_materialText"));
				// 色
				$div = $("#ca_色").parent();
				clutil.viewReadonly($div);
				// サブ色
				$div = $("#ca_サブ色").parent();
				clutil.viewReadonly($div);
				// 柄
				$div = $("#ca_designID").parent();
				clutil.viewReadonly($div);
				// サブ柄
				$div = $("#ca_subDesignID").parent();
				clutil.viewReadonly($div);
				// ベース色
				$div = $("#ca_designColorID").parent();
				clutil.viewReadonly($div);
				// 用途区分
				$div = $("#ca_usetypeID").parent();
				clutil.viewReadonly($div);
				// 販促企画
				$div = $("#ca_販促企画").parent();
				clutil.viewReadonly($div);

				// 画像は特になし

				// 倉庫在庫開示
				clutil.inputReadonly("#ca_centerStockFlag");
				// JAN手入力
				clutil.inputReadonly("#ca_inputJanFlag");
				// 仕入無し
				clutil.inputReadonly("#ca_orderFlag");

				/*
				 * 生地情報
				 */
				// 品質
				clutil.inputReadonly("#ca_quality");
				// 生地メーカー名
				clutil.inputReadonly("#ca_clothMaker");
				// 仮生地品番
				clutil.inputReadonly("#ca_tmpClothCode");
				// 生地品番
				clutil.inputReadonly("#ca_clothCode");
				// 原反発注日
				clutil.inputReadonly("#ca_clothOrderDate");
				// 原反工場着日
				clutil.inputReadonly("#ca_clothDlvDate");

				/*
				 * 商品仕様
				 */
				// 型番
				clutil.viewReadonly($("#ca_table_modelno"));
				$("#ca_table_modelno").addClass('readonly');

				// 商品仕様
				clutil.viewReadonly($("#ca_table_spec"));
				$("#ca_table_spec").addClass('readonly');

				// 商品仕様追加メモ
				clutil.inputReadonly($("#ca_specComment"));
				break;
			case 4:	// 承認不要編集
				// 契約番号
				clutil.inputRemoveReadonly($("#ca_契約番号"));
				// メーカー担当者
				clutil.inputRemoveReadonly($("#ca_メーカー担当者"));
				// 商品名
				clutil.inputRemoveReadonly($("#ca_name"));
				// 商品区分
				$div = $("#ca_itemTypeID").parent();
				clutil.viewReadonly($div);
				// シーズン
				$div = $("#ca_seasonID").parent();
				clutil.viewReadonly($div);
				// サブシーズン
				$div = $("#ca_subSeasonID").parent();
				clutil.viewReadonly($div);
				// サブクラス１
				$div = $("#ca_subcls1ID").parent();
				clutil.viewReadonly($div);
				// サブクラス２
				$div = $("#ca_subcls2ID").parent();
				clutil.viewReadonly($div);


				// 属性ブランド
				$div = $("#ca_brandID").parent();
				clutil.viewRemoveReadonly($div);
				// スタイル
				$div = $("#ca_styleID").parent();
				clutil.viewRemoveReadonly($div);
				// テイスト
				$div = $("#ca_テイスト").parent();
				clutil.viewRemoveReadonly($div);
				// 素材
				$div = $("#ca_materialID").parent();
				clutil.viewRemoveReadonly($div);
				// 色
				$div = $("#ca_色").parent();
				clutil.viewRemoveReadonly($div);
				// サブ色
				$div = $("#ca_サブ色").parent();
				clutil.viewRemoveReadonly($div);
				// 柄
				$div = $("#ca_designID").parent();
				clutil.viewRemoveReadonly($div);
				// サブ柄
				$div = $("#ca_subDesignID").parent();
				clutil.viewRemoveReadonly($div);
				// ベース色
				$div = $("#ca_designColorID").parent();
				clutil.viewRemoveReadonly($div);
				// 用途区分
				$div = $("#ca_usetypeID").parent();
				clutil.viewRemoveReadonly($div);
				// 販促企画
				$div = $("#ca_販促企画").parent();
				clutil.viewRemoveReadonly($div);
				// 倉庫在庫開示
				clutil.inputRemoveReadonly("#ca_centerStockFlag");

				// 承認期限日
				clutil.inputReadonly($("#ca_approveLimitDate"));

				// メーカー
				clutil.inputReadonly($("#ca_makerID"));
				// メーカーを読取り固定にする
				clutil.fixReadonly($("#ca_makerID"));

				// メーカー品番
				clutil.inputReadonly($("#ca_makerItemCode"));


				// 画像は特になし

				// JAN手入力
				clutil.inputRemoveReadonly("#ca_inputJanFlag");
				// 仕入無し
				clutil.inputRemoveReadonly("#ca_orderFlag");

				/*
				 * 生地情報
				 */
				// 品質
				clutil.inputReadonly("#ca_quality");
				// 生地メーカー名
				clutil.inputRemoveReadonly("#ca_clothMaker");
				// 仮生地品番
				clutil.inputRemoveReadonly("#ca_tmpClothCode");
				// 生地品番
				clutil.inputRemoveReadonly("#ca_clothCode");
				// 原反発注日
				clutil.inputRemoveReadonly("#ca_clothOrderDate");
				// 原反工場着日
				clutil.inputRemoveReadonly("#ca_clothDlvDate");

				/*
				 * 商品仕様
				 */
				// 型番
				clutil.viewRemoveReadonly($("#ca_table_modelno"));
				$("#ca_table_modelno").removeClass('readonly');

				// 商品仕様
				clutil.viewRemoveReadonly($("#ca_table_spec"));
				$("#ca_table_spec").removeClass('readonly');

				// 商品仕様追加メモ
				clutil.inputRemoveReadonly($("#ca_specComment"));
				break;
			case 5:	// 基本情報変更
				// 契約番号
				clutil.inputRemoveReadonly($("#ca_契約番号"));
				// メーカー担当者
				clutil.inputRemoveReadonly($("#ca_メーカー担当者"));
				// 商品名
				clutil.inputRemoveReadonly($("#ca_name"));
				// 商品区分
				$div = $("#ca_itemTypeID").parent();
				var val = $("#ca_itemTypeID").val();
				if (val == amcm_type.AMCM_VAL_ITEM_REGULAR) {
					clutil.viewRemoveReadonly($div);
				} else {
					clutil.viewReadonly($div);
				}
				// シーズン
				$div = $("#ca_seasonID").parent();
				clutil.viewRemoveReadonly($div);
				// サブシーズン
				$("#ca_seasonID").trigger('change');
				//$div = $("#ca_subSeasonID").parent();
				//clutil.viewRemoveReadonly($div);
				// サブクラス１
				$div = $("#ca_subcls1ID").parent();
				clutil.viewRemoveReadonly($div);
				// サブクラス２
				$div = $("#ca_subcls2ID").parent();
				clutil.viewRemoveReadonly($div);


				// 属性ブランド
				$div = $("#ca_brandID").parent();
				clutil.viewRemoveReadonly($div);
				// スタイル
				$div = $("#ca_styleID").parent();
				clutil.viewRemoveReadonly($div);
				// テイスト
				$div = $("#ca_テイスト").parent();
				clutil.viewRemoveReadonly($div);
				// 素材
				$div = $("#ca_materialID").parent();
				clutil.viewRemoveReadonly($div);
				// 色
				$div = $("#ca_色").parent();
				clutil.viewRemoveReadonly($div);
				// サブ色
				$div = $("#ca_サブ色").parent();
				clutil.viewRemoveReadonly($div);
				// 柄
				$div = $("#ca_designID").parent();
				clutil.viewRemoveReadonly($div);
				// サブ柄
				$div = $("#ca_subDesignID").parent();
				clutil.viewRemoveReadonly($div);
				// ベース色
				$div = $("#ca_designColorID").parent();
				clutil.viewRemoveReadonly($div);
				// 用途区分
				$div = $("#ca_usetypeID").parent();
				clutil.viewRemoveReadonly($div);
				// 販促企画
				$div = $("#ca_販促企画").parent();
				clutil.viewRemoveReadonly($div);
				// 倉庫在庫開示
				clutil.inputRemoveReadonly("#ca_centerStockFlag");

				// 承認期限日
				clutil.inputRemoveReadonly($("#ca_approveLimitDate"));

				//// #20151027 MT-830 基本属性変更では、メーカとメーカ品番はReadOnlyにする
				//
				// // メーカーの読取り固定を解除
				// clutil.unfixReadonly($("#ca_makerID"));
				// // メーカー
				// clutil.inputRemoveReadonly($("#ca_makerID"));
				//
				// // メーカー品番
				// clutil.inputRemoveReadonly($("#ca_makerItemCode"));

				// メーカー
				clutil.inputReadonly($("#ca_makerID"));
				// メーカーを読取り固定にする
				clutil.fixReadonly($("#ca_makerID"));
				// メーカー品番
				clutil.inputReadonly($("#ca_makerItemCode"));

				// 画像は特になし

				// JAN手入力
				clutil.inputRemoveReadonly("#ca_inputJanFlag");
				// 仕入無し
				clutil.inputRemoveReadonly("#ca_orderFlag");

				/*
				 * 生地情報
				 */
				// 品質
				clutil.inputRemoveReadonly("#ca_quality");
				// 生地メーカー名
				clutil.inputRemoveReadonly("#ca_clothMaker");
				// 仮生地品番
				clutil.inputRemoveReadonly("#ca_tmpClothCode");
				// 生地品番
				clutil.inputRemoveReadonly("#ca_clothCode");
				// 原反発注日
				clutil.inputRemoveReadonly("#ca_clothOrderDate");
				// 原反工場着日
				clutil.inputRemoveReadonly("#ca_clothDlvDate");

				/*
				 * 商品仕様
				 */
				// 型番
				clutil.viewRemoveReadonly($("#ca_table_modelno"));
				$("#ca_table_modelno").removeClass('readonly');

				// 商品仕様
				clutil.viewRemoveReadonly($("#ca_table_spec"));
				$("#ca_table_spec").removeClass('readonly');

				// 商品仕様追加メモ
				clutil.inputRemoveReadonly($("#ca_specComment"));
				break;
			}
		},

		/**
		 * タグ情報部を読み取り専用にする
		 * @param mode
		 */
		setReadonly_tagInfo: function(mode) {
			var $div, $table;

			switch (mode) {
			case 0:	// すべて操作可
			case 5:	// 基本情報変更
				this.initReadonly_tagInfo();
				break;
			case 1: // 全て操作不可
			case 2:	// 追加発注モード
			case 3:	// 発注取消
			case 4: // 承認不要編集
			case 6: // タグ承認後
			case 7: // 承認
			case 8:	// 追加発注モード（差戻し）
				if (mode != 2 && mode != 8) {
					// タグ発行フラグ
					clutil.inputReadonly($("#ca_tagIssueFlag"));
				} else {
					// タグ発行フラグ
					clutil.inputRemoveReadonly($("#ca_tagIssueFlag"));
				}
				// タグ発行区分
				$div = $("#ca_tagIssueID").parent();
				clutil.viewReadonly($div);
				// タグ種別
				$div = $("#ca_tagTypeID").parent();
				clutil.viewReadonly($div);
				// プライス発行先
				$div = $("#ca_プライス発行先").parent();
				clutil.viewReadonly($div);
				// プライス発行日
				$div = $("#ca_プライス発行日").parent();
				clutil.viewReadonly($div);
				// 袖区分
				$div = $("#ca_袖区分").parent();
				clutil.viewReadonly($div);

				// 追加定形タグ番号１
				clutil.inputReadonly($("#ca_fixedFormTag1Code"));
				// 追加定形タグ番号２
				clutil.inputReadonly($("#ca_fixedFormTag2Code"));
				// 糸LOX
				$div = $("#ca_itoloxID").parent();
				clutil.viewReadonly($div);
				// 素材
				$table = $("#ca_table_material");
				clutil.viewReadonly($table);
				$table.addClass('readonly');
				// 強調表示
				clutil.inputReadonly($("#ca_tagHighlight"));
				// 生産国（タグ表示用）
				$div = $("#ca_tagImportID").parent();
				clutil.viewReadonly($div);

				break;
			}
		},

		/**
		 * カラーサイズ情報部を読み取り専用にする
		 * @param mode
		 */
		setReadonly_colorSizeInfo: function(mode) {
			var $div, $div_list, $table;

			switch (mode) {
			case 0:	// すべて操作可
				this.initReadonly_colorSizeInfo();
				return;
			case 5:	// 基本情報変更
				this.initReadonly_colorSizeInfo5();
				return;
			case 1: // 全て操作不可
			case 2: // 追加発注
			case 3: // 発注取消
			case 4: // 承認不要編集
			case 6: // タグ承認後
			case 7: // 承認
			case 8:	// 追加発注モード（差戻し）
				// サイズパターン
				$div = $("#ca_sizePtnID").parent();
				clutil.viewReadonly($div);

				$div_list = $('div[name="div_colorsize_list"]');
				_.each($div_list, _.bind(function(d) {
					$div = $(d);
					// カラーテーブル
					$table = $div.find('table[name="ca_table_color"]');
					clutil.viewReadonly($table);
					$table.addClass('readonly');
					// サイズテーブル
					$table = $div.find('table[name="ca_table_size"]');
					clutil.viewReadonly($table);
					$table.addClass('readonly');
					// JANテーブル
					$table = $div.find('table[name="ca_table_jan"]');
					clutil.viewReadonly($table);
					$table.addClass('readonly');
					// カラーサイズをreadonlyに
					$div.find('div[name="del_color_size"]').addClass('readonly');
					$div.find('div[name="del_color_size"]').removeClass('delFieldUnits');

				}, this));

				// 「カラー・サイズを追加」を非表示
				$("#div_addColorSize").hide();

				// サイズパターンを読取り固定にする
				clutil.fixReadonly($("#ca_sizePtnID"));
				break;
			}

		},

		showAddOrderInfo: function() {
			var last = this.orderHeadList != null && this.orderHeadList.length > 0
						? this.orderHeadList[this.orderHeadList.length - 1] : null;
			if (last != null) {
				if (last.approveFlag != 0) {
					// 承認済みなら、追加ボタンを表示
					$("#div_addOrderInfo").show();
				} else {
					// 未承認なら、追加ボタンを非表示
					$("#div_addOrderInfo").hide();
				}
			} else {
				// レコードがない？
			}
		},

		/**
		 * 発注情報部を読み取り専用にする
		 * @param mode
		 */
		setReadonly_orderInfo: function(mode) {
			var $div, $div_list;

			switch (mode) {
			case 5: // 基本情報変更
				// 発注情報を追加
				this.showAddOrderInfo();
			case 0:	// 全て操作可
				this.initReadonly_orderInfo();
				return;
			case 1: // 全て操作不可
			case 3: // 発注取消
			case 4:	// 承認不要編集
			case 7: // 承認
				// 発注情報をコピー
				clutil.inputReadonly($("#ca_copy"));

				// 生産国
				$div = $("#ca_importID").parent();
				clutil.viewReadonly($div);
				// 縫製工場
				$div = $("#ca_factoryID").parent();
				clutil.viewReadonly($div);
				// KI区分
				$div = $("#ca_kiTypeID").parent();
				clutil.viewReadonly($div);
				// 発注ロット単位数
				clutil.inputReadonly($('#ca_lotCount'));
				// 納品形態（初回）
				$div = $("#ca_dlvroute1TypeID").parent();
				clutil.viewReadonly($div);
				// 納品形態（2回目以降）
				$div = $("#ca_dlvroute2TypeID").parent();
				clutil.viewReadonly($div);
				// 振分先センター
				$div = $("#ca_centerID").parent();
				clutil.viewReadonly($div);
				//clutil.fixReadonly($("#ca_centerID"));	// 読取り固定にする
				/*
				 * 詳細
				 */
				$div_list = $('div[name="div_order_info_list"]');
				_.each($div_list, _.bind(function(d) {
					var $div_o = $(d);
					// 発注対象
					$div = $div_o.find('select[name0="ca_orderTgtTypeID"]').parent();
					clutil.viewReadonly($div);
					// タグ送付先
					$div = $div_o.find('select[name0="ca_tagaddrNo"]').parent();
					clutil.viewReadonly($div);
					// 発注日はいじらない

					// 製品仕上げ日
					var $input = $div_o.find('input[name0="ca_finishDate"]');
					clutil.inputReadonly($input);
					// センター着予定日
					var $input = $div_o.find('input[name0="ca_centerDlvDate"]');
					clutil.inputReadonly($input);
					// 仕入予定日
					var $input = $div_o.find('input[name0="ca_dlvDate"]');
					clutil.inputReadonly($input);
					// 発注番号はいじらない

					// タグ増産率
					var $input = $div_o.find('input[name0="ca_tagIncRate"]');
					clutil.inputReadonly($input);
					// 発注取消
					var $input = $div_o.find('input[name0="ca_cancelFlag"]');
					if (mode != 3) {
						clutil.inputReadonly($input);
					} else {
						clutil.inputRemoveReadonly($input);
						$input.attr('checked', true).closest('label').addClass('checked');
					}

					// 発注テーブル
					var $table = $div_o.find('table[name="ca_table_order"]');
					clutil.viewReadonly($table);
					$table.addClass('readonly');
				}, this));
				// 発注情報を追加
				$("#div_addOrderInfo").hide();

				break;
			case 2:	// 追加発注
				// 発注情報をコピー
				clutil.inputRemoveReadonly($("#ca_copy"));

				// 生産国
				$div = $("#ca_importID").parent();
				clutil.viewReadonly($div);
				// 縫製工場
				$div = $("#ca_factoryID").parent();
				clutil.viewReadonly($div);
				// KI区分
				$div = $("#ca_kiTypeID").parent();
				clutil.viewReadonly($div);
				// 発注ロット単位数
				clutil.inputReadonly($('#ca_lotCount'));
				// 納品形態（初回）
				$div = $("#ca_dlvroute1TypeID").parent();
				clutil.viewReadonly($div);
				// 納品形態（2回目以降）
				$div = $("#ca_dlvroute2TypeID").parent();
				clutil.viewReadonly($div);
				// 振分先センター
				$div = $("#ca_centerID").parent();
				clutil.viewReadonly($div);

				/*
				 * 発注テーブル
				 */
				$div_list = $('div[name="div_order_info_list"]');
				var last = $div_list.length-1;
				_.each($div_list, _.bind(function(d, i) {
					var $div_o = $(d);

					if (i != last) {
						// 発注対象
						$div = $div_o.find('select[name0="ca_orderTgtTypeID"]').parent();
						clutil.viewReadonly($div);
						// タグ送付先
						$div = $div_o.find('select[name0="ca_tagaddrNo"]').parent();
						clutil.viewReadonly($div);
						// 発注日はいじらない

						// 製品仕上げ日
						var $input = $div_o.find('input[name0="ca_finishDate"]');
						clutil.inputReadonly($input);
						// センター着予定日
						var $input = $div_o.find('input[name0="ca_centerDlvDate"]');
						clutil.inputReadonly($input);
						// 仕入予定日
						var $input = $div_o.find('input[name0="ca_dlvDate"]');
						clutil.inputReadonly($input);
						// 発注番号はいじらない

						// タグ増産率
						var $input = $div_o.find('input[name0="ca_tagIncRate"]');
						clutil.inputReadonly($input);
						// 発注取消
						var $input = $div_o.find('input[name0="ca_cancelFlag"]');
						clutil.inputRemoveReadonly($input);

						// 発注テーブル
						var $table = $div_o.find('table[name="ca_table_order"]');
						clutil.viewReadonly($table);
						$table.addClass('readonly');
					}
				}, this));
				// 発注情報を追加
				this.showAddOrderInfo();
				break;
			case 8:	// 追加発注モード（差戻し）

				// 生産国
				$div = $("#ca_importID").parent();
				clutil.viewReadonly($div);
				// 縫製工場
				$div = $("#ca_factoryID").parent();
				clutil.viewReadonly($div);
				// KI区分
				$div = $("#ca_kiTypeID").parent();
				clutil.viewReadonly($div);
				// 発注ロット単位数
				clutil.inputReadonly($('#ca_lotCount'));
				// 納品形態（初回）
				$div = $("#ca_dlvroute1TypeID").parent();
				clutil.viewReadonly($div);
				// 納品形態（2回目以降）
				$div = $("#ca_dlvroute2TypeID").parent();
				clutil.viewReadonly($div);
				// 振分先センター
				$div = $("#ca_centerID").parent();
				clutil.viewReadonly($div);

				/*
				 * 発注テーブル
				 */
				$div_list = $('div[name="div_order_info_list"]');
				var last = $div_list.length-1;
				_.each($div_list, _.bind(function(d, i) {
					var $div_o = $(d);

					if (i != last) {
						// 発注対象
						$div = $div_o.find('select[name0="ca_orderTgtTypeID"]').parent();
						clutil.viewReadonly($div);
						// タグ送付先
						$div = $div_o.find('select[name0="ca_tagaddrNo"]').parent();
						clutil.viewReadonly($div);
						// 発注日はいじらない

						// 製品仕上げ日
						var $input = $div_o.find('input[name0="ca_finishDate"]');
						clutil.inputReadonly($input);
						// センター着予定日
						var $input = $div_o.find('input[name0="ca_centerDlvDate"]');
						clutil.inputReadonly($input);
						// 仕入予定日
						var $input = $div_o.find('input[name0="ca_dlvDate"]');
						clutil.inputReadonly($input);
						// 発注番号はいじらない

						// タグ増産率
						var $input = $div_o.find('input[name0="ca_tagIncRate"]');
						clutil.inputReadonly($input);
						// 発注テーブル
						var $table = $div_o.find('table[name="ca_table_order"]');
						clutil.viewReadonly($table);
						$table.addClass('readonly');
					}
					// 発注取消
					var $input = $div_o.find('input[name0="ca_cancelFlag"]');
					clutil.inputReadonly($input);
				}, this));
				// 発注情報を追加
				$("#div_addOrderInfo").hide();
				break;
			case 6:	// タグ承認後
				// 生産国
				$div = $("#ca_importID").parent();
				clutil.viewRemoveReadonly($div);
				// 縫製工場
				$div = $("#ca_factoryID").parent();
				clutil.viewRemoveReadonly($div);
				// KI区分
				$div = $("#ca_kiTypeID").parent();
				clutil.viewRemoveReadonly($div);
				// 発注ロット単位数
				clutil.inputRemoveReadonly($('#ca_lotCount'));
				// 納品形態（初回）
				$div = $("#ca_dlvroute1TypeID").parent();
				clutil.viewRemoveReadonly($div);
				// 納品形態（2回目以降）
				$div = $("#ca_dlvroute2TypeID").parent();
				clutil.viewRemoveReadonly($div);
				// 振分先センター
				$div = $("#ca_centerID").parent();
				clutil.viewRemoveReadonly($div);

				$div_list = $('div[name="div_order_info_list"]');
				_.each($div_list, _.bind(function(d) {
					var $div_o = $(d);
					// 発注対象
					$div = $div_o.find('select[name0="ca_orderTgtTypeID"]').parent();
					clutil.viewRemoveReadonly($div);
					// タグ送付先
					$div = $div_o.find('select[name0="ca_tagaddrNo"]').parent();
					clutil.viewRemoveReadonly($div);
					// 発注日はいじらない

					// 製品仕上げ日
					var $input = $div_o.find('input[name0="ca_finishDate"]');
					clutil.inputRemoveReadonly($input);
					// センター着予定日
					var $input = $div_o.find('input[name0="ca_centerDlvDate"]');
					clutil.inputRemoveReadonly($input);
					// 仕入予定日
					var $input = $div_o.find('input[name0="ca_dlvDate"]');
					clutil.inputRemoveReadonly($input);
					// 発注番号はいじらない

					// タグ増産率
					var $input = $div_o.find('input[name0="ca_tagIncRate"]');
					clutil.inputRemoveReadonly($input);
					// 発注取消
					var $input = $div_o.find('input[name0="ca_cancelFlag"]');
					clutil.inputReadonly($input);

					// 発注テーブル
					var $table = $div_o.find('table[name="ca_table_order"]');
					clutil.viewReadonly($table);
					$table.addClass('readonly');
				}, this));
			}
		},

		/**
		 * 下代情報部を読み取り専用にする
		 * @param mode
		 */
		setReadonly_costInfo: function(mode) {
			var $div, $table;

			switch (mode) {
			case 0:	// 全て操作可
			case 6: // タグ承認後
				this.initReadonly_costInfo();
				break;
			case 5: // 基本情報変更
				this.initReadonly_costInfo();
				// 下代（税抜）
				clutil.inputReadonly($("#ca_cost"));
				break;
			case 1: // 全て操作不可
			case 2: // 追加発注
			case 3: // 発注取消
			case 4: // 承認不要編集
			case 7: // 承認
			case 8:	// 追加発注モード（差戻し）
				// 下代（税抜）
				clutil.inputReadonly($("#ca_cost"));
				// 経準率はいじらない

				/*
				 * 下代構成
				 */
				// 通貨
				$div = $("#ca_currencyID").parent();
				clutil.viewReadonly($div);
				// 工賃通貨
				$div = $("#ca_工賃通貨").parent();
				clutil.viewReadonly($div);
				// 為替レート
				clutil.inputReadonly($("#ca_exchangeRate"));
				// 工賃為替
				clutil.inputReadonly($("#ca_工賃為替"));
				// 下代構成テーブル
				$table = $("#ca_table_cost_in");
				clutil.viewReadonly($table);
				$table.addClass('readonly');
				break;
			}

		},

		/**
		 * コメント情報部を読み取り専用にする
		 * @param mode
		 */
		setReadonly_comment: function(mode) {
			switch (mode) {
			case 0: // 全て操作可
			case 4: // 承認不要編集
			case 5: // 基本情報変更
			case 6: // タグ承認後
				this.initReadonly_comment();
				break;
			case 1: // 全て操作不可
			case 2: // 追加発注
			case 3: // 発注取消
			case 7: // 承認
			case 8:	// 追加発注モード（差戻し）
				// セールスポイント
				clutil.inputReadonly($("#ca_salesPoint"));
				// 店舗通知欄
				clutil.inputReadonly($("#ca_memoForStore"));
				break;
			}
		},

		/**
		 * 販売情報部を読み取り専用にする
		 * @param mode
		 */
		setReadonly_saleInfo: function(mode) {
			var $div, $table;

			switch (mode) {
			case 0: // 全て操作可
			case 5: // 基本情報変更
			case 6: // タグ承認後
				this.initReadonly_saleInfo();
				if (mode == 5) {
					// 指定上代
					//clutil.inputReadonly($("#ca_priceIntax"));
					// 指定上代(税抜)
					clutil.inputReadonly($("#ca_price"));
				}
				break;
			case 1: // 全て操作不可
			case 2: // 追加発注
			case 3: // 発注取消
			case 4: // 承認不要編集
			case 7: // 承認
			case 8:	// 追加発注モード（差戻し）
				if (mode == 4) {
					// 限定店舗商品
					clutil.inputRemoveReadonly($("#ca_limitFlag"));
					// 対象店舗
					$table = $("#ca_table_tgt");
					clutil.viewRemoveReadonly($table);
					$table.removeClass('readonly');
				} else {
					// 限定店舗商品
					clutil.inputReadonly($("#ca_limitFlag"));
					// 対象店舗
					$table = $("#ca_table_tgt");
					clutil.viewReadonly($table);
					$table.addClass('readonly');
				}

				// 指定上代はいじらない
				//clutil.inputReadonly($("#ca_priceIntax"));
				// 指定上代（税抜）
				clutil.inputReadonly($("#ca_price"));

				// 状態履歴を確認
				clutil.inputRemoveReadonly($("#btn_price_hist"));

				/*
				 * 組織別
				 */
				// ゾーン別
				$table = $("#ca_table_price_zone");
				clutil.viewReadonly($table);
				$table.addClass('readonly');
				// 店舗別
				$table = $("#ca_table_price_store");
				clutil.viewReadonly($table);
				$table.addClass('readonly');

				// 商品展開年はいじらない

				// 販売開始日
				clutil.inputReadonly($("#ca_salesStartDate"));
				// 販売終了日
				clutil.inputReadonly($("#ca_salesEndDate"));
				// 売り切り年
				$div = $("#ca_selloutYear").parent();
				if (mode == 2) {
					clutil.viewRemoveReadonly($div);	// 追加発注 - 編集可とする
				} else {
					clutil.viewReadonly($div);
				}
				// 売り切りシーズン
				$div = $("#ca_selloutSeasonID").parent();
				if (mode == 2) {
					clutil.viewRemoveReadonly($div);	// 追加発注 - 編集可とする
				} else {
					clutil.viewReadonly($div);
				}
				// セットアップフラグ
				clutil.inputReadonly($("#ca_setupFlag"));
				// セットアップ品番
				clutil.inputReadonly($("#ca_セットアップ品番1"));
				clutil.inputReadonly($("#ca_セットアップ品番2"));
				clutil.inputReadonly($("#ca_セットアップ品番3"));
				// 組合せ販売紐付け
				clutil.inputReadonly($("#btn_bundleView"));
				clutil.inputReadonly($("#btn_bundleClear"));
				break;
			}
		},

		/**
		 * 任意属性情報部を読み取り専用に
		 * @param mode
		 */
		setReadonly_anyAttrInfo: function(mode) {
			var $div_any = $('div#any_info');
			switch (mode) {
			case 0:	// 全て操作可
			case 4: // 承認不要編集
			case 5: // 基本情報変更
			case 6: // タグ承認後
				this.initReadonly_anyAttrInfo();
				break;
			case 1: // 全て操作不可
			case 2: // 追加発注
			case 3: // 発注取消
			case 7: // 承認
			case 8:	// 追加発注モード（差戻し）
				_.each($div_any.find('select'), _.bind(function(sel) {
					var $select = $(sel);
					var $div = $select.parent();
					clutil.viewReadonly($div);
				}, this));
				break;
			}
		},

		/**
		 * 差戻し理由情報部を読み取り専用に
		 * @param mode
		 */
		setReadonly_commentListInfo: function(mode) {
			switch (mode) {
			case 7: // 承認
				clutil.inputRemoveReadonly($("#ca_comment"));
				break;
			case 0: // 全て操作可
			case 1: // 全て操作不可
			case 2: // 追加発注
			case 3: // 発注取消
			case 4: // 承認不要編集
			case 5: // 基本情報変更
			case 6: // タグ承認後
			case 8:	// 追加発注モード（差戻し）
				clutil.inputReadonly($("#ca_comment"));
				break;
			}
		},

		/**
		 * フッターボタンを各モード用に設定する
		 * @param opt
		 */
		setFooterButtons: function(opt) {
			var opeTypeId = [
				{
					opeTypeId: OpeType.AMMSV1100_OPETYPE_TMP_SAVE,
					label: '一時保存'
				},
				{
					opeTypeId: OpeType.AMMSV1100_OPETYPE_TAG_APPLY,
					label: 'タグ発行申請'
				},
				{
					opeTypeId: OpeType.AMMSV1100_OPETYPE_LAST_APPLY,
					label: '最終承認申請'
				},
			];

			if (opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				// 新規作成・複製の場合はデフォルトのまま
			} else if (opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				// 編集の場合は色々変わる
				if (opt.approveTypeID == amcm_type.AMCM_VAL_APPROVE_APPLY
						|| opt.approveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE1) {
					// 最終承認申請か一次承認の場合
					if (opt.srcId == "AMMSV1090") {
						// 商品マスタ一覧からの遷移なら、キャンセルのみ
						opeTypeId = -1;
					} else {
						// 承認一覧からの遷移
						opeTypeId = [
							{
								opeTypeId: OpeType.AMMSV1100_OPETYPE_LAST_RETURN,
								label: '最終承認差戻し'
							},
							{
								opeTypeId: OpeType.AMMSV1100_OPETYPE_LAST_APPROVE,
								label: '最終承認'
							},
						];
					}
				} else if (opt.approveTypeID == amcm_type.AMCM_VAL_APPROVE_RETURN) {
					// 最終承認差戻しの場合
					if (opt.approveCount != 0 ||
							opt.tagApproveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE) {
						// タグ発行承認済の場合
						opeTypeId = [
							{
								opeTypeId: OpeType.AMMSV1100_OPETYPE_TMP_SAVE,
								label: '一時保存'
							},
							{
								opeTypeId: OpeType.AMMSV1100_OPETYPE_LAST_APPLY,
								label: '最終承認申請'
							},
						];
					} else {
						// タグ発行未承認の場合、デフォルト
					}
				} else if (opt.approveCount != 0 ||
						opt.approveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE) {
					// 承認済みの場合(承認回数が１以上も承認済みとする)
					if (opt.editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_UPD) {
						// 承認不要変更の場合、登録
						opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
					} else {
						// 承認が必要な変更の場合
						opeTypeId = [
							{
								opeTypeId: OpeType.AMMSV1100_OPETYPE_TMP_SAVE,
								label: '一時保存'
							},
							{
								opeTypeId: OpeType.AMMSV1100_OPETYPE_LAST_APPLY,
								label: '最終承認申請'
							},
						];
					}
				} else if (opt.tagApproveTypeID == amcm_type.AMCM_VAL_APPROVE_APPLY
						|| opt.tagApproveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE1) {
					// タグ発行申請済か一次承認の場合
					if (opt.srcId == "AMMSV1090") {
						// 商品マスタ一覧からの遷移なら、キャンセルのみ
						opeTypeId = -1;
					} else {
						// 承認一覧からの遷移
						opeTypeId = [
							{
								opeTypeId: OpeType.AMMSV1100_OPETYPE_TAG_RETURN,
								label: 'タグ発行差戻し'
							},
							{
								opeTypeId: OpeType.AMMSV1100_OPETYPE_TAG_APPROVE,
								label: 'タグ発行承認'
							},
						];
					}
				} else if (opt.tagApproveTypeID == amcm_type.AMCM_VAL_APPROVE_RETURN) {
					// タグ発行差戻しの場合は、デフォルト
				} else if (opt.tagApproveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE) {
					// タグ発行承認済の場合
					opeTypeId = [
						{
							opeTypeId: OpeType.AMMSV1100_OPETYPE_TMP_SAVE,
							label: '一時保存'
						},
						{
							opeTypeId: OpeType.AMMSV1100_OPETYPE_LAST_APPLY,
							label: '最終承認申請'
						},
					];
				}
			} else if (opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
				opeTypeId = opt.opeTypeId;
				this.mdBaseView.options.btn_cancel = false;
				this.mdBaseView.options.btn_submit = false;
			} else {
				// その他は通常画面と同じで
				opeTypeId = opt.opeTypeId;
			}
			// ボタンの内容を設定して
			this.mdBaseView.options.opeTypeId = opeTypeId;
			// 表示を変更
			this.mdBaseView.renderFooterNavi();
			//
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			/*
			 * シスパラ
			 */
			// 組織体系
			var orgfunc_id = clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID');
			// 組織改装
			var orglevel_id = clcom.getSysparam(amcm_sysparams.PAR_AMMS_STORE_LEVELID);
			// 組織別上代
			var org_price = clcom.getSysparam(amcm_sysparams.PAR_AMMS_ORG_PRICE);

			// 商品区分
			clutil.cltypeselector(this.$('#ca_itemTypeID'), amcm_type.AMCM_TYPE_ITEM);

			// シーズン
			clutil.cltypeselector(this.$('#ca_seasonID'), amcm_type.AMCM_TYPE_SEASON);

			// サブシーズン
			clutil.cltypeselector(this.$('#ca_subSeasonID'), amcm_type.AMCM_TYPE_SUBSEASON);

			// タグ発行区分
			clutil.cltypeselector(this.$('#ca_tagIssueID'), amcm_type.AMCM_TYPE_TAGISSUE);

			// タグ種別
			clutil.cltypeselector(this.$('#ca_tagTypeID'), amcm_type.AMCM_TYPE_TAG);

			// 袖区分
			clutil.cltypeselector(this.$("#ca_袖区分"), amcm_type.AMCM_TYPE_ARM_TYPE);

			// 通貨区分
			clutil.cltypeselector(this.$("#ca_currencyID"), amcm_type.AMCM_TYPE_CURRENCY);

			// 工賃通貨
			clutil.cltypeselector(this.$("#ca_工賃通貨"), amcm_type.AMCM_TYPE_CURRENCY);

			// 商品売り切り年
			clutil.clyearselector($("#ca_selloutYear"), 1, 2, 5);

			// 売り切りシーズン
			clutil.cltypeselector(this.$('#ca_selloutSeasonID'), amcm_type.AMCM_TYPE_SEASON);

			clutil.cltxtFieldLimit($("#ca_makerItemCode"));
			clutil.cltxtFieldLimit($("#ca_name"));
			clutil.cltxtFieldLimit($("#ca_tagHighlight"));
			clutil.cltxtFieldLimit($("#ca_salesPoint"));
			clutil.cltxtFieldLimit($("#ca_memoForStore"));
			clutil.cltxtFieldLimit($("#ca_materialText"));
			clutil.cltxtFieldLimit($("#ca_specComment"));

			clutil.cltxtFieldLimit($("#ca_quality"));
			clutil.cltxtFieldLimit($("#ca_clothMaker"));
			clutil.cltxtFieldLimit($("#ca_tmpClothCode"));
			clutil.cltxtFieldLimit($("#ca_clothCode"));

			clutil.cltxtFieldLimit($("#ca_comment"));

			// リレーション
			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_itgrpID",
				},
				// 追加定形タグ１
				'clfixedformtagcode tag1': {
					el: '#ca_fixedFormTag1Code',
					dependAttrs: {
						fftagType: amcm_type.AMCM_VAL_FIXEDFORM_TAG_SECOND,
					},
				},
				// 追加定形タグ２
				'clfixedformtagcode tag2': {
					el: '#ca_fixedFormTag2Code',
					dependAttrs: {
						fftagType: amcm_type.AMCM_VAL_FIXEDFORM_TAG_THIRD,
					},
				},
				clvendorcode: {
					el: "#ca_makerID",
					dependAttrs: {
						vendor_typeid: amcm_type.AMCM_VAL_VENDOR_MAKER,
					},
					rmDepends:['itgrp_id'],
					addDepends:['unit_id'],
				},
				// サイズパターン
				'clsizeptn_byitgrpselector sizeptn': {
					el: "#ca_sizePtnID",
				},
				clorgselector: {
					el: '#ca_centerID',
					dependSrc: {
						p_org_id: 'unit_id',
					},
					dependAttrs: {
						orgfunc_id: orgfunc_id,
						orglevel_id: orglevel_id,
						org_typeid: amcm_type.AMCM_VAL_ORG_KIND_CENTER,
					}
				}
			}, {
				dataSource: {
				}
			});
			this.fieldRelation.done(function() {
				clutil.inputReadonly($("#ca_fixedFormTag1Code"));
				clutil.inputReadonly($("#ca_fixedFormTag2Code"));
				clutil.viewReadonly($("#ca_centerID").parent());
			});

//			this.fieldRelation2 = clutil.FieldRelation.create('center', {
//				clorgcode: {
//					el: '#ca_centerID',
//					dependSrc: {
//						p_org_id: 'unit_id',
//					},
//					dependAttrs: {
//						orgfunc_id: orgfunc_id,
//						orglevel_id: orglevel_id,
//						org_typeid: amcm_type.AMCM_VAL_ORG_KIND_CENTER,
//					}
//				}
//			});
//			this.fieldRelation2.done(function() {
//				clutil.inputReadonly($("#ca_centerID"));
//			});

			_.defer(_.bind(function() {
				// 適用期間
				clutil.datepicker($("#ca_fromDate"));
				clutil.datepicker($("#ca_toDate"));
				clutil.datepicker($("#ca_clothOrderDate"));
				clutil.datepicker($("#ca_clothDlvDate"));
				clutil.datepicker($("#ca_approveLimitDate"));
				// 販売開始日
				clutil.datepicker($("#ca_salesStartDate"));
				clutil.datepicker($("#ca_salesEndDate"));
				// プライス発行日
				clutil.datepicker($('#ca_プライス発行日'));
				if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
					// 適用期間
					clutil.inputReadonly($("#ca_fromDate"));
					clutil.inputReadonly($("#ca_toDate"));
					clutil.inputReadonly($("#ca_clothOrderDate"));
					clutil.inputReadonly($("#ca_clothDlvDate"));
					clutil.inputReadonly($("#ca_approveLimitDate"));
					// 販売開始日
					clutil.inputReadonly($("#ca_salesStartDate"));
					clutil.inputReadonly($("#ca_salesEndDate"));
				}
			}, this));

			// 画像選択ダイアログ
			this.AMMSV1101Dialog = new AMMSV1101SelectorView({
				el: this.$("#ca_AMMSV1101_dialog"),		// 配置場所
				$parentView: this.$("#mainColumn"),
			});
			this.AMMSV1101Dialog.render();
			this.AMMSV1101Dialog.okProc = this.AMMSV1101_okProc;

			// 上代履歴ダイアログ
			this.AMMSV1102Dialog = new AMMSV1102DialogView({
				el: this.$("#ca_AMMSV1102_dialog"),		// 配置場所
				$parentView	:	this.$("#mainColumn"),
			});
			this.AMMSV1102Dialog.render();

			// 組合せ販売選択ダイアログ
			this.AMPAV0070Dialog = new AMPAV0070SelectorView({
				el: this.$("#ca_AMPAV0070_dialog"),
				$parentView	:	this.$("#mainColumn"),
			});
			this.AMPAV0070Dialog.render();
			this.AMPAV0070Dialog.okProc = this.AMPAV0070_okProc;

			// 組織別上代非表示
			if (org_price == 0) {
				$("#expand_price").addClass('dispn');
				$("#price_info").addClass('dispn');
				f_org_price = false;
			} else {
				f_org_price = true;
			}
			// 初期のアコーディオン展開状態をつくる。

			// ツールチップ初期化
			$(".txtInFieldUnit.help").tooltip({html: true});

			return this;
		},

		f_org_price: false,		// 組織別上代有無フラグ

		/**
		 * 画像選択から戻ってきた
		 * @param photoRecList
		 */
		AMMSV1101_okProc: function(photoRecList) {
			console.log(photoRecList);
			this.photoList = photoRecList;

			this.renderPhotoList(this.$("#ca_photo"), this.photoList);
		},

		/**
		 * 組合せ販売選択から戻ってきた
		 * @param bundleList 組合せ販売リスト
		 */
		AMPAV0070_okProc: function(bundleList) {
			console.log(bundleList);

			if (bundleList != null && bundleList.length > 0) {
				var bundle = bundleList[0];
				// val, code, name
				this.$("#ca_bundleID").val(bundle.val);
				this.$("#ca_bundleView").val(bundle.code + ":" + bundle.name);
			} else {
				this.$("#ca_bundleID").val(0);
				this.$("#ca_bundleView").val("");
			}

		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			this.mdBaseView.fetch();	// データを GET してくる。

			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {

				// 新規の場合、適用期間の初期表示を行う
				var fromDate = clutil.addDate(clcom.getOpeDate(), 1);
				var toDate = clcom.max_date;
				$("#ca_fromDate").datepicker("setIymd", fromDate);
				$("#ca_toDate").datepicker("setIymd", toDate);

				// 色々初期表示
				// カラー・サイズを一つ表示する
				this._onAddColorSizeClick(null);
				// 発注を一つ表示する
				this._onAddOrderInfoClick(null);

				// 入力不可に
				this.setReadonly();
				this.initReadonly_req();
				this.mdBaseView.setSubmitEnable(false);	// フッターを非活性化

				$("#ca_unitID").trigger('change');
			}
			var $canvas = this.$('.mainPicBox');
			this.dimensionMain = {
				width: $canvas.width(),
				height: $canvas.height(),
			};
			$canvas = this.$('.texturePicBox');
			this.dimensionTexture = {
					width: $canvas.width(),
					height: $canvas.height(),
			};
			var $img = this.$('img.photo');
			$img.load(this._onImgLoaded);
			$img.error(this._onImgError);

			return this;
		},

		// 画像ロードイベント
		_onImgLoaded: function(e){
			console.log('_onImgLoaded');
			console.log(arguments);

			var $tgt = $(e.target);
			var id = $tgt.attr('id');

			var dimension = null;
			if (id == 'img_mainPhoto') {
				dimension = this.dimensionMain;
			} else if (id == 'img_clothPhoto') {
				dimension = this.dimensionTexture;
			} else if (id == 'tagImage') {
				dimension = {
					width: 300,
					height: 300,
				};
			} else {
				dimension = {
					width: 20,
					height: 20,
				};
			}

			// 高さｘ幅 調整
			var dim = clutil.getActualDimension(e.target);
			var cssArg = {
				width: dimension.width + 'px',
				height: dimension.height + 'px'
			};
			if(dim.width === 0 || dim.height === 0 || !_.isNumber(dim.width) || !_.isNumber(dim.height)){
				// サイズとれない
			}else{
				var tangent = dimension.height / dimension.width;
				var tan = dim.height / dim.width;
				if(tan > tangent){
					// 横長
					cssArg.width = 'auto';
				}else{
					// 縦長
					cssArg.height = 'auto';
				}
			}

			this.$('.noimg').hide();
			$tgt.css(cssArg).show();
		},

		// 画像ロードエラーイベント
		_onImgError: function(e){
			console.log('_onImgError');
			console.log(arguments);

			this.$('img.photo').hide();
			this.$('.noimg').show();
		},

		reapproveTypeID: 0,		// 再承認フラグ
		itemApproveTypeID: 0,	// 承認状態区分

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			//console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var chkData = this.options.chkData[pgIndex];
			var id = (chkData.id != null) ? chkData.id : chkData.itemID;
			this.reapproveTypeID = chkData.reapproveTypeID;
			this.itemApproveTypeID = chkData.itemApproveTypeID;
			var ope = this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY
						? this.opeTypeId
						: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
			var copySrcType = 0;
			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				copySrcType = clcom.srcId == 'AMMSV0070' ? 2 : 1;
			}
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: ope
				},
				// 共通ページヘッダ		・・・これ、必要なの？					【確認】
				reqPage: {
				},
				// 商品マスタ検索リクエスト
				AMMSV0100GetReq: {
					srchID: id,		// 商品ID
					srchDate: chkData.fromDate,		// 適用開始日
					srchReapproveTypeID: chkData.reapproveTypeID,
					srchApproveTypeID: chkData.itemApproveTypeID,	// TODO 多分違う
					copySrcType: copySrcType,
					delFlag: chkData.delFlag,	// 削除フラグ
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMMSV0100UpdReq: {
				},
				AMMSV0100FormatGetReq: {
				},
				AMMSV0100SizeGetReq:{
				},
				AMMSV0100TagAddrGetReq:{
				},
				AMMSV0100PriceHistGetReq:{
				},
				AMMSV0100SizeGetReq:{
				},
			};

			this.savedReq = _.deepClone(getReq);	// 検索条件を保存しておく（PDFで使用）

			return {
				resId: clcom.pageId,	//'AMMSV1100',
				data: getReq
			};
		},

		/**
		 * 更新時のパターン番号を判定する
		 * @param opt
		 * @returns {Number}
		 */
		setPtnNo: function(opt) {
			var ptnNo = 0;

			switch (opt.btn_opeTypeId) {
			case OpeType.AMMSV1100_OPETYPE_TMP_SAVE:
				// 一時保存
				switch (opt.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
					// 新規作成
					ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_NEW;
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					// 編集
					switch (opt.editTypeID) {
					case amcm_type.AMCM_VAL_ITEM_EDIT_UPD:
						// 再承認不要編集
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_EDIT_UPD;
						break;
					case amcm_type.AMCM_VAL_ITEM_EDIT_UPDBASIC:
						// 基本属性編集
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_MST_EDIT;
						break;
					case amcm_type.AMCM_VAL_ITEM_EDIT_ADDORDER:
						// 追加発注編集
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_EDIT;
						break;
					case amcm_type.AMCM_VAL_ITEM_EDIT_CANCELORDER:
						// 発注取消編集
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_ODCAN_EDIT;
						break;
					default:
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_NEW_EDIT;
						break;
					}
					break;
				}
				break;
			case OpeType.AMMSV1100_OPETYPE_TAG_APPLY:
				// タグ発行申請
				ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPLY;
				break;
			case OpeType.AMMSV1100_OPETYPE_TAG_RETURN:
				// タグ発行差戻し
				ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_RETURN;
				break;
			case OpeType.AMMSV1100_OPETYPE_TAG_APPROVE:
				// タグ発行承認
				ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPROVE;
				break;
			case OpeType.AMMSV1100_OPETYPE_LAST_APPLY:
				// 最終承認申請
				switch (opt.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
					// 新規作成
					ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_APPLY;
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					// 編集
					switch (opt.editTypeID) {
					case amcm_type.AMCM_VAL_ITEM_EDIT_UPDBASIC:
						// 基本属性編集承認申請
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_MST_APPLY;
						break;
					case amcm_type.AMCM_VAL_ITEM_EDIT_ADDORDER:
						// 追加発注承認申請
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_APPLY;
						break;
					case amcm_type.AMCM_VAL_ITEM_EDIT_CANCELORDER:
						// 追加発注承認申請
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_ODCAN_APPLY;
						break;
					default:
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_APPLY;
						break;
					}
					break;
				}
				break;
			case OpeType.AMMSV1100_OPETYPE_LAST_RETURN:
				// 最終承認差戻し
				switch (opt.editTypeID) {
				case amcm_type.AMCM_VAL_ITEM_EDIT_UPDBASIC:
					// 基本属性編集承認差戻し
					ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_MST_RETURN;
					break;
				case amcm_type.AMCM_VAL_ITEM_EDIT_ADDORDER:
					// 追加発注承認申請
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_RETURN;
					break;
				case amcm_type.AMCM_VAL_ITEM_EDIT_CANCELORDER:
					// 追加発注承認申請
					ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_ODCAN_RETURN;
					break;
				default:
					ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_RETURN;
					break;
				}
				break;
			case OpeType.AMMSV1100_OPETYPE_LAST_APPROVE:
				// 最終承認
				switch (opt.editTypeID) {
				case amcm_type.AMCM_VAL_ITEM_EDIT_UPDBASIC:
					// 基本属性編集承認差戻し
					ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_MST_APPROVE1;
					break;
				case amcm_type.AMCM_VAL_ITEM_EDIT_ADDORDER:
					// 追加発注承認申請
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_APPROVE1;
					break;
				case amcm_type.AMCM_VAL_ITEM_EDIT_CANCELORDER:
					// 追加発注承認申請
					ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_ODCAN_APPROVE1;
					break;
				default:
					ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_APPROVE1;
					break;
				}
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				// 削除
				ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_DEL;
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
				// 予約取消
				ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_CANCEL;
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_EDIT_UPD;
				break;
			}

			return ptnNo;
		},

		/**
		 * タグ種別の選択数チェック
		 * @returns {Boolean}
		 */
		isValidTagTypeID: function() {
			var f_valid = true;
			var tagTypeIDArray = $("#ca_tagTypeID").val();
			if (_.isArray(tagTypeIDArray) && tagTypeIDArray.length > 2) {
				this.validator.setErrorMsg($("#ca_tagTypeID"), 'タグ種別の選択は2種類以内です。');
				f_valid = false;
			}
			return f_valid;
		},

		/**
		 * 素材詳細重複チェック
		 * @returns {Boolean}
		 */
		isValidMaterialList: function() {
			var f_valid = true;
			var idMap = {};

			var msg = clutil.fmtargs(clmsg.EGM0009, ['部位、素材']);
			_.each($("#ca_table_material_tbody tr"), _.bind(function(tr) {
				var $tr = $(tr);
				var $ca_placeID = $tr.find('select[name="ca_placeID"]');
				var $ca_tagMaterialID = $tr.find('select[name="ca_tagMaterialID"]');

				var placeID = $ca_placeID.val();
				var tagMaterialID = $ca_tagMaterialID.val();

				if (placeID == 0 && tagMaterialID == 0) {
					// 未設定なので対象外
					return;
				}
				var key = placeID + ":" + tagMaterialID;
				if (idMap[key] == true) {
					// 重複
					//// 重複を許容する #20150417
					//this.validator.setErrorMsg($ca_placeID, msg);
					//this.validator.setErrorMsg($ca_tagMaterialID, msg);
					//f_valid = false;
				} else {
					idMap[key] = true;
				}
			}, this));

			return f_valid;
		},

		/**
		 * ゾーン別上代重複チェック
		 * @returns {Boolean}
		 */
		isValidPriceZone: function() {
			var f_valid = true;
			var idMap = {};
			var msg = clutil.fmtargs(clmsg.EGM0009, ['地区']);

			_.each($("#ca_table_price_zone_tbody tr"), _.bind(function(tr) {
				var $tr = $(tr);
				var $ca_orgID = $tr.find('input[name="ca_orgID"]');
				var item = $ca_orgID.autocomplete('clAutocompleteItem');
				if (item == null) {
					return;
				}

				var orgID = item.id;
				if (idMap[orgID] == true) {
					this.validator.setErrorMsg($ca_orgID, msg);
					f_valid = false;
				} else {
					idMap[orgID] = true;
				}
			}, this));

			return f_valid;
		},

		isValidPriceZone2: function() {
			var f_valid = true;

			var items = clutil.tableview2ValidData({
				$tbody: this.$("#ca_table_price_zone_tbody"),
				validator: this.validator,
				tailEmptyCheckFunc: function(item) { // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように
					if ((item.orgID != null && item.orgID != 0) || item.orgPriceIntax != "") {
						return false;
					} else {
						return true;
					}
				}
			});

			if (_.isEmpty(items)) {
		        // 全部空欄行だったとか・・・
		        clutil.mediator.trigger('onTicker',clmsg.EGM0024);
		        f_valid = false;
			}

			return f_valid;
		},

		/**
		 * 店舗別上代重複チェック
		 * @returns {Boolean}
		 */
		isValidPriceStore: function() {
			var f_valid = true;
			var idMap = {};
			var msg = clutil.fmtargs(clmsg.EGM0009, ['店舗']);

			_.each($("#ca_table_price_store_tbody tr"), _.bind(function(tr) {
				var $tr = $(tr);
				var $ca_orgID = $tr.find('input[name="ca_orgID"]');
				var item = $ca_orgID.autocomplete('clAutocompleteItem');
				if (item == null) {
					return;
				}

				var orgID = item.id;
				if (idMap[orgID] == true) {
					this.validator.setErrorMsg($ca_orgID, msg);
					f_valid = false;
				} else {
					idMap[orgID] = true;
				}
			}, this));

			return f_valid;
		},

		/**
		 * 店舗別上代重複チェック
		 * @returns {Boolean}
		 */
		isValidPriceStore2: function() {
			var f_valid = true;

			var items = clutil.tableview2ValidData({
				$tbody: this.$("#ca_table_price_store_tbody"),
				validator: this.validator,
				tailEmptyCheckFunc: function(item) { // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように
					if ((item.orgID != null && item.OrgID != 0) || item.orgPriceIntax != "") {
						return false;
					} else {
						return true;
					}
				}
			});

			if (_.isEmpty(items)) {
		        // 全部空欄行だったとか・・・
		        clutil.mediator.trigger('onTicker',clmsg.EGM0024);
		        f_valid = false;
			}

			return f_valid;
		},

		/**
		 * 限定店舗重複チェック
		 * @returns {Boolean}
		 */
		isValidTarget: function() {
			var f_valid = true;
			var idMap = {};
			var msg = clutil.fmtargs(clmsg.EGM0009, ['店舗（限定店舗の）']);

			_.each($("#ca_table_tgt_tbody tr"), _.bind(function(tr) {
				var $tr = $(tr);
				var $ca_orgID = $tr.find('input[name="ca_tgtOrgID"]');
				var item = $ca_orgID.autocomplete('clAutocompleteItem');
				if (item == null) {
					return;
				}

				var orgID = item.id;
				if (idMap[orgID] == true) {
					this.validator.setErrorMsg($ca_orgID, msg);
					f_valid = false;
				} else {
					idMap[orgID] = true;
				}
			}, this));

			return f_valid;
		},

		isValidTarget2: function() {
			var f_valid = true;

			var items = clutil.tableview2ValidData({
				$tbody: this.$("#ca_table_tgt_tbody"),
				validator: this.validator,
				tailEmptyCheckFunc: function(item) { // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように
					if (item.tgtOrgID != null && item.tgtOrgID.id != 0) {
						return false;
					} else {
						return true;
					}
				}
			});

			if (_.isEmpty(items)) {
		        // 全部空欄行だったとか・・・
		        clutil.mediator.trigger('onTicker',clmsg.EGM0024);
		        f_valid = false;
			}

			return f_valid;

		},

		/**
		 * 納品形態と振分先のチェック
		 * @returns {Boolean}
		 */
		isValidDlvroute: function() {
			var f_valid = true;
			// 納品形態のどちらかに店直以外があったら、振分先を必須にする
			var dlvroute1 = $("#ca_dlvroute1TypeID").val();
			var dlvroute2 = $("#ca_dlvroute2TypeID").val();

			var $ca_centerID = $("#ca_centerID");

			dlvroute1 = Number(dlvroute1);
			dlvroute1 = _.isNaN(dlvroute1) ? 0 : dlvroute1;
			dlvroute2 = Number(dlvroute2);
			dlvroute2 = _.isNaN(dlvroute2) ? 0 : dlvroute2;

			if ((dlvroute1 > 0 && dlvroute1 != amcm_type.AMCM_VAL_DLV_ROUTE_DIRECT)
					|| (dlvroute2 > 0 && dlvroute2 != amcm_type.AMCM_VAL_DLV_ROUTE_DIRECT)) {
				//var item = $ca_centerID.autocomplete('clAutocompleteItem');
				var id = $ca_centerID.val();
				if (id == 0) {
					// 振分先が未入力
					this.validator.setErrorMsg($ca_centerID, clmsg.EMS0016);
					f_valid = false;
				}
			}
			return f_valid;
		},

		/**
		 * 製品仕上日は承認期限日以降であること
		 * @returns {Boolean}
		 */
		isValidFinishDate: function(editTypeID) {
			var f_valid = true;
			if (editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_UPD) {
				// 編集不可モードなのでチェック不要
				return true;
			}
			var $div = $('div[name="div_order_info_list"]:last');
			var $ca_approveLimitDate = $('#ca_approveLimitDate');
			var $ca_finishDate = $div.find('input[name0="ca_finishDate"]');

			var limitDate = clutil.dateFormat($ca_approveLimitDate.val(), 'yyyymmdd');
			var finishDate = clutil.dateFormat($ca_finishDate.val(), 'yyyymmdd');
			limitDate = Number(limitDate);
			finishDate = Number(finishDate);

			var f_limitDate = $ca_approveLimitDate.attr('disabled');
			var f_finishDate = $ca_finishDate.attr('disabled');

			if (limitDate == 0 || finishDate == 0) {
				return f_valid;
			}
			if (f_limitDate == 'disabled' || f_finishDate == 'disabled') {
				return f_valid;
			}
			if (limitDate >= finishDate) {
				this.validator.setErrorMsg($ca_finishDate, clmsg.EMS0018);
				f_valid = false;
			}
			return f_valid;
		},

		/**
		 * 入荷予定日は製品仕上日以降であること
		 * @param editTypeID
		 * @returns {Boolean}
		 */
		isValidDlvDate: function(editTypeID) {
			var f_valid = true;
			if (editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_UPD
					|| editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_CANCELORDER) {
				// 編集不可モードなのでチェック不要
				return true;
			}

			var $div = $('div[name="div_order_info_list"]:last');
			var $ca_finishDate = $div.find('input[name0="ca_finishDate"]');
			var $ca_dlvDate = $div.find('input[name0="ca_dlvDate"]');

			var f_finishDate = $ca_finishDate.attr('disabled');
			var f_dlvDate = $ca_dlvDate.attr('disabled');

			// 属性変更で追加発注無しの場合
			if (f_finishDate == 'disabled' || f_dlvDate == 'disabled') {
				return f_valid;
			}

			var finishDate = clutil.dateFormat($ca_finishDate.val(), 'yyyymmdd');
			var dlvDate = clutil.dateFormat($ca_dlvDate.val(), 'yyyymmdd');
			dlvDate = Number(dlvDate);
			finishDate = Number(finishDate);

			if (dlvDate == 0 || finishDate == 0) {
				return f_valid;
			}
			if (finishDate >= dlvDate) {
				this.validator.setErrorMsg($ca_dlvDate, clmsg.EMS0019);
				f_valid = false;
			}
			return f_valid;
		},

		/**
		 * タグ増産率は０～５％であること
		 * @param editTypeID
		 * @returns {Boolean}
		 */
		isValidTagIncRate: function(editTypeID) {
			var f_valid = true;
			if (editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_UPD) {
				// 編集不可モードなのでチェック不要
				return true;
			}
			var $div = $('div[name="div_order_info_list"]:last');
			var $ca_tagIncRate = $div.find('input[name0="ca_tagIncRate"]');

			var tagIncRate = Number($ca_tagIncRate.val());
			if (tagIncRate < 0 || tagIncRate > 5) {
				this.validator.setErrorMsg($ca_tagIncRate, clmsg.EMS0182);
				f_valid = false;
				return f_valid;
			}

			return f_valid;
		},

		/**
		 * 販売開始日は仕入予定日以降であること（追加発注時除く）
		 * @returns {Boolean}
		 */
		isValidSalesStartDate: function(editTypeID) {
			var len = $('div[name="div_order_info_list"]').length;
			if (len > 1) {
				return true;	// 追加発注なので判定なし
			}
			if (editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_UPD
					|| editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_ADDORDER
					|| editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_CANCELORDER) {
				// 編集不可モードなのでチェック不要
				return true;
			}

			var f_valid = true;
			var $div = $('div[name="div_order_info_list"]:last');
			var $ca_dlvDate = $div.find('input[name0="ca_dlvDate"]');
			var $ca_salesStartDate = $('#ca_salesStartDate');

			var dlvDate = clutil.dateFormat($ca_dlvDate.val(), 'yyyymmdd');
			var salesStartDate = clutil.dateFormat($ca_salesStartDate.val(), 'yyyymmdd');
			dlvDate = Number(dlvDate);
			salesStartDate = Number(salesStartDate);

			if (dlvDate == 0 || salesStartDate == 0) {
				return f_valid;
			}
			if (dlvDate >= salesStartDate) {
				this.validator.setErrorMsg($ca_salesStartDate, clmsg.EMS0020);
				f_valid = false;
			}
			return f_valid;
		},

		/**
		 * 販売終了日は販売開始日以降であること
		 * @returns {Boolean}
		 */
		isValidSalesEndDate: function(editTypeID) {
			var f_valid = true;
			if (editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_UPD
					|| editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_ADDORDER
					|| editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_CANCELORDER) {
				// 編集不可モードなのでチェック不要
				return true;
			}
			var $ca_salesStartDate = $('#ca_salesStartDate');
			var $ca_salesEndDate = $('#ca_salesEndDate');

			var salesStartDate = clutil.dateFormat($ca_salesStartDate.val(), 'yyyymmdd');
			var salesEndDate = clutil.dateFormat($ca_salesEndDate.val(), 'yyyymmdd');
			salesStartDate = Number(salesStartDate);
			salesEndDate = Number(salesEndDate);

			if (salesEndDate == 0 || salesStartDate == 0) {
				return f_valid;
			}
			if (salesStartDate >= salesEndDate) {
				this.validator.setErrorMsg($ca_salesEndDate, clmsg.EMS0021);
				f_valid = false;
			}
			return f_valid;
		},

		/**
		 * 原反工場着日は原反発注日以降であること
		 * @returns {Boolean}
		 */
		isValidClothDlvDate: function(editTypeID) {
			var f_valid = true;
			if (editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_UPD
					|| editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_CANCELORDER) {
				// 編集不可モードなのでチェック不要
				return true;
			}
			var $ca_clothOrderDate = $('#ca_clothOrderDate');
			var $ca_clothDlvDate = $('#ca_clothDlvDate');

			var clothOrderDate = clutil.dateFormat($ca_clothOrderDate.val(), 'yyyymmdd');
			var clothDlvDate = clutil.dateFormat($ca_clothDlvDate.val(), 'yyyymmdd');
			clothOrderDate = Number(clothOrderDate);
			clothDlvDate = Number(clothDlvDate);

			if (clothDlvDate == 0 || clothOrderDate == 0) {
				return f_valid;
			}
			if (clothOrderDate >= clothDlvDate) {
				this.validator.setErrorMsg($ca_clothDlvDate, clmsg.EMS0026);
				f_valid = false;
			}
			return f_valid;
		},

		/**
		 * 型番において、同じ部位の行が存在しないこと
		 * @returns {Boolean}
		 */
		isValidModelno: function() {
			var f_valid = true;
			var modelnoMap = {};

			_.each($("#ca_table_modelno_tbody tr"), _.bind(function(tr) {
				var $tr = $(tr);
				var $ca_modelnoPlaceID = $tr.find('select[name="ca_modelnoPlaceID"]');
				var modelnoPalceID = $ca_modelnoPlaceID.val();
				if (modelnoPalceID != 0) {
					if (modelnoMap[modelnoPalceID]) {
						// 重複している
						this.validator.setErrorMsg($ca_modelnoPlaceID, clmsg.EMS0027);
						f_valid = false;
					} else {
						modelnoMap[modelnoPalceID] = true;
					}
				}
			}, this));

			return f_valid;
		},

		isValidModelno2: function() {
			var f_valid = true;
			var f_row = false;

			var items = clutil.tableview2ValidData({
				$tbody: this.$("#ca_table_modelno_tbody"),
				validator: this.validator,
				tailEmptyCheckFunc: function(item) { // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように
					if ((item.modelnoPlaceID != null && item.modelnoPlaceID != 0) || item.modelno != "") {
						f_row = true;
						return false;
					} else {
						return true;
					}
				}
			});

			if (_.isEmpty(items) && f_row) {
		        // 全部空欄行だったとか・・・
		        clutil.mediator.trigger('onTicker',clmsg.EGM0024);
		        f_valid = false;
			}

			return f_valid;
		},

		/**
		 * カラー展開に同じカラーが存在しないこと(別の表でもNG)
		 * @returns {Boolean}
		 */
		isValidColor: function() {
			var f_valid = true;
			var colorMap = {};

			_.each($('select[name="ca_colorID"]'), _.bind(function(select) {
				var $select = $(select);
				var id = $select.val();

				if (id != 0 &&  !_.isEmpty(id)) {
					if (colorMap[id]) {
						// 重複している
						this.validator.setErrorMsg($select, clmsg.EMS0028);
						f_valid = false;
					} else {
						colorMap[id] = true;
					}
				}
			}, this));
			return f_valid;
		},

		/**
		 * カラー展開にカラーが設定されていること
		 * @returns {Boolean}
		 */
		isValidColor2: function(ptnNo) {
			var f_valid = true;
			var f_color = false;

			if (!this.isEditMode(ptnNo)) {
				_.each($('select[name="ca_colorID"]'), _.bind(function(select) {
					f_color = true;
				}, this));
				if (!f_color) {
					// カラーが設定されてていない
					f_valid = false;
				}
			}
			return f_valid;
		},

		isValidColor3: function(ptnNo) {
			var f_valid = true;

			_.each($('tbody[name="ca_table_color_tbody"]'), _.bind(function(tbody) {
				var $tbody = $(tbody);

				var items = clutil.tableview2ValidData({
					$tbody: $tbody,
					validator: this.validator,
					tailEmptyCheckFunc: function(item) { // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように
						if ((item.colorID != null && item.colorID != 0) || item.designColorID != 0 || item.makerColor != "") {
							return false;
						} else {
							return true;
						}
					}
				});

				if (_.isEmpty(items) && !this.isEditMode(ptnNo))  {
			        // 全部空欄行だったとか・・・
			        clutil.mediator.trigger('onTicker',clmsg.EGM0024);
			        f_valid = false;
				}

			}, this));

			return f_valid;
		},

		/**
		 * サイズ展開で少なくとも1つのサイズが設定されていること
		 * @returns {Boolean}
		 */
		isValidSize: function(ptnNo) {
			var f_valid = true;

			if (!this.isEditMode(ptnNo)) {
				var ca_size = $('input[name="select_col"]:checked');
				if (ca_size.length == 0) {
					// サイズが設定されてていない
					this.validator.setErrorHeader(clmsg.EMS0030);
					f_valid = false;
				}
			}

			return f_valid;
		},

		isValidJanCD: function(code) {
			var len = code.length;
			var cd1 = code.slice(-1);

			var cd2 = clutil.getCheckDigitM10W13(code, len-1);
			if (cd1 != cd2) {
				return false;
			} else {
				return true;
			}
		},

		/**
		 * JAN手入力の場合、JANコードが全ての欄で設定されていること
		 * 入力されたJANコードのチェックディジットがあっていること
		 * @returns {Boolean}
		 */
		isValidJan: function() {
			var f_valid = true;
			var janMap = {};

			if ($("#ca_inputJanFlag").prop('checked')) {
				_.each($('input[name="ca_janCode"]'), _.bind(function(input) {
					var $input = $(input);
					var jan = $input.val();

					if (_.isEmpty(jan)) {
						this.validator.setErrorMsg($input, clmsg.EMS0031);
						f_valid = false;
					} else if (janMap[jan]) {
						this.validator.setErrorMsg($input, clmsg.EMS0032);
						f_valid = false;
					} else if (!this.isValidJanCD(jan)) {
						this.validator.setErrorMsg($input, "JANコードのチェックディジットが間違っています。");
						f_valid = false;
					} else {
						janMap[jan] = true;
					}
				}, this));
			}
			return f_valid;
		},

		/**
		 * 差戻し時、差戻し理由が入力されていること
		 * @returns {Boolean}
		 */
		isValidComment: function(rtyp) {
			var f_valid = true;

			var $ca_comment = $('#ca_comment');
			if (rtyp == OpeType.AMMSV1100_OPETYPE_TAG_RETURN ||
					rtyp == OpeType.AMMSV1100_OPETYPE_LAST_RETURN) {
				// ここが入力可能ということは、差戻しである
				var val = $ca_comment.val();
				if (_.isEmpty(val)) {
					this.validator.setErrorMsg($ca_comment, clmsg.EMS0037);
					f_valid = false;
				}
			}
			return f_valid;
		},

		/**
		 * 売り切り年は商品展開年以降であること
		 * @returns {Boolean}
		 */
		isValidSaleEndYear: function() {
			var f_valid = true;

			var $ca_selloutYear = $("#ca_selloutYear");
			var $ca_year = $("#ca_year");

			var selloutYear = Number($ca_selloutYear.val());
			var year = Number($ca_year.val());

			if (selloutYear < year) {
				this.validator.setErrorMsg($ca_selloutYear, clmsg.EMS0017);
				f_valid = false;
			}

			return f_valid;
		},

		/**
		 * タグが選択されている事
		 */
		isValidTag: function() {
			var f_valid = true;
			if (!$("#ca_tagIssueFlag").prop('checked')) {
				f_valid = false;
			}
			return f_valid;
		},

		/**
		 * 上代≧下代であること（警告）
		 * @returns {Boolean}
		 */
		isValidPrice: function() {
			var f_valid = true;
			var $ca_cost = $("#ca_cost");
			var $ca_price = $("#ca_price");
			//var $ca_priceIntax = $("#ca_priceIntax");

			var cost = Number($ca_cost.val().split(',').join(''));
			var price = Number($ca_price.val().split(',').join(''));
			if (price < cost) {
				this.validator.setErrorMsg($ca_price, clmsg.WMS0100);
				f_valid = false;
			}
			return f_valid;
		},

		/**
		 * 下代＞1であること（警告）
		 * ただし、最終承認依頼の場合のみ
		 * @returns {Boolean}
		 */
		isValidCost: function() {
			var f_valid = true;
			var $ca_cost = $("#ca_cost");
			var cost = Number($ca_cost.val().split(',').join(''));

			if (cost <= 1) {
				this.validator.setErrorMsg($ca_cost, clmsg.WMS0160, 'alert');
				f_valid = false;
			}
			return f_valid;
		},
		/**
		 * 基本属性変更モードで、承認不要項目のみ編集されている場合警告を出す
		 * @returns {Boolean}
		 */
		isValidUpdBasic: function(opeTypeID) {
			var f_edit = $("#ca_editTypeID").val();
			// 基本属性変更モード以外はチェックしない
			if (f_edit != amcm_type.AMCM_VAL_ITEM_EDIT_UPDBASIC) {
				return true;
			}
			// 最終承認か最終承認差戻しの場合は、チェックしない
			if (opeTypeID == OpeType.AMMSV1100_OPETYPE_LAST_APPROVE ||
					opeTypeID == OpeType.AMMSV1100_OPETYPE_LAST_RETURN) {
				return true;
			}

			if (this.savedData == null || this.savedData.AMMSV0100CurGetRsp == null) {
				return true;
			}

			var item = this.savedData.AMMSV0100CurGetRsp.item;
			var info = this.savedData.AMMSV0100CurGetRsp.info;
			var attr = this.savedData.AMMSV0100CurGetRsp.attr;
			var price = this.savedData.AMMSV0100CurGetRsp.price;
			var mateList = this.savedData.AMMSV0100CurGetRsp.materialList;
			var tgtColorList = this.savedData.AMMSV0100CurGetRsp.tgtColorList;
			var tgtSizeList = this.savedData.AMMSV0100CurGetRsp.tgtSizeList;
			var citemList = this.savedData.AMMSV0100CurGetRsp.citemList;
			var csitemList = this.savedData.AMMSV0100CurGetRsp.csitemList;
			var org_oheadList = this.savedData.AMMSV0100CurGetRsp.orderHeadList;
			var org_ohead = _.last(org_oheadList);
			// 発注詳細
			var org_odtlList = this.savedData.AMMSV0100GetRsp.orderDtlList;
			var org_odtlMap = {};
			var last_orderSeq = -1;
			_.each(org_odtlList, _.bind(function(o) {
				if (last_orderSeq < o.orderSeq) {
					last_orderSeq = o.orderSeq;
				}
				if (org_odtlMap[o.orderSeq] == null) {
					org_odtlMap[o.orderSeq] = [];
				}
				org_odtlMap[o.orderSeq].push(o);
			}, this));
			var org_odtl = org_odtlMap[last_orderSeq];
			var odtlMap = {};
			_.each(org_odtl, _.bind(function(o) {
				var key = o.orderColorID + ":" + o.orderSizeID;
				odtlMap[key] = o;
			}, this));
			// 下代構成
			var costDtlList = this.savedData.AMMSV0100GetRsp.costDtlList;
			var costDtlMap = {};
			_.each(costDtlList, _.bind(function(c) {
				costDtlMap[c.costItemID] = c;
			}, this));

			// 商品名
			var name = $("#ca_name").val();
			if (name != item.name) {
				// 変更されているのでOK
				return true;
			}
			// 商品区分
			var type = $("#ca_itemTypeID").val();
			if (type != attr.itemTypeID) {
				return true;
			}
			// シーズン
			var season = $("#ca_seasonID").val();
			if (season != attr.seasonID) {
				return true;
			}
			// サブシーズン
			var subseason = $("#ca_subSeasonID").val();
			if (subseason != attr.subSeasonID) {
				return true;
			}
			// サブクラス１
			var subclass1 = $("#ca_subcls1ID").val();
			if (subclass1 != attr.subcls1ID) {
				return true;
			}
			// サブクラス2
			var subclass2 = $("#ca_subcls2ID").val();
			if (subclass2 != attr.subcls2ID) {
				return true;
			}
			// 品質
			var quality = $("#ca_quality").val();
			if (quality != attr.quality) {
				return true;
			}
			// タグ発行フラグ
			var tagIssueFlag = $("#ca_tagIssueFlag").prop('checked') ? 1 : 0;
			if (tagIssueFlag != attr.tagIssueFlag) {
				return true;
			}
			// タグ発行区分
			var tagIssueID = $("#ca_tagIssueID").val();
			if (tagIssueID != attr.tagIssueID) {
				return true;
			}
			// タグ種別
			var tagTypeID = $("#ca_tagTypeID").val();
			if (tagTypeID != attr.tagTypeID) {
				return true;
			}
			// 生産国（タグ表示用）
			var tagImportID = $("#ca_tagImportID").val();
			if (tagImportID != attr.tagImportID) {
				return true;
			}
			// 素材
			var materialList = this._buildUpdReqAMMSV1100MaterialList({});
			if (materialList.length != mateList.length) {
				return true;
			}
			var f_mate = false;
			_.each(materialList, _.bind(function(material, i) {
				var org_material = mateList[i];
				if (material.placeID != org_material.placeID) {
					f_mate = true;
					return false;
				}
				if (material.tagMaterialID != org_material.tagMaterialID) {
					f_mate = true;
					return false;
				}
				if (material.materialRatio != org_material.materialRatio) {
					f_mate = true;
					return false;
				}
				if (material.tagManual != org_material.tagManual) {
					f_mate = true;
					return false;
				}
			}, this));
			if (f_mate) {
				return true;
			}
			// 糸LOX
			var itoloxID = $("#ca_itoloxID").val();
			if (itoloxID != attr.itoloxID) {
				return true;
			}
			// 強調表示欄
			var tagHighlight = $("#ca_tagHighlight").val();
			if (tagHighlight != attr.tagHighlight) {
				return true;
			}
			// 商品展開年
			var year = $("#ca_year").val();
			if (year != item.year) {
				return true;
			}
			// 販売開始日
			var salesStartDate = clutil.dateFormat($("#ca_salesStartDate").val(), 'yyyymmdd');
			if (salesStartDate != attr.salesStartDate) {
				true;
			}
			// 販売終了日
			var salesEndDate = clutil.dateFormat($("#ca_salesEndDate").val(), 'yyyymmdd');
			if (salesEndDate != attr.salesEndDate) {
				true;
			}
			// 売り切り年
			var selloutYear = $("#ca_selloutYear").val();
			if (selloutYear != attr.selloutYear) {
				return true;
			}
			// 売り切りシーズン
			var selloutSeasonID = $("#ca_selloutSeasonID").val();
			if (selloutSeasonID != attr.selloutSeasonID) {
				return true;
			}
			// セットアップフラグ
			var setupFlag = $("#ca_setupFlag").prop('checked') ? 1 : 0;
			if (setupFlag != attr.setupFlag) {
				return true;
			}
			// カラー
			var colorObj = this._buildUpdReqAMMSV1100TgtColorList({});
			if (colorObj.tgtColorList.length != tgtColorList.length) {
				return true;
			}
			var f_color = false;
			_.each(colorObj.tgtColorList, _.bind(function(tc, i) {
				var o_tc = tgtColorList[i];
				if (tc.tgtColorID != o_tc.tgtColorID) {
					f_color = true;
					return false;
				}
				if (tc.groupNo != o_tc.groupNo) {
					f_color = true;
					return false;
				}
			}, this));
			_.each(colorObj.citemList, _.bind(function(ci, i) {
				var o_ci = citemList[i];
				if (ci.makerColor != o_ci.makerColor) {
					f_color = true;
					return false;
				}
			}, this));
			if (f_color) {
				return true;
			}
			// サイズ
			var sizeObj = this._buildUpdReqAMMSV1100TgtSizeList({}, colorObj.tgtColorList);
			if (sizeObj.tgtSizeList.length != tgtSizeList.length) {
				return true;
			}
			var f_size = false;
			_.each(sizeObj.tgtSizeList, _.bind(function(tc, i) {
				var o_tc = tgtSizeList[i];
				if (tc.tgtColorID != o_tc.tgtColorID) {
					f_size = true;
					return false;
				}
				if (tc.tgtSizeID != o_tc.tgtSizeID) {
					f_size = true;
					return false;
				}
			}, this));
			if (f_size) {
				return true;
			}
			// JAN
			if (sizeObj.csitemList.length != csitemList.length) {
				return true;
			}
			var csitemMap = {};
			_.each(csitemList, _.bind(function(csi) {
				var key = csi.janColorID + ":" + csi.janSizeID;
				csitemMap[key] = csi;
			}, this));
			var f_jan = false;
			_.each(sizeObj.csitemList, _.bind(function(cs, i) {
				var key = cs.janColorID + ":" +  cs.janSizeID;
				var o_cs = csitemMap[key];
				if (o_cs == null) {
					f_jan = true;
					return false;
				}
				if (cs.csitemID != o_cs.csitemID) {
					f_jan = true;
					return false;
				}
				if (cs.janColorID != o_cs.janColorID) {
					f_jan = true;
					return true;
				}
				if (cs.janSizeID != o_cs.janSizeID) {
					f_jan = true;
					return true;
				}
				if (cs.janCode != o_cs.janCode) {
					f_jan = true;
					return true;
				}
			}, this));
			if (f_jan) {
				return true;
			}
			// 生産国
			var importID = $("#ca_importID").val();
			if (importID != attr.importID) {
				return true;
			}
			// 縫製工場
			var factoryID = $("#ca_factoryID").val();
			if (factoryID != attr.factoryID) {
				return true;
			}
			// KI区分
			var kiTypeID = $("#ca_kiTypeID").val();
			if (kiTypeID != attr.kiTypeID) {
				return true;
			}
			// 発注ロット単位数
			var lotCount = $("#ca_lotCount").val().split(',').join('');
			if (lotCount != attr.lotCount) {
				return true;
			}
			// 納品形態（２回目以降）
			var dlvroute2TypeID = $("#ca_dlvroute2TypeID").val();
			if (dlvroute2TypeID != attr.dlvroute2TypeID) {
				return true;
			}
			// 振分先センター
			//var centerItem = $("#ca_centerID").autocomplete('clAutocompleteItem');
			var centerID = $("#ca_centerID").val();
			if (centerID != attr.centerID) {
				return true;
			}
			var $div_order_last = $('div[name="div_order_info_list"]:last');
			// 発注対象
			if (org_ohead != null) {
				var $ca_orderTgtTypeID = $div_order_last.find('select[name0="ca_orderTgtTypeID"]');
				var orderTgtTypeID = $ca_orderTgtTypeID.val();
				if (orderTgtTypeID != org_ohead.orderTgtTypeID) {
					return true;
				}
			}
			// タグ送付先番号
			if (org_ohead != null) {
				var $ca_tagaddrNo = $div_order_last.find('select[name0="ca_tagaddrNo"]');
				var tagaddrNo = Number($ca_tagaddrNo.val());
				if (tagaddrNo != org_ohead.tagaddrNo) {
					return true;
				}
			}
			// 承認期限日
			var approveLimitDate = clutil.dateFormat($("#ca_approveLimitDate").val(), 'yyyymmdd');
			if (approveLimitDate != info.approveLimitDate) {
				return true;
			}
			// 製品仕上げ日
			if (org_ohead != null) {
				var $ca_finishDate = $div_order_last.find('input[name0="ca_finishDate"]');
				var finishDate = clutil.dateFormat($ca_finishDate.val(), 'yyyymmdd');
				if (finishDate != org_ohead.finishDate) {
					return true;
				}
			}
			// センター着予定日
			if (org_ohead != null) {
				var $ca_centerDlvDate = $div_order_last.find('input[name0="ca_centerDlvDate"]');
				var centerDlvDate = clutil.dateFormat($ca_centerDlvDate.val(), 'yyyymmdd');
				if (centerDlvDate != org_ohead.centerDlvDate) {
					return true;
				}
			}
			// 仕入予定日
			if (org_ohead != null) {
				var $ca_dlvDate = $div_order_last.find('input[name0="ca_dlvDate"]');
				var dlvDate = clutil.dateFormat($ca_dlvDate.val(), 'yyyymmdd');
				if (dlvDate != org_ohead.dlvDate) {
					return true;
				}
			}
			// タグ増産率
			var tagIncRate = $("#ca_tagIncRate").val().split(',').join('');
			if (tagIncRate != attr.tagIncRate) {
				return true;
			}
			// 発注数
			var $ca_orderQys = $div_order_last.find('input[name="ca_orderQy"]');
			var f_orderQy = false;
			_.each($ca_orderQys, _.bind(function(ca_orderQy) {
				var $ca_orderQy = $(ca_orderQy);
				var orderQy = $ca_orderQy.val().split(',').join('');

				var $td = $ca_orderQy.parents('td');
				var cid = $td.attr('colorID');
				var sid = $td.attr('sizeID');
				var key = cid + ":" + sid;
				if (odtlMap[key] == null) {
					f_orderQy = true;
					return false;
				} else if (orderQy != odtlMap[key].orderQy) {
					f_orderQy = true;
					return false;
				}
			}, this));
			if (f_orderQy) {
				return true;
			}

			// 発注取消フラグ
			if (org_ohead != null) {
				var cancelFlag = $("#ca_cancelFlag").prop('checked') ? 1 : 0;
				if (cancelFlag != org_ohead.cancelFlag) {
					return true;
				}
			}
			// 下代
			var cost = $("#ca_cost").val().split(',').join('');
			if (cost != price.cost) {
				return true;
			}
			// 通貨
			var currencyID = $("#ca_currencyID").val();
			if (currencyID != price.currencyID) {
				return true;
			}
			// 為替レート
			var exchangeRate = $("#ca_exchangeRate").val();
			if (Number(exchangeRate) != price.exchangeRate) {
				return true;
			}
			// 下代構成
			var f_costDtl = false;
			_.each($("#ca_table_cost_in_tbody tr"), _.bind(function(tr) {
				var $tr = $(tr);
				var $ca_costItemID = $tr.find('input[name="ca_costItemID"]');
				var $ca_costDtl = $tr.find('input[name="ca_costDtl"]');
				var costItemID = $ca_costItemID.val();
				var costDtl = Number($ca_costDtl.val().split(',').join(''));
				var org_costDtl = costDtlMap[costItemID] == null ? 0 : costDtlMap[costItemID].costDtl;

				if (costDtl != org_costDtl) {
					f_costDtl = true;
					return false;
				}
			}, this));
			if (f_costDtl) {
				return true;
			}
			return false;
		},

		/**
		 * 商品展開年のチェック
		 */
		isValidYear: function() {
			var $year = this.$("#ca_year");
			var year = $year.val();
			var ope_date = clcom.getOpeDate();
			var ope_year = Math.floor(ope_date/10000);
			var ope_monthdate = Math.floor(ope_date%10000);
			var PAR_AMCM_YEAR_ST_MMDD = clcom.getSysparam(amcm_sysparams.PAR_AMCM_YEAR_ST_MMDD);
			var ret = true;

			if (PAR_AMCM_YEAR_ST_MMDD == null) {
				PAR_AMCM_YEAR_ST_MMDD = 401;
			} else if (_.isString(PAR_AMCM_YEAR_ST_MMDD)) {
				PAR_AMCM_YEAR_ST_MMDD = Number(PAR_AMCM_YEAR_ST_MMDD);
			}
			if (ope_monthdate < PAR_AMCM_YEAR_ST_MMDD) {
				ope_year -= 1;
			}
			if (year < ope_year) {
				ret = false;
			}
			return ret;
		},


		/**
		 * 戻るなどの押下時に警告を出すかの判断
		 * @param isSubmitBlocking
		 * @param pgIndex
		 * @returns
		 */
		_isConfirmLeaving: function(isSubmitBlocking, pgIndex) {
			var flg = isSubmitBlocking;
			if (!flg && this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && !this.f_confirm) {
				flg = true;
			}
			return flg;
		},


		/**
		 * 一時保存か判定
		 * @param ptnNo
		 * @returns {Boolean}
		 */
		isEditMode: function(ptnNo) {
			var ret = false;
			if (ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_NEW || ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_NEW_EDIT) {
				ret = true;
			}
			return ret;
		},

		/**
		 * チェック不要モード(削除or予約取消)か判定
		 * @param ptnNo
		 * @returns {Boolean}
		 */
		isValidSkip: function(ptnNo) {
			var ret = false;
			if (ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_DEL
					|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_CANCEL
					/*|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_ODCAN_EDIT*/) {
				ret = true;
			}
			return ret;
		},

		isReturnMode: function(opeTypeId) {
			var ret = false;
			if (opeTypeId == OpeType.AMMSV1100_OPETYPE_TAG_RETURN || opeTypeId == OpeType.AMMSV1100_OPETYPE_LAST_RETURN) {
				ret = true;
			}
			return ret;
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			// デモ環境要望対応(start)
			var attrItemMap = this.attrItemMap;
			// 承認期限日
			$('#ca_approveLimitDate').datepicker('setIymd', clcom.getOpeDate());
			// サブクラス2
			$('#ca_subcls2ID').selectpicker('val', _.first(attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_SUBCLS2]).iagID);
			// Ki区分
			$('#ca_kiTypeID').selectpicker('val', amcm_type.AMCM_VAL_KI_PURCHASE);
			// 出荷最小単位
			$('#ca_lotCount').val(1);
			// タグ増産率
			$('#ca_tagIncRate').val(0);
			// 販売開始日
			$('#ca_salesStartDate').datepicker('setIymd', clcom.getOpeDate());
			// 販売終了日
			$('#ca_salesEndDate').datepicker('setIymd', clcom.getOpeDate() + 10000);
			// 売り切り年
			$('#ca_selloutYear').selectpicker('val', clutil.dateFormat(clcom.getOpeDate() + 10000, 'yyyy'));
			// 売り切りシーズン
			$('#ca_selloutSeasonID').selectpicker('val', amcm_type.AMCM_VAL_SEASON_ALL);
			// デモ環境要望対応(end)

			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			this.validator.clear();

			var f_error = false;
			var errmsg = clmsg.cl_echoback;
			var confirm = null;

			// 編集内容
			var editTypeID = $("#ca_editTypeID").val();
			var approveTypeID = (this.infoRec == null || this.infoRec.approveTypeID == null) ? 0 : this.infoRec.approveTypeID;
			var tagApproveTypeID = (this.infoRec == null || this.infoRec.tagApproveTypeID == null) ? 0 : this.infoRec.tagApproveTypeID;

			editTypeID = (editTypeID == null || editTypeID == "") ? 0 : parseInt(editTypeID);

			// パターンNo
			var ptnObj = {
				btn_opeTypeId: opeTypeId,
				opeTypeId: this.opeTypeId,
				editTypeID: editTypeID,
				approveTypeID: approveTypeID,
				tagApproveTypeID: tagApproveTypeID,
			};

			var ptnNo = this.setPtnNo(ptnObj);

			if (this.isReturnMode(opeTypeId)) {
				// 差戻しの場合は「差戻し理由」のみ入力チェックを行う
				if (!this.isValidComment(opeTypeId)) {
					f_error = true;
				}
			} else if (!this.isValidSkip(ptnNo)) {
				// 一時保存とそれ以外でチェックを変える
				if (this.isEditMode(ptnNo)) {
					var v = this.myValid();
					if (v < 0) {
						f_error = true;
					} else if (v > 0) {
						confirm = this.warningMsg;
					}
				} else {
					var myfilter = function(v) {
						var $tgt = $(this);
						var name = $tgt.attr('name');
						if (name == "ca_colorID" || name == "ca_makerColor") {
							return false;
						} else {
							return true;
						}
					};
					// 入力チェック
					if (!this.validator.valid({filter: myfilter})) {
						f_error = true;
					}

				}
				// タグ種別が3つ以上選択されていないこと
				if (!this.isValidTagTypeID(ptnNo)) {
					f_error = true;
				}

				// 型番で重複レコードがないこと
//				if (!this.isValidSpecList()) {
//					f_error = true;
//				}

				// 素材詳細で重複レコードがないこと
				if (!this.isValidMaterialList()) {
					f_error = true;
				}

				if (this.f_org_price) {
					// 指定上代（ゾーン別）で重複レコードが無いこと
					if (!this.isValidPriceZone2()) {
						f_error = true;
					}
					if (!this.isValidPriceZone()) {
						f_error = true;
					}

					// 指定上代（店舗別）で重複レコードが無いこと
					if (!this.isValidPriceStore2()) {
						f_error = true;
					}
					if (!this.isValidPriceStore()) {
						f_error = true;
					}
				}

				// 限定店舗で重複レコードが無いこと
				var limitFlag = $("#ca_limitFlag").prop("checked");
				if (limitFlag) {
					if (!this.isValidTarget2()) {
						f_error = true;
					}
					if (!this.isValidTarget()) {
						f_error = true;
					}
				}


				// 納品形態が店直以外の場合、振分先(センター)が入力されていること
				if (!this.isValidDlvroute(ptnNo)) {
					f_error = true;
				}
				// 製品仕上日は承認期限日以降であること
				if (!this.isValidFinishDate(editTypeID)) {
					f_error = true;
				}
				// 仕入予定日は製品仕上日以降であること
				if (!this.isValidDlvDate(editTypeID)) {
					f_error = true;
				}
				// タグ増産率は０～５であること
				if (!this.isValidTagIncRate(editTypeID)) {
					f_error = true;
				}
				// 販売開始日は仕入予定日以降であること（追加発注時除く）
				if (!this.isValidSalesStartDate(editTypeID)) {
					f_error = true;
				}
				// 販売終了日は販売開始日以降であること
				if (!this.isValidSalesEndDate(editTypeID)) {
					f_error = true;
				}
				// 原反工場着日は原反発注日以降であること
				if (!this.isValidClothDlvDate(editTypeID)) {
					f_error = true;
				}
				// 型番において、同じ部位の行が存在しないこと
				if (!this.isValidModelno2(ptnNo)) {
					f_error = true;
				}
				if (!this.isValidModelno(ptnNo)) {
					f_error = true;
				}
				// カラー展開に同じカラーが存在しないこと(別の表でもNG)
				if (!this.isValidColor3(ptnNo)) {
					f_error = true;
				}
				if (!this.isValidColor(ptnNo)) {
					f_error = true;
				}
				if (!this.isValidColor2(ptnNo)) {
					f_error = true;
					errmsg = clmsg.EMS0029;
				}
				// サイズ展開で少なくとも1つのサイズが設定されていること
				if (!this.isValidSize(ptnNo)) {
					f_error = true;
					errmsg = clmsg.EMS0030;
				}
				// JAN手入力の場合、JANコードが全ての欄で設定されていること
				if (!this.isValidJan(ptnNo)) {
					f_error = true;
				}
				// 差戻し時、差戻し理由が入力されていること
				if (!this.isValidComment(opeTypeId)) {
					f_error = true;
				}
				// 売り切り年は商品展開年以降であること
				if (!this.isValidSaleEndYear(ptnNo)) {
					f_error = true;
				}

				if (ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPLY) {
					if (!this.isValidTag(ptnNo)) {
						errmsg = "タグ発行が選択されていません。";
						f_error = true;
					}
				} else if (ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_APPLY) {
					if (!this.isValidTag(ptnNo)) {
						confirm = "タグ発行が選択されていません。";
					}
				}

				// 上代≧下代であること(警告)
				if (!this.isValidPrice()) {
					if (confirm == null) {
						confirm = clmsg.WMS0100;
					} else {
						confirm += '<br>' + clmsg.WMS0100;
					}
				}
				if (!this.isValidUpdBasic(opeTypeId)) {
					if (confirm == null) {
						confirm = clmsg.WMS0105;
					} else {
						confirm += '<br>' + clmsg.WMS0105;
					}
				}
				if (ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_APPLY &&
						!this.isValidCost()) {
					if (confirm == null) {
						confirm = clmsg.WMS0160;
					} else {
						confirm += '<br>' + clmsg.WMS0160;
					}
				}
				// 商品展開年チェック
				if (!this.isValidYear()) {
					var tmp_confirm = null;
					if (ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_APPLY				// タグ発行申請
							|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPLY	// 最終承認申請
							|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_MST_APPLY	// 基本属性編集承認申請
							|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_APPLY	// 追加発注承認申請
							|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_ODCAN_APPLY	// 発注取消承認申請
							) {
						tmp_confirm = clmsg.WMS0162;
					} else if (ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPROVE1	// タグ発行1次承認
							|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPROVE	// タグ発行2次承認
							|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_APPROVE1		// 最終承認1次承認
							|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_APPROVE2		// 最終承認2次承認
							|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_MST_APPROVE1	// 基本属性編集1次承認
							|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_MST_APPROVE	// 基本属性編集2次承認
							|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_APPROVE1	// 追加発注1次承認
							|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_APPROVE	// 追加発注2次承認
							|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_ODCAN_APPROVE1	// 発注取消1次承認
							|| ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_ODCAN_APPROVE	// 発注取消2次承認
							) {
						tmp_confirm = clmsg.WMS0163;
					}
					if (tmp_confirm != null) {
						if (confirm == null) {
							confirm = tmp_confirm;
						} else {
							confirm += '<br>' + tmp_confirm;
						}
					}
				}
			}

			if (f_error) {
				this.validator.setErrorHeader(errmsg);
				return null;
			}

			// 画面入力値をかき集めて、Rec を構築する。
			var item = this._buildUpdReqAMMSV1100Rec();
			var colorObj = this._buildUpdReqAMMSV1100TgtColorList(item);
			var sizeObj = this._buildUpdReqAMMSV1100TgtSizeList(item, colorObj.tgtColorList);
			var attrObj = this._buildUpdReqAMMSV1100AttrRec(item);
			var attrAnyList = this._buildUpdReqAMMSV1100AttrAnyList(item);
			var tgtStoreList = this._buildUpdReqAMMSV1100TgtStoreList(item, attrObj.saleInfo);
			var price = this._buildUpdReqAMMSV1100PriceRec(item, attrObj.saleInfo);
			var priceOrgList = this._buildUpdReqAMMSV1100PriceOrgList(item);
			var materialList = this._buildUpdReqAMMSV1100MaterialList(item);
			var modelNoList = this._buildUpdReqAMMSV1100ModelNoList(item);
			var specList = this._buildUpdReqAMMSV1100SpecList(item);
			var photoList = this._buildUpdReqAMMSV1100PhotoList(item);
			var costDtlList = this._buildUpdReqAMMSV1100CostDtlList(item);
			var orderObj = this._buildUpdReqAMMSV1100OrderHeadList(item, colorObj, sizeObj);
			var commentList = this._buildUpdReqAMMSV1100CommentList(item, attrObj.commentInfo);
			var info = this._buildUpdReqAMMSV1100InfoRec(item, attrObj.saleInfo);
			var approveLimitDate = item.approveLimitDate;

			var attr = attrObj.attr;

			if (ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_APPLY || ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_EDIT) {
				// 追加発注の場合、検索時の発注件数よりも増えてなければならない
				//var orgLen = this.orderHeadList.length;
				var newLen = orderObj.orderHeadList.length;
				if (newLen == 0) {
					this.validator.setErrorHeader(clutil.getclmsg(clmsg.EMS0154));
					return null;
				}
			}

			var f_spc = 0;
			var spc_id = Number(clcom.getSysparam("PAR_AMMS_ITEMATTRGRPFUNC_ID_ITEM_SPC"));	// シスパラからSPC不可IDを取得

			itgrp = $("#ca_itgrpID").autocomplete('clAutocompleteItem');
			itgrpID = itgrp.id;

			//			itgrpCode = itgrp.code
			// 品種が以下のものはSPC不可が必須登録項目
//			if ((opeTypeId != OpeType.AMMSV1100_OPETYPE_TMP_SAVE) &&
//				(itgrpCode == '01' || // AOKI	スーツ
//				itgrpCode == '04' || //			フォーマル
//				itgrpCode == '07' || //			スラックス
//				itgrpCode == '15' || //			Ｌパンツ
//				itgrpCode == '27' || //			ＣＹスラックス
//				itgrpCode == '41' || // ORIHICA	スーツ
//				itgrpCode == '44' || //			フォーマル
//				itgrpCode == '47' || //			スラックス
//				itgrpCode == '55' || //			Ｌパンツ
//				itgrpCode == '67')) { //			ＣＹ・スラックス

			// 品種がシスパラに登録されているならば必須登録項目
			// タグ発行申請時、最終申請時のみ、チェックを行う。
			if (((opeTypeId == OpeType.AMMSV1100_OPETYPE_TAG_APPLY) ||
				(opeTypeId == OpeType.AMMSV1100_OPETYPE_LAST_APPLY)) &&
					_.indexOf(this.scpitgrp_array, itgrpID) != -1) {

				for (var i = 0; i < attrAnyList.length; i++) {
					if (attrAnyList[i].iagfuncID == spc_id) {
						f_spc = 1;
						break;
					}
				}
				if (f_spc == 0) {
					var $select=$('input[name="ca_iagfuncID"][value="1003"]').parent().children('select');
					this.validator.setErrorHeader(clmsg.EMS0167);
					this.validator.setErrorMsg($select, "入力してください。");
					return null;
				}
			}

//			var ope_id = 0;
//
//			// 処理区分
//			switch (opeTypeId) {
//			case OpeType.AMMSV1100_OPETYPE_TMP_SAVE:
//				ope_id = am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE;	// 一時保存
//				break;
//			case OpeType.AMMSV1100_OPETYPE_TAG_APPLY:
//			case OpeType.AMMSV1100_OPETYPE_LAST_APPLY:
//				ope_id = am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY;		// 申請
//				break;
//			case OpeType.AMMSV1100_OPETYPE_TAG_RETURN:
//			case OpeType.AMMSV1100_OPETYPE_LAST_RETURN:
//				ope_id = am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK;	// 差戻し
//				break;
//			case OpeType.AMMSV1100_OPETYPE_TAG_APPROVE:
//			case OpeType.AMMSV1100_OPETYPE_LAST_APPROVE:
//				ope_id = am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL;	// 承認
//				break;
//			default:
//				ope_id = opeTypeId;
//				break;
//			}

			var ope = this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY
						? am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
						: this.opeTypeId;
			var srchReapproveTypeID = this.reapproveTypeID;
			var srchApproveTypeID = this.itemApproveTypeID;

			if (confirm != null) {
				confirm += '<br>' + 'よろしいですか。';
			}

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: ope,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
				AMMSV0100GetReq: {
				},
				// 商品分類マスタ更新リクエスト
				AMMSV0100UpdReq: {
					item: item,
					citemList: colorObj.citemList,
					csitemList: sizeObj.csitemList,
					attr: attr,
					attrAnyList: attrAnyList,
					tgtColorList: colorObj.tgtColorList,
					tgtSizeList: sizeObj.tgtSizeList,
					tgtStoreList: tgtStoreList,
					price: price,
					priceOrgList: priceOrgList,
					materialList: materialList,
					modelNoList: modelNoList,
					specList: specList,
					photoList: photoList,
					costDtlList: costDtlList,
					orderHeadList: orderObj.orderHeadList,
					orderDtlList: orderObj.orderDtlList,
					commentList: commentList,
					info: info,
					approveLimitDate: approveLimitDate,
					ptnNo: ptnNo,
					srchReapproveTypeID: srchReapproveTypeID,
					srchApproveTypeID: srchApproveTypeID,
				},
				AMMSV0100FormatGetReq: {
				},
				AMMSV0100SizeGetReq:{
				},
				AMMSV0100TagAddrGetReq:{
				},
				AMMSV0100PriceHistGetReq:{
				},
				AMMSV0100SizeGetReq:{
				},
			};
			return {
				resId: clcom.pageId,
				data:  updReq,
				confirm: confirm,
			};
		},

		/**
		 * AMMSV1100Recを作成
		 * @returns {___ca_item1}
		 */
		_buildUpdReqAMMSV1100Rec: function() {
			var ca_req = clutil.view2data($("#ca_req"));
			var ca_item = clutil.view2data($("#ca_item"));
			ca_item = _.extend(ca_item, ca_req);

			var ca_colorSizeInfo = clutil.view2data($("#ca_colorSizeInfo"));
			var ca_year = clutil.view2data($("#ca_year").parent());
			ca_item = _.extend(ca_item, {
				year: ca_year.year,
				sizePtnID: ca_colorSizeInfo.sizePtnID,
			});

			return ca_item;
		},

		/**
		 * 商品展開カラーレコード（更新用）の作成
		 * @param item
		 * @returns {Array}
		 */
		_buildUpdReqAMMSV1100TgtColorList: function(item) {
			var tgtColorList = [];
			var citemList = [];
			var additem = {
				fromDate: item.fromDate,
				toDate: item.toDate,
				id: item.id,
			};

			$.each($('div[name="div_color"]'), function() {
				var $div_color = $(this);
				var groupNo = $div_color.attr('groupno');
				var $tbody = $div_color.find('tbody[name="ca_table_color_tbody"]');
				var data = clutil.tableview2data($tbody.children('tr'));
				$.each(data, function() {
					if (this.colorID != 0) {
						var tgtColor = _.extend({
							tgtColorID: this.colorID,
							groupNo: groupNo
						}, additem);
						tgtColorList.push(tgtColor);

						var citem = _.extend({
							citemID: this.citemID,
							colorID: this.colorID,
							makerColor: this.makerColor,
							designColorID: this.designColorID,
						}, additem);
						citemList.push(citem);
					}
				});
			});
			return {
				tgtColorList: tgtColorList,
				citemList: citemList
			};
		},

		/**
		 * 商品展開サイズレコードの作成
		 * @param item
		 * @param tgtColorList
		 * @returns {___anonymous74176_74242}
		 */
		_buildUpdReqAMMSV1100TgtSizeList: function(item, tgtColorList) {
			var _this = this;
			var tgtSizeList = [];
			var csitemList = [];
			var additem = {
				fromDate: item.fromDate,
				toDate: item.toDate,
				id: item.id,
			};

			var gno2tgtColorMap ={};

			$.each(tgtColorList, function() {
				if (gno2tgtColorMap[this.groupNo] == null) {
					gno2tgtColorMap[this.groupNo] = [];
				}
				gno2tgtColorMap[this.groupNo].push(this);
			});

			var orgCSItemMap = {};

			if (_this.csitemList != null) {
				$.each(_this.csitemList, function() {
					if (orgCSItemMap[this.janColorID] == null) {
						orgCSItemMap[this.janColorID] = {};
					}
					orgCSItemMap[this.janColorID][this.janSizeID] = this;
				});
			}

			/*
			 * div_colorsize_listでループ
			 * ca_table_sizeでtgtSizeを取得
			 * ca_table_color分コピー
			 * tgtSizeListにpush()
			 */
			$.each($('div[name="div_colorsize_list"]'), function() {
				var $div_colorsize_list = $(this);
				var $div_color = $div_colorsize_list.find('div[name="div_color"]');
				var groupNo = $div_color.attr('groupno');
				var $tbody_color = $div_color.find('tbody[name="ca_table_color_tbody"]');

				var $div_size = $div_colorsize_list.find('div[name="div_size"]');
				var $tbody_size = $div_size.find('tbody[name="ca_table_size_tbody"]');

				var $div_jan = $div_colorsize_list.find('div[name="div_jan"]');

				var tmpList = [];
				var csitemTmpList = [];
				$.each($tbody_size.find('input[name="select_col"]:checked'), function() {
					var $checkbox = $(this);
					var sizeID = $checkbox.attr('sizeID');
					var tgtSize = _.extend({
						groupNo: groupNo,
						tgtSizeID: sizeID,
					}, additem);
					tmpList.push(tgtSize);
					var csize = _.extend({
						janSizeID: sizeID,

					}, additem);
					csitemTmpList.push(csize);
				});
				$.each($tbody_color.children('tr'), function() {
					var $tr = $(this);
					var $select = $tr.find('select[name="ca_colorID"]');
					var colorID = $select.val();
					if (colorID == 0) {
						return;
					}
					$.each(tmpList, function() {
						var data = _.extend({ tgtColorID: colorID }, this);
						tgtSizeList.push(data);
					});

					$.each(csitemTmpList, function() {
						var sizeID = this.janSizeID;
						var csitemID = 0;
						var janCode = "";

						if (orgCSItemMap[colorID] != null && orgCSItemMap[colorID][sizeID] != null) {
							csitemID = orgCSItemMap[colorID][sizeID].csitemID;
							janCode = orgCSItemMap[colorID][sizeID].janCode;
						}

						var data = _.extend({
							csitemID: csitemID,
							janColorID: colorID,
							janSizeID: sizeID,
							janCode: janCode,
						}, this);
						csitemList.push(data);
					});
				});

				if ($("#ca_inputJanFlag").prop("checked")) {
					var $tbody_jan = $div_jan.find('tbody[name="ca_table_jan_tbody"]');
					$.each($tbody_jan.find('input[name="ca_janCode"]'), function() {
						var $input = $(this);
						var colorID = $input.attr('colorID');
						var sizeID = $input.attr('sizeID');
						var janCode = $input.val();

						$.each(csitemList, function() {
							if (this.janColorID == colorID && this.janSizeID == sizeID) {
								this.janCode = janCode;
								return false;
							}
						});
					});
				}
			});

			return {
				tgtSizeList: tgtSizeList,
				csitemList: csitemList,
			};
		},

		/**
		 * 商品属性マスタ(基本)レコード作成
		 * @param item
		 * @returns {___anonymous76331_76460}
		 */
		_buildUpdReqAMMSV1100AttrRec: function(item) {
			var orderInfo = clutil.view2data($("#ca_orderInfo"));
			var tagInfo = clutil.view2data($("#ca_tagInfo"));
			var saleInfo = clutil.view2data($("#ca_saleInfo"));
			var commentInfo = clutil.view2data($("#ca_commentInfo"));

			var fixedFormTag1Code = tagInfo.fixedFormTag1Code == null ? "" : tagInfo.fixedFormTag1Code;
			var fixedFormTag2Code = tagInfo.fixedFormTag2Code == null ? "" : tagInfo.fixedFormTag2Code;

			var tagTypeID = 0, tagType2ID = 0;
			if (_.isArray(tagInfo.tagTypeID)) {
				if (tagInfo.tagTypeID[0]) {
					tagTypeID = Number(tagInfo.tagTypeID[0]);
				}
				if (tagInfo.tagTypeID[1]) {
					tagType2ID = Number(tagInfo.tagTypeID[1]);
				}
			}
			var attr = {
				fromDate: item.fromDate,
				toDate: item.toDate,
				id: item.id,
				seasonID: item.seasonID,
				subSeasonID: item.subSeasonID,
				usetypeID: item.usetypeID,
				itemTypeID: item.itemTypeID,
				kiTypeID: orderInfo.kiTypeID,
				tagIssueFlag: tagInfo.tagIssueFlag,
				tagIssueID: tagInfo.tagIssueID,
				tagTypeID: tagTypeID,
				tagType2ID: tagType2ID,
				fixedFormTag1Code: fixedFormTag1Code,
				fixedFormTag2Code: fixedFormTag2Code,
				itoloxID: tagInfo.itoloxID,
				tagHighlight: tagInfo.tagHighlight,
				importID: orderInfo.importID,
				tagImportID: tagInfo.tagImportID,
				subcls1ID: item.subcls1ID,
				subcls2ID: item.subcls2ID,
				brandID: item.brandID,
				styleID: item.styleID,
				designID: item.designID,
				subDesignID: item.subDesignID,
				//designColorID: item.designColorID,
				materialID: item.materialID,
				materialText: item.materialText,
				factoryID: orderInfo.factoryID,
				tmpClothCode: item.tmpClothCode,
				clothCode: item.clothCode,
				clothMaker: item.clothMaker,
				quality: item.quality,
				clothOrderDate: item.clothOrderDate,
				clothDlvDate: item.clothDlvDate,
				salesPoint: commentInfo.salesPoint,
				specCommentID: item.specCommentID,
				specComment: item.specComment,
				memoForStore: commentInfo.memoForStore,
				centerID: orderInfo.centerID,
				dlvroute1TypeID: orderInfo.dlvroute1TypeID,
				dlvroute2TypeID: orderInfo.dlvroute2TypeID,
				lotCount: orderInfo.lotCount,
				salesStartDate: saleInfo.salesStartDate,
				salesEndDate: saleInfo.salesEndDate,
				selloutYear: saleInfo.selloutYear,
				selloutSeasonID: saleInfo.selloutSeasonID,
				orderFlag: item.orderFlag,
				limitFlag: saleInfo.limitFlag,
				inputJanFlag: item.inputJanFlag,
				centerStockFlag: item.centerStockFlag,
				setupFlag: saleInfo.setupFlag,
			};
			return {
				attr: attr,
				orderInfo: orderInfo,
				tagInfo: tagInfo,
				saleInfo: saleInfo,
				commentInfo: commentInfo,
			};
		},

		/**
		 * 商品属性マスタ(任意)レコードの作成
		 * @param item 商品
		 * @returns {Array}
		 */
		_buildUpdReqAMMSV1100AttrAnyList: function(item) {
			var $any_info = $("#any_info");
			var attrAnyList = [];
			var additem = {
				fromDate: item.fromDate,
				toDate: item.toDate,
				id: item.id,
			};

			$.each($any_info.find('div[name="div_any"]'), function() {
				var $div = $(this);
				var $select = $div.find('select.ca_iagID');
				var $input = $div.find('input[name="ca_iagfuncID"]');

				var iagfuncID = $input.val();
				var iagID = $select.val();
				iagID = iagID == null ? 0 : iagID;

				var any = _.extend({
					iagfuncID: iagfuncID,
					iagID: iagID,
				}, additem);
				if (any.iagID > 0) {
					attrAnyList.push(any);
				}
			});

			return attrAnyList;
		},

		/**
		 * 商品展開店舗レコードの作成
		 * @param item
		 * @param saleInfo
		 * @returns {Array}
		 */
		_buildUpdReqAMMSV1100TgtStoreList: function(item, saleInfo) {
			var tgtStoreList = [];
			var additem = {
				fromDate: item.fromDate,
				toDate: item.toDate,
				id: item.id,
			};

			if (saleInfo.limitFlag) {
				var list = clutil.tableview2data($("#ca_table_tgt_tbody tr"));
				$.each(list, function() {
					if (this.tgtOrgID != null && this.tgtOrgID != 0) {
						var data = _.extend(this, additem);
						tgtStoreList.push(data);
					}
				});
			}
			return tgtStoreList;
		},

		/**
		 * 商品価格レコードの作成
		 * @param item 商品マスタレコード
		 * @param saleInfo 販売情報
		 * @returns
		 */
		_buildUpdReqAMMSV1100PriceRec: function(item, saleInfo) {
			var costInfo = clutil.view2data($("#ca_costInfo"));
			var maker = $("#ca_makerID").autocomplete('clAutocompleteItem');
			var maker_id = 0;
			if (maker && maker.id) {
				maker_id = maker.id;
			}
			var taxrt = this.getTaxRate(maker_id, clcom.getOpeDate());
			var cost = parseInt(costInfo.cost);
			costInfo.costIntax = clutil.mergeTax(cost, taxrt);
			var additem = {
				fromDate: item.fromDate,
				toDate: item.toDate,
				id: item.id,
			};

			var price = _.extend({
				price: saleInfo.price,
				priceIntax: saleInfo.priceIntax,
				cost: cost,
				costIntax: costInfo.costIntax.withTax,
				exchangeRate: costInfo.exchangeRate,
				currencyID: costInfo.currencyID,
			}, additem);

			return price;
		},

		/**
		 * 商品組織別価格レコードの作成
		 * @param item 商品マスタレコード
		 * @returns {Array}
		 */
		_buildUpdReqAMMSV1100PriceOrgList: function(item) {
			var additem = {
				fromDate: item.fromDate,
				toDate: item.toDate,
				id: item.id,
			};
			var zoneList = clutil.tableview2data($("#ca_table_price_zone_tbody tr"));
			var storeList = clutil.tableview2data($("#ca_table_price_store_tbody tr"));

			var priceOrgList = [];
			$.each(zoneList, function() {
				if (this.orgID != null && this.orgID != 0) {
					var data = _.extend(this, additem);
					priceOrgList.push(data);
				}
			});
			$.each(storeList, function() {
				if (this.orgID != null && this.orgID != 0) {
					var data = _.extend(this, additem);
					priceOrgList.push(data);
				}
			});

			return priceOrgList;
		},

		/**
		 * 商品素材レコードの作成
		 * @param item
		 * @returns {Array}
		 */
		_buildUpdReqAMMSV1100MaterialList: function(item) {
			var additem = {
				fromDate: item.fromDate,
				toDate: item.toDate,
				id: item.id,
			};
			var list = clutil.tableview2data($("#ca_table_material_tbody tr"));
			var materialList = [];
			var tagSeq = 0;
			_.each(list, _.bind(function(o) {
				if (o.placeID == 0 && o.tagMaterialID == 0 && o.materialRatio == "" && o.tagManual == "") {
					return;
				}
				tagSeq++;
				var data = _.extend(o, additem);
				data.tagSeq = tagSeq;
				materialList.push(data);
			}, this));

			return materialList;
		},

		/**
		 * 商品型番レコードの作成
		 * @param item
		 * @returns {Array}
		 */
		_buildUpdReqAMMSV1100ModelNoList: function(item) {
			var additem = {
				fromDate: item.fromDate,
				toDate: item.toDate,
				id: item.id,
			};
			var list = clutil.tableview2data($("#ca_table_modelno_tbody tr"));
			var modelnoSeq = 0;
			var modelnoList = [];
			_.each(list, _.bind(function(mno) {
				var placeID = Number(mno.modelnoPlaceID);
				var modelno = mno.modelno;
				if (placeID == 0 && modelno == "") {
					// 空行は更新データに含めない
					return;
				}
				modelnoSeq++;
				var data = _.extend(mno, additem);
				data.modelnoSeq = modelnoSeq;
				modelnoList.push(data);
			}, this));

			return modelnoList;
		},

		/**
		 * 商品仕様レコードの作成
		 * @param item
		 * @returns {Array}
		 */
		_buildUpdReqAMMSV1100SpecList: function(item) {
			var additem = {
				fromDate: item.fromDate,
				toDate: item.toDate,
				id: item.id,
			};
			var list = clutil.tableview2data($("#ca_table_spec_tbody tr"));
			var specSeq = 0;
			var specList = [];
			$.each(list, function() {
				specSeq++;
				var data = _.extend(this, additem);
				data.specSeq = specSeq;
				if (data.specID == null) {
					data.specID = 0;
				}
				specList.push(data);
			});

			return specList;
		},

		/**
		 * 商品画像レコードの作成
		 * @param item
		 * @returns
		 */
		_buildUpdReqAMMSV1100PhotoList: function(item) {
			var additem = {
				fromDate: item.fromDate,
				toDate: item.toDate,
				id: item.id,
			};
			var list = [];
			$.each(this.photoList, function() {
				var rec = _.extend(this, additem);
				list.push(rec);
			});
			return list;
		},

		/**
		 * 商品原価明細レコードの作成
		 * @param item
		 * @returns {Array}
		 */
		_buildUpdReqAMMSV1100CostDtlList: function(item) {
			var additem = {
				fromDate: item.fromDate,
				toDate: item.toDate,
				id: item.id,
			};
			var list = clutil.tableview2data($("#ca_table_cost_in_tbody tr"));
			var costSeq = 0;
			var costDtlList = [];
			$.each(list, function() {
				costSeq++;
				var data = _.extend(this, additem);
				data.costSeq = costSeq;
				costDtlList.push(data);
			});

			return costDtlList;
		},

		/**
		 * 商品発注ヘッダレコード、商品発注明細レコードの作成
		 * @param item
		 * @returns {Array}
		 */
		_buildUpdReqAMMSV1100OrderHeadList: function(item, colorObj, sizeObj) {
			var tgtColorList = colorObj.tgtColorList;
			var tgtColorMap = {};

			var csitemList = sizeObj.csitemList;
			var csitemMap = {};

			$.each(tgtColorList, function() {
				var tgtColor = this;
				if (tgtColorMap[tgtColor.groupNo] == null) {
					tgtColorMap[tgtColor.groupNo] = [];
				}
				tgtColorMap[tgtColor.groupNo].push(tgtColor);
			});
			$.each(csitemList, function() {
				var csitem = this;
				var cID = csitem.janColorID;
				var sID = csitem.janSizeID;
				if (csitemMap[cID] == null) {
					csitemMap[cID] = {};
				}
				csitemMap[cID][sID] = csitem;
			});

			var orderHeadList = [];
			var orderDtlList = [];
			var additem = {
				fromDate: item.fromDate,
				toDate: item.toDate,
				id: item.id,
			};
			var $div_orderInfo = $('div[name="div_order_info"]');
			var $div_orderList = $div_orderInfo.find('div[name="div_order_info_list"]');
			$.each($div_orderList, function() {
				var $div = $(this);
				var orderSeq = $div.attr('count');
				var orderTgtTypeID = $div.find('select[name0="ca_orderTgtTypeID"]').val();
				var orderDate = $div.find('input[name0="ca_orderDate"]').val();
				orderDate = clutil.dateFormat(orderDate, 'yyyymmdd');
				var centerDlvDate = $div.find('input[name0="ca_centerDlvDate"]').val();
				centerDlvDate = clutil.dateFormat(centerDlvDate, 'yyyymmdd');
				var dlvDate = $div.find('input[name0="ca_dlvDate"]').val();
				dlvDate = clutil.dateFormat(dlvDate, 'yyyymmdd');
				var finishDate = $div.find('input[name0="ca_finishDate"]').val();
				finishDate = clutil.dateFormat(finishDate, 'yyyymmdd');
				var orderNo = $div.find('input[name0="ca_orderNo"]').val();
// ここでorderNoが0になっているのでカットする(入力項目じゃないし) #20140922
//console.log("DEBUG1: orderNo[" + orderNo + "]");
//				orderNo = _.isNumber(orderNo) ? orderNo : 0;
//console.log("DEBUG2: orderNo[" + orderNo + "]");
				var tagIncRate = $div.find('input[name0="ca_tagIncRate"]').val();
				var tagaddrNo = $div.find('select[name0="ca_tagaddrNo"]').val();
				tagaddrNo = tagaddrNo == null ? 0 : tagaddrNo;
				var cancelFlag = $div.find('input[name0="ca_cancelFlag"]').prop('checked') ? 1 : 0;

				var data = _.extend({
					orderSeq: orderSeq,
					orderTgtTypeID: orderTgtTypeID,
					orderDate: orderDate,
					centerDlvDate: centerDlvDate,
					dlvDate: dlvDate,
					finishDate: finishDate,
					orderDate: orderDate,
					orderNo: orderNo,
					tagIncRate: tagIncRate,
					tagaddrNo: tagaddrNo,
					cancelFlag: cancelFlag,
				}, additem);
				orderHeadList.push(data);

				var $div_table = $div.find('div[name="div_order_table"]');
				$.each($div_table.find('table[name="ca_table_order"]'), function() {
					var $table = $(this);
					var $tbody = $table.children('tbody[name="ca_table_order_tbody"]');
					var groupNo = $table.attr('groupNo');
					// グループNoからtgtColorを取得（colorIDのリスト）
					//var tclist = tgtColorMap[groupNo];

					$.each($tbody.find('tr'), function() {
						var $tr = $(this);
						var colorID = $tr.attr('colorID');

						$.each($tr.find('input[name="ca_orderQy"]'), function() {
							var $input = $(this);
							var $td = $input.parents('td');
							var sizeID = $td.attr('sizeID');
							var orderQy = $input.val().split(',').join('');

							var csitemID = 0;
							if (csitemMap[colorID] != null && csitemMap[colorID][sizeID] != null) {
								csitemID = csitemMap[colorID][sizeID].csitemID;
							}
							csitemID = csitemID == null ? 0 : csitemID;

							var data2 = _.extend({
								orderSeq: orderSeq,
								orderColorID: colorID,
								orderSizeID: sizeID,
								csitemID: csitemID,
								orderQy: orderQy,
							}, additem);
							orderDtlList.push(data2);
						});
					});
				});
			});

			return {
				orderHeadList: orderHeadList,
				orderDtlList: orderDtlList,
			};
		},

		/**
		 * 商品差戻しコメントレコードの作成
		 * @param item
		 * @param commentInfo
		 * @returns {Array}
		 */
		_buildUpdReqAMMSV1100CommentList: function(item) {
			var data = clutil.view2data($("#ca_coomentListInfo"));
			var commentList = [];

			data.id = item.id;
			commentList.push(data);

			return commentList;
		},

		/**
		 * その他商品情報レコードの作成
		 * @param item
		 * @param saleInfo
		 * @returns {___anonymous85814_85872}
		 */
		_buildUpdReqAMMSV1100InfoRec: function(item) {
			var bundleID = $("#ca_bundleID").val();
			var info = {
				id: item.id,
				bundleID: bundleID,
			};

			return info;
		},

		/**
		 * 決定ボタン押下イベント（新規作成の場合）
		 * @param e
		 */
		_onSrchClickByNew: function(e) {
			// 1.条件取得
			var reqdata = clutil.view2data($("#ca_req"));

			var req = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
				AMMSV0100GetReq: {
				},
				// 商品分類マスタ更新リクエスト
				AMMSV0100UpdReq: {
				},
				AMMSV0100FormatGetReq: {
					srchItgrpID: reqdata.itgrpID,
					srchDate: clcom.getOpeDate(),
				},
				AMMSV0100SizeGetReq:{
				},
				AMMSV0100TagAddrGetReq:{
				},
				AMMSV0100PriceHistGetReq:{
				},
				AMMSV0100SizeGetReq:{
				},
			};
			var uri = "AMMSV1100";

			// 2.リクエスト発行
			clutil.postJSON(uri, req).done(_.bind(function(data) {
				// 正常終了

				var args = {
					status: 'OK',
					data: data,
				};
				this._onFormatGetCompleted(args, e);
			}, this)).fail(_.bind(function(data) {
				// エラー終了
				clutil.mediator.trigger('onTicker', data.rspHead);
			}, this));
		},

		/**
		 * 決定ボタン押下イベント
		 * @param e
		 */
		_onSrchClick: function(e) {
			/*
			 * 1.条件取得
			 * 2.リクエスト発行
			 * 3.条件部Readonly
			 * 4.メイン部編集可
			 */
			// validatorエラー時の表示領域
			var validator = clutil.validator(this.$('#ca_req'), {
				echoback		: $('.cl_echoback')
			});

			if (!validator.valid()) {
				return;
			}
			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// 新規作成の場合
				return this._onSrchClickByNew(e);
			} else {
				// それ以外は、上部を編集不可にして下部を編集可にする
				var mode = this.getReadonlyMode();

				this.setReadonly_req(1);
				this.setReadonly_item(mode);
				this.setReadonly_tagInfo(mode);
				this.setReadonly_colorSizeInfo(mode);
				this.setReadonly_orderInfo(mode);
				this.setReadonly_costInfo(mode);
				this.setReadonly_comment(mode);
				this.setReadonly_saleInfo(mode);
				this.setReadonly_anyAttrInfo(mode);
				this.setReadonly_commentListInfo(mode);

				var tagApproveTypeID = this.infoRec != null ? this.infoRec.tagApproveTypeID : 0;
				var approveTypeID = this.infoRec != null ? this.infoRec.approveTypeID : 0;
				var approveCount = this.infoRec != null ? this.infoRec.approveCount : 0;

				if (approveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE) {
					// 最終承認後の入力可・不可
					//this.lastApprovalInputControl(this.infoRec);
				} else if (tagApproveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE) {
					// タグ発行承認後の入力可・不可
					this.tagApprovalInputControl(this.infoRec);
					// 素材イベントを出す
					$("#ca_materialID").trigger('change');
					// シーズン変更イベント
					$("#ca_seasonID").trigger('change');
				} else {
					// 素材イベントを出す
					$("#ca_materialID").trigger('change');
					// シーズン変更イベント
					$("#ca_seasonID").trigger('change');
				}
				// 画像確認を可能にする
				$("#mainPicHover").removeClass('notDialog');
				// 糸LOX
				$("#ca_unitID").trigger('change');

				// タグ発行
				if (!$("#ca_tagIssueFlag").attr('disabled')) {
					$("#ca_tagIssueFlag").trigger('change');
				}

				var editTypeID = Number($("#ca_editTypeID").val());
				if (editTypeID == amcm_type.AMCM_VAL_ITEM_EDIT_UPD) {
					// 承認期限日を任意に
					$("#div_ca_approveLimitDate").removeClass('required');
					$("#ca_approveLimitDate").removeClass('cl_required');
				} else {
					// 承認期限日を必須に
					$("#div_ca_approveLimitDate").addClass('required');
					$("#ca_approveLimitDate").addClass('cl_required');
				}
			}
			// 処理区分
			var ope_id = this.opeTypeId;
			// タグ発行承認区分ID
			var tagApproveTypeID = this.infoRec != null ? this.infoRec.tagApproveTypeID : 0;
			// 最終承認区分ID
			var approveTypeID = this.infoRec != null ? this.infoRec.approveTypeID : 0;
			// 承認回数
			var approveCount = this.infoRec != null ? this.infoRec.approveCount : 0;
			// 編集内容
			var editTypeID = $("#ca_editTypeID").val();
			// 遷移元画面
			var srcId = clcom.srcId;

			var opt = {
				opeTypeId: ope_id,
				tagApproveTypeID: tagApproveTypeID,
				approveTypeID: approveTypeID,
				approveCount: approveCount,
				editTypeID: editTypeID,
				srcId: srcId,
			};
			this.setFooterButtons(opt);

			var centerID = $("#ca_centerID").val();
			console.log("3:centerID=" + centerID);
		},

		/**
		 * 素材変更イベント
		 * @param e
		 */
		_onMaterialIDChange: function(e) {
			var $tgt = $(e.target);
			var text = $tgt.find('option:selected').text();
			var code = '';
			var readonly = true;

			if (text != null) {
				code = text.split(':')[0];
				if (code == MATERIAL_CODE_OTHER) {
					// 素材手入力欄を入力可
					clutil.inputRemoveReadonly($("#ca_materialText"));
					readonly = false;
				}
			}
			if (readonly) {
				// 素材手入力欄を入力不可に（内容も削除）
				$("#ca_materialText").val('');
				clutil.inputReadonly($("#ca_materialText"));
			}
		},

		/**
		 * 素材詳細テーブル：部位変更イベント
		 * @param e
		 */
		_onPlaceChange: function(e) {
			/*
			 * 部位がフリー入力の場合は、素材・％をぶち抜きで素材手書き入力にする
			 */
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');
			var $td_tagMaterialID = $tr.children('td[name="td_tagMaterialID"]');
			var $td_materialRatio = $tr.children('td[name="td_materialRatio"]');
			var $td_tagMaterial = $tr.children('td[name="td_tagMaterial"]');
			var $ca_tagMaterialID = $td_tagMaterialID.find('select[name="ca_tagMaterialID"]');
			var $ca_materialRatio = $td_materialRatio.find('input[name="ca_materialRatio"]');
			var $ca_tagMaterial = $td_tagMaterial.find('input[name="ca_tagMaterial"]');

			var val = $tgt.val();
			if (val == 32767) {	// TODO 実際の値を確認
				/*
				 * フリー入力
				 */
				// 素材と％をクリア
				$ca_tagMaterialID.selectpicker('val', 0);
				$ca_materialRatio.val("");

				// 素材と％を非表示
				$td_tagMaterialID.hide();
				$td_materialRatio.hide();
				// 素材手入力を表示し、ぶち抜きにする
				$td_tagMaterial.show();
				$td_tagMaterial.attr('colspan', '2');
			} else {
				/*
				 * フリー入力以外
				 */
				// 素材手入力をクリア
				$ca_tagMaterial.val('');

				// 素材手入力を非表示＆ぶち抜きを解除
				$td_tagMaterial.hide();
				$td_tagMaterial.removeAttr('colspan');

				// 素材と％を表示
				$td_tagMaterialID.show();
				$td_materialRatio.show();
			}
		},

		/**
		 * 素材詳細テーブル：素材変更イベント
		 * @param e
		 */
		_onTagMaterialChange: function(e) {
			/*
			 * 素材がフリー入力の場合は、％を素材手書に変更する
			 */
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');
			var $td_materialRatio = $tr.children('td[name="td_materialRatio"]');
			var $td_tagMaterial = $tr.children('td[name="td_tagMaterial"]');
			var $ca_materialRatio = $td_materialRatio.find('input[name="ca_materialRatio"]');
			var $ca_tagMaterial = $td_tagMaterial.find('input[name="ca_tagMaterial"]');

			var val = $tgt.val();
			if (val == 32767) {	// TODO 実際の値を確認
				/*
				 * フリー入力
				 */
				// ％をクリア
				$ca_materialRatio.val("");

				// ％を非表示
				$td_materialRatio.hide();
				// 素材手入力を表示する。ぶち抜きは解除
				$td_tagMaterial.show();
				$td_tagMaterial.removeAttr('colspan');
			} else {
				/*
				 * フリー入力以外
				 */
				// 素材手入力をクリア
				$ca_tagMaterial.val('');

				// 素材手入力を非表示＆ぶち抜きを解除
				$td_tagMaterial.hide();
				$td_tagMaterial.removeAttr('colspan');

				// 素材と％を表示
				$td_materialRatio.show();
			}
		},

		/**
		 * JAN手入力変更イベント
		 * @param e
		 */
		_onInputJanFlagChange: function(e) {
			var $tgt = $(e.target);

			/*
			 * JAN手入力がチェックされたら、カラー・サイズ展開のJANコードテーブルを表示する
			 *            アンチェックされたら、カラー・サイズ展開のJANコードテーブルを非表示する
			 */
			var $div_jan = $('div[name="div_jan"]');

			if ($tgt.prop('checked')) {
				// チェック
				$div_jan.show();
			} else {
				// アンチェック
				$div_jan.hide();
			}
		},

		/**
		 * 仕入無しフラグ変更イベント
		 * @param e
		 */
		_onOrderFlagChange: function(e) {
			var $tgt = $(e.target);

//			var f_order = $("ca_orderFlag").prop('checked') ? 1 : 0;
			var $div = $('div[name="div_order_info_list"]:last');
			var $div_dlvDate = $div.find('div[name="div_ca_dlvDate"]');
			var $ca_dlvDate = $div.find('input[name0="ca_dlvDate"]');
			var $div_tagIncRate = $div.find('div[name="div_ca_tagIncRate"]');
			var $ca_tagIncRate = $div.find('input[name0="ca_tagIncRatee"]');
			var $div_orderTgtType = $div.find('div[name0="div_ca_orderTgtTypeID"]');
			var $ca_orderTgtType = $div.find('select[name0="ca_orderTgtTypeID"]');

			if ($tgt.prop('checked')) {

				// タグ発行はオフにする
				$("#ca_tagIssueFlag").attr('checked', false).closest("label").removeClass("checked");
				// 商品区分は「定番」にする
				$("#ca_itemTypeID").selectpicker('val', amcm_type.AMCM_VAL_ITEM_REGULAR);
				// KI区分は「買取」にする
				$("#ca_kiTypeID").selectpicker('val', amcm_type.AMCM_VAL_KI_PURCHASE);
				// 生産国は「その他」
				$("#ca_importID").selectpicker('val', IMPORT_ID_OTHER);	// シスパラにすべきか？
				// 縫製工場は「その他」
				$("#ca_factoryID").selectpicker('val', FACTORY_ID_OTHER);	// シスパラにすべきか？


				// 仕入なしなので以下の項目を入力不可にする

				// タグ情報
				clutil.viewReadonly($("#ca_tagInfo"));

				// 発注情報
				clutil.viewReadonly($("#ca_orderInfo"));

				// 下代構成
				clutil.viewReadonly($("#cost_info"));

				// 商品区分
				clutil.viewReadonly($("#ca_itemTypeID").parent());

				/*
				 * 必須を落とす
				 */
				// 発注ロット単位数
				$("#div_ca_lotCount").removeClass('required');
				$("#ca_lotCount").removeClass('cl_required');
				// 納品形態（初回）
				$("#div_ca_dlvroute1TypeID").removeClass('required');
				$("#ca_dlvroute1TypeID").removeClass('cl_required');
				$("#ca_dlvroute1TypeID").selectpicker('refresh');
				// 納品形態（二回目以降）
				$("#div_ca_dlvroute2TypeID").removeClass('required');
				$("#ca_dlvroute2TypeID").removeClass('cl_required');
				$("#ca_dlvroute2TypeID").selectpicker('refresh');
				// 発注対象
				$div_orderTgtType.removeClass('required');
				$ca_orderTgtType.removeClass('cl_required');
				$ca_orderTgtType.selectpicker('refresh');
				// 製品仕上げ日
				$div.find('div[name0="div_ca_finishDate"]').removeClass('required');
				$div.find('input[name0="ca_finishDate"]').removeClass('cl_required');
				// 仕入予定日を任意にする
				$div_dlvDate.removeClass('required');
				$ca_dlvDate.removeClass('cl_required');
				// タグ増産率
				$div_tagIncRate.removeClass('required');
				$ca_tagIncRate.removeClass('cl_required');
			} else {
				// 仕入ありなので以下の項目を入力可にする

				// タグ情報
				clutil.viewRemoveReadonly($("#ca_tagInfo"));

				// 発注情報
				clutil.viewRemoveReadonly($("#ca_orderInfo"));
				// 発注日は入力不可（なんかいい方法ないかな？）
				clutil.inputReadonly($('input[name0="ca_orderDate"]'));

				// 商品区分
				clutil.viewRemoveReadonly($("#ca_itemTypeID").parent());

				// 下代構成
				clutil.viewRemoveReadonly($("#cost_info"));

				/*
				 * 必須
				 */
				// 発注ロット単位数
				$("#div_ca_lotCount").addClass('required');
				$("#ca_lotCount").addClass('cl_required');
				// 納品形態（初回）
				$("#div_ca_dlvroute1TypeID").addClass('required');
				$("#ca_dlvroute1TypeID").addClass('cl_required');
				$("#ca_dlvroute1TypeID").selectpicker('refresh');
				// 納品形態（二回目以降）
				$("#div_ca_dlvroute2TypeID").addClass('required');
				$("#ca_dlvroute2TypeID").addClass('cl_required');
				$("#ca_dlvroute2TypeID").selectpicker('refresh');
				// 発注対象
				$div_orderTgtType.addClass('required');
				$ca_orderTgtType.addClass('cl_required');
				$ca_orderTgtType.selectpicker('refresh');
				// 製品仕上げ日
				$div.find('div[name0="div_ca_finishDate"]').addClass('required');
				$div.find('input[name0="ca_finishDate"]').addClass('cl_required');
				// 仕入予定日を必須にする
				$div_dlvDate.addClass('required');
				$ca_dlvDate.addClass('cl_required');
				// タグ増産率
				$div_tagIncRate.addClass('required');
				$ca_tagIncRate.addClass('cl_required');
			}

			// タグ承認後の制御とかぶるので、そっちの処理を呼んでおく
			this.tagApprovalInputControl(this.infoRec);
		},

		/**
		 * シーズン変更イベント
		 * @param e
		 */
		_onSeasonChange: function(e) {
			/*
			 * シーズンが「オールシーズン」の場合は、サブシーズンを活性化する。
			 * それ以外の場合は、非活性化する
			 */
			var $season = $("#ca_seasonID");	// e.targetでいいけど・・・
			var $subseason = $("#ca_subSeasonID");	// こっちはこれでいいだろう
			var $div_subseason = $subseason.parent().parent();

			var seasonID = $season.val();
			if (seasonID == amcm_type.AMCM_VAL_SEASON_ALL) {
				// サブシーズンを活性化
				clutil.viewRemoveReadonly($div_subseason);
				// 必須に
				$div_subseason.addClass('requiredSelect');
				$subseason.addClass('cl_valid');
				$subseason.addClass('cl_required');
			} else {
				// サブシーズンを非活性化
				$subseason.selectpicker('val', 0);	// 未選択にしておく
				clutil.viewReadonly($div_subseason);

				$div_subseason.removeClass('requiredSelect');
				$subseason.removeClass('cl_valid');
				$subseason.removeClass('cl_required');
			}

			this.setDefaultYear();
		},

		_onSubSeasonChange: function(e) {
			this.setDefaultYear();
		},

		/**
		 * シーズンと販売開始日から商品展開年を自動設定する
		 */
		setDefaultYear: function() {
			var $season = $("#ca_seasonID");
			var seasonID = $season.val();
			seasonID = seasonID == null ? 0 : Number(seasonID);

			var $subSeason = $("#ca_subSeasonID");
			var subSeasonID = $subSeason.val();
			subSeasonID = subSeasonID == null ? 0 : Number(subSeasonID);

			var $salesStartDate = $("#ca_salesStartDate");
			var stdate = clutil.dateFormat($salesStartDate.val(), 'yyyymmdd');
			var year = Math.floor(stdate / 10000);	// 年
			stdate = stdate % 10000;	// 月日を取得

			switch (seasonID) {
			case amcm_type.AMCM_VAL_SEASON_SS:		// 春夏
			case amcm_type.AMCM_VAL_SEASON_SPRING:	// 春
			case amcm_type.AMCM_VAL_SEASON_SUMMER:	// 夏
				if (stdate >= 1001 && stdate <= 1231) {
					// 販売開始日が10/01～12/31の場合は、翌年
					year++;
				}
				break;
			case amcm_type.AMCM_VAL_SEASON_ALL:		// オールシーズン
				if (subSeasonID == amcm_type.AMCM_VAL_SUBSEASON_SS) {
					// サブシーズンが春夏
					if (stdate >= 1001 && stdate <= 1231) {
						// 販売開始日が10/01～12/31の場合は、翌年
						year++;
					}
				}
			default:
				break;
			}
			if (year != 0) {
				$("#ca_year").val(year);
			} else {
				$("#ca_year").val("");
			}
		},

		savedImportType: null,
		savedCostFormatType: null,

		/**
		 * 生産国変更イベント
		 * @param e
		 */
		_onImportChange: function(e) {
			/*
			 * 発注情報の「生産国」が海外の場合、下代構成の入力通貨と為替レートを表示する
			 */
			var $import = $(e.target);
			this._onImportChangeMain($import, true);
//			var text = $import.find('option:selected').text();
//			var code = '';
//
//			var importType = null;
//			if (text != null) {
//				code = text.split(':')[0];
//				if (code != IMPORT_CODE_JAPAN) {
//					// 日本以外なら通貨・為替レートを表示
//					$("#div_import_target").show();
//					importType = true;
//				} else {
//					// 日本なら通貨・為替レートを非表示
//					$("#div_import_target").hide();
//					importType = false;
//				}
//			}
//			if (this.savedImportType != importType
//					&& this.savedCostFormatType != amcm_type.AMCM_VAL_COSTFMT_COMMON) {
//				// 国内・海外のレベルで変更されたら下代構成を再描画
//				this.savedImportType == importType;
//				this.renderTableCostIn([], this.costFormatList);
//			}
		},

		_onImportChangeNoIvent: function() {
			var $import = $("#ca_importID");
			this._onImportChangeMain($import, false);
		},

		_onImportChangeMain: function($import, f_table) {
			var text = $import.find('option:selected').text();
			var code = '';

			var importType = null;
			if (text != null) {
				code = text.split(':')[0];
				if (code != IMPORT_CODE_JAPAN) {
					// 日本以外なら通貨・為替レートを表示
					$("#div_import_target").show();
					importType = true;
				} else {
					// 日本なら通貨・為替レートを非表示
					$("#div_import_target").hide();
					importType = false;
				}
			}
			if (f_table) {
				if (this.savedImportType != importType
						&& this.savedCostFormatType != amcm_type.AMCM_VAL_COSTFMT_COMMON) {
					// 国内・海外のレベルで変更されたら下代構成を再描画
					this.savedImportType = importType;
					this.renderTableCostIn([], this.costFormatList);
				}
			}
		},

		/**
		 * タグ発行フラグ変更イベント
		 * @param e
		 */
		_onTagIssueFlagChange: function(e) {
			/*
			 * OFF:タグ発行区分とタグ種別は入力不可。タグ確認も操作不可
			 * ON: タグ発行区分とタグ種別は必須。
			 */
			var $tgt = $(e.target);

			var $tagIssueID = $('#ca_tagIssueID');
			var $tagTypeID = $("#ca_tagTypeID");
			var $div_tagIssueID = $tagIssueID.parent().parent();
			var $div_tagTypeID = $tagTypeID.parent().parent();

			if ($tgt.prop('checked')) {
				// ON

				// タグ発行区分を必須に
				clutil.viewRemoveReadonly($div_tagIssueID);
				$div_tagIssueID.addClass('requiredSelect');
				$tagIssueID.addClass('cl_required');
				$tagIssueID.addClass('cl_valid');

				// タグ種別を必須に
				clutil.viewRemoveReadonly($div_tagTypeID);
				$div_tagTypeID.addClass('requiredSelect');
				$tagTypeID.addClass('cl_required');
				$tagTypeID.addClass('cl_valid');
			} else {
				// OFF

				// タグ発行区分を入力不可に
				clutil.viewReadonly($div_tagIssueID);
				$div_tagIssueID.removeClass('requiredSelect');
				$tagIssueID.removeClass('cl_required');
				$tagIssueID.removeClass('cl_valid');
				$tagIssueID.selectpicker('val', 0);	// 未選択状態に

				// タグ種別を入力不可に
				clutil.viewReadonly($div_tagTypeID);
				$div_tagTypeID.removeClass('requiredSelect');
				$tagTypeID.removeClass('cl_required');
				$tagTypeID.removeClass('cl_valid');
				$tagTypeID.selectpicker('val', 0);	// 未選択状態に
			}
		},

		// MD-3529 商品マスタ「タグ送付先」の入力制御変更_PGM開発：タグ送付先の必須設定制御
		/**
		 * タグ発行区分変更イベント
		 * @param e
		 */
		_onTagIssueIDChange: function(e) {
			/*
			 * タグ発行区分が「中国」のときは「タグ送付先」を必須にする
			 */
			this.setTagAddrNoRequired();

		},
		setTagAddrNoRequired: function() {
			var tagIssue = $("#ca_tagIssueID");
			var $tagaddrNo = $('select[name0="ca_tagaddrNo"]:last');
			var $div_tagaddrNo = $tagaddrNo.parent().parent();

			var tagIssueID = tagIssue.val();
			if (tagIssueID == amcm_type.AMCM_VAL_TAGISSUE_CHINA) {
				// タグ送付先：必須対象
				$div_tagaddrNo.addClass('required');
				$tagaddrNo.addClass('cl_valid');
				$tagaddrNo.addClass('cl_required');

			} else {
				// タグ送付先：必須除外
				$div_tagaddrNo.removeClass('required');
				$tagaddrNo.removeClass('cl_valid');
				$tagaddrNo.removeClass('cl_required');
			}
		},

		/**
		 * タグ種別変更イベント
		 * @param e
		 */
		_onTagTypeChange: function(e) {
			/*
			 * タグ種別が設定されたら、それに対応した項目にタグマークを付与する。
			 */
			var $tgt = $(e.target);

			// まず現在付与されているタグマークを削除する
			$('.tag').removeClass('tag');

			var tagTypeID = $tgt.val();
			if (_.isArray(tagTypeID)) {
				tagTypeID = _.first(tagTypeID);
			}
			if (TagType[tagTypeID] != null) {
				var array = TagType[tagTypeID];
				var length = array.length;
				for (var i = 0; i < length; i++) {
					var view = array[i];
					$(view).addClass('tag');
				};
			}
		},

		_onExpandClick: function($tgt, $info) {
			$info.slideToggle();
			var span = $tgt.find('span');
			$(span).fadeToggle();

			$info.css('overflow', 'inherit');
		},
		/**
		 * 生地情報入力部クリックインベント
		 * @param e
		 */
		_onExpandClothClick: function(e) {
			var $tgt = $("#expand_cloth");
			var $info = $("#cloth_info");

			this._onExpandClick($tgt, $info);
		},

		_onExpandSpecClick: function(e) {
			var $tgt = $("#expand_spec");
			var $info = $("#spec_info");

			this._onExpandClick($tgt, $info);
		},
		_onExpandCostClick: function(e) {
			var $tgt = $("#expand_cost");
			var $info = $("#cost_info");

			this._onExpandClick($tgt, $info);
		},
		_onExpandPriceClick: function(e) {
			var $tgt = $("#expand_price");
			var $info = $("#price_info");

			this._onExpandClick($tgt, $info);
		},
		_onExpandAnyClick: function(e) {
			var $tgt = $("#expand_any");
			var $info = $("#any_info");

			this._onExpandClick($tgt, $info);
		},

		/**
		 * 最初のカラー名称を取得する
		 */
		get1stColorName: function() {
			var $color = $('select[name="ca_colorID"]:first');
			var colorID = Number($color.val());
			var colorList = this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_COLOR];
			var name = '';
			_.each(colorList, _.bind(function(color) {
				if (color.iagID == colorID) {
					name = color.iagNameKanaR;
					return false;
				}
			}, this));
			return name;
		},

		/**
		 * 最初のサイズ名称を取得
		 */
		get1stSizeName: function() {
			var $tgt = $('input[name="select_col"]:checked').eq(0);
			var sizeID = $tgt.attr('sizeID');
			var sizeName = '';
			var sizeColNo = 0;
			var sizeColName = '';

			_.each(this.sizeRecList, _.bind(function(size) {
				if (size.sizeID == sizeID) {
					sizeColNo = size.sizeColNo;
					sizeName = size.sizeName;
					return false;
				}
			}, this));

			_.each(this.sizeColList, _.bind(function(col) {
				if (col.sizeColNo == sizeColNo) {
					sizeColName = col.sizeColName;
					return false;
				}
			}, this));

			if (sizeColName == "ｿﾉﾀ" || sizeColName == "ﾄｳｲﾂ") {
				sizeName = "";
			}

			return sizeName;
		},

		get1stSizeName811: function() {
			var $tgt = $('input[name="select_col"]:checked').eq(0);
			var sizeID = $tgt.attr('sizeID');
			var sizeColNo = 0;
			var sizeRowNo = 0;
			var sizeColName = '';
			var sizeRowName = '';
			var sizeName = '';

			_.each(this.sizeRecList, _.bind(function(size) {
				if (size.sizeID == sizeID) {
					sizeColNo = size.sizeColNo;
					sizeRowNo = size.sizeRowNo;
					return false;
				}
			}, this));

			_.each(this.sizeColList, _.bind(function(col) {
				if (col.sizeColNo == sizeColNo) {
					sizeColName = col.sizeColName;
					return false;
				}
			}, this));

			_.each(this.sizeRowList, _.bind(function(row) {
				if (row.sizeRowNo == sizeRowNo) {
					sizeRowName = row.sizeRowName;
					return false;
				}
			}, this));

			var cname = '';
			switch (sizeColName) {
			case "1":
				cname = '150';
				break;
			case "2":
				cname = '155';
				break;
			case "3":
				cname = '160';
				break;
			case "4":
				cname = '165';
				break;
			case "5":
				cname = '170';
				break;
			case "6":
				cname = '175';
				break;
			case "7":
				cname = '180';
				break;
			case "8":
				cname = '185';
				break;
			case "9":
				cname = '190';
				break;
			case "10":
				cname = '195';
				break;
			case "ｿﾉﾀ":
			case "ﾄｳｲﾂ":
				return "";	// ｿﾉﾀ、ﾄｳｲﾂの場合は空白にする
			default:
				cname = sizeColName;
				break;
			}
			if (sizeRowName != "") {
				sizeName = cname + "-" + sizeRowName;
			} else {
				sizeName = cname;
			}

			return sizeName;
		},

		getMakerCode: function() {
			var $tgt = $("#ca_makerID");
			var data = $tgt.autocomplete('clAutocompleteItem');
			var code = data != null ? data.code : '';
			return code.slice(-3);
		},

		getKiTypeCode: function() {
			var $tgt = $("#ca_kiTypeID");
			var id = $tgt.val();
			var ki = '';
			if (id == amcm_type.AMCM_VAL_KI_PURCHASE) {
				ki = 'K';
			} else if (id == amcm_type.AMCM_VAL_KI_CONSIGN) {
				ki = 'I';
			}
			return ki;
		},

		getOrderType: function() {
			var $tgt = $("#ca_itemTypeID");
			var id = Number($tgt.val());
			var ot = '';
			switch (id) {
			case amcm_type.AMCM_VAL_ITEM_REGULAR:
				ot = 'T';
				break;
			case amcm_type.AMCM_VAL_ITEM_SEMIREGULAR:
				ot = 'J';
				break;
			case amcm_type.AMCM_VAL_ITEM_BULK:
				ot = 'I';
				break;
			}
			return ot;
		},

		get1stColorCode: function() {
			var $tgt = $('input[name="ca_makerColor"]:first');
			return $tgt.val();
		},

		getSeasonCode: function() {
			var $tgt = $("#ca_seasonID");
			var text = $tgt.find('option:selected').text();
			var code = '';
			if (text != null) {
				text = text.split(',');
				if (text.length > 1) {
					code = text[0];
				}
			}
			return code;
		},

		getDivCode: function(itgrpID) {
			if (itgrpID == null || itgrpID == '' || itgrpID == 0) {
				var item = $("#ca_itgrpID").autocomplete('clAutocompleteItem');
				itgrpID = item.id;
			}
			var req = {
				cond: {
					itgrpID: itgrpID,
				},
			};
			var uri = 'am_pa_divbyvariety_srch';
			clutil.postJSON(uri, req).done(_.bind(function(data) {
				this.divInfo = data.list[0].div;
			}, this));
		},

		get1stTagAddr: function() {
			var $tgt = $('select[name0="ca_tagaddrNo"]:first');
			var text = $tgt.find('option:selected').text();
			var code = '';
			if (text != null) {
				text = text.split(',');
				if (text.length > 1) {
					code = text[0];
				}
			}
			return code;
		},

		getExSize: function() {
			var sizeMap = {};
			var rowMap = {};
			var colMap = {};
			_.each(this.sizeRecList, _.bind(function(s) {
				sizeMap[s.sizeID] = s;
			}, this));
			_.each(this.sizeRowList, _.bind(function(s) {
				rowMap[s.sizeRowNo] = s;
			}, this));
			_.each(this.sizeColList, _.bind(function(s) {
				colMap[s.sizeColNo] = s;
			}, this));

			var exsizeMap = {};

			var f_checked = {};
			var f_ex = {};

			_.each($('input[name="select_col"]'), _.bind(function(col) {
				/*
				 * 1.checkされているか
				 * 1-1. checkされている
				 * 1-1-1. f_checked = true;
				 * 1-1-2. f_ex == false
				 * 1-1-2-1. sizeMin, sizeMaxに適宜代入
				 * 1-2. checkされていない
				 * 1-2-1. f_checked == false
				 * 1-2-1-1. なにもしない
				 * 1-2-2. f_checed == true
				 * 1-2-2-1. f_ex = true
				 */
				var $tgt = $(col);
				var sizeID = $tgt.attr('sizeID');
				var size = sizeMap[sizeID];
				if (size == null) {
					return;
				}
				var rowNo = size.sizeRowNo;
				var colNo = size.sizeColNo;
				var row = rowMap[rowNo];
				var column = colMap[colNo];

				if ($tgt.prop('checked')) {
					// チェックされている
					if (f_checked[rowNo] == null || f_checked[rowNo] == false) {
						// この行で初めてのチェック
						exsizeMap[row.sizeRowName] = {
								sizeRowName: row.sizeRowName,
								sizeColNoMin: column.sizeColNo,
								sizeColNoMax: column.sizeColNo,
								sizeColNameMin: column.sizeColName,
								sizeColNameMax: column.sizeColName,
								sizeNameMin: size.sizeName,
								sizeNameMax: size.sizeName,
								sizeColNameEx: [],
							};
						f_checked[rowNo] = true;
					} else if (f_ex[rowNo] == null || f_ex[rowNo] == false) {
						// 継続してのチェック
						exsizeMap[row.sizeRowName].sizeColNoMax = column.sizeColNo;
						exsizeMap[row.sizeRowName].sizeColNameMax = column.sizeColName;
						exsizeMap[row.sizeRowName].sizeNameMax = size.sizeName;
					} else {
						// 飛び地のチェック
						exsizeMap[row.sizeRowName].sizeColNameEx.push(column.sizeColName);
					}
				} else {
					if (f_checked[rowNo] != null && f_checked[rowNo] == true) {
						// 既にチェックされたカラムがある
						if (f_ex[rowNo] == null || f_ex[rowNo] == false) {
							// 飛び地になるかも
							f_ex[rowNo] = true;
						}
					}
				}
			}, this));

//			_.each($('input[name="select_col"]:checked'), _.bind(function(col) {
//				var $tgt = $(col);
//				var sizeID = $tgt.attr('sizeID');
//				var size = sizeMap[sizeID];
//				if (size == null) {
//					return;
//				}
//				var row = rowMap[size.sizeRowNo];
//				var col = colMap[size.sizeColNo];
//				if (exsizeMap[row.sizeRowName] == null) {
//					exsizeMap[row.sizeRowName] = {
//						sizeRowName: row.sizeRowName,
//						sizeColNoMin: col.sizeColNo,
//						sizeColNoMax: col.sizeColNo,
//						sizeColNameMin: col.sizeColName,
//						sizeColNameMax: col.sizeColName,
//						sizeNameMin: size.sizeName,
//						sizeNameMax: size.sizeName,
//						sizeColNameEx: [],
//					};
//				} else {
//					if (exsizeMap[row.sizeRowName].sizeColNoMin > col.sizeColNo) {
//						exsizeMap[row.sizeRowName].sizeColNoMin = col.sizeColNo;
//						exsizeMap[row.sizeRowName].sizeColNameMin = col.sizeColName;
//						exsizeMap[row.sizeRowName].sizeNameMin = size.sizeName;
//					}
//					if (exsizeMap[row.sizeRowName].sizeColNoMax < col.sizeColNo) {
//						exsizeMap[row.sizeRowName].sizeColNoMax = col.sizeColNo;
//						exsizeMap[row.sizeRowName].sizeColNameMax = col.sizeColName;
//						exsizeMap[row.sizeRowName].sizeNameMax = size.sizeName;
//					}
//				}
//			}, this));
			var exsizeArray = _.values(exsizeMap);
			return exsizeArray;
		},

		getSaleLimit: function() {
			var year = $("#ca_selloutYear").val().slice(-1);
			var $tgt = $('#ca_selloutSeasonID');
			var text = $tgt.find('option:selected').text();
			var code = '';
			if (text != null) {
				text = text.split(',');
				if (text.length > 1) {
					code = text[0].slice(-1);
				}
			}
			return year + code;
		},

		getStyle: function() {
			var $tgt = $("#ca_styleID");
			var text = $tgt.find('option:selected').text();
			var code = '';
			if (text != null) {
				text = text.split(',');
				if (text.length > 1) {
					code = text[0];
				}
			}
			return code.slice(-1);
		},

		/**
		 * タグ表示のための生産国名を取得
		 * @returns {String}
		 */
		getImport: function() {
			var $tgt = $("#ca_tagImportID");	// タグ表示用を使用
			var id = Number($tgt.val());
			var list = this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_COUNTRY];

			var name = '';
			_.each(list, _.bind(function(obj) {
				if (obj.iagID == id) {
					name = obj.iagNameKana;	// 名称カナを使用(China等)
					return false;
				}
			}, this));
			return name;
		},

		getMaterialList: function() {
			var list = [];
			var prev_placeName = '';

			_.each($("#ca_table_material_tbody tr"), _.bind(function(tr) {
				var $tr = $(tr);
				var $ca_placeID = $tr.find('select[name="ca_placeID"]');
				var $ca_tagMaterialID = $tr.find('select[name="ca_tagMaterialID"]');
				var $ca_materialRatio = $tr.find('input[name="ca_materialRatio"]');
				var $ca_tagManual = $tr.find('input[name="ca_tagManual"]');

				var manual = $ca_tagManual.val();
				var placeText = $ca_placeID.find('option:selected').text();
				var placeName = '';
				var mateName = '';
				var text = '';

				if (manual != null && manual.length > 0) {
					placeName = manual;
				} else {
					if (placeText != null) {
						placeText = placeText.split(':');
						if (placeText.length > 1) {
							placeName = placeText[1];
						}
					}
					if (placeName == prev_placeName) {
						placeName = '　　　　';
					} else {
						prev_placeName = placeName;
					}

					var mateText = $ca_tagMaterialID.find('option:selected').text();
					if (mateText != null) {
						mateText = mateText.split(':');
						if (mateText.length > 1) {
							mateName = mateText[1];
						}
					}

					var ratio = $ca_materialRatio.val();
					if (ratio != null && ratio != '') {
						text = ratio + '%';
					}
				}

				var data = placeName + ' ' + mateName + ' ' + text;
				list.push(data);
			}, this));

			if (list.length < 10) {
				for (var i = list.length-1; i < 10; i++) {
					list.push('');
				}
			}

			return list;
		},

		getItoLox: function() {
			var $tgt = $("#ca_itoloxID");
			var text = $tgt.find('option:selected').text();
			var code = '';
			if (text != null) {
				text = text.split(',');
				if (text.length > 1) {
					code = text[0];
				}
			}
			return code.slice(-1);
		},

		getItemName: function() {
			var subcls1ID = Number($("#ca_subcls1ID").val());
			if (subcls1ID == 0) {
				return '';
			}
			var subcls1List = this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_SUBCLS1];
			var name = '';
			_.each(subcls1List, _.bind(function(sub) {
				if (sub.iagID == subcls1ID) {
					name = sub.iagNameKanaR;
					return false;
				}
			}, this));
			return name;
		},

		getSeasonOrihica: function() {
			var $tgt = $("#ca_seasonID");
			var id = Number($tgt.val());

			var name = '';
			switch (id) {
			case amcm_type.AMCM_VAL_SEASON_AW:
			case amcm_type.AMCM_VAL_SEASON_AUTUMN:
			case amcm_type.AMCM_VAL_SEASON_WINTER:
				name = 'A';
				break;
			case amcm_type.AMCM_VAL_SEASON_SPRING:
			case amcm_type.AMCM_VAL_SEASON_SUMMER:
			case amcm_type.AMCM_VAL_SEASON_SS:
				name = 'S';
				break;
			case amcm_type.AMCM_VAL_SEASON_ALL:
				name = 'L';
				break;
			}
			return name;
		},

		getSaleLimitOrihica: function() {
			var year = $("#ca_selloutYear").val().slice(-1);
			var $tgt = $('#ca_selloutSeasonID');
			var id = $tgt = Number($tgt.val());
			var name = '';

			switch (id) {
			case amcm_type.AMCM_VAL_SEASON_AW:
			case amcm_type.AMCM_VAL_SEASON_AUTUMN:
			case amcm_type.AMCM_VAL_SEASON_WINTER:
				name = 'A';
				break;
			case amcm_type.AMCM_VAL_SEASON_SPRING:
			case amcm_type.AMCM_VAL_SEASON_SUMMER:
			case amcm_type.AMCM_VAL_SEASON_SS:
				name = 'S';
				break;
			case amcm_type.AMCM_VAL_SEASON_ALL:
				name = 'L';
				break;
			}
			return year + name;
		},

		createExsizeSUIT: function(exsize) {
			var ex = '';
			if (exsize != null) {
				ex = exsize.sizeRowName + exsize.sizeColNameMin + '-';
				ex += exsize.sizeColNameMax.substr(0, 1);
//				if (exsize.sizeColNameMax == '10') {
//					ex += '1';
//				} else {
//					ex += exsize.sizeColNameMax;
//				}
			}
			return ex;
		},

		createExsizeSMX: function(exsize) {
			var ex = '';
			if (exsize != null) {
				ex = exsize.sizeNameMin + '-' + exsize.sizeNameMax;
				if (exsize.sizeColNameEx != null) {
					_.each(exsize.sizeColNameEx, _.bind(function(e) {
						ex += ' ';
						ex += e;
					}, this));
				}
			}
			return ex;
		},

		/**
		 * タグデータ作成(AOKI)
		 */
		createTagImageData111: function(tagType) {
			var recordType = 'T';	// レコード区分（固定）
			var dataType = '06';	// データタイプ（固定）
			var outputType = tagType;	// 出力区分（タグ種別になる）
			var outputcount = 1;	// 出力枚数（固定 使わない？）
			var tagcode = '2000567890123';	// タグコード（適当）
			var itemname = this.getItemName();	// 商品名
			var colorname = this.get1stColorName();
			var sizename = this.get1stSizeName();
			var vendorcode = this.getMakerCode();
			var kitype = this.getKiTypeCode();
			var makerItemCode = $("#ca_makerItemCode").val().slice(0, 10);
			var ordertype = this.getOrderType();
			var colorcode = this.get1stColorCode();
			var priceIntax = $("#ca_priceIntax").val().split(',').join('');
			var price = $("#ca_price").val().split(',').join('');
			var year = $("#ca_year").val();
			var season = this.getSeasonCode();
			var divcode = this.divInfo.code.slice(-1);
			var ctgcode = this.itgrpInfo.code;
			var factorycode = this.get1stTagAddr();
			var exsizeArray = this.getExSize();
			var exsize1, exsize2,exsize3,exsize4, exsize5, exsize6;
			switch (tagType) {
			case amcm_type.AMCM_VAL_TAG_SUIT:
			case amcm_type.AMCM_VAL_TAG_FORMAL:
			case amcm_type.AMCM_VAL_TAG_AT_BIG:
				exsize1 = this.createExsizeSUIT(exsizeArray[0]);
				exsize2 = this.createExsizeSUIT(exsizeArray[1]);
				exsize3 = this.createExsizeSUIT(exsizeArray[2]);
				exsize4 = this.createExsizeSUIT(exsizeArray[3]);
				exsize5 = this.createExsizeSUIT(exsizeArray[4]);
				exsize6 = this.createExsizeSUIT(exsizeArray[5]);
				break;
			case amcm_type.AMCM_VAL_TAG_SMX:
			case amcm_type.AMCM_VAL_TAG_PRICE:
			case amcm_type.AMCM_VAL_TAG_SHIRT:
			case amcm_type.AMCM_VAL_TAG_SLACKS:
			case amcm_type.AMCM_VAL_TAG_GOODS:
			case amcm_type.AMCM_VAL_TAG_BOX:
			case amcm_type.AMCM_VAL_TAG_HAND:
			case amcm_type.AMCM_VAL_TAG_AT_BIG_1:
			case amcm_type.AMCM_VAL_TAG_AT_MIDDLE:
			case amcm_type.AMCM_VAL_TAG_AT_SMALL:
			case amcm_type.AMCM_VAL_TAG_AT_GOODS:
			case amcm_type.AMCM_VAL_TAG_AT_GOODS_WEAK:
				exsize1 = this.createExsizeSMX(exsizeArray[0]);
				exsize2 = this.createExsizeSMX(exsizeArray[1]);
				exsize3 = this.createExsizeSMX(exsizeArray[2]);
				exsize4 = this.createExsizeSMX(exsizeArray[3]);
				exsize5 = this.createExsizeSMX(exsizeArray[4]);
				exsize6 = this.createExsizeSMX(exsizeArray[5]);
				break;
			default:
				exsize1 = exsize2 = exsize3 = exsize4 = exsize5 = exsize6 = "";
				break;
			}
//			if (exsizeArray[0] != null) {
//				exsize1 = exsizeArray[0].sizeRowName + exsizeArray[0].sizeColNameMin + '-';
//				if (exsizeArray[0].sizeColNameMax == '10') {
//					exsize1 += '1';
//				} else {
//					exsize1 += exsizeArray[0].sizeColNameMax;
//				}
//			} else {
//				exsize1 = '';
//			}
//			if (exsizeArray[1] != null) {
//				exsize2 = exsizeArray[1].sizeRowName + exsizeArray[1].sizeColNameMin + '-';
//				if (exsizeArray[1].sizeColNameMax == '10') {
//					exsize2 += '1';
//				} else {
//					exsize2 += exsizeArray[1].sizeColNameMax;
//				}
//			} else {
//				exsize2 = '';
//			}
//			if (exsizeArray[2] != null) {
//				exsize3 = exsizeArray[2].sizeRowName + exsizeArray[2].sizeColNameMin + '-';
//				if (exsizeArray[2].sizeColNameMax == '10') {
//					exsize3 += '1';
//				} else {
//					exsize3 += exsizeArray[2].sizeColNameMax;
//				}
//			} else {
//				exsize3 = '';
//			}
//			if (exsizeArray[3] != null) {
//				exsize4 = exsizeArray[3].sizeRowName + exsizeArray[3].sizeColNameMin + '-';
//				if (exsizeArray[3].sizeColNameMax == '10') {
//					exsize4 += '1';
//				} else {
//					exsize4 += exsizeArray[3].sizeColNameMax;
//				}
//			} else {
//				exsize4 = '';
//			}
//			if (exsizeArray[4] != null) {
//				exsize5 = exsizeArray[4].sizeRowName + exsizeArray[4].sizeColNameMin + '-';
//				if (exsizeArray[4].sizeColNameMax == '10') {
//					exsize5 += '1';
//				} else {
//					exsize5 += exsizeArray[4].sizeColNameMax;
//				}
//			} else {
//				exsize5 = '';
//			}
//			if (exsizeArray[5] != null) {
//				exsize6 = exsizeArray[5].sizeRowName + exsizeArray[5].sizeColNameMin + '-';
//				if (exsizeArray[5].sizeColNameMax == '10') {
//					exsize6 += '1';
//				} else {
//					exsize6 += exsizeArray[5].sizeColNameMax;
//				}
//			} else {
//				exsize6 = '';
//			}
			var priceStr = priceIntax.toString().slice(0, 3).split('').reverse().join('');
			var setuptype = $('#ca_setupFlag').prop('checked') ? '(ｾ)' : '';
			var salelimit = this.getSaleLimit();

			var dataObj = {
				recordType: recordType,
				dataType: dataType,
				outputtype: outputType,
				outputcount: outputcount,
				tagcode: tagcode,
				itemname: itemname,
				colorname: colorname,
				sizename: sizename,
				vendorcode: vendorcode,
				kitype: kitype,
				makercode: makerItemCode,
				ordertype: ordertype,
				colorcode: colorcode,
				saleamintax: priceIntax,
				saleam: price,
				year: year,
				season: season,
				divcode: divcode,
				ctgcode: ctgcode,
				factorycode: factorycode,
				exsize1: exsize1,
				exsize2: exsize2,
				exsize3: exsize3,
				exsize4: exsize4,
				exsize5: exsize5,
				exsize6: exsize6,
				price: priceStr,
				setuptype: setuptype,
				salelimit: salelimit,
			};
			return dataObj;
		},

		createExsizeSUIT_O: function(exsize) {
			var ex = '';
			if (exsize != null) {
				ex = exsize.sizeRowName
					+ exsize.sizeColNameMin + '-'
					+ exsize.sizeColNameMax;
			}
			return ex;
		},

		createExsizeSMX_O: function(exsize) {
			var ex = '';
			if (exsize != null) {
				ex = exsize.sizeNameMin + '-' + exsize.sizeNameMax;
				if (exsize.sizeColNameEx != null) {
					_.each(exsize.sizeColNameEx, _.bind(function(e) {
						ex += ' ';
						ex += e;
					}, this));
				}
			}
			return ex.substr(0, 9);
		},

		/**
		 * タグデータ作成(ORIHICA)
		 */
		createTagImageData811: function(tagType) {
			var orderno = '';			// 発注書No
			var tagissuemaker = '';		// タグ発行メーカー
			var tagissueorderdate = '';	// タグ発行依頼日
			var outputType = tagType;	// 出力区分（タグ種別になる）
			var tagissuecountrytype = '';	// タグ発行国区分
			var outputcount = 1;
			var tagcode = '2000567890123';	// タグコード（適当）
			var itemname = $("#ca_name").val();	// 商品名
			var year = $("#ca_year").val().slice(-1);
			var season = this.getSeasonOrihica();
			var divcode = this.divInfo.code.slice(-1);
			var ctgcode = this.itgrpInfo.code;
			var colorcode = this.get1stColorCode();
			var colorname = this.get1stColorName();
			var sizename;
			if (tagType == amcm_type.AMCM_VAL_TAG_ORBUS1) {
				sizename = this.get1stSizeName811();
			} else {
				sizename = this.get1stSizeName();
			}
			var priceIntax = $("#ca_priceIntax").val().split(',').join('');
			var price = $("#ca_price").val().split(',').join('');
			var kitype = this.getKiTypeCode();
			var ordertype = this.getOrderType();
			var vendorcode = this.getMakerCode();
			var factorycode = this.get1stTagAddr();
			var makerItemCode = $("#ca_makerItemCode").val().slice(0, 10);
			var origin = this.getImport();
			if (!_.isEmpty(origin)) {
				origin = 'Made in ' + origin;
			}
			var styletype = this.getStyle();
			var materialList = this.getMaterialList();
			var highlighting = $("#ca_tagHighlight").val();
			var fixedData1 = $("#ca_fixedFormTag1Code").autocomplete('clAutocompleteItem');
			var additionaltagno1 = fixedData1 == null ? '' : fixedData1.code;
			var fixedData2 = $("#ca_fixedFormTag2Code").autocomplete('clAutocompleteItem');
			var additionaltagno2 = fixedData2 == null ? '' : fixedData2.code;
			var itolox = this.getItoLox();
			var exsizeArray = this.getExSize();
			var exsize1, exsize2,exsize3,exsize4, exsize5, exsize6;

			switch (tagType) {
			case amcm_type.AMCM_VAL_TAG_ORBUS1:
			case amcm_type.AMCM_VAL_TAG_ORBUS2:
			case amcm_type.AMCM_VAL_TAG_ORGARAGE:
			case amcm_type.AMCM_VAL_TAG_ORRHYME:
				exsize1 = this.createExsizeSUIT_O(exsizeArray[0]);
				exsize2 = this.createExsizeSUIT_O(exsizeArray[1]);
				exsize3 = this.createExsizeSUIT_O(exsizeArray[2]);
				exsize4 = this.createExsizeSUIT_O(exsizeArray[3]);
				exsize5 = this.createExsizeSUIT_O(exsizeArray[4]);
				exsize6 = this.createExsizeSUIT_O(exsizeArray[5]);
				break;
			case amcm_type.AMCM_VAL_TAG_ORGOODSBUS:
			case amcm_type.AMCM_VAL_TAG_ORGOODSRHYME:
			case amcm_type.AMCM_VAL_TAG_ORLABEL:
			case amcm_type.AMCM_VAL_TAG_ORBOX:
				exsize1 = this.createExsizeSMX_O(exsizeArray[0]);
				exsize2 = this.createExsizeSMX_O(exsizeArray[1]);
				exsize3 = this.createExsizeSMX_O(exsizeArray[2]);
				exsize4 = this.createExsizeSMX_O(exsizeArray[3]);
				exsize5 = this.createExsizeSMX_O(exsizeArray[4]);
				exsize6 = this.createExsizeSMX_O(exsizeArray[5]);
				break;
			default:
				exsize1 = exsize2 = exsize3 = exsize4 = exsize5 = exsize6 = "";
				break;
			}
//			if (exsizeArray[0] != null) {
//				exsize1 = exsizeArray[0].sizeRowName + exsizeArray[0].sizeColNameMin + '-';
//				if (exsizeArray[0].sizeColNameMax == '10') {
//					exsize1 += '1';
//				} else {
//					exsize1 += exsizeArray[0].sizeColNameMax;
//				}
//			} else {
//				exsize1 = '';
//			}
//			if (exsizeArray[1] != null) {
//				exsize2 = exsizeArray[1].sizeRowName + exsizeArray[1].sizeColNameMin + '-';
//				exsize2 += exsizeArray[1].sizeColNameMax;
//			} else {
//				exsize2 = '';
//			}
//			if (exsizeArray[2] != null) {
//				exsize3 = exsizeArray[2].sizeRowName + exsizeArray[2].sizeColNameMin + '-';
//				exsize3 += exsizeArray[2].sizeColNameMax;
//			} else {
//				exsize3 = '';
//			}
//			if (exsizeArray[3] != null) {
//				exsize4 = exsizeArray[3].sizeRowName + exsizeArray[3].sizeColNameMin + '-';
//				exsize4 += exsizeArray[3].sizeColNameMax;
//			} else {
//				exsize4 = '';
//			}
//			if (exsizeArray[4] != null) {
//				exsize5 = exsizeArray[4].sizeRowName + exsizeArray[4].sizeColNameMin + '-';
//				exsize5 += exsizeArray[4].sizeColNameMax;
//			} else {
//				exsize5 = '';
//			}
//			if (exsizeArray[5] != null) {
//				exsize6 = exsizeArray[5].sizeRowName + exsizeArray[5].sizeColNameMin + '-';
//				exsize6 += exsizeArray[5].sizeColNameMax;
//			} else {
//				exsize6 = '';
//			}
			var salelimit = this.getSaleLimitOrihica();

			var dataObj = {
				orderno: orderno,
				tagissuemaker: tagissuemaker,
				tagissueorderdate: tagissueorderdate,
				outputtype: outputType,
				tagissuecountrytype: tagissuecountrytype,
				outputcount: outputcount,
				tagcode: tagcode,
				itemname: itemname,
				year: year,
				season: season,
				divcode: divcode,
				ctgcode: ctgcode,
				colorcode: colorcode,
				colorname: colorname,
				sizename: sizename,
				saleamintax: priceIntax,
				saleam: price,
				kitype: kitype,
				ordertype: ordertype,
				vendorcode: vendorcode,
				factorycode: factorycode,
				makercode: makerItemCode,
				styletype: styletype,
				origin: origin,
				exsize1: exsize1,
				exsize2: exsize2,
				exsize3: exsize3,
				exsize4: exsize4,
				exsize5: exsize5,
				exsize6: exsize6,
                quality1: materialList[0],
                quality2: materialList[1],
                quality3: materialList[2],
                quality4: materialList[3],
                quality5: materialList[4],
                quality6: materialList[5],
                quality7: materialList[6],
                quality8: materialList[7],
                quality9: materialList[8],
                quality10: materialList[9],
                highlighting: highlighting,
                additionaltagno1: additionaltagno1,
                additionaltagno2: additionaltagno2,
                threadlox: itolox,
                salelimit: salelimit,
			};

			return dataObj;
		},

		/**
		 * タグ種別コード取得
		 */
		getTagTypeCode: function() {
			var $tagType = $("#ca_tagTypeID");
			var tagTypeStr = $tagType.find('option:selected').text();
			var code = '';
			if (tagTypeStr != null) {
				tagTypeStr = tagTypeStr.split(':');
				if (tagTypeStr.length > 1) {
					code = tagTypeStr[0];
				}
			}
			return code;
		},

		toTagDataURL: function(dataobj, pattern) {
            function formatprice(price) {
                return String(price).replace( /(\d)(?=(\d\d\d)+(?!\d))/g,'$1,');
            }
            function getRandomArbitary(min, max) {
                return Math.random() * (max - min) + min;
            };
            function barcode(ctx, x, y, height, width) {
                var w;
                var maxx = x + width;
                while (x < maxx) {
                    w = getRandomArbitary(1, 4);
                    ctx.fillRect(x, y, w, height);
                    x += (w + getRandomArbitary(1, 4));
                }
            };
            function pattern111(ctx) {
                var height = 0;
                {
                    height += 40;
                    ctx.fillText(dataobj.price, 90, height);
                    ctx.fillText(dataobj.salelimit, 120, height);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.itemname, 5, height);
                    ctx.fillText(dataobj.vendorcode + "-" + dataobj.kitype + dataobj.year%10 + dataobj.season, 90, height);
                }
                {
                    height += 10;
                    ctx.strokeRect(90, height, 55, 40);
                    ctx.font = "bold 10px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("サイズ", 90, height+10);
                    ctx.font = "bold 22px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename.slice(0,5), 95, height+30);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.makercode, 5, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.colorcode, 5, height);
                    ctx.fillText(dataobj.colorname, 30, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.divcode.slice(-1) + dataobj.ctgcode, 5, height);
                    ctx.fillText(dataobj.ordertype + dataobj.setuptype , 30, height);
                }
                {
                    height += 20;
                    barcode(ctx, 20, height, 35, 110);
                }
                {
                    height += (30 + 20);
                    ctx.fillText(dataobj.tagcode, 35, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.exsize1, 20, height);
                    ctx.fillText(dataobj.exsize2, 60, height);
                    ctx.fillText(dataobj.exsize3, 90, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.exsize4, 20, height);
                    ctx.fillText(dataobj.exsize5, 60, height);
                    ctx.fillText(dataobj.exsize6, 90, height);
                }
            };
            function pattern112(ctx) {
                var height = 0;
                {
                    height += 40;
                    ctx.fillText(dataobj.salelimit, 120, height);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.itemname, 5, height);
                    ctx.fillText(dataobj.vendorcode + "-" + dataobj.kitype + dataobj.year%10 + dataobj.season, 90, height);
                }
                {
                    height += 10;
                    ctx.strokeRect(90, height, 55, 40);
                    ctx.font = "bold 10px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("サイズ", 90, height+10);
                    ctx.font = "bold 22px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename.slice(0,5), 95, height+30);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.makercode, 5, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.colorcode, 5, height);
                    ctx.fillText(dataobj.colorname, 30, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.divcode.slice(-1) + dataobj.ctgcode, 5, height);
                    ctx.fillText(dataobj.ordertype + dataobj.setuptype, 30, height);
                }
                {
                    height += 20;
                    barcode(ctx, 20, height, 35, 110);
                }
                {
                    height += (30 + 20);
                    ctx.fillText(dataobj.tagcode, 35, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.exsize1, 20, height);
                    ctx.fillText(dataobj.exsize2, 60, height);
                    ctx.fillText(dataobj.exsize3, 90, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.exsize4, 20, height);
                    ctx.fillText(dataobj.exsize5, 60, height);
                    ctx.fillText(dataobj.exsize6, 90, height);
                }
            };
            function pattern113(ctx) {
                var height = 0;
                {
                    height += 40;
                    ctx.fillText(dataobj.price, 90, height);
                    ctx.fillText(dataobj.salelimit, 120, height);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.itemname, 5, height);
                    ctx.fillText(dataobj.vendorcode + "-" + dataobj.kitype + dataobj.year%10 + dataobj.season, 90, height);
                }
                {
                    height += 10;
                    ctx.strokeRect(90, height, 55, 40);
                    ctx.font = "bold 10px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("サイズ", 90, height+10);
                    ctx.font = "bold 22px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename.slice(0,5), 95, height+30);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.makercode, 5, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.colorcode, 5, height);
                    ctx.fillText(dataobj.colorname, 30, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.divcode.slice(-1) + dataobj.ctgcode, 5, height);
                    ctx.fillText(dataobj.ordertype + dataobj.setuptype, 30, height);
                    ctx.fillText(dataobj.exsize1, 90, height);
                    ctx.fillText("・", 110, height);
                    ctx.fillText(dataobj.exsize2.slice(0,4), 120, height);
                }
                {
                    height += 20;
                    barcode(ctx, 20, height, 35, 110);
                }
                {
                    height += (30 + 20);
                    ctx.fillText(dataobj.tagcode, 35, height);
                }
            };
            function pattern114(ctx) {
                var height = 0;
                {
                    height += 40;
                    ctx.fillText(dataobj.salelimit, 120, height);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.itemname, 5, height, 85);
                    ctx.fillText(dataobj.vendorcode + "-" + dataobj.kitype + dataobj.year%10 + dataobj.season, 90, height);
                }
                {
                    height += 10;
                    ctx.strokeRect(90, height, 55, 40);
                    ctx.font = "bold 10px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("サイズ", 90, height+10);
                    ctx.font = "bold 22px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename.slice(0,5), 95, height+30);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.makercode, 5, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.colorcode, 5, height);
                    ctx.fillText(dataobj.colorname, 30, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.divcode.slice(-1) + dataobj.ctgcode, 5, height);
                    ctx.fillText(dataobj.ordertype + dataobj.setuptype , 30, height);
                    ctx.fillText(dataobj.exsize1, 90, height);
                    ctx.fillText("・", 110, height);
                    ctx.fillText(dataobj.exsize2.slice(0,4), 120, height);
                }
                {
                    height += 20;
                    barcode(ctx, 20, height, 35, 110);
                }
                {
                    height += (30 + 20);
                    ctx.fillText(dataobj.tagcode, 35, height);
                }
                {
                    height += 20;
                    barcode(ctx, 50, height, 35, 50);
                }
                {
                    height += 60;
                    ctx.font = "normal 15px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("本体", 20, height);
                    ctx.font = "bold 18px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("￥" + formatprice(dataobj.saleam), 60, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 15;
                    ctx.font = "bold 13px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("(税込　￥" + formatprice(dataobj.saleamintax) + ")", 55, height);
                    ctx.font = "normal 10px sans-serif";
                }
            };
            function pattern116(ctx) {
                var height = 0;
                {
                    height += 10;

                    barcode(ctx, 20, height, 35, 110);
                    ctx.fillText(dataobj.tagcode, 35, height+45);

                    ctx.fillText(dataobj.salelimit, 178, height+10, 25);
                    ctx.fillText(dataobj.vendorcode + "-" + dataobj.kitype + dataobj.year%10 + dataobj.season, 150, height+20);

                    ctx.strokeRect(220, height, 60, 40);
                    ctx.font = "bold 10px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("サイズ", 220, height+10);
                    ctx.font = "bold 22px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename.slice(0,5), 225, height+30);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 60;
                    ctx.fillText(dataobj.itemname, 50, height);
                }
                {
                    height += 5;
                    barcode(ctx, 200, height, 35, 50);
                }
                {
                    height += 15;
                    ctx.fillText(dataobj.makercode, 50, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.colorcode, 50, height);
                    ctx.fillText(dataobj.colorname, 75, height);
                }
                {
                    height += 20;
                    ctx.fillText(dataobj.divcode.slice(-1) + dataobj.ctgcode, 50, height);
                    ctx.fillText(dataobj.ordertype + dataobj.setuptype, 75, height);
                }
                {
                    height += 10;
                    ctx.font = "normal 15px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("本体", 170, height);
                    ctx.font = "bold 18px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("￥" + formatprice(dataobj.saleam), 220, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.exsize1, 50, height);
                    ctx.fillText("・", 70, height, 10);
                    ctx.fillText(dataobj.exsize2.slice(0,4), 80, height);
                }
                {
                    height += 10;
                    ctx.font = "bold 13px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("(税込　￥" + formatprice(dataobj.saleamintax) + ")", 190, height);
                    ctx.font = "normal 10px sans-serif";
                }
            };
            function pattern131(ctx) {
                var height = 0;
                {
                    height += 15;
                    ctx.fillText(dataobj.itemname, 5, height);
                    ctx.fillText(dataobj.salelimit, 120, height);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.vendorcode + "-" + dataobj.kitype + dataobj.year%10 + dataobj.season, 90, height);
                }
                {
                    height += 5;
                    ctx.strokeRect(90, height, 55, 40);
                    ctx.font = "bold 10px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("サイズ", 90, height+10);
                    ctx.font = "bold 22px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename.slice(0,5), 95, height+30);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.makercode, 5, height, 85);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.colorcode, 5, height);
                }
                {
                    height += 15;
                    ctx.fillText(dataobj.colorname, 5, height);
                }
                {
                    height += 15;
                    ctx.fillText(dataobj.divcode.slice(-1) + dataobj.ctgcode, 5, height);
                    ctx.fillText(dataobj.ordertype + dataobj.setuptype, 30, height);
                    ctx.fillText(dataobj.exsize1, 90, height);
                    ctx.fillText("・", 110, height);
                    ctx.fillText(dataobj.exsize2.slice(0,4), 120, height);
                }
                {
                    height += 10;
                    barcode(ctx, 20, height, 30, 110);
                }
                {
                    height += 45;
                    ctx.fillText(dataobj.tagcode, 35, height);
                }
                {
                    height += 10;
                    barcode(ctx, 50, height, 30, 50);
                }
                {
                    height += 50;
                    ctx.font = "normal 15px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("本体", 20, height);
                    ctx.font = "bold 18px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("￥" + formatprice(dataobj.saleam), 60, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 15;
                    ctx.font = "bold 13px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("(税込　￥" + formatprice(dataobj.saleamintax) + ")", 55, height);
                    ctx.font = "normal 10px sans-serif";
                }
            };
            function pattern132(ctx) {
                var height = 0;
                {
                    height += 5;
                    ctx.strokeRect(90, height, 55, 40);
                    ctx.font = "bold 10px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("サイズ", 90, height+10);
                    ctx.font = "bold 22px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename.slice(0,5), 95, height+30);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.makercode, 5, height);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.colorcode, 5, height);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.colorname, 5, height);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.exsize1.slice(0,4) + "-" + dataobj.exsize2.slice(0,4), 5, height);
                }
                {
                    height += 5;
                    barcode(ctx, 20, height, 30, 110);
                }
                {
                    height += 40;
                    ctx.fillText(dataobj.tagcode, 35, height);
                }
            };
            function pattern133(ctx) {
                var height = 0;
                {
                    height += 15;
                    ctx.fillText(dataobj.itemname, 5, height);
                    ctx.fillText(dataobj.salelimit, 120, height);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.vendorcode + "-" + dataobj.kitype + dataobj.year%10 + dataobj.season, 90, height);
                }
                {
                    height += 5;
                    ctx.strokeRect(90, height, 55, 40);
                    ctx.font = "bold 10px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("サイズ", 90, height+10);
                    ctx.font = "bold 22px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename.slice(0,5), 95, height+30);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.makercode, 5, height, 85);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.colorcode, 5, height);
                }
                {
                    height += 15;
                    ctx.fillText(dataobj.colorname, 5, height);
                }
                {
                    height += 15;
                    ctx.fillText(dataobj.divcode.slice(-1) + dataobj.ctgcode, 5, height);
                    ctx.fillText(dataobj.ordertype + dataobj.setuptype, 30, height);
                    ctx.fillText(dataobj.exsize1, 90, height);
                    ctx.fillText("・", 110, height);
                    ctx.fillText(dataobj.exsize2.slice(0,4), 120, height);
                }
                {
                    height += 10;
                    barcode(ctx, 20, height, 30, 110);
                }
                {
                    height += 45;
                    ctx.fillText(dataobj.tagcode, 35, height);
                }
                {
                    height += 10;
                    barcode(ctx, 50, height, 30, 50);
                }
                {
                    height += 50;
                    ctx.font = "normal 15px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("本体", 20, height);
                    ctx.font = "bold 18px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("￥" + formatprice(dataobj.saleam), 60, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 15;
                    ctx.font = "bold 13px 'ＭＳ Ｐゴシック'";
                    ctx.fillText("(税込　￥" + formatprice(dataobj.saleamintax) + ")", 55, height);
                    ctx.font = "normal 10px sans-serif";
                }
            };
            function pattern811(ctx) {
                var height = 0;
                {
                    height += 30;
                    ctx.fillText("NO.", 20, height, 20);
                    ctx.font = "bold 13px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.makercode, 60, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 5;
                    ctx.beginPath();
                    ctx.moveTo(10, height);
                    ctx.lineTo(170, height);
                    ctx.closePath();
                    ctx.stroke();
                }
                {
                    height += 20;
                    ctx.fillText("SIZE", 20, height, 20);
                    ctx.font = "bold 13px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename, 60, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 5;
                    ctx.beginPath();
                    ctx.moveTo(10, height);
                    ctx.lineTo(170, height);
                    ctx.closePath();
                    ctx.stroke();
                }
                {
                    height += 20;
                    ctx.font = "normal 3px sans-serif";
                    ctx.fillText(dataobj.quality1, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality2, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality3, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality4, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality5, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality6, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality7, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality8, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality9, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality10, 50, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 20;
                    ctx.fillText("QUAL..", 20, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 5;
                    ctx.beginPath();
                    ctx.moveTo(10, height);
                    ctx.lineTo(170, height);
                    ctx.closePath();
                    ctx.stroke();
                }
                {
                    height += 15;
                    ctx.font = "normal 15px sans-serif";
                    ctx.fillText(dataobj.highlighting, 60, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 15;
                    ctx.fillText(dataobj.origin, 10, height);
                    ctx.fillText(dataobj.exsize1.slice(0,5), 100, height);
                    ctx.fillText(dataobj.exsize2.slice(0,5), 140, height);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.colorcode, 10, height);
                    ctx.fillText(dataobj.colorname, 40, height);
                    ctx.fillText(dataobj.exsize3.slice(0,5), 100, height);
                    ctx.fillText(dataobj.exsize4.slice(0,5), 140, height);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.divcode.slice(-1) + dataobj.ctgcode + " " + String(dataobj.year%10) + dataobj.season + dataobj.salelimit + " " + dataobj.vendorcode, 10, height);
                    ctx.fillText(dataobj.exsize5.slice(0,5), 100, height);
                    ctx.fillText(dataobj.exsize6.slice(0,5), 140, height);
                }
                {
                    height += 10;
                    barcode(ctx, 30, height, 30, 110);
                }
                {
                    height += 40;
                    ctx.fillText(dataobj.tagcode, 50, height);
                }
                {
                    height += 30;
                    ctx.font = "normal 15px sans-serif";
                    ctx.fillText("本体", 40, height);
                    ctx.fillText("￥" + formatprice(dataobj.saleam) + "+税", 80, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 15;
                    ctx.fillText("PRICE", 20, height);
                    ctx.fillText("(税込　￥" + formatprice(dataobj.saleamintax) + ")", 80, height);
                }
                {
                    height += 5;
                    ctx.beginPath();
                    ctx.moveTo(10, height);
                    ctx.lineTo(170, height);
                    ctx.closePath();
                    ctx.stroke();
                }
            };
            function pattern812(ctx) {
                var height = 0;
                {
                    height += 30;
                    ctx.fillText("NO.", 20, height, 20);
                    ctx.font = "bold 13px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.makercode, 60, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 5;
                    ctx.beginPath();
                    ctx.moveTo(10, height);
                    ctx.lineTo(170, height);
                    ctx.closePath();
                    ctx.stroke();
                }
                {
                    height += 20;
                    ctx.fillText("SIZE", 20, height, 20);
                    ctx.font = "bold 13px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename, 60, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 5;
                    ctx.beginPath();
                    ctx.moveTo(10, height);
                    ctx.lineTo(170, height);
                    ctx.closePath();
                    ctx.stroke();
                }
                {
                    height += 20;
                    ctx.font = "normal 3px sans-serif";
                    ctx.fillText(dataobj.quality1, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality2, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality3, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality4, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality5, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality6, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality7, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality8, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality9, 50, height);
                    height += 8;
                    ctx.fillText(dataobj.quality10, 50, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 20;
                    ctx.fillText("QUAL..", 20, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 5;
                    ctx.beginPath();
                    ctx.moveTo(10, height);
                    ctx.lineTo(170, height);
                    ctx.closePath();
                    ctx.stroke();
                }
                {
                    height += 15;
                    ctx.font = "normal 15px sans-serif";
                    ctx.fillText(dataobj.highlighting, 60, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 15;
                    ctx.fillText(dataobj.origin, 10, height);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.colorcode, 10, height);
                    ctx.fillText(dataobj.colorname, 40, height);
                    ctx.fillText(dataobj.exsize1, 100, height);
                }
                {
                    height += 10;
                    ctx.fillText(dataobj.divcode.slice(-1) + dataobj.ctgcode + " " + String(dataobj.year%10) + dataobj.season + dataobj.salelimit + " " + dataobj.vendorcode, 10, height);
                }
                {
                    height += 10;
                    barcode(ctx, 30, height, 30, 110);
                }
                {
                    height += 40;
                    ctx.fillText(dataobj.tagcode, 50, height);
                }
                {
                    height += 30;
                    ctx.font = "normal 15px sans-serif";
                    ctx.fillText("本体", 40, height);
                    ctx.fillText("￥" + formatprice(dataobj.saleam) + "+税", 80, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 15;
                    ctx.fillText("PRICE", 20, height);
                    ctx.fillText("(税込　￥" + formatprice(dataobj.saleamintax) + ")", 80, height);
                }
                {
                    height += 5;
                    ctx.beginPath();
                    ctx.moveTo(10, height);
                    ctx.lineTo(170, height);
                    ctx.closePath();
                    ctx.stroke();
                }
            };
            function pattern815(ctx) {
                var height = 0;
                {
                    height += 20;
                    ctx.fillText(dataobj.makercode, 80, height+10);

                    ctx.strokeRect(180, height, 60, 40);
                    ctx.font = "bold 22px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename.slice(0,5), 185, height+30);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 22;
                    ctx.fillText(dataobj.colorcode, 80, height);
                    ctx.fillText(dataobj.colorname, 110, height);
                }
                {
                    height += 12;
                    ctx.fillText(dataobj.divcode.slice(-1) + dataobj.ctgcode + " " + String(dataobj.year%10) + dataobj.season + dataobj.salelimit + " " + dataobj.vendorcode, 80, height);
                }
                {
                    height += 16;
                    ctx.fillText(dataobj.origin, 80, height);
                    ctx.fillText(dataobj.exsize1, 180, height);
                }
                {
                    height += 5;
                    barcode(ctx, 80, height, 30, 140);
                }
                {
                    height += 40;
                    ctx.fillText(dataobj.tagcode, 110, height);
                }
                {
                    height += 20;
                    ctx.font = "bold 10px sans-serif";
                    ctx.fillText("PRICE", 40, height);
                    ctx.font = "normal 10px sans-serif";
                    ctx.fillText("本体" + " ￥" + formatprice(dataobj.saleam) + "+税" + "(税込　￥" + formatprice(dataobj.saleamintax) + ")", 80, height);
                }
            };
            function pattern831(ctx) {
                var height = 0;
                {
                    height += 20;
                    ctx.fillText(dataobj.makercode, 10, height+10);

                    ctx.strokeRect(95, height, 95, 40);
                    ctx.fillText("SIZE", 100, height+30);
                    ctx.font = "bold 22px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename.slice(0,5), 140, height+30);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 25;
                    ctx.fillText(dataobj.colorcode, 10, height);
                    ctx.fillText(dataobj.colorname, 40, height);
                }
                {
                    height += 15;
                    ctx.fillText(dataobj.divcode.slice(-1) + dataobj.ctgcode + " " + String(dataobj.year%10) + dataobj.season + dataobj.salelimit + " " + dataobj.vendorcode, 10, height);
                }
                {
                    height += 15;
                    ctx.fillText(dataobj.origin, 10, height);
                    ctx.fillText(dataobj.exsize1, 100, height);
                }
                {
                    height += 5;
                    barcode(ctx, 30, height, 30, 140);
                }
                {
                    height += 40;
                    ctx.fillText(dataobj.tagcode, 60, height);
                }
                {
                    height += 20;
                    ctx.font = "bold 10px sans-serif";
                    ctx.fillText("PRICE", 20, height+5);
                    ctx.font = "normal 10px sans-serif";
                    ctx.fillText("本体", 60, height);
                    ctx.font = "bold 15px sans-serif";
                    ctx.fillText("￥" + formatprice(dataobj.saleam) + "+税", 100, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 10;
                    ctx.fillText("(税込　￥" + formatprice(dataobj.saleamintax) + ")", 100, height);
                }
                {
                    height += 20;
                    barcode(ctx, 110, height, 30, 50);
                }
            };
            function pattern832(ctx) {
                var height = 0;
                {
                    height += 20;
                    ctx.fillText(dataobj.makercode, 10, height+10);

                    ctx.strokeRect(95, height, 95, 40);
                    ctx.fillText("SIZE", 100, height+30);
                    ctx.font = "bold 22px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename.slice(0,5), 140, height+30);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 25;
                    ctx.fillText(dataobj.colorcode, 10, height);
                    ctx.fillText(dataobj.colorname, 40, height);
                }
                {
                    height += 15;
                    ctx.fillText(dataobj.divcode.slice(-1) + dataobj.ctgcode + " " + String(dataobj.year%10) + dataobj.season + dataobj.salelimit + " " + dataobj.vendorcode, 10, height);
                }
                {
                    height += 15;
                    ctx.fillText(dataobj.origin, 10, height);
                    ctx.fillText(dataobj.exsize1, 100, height);
                }
                {
                    height += 15;
                    barcode(ctx, 30, height, 30, 140);
                }
                {
                    height += 40;
                    ctx.fillText(dataobj.tagcode, 60, height);
                }
            };
            function pattern833(ctx) {
                var height = 0;
                {
                    height += 20;
                    ctx.fillText(dataobj.makercode, 10, height+10);

                    ctx.strokeRect(95, height, 95, 40);
                    ctx.fillText("SIZE", 100, height+30);
                    ctx.font = "bold 22px 'ＭＳ Ｐゴシック'";
                    ctx.fillText(dataobj.sizename.slice(0,5), 140, height+30);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 25;
                    ctx.fillText(dataobj.colorcode, 10, height);
                    ctx.fillText(dataobj.colorname, 40, height);
                }
                {
                    height += 15;
                    ctx.fillText(dataobj.divcode.slice(-1) + dataobj.ctgcode + " " + String(dataobj.year%10) + dataobj.season + dataobj.salelimit + " " + dataobj.vendorcode, 10, height);
                }
                {
                    height += 15;
                    ctx.fillText(dataobj.origin, 10, height);
                    ctx.fillText(dataobj.exsize1, 100, height);
                }
                {
                    height += 5;
                    barcode(ctx, 30, height, 30, 140);
                }
                {
                    height += 40;
                    ctx.fillText(dataobj.tagcode, 60, height);
                }
                {
                    height += 20;
                    ctx.font = "bold 10px sans-serif";
                    ctx.fillText("PRICE", 20, height+5);
                    ctx.font = "normal 10px sans-serif";
                    ctx.fillText("本体", 60, height);
                    ctx.font = "bold 15px sans-serif";
                    ctx.fillText("￥" + formatprice(dataobj.saleam) + "+税", 100, height);
                    ctx.font = "normal 10px sans-serif";
                }
                {
                    height += 10;
                    ctx.fillText("(税込　￥" + formatprice(dataobj.saleamintax) + ")", 100, height);
                }
                {
                    height += 20;
                    barcode(ctx, 110, height, 30, 50);
                }
            };
            var canvas = document.createElement("canvas");
            switch (pattern) {
                // AOKI
                case "111":
                    canvas.width=150;
                    canvas.height=300;
                    break;
                case "112":
                    canvas.width=150;
                    canvas.height=300;
                    break;
                case "113":
                    canvas.width=150;
                    canvas.height=300;
                    break;
                case "114":
                case "115":
                    canvas.width=150;
                    canvas.height=300;
                    break;
                case "116":
                    canvas.width=300;
                    canvas.height=180;
                    break;
                case "131":
                    canvas.width=150;
                    canvas.height=230;
                    break;
                case "132":
                    canvas.width=150;
                    canvas.height=100;
                    break;
                case "133":
                    canvas.width=150;
                    canvas.height=230;
                    break;
                case "171":
                case "172":
                case "173":
                case "174":
                case "175":
                case "176":
                    canvas.width=150;
                    canvas.height=100;
                    break;
                // ORIHIKA
                case "811":
                    canvas.width=180;
                    canvas.height=340;
                    break;
                case "812":
                case "813":
                case "814":
                    canvas.width=180;
                    canvas.height=340;
                    break;
                case "815":
                case "816":
                    canvas.width=250;
                    canvas.height=150;
                    break;
                case "831":
                    canvas.width=200;
                    canvas.height=230;
                    break;
                case "832":
                    canvas.width=200;
                    canvas.height=160;
                    break;
                case "833":
                    canvas.width=200;
                    canvas.height=230;
                    break;
            }
            if (canvas.getContext){
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#000000";
                ctx.strokeRect(3, 3, canvas.width - 6, canvas.height-6);
                ctx.font = "normal 10px sans-serif";
                switch (pattern) {
                    // AOKI
                    case "111":
                        pattern111(ctx);
                        break;
                    case "112":
                        pattern112(ctx);
                        break;
                    case "113":
                        pattern113(ctx);
                        break;
                    case "114":
                    case "115":
                        pattern114(ctx);
                        break;
                    case "116":
                        pattern116(ctx);
                        break;
                    case "131":
                        pattern131(ctx);
                        break;
                    case "132":
                        pattern132(ctx);
                        break;
                    case "133":
                        pattern133(ctx);
                        break;
                    case "171":
                    case "172":
                    case "173":
                    case "174":
                    case "175":
                    case "176":
                        break;
                    // ORIHIKA
                    case "811":
                        pattern811(ctx);
                        break;
                    case "812":
                    case "813":
                    case "814":
                        pattern812(ctx);
                        break;
                    case "815":
                    case "816":
                        pattern815(ctx);
                        break;
                    case "831":
                        pattern831(ctx);
                        break;
                    case "832":
                        pattern832(ctx);
                        break;
                    case "833":
                        pattern833(ctx);
                        break;
                }
            }
            return canvas.toDataURL();
		},

		/**
		 * タグ確認イベント
		 * @param e
		 */
		_onViewTagClick: function(e) {
			if (!$('#ca_tagIssueFlag').prop('checked')) {
				return;
			}
			var ids = $("#ca_tagTypeID").val();
			if (ids == null) {
				return;
			}
			var tagTypeID = Number(ids[0]);
			var tagTypeCode = this.getTagTypeCode();
			var tagTypeCode_n = Number(tagTypeCode);
			var dataObj = null;

			switch (tagTypeID) {
			case amcm_type.AMCM_VAL_TAG_SUIT:
			case amcm_type.AMCM_VAL_TAG_FORMAL:
			case amcm_type.AMCM_VAL_TAG_SMX:
			case amcm_type.AMCM_VAL_TAG_PRICE:
			case amcm_type.AMCM_VAL_TAG_SHIRT:
			case amcm_type.AMCM_VAL_TAG_SLACKS:
			case amcm_type.AMCM_VAL_TAG_GOODS:
			case amcm_type.AMCM_VAL_TAG_BOX:
			case amcm_type.AMCM_VAL_TAG_HAND:
			case amcm_type.AMCM_VAL_TAG_AT_BIG:
			case amcm_type.AMCM_VAL_TAG_AT_BIG_1:
			case amcm_type.AMCM_VAL_TAG_AT_MIDDLE:
			case amcm_type.AMCM_VAL_TAG_AT_SMALL:
			case amcm_type.AMCM_VAL_TAG_AT_GOODS:
			case amcm_type.AMCM_VAL_TAG_AT_GOODS_WEAK:
				dataObj = this.createTagImageData111(tagTypeCode_n);
				break;
			case amcm_type.AMCM_VAL_TAG_ORBUS1:
			case amcm_type.AMCM_VAL_TAG_ORBUS2:
			case amcm_type.AMCM_VAL_TAG_ORGARAGE:
			case amcm_type.AMCM_VAL_TAG_ORRHYME:
			case amcm_type.AMCM_VAL_TAG_ORGOODSBUS:
			case amcm_type.AMCM_VAL_TAG_ORGOODSRHYME:
			case amcm_type.AMCM_VAL_TAG_ORGARAGE:
			case amcm_type.AMCM_VAL_TAG_ORLABEL:
			case amcm_type.AMCM_VAL_TAG_ORBOX:
			case amcm_type.AMCM_VAL_TAG_ORHAND:
				dataObj = this.createTagImageData811(tagTypeCode_n);
				break;
			default:
				return;
			}

			var $tagImage = $("#tagImage");
			var src = this.toTagDataURL(dataObj, tagTypeCode);
			$tagImage.attr('src', src);

			$('.balloonBox').fadeToggle();

		},

		/**
		 * 上代履歴を表示イベント
		 * @param e
		 */
		_onPriceHistClick: function(e) {
			// 1.条件取得
			var itemID = $("#ca_itemID").val();

			if (itemID == null) {
				return;
			}

			var req = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
				AMMSV0100GetReq: {
				},
				// 商品分類マスタ更新リクエスト
				AMMSV0100UpdReq: {
				},
				AMMSV0100FormatGetReq: {
				},
				AMMSV0100SizeGetReq:{
				},
				AMMSV0100TagAddrGetReq:{
				},
				AMMSV0100PriceHistGetReq:{
					srchID: itemID
				},
				AMMSV0100SizeGetReq:{
				},
			};
			var uri = "AMMSV1100";

			// 2.リクエスト発行
			clutil.postJSON(uri, req).done(_.bind(function(data) {
				// 正常終了

				var AMMSV0100PriceHistGetRsp = data.AMMSV0100PriceHistGetRsp;
				this.priceHistList = AMMSV0100PriceHistGetRsp.histList;
				// 上代履歴ダイアログを表示する
				this.AMMSV1102Dialog.show(this.priceHistList, null);
			}, this)).fail(_.bind(function(data) {
				// エラー終了
				clutil.mediator.trigger('onTicker', data.rspHead);
			}, this));
		},

		sizeRowList: [],	// サイズ行レコード
		sizeColList: [],	// サイズ列レコード
		sizeRecList: [],	// サイズレコード
		tagAddrList: [],	// タグ送付先レコード

		/**
		 * サイズパターン変更イベント
		 * @param e
		 */
		_onSizePtnChange: function(e) {
			var _this = this;
			var $tgt = $(e.target);
			var $pdiv = $tgt.parents('div.fieldgroupInBox');
			var $table_size = $pdiv.find('table[name="ca_table_size"]');
			var $thead_size = $table_size.children('thead');
			var $tbody_size = $table_size.children('tbody');

			var $thead_jan = $pdiv.find('thead[name="ca_table_jan_thead"]');
			var $tbody_jan = $pdiv.find('tbody[name="ca_table_jan_thead"]');
			$thead_jan.empty();
			$tbody_jan.empty();

			var id = $tgt.val();
			var srchDate = clutil.dateFormat($("#ca_fromDate").val(), 'yyyymmdd');
			if (!srchDate) {
				srchDate = clcom.getOpeDate();
			}
			var AMMSV0100SizeGetReq = {
				srchSizePtnID: id,
				srchDate: srchDate,
			};
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				AMMSV0100SizeGetReq: AMMSV0100SizeGetReq,
			};

			// 1. リクエストを投げる
			var uri = "AMMSV1100";
			return clutil.postJSON(uri, req).done(_.bind(function(data) {
				// 2. リプライを受け取る
				var sizeRsp = data.AMMSV0100SizeGetRsp;
				if (sizeRsp != null) {
					_this.sizeRowList = sizeRsp.sizeRowList;
					_this.sizeColList = sizeRsp.sizeColList;
					_this.sizeRecList = sizeRsp.sizeRecList;
				} else {
					// なんかデータがないみたいだから空にする
					// まあここには来ないだろうけど
					_this.sizeRowList = [];
					_this.sizeColList = [];
					_this.sizeRecList = [];
				}
				// 3. テーブルの描画(サイズテーブル)
				_this.renderTableSize($thead_size, $tbody_size, _this.sizeRowList, _this.sizeColList, _this.sizeRecList, _this.curGroupNO);

			}, this)).fail(_.bind(function(data) {

			}, this));

		},

		/**
		 * カラー・サイズを追加イベント
		 * @param e
		 */
		_onAddColorSizeClick: function(e) {
			var $div_cs = $('div[name="div_colorsize"]');

			this.curGroupNO++;
			this.groupNoList.push(this.curGroupNO);
			var obj = { groupNo: this.curGroupNO };
			var html = _.template(this.$("#ca_rec_template_colorsize").html(), obj);
			$div_cs.append(html);

			// カラーテーブルの描画処理は不要→デフォルト5行表示
			var $table_color = $div_cs.find('table[name="ca_table_color"]:last');
			var $tbody_color = $table_color.children('tbody');

			this.renderTableColor($tbody_color, [], null, 0);


			var $div_size = $div_cs.find('div[name="div_size"]:last');
			var $thead_size = $div_size.find('thead[name="ca_table_size_thead"]');
			var $tbody_size = $div_size.find('tbody[name="ca_table_size_tbody"]');

			// サイズテーブルの描画処理は必要
			this.renderTableSize($thead_size, $tbody_size, this.sizeRowList, this.sizeColList, this.sizeRecList, this.curGroupNO);

			$("#ca_inputJanFlag").trigger('change');
		},

		/**
		 * カラー・サイズを削除する
		 * @param e
		 */
		_onDelColorSizeClick: function(e) {
			var $del = $(e.target);
			var $tgt = $del.parents('div[name="div_colorsize_list"]');
			var $div_color = $tgt.find('div[name="div_color"]');
			var tgt_grpno = Number($div_color.attr('groupno'));

			if ($del.hasClass('readonly') || $del.parent().hasClass('readonly')) {
				return;
			}

			$tgt.remove();	// 削除

			// grouNoListから削除
			var index = $.inArray(tgt_grpno, this.groupNoList);
			if (index >= 0) {
				this.groupNoList.splice(index, 1);
			}

			// 発注テーブルの再描画
			this.renderOrderTablesByColorSizeChange();

		},

		/**
		 * 発注情報を追加
		 * @param e
		 */
		_onAddOrderInfoClick: function(e) {
			/*
			 * 1. 最後のdiv_order_info_listを取得
			 * 2. ca_copyの値を取得
			 * 3. 新しいdiv_order_info_listを描画
			 */
			var $div_order_info = $('div[name="div_order_info"]');
			var $div_prev = $div_order_info.find('div[name="div_order_info_list"]:last');
			var checked = $("#ca_copy").prop("checked") ? 1 : 0;
			this.curOrderSeq++;
			var orderSeq = this.curOrderSeq;
			var makerObj = $("#ca_makerID").autocomplete('clAutocompleteItem');
			var makerID = makerObj != null && makerObj.id != null ? makerObj.id : -1;

			var orderHeadRec = null;
			var info = null;

			if (checked) {
				var orderTgtTypeID = $div_prev.find('select[name0="ca_orderTgtTypeID"]').val();
				var tagaddrNo = $div_prev.find('select[name0="ca_tagaddrNo"]').val();
				var approveLimitDate = clutil.dateFormat($div_prev.find('input[name0="ca_orderLimitDate"]').val(), 'yyyymmdd');
				var finishDate = clutil.dateFormat($div_prev.find('input[name0="ca_finishDate"]').val(), 'yyyymmdd');
				var centerDlvDate = clutil.dateFormat($div_prev.find('input[name0="ca_centerDlvDate"]').val(), 'yyyymmdd');
				var dlvDate = clutil.dateFormat($div_prev.find('input[name0="ca_dlvDate"]').val(), 'yyyymmdd');
				var tagIncRate = $div_prev.find('input[name0="ca_tagIncRate"]').val();
				var cancelFlag = $div_prev.find('input[name0="ca_cancelFlag"]').prop("checked") ? 1 : 0;
				// orderNoはコピー対象外とする #20140926
				//var orderNo = $div_prev.find('input[name0="ca_orderNo"]').val();
				// ここでorderNoが0になるのでカットする #20140922
				////orderNo = _.isNumber(orderNo) ? orderNo : 0;

				orderHeadRec = {
					orderSeq: orderSeq,
					orderTgtTypeID: orderTgtTypeID,
					centerDlvDate: centerDlvDate,
					dlvDate: dlvDate,
					finishDate: finishDate,
					orderDate: 0,
					//orderNo: 0,
					orderNo: "",
					tagIncRate: tagIncRate,
					tagaddrNo: tagaddrNo,
					tagaddrName: "",
					cancelFlag: cancelFlag,
					approveFlag: 0,
				};
				info = {
					approveLimitDate: approveLimitDate,
				};
			} else {
				orderHeadRec = {
					orderSeq: orderSeq,
					orderTgtTypeID: 0,
					approveLimitDate: 0,
					centerDlvDate: 0,
					dlvDate: 0,
					finishDate: 0,
					orderDate: 0,
					orderNo: "",
					tagIncRate: 0,
					tagaddrNo: 0,
					tagaddrName: "",
					cancelFlag: 0,
					approveFlag: 0,
				};
				info = {
					approveLimitDate: 0,
				};
			}
			var orderDtlList = [];

			var maps = this.scanColorSizeInfo();

//			for (var i = 1; i < this.groupNoList.length; i++) {
//				var grpno = this.groupNoList[i];
//				grpno2tgtColor[grpno] = [];
//
//				// 該当グループのカラーテーブルを調べる
//				var $div_color = $('div[name="div_color",groupno="' + grpno + '"]');
//				var $tbody_color = $div_color.find('tbody[name="ca_table_color_tbody"]');
//				var tmp_colorID = 0;
//				$.each($tbody_color.find('tr'), function() {
//					var $select = $(this).find('select[name="ca_colorID"]');
//					var colorID = $select.val();
//					var tgtColor = {
//						colorID: colorID,
//						groupNo: grpno,
//					};
//					grpno2tgtColor[grpno].push(tgtColor);
//					if (tmp_colorID == 0) {
//						tmp_colorID = colorID;
//						cID2tgtSize[colorID] = [];
//					}
//				});
//
//				var $tbody_size = $div_color.find('tbody[name="ca_table_size_tbody"]');
//				$.each($tbody_size.find('input[name="select_col"]:checked'), function() {
//					var $checkbox = $(this);
//					var colorID = $checkbox.attr('colorID');
//					var sizeID = $checkbox.attr('sizeID');
//					var tgtSize = {
//						tgtColorID: colorID,
//						tgtSizeID: sizeID,
//					};
//					cID2tgtSize[colorID].push(tgtSize);
//				});
//			}

			this.renderOrderInfoList(orderHeadRec, orderDtlList, this.groupNoList, maps.grpno2tgtColor, maps.cID2tgtSize, makerID, info);

			// 追加ボタンを非表示にする
			$("#div_addOrderInfo").hide();

			this._onOrderFlagChange2();

			// MD-3529 商品マスタ「タグ送付先」の入力制御変更_PGM開発：タグ送付先の必須設定制御
			this.setTagAddrNoRequired();
		},


		/**
		 * 仕入無しフラグ変更イベント
		 * @param e
		 */
		_onOrderFlagChange2: function() {
			var $tgt = $("#ca_orderFlag");

			var $div = $('div[name="div_order_info_list"]:last');
			var $div_dlvDate = $div.find('div[name="div_ca_dlvDate"]');
			var $ca_dlvDate = $div.find('input[name0="ca_dlvDate"]');
			var $div_tagIncRate = $div.find('div[name="div_ca_tagIncRate"]');
			var $ca_tagIncRate = $div.find('input[name0="ca_tagIncRatee"]');
			var $div_orderTgtType = $div.find('div[name0="div_ca_orderTgtTypeID"]');
			var $ca_orderTgtType = $div.find('select[name0="ca_orderTgtTypeID"]');

			if ($tgt.prop('checked')) {

				// タグ発行はオフにする
				$("#ca_tagIssueFlag").attr('checked', false).closest("label").removeClass("checked");
				// 商品区分は「定番」にする
				$("#ca_itemTypeID").selectpicker('val', amcm_type.AMCM_VAL_ITEM_REGULAR);
				// KI区分は「買取」にする
				$("#ca_kiTypeID").selectpicker('val', amcm_type.AMCM_VAL_KI_PURCHASE);
				// 生産国は「その他」
				$("#ca_importID").selectpicker('val', IMPORT_ID_OTHER);	// シスパラにすべきか？
				// 縫製工場は「その他」
				$("#ca_factoryID").selectpicker('val', FACTORY_ID_OTHER);	// シスパラにすべきか？


				// 仕入なしなので以下の項目を入力不可にする

				// タグ情報
				clutil.viewReadonly($("#ca_tagInfo"));

				// 発注情報
				clutil.viewReadonly($("#ca_orderInfo"));

				// 下代構成
				clutil.viewReadonly($("#cost_info"));

				// 商品区分
				clutil.viewReadonly($("#ca_itemTypeID").parent());

				/*
				 * 必須を落とす
				 */
				// 発注ロット単位数
				$("#div_ca_lotCount").removeClass('required');
				$("#ca_lotCount").removeClass('cl_required');
				// 納品形態（初回）
				$("#div_ca_dlvroute1TypeID").removeClass('required');
				$("#ca_dlvroute1TypeID").removeClass('cl_required');
				$("#ca_dlvroute1TypeID").selectpicker('refresh');
				// 納品形態（二回目以降）
				$("#div_ca_dlvroute2TypeID").removeClass('required');
				$("#ca_dlvroute2TypeID").removeClass('cl_required');
				$("#ca_dlvroute2TypeID").selectpicker('refresh');
				// 発注対象
				$div_orderTgtType.removeClass('required');
				$ca_orderTgtType.removeClass('cl_required');
				$ca_orderTgtType.selectpicker('refresh');
				// 製品仕上げ日
				$div.find('div[name0="div_ca_finishDate"]').removeClass('required');
				$div.find('input[name0="ca_finishDate"]').removeClass('cl_required');
				// 仕入予定日を任意にする
				$div_dlvDate.removeClass('required');
				$ca_dlvDate.removeClass('cl_required');
				// タグ増産率
				$div_tagIncRate.removeClass('required');
				$ca_tagIncRate.removeClass('cl_required');
			} else {
				// 仕入ありなので以下の項目を入力可にする

				// タグ情報
				//clutil.viewReadonly($("#ca_tagInfo"));

				// 発注情報
				//clutil.viewReadonly($("#ca_orderInfo"));
				// 発注日は入力不可（なんかいい方法ないかな？）
				clutil.inputReadonly($('input[name0="ca_orderDate"]'));

				// 商品区分
				//clutil.viewReadonly($("#ca_itemTypeID").parent());

				// 下代構成
				//clutil.viewReadonly($("#cost_info"));

				/*
				 * 必須
				 */
				// 発注ロット単位数
				$("#div_ca_lotCount").addClass('required');
				$("#ca_lotCount").addClass('cl_required');
				// 納品形態（初回）
				$("#div_ca_dlvroute1TypeID").addClass('required');
				$("#ca_dlvroute1TypeID").addClass('cl_required');
				$("#ca_dlvroute1TypeID").selectpicker('refresh');
				// 納品形態（二回目以降）
				$("#div_ca_dlvroute2TypeID").addClass('required');
				$("#ca_dlvroute2TypeID").addClass('cl_required');
				$("#ca_dlvroute2TypeID").selectpicker('refresh');
				// 発注対象
				$div_orderTgtType.addClass('required');
				$ca_orderTgtType.addClass('cl_required');
				$ca_orderTgtType.selectpicker('refresh');
				// 製品仕上げ日
				$div.find('div[name0="div_ca_finishDate"]').addClass('required');
				$div.find('input[name0="ca_finishDate"]').addClass('cl_required');
				// 仕入予定日を必須にする
				$div_dlvDate.addClass('required');
				$ca_dlvDate.addClass('cl_required');
				// タグ増産率
				$div_tagIncRate.addClass('required');
				$ca_tagIncRate.addClass('cl_required');
			}
		},

		/**
		 * カラーテーブルのカラー変更イベント
		 */
		_onColorIDChanged: function(e) {
			/*
			 * 1.JANテーブルの再描画
			 * 2.カラーサイズ別発注テーブルの再描画
			 */
			var $tgt = $(e.target);
			var $tbody_color = $tgt.parents('tbody');
			var $pdiv = $tgt.parents('div[name="div_colorsize_list"]');
			var $table_size = $pdiv.find('table[name="ca_table_size"]');
			var $tbody_size = $table_size.children('tbody');
			var $table_jan = $pdiv.find('table[name="ca_table_jan"]');
			var $thead_jan = $table_jan.children('thead');
			var $tbody_jan = $table_jan.children('tbody');

			// 現在のJANテーブルの内容を取得する
			var csitemList = this.view2dataJanTable($tbody_jan);

			this.renderTableJan($thead_jan, $tbody_jan, $tbody_color, $tbody_size, this.sizeRecList, csitemList);

			this.renderOrderTablesByColorSizeChange();
		},

		/**
		 * サイズテーブルのチェックボックス変更イベント
		 */
		_onSelectColChanged: function(e) {
			/*
			 * 1.JANテーブルの再描画
			 * 2.カラーサイズ別発注テーブルの再描画
			 */
			var $tgt = $(e.target);
			var $tbody_size = $tgt.parents('tbody');
			var $pdiv = $tgt.parents('div[name="div_colorsize_list"]');
			var $table_color = $pdiv.find('table[name="ca_table_color"]');
			var $tbody_color = $table_color.children('tbody');
			var $table_jan = $pdiv.find('table[name="ca_table_jan"]');
			var $thead_jan = $table_jan.children('thead');
			var $tbody_jan = $table_jan.children('tbody');

			// 現在のJANテーブルの内容を取得する
			var csitemList = this.view2dataJanTable($tbody_jan);

			this.renderTableJan($thead_jan, $tbody_jan, $tbody_color, $tbody_size, this.sizeRecList, csitemList);

			this.renderOrderTablesByColorSizeChange();
		},

		/**
		 * 限定店舗商品変更イベント
		 * @param e
		 */
		_onLimitFlagChanged: function(e) {
			var $tgt = $(e.target);

			if ($tgt.prop('checked')) {
				$("#div_tgt_store").show();
			} else {
				$("#div_tgt_store").hide();
				// 消す時に限定店舗の内容を消去する
				var $tbody = $("#ca_table_tgt_tbody");
				var obj = {
					id: 0,
					code: "",
					name: "",
				};
				var $input = $tbody.find('input[name="ca_tgtOrgID"]');
				$input.autocomplete('clAutocompleteItem', obj);
			}
		},

		/**
		 * 画像選択ダイアログ表示
		 * @param e
		 */
		_onPhotoSelectClick: function(e) {
			var $tgt = $(e.target);
			if ($tgt.hasClass('notDialog')) {
				return;
			}
			var readonly = (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY
					|| this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) ? false : true;
			var options = {
				readonly: readonly,
			};
			this.AMMSV1101Dialog.show(this.photoList, null, options);
		},

		/**
		 * 組合せ販売選択ダイアログ表示
		 * @param e
		 */
		_onBundleViewClick: function(e) {
			this.AMPAV0070Dialog.show();
		},

		/**
		 * 上代の税剥がし処理
		 * @param e
		 */
		_onPriceIntaxChange: function(e) {
			var $tgt = $(e.target);		// 上代

			var maker = $("#ca_makerID").autocomplete('clAutocompleteItem');
			var maker_id = 0;
			if (maker && maker.id) {
				maker_id = maker.id;
			}
			var taxrt = this.getTaxRate(maker_id, clcom.getOpeDate());

			var priceIntax = $.inputlimiter.unmask($tgt.val(), {
				limit: $tgt.attr('data-limit'),
				filter: $tgt.attr('data-filter')
			});
			var price = 0;
			if (priceIntax == null || priceIntax == "") {
				price = "";
			} else {
				try {
					priceIntax = parseInt(priceIntax);
				} catch (e) {
					priceIntax = 0;
				}
				var retObj = clutil.parseTax(priceIntax, taxrt);
				price = retObj.withoutTax;
			}
			var val = _.isNaN(price) ? "" : clutil.comma(price);
			$("#ca_price").val(val);

			// 経準率の計算
			this._onProfitRateCalc();
		},

		/**
		 * 上代(税抜)の税込処理
		 * @param e
		 */
		_onPriceChange: function(e) {
			var $tgt = $(e.target);		// 上代(税抜)

			var maker = $("#ca_makerID").autocomplete('clAutocompleteItem');
			var maker_id = 0;
			if (maker && maker.id) {
				maker_id = maker.id;
			}
			var taxrt = this.getTaxRate(maker_id, clcom.getOpeDate());

			var price = $.inputlimiter.unmask($tgt.val(), {
				limit: $tgt.attr('data-limit'),
				filter: $tgt.attr('data-filter')
			});
			var priceIntax = 0;
			if (price == null || price == "") {
				priceIntax = "";
			} else {
				try {
					price = parseInt(price);
				} catch (e) {
					price = 0;
				}
				var retObj = clutil.mergeTax(price, taxrt);
				priceIntax = retObj.withTax;
			}
			var val = _.isNaN(priceIntax) ? "" : clutil.comma(priceIntax);
			$("#ca_priceIntax").val(val);

			// 経準率の計算
			this._onProfitRateCalc();
		},

		/**
		 * 下代（税抜）に変更イベント
		 * @param e
		 */
		_onCostChange: function(e) {
			// 下代の税込み処理はない

			// 経準率の計算
			this._onProfitRateCalc();
		},

		/**
		 * 経準率の計算
		 */
		_onProfitRateCalc: function() {
			var $cost = $("#ca_cost");
			var $price = $("#ca_price");

			var cost = $.inputlimiter.unmask($cost.val(), {
				limit: $cost.attr('data-limit'),
				filter: $cost.attr('data-filter')
			});
			try {
				cost = parseInt(cost);
			} catch (e) {
			}
			var price = $.inputlimiter.unmask($price.val(), {
				limit: $price.attr('data-limit'),
				filter: $price.attr('data-filter')
			});
			try {
				price = parseInt(price);
			} catch (e) {
			}
			var profitRate = "";
			if (price != 0) {
				profitRate = (price - cost) / price;
				// 少数第2位を四捨五入 TODO
				profitRate = (Math.round(profitRate*1000) / 10);
			}
			var val = _.isNaN(profitRate) ? "" : profitRate;
			$("#ca_profitRate").val(val);
		},

		/**
		 * 納品形態変更イベント
		 */
		_onDlvrouteTypeChange: function() {
			// 納品形態のどちらかに店直以外があったら、振分先を必須にする
			var dlvroute1 = $("#ca_dlvroute1TypeID").val();
			var dlvroute2 = $("#ca_dlvroute2TypeID").val();

			var $ca_centerID = $("#ca_centerID");
			var $div = $("#div_ca_centerID");

			dlvroute1 = Number(dlvroute1);
			dlvroute1 = _.isNaN(dlvroute1) ? 0 : dlvroute1;
			dlvroute2 = Number(dlvroute2);
			dlvroute2 = _.isNaN(dlvroute2) ? 0 : dlvroute2;

			if ((dlvroute1 > 0 && dlvroute1 != amcm_type.AMCM_VAL_DLV_ROUTE_DIRECT)
					|| (dlvroute2 > 0 && dlvroute2 != amcm_type.AMCM_VAL_DLV_ROUTE_DIRECT)) {
				$ca_centerID.addClass('cl_required');	// cl_validは着いている
				$div.addClass('required');
			} else {
				$ca_centerID.removeClass('cl_required');	// cl_validは着けておく
				$div.removeClass('required');
			}
		},

		/**
		 * 事業ユニット変更イベント
		 * @param e
		 */
		_onUnitIDChange: function(e) {
			var $tgt = $(e.target);
			var val = $tgt.val();

			if (val == this.UNITID_ORI) {
				// 事業ユニットがORIHICAの場合は糸LOXを表示する
				$("#div_ca_itoloxID").show();
				// 素材詳細を表示する
				//$("#div_ca_table_material").show();
				// 強調表示を表示する
				//$("#div_ca_tagHighlight").show();
			} else {
				// 事業ユニットがORIHICA以外の場合は糸LOXを非表示にする
				$("#div_ca_itoloxID").hide();
				$("#ca_itoloxID").selectpicker('val', 0);
				// 素材詳細を非表示する
				//$("#div_ca_table_material").hide();
				// 強調表示を非表示する
				//$("#div_ca_tagHighlight").hide();
				//$("#ca_tagHighlist").val('');
			}
		},

		/**
		 * フッター押下
		 */
		_doOpeAction: function(rtyp, e){
			// ope_btn 系
			switch(rtyp){
			case 201:	// CSV
			case 202:	// CSV
				this.doDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(rtyp){
			// リクエストをつくる
			var getReq = this.savedReq.AMMSV0100GetReq;
			if (rtyp == 201) {
				getReq.reportType = 1;	// A4
			} else {
				getReq.reportType = 2;	// B4
			}

			var pdfGetReq = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF
				},
				reqPage: {
				},
				AMMSV0100GetReq: getReq,
			};

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMMSV1100', pdfGetReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		msgcd2msg: function (msgcd) {
			var fmtargs = _.toArray(arguments);
			var msg;
			fmtargs[0] = clmsg['cl_'+msgcd];
			if (fmtargs[0] == null) {
				// メッセージが整備されていない場合 => メッセージの更新が必要
				console.warn("No message code `" +  msgcd + '`');
				fmtargs[0] = "XXXX";
			}
			msg = clutil.fmt.apply(this, fmtargs);			   // 項目名ラベルなし
			return msg;
		},

		/**
		 * 一時保存の場合の入力チェック
		 * @param option
		 * @return 1:警告 0:正常 -1:エラー
		 */
		myValid: function(options) {
			var ret = 0;
			var _this = this;

			options = options || {};
			_.defaults(options, {$el: null, filter: function() {return true;}});

			setError = function (input, msgcd) {
				// この this は、$.each() 中の this っぽい？？？
				_this.validator.setErrorMsg($(input), _this.msgcd2msg(msgcd));
				ret = -1;
			},
			setWarn = function(input, msgcd) {
				/* 警告の場合は、赤くしないことにする */
				//_this.validator.setErrorMsg($(input), _this.msgcd2msg(msgcd));
				ret = ret < 0 ? ret : 1;
			};
			//alreadyErrored = (options.$el instanceof jQuery) ? options.$el.hasClass('cl_error_field') : false;

			callValidator = function (s, value) {
				var splitted = s.split(':'),
				args = (splitted[1] || '').split(','),
				funcName = splitted[0];
				args.unshift(value);
				var validateFunc = clutil.Validators[funcName];
                if (!validateFunc){
                    console.warn("Invalid validator name=", funcName);
                }
				if (validateFunc)
					return validateFunc.apply(clutil.Validators, args);
			};

			// 手抜き日本語のみ対応
			var dateToYmd = function(date) {
				try {
					return date.toLocaleString().split(' ')[0];
				} catch (e) {
					return date.toLocaleString();
				}
			};

			// エラー情報クリア - '.cl_valid' クラス一覧が返る。
			// '.cl_valid' クラスの入力を確認して、エラー情報を埋め込む
			//									  $('.cl_valid', this.form)
			this.validator.clear(options.$el)
			//.removeClass('cl_error_field')
			.filter(options.filter)
			.filter('.cl_cm_code_input')
			.each(function () {
				var $this = $(this),
				val = $this.val(),
				data = $this.data('cm_code'),
				id = data && data.id;
				if (val && !id) {
					// 共通部品コードセレクターでコードは入力済みだがidが設定されていない
					setError(this, 'cmcodeerror');
				} else if ($this.hasClass('cl_required') && !id) {
					setWarn(this, 'required');
				}
			})
			.end()
			.filter('.save_required')
			.each(function() {
				if (!$(this).val()) {
					setError(this, 'required');
				}
			})
			.end()
			// cl_required: 入力必須 //////////////////////
			.filter('.cl_required:not(.cl_cm_code_input)')
			.each(function(){
				var $this = $(this);
				var name = $this.attr('name');
				if (name == "ca_colorID" || name == "ca_makerColor") {
					// カラーIDとメーカーカラーはこの後でチェックする
					return;
				}
				if ($this.is('select') && $this.val() === '0') {
					setWarn(this, 'required');
					// AOKI
				} else if ($this.is('span')) {
					if ($this.html().length === 0) {
						setWarn(this, 'required');
					}
				} else if ($this.is('td')) {
					if (!clutil.chkStr($this.text())) {
						setWarn(this, 'required');
					}
				} else if (!$this.is('div') && !$(this).val()) {
					// selectpicker用にdivの場合は考えない
					setWarn(this, 'required');
				}
			})
			.end()
			// cl_length: 入力長制限 /////////////////////
			.filter('.cl_length')
			.each(function(){
				var len = $(this).val().length;
				var max = $(this).data('max');
				var min = $(this).data('min');
				var hasMax = _.isNumber(max);
				var hasMin = _.isNumber(min);
				if (hasMax && hasMin) {
					if (len < min) {
						// {0}が短すぎます。{1}～{2}文字で入力してください。
						setError(this, 'length_short2', min, max);
					} else if (len > max) {
						// {0}が長すぎます。{1}～{2}文字で入力してください。
						setError(this, 'length_long2', min, max);
					}
				} else if (hasMax) {
					if (len > max) {
						// {0}が長すぎます。{1}文字以下で入力してください。
						setError(this, 'length_long1', max);
					}
				} else if (hasMin) {
					// len == 0 は、cl_required (必須）でチェックすることとする！
					if (len > 0 && len < min) {
						// {0}が短すぎます。{1}文字以上で入力してください。
						setError(this, 'length_short1', min);
					}
				}
			})
			.end()
			.filter('[data-validator]')
			.each(function (i, el) {
				var $el = $(el),
					value = $el.val(),
					validator = $el.attr('data-validator');
				var error = clutil.Validators.checkAll({
					validator: validator,
					value: value,
					$el: $el
				});

				if (error) {
					_this.validator.setErrorMsg($el, error);
					ret = -1;
				}
			})
			.end()
			// cl_date: 日付 - datepicker によるもの ////
			.filter('.cl_date')
			.each(function(){
				var maxDate = $(this).datepicker("option", "maxDate");
				var minDate = $(this).datepicker("option", "minDate");
				var error = clutil.Validators.date(this.value, minDate, maxDate);
				if (error){
					_this.validator.setErrorMsg($(this), error);
					ret = -1;
				}
			})
			.end()
			// cl_date: YYYY/mm 形式のチェック
			.filter('.cl_ym')
			.each(function(){
				var value = $(this).val();
				if (value === '') {
					// 空欄はOKとする。必須とするなら、cl_required と併用すること
					return;
				}
				var match = value.match(/^([0-9]{4,4})\/([0-9]{2,2})$/);
				if (!match) {
					setError(this, 'month_inval');
					return;
				}
				console.log(match);
				var year = match[1],
				month = match[2];
				if (month < 1 || month > 12) {
					setError(this, 'month_inval');
				}
			})
			.end()
			.filter('.cl_month') // 月
			.each(function(){
				var value = $(this).val();
				if (value === '') {
					// 空欄はOKとする。必須とするなら、cl_required と併用すること
					return;
				}

				var date = value.split('/');
				if (date.length !== 2 || !/^[0-9]+$/.test(date[0]) ||
						!/^[0-9]+$/.test(date[1])) {
					setError(this, 'month_inval');
					return;
				}
				if (date[1] < 1 || date[1] > 12) {
					setError(this, 'month_inval');
					return;
				}
			})
			.end()

			.filter('.cl_time') // 時刻指定
			.each(function(){
				var value = $(this).val();
				if (value === '') {
					// 空欄はOKとする。必須とするなら、cl_required と併用すること
					return;
				}

				var date = value.split(':');
				if (date.length !== 2 || !/^[0-9]+$/.test(date[0]) ||
						!/^[0-9]+$/.test(date[1])) {
					setError(this, 'time_inval');
					return;
				}
				if (date[0] < 0 || date[0] > 23) {
					setError(this, 'time_inval');
					return;
				}
				if (date[1] < 0 || date[1] > 59) {
					setError(this, 'time_inval');
					return;
				}
			})
			.end()

			// cl_regex: 正規表現 ///////////////////////
			.filter('.cl_regex')
			.each(function(){
				var pat = $(this).data('pattern');
				var reg = new RegExp(pat);
				if (!reg.test($(this).val())) {
					// {0}の形式が誤っています。
					setError(this, 'regex');
				}
			})
			.end()

			// cl_autocomplete オートコンプリート /////
			.filter('.cl_autocomplete')
			.each(function(){
				if(!$(this).autocomplete('isValidClAutocompleteSelect')){
					setError(this, 'autocomplete_mismatch');
				}
			});

			_($('[data-required2]', this.form)).chain()
			.reduce(function (memo, element) {
				var attr = $(element).attr('data-required2');
				memo[attr] = (memo[attr] || []);
				memo[attr].push(element);
				return memo;
			}, {})
			.some(function (elements, key) {
				if (_.all(elements, function (element, id) {
					return $(element).val() === '';
				})) {
					_.each(elements, function (element) {
						setError(element, 'required2');
					});
					// すべてチェックするように修正 2013/07/11
//						return true;
				}
				// すべてチェックするように修正 2013/07/11
//					return false;
			})
			.value();

			return ret;
		},

		_eof: 'AMSSV0100.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////

		// 一覧画面からの引継データ pageArgs があれば渡す。
		//	pageArgs: {
		//		// 機能種別
		//		opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL,
		//		// 一覧画面で選択されたアイテム要素の配列
		//		chkData: [
		//			{id:1,code:'code-001',name:'item-001',},
		//			{id:2,code:'code-002',name:'item-002',},
		//			{id:3,code:'code-003',name:'item-003',}
		//		]
		//	};
		var pageArgs = clcom.pageArgs;
		mainView = new MainView(pageArgs).initUIElement().render();
	}).fail(function(data){
		// clcom のネタ取得に失敗。
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});
