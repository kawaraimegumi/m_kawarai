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
			"change #ca_sleeveTypeID" 	: "_sleeveTypeChange",
			"change #ca_InsOldDate"	: "_onInsOldDataChange",		// 過去日変更
			"change #ca_brandID" 	: "_BrandTypeChange",
			"change #ca_clothNo" 	: "_clothNoChange",
			"change #ca_doAdjTypeID"	: "_doAdjTypeIDChange",
			"change #ca_formTypeID"	: "_formTypeIDChange",
//			"change #ca_storeID" 	: "changeStore",
			"click #ca_btn_store_select"				: "_onStoreSelClick",	// 店舗選択
			"click #ca_btn_guest_select"				: "_onGuestSelClick",	// 顧客調査
			"clDatepickerOnSelect #ca_orderDate" : "changeStore",	//注文日変更
			"change #ca_orderDate" : "changeStore",	//注文日変更
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
						title: 'POシャツ発注登録',
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
//									label:(o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)?
//											'一覧に戻る':'クリア',
//											action: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)?
//													undefined:this._doNewCancel
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

			// 袖区分
			clutil.cltypeselector(this.$("#ca_sleeveTypeID"), amcm_type.AMCM_TYPE_ARM_TYPE);
			// 補正有無区分
			clutil.cltypeselector(this.$("#ca_doAdjTypeID"), amcm_type.AMCM_TYPE_IS_RESIZED);
			// 字体
//			clutil.cltypeselector(this.$("#ca_formTypeID"), amcm_type.AMCM_TYPE_FORM_TYPE);
			//店舗補正区分
			clutil.cltypeselector(this.$("#ca_otStoreAdjTypeID"), amcm_type.AMCM_TYPE_RESIZE_AT_STORE);

			$("#tp_InsOldDateInput").tooltip({html: true});
			$("#tp_tel").tooltip({html: true});
			$("#tp_shoulder").tooltip({html: true});
			$("#tp_chest").tooltip({html: true});
			$("#tp_waist").tooltip({html: true});
			$("#tp_bottom").tooltip({html: true});
			$("#tp_length_opt").tooltip({html: true});
			$("#tp_leftCuff").tooltip({html: true});
			$("#tp_rightCuff").tooltip({html: true});
			$("#tp_target1").tooltip({html: true});
			$("#tp_target2").tooltip({html: true});
			$("#tp_target3").tooltip({html: true});
			$("#tp_target4").tooltip({html: true});
			$("#tp_target5").tooltip({html: true});
			$("#tp_initial").tooltip({html: true});

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
			clutil.cltxtFieldLimit($("#ca_initialEn2_L"));
			clutil.cltxtFieldLimit($("#ca_otRcptNo"));
			clutil.cltxtFieldLimit($("#ca_otStoreMemo"));
//			clutil.cltxtFieldLimit($("#ca_telNo1"));
//			clutil.cltxtFieldLimit($("#ca_telNo2"));
//			clutil.cltxtFieldLimit($("#ca_telNo3"));
			//初期状態では隠しておく
			$("#ca_initialEn2_L").hide();
			$("#ca_initialEn2_L_span").hide();


			this.initUIElement_AMPAV0010();


			return this;
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
					var d = myView.changeStore();
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
				this._doAdjTypeIDChange();
			} else {
				this.mdBaseView.fetch();	// 新規だろうとなんだろうとデータを GET してくる。
			}

			return this;
		},
		/**
		 * 対象チェックボタン変更
		 * 期間制御でも入れようかと思ったけど更新データの場合の制御がわからなくなるので
		 */
		_onInsOldDataChange: function(){
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
		setReadOnlyAllItems: function(readOnly){
			if (readOnly == true){
				clutil.viewReadonly($("#ca_base_form"));
				clutil.viewReadonly($("#ca_guest_form"));
				clutil.viewReadonly($("#ca_order_form"));
				clutil.viewReadonly($("#ca_body_form"));
				clutil.viewReadonly($("#ca_collar_form"));
				clutil.viewReadonly($("#ca_cuffs_form"));
				clutil.viewReadonly($("#ca_type_form"));
				clutil.viewReadonly($("#ca_pocket_form"));
				clutil.viewReadonly($("#ca_initial_form"));
				clutil.viewReadonly($("#ca_other_form"));
				this.$("#ca_InsOldDate").attr("disabled", true);
				$(this.$("#ca_InsOldDate").closest('label')).addClass("disabled");
			}else{
				clutil.viewRemoveReadonly($("#ca_base_form"));
				clutil.viewRemoveReadonly($("#ca_guest_form"));
				clutil.viewRemoveReadonly($("#ca_order_form"));
				clutil.viewRemoveReadonly($("#ca_body_form"));
				clutil.viewRemoveReadonly($("#ca_collar_form"));
				clutil.viewRemoveReadonly($("#ca_cuffs_form"));
				clutil.viewRemoveReadonly($("#ca_type_form"));
				clutil.viewRemoveReadonly($("#ca_pocket_form"));
				clutil.viewRemoveReadonly($("#ca_initial_form"));
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

		},
		/**
		 * フィールドのデータクリア
		 * type	:変更箇所
		 */
		_clearAllForm:function(type){
			this._clearBaseForm(type);
			this._clearGuestForm(type);
			this._clearOrderForm(type);
			this._clearBodyForm(type);
			this._clearCollarForm(type);
			this._clearCuffsForm(type);
			this._clearTypeForm(type);
			this._clearPocketForm(type);
			this._clearInitialForm(type);
			this._clearOtherForm(type);
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this._doAdjTypeIDChange();
				this._formTypeIDChange();
			}
			clutil.cltxtFieldLimitReset($("#ca_userID"));
			clutil.cltxtFieldLimitReset($("#ca_custName"));
			clutil.cltxtFieldLimitReset($("#ca_custNameKana"));
			clutil.cltxtFieldLimitReset($("#ca_membNo"));
			clutil.cltxtFieldLimitReset($("#ca_initialEn2_L"));
			clutil.cltxtFieldLimitReset($("#ca_otRcptNo"));
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
				clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', clcom.getOpeDate());
			}else if(type == _changeTypeArgs.NEXTITEM){
				//チェックボックスのチェックを外す
				this.$("#ca_InsOldDate").closest("label").removeClass("checked");
				this.$("#ca_InsOldDate").removeAttr("checked");
				this.$("#ca_no").val("");
				clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', clcom.getOpeDate());
			}else if(type == _changeTypeArgs.STORE){
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
		_clearOrderForm:function(type){
			if(type == _changeTypeArgs.ALL){
				this.$("#ca_brandID").val("");
				this.$("#ca_clothNo").val("");
				this.$("#ca_cnt").val("");
				clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', -1);
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
				clutil.datepicker(this.$("#ca_saleDate")).datepicker('setIymd', -1);
				//チェックボックスのチェックを外す
				this.$("#ca_hurryFlag").closest("label").removeClass("checked");
				this.$("#ca_hurryFlag").removeAttr("checked");
			}else if(type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_brandID").val("");
				this.$("#ca_clothNo").val("");
				this.$("#ca_cnt").val("");
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
				clutil.datepicker(this.$("#ca_saleDate")).datepicker('setIymd', -1);
				//チェックボックスのチェックを外す
				this.$("#ca_hurryFlag").closest("label").removeClass("checked");
				this.$("#ca_hurryFlag").removeAttr("checked");
			}else if(type == _changeTypeArgs.STORE){
				this.$("#ca_brandID").val("");
				this.$("#ca_clothNo").val("");
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
			}else if(type == _changeTypeArgs.BRAND){
				this.$("#ca_clothNo").val("");
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
			}else if(type == _changeTypeArgs.CLOTH){
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
			}else if(type == _changeTypeArgs.ORDDAY){
				clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', -1);
			}

		},
		_clearBodyForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_bodyTypeTypeID").val("");
				this.$("#ca_sleeveTypeID").val("");
				this.$("#ca_neckSize").val("");
				this.$("#ca_doAdjTypeID").val("");
				this.$("#ca_leftDegree").val("");
				this.$("#ca_shoulder").val("");
				this.$("#ca_rightDegree").val("");
				this.$("#ca_chest").val("");
				this.$("#ca_waist").val("");
				this.$("#ca_bottom").val("");
				this.$("#ca_length_opt").val("");
				this.$("#ca_leftCuff").val("");
				this.$("#ca_rightCuff").val("");
			}else if( type == _changeTypeArgs.BRAND || type == _changeTypeArgs.STORE){
				this.$("#ca_bodyTypeTypeID").val("");
				this.$("#ca_sleeveTypeID").val("");
				this.$("#ca_neckSize").val("");
				this.$("#ca_doAdjTypeID").val("");
				this.$("#ca_leftDegree").val("");
				this.$("#ca_shoulder").val("");
				this.$("#ca_rightDegree").val("");
				this.$("#ca_chest").val("");
				this.$("#ca_waist").val("");
				this.$("#ca_bottom").val("");
				this.$("#ca_length_opt").val("");
				this.$("#ca_leftCuff").val("");
				this.$("#ca_rightCuff").val("");
			}
		},
		_clearCollarForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_collar1TypeID").val("");
				this.$("#ca_collar2TypeID").val("");
				this.$("#ca_clericTypeID").val("");
				this.$("#ca_interLiningTypeID").val("");
			}else if(type == _changeTypeArgs.BRAND || type == _changeTypeArgs.STORE){
				this.$("#ca_collar1TypeID").val("");
				this.$("#ca_collar2TypeID").val("");
				this.$("#ca_clericTypeID").val("");
				this.$("#ca_interLiningTypeID").val("");
			};
		},
		_clearCuffsForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_cuffsTypeTypeID").val("");
			}else if(type == _changeTypeArgs.BRAND || type == _changeTypeArgs.STORE){
				this.$("#ca_cuffsTypeTypeID").val("");
			};
		},
		_clearTypeForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_frontTypeID").val("");
				this.$("#ca_amfStitchTypeID").val("");
				this.$("#ca_backTypeID").val("");
			}else if(type == _changeTypeArgs.BRAND || type == _changeTypeArgs.STORE){
				this.$("#ca_frontTypeID").val("");
				this.$("#ca_amfStitchTypeID").val("");
				this.$("#ca_backTypeID").val("");
			};
		},
		_clearPocketForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_pocketTypeID").val("");
				this.$("#ca_pocketChiefTypeID").val("");
				this.$("#ca_buttonTypeID").val("");
				this.$("#ca_buttonHoleTypeID").val("");
				this.$("#ca_buttonThreadTypeID").val("");
			}else if(type == _changeTypeArgs.BRAND || type == _changeTypeArgs.STORE){
				this.$("#ca_pocketTypeID").val("");
				this.$("#ca_pocketChiefTypeID").val("");
				this.$("#ca_buttonTypeID").val("");
				this.$("#ca_buttonHoleTypeID").val("");
				this.$("#ca_buttonThreadTypeID").val("");
			};
		},
		_clearInitialForm:function(type){
			if(type == _changeTypeArgs.ALL || type == _changeTypeArgs.NEXTITEM){
				this.$("#ca_initialTypeID").val("");
				this.$("#ca_formTypeID").val("");
				this.$("#ca_initialEn1").val("");
				this.$("#ca_initialEn2_S").val("");
				this.$("#ca_initialEn2_L").val("");
				this.$("#ca_placeTypeID").val("");
				this.$("#ca_colorTypeID").val("");
			}else if(type == _changeTypeArgs.BRAND || type == _changeTypeArgs.STORE){
				this.$("#ca_initialTypeID").val("");
				this.$("#ca_formTypeID").val("");
				this.$("#ca_initialEn1").val("");
				this.$("#ca_initialEn2_S").val("");
				this.$("#ca_initialEn2_L").val("");
				this.$("#ca_placeTypeID").val("");
				this.$("#ca_colorTypeID").val("");
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
				console.log('srch NG', arguments);
				clutil.showDialog("顧客情報が取得できません。");
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
			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.setFocus($('#ca_userID'));
			}else{
				clutil.setFocus($('#ca_storeID'));
			}
			this.changeStore();
			this.validator.clear();
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
					//新規なので画面に表示・ダイアログ表示
					this.$("#ca_no").val(data.AMPOV0250UpdRsp.newNo);
//					clutil.showDialog("管理番号 [" + data.AMPOV0250UpdRsp.newNo + "] で登録しました。", function(){
//						console.log('OK', arguments);
//						_this._doNewCancel();
//					});
					clutil.ConfirmDialog("管理番号 [" + data.AMPOV0250UpdRsp.newNo + "] で登録しました。</br>連続登録しますか？", function(_this){
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
					this.options.chkData[args.index].poOrderID = data.AMPOV0250GetRsp.order.poOrderID;
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
//					if(data.AMPOV0250GetRsp.order.pastFlag > 0){
////						clutil.viewReadonly(this.$("#ca_orderDate_div"));
//						this.$("#ca_InsOldDateInput_div_div").show();
//						this.$("#ca_InsOldDateInput").addClass("cl_required");
//						clutil.datepicker(this.$("#ca_InsOldDateInput")).datepicker('setIymd', data.AMPOV0250GetRsp.order.orderDate );
//					}
					clutil.datepicker(this.$("#ca_orderDate")).datepicker('setIymd', clcom.getOpeDate());
					clutil.datepicker(this.$("#ca_arrivalDate")).datepicker('setIymd', data.AMPOV0250GetRsp.arrivalDateList[0].arrivalDate );
					clutil.datepicker(this.$("#ca_saleDate")).datepicker('setIymd', clutil.addDate(data.AMPOV0250GetRsp.arrivalDateList[0].arrivalDate, 1));
					//コピーの場合、変更なしデータの登録に関しては警告を出すので比較用にデータを保持しておく
					_copy_rec = data;
					_copy_rec.AMPOV0250GetRsp.order.orderDate = clcom.getOpeDate();
					_copy_rec.AMPOV0250GetRsp.order.arrivalDate = data.AMPOV0250GetRsp.arrivalDateList[0].arrivalDate;
					_copy_rec.AMPOV0250GetRsp.order.saleDate = clutil.addDate(data.AMPOV0250GetRsp.arrivalDateList[0].arrivalDate, 1);
					//複製なので新規登録とする
					this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
					clutil.setFocus($('#ca_storeID'));
					break;
				default:
					//一覧から来た場合、過去商品発注日関係は動かせなくする。
					//チェックボックスは使用禁止
//					if(data.AMPOV0250GetRsp.order.pastFlag > 0){
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
			var brandRecs = data.AMPOV0250GetRsp.brandList;
			var clothIDListRecs = data.AMPOV0250GetRsp.clothIDList;
			var optionListRecs = data.AMPOV0250GetRsp.optionList;
			//オプション
			if(_.isEmpty(optionListRecs) ){
				;
			}else{
				this.showOptions(optionListRecs);
			}
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
			}
			//生地
			if(_.isEmpty(clothIDListRecs)){
				var clothIDlist = [];
				var opt = {
						$select	:this.$("#ca_clothNo"),
						list:clothIDlist,
						unselectedflag:true,
						selectpicker: {
							noButton: true
						}
				};
				destroySelectpicker(opt.$select);
				clutil.cltypeselector3(opt);
				this.selector3Opts['clothNo'] = opt;
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
						$select	:this.$("#ca_clothNo"),
						list:clothIDlist,
						unselectedflag:true,
						selectpicker: {
							noButton: true
						}
				};
				destroySelectpicker(opt.$select);
				clutil.cltypeselector3(opt);
				this.selector3Opts['clothNo'] = opt;
			}
			data.AMPOV0250GetRsp.order.userID={
					id: data.AMPOV0250GetRsp.order.userID,
					code: data.AMPOV0250GetRsp.order.userCode,
					name:null
			};
			data.AMPOV0250GetRsp.order.clothNo	= data.AMPOV0250GetRsp.order.clothIDID;
			clutil.data2view(this.$('#ca_base_form'), data.AMPOV0250GetRsp.order);
			//店舗オートコンプリートに情報表示
			this.utl_store.setValue({
				id: data.AMPOV0250GetRsp.order.storeID,
				code: data.AMPOV0250GetRsp.order.storeCode,
				name: data.AMPOV0250GetRsp.order.storeName});
			if(data.AMPOV0250GetRsp.order.pastFlag > 0){
				this.$("#ca_InsOldDate").closest("label").addClass("checked");
				this.$("#ca_InsOldDate").attr("checked", "checked");
			}
			clutil.data2view(this.$('#ca_guest_form'), data.AMPOV0250GetRsp.order);
			clutil.data2view(this.$('#ca_order_form'), data.AMPOV0250GetRsp.order);

//			data.AMPOV0250GetRsp.body.bodyTypeTypeID	= data.AMPOV0250GetRsp.body.bodyType;
			var bodyRec = {
					bodyTypeTypeID:	data.AMPOV0250GetRsp.body.bodyType,
					sleeveTypeID:	data.AMPOV0250GetRsp.body.sleeveTypeID,
					neckSize:		data.AMPOV0250GetRsp.body.neckSize,
					doAdjTypeID:	data.AMPOV0250GetRsp.body.doAdjTypeID,
					leftDegree:		data.AMPOV0250GetRsp.body.leftDegree,
					shoulder:		data.AMPOV0250GetRsp.body.shoulder,
					rightDegree:	data.AMPOV0250GetRsp.body.rightDegree,
					chest:			data.AMPOV0250GetRsp.body.chest,
					waist:			data.AMPOV0250GetRsp.body.waist,
					bottom:			data.AMPOV0250GetRsp.body.bottom,
					length_opt:		data.AMPOV0250GetRsp.body.len,
					leftCuff:		data.AMPOV0250GetRsp.body.leftCuff,
					rightCuff:		data.AMPOV0250GetRsp.body.rightCuff
			};
			data.AMPOV0250GetRsp.collar.collar1TypeID	= data.AMPOV0250GetRsp.collar.collar1;
			data.AMPOV0250GetRsp.collar.collar2TypeID	= data.AMPOV0250GetRsp.collar.collar2;
			data.AMPOV0250GetRsp.collar.clericTypeID	= data.AMPOV0250GetRsp.collar.cleric;
			data.AMPOV0250GetRsp.collar.interLiningTypeID	= data.AMPOV0250GetRsp.collar.interLining;
			data.AMPOV0250GetRsp.cuffs.cuffsTypeTypeID	= data.AMPOV0250GetRsp.cuffs.cuffsType;
			data.AMPOV0250GetRsp.migoro.frontTypeID		= data.AMPOV0250GetRsp.migoro.front;
			data.AMPOV0250GetRsp.migoro.backTypeID		= data.AMPOV0250GetRsp.migoro.back;
			data.AMPOV0250GetRsp.migoro.amfStitchTypeID	= data.AMPOV0250GetRsp.migoro.amfStitch;
			data.AMPOV0250GetRsp.pktbtn.pocketTypeID	= data.AMPOV0250GetRsp.pktbtn.pocket;
			data.AMPOV0250GetRsp.pktbtn.pocketChiefTypeID	= data.AMPOV0250GetRsp.pktbtn.pocketChief;
			data.AMPOV0250GetRsp.pktbtn.buttonTypeID	= data.AMPOV0250GetRsp.pktbtn.button;
			data.AMPOV0250GetRsp.pktbtn.buttonHoleTypeID	= data.AMPOV0250GetRsp.pktbtn.buttonHole;
			data.AMPOV0250GetRsp.pktbtn.buttonThreadTypeID	= data.AMPOV0250GetRsp.pktbtn.buttonThread;
			data.AMPOV0250GetRsp.initial.initialTypeID	= data.AMPOV0250GetRsp.initial.initial;
			data.AMPOV0250GetRsp.initial.formTypeID		= data.AMPOV0250GetRsp.initial.form;
			data.AMPOV0250GetRsp.initial.placeTypeID	= data.AMPOV0250GetRsp.initial.place;
			data.AMPOV0250GetRsp.initial.colorTypeID	= data.AMPOV0250GetRsp.initial.color;
			data.AMPOV0250GetRsp.initial.initialEn2_S	= data.AMPOV0250GetRsp.initial.initialEn2;
			data.AMPOV0250GetRsp.initial.initialEn2_L	= data.AMPOV0250GetRsp.initial.initialEn2;

			var formTypeName = "";
			var formType = data.AMPOV0250GetRsp.initial.formTypeID;
			if(this.selectorVal2Item('formTypeID', formType) != null){
				formTypeName = this.selectorVal2Item('formTypeID', formType).name;
				if(formTypeName.match(/フルネ.ム/)){
					//フル
					data.AMPOV0250GetRsp.initial.initialEn2_S	= "";
					$("#ca_initialEn2_S").hide();
					$("#ca_initialEn2_L").show();
					$("#ca_initialEn2_L_span").show();
					clutil.cltxtFieldLimitReset($("#ca_initialEn2_L"));
				}else{
					data.AMPOV0250GetRsp.initial.initialEn2_L	= "";
					$("#ca_initialEn2_S").show();
					$("#ca_initialEn2_L").hide();
					$("#ca_initialEn2_L_span").hide();
				}
			}else{
				$("#ca_initialEn1").val("");
				$("#ca_initialEn2_S").val("");
				$("#ca_initialEn2_L").val("");
				$("#ca_initialEn2_S").show();
				$("#ca_initialEn2_L").hide();
				$("#ca_initialEn2_L_span").hide();
				clutil.viewReadonly(this.$("#ca_initialEn_div"));
			}
			clutil.data2view(this.$('#ca_collar_form'),	data.AMPOV0250GetRsp.collar);
			clutil.data2view(this.$('#ca_cuffs_form'),	data.AMPOV0250GetRsp.cuffs);
			clutil.data2view(this.$('#ca_type_form'),	data.AMPOV0250GetRsp.migoro);
			clutil.data2view(this.$('#ca_pocket_form'),	data.AMPOV0250GetRsp.pktbtn);
			clutil.data2view(this.$('#ca_initial_form'),	data.AMPOV0250GetRsp.initial);
			clutil.data2view(this.$('#ca_other_form'),	data.AMPOV0250GetRsp.other);
			clutil.data2view(this.$('#ca_body_form'),	bodyRec);
			//入力制限修正
			clutil.cltxtFieldLimitReset($("#ca_userID"));
			clutil.cltxtFieldLimitReset($("#ca_custName"));
			clutil.cltxtFieldLimitReset($("#ca_custNameKana"));
			clutil.cltxtFieldLimitReset($("#ca_membNo"));
			clutil.cltxtFieldLimitReset($("#ca_initialEn2_L"));
			clutil.cltxtFieldLimitReset($("#ca_otRcptNo"));
			//TODO
			if(bodyRec.sleeveTypeID == amcm_type.AMCM_VAL_ARM_TYPE_SHORT){
				this.$("#ca_leftDegree").val("");
				this.$("#ca_rightDegree").val("");
				this.$("#ca_leftCuff").val("");
				this.$("#ca_rightCuff").val("");
				this.$("#ca_cuffsTypeTypeID").val("");
				clutil.viewReadonly(this.$("#ca_leftDegree_div"));
				clutil.viewReadonly(this.$("#ca_rightDegree_div"));
				clutil.viewReadonly(this.$("#ca_leftCuff_div"));
				clutil.viewReadonly(this.$("#ca_rightCuff_div"));
				clutil.viewReadonly(this.$("#ca_cuffsTypeTypeID_div"));
		}
			this._doAdjTypeIDChange();
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

			var base =		 clutil.view2data(this.$('#ca_base_form'));
			var guest =		 clutil.view2data(this.$('#ca_guest_form'));
			var order =		 clutil.view2data(this.$('#ca_order_form'));
			var body	=	 clutil.view2data(this.$('#ca_body_form'));
			var collar	=	 clutil.view2data(this.$('#ca_collar_form'));
			var cuffs	=	 clutil.view2data(this.$('#ca_cuffs_form'));
			var migoro	=	 clutil.view2data(this.$('#ca_type_form'));
			var pktbtn	=	 clutil.view2data(this.$('#ca_pocket_form'));
			var initial	=	 clutil.view2data(this.$('#ca_initial_form'));
			var other	=	 clutil.view2data(this.$('#ca_other_form'));

			order.poTypeID	= amcm_type.AMCM_VAL_PO_CLASS_SHIRT;
			order.recno		= base.recno;
			order.state		= base.state;
			order.firstID	= base.firstID;
			order.poOrderID	= base.poOrderID;
			order.no		= base.no;
			order.userID	= base.userID;
			if (base._view2data_storeID_cn != null){
				order.storeID	= base._view2data_storeID_cn.id;
				order.storeCode	= base._view2data_storeID_cn.code;
				order.storeName	= base._view2data_storeID_cn.name;
			}
			order.telNo1	= guest.telNo1;
			order.telNo2	= guest.telNo2;
			order.telNo3	= guest.telNo3;
			order.custName	= guest.custName;
			order.custNameKana	= guest.custNameKana;
			order.membNo	= guest.membNo;
			order.clothIDID	= order.clothNo;
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
			body.bodyType	= body.bodyTypeTypeID;
			body.len	= body.length_opt;
			collar.collar1	= collar.collar1TypeID;
			collar.collar2	= collar.collar2TypeID;
			collar.cleric	= collar.clericTypeID;
			collar.interLining	= collar.interLiningTypeID;
			cuffs.cuffsType	= cuffs.cuffsTypeTypeID;
			migoro.front	= migoro.frontTypeID;
			migoro.back	= migoro.backTypeID;
			migoro.amfStitch	= migoro.amfStitchTypeID;
			pktbtn.pocket	= pktbtn.pocketTypeID;
			pktbtn.pocketChief	= pktbtn.pocketChiefTypeID;
			pktbtn.button	= pktbtn.buttonTypeID;
			pktbtn.buttonHole	= pktbtn.buttonHoleTypeID;
			pktbtn.buttonThread	= pktbtn.buttonThreadTypeID;
			initial.initial	= initial.initialTypeID;
			initial.form	= initial.formTypeID;
			initial.place	= initial.placeTypeID;
			initial.color	= initial.colorTypeID;
			initial.initialEn2 = ""; //空白を入れておく実際に値があったら次ではいるはず。
			if(initial.initialEn2_S != ""){
				initial.initialEn2	= initial.initialEn2_S;
			}
			if(initial.initialEn2_L != ""){
				initial.initialEn2	= initial.initialEn2_L;
			}
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

			if( (this.$("#ca_cnt").val() != "") && (order.cnt > 99 || order.cnt <= 0)){
				//枚数は1から99まで3ケタ入らない設定なので上限はいらないと思うが
				f_error = true;
				this.validator.setErrorMsg( this.$("#ca_cnt"), "枚数は1枚～99枚までの間で指定して下さい");
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
					body  : body,
					collar  : collar,
					cuffs  : cuffs,
					migoro  : migoro,
					pktbtn  : pktbtn,
					initial  : initial,
					other  : other
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}
			var reqObj = {
					reqHead : reqHead,
					AMPOV0250UpdReq  : updReq
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
			if(!this._chk_copy_body(updReq)){
				return false;
			}
			if(!this._chk_copy_collar(updReq)){
				return false;
			}
			if(!this._chk_copy_cuffs(updReq)){
				return false;
			}
			if(!this._chk_copy_migoro(updReq)){
				return false;
			}
			if(!this._chk_copy_pktbtn(updReq)){
				return false;
			}
			if(!this._chk_copy_initial(updReq)){
				return false;
			}
			if(!this._chk_copy_other(updReq)){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_order: function(updReq){
			var org_data = _copy_rec.AMPOV0250GetRsp.order;
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
			//枚数(必須)
			if(org_data.cnt != new_data.cnt){
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
			//電話番号1(必須)
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
			//短納期フラグ
			old_rec = (org_data.hurryFlag == null)? 0: org_data.hurryFlag;
			new_rec = (new_data.hurryFlag == null)? 0: new_data.hurryFlag;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_body: function(updReq){
			var org_data = _copy_rec.AMPOV0250GetRsp.body;
			var new_data = updReq.body;
			var old_rec;
			var new_rec;
			//ボディ型
			old_rec = (org_data.bodyType == null)? 0: org_data.bodyType;
			new_rec = (new_data.bodyType == null)? 0: new_data.bodyType;
			if(old_rec != new_rec){
				return false;
			}
			//首回り
			old_rec = (org_data.neckSize == null)? 0: org_data.neckSize;
			new_rec = (new_data.neckSize == null)? 0: new_data.neckSize;
			if(old_rec != new_rec){
				return false;
			}
			//裄丈（左）
			old_rec = (org_data.leftDegree == null)? 0: org_data.leftDegree;
			new_rec = (new_data.leftDegree == null)? 0: new_data.leftDegree;
			if(old_rec != new_rec){
				return false;
			}
			//裄丈（右）
			old_rec = (org_data.rightDegree == null)? 0: org_data.rightDegree;
			new_rec = (new_data.rightDegree == null)? 0: new_data.rightDegree;
			if(old_rec != new_rec){
				return false;
			}
			//袖
			old_rec = (org_data.sleeveTypeID == null)? 0: org_data.sleeveTypeID;
			new_rec = (new_data.sleeveTypeID == null)? 0: new_data.sleeveTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//補正
			old_rec = (org_data.doAdjTypeID == null)? 0: org_data.doAdjTypeID;
			new_rec = (new_data.doAdjTypeID == null)? 0: new_data.doAdjTypeID;
			if(old_rec != new_rec){
				return false;
			}
			//肩幅補正オプション
			old_rec = (org_data.shoulder == null)? 0: org_data.shoulder;
			new_rec = (new_data.shoulder == null)? 0: new_data.shoulder;
			if(old_rec != new_rec){
				return false;
			}
			//胸回り補正オプション
			old_rec = (org_data.chest == null)? 0: org_data.chest;
			new_rec = (new_data.chest == null)? 0: new_data.chest;
			if(old_rec != new_rec){
				return false;
			}
			//胴回り補正オプション
			old_rec = (org_data.waist == null)? 0: org_data.waist;
			new_rec = (new_data.waist == null)? 0: new_data.waist;
			if(old_rec != new_rec){
				return false;
			}
			//裾回り補正オプション
			old_rec = (org_data.bottom == null)? 0: org_data.bottom;
			new_rec = (new_data.bottom == null)? 0: new_data.bottom;
			if(old_rec != new_rec){
				return false;
			}
			//身丈補正オプション
			old_rec = (org_data.len == null)? 0: org_data.len;
			new_rec = (new_data.len == null)? 0: new_data.len;
			if(old_rec != new_rec){
				return false;
			}
			//カフス回り（左）補正オプション
			old_rec = (org_data.leftCuff == null)? 0: org_data.leftCuff;
			new_rec = (new_data.leftCuff == null)? 0: new_data.leftCuff;
			if(old_rec != new_rec){
				return false;
			}
			//カフス回り（右）補正オプション
			old_rec = (org_data.rightCuff == null)? 0: org_data.rightCuff;
			new_rec = (new_data.rightCuff == null)? 0: new_data.rightCuff;
			if(old_rec != new_rec){
				return false;
			}

			//全く同じ
			return true;
		},
		_chk_copy_collar: function(updReq){
			org_data = _copy_rec.AMPOV0250GetRsp.collar;
			new_data = updReq.collar;
			var old_rec;
			var new_rec;
			//衿型標準オプション１
			old_rec = (org_data.collar1 == null)? 0: org_data.collar1;
			new_rec = (new_data.collar1 == null)? 0: new_data.collar1;
			if(old_rec != new_rec){
				return false;
			}
			//衿型オプション２
			old_rec = (org_data.collar2 == null)? 0: org_data.collar2;
			new_rec = (new_data.collar2 == null)? 0: new_data.collar2;
			if(old_rec != new_rec){
				return false;
			}
			//クレリック
			old_rec = (org_data.cleric == null)? 0: org_data.cleric;
			new_rec = (new_data.cleric == null)? 0: new_data.cleric;
			if(old_rec != new_rec){
				return false;
			}
			//衿芯地
			old_rec = (org_data.interLining == null)? 0: org_data.interLining;
			new_rec = (new_data.interLining == null)? 0: new_data.interLining;
			if(old_rec != new_rec){
				return false;
			}

			//全く同じ
			return true;
		},
		_chk_copy_cuffs: function(updReq){
			org_data = _copy_rec.AMPOV0250GetRsp.cuffs;
			new_data = updReq.cuffs;
			var old_rec;
			var new_rec;
			//カフス型
			old_rec = (org_data.cuffsType == null)? 0: org_data.cuffsType;
			new_rec = (new_data.cuffsType == null)? 0: new_data.cuffsType;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_migoro: function(updReq){
			org_data = _copy_rec.AMPOV0250GetRsp.migoro;
			new_data = updReq.migoro;
			var old_rec;
			var new_rec;
			//前身頃
			old_rec = (org_data.front == null)? 0: org_data.front;
			new_rec = (new_data.front == null)? 0: new_data.front;
			if(old_rec != new_rec){
				return false;
			}
			//後身頃
			old_rec = (org_data.back == null)? 0: org_data.back;
			new_rec = (new_data.back == null)? 0: new_data.back;
			if(old_rec != new_rec){
				return false;
			}
			//AMFステッチオプション
			old_rec = (org_data.amfStitch == null)? 0: org_data.amfStitch;
			new_rec = (new_data.amfStitch == null)? 0: new_data.amfStitch;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_pktbtn: function(updReq){
			org_data = _copy_rec.AMPOV0250GetRsp.migoro;
			new_data = updReq.migoro;
			var old_rec;
			var new_rec;
			//ポケット
			old_rec = (org_data.pocket == null)? 0: org_data.pocket;
			new_rec = (new_data.pocket == null)? 0: new_data.pocket;
			if(old_rec != new_rec){
				return false;
			}
			//縫製仕様ポケットチーフオプション
			old_rec = (org_data.pocketChief == null)? 0: org_data.pocketChief;
			new_rec = (new_data.pocketChief == null)? 0: new_data.pocketChief;
			if(old_rec != new_rec){
				return false;
			}
			//ボタン
			old_rec = (org_data.button == null)? 0: org_data.button;
			new_rec = (new_data.button == null)? 0: new_data.button;
			if(old_rec != new_rec){
				return false;
			}
			//ボタンホールオプション
			old_rec = (org_data.buttonHole == null)? 0: org_data.buttonHole;
			new_rec = (new_data.buttonHole == null)? 0: new_data.buttonHole;
			if(old_rec != new_rec){
				return false;
			}
			//ボタン付糸オプション
			old_rec = (org_data.buttonThread == null)? 0: org_data.buttonThread;
			new_rec = (new_data.buttonThread == null)? 0: new_data.buttonThread;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_initial: function(updReq){
			org_data = _copy_rec.AMPOV0250GetRsp.initial;
			new_data = updReq.initial;
			var old_rec;
			var new_rec;
			//イニシャルオプション
			old_rec = (org_data.initial == null)? 0: org_data.initial;
			new_rec = (new_data.initial == null)? 0: new_data.initial;
			if(old_rec != new_rec){
				return false;
			}
			//字体
			old_rec = (org_data.form == null)? 0: org_data.form;
			new_rec = (new_data.form == null)? 0: new_data.form;
			if(old_rec != new_rec){
				return false;
			}
			//イニシャル英字１
			old_rec = (org_data.initialEn1 == null)? 0: org_data.initialEn1;
			new_rec = (new_data.initialEn1 == null)? 0: new_data.initialEn1;
			if(old_rec != new_rec){
				return false;
			}
			//イニシャル英字２
			old_rec = (org_data.initialEn2 == null)? 0: org_data.initialEn2;
			new_rec = (new_data.initialEn2 == null)? 0: new_data.initialEn2;
			if(old_rec != new_rec){
				return false;
			}
			//場所
			old_rec = (org_data.place == null)? 0: org_data.place;
			new_rec = (new_data.place == null)? 0: new_data.place;
			if(old_rec != new_rec){
				return false;
			}
			//色
			old_rec = (org_data.color == null)? 0: org_data.color;
			new_rec = (new_data.color == null)? 0: new_data.color;
			if(old_rec != new_rec){
				return false;
			}
			//全く同じ
			return true;
		},
		_chk_copy_other: function(updReq){
			org_data = _copy_rec.AMPOV0250GetRsp.other;
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
					AMPOV0250GetReq: {
						reqType :1,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_SHIRT,
						srchID: this.options.chkData[pgIndex].poOrderID,			// 取引先ID
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMPOV0250UpdReq: {
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
			this.bodyReadOnly(true);
			this.collarReadOnly(true);
			this.cuffsReadOnly(true);
			this.typeReadOnly(true);
			this.pocketReadOnly(true);
			this.initialReadOnly(true);
			if( this.$("#ca_brandID").val() == null || this.$("#ca_brandID").val()  <= 0){
				//ブランドも決まっていない場合は使用不可
//				this.orderReadOnly(true);
				clutil.viewReadonly(this.$("#ca_clothNo_div"));
				$("#ca_clothNo_autofill").hide();
				clutil.viewReadonly(this.$("#ca_arrivalDate_div"));
				clutil.viewRemoveReadonly(this.$("#ca_brandID_div"));
				$("#ca_brandID_autofill").show();
//				clutil.viewRemoveReadonly(this.$("#ca_orderDate_div"));
				clutil.viewRemoveReadonly(this.$("#ca_saleDate_div"));
				clutil.viewRemoveReadonly(this.$("#ca_hurryFlag_div"));
				clutil.viewRemoveReadonly(this.$("#ca_cnt_div"));
				clutil.initUIelement(this.$el);
				return;
			}
			this.doSrchOptionCloth();
			return;
		},
		_clothNoChange: function(){
			this.doSrcharrivalDate();
			return;
		},
		// 補正
		_doAdjTypeIDChange: function(){
			if( this.$("#ca_doAdjTypeID").val() == null
					|| this.$("#ca_doAdjTypeID").val() != amcm_type.AMCM_VAL_IS_RESIZED_EXIST){
				$("#ca_shoulder").val("");
				$("#ca_chest").val("");
				$("#ca_waist").val("");
				$("#ca_bottom").val("");
				$("#ca_length_opt").val("");
				$("#ca_leftCuff").val("");
				$("#ca_rightCuff").val("");
				clutil.viewReadonly(this.$("#ca_shoulder_div"));
				clutil.viewReadonly(this.$("#ca_chest_div"));
				clutil.viewReadonly(this.$("#ca_waist_div"));
				clutil.viewReadonly(this.$("#ca_bottom_div"));
				clutil.viewReadonly(this.$("#ca_length_opt_div"));
				clutil.viewReadonly(this.$("#ca_leftCuff_div"));
				clutil.viewReadonly(this.$("#ca_rightCuff_div"));
			}else{
				if(this.$("#ca_shoulder").find("option").length >1){
					clutil.viewRemoveReadonly(this.$("#ca_shoulder_div"));
				}
				if(this.$("#ca_chest").find("option").length >1){
					clutil.viewRemoveReadonly(this.$("#ca_chest_div"));
				}
				if(this.$("#ca_waist").find("option").length >1){
					clutil.viewRemoveReadonly(this.$("#ca_waist_div"));
				}
				if(this.$("#ca_bottom").find("option").length >1){
					clutil.viewRemoveReadonly(this.$("#ca_bottom_div"));
				}
				if(this.$("#ca_length_opt").find("option").length >1){
					clutil.viewRemoveReadonly(this.$("#ca_length_opt_div"));
				}
				if( this.$("#ca_sleeveTypeID").val() != null
						&& this.$("#ca_sleeveTypeID").val() == amcm_type.AMCM_VAL_ARM_TYPE_SHORT){
					//半袖選択時使用不可
					clutil.viewReadonly(this.$("#ca_leftCuff_div"));
					clutil.viewReadonly(this.$("#ca_rightCuff_div"));
				}else{
					//半袖以外選択時
					if(this.$("#ca_leftCuff").find("option").length >1){
						clutil.viewRemoveReadonly(this.$("#ca_leftCuff_div"));
					}
					if(this.$("#ca_rightCuff").find("option").length >1){
						clutil.viewRemoveReadonly(this.$("#ca_rightCuff_div"));
					}
				}
			}
			clutil.initUIelement(this.$el);
			return;
		},
		//TODO
		_sleeveTypeChange: function(){
			var $sleeveTypeID = this.$("#ca_sleeveTypeID");
			if( $sleeveTypeID.val() == null || $sleeveTypeID.val() == 0){
				clutil.viewRemoveReadonly(this.$("#ca_leftDegree_div"));
				clutil.viewRemoveReadonly(this.$("#ca_rightDegree_div"));
				if( this.$("#ca_doAdjTypeID").val() != null
						&& this.$("#ca_doAdjTypeID").val() == amcm_type.AMCM_VAL_IS_RESIZED_EXIST){
					if(this.$("#ca_leftCuff").find("option").length >1){
						clutil.viewRemoveReadonly(this.$("#ca_leftCuff_div"));
					}
					if(this.$("#ca_rightCuff").find("option").length >1){
						clutil.viewRemoveReadonly(this.$("#ca_rightCuff_div"));
					}
				}
				if(this.$("#ca_cuffsTypeTypeID").find("option").length >1){
					clutil.viewRemoveReadonly(this.$("#ca_cuffsTypeTypeID_div"));
				}
			}else{
				if($sleeveTypeID.val() == amcm_type.AMCM_VAL_ARM_TYPE_SHORT){
					this.$("#ca_leftDegree").val("");
					this.$("#ca_rightDegree").val("");
					this.$("#ca_leftCuff").val("");
					this.$("#ca_rightCuff").val("");
					this.$("#ca_cuffsTypeTypeID").val("");
					clutil.viewReadonly(this.$("#ca_leftDegree_div"));
					clutil.viewReadonly(this.$("#ca_rightDegree_div"));
					clutil.viewReadonly(this.$("#ca_leftCuff_div"));
					clutil.viewReadonly(this.$("#ca_rightCuff_div"));
					clutil.viewReadonly(this.$("#ca_cuffsTypeTypeID_div"));
				}else{
					clutil.viewRemoveReadonly(this.$("#ca_leftDegree_div"));
					clutil.viewRemoveReadonly(this.$("#ca_rightDegree_div"));
					if( this.$("#ca_doAdjTypeID").val() != null
							&& this.$("#ca_doAdjTypeID").val() == amcm_type.AMCM_VAL_IS_RESIZED_EXIST){
						if(this.$("#ca_leftCuff").find("option").length >1){
							clutil.viewRemoveReadonly(this.$("#ca_leftCuff_div"));
						}
						if(this.$("#ca_rightCuff").find("option").length >1){
							clutil.viewRemoveReadonly(this.$("#ca_rightCuff_div"));
						}
					}
					if(this.$("#ca_cuffsTypeTypeID").find("option").length >1){
						clutil.viewRemoveReadonly(this.$("#ca_cuffsTypeTypeID_div"));
					}
				}
			}
			clutil.initUIelement(this.$el);
		},
		//字体
		_formTypeIDChange: function(){
			if( this.$("#ca_formTypeID").val() == null || this.$("#ca_formTypeID").val() == 0){
				$("#ca_initialEn1").val("");
				$("#ca_initialEn2_S").val("");
				$("#ca_initialEn2_L").val("");
//				$("#ca_initialEn2_S").show();
//				$("#ca_initialEn2_L").hide();
//				$("#ca_initialEn2_L_span").hide();

				$("#ca_initialEn2_S").show();
				$("#ca_initialEn2_L").hide();
				$("#ca_initialEn2_L_span").hide();
				clutil.viewReadonly(this.$("#ca_initialEn_div"));
				return;
			}else{
				clutil.viewRemoveReadonly(this.$("#ca_initialEn_div"));
			}

			var formTypeName = "";
			var formType = this.$("#ca_formTypeID").val();
			if(this.selectorVal2Item('formTypeID', formType) != null){
				formTypeName = this.selectorVal2Item('formTypeID', formType).name;
			}
			if(formTypeName.match(/フルネ.ム/)){
				//フル
				if ($("#ca_initialEn2_L").css('display') == 'none') {
					//今まで隠れていたなら表示の際に消す
					$("#ca_initialEn2_L").val("");
				}
				$("#ca_initialEn2_S").hide();
				$("#ca_initialEn2_L").show();
				$("#ca_initialEn2_L_span").show();
				clutil.cltxtFieldLimitReset($("#ca_initialEn2_L"));
			}else{
				if ($("#ca_initialEn2_S").css('display') == 'none') {
					//今まで隠れていたなら表示の際に消す
					$("#ca_initialEn2_S").val("");
				}
				$("#ca_initialEn2_S").show();
				$("#ca_initialEn2_L").hide();
				$("#ca_initialEn2_L_span").hide();
			}
//			if(this.$("#ca_formTypeID").val() == amcm_type.AMCM_VAL_FORM_TYPE_CURSIVE_FULL){
//				//フル
//				if ($("#ca_initialEn2_L").css('display') == 'none') {
//					//今まで隠れていたなら表示の際に消す
//					$("#ca_initialEn2_L").val("");
//				}
//				$("#ca_initialEn2_S").hide();
//				$("#ca_initialEn2_L").show();
//				$("#ca_initialEn2_L_span").show();
//				clutil.cltxtFieldLimitReset($("#ca_initialEn2_L"));
//			}else{
//				if ($("#ca_initialEn2_S").css('display') == 'none') {
//					//今まで隠れていたなら表示の際に消す
//					$("#ca_initialEn2_S").val("");
//				}
//				$("#ca_initialEn2_S").show();
//				$("#ca_initialEn2_L").hide();
//				$("#ca_initialEn2_L_span").hide();
//			}
			return;
		},
		/**
		 * 店舗の変更処理
		 * 画面の一部をクリアし、ブランドを検索する。
		 * */
		//TODO
		changeStore: function(){
			this._clearAllForm(_changeTypeArgs.STORE);
//			this.orderReadOnly(true);
			clutil.viewReadonly(this.$("#ca_brandID_div"));
			$("#ca_brandID_autofill").hide();
			clutil.viewReadonly(this.$("#ca_clothNo_div"));
			$("#ca_clothNo_autofill").hide();
			clutil.viewReadonly(this.$("#ca_arrivalDate_div"));
//			clutil.viewRemoveReadonly(this.$("#ca_orderDate_div"));
			clutil.viewRemoveReadonly(this.$("#ca_saleDate_div"));
			clutil.viewRemoveReadonly(this.$("#ca_hurryFlag_div"));
			clutil.viewRemoveReadonly(this.$("#ca_cnt_div"));
			this.bodyReadOnly(true);
			this.collarReadOnly(true);
			this.cuffsReadOnly(true);
			this.typeReadOnly(true);
			this.pocketReadOnly(true);
			this.initialReadOnly(true);
			if( this.$("#ca_storeID").autocomplete('clAutocompleteItem') == null || this.$("#ca_storeID").autocomplete('clAutocompleteItem').id  <= 0){
				return $.Deferred().resolve();
			}else{

			}
			//画面表示クリア
			this.clearBrandCombo(true);

			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0250GetReq :{
						reqType: 2,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_SHIRT,
						storeID: this.$("#ca_storeID").autocomplete('clAutocompleteItem').id,
						orderDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
					}
			};

			var promise = clutil.postJSON('AMPOV0250', srchReq).done(_.bind(function(data){
				//console.log(arguments);
				var recs = data.AMPOV0250GetRsp.brandList;

				if(_.isEmpty(recs)){
					this.clearBrandCombo(false);
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
				this.clearBrandCombo(false);
			}, this));

			return promise;
		},
		//TODO
		orderReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearOrderForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_order_form"));
			}else{
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_order_form"));
				// でも店舗着日はロック継続
				clutil.viewReadonly(this.$("#ca_arrivalDate_div"));
			}
		},
		bodyReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearBodyForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_body_form"));
			}else{
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_body_form"));
			}
		},
		collarReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearCollarForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_collar_form"));
			}else{
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_collar_form"));
			}
		},
		cuffsReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearCuffsForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_cuffs_form"));
			}else{
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_cuffs_form"));
			}
		},
		typeReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearTypeForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_type_form"));
			}else{
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_type_form"));
			}
		},
		pocketReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearPocketForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_pocket_form"));
			}else{
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_pocket_form"));
			}
		},
		initialReadOnly: function(readonly){
			if(readonly == true){
				//ロック
				this._clearInitialForm(_changeTypeArgs.ALL);
				clutil.viewReadonly(this.$("#ca_initial_form"));
			}else{
				//ロック解除
				clutil.viewRemoveReadonly(this.$("#ca_initial_form"));
			}
		},
//		ブランド検索してブランド項目を探す際の処理。
		clearBrandCombo: function(f_clear){
			if(f_clear == true){
				//コンボボックス初期化
				this.$("#ca_brandID").html('');		//ブランド
				this.$("#ca_brandID").selectpicker().selectpicker('refresh');
				clutil.viewRemoveReadonly(this.$("#ca_brandID_div"));
				$("#ca_brandID_autofill").show();
			}else{
				clutil.viewReadonly(this.$("#ca_brandID_div"));
				$("#ca_brandID_autofill").hide();
			}
			this._doAdjTypeIDChange();
			return ;
		},
		/**
		 * 生地・オプション検索して生地番号リスト項目・オプションリスト項目
		 * */
		doSrchOptionCloth: function(){
			if( this.$("#ca_brandID").val() == null || this.$("#ca_brandID").val()  <= 0){
				return;
			}
			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0250GetReq :{
						reqType: 3,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_SHIRT,
						storeID: this.$("#ca_storeID").autocomplete('clAutocompleteItem').id,
						brandID: this.$("#ca_brandID").val(),
						orderDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
					}
			};

			clutil.postJSON('AMPOV0250', srchReq).done(_.bind(function(data){

				var clothIDListRecs = data.AMPOV0250GetRsp.clothIDList;
				var optionListRecs = data.AMPOV0250GetRsp.optionList;

				if(_.isEmpty(clothIDListRecs)){
					clutil.viewReadonly(this.$("#ca_clothNo_div"));
					$("#ca_clothNo_autofill").hide();
				}else{
					clutil.viewRemoveReadonly(this.$("#ca_clothNo_div"));
					$("#ca_clothNo_autofill").show();
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
							$select	:this.$("#ca_clothNo"),
							list:clothIDlist,
							unselectedflag:true,
							selectpicker: {
								noButton: true
							}
					};
					destroySelectpicker(opt.$select);
					clutil.cltypeselector3(opt);
					this.selector3Opts['clothNo'] = opt;
				}
				if(_.isEmpty(optionListRecs) ){
					this.bodyReadOnly(true);
					this.collarReadOnly(true);
					this.cuffsReadOnly(true);
					this.typeReadOnly(true);
					this.pocketReadOnly(true);
					this.initialReadOnly(true);
				}else{
					this.bodyReadOnly(false);
					this.collarReadOnly(false);
					this.cuffsReadOnly(false);
					this.typeReadOnly(false);
					this.pocketReadOnly(false);
					this.initialReadOnly(false);
					this.showOptions(optionListRecs);

//					TODO
					if(this.selectorVal2ItemLength('bodyTypeTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_bodyTypeTypeID_div"));
					}
					if(this.selectorVal2ItemLength('neckSize') == 0){
						clutil.viewReadonly(this.$("#ca_neckSize_div"));
					}
					if(this.selectorVal2ItemLength('leftDegree') == 0){
						clutil.viewReadonly(this.$("#ca_leftDegree_div"));
					}
					if(this.selectorVal2ItemLength('rightDegree') == 0){
						clutil.viewReadonly(this.$("#ca_rightDegree_div"));
					}
					if(this.selectorVal2ItemLength('collar1TypeID') == 0){
						clutil.viewReadonly(this.$("#ca_collar1TypeID_div"));
					}
					if(this.selectorVal2ItemLength('collar2TypeID') == 0){
						clutil.viewReadonly(this.$("#ca_collar2TypeID_div"));
					}
					if(this.selectorVal2ItemLength('clericTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_clericTypeID_div"));
					}
					if(this.selectorVal2ItemLength('interLiningTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_interLiningTypeID_div"));
					}
					if(this.selectorVal2ItemLength('cuffsTypeTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_cuffsTypeTypeID_div"));
					}
					if(this.selectorVal2ItemLength('frontTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_frontTypeID_div"));
					}
					if(this.selectorVal2ItemLength('backTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_backTypeID_div"));
					}
					if(this.selectorVal2ItemLength('amfStitchTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_amfStitchTypeID_div"));
					}
					if(this.selectorVal2ItemLength('pocketTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_pocketTypeID_div"));
					}
					if(this.selectorVal2ItemLength('pocketChiefTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_pocketChiefTypeID_div"));
					}
					if(this.selectorVal2ItemLength('buttonTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_buttonTypeID_div"));
					}
					if(this.selectorVal2ItemLength('buttonHoleTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_buttonHoleTypeID_div"));
					}
					if(this.selectorVal2ItemLength('buttonThreadTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_buttonThreadTypeID_div"));
					}
					if(this.selectorVal2ItemLength('initialTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_initialTypeID_div"));
					}
					if(this.selectorVal2ItemLength('formTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_formTypeID_div"));
					}
					if(this.selectorVal2ItemLength('placeTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_placeTypeID_div"));
					}
					if(this.selectorVal2ItemLength('colorTypeID') == 0){
						clutil.viewReadonly(this.$("#ca_colorTypeID_div"));
					}
					this._doAdjTypeIDChange();
					this._formTypeIDChange();
				}
			}, this)).fail(_.bind(function(data){
				this.bodyReadOnly(true);
				this.collarReadOnly(true);
				this.cuffsReadOnly(true);
				this.typeReadOnly(true);
				this.pocketReadOnly(true);
				this.initialReadOnly(true);
				clutil.viewReadonly(this.$("#ca_clothNo_div"));
				$("#ca_clothNo_autofill").hide();
			}, this));
			return;
		},

		showOptions: function(recs){
			var list_bodyTypeTypeID		= [];
			var list_neckSize	= [];
			var list_leftDegree	= [];
			var list_rightDegree		= [];
			var list_shoulder	= [];
			var list_chest	= [];
			var list_waist		= [];
			var list_bottom	= [];
			var list_length_opt	= [];
			var list_leftCuff		= [];
			var list_rightCuff	= [];
			var list_collar1TypeID	= [];
			var list_collar2TypeID	= [];
			var list_clericTypeID	= [];
			var list_interLiningTypeID	= [];
			var list_cuffsTypeTypeID	= [];
			var list_frontTypeID	= [];
			var list_backTypeID	= [];
			var list_amfStitchTypeID	= [];
			var list_pocketTypeID	= [];
			var list_pocketChiefTypeID	= [];
			var list_buttonTypeID	= [];
			var list_buttonHoleTypeID	= [];
			var list_buttonThreadTypeID	= [];
			var list_initialTypeID	= [];
			var list_formTypeID		= [];
			var list_placeTypeID	= [];
			var list_colorTypeID	= [];


			for (var i = 0; i < recs.length; i++){
				var cn = {
						id: recs[i].optionID,
						code: recs[i].seq,
						name: recs[i].comment,
				};
				switch(recs[i].poOptTypeID){
				case amcm_type.AMCM_TYPE_BODY_FORM_TYPE:
					list_bodyTypeTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_NECK_SIZE_TYPE:
					list_neckSize.push(cn);
					break;
				case amcm_type.AMCM_TYPE_DEGREE_LEFT_TYPE:
					list_leftDegree.push(cn);
					break;
				case amcm_type.AMCM_TYPE_DEGREE_RIGHT_TYPE:
					list_rightDegree.push(cn);
					break;
				case amcm_type.AMCM_TYPE_ACROSS_SHOULDERS_TYPE:
					list_shoulder.push(cn);
					break;
				case amcm_type.AMCM_TYPE_CHEST_MEASUREMENT_TYPE:
					list_chest.push(cn);
					break;
				case amcm_type.AMCM_TYPE_WAIST_MEASUREMENT_TYPE:
					list_waist.push(cn);
					break;
				case amcm_type.AMCM_TYPE_AROUND_BOTTOM_TYPE:
					list_bottom.push(cn);
					break;
				case amcm_type.AMCM_TYPE_BODY_LEN_TYPE:
					list_length_opt.push(cn);
					break;
				case amcm_type.AMCM_TYPE_CUFF_LEN_LEFT_TYPE:
					list_leftCuff.push(cn);
					break;
				case amcm_type.AMCM_TYPE_CUFF_LEN_RIGHT_TYPE:
					list_rightCuff.push(cn);
					break;
				case amcm_type.AMCM_TYPE_COLLAR_OP1_TYPE:
					list_collar1TypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_COLLAR_OP2_TYPE:
					list_collar2TypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_CLERIC_TYPE:
					list_clericTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_COLLAR_CORE_TYPE:
					list_interLiningTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_CUFF_TYPE:
					list_cuffsTypeTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_FRONTBODY_TYPE:
					list_frontTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_BACKBODY_TYPE:
					list_backTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_AMF_STITCH_OPTION_TYPE:
					list_amfStitchTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_POCKET_TYPE:
					list_pocketTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_POCKET_SQUARE_TYPE:
					list_pocketChiefTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_BUTTON_TYPE:
					list_buttonTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_BUTTON_HOLE_OPTION_TYPE:
					list_buttonHoleTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_BUTTON_SUTURE_TYPE:
					list_buttonThreadTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_INITIAL_OPTION_TYPE:
					list_initialTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_FORM_TYPE:
					list_formTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_INITIAL_AREA_TYPE:
					list_placeTypeID.push(cn);
					break;
				case amcm_type.AMCM_TYPE_COLOR_TYPE:
					list_colorTypeID.push(cn);
					break;
				}
			}

			var buildSelector = function(opt, keyName, myView){
				clutil.cltypeselector3(opt);
				myView.selector3Opts[keyName] = opt;
			};

			buildSelector({
				$select	:this.$("#ca_bodyTypeTypeID"),
				list:list_bodyTypeTypeID,
				unselectedflag:true
			}, 'bodyTypeTypeID', this);
			buildSelector({
				$select	:this.$("#ca_neckSize"),
				list:list_neckSize,
				unselectedflag:true
			}, 'neckSize', this);
			buildSelector({
				$select	:this.$("#ca_leftDegree"),
				list:list_leftDegree,
				unselectedflag:true
			}, 'leftDegree', this);
			buildSelector({
				$select	:this.$("#ca_rightDegree"),
				list:list_rightDegree,
				unselectedflag:true
			}, 'rightDegree', this);
			buildSelector({
				$select	:this.$("#ca_shoulder"),
				list:list_shoulder,
				unselectedflag:true
			}, 'shoulder', this);
			buildSelector({
				$select	:this.$("#ca_chest"),
				list:list_chest,
				unselectedflag:true
			}, 'chest', this);
			buildSelector({
				$select	:this.$("#ca_waist"),
				list:list_waist,
				unselectedflag:true
			}, 'waist', this);
			buildSelector({
				$select	:this.$("#ca_bottom"),
				list:list_bottom,
				unselectedflag:true
			}, 'bottom', this);
			buildSelector({
				$select	:this.$("#ca_length_opt"),
				list:list_length_opt,
				unselectedflag:true
			}, 'length_opt', this);
			buildSelector({
				$select	:this.$("#ca_leftCuff"),
				list:list_leftCuff,
				unselectedflag:true
			}, 'leftCuff', this);
			buildSelector({
				$select	:this.$("#ca_rightCuff"),
				list:list_rightCuff,
				unselectedflag:true
			}, 'rightCuff', this);
			buildSelector({
				$select	:this.$("#ca_collar1TypeID"),
				list:list_collar1TypeID,
				unselectedflag:true
			}, 'collar1TypeID', this);
			buildSelector({
				$select	:this.$("#ca_collar2TypeID"),
				list:list_collar2TypeID,
				unselectedflag:true
			}, 'collar2TypeID', this);
			buildSelector({
				$select	:this.$("#ca_clericTypeID"),
				list:list_clericTypeID,
				unselectedflag:true
			}, 'clericTypeID', this);
			buildSelector({
				$select	:this.$("#ca_interLiningTypeID"),
				list:list_interLiningTypeID,
				unselectedflag:true
			}, 'interLiningTypeID', this);
			buildSelector({
				$select	:this.$("#ca_cuffsTypeTypeID"),
				list:list_cuffsTypeTypeID,
				unselectedflag:true
			}, 'cuffsTypeTypeID', this);
			buildSelector({
				$select	:this.$("#ca_frontTypeID"),
				list:list_frontTypeID,
				unselectedflag:true
			}, 'frontTypeID', this);
			buildSelector({
				$select	:this.$("#ca_backTypeID"),
				list:list_backTypeID,
				unselectedflag:true
			}, 'backTypeID', this);
			buildSelector({
				$select	:this.$("#ca_amfStitchTypeID"),
				list:list_amfStitchTypeID,
				unselectedflag:true
			}, 'amfStitchTypeID', this);
			buildSelector({
				$select	:this.$("#ca_pocketTypeID"),
				list:list_pocketTypeID,
				unselectedflag:true
			}, 'pocketTypeID', this);
			buildSelector({
				$select	:this.$("#ca_pocketChiefTypeID"),
				list:list_pocketChiefTypeID,
				unselectedflag:true
			}, 'pocketChiefTypeID', this);
			buildSelector({
				$select	:this.$("#ca_buttonTypeID"),
				list:list_buttonTypeID,
				unselectedflag:true
			}, 'buttonTypeID', this);
			buildSelector({
				$select	:this.$("#ca_buttonHoleTypeID"),
				list:list_buttonHoleTypeID,
				unselectedflag:true
			}, 'buttonHoleTypeID', this);
			buildSelector({
				$select	:this.$("#ca_buttonThreadTypeID"),
				list:list_buttonThreadTypeID,
				unselectedflag:true
			}, 'buttonThreadTypeID', this);
			buildSelector({
				$select	:this.$("#ca_initialTypeID"),
				list:list_initialTypeID,
				unselectedflag:true
			}, 'initialTypeID', this);
			buildSelector({
				$select	:this.$("#ca_formTypeID"),
				list:list_formTypeID,
				unselectedflag:true
			}, 'formTypeID', this);
			buildSelector({
				$select	:this.$("#ca_placeTypeID"),
				list:list_placeTypeID,
				unselectedflag:true
			}, 'placeTypeID', this);
			buildSelector({
				$select	:this.$("#ca_colorTypeID"),
				list:list_colorTypeID,
				unselectedflag:true
			}, 'colorTypeID', this);

			clutil.initUIelement(this.$el);
			return this;
		},
//		生地・オプション検索し、入力制限をかける。入力制限解除もここで行う。
		clearOptionCloth: function(f_clear){
			if(f_clear){
				//コンボボックス初期化
				this.$("#ca_clothNo").html('');		//生地番号
				this.$("#ca_clothNo").selectpicker().selectpicker('refresh');
				this.$("#ca_bodyTypeTypeID").html('');	//ボディ型
				this.$("#ca_bodyTypeTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_neckSize").html('');	//首回り
				this.$("#ca_neckSize").selectpicker().selectpicker('refresh');
				this.$("#ca_leftDegree").html('');	//裄丈（左）
				this.$("#ca_leftDegree").selectpicker().selectpicker('refresh');
				this.$("#ca_rightDegree").html('');			//裄丈（右）
				this.$("#ca_rightDegree").selectpicker().selectpicker('refresh');
				this.$("#ca_shoulder").html('');		//肩幅補正オプション
				this.$("#ca_shoulder").selectpicker().selectpicker('refresh');
				this.$("#ca_chest").html('');	//胸回り補正オプション
				this.$("#ca_chest").selectpicker().selectpicker('refresh');
				this.$("#ca_waist").html('');	//胴回り補正オプション
				this.$("#ca_waist").selectpicker().selectpicker('refresh');
				this.$("#ca_bottom").html('');		//裾回り補正オプション
				this.$("#ca_bottom").selectpicker().selectpicker('refresh');
				this.$("#ca_length_opt").html('');	//身丈補正オプション
				this.$("#ca_length_opt").selectpicker().selectpicker('refresh');
				this.$("#ca_leftCuff").html('');	//カフス回り（左）補正オプション変更
				this.$("#ca_leftCuff").selectpicker().selectpicker('refresh');
				this.$("#ca_rightCuff").html('');	//カフス回り（右）補正オプション変更
				this.$("#ca_rightCuff").selectpicker().selectpicker('refresh');
				this.$("#ca_collar1TypeID").html('');	//衿型標準オプション１
				this.$("#ca_collar1TypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_collar2TypeID").html('');	//衿型オプション２
				this.$("#ca_collar2TypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_clericTypeID").html('');	//クレリック
				this.$("#ca_clericTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_interLiningTypeID").html('');	//衿芯地
				this.$("#ca_interLiningTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_cuffsTypeTypeID").html('');	//カフス型
				this.$("#ca_cuffsTypeTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_frontTypeID").html('');	//前身頃
				this.$("#ca_frontTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_backTypeID").html('');	//後身頃
				this.$("#ca_backTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_amfStitchTypeID").html('');	//AMFステッチオプション
				this.$("#ca_amfStitchTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_pocketTypeID").html('');	//ポケット
				this.$("#ca_pocketTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_pocketChiefTypeID").html('');	//縫製仕様ポケットチーフオプション
				this.$("#ca_pocketChiefTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_buttonTypeID").html('');	//ボタン
				this.$("#ca_buttonTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_buttonHoleTypeID").html('');	//ボタンホールオプション
				this.$("#ca_buttonHoleTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_buttonThreadTypeID").html('');	//ボタン付糸オプション
				this.$("#ca_buttonThreadTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_initialTypeID").html('');	//イニシャルオプション
				this.$("#ca_initialTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_placeTypeID").html('');	//場所
				this.$("#ca_placeTypeID").selectpicker().selectpicker('refresh');
				this.$("#ca_colorTypeID").html('');	//色
				this.$("#ca_colorTypeID").selectpicker().selectpicker('refresh');
				clutil.viewReadonly(this.$("#ca_clothNo_div"));
				$("#ca_clothNo_autofill").hide();
				clutil.viewReadonly(this.$("#ca_bodyTypeTypeID_div"));
				clutil.viewReadonly(this.$("#ca_neckSize_div"));
				clutil.viewReadonly(this.$("#ca_leftDegree_div"));
				clutil.viewReadonly(this.$("#ca_rightDegree_div"));
				clutil.viewReadonly(this.$("#ca_shoulder_div"));
				clutil.viewReadonly(this.$("#ca_chest_div"));
				clutil.viewReadonly(this.$("#ca_waist_div"));
				clutil.viewReadonly(this.$("#ca_bottom_div"));
				clutil.viewReadonly(this.$("#ca_length_opt_div"));
				clutil.viewReadonly(this.$("#ca_leftCuff_div"));
				clutil.viewReadonly(this.$("#ca_rightCuff_div"));
				clutil.viewReadonly(this.$("#ca_collar1TypeID_div"));
				clutil.viewReadonly(this.$("#ca_collar2TypeID_div"));
				clutil.viewReadonly(this.$("#ca_clericTypeID_div"));
				clutil.viewReadonly(this.$("#ca_interLiningTypeID_div"));
				clutil.viewReadonly(this.$("#ca_cuffsTypeTypeID_div"));
				clutil.viewReadonly(this.$("#ca_frontTypeID_div"));
				clutil.viewReadonly(this.$("#ca_backTypeID_div"));
				clutil.viewReadonly(this.$("#ca_amfStitchTypeID_div"));
				clutil.viewReadonly(this.$("#ca_pocketTypeID_div"));
				clutil.viewReadonly(this.$("#ca_pocketChiefTypeID_div"));
				clutil.viewReadonly(this.$("#ca_buttonTypeID_div"));
				clutil.viewReadonly(this.$("#ca_buttonHoleTypeID_div"));
				clutil.viewReadonly(this.$("#ca_buttonThreadTypeID_div"));
				clutil.viewReadonly(this.$("#ca_initialTypeID_div"));
				clutil.viewReadonly(this.$("#ca_placeTypeID_div"));
				clutil.viewReadonly(this.$("#ca_colorTypeID_div"));
			}else{
				clutil.viewRemoveReadonly(this.$("#ca_clothNo_div"));
				$("#ca_clothNo_autofill").show();
				clutil.viewRemoveReadonly(this.$("#ca_bodyTypeTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_neckSize_div"));
				clutil.viewRemoveReadonly(this.$("#ca_leftDegree_div"));
				clutil.viewRemoveReadonly(this.$("#ca_rightDegree_div"));
				clutil.viewRemoveReadonly(this.$("#ca_shoulder_div"));
				clutil.viewRemoveReadonly(this.$("#ca_chest_div"));
				clutil.viewRemoveReadonly(this.$("#ca_waist_div"));
				clutil.viewRemoveReadonly(this.$("#ca_bottom_div"));
				clutil.viewRemoveReadonly(this.$("#ca_length_opt_div"));
				clutil.viewRemoveReadonly(this.$("#ca_leftCuff_div"));
				clutil.viewRemoveReadonly(this.$("#ca_rightCuff_div"));
				clutil.viewRemoveReadonly(this.$("#ca_collar1TypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_collar2TypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_clericTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_interLiningTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_cuffsTypeTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_frontTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_backTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_amfStitchTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_pocketTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_pocketChiefTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_buttonTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_buttonHoleTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_buttonThreadTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_initialTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_placeTypeID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_colorTypeID_div"));

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
				if (num != null){
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
			if( this.$("#ca_clothNo").val() == null || this.$("#ca_clothNo").val()  <= 0){
				return;
			}
			if( this.$("#ca_orderDate").val() == null || clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')  <= 0){
				return;
			}
			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0250GetReq :{
						reqType: 4,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_SHIRT,
						storeID: this.$("#ca_storeID").autocomplete('clAutocompleteItem').id,
						brandID: this.$("#ca_brandID").val(),
						clothIDID:this.$("#ca_clothNo").val(),
						orderDate:clutil.dateFormat(this.$("#ca_orderDate").val(), 'yyyymmdd')
					}
			};

			clutil.postJSON('AMPOV0250', srchReq).done(_.bind(function(data){
				//console.log(arguments);
				var recs = data.AMPOV0250GetRsp.arrivalDateList;
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
//			var rec = data.AMPOV0250GetRsp;
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
			           rspHeader: data.rspHeader
		});
	});
});
