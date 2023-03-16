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
	var DATA_TYPE = {
		STORE: 0,
		AREA_TOTAL: 1,
		ZONE_TOTAL: 2,
	};

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//遷移先指定
	var Dialog = Marionette.ItemView.extend({
		template: '#NewDialog',
		events: {

		},

		getEditType: function(){
			var radio = this.$("input:radio[name=ca_chgPage]:checked");
			return radio.val();
		},

		onShow: function(){
			clutil.initUIelement(this.$el);
		}
	});

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'change #ca_srchUnitID'			:	'_onSrchUnitChanged',	// 事業ユニットが変更された
			'click #ca_btn_org_select'		:	'_onOrgSelClick',
			'click #ca_srch'				:	'_onSrchClick',			// 検索ボタン押下時
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

			this.prevUnitId = clcom.userInfo.unit_id;

			// 年度
			clutil.clyearselector(this.$("#ca_srchYear"), 0, clutil.getclsysparam('PAR_AMCM_YEAR_FROM'), 2, "年度");
			this.init_ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');

			// 対象期:予算対象区分
			clutil.cltypeselector(this.$("#ca_srchPeriodType"), amcm_type.AMCM_TYPE_BGT_PERIOD, 1);

			// 状態:営業計画承認状態区分
			clutil.cltypeselector(this.$("#ca_srchStatus"), amcm_type.AMCM_TYPE_OPER_PLAN_APPROVE, 1);

			// 組織
			this.orgAutocomplete = this.getOrg(clcom.userInfo.unit_id);

			// 初期値セット
			this.deserialize({
				srchUnitID		: (clcom.userInfo) ? clcom.userInfo.unit_id : 0,	// 事業ユニットID
				srchYear		: this.init_ope_year,		// 年度
				srchPeriodType	: 0,						// 対象期
				srchStatus		: 0,						// 状態
			});

			var tgtView = this;
			this.utl_unit.done(function() {
				// 初期活性制御
				tgtView.setDefaultEnabledProp();

				// 初期フォーカス設定
				clutil.setFocus(tgtView.$tgtFocus);
			});

			// 組織部品
			this.AMPAV0020Selector = new AMPAV0020SelectorView({
				el: $("#ca_AMPAV0020_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});

			this.AMPAV0020Selector.render();
		},

		render: function(){
			return this;
		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			var dto = clutil.view2data(this.$el);
			return dto;
		},

		/**
		 * 検索リクエストパケットの設定値を UI へセットする。
		 */
		deserialize: function(obj){
			this.deserializing = true;
			try{
				var dto = _.extend({}, obj);
				clutil.data2view(this.$el, dto);

				var callback = this._onSrchUnitChanged;
				this.utl_unit.done(function() {callback();});
			}finally{
				this.deserializing = false;
			}
		},

		setDefaultEnabledProp: function() {
			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS){
				if (clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.viewReadonly($("#div_ca_srchUnitID"));
					this.$tgtFocus = $('#ca_srchOrgID');
				}
			}

			if (clcom.userInfo.user_typeid== amcm_type.AMCM_VAL_USER_STORE ||
				clcom.userInfo.user_typeid== amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.viewReadonly($("#div_ca_org"));
				$("#div_ca_unitID").hide();
				this.$tgtFocus = $('#ca_srchYear');
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
		isValid: function(){
			return this.validator.valid();
		},

		/**
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}

			var unitID = ~~$('#ca_srchUnitID').val();

			if (unitID == '0'){
				clutil.inputReadonly("#ca_srchOrgID");
				clutil.inputReadonly("#ca_btn_org_select");
			}else{
				if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE &&
					clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN){
					clutil.inputRemoveReadonly("#ca_srchOrgID");
					clutil.inputRemoveReadonly("#ca_btn_org_select");
				}
			}

			if (unitID == '0' || unitID != this.prevUnitId){
				this.orgAutocomplete.resetValue();
			}

			this.prevUnitId = unitID;
		},

		/**
		 * 組織オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: '#ca_srchOrgID',
				dependAttrs : function(item) {
					var p_org_id = $('#ca_srchUnitID').val();
					var s_org_id = 0;
					if (clcom.userInfo.org_kind_typeid == amcm_type.AMCM_VAL_ORG_KIND_ZONE) {
						p_org_id = s_org_id = clcom.userInfo.org_id;
					}
					return {
						orgfunc_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						p_org_id	: p_org_id,
						s_org_id	: s_org_id,
					};
				}
			});
		},

		/**
		 * 組織［参照］ボタンクリック
		 */
		_onOrgSelClick: function(e){
			var _this = this;
			var r_org_id = Number($("#ca_srchUnitID").val());
			//if (clcom.userInfo.permit_top_org_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
			//	r_org_id = clcom.userInfo.permit_top_org_id;
			//}
			if (clcom.userInfo.org_kind_typeid == amcm_type.AMCM_VAL_ORG_KIND_ZONE) {
				r_org_id = clcom.userInfo.org_id;
			}

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

					_this.orgAutocomplete.setValue(orgParam);
					mainView.validator.clearErrorMsg($('#ca_srchOrgID'));
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
			// 取引先コード・オートコンプリート設定チェック
			if(!this.isValid()){
				return;
			}

			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMEPV0010.SrchCondView//'
	});


	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'			: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
		},

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
					title: '予算調整',
					subtitle: '一覧',
					btn_submit: true,
					btn_new: false,
					btn_cancel: {label:'条件再設定', action:this._doCancel},
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 承認設定を取得
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE){
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

			// アプリ個別の View や部品をインスタンス化するとか・・・
			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);		// 検索ボタン押下イベント
			clutil.mediator.on('onOperation', this._doOpeAction);	// OPE系イベント

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			}

			console.log(clcom.userInfo.approve_list);
		},

		initGrid:function(){
			this.grid = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid',	// エレメント
				lineno			: false,			// 行番号表示する/しないフラグ。
				delRowBtn		: false,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: false,			// フッター部の新規行追加ボタンを使用するフラグ。
			});

			this.grid.getMetadata = this.getMetadata;
			this.listenTo(this.grid, this.gridEvents);

			this.grid.render();
		},

		getMetadata: function(rowIndex){
			var data = this.gridData[rowIndex];
			var ret = null;

			if (data.dataType != DATA_TYPE.STORE){
				ret = {
					cssClasses: 'reference',
				};
			}

			return ret;
		},

		createGridData: function(){

			this.columns =
			[
			 	{
			 		id		: 'newStore',
			 		name	: '新店',
			 		field	: 'newStore',
			 		width	: 80,
			 		cssClass: 'csptr txtac',
				},
			 	{
			 		id		: 'zoneName',
			 		name	: '地区',
			 		field	: 'zoneName',
			 		width	: 180,
			 		cssClass: 'csptr',
				},
			 	{
			 		id		: 'areaName',
			 		name	: 'ゾーン',
			 		field	: 'areaName',
			 		width	: 180,
			 		cssClass: 'csptr',
				},
			 	{
			 		id		: 'storeName',
			 		name	: '店舗',
			 		field	: 'storeName',
			 		width	: 240,
			 		cssClass: 'csptr',
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = value;
							if (typeof options.dataContext != 'undefined' && options.dataContext.dataType == DATA_TYPE.STORE){
								disp = options.dataContext.storeCode + ':' + value;
							}
							return disp;
						},
					},
				},
			 	{
			 		id		: 'targetProfitAmDisp',
			 		name	: '営業利益目標',
			 		field	: 'targetProfitAmDisp',
			 		width	: 140,
					cssClass: 'txtalign-right csptr',
					cellType:
					{
						formatFilter	: "comma",
					},
				},
			 	{
			 		id		: 'profitAmDisp',
			 		name	: '営業利益',
			 		field	: 'profitAmDisp',
			 		width	: 140,
					cssClass: 'txtalign-right csptr',
					cellType:
					{
						formatFilter	: "comma",
					},
				},
			 	{
			 		id		: 'approveStatusDisp',
			 		name	: '承認状態',
			 		field	: 'approveStatusDisp',
			 		width	: 160,
			 		cssClass: 'csptr',
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = value;
							if (typeof options.dataContext != 'undefined' && options.dataContext.dataType != DATA_TYPE.STORE){
								disp = '';
							}
							return disp;
						},
					},
				},

		 	];

			// 経戦以外は承認を使えないようにする
			if (opeTypeKind == TYPE_KIND.KEISEN){
				this.columns.push({
					id		: 'approve',
					name	: '承認',
					field	: 'approve',
					width	: 100,
					cellType: {
						type: 'cltypeselector',

						formatter: function(value, options)
						{
							var data = options.dataContext;
							var zoneKey = data.zoneCode;
							var areaKey = data.zoneCode + '_' + data.areaCode;

							var zoneCheck = (data.dataType == DATA_TYPE.ZONE_TOTAL)
								&& (data.checkCounter[zoneKey] != null && data.checkCounter[zoneKey] > 0);
							var areaCheck = (data.dataType == DATA_TYPE.AREA_TOTAL)
								&& (data.checkCounter[areaKey] != null && data.checkCounter[areaKey] > 0);

							var typenamelist = clutil.gettypenamelist(amcm_type.AMCM_TYPE_DO_APPROVAL);

							var item = _.find(typenamelist, function(item){
								return item.type_id === parseInt(value, 10);
							});

							if (_.isUndefined(item)) {
								if (data.dataType == DATA_TYPE.STORE && data.approveStatus == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET){
									return;
								}else if (data.dataType == DATA_TYPE.STORE && data.approveStatus < amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_KEISEN){
									return;
								}else if (data.dataType == DATA_TYPE.AREA_TOTAL && areaCheck){
									return;
								}else if (data.dataType == DATA_TYPE.AREA_TOTAL && data.fmtCheckCounter[areaKey] > 0){
									return;
								}else if (data.dataType == DATA_TYPE.ZONE_TOTAL && zoneCheck){
									return;
								}else if (data.dataType == DATA_TYPE.ZONE_TOTAL && data.fmtCheckCounter[zoneKey] > 0){
									return;
								}else{
									return '承認済';
								}

								return;
							}

							var label = '';
							label = _.escape(item.code) + ":" + _.escape(item.name);

							return label;
						},

						editorOptions: function(data){
							var options = {
								kind: amcm_type.AMCM_TYPE_DO_APPROVAL,
							};
							if (data.dataType != DATA_TYPE.STORE) {
								options.ids = [amcm_type.AMCM_VAL_DO_APPROVAL_OK];
							}

							return options;
						},

						isEditable: function(item){
							var zoneKey = item.zoneCode;
							var areaKey = item.zoneCode + '_' + item.areaCode;

							if (item.dataType == DATA_TYPE.AREA_TOTAL){
								console.log('xxx');
							}

							var zoneCheck = (item.dataType == DATA_TYPE.ZONE_TOTAL && item.zoneEnabled)
								&& (item.checkCounter[zoneKey] != null && item.checkCounter[zoneKey] > 0);
							var areaCheck = (item.dataType == DATA_TYPE.AREA_TOTAL && item.areaEnabled)
								&& (item.checkCounter[areaKey] != null && item.checkCounter[areaKey] > 0);
							var storeCheck = false;

							if (item.dataType == DATA_TYPE.STORE && item.approveStatus > amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET){
								if (opeTypeKind == TYPE_KIND.KEISEN){
									if(item.approveStatus < amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_KEISEN){
										storeCheck = true;
									}
								} else if (opeTypeKind == TYPE_KIND.ZONE_AJA){
									if(item.approveStatus < amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_ZONE){
										storeCheck = true;
									}
								} else if (opeTypeKind == TYPE_KIND.AREA_AJA){
									if(item.approveStatus < amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_AREA){
										storeCheck = true;
									}
								}
							}

							if (storeCheck || areaCheck || zoneCheck){
								return true;
							}else{
								return false;
							}
						},
					},
				});
			}

		},

		gridEvents:{
			'click:cell' : function(target, args){
				if (args.row > 0 && args.cell != 6){
					var rowIndex = Number(args.row - 1);
					var rowData = this.gridData[rowIndex];
					this._doOpeAction(am_proto_defs.AM_PROTO_COMMON_RTYPE_REL, 0, rowData);
				}
			},
			'cell:change':  function(args){
				var id = args.column.id;
				var rowIndex = Number(args.row - 1);
				var rowData = this.gridData[rowIndex];
				var dataType = rowData.dataType;
				var zoneCD = rowData.zoneCode;
				var areaCD = rowData.areaCode;
				var val = args.item[id];

				if (dataType > DATA_TYPE.STORE){

					if (val > 1){
						val = 0;
						args.item[id] = val;
					}

					var approve = rowData.approve;
					var prevApprove = rowData.prevApprove;

					if (approve == prevApprove){
						return;
					}else{
						rowData.prevApprove = rowData.approve;
					}

					var checkStatus = amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET;
					if (opeTypeKind == TYPE_KIND.KEISEN){
						checkStatus = amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_KEISEN;
					} else if (opeTypeKind == TYPE_KIND.ZONE_AJA){
						checkStatus = amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_ZONE;
					} else if (opeTypeKind == TYPE_KIND.AREA_AJA){
						checkStatus = amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_AREA;
					}

					$.each(this.gridData, function(){
						var approveStatus = this.approveStatus;
						var chkDataType = this.dataType;
						var chkZoneCD = this.zoneCode;
						var chkAreaCD = this.areaCode;

						if (approveStatus != amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET){
							if (dataType == DATA_TYPE.AREA_TOTAL) {
								if (chkDataType == DATA_TYPE.STORE && chkZoneCD == zoneCD && chkAreaCD == areaCD && approveStatus < checkStatus){
									this.approve = val;
								}
							} else if (dataType == DATA_TYPE.ZONE_TOTAL) {
								if (chkDataType == DATA_TYPE.STORE && chkZoneCD == zoneCD && approveStatus < checkStatus){
									this.approve = val;
								}
								if (chkDataType == DATA_TYPE.AREA_TOTAL && chkZoneCD == zoneCD){
									var areaKey = this.zoneCode + '_' + this.areaCode;
									if (this.checkCounter[areaKey] != null && this.checkCounter[areaKey] > 0){
										this.approve = val;
									}
								}
							}
						}
					});
				}

				this.grid.grid.invalidate();
			},
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

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			this.setInitializeValue();

			// 初期フォーカス設定
			clutil.setFocus($('#ca_srchUnitID'));

			return this;
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

				this.srchCondView.orgAutocomplete.setValue(orgParam);
			}
		},

		/**
		 * 画面描画
		 */
		render: function(){
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
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				if(this.srchCondView.isValid()){
					srchReq = this.srchCondView.serialize();
				}else{
					// メッセージは、srchConcView 側で出力済。
					return;
				}
			}

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
				AMEPV0010GetReq: srchReq
			};
			return req;
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行データ（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			this.clearResult();
			mainView.setSubmitEnable(false);

			var defer = clutil.postJSON('AMEPV0010', srchReq).done(_.bind(function(data){

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMEPV0010GetRsp.monthPlans;

				if(_.isEmpty(recs)){
					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					// 検索ペインを表示
					mainView.srchAreaCtrl.reset();
					return;
				}

				clutil.viewReadonly($("#ca_srchArea"));
				$("#searchAgain").text('検索条件を開く');

				var checkCounter = {};
				var fmtCheckCounter = {};

				$.each(recs,function(){
					// 表示は千円単位
					this.targetProfitAmDisp = Math.floor(this.targetProfitAm / 1000);
					this.profitAmDisp = Math.floor(this.profitAm / 1000);

					this.prevApprove = this.approve;
					this.approveStatusDisp = clutil.gettypename(amcm_type.AMCM_TYPE_OPER_PLAN_APPROVE, this.approveStatus);

					var zoneEnabled = false;
					var areaEnabled = false;

					if (_.isEmpty(this.storeCode)){
						if (_.isEmpty(this.areaCode)){
							// ゾーン計
							this.dataType = DATA_TYPE.ZONE_TOTAL;

							if (opeTypeKind == TYPE_KIND.KEISEN){
								zoneEnabled = true;
							} else if (opeTypeKind == TYPE_KIND.ZONE_AJA){
								// 担当のゾーンなら一括承認可
								if (clcom.userInfo.org_code == this.zoneCode){
									zoneEnabled = true;
								}
							}
						}else{
							// エリア計
							this.dataType = DATA_TYPE.AREA_TOTAL;

							if (opeTypeKind == TYPE_KIND.KEISEN){
								areaEnabled = true;
							} else if (opeTypeKind == TYPE_KIND.AREA_AJA){
								// 担当のエリアなら一括承認可
								if (clcom.userInfo.org_code == this.areaCode){
									areaEnabled = true;
								}
							}else if (opeTypeKind == TYPE_KIND.ZONE_AJA){
								// 担当のゾーンなら一括承認可
								if (clcom.userInfo.org_code == this.zoneCode){
									areaEnabled = true;
								}
							}
						}
					}else{
						// 店舗
						this.dataType = DATA_TYPE.STORE;

						var zoneKey = this.zoneCode;
						var areaKey = this.zoneCode + '_' + this.areaCode;

						if (checkCounter[zoneKey] == null){
							checkCounter[zoneKey] = 0;
						}
						if (checkCounter[areaKey] == null){
							checkCounter[areaKey] = 0;
						}

						if (fmtCheckCounter[zoneKey] == null){
							fmtCheckCounter[zoneKey] = 0;
						}

						if (fmtCheckCounter[areaKey] == null){
							fmtCheckCounter[areaKey] = 0;
						}

						if (this.approveStatus > amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET &&
							this.approveStatus < amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_KEISEN){
							checkCounter[zoneKey]++;
							checkCounter[areaKey]++;
						}

						if (this.approveStatus == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET){
							fmtCheckCounter[zoneKey]++;
							fmtCheckCounter[areaKey]++;
						}
					}

					this.zoneEnabled = zoneEnabled;
					this.areaEnabled = areaEnabled;
					this.opeTypeKind = opeTypeKind;
					this.checkCounter = checkCounter;
					this.fmtCheckCounter = fmtCheckCounter;
				});

				this.getRsp = data.AMEPV0010GetRsp;

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// フォーカスの設定
				if(typeof $focusElem != 'undefined') {
					this.resetFocus($focusElem);
				}

				// 登録ボタン活性制御
				mainView.setSubmitEnable(true);

				this.createGridData();
				this.initGrid();

				this.gridData = recs;

				var gridParam = {
					gridOptions		: {},				// データグリッドのオプション
					columns			: this.columns,		// カラム定義
					data			: this.gridData,	// データ
				};

				this.grid.setData(gridParam);

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
			}, this)).fail(_.bind(function(data){

				// 検索ペインを表示
				this.srchAreaCtrl.reset();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				// フォーカスの設定
				if(typeof $focusElem != 'undefined') {
					this.resetFocus($focusElem);
				}

			}, this));

			return defer;
		},

		setApprove : function($tr){
			return $tr

			.find('select[name="ca_approve"]')
			.each(function(){
				var selector = clutil.cltypeselector(this, amcm_type.AMCM_TYPE_DO_APPROVAL);
				var chkVal = this.getAttribute('chkVal');
				selector.setValue(chkVal);
				mainView.approve.push(selector);
			}).end();
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);
			req.AMEPV0010GetReq.org = mainView.srchCondView.orgAutocomplete.getValue();

			// 検索実行
			this.doSrch(req);
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
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){
			this.srchAreaCtrl.show_srch();
			$("#searchAgain").fadeOut();

			// 検索条件部を活性化する
			clutil.viewRemoveReadonly($("#ca_srchArea"));

			//※ this.srchCondView.init_ope_year = $('#ca_srchYear').val();

			// 検索条件初期化
			//※ this.srchCondView.deserialize({
			//※ 	srchUnitID		: clcom.userInfo.unit_id,			// 事業ユニットID
			//※ 	srchYear		: this.srchCondView.init_ope_year,	// 年度
			//※ 	srchPeriodType	: 0,								// 対象期
			//※ 	srchStatus		: 0,								// 状態
			//※ });

			//※ this.setInitializeValue();
			this.srchCondView.setDefaultEnabledProp();
			//※ this.srchCondView.prevUnitId = clcom.userInfo.unit_id;
			//※ this.srchCondView._onSrchUnitChanged();
			//※ 初期値に戻す場合はコメントを外す

			clutil.setFocus(this.srchCondView.$tgtFocus);

			// 検索結果クリア
			this.srchAreaCtrl.reset();

			// フッターボタン活性制御
			this.mdBaseView.setSubmitEnable(false);
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧画面では使用しない*/, e){
			var url = clcom.appRoot + '/AMEP/AMEPV0020/AMEPV0020.html';

			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合

				var selectedIds = {};
				myData = {
					btnId		: null,//e.target.id,
					savedReq	: this.savedReq,
					savedCond	: this.savedReq.AMEPV0010GetReq,
					selectedIds	: selectedIds,
					chkData		: [],
				};
				destData = {
					opeTypeId	: rtyp,
					srchDate	: this.savedReq.srchDate,
					srchCond	: this.savedReq.AMEPV0010GetReq,
					chkData		: [],
				};
			}else{
				// 検索結果が無い場合
				myData = {
					btnId		: e.target.id,
					savedReq	: null,
					savedCond	: this.srchCondView.serialize(),
					selectedIds	: [],
					chkData		: [],
				};
				destData = {
					opeTypeId	: rtyp
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

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				var lastClickedRec = e;//this.recListView.getLastClickedRec();
				if(_.isEmpty(lastClickedRec)){
					// 最後にクリックした行データがとれなかった
					console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
					return;
				}

				destData.chkData = [ lastClickedRec ];
				destData.chkData[0].targetEnabled = false;

				myData.chkData = destData.chkData;

				if (opeTypeKind >= TYPE_KIND.KEISEN && destData.chkData[0].dataType == DATA_TYPE.ZONE_TOTAL){
					var dialog = new Dialog();
					dialog.render();
					clutil.initUIelement(dialog.$el);
					clutil.ConfirmDialog(dialog.el, function(dialog){
						console.log('OK', arguments);
						try{
							if(dialog.getEditType() == 1){
								destData.chkData[0].targetEnabled = false;

							}else if(dialog.getEditType() == 2){
								destData.chkData[0].targetEnabled = true;

							}else{
								return;
							}

							clcom.pushPage(pushPageOpt);

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
				} else {
					clcom.pushPage(pushPageOpt);
				}

				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:	// 複製
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消

				if(destData.chkData && destData.chkData.length >= 2){
					// 複数行選択されている		-- そもそもボタンを押せなくしているのでありえない
					console.warn('rtyp[' + rtyp + ']: '
							+ selectedRows.length + ' items selected, but single select only.');
					return;
				}
				// fall through

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
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

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			switch(args.status){
			case 'OK':
				// TODO: args.data をアプリ個別 View へセットする。

				// TODO: 編集状態を設定する。

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					break;
				default:
					break;
				}
				break;

			case 'DONE':		// 確定済
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				break;

			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				break;
			}
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log("opeTypeId:" + opeTypeId);

			this.grid.stopEditing();
			var buff = this.grid.getData();

			if(buff.length == 0) {
				return null;
			}

			// Reqを構築する。
			var monthPlans = [];

			$.each(buff,function(){
				if (this.dataType == DATA_TYPE.STORE){
					monthPlans.push({
						approve			: this.approve,
						approveStatus	: this.approveStatus,
						orgID			: this.orgID,
						profitAm		: this.profitAm,
						targetProfitAm	: this.targetProfitAm,
					});
				}
			});

			if(monthPlans.length == 0) {
				return null;
			}

			this.validator.clear();

			if(!this.validator.valid()) {
				return null;
			}

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 予算調整一覧検索リクエスト
				AMEPV0010GetReq: this.savedReq.AMEPV0010GetReq,
				// 予算調整一覧更新リクエスト
				AMEPV0010UpdReq: {
					monthPlans	: monthPlans,
				}
			};
//return null;
			return {
				resId: clcom.pageId,	//'AMEPV0010',
				data: updReq
			};
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				this.setReadOnlyAllItems();
				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				break;
			}
		},

		setReadOnlyAllItems: function(){
			if (typeof this.grid != 'undefined'){
				this.grid.setEditable(false);
			}
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
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			}
		},

		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(model) {
			// 条件部の復元
			if(!_.isEmpty(model.savedCond)){
				this.srchCondView.deserialize(model.savedCond);

				this.srchCondView.utl_unit.done(function() {
					mainView.srchCondView.orgAutocomplete.setValue(model.savedCond.org);
				});
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}
		},

		/**
		 * 他ページからの遷移
		 * @param data
		 */
		load2: function(model) {
			if (!_.isEmpty(model.data)) {
				var unit = null;
				var unit_id = clcom.getUserData().unit_id;
				if(unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
						|| unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
					unit = unit_id;
				}

				var code = "";
				if (model.data.srchOrgCode.length > 0 && $.isNumeric(model.data.srchOrgCode.substr(0, 1))) {
					code = model.data.srchOrgCode;
				}
				var org  = {
					id: model.data.srchOrgID,
					code: code,
					name: model.data.srchOrgName,
				};
				var data = {
					srchUnitID: unit,
					srchOrgID: org,
					srchYear: model.data.srchYear,
					srchPeriodType: model.data.srchPeriodTypeID,
				};
				this.srchCondView.deserialize(data);
				this.srchCondView.utl_unit.done(function() {
					mainView.srchCondView.orgAutocomplete.setValue(org);
				});
				var req = this.buildReq(data);
				req.AMEPV0010GetReq.srchOrgID = org.id;
				this.doSrch(req);
			}
		},

		/**
		 * 「登録」/「削除」ボタンの活性/非活性を設定する
		 */
		setSubmitEnable: function(enable){
			if(enable){
				this.$('#mainColumnFooter .cl_submit').removeAttr('disabled').parent().removeClass('disable');
			}else{
				this.$('#mainColumnFooter .cl_submit').attr('disabled','disabled').parent().addClass('disable');
			}
		},

		_eof: 'AMEPV0010.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

		// フッターボタン活性状態制御
		mainView.mdBaseView.setSubmitEnable(false);

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
		} else if (clcom.pageArgs) {
			mainView.load2(clcom.pageArgs);
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
