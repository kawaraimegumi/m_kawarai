useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	clutil.enterFocusMode($('body'));
	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_table .btn-delete" : "_onDeleteLineClick",
			"click #ca_table tbody tr span.btn-add" : "_onAddLineBeforeClick",
			"click #ca_table tfoot tr:last" : "_onAddLineClick",
//			"click #ca_csv_uptake" 		: "_onCsvUpTakeClick", 		//TODO:取込実装
			"change #ca_unitID" 			: "_UnitTypeChange",
			"change #ca_poTypeID" 			: "_PoTypeChange",
//			"change #ca_clothIDID" 			: "_ClothIDIDChange"
			"click .cl_download" : "_onCSVClick",

			"click #ca_sample_download"		: "_onSampleDLClick"		// ExcelサンプルDLボタン押下
		},

		sampleURL: "/public/sample/ＰＯ発注先サンプル.xlsx",

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
						title: 'ＰＯ発注先',
						opeTypeId: o.opeTypeId,
						pageCount: o.chkData.length,
//						btn_csv: true,
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

			// *アプリ個別の View や部品をインスタンス化するとか・・・*			// CSV取込
//			this.fileInput = clutil.fileInput({
//				files: [],
//				fileInput: "#ca_csvinput1",
//				showDialogOnSuccess : false,
//				showDialogOnError : false
//			});

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
//				// シーズンは検索条件ではなく表示項目になったので
//				// seasonTypeIDに文字列が入るのでそれの会費を行う
//				srchReq.seasonTypeID = 0;
//				request.AMPOV0110UpdReq = {};
//				request.AMPOV0110UpdReq.clothOrder = srchReq;
//				var reqHead = {
//						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT,
//						fileId: file.id,
//				};
//				request.reqHead = reqHead;
//
//				var url = "AMPOV0110";
//				clutil.postJSON(url, request).done(_.bind(function(data,dataType){
//					if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
//						//成功時処理
//						//テーブルクリア
//						this.clearTable();
//						//テーブル追加
//						var getRsp = data.AMPOV0110GetRsp;
//						this._allData2Table(getRsp);
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
			this.validator1 = clutil.validator(this.$("#ca_base_form"), {
				echoback : $('.cl_echoback')
			});
			this.validator2 = clutil.validator(this.$("#ca_table_tbody"), {
				echoback : $('.cl_echoback')
			});


			return this;
		},

		initUIelement : function(){
			var _this = this;
			// 初期データ取得後に呼ばれる関数
			this.mdBaseView.initUIElement();

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'));

			// ＰＯ種別
			clutil.cltypeselector(this.$("#ca_poTypeID"), amcm_type.AMCM_TYPE_PO_CLASS);

			var $POTypeID = this.$("#ca_poTypeID");
			var $UnitID = this.$("#ca_unitID");
//			clutil.clpoclothid(this.$("#ca_clothIDID"), {
			this.poclothIdField = clutil.clpoclothid(this.$("#ca_clothIDID"), {
				dependAttrs :{
					unit_id: function() {
						return $UnitID.val();
					},
					poTypeID: function() {
						return $POTypeID.val();
					}
				}
			});
			this.listenTo(this.poclothIdField, "change", this._ClothIDIDChange);
			$("#ca_tp_code").tooltip({html: true});
			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {};
					var srchReq = clutil.view2data(this.$("#ca_base_form"));
					// シーズンは検索条件ではなく表示項目になったので
					// seasonTypeIDに文字列が入るのでそれの会費を行う
					srchReq.seasonTypeID = 0;
					request.AMPOV0110UpdReq = {};
					request.AMPOV0110UpdReq.clothOrder = srchReq;
					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMPOV0110',
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
					var getRsp = data.AMPOV0110GetRsp;
					_this._allData2Table(getRsp);
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
//			clutil.mediator.trigger('onTicker', data);
				// ヘッダーにメッセージを表示
				_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				_this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				if (data.rspHead.uri){
					//エラーCSVのダウンロード実行
					clutil.download(data.rspHead.uri);
				}
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで
			return this;
		},

		render : function(){
			this.$("#ca_unitID").val(clcom.userInfo.unit_id);
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				//入力欄制御
				this.setHeadReadOnly(false);
				// テーブル設定
				this.clearTable(this.$("#ca_table_tbody tr"));
				this.makeDefaultTable(this.$("#ca_table_tbody"), this.$("#ca_tbody_template"));
				this._PoTypeChange();
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
//					this.options.chkData[args.index].fromDate = args.data.AMPOV0110GetRsp.orgfunc.fromDate;
				}
				this.setHeadReadOnly(true);
				this.setTableReadOnly(true);
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.setHeadReadOnly(true);
				this.setTableReadOnly(true);
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				this.setHeadReadOnly(true);
				this.setTableReadOnly(true);
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.validator.setErrorInfoToTable({
					$table: this.$('#ca_table'),
					fieldMessages: data.rspHead.fieldMessages,
					struct_name: 'makerList',
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
				var getRsp = data.AMPOV0110GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.clothOrder);
				//201410 基本情報が2か所に分かれたのでdata2viewを2か所に行う
				clutil.data2view(this.$('#ca_consult_form'), getRsp.clothOrder);
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2Head(getRsp);
				this._allData2Table(getRsp);

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
					this.setHeadReadOnly(true);
				clutil.viewRemoveReadonly(this.$(".ca_stDate_div"));
				clutil.viewRemoveReadonly(this.$(".ca_edDate_div"));
				clutil.viewRemoveReadonly(this.$(".ca_ordStopDate_div"));
				if ($("#ca_table").find('input[name="brandID"]').length > 0){
					clutil.setFocus($($("#ca_table").find('input[name="brandID"]')[0]));
				}
				break;
				}
				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
//				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.cl_sys_db_other)});
				var getRsp = data.AMPOV0110GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.clothOrder);
				//201410 基本情報が2か所に分かれたのでdata2viewを2か所に行う
				clutil.data2view(this.$('#ca_consult_form'), getRsp.clothOrder);
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2Head(getRsp);
				this._allData2Table(getRsp);
				this.setTableReadOnly(true);
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setHeadReadOnly(true);

//				this._tableDisable();
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMPOV0110GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.clothOrder);
				//201410 基本情報が2か所に分かれたのでdata2viewを2か所に行う
				clutil.data2view(this.$('#ca_consult_form'), getRsp.clothOrder);
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2Head(getRsp);
				this._allData2Table(getRsp);
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setHeadReadOnly(true);
				this.setTableReadOnly(true);
//				this._tableDisable();
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMPOV0110GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.clothOrder);
				//201410 基本情報が2か所に分かれたのでdata2viewを2か所に行う
				clutil.data2view(this.$('#ca_consult_form'), getRsp.clothOrder);
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2Head(getRsp);
				this._allData2Table(getRsp);
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
				clutil.viewReadonly(this.$(".ca_unitID_div"));
				clutil.viewReadonly(this.$(".ca_poTypeID_div"));
				clutil.inputReadonly($("#ca_clothIDID"));
			}else{
				clutil.viewRemoveReadonly(this.$(".ca_base_form"));
				clutil.viewRemoveReadonly(this.$(".ca_unitID_div"));
				clutil.viewRemoveReadonly(this.$(".ca_poTypeID_div"))
				clutil.inputRemoveReadonly($("#ca_clothIDID"));
			}
			clutil.inputReadonly($("#ca_priceLine"));
			clutil.inputReadonly($("#ca_seasonTypeID"));
		},
		setTableReadOnly: function(readOnly){
			var $table = this.$("#ca_table");
			if (readOnly == true){
				clutil.viewReadonly($table);
//				$table.find('input[type="text"]').attr("readonly", true);
				$table.find('tbody span.btn-delete').hide();
				$table.find('tbody span.btn-add').hide();
				$table.find('tfoot').hide();
//
//				this.$("#ca_table_tbody").find('.datepicker_wrap').each(function(){
//					var $this = $(this);
//					clutil.viewReadonly($this);
//				});

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

//				var $csv_btn1 = this.$('#file_csv_uptake');
//				$csv_btn1.removeAttr('disabled');
//				$csv_btn1.removeAttr('Enable');
//				$csv_btn1.attr('disabled', true);
//				$csv_btn1.attr('Enable', false);

				clutil.viewReadonly(this.$(".ca_csvinput1"));
				this.$(".ca_csvinput1").hide();
			}else{
				clutil.viewRemoveReadonly($table);
//				$table.find('input[type="text"]').attr("readonly", false);
				$table.find('tbody span.btn-delete').show();
				$table.find('tbody span.btn-add').show();
				$table.find('tfoot').show();
//
//				this.$("#ca_table_tbody").find('.datepicker_wrap').each(function(){
//					var $this = $(this);
//					clutil.viewRemoveReadonly($this);
//				});

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

//				var $csv_btn1 = this.$('#file_csv_uptake');
//				$csv_btn1.removeAttr('disabled');
//				$csv_btn1.removeAttr('Enable');
//				$csv_btn1.attr('disabled', false);
//				$csv_btn1.attr('Enable', true);

				clutil.viewReadonly(this.$(".ca_csvinput1"));
				this.$(".ca_csvinput1").show();
			}

		},

		/**
		 * dataを表示
		 */
		_allData2Head : function(getRsp){
			//ヘッダ部の生地IDはオートコンプリートのためdata2viewでうまく入らないのでここで入れる。
			var clothIDRec = {
					id		: getRsp.clothOrder.clothIDID,
					name	: getRsp.clothOrder.clothIDName,
					code	: getRsp.clothOrder.clothIDCode,
			};
			this.$("#ca_clothIDID").autocomplete('clAutocompleteItem', clothIDRec);

			var $POTypeID = this.$("#ca_poTypeID");
			if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				//女性の場合プライスラインは空白にする。
				this.$("#ca_priceLine").val("");
			}
			this.$("#ca_seasonTypeID").val( clutil.gettypename(amcm_type.AMCM_TYPE_SEASON, getRsp.clothOrder.seasonTypeID, 1) );
		},
		_allData2Table : function(getRsp){
			var $tbody = $("#ca_table_tbody");
			var $POTypeID = this.$("#ca_poTypeID");
			var $UnitID = this.$("#ca_unitID");

			var POTypeID_val = $POTypeID.val();

			if (POTypeID_val == amcm_type.AMCM_VAL_PO_CLASS_LADYS) {
				$("#ca_thead_brand").text("親ブランド");
			} else {
				$("#ca_thead_brand").text("ブランド");
			}

			// 行削除
			$tbody.empty();
			$.each(getRsp.makerList, function() {
				var brandRec = {
						id		: this.brandID,
						name	: this.brandName,
						code	: this.brandCode,
				};
				var makerRec = {
						id		: this.makerID,
						name	: this.makerName,
						code	: this.makerCode,
				};
				var stgrpRec = {
						id		: this.stgrpID,
						name	: this.stgrpName,
						code	: this.stgrpCode,
				};
				var calenRec = {
						id		: this.calenID,
						name	: this.calenName,
						code	: this.calenCode,
				};
				var tr = _.template($("#ca_tbody_template").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);

				var $tr = $tbody.find('tr:last');	// 追加した行
				var $inputBrand = $tr.find('input[name="brandID"]');
				var $inputMaker = $tr.find('input[name="makerID"]');
				var $inputStgrp = $tr.find('input[name="stgrpID"]');
				var $inputCalen = $tr.find('input[name="calenID"]');
				var $inputSt = $tr.find('input[name="stDate"]');
				clutil.datepicker($inputSt);
				$inputSt.datepicker('setIymd', this.stDate);
				var $inputEd = $tr.find('input[name="edDate"]');
				clutil.datepicker($inputEd);
				$inputEd.datepicker('setIymd', this.edDate);
				var $inputOrdStop = $tr.find('input[name="ordStopDate"]');
				clutil.datepicker($inputOrdStop);
				$inputOrdStop.datepicker('setIymd', this.ordStopDate);
				//あとはオートコンプリートに合わせて入れるだけ

				if (POTypeID_val == amcm_type.AMCM_VAL_PO_CLASS_LADYS) {
					clutil.clpoparentbrand($inputBrand, {
						dependAttrs :{
							unit_id: function() {
								return $UnitID.val();
							},
							poTypeID: function() {
								return $POTypeID.val();
							}
						}
					});
				} else {
					clutil.clpobrandcode($inputBrand, {
						dependAttrs :{
							unit_id: function() {
								return $UnitID.val();
							},
							poTypeID: function() {
								return $POTypeID.val();
							}
						}
					});
				}
				clutil.clpomaker($inputMaker,{
					dependAttrs :{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return $POTypeID.val();
						}
					}
				});
				clutil.clpostgrpcode($inputStgrp,{
					dependAttrs :{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return $POTypeID.val();
						}
					}
				});
				clutil.clpocalencode($inputCalen, {
					dependAttrs :{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return $POTypeID.val();
						}
					}
				});
				// 改めてデータをセット
				$inputBrand.autocomplete('clAutocompleteItem', brandRec);
				$inputMaker.autocomplete('clAutocompleteItem', makerRec);
				$inputStgrp.autocomplete('clAutocompleteItem', stgrpRec);
				$inputCalen.autocomplete('clAutocompleteItem', calenRec);

			});
			clutil.initUIelement(this.$el);
			this._reNum();
		},

		/**
		 *  テーブルにオートコンプリートを実装する
		 */
		setCompletes : function($tr){
			var $POTypeID = this.$("#ca_poTypeID");
			var $UnitID = this.$("#ca_unitID");

			var POTypeID_val = $POTypeID.val();
			// ブランド
			$tr.find('input[name="brandID"]')
			.each(function(){
				if (POTypeID_val == amcm_type.AMCM_VAL_PO_CLASS_LADYS) {
					clutil.clpoparentbrand($(this), {
						dependAttrs :{
							unit_id: function() {
								return $UnitID.val();
							},
							poTypeID: function() {
								return $POTypeID.val();
							}
						}
					});
				} else {
					clutil.clpobrandcode($(this), {
						dependAttrs:{
							unit_id: function() {
								return $UnitID.val();
							},
							poTypeID: function() {
								return $POTypeID.val();
							}
						}
					});
				}
			});

			$tr.find('input[name="makerID"]')
			.each(function(){
				clutil.clpomaker($(this), {
					dependAttrs:{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return $POTypeID.val();
						}
					}
				});
			});

			$tr.find('input[name="stgrpID"]')
			.each(function(){
				clutil.clpostgrpcode($(this), {
					dependAttrs:{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return $POTypeID.val();
						}
					}
				});
			});

			$tr.find('input[name="calenID"]')
			.each(function(){
				clutil.clpocalencode($(this), {
					dependAttrs:{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return $POTypeID.val();
						}
					}
				});
			});

			return $tr;
		},

		/**
		 * テーブルクリア
		 */
		clearTable : function() {
			$("#ca_table_tbody tr").remove();
		},
		//PO種別、事業ユニットが変わった際はテーブルは空にする。
		_PoTypeChange: function(e) {
			this.clearTable();
			this.$("#ca_clothIDID").val("");
			this.$("#ca_priceLine").val("");
			this.$("#ca_seasonTypeID").val("");
			var $POTypeID = this.$("#ca_poTypeID");
			var $table = this.$("#ca_table");
			var val = $POTypeID.val();
			if ($POTypeID.val() <= 0){
				clutil.viewReadonly($("#ca_clothIDID_div"));
				$table.find('input[type="text"]').attr("readonly", true);
				$table.find('tbody span.btn-delete').hide();
				$table.find('tbody span.btn-add').hide();
				$table.find('tfoot').hide();
			}else{
				clutil.viewRemoveReadonly($("#ca_clothIDID_div"));
				$table.find('input[type="text"]').attr("readonly", false);
				$table.find('tbody span.btn-delete').show();
				$table.find('tbody span.btn-add').show();
				$table.find('tfoot').show();

				if (val == amcm_type.AMCM_VAL_PO_CLASS_LADYS) {
					$("#ca_thead_brand").text("親ブランド");
				} else {
					$("#ca_thead_brand").text("ブランド");
				}
			}
			clutil.initUIelement(this.$el);
		},
		_UnitTypeChange: function(e) {
			this.clearTable();
			this.$("#ca_clothIDID").val("");
			this.$("#ca_priceLine").val("");
			this.$("#ca_seasonTypeID").val("");
			var $unitID = this.$("#ca_unitID");
			var $table = this.$("#ca_table");
			if ($unitID.val() <= 0){
				clutil.viewReadonly($("#ca_clothIDID_div"));
				$table.find('input[type="text"]').attr("readonly", true);
				$table.find('tbody span.btn-delete').hide();
				$table.find('tbody span.btn-add').hide();
				$table.find('tfoot').hide();
			}else{
				clutil.viewRemoveReadonly($("#ca_clothIDID_div"));
				$table.find('input[type="text"]').attr("readonly", false);
				$table.find('tbody span.btn-delete').show();
				$table.find('tbody span.btn-add').show();
				$table.find('tfoot').show();
			}
			clutil.initUIelement(this.$el);
		},
//		_ClothIDIDChange: function(e) {
		_ClothIDIDChange: function(item) {
			console.log(item);
			var $POTypeID = this.$("#ca_poTypeID");
			if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				//女性の場合プライスラインは空白にする。
				this.$("#ca_priceLine").val("");
			}else{
				this.$("#ca_priceLine").val( clutil.comma(item.priceline));
			}
			this.$("#ca_seasonTypeID").val( clutil.gettypename(amcm_type.AMCM_TYPE_SEASON, item.seasonTypeID, 1) );
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

//			for (;i < 0;i++){
//			var obj = {
//			editable:true,
//			canAdd:true,
//			disChk:false,
//			disEdit:false
//			};
//			defArray.push(obj);
//			}
			$tmpl.tmpl(defArray).appendTo($tbody);

			// 各項目のオートコンプリート等追加
//			var _this = this;
//			var _this = this;
//			$tbody.find("tr").each(function(){
//			_this.setCompletes($(this));
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
			this.setCompletes($tr_last);
			//$tr内部にカレンダー部品をセットする。（この時点ですべて運用日）
			$tr_last.find('.cl_date').each(function(){
				var $this = $(this);
				clutil.datepicker($this);
			});
			// 適用開始日 運用日翌日
			$tr_last
			.find('input[name="stDate"]')
			.each(function(){
				var $this = $(this);
				$this.datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
			}).end();

			// 適用終了日 最大日付
			$tr_last.find('input[name="edDate"]')
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
//		_onCsvUpTakeClick : function() {
//			if (this.isReadOnly()) {
//				return;
//			}
//
//			$("#file_csv_uptake").trigger('click'); // TODO:取込実装
//		},
//		isValidTable: function() {
//			var f_valid = true;
//			// テーブル領域エラーチェック
//			// テーブルデータを取りながら、行末空欄スキップと、入力チェックを行う。
//		    var items = clutil.tableview2ValidData({
//		        $tbody: this.$('#ca_table_tbody'),    // <tbody> の要素を指定する。
//		        validator: this.validator,   // validator インスタンスを指定する。（どこのものでもかまわない）
//		        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。
//		        	if (
//		        			//オートコンプリートのゴミデータに反応できない
//							(item.brandID != null ) ||
//							(item.makerID != null ) ||
//							(item.stgrpID != null ) ||
//							(item.calenID != null ) ||
//		        			(item._view2data_brandID_cn != null && item._view2data_brandID_cn.id != 0) ||
//		        			(item._view2data_makerID_cn != null && item._view2data_makerID_cn.id != 0) ||
//		        			(item._view2data_stgrpID_cn != null && item._view2data_stgrpID_cn.id != 0) ||
//		        			(item._view2data_calenID_cn != null && item._view2data_calenID_cn.id != 0) ||
//		        			(item.stDate != "") ||
//		        			(item.edDate != "") ||
//		        			(item.ordStopDate != "") ) {
//		        		return false;
//		        	} else {
//			            return true;
//		        	}
//		        }
//		    });
//		    if(_.isEmpty(items)){
//		        // 全部空欄行だったとか・・・
//		        clutil.mediator.trigger('onTicker',clmsg.EGM0024);
//		        f_valid = false;
//		    }
//		    return f_valid;
//		},
		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
//			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');



			var f_error0 = false;
			var f_error = false;

//			if(!this.validator.valid()) {
//				f_error = true;
//			}

			var updReq = {};
			/*
			 * 入力値チェック 予約取消時はチェックしない
			 */
			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				// validation
				f_error0 = false;
				f_error = false;

				this.validator.clear();
				this.validator1.clear();
				this.validator2.clear();
				var _this = this;

				var isBasic = this.$('input[name="ca_basicFlag"]:checked').val() == 1;
				var ope_date = clcom.getOpeDate();

				if(!this.validator1.valid()) {
					f_error0 = true;
				}
//				if(!this.validator2.valid()) {
//					f_error0 = true;
//				}

				var $tgt = $(this);

//				if (!this.isValidTable()) {
//					f_error = true;
//				}

//				if(f_error || f_error0){ // エラーチェック毎にメッセージが決まっている⇒複数ある場合、一気に表示できていない。
//					return null;
//				}

			    var result  = clutil.tableview2ValidDataWithStat({
			        $tbody: this.$('#ca_table_tbody'),    // <tbody> の要素を指定する。
			        validator: this.validator,   // validator インスタンスを指定する。（どこのものでもかまわない）
			        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。
			        	if (
			        			//オートコンプリートのゴミデータに反応できない
								(item.brandID != null ) ||
								(item.makerID != null ) ||
								(item.stgrpID != null ) ||
								(item.calenID != null ) ||
			        			(item._view2data_brandID_cn != null && item._view2data_brandID_cn.id != 0) ||
			        			(item._view2data_makerID_cn != null && item._view2data_makerID_cn.id != 0) ||
			        			(item._view2data_stgrpID_cn != null && item._view2data_stgrpID_cn.id != 0) ||
			        			(item._view2data_calenID_cn != null && item._view2data_calenID_cn.id != 0) ||
			        			(item.stDate != "") ||
			        			(item.edDate != "") ||
			        			(item.ordStopDate != "") ) {
			        		return false;
			        	} else {
				            return true;
			        	}
			        }
			    });


				var head = clutil.view2data(this.$('#ca_base_form'));
				var list = clutil.tableview2data(this.$('#ca_table_tbody').children());
				// シーズンは検索条件ではなく表示項目になったので
				// seasonTypeIDに文字列が入るのでそれの回避を行う
				head.seasonTypeID = 0;
				var use_line_cnt = result.items.length-1; //何行目まで有効かチェック
				var line_cnt;
			    for (var i = 0; i < result.items.length; i++){
			    	if(result.stat[i] == "inval"){
			    		f_error = true;
			    	}
			    }
//				for(var i = 0; i < list.length; i++){
//					var rec = list[i];
//					if(
//							(rec.brandID != null ) ||
//							(rec.makerID != null ) ||
//							(rec.stgrpID != null ) ||
//							(rec.calenID != null ) ||
//							(rec._view2data_brandID_cn != null && rec._view2data_brandID_cn.id != 0) ||
//							(rec._view2data_makerID_cn != null && rec._view2data_makerID_cn.id != 0) ||
//							(rec._view2data_stgrpID_cn != null && rec._view2data_stgrpID_cn.id != 0) ||
//							(rec._view2data_calenID_cn != null && rec._view2data_calenID_cn.id != 0) ||
//							(rec.stDate != "") ||
//							(rec.edDate != "") ||
//							(rec.ordStopDate != "")
//					) {
//						//空行以外
//						use_line_cnt = i;
//					}
//				}
				line_cnt = 0;
				$("#ca_table_tbody").find('input[name="brandID"]').each(function(){
					if(use_line_cnt == 0){
						;
					}else if(line_cnt > use_line_cnt){
						;
					}else{
						line_cnt++;
						var $tgt = $(this);
						var item = $tgt.autocomplete('clAutocompleteItem');
						if((!$tgt.autocomplete('isValidClAutocompleteSelect')) || item == null){
							// エラーメッセージを通知。
							_this.validator.setErrorMsg($tgt, clmsg.EPO0017);

							f_error = true;
						} else {
							_this.validator.clearErrorMsg($tgt);
						}
					}
				});
				line_cnt = 0;
				$("#ca_table_tbody").find('input[name="makerID"] ').each(function(){
					if(use_line_cnt == 0){
						;
					}else if(line_cnt > use_line_cnt){
						;
					}else{
						line_cnt++;
						var $tgt = $(this);
						var item = $tgt.autocomplete('clAutocompleteItem');
						if((!$tgt.autocomplete('isValidClAutocompleteSelect')) || item == null){
							// エラーメッセージを通知。
							_this.validator.setErrorMsg($tgt, clmsg.EPO0018);

							f_error = true;
						} else {
							_this.validator.clearErrorMsg($tgt);
						}
					}
				});
				line_cnt = 0;
				$("#ca_table_tbody").find('input[name="stgrpID"]').each(function(){
					if(use_line_cnt == 0){
						;
					}else if(line_cnt > use_line_cnt){
						;
					}else{
						line_cnt++;
						var $tgt = $(this);
						var item = $tgt.autocomplete('clAutocompleteItem');
						if((!$tgt.autocomplete('isValidClAutocompleteSelect')) || item == null){
							// エラーメッセージを通知。
							_this.validator.setErrorMsg($tgt, clmsg.EPO0019);

							f_error = true;
						} else {
							_this.validator.clearErrorMsg($tgt);
						}
					}
				});
				line_cnt = 0;
				$("#ca_table_tbody").find('input[name="calenID"]').each(function(){
					if(use_line_cnt == 0){
						;
					}else if(line_cnt > use_line_cnt){
						;
					}else{
						line_cnt++;
						var $tgt = $(this);
						var item = $tgt.autocomplete('clAutocompleteItem');
						if((!$tgt.autocomplete('isValidClAutocompleteSelect')) || item == null){
							// エラーメッセージを通知。
							_this.validator.setErrorMsg($tgt, clmsg.EPO0020);

							f_error = true;
						} else {
							_this.validator.clearErrorMsg($tgt);
						}
					}
				});
				//重複チェック
				chkMap = new Object();
				for(var i = 0; i < list.length; i++){
					var rec = list[i];
					// 空欄チェック 空白についてはそれ以前にチェックしているのでここでは重複判定対象の
					if(rec.brandID == null){
						continue;
					}
					if(rec.stgrpID == null){
						continue;
					}
					if(rec._view2data_brandID_cn == null || rec._view2data_stgrpID_cn == null){
						continue;
					}

					// 重複チェック
					var key = rec._view2data_brandID_cn.id + "_" + rec._view2data_stgrpID_cn.id;
					if(chkMap[key]){
						if(_.isNumber(chkMap[key])){
							this.validator.setErrorMsg(this.$("#ca_table_tbody tr:nth-child(" + chkMap[key] + ") input[name='brandID']"),
									clutil.fmtargs(clmsg.EPO0016, [
									                               rec._view2data_brandID_cn.code,
									                               rec._view2data_brandID_cn.name,
									                               rec._view2data_stgrpID_cn.code,
									                               rec._view2data_stgrpID_cn.name,
									                               ]));
							this.validator.setErrorMsg(this.$("#ca_table_tbody tr:nth-child(" + chkMap[key] + ") input[name='stgrpID']"),
									clutil.fmtargs(clmsg.EPO0016, [
									                               rec._view2data_brandID_cn.code,
									                               rec._view2data_brandID_cn.name,
									                               rec._view2data_stgrpID_cn.code,
									                               rec._view2data_stgrpID_cn.name,
									                               ]));
							chkMap[key] = true;
						}
						this.validator.setErrorMsg(this.$("#ca_table_tbody tr:nth-child(" + (i + 1) + ") input[name='brandID']"),
								clutil.fmtargs(clmsg.EPO0016, [
								                               rec._view2data_brandID_cn.code,
								                               rec._view2data_brandID_cn.name,
								                               rec._view2data_stgrpID_cn.code,
								                               rec._view2data_stgrpID_cn.name,
								                               ]));
						this.validator.setErrorMsg(this.$("#ca_table_tbody tr:nth-child(" + (i + 1) + ") input[name='stgrpID']"),
								clutil.fmtargs(clmsg.EPO0016, [
								                               rec._view2data_brandID_cn.code,
								                               rec._view2data_brandID_cn.name,
								                               rec._view2data_stgrpID_cn.code,
								                               rec._view2data_stgrpID_cn.name,
								                               ]));
						f_error = true;
						continue;
					}
					chkMap[key] = (i+1);
					this.validator.clearErrorMsg(this.$("#ca_table_tbody tr:nth-child(" + chkMap[key] + ") "));
				}
				$("#ca_table_tbody").find('tr[name="ca_table_tr"]').each(function(){
					var stDate = 0;
					var edDate = 0;
					var orgStopDate = 0;
					var $tgt = $(this);
					// 適用開始日
					var $stDate = $tgt.find('input[name="stDate"]')
					.each(function(){
						stDate = clutil.dateFormat(this.value, "yyyymmdd");
					});
					// 適用終了日
					var $edDate = $tgt.find('input[name="edDate"]')
					.each(function(){
						edDate = clutil.dateFormat(this.value, "yyyymmdd");
					});
					// 発注停止日
					var $orgStopDate = $tgt.find('input[name="ordStopDate"]')
					.each(function(){
						orgStopDate = clutil.dateFormat(this.value, "yyyymmdd");
					});
					if (stDate > edDate){
						f_error = true;
						_this.validator.setErrorMsg( $stDate, clmsg.cl_date_error);
						_this.validator.setErrorMsg( $edDate, clmsg.cl_date_error);

					}
					if(orgStopDate > 0){
						if (orgStopDate > edDate){
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
						if (stDate > orgStopDate){
							f_error = true;
							_this.validator.setErrorMsg( $orgStopDate, clmsg.EPO0053);
						}
					}
				});

				try{
					this.mdBaseView.setAutoValidate(false);
					if(f_error0){
						// valid() -- NG
						clutil.setFocus(this.$el.find('.cl_error_field').first());
						return null;
					}
					if(f_error){
						// 独自チェック -- NG
						clutil.mediator.trigger('onTicker',clmsg.cl_echoback);
						clutil.setFocus(this.$el.find('.cl_error_field').first());
						return null;
					}
				}finally{
					this.mdBaseView.setAutoValidate(true);
				}

				var makerList = new Array;


				// listへhead情報の適応
				if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
						|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
//					$.each(list, function(){


//					});
				}
				$.each(list, function(i){
					if(
							(this._view2data_brandID_cn == null || this._view2data_brandID_cn.id == 0) ||
							(this._view2data_makerID_cn == null || this._view2data_makerID_cn.id == 0) ||
							(this._view2data_stgrpID_cn == null || this._view2data_stgrpID_cn.id == 0) ||
							(this._view2data_calenID_cn == null || this._view2data_calenID_cn.id == 0)
					) {
					}else{
						var obj = {
								brandID		: this._view2data_brandID_cn.id,
								brandName	: this._view2data_brandID_cn.name,
								brandCode	: this._view2data_brandID_cn.code,
								makerID		: this._view2data_makerID_cn.id,
								makerName	: this._view2data_makerID_cn.name,
								makerCode	: this._view2data_makerID_cn.code,
								stgrpID		: this._view2data_stgrpID_cn.id,
								stgrpName	: this._view2data_stgrpID_cn.name,
								stgrpCode	: this._view2data_stgrpID_cn.code,
								calenID		: this._view2data_calenID_cn.id,
								calenName	: this._view2data_calenID_cn.name,
								calenCode	: this._view2data_calenID_cn.code,
								stDate		: this.stDate,
								edDate		: this.edDate,
								ordStopDate	: this.ordStopDate,
								seq			: this.seq,
						};

						makerList.push(obj);
					}
				});

				updReq = {
						clothOrder : head,
						makerList : makerList
				};
			} else {
				if(!this.validator.valid()) {
					f_error = true;
				}

				if(f_error || f_error0){
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
					AMPOV0110UpdReq  : updReq
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
					AMPOV0110GetReq: {
						srchID: this.options.chkData[pgIndex].id,			// 取引先ID
						delFlag : this.options.chkData[pgIndex].delFlag
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMPOV0110UpdReq: {
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
		 * ダウンロード条件をつくる
		 */
		buildReq: function(){
			//指示ID
			var head = clutil.view2data(this.$('#ca_base_form'));
			var list = clutil.tableview2data(this.$('#ca_table_tbody').children());
			var makerList = new Array;

			var last_index = 0;
			var index = 0;
			$.each(list, function(i){
				if(this._view2data_brandID_cn == null &&
					this._view2data_makerID_cn == null &&
					this._view2data_stgrpID_cn == null &&
					this._view2data_calenID_cn == null &&
					this.stDate <= 0 &&
					this.edDate <= 0 &&
					this.ordStopDate <= 0
					){
					;
				}else{
					last_index=index;
				}
				index++;
			});
			index = 0;
			$.each(list, function(i){
				if(last_index < index){
				}else{
					var obj = {
							brandID		: (this._view2data_brandID_cn == null? "": this._view2data_brandID_cn.id),
							brandName	: (this._view2data_brandID_cn == null? "": this._view2data_brandID_cn.name),
							brandCode	: (this._view2data_brandID_cn == null? "": this._view2data_brandID_cn.code),
							makerID		: (this._view2data_makerID_cn == null? "": this._view2data_makerID_cn.id),
							makerName	: (this._view2data_makerID_cn == null? "": this._view2data_makerID_cn.name),
							makerCode	: (this._view2data_makerID_cn == null? "": this._view2data_makerID_cn.code),
							stgrpID		: (this._view2data_stgrpID_cn == null? "": this._view2data_stgrpID_cn.id),
							stgrpName	: (this._view2data_stgrpID_cn == null? "": this._view2data_stgrpID_cn.name),
							stgrpCode	: (this._view2data_stgrpID_cn == null? "": this._view2data_stgrpID_cn.code),
							calenID		: (this._view2data_calenID_cn == null? "": this._view2data_calenID_cn.id),
							calenName	: (this._view2data_calenID_cn == null? "": this._view2data_calenID_cn.name),
							calenCode	: (this._view2data_calenID_cn == null? "": this._view2data_calenID_cn.code),

							stDate		: this.stDate,
							edDate		: this.edDate,
							ordStopDate	: this.ordStopDate,
							seq			: this.seq,
					};
					makerList.push(obj);
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
					AMPOV0110GetReq: {
					},
					AMPOV0110UpdReq: {
						clothOrder : head,
						makerList : makerList
					}
			};
			return req;
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
			var defer = clutil.postDLJSON('AMPOV0110', srchReq);
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
//			var rec = data.AMPOV0110GetRsp;
//			delete rec.orgfunc.fromDate;
//			delete rec.orgfunc.toDate;
//			$.each(rec.orglevelList, function(){
//			delete this.fromDate;
//			delete this.toDate;
//			delete this.orglevelCode;
//			});
			return data;
		}
	});

	// 初期データを取る
	clutil.getIniJSON(null, null).done(function(data, dataType) {
		ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
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
