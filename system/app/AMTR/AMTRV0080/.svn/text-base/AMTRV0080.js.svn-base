useSelectpicker2();

$(function(){

	clutil.enterFocusMode($('body'));

	var CsvOutView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			//'change #ca_target'			: '_onChangeTarget',		// 取込対象変更
		},

		uri : "AMTRV0080",
		initialize: function(){
			_.bindAll(this);
			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '移動依頼一括取込',
				btn_csv: false,
				btn_submit: false,
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		initUIelement : function(){
			var _this = this;

			//MD-1953 振分一括取込_長時間実行時の挙動改善_作業依頼　タイムアウト変更
			$.ajaxSetup({
				  timeout: 15 * 60 * 1000		// タイムアウト15分(個別設定)
			});

			clutil.inputlimiter(this.$el);
			this.mdBaseView.initUIElement();

			// 取込対象
			var targetList = [
				{ id: 1, code: "1", name: "移動依頼(StoCS)" }
			];
			clutil.cltypeselector2(this.$("#ca_target"), targetList);
			// 取込モード
			clutil.cltypeselector(this.$("#ca_mode"), amcm_type.AMCM_TYPE_TAKE_IN_MODE);


			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {
						AMTRV0080UpdReq: clutil.view2data(this.$("#ca_searchArea"))
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMTRV0080',
						data: request
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(this.validator.valid, this.validator),
					maxFileSize: 50 * 1024 * 1024	// 50MB
				}
			});
			// 取込処理が失敗した。後処理が必要な場合は↓イベントを購読する。
			this.opeCSVInputCtrl.on('fail', function(data){
				if (data.rspHead.fieldMessages){
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					_this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}
				if (data.rspHead.uri){
					// CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				}
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで

			var now = clcom.getOpeDate();
			console.log(now);
			// datepicker

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID",
					initValue: clcom.userInfo.unit_id
				},
			}, {
				dataSource: {
					ymd: clcom.getOpeDate,
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。(空の店舗ランク取得)
			});
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

		buildReq: function(rtyp){
			if (!this.validator.valid()) {
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
				AMTRV0080GetReq: srchDto
			};
			console.log(srchDto);
			return reqDto;
		},

		/******************
		_onChangeTarget: function(e) {
			console.log('_onChangeTarget');
			var val = $("#ca_target").selectpicker('val');
			var $tgt = $("#ca_importWarnSheet");

			// StoCS関連が選択された場合のチェックボックスの挙動は未定のため、一旦チェック無しで
			if (val == amcm_type.AMCM_VAL_TAKE_IN_TARGET_BASE) {
				$tgt.attr("checked", true).closest("label").addClass("checked");
			} else {
				$tgt.attr("checked", false).closest("label").removeClass("checked");
			}
		},
		*************/

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
			var defer = clutil.postDLJSON('AMTRV0080', srchReq);
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
