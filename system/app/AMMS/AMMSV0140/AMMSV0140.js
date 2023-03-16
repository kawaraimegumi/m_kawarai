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

var MATERIAL_CODE_OTHER = '099';	/* 素材コード（その他） */
var IMPORT_CODE_JAPAN = '392';		/* 国コード（日本） */
var IMPORT_ID_OTHER = 21;			/* 国ID（その他） */
var FACTORY_ID_OTHER = 32767;		/* 縫製工場ID（その他） */

var OpeType = {
	AMMSV0140_OPETYPE_TMP_SAVE:		101,	// 保存
	AMMSV0140_OPETYPE_TAG_APPLY:	102,	// タグ発行申請
	AMMSV0140_OPETYPE_TAG_RETURN:	103,	// タグ発行差戻し
	AMMSV0140_OPETYPE_TAG_APPROVE:	104,	// タグ発行承認
	AMMSV0140_OPETYPE_LAST_APPLY:	105,	// 最終承認申請
	AMMSV0140_OPETYPE_LAST_RETURN:	106,	// 最終承認差戻し
	AMMSV0140_OPETYPE_LAST_APPROVE:	107,	// 最終承認
	AMMSV0140_OPETYPE_OUTPUT:		201,
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
		'#ca_saleInfo',
		'#div_ca_setupFlagg',
		'#div_ca_selloutYear',
	],
};

$(function() {

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
					var itgrpTxt = $("#ca_itgrpID").val();
					if (!_.isEmpty(itgrpTxt)) {
						var tmp = itgrpTxt.split(':');
						if (tmp.length > 1) {
							itgrpTxt = tmp[1];
						}
					}
					if (itgrpTxt != "") {
						$("#mhi_itgrpID").text(itgrpTxt);
						$("#mhi_itgrpID").removeClass('unfilled');
					} else {
						$("#mhi_itgrpID").text("未入力");
						$("#mhi_itgrpID").addClass('unfilled');
					}

					// メーカー名
					//var makerID = $("#ca_makerID").autocomplete('clAutocompleteItem');
					var makerTxt = $("#ca_makerID").val();
					if (!_.isEmpty(makerTxt)) {
						var tmp = makerTxt.split(':');
						if (tmp.length > 1) {
							makerTxt = tmp[1];
						}
					}
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
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		editTypes: {},

		events: {
			'click #ca_srch': "_onSrchClick",

			'change #ca_materialID': "_onMaterialIDChange",
			'change #ca_inputJanFlag': "_onInputJanFlagChange",
			'change #ca_orderFlag': "_onOrderFlagChange",
			'change #ca_tagIssueFlag': '_onTagIssueFlagChange',
			'change #ca_tagTypeID': '_onTagTypeChange',

			'change #ca_seasonID': '_onSeasonChange',

			'change #ca_importID': '_onImportChange',
			'change #ca_salesStartDate': 'setDefaultYear',
			'clDatepickerOnSelect #ca_salesStartDate': 'setDefaultYear',

			'click #expand_cloth': "_onExpandClothClick",
			'click #expand_spec': "_onExpandSpecClick",
			'click #expand_cost': "_onExpandCostClick",
			'click #expand_price': "_onExpandPriceClick",
			'click #expand_any': "_onExpandAnyClick",

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
			// 下代
			'change #ca_cost': '_onCostChange',
			// 組合せ販売
			'click #btn_bundleView': '_onBundleViewClick',
			// メーカーID変更
			'cl_change #ca_makerID': '_onMakerIDChange',
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
				var mdOpt = {
					title: '商品マスタ',
					btn_cancel: false,
					btn_submit: false,
					btn_csv: false,
					opeTypeId: o.opeTypeId,

					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// アプリ個別の View や部品をインスタンス化するとか・・・

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				//clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}
			this.opeTypeId = fixopt.opeTypeId;	// 処理区分を保存

			//clutil.mediator.on('onSizePtnJanChanged', this._onSizePtnJanChanged);
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
				editTypeID: 0,
			};
			return req;
		},

		getCodeName: function(code, name) {
			var codename = "";

			if (code != "" || name != "") {
				codename = code + ":" + name;
			}
			return codename;
		},

		/**
		 * 基本情報部再現用オブジェクトを作成
		 * @param item 商品マスタレコード
		 * @param attr 商品属性マスタ(基本)レコード
		 * @returns {___anonymous3334_3596}
		 */
		_createBaseInfo: function(item, attr) {
			item = item == null ? {} : item;
			attr = attr == null ? {} : attr;

			var fromDate = (item.fromDate == null || item.fromDate == 0) ? clutil.addDate(clcom.getOpeDate(), 1) : item.fromDate;
			var toDate = (item.toDate == null || item.toDate == 0) ? clcom.max_date : item.toDate;

			var base = {
				memoForStore: attr.memoForStore,	// 店舗通知
				salesPoint: attr.salesPoint,		// セールスポイント
				unitID: item.unitID,				// 事業ユニッtID
				itgrpID: this.getCodeName(item.itgrpCode, item.itgrpName),	// 品種
				makerID: this.getCodeName(item.makerCode, item.makerName),	// メーカー
				makerItemCode: item.makerItemCode,	// メーカー品番
				name: item.name,					// 商品名
				itemTypeID: clutil.gettypename(amcm_type.AMCM_TYPE_ITEM, attr.itemTypeID),
													// 商品区分
				seasonID: clutil.gettypename(amcm_type.AMCM_TYPE_SEASON, attr.seasonID),
													// シーズン区分
				subSeasonID: clutil.gettypename(amcm_type.AMCM_TYPE_SUBSEASON, attr.subSeasonID),
													// シーズン区分
				subcls1ID: this.getCodeName(attr.subcls1Code, attr.subcls1Name),
													// サブクラス1
				subcls2ID: this.getCodeName(attr.subcls2Code, attr.subcls2Name),
													// サブクラス1
				brandID: this.getCodeName(attr.brandCode, attr.brandName),
													// ブランド
				styleID: this.getCodeName(attr.styleCode, attr.styleName),
													// スタイル
				materialID: this.getCodeName(attr.materialCode, attr.materialName),
													// 素材
				materialText: attr.materialText,	// 素材テキスト
				designID: this.getCodeName(attr.designCode, attr.designName),
													// 柄
				subDesignID: this.getCodeName(attr.subDesignCode, attr.subDesignName),
													// サブ柄
				//designColorID: this.getCodeName(attr.designColorCode, attr.designColorName),
													// ベース色
				usetypeID: this.getCodeName(attr.usetypeCode, attr.usetypeName),
													// 用途区分

//				fromDate: fromDate,
//				toDate: toDate,
//				id: item.id,
//
//				// 生地情報
//				quality: attr.quality,
//				clothMaker: attr.clothMaker,
//				tmpClothCode: attr.tmpClothCode,
//				clothCode: attr.clothCode,
//				clothOrderDate: attr.clothOrderDate,
//				clothDlvDate: attr.clothDlvDate,
//
//				// 商品仕様
				specComment: attr.specComment,
			};
			return base;
		},

		/**
		 * タグ情報再現用オブジェクトを作成
		 * @param attr 商品属性マスタ(基本)レコード
		 */
//		_createTagInfo: function(attr) {
//			attr = attr == null ? {} : attr;
//
//			var tag = {
//				tagIssueFlag: attr.tagIssueFlag,
//				tagIssueID: attr.tagIssueID,
//				tagTypeID: attr.tagTypeID,
//				fixedFormTag1Code: attr.fixedFormTag1Code,
//				fixedFormTag2Code: attr.fixedFormTag2Code,
//				fixedFormTag3Code: attr.fixedFormTag3Code,
//				itoloxID: attr.itoloxID,
//			};
//			return tag;
//		},

		/**
		 * カラー・サイズデータ作成
		 * @param item
		 * @returns {___anonymous10317_10355}
		 */
		_createColorSizeInfo: function(item) {
			item = item == null ? {} : item;
			var cs = {
				sizePtnID: this.getCodeName(item.sizePtnCode, item.sizePtnName),
			};
			return cs;
		},

		curGroupNO: 0,	// 現在のグループID（追加する時は+1すること）
		curOrderSeq: 0, // 現在の発注枝番（追加する時は+1すること）
		groupNoList: [],	// 存在するグループIDの配列

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
			var _this = this;
			var $div_cs = $('div[name="div_colorsize"]');
			var groupNOs = [];
			var gNO2tgtColor = {};	// カラーID→商品展開カラーレコード
			var cID2CItem = {};		// カラーID→カラー商品レコード
			var cID2CSItem = {};	// カラーID→カラーサイズ商品レコード
			var cID2TgtSize = {};

			$.each(citemList, function() {
				cID2CItem[this.colorID] = this;
			});
			$.each(csitemList, function() {
				var cID = this.janColorID;
				if (cID2CSItem[cID] == null) {
					cID2CSItem[cID] = [];
				}
				cID2CSItem[cID].push(this);
			});

			/*
			 * 1.tgtColorListからgroupIDのリストを取得する。ついでにgroupID→tgtColoListを作る
			 */
			$.each(tgtColorList, function() {
				groupNOs.push(this.groupNo);
				if (gNO2tgtColor[this.groupNo] == null) {
					gNO2tgtColor[this.groupNo] = [];
				}
				gNO2tgtColor[this.groupNo].push(this);
			});
			groupNOs = _.uniq(groupNOs);

			/*
			 * 2.tgtSizeListからcolorID,sizeID→tgtSizeListなオブジェクトを作成
			 */
			$.each(tgtSizeList, function() {
				var cID = this.tgtColorID;
				var sID = this.tgtSizeID;

				if (cID2TgtSize[cID] == null) {
					cID2TgtSize[cID] = {};
				}
				cID2TgtSize[cID][sID] = this;
			});

			/*
			 * 1.tgtColorListの個数分{div_color,div_size,div_jan}を作成する
			 */
			$.each(groupNOs, function() {
				var grpno = this;
				_this.curGroupNO = grpno;
				_this.groupNoList.push(grpno);
				var obj = { groupNo: grpno };
				var html = _.template(_this.$("#ca_rec_template_colorsize").html(), obj);
				$div_cs.append(html);

				// カラーテーブル描画
				var tgtColor = gNO2tgtColor[grpno];	// 配列
				var $tbody_color = $div_cs.find('tbody[name="ca_table_color_tbody"]');
				_this.renderTableColor($tbody_color, tgtColor, cID2CItem, item.itgrpID);

				// サイズテーブル描画
				var $thead_size = $div_cs.find('thead[name="ca_table_size_thead"]');
				var $tbody_size = $div_cs.find('tbody[name="ca_table_size_tbody"]');
				var colorID = tgtColor[0].tgtColorID;
				var sID2TgtSize = cID2TgtSize[colorID];
				_this.renderTableSize($thead_size, $tbody_size, sizeRowList, sizeColList, sizeRecList, grpno, sID2TgtSize);

				// JANテーブル描画
				var $thead_jan = $div_cs.find('thead[name="ca_table_jan_thead"]');
				var $tbody_jan = $div_cs.find('tbody[name="ca_table_jan_tbody"]');

				_this.renderTableJan($thead_jan, $tbody_jan, $tbody_color, $tbody_size, sizeRecList, csitemList);
			});
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
					var key = this.colorID + ":" + this.sizeID;
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
			var thead_html = '<tr><th>カラー／サイズ</th>';
			$.each(col, function() {
				var colObj = this.col;
				var rowObj = this.row;
				var sizeID = this.sizeID;
				var txt = rowObj.sizeRowName + colObj.sizeColName;
				var attr = 'rowno="' + rowObj.sizeRowNo + '" colno="' + colObj.sizeColNo + '"';
				thead_html += '<th ' + attr + '>' + txt + '</th>';

			});
			thead_html += '</tr>';
			$thead_jan.append(thead_html);

			/*
			 * 4. tbodyの描画
			 */
			$.each(row, function() {
				var colorID = this.colorID;
				var tr_html = '<tr colorID="' + colorID + '">';
				tr_html += '<td name="' + this.iagID + '">' + this.iagName + '</td>';

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
					tr_html += '<input type="text" class="form-control" name="ca_janCode" ' + ids + ' value="' + val + '" />';
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
			var $select = $('select[name0="ca_tagAddrNo"]');
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
			var uri = "AMMSV0140";
			var AMMSV0140TagAddrGetReq = {
				srchMakerID: makerID,
				srchDate: from,
			};
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				AMMSV0140GetReq: {},
				AMMSV0140UpdReq: {},
				AMMSV0140FormatGetReq: {},
				AMMSV0140SizeGetReq: {},
				AMMSV0140TagAddrGetReq: AMMSV0140TagAddrGetReq,
				AMMSV0140PriceHistGetReq: {},
			};
			// タグ送付先取得
			clutil.postJSON(uri, req).done(_.bind(function(data) {
				// 成功
				_this.tagAddrList = data.AMMSV0140TagAddrGetRsp.tagAddrList;

				clutil.cltypeselector2($select, _this.tagAddrList, 1, 1,
						'tagAddrNo', 'tagAddrName', 'tagAddrNo');
				if (tagAddrNo != null && tagAddrNo != 0) {
					// 値を設定
					$select.selectpicker('val', tagAddrNo);
				}
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

//			var _this = this;
//			var makerData = $("#ca_makerID").autocomplete('clAutocompleteItem');
//			var makerID = makerData != null ? makerData.id : 0;
//			var seq2orderDtl = {};
//			var grpnoList = [];
//			var grpno2tgtColor = {};
//			var cID2tgtSize = {};
//
//			if (tgtColorList != null) {
//				$.each(tgtColorList, function() {
//					grpnoList.push(this.groupNo);
//
//					if (grpno2tgtColor[this.groupNo] == null) {
//						grpno2tgtColor[this.groupNo] = [];
//					}
//					grpno2tgtColor[this.groupNo].push(this);
//				});
//			}
//			grpnoList = _.uniq(grpnoList);
//
//			if (tgtSizeList != null) {
//				$.each(tgtSizeList, function() {
//					var colorID = this.tgtColorID;
//					if (cID2tgtSize[colorID] == null) {
//						cID2tgtSize[colorID] = [];
//					}
//					cID2tgtSize[colorID].push(this);
//				});
//			}
//
//			if (orderDtlList != null) {
//				$.each(orderDtlList, function() {
//					if (seq2orderDtl[this.orderSeq] == null) {
//						seq2orderDtl[this.orderSeq] = [];
//					}
//					seq2orderDtl[this.orderSeq].push(this);
//				});
//			}
//
//
//			var $div = $('div#ca_orderInfoFixed');
//
//			// 商品発注明細解析
//			var dtlList = {};
//			$.each(orderDtlList, function() {
//				if (dtlList[this.orderSeq] == null) {
//					dtlList[this.orderSeq] = [];
//				}
//				dtlList[this.orderSeq].push(this);
//			});
//			// 生産国
//			var $import = $div.find('select#ca_importID');
//			this.clitemattrselector($import, iagfunc.ITEMATTRGRPFUNC_ID_COUNTRY, item.itgrpID, attr.importID, 1);
//
//			// 縫製工場
//			var $factory = $div.find('select#ca_factoryID');
//			this.clitemattrselector($factory, iagfunc.ITEMATTRGRPFUNC_ID_FACTORY, item.itgrpID, attr.factoryID, 1);
//
//			// Ki区分
//			var $ki = $div.find('select#ca_kiTypeID');
//			clutil.cltypeselector($ki, amcm_type.AMCM_TYPE_KI, 1);
//			$ki.selectpicker('val', attr.kiTypeID);
//
//			// 発注ロット
//			var $lotCount = $div.find('input#ca_lotCount');
//			$lotCount.val(attr.lotCount);
//
//			// 納品形態（初回）
//			var $dlvroute1TypeID = $div.find('select#ca_dlvroute1TypeID');
//			clutil.cltypeselector($dlvroute1TypeID, amcm_type.AMCM_TYPE_DLV_ROUTE, 1);
//			$dlvroute1TypeID.selectpicker('val', attr.dlvroute1TypeID);
//
//			// 納品形態（2回目以降）
//			var $dlvroute2TypeID = $div.find('select#ca_dlvroute2TypeID');
//			clutil.cltypeselector($dlvroute2TypeID, amcm_type.AMCM_TYPE_DLV_ROUTE, 1);
//			$dlvroute2TypeID.selectpicker('val', attr.dlvroute2TypeID);
//
//			// 振分先センター
//			var centerObj = {
//				id: attr.centerID,
//				code: attr.centerCode,
//				name: attr.centerName,
//			};
//			var $centerID = $div.find('input#ca_centerID').parent();
//			clutil.data2view($centerID, {centerID: centerObj});
//			//$centerID.autocomplete('clAutocompleteItem', centerObj);
//
//			/*
//			 * 1. orderHeadListから発注情報がいくつあるか数える(orderNum)
//			 * 2. orderNum個の発注情報を作成する
//			 */
//			var orderNum = 0;
//			var cur_seq = -1;
//			$.each(orderHeadList, function() {
//				if (this.orderSeq != cur_seq) {
//					orderNum++;
//					cur_seq = this.orderSeq;
//				}
//			});
//			$.each(orderHeadList, function(i) {
//				_this.curOrderSeq = this.orderSeq;	// 発注枝番を記録
//				_this.renderOrderInfoList(
//						this,
//						orderDtlList,
//						grpnoList,
//						grpno2tgtColor,
//						cID2tgtSize,
//						makerID,
//						info);
//			});
//
//			// 最後が承認済みか確認
//			var lastOrderHead = orderHeadList.length > 0 ? orderHeadList[orderHeadList.length-1] : null;
//			if (lastOrderHead != null) {
//				if (lastOrderHead.approveFlag != 0) {
//					// 承認済みなら、追加ボタンを表示
//					$("#div_addOrderInfo").show();
//				} else {
//					// 未承認なら、追加ボタンを非表示
//					$("#div_addOrderInfo").hide();
//				}
//			}
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

//			var _this = this;
//			// templateを仕様
//			var $div_order = $('div[name="div_order_info"]');
//			var html = _.template($("#ca_rec_template_order_info").html(), orderHeadRec);
//			$div_order.append(html);
//			clutil.initUIelement($div_order);
//
//			/*
//			 * 値設定
//			 */
//			var $div = $div_order.find('div[name="div_order_info_list"]:last');
//
//			// datepicker
//			clutil.datepicker($div.find('input.cl_date'));
//
//			// 発注対象
//			var $select = $div.find('select[name0="ca_orderTgtTypeID"]');
//			clutil.cltypeselector($select, amcm_type.AMCM_TYPE_ORDERKIND, 1);
//			$select.selectpicker('val', orderHeadRec.orderTgtTypeID);
//
//			// タグ送付先
//			$select = $div.find('select[name0="ca_tagAddrNo"]');
//			this.createTagAddrNoSelect($select, makerID, orderHeadRec.tagAddrNo);
//
//			// 製品仕上げ日
//			var $date = $div.find('input[name0="ca_finishDate"]');
//			$date.datepicker('setIymd', orderHeadRec.finishDate);
//			// センター着予定日
//			$date = $div.find('input[name0="ca_centerDlvDate"]');
//			$date.datepicker('setIymd', orderHeadRec.centerDlvDate);
//			// 仕入予定日
//			$date = $div.find('input[name0="ca_dlvDate"]');
//			$date.datepicker('setIymd', orderHeadRec.dlvDate);
//			// 最終承認
//			$date = $div.find('input[name0="ca_approveLimitDate"]');
//			var limitDate = (info == null || info.approveLimitDate == null) ? 0 : info.approveLimitDate;
//			if (limitDate > 0) {
//				$date.datepicker('setIymd', limitDate);
//			}
//
//			// 発注書番号
//			if (orderHeadRec.orderNo != null && orderHeadRec.orderNo != 0) {
//				$div.find('input[name0="ca_orderNo"]').val(orderHeadRec.orderNo);
//			}
//
//			// 発注取消
//			var $checkbox = $div.find('input[type="checkbox"]');
//			if (orderHeadRec.cancelFlag) {
//				$checkbox.attr('checked', true).closest('label').addClass('checked');
//			} else {
//				$checkbox.attr('checked', false).closest('label').removeClass('checked');
//			}
//
//			var $div_order_table = $div.find('div[name="div_order_table_list"]');
//			// カラー／サイズテーブル
//			for (var i = 0; i < grpnoList.length; i++) {
//				var no = grpnoList[i];
//				var tgtColor = grpno2tgtColor[no];
//				_this.renderTableOrderDtl($div_order_table, orderDtlList, tgtColor, cID2tgtSize);
//			}
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
			thead_html += '<th width="100px">カラー／サイズ</th>';
			thead_html += '<th>合計</th>';

			$.each(tgtSizeList, function() {
				// thead
				thead_html += '<th sizeID="' + this.tgtSizeID + '">';
				thead_html += this.tgtSizeName;
				thead_html += '</th>';
			});
			thead_html += '</tr>';
			$thead.append(thead_html);

			// tbody
			$.each(grpno2tgtColor, function() {
				var colorID = this.tgtColorID;
				var tbody_html = '<tr colorID="' + colorID + '">';

				tbody_html += '<td>' + this.tgtColorName + '</td>';
				tbody_html += '<td class="txtar" name="total"></td>';	// 合計は後で設定する
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
					tbody_html += '<input type="text" class="form-control txtar" name="ca_orderQy" data-limit="len:6 digit" data-filter="comma" value="' + clutil.comma(orderDtl.orderQy) + '" />';
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
					$.each(colorList, function() {
						if (this.iagID == colorID) {
							tgtColorName = this.iagName;
							return false;
						}
					});
					var tgtColor = {
						tgtColorID: colorID,
						tgtColorName: tgtColorName,
						groupNo: grpno,
					};
					grpno2tgtColor[grpno].push(tgtColor);
					if (tmp_colorID == 0) {
						tmp_colorID = colorID;
						cID2tgtSize[colorID] = [];
					}
				});

				var $tbody_size = $div_size.find('tbody[name="ca_table_size_tbody"]');
				$.each($tbody_size.find('input[name="select_col"]:checked'), function() {
					var $checkbox = $(this);
					var groupNO = $checkbox.attr('groupNO');
					var sizeID = $checkbox.attr('sizeID');
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
					};
					cID2tgtSize[colorID].push(tgtSize);
				});
			}

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
			var _this = this;
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

			$.each($div_orderList, function() {
				var $div_order = $(this);
				var $div_order_table_list = $div_order.find('div[name="div_order_table_list"]');
				$div_order_table_list.empty();

				$.each(_this.groupNoList, function() {
					var tgtColor = maps.grpno2tgtColor[this];
					_this.renderTableOrderDtl($div_order_table_list, orderDtlList, tgtColor, maps.cID2tgtSize);
				});
			});

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
			$select.val(val);
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
					sclist[this.specItemID] = {};
				}
				sclist[this.specItemID][this.specID] = this;
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
//			var $tbody = $("#ca_table_modelno_tbody");
//
//			// 商品属性項目マップから部位を取出す
//			var modelnoplaceList = this.attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_MODELNOPLACE];
//
//			$.each(modelNoList, function() {
//				var tr = _.template($("#ca_rec_template_modelno").html(), this);
//				$tbody.append(tr);
//
//				var $tr_last = $tbody.find('tr:last');
//				clutil.initUIelement($tr_last);
//
//				var $select = $tr_last.find('select[name="ca_modelnoPlaceID"]');
//
//				clutil.cltypeselector2($select, modelnoplaceList, 0,
//						null, 'iagID', 'iagName', 'iagCode');
//
//				$select.selectpicker('val', this.modelnoPlaceID);
//			});
		},

		/**
		 * 型番テーブル行追加処理
		 * @param e
		 * @returns
		 */
		_onModelNoAddRow: function(e) {
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
			var $tr = $tgt.parent();
			$tr.remove();
		},



		/**
		 * 商品仕様テーブル描画
		 * @param specList
		 * @param specChoiceList
		 * @param specFormatList
		 */
		renderTableSpec: function(specList, specChoiceList, specFormatList) {
			// 商品仕様選択肢リストを解析する
			var sclist = this._parseSpecChoiceList(specChoiceList);
			// 商品仕様レコードを解析する
			var slist = this._parseSpecList(specList);

			var $tbody = $("#ca_table_spec_tbody");
			_.each(specFormatList, _.bind(function(v) {
				var spec = slist[v.specItemID];
				var choice = null;
				var ex = {
					specText: "",
					specView: "",
					specId: 0,
				};
				if (spec != null) {
					ex.specText = spec.specText;
					ex.specID = spec.specID;
					choice = sclist[v.specItemID][spec.specID];
				}
				if (choice != null) {
					ex.specView = choice.specCode + ":" + choice.specName;
				}
				var specFormat = _.extend(ex, v);
				var tr;
				if (specFormat.specID == 32767) {
					tr = _.template($("#ca_rec_template_spec2").html(), specFormat);
				} else {
					tr = _.template($("#ca_rec_template_spec").html(), specFormat);
				}
				// tbodyに追加
				$tbody.append(tr);
			}, this));
		},

		itemAttrPlaceList: [],
		itemAttrMaterialList: [],


		renderTableMaterial: function(materialList, itgrpId) {
			var $tbody = $("#ca_table_material_tbody");

			_.each(materialList, _.bind(function(mate) {
				if (mate.tagMaterialID == 32767) {
					mate.materialText = mate.tagManual;
				} else {
					mate.materialText = mate.materialRatio;
				}
				mate.placeView = mate.placeCode + ":" + mate.placeName;
				if (mate.placeView === ":") {
					mate.placeView = "";
				}

				mate.tagMaterialView = mate.tagMaterialCode + ":" + mate.tagMaterialName;
				if (mate.tagMaterialView === ":") {
					mate.tagMaterialView = "";
				}

				// 追加業のHTMLを作成する
				var tr = _.template($("#ca_rec_template_material").html(), mate);
				// tbodyに追加
				$tbody.append(tr);

				if (mate.tagMaterialID == 32767) {
					// 右寄せを解除
					var $tr_last = $tbody.find('tr:last');
					var $td = $tr_last.children('td[name="ca_materialText"]');
					$td.removeClass('txtar');
				}

			}, this));
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

			$.each(tgtColorList, function() {
				var tgtColor = this;
				var citem = cID2CItem[tgtColor.tgtColorID];
				var obj = {
					colorID: tgtColor.tgtColorID,
					tgtColorCode: tgtColor.tgtColorCode,
					tgtColorName: tgtColor.tgtColorName,
					makerColor: citem.makerColor,
					citemID: citem.citemID,
					designColorID: citem.designColorID,
					designColorCode: citem.designColorCode,
					designColorName: citem.designColorName,
				};
				// 追加業のHTMLを作成する
				var tr = _.template($("#ca_rec_template_color").html(), obj);
				// tbodyに追加
				$tbody.append(tr);
			});
			clutil.initUIelement($tbody);
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
			};

			var tr = _.template($("#ca_rec_template_color").html(), add_tmp);
			var $tbody = $table.children('tbody');

			$tbody.append(tr);

			var $tr_last = $tbody.find('tr:last');
			clutil.initUIelement($tr_last);

			var $select = $tr_last.find('select[name="ca_colorID"]');

			clutil.cltypeselector2($select, attrColorList, 1,
					null, 'iagID', 'iagName', 'iagCode');
		},

		/**
		 * カラーテーブル行削除処理
		 * @param e
		 */
		_onColorDelRow: function(e) {
			if (this.infoRec != null && this.infoRec.tagApprovalTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE) {
				// タグ申請済の場合は、編集不可
				return;
			}

			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');
			$tr.remove();
		},

		/**
		 * サイズテーブル描画処理
		 * @param rowList 行データ
		 * @param colList 列データ
		 * @param recList カラムデータ
		 */
		renderTableSize: function($thead, $tbody, rowList, colList, recList, groupNO, sID2TgtSize) {
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
			tr += '<th style="min-width:40px;"></th>';
			//tr += '<th class="txtac">選択</th>';
			$.each(colList, function() {
				tr += '<th class="txtac" name="' + this.sizeColNo + '">' + this.sizeColName + '</th>';
			});
			tr += '</tr>';
			$thead.append(tr);
			clutil.initUIelement($thead);

			var tmpl_tdlabel = '<td class="cellCheckbox"><label class="checkbox" for="">';
			var tmpl_tdlabel2 = '</label></td>';
			/*
			 * tbody描画
			 */
//			tr = '<tr name="select_head">';
//			tr += '<td>選択</td>';
//			tr += tmpl_tdlabel;
//			tr += '<input type="checkbox" name="select_head_all" value="all" data-toggle="checkbox">';
//			tr += tmpl_tdlabel2;
//
//			//<td width="" class="cellCheckbox"><label class="checkbox" for=""><input type="checkbox" value="" id="" data-toggle="checkbox"></label></td>
//
//			// 選択行
//			$.each(colList, function() {
//				tr += tmpl_tdlabel;
//				tr += '<input type="checkbox" name="select_head_col" value="' + this.sizeColNo + '" data-toggle="checkbox">';
//				tr += tmpl_tdlabel2;
//			});
//			tr += '</tr>';
//			$tbody.append(tr);
//			clutil.initUIelement($tbody);

			// 行追加
			$.each(rowList, function() {
				var rowNo = this.sizeRowNo;
				tr = '<tr name="' + this.sizeRowNo + '">';
				// 名前
				tr += '<td>' + this.sizeRowName + '</td>';
				// 行選択
//				tr += tmpl_tdlabel;
//				tr += '<input type="checkbox" name="select_row_all" data-toggle="checkbox"></label></td>';
//				tr += tmpl_tdlabel2;
				// 列
				$.each(colList, function() {
					var key = rowNo + ":" + this.sizeColNo;
					if (recMap[key] != null) {
						var sizeID = recMap[key].sizeID;
						var sizeIDValue = 'sizeID="' + sizeID + '" groupNO="' + groupNO + '" value="' + this.sizeColNo + '"';
						tr += tmpl_tdlabel;
						tr += '<input type="checkbox" name="select_col" ' + sizeIDValue + ' data-toggle="checkbox">';
						tr += tmpl_tdlabel2;
					} else {
						// sizeRecがない
						var sizeID = 0;
						var sizeIDValue = 'sizeID="' + sizeID + ' groupNO="' + groupNO + '" value="' + this.sizeColNo + '"';
						tr += '<td>';
						tr += '<input type="hidden" name="select_col" ' + sizeIDValue + '>';
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
					input_html += '<input type="text" class="form-control" name="ca_janCode" no="' + colObj.sizeColNo + '" class="form-control" data-limit="len:13 digit" />';
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
		renderTableCostIn: function(costDtlList, costFormatList) {
			$tbody = $("#ca_table_cost_in_tbody");
			var costList = {};
			$.each(costDtlList, function() {
				costList[this.costItemID] = this;
			});

			$.each(costFormatList, function() {
				var cost = costList[this.costItemID];
				this.costDtl = (cost != null && cost.costDtl != null) ? cost.costDtl : "";

				// 追加業のHTMLを作成する
				var tr = _.template($("#ca_rec_template_cost_in").html(), this);
				// tbodyに追加
				$tbody.append(tr);

			});
		},

		/**
		 * 組織別上代テーブル描画
		 * @param priceOrgList
		 */
		renderTablePrice: function(priceOrgList) {
			var _this = this;
			var $tbody_zone = $("#ca_table_price_zone");
			var $tbody_store = $("#ca_table_price_store");
			var __SYSPAR_ZONE__ = clcom.getSysparam(amcm_sysparams.PAR_AMMS_ZONE_LEVELID);
			var __SYSPAR_STORE__ = clcom.getSysparam(amcm_sysparams.PAR_AMMS_STORE_LEVELID);

			var id = (_this.orgTypeID == amcm_type.AMCM_VAL_ORG_KIND_ZONE) ? __SYSPAR_ZONE__ : __SYSPAR_STORE__;

			$.each(priceOrgList, function() {
				var dataOrg = {
					id: this.orgID,
					code: this.orgCode,
					name: this.orgName,
				};
				var $tbody = this.orgTypeID == amcm_type.AMCM_VAL_ORG_KIND_ZONE ? $tbody_zone : $tbody_store;

				// 追加業のHTMLを作成する
				var tr = _.template($("#ca_rec_template_price").html(), this);
				// tbodyに一旦追加
				$tbody.append(tr);

				var $tr_last = $tbody.find('tr:last');


				// 組織オートコンプリート初期化
				var opt = {
					getOrgFuncId: function() {
						return 1;
					},
					getOrgLevelId: function() {
						return id;
					},
				};
				var $input = $tr_last.find('input[name="ca_orgID"]');
				clutil.clorgcode($input, opt);
				// 改めて値を設定
				$input.autocomplete('clAutocompleteItem', dataOrg);
			});
		},

		/**
		 * ゾーン別上代テーブル行追加処理
		 * @param e
		 * @returns
		 */
		_onPriceZoneAddRow: function(e) {
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
		 * 店舗別上代テーブル行追加処理
		 * @param e
		 * @returns
		 */
		_onPriceStoreAddRow: function(e) {
			var __SYSPAR_STORE__ = clcom.getSysparam(amcm_sysparams.PAR_AMMS_STORE_LEVELID);

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
			var opt = {
				getOrgFuncId: function() {
					return 1;
				},
				getOrgLevelId: function() {
					var id = __SYSPAR_STORE__;
					return id;
				},
			};
			var $input = $tr_last.find('input[name="ca_orgID"]');
			clutil.clorgcode($input, opt);
		},

		/**
		 * カラーテーブル行削除処理
		 * @param e
		 */
		_onColorDelRow: function(e) {
			var $tgt = $(e.target);
			var $tr = $tgt.parent();
			$tr.remove();
		},

		renderTableTgtStore: function(tgtStoreList) {
			var $tbody = $("#ca_table_tgt_tbody");
			var __SYSPAR_STORE__ = clcom.getSysparam(amcm_sysparams.PAR_AMMS_STORE_LEVELID);

			$.each(tgtStoreList, function() {
				var dataOrg = {
					id: this.orgID,
					code: this.orgCode,
					name: this.orgName,
				};

				// 追加業のHTMLを作成する
				var tr = _.template($("#ca_rec_template_tgt").html(), this);
				// tbodyに一旦追加
				$tbody.append(tr);

				var $tr_last = $tbody.find('tr:last');

				// 組織オートコンプリート初期化
				var opt = {
					getOrgFuncId: function() {
						return 1;
					},
					getOrgLevelId: function() {
						var id = __SYSPAR_STORE__;
						return id;
					},

				};
				var $input = $tr_last.find('input[name="ca_tgtOrgID"]');
				clutil.clorgcode($input, opt);
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
			var opt = {
				getOrgFuncId: function() {
					return 1;
				},
				getOrgLevelId: function() {
					var id = __SYSPAR_STORE__;
					return id;
				},

			};
			var $input = $tr_last.find('input[name="ca_tgtOrgID"]');
			clutil.clorgcode($input, opt);
		},

		/**
		 * 対象店舗テーブル行削除処理
		 * @param e
		 */
		_onTgtDelRow: function(e) {
			var $tgt = $(e.target);
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
			var $div_info = $("#any_info");
			var anyList = this.parseAttrAnyList(attrAnyList);

			_.each(attrDefList, _.bind(function(v) {
				var any = anyList[v.iagfuncID];
				var tmp = {
					iagID: 0,
					iagCode: "",
					iagName: "",
				};
				if (any != null) {
					tmp.iagID = any.iagID;
					tmp.iagCode = any.iagCode;
					tmp.iagName = any.iagName;
				}
				var attr = _.extend(tmp, v);
				if (_.isEmpty(attr.iagCode) && _.isEmpty(attr.iagName)) {
					attr.iagView = "";
				} else {
					attr.iagView = attr.iagCode + ":" + attr.iagName;
				}
				// 任意属性テンプレート
				var div = _.template($("#ca_rec_template_any").html(), attr);
				// 一旦追加
				$div_info.append(div);
			}, this));

//			$.each(attrDefList, function() {
//				// 任意属性テンプレート
//				var div = _.template($("#ca_rec_template_any").html(), this);
//				// 一旦追加
//				$div_info.append(div);
//				var $div = $div_info.find('div[name="div_any"]:last');
//				clutil.initUIelement($div);
//
//
//				var $select = $div.find('select.ca_iagID');
//
//				clutil.cltypeselector2($select, attrItemList, 1,
//						null, 'iagID', 'iagName', 'iagCode');
//				if (any != null) {
//					$select.selectpicker('val', any.iagID);
//				}
//			});
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
			}
			//$("#span_photo_count").text(count);
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
				cost: 0,	// 下代
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
		_createSaleInfo: function(item, price, attr) {
			var ca_saleInfo = {
				priceIntax: 0,
				price: 0,
				costIntax: 0,
				cost: 0,
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
				var profitRate = (price.price - price.cost) / price.price;
				profitRate = (Math.round(profitRate*1000) / 10);
				ca_saleInfo.priceIntax = price.priceIntax;
				ca_saleInfo.price = price.price;
				ca_saleInfo.costIntax = price.costIntax;
				ca_saleInfo.cost = price.cost;
				ca_saleInfo.profitRate = profitRate;
			}
			if (item != null) {
				ca_saleInfo.year = item.year;
			}
			if (attr != null) {
				ca_saleInfo.salesStartDate = clutil.dateFormat(attr.salesStartDate, 'yyyy/mm/dd(w)');
				ca_saleInfo.salesEndDate = clutil.dateFormat(attr.salesEndDate, 'yyyy/mm/dd(w)');
				if (attr.selloutYear > 0) {
					ca_saleInfo.selloutYear = attr.selloutYear;
				} else {
					// 売り切る年が未設定(=0)なら空欄にする
					ca_saleInfo.selloutYear = '';
				}
				ca_saleInfo.selloutSeasonID = clutil.gettypename(amcm_type.AMCM_TYPE_SEASON, attr.selloutSeasonID);
			}
			return ca_saleInfo;
		},

		/**
		 * 差戻し理由描画
		 * @param commentList
		 * @param orderHeadList
		 */
		renderComment: function(commentList) {
			if (clcom.srcId == 'AMMSV0090') {
				// 商品マスタ一覧から来た時は、差戻し理由を入力不可に
				clutil.inputReadonly($("#ca_comment"));
			} else {
				// それ以外（承認一覧）から来た時は、差戻し理由を入力可に
				clutil.inputRemoveReadonly($("#ca_comment"));
			}
			var $tbody = $("#ca_table_comment_thead");
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

			var editTypeID = $("#ca_editTypeID").val();

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
				if (itemTypeID == AMCM_VAL_ITEM_REGULAR) {
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
			// 素材
			$select = $("#ca_materialID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_MATERIAL, 0, attr.materialID, 1);
			// 柄
			$select = $("#ca_designID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_DESIGN, 0, attr.designID, 1);
			// サブ柄
			$select = $("#ca_subDesignID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_SUBDESIGN, 0, attr.subDesignID, 1);
			// ベース色
			//$select = $("#ca_designColorID");
			//this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_DESIGNCOLOR, 0, attr.designColorID, 1);
			// 用途区分
			$select = $("#ca_usetypeID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_USETYPE, 0, attr.usetypeID, 1);
			// 糸LOX
			$select = $("#ca_itoloxID");
			this.clitemattrselector($select, iagfunc.ITEMATTRGRPFUNC_ID_ITOLOX, 0, attr.itoloxID, 1);

		},

		/**
		 * GET 応答のイベントを受ける
		 * @param args
		 * @param e
		 */
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data, formatData: formatData}
			var data = args.data;
			var AMMSV0140GetRsp = data.AMMSV0140GetRsp;
			var AMMSV0140FormatGetRsp = data.AMMSV0140FormatGetRsp;
			var AMMSV0140SizeGetRsp = data.AMMSV0140SizeGetRsp;

			var itgrpId = 0;

			var item = null;
			var citemList = null;
			var csitemList = null;
			var attr = null;
			var attrAnyList = null;
			var tgtColorList = null;
			var tgtSizeList = null;
			var price = null;
			var materialList = null;
			var specList = null;
			var photoList = null;
			//var info = null;

			var specFormatList = null;
			var attrDefList = null;

			var sizeRowList = null;
			var sizeColList = null;
			var sizeRecList = null;

			//var tagAddrList = null;

			//var histList = null;


			if (AMMSV0140GetRsp != null) {
				item = AMMSV0140GetRsp.item;
				citemList = AMMSV0140GetRsp.citemList;
				csitemList = AMMSV0140GetRsp.csitemList;
				attr = AMMSV0140GetRsp.attr;
				attrAnyList = AMMSV0140GetRsp.attrAnyList;
				tgtColorList = AMMSV0140GetRsp.tgtColorList;
				tgtSizeList = AMMSV0140GetRsp.tgtSizeList;
				price = AMMSV0140GetRsp.price;
				materialList = AMMSV0140GetRsp.materialList;
				specList = AMMSV0140GetRsp.specList;
				photoList = AMMSV0140GetRsp.photoList;
				specFormatList = AMMSV0140GetRsp.specFormatList;
				specChoiceList = AMMSV0140GetRsp.specChoiceList;
				sizeRowList = AMMSV0140GetRsp.sizeRowList;
				sizeColList = AMMSV0140GetRsp.sizeColList;
				sizeRecList = AMMSV0140GetRsp.sizeRecList;
				attrDefList = AMMSV0140GetRsp.attrDefList;
			}
			if (item != null) {
				itgrpId = item.itgrpID;
			}
			if (AMMSV0140FormatGetRsp != null) {
				costFormatList = AMMSV0140FormatGetRsp.costFormatList;
				attrItemList = AMMSV0140FormatGetRsp.attrItemList;
			}

			if (AMMSV0140SizeGetRsp != null) {
			}

			this.csitemList = csitemList;

			// 保存しておく
			this.sizeRowList = sizeRowList;
			this.sizeColList = sizeColList;
			this.sizeRecList = sizeRecList;
			this.photoList = photoList;

			// ca_req
			var ca_baseInfo = this._createBaseInfo(item, attr);
			// カラー、サイズ、JANのテーブル用オブジェクト生成
			var ca_colorSizeInfo = this._createColorSizeInfo(item);
			var ca_saleInfo = this._createSaleInfo(item, price, attr);


			switch(args.status){
			case 'OK':
				clutil.data2view(this.$("#ca_item"), ca_baseInfo);
				clutil.data2view(this.$("#ca_colorSizeInfo"), ca_colorSizeInfo);

				// 画像
				this.renderPhotoList(this.$("#ca_photo"), this.photoList);

				// 素材テーブル
				this.renderTableMaterial(materialList, itgrpId);

				// カラー・サイズ展開
				this.renderColorSizeInfo(item, citemList, csitemList, sizeRowList, sizeColList, sizeRecList, tgtColorList, tgtSizeList, csitemList);

				// 販売情報
				clutil.data2view(this.$("#ca_saleInfo"), ca_saleInfo);

				// 任意属性
				this.renderItemAttrAny(attrDefList, attrAnyList, itgrpId);

				// 商品仕様テーブル
				this.renderTableSpec(specList, specChoiceList, specFormatList);

				// 仕入無し変更イベントを発行
				$("#ca_orderFlag").trigger('change');
				// JAN手入力変更イベントを発行
				$("#ca_inputJanFlag").trigger('change');

				/*
				 * 1. clcom.srcId == 'AMMSV0090'の場合
				 */
				switch (this.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
					clutil.viewReadonly($("#ca_req"));
					clutil.viewRemoveReadonly($("#ca_item"));
					$("#mainPicHover").removeClass('notDialog');
					clutil.viewRemoveReadonly($("#ca_tagInfo"));
					clutil.viewRemoveReadonly($("#ca_colorSizeInfo"));
					clutil.viewRemoveReadonly($("#ca_orderInfo"));
					clutil.viewRemoveReadonly($("#ca_costInfo"));
					clutil.viewRemoveReadonly($("#ca_commentInfo"));
					clutil.viewRemoveReadonly($("#ca_saleInfo"));
					clutil.viewRemoveReadonly($("#ca_anyAttrInfo"));
					// 素材変更イベントを飛ばしておく
					$('#ca_materialID').trigger('change');
					// シーズンの変更イベント発行
					$("#ca_seasonID").trigger('change');
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					if (clcom.srcId == 'AMMSV0090') {
						// 商品マスタ一覧からの遷移の場合、編集内容の選択を行う
						clutil.viewReadonly($("#ca_form"));
						clutil.viewRemoveReadonly($("#ca_req"));
					} else {
						// 商品マスタ一覧以外からの遷移の場合、上部の選択はスルー
						clutil.viewReadonly($("#ca_form"));
						clutil.viewRemoveReadonly($("#ca_coomentListInfo"));
					}
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					clutil.viewReadonly($("#ca_form"));
					clutil.inputRemoveReadonly($('#ca_fromDate'));
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
					// 照会モードの場合はブラウザ戻るボタン［×］ボタンの Confirm を行わない。
					clcom._preventConfirm = true;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
					clutil.viewReadonly($("#ca_form"));
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL:
					// 承認の場合は、差戻し理由以外は入力不可
					clutil.viewReadonly($("#ca_form"));
					clutil.viewRemoveReadonly($("#div_comment"));
					break;

				}



				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_item"), ca_baseInfo);
				clutil.data2view(this.$("#ca_colorSizeInfo"), ca_colorSizeInfo);

				// 画像
				this.renderPhotoList(this.$("#ca_photo"), this.photoList);

				// 素材テーブル
				this.renderTableMaterial(materialList, itgrpId);

				// カラー・サイズ展開
				this.renderColorSizeInfo(item, citemList, csitemList, sizeRowList, sizeColList, sizeRecList, tgtColorList, tgtSizeList, csitemList);

				// 販売情報
				clutil.data2view(this.$("#ca_saleInfo"), ca_saleInfo);

				// 任意属性
				this.renderItemAttrAny(attrDefList, attrAnyList, itgrpId);

				// 商品仕様テーブル
				this.renderTableSpec(specList, specChoiceList, specFormatList);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_item"), ca_baseInfo);
				clutil.data2view(this.$("#ca_colorSizeInfo"), ca_colorSizeInfo);

				// 画像
				this.renderPhotoList(this.$("#ca_photo"), this.photoList);

				// 素材テーブル
				this.renderTableMaterial(materialList, itgrpId);

				// カラー・サイズ展開
				this.renderColorSizeInfo(item, citemList, csitemList, sizeRowList, sizeColList, sizeRecList, tgtColorList, tgtSizeList, csitemList);

				// 販売情報
				clutil.data2view(this.$("#ca_saleInfo"), ca_saleInfo);

				// 任意属性
				this.renderItemAttrAny(attrDefList, attrAnyList, itgrpId);

				// 商品仕様テーブル
				this.renderTableSpec(specList, specChoiceList, specFormatList);

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
			/*
			 * 編集内容
			 */
			// 編集内容
//			clutil.cltypeselector(this.$("#ca_editTypeID"), amcm_type.AMCM_TYPE_ITEM_EDIT);
			// 適用期間
//			clutil.datepicker($("#ca_toDate"));
//			clutil.datepicker($("#ca_clothOrderDate"));
//			clutil.datepicker($("#ca_clothDlvDate"));

			// メーカー
//			clutil.clvendorcode($("#ca_makerID"), {
//				getVendorTypeId: function() {
//					return amcm_type.AMCM_VAL_VENDOR_MAKER;
//				},
//			});

			// 商品区分
//			clutil.cltypeselector(this.$('#ca_itemTypeID'), amcm_type.AMCM_TYPE_ITEM);

			// シーズン
//			clutil.cltypeselector(this.$('#ca_seasonID'), amcm_type.AMCM_TYPE_SEASON);

			// サブシーズン
//			clutil.cltypeselector(this.$('#ca_subSeasonID'), amcm_type.AMCM_TYPE_SUBSEASON);

			// 用途区分
			// ※用途区分は区分ではなく、商品属性でした
			//clutil.cltypeselector(this.$('#ca_usetypeID'), amcm_type.AMCM_TYPE_USE_TYPE);

			// リレーション
			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID"
				},
			}, {
				dataSource: {
				}
			});
			this.fieldRelation.done(function() {

			});

			// 画像選択ダイアログ
			this.AMMSV0101Dialog = new AMMSV0101SelectorView({
				el: this.$("#ca_AMMSV0101_dialog"),		// 配置場所
				$parentView: this.$("#mainColumn"),
			});
			this.AMMSV0101Dialog.render();
			this.AMMSV0101Dialog.okProc = this.AMMSV0101_okProc;

			// 初期のアコーディオン展開状態をつくる。

			return this;
		},

		/**
		 * 画像選択から戻ってきた
		 * @param photoRecList
		 */
		AMMSV0101_okProc: function(photoRecList) {
			console.log(photoRecList);
			//this.photoList = photoRecList;

			//this.renderPhotoList(this.$("#ca_photo"), this.photoList);
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
				//$("#ca_fromDate").datepicker("setIymd", fromDate);
				//$("#ca_toDate").datepicker("setIymd", toDate);

				// カラー・サイズを一つ表示する
				this._onAddColorSizeClick(null);
				// 発注を一つ表示する
				this._onAddOrderInfoClick(null);

				// 入力不可に
				clutil.viewReadonly($("#ca_form"));
				clutil.viewRemoveReadonly($("#ca_req"));
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
			var $img = this.$('img');
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

			this.$('img').hide();
			this.$('.noimg').show();
		},

		reapproveTypeID: 0,		// 再承認フラグ

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			//console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var chkData = this.options.chkData[pgIndex];
			var id = (chkData.id != null) ? chkData.id : chkData.itemID;
			var orgID = chkData.orgID;

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ		・・・これ、必要なの？					【確認】
				reqPage: {
				},
				// 商品マスタ検索リクエスト
				AMMSV0140GetReq: {
					srchID: id,		// 商品ID
					srchOrgID: orgID,				// 店舗ID
					srchDate: chkData.fromDate,		// 適用開始日
				},
				AMMSV0140FormatGetReq: {
				},
				AMMSV0140SizeGetReq:{
				},
			};

			return {
				resId: clcom.pageId,	//'AMMSV0140',
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
			case OpeType.AMMSV0140_OPETYPE_TMP_SAVE:
				// 一時保存
				switch (opt.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
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
					case amcm_type.AMCM_VAL_ITEM_EDIT_CANCELORDER:	// TODO
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
			case OpeType.AMMSV0140_OPETYPE_TAG_APPLY:
				// タグ発行申請
				ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPLY;
				break;
			case OpeType.AMMSV0140_OPETYPE_TAG_RETURN:
				// タグ発行差戻し
				ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_RETURN;
				break;
			case OpeType.AMMSV0140_OPETYPE_TAG_APPROVE:
				// タグ発行承認
				ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPROVE;
				break;
			case OpeType.AMMSV0140_OPETYPE_LAST_APPLY:
				// 最終承認申請
				switch (opt.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
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
			case OpeType.AMMSV0140_OPETYPE_LAST_RETURN:
				// 最終承認差戻し
				switch (opt.editTytpeID) {
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
			case OpeType.AMMSV0140_OPETYPE_LAST_APPROVE:
				// 最終承認
				switch (opt.editTytpeID) {
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
			}

			return ptnNo;
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

			if ($tgt.prop('checked')) {
				// 仕入なしなので以下の項目を入力不可にする

				// タグ情報
				clutil.viewReadonly($("#ca_tagInfo"));

				// 発注情報
				clutil.viewReadonly($("#ca_orderInfo"));

				// 下代構成
				clutil.viewReadonly($("#cost_info"));

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
			} else {
				// 仕入ありなので以下の項目を入力可にする

				// タグ情報
				clutil.viewRemoveReadonly($("#ca_tagInfo"));

				// 発注情報
				clutil.viewRemoveReadonly($("#ca_orderInfo"));

				// 下代構成
				clutil.viewRemoveReadonly($("#cost_info"));
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

		/**
		 * シーズンと販売開始日から商品展開年を自動設定する
		 */
		setDefaultYear: function() {
			var $season = $("#ca_seasonID");
			var seasonID = $season.val();
			if (seasonID != null && seasonID != "") {
				seasonID = parseInt(seasonID);
			}

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
			default:
				break;
			}
			if (year != 0) {
				$("#ca_year").val(year);
			} else {
				$("#ca_year").val("");
			}
		},

		/**
		 * 生産国変更イベント
		 * @param e
		 */
		_onImportChange: function(e) {
			/*
			 * 発注情報の「生産国」が海外の場合、下代構成の入力通貨と為替レートを表示する
			 */
			var $import = $(e.target);
			var text = $import.find('option:selected').text();
			var code = '';

			if (text != null) {
				code = text.split(':')[0];
				if (code != IMPORT_CODE_JAPAN) {
					// 日本以外なら通貨・為替レートを表示
					$("#div_import_target").show();
				} else {
					// 日本なら通貨・為替レートを非表示
					$("#div_import_target").hide();
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
		 * タグ確認イベント
		 * @param e
		 */
		_onViewTagClick: function(e) {
			if ($('#ca_tagIssueFlag').prop('checked')) {
				$('.balloonBox').fadeToggle();
			}
		},

		/**
		 * 上代履歴を表示イベント
		 * @param e
		 */
		_onPriceHistClick: function(e) {
			// 上代履歴ダイアログを表示する
			this.AMMSV0102Dialog.show(this.priceHistList, null);
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
			var AMMSV0140SizeGetReq = {
				srchSizePtnID: id,
				srchDate: srchDate,
			};
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				AMMSV0140SizeGetReq: AMMSV0140SizeGetReq,
			};

			// 1. リクエストを投げる
			var uri = "AMMSV0140";
			return clutil.postJSON(uri, req).done(_.bind(function(data) {
				// 2. リプライを受け取る
				var sizeRsp = data.AMMSV0140SizeGetRsp;
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

			// カラーテーブルの描画処理は不要
			var $div_size = $div_cs.find('div[name="div_size"]:last');
			var $thead_size = $div_size.find('thead[name="ca_table_size_thead"]');
			var $tbody_size = $div_size.find('tbody[name="ca_table_size_tbody"]');

			// サイズテーブルの描画処理は必要
			this.renderTableSize($thead_size, $tbody_size, this.sizeRowList, this.sizeColList, this.sizeRecList, this.curGroupNO);

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
			var makerID = $("#ca_makerID").val();

			var orderHeadRec = null;
			var info = null;

			if (checked) {
				var orderTgtTypeID = $div_prev.find('select[name0="ca_orderTgtTypeID"]').val();
				var tagaddrNo = $div_prev.find('select[name0="ca_tagAddrNo"]').val();
				var approveLimitDate = clutil.dateFormat($div_prev.find('input[name0="ca_approveLimitDate"]').val(), 'yyyymmdd');
				var finishDate = clutil.dateFormat($div_prev.find('input[name0="ca_finishDate"]').val(), 'yyyymmdd');
				var centerDlvDate = clutil.dateFormat($div_prev.find('input[name0="ca_centerDlvDate"]').val(), 'yyyymmdd');
				var dlvDate = clutil.dateFormat($div_prev.find('input[name0="ca_dlvDate"]').val(), 'yyyymmdd');
				var cancelFlag = $div_prev.find('input[name0="ca_cancelFlag"]').prop("checked") ? 1 : 0;

				orderHeadRec = {
					orderSeq: orderSeq,
					orderTgtTypeID: orderTgtTypeID,
					centerDlvDate: centerDlvDate,
					dlvDate: dlvDate,
					finishDate: finishDate,
					orderDate: orderDate,
					orderNo: 0,
					tagaddrNo: tagaddrNo,
					tagaddrName: "",
					cancelFlag: cancelFlag,
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
					orderNo: 0,
					tagaddrNo: 0,
					tagaddrName: "",
					cancelFlag: 0,
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

			//this.renderOrderInfoList(orderHeadRec, orderDtlList, this.groupNoList, maps.grpno2tgtColor, maps.cID2tgtSize, makerID, info);

			// 追加ボタンを非表示にする
			$("#div_addOrderInfo").hide();
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
			var options = {
				readonly: true,
			};
			this.AMMSV0101Dialog.show(this.photoList, null, options);
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
				var retObj = clutil.parseTax(priceIntax);
				price = retObj.withoutTax;
			}
			$("#ca_price").val(price);

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
			$("#ca_profitRate").val(profitRate);
		},

		_eof: 'AMSSV0140.MainView//'
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
		mainView = new MainView(clcom.pageArgs).initUIElement().render();
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