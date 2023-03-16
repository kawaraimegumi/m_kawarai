useSelectpicker2();

$(function(){
	$.inputlimiter.noTrim = true;

	var TOTAL_TYPE = {
		MONTHLY: 1,
		WEEKLY: 2,
		DAYLY: 3,
	};

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
			if (!_.isUndefined(mainView) && !_.isUndefined(mainView.grid) && !_.isUndefined(mainView.grid.grid)){
				mainView.grid.grid.resizeCanvas();
			}
	    }, 100);
	});

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			"click #ca_AMPAV0010_show_AMPAV0020"	: '_onShowAMPAV0020Click',	// 組織選択ボタン押下
			'click #ca_srch'						: '_onSrchClick',			// 検索ボタン押下時
			'click #ca_csv_download'				: '_onDownloadClick',		// Excelデータ出力ボタン押下時
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

			// 組織
			this.utl_org = this.getOrg(clcom.userInfo.unit_id);

			// 対象月 FIXME:暫定
			this.utl_month = clutil.clmonthselector(this.$('#ca_srchMonth'), 1, 1, 1, null, null, 1, null, 'd'); //TODO:初期表示調整(とりあえず前後1年)

			var date = clutil.ymd2date(clcom.getOpeDate());
			var ope_month = '' + date.getFullYear() + ('0' + (date.getMonth() + 2)).slice(-2);	// FIXME 年月初期値

			// 初期値を設定
			this.deserialize( {
				srchUnitID	: clcom.userInfo.unit_id,	// 事業ユニットID
				srchMonth	: ope_month,				// 対象月
			});

			// 初期フォーカスオブジェクト設定
			this.$tgtFocus = $('#ca_srchUnitID');

			this.setInitializeValue();
			this.setDefaultEnabledProp();

			// 経戦の場合は組織を任意項目にする（検索ボタン押下時は必須扱いのまま）
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_KEISEN) {
				$("#div_ca_org").parent().removeClass("required");
				$("#ca_AMPAV0010_orgname").removeClass("cl_required");
			} else {
				$("#div_ca_org").parent().addClass("required");
				$("#ca_AMPAV0010_orgname").addClass("cl_required");
			}

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);

			// 組織選択画面
			this.AMPAV0020Selector = new AMPAV0020SelectorView({
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

		setDefaultEnabledProp: function(){
			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS){
				if (clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.viewReadonly($("#div_ca_unitID"));
					this.$tgtFocus = $('#ca_AMPAV0010_orgname');
				}
			}

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
				clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.viewReadonly($("#div_ca_org"));
				$("#div_ca_unitID").hide();

				this.$tgtFocus = $('#ca_srchMonth');
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
		isValid: function(f_orgcheck) {
			var f_ret = true;
			if (!this.validator.valid()) {
				f_ret = false;
			}
			if (f_orgcheck) {
				// 組織の必須チェックを別途行う
				var org = $("#ca_AMPAV0010_orgname").autocomplete("clAutocompleteItem");
				if (!(org != null && org.id > 0)) {
					this.validator.setErrorMsg($("#ca_AMPAV0010_orgname"), "検索時は組織を選択してください。");
					clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
					f_ret = false;
				}
			}
			return f_ret;
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
			var f_orgcheck = false;
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_KEISEN) {
				f_orgcheck = true;
			}
			if(!this.isValid(f_orgcheck)){
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

		_eof: 'AMBPV0050.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'		: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click #cl_close'			: '_onCloseClick',
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
					title: '店舗日別計画確認',
					subtitle: '',
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
					pageCount: o.chkData.length,
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					btn_submit:(o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW),
					btn_csv:true,
					btn_cancel: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW),
					confirmLeaving:false,
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

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

//			// 外部イベントの購読設定
//			switch(fixopt.opeTypeId){
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
//				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
//				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
//				// fall through
//			default:
//				// 新規登録以外は、GET結果のデータを購読する。
//				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
//			}

			if (fixopt.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			}

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
		},

		initGrid:function(){
			this.grid = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid',	// エレメント
				lineno			: false,			// 行番号表示する/しないフラグ。
				delRowBtn		: false,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: false,			// フッター部の新規行追加ボタンを使用するフラグ。
			});

			this.grid.getHeadMetadata = this.getHeadMetadata;
			this.grid.getMetadata = this.getMetadata;

			this.grid.render();
		},

		getHeadMetadata: function(rowIndex){

			var columns = {};

			// 店舗の行
			if (rowIndex == 3){
			    for(var k in this.optMeta){
			    	columns[k] = this.optMeta[k];
			    }
			}

			if (rowIndex > 0){
				columns['prevDay']	= { cssClasses : 'bdrTpColor',};
				columns['day'] 		= { cssClasses : 'bdrTpColor',};
				columns['weekDay']	= { cssClasses : 'bdrTpColor',};
			}

			return {
				 columns: columns
			};
		},

		getMetadata: function(rowIndex){
			var data = this.grid.getData()[rowIndex];
			var ret;

			// 合計、週計
			if (data.cl_reference.length > 0){
				if (rowIndex == 0){
					ret = {
						cssClasses: 'reference align-right',
					};
				} else {
					ret = {
						cssClasses: 'reference',
					};
				}

				return ret;
			}

			return {
				columns: {
					weekDay: {
						cssClasses: this.grid.getData()[rowIndex].cl_pw_fDay,
					},
				}
			};
		},

		createGridData: function(){
			var hdZone = {};
			var hdArea = {};
			var hdStore = {};
			var columns = [];
			var optMeta = {};

			columns.push({
				id		: 'prevDay',
				//name	: '前年日付',
				field	: 'prevDay',
				width	: 80,
			});

			columns.push({
				id		: 'day',
				//name	: '日付',
				field	: 'day',
				width	: 80,
			});

			columns.push({
				id		: 'weekDay',
				//name	: '曜日',
				field	: 'weekDay',
				width	: 80,
			});

			hdArea['prevDay']	= { name : '前年',};
			hdStore['prevDay']	= { name : '日付',};
			hdArea['day']		= { name : '日付',};
			hdArea['weekDay']	= { name : '曜日',};

			$.each(this.dispData.header.zone, function(){
				var key = this.orgID + '_prevSale';
				hdZone[key] = {
					colspan	: this.colspan + 3,
					name	: this.orgName + ' 計',
				};

				hdArea[key] = {
					colspan	: 3,
					cssClasses		: 'bdrTpColor',
				};
				hdStore[key] = {
					colspan	: 3,
					cssClasses		: 'bdrTpColor',
				};
			});

			$.each(this.dispData.header.area, function(){
				var key = this.orgID + '_prevSale';
				hdArea[key] = {
					colspan	: this.colspan + 3,
					name	: this.orgName + ' 計',
				};

				hdStore[key] = {
					colspan	: 3,
					cssClasses		: 'bdrTpColor',
				};
			});

			$.each(this.dispData.header.store, function(){
				hdStore[this.orgID + '_prevSale'] = {
					colspan	: 3,
					name	: this.orgCode + ':' + this.orgName,
					cssClasses		: 'darken',
				};
			});

			$.each(this.dispData.header.caption, function(){
				var key = '';

				key = this.orgID + '_prevSale';

				columns.push({
					id		: key,
					name	: '前実',
					field	: key,
					width	: 120,
					cssClass: 'txtalign-right',
					cellType:
					{
						formatFilter	: "comma",
					},
				});
				if (this.orgLevel == 6){
					optMeta[key] = {
						cssClasses: 'darken',
					};
				}

				key = this.orgID + '_salePlan';
				columns.push({
					id		: key,
					name	: '本計',
					field	: key,
					width	: 120,
					cssClass: 'txtalign-right',
					cellType:
					{
						formatFilter	: "comma",
					},
				});
				if (this.orgLevel == 6){
					optMeta[key] = {
						cssClasses: 'darken',
					};
				}

				key = this.orgID + '_prevRate';
				columns.push({
					id		: key,
					name	: '前年比(%)',
					field	: key,
					width	: 80,
					cssClass: 'txtalign-right',
					cellType:
					{
						formatFilter	: "comma fixed:1",
					},
				});
				if (this.orgLevel == 6){
					optMeta[key] = {
						cssClasses: 'darken',
					};
				}
			});

			this.colhdMetadatas =
			[
				{ columns: hdZone },
				{ columns: hdArea },
				{ columns: hdStore },
			];

			this.columns = columns;
			this.optMeta = optMeta;
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
			$("#mainColumnFooter").hide();

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

			var org = this.srchCondView.utl_org.getValue();
			srchReq.srchOrgID = org.id;
			if (srchReq.srchOrgID == null) {
				// 組織IDが設定されていない場合は事業ユニットIDを設定する
				srchReq.srchOrgID = srchReq.srchUnitID;
			}

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
				AMBPV0050GetReq: srchReq
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);
			req.AMBPV0050GetReq.org = mainView.srchCondView.utl_org.getValue();

			// 検索実行
			this.doSrch(req);
		},


		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			this.clearResult();
			srchReq.AMBPV0050GetReq.srchOrgID = srchReq.AMBPV0050GetReq.org.id;

			$("#mainColumnFooter").hide();

			var defer = clutil.postJSON('AMBPV0050', srchReq).done(_.bind(function(data){
				this.srchDoneProc(srchReq, data, chkData);

			}, this)).fail(_.bind(function(data){
				this.srchFailProc(data);

			}, this));

			return defer;
		},

		srchDoneProc: function(srchReq, data, chkData){
			// データ取得
			var recs = data.AMBPV0050GetRsp.rawRecs;

			if (_.isEmpty(recs)) {
				mainView.srchAreaCtrl.reset();

				// エラーメッセージ表示
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// フォーカス設定
				this.resetFocus(this.srchCondView.$tgtFocus);
			} else {
				if (this.tempSrchReq != null){
					clutil.viewReadonly($("#ca_srchArea"));
					$("#searchAgain").text('検索条件を開く');
				}

				mainView.setDispData(data.AMBPV0050GetRsp);

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// フォーカスの設定
				if(typeof $focusElem != 'undefined') {
					this.resetFocus($focusElem);
				}

				var $submit = $('#mainColumnFooter .cl_submit');
				if ($submit.length > 0) {
					$submit.attr('disabled','disabled').parent().addClass('disable');
					$submit.text('');
				}

				this.createGridData();
				this.initGrid();

				this.setGridData();

				var gridParam = {
					gridOptions		: {
						frozenColumn	: 2,
						autoHeight		: false,
						frozenRow		: 5,
					},										// データグリッドのオプション
					columns			: this.columns,			// カラム定義
					colhdMetadatas	: this.colhdMetadatas,	//
					data			: this.gridData,		// データ
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

				$("#mainColumnFooter").show();
			}
		},

		srchFailProc: function(data){
			mainView.srchAreaCtrl.reset();

			// エラーメッセージを通知。
			clutil.mediator.trigger('onTicker', data);

			// フォーカスの設定
			this.resetFocus();
		},

		setDispData: function(rsp){
			this.dispData = null;

			var tableData = {
				header:{
					zone	: new Array(),
					area	: new Array(),
					store	: new Array(),
					caption	: new Array(),
				},
				body:new Array(),
			};

			var w = ["","月","火","水","木","金","土","日"];
			var hd = tableData.header;
			var bd = tableData.body;
			var zone = null;
			var area = null;

			// テーブルのヘッダ部分のデータを生成する
			$.each(rsp.colRecs, function(){
				var orgName = this.orgName.replace(/(^\s+)|(\s+$)/g, "");

				switch (this.orgLevel){
				case Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')):	// ゾーン
					hd.zone.push({orgID:this.orgID, orgCode:this.orgCode, orgName:orgName, colspan:0,});
					zone = hd.zone[hd.zone.length - 1];
					break;
				case Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID')):	// エリア
					hd.area.push({orgID:this.orgID, orgCode:this.orgCode, orgName:orgName, colspan:0,});
					area = hd.area[hd.area.length - 1];
					zone.colspan += 3;
					break;
				case Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')):	// 店舗
					hd.store.push({orgID:this.orgID, orgCode:this.orgCode, orgName:orgName,});
					zone.colspan += 3;
					area.colspan += 3;
					break;
				}
				// 項目
				hd.caption.push({orgLevel:this.orgLevel,orgID:this.orgID, orgCode:this.orgCode, orgName:orgName,});
			});

			var cellLoopMax = hd.caption.length;
			var cellIndex = 0;

			// テーブルの縦軸部分のデータを生成する
			$.each(rsp.rawRecs, function(){
				var strPrevDay = this.prevDay.toString();
				var strDay = this.day.toString();
				var prevDay = '';
				var day = '';
				var weekDay = '';
				var cl_pw_fDay = '';
				var cl_reference = 'reference';
				var list = new Array();

				switch (this.type){
				case TOTAL_TYPE.MONTHLY:
					weekDay = '合計';
					break;
				case TOTAL_TYPE.WEEKLY:
					weekDay = '*';
					break;
				case TOTAL_TYPE.DAYLY:
					prevDay = Number(strPrevDay.substring(4,6)) + '/' + Number(strPrevDay.substring(6,8));
					day = Number(strDay.substring(4,6)) + '/' + Number(strDay.substring(6,8));
					weekDay = w[this.wDay];

					switch (this.wDay){
					case 7:
						cl_pw_fDay = 'txtDanger';
						break;
					case 6:
						cl_pw_fDay = 'txtPrimary';
						break;
					default:
						cl_pw_fDay = '';
						break;
					}

					cl_reference = '';

					break;
				}

				// テーブルの横軸部分のデータを生成する
				for (var i = 0; i < cellLoopMax; i++){
					var cell = rsp.cellRecs[cellIndex];
					list.push({
						prevSale: Math.round(cell.prevSale / 1000),
						salePlan: Math.round(cell.salePlan / 1000),
						prevRate: cell.prevRate,
					});
					cellIndex++;
				}

				bd.push({
					prevDay			: prevDay,
					day				: day,
					weekDay			: weekDay,
					cl_pw_fDay		: cl_pw_fDay,
					cl_reference	: cl_reference,
					list			: list,
				});
			});

			this.dispData = tableData;
		},

		setGridData: function(){
			this.gridData = [];
			var keyList = [];

			$.each(this.dispData.header.caption, function(){
				keyList.push(this.orgID + '_prevSale');
				keyList.push(key = this.orgID + '_salePlan');
				keyList.push(key = this.orgID + '_prevRate');
			});

			$.each(this.dispData.body, function(){
				var tmp = {};
				var keyIndex = 0;

				tmp['prevDay'] = this.prevDay;
				tmp['day'] = this.day;
				tmp['weekDay'] = this.weekDay;
				tmp['cl_pw_fDay'] = this.cl_pw_fDay;
				tmp['cl_reference'] = this.cl_reference;

				$.each(this.list, function(){
					tmp[keyList[keyIndex++]] = this.prevSale;
					tmp[keyList[keyIndex++]] = this.salePlan;
					tmp[keyList[keyIndex++]] = (this.prevSale == 0) ? '-' : this.prevRate;
				});

				mainView.gridData.push(tmp);
			});
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMBPV0050', srchReq);
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
			if (this.tempSrchReq != null){
				if (this.$('#ca_srchArea').css('display') == 'none') {
					this.srchAreaCtrl.show_srch();
					$("#searchAgain").text('検索条件を閉じる');
					$("#searchAgain").fadeIn();
				} else {
					this.srchAreaCtrl.show_result();
					$("#searchAgain").text('検索条件を開く');
				}
			} else {
				this.srchAreaCtrl.show_srch();
			}

			if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				$("#mainColumnFooter").hide();
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
					savedCond: this.savedReq.AMBPV0050GetReq,
//					selectedIds: this.recListView.getSelectedIdList(),
//					chkData: this.recListView.getSelectedRecs(),
				};
				destData = {
					opeTypeId: rtyp,
					srchDate: this.savedReq.srchDate,
//					chkData: this.recListView.getSelectedRecs()
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


		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex) {
			var req = {
				srchUnitID	:0,
				srchOrgID	:0,
				srchMonth	:0,
			};

			// 遷移パラメーターチェック
		    if (!_.isEmpty(this.options.chkData)) {
		    	if (this.options.chkData.length > 0) {
		    		var chkData = this.options.chkData[0];
		    		var srchCond = this.options.srchCond;

		    		req.srchUnitID = srchCond.srchUnitID;
		    		req.srchMonth = srchCond.srchMonth;

		    		if (chkData.areaID != 0){
		    			// エリア指定で遷移してきた場合
		    			req.srchOrgID = chkData.areaID;
		    			req.AMPAV0010_org_id = chkData.areaID;
		    			req.AMPAV0010_org_code = chkData.areaCode;
		    			req.AMPAV0010_org_name = chkData.areaName;
		    			req.AMPAV0010_attr = Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID'));
		    		} else if (chkData.zoneID != 0){
		    			// ゾーン指定で遷移してきた場合
		    			req.srchOrgID = chkData.zoneID;
		    			req.AMPAV0010_org_id = chkData.zoneID;
		    			req.AMPAV0010_org_code = chkData.zoneCode;
		    			req.AMPAV0010_org_name = chkData.zoneName;
		    			req.AMPAV0010_attr = Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID'));
		    		} else {
		    			//ここに来ることはないはず（店舗指定）
		    			req.srchOrgID = chkData.storeID;
		    			req.AMPAV0010_org_id = chkData.storeID;
		    			req.AMPAV0010_org_code = chkData.storeCode;
		    			req.AMPAV0010_org_name = chkData.storeName;
		    			req.AMPAV0010_attr = Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'));
		    		}

		    		req.AMPAV0010_func_id = Number(clcom.getSysparam('PAR_AMMS_HD_LEVELID'));
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
				AMBPV0050GetReq: req,
				// 更新リクエスト
				AMBPV0050UpdReq: {},
			};

			this.tempSrchReq = getReq;

			return {
				resId: clcom.pageId,	//'AMEQV0060',
				data: getReq
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
				this.srchCondView.deserialize(this.tempSrchReq.AMBPV0050GetReq);

				var orgParam =  {
						id			: this.tempSrchReq.AMBPV0050GetReq.AMPAV0010_org_id,
						code		: this.tempSrchReq.AMBPV0050GetReq.AMPAV0010_org_code,
						name		: this.tempSrchReq.AMBPV0050GetReq.AMPAV0010_org_name,
						orglevel	: this.tempSrchReq.AMBPV0050GetReq.AMPAV0010_attr,
					};
				this.srchCondView.utl_org.setValue(orgParam);

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

		_eof: 'AMBPV0050.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){

		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView(clcom.pageArgs).initUIElement().render();

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
