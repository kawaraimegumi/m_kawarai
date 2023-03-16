useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		// 要素
		el	:$("#ca_main"),

		validator : null,

		// Events
		events : {
			'click #ca_btn_store_select'	: '_onStoreSelClick',
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
				],
				f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ))
			};
			this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * 初期化
		 */
		initialize: function() {
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '在庫未反映客注入荷予定数明細出力',
				btn_submit: false,
				btn_csv: false
			});

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback')
			});

			this.initUIElement_AMPAV0010();

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function() {
			this.mdBaseView.initUIElement();
			clutil.inputlimiter(this.$el);

			// 対象期間
			this.utl_fromDate = clutil.datepicker(this.$('#ca_srchFrom'));
			this.utl_toDate = clutil.datepicker(this.$('#ca_srchTo'));

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: '#ca_srchUnitID',
					initValue: clcom.userInfo.unit_id,
				},
				//店舗オートコンプ
				clorgcode: {
					el : '#ca_srchStoreID',
					addDepends: ['p_org_id'],
					dependSrc: {
						p_org_id: 'unit_id'
					}
				},
				// 店舗参照ボタン
				AMPAV0010: {
					button: this.$('#ca_btn_store_select'),
					view: this.AMPAV0010Selector
				},

				// 品種
				clvarietycode: {
					el: '#ca_srchStditgrpID'
				},
			}, {
				dataSource: {
					ymd : clcom.getOpeDate,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
				}
			});
			this.fieldRelation.done(function() {
				var tgtView = mainView;
				tgtView.utl_unit = this.fields.clbusunitselector;
				tgtView.utl_store = this.fields.clorgcode;
				tgtView.setInitializeValue();
				tgtView.setDefaultEnabledProp();
			});

			// 初期フォーカスオブジェクト設定
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
				clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				this.$tgtFocus = $('#ca_srchStditgrpID');
			} else {
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS){
					this.$tgtFocus = $('#ca_srchUnitID');
				}else{
					this.$tgtFocus = $('#ca_srchStoreID');
				}
			}

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);

			return this;
		},

		setInitializeValue: function(){
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
					clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				var storeID = clcom.userInfo.org_id;
				var storeCode = clcom.userInfo.org_code;
				var storeName = clcom.userInfo.org_name;
				$(this.utl_store.el).autocomplete('clAutocompleteItem', {id: storeID, code: storeCode, name: storeName});
				this.utl_store.setValue({id: storeID, code: storeCode, name: storeName});
			}

			if(!clcom.pageData){
				this.utl_fromDate.datepicker('setIymd', clcom.getOpeDate());
				this.utl_toDate.datepicker('setIymd', clcom.getOpeDate());
			}
		},

		setDefaultEnabledProp: function() {
			// 初期活性制御
			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS){
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
					clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					clutil.viewReadonly($("#div_ca_store"));
				}else{
					if (clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					}
				}
			}

			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS &&
				clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$("#div_ca_unitID").hide();
			}

			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE &&
				clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN &&
				clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS) {
				$("#div_ca_grp_editbtn").hide();
			}

		},

		initUIElement_AMPAV0010 : function(){
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el				: $("#ca_AMPAV0010_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				select_mode 	: clutil.cl_single_select,		// 単一選択
				isAnalyse_mode 	: false,						// 通常画面モード
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
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			var hasError = !this.validator.valid();

			var fromDate = clutil.dateFormat(this.utl_fromDate.val(), "yyyymmdd");
			var toDate = clutil.dateFormat(this.utl_toDate.val(), "yyyymmdd");

			if(fromDate.length == 0) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				this.validator.setErrorMsg(this.utl_fromDate, clmsg.cl_required);

				hasError = true;
			}
			if(toDate.length == 0) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				this.validator.setErrorMsg(this.utl_toDate, clmsg.cl_required);

				hasError = true;
			}
			if (!hasError) {
				var chkInfo = [];

				chkInfo.push({
					stval : 'ca_srchFrom',
					edval : 'ca_srchTo'
				});

				if(!this.validator.validFromTo(chkInfo)){
					hasError = true;
				}
			}

			return !hasError;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();

			return this;
		},

		buildReq: function(rtyp){
			// validation
			if(!this.isValid()){
				return null;
			}

			// リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				rtype: rtyp,
				AMICV0100GetReq: srchDto
			};

			return reqDto;
		},

		/**
		 * 表示ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				console.log('CSV 出力');
				this.doCSVDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		doCSVDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMICV0100', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

	});

	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

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
