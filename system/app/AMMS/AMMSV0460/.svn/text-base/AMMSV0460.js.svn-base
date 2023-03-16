useSelectpicker2();

$(function() {

	var CsvOutView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			'click #ca_csv_download'	: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
			'change #ca_tgtTypeID'      : '_onTgtTypeChanged',      // 対象区分が変更された
			'change #ca_unitID'         : '_onUnitChanged',         // 事業ユニットが変更された
		},

		sampleURL: "/public/sample/商品台帳サンプル.xlsx",

		uri : "AMMSV0460",
		initialize: function(){
			_.bindAll(this);
			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '商品台帳取込',
				btn_submit: false,
				btn_csv: false
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
//				request.AMMSV0460UpdReq = srchReq;
//				var reqHead = {
//					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT,
//					fileId: file.id,
//				};
//				request.reqHead = reqHead;
//
//				var url = "AMMSV0460";
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

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {
						AMMSV0460UpdReq: clutil.view2data(this.$("#ca_searchArea"))
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMMSV0460',
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


			//取込対象選択
			clutil.cltypeselector(this.$("#ca_tgtTypeID"), amcm_type.AMCM_TYPE_ITEMCSV_TGT);
			// 部品間連携で初期値を設定する方法
			return this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: '#ca_unitID'//,
//					// 初期値の設定
//					initValue: 5
				},

				// 品種
				clvarietycode: {
					el: '#ca_itgrpID'//,
//					initValue: {
//						code: "09",
//						id: 103,
//						name: "シャツ"
//					}
				}
			}, {
				dataSource: {
					ymd: clcom.getOpeDate
				}
			});

//			// 事業ユニット取得
//			return clutil.clbusunitselector(this.$('#ca_unitID'), 1).done(_.bind(function(){
//				clutil.initUIelement(this.$el);
//			}, this));
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
			srchDto.cour = 1; // FIXME :クール区分もらえるまで固定
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
				},
				AMMSV0460GetReq: srchDto
			};
			console.log(srchDto);
			return reqDto;
		},

		/**
		 * 事業ユニットが変更された
		 */
		_onUnitChanged: function(e) {
			if(this.deserializing){
				// データセット中
				return;
			}
            var unitID = Number($(e.target).val());
			if( unitID > 0 ){
				var tgtID = Number(this.$("#ca_tgtTypeID").val());
				if( tgtID == 3 ){
					// SMXカタログ選択中は、品種選択不可とする
					$("#ca_itgrpID_div").removeClass("required");
					$("#ca_itgrpID").removeClass("cl_required");
					$("#ca_itgrpID").val(null);
					clutil.inputReadonly($("#ca_itgrpID"));
				}
				else {
					$("#ca_itgrpID_div").addClass("required");
					$("#ca_itgrpID").addClass("cl_required");
	                clutil.inputRemoveReadonly($("#ca_itgrpID"));
				}
            }
		},

		/**
		 * 対象区分が変更された
		 */
		_onTgtTypeChanged: function(e) {
			if(this.deserializing){
				// データセット中
				return;
			}
            var tgtTypeID = Number($(e.target).val());
			if( tgtTypeID == 3 ){
				// SMXカタログの場合は品種選択不可とする
				$("#ca_itgrpID_div").removeClass("required");
				$("#ca_itgrpID").removeClass("cl_required");
				$("#ca_itgrpID").val(null);
				$("#div_itgrpID").removeClass("required");
                clutil.inputReadonly($("#ca_itgrpID"));
            } else {
				var unitID = Number(this.$("#ca_unitID").val());
				if( unitID > 0 ){
					$("#ca_itgrpID_div").addClass("required");
					$("#ca_itgrpID").addClass("cl_required");
					$("#div_itgrpID").addClass("required");
	                clutil.inputRemoveReadonly($("#ca_itgrpID"));
				}
            }
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
			var defer = clutil.postDLJSON('AMMSV0460', srchReq);
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
		ca_csvOutView.initUIelement().done(_.bind(function(){
			ca_csvOutView.render();
			
			//初期フォーカス
			var $tgt = null;
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$tgt = ca_csvOutView.$("#ca_tgtTypeID");
			}
			else{
				$tgt = ca_csvOutView.$("#ca_unitID").next().children('input');
			}
			clutil.setFocus($tgt);
		},this));
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
