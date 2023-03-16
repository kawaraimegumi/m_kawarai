$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var AMBRV0060View = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		validator : null,

		// Events
		events : {
			'change #ca_srchUnitID'			:	'_onSrchUnitChanged',	// 事業ユニットが変更された
			"click #ca_btn_store_select"	:	"_onStoreSelClick",		// 店舗選択
		},

		initialize: function() {
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '逆ロス追求リスト出力',
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

			var initStore = {
				id: clcom.userInfo.org_id,
				code: clcom.userInfo.org_code,
				name: clcom.userInfo.org_name
			};
			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 検索日
				datepicker: {
					el: "#ca_srchDate",
					initValue: clutil.addDate(clcom.getOpeDate(), -1)
				},
//				// 事業ユニット
//				clbusunitselector: {
//					el: "#ca_srchUnitID",
//					initValue: (clcom.userInfo && clcom.userInfo.unit_id) ? clcom.userInfo.unit_id : 0
//				},
				// 店舗
				clorgcode: {
					el: '#ca_srchStoreID',
					initValue: (clcom.userInfo && clcom.userInfo.org_id && (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN)) ? initStore : null
				},
//				// 店舗参照ボタン
//				AMPAV0010: {
//					button: this.$('#ca_btn_store_select'),
//					view: this.AMPAV0010Selector,
//					showOptions: function(){
//						return {
//							org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
//							               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
//							               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
//						};
//					}
//				},
				// 品種オートコンプリート
				clvarietycode: {
					el: '#ca_srchStdItgrpID',
					rmDepends: ['unit_id'],
					addDepends: ['org_id']
				}
			}, {
				dataSource: {
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});

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
					console.log(data[0]);
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
//					_this.storeAutocomplete.setValue({id: id, code: code, name: name});
					_this.fieldRelation.set("clorgcode", {id: id, code: code, name: name});
					_this.fieldRelation.reset();
				} else {
//					var store = _this.storeAutocomplete.getValue();
//					if (store.id == 0) {
//						_this.AMPAV0010Selector.clear();
//					}
					var chk = _this.fieldRelation.get("clorgcode");
					if (chk == null || chk.id == 0)  {
						_this.AMPAV0010Selector.clear();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
			this.AMPAV0010Selector.clear = function() {
				if (typeof mainView != "undefined") {
//					_this.storeAutocomplete.resetValue();
					_this.fieldRelation.set("clorgcode", null);
					_this.fieldRelation.reset();
				}
			};

//			var unit = (clcom.userInfo.unit_id < clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')) ? 0 : clcom.userInfo.unit_id;
//			/// 品種オートコンプリート
//			clutil.clvarietycode(this.$('#ca_srchStdItgrpID'), {
//				getParentId: function() {
//					// 事業ユニットを取得
////					var id = unit;
////
////					if (id != null) {
////						id = parseInt(id);
////					} else {
////						id = "-1";	// 検索にミスるように
////					}
//					return unit;
//				},
//			});

			// 店舗オートコンプリート
//			this.storeAutocomplete = this.getOrg(clcom.userInfo.unit_id);
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				// 店舗ユーザー
//				this.storeAutocomplete.setValue({
//					id: clcom.userInfo.org_id,
//					code: clcom.userInfo.org_code,
//					name: clcom.userInfo.org_name
//				});
				clutil.inputReadonly($("#ca_srchStoreID"));
				clutil.inputReadonly($("#ca_btn_store_select"));
//			} else {
//				clutil.inputReadonly($("#ca_srchStdItgrpID"));
			}
//			this.listenTo(this.storeAutocomplete, "change", this._onStoreChange);

//			this.itgrpAutocomplete = this.getItgrp(clcom.userInfo.unit_id);

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
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
//			console.log($(e.target).val());
			if(this.deserializing){
				// データセット中
				return;
			}
			if (clcom.userInfo && clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE && clcom.userInfo.org_id){
				return;
			}
			var unitID = Number($("#ca_srchUnitID").val());
			this.getOrg(unitID);
			this.storeAutocomplete.setValue();
			this.$("#ca_srchStoreID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_store_select").attr("disabled", (unitID == 0));
			this.AMPAV0010Selector.clear();
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){
			var unitID = clcom.userInfo.unit_id;
			console.log(unitID);
			var options = {
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						org_id : (unitID == Number(clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')) ||
								unitID == Number(clutil.getclsysparam('PAR_AMMS_UNITID_ORI')))
								? unitID
								: 0,
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
			};
			this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * 店舗オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: $("#ca_srchStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: (unitID < clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')) ? 0 : unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});
		},

		/**
		 * 店舗オートコンプ変更
		 */
		_onStoreChange: function (attrs, view, options) {
			console.log(attrs);
			this.getItgrp((attrs) ? attrs.unit_id : 0);
			this.itgrpAutocomplete.setValue();
			this.$("#ca_srchStdItgrpID").attr("readonly", (!attrs));
		},

		/**
		 * 品種オートコンプ入れ替え
		 */
		getItgrp: function(unitID){
			return clutil.clvarietycode({
				el: $("#ca_srchStdItgrpID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					unit_id: unitID,
				}
			});
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			// validation
			if (!this.validator.valid()) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return false;
			}

//			// 品種コード・オートコンプリート設定チェック
//			if(!this.$('#ca_srchStdItgrpID').autocomplete('isValidClAutocompleteSelect')){
//				// エラーメッセージを通知。
//				var arg = {
//					_eb_: '品種コードの選択が正しくありません。選択肢の中から指定してください。',
//					srchStdItgrpID: '選択肢の中から指定してください。'
//				};
//				this.validator.setErrorInfo(arg, {prefix: 'ca_'});
//				return false;
//			}

			return true;
		},

		/**
		 * 初期フォーカス
		 */
		setFocus: function(){
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				clutil.setFocus($('#ca_srchStdItgrpID'));
			} else {
				clutil.setFocus($('#ca_srchStoreID'));
			}
		},

		buildReq: function(rtyp){
//			// validation
//			if (!this.validator.valid()) {
//				return null;
//			}
//
//			// 品種コード・オートコンプリート設定チェック
//			if(!this.$('#ca_srchStdItgrpID').autocomplete('isValidClAutocompleteSelect')){
//				// エラーメッセージを通知。
//				var arg = {
//					_eb_: '品種コードの選択が正しくありません。選択肢の中から指定してください。',
//					srchItgrpID: '選択肢の中から指定してください。'
//				};
//				this.validator.setErrorInfo(arg, {prefix: 'ca_'});
//				return null;
//			}

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
				AMBRV0060GetReq: srchDto
			};

			return reqDto;
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
			if(!this.isValid()){
				return;
			}
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
//			if(_.isNull(srchReq)){
//				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
//				return;
//			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMBRV0060', srchReq);
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
		mainView = new AMBRV0060View().initUIElement().render();
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
