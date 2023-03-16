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
			ALL_TOTAL: 3,
		};

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

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

			// 事業ユニット
			this.utl_unit = clutil.clbusunitselector({
				el: '#ca_srchUnitID',
				initValue: clcom.userInfo.unit_id,
			});

			this.prevUnitId = clcom.userInfo.unit_id;

			// 対象月 FIXME:暫定
			this.utl_month = clutil.clmonthselector(this.$('#ca_srchMonth'), 1, 1, 1, null, null, 1, null, 'd'); //TODO:初期表示調整(とりあえず前後1年)

			var date = clutil.ymd2date(clcom.getOpeDate());
			this.init_ope_month = '' + date.getFullYear() + ('0' + (date.getMonth() + 2)).slice(-2);	// FIXME 年月初期値

			// 組織
			this.utl_org = this.getOrg(clcom.userInfo.unit_id);

			// 初期値セット
			this.deserialize({
				srchUnitID	: clcom.userInfo.unit_id,	// 事業ユニットID
				srchMonth	: this.init_ope_month,		// 対象月
			});

			// 初期フォーカスオブジェクト設定
			this.$tgtFocus = $('#ca_srchUnitID');

			// 初期活性制御
			this.setDefaultEnabledProp();

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);

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

				var callback = this._onUnitChanged;
				this.utl_unit.done(function() {callback();});
			}finally{
				this.deserializing = false;
			}
		},

		setDefaultEnabledProp: function() {
			if (clcom.userInfo.user_typeid== amcm_type.AMCM_VAL_USER_STORE ||
				clcom.userInfo.user_typeid== amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.viewReadonly($("#div_ca_org"));
				$("#div_ca_unitID").hide();
				this.$tgtFocus = $('#ca_srchMonth');
			}

			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS
					/*&& clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_KEISEN*/){
				if (clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.viewReadonly($("#div_ca_srchUnitID"));
					this.$tgtFocus = $('#ca_srchMonth');

					if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_KEISEN) {
						$('#ca_org').addClass('required');
						$('#ca_AMPAV0010_orgname').addClass('cl_valid');
						$('#ca_AMPAV0010_orgname').addClass('cl_required');
					}
				}else{
					$('#ca_org').removeClass('required');
					$('#ca_AMPAV0010_orgname').removeClass('cl_valid');
					$('#ca_AMPAV0010_orgname').removeClass('cl_required');
				}
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
		 * 組織選択ボタン押下
		 */
		_onShowAMPAV0020Click: function(e) {
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

					_this.utl_org.setValue(orgParam);
					mainView.validator.clearErrorMsg($('#ca_AMPAV0010_orgname'));
				}

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
			if ($("#ca_srchArea").find('.cl_error_field').length > 0){
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return;
			}

			console.log(Number(clcom.getSysparam('PAR_AMBP_APPLY_CANCEL_DAYS')));

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
				this.utl_org.resetValue();
			}

			this.prevUnitId = unitID;
		},

		_eof: 'AMBPV0040.SrchCondView//'
	});


	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'	: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
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
					title: '店舗計画進捗確認',
					subtitle: '',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					btn_csv:false,
					btn_cancel: {label:'条件再設定', action:this._doCancel},
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseViewOpt = mdBaseViewOpt;

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

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);		// 検索ボタン押下イベント
			clutil.mediator.on('onOperation', this._doOpeAction);	// OPE系イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

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

			if (data.dataType != 0){
				ret = {
					cssClasses: 'reference',
				};
			}else{
				 if (data.approveStatus == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET){
					ret = {
						cssClasses: 'errorCell',
					};
				 }else if (data.approveStatus == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_YET){
					ret = {
						cssClasses: 'alertCell',
					};
				 }
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
			 		//cssClass: 'csptr',
			 		cellMetadata: function(args) {
						var cellMetadata = {};
						if (args.item.zoneID != 0) {
							cellMetadata.cssClasses = 'csptr';
						}
						return cellMetadata;
					},
			 	},
			 	{
			 		id		: 'zoneName',
			 		name	: '地区',
			 		field	: 'zoneName',
			 		width	: 180,
			 		//cssClass: 'csptr',
			 		cellMetadata: function(args) {
						var cellMetadata = {};
						if (args.item.zoneID != 0) {
							cellMetadata.cssClasses = 'csptr';
						}
						return cellMetadata;
					},
				},
			 	{
			 		id		: 'areaName',
			 		name	: 'ゾーン',
			 		field	: 'areaName',
			 		width	: 180,
			 		//cssClass: 'csptr',
			 		cellMetadata: function(args) {
						var cellMetadata = {};
						if (args.item.zoneID != 0) {
							cellMetadata.cssClasses = 'csptr';
						}
						return cellMetadata;
					},
				},
			 	{
			 		id		: 'storeName',
			 		name	: '店舗',
			 		field	: 'storeName',
			 		width	: 240,
			 		//cssClass: 'csptr',
			 		cellMetadata: function(args) {
						var cellMetadata = {};
						if (args.item.zoneID != 0) {
							cellMetadata.cssClasses = 'csptr';
						}
						return cellMetadata;
					},
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = value;
							if (typeof options.dataContext != 'undefined' && options.dataContext.dataType == 0){
								disp = options.dataContext.storeCode + ':' + value;
								if (disp == ":") {
									disp = "";
								}
							}
							return disp;
						},
					},
				},
			 	{
			 		id		: 'planAmDisp',
			 		name	: '計画金額(千円)',
			 		field	: 'planAmDisp',
			 		width	: 120,
					//cssClass: 'txtalign-right csptr',
					cssClass: 'txtalign-right',
			 		cellMetadata: function(args) {
						var cellMetadata = {};
						if (args.item.zoneID != 0) {
							cellMetadata.cssClasses = 'csptr';
						}
						return cellMetadata;
					},
					cellType:
					{
						formatFilter	: "comma",
					},
				},
			 	{
			 		id		: 'approveStatusDisp',
			 		name	: '承認状態',
			 		field	: 'approveStatusDisp',
			 		width	: 180,
			 		//cssClass: 'csptr',
			 		cellMetadata: function(args) {
						var cellMetadata = {};
						if (args.item.zoneID != 0) {
							cellMetadata.cssClasses = 'csptr';
						}
						return cellMetadata;
					},
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = value;
							if (typeof options.dataContext != 'undefined' && options.dataContext.dataType != 0){
								disp = '';
							}
							return disp;
						},
					},
				},
			 	{
			 		id		: 'approve',
			 		name	: '承認',
			 		field	: 'approve',
			 		width	: 80,
					cellType: {
						type: 'cltypeselector',

						formatter: function(value, options)
						{
							var data = options.dataContext;
							var zoneKey = data.zoneCode;
							var areaKey = data.zoneCode + '_' + data.areaCode;

							var zoneCheck = (data.dataType == DATA_TYPE.ZONE_TOTAL)
								&& (data.fmtCheckCounter[zoneKey] != null && data.fmtCheckCounter[zoneKey] > 0);
							var areaCheck = (data.dataType == DATA_TYPE.AREA_TOTAL)
								&& (data.fmtCheckCounter[areaKey] != null && data.fmtCheckCounter[areaKey] > 0);

							var typenamelist = clutil.gettypenamelist(amcm_type.AMCM_TYPE_DO_APPROVAL);

							var item = _.find(typenamelist, function(item){
								return item.type_id === parseInt(value, 10);
							});

							//2016.06.02　追加　申請期間内の差し戻しを可能にする　ここから
							var ymd_due;
							var ymd_today ;
							var ymd_syspar;
							var due_check;

							var cancel_days = Number(clcom.getSysparam('PAR_AMBP_APPLY_CANCEL_DAYS'));
							if (cancel_days >= 1) {
								//申請期間日付固定の場合
								if (cancel_days < 10) {
									ymd_syspar = String('0' + cancel_days);
								} else {
									ymd_syspar = String(cancel_days);
								}
								//報告月の前月をyyyymmで取得
								var ym_before = Number(String(clutil.addDate(Number($('#ca_srchMonth').selectpicker('val') + '01'), -1)).substr(0,6));
								ymd_due = Number(ym_before + ymd_syspar);
							} else {
								//申請期限が月末から逆算した日付の場合
								ymd_due = clutil.addDate(clutil.addDate(Number( String( Number($('#ca_srchMonth').selectpicker('val'))) + '01' ), -1), cancel_days);
							}

							ymd_today = clcom.getOpeDate();

							//本日日付と、申請期限を比較し、「申請取消」ボタンの活性/日活性を制御する。
							if (clutil.diffDate(ymd_today, ymd_due) > 0) {
								due_check = false;
							} else {
								due_check = true;
							}
							//2016.06.02　追加　申請期間内の「申請取消」を可能にする　ここまで

							if (_.isUndefined(item)) {
								if (data.dataType == DATA_TYPE.STORE && data.approveStatus == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET){
									return;
								}else if (data.dataType == DATA_TYPE.STORE && data.approveStatus > amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET && data.isEditable){
									return;
								}else if (data.dataType == DATA_TYPE.AREA_TOTAL && areaCheck){
									return;
								}else if (data.dataType == DATA_TYPE.ZONE_TOTAL && zoneCheck){
									return;
								}else if (data.dataType == DATA_TYPE.ALL_TOTAL){
									return;
								//2016.06.02　追加　申請期間内の差し戻しを可能にする　ここから
								}else if (due_check && data.approveStatus >= opeTypeKind) {
								//2016.06.02　追加　申請期間内の差し戻しを可能にする　ここまで
									return;
								}else{
									return '承認済';
								}
							}

							var label = '';
							label = _.escape(item.code) + ":" + _.escape(item.name);
							console.log('item:::'+item);
							return label;
						},

						editorOptions: function(data){
							var options = {
								kind: amcm_type.AMCM_TYPE_DO_APPROVAL,
							};
							if (data.dataType != 0) {
								options.ids = [amcm_type.AMCM_VAL_DO_APPROVAL_OK];
							}
							if (data.approveStatus >= opeTypeKind) {
								options.ids = [amcm_type.AMCM_VAL_DO_APPROVAL_CANCEL];
							} else if (opeTypeKind == TYPE_KIND.KEISEN) {
								options.ids = [
									amcm_type.AMCM_VAL_DO_APPROVAL_OK,
									amcm_type.AMCM_VAL_DO_APPROVAL_NG_ZONEAJA,
									amcm_type.AMCM_VAL_DO_APPROVAL_NG_AREAAJA,
									amcm_type.AMCM_VAL_DO_APPROVAL_NG_STORE
								];
							} else {
								options.ids = [amcm_type.AMCM_VAL_DO_APPROVAL_OK, amcm_type.AMCM_VAL_DO_APPROVAL_NG];
							}

							return options;
						},

						isEditable: function(item){
							var zoneKey = item.zoneCode;
							var areaKey = item.zoneCode + '_' + item.areaCode;

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
							var allCheck = (item.dataType == DATA_TYPE.ALL_TOTAL && item.isEditable);

							//2016.06.02　追加　申請期間内の申請取消を可能にする　ここから
							var ymd_due;
							var ymd_today ;
							var ymd_syspar;
							var due_check;

							if (Number(clcom.getSysparam('PAR_AMBP_APPLY_CANCEL_DAYS')) >= 1) {
							  //申請期間日付固定の場合
							  if (Number(clcom.getSysparam('PAR_AMBP_APPLY_CANCEL_DAYS')) < 9) {
							    ymd_syspar = String('0' + Number(clcom.getSysparam('PAR_AMBP_APPLY_CANCEL_DAYS')));
							  } else {
							    ymd_syspar = String(clcom.getSysparam('PAR_AMBP_APPLY_CANCEL_DAYS'));
							  }
							  //報告月の前月をyyyymmで取得
							  var ym_before = Number(String(clutil.addDate(Number($('#ca_srchMonth').selectpicker('val') + '01'), -1)).substr(0,6));
							  ymd_due = Number(ym_before + ymd_syspar);
							} else {
							  //申請期限が月末から逆算した日付の場合
							  ymd_due = clutil.addDate(clutil.addDate(Number( String( Number($('#ca_srchMonth').selectpicker('val'))) + '01' ), -1), Number(clcom.getSysparam('PAR_AMBP_APPLY_CANCEL_DAYS')));
							}

							ymd_today = clcom.getOpeDate();

							//本日日付と、申請期限を比較し、「申請取消」ボタンの活性/日活性を制御する。
							if (clutil.diffDate(ymd_today, ymd_due) > 0) {
							  due_check = false;
							} else {
							  due_check = true;
							}
							//2016.06.02　追加　申請期間内の差し戻しを可能にする　ここまで

							//2016.06.02　追加　申請期間内の差し戻しを可能にする　（条件文を追加　 || (due_check && ( item.approveStatus >= opeTypeKind))）
							if (( allCheck || storeCheck || areaCheck || zoneCheck ) || (due_check && ( item.approveStatus >= opeTypeKind))){
								return true;
							}else{
								return false;
							}
						},
					},
				},
		 	];

		},

		gridEvents:{
			'click:cell' : function(target, args){
				if (args.row > 0 && args.cell != 6){
					var rowIndex = Number(args.row - 1);
					var rowData = this.gridData[rowIndex];
					if (rowData.zoneID == 0) {
						return;
					}
					this._doOpeAction(am_proto_defs.AM_PROTO_COMMON_RTYPE_REL, 0, rowData);
				}
			},
			'cell:change':  function(args){
				var id = args.column.id;
				var rowIndex = Number(args.row - 1);
				var rowData = this.gridData[rowIndex];
				var dataType = rowData.dataType;
				var zoneID = rowData.zoneID;
				var areaID = rowData.areaID;
				var val = args.item[id];

				if (dataType > DATA_TYPE.STORE){

					/* 一括差戻しを可能する #20160629 */
					//if (val > 1){
					//	val = 0;
					//	args.item[id] = val;
					//}

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
						var chkZoneID = this.zoneID;
						var chkAreaID = this.areaID;

						if (approveStatus != amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET){
							if (dataType == DATA_TYPE.AREA_TOTAL) {
								if (chkDataType == DATA_TYPE.STORE && chkZoneID == zoneID && chkAreaID == areaID &&
										approveStatus < checkStatus){
									this.approve = val;
								}
							} else if (dataType == DATA_TYPE.ZONE_TOTAL) {
								// 店舗
								if (chkDataType == DATA_TYPE.STORE && chkZoneID == zoneID && approveStatus < checkStatus){
									this.approve = val;
								}
								// エリア合計
								if (chkDataType == DATA_TYPE.AREA_TOTAL && chkZoneID == zoneID && approveStatus < checkStatus){
									var areaKey = this.zoneCode + '_' + this.areaCode;
									if (this.checkCounter[areaKey] != null && this.checkCounter[areaKey] > 0){
										this.approve = val;
									}
								}
							} else if (dataType == DATA_TYPE.ALL_TOTAL) {
								// 店舗
								if (this.isEditable && chkDataType == DATA_TYPE.STORE && chkZoneID != 0 && approveStatus < checkStatus){
									this.approve = val;
								}
								// エリア合計
								if (this.isEditable && chkDataType == DATA_TYPE.AREA_TOTAL && approveStatus < checkStatus){
									var areaKey = this.zoneCode + '_' + this.areaCode;
									if (this.checkCounter[areaKey] != null && this.checkCounter[areaKey] > 0){
										this.approve = val;
									}
								}
								// ゾーン合計
								if (this.isEditable && chkDataType == DATA_TYPE.ZONE_TOTAL && approveStatus < checkStatus){
									var areaKey = this.zoneCode;
									if (this.checkCounter[areaKey] != null && this.checkCounter[areaKey] > 0){
										this.approve = val;
									}
								}
								if (chkDataType == DATA_TYPE.ALL_TOTAL) {
									this.approve = val;
								}
							}
						}
					});
				}

				this.grid.grid.invalidate();
			},
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){
			this.srchAreaCtrl.show_srch();
			$("#searchAgain").fadeOut();

			// 検索条件部を活性化する
			clutil.viewRemoveReadonly($("#ca_srchArea"));

			this.srchCondView.init_ope_month = $('#ca_srchMonth').val();

			// 検索条件初期化
			this.srchCondView.deserialize({
				srchUnitID	: clcom.userInfo.unit_id,
				srchMonth	: this.srchCondView.init_ope_month,
			});

			this.setInitializeValue();
			this.srchCondView.setDefaultEnabledProp();
			this.srchCondView.prevUnitId = clcom.userInfo.unit_id;
			this.srchCondView._onUnitChanged();

			clutil.setFocus(this.srchCondView.$tgtFocus);

			// 検索結果クリア
			this.srchAreaCtrl.reset();

			// フッターボタン活性制御
			this.mdBaseView.setSubmitEnable(false);

			// テーブル位置情報クリア
			this.range = null;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				if (this.mdBaseViewOpt.updMessageDialog === false) {
					var msg = clmsg.cl_rtype_upd_confirm + '<br />必ず本日中に再申請し、承認者に連絡して下さい。';
					clutil.MessageDialog(msg, this.srchCondView._onSrchClick);
				} else {
					clutil.mediator.once('onDialog2Close', this.srchCondView._onSrchClick);
				}
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				if (args.data.rspHead.fieldMessages){
					$.each(args.data.rspHead.fieldMessages, function() {
						var msg = clutil.fmtargs(clmsg[this.message], this.args);

						var fieldName = this.field_name;
						var lineNo = this.lineno;
						var tgt = mainView.gridData.filter(function(data){return (data.lineNo == lineNo);});

						if (tgt.length > 0){
							$.each(tgt, function() {
								var rowid = this._cl_gridRowId;
								mainView.grid.setCellMessage(rowid, fieldName, 'error', msg);
							});
						}
					});
				}

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

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			this.setInitializeValue();

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

				this.srchCondView.utl_org.setValue(orgParam);
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
					srchReq.srchOrgID = srchReq.AMPAV0010_org_id;
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
				//reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMBPV0040GetReq: srchReq
			};
			return req;
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			if(groupid !== 'AMBPV0040'){
				return;
			}

			if(!this.savedReq){
				console.warn('検索条件が保存されていません。');
				return;
			}

			// 検索条件を複製してページリクエストを差し替える
			var req = _.extend({}, this.savedReq);
			req.reqPage = pageReq;

			// 検索実行
			this.doSrch(req);
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行データ（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedIds, $focusElem){
			this.clearResult();
			mainView.mdBaseView.setSubmitEnable(false);

			if (typeof srchReq.AMBPV0040GetReq.org != 'undefined'){
				srchReq.AMBPV0040GetReq.srchOrgID = srchReq.AMBPV0040GetReq.org.id;
			}

			var defer = clutil.postJSON('AMBPV0040', srchReq).done(_.bind(function(data){

				// データ取得
				var recs = data.AMBPV0040GetRsp.monthPlans;

				if (_.isEmpty(recs)) {
					// エラーメッセージ表示
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

					// 検索ペイン／結果ペインを表示
					mainView.srchAreaCtrl.reset();

					// フォーカス設定
					this.resetFocus(this.srchCondView.$tgtFocus);

				} else {
					clutil.viewReadonly($("#ca_srchArea"));
					$("#searchAgain").text('検索条件を開く');

					this.setRspData(recs);

					// リクエストを保存。
					this.savedReq = srchReq;

					// 結果ペインを表示
					this.srchAreaCtrl.show_result();

					// フォーカスの設定
					if(typeof $focusElem != 'undefined') {
						this.resetFocus($focusElem);
					}

					// 登録ボタン活性制御
					mainView.mdBaseView.setSubmitEnable(true);

					this.createGridData();
					this.initGrid();

					this.gridData = recs;

					var gridParam = {
						gridOptions		: {
							autoHeight		: false,
						},										// データグリッドのオプション
						columns			: this.columns,			// カラム定義
						data			: this.gridData,		// データ
					};

					this.grid.setData(gridParam);
					var _this = this;
					var _grid = this.grid;

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

					    // TEST
					    if (_this.range != null) {
						    _grid.grid.scrollRowToTop(_this.range.top);
						    _this.range = null;
					    }
					});
				}
			}, this)).fail(_.bind(function(data){

				// 検索ペインを表示
				this.srchAreaCtrl.reset();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				// フォーカスの設定
				this.resetFocus($focusElem);

			}, this));

			return defer;
		},

		setRspData: function(recs){
			var sumBuff = {};
			var index = 0;

			$.each(recs,function(){
				if (sumBuff[this.zoneCode] == null){

					var zoneEnabled = false;

					if (opeTypeKind == TYPE_KIND.KEISEN){
						zoneEnabled = true;
					} else if (opeTypeKind == TYPE_KIND.ZONE_AJA){
						// 担当のゾーンなら一括承認可
						if (clcom.userInfo.org_id == this.zoneID){
							zoneEnabled = true;
						}
					}

					sumBuff[this.zoneCode] = {
						area		: {},
						zoneID		: this.zoneID,
						zoneCode	: this.zoneCode,
						zoneName	: this.zoneName,
						areaID		: 0,
						areaCode	: '',
						areaName	: '地区計',
						storeID		: 0,
						storeCode	: '',
						storeName	: '',
						planAm		: 0,
						dataType	: 2,
						sortkey		: this.zoneCode + 'ZZZ' + '1' + '0',
						areaEnabled	: false,
						zoneEnabled	: zoneEnabled,
						opeTypeKind : opeTypeKind,
					};
				}
				if (sumBuff[this.zoneCode].area[this.areaCode] == null){
					var areaEnabled = false;

					if (opeTypeKind == TYPE_KIND.KEISEN){
						areaEnabled = true;
					} else if (opeTypeKind == TYPE_KIND.AREA_AJA){
						// 担当のエリアなら一括承認可
						if (clcom.userInfo.org_id == this.areaID){
							areaEnabled = true;
						}
					}else if (opeTypeKind == TYPE_KIND.ZONE_AJA){
						// 担当のゾーンなら一括承認可
						if (clcom.userInfo.org_id == this.zoneID){
							areaEnabled = true;
						}
					}

					sumBuff[this.zoneCode].area[this.areaCode] = {
						zoneID		: this.zoneID,
						zoneCode	: this.zoneCode,
						zoneName	: this.zoneName,
						areaID		: this.areaID,
						areaCode	: this.areaCode,
						areaName	: this.areaName,
						storeID		: 0,
						storeCode	: '',
						storeName	: 'ゾーン計',
						planAm		: 0,
						dataType	: 1,
						sortkey		: this.zoneCode + this.areaCode + '1' + '0',
						areaEnabled	: areaEnabled,
						zoneEnabled	: false,
						opeTypeKind : opeTypeKind,
					};
				}

				sumBuff[this.zoneCode].planAm += this.planAm;
				sumBuff[this.zoneCode].area[this.areaCode].planAm += this.planAm;

				this.planAmDisp = Math.round(this.planAm / 1000);
				this.approveStatusDisp = clutil.gettypename(amcm_type.AMCM_TYPE_OPER_PLAN_APPROVE, this.approveStatus);
				this.dataType = 0;
				this.sortkey = this.zoneCode + this.areaCode + '0' + index;
				this.areaEnabled = false;
				this.zoneEnabled = false;
				index++;
			});

			$.each(sumBuff,function(){
				$.each(this.area,function(){
					recs.push({
						lineNo				: 0,
						newStore			: '',
						zoneID				: this.zoneID,
						zoneCode			: this.zoneCode,
						zoneName			: this.zoneName,
						areaID				: this.areaID,
						areaCode			: this.areaCode,
						areaName			: this.zoneID == 0 ? "" : this.areaName,
						storeID				: this.storeID,
						storeCode			: this.storeCode,
						storeName			: this.zoneID == 0 ? "" : this.storeName,
						planAm				: this.planAm,
						planAmDisp			: Math.round(this.planAm / 1000),
						approveStatus		: 0,
						approveStatusDisp	: clutil.gettypename(amcm_type.AMCM_TYPE_OPER_PLAN_APPROVE, this.approveStatus),
						approve				: 0,
						prevApprove			: 0,
						dataType			: this.zoneID == 0 ? DATA_TYPE.ALL_TOTAL : this.dataType,
						sortkey				: this.sortkey,
						areaEnabled			: this.areaEnabled,
						zoneEnabled			: this.zoneEnabled,
						opeTypeKind : opeTypeKind,
					});
				});

				recs.push({
					lineNo				: 0,
					newStore			: this.newStore,
					zoneID				: this.zoneID,
					zoneCode			: this.zoneCode,
					zoneName			: this.zoneName,
					areaID				: this.areaID,
					areaCode			: this.areaCode,
					areaName			: this.zoneID == 0 ? "" : this.areaName,
					storeID				: this.storeID,
					storeCode			: this.storeCode,
					storeName			: this.zoneID == 0 ? "" : this.storeName,
					planAm				: this.planAm,
					planAmDisp			: Math.round(this.planAm / 1000),
					approveStatus		: 0,
					approveStatusDisp	: clutil.gettypename(amcm_type.AMCM_TYPE_OPER_PLAN_APPROVE, this.approveStatus),
					approve				: 0,
					prevApprove			: 0,
					dataType			: this.zoneID == 0 ? DATA_TYPE.ALL_TOTAL : this.dataType,
					sortkey				: this.sortkey,
					areaEnabled			: this.areaEnabled,
					zoneEnabled			: this.zoneEnabled,
					opeTypeKind 		: opeTypeKind,
				});
			});

			recs.sort(
				function(a,b){
					var x = a["sortkey"];
					var y = b["sortkey"];
			    	if( x > y ) return 1;
			        if( x < y ) return -1;
			        return 0;
			    }
			);

			var checkCounter = {};
			var fmtCheckCounter = {};
			var allTotalLine = [];

			var lineNo = 0;
			var isEditable = false;
			var f_approve = true;	// 未承認（true:なし false:あり）

			$.each(recs,function(){
				if (this.dataType == 0) {
					this.lineNo = lineNo++;
				} else {
					this.lineNo = -1;
				}
				if (this.dataType == DATA_TYPE.ALL_TOTAL) {
					allTotalLine.push(this);
				}

				var zoneEnabled;
				var areaEnabled;

				if (opeTypeKind == TYPE_KIND.FULL){
					zoneEnabled = true;
					areaEnabled = true;
				}else{
					zoneEnabled = this.zoneEnabled;
					areaEnabled = this.areaEnabled;
				}

				var zoneCheck = (this.dataType == 2 && zoneEnabled);
				var areaCheck = (this.dataType == 1 && areaEnabled);
				var storeCheck = false;

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

				if (this.dataType == DATA_TYPE.STORE){//} && this.approveStatus > amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET){
					if (opeTypeKind >= TYPE_KIND.KEISEN){
						if(this.approveStatus < amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_KEISEN){
							storeCheck = true;
						}
					} else if (opeTypeKind == TYPE_KIND.ZONE_AJA){
						if(this.approveStatus < amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_ZONE){
							storeCheck = true;
						}
					} else if (opeTypeKind == TYPE_KIND.AREA_AJA){
						if(this.approveStatus < amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_AREA){
							storeCheck = true;
						}
					}

					if (storeCheck || areaCheck || zoneCheck){
						if (this.approveStatus > amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET){
							checkCounter[zoneKey]++;
							checkCounter[areaKey]++;
							this.isEditable = true;
						} else {
							if (this.storeID != 0) {
								f_approve = false;
							}
						}
						fmtCheckCounter[zoneKey]++;
						fmtCheckCounter[areaKey]++;
					}else{
						this.isEditable = false;
					}
				}else if (this.dataType == DATA_TYPE.AREA_TOTAL){
					this.isEditable = areaCheck;
				}else if (this.dataType == DATA_TYPE.ZONE_TOTAL){
					this.isEditable = zoneCheck;
				}

				if (this.isEditable) {
					isEditable = true;
				}
				this.checkCounter = checkCounter;
				this.fmtCheckCounter = fmtCheckCounter;
			});

			if (isEditable) {
				_.each(allTotalLine, function(o) {
					o.isEditable = true;
				});
			}
			if (!f_approve) {
				// 未承認があるので警告ダイアログを表示する
				clutil.MessageDialog(clmsg.EBP0117);
			}
			console.log(recs);
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(( typeof srchReq == 'undefined' ) || _.isNull(srchReq)) {
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMBPV0040', srchReq);
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
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);
			req.AMBPV0040GetReq.org = mainView.srchCondView.utl_org.getValue();

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
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			var url = clcom.appRoot + '/AMBP/AMBPV0030/AMBPV0030.html';
			var url2 = clcom.appRoot + '/AMBP/AMBPV0050/AMBPV0050.html';

			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合

				var selectedIds = {};
				myData = {
					btnId		: null,//e.target.id,
					savedReq	: this.savedReq,
					savedCond	: this.savedReq.AMBPV0040GetReq,
					selectedIds	: selectedIds,
					chkData		: [],
				};
				destData = {
					opeTypeId	: rtyp,
					srchDate	: this.savedReq.srchDate,
					srchCond	: this.savedReq.AMBPV0040GetReq,
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
				myData.chkData = destData.chkData;
				//pushPageOpt.newWindow = true;
				if (destData.chkData[0].dataType != 0){
					pushPageOpt.url = url2;
				}

				var store = {
					id		:destData.chkData[0].storeID,
					code	:destData.chkData[0].storeCode,
					name	:destData.chkData[0].storeName,
					val		:destData.chkData[0].storeCode+':'+destData.chkData[0].storeName,
				};
				destData.srchCond.store = store;
				// fall through

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

		isReadOnly: function() {
			var opeMode = this.options.opeTypeId;
			var readonly = false;
			if (opeMode == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL ||
				opeMode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
				opeMode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				readonly = true;
			}
			return readonly;
		},

		setReadOnlyAllItems: function(){
			//clutil.viewReadonly($("#ca_base_form"));
		},


		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex) {
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMBPV0040GetReq: this.options.srchCond,
				// 更新リクエスト
				AMBPV0040UpdReq: {},
			};

			this.tempSrchReq = getReq;

			return {
				resId: clcom.pageId,	//'AMEQV0060',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			this.range = this.grid.grid.getViewport();
			console.log(this.range);

			this.grid.stopEditing();
			var buff = this.grid.getData();

			if(buff.length == 0) {
				return null;
			}

			if(!this.validator.valid()) {
				return null;
			}

			this.validator.clearErrorMsg($('#ca_table').find('.cl_error_field'));

			// Reqを構築する。
			var monthPlans = [];

			$.each(buff,function(){
				if (this.dataType == 0){
					monthPlans.push(this);
				}
			});

			this.mdBaseViewOpt.updMessageDialog = true;	// 一旦、完了ダイアログ有りにする
			_.each(monthPlans, _.bind(function(o) {
				if (o.approve == amcm_type.AMCM_VAL_DO_APPROVAL_CANCEL) {
					this.mdBaseViewOpt.updMessageDialog = false;
					return false;
				}
			}, this));

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// マスタ検索リクエスト
				AMBPV0040GetReq: this.savedReq.AMBPV0040GetReq,
				// マスタ更新リクエスト
				AMBPV0040UpdReq: {
					monthPlans	: monthPlans,
				}
			};

//return null;
			return {
				resId: clcom.pageId,	//'AMBPV0040',
				data: updReq
			};
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

			// 確定時用のデータを初期化
			this.savedReq = null;

		},

		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(model) {
			// 条件部の復元
			if(!_.isEmpty(model.savedCond)){
				this.srchCondView.deserialize(model.savedCond);

				this.srchCondView.utl_unit.done(function() {
					mainView.srchCondView.utl_org.setValue(model.savedCond.org);
				});
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.selectedIds, $('#' + model.btnId));
			}
		},

		_eof: 'AMBPV0040.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		mainView = new MainView(clcom.pageArgs).initUIElement().render();

		$("#mainColumnFooter p.right").hide();
		$("#mainColumnFooter p.left").hide();

		// フッターボタン活性状態制御
		mainView.mdBaseView.setSubmitEnable(false);

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
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
