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
			"toggle input[name='ca_orderType']:radio"	: "_onOrderTypeToggle",		// 対象ラジオボタン変更
			"change #ca_chkVest"	: "_onVestChange",								// ベスト変更
			"change #ca_InsOldDate"	: "_onInsOldDateChange",						// 過去日変更
			"change #ca_brandID" 	: "_BrandTypeChange",							// ブランド変更
			"change #ca_clothIDID" 	: "_clothIDIDChange",							// 生地ID変更
			"change #ca_washable" 	: "_washableChange",							// ウォッシャブル変更
			"change #ca_jkStyle" 	: "_styleChangJK",								// ジャケットスタイル変更
			"change #ca_slStyle" 	: "_styleChangSL",								// スラックススタイル変更
			"change #ca_slSpareTypeID" 	: "_slSpareTypeIDChang",					// スペア指定変更
			"change #ca_slBtmTypeID" 	: "_slBtmTypeIDChang",						// ボタン種変更
			"change #ca_slSpareBtmTypeID" 	: "_slSpareBtmTypeIDChang",				// スペアボタン種変更
			"change #ca_veStyle" 	: "_styleChangVE",								// ベストスタイル変更
			"click #ca_btn_store_select"				: "_onStoreSelClick",		// 店舗選択
			"click #ca_btn_guest_select"				: "_onGuestSelClick",		// お客様情報取得
//			"clDatepickerOnSelect #ca_orderDate" : "doSrcharrivalDate",	//注文日変更
//			"change #ca_orderDate" : "doSrcharrivalDate",	//注文日変更
			"clDatepickerOnSelect #ca_orderDate" : "changeStore",					//注文日変更
			"change #ca_orderDate" : "changeStore",									//店舗変更
			"blur  #ca_otStoreMemo" : "chkOtstoreMemo",
			"clDatepickerOnSelect #ca_InsOldDateInput" : "_onInsOldDateInputChange",//注文日変更
			"change #ca_InsOldDateInput" : "_onInsOldDateInputChange"				//注文日変更
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
						title: 'POメンズ発注登録',
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
			this.listenTo(this.utl_store, "change", this.changeStore);

			//担当者
			this.utl_staff = clutil.clstaffcode2($("#ca_userID"));

			// 補正区分
			clutil.cltypeselector(this.$("#ca_jkLSleeveAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_jkRSleeveAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_jkAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_jkTrunkAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_slWaistAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			clutil.cltypeselector(this.$("#ca_veTrunkAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_TYPE);
			//店舗補正区分
			clutil.cltypeselector(this.$("#ca_otStoreAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_AT_STORE);
			//ベント
			clutil.cltypeselector(this.$("#ca_jkVentTypeID"), amcm_type.AMCM_TYPE_BENT_TYPE);
			//裏地
			clutil.cltypeselector(this.$("#ca_jkLiningTypeID"), amcm_type.AMCM_TYPE_BACK_FABRIC_TYPE);
			//AMF
			clutil.cltypeselector(this.$("#ca_jkAmfTypeID"), amcm_type.AMCM_TYPE_AMF_TYPE);
			//重ねボタン
			clutil.cltypeselector(this.$("#ca_jkButtonTypeID"), amcm_type.AMCM_TYPE_OVERLAP_BUTTON_TYPE);
			//スラントポケット
			clutil.cltypeselector(this.$("#ca_jkSlantPocketTypeID"), amcm_type.AMCM_TYPE_SLANT_POCKET_TYPE);
			//ネーム
			clutil.cltypeselector(this.$("#ca_jkNameTypeID"), amcm_type.AMCM_TYPE_NAME_TYPE);
			//スペア
			clutil.cltypeselector(this.$("#ca_slSpareTypeID"), amcm_type.AMCM_TYPE_SPARE_TYPE);
			//裾仕上
			clutil.cltypeselector(this.$("#ca_slBtmTypeID"), amcm_type.AMCM_TYPE_COATTAIL_TYPE);
			//スペア裾仕上
			clutil.cltypeselector(this.$("#ca_slSpareBtmTypeID"), amcm_type.AMCM_TYPE_COATTAIL_TYPE);

			$("#tp_InsOldDateInput").tooltip({html: true});
			//$("#tp_washable").tooltip({html: true});
			$("#tp_tel").tooltip({html: true});
			$("#tp_jkLSleeveAdjTypeID").tooltip({html: true});
			$("#tp_jkRSleeveAdjTypeID").tooltip({html: true});
			$("#tp_jkAdjTypeID").tooltip({html: true});
			$("#tp_jkTrunkAdjTypeID").tooltip({html: true});
			$("#tp_jkSleeveButton").tooltip({html: true});
			$("#tp_slWaistAdjTypeID").tooltip({html: true});
			$("#tp_veTrunkAdjTypeID").tooltip({html: true});

			var $orderDate = clutil.datepicker(this.$("#ca_orderDate"));
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


			// 新規登録、編集時にプレースホルダ—表示
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				var name_message = "漢字または半角ローマ字でネームを入力";
				$("#ca_jkName").attr("placeholder", name_message);
			}

			this.initUIElement_AMPAV0010();
			return this;
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
					var d = myView.changeStore();
					d.done(function(){
						clutil.setFocus(myView.$('#ca_btn_store_select'));
					});
				}, this);
			},this);

		},
		render: function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				//編集可能時間のチェック
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
//				this.changeStore();
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
				this.changeStore();
//				this.$("#ca_chkVest").removeAttr("disabled");
//				$(this.$("#ca_chkVest").closest('label')).removeClass("disabled");
				this.$("#ca_chkVest").attr("disabled", true);
				$(this.$("#ca_chkVest").closest('label')).addClass("disabled");
			} else {
				this.mdBaseView.fetch();	// 新規だろうとなんだろうとデータを GET してくる。
			}
			
			return this;
		},
		/**
		 * 対象ラジオボタン変更
		 * 各スタイル・サイズの必須チェックの制御もここで行う。必須マックは消さない
		 */

		_onOrderTypeToggle: function(e){
			var $target = $(e.target);
			if(!$target.attr("checked")){
				return;
			}
			// チェックが入ったときだけ処理する
//			clutil.blockUI();

			_.defer(_.bind(function(){
				this._onOrderTypeChange();
				this._clothIDIDChange();
//				clutil.unblockUI();
			}, this));
		},
		_onOrderTypeChange: function(){
//			clutil.blockUI();
			if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null || this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
				//店舗が決まっていない場合は全部使用不可
				this.jacketReadOnly(true);
				this.slacsReadOnly(true);
				this.vestReadOnly(true);
				return;
			}
			if( this.$("#ca_brandID").val() == null || this.$("#ca_brandID").val()  <= 0){
				//ブランドも決まっていない場合は使用不可
				this.jacketReadOnly(true);
				this.slacsReadOnly(true);
				this.vestReadOnly(true);
				return;
			}


			var $check = this.$("#ca_chkVest");
			var isChecked = $check.attr("checked");

			var radio = $("input:radio[name=ca_orderType]:checked");
			var val = radio.val();
			this._clearAllForm(-1);
			if(!isChecked){
				this.vestReadOnly(true);
			}
			if (val == '1') {
				//空白行があるので1以下
				if(this.$("#ca_veStyle").find("option").length <= 1){
					this.$("#ca_chkVest").closest("label").removeClass("checked");
					this.$("#ca_chkVest").removeAttr("checked");
					this.$("#ca_chkVest").attr("disabled", true);
					$(this.$("#ca_chkVest").closest('label')).addClass("disabled");
					this.vestReadOnly(true);
				}else{
					this.$("#ca_chkVest").removeAttr("disabled");
					$(this.$("#ca_chkVest").closest('label')).removeClass("disabled");
				}
				if( this.$("#ca_jkStyle").val() == null
						|| this.$("#ca_jkStyle").val()  <= 0
						|| this.$("#ca_slStyle").val() == null
						|| this.$("#ca_slStyle").val()  <= 0
				){
					if( this.$("#ca_jkStyle").val() == null || this.$("#ca_jkStyle").val()  <= 0){
						//スタイルが決まっていない場合も使用不可
						this.jacketReadOnly(true);
						//空欄しかない場合はそのままreadonly
						if(this.$("#ca_jkStyle").find("option").length >1){
							clutil.viewRemoveReadonly(this.$("#ca_jkStyle_div"));
							$("#ca_jkStyle_autofill").show();
						}
						$("#ca_jkStyle").addClass("cl_required");
						$("#ca_jkSize").addClass("cl_required");
						$("#ca_jkVentTypeID").addClass("cl_required");
						$("#ca_jkLiningTypeID").addClass("cl_required");
						$("#ca_jkAmfTypeID").addClass("cl_required");
						$("#ca_jkButtonTypeID").addClass("cl_required");
						$("#ca_jkSlantPocketTypeID").addClass("cl_required");
						$("#ca_jkNameTypeID").addClass("cl_required");
					}else{
						this.jacketReadOnly(false);
					}
					if( this.$("#ca_slStyle").val() == null || this.$("#ca_slStyle").val()  <= 0){
						//スタイルが決まっていない場合も使用不可
						this.slacsReadOnly(true);
						//空欄しかない場合はそのままreadonly
						if(this.$("#ca_slStyle").find("option").length >1){
							clutil.viewRemoveReadonly(this.$("#ca_slStyle_div"));
							$("#ca_slStyle_autofill").show();
						}
						$("#ca_slStyle").addClass("cl_required");
						$("#ca_slSize").addClass("cl_required");
					}else{
						this.slacsReadOnly(false);
						this._slBtmTypeIDChang();
						this._slSpareBtmTypeIDChang();
						this._slSpareTypeIDChang();
					}
					return;
				}
				//スーツ
				this.jacketReadOnly(false);
				this.slacsReadOnly(false);
				this._slBtmTypeIDChang();
				this._slSpareBtmTypeIDChang();
				this._slSpareTypeIDChang();
			} else if (val == '2') {
				//空白行があるので1以下
				if(this.$("#ca_veStyle").find("option").length <= 1){
					this.$("#ca_chkVest").closest("label").removeClass("checked");
					this.$("#ca_chkVest").removeAttr("checked");
					this.$("#ca_chkVest").attr("disabled", true);
					$(this.$("#ca_chkVest").closest('label')).addClass("disabled");
					this.vestReadOnly(true);
				}else{
					this.$("#ca_chkVest").removeAttr("disabled");
					$(this.$("#ca_chkVest").closest('label')).removeClass("disabled");
				}
				if( this.$("#ca_jkStyle").val() == null || this.$("#ca_jkStyle").val()  <= 0){
					//スタイルが決まっていない場合も使用不可
					this.jacketReadOnly(true);
					this.slacsReadOnly(true);
					//空欄しかない場合はそのままreadonly
					if(this.$("#ca_jkStyle").find("option").length >1){
						clutil.viewRemoveReadonly(this.$("#ca_jkStyle_div"));
						$("#ca_jkStyle_autofill").show();
					}
					$("#ca_jkStyle").addClass("cl_required");
					$("#ca_jkSize").addClass("cl_required");
					$("#ca_jkVentTypeID").addClass("cl_required");
					$("#ca_jkLiningTypeID").addClass("cl_required");
					$("#ca_jkAmfTypeID").addClass("cl_required");
					$("#ca_jkButtonTypeID").addClass("cl_required");
					$("#ca_jkSlantPocketTypeID").addClass("cl_required");
					$("#ca_jkNameTypeID").addClass("cl_required");
					return;
				}
				//ジャケット
				this.jacketReadOnly(false);
				this.slacsReadOnly(true);
			} else if (val == '3') {
				//空白行があるので1以下
				if(this.$("#ca_veStyle").find("option").length <= 1){
					this.$("#ca_chkVest").closest("label").removeClass("checked");
					this.$("#ca_chkVest").removeAttr("checked");
					this.$("#ca_chkVest").attr("disabled", true);
					$(this.$("#ca_chkVest").closest('label')).addClass("disabled");
					this.vestReadOnly(true);
				}else{
					this.$("#ca_chkVest").removeAttr("disabled");
					$(this.$("#ca_chkVest").closest('label')).removeClass("disabled");
				}
				if( this.$("#ca_slStyle").val() == null || this.$("#ca_slStyle").val()  <= 0){
					//スタイルが決まっていない場合も使用不可
					this.jacketReadOnly(true);
					this.slacsReadOnly(true);
					//空欄しかない場合はそのままreadonly
					if(this.$("#ca_slStyle").find("option").length >1){
						clutil.viewRemoveReadonly(this.$("#ca_slStyle_div"));
						$("#ca_slStyle_autofill").show();
					}
					$("#ca_slStyle").addClass("cl_required");
					$("#ca_slSize").addClass("cl_required");
					return;
				}
				//スラックス
				this.jacketReadOnly(true);
				this.slacsReadOnly(false);
				this._slBtmTypeIDChang();
				this._slSpareBtmTypeIDChang();
				this._slSpareTypeIDChang();
				
			} else if (val == '4') {
				this.$("#ca_chkVest").closest("label").removeClass("checked");
				this.$("#ca_chkVest").removeAttr("checked");
				this.$("#ca_chkVest").attr("disabled", true);
				$(this.$("#ca_chkVest").closest('label')).addClass("disabled");
				if( this.$("#ca_veStyle").val() == null || this.$("#ca_veStyle").val()  <= 0){
					//ベストのスタイルが決まっていない場合も使用不可
					this.vestReadOnly(true);
					//空欄しかない場合はそのままreadonly
					if(this.$("#ca_veStyle").find("option").length >1){
						clutil.viewRemoveReadonly(this.$("#ca_veStyle_div"));
						$("#ca_veStyle_autofill").show();
					}
					$("#ca_veStyle").addClass("cl_required");
					$("#ca_veSize").addClass("cl_required");
				}else{
					this.vestReadOnly(false);
				}
				this.jacketReadOnly(true);
				this.slacsReadOnly(true);
			} else {
				;
			}
		},
		/**
		 * ジャケット・スラックス・ベスト各項目のロック
		 * ロックする際にクリアするので注意
		 */
		jacketReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearJacketForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_jacket_form"));
				$("#ca_jkStyle_autofill").hide();
				$("#ca_jkSize_autofill").hide();
				$("#ca_jkStyle").removeClass("cl_required");
				$("#ca_jkSize").removeClass("cl_required");
				$("#ca_jkVentTypeID").removeClass("cl_required");
				$("#ca_jkLiningTypeID").removeClass("cl_required");
				$("#ca_jkAmfTypeID").removeClass("cl_required");
				$("#ca_jkButtonTypeID").removeClass("cl_required");
				$("#ca_jkSlantPocketTypeID").removeClass("cl_required");
				$("#ca_jkNameTypeID").removeClass("cl_required");
			}else{
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_jacket_form"));
				$("#ca_jkStyle").addClass("cl_required");
				$("#ca_jkSize").addClass("cl_required");
				$("#ca_jkVentTypeID").addClass("cl_required");
				$("#ca_jkLiningTypeID").addClass("cl_required");
				$("#ca_jkAmfTypeID").addClass("cl_required");
				$("#ca_jkButtonTypeID").addClass("cl_required");
				$("#ca_jkSlantPocketTypeID").addClass("cl_required");
				$("#ca_jkNameTypeID").addClass("cl_required");

				if(this.selectorVal2ItemLength('jkSleeveButton') == 0){
					clutil.viewReadonly(this.$("#ca_jkSleeveButton_div"));
				}
				if(this.selectorVal2ItemLength('jkChangePocket') == 0){
					clutil.viewReadonly(this.$("#ca_jkChangePocket_div"));
				}
				if(this.selectorVal2ItemLength('jkCuffs') == 0){
					clutil.viewReadonly(this.$("#ca_jkCuffs_div"));
				}
				if(this.selectorVal2ItemLength('jkAmfStitch') == 0){
					clutil.viewReadonly(this.$("#ca_jkAmfStitch_div"));
				}
				if(this.selectorVal2ItemLength('jkChangeButton') == 0){
					clutil.viewReadonly(this.$("#ca_jkChangeButton_div"));
				}
				if(this.selectorVal2ItemLength('jkOdaiba') == 0){
					clutil.viewReadonly(this.$("#ca_jkOdaiba_div"));
				}
				if(this.selectorVal2ItemLength('jkChangeLining') == 0){
					clutil.viewReadonly(this.$("#ca_jkChangeLining_div"));
				}
				if(this.selectorVal2ItemLength('jkSummerType') == 0){
					clutil.viewReadonly(this.$("#ca_jkSummerType_div"));
				}
				//this.washableLock();
			}
		},
		slacsReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearSlacsForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_slacs_form"));
				$("#ca_slStyle_autofill").hide();
				$("#ca_slSize_autofill").hide();
				$("#ca_slStyle").removeClass("cl_required");
				$("#ca_slSize").removeClass("cl_required");
			}else{
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_slacs_form"));
				$("#ca_slStyle").addClass("cl_required");
				$("#ca_slSize").addClass("cl_required");
				if(this.selectorVal2ItemLength('slAdjuster') == 0){
					clutil.viewReadonly(this.$("#ca_slAdjuster_div"));
				}
				if(this.selectorVal2ItemLength('slSpareAdjuster') == 0){
					clutil.viewReadonly(this.$("#ca_slSpareAdjuster_div"));
				}
				if(this.selectorVal2ItemLength('slChangeButton') == 0){
					clutil.viewReadonly(this.$("#ca_slChangeButton_div"));
				}
				//this.washableLock();
			}
		},
		vestReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearVestForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_vest_form"));
				$("#ca_veStyle_autofill").hide();
				$("#ca_veSize_autofill").hide();
				$("#ca_veStyle").removeClass("cl_required");
				$("#ca_veSize").removeClass("cl_required");
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
				if(this.selectorVal2ItemLength('veOptAmfStitch') == 0){
					clutil.viewReadonly(this.$("#ca_veOptAmfStitch_div"));
				}
				//this.washableLock();
			}
		},
		/*
		washableLock: function(){
			var $washable = this.$("#ca_washable");
			var lock = $washable.attr("checked");
			if(lock){
				//ロック
				this.$("#ca_jkAmfStitch").val("");
				this.$("#ca_jkOdaiba").val("");
				this.$("#ca_jkChangeLining").val("");
				this.$("#ca_jkSummerType").val("");
				this.$("#ca_slAdjuster").val("");
				this.$("#ca_slSpareAdjuster").val("");
				this.$("#ca_veOptAmfStitch").val("");
				this.$("#ca_veChangeLining").val("");
				clutil.viewReadonly(this.$("#ca_jkAmfStitch_div"));
				clutil.viewReadonly(this.$("#ca_jkOdaiba_div"));
				clutil.viewReadonly(this.$("#ca_jkChangeLining_div"));
				clutil.viewReadonly(this.$("#ca_jkSummerType_div"));
				clutil.viewReadonly(this.$("#ca_slAdjuster_div"));
				clutil.viewReadonly(this.$("#ca_slSpareAdjuster_div"));
				clutil.viewReadonly(this.$("#ca_veOptAmfStitch_div"));
				clutil.viewReadonly(this.$("#ca_veChangeLining_div"));

			}else{
				if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null || this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
					//店舗が決まっていない場合は全部使用不可
					return;
				}
				if( this.$("#ca_brandID").val() == null || this.$("#ca_brandID").val()  <= 0){
					//ブランドも決まっていない場合は使用不可
					return;
				}
				//ロック解除
				if( this.$("#ca_jkStyle").val() == null || this.$("#ca_jkStyle").val()  <= 0){
					//スタイルが決まっていない場合も使用不可
				}else{
					if(this.selectorVal2ItemLength('jkAmfStitch') == 0){
						clutil.viewReadonly(this.$("#ca_jkAmfStitch_div"));
					}else{
						clutil.viewRemoveReadonly(this.$("#ca_jkAmfStitch_div"));
					}
					if(this.selectorVal2ItemLength('jkOdaiba') == 0){
						clutil.viewReadonly(this.$("#ca_jkOdaiba_div"));
					}else{
						clutil.viewRemoveReadonly(this.$("#ca_jkOdaiba_div"));
					}
					if(this.selectorVal2ItemLength('jkChangeLining') == 0){
						clutil.viewReadonly(this.$("#ca_jkChangeLining_div"));
					}else{
						clutil.viewRemoveReadonly(this.$("#ca_jkChangeLining_div"));
					}
					if(this.selectorVal2ItemLength('jkSummerType') == 0){
						clutil.viewReadonly(this.$("#ca_jkSummerType_div"));
					}else{
						clutil.viewRemoveReadonly(this.$("#ca_jkSummerType_div"));
					}
				}
				if( this.$("#ca_slStyle").val() == null || this.$("#ca_slStyle").val()  <= 0){
					//スタイルが決まっていない場合も使用不可
				}else{
					if(this.selectorVal2ItemLength('slAdjuster') == 0){
						clutil.viewReadonly(this.$("#ca_slAdjuster_div"));
					}else{
						clutil.viewRemoveReadonly(this.$("#ca_slAdjuster_div"));
					}
					if(this.selectorVal2ItemLength('slSpareAdjuster') == 0){
						clutil.viewReadonly(this.$("#ca_slSpareAdjuster_div"));
					}else{
						clutil.viewRemoveReadonly(this.$("#ca_slSpareAdjuster_div"));
					}
				}
				if( this.$("#ca_veStyle").val() == null || this.$("#ca_veStyle").val()  <= 0){
					//ベストのスタイルが決まっていない場合も使用不可
				}else{
					if(this.selectorVal2ItemLength('veChangeLining') == 0){
						clutil.viewReadonly(this.$("#ca_veChangeLining_div"));
					}else{
						clutil.viewRemoveReadonly(this.$("#ca_veChangeLining_div"));
					}
					if(this.selectorVal2ItemLength('veOptAmfStitch') == 0){
						clutil.viewReadonly(this.$("#ca_veOptAmfStitch_div"));
					}else{
						clutil.viewRemoveReadonly(this.$("#ca_veOptAmfStitch_div"));
					}
				}
			}
		},
		*/
		optionLock: function(lock){
			if(lock){
				//ロック
				this.$("#ca_clothIDID").val("");
				this.$("#ca_jkSleeveButton").val("");
				this.$("#ca_jkChangeLining").val("");
				this.$("#ca_jkCuffs").val("");
				this.$("#ca_jkAmfStitch").val("");
				this.$("#ca_jkChangeButton").val("");
				this.$("#ca_jkOdaiba").val("");
				this.$("#ca_jkChangeLining").val("");
				this.$("#ca_jkSummerType").val("");

				this.$("#ca_slAdjuster").val("");
				this.$("#ca_slSpareAdjuster").val("");
				this.$("#ca_slChangeButton").val("");

				this.$("#ca_veOptAmfStitch").val("");
				this.$("#ca_veChangeLining").val("");
				this.$("#ca_veChangeButton").val("");

				clutil.viewReadonly(this.$("#ca_clothIDID_div"));
				$("#ca_clothNo_autofill").hide();
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

				clutil.viewReadonly(this.$("#ca_veOptAmfStitch_div"));
				clutil.viewReadonly(this.$("#ca_veChangeLining_div"));
				clutil.viewReadonly(this.$("#ca_veChangeButton_div"));
			}else{
//				if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null || this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
//				//店舗が決まっていない場合は全部使用不可
//				return;
//				}
//				if( this.$("#ca_brandID").val() == null || this.$("#ca_brandID").val()  <= 0){
//				//ブランドも決まっていない場合は使用不可
//				return;
//				}
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_clothIDID_div"));
				$("#ca_clothNo_autofill").show();
				var radio = this.$('input:radio[name="ca_orderType"]:checked');
				var val = radio.val();
				if (val == '1') {
					//スーツ
					clutil.viewRemoveReadonly(this.$("#ca_clothIDID_div"));
					$("#ca_clothNo_autofill").show();
					clutil.viewRemoveReadonly(this.$("#ca_jkSleeveButton_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkChangePocket_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkCuffs_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkAmfStitch_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkChangeButton_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkOdaiba_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkChangeLining_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkSummerType_div"));

//					clutil.viewRemoveReadonly(this.$("#ca_slAdjuster_div"));
//					clutil.viewRemoveReadonly(this.$("#ca_slSpareAdjuster_div"));
//					clutil.viewRemoveReadonly(this.$("#ca_slChangeButton_div"));
				}else if (val == '2') {
					clutil.viewRemoveReadonly(this.$("#ca_clothIDID_div"));
					$("#ca_clothNo_autofill").show();
					clutil.viewRemoveReadonly(this.$("#ca_jkSleeveButton_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkChangePocket_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkCuffs_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkAmfStitch_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkChangeButton_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkOdaiba_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkChangeLining_div"));
					clutil.viewRemoveReadonly(this.$("#ca_jkSummerType_div"));
				}else if (val == '3') {
					clutil.viewRemoveReadonly(this.$("#ca_slAdjuster_div"));
					clutil.viewRemoveReadonly(this.$("#ca_slSpareAdjuster_div"));
					clutil.viewRemoveReadonly(this.$("#ca_slChangeButton_div"));
				}
				var $check = this.$("#ca_chkVest");
				var isChecked = $check.attr("checked");
				if (isChecked || val == '4') {
					clutil.viewRemoveReadonly(this.$("#ca_veOptAmfStitch_div"));
					clutil.viewRemoveReadonly(this.$("#ca_veChangeLining_div"));
					clutil.viewRemoveReadonly(this.$("#ca_veChangeButton_div"));
				}
			}
		},
		/**
		 * 対象チェックボタン変更
		 * 期間制御でも入れようかと思ったけど更新データの場合の制御がわからなくなるので
		 */
		// TODO
		_onInsOldDateChange: function(){
			var $check = this.$("#ca_InsOldDate");
			var isChecked = $check.attr("checked");
			var odrday = clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd');
			if (isChecked) {
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
					this.changeStore();
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
			this.changeStore();
		},
		_onVestChange: function(){
			if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null || this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
				this.vestReadOnly(true);
				return;
			}
			if( this.$("#ca_brandID").val() == null || this.$("#ca_brandID").val()  <= 0){
				//ブランドも決まっていない場合は使用不可
				this.vestReadOnly(true);
				return;
			}

			var radio = $("input:radio[name=ca_orderType]:checked");
			var val = radio.val();

			var $check = this.$("#ca_chkVest");
			var isChecked = $check.attr("checked");
			if (isChecked || val == '4') {
				// val == '4'のときこの関数が呼ばれることはまずないんだけどな
				//ベストオン
				if( this.$("#ca_veStyle").val() == null || this.$("#ca_veStyle").val()  <= 0){
					//ベストのスタイルが決まっていない場合も使用不可
					this.vestReadOnly(true);
					//空欄しかない場合はそのままreadonly
					if(this.$("#ca_veStyle").find("option").length >1){
						clutil.viewRemoveReadonly(this.$("#ca_veStyle_div"));
						$("#ca_veStyle_autofill").show();
					}
					$("#ca_veStyle").addClass("cl_required");
					$("#ca_veSize").addClass("cl_required");
				}else{
					this.vestReadOnly(false);
				}
			} else {
				//ベストoff
				this.vestReadOnly(true);
			}
		},

		setReadOnlyAllItems: function(readOnly){
			if (readOnly == true){
				clutil.viewReadonly($("#ca_base_form"));
				clutil.viewReadonly($("#ca_guest_form"));
				clutil.viewReadonly($("#ca_jacket_form"));
				clutil.viewReadonly($("#ca_slacs_form"));
				clutil.viewReadonly($("#ca_vest_form"));
				clutil.viewReadonly($("#ca_other_form"));
				$("#ca_chkVest").closest('label').addClass("disabled");
				$("#ca_chkVest").attr("disabled", true);
				this.$("#ca_InsOldDate").attr("disabled", true);
				$(this.$("#ca_InsOldDate").closest('label')).addClass("disabled");
				$("#ca_brandID_autofill").hide();
				$("#ca_clothNo_autofill").hide();
				$("#ca_jkStyle_autofill").hide();
				$("#ca_jkSize_autofill").hide();
				$("#ca_slStyle_autofill").hide();
				$("#ca_slSize_autofill").hide();
				$("#ca_veStyle_autofill").hide();
				$("#ca_veSize_autofill").hide();


			}else{
				clutil.viewRemoveReadonly($("#ca_base_form"));
				clutil.viewRemoveReadonly($("#ca_guest_form"));
				clutil.viewRemoveReadonly($("#ca_jacket_form"));
				clutil.viewRemoveReadonly($("#ca_slacs_form"));
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
		 * type	:変更箇所
		 */
		_clearAllForm:function(type){
			this._clearBaseForm(type);
			this._clearGuestForm(type);
			this._clearJacketForm(type);
			this._clearSlacsForm(type);
			this._clearVestForm(type);
			this._clearOtherForm(type);
			clutil.initUIelement(this.$el);
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this._onOrderTypeChange();
				this._onVestChange();
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
				//ラジオボタン初期化
				this.$('input:radio[name="ca_orderType"]').each(function(){
					if($(this).val() == 1){
						$(this).attr("checked", "checked");
						$(this).closest("label").addClass("checked", "checked");
					}else{
						$(this).removeAttr("checked");
						$(this).closest("label").removeClass("checked");
					}
				});
				//チェックボックスのチェックを外す
				this.$("#ca_chkVest").closest("label").removeClass("checked");
				this.$("#ca_chkVest").removeAttr("checked");
				this.$("#ca_chkVest").attr("disabled", true);
				$(this.$("#ca_chkVest").closest('label')).addClass("disabled");
				this.$("#ca_washable").closest("label").removeClass("checked");
				this.$("#ca_washable").removeAttr("checked");
				this.$("#ca_clothIDID").val("");
				this.$("#ca_price").val("");
				clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', clcom.getOpeDate());
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
				clutil.datepicker(this.$("#ca_saleDate")).datepicker('setIymd', -1);
			}else if(type == _changeTypeArgs.NEXTITEM){
				//チェックボックスのチェックを外す
				this.$("#ca_InsOldDate").closest("label").removeClass("checked");
				this.$("#ca_InsOldDate").removeAttr("checked");
				this.$("#ca_no").val("");
				this.$("#ca_brandID").val("");
				//ラジオボタン初期化
				this.$('input:radio[name="ca_orderType"]').each(function(){
					if($(this).val() == 1){
						$(this).attr("checked", "checked");
						$(this).closest("label").addClass("checked", "checked");
					}else{
						$(this).removeAttr("checked");
						$(this).closest("label").removeClass("checked");
					}
				});
				//チェックボックスのチェックを外す
				this.$("#ca_chkVest").closest("label").removeClass("checked");
				this.$("#ca_chkVest").removeAttr("checked");
				this.$("#ca_chkVest").attr("disabled", true);
				$(this.$("#ca_chkVest").closest('label')).addClass("disabled");
				this.$("#ca_washable").closest("label").removeClass("checked");
				this.$("#ca_washable").removeAttr("checked");
				this.$("#ca_clothIDID").val("");
				this.$("#ca_price").val("");
				clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', clcom.getOpeDate());
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
				clutil.datepicker(this.$("#ca_saleDate")).datepicker('setIymd', -1);
			}else if(type == _changeTypeArgs.STORE){
				this.$("#ca_brandID").val("");
				this.$("#ca_clothIDID").val("");
				this.$("#ca_price").val("");
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
			}else if(type == _changeTypeArgs.BRAND){
				this.$("#ca_clothIDID").val("");
				this.$("#ca_price").val("");
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
			}else if(type == _changeTypeArgs.CLOTH){
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
			}else if(type == _changeTypeArgs.ORDDAY){
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
			}

		},
		_clearGuestForm:function(type){
			if(type == _changeTypeArgs.ALL){
				this.$("#ca_telNo1").val("");
				this.$("#ca_telNo2").val("");
				this.$("#ca_telNo3").val("");
				this.$("#ca_custName").val("");
				this.$("#ca_custNameKana").val("");
				this.$("#ca_membNo").val("");
			};
		},
		_clearJacketForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_jkStyle").val("");
				this.$("#ca_jkSize").val("");
				this.$("#ca_jkVentTypeID").val("");
				this.$("#ca_jkLiningTypeID").val("");
				this.$("#ca_jkAmfTypeID").val("");
				this.$("#ca_jkButtonTypeID").val("");
				this.$("#ca_jkSlantPocketTypeID").val("");
				this.$("#ca_jkNameTypeID").val("");
				this.$("#ca_jkName").val("");
				this.$("#ca_jkLSleeveAdjLen").val("");
				this.$("#ca_jkLSleeveAdjTypeID").val("");
				this.$("#ca_jkRSleeveAdjLen").val("");
				this.$("#ca_jkRSleeveAdjTypeID").val("");
				this.$("#ca_jkAdjLen").val("");
				this.$("#ca_jkAdjTypeID").val("");
				this.$("#ca_jkTrunkAdjLen").val("");
				this.$("#ca_jkTrunkAdjTypeID").val("");
				this.$("#ca_jkSleeveButton").val("");
				this.$("#ca_jkChangePocket").val("");
				this.$("#ca_jkCuffs").val("");
				this.$("#ca_jkAmfStitch").val("");
				this.$("#ca_jkChangeButton").val("");
				this.$("#ca_jkOdaiba").val("");
				this.$("#ca_jkChangeLining").val("");
				this.$("#ca_jkSummerType").val("");
			}else if( type == _changeTypeArgs.BRAND){
				this.$("#ca_jkStyle").val("");
				this.$("#ca_jkSize").val("");
				this.$("#ca_jkVentTypeID").val("");
				this.$("#ca_jkLiningTypeID").val("");
				this.$("#ca_jkAmfTypeID").val("");
				this.$("#ca_jkButtonTypeID").val("");
				this.$("#ca_jkSlantPocketTypeID").val("");
				this.$("#ca_jkNameTypeID").val("");
				this.$("#ca_jkName").val("");
				this.$("#ca_jkLSleeveAdjLen").val("");
				this.$("#ca_jkLSleeveAdjTypeID").val("");
				this.$("#ca_jkRSleeveAdjLen").val("");
				this.$("#ca_jkRSleeveAdjTypeID").val("");
				this.$("#ca_jkAdjLen").val("");
				this.$("#ca_jkAdjTypeID").val("");
				this.$("#ca_jkTrunkAdjLen").val("");
				this.$("#ca_jkTrunkAdjTypeID").val("");
				this.$("#ca_jkSleeveButton").val("");
				this.$("#ca_jkChangePocket").val("");
				this.$("#ca_jkCuffs").val("");
				this.$("#ca_jkAmfStitch").val("");
				this.$("#ca_jkChangeButton").val("");
				this.$("#ca_jkOdaiba").val("");
				this.$("#ca_jkChangeLining").val("");
				this.$("#ca_jkSummerType").val("");
			}else if( type == _changeTypeArgs.CLOTH){
				this.$("#ca_jkStyle").val("");
				this.$("#ca_jkSize").val("");
//				this.$("#ca_jkVentTypeID").val("");
//				this.$("#ca_jkLiningTypeID").val("");
//				this.$("#ca_jkAmfTypeID").val("");
//				this.$("#ca_jkButtonTypeID").val("");
//				this.$("#ca_jkSlantPocketTypeID").val("");
//				this.$("#ca_jkNameTypeID").val("");
//				this.$("#ca_jkName").val("");
//				this.$("#ca_jkLSleeveAdjLen").val("");
//				this.$("#ca_jkLSleeveAdjTypeID").val("");
//				this.$("#ca_jkRSleeveAdjLen").val("");
//				this.$("#ca_jkRSleeveAdjTypeID").val("");
//				this.$("#ca_jkAdjLen").val("");
//				this.$("#ca_jkAdjTypeID").val("");
//				this.$("#ca_jkTrunkAdjLen").val("");
//				this.$("#ca_jkTrunkAdjTypeID").val("");
//				this.$("#ca_jkSleeveButton").val("");
//				this.$("#ca_jkChangePocket").val("");
//				this.$("#ca_jkCuffs").val("");
//				this.$("#ca_jkAmfStitch").val("");
//				this.$("#ca_jkChangeButton").val("");
//				this.$("#ca_jkOdaiba").val("");
//				this.$("#ca_jkChangeLining").val("");
//				this.$("#ca_jkSummerType").val("");
			}else if(type == _changeTypeArgs.STYLE){
				this.$("#ca_jkSize").val("");
			};
		},
		_clearSlacsForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_slStyle").val("");
				this.$("#ca_slSize").val("");
				this.$("#ca_slSpareTypeID").val("");
				this.$("#ca_slLLegLen").val("");
				this.$("#ca_slRLegLen").val("");
				this.$("#ca_slBtmTypeID").val("");
				this.$("#ca_slBtmLen").val("");
				this.$("#ca_slSpareBtmTypeID").val("");
				this.$("#ca_slSpareBtmLen").val("");
				this.$("#ca_slWaistAdjTypeID").val("");
				this.$("#ca_slWaistAdjLen").val("");
				this.$("#ca_slAdjuster").val("");
				this.$("#ca_slSpareAdjuster").val("");
				this.$("#ca_slChangeButton").val("");
			}else if(type == _changeTypeArgs.BRAND){
				this.$("#ca_slStyle").val("");
				this.$("#ca_slSize").val("");
				this.$("#ca_slSpareTypeID").val("");
				this.$("#ca_slLLegLen").val("");
				this.$("#ca_slRLegLen").val("");
				this.$("#ca_slBtmTypeID").val("");
				this.$("#ca_slBtmLen").val("");
				this.$("#ca_slSpareBtmTypeID").val("");
				this.$("#ca_slSpareBtmLen").val("");
				this.$("#ca_slWaistAdjTypeID").val("");
				this.$("#ca_slWaistAdjLen").val("");
				this.$("#ca_slAdjuster").val("");
				this.$("#ca_slSpareAdjuster").val("");
				this.$("#ca_slChangeButton").val("");
			}else if( type == _changeTypeArgs.CLOTH){
				this.$("#ca_slStyle").val("");
				this.$("#ca_slSize").val("");
//				this.$("#ca_slSpareTypeID").val("");
//				this.$("#ca_slLLegLen").val("");
//				this.$("#ca_slRLegLen").val("");
//				this.$("#ca_slBtmTypeID").val("");
//				this.$("#ca_slBtmLen").val("");
//				this.$("#ca_slSpareBtmTypeID").val("");
//				this.$("#ca_slSpareBtmLen").val("");
//				this.$("#ca_slWaistAdjTypeID").val("");
//				this.$("#ca_slWaistAdjLen").val("");
//				this.$("#ca_slAdjuster").val("");
//				this.$("#ca_slSpareAdjuster").val("");
//				this.$("#ca_slChangeButton").val("");
			}else if(type == _changeTypeArgs.STYLE){
				this.$("#ca_slSize").val("");
			};
		},
		_clearVestForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_veStyle").val("");
				this.$("#ca_veSize").val("");
				this.$("#ca_veTrunkAdjLen").val("");
				this.$("#ca_veTrunkAdjTypeID").val("");
				this.$("#ca_veChangeButton").val("");
				this.$("#ca_veChangeLining").val("");
				this.$("#ca_veOptAmfStitch").val("");
			}else if(type == _changeTypeArgs.BRAND){
				this.$("#ca_veStyle").val("");
				this.$("#ca_veSize").val("");
				this.$("#ca_veTrunkAdjLen").val("");
				this.$("#ca_veTrunkAdjTypeID").val("");
				this.$("#ca_veChangeButton").val("");
				this.$("#ca_veChangeLining").val("");
				this.$("#ca_veOptAmfStitch").val("");
			}else if( type == _changeTypeArgs.CLOTH){
				this.$("#ca_veStyle").val("");
				this.$("#ca_veSize").val("");
//				this.$("#ca_veTrunkAdjLen").val("");
//				this.$("#ca_veTrunkAdjTypeID").val("");
//				this.$("#ca_veChangeButton").val("");
//				this.$("#ca_veChangeLining").val("");
//				this.$("#ca_veOptAmfStitch").val("");
			}else if(type == _changeTypeArgs.STYLE){
				this.$("#ca_veSize").val("");
			};
		},
		//その他のクリア
		_clearOtherForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_otStoreAdjTypeID").val("");
				this.$("#ca_otRcptNo").val("");
				this.$("#ca_otStoreMemo").val("");
			}
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

		_doNewCancel: function(e){
			this.mdBaseView.$el.scrollTo(0);
			// 活性化する
			this.setReadOnlyAllItems(false);
			this._clearAllForm(_changeTypeArgs.NEXTITEM);
			//青文字は消す
			this.mdBaseView.hideRibbon();
			this.mdBaseView.clear({setSubmitEnable: true});
//			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE){
//			clutil.inputRemoveReadonly($("#ca_userID"));
//			clutil.setFocus($('#ca_userID'));
//			}else{
//			clutil.inputRemoveReadonly($("#ca_storeID"));
//			clutil.setFocus($('#ca_storeID'));
//			}
			this._doNewCancelSetFocus();
			this.validator.clear();
//			clutil.initUIelement(this.$el);
		},

		_doNewCancelSetFocus: function(e){
			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.setFocus($('#ca_userID'));
			}else{
				clutil.setFocus($('#ca_storeID'));
			}
		},
//		Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			var _this = this;
			switch(args.status){
			case 'DONE':		// 確定済
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
//					ca_editView._doNewCancel();
					//新規なので画面に表示・ダイアログ表示
//					clutil.showDialog("管理番号 [" + data.AMPOV0230UpdRsp.newNo + "] で登録しました。", function(){
//					console.log('OK', arguments);
//					_this._doNewCancel();
//					});
					this.$("#ca_no").val(data.AMPOV0230UpdRsp.newNo);
					clutil.ConfirmDialog("管理番号 [" + data.AMPOV0230UpdRsp.newNo + "] で登録しました。</br>連続登録しますか？", function(_this){
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
					//IDが新しくなっているので古いIDと切り替える。
					this.options.chkData[args.index].poOrderID = data.AMPOV0230GetRsp.order.poOrderID;
					this.options.chkData[args.index].updated_f = 1;

				}
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
//				clutil.viewReadonly(this.$("#ca_base_form"));
//				this._tableDisable();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
//				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
//				prefix: 'ca_'
//				});
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
			}
		},
//TODO
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
				//この画面に来る場合は編集or削除のみ
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
//					if(data.AMPOV0230GetRsp.order.pastFlag > 0){
////						clutil.viewReadonly(this.$("#ca_orderDate_div"));
//						this.$("#ca_InsOldDateInput_div_div").show();
//						this.$("#ca_InsOldDateInput").addClass("cl_required");
//						clutil.datepicker(this.$("#ca_InsOldDateInput")).datepicker('setIymd', data.AMPOV0230GetRsp.order.orderDate );
//					}
					clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', clcom.getOpeDate());
					clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', data.AMPOV0230GetRsp.arrivalDateList[0].arrivalDate );
					clutil.datepicker(this.$("#ca_saleDate")).datepicker('setIymd', clutil.addDate(data.AMPOV0230GetRsp.arrivalDateList[0].arrivalDate, 1));

					//コピーの場合、変更なしデータの登録に関しては警告を出すので比較用にデータを保持しておく
					_copy_rec = data;
					_copy_rec.AMPOV0230GetRsp.order.orderDate = clcom.getOpeDate();
					_copy_rec.AMPOV0230GetRsp.order.arrivalDate = data.AMPOV0230GetRsp.arrivalDateList[0].arrivalDate;
					_copy_rec.AMPOV0230GetRsp.order.saleDate = clutil.addDate(data.AMPOV0230GetRsp.arrivalDateList[0].arrivalDate, 1);
					//複製なので新規登録とする
					this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
					clutil.setFocus($('#ca_storeID'));
					break;
				default:
					//一覧から来た場合、過去商品発注日関係は動かせなくする。
					//チェックボックスは使用禁止
//					if(data.AMPOV0230GetRsp.order.pastFlag > 0){
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
			var _this = this;
			var brandRecs = data.AMPOV0230GetRsp.brandList;
			var clothIDListRecs = data.AMPOV0230GetRsp.clothIDList;
			var optionListRecs = data.AMPOV0230GetRsp.optionList;
			if(_.isEmpty(brandRecs)){
				var brandList = [];
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
				this.saveClothIDlist == null; //プライスライン検索用
				// 内容物がある場合
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
				this.saveClothIDlist = clothIDListRecs; //プライスライン検索用
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
			//オプション
			if(_.isEmpty(optionListRecs) ){
				;
			}else{
				var radio = 1;
				if(data.AMPOV0230GetRsp.order.targetFlagJK > 0){
					radio = 2;
				}
				this.showOptions(optionListRecs, radio);
			}
			data.AMPOV0230GetRsp.order.userID={
					id: data.AMPOV0230GetRsp.order.userID,
					code: data.AMPOV0230GetRsp.order.userCode,
					name:null
			};
			
			clutil.data2view(this.$('#ca_base_form'), data.AMPOV0230GetRsp.order);
			//店舗オートコンプリートに情報表示
			this.utl_store.setValue({
				id: data.AMPOV0230GetRsp.order.storeID,
				code: data.AMPOV0230GetRsp.order.storeCode,
				name: data.AMPOV0230GetRsp.order.storeName});

			this.$('input:radio[name="ca_orderType"]').each(function(){
				switch($(this).val()){
				case "1":
					if(data.AMPOV0230GetRsp.order.targetFlagSuits > 0){
						$(this).attr("checked", "checked");
						$(this).closest("label").addClass("checked", "checked");
					}else{
						$(this).removeAttr("checked");
						$(this).closest("label").removeClass("checked");
					}
					break;
				case "2":
					if(data.AMPOV0230GetRsp.order.targetFlagJK > 0){
						$(this).attr("checked", "checked");
						$(this).closest("label").addClass("checked", "checked");
					}else{
						$(this).removeAttr("checked");
						$(this).closest("label").removeClass("checked");
					}
					break;
				case "3":
					if(data.AMPOV0230GetRsp.order.targetFlagSL > 0){
						$(this).attr("checked", "checked");
						$(this).closest("label").addClass("checked", "checked");
					}else {
						$(this).removeAttr("checked");
						$(this).closest("label").removeClass("checked");
					}
					break;
				case "4":
					if((data.AMPOV0230GetRsp.order.targetFlagSuits +
							data.AMPOV0230GetRsp.order.targetFlagJK +
							data.AMPOV0230GetRsp.order.targetFlagSL) == 0 ){
						$(this).attr("checked", "checked");
						$(this).closest("label").addClass("checked", "checked");
						//チェックボックスは使用禁止
						_this.$("#ca_chkVest").attr("disabled", true);
						$(_this.$("#ca_chkVest").closest('label')).addClass("disabled");
					}else {
						$(this).removeAttr("checked");
						$(this).closest("label").removeClass("checked");
					}
					break;
				}
			});
			//チェックボックス対応
			if((data.AMPOV0230GetRsp.order.targetFlagSuits +
					data.AMPOV0230GetRsp.order.targetFlagJK +
					data.AMPOV0230GetRsp.order.targetFlagSL) > 0 ){
				if(data.AMPOV0230GetRsp.order.targetFlagVest > 0){
					this.$("#ca_chkVest").closest("label").addClass("checked");
					this.$("#ca_chkVest").attr("checked", "checked");
				}
			}else{

			}
			if(data.AMPOV0230GetRsp.order.pastFlag > 0){
				this.$("#ca_InsOldDate").closest("label").addClass("checked");
				this.$("#ca_InsOldDate").attr("checked", "checked");
			}
			clutil.data2view(this.$('#ca_guest_form'), data.AMPOV0230GetRsp.order);
			this.searchStyle({init:true});
			data.AMPOV0230GetRsp.jacket.jkStyle	= data.AMPOV0230GetRsp.jacket.styleID;
			data.AMPOV0230GetRsp.jacket.jkSize	= data.AMPOV0230GetRsp.jacket.sizeID;
			data.AMPOV0230GetRsp.slacks.slStyle	= data.AMPOV0230GetRsp.slacks.styleID;
			data.AMPOV0230GetRsp.slacks.slSize	= data.AMPOV0230GetRsp.slacks.sizeID;
			data.AMPOV0230GetRsp.vest.veStyle	= data.AMPOV0230GetRsp.vest.styleID;
			data.AMPOV0230GetRsp.vest.veSize	= data.AMPOV0230GetRsp.vest.sizeID;

			var vestOnlyFlag = true;
			if(data.AMPOV0230GetRsp.order.targetFlagSuits > 0){
				this.slacsReadOnly(true);
				clutil.data2view(this.$('#ca_jacket_form'), data.AMPOV0230GetRsp.jacket);
				clutil.data2view(this.$('#ca_slacs_form'), data.AMPOV0230GetRsp.slacks);
				//スタイルが入っていないとサイズのコンボボックスが効かないので2回data2viewを行う
				this._styleChangJK({init:true});
				this._styleChangSL({init:true});
				clutil.data2view(this.$('#ca_jacket_form'), data.AMPOV0230GetRsp.jacket);
				clutil.data2view(this.$('#ca_slacs_form'), data.AMPOV0230GetRsp.slacks);
				this._slBtmTypeIDChang();
				this._slSpareBtmTypeIDChang();
				this._slSpareTypeIDChang();
				vestOnlyFlag = false;
			}
			if(data.AMPOV0230GetRsp.order.targetFlagJK > 0){
				this.slacsReadOnly(true);
				clutil.data2view(this.$('#ca_jacket_form'), data.AMPOV0230GetRsp.jacket);
				//スタイルが入っていないとサイズのコンボボックスが効かないので2回data2viewを行う
				this._styleChangJK({init:true});
				clutil.data2view(this.$('#ca_jacket_form'), data.AMPOV0230GetRsp.jacket);
				vestOnlyFlag = false;
			}
			if(data.AMPOV0230GetRsp.order.targetFlagSL > 0){
				this.jacketReadOnly(true);
				clutil.data2view(this.$('#ca_slacs_form'), data.AMPOV0230GetRsp.slacks);
				//スタイルが入っていないとサイズのコンボボックスが効かないので2回data2viewを行う
				this._styleChangSL({init:true});
				clutil.data2view(this.$('#ca_slacs_form'), data.AMPOV0230GetRsp.slacks);
				
				
				this._slBtmTypeIDChang();
				this._slSpareBtmTypeIDChang();
				this._slSpareTypeIDChang();
				vestOnlyFlag = false;
			}
			if(data.AMPOV0230GetRsp.order.targetFlagVest > 0){
				if(vestOnlyFlag){
					this.jacketReadOnly(true);
					this.slacsReadOnly(true);
				}
				clutil.data2view(this.$('#ca_vest_form'), data.AMPOV0230GetRsp.vest);
				//スタイルが入っていないとサイズのコンボボックスが効かないので2回data2viewを行う
				this._styleChangVE({init:true});
				clutil.data2view(this.$('#ca_vest_form'), data.AMPOV0230GetRsp.vest);
			}else{
				this.vestReadOnly(true);
			}
			
			clutil.data2view(this.$('#ca_other_form'), data.AMPOV0230GetRsp.other);
			//入力制限修正
			clutil.cltxtFieldLimitReset($("#ca_userID"));
			clutil.cltxtFieldLimitReset($("#ca_custName"));
			clutil.cltxtFieldLimitReset($("#ca_custNameKana"));
			clutil.cltxtFieldLimitReset($("#ca_membNo"));
			clutil.cltxtFieldLimitReset($("#ca_jkName"));
			clutil.cltxtFieldLimitReset($("#ca_otRcptNo"));
			clutil.cltxtFieldLimitReset($("#ca_otStoreMemo"));
			
			clutil.initUIelement(this.$el);
			
			
		},
		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
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

			var order =		 clutil.view2data(this.$('#ca_base_form'));
			var guest =		 clutil.view2data(this.$('#ca_guest_form'));
			var jacket	=	 clutil.view2data(this.$('#ca_jacket_form'));
			var slacks	=	 clutil.view2data(this.$('#ca_slacs_form'));
			var vest	=	 clutil.view2data(this.$('#ca_vest_form'));
			var other	=	 clutil.view2data(this.$('#ca_other_form'));

			order.poTypeID = amcm_type.AMCM_VAL_PO_CLASS_MENS;
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

			var radio = this.$('input:radio[name="ca_orderType"]:checked');
			var val = radio.val();
			if (val == '1') {
				//スーツ
				order.targetFlagSuits	= 1;
				order.targetFlagJK		= 0;
				order.targetFlagSL		= 0;
			} else if (val == '2') {
				//ジャケット
				order.targetFlagSuits	= 0;
				order.targetFlagJK		= 1;
				order.targetFlagSL		= 0;
			} else if (val == '3') {
				//スラックス
				order.targetFlagSuits	= 0;
				order.targetFlagJK		= 0;
				order.targetFlagSL		= 1;
			} else if (val == '4') {
				//ベスト
				order.targetFlagSuits	= 0;
				order.targetFlagJK		= 0;
				order.targetFlagSL		= 0;
				order.targetFlagVest	= 1;
			} else {
				order.targetFlagSuits	= 0;
				order.targetFlagJK		= 0;
				order.targetFlagSL		= 0;
			}
			var $check = this.$("#ca_chkVest");
			var isChecked = $check.attr("checked");
			if (isChecked || val == '4') {
				//ベストオン
				order.targetFlagVest		= 1;
			}else {
				//ベストoff
				order.targetFlagVest		= 0;
			}
			var $oldCheck = this.$("#ca_InsOldDate");
			var isOldChecked = $oldCheck.attr("checked");
			if (isOldChecked) {
				//過去オン
				order.pastFlag		= 1;
			} else {
				//過去off
				order.pastFlag		= 0;
			}
			if(this.selectorVal2Item('brandID', order.brandID) != null){
				order.brandCode = this.selectorVal2Item('brandID', order.brandID).code;
			}
			jacket.styleID	= (order.targetFlagSuits == 1 || order.targetFlagJK == 1)? jacket.jkStyle: 0;
			jacket.sizeID	= (order.targetFlagSuits == 1 || order.targetFlagJK == 1)? jacket.jkSize: 0;
			slacks.styleID	= (order.targetFlagSuits == 1 || order.targetFlagSL == 1)? slacks.slStyle: 0;
			slacks.sizeID	= (order.targetFlagSuits == 1 || order.targetFlagSL == 1)? slacks.slSize: 0;
			vest.styleID	= (order.targetFlagVest==1)? vest.veStyle:0;
			vest.sizeID		= (order.targetFlagVest==1)? vest.veSize:0;

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
//			if(order.washable > 0){
//				//washableフラグあり
//				if(order.targetFlagSuits > 0 || order.targetFlagJK > 0){
//					//ジャケット関連
//					if(jacket.jkAmfStitch > 0){
//						f_error = true;
//						this.validator.setErrorMsg( this.$("#ca_jkAmfStitch"), clmsg.EPO0058);
//					}
//					if(jacket.jkOdaiba > 0){
//						f_error = true;
//						this.validator.setErrorMsg( this.$("#ca_jkOdaiba"), clmsg.EPO0058);
//					}
//					if(jacket.jkChangeLining > 0){
//						f_error = true;
//						this.validator.setErrorMsg( this.$("#ca_jkChangeLining"), clmsg.EPO0058);
//					}
//					if(jacket.jkSummerType > 0){
//						f_error = true;
//						this.validator.setErrorMsg( this.$("#ca_jkSummerType"), clmsg.EPO0058);
//					}
//				}
//				if(order.targetFlagSL > 0){
//					//スラックス関連
//					if(slacks.slBtmTypeID ==  amcm_type.AMCM_VAL_COATTAIL_TYPE_DOUBLE){
//						f_error = true;
//						this.validator.setErrorMsg( this.$("#ca_slBtmTypeID"), clmsg.EPO0057);
//					}
//					if(slacks.slSpareBtmTypeID ==  amcm_type.AMCM_VAL_COATTAIL_TYPE_DOUBLE){
//						f_error = true;
//						this.validator.setErrorMsg( this.$("#ca_slSpareBtmTypeID"), clmsg.EPO0057);
//					}
//					if(slacks.slAdjuster > 0){
//						f_error = true;
//						this.validator.setErrorMsg( this.$("#ca_slAdjuster"), clmsg.EPO0058);
//					}
//					if(slacks.slSpareAdjuster > 0){
//						f_error = true;
//						this.validator.setErrorMsg( this.$("#ca_slSpareAdjuster"), clmsg.EPO0058);
//					}
//				}
//				if(order.targetFlagVest > 0){
//					//ベスト関連
//					if(vest.veOptAmfStitch > 0){
//						f_error = true;
//						this.validator.setErrorMsg( this.$("#ca_veOptAmfStitch"), clmsg.EPO0058);
//					}
//					if(vest.veChangeLining > 0){
//						f_error = true;
//						this.validator.setErrorMsg( this.$("#ca_veChangeLining"), clmsg.EPO0058);
//					}
//				}
//			}
			if(order.targetFlagSuits > 0 || order.targetFlagJK > 0){
				//ジャケット関連
				if(jacket.jkLSleeveAdjLen > 5.0){
					this.validator.setErrorMsg( this.$("#ca_jkLSleeveAdjLen"), clmsg.EGM0021);
					f_error = true;
				}
				if(jacket.jkRSleeveAdjLen > 5.0){
					this.validator.setErrorMsg( this.$("#ca_jkRSleeveAdjLen"), clmsg.EGM0021);
					f_error = true;
				}
				if(jacket.jkAdjLen > 5.0){
					this.validator.setErrorMsg( this.$("#ca_jkAdjLen"), clmsg.EGM0021);
					f_error = true;
				}
				if(jacket.jkTrunkAdjLen > 4.0){
					this.validator.setErrorMsg( this.$("#ca_jkTrunkAdjLen"), clmsg.EGM0021);
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
				if(jacket.jkTrunkAdjLen > 0 && jacket.jkTrunkAdjTypeID == 0){
					this.validator.setErrorMsg( this.$("#ca_jkTrunkAdjTypeID"), clmsg.EGM0021);
					f_error = true;
				}
			}
			if(order.targetFlagSuits > 0 || order.targetFlagSL > 0){
				//スラックス関連
				if(slacks.slWaistAdjLen > 3.0){
					f_error = true;
					this.validator.setErrorMsg( this.$("#ca_slWaistAdjLen"), clmsg.EGM0021);
				}
				//各種数値だけ入れてタイプを指定しない場合はエラーとする
				if(slacks.slWaistAdjLen > 0 && slacks.slWaistAdjTypeID == 0){
					this.validator.setErrorMsg( this.$("#ca_slWaistAdjTypeID"), clmsg.EGM0021);
					f_error = true;
				}
			}
			if(order.targetFlagVest > 0){
				//ベスト関連
				if(vest.veTrunkAdjLen > 4.0){
					f_error = true;
					this.validator.setErrorMsg( this.$("#ca_veTrunkAdjLen"), clmsg.EGM0021);
				}
				//各種数値だけ入れてタイプを指定しない場合はエラーとする
				if(vest.veTrunkAdjLen > 0 && vest.veTrunkAdjTypeID == 0){
					this.validator.setErrorMsg( this.$("#ca_veTrunkAdjTypeID"), clmsg.EGM0021);
					f_error = true;
				}
			}
			//店舗備考欄
			if(other.otStoreMemo != null &&  other.otStoreMemo != ""){
				var num = other.otStoreMemo.match(/\n/g);
				if(num != null){
					if( num.length  > 3){
						f_error = true;
						this.validator.setErrorMsg(this.$("#ca_otStoreMemo"), clmsg.EPO0068);
					}
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
			}finally{
				this.mdBaseView.setAutoValidate(true);
			}


			// listへhead情報の適応
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){

			}

			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			var updReq = {
					order  : order,
					jacket  : jacket,
					slacks  : slacks,
					vest  : vest,
					other  : other
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}
			var reqObj = {
					reqHead : reqHead,
					AMPOV0230UpdReq  : updReq
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
			if(!this._chk_copy_jacket(updReq)){
				return false;
			}
			if(!this._chk_copy_slacks(updReq)){
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
			var org_data = _copy_rec.AMPOV0230GetRsp.order;
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

			//ウォッシャブル仕様
			old_rec = (org_data.washable == null)? 0: org_data.washable;
			new_rec = (new_data.washable == null)? 0: new_data.washable;
			if(old_rec != new_rec){
				return false;
			}
			//PO対象フラグ（スーツ）
			old_rec = (org_data.targetFlagSuits == null)? 0: org_data.targetFlagSuits;
			new_rec = (new_data.targetFlagSuits == null)? 0: new_data.targetFlagSuits;
			if(old_rec != new_rec){
				return false;
			}
			//PO対象フラグ（ジャケット）
			old_rec = (org_data.targetFlagJK == null)? 0: org_data.targetFlagJK;
			new_rec = (new_data.targetFlagJK == null)? 0: new_data.targetFlagJK;
			if(old_rec != new_rec){
				return false;
			}
			//PO対象フラグ（スラックス）
			old_rec = (org_data.targetFlagSL == null)? 0: org_data.targetFlagSL;
			new_rec = (new_data.targetFlagSL == null)? 0: new_data.targetFlagSL;
			if(old_rec != new_rec){
				return false;
			}
			//PO対象フラグ（ベスト）
			old_rec = (org_data.targetFlagVest == null)? 0: org_data.targetFlagVest;
			new_rec = (new_data.targetFlagVest == null)? 0: new_data.targetFlagVest;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_jacket: function(updReq){
			var org_data = _copy_rec.AMPOV0230GetRsp.jacket;
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
			//ベント
			old_rec = (org_data.jkVentTypeID == null)? 0: org_data.jkVentTypeID;
			new_rec = (new_data.jkVentTypeID == null)? 0: new_data.jkVentTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//裏地
			old_rec = (org_data.jkLiningTypeID == null)? 0: org_data.jkLiningTypeID;
			new_rec = (new_data.jkLiningTypeID == null)? 0: new_data.jkLiningTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//AMF
			old_rec = (org_data.jkAmfTypeID == null)? 0: org_data.jkAmfTypeID;
			new_rec = (new_data.jkAmfTypeID == null)? 0: new_data.jkAmfTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//重ねボタン
			old_rec = (org_data.jkButtonTypeID == null)? 0: org_data.jkButtonTypeID;
			new_rec = (new_data.jkButtonTypeID == null)? 0: new_data.jkButtonTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//スラントポケット
			old_rec = (org_data.jkSlantPocketTypeID == null)? 0: org_data.jkSlantPocketTypeID;
			new_rec = (new_data.jkSlantPocketTypeID == null)? 0: new_data.jkSlantPocketTypeID;
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
			//中胴補正長
			old_rec = (org_data.jkTrunkAdjLen == null)? 0: org_data.jkTrunkAdjLen;
			new_rec = (new_data.jkTrunkAdjLen == null)? 0: new_data.jkTrunkAdjLen;
			if(old_rec != new_rec){
				return false;
			}
			//中胴補正種別
			old_rec = (org_data.jkTrunkAdjTypeID == null)? 0: org_data.jkTrunkAdjTypeID;
			new_rec = (new_data.jkTrunkAdjTypeID == null)? 0: new_data.jkTrunkAdjTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//袖ボタン４つ
			old_rec = (org_data.jkSleeveButton == null)? 0: org_data.jkSleeveButton;
			new_rec = (new_data.jkSleeveButton == null)? 0: new_data.jkSleeveButton;
			if(old_rec != new_rec){
				return false;
			}
			//チェンジポケット
			old_rec = (org_data.jkChangePocket == null)? 0: org_data.jkChangePocket;
			new_rec = (new_data.jkChangePocket == null)? 0: new_data.jkChangePocket;
			if(old_rec != new_rec){
				return false;
			}
			//本切羽
			old_rec = (org_data.jkCuffs == null)? 0: org_data.jkCuffs;
			new_rec = (new_data.jkCuffs == null)? 0: new_data.jkCuffs;
			if(old_rec != new_rec){
				return false;
			}
			//AMFステッチ
			old_rec = (org_data.jkAmfStitch == null)? 0: org_data.jkAmfStitch;
			new_rec = (new_data.jkAmfStitch == null)? 0: new_data.jkAmfStitch;
			if(old_rec != new_rec){
				return false;
			}
			//ボタン変更
			old_rec = (org_data.jkChangeButton == null)? 0: org_data.jkChangeButton;
			new_rec = (new_data.jkChangeButton == null)? 0: new_data.jkChangeButton;
			if(old_rec != new_rec){
				return false;
			}
			//お台場
			old_rec = (org_data.jkOdaiba == null)? 0: org_data.jkOdaiba;
			new_rec = (new_data.jkOdaiba == null)? 0: new_data.jkOdaiba;
			if(old_rec != new_rec){
				return false;
			}
			//裏地変更
			old_rec = (org_data.jkChangeLining == null)? 0: org_data.jkChangeLining;
			new_rec = (new_data.jkChangeLining == null)? 0: new_data.jkChangeLining;
			if(old_rec != new_rec){
				return false;
			}

			//サマー仕様
			old_rec = (org_data.jkSummerType == null)? 0: org_data.jkSummerType;
			new_rec = (new_data.jkSummerType == null)? 0: new_data.jkSummerType;
			if(old_rec != new_rec){
				return false;
			}

			//全く同じ
			return true;
		},
		_chk_copy_slacks: function(updReq){
			org_data = _copy_rec.AMPOV0230GetRsp.slacks;
			new_data = updReq.slacks;
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
			old_rec = (org_data.slSpareTypeID == null)? 0: org_data.slSpareTypeID;
			new_rec = (new_data.slSpareTypeID == null)? 0: new_data.slSpareTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//左股下長
			old_rec = (org_data.slLLegLen == null)? 0: org_data.slLLegLen;
			new_rec = (new_data.slLLegLen == null)? 0: new_data.slLLegLen;
			if(old_rec != new_rec){
				return false;
			}
			//右股下長
			old_rec = (org_data.slRLegLen == null)? 0: org_data.slRLegLen;
			new_rec = (new_data.slRLegLen == null)? 0: new_data.slRLegLen;
			if(old_rec != new_rec){
				return false;
			}
			//裾仕上種別
			old_rec = (org_data.slBtmTypeID == null)? 0: org_data.slBtmTypeID;
			new_rec = (new_data.slBtmTypeID == null)? 0: new_data.slBtmTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//裾仕上長
			old_rec = (org_data.slBtmLen == null)? 0: org_data.slBtmLen;
			new_rec = (new_data.slBtmLen == null)? 0: new_data.slBtmLen;
			if(old_rec != new_rec){
				return false;
			}
			//スペア裾仕上種別
			old_rec = (org_data.slSpareBtmTypeID == null)? 0: org_data.slSpareBtmTypeID;
			new_rec = (new_data.slSpareBtmTypeID == null)? 0: new_data.slSpareBtmTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//スペア裾仕上長
			old_rec = (org_data.slSpareBtmLen == null)? 0: org_data.slSpareBtmLen;
			new_rec = (new_data.slSpareBtmLen == null)? 0: new_data.slSpareBtmLen;
			if(old_rec != new_rec){
				return false;
			}
			//ウエスト補正長
			old_rec = (org_data.slWaistAdjLen == null)? 0: org_data.slWaistAdjLen;
			new_rec = (new_data.slWaistAdjLen == null)? 0: new_data.slWaistAdjLen;
			if(old_rec != new_rec){
				return false;
			}
			//ウエスト補正種別
			old_rec = (org_data.slWaistAdjTypeID == null)? 0: org_data.slWaistAdjTypeID;
			new_rec = (new_data.slWaistAdjTypeID == null)? 0: new_data.slWaistAdjTypeID;
			if(old_rec != new_rec){
				return false;
			}

			//アジャスター
			old_rec = (org_data.slAdjuster == null)? 0: org_data.slAdjuster;
			new_rec = (new_data.slAdjuster == null)? 0: new_data.slAdjuster;
			if(old_rec != new_rec){
				return false;
			}
			//スペアアジャスター
			old_rec = (org_data.slSpareAdjuster == null)? 0: org_data.slSpareAdjuster;
			new_rec = (new_data.slSpareAdjuster == null)? 0: new_data.slSpareAdjuster;
			if(old_rec != new_rec){
				return false;
			}
			//ボタン変更
			old_rec = (org_data.slChangeButton == null)? 0: org_data.slChangeButton;
			new_rec = (new_data.slChangeButton == null)? 0: new_data.slChangeButton;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_vest: function(updReq){
			org_data = _copy_rec.AMPOV0230GetRsp.vest;
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
			//中胴補正長
			old_rec = (org_data.veTrunkAdjLen == null)? 0: org_data.veTrunkAdjLen;
			new_rec = (new_data.veTrunkAdjLen == null)? 0: new_data.veTrunkAdjLen;
			if(old_rec != new_rec){
				return false;
			}
			//中胴補正種別
			old_rec = (org_data.veTrunkAdjTypeID == null)? 0: org_data.veTrunkAdjTypeID;
			new_rec = (new_data.veTrunkAdjTypeID == null)? 0: new_data.veTrunkAdjTypeID;
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
			//AMFステッチ
			old_rec = (org_data.veOptAmfStitch == null)? 0: org_data.veOptAmfStitch;
			new_rec = (new_data.veOptAmfStitch == null)? 0: new_data.veOptAmfStitch;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_other: function(updReq){
			org_data = _copy_rec.AMPOV0230GetRsp.other;
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
					AMPOV0230GetReq: {
						reqType :1,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_MENS,
						srchID: this.options.chkData[pgIndex].poOrderID,			// 取引先ID
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMPOV0230UpdReq: {
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
//		_washableChange: function(e) {
//			this._clearJacketForm(_changeTypeArgs.BRAND);
//			this._clearSlacsForm(_changeTypeArgs.BRAND);
//			this._clearVestForm(_changeTypeArgs.BRAND);
//			this.jacketReadOnly(true);
//			this.slacsReadOnly(true);
//			this.vestReadOnly(true);
//
//			//this.washableLock();
//			this.searchStyle();
//		},
		/**
		 * スタイルを検索する
		 * ブランド変更またはウォッシャブル変更時
		 */
		searchStyle: function(args) {
			var _this = this;
			this._clearAllForm(_changeTypeArgs.STYLE);
			
			var radio = this.$('input:radio[name="ca_orderType"]:checked');
			var val = radio.val();
			
			
			if((args != undefined) && (args.init != null) && args.init){
				// スタイル・チェンジボタンを詰める
				//_this.getStyleVE(args);
				if (val == '1') {
					_this.getStyleST(args);
					_this.getStyleSL(args);
					//_this.getButtons(amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT);
				}
				else if (val == '2') {
					_this.getStyleJK(args);
					//_this.getButtons(amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET);
				}
				else if (val == '3') {
					_this.getStyleSL(args);
					//_this.getButtons(amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS);
				}
				else{
					//_this.getButtons(amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST);
				}
				_this.getStyleVE(args);
			}else{
				if (val == '1') {
					clutil.viewRemoveReadonly(this.$("#ca_jkStyle_div"));
					$("#ca_jkStyle_autofill").show();
					clutil.viewRemoveReadonly(this.$("#ca_slStyle_div"));
					$("#ca_slStyle_autofill").show();
					$("#ca_jkStyle").addClass("cl_required");
					$("#ca_jkSize").addClass("cl_required");
					$("#ca_jkVentTypeID").addClass("cl_required");
					$("#ca_jkLiningTypeID").addClass("cl_required");
					$("#ca_jkAmfTypeID").addClass("cl_required");
					$("#ca_jkButtonTypeID").addClass("cl_required");
					$("#ca_jkSlantPocketTypeID").addClass("cl_required");
					$("#ca_jkNameTypeID").addClass("cl_required");
					$("#ca_slStyle").addClass("cl_required");
					$("#ca_slSize").addClass("cl_required");
					
					// スタイルを詰める
					_this.getStyleST(args);
					_this.getStyleSL(args);
					
					// チェンジボタンを詰める
					_this.getButtons(amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT);
					
				}else if (val == '2') {
					clutil.viewRemoveReadonly(this.$("#ca_jkStyle_div"));
					$("#ca_jkStyle_autofill").show();
					$("#ca_jkStyle").addClass("cl_required");
					$("#ca_jkSize").addClass("cl_required");
					$("#ca_jkVentTypeID").addClass("cl_required");
					$("#ca_jkLiningTypeID").addClass("cl_required");
					$("#ca_jkAmfTypeID").addClass("cl_required");
					$("#ca_jkButtonTypeID").addClass("cl_required");
					$("#ca_jkSlantPocketTypeID").addClass("cl_required");
					$("#ca_jkNameTypeID").addClass("cl_required");
					
					// スタイルを詰める
					_this.getStyleJK(args);
					_this.getButtons(amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET);
					
				}else if (val == '3') {
					clutil.viewRemoveReadonly(this.$("#ca_slStyle_div"));
					$("#ca_slStyle_autofill").show();
					$("#ca_slStyle").addClass("cl_required");
					$("#ca_slSize").addClass("cl_required");
					
					// スタイルを詰める
					_this.getStyleSL(args);
					_this.getButtons(amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS);
					
				}else if (val == '4') {
					_this.getButtons(amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST);
//					clutil.viewRemoveReadonly(this.$("#ca_veStyle_div"));
//					$("#ca_veStyle").addClass("cl_required");
//					$("#ca_veSize").addClass("cl_required");
				}
				
				
				var $check = this.$("#ca_chkVest");
				var isVestChecked = $check.attr("checked");
				if (isVestChecked || val == '4') {
					clutil.viewRemoveReadonly(this.$("#ca_veStyle_div"));
					$("#ca_veStyle_autofill").show();
					$("#ca_veStyle").addClass("cl_required");
					$("#ca_veSize").addClass("cl_required");
				}
				
				// ベストスタイルを詰める
				_this.getStyleVE(args);
			}
		},
		
		
		/**オプション検索(チェンジボタン取得用)**/
		getButtons:function(radio){
			this.doSrchOption(radio);
		},
		
		
		// スーツのスタイルをつめる
		getStyleST:function(args){
			var _this = this;
			this._clearAllForm(_changeTypeArgs.STYLE);
			var $brandID		= this.$("#ca_brandID");
			var $clothIDID		= this.$("#ca_clothIDID");
			
			destroySelectpicker(this.$('#ca_jkStyle'));
			this.jkStyleSelector = clutil.clpobrandstyleselector({
				el:this.$("#ca_jkStyle"),
				dependAttrs :{
					poBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					styleoptTypeID: amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT,
					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_MENS,
					washableFlag:0,
					poClothCodeID: function() {
						return ($clothIDID.val()==null || $clothIDID.val()==0)? -1:$clothIDID.val();
					}
				},
				disableOnNoChoice: false,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			}).done(_.bind(function(){
				if((args != undefined) && (args.init != null) && args.init){

				}else{
					//空白行があるので1以下
					if(_this.$("#ca_jkStyle").find("option").length == 1){
						$("#ca_jkStyle_autofill").hide();
					}else if(_this.$("#ca_jkStyle").find("option").length <= 0){

					}
				}
			},this));
		},
		
		
		
		// ジャケットのスタイルをつめる
		getStyleJK:function(args){
			var _this = this;
			this._clearAllForm(_changeTypeArgs.STYLE);
			var $brandID		= this.$("#ca_brandID");
			var $clothIDID		= this.$("#ca_clothIDID");
			
			destroySelectpicker(this.$('#ca_jkStyle'));
			this.jkStyleSelector = clutil.clpobrandstyleselector({
				el:this.$("#ca_jkStyle"),
				dependAttrs :{
					poBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					styleoptTypeID: amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET,
					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_MENS,
					washableFlag:0,
					poClothCodeID: function() {
						return ($clothIDID.val()==null || $clothIDID.val()==0)? -1:$clothIDID.val();
					}
				},
				disableOnNoChoice: false,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			}).done(_.bind(function(){
				if((args != undefined) && (args.init != null) && args.init){

				}else{
					//空白行があるので1以下
					if(_this.$("#ca_jkStyle").find("option").length <= 1){
						$("#ca_jkStyle_autofill").hide();
					}else{

					}
				}
			},this));
		},
		
		// スラックスのスタイルをつめる
		getStyleSL:function(args){
			var _this = this;
			this._clearAllForm(_changeTypeArgs.STYLE);
			var $brandID		= this.$("#ca_brandID");
			var $clothIDID		= this.$("#ca_clothIDID");
			
			destroySelectpicker(this.$('#ca_slStyle'));
			clutil.clpobrandstyleselector({
				el:this.$("#ca_slStyle"),
				dependAttrs :{
					poBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					styleoptTypeID: amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS,
					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_MENS,
					washableFlag:0,
					poClothCodeID: function() {
						return ($clothIDID.val()==null || $clothIDID.val()==0)? -1:$clothIDID.val();
					}
				},
				disableOnNoChoice: false,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			}).done(_.bind(function(){
				if((args != undefined) && (args.init != null) && args.init){

				}else{
					//空白行があるので1以下
					if(_this.$("#ca_slStyle").find("option").length <= 1){
						$("#ca_slStyle_autofill").hide();
					}else{

					}
				}
			},this));
		},
		
		// ベストのスタイルをつめる
		getStyleVE:function(args){
			var _this = this;
			this._clearAllForm(_changeTypeArgs.STYLE);
			var $brandID		= this.$("#ca_brandID");
			var $clothIDID		= this.$("#ca_clothIDID");
			
			destroySelectpicker(this.$('#ca_veStyle'));
			//検索結果が0件の場合チェックボックスのチェック外して必須も外して選択不可にする
			clutil.clpobrandstyleselector({
				el:this.$("#ca_veStyle"),
				dependAttrs :{
					poBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					styleoptTypeID: amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST,
					poTypeID: amcm_type.AMCM_VAL_PO_CLASS_MENS,
					washableFlag:0,
					poClothCodeID: function() {
						return ($clothIDID.val()==null || $clothIDID.val()==0)? -1:$clothIDID.val();
					}
				},
				disableOnNoChoice: false,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			}).done(_.bind(function(){
				if((args != undefined) && (args.init != null) && args.init){

				}else{
					var radio = this.$('input:radio[name="ca_orderType"]:checked');
					var val = radio.val();
					
					
					//空白行があるので1以下
					if(_this.$("#ca_veStyle").find("option").length <= 1){
						this.$("#ca_chkVest").closest("label").removeClass("checked");
						this.$("#ca_chkVest").removeAttr("checked");
						_this.$("#ca_chkVest").attr("disabled", true);
						$(_this.$("#ca_chkVest").closest('label')).addClass("disabled");
						
						if (val == '4') {
							// ラジオボタンがベストの時はセル活性化(項目なし)
							$("#ca_veStyle_autofill").hide();
						}
						else{
							// ラジオボタンがベストの以外の時はセル非活性化
							_this.vestReadOnly(true);
						}
					}else{
						_this.$("#ca_chkVest").removeAttr("disabled");
						$(_this.$("#ca_chkVest").closest('label')).removeClass("disabled");
						
						// ラジオボタンがベストの時はチェック不可にする
						if (val == '4') {
							this.$("#ca_chkVest").closest("label").removeClass("checked");
							this.$("#ca_chkVest").removeAttr("checked");
							_this.$("#ca_chkVest").attr("disabled", true);
							$(_this.$("#ca_chkVest").closest('label')).addClass("disabled");
						}
						
					}
				}
			},this));
		},

		_styleChangJK: function(args){
			var _this = this;
			var $brandID		= this.$("#ca_brandID");
			var $styleID		= this.$("#ca_jkStyle");
			if((args != undefined) && (args.init != null) && args.init){
				this.jacketReadOnly(false);
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
			destroySelectpicker(this.$('#ca_jkSize'));
			clutil.clposizeselector({
				el:this.$("#ca_jkSize"),
				dependAttrs :{
					poBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					poBrandStyleID: function() {
						return ($styleID.val()==null || $styleID.val()==0)? -1:$styleID.val();
					},
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
			},this));
			return;
		},
		_styleChangSL: function(args){
			var _this = this;
			var $brandID		= this.$("#ca_brandID");
			var $styleID		= this.$("#ca_slStyle");
			if((args != undefined) && (args.init != null) && args.init){
				this.slacsReadOnly(false);
			}else{
				if($styleID.val() == null  || $styleID.val() <= 0){
					this.slacsReadOnly(true);
					clutil.viewRemoveReadonly(this.$("#ca_slStyle_div"));
					return;
				}else{
					this.slacsReadOnly(false);
				}
			}

			destroySelectpicker(this.$('#ca_slSize'));
			clutil.clposizeselector({
				el:this.$("#ca_slSize"),
				dependAttrs :{
					poBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					poBrandStyleID: function() {
						return ($styleID.val()==null || $styleID.val()==0)? -1:$styleID.val();
					},
				},
				nameOnly:true,
				selectpicker: {	// プルダウンの△をとる
					noButton: true
				}
			}).done(_.bind(function(){
					//空白行があるので1以下
					if(_this.$("#ca_slSize").find("option").length <= 1){
						$("#ca_slSize_autofill").hide();
					}else{
						$("#ca_slSize_autofill").show();
					}
			},this));
			this._slBtmTypeIDChang();
			this._slSpareBtmTypeIDChang();
			this._slSpareTypeIDChang();
			
			return;
		},
		_styleChangVE: function(args){
			var _this = this;
			var $brandID		= this.$("#ca_brandID");
			var $styleID		= this.$("#ca_veStyle");
			if((args != undefined) && (args.init != null) && args.init){
				this.vestReadOnly(false);
			}else{
				if($styleID.val() == null  || $styleID.val() <= 0){
					this.vestReadOnly(true);
					clutil.viewRemoveReadonly(this.$("#ca_veStyle_div"));
					return;
				}else{
					this.vestReadOnly(false);
				}
			}
			destroySelectpicker(this.$('#ca_veSize'));
			clutil.clposizeselector({
				el:this.$("#ca_veSize"),
				dependAttrs :{
					poBrandID: function() {
						return ($brandID.val()==null || $brandID.val()==0)? -1:$brandID.val();
					},
					poBrandStyleID: function() {
						return ($styleID.val()==null || $styleID.val()==0)? -1:$styleID.val();
					},
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
			},this));
			return;
		},
		_slSpareTypeIDChang: function(){
			var $type		= this.$("#ca_slSpareTypeID");
			if( $type.val() ==  amcm_type.AMCM_VAL_SPARE_TYPE_EXIST){
				//スペアありならば入力可能
				clutil.viewRemoveReadonly($("#ca_slSpareBtmTypeID_div"));
				if(this.selectorVal2ItemLength('slSpareAdjuster') == 0){

					clutil.viewReadonly($("#ca_slSpareAdjuster_div"));
				}else{
					clutil.viewRemoveReadonly($("#ca_slSpareAdjuster_div"));
				}
			}else{
				this.$("#ca_slSpareBtmTypeID").val("");
				this.$("#ca_slSpareBtmLen").val("");
				this.$("#ca_slSpareAdjuster").val("");
				//スペアがない場合クリア
				clutil.viewReadonly($("#ca_slSpareBtmTypeID_div"));
				clutil.viewReadonly($("#ca_slSpareBtmLen_div"));
				clutil.viewReadonly($("#ca_slSpareAdjuster_div"));
			}
			return;
		},
		_slBtmTypeIDChang: function(){
			var $btmType		= this.$("#ca_slBtmTypeID");
			if( $btmType.val() ==  amcm_type.AMCM_VAL_COATTAIL_TYPE_DOUBLE){
				//ダブルは入力可能
				clutil.viewRemoveReadonly($("#ca_slBtmLen_div"));
			}else{
				//それ以外は入力不可(内容もクリア)
				this.$("#ca_slBtmLen").val("");
				clutil.viewReadonly($("#ca_slBtmLen_div"));
			}
			return;
		},
		_slSpareBtmTypeIDChang: function(){
			var $btmType		= this.$("#ca_slSpareBtmTypeID");
			if( $btmType.val() ==  amcm_type.AMCM_VAL_COATTAIL_TYPE_DOUBLE){
				//ダブルは入力可能
				clutil.viewRemoveReadonly($("#ca_slSpareBtmLen_div"));
			}else{
				//それ以外は入力不可(内容もクリア)
				this.$("#ca_slSpareBtmLen").val("");
				clutil.viewReadonly($("#ca_slSpareBtmLen_div"));
			}
			return;
		},

		/**
		 * ブランドの変更処理
		 * 画面の一部をクリアし、
		 * 生地・オプション検索して生地番号リスト項目・オプションリスト項目を作成
		 * スタイルの再設定を行う
		 * */
//TODO
		_BrandTypeChange: function(){
			//ブランド関連配下をクリア
			this._clearAllForm(_changeTypeArgs.BRAND);
			this.jacketReadOnly(true);
			this.slacsReadOnly(true);
			this.vestReadOnly(true);
			if( this.$("#ca_brandID").val() == null || this.$("#ca_brandID").val()  <= 0){
				//ブランドも決まっていない場合は使用不可
				clutil.initUIelement(this.$el);
				return;
			}
			
			// 選択中のラジオボタン取得
			var radio = $("input:radio[name=ca_orderType]:checked");
			var val = radio.val();
			
			this.doSrchOptionCloth(val);
			clutil.initUIelement(this.$el);
			
			return;
		},
		_clothIDIDChange: function(){
			var _this = this;
			//生地IDが変更された際もともとデータが入っていたかのフラグ
			var jk_flag = (_this.$("#ca_jkStyle").val() != null &&  _this.$("#ca_jkStyle").val() != 0);
			var sl_flag = (_this.$("#ca_slStyle").val() != null &&  _this.$("#ca_slStyle").val() != 0);
			var ve_flag = (_this.$("#ca_veStyle").val() != null &&  _this.$("#ca_veStyle").val() != 0);

			this._clearAllForm(_changeTypeArgs.CLOTH);
			clutil.viewReadonly(_this.$("#ca_jkSize_div"));
			_this.$("#ca_jkSize_autofill").hide();
			clutil.viewReadonly(_this.$("#ca_slSize_div"));
			_this.$("#ca_slSize_autofill").hide();
			clutil.viewReadonly(_this.$("#ca_veSize_div"));
			_this.$("#ca_veSize_autofill").hide();

			if(this.saveClothIDlist == null
					|| this.$("#ca_clothIDID").val() == null
					|| this.$("#ca_clothIDID").val() <= 0
			){

				//生地IDが未選択時の場合
				//生地IDが変更された際もともとデータが入っていたかのフラグを参照し、消去された場所にメッセージを表示する
				var radio = _this.$('input:radio[name="ca_orderType"]:checked');
				var val = radio.val();
				if (val == '1') {
					if (jk_flag){
						_this.validator.setErrorMsg( _this.$("#ca_jkStyle"), clmsg.cl_required);
					}else{
						_this.validator.clearErrorMsg( _this.$("#ca_jkStyle"));
					}
					if (sl_flag){
						_this.validator.setErrorMsg( _this.$("#ca_slStyle"), clmsg.cl_required);
					}else{
						_this.validator.clearErrorMsg( _this.$("#ca_slStyle"));
					}
				}else if (val == '2') {
					if (jk_flag){
						_this.validator.setErrorMsg( _this.$("#ca_jkStyle"), clmsg.cl_required);
					}else{
						_this.validator.clearErrorMsg( _this.$("#ca_jkStyle"));
					}
				}else if (val == '3') {
					if (sl_flag){
						_this.validator.setErrorMsg( _this.$("#ca_slStyle"), clmsg.cl_required);
					}else{
						_this.validator.clearErrorMsg( _this.$("#ca_slStyle"));
					}
				}else if (val == '4') {
					;
				}
				var $check = this.$("#ca_chkVest");
				var isVestChecked = $check.attr("checked");
				if (isVestChecked || val == '4') {
					if (ve_flag){
						this.validator.setErrorMsg( this.$("#ca_veStyle"), clmsg.cl_required);
					}else{
						_this.validator.clearErrorMsg( _this.$("#ca_veStyle"));
					}
				}
				
				
				return;
			}
			this.searchStyle();
			this.doSrcharrivalDate();

			//生地IDが変更された際もともとデータが入っていたかのフラグを参照し、消去された場所にメッセージを表示する
			var radio = _this.$('input:radio[name="ca_orderType"]:checked');
			var val = radio.val();
			if (val == '1') {
				if (jk_flag){
					_this.validator.setErrorMsg( _this.$("#ca_jkStyle"), clmsg.cl_required);
				}else{
					_this.validator.clearErrorMsg( _this.$("#ca_jkStyle"));
				}
				if (sl_flag){
					_this.validator.setErrorMsg( _this.$("#ca_slStyle"), clmsg.cl_required);
				}else{
					_this.validator.clearErrorMsg( _this.$("#ca_slStyle"));
				}
			}else if (val == '2') {
				if (jk_flag){
					_this.validator.setErrorMsg( _this.$("#ca_jkStyle"), clmsg.cl_required);
				}else{
					_this.validator.clearErrorMsg( _this.$("#ca_jkStyle"));
				}
			}else if (val == '3') {
				if (sl_flag){
					_this.validator.setErrorMsg( _this.$("#ca_slStyle"), clmsg.cl_required);
				}else{
					_this.validator.clearErrorMsg( _this.$("#ca_slStyle"));
				}
			}else if (val == '4') {
				;
			}
			var $check = this.$("#ca_chkVest");
			var isVestChecked = $check.attr("checked");
			if (isVestChecked || val == '4') {
				if (ve_flag){
					this.validator.setErrorMsg( this.$("#ca_veStyle"), clmsg.cl_required);
				}else{
					_this.validator.clearErrorMsg( _this.$("#ca_veStyle"));
				}
			}

			for(var i = 0; i < this.saveClothIDlist.length; i++){
				if (this.saveClothIDlist[i].id == Number(this.$("#ca_clothIDID").val())){
					//生地IDが見つかったのでそのプライスラインを表示
					this.$("#ca_price").val(clutil.comma(this.saveClothIDlist[i].priceLine));
					return;
				}
			}
			//生地IDが見つからないのでプライスラインを非表示
			this.$("#ca_price").val("");
			
			
			return;
		},
		/**
		 * 店舗の変更処理
		 * 画面の一部をクリアし、ブランドを検索する。
		 * */

		changeStore: function(){
			this._clearAllForm(_changeTypeArgs.STORE);
			
			// ベスト選択チェック押下不可
			this.$("#ca_chkVest").closest("label").removeClass("checked");
			this.$("#ca_chkVest").removeAttr("checked");
			this.$("#ca_chkVest").attr("disabled", true);
			$(this.$("#ca_chkVest").closest('label')).addClass("disabled");
			
			if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null || this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
				//存在しない場合、店舗の配下すべてクリアしロックをかける。
				this.jacketReadOnly(true);
				this.slacsReadOnly(true);
				this.vestReadOnly(true);
				this.$("#ca_brandID").val();		//ブランド
				clutil.viewReadonly(this.$("#ca_brandID_div"));
				$("#ca_brandID_autofill").hide();
				this.$("#ca_clothIDID").val('');		//生地ID
				clutil.viewReadonly(this.$("#ca_clothIDID_div"));
				$("#ca_clothNo_autofill").hide();
				return $.Deferred().resolve();
			}else{
				//今現在の入力可能項目を判定する。
				this._onOrderTypeChange();
				this._onVestChange();
			}
			//画面表示クリア

			this.clearBrandCombo(true);
//TODO
			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0230GetReq :{
						reqType: 2,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_MENS,
						storeID: this.$("#ca_storeID").autocomplete('clAutocompleteItem').id,
						orderDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
					}
			};

			var promise = clutil.postJSON('AMPOV0230', srchReq).done(_.bind(function(data){
				//console.log(arguments);
				var recs = data.AMPOV0230GetRsp.brandList;

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
				}
			}, this)).fail(_.bind(function(data){

			}, this));
			this.clearBrandCombo(false);

			return promise;
		},
//		ブランド検索してブランド項目を探す際の処理。
		clearBrandCombo: function(f_clear){
			if(f_clear){
				//コンボボックス初期化
				this.$("#ca_brandID").html('');		//ブランド
				this.$("#ca_brandID").selectpicker().selectpicker('refresh');
				clutil.viewReadonly(this.$("#ca_brandID_div"));
				$("#ca_brandID_autofill").hide();
				this.clearOptionCloth(true);
			}else{
				clutil.viewRemoveReadonly(this.$("#ca_brandID_div"));
				$("#ca_brandID_autofill").show();
				this.clearOptionCloth(false);
				this._onVestChange();
				//this.washableLock();
			}
			return ;
		},
		//TODO
		/**
		 * 生地・オプション検索して生地番号リスト項目・オプションリスト項目
		 * */
		doSrchOptionCloth: function(radio){
			if( this.$("#ca_brandID").val() == null || this.$("#ca_brandID").val()  <= 0){
				return;
			}
			clutil.viewRemoveReadonly(this.$("#ca_clothIDID_div"));
			$("#ca_clothNo_autofill").show();
			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0230GetReq :{
						reqType: 3,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_MENS,
						storeID: this.$("#ca_storeID").autocomplete('clAutocompleteItem').id,
						brandID: this.$("#ca_brandID").val(),
						orderDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
					}
			};

			clutil.postJSON('AMPOV0230', srchReq).done(_.bind(function(data){

				var clothIDListRecs = data.AMPOV0230GetRsp.clothIDList;
				var optionListRecs = data.AMPOV0230GetRsp.optionList;

				if(_.isEmpty(clothIDListRecs)){
					this.saveClothIDlist == null; //プライスライン検索用
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
					this.saveClothIDlist = clothIDListRecs; //プライスライン検索用用用
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
					this.showOptions(optionListRecs, radio);
				}
			}, this)).fail(_.bind(function(data){

			}, this));

			return;
		},
		
		doSrchOption: function(radio){
			if( this.$("#ca_brandID").val() == null || this.$("#ca_brandID").val()  <= 0){
				return;
			}
			clutil.viewRemoveReadonly(this.$("#ca_clothIDID_div"));
			$("#ca_clothNo_autofill").show();
			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0230GetReq :{
						reqType: 3,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_MENS,
						storeID: this.$("#ca_storeID").autocomplete('clAutocompleteItem').id,
						brandID: this.$("#ca_brandID").val(),
						orderDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
					}
			};

			clutil.postJSON('AMPOV0230', srchReq).done(_.bind(function(data){
				var optionListRecs = data.AMPOV0230GetRsp.optionList;
				if(_.isEmpty(optionListRecs) ){
					;
				}else{
					this.showOptions(optionListRecs, radio);
				}
			}, this)).fail(_.bind(function(data){

			}, this));
			
			return;
		},
		
		

		showOptions: function(recs, radio){
			var list_washable		= [];
			var list_jkSleeveButton	= [];
			var list_jkChangePocket	= [];
			var list_jkCuffs		= [];
			var list_jkAmfStitch	= [];
			var list_jkChangeButton	= [];
			var list_jkOdaiba		= [];
			var list_jkChangeLining	= [];
			var list_jkSummerType	= [];
			var list_slAdjuster		= [];
			var list_slSpareAdjuster	= [];
			var list_slChangeButton	= [];
			var list_veChangeButton	= [];
			var list_stChangeButton	= [];
			var list_veChangeLining	= [];
			var list_veOptAmfStitch	= [];

			for (var i = 0; i < recs.length; i++){
				var cn = {
						id: recs[i].optionID,
						code: recs[i].seq,
						name: recs[i].comment,
				};
				switch(recs[i].poOptTypeID){
				case amcm_type.AMCM_TYPE_WASHABLE_TYPE:
					list_washable.push(cn);
					break;
				case amcm_type.AMCM_TYPE_FOUR_ARM_BUTTON_TYPE:
					list_jkSleeveButton.push(cn);
					break;
				case amcm_type.AMCM_TYPE_CHANGE_POCKET_TYPE:
					list_jkChangePocket.push(cn);
					break;
				case amcm_type.AMCM_TYPE_REAL_BUTTON_HOLE_TYPE:
					list_jkCuffs.push(cn);
					break;
				case amcm_type.AMCM_TYPE_AMF_STITCH_OPTION_TYPE:
					if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						list_jkAmfStitch.push(cn);
					}else if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
						list_veOptAmfStitch.push(cn);
					}else{
						;
					}
					break;
				case amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE:
					if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						list_jkChangeButton.push(cn);
					}else if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
						list_slChangeButton.push(cn);
					}else if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
						list_veChangeButton.push(cn);
					}else if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
						list_stChangeButton.push(cn);
					}else{
						;
					}
					break;
				case amcm_type.AMCM_TYPE_ODAIBA_TYPE:
					list_jkOdaiba.push(cn);
					break;
				case amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE:
					if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						list_jkChangeLining.push(cn);
					}else if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
						list_veChangeLining.push(cn);
					}else{
						;
					}
					break;
				case amcm_type.AMCM_TYPE_SUMMAR_SPEC_TYPE:
					//移行の際にはなぜかスラックスのサマー使用もできるのでここで排除する
					if(recs[i].styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						list_jkSummerType.push(cn);
					}else{
						;
					}
					break;
				case amcm_type.AMCM_TYPE_ADJUSTER_TYPE:
					list_slAdjuster.push(cn);
					//スペアも同じものを入れる
					list_slSpareAdjuster.push(cn);
					break;
				case amcm_type.AMCM_TYPE_SP_ADJUSTER_TYPE:
//					list_slSpareAdjuster.push(cn);
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
				$select	:this.$("#ca_veOptAmfStitch"),
				list:list_veOptAmfStitch,
				unselectedflag:true
			}, 'veOptAmfStitch', this);
//			buildSelector({
//				$select	:this.$("#ca_washable"),
//				list:list_washable,
//				unselectedflag:true
//			}, 'washable', this);
			buildSelector({
				$select	:this.$("#ca_jkSleeveButton"),
				list:list_jkSleeveButton,
				unselectedflag:true
			}, 'jkSleeveButton', this);
			buildSelector({
				$select	:this.$("#ca_jkChangePocket"),
				list:list_jkChangePocket,
				unselectedflag:true
			}, 'jkChangePocket', this);
			buildSelector({
				$select	:this.$("#ca_jkCuffs"),
				list:list_jkCuffs,
				unselectedflag:true
			}, 'jkCuffs', this);
			buildSelector({
				$select	:this.$("#ca_jkAmfStitch"),
				list:list_jkAmfStitch,
				unselectedflag:true
			}, 'jkAmfStitch', this);
			
			
			
			if(radio == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){
				buildSelector({
					$select	:this.$("#ca_jkChangeButton"),
					list:list_stChangeButton,
					unselectedflag:true
				}, 'jkChangeButton', this);
			}
			else{
				buildSelector({
					$select	:this.$("#ca_jkChangeButton"),
					list:list_jkChangeButton,
					unselectedflag:true
				}, 'jkChangeButton', this);
			}
			
			
			buildSelector({
				$select	:this.$("#ca_jkOdaiba"),
				list:list_jkOdaiba,
				unselectedflag:true
			}, 'jkOdaiba', this);
			buildSelector({
				$select	:this.$("#ca_jkChangeLining"),
				list:list_jkChangeLining,
				unselectedflag:true
			}, 'jkChangeLining', this);
			buildSelector({
				$select	:this.$("#ca_jkSummerType"),
				list:list_jkSummerType,
				unselectedflag:true
			}, 'jkSummerType', this);
			buildSelector({
				$select	:this.$("#ca_slAdjuster"),
				list:list_slAdjuster,
				unselectedflag:true
			}, 'slAdjuster', this);
			buildSelector({
				$select	:this.$("#ca_slSpareAdjuster"),
				list:list_slSpareAdjuster,
				unselectedflag:true
			}, 'slSpareAdjuster', this);
			buildSelector({
				$select	:this.$("#ca_slChangeButton"),
				list:list_slChangeButton,
				unselectedflag:true
			}, 'slChangeButton', this);


			clutil.initUIelement(this.$el);
			return this;
		},
//		生地・オプション検索し、入力制限をかける。入力制限解除もここで行う。
		clearOptionCloth: function(f_clear){
			if(f_clear){
				//コンボボックス初期化
				this.$("#ca_clothIDID").html('');		//生地番号
				this.$("#ca_clothIDID").selectpicker().selectpicker('refresh');
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
				$("#ca_clothNo_autofill").hide();
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
				if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null || this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
					return;
				}
				if( this.$("#ca_brandID").val() == null || this.$("#ca_brandID").val()  <= 0){
					//ブランドも決まっていない場合は使用不可
					return;
				}
				clutil.viewRemoveReadonly(this.$("#ca_clothIDID_div"));
				$("#ca_clothNo_autofill").show();
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
//			var _this = this;
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
					AMPOV0230GetReq :{
						reqType: 4,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_MENS,
						storeID: this.$("#ca_storeID").autocomplete('clAutocompleteItem').id,
						brandID: this.$("#ca_brandID").val(),
						clothIDID:this.$("#ca_clothIDID").val(),
						orderDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
					}
			};

			clutil.postJSON('AMPOV0230', srchReq).done(_.bind(function(data){
				//console.log(arguments);
				var recs = data.AMPOV0230GetRsp.arrivalDateList;
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
//			var rec = data.AMPOV0230GetRsp;
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
