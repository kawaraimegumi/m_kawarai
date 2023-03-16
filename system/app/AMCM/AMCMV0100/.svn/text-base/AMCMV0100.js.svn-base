// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function() {

	var CsvOutView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			'click #ca_sample_download'	: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
		},

		uri : "AMCMV0100",
		initialize: function(){
			_.bindAll(this);
			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '承認設定',
				btn_submit: false,
				btn_csv: true
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		initUIelement : function(){
			var _this = this;
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
							AMCMV0100UpdReq: clutil.view2data(this.$("#ca_searchArea"))
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMCMV0100',
						data: request
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(this.validator.valid, this.validator)
				}
			});
			// 取込処理が失敗した。後処理が必要な場合は↓イベントを購読する。
			this.opeCSVInputCtrl.on('fail', function(data){
				if(data.rspHead.fieldMessages){
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					_this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}
				if (data.rspHead.uri){
					// CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				}
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで

			// 承認業務区分
			clutil.cltypeselector(this.$("#ca_approveFuncTypeID"), amcm_type.AMCM_TYPE_APPROVE_FUNC, 1);

			return this;
		},

		render : function(){
			this.mdBaseView.render();
			return this;
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
				},
				AMCMV0100GetReq: srchDto
			};
			console.log(srchDto);
			return reqDto;
		},

		/**
		 * サンプルファイルダウンロード
		 */
		_onSampleDLClick: function() {
			var sampleURL = "/public/sample/承認設定サンプル.xlsx";
			clutil.download(sampleURL);
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				console.log('CSV 出力');
				this.doDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * 出力ボタン押下処理
		 */
		doDownload: function(rtyp) {
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMCMV0100', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
//			return false;
		}
	});


	clutil.getIniJSON(null, null)
	.done(_.bind(function(data,dataType){
		ca_csvOutView = new CsvOutView;
		ca_csvOutView.initUIelement().render();
		clutil.setFocus($("#ca_approveFuncTypeID"));
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