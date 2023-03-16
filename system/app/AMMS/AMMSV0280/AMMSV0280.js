useSelectpicker2();

$(function(){

	clutil.enterFocusMode($('body'));

	var MyOpeType = {
			AM_PROTO_COMMON_RTYPE_CSV_EXCEL: 201,
			AM_PROTO_COMMON_RTYPE_CSV_ORG: 202,
		};

	var CsvOutView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			'click #ca_csv_download'	: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
		},

		sampleURL: "/public/sample/組織移動サンプル.xlsx",

		uri : "AMMSV0280",
		initialize: function(){
			_.bindAll(this);
			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '組織移動',
				subtitle: '登録',
				btn_submit: false,
				btns_dl: [
							{
								opeTypeId: MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_EXCEL,
								label: 'Excelデータ出力'
							},
							{
								opeTypeId: MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_ORG,
								label: '新組織表出力'
							}
						],
						btn_csv: false,
						opebtn_auto_enable: false,
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

			var now = clcom.getOpeDate();
			console.log(now);
			// datepicker
			clutil.datepicker(this.$("#ca_date"));
			var y = Math.floor(now / 10000);
			var m = Math.floor(now / 100) % 100;
			var d = now % 100;
			var tommorow = clutil.dateFormat(new Date(y,m-1,d+1), "yyyymmdd");
			this.$("#ca_date").datepicker("setIymd", tommorow);

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {
						AMMSV0280UpdReq: clutil.view2data(this.$("#ca_searchArea"))
					};
					if(request.AMMSV0280UpdReq.orgfuncID != clutil.getclsysparam("PAR_AMMS_DEFAULT_ORG_FUNCID", 1)){
						delete request.AMMSV0280UpdReq.unitID;
					}

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMMSV0280',
						data: request
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: function(){
						if(!_this.validator.valid()){
							return false;
						}
						if(clutil.dateFormat(_this.$("#ca_date").val(), "yyyymmdd") < tommorow){
							_this.validator.setErrorMsg(_this.$("#ca_date"), "翌日以降を設定してください。");
							return false;
						}
						return true;
					}
				}
			});
			// 取込処理が失敗した。後処理が必要な場合は↓イベントを購読する。
			this.opeCSVInputCtrl.on('fail', function(data){
				if(data.rspHead.fieldMessages){
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					_this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}
				if (data.rspHead.uri){
					clutil.download(data.rspHead.uri);	//CSVダウンロード実行
				}
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで

			var funcCode = clutil.clorgfunccode(this.$("#ca_orgfuncID"));
			this.listenTo(funcCode, "change", this._onOrgFuncChange);
			funcCode.setValue(clcom.cmDefaults.defaultOrgFunc);
			funcCode.trigger("change", clcom.cmDefaults.defaultOrgFunc);
			// 事業ユニット取得
			return clutil.clbusunitselector(this.$('#ca_unitID'), 1).done(_.bind(function(){
				clutil.initUIelement(this.$el);
			}, this));
		},

		render : function(){
			this.mdBaseView.render();
			return this;
		},

		_onOrgFuncChange : function(attrs, view, options){
//			var item = this.$("#ca_orgfuncID").autocomplete("clAutocompleteItem");
			clutil.clorglevelselector(this.$("#ca_orglevelID"), attrs.id).done(_.bind(function(){
				if (!_.isEmpty(attrs) && attrs.id == clutil.getclsysparam("PAR_AMMS_DEFAULT_ORG_FUNCID", 1)){
					this.$("#ca_unitID_div").show();
					this.$("#ca_unitID").addClass("cl_required").parent().parent().addClass("required");
					this.$("#ca_orglevelID").closest(".fieldUnit").removeClass("mrgl400");
					this.$("#ca_orglevelID").find("option").each(function(){
						var value = Number($(this).attr("value"));
						if(value == clutil.getclsysparam("PAR_AMMS_HD_LEVELID")
								|| value == clutil.getclsysparam("PAR_AMMS_COMPANY_LEVELID")
								|| value == clutil.getclsysparam("PAR_AMMS_UNIT_LEVELID")){
							$(this).remove();
						}
					});
					clutil.initUIelement($("#ca_orglevelID").closest(".fieldUnit"));
				} else {
					this.$("#ca_unitID_div").hide();
					this.$("#ca_unitID").removeClass("cl_required").parent().parent().removeClass("required");
					this.$("#ca_orglevelID").closest(".fieldUnit").addClass("mrgl400");
				}
			}, this));
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
//				console.log('CSV 出力');
//				this.doDownload(rtyp);
//				break;
			case MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_EXCEL:	// CSV(Excelデータ出力)
				console.log('Excelデータ出力');
				this.doDownload(rtyp);
				break;
			case MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_ORG:	// CSV(新組織表)
				console.log('新組織表出力');
				this.doDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		buildReq: function(rtyp){
			if (!this.validator.valid()) {
				return null;
			}

			//リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));

			if(rtyp == MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_EXCEL && (srchDto.orglevelID == null || srchDto.orglevelID.length == 0)){
				this.validator.setErrorMsg(this.$("#ca_orglevelID"), "Excelデータ出力は「出力階層」を指定してください。");
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return null; // 基本組織体系のみ
			}

			if(rtyp == MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_ORG && srchDto.orgfuncID != clutil.getclsysparam("PAR_AMMS_DEFAULT_ORG_FUNCID", 1)){
				this.validator.setErrorMsg(this.$("#ca_orgfuncID"), "新組織表出力は「基本組織体系」のみ出力可能です。");
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return null; // 基本組織体系のみ
			}
			if(rtyp == MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_ORG){
				srchDto.outType = 0;// 新組織表
			} else {
				srchDto.outType = 1;// Excelデータ出力
			}
			if(srchDto.orglevelID != null && srchDto.orglevelID.length > 0){
				$.each(srchDto.orglevelID, function(i,v){
					srchDto.orglevelID[i] = Number(this);
				});
			}
			var reqDto = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
				},
				reqPage: {
				},
				AMMSV0280GetReq: srchDto
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
			var defer = clutil.postDLJSON('AMMSV0280', srchReq);
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
		ca_csvOutView.initUIelement().done(_.bind(function() {
			ca_csvOutView.render();
			clutil.setFocus(ca_csvOutView.$("#ca_orgfuncID"));
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
