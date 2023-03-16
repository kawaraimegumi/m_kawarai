/**
 * 売上速報
 */

useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			"change input[name='outType']:radio"	: "_onTermChange"	// 対象期間ラジオボタン変更
		},

		/**
		 * initialize関数
		 */
		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '売上速報出力',
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

			// 対象日の初期値に運用日の前日をセットする
			this.srchDatePicker = clutil.datepicker(this.$('#ca_date'));
			this.srchDatePicker.datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), -1));

			// 対象週取得
			this.yearweekCode = clutil.clyearweekcode({
				el: '#ca_week',
				initValue: MainView.yyyywwData
			});

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {

			this.mdBaseView.render();

			// 初期フォーカスをセット
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.setFocus($('#ca_date'));
				var top_unit = clcom.userInfo.permit_top_org_id;
				if(top_unit >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.setFocus($('#ca_date'));
				}
				else{
					clutil.setFocus($('#ca_srchUnitID'));
				}
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}

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
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:	// PDF 出力
				console.log('PDF 出力');
				this.doPDFDownload(rtyp);
				break;
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
			if(!this.validator.valid()) {
				flag = false;
			}

			// 入力された対象期間を取得
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));

			if(srchDto.outType === '1' || srchDto.outType === '2'){

				// 日報または品種別日報が選択された場合

				// 入力された対象日が運用日より未来の場合はエラー
				if(srchDto.date > clcom.getOpeDate()){

					var msg = clutil.getclmsg('EAS0002');
					this.validator.setErrorMsg($("#ca_date"), msg);
					clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

					flag = false;
				}
			} else {

				// 週報が選択された場合

				if(MainView.opeyyyyww.id < srchDto.week){
					// 入力された対象期間が運用日より未来の場合はエラー
					var msg = clutil.getclmsg('EAS0003');
					this.validator.setErrorMsg($("#ca_week"), msg);
					clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

					flag = false;
				}
			}
			return flag;
		},

		/**
		 * 検索リクエストを作成する
		 */
		buildReq: function(rtyp){

			//リクエストの内容をセットする
			var tmpDto = clutil.view2data(this.$("#ca_searchArea"));

			var srchDto = {};

			srchDto.srchUnitID = tmpDto.srchUnitID;
			srchDto.outType = tmpDto.outType;

			if(tmpDto.outType === '1' || tmpDto.outType === '2') {
				// 日報／品種別日報出力の場合
				srchDto.srchDate = tmpDto.date;

			} else {
				// 週報出力の場合
				srchDto.srchDate = tmpDto.week;
			}

			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMASV0010GetReq: srchDto
			};

			return reqDto;
		},

		/**
		 * PDFダウンロード
		 */
		doPDFDownload: function(rtyp){

			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMASV0010', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
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
			var defer = clutil.postDLJSON('AMASV0010', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 対象期間ラジオボタン変更
		 */
		_onTermChange: function(){

			var radio = $("input:radio[name=outType]:checked");
			var val = radio.val();
			console.log(val);

			if (val == '1') {

				// 日報をチェック

				$("#p_date").removeClass('dispn');
				$("#ca_date").addClass('cl_valid');

				$("#p_week").addClass('dispn');
				$("#ca_week").removeClass('cl_valid');

				// 日報ラジオボタンがチェックされた場合、帳票出力ボタンを操作可能にする
				//this.$('#cl_pdf').prop('disabled', false);

			} else if (val == '2') {

				// 品種別日報をチェック

				$("#p_date").removeClass('dispn');
				$("#ca_date").addClass('cl_valid');

				$("#p_week").addClass('dispn');
				$("#ca_week").removeClass('cl_valid');

				// 品種別日報ラジオボタンがチェックされた場合、帳票出力ボタンを操作不可にする
				//this.$('#cl_pdf').prop('disabled', true);

			} else {

				// 週報をチェック

				$("#p_date").addClass('dispn');
				$("#ca_date").removeClass('cl_valid');

				$("#p_week").removeClass('dispn');
				$("#ca_week").addClass('cl_valid');

				// 週報ラジオボタンがチェックされた場合、帳票出力ボタンを操作可能にする
				//this.$('#cl_pdf').prop('disabled', false);

			}
		}

	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null)

		.then(function(){
			return clutil.ymd2week(clcom.getOpeDate(),-1).done(function(data){
				// MainViewに運用日の前週の週番号を設定する
				MainView.yyyywwData = data;
			});
		})
		.then(function(){
			return clutil.ymd2week(clcom.getOpeDate(),0).done(function(data){
				// MainViewに運用日週年の週番号を設定する
				MainView.opeyyyyww = data;
			});
		})
		.done(function(data){

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
