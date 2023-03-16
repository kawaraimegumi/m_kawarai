useSelectpicker2();

//納期変更権限
var _termChg_Flag = 0;
//サーバー検索リクエスト
var OPETYPE = {
		AMPOV0270_REQTYPE_NOMAL:	1,	// 通常検索
		AMPOV0270_REQTYPE_BRAND:	2,	// ブランド検索
		AMPOV0270_REQTYPE_CLOTH:	3,	// 生地検索
		AMPOV0270_REQTYPE_OPTION: 	4,	// オプション検索
		AMPOV0270_REQTYPE_DATE: 	5,	// 店舗着日チェック
		AMPOV0270_REQTYPE_TIME: 	6	// 締時刻チェック
};
//区分
var TYPE = {
		ON: 1,
		OFF:0,

		ALL: 0,
		ST : 1,
		JK : 2,
		SL : 3,
		VE : 4,

		L_JK:11,
		L_SK:12,
		L_SL:13,
		L_VE:14,

		S_NECKMAX:50,

		KANJI:2,
		FULL:3,
		INI:4
};
//スライダー用区分
var SLIDER = {
		L_JK_ARM1: 2,
		L_JK_ARM2: 7,

		L_JK_LEN1: 2,
		L_JK_LEN2: 3,
		L_JK_LEN3: 5,

		L_SK_LEN1: 5,
		L_SK_LEN2: 10
};
// 2016/1/6 複製アラート
var ORDERSTOP = {
		POBRAND:			1 << 0,	// ブランド
		POBRANDSTYLE:		1 << 1,	// ブランドスタイル
		POCLOTHCODE:		1 << 2,	// 生地品番
		POCLOTHORDERMAKER: 	1 << 3,	// 発注先
		POMAKERCODE: 		1 << 4,	// メーカー品番
		POOPTGRP: 			1 << 5,	// オプショングループ
		POOPTION: 			1 << 6,	// オプション
		POPARENTBRAND: 		1 << 7	// 親ブランド
};


//レコード情報空要素
var recClearObj = {
		poOrderID:0,firstID:0,recno:"",state:0
};
//ブランド領域空要素
var kindClearObj = {
		orderType:1
};
//ブランド領域空要素
var typeClearObj = {
		M_st:0,M_jk:0,M_sl:0,M_ve:0,M_wash:0,M_cloth:0,M_clothOld:0,M_clothPrice:0,M_brand:0,
		L_jk:0,L_sk:0,L_sl:0,L_ve:0,L_jkSel:0,L_skSel:0,L_slSel:0,L_veSel:0,L_brand:0,L_cloth:0,L_modelType:1,
		S_brand:0,S_cloth:0,S_clothOld:0,S_num:""
};
//その他領域空要素
var otherClearObj = {
		otStoreAdjTypeID:1,otRcptNo:"",otStoreMemo:""
};


//メンズブランド空要素
var M_BrandClearObj = {
		M_brand:0
};
//メンズ生地空要素
var M_ClothClearObj = {
		M_cloth:0,M_clothOld:0,M_clothPrice:0,M_wash:0
};
//メンズシーズン生地空要素
var M_SeasonClearObj = {
		M_season:0
};
//メンズジャケットスタイル空要素
var M_jkStyleClearObj = {
		M_jk_style:0
};
//メンズジャケット空要素
var M_jkOptClearObj = {
		M_jk_size1:0,
		M_jk_size2:0,
		M_jk_ventType:3,
		M_jk_amfType:1,
		M_jk_liningType:1,
		M_jk_pocketType:1,
		M_jk_layerButtonType:1,
		M_jk_name: 0,
		M_jk_nameKanji:"",
		M_jk_nameFull:"",
		M_jk_nameIni:"",
		M_jk_nameMakeType:2,
		M_jk_armLeft: 0,
		M_jk_armRigth: 0,
		M_jk_length: 0,
		M_jk_trunk: 0,
		M_jk_amfPayType:0,
		M_jk_sleeveButtonType:0,
		M_jk_changePocketType:0,
		M_jk_cuffsType:0,
		M_jk_daibaType:0,
		M_jk_summerType:0,
		M_jk_changeButtonType:0,
		M_jk_changeButtonSel:0,
		M_jk_cuffsFirst:0,
		M_jk_flowerHole:0,
		M_jk_buttonThreadColorSel:0,
		M_jk_changeLiningType:0,
		M_jk_changeLiningSel:0
};
//メンズジャケットサイズ2空要素
var M_jkSize2ClearObj = {
		M_jk_size2:0
};
//メンズスラックススタイル空要素
var M_slStyleClearObj = {
		M_sl_style:0
};
//メンズスラックス空要素
var M_slOptClearObj = {
		M_sl_size1:0,
		M_sl_size2:0,
		M_sl_spareType:1,
		M_sl_bottomType:1,
		M_sl_bottom:"3.5",
		M_sl_bottomSpareType:1,
		M_sl_bottomSpare:"3.5",
		M_sl_lengthLeft:"",
		M_sl_lengthRight:"",
		M_sl_weist:0,
		M_sl_adjuster:0,
		M_sl_adjusterSpare:0,
		M_sl_changeButtonType:0,
		M_sl_changeButtonSel:0
};
//メンズスラックスサイズ2空要素
var M_slSize2ClearObj = {
		M_sl_size2:0
};
//メンズベストスタイル空要素
var M_veStyleClearObj = {
		M_ve_style:0
};
//メンズベスト空要素
var M_veOptClearObj = {
		M_ve_size1:0,
		M_ve_size2:0,
		M_ve_amfType:0,
		M_ve_trunk:0,
		M_ve_amfPayType:0,
		M_ve_changeButtonType:0,
		M_ve_changeButtonSel:0,
		M_ve_changeLiningType:0,
		M_ve_changeLiningSel:0
};
//メンズベストサイズ2空要素
var M_veSize2ClearObj = {
		M_ve_size2:0
};



//レディスブランド空要素
var L_BrandClearObj = {
		L_brand:0
};
//レディス生地空要素
var L_ClothClearObj = {
		L_cloth:0
};
//レディスジャケットモデル空要素
var L_jkModelClearObj = {
		L_jkSel:0
};
//レディススカートモデル空要素
var L_skModelClearObj = {
		L_skSel:0
};
//レディスパンツモデル空要素
var L_slModelClearObj = {
		L_slSel:0
};
//レディスベストモデル空要素
var L_veModelClearObj = {
		L_veSel:0
};
//レディスジャケットスタイル空要素
var L_jkStyleClearObj = {
		L_jk_style:0
};
//レディスジャケット空要素
var L_jkOptClearObj = {
		L_jk_size:0,
		L_jk_liningType:1,
		L_jk_pocketType:1,
		L_jk_name:0,
		L_jk_nameKanji:"",
		L_jk_nameFull:"",
		L_jk_nameIni:"",
		L_jk_nameMakeType:2,
		L_jk_armLeft:0,
		L_jk_armRight:0,
		L_jk_length:0,
		L_jk_ventType:0,
		// 2016/1/26 PRS追加削除
		// 2015/12/9 STB追加対応
//		L_jk_sideVentType:0,
//		L_jk_cuffsButtonType:0,
		// 2015/12/9 STB追加対応 ここまで
		L_jk_cuffsType:0,
		L_jk_cuffsPayType:0,
		L_jk_amfType:0,
		L_jk_pocketInnerType:0,
		// 2016/1/26 PRS追加対応
		L_jk_cuffsFirstType:0,
		L_jk_buttonHoleType:0,
		L_jk_buttonHoleSel:0,
		// 2016/1/26 PRS追加対応ここまで
		L_jk_changeButtonType:0,
		L_jk_changeButtonSel:0,
		L_jk_changeLiningType:0,
		L_jk_changeLiningSel:0
};
//レディススカートスタイル空要素
var L_skStyleClearObj = {
		L_sk_style:0
};
//レディススカート空要素
var L_skOptClearObj = {
		L_sk_size:0,
		L_sk_length:0,
		L_sk_waist:0
};
//レディスパンツスタイル空要素
var L_slStyleClearObj = {
		L_sl_style:0
};
//レディスパンツ空要素
var L_slOptClearObj = {
		L_sl_size:0,
		L_sl_bottomType:1,
		L_sl_lengthLeft:"",
		L_sl_lengthRight:"",
		L_sl_waist:0,
		L_sl_bottomWidth:0,
		L_sl_changeButtonType:0,
		L_sl_changeButtonSel:0
};
//レディスベストスタイル空要素
var L_veStyleClearObj = {
		L_ve_style:0
};
//レディスベスト空要素
var L_veOptClearObj = {
		L_ve_size:0,
		L_ve_pocketType:1,
		L_ve_length:0,
		L_ve_amfType:0,
		L_ve_buckleType:0,
		L_ve_changeButtonType:0,
		L_ve_changeButtonSel:0,
		L_ve_changeLiningType:0,
		L_ve_changeLiningSel:0
};



//シャツブランド空要素
var S_BrandClearObj = {
		S_brand:0
};
//シャツ生地空要素
var S_ClothClearObj = {
		S_cloth:0,
		S_clothOld:0
};
//シャツ空要素
var S_OptClearObj = {
		S_collarSel:0,
		S_miter:0,
		S_collarType:0,
		S_cuffsType:1,
		S_cuffsSel:0,
		S_clericSel:0,
		S_frontSel:0,
		S_backSel:0,
		S_amfSel:0,
		S_pocketSel:0,
		S_buttonSel:0,
		S_buttonHoleSel:0,
		S_buttonThreadSel:0,
		S_name:0,
		S_nameFull:"",
		S_nameIni:"",
		S_nameTypeSel:0,
		S_namePlaceSel:0,
		S_nameColorSel:0,
		S_sewingType:0,
		S_pocketChiefType:0,
		S_bodySel:0,
		S_neckSel:0,
		S_armLeftSel:0,
		S_armRigthSel:0
};



//顧客情報取得ダイアログ
$(function(){
	clutil.enterFocusMode($('body'));

	var GuestEditView = Marionette.ItemView.extend({
		template: '#GuestEditView',

		initialize: function(){
		},

		onShow: function(){

		},
		dialogdata2view: function(itemList){
			this.itemList = itemList;
			var no = 1;
			$.each(this.itemList, function() {
				this.num = no++;
			});
			var $tbody = this.$("#ca_table_tbody");
			$tbody.empty();
			$('#ca_rec_template').tmpl(this.itemList).appendTo($tbody);
			// スクロールバー設定
			this.$('#innerScroll').perfectScrollbar();
			// 先頭にチェックを付ける
			var chk_flag = 0;
			$.each(this.$('#ca_table_tbody').find("[name=ca_chk]"), function() {
				if(chk_flag == 0){
					$(this).attr("checked", "checked");
					$(this).closest("label").addClass("checked", "checked");
					$(this).closest("tr").addClass("checked", "checked");
					chk_flag = 1;
				}
			});
		},

		getResult :function(){
			var res = {};
			var flag = 0;
			$.each(this.$('#ca_table_tbody').find("[name=ca_chk]:checked"), function() {
				//最高で一回
				var $tr = $(this).closest('tr');
				res.name = $tr.find("[name=name]").text();
				res.kana = $tr.find("[name=kana]").text();
				res.memberNo = $tr.find("[name=memberNo]").text();
				flag =1;
			});
			if(flag){
				return res;
			}else{
				return null;
			}
		}
	});


	var EditView = Backbone.View.extend({
		el : $("#ca_main"),

		validator : null,

		events : {
			"toggle input[name='ca_submitType']:radio"	: "_onSubmitTypeToggle",		// 送信区分ラジオボタン変更
			"toggle input[name='ca_orderType']:radio"	: "_onOrderTypeToggle",			// 種別区分ラジオボタン変更
			"click #ca_btn_guest_select"				: "_onGuestSelClick",			// お客様情報取得
			"click #ca_btn_store_select"				: "_onStoreSelClick",			// 店舗選択
			"change #ca_storeID"						: "_onChangeStore",				// 店舗変更
			"blur  #ca_otStoreMemo"						: "_onBlurChkOtstoreMemo",		// 店舗用備考欄エラーチェック
			"blur  #ca_custNameKana"					: "_onBlurNameKana",			// フリガナペインチェック

			"clDatepickerOnSelect #ca_InsOldDateInput" 	: "_onInsOldDateInputChange",	//注文日変更
			"change #ca_InsOldDateInput" 				: "_onInsOldDateInputChange",	//注文日変更

			"change #ca_M_season"									: "_onM_ChangeSeason",				// メンズ：シーズン変更
			"change #ca_M_cloth"									: "_onM_ChangeCloth",				// メンズ：生地変更
			"change #ca_M_brand"									: "_onM_ChangeBrand",				// メンズ：ブランド変更

			"change #ca_M_jk_size1"									: "_onM_jk_ChangeSize1",			// メンズ：ジャケットサイズ1変更
			"change #ca_M_jk_style"									: "_onM_jk_ChangeStyle",			// メンズ：ジャケットスタイル変更
			"change #ca_M_jk_name"									: "_onM_jk_ChangeNameSel",			// メンズ：ジャケットネームセレクター変更
			"toggle input[name='ca_M_jk_changeButtonType']:radio"	: "_onM_jk_ChangeButtonTypeToggle",	// メンズ：ジャケットボタン変更ラジオボタン変更
			"toggle input[name='ca_M_jk_changeLiningType']:radio"	: "_onM_jk_ChangeLiningTypeToggle",	// メンズ：ジャケット裏地変更ラジオボタン変更
			"toggle input[name='ca_M_jk_liningType']:radio"			: "_onM_jk_liningTypeToggle",		// メンズ：ジャケット裏仕様変更ラジオボタン変更
			"toggle input[name='ca_M_jk_summerType']:radio"			: "_onM_jk_summerTypeToggle",		// メンズ：サマー仕様変更ラジオボタン変更

			"change #ca_M_sl_size1"									: "_onM_sl_ChangeSize1",			// メンズ：スラックスサイズ1変更
			"change #ca_M_sl_style"									: "_onM_sl_ChangeStyle",			// メンズ：スラックススタイル変更
			"toggle input[name='ca_M_sl_spareType']:radio"			: "_onM_sl_SpareTypeToggle",		// メンズ：スラックススペア変更ラジオボタン変更
			"toggle input[name='ca_M_sl_bottomType']:radio"			: "_onM_sl_BottomTypeToggle",		// メンズ：スラックス裾仕上変更ラジオボタン変更
			"toggle input[name='ca_M_sl_bottomSpareType']:radio"	: "_onM_sl_BottomSpareTypeToggle",	// メンズ：スラックススペア裾仕上変更ラジオボタン変更
			"toggle input[name='ca_M_sl_changeButtonType']:radio"	: "_onM_sl_ChangeButtonTypeToggle",	// メンズ：スラックスボタン変更ラジオボタン変更
			"blur  #ca_M_sl_lengthLeft"								: "_onBlurM_LeftCheckStep05",		// 0.5cm刻みかチェック
			"blur  #ca_M_sl_lengthRight"							: "_onBlurM_RightCheckStep05",		// 0.5cm刻みかチェック

			"change #ca_M_ve_size1"									: "_onM_ve_ChangeSize1",			// メンズ：ベストサイズ1変更
			"change #ca_M_ve_style"									: "_onM_ve_ChangeStyle",			// メンズ：ベストスタイル変更
			"toggle input[name='ca_M_ve_changeButtonType']:radio"	: "_onM_ve_ChangeButtonTypeToggle",	// メンズ：ベストボタン変更ラジオボタン変更
			"toggle input[name='ca_M_ve_changeLiningType']:radio"	: "_onM_ve_ChangeLiningTypeToggle",	// メンズ：ベスト裏地変更ラジオボタン変更

			"toggle input[name='ca_L_modelType']:radio"				: "_onL_ModelTypeToggle",			// モデル区分ラジオボタン変更
			"change #ca_L_jkSel"									: "_onL_ChangeModelJK",				// レディス：ジャケットモデル変更
			"change #ca_L_skSel"									: "_onL_ChangeModelSK",				// レディス：スカートモデル変更
			"change #ca_L_slSel"									: "_onL_ChangeModelSL",				// レディス：スラックスモデル変更
			"change #ca_L_veSel"									: "_onL_ChangeModelVE",				// レディス：ベストモデル変更

			"change #ca_L_brand"									: "_onL_ChangeBrand",				// レディス：ブランド変更
			"change #ca_L_cloth"									: "_onL_ChangeCloth",				// レディス：生地変更

			"change #ca_L_jk_style"									: "_onL_jk_ChangeStyle",			// レディス：ジャケットスタイル変更
			"change #ca_L_jk_size"									: "_onL_jk_ChangeSize",				// レディス：ジャケットサイズ変更
			"toggle input[name='ca_L_jk_changeButtonType']:radio"	: "_onL_jk_ChangeButtonTypeToggle",	// レディス：ボタン変更ラジオボタン変更
			"toggle input[name='ca_L_jk_changeLiningType']:radio"	: "_onL_jk_ChangeLiningTypeToggle",	// レディス：裏地変更ラジオボタン変更
			"toggle input[name='ca_L_jk_buttonHoleType']:radio"		: "_onL_jk_ChangeButtonHoleTypeToggle",	// レディス：ボタンホールカラー糸ラジオボタン変更
			"change #ca_L_jk_name"									: "_onL_jk_ChangeNameSel",			// レディス：ネームセレクター変更

			"toggle input[name='ca_L_jk_cuffsType']:radio"			: "_onL_jk_ChangeCuffsTypeToggle",	// レディス：無料リターンカフスラジオボタン変更
			"toggle input[name='ca_L_jk_cuffsPayType']:radio"		: "_onL_jk_ChangeCuffsPayTypeToggle",// レディス：有料リターンカフスラジオボタン変更
			"toggle input[name='ca_L_jk_cuffsFirstType']:radio"		: "_onL_jk_ChangeCuffsFirstTypeToggle",// レディス：本切羽ラジオボタン変更

			"change #ca_L_sk_style"									: "_onL_sk_ChangeStyle",			// レディス：スカートスタイル変更
			"change #ca_L_sk_size"									: "_onL_sk_ChangeSize",				// レディス：スカートサイズ変更

			"change #ca_L_sl_style"									: "_onL_sl_ChangeStyle",			// レディス：パンツスタイル変更
			"toggle input[name='ca_L_sl_bottomType']:radio"			: "_onL_sl_BottomTypeToggle",		// レディス：裾仕上げ変更ラジオボタン変更
			"toggle input[name='ca_L_sl_changeButtonType']:radio"	: "_onL_sl_ChangeButtonTypeToggle",	// レディス：ボタン変更ラジオボタン変更
			"blur  #ca_L_sl_lengthLeft"								: "_onBlurL_LeftCheckStep05",		// 0.5cm刻みかチェック
			"blur  #ca_L_sl_lengthRight"							: "_onBlurL_RightCheckStep05",		// 0.5cm刻みかチェック

			"change #ca_L_ve_style"									: "_onL_ve_ChangeStyle",			// レディス：ベストスタイル変更
			"toggle input[name='ca_L_ve_changeButtonType']:radio"	: "_onL_ve_ChangeButtonTypeToggle",	// レディス：ボタン変更ラジオボタン変更
			"toggle input[name='ca_L_ve_changeLiningType']:radio"	: "_onL_ve_ChangeLiningTypeToggle",	// レディス：裏地変更ラジオボタン変更



			"change #ca_S_brand"									: "_onS_ChangeBrand",				// シャツ：ブランド変更
			"change #ca_S_cloth"									: "_onS_ChangeCloth",				// シャツ：生地変更

			"blur #ca_S_num"										: "_onS_BlurNum",					// シャツ：枚数変更
			"change #ca_S_collarSel"								: "_onS_ChangeCollar",				// シャツ：衿変更
			"change #ca_S_cuffsSel"									: "_onS_ChangeCuffs",				// シャツ：カフス変更
			"change #ca_S_bodySel"									: "_onS_ChangeBody",				// シャツ：ボディ型変更
			"toggle input[name='ca_S_cuffsType']:radio"				: "_onS_CuffsTypeToggle",			// シャツ：袖ラジオボタン変更
			"change #ca_S_name"										: "_onS_ChangeNameSel"				// シャツ：ネームセレクター変更
		},


		initialize: function(opt){
			_.bindAll(this);
			// 持ち回りリスト
			this.clothList = [];
			this.brandList = [];
			this.seasonList = [];
			this.sizeListCom = [];
			this.sizeList1 = [];
			this.sizeList2 = [];
			this.styleStList = [];
			this.styleJkList = [];
			this.styleSlList = [];
			this.styleSkList = [];
			this.styleVeList = [];
			this.changeVeButtonList = [];
			this.changeLiningList = [];
			this.optionList = [];
			this.modelList = [];

			// リリース用のラジオロック 1=全ロック、2=レディス、シャツロック、3=シャツロック
			// シスパラの定義待ちで暫定値
			this.lockLevel = 0;

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			this.options = fixopt;
			this.submitOnFlag = false;		// 画面先頭の送信区分が選択されているかどうか

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
						title: 'AOKI',
						subtitle: 'PO発注登録',
						opeTypeId: o.opeTypeId,
						pageCount: o.chkData.length,
						// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
						// リクエストビルダ関数を渡しておく。
						buildSubmitReqFunction: this._buildSubmitReqFunction,
						// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
						// リクエストのビルダ関数を opt で渡しておく。
						buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
						?this._buildGetReqFunction : undefined,
								buildSubmitCheckDataFunction : this._buildSubmitCheckFunction,
								btn_cancel: {
									label:'一覧に戻る',
									action: undefined
								},
								updMessageDialog: false
				};

				// フッタ名称変更
				var ope = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
				var label = '登録内容の確認';
				if(fixopt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					ope = am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL;
					label = '削除内容の確認';
				}

				_.extend(mdOpt, {
					opeTypeId: [
					            {
					            	opeTypeId: ope,
					            	label: label
					            },
					            ],
					            btn_cancel: true,
					            btn_submit: true,
					            btn_csv: false
				});

				return mdOpt;

			},this)(fixopt);

			//this.options.opeTypeId = fixopt.opeTypeId;
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				// clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				this.f_confirm = false;
				// fall through
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				// clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			}

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			return this;
		},



		initUIelement : function(){
			this.mdBaseView.initUIElement();
			// 初期データ取得後に呼ばれる関数
			// 店舗
			var storeID = clcom.userInfo.org_id;
			var storeCode = clcom.userInfo.org_code;
			var storeName = clcom.userInfo.org_name;
			this.utl_store = clutil.clorgcode( {
				el : '#ca_storeID',
				dependAttrs : {
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_HD_LEVELID')),
					orglevel_id : Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					org_typeid:	amcm_type.AMCM_VAL_ORG_KIND_STORE,
					p_org_id	: Number(clcom.getSysparam('PAR_AMMS_UNITID_AOKI'))		// AOKI固定
				},
			});
			this.listenTo(this.utl_store, "change", this._onChangeStore);
			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				this.utl_store.setValue({id: storeID, code: storeCode, name: storeName});
				clutil.viewReadonly($("#ca_storeID_div"));
				this.$("#ca_btn_store_select").attr("disabled", true);
				this.$("#ca_btn_store_select").hide();
			}else{

			}

			//担当者
			this.utl_staff = clutil.clstaffcode2($("#ca_userID"));

			// デートピッカー
			var $orderDate = clutil.datepicker(this.$("#ca_orderDate"));
			$orderDate.datepicker('setIymd', clcom.getOpeDate());
			clutil.viewReadonly(this.$("#ca_orderDate_div"));
			var $arrivalDate = clutil.datepicker(this.$("#ca_arrivalDate"));
			$arrivalDate.datepicker('setIymd', -1);
			clutil.viewReadonly(this.$("#ca_arrivalDate_div"));
			var $saleDate = clutil.datepicker(this.$("#ca_saleDate"));
			$saleDate.datepicker('setIymd', -1);
			var $saleDate = clutil.datepicker(this.$("#ca_saleDate"));
			$saleDate.datepicker('setIymd', -1);

			// フィールドリミッター
			clutil.cltxtFieldLimit($("#ca_custName"));
			clutil.cltxtFieldLimit($("#ca_custNameKana"));
			clutil.cltxtFieldLimit($("#ca_membNo"));
			clutil.cltxtFieldLimit($("#ca_otRcptNo"));
			clutil.cltxtFieldLimit($("#ca_otStoreMemo"));
			clutil.cltxtFieldLimit($("#ca_M_jk_nameKanji"));
			clutil.cltxtFieldLimit($("#ca_M_jk_nameFull"));
			clutil.cltxtFieldLimit($("#ca_M_jk_nameIni"));
			clutil.cltxtFieldLimit($("#ca_L_jk_nameKanji"));
			clutil.cltxtFieldLimit($("#ca_L_jk_nameFull"));
			clutil.cltxtFieldLimit($("#ca_L_jk_nameIni"));
			clutil.cltxtFieldLimit($("#ca_S_nameFull"));
			clutil.cltxtFieldLimit($("#ca_S_nameIni"));

			// ツールチップ
			$("#tp_InsOldDateInput").tooltip({html: true});
			$("#tp_tel").tooltip();

			// 過去日選択隠し
			$("#ca_InsOldDateInputArea").hide();

			// 隠しIDリセット
			$("#ca_arrivalDateSave").val(0);
			$("#ca_M_clothOld").val(0);
			$("#ca_M_clothPrice").val(0);

			// 区分セレクター
			clutil.cltypeselector(this.$("#ca_M_jk_name"), amcm_type.AMCM_TYPE_PO_NAME_TYPE);
			clutil.cltypeselector(this.$("#ca_L_jk_name"), amcm_type.AMCM_TYPE_PO_NAME_TYPE);
			clutil.cltypeselector(this.$("#ca_otStoreAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_AT_STORE);

			// 新規作成時なら、初期化関数
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && !clcom.pageData){
				this.setInit(amcm_type.AMCM_VAL_PO_CLASS_MENS);
				//#20150824 店舗ユーザーでログインした場合、店舗選択処理を行う
				// ここでやらないとpopページでもロックされる
				if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
					this._onChangeStore();
				}
			}

			//チェックボックスのtoggle設定
			this.setCheckBox();
			// スライダー作成
			this.setSlider();

			/** リリース用ロック **/
			this.setReleaseLock();
			/****/

			this.initUIElement_AMPAV0010();
			return this;
		},

		/** リリース用ロック **/
		setReleaseLock:function(){
			if(this.lockLevel == 1){
				clutil.viewReadonly(this.$(".ca_Lock"));
			}
			else if(this.lockLevel == 2){
				clutil.viewReadonly(this.$(".ca_Lock2"));
			}
			else if(this.lockLevel == 3){
				clutil.viewReadonly(this.$(".ca_Lock3"));
			}
		},


		// 過去日変更
		_onInsOldDateInputChange: function(){
			if( this.$("#ca_InsOldDateInput").val() == null || clutil.dateFormat(this.$("#ca_InsOldDateInput").val(), 'yyyymmdd')  <= 0){
				clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', -1);
				return;
			}
			var oldDate = clutil.dateFormat(this.$("#ca_InsOldDateInput").val(), 'yyyymmdd');
			clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', oldDate);
			this._onChangeStore(true);
		},

		/**スライダー設定*/
		setSlider: function(){
			this.makeSlider_M_jk();
			this.makeSlider_M_sl();
			this.makeSlider_M_ve();
			this.makeSlider_L_jk();
			this.makeSlider_L_sk();
			this.makeSlider_L_sl();
			this.makeSlider_L_ve();
			this.makeSlider_S();
		},


		/**スライダー作成*/
		makeSlider: function($slider, $valbox, inival, min, max, step){
			var _this = this;
			var amount;
			$slider.slider({
				value: inival,
				min: min,
				max: max,
				step: step,
				slide: function( event, ui ) {
					amount = _this.addPlus(ui.value);
					$valbox.val(amount);
				}
			});

			// スライダー初期値再設定(初期値が小数の場合、上記だと切り上げされてしまうので)
			$slider.slider("value" , inival);
			// 左ボックスに値反映
			$valbox.val(this.addPlus($slider.slider("value")));
		},
		/**スライダー作成(符号なし)*/
		makeSliderNonSign: function($slider, $valbox, inival, min, max, step){
			var _this = this;
			var amount;
			$slider.slider({
				value: inival,
				min: min,
				max: max,
				step: step,
				slide: function( event, ui ) {
					amount = _this.addPlusNonSign(ui.value);
					$valbox.val(amount);
				}
			});

			// スライダー初期値再設定(初期値が小数の場合、上記だと切り上げされてしまうので)
			$slider.slider("value" , inival);
			// 左ボックスに値反映
			$valbox.val(this.addPlusNonSign($slider.slider("value")));
		},

		/** メンズスライダー*/
		makeSlider_M_jk: function(){
			// メンズジャケット左袖丈
			this.makeSlider($("#ca_M_jk_armLeft_slider"), $("#ca_M_jk_armLeft")
					, 0.0, -5.0, 5.0, 0.5);
			// メンズジャケット右袖丈
			this.makeSlider($("#ca_M_jk_armRigth_slider"), $("#ca_M_jk_armRigth")
					, 0.0, -5.0, 5.0, 0.5);
			// メンズジャケット着丈
			this.makeSlider($("#ca_M_jk_length_slider"), $("#ca_M_jk_length")
					, 0.0, -5.0, 5.0, 0.5);
			// メンズジャケット中胴
			this.makeSlider($("#ca_M_jk_trunk_slider"), $("#ca_M_jk_trunk")
					, 0.0, -5.0, 5.0, 0.5);
		},
		makeSlider_M_ve: function(){
			// メンズベスト中胴
			this.makeSlider($("#ca_M_ve_trunk_slider"), $("#ca_M_ve_trunk")
					, 0.0, -8.0, 8.0, 0.5);
		},
		makeSlider_M_sl: function(){
			// メンズスラックス裾
			this.makeSliderNonSign($("#ca_M_sl_bottom_slider"), $("#ca_M_sl_bottom")
					, 3.5, 2.0, 5.0, 0.5);
			// メンズスラックススペア裾
			this.makeSliderNonSign($("#ca_M_sl_bottomSpare_slider"), $("#ca_M_sl_bottomSpare")
					, 3.5, 2.0, 5.0, 0.5);
			// メンズスラックスウエスト
			this.makeSlider($("#ca_M_sl_weist_slider"), $("#ca_M_sl_weist")
					, 0.0, -3.0, 3.0, 0.5);
		},
		/** レディススライダー*/
		makeSlider_L_jk: function(){
			this.makeSlider($("#ca_L_jk_armLeft7_slider"), $("#ca_L_jk_armLeft")
					, 0.0, -7.0, 7.0, 0.5);
			this.makeSlider($("#ca_L_jk_armLeft2_slider"), $("#ca_L_jk_armLeft")
					, 0.0, -2.0, 2.0, 0.5);
			this.makeSlider($("#ca_L_jk_armRight7_slider"), $("#ca_L_jk_armRight")
					, 0.0, -7.0, 7.0, 0.5);
			this.makeSlider($("#ca_L_jk_armRight2_slider"), $("#ca_L_jk_armRight")
					, 0.0, -2.0, 2.0, 0.5);
			this.makeSlider($("#ca_L_jk_length5_slider"), $("#ca_L_jk_length")
					, 0.0, -5.0, 5.0, 0.5);
			this.makeSlider($("#ca_L_jk_length3_slider"), $("#ca_L_jk_length")
					, 0.0, -3.0, 3.0, 0.5);
			this.makeSlider($("#ca_L_jk_length2_slider"), $("#ca_L_jk_length")
					, 0.0, -2.0, 2.0, 0.5);
		},
		makeSlider_L_sk: function(){
			// レディススカート丈
			this.makeSlider($("#ca_L_sk_length10_slider"), $("#ca_L_sk_length")
					, 0.0, -10.0, 10.0, 0.5);
			this.makeSlider($("#ca_L_sk_length5_slider"), $("#ca_L_sk_length")
					, 0.0, -5.0, 5.0, 0.5);
			// レディススカートウエスト
			this.makeSlider($("#ca_L_sk_waist_slider"), $("#ca_L_sk_waist")
					, 0.0, -3.0, 3.0, 0.5);
		},
		makeSlider_L_sl: function(){
			// レディスパンツウエスト
			this.makeSlider($("#ca_L_sl_waist_slider"), $("#ca_L_sl_waist")
					, 0.0, -3.0, 3.0, 0.5);
			// レディスパンツ裾幅
			this.makeSlider($("#ca_L_sl_bottomWidth_slider"), $("#ca_L_sl_bottomWidth")
					, 0.0, -2.0, 2.0, 0.5);
		},
		makeSlider_L_ve: function(){
			// レディスベスト裾幅
			this.makeSlider($("#ca_L_ve_length_slider"), $("#ca_L_ve_length")
					, 0.0, -3.0, 3.0, 0.5);
		},
		/** シャツスライダー*/
		makeSlider_S: function(){
			// シャツ肩幅
			this.makeSlider($("#ca_S_shoulder_slider"), $("#ca_S_shoulder")
					, 0.0, -2.0, 2.0, 1.0);
			// シャツ胸回り
			this.makeSlider($("#ca_S_chest_slider"), $("#ca_S_chest")
					, 0.0, -2.0, 2.0, 1.0);
			// シャツ胴回り
			this.makeSlider($("#ca_S_waist_slider"), $("#ca_S_waist")
					, 0.0, -6.0, 6.0, 2.0);
			// シャツ裾回り
			this.makeSlider($("#ca_S_bottom_slider"), $("#ca_S_bottom")
					, 0.0, -6.0, 6.0, 2.0);
			// シャツ身丈
			this.makeSlider($("#ca_S_length_slider"), $("#ca_S_length")
					, 0.0, -8.0, 8.0, 2.0);
			// シャツ左カフス
			this.makeSlider($("#ca_S_cuffsLeft_slider"), $("#ca_S_cuffsLeft")
					, 0.0, -2.0, 2.0, 1.0);
			// シャツ右カフス
			this.makeSlider($("#ca_S_cuffsRight_slider"), $("#ca_S_cuffsRight")
					, 0.0, -2.0, 2.0, 1.0);
		},
		addPlus:function(value){
			// スライダー値に符号をつける
			if(value > 0){
				value = '+' + value;
				return value;
			}
			else if(value <= 0){
				return value;
			}
		},
		addPlusNonSign:function(value){
			// 符号なしバージョン
			return value;
		},


		/**スライダーのdisabled*/
		disabledSlider:function($slider, $dot){
			$slider.slider({ disabled: true });
			$dot.addClass("ca_untouchDot");
		},
		/**スライダーのabled*/
		abledSlider:function($slider, $dot){
			$slider.slider({ disabled: false });
			$dot.removeClass("ca_untouchDot");
		},
		/**全スライダーのdisabled*/
		disabledSliderAll:function(){
			this.disabledSlider_M_jk();
			this.disabledSlider_M_sl();
			this.disabledSlider_M_ve();
			this.disabledSlider_L_jk();
			this.disabledSlider_L_sk();
			this.disabledSlider_L_sl();
			this.disabledSlider_L_ve();
			this.disabledSlider_S();
		},
		/**メンズスライダーのdisabled*/
		disabledSlider_M_jk: function(){
			this.disabledSlider($('.ca_M_jkSlider'), $('.ca_M_jkSliderDot'));
		},
		disabledSlider_M_sl: function(){
			this.disabledSlider($('.ca_M_slSlider'), $('.ca_M_slSliderDot'));
		},
		disabledSlider_M_ve: function(){
			this.disabledSlider($('.ca_M_veSlider'), $('.ca_M_veSliderDot'));
		},
		/**レディススライダーのdisabled*/
		disabledSlider_L_jk: function(){
			this.disabledSlider($('.ca_L_jkSlider'), $('.ca_L_jkSliderDot'));
		},
		disabledSlider_L_sk: function(){
			this.disabledSlider($('.ca_L_skSlider'), $('.ca_L_skSliderDot'));
		},
		disabledSlider_L_sl: function(){
			this.disabledSlider($('.ca_L_slSlider'), $('.ca_L_slSliderDot'));
		},
		disabledSlider_L_ve: function(){
			this.disabledSlider($('.ca_L_veSlider'), $('.ca_L_veSliderDot'));
		},
		/**シャツスライダーのdisabled*/
		disabledSlider_S: function(){
			this.disabledSlider($('.ca_S_Slider'), $('.ca_S_SliderDot'));
		},

		/**全スライダーのdisabled*/
		abledSliderAll:function(){
			this.abledSlider_M_jk();
			this.abledSlider_M_sl();
			this.abledSlider_M_ve();
			this.abledSlider_L_jk();
			this.abledSlider_L_sk();
			this.abledSlider_L_sl();
			this.abledSlider_L_ve();
			this.abledSlider_S();
		},
		/**メンズスライダーのabled*/
		abledSlider_M_jk: function(){
			this.abledSlider($('.ca_M_jkSlider'), $('.ca_M_jkSliderDot'));
		},
		abledSlider_M_sl: function(){
			this.abledSlider($('.ca_M_slSlider'), $('.ca_M_slSliderDot'));
		},
		abledSlider_M_ve: function(){
			this.abledSlider($('.ca_M_veSlider'), $('.ca_M_veSliderDot'));
		},
		/**レディススライダーのabled*/
		abledSlider_L_jk: function(){
			this.abledSlider($('.ca_L_jkSlider'), $('.ca_L_jkSliderDot'));
		},
		abledSlider_L_sk: function(){
			this.abledSlider($('.ca_L_skSlider'), $('.ca_L_skSliderDot'));
		},
		abledSlider_L_sl: function(){
			this.abledSlider($('.ca_L_slSlider'), $('.ca_L_slSliderDot'));
		},
		abledSlider_L_ve: function(){
			this.abledSlider($('.ca_L_veSlider'), $('.ca_L_veSliderDot'));
		},
		/**シャツスライダーのabled*/
		abledSlider_S: function(){
			this.abledSlider($('.ca_S_Slider'), $('.ca_S_SliderDot'));
		},




		/**チェックボックスのtoggle設定*/
		setCheckBox:function(){
			var _this = this;
			// メンズ生地ウォッシャブル
			// 生地セレクター作り直し
			this.$el.delegate(':checkbox[id=ca_M_wash]', 'toggle', function (ev) {
				// 現行の値記録
				var clothOld = $("#ca_M_clothOld").val();
				var cloth = clutil.view2data($("#ca_M_clothArea"));
				var brand = clutil.view2data($("#ca_M_brandArea"));
				var clothSel = _this.makeClothSel(false, 1, $("#ca_M_cloth"), null, null);
				var styleSel = null;
				var styleOptSel = null;
				var baseData =  clutil.view2data($('#ca_baseField'));
				var otherData =  clutil.view2data($('#ca_otherField'));
				var orderData =  clutil.view2data($('#ca_M_Field'));

				clutil.viewRemoveReadonly($('#ca_M_jk_styleArea'));
				clutil.viewRemoveReadonly($('#ca_M_sl_styleArea'));
				clutil.viewRemoveReadonly($('#ca_M_ve_styleArea'));
				clutil.viewRemoveReadonly($('#ca_M_clothArea'));



				if (!$(this).prop('checked')) {
					// ウォッシャブルOFF
					$.when(clothSel).done(function(){
						if(cloth.M_cloth > 0){
							// 既存生地の復帰
							cloth.M_cloth = clothOld;
							clutil.data2view($("#ca_M_clothArea"), cloth);
							_this.M_setClothOld_Price();
						}
						// 店着日再計算
						_this.getArrivalDate(false, amcm_type.AMCM_VAL_PO_CLASS_MENS, null, null);
						// スタイルセレクター再指定
						styleSel = _this.makeStyleSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS, baseData, otherData);
						$.when(styleSel).done(function(){
							if(orderData.M_jk_style > 0){
								clutil.data2view($("#ca_M_jk_styleArea"), {M_jk_style:orderData.M_jk_style});
							}
							if(orderData.M_sl_style > 0){
								clutil.data2view($("#ca_M_sl_styleArea"), {M_sl_style:orderData.M_sl_style});
							}
							if(orderData.M_ve_style > 0){
								clutil.data2view($("#ca_M_ve_styleArea"), {M_ve_style:orderData.M_ve_style});
							}
							// オプション条件再指定
							styleOptSel = _this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS
									, TYPE.ALL, null, baseData, otherData);
							// 裏仕様が総裏ならサマー不可(オプションセレクターの後でないと動かない)
							$.when(styleOptSel).done(function(){
								_this._onM_jk_liningTypeToggle(null, true, orderData.M_jk_liningType);
							});
						});
					});
				}
				else{
					// ウォッシャブルON
					$.when(clothSel).done(function(){
						// セレクター作成後、リセット判定
						if(cloth.M_cloth > 0){
							var chkCloth = _this.chkM_clothWashClothEffect(clothOld);
							if(chkCloth == true){
								// 既存選択生地・全スタイルが選択可能なら復帰
								cloth.M_cloth = clothOld;
								clutil.data2view($("#ca_M_clothArea"), cloth);
								_this.M_setClothOld_Price();
								// 店着日再計算
								_this.getArrivalDate(false, amcm_type.AMCM_VAL_PO_CLASS_MENS, null, null);
								// スタイルセレクター再指定
								styleSel = _this.makeStyleSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS, baseData, otherData);


								$.when(styleSel).done(function(){
									// 各スタイル対応チェック
									var chkJkStyle = _this.chkM_clothWashStyleEffect(amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, orderData.M_jk_style);
									var chkSlStyle = _this.chkM_clothWashStyleEffect(amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS, orderData.M_sl_style);
									var chkVeStyle = _this.chkM_clothWashStyleEffect(amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST, orderData.M_ve_style);

									if(chkJkStyle == true && chkSlStyle == true && chkVeStyle == true){
										if(orderData.M_jk_style > 0){
											clutil.data2view($("#ca_M_jk_styleArea"), {M_jk_style:orderData.M_jk_style});
										}
										if(orderData.M_sl_style > 0){
											clutil.data2view($("#ca_M_sl_styleArea"), {M_sl_style:orderData.M_sl_style});
										}
										if(orderData.M_ve_style > 0){
											clutil.data2view($("#ca_M_ve_styleArea"), {M_ve_style:orderData.M_ve_style});
										}
										// オプション条件再指定
										styleOptSel = _this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS
												, TYPE.ALL, null, baseData, otherData);
										// 裏仕様が総裏ならサマー不可(オプションセレクターの後でないと動かない)
										$.when(styleOptSel).done(function(){
											_this._onM_jk_liningTypeToggle(null, true, orderData.M_jk_liningType);
										});
									}
									else{
										var msg = "";
										if(chkJkStyle == false){
											msg = "ジャケット";
										}
										if(chkSlStyle == false){
											if(chkJkStyle == false){
												msg = msg + "・";
											}
											msg = msg + "スラックス";
										}
										if(chkVeStyle == false){
											if(chkJkStyle == false || chkSlStyle == false){
												msg = msg + "・";
											}
											msg = msg + "ベスト";
										}

										// 既存選択スタイルが選択不可の場合は確認ダイアログ
										clutil.ConfirmDialog("選択済みの" + msg + "のスタイルはウォッシャブル未対応です。<br>上記スタイル以降の内容をリセットします。<br>よろしいですか？"
												, function(_this){
											try{
												// [はい]スタイル以降リセット
												clutil.data2view($("#ca_M_clothArea"), cloth);
												clutil.data2view($("#ca_M_brandArea"), brand);

												var styleSel2 = _this.makeStyleSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS, baseData, otherData);

												$.when(styleSel2).done(function(){
													if(chkJkStyle == false){
														_this.M_lockUnselectJkStyle();
														clutil.data2view($("#ca_M_jk_styleArea"), M_jkStyleClearObj);
													}
													else{
														clutil.data2view($("#ca_M_jk_styleArea"), {M_jk_style:orderData.M_jk_style});
													}
													if(chkSlStyle == false){
														_this.M_lockUnselectSlStyle();
														clutil.data2view($("#ca_M_sl_styleArea"), M_slStyleClearObj);
													}
													else{
														clutil.data2view($("#ca_M_sl_styleArea"), {M_sl_style:orderData.M_sl_style});
													}
													if(chkVeStyle == false){
														_this.M_lockUnselectVeStyle();
														clutil.data2view($("#ca_M_ve_styleArea"), M_veStyleClearObj);
													}
													else{
														clutil.data2view($("#ca_M_ve_styleArea"), {M_ve_style:orderData.M_ve_style});
													}
												});
												return;
											}finally{
											}
										}, function(_this){
											console.log('CANCEL', arguments);
											try{
												// [いいえ]旧情報を再表示
												var base = clutil.view2data($("#ca_baseField"));
												var other = clutil.view2data($("#ca_otherField"));

												// 旧生地番号再設定
												base.M_cloth = clothOld;
												base.M_wash = 0;

												cloth.M_cloth = clothOld;
												cloth.M_wash = 0;
												clutil.data2view($("#ca_M_clothArea"), cloth);

												var clothSel2 = _this.makeClothSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS, $("#ca_M_cloth"), base, other);
												var brandSel = _this.makeBrandSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS, $("#ca_M_brand"), base, other);
												// ウォッシャブルフラグ再定義
												var styleSel3 = _this.makeStyleSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS, base, other);

												$.when(clothSel2).done(function(){
													// 旧生地セレクター設定
													clutil.data2view($("#ca_M_clothArea"), cloth);
													clutil.viewRemoveReadonly($('#ca_M_brandArea'));


													$.when(brandSel).done(function(){
														// 旧ブランドセレクター作成
														clutil.data2view($("#ca_M_brandArea"), brand);
														clutil.viewRemoveReadonly($(".ca_M_clothEffectDiv"));
														_this.M_setClothOld_Price();

														$.when(styleSel3).done(function(){
															// 旧スタイルセレクター作成
															clutil.data2view($("#ca_M_jk_styleArea"), {M_jk_style:orderData.M_jk_style});
															clutil.data2view($("#ca_M_sl_styleArea"), {M_sl_style:orderData.M_sl_style});
															clutil.data2view($("#ca_M_ve_styleArea"), {M_ve_style:orderData.M_ve_style});
														});
													});
												});
												return;
											}finally{

											}
										}, _this);
									}
								});
							}
							else{
								// 既存選択生地が存在しない場合は確認ダイアログ
								clutil.ConfirmDialog("選択済みの生地はウォッシャブル未対応です。<br>ブランド以降の内容をリセットします。<br>よろしいですか？"
										, function(_this){
											try{
												// [はい]ブランド以降リセット
												clutil.data2view($("#ca_M_clothArea"), cloth);
												_this.M_lockUnselectCloth();
												return;
											}finally{
											}
										}, function(_this){
											console.log('CANCEL', arguments);
											try{
												// [いいえ]旧情報を再表示
												var base = clutil.view2data($("#ca_baseField"));
												var other = clutil.view2data($("#ca_otherField"));

												// 旧生地番号再設定
												base.M_cloth = clothOld;
												base.M_wash = 0;

												cloth.M_cloth = clothOld;
												cloth.M_wash = 0;
												clutil.data2view($("#ca_M_clothArea"), cloth);

												var clothSel2 = _this.makeClothSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS, $("#ca_M_cloth"), base, other);
												var brandSel = _this.makeBrandSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS, $("#ca_M_brand"), base, other);

												$.when(clothSel2).done(function(){
													// 旧生地セレクター設定
													clutil.data2view($("#ca_M_clothArea"), cloth);
													$.when(brandSel).done(function(){
														// 旧ブランドセレクター作成
														clutil.data2view($("#ca_M_brandArea"), brand);
														clutil.viewRemoveReadonly($(".ca_M_clothEffectDiv"));
														_this.M_setClothOld_Price();
													});
												});
												return;
											}finally{
											}
										}, _this);
							}
						}
					});
				}
			});
			//メンズスーツ;
			this.$el.delegate(':checkbox[id=ca_M_st]', 'toggle', function (ev) {
				if ($(this).prop('checked')) {
					// 表示設定
					$('#ca_M_jkDiv').show();
					$('#ca_M_slDiv').show();
					$('#ca_M_sl_changeButtonTypeDiv').hide();
					// 範囲設定
					clutil.viewReadonly(_this.$('#ca_M_jkArea'));
					clutil.viewReadonly(_this.$('#ca_M_slArea'));
					// 必須設定
					$('.cl_M_jk_required').addClass("cl_required");
					$('.cl_M_sl_required').addClass("cl_required");
					// オプション再指定
					var comData =  clutil.view2data($('#ca_brandArea'));
					var order =  clutil.view2data($('#ca_M_Field'));
					var baseData =  clutil.view2data($('#ca_baseField'));
					var otherData =  clutil.view2data($('#ca_otherField'));
					if(comData.M_brand > 0){
						clutil.viewRemoveReadonly(_this.$('#ca_M_jk_styleArea'));
						_this.setSelList($('#ca_M_jk_style'), _this.styleStList);
						_this.setSelList($('#ca_M_sl_style'), _this.styleSlList);
						var func = _this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS
								, TYPE.ST, null, baseData, otherData);
						$.when(func).done(function(){
							_this.M_lockUnselectJkStyle();
							_this.M_lockUnselectSlStyle();

							//情報再取得
							order =  clutil.view2data($('#ca_M_Field'));
							_this._onM_jk_ChangeNameSel(true, order.M_jk_name);
							_this._onM_jk_ChangeButtonTypeToggle(null, true, order.M_jk_changeButtonType);
							_this._onM_jk_ChangeLiningTypeToggle(null, true, order.M_jk_changeLiningType);

							var obj = {
									M_sl_spareType:order.M_sl_spareType,
									M_sl_bottomType:order.M_sl_bottomType,
									M_sl_bottomSpareType:order.M_sl_bottomSpareType
							};
							_this._onM_sl_SpareTypeToggle(null, true, obj);
							_this._onM_sl_BottomTypeToggle(null, true, obj);
							_this._onM_sl_BottomSpareTypeToggle(null, true, obj);
						});
					}
				} else {
					$('#ca_M_jkDiv').hide();
					$('#ca_M_slDiv').hide();
					// 範囲設定
					clutil.viewRemoveReadonly(_this.$('#ca_M_jkArea'));
					clutil.viewRemoveReadonly(_this.$('#ca_M_slArea'));
					// 必須設定
					$('.cl_M_jk_required').removeClass("cl_required");
					$('.cl_M_sl_required').removeClass("cl_required");
					$('.cl_M_jkOptrequired').removeClass("cl_required");
					$('.cl_M_slOptrequired').removeClass("cl_required");
				}
			});
			// メンズジャケット、スラックス
			this.$el.delegate(':checkbox[id=ca_M_jk]', 'toggle', function (ev) {
				if ($(this).prop('checked')) {
					// 表示設定
					$('#ca_M_jkDiv').show();
					//範囲設定
					clutil.viewReadonly(_this.$('#ca_M_stArea'));
					clutil.viewReadonly(_this.$('#ca_M_slArea'));
					$('.cl_M_jk_required').addClass("cl_required");
					// オプション再指定
					var comData =  clutil.view2data($('#ca_brandArea'));
					var order =  clutil.view2data($('#ca_M_Field'));
					var baseData =  clutil.view2data($('#ca_baseField'));
					var otherData =  clutil.view2data($('#ca_otherField'));
					if(comData.M_brand > 0){
						clutil.viewRemoveReadonly(_this.$('#ca_M_jk_styleArea'));
						_this.setSelList($('#ca_M_jk_style'), _this.styleJkList);
						var func = _this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS
								, TYPE.JK, null, baseData, otherData);
						$.when(func).done(function(){
							_this.M_lockUnselectJkStyle();
							_this._onM_jk_ChangeNameSel(true, order.M_jk_name);
							_this._onM_jk_ChangeButtonTypeToggle(null, true, order.M_jk_changeButtonType);
							_this._onM_jk_ChangeLiningTypeToggle(null, true, order.M_jk_changeLiningType);
						});
					}
				}
				else {
					$('#ca_M_jkDiv').hide();
					$('.cl_M_jk_required').removeClass("cl_required");
					$('.cl_M_jkOptrequired').removeClass("cl_required");
					clutil.viewRemoveReadonly(_this.$('#ca_M_stArea'));
					clutil.viewRemoveReadonly(_this.$('#ca_M_slArea'));
				}
			});
			this.$el.delegate(':checkbox[id=ca_M_sl]', 'toggle', function (ev) {
				if ($(this).prop('checked')) {
					// 表示設定
					$('#ca_M_slDiv').show();
					$('#ca_M_sl_changeButtonTypeDiv').show();
					//範囲設定
					clutil.viewReadonly(_this.$('#ca_M_stArea'));
					clutil.viewReadonly(_this.$('#ca_M_jkArea'));
					$('.cl_M_sl_required').addClass("cl_required");
					// オプション再指定
					var comData =  clutil.view2data($('#ca_brandArea'));
					var order =  clutil.view2data($('#ca_M_Field'));
					var baseData =  clutil.view2data($('#ca_baseField'));
					var otherData =  clutil.view2data($('#ca_otherField'));
					if(comData.M_brand > 0){
						_this.setSelList($('#ca_M_sl_style'), _this.styleSlList);
						var func = _this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS
								, TYPE.SL, null, baseData, otherData);
						$.when(func).done(function(){
							_this.M_lockUnselectSlStyle();
							//情報再取得
							order =  clutil.view2data($('#ca_M_Field'));
							var obj = {
									M_sl_spareType:order.M_sl_spareType,
									M_sl_bottomType:order.M_sl_bottomType,
									M_sl_bottomSpareType:order.M_sl_bottomSpareType
							};
							_this._onM_sl_ChangeButtonTypeToggle(null, true, order.M_sl_changeButtonType);
							_this._onM_sl_SpareTypeToggle(null, true, obj);
							_this._onM_sl_BottomTypeToggle(null, true, obj);
							_this._onM_sl_BottomSpareTypeToggle(null, true, obj);
						});
					}
				}
				else {
					$('#ca_M_slDiv').hide();
					$('.cl_M_sl_required').removeClass("cl_required");
					$('.cl_M_slOptrequired').removeClass("cl_required");
					clutil.viewRemoveReadonly(_this.$('#ca_M_stArea'));
					clutil.viewRemoveReadonly(_this.$('#ca_M_jkArea'));
				}
			});
			// メンズベスト
			this.$el.delegate(':checkbox[id=ca_M_ve]', 'toggle', function (ev) {
				if ($(this).prop('checked')) {
					// 表示設定
					$('#ca_M_veDiv').show();
					$('.cl_M_ve_required').addClass("cl_required");
					// オプション再指定
					var comData =  clutil.view2data($('#ca_brandArea'));
					var order =  clutil.view2data($('#ca_M_Field'));
					var baseData =  clutil.view2data($('#ca_baseField'));
					var otherData =  clutil.view2data($('#ca_otherField'));
					if(comData.M_brand > 0){
						_this.setSelList($('#ca_M_ve_style'), _this.styleVeList);
						var func = _this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS
								, TYPE.VE, null, baseData, otherData);
						$.when(func).done(function(){
							_this.M_lockUnselectVeStyle();
							_this._onM_ve_ChangeButtonTypeToggle(null, true, order.M_ve_changeButtonType);
							_this._onM_ve_ChangeLiningTypeToggle(null, true, order.M_ve_changeLiningType);
						});
					}
				} else {
					$('#ca_M_veDiv').hide();
					$('.cl_M_ve_required').removeClass("cl_required");
					$('.cl_M_veOptrequired').removeClass("cl_required");
				}
			});
			// メンズジャケット ボタンホールカラー糸
			this.$el.delegate(':checkbox[id=ca_M_jk_cuffsFirst]', 'toggle', function (ev) {
				if ($(this).prop('checked')) {
					//チェックされたら色セレクター表示
					$('#ca_M_jk_buttonThreadColorDiv').show();
					$('#ca_M_jk_buttonThreadColorSel').addClass("cl_required");
				} else if(!$(this).prop('checked') && !$('#ca_M_jk_flowerHole').prop('checked')){
					//チェックされなかったらセレクター非表示
					$('#ca_M_jk_buttonThreadColorDiv').hide();
					$('#ca_M_jk_buttonThreadColorSel').removeClass("cl_required");
				}
			});
			this.$el.delegate(':checkbox[id=ca_M_jk_flowerHole]', 'toggle', function (ev) {
				if ($(this).prop('checked')) {
					//チェックされたら色セレクター表示
					$('#ca_M_jk_buttonThreadColorDiv').show();
					$('#ca_M_jk_buttonThreadColorSel').addClass("cl_required");
				} else if(!$(this).prop('checked') && !$('#ca_M_jk_cuffsFirst').prop('checked')){
					//チェックされなかったらセレクター非表示
					$('#ca_M_jk_buttonThreadColorDiv').hide();
					$('#ca_M_jk_buttonThreadColorSel').removeClass("cl_required");
				}
			});

			//レディスジャケット;
			this.$el.delegate(':checkbox[id=ca_L_jk]', 'toggle', function (ev) {
				_this.L_lockUnselectJkStyle();
				clutil.data2view($("#ca_L_jk_styleArea"), L_jkStyleClearObj);
				clutil.viewReadonly(_this.$('#ca_L_jk_styleArea'));
				if ($(this).prop('checked')) {
					//チェックされたら範囲設定可能
					clutil.viewRemoveReadonly(_this.$('#ca_L_jkSelArea'));
					$('#ca_L_jkDiv').show();
					$('.cl_L_jk_required').addClass("cl_required");
					var baseData =  clutil.view2data($('#ca_baseField'));
					var otherData =  clutil.view2data($('#ca_otherField'));
					_this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_LADYS
							, TYPE.L_JK, baseData.L_jk_style, baseData, otherData);
					// スラックスのボタン変更領域隠し
					_this.chkL_sl_ChangeButtonTypeSet(true, 1);
				} else {
					//チェックされなかったら範囲設定不可
					clutil.viewReadonly(_this.$('#ca_L_jkSelArea'));
					$('#ca_L_jkDiv').hide();
					$('.cl_L_jk_required').removeClass("cl_required");
					$('.cl_L_jkOptrequired').removeClass("cl_required");
					clutil.data2view($('#ca_L_jkSelArea'), L_jkModelClearObj);
					// スラックスのボタン変更領域表示
					_this.chkL_sl_ChangeButtonTypeSet(true, 0);
				}
			});
			//レディススカート;
			this.$el.delegate(':checkbox[id=ca_L_sk]', 'toggle', function (ev) {
				_this.L_lockUnselectSkStyle();
				clutil.data2view($("#ca_L_sk_styleArea"), L_skStyleClearObj);
				clutil.viewReadonly(_this.$('#ca_L_sk_styleArea'));
				if ($(this).prop('checked')) {
					//チェックされたら範囲設定可能
					clutil.viewRemoveReadonly(_this.$('#ca_L_skSelArea'));
					$('#ca_L_skDiv').show();
					$('.cl_L_sk_required').addClass("cl_required");
					var baseData =  clutil.view2data($('#ca_baseField'));
					var otherData =  clutil.view2data($('#ca_otherField'));
					_this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_LADYS
							, TYPE.L_SK, baseData.L_sk_style, baseData, otherData);
				} else {
					//チェックされなかったら範囲設定不可
					clutil.viewReadonly(_this.$('#ca_L_skSelArea'));
					$('#ca_L_skDiv').hide();
					$('.cl_L_sk_required').removeClass("cl_required");
					clutil.data2view($('#ca_L_skSelArea'), L_skModelClearObj);
				}
			});
			//レディスパンツ;
			this.$el.delegate(':checkbox[id=ca_L_sl]', 'toggle', function (ev) {
				_this.L_lockUnselectSlStyle();
				clutil.data2view($("#ca_L_sl_styleArea"), L_slStyleClearObj);
				clutil.viewReadonly(_this.$('#ca_L_sl_styleArea'));
				// スラックスのボタン変更領域隠し判定
				_this.chkL_sl_ChangeButtonTypeSet(false, 0);
				if ($(this).prop('checked')) {
					//チェックされたら範囲設定可能
					clutil.viewRemoveReadonly(_this.$('#ca_L_slSelArea'));
					$('#ca_L_slDiv').show();
					$('.cl_L_sl_required').addClass("cl_required");
					var baseData =  clutil.view2data($('#ca_baseField'));
					var otherData =  clutil.view2data($('#ca_otherField'));
					_this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_LADYS
							, TYPE.L_SL, baseData.L_sl_style, baseData, otherData);
				} else {
					//チェックされなかったら範囲設定不可
					clutil.viewReadonly(_this.$('#ca_L_slSelArea'));
					$('#ca_L_slDiv').hide();
					$('.cl_L_sl_required').removeClass("cl_required");
					$('.cl_L_slOptrequired').removeClass("cl_required");
					clutil.data2view($('#ca_L_slSelArea'), L_slModelClearObj);
				}
			});
			//レディスベスト;
			this.$el.delegate(':checkbox[id=ca_L_ve]', 'toggle', function (ev) {
				_this.L_lockUnselectVeStyle();
				clutil.data2view($("#ca_L_ve_styleArea"), L_veStyleClearObj);
				clutil.viewReadonly(_this.$('#ca_L_ve_styleArea'));
				if ($(this).prop('checked')) {
					//チェックされたら範囲設定可能
					clutil.viewRemoveReadonly(_this.$('#ca_L_veSelArea'));
					$('#ca_L_veDiv').show();
					$('.cl_L_ve_required').addClass("cl_required");
					var baseData =  clutil.view2data($('#ca_baseField'));
					var otherData =  clutil.view2data($('#ca_otherField'));
					_this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_LADYS
							, TYPE.L_VE, baseData.L_ve_style, baseData, otherData);
				} else {
					//チェックされなかったら範囲設定不可
					clutil.viewReadonly(_this.$('#ca_L_veSelArea'));
					$('#ca_L_veDiv').hide();
					$('.cl_L_ve_required').removeClass("cl_required");
					$('.cl_L_veOptrequired').removeClass("cl_required");
					clutil.data2view($('#ca_L_veSelArea'), L_veModelClearObj);
				}
			});

			// シャツマイター
			this.$el.delegate(':checkbox[id=ca_S_miter]', 'toggle', function (ev) {
				var order =  clutil.view2data($('#ca_S_Field'));
				var amfFlag = _this.chkS_AmfLoadFlag(order);
				_this.chkS_Amf(amfFlag);
			});
			// シャツ短納期
			this.$el.delegate(':checkbox[id=ca_express]', 'toggle', function (ev) {
				var saveDate = $("#ca_arrivalDateSave").val();
				if ($(this).prop('checked')) {
					// 短納期
					$("#ca_arrivalDate").datepicker('setIymd', clutil.addDate(saveDate, -2));
					$("#ca_saleDate").datepicker('setIymd', clutil.addDate(saveDate, -1));
				} else {
					$("#ca_arrivalDate").datepicker('setIymd', saveDate);
					$("#ca_saleDate").datepicker('setIymd', clutil.addDate(saveDate, 1));
				}
			});
		},

		initUIElement_AMPAV0010 : function(){
			// 店舗部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el				: this.$("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView		: this.$("#mainColumn"),
				select_mode		: clutil.cl_single_select,		// 単一選択
				isAnalyse_mode	: false	// 通常画面モード
			});

			var util_store_clear = _.bind(function(){
				this.utl_store.resetValue();
			},this);

			this.AMPAV0010Selector.render();
			util_store_clear();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = _.bind(function(data) {
				var autocomplete = this.utl_store;
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					var parentList = data[0].parentList;
					autocomplete.setValue({id: id, code: code, name: name, parentList: parentList});
					this.validator.clearErrorMsg(this.$('#ca_storeID'));
				} else {
					var item = autocomplete.getValue();
					if (item.id == 0) {
						util_store_clear();
					}
				}
				// カレントではまだサブ画面が表示されている。
				// _.defer(func) で、元画面復帰タイミング合わせすして、
				// ボタンにフォーカスする
				_.defer(function(myView){
					var d = myView._onChangeStore();
					d.done(function(){
						clutil.setFocus(myView.$('#ca_btn_store_select'));
					});
				}, this);
			},this);
		},



		render: function(){
			var _this = this;
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				//編集可能時間のチェック
				var srchReq = {
						reqHead: {
							opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						},
						AMPOV0270GetReq :{
							reqType: OPETYPE.AMPOV0270_REQTYPE_TIME,
							poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS
						}
				};
				clutil.postJSON('AMPOV0270', srchReq).fail(_.bind(function(data){
					// エラーメッセージを通知。
					clutil.mediator.trigger('onTicker', data);
					_this.setReadOnlyAllItems(true);
					_this._hideFooter();
					return ;
				}, this));
				this.resetFocus();
			} else {
				this.mdBaseView.fetch();	// 新規だろうとなんだろうとデータを GET してくる。
			}
			return this;
		},
		resetFocus:function(){
			var storeID = clcom.userInfo.org_id;
			var storeCode = clcom.userInfo.org_code;
			var storeName = clcom.userInfo.org_name;
			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				this.utl_store.setValue({id: storeID, code: storeCode, name: storeName});
				clutil.viewReadonly($("#ca_storeID_div"));
				this.$("#ca_btn_store_select").attr("disabled", true);
				this.$("#ca_btn_store_select").hide();
				clutil.setFocus($('#ca_userID'));
			}else{
				clutil.setFocus($('#ca_storeID'));
			}
		},


		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){
			this.AMPAV0010Selector.show(null, null, {
				org_id: Number(clcom.getSysparam('PAR_AMMS_UNITID_AOKI'),5),			// AOKI固定
				func_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'),1)
			});
		},


		/**
		 * 送信区分ラジオボタン変更
		 * 背景色が変化(新規：黄 FAX:青)
		 */
		_onSubmitTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
				this.submitOnFlag = true;
			}
			else{
				val = $("input:radio[name=ca_submitType]:checked").val();
				old = $("#ca_submitTypeOld").val();

				if(this.submitOnFlag == true && val != old){
					// 既に選択されている&既存値と異なる場合は全表示リセット
					this._onChangeStore();
				}
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_submitType]:checked").val();
				this.submitOnFlag = true;
			}
			// 区分記録
			$("#ca_submitTypeOld").val(val);

			// 過去日領域をリセット
			$("#ca_InsOldDateInputArea").hide();
			$("#ca_InsOldDateInputArea").removeClass("cl_required");
			clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', clcom.getOpeDate());

			if(val == 1){
				$("#ca_submitTypeArea").addClass("past");
				$("#ca_submitTypeArea").removeClass("new");
				if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
						|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
					$("#ca_InsOldDateInputArea").show();
					$("#ca_InsOldDateInputArea").addClass("cl_required");

					// 2016/1/6 MT-1050
					var orderDate = clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd');
					if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
							|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
						// 店舗・店長ユーザ：過去日のみのデートピッカー
						clutil.datepicker(this.$("#ca_InsOldDateInput"), {
							min_date: clcom.min_date,
							max_date: clcom.getOpeDate()
						}).datepicker('setIymd', orderDate);
					}
					else{
						// その他ユーザ：普通のデートピッカー
						clutil.datepicker(this.$("#ca_InsOldDateInput")).datepicker('setIymd', orderDate);
					}
					// 2016/1/6 MT-1050 ここまで
				}
			}
			else{
				$("#ca_submitTypeArea").removeClass("past");
				$("#ca_submitTypeArea").addClass("new");
			}
		},

		/**
		 * 種別ラジオ変更
		 */
		_onOrderTypeToggle: function(e){
			// 配下項目クリア
			clutil.data2view($("#ca_typeClearArea"), typeClearObj);
			// リードオンリー設定クリア(メンズの「スーツ」「ジャケット」の状態が引き継がれてしまうためリセット)
			clutil.viewReadonly($("#ca_brandDiv"));
			clutil.viewRemoveReadonly($(".ca_storeEffectDiv"));

			/** リリース用ロック **/
			this.setReleaseLock();
			/****/

			// 各オーダー項目リセット
			this.M_lockUnselectSeason();
			this.L_lockUnselectBrand();
			this.S_lockUnselectBrand();

			//表示再設定
			var type = $("input:radio[name=ca_orderType]:checked").val();
			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				this.showMens();
				// シーズンセレクター作成
				this.makeSeasonSel(false, type, $("#ca_M_season"));
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				this.showLedies();
				// ブランドセレクター作成
				var sel1 = this.makeBrandSel(false, type, $("#ca_L_brand"), null, null);
				// モデルセレクター作成
				var sel2 = this.makeModelSel(false, null);
				// 生地セレクター作成
				//var sel3 = this.makeClothSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_cloth"), null, null);
				var _this = this;

				$.when(sel1, sel2).done(function() {
					// モデルセレクター再設定 T74対応 2015/9/3
					_this._onL_ModelTypeToggle(null, true, 1);
					// 生地セレクター作成(ここでやらないとモデルリスト指定ができないため)
					_this.makeClothSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_cloth"), null, null);
				});
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				this.showShirt();
				// ブランドセレクター作成
				this.makeBrandSel(false, type, $("#ca_S_brand"), null, null);
			}
			// 各白箱エリアの表示設定
			this.setDivs(false, null, null);
		},






		/**
		 * 店舗着日計算
		 */
		getArrivalDate:function(loadFlag, type, loadComObj, loadSummer){
			if(loadFlag == true
					&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				// ロードで新規・コピー以外は日付をそのままに
				return;
			}
			var _this = this;
			var comData = {};
			var dateData = {};
			var storeID = 0;
			var brandID = 0;
			var clothID = 0;
			var orderDate = 0;
			var wash = 0;
			var summer = 0;
			if(loadFlag == false){
				if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null
						|| this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
					return null;
				}
				comData =  clutil.view2data($('#ca_baseField'));
				dateData = clutil.view2data($('#ca_dateArea'));
				orderDate = dateData.orderDate;
				if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
					summer = $("input:radio[name=ca_M_jk_summerType]:checked").val();
				}
			}
			else{
				comData =  loadComObj;
				orderDate = clcom.getOpeDate();
				summer = loadSummer;
			}

			storeID = comData.storeID;
			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				brandID = comData.M_brand;
				clothID = comData.M_cloth;
				wash = comData.M_wash;
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				brandID = comData.L_brand;
				clothID = comData.L_cloth;
			}
			else{
				brandID = comData.S_brand;
				clothID = comData.S_cloth;
			}

			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0270GetReq:{
						reqType :OPETYPE.AMPOV0270_REQTYPE_DATE,
						poTypeID: type,
						storeID: storeID,
						orderDate: orderDate,
						clothIDID: clothID,
						brandID: brandID,
						washableFlag: wash,
						summerTypeFlag: summer,
						// 以下は使用しないリクエスト
						seasonTypeID: 0,
						srchID: 0,
						styleOptTypeIDList: []
					}
			};
			var promise = clutil.postJSON('AMPOV0270', srchReq).done(_.bind(function(data){
				var recs = data.AMPOV0270GetRsp.arrivalDateList;
				if(_.isEmpty(recs)){
					_this.setArrivalDate(-1, loadFlag);
				}else{
					var date = recs[0].arrivalDate;
					_this.setArrivalDate(date, loadFlag);
				}
			}, this)).fail(_.bind(function(data){

			}, this));

			return promise;
		},




		/**
		 * メンズサイズセレクター作成
		 */
		make_M_Size1:function(loadFlag, style, type, $sizeSel1, base, size1, $sizeSel2){
			var _this = this;
			var comDate = {};
			if(loadFlag == true){
				comDate = base;
			}
			else{
				if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null
						|| this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
					return null;
				}
				comDate =  clutil.view2data($('#ca_brandArea'));
			}

			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					cond :{
						srchFromDate: 0,
						srchToDate: 0,
						poBrandID: comDate.M_brand,
						poBrandStyleID: style,
						codename: "",
						ladysStyleOptClassTypeID: 0,
						delFlag: 0
					}
			};

			var promise = clutil.postJSON('am_pa_posize_srch', srchReq).done(_.bind(function(data){
				var recs2 = data.list2;
				var list = [];

				if(_.isEmpty(recs2)){
					_this.setSelListNameDisp($sizeSel1, list);
				}else{
					$.each(recs2, function() {
						var cn = {
								id: this.sizerow.id,
								code: this.sizerow.code,
								name: this.sizerow.name
						};
						list.push(cn);
					});
					// 内容物がある場合 --> ブランド選択にセットする。
					_this.setSelListNameDisp($sizeSel1, list);
				}
				this.sizeList1[type] = list;
				this.sizeListCom[type] = recs2;

				if(loadFlag == true){
					_this.make_M_Size2(true, size1, type, $sizeSel2, recs2);
				}
			}, this)).fail(_.bind(function(data){

			}, this));

			return promise;
		},
		make_M_Size2:function(loadFlag, size1, type, $sizeSel2, loadList){
			var _this = this;
			var listCom = [];
			if(loadFlag == true){
				listCom = loadList;
			}
			else{
				listCom = this.sizeListCom[type];
			}

			var list = [];
			var tmp = [];
			for(var i=0; i<listCom.length; i++){
				if(listCom[i].sizerow.id == size1){
					tmp = listCom[i].list;
					$.each(tmp, function() {
						var cn = {
								id: this.size.id,
								code: this.size.code,
								name: this.size.name
						};
						list.push(cn);
					});
					_this.setSelListNameDisp($sizeSel2, list);
				}
			}
			this.sizeList2[type] = list;
		},

		/**
		 * レディス・シャツサイズセレクター作成
		 */
		make_L_S_Size:function(loadFlag, style, type, chk, $sizeSel, base){
			var _this = this;
			var comDate = {};
			var brandID = 0;
			var ladysStyleOptClassTypeID = 0;

			if(loadFlag == true){
				comDate = base;
			}
			else{
				if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null
						|| this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
					return null;
				}
				comDate =  clutil.view2data($('#ca_brandArea'));
			}

			if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				brandID = comDate.L_brand;
				ladysStyleOptClassTypeID = chk;
			}
			else{
				brandID = comDate.S_brand;
			}

			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					cond :{
						srchFromDate: 0,
						srchToDate: 0,
						poBrandID: brandID,
						poBrandStyleID: style,
						codename: "",
						ladysStyleOptClassTypeID: ladysStyleOptClassTypeID,
						delFlag: 0
					}
			};

			var promise = clutil.postJSON('am_pa_posize_srch', srchReq).done(_.bind(function(data){
				var recs = data.list;
				var list = [];

				if(_.isEmpty(recs)){
					_this.setSelListNameDisp($sizeSel, list);
				}else{
					$.each(recs, function() {
						var cn = {
								id: this.size.id,
								code: this.size.code,
								name: this.size.name,

								btmAdjLenMin:this.btmAdjLenMin,
								btmAjLenMax:this.btmAjLenMax,
								column:this.column,
								jkAdjLenMax:this.jkAdjLenMax,
								jkAdjLenMin:this.jkAdjLenMin,
								pantsWaistAdjLenMin:this.pantsWaistAdjLenMin,
								pantsWaistAjLenMax:this.pantsWaistAjLenMax,
								poSizeTypeID:this.poSizeTypeID,
								row:this.row,
								skirtAdjLenMin:this.skirtAdjLenMin,
								skirtAjLenMax:this.skirtAjLenMax,
								skirtWaistAdjLenMin:this.skirtWaistAdjLenMin,
								skirtWaistAjLenMax:this.skirtWaistAjLenMax,
								slvAdjLenMax:this.slvAdjLenMax,
								slvAdjLenMin:this.slvAdjLenMin,
								vestAdjLenMax:this.vestAdjLenMax,
								vestAdjLenMin:this.vestAdjLenMin
						};
						list.push(cn);
					});
					// 内容物がある場合 --> サイズ選択にセットする。
					_this.setSelListNameDisp($sizeSel, list);
				}
				this.sizeList1[chk] = list;
			}, this)).fail(_.bind(function(data){

			}, this));

			return promise;
		},


		/**
		 * ブランドセレクター作成
		 */
		makeBrandSel:function(loadFlag, type, $el, baseObj, otherObj){
			var _this = this;
			var comData =  {};
			var dateData =  {};
			var storeID = 0;
			var orderDate = 0;
			var clothID = 0;

			if(loadFlag == false){
				if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null
						|| this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
					return null;
				}
				comData =  clutil.view2data($('#ca_brandArea'));
				dateData =  clutil.view2data($('#ca_dateArea'));
				storeID = $("#ca_storeID").autocomplete('clAutocompleteItem').id;
				orderDate = dateData.orderDate;
			}
			else{
				comData =  baseObj;
				dateData =  otherObj;
				storeID = comData.storeID;
				orderDate = dateData.orderDate;
			}

			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				clothID = comData.M_cloth;
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				//modelIDList = [];
			}
			else{

			}


			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0270GetReq:{
						reqType :OPETYPE.AMPOV0270_REQTYPE_BRAND,
						poTypeID: type,
						storeID: storeID,
						orderDate: orderDate,
						clothIDID: clothID,
						// 以下は使用しないリクエスト
						modelIDList: [],
						brandID: 0,
						seasonTypeID: 0,
						washableFlag: 0,
						srchID: 0,
						styleOptTypeIDList: []
					}
			};
			var promise = clutil.postJSON('AMPOV0270', srchReq).done(_.bind(function(data){
				var recs = data.AMPOV0270GetRsp.brandList;
				var list = [];
				if(_.isEmpty(recs)){
					_this.setSelList($el, list);
				}else{
					$.each(recs, function() {
						var cn = {
								id: this.id,
								code: this.code,
								name: this.name,
								amfFlag: this.amfFlag,
								buttonFlag: this.buttonFlag,
								liningFlag: this.liningFlag,
								pocketFlag: this.pocketFlag,
								trunkFlag: this.trunkFlag,
								vestTrunkFlag: this.vestTrunkFlag
						};
						list.push(cn);
					});
					// 内容物がある場合 --> ブランド選択にセットする。
					_this.setSelList($el, list);
				}
				this.brandList = list;

			}, this)).fail(_.bind(function(data){

			}, this));
			return promise;
		},

		/**
		 * シーズンセレクター作成
		 */
		makeSeasonSel:function(loadFlag, type, $el){
			var _this = this;
			if(loadFlag == false){
				if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null
						|| this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
					return null;
				}
			}

			var srchReq = {
					// 20150808 藤岡 cond:シーズンはHist型でないので意味のないリクエスト
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					cond :{
						srchFromDate: 0,
						srchToDate: 0,
					}
			};
			var promise = clutil.postJSON('am_pa_poseason_srch', srchReq).done(_.bind(function(data){
				var recs = data.list;
				var list = [];
				if(_.isEmpty(recs)){
					_this.setSelList($el, list);
				}else{
					$.each(recs, function() {
						var cn = {
								id: this.id,
								code: this.code,
								name: this.name
						};
						list.push(cn);
					});
					// 内容物がある場合 --> シーズン選択にセットする。
					_this.setSelList($el, list);
				}
				this.seasonList = list;

			}, this)).fail(_.bind(function(data){

			}, this));
			return promise;
		},




		/**
		 * 生地セレクター作成
		 */
		makeClothSel:function(loadFlag, type, $el, baseObj, otherObj){
			var comData =  {};
			var dateData =  {};
			var storeID = 0;
			var orderDate = 0;
			var brandID = 0;
			var seasonID = 0;
			var wash = 0;
			var model = 0;
			var modelIDList = [];

			if(loadFlag == false){
				if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null
						|| this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
					return null;
				}
				comData =  clutil.view2data($('#ca_brandArea'));
				dateData =  clutil.view2data($('#ca_dateArea'));
				storeID = $("#ca_storeID").autocomplete('clAutocompleteItem').id;
				orderDate = dateData.orderDate;
				model = $("input:radio[name=ca_L_modelType]:checked").val();
				brandID = 0;
				seasonID = 0;
				wash = 0;
			}
			else{
				comData =  baseObj;
				dateData =  otherObj;
				storeID = comData.storeID;
				orderDate = dateData.orderDate;
				brandID = 0;
				seasonID = 0;
				if (type == amcm_type.AMCM_VAL_PO_CLASS_LADYS) {
					model = comData.L_modelType;
				}
				wash = 0;
			}

			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				seasonID = comData.M_season;
				wash = comData.M_wash;
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				if(model == 2){
					// プレシャス
					modelIDList = this.modelPREIDList;
				}
				else{
					// ベーシック・スタイリッシュ
					modelIDList = this.modelBASIDList;
				}
			}
			else{
				brandID = comData.S_brand;
			}


			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0270GetReq:{
						reqType :OPETYPE.AMPOV0270_REQTYPE_CLOTH,
						poTypeID: type,
						storeID: storeID,
						brandID: brandID,
						orderDate: orderDate,
						seasonTypeID: seasonID,
						washableFlag: wash,
						modelIDList: modelIDList,
						// 以下は使用しないリクエスト
						clothIDID: 0,
						srchID: 0,
						styleOptTypeIDList: []
					}
			};
			var promise = clutil.postJSON('AMPOV0270', srchReq).done(_.bind(function(data){
				var recs = data.AMPOV0270GetRsp.clothIDList;
				var list = [];
				if(_.isEmpty(recs)){
					var opt = {
							$select	:$el,
							list:list,
							unselectedflag:true,
							selectpicker: {
								noButton: true
							}
					};
					clutil.cltypeselector3(opt);
				}else{
					$.each(recs, function() {
						var cn = {
								id: this.id,
								code: this.code,
								name: this.name,
								parentBrandID: this.parentBrandID,
								priceLine: this.priceLine
						};
						list.push(cn);
					});
					// 内容物がある場合 --> 生地選択にセットする。
					var opt = {
							$select	:$el,
							list:list,
							unselectedflag:true,
							selectpicker: {
								noButton: true
							}
					};
					clutil.cltypeselector3(opt);
				}
				this.clothList = list;

			}, this)).fail(_.bind(function(data){

			}, this));
			return promise;
		},


		/**
		 * モデルセレクター作成
		 */
		makeModelSel:function(loadFlag, loadVal){
			var _this = this;
			var date = 0;
			if(loadFlag == true){
				date = loadVal.orderDate;
			}
			else{
				date = clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd');
			}

			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					cond :{
						unitID: 5,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
						srchFromDate:date
					}
			};
			var promise = clutil.postJSON('am_pa_pomodel_srch', srchReq).done(_.bind(function(data){
				var recs = data.list;
				var list = [];
				var listVe = [];
				var listPRE = [];
				var listBAS = [];

				var listPREID = [];
				var listBASID = [];

				if(_.isEmpty(recs)){

				}else{
					// 内容物がある場合 --> セレクターにセットする。
					$.each(recs, function() {
						var cn = {
								id: this.model.id,
								code: this.model.code,
								name: this.model.name
						};
						list.push(cn);

						if(cn.code != "PRE" && cn.code != "STB"
							&& cn.code != "STY" && cn.code != "PRB"
								&& cn.code != "ELG"){
							listVe.push(cn);
						}

						if(cn.code == "PRE" || cn.code == "STB" || cn.code == "PRB" || cn.code == "ELG"){
							listPRE.push(cn);
							listPREID.push(cn.id);
						}
						else{
							listBAS.push(cn);
							listBASID.push(cn.id);
						}
					});
				}
				// セレクター用リスト
				_this.setSelList($('#ca_L_jkSel'), list);
				_this.setSelList($('#ca_L_skSel'), list);
				_this.setSelList($('#ca_L_slSel'), list);
				_this.setSelList($('#ca_L_veSel'), listVe);
				_this.modelPREList = listPRE;
				_this.modelBASList = listBAS;

				// 生地検索用のIDリスト
				_this.modelPREIDList = listPREID;
				_this.modelBASIDList = listBASID;

				_this.modelList = list;
			}, this)).fail(_.bind(function(data){

			}, this));
			return promise;
		},


		/**
		 * スタイルセレクター作成
		 */
		makeStyleSel:function(loadFlag, type, baseObj, otherObj, $el, chk, model){
			var _this = this;
			var comData =  {};
			var dateData =  {};
			var poBrandID = 0;
			var poParentBrandID = 0;
			var poModelID = 0;
			var poClothIDID = 0;
			var poClothCodeID = 0;
			var poTypeID = 0;
			var styleoptTypeID = 0;
			var codename = "";
			var washableFlag = 0;


			if(loadFlag == false){
				if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null
						|| this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
					return null;
				}
				comData =  clutil.view2data($('#ca_brandArea'));
				dateData =  clutil.view2data($('#ca_dateArea'));
			}
			else{
				comData =  baseObj;
				dateData =  otherObj;
			}


			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				poBrandID = comData.M_brand;
				poClothCodeID = comData.M_cloth;
				poTypeID = type;
				washableFlag = comData.M_wash;
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				poParentBrandID = comData.L_brand;
				poClothCodeID = comData.L_cloth;
				poTypeID = type;
				poModelID = model;
			}
			else{

			}


			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					cond :{
						srchFromDate: dateData.orderDate,
						srchToDate: dateData.orderDate,
						poBrandID: poBrandID,
						poParentBrandID: poParentBrandID,
						poModelID: poModelID,
						poClothIDID: poClothIDID,
						poClothCodeID: poClothCodeID,
						poTypeID: poTypeID,
						styleoptTypeID: styleoptTypeID,
						codename: codename,
						washableFlag: washableFlag
					}
			};
			var promise = clutil.postJSON('am_pa_pobrandstyle_srch', srchReq).done(_.bind(function(data){
				var recs = data.list;
				var list = [];
				var stList = [];
				var jkList = [];
				var slList = [];
				var veList = [];
				if(_.isEmpty(recs)){
					if(type == 1){
						_this.setSelList($('#ca_M_jk_style'), jkList);
						_this.setSelList($('#ca_M_sl_style'), slList);
						_this.setSelList($('#ca_M_ve_style'), veList);
					}
					else{
						_this.setSelList($el, list);
					}
				}else{
					if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
						// 内容物がある場合 --> セレクターにセットする。
						$.each(recs, function() {
							var cn = {
									id: this.brandstyle.id,
									code: this.brandstyle.code,
									name: this.brandstyle.name,
									price:this.price,
									mStyleoptTypeID:this.mStyleoptTypeID,
									lStyleoptTypeID:this.lStyleoptTypeID
							};
							list.push(cn);
							switch (this.mStyleoptTypeID) {
							case amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT:
								stList.push(cn);
								break;
							case amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET:
								jkList.push(cn);
								break;
							case amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS:
								slList.push(cn);
								break;
							case amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST:
								veList.push(cn);
								break;
							default:
								break;
							}
						});
						if ($("input:checkbox[id=ca_M_st]").prop('checked')) {
							_this.setSelList($('#ca_M_jk_style'), stList);
							_this.setSelList($('#ca_M_sl_style'), slList);
						}
						if ($("input:checkbox[id=ca_M_jk]").prop('checked')) {
							_this.setSelList($('#ca_M_jk_style'), jkList);
						}
						if ($("input:checkbox[id=ca_M_sl]").prop('checked')) {
							_this.setSelList($('#ca_M_sl_style'), slList);
						}
						if ($("input:checkbox[id=ca_M_ve]").prop('checked')) {
							_this.setSelList($('#ca_M_ve_style'), veList);
						}
					}
					else{
						$.each(recs, function() {
							var cn = {
									id: this.brandstyle.id,
									code: this.brandstyle.code,
									name: this.brandstyle.name,
									price:this.price,
									mStyleoptTypeID:this.mStyleoptTypeID,
									lStyleoptTypeID:this.lStyleoptTypeID
							};
							if(this.lStyleoptTypeID == chk){
								list.push(cn);
							}
						});
						_this.setSelList($el, list);
					}
				}

				if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
					_this.styleStList = stList;
					_this.styleJkList = jkList;
					_this.styleSlList = slList;
					_this.styleVeList = veList;
				}
				else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
					if(chk == TYPE.L_JK){
						_this.styleJkList = list;
					}
					else if(chk == TYPE.L_SK){
						_this.styleSkList = list;
					}
					else if(chk == TYPE.L_SL){
						_this.styleSlList = list;
					}
					else if(chk == TYPE.L_VE){
						_this.styleVeList = list;
					}
				}
			}, this)).fail(_.bind(function(data){

			}, this));
			return promise;
		},
		/**
		 * スタイルオプションセレクター作成
		 */
		makeStyleOptSel:function(loadFlag, type, chk, style, baseObj, otherObj){
			var _this = this;
			var comData =  {};
			var dateData =  {};
			var storeID = 0;
			var orderDate = 0;
			var brandID = 0;
			var wash = 0;
			var styleID = 0;
			if(loadFlag == false){
				if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null
						|| this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
					return null;
				}
				comData =  clutil.view2data($('#ca_brandArea'));
				dateData =  clutil.view2data($('#ca_dateArea'));
				storeID = $("#ca_storeID").autocomplete('clAutocompleteItem').id;
				orderDate = dateData.orderDate;
			}
			else{
				comData = baseObj;
				dateData = otherObj;
				storeID = baseObj.storeID;
				orderDate = dateData.orderDate;
			}


			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				brandID = comData.M_brand;
				wash = comData.M_wash;
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				brandID = comData.L_brand;
				styleID = style;
			}
			else{
				brandID = comData.S_brand;
			}

			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0270GetReq:{
						reqType :OPETYPE.AMPOV0270_REQTYPE_OPTION,
						poTypeID: type,
						storeID: storeID,
						brandID: brandID,
						orderDate: orderDate,
						washableFlag: wash,
						styleID:styleID,
						// 以下は使用しないリクエスト
						clothIDID: 0,
						srchID: 0,
						seasonTypeID: 0,
						modelIDList: [],
						styleOptTypeIDList: []
					}
			};

			var promise = clutil.postJSON('AMPOV0270', srchReq).done(_.bind(function(data){
				var recs = data.AMPOV0270GetRsp.optionList;
				var list = [];
				var flag = true;
				if(_.isEmpty(recs)){
					flag = false;
					recs = list;
				}

				// セレクター作成関数
				if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
					_this.makeM_OptSel(loadFlag, flag, chk, recs, comData);
				}
				else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
					_this.makeL_OptSel(loadFlag, flag, chk, recs, comData);
				}
				else{
					_this.makeS_OptSel(loadFlag, flag, recs, comData);
				}
			}, this)).fail(_.bind(function(data){

			}, this));
			return promise;
		},



		/**
		 * オプションセレクター
		 * @param list
		 */
		makeM_OptSel:function(loadFlag, flag, chk, getList, comData){
			var _this = this;
			var list = [];
			// スーツ用リスト
			var stBottonList = [];
			var stLiningList = [];
			var stHoleColorList = [];
			// ジャケット用リスト
			var jkBottonList = [];
			var jkLiningList = [];
			var jkHoleColorList = [];
			// スラックス用リスト
			var slBottonList = [];
			// ベスト用リスト
			var veBottonList = [];
			var veLiningList = [];

			if(flag == false){
				// 	検索結果が空っぽの場合
				if(chk == TYPE.ALL || chk == TYPE.ST || chk == TYPE.JK){
					_this.setSelList($("#ca_M_jk_changeButtonSel"), list);
					_this.setSelList($("#ca_M_jk_buttonThreadColorSel"), list);
					_this.setSelList($("#ca_M_jk_changeLiningSel"), list);
					_this.changeStButtonList  = stBottonList;
					_this.changeStLiningList  = stLiningList;
					_this.buttonThreadColorSelList  = stHoleColorList;
				}
				if(chk == TYPE.ALL || chk == TYPE.ST || chk == TYPE.SL){
					_this.setSelList($("#ca_M_sl_changeButtonSel"), list);
					_this.changeSlButtonList  = slBottonList;
				}
				if(chk == TYPE.ALL || chk == TYPE.VE){
					_this.setSelList($("#ca_M_ve_changeButtonSel"), list);
					_this.setSelList($("#ca_M_ve_changeLiningSel"), list);
					_this.changeVeButtonList  = veBottonList;
					_this.changeVeLiningList  = veLiningList;
				}
			}
			else{
				$.each(getList, function() {
					var cn = {
							id: this.optionID,
							code: this.seq,
							name: this.comment,

							styleOptTypeID:this.styleOptTypeID,
							poOptTypeID:this.poOptTypeID,
							optionID:this.optionID,
							seq:this.seq,
							comment:this.comment,
							optHinban:this.optHinban,
							costTypeID:this.costTypeID,
							cost:this.cost,
							collar1Flag:this.collar1Flag,
							interliningFlag:this.interliningFlag,
							armTypeShortFlag:this.armTypeShortFlag,
							amfTypeFlag:this.amfTypeFlag,
							collorOptTypeHalfFlag:this.collorOptTypeHalfFlag,
							degreeMax:this.degreeMax,
							degreeMin:this.degreeMin,
							degreeMinWithAddCost:this.degreeMinWithAddCost,
							neckSizeMax:this.neckSizeMax,
							neckSizeMin:this.neckSizeMin,
							neckSizeMinWithAddCost:this.neckSizeMinWithAddCost
					};

					// リスト作成
					list.push(cn);
					if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
						stBottonList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
						stLiningList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						jkBottonList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						jkLiningList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
						slBottonList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
						veBottonList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
						veLiningList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_ARM_1ST_BTN_HOLE_COLOR_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
						stHoleColorList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_ARM_1ST_BTN_HOLE_COLOR_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						jkHoleColorList.push(cn);
					}
				});
				// 内容物がある場合 --> セレクターにセットする。
				if(chk == TYPE.ALL || chk == TYPE.ST || chk == TYPE.JK){
					_this.setSelList($("#ca_M_jk_changeButtonSel"), stBottonList);
					_this.setSelList($("#ca_M_jk_changeLiningSel"), stLiningList);
					_this.setSelList($("#ca_M_jk_buttonThreadColorSel"), stHoleColorList);

					_this.changeStButtonList  = stBottonList;
					_this.changeStLiningList  = stLiningList;
					_this.buttonThreadColorSelList  = stHoleColorList;
				}
				if(chk == TYPE.ALL || chk == TYPE.ST || chk == TYPE.JK){
					_this.setSelList($("#ca_M_jk_changeButtonSel"), jkBottonList);
					_this.setSelList($("#ca_M_jk_changeLiningSel"), jkLiningList);
					//_this.setSelList($("#ca_M_jk_buttonThreadColorSel"), jkHoleColorList);
					_this.setSelList($("#ca_M_jk_buttonThreadColorSel"), stHoleColorList);

					_this.changeJkButtonList  = jkBottonList;
					_this.changeJkLiningList  = jkLiningList;
					//_this.buttonThreadColorSelList  = jkHoleColorList;
					_this.buttonThreadColorSelList  = stHoleColorList;
				}
				if(chk == TYPE.ALL || chk == TYPE.ST || chk == TYPE.SL){
					_this.setSelList($("#ca_M_sl_changeButtonSel"), slBottonList);

					_this.changeSlButtonList  = slBottonList;
				}
				if(chk == TYPE.ALL || chk == TYPE.VE){
					_this.setSelList($("#ca_M_ve_changeButtonSel"), veBottonList);
					_this.setSelList($("#ca_M_ve_changeLiningSel"), veLiningList);

					_this.changeVeButtonList  = veBottonList;
					_this.changeVeLiningList  = veLiningList;
				}
			}
			// オプションがなかったらdisabledにする処理
			_this.chkM_OptUse(list, comData, chk);
			if(loadFlag == true){
				if(_this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						|| _this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					// 削除・参照の際はもう一回全領域に編集不可処理(上記で編集可能判定のものが生きてしまうため)
					_this.setReadOnlyAllItems(true);
				}
			}

			// 持ち回りリスト設定
			_this.optionList = list;
		},
		// オプションがなかったものはdisable
		chkM_OptUse:function(list, comData, chk){
			var _this = this;
			// オプション有無フラグ
			// スーツ
			var f_ST_cngButton = false;
			var f_ST_cngLining = false;
			var f_ST_amf = false;
			var f_ST_cuffs4 = false;
			var f_ST_cngPocket = false;
			var f_ST_buttonHole = false;
			var f_ST_daiba = false;
			var f_ST_summer = false;
			var f_ST_flowerHole = false;
			// ジャケット(ボタンと裏地以外はスーツのフラグを使用)
			var f_JK_cngButton = false;
			var f_JK_cngLining = false;
			// スラックス
			var f_SL_adjuster = false;
			var f_SL_cngButton = false;
			// ベスト
			var f_VE_amf = false;
			var f_VE_amfPay = false;
			var f_VE_cngButton = false;
			var f_VE_cngLining = false;

			$.each(list, function() {
				var cn = {
						styleOptTypeID:this.styleOptTypeID,
						costTypeID:this.costTypeID,
						poOptTypeID:this.poOptTypeID
				};
				// スーツ
				if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
					f_ST_cngButton = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
					f_ST_cngLining = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_AMF_STITCH_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
					f_ST_amf = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_FOUR_ARM_BUTTON_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
					f_ST_cuffs4 = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_POCKET_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
					f_ST_cngPocket = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_REAL_BUTTON_HOLE_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
					f_ST_buttonHole = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_ODAIBA_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
					f_ST_daiba = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_SUMMAR_SPEC_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
					f_ST_summer = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_ARM_1ST_BTN_HOLE_COLOR_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
					f_ST_flowerHole = true;
				}
				// ジャケット
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
					f_JK_cngButton = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
					f_JK_cngLining = true;
				}
				// スラックス
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_ADJUSTER_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
					f_SL_adjuster = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
					f_SL_cngButton = true;
				}
				// ベスト
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_AMF_STITCH_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST
						&& cn.costTypeID == amcm_type.AMCM_VAL_COST_TYPE_PAY){
					// 有料ステッチ
					f_VE_amfPay = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_AMF_STITCH_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST
						&& cn.costTypeID == amcm_type.AMCM_VAL_COST_TYPE_FREE){
					// 無料ステッチ
					f_VE_amf = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
					f_VE_cngButton = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
					f_VE_cngLining = true;
				}
			});

			// ボタン変更と裏地は、スーツとジャケットで分ける
			if((chk == TYPE.ALL && comData.M_st == 1) || chk == TYPE.ST){
				_this.setDisableOptDiv(f_ST_cngButton, $("#ca_M_jk_changeButtonTypeDiv"), {M_jk_changeButtonType:0});
				_this.setDisableOptDiv(f_ST_cngLining, $("#ca_M_jk_changeLiningTypeDiv"), {M_jk_changeLiningType:0});

				_this.setDisableOptDiv(f_ST_amf, $("#ca_M_jk_amfPayTypeDiv"), {M_jk_amfPayType:0});
				_this.setDisableOptDiv(f_ST_cuffs4, $("#ca_M_jk_sleeveButtonTypeDiv"), {M_jk_sleeveButtonType:0});
				_this.setDisableOptDiv(f_ST_cngPocket, $("#ca_M_jk_changePocketTypeDiv"), {M_jk_changePocketType:0});
				_this.setDisableOptDiv(f_ST_buttonHole, $("#ca_M_jk_cuffsTypeDiv"), {M_jk_cuffsType:0});
				_this.setDisableOptDiv(f_ST_daiba, $("#ca_M_jk_daibaTypeDiv"), {M_jk_daibaType:0});
				_this.setDisableOptDiv(f_ST_summer, $("#ca_M_jk_summerTypeDiv"), {M_jk_summerType:0});
				_this.setDisableOptDiv(f_ST_flowerHole, $("#ca_M_jk_flowerHoleDiv"), {M_jk_cuffsFirst:0, M_jk_flowerHole:0});

				_this.setDisableOptDiv(f_SL_adjuster, $("#ca_M_sl_adjusterDiv"), {M_sl_adjuster:0});
				_this.setDisableOptDiv(f_SL_adjuster, $("#ca_M_sl_adjusterSpareDiv"), {M_sl_adjusterSpare:0});
				_this.setDisableOptDiv(f_SL_cngButton, $("#ca_M_sl_changeButtonTypeDiv"), {M_sl_changeButtonType:0});

				// セレクターの設定
				_this.setDisableOptSelElem(f_ST_cngButton, _this.changeStButtonList,
						$("#ca_M_jk_changeButtonSelDiv"), $("#ca_M_jk_changeButtonSel"));
				_this.setDisableOptSelElem(f_ST_cngLining, _this.changeStLiningList,
						$("#ca_M_jk_changeLiningSelDiv"), $("#ca_M_jk_changeLiningSel"));
				_this.setDisableOptSelElem(f_ST_flowerHole, _this.buttonThreadColorSelList,
						$("#ca_M_jk_buttonThreadColorDiv"), $("#ca_M_jk_buttonThreadColorSel"));
			}
			if((chk == TYPE.ALL && comData.M_jk == 1) || chk == TYPE.JK){
				_this.setDisableOptDiv(f_JK_cngButton, $("#ca_M_jk_changeButtonTypeDiv"), {M_jk_changeButtonType:0});
				_this.setDisableOptDiv(f_JK_cngLining, $("#ca_M_jk_changeLiningTypeDiv"), {M_jk_changeLiningType:0});

				_this.setDisableOptDiv(f_ST_amf, $("#ca_M_jk_amfPayTypeDiv"), {M_jk_amfPayType:0});
				_this.setDisableOptDiv(f_ST_cuffs4, $("#ca_M_jk_sleeveButtonTypeDiv"), {M_jk_sleeveButtonType:0});
				_this.setDisableOptDiv(f_ST_cngPocket, $("#ca_M_jk_changePocketTypeDiv"), {M_jk_changePocketType:0});
				_this.setDisableOptDiv(f_ST_buttonHole, $("#ca_M_jk_cuffsTypeDiv"), {M_jk_cuffsType:0});
				_this.setDisableOptDiv(f_ST_daiba, $("#ca_M_jk_daibaTypeDiv"), {M_jk_daibaType:0});
				_this.setDisableOptDiv(f_ST_summer, $("#ca_M_jk_summerTypeDiv"), {M_jk_summerType:0});
				_this.setDisableOptDiv(f_ST_flowerHole, $("#ca_M_jk_flowerHoleDiv"), {M_jk_cuffsFirst:0, M_jk_flowerHole:0});

				// セレクター
				_this.setDisableOptSelElem(f_JK_cngButton, _this.changeJkButtonList,
						$("#ca_M_jk_changeButtonSelDiv"), $("#ca_M_jk_changeButtonSel"));
				_this.setDisableOptSelElem(f_JK_cngLining, _this.changeJkLiningList,
						$("#ca_M_jk_changeLiningSelDiv"), $("#ca_M_jk_changeLiningSel"));
				_this.setDisableOptSelElem(f_ST_flowerHole, _this.buttonThreadColorSelList,
						$("#ca_M_jk_buttonThreadColorDiv"), $("#ca_M_jk_buttonThreadColorSel"));
			}
			if((chk == TYPE.ALL && comData.M_sl == 1) || chk == TYPE.SL){
				_this.setDisableOptDiv(f_SL_adjuster, $("#ca_M_sl_adjusterDiv"), {M_sl_adjuster:0});
				_this.setDisableOptDiv(f_SL_adjuster, $("#ca_M_sl_adjusterSpareDiv"), {M_sl_adjusterSpare:0});
				_this.setDisableOptDiv(f_SL_cngButton, $("#ca_M_sl_changeButtonTypeDiv"), {M_sl_changeButtonType:0});
				// セレクター
				_this.setDisableOptSelElem(f_SL_cngButton, _this.changeSlButtonList,
						$("#ca_M_sl_changeButtonSelDiv"), $("#ca_M_sl_changeButtonSel"));
			}
			if((chk == TYPE.ALL && comData.M_ve == 1) || chk == TYPE.VE){
				_this.setDisableOptDiv(f_VE_amf, $("#ca_M_ve_amfTypeDiv"), {M_ve_amfType:0});
				_this.setDisableOptDiv(f_VE_amfPay, $("#ca_M_ve_amfPayTypeDiv"), {M_ve_amfPayType:0});
				_this.setDisableOptDiv(f_VE_cngButton, $("#ca_M_ve_changeButtonTypeDiv"), {M_ve_changeButtonType:0});
				_this.setDisableOptDiv(f_VE_cngLining, $("#ca_M_ve_changeLiningTypeDiv"), {M_ve_changeLiningType:0});
				// セレクター
				_this.setDisableOptSelElem(f_VE_cngButton, _this.changeVeButtonList,
						$("#ca_M_ve_changeButtonSelDiv"), $("#ca_M_ve_changeButtonSel"));
				_this.setDisableOptSelElem(f_VE_cngLining, _this.changeVeLiningList,
						$("#ca_M_ve_changeLiningSelDiv"), $("#ca_M_ve_changeLiningSel"));
			}
		},
		makeL_OptSel:function(loadFlag, flag, chk, getList, comData){
			var _this = this;
			var list = [];
			// ジャケット用リスト
			var jkBottonList = [];
			var jkLiningList = [];
			var jkButtonHoleList = [];
			// スカート用リスト
			// 	パンツ用リスト
			var slBottonList = [];
			// ベスト用リスト
			var veBottonList = [];
			var veLiningList = [];

			if(flag == false){
				// 	検索結果が空っぽの場合
				if(chk == TYPE.ALL || chk == TYPE.L_JK){
					_this.setSelList($("#ca_L_jk_changeButtonSel"), list);
					_this.setSelList($("#ca_L_jk_changeLiningSel"), list);
					_this.setSelList($("#ca_L_jk_cuffsFirstSel"), list);
					_this.changeJkButtonList  = jkBottonList;
					_this.changeJkLiningList  = jkLiningList;
					_this.buttonThreadColorSelList  = jkButtonHoleList;
				}
				if(chk == TYPE.ALL || chk == TYPE.L_SK){

				}
				if(chk == TYPE.ALL || chk == TYPE.L_SL){
					_this.setSelList($("#ca_L_sl_changeButtonSel"), list);
					_this.changeSlButtonList  = slBottonList;
				}
				if(chk == TYPE.ALL || chk == TYPE.L_VE){
					_this.setSelList($("#ca_L_ve_changeButtonSel"), list);
					_this.setSelList($("#ca_L_ve_changeLiningSel"), list);
					_this.changeVeButtonList  = veBottonList;
					_this.changeVeLiningList  = veLiningList;
				}
			}
			else{
				$.each(getList, function() {
					var cn = {
							id: this.optionID,
							code: this.seq,
							name: this.comment,

							styleOptTypeID:this.styleOptTypeID,
							poOptTypeID:this.poOptTypeID,
							optionID:this.optionID,
							seq:this.seq,
							comment:this.comment,
							optHinban:this.optHinban,
							costTypeID:this.costTypeID,
							cost:this.cost,
							collar1Flag:this.collar1Flag,
							interliningFlag:this.interliningFlag,
							armTypeShortFlag:this.armTypeShortFlag,
							amfTypeFlag:this.amfTypeFlag,
							collorOptTypeHalfFlag:this.collorOptTypeHalfFlag,
							degreeMax:this.degreeMax,
							degreeMin:this.degreeMin,
							degreeMinWithAddCost:this.degreeMinWithAddCost,
							neckSizeMax:this.neckSizeMax,
							neckSizeMin:this.neckSizeMin,
							neckSizeMinWithAddCost:this.neckSizeMinWithAddCost,
							cuffsFlag:this.cuffsFlag,				//2016/2/4 STB追加
							sleeveDesignFlag:this.sleeveDesignFlag,	//2016/2/4 STB追加
							lineFlag:this.buttonHoleColorLineFlag	//2016/2/4 STB追加
					};

					// リスト作成
					list.push(cn);
					if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						jkBottonList.push(cn);
						// 2015/9/5 T190 「SLのボタンはJKのボタンをセット」対応 藤岡
						slBottonList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_ARM_1ST_BTN_HOLE_COLOR_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						// 2016/1/26 PRS追加対応
						jkButtonHoleList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						jkLiningList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS){
						// 2015/9/5 T190 「SLのボタンはJKのボタンをセット」対応 藤岡
						//slBottonList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						veBottonList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						veLiningList.push(cn);
					}
				});
				// 内容物がある場合 --> セレクターにセットする。


				if(chk == TYPE.ALL || chk == TYPE.L_JK){
					_this.setSelList($("#ca_L_jk_changeButtonSel"), jkBottonList);
					_this.setSelList($("#ca_L_jk_changeLiningSel"), jkLiningList);
					_this.setSelList($("#ca_L_jk_buttonHoleSel"), jkButtonHoleList);
					_this.changeJkButtonList  = jkBottonList;
					_this.changeJkLiningList  = jkLiningList;
					_this.buttonThreadColorSelList  = jkButtonHoleList;
				}
				if(chk == TYPE.ALL || chk == TYPE.L_SK){

				}
				if(chk == TYPE.ALL || chk == TYPE.L_SL){
					_this.setSelList($("#ca_L_sl_changeButtonSel"), slBottonList);
					_this.changeSlButtonList  = slBottonList;
				}
				if(chk == TYPE.ALL || chk == TYPE.L_VE){
					_this.setSelList($("#ca_M_ve_changeButtonSel"), veBottonList);
					_this.setSelList($("#ca_L_ve_changeLiningSel"), veLiningList);
					_this.changeVeButtonList  = veBottonList;
					_this.changeVeLiningList  = veLiningList;
				}
			}
			// オプションがなかったらdisabledにする処理
			_this.chkL_OptUse(list, comData, chk);
			if(loadFlag == true){
				if(_this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						|| _this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					// 削除・参照の際はもう一回全領域に編集不可処理(上記で編集可能判定のものが生きてしまうため)
					_this.setReadOnlyAllItems(true);
				}
			}
			// 持ち回りリスト設定
			_this.optionList = list;
		},
		chkL_OptUse:function(list, comData, chk){
			var _this = this;

			// オプション有無フラグ
			// ジャケット
			var f_JK_cngButton = false;
			var f_JK_cngLining = false;

			var obj = {};
			var ventObjList = [];
			var cuffsObjList = [];
			var cuffsPayObjList = [];

			var f_JK_ventType = false;
			var f_JK_cuffsPayType = false;
			var f_JK_cuffsType = false;
			var f_JK_amfType = false;
			var f_JK_pocketInnerType = false;
//			var f_JK_armDesignButtonType = false;
//			var f_JK_sideVentType = false;
			var f_JK_cuffsFirst = false;
			var f_JK_buttonHoleColor = false;
			// パンツ
			var f_SL_cngButton = false;
			// ベスト
			var f_VE_cngButton = false;
			var f_VE_cngLining = false;
			var f_VE_amfType = false;
			var f_VE_buckleType = false;

			var f_JK_cuffsFirst_sleeveDesign = 0;	// リターンカフス対象外フラグ

			$.each(list, function() {
				var cn = {
						styleOptTypeID:this.styleOptTypeID,
						poOptTypeID:this.poOptTypeID,
						comment:this.comment,
						optionID:this.optionID,
						cost:this.cost,
						costType:this.costTypeID,
						cuffsFlag:this.cuffsFlag,				//2016/2/4 STB追加
						sleeveDesignFlag:this.sleeveDesignFlag,	//2016/2/4 STB追加
						lineFlag:this.lineFlag					//2016/2/4 STB追加
				};
				// ジャケット
				if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					f_JK_cngButton = true;
					// 2015/9/5 T190 「SLのボタンはJKのボタンをセット」対応 藤岡
					f_SL_cngButton = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					f_JK_cngLining = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CENTER_VENT_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					f_JK_ventType = true;
					// 2016/1/26 リスト作成
					obj = {
							optionID : cn.optionID,
							label : cn.comment,
							cost : cn.cost
					};
					ventObjList.push(obj);
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_ARM_DESIGN_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET
						&& cn.costType == amcm_type.AMCM_VAL_COST_TYPE_PAY){
					f_JK_cuffsPayType = true;
					// 2016/1/26 リスト作成
					obj = {
							optionID : cn.optionID,
							label : cn.comment,
							cost : cn.cost,
							cuffsFlag : cn.cuffsFlag,	// 本切羽対象外フラグ(0=対象、1:対象外)
							lineFlag:cn.lineFlag		// ボタンホールカラー糸対象外フラグ(0=対象、1:対象外)
					};
					cuffsPayObjList.push(obj);
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_ARM_DESIGN_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET
						&& cn.costType == amcm_type.AMCM_VAL_COST_TYPE_FREE){
					f_JK_cuffsType = true;
					// 2016/1/26 リスト作成
					obj = {
							optionID : cn.optionID,
							label : cn.comment,
							cost : cn.cost,
							cuffsFlag : cn.cuffsFlag,	// 本切羽対象外フラグ(0=対象、1:対象外)
							lineFlag:cn.lineFlag		// ボタンホールカラー糸対象外フラグ(0=対象、1:対象外)
					};
					cuffsObjList.push(obj);
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_AMF_STITCH_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					f_JK_amfType = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_INNER_POCKET_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					f_JK_pocketInnerType = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_ARM_DESIGN_BUTTON_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					// 2016/1/26 PRS追加削除
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_SIDE_BENTS_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					// 2016/1/26 PRS追加削除
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_REAL_BUTTON_HOLE_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					f_JK_cuffsFirst = true;
					f_JK_cuffsFirst_sleeveDesign = cn.sleeveDesignFlag;	// リターンカフス対象外フラグ
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_ARM_1ST_BTN_HOLE_COLOR_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					f_JK_buttonHoleColor = true;
				}
				// スラックス
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS){
					// 2015/9/5 T190 「SLのボタンはJKのボタンをセット」対応 藤岡
					//f_SL_cngButton = true;
				}
				// ベスト
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
					f_VE_cngButton = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
					f_VE_cngLining = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_AMF_STITCH_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
					f_VE_amfType = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_PIN_BUCKLE_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
					f_VE_buckleType = true;
				}
			});

			if((chk == TYPE.ALL && comData.L_jk == 1) || chk == TYPE.L_JK){
				_this.setDisableOptDiv(f_JK_cngButton, $("#ca_L_jk_changeButtonTypeDiv"), {L_jk_changeButtonType:0});
				_this.setDisableOptDiv(f_JK_cngLining, $("#ca_L_jk_changeLiningTypeDiv"), {L_jk_changeLiningType:0});
				_this.setDisableOptDiv(f_JK_ventType, $("#ca_L_jk_ventTypeDiv"), {L_jk_ventType:0});
				_this.setDisableOptDiv(f_JK_cuffsPayType, $("#ca_L_jk_cuffsPayTypeDiv"), {L_jk_cuffsPayType:0});
				_this.setDisableOptDiv(f_JK_cuffsType, $("#ca_L_jk_cuffsTypeDiv"), {L_jk_cuffsType:0});
				_this.setDisableOptDiv(f_JK_amfType, $("#ca_L_jk_amfTypeDiv"), {L_jk_amfType:0});

				// 2016/1/26 PRS追加(各ラジオにID設定)
				_this.setVentType(ventObjList, f_JK_ventType);
				_this.setCuffsPayType(cuffsPayObjList, f_JK_cuffsPayType);
				_this.setCuffsType(cuffsObjList, f_JK_cuffsType);
				_this.setCuffsFirst(f_JK_cuffsFirst_sleeveDesign);
				// 2016/2/4 グローバル変数に指定
				_this.ventObjList = ventObjList;
				_this.cuffsPayObjList = cuffsPayObjList;
				_this.cuffsObjList = cuffsObjList;

				// 2016/1/26 PRS追加対応
				_this.setDisableOptDiv(f_JK_cuffsFirst, $("#ca_L_jk_cuffsFirstDiv"), {L_jk_cuffsFirstType:0});
				_this.setDisableOptDiv(f_JK_buttonHoleColor, $("#ca_L_jk_buttonHoleDiv"), {L_jk_buttonHoleType:0});

				// セレクター
				_this.setDisableOptSelElem(f_JK_buttonHoleColor, _this.buttonThreadColorSelList,
						$("#ca_L_jk_buttonHoleSelDiv"), $("#ca_L_jk_buttonHoleSel"));
				_this.setDisableOptSelElem(f_JK_cngButton, _this.changeJkButtonList,
						$("#ca_L_jk_changeButtonSelDiv"), $("#ca_L_jk_changeButtonSel"));
				_this.setDisableOptSelElem(f_JK_cngLining, _this.changeJkLiningList,
						$("#ca_L_jk_changeLiningSelDiv"), $("#ca_L_jk_changeLiningSel"));

				// 胸内ポケットが触れない場合はネーム不可
				_this.setDisableOptDiv(f_JK_pocketInnerType, $("#ca_L_jk_pocketInnerTypeDiv"), {L_jk_pocketInnerType:0});
				_this.chkNameL(f_JK_pocketInnerType);
				_this.chkInnerPocketL(f_JK_pocketInnerType, TYPE.OFF);
				if(_this.chkL_modelPRE(comData.L_jkSel) == true){
					// プレシャスの場合は強制的にネームなし・胸ポケットあり
					// 2016/1/26 ネームなし強制削除
					_this.chkNameL(false);
					_this.L_chkChestPocket(false);
					//_this.L_chkVentType(false, 0);
				}
				else if(_this.chkL_modelSTB(comData.L_jkSel) == true){
					// 2015/12/9 STB追加対応
					// スタイリッシュブラックの場合は強制的に胸内ポケットあり・胸ポケットあり固定
					_this.L_chkChestPocket(false);
					//_this.L_chkInnerPocket(false, 1);
				}
				else if(_this.chkL_modelELG(comData.L_jkSel) == true){
					// 2016/10/19 ELG追加対応
					// エレガンスの場合は胸ポケットは選択可
					_this.L_chkChestPocket(true);
					//_this.L_chkInnerPocket(false, 1);
				}
				else if(_this.chkL_modelPRB(comData.L_jkSel) == true){
					// 2016/1/26 PRS追加対応
					// プレシャスブラックの場合は強制的に胸ポケットあり固定
					_this.L_chkChestPocket(false);
				}
				else{
					_this.L_chkChestPocket(true);
					_this.L_chkInnerPocket(f_JK_pocketInnerType, 0);
					_this.L_chkVentType(f_JK_ventType, 0);
				}
			}
			if((chk == TYPE.ALL && comData.L_sl == 1) || chk == TYPE.L_SL){
				_this.setDisableOptDiv(f_SL_cngButton, $("#ca_L_sl_changeButtonTypeDiv"), {L_sl_changeButtonType:0});
				// セレクター
				_this.setDisableOptSelElem(f_SL_cngButton, _this.changeSlButtonList,
						$("#ca_L_sl_changeButtonSelDiv"), $("#ca_L_sl_changeButtonSel"));
			}
			if((chk == TYPE.ALL && comData.L_ve == 1) || chk == TYPE.L_VE){
				_this.setDisableOptDiv(f_VE_cngButton, $("#ca_L_ve_changeButtonTypeDiv"), {L_ve_changeButtonType:0});
				_this.setDisableOptDiv(f_VE_cngLining, $("#ca_L_ve_changeLiningTypeDiv"), {L_ve_changeLiningType:0});
				_this.setDisableOptDiv(f_VE_amfType, $("#ca_L_ve_amfTypeDiv"), {L_ve_amfType:0});
				_this.setDisableOptDiv(f_VE_buckleType, $("#ca_L_ve_buckleTypeDiv"), {L_ve_buckleType:0});

				// セレクター
				_this.setDisableOptSelElem(f_VE_cngButton, _this.changeVeButtonList,
						$("#ca_L_ve_changeButtonSelDiv"), $("#ca_L_ve_changeButtonSel"));
				_this.setDisableOptSelElem(f_VE_cngLining, _this.changeVeLiningList,
						$("#ca_L_ve_changeLiningSelDiv"), $("#ca_L_ve_changeLiningSel"));
			}
		},
		// 2016/1/26 ベントのラジオボタン設定
		setVentType:function(objList, flag){
			// デフォルト
			var label0 = "なし";
			var label1 = "センターベント";
			var label2 = "サイドベンツ";
			var id1 = 0;
			var id2 = 0;

			if(flag == true){
				if(objList.length == 1){
					label0 = "なし(センターベント標準仕様)";
					label1 = "";
					label2 = this.makeLabel(objList[0].label, objList[0].cost);
					// id1 = 0;
					id2 = objList[0].optionID;
					$("#ca_L_jk_ventType_disp_1").hide();
				}
				else{
					// label0 = "なし";
					label1 = this.makeLabel(objList[0].label, objList[0].cost);
					label2 = this.makeLabel(objList[1].label, objList[1].cost);
					id1 = objList[0].optionID;
					id2 = objList[1].optionID;
					$("#ca_L_jk_ventType_disp_1").show();
				}
			}
			$("#ca_L_jk_ventType_label_0").html(label0);
			$("#ca_L_jk_ventType_label_1").html(label1);
			$("#ca_L_jk_ventType_label_2").html(label2);
			$("#ca_L_jk_ventType_0").attr("opt_id", 0);
			$("#ca_L_jk_ventType_1").attr("opt_id", id1);
			$("#ca_L_jk_ventType_2").attr("opt_id", id2);
			$("#ca_L_jk_ventType_0").attr("opt_name", label0);
			$("#ca_L_jk_ventType_1").attr("opt_name", label1);
			$("#ca_L_jk_ventType_2").attr("opt_name", label2);
		},
		// 2016/1/26 ベントのラジオボタン設定
		setCuffsPayType:function(objList, flag){
			// デフォルト
			var label0 = "なし";
			var label1 = "ボタンなし";
			var label2 = "ボタンあり";
			var id1 = 0;
			var id2 = 0;
			var f_cuffsFirst1 = 0;
			var f_cuffsFirst2 = 0;
			var f_btnLine1 = 0;
			var f_btnLine2 = 0;

			if(flag == true){
				// リターンカフス有料フラグ
				this.cuffsPayType = true;

				label1 = this.makeLabel(objList[0].label, objList[0].cost);
				id1 = objList[0].optionID;
				f_cuffsFirst1 = objList[0].cuffsFlag;
				f_btnLine1 = objList[0].lineFlag;
				if(objList.length == 2){
					$("#ca_L_jk_cuffsPayType2Area").show();
					label2 = this.makeLabel(objList[1].label, objList[1].cost);
					id2 = objList[1].optionID;
					f_cuffsFirst2 = objList[1].cuffsFlag;
					f_btnLine2 = objList[1].lineFlag;
				}
				else{
					$("#ca_L_jk_cuffsPayType2Area").hide();
				}
			}
			$("#ca_L_jk_cuffsPayType_label_1").html(label1);
			$("#ca_L_jk_cuffsPayType_label_2").html(label2);
			$("#ca_L_jk_cuffsPayType_0").attr("opt_id", 0);
			$("#ca_L_jk_cuffsPayType_1").attr("opt_id", id1);
			$("#ca_L_jk_cuffsPayType_2").attr("opt_id", id2);
			$("#ca_L_jk_cuffsPayType_0").attr("opt_name", label0);
			$("#ca_L_jk_cuffsPayType_1").attr("opt_name", label1);
			$("#ca_L_jk_cuffsPayType_2").attr("opt_name", label2);
			$("#ca_L_jk_cuffsPayType_0").attr("f_cuffsFirst", 0);
			$("#ca_L_jk_cuffsPayType_1").attr("f_cuffsFirst", f_cuffsFirst1);
			$("#ca_L_jk_cuffsPayType_2").attr("f_cuffsFirst", f_cuffsFirst2);
			$("#ca_L_jk_cuffsPayType_0").attr("f_btnLine", 0);
			$("#ca_L_jk_cuffsPayType_1").attr("f_btnLine", f_btnLine1);
			$("#ca_L_jk_cuffsPayType_2").attr("f_btnLine", f_btnLine2);
		},
		// 2016/1/26 ベントのラジオボタン設定
		setCuffsType:function(objList, flag){
			// デフォルト
			var label0 = "なし";
			var label1 = "ボタンなし";
			var label2 = "ボタンあり";
			var id1 = 0;
			var id2 = 0;
			var f_cuffsFirst1 = 0;
			var f_cuffsFirst2 = 0;
			var f_btnLine1 = 0;
			var f_btnLine2 = 0;

			if(flag == true){
				// リターンカフス有料フラグ
				this.cuffsPayType = false;

				label1 = this.makeLabel(objList[0].label, objList[0].cost);
				id1 = objList[0].optionID;
				f_cuffsFirst1 = objList[0].cuffsFlag;
				f_btnLine1 = objList[0].lineFlag;
				if(objList.length == 2){
					$("#ca_L_jk_cuffsType2Area").show();
					label2 = this.makeLabel(objList[1].label, objList[1].cost);
					id2 = objList[1].optionID;
					f_cuffsFirst2 = objList[1].cuffsFlag;
					f_btnLine2 = objList[1].lineFlag;
				}
				else{
					$("#ca_L_jk_cuffsType2Area").hide();
				}
			}
			$("#ca_L_jk_cuffsType_label_1").html(label1);
			$("#ca_L_jk_cuffsType_label_2").html(label2);
			$("#ca_L_jk_cuffsType_0").attr("opt_id", 0);
			$("#ca_L_jk_cuffsType_1").attr("opt_id", id1);
			$("#ca_L_jk_cuffsType_2").attr("opt_id", id2);
			$("#ca_L_jk_cuffsType_0").attr("opt_name", label0);
			$("#ca_L_jk_cuffsType_1").attr("opt_name", label1);
			$("#ca_L_jk_cuffsType_2").attr("opt_name", label2);
			$("#ca_L_jk_cuffsType_0").attr("f_cuffsFirst", 0);
			$("#ca_L_jk_cuffsType_1").attr("f_cuffsFirst", f_cuffsFirst1);
			$("#ca_L_jk_cuffsType_2").attr("f_cuffsFirst", f_cuffsFirst2);
			$("#ca_L_jk_cuffsType_0").attr("f_btnLine", 0);
			$("#ca_L_jk_cuffsType_1").attr("f_btnLine", f_btnLine1);
			$("#ca_L_jk_cuffsType_2").attr("f_btnLine", f_btnLine2);
		},
		setCuffsFirst:function(val){
			$("#ca_L_jk_cuffsFirstType_0").attr("f_cuffs", 0);
			$("#ca_L_jk_cuffsFirstType_1").attr("f_cuffs", val);
		},


		// 表示項目設定
		makeLabel:function(label, cost){
			var str = label;
			if(cost > 0){
				str = str + "(" + clutil.comma(cost) + "円)";
			}
			return str;
		},
		// モデルがプレシャスか判断
		chkL_modelPRE:function(modelID){
			var list = this.modelList;
			var i = 0;
			var flag = false;
			for(i=0; i<list.length; i++){
				if(list[i].id == modelID && list[i].code == "PRE"){
					flag =true;
				}
			}
			return flag;
		},
		// モデルがプレシャスブラックか判断
		chkL_modelPRB:function(modelID){
			var list = this.modelList;
			var i = 0;
			var flag = false;
			for(i=0; i<list.length; i++){
				if(list[i].id == modelID && list[i].code == "PRB"){
					flag =true;
				}
			}
			return flag;
		},
		// モデルがエレガンスか判断
		chkL_modelELG:function(modelID){
			var list = this.modelList;
			var i = 0;
			var flag = false;
			for(i=0; i<list.length; i++){
				if(list[i].id == modelID && list[i].code == "ELG"){
					flag =true;
				}
			}
			return flag;
		},
		// モデルがスタイリッシュブラックか判断
		chkL_modelSTB:function(modelID){
			var list = this.modelList;
			var i = 0;
			var flag = false;
			for(i=0; i<list.length; i++){
				if(list[i].id == modelID && list[i].code == "STB"){
					flag =true;
				}
			}
			return flag;
		},
		// 胸ポケットの編集可/不可
		L_chkChestPocket:function(flag){
			if(flag == true){
				// 編集可能
				clutil.viewRemoveReadonly($("#ca_L_jk_pocketTypeArea"));
			}
			else{
				// 不可
				// [あり]強制
				clutil.data2view($("#ca_L_jk_pocketTypeArea"), {L_jk_pocketType:2});
				clutil.viewReadonly($("#ca_L_jk_pocketTypeArea"));
			}
		},
		// 胸内ポケットの編集可/不可
		L_chkInnerPocket:function(flag, val){
			if(flag == true){
				// 編集可能
				clutil.viewRemoveReadonly($("#ca_L_jk_pocketInnerTypeDiv"));
			}
			else{
				// 不可
				clutil.data2view($("#ca_L_jk_pocketInnerTypeDiv"), {L_jk_pocketInnerType:val});
				clutil.viewReadonly($("#ca_L_jk_pocketInnerTypeDiv"));
			}
		},
		// センターベントの編集可/不可
		L_chkVentType:function(flag, val){
			if(flag == true){
				// 編集可能
				clutil.viewRemoveReadonly($("#ca_L_jk_ventTypeDiv"));
			}
			else{
				// 不可
				clutil.data2view($("#ca_L_jk_ventTypeDiv"), {L_jk_ventType:val});
				clutil.viewReadonly($("#ca_L_jk_ventTypeDiv"));
			}
		},
		// ネーム制御可/不可処理
		chkNameL:function(flag){
			// ネーム領域
			if(flag == false){
				var obj = {
						L_jk_name:amcm_type.AMCM_VAL_PO_NAME_TYPE_NONE
				};
				clutil.data2view($("#ca_L_jk_nameArea"), obj);
				$(".ca_L_jk_nameElem").removeClass("cl_required");
				$(".ca_L_jk_nameDiv").hide();
				clutil.viewReadonly($("#ca_L_jk_nameArea"));
			}
			else{
				clutil.data2view($("#ca_L_jk_nameArea"), {L_jk_name:0});
				clutil.viewRemoveReadonly($("#ca_L_jk_nameArea"));
			}
		},
		chkInnerPocketL:function(flag, pocketFlag){
			if(flag == false){
				var obj = {
						// 1:あり 0:なし
						L_jk_pocketInnerType:pocketFlag
				};
				clutil.data2view($("#ca_L_jk_pocketInnerTypeDiv"), obj);
				clutil.viewReadonly($("#ca_L_jk_pocketInnerTypeDiv"));
			}
			else{
				clutil.viewRemoveReadonly($("#ca_L_jk_pocketInnerTypeDiv"));
			}
		},
		// シャツオプション
		makeS_OptSel:function(loadFlag, flag, getList, comData){
			var _this = this;
			var list = [];

			var collarList = [];		// 衿
			var cuffsList = [];			// カフス
			var clericList = [];		// クレリック
			var clericShortArmList = [];	// クレリック(半袖)
			var frontTypeList = [];		// 前身頃
			var frontTypeNomalList = [];	// 前身頃(ハーフなし)
			var frontTypeHalfList = [];		// 前身頃(ハーフ)
			var backTypeList = [];		// 後身頃
			var amfList = [];			// amfステッチ
			var pocketList = [];		// ポケット
			var buttonList = [];		// ボタン
			var buttonHoleList = [];	// ボタンホール
			var buttonThreadList = [];	// ボタン付け糸
			var nameList = [];			// ネーム
			var nameTypeList = [];		// 字体
			var nameTypeFullList = [];	// 字体(フルネーム用)
			var namePlaceList = [];		// ネーム場所
			var namePlaceShortArmList = [];	// ネーム場所(半袖)
			var nameColorList = [];		// ネーム色
			var bodyList = [];			// ボディ型
			var neckList = [];			// 首回り
			var neckFreeList = [];		// 首回り(有料なし)
			var armLeftList = [];		// 左裄丈
			var armRigthList = [];		// 右裄丈

			if(flag == false){

			}
			else{
				$.each(getList, function() {
					var cn = {
							id: this.optionID,
							code: this.seq,
							name: this.comment,

							styleOptTypeID:this.styleOptTypeID,
							poOptTypeID:this.poOptTypeID,
							optionID:this.optionID,
							seq:this.seq,
							comment:this.comment,
							optHinban:this.optHinban,
							costTypeID:this.costTypeID,
							cost:this.cost,
							collar1Flag:this.collar1Flag,
							interliningFlag:this.interliningFlag,
							armTypeShortFlag:this.armTypeShortFlag,
							amfTypeFlag:this.amfTypeFlag,
							collorOptTypeHalfFlag:this.collorOptTypeHalfFlag,
							degreeMax:this.degreeMax,
							degreeMin:this.degreeMin,
							degreeMinWithAddCost:this.degreeMinWithAddCost,
							neckSizeMax:this.neckSizeMax,
							neckSizeMin:this.neckSizeMin,
							neckSizeMinWithAddCost:this.neckSizeMinWithAddCost
					};

					// リスト作成
					list.push(cn);
					if(cn.poOptTypeID == amcm_type.AMCM_TYPE_COLLAR_OP1_TYPE){
						collarList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CUFF_TYPE){
						cuffsList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CLERIC_TYPE){
						clericList.push(cn);
						if(cn.armTypeShortFlag != 1){
							clericShortArmList.push(cn);
						}
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_FRONTBODY_TYPE){
						frontTypeList.push(cn);
						if(cn.collorOptTypeHalfFlag == 1){
							frontTypeNomalList.push(cn);
						}
						else{
							frontTypeHalfList.push(cn);
						}
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_BACKBODY_TYPE){
						backTypeList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_AMF_STITCH_OPTION_TYPE){
						amfList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_POCKET_TYPE){
						pocketList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_BUTTON_TYPE){
						buttonList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_BUTTON_HOLE_OPTION_TYPE){
						buttonHoleList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_BUTTON_SUTURE_TYPE){
						buttonThreadList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_INITIAL_OPTION_TYPE){
						//nameList.push(cn);
						if(cn.optHinban != amcm_type.AMCM_VAL_INITIAL_OPTION_TYPE_NOT_EXIST){
							// 2015/9/1 T140対応：イニシャル選択削除
							nameList.push(cn);
						}
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_FORM_TYPE){
						nameTypeList.push(cn);
						if(cn.optHinban == amcm_type.AMCM_VAL_FORM_TYPE_CURSIVE){
							// フルネームの際は筆記体のみ
							nameTypeFullList.push(cn);
						}
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_INITIAL_AREA_TYPE){
						namePlaceList.push(cn);
						if(cn.armTypeShortFlag != 1){
							namePlaceShortArmList.push(cn);
						}
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_COLOR_TYPE){
						nameColorList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_BODY_FORM_TYPE){
						bodyList.push(_this.setCostDisp(cn));
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_NECK_SIZE_TYPE){
						neckList.push(_this.setCostDisp(cn));
						if(cn.cost == 0){
							neckFreeList.push(_this.setCostDisp(cn));
						}
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_DEGREE_LEFT_TYPE){
						armLeftList.push(_this.setCostDisp(cn));
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_DEGREE_RIGHT_TYPE){
						armRigthList.push(_this.setCostDisp(cn));
					}
				});


				_this.setSelList($("#ca_S_collarSel"), collarList);
				_this.setSelList($("#ca_S_cuffsSel"), cuffsList);
				_this.setSelList($("#ca_S_clericSel"), clericList);
				//_this.setSelList($("#ca_S_frontSel"), frontTypeList);
				_this.setSelList($("#ca_S_frontSel"), frontTypeNomalList);
				_this.setSelList($("#ca_S_backSel"), backTypeList);
				_this.setSelList($("#ca_S_amfSel"), amfList);
				_this.setSelList($("#ca_S_pocketSel"), pocketList);
				_this.setSelList($("#ca_S_buttonSel"), buttonList);
				_this.setSelList($("#ca_S_buttonHoleSel"), buttonHoleList);
				_this.setSelList($("#ca_S_buttonThreadSel"), buttonThreadList);
				_this.setSelList($("#ca_S_name"), nameList);
				_this.setSelList($("#ca_S_nameTypeSel"), nameTypeList);
				_this.setSelList($("#ca_S_namePlaceSel"), namePlaceList);
				_this.setSelList($("#ca_S_nameColorSel"), nameColorList);
				_this.setSelList($("#ca_S_bodySel"), bodyList);
				//_this.setSelList($("#ca_S_neckSel"), neckList);
				_this.setSelList($("#ca_S_neckSel"), neckFreeList);
				_this.setSelList($("#ca_S_armLeftSel"), armLeftList);
				_this.setSelList($("#ca_S_armRigthSel"), armRigthList);

				_this.collarList  = collarList;
				_this.cuffsList  = cuffsList;
				_this.clericList  = clericList;
				_this.clericShortArmList  = clericShortArmList;
				_this.frontTypeList  = frontTypeList;
				_this.frontTypeNomalList  = frontTypeNomalList;
				_this.frontTypeHalfList  = frontTypeHalfList;
				_this.backTypeList  = backTypeList;
				_this.amfList  = amfList;
				_this.pocketList  = pocketList;
				_this.buttonList  = buttonList;
				_this.buttonHoleList  = buttonHoleList;
				_this.buttonThreadList  = buttonThreadList;
				_this.nameList  = nameList;
				_this.nameTypeList  = nameTypeList;
				_this.nameTypeFullList  = nameTypeFullList;
				_this.namePlaceList  = namePlaceList;
				_this.namePlaceShortArmList  = namePlaceShortArmList;
				_this.nameColorList  = nameColorList;
				_this.bodyList  = bodyList;
				_this.neckList  = neckList;
				_this.neckFreeList  = neckFreeList;
				_this.armLeftList  = armLeftList;
				_this.armRigthList  = armRigthList;
			}
			// オプションがなかったらdisabledにする処理
			_this.chkS_OptUse(list, comData);
			if(loadFlag == true){
				if(_this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						|| _this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					// 削除・参照の際はもう一回全領域に編集不可処理(上記で編集可能判定のものが生きてしまうため)
					_this.setReadOnlyAllItems(true);
				}
			}
			// 持ち回りリスト設定
			_this.optionList = list;
		},
		// セレクターオプションに価格表示
		setCostDisp:function(cn){
			//var disp = cn.name;
			if(cn.cost > 0){
				cn.name = cn.name + "(" + clutil.comma(cn.cost) + "円)";
			}
			return cn;
		},
		chkS_OptUse:function(list, comData){
			var _this = this;

			// オプション有無フラグ
			// ジャケット
			var f_collarSel = false;
			var f_miter = false;
			var f_collarType = false;
			var f_cuffsType = false;
			var f_cuffsSel = false;
			var f_clericSel = false;
			var f_frontSel = false;
			var f_backSel = false;
			var f_amfSel = false;
			var f_pocketSel = false;
			var f_buttonSel = false;
			var f_buttonHoleSel = false;
			var f_buttonThreadSel = false;
			var f_name = false;
			var f_nameTypeSel = false;
			var f_namePlaceSel = false;
			var f_nameColorSel = false;
			var f_sewingType = false;
			var f_pocketChiefType = false;
			var f_bodySel = false;
			var f_neckSel = false;
			var f_armLeftSel = false;
			var f_armRigthSel = false;



			$.each(list, function() {
				var cn = {
						poOptTypeID:this.poOptTypeID
				};
				// 編集判定
				if(cn.poOptTypeID == amcm_type.AMCM_TYPE_COLLAR_OP1_TYPE){
					f_collarSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_COLLAR_OP2_TYPE){
					f_miter = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_INTERFACING_TYPE){
					f_collarType = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_ARM_TYPE){
					f_cuffsType = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CUFF_TYPE){
					f_cuffsSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CLERIC_TYPE){
					f_clericSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_FRONTBODY_TYPE){
					f_frontSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_BACKBODY_TYPE){
					f_backSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_AMF_STITCH_OPTION_TYPE){
					f_amfSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_POCKET_TYPE){
					f_pocketSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_BUTTON_TYPE){
					f_buttonSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_BUTTON_HOLE_OPTION_TYPE){
					f_buttonHoleSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_BUTTON_SUTURE_TYPE){
					f_buttonThreadSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_SHIRT_NAME_TYPE){
					f_name = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_FORM_TYPE){
					f_nameTypeSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_INITIAL_AREA_TYPE){
					f_namePlaceSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_COLOR_TYPE){
					f_nameColorSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_POCKET_SQUARE_TYPE){
					f_sewingType = true;
					f_pocketChiefType = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_BODY_FORM_TYPE){
					f_bodySel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_NECK_SIZE_TYPE){
					f_neckSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_DEGREE_LEFT_TYPE){
					f_armLeftSel = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_DEGREE_RIGHT_TYPE){
					f_armRigthSel = true;
				}
			});

			// 編集領域指定
			_this.setDisableOptDiv(f_collarSel, $("#ca_S_collarSelDiv"), {S_collarSel:0});
			_this.setDisableOptDiv(f_miter, $("#ca_S_miterDiv"), {S_miter:0});
			_this.setDisableOptDiv(f_collarType, $("#ca_S_collarTypeDiv"), {S_collarType:0});
			_this.setDisableOptDiv(f_cuffsType, $("#ca_S_cuffsTypeDiv"), {S_cuffsType:1});
			_this.setDisableOptDiv(f_cuffsSel, $("#ca_S_cuffsDiv"), {S_cuffsSel:0});
			_this.setDisableOptDiv(f_clericSel, $("#ca_S_clericSelDiv"), {S_clericSel:0});
			_this.setDisableOptDiv(f_frontSel, $("#ca_S_frontSelDiv"), {S_frontSel:0});
			_this.setDisableOptDiv(f_backSel, $("#ca_S_backSelDiv"), {S_backSel:0});
			_this.setDisableOptDiv(f_amfSel, $("#ca_S_amfDiv"), {S_amfSel:0});
			_this.setDisableOptDiv(f_pocketSel, $("#ca_S_pocketSelDiv"), {S_pocketSel:0});
			_this.setDisableOptDiv(f_buttonSel, $("#ca_S_buttonSelDiv"), {S_buttonSel:0});
			_this.setDisableOptDiv(f_buttonHoleSel, $("#ca_S_buttonHoleSelDiv"), {S_buttonHoleSel:0});
			_this.setDisableOptDiv(f_buttonThreadSel, $("#ca_S_buttonThreadSelDiv"), {S_buttonThreadSel:0});
			_this.setDisableOptDiv(f_name, $("#ca_S_name"), {S_name:0});
			_this.setDisableOptDiv(f_nameTypeSel, $("#ca_S_nameTypeDiv"), {S_nameTypeSel:0});
			_this.setDisableOptDiv(f_namePlaceSel, $("#ca_S_namePlaceDiv"), {S_namePlaceSel:0});
			_this.setDisableOptDiv(f_nameColorSel, $("#ca_S_nameColorDiv"), {S_nameColorSel:0});
			_this.setDisableOptDiv(f_sewingType, $("#ca_S_sewingTypeDiv"), {S_sewingType:0});
			_this.setDisableOptDiv(f_pocketChiefType, $("#ca_S_pocketChiefTypeDiv"), {S_pocketChiefType:0});
			_this.setDisableOptDiv(f_bodySel, $("#ca_S_bodySelDiv"), {S_bodySel:0});
			_this.setDisableOptDiv(f_neckSel, $("#ca_S_neckSelDiv"), {S_neckSel:0});
			_this.setDisableOptDiv(f_armLeftSel, $("#ca_S_armLeftSelDiv"), {S_armLeftSel:0});
			_this.setDisableOptDiv(f_armRigthSel, $("#ca_S_armRigthSelDiv"), {S_armRigthSel:0});

		},
		// 指定されたオプションdivを触れなくする
		setDisableOptDiv:function(flag, $el, obj){
			if(flag == false){
				// 値の初期化
				clutil.data2view($el, obj);
				clutil.viewReadonly($el);
			}
			else{
				clutil.viewRemoveReadonly($el);
			}
		},
		// ラジオ付属のセレクター処理
		setDisableOptSelElem:function(flag, list, $div, $sel){
			if(flag == false || list == undefined || list.length == 0){
				$div.hide();
				$sel.removeClass("cl_required");
			}
			else{
				this.setSelList($sel, list);
				clutil.viewRemoveReadonly($div);
			}
		},
		// 指定されたオプションdivを隠す
		setHideOptDiv:function(flag, $el, obj){
			if(flag == false){
				// 値の初期化
				clutil.data2view($el, obj);
				$el.hide();
			}
			else{
				$el.show();
			}
		},





		/**
		 * メンズジャケット：ボタン変更ラジオ変更
		 */
		_onM_jk_ChangeButtonTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_M_jk_changeButtonType]:checked").val();
			}

			if(val == 0){
				$("#ca_M_jk_changeButtonSelDiv").hide();
				$("#ca_M_jk_changeButtonSel").removeClass("cl_required");
			}
			else{
				$("#ca_M_jk_changeButtonSelDiv").show();
				$("#ca_M_jk_changeButtonSel").addClass("cl_required");
			}
		},
		/**
		 * メンズジャケット：裏地変更ラジオ変更
		 */
		_onM_jk_ChangeLiningTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_M_jk_changeLiningType]:checked").val();
			}

			if(val == 0){
				$("#ca_M_jk_changeLiningSelDiv").hide();
				$("#ca_M_jk_changeLiningSel").removeClass("cl_required");
			}
			else{
				$("#ca_M_jk_changeLiningSelDiv").show();
				$("#ca_M_jk_changeLiningSel").addClass("cl_required");
			}
		},
		/**
		 * メンズジャケット：裏仕様変更ラジオ変更
		 */
		_onM_jk_liningTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			var chkSummer = this.chkSummerOptFlag();
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_M_jk_liningType]:checked").val();
			}

			if(val == amcm_type.AMCM_VAL_BACK_FABRIC_TYPE_LINING || chkSummer == false){
				// 総裏 or オプションリストにサマーがないときはサマー仕様不可
				var obj = {
						M_jk_summerType:0
				};
				clutil.viewReadonly($("#ca_M_jk_summerTypeDiv"));
				clutil.data2view($("#ca_M_jk_summerTypeDiv"), obj);
				this.getArrivalDate(false, amcm_type.AMCM_VAL_PO_CLASS_MENS, null, null);
			}
			else{
				clutil.viewRemoveReadonly($("#ca_M_jk_summerTypeDiv"));
			}
		},
		chkSummerOptFlag:function(){
			var flag = false;
			var list = this.optionList;
			var i = 0;
			for(i=0; i<list.length; i++){
				if(list[i].poOptTypeID == amcm_type.AMCM_TYPE_SUMMAR_SPEC_TYPE
						&& list[i].styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
					// オプションリストにサマー仕様がある
					flag = true;
					break;
				}
			}
			return flag;
		},
		/**
		 * メンズジャケット：サマー仕様変更ラジオ変更
		 */
		_onM_jk_summerTypeToggle: function(){
			this.getArrivalDate(false, amcm_type.AMCM_VAL_PO_CLASS_MENS, null, null);
		},
		/**
		 * メンズベスト：ボタン変更ラジオ変更
		 */
		_onM_ve_ChangeButtonTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_M_ve_changeButtonType]:checked").val();
			}

			if(val == 0){
				$("#ca_M_ve_changeButtonSelDiv").hide();
				$("#ca_M_ve_changeButtonSel").removeClass("cl_required");
			}
			else{
				$("#ca_M_ve_changeButtonSelDiv").show();
				$("#ca_M_ve_changeButtonSel").addClass("cl_required");
			}
		},
		/**
		 * メンズベスト：裏地変更ラジオ変更
		 */
		_onM_ve_ChangeLiningTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_M_ve_changeLiningType]:checked").val();
			}

			if(val == 0){
				$("#ca_M_ve_changeLiningSelDiv").hide();
				$("#ca_M_ve_changeLiningSel").removeClass("cl_required");
			}
			else{
				$("#ca_M_ve_changeLiningSelDiv").show();
				$("#ca_M_ve_changeLiningSel").addClass("cl_required");
			}
		},
		/**
		 * メンズスラックス：スペア変更ラジオ変更
		 */
		_onM_sl_SpareTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			var valBottom = 0;
			var valSBottom = 0;
			if(loadFlag == true){
				val = loadVal.M_sl_spareType;
				valBottom = loadVal.M_sl_bottomType;
				valSBottom = loadVal.M_sl_bottomSpareType;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_M_sl_spareType]:checked").val();
				valBottom = $("input:radio[name=ca_M_sl_bottomType]:checked").val();
				valSBottom = $("input:radio[name=ca_M_sl_bottomSpareType]:checked").val();
			}

			if(val == amcm_type.AMCM_VAL_SPARE_TYPE_NOT_EXIST){
				// スペアあり
				$(".ca_M_sl_SpareDiv").hide();
				if(valBottom == amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE){
					// 丈上げなし
					$(".ca_M_sl_lengthDiv").hide();
					$(".ca_M_sl_lengthrequired").removeClass("cl_required");
				}
			}
			else{
				// スペアなし
				$(".ca_M_sl_SpareDiv").show();
				if(valSBottom != amcm_type.AMCM_VAL_SPARE_TYPE_EXIST){
					$("#ca_M_sl_bottomSpareSliderDiv").hide();
				}
				if(valSBottom != amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE){
					$(".ca_M_sl_lengthDiv").show();
					$(".ca_M_sl_lengthrequired").addClass("cl_required");
				}
			}
		},
		/**
		 * メンズスラックス：裾仕上げ変更ラジオ変更
		 */
		_onM_sl_BottomTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			var valS = 0;
			var Spare = 0;
			if(loadFlag == true){
				val = loadVal.M_sl_bottomType;
				valS = loadVal.M_sl_bottomSpareType;
				Spare = loadVal.M_sl_spareType;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_M_sl_bottomType]:checked").val();
				valS = $("input:radio[name=ca_M_sl_bottomSpareType]:checked").val();
				Spare = $("input:radio[name=ca_M_sl_spareType]:checked").val();
			}

			if(val == amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE){
				$("#ca_M_sl_bottomSliderDiv").hide();
				if(Spare == amcm_type.AMCM_VAL_SPARE_TYPE_NOT_EXIST
						|| (valS == amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE)){
					// スペアなし&丈上げなし
					$(".ca_M_sl_lengthDiv").hide();
					$(".ca_M_sl_lengthrequired").removeClass("cl_required");
				}
			}
			else if(val == amcm_type.AMCM_VAL_COATTAIL_TYPE_DOUBLE ){
				// ダブル
				$("#ca_M_sl_bottomSliderDiv").show();
				$(".ca_M_sl_lengthDiv").show();
				$(".ca_M_sl_lengthrequired").addClass("cl_required");
			}
			else{
				$("#ca_M_sl_bottomSliderDiv").hide();
				$(".ca_M_sl_lengthDiv").show();
				$(".ca_M_sl_lengthrequired").addClass("cl_required");
			}
		},
		/**
		 * メンズスラックス：スペア裾仕上げ変更ラジオ変更
		 */
		_onM_sl_BottomSpareTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			var valS = 0;
			if(loadFlag == true){
				val = loadVal.M_sl_bottomType;
				valS = loadVal.M_sl_bottomSpareType;
				Spare = loadVal.M_sl_spareType;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_M_sl_bottomType]:checked").val();
				valS = $("input:radio[name=ca_M_sl_bottomSpareType]:checked").val();
				Spare = $("input:radio[name=ca_M_sl_spareType]:checked").val();
			}

			if(Spare == amcm_type.AMCM_VAL_SPARE_TYPE_EXIST){
				if(valS == amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE){
					$("#ca_M_sl_bottomSpareSliderDiv").hide();
					if(val == amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE){
						$(".ca_M_sl_lengthDiv").hide();
						$(".ca_M_sl_lengthrequired").removeClass("cl_required");
					}
				}
				else if(valS == amcm_type.AMCM_VAL_COATTAIL_TYPE_DOUBLE){
					$("#ca_M_sl_bottomSpareSliderDiv").show();
					$(".ca_M_sl_lengthDiv").show();
					$(".ca_M_sl_lengthrequired").addClass("cl_required");
				}
				else{
					$("#ca_M_sl_bottomSpareSliderDiv").hide();
					$(".ca_M_sl_lengthDiv").show();
					$(".ca_M_sl_lengthrequired").addClass("cl_required");
				}
			}
		},
		/**
		 * メンズスラックス：ボタン変更ラジオ変更
		 */
		_onM_sl_ChangeButtonTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_M_sl_changeButtonType]:checked").val();
			}

			if(val == 0){
				$("#ca_M_sl_changeButtonSelDiv").hide();
				$("#ca_M_sl_changeButtonSel").removeClass("cl_required");
			}
			else{
				$("#ca_M_sl_changeButtonSelDiv").show();
				$("#ca_M_sl_changeButtonSel").addClass("cl_required");
			}
		},
		/**
		 * ネーム変更
		 */
		_onM_jk_ChangeNameSel:function(loadFlag, loadVal){
			var val = $("#ca_M_jk_name").val();
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				val = $("#ca_M_jk_name").val();
			}
			var obj = {
					M_jk_nameMakeType: amcm_type.AMCM_VAL_NAME_TYPE_FACT,
				};

			$(".ca_M_jk_nameDiv").hide();
			$(".ca_M_jk_nameElem").removeClass("cl_required");
			clutil.data2view($("#ca_M_jk_nameInputArea"), {M_jk_nameKanji:"",M_jk_nameFull:"",M_jk_nameIni:""});
			this.validator.clearErrorMsg($('.ca_M_jk_nameElem'));
			if(val == amcm_type.AMCM_VAL_PO_NAME_TYPE_NONE){

			}
			else if(val == amcm_type.AMCM_VAL_PO_NAME_TYPE_KANJI){
				$("#ca_M_jk_nameKanjiDiv").show();
				$("#ca_M_jk_nameMakeTypeDiv").show();
				$("#ca_M_jk_nameKanji").addClass("cl_required");

				clutil.data2view($("#ca_M_jk_nameMakeTypeDiv"), obj);
			}
			else if(val == amcm_type.AMCM_VAL_PO_NAME_TYPE_FULL){
				$("#ca_M_jk_nameFullDiv").show();
				$("#ca_M_jk_nameMakeTypeDiv").show();
				$("#ca_M_jk_nameFull").addClass("cl_required");

				clutil.data2view($("#ca_M_jk_nameMakeTypeDiv"), obj);
			}
			else if(val == amcm_type.AMCM_VAL_PO_NAME_TYPE_INITIAL){
				$("#ca_M_jk_nameIniDiv").show();
				$("#ca_M_jk_nameMakeTypeDiv").show();
				$("#ca_M_jk_nameIni").addClass("cl_required");

				clutil.data2view($("#ca_M_jk_nameMakeTypeDiv"), obj);
			}
		},



		/**
		 * シーズン変更
		 */
		_onM_ChangeSeason:function(){
			if($("#ca_M_season").val() <= 0){
				this.M_lockUnselectSeason();
			}
			else{
				this.M_lockSelectSeason();

				//test
				this.makeClothSel(false, amcm_type.AMCM_VAL_PO_CLASS_MENS, $("#ca_M_cloth"), null, null);
			}
		},
		// シーズン未選択
		M_lockUnselectSeason: function(){
			// 配下を触れないように
			clutil.viewReadonly(this.$(".ca_sesonEffectDiv"));
			this.M_lockUnselectCloth();
			clutil.data2view($("#ca_M_clothArea"), M_ClothClearObj);
		},
		// シーズン変更
		M_lockSelectSeason: function(){
			// 配下を編集可に
			clutil.viewRemoveReadonly(this.$(".ca_sesonEffectDiv"));
			this.M_lockUnselectCloth();
		},

		/**
		 * 生地変更
		 */
		_onM_ChangeCloth:function(){
			var _this = this;
			_this.validator.clearErrorMsg($("#ca_M_cloth"));
			_this.validator.clearErrorMsg($("#ca_M_brand"));


			if($("#ca_M_cloth").val() <= 0){
				// ブランク選択ならリセット
				this.M_lockUnselectCloth();
			}
			else{
				// 現行の値記録
				var cloth = clutil.view2data($("#ca_M_clothArea"));
				var brand = clutil.view2data($("#ca_M_brandArea"));
				var brandSel = this.makeBrandSel(false, 1, $("#ca_M_brand"), null, null);

				$.when(brandSel).done(function(){
					// セレクター作成後、リセット判定
					if(brand.M_brand == null || brand.M_brand <= 0){
						// 既存選択ブランドがない場合はそのまま入力
						clutil.viewRemoveReadonly($(".ca_M_clothEffectDiv"));
						_this.M_setClothOld_Price();

						_this.validator.clearErrorMsg($("#ca_M_cloth"));
						_this.validator.clearErrorMsg($("#ca_M_brand"));
					}
					else {
						var chk = _this.chkM_clothBrandEffect(brand.M_brand);
						if(chk == true){
							// 既存選択ブランドが選択可能
							chk = _this.chkM_priceEffect($("#ca_M_cloth").val(), cloth.M_clothPrice);
							if(chk == true){
								// 既存プライスと同じなのでリセット不要
								clutil.data2view($("#ca_M_brandArea"), brand);
								_this.M_setClothOld_Price();
							}
							else{
								// 既存プライス選択不可のため確認
								clutil.ConfirmDialog("選択済みの生地と異なるプライスラインの生地が選択されました。<br>スタイル以降の内容をリセットします。<br>よろしいですか？"
										, function(_this){
											try{
												// [はい]スタイル以降リセット
												clutil.data2view($("#ca_M_brandArea"), brand);
												_this._onM_ChangeBrand();
												_this.M_setClothOld_Price();
												return;
											}finally{
											}
										}, function(_this){
											console.log('CANCEL', arguments);
											try{
												// [いいえ]旧情報を再表示
												// 旧生地セレクター設定
												var clothOld = $("#ca_M_clothOld").val();
												cloth.M_cloth = clothOld;
												clutil.data2view($("#ca_M_clothArea"), cloth);
												// 旧ブランドセレクター設定
												var brandSel2 = _this.makeBrandSel(false, amcm_type.AMCM_VAL_PO_CLASS_MENS, $("#ca_M_brand"), null, null);
												$.when(brandSel2).done(function(){
													clutil.data2view($("#ca_M_brandArea"), brand);
													clutil.viewRemoveReadonly($(".ca_M_clothEffectDiv"));
													_this.M_setClothOld_Price();
												});
												return;
											}finally{
												// 変更時に赤く残るのリセット
												_this.validator.clearErrorMsg($("#ca_M_cloth"));
												_this.validator.clearErrorMsg($("#ca_M_brand"));
											}
										}, _this);
							}
						}
						else{
							// 既存選択ブランドが存在しない場合は確認ダイアログ
							clutil.ConfirmDialog("選択済みのブランドに未対応の生地が選択されました。<br>ブランド以降の内容をリセットします。<br>よろしいですか？"
									, function(_this){
										try{
											// [はい]ブランド以降リセット
											_this.M_lockSelectCloth();
											return;
										}finally{
										}
									}, function(_this){
										console.log('CANCEL', arguments);
										try{
											// [いいえ]旧情報を再表示
											// 旧生地セレクター設定
											var clothOld = $("#ca_M_clothOld").val();
											cloth.M_cloth = clothOld;
											clutil.data2view($("#ca_M_clothArea"), cloth);
											// 旧ブランドセレクター設定
											var brandSel2 = _this.makeBrandSel(false, amcm_type.AMCM_VAL_PO_CLASS_MENS, $("#ca_M_brand"), null, null);
											$.when(brandSel2).done(function(){
												clutil.data2view($("#ca_M_brandArea"), brand);
												clutil.viewRemoveReadonly($(".ca_M_clothEffectDiv"));
												_this.M_setClothOld_Price();
											});
											return;
										}finally{
										}
									}, _this);
						}
					}
				});
			}
		},
		// 生地変更をしてもブランドが選択可能かチェック
		chkM_clothBrandEffect:function(brand){
			var flag = false;
			var list = this.brandList;
			var i = 0;
			for(i=0; i<list.length; i++){
				if(list[i].id == brand){
					flag = true;
					break;
				}
			}
			return flag;
		},
		// 生地変更をしても同じプライスラインかチェック
		chkM_priceEffect:function(newID, price){
			var flag = false;
			var list = this.clothList;
			var i = 0;
			for(i=0; i<list.length; i++){
				if(list[i].id == newID){
					if(list[i].priceLine == price){
						flag = true;
					}
					break;
				}
			}
			return flag;
		},
		// ウォッシャブルに生地が対応しているか確認
		chkM_clothWashClothEffect:function(clothOld){
			var flag = false;
			var list = this.clothList;
			var i = 0;
			for(i=0; i<list.length; i++){
				if(list[i].id == clothOld){
					flag = true;
					break;
				}
			}
			return flag;
		},
		// ウォッシャブルにスタイルが対応しているか確認
		chkM_clothWashStyleEffect:function(type, tgtID){
			var flag = false;
			if(tgtID == 0 || tgtID == null || tgtID == undefined){
				flag = true;
			}
			else{
				var stFlag = clutil.view2data($("#ca_M_stArea")).M_st;
				var jkFlag = clutil.view2data($("#ca_M_jkArea")).M_jk;
				var slFlag = clutil.view2data($("#ca_M_slArea")).M_sl;
				var veFlag = clutil.view2data($("#ca_M_veArea")).M_ve;

				var list = [];
				if(type == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
					if(stFlag == 1){
						list = this.styleStList;
					}
					else if(jkFlag == 1){
						list = this.styleJkList;
					}
					else{
						flag = true;
						return flag;
					}
				}
				else if(type == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
					if(slFlag == 1){
						list = this.styleSlList;
					}
					else{
						flag = true;
						return flag;
					}
				}
				else if(type == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST && veFlag == 1){
					if(veFlag == 1){
						list = this.styleVeList;
					}
					else{
						flag = true;
						return flag;
					}
				}
				var i = 0;
				for(i=0; i<list.length; i++){
					if(list[i].id == tgtID){
						flag = true;
						break;
					}
				}
			}
			return flag;
		},
		M_setClothOld_Price:function(){
			var cloth = $("#ca_M_cloth").val();
			$("#ca_M_clothOld").val(cloth);

			var list = this.clothList;
			var i = 0;
			var price = 0;
			for(i=0; i<list.length; i++){
				if(list[i].id == cloth){
					price = list[i].priceLine;
					break;
				}
			}
			$("#ca_M_clothPrice").val(price);
		},
		M_lockUnselectCloth: function(){
			// 配下を触れないように
			clutil.viewReadonly(this.$(".ca_M_clothEffectDiv"));
			this.M_lockUnselectBrand();
			clutil.data2view($("#ca_M_brandArea"), M_BrandClearObj);
			$("#ca_M_clothOld").val(0);
			$("#ca_M_clothPrice").val(0);
		},
		M_lockSelectCloth: function(){
			// 配下を編集可に
			clutil.viewRemoveReadonly(this.$(".ca_M_clothEffectDiv"));
			this.M_lockUnselectBrand();
			this.M_setClothOld_Price();
		},


		/**
		 * ブランド変更
		 */
		_onM_ChangeBrand:function(){
			if($("#ca_M_brand").val() <= 0){
				this.M_lockUnselectBrand();
			}
			else{
				this.getArrivalDate(false, amcm_type.AMCM_VAL_PO_CLASS_MENS, null, null);
				this.makeStyleSel(false, amcm_type.AMCM_VAL_PO_CLASS_MENS);
				this.makeStyleOptSel(false, amcm_type.AMCM_VAL_PO_CLASS_MENS, TYPE.ALL, null, null, null);
				this.M_lockSelectBrand();
			}
		},
		M_lockUnselectBrand: function(){
			// 配下を触れないように
			clutil.viewReadonly(this.$(".ca_M_brandEffectDiv"));
			this.M_lockUnselectJkStyle();
			this.M_lockUnselectSlStyle();
			this.M_lockUnselectVeStyle();
			clutil.data2view($("#ca_M_jk_styleArea"), M_jkStyleClearObj);
			clutil.data2view($("#ca_M_sl_styleArea"), M_slStyleClearObj);
			clutil.data2view($("#ca_M_ve_styleArea"), M_veStyleClearObj);
			this.setArrivalDate(-1, false);
		},
		M_lockSelectBrand: function(){
			// 配下を編集可に
			clutil.viewRemoveReadonly(this.$(".ca_M_brandEffectDiv"));
			this.M_lockUnselectJkStyle();
			this.M_lockUnselectSlStyle();
			this.M_lockUnselectVeStyle();
		},
		chkBrandEffect:function(type, selID){
			var list = this.brandList;
			var i = 0;
			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				clutil.viewReadonly(this.$(".ca_M_brandFlagEffectDiv"));
				this.disabledSlider($('#ca_M_jk_trunk_slider'), $('#ca_M_jk_trunk_SliderDot'));
				this.disabledSlider($('#ca_M_ve_trunk_slider'), $('#ca_M_ve_trunk_SliderDot'));
				for(i=0; i<list.length; i++){
					if(list[i].id == selID){
						if(list[i].amfFlag == 1){
							clutil.viewRemoveReadonly(this.$(".ca_M_amfFlagEffectDiv"));
						}
						if(list[i].liningFlag == 1){
							clutil.viewRemoveReadonly(this.$(".ca_M_liningFlagEffectDiv"));
						}
						else if(list[i].liningFlag == 2){
							clutil.viewRemoveReadonly(this.$(".ca_M_liningFlagEffectDiv"));
							clutil.viewReadonly(this.$("#ca_M_jk_liningTypeKannon"));
						}
						if(list[i].pocketFlag == 1){
							clutil.viewRemoveReadonly(this.$(".ca_M_pocketEffectDiv"));
						}
						if(list[i].buttonFlag == 1){
							clutil.viewRemoveReadonly(this.$(".ca_M_buttonEffectDiv"));
						}
						if(list[i].trunkFlag == 1){
							clutil.viewRemoveReadonly(this.$(".ca_M_trunkEffectDiv"));
							this.abledSlider($('#ca_M_jk_trunk_slider'), $('#ca_M_jk_trunk_SliderDot'));
						}
						else{
							$("#ca_M_jk_trunk_slider").slider("value" , 0);
							$("#ca_M_jk_trunk").val(0);
						}
						if(list[i].vestTrunkFlag == 1){
							clutil.viewRemoveReadonly(this.$(".ca_M_vestTrunkEffectDiv"));
							this.abledSlider($('#ca_M_ve_trunk_slider'), $('#ca_M_ve_trunk_SliderDot'));
						}
						else{
							$("#ca_M_ve_trunk_slider").slider("value" , 0);
							$("#ca_M_ve_trunk").val(0);
						}
					}
				}
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){

			}
			else{

			}
		},


		/**メンズジャケットスタイル変更*/
		_onM_jk_ChangeStyle:function(){
			if($("#ca_M_jk_style").val() <= 0){
				this.M_lockUnselectJkStyle();
			}
			else{
				var style = $("#ca_M_jk_style").val();
				this.M_lockselectJkStyle();
				this.make_M_Size1(false, style, TYPE.JK, $("#ca_M_jk_size1"), null);
				if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_MENS, $("#ca_M_brand").val());
				}
				// サマー仕様確認
				var liningVal = $("input:radio[name=ca_M_jk_liningType]:checked").val();
				this._onM_jk_liningTypeToggle(null, true, liningVal);
			}
		},
		M_lockUnselectJkStyle: function(){
			// スタイル配下を触れないように
			clutil.viewReadonly(this.$("#ca_M_jkOptDiv"));
			this.disabledSlider_M_jk();
			// オプションクリア
			this.M_jkOptClear();
		},
		M_lockselectJkStyle: function(){
			// スタイル配下を編集可に
			clutil.viewRemoveReadonly(this.$("#ca_M_jkOptDiv"));
			this.abledSlider_M_jk();
			// サイズ2は触れない
			clutil.viewReadonly(this.$("#ca_M_jk_size2Area"));
			// オプションクリア
			this.M_jkOptClear();
			// オプションの編集可不可指定
			var comData =  clutil.view2data($('#ca_brandArea'));
			// スーツかジャケットか判定
			var stFlag = clutil.view2data(this.$('#ca_M_stArea')).M_st;
			var type = 0;
			if(stFlag == 1){
				type = TYPE.ST;
			}
			else{
				type = TYPE.JK;
			}
			this.chkM_OptUse(this.optionList, comData, type);
		},
		/**メンズジャケットサイズ1変更*/
		_onM_jk_ChangeSize1:function(){
			if($("#ca_M_jk_size1").val() <= 0){
				clutil.viewReadonly(this.$("#ca_M_jk_size2Area"));
				clutil.data2view($("#ca_M_jk_size2Area"), M_jkSize2ClearObj);
			}
			else{
				var size1 = $("#ca_M_jk_size1").val();
				clutil.viewRemoveReadonly(this.$("#ca_M_jk_size2Area"));
				this.make_M_Size2(false, size1, TYPE.JK, $("#ca_M_jk_size2"));
			}
		},


		/**メンズスラックススタイル変更*/
		_onM_sl_ChangeStyle:function(){
			if($("#ca_M_sl_style").val() <= 0){
				this.M_lockUnselectSlStyle();
			}
			else{
				var style = $("#ca_M_sl_style").val();
				this.M_lockselectSlStyle();
				this.make_M_Size1(false, style, TYPE.SL, $("#ca_M_sl_size1"), null);
				if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_MENS, $("#ca_M_brand").val());
				}
			}
		},
		M_lockUnselectSlStyle: function(){
			// スタイル配下を触れないように
			clutil.viewReadonly(this.$("#ca_M_slOptDiv"));
			this.disabledSlider_M_sl();
			// オプションクリア
			this.M_slOptClear();
		},
		M_lockselectSlStyle: function(){
			// スタイル配下を編集可に
			clutil.viewRemoveReadonly(this.$("#ca_M_slOptDiv"));
			this.abledSlider_M_sl();
			// サイズ2は触れない
			clutil.viewReadonly(this.$("#ca_M_sl_size2Area"));
			// オプションクリア
			this.M_slOptClear();
			// オプションの編集可不可指定
			var comData =  clutil.view2data($('#ca_brandArea'));
			this.chkM_OptUse(this.optionList, comData, TYPE.SL);
		},
		/**メンズスラックスサイズ1変更*/
		_onM_sl_ChangeSize1:function(){
			if($("#ca_M_sl_size1").val() <= 0){
				clutil.viewReadonly(this.$("#ca_M_sl_size2Area"));
				clutil.data2view($("#ca_M_sl_size2Area"), M_slSize2ClearObj);
			}
			else{
				var size1 = $("#ca_M_sl_size1").val();
				clutil.viewRemoveReadonly(this.$("#ca_M_sl_size2Area"));
				this.make_M_Size2(false, size1, TYPE.SL, $("#ca_M_sl_size2"));
			}
		},


		/**メンズベストスタイル変更*/
		_onM_ve_ChangeStyle:function(){
			if($("#ca_M_ve_style").val() <= 0){
				this.M_lockUnselectVeStyle();
			}
			else{
				var style = $("#ca_M_ve_style").val();
				this.M_lockselectVeStyle();
				this.make_M_Size1(false, style, TYPE.VE, $("#ca_M_ve_size1"), null);
				if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_MENS, $("#ca_M_brand").val());
				}
			}
		},
		M_lockUnselectVeStyle: function(){
			// スタイル配下を触れないように
			clutil.viewReadonly(this.$("#ca_M_veOptDiv"));
			this.disabledSlider_M_ve();
			// オプションクリア
			this.M_veOptClear();
		},
		M_lockselectVeStyle: function(){
			// スタイル配下を編集可に
			clutil.viewRemoveReadonly(this.$("#ca_M_veOptDiv"));
			this.abledSlider_M_ve();
			// サイズ2は触れない
			clutil.viewReadonly(this.$("#ca_M_ve_size2Area"));
			// オプションクリア
			this.M_veOptClear();
			// オプションの編集可不可指定
			var comData =  clutil.view2data($('#ca_brandArea'));
			this.chkM_OptUse(this.optionList, comData, TYPE.VE);
		},
		/**メンズベストサイズ1変更*/
		_onM_ve_ChangeSize1:function(){
			if($("#ca_M_ve_size1").val() <= 0){
				clutil.viewReadonly(this.$("#ca_M_ve_size2Area"));
				clutil.data2view($("#ca_M_ve_size2Area"), M_veSize2ClearObj);
			}
			else{
				var size1 = $("#ca_M_ve_size1").val();
				clutil.viewRemoveReadonly(this.$("#ca_M_ve_size2Area"));
				this.make_M_Size2(false, size1, TYPE.VE, $("#ca_M_ve_size2"));
			}
		},


		/**メンズジャケットオプションクリア*/
		M_jkOptClear:function(initFlag){
			// スライダ値保持
			var slidearmLVal = $('#ca_M_jk_armLeft').val();
			var slidearmRVal = $('#ca_M_jk_armRigth').val();
			var slideLengthVal = $('#ca_M_jk_length').val();
			var slideTrankVal = $('#ca_M_jk_trunk').val();
			// 空要素
			clutil.data2view($('#ca_M_jkOptDiv'), M_jkOptClearObj);
			if(initFlag != true){
				// スライダ再指定
				$('#ca_M_jk_armLeft').val(slidearmLVal);
				$('#ca_M_jk_armRigth').val(slidearmRVal);
				$('#ca_M_jk_length').val(slideLengthVal);
				$('#ca_M_jk_trunk').val(slideTrankVal);
			}
			//オプション配下の要素隠し
			$(".ca_M_jkOptElem").hide();
			$(".cl_M_jkOptrequired").removeClass("cl_required");
		},
		/**メンズスラックスオプションクリア*/
		M_slOptClear:function(initFlag){
			// スライダ値保持
			var slideDoubleVal = $('#ca_M_sl_bottom').val();
			var slideDoubleSpareVal = $('#ca_M_sl_bottomSpare').val();
			var slideWaistVal = $('#ca_M_sl_weist').val();
			// 空要素
			clutil.data2view($('#ca_M_slOptDiv'), M_slOptClearObj);
			if(initFlag != true){
				// スライダーは残す
				$('#ca_M_sl_bottom').val(slideDoubleVal);
				$('#ca_M_sl_bottomSpare').val(slideDoubleSpareVal);
				$('#ca_M_sl_weist').val(slideWaistVal);
			}
			//オプション配下の要素隠し
			$(".ca_M_slOptElem").hide();
			// 丈上股下表示
			$(".ca_M_sl_lengthDiv").show();
			$(".cl_M_slOptrequired").removeClass("cl_required");
			$(".ca_M_sl_lengthrequired").addClass("cl_required");
		},
		/**メンズベストオプションクリア*/
		M_veOptClear:function(iniFlag){
			// スライダ値保持
			var slideTrankVal = $('#ca_M_ve_trunk').val();
			// 空要素
			clutil.data2view($('#ca_M_veOptDiv'), M_veOptClearObj);
			if(iniFlag != true){
				$('#ca_M_ve_trunk').val(slideTrankVal);
				// スライダーリセット
				//$(".ca_M_veSlider").slider("value" , 0);
			}
			//オプション配下の要素隠し
			$(".ca_M_veOptElem").hide();
			$(".cl_M_veOptrequired").removeClass("cl_required");
		},






		/**
		 * レディスブランド変更
		 */
		_onL_ChangeBrand:function(){
			if($("#ca_L_brand").val() <= 0){
				this.L_lockUnselectBrand();
			}
			else{
				this.L_lockselectBrand();
				this.makeClothSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_cloth"), null, null);
			}
		},
		L_lockUnselectBrand:function(){
			// 配下を触れないように
			clutil.viewReadonly(this.$(".ca_L_brandEffectDiv"));
			this.L_lockUnselectCloth();
			clutil.data2view($("#ca_L_brandArea"), L_BrandClearObj);
		},
		L_lockselectBrand:function(){
			// 配下を編集可に
			clutil.viewRemoveReadonly(this.$(".ca_L_brandEffectDiv"));
			this.L_lockUnselectCloth();
		},

		/**
		 * レディス生地変更
		 */
		_onL_ChangeCloth:function(){
			if($("#ca_L_cloth").val() <= 0){
				this.setArrivalDate(-1, false);
				this.L_lockUnselectCloth();
				this.setL_brandID(0);
			}
			else{
				this.getArrivalDate(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, null, null);
				this.L_lockSelectCloth();
				this.setL_brandID($("#ca_L_cloth").val());
				this.L_makeStyleSel(false, null, null);
				//this.makeStyleOptSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.ALL, null, null);

				// 2016/1/26 PRS追加削除
				// 2015/12/9 STB追加対応
				// スタイリッシュブラック固有領域の表示
//				var f_STB = this.chkL_modelSTB($("#ca_L_jkSel").val());
//				this.setSTBArea(f_STB, true, null);
				// 2015/12/9 STB追加対応 ここまで
			}
		},
		// 生地IDから親ブランドID取得
		setL_brandID:function(id){
			var list = this.clothList;
			var i = 0;
			var brandID = 0;
			for(i=0; i<list.length; i++){
				if(list[i].id == id){
					brandID = list[i].parentBrandID;
					break;
				}
			}
			clutil.data2view($("#ca_L_brandDiv"), {L_brand:brandID});
			this.getArrivalDate(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, null, null);
		},
		L_lockUnselectCloth: function(){
			// 配下を触れないように
			clutil.viewReadonly(this.$(".ca_L_clothEffectDiv"));
			this.L_lockUnselectJkStyle();
			this.L_lockUnselectSkStyle();
			this.L_lockUnselectSlStyle();
			this.L_lockUnselectVeStyle();
			clutil.data2view($("#ca_L_clothArea"), L_ClothClearObj);
			clutil.data2view($("#ca_L_jk_styleArea"), L_jkStyleClearObj);
			clutil.data2view($("#ca_L_sk_styleArea"), L_skStyleClearObj);
			clutil.data2view($("#ca_L_sl_styleArea"), L_slStyleClearObj);
			clutil.data2view($("#ca_L_ve_styleArea"), L_veStyleClearObj);
		},
		L_lockSelectCloth: function(){
			// 配下を編集可に
			clutil.viewRemoveReadonly(this.$(".ca_L_clothEffectDiv"));
			this.L_lockUnselectJkStyle();
			this.L_lockUnselectSkStyle();
			this.L_lockUnselectSlStyle();
			this.L_lockUnselectVeStyle();
		},
		L_makeStyleSel:function(loadFlag, baseObj, otherObj){
			var base = null;
			var other = null;

			if(loadFlag == false){
				base = clutil.view2data(this.$('#ca_baseField'));
				other = clutil.view2data(this.$('#ca_otherField'));
			}
			else{
				base = baseObj;
				other = otherObj;
			}

			var chkJK = 0;
			var chkSK = 0;
			var chkSL = 0;
			var chkVE = 0;
			if(base.L_jk == 1){
				chkJK = TYPE.L_JK;
			}
			if(base.L_sk == 1){
				chkSK = TYPE.L_SK;
			}
			if(base.L_sl == 1){
				chkSL = TYPE.L_SL;
			};
			if(base.L_ve == 1){
				chkVE = TYPE.L_VE;
			}

			var modelJK = base.L_jkSel;
			var modelSK = base.L_skSel;
			var modelSL = base.L_slSel;
			var modelVE = base.L_veSel;

			this.L_setStyleSel(loadFlag, base, other, $("#ca_L_jk_style"), $("#ca_L_jk_styleArea"), chkJK, modelJK);
			this.L_setStyleSel(loadFlag, base, other, $("#ca_L_sk_style"), $("#ca_L_sk_styleArea"), chkSK, modelSK);
			this.L_setStyleSel(loadFlag, base, other, $("#ca_L_sl_style"), $("#ca_L_sl_styleArea"), chkSL, modelSL);
			this.L_setStyleSel(loadFlag, base, other, $("#ca_L_ve_style"), $("#ca_L_ve_styleArea"), chkVE, modelVE);
		},
		L_setStyleSel:function(loadFlag, base, other, $sel, $selArea, chk, model){
			if(model > 0 && chk > 0){
				this.makeStyleSel(loadFlag, amcm_type.AMCM_VAL_PO_CLASS_LADYS
						, base, other, $sel, chk, model);
				clutil.viewRemoveReadonly($selArea);
			}
			else{
				clutil.viewReadonly($selArea);
			}
		},

		/** モデル選択ラジオ変更 T74対応 2015/9/3 藤岡*/
		_onL_ModelTypeToggle:function(e, loadFlag, loadVal){
			// 表示リセット
			if(loadFlag != true){
				this.setArrivalDate(-1, false);
				this.L_lockUnselectBrand();
				this.makeClothSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_cloth"), null, null);
			}

			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_L_modelType]:checked").val();
			}

			if(val == 1){
				// ベーシック・スタイリッシュ
				this.setSelList($('#ca_L_jkSel'), this.modelBASList);
				this.setSelList($('#ca_L_skSel'), this.modelBASList);
				this.setSelList($('#ca_L_slSel'), this.modelBASList);
				// ベストはベーシックしかないので入れ替えはなし
				clutil.viewRemoveReadonly($('#ca_L_veChkDiv'));
			}
			else{
				// プレシャス・スタイリッシュ(ブラック)
				this.setSelList($('#ca_L_jkSel'), this.modelPREList);
				this.setSelList($('#ca_L_skSel'), this.modelPREList);
				this.setSelList($('#ca_L_slSel'), this.modelPREList);
				// ベストはベーシックしかないので入れ替えはなし
				clutil.viewReadonly($('#ca_L_veArea'));
				//ベスト情報リセット
				clutil.data2view(this.$('#ca_L_veArea'), {L_ve:0, L_veSel:0});
				$('#ca_L_veSel').removeClass("cl_required");
				$('.cl_L_ve_required').removeClass("cl_required");
				$('#ca_L_veDiv').hide();
			}

			// 2016/1/26 PRS追加削除
			// 2015/12/9 STB追加対応
			//this.setSTBArea(false, true, null);
			// 2015/12/9 STB追加対応 ここまで
		},
		/** レディスモデル変更*/
		_onL_ChangeModelJK:function(){
			var base = clutil.view2data(this.$('#ca_baseField'));
			//if(base.L_brand <= 0 || base.L_cloth <= 0){
			var other = clutil.view2data(this.$('#ca_otherField'));
			var modelJK = base.L_jkSel;
			var chkJK = 0;

			// 2016/1/26 PRS追加削除
			// 2015/12/9 STB追加対応
			// スタイリッシュブラック固有領域の表示
//			var f_STB = this.chkL_modelSTB(modelJK);
//			this.setSTBArea(f_STB, true, null);
			// 2015/12/9 STB追加対応 ここまで

			if(base.L_cloth <= 0){
				return;
			}

			if(base.L_jk == 1){
				chkJK = TYPE.L_JK;
			}
			this.L_setStyleSel(false, base, other, $("#ca_L_jk_style"), $("#ca_L_jk_styleArea"), chkJK, modelJK);
			this.L_lockUnselectJkStyle();
		},
		_onL_ChangeModelSK:function(){
			var base = clutil.view2data(this.$('#ca_baseField'));
			//if(base.L_brand <= 0 || base.L_cloth <= 0){
			if(base.L_cloth <= 0){
				return;
			}
			var other = clutil.view2data(this.$('#ca_otherField'));
			var modelSK = base.L_skSel;
			var chkSK = 0;
			if(base.L_sk == 1){
				chkSK = TYPE.L_SK;
			}
			this.L_setStyleSel(false, base, other, $("#ca_L_sk_style"), $("#ca_L_sk_styleArea"), chkSK, modelSK);
			this.L_lockUnselectSkStyle();
		},
		_onL_ChangeModelSL:function(){
			var base = clutil.view2data(this.$('#ca_baseField'));
			//if(base.L_brand <= 0 || base.L_cloth <= 0){
			if(base.L_cloth <= 0){
				return;
			}
			var other = clutil.view2data(this.$('#ca_otherField'));
			var modelSL = base.L_slSel;
			var chkSL = 0;
			if(base.L_sl == 1){
				chkSL = TYPE.L_SL;
			}
			this.L_setStyleSel(false, base, other, $("#ca_L_sl_style"), $("#ca_L_sl_styleArea"), chkSL, modelSL);
			this.L_lockUnselectSlStyle();
		},
		_onL_ChangeModelVE:function(){
			var base = clutil.view2data(this.$('#ca_baseField'));
			//if(base.L_brand <= 0 || base.L_cloth <= 0){
			if(base.L_cloth <= 0){
				return;
			}
			var other = clutil.view2data(this.$('#ca_otherField'));
			var modelVE = base.L_veSel;
			var chkVE = 0;
			if(base.L_ve == 1){
				chkVE = TYPE.L_VE;
			}
			this.L_setStyleSel(false, base, other, $("#ca_L_ve_style"), $("#ca_L_ve_styleArea"), chkVE, modelVE);
			this.L_lockUnselectVeStyle();
		},
		/** STBのみの表示項目切替 **/
		// 2016/1/26 PRS追加削除


		/**レディスジャケットスタイル変更*/
		_onL_jk_ChangeStyle:function(){
			if($("#ca_L_jk_style").val() <= 0){
				this.L_lockUnselectJkStyle();
			}
			else{
				var style = $("#ca_L_jk_style").val();
				this.makeStyleOptSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_JK, style, null, null);
				this.L_lockselectJkStyle();
				this.make_L_S_Size(false, style, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_JK, $("#ca_L_jk_size"), null);
				if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_brand").val());
				}
				this.disabledSlider($('.ca_L_jk_sizeEffect_slider'), $('.ca_L_jk_sizeEffect_sliderDot'));
			}
		},
		L_lockUnselectJkStyle: function(){
			// スタイル配下を触れないように
			clutil.viewReadonly(this.$("#ca_L_jkOptDiv"));
			this.disabledSlider_L_jk();
			// オプションクリア
			this.L_jkOptClear();
		},
		L_lockselectJkStyle: function(){
			// スタイル配下を編集可に
			clutil.viewRemoveReadonly(this.$("#ca_L_jkOptDiv"));
			this.abledSlider_L_jk();
			// オプションクリア
			this.L_jkOptClear();
			// オプションの編集可不可指定
			comData =  clutil.view2data($('#ca_brandArea'));
			this.chkL_OptUse(this.optionList, comData, TYPE.L_JK);
		},
		/**レディススカートスタイル変更*/
		_onL_sk_ChangeStyle:function(){
			if($("#ca_L_sk_style").val() <= 0){
				this.L_lockUnselectSkStyle();
			}
			else{
				var style = $("#ca_L_sk_style").val();
				this.makeStyleOptSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_SK, style, null, null);
				this.L_lockselectSkStyle();
				this.make_L_S_Size(false, style, amcm_type.AMCM_VAL_PO_CLASS_LADYS
						, TYPE.L_SK, $("#ca_L_sk_size"), null);
				if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_brand").val());
				}
				this.disabledSlider($('.ca_L_sk_sizeEffect_slider'), $('.ca_L_sk_sizeEffect_sliderDot'));
			}
		},
		L_lockUnselectSkStyle: function(){
			// スタイル配下を触れないように
			clutil.viewReadonly(this.$("#ca_L_skOptDiv"));
			this.disabledSlider_L_sk();
			// オプションクリア
			this.L_skOptClear();
		},
		L_lockselectSkStyle: function(){
			// スタイル配下を編集可に
			clutil.viewRemoveReadonly(this.$("#ca_L_skOptDiv"));
			this.abledSlider_L_sk();
			// オプションクリア
			this.L_skOptClear();
			// オプションの編集可不可指定
			comData =  clutil.view2data($('#ca_brandArea'));
			this.chkL_OptUse(this.optionList, comData, TYPE.L_SK);
		},
		/**レディスパンツスタイル変更*/
		_onL_sl_ChangeStyle:function(){
			if($("#ca_L_sl_style").val() <= 0){
				this.L_lockUnselectSlStyle();
			}
			else{
				var style = $("#ca_L_sl_style").val();
				this.makeStyleOptSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_SL, style, null, null);
				this.L_lockselectSlStyle();
				this.make_L_S_Size(false, style, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_SL, $("#ca_L_sl_size"), null);
				if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_brand").val());
				}
			}
		},
		L_lockUnselectSlStyle: function(){
			// スタイル配下を触れないように
			clutil.viewReadonly($("#ca_L_slOptDiv"));
			this.disabledSlider_L_sl();
			// オプションクリア
			this.L_slOptClear();
		},
		L_lockselectSlStyle: function(){
			// スタイル配下を編集可に
			clutil.viewRemoveReadonly(this.$("#ca_L_slOptDiv"));
			this.abledSlider_L_sl();
			// オプションクリア
			this.L_slOptClear();
			// オプションの編集可不可指定
			comData =  clutil.view2data($('#ca_brandArea'));
			this.chkL_OptUse(this.optionList, comData, TYPE.L_SL);
		},
		/**レディスベストスタイル変更*/
		_onL_ve_ChangeStyle:function(){
			if($("#ca_L_ve_style").val() <= 0){
				this.L_lockUnselectVeStyle();
			}
			else{
				var style = $("#ca_L_ve_style").val();
				this.makeStyleOptSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_VE, style, null, null);
				this.L_lockselectVeStyle();
				this.make_L_S_Size(false, style, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_VE, $("#ca_L_ve_size"), null);
				if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_brand").val());
				}
			}
		},
		L_lockUnselectVeStyle: function(){
			// スタイル配下を触れないように
			clutil.viewReadonly(this.$("#ca_L_veOptDiv"));
			this.disabledSlider_L_ve();
			// オプションクリア
			this.L_veOptClear();
		},
		L_lockselectVeStyle: function(){
			// スタイル配下を編集可に
			clutil.viewRemoveReadonly(this.$("#ca_L_veOptDiv"));
			this.abledSlider_L_ve();
			// オプションクリア
			this.L_veOptClear();
			// オプションの編集可不可指定
			comData =  clutil.view2data($('#ca_brandArea'));
			this.chkL_OptUse(this.optionList, comData, TYPE.L_VE);
		},

		/**レディスジャケットオプションクリア*/
		L_jkOptClear:function(iniFlag){
			// スライダ
			var slideArmLVal = $('#ca_L_jk_armLeft').val();
			var slideArmRVal = $('#ca_L_jk_armRight').val();
			var slideLenVal = $('#ca_L_jk_length').val();
			// 空要素
			clutil.data2view($('#ca_L_jkOptDiv'), L_jkOptClearObj);
			if(iniFlag != true){
				// スライダ再指定
				$('#ca_L_jk_armLeft').val(slideArmLVal);
				$('#ca_L_jk_armRight').val(slideArmRVal);
				$('#ca_L_jk_length').val(slideLenVal);
//				// スライダーリセット
//				$(".ca_L_jkSlider").slider("value" , 0);
			}
			//オプション配下の要素隠し
			$(".ca_L_jkOptElem").hide();
			this.L_showJkLenSlider(SLIDER.L_JK_LEN3, 0);
			this.L_showJkArmSlider(SLIDER.L_JK_ARM2, 0, 0);
			$(".cl_L_jkOptrequired").removeClass("cl_required");
		},
		/**レディススカートオプションクリア*/
		L_skOptClear:function(iniFlag){
			// スライダ
			var slideLenVal = $('#ca_L_sk_length').val();
			var slideWaistRVal = $('#ca_L_sk_waist').val();
			// 空要素
			clutil.data2view($('#ca_L_skOptDiv'), L_skOptClearObj);
			if(iniFlag != true){
				$('#ca_L_sk_length').val(slideLenVal);
				$('#ca_L_sk_waist').val(slideWaistRVal);
//				// スライダーリセット
//				$(".ca_L_skSlider").slider("value" , 0);
			}
			//オプション配下の要素隠し
			$(".ca_L_skOptElem").hide();
			this.L_showSkLenSlider(SLIDER.L_SK_LEN2, 0);
			$(".cl_L_skOptrequired").removeClass("cl_required");
		},
		/**レディスパンツオプションクリア*/
		L_slOptClear:function(iniFlag){
			// スライダ
			var slideWaistVal = $('#ca_L_sl_waist').val();
			var slideWidthRVal = $('#ca_L_sl_bottomWidth').val();
			// 空要素
			clutil.data2view($('#ca_L_slOptDiv'), L_slOptClearObj);
			if(iniFlag != true){
				$('#ca_L_sl_waist').val(slideWaistVal);
				$('#ca_L_sl_bottomWidth').val(slideWidthRVal);
//				// スライダーリセット
//				$(".ca_L_slSlider").slider("value" , 0);
			}
			//オプション配下の要素隠し
			$(".ca_L_slOptElem").hide();
			$(".ca_L_sl_lengthDiv").show();
			$(".cl_L_slOptrequired").removeClass("cl_required");
		},
		/**レディスベストオプションクリア*/
		L_veOptClear:function(iniFlag){
			// スライダ
			var slideLenVal = $('#ca_L_ve_length').val();
			// 空要素
			clutil.data2view($('#ca_L_veOptDiv'), L_veOptClearObj);
			if(iniFlag != true){
				$('#ca_L_ve_length').val(slideLenVal);
//				// スライダーリセット
//				$(".ca_L_veSlider").slider("value" , 0);
			}
			//オプション配下の要素隠し
			$(".ca_L_veOptElem").hide();
			$(".cl_L_veOptrequired").removeClass("cl_required");
		},
		L_showJkLenSlider:function(lim, len){
			$(".ca_L_jk_lengthSlider").hide();
			$("#ca_L_jk_length").val(0);

			if(lim > SLIDER.L_JK_LEN2){
				$("#ca_L_jk_length5_sliderArea").show();
				this.makeSlider($("#ca_L_jk_length5_slider"), $("#ca_L_jk_length")
						, len, -5.0, 5.0, 0.5);
			}
			else if(lim > SLIDER.L_JK_LEN1){
				$("#ca_L_jk_length3_sliderArea").show();
				this.makeSlider($("#ca_L_jk_length3_slider"), $("#ca_L_jk_length")
						, len, -3.0, 3.0, 0.5);
			}
			else{
				$("#ca_L_jk_length2_sliderArea").show();
				this.makeSlider($("#ca_L_jk_length2_slider"), $("#ca_L_jk_length")
						, len, -2.0, 2.0, 0.5);
			}
		},
		L_showJkArmSlider:function(lim, armL, armR){
			$(".ca_L_jk_armLeftSlider").hide();
			$(".ca_L_jk_armRightSlider").hide();
			$("#ca_L_jk_armLeft").val(0);
			$("#ca_L_jk_armRight").val(0);

			if(lim > SLIDER.L_JK_ARM1){
				$("#ca_L_jk_armLeft7_sliderArea").show();
				$("#ca_L_jk_armRight7_sliderArea").show();
				this.makeSlider($("#ca_L_jk_armLeft7_slider"), $("#ca_L_jk_armLeft")
						, armL, -7.0, 7.0, 0.5);
				this.makeSlider($("#ca_L_jk_armRight7_slider"), $("#ca_L_jk_armRight")
						, armR, -7.0, 7.0, 0.5);
			}
			else{
				$("#ca_L_jk_armLeft2_sliderArea").show();
				$("#ca_L_jk_armRight2_sliderArea").show();
				this.makeSlider($("#ca_L_jk_armLeft2_slider"), $("#ca_L_jk_armLeft")
						, armL, -2.0, 2.0, 0.5);
				this.makeSlider($("#ca_L_jk_armRight2_slider"), $("#ca_L_jk_armRight")
						, armR, -2.0, 2.0, 0.5);
			}
		},
		L_showSkLenSlider:function(lim, len){
			$(".ca_L_sk_lengthSlider").hide();
			$("#ca_L_sk_length").val(0);
			if(lim > SLIDER.L_SK_LEN1){
				$("#ca_L_sk_length10_sliderArea").show();
				this.makeSlider($("#ca_L_sk_length10_slider"), $("#ca_L_sk_length")
						, len, -10.0, 10.0, 0.5);
			}
			else{
				$("#ca_L_sk_length5_sliderArea").show();
				this.makeSlider($("#ca_L_sk_length5_slider"), $("#ca_L_sk_length")
						, len, -5.0, 5.0, 0.5);
			}
		},

		/** サイズチェンジでスライダー変更*/
		_onL_sk_ChangeSize:function(e, loadFlag, loadVal, loadLen){
			var val = SLIDER.L_SK_LEN2;
			var len = 0;
			var size = 0;
			var obj = {};
			var i = 0;
			if(loadFlag == true){
				size = loadVal;
				len = loadLen;
			}
			else{
				size = $("#ca_L_sk_size").val();
			}

			if(size > 0){
				for(i=0; i<this.sizeList1[TYPE.L_SK].length; i++){
					obj = this.sizeList1[TYPE.L_SK][i];
					if(obj.id == size){
						val = obj.skirtAjLenMax;
					}
				}
				if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					this.abledSlider($('.ca_L_sk_sizeEffect_slider'), $('.ca_L_sk_sizeEffect_sliderDot'));
				}
			}
			else{
				this.disabledSlider($('.ca_L_sk_sizeEffect_slider'), $('.ca_L_sk_sizeEffect_sliderDot'));
			}
			this.L_showSkLenSlider(val, len);
		},
		_onL_jk_ChangeSize:function(e, loadFlag, loadVal, loadLen, loadArmL, loadArmR){
			var valLen = SLIDER.L_JK_LEN3;
			var valArm = SLIDER.L_JK_ARM2;
			var len = 0;
			var armL = 0;
			var armR = 0;
			var size = 0;
			var obj = {};
			var i = 0;
			if(loadFlag == true){
				size = loadVal;
				len = loadLen;
				armL = loadArmL;
				armR = loadArmR;
			}
			else{
				size = $("#ca_L_jk_size").val();
			}

			if(size > 0){
				for(i=0; i<this.sizeList1[TYPE.L_JK].length; i++){
					obj = this.sizeList1[TYPE.L_JK][i];
					if(obj.id == size){
						valLen = obj.jkAdjLenMax;
						valArm = obj.slvAdjLenMax;
					}
				}
				if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					this.abledSlider($('.ca_L_jk_sizeEffect_slider'), $('.ca_L_jk_sizeEffect_sliderDot'));
				}
			}
			else{
				this.disabledSlider($('.ca_L_jk_sizeEffect_slider'), $('.ca_L_jk_sizeEffect_sliderDot'));
			}
			this.L_showJkLenSlider(valLen, len);
			this.L_showJkArmSlider(valArm, armL, armR);
		},




		/**
		 * ブランド変更
		 */
		_onS_ChangeBrand:function(){
			if($("#ca_S_brand").val() <= 0){
				this.S_lockUnselectBrand();
			}
			else{
				this.S_lockselectBrand();
				this.makeClothSel(false, amcm_type.AMCM_VAL_PO_CLASS_SHIRT, $("#ca_S_cloth"), null, null);
			}
		},
		// ブランド未選択
		S_lockUnselectBrand: function(){
			// 配下を触れないように
			clutil.viewReadonly(this.$(".ca_S_brandEffectDiv"));
			this.S_lockUnselectCloth();
			clutil.data2view($("#ca_S_clothArea"), S_ClothClearObj);
		},
		// ブランド変更
		S_lockselectBrand: function(){
			// 配下を編集可に
			clutil.viewRemoveReadonly(this.$(".ca_S_brandEffectDiv"));
			this.S_lockUnselectCloth();
		},

		/**
		 * 生地変更
		 */
		_onS_ChangeCloth:function(){
			if($("#ca_S_cloth").val() <= 0){
				this.S_lockUnselectCloth();
			}
			else {
				// 未選択->選択の時だけリセット
				if($("#ca_S_clothOld").val() == 0){
					this.makeStyleOptSel(false, amcm_type.AMCM_VAL_PO_CLASS_SHIRT, TYPE.ALL, null, null, null);
				}
				this.getArrivalDate(false, amcm_type.AMCM_VAL_PO_CLASS_SHIRT, null, null);
				this.S_lockselectCloth();
			}
			$("#ca_S_clothOld").val($("#ca_S_cloth").val());
		},
		// 生地未選択
		S_lockUnselectCloth: function(){
			// 配下を触れないように
			this.setArrivalDate(-1, false);
			clutil.viewReadonly(this.$("#ca_S_Field"));
			this.disabledSlider_S();
			this.S_optClear();
		},
		// 生地変更
		S_lockselectCloth: function(){
			// 配下を編集可に
			clutil.viewRemoveReadonly(this.$("#ca_S_Field"));
			this.abledSlider_S();
		},

		/**
		 * 生地配下クリア
		 */
		S_optClear:function(){
//			//オプション配下の要素隠し
			$(".ca_S_optElem").hide();
			$(".cl_S_optrequired").removeClass("cl_required");

			// 初期表示項目再表示
			this._onS_CuffsTypeToggle(null, true, amcm_type.AMCM_VAL_ARM_TYPE_LONG);
			$("#ca_S_amfDiv").show();

			// 補正値記録
			var sliderObj = clutil.view2data($("#ca_S_sliderArea"));
			// データリセット
			clutil.data2view($("#ca_S_Field"), S_OptClearObj);
			// 補正値はそのまま
			clutil.data2view($("#ca_S_sliderArea"), sliderObj);
		},





		/** 店舗着日設定*/
		setArrivalDate:function(date, loadFlag){
			// 手動設定時は短納期フラグリセット
			if(loadFlag == false){
				clutil.data2view($("#ca_expressArea"), {express:0});
			}

			// サーバーからのオリジナル情報保存
			$("#ca_arrivalDateSave").val(date);
			clutil.datepicker($("#ca_arrivalDate")).datepicker('setIymd', date );
			$("#ca_arrivalDateSave").val(date);
			if(date <= 0){
				clutil.datepicker($("#ca_saleDate")).datepicker('setIymd', date );
			}
			else{
				$("#ca_saleDate").datepicker('setIymd', clutil.addDate(date, 1));
			}
		},

		/**
		 * レディスベスト：ボタン変更ラジオ変更
		 */
		_onL_ve_ChangeButtonTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_L_ve_changeButtonType]:checked").val();
			}

			if(val == 0){
				$("#ca_L_ve_changeButtonSelDiv").hide();
				$("#ca_L_ve_changeButtonSel").removeClass("cl_required");
			}
			else{
				$("#ca_L_ve_changeButtonSelDiv").show();
				$("#ca_L_ve_changeButtonSel").addClass("cl_required");
			}
		},
		/**
		 * レディスベスト：裏地変更ラジオ変更
		 */
		_onL_ve_ChangeLiningTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_L_ve_changeLiningType]:checked").val();
			}
			if(val == 0){
				$("#ca_L_ve_changeLiningSelDiv").hide();
				$("#ca_L_ve_changeLiningSel").removeClass("cl_required");
			}
			else{
				$("#ca_L_ve_changeLiningSelDiv").show();
				$("#ca_L_ve_changeLiningSel").addClass("cl_required");
			}
		},
		/**
		 * レディスパンツ：裾仕上げ変更ラジオ変更
		 */
		_onL_sl_BottomTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_L_sl_bottomType]:checked").val();
			}
			if(val == amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE){
				$(".ca_L_sl_lengthDiv").hide();
			}
			else{
				$(".ca_L_sl_lengthDiv").show();
			}
		},
		/**
		 * レディスパンツ：ボタン変更ラジオ変更
		 */
		_onL_sl_ChangeButtonTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_L_sl_changeButtonType]:checked").val();
			}

			if(val == 0){
				$("#ca_L_sl_changeButtonSelDiv").hide();
			}
			else{
				$("#ca_L_sl_changeButtonSelDiv").show();
			}
		},
		/**
		 * レディスパンツ：ボタン変更領域表示/非表示設定
		 */
		chkL_sl_ChangeButtonTypeSet: function(loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				val = clutil.view2data($('#ca_L_brandField')).L_jk;
			}

			if(val == 1){
				$("#ca_L_sl_changeButtonTypeDiv").hide();
				$("#ca_L_sl_changeButtonTypeHr").hide();
				$("#ca_L_sl_changeButtonSelDiv").hide();
				$("#ca_L_sl_changeButtonSelDiv").removeClass("cl_required");
				clutil.data2view($('#ca_L_sl_changeButtonTypeDiv'), {L_sl_changeButtonType:0});
				clutil.data2view($('#ca_L_sl_changeButtonSelDiv'), {L_sl_changeButtonSel:0});
			}
			else{
				$("#ca_L_sl_changeButtonTypeDiv").show();
				$("#ca_L_sl_changeButtonTypeHr").show();
			}
		},
		/**
		 * 無料リターンカフス変更
		 */
		// 2016/1/27 PRB追加対応
		_onL_jk_ChangeCuffsTypeToggle: function(){
			var val = $("input:radio[name=ca_L_jk_cuffsType]:checked").val();
			this.cuffsFirstTypeAutoSet(val, false);
			this.btnLineTypeAutoSet(val, false, null);
		},
		/**
		 * 有料リターンカフス変更
		 */
		_onL_jk_ChangeCuffsPayTypeToggle: function(){
			var val = $("input:radio[name=ca_L_jk_cuffsPayType]:checked").val();
			this.cuffsFirstTypeAutoSet(val, true);
			this.btnLineTypeAutoSet(val, true, null);
		},
		/**
		 * 本切羽変更
		 */
		_onL_jk_ChangeCuffsFirstTypeToggle: function(){
			var val = $("input:radio[name=ca_L_jk_cuffsFirstType]:checked").val();
			this.cuffsTypeAutoSet(val);
			this.btnLineTypeAutoSet(val, null, true);
		},

		/**
		 * リターンカフス設定
		 */
		cuffsTypeAutoSet:function(val){
			// 対象外フラグ取得
			var $tgt = $("#ca_L_jk_cuffsFirstType_" + val);
			var f_cuffs = $tgt.attr("f_cuffs");
			if(f_cuffs == 0){
				// 対象外フラグ[0]なら何もしない
				return;
			}

			// 強制的にリターンカフス[なし]とする
			var $tgtDiv = "";
			var obj = {};
			if(this.cuffsPayType == true){
				$tgtDiv = $('#ca_L_jk_cuffsPayTypeDiv');
				obj = {
					L_jk_cuffsPayType:0
				};
			}
			else{
				$tgtDiv = $('#ca_L_jk_cuffsTypeDiv');
				obj = {
						L_jk_cuffsType:0
				};
			}
			clutil.data2view($tgtDiv, obj);
		},
		/**
		 * ボタンホールカラー糸設定
		 */
		btnLineTypeAutoSet:function(val, f_pay, f_cuffsFirst){
			var f_btnLine = true;

			// 本切羽から呼ばれていない場合
			if(f_cuffsFirst != true){
				// 対象外フラグ取得
				var $tgt = "";
				if(f_pay == true){
					$tgt = $("#ca_L_jk_cuffsPayType_" + val);
				}
				else{
					$tgt = $("#ca_L_jk_cuffsType_" + val);
				}
				if($tgt.attr("f_btnLine") == 1){
					// 触れなくする
					f_btnLine = false;
				}
			}
			// 編集可不可処理
			this.setDisableOptDiv(f_btnLine, $("#ca_L_jk_buttonHoleDiv"), {L_jk_buttonHoleType:0});
			this.setDisableOptSelElem(f_btnLine, this.buttonThreadColorSelList,
					$("#ca_L_jk_buttonHoleSelDiv"), $("#ca_L_jk_buttonHoleSel"));
		},

		/**
		 * 本切羽設定
		 */
		cuffsFirstTypeAutoSet:function(val, f_pay){
			// 対象外フラグ取得
			var $tgt = "";
			if(f_pay == true){
				$tgt = $("#ca_L_jk_cuffsPayType_" + val);
			}
			else{
				$tgt = $("#ca_L_jk_cuffsType_" + val);
			}
			var f_cuffsFirst = $tgt.attr("f_cuffsFirst");
			if(f_cuffsFirst == 0){
				// 対象外フラグ[0]なら何もしない
				return;
			}

			// 強制的に本切羽[なし]とする
			clutil.data2view($("#ca_L_jk_cuffsFirstDiv"), {L_jk_cuffsFirstType:0});
		},

		/**
		 * レディスジャケット：ボタン変更ラジオ変更
		 */
		_onL_jk_ChangeButtonTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_L_jk_changeButtonType]:checked").val();
			}

			if(val == 0){
				$("#ca_L_jk_changeButtonSelDiv").hide();
				$("#ca_L_jk_changeButtonSel").removeClass("cl_required");
			}
			else{
				$("#ca_L_jk_changeButtonSelDiv").show();
				$("#ca_L_jk_changeButtonSel").addClass("cl_required");
			}
		},
		/**
		 * レディスジャケット：裏地変更ラジオ変更
		 */
		_onL_jk_ChangeLiningTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_L_jk_changeLiningType]:checked").val();
			}

			if(val == 0){
				$("#ca_L_jk_changeLiningSelDiv").hide();
				$("#ca_L_jk_changeLiningSel").removeClass("cl_required");
			}
			else{
				$("#ca_L_jk_changeLiningSelDiv").show();
				$("#ca_L_jk_changeLiningSel").addClass("cl_required");
			}
		},
		/**
		 * レディスジャケット：ボタンホールカラー糸ラジオ変更
		 */
		_onL_jk_ChangeButtonHoleTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_L_jk_buttonHoleType]:checked").val();
			}

			if(val == 0){
				$("#ca_L_jk_buttonHoleSelDiv").hide();
				$("#ca_L_jk_buttonHoleSel").removeClass("cl_required");
			}
			else{
				$("#ca_L_jk_buttonHoleSelDiv").show();
				$("#ca_L_jk_buttonHoleSel").addClass("cl_required");
			}
		},
		/**
		 * ネーム変更
		 */
		_onL_jk_ChangeNameSel:function(loadFlag, loadVal){
			var val = 0;
			var flag = false;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				val = $("#ca_L_jk_name").val();
			}

			var obj = {
				L_jk_nameMakeType: amcm_type.AMCM_VAL_NAME_TYPE_FACT,
			};

			$(".ca_L_jk_nameDiv").hide();
			$(".ca_L_jk_nameElem").removeClass("cl_required");
			clutil.data2view($("#ca_L_jk_nameInputArea"), {L_jk_nameKanji:"",L_jk_nameFull:"",L_jk_nameIni:""});
			this.validator.clearErrorMsg($('.ca_L_jk_nameElem'));
			if(val == amcm_type.AMCM_VAL_PO_NAME_TYPE_NONE || val == 0){
				flag = true;
			}
			else if(val == amcm_type.AMCM_VAL_PO_NAME_TYPE_KANJI){
				$("#ca_L_jk_nameKanjiDiv").show();
				$("#ca_L_jk_nameMakeTypeDiv").show();
				$("#ca_L_jk_nameKanji").addClass("cl_required");

				clutil.data2view($("#ca_L_jk_nameMakeTypeDiv"), obj);
			}
			else if(val == amcm_type.AMCM_VAL_PO_NAME_TYPE_FULL){
				$("#ca_L_jk_nameFullDiv").show();
				$("#ca_L_jk_nameMakeTypeDiv").show();
				$("#ca_L_jk_nameFull").addClass("cl_required");

				clutil.data2view($("#ca_L_jk_nameMakeTypeDiv"), obj);
			}
			else if(val == amcm_type.AMCM_VAL_PO_NAME_TYPE_INITIAL){
				$("#ca_L_jk_nameIniDiv").show();
				$("#ca_L_jk_nameMakeTypeDiv").show();
				$("#ca_L_jk_nameIni").addClass("cl_required");

				clutil.data2view($("#ca_L_jk_nameMakeTypeDiv"), obj);
			}

			// true:内ポケットあり固定 false:固定解除
			this.chkInnerPocketL(flag, TYPE.ON);
		},

		/**
		 * シャツ：衿セレクター
		 */
		_onS_ChangeCollar:function(e, loadFlag, loadObj){
			var collarSel = 0;
			var list = this.collarList;
			var i = 0;
			var order = {};
			var obj = {
					amfTypeFlag:0,
					optHinban:1,
					collar1Flag:1,
					interliningFlag:1
			};
			if(loadFlag == true){
				order =  loadObj;
				collarSel = order.S_collarSel;
			}
			else{
				order =  clutil.view2data($('#ca_S_Field'));
				collarSel = $("#ca_S_collarSel").val();
			}
			var amfFlag = this.chkS_AmfLoadFlag(order);
			this.chkS_Amf(amfFlag);


			for(i=0; i<list.length; i++){
				if(list[i].id == collarSel){
					obj = list[i];
					break;
				}
			}
			this.chkMiter(obj);
			this.chkCollarType(obj);
			this.chkFrontType(obj);
		},


		/**
		 * シャツ：カフスセレクター
		 */
		_onS_ChangeCuffs:function(e, loadFlag, loadObj){
			var order = {};
			if(loadFlag == true){
				order = loadObj;
			}
			else{
				order =  clutil.view2data($('#ca_S_Field'));
			}
			var amfFlag = this.chkS_AmfLoadFlag(order);
			this.chkS_Amf(amfFlag);
		},


		/**
		 * シャツ：ボディ型セレクター
		 */
		_onS_ChangeBody:function(e, loadFlag, loadVal){
			var val = 0;
			var list = this.bodyList;
			var i = 0;
			var flag = false;
			if(loadFlag == true){
				val = loadVal;
			}
			else{
				val = $("#ca_S_bodySel").val();
			}
			for(i=0; i<list.length; i++){
				if(list[i].id == val
						&& list[i].neckSizeMax > TYPE.S_NECKMAX){
					flag = true;
					break;
				}
			}
			this.setNeckList(flag);
		},
		// マイター選択可不可判定
		chkMiter:function(obj){
			if(obj.collar1Flag == 1){
				clutil.viewRemoveReadonly($("#ca_S_miterDiv"));
			}
			else{
				clutil.viewReadonly($("#ca_S_miterDiv"));
				clutil.data2view($('#ca_S_miterDiv'), {S_miter:0});
			}
		},
		// amfステッチ表示/非表示
		chkS_Amf:function(flag){
			if (flag == false) {
				// 表示設定
				$('#ca_S_amfDiv').hide();
				$('#ca_S_amfSel').removeClass("cl_required");
				clutil.data2view($('#ca_S_amfDiv'), {S_amfSel:0});
			}
			else {
				$('#ca_S_amfDiv').show();
				$('#ca_S_amfSel').addClass("cl_required");
			}
		},
		// 衿芯地選択可不可判定
		chkCollarType:function(obj){
			if(obj.interliningFlag == 1){
				clutil.viewRemoveReadonly($("#ca_S_collarTypeDiv"));
			}
			else{
				clutil.viewReadonly($("#ca_S_collarTypeDiv"));
				clutil.data2view($('#ca_S_collarTypeDiv'), {S_collarType:0});
			}
		},
		// 前身頃セレクター
		chkFrontType:function(obj){
			if(obj.optHinban == 10024 || obj.optHinban == 10025){
				// ハーフワンピース固定
				this.setFrontTypeList(false);
			}
			else{
				this.setFrontTypeList(true);
			}
		},
		// 首回りセレクター
		setNeckList:function(flag){
			var list = [];
			if(flag == true){
				// 有料あり
				list = this.neckList;
				//this.setSelListAddLine($("#ca_S_neckSel"), list);
			}
			else{
				// 有料なし
				list = this.neckFreeList;
				//this.setSelList($("#ca_S_neckSel"), list);
			}
			this.setSelList($("#ca_S_neckSel"), list);
		},
		// 前身頃セレクター
		setFrontTypeList:function(flag){
			var list = [];
			if(flag == true){
				// ハーフなし
				list = this.frontTypeNomalList;
			}
			else{
				// ハーフあり
				list = this.frontTypeHalfList;
			}
			this.setSelList($("#ca_S_frontSel"), list);
			if(list.length > 0){
				clutil.viewRemoveReadonly($("#ca_S_frontSelDiv"));
			}
		},
		getHalfID:function(){
			var id = 2050;
			var list = this.frontTypeList;
			var i = 0;
			for(i=0; i<list.length; i++){
				if(list[i].optHinban == amcm_type.AMCM_VAL_FRONTBODY_TYPE_HALF){
					id = list[i].id;
					break;
				}
			}
			return id;
		},

		/**
		 * シャツ：袖ラジオ変更
		 */
		_onS_CuffsTypeToggle: function(e, loadFlag, loadVal){
			var val = 0;
			var namePlaceList = [];
			//var cuffsList = [];
			var clericList = [];

			if(loadFlag == true){
				val = loadVal;
			}
			else{
				var $target = $(e.target);
				if(!$target.attr("checked")){
					return;
				}
				val = $("input:radio[name=ca_S_cuffsType]:checked").val();
			}

			// カフスリセット
			clutil.data2view($("#ca_S_cuffsDiv"), {S_cuffsSel:0});
			if(val == 1){
				// 長袖
				$(".ca_S_cuffsEffectDiv").show();
				$("#ca_S_cuffsSel").addClass("cl_required");
				$(".ca_S_cuffsEffectrequired").addClass("cl_required");

				namePlaceList = this.namePlaceList;
				clericList = this.clericList;
			}
			else{
				// 半袖
				$(".ca_S_cuffsEffectDiv").hide();
				$("#ca_S_cuffsSel").removeClass("cl_required");
				$(".ca_S_cuffsEffectrequired").removeClass("cl_required");

				// 隠れる要素リセット
				clutil.data2view($("#ca_S_armLeftSelDiv"), {S_armLeftSel:""});
				clutil.data2view($("#ca_S_armRigthSelDiv"), {S_armRigthSel:""});
				clutil.data2view($("#ca_S_cuffsLeftDiv"), {S_cuffsLeft:0});
				clutil.data2view($("#ca_S_cuffsRightDiv"), {S_cuffsRight:0});
				this.makeSlider($("#ca_S_cuffsLeft_slider"), $("#ca_S_cuffsLeft")
						, 0.0, -2.0, 2.0, 1.0);
				this.makeSlider($("#ca_S_cuffsRight_slider"), $("#ca_S_cuffsRight")
						, 0.0, -2.0, 2.0, 1.0);


				namePlaceList = this.namePlaceShortArmList;
				clericList = this.clericShortArmList;
			}
			this.setSelList($("#ca_S_namePlaceSel"), namePlaceList);
			this.setSelList($("#ca_S_clericSel"), clericList);
		},

		/**
		 * ネーム変更
		 */
		_onS_ChangeNameSel:function(e, loadFlag, loadVal, loadNameType){
			var id = 0;
			if(loadFlag == true){
				id = loadVal;
			}
			else{
				id = $("#ca_S_name").val();
			}

			var val = this.getNameSelOptID(id);

			$(".ca_S_optElem").hide();
			$(".cl_S_nameOptElem").removeClass("cl_required");
			$(".cl_S_nameElem").removeClass("cl_required");
			this.validator.clearErrorMsg($('.cl_S_nameElem'));
			if(val == amcm_type.AMCM_VAL_INITIAL_OPTION_TYPE_NOT_EXIST){
				// イニシャル
				$("#ca_S_nameIniDiv").show();
				//this.setSelList($("#ca_S_nameTypeSel"), this.nameTypeList);
				$(".ca_S_nameDiv").show();
				$(".cl_S_nameOptElem").addClass("cl_required");
				$("#ca_S_nameIni").addClass("cl_required");
			}
			else if(val == amcm_type.AMCM_VAL_INITIAL_OPTION_TYPE_EXIST){
				// フルネーム
				$("#ca_S_nameFullDiv").show();
				//this.setSelList($("#ca_S_nameTypeSel"), this.nameTypeFullList);
				$(".ca_S_nameDiv").show();
				$(".cl_S_nameOptElem").addClass("cl_required");
				$("#ca_S_nameFull").addClass("cl_required");
			}
			else{
				// なし
			}

			if(loadFlag == true){
				// 字体だけ復活
				clutil.data2view($("#ca_S_nameTypeDiv"), {S_nameTypeSel:loadNameType});
			}
			else{
				// ネームリセット
				clutil.data2view($("#ca_S_nameInputArea")
						, {S_nameFull:"",S_nameIni:"", S_nameTypeSel:0, S_namePlaceSel:0, S_nameColorSel:0});
			}
		},
		getNameSelOptID:function(id){
			var list = this.nameList;
			var val = 0;
			var i=0;
			for(i=0; i<list.length; i++){
				if(list[i].id == id){
					val = list[i].optHinban;
				}
			}
			return val;
		},


		setInit:function(type){
			// メンズ初期状態
			this.M_jkOptClear(true);
			this.M_slOptClear(true);
			this.M_veOptClear(true);
//			// レディスの初期状態
			this.L_jkOptClear(true);
			this.L_skOptClear(true);
			this.L_slOptClear(true);
			this.L_veOptClear(true);

			// シャツの初期状態
			this.S_optClear();

			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				// メンズ仕様にする
				this.showMens();
				$(".ca_M_Div").hide();
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				this.showLedies();
				$(".ca_L_Div").hide();
			}
			else{
				this.showShirt();
				$(".ca_S_Div").hide();
			}

			// その他初期状態
			clutil.data2view($("#ca_other_form"), otherClearObj);

			// 店舗選択待ち
			clutil.viewReadonly(this.$("#ca_brandArea"));
			clutil.viewReadonly(this.$(".ca_M_Div"));
			clutil.viewReadonly(this.$(".ca_L_Div"));
			clutil.viewReadonly(this.$(".ca_S_Div"));
			this.disabledSliderAll();
		},

		showMens:function(){
			// ブランド・生地
			$(".ca_M_Area").show();
			$(".ca_L_Area").hide();
			$(".ca_S_Area").hide();
			//納期
			$("#ca_expressArea").hide();
			//その他
			$("#ca_otStoreAdjTypeIDArea").show();
			// 必須条件
			$(".cl_M_required").removeClass("cl_required");
			$(".cl_L_required").removeClass("cl_required");
			$(".cl_S_required").removeClass("cl_required");
			$(".cl_M_com_required").addClass("cl_required");
		},

		showLedies:function(){
			// ブランド・生地
			$(".ca_M_Area").hide();
			$(".ca_L_Area").show();
			$(".ca_S_Area").hide();
			// 納期
			$("#ca_expressArea").hide();
			//その他
			$("#ca_otStoreAdjTypeIDArea").show();
			// 必須条件
			$(".cl_M_required").removeClass("cl_required");
			$(".cl_L_required").removeClass("cl_required");
			$(".cl_S_required").removeClass("cl_required");
			$(".cl_L_com_required").addClass("cl_required");
		},

		showShirt:function(){
			// ブランド・生地
			$(".ca_M_Area").hide();
			$(".ca_L_Area").hide();
			$(".ca_S_Area").show();
			// 納期
			$("#ca_expressArea").show();
			// その他
			$("#ca_otStoreAdjTypeIDArea").hide();
			$("#ca_otStoreAdjTypeIDArea").removeClass("cl_required");
			// 必須条件
			$(".cl_M_required").removeClass("cl_required");
			$(".cl_L_required").removeClass("cl_required");
			$(".cl_S_required").addClass("cl_required");
		},



		/**
		 * 選択店舗変更
		 */
		_onChangeStore: function(flag){
			var storeItem = this.$("#ca_storeID").autocomplete('clAutocompleteItem');
			var storeID = 0;
			if (storeItem != null) {
				storeID = storeItem.id;
			}
			var storeOldID = $("#ca_storeOldID").val();
			if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null
					|| storeID  <= 0){
				this.lockUnselectStore();
				$("#ca_storeOldID").val(0);
			}
			else if(storeOldID != storeID || flag == true){
				// 2015/9/4 選択済の店舗と異なる店舗が選択or強制フラグあり
				this.lockChangeStore();
				this._onOrderTypeToggle(null);
				$("#ca_storeOldID").val(storeID);
			}
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				clutil.viewReadonly($("#ca_kindClearArea"));
			}
			else{
				//clutil.data2view($("#ca_kindClearArea"), kindClearObj);
			}
		},
		// 店舗未選択
		lockUnselectStore: function(){
			// ブランドエリアを触れないように
			clutil.viewReadonly(this.$("#ca_brandArea"));
			//clutil.data2view($("#ca_kindClearArea"), kindClearObj);
			// 選択種別で画面初期化
			var val = $("input:radio[name=ca_orderType]:checked").val();

			this.M_lockUnselectSeason();
			this.L_lockUnselectBrand();
			this.S_lockUnselectBrand();
			this.setDivs(false, null, null);
			clutil.data2view($('#ca_M_seasonArea'), M_SeasonClearObj);
			clutil.data2view($('#ca_L_brandArea'), L_BrandClearObj);
			clutil.data2view($('#ca_S_brandArea'), S_BrandClearObj);
			clutil.data2view($("#ca_typeClearArea"), typeClearObj);
		},
		// 選択店舗変更
		lockChangeStore: function(){
			// 種別・品種・ブランドを編集可に
			clutil.viewRemoveReadonly(this.$(".ca_storeEffectDiv"));

			/** リリース用ロック **/
			this.setReleaseLock();
			/****/

			//clutil.data2view($("#ca_kindClearArea"), kindClearObj);
			this.setDivs(false, null, null);
			this.M_lockUnselectSeason();
			this.L_lockUnselectBrand();
			this.S_lockUnselectBrand();
		},

		/**
		 * 品種チェックによる、Div表示変更
		 */
		setDivs: function(loadFlag, loadVal, loadOrder){
			var val = 0;
			var order = {};

			if(loadFlag == false){
				val = $("input:radio[name=ca_orderType]:checked").val();
				order =  clutil.view2data($('#ca_brandArea'));
			}
			else{
				val = loadVal;
				order =  loadOrder;
			}

			if(val == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				$('.ca_M_Div').hide();
				if(order.M_st == 1){
					$('#ca_M_jkDiv').show();
					$('#ca_M_slDiv').show();
				}
				if(order.M_jk == 1){
					$('#ca_M_jkDiv').show();
				}
				if(order.M_sl == 1){
					$('#ca_M_slDiv').show();
				}
				if(order.M_ve == 1){
					$('#ca_M_veDiv').show();
				}
			}
			else if(val == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				$('.ca_L_Div').hide();
				if(order.L_jk == 1){
					$('#ca_L_jkDiv').show();
				}
				if(order.L_sk == 1){
					$('#ca_L_skDiv').show();
				}
				if(order.L_sl == 1){
					$('#ca_L_slDiv').show();
				}
				if(order.L_ve == 1){
					$('#ca_L_veDiv').show();
				}
			}
			else{

			}
		},



		/** お客様情報連携ボタン押下 */
		_onGuestSelClick: function(e){
			var _this = this;
			this.validator.clearErrorMsg($('.ca_guest'));
			if(this.$("#ca_storeID").autocomplete('clAutocompleteItem') == undefined
					|| this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null){
				clutil.showDialog("店舗を入力して下さい。");
				return;
			}
			if((this.$("#ca_telNo1").val() == "")
					|| (this.$("#ca_telNo2").val() == "")
					|| (this.$("#ca_telNo3").val() == "")
			){
				clutil.showDialog("電話番号を入力して下さい。");
				return;
			}
			if(this.$("#ca_custName").val() != ""){
				clutil.ConfirmDialog("お客様名を上書きしてよろしいですか？", function(_this){
					try{
						_this._onGuestGet();
					}finally{
					}
				}, function(_this){
					console.log('CANCEL', arguments);
					try{
						return;;
					}finally{
					}
				}, _this);
			}else{
				_this._onGuestGet();
			}
		},

		_onGuestGet: function(e){
			var _this = this;
			var telNo = this.$("#ca_telNo1").val() + this.$("#ca_telNo2").val() + this.$("#ca_telNo3").val();
			var unitID = clcom.getSysparam('PAR_AMMS_UNITID_AOKI');
			var grpcd;
			if (unitID <= 0){
				grpcd = 0;
			}else{
				grpcd = ((unitID == clcom.getSysparam('PAR_AMMS_UNITID_AOKI'))?1:2);
			}
			// 顧客一覧取得
			var uri =clcom.getSysparam('PAR_AMPO_CUSTSRCH_PATH')
			+ '?grpCd=' + grpcd
			+ '&tenCd=' + this.$("#ca_storeID").autocomplete('clAutocompleteItem').code
			+ '&riyoDt=' + clcom.getOpeDate()+"100000"
			+ '&kiinNo='
			+ '&telNo=' + telNo
			+ '&knaSmei='
			+ '&postNo='
			+ '&tdfkCd='
			+ '&brtYmd=';
//			uri="/api/gsme_api_cust_srch?grpCd=1&tenCd=0001&riyoDt=20120101010101&kiinNo=&telNo=0312345678&knaSmei=&postNo=&tdfkCd=&brtYmd=";
			$.ajax({
				url: uri,
				type: "GET",
//				timeout: 10000,
//				data: guestData
			}).done(function(data, status, xhr) {
				var xotree = new XML.ObjTree();
				console.log('srch OK',arguments);
				var list = xotree.parseXML( xhr.responseText );
				console.log('srch OK2',list);

				if(list.response.kensu == undefined || list.response.kensu <= 0){
					clutil.showDialog("顧客情報はありません。");
				}else{
					var guestList = [];
					if (list.response.kensu == 1){
						var obj = {
								name:list.response.kkykInfo.knjSmei.replace(" ",""),
								kana:list.response.kkykInfo.knaSmei.replace(" ",""),
								memberNo:list.response.kkykInfo.kkykNo,
								term:"",
								cardType:""
						};
						guestList.push(obj);
					}else{
						for (var i = 0; i < list.response.kensu; i++){
							var obj = {
									name:list.response.kkykInfo[i].knjSmei.replace(" ",""),
									kana:list.response.kkykInfo[i].knaSmei.replace(" ",""),
									memberNo:list.response.kkykInfo[i].kkykNo,
									term:"",
									cardType:""
							};
							guestList.push(obj);
						}
					}

					//本来はサーバと通信を行い結果をitemListを作成する。
					//また対象が1件の場合ダイアログを出さず、無理やり入りれる。
					if(guestList.length <= 0){
						//なし
						console.log('NOTHING');
						clutil.showDialog("顧客情報はありません。");
						return;
					}else{
						_this._onGuestShow(guestList);
					}
				}
			}).fail(function(xhr, status, error) {
				clutil.showDialog("顧客情報が取得できません。");
				console.log('srch NG', arguments);
			}).always(function(arg1, status, arg2) {
				console.log('srch FIN', arguments);
			});
			//サーバと通信するプログラム作成
			//返ってきたデータ以下の形式の配列にすること
		},

		setReadOnlyAllItems:function(flag){
			if(flag == true){
				clutil.viewReadonly($("#content"));
				this.disabledSliderAll();

			}
			else{
				clutil.viewRemoveReadonly($("#content"));
				clutil.viewReadonly($(".ca_mustReadOnly"));
				/** リリース用ロック **/
				this.setReleaseLock();
				/****/
				this.abledSliderAll();
				if(_termChg_Flag == 1){
					// 納期変更フラグがある場合のみ、店舗着日変更可能
					clutil.viewRemoveReadonly($("#ca_arrivalDate_div"));
				}
			}
		},

		_onGuestShow: function(guestList){
			var _this = this;
			//呼び出しもとで来ないように制限をかけているが念のため
			if( guestList.length <= 0){
				return;
			}

			//AOKI:1, ORI:2
			var grpcd = 1;

			//iを使うとうまくいかないのでjを用いる
			var j = 0;
			for(var i = 0; i < guestList.length; i++){
				var uri =clcom.getSysparam('PAR_AMPO_CUSTGET_PATH')
				+ '?grpCd=' + grpcd
				+ '&tenCd=' + this.$("#ca_storeID").autocomplete('clAutocompleteItem').code
				+ '&riyoDt=' + clcom.getOpeDate()+"100000"
				+ '&kiinNo='
				+ '&kkykNo=' + guestList[i].memberNo;

				$.ajax({
					url: uri,
					type: "GET",
//					timeout: 10000,
//					data: guestData
				}).done(function(data, status, xhr) {
					var xotree = new XML.ObjTree();
					console.log('guest OK',arguments);
					var member = xotree.parseXML( xhr.responseText );
					console.log('guest OK2',member);

					if(member.response.kensu == undefined || member.response.kensu <= 0){
						guestList[j].memberNo = "";
					}else{
						if(member.response.kensu == 1){
							guestList[j].memberNo = member.response.kiinNo;
							guestList[j].term = ((member.response.yukoKign == null)?"":clutil.dateFormat(member.response.yukoKign, 'yyyy/mm/dd'));
						}else{
							guestList[j].memberNo = member.response[0].kiinNo;
							guestList[j].term = ((member.response[0].yukoKign == null)?"":clutil.dateFormat(member.response.yukoKign, 'yyyy/mm/dd'));
						}
					}
				}).fail(function(xhr, status, error) {
					console.log('NG', arguments);
					guestList[j].kkykNo = "";
				}).always(function(arg1, status, arg2) {
					console.log('FIN', arguments);
					j++;
					if(j == guestList.length){
						if(guestList.length == 1){
							//1件
							_this.$("#ca_custName").val(guestList[0].name.replace(" ",""));
							_this.$("#ca_custNameKana").val(guestList[0].kana.replace(" ",""));
							_this.$("#ca_membNo").val(guestList[0].memberNo);
							clutil.cltxtFieldLimitReset($("#ca_custName"));
							clutil.cltxtFieldLimitReset($("#ca_custNameKana"));
							clutil.cltxtFieldLimitReset($("#ca_membNo"));
						}else{
							// 複数
							var dialog = new GuestEditView();
							dialog.render();
							dialog.dialogdata2view(guestList);
							clutil.initUIelement(dialog.$el);
							clutil.ConfirmDialog(dialog.el, function(dialog){
								console.log('OK', arguments);
								try{
									var res = dialog.getResult();
									if (res == null){
										//選択されていないので無視
										;
									}else{
										_this.$("#ca_custName").val(res.name.replace(" ",""));
										_this.$("#ca_custNameKana").val(res.kana.replace(" ",""));
										_this.$("#ca_membNo").val(res.memberNo);
										clutil.cltxtFieldLimitReset($("#ca_custName"));
										clutil.cltxtFieldLimitReset($("#ca_custNameKana"));
										clutil.cltxtFieldLimitReset($("#ca_membNo"));
									}
								}finally{
									dialog.remove();
								}
							}, function(dialog){
								console.log('CANCEL', arguments);
								try{
									;
								}finally{
									dialog.remove();
								}
							}, dialog);
							$('.cl_ok').html("確定");
						}
					}
				});
			}
		},

		/** get 応答のイベントを受ける */
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			var _this = this;
			this.setReadOnlyAllItems(false);
			switch(args.status){
			case 'OK':
				_this.getData2View(data);

				switch (this.options.opeTypeId) {
				//この画面に来る場合は編集or削除のみ
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					_this.setReadOnlyAllItems(true);
					_this._hideFooter();
					this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					_this.setReadOnlyAllItems(true);
					this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL;
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:		// 複製
					this.resetFocus();
					this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY;
					break;
				default:
					//一覧から来た場合、過去商品発注日・種別ラジオは動かせなくする。
					//発注区分変更不可
					this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
				clutil.viewReadonly($("#ca_submitType_div"));
				clutil.viewReadonly($("#ca_kindClearArea"));
				this.resetFocus();

				break;
				}

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.getData2View(data);
				this.setReadOnlyAllItems(true);
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				this.getData2View(data);
				this.setReadOnlyAllItems(true);
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.getData2View(data);
				this.setReadOnlyAllItems(true);
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);

				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				break;
			}
		},

		/**
		 * dataを表示
		 */
		getData2View : function(data){
			var _this = this;
			var getRsp = data.AMPOV0270GetRsp;
			// 2016/1/5 複製時の基準日を運用日に変更
			if(_this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				getRsp.order.orderDate = clcom.getOpeDate();

				// 2016/1/6 複製時に発注不可商品があった場合に通知
				if(getRsp.orderStoppedField != 0){
					this.orderStopWarn(getRsp.orderStoppedField);
				}
				// 2016/1/6 ここまで
			}
			// 2016/1/5 ここまで

			// サーバーデータを表示用に加工
			var orderType = getRsp.order.poTypeID;
			var base = this.viewBaseData(getRsp.order, getRsp.lModel);
			var other = this.viewOtherData(getRsp.other, getRsp.order);
			var order = this.viewOrderData(getRsp, orderType);

			// 表示領域設定
			this.setLoadInit(orderType, base);
			// 画面情報反映
			this.loadBaseArea(orderType, order, base, other, false);
			// その他情報表示
			this.loadOtherArea(other);
		},
		// 2016/1/6 複製時に発注不可商品があった場合に通知
		orderStopWarn:function(num){
			// メッセージ設定
			var msg = "";
			var f_first = true;
			if (num & ORDERSTOP.POBRAND) {
				msg = "ブランド";
				f_first = false;
			}
			if (num & ORDERSTOP.POBRANDSTYLE) {
				msg = this.addmsg(f_first, msg, "ブランドスタイル");
				f_first = false;
			}
			if (num & ORDERSTOP.POCLOTHCODE) {
				msg = this.addmsg(f_first, msg, "生地品番");
				f_first = false;
			}
			if (num & ORDERSTOP.POCLOTHORDERMAKER) {
				msg = this.addmsg(f_first, msg, "発注先");;
				f_first = false;
			}
			if (num & ORDERSTOP.POMAKERCODE) {
				msg = this.addmsg(f_first, msg, "メーカー品番");;
				f_first = false;
			}
			if (num & ORDERSTOP.POOPTGRP) {
				msg = this.addmsg(f_first, msg, "オプショングループ");
				f_first = false;
			}
			if (num & ORDERSTOP.POOPTION) {
				msg = this.addmsg(f_first, msg, "オプション");
				f_first = false;
			}
			if (num & ORDERSTOP.POPARENTBRAND) {
				msg = this.addmsg(f_first, msg, "親ブランド");
				f_first = false;
			}
			// ヘッダ表示
			msg = "次の項目が発注停止になっています。発注可能なものを選択して下さい。(" + msg + ")";
			clutil.mediator.trigger('onTicker', msg);
		},
		addmsg:function(flag, msg, addMsg){
			if(flag == false){
				msg = msg + "、" + addMsg;
			}
			else{
				msg = addMsg;
			}
			return msg;
		},
		// 2016/1/6 ここまで
		// 共通情報を表示形式に変換
		viewBaseData:function(order, model){
			var data = {
					// 過去日管理
					submitType:order.pastFlag,
					submitTypeOld:order.pastFlag,
					InsOldDateInput:clcom.getOpeDate(),
					// レコード情報
					recno:order.recno,
					state:order.state,
					poOrderID:order.poOrderID,
					firstID:order.firstID,
					poTypeID:order.poTypeID,
					// 店舗情報
					storeID:order.storeID,
					storeOldID:order.storeID,
					_view2data_storeID_cn:{
						id:order.storeID,
						code:order.storeCode,
						name:order.storeName
					},
					userID:order.userID,
					_view2data_userID_cn:{
						id:order.userID,
						code:order.userCode,
						name:order.userName
					},
					// お客様情報
					telNo1:order.telNo1,
					telNo2:order.telNo2,
					telNo3:order.telNo3,
					custName:order.custName,
					custNameKana:order.custNameKana,
					membNo:order.membNo,
					// 各区分情報
					orderType:order.poTypeID,
					M_st:0,M_jk:0,M_sl:0,M_ve:0,M_season:0,M_wash:0,M_cloth:0,M_brand:0,
					L_jk:0,L_jkSel:0,L_sk:0,L_skSel:0,L_sl:0,L_slSel:0,L_ve:0,L_veSel:0,L_brand:0,L_cloth:0,
					S_brand:0,S_cloth:0,S_clothOld:0,S_num:0
			};
			if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				// 2015/8/28 電話番号非表示対応 藤岡
				data = this.setAlertTelno(data);
			}

			if(order.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				data.M_st = order.targetFlagSuits;
				data.M_jk = order.targetFlagJK;
				data.M_sl = order.targetFlagSL;
				data.M_ve = order.targetFlagVest;
				data.M_season = order.seasonID;
				data.M_wash = order.washable;
				data.M_cloth = order.clothIDID;
				data.M_clothOld = order.clothIDID;
				data.M_brand = order.brandID;
			}
			else if(order.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				data.L_modelType = order.modelFlag;	// 1:ベーシック、2:プレシャス
				data.L_jk = 0;
				data.L_sk = 0;
				data.L_sl = 0;
				data.L_ve = 0;
				data.L_jkSel = model.jacket.modelID;
				if(model.jacket.modelID != 0){
					data.L_jk = 1;
				}
				data.L_skSel = model.skirt.modelID;
				if(model.skirt.modelID != 0){
					data.L_sk = 1;
				}
				data.L_slSel = model.pants.modelID;
				if(model.pants.modelID != 0){
					data.L_sl = 1;
				}
				data.L_veSel = model.vest.modelID;
				if(model.vest.modelID != 0){
					data.L_ve = 1;
				}
				data.L_cloth = order.clothIDID;
				data.L_brand = order.brandID;
			}
			else {
				data.S_cloth = order.clothIDID;
				data.S_clothOld = order.clothIDID;
				data.S_brand = order.brandID;
				data.S_num = order.cnt;
			}

			return data;
		},
		// その他情報を表示形式に変換
		viewOtherData:function(other, order){
			var data = {
					// 管理番号
					no:order.no,
					// 日付
					orderDate:order.orderDate,
					arrivalDate:order.arrivalDate,
					saleDate:order.saleDate,
					arrivalDateSave:this.setArrivalSave(order.hurryFlag, order.arrivalDate),
					express:order.hurryFlag,
					// メモ等
					otStoreAdjTypeID:other.otStoreAdjTypeID,
					otRcptNo:other.otRcptNo,
					otStoreMemo:other.otStoreMemo
			};
			return data;
		},
		// 2015/8/28 電話番号非表示対応 藤岡
		setAlertTelno:function(data){
			var msg = "顧客情報保護のため、電話番号を非表示としています。";

			data.telNo1 = "";
			data.telNo2 = "";
			//data.telNo3 = "";

			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				msg += "入力した際は、入力内容で上書きされます。";
				$(".cl_telno_required").removeClass("cl_required");
				$("#ca_telnoArea").removeClass("required");
			}
			else if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				msg = "電話番号を再入力してください。";
			}
			else{
				$(".cl_telno_required").removeClass("cl_required");
				$("#ca_telnoArea").removeClass("required");
			}
			this.validator.setErrorMsg($(".cl_telno_required"), msg, "alert");

			return data;
		},
		setArrivalSave:function(hurry, arrivalDate){
			var date = arrivalDate;
			if(hurry == 1){
				// 短納期の場合、基準日を標準に戻す
				date = clutil.addDate(date, 2);
			}
			return date;
		},
		// 区分固有情報を表示形式に変換
		viewOrderData:function(getRsp, orderType){
			var mJacket = getRsp.mJacket;
			var mSlacks = getRsp.mSlacks;
			var mVest = getRsp.mVest;
			//var lModel = getRsp.lModel;
			var lJacket = getRsp.lJacket;
			var lSkirt = getRsp.lSkirt;
			var lPants = getRsp.lPants;
			var lVest = getRsp.lVest;
			var sBody = getRsp.sBody;
			var sCollar = getRsp.sCollar;
			var sCuffs = getRsp.sCuffs;
			var sMain = getRsp.sMain;
			var sPktbtn = getRsp.sPktbtn;
			var sInitial = getRsp.sInitial;

			var data = {};

			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				data = {
						// メンズジャケット
						M_jk_style:mJacket.styleID,
						M_jk_size1:mJacket.sizeRow,
						M_jk_size2:mJacket.sizeID,
						M_jk_ventType:mJacket.jkVentTypeID,
						M_jk_amfType:mJacket.jkAmfTypeID,
						M_jk_liningType:mJacket.jkLiningTypeID,
						M_jk_pocketType:mJacket.jkSlantPocketTypeID,
						M_jk_layerButtonType:mJacket.jkButtonTypeID,
						M_jk_name:mJacket.jkNameTypeID,
						M_jk_nameKanji:this.setNameInput(amcm_type.AMCM_VAL_PO_NAME_TYPE_KANJI, mJacket.jkNameTypeID, mJacket.jkName),
						M_jk_nameFull:this.setNameInput(amcm_type.AMCM_VAL_PO_NAME_TYPE_FULL, mJacket.jkNameTypeID, mJacket.jkName),
						M_jk_nameIni:this.setNameInput(amcm_type.AMCM_VAL_PO_NAME_TYPE_INITIAL, mJacket.jkNameTypeID, mJacket.jkName),
						M_jk_nameMakeType:mJacket.jkNameFlagTypeID,
						M_jk_armLeft:mJacket.jkLSleeveAdjLen,
						M_jk_armRigth:mJacket.jkRSleeveAdjLen,
						M_jk_length:mJacket.jkAdjLen,
						M_jk_trunk:mJacket.jkTrunkAdjLen,
						M_jk_amfPayType:mJacket.jkAmfStitch,
						M_jk_sleeveButtonType:mJacket.jkSleeveButton,
						M_jk_changePocketType:mJacket.jkChangePocket,
						M_jk_cuffsType:mJacket.jkCuffs,
						M_jk_daibaType:mJacket.jkOdaiba,
						M_jk_summerType:mJacket.jkSummerType,
						M_jk_changeButtonType:this.setSelType(mJacket.jkChangeButton),
						M_jk_changeButtonSel:mJacket.jkChangeButton,
						M_jk_cuffsFirst:this.setSelType(mJacket.jkCuffs1stButton),
						M_jk_flowerHole:this.setSelType(mJacket.jkFlowerHole),
						M_jk_buttonThreadColorSel:this.setSelTypeThread(mJacket.jkCuffs1stButton, mJacket.jkFlowerHole),
						M_jk_changeLiningType:this.setSelType(mJacket.jkChangeLining),
						M_jk_changeLiningSel:mJacket.jkChangeLining,
						// メンズスラックス
						M_sl_style:mSlacks.styleID,
						M_sl_size1:mSlacks.sizeRow,
						M_sl_size2:mSlacks.sizeID,
						M_sl_spareType:mSlacks.slSpareTypeID,
						M_sl_bottomType:mSlacks.slBtmTypeID,
						M_sl_bottom:mSlacks.slBtmLen,
						//M_sl_bottomSpareType:mSlacks.slSpareBtmTypeID,
						M_sl_bottomSpareType:this.chkZeroID(amcm_type.AMCM_TYPE_COATTAIL_TYPE, mSlacks.slSpareBtmTypeID),
						M_sl_bottomSpare:mSlacks.slSpareBtmLen,
						M_sl_lengthLeft:mSlacks.slLLegLen,
						M_sl_lengthRight:mSlacks.slRLegLen,
						M_sl_weist:mSlacks.slWaistAdjLen,
						M_sl_adjuster:mSlacks.slAdjuster,
						M_sl_adjusterSpare:mSlacks.slSpareAdjuster,
						M_sl_changeButtonType:this.setSelType(mSlacks.slChangeButton),
						M_sl_changeButtonSel:mSlacks.slChangeButton,
						// メンズベスト
						M_ve_style:mVest.styleID,
						M_ve_size1:mVest.sizeRow,
						M_ve_size2:mVest.sizeID,
						M_ve_amfType:mVest.veFreeOptAmfStitch,
						M_ve_trunk:mVest.veTrunkAdjLen,
						M_ve_amfPayType:mVest.veOptAmfStitch,
						M_ve_changeButtonType:this.setSelType(mVest.veChangeButton),
						M_ve_changeButtonSel:mVest.veChangeButton,
						M_ve_changeLiningType:this.setSelType(mVest.veChangeLining),
						M_ve_changeLiningSel:mVest.veChangeLining
				};
			}
			else if(orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				data = {
						// レディスジャケット
						L_jk_style:lJacket.styleID,
						L_jk_size:lJacket.sizeID,
						L_jk_liningType:lJacket.jkLiningTypeID,
						L_jk_pocketType:lJacket.jkChestPocketTypeID,
						L_jk_name:lJacket.jkNameTypeID,
						L_jk_nameKanji:this.setNameInput(amcm_type.AMCM_VAL_PO_NAME_TYPE_KANJI, lJacket.jkNameTypeID, lJacket.jkName),
						L_jk_nameFull:this.setNameInput(amcm_type.AMCM_VAL_PO_NAME_TYPE_FULL, lJacket.jkNameTypeID, lJacket.jkName),
						L_jk_nameIni:this.setNameInput(amcm_type.AMCM_VAL_PO_NAME_TYPE_INITIAL, lJacket.jkNameTypeID, lJacket.jkName),
						L_jk_nameMakeType:lJacket.jkNameFlagTypeID,
						L_jk_armLeft:lJacket.jkLSleeveAdjLen,
						L_jk_armRight:lJacket.jkRSleeveAdjLen,
						L_jk_length:lJacket.jkAdjLen,
						L_jk_ventType:lJacket.jkVent,
						L_jk_cuffsPayType:lJacket.jkSleeveDesign,
						L_jk_cuffsType:lJacket.jkFreeSleeveDesign,
						// 2016/1/26 PRS追加削除

						L_jk_amfType:lJacket.jkAmfStitch,
						L_jk_pocketInnerType:lJacket.jkInsidePocket,
						// 2016/1/26 PRS追加対応
						L_jk_cuffsFirstType:lJacket.jkCuffs,
						L_jk_buttonHoleType:this.setSelType(lJacket.jkButtonHoleColorLine),
						L_jk_buttonHoleSel:lJacket.jkButtonHoleColorLine,
						// 2016/1/26 PRS追加対応ここまで
						L_jk_changeButtonType:this.setSelType(lJacket.jkChangeButton),
						L_jk_changeButtonSel:lJacket.jkChangeButton,
						L_jk_changeLiningType:this.setSelType(lJacket.jkChangeLining),
						L_jk_changeLiningSel:lJacket.jkChangeLining,
						// レディススカート
						L_sk_style:lSkirt.styleID,
						L_sk_size:lSkirt.sizeID,
						L_sk_length:lSkirt.skAdjLen,
						L_sk_waist:lSkirt.skWaistAdjLen,
						// レディスパンツ
						L_sl_style:lPants.styleID,
						L_sl_size:lPants.sizeID,
						L_sl_bottomType:this.chkLBottomType(lPants.paLLegLen, lPants.paRLegLen),
						L_sl_lengthLeft:lPants.paLLegLen,
						L_sl_lengthRight:lPants.paRLegLen,
						L_sl_waist:lPants.paWaistAdjLen,
						L_sl_bottomWidth:lPants.paLWidthAdjLen,
						L_sl_changeButtonType:this.setSelType(lPants.paChangeButton),
						L_sl_changeButtonSel:lPants.paChangeButton,
						// レディスベスト
						L_ve_style:lVest.styleID,
						L_ve_size:lVest.sizeID,
						L_ve_pocketType:lVest.veChestPocketTypeID,
						L_ve_length:lVest.veAdjLen,
						L_ve_amfType:lVest.veAmfStitch,
						L_ve_buckleType:lVest.veBuckle,
						L_ve_changeButtonType:this.setSelType(lVest.veChangeButton),
						L_ve_changeButtonSel:lVest.veChangeButton,
						L_ve_changeLiningType:this.setSelType(lVest.veChangeLining),
						L_ve_changeLiningSel:lVest.veChangeLining
				};
			}
			else {
				data = {
						// シャツボディ
						S_bodySel:sBody.bodyType,
						S_neckSel:sBody.neckSize,
						S_armLeftSel:sBody.leftDegree,
						S_armRigthSel:sBody.rightDegree,
						S_cuffsType:sBody.sleeveTypeID,
						S_shoulder:sBody.shoulder,
						S_chest:sBody.chest,
						S_waist:sBody.waist,
						S_bottom:sBody.bottom,
						S_length:sBody.len,
						S_cuffsLeft:sBody.leftCuff,
						S_cuffsRight:sBody.rightCuff,
						// シャツ衿
						S_collarSel:sCollar.collar1,
						S_miter:sCollar.collar2,
						S_clericSel:sCollar.cleric,
						S_collarType:sCollar.interLining,
						// カフス
						S_cuffsSel:sCuffs.cuffsType,
						// 身頃
						S_frontSel:sMain.front,
						S_backSel:sMain.back,
						S_amfSel:sMain.amfStitch,
						// ポケット
						S_pocketSel:sPktbtn.pocket,
						S_sewingType:sPktbtn.sewing,
						S_pocketChiefType:sPktbtn.pocketChief,
						S_buttonSel:sPktbtn.button,
						S_buttonHoleSel:sPktbtn.buttonHole,
						S_buttonThreadSel:sPktbtn.buttonThread,
						// ネーム
						S_name:sInitial.initial,
						S_nameDisp:sInitial.initialEn2,
						S_nameTypeSel:sInitial.form,
						S_namePlaceSel:sInitial.place,
						S_nameColorSel:sInitial.color
				};
			}
			return data;
		},
		// サーバーから未選択の値が返ってきたら、有効な値に変換
		chkZeroID:function(chkType, val){
			var disp = val;
			if(val == 0){
				if(chkType == amcm_type.AMCM_TYPE_COATTAIL_TYPE){
					// スペアなしの際の裾仕上げ(なし->裾仕上げなし)
					disp = amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE;
				}
			}
			return disp;
		},

		// 名称設定
		setNameInput:function(type, chkType, name){
			var disp = "";
			if(type == chkType){
				disp = name;
			}
			return disp;
		},
		// 名称設定(シャツ用)
		S_setNameInput:function(type, id, name){
			var disp = "";
			var chkType = this.getNameSelOptID(id);
			if(type == chkType){
				disp = name;
			}
			return disp;
		},
		// 指定IDから区分設定
		setSelType:function(id){
			var n = 0;
			if(id != 0){
				n = 1;
			}
			return n;
		},
		// 切羽袖口第一ボタン、フラワーホールのセレクター指定
		setSelTypeThread:function(id1, id2){
			var n = 0;
			if(id1 != 0){
				n = id1;
			}
			else if(id2 != 0){
				n = id2;
			}
			return n;
		},
		chkLBottomType:function(lenL, lenR){
			var val = 3;
			if(lenL > 0 && lenR > 0){
				val = 1;
			}
			return val;
		},


		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			// 画面エラー判定フラグ
			var flag = true;
			var url = clcom.appRoot + '/AMPO/AMPOV0271/AMPOV0271.html';
			this.validator.clear();
			this.validator.clearErrorMsg($('.cl_S_required'));
			this.validator.clearErrorMsg($('.cl_M_required'));
			this.validator.clearErrorMsg($('.cl_L_required'));

			if(!this.validator.valid()){
				flag = false;
			}

			// 画面情報取得
			var base =	 clutil.view2data(this.$('#ca_baseField'));
			var other =	 clutil.view2data(this.$('#ca_otherField'));
			var order;
			// 表示用に必要な区分値
			var submitType = $("input:radio[name=ca_submitType]:checked").val();
			var orderType = $("input:radio[name=ca_orderType]:checked").val();
			var msg = "";

			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				order =  clutil.view2data(this.$('#ca_M_Field'));
				// 品種がない
				if(base.M_st == 0 && base.M_jk == 0 && base.M_sl == 0 && base.M_ve == 0){
					flag = false;
					msg = '品種を1つ以上選択してください。';
					clutil.mediator.trigger('onTicker', msg);
				}
			}
			else if(orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				order =  clutil.view2data(this.$('#ca_L_Field'));
				// 品種がない
				if(base.L_jk == 0 && base.L_sk == 0 && base.L_sl == 0 && base.L_ve == 0){
					flag = false;
					msg = '品種を1つ以上選択してください。';
					clutil.mediator.trigger('onTicker', msg);
				}
			}
			else{
				order =  clutil.view2data(this.$('#ca_S_Field'));
				// シャツネームのオプションIDをコードに変換したものを保持(表示用)
				order.S_nameVal = this.getNameSelOptID(order.S_name);
				order.S_nameDisp = this.setNameDisp(order.S_nameVal, order);
			}

			if(base.submitType != 0 && base.submitType != 1){
				// 送信区分未選択
				flag = false;
				msg = '画面先頭の発注区分を選択してください。';
				clutil.mediator.trigger('onTicker', msg);
			}

			// 日付反転チェック
			var orderDate = other.orderDate;
			var arrivalDate = other.arrivalDate;
			var saleDate = other.saleDate;
			if(orderDate >= arrivalDate){
				this.validator.setErrorMsg($("#ca_orderDate"), clmsg.EPO0046);
				this.validator.setErrorMsg($("#ca_arrivalDate"), clmsg.EPO0046);
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				flag = false;
			}
			if(arrivalDate > saleDate){
				this.validator.setErrorMsg($("#ca_arrivalDate"), clmsg.EPO0072);
				this.validator.setErrorMsg($("#ca_saleDate"), clmsg.EPO0072);
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				flag = false;
			}

			// メモ欄
			if(this._onBlurChkOtstoreMemo(null, true) == false){
				flag = false;
			}
			// フリガナ
			if(this._onBlurNameKana(null, true) == false){
				flag = false;
			} else {
				base.custNameKana = $("#ca_custNameKana").val();
			}
			// シャツ枚数
			if(this._onS_BlurNum(null, true) == false){
				flag = false;
			}


			// 股下エラー
			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_MENS
					&& (base.M_st == 1 || base.M_sl == 1)
					&& ((order.M_sl_spareType == 1 && order.M_sl_bottomType != 3)
							|| (order.M_sl_spareType == 2 && (order.M_sl_bottomType != 3 || order.M_sl_bottomSpareType != 3)))){
				if(this._onBlurM_LeftCheckStep05() == false){
					flag = false;
				}
				if(this._onBlurM_RightCheckStep05() == false){
					flag = false;
				}
			}
			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS
					&& base.L_sl == 1 && order.L_sl_bottomType == 1){
				if(this._onBlurL_LeftCheckStep05() == false){
					flag = false;
				}
				if(this._onBlurL_RightCheckStep05() == false){
					flag = false;
				}
			}
			// 2016/1/26 PRS追加削除

			if(flag == false){
				return;
			}
			base = this.makeBaseData(base, other, orderType);
			order = this.makeOrderData(order, base, orderType);


			// 別窓で照会画面を起動
			clcom.pushPage(
					{
						url: url,
						args: {
							srchDate: clcom.getOpeDate(),
							opeTypeId: this.options.opeTypeId,
							savedCond: {

							},
							savedReq: {
								baseData:base,			// お客様情報とか
								otherData:other,		// レシート番号とか
								orderData:order,		// 各PO内容
								submitType:submitType,	// 送信区分(新規、FAX)
								orderType:orderType		// 種別(メンズ、レディス、シャツ)
							},
							sendData:{
								baseData:base,			// お客様情報とか
								otherData:other,		// レシート番号とか
								orderData:order,		// 各PO内容
								submitType:submitType,	// 送信区分(新規、FAX)
								orderType:orderType		// 種別(メンズ、レディス、シャツ)
							}
						},
						saved:{
							savedReq: {
								baseData:base,			// お客様情報とか
								otherData:other,		// レシート番号とか
								orderData:order,		// 各PO内容
								submitType:submitType,	// 送信区分(新規、FAX)
								orderType:orderType		// 種別(メンズ、レディス、シャツ)
							}
						},
						newWindow: false
					});
		},
		setNameDisp:function(val, order){
			var disp = "";
			if(val == amcm_type.AMCM_VAL_INITIAL_OPTION_TYPE_EXIST){
				disp = order.S_nameFull;
			}
			else{

			}
			return disp;
		},

		/**
		 * 送信用orderData成形
		 * @param order
		 * @param orderType
		 */
		makeBaseData: function(baseDate, otherData, orderType){
			// 表示用オブジェクト作成(通常はIDしか渡らないので)
			var base = baseDate;
			base.no = otherData.no;
			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				base.clothObj = this.makeObj(this.clothList, base.M_cloth);
				base.brandObj = this.makeObj(this.brandList, base.M_brand);
				base.seasonObj = this.makeObj(this.seasonList, base.M_season);
			}
			else if(orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				base.clothObj = this.makeObj(this.clothList, base.L_cloth);
				base.brandObj = this.makeObj(this.brandList, base.L_brand);
				base.modelJkObj = this.makeObj(this.modelList, base.L_jkSel);
				base.modelSkObj = this.makeObj(this.modelList, base.L_skSel);
				base.modelSlObj = this.makeObj(this.modelList, base.L_slSel);
				base.modelVeObj = this.makeObj(this.modelList, base.L_veSel);
			}
			else{
				base.clothObj = this.makeObj(this.clothList, base.S_cloth);
				base.brandObj = this.makeObj(this.brandList, base.S_brand);
			}

			return base;
		},
		/**
		 * 送信用オーダーデータ
		 * @param otherData
		 * @param orderType
		 * @returns
		 */
		makeOrderData : function(orderData, baseData, orderType){
			// 表示用オブジェクト作成
			var order = orderData;
			var base = baseData;

			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				if(base.M_st == 1){
					order.jkStyleObj = this.makeObj(this.styleStList, order.M_jk_style);
					order.jkSize1Obj = this.makeObj(this.sizeList1[TYPE.JK], order.M_jk_size1);
					order.jkSize2Obj = this.makeObj(this.sizeList2[TYPE.JK], order.M_jk_size2);
					order.jkChangeButtonObj = this.makeObj(this.changeStButtonList, order.M_jk_changeButtonSel);
					order.jkChangeLiningObj = this.makeObj(this.changeStLiningList, order.M_jk_changeLiningSel);
					order.jkButtonThreadColorSelObj = this.makeObj(this.buttonThreadColorSelList, order.M_jk_buttonThreadColorSel);

					order.slStyleObj = this.makeObj(this.styleSlList, order.M_sl_style);
					order.slSize1Obj = this.makeObj(this.sizeList1[TYPE.SL], order.M_sl_size1);
					order.slSize2Obj = this.makeObj(this.sizeList2[TYPE.SL], order.M_sl_size2);
				}
				if(base.M_jk == 1){
					order.jkStyleObj = this.makeObj(this.styleJkList, order.M_jk_style);
					order.jkSize1Obj = this.makeObj(this.sizeList1[TYPE.JK], order.M_jk_size1);
					order.jkSize2Obj = this.makeObj(this.sizeList2[TYPE.JK], order.M_jk_size2);
					order.jkChangeButtonObj = this.makeObj(this.changeJkButtonList, order.M_jk_changeButtonSel);
					order.jkChangeLiningObj = this.makeObj(this.changeJkLiningList, order.M_jk_changeLiningSel);
					order.jkButtonThreadColorSelObj = this.makeObj(this.buttonThreadColorSelList, order.M_jk_buttonThreadColorSel);
				}
				if(base.M_sl == 1){
					order.slStyleObj = this.makeObj(this.styleSlList, order.M_sl_style);
					order.slSize1Obj = this.makeObj(this.sizeList1[TYPE.SL], order.M_sl_size1);
					order.slSize2Obj = this.makeObj(this.sizeList2[TYPE.SL], order.M_sl_size2);
					order.slChangeButtonObj = this.makeObj(this.changeSlButtonList, order.M_sl_changeButtonSel);
				}
				if(base.M_ve == 1){
					order.veStyleObj = this.makeObj(this.styleVeList, order.M_ve_style);
					order.veSize1Obj = this.makeObj(this.sizeList1[TYPE.VE], order.M_ve_size1);
					order.veSize2Obj = this.makeObj(this.sizeList2[TYPE.VE], order.M_ve_size2);
					order.veChangeButtonObj = this.makeObj(this.changeVeButtonList, order.M_ve_changeButtonSel);
					order.veChangeLiningObj = this.makeObj(this.changeVeLiningList, order.M_ve_changeLiningSel);
				}
			}
			else if(orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				if(base.L_jk == 1){
					order.jkStyleObj = this.makeObj(this.styleJkList, order.L_jk_style);
					order.jkSize1Obj = this.makeObj(this.sizeList1[TYPE.L_JK], order.L_jk_size);
					order.jkChangeButtonObj = this.makeObj(this.changeJkButtonList, order.L_jk_changeButtonSel);
					order.jkChangeLiningObj = this.makeObj(this.changeJkLiningList, order.L_jk_changeLiningSel);
					// 2016/1/26 PRS追加対応
					// ベント
					order.jkVentObj = this.makeObjRadio("#ca_L_jk_ventType_", order.L_jk_ventType);
					// 無料リターンカフス
					order.jkCuffsObj = this.makeObjRadio("#ca_L_jk_cuffsType_", order.L_jk_cuffsType);
					// 有料リターンカフス
					order.jkCuffsPayObj = this.makeObjRadio("#ca_L_jk_cuffsPayType_", order.L_jk_cuffsPayType);
					// ボタンホールカラー糸
					order.jkButtonHoleColorLineObj = this.makeObj(this.buttonThreadColorSelList, order.L_jk_buttonHoleSel);
				}
				if(base.L_sk == 1){
					order.skStyleObj = this.makeObj(this.styleSkList, order.L_sk_style);
					order.skSize1Obj = this.makeObj(this.sizeList1[TYPE.L_SK], order.L_sk_size);
				}
				if(base.L_sl == 1){
					order.slStyleObj = this.makeObj(this.styleSlList, order.L_sl_style);
					order.slSize1Obj = this.makeObj(this.sizeList1[TYPE.L_SL], order.L_sl_size);
					order.slChangeButtonObj = this.makeObj(this.changeSlButtonList, order.L_sl_changeButtonSel);
				}
				if(base.L_ve == 1){
					order.veStyleObj = this.makeObj(this.styleVeList, order.L_ve_style);
					order.veSize1Obj = this.makeObj(this.sizeList1[TYPE.L_VE], order.L_ve_size);
					order.veChangeButtonObj = this.makeObj(this.changeVeButtonList, order.L_ve_changeButtonSel);
					order.veChangeLiningObj = this.makeObj(this.changeVeLiningList, order.L_ve_changeLiningSel);
				}
			}
			else{
				order.collarObj = this.makeObj(this.collarList, order.S_collarSel);
				order.cuffsObj = this.makeObj(this.cuffsList, order.S_cuffsSel);
				order.clericObj = this.makeObj(this.clericList, order.S_clericSel);
				order.frontObj = this.makeObj(this.frontTypeList, order.S_frontSel);
				order.backObj = this.makeObj(this.backTypeList, order.S_backSel);
				order.amfObj = this.makeObj(this.amfList, order.S_amfSel);
				order.pocketObj = this.makeObj(this.pocketList, order.S_pocketSel);
				order.buttonObj = this.makeObj(this.buttonList, order.S_buttonSel);
				order.buttonHoleObj = this.makeObj(this.buttonHoleList, order.S_buttonHoleSel);
				order.buttonThreadObj = this.makeObj(this.buttonThreadList, order.S_buttonThreadSel);
				order.nameTypeObj = this.makeObj(this.nameTypeList, order.S_nameTypeSel);
				order.namePlaceObj = this.makeObj(this.namePlaceList, order.S_namePlaceSel);
				order.nameColorObj = this.makeObj(this.nameColorList, order.S_nameColorSel);
				order.bodyObj = this.makeObj(this.bodyList, order.S_bodySel);
				order.neckObj = this.makeObj(this.neckList, order.S_neckSel);
				order.armLeftObj = this.makeObj(this.armLeftList, order.S_armLeftSel);
				order.armRigthObj = this.makeObj(this.armRigthList, order.S_armRigthSel);
			}
			return order;
		},

		// リストから、対象のオブジェクト生成
		makeObj:function(list, tgtID){
			var i;
			var obj = {
					id:0,
					code:"",
					name:"なし"
			};
			for(i = 0; i < list.length; i++){
				if(tgtID == list[i].id){
					obj = list[i];
				}
			}
			return obj;
		},
		// ラジオ値から、対象のオブジェクト生成
		makeObjRadio:function(pref, val){
			var $tgt = $(pref + val);
			var obj = {
					val : val,
					id : $tgt.attr("opt_id"),
					name : $tgt.attr("opt_name")
			};
			return obj;
		},
		setSelList:function($el, list){
			var opt = {
					$select	:$el,
					list:list,
					unselectedflag:true,
					selectpicker: {
						noButton: true
					}
			};
			clutil.cltypeselector3(opt);
		},
		setSelListNameDisp:function($el, list){
			var opt = {
					$select	:$el,
					list:list,
					namedisp:true,
					unselectedflag:true,
					selectpicker: {
						noButton: true
					}
			};
			clutil.cltypeselector3(opt);
		},



		/**
		 * 区切り線のあるセレクター
		 * @param $el
		 * @param list
		 */
		setSelListAddLine:function($el, list){
			var opt = {
					$select	:$el,
					list:list,
					unselectedflag:true,
					selectpicker: {
						noButton: true
					}
			};
			var msg = "裄丈の91-99cmと合わせても同料金です";
			this.cltypeselector4(opt, msg);
		},
		cltypeselector4: function(opt, msg){
			if (opt.list == null) {
				return;
			}

			var id = opt.idname == null ? "id" : opt.idname;
			var name = opt.namename == null ? "name" : opt.namename;
			var code = opt.codename == null ? "code" : opt.codename;
			var lineFlag = false;

			var typename;
			var html_source = '';
			opt.idMap = {};
			for (var i = 0; i < opt.list.length; i++) {
				typename = opt.list[i];

				if(lineFlag == false && typename.cost > 0){
					html_source += '<option class="aaa" value=0>' + "<div class='divider'></div><dt>" + msg + '</dt></option>';
					lineFlag = true;
				}


				// selectorの中身を作成する
				if (opt.namedisp == 1) {
					html_source += '<option value=' + typename[id] + '>' +
					typename[name] + '</option>';
				} else {
					var wkList = [];
					if(!_.isEmpty(typename[code])){
						wkList.push(typename[code]);
					}
					if(!_.isEmpty(typename[name])){
						wkList.push(typename[name]);
					}
					html_source += '<option value=' + typename[id] + '>' + wkList.join(':') + '</option>';
				}
				opt.idMap[typename[id]] = typename;
			}
			var nitem = opt.list.length;
			if(opt.unselectedflag){
				var emptyLabel = opt.emptyLabel || "&nbsp;";
				html_source = '<option value="0">' + emptyLabel + '</option>' + html_source;
				nitem++;
			}

			opt.$select.html('');
			opt.$select.html(html_source);
			opt.$select.selectpicker(opt.selectpicker).selectpicker('refresh');

			if(opt.list.length <= 1){
				// 選択肢が１つまたは無いので、変更できないようにする。
				var required = opt.$select.is('.requiredSelect > div > select');
				var multiple = opt.$select.is("[multiple]");
				// 1つで必須かつ複数選択でないとき、またはアイテムがないときにリードオンリーにする
				if (required && !multiple) {
					clutil.inputReadonly(opt.$select);
					if (opt.list.length) {
						opt.$select.selectpicker("val", opt.list[0].id);
					}
				} else if (nitem <= 1) {
					clutil.inputReadonly(opt.$select);
				}
			}
		},



		/**
		 * getリクエスト作成
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			var srchType = 1;
			var ope = this.options.opeTypeId;
			if (ope == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY
					|| ope == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
				srchType = 1;	// 参照
			} else if (ope == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
				srchType = 3;	// 削除
			} else {
				srchType = 2;	// 更新
			}
			var getReq = {
					// 共通ヘッダ

					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					// 取引先マスタ検索リクエスト
					AMPOV0270GetReq: {
						reqType :OPETYPE.AMPOV0270_REQTYPE_NOMAL,
						poTypeID:this.options.chkData[pgIndex].poTypeID,
						srchID: this.options.chkData[pgIndex].poOrderID,
						srchType: srchType
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMPOV0270UpdReq: {
					}
			};

			// 20160112 複製時のリクエストヘッダ修正
			if(ope ==  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				getReq.reqHead.opeTypeId =  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY;
			}
			_termChg_Flag = this.options.chkData[pgIndex].mode;
			return {
				resId: clcom.pageId,
				data: getReq
			};
		},



		/**
		 * 0.5cm刻みか確認する
		 * */
		_onBlurCheckStep05: function($el, min, max){
			var flag = true;
			var STEP_MSG = "0.5cm刻みで入力してください。";


			var _tgtNum = $el.val();
			var hankaku_msg = clutil.Validators.hankaku(_tgtNum);
			if(hankaku_msg){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				this.validator.setErrorMsg($el, hankaku_msg);
				flag = false;
			}
			else if( $el.val() == null || $el.val() == "" || $el.val() == 0){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				this.validator.setErrorMsg($el, clmsg.cl_required);
				flag = false;
			}
			else if(_tgtNum % 0.5 != 0){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				this.validator.setErrorMsg($el, STEP_MSG);
				flag = false;
			}
			else if(_tgtNum < min){
				var dispMin = min + ".0cm";
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				this.validator.setErrorMsg($el, clutil.fmtargs(clmsg.cl_min, [dispMin]));
				flag = false;
			}
			else if(_tgtNum > max){
				var dispMax = max + ".0cm";
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				this.validator.setErrorMsg($el, clutil.fmtargs(clmsg.cl_max, [dispMax]));
				flag = false;
			}
			else{
				this.validator.clearErrorMsg($el);
			}
			return flag;
		},

		// メンズスラックス股下エラー判定
		_onBlurM_LeftCheckStep05:function(){
			var flag = this._onBlurCheckStep05($("#ca_M_sl_lengthLeft"), 60, 99);
			return flag;
		},
		_onBlurM_RightCheckStep05:function(){
			var flag = this._onBlurCheckStep05($("#ca_M_sl_lengthRight"), 60, 99);
			return flag;
		},
		// レディススラックス股下エラー判定
		_onBlurL_LeftCheckStep05:function(){
			var flag = this._onBlurCheckStep05($("#ca_L_sl_lengthLeft"), 60, 98);
			return flag;
		},
		_onBlurL_RightCheckStep05:function(){
			var flag = this._onBlurCheckStep05($("#ca_L_sl_lengthRight"), 60, 98);
			return flag;
		},



		/**
		 * メモの中身を確認する
		 * */
		_onBlurChkOtstoreMemo: function(e, loadFlag){
			var flag = true;
			if(loadFlag != true){
				clutil.cltxtFieldLimit($(e.target));
			}
			if( this.$("#ca_otStoreMemo").val() == null || this.$("#ca_otStoreMemo").val() == ""){
				this.validator.clearErrorMsg(this.$('#ca_otStoreMemo'));
				return flag;
			}

			var _tgtText = this.$("#ca_otStoreMemo").val();
			if(_tgtText.length > 170 ){
				this.validator.setErrorMsg(this.$("#ca_otStoreMemo"), clutil.fmtargs(clmsg.cl_maxlen, ["170"]));
				if(loadFlag == true){
					clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				}
				flag = false;
			}else{
				num = _tgtText.match(/\n/g);
				if(num != null){
					if( num.length  > 3){
						this.validator.setErrorMsg(this.$("#ca_otStoreMemo"), clmsg.EPO0068);
						if(loadFlag == true){
							clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
						}
						flag = false;
					}else{
						this.validator.clearErrorMsg(this.$('#ca_otStoreMemo'));
					}
				}else{
					this.validator.clearErrorMsg(this.$('#ca_otStoreMemo'));
				}
			}
			return flag;
		},
		// フリガナエラーチェック
		_onBlurNameKana:function(e, loadFlag){
			var flag = true;
			var $el = $("#ca_custNameKana");
			var val = $el.val();

			// 入力内容変換
			this.validator.clearErrorMsg($el);
			val = clutil.zen2han(val);
			$el.val(val);

			// 半角チェック関数
			var isHalf = function (c) {
				c = c.charCodeAt(0);
				// 2015/10/28 半角->半角カナのみのチェックに変更
				return ((0xff61 <= c && c <= 0xff9f) || c == 0x0020);
//				return (c >= 0x20 && c < 0x81) || (c == 0xf8f0) ||
//				(c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
			};
			var len = _.filter(val.split(''), isHalf).length;
			var max = parseInt(20, 10);

			if(val == "" || val == null || val == undefined){
				// 必須チェック
				this.validator.setErrorMsg($el, clmsg.cl_required);
				flag = false;
			}
			else if(val.length > 20){
				// 文字数チェック(20桁以下)
				this.validator.setErrorMsg($el, clutil.fmtargs(clmsg.cl_length_long1, ["20"]));
				flag = false;
			}
			else if((max && len > max) || len !== val.length){
				// 半角チェック
				this.validator.setErrorMsg($el, "半角カナのみ入力可能です。");
				flag = false;
			}

			if(loadFlag == true && flag == false){
				// 登録ボタン押下時のチェックならヘッダエラー表示
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
			}

			return flag;

		},
		// シャツ枚数
		_onS_BlurNum:function(e, loadFlag){
			var flag = true;
			var type = $("input:radio[name=ca_orderType]:checked").val();
			var $el = $("#ca_S_num");

			this.validator.clearErrorMsg($el);
			if(type == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				var num = $el.val();
				if(num == "" || num == null || num == undefined){
					// 必須チェック
					this.validator.setErrorMsg($el, clmsg.cl_required);
					flag = false;
				}
				else if(isNaN(num) == true){
					// 数字チェック
					this.validator.setErrorMsg($el, clmsg.cl_numeric1);
					flag = false;
				}
				else if(num.length > 2){
					// 文字数チェック(2桁以下)
					this.validator.setErrorMsg($el, clutil.fmtargs(clmsg.cl_length_long1, ["2"]));
					flag = false;
				}
				else if(num <= 0){
					// ゼロチェック(1以上)
					this.validator.setErrorMsg($el, clutil.fmtargs(clmsg.cl_min, ["1"]));
					flag = false;
				}

				if(loadFlag == true && flag == false){
					// 登録ボタン押下時のチェックならヘッダエラー表示
					clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				}
			}
			return flag;
		},


		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(args) {
			var base = args.savedReq.baseData;
			var other = args.savedReq.otherData;
			var order = args.savedReq.orderData;
			var orderType = base.orderType;

			// 2016/2/17 店着日不正対応
			if(clcom.returnValue.arrivalDate!=0){
				other.arrivalDate = clcom.returnValue.arrivalDate;
			}
			// 2016/2/17 ここまで

			// 表示領域設定
			this.setLoadInit(orderType, base);
			// 画面情報反映
			this.loadBaseArea(orderType, order, base, other, true);
			// その他条件反映
			this.loadOtherArea(other);
		},
		setLoadInit:function(type, base){
			// オプション非表示
			$(".ca_M_jkOptElem").hide();
			$(".ca_M_slOptElem").hide();
			$(".ca_M_veOptElem").hide();
			$(".ca_L_jkOptElem").hide();
			$(".ca_L_slOptElem").hide();
			$(".ca_L_veOptElem").hide();
			$(".ca_S_optElem").hide();

			// 各区分の基本表示
			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				this.showMens();
				clutil.viewReadonly(this.$(".ca_L_SelArea"));
				clutil.viewReadonly(this.$("#ca_L_brandArea"));
				clutil.viewReadonly(this.$("#ca_L_clothArea"));
				clutil.viewReadonly(this.$("#ca_S_clothArea"));
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				this.showLedies();
				clutil.viewReadonly(this.$("#ca_S_clothArea"));
			}
			else {
				this.showShirt();
				clutil.viewReadonly(this.$(".ca_L_SelArea"));
				clutil.viewReadonly(this.$("#ca_L_brandArea"));
				clutil.viewReadonly(this.$("#ca_L_clothArea"));
			}
			// 各白箱設定
			this.setDivs(true, type, base);
		},
		// 基本情報場所の表示設定
		loadBaseArea:function(orderType, order, base, other, f_load){
			var _this = this;

			// 送信区分の背景色、過去日状態
			this._onSubmitTypeToggle(null, true, base.submitType);
			var sel1 = null;
			var sel2 = null;
			var sel3 = null;

			// セレクター
			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				if(base.M_st == 1){
					clutil.viewReadonly($("#ca_M_jkArea"));
					clutil.viewReadonly($("#ca_M_slArea"));
				}
				if(base.M_jk == 1){
					clutil.viewReadonly($("#ca_M_stArea"));
					clutil.viewReadonly($("#ca_M_slArea"));
				}
				if(base.M_sl == 1){
					clutil.viewReadonly($("#ca_M_stArea"));
					clutil.viewReadonly($("#ca_M_jkArea"));
				}
				sel1 = this.makeSeasonSel(true, orderType, $("#ca_M_season"));
				sel2 = this.makeClothSel(true, orderType, $("#ca_M_cloth"), base, other);
				sel3 = this.makeBrandSel(true, orderType, $("#ca_M_brand"), base, other);
			}
			else if(orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				// モデルのチェックボックス-セレクター処理
				if(base.L_jk != 1){
					clutil.viewReadonly($("#ca_L_jkSelArea"));
				}
				if(base.L_sk != 1){
					clutil.viewReadonly($("#ca_L_skSelArea"));
				}
				if(base.L_sl != 1){
					clutil.viewReadonly($("#ca_L_slSelArea"));
				}
				if(base.L_ve != 1){
					clutil.viewReadonly($("#ca_L_veSelArea"));
				}
				sel1 = this.makeBrandSel(true, orderType, $("#ca_L_brand"), base, other);
				sel2 = this.makeModelSel(true, other);
			}
			else{
				sel1 = this.makeClothSel(true, orderType, $("#ca_S_cloth"), base, other);
				sel2 = this.makeBrandSel(true, orderType, $("#ca_S_brand"), base, other);
			}

			$.when(sel1, sel2).done(function(){
				// 生地取得条件にモデルIDが必要なので、モデル取得の後に生地作成
				// モデルセレクター再設定 T74対応 2015/9/3
				if(orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
					// モデルセレクター再設定 T74対応 2015/9/3
					_this._onL_ModelTypeToggle(null, true, base.L_modelType);
					// 生地セレクター作成(ここでやらないとモデルリスト指定ができないため)
					sel3 = _this.makeClothSel(true, amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_cloth"), base, other);
				}
				$.when(sel3).done(function(){
					clutil.data2view($('#ca_baseField'), base);
					if(_this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
						//複製なら、レコード条件だけリセット
						_this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
						clutil.datepicker(_this.$("#ca_orderDate")).datepicker('setIymd', clcom.getOpeDate());
						_this.getArrivalDate(true, orderType, base, null);
						clutil.data2view($('#ca_recArea'), recClearObj);
						$("#ca_no").val("");
					}
					// 各区分処理
					// ここでやらないと非同期処理でセレクターが入らなくなったりするので注意
					_this.loadOrderArea(orderType, order, base, other, f_load);
				});
			});
		},
		// その他情報場所の表示設定
		loadOtherArea:function(other){
			clutil.data2view($('#ca_otherField'), other);
			// 2016/2/17 店舗着日不正対応
			if(clcom.returnValue!=undefined && clcom.returnValue.arrivalDate!=0){
				this.changeArrivalDateWarn();
			}
		},
		// 店着日変更通知
		changeArrivalDateWarn:function(){
			var msg = "店舗着日を変更しました。";
			this.validator.setErrorMsg($("#ca_arrivalDate"), msg, "alert");
		},
		// 区分別情報場所の表示設定
		loadOrderArea:function(orderType, order, base, other, f_load){
			var _this = this;

			var jkFlag = false;
			var skFlag = false;
			var slFlag = false;
			var veFlag = false;

			var comSel1 = null;
			var comOptSel1 = null;
			var comOptSel2 = null;
			var comOptSel3 = null;
			var comOptSel4 = null;

			var sizeJkSel = null;
			var sizeSkSel = null;
			var sizeSlSel = null;
			var sizeVeSel = null;

			clutil.viewReadonly($(".ca_M_Div"));
			clutil.viewReadonly($(".ca_L_Div"));
			clutil.viewReadonly($(".ca_S_Div"));
			this.disabledSliderAll();

			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					clutil.viewRemoveReadonly($(".ca_M_brandEffectDiv"));
				}
				comSel1 = this.makeStyleSel(true, orderType, base, other);
				comOptSel1 = this.makeStyleOptSel(true, orderType, TYPE.ALL, null, base, other);
				if(base.M_st == 1){
					jkFlag = true;
					slFlag = true;
					// 編集可能
					this.abledSlider_M_jk();
					this.abledSlider_M_sl();
					clutil.viewRemoveReadonly($("#ca_M_jkDiv"));
					clutil.viewRemoveReadonly($("#ca_M_slDiv"));
					$(".cl_M_jk_required").addClass("cl_required");
					$(".cl_M_sl_required").addClass("cl_required");
					//オプション表示
					this._onM_jk_ChangeNameSel(true, order.M_jk_name);
					this._onM_jk_ChangeButtonTypeToggle(null, true, order.M_jk_changeButtonType);
					this._onM_jk_ChangeLiningTypeToggle(null, true, order.M_jk_changeLiningType);
					//this._onM_jk_liningTypeToggle(null, true, order.M_jk_liningType);
					if(order.M_jk_cuffsFirst == 1 || order.M_jk_flowerHole == 1){
						$("#ca_M_jk_buttonThreadColorDiv").show();
					}

					var obj = {
							M_sl_spareType:order.M_sl_spareType,
							M_sl_bottomType:order.M_sl_bottomType,
							M_sl_bottomSpareType:order.M_sl_bottomSpareType
					};
					this._onM_sl_SpareTypeToggle(null, true, obj);
					this._onM_sl_BottomTypeToggle(null, true, obj);
					this._onM_sl_BottomSpareTypeToggle(null, true, obj);
					$("#ca_M_sl_changeButtonTypeDiv").hide();

					sizeJkSel = this.make_M_Size1(true, order.M_jk_style, TYPE.JK
							, $("#ca_M_jk_size1"), base, order.M_jk_size1, $("#ca_M_jk_size2"));
					sizeSlSel = this.make_M_Size1(true, order.M_sl_style, TYPE.SL
							, $("#ca_M_sl_size1"), base, order.M_sl_size1, $("#ca_M_sl_size2"));
				}
				if(base.M_jk == 1){
					jkFlag = true;
					this.abledSlider_M_jk();
					clutil.viewRemoveReadonly($("#ca_M_jkDiv"));
					$(".cl_M_jk_required").addClass("cl_required");
					this._onM_jk_ChangeNameSel(true, order.M_jk_name);
					this._onM_jk_ChangeButtonTypeToggle(null, true, order.M_jk_changeButtonType);
					this._onM_jk_ChangeLiningTypeToggle(null, true, order.M_jk_changeLiningType);
					//this._onM_jk_liningTypeToggle(null, true, order.M_jk_liningType);
					if(order.M_jk_cuffsFirst == 1 || order.M_jk_flowerHole == 1){
						$("#ca_M_jk_buttonThreadColorDiv").show();
					}
					sizeJkSel = this.make_M_Size1(true, order.M_jk_style, TYPE.JK
							, $("#ca_M_jk_size1"), base, order.M_jk_size1, $("#ca_M_jk_size2"));

				}
				if(base.M_sl == 1){
					slFlag = true;
					this.abledSlider_M_sl();
					clutil.viewRemoveReadonly($("#ca_M_slDiv"));
					$(".cl_M_sl_required").addClass("cl_required");
					this._onM_sl_ChangeButtonTypeToggle(null, true, order.M_sl_changeButtonType);

					var obj = {
							M_sl_spareType:order.M_sl_spareType,
							M_sl_bottomType:order.M_sl_bottomType,
							M_sl_bottomSpareType:order.M_sl_bottomSpareType
					};
					this._onM_sl_SpareTypeToggle(null, true, obj);
					this._onM_sl_BottomTypeToggle(null, true, obj);
					this._onM_sl_BottomSpareTypeToggle(null, true, obj);

					sizeSlSel = this.make_M_Size1(true, order.M_sl_style, TYPE.SL
							, $("#ca_M_sl_size1"), base, order.M_sl_size1, $("#ca_M_sl_size2"));

				}
				if(base.M_ve == 1){
					veFlag = true;
					this.abledSlider_M_ve();
					clutil.viewRemoveReadonly($("#ca_M_veDiv"));
					$(".cl_M_ve_required").addClass("cl_required");
					this._onM_ve_ChangeButtonTypeToggle(null, true, order.M_ve_changeButtonType);
					this._onM_ve_ChangeLiningTypeToggle(null, true, order.M_ve_changeLiningType);

					sizeVeSel = this.make_M_Size1(true, order.M_ve_style, TYPE.VE
							, $("#ca_M_ve_size1"), base, order.M_ve_size1, $("#ca_M_ve_size2"));

				}

				// 非同期なので後に処理をまわす
				$.when(comSel1, comOptSel1, sizeJkSel, sizeSlSel, sizeVeSel).done(function(){
					clutil.data2view($('#ca_M_Field'), order);
					_this.loadSlider(amcm_type.AMCM_VAL_PO_CLASS_MENS, order, base);
					if(_this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
							&& _this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
						_this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_MENS, base.M_brand);

						// 裏仕様が総裏ならサマー不可(オプションセレクターの後でないと動かない)
						_this._onM_jk_liningTypeToggle(null, true, order.M_jk_liningType);
					}
					else{
						_this.setReadOnlyAllItems(true);
					}

					// チェックがないものはクリア
					if(jkFlag == false){
						clutil.data2view($("#ca_M_jk_styleArea"), M_jkStyleClearObj);
						_this.M_lockUnselectJkStyle();
					}
					if(slFlag == false){
						clutil.data2view($("#ca_M_sl_styleArea"), M_slStyleClearObj);
						_this.M_lockUnselectSlStyle();
					}
					if(veFlag == false){
						clutil.data2view($("#ca_M_ve_styleArea"), M_veStyleClearObj);
						_this.M_lockUnselectVeStyle();
					}
				});
			}
			else if(orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					clutil.viewRemoveReadonly($(".ca_L_clothEffectDiv"));
				}
				comSel1 = this.L_makeStyleSel(true, base, other);
				if(base.L_jk == 1){
					jkFlag = true;
					// 編集可能
					this.abledSlider_L_jk();
					clutil.viewRemoveReadonly($("#ca_L_jkDiv"));
					$(".cl_L_jk_required").addClass("cl_required");
					//オプション表示
					comOptSel1 = this.makeStyleOptSel(true, orderType, TYPE.L_JK, order.L_jk_style, base, other);
					this._onL_jk_ChangeNameSel(true, order.L_jk_name);
					this._onL_jk_ChangeButtonTypeToggle(null, true, order.L_jk_changeButtonType);
					this._onL_jk_ChangeLiningTypeToggle(null, true, order.L_jk_changeLiningType);
					this._onL_jk_ChangeButtonHoleTypeToggle(null, true, order.L_jk_buttonHoleType);
					// サイズセレクター
					sizeJkSel = this.make_L_S_Size(true, order.L_jk_style, amcm_type.AMCM_VAL_PO_CLASS_LADYS
							, TYPE.L_JK, $("#ca_L_jk_size"), base);
				}
				if(base.L_sk == 1){
					skFlag = true;
					// 編集可能
					this.abledSlider_L_sk();
					clutil.viewRemoveReadonly($("#ca_L_skDiv"));
					$(".cl_L_sk_required").addClass("cl_required");
					// オプション表示
					comOptSel2 = this.makeStyleOptSel(true, orderType, TYPE.L_SK, order.L_sk_style, base, other);
					// サイズセレクター
					sizeSkSel = this.make_L_S_Size(true, order.L_sk_style, amcm_type.AMCM_VAL_PO_CLASS_LADYS
							, TYPE.L_SK, $("#ca_L_sk_size"), base);
				}
				if(base.L_sl == 1){
					slFlag = true;
					// 編集可能
					this.abledSlider_L_sl();
					clutil.viewRemoveReadonly($("#ca_L_slDiv"));
					$(".cl_L_sl_required").addClass("cl_required");
					//オプション表示
					comOptSel3 = this.makeStyleOptSel(true, orderType, TYPE.L_SL, order.L_sl_style, base, other);
					this._onL_sl_ChangeButtonTypeToggle(null, true, order.L_sl_changeButtonType);
					this._onL_sl_BottomTypeToggle(null, true, order.L_sl_bottomType);
					// サイズセレクター
					sizeSlSel = this.make_L_S_Size(true, order.L_sl_style, amcm_type.AMCM_VAL_PO_CLASS_LADYS
							, TYPE.L_SL, $("#ca_L_sl_size"), base);
				}
				if(base.L_ve == 1){
					veFlag = true;
					this.abledSlider_L_ve();
					clutil.viewRemoveReadonly($("#ca_L_veDiv"));
					$(".cl_L_ve_required").addClass("cl_required");
					comOptSel4 = this.makeStyleOptSel(true, orderType, TYPE.L_VE, order.L_ve_style, base, other);
					this._onL_ve_ChangeButtonTypeToggle(null, true, order.L_ve_changeButtonType);
					this._onL_ve_ChangeLiningTypeToggle(null, true, order.L_ve_changeLiningType);
					sizeVeSel = this.make_L_S_Size(true, order.L_ve_style, amcm_type.AMCM_VAL_PO_CLASS_LADYS
							, TYPE.L_VE, $("#ca_L_ve_size"), base);
				}
				// 非同期なので後に処理をまわす
				$.when(comSel1, comOptSel1, comOptSel2, comOptSel3, comOptSel4
						, sizeJkSel, sizeSkSel, sizeSlSel, sizeVeSel).done(function(){
							// 2016/2/4 ベント、無料リターンカフス、有料リターンカフスのIDをラジオ値に変換
							if(f_load==false){
								order = _this.id2radio(orderType, order);
							}

							clutil.data2view($('#ca_L_Field'), order);
							_this.loadSlider(amcm_type.AMCM_VAL_PO_CLASS_LADYS, order, base);
							_this._onL_jk_ChangeSize(null, true, order.L_jk_size, order.L_jk_length, order.L_jk_armLeft, order.L_jk_armRight);
							_this._onL_sk_ChangeSize(null, true, order.L_sk_size, order.L_sk_length);
							if(_this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
									&& _this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
								_this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_LADYS, base.L_brand);
							}
							else{
								_this.setReadOnlyAllItems(true);
							}

							// チェックがないものはクリア
							if(jkFlag == false){
								clutil.data2view($("#ca_L_jk_styleArea"), L_jkStyleClearObj);
								_this.L_lockUnselectJkStyle();
							}
							else{
								_this.loadL_namePocket(base, order);
								_this.chkL_sl_ChangeButtonTypeSet(true, 1);
								// 2016/1/26 PRS追加削除
							}

							if(skFlag == false){
								clutil.data2view($("#ca_L_sk_styleArea"), L_skStyleClearObj);
								_this.L_lockUnselectSkStyle();
							}
							if(slFlag == false){
								clutil.data2view($("#ca_L_sl_styleArea"), L_slStyleClearObj);
								_this.L_lockUnselectSlStyle();
							}
							if(veFlag == false){
								clutil.data2view($("#ca_L_ve_styleArea"), L_veStyleClearObj);
								_this.L_lockUnselectVeStyle();
							}
						});
			}
			else{
				if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					clutil.viewRemoveReadonly($(".ca_S_brandEffectDiv"));
					clutil.viewRemoveReadonly($("#ca_S_Field"));
					this.abledSlider_S();
				}
				$(".cl_S_required").addClass("cl_required");
				comOptSel1 = this.makeStyleOptSel(true, orderType, null, null, base, other);
				// 非同期なので後に処理をまわす
				$.when(comOptSel1).done(function(){
						// 名称設定(オプションセレクターがないと値決定できないためここでやる)
						order.S_nameFull=_this.S_setNameInput(amcm_type.AMCM_VAL_INITIAL_OPTION_TYPE_EXIST
								, order.S_name, order.S_nameDisp),
								order.S_nameIni=_this.S_setNameInput(amcm_type.AMCM_VAL_INITIAL_OPTION_TYPE_NOT_EXIST
										, order.S_name, order.S_nameDisp),

						// 首周りセレクター入れ替え 2015/9/3 藤岡
						_this._onS_ChangeBody(null, true, order.S_bodySel);

						_this._onS_ChangeCollar(null, true, order);
						_this._onS_ChangeCuffs(null, true, order);
						_this._onS_CuffsTypeToggle(null, true, order.S_cuffsType);
						clutil.data2view($('#ca_S_Field'), order);
						_this.loadSlider(amcm_type.AMCM_VAL_PO_CLASS_SHIRT, order, base);
						_this._onS_ChangeNameSel(null, true, order.S_name, order.S_nameTypeSel);
						var amfFlag = _this.chkS_AmfLoadFlag(order);
						_this.chkS_Amf(amfFlag);

						if(_this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
								&& _this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
							_this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_SHIRT, base.S_brand);
						}
						else{
							_this.setReadOnlyAllItems(true);
						}
				});
			}
		},
		loadL_namePocket:function(base, order){
			if(this.chkL_modelPRE(base.L_jkSel) == false
					&& order.L_jk_name != amcm_type.AMCM_VAL_PO_NAME_TYPE_NONE){
				this.chkInnerPocketL(false, TYPE.ON);
			}
		},
		//idからラジオの値に変換
		id2radio:function(orderType, order){
			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				order.L_jk_ventType = this.list2radio(this.ventObjList, order.L_jk_ventType, $(".ca_L_jk_ventRadio"));
				order.L_jk_cuffsPayType = this.list2radio(this.cuffsPayObjList, order.L_jk_cuffsPayType, $(".ca_L_jk_cuffsPayRadio"));
				order.L_jk_cuffsType = this.list2radio(this.cuffsObjList, order.L_jk_cuffsType, $(".ca_L_jk_cuffsRadio"));
			}
			return order;
		},
		// リストからラジオ値取得
		list2radio:function(list, val, $tgt){
			var type = 0;
			// 指定クラスを持ってるペインからID取得
			$tgt.each(function(i) {
				opt_id = $(this).attr('opt_id');
			    if(opt_id == val){
			    	type = $(this).val();
			    	return false;
			    }
			});

			return type;
		},

		// シャツAMFの表示/非表示判定
		chkS_AmfLoadFlag:function(order){
			var flag = true;
			if(order.S_miter == 1){
				flag = false;
			}
			if(this.chkS_Amf_Collar(order) == false){
				flag = false;
			}
			if(this.chkS_Amf_Cuffs(order) == false){
				flag = false;
			}
			return flag;
		},
		chkS_Amf_Collar:function(order){
			var list = this.collarList;
			var i = 0;
			var flag = true;
			for(i=0; i<list.length; i++){
				if(list[i].id == order.S_collarSel
						&& list[i].amfTypeFlag == 1){
					flag = false;
					break;
				}
			}
			return flag;
		},
		chkS_Amf_Cuffs:function(order){
			var list = this.cuffsList;
			var i = 0;
			var flag = true;
			for(i=0; i<list.length; i++){
				if(list[i].id == order.S_cuffsSel
						&& list[i].amfTypeFlag == 1){
					flag = false;
					break;
				}
			}
			return flag;
		},



		loadSlider:function(type, order, base){
			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				if(base.M_st == 1){
					this.makeSlider($("#ca_M_jk_armLeft_slider"), $("#ca_M_jk_armLeft")
							, order.M_jk_armLeft, -5.0, 5.0, 0.5);
					this.makeSlider($("#ca_M_jk_armRigth_slider"), $("#ca_M_jk_armRigth")
							, order.M_jk_armRigth, -5.0, 5.0, 0.5);
					this.makeSlider($("#ca_M_jk_length_slider"), $("#ca_M_jk_length")
							, order.M_jk_length, -5.0, 5.0, 0.5);
					this.makeSlider($("#ca_M_jk_trunk_slider"), $("#ca_M_jk_trunk")
							, order.M_jk_trunk, -5.0, 5.0, 0.5);

					this.makeSliderNonSign($("#ca_M_sl_bottom_slider"), $("#ca_M_sl_bottom")
							, order.M_sl_bottom, 2.0, 5.0, 0.5);
					this.makeSliderNonSign($("#ca_M_sl_bottomSpare_slider"), $("#ca_M_sl_bottomSpare")
							, order.M_sl_bottomSpare, 2.0, 5.0, 0.5);
					this.makeSlider($("#ca_M_sl_weist_slider"), $("#ca_M_sl_weist")
							, order.M_sl_weist, -3.0, 3.0, 0.5);
				}
				if(base.M_jk == 1){
					this.makeSlider($("#ca_M_jk_armLeft_slider"), $("#ca_M_jk_armLeft")
							, order.M_jk_armLeft, -5.0, 5.0, 0.5);
					this.makeSlider($("#ca_M_jk_armRigth_slider"), $("#ca_M_jk_armRigth")
							, order.M_jk_armRigth, -5.0, 5.0, 0.5);
					this.makeSlider($("#ca_M_jk_length_slider"), $("#ca_M_jk_length")
							, order.M_jk_length, -5.0, 5.0, 0.5);
					this.makeSlider($("#ca_M_jk_trunk_slider"), $("#ca_M_jk_trunk")
							, order.M_jk_trunk, -5.0, 5.0, 0.5);
				}
				if(base.M_sl == 1){
					this.makeSliderNonSign($("#ca_M_sl_bottom_slider"), $("#ca_M_sl_bottom")
							, order.M_sl_bottom, 2.0, 5.0, 0.5);
					this.makeSliderNonSign($("#ca_M_sl_bottomSpare_slider"), $("#ca_M_sl_bottomSpare")
							, order.M_sl_bottomSpare, 2.0, 5.0, 0.5);
					this.makeSlider($("#ca_M_sl_weist_slider"), $("#ca_M_sl_weist")
							, order.M_sl_weist, -3.0, 3.0, 0.5);
				}
				if(base.M_ve == 1){
					this.makeSlider($("#ca_M_ve_trunk_slider"), $("#ca_M_ve_trunk")
							, order.M_ve_trunk, -8.0, 8.0, 0.5);
				}
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				if(base.L_jk == 1){
					this.makeSlider($("#ca_L_jk_armLeft7_slider"), $("#ca_L_jk_armLeft")
							, order.L_jk_armLeft, -7.0, 7.0, 0.5);
					this.makeSlider($("#ca_L_jk_armLeft2_slider"), $("#ca_L_jk_armLeft")
							, order.L_jk_armLeft, -2.0, 2.0, 0.5);
					this.makeSlider($("#ca_L_jk_armRight7_slider"), $("#ca_L_jk_armRight")
							, order.L_jk_armRight, -7.0, 7.0, 0.5);
					this.makeSlider($("#ca_L_jk_armRight2_slider"), $("#ca_L_jk_armRight")
							, order.L_jk_armRight, -2.0, 2.0, 0.5);
					this.makeSlider($("#ca_L_jk_length5_slider"), $("#ca_L_jk_length")
							, order.L_jk_length, -5.0, 5.0, 0.5);
					this.makeSlider($("#ca_L_jk_length3_slider"), $("#ca_L_jk_length")
							, order.L_jk_length, -3.0, 3.0, 0.5);
					this.makeSlider($("#ca_L_jk_length2_slider"), $("#ca_L_jk_length")
							, order.L_jk_length, -2.0, 2.0, 0.5);
				}
				if(base.L_sk == 1){
					this.makeSlider($("#ca_L_sk_length10_slider"), $("#ca_L_sk_length")
							, order.L_sk_length, -10.0, 10.0, 0.5);
					this.makeSlider($("#ca_L_sk_length5_slider"), $("#ca_L_sk_length")
							, order.L_sk_length, -5.0, 5.0, 0.5);
					this.makeSlider($("#ca_L_sk_waist_slider"), $("#ca_L_sk_waist")
							, order.L_sk_waist, -3.0, 3.0, 0.5);
				}
				if(base.L_sl == 1){
					this.makeSlider($("#ca_L_sl_waist_slider"), $("#ca_L_sl_waist")
							, order.L_sl_waist, -3.0, 3.0, 0.5);
					this.makeSlider($("#ca_L_sl_bottomWidth_slider"), $("#ca_L_sl_bottomWidth")
							, order.L_sl_bottomWidth, -2.0, 2.0, 0.5);
				}
				if(base.L_ve == 1){
					this.makeSlider($("#ca_L_ve_length_slider"), $("#ca_L_ve_length")
							, order.L_ve_length, -3.0, 3.0, 0.5);
				}
			}
			else{
				this.makeSlider($("#ca_S_shoulder_slider"), $("#ca_S_shoulder")
						, order.S_shoulder, -2.0, 2.0, 1.0);
				this.makeSlider($("#ca_S_chest_slider"), $("#ca_S_chest")
						, order.S_chest, -2.0, 2.0, 1.0);
				this.makeSlider($("#ca_S_waist_slider"), $("#ca_S_waist")
						, order.S_waist, -6.0, 6.0, 2.0);
				this.makeSlider($("#ca_S_bottom_slider"), $("#ca_S_bottom")
						, order.S_bottom, -6.0, 6.0, 2.0);
				this.makeSlider($("#ca_S_length_slider"), $("#ca_S_length")
						, order.S_length, -8.0, 8.0, 2.0);
				this.makeSlider($("#ca_S_cuffsLeft_slider"), $("#ca_S_cuffsLeft")
						, order.S_cuffsLeft, -2.0, 2.0, 1.0);
				this.makeSlider($("#ca_S_cuffsRight_slider"), $("#ca_S_cuffsRight")
						, order.S_cuffsRight, -2.0, 2.0, 1.0);
			}
		},

		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
			var data = arg.data;		// GET応答データ

			return data;
		},

		_hideFooter: function(){
			var opt = this.mdBaseView.options;
			opt.btn_cancel = false;
			opt.btn_submit = false;
			opt.btn_new = false;
			this.mdBaseView.renderFooterNavi();
			clutil.initUIelement(this.$el);
		}
	});

	if(clcom.dstId == "AMPOV0271" && clcom.returnValue.f_back != true){
		// 連続登録でない場合は一覧に戻る
		clcom.popPage();
	}
	else {
		//	初期データを取る
		clutil.getIniJSON(null, null).done(function(data, dataType) {
			ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
			if(clcom.pageArgs){
				//ca_editView.load(clcom.pageArgs);
			}
			if(clcom.pageData){
				ca_editView.load(clcom.pageData);
			}
			console.log("初期データを取る");
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
	}
});
