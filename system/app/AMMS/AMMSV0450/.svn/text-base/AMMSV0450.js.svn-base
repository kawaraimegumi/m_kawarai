useSelectpicker2();

$(function() {
	clutil.enterFocusMode($('body'));
	var CsvOutView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			'click #ca_csv_download'	: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
		},

		sampleURL: "/public/sample/クールマスタサンプル.xlsx",

		uri : "AMMSV0450",
		initialize: function(){
			_.bindAll(this);
			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: 'クールマスタ取込',
				btn_submit: false,
				btn_csv: true
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});

//			// CSV取込
//			this.fileInput = clutil.fileInput({
//				files: [],
//				fileInput: "#ca_torikomi1",
//				showDialogOnSuccess : false,
//				showDialogOnError : false
//			});
//			this.fileInput.on('success', _.bind(function(file){
//				this.validator.clear();
//				console.log('成功', file);
//				var request = {};
//				// リクエストをつくる
//				// validation
//				if (!this.validator.valid()) {
//					return;
//				}
//				var srchReq = clutil.view2data(this.$("#ca_searchArea"));
//				request.AMMSV0450UpdReq = srchReq;
//				var reqHead = {
//					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT,
//					fileId: file.id,
//				};
//				request.reqHead = reqHead;
//
//				var url = "AMMSV0450";
//				clutil.postJSON(url, request).done(_.bind(function(data,dataType){
//					if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
//						//成功時処理
//						var view = new clutil.MessageDialog({
//							message: '取込が完了しました。'
//						});
//					} else {
//						// ヘッダーにメッセージを表示
//						this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
//						this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
//						if (data.rspHead.uri){
//							clutil.download(data.rspHead.uri);	//CSVダウンロード実行
//						}
//					}
//				},this)).fail(_.bind(function(data){
////					clutil.mediator.trigger('onTicker', data);
//					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
//					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
//					if (data.rspHead.uri){
//						clutil.download(data.rspHead.uri);	//CSVダウンロード実行
//					}
//				}, this));
//			}, this));
		// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		initUIelement : function(){
			clutil.inputlimiter(this.$el);
			this.mdBaseView.initUIElement();

			clutil.clyearselector(this.$("#ca_targetYear"), 0, 10, 10, "年度");
			var y = Math.floor(clcom.getOpeDate() / 10000);
			var m = Math.floor(clcom.getOpeDate() / 100) % 100;
			if (m > 4){
				y++;
			}
			this.$("#ca_targetYear").val(y);
			clutil.initUIelement(this.$el);
//			// 事業ユニット取得
//			return clutil.clbusunitselector(this.$('#ca_unitID'), 1).done(_.bind(function(){
//				clutil.initUIelement(this.$el);
//			}, this));

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {
						AMMSV0450UpdReq: clutil.view2data(this.$("#ca_searchArea"))
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMMSV0450',
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
						if(!this.isFuture()){
							this.validator.setErrorMsg(this.$("#ca_targetYear"), clmsg.EMS0062);
							clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
							return false;
						}
						return true;
					}, this)
				}
			});
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

		render : function(){
			this.mdBaseView.render();
			return this;
		},

		isFuture : function(){
			var selYear = Number(this.$("#ca_targetYear").val());
			var opeDate = clcom.getOpeDate();
			var thisYear = Math.floor(opeDate / 10000);
			var thisMonth = Math.floor(opeDate / 100) % 100;
			if(thisMonth < 4){
				thisYear--;
			}
			return thisYear < selYear;
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
				AMMSV0450GetReq: srchDto
			};
			console.log(srchDto);
			return reqDto;
		},

		_onSampleDLClick: function() {
			clutil.download(this.sampleURL);
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
			var defer = clutil.postDLJSON('AMMSV0450', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
			return false;
		}
	});


	clutil.getIniJSON(null, null)
	.done(_.bind(function(data,dataType){
		ca_csvOutView = new CsvOutView;
		ca_csvOutView.initUIelement();
		ca_csvOutView.render();
		clutil.setFocus(ca_csvOutView.$("#ca_targetYear").next().children('input'));
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