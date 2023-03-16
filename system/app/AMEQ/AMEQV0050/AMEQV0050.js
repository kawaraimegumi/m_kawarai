/**
 * 備品一覧（発注登録）
 */
useSelectpicker2();

var _fixed1 = $.inputlimiter.Filters.fixed(1);
function fixed1(value) {
	return _fixed1.set(value);
}

$(function(){

	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	$(window).resize(function() {
		$('#innerScroll').perfectScrollbar('update');
	});

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',
			'click #ca_srch'				: '_onSrchClick',		// 検索ボタン押下時
			'change #ca_srchUnitID'			: '_onUnitChanged'		// 事業ユニット変更
		},

		// 店舗選択ボタン
		_onStoreSelClick: function(e){
			var options = {
				func_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id	: this.utl_unit.getValue(),
				org_kind_set: [
								am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,		//店舗
								am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,		//倉庫
					            am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ			//本部
							]
			};
			this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			this.initUIElement_AMPAV0010();
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			clutil.inputlimiter(this.$el);

			this.$tgtFocus = $('#ca_srchUnitID');

			this.prevUnitId = clcom.userInfo.unit_id;

			// フィールドリレーションの設定
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
				}
			}, {
				dataSource: {
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});

			this.fieldRelation.done(function() {
				var tgtView = mainView.srchCondView;
				tgtView.utl_unit = this.fields.clbusunitselector;
				tgtView.utl_store = this.fields.clorgcode;
				tgtView.setInitializeValue();
				tgtView.setDefaultEnabledProp();
				tgtView._onUnitChanged();

				// 初期フォーカス設定
				clutil.setFocus(tgtView.$tgtFocus);
			});


			//XXX:備品区分
			this.utl_equipType = clutil.cltypeselector({
				el: '#ca_srchEquipTypeID',
				kind: amcm_type.AMCM_TYPE_EQUIP_TYPE,
				ids: [
						amcm_type.AMCM_VAL_EQUIP_TYPE_PACKING,		// 10:包装
						amcm_type.AMCM_VAL_EQUIP_TYPE_PACKAGE,		// 11:パッケージ
						amcm_type.AMCM_VAL_EQUIP_TYPE_SYSTEM,		// 13:システム
						amcm_type.AMCM_VAL_EQUIP_TYPE_RESIZE,		// 21:補正
						amcm_type.AMCM_VAL_EQUIP_TYPE_BALOON,		// 30:風船関連備品
						amcm_type.AMCM_VAL_EQUIP_TYPE_DISCOUNT,		// 31:商品割引券
						amcm_type.AMCM_VAL_EQUIP_TYPE_MAIL,			// 32:メール会員登録他
						amcm_type.AMCM_VAL_EQUIP_TYPE_POP,			// 33:POP
						amcm_type.AMCM_VAL_EQUIP_TYPE_SLTAG,		// 39:SL下げ札
						amcm_type.AMCM_VAL_EQUIP_TYPE_SHTAG,		// 40:肩タグ・肩タグ用シール
						amcm_type.AMCM_VAL_EQUIP_TYPE_SHTAGSL,		// 41:肩タグ用シール
						amcm_type.AMCM_VAL_EQUIP_TYPE_CCLTAG,		// 42:円タグ
						amcm_type.AMCM_VAL_EQUIP_TYPE_SLVCOVER_ETC,	// 43:袖かぶせその他
						amcm_type.AMCM_VAL_EQUIP_TYPE_LEAF,			// 44:リーフレット・ビラ
						amcm_type.AMCM_VAL_EQUIP_TYPE_SLVTAG,		// 45:袖タグ
						amcm_type.AMCM_VAL_EQUIP_TYPE_PETSL,		// 46:PETシール
						amcm_type.AMCM_VAL_EQUIP_TYPE_PLC,			// 47:プライスカード
						amcm_type.AMCM_VAL_EQUIP_TYPE_MDSLVCOVER,	// 48:マークダウン袖かぶせ
						amcm_type.AMCM_VAL_EQUIP_TYPE_HALF_MDSLVCOVER,	// 49:半額マークダウン袖かぶせ
						amcm_type.AMCM_VAL_EQUIP_TYPE_MDSL,			// 50:マークダウンシール
						amcm_type.AMCM_VAL_EQUIP_TYPE_SIZESL,		// 51:サイズシール
						amcm_type.AMCM_VAL_EQUIP_TYPE_SIZESLBY,		// 52:サイズシールBY用
						amcm_type.AMCM_VAL_EQUIP_TYPE_TSSIZESLTS,	// 53:TSサイズシールTS用
						amcm_type.AMCM_VAL_EQUIP_TYPE_SLETC,		// 54:シールその他
						amcm_type.AMCM_VAL_EQUIP_TYPE_RACK,			// 55:棚挿し
						amcm_type.AMCM_VAL_EQUIP_TYPE_COLLECTSL,	// 56:タグ訂正シール
						amcm_type.AMCM_VAL_EQUIP_TYPE_SIZECHIP,		// 57:サイズチップスーツ・礼服・コート・JK・CY
						amcm_type.AMCM_VAL_EQUIP_TYPE_SIZECHIPSL,	// 58:サイズチップＳＬ
						amcm_type.AMCM_VAL_EQUIP_TYPE_SIZECHIPL,	// 59:サイズチップレディス
						amcm_type.AMCM_VAL_EQUIP_TYPE_CCLCHIP,		// 60:円チップ
						amcm_type.AMCM_VAL_EQUIP_TYPE_HANGERNECKTAG,// 61:ハンガーネックタグ
						amcm_type.AMCM_VAL_EQUIP_TYPE_SCHIP_SMX,	// 62:サイズチップSMX専用
						amcm_type.AMCM_VAL_EQUIP_TYPE_BLAND_COVER,	// 63:ブランドかぶせ
						amcm_type.AMCM_VAL_EQUIP_TYPE_HANGER,		// 65:ハンガー
						amcm_type.AMCM_VAL_EQUIP_TYPE_STORE_EQUIP,	// 68:店内備品
						amcm_type.AMCM_VAL_EQUIP_TYPE_ENVELOPE,		// 70:事務・封筒
						amcm_type.AMCM_VAL_EQUIP_TYPE_FAX,			// 72:FAX
						amcm_type.AMCM_VAL_EQUIP_TYPE_BOOK,			// 80:伝票・冊子
						amcm_type.AMCM_VAL_EQUIP_TYPE_SWEEP_OUT_OF_STORE,	// 90:除草剤・噴霧器
					],
					unselectedflag: 1
	    	});

			//XXX:備品区分
			this.utl_equipType_ori = clutil.cltypeselector({
				el: '#ca_srchEquipTypeID_ori',
				kind: amcm_type.AMCM_TYPE_EQUIP_TYPE,
				ids: [
						amcm_type.AMCM_VAL_EQUIP_TYPE_PACKAGE_EQ,	// 0:パッケージ備品
						amcm_type.AMCM_VAL_EQUIP_TYPE_8H,			// 1:エイトハート
						amcm_type.AMCM_VAL_EQUIP_TYPE_ORG,			// 2:オリジナル
						amcm_type.AMCM_VAL_EQUIP_TYPE_SIZECHIP_OR,	// 3:サイズチップ
						amcm_type.AMCM_VAL_EQUIP_TYPE_ATTACH,		// 4:商品付属品
						amcm_type.AMCM_VAL_EQUIP_TYPE_SYSTEM_EQ,	// 5:システム備品
						amcm_type.AMCM_VAL_EQUIP_TYPE_STATIONARY,	// 6:事務用品
						amcm_type.AMCM_VAL_EQUIP_TYPE_PLSL,			// 7:プライスシール
						amcm_type.AMCM_VAL_EQUIP_TYPE_SLIP,			// 8:伝票類
						amcm_type.AMCM_VAL_EQUIP_TYPE_OTHER,		// 9:その他
						amcm_type.AMCM_VAL_EQUIP_TYPE_STNBAR,		// 66:スタンバー
					],
					unselectedflag: 1
	    	});

			//XXX:発注方法
			this.utl_OrderFuncType = clutil.cltypeselector({
				el: '#ca_srchOrderFuncTypeID',
				kind: amcm_type.AMCM_TYPE_EQUIP_ORDER_TYPE,
				unselectedflag: 1
	    	});

			//XXX:発注方法(for ORIHICA)
			this.utl_OrderFuncType_ori = clutil.cltypeselector({
				el: '#ca_srchOrderFuncTypeID_ori',
				kind: amcm_type.AMCM_TYPE_EQUIP_ORDER_TYPE,
				ids: [
				      	amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_EQUIP,		// 1:備品発注
				      	amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_WORKFLOW,	// 4:ワークフロー
				      	amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_MAIL		// 5:メール
				     ],
				unselectedflag: 1
	    	});

			// 発注サイクル
			this.utl_OrderCycle = clutil.cltypeselector({
				el: '#ca_srchOrderCycleID',
				kind: amcm_type.AMCM_TYPE_ORD_CYCLE,
				unselectedflag: 1
	    	});

			// 発注締タイミング
			this.utl_OrderCountTiming = clutil.cltypeselector({
				el: '#ca_srchOrderCountTimingID',
				kind: amcm_type.AMCM_TYPE_EQUIP_ODER_CLOSE_TIMING,
				unselectedflag: 1
	    	});
		},

		setInitializeValue: function(){
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				var storeID = clcom.userInfo.org_id;
				var storeCode = clcom.userInfo.org_code;
				var storeName = clcom.userInfo.org_name;
				$(this.utl_store.el).autocomplete('clAutocompleteItem', {id: storeID, code: storeCode, name: storeName});
				this.utl_store.setValue({id: storeID, code: storeCode, name: storeName});
			}
		},

		setDefaultEnabledProp: function(){
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
				clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				clutil.viewReadonly($("#div_ca_store"));
				$("#div_ca_srchUnitID").hide();
				this.$tgtFocus = $('#ca_srchEquipTypeID');
			}else{
				if (clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					this.$tgtFocus = $('#ca_srchStoreID');
				}
			}

			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS &&
				clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$("#div_ca_srchUnitID").hide();
			}

			if (mainView.doInitialSearch){
				mainView.initialSearch();
			}
		},

		initUIElement_AMPAV0010 : function(){
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el				: $("#ca_AMPAV0010_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				select_mode 	: clutil.cl_single_select,		// 単一選択
				isAnalyse_mode 	: false						// 通常画面モード
			});

			this.AMPAV0010Selector.clear = function() {
				if (typeof mainView != "undefined") {
					var autocomplete = mainView.srchCondView.utl_store;
					autocomplete.resetValue();
				}
			};

			this.AMPAV0010Selector.render();
			this.AMPAV0010Selector.clear();

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

			// XXX:備品リスト設定
			var srchEquipTypeIDList = [];
			var $selectList1 = [];

			if(dto.srchUnitID == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$selectList1 = this.utl_equipType.getValue();
			}
			else{
				$selectList1 = this.utl_equipType_ori.getValue();
			}

			$.each($selectList1,function(){
				srchEquipTypeIDList.push(Number(this));
			});

			dto.srchEquipTypeIDList = srchEquipTypeIDList;

			// XXX:発注方法リスト設定
			var srchOrderFuncTypeIDList = [];
			var $selectList2 = [];

			if(dto.srchUnitID == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$selectList2 = this.utl_OrderFuncType.getValue();
			}
			else{
				$selectList2 = this.utl_OrderFuncType_ori.getValue();
			}

			$.each($selectList2,function(){
				srchOrderFuncTypeIDList.push(Number(this));
			});

			dto.srchOrderFuncTypeIDList = srchOrderFuncTypeIDList;

			// 発注サイクルリスト設定
			var srchOrderCycleIDList = [];

			var $selectList3 = this.utl_OrderCycle.getValue();

			$.each($selectList3,function(){
				srchOrderCycleIDList.push(Number(this));
			});

			dto.srchOrderCycleIDList = srchOrderCycleIDList;

			// 発注締タイミングリスト設定
			var srchOrderCountTimingIDList = [];

			var $selectList4 = this.utl_OrderCountTiming.getValue();

			$.each($selectList4,function(){
				srchOrderCountTimingIDList.push(Number(this));
			});

			dto.srchOrderCountTimingIDList = srchOrderCountTimingIDList;

			clutil.mediator.trigger('ca_onSearch', dto);
		},

		/**
		 * 備品区分入れ替え
		 */
		setEquipTypeSel: function(unit){
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$("#ca_srchEquipTypeIDArea").show();
				$("#ca_srchEquipTypeIDArea_ori").hide();
				clutil.viewRemoveReadonly($("#ca_srchEquipTypeIDArea"));
				clutil.viewRemoveReadonly($("#ca_srchEquipTypeIDArea_ori"));
			}
			else if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				$("#ca_srchEquipTypeIDArea").hide();
				$("#ca_srchEquipTypeIDArea_ori").show();
				clutil.viewRemoveReadonly($("#ca_srchEquipTypeIDArea"));
				clutil.viewRemoveReadonly($("#ca_srchEquipTypeIDArea_ori"));
			}
			else{
				$("#ca_srchEquipTypeIDArea").show();
				$("#ca_srchEquipTypeIDArea_ori").hide();
				clutil.viewReadonly($("#ca_srchEquipTypeIDArea"));
				clutil.viewReadonly($("#ca_srchEquipTypeIDArea_ori"));
			}
		},

		/**
		 * 発注方法区分入れ替え
		 */
		setOrderFuncTypeSel: function(unit){

			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){

				$("#ca_srchOrderFuncTypeIDArea").show();
				$("#ca_srchOrderFuncTypeIDArea_ori").hide();
				clutil.viewRemoveReadonly($("#ca_srchOrderFuncTypeIDArea"));
				clutil.viewRemoveReadonly($("#ca_srchOrderFuncTypeIDArea_ori"));
			}
			else if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){

				$("#ca_srchOrderFuncTypeIDArea").hide();
				$("#ca_srchOrderFuncTypeIDArea_ori").show();
				clutil.viewReadonly($("#ca_srchOrderFuncTypeIDArea"));
				clutil.viewRemoveReadonly($("#ca_srchOrderFuncTypeIDArea_ori"));

			}
			else{

				$("#ca_srchOrderFuncTypeIDArea").show();
				$("#ca_srchOrderFuncTypeIDArea_ori").hide();
				clutil.viewRemoveReadonly($("#ca_srchOrderFuncTypeIDArea"));
				clutil.viewReadonly($("#ca_srchOrderFuncTypeIDArea_ori"));

			}
		},


		/**
		 * 事業ユニット変更
		 * @param e
		 */
		_onUnitChanged: function(e){
			var unitID = ~~$('#ca_srchUnitID').val();
			var sel_unit = unitID;

			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				//店舗部品操作不可
				clutil.inputReadonly("#ca_srchStoreID");
				clutil.inputReadonly("#ca_btn_store_select");

				sel_unit = clcom.userInfo.unit_id;
			}
			else{
				if (unitID == '0'){
					//店舗部品操作不可
					clutil.inputReadonly("#ca_srchStoreID");
					clutil.inputReadonly("#ca_btn_store_select");
				}else{
					if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE &&
						clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN){
						clutil.inputRemoveReadonly("#ca_srchStoreID");
						clutil.inputRemoveReadonly("#ca_btn_store_select");
					}
				}
			}

			if (unitID == '0' || unitID != this.prevUnitId){
				this.utl_store.resetValue();
			}
			this.prevUnitId = unitID;

			//備品区分
			this.setEquipTypeSel(sel_unit);

			// 備品区分の編集可不可判定
			// deferにしないとロードで戻った時に事業ユニット判定できなくなるため
			var equipReadOnly = this.equipReadOnly;
			_.defer(equipReadOnly);

			// 発注方法
			this.setOrderFuncTypeSel(sel_unit);

			// 発注方法の編集可不可判定
			// deferにしないとロードで戻った時に事業ユニット判定できなくなるため
			var orderFuncTypeReadOnly = this.orderFuncTypeReadOnly;
			_.defer(orderFuncTypeReadOnly);
		},

		/**
		 * 備品区分の編集可不可の判定
		 */
		equipReadOnly: function(){
			var unitID = ~~$('#ca_srchUnitID').val();

			if(unitID == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unitID == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				clutil.viewRemoveReadonly($("#ca_srchEquipTypeIDArea"));
			}
			else{
				clutil.viewReadonly($("#ca_srchEquipTypeIDArea"));
			}
		},

		/**
		 * 発注方法の編集可不可の判定
		 */
		orderFuncTypeReadOnly: function(){
			var unitID = ~~$('#ca_srchUnitID').val();

			if(unitID == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unitID == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				clutil.viewRemoveReadonly($("#ca_srchOrderFuncTypeIDArea"));
			} else {
				clutil.viewReadonly($("#ca_srchOrderFuncTypeIDArea"));
			}
		},

		_eof: 'AMEQV0050.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'			: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			// 行選択イベントを拾う
			'toggle thead th.cl_checkbox_selectall input[type="checkbox"]'		: '_onToggleSelectAll',
			'toggle tbody td.cl_checkbox_selectrec input[type="checkbox"]'		: '_onToggleSelect'
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title		: '備品',
				subtitle	: '一覧（発注登録）',
				btn_new		: false
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMEQV0050 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMEQV0050';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			// スクロールバー設定
		    $('#innerScroll').perfectScrollbar();

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			this.recListView.initUIElement();

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
			this.recListView.render();
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
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
				reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMEQV0050GetReq: srchReq
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);
			req.reqPage.page_size = 100;

			// 検索実行
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			if(groupid !== 'AMEQV0050'){
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
		 * 全選択イベント
		 * @param e
		 */
		_onToggleSelectAll: function(e) {

		},

		/**
		 * 行選択イベント
		 * @param e
		 */
		_onToggleSelect: function(e) {
			var $target = $(e.target);
			var isSelected = $target.prop('checked');
			var cb_arg = (isSelected) ? 'check' : 'uncheck';
			var $tr = $target.parents('tr');

			/*
			 * 1. $targetの行データを取得する
			 */
			var equipID = Number($tr.attr('equipID'));
			var row = this.curRecs[equipID];
			if (isSelected) {
				this.selectedRecs[equipID] = row;
			} else {
				delete this.selectedRecs[equipID];
			}
		},

		curRecs: {},
		selectedRecs: {},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			var _this = this;
			this.clearResult();

			var defer = clutil.postJSON('AMEQV0050', srchReq).done(_.bind(function(data){

				// データ取得
				var recs = data.AMEQV0050GetRsp.equipList;
				_this.curRecs = {};

				if (_.isEmpty(recs)) {
					// エラーメッセージ表示
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

					mainView.srchAreaCtrl.reset();

					// フォーカス設定
					this.resetFocus(this.srchCondView.$tgtFocus);
				} else {
					$.each(recs,function(){
						this.link = 0;

						if (~~this.orderFuncTypeID == amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_TANOMERU ||
								~~this.orderFuncTypeID == amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_WORKFLOW){
							this.fromDate =  clcom.min_date;
							this.toDate =  clcom.min_date;

							if (this.url){
								this.link = 1;
							}
						} else {
							this.fromDate = clcom.min_date;
							this.toDate = clcom.max_date;
						}

						this.equipTypeDispName = clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_TYPE, this.equipTypeID);
						this.orderFuncDispName = clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_ORDER_TYPE, this.orderFuncTypeID);
						this.orderCycleDispName = clutil.gettypename(amcm_type.AMCM_TYPE_ORD_CYCLE, this.orderCycleTypeID);

						this.orderUnitPriceDisp = fixed1(this.orderUnitPrice);

						var dispList = [];
						$.each(this.orderCountTimingTypeID,function(){
							dispList.push(clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_ODER_CLOSE_TIMING, ~~this));
						});
						this.orderCountTimingDispName = dispList.join(', ');
						this.departmentDispName = clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_DEPART_TYPE, this.departmentID);

						_this.curRecs[this.equipID] = this;
					});

					// リクエストを保存。
					this.savedReq = srchReq;

					// 結果ペインを表示
					this.srchAreaCtrl.show_result();

					// 内容物がある場合 --> 結果表示する。
					this.recListView.setRecs(recs);

					if(!_.isEmpty(recs)){
						for(var i = 0; i < recs.length; i++){
							mainView.recListView.setRowState({
								isMatch: function(item){
									return (
										item.orderFuncTypeID == amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_TANOMERU ||
										item.orderFuncTypeID == amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_WORKFLOW ||
										item.orderFuncTypeID == amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_MAIL ||
										item.orderFuncTypeID == amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_STORE119
									);
								},
								enable: false
							});
						}
					}

					// 初期選択の設定（オプション）
					if(!_.isEmpty(chkData)){
						this.recListView.setSelectRecs(chkData, true, ['equipID']);
						this.selectedRecs = {};
						_.each(chkData, _.bind(function(dat) {
							this.selectedRecs[dat.equipID] = dat;
						}, this));
					} else {
						var selectData = _.values(_this.selectedRecs);
						if (!_.isEmpty(selectData)) {
							this.recListView.setSelectRecs(selectData, true, ['equipID']);
						}
					}

					if (~~$('#ca_srchUnitID').val() == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
						$("#ca_table .cl_department").hide();
					} else {
						$("#ca_table .cl_department").show();
					}

					// フォーカス設定
					if(typeof $focusElem != 'undefined') {
						this.resetFocus($focusElem);
					}

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

					$('#innerScroll').perfectScrollbar('update');
				}
			}, this)).fail(_.bind(function(data){

				mainView.srchAreaCtrl.reset();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				// フォーカスの設定
				this.resetFocus();

			}, this));

			return defer;
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
			var defer = clutil.postDLJSON('AMEQV0050', srchReq);
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
			this.srchAreaCtrl.show_srch();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			if ($(e.currentTarget).data('typeid')) {
				var orderFuncTypeID = ~~$(e.currentTarget).data('typeid');

				if (orderFuncTypeID == amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_TANOMERU ||
					orderFuncTypeID == amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_WORKFLOW){
					return;
				}
			}

			var store = this.srchCondView.utl_store.getValue();

			var url = clcom.appRoot + '/AMEQ/AMEQV0060/AMEQV0060.html';
			var myData, destData;
			var chkData = _.values(this.selectedRecs);
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					btnId: e.target.id,
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMEQV0050GetReq,
					selectedIds: this.recListView.getSelectedIdList(),
					chkData: chkData
				};
				destData = {
					opeTypeId: rtyp,
					srchDate: this.savedReq.srchDate,
					srchCond: this.savedReq.AMEQV0050GetReq,
					chkData: chkData
				};

				destData.srchCond.store = store;

			}else{
				// 検索結果が無い場合
				myData = {
					btnId: e.target.id,
					savedReq: null,
					savedCond: this.srchCondView.serialize(),
					selectedIds: [],
					chkData: []
				};
				destData = {
					opeTypeId: rtyp
				};
			}

			var pushPageOpt = {
				url		: url,
				args	: destData,
				saved	: myData
			};

			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				// データが無くても可
				clcom.pushPage(pushPageOpt);
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				var lastClickedRec = this.recListView.getLastClickedRec();
				if(_.isEmpty(lastClickedRec)){
					// 最後にクリックした行データがとれなかった
					console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
					return;
				}
				destData.chkData = [ lastClickedRec ];
				destData.chkData[0].fromDate = clcom.getOpeDate();
				pushPageOpt.url = clcom.appRoot + '/AMEQ/AMEQV0040/AMEQV0040.html';
				pushPageOpt.newWindow = true;
				// fall through

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

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

			// 確定時用のデータを初期化
			this.savedReq = null;

			// テーブルをクリア
			this.recListView.clear();
		},

		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(model) {
			// 条件部の復元
			if(!_.isEmpty(model.savedCond)){
				this.srchCondView.deserialize(model.savedCond);
				// 店舗設定
				//this.srchCondView.utl_store.setValue({id: model.savedCond.store.id, code: model.savedCond.store.code, name: model.savedCond.store.name});
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}
		},

		initialSearch: function() {
//			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
//				var dto = this.srchCondView.serialize();
//				dto.srchEquipTypeID = "0";
//				clutil.mediator.trigger('ca_onSearch', dto);
//			}
		},

		_eof: 'AMEQV0050.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();
		mainView.doInitialSearch = false;

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
		} else {
			mainView.doInitialSearch = true;
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
