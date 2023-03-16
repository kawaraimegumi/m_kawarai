/**
 * 売上ログ誤差チェック表出力
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
		},

		/**
		 * initialize関数
		 */
		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '売上ログ誤差チェック表出力',
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

			// 対象日の開始日の初期値に運用日をセットする
			this.srchDatePicker = clutil.datepicker(this.$('#ca_fromDate'));
			this.srchDatePicker.datepicker('setIymd', clcom.getOpeDate());

			// 対象日の終了日の初期値は空白とする
			this.srchDatePicker = clutil.datepicker(this.$('#ca_toDate'));

			return this;
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
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			var fromDay = srchDto.fromDate;
			var toDay = srchDto.toDate;

			// 未入力エラー確認
			if(!this.validator.valid()){

				flag = false;
			}

			if(fromDay) {
				// 対象日開始日に運用日より未来の日付が設定されている
				if(fromDay > clcom.getOpeDate()){
					this.validator.setErrorMsg($("#ca_fromDate"), clmsg.EGM0035);
					flag = false;
				}
			}

			if(toDay) {
				// 対象日終了日に運用日より未来の日付が設定されている
				if(toDay > clcom.getOpeDate()){
					this.validator.setErrorMsg($("#ca_toDate"), clmsg.EGM0035);
					flag = false;
					return flag;
				}
			}

			// 対象日期間反転チェック
			var chkInfo = [];

			chkInfo.push({
				//対象日
				stval : 'ca_fromDate',
				edval : 'ca_toDate'
			});

			// 反転エラー確認
			if(!this.validator.validFromTo(chkInfo)){
				flag = false;
			}

			if (!flag) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				//this.validator.setErrorFocus();
				flag = false;
			}

			return flag;
		},

		/**
		 * 検索リクエストを作成する
		 */
		buildReq: function(rtyp){
			// validation
			/*if (!this.validator.valid()) {
				return null;
			}*/

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
				AMASV0080GetReq: srchDto
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
			var defer = clutil.postDLJSON('AMASV0080', srchReq);
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