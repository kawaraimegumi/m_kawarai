useSelectpicker2();

$(function(){
	$.inputlimiter.noTrim = true;

	var TYPE_KIND = {
			STORE: 1,
			EDITABLE: 2,
			AREA_AJA: 3,
			ZONE_AJA: 4,
			KEISEN: 5,
			FULL: 6
		};
//<!-- 画像表示 TODO hhhh-->
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',	// 店舗選択ボタン
			'click #ca_srch'				: '_onSrchClick',		// 検索ボタン押下時
			'change #ca_srchUnitID'			: '_onUnitChanged'		// 事業ユニット変更
		},

		// 店舗選択ボタン
		_onStoreSelClick: function(e){
			var org_id;
			if (clcom.userInfo.org_kind_typeid == amcm_type.AMCM_VAL_ORG_KIND_ZONE) {
				org_id = clcom.userInfo.org_id;
			} else {
				org_id = this.utl_unit.getValue();
			}
			var options = {
				func_id	:  Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id	: org_id
			};
			this.AMPAV0010Selector.show(null, null, options);
		},

		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			this.initUIElement_AMPAV0010();
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			clutil.inputlimiter(this.$el);

			// フィールドリレーションの設定
			if (clcom.userInfo.org_kind_typeid == amcm_type.AMCM_VAL_ORG_KIND_ZONE) {
				this.fieldRelation = clutil.FieldRelation.create('default', {
					clbusunitselector: {
						el: '#ca_srchUnitID',
						initValue: clcom.userInfo.unit_id,
					},
				}, {
					dataSource: {
						orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					}
				});
				this.utl_store = clutil.clorgcode({
					el: "#ca_srchStoreID",
					dependAttrs: function(item) {
						var p_org_id = clcom.userInfo.org_id;
						//var s_org_id = p_org_id;
						return {
							orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
							orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
							p_org_id: p_org_id
						};
					}
				});
			} else {
				this.fieldRelation = clutil.FieldRelation.create('default', {
					clbusunitselector: {
						el: '#ca_srchUnitID',
						initValue: clcom.userInfo.unit_id
					},
					clorgcode: {
						el : '#ca_srchStoreID',
						dependSrc: {
							p_org_id: 'unit_id'
						}
					}
				}, {
					dataSource: {
						orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
					}
				});
			}
			this.fieldRelation.done(function() {
				var tgtView = mainView.srchCondView;
				tgtView.utl_unit = this.fields.clbusunitselector;
				if (clcom.userInfo.org_kind_typeid != amcm_type.AMCM_VAL_ORG_KIND_ZONE) {
					tgtView.utl_store = this.fields.clorgcode;
				}
				tgtView.initialized = true;
				tgtView.setInitializeValue();
				tgtView.setDefaultEnabledProp();
				tgtView._onUnitChanged();
			});

			this.prevUnitId = clcom.userInfo.unit_id;

			var monthAdd = 1;
			var date = clutil.ymd2date(clcom.getOpeDate());
			this.init_ope_month = '' + date.getFullYear() + ('0' + (date.getMonth() + 1 + monthAdd)).slice(-2);	// FIXME 年月初期値

			// 対象月 FIXME:暫定
			this.utl_month = clutil.clmonthselector(
				this.$('#ca_srchMonth'), 1, 1, 1, null, null, 1, monthAdd, 'd');

			// 初期フォーカスオブジェクト設定
			if (opeTypeKind >= TYPE_KIND.FULL) {
				this.$tgtFocus = $('#ca_srchUnitID');
			}
			else if (opeTypeKind >= TYPE_KIND.EDITABLE) {
				this.$tgtFocus = $('#ca_srchStoreID');
			} else {
				this.$tgtFocus = $('#ca_srchMonth');
			}

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);
		},

		setInitializeValue: function(){
			if (mainView.delayedCallParam != null){
				mainView._onMDGetCompleted(mainView.delayedCallParam.args, mainView.delayedCallParam.e);
				mainView.delayedCallParam = null;
			} else {
				if (opeTypeKind == TYPE_KIND.STORE){
					var storeID = clcom.userInfo.org_id;
					var storeCode = clcom.userInfo.org_code;
					var storeName = clcom.userInfo.org_name;
					$(mainView.srchCondView.utl_store.el).autocomplete('clAutocompleteItem', {id: storeID, code: storeCode, name: storeName});
					mainView.srchCondView.utl_store.setValue({id: storeID, code: storeCode, name: storeName});
				}
			}

			clutil.data2view(this.$('#div_ca_srchMonth'), {srchMonth:this.init_ope_month});

			mainView.mdBaseView.options.subtitle = '計画登録';
		},

		setDefaultEnabledProp: function() {
//			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
//				clutil.viewReadonly($("#div_ca_store"));
//				clutil.viewReadonly("#div_ca_unit");
//				$("#div_ca_unit").hide();
//			}

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
				clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.viewReadonly($("#div_ca_store"));
				clutil.viewReadonly("#div_ca_unit");
				$("#div_ca_unit").hide();
			}

			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS &&
				clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$("#div_ca_unit").hide();
			}
		},

		initUIElement_AMPAV0010 : function(){
			// 店舗選択
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el				: $("#ca_AMPAV0010_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				select_mode 	: clutil.cl_single_select,		// 単一選択
				isAnalyse_mode 	: false 						// 通常画面モード
			});

			this.AMPAV0010Selector.clear = function() {
				if (typeof mainView != "undefined") {
					var autocomplete = mainView.srchCondView.utl_store;
					autocomplete.resetValue();
				}
			};

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				var autocomplete = mainView.srchCondView.utl_store;
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					autocomplete.setValue({id: id, code: code, name: name});
					mainView.validator.clearErrorMsg($('#ca_srchStoreID'));
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

		render: function(){
			this.AMPAV0010Selector.render();
			return this;
		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			var dto = clutil.view2data(this.$el);
			// TODO: 店舗選択要素を拾う
			if(this.selectedStoreDto){
				dto.srchStoreID = this.selectedStoreDto.id;
			}
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
				this.fieldRelation.done(function() {callback();});
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
		isValid: function(){
			return this.validator.valid();
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

			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_onUnitChanged: function(e){
			var unitID = ~~$('#ca_srchUnitID').val();

			if (unitID == '0'){
				clutil.inputReadonly("#ca_srchStoreID");
				clutil.inputReadonly("#ca_btn_store_select");
			}else{
				if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE &&
					clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN){
					clutil.inputRemoveReadonly("#ca_srchStoreID");
					clutil.inputRemoveReadonly("#ca_btn_store_select");
				}
			}

			if (unitID == '0' || unitID != this.prevUnitId){
				this.utl_store.resetValue();
			}

			this.prevUnitId = unitID;
		},

		_eof: 'AMBPV0030.SrchCondView//'
	});


	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
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
			this.delayedCallParam = null;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '店舗日別計画',
					subtitle: '',
					opeTypeId: [am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW, am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD],
					pageCount: o.chkData.length,
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					btn_submit:true,
					btn_pdf:true,
					btn_cancel: (o.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && !isChild)
						? {label:'条件再設定', action:this._doCancel} : true,
					updMessageDialog: false
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 承認設定を取得
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
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
				footerNewRowBtn	: false 			// フッター部の新規行追加ボタンを使用するフラグ。
			});

			this.grid.getHeadMetadata = this.getHeadMetadata;
			this.grid.getMetadata = this.getMetadata;

			// セル変更
			this.listenTo(this.grid, 'cell:change', this.gridCellChange);

			this.grid.render();
		},

		getHeadMetadata: function(rowIndex){
			return {
				columns: {
					prevDayDisp:
					{
						colspan	: '2',
						cssClasses		: 'bdrTpColor'
					},
					dayDisp:
					{
						colspan	: '2',
						cssClasses		: 'bdrTpColor'
					},
					storeComment:
					{
						cssClasses		: 'bdrTpColor'
					},

					prevCompoRate:
					{
						cssClasses		: 'replaceTarget'
					},
					prevProfitRate:
					{
						cssClasses		: 'replaceTarget'
					},
					compoRate:
					{
						cssClasses		: 'replaceTarget'
					},
					prevRate:
					{
						cssClasses		: 'replaceTarget'
					},
					profitRate:
					{
						cssClasses		: 'replaceTarget'
					},
					weekTotalPrevRate:
					{
						cssClasses		: 'replaceTarget'
					}
				}
			};
		},

		getMetadata: function(rowIndex){
			var warn = '';
			var checkData = this.getRsp.dayPlans[rowIndex];

			if (rowIndex == this.getRsp.dayPlans.length){
				return {
					cssClasses: 'reference',
					columns: {
						prevDayDisp:
						{
							colspan	: '4'
						},
//						prevCompoRate:
//						{
//							colspan	: '2',
//						},
//						compoRate:
//						{
//							colspan	: '2',
//						},
						salePlanDisp:
						{
							cssClasses		: 'lgFnt'
						}
//						weekTotalDisp:
//						{
//							colspan	: '4',
//							cssClasses		: 'align-left lgFnt',
//						},
					}
				};
			}else{
				if (checkData.warning == 1){
					warn = ' alertTip';
				}

				return {
					columns: {
						prevWDay_disp: {
							cssClasses: checkData.cl_pw_fDay + warn
						},
						wDay_disp: {
							cssClasses: checkData.cl_w_fDay + warn
						}
					}
				};
			}
		},

		createGridData: function(){
			this.colhdMetadatas =
			[
				{
					columns:
					{
						prevDayDisp:
						{
							colspan	: '2',
							name	: "前年"
						},
						dayDisp:
						{
							colspan	: '2',
							name	: "本年"
						},
						prevSaleDisp:
						{
							colspan	: '4',
							name	: "前年実績"
						},
						salePlanDisp:
						{
							colspan	: '6',
							name	: "本年計画"
						},
						storeComment:
						{
							name	: "店舗通知事項"
						}
					}
				},
			 ];

			var phRate = clutil.getclsysparam('PAR_AMCM_DEFAULT_PERCENT_DECIMAL');
			this.columns =
			[
			 	{
			 		id		: 'prevDayDisp',
			 		//name	: '月日',
			 		field	: 'prevDayDisp',
			 		width	: 64,
			 		cssClass: 'tightSpace'
			 	},
			 	{
			 		id		: 'prevWDay_disp',
			 		//name	: '曜日',
			 		field	: 'prevWDay_disp',
			 		width	: 48,
			 		cssClass: 'tightSpace',
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = value;
							if (options.dataContext.warning == 1){
								disp = value + '&nbsp;<span title="">&nbsp;&nbsp;!&nbsp;&nbsp;</span>';
							}
							return disp;
						}
					}
			 	},
			 	{
			 		id		: 'dayDisp',
			 		//name	: '月日',
			 		field	: 'dayDisp',
			 		width	: 64,
			 		cssClass: 'tightSpace'
			 	},
			 	{
			 		id		: 'wDay_disp',
			 		//name	: '曜日',
			 		field	: 'wDay_disp',
			 		width	: 48,
			 		cssClass: 'tightSpace',
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = value;
							if (options.dataContext.warning == 1){
								disp = value + '&nbsp;<span title="">&nbsp;&nbsp;!&nbsp;&nbsp;</span>';
							}
							return disp;
						}
					}
			 	},
			 	{
			 		id		: 'prevSaleDisp',
			 		name	: '実績',
			 		field	: 'prevSaleDisp',
			 		width	: 72,
					cssClass: 'txtalign-right tightSpace',
					cellType:
					{
						formatFilter	: "comma"
					}
			 	},
			 	{
			 		id		: 'prevCompoRate',
			 		//name	: '構成|比(%)',
			 		name	: '構成比|　(%)',
			 		field	: 'prevCompoRate',
			 		width	: 52,
					cssClass: 'txtalign-right tightSpace',
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = '-';
//							if (!options.dataContext.isStore){
//								disp = value;
//							}

							if (options.dataContext.prevDayDisp != '合計'){
								disp = value;
							}
							return disp;
						},
						formatFilter	: "comma fixed:1"
					}
			 	},
			 	{
			 		id		: 'prevWeekTotalDisp',
			 		name	: '週累計',
			 		field	: 'prevWeekTotalDisp',
			 		width	: 72,
					cssClass: 'txtalign-right tightSpace',
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = '';
							if (options.dataContext.wDay == 7 || options.dataContext.lastDay === true){
								disp = value;
							}else{
								if (options.dataContext.prevDayDisp != '合計'){
									disp = '-';
								}else{
									disp = '-';//value;
								}
							}
							return disp;
						},
						formatFilter	: "comma"
					}
			 	},
			 	{
			 		id		: 'prevProfitRate',
			 		//name	: '荒利|率(%)',
			 		name	: '荒利率|　(%)',
			 		field	: 'prevProfitRate',
			 		width	: 52,
					cssClass: 'txtalign-right tightSpace',
					cellType:
					{
//						formatter: function(value, options)
//						{
//							var disp = '';
//							if (options.dataContext.prevDayDisp != '合計'){
//								disp = value;
//							}
//							return disp;
//						},
						formatFilter	: "comma fixed:1"
					}
			 	},
				{
					id				: 'salePlanDisp',
					name			: '計画',
					field			: 'salePlanDisp',
					cssClass		: 'txtalign-right tightSpace',		// 右寄せ,
					width			: 80,
					minWidth		: 80,
					cellType 		: {
						type			: 'text',
						//validator		: "min:1",
						limit			: "int:9",
						formatFilter	: "comma",
						editorOptions	: {
							addClass: 'txtar tightSpace'		// エディタ：右寄せ
						},
						isEditable: function(item){
							return (item.readonly.length == 0);
						}
					}
				},
			 	{
			 		id		: 'compoRate',
			 		//name	: '構成|比(%)',
			 		name	: '構成比|　(%)',
			 		field	: 'compoRate',
			 		width	: 52,
					cssClass: 'txtalign-right tightSpace',
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = '-';
							if (options.dataContext.prevDayDisp != '合計'){
								disp = value;
							}
							return disp;
						},
						formatFilter	: "comma fixed:1"
					}
			 	},
			 	{
			 		id		: 'prevRate',
			 		//name	: '前年|比(%)',
			 		name	: '前年比|　(%)',
			 		field	: 'prevRate',
			 		width	: 52,
					cssClass: 'txtalign-right tightSpace',
					cellType:
					{
						formatFilter	: "comma fixed:1"
					}
			 	},
				{
					id				: 'profitRate',
					//name			: '荒利|率(%)',
					name			: '荒利率|　(%)',
					field			: 'profitRate',
					cssClass		: 'txtalign-right tightSpace',		// 右寄せ,
					width			: 52,
					minWidth		: 52,
					cellType 		: {
						type			: 'text',
						//validator		: "min:1",
						limit			: "number:2,1,-",
						formatter: function(value, options)
						{
//							var disp = '';
//							if (!options.dataContext.isStore || options.dataContext.prevDayDisp == '合計'){
//								disp = value;
//							}
//							return disp;
							return value;
						},
						formatFilter	: "comma fixed:1",
						editorOptions	: {
							addClass: 'txtar tightSpace',
							attributes	:
							{
								placeholder	: phRate
							}
						},
						isEditable: function(item){
							return (item.profitRateReadonly.length == 0);
						}
					}
				},
			 	{
			 		id		: 'weekTotalDisp',
			 		name	: '週累計',
			 		field	: 'weekTotalDisp',
			 		width	: 72,
					cssClass: 'txtalign-right tightSpace',
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = '';
							if (options.dataContext.wDay == 7 || options.dataContext.lastDay === true){
								disp = value;
							}else{
//								if (options.dataContext.prevDayDisp != '合計'){
//									disp = '-';
//								}
								disp = '-';
							}
							return disp;
						},
						formatFilter	: "comma"
					}
			 	},
			 	{
			 		id		: 'weekTotalPrevRate',
			 		//name	: '前年|比(%)',
			 		name	: '前年比|　(%)',
			 		field	: 'weekTotalPrevRate',
			 		width	: 52,
					cssClass: 'txtalign-right tightSpace',
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = '';
//							if (!options.dataContext.isStore){
								if (options.dataContext.wDay == 7 || options.dataContext.lastDay === true){
									disp = value;
								}else{
									disp = '-';
//									if (options.dataContext.prevDayDisp != '合計'){
//										disp = '-';
//									}
								}
//							}
							return disp;
						},
						formatFilter	: "comma fixed:1"
					}
			 	},
			 	{
			 		id		: 'storeComment',
			 		//name	: '店舗通知欄',
			 		field	: 'storeComment',
			 		width	: 680,
			 		cellType:
			 		{
			 			formatter: function(value, options)
			 			{
			 				var disp = '';
			 				if (options.dataContext.prevDayDisp == '合計') {
			 					disp = options.dataContext.monthTotalStr;
			 				} else {
			 					disp = value;
			 				}
			 				return disp;
						},
						formatFilter: "comma"
			 		}
			 	},
			];
		},

		/**
		 * セル編集処理
		 * @param args
		 */
		gridCellChange: function(args){
			var id = args.column.id;
			var rowIndex = Number(args.row - 2);
			var ref = this.getRsp.dayPlans[rowIndex];
			var totalData = this.grid.getData()[this.grid.getData().length - 1];

			var updateRows = [];

			updateRows.push({index:rowIndex, data:ref});
			updateRows = updateRows.concat(this.getRsp.weekTotalRow);

			if (id.indexOf('sale') >= 0){
				var curValue = Number(args.item[id].replace(/[^0-9]/g, "").substring(0,12));
				args.item[id] = curValue;

				// データ更新
				ref.salePlan = curValue * 1000;
				ref.salePlanDisp = curValue;
				ref.prevRate = this.roundRate(ref.salePlan, ref.prevSale);

				this.setPlanTable();

			} else if (id.indexOf('profitRate') >= 0){
				var tgtVal = args.item[id].replace(/[^\-0-9.]/g, "");

				if (tgtVal == '.') {
					tgtVal = '';
				}
				var arrTmp = tgtVal.split('.');
				var valTmp = arrTmp.shift();
				var n = 2;
				if (valTmp < 0) {
					n = 3;
				}
				if (arrTmp.length > 0){
					valTmp = valTmp.substring(valTmp.length - n, valTmp.length);
				}else{
					valTmp = valTmp.substring(0,n);
				}

				if (arrTmp.length > 0 && arrTmp[0] != ''){
					arrTmp[0] = arrTmp[0].substring(0,1);
					valTmp += ('.' + arrTmp.join(''));
				}
				var curValue = Number(valTmp);
				args.item[id] = curValue;

				// データ更新
				ref.profitRate = curValue;
				ref.cost = curValue / 100 * ref.salePlan;

				this.setPlanTable();
			}

			$.each(updateRows,function(){
				var src = this.data;
				var grid = mainView.grid.getData()[this.index];

				grid.compoRate = src.compoRate;
				grid.cost = src.cost;
				grid.prevCompoRate = src.prevCompoRate;
				grid.prevCost = src.prevCost;
				grid.prevProfitRate = src.prevProfitRate;
				grid.prevRate = src.prevRate;
				grid.prevSale = src.prevSale;
				grid.prevSaleDisp = src.prevSaleDisp;
				grid.prevWeekTotal = src.prevWeekTotal;
				grid.prevWeekTotalDisp = src.prevWeekTotalDisp;
				grid.profitRate = src.profitRate;
				grid.salePlan = src.salePlan;
				grid.salePlanDisp = src.salePlanDisp;
				grid.weekTotal = src.weekTotal;
				grid.weekTotalDisp = src.weekTotalDisp;
				grid.weekTotalPrevRate = src.weekTotalPrevRate;
			});

			this.setTotalData(totalData);

			this.grid.grid.invalidate();
			$('.replaceTarget').each(function(){var $tgt = $(this); $tgt.html($tgt.text().replace('|','<br/>')); });
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){
			// 検索条件部を活性化する
			this.srchAreaCtrl.show_srch();
			$("#searchAgain").fadeOut();

			clutil.viewRemoveReadonly($("#ca_srchArea"));

			this.srchCondView.init_ope_month = $('#ca_srchMonth').val();

			// 検索条件初期化
			this.srchCondView.deserialize({
				srchUnitID	: clcom.userInfo.unit_id,
				srchMonth	: this.srchCondView.init_ope_month
			});

			this.srchCondView.fieldRelation.done(function() {
				var tgtView = mainView.srchCondView;
				tgtView.setInitializeValue();
				tgtView.setDefaultEnabledProp();
			});

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
				clutil.MessageDialog2(operationName + 'しました。');
				this.setReadOnlyAllItems();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				break;
			}
		},

		_onSaleChange : function(e){
			var planData = this.recList[1][0];
			var curValue = Number($(e.currentTarget).val());
			var curId = Number($(e.currentTarget).attr('id'));

			planData.month[curId].salePlan = curValue;
			this.setPlanTable(curId);
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

			return this;
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
				//reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMBPV0030GetReq: srchReq
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

			mainView.mdBaseView.setSubmitEnable(false);
			$("#mainColumnFooter").find(".cl_download").attr('disabled', false);

			var defer = clutil.postJSON('AMBPV0030', srchReq).done(_.bind(function(data){
				this.srchDoneProc(srchReq, data, chkData);

			}, this)).fail(_.bind(function(data){
				this.srchFailProc(data);

			}, this));

			return defer;
		},

		srchDoneProc: function(srchReq, data, chkData){
			// データ取得
			var recs = data.AMBPV0030GetRsp.dayPlans;

			if (_.isEmpty(recs)) {
				// エラーメッセージ表示
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// 検索ペイン／結果ペインを表示
				mainView.srchAreaCtrl.show_both();

				// フォーカス設定
				this.resetFocus(this.srchCondView.$tgtFocus);

			} else {
				clutil.viewReadonly($("#ca_srchArea"));
				$("#searchAgain").text('検索条件を開く');

				var storeCode = data.AMBPV0030GetRsp.storeCodeName.code;
				var storeName = data.AMBPV0030GetRsp.storeCodeName.name;

				this.setRspData(data.AMBPV0030GetRsp);
				this.setPlanTable();

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				var line = '<a id="ca_attachedFile" class="cl_filedownld" href="'
					+ data.AMBPV0030GetRsp.uri + '">'
					+ data.AMBPV0030GetRsp.fileName + '</a>';
				$("#ca_label").html(line);

				if (data.AMBPV0030GetRsp.uri == ''){
					$("#div_ca_file").hide();
				}else{
					$("#div_ca_file").show();
				}

				// 店舗を表示
				$("#disp_storeID").text(storeCode+':'+storeName);

				// フォーカスの設定
				if(typeof $focusElem != 'undefined') {
					this.resetFocus($focusElem);
				}

				// 登録ボタン活性制御
				mainView.mdBaseView.setSubmitEnable(mainView.canUpdate);
				mainView.setSubmitLabel(mainView.canUpdate);
				$("#mainColumnFooter").find(".cl_download").attr('disabled', false);

				this.createGridData();
				this.initGrid();

				this.setGridData();

				var grigParam = {
					gridOptions		: {},					// データグリッドのオプション
					columns			: this.columns,			// カラム定義
					colhdMetadatas	: this.colhdMetadatas,	// メタデータ
					data			: this.gridData 		// データ
				};

				this.grid.setData(grigParam);

				var dataRef = this.grid.getData();
				$.each(dataRef, function(){
					if (this.warning == 1){
						mainView.grid.setCellMessage(this._cl_gridRowId, 'prevWDay_disp', 'warn', '昨年と曜日が異なります');
						mainView.grid.setCellMessage(this._cl_gridRowId, 'wDay_disp', 'warn', '昨年と曜日が異なります');
					}
				});


				$('.replaceTarget').each(function(){var $tgt = $(this); $tgt.html($tgt.text().replace('|','<br/>')); });

				$.when($('#searchAgain')).done(function () {
					var $window = $(window);
					var offset = $('#searchAgain').offset();
					var location = {
						left	: offset.left - $window.scrollLeft(),
						top		: offset.top  - $window.scrollTop()
					};

				    if (location.top < 0){
				    	clcom.targetJump('searchAgain', 50);
				    }
				});
			}
		},

		srchFailProc: function(data){
			// 検索ペインを表示
			mainView.srchAreaCtrl.show_srch();

			// エラーメッセージを通知。
			clutil.mediator.trigger('onTicker', data);

			// フォーカスの設定
			this.resetFocus();
		},

		setRspData: function(rsp){
			var index = 0;
			var sumPrevSale = 0;
			var sumPrevCost = 0;
			var sumSalePlan = 0;
			var sumCost = 0;
			var sumPrevWeekTotal = 0;
			//var sumPrevProfitRate = 0.0;
			var sumPrevProfit = 0;
			//var sumProfitRate = 0.0;
			var sumProfit = 0;
			var funcRoundRate = this.roundRate2;
			var isStore = false;
			var weekTotalRow = [];
			var rowIndex = 0;

			if (opeTypeKind == TYPE_KIND.STORE){
				isStore = true;
			}

			mainView.canUpdate = false;
			var opeDate = clcom.getOpeDate();
			var prevWeekTotal = 0;

			rsp.dayPlans[rsp.dayPlans.length-1].lastDay = true;	// 最終日フラグ設定

			var w = ["","月","火","水","木","金","土","日"];
			$.each(rsp.dayPlans, function(){
				var profitRateReadonly = '';
				var strPrevDay = this.prevDay.toString();
				var strDay = this.day.toString();

				this.isStore = isStore;

				this.prevDayDisp = Number(strPrevDay.substring(4,6)) + '/' + Number(strPrevDay.substring(6,8));
				this.dayDisp = Number(strDay.substring(4,6)) + '/' + Number(strDay.substring(6,8));

				this.prevWDay_disp = w[this.prevWDay];
				this.wDay_disp = w[this.wDay];

				if (this.prevWDay == this.wDay) {
					this.warning = 0;
				} else {
					this.warning = 1;
				}

				if (this.prevWDay == 7) {
					this.cl_pw_fDay = 'txtDanger';
					weekTotalRow.push({
						index	: rowIndex,
						data	: this
					});
				} else if (this.prevWDay == 6) {
					this.cl_pw_fDay = 'txtPrimary';
				} else {
					this.cl_pw_fDay = '';
				}

				if (this.f_holiday == 1) {
					this.cl_w_fDay = 'txtDanger';
				} else {
					if (this.wDay == 7) {
						this.cl_w_fDay = 'txtDanger';
					} else if (this.wDay == 6) {
						this.cl_w_fDay = 'txtPrimary';
					} else {
						this.cl_w_fDay = '';
					}
				}

				prevWeekTotal += this.prevSale;

				this.prevSaleDisp = Math.round(this.prevSale / 1000);
				this.prevWeekTotalDisp = Math.round(this.prevWeekTotal / 1000);
				this.prevCost = this.prevProfitRate / 100 * this.prevSale,
				this.cost = this.profitRate / 100 * this.salePlan,
				this.salePlanDisp = Math.round(this.salePlan / 1000);
				this.weekTotalDisp = Math.round(this.weekTotal / 1000);
				if (this.lastDay === true) {
					this.prevWeekTotal = prevWeekTotal;
					this.prevWeekTotalDisp = Math.round(prevWeekTotal / 1000);
				}
				if (this.wDay == 7) {
					prevWeekTotal = 0;
				}

				this.index = index++;

				var disabled = false;
				if (this.day <= opeDate) {
					disabled = true;
				}else{
					mainView.canUpdate = true;
				}

				if (disabled) {
					this.readonly='readonly';
				}else{
					this.readonly='';
				}
				if (opeTypeKind < TYPE_KIND.KEISEN || disabled) {
					profitRateReadonly = 'readonly';
				}
				this.profitRateReadonly = profitRateReadonly;

				sumPrevCost += this.prevCost;
				sumPrevSale += this.prevSale;
				sumCost += this.cost;
				sumSalePlan += this.salePlan;
				sumPrevWeekTotal += this.prevWeekTotal;
				//sumPrevProfitRate += this.prevProfitRate;
				//sumProfitRate += this.profitRate;
				sumPrevProfit += (this.prevSale * this.prevProfitRate);
				sumProfit += (this.salePlan * this.profitRate);

				rowIndex++;
			});

			var sumPrevProfitRate = sumPrevSale != 0 ? sumPrevProfit / sumPrevSale : 0;
			var sumProfitRate = sumSalePlan != 0 ? sumProfit / sumSalePlan : 0;

			rsp.total = {
				sumPrevSale: sumPrevSale,
				sumPrevWeekTotal: sumPrevWeekTotal,
				//prevProfitRate: funcRoundRate(sumPrevCost, sumPrevSale),
				//profitRate: funcRoundRate(sumCost, sumSalePlan),
				//prevProfitRate: funcRoundRate(sumPrevProfitRate, rowIndex),
				//profitRate: funcRoundRate(sumProfitRate, rowIndex)
				prevProfitRate: sumPrevProfitRate.toFixed(1),
				profitRate: sumProfitRate.toFixed(1),
			};

			rsp.weekTotalRow = weekTotalRow;

			this.getRsp = rsp;
		},

		roundRate: function(lhs, rhs) {
			return (rhs) ? Math.round(lhs / rhs * 100 * 10) / 10 : 0;
		},
		roundRate2: function(lhs, rhs) {
			return (rhs) ? Math.round(lhs / rhs * 10) / 10 : 0;
		},

		setPlanTable: function() {
			var funcRoundRate = this.roundRate;
			var sumSalePlan = 0;
			var sumCost = 0;
			var sumWeekTotal = 0;
			var sumProfit = 0.0;
			var length = 0;

			$.each(this.getRsp.dayPlans,function(){
				sumSalePlan += this.salePlan;
				sumCost += this.cost;
				sumWeekTotal += this.salePlan;
				sumProfit += (this.salePlan * this.profitRate);

				if (this.wDay == 7 || this.lastDay === true) {
					this.weekTotal = sumWeekTotal;
					this.weekTotalDisp = Math.round(this.weekTotal / 1000);
					this.weekTotalPrevRate = funcRoundRate(this.weekTotal, this.prevWeekTotal);
					sumWeekTotal = 0;
				}

				length++;
			});

			var sumProfitRate = sumSalePlan != 0 ? sumProfit / sumSalePlan : 0;

			this.getRsp.total.sumSalePlan = sumSalePlan;
			this.getRsp.total.sumCost = sumCost;
			//this.getRsp.total.profitRate = funcRoundRate(sumCost, sumSalePlan);
			this.getRsp.total.profitRate = sumProfitRate.toFixed(1);

			$.each(this.getRsp.dayPlans, function(){
				this.compoRate = funcRoundRate(this.salePlan, sumSalePlan);
			});
		},

		setGridData: function(){
			var total = $.extend(true, {}, this.getRsp.dayPlans[0]);
			this.setTotalData(total);

			this.gridData = $.extend(true, [], this.getRsp.dayPlans);
			this.gridData.push(total);
		},

		setTotalData: function(total){
			total.cl_pw_fDay = '';
			total.cl_w_fDay = '';
			total.compoRate = '';
			total.cost = 0;
			total.day = 0;
			total.dayDisp = '';
			total.index = 0;
			//total.isStore = false;
			total.prevCompoRate = '-';
			total.prevCost = 0;
			total.prevDay = 0;
			total.prevDayDisp = '合計';
			total.prevProfitRate = this.getRsp.total.prevProfitRate;
			total.prevRate = '-';
			total.prevSale = this.getRsp.total.sumPrevSale;
			total.prevSaleDisp = Math.round(this.getRsp.total.sumPrevSale / 1000);
			total.prevWDay = 0;
			total.prevWDay_disp = '';
			total.prevWeekTotal = this.getRsp.total.sumPrevWeekTotal;
			total.prevWeekTotalDisp = Math.round(this.getRsp.total.sumPrevWeekTotal / 1000);
//			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
//				total.profitRate = '月計画 ' + clutil.comma(Math.round(this.getRsp.monthSalePlan / 1000));
//			} else {
//				total.profitRate = '月計画 ' + clutil.comma(Math.round(this.getRsp.monthSalePlan / 1000)) + ' / 月荒利率計画 ' + clutil.comma(this.getRsp.monthProfitRate);
//			}
//			total.profitRate = '月計画 ' + clutil.comma(Math.round(this.getRsp.monthSalePlan / 1000)) + ' / 月荒利率計画 ' + clutil.comma(this.getRsp.monthProfitRate);
//			total.profitRate = total.profitRate.replace(',','&#44;');
			total.monthTotalStr = '月計画 ' + clutil.comma(Math.round(this.getRsp.monthSalePlan / 1000)) + ' / 月荒利率計画 ' + clutil.comma(this.getRsp.monthProfitRate);
			total.monthTotalStr = total.monthTotalStr.replace(',','&#44;');
			total.profitRate = this.getRsp.total.profitRate;;
			total.profitRateReadonly = "readonly";
			total.readonly = "readonly";
			total.recno = '';
			total.salePlan = this.getRsp.total.sumSalePlan;
			total.salePlanDisp = Math.round(this.getRsp.total.sumSalePlan / 1000);
			total.state = 0;
			total.storeComment = '';
			total.wDay = 0;
			total.wDay_disp = '';
			total.warning = 0;
			total.weekTotal = '';
			total.weekTotalDisp = '';
			total.weekTotalPrevRate = 0;
		},

		/**
		 * ダウンロードする
		 */
		doPDFDownload: function(){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(( typeof srchReq == 'undefined' ) || _.isNull(srchReq)) {
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}

			srchReq.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF;

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMBPV0030', srchReq);
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
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:	// PDF 出力
				console.log('PDF 出力');
				this.doPDFDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// 他画面からの呼出はこのメソッドが使用される。
			// 自画面からの起動はdoSrchに行く。
			if (typeof this.srchCondView.initialized == 'undefined'){

				this.delayedCallParam = {
						args:args,
						e:e
				};

				return;
			}

			var data = args.data;

			switch(args.status){
			case 'OK':
				// 検索条件を復元する
				this.srchCondView.deserialize(this.tempSrchReq.AMBPV0030GetReq);

				var storeID = args.data.AMBPV0030GetRsp.storeCodeName.id;
				var storeCode = args.data.AMBPV0030GetRsp.storeCodeName.code;
				var storeName = args.data.AMBPV0030GetRsp.storeCodeName.name;

				if (clcom.userInfo.org_kind_typeid == amcm_type.AMCM_VAL_ORG_KIND_ZONE) {
					var obj = {
						id: storeID,
						code: storeCode,
						name: storeName
					};
					$("#ca_srchStoreID").autocomplete('clAutocompleteItem', obj);
				} else {
					this.srchCondView.fieldRelation.set('clorgcode',
						{id: storeID, code: storeCode, name: storeName}
					);
				}
		    	this.srchCondView.fieldRelation.reset();

				this.srchCondView.fieldRelation.done(function() {
					clutil.viewReadonly($("#div_ca_store"));
					clutil.viewReadonly("#div_ca_unit");
				});

				// 検索結果を表示する
				this.srchDoneProc(this.tempSrchReq, data);

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

			this.validator.clear();
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
			if (typeof this.grid != 'undefined'){
				this.grid.setEditable(false);
			}
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex) {

			var req = {
				srchUnitID	:0,
				srchStoreID	:0,
				srchMonth	:0
			};

		    if (!_.isEmpty(this.options.chkData)) {
		    	if (this.options.chkData.length > 0) {
		    		if (typeof this.options.srchCond != 'undefined'){
			    		var srchCond = this.options.srchCond;
			    		req.srchUnitID = srchCond.srchUnitID;
			    		req.srchMonth = srchCond.srchMonth;
			    		req.srchStoreID = srchCond.store.id;
			    		req.store = srchCond.store;
		    		} else {
			    		req.srchUnitID = clcom.userInfo.unit_id;
			    		req.srchMonth = this.options.chkData[pgIndex].srchMonth;
			    		req.srchStoreID = this.options.chkData[pgIndex].srchStoreID;
		    		}
		    	}
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
				AMBPV0030GetReq: req,
				// 更新リクエスト
				AMBPV0030UpdReq: {}
			};

			this.tempSrchReq = getReq;

			return {
				resId: clcom.pageId,	//'AMEQV0060',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			this.grid.stopEditing();

			if(!this.validator.valid()) {
				return null;
			}

			// Recを構築する。

			// opeTypeを設定する
			var fixedOpeTypeId;
			if (opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				fixedOpeTypeId = mainView.opeTypePatch[0];
				operationName = this.submitBtn1.text();
			} else {
				fixedOpeTypeId = mainView.opeTypePatch[1];
				operationName = this.submitBtn2.text();
			}
			if (fixedOpeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK) {
				if (this.getRsp.total.sumSalePlan != this.getRsp.monthSalePlan) {
					mainView.validator.setErrorHeader(clmsg.EBP0006);
					return null;
				}
			}

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: fixedOpeTypeId
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// マスタ検索リクエスト
				AMBPV0030GetReq: this.savedReq.AMBPV0030GetReq,
				// マスタ更新リクエスト
				AMBPV0030UpdReq: {
					dayPlans	: this.getRsp.dayPlans
				}
			};

//return null;
			return {
				resId: clcom.pageId,	//'AMBPV0030',
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
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}
		},

		setSubmitLabel: function(enabled){
			if (this.getRsp == null || this.getRsp == 'undefined'){
				this.submitBtn1.text('登録');
				this.submitBtn2.text('申請');
				return;
			}

			var ENABLED_TRUE = enabled;

			var btnLabel = new Array();
			var btnEnabled = new Array();

			this.opeTypePatch = new Array();

			if (opeTypeKind == TYPE_KIND.AREA_AJA) {
				// エリアAJA
				this.opeTypePatch =
					[am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK,
					 am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL];
				btnLabel = ['差戻し', '承認'];

				// 編集対象：申請中
				if (this.getRsp.approveTypeId == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_YET) {
					btnEnabled = [ENABLED_TRUE, ENABLED_TRUE];
				} else {
					btnEnabled = [false, false];
				}

			} else if (opeTypeKind == TYPE_KIND.ZONE_AJA) {
				btnLabel = ['差戻し', '承認'];
				// ゾーンAJA
				this.opeTypePatch =
					[am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK,
					 am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL];

				// 編集対象：店舗申請中、エリアAJA承認
				if (this.getRsp.approveTypeId == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_YET ||
						this.getRsp.approveTypeId == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_AREA) {
					btnEnabled = [ENABLED_TRUE, ENABLED_TRUE];
				} else {
					btnEnabled = [false, false];
				}
			} else if (opeTypeKind >= TYPE_KIND.KEISEN) {
				// 経戦
				btnLabel = ['差戻し', '承認'];
				this.opeTypePatch =
					[am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK,
					 am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL];

				//  編集対象：店舗申請中、経戦承認前
				if (this.getRsp.approveTypeId > amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET &&
					this.getRsp.approveTypeId <= amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_KEISEN) {

					if (this.getRsp.approveTypeId == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_KEISEN){
						btnLabel = ['差戻し', '登録'];
						btnEnabled = [false, ENABLED_TRUE];
					}else{
						btnEnabled = [ENABLED_TRUE, ENABLED_TRUE];
					}
				} else {
					btnLabel = ['差戻し', '承認'];
					btnEnabled = [false, ENABLED_TRUE];
				}
			} else {
				// 店舗
				//  編集対象：未申請
				if (this.getRsp.approveTypeId == amcm_type.AMCM_VAL_OPER_PLAN_APPROVE_NOTYET) {
					btnLabel = ['一時保存', '申請'];
					this.opeTypePatch =
						[am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE,
						 am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY];
					btnEnabled = [ENABLED_TRUE, ENABLED_TRUE];
				} else {
					//2016.06.02　追加　申請期間内の差し戻しを可能にする　ここから
					btnLabel = ['登録', '申請']; //2016.06.02 「申請」→「差し戻し」に変更
					this.opeTypePatch =
						[am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
						 am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY];

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
				if ($btn.text() == '差戻し') {
					$btn.addClass('btnPassback');
				}
				$btn.removeAttr('disabled').parent().removeClass('disable');
			}else{
				$btn.attr('disabled','disabled').parent().addClass('disable');
			}
		},

		_eof: 'AMBPV0030.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		if (typeof clcom.pageArgs != 'undefined' && typeof clcom.pageArgs.data != 'undefined'){
			clcom.pageArgs.chkData = [{
				srchMonth	:clcom.pageArgs.data.srchMonth,
				srchStoreID	:clcom.pageArgs.data.srchStoreID
			}];
		}

		mainView = new MainView(clcom.pageArgs).initUIElement().render();

		$("#mainColumnFooter p.right").hide();
		$("#mainColumnFooter p.left").hide();

		// ボタンをビューに保存する
		var $submit = $('#mainColumnFooter').find('.cl_submit');
		var filterProc = function($obj, opeTypeId) {return ($obj.data().opetypeid==opeTypeId) ? $obj : null; };

		mainView.submitBtn1 = $submit.filter(function(){
			return filterProc($(this), am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW);
		});
		mainView.submitBtn2 = $submit.filter(function(){
			return filterProc($(this), am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
		});

		// 登録ボタン表示設定
		mainView.setSubmitLabel(false);

		// 自画面起点の場合
		if (clcom.pageArgs == null) {
			// 登録ボタン活性制御
			mainView.mdBaseView.setSubmitEnable(false);
			$("#mainColumnFooter").find(".cl_download").attr('disabled', false);
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
