// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var AMIGV0030View = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		validator : null,

		// Events
		events : {
			'click #ca_btn_store_select'	:	'_onStoreSelClick',			// 店舗選択
//			'change #ca_srchPrintTypeID'	:	'_onSrchPrintTypeChange',	// 印刷状態変更時
			'change #ca_srchRprtStateID'	:	'_onSrchRprtStateChange',	// 帳票出力状態変更時
		},

		initialize: function() {
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '不良品処理報告',
				btn_submit: false
			});

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function() {
			var _this = this;
			this.mdBaseView.initUIElement();
			clutil.inputlimiter(this.$el);

			// 店舗部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});
			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					_this.storeAutocomplete.setValue({id: id, code: code, name: name});
				} else {
					var store = _this.storeAutocomplete.getValue();
					if (store.id == 0) {
						_this.AMPAV0010Selector.clear();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
			this.AMPAV0010Selector.clear = function() {
				_this.storeAutocomplete.resetValue();
			};

			// 店舗オートコンプリート
			this.storeAutocomplete = this.getOrg(0);

			// datepicker
			clutil.datepicker(this.$("#ca_srchFromDate"));
			clutil.datepicker(this.$("#ca_srchToDate"));

			// 印刷状態区分
//			clutil.cltypeselector(this.$("#ca_srchPrintTypeID"), amcm_type.AMCM_TYPE_PRINT_STATE, 1);
			// 帳票印刷状態区分
			clutil.cltypeselector(this.$("#ca_srchRprtStateID"), amcm_type.AMCM_TYPE_REPORT_STATE, 1);

			// 初期値を設定
			this.deserialize({
				srchFromDate: 0,											// 処理日(開始日)
				srchToDate: 0,												// 処理日(終了日)
//				srchPrintTypeID: amcm_type.AMCM_VAL_PRINT_STATE_NOT_PIRNT	// 印刷状態
				srchRprtStateID: amcm_type.AMCM_TYPE_REPORT_STATE			// 帳票印刷状態区分
			});
			clutil.viewReadonly($(".ca_srchFromDate_div"));
			clutil.viewReadonly($(".ca_srchToDate_div"));

			if (clcom.userInfo.user_typeid) {
				// ログイン店舗
				var id = clcom.userInfo.org_id;
				var code = clcom.userInfo.org_code;
				var name = clcom.userInfo.org_name;
//				this.storeAutocomplete.setValue({id: id, code: code, name: name});
//				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS) {
//					// 情シスのみ選択可
//					clutil.inputRemoveReadonly($('#ca_srchStoreID'));
//					clutil.inputRemoveReadonly($('#ca_btn_store_select'));
//				} else {
//					this.storeAutocomplete.setValue({id: id, code: code, name: name});
//					clutil.inputReadonly($('#ca_srchStoreID'));
//					clutil.inputReadonly($('#ca_btn_store_select'));
//				}
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					this.storeAutocomplete.setValue({id: id, code: code, name: name});
					clutil.inputReadonly($('#ca_srchStoreID'));
					clutil.inputReadonly($('#ca_btn_store_select'));
				} else {
					clutil.inputRemoveReadonly($('#ca_srchStoreID'));
					clutil.inputRemoveReadonly($('#ca_btn_store_select'));
				}
			}

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.AMPAV0010Selector.render();
			return this;
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
		 * 初期フォーカス
		 */
		setFocus: function(){
//			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS && clcom.userInfo.unit_id == 4) {
//				clutil.setFocus($('#ca_srchStoreID'));
//			} else {
////				clutil.setFocus($('#ca_srchPrintTypeID'));
//				clutil.setFocus($('#ca_srchRprtStateID'));
//			}
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				clutil.setFocus($('#ca_srchRprtStateID'));
			} else {
				clutil.setFocus($('#ca_srchStoreID'));
			}
		},

		buildReq: function(rtyp){
			var f_error = false;
			// validation
			if (!this.validator.valid()) {
				f_error = true;
			}
			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_srchFromDate',
				edval : 'ca_srchToDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				f_error = true;
			}
			// 出力済は処理日のどちらか必須
			var srchRprtStateID = Number($('#ca_srchRprtStateID').val());
			if (srchRprtStateID == amcm_type.AMCM_VAL_REPORT_STATE_OUTPUT) {
				var fromDate = $("#ca_srchFromDate").val();
				var toDate = $("#ca_srchToDate").val();
				if (fromDate == '' && toDate == '') {
					this.validator.setErrorMsg($("#ca_srchFromDate"), clutil.fmtargs(clmsg.EGM0031));
					this.validator.setErrorMsg($("#ca_srchToDate"), clutil.fmtargs(clmsg.EGM0031));
					clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
					f_error = true;
				}
			}
			if (f_error) {
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
				AMIGV0030GetReq: srchDto
			};

			return reqDto;
		},

		/**
		 * 店舗オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: $("#ca_srchStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){
			var options = {
				editList : null,
				isSubDialog : null,
//				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id : 3,
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE, am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
			};
			this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * 印刷状態変更処理
		 */
		_onSrchPrintTypeChange: function(e) {
			var status = Number($(e.target).val());

			switch (status) {
			case amcm_type.AMCM_VAL_PRINT_STATE_NOT_PIRNT:
				clutil.viewReadonly($(".ca_srchFromDate_div"));
				clutil.viewReadonly($(".ca_srchToDate_div"));
				$("#ca_srchFromDate").datepicker("setIymd");
				$("#ca_srchToDate").datepicker("setIymd");
				break;

			case amcm_type.AMCM_VAL_PRINT_STATE_PRINTED:
			case amcm_type.AMCM_VAL_PRINT_STATE_RE_PRINT:
				clutil.viewRemoveReadonly($(".ca_srchFromDate_div"));
				clutil.viewRemoveReadonly($(".ca_srchToDate_div"));
//				$("#ca_srchFromDate").datepicker("setIymd", clcom.getOpeDate());
//				$("#ca_srchToDate").datepicker("setIymd", clcom.getOpeDate());
				break;

			default:
				break;
			}
		},

		/**
		 * 帳票出力状態変更時処理
		 */
		_onSrchRprtStateChange: function(e) {
			var status = Number($(e.target).val());

			switch (status) {
			case amcm_type.AMCM_VAL_REPORT_STATE_NOTYET:	// 未出力
				clutil.viewReadonly($(".ca_srchFromDate_div"));
				clutil.viewReadonly($(".ca_srchToDate_div"));
				$("#ca_srchFromDate").datepicker("setIymd");
				$("#ca_srchToDate").datepicker("setIymd");
				break;

			case amcm_type.AMCM_VAL_REPORT_STATE_OUTPUT:	// 出力済
				clutil.viewRemoveReadonly($(".ca_srchFromDate_div"));
				clutil.viewRemoveReadonly($(".ca_srchToDate_div"));
				break;

			default:
				break;
			}
		},

		/**
		 * 表示ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:	// PDF 出力
				console.log('PDF 出力');
				this.doDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		doDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMIGV0030', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		}

	});

	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new AMIGV0030View().initUIElement().render();
		mainView.setFocus();
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
