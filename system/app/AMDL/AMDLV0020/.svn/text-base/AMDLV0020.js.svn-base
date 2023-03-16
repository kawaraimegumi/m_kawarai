useSelectpicker2();

clutil.Validators.checkJan = function(){
	if (this.$el.val() && this.$el.hasClass('janNG')){
		return clmsg.ECM0030;
	}
};

$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var RequireController = function(view){
		this.view = view;
		this.validator = view.validator;
	};

	_.extend(RequireController.prototype, {
		addRequired: function($el){
			$el.addClass('cl_required');
			$el.closest('.fieldUnit').addClass('required');
		},

		removeRequired: function($el){
			$el.removeClass('cl_required');
			$el.closest('.fieldUnit').removeClass('required');
			this.validator.clearErrorMsg($el);
		},

		show: function($el){
			$el.closest('.fieldUnit').show();
		},

		hide: function($el){
			$el.closest('.fieldUnit').hide();
		},

		toggleRequired: function($el, sw, disabled, hide){
			if (sw){
				this.addRequired($el);
				if (disabled){
					clutil.inputRemoveReadonly($el);
				}
				if (hide !== false){
					this.show($el);
				}
			}else{
				this.removeRequired($el);
				if (disabled){
					clutil.inputReadonly($el);
				}
				if (hide !== false){
					this.hide($el);
				}
			}
			return this;
		}
	});

	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		events: {
			// XXX アコーディオンのアクション制御はここでするかなー？
			"change [name=ca_slipTypeID]:radio"				: "_onSlipTypeChange",
//			'change #ca_unitID'							: '_onSrchUnitChanged',	// 事業ユニットが変更された
			'click #ca_btn_store_select'				: '_onStoreSelClick',		// 店舗選択補助画面起動
			"click #ca_srch"							: "_onSrch",			// 明細表示ボタンが押下された
			"click #ca_table .btn-delete"				: "_onDeleteLineClick",
			//"click #ca_table tfoot tr:first span:first" : "_onAddLineClick",
			"click #ca_addLine" : "_onAddLineClick",
//			"input #ca_janCode"							: "_onJanCodeChanged",
			'change #ca_table input[name="janCode"]'	: '_onJanCodeChanged',
//			"input #ca_qy"								: "_onQyChange",
			'change #ca_table input[name="qy"]'			: "_onQyChange",
//			'click .switch' : function(e){
			'change #ca_reflectStock' : function(e){
				// 「在庫へ反映」スイッチの制御
				var $sw = $(e.currentTarget);
				var $cb = $sw.find(':checkbox');
//				$cb.val(e.target.textContent == 'OFF'/*OFF→ON*/ ? 1 : 0);
//				$cb.val(e.target.value == 0 /*OFF→ON*/ ? 1: 0);
				$sw.val(e.target.value == 0 /*OFF→ON*/ ? 1 : 0);
			}
		},

		initialize: function(opt){
			_.bindAll(this);

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '仕入・返品伝票',
//					subtitle: '登録・修正',
					new_btn: '',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					 // リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
						? this._buildGetReqFunction : undefined,
					// 空更新チェック用データを作る関数。
					// UIから集めてきた更新データが GET してきた直後の内容と同一かどうかをチェックするための
					// GET直後データを加工する関数。GET 直後に変更するプロパティは空更新チェックの比較対象外
					// にあたるため、比較対象外プロパティを除去するために使用する。
					buildSubmitCheckDataFunction: this._buildSubmitCheckDataFunction,
					// 「一覧へ戻る」ボタンアクション
					btn_cancel: this.btnCancelAction
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// validatorエラー時の表示領域
			var $eb = $('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $eb
			});
			this.srchAreaValidator = clutil.validator(this.$('#ca_srchArea'), {
				echoback : $eb
			});
			this.srchArea2Validator = clutil.validator(this.$('#ca_srchArea2'), {
				echoback : $eb
			});
			this.ca_commentAreaValidator = clutil.validator(this.$('#ca_commentArea'), {
				echoback : $eb
			});

			this.requireController = new RequireController(this);

			// TODO: アプリ個別の View や部品をインスタンス化する

			// ヘッダパネル

//			this.$('#ca_deliverID').val('58490');
//			this.$('#ca_firstDeliverID').val('58490');
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				this.$("#ca_slipCode")
					.attr('data-tflimit', clutil.fmt('{0}', 8));
			}

			// datepicker
			// 検収日
//			clutil.datepicker(this.$('#ca_recInspectDate'));
			this.$('#ca_recInspectDate').val(clutil.dateFormat(clcom.getOpeDate(),"yyyy/mm/dd(w)"));
			// 勘定日
//			clutil.datepicker(this.$('#ca_countDate'));
			var tempDate = clcom.getOpeDate();
			if(tempDate%100 > 15){
				tempDate = clutil.addDate(clcom.getOpeDate(), 16);
				var tempDay = tempDate%100;
				tempDate = clutil.addDate(tempDate, 1-tempDay);

			};
			this.$('#ca_countDate').val(clutil.dateFormat(tempDate,"yyyy/mm/dd(w)"));
//			this.$('#ca_recInspectDate').val("");
//			this.$('#ca_countDate').val("");

			// メーカー
			clutil.clvendorcode(this.$('#ca_vendor'), {
				getVendorTypeId: _.bind(function(){
					return amdb_defs.MTTYPE_F_VENDOR_MAKER;   // メーカー
				}, this)
			});

			// 納品形態取得
			if(this.$('[name=ca_slipTypeID]:checked').val() == amcm_type.AMCM_VAL_SLIP_DELIVER){
				$("#ca_dlvwapTypeID_label").text("納品形態");
				clutil.cltypeselector(this.$("#ca_dlvwapTypeID"),
									  amcm_type.AMCM_TYPE_DLV_ROUTE, 1);
			} else {
				$("#ca_dlvwapTypeID_label").text("依頼状態");
				clutil.cltypeselector(this.$("#ca_dlvwapTypeID"),
									  amcm_type.AMCM_TYPE_REQ_STATUS_TYPE, 1);
			}

			// 振分先取得
//			clutil.clvendorcode(this.$('#ca_centerID'), {
//				getVendorTypeId: _.bind(function(){
//					return amdb_defs.AMCM_VAL_ORG_KIND_CENTER;   // 倉庫
//				}, this)
//			});
//			clutil.cltypeselector(this.$('#ca_centerID'), amcm_type.AMCM_VAL_ORG_KIND_CENTER, 1);
//            clutil.clorgcode(this.$('#ca_center'), {
//                getOrgFuncId: function() {
//                    return 1;   // 基本を返す
//                },
//                getOrgLevelId: function() {
//                    return 6;
//                }
//            });
//			var unitid = $("#ca_unitID").val();
//			clutil.clorgcode({
//				el: this.$("#ca_center"),
//				dependAttrs: {
//					p_org_id: unitid,
//					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
//					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
//					org_typeid_list: [amcm_type.AMCM_VAL_ORG_KIND_CENTER],
//				}
//			});

			// グループID -- AMDLV0020 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDLV0020';

			// 明細リスト
//			this.recListView = new clutil.View.RowSelectListView({
//				el: this.$('#ca_table'),
//				groupid: groupid,
//				template: _.template( $('#ca_rec_template').html() )
//			});

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
				// 新規登録以外は、Submit と、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			//フィールドカウント
			clutil.cltxtFieldLimit($("#ca_slipCode"));
			clutil.cltxtFieldLimit($("#ca_comment"));
		},

		// 「一覧へ戻る」ボタンアクション
		btnCancelAction: function(e){
			// 更新済データの新しいキー値を呼び出し元の一覧画面へ戻す。
			var retVal = {
				// FIXME: 新しいキー値情報のデータ形式
//				updated: '呼び出し元へ処理結果を返す'
				updated: this.options.chkData
			};
			if(this.mdBaseView.options.confirmLeaving){
				this.mdBaseView._ConfirmLeaving(clcom.popPage);
			}else{
				clcom.popPage(retVal);
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			// スイッチ内部 checkbox 調整。
			this.$('#ca_reflectStock').val(1);

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'), 0);

			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: this.$("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	this.$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector.render();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					var store = code + ":" + name;
					$("#ca_store").val(store);
//					$("#ca_store").attr("cs_id", id);
//					$("#ca_store").attr("cs_code", code);
//					$("#ca_store").attr("cs_name", name);
					$("#ca_store").data('cl_store_item', {
                        id: id,
                        code: code,
                        name: name
                    });
				} else {
//					$("#ca_store").val("");
//					$("#ca_store").attr("cs_id", "");
//					$("#ca_store").attr("cs_code", "");
//					$("#ca_store").attr("cs_name", "");
					var chk = $("#ca_store").data("cl_store_item");
					if (chk == null || chk.length == 0) {
//						this.AMPAV0010Selector.clear();
						$("#ca_store").val("");
						$("#ca_store").data('cl_store_item', "");
					}
				}
				_.defer(function(){									// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store_select")); 	// 参照ボタンへあてなおす
				});
			};
//			this.AMPAV0010Selector.clear = function() {
//				$("#ca_store").val("");
//				$("#ca_store").data('cl_store_item', "");
//			};
			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID",
					initValue: (clcom.userInfo) ? clcom.userInfo.unit_id : 0
				},
				// 店舗オートコンプリート
				'clorgcode store': {
					el: '#ca_store',
					addDepends: ['p_org_id'],
					dependSrc: {
						p_org_id: 'unit_id'
					}
				},
				'clorgcode centor': {
					el: '#ca_center',
					addDepends: ['p_org_id'],
					dependSrc: {
						p_org_id: 'unit_id'
					},
					dependAttrs: {
						orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
						org_typeid_list: [amcm_type.AMCM_VAL_ORG_KIND_CENTER],
					}
				},
				// 店舗参照ボタン
				AMPAV0010: {
					button: this.$('#ca_btn_store_select'),
					view: this.AMPAV0010Selector,
					showOptions: function(){
						return {
							org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
						};
					}
				},
			}, {
				dataSource: {
					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
				    f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
				console.log("done in!!!!");
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					// 店舗ユーザー
					this.storeAutocomplete.setValue({
						id: clcom.userInfo.org_id,
						code: clcom.userInfo.org_code,
						name: clcom.userInfo.org_name
					});

					clutil.inputReadonly($("#ca_store"));
					clutil.inputReadonly($("#ca_btn_store_select"));
				}
			});

//			this.storeAutocomplete = this.getOrg(clcom.userInfo.unit_id);

			console.log(clcom.userInfo);
			var srchStoreID = {
				id : clcom.userInfo.org_id,
				code : clcom.userInfo.org_code,
				name : clcom.userInfo.org_name,
			};
			// 店舗
			if (clcom.userInfo.user_typeid) {
				if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS) {
					clutil.inputRemoveReadonly($('#ca_store'));
					clutil.inputRemoveReadonly($('#ca_btn_store_select'));
				}
			}
			// 店舗
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				// 店舗階層ならユーザ店舗autocomplete初期値設定
				var userStore = {
						id : clcom.userInfo.org_id,
						code : clcom.userInfo.org_code,
						name : clcom.userInfo.org_name,
				};
				$("#ca_store").autocomplete('clAutocompleteItem', userStore);
				clutil.inputReadonly($('#ca_store'));
				clutil.inputReadonly($('#ca_btn_store_select'));
//			} else {
//				this._onSrchUnitChanged();
			}
/*
			// 店舗オートコンプリート
			this.storeAutocomplete = clutil.clorgcode( {
				el : '#ca_store',
				dependAttrs : {
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_HD_LEVELID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
				    f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
				},
		    });

			if (clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				// 店舗ユーザー
				this.storeAutocomplete.setValue({
					id: clcom.userInfo.org_id,
					code: clcom.userInfo.org_code,
					name: clcom.userInfo.org_name
				});

				clutil.inputReadonly($("#ca_store"));
				clutil.inputReadonly($("#ca_btn_store_select"));
			}
*/

			// TODO: アプリ個別の View や部品を初期化（選択部品の選択肢を投入するなど）する
			// 初期のアコーディオン展開状態をつくるなど？？。
			return this;
		},

		_onSlipTypeChange: function(){
			var selector;
			var val = $('[name=ca_slipTypeID]:checked').val();
			if (val == amcm_type.AMCM_VAL_SLIP_DELIVER) {
				// 仕入のとき
				$("#ca_recInspecDate_label").text("検収日");
				$("#ca_dlvwapTypeID_label").text("納品形態");
				selector = clutil.cltypeselector({
					el: this.$("#ca_dlvwapTypeID"),
					kind: amcm_type.AMCM_TYPE_DLV_ROUTE
				});
				clutil.inputRemoveReadonly(selector.$el);

				clutil.inputReadonly('#ca_center');
				this.requireController.toggleRequired(
					$('#ca_slipCode'), true, true, false);
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
					clutil.viewRemoveReadonly(this.$('#div_srch'));
					this.mdBaseView.setSubmitEnable(false);
				}
				this.hideResultArea();
			} else {
				// 返品のとき
				$("#ca_recInspecDate_label").text("出荷日");
				$("#ca_dlvwapTypeID_label").text("依頼状態");
				selector = clutil.cltypeselector({
					el: this.$("#ca_dlvwapTypeID"),
					kind: amcm_type.AMCM_TYPE_REQ_STATUS_TYPE
				});
				clutil.inputReadonly(selector.$el);

				clutil.inputReadonly('#ca_center');
				this.requireController.toggleRequired(
					$('#ca_slipCode'), false, true, false);
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
					selector.setValue(amcm_type.AMCM_VAL_REQ_STATUS_TYPE_UNREQUEST);
					this.$('#ca_slipCode').val('');
					clutil.viewReadonly(this.$('#div_srch'));
					this.mdBaseView.setSubmitEnable(true);
				}
				this.$("#ca_table_tbody").empty();
//				this._onAddLine();
//				this._onAddLine();
//				this._onAddLine();
//				this._onAddLine();
//				this._onAddLine();
				this.makeDefaultTable();
				this.showResultArea();
			}
			this.setFocus();
		},

		dispSlipTypeData: function(val){
			if (val == amcm_type.AMCM_VAL_SLIP_DELIVER) {
				$("#ca_recInspecDate_label").text("検収日");
				$("#ca_dlvwapTypeID_label").text("納品形態");
				clutil.cltypeselector({
					el: this.$("#ca_dlvwapTypeID"),
					kind: amcm_type.AMCM_TYPE_DLV_ROUTE
				});
			} else {
				$("#ca_recInspecDate_label").text("出荷日");
				$("#ca_dlvwapTypeID_label").text("依頼状態");
				clutil.cltypeselector({
					el: this.$("#ca_dlvwapTypeID"),
					kind: amcm_type.AMCM_TYPE_REQ_STATUS_TYPE
				});
			}
		},

		/**
		 * テーブルクリア
		 */
		clearTable : function() {
			$("#ca_table_tbody tr").remove();
		},

		/**
		 * 新規作成時にデフォルト空欄表示
		 */
		makeDefaultTable: function(){
//			var _this = this;
			this.clearTable();
			var $tbody = this.$("#ca_table_tbody"),
			$tmpl = this.$("#ca_tbody_template"),
			defArray = new Array,
			i = 0;

			for (;i < 5;i++){
				var obj = {
						no:i+1,
						editable:true,
						canAdd:true,
						disChk:false,
						disEdit:false
				};
				defArray.push(obj);
			}
			$tmpl.tmpl(defArray).appendTo($tbody);
			clutil.initUIelement(this.$el);
			return this;
		},

		/**
		 * 明細リスト表示
		 */
		tableSetRecs: function(data){
/**/
			this.clearTable();
			var getRsp = data;
			var $tbody = this.$("#ca_table_tbody");
			$tmpl = this.$("#ca_tbody_template");

//			if(getRsp.slipItemList.length > 9){
//				getRsp.slipItemList.length = 9;
//			}

			// 明細リスト作成

//			$.each(getRsp.slipItemList, function(){
//			});
//			$tmpl.tmpl(getRsp.slipItemList).appendTo($tbody);

			var list = getRsp.slipItemList;
			list.sort(function(obj1, obj2){
				var no1 = (obj1.no == null) ? -2147483648 : obj1.no;
				var no2 = (obj2.no == null) ? -2147483648 : obj2.no;
				return no1 - no2;
			});

			// 空白行を考慮したリストを作成
			var dtlList = [];
			var cn = 1;
			for(var i=0; i<list.length; cn++){
//				if(list[i].no < cn){
//					break;
//				}
//				if(list[i].no == cn){
					dtlList.push(list[i]);
					i++;
//				} else {
//					var obj = {
//						no: cn
//					};
//					dtlList.push(obj);
//					continue;
//				}
			}
			$.each(dtlList, function(){
			});
			$tmpl.tmpl(dtlList).appendTo($tbody);
			//this._reNum();
			this.calc_qty_amt_total();
			mainView.setFocus();
			clutil.initUIelement(this.$el);

			return this;
		},

		/**
		 * 階層レベル振り直し
		 */
		_reNum : function(){
			var $input = this.$("#ca_table_tbody").find('input[name="no"]');
			$input.each(function(i){
				$(this).val(i + 1);
			});

			this.calc_qty_amt_total();
			return this;
		},

		/**
		 * 行削除処理
		 */
		_onDeleteLineClick : function(e) {
			var ope_mode = this.options.opeTypeId;
			if (ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
					|| ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					|| ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			$(e.target).parent().parent().remove();
			this.calc_qty_amt_total();
		},

		/**
		 * 行追加処理(tfoot)
		 */
		_onAddLineClick : function(e) {
			var ope_mode = this.options.opeTypeId;
			if (ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
					|| ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					|| ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = $("#ca_tbody_template");
			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
			$tmpl.tmpl(addObj).appendTo($tbody);

			var $tgt = $tbody.find('input[name="no"]:last');

			var sno = 1;
			var $input = $tbody.find('input[name="no"]');
			while (true) {
				var found = false;
				$input.each(function() {
					var val = $(this).val();
					if (sno == val) {
						found = true;
						return false;
					}
				});
				if (!found) {
					$tgt.val(sno);
					break;
				}
				sno++;
			}
//			var sno = 1;
//			var $input = this.$("#ca_table_tbody").find('input[name="no"]');
//			$input.each(function(i){
//				if($(this).val() == "") {
//					$(this).val(sno);
//				} else {
//					sno = $(this).val();
//					sno++;
//				}
//			});
			clutil.initUIelement(this.$el);

			return this;
		},

		/**
		 * 行追加処理(tfoot)
		 */
		_onAddLine : function(e) {
			var ope_mode = this.options.opeTypeId;
			if (ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
					|| ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					|| ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = $("#ca_tbody_template");
			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
			$tmpl.tmpl(addObj).appendTo($tbody);
			this._reNum();
			clutil.initUIelement(this.$el);

			return this;
		},

		/**
		 * JANコード変更イベント
		 */
		_onJanCodeChanged: function(e) {
			// JanCode 検索する。検索結果は、_onCLjancode_srchCompleted() 関数で設定。
			$(e.target).removeClass('janNG');
			var janCodeSrchReq = {
				janCode: $(e.target).val(),
				srchYmd: clcom.getOpeDate(),
				completed: this._onCLjancode_srchCompleted
			};
			clutil.cljancode(janCodeSrchReq, e);
		},
		// JANコード入力時に関連情報表示
		_onCLjancode_srchCompleted: function(result, e){
			var $tr = $(e.target).closest('tr');
			if(result.status == 'OK'){
				this.validator.clearErrorMsg($tr.find('#ca_janCode'));
				$tr.find('#ca_janCode').removeClass('janNG');
				// JanCode が見つかった ⇒ 値を表示
				var item = result.data.rec;
				// 品種
//				$tr.find('#ca_stditgrpName').val(item.variety.name);
				// メーカー品番
//				$tr.find('#ca_makerCode').val(item.maker.code);
				// 商品名
				$tr.find('#ca_itemName').val(item.item.name);
				// カラー
//				$tr.find('#ca_colorName').val(item.color.name);
				// サイズ
//				$tr.find('#ca_sizeName').val(item.size.name);
				// 単価（円）
				$tr.find('#ca_cost').val(item.cost);
				// 商品ID
				$tr.find('#ca_itemID').val(item.colorSizeItemID);
				// 数量
				$tr.find('#ca_qy').val('');
				// 単価（円）
				$tr.find('#ca_am').val('');
				$('.errorInside').hide();
			}else{
				$tr.find('#ca_janCode').addClass('janNG');
				_.defer(_.bind(function(){
					this.validator.setErrorMsg($tr.find('#ca_janCode'), clmsg.ECM0030);
				}, this));

				// JanCode が見つからない ⇒ クリアする
				// 品種
//				$tr.find('#ca_stditgrpName').val('');
				// メーカー品番
//				$tr.find('#ca_makerCode').val('');
				// 商品名
				$tr.find('#ca_itemName').val('');
				// カラー
//				$tr.find('#ca_colorName').val('');
				// サイズ
//				$tr.find('#ca_sizeName').val('');
				// 単価（円）
				$tr.find('#ca_cost').val('');
				// 商品ID
				$tr.find('#ca_itemID').val('');
				// 数量
				$tr.find('#ca_qy').val('');
				// 単価（円）
				$tr.find('#ca_am').val('');
				this.validator.setErrorMsg($(e.target), 'メーカーに対応するＪＡＮコードを入力して下さい。');
			}
		},

		/**
		 * 点数変更イベント
		 */
		_onQyChange: function(event, ui) {
			var $target = $(event.target);
			var qy = $target.val();
			// TODO: qy の input が Number のみであること！ --> data-limit を使う？？

			var price = $target.closest('tr').find('#ca_cost').val();
//			var price = 10;
			var am = qy * Number((price).replace(/,/g,''));

//			$target.closest('tr').find('#ca_am').val(am);
			var am_flg = 0;
			am_flg = Number(am) || "a";
			if (am_flg == "a") {
				$target.closest('tr').find('#ca_am').val("　");
			} else {
				$target.closest('tr').find('#ca_am').val(clutil.comma(am));
			}
//			clutil.setFocus($target.closest('tr').find('#ca_am'));

			this.calc_qty_amt_total();
			$('.errorInside').hide();
		},

		/**
		 * 合計再計算
		 */
		calc_qty_amt_total : function() {
			var qtyo_t = 0;
			var qty_t = 0;
			var am_t = 0;

			this.$("#ca_table_tbody").find('input[name="qyOrg"]').each(function(){
				qtyo_t += Number((this.value).replace(/,/g,''));
			});
			this.$("#ca_table_tbody").find('input[name="qy"]').each(function(){
				qty_t += Number((this.value).replace(/,/g,''));
			});
			this.$("#ca_table_tbody tr").find('#ca_am').each(function(){
				am_t += Number((this.value).replace(/,/g,''));
			});
			var $input = this.$("#ca_table_tbody").find('input[name="costOrg"]');
			$input.each(function(){
				clutil.setFocus($input);
			});
			$input = this.$("#ca_table_tbody").find('input[name="qyOrg"]');
			$input.each(function(){
				clutil.setFocus($input);
			});
			$input = this.$("#ca_table_tbody").find('input[name="cost"]');
			$input.each(function(){
				clutil.setFocus($input);
			});
/*
			$input = this.$("#ca_table_tbody").find('input[name="qy"]');
			$input.each(function(i){
				var dt = $(this).val();
				if(!_.isEmpty(dt)){
					clutil.setFocus($(this));
				}
			});
*/
			$input = this.$("#ca_table_tbody").find('input[name="am"]');
			$input.each(function(){
				clutil.setFocus($input);
			});
//			$("#ca_sumQyOrg").text(clutil.comma(qtyo_t));
//			$("#ca_sumQy").text(clutil.comma(qty_t));
//			$("#ca_sumAm").text(clutil.comma(am_t));
			var qyo_flg = 0;
			var qy_flg = 0;
			var am_flg = 0;
			qyo_flg = Number(qtyo_t) || "a";
			qy_flg = Number(qty_t) || "a";
			am_flg = Number(am_t) || "a";
			if (qyo_flg == "a") {
				$("#ca_sumQyOrg").text("");
			} else {
				$("#ca_sumQyOrg").text(clutil.comma(qtyo_t));
			}
			if (qy_flg == "a") {
				$("#ca_sumQy").text("　");
			} else {
				$("#ca_sumQy").text(clutil.comma(qty_t));
			}
			if (am_flg == "a") {
				$("#ca_sumAm").text("　");
			} else {
				$("#ca_sumAm").text(clutil.comma(am_t));
			}
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
/*
			// 入力チェック
			if(!this.isValid()){
				return;
			}
*/
			// validation
			var f_error = false;
			this.srchAreaValidator.clear();
			if(!this.srchAreaValidator.valid()) {
				f_error = true;
				return;
			}
			var $slipCode = this.$("#ca_slipCode");
			var slipCodeLength = this.$('#ca_slipCode').val().length;
			if(slipCodeLength !== 6 && slipCodeLength !== 8){
				this.validator.setErrorMsg($slipCode, '伝票番号は６桁か８桁で入力してください。');
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return false;
			}
			var req = this._buildGetReqFunction();

			// 検索実行
			this.doSrch(req);
		},



		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':        // 確定済
				if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
					var val = $('[name=ca_slipTypeID]:checked').val();
					var rec = {
						unitID: {
							id: 0,
							code: "",
							name: "",
						},
					};

					// 新規の場合は、画面をクリアして初期表示状態とする
					this._onSlipTypeChange();
					this.makeDefaultTable();
					//this.$('#ca_unitID').selectpicker('val', '');
					clutil.data2view($("#div_unitID"), rec);
					//this.$('#ca_store').val('');
					this.$('#ca_vendor').val('');
					this.$('#ca_slipCode').val('');
					this.$('#ca_dlvwapTypeID').selectpicker('val', '');
					this.$('#ca_center').val('');
					this.$('#ca_comment').val('');

					clutil.viewRemoveReadonly(this.$('#div_unitID'));
					//clutil.viewReadonly(this.$('#div_store'));
					clutil.viewRemoveReadonly(this.$('#div_vendor'));
					if (val == amcm_type.AMCM_VAL_SLIP_DELIVER) {
						clutil.viewRemoveReadonly(this.$('#div_slipCode'));
					} else {
						clutil.viewReadonly(this.$('#div_slipCode'));
					}
					clutil.viewRemoveReadonly(this.$('#div_slipTypeID'));
					clutil.viewRemoveReadonly(this.$('#div_srch'));

					this.mdBaseView.hideRibbon();

				} else {
					// TODO: args.data を画面個別 Viwe へセットする。
					this.mdBaseView.options.confirmLeaving = false;
					if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
						this.options.chkData[args.index].deliverID = data.AMDLV0020UpdRsp.deliverID;
					}
					if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
						this.options.chkData[args.index].deliverID = 0;
					}
					// 確定済なので、 全 <input> を readonly 化するなどの処理。
					document.location = '#';
					clutil.viewReadonly(this.$el);
					$("#ca_table .btn-delete").hide();
					$("#ca_addLine").hide();
					var slipCode = args.data.AMDLV0020UpdRsp.slipCode;
					if (slipCode != null && !_.isEmpty(slipCode)) {
						$("#ca_slipCode").val(slipCode);
					}
					this.savedData = args.data;
				}
				break;
			case 'CONFLICT':    // 別のユーザによって DB が更新された
				// TODO: args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				break;
			case 'DELETED':        // 別のユーザによって削除された
				// TODO: args.data が null なら空欄表示化する。args.data に何かネタがあれば画面個別Viewへセットする。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				break;
			default:
			case 'NG':            // その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// TODO: 入力値エラー情報が入っていれば、個別 View へセットする。。
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示

				if (args.data.rspHead.message == "WDL0001" || args.data.rspHead.message == "WDL0002"){
					var confmsg = clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args);

					var reqHead = {
							opeTypeId : this.options.opeTypeId
					};
					var head = clutil.view2data(this.$('#ca_srchArea'));
					var head2 = clutil.view2data(this.$('#ca_srchArea2'));
					head.store = head._view2data_store_cn;
					head.vendor = head._view2data_vendor_cn;
					head.center = head2._view2data_center_cn;
					head.dlvwapTypeID = $("#ca_dlvwapTypeID").val();
					head.reflectStock = $("#ca_reflectStock").val();
					head.sumQyOrg = $("#ca_sumQyOrg").text().split(',').join('');
					head.sumQy = $("#ca_sumQy").text().split(',').join('');
					head.sumAm = $("#ca_sumAm").text().split(',').join('');
					head.comment = $("#ca_comment").val();
					if (this.viewSeed != null && this.viewSeed.slip != null) {
						head.orderDate = this.viewSeed.slip.orderDate;
					}
					var list = clutil.tableview2data(this.$('#ca_table_tbody').children());
					// 空白行は無視したリストを作成
					var dtlList = [];
					var noArray = [];
					for(var i=0; i<list.length; i++){
						if(list[i].itemID != ""){
							dtlList.push(list[i]);
							noArray.push(list[i].no);
						}
					}
					var AMDLV0020UpdReq = {
						slip: head,
						slipItemList : dtlList
					};
					var reqObj = {
						reqHead : reqHead,
						AMDLV0020UpdReq  : AMDLV0020UpdReq
					};
					// データを登録する
					var send =  {
						resId : clcom.pageId,
						data: reqObj,
					    confirm: confmsg
					};
					this.mdBaseView.forceSubmit(send);
				} else {
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
						prefix: 'ca_'
					});
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				}
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);

			this.$('#div_center_p').removeClass('required');
			this.$('#ca_center').removeClass('cl_valid cl_required');

			var data = args.data;
			this.showResultArea();
			args.status2 = args.status;
			switch(args.status){
			case 'OK':
				// TODO: args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				var getRsp = data.AMDLV0020GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.dispSlipTypeData(getRsp.slip.slipTypeID);
				this.data2view(getRsp);
				clutil.viewRemoveReadonly(this.$el);
				$("#ca_table .btn-delete").show();
				$("#ca_addLine").show();
				this.$('#ca_reflectStock').val(getRsp.slip.reflectStock);
				this.toggleStockFlag();
				if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
					clutil.viewReadonly(this.$('#div_slipTypeID'));
					clutil.viewReadonly(this.$('#div_unitID'));
					clutil.viewReadonly(this.$('#div_store'));
					clutil.viewReadonly(this.$('#div_slipCode'));
					clutil.viewReadonly(this.$('#div_vendor'));
					clutil.viewReadonly(this.$('#div_srch'));
					clutil.viewReadonly(this.$('#div_dlvwapTypeID'));
					if (getRsp.slip.slipTypeID == amcm_type.AMCM_VAL_SLIP_DELIVER) {
						if (getRsp.slip.slipCode.length == 8 &&
								getRsp.slip.dlvwapTypeID == amcm_type.AMCM_VAL_DLV_ROUTE_TC1) {
							this.$('#div_center_p').addClass('required');
							this.$('#ca_center').addClass('cl_valid cl_required');

							if (getRsp.slip.center != null && getRsp.slip.center.id > 0) {
								clutil.viewReadonly(this.$('#div_center'));
							}
						}
					} else {
						this.$('#div_center_p').removeClass('required');
						this.$('#ca_center').removeClass('cl_valid cl_required');
						clutil.viewReadonly(this.$('#div_center'));
					}
				}

				// 内容物がある場合 --> 結果表示する。
				this.tableSetRecs(getRsp);
				var $input = this.$("#ca_table_tbody").find('input[name="qy"]');
				$input.each(function(i){
					var dt = $(this).val();
					if(!_.isEmpty(dt)){
						clutil.setFocus($(this));
					}
				});
				mainView.setFocus();
				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					clutil.viewReadonly(this.$el);
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
					clutil.viewReadonly(this.$el);
					this.$('#ca_reflectStock').attr('disabled', true);
					break;
				}
				mainView.validator.clearErrorMsg($('#ca_dlvwapTypeID'));
				mainView.validator.clearErrorMsg($('#ca_center'));

				break;
			case 'DONE':        // 確定済
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				getRsp = args.data.AMDLV0020GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.dispSlipTypeData(getRsp.slip.slipTypeID);
				this.data2view(getRsp);
				clutil.viewReadonly(this.$('#ca_srchArea'));

				// 内容物がある場合 --> 結果表示する。
				this.tableSetRecs(getRsp);
				var $input = this.$("#ca_table_tbody").find('input[name="qy"]');
				$input.each(function(i){
					var dt = $(this).val();
					if(!_.isEmpty(dt)){
						clutil.setFocus($(this));
					}
				});
				mainView.setFocus();
				clutil.viewReadonly(this.$el);
				$("#ca_table .btn-delete").hide();
				$("#ca_addLine").hide();
				break;
			case 'DELETED':        // 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？                        【確認】
				// 全 <input> は readonly 化するなどの処理。
				getRsp = args.data.AMDLV0020GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp);
				clutil.viewReadonly(this.$el);
				break;
			case 'CONFLICT':    // ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				getRsp = args.data.AMDLV0020GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp);
				clutil.viewReadonly(this.$el);
				break;
			default:
			case 'NG':            // その他エラー。
				this.hideResultArea();
				// 全 <input> を readonly 化するなどの処理。
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL ||
				   this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
				   this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
					// 照会モードは、Edit ブロッキングしておく。
					clutil.viewReadonly(this.$el);
				} else if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					clutil.viewReadonly(this.$(".ca_upd_dis"));
				}
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		data2view: function(data){
			var rec = data.slip;
			rec.store = {
				id: rec.store.id,
				code: rec.store.code,
				name: rec.store.name
			};
			rec.vendor = {
					id: rec.vendor.id,
					code: rec.vendor.code,
					name: rec.vendor.name
			};
			rec.center = {
					id: rec.center.id,
					code: rec.center.code,
					name: rec.center.name
			};
			clutil.data2view(this.$('#ca_srchArea'), rec);
//			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				clutil.data2view(this.$('#ca_srchArea2'), rec);
//			}
			clutil.data2view(this.$('#ca_commentArea'), rec);
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				// TODO: アプリ個別の render をする。
//				this.makeDefaultTable();
				this._reNum();
				this.mdBaseView.setSubmitEnable(false);
			} else {

				// 一覧画面からの引継データ pageArgs があれば渡す。
				$('#ca_deliverID').val(this.options.chkData[0].deliverID);
				$('#ca_firstDeliverID').val(this.options.chkData[0].firstDeliverID);

				this.mdBaseView.fetch();    // データを GET してくる。
				this.mdBaseView.setSubmitEnable(true);
			}
			return this;
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				clutil.setFocus($('#ca_unitID'));
			} else if ($("#ca_center").attr("readonly") != null) {
				clutil.setFocus($('#div_reflectStock'));
			} else {
				clutil.setFocus($('#ca_center'));
			}
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildSubmitReqFunction: opeTypeId[' +
						opeTypeId + '] pgIndex[' + pgIndex + ']');
			/*
			 * 無効化チェック
			 */
			if ($("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}
			/*
			 * 入力値チェック 削除時はチェックしない
			 */
			if (this.options.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				// validation
				var f_error = false;
				this.validator.clear();
				$('#ca_tablewrap').find('.errorInside').remove();


//				if (!this.validator.valid()){
//					f_error = true;
//				}
				if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
					if(!this.srchAreaValidator.valid()) {
						f_error = true;
					}
				}
				if(!this.srchArea2Validator.valid()) {
					f_error = true;
				}
				if(!this.ca_commentAreaValidator.valid()) {
					f_error = true;
				}
				if (f_error)
					return;
			}
			var reqHead = {
					opeTypeId : this.options.opeTypeId
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

//			this.toggleStockFlag();
			var head = clutil.view2data(this.$('#ca_srchArea'));
			var head2 = clutil.view2data(this.$('#ca_srchArea2'));
			head.store = head._view2data_store_cn;
			head.vendor = head._view2data_vendor_cn;
			head.center = head2._view2data_center_cn;
			head.dlvwapTypeID = $("#ca_dlvwapTypeID").val();
			head.reflectStock = $("#ca_reflectStock").val();
			head.sumQyOrg = $("#ca_sumQyOrg").text().split(',').join('');
			head.sumQy = $("#ca_sumQy").text().split(',').join('');
			head.sumAm = $("#ca_sumAm").text().split(',').join('');
			head.comment = $("#ca_comment").val();
			if (this.viewSeed != null && this.viewSeed.slip != null) {
				head.orderDate = this.viewSeed.slip.orderDate;
			}
/*
			var list = clutil.tableview2ValidData({
				$tbody: this.$('#ca_table_tbody'),
				validator: this.validator,
				tailEmptyCheckFunc: function(itemDto){
					return !itemDto.janCode &&
						(!itemDto.qy || itemDto.qy === '0');
				}
			});
			if (_.isEmpty(list)) {
				$('#ca_tablewrap').prepend('<span class="errorInside">テーブル内にエラー箇所があります</span>');
				if (list != null) {
					this.validator.setErrorHeader('明細を入力してください');
				}
				return;
			}
*/

			var list = clutil.tableview2data(this.$('#ca_table_tbody').children());
/*
			for(var dlength=list.length; dlength > 0; dlength--){
//				if(list[dlength-1].janCode != "" || list[dlength-1].qy != ""){
				if(list[dlength-1].no != "" || list[dlength-1].janCode != "" || list[dlength-1].qy != ""){
					break;
				}
			}
*/
			var dlength = list.length;
			// 空白行は無視したリストを作成
	        var $tbody = this.$('#ca_table > tbody');   // <tbody> の要素を指定する。
			var trElems = $tbody.find('tr');

			var f_error = false;
			for(var i=0; i<dlength; i++){
				var $tr = $(trElems.get(i));
				var inItemID = $tr.find('input[name="itemID"]');
				var inQy = $tr.find('input[name="qy"]');
				var inJanCode = $tr.find('input[name="janCode"]');

				if(inJanCode.val() == "" && inQy.val() == ""){
					continue;
				}
				if(inItemID.val() == ""){
					this.validator.setErrorMsg(inJanCode, '正しいJANコードを入力してください。');
					f_error = true;
				}
				if(inJanCode.val() == ""){
					this.validator.setErrorMsg(inJanCode, 'JANコードは必ず入力してください。');
					f_error = true;
				}
				var chkQy = inQy.val().replace(",","").replace(",","");
				if(!chkQy.match(/^-?[0-9]+$/) || chkQy < -9999999 || chkQy > 9999999){
					this.validator.setErrorMsg(inQy, '整数で入力してください(7桁以内)');
					f_error = true;
				}
				if(inQy.val() == ""){
					this.validator.setErrorMsg(inQy, '点数は必ず入力してください。');
					f_error = true;
				}
			}
			if(f_error){
				$('#ca_tablewrap').prepend('<span class="errorInside">テーブル内にエラー箇所があります</span>');
                this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
    			$('.errorInside').show();
				return null;
			}

			// 空白行は無視したリストを作成
			var dtlList = [];
			var noArray = [];
			for(var i=0; i<list.length; i++){
				if(list[i].itemID != ""){
					dtlList.push(list[i]);
					noArray.push(list[i].no);
				}
			}
			// 伝票は9行以内
			if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				noArray = _.uniq(noArray);
				if (noArray.length > 9) {
					this.validator.setErrorInfo({_eb_: "伝票は9行以内で入力してください。"});
					return null;
				}
			} else {
				if (dtlList.length > 9) {
					this.validator.setErrorInfo({_eb_: "伝票は9行以内で入力してください。"});
					return null;
				}
			}

			var AMDLV0020UpdReq = {
				slip: head,
//				slipItemList : list
				slipItemList : dtlList
			};

			var reqObj = {
				reqHead : reqHead,
				AMDLV0020UpdReq  : AMDLV0020UpdReq
			};
			// データを登録する
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},
		/**
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}
			var unitID = Number($("#ca_unitID").val());
			this.getOrg(unitID);
			this.storeAutocomplete.setValue();
			this.$("#ca_store").attr("readonly", (unitID == 0));
		},
		/**
		 * 店舗オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: $("#ca_store"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onStoreSelClick: function() {
			var _this = this;
//			var options = {
//				f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
//			};
			var unitID = Number($("#ca_unitID").val());
			var options = {
				editList : null,
				isSubDialog : null,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id : (unitID == 0) ? 3 : unitID,
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE, am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
				f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
			};

			_this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * 「在庫へ反映」フラグを反転する
		 */
		toggleStockFlag: function(){
			var $cb = this.$('#ca_reflectStock');
//			var currentFlag = $cb.val();
//			var toggledFlag = (currentFlag == 'on') ? 1 : 0;
			var toggledFlag = $cb.val();
			if(toggledFlag == "1"){
				$cb.closest('.switch-animate')
					.removeClass('switch-off')
					.addClass('switch-on');
			}else{
				$cb.closest('.switch-animate')
					.removeClass('switch-on')
					.addClass('switch-off');
			}
			$cb.val(toggledFlag);
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			var storeID = null;
			if (pgIndex == null){
			} else {
				var data = this.options.chkData[pgIndex];
				$('#ca_deliverID').val(data.deliverID);
				$('#ca_firstDeliverID').val(data.firstDeliverID);
				storeID = data.storeID;
			}
			var head = clutil.view2data(this.$('#ca_srchArea'));
			if (storeID) {
				head.store = storeID;
			}
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},
				// 明細検索リクエスト
				AMDLV0020GetReq: {
					srchDeliverID : head.deliverID,
					srchFirstDeliverID : head.firstDeliverID,
					slipCode : head.slipCode,
					storeID : head.store,
					vendorID : head.vendor
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMDLV0020UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,    //'AMDLV0020',
				data: getReq
			};
		},

		onSrchSuccess: function(data, srchReq){
			//console.log(arguments);

			this.$('#div_dlvwapTypeID').removeClass("notfocus");
			$('#div_center_p').removeClass('required');
			$('#ca_center').removeClass('cl_valid cl_required');

			// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
			var getRsp = data.AMDLV0020GetRsp;
			var recs = getRsp && getRsp.slipItemList;
			if(_.isEmpty(recs)){
				// 検索ペインを表示？
				//					mainView.srchAreaCtrl.show_srch();

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				this.hideResultArea();
				return;
			}

			this.showResultArea();
			this.data2view(getRsp);
//			this.toggleStockFlag();

			this.viewSeed = getRsp;
			getRsp.slip.reflectStock = 1;
			this.$('#ca_reflectStock').val(getRsp.slip.reflectStock);
			this.toggleStockFlag();

			clutil.viewReadonly(this.$('#div_slipTypeID'));
			clutil.viewReadonly(this.$('#div_unitID'));
			clutil.viewReadonly(this.$('#div_store'));
			clutil.viewReadonly(this.$('#div_slipCode'));
			clutil.viewReadonly(this.$('#div_vendor'));
			clutil.viewReadonly(this.$('#div_srch'));
			clutil.viewReadonly(this.$('#div_dlvwapTypeID'));
			if (getRsp.slip.slipCode.length == 8 &&
					getRsp.slip.dlvwapTypeID == amcm_type.AMCM_VAL_DLV_ROUTE_TC1) {
				$('#div_center_p').addClass('required');
				$('#ca_center').addClass('cl_valid cl_required');

				if (getRsp.slip.center != null && getRsp.slip.center.id > 0) {
					clutil.viewReadonly($('#div_center'));
				}
			}
			this.mdBaseView.setSubmitEnable(true);

			// 結果ペインを表示
			//				this.srchAreaCtrl.show_result();

			// 内容物がある場合 --> 結果表示する。
			//				this.recListView.setRecs(recs);
			this.tableSetRecs(getRsp);
			var $input = this.$("#ca_table_tbody").find('input[name="qy"]');
			$input.each(function(i){
				var dt = $(this).val();
				if(!_.isEmpty(dt)){
					clutil.setFocus($(this));
				}
			});
			mainView.setFocus();

			// 初期選択の設定（オプション）
			//				if(!_.isEmpty(selectedIds)){
			//					this.recListView.setSelectById(selectedIds, true);
			//				}

			//				this.resetFocus();
		},

		onSrchSuccess2: function(data, srchReq){
			var getRsp = data.AMDLV0020GetRsp;
			var recs = getRsp && getRsp.slipItemList;
			var codeLen = srchReq.data.AMDLV0020GetReq.slipCode.length;
			// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
			if(_.isEmpty(recs) && codeLen !== 6){
				// 検索ペインを表示？
				//					mainView.srchAreaCtrl.show_srch();

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				if (data.rspHead.status) {
					clutil.mediator.trigger('onTicker', data);
				} else {
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				}

				this.hideResultArea();
				return;
			}

			// 6桁の場合は納品形態から「2:ＴＣ１」を削除する
			if (codeLen === 6) {
				var list = clutil.gettypenamelist(amcm_type.AMCM_TYPE_DLV_ROUTE, [
					amcm_type.AMCM_VAL_DLV_ROUTE_DIRECT,
					amcm_type.AMCM_VAL_DLV_ROUTE_DC1,
					amcm_type.AMCM_VAL_DLV_ROUTE_DC2,
					amcm_type.AMCM_VAL_DLV_ROUTE_DC3,
				]);
				clutil.cltypeselector2({
					$select: $("#ca_dlvwapTypeID"),
					list: list,
					idname: "type_id",
				});
			}

			this.showResultArea();
			// this.$('#ca_recno').val(getRsp.slip.recno);
			// this.$('#ca_state').val(getRsp.slip.state);
			// this.$('#ca_deliverID').val(getRsp.slip.deliverID);
			// this.$('#ca_firstDeliverID').val(getRsp.slip.firstDeliverID);
			// this.$('#ca_vendorOutID').val(getRsp.slip.vendorOutID);
			// this.$('#ca_staffID').val(getRsp.slip.staffID);
			// this.$('#ca_dlvTypeID').val(getRsp.slip.dlvTypeID);
			// this.$('#ca_outStoreID').val(getRsp.slip.outStoreID);
			// this.$('#ca_shiprecTypeID').val(getRsp.slip.shiprecTypeID);
			// this.$('#ca_dlvwapTypeID').val(getRsp.slip.dlvwapTypeID);
			// this.$('#ca_reflectStock').val(getRsp.slip.reflectStock);
			this.toggleStockFlag();

			if (codeLen !== 6) {
				clutil.viewReadonly(this.$('#div_unitID'));
				clutil.viewReadonly(this.$('#div_store'));
				clutil.viewReadonly(this.$('#div_vendor'));
				clutil.viewReadonly(this.$('#div_slipCode'));
			}
			clutil.viewReadonly(this.$('#div_slipTypeID'));
			clutil.viewReadonly(this.$('#div_srch'));
			this.mdBaseView.setSubmitEnable(true);

			this.tableSetRecs(getRsp);

			clutil.setFocus($("#ca_dlvwapTypeID").next().children('input'));
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedIds){
//			this.clearTable();
//			this.makeDefaultTable();

			var defer = clutil.postJSON('AMDLV0020', srchReq.data)
					.done(_.bind(function(data){
						this.onSrchSuccess(data, srchReq);
					}, this))
					.fail(_.bind(function(data){
						this.onSrchSuccess2(data, srchReq);
					}, this));
			return defer;
		},

		// 空更新チェックデータをつくる
		_buildSubmitCheckDataFunction: function(arg){
//			rg: {
//				index: toIndex,                // 複数レコード選択編集時におけるインデックス番号
//				resId: req.resId,            // リソースId -- "XXXXV0010" など
//				data: clutil.dclone(data)    // GETの応答データ（共通ヘッダも含む）
//			};

			var appRec = arg.data.AMDLV0020GetRsp;
			// TODO: 空更新チェック対象外のフィールドを削っていく。

			return appRec;
		},

		showResultArea: function(){
			$('#ca_srchArea2').show();
			$('#result').show();
		},

		hideResultArea: function(){
			$('#ca_srchArea2').hide();
			$('#result').hide();
		},

		_eof: 'AMDLV0020.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////

		// 一覧画面からの引継データ pageArgs があれば渡す。
		//	pageArgs: {
		//		// 処理区分
		//		opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL,
		//		// 一覧画面で選択されたアイテム要素の配列
		//		chkData: [
		//			{id:1,code:'code-001',name:'item-001',},
		//			{id:2,code:'code-002',name:'item-002',},
		//			{id:3,code:'code-003',name:'item-003',}
		//		]
		//	};
		mainView = new MainView(clcom.pageArgs).initUIElement().render();
		mainView.setFocus();
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
