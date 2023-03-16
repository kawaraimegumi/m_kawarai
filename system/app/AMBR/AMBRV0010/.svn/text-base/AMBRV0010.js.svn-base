// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function() {

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var AMBRV0010View = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		validator : null,

		// Events
		events : {
			"change input[name='ca_srchTermSw']:radio"	: "_onTermChange",		// 対象期間ラジオボタン変更
			'change #ca_srchUnitID'						:	'_onSrchUnitChanged',		// 事業ユニットが変更された
			"click #ca_btn_org_select"				: "_onOrgSelClick",	// 店舗選択
		},

		initialize: function() {
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '担当者別販売力レベルアップシート出力',
				btn_submit: false,
				btn_csv: true
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

			var opedate = clcom.getOpeDate();
			var month = Math.floor((opedate/100)%100);
			var year = Math.floor(opedate / 10000);
			var base_yyyymm = clcom.getSysparam(amcm_sysparams.PAR_AMBR_LEVELUPSHEET_ST_YYYYMM);
			if (base_yyyymm == null) {
				base_yyyymm = 201501;
			}
			var base_yyyy = Math.floor(Number(base_yyyymm) / 100);

			// datepicker
			var min_date = Number(base_yyyymm + "01");
			clutil.datepicker(this.$("#ymd"), {min_date: min_date});
			// 年月オートコンプリート
			var yyyymm = Math.floor(clcom.getOpeDate() / 100);
			var future = yyyymm - 1;

			if(yyyymm % 100 < 2){
				// 運用日が1月なら、去年の12月とする
				var yyyy = Math.floor(yyyymm / 100);
				yyyy = yyyy - 1;
				future = yyyy * 100 + 12;
			}
			clutil.clmonthselector(this.$('#month'), 1, null, null, base_yyyymm, future, 1, null, 'd');
			//clutil.clyearmonthcode({el:this.$("#month")}).setValue(clutil.monthFormat(clcom.getOpeDate(), "yyyymm"));

			// 半期selector
			var h_first_mmdd = clcom.getSysparam(amcm_sysparams.PAR_AMCM_HALF_PERIOD_FIRST_ST_MMDD);
			if (h_first_mmdd == null) {
				h_first_mmdd = 401;
			} else {
				h_first_mmdd = Number(h_first_mmdd);
			}
			var h_first_mm = Math.floor(h_first_mmdd / 100);
			var h_second_mmdd = clcom.getSysparam(amcm_sysparams.PAR_AMCM_HALF_PERIOD_SECOND_ST_MMDD);
			if (h_second_mmdd == null) {
				h_second_mmdd = 1001;
			} else {
				h_second_mmdd = Number(h_second_mmdd);
			}
			var h_second_mm = Math.floor(h_second_mmdd / 100);

			var base_mm = base_yyyymm % 100;
			var past_h, future_h, past_y, future_y;
			past_y = year - base_yyyy;
			if (h_first_mm <= base_mm && base_mm < h_second_mm) {
				// base_yyの上期から
				past_h = base_yyyy * 100 + 1;
			} else {
				past_h = base_yyyy * 100 + 2;
			}
			if (month <= 4) {
				future_h = (year-1) * 100 + 2;
			} else if (month > 4 &&  month <= 10) {
				future_h = year * 100 + 1;
			} else {
				future_h = year * 100 + 2;
			}
			clutil.clhalfselector3(this.$('#half'), 1, past_h, future_h);
//			if (month == 4 || month == 10) {
//				past_h = 11;
//				future_h = -1;
//			} else {
//				past_h = 10;
//				future_h = 0;
//			}
//			clutil.clhalfselector2(this.$('#half'), 1, past_h, future_h);

			past_y = year - base_yyyy;
			// 年selector
			if (month <= 4) {
				//past_y = 6;
				future_y = -1;
			} else {
				//past_y = 5;
				future_y = 0;
			}
			clutil.clyearselector(this.$("#year"), 1, past_y, future_y);

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);

			// 組織部品
			this.AMPAV0020Selector = new AMPAV0020SelectorView({
				el: $("#ca_AMPAV0020_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});
			// 選択サブ画面復帰処理
			this.AMPAV0020Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
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
			// 組織コンプリート
			var p_org_id;
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS) {
				p_org_id = 0;
			} else {
				p_org_id = clcom.userInfo.unit_id;
			}
			this.orgAutocomplete = this.getOrg(p_org_id);

			// 担当者selector
			clutil.clstaffcode2($("#ca_srchStaffID"));

			var option = {};

			// 初期値
			this.$("#ymd").datepicker("setIymd", clutil.addDate(clcom.getOpeDate(), -1));
			if (clcom.userInfo && clcom.userInfo.unit_id) {
				this.$("#ca_srchUnitID").selectpicker('val', clcom.userInfo.unit_id);
				clutil.initUIelement(this.$el);
				option.unit_id = clcom.userInfo.unit_id;
			}
			if (clcom.userInfo) {
				// 組織表示
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
					$("#cl_csv").hide();

					$("#div_outputLevel").hide();
				} else if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF) {
					var unit_id = clcom.userInfo.unit_id;
					// MD-4319 社員ユーザの場合は参照可能組織の値を見て制御を変更する
					if (clcom.userInfo.dataperm_typeid != amcm_type.AMCM_VAL_DATAPERM_FULL) {
						if (unit_id == Number(clcom.getSysparam('PAR_AMMS_UNITID_AOKI')) ||
								unit_id == Number(clcom.getSysparam('PAR_AMMS_UNITID_ORI'))) {
							clutil.viewReadonly($('#ca_srchUnitID_div'));
						} else {
							this._onSrchUnitChanged();
						}
					}
				} else {
					this._onSrchUnitChanged(option);
				}
			}

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.AMPAV0020Selector.render();
			clutil.setFocus(this.$("input[type='radio']:first"));

			return this;
		},

		/**
		 * 対象期間ラジオボタン変更
		 */
		_onTermChange: function(){
			var radio = $("input:radio[name=ca_srchTermSw]:checked");
			var val = radio.val();
			console.log(val);
//			this.validator.clear();

			if (val == '1') {
				$("#p_ymd").removeClass('dispn');
				$("#p_month").addClass('dispn');
				$("#p_half").addClass('dispn');
				$("#p_year").addClass('dispn');

				$("#ymd").addClass('cl_required');
				$("#month").removeClass('cl_required');
				$("#half").removeClass('cl_required');
				$("#year").removeClass('cl_required');
			} else if (val == '2') {
				$("#p_ymd").addClass('dispn');
				$("#p_month").removeClass('dispn');
				$("#p_half").addClass('dispn');
				$("#p_year").addClass('dispn');

				$("#ymd").removeClass('cl_required');
				$("#month").addClass('cl_required');
				$("#half").removeClass('cl_required');
				$("#year").removeClass('cl_required');
			} else if (val == "3") {
				$("#p_ymd").addClass('dispn');
				$("#p_month").addClass('dispn');
				$("#p_half").removeClass('dispn');
				$("#p_year").addClass('dispn');

				$("#ymd").removeClass('cl_required');
				$("#month").removeClass('cl_required');
				$("#half").addClass('cl_required');
				$("#year").removeClass('cl_required');
			} else {
				$("#p_ymd").addClass('dispn');
				$("#p_month").addClass('dispn');
				$("#p_half").addClass('dispn');
				$("#p_year").removeClass('dispn');

				$("#ymd").removeClass('cl_required');
				$("#month").removeClass('cl_required');
				$("#half").removeClass('cl_required');
				$("#year").addClass('cl_required');
			}
		},

		/**
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}
			var unitID = Number($('#ca_srchUnitID').val());
			if (unitID == 0) {
				if (e != null && e.unit_id != null) {
					unitID = e.unit_id;
				}
			}
			this.getOrg(unitID);
			this.orgAutocomplete.setValue();
			this.$("#ca_srchOrgID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_org_select").attr("disabled", (unitID == 0));
		},

		/**
		 * 組織オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: $('#ca_srchOrgID'),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				}
			});
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onOrgSelClick: function(e){
			var func_id = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
			var corp_id = Number(clcom.getSysparam(amcm_sysparams.PAR_AMMS_CORPID_AOKI));
			var r_org_id;
			var initData = null;
			if ((clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_KEISEN)
					&& clcom.userInfo.dataperm_typeid != amcm_type.AMCM_VAL_DATAPERM_ZONE
					) {
				r_org_id = corp_id;	// （株）ＡＯＫＩ の組織ID
			} else {
				r_org_id = this.$("#ca_srchUnitID").val() == 0 ? corp_id : Number(this.$("#ca_srchUnitID").val());
			}

			//= this.$("#ca_srchUnitID").val() == 0 ? 3 : Number(this.$("#ca_srchUnitID").val());
			// 3 は　(株)AOKIのorg_id いつでも触れるようにするならパラメータ化が必要
			// ＋組織画面側で選択した事業ユニットの渡しが必要となる。
//			var initData = {};
//			initData.func_id = Number(clutil.getclsysparam("PAR_AMMS_DEFAULT_ORG_FUNCID", 1));
			this.AMPAV0020Selector.show(null, false, func_id, null, initData, r_org_id);
		},

		/**
		 * 数値を2桁文字列に変換
		 * @param obj
		 * @returns obj
		 */
		twodigit : function(obj) {
			if (obj < 10) {
			  obj = '0' + obj;
			}
			return obj;
		},

		/**
		 * 初期フォーカス
		 */
		setFocus: function(){
			clutil.setFocus($("#ymd"));
		},

		isValid: function() {
			var ret = true;
			this.errinfo = false;

			if (!this.validator.valid()) {
				ret = false;
			}
			// 出力階層が選択されていない場合はエラー
			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE
					&& clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN) {
				var outLevel = clutil.view2data(this.$("#div_outputLevel"));
				if (outLevel.fOutStaff == 0
						&& outLevel.fOutStore == 0
						&& outLevel.fOutArea == 0
						&& outLevel.fOutZone == 0) {
					clutil.mediator.trigger('onTicker', "出力階層を選択してください。");
					this.errinfo = true;
					ret = false;
				}
			}
			return ret;
		},

		buildReq: function(rtyp){
			this.validator.clear();
			var radio = $("input:radio[name=ca_srchTermSw]:checked");
			var val = radio.val();
			if (val == '1') {
				$("#month").val("");
				$("#half").selectpicker("refresh");
			} else if (val == '2') {
				$("#ymd").datepicker("setIymd");
				$("#half").selectpicker("refresh");
			} else if (val == "3") {
				$("#ymd").datepicker("setIymd");
				$("#month").val("");
			} else {
				$("#ymd").datepicker("setIymd");
				$("#half").val("");
			}
			// validation
			if (!this.isValid()) {
				return null;
			}

			// リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			if (srchDto.srchTermSw == 1) {
				srchDto.srchYmd = srchDto.ymd;
			} else if (srchDto.srchTermSw == 2) {
				srchDto.srchYmd = srchDto.month;
			} else if (srchDto.srchTermSw == 3) {
				srchDto.srchYmd = srchDto.half;
			} else {
				srchDto.srchYmd = srchDto.year;
			}
			// 店舗ユーザーの場合は全出力階層をセットする
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				srchDto.fOutStaff = 1;
				srchDto.fOutStore = 1;
				srchDto.fOutArea  = 1;
				srchDto.fOutZone  = 1;
			}
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMBRV0010GetReq: srchDto
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
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:	// PDF 出力
				console.log('PDF 出力');
				this.doPDFDownload(rtyp);
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
				if (this.errinfo != true) {
					this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				}
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMBRV0010', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		doPDFDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				if (this.errinfo != true) {
					this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				}
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMBRV0010', srchReq);
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
		mainView = new AMBRV0010View().initUIElement().render();
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
