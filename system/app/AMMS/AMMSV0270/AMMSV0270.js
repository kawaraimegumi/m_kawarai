useSelectpicker2();

$(function() {

	clutil.enterFocusMode($('body'));
	var CsvOutView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			'click #ca_csv_download'	: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
		},

		sampleURL: "/public/sample/店舗別品種別陳列可能数サンプル.xlsx",

		uri : "AMMSV0270",
		initialize: function(){
			_.bindAll(this);
			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '店舗別品種別陳列可能数登録',
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
			clutil.inputlimiter(this.$el);
			this.mdBaseView.initUIElement();

			var future = 1;
			var now = clcom.getOpeDate();
			var y = Math.floor(now /10000);
			var m = Math.floor(now /100) % 100;
			if (m < 4){
				y--;
				future--;
			};
			clutil.clyearselector(this.$("#ca_year"), 0, 10, future, "年度");
			this.$("#ca_year").find("option[value=" + y + "]").attr("selected", true);
			clutil.initUIelement(this.$("#ca_year"));
			clutil.cltypeselector(this.$("#ca_cour"), amcm_type.AMCM_TYPE_COUR);

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {
						AMMSV0270UpdReq: clutil.view2data(this.$("#ca_searchArea"))
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMMSV0270',
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
						if(!this.isNowOrFuture()){
							this.validator.setErrorMsg(this.$("#ca_year"), "本年度以降を指定してください。");
							clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
							return false;
						}
						return true;
					},this)
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

			// 事業ユニット取得
			return clutil.clbusunitselector(this.$('#ca_unitID'), 1).done(_.bind(function(){
				clutil.initUIelement(this.$el);
			}, this));
		},

		render : function(){
			this.mdBaseView.render();
			return this;
		},

		isNowOrFuture : function(){
			var selYear = Number(this.$("#ca_year").val());
			var opeDate = clcom.getOpeDate();
			var thisYear = Math.floor(opeDate / 10000);
			var thisMonth = Math.floor(opeDate / 100) % 100;
			if(thisMonth < 4){
				thisYear--;
			}
			return thisYear <= selYear;
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
				AMMSV0270GetReq: srchDto
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

		_onSampleDLClick: function() {
			clutil.download(this.sampleURL);
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
			var defer = clutil.postDLJSON('AMMSV0270', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
				if(data.rspHead.fieldMessages){
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}
			}, this));
			return false;
		}
	});


	clutil.getIniJSON(null, null)
	.done(_.bind(function(data,dataType){
		ca_csvOutView = new CsvOutView;
		ca_csvOutView.initUIelement().done(_.bind(function() {
			ca_csvOutView.render();
			//初期フォーカス
			var $tgt = null;
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$tgt = ca_csvOutView.$("#ca_year");
			}
			else{
				$tgt = ca_csvOutView.$("#ca_unitID").next().children('input');
			}
			clutil.setFocus($tgt);
		}, this));
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