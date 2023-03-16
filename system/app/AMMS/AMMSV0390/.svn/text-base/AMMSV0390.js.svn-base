useSelectpicker2();

$(function() {

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;
	clutil.enterFocusMode($('body'));
	var CsvOutView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			'click #ca_csv_download'	: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
		},

		sampleURL: "/public/sample/サイズパターンマスタサンプル.xlsx",

		uri : "AMMSV0390",
		initialize: function(){
			_.bindAll(this);
			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: 'サイズマスタ登録・修正',
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
						AMMSV0390UpdReq: clutil.view2data(this.$("#ca_searchArea"))
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMMSV0390',
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


			// サイズグループ サイズパターン選択
//			clutil.clsizeptncode({
//				el:this.$("#ca_sizePtnID"),
//				dependAttrs: {
//					sizegrpID: function(){
//						return _this.$("#ca_sizeGrpID").val();
//					}
//				}
//			});
//			return clutil.clsizegrpselector({el:this.$("#ca_sizeGrpID")});
			return this.relation = clutil.FieldRelation.create('default', {
				clsizegrpselector : {
					el : "#ca_sizeGrpID"
				},
				clsizeptncode : {
					el : "#ca_sizePtnID"
				}
			});
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
				AMMSV0390GetReq: srchDto
			};
			console.log(srchDto);
			return reqDto;
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
			var defer = clutil.postDLJSON('AMMSV0390', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
			return false;
		},

		_onSampleDLClick: function() {
			clutil.download(this.sampleURL);
		},
	});


	clutil.getIniJSON(null, null)
	.done(_.bind(function(data,dataType){
		ca_csvOutView = new CsvOutView;
		ca_csvOutView.initUIelement().done(_.bind(function(){
			ca_csvOutView.render();
		},this));
		clutil.setFocus($("#ca_sizeGrpID").next().children('input'));
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