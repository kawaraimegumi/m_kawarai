$(function(){

	clutil.enterFocusMode($('body'));

	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_table .btn-delete" : "_onDeleteLineClick",
			"click #ca_table tfoot tr:last" : "_onAddLineClick",
			"blur input[name='makerItgrpCode']"	: "_onmakerItgrpCodeLineBlur"	//メーカー品種から商品名等を検索
		},
		itemList : {}, //インセンティブ商品部データ
		listNum : 0,
		uri : "AMFUV0020",
		initialize: function(opt){
			_.bindAll(this);
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			// カラーセレクタ表示用のstatus保持
			this.viewStatus = "OK";
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: 'インセンティブ',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLmakerItemCodeCompleted', this._onCLmakerItgrpCodeComplete);

			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$("#ca_headInfoArea"), {
				echoback : $('.cl_echoback')
			});

			clutil.datepicker(this.$("#ca_fromDate"));
			clutil.datepicker(this.$("#ca_toDate"));

			clutil.cltxtFieldLimit($("#ca_fundName"));

			// 事業ユニット取得
			return clutil.clbusunitselector(this.$('#ca_unitID'));
		},

		initUIelement : function(){
			var _this = this;
			clutil.inputlimiter(this.$el);
			this.mdBaseView.initUIElement();
			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				btn: this.$('#ca_csv_uptake'),
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					var request = {
						AMFUV0020UpdReq: {
							fundRec : clutil.view2data(this.$("#ca_headInfoArea"))
						}
					};

					return {
						resId: 'AMFUV0020',
						data: request
					};
				}, this),

				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(this.validator.valid, this.validator)
				}
			});
			this.opeCSVInputCtrl.on('fail', _.bind(function(data){
				if(data.rspHead.fieldMessages){
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}
				if (data.rspHead.uri){
					clutil.download(data.rspHead.uri);	//CSVダウンロード実行
				}
			}, this));
			this.opeCSVInputCtrl.on('done', function(data){
				var list = data.AMFUV0020GetRsp.fundItemList;
				_this.clearTable();
				_this._addTable(list);
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで
			$("#ca_tp_code").tooltip({html: true});
			return this;
		},

		render : function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				this.$("#ca_fromDate").datepicker("setIymd", clcom.getOpeDate());
				this.$("#ca_toDate").datepicker("setIymd", clcom.getOpeDate());
				this.makeDefaultTable();
				clutil.setFocus(this.$("#ca_fromDate"));
			} else {
				this.mdBaseView.fetch();
			}
			return this;
		},

		/**
		 * getreq作成
		 * @param opeTypeId
		 * @param pgIndex
		 * @returns {___anonymous5050_5115}
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var getReq = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				AMFUV0020GetReq: {
					srchFundID: this.options.chkData[pgIndex].fundID,
				},
			};

			return {
				resId: clcom.pageId,
				data: getReq
			};
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			this.viewStatus = args.status;
			switch(args.status){
			case 'OK':
				var getRsp = data.AMFUV0020GetRsp;
				this.viewSeed = getRsp;
				this.$("form > a.cl-file-attach").attr("disabled",false);
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					this._editableCtrl(getRsp);
				}
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
					this.$("#ca_fundId").val("");
					this.$("#ca_fundCode").val("");
					this.$("#ca_state").val("");
				}
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL || this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					clutil.viewReadonly(this.$("#ca_headInfoArea"));
					this.$("form > a.cl-file-attach").attr("disabled",true);
					this._tableDisable();
				}
				clutil.setFocus(this.$("#ca_fromDate"));
				break;
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMFUV0020GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this.$("form > a.cl-file-attach").attr("disabled",true);
				this._tableDisable();
				break;
			default:
			case 'NG':			// その他エラー。
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this.$("form > a.cl-file-attach").attr("disabled",true);
				this._tableDisable();
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				clutil.mediator.trigger("onTicker", data);
//				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
			clutil.cltxtFieldLimitReset(this.$("#ca_fundName"));
		},

		/**
		 *  行のオートコンプリートとか実装
		 */
		setCompletes : function($tr, obj){
			var _this = this;
			var $unitID = this.$("#ca_unitID");

			$tr
			// 期間項目
			.find(".dp_input").each(function(){
				clutil.datepicker($(this)).datepicker("setIymd");
				if(obj){
					if (obj.itemFrom && $(this).is('input[name="itemFrom"]')){
						$(this).datepicker("setIymd", obj.itemFrom);
					}
					if (obj.itemTo && $(this).is('input[name="itemTo"]')){
						$(this).datepicker("setIymd", obj.itemTo);
					}
				}
			}).end()
			// 品種オートコンプリート
			.find('input[name="itgrpID"]')
			.each(function(){
				clutil.clvarietycode($(this), {
					getParentId : function(){
						return $unitID.val();	// 事業ユニット
					}
				});
				if(obj && obj.itgrpID){
					var _view2data_itgrpID_cn = {
							id : obj.itgrpID,
							code : obj.itgrpCode,
							name : obj.itgrpName,
							value : obj.itgrpCode + obj.itgrpName,
							label : obj.itgrpCode + obj.itgrpName
					};
					$(this).autocomplete('clAutocompleteItem', _view2data_itgrpID_cn);
				}
			}).end()
			// メーカーオートコンプリート
			.find('input[name="makerID"]')
			.each(function(){
				clutil.clvendorcode($(this), {
					getVendorTypeId : function(){
						return amcm_type.AMCM_VAL_VENDOR_MAKER;
					}
				});
				if(obj && obj.makerID){
					var _view2data_makerID_cn = {
							id : obj.makerID,
							code : obj.makerCode,
							name : obj.makerName,
							value : obj.makerCode + obj.makerName,
							label : obj.makerCode + obj.makerName
					};
					$(this).autocomplete('clAutocompleteItem', _view2data_makerID_cn);
				}
			}).end()
			// メーカー品番
			.find('input[name="makerItgrpCode"]')
			.each(function(){
				// メーカー品番検索⇒商品情報表示⇒カラーセレクタ生成⇒カラー選択
				if(obj && obj.makerItgrpCode){
					$(this).val(obj.makerItgrpCode);
				}
				var colorID = (obj && obj.colorID) ? obj.colorID : 0;
				_this.setmakerItgrpCode($(this), colorID);
			}).end()
			.find('input[name="am"]')
			.each(function(){
				if(obj && obj.am){
					$(this).val(clutil.comma(obj.am));
				}
			}).end()
			.find('input[name="itemState"]')
			.each(function(){
				if(_this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY && obj && obj.itemState){
					$(this).val(obj.itemState);
				}
			});
			return;
		},

		/**
		 * メーカー品番設定
		 * カラーが決定済みならカラーも指定
		 * @param $makerItgrpCode
		 * @param colorID
		 */
		setmakerItgrpCode: function($makerItgrpCode, colorID) {
			var $tgt = $makerItgrpCode;
			//リードオンリーなら戻る
			if($tgt.attr('readonly') == "readonly"){
				return;
			}

			var $tr = $tgt.closest("tr");

			var flag = true;

			//品種指定されていなければエラー化
			var inputData = clutil.tableview2data($tr);
			if(!inputData[0].itgrpID || inputData[0].itgrpID == null){
				if (colorID === null){ // 入力して検索した場合
					this.validator.setErrorMsg($tgt.closest("tr").find("input[name='itgrpID']"), "品種を指定してください。");
				}
				flag = false;
			}
			//メーカー指定されていなければ戻る
			if(!inputData[0].makerID || inputData[0].makerID == null){
				if (colorID === null){
					this.validator.setErrorMsg($tgt.closest("tr").find("input[name='makerID']"), "メーカーを指定してください。");
				}
				flag = false;
			}

			//メーカー品番指定されていなければ戻る
			var code = $tgt.val();
			if(code.length == 0 || flag == false){
				$tr.find('span[name="subcls1Disp"]').html("");
				$tr.find('span[name="subcls2Disp"]').html("");
				$tr.find('span[name="itemName"]').html("");
				$tr.find('input[name="itemID"], input[name="itemCode"], input[name="colorItemID"], input[name="colorItemCode"]').val(null);
				$tr.find('td.subclu1, td.subcls2').find('input[type="hidden"]').val(null);
				flag = false;
			}

			if(flag == false){
				//編集モード終了
				return;
			} else {
				//セレクター用オブジェクト
				var sel_obj = {
						tgt : $tgt,
						colorID : colorID
				};

				//検索用オブジェクト
				var srch_obj = {
					maker_code : code,					//メーカー品番
					itgrp_id : inputData[0].itgrpID,			//品種ID
					maker_id : inputData[0].makerID		//メーカーID
				};

				//検索用関数に品番を渡す
				clutil.clmakeritemcode2item(srch_obj, sel_obj);
			}
		},

		/**
		 * メーカー品番→商品取得完了イベント
		 * @param data
		 * @param e
		 */
		_onCLmakerItgrpCodeComplete: function(data, obj) {
			var $tgt = obj.tgt;
			var $tr = $tgt.closest("tr");
			var colorID = obj.colorID;
			var rec = data.data.rec;
			var itemID = rec.itemID;
			//セレクター
			var $sel_color = $tr.find('select[name="colorID"]');
			var list = [];

			//コードに該当する商品IDがない場合
			if(itemID == ""){
				var $err = $tr.find('input[name="makerItgrpCode"]');

				this.validator.setErrorMsg($err, clmsg.EGM0026);

				$tr.find('span[name="subcls1Disp"]').html("");
				$tr.find('span[name="subcls2Disp"]').html("");
				$tr.find('span[name="itemName"]').html("");
				$tr.find('input[name="itemID"],input[name="itemCode"], input[name="colorItemID"], input[name="colorItemCode"]').val(null);
				$tr.find('td.subclu1, td.subcls2').find('input[type="hidden"]').val(null);

				clutil.cltypeselector2({
					  $select: $sel_color,
					  list: list
				});
				clutil.initUIelement($tr);
				return;
			}

			//押下行の情報を取得
			$tr.find('input[name="itemID"]').val(rec.itemID);
			$tr.find('span[name="itemName"]').html(rec.itemName);
			$tr.find('input[name="itemCode"]').val(rec.itemCode);
			$tr.find('span[name="subcls1Disp"]').html(rec.sub1Code.substr(-2) + ":" + rec.sub1Name);
			$tr.find('span[name="subcls2Disp"]').html(rec.sub2Code.substr(-2) + ":" + rec.sub2Name);
			$tr.find('input[name="subcls1ID"]').val(rec.sub1ID);
			$tr.find('input[name="subcls2ID"]').val(rec.sub2ID);
			$tr.find('input[name="subcls1Code"]').val(rec.sub1Code);
			$tr.find('input[name="subcls2Code"]').val(rec.sub2Code);
			$tr.find('input[name="subcls1Name"]').val(rec.sub1Name);
			$tr.find('input[name="subcls2Name"]').val(rec.sub2Name);

			$sel_color.attr("disabled", false);
			//カラーセレクター
			colorSelector = clutil.clcolorselector({
				emptyLabel: "すべて",

				el: $sel_color,
				dependAttrs: {
					// 期間開始日
					srchFromDate: function(){
						return clcom.getOpeDate();
					},
					// 期間終了日
					srchToDate: function(){
						return 0;
					},
					// 商品ID
					itemID: function(){
						return $tr.find('input[name="itemID"]').val();
					}
				}
			});

			clutil.viewRemoveReadonly($tgt);

			if(colorID != null){
				colorSelector.setValue(colorID);
			}
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL 
					|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					|| this.viewStatus != "OK"){
				$sel_color.attr("disabled", true);
			}
			clutil.initUIelement($tr);
			colorSelector.on("change", function(e){
				console.log("color changed");
				var $select = this.$el;
				var $tr = $select.closest("tr");
				var $colorItemID = $tr.find('input[name="colorItemID"]');
				var $colorItemCode = $tr.find('input[name="colorItemCode"]');
				if (e.id != 0){
					$colorItemID.val(e.colorItem.id);
					$colorItemCode.val(e.colorItem.code);
				} else {
					$colorItemID.val(null);
					$colorItemCode.val(null);
				}

			});
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				document.location = '#';
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					this.options.chkData[args.index].fundID = args.data.AMFUV0020GetRsp.fundRec.fundId;
				}
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this.$("form > a.cl-file-attach").attr("disabled",true);
				this._tableDisable();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this.$("form > a.cl-file-attach").attr("disabled",true);
				this._tableDisable();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {prefix: 'ca_'});
				clutil.mediator.trigger("onTicker", data);
//				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		_allData2View : function(getRsp){
			var _this = this;
			var rec = getRsp.fundRec;
			var list = getRsp.fundItemList;
			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = this.$("#ca_tbody_template");
			this._initView(); // こっそり初期化
			clutil.data2view(this.$("#ca_headInfoArea"), rec);
			$.each(list, function(){
				$tmpl.tmpl({}).appendTo($tbody);
				var $tr = $tbody.find("tr:last");
				_this.setCompletes($tr, this);
			});
			if ($tbody.find("tr").length == 1){
				$tbody.find('span.btn-delete').hide();
			}
		},

		_initView : function(){
			this.clearTable();
			this.$("#ca_table").find('tfoot').show();
			clutil.viewRemoveReadonly(this.$("#ca_headInfoArea"));
			this.$("#ca_fundCode").attr("readonly", true);
		},

		// 編集可能エリアの制御
		_editableCtrl: function(getRsp){
			var rec = getRsp.fundRec;
			var list = getRsp.fundItemList;
			var $tbody = this.$("#ca_table_tbody");
			var $fromDate = this.$("#ca_fromDate");
			var fromDate = rec.fromDate;
			var fromDateMonth = clutil.monthFormat(fromDate, "yyyymm");
			var $toDate = this.$("#ca_toDate");
			var toDate = rec.toDate;
			var toDateMonth = clutil.monthFormat(toDate, "yyyymm");
			var thisDay = clcom.getOpeDate();
			var thisMonth = clutil.monthFormat(thisDay, "yyyymm");
			var insDate = rec.insDate;
			var insMonth = clutil.monthFormat(insDate, "yyyymm");
			
			this.$("#ca_fAfter").attr("disabled", true).closest("label").addClass("disabled");
			clutil.initUIelement(this.$("#ca_headInfoArea"));
			// 境界チェックの日付（年月）を求める。
			var cmpDate = function(ymd){
				var year = Math.floor(ymd / 10000);
				var month = Math.floor(ymd / 100) % 100;
				var day = ymd % 100;
				if(day < 16){
					// 前月に倒す
					if((--month) <= 0){
						// 12-1月 跨ぎ
						month = 12;
						--year;
					}
				}
				return (year * 100) + month;
			}(thisDay);

			// 前提:insDateは先月or今月の日付
			if (insMonth < thisMonth){
				// ヘッダ部
				// 全て潰す
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this.$("form > a.cl-file-attach").attr("disabled",true);
				if(toDateMonth >= thisMonth){// 先月登録データで終了日今月以降なら期間編集可能
					clutil.viewRemoveReadonly($toDate.closest("div"));
				};
				this.$("form > a.cl-file-attach").attr("disabled",true);
				// 明細部
				this._tableDisable();
				if (cmpDate == insMonth){// 修正期間中の先月登録データ
					$tbody.find('input[name="am"]').attr("readonly", false);
				}
				var $iToDates = $tbody.find('input[name="itemTo"]');
				$.each($iToDates,function(){
					var iToDate = clutil.dateFormat($(this).val(), "yyyymmdd");
					var iToMonth = clutil.monthFormat(iToDate);
					if(iToMonth == thisMonth){
						clutil.viewRemoveReadonly($(this).closest("div"));
					};
				});
			} else {
				this.$("form > a.cl-file-attach").attr("disabled", false);
				// 自由
			};
		},

		_addTable : function(list){
			var _this = this;
			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = this.$("#ca_tbody_template");
			$.each(list, function(){
				$tmpl.tmpl({}).appendTo($tbody);
				var $tr = $tbody.find("tr:last");
				_this.setCompletes($tr, this);
			});
		},

		/**
		 * テーブルクリア
		 */
		clearTable : function() {
			$("#ca_table_tbody tr").remove();
		},

		/**
		 * 新規作成時にデフォルト空欄表示
		 */
		makeDefaultTable: function(){
			this.clearTable();
			var $tbody = this.$("#ca_table_tbody"),
			$tmpl = this.$("#ca_tbody_template"),
			i = 0;

			for (;i < 10;i++){
				$tmpl.tmpl({}).appendTo($tbody);
				this.setCompletes($tbody.find("tr:last"), null);
			}
			return this;
		},

		_tableDisable : function(){
			var $table = this.$("#ca_table");
			$table.find('input[type="text"]').attr("readonly", true);
			$table.find('input.cl_date').each(function(){
				clutil.viewReadonly($(this).closest('div'));
			});
			$table.find('select').attr("disabled", true);
			$table.find('input[type="checkbox"]').attr("disabled", true).closest("label").addClass("disabled");
			$table.find('tbody span.btn-delete').hide();
			$table.find('tbody span.btn-add').hide();
			$table.find('tfoot').hide();
			clutil.initUIelement($table);
		},

		/**
		 * 行追加処理
		 */
		_onAddLineClick : function(e) {
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
					|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
				return;
			}
			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = $("#ca_tbody_template");
			$tmpl.tmpl({}).appendTo($tbody);
			var $tr_last = $tbody.find('tr:last');
			$tbody.find('span.btn-delete').show();
			this.setCompletes($tr_last, null);
		},

		/**
		 * 行削除処理
		 */
		_onDeleteLineClick : function(e) {
			if (this.options.opeTypeId  == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
					|| this.options.opeTypeId  == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
				return;
			}
			$(e.target).closest("tr").remove();
			var $tbody = this.$("#ca_table_tbody");
			if ($tbody.find("tr").length == 1){
				$tbody.find('span.btn-delete').hide();
			}
		},

		/**
		 * メーカー品番から商品名等を検索
		 * @param e
		 */
		_onmakerItgrpCodeLineBlur: function(e) {
			var $tgt = $(e.target);

			this.setmakerItgrpCode($tgt, null);
		},

		/**
		 * 登録データ作成
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex) {
			var updReq = {};
			/*
			 * 無効化チェック
			 */
			if (this.$("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}
			this.validator.clear();
			/*
			 * 入力値チェック 削除時はチェックしない
			 */
			if (this.options.opeTypeId  !== am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				// validation
				var f_error = false;
				if(!this.validator.valid()) {
					f_error = true;
				}
				// 期間反転チェック
				var chkInfo = [];
				chkInfo.push({
					stval : 'ca_fromDate',
					edval : 'ca_toDate'
				});
				if(!this.validator.validFromTo(chkInfo)){
					f_error = true;
				}
				if(f_error){
					return null;
				}

				var $trs = this.$("#ca_table tbody").find("tr");
				if($trs.length == 0){
					clutil.mediator.trigger('onTicker', "対象商品を一つは設定してください");
					return null;
				}
				/*
				 * パケット作成
				 */
				var head = clutil.view2data(this.$('#ca_headInfoArea'));
				var list = clutil.tableview2ValidData({
					$tbody : this.$('#ca_table_tbody'),
					validator : this.validator,
					tailEmptyCheckFunc : function(data){
						return data.itgrpID == null
							&& data.makerID == null
							&& data.makerItgrpCode == ""
							&& (data.colorID == null || data.colorID == "")
							&& (data.colorItemID == null || data.colorItemID == "")
							&& data.itemFrom == 0
							&& data.itemTo == 0
							&& data.am == "";
					}
				});
				
				if(list == null){
					return null;
				}
				if(list.length == 0){
					clutil.mediator.trigger('onTicker', "対象商品を一つは設定してください");
					return null;
				}
				if(list.length > 1000){
					clutil.mediator.trigger('onTicker', "登録行数上限(1000件)を超えています。");
					return null;
				} 
				var _this = this;
				$.each(list, function(i){
					if(this.itemID == 0 && this.colorItemID == 0){
						_this.validator.setErrorMsg(_this.$("#ca_table_tbody tr:nth-child(" + (i + 1) + ") input[name='makerItgrpCode']"), "入力されたメーカー品番に対応する商品が存在しません。");
						clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
						f_error = true;
					}
				});
				if (f_error){
					return null;
				}
				/*************
				 * chkstdate 日付のチェック
				 *************/
				if(!this.isCorrectDate()){
					return null;
				}

				// item重複チェック
				if(!this.isCorrectItem(list)){
					return null;
				}
				
				updReq = {
						fundRec : head,
						fundItemList : list
				};
			} else {
				updReq = this.viewSeed;
			}

			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			if(this.options.opeTypeId  === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}
			var reqObj = {
					reqHead : reqHead,
					AMFUV0020UpdReq  : updReq,
			};

			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		/**
		 * item重複がないかチェック
		 */
		isCorrectItem: function(list){
			var _this = this;
			var isCorrect = true;
			var listLen = list.length;
			if (listLen == 0){
				return false;
			} else if (listLen == 1){
				return true;
			} else {
				$.each(list, function(i,v){
					var itgrpID = this.itgrpID;
					var makerID = this.makerID;
					var makerItgrpCode = this.makerItgrpCode;
					var colorID = this.colorID;
					for(var j = i+1; j < listLen; j++){
						if (list[j].itgrpID == itgrpID && list[j].makerID == makerID && list[j].makerItgrpCode == makerItgrpCode){
							if ((list[j].colorID == 0 || colorID == 0) || list[j].colorID == colorID){
								_this.validator.setErrorMsg(_this.$("#ca_table tr:nth-child(" + (i + 1) + ") select[name='colorID']"), clutil.fmtargs(clmsg.EMS0065, ["対象商品"]));
								_this.validator.setErrorMsg(_this.$("#ca_table tr:nth-child(" + (j + 1) + ") select[name='colorID']"), clutil.fmtargs(clmsg.EMS0065, ["対象商品"]));
								clutil.mediator.trigger("onTicker",  "データに重複があります");
								isCorrect = false;
							}
						}
					}
				});
			}
			return isCorrect;
		},
		
		/**
		 * 日付設定が正しいかチェック
		 */
		isCorrectDate: function(){
			var _this = this;
			var f_error = false;
			var $fromDate = this.$("#ca_fromDate");
			var fromDate = clutil.dateFormat($fromDate.val(), "yyyymmdd");
			var fromDateMonth = clutil.monthFormat(fromDate, "yyyymm");
			var $toDate = this.$("#ca_toDate");
			var toDate = clutil.dateFormat($toDate.val(), "yyyymmdd");
			var toDateMonth = clutil.monthFormat(toDate, "yyyymm");
			var thisDay = clcom.getOpeDate();
			var thisMonth = clutil.monthFormat(thisDay, "yyyymm");
			var insDate = clcom.getOpeDate();
			var insMonth = clutil.monthFormat(insDate, "yyyymm");
			var $trs = this.$("#ca_table tbody").find("tr");
			// ヘッダ期間チェック
			if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){

				// 新規登録時(含コピーモード)
				var isAfter = this.$("#ca_fAfter").attr("checked");
				if(isAfter){
					;	// 遡及登録時は無制限
				} else {
					// 通常時はfromDateは当月かそれ以降である
					if (fromDateMonth < thisMonth){
						this.validator.setErrorMsg($fromDate, "当月以降を設定してください");
						clutil.mediator.trigger('onTicker', "インセンティブ期間開始日は当月以降のみ設定可能です");
						f_error = true;
					}
				}
			} else {
				// 編集時
				insDate = this.viewSeed.fundRec.insDate;
				insMonth = clutil.monthFormat(insDate, "yyyymm");
				// toDateが編集可な時、toDateが当月かそれ以降である
				if (insMonth < thisMonth
						&& !($toDate.attr("disabled") || $toDate.attr("disabled")) && (toDateMonth < thisMonth)){
					this.validator.setErrorMsg($toDate, "当月以降を設定してください");
					clutil.mediator.trigger('onTicker', "インセンティブ期間終了日は当月以降のみ設定可能です");
					f_error = true;
				}
			}
			if (f_error){
				return false;
			}

			// 明細部各期間チェック
			$trs.each(function(){
				var $tr = $(this);
				var trVal = clutil.tableview2data($tr)[0];
				var $iFromDate = $(this).find('input[name="itemFrom"]');
				var iFromDate = trVal.itemFrom;
				var $iToDate = $(this).find('input[name="itemTo"]');
				var iToDate = trVal.itemTo;
				if (_.isEmpty(trVal.itgrpID) && _.isEmpty(trVal.makerID) && _.isEmpty(trVal.itemID) && _.isEmpty(trVal.colorID)){
					return true;
				}
				if (iFromDate > iToDate){
					_this.validator.setErrorMsg($iFromDate, clmsg.cl_date_error);
					_this.validator.setErrorMsg($iToDate, clmsg.cl_date_error);
					f_error = true;
				};
				if (iFromDate < fromDate){
					_this.validator.setErrorMsg($iFromDate, "ヘッダ情報のインセンティブ期間内に設定してください");
					f_error = true;
				};
				if (toDate < iToDate){
					_this.validator.setErrorMsg($iToDate, "ヘッダ情報のインセンティブ期間内に設定してください");
					f_error = true;
				};
				// 以下 if(){}中は明細データの延長をチェック
				if (_this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
						&& insMonth < thisMonth
						&& !($iToDate.attr("readonly") || $iToDate.attr("disabled"))){
					var recitemTo = (function(list, obj){
						var rec ={};
						$.each(list, function(){
							if(this.itemID == obj.itemID && this.colorItemID == obj.colorItemID){
								rec = this;
								return false;
							}
						});
						return rec.itemTo;
					})(_this.viewSeed.fundItemList,{
						itemID : $tr.find('input[name="itemID"]').val(),
						colorItemID : $tr.find('input[name="colorItemID"]').val()
					});
					if ((recitemTo != iToDate) && clutil.monthFormat(iToDate, "yyyymm") < thisMonth){
						_this.validator.setErrorMsg($iToDate, "変更する場合は当月以降を設定してください");
						f_error = true;
					}
				}
			});
			if (f_error){
				return false;
			}
			return true;
		},

		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
			delete data.AMFUV0020UpdRsp;
			delete data.rspHead;
			delete data.rspPage;
			var rec = data.AMFUV0020GetRsp;
			delete rec.fundRec.fromDate;
			delete rec.fundRec.toDate;
			$.each(rec.fundItemList, function(){
				delete this.itemFrom;
				delete this.itemTo;
				delete this.colorCode;
				delete this.colorName;
				delete this.itgrpCode;
				delete this.itgrpName;
				delete this.makerCode;
				delete this.makerName;
				delete this.subcls1Code;
				delete this.subcls1Name;
				delete this.subcls2Code;
				delete this.subcls2Name;
			});
			return data;
		}
	});



	// 初期データを取る
	clutil.getIniJSON(null, null).done(_.bind(function(data, dataType){
		ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
	}, this)).fail(_.bind(function(data){
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	}, this));
});
