/**
 * 品種別営業実績一覧出力
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
			'change input[name="outType"]:first'	: '_onChangeOutType'	// 対象期間ラジオボタン変更
		},

		/**
		 * initialize関数
		 */
		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '品種別営業実績一覧出力',
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
			//clutil.clbusunitselector(this.$('#ca_srchUnitID'));
			AMASVUtil.clbusunitselector(this.$('#ca_srchUnitID'));

			// 現在年月日を取得
			var opeDate = String(clcom.getOpeDate());
			// 現在年月を取得
			var opeYearMonth = opeDate.substr(0,6);
			var initYearMonth = Number(opeYearMonth);

			// 対象期間取得
			var yearmonthcode = clutil.clyearmonthcode({
				  el: '#ca_month',
				  initValue: initYearMonth
			});

			// 四半期selector
			clutil.clquarteryearselector(this.$('#ca_quarter'), 1, 5, 0);

			// 店舗
			clutil.cltypeselector({
				$select: this.$("#ca_storeYearType"),
				kind: amcm_type.AMCM_TYPE_STORE_YEARTYPE,
				unselectedflag: 1,
				emptyLabel: '全店'
			});


			// 出力金額単位
			var yenUnit = clutil.cltypeselector(this.$("#ca_yenUnit"), amcm_type.AMCM_TYPE_OUTPUT_AMT_UNIT,1);
			// 初期区分値「千円」をセットする
			yenUnit.setValue(amcm_type.AMCM_VAL_OUTPUT_AMT_UNIT_THOUSAND_YEN);

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {

			this.mdBaseView.render();

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

			// 現在年月日を取得
			var opeDate = String(clcom.getOpeDate());
			// 現在年を取得
			var opeYear = opeDate.substr(0,4);
			// 現在月を取得
			var opeMonth = opeDate.substr(4,2);

			// 入力された対象期間を取得
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));

			if(srchDto.outType === '1'){

				if(srchDto.month) {

					// 月報が選択された場合
					var inputYear = String(srchDto.month).substr(0,4);
					var inputMonth = String(srchDto.month).substr(4,2);

					if(Number(inputYear) > Number(opeYear)) {

						flag = false;

					} else if((Number(inputYear) === Number(opeYear)) && (Number(inputMonth) > Number(opeMonth))) {

						flag = false;
					}

					if(flag === false) {

						// 入力された対象期間が運用日より未来の場合はエラー
						var msg = clutil.getclmsg('EAS0001');
						this.validator.setErrorMsg($("#ca_month"), msg);
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
					}
				}
			} else {

				// 四半期報が選択された場合

				if(srchDto.quarter && srchDto.quarter !== "0") {

					var inputYear = String(srchDto.quarter).substr(0,4);
					var inputTerm = String(srchDto.quarter).substr(4,2);

					if(Number(inputYear) > Number(opeYear)) {
						// 未来年の比較
						flag = false;
					} 
					else if(Number(inputYear) == Number(opeYear)){
						// 同じ年の比較
						if(Number(opeMonth) >= 1 && Number(opeMonth) < 4) {
							// 運用日が1月～3月の場合
							if(Number(inputTerm) > 4) {

								flag = false;
							}
						} else if(Number(opeMonth) >= 4 && Number(opeMonth) < 7) {
							// 運用日が4月～6月の場合
							if(Number(inputTerm) > 1) {

								flag = false;
							}
						} else if(Number(opeMonth) >= 7 && Number(opeMonth) < 10) {
							// 運用日が7月～9月の場合
							if(Number(inputTerm) > 2) {

								flag = false;
							}
						} else if(Number(opeMonth) >= 10 && Number(opeMonth) <= 12) {
							// 運用日が10月～12月の場合
							if(Number(inputTerm) > 3) {

								flag = false;
							}
						}
					}
					/*
					else{
						// 過去年ならOK
					}
					*/
						
					if(flag === false) {

						// 入力された対象期間が運用日より未来の場合はエラー
						var msg = clutil.getclmsg('EAS0004');
						this.validator.setErrorMsg($("#ca_quarter"), msg);
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
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
			srchDto.storeYearType = tmpDto.storeYearType;
			srchDto.yenUnit = tmpDto.yenUnit;

			if(tmpDto.outType === '1') {
				// 月報出力の場合
				srchDto.srchYm = tmpDto.month;

			} else {
				// 四半期報出力の場合
				srchDto.srchYm = tmpDto.quarter;
			}

			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMASV0020GetReq: srchDto
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
			var defer = clutil.postDLJSON('AMASV0020', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 対象期間ラジオボタン変更
		 */
		_onChangeOutType: function(e){

			if (e.target.checked) {

				// 月報が選択されている--対象月選択部品を表示する
				$("#p_month").removeClass('dispn');
				$("#p_quarter").addClass('dispn');

				// 四半期報選択部品のvalidatorは無効にする
				$("#ca_quarter").removeClass('cl_valid');

			} else {

				// 四半期報が選択されている--四半期報選択部品を表示する
				$("#p_month").addClass('dispn');
				$("#p_quarter").removeClass('dispn');

				// 対象月選択部品のvalidatorは無効にする
				$("#ca_month").removeClass('cl_valid');
			}
		}

	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

//		if(clcom.pageData){
//			// 保存パラメタがある場合
//			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
//			mainView.load(clcom.pageData);
//		}
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