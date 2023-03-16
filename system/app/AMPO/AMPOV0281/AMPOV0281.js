useSelectpicker2();

//区分
var TYPE = {
		ALL: 0,
		ST : 1,
		JK : 2,
		SL : 3,
		VE : 4,

		L_JK:11,
		L_SK:12,
		L_SL:13,
		L_VE:14
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

$(function(){

	clutil.enterFocusMode($('body'));

	var EditView = Backbone.View.extend({
		el : $("#ca_main"),

		validator : null,
		// true=登録 false=一覧 に戻る
		returnObj : {},

		events : {

		},

		/**
		 * キャンセルボタン押下で戻り先差分 true:登録画面 false:一覧
		 */
		_onClickCancel:function(){
			clcom.popPage(this.returnObj);
		},

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
			this.returnObj = {f_back:true, arrivalDate:0};
			var _this = this;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
						title: 'ORIHICA',
						subtitle: 'PO発注登録確認',
						opeTypeId: o.opeTypeId,
						pageCount: o.chkData.length,
						// 更新完了後ダイアログは自前表示するので、off 宣言を明示。
						updMessageDialog: false,
						// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
						// リクエストビルダ関数を渡しておく。
						buildSubmitReqFunction: this._buildSubmitReqFunction
						// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
						// リクエストのビルダ関数を opt で渡しておく。
//						buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
//						?this._buildGetReqFunction : undefined,
//								buildSubmitCheckDataFunction : this._buildSubmitCheckFunction,
//								updMessageDialog: false
				};

				// フッタ名称変更
				var ope = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
				var label = '登録完了';
				if(fixopt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					ope = am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL;
					label = '削除完了';
				}

				_.extend(mdOpt, {
					opeTypeId: [
					            {
					            	opeTypeId: ope,
					            	label: label
					            },
					            ],
					            btn_cancel:{
					            	label:'戻って修正',
					            	action: _this._onClickCancel
					            },
					            btn_submit: true,
					            btn_csv: false
				});
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

		/**
		 * 取得データ表示
		 */
		getData2view : function(){
			var args = clcom.pageArgs.sendData;

			var baseData = args.baseData;
			var otherData = args.otherData;
			var orderData = args.orderData;
			var submitType = args.submitType;
			var orderType = args.orderType;

			// データを表示用に成形
			baseData = this.makeBaseData(baseData, otherData, orderType);
			otherData = this.makeOtherData(otherData, orderType);
			orderData = this.makeOrderData(orderData, baseData, orderType);

			// 表示リセット
			$('.ca_M_Area').hide();
			$('.ca_M_Div').hide();
			$('.ca_L_Area').hide();
			$('.ca_L_Div').hide();
			$('.ca_S_Area').hide();

			// オーダーごとの固有場所反映
			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				this.showMArea(baseData, orderData, args.orderData);
			}
			else if(orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				this.showLArea(baseData, orderData, args.orderData);
			}
			else{
				this.showSArea(baseData, orderData, args.orderData);
			}

			// 登録区分の表示設定
			if(submitType == 0){
				$("#ca_submitTypeNew").show();
				$("#ca_submitTypeFax").hide();
			}
			else{
				$("#ca_submitTypeNew").hide();
				$("#ca_submitTypeFax").show();
			}

			// 共通情報反映
			clutil.data2view($("#ca_baseField"), baseData);
			clutil.data2view($("#ca_otherField"), otherData);
		},

		/**
		 * 取得データ表示
		 */
		getDate2view : function(){
			var args = clcom.pageArgs.sendData;

			var baseDate = args.baseDate;
			var otherDate = args.otherDate;
			var orderDate = args.orderDate;
			var submitType = args.submitType;
			var orderType = args.orderType;

			// データを表示用に成形
			baseData = this.makeBaseData(baseData, otherData, orderType);
			otherData = this.makeOtherData(otherData, orderType);
			orderData = this.makeOrderData(orderData, baseData, orderType);

			// 表示リセット
			$('.ca_M_Area').hide();
			$('.ca_M_Div').hide();
			$('.ca_L_Area').hide();
			$('.ca_L_Div').hide();
			$('.ca_S_Area').hide();

			// オーダーごとの固有場所反映
			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				this.showMArea(baseData, orderData, args.orderData);
			}
			else {
				this.showLArea(baseData, orderData, args.orderData);
			}

			// 登録区分の表示設定
			if(submitType == 0){
				$("#ca_submitTypeNew").show();
				$("#ca_submitTypeFax").hide();
			}
			else{
				$("#ca_submitTypeNew").hide();
				$("#ca_submitTypeFax").show();
			}

			// 共通情報反映
			clutil.data2view($("#ca_baseField"), baseData);
			clutil.data2view($("#ca_otherField"), otherData);

//			// オーダーごとの固有場所反映
//			if(orderType == 1){
//				var variety = "";
//				var dotFlag = false;
//				$('.ca_M_Area').show();
//				$('.ca_M_Div').hide();
//				$('.ca_L_Area').hide();
//				$('.ca_S_Area').hide();
//				// ジャケットなどの区分表示設定
//				if(baseDate.M_st == 1){
//					$('#ca_M_jkDiv').show();
//					$('#ca_M_slDiv').show();
//					variety += "スーツ";
//					dotFlag = true;
//				}
//				if(baseDate.M_jk == 1){
//					$('#ca_M_jkDiv').show();
//					variety += "ジャケット";
//					dotFlag = true;
//				}
//				if(baseDate.M_sl == 1){
//					$('#ca_M_slDiv').show();
//					if(dotFlag == true){
//						variety += "、";
//					}
//					variety += "スラックス";
//					dotFlag = true;
//				}
//				if(baseDate.M_ve == 1){
//					$('#ca_M_veDiv').show();
//					if(dotFlag == true){
//						variety += "、";
//					}
//					variety += "ベスト";
//				}
//				baseDate.M_variety = variety;
//				clutil.data2view(this.$('#ca_M_Field'), orderDate);
//			}
//			else if(orderType == 2){
//				$('.ca_M_Area').hide();
//				$('.ca_L_Area').show();
//				$('.ca_L_Div').hide();
//				$('.ca_S_Area').hide();
//				// ジャケットなどの区分表示設定
//				if(baseDate.L_jk == 1){
//					$('#ca_L_jkDiv').show();
//				}
//				if(baseDate.L_sk == 1){
//					$('#ca_L_skDiv').show();
//				}
//				if(baseDate.L_sl == 1){
//					$('#ca_L_slDiv').show();
//				}
//				if(baseDate.L_ve == 1){
//					$('#ca_L_veDiv').show();
//				}
//				clutil.data2view(this.$('#ca_L_Field'), orderDate);
//			}
//			else{
//				$('.ca_M_Area').hide();
//				$('.ca_L_Area').hide();
//				$('.ca_S_Area').show();
//				$('#ca_otStoreAdjTypeID_div').hide();
//				clutil.data2view(this.$('#ca_S_Field'), orderDate);
//			}
//
//			if(submitType == 1){
//				$("#ca_submitTypeNew").show();
//				$("#ca_submitTypeFax").hide();
//			}
//			else{
//				$("#ca_submitTypeNew").hide();
//				$("#ca_submitTypeFax").show();
//			}
//
//			// 共通情報反映
//			clutil.data2view($("#ca_baseField"), baseDate);
//			clutil.data2view($("#ca_otherField"), otherDate);
		},

		// メンズ領域表示
		showMArea:function(base, order, orgOrder){
			$('.ca_M_Area').show();
			// ジャケットなどの区分表示設定
			if(base.M_st == 1){
				$('#ca_M_jkDiv').show();
				$('#ca_M_slDiv').show();
				$('#ca_M_sl_changeButtonTypeArea').hide();

				// ネーム領域隠す
				if(orgOrder.M_jk_name == amcm_type.AMCM_VAL_PO_NAME_TYPE_KANJI){
					$('.ca_M_nameLongAlpha').hide();
				}
				else if(orgOrder.M_jk_name == amcm_type.AMCM_VAL_PO_NAME_TYPE_FULL){

				}
				else if(orgOrder.M_jk_name == amcm_type.AMCM_VAL_PO_NAME_TYPE_INITIAL){
					$('.ca_M_nameLong').hide();
				}
				else{
					$('.ca_M_nameNone').hide();
				}

				if(orgOrder.M_sl_spareType == amcm_type.AMCM_VAL_SPARE_TYPE_NOT_EXIST){
					// スペアなしなら非表示・値リセット
					$('.ca_spareDiv').hide();
					orgOrder.M_sl_bottomSpare = 0;
					orgOrder.M_sl_bottomSpareType = 0;
				}
				if(orgOrder.M_sl_bottomType != amcm_type.AMCM_VAL_COATTAIL_TYPE_DOUBLE){
					// ダブル以外なら非表示・値リセット
					$('#ca_disp_M_sl_bottomDoubleArea').hide();
					orgOrder.M_sl_bottom = 0;
				}
				if(orgOrder.M_sl_bottomSpareType != amcm_type.AMCM_VAL_COATTAIL_TYPE_DOUBLE){
					// ダブル以外なら非表示・値リセット
					$('#ca_disp_M_sl_bottomSpareDoubleArea').hide();
					orgOrder.M_sl_bottomSpare = 0;
				}
				if((orgOrder.M_sl_spareType == amcm_type.AMCM_VAL_SPARE_TYPE_NOT_EXIST
								&& orgOrder.M_sl_bottomType == amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE )
						|| (orgOrder.M_sl_spareType == amcm_type.AMCM_VAL_SPARE_TYPE_EXIST
								&& orgOrder.M_sl_bottomType == amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE
								&& orgOrder.M_sl_bottomSpareType == amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE)){
					// 丈上表示なしなら非表示・値リセット
					$('.ca_M_sl_lengthArea').hide();
					orgOrder.M_sl_lengthLeft = 0;
					orgOrder.M_sl_lengthRight = 0;
				}
			}
			if(base.M_jk == 1){
				$('#ca_M_jkDiv').show();
				// ネーム領域隠す
				if(orgOrder.M_jk_name == amcm_type.AMCM_VAL_PO_NAME_TYPE_KANJI){
					$('.ca_M_nameLongAlpha').hide();
				}
				else if(orgOrder.M_jk_name == amcm_type.AMCM_VAL_PO_NAME_TYPE_FULL){

				}
				else if(orgOrder.M_jk_name == amcm_type.AMCM_VAL_PO_NAME_TYPE_INITIAL){
					$('.ca_M_nameLong').hide();
				}
				else{
					$('.ca_M_nameNone').hide();
				}
			}
			if(base.M_sl == 1){
				$('#ca_M_slDiv').show();
				if(orgOrder.M_sl_spareType == amcm_type.AMCM_VAL_SPARE_TYPE_NOT_EXIST){
					// スペアなしなら非表示・値リセット
					$('.ca_spareDiv').hide();
					orgOrder.M_sl_bottomSpare = 0;
					orgOrder.M_sl_bottomSpareType = 0;
				}
				if(orgOrder.M_sl_bottomType != amcm_type.AMCM_VAL_COATTAIL_TYPE_DOUBLE){
					// ダブル以外なら非表示・値リセット
					$('#ca_disp_M_sl_bottomDoubleArea').hide();
					orgOrder.M_sl_bottom = 0;
				}
				if(orgOrder.M_sl_bottomSpareType != amcm_type.AMCM_VAL_COATTAIL_TYPE_DOUBLE){
					// ダブル以外なら非表示・値リセット
					$('#ca_disp_M_sl_bottomSpareDoubleArea').hide();
					orgOrder.M_sl_bottomSpare = 0;
				}
				if((orgOrder.M_sl_spareType == amcm_type.AMCM_VAL_SPARE_TYPE_NOT_EXIST
								&& orgOrder.M_sl_bottomType == amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE)
						|| (orgOrder.M_sl_spareType == amcm_type.AMCM_VAL_SPARE_TYPE_EXIST
								&& orgOrder.M_sl_bottomType == amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE
								&& orgOrder.M_sl_bottomSpareType == amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE)){
					// 丈上表示なしなら非表示・値リセット
					$('.ca_M_sl_lengthArea').hide();
					orgOrder.M_sl_lengthLeft = 0;
					orgOrder.M_sl_lengthRight = 0;
				}
			}
			if(base.M_ve == 1){
				$('#ca_M_veDiv').show();
			}
			clutil.data2view($('#ca_M_Field'), order);
		},
		// レディス領域表示
		showLArea:function(base, order, orgOrder){
			$('.ca_L_Area').show();
			// ジャケットなどの区分表示設定
			if(base.L_jk == 1){
				$('#ca_L_jkDiv').show();
				// ネーム領域隠す
				if(orgOrder.L_jk_name == amcm_type.AMCM_VAL_PO_NAME_TYPE_KANJI){
					$('.ca_L_nameLongAlpha').hide();
				}
				else if(orgOrder.L_jk_name == amcm_type.AMCM_VAL_PO_NAME_TYPE_FULL){

				}
				else if(orgOrder.L_jk_name == amcm_type.AMCM_VAL_PO_NAME_TYPE_INITIAL){
					$('.ca_L_nameLong').hide();
				}
				else{
					$('.ca_L_nameNone').hide();
				}
			}
			if(base.L_sk == 1){
				$('#ca_L_skDiv').show();
			}
			if(base.L_sl == 1){
				$('#ca_L_slDiv').show();
				if(orgOrder.L_sl_bottomType == amcm_type.AMCM_VAL_COATTAIL_TYPE_NONE){
					// 丈上表示なしなら非表示・値リセット
					$('.ca_L_sl_lengthArea').hide();
					orgOrder.L_sl_lengthLeft = 0;
					orgOrder.L_sl_lengthRight = 0;
				}
			}
			if(base.L_ve == 1){
				$('#ca_L_veDiv').show();
			}
			clutil.data2view($('#ca_L_Field'), order);
		},

		/**
		 * 表示用にデータ成形
		 * @param baseData
		 * @param orderType
		 */
		// 共通項目
		makeBaseData : function(baseData, otherData, orderType){
			var data = baseData;

			// 店舗名称
			data.store = data._view2data_storeID_cn.code + ":" + data._view2data_storeID_cn.name;
			// 担当者名称
			data.user = data._view2data_userID_cn.code + ":" + data._view2data_userID_cn.name;
			// 電話番号
			data.telNo = data.telNo1 + "-" + data.telNo2 + "-" + data.telNo3;
			// 日付
			data.orderDate = clutil.dateFormat(otherData.orderDate, 'yyyy/mm/dd(w)');
			data.arrivalDate = clutil.dateFormat(otherData.arrivalDate, 'yyyy/mm/dd(w)');
			data.saleDate =clutil.dateFormat(otherData.saleDate, 'yyyy/mm/dd(w)');


			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				data.disp_orderType = "メンズ";
				var variety = "";
				var dotFlag = false;

				// ジャケットなどの区分表示設定
				if(baseData.M_st == 1){
					variety += "スーツ";
					dotFlag = true;
				}
				if(baseData.M_jk == 1){
					variety += "ジャケット";
					dotFlag = true;
				}
				if(baseData.M_sl == 1){
					if(dotFlag == true){
						variety += "、";
					}
					variety += "スラックス";
					dotFlag = true;
				}
				if(baseData.M_ve == 1){
					if(dotFlag == true){
						variety += "、";
					}
					variety += "ベスト";
				}
				data.M_variety = variety;

				// 名称
				data.M_season = data.seasonObj.name;
				data.M_brand = data.brandObj.name;
				data.M_cloth = data.clothObj.code + ":" + data.clothObj.name;
			}
			else if(orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				data.disp_orderType = "レディス";
				data.L_season = data.seasonObj.name;
				data.L_brand = data.brandObj.name;
				data.L_cloth = data.clothObj.code + ":" + data.clothObj.name;

				data.disp_L_jkType = this.makeModelJkName(data.L_jkType);
				data.disp_L_skType = this.makeModelSkName(data.L_skType);
				data.disp_L_slType = this.makeModelSlName(data.L_slType);
			}
			else{
				data.disp_orderType = "シャツ";
			}

			return data;
		},
		makeModelName:function(obj){
			var name = "なし";
			if(obj.id != 0){
				name = obj.name;
			}
			return name;
		},

		makeModelJkName: function(type) {
			var name;
			switch (type) {
			case "4":
				name = "スタイリッシュ(1つボタン)";
				break;
			case "2":
				name = "ベーシック(2つボタン)";
				break;
			default:
				name = "なし";
				break;
			}
			return name;
		},

		makeModelSkName: function(type) {
			var name;
			switch (type) {
			case "4":
				name = "スタイリッシュ(フレア)";
				break;
			case "2":
				name = "ベーシック(タイト)";
				break;
			default:
				name = "なし";
				break;
			}
			return name;
		},

		makeModelSlName: function(type) {
			var name;
			switch (type) {
			case "4":
				name = "スタイリッシュ(テーパード)";
				break;
			case "2":
				name = "ベーシック(フレア)";
				break;
			default:
				name = "なし";
				break;
			}
			return name;
		},

		// その他情報
		makeOtherData : function(otherData, orderType){
			var data = otherData;
			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_MENS
					|| orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				if(data.otStoreAdjTypeID == 2){
					data.disp_otStoreAdjTypeID = "エイトストップ";
				}
				else if(data.otStoreAdjTypeID == 3){
					data.disp_otStoreAdjTypeID = "ハートシック";
				}
				else if(data.otStoreAdjTypeID == 4){
					data.disp_otStoreAdjTypeID = "エイト＆ハート";
				}
				else if(data.otStoreAdjTypeID == 5){
					data.disp_otStoreAdjTypeID = "ハートシック(L)";
				}
				else if(data.otStoreAdjTypeID == 6){
					data.disp_otStoreAdjTypeID = "エイト＆ハート(L)";
				}
				else{
					data.disp_otStoreAdjTypeID = "なし";
				}
			}

			return data;
		},
		// 各種注文データ
		makeOrderData : function(orderData, baseData, orderType){
			var order = orderData;
			var base = baseData;
			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				if(base.M_st == 1){
					// メンズスーツ
					order.disp_M_jk_style = order.jkStyleObj.name;
					order.disp_M_jk_size = this.getSize(orderType, order.jkSize1Obj.name, order.jkSize2Obj.name);
					order.disp_M_jk_ventType = this.getM_jk_ventType(order.M_jk_ventType);
					order.disp_M_jk_amfType = this.getYesOrNo(order.M_jk_amfType);
					order.disp_M_jk_liningType = this.get_jk_liningType(order.M_jk_liningType);
					order.disp_M_jk_pocketType = this.getM_jk_pocketType(order.M_jk_pocketType);
					order.disp_M_jk_layerButtonType = this.getYesOrNo(order.M_jk_layerButtonType);
					order = this.getName(orderType, order, order.M_jk_nameMakeType);		// ネーム関係
					order.disp_M_jk_armLeft = this.getSign(order.M_jk_armLeft);
					order.disp_M_jk_armRigth = this.getSign(order.M_jk_armRigth);
					order.disp_M_jk_length = this.getSign(order.M_jk_length);
					order.disp_M_jk_trunk = this.getSign(order.M_jk_trunk);
					order.disp_M_jk_sleeveButtonType = this.getYesOrNo(order.M_jk_sleeveButtonType);
					order.disp_M_jk_changePocketType = this.getYesOrNo(order.M_jk_changePocketType);
					order.disp_M_jk_cuffsType = this.getYesOrNo(order.M_jk_cuffsType);
					order.disp_M_jk_daibaType = this.getYesOrNo(order.M_jk_daibaType);
					order.disp_M_jk_summerType = this.getYesOrNo(order.M_jk_summerType);
					order.disp_M_jk_amfPayType = this.getYesOrNo(order.M_jk_amfPayType);
					order.disp_M_jk_changeButtonType = this.get_jk_changeButtonSel(order, order.M_jk_changeButtonType);
					order.disp_M_jk_cuffsFirst = this.getM_jk_cuffsFirst(order.M_jk_cuffsFirst, order.M_jk_flowerHole);
					if(order.M_jk_cuffsFirst == 1 || order.M_jk_flowerHole == 1){
						order.disp_M_jk_buttonThreadColorSel = this.getM_jk_buttonThreadColorSel(order, order.M_jk_buttonThreadColorSel);
					}
					order.disp_M_jk_changeLiningType = this.get_jk_changeLiningSel(order, order.M_jk_changeLiningType);

					order.disp_M_sl_style = order.slStyleObj.name;
					order.disp_M_sl_size = this.getSize(orderType, order.slSize1Obj.name, order.slSize2Obj.name);
					order.disp_M_sl_bottomType = this.getM_sl_bottomType(order.M_sl_bottomType);
					order.disp_M_sl_bottom = this.getSign(order.M_sl_bottom);
					order.disp_M_sl_lengthLeft = this.getSign(order.M_sl_lengthLeft);
					order.disp_M_sl_lengthRight = this.getSign(order.M_sl_lengthRight);
					order.disp_M_sl_weist = this.getSign(order.M_sl_weist);
					order.disp_M_sl_adjuster = this.getYesOrNo(order.M_sl_adjuster);
					//order.disp_M_sl_changeButtonType = this.get_sl_changeButtonSel(order, order.M_sl_changeButtonType);
					order.disp_M_sl_spareType = this.getYesOrNo2(order.M_sl_spareType);
					order.disp_M_sl_bottomSpareType = this.getM_sl_bottomType(order.M_sl_bottomSpareType);
					order.disp_M_sl_bottomSpare = this.getSign(order.M_sl_bottomSpare);
					order.disp_M_sl_lengthLeftSpare = this.getSign(order.M_sl_lengthLeft);
					order.disp_M_sl_lengthRightSpare = this.getSign(order.M_sl_lengthRight);
					order.disp_M_sl_adjusterSpare = this.getYesOrNo(order.M_sl_adjusterSpare);
				}
				if(base.M_jk == 1){
					// メンズジャケット
					order.disp_M_jk_style = order.jkStyleObj.name;
					order.disp_M_jk_size = this.getSize(orderType, order.jkSize1Obj.name, order.jkSize2Obj.name);
					order.disp_M_jk_ventType = this.getM_jk_ventType(order.M_jk_ventType);
					order.disp_M_jk_amfType = this.getYesOrNo(order.M_jk_amfType);
					order.disp_M_jk_liningType = this.get_jk_liningType(order.M_jk_liningType);
					order.disp_M_jk_pocketType = this.getM_jk_pocketType(order.M_jk_pocketType);
					order.disp_M_jk_layerButtonType = this.getYesOrNo(order.M_jk_layerButtonType);
					order = this.getName(orderType, order, order.M_jk_nameMakeType);		// ネーム関係
					order.disp_M_jk_armLeft = this.getSign(order.M_jk_armLeft);
					order.disp_M_jk_armRigth = this.getSign(order.M_jk_armRigth);
					order.disp_M_jk_length = this.getSign(order.M_jk_length);
					order.disp_M_jk_trunk = this.getSign(order.M_jk_trunk);
					order.disp_M_jk_sleeveButtonType = this.getYesOrNo(order.M_jk_sleeveButtonType);
					order.disp_M_jk_changePocketType = this.getYesOrNo(order.M_jk_changePocketType);
					order.disp_M_jk_cuffsType = this.getYesOrNo(order.M_jk_cuffsType);
					order.disp_M_jk_daibaType = this.getYesOrNo(order.M_jk_daibaType);
					order.disp_M_jk_summerType = this.getYesOrNo(order.M_jk_summerType);
					order.disp_M_jk_amfPayType = this.getYesOrNo(order.M_jk_amfPayType);
					order.disp_M_jk_changeButtonType = this.get_jk_changeButtonSel(order, order.M_jk_changeButtonType);
					order.disp_M_jk_cuffsFirst = this.getM_jk_cuffsFirst(order.M_jk_cuffsFirst, order.M_jk_flowerHole);
					if(order.M_jk_cuffsFirst == 1 || order.M_jk_flowerHole == 1){
						order.disp_M_jk_buttonThreadColorSel = this.getM_jk_buttonThreadColorSel(order, order.M_jk_buttonThreadColorSel);
					}
					order.disp_M_jk_changeLiningType = this.get_jk_changeLiningSel(order, order.M_jk_changeLiningType);
				}
				if(base.M_sl == 1){
					// メンズスラックス
					order.disp_M_sl_style = order.slStyleObj.name;
					order.disp_M_sl_size = this.getSize(orderType, order.slSize1Obj.name, order.slSize2Obj.name);
					order.disp_M_sl_bottomType = this.getM_sl_bottomType(order.M_sl_bottomType);
					order.disp_M_sl_bottom = this.getSign(order.M_sl_bottom);
					order.disp_M_sl_lengthLeft = this.getSign(order.M_sl_lengthLeft);
					order.disp_M_sl_lengthRight = this.getSign(order.M_sl_lengthRight);
					order.disp_M_sl_weist = this.getSign(order.M_sl_weist);
					order.disp_M_sl_adjuster = this.getYesOrNo(order.M_sl_adjuster);
					order.disp_M_sl_changeButtonType = this.get_sl_changeButtonSel(order, order.M_sl_changeButtonType);
					order.disp_M_sl_spareType = this.getYesOrNo2(order.M_sl_spareType);
					order.disp_M_sl_bottomSpareType = this.getM_sl_bottomType(order.M_sl_bottomSpareType);
					order.disp_M_sl_bottomSpare = this.getSign(order.M_sl_bottomSpare);
					order.disp_M_sl_lengthLeftSpare = this.getSign(order.M_sl_lengthLeft);
					order.disp_M_sl_lengthRightSpare = this.getSign(order.M_sl_lengthRight);
					order.disp_M_sl_adjusterSpare = this.getYesOrNo(order.M_sl_adjusterSpare);
				}
				if(base.M_ve == 1){
					// メンズベスト
					order.disp_M_ve_style = order.veStyleObj.name;
					order.disp_M_ve_size = this.getSize(orderType, order.veSize1Obj.name, order.veSize2Obj.name);
					order.disp_M_ve_trunk = this.getSign(order.M_ve_trunk);
					order.disp_M_ve_amfType = this.getYesOrNo(order.M_ve_amfType);
					order.disp_M_ve_amfPayType = this.getYesOrNo(order.M_ve_amfPayType);
					order.disp_M_ve_changeButtonSel = this.get_ve_changeButtonSel(order, order.M_ve_changeButtonType);
					if (base.M_jk == 1 || base.M_st ==1) {
						order.disp_M_ve_changeLiningSel = this.get_jk_changeLiningSel(order, order.M_jk_changeLiningType);
					} else {
						order.disp_M_ve_changeLiningSel = this.get_ve_changeLiningSel(order, order.M_ve_changeLiningType);
					}
				}
			}
			else if(orderType == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				if(base.L_jk == 1){
					// レディスジャケット
					order.disp_L_jk_style = order.jkStyleObj.name;
					order.disp_L_jk_size = this.getSize(orderType, order.jkSize1Obj.name, null);
					order.disp_L_jk_liningType = this.get_jk_liningType(order.L_jk_liningType);
					order.disp_L_jk_pocketType = this.getYesOrNo2(order.L_jk_pocketType);
					order = this.getName(orderType, order, order.L_jk_nameMakeType);		// ネーム関係
					order.disp_L_jk_armLeft = this.getSign(order.L_jk_armLeft);
					order.disp_L_jk_armRight = this.getSign(order.L_jk_armRight);
					order.disp_L_jk_length = this.getSign(order.L_jk_length);
					order.disp_L_jk_ventType = this.getYesOrNo(order.L_jk_ventType);
					order.disp_L_jk_cuffsType = this.getNameCuffs(order.L_jk_cuffsType);
					order.disp_L_jk_amfType = this.getYesOrNo(order.L_jk_amfType);
					order.disp_L_jk_pocketInnerType = this.getYesOrNo(order.L_jk_pocketInnerType);
					order.disp_L_jk_changeButtonType = this.get_jk_changeButtonSel(order, order.L_jk_changeButtonType);
					order.disp_L_jk_changeLiningType = this.get_jk_changeLiningSel(order, order.L_jk_changeLiningType);
				}
				if(base.L_sk == 1){
					// レディススカート
					order.disp_L_sk_style = order.skStyleObj.name;
					order.disp_L_sk_size = this.getSize(orderType, order.skSize1Obj.name, null);
					order.disp_L_sk_length = this.getSign(order.L_sk_length);
					order.disp_L_sk_waist = this.getSign(order.L_sk_waist);
				}
				if(base.L_sl == 1){
					// レディススラックス
					order.disp_L_sl_style = order.slStyleObj.name;
					order.disp_L_sl_size = this.getSize(orderType, order.slSize1Obj.name, null);
					order.disp_L_sl_bottomType = this.getL_sl_bottomType(order.L_sl_bottomType);
					order.disp_L_sl_lengthLeft = this.getSign(order.L_sl_lengthLeft);
					order.disp_L_sl_lengthRight = this.getSign(order.L_sl_lengthRight);
					order.disp_L_sl_waist = this.getSign(order.L_sl_waist);
					order.disp_L_sl_bottomWidth = this.getSign(order.L_sl_bottomWidth);
					order.disp_L_sl_changeButtonType = this.get_sl_changeButtonSel(order, order.L_sl_changeButtonType);
				}
				if(base.L_ve == 1){
					// レディスベスト
					order.disp_L_ve_style = order.veStyleObj.name;
					order.disp_L_ve_size = this.getSize(orderType, order.veSize1Obj.name, null);
					order.disp_L_ve_pocketType = this.getYesOrNo2(order.L_ve_pocketType);
					order.disp_L_ve_length = this.getSign(order.L_ve_length);
					order.disp_L_ve_amfType = this.getYesOrNo(order.L_ve_amfType);
					order.disp_L_ve_buckleType = this.getYesOrNo(order.L_ve_buckleType);
					order.disp_L_ve_changeButtonType = this.get_ve_changeButtonSel(order, order.L_ve_changeButtonType);
					order.disp_L_ve_changeLiningType = this.get_ve_changeLiningSel(order, order.L_ve_changeLiningType);
				}
			}
			else{

			}

			return order;
		},


		/**
		 * 表示成形共通
		 */
		getYesOrNo:function(type){
			var disp = "";
			if(type == 0){
				disp = "なし";
			}
			else{
				disp = "あり";
			}
			return disp;
		},
		getYesOrNo2:function(type){
			var disp = "";
			if(type == 1){
				disp = "なし";
			}
			else{
				disp = "あり";
			}
			return disp;
		},
		getSign:function(len){
			var disp = "";
			if(len == "" || len == undefined || len == null){
				disp = "±0cm";
			}
			else{
				disp = len + "cm";
			}
			return disp;
		},
		getName:function(type, order, makeType){
			var data = order;
			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				// メンズ
				data = this.setNameSpan(type, data.M_jk_name, data);
				data.disp_M_jk_name = this.getNameSel(type, data.M_jk_name);
				data.disp_M_jk_nameMakeType = this.getNameMake(data.M_jk_nameMakeType);
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				// レディス
				data = this.setNameSpan(type, data.L_jk_name, data);
				data.disp_L_jk_name = this.getNameSel(type, data.L_jk_name);
				data.disp_L_jk_nameMakeType = this.getNameMake(data.L_jk_nameMakeType);
			}
			else{
				// シャツ
				data = this.setNameSpan(type, data.S_name, data);
				data.disp_S_name = this.getNameSel(type, data.S_name);
			}
			return data;
		},
		getNameSel: function(type, sel){
			var disp = "";
			if(type == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				if(sel == amcm_type.AMCM_VAL_SHIRT_NAME_TYPE_FULL){
					disp = "ローマ字(540円)";
				}
				else if(sel == amcm_type.AMCM_VAL_SHIRT_NAME_TYPE_INITIAL){
					disp = "ローマ字イニシャル(540円)";
				}
				else{
					disp = "なし";
				}
			}
			else{
				if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_KANJI){
					disp = "漢字";
				}
				else if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_FULL){
					disp = "ローマ字";
				}
				else if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_INITIAL){
					disp = "ローマ字イニシャル";
				}
				else{
					disp = "なし";
				}
			}
			return disp;
		},
		getNameMake:function(sel){
			var disp = "";
			if(sel == amcm_type.AMCM_VAL_NAME_TYPE_FACT){
				disp = "工場";
			}
			else if(sel == amcm_type.AMCM_VAL_NAME_TYPE_STORE){
				disp = "店舗";
			}
			else{
				disp = "なし";
			}
			return disp;
		},
		getNameCuffs: function(sel) {
			var disp = "";
			if (sel == 0) {
				disp = "開き見せ";
			} else if (sel == 1) {
				disp = "リターンカフス";
			}
			return disp;
		},
		setNameSpan:function(type, sel, order){
			var data = order;
			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_KANJI){
					data = this.setNameSpanKanji(type, data, data.M_jk_nameKanji);
				}
				else if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_FULL){
					data = this.setNameSpanFull(type, data, data.M_jk_nameFull);
				}
				else if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_INITIAL){
					data = this.setNameSpanIni(type, data, data.M_jk_nameIni);
				}
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_KANJI){
					data = this.setNameSpanKanji(type, data, data.L_jk_nameKanji);
				}
				else if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_FULL){
					data = this.setNameSpanFull(type, data, data.L_jk_nameFull);
				}
				else if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_INITIAL){
					data = this.setNameSpanIni(type, data, data.L_jk_nameIni);
				}
			}
			else{
				if(sel == amcm_type.AMCM_VAL_SHIRT_NAME_TYPE_FULL){
					data = this.setNameSpanFull(type, data, data.S_nameFull);
				}
				else if(sel == amcm_type.AMCM_VAL_SHIRT_NAME_TYPE_INITIAL){
					data = this.setNameSpanIni(type, data, data.S_nameIni);
				}
			}

			return data;
		},
		setNameSpanKanji:function(type, order, name){
			var data = order;

			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				data.M_name1 = name.charAt(0);
				data.M_name2 = name.charAt(1);
				data.M_name3 = name.charAt(2);
				data.M_name4 = name.charAt(3);
				data.M_name5 = name.charAt(4);
				data.M_name6 = name.charAt(5);
				data.M_name7 = name.charAt(6);
				data.M_name8 = name.charAt(7);
				data.M_name9 = name.charAt(8);
				data.M_name10 = name.charAt(9);
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				data.L_name1 = name.charAt(0);
				data.L_name2 = name.charAt(1);
				data.L_name3 = name.charAt(2);
				data.L_name4 = name.charAt(3);
				data.L_name5 = name.charAt(4);
				data.L_name6 = name.charAt(5);
				data.L_name7 = name.charAt(6);
				data.L_name8 = name.charAt(7);
				data.L_name9 = name.charAt(8);
				data.L_name10 = name.charAt(9);
			}
			else{

			}
			return data;
		},
		setNameSpanFull:function(type, order, name){
			var data = order;

			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				data.M_name1 = name.charAt(0);
				data.M_name2 = name.charAt(1);
				data.M_name3 = name.charAt(2);
				data.M_name4 = name.charAt(3);
				data.M_name5 = name.charAt(4);
				data.M_name6 = name.charAt(5);
				data.M_name7 = name.charAt(6);
				data.M_name8 = name.charAt(7);
				data.M_name9 = name.charAt(8);
				data.M_name10 = name.charAt(9);
				data.M_name11 = name.charAt(10);
				data.M_name12 = name.charAt(11);
				data.M_name13 = name.charAt(12);
				data.M_name14 = name.charAt(13);
				data.M_name15 = name.charAt(14);
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				data.L_name1 = name.charAt(0);
				data.L_name2 = name.charAt(1);
				data.L_name3 = name.charAt(2);
				data.L_name4 = name.charAt(3);
				data.L_name5 = name.charAt(4);
				data.L_name6 = name.charAt(5);
				data.L_name7 = name.charAt(6);
				data.L_name8 = name.charAt(7);
				data.L_name9 = name.charAt(8);
				data.L_name10 = name.charAt(9);
				data.L_name11 = name.charAt(10);
				data.L_name12 = name.charAt(11);
				data.L_name13 = name.charAt(12);
				data.L_name14 = name.charAt(13);
				data.L_name15 = name.charAt(14);
			}
			else{
				data.S_name1 = name.charAt(0);
				data.S_name2 = name.charAt(1);
				data.S_name3 = name.charAt(2);
				data.S_name4 = name.charAt(3);
				data.S_name5 = name.charAt(4);
				data.S_name6 = name.charAt(5);
				data.S_name7 = name.charAt(6);
				data.S_name8 = name.charAt(7);
				data.S_name9 = name.charAt(8);
				data.S_name10 = name.charAt(9);
				data.S_name11 = name.charAt(10);
				data.S_name12 = name.charAt(11);
			}
			return data;
		},
		setNameSpanIni:function(type, order, name){
			var data = order;

			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				data.M_name1 = name.charAt(0);
				data.M_name2 = name.charAt(1);
				data.M_name3 = name.charAt(2);
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				data.L_name1 = name.charAt(0);
				data.L_name2 = name.charAt(1);
				data.L_name3 = name.charAt(2);
			}
			else{
				data.S_name1 = name.charAt(0);
				data.S_name2 = name.charAt(1);
				data.S_name3 = name.charAt(2);
			}

			return data;
		},
		getSize:function(type, size1, size2){
			var disp = "";
			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				// メンズならA体5号とか
				disp = size1 + "体" + size2 + "号";
			}
			else if(isNaN(size1) == false){
				disp = size1 + "号";
			}
			else{
				// SMLとか
				disp = size1;
			}
			return disp;
		},
		// メンズ情報成形関数
		getM_jk_ventType:function(type){
			var disp = "";
			if(type == amcm_type.AMCM_VAL_BENT_TYPE_NONE){
				disp = "ノーベント";
			}
			else if(type == amcm_type.AMCM_VAL_BENT_TYPE_SIDE){
				disp = "サイドベンツ";
			}
			else{
				disp = "センターベント";
			}
			return disp;
		},
		get_jk_liningType:function(type){
			var disp = "";
			if(type == amcm_type.AMCM_VAL_BACK_FABRIC_TYPE_LINING){
				disp = "総裏";
			}
			else if(type == amcm_type.AMCM_VAL_BACK_FABRIC_TYPE_UNLINED){
				disp = "背抜き";
			}
			else{
				disp = "背抜き観音";
			}
			return disp;
		},
		getM_jk_pocketType:function(type){
			var disp = "";
			if(type == amcm_type.AMCM_VAL_SLANT_POCKET_TYPE_NOT_EXIST){
				disp = "標準ポケット";
			}
			else{
				disp = "スラントポケット";
			}
			return disp;
		},
		get_jk_changeButtonSel:function(order, type){
			var disp = "";
			if(type == 0){
				disp = "なし";
			}
			else{
				disp = order.jkChangeButtonObj.name;
			}
			return disp;
		},
		get_jk_changeLiningSel:function(order, type){
			var disp = "";
			if(type == 0){
				disp = "なし";
			}
			else{
				disp = order.jkChangeLiningObj.name;
			}
			return disp;
		},
		getM_jk_cuffsFirst:function(cuffs, hole){
			var disp = "なし";
			if(cuffs == 1){
				disp = "切羽袖口第一ボタン";
			}
			if(hole == 1){
				if(cuffs == 1){
					disp = disp + "、フラワーホール";
				}
				else{
					disp = "フラワーホール";
				}
			}
			return disp;
		},
		getM_jk_buttonThreadColorSel:function(order, sel){
			var disp = "";
			if(sel == 0){
				disp = "なし";
			}
			else{
				disp = order.jkButtonThreadColorSelObj.name;
			}
			return disp;
		},
		getM_sl_bottomType:function(type){
			var disp = "";
			if(type == amcm_type.AMCM_VAL_COATTAIL_TYPE_SINGLE){
				disp = "シングル";
			}
			else if(type == amcm_type.AMCM_VAL_COATTAIL_TYPE_DOUBLE){
				disp = "ダブル";
			}
			else if(type == amcm_type.AMCM_VAL_COATTAIL_TYPE_MORNING){
				disp = "モーニング";
			}
			else{
				disp = "丈上げなし";
			}
			return disp;
		},
		get_sl_changeButtonSel:function(order, type){
			var disp = "";
			if(type == 0){
				disp = "なし";
			}
			else{
				disp = order.slChangeButtonObj.name;
			}
			return disp;
		},
		get_ve_changeButtonSel:function(order, type){
			var disp = "";
			if(type == 0){
				disp = "なし";
			}
			else{
				disp = order.veChangeButtonObj.name;
			}
			return disp;
		},
		get_ve_changeLiningSel:function(order, type){
			var disp = "";
			if(type == 0){
				disp = "なし";
			}
			else{
				disp = order.veChangeLiningObj.name;
			}
			return disp;
		},

		getL_sl_bottomType:function(type){
			var disp = "";
			if(type == amcm_type.AMCM_VAL_COATTAIL_TYPE_SINGLE){
				disp = "丈上げあり";
			}
			else{
				disp = "丈上げなし";
			}
			return disp;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			this.getData2view();

			return this;
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
							reqType: 6,
							poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS
						}
				};
				clutil.postJSON('AMPOV0280', srchReq).fail(_.bind(function(data){
					// エラーメッセージを通知。
					clutil.mediator.trigger('onTicker', data);
					_this._hideFooter();
					return ;
				}, this));
//				var storeID = clcom.userInfo.org_id;
//				var storeCode = clcom.userInfo.org_code;
//				var storeName = clcom.userInfo.org_name;
//				if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
//						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
//					this.utl_store.setValue({id: storeID, code: storeCode, name: storeName});
//					clutil.viewReadonly($("#ca_storeID_div"));
//					this.$("#ca_btn_store_select").attr("disabled", true);
//					this.$("#ca_btn_store_select").hide();
//					clutil.setFocus($('#ca_userID'));
//				}else{
//					clutil.setFocus($('#ca_storeID'));
//				}
//				this.changeStore();
//				this.$("#ca_chkVest").attr("disabled", true);
//				$(this.$("#ca_chkVest").closest('label')).addClass("disabled");
			} else {
				this.mdBaseView.fetch();
			}

			return this;
		},

//		Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			var _this = this;
			var msg = "";
			switch(args.status){
			case 'DONE':		// 確定済
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
//					this.$("#ca_no").val(data.AMPOV0280UpdRsp.newNo);

					// T200対応 登録後のメッセージ差分対応 2015/9/5 藤岡
					if(_this.submitType == 0){
						msg = "管理番号 [" + data.AMPOV0280UpdRsp.newNo + "] で発注しました。";
					}
					else{
						msg = "FAXオーダー済の注文を発注しました。";
					}

					clutil.showDialog(msg, function(_this){
						try{
							console.log('OK', arguments);
							//clcom.popPage(true);
							clcom.popPage({f_back:false, arrivalDate:0});
							return;
						}finally{
						}
					},  'wd1', 'txtPrimary',_this);
					$('#cl_dialog_area .cl_ok').html("一覧へ戻る");
				}else if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					//削除
					clutil.MessageDialog2(clmsg.cl_rtype_del_confirm);
					this.returnObj.f_back = false;
				}else{
					// 2015/12/2 MT-879対応
					//それ以外(たぶん更新のみ)
					var sendNo = clutil.view2data($('#ca_noArea')).no;
					var getNo = data.AMPOV0280GetRsp.order.no;

					if(sendNo != getNo){
						// 新しい管理番号に変更された場合
						msg = clmsg.cl_rtype_upd_confirm + "</br>管理番号を [" + getNo + "] に変更しました。";
						clutil.MessageDialog2(msg);
					}
					else{
						clutil.MessageDialog2(clmsg.cl_rtype_upd_confirm);
					}
					// 2015/12/2 MT-879対応 ここまで
					this.returnObj.f_back = false;
				}
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				this.returnObj.f_back = false;
				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				break;
			case 'DELETED':		// 別のユーザによって削除された
				this.returnObj.f_back = false;
				// 全 <input> を readonly 化するなどの処理。
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// 2016/1/6 発注不可商品があった場合に通知
				if(data.AMPOV0280UpdRsp.orderStoppedField != 0){
					this.orderStopWarn(data.AMPOV0280UpdRsp.orderStoppedField);
				}
				// 2016/1/6 ここまで
				// 2016/2/17 店着日が不正
				if(data.AMPOV0280UpdRsp.arrivalDate != 0){
					// 返却項目に、新しい店着日設定
					this.returnObj.f_back = true;
					this.returnObj.arrivalDate = data.AMPOV0280UpdRsp.arrivalDate;
				}
				// 2016/2/17 ここまで
			}
			this.backFooter();
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
			msg = clmsg.EPO0075 + "(" + msg + ")";
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
		/**
		 * フッタを「一覧へ戻る」へ書き換える
		 */
		backFooter:function(){
			opeTypeId = -1;
			var label = '一覧に戻る';
			if(this.returnObj.f_back == true){
				label = '編集画面に戻る';
			}
			// ボタンの内容を設定して表示を変更
			this.mdBaseView.options.opeTypeId = opeTypeId;
			this.mdBaseView.options.btn_cancel.label = label;
			this.mdBaseView.renderFooterNavi();
		},

//TODO
//		GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
//			var tmp = {
//					"ca_no": 100
//			};
//			clutil.data2view($("#ca_no_div"), tmp);
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){

			//this.validator.clear();
			var args = clcom.pageArgs.sendData;

			var baseData = args.baseData;
			var otherData = args.otherData;
			var orderData = args.orderData;
			var submitType = args.submitType;
			var orderType = args.orderType;

			// T200対応 登録後のメッセージ判定用 2015/9/5 藤岡
			this.submitType = args.submitType;

			// その他
			var order = this.makeComOrder(orderType, baseData, orderData, otherData, submitType);
			var other = this.makeComOther(orderType, otherData);
			// メンズ
			var mJacket = this.makeMJacket(orderType, baseData, orderData);
			var mSlacks = this.makeMSlacks(orderType, baseData, orderData);
			var mVest = this.makeMVest(orderType, baseData, orderData);

			// レディス
			var lModel = this.makeLModel(orderType, baseData, orderData);
			var lJacket = this.makeLJacket(orderType, baseData, orderData);
			var lSkirt = this.makeLSkirt(orderType, baseData, orderData);
			var lPants = this.makeLPants(orderType, baseData, orderData);
			var lVest = this.makeLVest(orderType, baseData, orderData);

			var reqHead = {
					opeTypeId : this.options.opeTypeId,
					recno : order.recno,
					state : order.state
			};
			var updReq = {
					// メンズ
					mJacket  : mJacket,
					mSlacks  : mSlacks,
					mVest  : mVest,
					// レディス
					lModel  : lModel,
					lJacket  : lJacket,
					lSkirt  : lSkirt,
					lPants  : lPants,
					lVest  : lVest,
					// その他
					order  : order,
					other  : other
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}
			var reqObj = {
					reqHead : reqHead,
					AMPOV0280UpdReq  : updReq
			};

			return {
				//resId: clcom.pageId,
				resId: "AMPOV0280",
				data:  reqObj,
			};

		},

		/**
		 * その他情報作成
		 */
		makeComOrder:function(orderType, baseData, orderData, otherData, submitType){
			// 過去フラグ
			var pastFlag = 0;
			if(submitType == 1){
				pastFlag = 1;
			}
			// 編集不可フラグ
			var notEditFlag = 0;
//			if(){
//				// 締時間5分前後？
//				notEditFlag = 1;
//			}

			var obj = {
					// レコード情報
					recno: baseData.recno,
					state: baseData.state,
					poOrderID: baseData.poOrderID,
					firstID: baseData.firstID,
					// 共通項目
					poTypeID: orderType,
					storeID: baseData._view2data_storeID_cn.id,
					no: otherData.no,
					// 日付情報
					orderDate: otherData.orderDate,
					arrivalDate: otherData.arrivalDate,
					saleDate: otherData.saleDate,
					// 顧客情報
					telNo1: baseData.telNo1,
					telNo2: baseData.telNo2,
					telNo3: baseData.telNo3,
					custName: baseData.custName,
					custNameKana: baseData.custNameKana,
					membNo: baseData.membNo,
					// 担当者情報
					userID:baseData._view2data_userID_cn.id,
					// 更新フラグ等
					pastFlag: pastFlag,
					notEditFlag: notEditFlag,

					// 各区分情報
					brandID:baseData.brandObj.id,
					brandCode:baseData.brandObj.code,
					clothIDID:baseData.clothObj.id,
					price:baseData.clothObj.price,
					seasonID: baseData.seasonObj.id
			};

			if(orderType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				//obj.seasonID = baseData.seasonObj.id;
				obj.washable = baseData.M_wash;
				obj.targetFlagSuits = baseData.M_st;
				obj.targetFlagJK = baseData.M_jk;
				obj.targetFlagSL = baseData.M_sl;
				obj.targetFlagVest = baseData.M_ve;

			}

			return obj;
		},
		makeComOther:function(orderType, otherData){
			var obj = {
					otStoreAdjTypeID:otherData.otStoreAdjTypeID,
					otRcptNo:otherData.otRcptNo,
					otStoreMemo:otherData.otStoreMemo
			};
			return obj;
		},

		/**
		 * メンズ情報作成
		 */
		makeMJacket:function(orderType, baseData, orderData){
			var obj = {};
			if(orderType != amcm_type.AMCM_VAL_PO_CLASS_MENS
					|| (baseData.M_st != 1 && baseData.M_jk != 1)){
				return obj;
			}

			obj = {
					styleID: orderData.M_jk_style,
					sizeID: orderData.M_jk_size2,
					sizeRow: orderData.M_jk_size1,
					sizeColumn: orderData.M_jk_size2,

					jkVentTypeID: orderData.M_jk_ventType,
					jkLiningTypeID: orderData.M_jk_liningType,
					jkAmfTypeID: orderData.M_jk_amfType,
					jkButtonTypeID: orderData.M_jk_layerButtonType,
					jkSlantPocketTypeID: orderData.M_jk_pocketType,
					jkNameTypeID: orderData.M_jk_name,
					jkName: this.getCustName(orderType, orderData.M_jk_name, orderData),
					jkNameFlagTypeID: orderData.M_jk_nameMakeType,
					jkLSleeveAdjLen: orderData.M_jk_armLeft,
					jkLSleeveAdjTypeID: 0,
					jkRSleeveAdjLen: orderData.M_jk_armRigth,
					jkRSleeveAdjTypeID: 0,
					jkAdjLen: orderData.M_jk_length,
					jkAdjTypeID: 0,
					jkTrunkAdjLen: orderData.M_jk_trunk,
					jkTrunkAdjTypeID: 0,

					jkSleeveButton: orderData.M_jk_sleeveButtonType,
					jkChangePocket: orderData.M_jk_changePocketType,
					jkCuffs: orderData.M_jk_cuffsType,
					jkAmfStitch: orderData.M_jk_amfPayType,
					jkChangeButton: this.getType2ID(orderType, TYPE.JK, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
														, orderData.M_jk_changeButtonType, orderData),
					jkOdaiba: orderData.M_jk_daibaType,
					jkChangeLining: this.getType2ID(orderType, TYPE.JK, amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
														, orderData.M_jk_changeLiningType, orderData),
					jkSummerType: orderData.M_jk_summerType,
					jkCuffs1stButton: this.getButtonHole(orderType, orderData.M_jk_cuffsFirst, orderData),
					jkFlowerHole: this.getButtonHole(orderType, orderData.M_jk_flowerHole, orderData)
			};
			return obj;
		},
		makeMSlacks:function(orderType, baseData, orderData){
			var obj = {};
			if(orderType != amcm_type.AMCM_VAL_PO_CLASS_MENS
					|| (baseData.M_st != 1 && baseData.M_sl != 1)){
				return obj;
			}

			obj = {
					styleID: orderData.M_sl_style,
					sizeID: orderData.M_sl_size2,
					sizeRow: orderData.M_sl_size1,
					sizeColumn: orderData.M_sl_size2,

					slSpareTypeID:orderData.M_sl_spareType,
					slLLegLen:orderData.M_sl_lengthLeft,
					slRLegLen:orderData.M_sl_lengthRight,
					slBtmTypeID:orderData.M_sl_bottomType,
					slBtmLen:orderData.M_sl_bottom,
					slSpareBtmTypeID:orderData.M_sl_bottomSpareType,
					slSpareBtmLen:orderData.M_sl_bottomSpare,
					slWaistAdjLen:orderData.M_sl_weist,
					slWaistAdjTypeID:0,
					slAdjuster:orderData.M_sl_adjuster,
					slSpareAdjuster:orderData.M_sl_adjusterSpare,
					slChangeButton:this.getType2ID(orderType, TYPE.SL, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
													, orderData.M_sl_changeButtonType, orderData),
			};
			return obj;
		},
		makeMVest:function(orderType, baseData, orderData){
			var obj = {};
			if(orderType != amcm_type.AMCM_VAL_PO_CLASS_MENS || baseData.M_ve != 1){
				return obj;
			}

			obj = {
					styleID: orderData.M_ve_style,
					sizeID: orderData.M_ve_size2,
					sizeRow: orderData.M_ve_size1,
					sizeColumn: orderData.M_ve_size2,

					veTrunkAdjLen:orderData.M_ve_trunk,
					veTrunkAdjTypeID:0,
					veChangeButton:this.getType2ID(orderType, TYPE.VE, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
														, orderData.M_ve_changeButtonType, orderData),
					veChangeLining:this.getType2ID(orderType, TYPE.VE, amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
														, orderData.M_ve_changeLiningType, orderData),
					veOptAmfStitch:orderData.M_ve_amfPayType,
					veFreeOptAmfStitch:orderData.M_ve_amfType
			};
			return obj;
		},



		/**
		 * レディス情報作成
		 */
		makeLModel:function(orderType, baseData, orderData){
			var obj = {};
			if(orderType != amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				return obj;
			}

			obj = {
					jacket:{
						modelID:baseData.L_jkType,
					},
					skirt:{
						modelID:baseData.L_skType,
					},
					pants:{
						modelID:baseData.L_slType,
					},
			};
			return obj;
		},
		makeLJacket:function(orderType, baseData, orderData){
			var obj = {};
			if(orderType != amcm_type.AMCM_VAL_PO_CLASS_LADYS || baseData.L_jk != 1){
				return obj;
			}

			obj = {
					styleID:orderData.L_jk_style,
					sizeID:orderData.L_jk_size,

					jkLiningTypeID:orderData.L_jk_liningType,
					jkChestPocketTypeID:orderData.L_jk_pocketType,
					jkNameTypeID:orderData.L_jk_name,
					jkName: this.getCustName(orderType, orderData.L_jk_name, orderData),
					jkNameFlagTypeID:orderData.L_jk_nameMakeType,
					jkLSleeveAdjLen:orderData.L_jk_armLeft,
					jkRSleeveAdjLen:orderData.L_jk_armRight,
					jkAdjLen:orderData.L_jk_length,
					jkChangeButton: this.getType2ID(orderType, TYPE.L_JK, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
							, orderData.L_jk_changeButtonType, orderData),
					jkChangeLining: this.getType2ID(orderType, TYPE.L_JK, amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
							, orderData.L_jk_changeLiningType, orderData),
					jkAmfStitch:orderData.L_jk_amfType,
					jkVent:orderData.L_jk_ventType,
					jkSleeveDesign:orderData.L_jk_cuffsType,
					jkInsidePocket:orderData.L_jk_pocketInnerType
			};
			return obj;
		},
		makeLSkirt:function(orderType, baseData, orderData){
			var obj = {};
			if(orderType != amcm_type.AMCM_VAL_PO_CLASS_LADYS || baseData.L_sk != 1){
				return obj;
			}

			obj = {
					styleID:orderData.L_sk_style,
					sizeID:orderData.L_sk_size,

					skSpareTypeID:0,
					skWaistAdjLen:orderData.L_sk_waist,
					skAdjLen:orderData.L_sk_length
			};
			return obj;
		},
		makeLPants:function(orderType, baseData, orderData){
			var obj = {};
			if(orderType != amcm_type.AMCM_VAL_PO_CLASS_LADYS || baseData.L_sl != 1){
				return obj;
			}

			obj = {
					styleID:orderData.L_sl_style,
					sizeID:orderData.L_sl_size,

					paSpareTypeID:0,
					paLLegLen:orderData.L_sl_lengthLeft,
					paRLegLen:orderData.L_sl_lengthRight,
					paLWidthAdjLen:orderData.L_sl_bottomWidth,
					paRWidthAdjLen:orderData.L_sl_bottomWidth,
					paWaistAdjLen:orderData.L_sl_waist,
					paChangeButton: this.getType2ID(orderType, TYPE.L_SL, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
							, orderData.L_sl_changeButtonType, orderData)
			};
			return obj;
		},
		makeLVest:function(orderType, baseData, orderData){
			var obj = {};
			if(orderType != amcm_type.AMCM_VAL_PO_CLASS_LADYS || baseData.L_ve != 1){
				return obj;
			}

			obj = {
					styleID:orderData.L_ve_style,
					sizeID:orderData.L_ve_size,

					veChestPocketTypeID:orderData.L_ve_pocketType,
					veAdjLen:orderData.L_ve_length,
					veChangeButton: this.getType2ID(orderType, TYPE.L_VE, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE
							, orderData.L_ve_changeButtonType, orderData),
					veChangeLining: this.getType2ID(orderType, TYPE.L_VE, amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE
							, orderData.L_ve_changeLiningType, orderData),
					veBuckle:orderData.L_ve_buckleType,
					veAmfStitch:orderData.L_ve_amfType
			};
			return obj;
		},

		getType2ID:function(type, chk, kind, val, order){
			var id = 0;
			if(val != 0){
				if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
					if(kind == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE){
						// ボタン変更
						if(chk == TYPE.JK){
							id = order.M_jk_changeButtonSel;
						}
						else if(chk == TYPE.SL){
							id = order.M_sl_changeButtonSel;
						}
						else if(chk == TYPE.VE){
							id = order.M_ve_changeButtonSel;
						}
					}
					else if(kind == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE){
						// 裏地変更
						if(chk == TYPE.JK){
							id = order.M_jk_changeLiningSel;
						}
						else if(chk == TYPE.VE){
							id = order.M_ve_changeLiningSel;
						}
					}
				}
				else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
					if(kind == amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE){
						// ボタン変更
						if(chk == TYPE.L_JK){
							id = order.L_jk_changeButtonSel;
						}
						else if(chk == TYPE.L_SL){
							id = order.L_sl_changeButtonSel;
						}
						else if(chk == TYPE.L_VE){
							id = order.L_ve_changeButtonSel;
						}
					}
					else if(kind == amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE){
						// 裏地変更
						if(chk == TYPE.L_JK){
							id = order.L_jk_changeLiningSel;
						}
						else if(chk == TYPE.L_VE){
							id = order.L_ve_changeLiningSel;
						}
					}
				}
			}
			return id;
		},
		getButtonHole:function(type, val, order){
			var id = 0;
			if(val != 0){
				id = order.M_jk_buttonThreadColorSel;
			}
			return id;
		},


		getCustName:function(type, sel, order){
			var name = "";
			if(type == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_KANJI){
					name = order.M_jk_nameKanji;
				}
				else if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_FULL){
					name = order.M_jk_nameFull;
				}
				else if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_INITIAL){
					name = order.M_jk_nameIni;
				}
			}
			else if(type == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_KANJI){
					name = order.L_jk_nameKanji;
				}
				else if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_FULL){
					name = order.L_jk_nameFull;
				}
				else if(sel == amcm_type.AMCM_VAL_PO_NAME_TYPE_INITIAL){
					name = order.L_jk_nameIni;
				}
			}
			else{
				if(sel == amcm_type.AMCM_VAL_SHIRT_NAME_TYPE_FULL){
					name = order.S_nameFull;
				}
				else if(sel == amcm_type.AMCM_VAL_SHIRT_NAME_TYPE_INITIAL){
					name = order.S_nameIni;
				}
			}
			return name;
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


//	初期データを取る
	clutil.getIniJSON(null, null).done(function(data, dataType) {
		ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
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
});
