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

var MATERIAL_CODE_OTHER = '999';	/* 素材コード（その他） */
var IMPORT_CODE_JAPAN = '392';		/* 国コード（日本） */
var IMPORT_ID_OTHER = 21;			/* 国ID（その他） */
var FACTORY_ID_OTHER = 32767;		/* 縫製工場ID（その他） */

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
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		editTypes: {},

		events: {
			'click #ca_srch': "_onSrchClick",
			'change #ca_materialID': "_onMaterialIDChange",
			'change #ca_seasonTypeID': '_onSeasonChange',

			'change select[name="ca_placeID"]': '_onPlaceChange',
			'change select[name="ca_tagMaterialID"]': '_onTagMaterialChange',

			'click div.fieldBox.mainPic>div.hover': "_onPhotoSelectClick",

			// 上代
			'change #ca_priceIntax': '_onPriceIntaxChange',
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
					title: '商品企画マスタ',
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

			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			// アプリ個別の View や部品をインスタンス化するとか・・・

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
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
			this.opeTypeId = fixopt.opeTypeId;	// 処理区分を保存

			clutil.mediator.on('onSizePtnJanChanged', this._onSizePtnJanChanged);
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
				break;
			}
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

			var base = {
				id: item.id,				// 商品ID
				unitID: item.unitID,		// 事業ユニットID
				itgrpID: {					// 品種ID
					id: item.itgrpID,
					code: item.itgrpCode,
					name: item.itgrpName,
				},
				makerID: {					// メーカーID
					id: item.makerID,
					code: item.makerCode,
					name: item.makerName,
				},
				clothCode: attr.clothCode,	// 生地品番
				tmpClothCode: attr.tmpClothCode,	// 仮生地品番
				name: item.name,			// 商品名
				year: item.year,			// 商品展開年
				seasonTypeID: attr.seasonTypeID,		// シーズン
				subSeasonTypeID: attr.subSeasonTypeID,	// サブシーズン
				itemTypeID: attr.itemTypeID,	// 商品区分
			};
			return base;
		},

		/**
		 * 属性情報部再現用オブジェクトを作成
		 * @param attr 商品属性マスタ(基本)レコード
		 * @returns {___anonymous3334_3596}
		 */
		_createAttrInfo: function(attr) {
			attr = attr == null ? {} : attr;

			var attrObj = {
				subcls1ID: attr.subcls1ID,		// サブクラス1
				subcls2ID: attr.subcls2ID,		// サブクラス2
				brandID: attr.brandID,			// ブランド
				styleID: attr.styleID,			// スタイル
				materialID: attr.materialID,	// 素材
				materialText: attr.materialText,// 素材テキスト
				designID: attr.designID,		// 柄ID

				subDesignID: attr.subDesignID,	// サブ柄ID
				designColorID: attr.designColorID, // ベース色
				usetypeID: attr.usetypeID,		// 用途区分
			};
			return attrObj;
		},

		/**
		 * 素材テーブル描画処理
		 * ※「部位」「素材」の商品属性は画面起動時(initUIElementがいいかな)に取得すること
		 * @param materialList
		 * @param itgrpId
		 */
		renderTableMaterial: function(materialList) {
			var attrPartsList = attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_PARTS];
			var attrMaterialList = attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_TAGMATERIAL];

			var $tbody = $("#ca_table_material_tbody");

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
				if (mate.tagManual == "(null)") {
					mate.tagManual == "";
				}

				// 追加業のHTMLを作成する
				var tr = _.template($("#ca_rec_template_material").html(), mate);
				// tbodyに追加
				$tbody.append(tr);

				var $tr = $tbody.find('tr:last');
				clutil.initUIelement($tr);	// 行を初期化

				// 部位select
				var $select_place = $tr.find('select[name="ca_placeID"]');
				clutil.cltypeselector2($select_place, attrPartsList, 1, 0,
						'itemattr_id', 'itemattr_name', 'itemattr_code');
				// 仕様selectに値設定
				$select_place.selectpicker('val', mate.placeID);

				// 素材
				var $select_mate = $tr.find('select[name="ca_tagMaterialID"]');
				clutil.cltypeselector2($select_mate, attrMaterialList, 1, 0,
						'itemattr_id', 'itemattr_name', 'itemattr_code');
				$select_mate.selectpicker('val', mate.tagMaterialID);
			}
			var txt = clutil.getclsysparam('PAR_AMCM_DEFAULT_PERCENT');
			$('input[name="ca_materialRatio"]').attr('placeholder', txt);
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
		 * 表示用下代・上代情報の作成
		 * @param attr
		 * @param price
		 * @returns {___anonymous57941_58103}
		 */
		_createCostInfo: function(attr, price) {
			var cost = {
				cost: 0,	// 下代
				currencyID: 0,	// 通貨区分
				exchangeRate: 0,	// 為替レート
			};
			if (price != null) {
				cost = {
					cost: price.cost,	// 下代
					price: price.price,
					priceIntax: price.priceIntax,
					salesPoint: attr.salesPoint,
				};
			}

			return cost;
		},

		photoList: null,
		attrItemMap: {},

		/**
		 *
		 * @param args
		 * @param e
		 */
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data, formatData: formatData}

			clutil.viewRemoveReadonly($("#ca_form"));

			var data = args.data;
			var AMMSV0080GetRsp = data.AMMSV0080GetRsp;

			var itgrpId = 0;

			var item = null;
			var attr = null;
			var price = null;
			var materialList = null;
			var photoList = null;

			if (AMMSV0080GetRsp != null) {
				item = AMMSV0080GetRsp.item;
				attr = AMMSV0080GetRsp.attr;
				price = AMMSV0080GetRsp.price;
				materialList = AMMSV0080GetRsp.materialList;
				photoList = AMMSV0080GetRsp.photoList;
			}
			if (item != null) {
				itgrpId = item.itgrpID;
			}

			// 保存しておく
			this.photoList = photoList;

			// ca_req
			var ca_baseInfo = this._createBaseInfo(item, attr);
			var ca_attrInfo = this._createAttrInfo(attr);
			// カラー、サイズ、JANのテーブル用オブジェクト生成
			var ca_costInfo = this._createCostInfo(attr, price);

			switch (this.opeTypeId) {
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
				// 商品展開年はそのまま表示する
				var list = [{
					id: ca_baseInfo.year,
					code: "",
					name: ca_baseInfo.year,
				}];
				clutil.cltypeselector2($("#ca_year"), list, 0, 1);
			}

			switch(args.status){
			case 'OK':
				clutil.data2view(this.$("#ca_item"), ca_baseInfo);
				clutil.data2view(this.$("#ca_attr"), ca_attrInfo);

				// 画像
				this.renderPhotoList(this.$("#ca_photo"), this.photoList);

				// 素材テーブル
				this.renderTableMaterial(materialList, itgrpId);

				// 下代情報
				clutil.data2view(this.$("#ca_costInfo"), ca_costInfo);

				this.fieldRelation.done(_.bind(function() {
					/*
					 * 1. clcom.srcId == 'AMMSV0090'の場合
					 */
					switch (this.opeTypeId) {
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
						// 素材変更イベントを飛ばしておく
						$('#ca_materialID').trigger('change');
						// シーズンの変更イベント発行
						$("#ca_seasonTypeID").trigger('change');

						var $tgt = null;
						if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
							$tgt = $('#ca_itgrpID');
						}
						else{
							$tgt = $("#ca_unitID").next().children('input');
						}
						this.resetFocus($tgt);
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
						clutil.viewReadonly($("#ca_form"));
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
						// 照会モードの場合はブラウザ戻るボタン［×］ボタンの Confirm を行わない。
						clcom._preventConfirm = true;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
						clutil.viewReadonly($("#ca_form"));
						break;
					}
					$("#mainPicHover").removeClass('notDialog');
				}, this));
				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_item"), ca_baseInfo);
				clutil.data2view(this.$("#ca_attr"), ca_attrInfo);

				// 画像
				this.renderPhotoList(this.$("#ca_photo"), this.photoList);

				// 素材テーブル
				this.renderTableMaterial(materialList, itgrpId);

				// 下代情報
				clutil.data2view(this.$("#ca_costInfo"), ca_costInfo);

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
				clutil.data2view(this.$("#ca_attr"), ca_attrInfo);

				// 画像
				this.renderPhotoList(this.$("#ca_photo"), this.photoList);

				// 素材テーブル
				this.renderTableMaterial(materialList, itgrpId);

				// 下代情報
				clutil.data2view(this.$("#ca_costInfo"), ca_costInfo);

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
			//var PAR_AMCM_YEAR_FROM = clcom.getSysparam(amcm_sysparams.PAR_AMCM_YEAR_FROM);
			var PAR_AMCM_YEAR_TO = Number(clcom.getSysparam(amcm_sysparams.PAR_AMCM_YEAR_TO));

			// メーカー
//			clutil.clvendorcode($("#ca_makerID"), {
//				getVendorTypeId: function() {
//					return amcm_type.AMCM_VAL_VENDOR_MAKER;
//				},
//			});

			// 商品区分
			clutil.cltypeselector(this.$('#ca_itemTypeID'), amcm_type.AMCM_TYPE_ITEM);

			// シーズン
			clutil.cltypeselector(this.$('#ca_seasonTypeID'), amcm_type.AMCM_TYPE_SEASON);

			// サブシーズン
			clutil.cltypeselector(this.$('#ca_subSeasonTypeID'), amcm_type.AMCM_TYPE_SUBSEASON);

			// 商品展開年
			clutil.clyearselector({
				el: $("#ca_year"),
				unselectedflag: true,
				past: 0,
				future: PAR_AMCM_YEAR_TO,
				unselectedflag: true
			});
			$("#ca_year").selectpicker('val', 0);	// 初期値は空白

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
				// メーカー
				clvendorcode: {
					el: "#ca_makerID",
					dependAttrs: {
						vendor_typeid: amcm_type.AMCM_VAL_VENDOR_MAKER,
					},
					rmDepends:['itgrp_id'],
					addDepends:['unit_id'],
				},
				// サブクラス１
				'clitemattrselector subclass1': {
					el: "#ca_subcls1ID",
					dependSrc: {
						iagfunc_id: 'iagfunc_id1'
					},
				},
				// サブクラス２
				'clitemattrselector subclass2': {
					el: "#ca_subcls2ID",
					dependSrc: {
						iagfunc_id: 'iagfunc_id2'
					},
				},
				// 属性ブランド
				'clitemattrselector brand': {
					el: "#ca_brandID",
					dependSrc: {
						iagfunc_id: 'iagfunc_id3'
					},
				},
				// スタイル
				'clitemattrselector style': {
					el: "#ca_styleID",
					dependSrc: {
						iagfunc_id: 'iagfunc_id4'
					},
				},
				// 素材
				'clitemattrselector material': {
					el: "#ca_materialID",
					dependSrc: {
						iagfunc_id: 'iagfunc_id5'
					},
				},
				// 柄
				'clitemattrselector design': {
					el: "#ca_designID",
					dependSrc: {
						iagfunc_id: 'iagfunc_id6'
					},
				},
				// サブ柄
				'clitemattrselector subDesign': {
					el: "#ca_subDesignID",
					dependSrc: {
						iagfunc_id: 'iagfunc_id7'
					},
				},
				// 色
				'clitemattrselector 色': {
					el: "#ca_色",
					dependSrc: {
						iagfunc_id: 'iagfunc_id10'
					},
				},
				// ベース色
				'clitemattrselector designColor': {
					el: "#ca_designColorID",
					dependSrc: {
						iagfunc_id: 'iagfunc_id8'
					},
				},
				// 用途区分
				'clitemattrselector useType': {
					el: "#ca_usetypeID",
					dependSrc: {
						iagfunc_id: 'iagfunc_id9'
					},
				},
			}, {
				dataSource: {
					iagfunc_id1: iagfunc.ITEMATTRGRPFUNC_ID_SUBCLS1,
					iagfunc_id2: iagfunc.ITEMATTRGRPFUNC_ID_SUBCLS2,
					iagfunc_id3: iagfunc.ITEMATTRGRPFUNC_ID_BRAND,
					iagfunc_id4: iagfunc.ITEMATTRGRPFUNC_ID_STYLE,
					iagfunc_id5: iagfunc.ITEMATTRGRPFUNC_ID_MATERIAL,
					iagfunc_id6: iagfunc.ITEMATTRGRPFUNC_ID_DESIGN,
					iagfunc_id7: iagfunc.ITEMATTRGRPFUNC_ID_SUBDESIGN,
					iagfunc_id8: iagfunc.ITEMATTRGRPFUNC_ID_DESIGNCOLOR,
					iagfunc_id9: iagfunc.ITEMATTRGRPFUNC_ID_USETYPE,
					iagfunc_id10: iagfunc.ITEMATTRGRPFUNC_ID_COLOR,
				}
			});
			this.fieldRelation.done(function() {

			});

			clutil.cltxtFieldLimit($("#ca_tmpClothCode"));
			clutil.cltxtFieldLimit($("#ca_clothCode"));
			clutil.cltxtFieldLimit($("#ca_name"));
			clutil.cltxtFieldLimit($("#ca_salesPoint"));
			clutil.cltxtFieldLimit($("#ca_materialText"));

			// 画像選択ダイアログ
			this.AMMSV1101Dialog = new AMMSV1101SelectorView({
				el: this.$("#ca_AMMSV1101_dialog"),		// 配置場所
				$parentView: this.$("#mainColumn"),
			});
			this.AMMSV1101Dialog.render();
			this.AMMSV1101Dialog.okProc = this.AMMSV1101_okProc;

			// 初期のアコーディオン展開状態をつくる。

			return this;
		},

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
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			this.mdBaseView.fetch();	// データを GET してくる。
			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				$("#mainPicHover").removeClass('notDialog');
				// 新規の場合、素材テーブルを初期表示する
				this.renderTableMaterial([]);
				// シーズン変更イベント
				$("#ca_seasonTypeID").trigger('change');
				// 素材変更イベント
				$("#ca_materialID").trigger('change');
				// 初期フォーカス設定
				var $tgt = null;
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					$tgt = $("#ca_itgrpID");
				}
				else{
					$tgt = $("#ca_unitID").next().children('input');
				}
				this.resetFocus($tgt);
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

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			//console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var chkData = this.options.chkData[pgIndex];
			var id = (chkData.id != null) ? chkData.id : chkData.itemID;

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ		・・・これ、必要なの？					【確認】
				reqPage: {
				},
				// 商品マスタ検索リクエスト
				AMMSV0080GetReq: {
					srchID: id,		// 商品ID
					delFlag: chkData.delFlag,	// 削除フラグ
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMMSV0080UpdReq: {
				},
			};

			return {
				resId: clcom.pageId,	//'AMMSV1080',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var f_error = false;
			var confirm = null;
			// 入力チェック
			if (!this.validator.valid()) {
				f_error = true;
			}
			// 画面入力値をかき集めて、Rec を構築する。
			var ca_item = clutil.view2data(this.$("#ca_item"));
			var ca_attr = clutil.view2data(this.$("#ca_attr"));
			var ca_costInfo = clutil.view2data(this.$("#ca_costInfo"));

			// TODO その他のエラーチェックを実装する
			// 素材詳細チェック
			if (!this.isValidMaterialList()) {
				f_error = true;
			}
			// 上代≧下代であること
			var price = _.isEmpty(ca_costInfo.price) ? 0 : Number(ca_costInfo.price);
			var cost = _.isEmpty(ca_costInfo.cost) ? 0 : Number(ca_costInfo.cost);
			if (price < cost) {
				this.validator.setErrorMsg(this.$("#ca_priceIntax"), clmsg.WMS0100);
				this.validator.setErrorHeader(clmsg.cl_echoback);
				confirm = clmsg.WMS0100;
			}

			if (f_error) {
				return null;
			}

			var costIntax = clutil.mergeTax(ca_costInfo.cost);

			var item = {
				id: ca_item.id,
				name: ca_item.name,
				year: ca_item.year,
				makerID: ca_item.makerID,
				unitID: ca_item.unitID,
				itgrpID: ca_item.itgrpID,
			};
			var attr = {
				id: ca_item.id,
				seasonTypeID: ca_item.seasonTypeID,
				subSeasonTypeID: ca_item.subSeasonTypeID,
				usetypeID: ca_attr.usetypeID,
				itemTypeID: ca_item.itemTypeID,
				subcls1ID: ca_attr.subcls1ID,
				subcls2ID: ca_attr.subcls2ID,
				brandID: ca_attr.brandID,
				styleID: ca_attr.styleID,
				designID: ca_attr.designID,
				subDesignID: ca_attr.subDesignID,
				designColorID: ca_attr.designColorID,
				materialID: ca_attr.materialID,
				materialText: ca_attr.materialText,
				clothCode: ca_item.clothCode,
				tmpClothCode: ca_item.tmpClothCode,
				salesPoint: ca_costInfo.salesPoint,
			};
			var price = {
				id: ca_item.id,
				price: ca_costInfo.price,
				priceIntax: ca_costInfo.priceIntax,
				cost: ca_costInfo.cost,
				costIntax: costIntax.withTax,
			};
			var materialList = this._buildUpdReqAMMSV1080MaterialList(item);
			var photoList = this._buildUpdReqAMMSV1080PhotoList(item);

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: this.opeTypeId,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
				AMMSV0080GetReq: {
				},
				// 商品分類マスタ更新リクエスト
				AMMSV0080UpdReq: {
					item: item,
					attr: attr,
					price: price,
					materialList: materialList,
					photoList: photoList,
				},
			};
			return {
				resId: clcom.pageId,
				data:  updReq,
				confirm: confirm,
			};
		},

		/**
		 * 素材テーブルのチェック
		 */
		isValidMaterialList: function() {
			var f_valid = true;
			var idMap = {};
			var msg = clutil.fmtargs(clmsg.EGM0009, ['部位、素材']);

			_.each($("#ca_table_material_tbody tr"), _.bind(function(tr) {
				var $tr = $(tr);
				var $ca_placeID = $tr.find('select[name="ca_placeID"]');
				var $ca_tagMaterialID = $tr.find('select[name="ca_tagMaterialID"]');
				var $ca_materialRatio = $tr.find('input[name="ca_materialRatio"]');
				var $ca_tagManual = $tr.find('input[name="ca_tagManual"]');

				var placeID = $ca_placeID.val();
				var tagMaterialID = $ca_tagMaterialID.val();
				var materialRatio = $ca_materialRatio.val();
				var tagManual = $ca_tagManual.val();

				if ((placeID == 0 && tagMaterialID == 0) && (materialRatio != "" || tagManual != "")) {
					this.validator.setErrorMsg($ca_materialRatio, clmsg.EMS0143);
					this.validator.setErrorMsg($ca_tagManual, clmsg.EMS0143);
					f_valid = false;
				} else if (placeID != 0 || tagMaterialID != 0) {
					var key = placeID + ":" + tagMaterialID;
					if (idMap[key] == true) {
						// 重複
						this.validator.setErrorMsg($ca_placeID, msg);
						this.validator.setErrorMsg($ca_tagMaterialID, msg);
						f_valid = false;
					} else {
						idMap[key] = true;
					}
				}
			}, this));

			return f_valid;
		},

		/**
		 * 商品素材レコードの作成
		 * @param item
		 * @returns {Array}
		 */
		_buildUpdReqAMMSV1080MaterialList: function(item) {
			var list = clutil.tableview2data($("#ca_table_material_tbody tr"));
			var materialList = [];
			var tagSeq = 0;
			_.each(list, _.bind(function(material) {
				if (material.placeID == 0 && material.tagMaterialID == 0 && material.materialRatio == "" && material.tagManual == "") {
					return;
				}
				tagSeq++;
				var data = _.extend({
					id: item.id,
					tagSeq: tagSeq,
				}, material);

				materialList.push(data);
			}, this));

			return materialList;
		},

		/**
		 * 商品画像レコードの作成
		 * @param item
		 * @returns
		 */
		_buildUpdReqAMMSV1080PhotoList: function(item) {
			var list = [];

			_.each(this.photoList, _.bind(function(photo) {
				var rec = _.extend({
					id: item.id,
				}, photo);

				list.push(rec);
			}, this));

			return list;
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
		 * シーズン変更イベント
		 * @param e
		 */
		_onSeasonChange: function(e) {
			/*
			 * シーズンが「オールシーズン」の場合は、サブシーズンを活性化する。
			 * それ以外の場合は、非活性化する
			 */
			var $season = $("#ca_seasonTypeID");	// e.targetでいいけど・・・
			var $subseason = $("#ca_subSeasonTypeID");	// こっちはこれでいいだろう
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
		},

		sizeRowList: [],	// サイズ行レコード
		sizeColList: [],	// サイズ列レコード
		sizeRecList: [],	// サイズレコード
		tagAddrList: [],	// タグ送付先レコード

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
					|| this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) ? false : true;
			var options = {
				readonly: readonly,
			};
			this.AMMSV1101Dialog.show(this.photoList, null, options);
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
			$("#ca_price").val(clutil.comma(price));
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			}
		},

		_eof: 'AMSSV0080.MainView//'
	});

	var attrItemMap = {};

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().then(_.bind(function() {
		var uri = "am_pa_itemattr_srch";
		// 部位
		var req1 = {
			cond: {
				iagfunc_id: iagfunc.ITEMATTRGRPFUNC_ID_PARTS,
			},
		};
		// 素材（タグ用）
		var req2 = {
			cond: {
				iagfunc_id: iagfunc.ITEMATTRGRPFUNC_ID_TAGMATERIAL,
			},
		};
		// 部位取得
		var defer1 = clutil.postJSON(uri, req1).done(_.bind(function(data) {
			attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_PARTS] = data.body.list;
		}, this));
		// 素材（タグ用）取得
		var defer2 = clutil.postJSON(uri, req2).done(_.bind(function(data) {
			attrItemMap[iagfunc.ITEMATTRGRPFUNC_ID_TAGMATERIAL] = data.body.list;
		}, this));

		return $.when(defer1, defer2);
	}, this)).done(_.bind(function(data){
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
	}, this)).fail(function(data){
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