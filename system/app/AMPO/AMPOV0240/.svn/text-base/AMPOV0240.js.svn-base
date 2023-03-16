useSelectpicker2();

var destroySelectpicker = function(el){
	try{
		$(el).selectpicker('destroy');
	}catch(e){}
};

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	var _changeTypeArgs = {
			ALL			: 0,
			STORE		: 1,
			BRAND		: 2,
			STYLE		: 3,
			CLOTH		: 4,
			ORDDAY		: 5,
			NEXTITEM	: 6,
			SUITS		: 1,
			JACKET		: 2,
			SLACKS		: 3,
			VEST		: 1,

	};

	var _copy_rec = null;

	var _termChg_Flag = 0;

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
			"change #ca_InsOldDate"	: "_onInsOldDataChange",	// 過去日変更(今のところ、何もしていない)
			"change #ca_brandID" 	: "_BrandTypeChange",		// ブランド変更時の処理

			"change #ca_jacket" 	: "_JacketModelChange",		// モデル変更(ジャケット)
			"change #ca_skirt" 		: "_SkirtModelChange",		// モデル変更(スカート)
			"change #ca_pants" 		: "_PantsModelChange",		// モデル変更(パンツ)
			"change #ca_vest" 		: "_VestModelChange",		// モデル変更(ベスト)

			"change #ca_clothIDID" 	: "_clothIDIDChange",		// 生地番号変更時
			"change #ca_jkStyle" 	: "_styleChangJK",		// スタイル変更時サイズ取得
			"change #ca_skStyle" 	: "_styleChangSK",		// スタイル変更時サイズ取得
			"change #ca_paStyle" 	: "_styleChangPA",		// スタイル変更時サイズ取得
			"change #ca_veStyle" 	: "_styleChangVE",		// スタイル変更時サイズ取得

			"click #ca_btn_store_select"				: "_onStoreSelClick",	// 店舗選択
			"click #ca_btn_guest_select"				: "_onGuestSelClick",	// 顧客調査
			"clDatepickerOnSelect #ca_orderDate" : "doSrchBrand",	//注文日変更
			"change #ca_orderDate" : "doSrchBrand",					//注文日変更
			"blur  #ca_otStoreMemo" : "chkOtstoreMemo",
			"clDatepickerOnSelect #ca_InsOldDateInput" : "_onInsOldDateInputChange",	//注文日変更
			"change #ca_InsOldDateInput" : "_onInsOldDateInputChange"	//注文日変更
		},

		// clutil.typeselector3 の opt 引数を保存。
		// key - selector 要素の id 属性値。
		// val - typeselector3 の opt 引数。
		selector3Opts: {},

		/**
		 * opt : clcom.pageArgs
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
						title: 'POレディス発注登録',
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
								// キャンセルボタンは新規のときはクリア機能とする
//								btn_cancel: {
//								label:(o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)?
//								'一覧に戻る':'クリア',
//								action: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)?
//								undefined:this._doNewCancel
//								},
								btn_cancel: {
									label:'一覧に戻る',
									action: undefined
								},
								// 更新成功時のダイアログは自前で作成するので非表示に
								updMessageDialog: false
				};
				return mdOpt;
			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// それ以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
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
					org_typeid:	amcm_type.AMCM_VAL_ORG_KIND_STORE
//					p_org_id	: clcom.userInfo.unit_id
				},
			});
			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				this.utl_store.setValue({id: storeID, code: storeCode, name: storeName});
				clutil.viewReadonly($("#ca_storeID_div"));
				this.$("#ca_btn_store_select").attr("disabled", true);
				this.$("#ca_btn_store_select").hide();
			}else{

			}
			this.listenTo(this.utl_store, "change", this.storeChange);

			//担当者
			this.utl_staff = clutil.clstaffcode2($("#ca_userID"));

			// 補正区分
			clutil.cltypeselector(this.$("#ca_jkLSleeveAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_jkRSleeveAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_jkAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_skWaistAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_skAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_paLBtmAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_paRBtmAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_paWaistAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_veAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_veTrunkAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			//店舗補正区分
			clutil.cltypeselector(this.$("#ca_otStoreAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_AT_STORE);

			// 裏地
			clutil.cltypeselector({
				$select: this.$("#ca_jkLiningTypeID"),
				kind: amcm_type.AMCM_TYPE_BACK_FABRIC_TYPE,
				ids: [
					amcm_type.AMCM_VAL_BACK_FABRIC_TYPE_LINING,
					amcm_type.AMCM_VAL_BACK_FABRIC_TYPE_UNLINED
				],
				unselectedflag: 1
			});

			//胸ポケット
			clutil.cltypeselector(this.$("#ca_jkChestPocketTypeID"), amcm_type.AMCM_TYPE_FREE_BREAST_POCKET);
			clutil.cltypeselector(this.$("#ca_veChestPocketTypeID"), amcm_type.AMCM_TYPE_FREE_BREAST_POCKET);
			//ネーム
			clutil.cltypeselector(this.$("#ca_jkNameTypeID"), amcm_type.AMCM_TYPE_NAME_TYPE);
			//スペア
			clutil.cltypeselector(this.$("#ca_skSpareTypeID"), amcm_type.AMCM_TYPE_SPARE_TYPE);
			clutil.cltypeselector(this.$("#ca_paSpareTypeID"), amcm_type.AMCM_TYPE_SPARE_TYPE);

			$("#tp_InsOldDateInput").tooltip({html: true});
			$("#tp_vest").tooltip({html: true});
			$("#tp_tel").tooltip({html: true});
			$("#tp_jjkName").tooltip({html: true});
			$("#tp_jkLSleeveAdjTypeID").tooltip({html: true});
			$("#tp_jkRSleeveAdjTypeID").tooltip({html: true});
			$("#tp_jkAdjTypeID").tooltip({html: true});
			$("#tp_jkInsidePocket").tooltip({html: true});
			$("#tp_jkSleeveDesign").tooltip({html: true});
			$("#tp_jkVent").tooltip({html: true});
			$("#tp_skWaistAdjTypeID").tooltip({html: true});
			$("#tp_skAdjTypeID").tooltip({html: true});
			$("#tp_paLLegLen").tooltip({html: true});
			$("#tp_paRLegLen").tooltip({html: true});
			$("#tp_paLBtmAdjTypeID").tooltip({html: true});
			$("#tp_paRBtmAdjTypeID").tooltip({html: true});
			$("#tp_paWaistAdjTypeID").tooltip({html: true});
			$("#tp_veAdjTypeID").tooltip({html: true});

			$("#tp_jkSleeveDesign_ori").tooltip({html: true});
			$("#tp_skAdjTypeID_ori").tooltip({html: true});
			$("#tp_jkAdjTypeID_ori").tooltip({html: true});
			$("#tp_jkLSleeveAdjTypeID_ori").tooltip({html: true});
			$("#tp_jkRSleeveAdjTypeID_ori").tooltip({html: true});

			$(".ca_aokiHelp").show();
			$(".ca_oriHelp").hide();

			var $orderDate = clutil.datepicker(this.$("#ca_orderDate") );
//			$orderDate.datepicker('setIymd', -1);
			$orderDate.datepicker('setIymd', clcom.getOpeDate());
			clutil.viewReadonly(this.$("#ca_orderDate_div"));
			var $arrivalDate = clutil.datepicker(this.$("#ca_arrivalDate"));
			$arrivalDate.datepicker('setIymd', -1);
			clutil.viewReadonly(this.$("#ca_arrivalDate_div"));
			var $saleDate = clutil.datepicker(this.$("#ca_saleDate"));
			$saleDate.datepicker('setIymd', -1);
			this.$("#ca_InsOldDateInput").removeClass("cl_required");
			this.$("#ca_InsOldDateInput_div_div").hide();

			// Fieldlimit
			clutil.cltxtFieldLimit($("#ca_userID"));
			clutil.cltxtFieldLimit($("#ca_custName"));
			clutil.cltxtFieldLimit($("#ca_custNameKana"));
			clutil.cltxtFieldLimit($("#ca_membNo"));
			clutil.cltxtFieldLimit($("#ca_jkName"));
			clutil.cltxtFieldLimit($("#ca_otRcptNo"));
			clutil.cltxtFieldLimit($("#ca_otStoreMemo"));
//			clutil.cltxtFieldLimit($("#ca_telNo1"));
//			clutil.cltxtFieldLimit($("#ca_telNo2"));
//			clutil.cltxtFieldLimit($("#ca_telNo3"));
			this.initUIElement_AMPAV0010();

			// 新規登録、編集時にプレースホルダ―表示
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				var name_message = "漢字または半角ローマ字でネームを入力";
				$("#ca_jkName").attr("placeholder", name_message);
			}

			return this;
		},



		storeChange:function(){
			var store = $("#ca_storeID").autocomplete('clAutocompleteItem');
			var unit = store.unit_id;


			//店舗の所属ユニットによって表示するヘルプ内容を変更
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$(".ca_aokiHelp").show();
				$(".ca_oriHelp").hide();
			}
			else if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				$(".ca_aokiHelp").hide();
				$(".ca_oriHelp").show();
			}

			//ブランド検索
			this.doSrchBrand();
		},

		initUIElement_AMPAV0010 : function(){
			var _this = this;
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
					var d = myView.doSrchBrand();
					d.done(function(){
						clutil.setFocus(myView.$("#ca_btn_store_select"));
					});
				}, this);
			},this);

		},

		render: function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				//編集可能時間のチェック(新規のみ)
				//それ以外の更新等は呼び出し元の一覧画面にて制御済み
				var srchReq = {
						reqHead: {
							opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						},
						AMPOV0240GetReq :{
							reqType: 5,
							poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS
						}
				};
				clutil.postJSON('AMPOV0240', srchReq).fail(_.bind(function(data){
					// エラーメッセージを通知。
					clutil.mediator.trigger('onTicker', data);
					this.setReadOnlyAllItems(true);
					this._hideFooter();
					return ;
				}, this));
				if (clcom.userInfo.unit_id == clcom.getSysparam('PAR_AMMS_UNITID_ORI')){
					this.$("#ca_vest_div_div").hide();
					this.$("#ca_vest_form").hide();
				}
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

				this.doSrchBrand();
//				this._changJK();
//				this._changSK();
//				this._changPA();
//				this._changVE();
			} else {
				this.mdBaseView.fetch();	// 新規以外はデータを GET してくる。
			}

			return this;
		},

		/**
		 * 対象チェックボタン変更
		 * 現在未使用
		 * 将来的に期間制御が加わるかもしれない
		 */
		_onInsOldDataChange: function(){
			var $check = this.$("#ca_InsOldDate");
			var isChecked = $check.attr("checked");
			var odrday = clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd');
			if (isChecked) {
				//過去日OK
				//過去日OK
				this.$("#ca_InsOldDateInput_div_div").show();
				this.$("#ca_InsOldDateInput").addClass("cl_required");
//				clutil.datepicker(this.$("#ca_InsOldDateInput")).datepicker('setIymd', odrday);
				clutil.datepicker(this.$("#ca_InsOldDateInput"), {
					  min_date: clcom.min_date,
					  max_date: clcom.getOpeDate()
					}).datepicker('setIymd', odrday);

				clutil.viewReadonly(this.$("#ca_orderDate_div"));
				//この時点で日付は変わらないのでクリアしない
			} else {
				//過去日不可
				this.$("#ca_InsOldDateInput").removeClass("cl_required");
				this.$("#ca_InsOldDateInput_div_div").hide();
				clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', clcom.getOpeDate());
				if(odrday !=  clcom.getOpeDate()){
					//入力されている日付が当日以外の場合
					//TODO
					this.doSrchBrand();
				}
//				clutil.viewRemoveReadonly(this.$("#ca_orderDate_div"));
			}
		},
		_onInsOldDateInputChange: function(){
			if( this.$("#ca_InsOldDateInput").val() == null || clutil.dateFormat(this.$("#ca_InsOldDateInput").val(), 'yyyymmdd')  <= 0){
				clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', -1);
				return;
			}
			var oldDate = clutil.dateFormat(this.$("#ca_InsOldDateInput").val(), 'yyyymmdd');
			clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', oldDate);
			this.doSrchBrand();
		},
		/**
		 * コンポーネント入力制御
		 * 大まかな動きのみ、微調整は各々で
		 */
		setReadOnlyAllItems: function(readOnly){
			if (readOnly == true){
				clutil.viewReadonly($("#ca_base_form"));
//				clutil.viewReadonly($("#ca_model_form"));
//				clutil.viewRemoveReadonly(this.$("#ca_jacket_div"));
//				clutil.viewRemoveReadonly(this.$("#ca_skirt_div"));
//				clutil.viewRemoveReadonly(this.$("#ca_pants_div"));
//				clutil.viewRemoveReadonly(this.$("#ca_vest_div"));
//				clutil.viewRemoveReadonly(this.$("#ca_clothIDID_div"));
				clutil.viewReadonly($("#ca_guest_form"));
				clutil.viewReadonly($("#ca_jacket_form"));
				clutil.viewReadonly($("#ca_skirt_form"));
				clutil.viewReadonly($("#ca_pants_form"));
				clutil.viewReadonly($("#ca_vest_form"));
				clutil.viewReadonly($("#ca_other_form"));
				this.$("#ca_InsOldDate").attr("disabled", true);
				$(this.$("#ca_InsOldDate").closest('label')).addClass("disabled");
				$("#ca_brandID_autofill").hide();
				$("#ca_clothNo_autofill").hide();
				$("#ca_jkStyle_autofill").hide();
				$("#ca_jkSize_autofill").hide();
				$("#ca_skStyle_autofill").hide();
				$("#ca_skSize_autofill").hide();
				$("#ca_paStyle_autofill").hide();
				$("#ca_paSize_autofill").hide();
				$("#ca_veStyle_autofill").hide();
				$("#ca_veSize_autofill").hide();

			}else{
				clutil.viewRemoveReadonly($("#ca_base_form"));
//				clutil.viewRemoveReadonly($("#ca_model_form"));
//				clutil.viewRemoveReadonly(this.$("#ca_jacket_div"));
//				clutil.viewRemoveReadonly(this.$("#ca_skirt_div"));
//				clutil.viewRemoveReadonly(this.$("#ca_pants_div"));
//				clutil.viewRemoveReadonly(this.$("#ca_vest_div"));
//				clutil.viewRemoveReadonly(this.$("#ca_clothIDID_div"));
				clutil.viewRemoveReadonly($("#ca_guest_form"));
				clutil.viewRemoveReadonly($("#ca_jacket_form"));
				clutil.viewRemoveReadonly($("#ca_skirt_form"));
				clutil.viewRemoveReadonly($("#ca_pants_form"));
				clutil.viewRemoveReadonly($("#ca_vest_form"));
				clutil.viewRemoveReadonly($("#ca_other_form"));
				clutil.viewReadonly(this.$("#ca_orderDate_div"));
				if(_termChg_Flag != 1){
					clutil.viewReadonly($("#ca_arrivalDate_div"));
				}
				if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
					clutil.viewReadonly($("#ca_storeID_div"));
					this.$("#ca_btn_store_select").attr("disabled", true);
					this.$("#ca_btn_store_select").hide();
				}
			}
			//どんな状況で触れない場所を入力不可にする
			clutil.viewReadonly($("#ca_no_div"));			//管理者番号
			clutil.viewReadonly($("#ca_price_div"));	//プライス
		},
		/**
		 * フィールドのデータクリア
		 * type		:変更理由
		 */
		_clearAllForm:function(type){
			this._clearBaseForm(type);
			this._clearModelForm(type);
			this._clearGuestForm(type);
			this._clearJacketForm(type);
			this._clearSkirtForm(type);
			this._clearPantsForm(type);
			this._clearVestForm(type);
			this._clearOtherForm(type);
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this._changJK();
				this._changSK();
				this._changPA();
				this._changVE();
			}
			clutil.cltxtFieldLimitReset($("#ca_userID"));
			clutil.cltxtFieldLimitReset($("#ca_custName"));
			clutil.cltxtFieldLimitReset($("#ca_custNameKana"));
			clutil.cltxtFieldLimitReset($("#ca_membNo"));
			clutil.cltxtFieldLimitReset($("#ca_jkName"));
			clutil.cltxtFieldLimitReset($("#ca_otRcptNo"));
			clutil.cltxtFieldLimitReset($("#ca_otStoreMemo"));
			clutil.initUIelement(this.$el);
		},
		/*
		 * 基本情報
		 */
		_clearBaseForm:function(type){
			if(type == _changeTypeArgs.ALL){
				//チェックボックスのチェックを外す
				this.$("#ca_InsOldDate").closest("label").removeClass("checked");
				this.$("#ca_InsOldDate").removeAttr("checked");
				//店舗ユーザはクリアしない
				if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
					this.$("#ca_storeID").val("");
				}
				this.$("#ca_userID").val("");
				this.$("#ca_no").val("");
				this.$("#ca_brandID").val("");
				clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', clcom.getOpeDate());
//				clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', -1);
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
				clutil.datepicker(this.$("#ca_saleDate")).datepicker('setIymd', -1);
			}else if(type == _changeTypeArgs.NEXTITEM){
				//チェックボックスのチェックを外す
				this.$("#ca_InsOldDate").closest("label").removeClass("checked");
				this.$("#ca_InsOldDate").removeAttr("checked");
				this.$("#ca_no").val("");
				this.$("#ca_brandID").val("");
				clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', clcom.getOpeDate());
//				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
				clutil.datepicker(this.$("#ca_saleDate")).datepicker('setIymd', -1);
			}else if(type == _changeTypeArgs.STORE){
				this.$("#ca_brandID").val("");
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
			}else if(type == _changeTypeArgs.BRAND){
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
			}else if(type == _changeTypeArgs.CLOTH){
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
			}else if(type == _changeTypeArgs.ORDDAY){
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
			}
			clutil.cltxtFieldLimitReset($("#ca_userID"));

		},
		/*
		 * モデル
		 */
		_clearModelForm:function(type){
			if(type == _changeTypeArgs.ALL
					|| type == _changeTypeArgs.NEXTITEM
					|| type == _changeTypeArgs.STORE
					|| type == _changeTypeArgs.BRAND
			){
				this.$("#ca_jacket").val("");
				this.$("#ca_skirt").val("");
				this.$("#ca_pants").val("");
				this.$("#ca_vest").val("");
				this.$("#ca_clothIDID").val("");
			};
		},
		/*
		 * お客様情報
		 */
		_clearGuestForm:function(type){
			if(type == _changeTypeArgs.ALL){
				this.$("#ca_telNo1").val("");
				this.$("#ca_telNo2").val("");
				this.$("#ca_telNo3").val("");
				this.$("#ca_custName").val("");
				this.$("#ca_custNameKana").val("");
				this.$("#ca_membNo").val("");
			};
			clutil.cltxtFieldLimitReset($("#ca_custName"));
			clutil.cltxtFieldLimitReset($("#ca_custNameKana"));
			clutil.cltxtFieldLimitReset($("#ca_membNo"));
		},
		/*
		 * ジャケット
		 */
		_clearJacketForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_jkStyle").val("");
				this.$("#ca_jkSize").val("");
				this.$("#ca_jkLiningTypeID").val("");
				this.$("#ca_jkChestPocketTypeID").val("");
				this.$("#ca_jkNameTypeID").val("");
				this.$("#ca_jkName").val("");
				this.$("#ca_jkLSleeveAdjLen").val("");
				this.$("#ca_jkLSleeveAdjTypeID").val("");
				this.$("#ca_jkRSleeveAdjLen").val("");
				this.$("#ca_jkRSleeveAdjTypeID").val("");
				this.$("#ca_jkAdjLen").val("");
				this.$("#ca_jkAdjTypeID").val("");
				this.$("#ca_jkChangeButton").val("");
				this.$("#ca_jkChangeLining").val("");
				this.$("#ca_jkAmfStitch").val("");
				this.$("#ca_jkVent").val("");
				this.$("#ca_jkSleeveDesign").val("");
				this.$("#ca_jkInsidePocket").val("");
			}else if( type == _changeTypeArgs.BRAND ||   type == _changeTypeArgs.STORE){
				this.$("#ca_jkStyle").val("");
				this.$("#ca_jkSize").val("");
				this.$("#ca_jkLiningTypeID").val("");
				this.$("#ca_jkChestPocketTypeID").val("");
				this.$("#ca_jkNameTypeID").val("");
				this.$("#ca_jkName").val("");
				this.$("#ca_jkLSleeveAdjLen").val("");
				this.$("#ca_jkLSleeveAdjTypeID").val("");
				this.$("#ca_jkRSleeveAdjLen").val("");
				this.$("#ca_jkRSleeveAdjTypeID").val("");
				this.$("#ca_jkAdjLen").val("");
				this.$("#ca_jkAdjTypeID").val("");
				this.$("#ca_jkChangeButton").val("");
				this.$("#ca_jkChangeLining").val("");
				this.$("#ca_jkAmfStitch").val("");
				this.$("#ca_jkVent").val("");
				this.$("#ca_jkSleeveDesign").val("");
				this.$("#ca_jkInsidePocket").val("");
			}else if(type == _changeTypeArgs.STYLE){
				this.$("#ca_jkSize").val("");
			};
			clutil.cltxtFieldLimitReset($("#ca_jkName"));
		},
		/*
		 * スカート
		 */
		_clearSkirtForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_skStyle").val("");
				this.$("#ca_skSize").val("");
				this.$("#ca_skSpareTypeID").val("");
				this.$("#ca_skWaistAdjLen").val("");
				this.$("#ca_skWaistAdjTypeID").val("");
				this.$("#ca_skAdjLen").val("");
				this.$("#ca_skAdjTypeID").val("");
			}else if( type == _changeTypeArgs.BRAND ||   type == _changeTypeArgs.STORE){
				this.$("#ca_skStyle").val("");
				this.$("#ca_skSize").val("");
				this.$("#ca_skSpareTypeID").val("");
				this.$("#ca_skWaistAdjLen").val("");
				this.$("#ca_skWaistAdjTypeID").val("");
				this.$("#ca_skAdjLen").val("");
				this.$("#ca_skAdjTypeID").val("");
			}else if(type == _changeTypeArgs.STYLE){
				this.$("#ca_skSize").val("");
			};
		},
		/*
		 * パンツ
		 */
		_clearPantsForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_paStyle").val("");
				this.$("#ca_paSize").val("");
				this.$("#ca_paSpareTypeID").val("");
				this.$("#ca_paLLegLen").val("");
				this.$("#ca_paRLegLen").val("");
				this.$("#ca_paLBtmAdjLen").val("");
				this.$("#ca_paLBtmAdjTypeID").val("");
				this.$("#ca_paRBtmAdjLen").val("");
				this.$("#ca_paRBtmAdjTypeID").val("");
				this.$("#ca_paWaistAdjLen").val("");
				this.$("#ca_paWaistAdjTypeID").val("");
			}else if( type == _changeTypeArgs.BRAND ||   type == _changeTypeArgs.STORE){
				this.$("#ca_paStyle").val("");
				this.$("#ca_paSize").val("");
				this.$("#ca_paSpareTypeID").val("");
				this.$("#ca_paLLegLen").val("");
				this.$("#ca_paRLegLen").val("");
				this.$("#ca_paLBtmAdjLen").val("");
				this.$("#ca_paLBtmAdjTypeID").val("");
				this.$("#ca_paRBtmAdjLen").val("");
				this.$("#ca_paRBtmAdjTypeID").val("");
				this.$("#ca_paWaistAdjLen").val("");
				this.$("#ca_paWaistAdjTypeID").val("");
			}else if(type == _changeTypeArgs.STYLE){
				this.$("#ca_paSize").val("");
			};
		},
		/*
		 * ベスト
		 */
		_clearVestForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_veStyle").val("");
				this.$("#ca_veSize").val("");
				this.$("#ca_veChestPocketTypeID").val("");
				this.$("#ca_veAdjLen").val("");
				this.$("#ca_veAdjTypeID").val("");
				this.$("#ca_veChangeButton").val("");
				this.$("#ca_veChangeLining").val("");
				this.$("#ca_veBuckle").val("");
				this.$("#ca_veOptAmfStitch").val("");
			}else if( type == _changeTypeArgs.BRAND ||   type == _changeTypeArgs.STORE){
				this.$("#ca_veStyle").val("");
				this.$("#ca_veSize").val("");
				this.$("#ca_veChestPocketTypeID").val("");
				this.$("#ca_veAdjLen").val("");
				this.$("#ca_veAdjTypeID").val("");
				this.$("#ca_veChangeButton").val("");
				this.$("#ca_veChangeLining").val("");
				this.$("#ca_veBuckle").val("");
				this.$("#ca_veOptAmfStitch").val("");
			}else if(type == _changeTypeArgs.STYLE){
				this.$("#ca_veSize").val("");
			};
		},
		/*
		 * その他
		 */
		_clearOtherForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_otStoreAdjTypeID").val("");
				this.$("#ca_otRcptNo").val("");
				this.$("#ca_otStoreMemo").val("");
			}
			clutil.cltxtFieldLimitReset($("#ca_otRcptNo"));
			clutil.cltxtFieldLimitReset($("#ca_otStoreMemo"));
		},
		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){
			this.AMPAV0010Selector.show(null, null, {
//				org_id: clcom.userInfo.unit_id,
				func_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'),1)
			});
		},
		_onGuestSelClick: function(e){
			var _this = this;
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
			var unitID = this._getUnitID();
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

				if(list.response.kensu == undefined || list.response.kensu == 0){
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
		//店舗からユニットIDを取得
		//見つから無かったりした場合は0が返る
		_getUnitID: function(){
			if(this.$("#ca_storeID").autocomplete('clAutocompleteItem') == undefined
					|| this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null){
				clutil.showDialog("店舗を入力して下さい。");
				return 0;
			}
			// 店舗が固定ユーザの場合、親リストが存在しないのでclcomから無理矢理とる
			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				return clcom.userInfo.unit_id;
			}
			var parentList = this.$("#ca_storeID").autocomplete('clAutocompleteItem').parentList;
			var i = 0;
			for (i = 0; i < parentList.length; i++){
				if(parentList[i].orglevel_level == amcm_type.AMCM_VAL_ORG_LEVEL_UNIT){
					if(parentList[i].id != null){
						return parentList[i].id;
					}
					if(parentList[i].store_id != null){
						return parentList[i].store_id;
					}
				}
			}
			return 0;
		},
		_onGuestShow: function(guestList){
			var _this = this;
			//呼び出しもとで来ないように制限をかけているが念のため
			if( guestList.length <= 0){
				return;
			}
			var unitID = _this._getUnitID();
			var grpcd;
			if (unitID <= 0){
				grpcd = 0;
			}else{
				grpcd = ((unitID == clcom.getSysparam('PAR_AMMS_UNITID_AOKI'))?1:2);
			}
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
		/**
		 * キャンセルボタン押下(新規のときのみ)
		 * 入力項目クリア
		 */
		_doNewCancel: function(e){
			this.mdBaseView.$el.scrollTo(0);
			// 活性化する
			this.setReadOnlyAllItems(false);
			this.doSrchBrand();
			this._clearAllForm(_changeTypeArgs.NEXTITEM);
			//青文字は消す
			this.mdBaseView.hideRibbon();
			this.mdBaseView.clear({setSubmitEnable: true});
			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.setFocus($('#ca_userID'));
			}else{
				clutil.setFocus($('#ca_storeID'));
			}
			this.validator.clear();
		},

//		Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			var _this = this;
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				//ダイアログを表示する。defaultの動作とタイミングがずれるが、…
				if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
					//新規なので画面に表示・ダイアログ表示
					this.$("#ca_no").val(data.AMPOV0240UpdRsp.newNo);
//					clutil.showDialog("管理番号 [" + data.AMPOV0240UpdRsp.newNo + "] で登録しました。", function(){
//					console.log('OK', arguments);
//					_this._doNewCancel();
//					});
					clutil.ConfirmDialog("管理番号 [" + data.AMPOV0240UpdRsp.newNo + "] で登録しました。</br>連続登録しますか？", function(_this){
						try{
							console.log('OK', arguments);
							_this._doNewCancel();
						}finally{
						}
					}, function(_this){
						console.log('CANCEL', arguments);
						try{
							return;;
						}finally{
						}
					}, _this);
					$('.cl_cancel').html("いいえ");
				}else if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					//削除
					clutil.MessageDialog2(clmsg.cl_rtype_del_confirm);
				}else{
					//それ以外(たぶん更新のみ)
					clutil.MessageDialog2(clmsg.cl_rtype_upd_confirm);
					this.options.chkData[args.index].poOrderID = data.AMPOV0240GetRsp.order.poOrderID;
					this.options.chkData[args.index].updated_f = 1;

				}
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
			}
		},

//		GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			this.setReadOnlyAllItems(false);
			switch(args.status){
			case 'OK':
				this.getData2View(data);

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					this.setReadOnlyAllItems(true);
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					this.setReadOnlyAllItems(true);
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:		// 複製
					//過去分フラグが立っていた場合、入力コンポーネントを表示
					clutil.viewReadonly(this.$("#ca_orderDate_div"));
//					if(data.AMPOV0240GetRsp.order.pastFlag > 0){
////						clutil.viewReadonly(this.$("#ca_orderDate_div"));
//						this.$("#ca_InsOldDateInput_div_div").show();
//						this.$("#ca_InsOldDateInput").addClass("cl_required");
//						clutil.datepicker(this.$("#ca_InsOldDateInput")).datepicker('setIymd', data.AMPOV0240GetRsp.order.orderDate );
//					}
					clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', clcom.getOpeDate());
					clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', data.AMPOV0240GetRsp.arrivalDateList[0].arrivalDate );
					clutil.datepicker(this.$("#ca_saleDate")).datepicker('setIymd', clutil.addDate(data.AMPOV0240GetRsp.arrivalDateList[0].arrivalDate, 1));
					//コピーの場合、変更なしデータの登録に関しては警告を出すので比較用にデータを保持しておく
					_copy_rec = data;
					_copy_rec.AMPOV0240GetRsp.order.orderDate = clcom.getOpeDate();
					_copy_rec.AMPOV0240GetRsp.order.arrivalDate = data.AMPOV0240GetRsp.arrivalDateList[0].arrivalDate;
					_copy_rec.AMPOV0240GetRsp.order.saleDate = clutil.addDate(data.AMPOV0240GetRsp.arrivalDateList[0].arrivalDate, 1);
					//複製なので新規登録とする
					this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
					clutil.setFocus($('#ca_storeID'));
					break;
				default:

					//一覧から来た場合、過去商品発注日関係は動かせなくする。
					//チェックボックスは使用禁止
//					if(data.AMPOV0240GetRsp.order.pastFlag > 0){
						clutil.viewReadonly(this.$("#ca_orderDate_div"));
//					}
					this.$("#ca_InsOldDate").attr("disabled", true);
					$(this.$("#ca_InsOldDate").closest('label')).addClass("disabled");
					$("#ca_InsOldDateInput").removeClass("cl_required");
					$("#ca_InsOldDateInput_div_div").hide();

					//新規はここには来ないはず
					clutil.viewReadonly($("#ca_storeID_div"));
				clutil.viewReadonly($("#ca_brandID_div"));
				$("#ca_brandID_autofill").hide();
				clutil.setFocus($('#ca_userID'));
				this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
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
		getData2View : function(data){
			this.resUnitID = data.AMPOV0240GetRsp.unitID;
			//コンボボックスの中身取得
			var brandRecs		= data.AMPOV0240GetRsp.brandList;
			var clothIDListRecs	= data.AMPOV0240GetRsp.clothIDList;
			var optionListRecs	= data.AMPOV0240GetRsp.optionList;
			//ブランド
			if(_.isEmpty(brandRecs)){
				$("#ca_brandID_autofill").hide();
			}else{
				var brandList = [];
				$.each(brandRecs, function() {
					var cn = {
							id: this.id,
							code: this.code,
							name: this.name
					};
					brandList.push(cn);
				});
				// 内容物がある場合 --> ブランド選択にセットする。
				var opt = {
						$select	:this.$("#ca_brandID"),
						list:brandList,
						unselectedflag:true,
						selectpicker: {
							noButton: true
						}
				};
				destroySelectpicker(opt.$select);
				clutil.cltypeselector3(opt);
				this.selector3Opts['brandID'] = opt;
				$("#ca_brandID_autofill").show();
			}
			//生地
			if(_.isEmpty(clothIDListRecs)){
				$("#ca_clothNo_autofill").hide();
			}else{
				// 内容物がある場合
				var clothIDlist = [];
				$.each(clothIDListRecs, function() {
					var cn = {
							id: this.id,
							code: this.code,
							name: this.name
					};
					clothIDlist.push(cn);
				});
				// 内容物がある場合 --> 生地選択にセットする。
				var opt = {
						$select	:this.$("#ca_clothIDID"),
						list:clothIDlist,
						unselectedflag:true,
						selectpicker: {
							noButton: true
						}
				};
				destroySelectpicker(opt.$select);
				clutil.cltypeselector3(opt);
				this.selector3Opts['clothIDID'] = opt;
				$("#ca_clothNo_autofill").show();
			}
			//オプション
			if(_.isEmpty(optionListRecs) ){
				;
			}else{
				this.showOptions(optionListRecs);
			}

			//データ表示
			data.AMPOV0240GetRsp.order.userID={
					id: data.AMPOV0240GetRsp.order.userID,
					code: data.AMPOV0240GetRsp.order.userCode,
					name:null
			};
			var order = data.AMPOV0240GetRsp.order;
			order.jacket = data.AMPOV0240GetRsp.model.jacket.modelID;
			order.skirt = data.AMPOV0240GetRsp.model.skirt.modelID;
			order.pants = data.AMPOV0240GetRsp.model.pants.modelID;
			order.vest = data.AMPOV0240GetRsp.model.vest.modelID;
			order.clothIDID = data.AMPOV0240GetRsp.order.clothIDID;

			clutil.data2view(this.$('#ca_base_form'), order);
			//店舗オートコンプリートに情報表示
			this.utl_store.setValue({
				id: order.storeID,
				code: order.storeCode,
				name: order.storeName});


			clutil.data2view(this.$('#ca_guest_form'), data.AMPOV0240GetRsp.order);
			this.setBrandChildCombo();
			clutil.data2view(this.$('#ca_base_form'), order);
			this.utl_store.setValue({
				id: order.storeID,
				code: order.storeCode,
				name: order.storeName});
			if(order.pastFlag > 0){
				this.$("#ca_InsOldDate").closest("label").addClass("checked");
				this.$("#ca_InsOldDate").attr("checked", "checked");
			}
			this._ModelChange({
				init:true,
				data:order,
			});

			data.AMPOV0240GetRsp.jacket.jkStyle	= data.AMPOV0240GetRsp.jacket.styleID;
			data.AMPOV0240GetRsp.jacket.jkSize	= data.AMPOV0240GetRsp.jacket.sizeID;
			data.AMPOV0240GetRsp.skirt.skStyle	= data.AMPOV0240GetRsp.skirt.styleID;
			data.AMPOV0240GetRsp.skirt.skSize	= data.AMPOV0240GetRsp.skirt.sizeID;
			data.AMPOV0240GetRsp.pants.paStyle	= data.AMPOV0240GetRsp.pants.styleID;
			data.AMPOV0240GetRsp.pants.paSize	= data.AMPOV0240GetRsp.pants.sizeID;
			data.AMPOV0240GetRsp.pants.paLBtmAdjLen	= data.AMPOV0240GetRsp.pants.paLWidthAdjLen;
			data.AMPOV0240GetRsp.pants.paLBtmAdjTypeID	= data.AMPOV0240GetRsp.pants.paLWidthAdjTypeID;
			data.AMPOV0240GetRsp.pants.paRBtmAdjLen	= data.AMPOV0240GetRsp.pants.paRWidthAdjLen;
			data.AMPOV0240GetRsp.pants.paRBtmAdjTypeID	= data.AMPOV0240GetRsp.pants.paRWidthAdjTypeID;
			data.AMPOV0240GetRsp.vest.veStyle	= data.AMPOV0240GetRsp.vest.styleID;
			data.AMPOV0240GetRsp.vest.veSize	= data.AMPOV0240GetRsp.vest.sizeID;
			data.AMPOV0240GetRsp.vest.veOptAmfStitch	= data.AMPOV0240GetRsp.vest.veAmfStitch;

			//スタイルが入っていないとサイズのコンボボックスが効かないので2回data2viewを行う
			if(data.AMPOV0240GetRsp.jacket.jkStyle > 0){
				clutil.data2view(this.$('#ca_jacket_form'), data.AMPOV0240GetRsp.jacket);
				this._styleChangJK({
					init:true,
					data:data.AMPOV0240GetRsp.jacket
				});
				//clutil.data2view(this.$('#ca_jacket_form'), data.AMPOV0240GetRsp.jacket);
				clutil.viewRemoveReadonly(this.$("#ca_jacket_form"));

				$("#ca_jkStyle").addClass("cl_required");
				$("#ca_jkSize").addClass("cl_required");
			}else{
				clutil.viewReadonly(this.$("#ca_jacket_form"));
				$("#ca_jkStyle_autofill").hide();
				$("#ca_jkSize_autofill").hide();
				$("#ca_jkStyle").removeClass("cl_required");
				$("#ca_jkSize").removeClass("cl_required");
				this._clearJacketForm(_changeTypeArgs.BRAND);
				clutil.initUIelement(this.$el);
			}
			if(data.AMPOV0240GetRsp.skirt.skStyle > 0){
				clutil.data2view(this.$('#ca_skirt_form'), data.AMPOV0240GetRsp.skirt);
				this._styleChangSK({
					init:true,
					data:data.AMPOV0240GetRsp.skirt
				});
				//clutil.data2view(this.$('#ca_skirt_form'), data.AMPOV0240GetRsp.skirt);
				clutil.viewRemoveReadonly(this.$("#ca_skirt_form"));

				$("#ca_skStyle").addClass("cl_required");
				$("#ca_skSize").addClass("cl_required");
			}else{
				clutil.viewReadonly(this.$("#ca_skirt_form"));
				$("#ca_skStyle_autofill").hide();
				$("#ca_skSize_autofill").hide();
				$("#ca_skStyle").removeClass("cl_required");
				$("#ca_skSize").removeClass("cl_required");
				this._clearSkirtForm(_changeTypeArgs.BRAND);
				clutil.initUIelement(this.$el);
			}
			if(data.AMPOV0240GetRsp.pants.paStyle > 0){
				clutil.data2view(this.$('#ca_pants_form'), data.AMPOV0240GetRsp.pants);
				this._styleChangPA({
					init:true,
					data:data.AMPOV0240GetRsp.pants
				});
				//clutil.data2view(this.$('#ca_pants_form'), data.AMPOV0240GetRsp.pants);
				clutil.viewRemoveReadonly(this.$("#ca_pants_form"));

				$("#ca_paStyle").addClass("cl_required");
				$("#ca_paSize").addClass("cl_required");
			}else{
				clutil.viewReadonly(this.$("#ca_pants_form"));
				$("#ca_paStyle_autofill").hide();
				$("#ca_paSize_autofill").hide();
				$("#ca_paStyle").removeClass("cl_required");
				$("#ca_paSize").removeClass("cl_required");
				this._clearPantsForm(_changeTypeArgs.BRAND);
				clutil.initUIelement(this.$el);
			}
			if(data.AMPOV0240GetRsp.vest.veStyle > 0){
				clutil.data2view(this.$('#ca_vest_form'), data.AMPOV0240GetRsp.vest);
				this._styleChangVE({
					init:true,
					data:data.AMPOV0240GetRsp.vest
				});
				//clutil.data2view(this.$('#ca_vest_form'), data.AMPOV0240GetRsp.vest);
				clutil.viewRemoveReadonly(this.$("#ca_vest_form"));

				$("#ca_veStyle").addClass("cl_required");
				$("#ca_veSize").addClass("cl_required");
			}else{
				clutil.viewReadonly(this.$("#ca_vest_form"));
				$("#ca_veStyle_autofill").hide();
				$("#ca_veSize_autofill").hide();
				$("#ca_veStyle").removeClass("cl_required");
				$("#ca_veSize").removeClass("cl_required");
				this._clearVestForm(_changeTypeArgs.BRAND);
				clutil.initUIelement(this.$el);
			}
			clutil.data2view(this.$('#ca_other_form'),	data.AMPOV0240GetRsp.other);
			//入力制限修正
			clutil.cltxtFieldLimitReset($("#ca_userID"));
			clutil.cltxtFieldLimitReset($("#ca_custName"));
			clutil.cltxtFieldLimitReset($("#ca_custNameKana"));
			clutil.cltxtFieldLimitReset($("#ca_membNo"));
			clutil.cltxtFieldLimitReset($("#ca_jkName"));
			clutil.cltxtFieldLimitReset($("#ca_otRcptNo"));
			clutil.cltxtFieldLimitReset($("#ca_otStoreMemo"));
			if (this.resUnitID == clcom.getSysparam('PAR_AMMS_UNITID_ORI')){
				this.$("#ca_vest_div_div").hide();
				this.$("#ca_vest_form").hide();
			}
			clutil.initUIelement(this.$el);
		},
		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			var _this = this;
			this.validator.clear();

			//予約取消はないので基本全部こちらに来る
			// validation
			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				break;
			default:
				break;
			}
			var f_error0 = !this.validator.valid();
			var f_error = false;
			var f_error_model = false;

			var order =		 clutil.view2data(this.$('#ca_base_form'));
//			var model_org =	 clutil.view2data(this.$('#ca_model_form'));
			var model_org =	 clutil.view2data(this.$('#ca_base_form'));
			var guest =		 clutil.view2data(this.$('#ca_guest_form'));
			var jacket	=	 clutil.view2data(this.$('#ca_jacket_form'));
			var skirt	=	 clutil.view2data(this.$('#ca_skirt_form'));
			var pants	=	 clutil.view2data(this.$('#ca_pants_form'));
			var vest	=	 clutil.view2data(this.$('#ca_vest_form'));
			var other	=	 clutil.view2data(this.$('#ca_other_form'));

			order.poTypeID = amcm_type.AMCM_VAL_PO_CLASS_LADYS;
			//
			if (order._view2data_storeID_cn != null){
				order.storeID = order._view2data_storeID_cn.id;
				order.storeCode = order._view2data_storeID_cn.code;
				order.storeName = order._view2data_storeID_cn.name;
			}
			order.telNo1 = guest.telNo1;
			order.telNo2 = guest.telNo2;
			order.telNo3 = guest.telNo3;
			order.custName = guest.custName;
			order.custNameKana = guest.custNameKana;
			order.membNo = guest.membNo;
			var $oldCheck = this.$("#ca_InsOldDate");
			var isOldChecked = $oldCheck.attr("checked");
			if (isOldChecked) {
				//過去オン
				order.pastFlag		= 1;
			} else {
				//過去off
				order.pastFlag		= 0;
			}
			if(order.brandID!= null){
				order.brandCode = this.selectorVal2Item('brandID', order.brandID).code;
			}
			order.clothIDID = model_org.clothIDID;

			jacket.styleID	= jacket.jkStyle;
			jacket.sizeID	= jacket.jkSize;
			skirt.styleID	= skirt.skStyle;
			skirt.sizeID	= skirt.skSize;
			pants.styleID	= pants.paStyle;
			pants.sizeID	= pants.paSize;
			pants.paLWidthAdjLen	= pants.paLBtmAdjLen;
			pants.paLWidthAdjTypeID	= pants.paLBtmAdjTypeID;
			pants.paRWidthAdjLen	= pants.paRBtmAdjLen;
			pants.paRWidthAdjTypeID	= pants.paRBtmAdjTypeID;
			vest.styleID	= vest.veStyle;
			vest.sizeID		= vest.veSize;
			vest.veAmfStitch		= vest.veOptAmfStitch;
			var model = {
					jacket:	{modelID: model_org.jacket},
					skirt:	{modelID: model_org.skirt},
					pants:	{modelID: model_org.pants},
					vest:	{modelID: model_org.vest},
			};

			//画面個別のエラーチェック
			//日付
			if (order.pastFlag != 0 && order.orderDate >= clcom.getOpeDate()){
				// 過去日入力可の状況で今日以降が入れられた場合
				f_error = true;
				this.validator.setErrorMsg( this.$("#ca_InsOldDateInput"), clmsg.EGM0035);
			}
			if(order.arrivalDate > 0 && order.orderDate > 0){
				if(order.arrivalDate <= order.orderDate){
					//基本的にorderDateからarrivalDateが固定で決まるのでここに来ることはありえない
					//来た場合カレンダの設定がおかしいはず。
					f_error = true;
					this.validator.setErrorMsg(this.$("#ca_orderDate"), clmsg.EPO0046);
				}else if (order.pastFlag == 0 && order.orderDate < clcom.getOpeDate()){
					// 過去日入力不可の状況で過去日が入れられた場合
					f_error = true;
					this.validator.setErrorMsg( this.$("#ca_orderDate"), clmsg.EPO0062);
				}
			}
			if(order.saleDate > 0 && order.arrivalDate > 0){
				if(order.saleDate <= order.arrivalDate){
					this.validator.setErrorMsg( this.$("#ca_saleDate"), clmsg.EPO0047);
					f_error = true;
				}else if (order.pastFlag == 0 && order.saleDate < clcom.getOpeDate()){
					// 過去日入力不可の状況で過去日が入れられた場合
					f_error = true;
					this.validator.setErrorMsg( this.$("#ca_saleDate"), clmsg.EPO0062);
				}
			}
			if(model.jacket.modelID > 0){
				//ジャケット入力項目チェック
				if(jacket.jkLSleeveAdjLen > 7.0){
					this.validator.setErrorMsg( this.$("#ca_jkLSleeveAdjLen"), clmsg.EGM0021);
					f_error = true;
				}
				if(jacket.jkRSleeveAdjLen > 7.0){
					this.validator.setErrorMsg( this.$("#ca_jkRSleeveAdjLen"), clmsg.EGM0021);
					f_error = true;
				}
				if(jacket.jkAdjLen > 5.0){
					this.validator.setErrorMsg( this.$("#ca_jkAdjLen"), clmsg.EGM0021);
					f_error = true;
				}
				//各種数値だけ入れてタイプを指定しない場合はエラーとする
				if(jacket.jkLSleeveAdjLen > 0 && jacket.jkLSleeveAdjTypeID == 0){
					this.validator.setErrorMsg( this.$("#ca_jkLSleeveAdjTypeID"), clmsg.EGM0021);
					f_error = true;
				}
				if(jacket.jkRSleeveAdjLen > 0 && jacket.jkRSleeveAdjTypeID == 0){
					this.validator.setErrorMsg( this.$("#ca_jkRSleeveAdjTypeID"), clmsg.EGM0021);
					f_error = true;
				}
				if(jacket.jkAdjLen > 0 && jacket.jkAdjTypeID == 0){
					this.validator.setErrorMsg( this.$("#ca_jkAdjTypeID"), clmsg.EGM0021);
					f_error = true;
				}
			}
			if(model.skirt.modelID > 0){
				//スカート入力項目チェック
				if(skirt.skWaistAdjLen > 3.0){
					this.validator.setErrorMsg( this.$("#ca_skWaistAdjLen"), clmsg.EGM0021);
					f_error = true;
				}
				if(skirt.skAdjLen > 10.0){
					this.validator.setErrorMsg( this.$("#ca_skAdjLen"), clmsg.EGM0021);
					f_error = true;
				}
				//各種数値だけ入れてタイプを指定しない場合はエラーとする
				if(skirt.skWaistAdjLen > 0 && skirt.skWaistAdjTypeID == 0){
					this.validator.setErrorMsg( this.$("#ca_skWaistAdjTypeID"), clmsg.EGM0021);
					f_error = true;
				}
				if(skirt.skAdjLen > 0 && skirt.skAdjTypeID == 0){
					this.validator.setErrorMsg( this.$("#ca_skAdjTypeID"), clmsg.EGM0021);
					f_error = true;
				}
			}
			if(model.pants.modelID > 0){
				//パンツ入力項目チェック
				if(pants.paLLegLen > 98.0 || pants.paLLegLen < 60.0){
					this.validator.setErrorMsg( this.$("#ca_paLLegLen"), clmsg.EGM0021);
					f_error = true;
				}
				if(pants.paRLegLen > 98.0 || pants.paRLegLen <60.0){
					this.validator.setErrorMsg( this.$("#ca_paRLegLen"), clmsg.EGM0021);
					f_error = true;
				}
				if(pants.paLWidthAdjLen > 2.0){
					this.validator.setErrorMsg( this.$("#ca_paLBtmAdjLen"), clmsg.EGM0021);
					f_error = true;
				}
				if(pants.paRWidthAdjLen > 2.0){
					this.validator.setErrorMsg( this.$("#ca_paRBtmAdjLen"), clmsg.EGM0021);
					f_error = true;
				}
				if(pants.paWaistAdjLen > 3.0){
					this.validator.setErrorMsg( this.$("#ca_paWaistAdjLen"), clmsg.EGM0021);
					f_error = true;
				}
				//各種数値だけ入れてタイプを指定しない場合はエラーとする
				if(pants.paLWidthAdjLen > 0 && pants.paLWidthAdjTypeID == 0){
					this.validator.setErrorMsg( this.$("#ca_paLBtmAdjTypeID"), clmsg.EGM0021);
					f_error = true;
				}
				if(pants.paRWidthAdjLen > 0 && pants.paRWidthAdjTypeID == 0){
					this.validator.setErrorMsg( this.$("#ca_paRBtmAdjTypeID"), clmsg.EGM0021);
					f_error = true;
				}
				if(pants.paWaistAdjLen > 0 && pants.paWaistAdjTypeID == 0){
					this.validator.setErrorMsg( this.$("#ca_paWaistAdjTypeID"), clmsg.EGM0021);
					f_error = true;
				}
			}
			if(model.vest.modelID > 0){
				//ベスト入力項目チェック
				if(vest.veAdjLen > 3.0){
					this.validator.setErrorMsg( this.$("#ca_veAdjLen"), clmsg.EGM0021);
					f_error = true;
				}
				//各種数値だけ入れてタイプを指定しない場合はエラーとする
				if(vest.veAdjLen > 0 && vest.veAdjTypeID == 0){
					this.validator.setErrorMsg( this.$("#ca_veAdjTypeID"), clmsg.EGM0021);
					f_error = true;
				}
			}
			//店舗備考欄
			if(other.otStoreMemo != null &&  other.otStoreMemo != ""){
				var num = other.otStoreMemo.match(/\n/g);
				if (num != null){
					if( num.length  > 3){
						f_error = true;
						this.validator.setErrorMsg(this.$("#ca_otStoreMemo"), clmsg.EPO0068);
					}
				}
			}
			if(
					(model.jacket.modelID == 0 ||model_org.jacket == null)
					&& (model.skirt.modelID == 0 || model_org.skirt == null)
					&& (model.pants.modelID == 0 || model_org.pants == null)
					&& (model.vest.modelID == 0 || model_org.vest == null)
			){
				this.validator.setErrorMsg( this.$("#ca_jacket"), clmsg.EPO0061);
				this.validator.setErrorMsg( this.$("#ca_skirt"), clmsg.EPO0061);
				this.validator.setErrorMsg( this.$("#ca_pants"), clmsg.EPO0061);
				this.validator.setErrorMsg( this.$("#ca_vest"), clmsg.EPO0061);
				// modelに一顧も対象がない場合ヘッダにメッセージを出力
				if(f_error0 || f_error){
					//ヘッダを上書きしないように
					;
				}else{
					//他の入力エラーがないので
					f_error_model = true;
				}
			}

			try{
				this.mdBaseView.setAutoValidate(false);
				if(f_error0){
					// valid() -- NG
					clutil.setFocus(this.$el.find('.cl_error_field').first());
					return null;
				}
				if(f_error){
					clutil.mediator.trigger('onTicker',clmsg.cl_echoback);
					return null;
				}
				if(f_error_model){
					clutil.mediator.trigger('onTicker',clmsg.EPO0061);
					return null;
				}
			}finally{
				this.mdBaseView.setAutoValidate(true);
			}


//			listへhead情報の適応
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){

			}

			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			var updReq = {
					order	: order,
					model	: model,
					jacket	: ((model.jacket.modelID == 0 || model_org.jacket == null)? {}:jacket),
					skirt	: ((model.skirt.modelID == 0 || model_org.skirt == null)? {}:skirt),
					pants	: ((model.pants.modelID == 0 || model_org.pants == null)? {}:pants),
					vest	: ((model.vest.modelID == 0 || model_org.vest == null)? {}:vest),
					other	: other,
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}
			var reqObj = {
					reqHead : reqHead,
					AMPOV0240UpdReq  : updReq
			};

			console.log(reqObj);
			if(_copy_rec != null){
				//複製から呼ばれた場合、登録データと元データの比較を行う
				if(this._chk_copy_data(updReq)){
					return {
						resId : clcom.pageId,
						data: reqObj,
						confirm: clutil.getclmsg('WPO0069')
					};
				}else{
					//複製だけど変更有
					return {
						resId : clcom.pageId,
						data: reqObj
					};
				}
			}else{
				//複製以外
				return {
					resId : clcom.pageId,
					data: reqObj
				};
			}
		},
		//XXX
		_chk_copy_data: function(updReq){
			if(!this._chk_copy_order(updReq)){
				return false;
			}
			if(!this._chk_copy_model(updReq)){
				return false;
			}
			if(!this._chk_copy_jacket(updReq)){
				return false;
			}
			if(!this._chk_copy_skirt(updReq)){
				return false;
			}
			if(!this._chk_copy_pants(updReq)){
				return false;
			}
			if(!this._chk_copy_vest(updReq)){
				return false;
			}
			if(!this._chk_copy_other(updReq)){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_order: function(updReq){
			var org_data = _copy_rec.AMPOV0240GetRsp.order;
			var new_data = updReq.order;
			//店舗ID(必須)
			if(org_data.storeID != new_data.storeID){
				return false;
			}
			//ブランドID(必須)
			if(org_data.brandID != new_data.brandID){
				return false;
			}
			//生地番号(必須)
			if(org_data.clothIDID != new_data.clothIDID){
				return false;
			}
			//商品発注日(必須)
			if(org_data.orderDate != new_data.orderDate){
				return false;
			}
			//店舗着日(必須)
			if(org_data.arrivalDate != new_data.arrivalDate){
				return false;
			}
			//お渡し日(必須)
			if(org_data.saleDate != new_data.saleDate){
				return false;
			}
			//お渡電話番号1日(必須)
			if(org_data.telNo1 != new_data.telNo1){
				return false;
			}
			//電話番号2(必須)
			if(org_data.telNo2 != new_data.telNo2){
				return false;
			}
			//電話番号3(必須)
			if(org_data.telNo3 != new_data.telNo3){
				return false;
			}
			//氏名(必須)
			if(org_data.custName != new_data.custName){
				return false;
			}
			//フリガナ(必須)
			if(org_data.custNameKana != new_data.custNameKana){
				return false;
			}
			//担当者ID(必須)
			if(org_data.userID.id != new_data.userID){
				return false;
			}
			var old_rec;
			var new_rec;
			//会員番号
			old_rec = (org_data.membNo == null)? "": org_data.membNo;
			new_rec = (new_data.membNo == null)? "": new_data.membNo;
			if(old_rec != new_rec){
				return false;
			}

			//過去登録フラグ
			old_rec = (org_data.pastFlag == null)? 0: org_data.pastFlag;
			new_rec = (new_data.pastFlag == null)? 0: new_data.pastFlag;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_model: function(updReq){
			var org_data = _copy_rec.AMPOV0240GetRsp.model;
			var new_data = updReq.model;
			var old_rec;
			var new_rec;
			//ジャケット
			old_rec = (org_data.jacket == null || org_data.jacket.modelID == null)? 0: org_data.jacket.modelID;
			new_rec = (new_data.jacket == null || new_data.jacket.modelID == null)? 0: new_data.jacket.modelID;
			if(old_rec != new_rec){
				return false;
			}
			//スカート
			old_rec = (org_data.skirt == null || org_data.skirt.modelID == null)? 0: org_data.skirt.modelID;
			new_rec = (new_data.skirt == null || new_data.skirt.modelID == null)? 0: new_data.skirt.modelID;
			if(old_rec != new_rec){
				return false;
			}
			//パンツ
			old_rec = (org_data.pants == null || org_data.pants.modelID == null)? 0: org_data.pants.modelID;
			new_rec = (new_data.pants == null || new_data.pants.modelID == null)? 0: new_data.pants.modelID;
			if(old_rec != new_rec){
				return false;
			}
			//ベスト
			old_rec = (org_data.vest == null || org_data.vest.modelID == null)? 0: org_data.vest.modelID;
			new_rec = (new_data.vest == null || new_data.vest.modelID == null)? 0: new_data.vest.modelID;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_jacket: function(updReq){
			var org_data = _copy_rec.AMPOV0240GetRsp.jacket;
			var new_data = updReq.jacket;

			if(
					(org_data.styleID == 0) &&
					(new_data.styleID == null || new_data.styleID == 0)
			){
				//以前登録なし
				//今回も登録なし
				return true;
			}

			//スタイルID(必須)
			if(org_data.styleID != new_data.styleID){
				return false;
			}
			//sizeID(必須)
			if(org_data.sizeID != new_data.sizeID){
				return false;
			}
			var old_rec;
			var new_rec;
			//裏地
			old_rec = (org_data.jkLiningTypeID == null)? 0: org_data.jkLiningTypeID;
			new_rec = (new_data.jkLiningTypeID == null)? 0: new_data.jkLiningTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//胸ポケット
			old_rec = (org_data.jkChestPocketTypeID == null)? 0: org_data.jkChestPocketTypeID;
			new_rec = (new_data.jkChestPocketTypeID == null)? 0: new_data.jkChestPocketTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//ネーム種別
			old_rec = (org_data.jkNameTypeID == null)? 0: org_data.jkNameTypeID;
			new_rec = (new_data.jkNameTypeID == null)? 0: new_data.jkNameTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//ネーム
			old_rec = (org_data.jkName == null)? "": org_data.jkName;
			new_rec = (new_data.jkName == null)? "": new_data.jkName;
			if(old_rec != new_rec){
				return false;
			}
			//左袖丈補正長
			old_rec = (org_data.jkLSleeveAdjLen == null)? 0: org_data.jkLSleeveAdjLen;
			new_rec = (new_data.jkLSleeveAdjLen == null)? 0: new_data.jkLSleeveAdjLen;
			if(old_rec != new_rec){
				return false;
			}
			//左袖丈補正種別
			old_rec = (org_data.jkLSleeveAdjTypeID == null)? 0: org_data.jkLSleeveAdjTypeID;
			new_rec = (new_data.jkLSleeveAdjTypeID == null)? 0: new_data.jkLSleeveAdjTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//右袖丈補正長
			old_rec = (org_data.jkRSleeveAdjLen == null)? 0: org_data.jkRSleeveAdjLen;
			new_rec = (new_data.jkRSleeveAdjLen == null)? 0: new_data.jkRSleeveAdjLen;
			if(old_rec != new_rec){
				return false;
			}
			//右袖丈補正種別
			old_rec = (org_data.jkRSleeveAdjTypeID == null)? 0: org_data.jkRSleeveAdjTypeID;
			new_rec = (new_data.jkRSleeveAdjTypeID == null)? 0: new_data.jkRSleeveAdjTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//着丈補正長
			old_rec = (org_data.jkAdjLen == null)? 0: org_data.jkAdjLen;
			new_rec = (new_data.jkAdjLen == null)? 0: new_data.jkAdjLen;
			if(old_rec != new_rec){
				return false;
			}
			//着丈補正種別
			old_rec = (org_data.jkAdjTypeID == null)? 0: org_data.jkAdjTypeID;
			new_rec = (new_data.jkAdjTypeID == null)? 0: new_data.jkAdjTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//ボタン変更
			old_rec = (org_data.jkChangeButton == null)? 0: org_data.jkChangeButton;
			new_rec = (new_data.jkChangeButton == null)? 0: new_data.jkChangeButton;
			if(old_rec != new_rec){
				return false;
			}
			//裏地変更
			old_rec = (org_data.jkChangeLining == null)? 0: org_data.jkChangeLining;
			new_rec = (new_data.jkChangeLining == null)? 0: new_data.jkChangeLining;
			if(old_rec != new_rec){
				return false;
			}
			//AMFステッチ
			old_rec = (org_data.jkAmfStitch == null)? 0: org_data.jkAmfStitch;
			new_rec = (new_data.jkAmfStitch == null)? 0: new_data.jkAmfStitch;
			if(old_rec != new_rec){
				return false;
			}
			//センターベント
			old_rec = (org_data.jkVent == null)? 0: org_data.jkVent;
			new_rec = (new_data.jkVent == null)? 0: new_data.jkVent;
			if(old_rec != new_rec){
				return false;
			}
			//袖デザイン
			old_rec = (org_data.jkSleeveDesign == null)? 0: org_data.jkSleeveDesign;
			new_rec = (new_data.jkSleeveDesign == null)? 0: new_data.jkSleeveDesign;
			if(old_rec != new_rec){
				return false;
			}
			//内ポケット
			old_rec = (org_data.jkInsidePocket == null)? 0: org_data.jkInsidePocket;
			new_rec = (new_data.jkInsidePocket == null)? 0: new_data.jkInsidePocket;
			if(old_rec != new_rec){
				return false;
			}

			//全く同じ
			return true;
		},
		_chk_copy_skirt: function(updReq){
			org_data = _copy_rec.AMPOV0240GetRsp.skirt;
			new_data = updReq.skirt;
			if(
					(org_data.styleID == 0) &&
					(new_data.styleID == null || new_data.styleID == 0)
			){
				//以前登録なし
				//今回も登録なし
				return true;
			}
			//スタイルID(必須)
			if(org_data.styleID != new_data.styleID){
				return false;
			}
			//sizeID(必須)
			if(org_data.sizeID != new_data.sizeID){
				return false;
			}
			var old_rec;
			var new_rec;
			//スペア
			old_rec = (org_data.skSpareTypeID == null)? 0: org_data.skSpareTypeID;
			new_rec = (new_data.skSpareTypeID == null)? 0: new_data.skSpareTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//ウエスト補正長
			old_rec = (org_data.skWaistAdjLen == null)? 0: org_data.skWaistAdjLen;
			new_rec = (new_data.skWaistAdjLen == null)? 0: new_data.skWaistAdjLen;
			if(old_rec != new_rec){
				return false;
			}
			//ウエスト補正種別
			old_rec = (org_data.skWaistAdjTypeID == null)? 0: org_data.skWaistAdjTypeID;
			new_rec = (new_data.skWaistAdjTypeID == null)? 0: new_data.skWaistAdjTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//スカート丈補正長
			old_rec = (org_data.skAdjLen == null)? 0: org_data.skAdjLen;
			new_rec = (new_data.skAdjLen == null)? 0: new_data.skAdjLen;
			if(old_rec != new_rec){
				return false;
			}
			//スカート丈補正種別
			old_rec = (org_data.skAdjTypeID == null)? 0: org_data.skAdjTypeID;
			new_rec = (new_data.skAdjTypeID == null)? 0: new_data.skAdjTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_pants: function(updReq){
			org_data = _copy_rec.AMPOV0240GetRsp.pants;
			new_data = updReq.pants;
			if(
					(org_data.styleID == 0) &&
					(new_data.styleID == null || new_data.styleID == 0)
			){
				//以前登録なし
				//今回も登録なし
				return true;
			}
			//スタイルID(必須)
			if(org_data.styleID != new_data.styleID){
				return false;
			}
			//sizeID(必須)
			if(org_data.sizeID != new_data.sizeID){
				return false;
			}
			var old_rec;
			var new_rec;
			//スペア
			old_rec = (org_data.paSpareTypeID == null)? 0: org_data.paSpareTypeID;
			new_rec = (new_data.paSpareTypeID == null)? 0: new_data.paSpareTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//左股下長
			old_rec = (org_data.paLLegLen == null)? 0: org_data.paLLegLen;
			new_rec = (new_data.paLLegLen == null)? 0: new_data.paLLegLen;
			if(old_rec != new_rec){
				return false;
			}
			//右股下長
			old_rec = (org_data.paRLegLen == null)? 0: org_data.paRLegLen;
			new_rec = (new_data.paRLegLen == null)? 0: new_data.paRLegLen;
			if(old_rec != new_rec){
				return false;
			}
			//左裾幅補正長
			old_rec = (org_data.paLWidthAdjLen == null)? 0: org_data.paLWidthAdjLen;
			new_rec = (new_data.paLWidthAdjLen == null)? 0: new_data.paLWidthAdjLen;
			if(old_rec != new_rec){
				return false;
			}
			//左裾幅補正種別
			old_rec = (org_data.paLWidthAdjTypeID == null)? 0: org_data.paLWidthAdjTypeID;
			new_rec = (new_data.paLWidthAdjTypeID == null)? 0: new_data.paLWidthAdjTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//右裾幅補正長
			old_rec = (org_data.paRWidthAdjLen == null)? 0: org_data.paRWidthAdjLen;
			new_rec = (new_data.paRWidthAdjLen == null)? 0: new_data.paRWidthAdjLen;
			if(old_rec != new_rec){
				return false;
			}
			//右裾幅補正種別
			old_rec = (org_data.paRWidthAdjTypeID == null)? 0: org_data.paRWidthAdjTypeID;
			new_rec = (new_data.paRWidthAdjTypeID == null)? 0: new_data.paRWidthAdjTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//ウエスト補正長
			old_rec = (org_data.paWaistAdjLen == null)? 0: org_data.paWaistAdjLen;
			new_rec = (new_data.paWaistAdjLen == null)? 0: new_data.paWaistAdjLen;
			if(old_rec != new_rec){
				return false;
			}
			//ウエスト補正種別
			old_rec = (org_data.paWaistAdjTypeID == null)? 0: org_data.paWaistAdjTypeID;
			new_rec = (new_data.paWaistAdjTypeID == null)? 0: new_data.paWaistAdjTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_vest: function(updReq){
			org_data = _copy_rec.AMPOV0240GetRsp.vest;
			new_data = updReq.vest;
			if(
					(org_data.styleID == 0) &&
					(new_data.styleID == null || new_data.styleID == 0)
			){
				//以前登録なし
				//今回も登録なし
				return true;
			}
			//スタイルID(必須)
			if(org_data.styleID != new_data.styleID){
				return false;
			}
			//sizeID(必須)
			if(org_data.sizeID != new_data.sizeID){
				return false;
			}
			var old_rec;
			var new_rec;
			//胸ポケット
			old_rec = (org_data.veChestPocketTypeID == null)? 0: org_data.veChestPocketTypeID;
			new_rec = (new_data.veChestPocketTypeID == null)? 0: new_data.veChestPocketTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//着丈補正長
			old_rec = (org_data.veAdjLen == null)? 0: org_data.veAdjLen;
			new_rec = (new_data.veAdjLen == null)? 0: new_data.veAdjLen;
			if(old_rec != new_rec){
				return false;
			}
			//着丈補正種別
			old_rec = (org_data.veAdjTypeID == null)? 0: org_data.veAdjTypeID;
			new_rec = (new_data.veAdjTypeID == null)? 0: new_data.veAdjTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//ボタン変更
			old_rec = (org_data.veChangeButton == null)? 0: org_data.veChangeButton;
			new_rec = (new_data.veChangeButton == null)? 0: new_data.veChangeButton;
			if(old_rec != new_rec){
				return false;
			}
			//裏地変更
			old_rec = (org_data.veChangeLining == null)? 0: org_data.veChangeLining;
			new_rec = (new_data.veChangeLining == null)? 0: new_data.veChangeLining;
			if(old_rec != new_rec){
				return false;
			}
			//尾錠
			old_rec = (org_data.veBuckle == null)? 0: org_data.veBuckle;
			new_rec = (new_data.veBuckle == null)? 0: new_data.veBuckle;
			if(old_rec != new_rec){
				return false;
			}
			//AMFステッチ
			old_rec = (org_data.veAmfStitch == null)? 0: org_data.veAmfStitch;
			new_rec = (new_data.veAmfStitch == null)? 0: new_data.veAmfStitch;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_other: function(updReq){
			org_data = _copy_rec.AMPOV0240GetRsp.other;
			new_data = updReq.other;
			var old_rec;
			var new_rec;
			//店舗補正
			old_rec = (org_data.otStoreAdjTypeID == null)? 0: org_data.otStoreAdjTypeID;
			new_rec = (new_data.otStoreAdjTypeID == null)? 0: new_data.otStoreAdjTypeID;
			if(old_rec != new_rec){
				return false;
			}

			//レシート番号(必須)
			if(org_data.otRcptNo != new_data.otRcptNo){
				return false;
			}

			//店舗用備考欄
			old_rec = (org_data.otStoreMemo == null)? "": org_data.otStoreMemo;
			new_rec = (new_data.otStoreMemo == null)? "": new_data.otStoreMemo;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var getReq = {
					// 共通ヘッダ

					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					// 取引先マスタ検索リクエスト
					AMPOV0240GetReq: {
						reqType :1,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
						srchID: this.options.chkData[pgIndex].poOrderID,			// 取引先ID
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMPOV0240UpdReq: {
					}
			};

			if(opeTypeId ==  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				getReq.reqHead.opeTypeId =  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY;
			}
			_termChg_Flag = this.options.chkData[pgIndex].mode;
			return {
				resId: clcom.pageId,	//'AMMSV0320',
				data: getReq
			};
		},


		// モデルセレクター変更
		_JacketModelChange: function(args) {
			var $jacketModelID		= this.$("#ca_jacket");
			var $brandID		= this.$("#ca_brandID");

			destroySelectpicker(this.$('#ca_jkStyle'));
			clutil.clpobrandstyleselector({
				el:this.$("#ca_jkStyle"),
				dependAttrs :{
					poBrandID: 0,
					poParentBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					poModelID: function() {
						return ($jacketModelID.val()==null || $jacketModelID.val()==0)? -1:$jacketModelID.val();
					},
					styleoptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET,
					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
				},
				disableOnNoChoice: false,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			}).done(_.bind(function() {
				//編集可/不可設定
				this._changJK();
			}, this));
		},
		_SkirtModelChange: function(args) {
			var $skirtModelID		= this.$("#ca_skirt");
			var $brandID		= this.$("#ca_brandID");

			destroySelectpicker(this.$('#ca_skStyle'));
			clutil.clpobrandstyleselector({
				el:this.$("#ca_skStyle"),
				dependAttrs :{
					poBrandID: 0,
					poParentBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					poModelID: function() {
						return ($skirtModelID.val()==null || $skirtModelID.val()==0)? -1:$skirtModelID.val();
					},
					styleoptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT,
					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
				},
				disableOnNoChoice: false,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			}).done(_.bind(function() {
				//編集可/不可設定
				this._changSK();
			}, this));
		},
		_PantsModelChange: function(args) {
			var $pantsModelID		= this.$("#ca_pants");
			var $brandID		= this.$("#ca_brandID");

			destroySelectpicker(this.$('#ca_paStyle'));
			clutil.clpobrandstyleselector({
				el:this.$("#ca_paStyle"),
				dependAttrs :{
					poBrandID: 0,
					poParentBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					poModelID: function() {
						return ($pantsModelID.val()==null || $pantsModelID.val()==0)? -1:$pantsModelID.val();
					},
					styleoptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS,
					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
				},
				disableOnNoChoice: false,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			}).done(_.bind(function() {
				//編集可/不可設定
				this._changPA();
			},this));
		},
		_VestModelChange: function(args) {
			var $vestModelID		= this.$("#ca_vest");
			var $brandID		= this.$("#ca_brandID");

			destroySelectpicker(this.$('#ca_veStyle'));
			clutil.clpobrandstyleselector({
				el:this.$("#ca_veStyle"),
				dependAttrs :{
					poBrandID: 0,
					poParentBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					poModelID: function() {
						return ($vestModelID.val()==null || $vestModelID.val()==0)? -1:$vestModelID.val();
					},
					styleoptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST,
					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
				},
				disableOnNoChoice: false,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			}).done(_.bind(function() {
				//編集可/不可設定
				this._changVE();
			}, this));
		},

		// ブランド変更時に、スタイル欄を入れ替える
		_ModelChange: function(args) {

			var $brandID		= this.$("#ca_brandID");

			var $jacketModelID		= this.$("#ca_jacket");
			var $skirtModelID		= this.$("#ca_skirt");
			var $pantsModelID		= this.$("#ca_pants");
			var $vestModelID		= this.$("#ca_vest");

			var init = false;
			var data = null;
			var jkModelId = null;
			var skModelId = null;
			var ptModelId = null;
			var vestModelId = null;
			if (args != null) {
				if (args.init) {
					init = true;
				}
				if (args.data) {
					data = args.data;
				}
			}
			jkModelId = data != null ? data.jacket : (($jacketModelID.val()==null || $jacketModelID.val()==0)? -1:$jacketModelID.val());
			skModelId = data != null ? data.skirt : (($skirtModelID.val()==null || $skirtModelID.val()==0)? -1:$skirtModelID.val());
			ptModelId = data != null ? data.pants : (($pantsModelID.val()==null || $pantsModelID.val()==0)? -1:$pantsModelID.val());
			vestModelId = data != null ? data.vest : ($vestModelID.val()==null || $vestModelID.val()==0)? -1:$vestModelID.val();

			destroySelectpicker(this.$('#ca_jkStyle'));
			clutil.clpobrandstyleselector({
				el:this.$("#ca_jkStyle"),
//				dependAttrs :{
//					poBrandID: function() {
//						return ($jacketModelID.val()==null || $jacketModelID.val()==0)? -1:$jacketModelID.val();
//					},
//					styleoptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET,
//					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
//				},
				dependAttrs :{
					poBrandID: 0,
					poParentBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					poModelID: function() {
						return jkModelId;
					},
					styleoptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET,
					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
				},
				disableOnNoChoice: false,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			});
			destroySelectpicker(this.$('#ca_skStyle'));
			clutil.clpobrandstyleselector({
				el:this.$("#ca_skStyle"),
//				dependAttrs :{
//					poBrandID: function() {
//						return ($skirtModelID.val()==null || $skirtModelID.val()==0)? -1:$skirtModelID.val();
//					},
//					styleoptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT,
//					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
//				},
				dependAttrs :{
					poBrandID: 0,
					poParentBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					poModelID: function() {
						return skModelId;
					},
					styleoptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT,
					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
				},
				disableOnNoChoice: false,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			});
			destroySelectpicker(this.$('#ca_paStyle'));
			clutil.clpobrandstyleselector({
				el:this.$("#ca_paStyle"),
//				dependAttrs :{
//					poBrandID: function() {
//						return ($pantsModelID.val()==null || $pantsModelID.val()==0)? -1:$pantsModelID.val();
//					},
//					styleoptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS,
//					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
//				},
				dependAttrs :{
					poBrandID: 0,
					poParentBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					poModelID: function() {
						return ptModelId;
					},
					styleoptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS,
					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
				},
				disableOnNoChoice: false,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			});
			destroySelectpicker(this.$('#ca_veStyle'));
			clutil.clpobrandstyleselector({
				el:this.$("#ca_veStyle"),
//				dependAttrs :{
//					poBrandID: function() {
//						return ($vestModelID.val()==null || $vestModelID.val()==0)? -1:$vestModelID.val();
//					},
//					styleoptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST,
//					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
//				},
				dependAttrs :{
					poBrandID: 0,
					poParentBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					poModelID: function() {
						return vestModelId;
					},
					styleoptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST,
					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
				},
				disableOnNoChoice: false,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			});
		},
		_styleChangJK: function(args){
			var _this = this;
			//var $brandID		= this.$("#ca_brandID");
			var $styleID		= this.$("#ca_jkStyle");
			var init = false;
			var jacket = null;
			var style_id = null;
			if((args != undefined) && (args.init != null) && args.init){
				this.jacketReadOnly(false);
				init = true;
			}else{
				if($styleID.val() == null  || $styleID.val() <= 0){
					this.jacketReadOnly(true);
					clutil.viewRemoveReadonly(this.$("#ca_jkStyle_div"));
					$("#ca_jkStyle_autofill").show();
					return;
				}else{
					this.jacketReadOnly(false);
				}
			}
			if (args != null && args.data != null) {
				jacket = args.data;
				style_id = jacket.styleID;
			}
			destroySelectpicker(this.$('#ca_jkSize'));
			clutil.clposizeselector({
				el:this.$("#ca_jkSize"),
				dependAttrs :{
					poBrandID: function() {
						//return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
						return 0;
					},
					poBrandStyleID: function() {
						return style_id == null ? (($styleID.val()==null || $styleID.val()==0)? -1:$styleID.val()) : style_id;
					},
					ladysStyleOptClassTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET
				},
				nameOnly:true,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			}).done(_.bind(function(){
				//空白行があるので1以下
				if(_this.$("#ca_jkSize").find("option").length <= 1){
					$("#ca_jkSize_autofill").hide();
				}else{
					$("#ca_jkSize_autofill").show();
				}
				if (init && jacket) {
					clutil.data2view(this.$('#ca_jacket_form'), jacket);
				}
			},this));
			// オプション取得
			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0240GetReq :{
						reqType: 6,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
						styleOptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET,
						storeID: this.$("#ca_storeID").autocomplete('clAutocompleteItem').id,
						styleID: style_id == null ? (($styleID.val()==null || $styleID.val()==0)? -1:$styleID.val()) : style_id,
						orderDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
					}
			};
			clutil.postJSON('AMPOV0240', srchReq).done(_.bind(function(data){
				var optionListRecs = data.AMPOV0240GetRsp.optionList;
				if(_.isEmpty(optionListRecs) ){
					;
				}else{
					this.showOptionsJK(optionListRecs);
					if (!init && $styleID.val() > 0) {
						this.jacketReadOnly(false);
					}
					if (init && jacket) {
						clutil.data2view(this.$('#ca_jacket_form'), jacket);
					}
				}
			}, this));

			return;
		},
		_styleChangSK: function(args){
			var _this = this;
			//var $brandID		= this.$("#ca_brandID");
			var $styleID		= this.$("#ca_skStyle");
			var init = false;
			var data = null;
			var style_id = null;
			if((args != undefined) && (args.init != null) && args.init){
				this.skirtReadOnly(false);
				init = true;
			}else{
				if($styleID.val() == null  || $styleID.val() <= 0){
					this.skirtReadOnly(true);
					clutil.viewRemoveReadonly(this.$("#ca_skStyle_div"));
					$("#ca_skStyle_autofill").show();
					return;
				}else{
					this.skirtReadOnly(false);
				}
			}
			if (args != null && args.data != null) {
				data = args.data;
				style_id = data.styleID;
			}
			destroySelectpicker(this.$('#ca_skSize'));
			clutil.clposizeselector({
				el:this.$("#ca_skSize"),
				dependAttrs :{
					poBrandID: function() {
						//return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
						return 0;	// レディスの場合は、ブランドは0とする
					},
					poBrandStyleID: function() {
						return style_id == null ? (($styleID.val()==null || $styleID.val()==0)? -1:$styleID.val()) : style_id;
					},
					ladysStyleOptClassTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT
				},
				nameOnly:true,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			}).done(_.bind(function(){
				//空白行があるので1以下
				if(_this.$("#ca_skSize").find("option").length <= 1){
					$("#ca_skSize_autofill").hide();
				}else{
					$("#ca_skSize_autofill").show();
				}
				if (init && data) {
					clutil.data2view(this.$('#ca_skirt_form'), data);
				}
			},this));
			return;
		},
		_styleChangPA: function(args){
			var _this = this;
			//var $brandID		= this.$("#ca_brandID");
			var $styleID		= this.$("#ca_paStyle");
			var init = false;
			var data = null;
			var style_id = null;
			if((args != undefined) && (args.init != null) && args.init){
				this.pantsReadOnly(false);
				init = true;
			}else{
				if($styleID.val() == null  || $styleID.val() <= 0){
					this.pantsReadOnly(true);
					clutil.viewRemoveReadonly(this.$("#ca_paStyle_div"));
					$("#ca_paStyle_autofill").show();
					return;
				}else{
					this.pantsReadOnly(false);
				}
			}
			if (args != null && args.data != null) {
				data = args.data;
				style_id = data.styleID;
			}
			destroySelectpicker(this.$('#ca_paSize'));
			clutil.clposizeselector({
				el:this.$("#ca_paSize"),
				dependAttrs :{
					poBrandID: function() {
						//return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
						return 0;
					},
					poBrandStyleID: function() {
						return style_id == null ? (($styleID.val()==null || $styleID.val()==0)? -1:$styleID.val()) : style_id;
					},
					ladysStyleOptClassTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS
				},
				nameOnly:true,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			}).done(_.bind(function(){
				//空白行があるので1以下
				if(_this.$("#ca_paSize").find("option").length <= 1){
					$("#ca_paSize_autofill").hide();
				}else{
					$("#ca_paSize_autofill").show();
				}
				if (init && data) {
					clutil.data2view(this.$('#ca_pants_form'), data);
				}
			},this));
			return;
		},

		_styleChangVE: function(args){
			var _this = this;
			//var $brandID		= this.$("#ca_brandID");
			var $styleID		= this.$("#ca_veStyle");
			var init = false;
			var vest = null;
			var style_id = null;
			if((args != undefined) && (args.init != null) && args.init){
				this.vestReadOnly(false);
				init = true;
			}else{
				if($styleID.val() == null  || $styleID.val() <= 0){
					this.vestReadOnly(true);
					clutil.viewRemoveReadonly(this.$("#ca_veStyle_div"));
					$("#ca_veStyle_autofill").show();
					return;
				}else{
					this.vestReadOnly(false);
				}
			}
			if (args != null && args.data != null) {
				vest = args.data;
				style_id = vest.styleID;
			}
			destroySelectpicker(this.$('#ca_veSize'));
			clutil.clposizeselector({
				el:this.$("#ca_veSize"),
				dependAttrs :{
					poBrandID: function() {
						//return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
						return 0;
					},
					poBrandStyleID: function() {
						return style_id == null ? (($styleID.val()==null || $styleID.val()==0)? -1:$styleID.val()) : style_id;
					},
					ladysStyleOptClassTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST
				},
				nameOnly:true,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}

			}).done(_.bind(function(){
				//空白行があるので1以下
				if(_this.$("#ca_veSize").find("option").length <= 1){
					$("#ca_veSize_autofill").hide();
				}else{
					$("#ca_veSize_autofill").show();
				}
				if (init && vest) {
					clutil.data2view(this.$('#ca_vest_form'), vest);
				}
			},this));
			// オプション取得
			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0240GetReq :{
						reqType: 6,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
						styleOptTypeID: amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST,
						storeID: this.$("#ca_storeID").autocomplete('clAutocompleteItem').id,
						styleID: style_id == null ? (($styleID.val()==null || $styleID.val()==0)? -1:$styleID.val()) : style_id,
						orderDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
					}
			};
			clutil.postJSON('AMPOV0240', srchReq).done(_.bind(function(data){
				var optionListRecs = data.AMPOV0240GetRsp.optionList;
				if(_.isEmpty(optionListRecs) ){
					;
				}else{
					this.showOptionsVE(optionListRecs);
					if (!init && $styleID.val() > 0) {
						this.vestReadOnly(false);
					}
					if (init && vest) {
						clutil.data2view(this.$('#ca_vest_form'), vest);
					}
				}
			}, this));

			return;
		},
		//TODO
		modelReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearModelForm(_changeTypeArgs.ALL);
//				clutil.viewReadonly(this.$("#ca_model_form"));
				clutil.viewReadonly(this.$("#ca_jacket_div"));
				clutil.viewReadonly(this.$("#ca_skirt_div"));
				clutil.viewReadonly(this.$("#ca_pants_div"));
				clutil.viewReadonly(this.$("#ca_vest_div"));
				clutil.viewReadonly(this.$("#ca_clothIDID_div"));
				$("#ca_clothNo_autofill").hide();
			}else{
				//ロック解除
//				clutil.viewRemoveReadonly(this.$("#ca_model_form"));
				clutil.viewRemoveReadonly(this.$("#ca_jacket_div"));
				clutil.viewRemoveReadonly(this.$("#ca_skirt_div"));
				clutil.viewRemoveReadonly(this.$("#ca_pants_div"));
				clutil.viewRemoveReadonly(this.$("#ca_vest_div"));
				clutil.viewRemoveReadonly(this.$("#ca_clothIDID_div"));
			}
		},
		jacketReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearJacketForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_jacket_form"));
				$("#ca_jkStyle").removeClass("cl_required");
				$("#ca_jkSize").removeClass("cl_required");
				$("#ca_jkStyle_autofill").hide();
				$("#ca_jkSize_autofill").hide();
			}else{
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_jacket_form"));
				$("#ca_jkStyle").addClass("cl_required");
				$("#ca_jkSize").addClass("cl_required");
			}
			if(this.selectorVal2ItemLength('jkChangeButton') == 0){
				clutil.viewReadonly(this.$("#ca_jkChangeButton_div"));
			}
			if(this.selectorVal2ItemLength('jkChangeLining') == 0){
				clutil.viewReadonly(this.$("#ca_jkChangeLining_div"));
			}
			if(this.selectorVal2ItemLength('jkAmfStitch') == 0){
				clutil.viewReadonly(this.$("#ca_jkAmfStitch_div"));
			}
			if(this.selectorVal2ItemLength('jkVent') == 0){
				clutil.viewReadonly(this.$("#ca_jkVent_div"));
			}
			if(this.selectorVal2ItemLength('jkSleeveDesign') == 0){
				clutil.viewReadonly(this.$("#ca_jkSleeveDesign_div"));
			}
			if(this.selectorVal2ItemLength('jkInsidePocket') == 0){
				clutil.viewReadonly(this.$("#ca_jkInsidePocket_div"));
			}
		},
		skirtReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearSkirtForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_skirt_form"));
				$("#ca_skStyle").removeClass("cl_required");
				$("#ca_skSize").removeClass("cl_required");
				$("#ca_skStyle_autofill").hide();
				$("#ca_skSize_autofill").hide();
			}else{
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_skirt_form"));
				$("#ca_skStyle").addClass("cl_required");
				$("#ca_skSize").addClass("cl_required");
			}
		},
		pantsReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearPantsForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_pants_form"));
				$("#ca_paStyle").removeClass("cl_required");
				$("#ca_paSize").removeClass("cl_required");
				$("#ca_paStyle_autofill").hide();
				$("#ca_paSize_autofill").hide();
			}else{
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_pants_form"));
				$("#ca_paStyle").addClass("cl_required");
				$("#ca_paSize").addClass("cl_required");
			}
		},
		vestReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearVestForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_vest_form"));
				$("#ca_veStyle").removeClass("cl_required");
				$("#ca_veSize").removeClass("cl_required");
				$("#ca_veStyle_autofill").hide();
				$("#ca_veSize_autofill").hide();
			}else{
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_vest_form"));
				$("#ca_veStyle").addClass("cl_required");
				$("#ca_veSize").addClass("cl_required");
				if(this.selectorVal2ItemLength('veChangeButton') == 0){
					clutil.viewReadonly(this.$("#ca_veChangeButton_div"));
				}
				if(this.selectorVal2ItemLength('veChangeLining') == 0){
					clutil.viewReadonly(this.$("#ca_veChangeLining_div"));
				}
				if(this.selectorVal2ItemLength('veBuckle') == 0){
					clutil.viewReadonly(this.$("#ca_veBuckle_div"));
				}
				if(this.selectorVal2ItemLength('veOptAmfStitch') == 0){
					clutil.viewReadonly(this.$("#ca_veOptAmfStitch_div"));
				}
			}
		},
		_changJK: function(){
			var $jacket		= this.$("#ca_jacket");
			this.jacketReadOnly(true);
			clutil.initUIelement(this.$el);
			if($jacket.val() > 0 && this.$("#ca_jkStyle").find("option").length >1){
				$("#ca_jkStyle").addClass("cl_required");
				//空欄しかない場合はそのままreadonly
				if(this.$("#ca_jkStyle").find("option").length >1){
					clutil.viewRemoveReadonly(this.$("#ca_jkStyle_div"));
					$("#ca_jkStyle_autofill").show();
				}
//				this.jacketReadOnly(false);
				//何らかの値が入っている
			}else{
			}
			return;
		},
		_changSK: function(){
			var $skirt		= this.$("#ca_skirt");
			this.skirtReadOnly(true);
			clutil.initUIelement(this.$el);
			if($skirt.val() > 0 && this.$("#ca_skStyle").find("option").length >1){
				$("#ca_skStyle").addClass("cl_required");
				//空欄しかない場合はそのままreadonly
				if(this.$("#ca_skStyle").find("option").length >1){
					clutil.viewRemoveReadonly(this.$("#ca_skStyle_div"));
					$("#ca_skStyle_autofill").show();
				}
//				this.skirtReadOnly(false);
				//何らかの値が入っている
			}else{
			}
			return;
		},
		_changPA: function(){
			var $pants		= this.$("#ca_pants");
			this.pantsReadOnly(true);
			clutil.initUIelement(this.$el);
			if($pants.val() > 0 && this.$("#ca_paStyle").find("option").length >1){
				$("#ca_paStyle").addClass("cl_required");
				//空欄しかない場合はそのままreadonly
				if(this.$("#ca_paStyle").find("option").length >1){
					clutil.viewRemoveReadonly(this.$("#ca_paStyle_div"));
					$("#ca_paStyle_autofill").show();
				}
//				this.pantsReadOnly(false);
				//何らかの値が入っている
			}else{
			}
			return;
		},

		_changVE: function(){
			var $vest		= this.$("#ca_vest");
			this.vestReadOnly(true);
			clutil.initUIelement(this.$el);
			if($vest.val() > 0 && this.$("#ca_veStyle").find("option").length >1){
				$("#ca_veStyle").addClass("cl_required");
				//空欄しかない場合はそのままreadonly
				if(this.$("#ca_veStyle").find("option").length >1){
					clutil.viewRemoveReadonly(this.$("#ca_veStyle_div"));
					$("#ca_veStyle_autofill").show();
				}
//				this.vestReadOnly(false);
				//何らかの値が入っている
			}else{
			}
			return;
		},
		//TODO
		_BrandTypeChange: function(){
			this._clearAllForm(_changeTypeArgs.BRAND);
			this.modelReadOnly(true);
			this.jacketReadOnly(true);
			this.skirtReadOnly(true);
			this.pantsReadOnly(true);
			this.vestReadOnly(true);
			if( this.$("#ca_brandID").val() == null || this.$("#ca_brandID").val()  <= 0){
				return;
			}
			this.doSrchOptionCloth();
			clutil.viewRemoveReadonly(this.$("#ca_jacket_div"));
			clutil.viewRemoveReadonly(this.$("#ca_skirt_div"));
			clutil.viewRemoveReadonly(this.$("#ca_pants_div"));
			if(this._getUnitID() == clcom.getSysparam('PAR_AMMS_UNITID_AOKI')){
				//aokiのみベスト変更入力可能
				clutil.viewRemoveReadonly(this.$("#ca_vest_div"));
			}

			// モデルコンボボックス作成
			this.setBrandChildCombo();

			// 各項目のスタイル設定
			this._ModelChange();
			return;
		},
		_clothIDIDChange: function(){
			this.doSrcharrivalDate();
			return;
		},
		/**
		 * ブランド検索してブランド項目を作成する
		 * */
		//TODO
		doSrchBrand: function(){
			//データクリア
			this._clearAllForm(_changeTypeArgs.STORE);
			//コンポーネントロック
			this.clearBrandCombo(true);
			this.modelReadOnly(true);
			this.jacketReadOnly(true);
			this.skirtReadOnly(true);
			this.pantsReadOnly(true);
			this.vestReadOnly(true);

			if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null || this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
				return $.Deferred().resolve();
			}
			var unitID = this._getUnitID();
			if (unitID == clcom.getSysparam('PAR_AMMS_UNITID_AOKI')){
				this.$("#ca_vest_div_div").show();
				this.$("#ca_vest_form").show();
			}else{
				this.$("#ca_vest_div_div").hide();
				this.$("#ca_vest_form").hide();
			}

			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0240GetReq :{
						reqType: 2,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
						storeID: this.$("#ca_storeID").autocomplete('clAutocompleteItem').id,
						orderDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
					}
			};
			var promise = clutil.postJSON('AMPOV0240', srchReq).done(_.bind(function(data){
				//console.log(arguments);
				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMPOV0240GetRsp.brandList;

				if(_.isEmpty(recs)){
					var list = [];
					var opt = {
							$select	:this.$("#ca_brandID"),
							list:list,
							unselectedflag:true,
							selectpicker: {
								noButton: true
							}
					};
					destroySelectpicker(opt.$select);
					clutil.cltypeselector3(opt);
					this.selector3Opts['brandID'] = opt;
					$("#ca_brandID_autofill").hide();
				}else{
					var list = [];
					$.each(recs, function() {
						var cn = {
								id: this.id,
								code: this.code,
								name: this.name
						};
						list.push(cn);
					});
					// 内容物がある場合 --> ブランド選択にセットする。
					var opt = {
							$select	:this.$("#ca_brandID"),
							list:list,
							unselectedflag:true,
							selectpicker: {
								noButton: true
							}
					};
					destroySelectpicker(opt.$select);
					clutil.cltypeselector3(opt);
					this.selector3Opts['brandID'] = opt;
					$("#ca_brandID_autofill").show();
				}
			}, this)).fail(_.bind(function(data){
			}, this));

//			this.setBrandChildCombo();
//			this.modelReadOnly(false);
			this.clearBrandCombo(false);
//			this._changJK();
//			this._changSK();
//			this._changPA();
//			this._changVE();
			return promise;
		},

//TODO
//		ブランド検索してブランド項目を探す際の処理。
		setBrandChildCombo: function(){
			var unitID;
			if(this.resUnitID == null || this.resUnitID == 0) {
				unitID = this._getUnitID();
			}else{
				unitID = this.resUnitID ;
			}
			this.JKField = clutil.clpomodelselector({
				el:this.$("#ca_jacket"),
				dependAttrs :{
					unit_id: function() {
						return unitID;
					},
					poTypeID: function() {
						return amcm_type.AMCM_VAL_PO_CLASS_LADYS;
					},
					srchFromDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
				}
			});
			this.SKField = clutil.clpomodelselector({
				el:this.$("#ca_skirt"),
				dependAttrs :{
					unit_id: function() {
						return unitID;
					},
					poTypeID: function() {
						return amcm_type.AMCM_VAL_PO_CLASS_LADYS;
					},
					srchFromDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
				}
			});
			this.PAField = clutil.clpomodelselector({
				el:this.$("#ca_pants"),
				dependAttrs :{
					unit_id: function() {
						return unitID;
					},
					poTypeID: function() {
						return amcm_type.AMCM_VAL_PO_CLASS_LADYS;
					},
					srchFromDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
				}
			});
			this.VEField = clutil.clpomodelselector({
				el:this.$("#ca_vest"),
				dependAttrs :{
					unit_id: function() {
						return unitID;
					},
					poTypeID: function() {
						return amcm_type.AMCM_VAL_PO_CLASS_LADYS;
					},
					srchFromDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
				}
			});

			return ;
		},
		clearBrandCombo: function(f_clear){
			if(f_clear){
				//コンボボックス初期化
				this.$("#ca_brandID").val('');		//ブランド
				this.$("#ca_brandID").selectpicker().selectpicker('refresh');
				clutil.viewReadonly(this.$("#ca_brandID_div"));
				$("#ca_brandID_autofill").hide();
//				this.clearOptionCloth(true);
			}else{
				clutil.viewRemoveReadonly(this.$("#ca_brandID_div"));
				$("#ca_brandID_autofill").show();
//				this.clearOptionCloth(false);

			}

			return ;
		},
		/**
		 * 生地・オプション検索して生地番号リスト項目・オプションリスト項目
		 * */
		doSrchOptionCloth: function(){
			clutil.viewRemoveReadonly(this.$("#ca_clothIDID_div"));
			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0240GetReq :{
						reqType: 3,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
						storeID: this.$("#ca_storeID").autocomplete('clAutocompleteItem').id,
						brandID: this.$("#ca_brandID").val(),
						orderDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
					}
			};

			clutil.postJSON('AMPOV0240', srchReq).done(_.bind(function(data){
				//console.log(arguments);
				var clothIDListRecs = data.AMPOV0240GetRsp.clothIDList;
				var optionListRecs = data.AMPOV0240GetRsp.optionList;

				if(_.isEmpty(clothIDListRecs)){
					var clothIDlist = [];
					var opt = {
							$select	:this.$("#ca_clothIDID"),
							list:clothIDlist,
							unselectedflag:true,
							selectpicker: {
								noButton: true
							}
					};
					destroySelectpicker(opt.$select);
					clutil.cltypeselector3(opt);
					this.selector3Opts['clothIDID'] = opt;
					$("#ca_clothNo_autofill").hide();
				}else{
					// 内容物がある場合
					var clothIDlist = [];
					$.each(clothIDListRecs, function() {
						var cn = {
								id: this.id,
								code: this.code,
								name: this.name
						};
						clothIDlist.push(cn);
					});
					// 内容物がある場合 --> ブランド選択にセットする。
					var opt = {
							$select	:this.$("#ca_clothIDID"),
							list:clothIDlist,
							unselectedflag:true,
							selectpicker: {
								noButton: true
							}
					};
					destroySelectpicker(opt.$select);
					clutil.cltypeselector3(opt);
					this.selector3Opts['clothIDID'] = opt;
					$("#ca_clothNo_autofill").show();
				}
				if(_.isEmpty(optionListRecs) ){
					;
				}else{
					this.showOptions(optionListRecs);
				}
			}, this)).fail(_.bind(function(data){

			}, this));
			return;
		},

		showOptions: function(recs){

			var list_jkChangeButton	= [];
			var list_jkChangeLining	= [];
			var list_jkAmfStitch	= [];
			var list_jkVent			= [];
			var list_jkSleeveDesign	= [];
			var list_jkInsidePocket	= [];
			var list_veChangeButton	= [];
			var list_veChangeLining	= [];
			var list_veBuckle		= [];
			var list_veOptAmfStitch	= [];

			for (var i = 0; i < recs.length; i++){
				var cn = {
						id: recs[i].optionID,
						code: recs[i].seq,
						name: recs[i].comment,
				};
				switch(recs[i].poOptTypeID){
				case amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE:
					if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						list_jkChangeButton.push(cn);
					}else if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						list_veChangeButton.push(cn);
					}else{
						;
					}
					break;
				case amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE:
					if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						list_jkChangeLining.push(cn);
					}else if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						list_veChangeLining.push(cn);
					}else{
						;
					}
					break;
				case amcm_type.AMCM_TYPE_AMF_STITCH_OPTION_TYPE:
					if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						list_jkAmfStitch.push(cn);
					}else if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						list_veOptAmfStitch.push(cn);
					}else{
						;
					}
					break;
				case amcm_type.AMCM_TYPE_CENTER_VENT_TYPE:
					list_jkVent.push(cn);
					break;
				case amcm_type.AMCM_TYPE_ARM_DESIGN_TYPE:
					list_jkSleeveDesign.push(cn);
					break;
				case amcm_type.AMCM_TYPE_INNER_POCKET_TYPE:
					list_jkInsidePocket.push(cn);
					break;
				case amcm_type.AMCM_TYPE_PIN_BUCKLE_TYPE:
					list_veBuckle.push(cn);
					break;
				}
			}

			var buildSelector = function(opt, keyName, myView){
				clutil.cltypeselector3(opt);
				myView.selector3Opts[keyName] = opt;
			};

			buildSelector({
				$select	:this.$("#ca_jkChangeButton"),
				list:list_jkChangeButton,
				unselectedflag:true
			}, 'jkChangeButton', this);
			buildSelector({
				$select	:this.$("#ca_jkChangeLining"),
				list:list_jkChangeLining,
				unselectedflag:true
			}, 'jkChangeLining', this);
			buildSelector({
				$select	:this.$("#ca_jkAmfStitch"),
				list:list_jkAmfStitch,
				unselectedflag:true
			}, 'jkAmfStitch', this);
			buildSelector({
				$select	:this.$("#ca_jkVent"),
				list:list_jkVent,
				unselectedflag:true
			}, 'jkVent', this);
			buildSelector({
				$select	:this.$("#ca_jkSleeveDesign"),
				list:list_jkSleeveDesign,
				unselectedflag:true
			}, 'jkSleeveDesign', this);
			buildSelector({
				$select	:this.$("#ca_jkInsidePocket"),
				list:list_jkInsidePocket,
				unselectedflag:true
			}, 'jkInsidePocket', this);
			buildSelector({
				$select	:this.$("#ca_veChangeButton"),
				list:list_veChangeButton,
				unselectedflag:true
			}, 'veChangeButton', this);
			buildSelector({
				$select	:this.$("#ca_veChangeLining"),
				list:list_veChangeLining,
				unselectedflag:true
			}, 'veChangeLining', this);
			buildSelector({
				$select	:this.$("#ca_veBuckle"),
				list:list_veBuckle,
				unselectedflag:true
			}, 'veBuckle', this);
			buildSelector({
				$select	:this.$("#ca_veOptAmfStitch"),
				list:list_veOptAmfStitch,
				unselectedflag:true
			}, 'veOptAmfStitch', this);

			clutil.initUIelement(this.$el);
			return this;
		},

		showOptionsJK: function(recs){

			var list_jkChangeButton	= [];
			var list_jkChangeLining	= [];
			var list_jkAmfStitch	= [];
			var list_jkVent			= [];
			var list_jkSleeveDesign	= [];
			var list_jkInsidePocket	= [];

			for (var i = 0; i < recs.length; i++){
				var cn = {
						id: recs[i].optionID,
						code: recs[i].seq,
						name: recs[i].comment,
				};
				switch(recs[i].poOptTypeID){
				case amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE:
					if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						list_jkChangeButton.push(cn);
					}else{
						;
					}
					break;
				case amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE:
					if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						list_jkChangeLining.push(cn);
					}else{
						;
					}
					break;
				case amcm_type.AMCM_TYPE_AMF_STITCH_OPTION_TYPE:
					if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						list_jkAmfStitch.push(cn);
					}else{
						;
					}
					break;
				case amcm_type.AMCM_TYPE_CENTER_VENT_TYPE:
					list_jkVent.push(cn);
					break;
				case amcm_type.AMCM_TYPE_ARM_DESIGN_TYPE:
					list_jkSleeveDesign.push(cn);
					break;
				case amcm_type.AMCM_TYPE_INNER_POCKET_TYPE:
					list_jkInsidePocket.push(cn);
					break;
				}
			}

			var buildSelector = function(opt, keyName, myView){
				clutil.cltypeselector3(opt);
				myView.selector3Opts[keyName] = opt;
			};

			buildSelector({
				$select	:this.$("#ca_jkChangeButton"),
				list:list_jkChangeButton,
				unselectedflag:true
			}, 'jkChangeButton', this);
			buildSelector({
				$select	:this.$("#ca_jkChangeLining"),
				list:list_jkChangeLining,
				unselectedflag:true
			}, 'jkChangeLining', this);
			buildSelector({
				$select	:this.$("#ca_jkAmfStitch"),
				list:list_jkAmfStitch,
				unselectedflag:true
			}, 'jkAmfStitch', this);
			buildSelector({
				$select	:this.$("#ca_jkVent"),
				list:list_jkVent,
				unselectedflag:true
			}, 'jkVent', this);
			buildSelector({
				$select	:this.$("#ca_jkSleeveDesign"),
				list:list_jkSleeveDesign,
				unselectedflag:true
			}, 'jkSleeveDesign', this);
			buildSelector({
				$select	:this.$("#ca_jkInsidePocket"),
				list:list_jkInsidePocket,
				unselectedflag:true
			}, 'jkInsidePocket', this);

			clutil.initUIelement(this.$el);
			return this;
		},

		showOptionsVE: function(recs){

			var list_veChangeButton	= [];
			var list_veChangeLining	= [];
			var list_veBuckle		= [];
			var list_veOptAmfStitch	= [];

			for (var i = 0; i < recs.length; i++){
				var cn = {
						id: recs[i].optionID,
						code: recs[i].seq,
						name: recs[i].comment,
				};
				switch(recs[i].poOptTypeID){
				case amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE:
					if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						list_veChangeButton.push(cn);
					}else{
						;
					}
					break;
				case amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE:
					if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						list_veChangeLining.push(cn);
					}else{
						;
					}
					break;
				case amcm_type.AMCM_TYPE_AMF_STITCH_OPTION_TYPE:
					if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						list_veOptAmfStitch.push(cn);
					}else{
						;
					}
					break;
				case amcm_type.AMCM_TYPE_PIN_BUCKLE_TYPE:
					list_veBuckle.push(cn);
					break;
				}
			}

			var buildSelector = function(opt, keyName, myView){
				clutil.cltypeselector3(opt);
				myView.selector3Opts[keyName] = opt;
			};

			buildSelector({
				$select	:this.$("#ca_veChangeButton"),
				list:list_veChangeButton,
				unselectedflag:true
			}, 'veChangeButton', this);
			buildSelector({
				$select	:this.$("#ca_veChangeLining"),
				list:list_veChangeLining,
				unselectedflag:true
			}, 'veChangeLining', this);
			buildSelector({
				$select	:this.$("#ca_veBuckle"),
				list:list_veBuckle,
				unselectedflag:true
			}, 'veBuckle', this);
			buildSelector({
				$select	:this.$("#ca_veOptAmfStitch"),
				list:list_veOptAmfStitch,
				unselectedflag:true
			}, 'veOptAmfStitch', this);

			clutil.initUIelement(this.$el);
			return this;
		},

//		生地・オプション検索し、入力制限をかける。入力制限解除もここで行う。
		clearOptionCloth: function(f_clear){
			if(f_clear){
				//コンボボックス初期化
				this.$("#ca_clothIDID").html('');		//生地番号
				this.$("#ca_clothIDID").selectpicker().selectpicker('refresh');
				this.$("#ca_washable").html('');	//ウォッシャブル
				this.$("#ca_washable").selectpicker().selectpicker('refresh');
				this.$("#ca_jkSleeveButton").html('');	//袖ボタン4つ
				this.$("#ca_jkSleeveButton").selectpicker().selectpicker('refresh');
				this.$("#ca_jkChangePocket").html('');	//チェンジポケット
				this.$("#ca_jkChangePocket").selectpicker().selectpicker('refresh');
				this.$("#ca_jkCuffs").html('');			//本切羽
				this.$("#ca_jkCuffs").selectpicker().selectpicker('refresh');
				this.$("#ca_jkAmfStitch").html('');		//AMFステッチ
				this.$("#ca_jkAmfStitch").selectpicker().selectpicker('refresh');
				this.$("#ca_jkChangeButton").html('');	//ボタン変更
				this.$("#ca_jkChangeButton").selectpicker().selectpicker('refresh');
				this.$("#ca_jkOdaiba").html('');		//お台場
				this.$("#ca_jkOdaiba").selectpicker().selectpicker('refresh');
				this.$("#ca_jkChangeLining").html('');	//裏地変更
				this.$("#ca_jkChangeLining").selectpicker().selectpicker('refresh');
				this.$("#ca_jkSummerType").html('');	//サマー仕様
				this.$("#ca_jkSummerType").selectpicker().selectpicker('refresh');
				this.$("#ca_slAdjuster").html('');		//アジャスター
				this.$("#ca_slAdjuster").selectpicker().selectpicker('refresh');
				this.$("#ca_slSpareAdjuster").html('');	//スペアアジャスター
				this.$("#ca_slSpareAdjuster").selectpicker().selectpicker('refresh');
				this.$("#ca_slChangeButton").html('');	//ボタン変更
				this.$("#ca_slChangeButton").selectpicker().selectpicker('refresh');
				this.$("#ca_veChangeButton").html('');	//ボタン変更
				this.$("#ca_veChangeButton").selectpicker().selectpicker('refresh');
				this.$("#ca_veChangeLining").html('');	//裏地変更
				this.$("#ca_veChangeLining").selectpicker().selectpicker('refresh');
				this.$("#ca_veOptAmfStitch").html('');	//AMFステッチ
				this.$("#ca_veOptAmfStitch").selectpicker().selectpicker('refresh');
				clutil.viewReadonly(this.$("#ca_clothIDID_div"));
				clutil.viewReadonly(this.$("#ca_washable_div"));
				clutil.viewReadonly(this.$("#ca_jkSleeveButton_div"));
				clutil.viewReadonly(this.$("#ca_jkChangePocket_div"));
				clutil.viewReadonly(this.$("#ca_jkCuffs_div"));
				clutil.viewReadonly(this.$("#ca_jkAmfStitch_div"));
				clutil.viewReadonly(this.$("#ca_jkChangeButton_div"));
				clutil.viewReadonly(this.$("#ca_jkOdaiba_div"));
				clutil.viewReadonly(this.$("#ca_jkChangeLining_div"));
				clutil.viewReadonly(this.$("#ca_jkSummerType_div"));
				clutil.viewReadonly(this.$("#ca_slAdjuster_div"));
				clutil.viewReadonly(this.$("#ca_slSpareAdjuster_div"));
				clutil.viewReadonly(this.$("#ca_slChangeButton_div"));
				clutil.viewReadonly(this.$("#ca_veChangeButton_div"));
				clutil.viewReadonly(this.$("#ca_veChangeLining_div"));
				clutil.viewReadonly(this.$("#ca_veOptAmfStitch_div"));

			}else{
				clutil.viewRemoveReadonly(this.$("#ca_clothIDID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_washable_div"));
				clutil.viewRemoveReadonly(this.$("#ca_jkSleeveButton_div"));
				clutil.viewRemoveReadonly(this.$("#ca_jkChangePocket_div"));
				clutil.viewRemoveReadonly(this.$("#ca_jkCuffs_div"));
				clutil.viewRemoveReadonly(this.$("#ca_jkAmfStitch_div"));
				clutil.viewRemoveReadonly(this.$("#ca_jkChangeButton_div"));
				clutil.viewRemoveReadonly(this.$("#ca_jkOdaiba_div"));
				clutil.viewRemoveReadonly(this.$("#ca_jkChangeLining_div"));
				clutil.viewRemoveReadonly(this.$("#ca_jkSummerType_div"));
				clutil.viewRemoveReadonly(this.$("#ca_slAdjuster_div"));
				clutil.viewRemoveReadonly(this.$("#ca_slSpareAdjuster_div"));
				clutil.viewRemoveReadonly(this.$("#ca_slChangeButton_div"));
				clutil.viewRemoveReadonly(this.$("#ca_veChangeButton_div"));
				clutil.viewRemoveReadonly(this.$("#ca_veChangeLining_div"));
				clutil.viewRemoveReadonly(this.$("#ca_veOptAmfStitch_div"));

			}
			return ;
		},
		/**
		 * メモの中身を確認する
		 * */

		chkOtstoreMemo: function(e){
			clutil.cltxtFieldLimit($(e.target));
			if( this.$("#ca_otStoreMemo").val() == null || this.$("#ca_otStoreMemo").val() == ""){
				this.validator.clearErrorMsg(this.$('#ca_otStoreMemo'));
				return;
			}
			var _tgtText = this.$("#ca_otStoreMemo").val();
			if(_tgtText.length > 170 ){
				this.validator.setErrorMsg(this.$("#ca_otStoreMemo"), clutil.fmtargs(clmsg.cl_maxlen, ["170"]));
			}else{
				num = _tgtText.match(/\n/g);
				if(num != null){
					if( num.length  > 3){
						this.validator.setErrorMsg(this.$("#ca_otStoreMemo"), clmsg.EPO0068);
					}else{
						this.validator.clearErrorMsg(this.$('#ca_otStoreMemo'));
					}
				}else{
					this.validator.clearErrorMsg(this.$('#ca_otStoreMemo'));
				}
			}
		},
		/**
		 * 到着日を検索して到着日を設定する
		 * */
		doSrcharrivalDate: function(){
			if( this.$("#ca_brandID").val() == null || this.$("#ca_brandID").val()  <= 0){
				return;
			}
			if( this.$("#ca_clothIDID").val() == null || this.$("#ca_clothIDID").val()  <= 0){
				return;
			}
			if( this.$("#ca_orderDate").val() == null || clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')  <= 0){
				return;
			}
			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0240GetReq :{
						reqType: 4,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS,
						storeID: this.$("#ca_storeID").autocomplete('clAutocompleteItem').id,
						brandID: this.$("#ca_brandID").val(),
						clothIDID:this.$("#ca_clothIDID").val(),
						orderDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')

					}
			};

			clutil.postJSON('AMPOV0240', srchReq).done(_.bind(function(data){
				//console.log(arguments);
				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMPOV0240GetRsp.arrivalDateList;

				if(_.isEmpty(recs)){
					clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
				}else{
					clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', recs[0].arrivalDate);
					clutil.datepicker(this.$("#ca_saleDate")).datepicker('setIymd', clutil.addDate(recs[0].arrivalDate, 1));
				}
			}, this)).fail(_.bind(function(data){
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
			}, this));

			return;
		},
		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
//			var rec = data.AMPOV0240GetRsp;
//			delete rec.orgfunc.fromDate;
//			delete rec.orgfunc.toDate;
//			$.each(rec.orglevelList, function(){
//			delete this.fromDate;
//			delete this.toDate;
//			delete this.orglevelCode;
//			});
			return data;
		},

		/**
		 * セレクタ選択値から、コードネームオブジェクトを解く。
		 * @param {string} selectorID セレクタ要素の id 名。"ca_" プレフィックスを除く。
		 * @param {any} val seletor 要素から取得した value 値。
		 * @return {object} コードネームオブジェクト
		 */
		selectorVal2Item: function(selectorID, val){
			var o = this.selector3Opts[selectorID];
			return (o && o.idMap) ? o.idMap[val] : val;
		},
		selectorVal2ItemLength: function(selectorID){
			var o = this.selector3Opts[selectorID];
			return (o && o.idMap) ? o.list.length : 0;
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

//	初期データを取る
	clutil.getIniJSON(null, null).done(function(data, dataType) {
		ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
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
