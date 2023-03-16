useSelectpicker2();

$(function(){
	$.inputlimiter.noTrim = true;

	var TYPE_KIND = {
		STORE: 1,
		EDITABLE: 2,
		AREA_AJA: 3,
		ZONE_AJA: 4,
		KEISEN: 5,
		FULL: 6,
	};

	var AMEPV0020_RTYPE = {
		SALEAM		: 1, //  売上高
		PROFITRT	: 2, //  経準率
		PROFITAM	: 3, //  経準高
		OPERPAM		: 4, //  営業利益高
		OPERPRT		: 5, //  営業利益率
		PACCITEM	: 6, //  親項目
		ACCITEM		: 7, //  子項目
	};

	var AIM_KEY = 0;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var timer = false;
	$(window).resize(function() {
	    if (timer !== false) {
	        clearTimeout(timer);
	    }
	    timer = setTimeout(function() {
			if (!_.isUndefined(mainView) && !_.isUndefined(mainView.grid) && !_.isUndefined(mainView.grid.grid)){
				mainView.grid.grid.resizeCanvas();
			}
	    }, 100);
	});

	safeDivide = function(lhs, rhs){
		var ret = 0;
		if (rhs != 0){
			ret = lhs / rhs;
		}
		return ret;
	};

	getPercentValue = function(lhs, rhs){
		var ret = 0;
		ret = Math.round(safeDivide(lhs, rhs) * 100 * 10) / 10;
		return ret;
	};

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			"click #ca_AMPAV0010_show_AMPAV0020"	: '_onShowAMPAV0020Click',	// 組織選択ボタン押下
			'click #ca_srch'						: '_onSrchClick',			// 検索ボタン押下時
			'change #ca_srchUnitID'					: '_onUnitChanged',			// 事業ユニット変更
		},

		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			clutil.inputlimiter(this.$el);

			// 初期フォーカスオブジェクト設定
			this.$tgtFocus = $('#ca_srchUnitID');

			// 事業ユニット
			this.utl_unit = clutil.clbusunitselector({
				el: '#ca_srchUnitID',
				initValue: clcom.userInfo.unit_id,
	    	});

			// 対象期間 FIXME 暫定
			this.utl_year = clutil.clyearselector(
				this.$("#ca_srchYear"),
				0,
				clutil.getclsysparam('PAR_AMCM_YEAR_FROM'),
				2,//clutil.getclsysparam('PAR_AMCM_YEAR_TO'),
				"年度"
			);
			this.init_ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');	// FIXME - 現在の年度

			// 対象期:予算対象区分
			this.utl_equipType = clutil.cltypeselector({
				el: '#ca_srchPeriodType',
				kind: amcm_type.AMCM_TYPE_BGT_PERIOD,
			});

			// 組織
			this.utl_org = this.getOrg(clcom.userInfo.unit_id);

			// 初期値を設定
			this.deserialize( {
				srchUnitID	: clcom.userInfo.unit_id,	// 事業ユニットID
				srchYear	: this.init_ope_year,		// 年度
			});

			var tgtView = this;
			this.utl_unit.done(function() {
				tgtView.setInitializeValue();
				tgtView.setDefaultEnabledProp();

				// 初期フォーカス設定
				clutil.setFocus(tgtView.$tgtFocus);
			});

			// 組織選択画面
			this.AMPAV0020Selector = new  AMPAV0020SelectorView({
				el				: $("#ca_AMPAV0020_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				select_mode		: clutil.cl_single_select,		// 単一選択モード
				isAnalyse_mode 	: false,						// 通常画面モード
			});
			this.AMPAV0020Selector.render();
		},

		getOrg: function(unitID){
			return clutil.clorgcode({
				el: '#ca_AMPAV0010_orgname',
				dependAttrs : function(item) {
					var unit_id = $('#ca_srchUnitID').val();
					return {
						orgfunc_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						p_org_id	: unit_id,
					};
				}
			});
		},

		setInitializeValue: function(){
			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS &&
				opeTypeKind < TYPE_KIND.KEISEN){
				var orgParam =  {
					id			: clcom.userInfo.org_id,
					code		: clcom.userInfo.org_code,
					name		: clcom.userInfo.org_name,
					orglevel	: clcom.userInfo.org_kind_typeid
				};

				this.utl_org.setValue(orgParam);
			}
		},

		setDefaultEnabledProp: function() {
			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS){
				if (clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.viewReadonly($("#div_ca_srchUnitID"));
					this.$tgtFocus = $('#ca_srchYear');
				}
			}

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
				clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.viewReadonly($("#div_ca_org"));
				$("#div_ca_unitID").hide();
				this.$tgtFocus = $('#ca_srchYear');
			}

			if (opeTypeKind < TYPE_KIND.KEISEN){
				$("#div_ca_validNumberFlag").hide();
			}
		},


		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			return clutil.view2data(this.$el);
		},

		/**
		 * 検索リクエストパケットの設定値を UI へセットする。
		 */
		deserialize: function(obj){
			this.deserializing = true;
			try{
				var dto = _.extend({}, obj);
				clutil.data2view(this.$el, dto);

				var callback = this._onUnitChanged;
				this.utl_unit.done(function() {callback();});
			}finally{
				this.deserializing = false;
			}
		},

		/**
		 * 指定プロパティ名（ ⇔ 検索 Req 上のメンバ名）の UI 設定値を取得する。
		 * defaultVal は、設定値が無い場合に返す値。
		 */
		getValue: function(propName, defaultVal){
			if(_.isUndefined(defaultVal)){
				defaultVal = null;
			}
			if(!_.isString(propName) || _.isEmpty(propName)){
				return defaultVal;
			}
			var dto = this.serialize();
			var val = dto[propName];
			return (_.isUndefined(val) || _.isNull(val) || _.isEmpty(val)) ? defaultVal : val;
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function() {
			var hasError = !this.validator.valid();
			return !hasError;
		},

		/**
		 * 組織選択ボタン押下
		 */
		_onShowAMPAV0020Click: function(e) {
			var _this = this;

			var r_org_id = Number($("#ca_srchUnitID").val());
			//if (clcom.userInfo.permit_top_org_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
			//	r_org_id = clcom.userInfo.permit_top_org_id;
			//}

			this.AMPAV0020Selector.show(
				null,
				false,
				clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'),
				null,
				null,
				r_org_id
			);

			//サブ画面復帰後処理
			this.AMPAV0020Selector.okProc = function(data) {
				if(data != null && data.length > 0) {
					var orgParam =  {
						id			: data[0].val,
						code		: data[0].code,
						name		: data[0].name,
						orglevel	: data[0].attr,
					};

					_this.utl_org.setValue(orgParam);
					mainView.validator.clearErrorMsg($('#ca_AMPAV0010_orgname'));
				}

				// ボタンにフォーカスする
				_.defer(function(){
					$(e.target).focus();
				});
			};
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			if(!this.isValid()){
				return;
			}

			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_onUnitChanged: function(e){
			if(this.deserializing){
				return;
			}

			var unitID = ~~$('#ca_srchUnitID').val();

			if (unitID == '0'){
				clutil.inputReadonly("#ca_AMPAV0010_orgname");
				clutil.inputReadonly("#ca_AMPAV0010_show_AMPAV0020");
			}else{
				if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE &&
					clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN){
					clutil.inputRemoveReadonly("#ca_AMPAV0010_orgname");
					clutil.inputRemoveReadonly("#ca_AMPAV0010_show_AMPAV0020");
				}
			}

			if (unitID == '0' || unitID != this.prevUnitId){
				this.validator.clearErrorMsg($('#ca_AMPAV0010_orgname'));
				this.utl_org.resetValue();
			}

			this.prevUnitId = unitID;
		},

		_eof: 'AMEPV0020.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'	: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click .cl_monthlink'	: '_onMonthLClick',
			'click #ca_meisai_1'	: '_onMeisai1Click',
			'click #ca_meisai_2'	: '_onMeisai2Click',
			'click #ca_meisai_3'	: '_onMeisai3Click',
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
					title: '予算調整',
					subtitle: '登録・修正',
					opeTypeId: [am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW, am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD],
					pageCount: o.chkData.length,
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					btn_submit:true,
					btn_csv:true,
					btn_cancel: (o.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && !isChild)
						? {label:'条件再設定', action:this._doCancel} : true,
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 承認設定を取得
			if (clcom.userInfo.user_typeid== amcm_type.AMCM_VAL_USER_STORE){
				opeTypeKind = TYPE_KIND.STORE;
			} else {
				opeTypeKind = TYPE_KIND.EDITABLE;
			}

			$.each(clcom.userInfo.approve_list ,function(){
				if (this.approvefunc_typeid == amcm_type.AMCM_VAL_APPROVE_FUNC_BUSIPLAN){
					if (this.f_approve3 == 1) {
						opeTypeKind = TYPE_KIND.KEISEN;
					} else if (this.f_approve2 == 1) {
						opeTypeKind = TYPE_KIND.ZONE_AJA;
					} else if (this.f_approve1 == 1) {
						opeTypeKind = TYPE_KIND.AREA_AJA;
					}
				}
			});
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS){
				opeTypeKind = TYPE_KIND.FULL;
			}

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			}

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
		},

		/**
		 * グリッドの初期化
		 */
		initGrid:function(){
			this.grid = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid',	// エレメント
				lineno			: false,			// 行番号表示する/しないフラグ。
				delRowBtn		: false,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: false,			// フッター部の新規行追加ボタンを使用するフラグ。
			});

			this.grid.getHeadMetadata = this.getHeadMetadata;
			this.grid.getMetadata = this.getMetadata;

			// イベント設定
			this.listenTo(this.grid, this.gridEvents);

			this.grid.render();
		},

		/**
		 * ヘッダ情報定義
		 * @param rowIndex
		 * @returns {___anonymous11298_11327}
		 */
		getHeadMetadata: function(rowIndex){
			var columns = {};

			// 店舗の行
			var storeRowIndex = 3 - this.dispData.zoneShift - this.dispData.areaShift;

			if (rowIndex == storeRowIndex){
			    for(var k in this.optMeta){
			    	columns[k] = this.optMeta[k];
			    }
			}

			return {
				 columns: columns
			};
		},

		getMetadata: function(rowIndex){

			var grpStyle = (this.gridData[rowIndex].accGrpEven) ? '_Even' : '_Odd';
			var accStyle = (this.gridData[rowIndex].accEven) ? '_Even' : '_Odd';
			var dataStyle = (this.gridData[rowIndex].dataName == '分配率(%)') ? 'txtar' : '';

			if (this.gridData[rowIndex].accGrpName == ''){
				grpStyle += ' bdrTp0';
			}

			if (this.gridData[rowIndex].accName == ''){
				accStyle += ' bdrTp0';
			}

			return {
				columns: {
					accGrpName: {
						cssClasses: grpStyle,
					},
					accName: {
						cssClasses: accStyle,
					},
					dataName: {
						cssClasses: dataStyle,
					},
				}
			};
		},

		isEditableColumn: function(item, column) {
			var term = $("#ca_srchPeriodType").selectpicker('val');
			var slct_year = $("#ca_srchYear").selectpicker('val');
			var today = clcom.getOpeDate();
			var year = Math.floor(today / 10000);
			var monthday = today % 10000;

			if (term == amcm_type.AMCM_VAL_BGT_PERIOD_ALL) {
				// 全期の場合
				if ((slct_year == year && monthday >= 501) || slct_year < year) {
					return false;
				} else {
					return true;
				}
			} else {
				// 下期の場合
				var month = column.id.split('_')[0];
				if (month >= 4 && month <= 9) {
					// 4～9月は編集不可
					return false;
				} else if ((slct_year == year && monthday >= 1101) || slct_year < year) {
					return false;
				} else {
					return true;
				}
			}
		},

		createGridData: function(paramMonth){
			var _this = this;
			var mode = 0;
			if (this.savedReq.AMEPV0020GetReq.AMPAV0010_attr == Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))){
				mode = 1;
			}

			this.fieldList = [];
			var hdMonth = {};
			var hdZone = {};
			var hdArea = {};
			var columns = [];
			var optMeta = {};

			columns.push({
				id		: 'accGrpName',
				field	: 'accGrpName',
				width	: 120,
			});

			columns.push({
				id		: 'accName',
				field	: 'accName',
				width	: 150,
			});

			columns.push({
				id		: 'dataName',
				field	: 'dataName',
				width	: 100,
			});

			hdMonth['accGrpName']={id: 'accGrpName', colspan: 3, cssClasses : 'bdrTpColor',};
			hdZone['accGrpName'] ={id: 'accGrpName', colspan: 3, cssClasses : 'bdrTpColor',};
			hdArea['accGrpName'] ={id: 'accGrpName', colspan: 3, cssClasses : 'bdrTpColor',};

			optMeta['accGrpName'] = { cssClasses: 'bdrTpColor',};
			optMeta['accName'] = { cssClasses: 'bdrTpColor bdrLftColor',};
			optMeta['dataName'] = { cssClasses: 'bdrTpColor bdrLftColor',};

			var zoneAvailable = this.dispData.zoneAvailable;
			var zoneShift = this.dispData.zoneShift;
			var areaAvailable = this.dispData.areaAvailable;
			var areaShift = this.dispData.areaShift;

			var monthOrder;
			if (mode == 1) {
				monthOrder = ['0','13','14','4','5','6','7','8','9','10','11','12','1','2','3'];
			} else {
				monthOrder = ['0','13','14','4','5','6','7','8','9','10','11','12','1','2','3'];
			}
			var monthList = new Array();
			var refData = this.dispData.header.month;

			$.each(monthOrder, function(){
				if (refData[this] != null) {
					monthList.push(refData[this]);
				}
			});

			$.each(monthList, function(){

				var month = this.month;
				var store = this.store;
				var storeIndex = 0;

				var monthCaption = '';

				if (mode == 0) {
//					if (month != 0 && month != 13 && month != 14){
//						return true;
//					}
//				} else {
					if (month != 0 && month != paramMonth){
						return true;
					}
				}

				if (month == 0){
					monthCaption = '年度計';
				} else if (month == 13) {
					monthCaption = '上半期計';
				} else if (month == 14) {
					monthCaption = '下半期計';
				}else{
					monthCaption = month + '月度';
				}

				var key = '';
				var key2 = '';
				if (zoneAvailable){
					key = month + '_' + this.zone[0].orgID;
				}else if (areaAvailable){
					key = month + '_' + this.area[0].orgID;
				}else{
					key = month + '_' + this.store[0].orgID;
				}

				if (month == 0) {
					if (zoneAvailable) {
						key2 = month + '_' + this.area[0].orgID;
					} else {
						key2 = month + '_' + this.store[0].orgID;
					}
					hdMonth[key] = {
						colspan	: 1,
						name	: monthCaption,
					};
					hdMonth[key2] = {
							colspan	: this.zone[0].totalspan - zoneShift - areaShift - 1,
							name	: '',
						};
					if (mode == 1) {
						hdMonth[key2].name = monthCaption;
					}
				} else if (month == 13 || month == 14) {
					if (zoneAvailable) {
						key2 = month + '_' + this.area[0].orgID;
					} else {
						key2 = month + '_' + this.store[0].orgID;
					}
					hdMonth[key] = {
						colspan	: this.zone[0].totalspan - zoneShift - areaShift,
						name	: monthCaption,
					};
//					if (mode == 1) {
//						if (month == 14) {
//							hdMonth[key2] = {
//								colspan	: this.zone[0].totalspan - zoneShift - areaShift - 1,
//								name	: monthCaption,
//							};
//						} else {
//							hdMonth[key2] = {
//								colspan	: 1,
//								name	: monthCaption,
//							};
//						}
//					} else {
//						hdMonth[key2] = {
//							colspan	: this.zone[0].totalspan - zoneShift - areaShift - 1,
//							name	: '',
//						};
//					}
				} else {
					hdMonth[key] = {
						colspan	: this.zone[0].totalspan - zoneShift - areaShift,
						name	: monthCaption,
					};
				}

				$.each(this.zone, function(){
					if (this.orgID == 0){
						return true;
					}

					var key = month + '_' + this.orgID;
					if (mode == 1) {
						if (month == 0 || month == 13) {
							hdZone[key] = {
								colspan	: 1,
								name	: this.orgName,
							};
							hdZone[key2] = {
								colspan: 1,
								name : ''
							};
						} else if (month == 14) {
							hdZone[key] = {
								colspan	: 1,
								name	: this.orgName,
							};
							hdZone[key2] = {
								colspan: this.totalspan - 1,
								name : ''
							};
						} else {
							hdZone[key] = {
								colspan	: this.totalspan,
								name	: this.orgName,
							};
						}
					} else {
						if (month == 0) {
							hdZone[key] = {
								colspan	: 1,
								name	: this.orgName,
							};
							hdZone[key2] = {
								colspan: this.totalspan - 1,
								name : ''
							};
						} else {
							hdZone[key] = {
								colspan	: this.totalspan,
								name	: this.orgName,
							};
						}
					}
					hdArea[key] = {
						cssClasses : 'bdrTpColor',
					};

					mainView.fieldList.push(key);
					columns.push({
						id		: key,
						name	: '',
						field	: key,
						width	: 140,
						cssClass: 'txtalign-right',
						cellType 		: {
							type			: 'text',
							limit			: "number:9",
							formatFilter	: "comma",
							editorOptions	: {
								addClass: 'txtar',
							},
							isEditable	: function(item, row, column, dataView){
								if (item.editableColumn.indexOf(column.id) >= 0) {

								} else {
									return false;
								}
								//return (item.editableColumn.indexOf(column.id) >= 0);
							},
							formatter: function(value, options)
							{
								//if (value == null || _.isEmpty(value)) {
								//	return "";
								//}
								var disp = 0;
								var kind = options.dataContext.kind;

								if (kind == 'operPlan' || kind == 'scPlan' || kind == 'prev3Am' || kind == 'prev2Am' || kind == 'prevAm' || kind == 'prevRate'){
									disp = value;
								}else{
									if (value != null) {
										disp = value.toFixed(1);
									}
								}

								return disp;
							},
						},
					});

					optMeta[key] = {
						cssClasses: 'bdrTpColor',
					};
				});

				$.each(this.area, function(){
					if (this.orgID != 1){
						var key = month + '_' + this.orgID;
						var key2 = '';
						if (mode == 1) {
							if (month == 0 || month == 13 || month == 14) {
								key2 = month + '_' + store[0].orgID;
								hdArea[key] = {
										colspan	: 1,
										name	: this.orgName,
									};
								hdArea[key2] = {
										colspan	: this.colspan,
										name	: '',
									};
							} else {
								hdArea[key] = {
										colspan	: this.colspan + 1,
										name	: this.orgName,
									};
							}
						} else {
							if (zoneAvailable) {
								hdArea[key] = {
									colspan	: this.colspan + 1,
									name	: this.orgName,
								};
							} else {
								if (month == 0) {
									key2 = month + '_' + store[0].orgID;
									hdArea[key] = {
											colspan	: 1,
											name	: this.orgName,
										};
									hdArea[key2] = {
											colspan	: this.colspan,
											name	: '',
										};
								} else {
									hdArea[key] = {
											colspan	: this.colspan + 1,
											name	: this.orgName,
										};
								}
							}
						}

						mainView.fieldList.push(key);
						columns.push({
							id		: key,
							name	: '',
							field	: key,
							width	: 140,
							cssClass: 'txtalign-right',
							cellType:
							{
								formatFilter	: "comma",
								formatter: function(value, options)
								{
									var disp = 0;
									var kind = options.dataContext.kind;

									if (kind == 'operPlan' || kind == 'scPlan' || kind == 'prev3Am' || kind == 'prev2Am' || kind == 'prevAm' || kind == 'prevRate'){
										disp = value;
									}else{
										if (value != null) {
											disp = value.toFixed(1);
										}
									}

									return disp;
								},
							},
						});

						optMeta[key] = {
							cssClasses: 'bdrTpColor',
						};
					}

					var phRate = clutil.getclsysparam('PAR_AMCM_DEFAULT_PERCENT_DECIMAL');
					for (var i = 0; i < this.colspan; i++){
						if (storeIndex >= store.length){
							console.log("error");
							return false;
						}

						var storeData = store[storeIndex++];

						var key = month + '_' + storeData.orgID;

						mainView.fieldList.push(key);
						columns.push({
							id		: key,
							name	: storeData.orgCode + ':' + storeData.orgName,
							field	: key,
							width	: 140,
							cssClass: 'txtalign-right',
							cellType 		: {
								type			: 'text',
								limit			: "number:9",
								formatFilter	: "comma",
								editorOptions	: {
									addClass: 'txtar',
									attributes	:
									{
										placeholder	: function(){
											var ret = '';
											var element = $(this.parentElement.parentElement).find('div');
											$.each(element, function(){
												if ($(this).text().indexOf('.') >= 0){
													ret = clutil.getclsysparam('PAR_AMCM_DEFAULT_PERCENT_DECIMAL');
													return false;
												}
											});
											return ret;
										},
									}
								},
								isEditable	: function(item, row, column, dataView){
									if (item.editableColumn.indexOf(column.id) >= 0) {
										return _this.isEditableColumn(item, column);
									} else {
										return false;
									}
									//return (item.editableColumn.indexOf(column.id) >= 0);
								},
								formatter: function(value, options)
								{
									var disp = 0;
									var kind = options.dataContext.kind;

									if (kind == 'operPlan' || kind == 'scPlan' || kind == 'prev3Am' || kind == 'prev2Am' || kind == 'prevAm' || kind == 'prevRate'){
										disp = value;
									}else{
										if (value == null) {

										} else {
											if (value != null) {
												disp = value.toFixed(1);
											}
										}
									}

									return disp;
								},
							},
						});

						optMeta[key] = {
							cssClasses: 'darken',
						};
					}
				});
			});

			this.colhdMetadatas = [];
			this.colhdMetadatas.push({ columns: hdMonth });
			if (zoneAvailable){
				this.colhdMetadatas.push({ columns: hdZone });
			}
			if (areaAvailable){
				this.colhdMetadatas.push({ columns: hdArea });
			}

			this.columns = columns;
			this.optMeta = optMeta;
		},

		gridEvents:{
			'cell:change':  function(args){
				var id = args.column.id;
				var curValue = 0;

				if (args.item['rType'] == AMEPV0020_RTYPE.PROFITRT || args.item['rType'] == AMEPV0020_RTYPE.OPERPRT){
					var tgtVal = args.item[id].replace(/[^0-9.]/g, "");
					if (tgtVal == '.') {
						tgtVal = '';
					}
					var arrTmp = tgtVal.split('.');
					var valTmp = arrTmp.shift();
					if (arrTmp.length > 0){
						valTmp = valTmp.substring(valTmp.length - 2, valTmp.length);
					}else{
						valTmp = valTmp.substring(0,2);
					}

					if (arrTmp.length > 0 && arrTmp[0] != ''){
						arrTmp[0] = arrTmp[0].substring(0,1);
						valTmp += ('.' + arrTmp.join(''));
					}
					curValue = Number(valTmp);

					if (curValue >= 100){
						curValue = 99.9;
					}
					args.item[id] = curValue.toFixed(1);
				}else{
					curValue = Number(args.item[id].replace(/[^0-9]/g, "").substring(0,9));
					args.item[id] = curValue;
				}

				var parent_id_list = this.dispData.parent_id_list;
				var orgLevel_list = this.dispData.orgLevel_list;

				var arrTmp = id.split('_');
				var month = Number(arrTmp[0]);
				var orgID = Number(arrTmp[1]);
				var accID = Number(args.item['accID']);
				var pAccID = Number(args.item['pAccID']);
				var kind = args.item['kind'];
				var zoneOrgID = (parent_id_list.orgID[orgID]) ? parent_id_list.orgID[orgID].zoneOrgID : 0;
				var areaOrgID = (parent_id_list.orgID[orgID]) ? parent_id_list.orgID[orgID].areaOrgID : 0;

				if (accID == AIM_KEY){
					 this.setDispValue(this.dispData.body[0].list.month['0'][0], args.item.kind, curValue);
					 return;
				}

				var dataList = [];

				var srcTARGET = null;
				var srcPARENT = null;
				var srcSALEAM = null;
				var srcPROFITRT = null;
				var srcPROFITAM = null;
				var srcOPERPAM = null;
				var srcOPERPRT = null;

				// 元データから更新対象をピックアップ
				$.each(this.dispData.body, function(){
					if (this.accID == accID){							// 入力行
						srcTARGET = this;
					}else if (this.accID == pAccID){					// 親項目
						srcPARENT = this;
					}else if (this.rType == AMEPV0020_RTYPE.SALEAM){	// 売上高
						srcSALEAM = this;
					}else if (this.rType == AMEPV0020_RTYPE.PROFITAM){	// 経準高
						srcPROFITAM = this;
					}else if (this.rType == AMEPV0020_RTYPE.OPERPAM){	// 営業利益高
						srcOPERPAM = this;
					}

					if (this.rType == AMEPV0020_RTYPE.PROFITRT){		// 経準率
						srcPROFITRT = this;
					}
					if (this.rType == AMEPV0020_RTYPE.OPERPRT){			// 営業利益率
						srcOPERPRT = this;
					}
				});

				// ピックアップしたデータとグリッドの行を紐付ける
				var setTarget = null;
				var setSALEAM = null;
				var setPROFITRT = null;
				var setOPERPAM = null;
				var gRowKey = '';

				// 入力行
				if (srcTARGET != null) {
					var grPrev = null;
					gRowKey = args.item['rType'] + '_' + accID;
					grPrev = this.gridUpdateRowPrev[gRowKey];

					if (grPrev == null){
						gRowKey = '' + args.item['rType'];
						grPrev = this.gridUpdateRowPrev[gRowKey];
					}

					setTarget = {
						data	:srcTARGET,
						gRow	:args.item,
						gRowPrev:grPrev,
					};
					dataList.push(setTarget);
				}

				// 親項目
				if (srcPARENT != null) {
					gRowKey = AMEPV0020_RTYPE.PACCITEM + '_' + pAccID;
					dataList.push({
						data	:srcPARENT,
						gRow	:this.gridUpdateRow[gRowKey],
						gRowPrev:this.gridUpdateRowPrev[gRowKey],
					});
				}

				// 売上高
				if (srcSALEAM != null) {
					gRowKey = '' + AMEPV0020_RTYPE.SALEAM;
					setSALEAM = {
						data	:srcSALEAM,
						gRow	:this.gridUpdateRow[gRowKey],
						gRowPrev: this.gridUpdateRowPrev[gRowKey],
					};
					dataList.push(setSALEAM);
				}

				// 経準率
				if (srcPROFITRT != null) {
					gRowKey = '' + AMEPV0020_RTYPE.PROFITRT;
					setPROFITRT = {
						data	:srcPROFITRT,
						gRow	:this.gridUpdateRow[gRowKey],
						gRowPrev: this.gridUpdateRowPrev[gRowKey],
					};
					//dataList.push(setPROFITRT);
				}

				// 経準高
				if (srcPROFITAM != null) {
					gRowKey = '' + AMEPV0020_RTYPE.PROFITAM;
					dataList.push({
						data	: srcPROFITAM,
						gRow	: this.gridUpdateRow[gRowKey],
						gRowPrev: this.gridUpdateRowPrev[gRowKey],
						options	:
						{
							sale	: ((setSALEAM != null) ? setSALEAM : setTarget),
							profit	: setPROFITRT
						},
					});
				}

				// 営業利益高
				if (srcOPERPAM != null) {
					gRowKey = '' + '' + AMEPV0020_RTYPE.OPERPAM;
					setOPERPAM = {
						data	:srcOPERPAM,
						gRow	:this.gridUpdateRow[gRowKey],
						gRowPrev: this.gridUpdateRowPrev[gRowKey],
					};
					dataList.push(setOPERPAM);
				}

				// 営業利益率
				if (srcOPERPRT != null) {
					gRowKey = '' + '' + '' + AMEPV0020_RTYPE.OPERPRT;
					dataList.push({
						data	: srcOPERPRT,
						gRow	: this.gridUpdateRow[gRowKey],
						gRowPrev: this.gridUpdateRowPrev[gRowKey],
						options	:
						{
							sale	: ((setSALEAM != null) ? setSALEAM : setTarget),
							oper	: setOPERPAM
						},
					});
				}

				// 縦軸（科目）のループ
				$.each(dataList, function(){
					var zoneTotal = 0;
					var areaTotal = 0;
					var zoneTotalY = 0;
					var areaTotalY = 0;
					var orgTotal = {};
					var half1Total = {};
					var half2Total = {};

					var zone = null;
					var area = null;
					var zoneY = null;
					var areaY = null;
					var otherArea = new Array();

					var isTarget = false;
					if (this.data.accID == accID){
						isTarget = true;
					}

					var gRow = this.gRow;
					var gRowPrev = this.gRowPrev;
					var checkRType = this.data.rType;

					var isRate = false;
					if (kind == 'operPlanRate' || kind == 'scPlanRate' || kind == 'prevAmRate' /*|| kind == 'prevRate'*/){
						isRate = true;
					}

					//月毎のループ
					$.each(this.data.list.month, function(){

						// 組織体系のループ
						$.each(this, function(){
							var orgKey = '' + this.orgID;
							var orgLevel = 0;

							if (typeof orgLevel_list[orgKey] != 'undefined'){
								orgLevel = orgLevel_list[orgKey].orgLevel;
							}

							var isZone = false;
							var isArea = false;
							if (orgLevel == ~~clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')){
								// ゾーン
								isZone = true;
							}
							if (orgLevel == ~~clcom.getSysparam('PAR_AMMS_AREA_LEVELID')){
								// エリア
								isArea = true;
							}

							// 編集行と一致する月の場合
							if (this.month == month){
								var parentZoneOrgID = 0;
								var parentAreaOrgID = 0;
								var valueBuff = 0;

								if (typeof parent_id_list.orgID[this.orgID] != 'undefined'){
									parentZoneOrgID = parent_id_list.orgID[this.orgID].zoneOrgID;
									parentAreaOrgID = parent_id_list.orgID[this.orgID].areaOrgID;
								}

								// 現在のデータがゾーンの場合
								if (this.orgID == zoneOrgID){
									// ゾーンを保存
									zone = this;
								}

								// 現在のデータがエリアの場合
								if (this.orgID == areaOrgID){
									// エリアを保存
									area = this;
								}

								// 現在のデータが、編集行の組織と一致する場合
								if (isTarget && this.orgID == orgID){
									// 編集行のデータを元データに反映する
									valueBuff = mainView.setDispValue(this, kind, curValue);
									gRowPrev[this.month + '_' + this.orgID] = this.prevRate;

									try{
										// 親データを更新する
										mainView.updateParent(this, month, orgID);
									}catch(ex){
										console.log('ERROR-mainView.updateParent');
									}
								} else {
									valueBuff = mainView.setDispValue(this, kind, null);
								}

								// 合計計算は店舗の値のみ使用する
								if (isZone || isArea){
									valueBuff = 0;
								}

								// 現在のデータが親ゾーンの場合
								if (parentZoneOrgID == zoneOrgID){
									// ゾーンの合計を計算する
									zoneTotal += valueBuff;
								}

								// 現在のデータが親エリアの場合
								if (parentAreaOrgID == areaOrgID){
									// エリアの合計を計算する
									areaTotal += valueBuff;
								}

							// 年計の場合
							} else if (this.month == 0){
								if (this.orgID == zoneOrgID){
									// ゾーンを保存する
									zoneY = this;
								} else if (this.orgID == areaOrgID){
									// エリアを保存する
									areaY = this;
								} else if (isArea){
									// 他のエリアを保存する
									otherArea.push(this);
								} else {
									// ターゲットを保存する
									if (typeof orgTotal[orgKey] == 'undefined'){
										orgTotal[orgKey] = {orgID:this.orgID, value:0, tgt:this};
									}
								}
							} else if (this.month == 13) {
								if (this.orgID == zoneOrgID){
									// ゾーンを保存する
									zoneY = this;
								} else if (this.orgID == areaOrgID){
									// エリアを保存する
									areaY = this;
								} else if (isArea){
									// 他のエリアを保存する
									otherArea.push(this);
								} else {
									// ターゲットを保存する
									if (typeof half1Total[orgKey] == 'undefined'){
										half1Total[orgKey] = {orgID:this.orgID, value:0, tgt:this};
									}
									if (half1Total[orgKey].tgt == null) {
										half1Total[orgKey].tgt = this;
									}
								}
							} else if (this.month == 14) {
								if (this.orgID == zoneOrgID){
									// ゾーンを保存する
									zoneY = this;
								} else if (this.orgID == areaOrgID){
									// エリアを保存する
									areaY = this;
								} else if (isArea){
									// 他のエリアを保存する
									otherArea.push(this);
								} else {
									// ターゲットを保存する
									if (typeof half2Total[orgKey] == 'undefined'){
										half2Total[orgKey] = {orgID:this.orgID, value:0, tgt:this};
									}
									if (half2Total[orgKey].tgt == null) {
										half2Total[orgKey].tgt = this;
									}
								}
							}

							// 年計計算
							if (this.month != 0 && this.month != 13 && this.month != 14){
								var parentZoneOrgID = 0;
								var parentAreaOrgID = 0;

								if (typeof parent_id_list.orgID[this.orgID] != 'undefined'){
									parentZoneOrgID = parent_id_list.orgID[this.orgID].zoneOrgID;
									parentAreaOrgID = parent_id_list.orgID[this.orgID].areaOrgID;
								}

								// 値を取得する
								valueBuff = mainView.setDispValue(this, kind, null);

								// 合計計算は店舗の値のみ使用する
								if (isZone || isArea){
									valueBuff = 0;
								}

								// 現在のデータが親ゾーンの場合
								if (parentZoneOrgID == zoneOrgID){
									zoneTotalY += valueBuff;
								}

								// 現在のデータが親エリアの場合
								if (parentAreaOrgID == areaOrgID){
									areaTotalY += valueBuff;
								}

								if (typeof orgTotal[orgKey] == 'undefined'){
									orgTotal[orgKey] = {orgID:this.orgID, value:0, tgt:null};
								}

								orgTotal[orgKey].value += valueBuff;

								if (this.month >= 4 && this.month <= 9) {
									if (typeof half1Total[orgKey] == 'undefined'){
										half1Total[orgKey] = {orgID:this.orgID, value:0, tgt:null};
									}

									half1Total[orgKey].value += valueBuff;
								}

								if (this.month <= 3 || this.month >= 10) {
									if (typeof half2Total[orgKey] == 'undefined'){
										half2Total[orgKey] = {orgID:this.orgID, value:0, tgt:null};
									}

									half2Total[orgKey].value += valueBuff;
								}
							}
						});
					});

					if (checkRType == AMEPV0020_RTYPE.PROFITRT){
						isRate = true;
					}

					// 横計の更新
					if (!isRate){

						// ゾーン計更新
						if (zone != null){
							var key = zone.month + '_' + zone.orgID;
							var setVal = null;

							if (checkRType == AMEPV0020_RTYPE.PROFITAM){
								// 経準高の場合は計算する
								setVal = Math.round(this.options.sale.gRow[key] * this.options.profit.gRow[key]);
							} else if (checkRType == AMEPV0020_RTYPE.OPERPRT){
								// 営業利益率の場合は計算する
								setVal = getPercentValue(this.options.oper.gRow[key], this.options.sale.gRow[key]);
							}else{
								setVal = zoneTotal;
							}

							valueBuff = mainView.setDispValue(zone, kind, setVal);
							if (!_.isUndefined(gRow)) { gRow[key] = valueBuff; }
							if (!_.isUndefined(gRowPrev)) { gRowPrev[key] = zone.prevRate; }
						}

						// エリア計更新
						if (area != null){
							var key = area.month + '_' + area.orgID;
							var setVal = null;

							if (checkRType == AMEPV0020_RTYPE.PROFITAM){
								// 経準高の場合は計算する
								setVal = Math.round(this.options.sale.gRow[key] * this.options.profit.gRow[key]);
							} else if (checkRType == AMEPV0020_RTYPE.OPERPRT){
								// 営業利益率の場合は計算する
								setVal = getPercentValue(this.options.oper.gRow[key], this.options.sale.gRow[key]);
							}else{
								setVal = areaTotal;
							}

							valueBuff = mainView.setDispValue(area, kind, setVal);
							if (!_.isUndefined(gRow)) { gRow[key] = valueBuff; }
							if (!_.isUndefined(gRowPrev)) { gRowPrev[key] = area.prevRate; }
						}

						// ゾーン年計更新
						if (zoneY != null){
							var key = '0_' + zoneOrgID;
							var setVal = null;

							if (checkRType == AMEPV0020_RTYPE.PROFITAM){
								// 経準高の場合は計算する
								setVal = Math.round(this.options.sale.gRow[key] * this.options.profit.gRow[key]);
							} else if (checkRType == AMEPV0020_RTYPE.OPERPRT){
								// 営業利益率の場合は計算する
								setVal = getPercentValue(this.options.oper.gRow[key], this.options.sale.gRow[key]);
							}else{
								setVal = zoneTotalY;
							}

							valueBuff = mainView.setDispValue(zoneY, kind, setVal);
							if (!_.isUndefined(gRow)) { gRow[key] = valueBuff; }
							if (!_.isUndefined(gRowPrev)) { gRowPrev[key] = zoneY.prevRate; }
						}

						// エリア年計更新
						if (areaY != null){
							var key = '0_' + areaOrgID;
							var setVal = null;

							if (checkRType == AMEPV0020_RTYPE.PROFITAM){
								// 経準高の場合は計算する
								setVal = Math.round(this.options.sale.gRow[key] * this.options.profit.gRow[key]);
							} else if (checkRType == AMEPV0020_RTYPE.OPERPRT){
								// 営業利益率の場合は計算する
								setVal = getPercentValue(this.options.oper.gRow[key], this.options.sale.gRow[key]);
							}else{
								setVal = areaTotalY;
							}

							valueBuff = mainView.setDispValue(areaY, kind, setVal);
							if (!_.isUndefined(gRow)) { gRow[key] = valueBuff; }
							if (!_.isUndefined(gRowPrev)) { gRowPrev[key] = areaY.prevRate; }
						}

						// エリア計
						if (otherArea.length > 0){
							$.each(otherArea, function(){
								valueBuff = mainView.setDispValue(this, kind, null);
								if (!_.isUndefined(gRow)) { gRow['0_' + this.orgID] = valueBuff; }
							});
						}

						var optOper = null;
						var optSale = null;
						if (checkRType == AMEPV0020_RTYPE.OPERPRT){
							optOper = this.options.oper;
							optSale = this.options.sale;
						}

						// 組織計
						$.each(orgTotal, function(){
							if (this.tgt != null){
								var key = '0_' + this.orgID;
								var setVal = null;

								if (checkRType == AMEPV0020_RTYPE.OPERPRT){
									setVal = getPercentValue(optOper.gRow[key], optSale.gRow[key]);
								}else{
									setVal = this.value;
								}

								valueBuff = mainView.setDispValue(this.tgt, kind, setVal);
								if (!_.isUndefined(gRow)) { gRow[key] = valueBuff; }
								if (!_.isUndefined(gRowPrev)) { gRowPrev[key] = this.tgt.prevRate; }
							}
						});

						// 上半期計
						$.each(half1Total, function(){
							if (this.tgt != null){
								var key = '13_' + this.orgID;
								var setVal = null;

								if (checkRType == AMEPV0020_RTYPE.OPERPRT){
									setVal = getPercentValue(optOper.gRow[key], optSale.gRow[key]);
								}else{
									setVal = this.value;
								}

								valueBuff = mainView.setDispValue(this.tgt, kind, setVal);
								if (!_.isUndefined(gRow)) { gRow[key] = valueBuff; }
								if (!_.isUndefined(gRowPrev)) { gRowPrev[key] = this.tgt.prevRate; }
							}
						});

						// 下半期計
						$.each(half2Total, function(){
							if (this.tgt != null){
								var key = '14_' + this.orgID;
								var setVal = null;

								if (checkRType == AMEPV0020_RTYPE.OPERPRT){
									setVal = getPercentValue(optOper.gRow[key], optSale.gRow[key]);
								}else{
									setVal = this.value;
								}

								valueBuff = mainView.setDispValue(this.tgt, kind, setVal);
								if (!_.isUndefined(gRow)) { gRow[key] = valueBuff; }
								if (!_.isUndefined(gRowPrev)) { gRowPrev[key] = this.tgt.prevRate; }
							}
						});

					}
				});

				mainView.grid.clearAllCellMessage();

				var msg =  '';
				if (!msg){
					msg = "営業利益がマイナスです";
				}

				var gRow = this.gridUpdateRow['' + AMEPV0020_RTYPE.OPERPAM];
				$.each(this.fieldList, function(){
					var fieldName = this.toString();
					var chkVal = Number(gRow[fieldName]);
					if (chkVal < 0){
						mainView.grid.setCellMessage(gRow._cl_gridRowId, fieldName, 'warn', msg);
					}
				});

				this.grid.grid.invalidate();
			},//cell:change
		},

		updateParent: function(item, month, orgID){
			var operPlan = item.operPlan;
			var operPlanPrev = item.operPlanPrev;
			//var scPlan = item.scPlan;
			var diff = operPlan - operPlanPrev;//scPlan;

			// 親データ更新
			if (item.rType == AMEPV0020_RTYPE.ACCITEM && item.pAccID > 0){
				this.updatePlan({
					item	: this.dispData.body[this.dispData.accID_list[item.pAccID]],
					month	: month,
					orgID	: orgID,
					diff	: diff,
					rType	: item.rType,
				});
			}

			// 売上高データ取得
			var saleAm = this.dispData.body[this.dispData.calcTarget[AMEPV0020_RTYPE.SALEAM]];

			// 経準率データ取得
			var profitRate = this.dispData.body[this.dispData.calcTarget[AMEPV0020_RTYPE.PROFITRT]];

			// 経準高データ取得
			var profitAm = this.dispData.body[this.dispData.calcTarget[AMEPV0020_RTYPE.PROFITAM]];

			// 営業利益高データ取得
			var operPAm = this.dispData.body[this.dispData.calcTarget[AMEPV0020_RTYPE.OPERPAM]];

			// 営業利益率データ取得
			var operPRate = this.dispData.body[this.dispData.calcTarget[AMEPV0020_RTYPE.OPERPRT]];

			var saleArg = {};
			var profitArg = {};
			var operArg = {};
			var benefitArg = {};

			// 売上高データ更新
			if ((item.rType != AMEPV0020_RTYPE.PROFITRT && item.rType != AMEPV0020_RTYPE.OPERPRT) &&
				item.rType != AMEPV0020_RTYPE.SALEAM && saleAm != null){
				saleArg = {
					item	: saleAm,
					month	: month,
					orgID	: orgID,
					diff	: diff,
					rType	: AMEPV0020_RTYPE.SALEAM,
				};

				this.updatePlan(saleArg);
			}

			// 経準高データ更新
			var refProfitDiff = 0;
			if (profitRate != null &&
				(item.rType != AMEPV0020_RTYPE.PROFITAM && profitAm != null) &&
				saleAm != null){
				profitArg = {
					saleAm	: saleAm,
					pRate	: profitRate,
					pAm		: profitAm,
					month	: month,
					orgID	: orgID,
				};

				refProfitDiff = this.updateProfit(profitArg);
			}

			// 営業利益高データ更新
			if (item.rType != AMEPV0020_RTYPE.OPERPAM && operPAm != null){
				operArg = {
					item	: operPAm,
					month	: month,
					orgID	: orgID,
					diff	: refProfitDiff,
					rType	: AMEPV0020_RTYPE.OPERPAM,
				};

				this.updatePlan(operArg);
			}

			// 営業利益率データ更新
			if ((item.rType != AMEPV0020_RTYPE.OPERPRT && operPRate != null) &&
				saleAm != null && operPAm != null){
				benefitArg = {
					saleAm		: saleAm,
					opAm		: operPAm,
					opRate		: operPRate,
					month		: month,
					orgID		: orgID,
				};

				this.updateBenefit(benefitArg);
			}
		},

		updatePlan: function(args){
			var itemList = [args.item.list.month[args.month], args.item.totalList];

			$.each(itemList, function(){
				var tgt = mainView.searchTargetOrg(this, args.orgID);

				if (tgt != null){
					var value = tgt.operPlan;
					value += args.diff;
					tgt.operPlan = value;
					tgt.operPlanDisp = Math.round(value / 1000);

					var key = args.rType;
					if (args.rType == AMEPV0020_RTYPE.ACCITEM){
						key = AMEPV0020_RTYPE.PACCITEM + '_' + tgt.accID;
					}

					// グリッドのデータを更新
					var gRowKey = tgt.month + '_' + tgt.orgID;
					mainView.gridUpdateRow[key][gRowKey] = tgt.operPlanDisp;
					mainView.gridUpdateRowPrev[key][gRowKey] = getPercentValue(tgt.operPlan, tgt.prevAm);
				}
			});
		},

		updateProfit: function(args){
			var saleAm = this.searchTargetOrg(args.saleAm.list.month[args.month], args.orgID);	// 売上高
			var pRate = this.searchTargetOrg(args.pRate.list.month[args.month], args.orgID);	// 経準率
			var pAm = this.searchTargetOrg(args.pAm.list.month[args.month], args.orgID);		// 経準高
			var pAmT = this.searchTargetOrg(args.pAm.totalList, args.orgID);					// 経準高（計）

			pAm.operPlan = saleAm.operPlan * (pRate.operPlanDisp / 100);
			pAm.operPlanDisp = Math.round(pAm.operPlan / 1000);

			var diff = pAm.operPlan - pAm.scPlan;

			pAmT.operPlan = pAmT.operPlan + diff;
			pAmT.operPlanDisp = Math.round(pAmT.operPlan / 1000);

			// グリッドのデータを更新
			var gRowKey = args.month + '_' + args.orgID;
			var gRowKeyY = '0_' + args.orgID;

			// 月
			mainView.gridUpdateRow[AMEPV0020_RTYPE.PROFITAM][gRowKey] = pAm.operPlanDisp;
			mainView.gridUpdateRowPrev[AMEPV0020_RTYPE.PROFITAM][gRowKey] = getPercentValue(pAm.operPlan, pAm.prevAm);

			// 年
			mainView.gridUpdateRow[AMEPV0020_RTYPE.PROFITAM][gRowKeyY] = pAmT.operPlanDisp;
			mainView.gridUpdateRowPrev[AMEPV0020_RTYPE.PROFITAM][gRowKeyY] = getPercentValue(pAmT.operPlan, pAmT.prevAm);

			return diff;
		},

		updateBenefit: function(args){
			var saleAm = this.searchTargetOrg(args.saleAm.list.month[args.month], args.orgID);	// 売上高
			var opAm = this.searchTargetOrg(args.opAm.list.month[args.month], args.orgID);		// 営業利益高
			var opRate = this.searchTargetOrg(args.opRate.list.month[args.month], args.orgID);	// 営業利益率

			opRate.operPlan = getPercentValue(opAm.operPlan, saleAm.operPlan);
			opRate.operPlanDisp = opRate.operPlan.toFixed(1);

			// グリッドのデータを更新
			var gRowKey = args.month + '_' + args.orgID;
			mainView.gridUpdateRow[AMEPV0020_RTYPE.OPERPRT][gRowKey] = opRate.operPlanDisp;
			//mainView.gridUpdateRowPrev[AMEPV0020_RTYPE.OPERPRT][gRowKey] = Math.round(opRate.operPlan / opRate.prevAm * 100 * 10) / 10;
		},

		searchTargetOrg: function(monthData, orgID){
			var tgt = null;

			$.each(monthData, function(){
				if (this.orgID == orgID){
					tgt = this;
					return false;
				}
			});

			return tgt;
		},

		setGridData: function(){
			this.gridData = [];

			var accGrpNameList = new Array();
			var accNameList = new Array();
			var orgLevel_list = this.dispData.orgLevel_list;

			accGrpNameList.push('NOTHING');
			accNameList.push('NOTHING');

			var accGrpEven = false;
			var accEven = false;

			$.each(this.dispData.body, function(){
				var lineList = new Array();
				var aim = this.aim;
				var accID = this.accID;
				var pAccID = this.pAccID;
				var rType = this.rType;
				var percent = (rType == AMEPV0020_RTYPE.PROFITRT || rType == AMEPV0020_RTYPE.OPERPRT) ? '(%)' : '';

				if (!aim) {
					lineList.push({
						caption	: '営業案' + percent,
						colmun	: 'operPlanDisp',
						kind	: 'operPlan',
					});
					if (this.fRate == 1) {
						lineList.push({
							caption	: '分配率(%)',
							colmun	: 'operPlanRate',
							kind	: 'operPlanRate',
						});
					}

					lineList.push({
						caption	: 'SC計画案' + percent,
						colmun	: 'scPlanDisp',
						kind	: 'scPlan',
					});
					if (this.fRate == 1) {
						lineList.push({
							caption	: '分配率(%)',
							colmun	: 'scPlanRate',
							kind	: 'scPlanRate',
						});
					}

					if (this.fPrev3 == 1) {
						lineList.push({
							caption	: '3年前実績' + percent,
							colmun	: 'prev3AmDisp',
							kind	: 'prev3Am',
						});
					}

					if (this.fPrev2 == 1) {
						lineList.push({
							caption	: '2年前実績' + percent,
							colmun	: 'prev2AmDisp',
							kind	: 'prev2Am',
						});
					}

					lineList.push({
						caption	: '前年実績' + percent,
						colmun	: 'prevAmDisp',
						kind	: 'prevAm',
					});
					if (this.fRate == 1) {
						lineList.push({
							caption	: '分配率(%)',
							colmun	: 'prevAmRate',
							kind	: 'prevAmRate',
						});
					}

					lineList.push({
						caption	: '前年差',
						colmun	: 'prevRate',
						kind	: 'prevRate',
					});
				} else {
					lineList.push({
						caption	: '営業利益目標',
						colmun	: 'operPlanDisp',
						kind	: 'operPlan',
					});
				}

				var totalList = this.totalList;
				var half1List = this.half1List;
				var half2List = this.half2List;
				var dispList = this.dispList;
				var accGrpName = this.accGrpName;
				var accName = this.accName;

				$.each(lineList, function(){
					var tmp = {};
					var colmun = this.colmun;
					var editableColumn = new Array();

					var accGrp = '';
					var acc = '';


					if (accGrpNameList[accGrpNameList.length - 1] != accGrpName){
						accGrpNameList.push(accGrpName);
						accGrp = accGrpName;
						accGrpEven = !accGrpEven;
					}

					if (accNameList[accNameList.length - 1] != accName){
						accNameList.push(accName);
						acc = accName;
						accEven = !accEven;
					}

					var caption = this.caption;
					var pushEditable = (this.caption == '営業案' || this.caption == '営業案' + percent || this.caption == '営業利益目標');

					if (this.caption == '営業利益目標'){
						caption = '';
					}

					tmp['accGrpName'] = accGrp;
					tmp['accGrpEven'] = accGrpEven;
					tmp['accName'] = acc;
					tmp['accEven'] = accEven;
					tmp['dataName'] = caption;

					$.each(totalList, function(){
						var key = this.month + '_' + this.orgID;
						tmp[key] = this[colmun];

						if (aim){
							if (pushEditable){
								if (this.validNumberFlag == 1 && orgLevel_list[this.orgID].orgLevel == ~~clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')){
									editableColumn.push(key);
								}else{
									if (orgLevel_list[this.orgID].orgLevel != ~~clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')){
										tmp[key] = '';
									}
								}
							}
						}
					});

					$.each(half1List, function() {
						var key = this.month + '_' + this.orgID;
						tmp[key] = this[colmun];

						if (aim){
							if (pushEditable){
								if (this.validNumberFlag == 1 && orgLevel_list[this.orgID].orgLevel == ~~clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')){
									editableColumn.push(key);
								}else{
									if (orgLevel_list[this.orgID].orgLevel != ~~clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')){
										tmp[key] = '';
									}
								}
							}
						}
					});

					$.each(half2List, function() {
						var key = this.month + '_' + this.orgID;
						tmp[key] = this[colmun];

						if (aim){
							if (pushEditable){
								if (this.validNumberFlag == 1 && orgLevel_list[this.orgID].orgLevel == ~~clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')){
									editableColumn.push(key);
								}else{
									if (orgLevel_list[this.orgID].orgLevel != ~~clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')){
										tmp[key] = '';
									}
								}
							}
						}
					});

					$.each(dispList, function(){
						var key = this.month + '_' + this.orgID;
						tmp[key] = this[colmun];

						if (pushEditable){
							if (!aim){
								if (this.fInput == 1 && this.validNumberFlag == 0){
									editableColumn.push(key);
								}
							}else{
								tmp[key] = '';
							}
						}
					});

					tmp['editableColumn'] = editableColumn;
					tmp['kind'] = this.kind;
					tmp['accID'] = accID;
					tmp['pAccID'] = pAccID;
					tmp['rType'] = rType;

					mainView.gridData.push(tmp);
				});
			});
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){
			// 検索条件部を活性化する
			clutil.viewRemoveReadonly($("#ca_srchArea"));

			// 検索条件初期化
			this.srchCondView.deserialize({
				srchUnitID	: clcom.userInfo.unit_id,
				srchYear	: this.srchCondView.init_ope_year,
			});

			this.srchCondView.setInitializeValue();
			this.srchCondView.setDefaultEnabledProp();
			clutil.setFocus(this.srchCondView.$tgtFocus);

			// 検索結果クリア
			this.srchAreaCtrl.reset();

			// フッターボタン活性制御
			this.mdBaseView.setSubmitEnable(false);
			$("#mainColumnFooter").find(".cl_download").attr('disabled', false);
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				if (typeof this.grid != 'undefined'){
					this.grid.clearAllCellMessage();
				}

				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// TODO: 入力値エラー情報が入っていれば、個別 View へセットする。
				break;
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.srchCondView.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {

			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq, flg){
			var srchReq;
			var updReq = null;

			if(arguments.length > 0 && argSrchReq != null){
				srchReq = argSrchReq;
			}else{
				if(this.srchCondView.isValid()){
					srchReq = this.srchCondView.serialize();
					srchReq.srchOrgID = this.srchCondView.utl_org.getValue().id;
				}else{
					// メッセージは、srchConcView 側で出力済。
					return;
				}

				if (flg) {
					updReq = this.createUpdReq();
				}
			}

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},

				AMEPV0020GetReq: srchReq,
				AMEPV0020UpdReq: updReq,
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);

			var orgLevel = 0;
			var orgValue = this.srchCondView.utl_org.getValue();

			if (typeof orgValue.orglevel != 'undefined'){
				orgLevel = orgValue.orglevel;
			}else if (typeof orgValue.orglevel_level != 'undefined'){
				orgLevel = orgValue.orglevel_level;
			}

			if (req.AMEPV0020GetReq.validNumberFlag == 1 && orgLevel != ~~clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')){
				this.validator.setErrorHeader(clmsg.cl_echoback);
				this.validator.setErrorMsg($('#ca_AMPAV0010_orgname'), '目標入力は地区を指定して下さい');
			}else{
				// 検索実行
				req.AMEPV0020GetReq.AMPAV0010_attr = orgLevel;
				this.doSrch(req);
			}
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			this.clearResult();

			//$(".cl_meisai").hide();

			if (typeof srchReq.AMEPV0020GetReq.srchOrgID == 'undefined' ||
				srchReq.AMEPV0020GetReq.srchOrgID == ''){
				srchReq.AMEPV0020GetReq.srchOrgID = this.srchCondView.utl_org.getValue().id;
			}

			var defer = clutil.postJSON('AMEPV0020', srchReq).done(_.bind(function(data){

				this.srchDoneProc(srchReq, data, chkData);

			}, this)).fail(_.bind(function(data){
				this.srchFailProc(data);

			}, this));

			return defer;
		},

		srchDoneProc: function(srchReq, data, chkData){
			// データ取得
			var recs = data.AMEPV0020GetRsp.rawRecs;
			var colRecs = data.AMEPV0020GetRsp.colRecs;

			if (_.isEmpty(recs) || _.isEmpty(colRecs)) {
				// エラーメッセージ表示
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// フォーカス設定
				this.resetFocus(this.srchCondView.$tgtFocus);

				mainView.setSubmitLabel(false);

			} else {
				clutil.viewReadonly($("#ca_srchArea"));
				$("#searchAgain").text('検索条件を開く');

				// リクエストを保存。
				this.savedReq = srchReq;
				this.savedRsp = $.extend(true, {}, data.AMEPV0020GetRsp);

				this.checkTotalData(data.AMEPV0020GetRsp, srchReq.AMEPV0020GetReq);
				this.checkAimData(data.AMEPV0020GetRsp);

				this.setDispData(data.AMEPV0020GetRsp);

				var month = data.AMEPV0020GetRsp.colRecTopMonth;

				var orglevel = srchReq.AMEPV0020GetReq.AMPAV0010_attr;
				var mode = 0;
				if (orglevel == Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))){
					mode = 1;
				}
				var monthOrder;
				if (mode == 1) {
					monthOrder = ['0','13','14','4','5','6','7','8','9','10','11','12','1','2','3'];
				} else {
					monthOrder = ['0','13','14','4','5','6','7','8','9','10','11','12','1','2','3'];
				}
				$.each(monthOrder, function(){
					var data = mainView.dispData.month_list[this];
					if (data.month != '0' && data.month != '13' && data.month != '14' && data.available){
						month = data.month;
						return false;
					}
				});

				this.setPlanTable(month);

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// フォーカスの設定
				if(typeof $focusElem != 'undefined') {
					this.resetFocus($focusElem);
				}

				this.showGrid(month);
				this.hasInputError();

				mainView.setSubmitLabel(true);

				$.when($('#searchAgain')).done(function () {
					var $window = $(window);
					var offset = $('#searchAgain').offset();
					var location = {
						left	: offset.left - $window.scrollLeft(),
						top		: offset.top  - $window.scrollTop(),
					};

				    if (location.top < 0){
				    	clcom.targetJump('searchAgain', 50);
				    }
				});
			}
		},

		showGrid: function(month){
			this.createGridData(month);
			this.initGrid();

			this.setGridData();
			var frozenColumn = 3;
			if (this.savedReq.AMEPV0020GetReq.AMPAV0010_attr == Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))){
				frozenColumn = 5;
			}

			var aimShift = (this.dispData.aimAvailable) ? 1 : 0;
			var gridParam = {
				gridOptions		: {
					frozenColumn	: frozenColumn,
					autoHeight		: false,
					frozenRow		: 5 - this.dispData.zoneShift - this.dispData.areaShift + aimShift,
				},										// データグリッドのオプション
				columns			: this.columns,			// カラム定義
				colhdMetadatas	: this.colhdMetadatas,	// メタデータ
				data			: this.gridData,		// データ
			};

			console.log(gridParam);

			this.grid.setData(gridParam);

			this.gridUpdateRow = {};
			this.gridUpdateRowPrev = {};

			var tmp = this.grid.getData();
			var row = this.gridUpdateRow;
			var rowPrev = this.gridUpdateRowPrev;

			$.each(tmp, function(){
				if (this.kind == 'operPlan'){
					var key = '' + this.rType;

					switch (this.rType){
					case AMEPV0020_RTYPE.SALEAM:
					case AMEPV0020_RTYPE.PROFITRT:
					case AMEPV0020_RTYPE.PROFITAM:
					case AMEPV0020_RTYPE.OPERPAM:
					case AMEPV0020_RTYPE.OPERPRT:
						row[key] = this;
						break;
					case AMEPV0020_RTYPE.PACCITEM:
						row[AMEPV0020_RTYPE.PACCITEM + '_' + this.accID] = this;
						break;
					}
				}else if (this.kind == 'prevRate'){
					var key = '' + this.rType;

					switch (this.rType){
					case AMEPV0020_RTYPE.SALEAM:
					case AMEPV0020_RTYPE.PROFITRT:
					case AMEPV0020_RTYPE.PROFITAM:
					case AMEPV0020_RTYPE.OPERPAM:
					case AMEPV0020_RTYPE.OPERPRT:
						rowPrev[key] = this;
						break;
					case AMEPV0020_RTYPE.PACCITEM:
						rowPrev[AMEPV0020_RTYPE.PACCITEM + '_' + this.accID] = this;
						break;
					case AMEPV0020_RTYPE.ACCITEM:
						rowPrev[AMEPV0020_RTYPE.ACCITEM + '_' + this.accID] = this;
						break;
					}
				}
			});
		},

		srchFailProc: function(data){
			// 検索ペインを表示
			mainView.srchAreaCtrl.show_srch();

			// エラーメッセージを通知。
			clutil.mediator.trigger('onTicker', data);

			// フォーカスの設定
			this.resetFocus();
		},

		checkTotalData: function(rsp, req){
			var totalAvailable = false;
			var zoneAvailable = false;
			var areaAvailable = false;
			var chkMonth = '';
			var colRecs = [];
			var monthChkData = {};

			var zone_levelid = ~~clcom.getSysparam('PAR_AMMS_ZONE_LEVELID');
			var area_levelid = ~~clcom.getSysparam('PAR_AMMS_AREA_LEVELID');
			var store_levelid = ~~clcom.getSysparam('PAR_AMMS_STORE_LEVELID');

			var mode = 0;
			if (req.AMPAV0010_attr == Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))){
				mode = 1;
			}

			$.each(rsp.colRecs, function(){
				chkMonth = this.month;
				if (chkMonth == 0){
					totalAvailable = true;
				}

				var key = '' + this.month;
				if (monthChkData[key] == null){
					monthChkData[key] = {month:key, count:0, zoneAvailable: false, areaAvailable:false};
				}

				if (this.orgLevel == zone_levelid){
					monthChkData[key].zoneAvailable = true;
					zoneAvailable = true;
				}

				if (this.orgLevel == area_levelid){
					monthChkData[key].areaAvailable = true;
					areaAvailable = true;
				}
			});

			$.each(monthChkData, function(){
				if (!this.zoneAvailable){
					var colRec = {
						month		: this.month,
						orgID		: 0,
						orgLevel	: zone_levelid,
						orgCode		: '',
						orgName		: '',
						pOrgID		: 0,
					};
					colRecs.push(colRec);
				}

				if (!this.areaAvailable){
					var colRec = {
						month		: this.month,
						orgID		: 1,
						orgLevel	: area_levelid,
						orgCode		: '',
						orgName		: '',
						pOrgID		: 0,
					};
					colRecs.push(colRec);
				}
			});

			$.each(rsp.colRecs, function(){
				if (this.orgLevel == area_levelid && !zoneAvailable){
					this.pOrgID = 0;
				}

				if (this.orgLevel == store_levelid && !areaAvailable){
					this.pOrgID = 1;
				}

				colRecs.push(this);
			});

			if (!totalAvailable){
				$.each(colRecs, function(){
					var month = this.month;
					if (month == chkMonth){
						var colRec = {
							month		: 0,
							orgID		: this.orgID,
							orgLevel	: this.orgLevel,
							orgCode		: this.orgCode,
							orgName		: this.orgName,
							pOrgID		: this.pOrgID,
						};
						colRecs.push(colRec);

						if (mode == 1 || mode == 0) {
							colRec = {
								month		: 13,
								orgID		: this.orgID,
								orgLevel	: this.orgLevel,
								orgCode		: this.orgCode,
								orgName		: this.orgName,
								pOrgID		: this.pOrgID,
							};
							colRecs.push(colRec);

							colRec = {
								month		: 14,
								orgID		: this.orgID,
								orgLevel	: this.orgLevel,
								orgCode		: this.orgCode,
								orgName		: this.orgName,
								pOrgID		: this.pOrgID,
							};
							colRecs.push(colRec);
						}
					}
				});
			}

			$.each(colRecs, function(){
				var key = '' + this.month;

				if (monthChkData[key] == null){
					monthChkData[key] = {month:key, count:0, zoneAvailable: false, areaAvailable:false,};

					if ((key == '0' || key == '13' || key == '14') && zoneAvailable){
						monthChkData[key].zoneAvailable = true;
					}

					if ((key == '0' || key == '13' || key == '14') && areaAvailable){
						monthChkData[key].areaAvailable = true;
					}
				}
				monthChkData[key].count++;
			});

			rsp.colRecs = colRecs;

			totalAvailable = false;
			chkMonth = '';
			$.each(rsp.cellRecs, function(){
				chkMonth = this.month;
				if (chkMonth == 0){
					totalAvailable = true;
					return false;
				}
			});

			if (!totalAvailable){
				var cellRecs = [];
				var totalRecs = [];
				var half1Recs = [];
				var half2Recs = [];

				$.each(rsp.cellRecs, function(){
					var month = this.month;
					if (month == chkMonth){
						var colRec = {
							accID		: this.accID,
							month		: 0,
							orgID		: this.orgID,
							operPlan	: 0,
							operPlanRate: 0,
							scPlan		: 0,
							scPlanRate	: 0,
							prevAm		: 0,
							scPlanRate	: 0,
							prevAmRate	: 0,
							prevRate	: 0,
							prev2Am		: 0,
							prev3Am		: 0,
							fInput		: 0,
						};
						totalRecs.push(colRec);

						if (mode == 1 || mode == 0) {
							var colRec13 = {
									accID		: this.accID,
									month		: 13,
									orgID		: this.orgID,
									operPlan	: 0,
									operPlanRate: 0,
									scPlan		: 0,
									scPlanRate	: 0,
									prevAm		: 0,
									scPlanRate	: 0,
									prevAmRate	: 0,
									prevRate	: 0,
									prev2Am		: 0,
									prev3Am		: 0,
									fInput		: 0,
								};
							var colRec14 = {
									accID		: this.accID,
									month		: 14,
									orgID		: this.orgID,
									operPlan	: 0,
									operPlanRate: 0,
									scPlan		: 0,
									scPlanRate	: 0,
									prevAm		: 0,
									scPlanRate	: 0,
									prevAmRate	: 0,
									prevRate	: 0,
									prev2Am		: 0,
									prev3Am		: 0,
									fInput		: 0,
								};
							half1Recs.push(colRec13);
							half2Recs.push(colRec14);
						}
					}
				});

				var totalRef = [];
				var half1Ref = [];
				var half2Ref = [];
				var totalRecIndex = 0;
				var half1RecIndex = 0;
				var half2RecIndex = 0;
				var cellRecIndex = 0;
				var counter = 0;

				$.each(rsp.rawRecs, function(){
					var accID = this.accID;

					$.each(monthChkData, function(){
						var key = this.month;
						var count = this.count;
						var zoneAvailable = this.zoneAvailable;

						if (!zoneAvailable){
							var colRec = {
								accID		: accID,
								month		: this.month,
								orgID		: 0,
								operPlan	: 0,
								operPlanRate: 0,
								scPlan		: 0,
								scPlanRate	: 0,
								prevAm		: 0,
								scPlanRate	: 0,
								prevAmRate	: 0,
								prevRate	: 0,
								prev2Am		: 0,
								prev3Am		: 0,
								fInput		: 0,
							};
							cellRecs.push(colRec);
							counter++;

							count--;
						}
						if (!areaAvailable){
							var colRec = {
								accID		: accID,
								month		: this.month,
								orgID		: 1,
								operPlan	: 0,
								operPlanRate: 0,
								scPlan		: 0,
								scPlanRate	: 0,
								prevAm		: 0,
								scPlanRate	: 0,
								prevAmRate	: 0,
								prevRate	: 0,
								prev2Am		: 0,
								prev3Am		: 0,
								fInput		: 0,
							};
							cellRecs.push(colRec);
							counter++;

							count--;
						}

						for (var i = 0; i < count; i++){
							if (key == '0'){
								var dataRef = totalRecs[totalRecIndex++];
								try
								{
								totalRef[dataRef.accID + '_' + dataRef.orgID] = dataRef;
								}
								catch(ex)
								{
									console.log('Error');
								}
								cellRecs.push(dataRef);
								counter++;
							} else if (key == '13') {
								var dataRef = half1Recs[half1RecIndex++];
								try
								{
								half1Ref[dataRef.accID + '_' + dataRef.orgID] = dataRef;
								}
								catch(ex)
								{
									console.log('Error');
								}
								cellRecs.push(dataRef);
								counter++;
							} else if (key == '14') {
								var dataRef = half2Recs[half2RecIndex++];
								try
								{
								half2Ref[dataRef.accID + '_' + dataRef.orgID] = dataRef;
								}
								catch(ex)
								{
									console.log('Error');
								}
								cellRecs.push(dataRef);
								counter++;
							}else{
								cellRecs.push(rsp.cellRecs[cellRecIndex++]);
								counter++;
							}
						}
					});
				});

				if (!totalAvailable){
					$.each(cellRecs, function(){
						var mon = this.month;
						if (mon != 0 && mon != 13 && mon != 14){
							var key = this.accID + '_' + this.orgID;
							if (totalRef[key] != null){
								var output = totalRef[key];
								output.operPlan += this.operPlan;
								output.scPlan += this.scPlan;
								output.prevAm += this.prevAm;
								output.prev2Am += this.prev2Am;
								output.prev3Am += this.prev3Am;
							}
							if (half1Ref[key] != null && mon >= 4 && mon <= 9) {
								var output = half1Ref[key];
								output.operPlan += this.operPlan;
								output.scPlan += this.scPlan;
								output.prevAm += this.prevAm;
								output.prev2Am += this.prev2Am;
								output.prev3Am += this.prev3Am;
							}
							if (half2Ref[key] != null && (mon <= 3 || mon >= 10)) {
								var output = half2Ref[key];
								output.operPlan += this.operPlan;
								output.scPlan += this.scPlan;
								output.prevAm += this.prevAm;
								output.prev2Am += this.prev2Am;
								output.prev3Am += this.prev3Am;
							}
						}
					});
				}

				rsp.cellRecs = cellRecs;
			}
		},

		checkAimData: function(rsp){
			if (this.savedReq == null ||
				typeof this.savedReq == 'undefined' ||
				typeof this.savedReq.AMEPV0020GetReq == 'undefined' ||
				this.savedReq.AMEPV0020GetReq.AMPAV0010_attr != ~~clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')) {
				return;
			}

			var rowRec = {
				accID		: AIM_KEY,
				accName		: '営業利益目標',
				accGrpName	: '営業計画',
				fRate		: 0,
				fPrev2		: 0,
				fPrev3		: 0,
				pAccID		: 0,
				rType		: 0,
				seqNo		: 0,
			};
			var rowRecs = new Array();
			rowRecs.push(rowRec);
			rsp.rawRecs = rowRecs.concat(rsp.rawRecs);

			var cellRecs = [];
			$.each(rsp.colRecs, function(){
				var colRec = {
					accID		: AIM_KEY,
					month		: this.month,
					orgID		: this.orgID,
					operPlan	: 0,
					operPlanRate: 0,
					scPlan		: 0,
					scPlanRate	: 0,
					prevAm		: 0,
					scPlanRate	: 0,
					prevAmRate	: 0,
					prevRate	: 0,
					prev2Am		: 0,
					prev3Am		: 0,
					fInput		: 1,
				};
				cellRecs.push(colRec);
			});

			rsp.cellRecs = cellRecs.concat(rsp.cellRecs);
		},

		setDispData: function(rsp){
			this.dispData = null;
			var mode = 0;
			if (this.savedReq.AMEPV0020GetReq.AMPAV0010_attr == Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))){
				mode = 1;
			}

			var tableData = {
				header : {
					month	: {},
				},
				body			: new Array(),
				month_list		: null,
				accID_list		: {},
				calcTarget		: {},
				zoneAvailable	: true,
				zoneShift		: 0,
				areaAvailable	: true,
				areaShift		: 0,
				status			: rsp.status,
				aimAvailable	: false,
			};

			var hd = tableData.header;
			var bd = tableData.body;
			var mon = null;
			var zone = null;
			var area = null;

			var cellLoopMax = 0;

			var parent_id_list = {orgID:{}};
			var orgLevel_list = new Array();
			var org_id_list = new Array();
			var month_list = new Array();
			month_list["0"] = {month:"0" ,available:false, using:true,};
			if (mode == 1 || mode == 0) {
				month_list["13"] = {month:"13" ,available:false, using:true,};
				month_list["14"] = {month:"14" ,available:false, using:true,};
			}
			month_list["1"] = {month:"1" ,available:false, using:false,};
			month_list["2"] = {month:"2" ,available:false, using:false,};
			month_list["3"] = {month:"3" ,available:false, using:false,};
			month_list["4"] = {month:"4" ,available:false, using:false,};
			month_list["5"] = {month:"5" ,available:false, using:false,};
			month_list["6"] = {month:"6" ,available:false, using:false,};
			month_list["7"] = {month:"7" ,available:false, using:false,};
			month_list["8"] = {month:"8" ,available:false, using:false,};
			month_list["9"] = {month:"9" ,available:false, using:false,};
			month_list["10"]= {month:"10",available:false, using:false,};
			month_list["11"]= {month:"11",available:false, using:false,};
			month_list["12"]= {month:"12",available:false, using:false,};

			var colRecTopMonth = '0';

			var zone_levelid = Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID'));
			var area_levelid = Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID'));
			var store_levelid = Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'));

			// テーブルのヘッダ部分のデータを生成する
			$.each(rsp.colRecs, function(){
				var month = this.month.toString();

				if (month == ''){
					month='0';
				}else{
					if (colRecTopMonth == '0'){
						colRecTopMonth = month;
						rsp.colRecTopMonth = colRecTopMonth;
					}
				}

				month_list[month].available = true;

				if (month == "0"){
					totalAvailable = true;
				}

				if (hd.month[month] == null){
					hd.month[month] = {
						zone	: new Array(),
						area	: new Array(),
						store	: new Array(),
						caption	: new Array(),
						month	: month,
					};
				}
				mon = hd.month[month];

				var orgName = this.orgName.replace(/(^\s+)|(\s+$)/g, "");
				var pushZone = false;
				var pushArea = false;
				var pushStore = false;

				switch (this.orgLevel){
				case zone_levelid:	// ゾーン
					pushZone = true;
					break;
				case area_levelid:	// エリア
					if (zone == null){
						pushZone = true;
					}
					pushArea = true;
					break;
				case store_levelid:	// 店舗
					if (zone == null){
						pushZone = true;
					}
					if (area == null){
						pushArea = true;
					}
					pushStore = true;
					break;
				}

				if (pushZone){
					mon.zone.push({orgID:this.orgID, orgCode:this.orgCode, orgName:orgName, colspan:0, totalspan:0, month: month, index: 0,});
					zone = mon.zone[mon.zone.length - 1];
					zone.totalspan = 1;

					if (this.orgID == 0){
						tableData.zoneAvailable = false;
						tableData.zoneShift = 1;
					}
				}

				if (pushArea){
					var zoneOrgID = this.pOrgID;
					var areaOrgID = this.orgID;

					parent_id_list.orgID[this.orgID] = {orgID:this.orgID, areaOrgID:areaOrgID, zoneOrgID:zoneOrgID,};

					mon.area.push({orgID:this.orgID, orgCode:this.orgCode, orgName:orgName, colspan:0, month: month,});
					area = mon.area[mon.area.length - 1];

					if (zone.month != month || zone.orgID != zoneOrgID){
						$.each(mon.zone, function(){
							if (this.month == month && this.orgID == zoneOrgID){
								zone = this;
								return false;
							}
						});
					}
					zone.totalspan += 1;
					zone.colspan += 1;

					if (this.orgID == 1){
						tableData.areaAvailable = false;
						tableData.areaShift = 1;
					}
				}

				if (pushStore){
					var zoneOrgID = parent_id_list.orgID[this.pOrgID].zoneOrgID;
					var areaOrgID = this.pOrgID;

					parent_id_list.orgID[this.orgID] = {orgID:this.orgID, areaOrgID:areaOrgID, zoneOrgID:zoneOrgID,};

					mon.store.push({orgID:this.orgID, orgCode:this.orgCode, orgName:orgName,});

					if (zone.month != month || zone.orgID != zoneOrgID){
						$.each(mon.zone, function(){
							if (this.month == month && this.orgID == zoneOrgID){
								zone = this;
								return false;
							}
						});
					}
					zone.totalspan += 1;
					zone.colspan += 1;

					if (area.month != month || area.orgID != areaOrgID){
						$.each(mon.area, function(){
							if (this.month == month && this.orgID == areaOrgID){
								area = this;
								return false;
							}
						});
					}
					area.colspan += 1;

					org_id_list[''+this.orgID] = true;
				}

				// 項目
				mon.caption.push({orgLevel:this.orgLevel,});

				orgLevel_list[''+this.orgID] = {orgID:this.orgID, orgLevel:this.orgLevel,};

				cellLoopMax++;
			});

			var validNumberFlag = 0;
			if (this.savedReq != null &&
					typeof this.savedReq != 'undefined' &&
					typeof this.savedReq.AMEPV0020GetReq != 'undefined') {
				validNumberFlag = this.savedReq.AMEPV0020GetReq.validNumberFlag;
			}

			var cellIndex = 0;
			var bdIndex = 0;

			var map_profitam = {};

			// テーブルの縦軸部分のデータを生成する
			$.each(rsp.rawRecs, function(){
				var list = { month: {},};
				var aim = false;
				var rType = this.rType;
				var pAccID = this.pAccID;

				if (this.accID == AIM_KEY){
					aim = true;
					tableData.aimAvailable = true;
				}
				var operPlanTotal = 0,
				    scPlanTotal = 0,
				    prevAmTotal = 0;


				// テーブルの横軸部分のデータを生成する
				for (var i = 0; i < cellLoopMax; i++){
					var cell = rsp.cellRecs[cellIndex];

					if (cell == null || typeof cell == 'undefined' || cell.month == null || typeof cell.month == 'undefined'){
						console.log('ERR');
						return true;
					}

					var month = cell.month.toString();

					month_list[month].using = true;

					if (list.month[month] == null){
						list.month[month] = new Array();
					}
					if (month == '0') {
						operPlanTotal = operPlanTotal == 0 ? cell.operPlan : operPlanTotal;
						scPlanTotal = scPlanTotal == 0 ? cell.scPlan : scPlanTotal;
						prevAmTotal = prevAmTotal == 0 ? cell.prevAm : prevAmTotal;
					}

					var editable = (org_id_list[''+cell.orgID]);
					var fInput =cell.fInput;

					if (opeTypeKind <= TYPE_KIND.EDITABLE) {
						fInput = 0;
					}
					if (fInput == 1) {
						console.log(cell);
					}

					var operPlanDisp = 0;
					var scPlanDisp = 0;
					var prevAmDisp = 0;
					var prevDisp = 0;
					//var prevRate = cell.prevRate;
					var prevSub = cell.operPlan - cell.prevAm;

					if (rType == AMEPV0020_RTYPE.PROFITRT || rType == AMEPV0020_RTYPE.OPERPRT){
						// 経準率/営業利益率
						operPlanDisp = (cell.operPlan / 10).toFixed(1);
						scPlanDisp = (cell.scPlan / 10).toFixed(1);
						prevAmDisp = (cell.prevAm / 10).toFixed(1);
						prevDisp = (prevSub / 10).toFixed(1);
					}else{
						// 売上高/経準高/営業利益高/親項目/子項目
						operPlanDisp = Math.round(cell.operPlan / 1000);
						scPlanDisp = Math.round(cell.scPlan / 1000);
						prevAmDisp = Math.round(cell.prevAm / 1000);
						prevDisp = Math.round(prevSub / 1000);

						if (cell.prevAm != 0 && cell.prevRate == 0){
							//prevRate = getPercentValue(cell.operPlan, cell.prevAm);
						}
					}
					var keystring2 = cell.month + '_' + cell.orgID;
					if (rType == AMEPV0020_RTYPE.PROFITAM) {
						map_profitam[keystring2] = cell.operPlan;
					}

					list.month[month].push({
						keystring		: cell.accID + '_' + cell.month + '_' + cell.orgID,
						keystring2		: keystring2,
						accID			: cell.accID,
						pAccID			: pAccID,
						rType			: rType,
						orgID			: cell.orgID,
						month			: cell.month,
						operPlan		: cell.operPlan,
						operPlanDisp	: operPlanDisp,
						operPlanPrev	: cell.scPlan,
						operPlanRate	: cell.operPlanRate,
						scPlan			: cell.scPlan,
						scPlanDisp		: scPlanDisp,
						scPlanRate		: cell.scPlanRate,
						prevAm			: cell.prevAm,
						prevAmDisp		: prevAmDisp,
						prevAmRate		: cell.prevAmRate,
						prev2Am			: cell.prev2Am,
						prev2AmDisp		: Math.round(cell.prev2Am / 1000),
						prev2AmRate		: cell.prev2AmRate,
						prev3Am			: cell.prev3Am,
						prev3AmDisp		: Math.round(cell.prev3Am / 1000),
						prev3AmRate		: cell.prev3AmRate,
						prevRate		: prevDisp,
						fInput			: fInput,
						editable		: editable,
						validNumberFlag	: validNumberFlag,
					});

					cellIndex++;
				}
				if (rType != AMEPV0020_RTYPE.PROFITAM) {
					$.each(list.month, function() {
						$.each(this, function() {
							var profitam = map_profitam[this.keystring2];
							if (profitam != null && profitam != 0) {
								this.operPlanRate = getPercentValue(this.operPlan, profitam);
								this.scPlanRate = getPercentValue(this.scPlan, profitam);
								this.prevAmRate = getPercentValue(this.prevAm, profitam);
							}
						});
					});
				}

				tableData.accID_list[''+this.accID] = bdIndex;
				bd.push({
					accID		: this.accID,
					pAccID		: pAccID,
					accName		: this.accName,
					accGrpName	: this.accGrpName,
					fRate		: this.fRate,
					fPrev2		: this.fPrev2,
					fPrev3		: this.fPrev3,
					list		: list,
					aim			: aim,
					rType		: rType,
				});

				switch (rType){
				case AMEPV0020_RTYPE.SALEAM:
					tableData.calcTarget[AMEPV0020_RTYPE.SALEAM] = bdIndex;
					break;
				case AMEPV0020_RTYPE.PROFITRT:
					tableData.calcTarget[AMEPV0020_RTYPE.PROFITRT] = bdIndex;
					break;
				case AMEPV0020_RTYPE.PROFITAM:
					tableData.calcTarget[AMEPV0020_RTYPE.PROFITAM] = bdIndex;
					break;
				case AMEPV0020_RTYPE.OPERPAM:
					tableData.calcTarget[AMEPV0020_RTYPE.OPERPAM] = bdIndex;
					break;
				case AMEPV0020_RTYPE.OPERPRT:
					tableData.calcTarget[AMEPV0020_RTYPE.OPERPRT] = bdIndex;
					break;
				}

				 bdIndex++;
			});

			orgLevel_list['0'] = {orgID:0, orgLevel:~~clcom.getSysparam('PAR_AMMS_ZONE_LEVELID'),};

			tableData.parent_id_list = parent_id_list;
			tableData.orgLevel_list = orgLevel_list;
			tableData.month_list = month_list;

			if (tableData.aimAvailable){
				tableData.body[0].list.month['0'][0].operPlan = rsp.targetAm;
				tableData.body[0].list.month['0'][0].operPlanDisp = Math.round(rsp.targetAm / 1000);
			}

			$.each(tableData.body, function(){
				$.each(this.list.month, function(){
					this.sort(
						function(a,b){
							var x = a["orgID"];
							var y = b["orgID"];
							if( x > y ) return 1;
							if( x < y ) return -1;
							return 0;
						}
					);
				});
			});

			this.dispData = tableData;

			this.updateOperTotal();
			this.updateProfitTotal();
		},

		updateOperTotal: function() {
			var operRt = this.dispData.body[this.dispData.calcTarget[AMEPV0020_RTYPE.OPERPRT]];
			var operPAm = this.dispData.body[this.dispData.calcTarget[AMEPV0020_RTYPE.OPERPAM]];
			var saleAm = this.dispData.body[this.dispData.calcTarget[AMEPV0020_RTYPE.SALEAM]];
			var index = 0;

			$.each(operRt.list.month[0], function(){
				var pAm = operPAm.list.month[0][index];
				var sAm = saleAm.list.month[0][index];

				var operPlan = getPercentValue(pAm.operPlan, sAm.operPlan);
				this.operPlan = operPlan;
				this.operPlanDisp = operPlan.toFixed(1);

				this.scPlanDisp = '-';
				this.prevAmDisp = '-';
				this.prevRate = 0;

				index++;
			});
		},

		updateProfitTotal: function() {
			var profitRt = this.dispData.body[this.dispData.calcTarget[AMEPV0020_RTYPE.PROFITRT]];
			var profitAm = this.dispData.body[this.dispData.calcTarget[AMEPV0020_RTYPE.PROFITAM]];
			var saleAm = this.dispData.body[this.dispData.calcTarget[AMEPV0020_RTYPE.SALEAM]];
			var index = 0;

			$.each(profitRt.list.month[0], function(){
				var pAm = profitAm.list.month[0][index];
				var sAm = saleAm.list.month[0][index];

				var operPlan = getPercentValue(pAm.operPlan, sAm.operPlan);
				this.operPlan = operPlan;
				this.operPlanDisp = operPlan.toFixed(1);

				this.scPlanDisp = '-';
				this.prevAmDisp = '-';
				this.prevRate = 0;

				index++;
			});
		},

		setPlanTable: function(month) {
			var mode = 0;
			if (this.srchCondView.utl_org.getValue().orglevel == Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))){
				mode = 1;
			}

			$.each(this.dispData.month_list, function(){
				var enabled = this.available;
				var mon = this.month;
				var id = '#ca_monthlink_' + mon;

				if (mode == 0){
					if (mon == month || mon == 0){
						enabled = false;
					}

					if (enabled){
						$(id).show();
					} else {
						$(id).hide();
					}
				} else {
					$(id).hide();
				}
			});

			var cellCount = 0;
			var cellChecked = false;
			$.each(this.dispData.body, function(){

				this.totalList = this.list.month[0];
				this.half1List = this.list.month[13];
				this.half2List = this.list.month[14];

				if (!cellChecked) { cellCount += this.totalList.length; }

				if (mode == 0){
					this.dispList = this.list.month[month];
				} else {
					var chaindata = new Array();

					$.each(this.list.month, function(){
						$.each(this, function(){
							if (this.month != 0){
								chaindata.push(this);
							}
						});
					});

					this.dispList = chaindata;
				}

				if (!cellChecked) { cellCount += this.dispList.length; }
				cellChecked = true;
			});
		},

		_onMonthLClick: function(e){
			clutil.blockUI();

			var $tgt = $(e.currentTarget);
			var month = $tgt.data().month;

			this.setPlanTable(month);

			this.showGrid(month);

			this.hasInputError();

			clutil.unblockUI();
		},

		_onMeisai1Click: function(e){
			this.doDownLoadMeisai(1);
		},

		_onMeisai2Click: function(e){
			this.doDownLoadMeisai(2);
		},
		_onMeisai3Click: function(e){
			this.doDownLoadMeisai(3);
		},

		doDownLoadMeisai: function(srchType){
			var srchReq = this.buildReq();

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMEPV0030GetReq: {
					srchUnitID:srchReq.AMEPV0020GetReq.srchUnitID,
					srchYear:srchReq.AMEPV0020GetReq.srchYear,
					srchType:srchType
				}
			};

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMEPV0030', getReq);
			defer.fail(_.bind(function(data){
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// リクエストをつくる
			var srchReq = this.buildReq(null, true);
			if(_.isNull(srchReq) || typeof srchReq == 'undefined'){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMEPV0020', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFocus($focusElem);
			}else{
				if (this.$('#searchAgain').css('display') == 'none') {
					clutil.setFocus($('#ca_srch'));
				} else {
					clutil.setFocus($('#searchAgain'));
				}
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			if (this.$('#ca_srchArea').css('display') == 'none') {
				this.srchAreaCtrl.show_srch();
				$("#searchAgain").text('検索条件を閉じる');
				$("#searchAgain").fadeIn();
			} else {
				this.srchAreaCtrl.show_result();
				$("#searchAgain").text('検索条件を開く');
			}
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex, e) {
			if($(e.currentTarget).find('select').length > 0){
				return;
			}

			var url = clcom.appRoot + '/AMEQ/AMEQV0120/AMEQV0120.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					btnId: e.target.id,
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMEPV0020GetReq,
					selectedIds: [],
					chkData: [],
				};
				destData = {
					opeTypeId: rtyp,
					srchDate: this.savedReq.srchDate,
					chkData: [],
				};
			}else{
				// 検索結果が無い場合
				myData = {
					btnId: e.target.id,
					savedReq: null,
					savedCond: this.srchCondView.serialize(),
					selectedIds: [],
					chkData: [],
				};
				destData = {
					opeTypeId: rtyp
				};
			}

			var pushPageOpt = {
				url		: url,
				args	: destData,
				saved	: myData,
			};

			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				// データが無くても可
				clcom.pushPage(pushPageOpt);
				break;

//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
//				var lastClickedRec = this.recListView.getLastClickedRec();
//				if(_.isEmpty(lastClickedRec)){
//					// 最後にクリックした行データがとれなかった
//					console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
//					return;
//				}
//				destData.chkData = [ lastClickedRec ];
//				pushPageOpt.newWindow = true;
//				// fall through

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:	// 複製
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
				// チェックされたデータが必要（１）
				// fall through
				if(destData.chkData && destData.chkData.length >= 2){
					// 複数行選択されている		-- そもそもボタンを押せなくしているのでありえない
					console.warn('rtyp[' + rtyp + ']: '
							+ selectedRows.length + ' items selected, but single select only.');
					return;
				}
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
				// チェックされたデータが必要（Ｎ）
				if(_.isEmpty(destData.chkData)){
					// 行選択がない				-- そもそもボタンを押せなくしている
					console.warn('rtyp[' + rtyp + ']: item not specified.');
					return;
				}

				clcom.pushPage(pushPageOpt);
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
				break;

			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;

			}
		},

		setReadOnlyAllItems: function(){
			if (typeof this.grid != 'undefined'){
				this.grid.setEditable(false);
			}

			clutil.viewReadonly($("#ca_srchArea"));
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex) {
			var req = {
				srchUnitID	:0,
				srchYear	:0,
				srchPeriodType	:0,
				validNumberFlag: 0,
			};

			// 遷移パラメーターチェック
		    if (!_.isEmpty(this.options.chkData)) {
		    	if (this.options.chkData.length > 0) {
		    		var chkData = this.options.chkData[0];
		    		var srchCond = this.options.srchCond;

		    		req.srchUnitID = srchCond.srchUnitID;
		    		req.srchYear = srchCond.srchYear;
		    		req.srchPeriodType = srchCond.srchPeriodType;

		    		if (chkData.targetEnabled){
		    			req.validNumberFlag = 1;
		    		}

		    		if (chkData.areaCode == "" && chkData.storeCode == ""){
		    			// ゾーン指定で遷移してきた場合
		    			req.srchOrgID = chkData.orgID;

		    			req.AMPAV0010_org_id = chkData.orgID;
		    			req.AMPAV0010_org_code = chkData.zoneCode;
		    			req.AMPAV0010_orgname = chkData.zoneName;
		    			req.AMPAV0010_attr = Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID'));

		    		} else if (chkData.areaCode != "" && chkData.storeCode == ""){
		    			// エリア指定で遷移してきた場合
		    			req.srchOrgID = chkData.orgID;

		    			req.AMPAV0010_org_id = chkData.orgID;
		    			req.AMPAV0010_org_code = chkData.areaCode;
		    			req.AMPAV0010_orgname = chkData.areaName;
		    			req.AMPAV0010_attr = Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID'));

		    		} else {
		    			// 店舗指定で遷移してきた場合
		    			req.srchOrgID = chkData.orgID;

		    			req.AMPAV0010_org_id = chkData.orgID;
		    			req.AMPAV0010_org_code = chkData.storeCode;
		    			req.AMPAV0010_orgname =  chkData.storeName;
		    			req.AMPAV0010_attr = Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'));
		    		}

		    		req.AMPAV0010_func_id = Number(clcom.getSysparam('PAR_AMMS_HD_LEVELID'));
		    		req.srchStoreType = chkData.existFlag == 1 ? 2 : 1;
		    	}
		    }

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMEPV0020GetReq: req,
				// 更新リクエスト
				AMEPV0020UpdReq: {},
			};

			this.tempSrchReq = getReq;

			return {
				resId: clcom.pageId,	//'AMEPV0020',
				data: getReq,
			};
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			var data = args.data;

			// 他画面からの呼出はこのメソッドが使用される。
			// 自画面からの起動はdoSrchに行く。

			switch(args.status){
			case 'OK':
				// 検索条件を復元する
				var req = this.tempSrchReq.AMEPV0020GetReq;

				this.srchCondView.deserialize(req);

				var orgParam =  {
					id			: req.AMPAV0010_org_id,
					code		: req.AMPAV0010_org_code,
					name		: req.AMPAV0010_orgname,
					orglevel	: req.AMPAV0010_attr,
				};
				this.srchCondView.utl_org.setValue(orgParam);

				// 検索結果を表示する
				this.srchDoneProc(this.tempSrchReq, data);

				clutil.viewReadonly($("#ca_srchArea"));

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					break;
				default:
					break;
				}
				break;

			case 'DONE':		// 確定済
				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				break;

			default:
			case 'NG':			// その他エラー。
				this.srchFailProc(data);
				break;
			}
		},

		hasInputError: function(){
			var hasError = false;
			var hasWarn = false;
			var errCols = new Array();
			var warnCols = new Array();
			var keyHash = {};

			var buff = this.grid.getData();
			$.each(buff, function(){
				var key = this.accID + '_' + this.kind;
				keyHash[key] = this._cl_gridRowId;
			});

			$.each(this.dispData.body, function(){
				$.each(this.list.month, function(){
					$.each(this, function(){
						var rowId = keyHash[this.accID + '_operPlan'];

						if (this.month > 0) {
							var plan = '' + this.operPlanDisp;
							var checkValue = Number(plan.substring(plan.length - 1, plan.length));

							if (this.editable && this.rType == AMEPV0020_RTYPE.SALEAM) {
								if (checkValue != 0) {
									errCols.push({rowId:rowId, name: this.month + '_' + this.orgID});
									hasError = true;
								}
							}
						}

						if (this.rType == AMEPV0020_RTYPE.OPERPAM) {
							if (this.operPlanDisp < 0) {
								warnCols.push({rowId:rowId, name: this.month + '_' + this.orgID});
								hasWarn = true;
							}
						}
					});
				});
			});

			if (hasError){
				var msg =  clmsg.EEP0001;
				if (!msg){
					msg = "下一桁は0で入力して下さい";
				}

				$.each(errCols, function(){
					mainView.grid.setCellMessage(this.rowId, this.name, 'error', msg);
				});
			}

			if (hasWarn){
				var msg =  '';
				if (!msg){
					msg = "営業利益がマイナスです";
				}

				$.each(warnCols, function(){
					mainView.grid.setCellMessage(this.rowId, this.name, 'warn', msg);
				});
			}

			return {hasError:hasError, hasWarn:hasWarn,};
		},

		createUpdReq: function(){
			// Rec を構築する。
			var cellRecs = [];
			$.each(this.dispData.body, function(){
				$.each(this.list.month, function(){
					$.each(this, function(){
						if (this.month != 0 && (this.orgID != 0 && this.orgID != 1) && this.accID != AIM_KEY){
							var rec = {
								accID			: this.accID,
								orgID			: this.orgID,
								month			: this.month,
								operPlan		: this.operPlan,
								operPlanRate	: this.operPlanRate,
								scPlan			: this.scPlan,
								scPlanRate		: this.scPlanRate,
								prevAm			: this.prevAm,
								prevAmRate		: this.prevAmRate,
								prevRate		: this.prevRate,
								prev2Am			: this.prev2Am,
								prev3Am			: this.prev3Am,
								fInput			: this.fInput,
							};

							cellRecs.push(rec);
						}
					});
				});
			});

			var targetAm = 0;
			if (this.dispData.aimAvailable){
				targetAm = this.dispData.body[0].list.month['0'][0].operPlan;
			}

			var req = {
				srchUnitID		: this.savedReq.AMEPV0020GetReq.srchUnitID,
				srchOrgID		: this.savedReq.AMEPV0020GetReq.srchOrgID,
				srchYear		: this.savedReq.AMEPV0020GetReq.srchYear,
				srchPeriodType	: this.savedReq.AMEPV0020GetReq.srchPeriodType,
				srchStoreType	: this.savedReq.AMEPV0020GetReq.srchStoreType,
				targetAm		: targetAm,
				rawRecs			: this.savedRsp.rawRecs,
				colRecs			: this.savedRsp.colRecs,
				cellRecs		: cellRecs,
			};

			return req;
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			var confirm =  '';

			if(!this.validator.valid()) {
				return null;
			}

			this.grid.stopEditing();
			var checkResult = this.hasInputError();

			if(checkResult.hasError) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return null;

			} else if(checkResult.hasWarn){
				confirm = "営業利益がマイナスの店舗があります。登録しますか？";
			}

			// opeTypeを設定する
			var fixedOpeTypeId;
			if (opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				fixedOpeTypeId = mainView.opeTypePatch[0];
				operationName = this.submitBtn1.text();
			} else {
				fixedOpeTypeId = mainView.opeTypePatch[1];
				operationName = this.submitBtn2.text();
			}

			var req = this.createUpdReq();

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: fixedOpeTypeId,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMEPV0020GetReq: this.savedReq.AMEPV0020GetReq,
				// 更新リクエスト
				AMEPV0020UpdReq: req
			};

			var ret ={
				resId	: clcom.pageId,	//'AMBPV0020',
				data	: updReq,
			};

			if (confirm != ''){
				ret.confirm = confirm;
			}

//return null;
			return ret;
		},


		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

			// 確定時用のデータを初期化
			this.savedReq = null;

			if (typeof this.grid != 'undefined'){
				this.grid.clear();
			}
		},

		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(model) {
			// 条件部の復元
			if(!_.isEmpty(model.savedCond)){
				this.srchCondView.deserialize(model.savedCond);
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}

		},

		setSubmitLabel: function(enabled){
			var ENABLED_TRUE = enabled;

			var btnLabel = new Array();
			var btnEnabled = new Array();

			this.opeTypePatch = new Array();

			if (opeTypeKind >= TYPE_KIND.KEISEN) {
				// 経戦
				btnLabel = ['差戻し', '承認'];

				if (typeof this.savedReq != 'undefined' && this.savedReq != null &&
					typeof this.savedReq.AMEPV0020GetReq != 'undefined' && this.savedReq.AMEPV0020GetReq != null &&
					this.savedReq.AMEPV0020GetReq.validNumberFlag == 1) {

					btnLabel = ['登録', ''];
					mainView.submitBtn1.parent().css('width', '100%');
					mainView.submitBtn2.parent().css('width', '0%');
					mainView.submitBtn2.hide();

					this.opeTypePatch =
						[am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
						 am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD];

					btnEnabled = [ENABLED_TRUE, ENABLED_TRUE];

				} else {
					mainView.submitBtn1.parent().css('width', '50%');
					mainView.submitBtn2.parent().css('width', '50%');
					mainView.submitBtn1.show();
					mainView.submitBtn2.show();

					this.opeTypePatch =
						[am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK,
						 am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL];

					btnEnabled = [ENABLED_TRUE, ENABLED_TRUE];

					if (typeof this.dispData != 'undefined' && this.dispData != null){

						if (this.dispData.status == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_KEISEN) {
							btnEnabled = [false, ENABLED_TRUE];
							btnLabel = ['差戻し', '登録'];

							this.opeTypePatch =
								[am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK,
								 am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE];

						}else if (this.dispData.status == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET || this.dispData.status == 0) {
							btnEnabled = [false, false];
						}
					}else{
						btnEnabled = [false, false];
					}
				}


			} else if (opeTypeKind == TYPE_KIND.ZONE_AJA) {
				// ゾーンAJA
				btnLabel = ['一時保存', '申請'];

				this.opeTypePatch =
					[am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE,
					 am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY];

				if (typeof this.dispData != 'undefined' && this.dispData != null){
					// 編集対象：未申請、申請中、エリアAJA承認
					if (this.dispData.status == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET ||
						this.dispData.status == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_YET ||
						this.dispData.status == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_AREA ||
						this.dispData.status == 0) {
						btnEnabled = [ENABLED_TRUE, ENABLED_TRUE];
					}
				}else{
					btnEnabled = [false, false];
				}
			} else if (opeTypeKind == TYPE_KIND.AREA_AJA) {
				// エリアAJA
				btnLabel = ['一時保存', '申請'];
				mainView.submitBtn1.parent().css('width', '100%');
				mainView.submitBtn2.parent().css('width', '0%');
				mainView.submitBtn2.hide();

				this.opeTypePatch =
					[am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE,
					 am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY];

				if (typeof this.dispData != 'undefined' && this.dispData != null){
					// 編集対象：未申請
					if (this.dispData.status == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET ||
						this.dispData.status == 0) {
						btnEnabled = [ENABLED_TRUE, ENABLED_TRUE];
					}
				}else{
					btnEnabled = [false, false];
				}
			}

			this.submitBtn1.text(btnLabel[0]);
			this.submitBtn2.text(btnLabel[1]);
			this.setBtnEnabled(this.submitBtn1, btnEnabled[0]);
			this.setBtnEnabled(this.submitBtn2, btnEnabled[1]);
		},

		setBtnEnabled: function($btn, enabled){
			if(enabled){
				$btn.removeAttr('disabled').parent().removeClass('disable');
			}else{
				$btn.attr('disabled','disabled').parent().addClass('disable');
			}
		},

		setDispValue: function(tgt, kind, value){
			var ret = 0;

			if (kind == 'operPlan'){
				if (value != null){
					tgt.operPlanPrev = tgt.operPlan;
					tgt.operPlanDisp = value;
					if (tgt.rType == AMEPV0020_RTYPE.PROFITRT || tgt.rType == AMEPV0020_RTYPE.OPERPRT){
						tgt.operPlan = value * 10;
					}else{
						tgt.operPlan = value * 1000;
						tgt.prevRate = getPercentValue(tgt.operPlan, tgt.prevAm);
					}
				}
				ret = tgt.operPlanDisp;
			} else if (kind == 'operPlanRate'){
				if (value != null){
					tgt.operPlanRate = value;
				}
				ret = tgt.operPlanRate;
			} else if (kind == 'scPlan'){
				if (value != null){
					tgt.scPlanDisp = value;
					tgt.scPlan = value * 1000;
				}
				ret = tgt.scPlanDisp;
			} else if (kind == 'scPlanRate'){
				if (value != null){
					tgt.scPlanRate = value;
				}
				ret = tgt.scPlanRate;
			} else if (kind == 'prev3Am'){
				if (value != null){
					tgt.prev3AmDisp = value;
					tgt.prev3Am = value * 1000;
				}
				ret = tgt.prev3AmDisp;
			} else if (kind == 'prev2Am'){
				if (value != null){
					tgt.prev2AmDisp = value;
					tgt.prev2Am = value * 1000;
				}
				ret = tgt.prev2AmDisp;
			} else if (kind == 'prevAm'){
				if (value != null){
					tgt.prevAmDisp = value;
					tgt.prevAm = value * 1000;
				}
				ret = tgt.prevAmDisp;
			} else if (kind == 'prevAmRate'){
				if (value != null){
					tgt.prevAmRate = value;
				}
				ret = tgt.prevAmRate;
			} else if (kind == 'prevRate'){
				if (value != null){
					tgt.prevRate = value;
				}
				ret = tgt.prevRate;
			}

			return Number(ret);
		},

		_eof: 'AMEPV0020.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView(clcom.pageArgs).initUIElement().render();

		$("#mainColumnFooter p.right").hide();
		$("#mainColumnFooter p.left").hide();

		// ボタンをビューに保存する
		var $submit = $('#mainColumnFooter').find('.cl_submit');
		var filterProc = function($obj, opeTypeId) {
			return ($obj.data().opetypeid==opeTypeId) ? $obj : null;
		};

		mainView.submitBtn1 = $submit.filter(function(){
			return filterProc($(this), am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW);
		});
		mainView.submitBtn2 = $submit.filter(function(){
			return filterProc($(this), am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
		});

		// 登録ボタン表示設定
		mainView.setSubmitLabel(false);

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
		}

	}).fail(function(data){
		console.error('iniJSON failed.');
		console.log(arguments);

		// clcom のネタ取得に失敗。
		// 動かしようがないので、Abort 扱いとしておく？？？
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});
