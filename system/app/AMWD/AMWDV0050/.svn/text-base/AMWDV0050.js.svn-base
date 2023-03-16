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
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '年令別在庫残一覧',
				subtitle: '出力(経理用)',
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
			clutil.datepicker(this.$("#ca_srchYMD"));
			$("#ca_srchYMD").datepicker('setIymd', clcom.getOpeDate());

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);
			$('#ca_srchUnitID').selectpicker('val', clcom.getUserData().unit_id);
			/// 品種オートコンプリート
			clutil.clvarietycode(this.$('#ca_srchItgrp'), {
				getParentId: function() {
					//事業ユニットを取得
					var id = $("#ca_srchUnitID").val();

					if (id != null) {
						id = parseInt(id);
					} else {
						id = -1;	// 検索にミスるように
					}
					return id;
				},
			});

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
			this.fieldRelation.done(function() {
			});
			
			if(clcom.getUserData().unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI') 
					|| clcom.getUserData().unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				this.setUnit({
					srchUnitID: clcom.getUserData().unit_id	// 事業ユニット
				});
				//clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}

			return this;
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
		 * 初期フォーカス
		 */
		setFocus:function(){
			var unit = clcom.getUserData().unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				clutil.setFocus($('#ca_srchYMD'));
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
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			var day = srchDto.srchYMD;

			// 日付エラー確認
			if(!this.validator.valid()){
				retStat = false;
			}
			if(day > clcom.getOpeDate()){
				this.validator.setErrorMsg($("#ca_srchYMD"), clmsg.EGM0035);
				retStat = false;
			}
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

		buildReq: function(rtyp){
			// validation
			if (!this.validator.valid()) {
				return null;
			}

			//リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMWDV0050GetReq: srchDto
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
			var defer = clutil.postDLJSON('AMWDV0050', srchReq);
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