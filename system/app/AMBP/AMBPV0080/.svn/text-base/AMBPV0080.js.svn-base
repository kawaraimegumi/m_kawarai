useSelectpicker2();

$(function(){

	clutil.enterFocusMode($('body'));

	var MainView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			'click #ca_csv_download'	: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
		},

		sampleURL: "/public/sample/SKT店舗日別計画_サンプル.xlsx",

		uri : "AMBPV0080",
		initialize: function(){
			_.bindAll(this);
			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: 'SKT店舗日別計画',
				btn_csv: true,
				btn_submit: false,
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		saveUploadRequest: null,
		saveUploadFile: null,

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
						AMBPV0080UpdReq: clutil.view2data(this.$("#ca_searchArea"))
					};

					this.saveUploadRequest = _.extend({}, request);
					this.saveUploadFile = uploadedFile;

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMBPV0080',
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
				if (data.rspHead.fieldMessages) {
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					_this.validator.setErrorInfoFromSrv(
							data.rspHead.fieldMessages, {
								by : "id",
								prefix : "ca_"
							});
				}
				if (data.rspHead.uri) {
					// CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				}
			}, this));
			// ---------------------------------------- [CSV取込ボタン]: ここまで

			var now = clcom.getOpeDate();
			console.log(now);
			// datepicker

			var unit_id = 0;
			if (clcom.userInfo.unit_id != 0) {
				var aoki1 = Number(clcom.getSysparam(amcm_sysparams.PAR_AMMS_UNITID_AOKI));
				var ori1 = Number(clcom.getSysparam(amcm_sysparams.PAR_AMMS_UNITID_ORI));
				if (clcom.userInfo.unit_id == aoki1) {
					unit_id = Number(clcom.getSysparam('PAR_AMMS_SMXORG_UNITID_AOKI'));
				} else if (clcom.userInfo.unit_id == ori1) {
					unit_id = Number(clcom.getSysparam('PAR_AMMS_SMXORG_UNITID_ORI'));
				}
			}

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID",
					initValue: unit_id,
					addDepends:['funcID'],
					dependSrc: {
						funcID: 'funcID',
					},
				},
			}, {
				dataSource: {
					funcID: Number(clcom.getSysparam('PAR_AMMS_SMXORG_ORG_FUNCID'))
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。(空の店舗ランク取得)
			});


			// 対象月
			this.utl_month = clutil.clmonthselector(this.$('#ca_srchMonth'), 1, 1, 1, null, null, 1, null, 'd'); //TODO:初期表示調整(とりあえず前後1年)

			return this;
		},

		render : function(){
			this.mdBaseView.render();
			return this;
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV(Excelデータ出力)
				console.log('Excelデータ出力');
				this.doDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		isValid: function() {
			var retStat = true;

			if(!this.validator.valid()){
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return false;
			}
			return true;
		},

		buildReq: function(rtyp){
			if (!this.isValid()) {
				return null;
			}

			//リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			var reqDto = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
				},
				reqPage: {
				},
				AMBPV0080GetReq: srchDto
			};
			console.log(srchDto);
			return reqDto;
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
			var defer = clutil.postDLJSON('AMBPV0080', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
			return false;
		}
	});


	clutil.getIniJSON(null, null).done(_.bind(function(data,dataType){
		mainView = new MainView;
		mainView.initUIelement().render();
		var $tgt = $("#ca_srchUnitID");
		clutil.setFocus($tgt);
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
