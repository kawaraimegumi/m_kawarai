useSelectpicker2();

//納期変更権限
var _termChg_Flag = 0;
//サーバー検索リクエスト
var OPETYPE = {
		AMPOV0280_REQTYPE_NOMAL:	1,	// 通常検索
		AMPOV0280_REQTYPE_BRAND:	2,	// ブランド検索
		AMPOV0280_REQTYPE_CLOTH:	3,	// 生地検索
		AMPOV0280_REQTYPE_OPTION: 	4,	// オプション検索
		AMPOV0280_REQTYPE_DATE: 	5,	// 店舗着日チェック
		AMPOV0280_REQTYPE_TIME: 	6	// 締時刻チェック
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
//2016/1/6 複製アラート
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
		L_jk:0,L_sk:0,L_sl:0,L_ve:0,L_jkSel:0,L_skSel:0,L_slSel:0,L_veSel:0,L_brand:0,L_cloth:0
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
		M_jk_amfType:0,
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
var L_varietyClearObj = {
		L_jk: 0,
		L_sk: 0,
		L_sl: 0,
};
//レディスジャケットモデル空要素
var L_jkModelClearObj = {
		//L_jkSel:0
};
//レディススカートモデル空要素
var L_skModelClearObj = {
		//L_skSel:0
};
//レディスパンツモデル空要素
var L_slModelClearObj = {
		//L_slSel:0
};
var L_jkModelClearObj2 = {
		L_jkType:4
};
//レディススカートモデル空要素
var L_skModelClearObj2 = {
		L_skType:4
};
//レディスパンツモデル空要素
var L_slModelClearObj2 = {
		L_slType:4
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
		L_jk_cuffsType:0,
		L_jk_cuffsPayType:0,
		L_jk_amfType:0,
		L_jk_pocketInnerType:0,
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


var destroySelectpicker = function(el){
	try{
		$(el).selectpicker('destroy');
	}catch(e){}
};
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
		},


		onBeforeClose: function(){

		}
	});


	var EditView = Backbone.View.extend({
		el : $("#ca_main"),

		validator : null,

		events : {
			"toggle input[name='ca_submitType']:radio"	: "_onSubmitTypeToggle",	// 送信区分ラジオボタン変更
			"toggle input[name='ca_orderType']:radio"	: "_onOrderTypeToggle",		// 種別区分ラジオボタン変更
			"click #ca_btn_guest_select"				: "_onGuestSelClick",		// お客様情報取得
			"click #ca_btn_store_select"				: "_onStoreSelClick",		// 店舗選択
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
			"toggle input[name='ca_M_jk_changeButtonType']:radio"	: "_onM_jk_ChangeButtonTypeToggle",	// メンズ：ボタン変更ラジオボタン変更
			//"toggle input[name='ca_M_jk_changeLiningType']:radio"	: "_onM_jk_ChangeLiningTypeToggle",	// メンズ：裏地変更ラジオボタン変更
			"toggle input[name='ca_M_jk_liningType']:radio"			: "_onM_jk_liningTypeToggle",		// メンズ：ジャケット裏仕様変更ラジオボタン変更
			"toggle input[name='ca_M_jk_summerType']:radio"			: "_onM_jk_summerTypeToggle",		// メンズ：サマー仕様変更ラジオボタン変更

			"change #ca_M_sl_size1"									: "_onM_sl_ChangeSize1",			// メンズ：スラックスサイズ1変更
			"change #ca_M_sl_style"									: "_onM_sl_ChangeStyle",			// メンズ：スラックススタイル変更
			"toggle input[name='ca_M_sl_spareType']:radio"			: "_onM_sl_SpareTypeToggle",		// メンズ：スペア変更ラジオボタン変更
			"toggle input[name='ca_M_sl_bottomType']:radio"			: "_onM_sl_BottomTypeToggle",		// メンズ：裾仕上変更ラジオボタン変更
			"toggle input[name='ca_M_sl_bottomSpareType']:radio"	: "_onM_sl_BottomSpareTypeToggle",	// メンズ：スペア裾仕上変更ラジオボタン変更
			"toggle input[name='ca_M_sl_changeButtonType']:radio"	: "_onM_sl_ChangeButtonTypeToggle",	// メンズ：ボタン変更ラジオボタン変更
			"blur  #ca_M_sl_lengthLeft"								: "_onBlurM_LeftCheckStep05",		// 0.5cm刻みかチェック
			"blur  #ca_M_sl_lengthRight"							: "_onBlurM_RightCheckStep05",		// 0.5cm刻みかチェック

			"change #ca_M_ve_size1"									: "_onM_ve_ChangeSize1",			// メンズ：ベストサイズ1変更
			"change #ca_M_ve_style"									: "_onM_ve_ChangeStyle",			// メンズ：ベストスタイル変更
			"toggle input[name='ca_M_ve_changeButtonType']:radio"	: "_onM_ve_ChangeButtonTypeToggle",	// メンズ：ボタン変更ラジオボタン変更
			//"toggle input[name='ca_M_ve_changeLiningType']:radio"	: "_onM_ve_ChangeLiningTypeToggle",	// メンズ：裏地変更ラジオボタン変更

			"change #ca_L_season"									: "_onL_ChangeSeason",				// レディス：シーズン変更
			"change #ca_L_cloth"									: "_onL_ChangeCloth",				// レディス：生地変更
			"change #ca_L_brand"									: "_onL_ChangeBrand",				// メンズ：ブランド変更
			"toggle input[name='ca_L_jkType']:radio"				: "_onL_jk_ChangeModelTypeToggle",	// レディス：モデル変更ラジオボタン変更
			"toggle input[name='ca_L_skType']:radio"				: "_onL_sk_ChangeModelTypeToggle",	// レディス：モデル変更ラジオボタン変更
			"toggle input[name='ca_L_slType']:radio"				: "_onL_sl_ChangeModelTypeToggle",	// レディス：モデル変更ラジオボタン変更

			"change #ca_L_jk_style"									: "_onL_jk_ChangeStyle",			// レディス：ジャケットスタイル変更
			"change #ca_L_jk_size"									: "_onL_jk_ChangeSize",				// レディス：ジャケットサイズ変更

			"change #ca_L_sk_style"									: "_onL_sk_ChangeStyle",			// レディス：スカートスタイル変更
			"change #ca_L_sk_size"									: "_onL_sk_ChangeSize",				// レディス：スカートサイズ変更

			"change #ca_L_sl_style"									: "_onL_sl_ChangeStyle",			// レディス：パンツスタイル変更
			"change #ca_L_sl_size"									: "_onL_sl_ChangeSize",				// レディス：パンツサイズ変更
			"blur  #ca_L_sl_lengthLeft"								: "_onBlurL_LeftCheckStep05",		// 0.5cm刻みかチェック
			"blur  #ca_L_sl_lengthRight"							: "_onBlurL_RightCheckStep05",		// 0.5cm刻みかチェック

			"change #ca_L_jk_name"									: "_onL_jk_ChangeNameSel",			// レディス：ネームセレクター変更

			"toggle input[name='ca_L_jk_changeButtonType']:radio"	: "_onL_jk_ChangeButtonTypeToggle",	// レディス：ボタン変更ラジオボタン変更
			//"toggle input[name='ca_L_jk_changeLiningType']:radio"	: "_onL_jk_ChangeLiningTypeToggle",	// レディス：裏地変更ラジオボタン変更
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

			// リリース用のラジオロック 1=全ロック、2=レディスロック
			// シスパラの定義待ちで暫定値
			this.lockLevel = 2;

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
						title: 'ORIHICA',
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

			//画面ヘルプのツールチップ表示
			$("#tp_tel").tooltip();

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
					p_org_id	: Number(clcom.getSysparam('PAR_AMMS_UNITID_ORI'))		// ORIHICA固定
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
			//this.makeSlider_S();
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
		},
		makeSlider_M_ve: function(){
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
					, 0.0, -5.0, 5.0, 0.5);
		},
		/** レディススライダー*/
		makeSlider_L_jk: function(){
			this.makeSlider($("#ca_L_jk_armLeft_slider"), $("#ca_L_jk_armLeft")
					, 0.0, -7.0, 7.0, 0.5);
			this.makeSlider($("#ca_L_jk_armRight_slider"), $("#ca_L_jk_armRight")
					, 0.0, -7.0, 7.0, 0.5);
			this.makeSlider($("#ca_L_jk_length_slider"), $("#ca_L_jk_length")
					, 0.0, -5.0, 5.0, 0.5);
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

		/**全スライダーのdisabled*/
		abledSliderAll:function(){
			this.abledSlider_M_jk();
			this.abledSlider_M_sl();
			this.abledSlider_M_ve();
			this.abledSlider_L_jk();
			this.abledSlider_L_sk();
			this.abledSlider_L_sl();
			this.abledSlider_L_ve();
			//this.abledSlider_S_ve();
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

		/**チェックボックスのtoggle設定*/
		setCheckBox:function(){
			var _this = this;
			//メンズスーツ;
			this.$el.delegate(':checkbox[id=ca_M_st]', 'toggle', function (ev) {
				if ($(this).prop('checked')) {
					// 表示設定
					$('#ca_M_jkDiv').show();
					$('#ca_M_slDiv').show();
					$('#ca_M_sl_changeButtonTypeDiv').hide();
					_this.showM_veLining(false);
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
						_this.setSelList($('#ca_M_jk_style'), _this.styleStList);
						_this.setSelList($('#ca_M_sl_style'), _this.styleSlList);
						var func = _this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS, TYPE.ST, null, baseData, otherData);

						$.when(func).done(function() {
							_this.M_lockUnselectJkStyle();
							_this.M_lockUnselectSlStyle();

							order =  clutil.view2data($('#ca_M_Field'));

							_this._onM_jk_ChangeNameSel(true, order.M_jk_name);
							_this._onM_jk_ChangeButtonTypeToggle(null, true, order.M_jk_changeButtonType);
							//_this._onM_jk_ChangeLiningTypeToggle(null, true, order.M_jk_changeLiningType);

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
					clutil.viewRemoveReadonly(_this.$('#ca_M_jkArea'));
					clutil.viewRemoveReadonly(_this.$('#ca_M_slArea'));
					_this.showM_veLining(true);
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
					_this.showM_veLining(false);
					//範囲設定
					clutil.viewReadonly(_this.$('#ca_M_stArea'));
					clutil.viewReadonly(_this.$('#ca_M_slArea'));
					// 必須設定
					$('.cl_M_jk_required').addClass("cl_required");
					// オプション再指定
					var comData =  clutil.view2data($('#ca_brandArea'));
					var order =  clutil.view2data($('#ca_M_Field'));
					var baseData =  clutil.view2data($('#ca_baseField'));
					var otherData =  clutil.view2data($('#ca_otherField'));
					if(comData.M_brand > 0){
						_this.setSelList($('#ca_M_jk_style'), _this.styleJkList);
						var func = _this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS, TYPE.JK, null, baseData, otherData);
						$.when(func).done(function() {
							_this.M_lockUnselectJkStyle();
							_this._onM_jk_ChangeNameSel(true, order.M_jk_name);
							_this._onM_jk_ChangeButtonTypeToggle(null, true, order.M_jk_changeButtonType);
							//_this._onM_jk_ChangeLiningTypeToggle(null, true, order.M_jk_changeLiningType);
						});
					}
				}else{
					$('#ca_M_jkDiv').hide();
					_this.showM_veLining(true);
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
						var func = _this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS, TYPE.SL, null, baseData, otherData);
						$.when(func).done(function() {
							_this.M_lockUnselectSlStyle();

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
				}else{
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
						var func = _this.makeStyleOptSel(true, amcm_type.AMCM_VAL_PO_CLASS_MENS, TYPE.VE, null, baseData, otherData);
						$.when(func).done(function() {
							_this.M_lockUnselectVeStyle();
							_this._onM_ve_ChangeButtonTypeToggle(null, true, order.M_ve_changeButtonType);
							//_this._onM_ve_ChangeLiningTypeToggle(null, true, order.M_ve_changeLiningType);
						});
					}
					// MT967 2015/11/25
					var flag = true;
					if(comData.M_st == 1 || comData.M_jk == 1){
						// スーツかジャケットが選択されていたら、ベスト裏地非表示
						flag = false;
					}
					_this.showM_veLining(flag);
				} else {
					$('#ca_M_veDiv').hide();
					$('.cl_M_ve_required').removeClass("cl_required");
					$('.cl_M_veOptrequired').removeClass("cl_required");
				}
			});

			//レディスジャケット;
			this.$el.delegate(':checkbox[id=ca_L_jk]', 'toggle', function (ev) {
				_this.L_lockUnselectJkStyle();
				clutil.data2view($("#ca_L_jk_styleArea"), L_jkStyleClearObj);
				clutil.viewReadonly(_this.$('#ca_L_jk_styleArea'));
				if ($(this).prop('checked')) {
					//チェックされたら範囲設定可能
					clutil.viewRemoveReadonly(_this.$('#ca_L_jkTypeDiv'));
					$('#ca_L_jkDiv').show();
					$('#ca_L_jkTypeDiv').show();
					// 必須設定
					$('.cl_L_jk_required').addClass("cl_required");

					// T211対応 スタイル自動設定
					clutil.data2view($("#ca_L_jkTypeDiv"), L_jkModelClearObj2);
					_this._onL_jk_ChangeModelTypeToggle();
//					var baseData =  clutil.view2data($('#ca_baseField'));
//					if (baseData.L_jkType != 2 && baseData.L_jkType != 4) {
//						clutil.data2view($("#ca_L_jkTypeDiv"), L_jkModelClearObj2);
//					}
//					var otherData =  clutil.view2data($('#ca_otherField'));
//					var modelJK = baseData.L_jkType;
//					if(isNaN(modelJK) == true){
//						modelJK = 4;
//					}
//					var chkJK = amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET;
//					_this.makeStyleSel(true, amcm_type.AMCM_VAL_PO_CLASS_LADYS
//							, baseData, otherData, $("#ca_L_jk_style"), chkJK, modelJK);
//					clutil.viewRemoveReadonly($("#ca_L_jk_styleArea"));
				} else {
					//チェックされなかったら範囲設定不可
					clutil.viewReadonly(_this.$('#ca_L_jkTypeDiv'));
					_this.$("#ca_L_jkTypeDiv").hide();
					$('#ca_L_jkDiv').hide();
					$('.cl_L_jk_required').removeClass("cl_required");
					//clutil.data2view($('#ca_L_jkTypeDiv'), L_jkModelClearObj);
				}
			});
			//レディススカート;
			this.$el.delegate(':checkbox[id=ca_L_sk]', 'toggle', function (ev) {
				_this.L_lockUnselectSkStyle();
				clutil.data2view($("#ca_L_sk_styleArea"), L_skStyleClearObj);
				clutil.viewReadonly(_this.$('#ca_L_sk_styleArea'));
				if ($(this).prop('checked')) {
					//チェックされたら範囲設定可能
					clutil.viewRemoveReadonly(_this.$('#ca_L_skTypeDiv'));
					$('#ca_L_skDiv').show();
					$('#ca_L_skTypeDiv').show();
					$('.cl_L_sk_required').addClass("cl_required");

					// T211対応 スタイル自動設定
					clutil.data2view($("#ca_L_skTypeDiv"), L_skModelClearObj2);
					_this._onL_sk_ChangeModelTypeToggle();
//					var baseData =  clutil.view2data($('#ca_baseField'));
//					if (baseData.L_skType != 2 && baseData.L_skType != 4) {
//						clutil.data2view($("#ca_L_skTypeDiv"), L_skModelClearObj2);
//					}
//					var otherData =  clutil.view2data($('#ca_otherField'));
//					var modelSK = baseData.L_skType;
//					if(isNaN(modelSK) == true){
//						modelSK = 4;
//					}
//					var chkSK = amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT;
//					_this.makeStyleSel(true, amcm_type.AMCM_VAL_PO_CLASS_LADYS
//							, baseData, otherData, $("#ca_L_sk_style"), chkSK, modelSK);
//					clutil.viewRemoveReadonly($("#ca_L_sk_styleArea"));
				} else {
					//チェックされなかったら範囲設定不可
					clutil.viewReadonly(_this.$('#ca_L_skTypeDiv'));
					_this.$("#ca_L_skTypeDiv").hide();
					$('#ca_L_skDiv').hide();
					$('.cl_L_sk_required').removeClass("cl_required");
					//clutil.data2view($('#ca_L_skTypeDiv'), L_skModelClearObj);
				}
			});
			//レディスパンツ;
			this.$el.delegate(':checkbox[id=ca_L_sl]', 'toggle', function (ev) {
				_this.L_lockUnselectSlStyle();
				clutil.data2view($("#ca_L_sl_styleArea"), L_slStyleClearObj);
				clutil.viewReadonly(_this.$('#ca_L_sl_styleArea'));
				if ($(this).prop('checked')) {
					//チェックされたら範囲設定可能
					clutil.viewRemoveReadonly(_this.$('#ca_L_slTypeDiv'));
					$('#ca_L_slDiv').show();
					$('#ca_L_slTypeDiv').show();
					$('.cl_L_sl_required').addClass("cl_required");

					// T211対応 スタイル自動設定
					clutil.data2view($("#ca_L_slTypeDiv"), L_slModelClearObj2);
					_this._onL_sl_ChangeModelTypeToggle();
//					var baseData =  clutil.view2data($('#ca_baseField'));
//					if (baseData.L_slType != 2 && baseData.L_slType != 4) {
//						clutil.data2view($("#ca_L_slTypeDiv"), L_slModelClearObj2);
//					}
//					var otherData =  clutil.view2data($('#ca_otherField'));
//					var modelSL = baseData.L_slType;
//					if(isNaN(modelSL) == true){
//						modelSL = 4;
//					}
//					var chkSL = amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS;
//					_this.makeStyleSel(true, amcm_type.AMCM_VAL_PO_CLASS_LADYS
//							, baseData, otherData, $("#ca_L_sl_style"), chkSL, modelSL);
//					clutil.viewRemoveReadonly($("#ca_L_sl_styleArea"));
				} else {
					//チェックされなかったら範囲設定不可
					clutil.viewReadonly(_this.$('#ca_L_slTypeDiv'));
					_this.$("#ca_L_slTypeDiv").hide();
					$('#ca_L_slDiv').hide();
					$('.cl_L_sl_required').removeClass("cl_required");
					//clutil.data2view($('#ca_L_slTypeDiv'), L_slModelClearObj);
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
						AMPOV0280GetReq :{
							reqType: OPETYPE.AMPOV0280_REQTYPE_TIME,
							poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS
						}
				};
				clutil.postJSON('AMPOV0280', srchReq).fail(_.bind(function(data){
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

		resetFocus: function() {
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
//				org_id: clcom.userInfo.unit_id,
				org_id: Number(clcom.getSysparam('PAR_AMMS_UNITID_ORI'),6),			// ORIHICA固定
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
					// 既に選択されていたら全表示リセット
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
			this.L_lockUnselectSeason();
			//表示再設定
			var type = $("input:radio[name=ca_orderType]:checked").val();
			// 店舗補正値入れ替え
			this.setOtStoreAdjType(type);
			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				this.showMens();
				// シーズンセレクター作成
				this.makeSeasonSel(false, type, $("#ca_M_season"));
				// レディスクリア
				this.setSelList($("#ca_L_brand"), []);
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				this.showLedies();
				// シーズンセレクター作成
				this.makeSeasonSel(false, type, $("#ca_L_season"));
				// メンズクリア
				this.setSelList($("#ca_M_brand"), []);
				// モデルセレクター作成
				//this.makeModelSel(false, null);
			}
			// 各白箱エリアの表示設定
			this.setDivs(false, null, null);
		},
		// 2015/9/2 T155:レディスの場合はエイトストップ・なしのみ表示 藤岡
		setOtStoreAdjType:function(type){
			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				clutil.cltypeselector(this.$("#ca_otStoreAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_AT_STORE);
			}
			else{
				clutil.cltypeselector({
					$select: this.$("#ca_otStoreAdjTypeID"),
					kind: amcm_type.AMCM_TYPE_RESIZE_AT_STORE,
					ids: [
					      amcm_type.AMCM_VAL_RESIZE_AT_STORE_NONE,
					      amcm_type.AMCM_VAL_RESIZE_AT_STORE_EIGHTSTOP
					      ],
					      unselectedflag: 1
				});
			}
			clutil.data2view($('#ca_otStoreAdjTypeIDArea'), {otStoreAdjTypeID:amcm_type.AMCM_VAL_RESIZE_AT_STORE_NONE});
		},


		/**
		 * 店舗着日計算
		 */
		getArrivalDate:function(loadFlag, type, loadObj){
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
			}
			else{
				comData =  loadObj;
				orderDate = clcom.getOpeDate();
			}

			storeID = comData.storeID;
			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				brandID = comData.M_brand;
				clothID = comData.M_cloth;
				wash = comData.M_wash;
				summer = comData.M_jk_summerType;
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
					AMPOV0280GetReq:{
						reqType :OPETYPE.AMPOV0280_REQTYPE_DATE,
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
			var promise = clutil.postJSON('AMPOV0280', srchReq).done(_.bind(function(data){
				var recs = data.AMPOV0280GetRsp.arrivalDateList;
				if(_.isEmpty(recs)){
					_this.setArrivalDate(-1);
				}else{
					var date = recs[0].arrivalDate;
					_this.setArrivalDate(date);
				}
			}, this)).fail(_.bind(function(data){

			}, this));

			return promise;
		},
		// セレクターオプションに価格表示
		setCostDisp:function(cn){
			//var disp = cn.name;
			if(cn.cost > 0){
				cn.name = cn.name + "(" + clutil.comma(cn.cost) + "円)";
			}
			return cn;
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
		 * レディスサイズセレクター作成
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
				//brandID = comDate.S_brand;
				return null;
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
				clothID = comData.L_cloth;
			}
			else{

			}


			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0280GetReq:{
						reqType :OPETYPE.AMPOV0280_REQTYPE_BRAND,
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
			var promise = clutil.postJSON('AMPOV0280', srchReq).done(_.bind(function(data){
				var recs = data.AMPOV0280GetRsp.brandList;
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
					_this.setSelListBrand($el, list);
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

			if(loadFlag == false){
				if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null
						|| this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
					return null;
				}
				comData =  clutil.view2data($('#ca_brandArea'));
				dateData =  clutil.view2data($('#ca_dateArea'));
				storeID = $("#ca_storeID").autocomplete('clAutocompleteItem').id;
				orderDate = dateData.orderDate;
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
				wash = 0;
			}

			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				seasonID = comData.M_season;
				wash = comData.M_wash;
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				seasonID = comData.L_season;
				//brandID = comData.L_brand;
			}
			else{
				brandID = comData.S_brand;
			}


			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0280GetReq:{
						reqType :OPETYPE.AMPOV0280_REQTYPE_CLOTH,
						poTypeID: type,
						storeID: storeID,
						brandID: brandID,
						orderDate: orderDate,
						seasonTypeID: seasonID,
						washableFlag: wash,
						// 以下は使用しないリクエスト
						clothIDID: 0,
						srchID: 0,
						modelIDList: [],
						styleOptTypeIDList: []
					}
			};
			var promise = clutil.postJSON('AMPOV0280', srchReq).done(_.bind(function(data){
				var recs = data.AMPOV0280GetRsp.clothIDList;
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
					else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
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
				//brandID = comData.S_brand;
				return null;
			}

			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0280GetReq:{
						reqType :OPETYPE.AMPOV0280_REQTYPE_OPTION,
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
			var promise = clutil.postJSON('AMPOV0280', srchReq).done(_.bind(function(data){
				var recs = data.AMPOV0280GetRsp.optionList;
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
			if(loadFlag == true){
				// オプションがなかったらdisabledにする処理
				_this.chkM_OptUse(list, comData, chk);
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

			var obj1 = {
					M_jk_changeButtonType:0
			};
			var obj2 = {
					M_jk_changeLiningType:0
			};
			var obj3= {
					M_jk_cuffsFirst:0,
					M_jk_flowerHole:0
			};


			// ボタン変更と裏地は、スーツとジャケットで分ける
			if((chk == TYPE.ALL && comData.M_st == 1) || chk == TYPE.ST){
				_this.setDisableOptDiv(f_ST_cngButton, $("#ca_M_jk_changeButtonTypeDiv"));
				_this.setDisableOptDiv(f_ST_cngLining, $("#ca_M_jk_changeLiningTypeDiv"));

				_this.setDisableOptDiv(f_ST_amf, $("#ca_M_jk_amfPayTypeDiv"));
				_this.setDisableOptDiv(f_ST_cuffs4, $("#ca_M_jk_sleeveButtonTypeDiv"));
				_this.setDisableOptDiv(f_ST_cngPocket, $("#ca_M_jk_changePocketTypeDiv"));
				_this.setDisableOptDiv(f_ST_buttonHole, $("#ca_M_jk_cuffsTypeDiv"));
				_this.setDisableOptDiv(f_ST_daiba, $("#ca_M_jk_daibaTypeDiv"));
				_this.setDisableOptDiv(f_ST_summer, $("#ca_M_jk_summerTypeDiv"));
				_this.setDisableOptDiv(f_ST_flowerHole, $("#ca_M_jk_flowerHoleDiv"));

				_this.setDisableOptDiv(f_SL_adjuster, $("#ca_M_sl_adjusterDiv"));
				_this.setDisableOptDiv(f_SL_adjuster, $("#ca_M_sl_adjusterSpareDiv"));
				_this.setDisableOptDiv(f_SL_cngButton, $("#ca_M_sl_changeButtonTypeDiv"));

				// セレクターの設定
				_this.setDisableOptSelElem(f_ST_cngButton, _this.changeStButtonList,
						$("#ca_M_jk_changeButtonSelDiv"), $("#ca_M_jk_changeButtonSel"));
				_this.setDisableOptSelElem(f_ST_cngLining, _this.changeStLiningList,
						$("#ca_M_jk_changeLiningSelDiv"), $("#ca_M_jk_changeLiningSel"));
				_this.setDisableOptSelElem(f_ST_flowerHole, _this.buttonThreadColorSelList,
						$("#ca_M_jk_buttonThreadColorDiv"), $("#ca_M_jk_buttonThreadColorSel"));

//				if(f_ST_cngButton == false || _this.changeStButtonList.length == 0){
//				clutil.data2view($("#ca_M_jk_changeButtonTypeDiv"), obj1);
//				$("#ca_M_jk_changeButtonSelDiv").hide();
//				}
//				else{
//				_this.setSelList($("#ca_M_jk_changeButtonSel"), _this.changeStButtonList);
//				clutil.viewRemoveReadonly($("#ca_M_jk_changeButtonSelDiv"));
//				}

//				if(f_ST_cngLining == false || _this.changeStLiningList.length == 0){
//				clutil.data2view($("#ca_M_jk_changeLiningTypeDiv"), obj2);
//				$("#ca_M_jk_changeLiningSelDiv").hide();
//				}
//				else{
//				_this.setSelList($("#ca_M_jk_changeLiningSel"), _this.changeStLiningList);
//				clutil.viewRemoveReadonly($("#ca_M_jk_changeLiningSelDiv"));
//				}

			}
			if((chk == TYPE.ALL && comData.M_jk == 1) || chk == TYPE.JK){
				_this.setDisableOptDiv(f_JK_cngButton, $("#ca_M_jk_changeButtonTypeDiv"));
				_this.setDisableOptDiv(f_JK_cngLining, $("#ca_M_jk_changeLiningTypeDiv"));

				_this.setDisableOptDiv(f_ST_amf, $("#ca_M_jk_amfPayTypeDiv"));
				_this.setDisableOptDiv(f_ST_cuffs4, $("#ca_M_jk_sleeveButtonTypeDiv"));
				_this.setDisableOptDiv(f_ST_cngPocket, $("#ca_M_jk_changePocketTypeDiv"));
				_this.setDisableOptDiv(f_ST_buttonHole, $("#ca_M_jk_cuffsTypeDiv"));
				_this.setDisableOptDiv(f_ST_daiba, $("#ca_M_jk_daibaTypeDiv"));
				_this.setDisableOptDiv(f_ST_summer, $("#ca_M_jk_summerTypeDiv"));
				_this.setDisableOptDiv(f_ST_flowerHole, $("#ca_M_jk_flowerHoleDiv"));

				// セレクター
				_this.setDisableOptSelElem(f_JK_cngButton, _this.changeJkButtonList,
						$("#ca_M_jk_changeButtonSelDiv"), $("#ca_M_jk_changeButtonSel"));
				_this.setDisableOptSelElem(f_JK_cngLining, _this.changeJkLiningList,
						$("#ca_M_jk_changeLiningSelDiv"), $("#ca_M_jk_changeLiningSel"));
				_this.setDisableOptSelElem(f_ST_flowerHole, _this.buttonThreadColorSelList,
						$("#ca_M_jk_buttonThreadColorDiv"), $("#ca_M_jk_buttonThreadColorSel"));

//				if(f_JK_cngButton == false || _this.changeJkButtonList.length == 0){
//				clutil.data2view($("#ca_M_jk_changeButtonTypeDiv"), obj1);
//				$("#ca_M_jk_changeButtonSelDiv").hide();
//				}
//				else{
//				_this.setSelList($("#ca_M_jk_changeButtonSel"), _this.changeJkButtonList);
//				clutil.viewRemoveReadonly($("#ca_M_jk_changeButtonSelDiv"));
//				}

//				if(f_JK_cngLining == false || _this.changeJkLiningList.length == 0){
//				clutil.data2view($("#ca_M_jk_changeLiningTypeDiv"), obj2);
//				$("#ca_M_jk_changeLiningSelDiv").hide();
//				}
//				else{
//				_this.setSelList($("#ca_M_jk_changeLiningSel"), _this.changeJkLiningList);
//				clutil.viewRemoveReadonly($("#ca_M_jk_changeLiningSelDiv"));
//				}
			}
			if((chk == TYPE.ALL && comData.M_sl == 1) || chk == TYPE.SL){
				_this.setDisableOptDiv(f_SL_adjuster, $("#ca_M_sl_adjusterDiv"));
				_this.setDisableOptDiv(f_SL_adjuster, $("#ca_M_sl_adjusterSpareDiv"));
				_this.setDisableOptDiv(f_SL_cngButton, $("#ca_M_sl_changeButtonTypeDiv"));
				// セレクター
				_this.setDisableOptSelElem(f_SL_cngButton, _this.changeSlButtonList,
						$("#ca_M_sl_changeButtonSelDiv"), $("#ca_M_sl_changeButtonSel"));
			}
			if((chk == TYPE.ALL && comData.M_ve == 1) || chk == TYPE.VE){
				//_this.setDisableOptDiv(f_VE_amf, $("#ca_M_ve_amfTypeDiv"));
				// T205 2015/9/5 有料AMFステッチのフラグを確認するよう修正 藤岡
				_this.setDisableOptDiv(f_VE_amfPay, $("#ca_M_jk_amfPayTypeDiv"));
				_this.setDisableOptDiv(f_VE_amfPay, $("#ca_M_ve_amfPayTypeDiv"));
				_this.setDisableOptDiv(f_VE_cngButton, $("#ca_M_ve_changeButtonTypeDiv"));
				_this.setDisableOptDiv(f_VE_cngLining, $("#ca_M_ve_changeLiningTypeDiv"));
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
					_this.changeJkButtonList  = jkBottonList;
					_this.changeJkLiningList  = jkLiningList;
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
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						jkBottonList.push(cn);
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						jkLiningList.push(_this.setCostDisp(cn));
					}
					else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
							&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS){
						slBottonList.push(cn);
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
					_this.changeJkButtonList  = jkBottonList;
					_this.changeJkLiningList  = jkLiningList;
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
			if(loadFlag == true){
				// オプションがなかったらdisabledにする処理
				_this.chkL_OptUse(list, comData, chk);
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

			var f_JK_ventType = false;
			var f_JK_cuffsType = false;
			var f_JK_amfType = false;
			var f_JK_pocketInnerType = false;
			// パンツ
			var f_SL_cngButton = false;
			// ベスト
			var f_VE_cngButton = false;
			var f_VE_cngLining = false;
			var f_VE_amfType = false;
			var f_VE_buckleType = false;

			$.each(list, function() {
				var cn = {
						styleOptTypeID:this.styleOptTypeID,
						poOptTypeID:this.poOptTypeID
				};
				// ジャケット
				if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					f_JK_cngButton = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					f_JK_cngLining = true;
				}

				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CENTER_VENT_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					f_JK_ventType = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_ARM_DESIGN_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					f_JK_cuffsType = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_AMF_STITCH_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					f_JK_amfType = true;
				}
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_INNER_POCKET_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
					f_JK_pocketInnerType = true;
				}
				// スラックス
				else if(cn.poOptTypeID == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
						&& cn.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS){
					f_SL_cngButton = true;
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
				_this.setDisableOptDiv(f_JK_cngButton, $("#ca_L_jk_changeButtonTypeDiv"));
				_this.setDisableOptDiv(f_JK_cngLining, $("#ca_L_jk_changeLiningTypeDiv"));
				_this.setDisableOptDiv(f_JK_ventType, $("#ca_L_jk_ventTypeDiv"));
				_this.setDisableOptDiv(f_JK_cuffsType, $("#ca_L_jk_cuffsTypeDiv"));
				_this.setDisableOptDiv(f_JK_amfType, $("#ca_L_jk_amfTypeDiv"));
				_this.setDisableOptDiv(f_JK_pocketInnerType, $("#ca_L_jk_pocketInnerTypeDiv"));
				// セレクター
				_this.setDisableOptSelElem(f_JK_cngButton, _this.changeJkButtonList,
						$("#ca_L_jk_changeButtonSelDiv"), $("#ca_L_jk_changeButtonSel"));
				_this.setDisableOptSelElem(f_JK_cngLining, _this.changeJkLiningList,
						$("#ca_L_jk_changeLiningSelDiv"), $("#ca_L_jk_changeLiningSel"));
			}
			if((chk == TYPE.ALL && comData.L_sl == 1) || chk == TYPE.L_SL){
				_this.setDisableOptDiv(f_SL_cngButton, $("#ca_L_sl_changeButtonTypeDiv"));
				// セレクター
				_this.setDisableOptSelElem(f_SL_cngButton, _this.changeSlButtonList,
						$("#ca_L_sl_changeButtonSelDiv"), $("#ca_L_sl_changeButtonSel"));
			}
			if((chk == TYPE.ALL && comData.L_ve == 1) || chk == TYPE.L_VE){
				_this.setDisableOptDiv(f_VE_cngButton, $("#ca_L_ve_changeButtonTypeDiv"));
				_this.setDisableOptDiv(f_VE_cngLining, $("#ca_L_ve_changeLiningTypeDiv"));
				_this.setDisableOptDiv(f_VE_amfType, $("#ca_L_ve_amfTypeDiv"));
				_this.setDisableOptDiv(f_VE_buckleType, $("#ca_L_ve_buckleTypeDiv"));
				// セレクター
				_this.setDisableOptSelElem(f_VE_cngButton, _this.changeVeButtonList,
						$("#ca_L_ve_changeButtonSelDiv"), $("#ca_L_ve_changeButtonSel"));
				_this.setDisableOptSelElem(f_VE_cngLining, _this.changeVeLiningList,
						$("#ca_L_ve_changeLiningSelDiv"), $("#ca_L_ve_changeLiningSel"));
			}
		},
		makeS_OptSel:function(loadFlag, flag, getList, comData){

		},
		// 指定されたオプションdivを触れなくする
		setDisableOptDiv:function(flag, $el){
			if(flag == false){
				clutil.viewReadonly($el);
			}
			else{
				clutil.viewRemoveReadonly($el);
			}
		},
		// ラジオ付属のセレクター処理
		setDisableOptSelElem:function(flag, list, $div, $sel){
			if(flag == false || list.length == 0){
				$div.hide();
				$sel.removeClass("cl_required");
			}
			else{
				this.setSelList($sel, list);
				clutil.viewRemoveReadonly($div);
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

			if(val == amcm_type.AMCM_VAL_BACK_FABRIC_TYPE_LINING){
				// 総裏のときはサマー仕様不可
				var obj = {
						M_jk_summerType:0
				};
				clutil.viewReadonly($("#ca_M_jk_summerTypeDiv"));
				clutil.data2view($("#ca_M_jk_summerTypeDiv"), obj);
			}
			else{
				clutil.viewRemoveReadonly($("#ca_M_jk_summerTypeDiv"));
			}
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
				// スペアなし
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
				if (valSBottom == null || valSBottom == 0) {
					var obj = {
							M_sl_bottomSpareType: amcm_type.AMCM_VAL_COATTAIL_TYPE_SINGLE,
					};
					clutil.data2view($("#ca_M_sl_bottomSpareDiv"), obj);
				}
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
			if(val == amcm_type.AMCM_VAL_PO_NAME_TYPE_NONE){

			}
			else if(val == amcm_type.AMCM_VAL_PO_NAME_TYPE_KANJI){
				$("#ca_M_jk_nameKanjiDiv").show();
				$("#ca_M_jk_nameMakeTypeDiv").show();
				$("#ca_M_jk_nameKanji").addClass("cl_required");

				$("#ca_M_jk_nameFull").val('');
				$("#ca_M_jk_nameIni").val('');

				clutil.data2view($("#ca_M_jk_nameMakeTypeDiv"), obj);
			}
			else if(val == amcm_type.AMCM_VAL_PO_NAME_TYPE_FULL){
				$("#ca_M_jk_nameFullDiv").show();
				$("#ca_M_jk_nameMakeTypeDiv").show();
				$("#ca_M_jk_nameFull").addClass("cl_required");

				$("#ca_M_jk_nameKanji").val('');
				$("#ca_M_jk_nameIni").val('');

				clutil.data2view($("#ca_M_jk_nameMakeTypeDiv"), obj);
			}
			else if(val == amcm_type.AMCM_VAL_PO_NAME_TYPE_INITIAL){
				$("#ca_M_jk_nameIniDiv").show();
				$("#ca_M_jk_nameMakeTypeDiv").show();
				$("#ca_M_jk_nameIni").addClass("cl_required");

				$("#ca_M_jk_nameFull").val('');
				$("#ca_M_jk_nameKanji").val('');

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
				var clothOld = $("#ca_M_clothOld").val();
				var cloth = clutil.view2data($("#ca_M_clothArea"));
				var brand = clutil.view2data($("#ca_M_brandArea"));
				var brandSel = this.makeBrandSel(false, 1, $("#ca_M_brand"), null, null);
				var styleSel = null;
				var baseData =  clutil.view2data($('#ca_baseField'));
				var otherData =  clutil.view2data($('#ca_otherField'));
				var orderData =  clutil.view2data($('#ca_M_Field'));

				clutil.viewRemoveReadonly($(".ca_M_clothEffectDiv"));
				clutil.viewRemoveReadonly($(".ca_M_brandEffectDiv"));

				$.when(brandSel).done(function(){
					// セレクター作成後、リセット判定
					if(brand.M_brand == null || brand.M_brand <= 0){
						// 既存選択ブランドがない場合はそのまま入力
						_this.M_setClothOld_Price();
						clutil.viewRemoveReadonly($(".ca_M_clothEffectDiv"));
						_this.M_setClothOld();
						_this._onM_ChangeBrand();

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
												// 再定義
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
												clutil.viewRemoveReadonly($(".ca_M_brandEffectDiv"));
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
		// 旧生地価格
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
		// 各スタイルが生地に対応しているか確認
		chkM_styleEffect:function(type, tgtID){
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
		chkM_clothWashClothEffect:function(brand){
			var flag = false;
			var list = this.clothList;
			var i = 0;
			for(i=0; i<list.length; i++){
				if(list[i].id == brand){
					flag = true;
					break;
				}
			}
			return flag;
		},
		M_setClothOld:function(){
			var cloth = $("#ca_M_cloth").val();
			$("#ca_M_clothOld").val(cloth);
		},
		M_lockUnselectCloth: function(){
			// 配下を触れないように
			clutil.viewReadonly(this.$(".ca_M_clothEffectDiv"));
			this.M_lockUnselectBrand();
			this.setSelList($("#ca_M_brand"), []);
			clutil.data2view($("#ca_M_brandArea"), M_BrandClearObj);
			$("#ca_M_clothOld").val(0);
			$("#ca_M_clothPrice").val(0);
		},
		M_lockSelectCloth: function(){
			// 配下を編集可に
			clutil.viewRemoveReadonly(this.$(".ca_M_clothEffectDiv"));
			this.M_lockUnselectBrand();
			this.M_setClothOld();
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
			this.setArrivalDate(-1);
		},
		M_lockSelectBrand: function(){
			// 配下を編集可に
			clutil.viewRemoveReadonly(this.$(".ca_M_brandEffectDiv"));
			this.M_lockUnselectJkStyle();
			this.M_lockUnselectSlStyle();
			this.M_lockUnselectVeStyle();
		},
		chkBrandEffect:function(type, selID){
			//ORIはブランドが1津しかないため、切り替えがない 2015/9/2 藤岡
//			var list = this.brandList;
//			var i = 0;
//			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
//			clutil.viewReadonly(this.$(".ca_M_brandFlagEffectDiv"));
//			for(i=0; i<list.length; i++){
//			if(list[i].id == selID){
//			if(type == 1){
//			if(list[i].amfFlag == 1){
//			clutil.viewRemoveReadonly(this.$(".ca_M_amfFlagEffectDiv"));
//			}
//			if(/*list[i].liningFlag == 1*/true){	// TODO
//			clutil.viewRemoveReadonly(this.$(".ca_M_liningFlagEffectDiv"));
//			}
//			//else if(list[i].liningFlag == 2){
//			//	clutil.viewRemoveReadonly(this.$(".ca_M_liningFlagEffectDiv"));
//			//	clutil.viewReadonly(this.$("#ca_M_jk_liningTypeKannon"));
//			//}
//			if(/*list[i].pocketFlag == 1*/ true){	// TODO
//			clutil.viewRemoveReadonly(this.$(".ca_M_pocketEffectDiv"));
//			}
//			//if(list[i].buttonFlag == 1){
//			//	clutil.viewRemoveReadonly(this.$(".ca_M_buttonEffectDiv"));
//			//}
//			//if(list[i].trunkFlag == 1){
//			//	clutil.viewRemoveReadonly(this.$(".ca_M_trunkEffectDiv"));
//			//	this.abledSlider($('#ca_M_jk_trunk_slider'), $('#ca_M_jk_trunk_SliderDot'));
//			//}
//			//else{
//			//	$("#ca_M_jk_trunk_slider").slider("value" , 0);
//			//}
//			//if(list[i].vestTrunkFlag == 1){
//			//	clutil.viewRemoveReadonly(this.$(".ca_M_vestTrunkEffectDiv"));
//			//	this.abledSlider($('#ca_M_ve_trunk_slider'), $('#ca_M_ve_trunk_SliderDot'));
//			//}
//			//else{
//			//	$("#ca_M_ve_trunk_slider").slider("value" , 0);
//			//}
//			}
//			}
//			}
//			}
//			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){

//			}
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
		M_jkOptClear:function(iniFlag){
			// スライダ値保持
			var slidearmLVal = $('#ca_M_jk_armLeft').val();
			var slidearmRVal = $('#ca_M_jk_armRigth').val();
			var slideLengthVal = $('#ca_M_jk_length').val();
			// 空要素
			clutil.data2view($('#ca_M_jkOptDiv'), M_jkOptClearObj);
			if(iniFlag != true){
				// スライダ再指定
				$('#ca_M_jk_armLeft').val(slidearmLVal);
				$('#ca_M_jk_armRigth').val(slidearmRVal);
				$('#ca_M_jk_length').val(slideLengthVal);
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
			// 空要素
			clutil.data2view($('#ca_M_veOptDiv'), M_veOptClearObj);
			if(iniFlag != true){
				// スライダーリセット
				//$(".ca_M_veSlider").slider("value" , 0);
			}
			//オプション配下の要素隠し
			$(".ca_M_veOptElem").hide();
			$(".cl_M_veOptrequired").removeClass("cl_required");
		},


		/**
		 * レディスシーズン変更
		 */
		_onL_ChangeSeason:function(){
			if($("#ca_L_season").val() <= 0){
				this.L_lockUnselectSeason();
			}
			else{
				this.L_lockSelectSeason();

				//test
				this.makeClothSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_cloth"), null, null);
			}
		},
		// シーズン未選択
		L_lockUnselectSeason: function(){
			// 配下を触れないように
			clutil.viewReadonly(this.$(".ca_sesonEffectDiv"));
			this.L_lockUnselectCloth();
			clutil.data2view($("#ca_L_clothArea"), M_ClothClearObj);
		},
		// シーズン変更
		L_lockSelectSeason: function(){
			// 配下を編集可に
			clutil.viewRemoveReadonly(this.$(".ca_sesonEffectDiv"));
			this.L_lockUnselectCloth();
		},

		/**
		 * レディスブランド変更
		 */
		_onL_ChangeBrand:function(){
			if($("#ca_L_brand").val() <= 0){
				this.L_lockUnselectBrand();
			}
			else{
				this.getArrivalDate(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, null, null);
				this.L_makeStyleSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS);
				this.makeStyleOptSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.ALL, null, null, null);
				this.L_lockSelectBrand();
			}
		},
		L_lockUnselectBrand:function(){
			// 配下を触れないように
			clutil.viewReadonly(this.$(".ca_L_brandEffectDiv"));
			this.L_lockUnselectJkStyle();
			this.L_lockUnselectSkStyle();
			this.L_lockUnselectSlStyle();
			clutil.data2view($("#ca_L_jk_styleArea"), L_jkStyleClearObj);
			clutil.data2view($("#ca_L_sk_styleArea"), L_skStyleClearObj);
			clutil.data2view($("#ca_L_sl_styleArea"), L_slStyleClearObj);
			this.setArrivalDate(-1);
		},
		L_lockSelectBrand:function(){
			// 配下を編集可に
			clutil.viewRemoveReadonly(this.$(".ca_L_brandEffectDiv"));
			this.L_lockUnselectJkStyle();
			this.L_lockUnselectSkStyle();
			this.L_lockUnselectSlStyle();
			//this.L_lockUnselectCloth();
		},

		/**
		 * レディス生地変更
		 */
		_onL_ChangeCloth:function(){
			var _this = this;
			_this.validator.clearErrorMsg($("#ca_L_cloth"));
			_this.validator.clearErrorMsg($("#ca_L_brand"));

			if($("#ca_L_cloth").val() <= 0){
				this.L_lockUnselectCloth();
			}
			else{
				// 現行の値記録
				var clothOld = $("#ca_L_clothOld").val();
				var cloth = clutil.view2data($("#ca_L_clothArea"));
				var brand = clutil.view2data($("#ca_L_brandArea"));
				var brandSel = this.makeBrandSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_brand"), null, null);
				var orderData =  clutil.view2data($('#ca_M_Field'));

				clutil.viewRemoveReadonly($(".ca_L_clothEffectDiv"));
				clutil.viewRemoveReadonly($(".ca_L_brandEffectDiv"));

				$.when(brandSel).done(function() {
					//brand = clutil.view2data($("#ca_L_brandArea"));
					// セレクター作成後、リセット判定
					if(brand.L_brand == null || brand.L_brand <= 0){
						// 既存選択ブランドがない場合はそのまま入力
						clutil.viewRemoveReadonly($(".ca_L_clothEffectDiv"));
						_this.L_setClothOld();
						_this._onL_ChangeBrand();

						_this.validator.clearErrorMsg($("#ca_L_cloth"));
						_this.validator.clearErrorMsg($("#ca_L_brand"));
					}
					else {
						var chk = _this.chkL_clothBrandEffect(brand.L_brand);
						if(chk == true){
							// 既存選択ブランドが選択可能なら復帰
							clutil.data2view($("#ca_L_brandArea"), brand);
							_this.L_setClothOld();
							if ($("#ca_L_jk").prop('checked')) {
								_this._onL_jk_ChangeModelTypeToggle();
							}
							if ($("#ca_L_sk").prop('checked')) {
								_this._onL_sk_ChangeModelTypeToggle();
							}
							if ($("#ca_L_sl").prop('checked')) {
								_this._onL_sl_ChangeModelTypeToggle();
							}
							//_this._onL_ChangeBrand();
						}
						else{
							// 既存選択ブランドが存在しない場合は確認ダイアログ
							clutil.ConfirmDialog("選択済みの生地と異なるプライスラインの生地が選択されました。<br>スタイル以降の内容をリセットします。<br>よろしいですか？"
									, function(_this){
										try{
											// [はい]ブランド以降リセット
											clutil.data2view($("#ca_L_brandArea"), brand);
											_this._onL_ChangeBrand();
											_this.L_lockSelectCloth();
											return;
										}finally{
										}
									}, function(_this){
										console.log('CANCEL', arguments);
										try{
											// [いいえ]旧情報を再表示
											var base = clutil.view2data($("#ca_baseField"));
											var other = clutil.view2data($("#ca_otherField"));

											// 旧生地セレクター設定
											base.L_cloth = clothOld;
											cloth.L_cloth = clothOld;
											clutil.data2view($("#ca_L_clothArea"), cloth);

											var clothSel2 = _this.makeClothSel(true, amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_cloth"), base, other);
											var brandSel = _this.makeBrandSel(true, amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_brand"), base, other);
											// 再定義
											var styleSel3 = _this.makeStyleSel(true, amcm_type.AMCM_VAL_PO_CLASS_LADYS, base, other);

											$.when(clothSel2).done(function() {
												// 旧生地セレクター設定
												clutil.data2view($("#ca_L_clothArea"), cloth);
												clutil.viewRemoveReadonly($('#ca_L_brandArea'));

												$.when(brandSel).done(function() {
													// 旧ブランドセレクター作成
													clutil.data2view($("#ca_L_brandArea"), brand);
													clutil.viewRemoveReadonly($(".ca_L_clothEffectDiv"));
													_this.L_setClothOld_Price();

													$.when(styleSel3).done(function() {
														// 旧スタイルセレクター作成
														clutil.data2view($("#ca_L_jk_styleArea"), {M_jk_style:orderData.M_jk_style});
														clutil.data2view($("#ca_L_sl_styleArea"), {M_sl_style:orderData.M_sl_style});
													});
												});
											});
											$.when(brandSel2).done(function(){
												clutil.data2view($("#ca_L_brandArea"), brand);
												clutil.viewRemoveReadonly($(".ca_L_clothEffectDiv"));
												_this.L_setClothOld();
											});
											return;
										}finally{
										}
									}, _this);
						}
					}

				});

				//this.getArrivalDate(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, null, null);
				//this.L_lockSelectCloth();
				//this.L_makeStyleSel(false, null, null);
			}
		},
		chkL_clothBrandEffect:function(brand){
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
		L_setClothOld_Price:function(){
			var cloth = $("#ca_L_cloth").val();
			$("#ca_L_clothOld").val(cloth);

			var list = this.clothList;
			var i = 0;
			var price = 0;
			for (i = 0; i < list.length; i++) {
				if (list[i].id == cloth) {
					price = list[i].priceLine;
					break;
				}
			}
			$("#ca_L_clothPice").val(price);
		},
		L_setClothOld:function(){
			var cloth = $("#ca_L_cloth").val();
			$("#ca_L_clothOld").val(cloth);
		},

		L_clearJk: function() {
			//チェックされなかったら範囲設定不可
			clutil.viewReadonly($('#ca_L_jkTypeDiv'));
			$("#ca_L_jkTypeDiv").hide();
			$('#ca_L_jkDiv').hide();
			$('.cl_L_jk_required').removeClass("cl_required");
		},

		L_clearSk: function() {
			//チェックされなかったら範囲設定不可
			clutil.viewReadonly($('#ca_L_skTypeDiv'));
			$("#ca_L_skTypeDiv").hide();
			$('#ca_L_skDiv').hide();
			$('.cl_L_sk_required').removeClass("cl_required");
		},

		L_clearSl: function() {
			//チェックされなかったら範囲設定不可
			clutil.viewReadonly($('#ca_L_slTypeDiv'));
			$("#ca_L_slTypeDiv").hide();
			$('#ca_L_slDiv').hide();
			$('.cl_L_sl_required').removeClass("cl_required");
		},

		L_lockUnselectCloth: function(){
			// 配下を触れないように
			clutil.viewReadonly(this.$(".ca_L_clothEffectDiv"));
			this.L_lockUnselectJkStyle();
			this.L_lockUnselectSkStyle();
			this.L_lockUnselectSlStyle();
			this.L_lockUnselectVeStyle();
			clutil.data2view($("#ca_L_clothArea"), L_ClothClearObj);
			clutil.data2view($("#ca_L_varietyArea"), L_varietyClearObj);
			clutil.data2view($("#ca_L_jk_styleArea"), L_jkStyleClearObj);
			clutil.data2view($("#ca_L_sk_styleArea"), L_skStyleClearObj);
			clutil.data2view($("#ca_L_sl_styleArea"), L_slStyleClearObj);
			clutil.data2view($("#ca_L_ve_styleArea"), L_veStyleClearObj);

			this.L_clearJk();
			this.L_clearSk();
			this.L_clearSl();

			// ブランドのクリア
			this.setSelList($("#ca_L_brand"), []);

//			clutil.viewReadonly(this.$('#ca_L_jkTypeDiv'));
//			this.$("#ca_L_jkTypeDiv").hide();
//			clutil.viewReadonly(this.$('#ca_L_skTypeDiv'));
//			this.$("#ca_L_skTypeDiv").hide();
//			clutil.viewReadonly(this.$('#ca_L_slTypeDiv'));
//			this.$("#ca_L_slTypeDiv").hide();

			this.L_lockUnselectBrand();

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

			// 初期値はスタイリッシュで取得
			var modelJK = 4;
			var modelSK = 4;
			var modelSL = 4;

			if(base.L_jk == 1){
				chkJK = TYPE.L_JK;
				modelJK = base.L_jkType;
			}
			if(base.L_sk == 1){
				chkSK = TYPE.L_SK;
				modelSK = base.L_skType;
			}
			if(base.L_sl == 1){
				chkSL = TYPE.L_SL;
				modelSL = base.L_slType;
			};

			this.L_setStyleSel(loadFlag, base, other, $("#ca_L_jk_style"), $("#ca_L_jk_styleArea"), chkJK, modelJK);
			this.L_setStyleSel(loadFlag, base, other, $("#ca_L_sk_style"), $("#ca_L_sk_styleArea"), chkSK, modelSK);
			this.L_setStyleSel(loadFlag, base, other, $("#ca_L_sl_style"), $("#ca_L_sl_styleArea"), chkSL, modelSL);
		},
		L_setStyleSel:function(loadFlag, base, other, $sel, $selArea, chk, model){
			if(model > 0 && chk > 0){
				var _this = this;
				// T211 スタイルセレクターの値は1つしかないので、自動選択とする
				var func = this.makeStyleSel(loadFlag, amcm_type.AMCM_VAL_PO_CLASS_LADYS
						, base, other, $sel, chk, model);
				$.when(func).done(function(){
					_this.L_setStyleVal(loadFlag, chk, $selArea);
				});
				clutil.viewRemoveReadonly($selArea);
			}
			else{
				clutil.viewReadonly($selArea);
			}
		},
		// T211 レディススタイル自動選択
		L_setStyleVal:function(loadFlag, chk, $selArea){
			var list = [];
			var obj = {};
			var func = null;
			// 2016/1/13 リスト0件の際の考慮モレ対応
			if(chk == TYPE.L_JK){
				list = this.styleJkList;
				if(list.length == 0){
					obj.L_jk_style = 0;
				}
				else{
					obj.L_jk_style = list[0].id;
				}
				func = this._onL_jk_ChangeStyle;
			}
			else if(chk == TYPE.L_SK){
				list = this.styleSkList;
				if(list.length == 0){
					obj.L_sk_style = 0;
				}
				else{
					obj.L_sk_style = list[0].id;
				}
				func = this._onL_sk_ChangeStyle;
			}
			else if(chk == TYPE.L_SL){
				list = this.styleSlList;
				if(list.length == 0){
					obj.L_sl_style = 0;
				}
				else{
					obj.L_sl_style = list[0].id;
				}
				func = this._onL_sl_ChangeStyle;
			}
			else if(chk == TYPE.L_VE){
				list = this.styleVeList;
				if(list.length == 0){
					obj.L_ve_style = 0;
				}
				else{
					obj.L_ve_style = list[0].id;
				}
				func = this._onL_ve_ChangeStyle;
			}
			// 2016/1/13 リスト0件の際の考慮モレ対応 ここまで

			var func2 = clutil.data2view($selArea, obj);
			$.when(func2).done(function(){
				if(loadFlag != true){
					func();
				}
			});
		},

		/** レディスモデル変更*/
		_onL_jk_ChangeModelTypeToggle: function(){
			var base = clutil.view2data(this.$('#ca_baseField'));
			if(base.L_brand <= 0 || base.L_cloth <= 0){
				return;
			}
			var other = clutil.view2data(this.$('#ca_otherField'));
			var modelJK = base.L_jkType;
			var chkJK = 0;
			if(base.L_jk == 1){
				chkJK = TYPE.L_JK;
			}
			this.L_setStyleSel(false, base, other, $("#ca_L_jk_style"), $("#ca_L_jk_styleArea"), chkJK, modelJK);
			this.L_lockUnselectJkStyle();
		},
		_onL_sk_ChangeModelTypeToggle:function(){
			var base = clutil.view2data(this.$('#ca_baseField'));
			if(base.L_brand <= 0 || base.L_cloth <= 0){
				return;
			}
			var other = clutil.view2data(this.$('#ca_otherField'));
			var modelSK = base.L_skType;
			var chkSK = 0;
			if(base.L_sk == 1){
				chkSK = TYPE.L_SK;
			}
			this.L_setStyleSel(false, base, other, $("#ca_L_sk_style"), $("#ca_L_sk_styleArea"), chkSK, modelSK);
			this.L_lockUnselectSkStyle();
		},
		_onL_sl_ChangeModelTypeToggle:function(){
			var base = clutil.view2data(this.$('#ca_baseField'));
			if(base.L_brand <= 0 || base.L_cloth <= 0){
				return;
			}
			var other = clutil.view2data(this.$('#ca_otherField'));
			var modelSL = base.L_slType;
			var chkSL = 0;
			if(base.L_sl == 1){
				chkSL = TYPE.L_SL;
			}
			this.L_setStyleSel(false, base, other, $("#ca_L_sl_style"), $("#ca_L_sl_styleArea"), chkSL, modelSL);
			this.L_lockUnselectSlStyle();
		},


		/**レディスジャケットスタイル変更*/
		_onL_jk_ChangeStyle:function(){
			if($("#ca_L_jk_style").val() <= 0){
				this.L_lockUnselectJkStyle();
			}
			else{
				var _this = this;
				var style = $("#ca_L_jk_style").val();
				var func = this.makeStyleOptSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_JK, style, null, null);
				$.when(func).done(function(){
					_this.L_lockselectJkStyle();
					_this.make_L_S_Size(false, style, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_JK, $("#ca_L_jk_size"), null);
					if(_this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
							&& _this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
						_this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_brand").val());
					}
					_this.disabledSlider($('.ca_L_jk_sizeEffect_slider'), $('.ca_L_jk_sizeEffect_sliderDot'));
				});
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
				var _this = this;
				var style = $("#ca_L_sk_style").val();
				var func = this.makeStyleOptSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_SK, style, null, null);
				$.when(func).done(function(){
					_this.L_lockselectSkStyle();
					_this.make_L_S_Size(false, style, amcm_type.AMCM_VAL_PO_CLASS_LADYS
							, TYPE.L_SK, $("#ca_L_sk_size"), null);
					if(_this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
							&& _this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
						_this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_brand").val());
					}
					_this.disabledSlider($('.ca_L_sk_sizeEffect_slider'), $('.ca_L_sk_sizeEffect_sliderDot'));
				});
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
				var _this = this;
				var style = $("#ca_L_sl_style").val();
				var func = this.makeStyleOptSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_SL, style, null, null);
				$.when(func).done(function(){
					_this.L_lockselectSlStyle();
					_this.make_L_S_Size(false, style, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_SL, $("#ca_L_sl_size"), null);
					if(_this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
							&& _this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
						_this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_brand").val());
					}
				});
			}
		},
		L_lockUnselectSlStyle: function(){
			// スタイル配下を触れないように
			clutil.viewReadonly(this.$("#ca_L_slOptDiv"));
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
				var _this = this;
				var style = $("#ca_L_ve_style").val();
				var func = this.makeStyleOptSel(false, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_VE, style, null, null);
				$.when(func).done(function(){
					_this.L_lockselectVeStyle();
					_this.make_L_S_Size(false, style, amcm_type.AMCM_VAL_PO_CLASS_LADYS, TYPE.L_VE, $("#ca_L_ve_size"), null);
					if(_this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
							&& _this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
						_this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_LADYS, $("#ca_L_brand").val());
					}
				});
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

			$("#ca_L_jk_length_sliderArea").show();
			this.makeSlider($("#ca_L_jk_length_slider"), $("#ca_L_jk_length")
					, len, -5.0, 5.0, 0.5);

//			if(lim >= SLIDER.L_JK_LEN1){
//			$("#ca_L_jk_length_sliderArea").show();
//			this.makeSlider($("#ca_L_jk_length_slider"), $("#ca_L_jk_length")
//			, len, -5.0, 5.0, 0.5);
//			}
//			else if(lim > SLIDER.L_JK_LEN1){
//			$("#ca_L_jk_length3_sliderArea").show();
//			this.makeSlider($("#ca_L_jk_length3_slider"), $("#ca_L_jk_length")
//			, len, -3.0, 3.0, 0.5);
//			}
//			else{
//			$("#ca_L_jk_length2_sliderArea").show();
//			this.makeSlider($("#ca_L_jk_length2_slider"), $("#ca_L_jk_length")
//			, len, -2.0, 2.0, 0.5);
//			}
		},
		L_showJkArmSlider:function(lim, armL, armR){
			$(".ca_L_jk_armLeftSlider").hide();
			$(".ca_L_jk_armRightSlider").hide();
			$("#ca_L_jk_armLeft").val(0);
			$("#ca_L_jk_armRight").val(0);

			$("#ca_L_jk_armLeft_sliderArea").show();
			$("#ca_L_jk_armRight_sliderArea").show();
			this.makeSlider($("#ca_L_jk_armLeft_slider"), $("#ca_L_jk_armLeft")
					, armL, -7.0, 7.0, 0.5);
			this.makeSlider($("#ca_L_jk_armRight_slider"), $("#ca_L_jk_armRight")
					, armR, -7.0, 7.0, 0.5);

//			if(lim >= SLIDER.L_JK_ARM1){
//			$("#ca_L_jk_armLeft_sliderArea").show();
//			$("#ca_L_jk_armRight_sliderArea").show();
//			this.makeSlider($("#ca_L_jk_armLeft_slider"), $("#ca_L_jk_armLeft")
//			, armL, -7.0, 7.0, 0.5);
//			this.makeSlider($("#ca_L_jk_armRight_slider"), $("#ca_L_jk_armRight")
//			, armR, -7.0, 7.0, 0.5);
//			}
//			else{
//			$("#ca_L_jk_armLeft2_sliderArea").show();
//			$("#ca_L_jk_armRight2_sliderArea").show();
//			this.makeSlider($("#ca_L_jk_armLeft2_slider"), $("#ca_L_jk_armLeft")
//			, armL, -2.0, 2.0, 0.5);
//			this.makeSlider($("#ca_L_jk_armRight2_slider"), $("#ca_L_jk_armRight")
//			, armR, -2.0, 2.0, 0.5);
//			}
		},
		L_showSkLenSlider:function(lim, len){
			$(".ca_L_sk_lengthSlider").hide();
			$("#ca_L_sk_length").val(0);

			$("#ca_L_sk_length5_sliderArea").show();
			this.makeSlider($("#ca_L_sk_length5_slider"), $("#ca_L_sk_length")
					, len, -5.0, 5.0, 0.5);

//			if(lim > SLIDER.L_SK_LEN1){
//			$("#ca_L_sk_length10_sliderArea").show();
//			this.makeSlider($("#ca_L_sk_length10_slider"), $("#ca_L_sk_length")
//			, len, -10.0, 10.0, 0.5);
//			}
//			else{
//			$("#ca_L_sk_length5_sliderArea").show();
//			this.makeSlider($("#ca_L_sk_length5_slider"), $("#ca_L_sk_length")
//			, len, -5.0, 5.0, 0.5);
//			}
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

			if(size > 0 && this.sizeList1[TYPE.L_SK]){
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
		 * レディス：ボタン変更ラジオ変更
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
		 * レディス：裏地変更ラジオ変更
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

//			if(val == 0){
//				$("#ca_L_jk_changeLiningSelDiv").hide();
//				$("#ca_L_jk_changeLiningSel").removeClass("cl_required");
//			}
//			else{
//				$("#ca_L_jk_changeLiningSelDiv").show();
//				$("#ca_L_jk_changeLiningSel").addClass("cl_required");
//			}
//			var $target = $(e.target);
//			if(!$target.attr("checked")){
//			return;
//			}
//			var radio = $("input:radio[name=ca_L_jk_changeLiningType]:checked");
//			var val = radio.val();

//			if(val == 0){
//			$("#ca_L_jk_changeLiningSelDiv").hide();
//			$("#ca_L_jk_changeLiningSel").removeClass("cl_required");
//			}
//			else{
//			$("#ca_L_jk_changeLiningSelDiv").show();
//			$("#ca_L_jk_changeLiningSel").addClass("cl_required");
//			}
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
		},


		/** 店舗着日設定*/
		setArrivalDate:function(date){
			clutil.datepicker($("#ca_arrivalDate")).datepicker('setIymd', date );
			if(date <= 0){
				clutil.datepicker($("#ca_saleDate")).datepicker('setIymd', date );
			}
			else{
				$("#ca_saleDate").datepicker('setIymd', clutil.addDate(date, 1));
			}
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

			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				// メンズ仕様にする
				this.showMens();
				$(".ca_M_Div").hide();
			}
			else {
				this.showLedies();
				$(".ca_L_Div").hide();
			}

			// その他初期状態
			clutil.data2view($("#ca_other_form"), otherClearObj);

			// 店舗選択待ち
			clutil.viewReadonly(this.$("#ca_brandArea"));
			clutil.viewReadonly(this.$(".ca_M_Div"));
			clutil.viewReadonly(this.$(".ca_L_Div"));
			this.disabledSliderAll();

		},

		showMens:function(){
			// ブランド・生地
			$(".ca_M_Area").show();
			$(".ca_L_Area").hide();
			//納期
			$("#ca_expressArea").hide();
			//その他
			$("#ca_otStoreAdjTypeIDArea").show();
			// 必須条件
			$(".cl_M_required").removeClass("cl_required");
			$(".cl_L_required").removeClass("cl_required");
			$(".cl_M_com_required").addClass("cl_required");
		},

		showLedies:function(){
			// ブランド・生地
			$(".ca_M_Area").hide();
			$(".ca_L_Area").show();
			// 納期
			$("#ca_expressArea").hide();
			//その他
			$("#ca_otStoreAdjTypeIDArea").show();
			$(".ca_L_Div").hide();
			// 必須条件
			$(".cl_M_required").removeClass("cl_required");
			$(".cl_L_required").removeClass("cl_required");
			$(".cl_L_com_required").addClass("cl_required");
		},

		/**
		 * 選択店舗変更
		 */
		_onChangeStore: function(flag){
			var d = new $.Deferred;

			var old = $("#ca_storeID_old").val();
			var storeItem = this.$("#ca_storeID").autocomplete('clAutocompleteItem');
			var storeID = 0;
			if (storeItem != null && storeItem.id == old && !flag) {
				return d.promise();
			}
			if( storeItem == null || storeItem.id  <= 0){
				this.lockUnselectStore();
			}
			else{
				this.lockChangeStore();
				this._onOrderTypeToggle(null);
				storeID = storeItem.id;
			}
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				clutil.viewReadonly($("#ca_kindClearArea"));
			}
			else{
				//clutil.data2view($("#ca_kindClearArea"), kindClearObj);
			}
			$("#ca_storeID_old").val(storeID);

			return d.promise();
		},
		// 店舗未選択
		lockUnselectStore: function(){
			// ブランドエリアを触れないように
			clutil.viewReadonly(this.$("#ca_brandArea"));
			clutil.data2view($("#ca_kindClearArea"), kindClearObj);
			// 選択種別で画面初期化
			var val = $("input:radio[name=ca_orderType]:checked").val();

			this.M_lockUnselectSeason();
			this.L_lockUnselectBrand();
			//this.S_lockUnselectBrand();
			this.setDivs(false, null, null);
			clutil.data2view($('#ca_M_seasonArea'), M_SeasonClearObj);
			clutil.data2view($('#ca_L_brandArea'), L_BrandClearObj);
			//clutil.data2view($('#ca_S_brandArea'), S_BrandClearObj);
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
			//this.S_lockUnselectBrand();
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
			var unitID = 6;
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
			$.ajax({
				url: uri,
				type: "GET",
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
			var grpcd = 2;

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
			this.setReadOnlyAllItems(false);
			switch(args.status){
			case 'OK':
				this.getData2View(data);

				switch (this.options.opeTypeId) {
				//この画面に来る場合は編集or削除のみ
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					this.setReadOnlyAllItems(true);
					this._hideFooter();
					this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					this.setReadOnlyAllItems(true);
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
//				this._tableDisable();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示


				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				break;
			}
		},

		/**
		 * dataを表示
		 */

		getData2View: function(data){
			var _this = this;
			var getRsp = data.AMPOV0280GetRsp;

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
			this.loadBaseArea(orderType, order, base, other);
//			var funcBase = this.loadBaseArea(orderType, base, other);
//			$.when(funcBase).done(function(){
//			// ブランド領域の情報を設定した後に、各オーダー内容を詰める
//			// そうでないとオプションの編集可不可がおかしくなる
//			_this.loadOrderArea(orderType, order, base, other);
//			});
			// その他情報表示
			_this.loadOtherArea(orderType, other);

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
					InsOldDateInput:clcom.getOpeDate(),
					// レコード情報
					recno:order.recno,
					state:order.state,
					poOrderID:order.poOrderID,
					firstID:order.firstID,
					poTypeID:order.poTypeID,
					// 店舗情報
					storeID:order.storeID,
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
					S_brand:0,S_cloth:0,S_num:0
			};
			if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				// 2015/9/2 電話番号非表示対応 藤岡
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
				data.L_jk = 0;
				data.L_sk = 0;
				data.L_sl = 0;
				data.L_ve = 0;
				data.L_jkType = model.jacket.modelID;
				if(model.jacket.modelID != 0){
					data.L_jk = 1;
					data.L_jkType = model.jacket.modelID;
				}
				data.L_skType = model.skirt.modelID;
				if(model.skirt.modelID != 0){
					data.L_sk = 1;
					data.L_skType = model.skirt.modelID;
				}
				data.L_slType = model.pants.modelID;
				if(model.pants.modelID != 0){
					data.L_sl = 1;
					data.L_slType = model.pants.modelID;
				}
				data.L_season = order.seasonID;
				data.L_cloth = order.clothIDID;
				data.L_brand = order.brandID;
			}
			else {

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
					// メモ等
					otStoreAdjTypeID:other.otStoreAdjTypeID,
					otRcptNo:other.otRcptNo,
					otStoreMemo:other.otStoreMemo
			};
			return data;
		},
		// 2015/9/2 電話番号非表示対応 藤岡
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
						M_jk_nameKanji:this.setNameInput(TYPE.KANJI, mJacket.jkNameTypeID, mJacket.jkName),
						M_jk_nameFull:this.setNameInput(TYPE.FULL, mJacket.jkNameTypeID, mJacket.jkName),
						M_jk_nameIni:this.setNameInput(TYPE.INI, mJacket.jkNameTypeID, mJacket.jkName),
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
						M_sl_bottomSpareType:mSlacks.slSpareBtmTypeID,
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
						L_jk_nameKanji:this.setNameInput(TYPE.KANJI, lJacket.jkNameTypeID, lJacket.jkName),
						L_jk_nameFull:this.setNameInput(TYPE.FULL, lJacket.jkNameTypeID, lJacket.jkName),
						L_jk_nameIni:this.setNameInput(TYPE.INI, lJacket.jkNameTypeID, lJacket.jkName),
						L_jk_nameMakeType:lJacket.jkNameFlagTypeID,
						L_jk_armLeft:lJacket.jkLSleeveAdjLen,
						L_jk_armRight:lJacket.jkRSleeveAdjLen,
						L_jk_length:lJacket.jkAdjLen,
						L_jk_ventType:lJacket.jkVent,
						L_jk_cuffsType:lJacket.jkSleeveDesign,
						L_jk_amfType:lJacket.jkAmfStitch,
						L_jk_pocketInnerType:lJacket.jkInsidePocket,
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

				};
			}


			return data;
		},

		// 名称設定
		setNameInput:function(type, chkType, name){
			var disp = "";
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
			var url = clcom.appRoot + '/AMPO/AMPOV0281/AMPOV0281.html';
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
				if(base.L_jk == 0 && base.L_sk == 0 && base.L_sl == 0){
					flag = false;
					msg = '品種を1つ以上選択してください。';
					clutil.mediator.trigger('onTicker', msg);
				}
				if (base.L_jk == 0) {
					base.L_jkType = 0;
				}
				if (base.L_sk == 0) {
					base.L_skType = 0;
				}
				if (base.L_sl == 0) {
					base.L_slType = 0;
				}
			}
			else{
				order =  clutil.view2data(this.$('#ca_S_Field'));
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
					&& base.L_sl == 1){
				if(this._onBlurL_LeftCheckStep05() == false){
					flag = false;
				}
				if(this._onBlurL_RightCheckStep05() == false){
					flag = false;
				}
			}

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
				base.seasonObj = this.makeObj(this.seasonList, base.L_season);
				base.clothObj = this.makeObj(this.clothList, base.L_cloth);
				base.brandObj = this.makeObj(this.brandList, base.L_brand);
				base.modelJkObj = this.makeObj(this.modelList, base.L_jkSel);
				base.modelSkObj = this.makeObj(this.modelList, base.L_skSel);
				base.modelSlObj = this.makeObj(this.modelList, base.L_slSel);
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

			}

			return order;
		},

		// リストから、対象のオブジェクト生成
		makeObj:function(list, tgtID){
			var i;
			var obj = {
					id:0,
					code:"",
					name:""
			};
			if (list != null) {
				for(i = 0; i < list.length; i++){
					if(tgtID == list[i].id){
						obj = list[i];
					}
				}
			}
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
		setSelListBrand:function($el, list){
			var unselectedflag = list != null && list.length == 1 ? false : true;
			var opt = {
					$select	:$el,
					list:list,
					unselectedflag:unselectedflag,
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
					// PO発注検索リクエスト
					AMPOV0280GetReq: {
						reqType :OPETYPE.AMPOV0280_REQTYPE_NOMAL,
						poTypeID:this.options.chkData[pgIndex].poTypeID,
						srchID: this.options.chkData[pgIndex].poOrderID,
						srchType: srchType
					},
					// PO発注更新リクエスト -- 今は検索するので、空を設定
					AMPOV0280UpdReq: {
					}
			};

			// 20160112 複製時のリクエストヘッダ修正
			if(ope ==  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				getReq.reqHead.opeTypeId =  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY;
			}
			_termChg_Flag = this.options.chkData[pgIndex].mode;
			return {
				resId: clcom.pageId,	//'AMPOV0280',
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
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				flag = false;
			}else{
				num = _tgtText.match(/\n/g);
				if(num != null){
					if( num.length  > 3){
						this.validator.setErrorMsg(this.$("#ca_otStoreMemo"), clmsg.EPO0068);
						clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
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


			this.loadBaseArea(orderType, order, base, other);

//			// 画面情報反映
//			var funcBase = this.loadBaseArea(orderType, base, other);

//			$.when(funcBase).done(function(){
//			// ブランド領域の情報を設定した後に、各オーダー内容を詰める
//			// そうでないとオプションの編集可不可がおかしくなる
//			_this.loadOrderArea(orderType, order, base, other);
//			});
			// その他条件反映
			this.loadOtherArea(orderType, other);
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
				//clutil.viewReadonly(this.$(".ca_L_SelArea"));
				clutil.viewReadonly(this.$("#ca_L_brandArea"));
				clutil.viewReadonly(this.$("#ca_L_clothArea"));
				clutil.viewReadonly(this.$("#ca_S_clothArea"));
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				this.showLedies();
				clutil.viewReadonly(this.$("#ca_S_clothArea"));
			}
			// 各白箱設定
			this.setDivs(true, type, base);
		},
		// 基本情報場所の表示設定
		loadBaseArea:function(orderType, order, base, other){
			var _this = this;
			base.storeID_old = base.storeID;	// 選択済み店舗ID保存

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
				sel1 = this.makeSeasonSel(true, orderType, $("#ca_L_season"));
				sel2 = this.makeClothSel(true, orderType, $("#ca_L_cloth"), base, other);
				sel3 = this.makeBrandSel(true, orderType, $("#ca_L_brand"), base, other);
			}
			else{

			}
			// 非同期なので後に処理をまわす
			$.when(sel1,sel2,sel3).done(function(){
				clutil.data2view($('#ca_baseField'), base);

				if (base.L_jk != 0) {
					$("#ca_L_jkTypeDiv").show();
				}
				if (base.L_sk != 0) {
					$("#ca_L_skTypeDiv").show();
				}
				if (base.L_sl != 0) {
					$("#ca_L_slTypeDiv").show();
				}

				if(_this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
					//複製なら、レコード条件だけリセット
					_this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
					clutil.datepicker(_this.$("#ca_orderDate")).datepicker('setIymd', clcom.getOpeDate());
					_this.getArrivalDate(true, orderType, base);
					clutil.data2view($('#ca_recArea'), recClearObj);
					$("#ca_no").val("");
				}

				// 各区分処理
				// ここでやらないと非同期処理でセレクターが入らなくなったりするので注意
				_this.loadOrderArea(orderType, order, base, other);
			});
		},
		// その他情報場所の表示設定
		loadOtherArea:function(type, other){
			this.setOtStoreAdjType(type);
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
		loadOrderArea:function(orderType, order, base, other){
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
					//this._onM_jk_ChangeLiningTypeToggle(null, true, order.M_jk_changeLiningType);
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
					//this._onM_jk_ChangeLiningTypeToggle(null, true, order.M_jk_changeLiningType);
					this._onM_jk_liningTypeToggle(null, true, order.M_jk_liningType);
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
					//this._onM_ve_ChangeLiningTypeToggle(null, true, order.M_ve_changeLiningType);

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
					}

					// 裏仕様が総裏ならサマー不可(オプションセレクターの後でないと動かない)
					_this._onM_jk_liningTypeToggle(null, true, order.M_jk_liningType);

					// チェックがないものはクリア
					if(jkFlag == false){
						clutil.data2view($("#ca_M_jk_styleArea"), M_jkStyleClearObj);
						_this.M_lockUnselectJkStyle();
						_this.showM_veLining(true);
						//$("#ca_M_ve_changeLiningSel").Class("cl_required");
					}
					else{
						_this.showM_veLining(false);
						//$("#ca_M_ve_changeLiningSel").removeClass("cl_required");
					}


					if(slFlag == false){
						clutil.data2view($("#ca_M_sl_styleArea"), M_slStyleClearObj);
						_this.M_lockUnselectSlStyle();
					}
					if(veFlag == false){
						clutil.data2view($("#ca_M_ve_styleArea"), M_veStyleClearObj);
						_this.M_lockUnselectVeStyle();
						_this.showM_veLining(false);	// ベストが選択されていない場合は必須を外す
					}
				});
			}
			else if(orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						&& this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					clutil.viewRemoveReadonly($(".ca_L_clothEffectDiv"));
				}
				comSel1 = this.L_makeStyleSel(true, base, other);
				//comSel2 = this.makeStyleOptSel(true, orderType, TYPE.ALL, null, base, other);
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
					//this._onL_jk_ChangeLiningTypeToggle(null, true, order.L_jk_changeLiningType);
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
					// サイズセレクター
					sizeSlSel = this.make_L_S_Size(true, order.L_sl_style, amcm_type.AMCM_VAL_PO_CLASS_LADYS
							, TYPE.L_SL, $("#ca_L_sl_size"), base);
				}
				// 非同期なので後に処理をまわす
				$.when(comSel1, comOptSel1, comOptSel2, comOptSel3, comOptSel4
						, sizeJkSel, sizeSkSel, sizeSlSel, sizeVeSel).done(function(){
							clutil.data2view($('#ca_L_Field'), order);
							_this.loadSlider(amcm_type.AMCM_VAL_PO_CLASS_LADYS, order, base);
							_this._onL_jk_ChangeSize(null, true, order.L_jk_size, order.L_jk_length, order.L_jk_armLeft, order.L_jk_armRight);
							_this._onL_sk_ChangeSize(null, true, order.L_sk_size, order.L_sk_length);
							if(_this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
									&& _this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
								_this.chkBrandEffect(amcm_type.AMCM_VAL_PO_CLASS_LADYS, base.L_brand);
							}
							// チェックがないものはクリア
							if(jkFlag == false){
								clutil.data2view($("#ca_L_jk_styleArea"), L_jkStyleClearObj);
								_this.L_lockUnselectJkStyle();
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
				clutil.data2view(this.$('#ca_S_Field'), order);
			}
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

					this.makeSliderNonSign($("#ca_M_sl_bottom_slider"), $("#ca_M_sl_bottom")
							, order.M_sl_bottom, 2.0, 5.0, 0.5);
					this.makeSliderNonSign($("#ca_M_sl_bottomSpare_slider"), $("#ca_M_sl_bottomSpare")
							, order.M_sl_bottomSpare, 2.0, 5.0, 0.5);
					this.makeSlider($("#ca_M_sl_weist_slider"), $("#ca_M_sl_weist")
							, order.M_sl_weist, -5.0, 5.0, 0.5);
				}
				if(base.M_jk == 1){
					this.makeSlider($("#ca_M_jk_armLeft_slider"), $("#ca_M_jk_armLeft")
							, order.M_jk_armLeft, -5.0, 5.0, 0.5);
					this.makeSlider($("#ca_M_jk_armRigth_slider"), $("#ca_M_jk_armRigth")
							, order.M_jk_armRigth, -5.0, 5.0, 0.5);
					this.makeSlider($("#ca_M_jk_length_slider"), $("#ca_M_jk_length")
							, order.M_jk_length, -5.0, 5.0, 0.5);
				}
				if(base.M_sl == 1){
					this.makeSliderNonSign($("#ca_M_sl_bottom_slider"), $("#ca_M_sl_bottom")
							, order.M_sl_bottom, 2.0, 5.0, 0.5);
					this.makeSliderNonSign($("#ca_M_sl_bottomSpare_slider"), $("#ca_M_sl_bottomSpare")
							, order.M_sl_bottomSpare, 2.0, 5.0, 0.5);
					this.makeSlider($("#ca_M_sl_weist_slider"), $("#ca_M_sl_weist")
							, order.M_sl_weist, -5.0, 5.0, 0.5);
				}
				if(base.M_ve == 1){
					this.makeSlider($("#ca_M_ve_trunk_slider"), $("#ca_M_ve_trunk")
							, order.M_ve_trunk, -8.0, 8.0, 0.5);
				}
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				if(base.L_jk == 1){
					this.makeSlider($("#ca_L_jk_armLeft_slider"), $("#ca_L_jk_armLeft")
							, order.L_jk_armLeft, -7.0, 7.0, 0.5);
					this.makeSlider($("#ca_L_jk_armLeft2_slider"), $("#ca_L_jk_armLeft")
							, order.L_jk_armLeft, -2.0, 2.0, 0.5);
					this.makeSlider($("#ca_L_jk_armRight_slider"), $("#ca_L_jk_armRight")
							, order.L_jk_armRight, -7.0, 7.0, 0.5);
					this.makeSlider($("#ca_L_jk_armRight2_slider"), $("#ca_L_jk_armRight")
							, order.L_jk_armRight, -2.0, 2.0, 0.5);
					this.makeSlider($("#ca_L_jk_length_slider"), $("#ca_L_jk_length")
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

			}
		},
		// T179(メンズST,JK選択時はVEの裏地非表示)
		showM_veLining:function(flag){
			if(flag == true){
				$("#ca_M_ve_changeLiningSelDiv").show();
				$("#ca_M_ve_changeLiningSel").addClass("cl_required");
				//$("#ca_M_ve_changeLiningTypeDiv").show();
			}
			else{
				$("#ca_M_ve_changeLiningSelDiv").hide();
				$("#ca_M_ve_changeLiningSel").removeClass("cl_required");
//				$("#ca_M_ve_changeLiningTypeDiv").hide();
//				$("#ca_M_ve_changeLiningSelDiv").hide();
//				clutil.data2view($("#ca_M_ve_changeLiningTypeDiv"), {M_ve_changeLiningType:0});
//				clutil.data2view($("#ca_M_ve_changeLiningSelDiv"), {M_ve_changeLiningSel:0});
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

	if(clcom.dstId == "AMPOV0281" && clcom.returnValue.f_back != true){
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
