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
			'change #ca_srchUnitID'							:	'_onSrchUnitChanged',		// 事業ユニットが変更された
			"change input[name='ca_srchOutputType']:radio"  : "onSelChange",				//一覧種別ラジオボタン変更
			"click #ca_orgSel"	: "_onOrgSelClick"											// 組織選択補助画面起動
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '組織別年令別在庫残一覧',
				subtitle: '出力',
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
			$("input[name='ca_srchOutputType'][value='1']").radio('check');
			$("input[name='ca_srchReportType'][value='1']").radio('check');
			//カレンダー
			clutil.datepicker($("#ca_srchYMD"));
			$("#ca_srchYMD").datepicker('setIymd', clcom.getOpeDate());
			
			
			var unit = clcom.userInfo.unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				//組織オートコンプ
				this.orgAutocomplete = this.getOrg(clcom.userInfo.unit_id);
			}
			else{
				unit = null;
				//組織オートコンプ
				this.orgAutocomplete = this.getOrg(unit);
				
				clutil.viewReadonly($("#ca_srchUnitIDArea"));
				clutil.viewReadonly($("#ca_srchOrgIDArea"));
			}
			
			//店舗 or 店長ユーザなら組織部品に初期値設定
			var userType = clcom.userInfo.user_typeid;
			if(userType == amcm_type.AMCM_VAL_USER_STORE
					|| userType == amcm_type.AMCM_VAL_USER_STORE_MAN){
				if (clcom.userInfo &&  clcom.userInfo.org_id) {
					this.orgAutocomplete.setValue({
						id: clcom.userInfo.org_id,
						code: clcom.userInfo.org_code,
						name: clcom.userInfo.org_name
					});
					clutil.viewReadonly($("#ca_srchUnitIDArea"));
					clutil.viewReadonly($("#ca_srchOrgIDArea"));
				}
			}
			
			// 組織選択画面
			this.AMPAV0020Selector = new  AMPAV0020SelectorView({
				el				: $("#ca_AMPAV0020_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				//ymd				: null,			// 検索日
				select_mode		: clutil.cl_single_select,	// 単一選択モード
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
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrp",
				},
			});
			
			if(unit != null){
				this.setUnit({
					srchUnitID: unit	// 事業ユニット
				});
				//clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}
			
			this.fieldRelation.done(function() {
			});
			return this;
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
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'))
				}
			});
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
			var unitID = Number($(e.target).val());
			this.getOrg(unitID);
			this.orgAutocomplete.setValue();
			this.$("#ca_srchOrgID").attr("readonly", (unitID == 0));
			this.$("#ca_orgSel").attr("disabled", (unitID == 0));
			//this._onSrchItgrpChanged();
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
			var radio = $("input:radio[name=ca_srchOutputType]:checked");
			var selBtn = radio.val();

			if(selBtn == '1' || selBtn == '2'){
				$("#ca_age").addClass('dispn');
				$("#ca_season").removeClass('dispn');
			}
			else{
				$("#ca_age").removeClass('dispn');
				$("#ca_season").addClass('dispn');
			}
		},


		/**
		 * 組織参照押下
		 */
		_onOrgSelClick: function(e) {
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
				
				_.defer(function(){// setFocusを_.defer()で後回しにする
					$(e.target).focus();
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




		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			var retStat = true;
			//var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			//var day = srchDto.srchYMD;

			if(!this.validator.valid()){
				retStat = false;
			}
//			if(day > clcom.getOpeDate()){
//				this.validator.setErrorMsg($("#ca_srchYMD"), clmsg.EGM0035);
//				retStat = false;
//			}
			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
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
		 * 年令リスト作成
		 */
		makeAgeList: function(srchDto){
			var list = [];

			if(srchDto.srchAge5 == 1){
				list.push(5);
			}
			if(srchDto.srchAge4 == 1){
				list.push(4);
			}
			if(srchDto.srchAge3 == 1){
				list.push(3);
			}
			if(srchDto.srchAge2 == 1){
				list.push(2);
			}
			if(srchDto.srchAge1 == 1){
				list.push(1);
			}

			return list;
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

			//年令リスト設定
			var srchAge = this.makeAgeList(srchDto);
			srchDto.srchAge = srchAge;

			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMWDV0030GetReq: srchDto
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
			var defer = clutil.postDLJSON('AMWDV0030', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		}
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
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