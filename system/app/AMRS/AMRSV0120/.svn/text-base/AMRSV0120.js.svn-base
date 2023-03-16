useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		validator : null,

		// Events
		events : {
			'click #ca_csv_download'		: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
		},

		/**
		 * 初期化
		 */
		initialize: function() {
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: 'SPC使用件数取込',
				btn_submit: false,
				btn_csv: true
			});

//			// CSV取込
//			this.fileInput = clutil.fileInput({
//				files: [],
//				fileInput: "#ca_csvinput1",
//				showDialogOnSuccess : false,
//				showDialogOnError : false
//			});
//
//			this.fileInput.on('success', _.bind(function(file){
//				this.validator.clear();
//				console.log('成功', file);
//				var req = this.buildReq();
//				req.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT;
//				req.reqHead.fileId = file.id;
//
//				var url = "AMRSV0120";
//				clutil.postJSON(url, req).done(_.bind(function(data,dataType){
//					if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
//						//成功時処理
//						var view = new clutil.MessageDialog2('取込が完了しました。');
//
//					} else {
//						// ヘッダーにメッセージを表示
//						this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args),});
//						this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_",});
//						if (data.rspHead.uri){
//							clutil.download(data.rspHead.uri);	//CSVダウンロード実行
//						}
//					}
//				},this)).fail(_.bind(function(data){
//					clutil.mediator.trigger('onTicker', data);
//
//					// エラーファイルがあればダウンロードする
//					if (data.rspHead.uri){
//						clutil.download(data.rspHead.uri);	//CSVダウンロード実行
//					}
//				}, this));
//			}, this));

			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 補正相殺項目
				cloffsetitemselector: {
					el: "#ca_offsetItemID",
					dependAttrs: {
						offsetTypeID: amcm_type.AMCM_VAL_OFFSET_TYPE_NUMBER,
					},
				},
			}, {
			});
			this.fieldRelation.done(function() {
				var unit = null;
				var unit_id = clcom.getUserData().unit_id;
				if(unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
						|| unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
					unit = unit_id;
				}

				if (unit != null) {
					this.$("#ca_srchUnitID").selectpicker('val', unit);
				}
			});

//			this.fieldRelation.on('field:readonly:change', _.bind(function(view, readonly) {
//				if (view.id === 'cloffsetitemselector') {
//					var $tgt = $("#ca_offsetItemID");
//					var $tgt_div = $tgt.parent().parent();
//					var val = $tgt.val();
//					if (readonly == true && val == 0) {
//						$tgt.removeClass('cl_required');
//						$tgt_div.removeClass('required');
//					} else {
//						$tgt.addClass('cl_required');
//						$tgt_div.addClass('required');
//					}
//				}
//			}, this));

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
			clutil.mediator.on('change:clbusunitselector', console.log('changeEvent'));

		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function() {
			this.mdBaseView.initUIElement();
			clutil.inputlimiter(this.$el);

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
//					var req = this.buildReq();
//					req.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT;
//					req.reqHead.fileId = file.id;
					// リクエストデータ本体
					var request = {
						cond: clutil.view2data(this.$("#ca_searchArea"))
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMRSV0120',
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

			// 事業ユニット取得
			//clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);

			// 対象月
			clutil.clmonthselector($("#ca_targetYm"), 1, 1, null, null, null, 1, 0, 'd');

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();

			return this;
		},

		changeYM: function(srchReq) {
			var targetYm = Number(srchReq.targetYm);
			var year = Math.floor(targetYm / 100);
			var month = targetYm % 100;
			if (month <= 3) {
				// １～３月の場合は年を調整する
				year += 1;
			}
			srchReq.targetYm = year * 100 + month;
		},

		buildReq: function(rtyp){
			// validation
			if (!this.validator.valid()) {
				return null;
			}

			// リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
//			this.changeYM(srchDto);

			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				cond: srchDto
			};

			return reqDto;
		},

		/**
		 * 表示ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
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

		doCSVDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMRSV0120', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			}
		},

		sampleURL: "/public/sample/SPC使用件数サンプル.xlsx",

		_onSampleDLClick: function() {
			clutil.download(this.sampleURL);
		},

	});

	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();
		//初期フォーカス
		var $tgt = null;
		if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
			$tgt = $("#ca_targetYm").next().children('input');
		}
		else{
			$tgt = $("#ca_srchUnitID").next().children('input');
		}
		mainView.resetFocus($tgt);
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