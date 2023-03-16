useSelectpicker2();

$(function() {

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));


	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		events: {
			"change #ca_unitID" : "_onUnitChange",
			'click #ca_table_tbody td[name="btn_delete"]': "_onDeleteRowClick",
			"click #ca_table_tfoot tr" : "_onAddRowClick",

			'click #ca_csv_download'	: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
		},

		sampleURL: "/public/sample/対象商品リストサンプル（部門なし）.xlsx",

		state: {
			recno: "",
			state: 0,
		},
		itemList: [],

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
					title: '核商品',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					btn_csv: true,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			this.validator = clutil.validator(this.$("#ca_upper"), {
				echoback : $('.cl_echoback')
			});
			this.validator2 = clutil.validator(this.$("#ca_table"), {
				echoback : $('.cl_echoback')
			});

			// アプリ個別の View や部品をインスタンス化するとか・・・

			// CSV取込
			this.fileInput = clutil.fileInput({
				files: [],
				fileInput: "#ca_csvinput1",
				showDialogOnSuccess : false,
				showDialogOnError : false
			});

			this.fileInput.on('success', _.bind(function(file){
				this.mdBaseView.validator.clear();
				console.log('成功', file);
				var unitID = $("#ca_unitID").val();
				var srchDate = $("#ca_startDate").val();
				srchDate = clutil.dateFormat(srchDate, 'yyyymmdd');
				var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT,
						fileId: file.id,
					},
					AMMSV0160CsvReq: {
						unitID: unitID,
						srchDate: srchDate,
						f_nodiv: 1,
					},
				};

				var url = "AMMSV0160";	// 組合せ販売商品登録

				clutil.postJSON(url, req).done(_.bind(function(data,dataType){
					if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						//成功時処理
						var view = new clutil.MessageDialog2('取込が完了しました。');
						console.log(view);

						var itemList_tmp = clutil.tableview2data($("#ca_table_tbody tr"));
						var itemMap = {};
						var newlist = [];

						_.each(itemList_tmp, _.bind(function(v) {
							if (v.itemID > 0) {
								v.itgrpCode = v._view2data_itgrpID_cn.code;
								v.itgrpName = v._view2data_itgrpID_cn.name;
								v.makerCode = v._view2data_makerID_cn.code;
								v.makerName = v._view2data_makerID_cn.name;

								itemMap[v.itemID] = v;
								newlist.push(v);
							}
						}, this));

						var csvRsp = data.AMMSV0160CsvRsp;
						_.each(csvRsp.itemList, _.bind(function(v) {
							if (itemMap[v.itemID] == null) {
								newlist.push(v);
								itemMap[v.itemID] = v;
							}
						}, this));

						var i = 0;
						var len = newlist.length;
						for (i = len; i < 5; i++) {
							var add_tmp = {
									no: 0,
									divID: 0,
									divCode: "",
									divName: "",
									itgrpID: 0,
									itgrpCode: "",
									itgrpName: "",
									makerID: 0,
									makerCode: "",
									makerName: "",
									makerItemCode: "",
									itemName: "",
									itemID: 0,
									rank: 0,
								};
							newlist.push(add_tmp);
						}
						this.itemList = newlist;
						i = 0;
						_.each(this.itemList, _.bind(function(v) {
							i++;
							v.no = i;
						}, this));

						// 内容物がある場合 --> 結果表示する。
						this.renderTable(this.itemList);

					} else {
						// ヘッダーにメッセージを表示
						this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args),});
						this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_",});
						if (data.rspHead.uri){
							clutil.download(data.rspHead.uri);	//CSVダウンロード実行
						}
					}
				},this)).fail(_.bind(function(data){
					clutil.mediator.trigger('onTicker', data);

					// エラーファイルがあればダウンロードする
					if (data.rspHead.uri){
						clutil.download(data.rspHead.uri);	//CSVダウンロード実行
					}
				}, this));
			}, this));

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}
			clutil.mediator.on('onOperation', this._doOpeAction);	// Excelデータ出力用
			this.opeTypeId = fixopt.opeTypeId;	// 処理区分を保存
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table"));
				$("#ca_table").addClass('readonly');
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table"));
				$("#ca_table").addClass('readonly');
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table"));
				$("#ca_table").addClass('readonly');
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.mdBaseView.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				break;
			}
		},

		/**
		 * 行追加・削除イベント追加
		 */
		_addEvent: function() {
		},

		/**
		 * メーカー品番変更イベント
		 * @param e
		 */
		_onMakerItemCodeChange: function(e) {
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');

			var $input_maker = $tr.find('input[name="ca_makerID"]');
			var data_maker = $input_maker.autocomplete('clAutocompleteItem');
			var maker_id = data_maker.id;

			var $input_itgrp = $tr.find('input[name="ca_itgrpID"]');
			var data_itgrp = $input_itgrp.autocomplete('clAutocompleteItem');
			var itgrp_id = data_itgrp.id;
			var code = $(e.target).val();

			var $input_fromDate = $("#ca_fromDate");
			var srchFromDate = clutil.dateFormat($input_fromDate.val(), 'yyyymmdd');
			var $input_toDate = $("#ca_toDate");
			var srchToDate = clutil.dateFormat($input_toDate.val(), 'yyyymmdd');

			var arg = {
				itgrp_id: itgrp_id,
				maker_id: maker_id,
				maker_code: code,
				srchFromDate: srchFromDate,
				srchToDate: srchToDate,
			};

			clutil.clmakeritemcode2item(arg, e);
		},

		isValidItemID: function(itemID) {
			var f_valid = true;
			_.each($("#ca_table_tbody tr"), _.bind(function(tr) {
				var $tr = $(tr);
				var $itemID = $tr.find('input[name="ca_itemID"]');
				var orgItemID = $itemID.val();
				if (itemID == orgItemID) {
					f_valid = false;
				}
			}, this));
			return f_valid;
		},

		/**
		 * メーカー品番→商品取得完了イベント
		 * @param data
		 * @param e
		 */
		_onCLmakerItemCodeComplete: function(data, e) {
			var $tgt = $(e.target);	// input;
			var $tr = $tgt.parents('tr');
			var $td_code = $tgt.parent();	// td(メーカー品番)
			var $td_name = $td_code.next();	// td(商品名)
			var $td_id = $td_code.next().next().next();
			var $input_itemID = $td_id.children('input');
			var $input_makerID = $tr.find('input[name="ca_makerID"]');
//			var $input_Div = $tr.find('input[name="ca_divID"]');
			var $input_ItgrpID = $tr.find('input[name="ca_itgrpID"]');
			var $input_itemName = $tr.find('input[name="ca_itemName"]');

			var head = data.data.head;
			if (head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_NG) {
				// 検索失敗
				var msg = clutil.getclmsg(head.message, head.args);
				this.validator2.setErrorHeader(clmsg.cl_echoback);
//				this.validator2.setErrorMsg($input_Div, msg);
				this.validator2.setErrorMsg($input_ItgrpID, msg);
				this.validator2.setErrorMsg($input_makerID, msg);
				this.validator2.setErrorMsg($tgt, msg);
				$input_itemID.val(itemID);	// 無視して登録行こうとした時にもエラーとなるように
				$td_name.text("");			// 商品名はクリアする
				return;
			}

			var itemName = data.data.rec.itemName;
			var itemID = data.data.rec.itemID;

			// 商品重複チェック
			if (itemID == 0) {
				var msg = clutil.fmtargs(clmsg.EGM0008, ["メーカー品番"]);
				this.validator2.setErrorHeader(clmsg.cl_echoback);
//				this.validator2.setErrorMsg($input_Div, msg);
				this.validator2.setErrorMsg($input_ItgrpID, msg);
				this.validator2.setErrorMsg($input_makerID, msg);
				this.validator2.setErrorMsg($tgt, msg);
				$input_itemID.val(itemID);	// 無視して登録行こうとした時にもエラーとなるように
				$td_name.text("");			// 商品名はクリアする
				return;
			} else if (!this.isValidItemID(itemID)) {
				var msg = clutil.fmtargs(clmsg.EGM0009, ["メーカー品番"]);
				this.validator2.setErrorHeader(clmsg.cl_echoback);
//				this.validator2.setErrorMsg($input_Div, msg);
				this.validator2.setErrorMsg($input_ItgrpID, msg);
				this.validator2.setErrorMsg($input_makerID, msg);
				this.validator2.setErrorMsg($tgt, msg);
				$input_itemID.val(itemID);	// 無視して登録行こうとした時にもエラーとなるように
				$td_name.text("");			// 商品名はクリアする
				return;
			}

			$td_name.text(itemName);
			$input_itemName.val(itemName);
			$input_itemID.val(itemID);
		},

		getVendorTypeId: function() {
			// 取引先区分=メーカー
			return amcm_type.AMCM_VAL_VENDOR_MAKER;
		},

		getUnitId: function() {
			var id = $("#ca_unitID").val();
			return id;
		},

		_onDeleteRowClick: function(e) {
			switch (this.options.opeTypeId) {
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				break;
			default:
				return;
			}
			var $table = $("#ca_table");
			if ($table.hasClass('readonly')) {
				return;
			}

			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');

			$tr.remove();
		},

		_onAddRowClick: function(e) {
			switch (this.options.opeTypeId) {
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				break;
			default:
				return;
			}
			var $table = $("#ca_table");
			if ($table.hasClass('readonly')) {
				return;
			}

			var $tbody = $("#ca_table_tbody");
			// 空データ挿入
			var add_tmp = {
				no: 0,
				divID: 0,
				divCode: "",
				divName: "",
				itgrpID: 0,
				itgrpCode: "",
				itgrpName: "",
				makerID: 0,
				makerCode: "",
				makerName: "",
				makerItemCode: "",
				itemName: "",
				itemID: 0,
				rank: 0,
			};
			var tr = _.template($("#ca_rec_template").html(), add_tmp);
			$tbody.append(tr);

			var $tr_last = $tbody.find('tr:last');

			/*
			 * autocomplete
			 */
			// 部門
//			var optDiv = {
//				getItgrpFuncId: function() {
//					var id = clcom.getItgrpFuncBasic();
//					id = id > 0 ? id : 1;
//					return id;
//				},
//				getItgrpLevelId: function() {
//					var id = clcom.getStdItgrpLevel();
//					id = id > 0 ? id - 1 : 3;
//					return id;
//				},
//				getParentId: function() {
//					var unit_id = $("#ca_unitID").val();
//					return unit_id;
//				},
//			};
//			var $inputDiv = $tr_last.find("input:eq(0)");
//			clutil.clitgrpcode($inputDiv, optDiv);
//			$inputDiv.on('autocompletechange', this._onDivChange);

			// 品種
			var optItgrp = {
				getItgrpFuncId: function() {
					var id = clcom.getItgrpFuncBasic();
					id = id > 0 ? id : 1;
					return id;
				},
				getItgrpLevelId: function() {
					var id = clcom.getStdItgrpLevel();
					id = id > 0 ? id : 4;
					return id;
				},
				getParentId: function() {
					var id = $("#ca_unitID").val();
					return id;
				},
			};
			var $inputItgrp = $tr_last.find("input:eq(1)");
			clutil.clitgrpcode($inputItgrp, optItgrp);
			$inputItgrp.on('autocompletechange', this._onItgrpChange);

			// メーカー
			var optMaker = {
				getVendorTypeId: this.getVendorTypeId,
				getUnitId: this.getUnitId,
			};
			var $inputMaker = $tr_last.find("input:eq(2)");
			clutil.clvendorcode($inputMaker, optMaker);
			$inputMaker.on('autocompletechange', this._onMakerChange);

			// 品番
			var $inputCode = $tr_last.find("input:eq(3)");
			$inputCode.change(this._onMakerItemCodeChange);	// 変更イベント

			clutil.initUIelement($("#ca_table"));
		},

		_onUnitChange: function(e) {
			// 部門クリア
//			$('input[name="ca_divID"]').autocomplete('removeClAutocompleteItem');
			// 品種クリア
			$('input[name="ca_itgrpID"]').autocomplete('removeClAutocompleteItem');
			// メーカークリア
			$('input[name="ca_makerID"]').autocomplete('removeClAutocompleteItem');
			// メーカー品番クリア
			$('input[name="ca_makerItemCode"]').val("");
			// 商品名クリア
			$('td[name="td_name"]').text("");
			$('input[name="ca_itemName"]').val("");
			// 商品IDクリア
			$('input[name="ca_itemID"]').val('');
		},

		_onDivChange: function(e) {
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');

			// 品種クリア
			var $ca_itgrpID = $tr.find('input[name="ca_itgrpID"]');
			$ca_itgrpID.autocomplete('removeClAutocompleteItem');

			// メーカークリア
			var $ca_makerID = $tr.find('input[name="ca_makerID"]');
			$ca_makerID.autocomplete('removeClAutocompleteItem');

			// メーカー品番クリア
			var $ca_makerItemCode = $tr.find('input[name="ca_makerItemCode"]');
			$ca_makerItemCode.val("");

			// 商品名クリア
			var $td_name = $tr.find('td[name="td_name"]');
			$td_name.text("");
			var $input_itemName = $tr.find('input[name="ca_itemName"]');
			$input_itemName.val("");

			// 商品IDクリア
			var $ca_itemID = $tr.find('input[name="ca_itemID"]');
			$ca_itemID.val('');
		},

		_onItgrpChange: function(e) {
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');

			// メーカークリア
			var $ca_makerID = $tr.find('input[name="ca_makerID"]');
			$ca_makerID.autocomplete('removeClAutocompleteItem');

			// メーカー品番クリア
			var $ca_makerItemCode = $tr.find('input[name="ca_makerItemCode"]');
			$ca_makerItemCode.val("");

			// 商品名クリア
			var $td_name = $tr.find('td[name="td_name"]');
			$td_name.text("");
			var $input_itemName = $tr.find('input[name="ca_itemName"]');
			$input_itemName.val("");

			// 商品IDクリア
			var $ca_itemID = $tr.find('input[name="ca_itemID"]');
			$ca_itemID.val('');
		},

		_onMakerChange: function(e) {
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');

			// メーカー品番クリア
			var $ca_makerItemCode = $tr.find('input[name="ca_makerItemCode"]');
			$ca_makerItemCode.val("");

			// 商品名クリア
			var $td_name = $tr.find('td[name="td_name"]');
			$td_name.text("");
			var $input_itemName = $tr.find('input[name="ca_itemName"]');
			$input_itemName.val("");

			// 商品IDクリア
			var $ca_itemID = $tr.find('input[name="ca_itemID"]');
			$ca_itemID.val('');
		},

		/**
		 * テーブル描画
		 * @param list
		 */
		renderTable: function(list) {
			list = list == null ? [] : list;
			var _this = this;
			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				var len = list.length;
				for (var i = len; i < 5; i++) {
					var add_tmp = {
							no: 0,
							divID: 0,
							divCode: "",
							divName: "",
							itgrpID: 0,
							itgrpCode: "",
							itgrpName: "",
							makerID: 0,
							makerCode: "",
							makerName: "",
							makerItemCode: "",
							itemName: "",
							itemID: 0,
							rank: 0,
						};
					list.push(add_tmp);
				}
			}
			var $tbody = $("#ca_table_tbody");
			$tbody.empty();
			$.each(list, function() {
//				var dataDiv = {
//					id: this.divID,
//					code: this.divCode,
//					name: this.divName,
//				};
				var dataItgrp = {
					id: this.itgrpID,
					code: this.itgrpCode,
					name: this.itgrpName,
				};
				var dataMaker = {
					id: this.makerID,
					code: this.makerCode,
					name: this.makerName,
				};
				var tr = _.template($("#ca_rec_template").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);

				var $tr = $tbody.find('tr:last');	// 追加した行

				// autocomplete初期化
				// 部門
//				var optDiv = {
//					getItgrpFuncId: function() {
//						var id = clcom.getItgrpFuncBasic();
//						id = id > 0 ? id : 1;
//						return id;
//					},
//					getItgrpLevelId: function() {
//						var id = clcom.getStdItgrpLevel();
//						id = id > 0 ? id - 1 : 3;
//						return id;
//					},
//					getParentId: function() {
//						var unit_id = $("#ca_unitID").val();
//						return unit_id;
//					},
//				};
//				var $inputDiv = $tr.find("input:eq(0)");
//				clutil.clitgrpcode($inputDiv, optDiv);
//				$inputDiv.on('autocompletechange', _this._onDivChange);

				// 品種
				var optItgrp = {
					getItgrpFuncId: function() {
						var id = clcom.getItgrpFuncBasic();
						id = id > 0 ? id : 1;
						return id;
					},
					getItgrpLevelId: function() {
						var id = clcom.getStdItgrpLevel();
						id = id > 0 ? id : 4;
						return id;
					},
					getParentId: function() {
						var unit_id = $("#ca_unitID").val();
						return unit_id;
					},
				};
				var $inputItgrp = $tr.find("input[name='ca_itgrpID']");
				clutil.clitgrpcode($inputItgrp, optItgrp);
				$inputItgrp.on('autocompletechange', _this._onItgrpChange);

				var optMaker = {
					getVendorTypeId: _this.getVendorTypeId,
					getUnitId: _this.getUnitId,
				};
				var $inputMaker = $tr.find("input[name='ca_makerID']");
				clutil.clvendorcode($inputMaker, optMaker);
				$inputMaker.on('autocompletechange', _this._onMakerChange);

				var $inputCode = $tr.find("input[name='ca_makerItemCode']");
				$inputCode.change(_this._onMakerItemCodeChange);	// 変更イベント

				// 改めてデータをセット
//				$inputDiv.autocomplete('clAutocompleteItem', dataDiv);
				$inputItgrp.autocomplete('clAutocompleteItem', dataItgrp);
				$inputMaker.autocomplete('clAutocompleteItem', dataMaker);
			});
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			var data = args.data;
			var getRsp = data.AMMSV0480GetRsp;
			var coreItem = getRsp.coreItem;
			this.itemList = getRsp.itemList;

			for (var i = 0; i < this.itemList.length; i++) {
				this.itemList[i].no = i;
			}

			switch(args.status){
			case 'OK':
				clutil.viewRemoveReadonly(this.$("#ca_form"));
				clutil.viewRemoveReadonly($("#ca_table"));
				$("#ca_table").removeClass('readonly');

				// args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				clutil.data2view(this.$("#ca_form"), coreItem);
				this.renderTable(this.itemList);

				this.state.recno = coreItem.recno;
				this.state.state = coreItem.state;

				this._addEvent();

				switch (this.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					// 事業ユニットは入力不可
					clutil.viewReadonly(this.$('#div_unitID'));
					this.resetFocus($("#ca_name"));
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					clutil.viewReadonly($("#ca_form"));
					clutil.inputRemoveReadonly($('#ca_fromDate'));

					clutil.inputRemoveReadonly($("#ca_csv_download"));
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
					clutil.viewReadonly($("#ca_form"));
					clutil.viewReadonly($("#ca_table"));
					$("#ca_table").addClass('readonly');

					clutil.inputRemoveReadonly($("#ca_csv_download"));
					break;
				}

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), coreItem);
				this.renderTable(this.itemList);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table"));
				$("#ca_table").addClass('readonly');
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table"));
				$("#ca_table").addClass('readonly');
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), coreItem);
				this.renderTable(this.itemList);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table"));
				$("#ca_table").addClass('readonly');
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table"));
				$("#ca_table").addClass('readonly');
				break;
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			// 事業ユニットselectpicker
			clutil.clbusunitselector($('#ca_unitID'));

			// 核商品区分
			clutil.cltypeselector($("#ca_coreitemTypeID"), amcm_type.AMCM_TYPE_COREITEM);

			// 対象期間
			clutil.datepicker($("#ca_startDate"));
			clutil.datepicker($("#ca_endDate"));

			clutil.cltxtFieldLimit($("#ca_name"));
			clutil.cltxtFieldLimit($("#ca_memo"));

			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLmakerItemCodeCompleted', this._onCLmakerItemCodeComplete);

			// 初期のアコーディオン展開状態をつくる。

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			this.mdBaseView.fetch();	// データを GET してくる。
			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// 新規の場合、適用期間の初期表示を行う
				var defaultDate = clcom.getOpeDate();
				$("#ca_startDate").datepicker("setIymd", defaultDate);
				$("#ca_endDate").datepicker("setIymd", defaultDate);

				this.renderTable([]);
				
				//初期フォーカス
				var $tgt = null;
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					$tgt = $("#ca_name");
				}
				else{
					$tgt = $("#ca_unitID").next().children('input');
				}
				this.resetFocus($tgt);
			}

			return this;
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			//console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var chkData = this.options.chkData[pgIndex];
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ		・・・これ、必要なの？					【確認】
				reqPage: {
				},
				// 取引先マスタ検索リクエスト
				AMMSV0480GetReq: {
					srchID: chkData.id,		// 商品ID
					delFlag: chkData.delFlag,	// 削除フラグ
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMMSV0480UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMMSV0480',
				data: getReq
			};
		},

		isValid: function() {
			var f_valid = true;
			if (!this.validator.valid()) {
				f_valid = false;
			}
			// 期間反転チェック
			if (!this.validator.validFromToObj([{
				$stval: $("#ca_startDate"),
				$edval: $("#ca_endDate"),
			}])) {
				f_valid = false;
			}
			return f_valid;
		},

		isValidTable: function() {
			var f_valid = true;
			// テーブル領域エラーチェック
			// テーブルデータを取りながら、行末空欄スキップと、入力チェックを行う。
		    var items = clutil.tableview2ValidData({
		        $tbody: this.$('#ca_table_tbody'),    // <tbody> の要素を指定する。
		        validator: this.validator,   // validator インスタンスを指定する。（どこのものでもかまわない）
		        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。//ラジオボタン選択値をとる
		        	if ((item.itgrpID != null && item.itgrpID.id != 0) ||
		        			(item.makerID != null && item.makerID.id != 0) ||
		        			item.makerItemCode != "" ||
		        			(_.isNumber(item.itemID) && item.itemID != 0)) {
		        		return false;
		        	} else {
			            return true;
		        	}
		        }
		    });
		    if(_.isEmpty(items)){
		        // 全部空欄行だったとか・・・
		        clutil.mediator.trigger('onTicker',clmsg.EGM0024);
		        f_valid = false;
		    }

			return f_valid;
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			this.validator.clear();
			this.validator2.clear();

			var f_error = false;
			// 入力チェック
			if (!this.isValid()) {
				f_error = true;
			}
			if (!this.isValidTable()) {
				f_error = true;
			}
			// テーブルのチェック
			var itemIDMap = {};
			var msg = clutil.fmtargs(clmsg.EGM0009, ["メーカー品番"]);
			_.each($("#ca_table_tbody tr"), _.bind(function(tr) {
				var $tr = $(tr);
				var $inputMakerID = $tr.find('input[name="ca_makerID"]');
				var $inputMakerCode = $tr.find('input[name="ca_makerItemCode"]');
				var $inputItemID = $tr.find('input[name="ca_itemID"]');
				var itemID = $inputItemID.val();

				if (itemID == 0) {
					/*
					 * エラーチェック済
					 */
					//this.validator2.setErrorMsg($inputMakerCode, "メーカー品番が入力されていません");
					//f_error = true;
				} else {
					if (itemIDMap[itemID] == true) {
						// 重複
						this.validator2.setErrorMsg($inputMakerID, msg);
						this.validator2.setErrorMsg($inputMakerCode, msg);
						f_error = true;
					} else {
						itemIDMap[itemID] = true;
					}
				}
			}, this));

			if (f_error) {
				this.validator2.setErrorHeader(clmsg.cl_echoback);
				return null;
			}

			var coreItem = clutil.view2data($("#ca_form"));

			var itemList = clutil.tableview2data($("#ca_table_tbody tr"));
			itemList = _.filter(itemList, _.bind(function(v) {
				return v.itemID != 0;
			}, this));

			if (itemList == null || itemList.length < 1) {
				var msg2 = clutil.fmtargs(clmsg.EMS0007, ["1"]);
				this.validator2.setErrorHeader(msg2);
				return null;
			}
			$.each(itemList, function() {
				delete this.divData;
				delete this.itgrpData;
				delete this.makerData;

				this.id = coreItem.id;
			});

			// 画面入力値をかき集めて、Rec を構築する。
			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: opeTypeId,
					recno: this.state.recno,
					state: this.state.state,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
				AMMSV0480GetReq: {
				},
				// 商品分類マスタ更新リクエスト
				AMMSV0480UpdReq: {
					coreItem: coreItem,
					itemList: itemList,
				},
			};
			return {
				resId: clcom.pageId,
				data:  updReq,
			};
		},

		/**
		 * サンプルダウンロード
		 */
		_onSampleDLClick: function() {
			clutil.download(this.sampleURL);
		},

		myTableview2data: function() {
			var trElem = $("#ca_table_tbody tr");
			var f_cut = true;
			var itemList = [];
			for (var i = trElem.length-1; i >= 0; i--) {
				var $tr = $(trElem.get(i));
//				var divCode = $tr.find('input[name="ca_divID"]').val().split(':')[0];
				var itgrpCode = $tr.find('input[name="ca_itgrpID"]').val().split(':')[0];
				var makerCode = $tr.find('input[name="ca_makerID"]').val().split(':')[0];
				var makerItemCode = $tr.find('input[name="ca_makerItemCode"]').val().split(':')[0];
				if (f_cut && _.isEmpty(/*divCode+*/ itgrpCode+makerCode+makerItemCode)) {
					continue;
				}
				f_cut = false;

				var item = {
//					divCode: divCode,
					itgrpCode: itgrpCode,
					makerCode: makerCode,
					makerItemCode: makerItemCode
				};
				itemList.splice(0, 0, item);
			}
			return itemList;
		},

		/**
		 * Excelデータ出力処理
		 */
		doDownload: function(rtype) {
			/*
			 * 1. 更新データを作成する
			 * 2. エラーチェックは無し
			 * 3. AMMSV0160にリクエストする
			 */

			// 1. 更新データを作成する
//			var itemList = clutil.tableview2data($("#ca_table_tbody tr"));
//			itemList = _.filter(itemList, _.bind(function(v) {
//				return v.itemID != 0;
//			}, this));
//			_.each(itemList, _.bind(function(item) {
//				item.divCode = item._view2data_divID_cn.code;
//				item.itgrpCode = item._view2data_itgrpID_cn.code;
//				item.makerCode = item._view2data_makerID_cn.code;
//			}, this));
			var itemList = this.myTableview2data();

			var req = {
					// 共通ヘッダ
					reqHead: {
						opeTypeId: rtype,
						recno: this.state.recno,
						state: this.state.state,
					},
					// 共通ページヘッダ
					reqPage: {
					},
					// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
					AMMSV0160GetReq: {
					},
					// 商品分類マスタ更新リクエスト
					AMMSV0160UpdReq: {
						bundle: null,
						stepList: [],
						itemList: itemList,
						zoneList: [],
						storeList: [],
						f_nodiv: 1,
					},
				};
			// 2. エラーチェックは無し

			// 3. AMMSV0160にリクエストする
			var url = "AMMSV0160";	// 組合せ販売商品登録
			var defer = clutil.postDLJSON(url, req);
			defer.fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		_doOpeAction: function(rtype, e) {
			console.log('_doOpeAction[' + rtype + ']');

			switch (rtype) {
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// Excelデータ出力
				this.doDownload(rtype);
				break;
			}
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			}
		},

		_eof: 'AMSSV0480.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////

		// 一覧画面からの引継データ pageArgs があれば渡す。
		//	pageArgs: {
		//		// 機能種別
		//		opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL,
		//		// 一覧画面で選択されたアイテム要素の配列
		//		chkData: [
		//			{id:1,code:'code-001',name:'item-001',},
		//			{id:2,code:'code-002',name:'item-002',},
		//			{id:3,code:'code-003',name:'item-003',}
		//		]
		//	};
		mainView = new MainView(clcom.pageArgs).initUIElement().render();
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
