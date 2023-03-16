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

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var timer = false;
	$(window).resize(function() {
	    if (timer !== false) {
	        clearTimeout(timer);
	    }
	    timer = setTimeout(function() {
			if (!_.isUndefined(mainView)){
				if (!_.isUndefined(mainView.grid_plan) && !_.isUndefined(mainView.grid_plan.grid)){
					mainView.grid_plan.grid.resizeCanvas();
				}
				if (!_.isUndefined(mainView.grid_result) && !_.isUndefined(mainView.grid_result.grid)){
					mainView.grid_result.grid.resizeCanvas();
				}
			}
	    }, 100);
	});

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',		// 店舗選択ボタン
			'click #ca_srch'				: '_onSrchClick',			// 検索ボタン押下時
			'change #ca_srchUnitID'			: '_onUnitChanged',			// 事業ユニット変更
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
				func_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id	: org_id,
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
						initValue: clcom.userInfo.unit_id,
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
						orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					}
				});
			}
			this.fieldRelation.done(function() {
				var tgtView = mainView.srchCondView;
				tgtView.utl_unit = this.fields.clbusunitselector;
				if (clcom.userInfo.org_kind_typeid != amcm_type.AMCM_VAL_ORG_KIND_ZONE) {
					tgtView.utl_store = this.fields.clorgcode;
				}
				tgtView.setInitializeValue();
				tgtView.setDefaultEnabledProp();
				tgtView._onUnitChanged();
			});

			this.prevUnitId = clcom.userInfo.unit_id;

			// 年度 FIXME 暫定
			this.utl_year = clutil.clyearselector(
				this.$("#ca_srchYear"),
				0,
				2,//clutil.getclsysparam('PAR_AMCM_YEAR_FROM'),
				2,//clutil.getclsysparam('PAR_AMCM_YEAR_TO'),
				"年度");
			this.init_ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');

			// 初期フォーカスオブジェクト設定
			if (opeTypeKind >= TYPE_KIND.FULL) {
				this.$tgtFocus = $('#ca_srchUnitID');
			}
			else if (opeTypeKind >= TYPE_KIND.EDITABLE) {
				this.$tgtFocus = $('#ca_srchStoreID');
			} else {
				this.$tgtFocus = $('#ca_srchYear');
			}

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);
		},

		setInitializeValue: function(){
			if (opeTypeKind == TYPE_KIND.STORE) {
				$(this.utl_store.el).autocomplete('clAutocompleteItem', {id: clcom.userInfo.org_id, code: clcom.userInfo.org_code, name: clcom.userInfo.org_name});
				this.utl_store.setValue({id: clcom.userInfo.org_id, code: clcom.userInfo.org_code, name: clcom.userInfo.org_name});
			}

			mainView.mdBaseView.options.subtitle = '登録';
		},

		setDefaultEnabledProp: function() {
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
				clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.viewReadonly("#div_ca_store");
				$('#mainColumnFooter .cl_submit').hide();
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
				isAnalyse_mode 	: false,						// 通常画面モード
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

		_eof: 'AMBPV0020.SrchCondView//'
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
					title: '店舗月別計画',
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
					btn_cancel: {label:'条件再設定', action:this._doCancel},
					confirmLeaving:(clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE && clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN),
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
			this.grid_result = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid_result',	// エレメント
				lineno			: false,			// 行番号表示する/しないフラグ。
				delRowBtn		: false,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: false,			// フッター部の新規行追加ボタンを使用するフラグ。
			});

			this.grid_plan = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid_plan',	// エレメント
				lineno			: false,			// 行番号表示する/しないフラグ。
				delRowBtn		: false,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: false,			// フッター部の新規行追加ボタンを使用するフラグ。
			});

			this.grid_result.getMetadata = this.getMetadata_result;
			this.grid_plan.getMetadata = this.getMetadata_plan;

			// セル変更
			this.listenTo(this.grid_plan, 'cell:change', this.gridCellChange);

			this.grid_result.render();
			this.grid_plan.render();
		},

		getMetadata_result: function(rowIndex){
			var checkData = this.gridData_result[rowIndex];
			return this.getMetadataProc(checkData);
		},

		getMetadata_plan: function(rowIndex){
			var checkData = this.gridData_plan[rowIndex];
			return this.getMetadataProc(checkData);
		},

		getMetadataProc : function(checkData){
			var columns = {
				colHeader: {
					cssClasses: 'colhead',
				},
				h1: {
					cssClasses: 'reference',
				},
				h2: {
					cssClasses: 'reference',
				},
				yt: {
					cssClasses: 'reference',
				},
			};

			if (checkData.headline){
				columns['colHeader'].colspan = '*';
			}

			return {
				 columns: columns
			};
		},

		getCellTypeResult: function(data){
			var row = data.row - 1;

			var chkData = this.gridData_result[row];
			var ret = null;

			if (chkData.celltype == 1) {
				ret = {
					formatFilter	: "comma",
				};
			} else if (chkData.celltype == 2) {
				return  {
					formatFilter	: "comma fixed:1",
				};
			}

			return ret;
		},

		getCellTypePlan2: function(data){
			var row = data.row - 1;

			var chkData = this.gridData_plan[row];
			var ret = null;

			if (chkData.celltype == 1) {
				ret = {
					formatFilter	: "comma",
				};
			} else if (chkData.celltype == 2) {
				return  {
					formatFilter	: "comma fixed:1",
				};
			}

			return ret;
		},

		getCellTypePlan: function(data){
			var row = data.row - 1;

			if (row == 0){
				return;
			}

			var phRate = clutil.getclsysparam('PAR_AMCM_DEFAULT_PERCENT_DECIMAL');
			var chkData = this.gridData_plan[row];
			var ret = null;

			if (chkData.celltype == 1) {
				ret = {
					type			: 'text',
					limit			: "number:12",
					formatFilter	: "comma",
					editorOptions	:
					{
						addClass	: 'txtar slimRow',
					},
					isEditable		: function(item, row, column, dataView){
						return (item.readonly[column.id] == '');
					},
				};
			} else if (chkData.celltype == 2 && row == 3) {
				ret = {
					type			: 'text',
					limit			: "number:2,1",
					formatFilter	: "comma fixed:1",
					editorOptions	:
					{
						addClass	: 'txtar slimRow',
						attributes	:
						{
							placeholder	: phRate,
						}
					},
					isEditable		: function(item, row, column, dataView){
						return (item.readonly[column.id] == '');
					},
				};
			} else {
				return  {
					formatFilter	: "comma fixed:1",
				};
			}

			return ret;
		},

		createGridData: function(){

			this.columns_result =
			[
			 	{
			 		id		: 'colHeader',
			 		name	: '',
			 		field	: 'colHeader',
			 		width	: 80,
			 		cssClass: 'slimRow',
			 	},
			 	{
			 		id		: 'm4',
			 		name	: '4月',
			 		field	: 'm4',
			 		width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'm5',
			 		name	: '5月',
			 		field	: 'm5',
			 		width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'm6',
			 		name	: '6月',
			 		field	: 'm6',
			 		width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'm7',
			 		name	: '7月',
			 		field	: 'm7',
			 		width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'm8',
			 		name	: '8月',
			 		field	: 'm8',
			 		width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'm9',
			 		name	: '9月',
			 		field	: 'm9',
			 		width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'h1',
			 		name	: '上半期',
			 		field	: 'h1',
			 		width	: 76,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'm10',
			 		name	: '10月',
			 		field	: 'm10',
			 		width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'm11',
			 		name	: '11月',
			 		field	: 'm11',
			 		width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'm12',
			 		name	: '12月',
			 		field	: 'm12',
			 		width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'm1',
			 		name	: '1月',
			 		field	: 'm1',
			 		width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'm2',
			 		name	: '2月',
			 		field	: 'm2',
			 		width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'm3',
			 		name	: '3月',
			 		field	: 'm3',
			 		width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'h2',
			 		name	: '下半期',
			 		field	: 'h2',
			 		width	: 76,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			 	{
			 		id		: 'yt',
			 		name	: '年合計',
			 		field	: 'yt',
			 		width	: 84,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypeResult,
			 	},
			];

			this.columns_plan =
			[
				{
					id		: 'colHeader',
					name	: '',
					field	: 'colHeader',
				 	width	: 80,
				 	cssClass: 'slimRow',
				 },
				{
					id		: 'm4',
					name	: '4月',
					field	: 'm4',
					width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan,
				},
				{
					id		: 'm5',
					name	: '5月',
					field	: 'm5',
					width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan,
				},
				{
					id		: 'm6',
					name	: '6月',
					field	: 'm6',
					width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan,
				},
				{
					id		: 'm7',
					name	: '7月',
					field	: 'm7',
					width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan,
				},
				{
					id		: 'm8',
					name	: '8月',
					field	: 'm8',
					width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan,
				},
				{
					id		: 'm9',
					name	: '9月',
					field	: 'm9',
					width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan,
				},
				{
					id		: 'h1',
					name	: '上半期',
					field	: 'h1',
					width	: 76,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan2,
				},
				{
					id		: 'm10',
					name	: '10月',
					field	: 'm10',
					width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan,
				},
				{
					id		: 'm11',
					name	: '11月',
					field	: 'm11',
					width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan,
				},
				{
					id		: 'm12',
					name	: '12月',
					field	: 'm12',
					width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan,
				},
				{
					id		: 'm1',
					name	: '1月',
					field	: 'm1',
					width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan,
				},
				{
					id		: 'm2',
					name	: '2月',
					field	: 'm2',
					width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan,
				},
				{
					id		: 'm3',
					name	: '3月',
					field	: 'm3',
					width	: 68,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan,
				},
				{
					id		: 'h2',
					name	: '下半期',
					field	: 'h2',
					width	: 76,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan2,
				},
				{
					id		: 'yt',
					name	: '年合計',
					field	: 'yt',
					width	: 84,
					cssClass: 'txtalign-right slimRow',
					cellType: this.getCellTypePlan2,
				},
			];
		},

		setGridData: function(){
			var result = new Array();
			var plan = new Array();

			//$.each(this.recList[0], function(index) {
			for (var i = this.recList[0].length - 1; i >= 0; i--){

				var recData = this.recList[0][i];

				var head = {
					headline  : true,
					colHeader : recData.year.toString().substring(2,4) + '年度',
					celltype  : 0,
					m4 : 0, m5 : 0, m6 : 0, m7 : 0, m8 : 0, m9 : 0,
					m10 : 0, m11 : 0, m12 : 0, m1 : 0, m2 : 0, m3 : 0,
					h1 : 0, h2 : 0, yt : 0,
				};

				var readonly = {
					m4  : recData.month[4].readonly,
					m5  : recData.month[5].readonly,
					m6  : recData.month[6].readonly,
					m7  : recData.month[7].readonly,
					m8  : recData.month[8].readonly,
					m9  : recData.month[9].readonly,
					m10 : recData.month[10].readonly,
					m11 : recData.month[11].readonly,
					m12 : recData.month[12].readonly,
					m1  : recData.month[1].readonly,
					m2  : recData.month[2].readonly,
					m3  : recData.month[3].readonly,
				};

				var sale = {
					headline  : false,
					colHeader : '実績',
					celltype  : 1,
					readonly  : readonly,
					m4  : recData.month[4].saleResult,
					m5  : recData.month[5].saleResult,
					m6  : recData.month[6].saleResult,
					m7  : recData.month[7].saleResult,
					m8  : recData.month[8].saleResult,
					m9  : recData.month[9].saleResult,
					m10 : recData.month[10].saleResult,
					m11 : recData.month[11].saleResult,
					m12 : recData.month[12].saleResult,
					m1  : recData.month[1].saleResult,
					m2  : recData.month[2].saleResult,
					m3  : recData.month[3].saleResult,
					h1  : recData.H1SaleResult,
					h2  : recData.H2SaleResult,
					yt  : recData.totalSaleResult,
				};
				var prevRate = {
					headline  : false,
					colHeader : '前年比(%)',
					celltype  : 2,
					readonly  : readonly,
					m4  : recData.month[4].prevRate,
					m5  : recData.month[5].prevRate,
					m6  : recData.month[6].prevRate,
					m7  : recData.month[7].prevRate,
					m8  : recData.month[8].prevRate,
					m9  : recData.month[9].prevRate,
					m10 : recData.month[10].prevRate,
					m11 : recData.month[11].prevRate,
					m12 : recData.month[12].prevRate,
					m1  : recData.month[1].prevRate,
					m2  : recData.month[2].prevRate,
					m3  : recData.month[3].prevRate,
					h1  : recData.H1PrevRate,
					h2  : recData.H2PrevRate,
					yt  : recData.totalPrevRate,
				};
				var profitRate = {
					headline  : false,
					colHeader : '荒利率(%)',
					celltype  : 2,
					readonly  : readonly,
					m4  : recData.month[4].profitRateResult,
					m5  : recData.month[5].profitRateResult,
					m6  : recData.month[6].profitRateResult,
					m7  : recData.month[7].profitRateResult,
					m8  : recData.month[8].profitRateResult,
					m9  : recData.month[9].profitRateResult,
					m10 : recData.month[10].profitRateResult,
					m11 : recData.month[11].profitRateResult,
					m12 : recData.month[12].profitRateResult,
					m1  : recData.month[1].profitRateResult,
					m2  : recData.month[2].profitRateResult,
					m3  : recData.month[3].profitRateResult,
					h1  : recData.H1ProfitRateResult,
					h2  : recData.H2ProfitRateResult,
					yt  : recData.totalProfitRateResult,
				};
				var compoRate = {
					headline  : false,
					colHeader : '構成比(%)',
					celltype  : 2,
					readonly  : readonly,
					m4  : recData.month[4].compoRate,
					m4  : recData.month[4].compoRate,
					m5  : recData.month[5].compoRate,
					m6  : recData.month[6].compoRate,
					m7  : recData.month[7].compoRate,
					m8  : recData.month[8].compoRate,
					m9  : recData.month[9].compoRate,
					m10 : recData.month[10].compoRate,
					m11 : recData.month[11].compoRate,
					m12 : recData.month[12].compoRate,
					m1  : recData.month[1].compoRate,
					m2  : recData.month[2].compoRate,
					m3  : recData.month[3].compoRate,
					h1  : recData.H1CompoRate,
					h2  : recData.H2CompoRate,
					yt  : recData.totalCompoRate,
				};

				result.push(head);
				result.push(sale);
				if (recData.index > 0){
					result.push(prevRate);
				}
				result.push(profitRate);
				result.push(compoRate);
			}

			this.gridData_result = result;

			var planData = this.recList[1][0];

			var readonly = {
				m4  : planData.month[4].readonly,
				m5  : planData.month[5].readonly,
				m6  : planData.month[6].readonly,
				m7  : planData.month[7].readonly,
				m8  : planData.month[8].readonly,
				m9  : planData.month[9].readonly,
				m10 : planData.month[10].readonly,
				m11 : planData.month[11].readonly,
				m12 : planData.month[12].readonly,
				m1  : planData.month[1].readonly,
				m2  : planData.month[2].readonly,
				m3  : planData.month[3].readonly,
			};

			var head = {
				headline  : true,
				celltype  : 0,
				colHeader : planData.year.toString().substring(2,4) + '年度',
				m4 : 0, m5 : 0, m6 : 0, m7 : 0, m8 : 0, m9 : 0,
				m10 : 0, m11 : 0, m12 : 0, m1 : 0, m2 : 0, m3 : 0,
				h1 : 0, h2 : 0, yt : 0,
			};

			var sale = {
				headline  : false,
				colHeader : '営業案',
				celltype  : 1,
				readonly  : readonly,
				m4  : planData.month[4].salePlanDisp,
				m5  : planData.month[5].salePlanDisp,
				m6  : planData.month[6].salePlanDisp,
				m7  : planData.month[7].salePlanDisp,
				m8  : planData.month[8].salePlanDisp,
				m9  : planData.month[9].salePlanDisp,
				m10 : planData.month[10].salePlanDisp,
				m11 : planData.month[11].salePlanDisp,
				m12 : planData.month[12].salePlanDisp,
				m1  : planData.month[1].salePlanDisp,
				m2  : planData.month[2].salePlanDisp,
				m3  : planData.month[3].salePlanDisp,
				h1  : planData.H1SalePlanDisp,
				h2  : planData.H2SalePlanDisp,
				yt  : planData.totalSalePlanDisp,
			};
			var prevRate = {
				headline  : false,
				colHeader : '前年比(%)',
				celltype  : 2,
				readonly  : readonly,
				m4  : planData.month[4].prevRate,
				m5  : planData.month[5].prevRate,
				m6  : planData.month[6].prevRate,
				m7  : planData.month[7].prevRate,
				m8  : planData.month[8].prevRate,
				m9  : planData.month[9].prevRate,
				m10 : planData.month[10].prevRate,
				m11 : planData.month[11].prevRate,
				m12 : planData.month[12].prevRate,
				m1  : planData.month[1].prevRate,
				m2  : planData.month[2].prevRate,
				m3  : planData.month[3].prevRate,
				h1  : planData.H1PrevRate,
				h2  : planData.H2PrevRate,
				yt  : planData.totalPrevRate,
			};
			var profitRate = {
				headline  : false,
				colHeader : '荒利率(%)',
				celltype  : 2,
				readonly  : readonly,
				m4  : planData.month[4].profitRatePlan,
				m5  : planData.month[5].profitRatePlan,
				m6  : planData.month[6].profitRatePlan,
				m7  : planData.month[7].profitRatePlan,
				m8  : planData.month[8].profitRatePlan,
				m9  : planData.month[9].profitRatePlan,
				m10 : planData.month[10].profitRatePlan,
				m11 : planData.month[11].profitRatePlan,
				m12 : planData.month[12].profitRatePlan,
				m1  : planData.month[1].profitRatePlan,
				m2  : planData.month[2].profitRatePlan,
				m3  : planData.month[3].profitRatePlan,
				h1  : planData.H1ProfitRatePlan,
				h2  : planData.H2ProfitRatePlan,
				yt  : planData.totalProfitRatePlan,
			};
			var compoRate = {
				headline  : false,
				colHeader : '構成比(%)',
				celltype  : 2,
				readonly  : readonly,
				m4  : planData.month[4].compoRate,
				m5  : planData.month[5].compoRate,
				m6  : planData.month[6].compoRate,
				m7  : planData.month[7].compoRate,
				m8  : planData.month[8].compoRate,
				m9  : planData.month[9].compoRate,
				m10 : planData.month[10].compoRate,
				m11 : planData.month[11].compoRate,
				m12 : planData.month[12].compoRate,
				m1  : planData.month[1].compoRate,
				m2  : planData.month[2].compoRate,
				m3  : planData.month[3].compoRate,
				h1  : planData.H1CompoRate,
				h2  : planData.H2CompoRate,
				yt  : planData.totalCompoRate,
			};

			plan.push(head);
			plan.push(sale);
			plan.push(prevRate);
			plan.push(profitRate);
			plan.push(compoRate);

			this.gridData_plan = plan;
		},

		gridCellChange: function(args){
			var id = args.column.id;
			//var rowIndex = Number(args.row - 1);
			//var colIndex = Math.floor(Number(args.cell-1) / 2);
			var month = ~~id.substring(1);

			var planData = this.recList[1][0];

			if (args.item.celltype == '1'){
				var curValue = Number(args.item[id].replace(/[^0-9]/g, "").substring(0,12));
				args.item[id] = curValue;

				planData.month[month].salePlanDisp = curValue;
				planData.month[month].salePlan = curValue * 1000;

				this.setPlanTable(month);

			} else if (args.item.celltype == '2'){
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
				var curValue = Number(valTmp);

				args.item[id] = curValue;
				planData.month[month].profitRatePlan = curValue;

				this.setPlanTable(month);
			}

			//this.setGridData();
			var dataRef = this.grid_plan.getData();

			dataRef[1].m4  = planData.month[4].salePlanDisp;
			dataRef[1].m5  = planData.month[5].salePlanDisp;
			dataRef[1].m6  = planData.month[6].salePlanDisp;
			dataRef[1].m7  = planData.month[7].salePlanDisp;
			dataRef[1].m8  = planData.month[8].salePlanDisp;
			dataRef[1].m9  = planData.month[9].salePlanDisp;
			dataRef[1].m10 = planData.month[10].salePlanDisp;
			dataRef[1].m11 = planData.month[11].salePlanDisp;
			dataRef[1].m12 = planData.month[12].salePlanDisp;
			dataRef[1].m1  = planData.month[1].salePlanDisp;
			dataRef[1].m2  = planData.month[2].salePlanDisp;
			dataRef[1].m3  = planData.month[3].salePlanDisp;
			dataRef[1].h1  = planData.H1SalePlanDisp;
			dataRef[1].h2  = planData.H2SalePlanDisp;
			dataRef[1].yt  = planData.totalSalePlanDisp;

			dataRef[2].m4  = planData.month[4].prevRate;
			dataRef[2].m5  = planData.month[5].prevRate;
			dataRef[2].m6  = planData.month[6].prevRate;
			dataRef[2].m7  = planData.month[7].prevRate;
			dataRef[2].m8  = planData.month[8].prevRate;
			dataRef[2].m9  = planData.month[9].prevRate;
			dataRef[2].m10 = planData.month[10].prevRate;
			dataRef[2].m11 = planData.month[11].prevRate;
			dataRef[2].m12 = planData.month[12].prevRate;
			dataRef[2].m1  = planData.month[1].prevRate;
			dataRef[2].m2  = planData.month[2].prevRate;
			dataRef[2].m3  = planData.month[3].prevRate;
			dataRef[2].h1  = planData.H1PrevRate;
			dataRef[2].h2  = planData.H2PrevRate;
			dataRef[2].yt  = planData.totalPrevRate;

			dataRef[3].m4  = planData.month[4].profitRatePlan;
			dataRef[3].m5  = planData.month[5].profitRatePlan;
			dataRef[3].m6  = planData.month[6].profitRatePlan;
			dataRef[3].m7  = planData.month[7].profitRatePlan;
			dataRef[3].m8  = planData.month[8].profitRatePlan;
			dataRef[3].m9  = planData.month[9].profitRatePlan;
			dataRef[3].m10 = planData.month[10].profitRatePlan;
			dataRef[3].m11 = planData.month[11].profitRatePlan;
			dataRef[3].m12 = planData.month[12].profitRatePlan;
			dataRef[3].m1  = planData.month[1].profitRatePlan;
			dataRef[3].m2  = planData.month[2].profitRatePlan;
			dataRef[3].m3  = planData.month[3].profitRatePlan;
			dataRef[3].h1  = planData.H1ProfitRatePlan;
			dataRef[3].h2  = planData.H2ProfitRatePlan;
			dataRef[3].yt  = planData.totalProfitRatePlan;

			dataRef[4].m4  = planData.month[4].compoRate;
			dataRef[4].m5  = planData.month[5].compoRate;
			dataRef[4].m6  = planData.month[6].compoRate;
			dataRef[4].m7  = planData.month[7].compoRate;
			dataRef[4].m8  = planData.month[8].compoRate;
			dataRef[4].m9  = planData.month[9].compoRate;
			dataRef[4].m10 = planData.month[10].compoRate;
			dataRef[4].m11 = planData.month[11].compoRate;
			dataRef[4].m12 = planData.month[12].compoRate;
			dataRef[4].m1  = planData.month[1].compoRate;
			dataRef[4].m2  = planData.month[2].compoRate;
			dataRef[4].m3  = planData.month[3].compoRate;
			dataRef[4].h1  = planData.H1CompoRate;
			dataRef[4].h2  = planData.H2CompoRate;
			dataRef[4].yt  = planData.totalCompoRate;

			this.grid_plan.grid.invalidate();
		},



		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){
			this.srchAreaCtrl.show_srch();
			$("#searchAgain").fadeOut();

			// 検索条件部を活性化する
			clutil.viewRemoveReadonly($("#ca_srchArea"));

			this.srchCondView.init_ope_year = $('#ca_srchYear').val();

			// 検索条件初期化
			this.srchCondView.deserialize({
				srchUnitID: clcom.userInfo.unit_id,
				srchYear: this.srchCondView.init_ope_year,
			});

			this.srchCondView.fieldRelation.done(function(){
				var tgtView = mainView.srchCondView;
				tgtView.setInitializeValue();
				tgtView.setDefaultEnabledProp();
			});

			clutil.setFocus(this.srchCondView.$tgtFocus);

			// 検索結果クリア
			this.srchAreaCtrl.reset();

			// フッターボタン活性制御
			this.mdBaseView.setSubmitEnable(false);
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
					//{ name = 'AM_PROTO_COMMON_RTYPE_NEW',        val = 1, description = '新規登録' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_UPD',        val = 2, description = '編集' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_DEL',        val = 3, description = '削除' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_REL',        val = 4, description = '参照' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_CSV',        val = 5, description = 'CSV出力' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_CSV_INPUT',  val = 6, description = 'CSV取込' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_COPY',       val = 7, description = '複製' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_PDF',        val = 8, description = 'PDF出力' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_DELCANCEL',  val = 9, description = '削除復活' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_RSVCANCEL',  val = 10, description = '予約取消' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_TMPSAVE',    val = 11, description = '一時保存' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_APPLY',      val = 12, description = '申請' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_APPROVAL',   val = 13, description = '承認' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_PASSBACK',   val = 14, description = '差戻し' },
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
				//reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMBPV0020GetReq: srchReq
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

			var defer = clutil.postJSON('AMBPV0020', srchReq).done(_.bind(function(data){

				// データ取得
				var recs = data.AMBPV0020GetRsp.monthResults;

				if (_.isEmpty(recs)) {
					mainView.srchAreaCtrl.reset();

					// エラーメッセージ表示
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

					// フォーカス設定
					this.resetFocus(this.srchCondView.$tgtFocus);

				} else {
					clutil.viewReadonly($("#ca_srchArea"));
					$("#searchAgain").text('検索条件を開く');

					var date = clutil.ymd2date(clcom.getOpeDate());
					data.AMBPV0020GetRsp.monthResults.srchYear = data.AMBPV0020GetRsp.monthPlans.srchYear = Number(srchReq.AMBPV0020GetReq.srchYear);
					data.AMBPV0020GetRsp.monthResults.opeYear = data.AMBPV0020GetRsp.monthPlans.opeYear = date.getFullYear();
					data.AMBPV0020GetRsp.monthResults.opeMonth = data.AMBPV0020GetRsp.monthPlans.opeMonth = date.getMonth() + 1;
					data.AMBPV0020GetRsp.monthResults.dataType = 'RESULT';
					data.AMBPV0020GetRsp.monthPlans.dataType = 'PLAN';

					// 表示内容を保存
					mainView.canUpdate = false;
					this.recList = this.setDispData(data.AMBPV0020GetRsp);

					// リクエストを保存。
					this.savedReq = srchReq;

					// 結果ペインを表示
					this.srchAreaCtrl.show_result();

					// フォーカスの設定
					if(typeof $focusElem != 'undefined') {
						this.resetFocus($focusElem);
					}

					// 登録ボタン活性制御
					mainView.setSubmitEnable(mainView.canUpdate);

					this.createGridData();
					this.initGrid();

					this.setGridData();

					var grigParamResult = {
						gridOptions		: {rowHeight:26},		// データグリッドのオプション
						columns			: this.columns_result,	// カラム定義
						data			: this.gridData_result,	// データ
					};

					var grigParamPlan = {
						gridOptions		: {rowHeight:26},		// データグリッドのオプション
						columns			: this.columns_plan,	// カラム定義
						data			: this.gridData_plan,	// データ
					};

					this.grid_result.setData(grigParamResult);
					this.grid_plan.setData(grigParamPlan);

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
			}, this)).fail(_.bind(function(data){

				// 検索ペインを表示
				mainView.srchAreaCtrl.reset();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				// フォーカスの設定
				this.resetFocus();

			}, this));

			return defer;
		},

		setDispData: function (getRsp){
			var result = [];
			var funcRoundRate = this.roundRate;

			// 経戦以外の場合はreadonlyにする
			var readonly = '';
			if (opeTypeKind < TYPE_KIND.KEISEN){
				readonly = 'readonly';
			}

			//実績、計画でループ
			$.each([getRsp.monthResults, getRsp.monthPlans], function(index) {
				var rec = this;
				var tempList = {};

				// 月を取得
				rec.opeYMD = Number('' + this.opeYear + ('0' + this.opeMonth).slice(-2));

				$.each(rec, function() {
					if (this.year == 0 || this.month == 0) {
						return true;
					}

					if (this.month < 4) {
						// 実年1～3月までは前年度
						this.bizYear = this.year - 1;
					} else {
						// 実年4～12月までは当年度
						this.bizYear = this.year;
					}

					if (rec.dataType == 'RESULT') {
						// 実績データの場合、表示範囲は3年分
						if (this.bizYear >= rec.srchYear || this.bizYear < rec.srchYear - 3) {
							return true;
						}
					} else {
						// 計画データの場合、対象年以外は無視
						if (this.bizYear != rec.srchYear) {
							return true;
						}
					}

					if (typeof tempList[this.bizYear] == 'undefined') {
						// 該当する年のデータが未作成の場合は追加する
						tempList[this.bizYear] = {
							month					: new Array(12),
							H1SaleResult			: 0,
							H1SaleResultCost		: 0,
							H1SalePlan				: 0,
							H1SalePlanDisp			: 0,
							H1SalePlanCost			: 0,
							H1PrevRate				: 0,
							H1ProfitRateResult		: 0,
							H1ProfitRatePlan		: 0,
							H1CompoRate				: 0,
							H2SaleResult			: 0,
							H2SaleResultCost		: 0,
							H2SalePlan				: 0,
							H2SalePlanDisp			: 0,
							H2SalePlanCost			: 0,
							H2PrevRate				: 0,
							H2ProfitRateResult		: 0,
							H2ProfitRatePlan		: 0,
							H2CompoRate				: 0,
							totalSaleResult			: 0,
							totalSaleResultCost		: 0,
							totalSalePlan			: 0,
							totalSalePlanDisp		: 0,
							totalSalePlanCost		: 0,
							totalPrevRate			: 0,
							totalProfitRateResult	: 0,
							totalProfitRatePlan		: 0,
							totalCompoRate			: 0,
						};

						// 月データでループ
						for (var i = 0; i <= 12; i++) {
							var yearBuff = this.bizYear;

							if (i < 4) {
								yearBuff = this.bizYear + 1;
							}

							var itemYMD = Number('' + yearBuff + ('0' + i).slice(-2));

							if (opeTypeKind < TYPE_KIND.KEISEN){
								readonly = 'readonly';
							} else {
								if (itemYMD < rec.opeYMD) {
									readonly = 'readonly';
								} else {
									readonly = '';
									mainView.canUpdate = true;
								}
							}

							// 該当する月のデータが未作成の場合は追加する
							tempList[this.bizYear].month[i] = {
								recno				: 0,
								state				: 0,
								year				: yearBuff,
								month				: i,
								saleResult			: 0,
								salePlan 			: 0,
								salePlanDisp		: 0,
								prevRate			: 0,
								profitRateResult	: 0,
								profitRatePlan 		: 0,
								compoRate			: 0,
								readonly			: readonly,
							};
						}
					}

					// 該当年、月の内容を設定する
					tempList[this.bizYear].month[this.month] = {
						recno				: this.recno,
						state				: this.state,
						year				: this.year,
						month				: this.month,
						saleResult			: this.saleResult / 1000,
						saleResultCost		: this.profitRateResult / 100 * this.saleResult,
						salePlan 			: this.salePlan,
						salePlanDisp		: this.salePlan / 1000,
						salePlanCost		: this.profitRatePlan / 100 * this.salePlan,
						prevRate			: this.prevRate,
						profitRateResult	: this.profitRateResult,
						profitRatePlan 		: this.profitRatePlan,
						compoRate			: this.compoRate,
						readonly			: tempList[this.bizYear].month[this.month].readonly,
					};

					// 年度の合計を設定する
					var yearRef = tempList[this.bizYear];
					var monthRef = tempList[this.bizYear].month[this.month];

					if (this.month >= 4 && this.month <= 9){
						yearRef.H1SaleResult += monthRef.saleResult;
						yearRef.H1SaleResultCost += monthRef.saleResultCost;
						yearRef.H1SalePlan += monthRef.salePlan;
						yearRef.H1SalePlanCost += monthRef.salePlanCost;
					} else {
						yearRef.H2SaleResult += monthRef.saleResult;
						yearRef.H2SaleResultCost += monthRef.saleResultCost;
						yearRef.H2SalePlan += monthRef.salePlan;
						yearRef.H2SalePlanCost += monthRef.salePlanCost;
					}

					yearRef.totalSaleResult += monthRef.saleResult;
					yearRef.totalSaleResultCost += monthRef.saleResultCost;
					yearRef.totalSalePlan += monthRef.salePlan;
					yearRef.totalSalePlanCost += monthRef.salePlanCost;
					yearRef.year = this.bizYear;
				});

				var recList = [];
				var idx = 0;
				// 合計データでループ
				$.each(tempList, function() {
					// 画面表示用の内容を設定する
					this.H1SalePlanDisp = Math.round(this.H1SalePlan / 1000);
					this.H2SalePlanDisp = Math.round(this.H2SalePlan / 1000);
					this.totalSalePlanDisp = Math.round(this.totalSalePlan / 1000);


					if (rec.dataType == 'RESULT') {
						// 年度の荒利率を設定する
						this.H1ProfitRateResult = funcRoundRate(this.H1SaleResultCost, this.H1SaleResult * 1000);
						this.H1ProfitRatePlan = funcRoundRate(this.H1SalePlanCost, this.H1SalePlan * 1000);
						this.H2ProfitRateResult = funcRoundRate(this.H2SaleResultCost, this.H2SaleResult * 1000);
						this.H2ProfitRatePlan = funcRoundRate(this.H2SalePlanCost, this.H2SalePlan * 1000);

						this.H1CompoRate = funcRoundRate(this.H1SaleResult, this.totalSaleResult);
						this.H2CompoRate = funcRoundRate(this.H2SaleResult, this.totalSaleResult);

						this.totalProfitRateResult = funcRoundRate(this.totalSaleResultCost, this.totalSaleResult * 1000);
						this.totalProfitRatePlan = funcRoundRate(this.totalSalePlanCost, this.totalSalePlan * 1000);
						this.totalCompoRate = this.H1CompoRate + this.H2CompoRate;

					} else {
						// 年度の荒利率を設定する
						this.H1ProfitRateResult = funcRoundRate(this.H1SaleResultCost, this.H1SaleResult);
						this.H1ProfitRatePlan = funcRoundRate(this.H1SalePlanCost, this.H1SalePlan);
						this.H2ProfitRateResult = funcRoundRate(this.H2SaleResultCost, this.H2SaleResult);
						this.H2ProfitRatePlan = funcRoundRate(this.H2SalePlanCost, this.H2SalePlan);

						this.H1CompoRate = funcRoundRate(this.H1SalePlan, this.totalSalePlan);
						this.H2CompoRate = funcRoundRate(this.H2SalePlan, this.totalSalePlan);

						this.totalProfitRateResult = funcRoundRate(this.totalSaleResultCost, this.totalSaleResult);
						this.totalProfitRatePlan = funcRoundRate(this.totalSalePlanCost, this.totalSalePlan);
						this.totalCompoRate = this.H1CompoRate + this.H2CompoRate;
					}

					this.index = idx++;
					recList.push(this);
				});

				result[index] = recList;
				// result[0][year-3 to year-1][month]	: 実績
				// result[1][year][month]				: 計画
			});

			// 前年比を設定する
			var resultList = result[0];
			var planData = result[1][0];
			var prevData;

			// 実績
			for (var i = 1; i < resultList.length; i++) {
				prevData = resultList[i - 1];
				resultList[i].H1PrevRate = funcRoundRate(resultList[i].H1SaleResult, prevData.H1SaleResult);
				resultList[i].H2PrevRate = funcRoundRate(resultList[i].H2SaleResult, prevData.H2SaleResult);
				resultList[i].totalPrevRate = funcRoundRate(resultList[i].totalSaleResult, prevData.totalSaleResult);
			}

			// 計画
			prevData = resultList[resultList.length - 1];
			planData.H1PrevRate = funcRoundRate(planData.H1SalePlan, prevData.H1SaleResult * 1000);
			planData.H2PrevRate = funcRoundRate(planData.H2SalePlan, prevData.H2SaleResult * 1000);
			planData.totalPrevRate = funcRoundRate(planData.totalSalePlan, prevData.totalSaleResult * 1000);

			return result;
		},

		roundRate: function(lhs, rhs) {
			return (rhs) ? Math.round(lhs / rhs * 100 * 10) / 10 : 0;
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
			console.warn('unsupported rtyp[' + rtyp + '] received.');
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			var data = args.data;
			var getRsp = data.AMBPV0020GetRsp;

			switch(args.status){
			case 'OK':
				// TODO: args.data をアプリ個別 View へセットする。
				this.data2Table(getRsp.premOrdList);

				// TODO: 編集状態を設定する。
//				clutil.viewReadonly($("#ca_base_form"));
				//clutil.inputReadonly($("#ca_equipVendCode"));

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
					//clutil.viewReadonly(this.$(".ca_fromDate_div"));
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					//clutil.inputReadonly($("#ca_equipVendName"));
					break;
				default:
					//$('#ca_equipVendName').focus();
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
				this.setReadOnlyAllItems();
				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			}
		},

		setPlanTable: function(curId) {
			var funcRoundRate = this.roundRate;
			var sumH1SalePlan = 0;
			var sumH1SalePlanCost = 0;
			var sumH2SalePlan = 0;
			var sumH2SalePlanCost = 0;
			var sumTotalSalePlan = 0;
			var sumTotalSalePlanCost = 0;

			var prevData = this.recList[0][this.recList[0].length - 1];
			var planData = this.recList[1][0];

			planData.month[curId].salePlanCost = planData.month[curId].profitRatePlan / 100 * planData.month[curId].salePlan;

			for (var id = 1; id <= 12; id++) {
				var salePlan =planData.month[id].salePlan;
				var cost = planData.month[id].salePlanCost;

				planData.month[id].prevRate = funcRoundRate(salePlan, (prevData.month[id].saleResult * 1000));

				sumTotalSalePlan += salePlan;
				sumTotalSalePlanCost += cost;
				if (id >= 4 && id <= 9) {
					sumH1SalePlan += salePlan;
					sumH1SalePlanCost += cost;
				} else {
					sumH2SalePlan += salePlan;
					sumH2SalePlanCost += cost;
				}
			}

			planData.H1SalePlan = sumH1SalePlan;
			planData.H2SalePlan = sumH2SalePlan;
			planData.totalSalePlan = sumTotalSalePlan;

			planData.H1SalePlanCost = sumH1SalePlanCost;
			planData.H2SalePlanCost = sumH2SalePlanCost;
			planData.totalSalePlanCost = sumTotalSalePlanCost;

			planData.H1ProfitRatePlan = funcRoundRate(planData.H1SalePlanCost, planData.H1SalePlan);
			planData.H2ProfitRatePlan = funcRoundRate(planData.H2SalePlanCost, planData.H2SalePlan);
			planData.totalProfitRatePlan = funcRoundRate(planData.totalSalePlanCost, planData.totalSalePlan);

			for (var i = 1; i <= 12; i++) {
				planData.month[i].compoRate = funcRoundRate(planData.month[i].salePlan, planData.totalSalePlan);
			}

			planData.H1SalePlanDisp = Math.round(planData.H1SalePlan / 1000);
			planData.H2SalePlanDisp = Math.round(planData.H2SalePlan / 1000);
			planData.totalSalePlanDisp = Math.round(planData.totalSalePlan / 1000);

			planData.H1PrevRate = funcRoundRate(planData.H1SalePlan, prevData.H1SaleResult * 1000);
			planData.H2PrevRate = funcRoundRate(planData.H2SalePlan, prevData.H2SaleResult * 1000);
			planData.totalPrevRate = funcRoundRate(planData.totalSalePlan, prevData.totalSaleResult * 1000);

			planData.H1CompoRate = funcRoundRate(sumH1SalePlan, sumTotalSalePlan);
			planData.H2CompoRate = funcRoundRate(sumH2SalePlan, sumTotalSalePlan);
			planData.totalCompoRate = planData.H1CompoRate + planData.H2CompoRate;
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
			return;
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			var hasError = false;

			if(!this.validator.valid()) {
				return null;
			}

			this.grid_plan.stopEditing();
			var buff = this.grid_plan.getData();

			for (var i = 1; i <= 12; i++) {
				var chkData = buff[1];
				var key = 'm' + i;
				var salePlan = '' + chkData[key];
				var checkValue = Number(salePlan.substring(salePlan.length - 1, salePlan.length));

				if (checkValue != 0) {
					mainView.grid_plan.setCellMessage(chkData._cl_gridRowId, key, 'error', clmsg.EBP0001);
					hasError = true;
				}
			}

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

			if(hasError){
				mainView.validator.setErrorHeader(clmsg.cl_echoback);
				return null;
			}

			var data = clutil.view2data($("#div_fUpdThis"));
			var confirm = null;

			if (data.fUpdThis) {
				confirm = "当月（翌日以降）の日別荒利率計画を月別の荒利率計画で上書きします。<br />&nbsp; <br />よろしいですか？";
			}

			// TODO: 画面入力値をかき集めて、Rec を構築する。
			var monthPlans = this.recList[1][0].month.slice(1, 13);

			$.each(monthPlans, function() {
				this.saleResult *= 1000;
			});

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMBPV0020GetReq: this.savedReq.AMBPV0020GetReq,
				// 更新リクエスト
				AMBPV0020UpdReq: {
					monthPlans	: monthPlans,
					fUpdThis: data.fUpdThis,
				}
			};

//return null;
			return {
				resId: clcom.pageId,	//'AMBPV0020',
				data: updReq,
				confirm: confirm,
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

		/**
		 * 「登録」/「削除」ボタンの活性/非活性を設定する
		 */
		setSubmitEnable: function(enable){
			if(enable && clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE && clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN){
				this.$('#mainColumnFooter .cl_submit').removeAttr('disabled').parent().removeClass('disable');
			}else{
				this.$('#mainColumnFooter .cl_submit').attr('disabled','disabled').parent().addClass('disable');
			}
		},

		_eof: 'AMBPV0020.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView(clcom.pageArgs).initUIElement().render();

		$("#mainColumnFooter").removeClass('x2');
		$("#mainColumnFooter p.right").hide();
		$("#mainColumnFooter p.left").hide();

		// 登録ボタン活性制御
		mainView.setSubmitEnable(false);

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
