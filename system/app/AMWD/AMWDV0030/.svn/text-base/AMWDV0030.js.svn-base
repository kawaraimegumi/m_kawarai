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
			"change input[name='ca_srchOutputType']:radio" : "onSelChange"		//一覧種別ラジオボタン変更
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '年令別在庫残一覧',
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

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);
			// 品種オートコンプリート
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
			//カレンダー
			clutil.datepicker(this.$("#ca_srchYMD"));

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
			
			var unit = clcom.getUserData().unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI') 
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				// 初期値を設定
				this.deserialize({
					srchUnitID: unit,							// 事業ユニット
					srchOutputType: 1,							// 出力種別
					srchReportType: 1,							// 月報/週報
					srchSeasonType: 1,							// 合計/シーズン
					srchYMD	: clcom.getOpeDate(),				// 運用日
					srchItgrp: null								// 品種
				});
				//clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}
			else{
				// 初期値を設定
				this.deserialize({
					//srchUnitID: clcom.getUserData().unit_id,	// 事業ユニット
					srchOutputType: 1,							// 出力種別
					srchReportType: 1,							// 月報/週報
					srchSeasonType: 1,							// 合計/シーズン
					srchYMD	: clcom.getOpeDate(),				// 運用日
					srchItgrp: null								// 品種
				});
			}
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
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			var flag = true;
			//var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			//var day = srchDto.srchYMD;

			// 未入力エラー確認
			if(!this.validator.valid()){
				flag = false;
			}

//			if(day > clcom.getOpeDate()){
//				this.validator.setErrorMsg($("#ca_srchYMD"), clmsg.EGM0035);
//				flag = false;
//			}

			return flag;
		},

		/**
		 *	リクエスト内容作成
		 */
		buildReq: function(rtyp){
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