/**
 * ユーザＣＳＶ取込
 */
$(function() {

	var CsvOutView = Backbone.View.extend({

		el : $("#ca_main"),

		validator : null,

		events : {},

		uri : "AMCMV0210",

		/**
		 * initialize関数
		 */
		initialize: function(){

			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: 'ユーザＣＳＶ取込',
				btn_submit: false,
				btn_csv: true
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});

		},

		/**
		 * initUIelement関数
		 */
		initUIelement : function(){

			clutil.inputlimiter(this.$el);

			this.mdBaseView.initUIElement();

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({

				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){

					// リクエストデータ本体
					var request = {
						AMCMV0210UpdReq: clutil.view2data(this.$("#ca_searchArea"))
					};
					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMCMV0210',
						data: request
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(function(){
						if(!this.validator.valid()){
							return false;
						}
						/*if(!this.isFuture()){
							this.validator.setErrorMsg(this.$("#ca_targetYear"), clmsg.EMS0062);
							clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
							return false;
						}
						return true;*/
					}, this)
				}
			});

			// 取込処理が成功した。後処理が必要な場合は↓イベントを購読する。
//			this.opeCSVInputCtrl.on('done', function(data){
//				// 何か後処理があれば、ここに記述する。
//			});

			// 取込処理が失敗した。後処理が必要な場合は↓イベントを購読する。
			this.opeCSVInputCtrl.on('fail', _.bind(function(data){
				if(data.rspHead.fieldMessages){
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}
				if (data.rspHead.uri){
					clutil.download(data.rspHead.uri);	//CSVダウンロード実行
				}
			}, this));
			// ---------------------------------------- [CSV取込ボタン]: ここまで

			return this;
		},

		/**
		 * render関数
		 */
		render : function(){
			this.mdBaseView.render();
			return this;
		}

	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null, null)
	.done(_.bind(function(data,dataType){

		ca_csvOutView = new CsvOutView;
		ca_csvOutView.initUIelement().render();

	}, this)).fail(function(data){

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