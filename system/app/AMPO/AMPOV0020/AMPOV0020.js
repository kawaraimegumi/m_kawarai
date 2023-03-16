useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	
	/* シーズンセレクタの内容を保存しておく変数2015/10/29 早川 */
	var seasonSelectorList = [];

	clutil.enterFocusMode($('body'));
	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_table .btn-delete" : "_onDeleteLineClick",
			"click #ca_table tbody tr span.btn-add" : "_onAddLineBeforeClick",
			"click #ca_table tfoot tr:last" : "_onAddLineClick",
//			"click #ca_csv_uptake" 		: "_onCsvUpTakeClick", 		//TODO:取込実装
			"change #ca_poTypeID" 	: "_PoTypeChange",
			"click .cl_download" : "_onCSVClick",							//CSV出力押下
			"click #ca_sample_download"		: "_onSampleDLClick",		// ExcelサンプルDLボタン押下
			"change #ca_poTypeID"			: "_onChangePoTypeID_UnitID",				//PO種別変更 ウォッシャブルフラグ追加対応 2015/10/28 早川
			"change #ca_unitID"				: "_onChangePoTypeID_UnitID",      //PO種別変更 ウォッシャブルフラグ追加対応 2015/10/28 早川
		},

		sampleURL: "/public/sample/生地IDサンプル.xlsx",

		/**
		 * opt : clcom.pageArgs
		 */
		initialize: function(opt){

			_.bindAll(this);


			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
						title: '生地ID',
						opeTypeId: o.opeTypeId,
						pageCount: o.chkData.length,
						btn_csv: ((o.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL)
								&& (o.chkData[0].delFlag >0))?false:	true,
						// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
						// リクエストビルダ関数を渡しておく。
						buildSubmitReqFunction: this._buildSubmitReqFunction,
						// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
						// リクエストのビルダ関数を opt で渡しておく。
						buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
						? this._buildGetReqFunction : undefined,
								buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

//			// *アプリ個別の View や部品をインスタンス化するとか・・・*			// CSV取込
//			this.fileInput = clutil.fileInput({
//				files: [],
//				fileInput: "#ca_csvinput1",
//				showDialogOnSuccess : false,
//				showDialogOnError : false
//			});
//
//			this.fileInput.on('success', _.bind(function(file){
//				// 一時サーバーにアップロード成功したときに呼ばれる。
////				this.validator.clear();
//				console.log('成功', file);
//				var request = {};
//				// リクエストをつくる
//				// validation
//				if (!this.validator1.valid()) {
//					return;
//				}
//				var srchReq = clutil.view2data(this.$("#ca_base_form"));
//				request.AMPOV0020UpdReq = {};
//				request.AMPOV0020UpdReq.clothID = srchReq;
//				var reqHead = {
//						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT,
//						fileId: file.id,
//				};
//				request.reqHead = reqHead;
//
//				var url = "AMPOV0020";
//				clutil.postJSON(url, request).done(_.bind(function(data,dataType){
//					if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
//						//成功時処理
//						//テーブルクリア
//						this.clearTable();
//						//テーブル追加
//						var getRsp = data.AMPOV0020GetRsp;
//						this._allData2View(getRsp);
//						var _this = this;
////						this.$("#ca_table_tbody").find("tr").each(function(){
////						_this.setCompletes($(this));
////						});
////						var view = new clutil.MessageDialog({
////						message: '取込が完了しました。'
////						});
//					} else {
//						// ヘッダーにメッセージを表示
//						this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
//						this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
//						if (data.rspHead.uri){
//							//エラーCSVのダウンロード実行
//							clutil.download(data.rspHead.uri);
//						}
//					}
//				},this)).fail(_.bind(function(data){
////					clutil.mediator.trigger('onTicker', data);
//					// ヘッダーにメッセージを表示
//					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
//					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
//					if (data.rspHead.uri){
//						//エラーCSVのダウンロード実行
//						clutil.download(data.rspHead.uri);
//					}
//				}, this));
//			}, this));

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// それ以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});
			this.validator1 = clutil.validator($("#ca_base_form"), {
				echoback : $('.cl_echoback')
			});
			this.validator2 = clutil.validator($("#ca_table_tbody"), {
				echoback : $('.cl_echoback')
			});


			return this;
		},

		initUIelement : function(){
			var _this = this;
			this.mdBaseView.initUIElement();
			// 初期データ取得後に呼ばれる関数

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'));

			// ＰＯ種別
			clutil.cltypeselector(this.$("#ca_poTypeID"), amcm_type.AMCM_TYPE_PO_CLASS);
			//シーズン
			//clutil.cltypeselector(this.$("#ca_seasonTypeID"), amcm_type.AMCM_TYPE_SEASON);
			this.makeSeasonSel(this.$("#ca_seasonTypeID"));//シーズンセレクタの内容をam_pa_poseason_srchから受け取るよう変更 2015/10/29 早川
			
			// Fieldlimit
			clutil.cltxtFieldLimit($("#ca_code"));
			clutil.cltxtFieldLimit($("#ca_name"));


//			$('#ca_code').inputlimiter('addlimiter', 'ca_code_limiter', function(value){
//				return $.inputlimiter.Limiters.regex(/[-0-9A-Za-z]+/)(value);
//			});

			$("#ca_tp_code").tooltip({html: true});
			$("#ca_tp_washable").tooltip({html: true});
			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {};
					var srchReq =
					request.AMPOV0020UpdReq = {};
					request.AMPOV0020UpdReq.clothID = clutil.view2data(this.$("#ca_base_form"));
					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMPOV0020',
						data: request
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(function(){
						var _flag = true;

						if(!this.validator1.valid()){
							_flag = false;
						}
						if(_flag == false){
							clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
						}

						return _flag;
					}, this)


				}
			});
			// 取込処理成功
			this.opeCSVInputCtrl.on('done', function(data){
				if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					//成功時処理
					//テーブルクリア
					_this.clearTable();
					//テーブル追加
					var getRsp = data.AMPOV0020GetRsp;
					_this._allData2View(getRsp);
//					var _this = this;
//					this.$("#ca_table_tbody").find("tr").each(function(){
//					_this.setCompletes($(this));
//					});
//					var view = new clutil.MessageDialog({
//					message: '取込が完了しました。'
//					});
				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
					_this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
					if (data.rspHead.uri){
						//エラーCSVのダウンロード実行
						clutil.download(data.rspHead.uri);
					}
				}
			});

			// 取込処理失敗
			this.opeCSVInputCtrl.on('fail', function(data){
				clutil.mediator.trigger('onTicker', data);
				// 取込処理が失敗した。
				// ヘッダーにメッセージを表示
				_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				_this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});

				if(data.rspHead.uri){
					//CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				}
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで

			return this;
		},

		render : function(){
			this.$("#ca_unitID").val(clcom.userInfo.unit_id);
			this.mdBaseView.render();
//			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				// テーブル設定
				this.clearTable(this.$("#ca_table_tbody tr"));
				this.makeDefaultTable(this.$("#ca_table_tbody"), this.$("#ca_tbody_template"));
				//初期フォーカス
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.setFocus(this.$('#ca_poTypeID'));
				}
				else{
					clutil.setFocus(this.$('#ca_unitID'));
				}
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}
			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				document.location = '#';
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					// 更新した日付をchkdataに反映
//					this.options.chkData[args.index].fromDate = args.data.AMPOV0020GetRsp.orgfunc.fromDate;
				}
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setTableReadOnly(true);
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setTableReadOnly(true);
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setTableReadOnly(true);
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.validator.setErrorInfoToTable({
					$table: this.$('#ca_table'),
					fieldMessages: data.rspHead.fieldMessages,
					struct_name: 'clothCodeList',
					options: {
						by: 'name'
					}
				});
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
//				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			this.setHeadReadOnly(false);
			this.setTableReadOnly(false);

			switch(args.status){
			case 'OK':
				var getRsp = data.AMPOV0020GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.clothID);
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					this.setHeadReadOnly(true);
					this.setTableReadOnly(true);
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					this.setHeadReadOnly(true);
					this.setTableReadOnly(true);
					break;

				default:
					//新規はここには来ないはず
					this.setHeadReadOnly(false);
				clutil.viewReadonly(this.$(".ca_unitID_div"));
				clutil.viewReadonly(this.$(".ca_poTypeID_div"));
				clutil.inputReadonly($("#ca_code"));
				if(getRsp.clothID.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
					//レディスのプライスライン入力不可
					clutil.viewClear(this.$(".ca_priceLine_div"));
					clutil.inputReadonly($("#ca_priceLine"));
				}else{
					//それ以外プライスライン入力可
					clutil.inputRemoveReadonly($("#ca_priceLine"));
				}
				clutil.setFocus($('#ca_name'));
				break;
				}
				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
//				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.cl_sys_db_other)});
				var getRsp = data.AMPOV0020GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.clothID);
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				this.setTableReadOnly(true);
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setHeadReadOnly(true);

//				this._tableDisable();
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMPOV0020GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.clothID);
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setHeadReadOnly(true);
				this.setTableReadOnly(true);
//				this._tableDisable();
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMPOV0020GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.clothID);
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setHeadReadOnly(true);
				this.setTableReadOnly(true);
//				this._tableDisable();
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setHeadReadOnly(true);
				this.setTableReadOnly(true);
//				this._tableDisable();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
			clutil.initUIelement(this.$el);
		},

		setHeadReadOnly: function(readOnly){
			if (readOnly == true){
				clutil.viewReadonly(this.$(".ca_base_form"));
				clutil.viewReadonly(this.$(".ca_table_form"));
				clutil.viewReadonly(this.$(".ca_unitID_div"));
				clutil.viewReadonly(this.$(".ca_poTypeID_div"));
				clutil.viewReadonly(this.$(".ca_seasonTypeID_div"));
				clutil.inputReadonly($("#ca_code"));
				clutil.inputReadonly($("#ca_name"));
				clutil.inputReadonly($("#ca_priceLine"));
			}else{
				clutil.viewRemoveReadonly(this.$(".ca_base_form"));
				clutil.viewRemoveReadonly(this.$(".ca_table_form"));
				clutil.viewRemoveReadonly(this.$(".ca_unitID_div"));
				clutil.viewRemoveReadonly(this.$(".ca_poTypeID_div"));
				clutil.viewRemoveReadonly(this.$(".ca_seasonTypeID_div"));
				clutil.inputRemoveReadonly($("#ca_code"));
				clutil.inputRemoveReadonly($("#ca_name"));
				clutil.inputRemoveReadonly($("#ca_priceLine"));
			}
		},
		setTableReadOnly: function(readOnly){
			var $table = this.$("#ca_table");
			if (readOnly == true){
				$table.find('input[type="text"]').attr("readonly", true);
				$table.find('tbody span.btn-delete').hide();
				$table.find('tbody span.btn-add').hide();
				$table.find('tfoot').hide();

				this.$("#ca_table_tbody").find('.datepicker_wrap').each(function(){
					var $this = $(this);
					clutil.viewReadonly($this);
				});
				/* ウォッシャブルフラグ追加対応 2015/10/28 早川 */
				this.$("#ca_table_tbody").find('.ca_fWashable_div').each(function(){
					var $this = $(this);
					clutil.viewReadonly($this);
				});
				
				var $csv_btn_div = this.$("#ca_csvinput1");
				$csv_btn_div.find('a').removeAttr('disabled');
				$csv_btn_div.find('a').removeAttr('Enable');
				$csv_btn_div.find('a').attr('disabled', true);
				$csv_btn_div.find('a').attr('Enable', false);


				var $csv_btn = this.$('#ca_csv_uptake');
				$csv_btn.removeAttr('disabled');
				$csv_btn.removeAttr('Enable');
				$csv_btn.attr('disabled', true);
				$csv_btn.attr('Enable', false);

				var $csv_btn1 = this.$('#file_csv_uptake');
				$csv_btn1.removeAttr('disabled');
				$csv_btn1.removeAttr('Enable');
				$csv_btn1.attr('disabled', true);
				$csv_btn1.attr('Enable', false);

				clutil.viewReadonly(this.$(".ca_csvinput1"));
				this.$(".ca_csvinput1").hide();
			}else{
				$table.find('input[type="text"]').attr("readonly", false);
				$table.find('tbody span.btn-delete').show();
				$table.find('tbody span.btn-add').show();
				$table.find('tfoot').show();

				this.$("#ca_table_tbody").find('.datepicker_wrap').each(function(){
					var $this = $(this);
					clutil.viewRemoveReadonly($this);
				});
				/* ウォッシャブルフラグ追加対応 2015/10/28 早川 */
				this.$("#ca_table_tbody").find('.ca_fWashable_div').each(function(){
					var $this = $(this);
					clutil.viewRemoveReadonly($this);
				});

				var $csv_btn_div = this.$("#ca_csvinput1");
				$csv_btn_div.find('a').removeAttr('disabled');
				$csv_btn_div.find('a').removeAttr('Enable');
				$csv_btn_div.find('a').attr('disabled', false);
				$csv_btn_div.find('a').attr('Enable', true);


				var $csv_btn = this.$('#ca_csv_uptake');
				$csv_btn.removeAttr('disabled');
				$csv_btn.removeAttr('Enable');
				$csv_btn.attr('disabled', false);
				$csv_btn.attr('Enable', true);

				var $csv_btn1 = this.$('#file_csv_uptake');
				$csv_btn1.removeAttr('disabled');
				$csv_btn1.removeAttr('Enable');
				$csv_btn1.attr('disabled', false);
				$csv_btn1.attr('Enable', true);

				clutil.viewReadonly(this.$(".ca_csvinput1"));
				this.$(".ca_csvinput1").show();
			}

		},

		/**
		 * dataを表示
		 */
		_allData2View : function(getRsp){
			var $tbody = $("#ca_table_tbody");
			_this=this;/* ウォッシャブルフラグ追加対応 2015/10/28 早川 */
			// 行削除
			$tbody.empty();
			$.each(getRsp.clothCodeList, function() {
				var tr = _.template($("#ca_tbody_template").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);


				var $tr = $tbody.find('tr:last');	// 追加した行
				var $inputCode = $tr.find('input[name="clothCodeCode"]');
//				$inputCode.inputlimiter('addlimiter', 'ca_code_limiter', function(value){
//					return $.inputlimiter.Limiters.regex(/[-0-9A-Za-z]+/)(value);
//				});
				$inputCode.val(this.clothCodeCode);
				var $inputName = $tr.find('input[name="clothCodeName"]');
				$inputName.val(this.clothCodeName);
				
				/* ウォッシャブルフラグ追加対応 2015/10/28 早川 */
				var $input = $tr.find('.ca_fWashable_div');
				if ($('#ca_poTypeID').val() != 1 || $('#ca_unitID').val() != 5){/* AOKIメンズ以外 */	
					clutil.viewReadonly($input);
				} else {
					if(this.fWashable == 2){
						$input.find(".ca_fWashable").attr("checked", true).closest("label").addClass("checked");
					}		
				}

				
				var $inputFrom = $tr.find('input[name="fromDate"]');
				clutil.datepicker($inputFrom);
				$inputFrom.datepicker('setIymd', this.fromDate);
				var $inputTo = $tr.find('input[name="toDate"]');
				clutil.datepicker($inputTo);
				$inputTo.datepicker('setIymd', this.toDate);
				var $inputOrdStop = $tr.find('input[name="ordStopDate"]');
				clutil.datepicker($inputOrdStop);
				$inputOrdStop.datepicker('setIymd', this.ordStopDate);
				
				/* 新規作成時はidを付加しない */
				/* 新規作成時のexcel取込でid付加されるのを防止2015/10/28 早川 */
				if (_this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
					this.clothCodeID = 0;
				}
				var $clothCodeID = $tr.find('input[name="clothCodeID"]');
				$clothCodeID.val(this.clothCodeID);	

				if (this.clothCodeID > 0){
					//IDがあるものはコード変更不可にする
					$inputCode.removeAttr('disabled');
					$inputCode.removeAttr('Enable');
					$inputCode.attr('disabled', true);
					$inputCode.attr('Enable', false);
				}
			});
			//ヘッダのPOを見て表示を変更する
			var $POTypeID = this.$("#ca_poTypeID");
			if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				//女性の場合プライスラインは空白にする。
				this.$("#ca_priceLine").val("");
			}
			clutil.initUIelement(this.$el);
			this._reNum();
		},


		/**
		 * テーブルクリア
		 */
		clearTable : function() {
			$("#ca_table_tbody tr").remove();
		},

		/**
		 * 新規作成時にデフォルト空欄表示(1行)
		 */
		makeDefaultTable: function($tbody, $tmpl){
			var _this = this;
			this.clearTable();
			var $tbody = this.$("#ca_table_tbody"),
			$tmpl = this.$("#ca_tbody_template"),
			defArray = new Array,
			i = 0;

//			for (;i < 1;i++){
//			var obj = {
//			};
//			defArray.push(obj);
//			}
			$tmpl.tmpl(defArray).appendTo($tbody);
//			clutil.initUIelement(this.$el);

			// 各項目のオートコンプリート等追加
//			var _this = this;
//			$tbody = this.$("#ca_table_tbody"),
//			$tbody.find("tr").each(function(){
//			this.find('.cl_date').each(function(){
//			var $this = $(this);
//			clutil.datepicker($this);
//			});
//			});
			clutil.initUIelement(this.$el);
			return this;
		},
		/**
		 * 階層レベル振り直し
		 */
		_reNum : function(){
			var $input = this.$("#ca_table_tbody").find('input[name="seq"]');
			$input.each(function(i){
				$(this).val(i + 1);
			});
			return this;
		},
		/**
		 * 行追加処理(tfoot)
		 */
		_onAddLineClick : function(e) {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = $("#ca_tbody_template");
			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
//			if (Number(this.$("input[name='ca_basicFlag']:checked").val()) === 1){
//			addObj.disChk = true;
//			}
			$tmpl.tmpl(addObj).appendTo($tbody);
			var $tr_last = $tbody.find('tr:last');
			//$tr内部にカレンダー部品をセットする。（この時点ですべて運用日）
			$tr_last.find('.cl_date').each(function(){
				var $this = $(this);
				clutil.datepicker($this);
			});
			// 生地番号
			$tr_last.find('input[name="clothCodeCode"]')
			.each(function(){
				var $this = $(this);
//				$this.inputlimiter('addlimiter', 'ca_code_limiter', function(value){
//					return $.inputlimiter.Limiters.regex(/[-0-9A-Za-z]+/)(value);
//				});
			}).end();
			/* ウォッシャブルフラグ追加対応 2015/10/28 早川 */
			//ウォッシャブルフラグ
			$tr_last.find('.ca_fWashable_div')
			.each(function(){
				if ($('#ca_poTypeID').val() != 1 || $('#ca_unitID').val() != 5){/* AOKIメンズ以外 */		
					clutil.viewReadonly($(this));
				}				
			}).end();

			// 適用開始日 運用日翌日
			$tr_last.find('input[name="fromDate"]')
			.each(function(){
				var $this = $(this);
				$this.datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
			}).end();

			// 適用終了日 最大日付
			$tr_last.find('input[name="toDate"]')
			.each(function(){
				var $this = $(this);
				$this.datepicker('setIymd', clcom.max_date);
			}).end();

			// 発注停止日 空白
			$tr_last.find('input[name="ordStopDate"]')
			.each(function(){
				var $this = $(this);
				$this.datepicker('setIymd', -1);
			}).end();

			this._reNum();
//			this.setCompletes(this.$el, $tr_last);
			clutil.initUIelement(this.$el);

			return this;
		},


		/**
		 * 行削除処理
		 */
		_onDeleteLineClick : function(e) {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
					|| this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			$(e.target).parent().parent().remove();
		},
		// CSV取込
		_onCsvUpTakeClick : function() {
			if(!this.validator1.valid()) {
				return;;
			}
			if (this.isReadOnly()) {
				return;
			}

			$("#file_csv_uptake").trigger('click'); // TODO:取込実装
		},

		_PoTypeChange: function(e) {
			var $POTypeID = this.$("#ca_poTypeID");
			var $priceLine =  this.$("#ca_priceLine");
			if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				//レディスのプライスライン入力不可
				clutil.viewClear(this.$(".ca_priceLine_div"));
				clutil.inputReadonly($("#ca_priceLine"));
			}else{
				//それ以外プライスライン入力可
				clutil.inputRemoveReadonly($("#ca_priceLine"));
			}
		},


		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
//			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			this.validator.clear();


//			if(!this.validator.valid()) {
//				return null;
//			}



			var updReq = {};
			/*
			 * 入力値チェック 予約取消時はチェックしない
			 */
			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				// validation
				var f_error = false;
				var _this = this;

				var isBasic = this.$('input[name="ca_basicFlag"]:checked').val() == 1;
				var ope_date = clcom.getOpeDate();
				switch(this.options.opeTypeId){
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					break;
				default:
					break;
				}

				if(!this.validator1.valid()) {
					f_error = true;
				}
//				if(f_error){
//					_this.validator.setErrorHeader(clmsg.cl_echoback);
//					return null;
//				}

			    var result  = clutil.tableview2ValidDataWithStat({
			        $tbody: this.$('#ca_table_tbody'),    // <tbody> の要素を指定する。
			        validator: this.validator2,   // validator インスタンスを指定する。（どこのものでもかまわない）
			        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。
			        	if (
			        			(item.clothCodeCode != null && item.clothCodeCode != "") ||
			        			(item.clothCodeName != null && item.clothCodeName != "") ||
			        			(item.fromDate != "") ||
			        			(item.toDate != "") ||
			        			(item.ordStopDate != "") ) {
			        		return false;
			        	} else {
				            return true;
			        	}
			        }
			    });

				var use_line_cnt = result.items.length; //何行目まで有効かチェック
				var line_cnt = 0;
			    for (var i = 0; i < use_line_cnt; i++){
			    	if(result.stat[i] == "inval"){
			    		f_error = true;
			    	}
			    }
				// 重複チェックも行う
				var chkMap = new Object();
				var i = 0;
				$("#ca_table_tbody").find('tr[name="ca_table_tr"]').each(function(){
					if(use_line_cnt == 0){
						;
					}else if(line_cnt >= use_line_cnt){
						;
					}else{
						line_cnt++;
						var fromDate = 0;
						var toDate = 0;
						var orgStopDate = 0;
						var clothCodeCode;
						var clothCodeName;
						var $tgt = $(this);
						// 適用開始日
						var $fromDate = $tgt.find('input[name="fromDate"]')
						.each(function(){
							fromDate = clutil.dateFormat(this.value, "yyyymmdd");
						});
						// 適用終了日
						var $toDate = $tgt.find('input[name="toDate"]')
						.each(function(){
							toDate = clutil.dateFormat(this.value, "yyyymmdd");
						});
						// 発注停止日
						var $orgStopDate = $tgt.find('input[name="ordStopDate"]')
						.each(function(){
							orgStopDate = clutil.dateFormat(this.value, "yyyymmdd");
						});
						// 生地品番
						var $clothCodeCode = $tgt.find('input[name="clothCodeCode"]')
						.each(function(){
							clothCodeCode = this.value;
						});
						var $clothCodeName = $tgt.find('input[name="clothCodeName"]')
						.each(function(){
							clothCodeName = this.value;
						});
						if (fromDate > toDate){
							f_error = true;
							_this.validator.setErrorMsg( $fromDate, clmsg.cl_date_error);
							_this.validator.setErrorMsg( $toDate, clmsg.cl_date_error);

						}
						if(orgStopDate > 0){
							if (orgStopDate > toDate){
								f_error = true;
								_this.validator.setErrorMsg( $orgStopDate, clmsg.EPO0051);
							}
							//登録時のみ発注停止日と運用日をチェック
							if (_this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
									|| _this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
								/*** 20151104 MT-0902 発注停止日と運用日のチェックはしない
								if (clutil.addDate(clcom.getOpeDate(), 1) > orgStopDate){
									f_error = true;
									_this.validator.setErrorMsg( $orgStopDate, clmsg.EPO0050);
								}
								***/
							}
							if (fromDate > orgStopDate){
								f_error = true;
								_this.validator.setErrorMsg( $orgStopDate, clmsg.EPO0053);
							}
						}
						if(clothCodeName != ""){
							;
						}else{
							f_error = true;
						}
						// 重複チェック
						if(clothCodeCode != ""){
							if(chkMap[clothCodeCode]){
								if(_.isNumber(chkMap[clothCodeCode])){
									_this.validator.setErrorMsg(_this.$("#ca_table_tbody tr:nth-child(" + chkMap[clothCodeCode] + ") input[name='clothCodeCode']"), clutil.fmtargs(clmsg.EGM0009,[clothCodeCode]));
									chkMap[clothCodeCode] = true;
								}
								_this.validator.setErrorMsg(_this.$("#ca_table_tbody tr:nth-child(" + (i+1) + ") input[name='clothCodeCode']"), clutil.fmtargs(clmsg.EGM0009,[clothCodeCode]));
								f_error = true;
							}else{
								chkMap[clothCodeCode] = (i+1);
								_this.validator.clearErrorMsg(_this.$("#ca_table_tbody1 tr:nth-child(" + (i+1) + ") input[name='clothCodeCode']"));
							}
						}else{
							f_error = true;
						}
						i++;
					}
				});

				if(f_error){
					_this.validator.setErrorHeader(clmsg.cl_echoback);
					return null;
				}
				var head = clutil.view2data(this.$('#ca_base_form'));
				var list = clutil.tableview2data(this.$('#ca_table_tbody').children());

				var list2 = new Array;
				$.each(list, function(i){
					if(
							(this.clothCodeCode == null || this.clothCodeCode == "") ||
							(this.clothCodeName == null || this.clothCodeName == "") ||
							(this.fromDate == "") ||
							(this.toDate == "")
					) {
					}else{
					/* ウォッシャブルフラグ追加対応 2015/10/28 早川 */
						var t_fWashable = "0";
						if (this.fWashable == 0){
							t_fWashable = "1";
						} else {
							t_fWashable = "2";
						}
						if ($('#ca_poTypeID').val() != 1 || $('#ca_unitID').val() != 5){/* AOKIメンズ以外 */	
							t_fWashable = "0";
						}
						var obj = {
								clothCodeCode:	this.clothCodeCode,
								clothCodeID:	this.clothCodeID,
								clothCodeName:	this.clothCodeName,
								fWashable:      t_fWashable,
								fromDate:		this.fromDate,
								toDate:			this.toDate,
								ordStopDate:	this.ordStopDate,
								seq: 			this.seq
						};

						list2.push(obj);
					}
				});
				// listへhead情報の適応
				if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
						|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
//					$.each(list, function(){


//					});
				}

				updReq = {
						clothID : head,
						clothCodeList : list2
				};
			} else {
				if(!this.validator.valid()) {
					return null;
				}
				updReq = this.viewSeed;
			}
			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var reqObj = {
					reqHead : reqHead,
					AMPOV0020UpdReq  : updReq
			};
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var getReq = {
					// 共通ヘッダ

					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					// 取引先マスタ検索リクエスト
					AMPOV0020GetReq: {
						srchID: this.options.chkData[pgIndex].id,			// 取引先ID
						delFlag : this.options.chkData[pgIndex].delFlag
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMPOV0020UpdReq: {
					}
			};
			if(opeTypeId ==  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				getReq.reqHead.opeTypeId =  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY;
			}
			return {
				resId: clcom.pageId,	//'AMMSV0320',
				data: getReq
			};
		},

		/**
		 * サンプルファイルダウンロード
		 */
		_onSampleDLClick: function() {
			//this.doCSV(AMMPV0010Req.AMMPV0010_SAMPLE);
			//window.location = "/public/sample/品種別構成比登録サンプル.xlsx";
			clutil.download(this.sampleURL);
		},

		/**
		 * ダウンロード条件をつくる
		 */
		buildReq: function(){
			//指示ID
			var head = clutil.view2data(this.$('#ca_base_form'));
			var list = clutil.tableview2data(this.$('#ca_table_tbody').children());
			var targetList = new Array;

			var last_index = 0;
			var index = 0;
			$.each(list, function(i){
				if((this.clothCodeCode == null || this.clothCodeCode == "")&&
				   (this.clothCodeName == null || this.clothCodeName == "")&&
					this.fromDate <= 0 &&
					this.toDate <= 0 &&
					this.ordStopDate <= 0
					){
					;
				}else{
					last_index=index;
					/* ウォッシャブルフラグ追加対応 2015/10/28 早川 */
					// AOKIメンズ以外は0で渡す
					if ($('#ca_poTypeID').val() != 1 || $('#ca_unitID').val() != 5){
						this.fWashable = "0";
					} else{
						if (this.fWashable) {
							this.fWashable = "2";
						} else {
							this.fWashable = "1";
						}
					}
				}
				index++;
			});
			index = 0;
			$.each(list, function(i){
				if(last_index < index){
				}else{
					targetList.push(this);
				}
				index++;
			});



			// 検索条件
			var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					AMPOV0020GetReq: {
					},
					AMPOV0020UpdReq: {
						clothID : head,
						clothCodeList : targetList
					}
			};
			return req;
		},
		/**
		 * ダウンロードする
		 */
		_onCSVClick: function(){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
//				this.srchAreaCtrl.show_srch();
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMPOV0020', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},
		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
//			var rec = data.AMPOV0020GetRsp;
//			delete rec.orgfunc.fromDate;
//			delete rec.orgfunc.toDate;
//			$.each(rec.orglevelList, function(){
//			delete this.fromDate;
//			delete this.toDate;
//			delete this.orglevelCode;
//			});
			return data;
		},
		
		/* ウォッシャブルフラグ追加対応 2015/10/28 早川 */
		/**
		 * PO種別変更または事業ユニット変更時の処理
		 */
		_onChangePoTypeID_UnitID: function(){
			if ($('#ca_poTypeID').val() == 1 && $('#ca_unitID').val() == 5){/* AOKIメンズのみウォッシャブルが触れる */
				var $tbody = this.$("#ca_table_tbody");
				$tbody.find('tr')
				.each(function(){
					$selector=$(this).find('input[name="ca_fWashable"]');
					$selector.val(0);
					$(this).find('.ca_fWashable_div').each(function(){
						var $this = $(this);
						clutil.viewRemoveReadonly($this);
					});
					
				}).end();
			} else {/* AOKIメンズ以外はウォッシャブルのチェックを全て外しリードオンリー */
				var $tbody = this.$("#ca_table_tbody");
				$tbody.find('tr')
				.each(function(){
					$selector=$(this).find('input[name="ca_fWashable"]');
					$selector.val(0);
					$(this).find('.ca_fWashable_div').each(function(){
						var $this = $(this);
						$this.find(".ca_fWashable").attr("checked", false).closest("label").removeClass("checked");
						clutil.viewReadonly($this);
					});
				}).end();
			}
		},
		/**
		 * シーズンセレクター作成
		 */
		 /* seasonSelectorListに内容物が入っている前提で使う 2015/10/29 */
		makeSeasonSel:function($el){
			var opt = {
					$select	:$el,
					list:seasonSelectorList,
					unselectedflag:true,
					selectpicker: {
						noButton: false
					}
			};
			clutil.cltypeselector3(opt);
		},
	});



//	初期データを取る
	clutil.getIniJSON(null, null).done(function(data, dataType) {
		var initUIElementBlockVar;
		/* シーズンセレクタの内容を受け取る 2015/10/29 早川 0270画面からコピー */
		var srchReq = {
				// 20150808 藤岡 cond:シーズンはHist型でないので意味のないリクエスト
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				cond :{
					srchFromDate: 0,
					srchToDate: 0,
				}
		};
		initUIElementBlockVar = clutil.postJSON('am_pa_poseason_srch', srchReq).done(_.bind(function(data){
			var recs = data.list;
			var list = [];
			if(_.isEmpty(recs)){
				;
			}else{
				$.each(recs, function() {
					var cn = {
							id: this.id,
							code: this.code,
							name: this.name
					};
					list.push(cn);
				});
			}
			seasonSelectorList = list;
		}, this)).fail(_.bind(function(data){
		}, this));
		
		/* シーズンセレクタの内容物を受け取るまで処理を待機 */
		$.when(initUIElementBlockVar).done(function(e){
			ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
		});
		
	}).fail(function(data){
		// clcom のネタ取得に失敗。
		clutil.View.doAbort({
			messages: [
			           //'初期データ取得に失敗しました。'
			           clutil.getclmsg('cl_ini_failed')
			           ],
			           rspHead: data.rspHead
		});
	});
});
