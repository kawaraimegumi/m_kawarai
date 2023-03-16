/**
 * 店舗別積送品金額一覧出力
 */

useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var yearRange = {
		stYear: NaN,
		edYear: NaN,

		isValid: function(){

			if(_.isNaN(this.stYear) || !(this.stYear >= 2000 && this.stYear <= 2030)){
				return false;
			}
			if(_.isNaN(this.edYear) || !(this.edYear >= 2000 && this.edYear <= 2030)){
				return false;
			}
			if(this.stYear > this.edYear){
				return false;
			}
			return true;
		}
	};

	var getSysparam = function(paramName, defaultVal){
		var val = clcom.getSysparam(paramName);
		return (defaultVal === undefined) ? val : parseInt(_.isEmpty(val) ? defaultVal : val);
	};

	//////////////////////////////////////////////
	/**
	 * View
	 */
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
		},

		/**
		 * initialize関数
		 */
		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '店舗別積送品金額一覧出力',
				btn_submit: false
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'));
			//var unitID = clcom.getSysparam(amcm_sysparams.PAR_AMMS_UNITID_AOKI);
			//this.deserialize({
			//	srchUnitID: unitID
			//});

			// 現在年月日を取得
			//var opeDate = String(clcom.getOpeDate());
			// 現在年月を取得
			//var opeYearMonth = opeDate.substr(0,6);
			//var initYearMonth = Number(opeYearMonth);

			var startYearMonth = String(yearRange.stYear) + '01';
			var endYearMonth = String(clcom.getOpeDate()).substring(0, 6);

			// 対象期間取得
			var yearmonthcode = clutil.clyearmonthcode({
				  el: '#ca_srchMonth',
				  startYearMonth: Number(startYearMonth),
				  endYearMonth: Number(endYearMonth)
				  //initValue: initYearMonth
			});

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

			// 初期フォーカスをセット
			clutil.setFocus(this.$("#ca_srchUnitID"));

			return this;
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
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){

			var flag = true;

			// 未入力エラー確認
			if(!this.validator.valid()){
				flag = false;
			}

			return flag;
		},

		/**
		 * 検索リクエストを作成する
		 */
		buildReq: function(rtyp){

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
				AMSTV0030GetReq: srchDto
			};

			return reqDto;
		},

		/**
		 * CSVダウンロード
		 */
		doCSVDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMSTV0030', srchReq);
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

		var curYear = Math.floor(clcom.getOpeDate() / 10000);
		yearRange.stYear = curYear - getSysparam(amcm_sysparams.PAR_AMCM_YEAR_FROM, 5);
		yearRange.edYear = curYear + getSysparam(amcm_sysparams.PAR_AMCM_YEAR_TO, 5);

		if(!yearRange.isValid()){
			clutil.View.doAbort({
				messages: [
					//'初期データ取得に失敗しました。'
					clutil.getclmsg('期間に誤りがあります。')
				],
				rspHead: data.rspHead
			});
			return;
		}

		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();


	}).fail(function(data){
		console.error('iniJSON failed.');
		console.log(arguments);

		// clcom のネタ取得に失敗。
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});


});