//
// AMACV0120 PL売上速報出力
//


//セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();


$(function() {
	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'change #ca_srchUnitID'						: "_onSrchUnitChanged",		// 事業ユニットが変更された
			"change input[name='ca_srchTermSw']:radio"  : "onSelChange",			// 対象期間種別ラジオボタン変更
			"click #ca_orgSel"							: "_onOrgSelClick",			// 組織選択補助画面起動
		},

		orgList: [],

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: 'PL売上速報出力',
//				subtitle: '出力',
				btn_submit: false
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});
			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			//ラジオボタン初期化
			$("input[name='ca_srchTermSw'][value='1']").radio('check');

			//カレンダー
			clutil.datepicker($("#ca_srchFromDate"));
			clutil.datepicker($("#ca_srchToDate"));
			var opeDate = clcom.getOpeDate();
			var lastDate = clutil.addDate(opeDate, -1);	// 初期値は前日
			$("#ca_srchFromDate").datepicker('setIymd', lastDate);
			$("#ca_srchToDate").datepicker('setIymd', lastDate);

			// 週オートコンプリート
			clutil.clyearweekcode({
				el: '#ca_srchFromWeek',
				initValue: MainView.opeyyyyww
			});
			clutil.clyearweekcode({
				el: '#ca_srchToWeek',
				initValue: MainView.opeyyyyww
			});

			// 年月オートコンプリート
			var month = clutil.monthFormat(opeDate, "yyyymm");
			clutil.clyearmonthcode({
				el:this.$("#ca_srchFromMonth")
			}).setValue(month);
			clutil.clyearmonthcode({
				el:this.$("#ca_srchToMonth")
			}).setValue(month);

			// 事業ユニット
			var unit = clcom.userInfo.unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
			}
			else{
				clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}

			//店舗 or 店長ユーザなら組織部品に初期値設定
			var userType = clcom.userInfo.user_typeid;
			if(userType == amcm_type.AMCM_VAL_USER_STORE
					|| userType == amcm_type.AMCM_VAL_USER_STORE_MAN){
				if (clcom.userInfo &&  clcom.userInfo.org_id) {
					clutil.viewReadonly($("#ca_srchUnitIDArea"));
					clutil.viewReadonly($("#ca_srchOrgIDArea"));
				}
			}

			// 組織選択画面
			this.AMPAV0020Selector = new  AMPAV0020SelectorView({
				el				: $("#ca_AMPAV0020_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				//ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 単一選択モード
				//anaProc			: this.anaProc
				isAnalyse_mode 	: false,						// 通常画面モード
			});
			this.AMPAV0020Selector.render();

			//フィールドリレーション
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
			});

			if(unit != null){
				this.setUnit({
					srchUnitID: unit	// 事業ユニット
				});
			}

			this.fieldRelation.done(function() {
			});
			return this;
		},

		/**
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {
				return;
			}
			this.orgList = [];	// クリア
			$("#ca_srchOrgList").val("");
		},


		/**
		 * 検索リクエストパケットの設定値を UI へセットする。
		 */
		setUnit: function(obj){
			this.deserializing = true;
			try{
				var dto = _.extend({}, obj);
				clutil.data2view(this.$("#ca_srchUnitIDArea"), dto);
			}finally{
				this.deserializing = false;
			}
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			return this;
		},

		/**
		 * 出力種別ラジオボタン変更
		 */
		onSelChange: function(){
			var radio = $("input:radio[name=ca_srchTermSw]:checked");
			var selBtn = radio.val();

			var $p_ymd = $("#p_ymd");
			var $p_yw = $("#p_yw");
			var $p_month = $("#p_month");

			if (selBtn == '1') {
				$p_ymd.removeClass('dispn');
				$p_yw.addClass('dispn');
				$p_month.addClass('dispn');
			} else if (selBtn == '2') {
				$p_ymd.addClass('dispn');
				$p_yw.removeClass('dispn');
				$p_month.addClass('dispn');

			} else {
				$p_ymd.addClass('dispn');
				$p_yw.addClass('dispn');
				$p_month.removeClass('dispn');
			}
		},


		/**
		 * 組織参照押下
		 */
		_onOrgSelClick: function(e) {
			var _this = this;

			// 選択された情報を初期値として検索する
			var func_id = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
			var corp_id = Number(clcom.getSysparam(amcm_sysparams.PAR_AMMS_CORPID_AOKI));
			var zone_lvl = Number(clcom.getSysparam(amcm_sysparams.PAR_AMMS_ZONE_LEVELID));
			var area_lvl = Number(clcom.getSysparam(amcm_sysparams.PAR_AMMS_AREA_LEVELID));
			var unit_id = this.$("#ca_srchUnitID").val();
			var r_org_id = unit_id == 0 ? corp_id : Number(this.$("#ca_srchUnitID").val());
			this.AMPAV0020Selector.show(null, false, func_id, null, null, r_org_id);

			// サブ画面復帰後処理
			this.AMPAV0020Selector.okProc = function(data) {
				_this.orgList = data;
				var source = "";
				var tip = "";
				var $orgID = _this.$("#ca_srchOrgList");

				if(data != null && data.length > 0) {
					for (var i = 0; i < data.length; i++) {
						var code = data[i].code;
						var name = data[i].name;
						var str;
						if (data[i].attr == zone_lvl || data[i].attr == area_lvl) {
							str = name;
						} else {
							str = code + ":" + name;
						}
						if (i == 0) {
							source = str;
							tip = str;
						} else {
							source += "," + str;
							if (i < 10) {
								tip += "," + str;
							} else if (i == 10) {
								tip += "...";
							}
						}
					}
					$orgID.val(source);
				}

				_.defer(function(){// setFocusを_.defer()で後回しにする
					$(e.target).focus();
					if (data !== null && data.length != 0) {
						$orgID.attr("data-original-title", tip);
						$orgID.tooltip({html:true});
					}
				});
			};
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			var unit = clcom.getUserData().unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				var top_unit = clcom.userInfo.permit_top_org_id;
				if(top_unit >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.setFocus($('#ca_srchYMD'));
				}
				else{
					clutil.setFocus($('#ca_srchUnitID'));
				}
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
		},

		isValidWeek: function() {
			var retStat = true;
			var radio = $("input:radio[name=ca_srchTermSw]:checked");
			var selBtn = radio.val();
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			var errInfo = {};

			if (selBtn == '2') {
				if (srchDto.srchFromWeek > srchDto.srchToWeek) {
					retStat = false;
					errInfo["ca_srchFromWeek"] = clmsg.cl_fromto_error;
					errInfo["ca_srchToWeek"] = clmsg.cl_fromto_error;
				}
			} else if (selBtn == '3') {
				if (srchDto.srchFromMonth > srchDto.srchToMonth) {
					retStat = false;
					errInfo["ca_srchFromMonth"] = clmsg.cl_fromto_error;
					errInfo["ca_srchToMonth"] = clmsg.cl_fromto_error;
				}
			}
			if (!retStat) {
				this.validator.setErrorInfo(errInfo);
			}
			return retStat;
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			var retStat = true;

			if(!this.validator.valid()){
				retStat = false;
			}

			var chkInfo1 = [{
				stval: "ca_srchFromDate",
				edval: "ca_srchToDate"
			}];
			if (!this.validator.validFromTo(chkInfo1)) {
				retStat = false;
			}
			if (retStat && !this.isValidWeek()) {
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
			}

			if (retStat) {
				// 出力階層が選択されていない場合はエラー
				var outLevel = clutil.view2data(this.$("#div_outputLevel"));
				if (outLevel.srchStoreFlag == 0
						&& outLevel.srchZoneFlag == 0
						&& outLevel.srchDistrictFlag == 0) {
					retStat = false;
					clutil.mediator.trigger('onTicker', "出力階層を選択してください。");
				}
			}

			return retStat;
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// エラーチェック
			if(this.isValid() == false){
				return;
			}
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

		/**
		 * リクエスト作成
		 */
		buildReq: function(rtyp){
			// validation
			if (!this.validator.valid()) {
				return null;
			}

			//リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));

			// 期間取得
			var radio = $("input:radio[name=ca_srchTermSw]:checked");
			var selBtn = radio.val();
			if (selBtn == '1') {
				// 年月日
				srchDto.srchFromYmd = srchDto.srchFromDate;
				srchDto.srchToYmd = srchDto.srchToDate;
			} else if (selBtn == '2') {
				// 年週
				srchDto.srchFromYmd = srchDto.srchFromWeek;
				srchDto.srchToYmd = srchDto.srchToWeek;
			} else {
				// 年月
				srchDto.srchFromYmd = srchDto.srchFromMonth;
				srchDto.srchToYmd = srchDto.srchToMonth;
			}

			// 対象組織
			srchDto.srchOrgList = [];
			for (var i = 0; i < this.orgList.length; i++) {
				var org = {orgID: this.orgList[i].val};
				srchDto.srchOrgList.push(org);
			}

			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMACV0120GetReq: srchDto
			};
			return reqDto;
		},

		doCSVDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMACV0120', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		}
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).then(function(){
		return clutil.ymd2week(clcom.getOpeDate(),0).done(function(data){
			// MainViewに運用日週年の週番号を設定する
			MainView.opeyyyyww = data;
		});
	}).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();
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