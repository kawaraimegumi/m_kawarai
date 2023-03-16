// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'change #ca_srchUnitID'							:	'_onSrchUnitChanged',		// 事業ユニットが変更された
			'cl_change #ca_srchItgrpID'						:	'_onSrchItgrpChanged',		// 品種が変更された
			"click #ca_btn_org_select"						:	'_onShowOrgSelClick',		// 組織選択ボタン押下
			"click #ca_btn_compare_select"					:	'_onShowCompOrgClick',		// 比較対象組織選択ボタン押下
			"change #ca_srchItemAttr1Sw"					:	'_onItemAttr1SwChange',		// 商品属性1変更時
			"change #ca_srchItemAttr2Sw"					:	'_onItemAttr2SwChange',		// 商品属性2変更時
			'click #ca_srch'								:	'_onSrchClick',				// 検索ボタン押下時
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

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 検索日
				datepicker: {
					el: "#ca_srchFromDate"
				},
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrpID"
				}
			}, {
				dataSource: {
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
			});

			// シーズン
			clutil.cltypeselector(this.$('#ca_srchSeasonSw'), amcm_type.AMCM_TYPE_SEASON, 1);
			// 商品属性1,2
			this.getitemattrgrpfunc();
			clutil.inputReadonly($('#ca_srchItemAttr1Sw'));
			clutil.inputReadonly($('#ca_srchItemAttr2Sw'));
			clutil.inputReadonly($('#ca_srchItemAttr1Cont'));
			clutil.inputReadonly($('#ca_srchItemAttr2Cont'));

			var date = clutil.ymd2date(clutil.addDate(clcom.getOpeDate(), -1));

			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchToDate'));

			// ラジオボタン初期化
			$("input[name='ca_srchCompMethod'][value='1']").radio('check');

			// 初期値を設定
			this.deserialize( {
				srchUnitID	: clcom.userInfo.unit_id,					// 事業ユニットID
				srchAbcSw	: 1,
				srchFromDate	: date,									// 対象期間開始日(前日)
				srchToDate	: date,										// 対象期間終了日(前日)
			});


			// 組織選択画面
			this.AMPAV0020Selector = new  AMPAV0020SelectorView({
				el				: $("#ca_AMPAV0020_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				select_mode		: clutil.cl_single_select,	// 単一選択モード
				isAnalyse_mode 	: false,						// 通常画面モード
			});
			this.AMPAV0020Selector.render();

			// 比較対象組織オートコンプリート
			this.compOrgAutocomplete = this.getOrg($("#ca_srchCompOrgID"), clcom.userInfo.unit_id);
			// 比較対象組織選択画面
			this.AMPAV0020Selector2 = new  AMPAV0020SelectorView({
				el				: $("#ca_AMPAV0020_2_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				select_mode		: clutil.cl_single_select,	// 単一選択モード
				isAnalyse_mode 	: false,						// 通常画面モード
			});
			this.AMPAV0020Selector2.render();



			// 組織
			this.orgAutocomplete = this.getOrg($("#ca_srchOrgID"), clcom.userInfo.unit_id);
			if (clcom.userInfo && clcom.userInfo.org_id && clcom.userInfo.org_kind_typeid) {
				var code = (clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID')) ||
						clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')))
						? '' : clcom.userInfo.org_code ;
//				this.orgAutocomplete.setValue({
//					id: clcom.userInfo.org_id,
//					code: code,
//					name: clcom.userInfo.org_name
//				});
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					// 店舗ユーザー
					this.orgAutocomplete.setValue({
						id: clcom.userInfo.org_id,
						code: code,
						name: clcom.userInfo.org_name
					});
					clutil.inputReadonly($("#ca_srchOrgID"));
					clutil.inputReadonly($("#ca_btn_org_select"));
					clutil.inputReadonly($("#ca_srchExistSw"));
				} else if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF) {
					// MD-3843 社員ユーザの場合は参照可能組織の値を見て制御を変更する
					if (clcom.userInfo.dataperm_typeid != amcm_type.AMCM_VAL_DATAPERM_FULL) {
						clutil.viewReadonly($('#ca_srchUnitID_div'));
					}
				} else {
//					this._onSrchUnitChanged();
					var unitID = Number($('#ca_srchUnitID').val());
					if (unitID == 0) {
						unitID = clcom.userInfo.unit_id;
					}

					this.getOrg($("#ca_srchOrgID"), unitID);
					this.$("#ca_srchOrgID").attr("readonly", (unitID == 0));
					this.$("#ca_btn_org_select").attr("disabled", (unitID == 0));
					clutil.inputReadonly($("#ca_srchExistSw"));
					this.getOrg($("#ca_srchCompOrgID"), unitID);
					this.$("#ca_srchCompOrgID").attr("readonly", (unitID == 0));
					this.$("#ca_btn_compare_select").attr("disabled", (unitID == 0));
					clutil.inputReadonly($("#ca_srchCompExistSw"));
				}
			}

			// 初期フォーカスオブジェクト設定
			this.$tgtFocus = null;

			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					this.$tgtFocus = $("#ca_srchItgrpID");
				}
				else{
					this.$tgtFocus = $("#ca_srchOrgID");
				}
			}
			else{
				this.$tgtFocus = $("#ca_srchUnitID");
			}
			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);

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

			var uri = 'am_pa_itemattrgrpfunc_srch';
			var defer = clutil.postJSON(uri, req).done(_.bind(function(data){
				this.itemattrgrpfuncselector(data.list);
				console.log(data.list);
			}, this)).fail(_.bind(function(data){
				console.log('error!!');
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

			$.each(list, function(){
				var name = _this.gettypename(this.iagfunc);
				if (name) {
					html_source += '<option value="' + this.iagfunc.id + '">' + name + '</option>';
				}
			});

			$("#ca_srchItemAttr1Sw").html('');
			$("#ca_srchItemAttr1Sw").html(html_source).selectpicker().selectpicker('refresh');
			$("#ca_srchItemAttr2Sw").html('');
			$("#ca_srchItemAttr2Sw").html(html_source).selectpicker().selectpicker('refresh');
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
				clconst.ITEMATTRGRPFUNC_ID_DESIGN,
				clconst.ITEMATTRGRPFUNC_ID_MATERIAL,
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
			var retStat = true;

			if(!this.validator.valid()){
				retStat = false;
			}
			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_srchFromDate',
				edval : 'ca_srchToDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}
			// 同一商品分類チェック
			var same_itemAttrCont = '同じ商品属性内容は指定できません。';
			var itemAttr1Sw = $('#ca_srchItemAttr1Sw').val();
			var itemAttr2Sw = $('#ca_srchItemAttr2Sw').val();
			var itemAttr1Cont = $('#ca_srchItemAttr1Cont').val();
			var itemAttr2Cont = $('#ca_srchItemAttr2Cont').val();
			if (itemAttr1Sw > 0 && itemAttr1Sw == itemAttr2Sw && itemAttr1Cont == itemAttr2Cont) {
				this.validator.setErrorMsg($('#ca_srchItemAttr1Cont'), same_itemAttrCont);
				this.validator.setErrorMsg($('#ca_srchItemAttr2Cont'), same_itemAttrCont);
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return false;
			}

			return true;
		},

		/**
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				return;
			}
			var unitID = Number($(e.target).val());
			if (unitID == 0) {
				if (e != null && e.unit_id != null) {
					unitID = e.unit_id;
				}
			}

			this.getOrg($("#ca_srchOrgID"), unitID);
			this.orgAutocomplete.setValue();
			this.$("#ca_srchOrgID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_org_select").attr("disabled", (unitID == 0));
			this.getOrg($("#ca_srchCompOrgID"), unitID);
			this.compOrgAutocomplete.setValue();
			this.$("#ca_srchCompOrgID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_compare_select").attr("disabled", (unitID == 0));
			if (unitID == 0) {
				$("#ca_srchExistSw").checkbox('uncheck');
				$("#ca_srchCompExistSw").checkbox('uncheck');
				clutil.inputReadonly($("#ca_srchExistSw"));
				clutil.inputReadonly($("#ca_srchCompExistSw"));
			} else {
				clutil.inputRemoveReadonly($("#ca_srchExistSw"));
				clutil.inputRemoveReadonly($("#ca_srchCompExistSw"));
			}
			this._onSrchItgrpChanged();
		},

		/**
		 * 組織オートコンプ入れ替え
		 */
		getOrg: function($tgt, unitID){
			return clutil.clorgcode({
				el: $tgt,
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				}
			});
		},

		/**
		 * 品種が変更されたイベント
		 */
		_onSrchItgrpChanged: function(e){
//			console.log(e);
			if(this.deserializing){
				// データセット中
				return;
			}
			var itgrpID = $('#ca_srchItgrpID').val();
			if (itgrpID == 0) {
				$('#ca_srchItemAttr1Sw').selectpicker('val', 0);
				$('#ca_srchItemAttr2Sw').selectpicker('val', 0);
				clutil.inputReadonly($('#ca_srchItemAttr1Sw'));
				clutil.inputReadonly($('#ca_srchItemAttr2Sw'));
			} else {
				clutil.inputRemoveReadonly($('#ca_srchItemAttr1Sw'));
				clutil.inputRemoveReadonly($('#ca_srchItemAttr2Sw'));
			}
			this._onItemAttr1SwChange();
			this._onItemAttr2SwChange();
		},

		/**
		 * 組織選択ボタン押下
		 */
		_onShowOrgSelClick: function(e) {
			var _this = this;

			// 選択された情報を初期値として検索する
			var func_id = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
			var r_org_id = this.$("#ca_srchUnitID").val() == 0 ? 3 : Number(this.$("#ca_srchUnitID").val());
			// 3 は　(株)AOKIのorg_id いつでも触れるようにするならパラメータ化が必要
			// ＋組織画面側で選択した事業ユニットの渡しが必要となる。
//			var initData = {};
//			initData.func_id = Number(clcom.getSysparam("PAR_AMMS_DEFAULT_ORG_FUNCID"));
			this.AMPAV0020Selector.show(null, false, func_id, null, null, r_org_id);

			// サブ画面復帰後処理
			this.AMPAV0020Selector.okProc = function(data) {
				if(data != null && data.length > 0) {
					// 組織を取出す
					data[0].id = data[0].val;
					_this.orgAutocomplete.setValue(data[0]);
				} else {
					var org = _this.orgAutocomplete.getValue();
					if (org.id == 0) {
						_this.orgAutocomplete.resetValue();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_org_select"));
				});
			};
		},

		/**
		 * 比較対象組織選択ボタン押下
		 */
		_onShowCompOrgClick: function(e) {
			var _this = this;

			// 選択された情報を初期値として検索する
			var func_id = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
			//var r_org_id = this.$("#ca_srchUnitID").val() == 0 ? 3 : Number(this.$("#ca_srchUnitID").val());
			var r_org_id;
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF) {
				r_org_id = clcom.userInfo.permit_top_org_id;
			} else {
				r_org_id = this.$("#ca_srchUnitID").val() == 0 ? 3 : Number(this.$("#ca_srchUnitID").val());
			}
			// 3 は　(株)AOKIのorg_id いつでも触れるようにするならパラメータ化が必要
			// ＋組織画面側で選択した事業ユニットの渡しが必要となる。
//			var initData = {};
//			initData.func_id = Number(clcom.getSysparam("PAR_AMMS_DEFAULT_ORG_FUNCID"));
			this.AMPAV0020Selector2.show(null, false, func_id, null, null, r_org_id);

			//サブ画面復帰後処理
			this.AMPAV0020Selector2.okProc = function(data) {
				if(data != null && data.length > 0) {
					// 組織を取出す
					data[0].id = data[0].val;
					_this.compOrgAutocomplete.setValue(data[0]);
				} else {
					var org = _this.compOrgAutocomplete.getValue();
					if (org.id == 0) {
						_this.compOrgAutocomplete.resetValue();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_compare_select"));
				});
			};
		},

		/**
		 * 商品属性1変更時
		 */
		_onItemAttr1SwChange: function(e) {
			// 商品属性1の中身取得
			var iagfuncID = Number($('#ca_srchItemAttr1Sw').selectpicker('val'));
			if (iagfuncID == 0) {
				$('#ca_srchItemAttr1Cont').selectpicker('val', 0);
				clutil.inputReadonly($('#ca_srchItemAttr1Cont'));
				$('#ca_srchItemAttr1Cont').removeClass('cl_required');
			} else {
				var data = $('#ca_srchItgrpID').autocomplete('clAutocompleteItem');
				var itgrp = _.pick(data, 'id');
				clutil.clitemattrselector($('#ca_srchItemAttr1Cont'), iagfuncID, itgrp.id, 1);
				clutil.inputRemoveReadonly($('#ca_srchItemAttr1Cont'));
				$('#ca_srchItemAttr1Cont').addClass('cl_required');
			}
		},

		/**
		 * 商品属性2変更時
		 */
		_onItemAttr2SwChange: function(e) {
			// 商品属性2の中身取得
			var iagfuncID = Number($('#ca_srchItemAttr2Sw').selectpicker('val'));
			if (iagfuncID == 0) {
				$('#ca_srchItemAttr2Cont').selectpicker('val', 0);
				clutil.inputReadonly($('#ca_srchItemAttr2Cont'));
				$('#ca_srchItemAttr2Cont').removeClass('cl_required');
			} else {
				var data = $('#ca_srchItgrpID').autocomplete('clAutocompleteItem');
				var itgrp = _.pick(data, 'id');
				clutil.clitemattrselector($('#ca_srchItemAttr2Cont'), iagfuncID, itgrp.id, 1);
				clutil.inputRemoveReadonly($('#ca_srchItemAttr2Cont'));
				$('#ca_srchItemAttr2Cont').addClass('cl_required');
			}
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

		_eof: 'AMBRV0050.SrchCondView//'
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

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId: -1,
				title: 'ABC分析',
				subtitle: '',
//				btn_csv: (clcom.userInfo && clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF),
				btn_submit: false
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

//			// グループID -- AMBRV0050 なデータに関連することを表すためのマーキング文字列
//			var groupid = 'AMBRV0050';

			// ページャ
//			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
//			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			// ツールチップ
			$("#ca_tp_compare").tooltip({html: true});

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});

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
//			for(var i = 0; i < this.pagerViews.length; i++){
//				this.pagerViews[i].render();
//			}

			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq) {
			var srchReq;
			if (arguments.length > 0) {
				srchReq = argSrchReq;
			} else {
				if (this.srchCondView.isValid()) {
					srchReq = this.srchCondView.serialize();
				} else {
					// メッセージは、srchConcView 側で出力済。
					return;
				}
			}
			if (srchReq.srchSeasonSw == null) {
				srchReq.srchSeasonSw = [];
			}

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
//				reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMBRV0050SchReq: srchReq
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);

			// 検索実行
			this.doSrch(req);
		},

//		/**
//		 * ページ切り替え/表示件数変更からの再検索
//		 */
//		_onPageChanged: function(groupid, pageReq, from){
//			if(groupid !== 'AMBRV0050'){
//				return;
//			}
//
//			if(!this.savedReq){
//				console.warn('検索条件が保存されていません。');
//				return;
//			}
//
//			// 検索条件を複製してページリクエストを差し替える
//			var req = _.extend({}, this.savedReq);
//			req.reqPage = pageReq;
//
//			// 検索実行
//			this.doSrch(req);
//		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMBRV0050', srchReq).done(_.bind(function(data){
				var recs = data.AMBRV0050SchRsp;
				if (_.isEmpty(recs)) {
					// エラーメッセージ表示
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

					// 画面を一旦リセット
					mainView.srchAreaCtrl.reset();
					// 検索ペイン／結果ペインを表示
					mainView.srchAreaCtrl.show_srch();

					return;

				} else {
					// データセット
					this.setDispData(recs);
					this.setRankNum(this.dispData.header.rankNum);

					// リクエストを保存。
					this.savedReq = srchReq;

					// 結果ペインを表示
					this.srchAreaCtrl.show_result();

					// グリッド初期化
					this.initGrid();

					// グリッドデータ作成
					this.createGridData(this.dispData);

					// グリッド表示
					this.renderGrid(this.dispData);

					if (clcom.userInfo && (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS)) {
						// Excelダウンロードボタンを表示する
						this.mdBaseView.options.btn_csv = true;
						this.mdBaseView.renderFooterNavi();
					}

					// フォーカスの設定
//					if (typeof $focusElem != 'undefined') {
//						this.resetFocus($focusElem);
//					}
					this.resetFocus($focusElem);

					// 表示位置を調整
					clcom.targetJump('searchAgain', 100);
				}
			}, this)).fail(_.bind(function(data){
				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				if (data.rspHead.fieldMessages) {
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
					return;
				}

				// フォーカスの設定
				this.resetFocus($focusElem);

			}, this));

			return defer;
		},

		setDispData: function(rsp){
			this.dispData = null;

			// テーブルのヘッダ部分のデータを生成する
			var tableData = {
				header:{
					rankNum	: null,
					itemAttrNameList	: new Array(),
				},
				body:new Array(),
			};

			var hd = tableData.header;
			var bd = tableData.body;

			hd.rankNum = {
				rankANum : rsp.rankANum,
				rankBNum : rsp.rankBNum,
				rankCNum : rsp.rankCNum,
				rankDNum : rsp.rankDNum,
				totalNum : rsp.totalNum,
			};
			// テーブルのヘッダ部分のデータを生成する
			$.each(rsp.itemAttrNameList, function(i){
				hd.itemAttrNameList.push({name : this});
			});

			// テーブルの縦軸部分のデータを生成する
			$.each(rsp.rspList, function(i){

				if (i == 0) {
					this.rankSw = "合計";
					this.rankNum = "";
					this.compRankNum = "";
				}

				// テーブルの横軸部分のデータを生成する
				var obj = {
					rankSw	: this.rankSw,
					rankNum	: this.rankNum,
					compRankNum	: this.compRankNum,
					makerName	: this.makerName,
					makerCode	: this.makerCode,
					itemName	: this.itemName,
					colorName	: this.colorName,
					saleQty	: this.saleQty,
					saleQtyRatio	: this.saleQtyRatio.toFixed(1),
					saleAm	: this.saleAm,
					meanPrice	: this.meanPrice,
					marginRate	: this.marginRate.toFixed(1),
					stockQty	: this.stockQty,
					stockNOD	: this.stockNOD,
					compStockNOD	: this.compStockNOD,
				};
				for (var j = 0; j < this.itemAttr.length; j++){
					var id = '' + j + '_itemAttrName';
					obj[id] = this.itemAttr[j];
				}
				bd.push(obj);
			});

			var row_cnt = bd.length + 3;	// hd+80px
			var max_height = (row_cnt < 15) ? row_cnt * 40 : 600;
			$('#ca_datagrid').css('height', max_height + 'px');

			this.dispData = tableData;
		},

		/**
		 * メーカー品番数などのデータをセットする
		 */
		setRankNum: function(recs) {
			var $num = this.$('#ca_rankNum');
			$num.find('[id]').each(function(){
				var $label = $(this);
				var id = this.id;
				var val = (recs && recs[id]) ? clutil.comma(recs[id]) : '-';
				$label.text(val);
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
			var defer = clutil.postDLJSON('AMBRV0050', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				if (data.rspHead.fieldMessages) {
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}

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
			this.srchAreaCtrl.show_srch();
			this.mdBaseView.options.btn_csv = false;
			this.mdBaseView.renderFooterNavi();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex, e) {
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
				break;

			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;

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

//			// テーブルをクリア
//			this.recListView.clear();
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

		initGrid:function(){
			// データグリッド
			this.dataGrid  = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid',	// エレメント
				lineno			: false,			// 行番号表示する/しないフラグ。
				delRowBtn		: false,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: false,			// フッター部の新規行追加ボタンを使用するフラグ。
			});
			this.dataGrid.getMetadata = this.getMetadata;
//			this.listenTo(this.dataGrid, this.gridEvents);

			this.dataGrid.render();
		},

		getMetadata: function(rowIndex){
			if (rowIndex == 0) {
				return {
					cssClasses: 'reference'
				};
			}
		},

		gridEvents:{
			'click:cell' : function(target, args){
				// TODO:ソート処理
				var key = target.target.textContent;
				if (args.row == 0) {
					this.dispDataSort(key);
				}
			},
		},

		dispDataSort: function (key) {
			var sortKey = this.sortMap[key];

			switch (key) {
			case '売上数':
				this.dispData.body.sort(function(a, b) {
					if (a.rankSw == '合計') {
						return;
					}
					if (Number(a.saleQty) == Number(b.saleQty)) {
						return 0;
					}
					if (sortKey.sortOrder == 1) {
						return (Number(a.saleQty) - Number(b.saleQty));
					} else {
						return (Number(b.saleQty) - Number(a.saleQty));
					}
				});

				break;

			case '売上高':
				this.dispData.body.sort(function(a, b) {
					if (a.rankSw == '合計') {
						return;
					}
					if (Number(a.saleAm) == Number(b.saleAm)) {
						return 0;
					}
					if (sortKey.sortOrder == 1) {
						return (Number(a.saleAm) - Number(b.saleAm));
					} else {
						return (Number(b.saleAm) - Number(a.saleAm));
					}
				});

				break;

			default:
				return;
			}

			// グリッド初期化
			this.initGrid();

			// グリッド表示
			this.renderGrid(this.dispData);

			// 降順・昇順入替
			sortKey.sortOrder = (sortKey.sortOrder == 1) ? -1 : 1;
			console.log(this.sortMap);

		},

		createGridData: function(data){
			var _this = this;
			this.sortMap = {};

			this.columns = [
			{
				id: 'rankSw',
				name: '区分',
				field: 'rankSw',
				width: 50
			},
			{
				id: 'rankNum',
				name: '順位',
				field: 'rankNum',
				width: 50
			},
			{
				id: 'compRankNum',
				name: '比較順位',
				field: 'compRankNum',
				width: 80
			},
			{
				id: 'makerName',
				name: 'メーカー名',
				field: 'makerName',
				width: 240
			},
			{
				id: 'makerCode',
				name: 'メーカー品番',
				field: 'makerCode',
				width: 100
			},
			{
				id: 'itemName',
				name: '商品名',
				field: 'itemName',
				width: 240
			},
			{
				id: 'colorName',
				name: 'カラー',
				field: 'colorName',
				width: 100
			},
			{
				id: 'saleQty',
				name: '売上数',
				field: 'saleQty',
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			},
			{
				id: 'saleQtyRatio',
				name: '構成比',
				field: 'saleQtyRatio',
				cssClass: 'txtalign-right',
				width: 80,
				cellType: {
					formatFilter: 'comma'
				}
			},
			{
				id: 'saleAm',
				name: '売上高',
				field: 'saleAm',
				cssClass: 'txtalign-right',
				width: 120,
				cellType: {
					formatFilter: 'comma'
				}
			},
			{
				id: 'meanPrice',
				name: '平均上代',
				field: 'meanPrice',
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			},
			{
				id: 'marginRate',
				name: '経準率',
				field: 'marginRate',
				cssClass: 'txtalign-right',
				width: 80,
				cellType: {
					formatFilter: 'comma'
				}
			},
			{
				id: 'stockQty',
				name: '在庫数',
				field: 'stockQty',
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			},
			{
				id: 'stockNOD',
				name: '在庫日数',
				field: 'stockNOD',
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			},
			{
				id: 'compStockNOD',
				name: '比較在庫日数',
				field: 'compStockNOD',
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			}];

			var itemAttrNameList = data.header.itemAttrNameList;
			$.each(itemAttrNameList, function(i){
				var id = '' + i + '_itemAttrName';
				var name = {
					id: id,
					name: this.name,
					field: id,
					width: 100
				};
				_this.columns.splice(6 + i, 0, name);
			});

			// ソートキー作成
			$.each(this.columns, function(i){
				var key = this.name;
				_this.sortMap[key] = {
					sortOrder: -1,
					sortKey: key
				};
			});
		},

		renderGrid: function(data){
			this.dataGrid.render().setData({
				gridOptions: {
//					rowHeight: 40,
					autoHeight: false,
					frozenRow: 2,
					frozenColumn: 5,
				},
				columns: this.columns,
				data: data.body,
			});
		},

		_eof: 'AMBRV0050.MainView//'
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
