/**
 * 品種別売上・経準・在庫成績表出力
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
		"change input[name='outType']:radio"	: "_onTermChange"		// 対象期間ラジオボタン変更
		},

		/**
		 * initialize関数
		 */
		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '品種別売上・経準・在庫成績表出力',
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
			AMASVUtil.clbusunitselector(this.$('#ca_srchUnitID'));
//			clutil.clbusunitselector({
//				emptyLabel: "AOKI+ORIHICA",
//				el: this.$('#ca_srchUnitID')
//			});

			// 対象週取得
			this.yearweekCode = clutil.clyearweekcode({
				el: '#ca_week',
				initValue: MainView.yyyywwData
			});

			// 半期selector
			clutil.clhalfselector(this.$('#ca_half'), 1, 5, 0);

			// 年selector
			clutil.clyearselector(this.$('#ca_year'), 1, 5, 0, "年度");

			// 店舗
			clutil.cltypeselector({
				$select: this.$("#ca_storeType"),
				//kind: amcm_type.AMCM_TYPE_STORE_YEARTYPE,
				kind: 0,
				unselectedflag: 1,
				emptyLabel: '全店'
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
				clutil.setFocus($('#ca_week'));
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

			// 現在日付を取得
			var opeDate = clcom.getOpeDate();
			var opeDateObj = clutil.ymd2date(opeDate);

			// 現在年を取得
			var opeYear = opeDateObj.getFullYear();

			// 現在月を取得
			var opeMonth = opeDateObj.getMonth() + 1;

			// 入力された対象期間を取得
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));

			if(srchDto.outType === '1'){

				// 週報が選択された場合
				if(MainView.opeyyyyww.id < srchDto.week){
					// 入力された対象期間が運用日より未来の場合はエラー
					var msg = clutil.getclmsg('EAS0003');
					this.validator.setErrorMsg($("#ca_week"), msg);
					clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

					flag = false;
				}

			} else if(srchDto.outType === '2'){
				// 半期報が選択された場合

				if(srchDto.half && srchDto.half !== "0") {

					// 選択された年を取得
					var inputYear = String(srchDto.half).substr(0,4);
					// 選択された上期/下期を取得
					var inputTerm = String(srchDto.half).substr(4,2);

					// 現在月を取得
					//var opeMonth = opeDateObj.getMonth() + 1;

					if(Number(opeYear) < Number(inputYear)) {

						flag = false;

						// XXX: 2014/7/22 情シス指摘事項---修正
					} else if(Number(opeYear) === Number(inputYear)) {
						// XXX: 修正ここまで

						if(Number(opeMonth) >= 1 && Number(opeMonth) < 4) {
							// 運用日が1月～3月の場合
							if(Number(inputTerm) > 2) {

								flag = false;
							}
						} else if(Number(opeMonth) >= 4 && Number(opeMonth) < 10) {
							// 運用日が4月～9月の場合
							if(Number(inputTerm) > 1) {

								flag = false;
							}
						} else if(Number(opeMonth) >= 10 && Number(opeMonth) <= 12) {
							// 運用日が10月～12月の場合
							if(Number(inputTerm) > 2) {

								flag = false;
							}
						}
					}

					if(flag === false){

						// 入力された対象期間が運用日より未来の場合はエラー
						var msg = clutil.getclmsg('EAS0004');
						this.validator.setErrorMsg($("#ca_half"), msg);
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

					}
				}

			} else {
				// 年報が選択された場合

				if(srchDto.year && srchDto.year !== "0") {

					// 選択された対象年
					var inputYear = String(srchDto.year);

					// 現在月が１～３月の場合
					if(Number(opeMonth) >= 1 && Number(opeMonth) <= 3) {

						if(Number(inputYear) > Number(opeYear) - 1) {

							// 入力された対象期間が運用日より未来の場合はエラー
							var msg = clutil.getclmsg('EAS0005');
							this.validator.setErrorMsg($("#ca_year"), msg);
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

							flag = false;
						}

					} else {

						if(Number(inputYear) > Number(opeYear)) {

							// 入力された対象期間が運用日より未来の場合はエラー
							var msg = clutil.getclmsg('EAS0005');
							this.validator.setErrorMsg($("#ca_year"), msg);
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

							flag = false;

						}
					}
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
			srchDto.storeType = tmpDto.storeType;
			srchDto.fPrev = tmpDto.fPrev;

			if(tmpDto.outType === '1') {
				// 週報出力の場合
				srchDto.srchDate = tmpDto.week;

			} else if(tmpDto.outType === '2') {
				// 半期報出力の場合
				srchDto.srchDate = tmpDto.half;

			} else {
				// 年報出力の場合
				srchDto.srchDate = tmpDto.year;
			}

			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMASV0030GetReq: srchDto
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
			var defer = clutil.postDLJSON('AMASV0030', srchReq);
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
			var defer = clutil.postDLJSON('AMASV0030', srchReq);
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

				// 週報をチェック
				$("#p_week").removeClass('dispn');
				$("#ca_week").addClass('cl_valid');

				$("#p_half").addClass('dispn');
				$("#ca_half").removeClass('cl_valid');

				$("#p_year").addClass('dispn');
				$("#ca_year").removeClass('cl_valid');

			} else if (val == '2') {

				// 半期報をチェック
				$("#p_week").addClass('dispn');
				$("#ca_week").removeClass('cl_valid');

				$("#p_half").removeClass('dispn');
				$("#ca_half").addClass('cl_valid');

				$("#p_year").addClass('dispn');
				$("#ca_year").removeClass('cl_valid');

			} else {

				// 年報をチェック
				$("#p_week").addClass('dispn');
				$("#ca_week").removeClass('cl_valid');

				$("#p_half").addClass('dispn');
				$("#ca_half").removeClass('cl_valid');

				$("#p_year").removeClass('dispn');
				$("#ca_year").addClass('cl_valid');

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