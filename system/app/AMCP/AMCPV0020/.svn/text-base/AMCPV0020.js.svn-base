useSelectpicker2();

$(function(){
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,
		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',
			'click #ca_btn_data_select'		: '_onDataSelClick',
			'click #ca_btn_make_report'		: '_onMakeReportClick',
			'click .cl_axis'				: '_onAxisClick',
			'change #ca_unitID'				: '_onUnitChanged',		// 事業ユニット変更時
			'cl_change #ca_stditgrp'		: '_onItgrpChanged',	// 品種変更時
			"change #ca_itemAttr1"			: '_onItemAttr1Change',	// 商品属性1変更時
			"change #ca_itemAttr2"			: '_onItemAttr2Change',	// 商品属性2変更時
			"change #ca_itemAttr1Value"		: "_onItemAttrValueChanged",
			"change #ca_itemAttr2Value"		: "_onItemAttrValueChanged",
		},

		initialize: function(opt){
			_.bindAll(this);

			var isChild = false;
			if (opt != null && opt.opeTypeId){
				isChild = true;
			}

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
					title: 'プライス別棚卸データ入力',
					//subtitle: '登録・修正',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					btn_cancel: (o.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && !isChild)
							? this._doCancel : true,
					updMessageDialog: false,
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			}

			this.setSubmitEnable(false);		// 更新ボタン非活性化
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){
			this.mdBaseView.commonHeader._onBackClick(e);
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					setTimeout(function(){
						mainView.mdBaseView._onCancelClick();
					}, 1200);
				}else{
					if ($(e.target).hasClass('cl_axis')){
						this.pushPage(clcom.appRoot + '/AMCP/AMCPV0030/AMCPV0030.html', e);
					}else{
						var e = {target:{id:0,}};
						this.pushPage(clcom.appRoot + '/AMCP/AMCPV0040/AMCPV0040.html', e);
					}
				}
				break;

			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				this.setReadOnlyAllItems();
				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// TODO: 入力値エラー情報が入っていれば、個別 View へセットする。
				break;
			}

			this.doClear = true;
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			var data = args.data;
			var getRsp = data.AMCPV0020GetRsp;

			var setReadOnly = false;

			switch(args.status){
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				this.doClear = true;
				setReadOnly = true;
				// FallThrough

			case 'OK':
				clutil.data2view(this.$('#div_ca_staff'), {staffID:getRsp.cntPrc.staffInfo,});
				$('#ca_staffID').val(getRsp.cntPrc.staffInfo.code);

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:		// 複製
					getRsp.cntPrc.recno = '';
					getRsp.cntPrc.state = '';
					getRsp.cntPrc.cntPrcRprtID = 0;
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					canUpdate = true;
					break;
				default:
					break;
				}

				// ①プライス別棚卸報告情報
				clutil.data2view(this.$('#ca_info1'), getRsp.cntPrc);

				// ④競合店の品揃え数と自店改善数
				if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
					this.setAxis(getRsp.axisList);
				}

				// ②プライス別棚卸のHTローディング結果
				this.setCntProc(data.AMCPV0020HtDataGetRsp.cntPrcList);

				var canUpdate = $('#ca_axis_table').data().canupdate;
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					canUpdate = true;
				}else if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
					canUpdate = false;
				}
				this.setSubmitEnable(canUpdate);

				this.fixedLimit();

				clutil.setFocus($('#ca_reportName'));

				var opeTypeId = this.options.opeTypeId;
				var tgtView = this;

				this.fieldRelation.done(function() {

					tgtView.utl_unit = this.fields.clbusunitselector;
					tgtView.utl_store = this.fields.clorgcode;

					if (!_.isUndefined(tgtView.options.chkData[0].storeName)){
						var codename = tgtView.options.chkData[0].storeName.split(':');
						var store = {
								id		: getRsp.cntPrc.storeID,
								code	: codename[0],
								name	: codename[1],
						};
						this.fields.clorgcode.setValue(store);
					}

					$('#ca_itemAttr1').selectpicker('val', getRsp.cntPrc.itemAttr1);
					$('#ca_itemAttr2').selectpicker('val', getRsp.cntPrc.itemAttr2);

					mainView._onItemAttr1Change(null, getRsp.cntPrc);
					mainView._onItemAttr2Change(null, getRsp.cntPrc);

					if (opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
						clutil.viewReadonly($("#div_ca_stditgrp"));
						clutil.viewReadonly($("#div_ca_itemAttr"));

						if (opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
							clutil.viewReadonly($("#ca_base_form"));
							clutil.viewReadonly($("#div_ca_targetName"));
						}
					} else {
						tgtView.utl_date.datepicker('setIymd', clcom.getOpeDate());
					}

					if (opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL ||
						opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
						setReadOnly){
						tgtView.setReadOnlyAllItems();
					}
				});

				break;

			default:
			case 'NG':			// その他エラー。
				this.setReadOnlyAllItems();
				break;
			}
		},

		setReadOnlyAllItems: function(){
			clutil.viewReadonly($("#ca_base_form"));
			clutil.viewReadonly($("#ca_info1"));
			clutil.viewReadonly($("#ca_info2"));

			clutil.viewReadonly($(this.fieldRelation.fields.clvarietycode.el));
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			var initUnitID = clcom.userInfo.unit_id;
			if (typeof this.options.srchCond != 'undefined'&&
				typeof this.options.srchCond.unitID != 'undefined'){
				initUnitID = this.options.srchCond.unitID;
			}
			this.prevUnitId = initUnitID;

			// 初期フォーカスオブジェクト設定
			this.$tgtFocus = $('#ca_storeID');

			// 店舗初期値取得
			var storeInit = null;
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
					clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				storeInit = {
					id: clcom.userInfo.org_id,
					code: clcom.userInfo.org_code,
					name: clcom.userInfo.org_name
				};

				this.$tgtFocus = $('#ca_staffID');
			} else {
				storeInit = {
					id: 0,
					code: '',
					name: ''
				};
			}

			// 社員番号入力
			clutil.clstaffcode2($("#ca_staffID"),{keepCode:true});

			// 作成日
			this.utl_date = clutil.datepicker(this.$("#ca_srchDate"));
			this.utl_date.datepicker('setIymd',clcom.getOpeDate());

			// シーズン
			this.utl_seasons = clutil.cltypeselector({
				el			: '#ca_seasonList',
				kind		: amcm_type.AMCM_TYPE_SEASON,
				selectpicker:
				{
					actionsBox	: true,
				}
	    	});

			// 商品属性1,2
			this.getitemattrgrpfunc();

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: '#ca_unitID',
					initValue: initUnitID,
				},
				// 品種
				clvarietycode : {
					el: '#ca_stditgrp',
				},
				clorgcode: {
					el : '#ca_storeID',
					dependSrc: {
						p_org_id: 'unit_id'
					},
					initValue : {
						code	: storeInit.code,
						id		: storeInit.id,
						name	: storeInit.name,
					},
				},
			}, {
				dataSource: {
					ymd : clcom.getOpeDate,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
				}
			});

			var tgtView = this;
			this.fieldRelation.done(function() {
				tgtView.utl_unit = this.fields.clbusunitselector;
				tgtView.utl_store = this.fields.clorgcode;
				tgtView.initialized = true;
				tgtView.setInitializeValue();
				tgtView.setDefaultEnabledProp();
			});

			this.initUIElement_AMPAV0010();
			this.initUIElement_HTSubForm();

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);

			this.fixedLimit();

			// ツールチップ
			$("#ca_tp_season").tooltip({html: true});

			$(".errorInside").text(clmsg.ECP0001);

			return this;
		},

		setInitializeValue: function(){
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				this._onUnitChanged();
			}
		},

		setDefaultEnabledProp: function() {
			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS &&
				clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$("#div_ca_unitID").hide();
			}

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
				clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.viewReadonly($("#div_ca_store"));
			}

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
				$("#ca_btn_store_select").hide();
				$("#ca_btn_make_report").hide();
				$("#ca_btn_data_select").hide();
			}
		},

		fixedLimit: function(){
			clutil.cltxtFieldLimit($("#ca_reportName"));
			clutil.cltxtFieldLimit($("#ca_targetName1"));
			clutil.cltxtFieldLimit($("#ca_targetName2"));
			clutil.cltxtFieldLimit($("#ca_targetName3"));
		},

		/**
		 * 商品属性項目定義検索
		 */
		getitemattrgrpfunc: function(){
			var cond = {
				codename : ""
			};
			var req = {
				cond: cond
			};

			var defer = clutil.postJSON('am_pa_itemattrgrpfunc_srch', req).done(_.bind(function(data){
				this.itemattrgrpfuncselector(data.list);
			}, this)).fail(_.bind(function(data){
			}, this));

			return defer;
		},

		/**
		 * 商品属性項目定義selector
		 */
		itemattrgrpfuncselector: function (list) {
			var _this = this;
			var html_source = '';
			html_source += '<option value="0">&nbsp;</option>';

			if (typeof list != 'undefined'){
				$.each(list, function(){
					var name = _this.gettypename(this.iagfunc);
					if (name) {
						html_source += '<option value="' + this.iagfunc.id + '">' + name + '</option>';
					}
				});
			}

			$("#ca_itemAttr1").html('');
			$("#ca_itemAttr1").html(html_source).selectpicker().selectpicker('refresh');
			$("#ca_itemAttr2").html('');
			$("#ca_itemAttr2").html(html_source).selectpicker().selectpicker('refresh');
		},

		/**
		 * 区分名取得
		 * 戻り値
		 * ・区分コード：区分名
		 */
		gettypename: function(iagfunc) {
			var name = '';
			var tgt = [
				clconst.ITEMATTRGRPFUNC_ID_SUBCLS1,
				clconst.ITEMATTRGRPFUNC_ID_SUBCLS2,
				clconst.ITEMATTRGRPFUNC_ID_COLOR,
				clconst.ITEMATTRGRPFUNC_ID_STYLE,
				clconst.ITEMATTRGRPFUNC_ID_DESIGN,
				clconst.ITEMATTRGRPFUNC_ID_MATERIAL,
				clconst.ITEMATTRGRPFUNC_ID_CUSTOMER,
			];

			$.each(tgt, function() {
				if (this == iagfunc.id) {
					name = iagfunc.code + ':' + iagfunc.name;
					return false;
				}
			});

			return name;
		},

		/**
		 * 商品属性1変更時
		 */
		_onItemAttr1Change: function(e, cntPrc) {
			var iagfuncID = 0;
			var opeTypeId = this.options.opeTypeId;

			if (cntPrc == null){
				iagfuncID = Number($('#ca_itemAttr1').selectpicker('val'));
			}else{
				iagfuncID = cntPrc.itemAttr1;
			}

			if (iagfuncID == 0) {
				$('#ca_itemAttr1Value').selectpicker('val', 0);
				clutil.inputReadonly($('#ca_itemAttr1Value'));
				$('#ca_itemAttr1Value').removeClass('cl_required');
			} else {
				var data = $('#ca_stditgrp').autocomplete('clAutocompleteItem');
				var itgrp = _.pick(data, 'id');

				this.utl_itemattr1 = clutil.clitemattrselector($('#ca_itemAttr1Value'), iagfuncID, itgrp.id, 1);

				this.utl_itemattr1.done(function(){
					if (cntPrc != null){
						$('#ca_itemAttr1Value').selectpicker('val', cntPrc.itemAttr1Value);
					}

					clutil.inputRemoveReadonly($('#ca_itemAttr1Value'));
					$('#ca_itemAttr1Value').addClass('cl_required');

					if (opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW &&
							opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
						clutil.viewReadonly($("#div_ca_itemAttr1Value"));
					}
				});
			}
		},

		/**
		 * 商品属性2変更時
		 */
		_onItemAttr2Change: function(e, cntPrc) {
			var iagfuncID = 0;
			var opeTypeId = this.options.opeTypeId;

			if (cntPrc == null){
				iagfuncID = Number($('#ca_itemAttr2').selectpicker('val'));
			}else{
				iagfuncID = cntPrc.itemAttr2;
			}

			if (iagfuncID == 0) {
				$('#ca_itemAttr2Value').selectpicker('val', 0);
				clutil.inputReadonly($('#ca_itemAttr2Value'));
				$('#ca_itemAttr2Value').removeClass('cl_required');
				$('#ca_itemAttr1').removeClass('cl_required');
			} else {
				var data = $('#ca_stditgrp').autocomplete('clAutocompleteItem');
				var itgrp = _.pick(data, 'id');

				this.utl_itemattr2 = clutil.clitemattrselector($('#ca_itemAttr2Value'), iagfuncID, itgrp.id, 1);

				this.utl_itemattr2.done(function(){
					if (cntPrc != null){
						$('#ca_itemAttr2Value').selectpicker('val', cntPrc.itemAttr2Value);
					}

					clutil.inputRemoveReadonly($('#ca_itemAttr2Value'));
					$('#ca_itemAttr2Value').addClass('cl_required');
					$('#ca_itemAttr1').addClass('cl_required');

					if (opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW &&
							opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
						clutil.viewReadonly($("#div_ca_itemAttr2Value"));
					}
				});
			}
		},

		/**
		 * 品種が変更されたイベント
		 */
		_onItgrpChanged: function(e){
			var itgrpID = $('#ca_stditgrp').val();

			if (itgrpID == 0) {
				$('#ca_itemAttr1').selectpicker('val', 0);
				$('#ca_itemAttr2').selectpicker('val', 0);
				clutil.inputReadonly($('#ca_itemAttr1Value'));
				clutil.inputReadonly($('#ca_itemAttr2Value'));
			} else {
				clutil.inputRemoveReadonly($('#ca_itemAttr1Value'));
				clutil.inputRemoveReadonly($('#ca_itemAttr2Value'));
			}

			this._onItemAttr1Change();
			this._onItemAttr2Change();
		},


		/**
		 * 事業ユニットが変更されたイベント
		 */
		_onUnitChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}

			var tgtView = this;
			this.fieldRelation.done(function() {
				tgtView._onItgrpChanged();

				var unitID = ~~$('#ca_unitID').val();

				if (unitID == '0'){
					clutil.inputReadonly("#ca_storeID");
					clutil.inputReadonly("#ca_btn_store_select");
				}else{
					if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE &&
						clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN){
						clutil.inputRemoveReadonly("#ca_storeID");
						clutil.inputRemoveReadonly("#ca_btn_store_select");
					}
				}

				if (unitID == '0' || unitID != tgtView.prevUnitId){
					tgtView.utl_store.resetValue();
				}

				tgtView.prevUnitId = unitID;
			});
		},

		_onItemAttrValueChanged: function(e) {
			var name = e.currentTarget.name;
			var itemAttr;

			if (name =='itemAttr1Value'){
				itemAttr = this.utl_itemattr1;
			}else{
				itemAttr = this.utl_itemattr2;
			}

			//2016.06.01： 組み合わせの数で最大8個まで選択可能　の機能実装
			var len_itemAttr1 = 0;
			var len_itemAttr2 = 0;

			if (!this.utl_itemattr1) {
			} else {
				if (this.utl_itemattr1.getValue().length == 1 && this.utl_itemattr1.getValue()[0] == 0) {
					len_itemAttr1 = 0;
				} else {
					len_itemAttr1 = this.utl_itemattr1.getValue().length;
				}
			}

			if (!this.utl_itemattr2) {
			} else {
				if (this.utl_itemattr2.getValue().length == 1 && this.utl_itemattr2.getValue()[0] == 0) {
					len_itemAttr2 = 0;
				} else {
					len_itemAttr2 = this.utl_itemattr2.getValue().length;
				}
			}

			var values = itemAttr.getValue();
			var maxLength = Number(clutil.getclsysparam("PAR_AMCP_ITEM_ATTRS"));
			itemAttr.justSelected = values;

//			if (itemAttr.selectedValues != null && (len_itemAttr1 + len_itemAttr2) > maxLength){
			if ((len_itemAttr1 + len_itemAttr2) > maxLength){
				var prevValues;
				var selectedValue;
				if (!itemAttr.selectedValues) {
					prevValues = [];
					selectedValue = values[0];
				} else {
					prevValues = itemAttr.selectedValues;
					var chkVal;
					var chkSrc;

					if (values.length > prevValues.length){
						chkVal = values;
						chkSrc = prevValues;
					} else {
						chkVal = prevValues;
						chkSrc = values;
					}

					// 何が選択されたかを探す
					selectedValue = -1;
					for (var i = 0; i < chkVal.length; i++) {
						var num = chkVal[i];
						if ($.inArray(num, chkSrc) == -1){
							selectedValue = num;
							break;
						}
					};
				}
				// 選択が未チェック->チェックの場合選択をやめる
				if ($.inArray(selectedValue, values) > -1){
					itemAttr.setValue(prevValues);
				}

				values = itemAttr.getValue();

				mainView.validator.setErrorHeader("商品属性1、商品属性2の最大選択可能数は8です。");
			}

			itemAttr.selectedValues = values;
		},

		initUIElement_AMPAV0010 : function(){
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el				: this.$("#ca_AMPAV0010_dialog"),	// 配置場所
				$parentView		: this.$("#mainColumn"),			// 親ビュー
				select_mode 	: clutil.cl_single_select,			// 単一選択
				isAnalyse_mode 	: false,							// 通常画面モード
			});

			this.AMPAV0010Selector.clear = function() {
				if (typeof mainView != "undefined") {
					var autocomplete = mainView.utl_store;
					autocomplete.resetValue();
				}
			};

			this.AMPAV0010Selector.render();
			this.AMPAV0010Selector.clear();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				var autocomplete = mainView.utl_store;
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					autocomplete.setValue({id: id, code: code, name: name});
					mainView.validator.clearErrorMsg($('#ca_storeID'));
				} else {
					var item = autocomplete.getValue();
					if (item.id == 0) {
						this.clear();
					}
				}

				_.defer(function(){
					clutil.setFocus($('#ca_btn_store_select'));
				});
			};
		},

		initUIElement_HTSubForm : function(){
			this.AMCPV0021Selector = new AMCPV0021SelectorView({
				el				: this.$("#ca_AMCPV0021_dialog"),	// 配置場所
				$parentView		: this.$("#mainColumn"),			// 親ビュー
			});

			this.AMCPV0021Selector.render();

			// 選択サブ画面復帰処理
			this.AMCPV0021Selector.okProc = function(data) {
				if (data !== null && data.length > 0) {
					mainView.setCntProc(data);
				}

				_.defer(function(){
					mainView.mdBaseView.$el.scrollTo(mainView.scrollStoreValue);
				});
			};
		},

		setCntProc: function(data){
			$.each(data, function() {
				this.cntPrcDateDisp = clutil.dateFormat(this.cntPrcDate, 'yyyy/mm/dd(w)');
				this.cntPrcTimeDisp = clutil.timeFormat(this.cntPrcTime, 'hh:mm');
			});

			$('#ca_cntprc_table_tbody').empty();
			var $template = $('#ca_cntprc_template');
			$template.tmpl(data).appendTo('#ca_cntprc_table_tbody');

			clutil.initUIelement(this.$('#ca_cntprc_table'));
		},

		setAxis: function(data){
			var no = 0;
			//2016.06.03　山口　 プライス別棚卸明細データ入力画面で改善数量を入力しないでもプライス別棚卸報告書作成ボタンを押下可能となるよう修正
			var canUpdate = true;

			$.each(data, function() {
				this.no = no++;
				if (this.registStatus == 0){
					this.registStatus = amcm_type.AMCM_VAL_REGIST_STATE_TYPE_NOT_REGISTRIED;
				}
				if (this.registStatus == amcm_type.AMCM_VAL_REGIST_STATE_TYPE_REGISTRIED){
					canUpdate = true;
				}
				this.registStatusDisp = clutil.gettypename(amcm_type.AMCM_TYPE_REGIST_STATE_TYPE, this.registStatus);
			});

			$('#ca_axis_table_tbody').empty();
			var $template = $('#ca_axis_template');
			$template.tmpl(data).appendTo('#ca_axis_table_tbody');

			$('#ca_axis_table').data().canupdate = canUpdate;

			clutil.initUIelement($('#ca_axis_table'));
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				$('#ca_toDate').datepicker('setIymd', clcom.max_date);
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			if (typeof this.doClear != 'undefined'){
				clutil.viewRemoveReadonly($('#container'));
				this.setDefaultEnabledProp();
			}

			$('#ca_srchID').val(this.options.chkData[pgIndex].cntPrcID);

			switch (opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				$('#ca_srchDate').removeClass('cl_valid');
				$('#ca_srchDate').removeClass('cl_required');
				$('#ca_storeID').removeClass('cl_valid');
				$('#ca_storeID').removeClass('cl_required');
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				$('#ca_staffID').removeClass('cl_valid');
				$('#ca_staffID').removeClass('cl_required');
				$('#ca_storeID').removeClass('cl_valid');
				$('#ca_storeID').removeClass('cl_required');

				this.utl_date.datepicker('setIymd', this.options.chkData[pgIndex].cntPrcDate);
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
				$('#ca_storeID').removeClass('cl_valid');
				$('#ca_storeID').removeClass('cl_required');

				this.utl_date.datepicker('setIymd', this.options.chkData[pgIndex].cntPrcDate);

				break;
			}

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMCPV0020GetReq: {
					srchDate		: this.options.chkData[pgIndex].cntPrcDate,
					srchID			: this.options.chkData[pgIndex].cntPrcID,
				},
				// 更新リクエスト
				AMCPV0020UpdReq: {
				}
			};

			this.savedReq = getReq;
			this.options.pgIndex = pgIndex;

			return {
				resId: clcom.pageId,	//'AMCPV0020',
				data: getReq
			};
		},

		convIntArray : function (data){
			var ret = new Array();

			if (data != null) {
				$.each(data, function() {
					ret.push(~~this);
				});
			}

			return ret;
		},

		buildSubmitReq: function(){
			var cntPrcList = clutil.tableview2data($('#ca_cntprc_table_tbody').children());
			var v2dBase = clutil.view2data($('#ca_base_form'));
			var v2dInfo1 = clutil.view2data($('#ca_info1'));
			var v2dInfo2 = clutil.view2data($('#ca_info2'));
			var axisList = clutil.tableview2data($('#ca_axis_table_tbody').children());

			var seasonList = this.convIntArray(v2dInfo1.seasonList);
			var itemAttr1Value = this.convIntArray(v2dInfo2.itemAttr1Value);
			var itemAttr2Value = this.convIntArray(v2dInfo2.itemAttr2Value);

			var cntPrcRprt = {
				recno			: v2dInfo1.recno,
				state			: v2dInfo1.state,
				cntPrcRprtID	: v2dInfo1.cntPrcRprtID,
				storeID			: v2dBase.storeID,
				staffID			: v2dBase.staffID,
				staffInfo		: v2dBase._view2data_staffID_cn,
				reportDate		: v2dBase.srchDate,
				reportName		: v2dInfo1.reportName,
				stditgrp		: v2dInfo1._view2data_stditgrp_cn,
				seasonList		: seasonList,
				itemAttr1		: v2dInfo2.itemAttr1,
				itemAttr1Value	: itemAttr1Value,
				itemAttr2		: v2dInfo2.itemAttr2,
				itemAttr2Value	: itemAttr2Value,
				targetName1		: v2dInfo1.targetName1.replace(/(^[\s　]+)|([\s　]+$)/g, ""),
				targetName2		: v2dInfo1.targetName2.replace(/(^[\s　]+)|([\s　]+$)/g, ""),
				targetName3		: v2dInfo1.targetName3.replace(/(^[\s　]+)|([\s　]+$)/g, ""),
			};

			var opeType = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				opeType = am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL;
			}

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: opeType,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// マスタ検索リクエスト
				AMCPV0020GetReq: {
				},
				// マスタ更新リクエスト
				AMCPV0020UpdReq: {
					cntPrc		: cntPrcRprt,
					cntPrcList	: cntPrcList,
					axisList	: axisList,
					opeType		: 0,
				},
			};

			if (typeof this.reloaded != 'undefined'){
				updReq.reqHead.recno = updReq.AMCPV0020UpdReq.cntPrc.recno;
				updReq.reqHead.state = updReq.AMCPV0020UpdReq.cntPrc.state;
			}

			return updReq;
		},


		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex, nocheck){
			var updReq = this.buildSubmitReq();
			var getReq = this.buildGetReq();

			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				var hasError = false;

				hasError = !this.validator.valid();

				var fromDate = clutil.dateFormat(this.utl_date.val(), "yyyymmdd");
				var ope_date = clcom.getOpeDate();

				switch(this.options.opeTypeId){
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
					if (fromDate < ope_date) {
						// 開始日が運用日以前の場合はエラー
						this.validator.setErrorHeader(clmsg.cl_echoback);
						var msg = clutil.fmtargs(clmsg.cl_date_min, [clutil.dateFormat(clutil.addDate(ope_date, -1), "yyyy/mm/dd")+'より']);
						this.validator.setErrorMsg(this.utl_date, msg);
						hasError = true;
					}
				}

				if (hasError){
					return;
				}

				if (updReq.AMCPV0020UpdReq.cntPrcList.length == 0) {
					this.validator.setErrorHeader(clmsg.cl_echoback);
					$(".errorInside").show();
					return null;
				}else{
					$(".errorInside").hide();
				}
			}

			updReq.AMCPV0020GetReq = getReq.AMCPV0020GetReq;
			updReq.AMCPV0020GetReq.opeType = 0;

//return null;
			return {
				resId: clcom.pageId,	//'AMCPV0020',
				data: updReq
			};
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onStoreSelClick: function(e) {
			var _this = this;
			var options = {
				func_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id	: this.utl_unit.getValue(),
				org_kind_set: [
								am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,		//店舗
								am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,		//倉庫
					            am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ			//本部
							]
			};
			_this.AMPAV0010Selector.show(null, null, options);
		},

		buildGetReq: function() {
			var v2dBase = clutil.view2data($('#ca_base_form'));

			var req = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMCPV0020GetReq: {
					unitID			: v2dBase.unitID,
					srchDate		: v2dBase.srchDate,
					srchID			: v2dBase.srchID,
					srchStoreID		: v2dBase.storeID,
					opeType			: 1,
				},
				// 更新リクエスト
				AMCPV0020UpdReq: {
				}
			};

			return req;
		},

		_onDataSelClick: function(e) {
			var updReq = this.buildSubmitReq();
			var getReq = this.buildGetReq();

			updReq.AMCPV0020UpdReq.opeType = 1;
			getReq.AMCPV0020GetReq.opeType = 1;
			getReq.AMCPV0020UpdReq = updReq.AMCPV0020UpdReq;

			$('.errorInside').hide();

			var defer = clutil.postJSON('AMCPV0020', getReq).done(_.bind(function(data){
				// データ取得
				var recs = data.AMCPV0020HtDataGetRsp.cntPrcList;
				this.scrollStoreValue = this.mdBaseView.$el.scrollTop();

				if (_.isEmpty(recs)) {
					// エラーメッセージ表示
					clutil.mediator.trigger('onTicker', 'HTローディング結果が存在しません。');//clmsg.cl_no_data);

					// フォーカス設定
					//this.resetFocus(this.srchCondView.$tgtFocus);

				} else {
					this.AMCPV0021Selector.show(recs, null);
				}

			}, this)).fail(_.bind(function(data){
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
			}, this));

			return defer;
		},

		_onMakeReportClick: function(e) {
			var updReq = this.buildSubmitReq();
			var getReq = this.buildGetReq();

			var hasError = false;

			this.validator.clearErrorMsg($('#ca_targetName1'));
			this.validator.clearErrorMsg($('#ca_targetName2'));
			this.validator.clearErrorMsg($('#ca_targetName3'));
			hasError = !this.validator.valid();
			if (hasError){
				this.validator.setErrorHeader(clmsg.cl_echoback);
			}

			var validator2 = clutil.validator(this.$('#div_ca_itemAttr'), {
				echoback : $('.cl_echoback')
			});

			if(!validator2.valid()) {
				hasError = true;
			}

			var attr1Val = Number($('#ca_itemAttr1').selectpicker('val'));
			var attr2Val = Number($('#ca_itemAttr2').selectpicker('val'));
			if (attr1Val == attr2Val && attr1Val != 0){
				validator2.setErrorMsg($('#ca_itemAttr1'), '商品属性が重複しています。');
				validator2.setErrorMsg($('#ca_itemAttr2'), '商品属性が重複しています。');
				hasError = true;
			}

			var tgt1 = updReq.AMCPV0020UpdReq.cntPrc.targetName1;
			var tgt2 = updReq.AMCPV0020UpdReq.cntPrc.targetName2;
			var tgt3 = updReq.AMCPV0020UpdReq.cntPrc.targetName3;

			var tgtErrMsg = '';
			if (tgt1.length > 0 && tgt2.length > 0 && tgt1 == tgt2){
				tgtErrMsg = clutil.fmtargs(clmsg.EMS0065, [updReq.AMCPV0020UpdReq.cntPrc.targetName1]);
				this.validator.setErrorMsg($('#ca_targetName1'), tgtErrMsg);
				this.validator.setErrorMsg($('#ca_targetName2'), tgtErrMsg);
				hasError = true;
			}
			if (tgt1.length > 0 && tgt3.length > 0 && tgt1 == tgt3){
				tgtErrMsg = clutil.fmtargs(clmsg.EMS0065, [updReq.AMCPV0020UpdReq.cntPrc.targetName1]);
				this.validator.setErrorMsg($('#ca_targetName1'), tgtErrMsg);
				this.validator.setErrorMsg($('#ca_targetName3'), tgtErrMsg);
				hasError = true;
			}
			if (tgt2.length > 0 && tgt3.length > 0 && tgt2 == tgt3){
				tgtErrMsg = clutil.fmtargs(clmsg.EMS0065, [updReq.AMCPV0020UpdReq.cntPrc.targetName2]);
				this.validator.setErrorMsg($('#ca_targetName2'), tgtErrMsg);
				this.validator.setErrorMsg($('#ca_targetName3'), tgtErrMsg);
				hasError = true;
			}

			if (hasError){
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return null;
			}

			if (updReq.AMCPV0020UpdReq.cntPrcList.length == 0) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				$(".errorInside").show();
				return null;
			}else{
				$(".errorInside").hide();
			}

			var itemAttrs = Number(clutil.getclsysparam("PAR_AMCP_ITEM_ATTRS"));
			if (updReq.AMCPV0020UpdReq.cntPrc.itemAttr1Value.length > itemAttrs) {
				var msg = clutil.fmtargs(clmsg.ECP0002, [itemAttrs]);
				this.validator.setErrorHeader(msg);
				return null;
			}

			updReq.AMCPV0020UpdReq.opeType = 2;
			getReq.AMCPV0020GetReq.opeType = 2;
			getReq.AMCPV0020UpdReq = updReq.AMCPV0020UpdReq;
			getReq.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
//return;
			var defer = clutil.postJSON('AMCPV0020', getReq).done(_.bind(function(data){
				$("#ca_axis_table_tbody tr").remove();

				// データ取得
				var recs = data.AMCPV0020UpdRsp.axisList;

				clutil.viewReadonly($("#ca_base_form"));
				clutil.viewReadonly($("#div_ca_stditgrp"));
				clutil.viewReadonly($("#div_ca_itemAttr"));
				clutil.viewReadonly($("#div_ca_targetName"));

				if (_.isEmpty(recs)) {
					// エラーメッセージ表示
					clutil.mediator.trigger('onTicker', 'プライス別棚卸明細が取得できませんでした。');
				}else{
					// リクエストを保存。
					this.savedReq = getReq;

					this.setAxis(recs);

					var cntPrcRprtID = data.AMCPV0020UpdRsp.axisList[0].cntPrcRprtID;
					$('#ca_cntPrcRprtID').val(cntPrcRprtID);

					var canUpdate = $('#ca_axis_table').data().canupdate;
					this.setSubmitEnable(canUpdate);

					// V0030から戻った時に画面を復元できるようにopetypeを編集にする。
					// chkDataは編集で必要なパラメーターに入れ替えておく
			 		clcom.pageArgs.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
					clcom.pageArgs.chkData = [{
						cntPrcID	: cntPrcRprtID,
						cntPrcDate	: getReq.AMCPV0020GetReq.srchDate,
						storeName	:
							this.utl_store.getValue().code.replace(/(^\s+)|(\s+$)/g, "") + ":" +
							this.utl_store.getValue().name.replace(/(^\s+)|(\s+$)/g, "").replace(/\n/g, ""),
					}];

					// ついでにタイトルも変更しておく
					var repStr = '編集';
					$('div #title h2').html($('div #title h2').html().replace(mainView.mdBaseView.options.subtitle, repStr));
					mainView.mdBaseView.options.subtitle = repStr;

					this.reload(cntPrcRprtID, getReq.AMCPV0020GetReq.srchDate);
					this.reloaded = true;

					clutil.MessageDialog2('ローディング結果を商品属性ごとに振り分けました。<BR/>④へ進んでください。');
				}

			}, this)).fail(_.bind(function(data){
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
			}, this));

			return defer;
		},

		_onAxisClick: function(e) {
			//削除時は軸明細作成画面に遷移しない
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				return;
			}

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
				this.pushPage(clcom.appRoot + '/AMCP/AMCPV0030/AMCPV0030.html', e);
			}else{
				this.mdBaseView.doSubmit(am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD, e);
			}
		},

		reload: function(cntPrcID, cntPrcDate){
			//「登録」後はこの画面が起点になるので、
			// recno,stateを取得して登録済の状態にしておく。

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMCPV0020GetReq: {
					srchDate		: cntPrcDate,
					srchID			: cntPrcID,
				},
				// 更新リクエスト
				AMCPV0020UpdReq: {
				}
			};

			var defer = clutil.postJSON('AMCPV0020', getReq).done(_.bind(function(data){
				clutil.mediator.trigger('onMDGetCompleted', {status: 'OK', data: clutil.dclone(data)});
			}, this)).fail(_.bind(function(data){
				clutil.mediator.trigger('onMDGetCompleted', {status: 'NG', data: clutil.dclone(data)});
			}, this));

			return defer;
		},

		pushPage: function(url, e){
			var myData, destData;

			var updReq = this.buildSubmitReq();
			var index = 0;
			var chkData = null;

			if (_.isUndefined(e.target.parentElement)){
				chkData = [{
					cntPrcRprtID	: updReq.AMCPV0020UpdReq.cntPrc.cntPrcRprtID,
				},];
			} else {
				index = Number(e.target.parentElement.getAttribute('id'));
				chkData = [{
					cntPrcRprtID	: updReq.AMCPV0020UpdReq.cntPrc.cntPrcRprtID,
					cntPrcAxisID	: updReq.AMCPV0020UpdReq.axisList[index].cntPrcAxisID,
				},];
			}

			var opetype = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			var srchCond = null;
			if (!_.isUndefined(this.options.srchCond) && !_.isNull(this.options.srchCond)){
				srchCond = this.options.srchCond;
			}else{
				srchCond = {
					unitID	: ~~$('#ca_unitID').val(),
					fromDate: clcom.getOpeDate(),
					srchStoreID : this.utl_store.getValue().id,
				};
				this.options.srchCond = srchCond;
			}

			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					//btnId: e.target.id,
					savedReq: this.savedReq,
					//savedCond: this.savedReq.AMEQV0010GetReq,
					//selectedIds: this.recListView.getSelectedIdList(),
					chkData: chkData,
					scrollTop: this.mdBaseView.$el.scrollTop(),
				};

				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					opetype = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
				} else {
					opetype = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
				}

				destData = {
					opeTypeId: opetype,
					parentData: updReq,
					srchCond: srchCond,
					chkData: chkData,
//ココ＞＞
					retUrl: (this.options) ? this.options.retUrl : undefined,
					saved: (this.options) ? this.options.saved : undefined,
//ココ＜＜
				};
			}else{
				// 検索結果が無い場合
				myData = {
					//btnId: e.target.id,
					savedReq: null,
					//savedCond: null,//this.srchCondView.serialize(),
					//selectedIds: [],
					chkData: [],
					scrollTop: this.mdBaseView.$el.scrollTop()
				};

				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					opetype = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
				} else {
					opetype = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
				}

				destData = {
					opeTypeId: opetype,
					srchCond: srchCond,
//ココ＞＞
					retUrl: (this.options) ? this.options.retUrl : undefined,
					saved: (this.options) ? this.options.saved : undefined,
//ココ＜＜
				};
			}

			var pushPageOpt = {
				url		: url,
				args	: destData,
				saved	: myData,
			};

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
				pushPageOpt.newWindow = true;
			}

			clcom.pushPage(pushPageOpt);
		},

		setSubmitEnable: function(enable){
			if(enable){
				$('#mainColumnFooter .cl_submit').removeAttr('disabled').parent().removeClass('disable');
			}else{
				$('#mainColumnFooter .cl_submit').attr('disabled','disabled').parent().addClass('disable');
			}
		},

		_eof: 'AMCPV0010.MainView//'
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

		// V0040からの戻り
		// 移動したページが先頭になるようにローテーションさせておく
		if (typeof clcom.pageArgs != 'undefined' && typeof clcom.pageArgs.pgIndex != 'undefined'){
			var pgIndex = clcom.pageArgs.pgIndex;
			var dataLength = clcom.pageArgs.chkData.length;
			var bfArray = new Array();
			var afArray = new Array();

			for (var i = 0; i < dataLength; i++){
				if (i >= pgIndex){
					afArray.push(clcom.pageArgs.chkData[i]);
				}else{
					bfArray.push(clcom.pageArgs.chkData[i]);
				}
			}

			clcom.pageArgs.chkData = afArray.concat(bfArray);
		}

		mainView = new MainView(clcom.pageArgs).initUIElement().render();

		// ボタン名補正
		if (clcom.pageArgs == null || clcom.pageArgs.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
			mainView.$('#mainColumnFooter .cl_submit').text('プライス別棚卸報告作成');

			if (typeof clcom.pageArgs == 'undefined' ||
				clcom.pageArgs.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
				clcom.pageArgs.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				mainView.setSubmitEnable(false);
			}
		}

		// スクロール位置補正
		if(clcom.pageData && clcom.pageData.scrollTop > 0){
			mainView.mdBaseView.$el.scrollTo(clcom.pageData.scrollTop);
		}

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
