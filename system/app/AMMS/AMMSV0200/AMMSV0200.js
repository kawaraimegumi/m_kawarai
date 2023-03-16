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
			'change #ca_unitID' : '_onUnitChange',
			'click #ca_table_tbody td[name="btn_delete"]': '_onDeleteRowClick',
			'click #ca_table_tfoot tr' : '_onAddRowClick',
		},

		state: {
			recno: "",
			state: 0,
		},

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
					title: 'セットアップ',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
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

			this.validator = clutil.validator(this.$('#ca_upper'), {
				echoback : $('.cl_echoback')
			});
			this.validator2 = clutil.validator(this.$("#ca_table"), {
				echoback : $('.cl_echoback')
			});
			this.validator3 = clutil.validator(this.$('#ca_mid'), {
				echoback : $('.cl_echoback')
			});

			// アプリ個別の View や部品をインスタンス化するとか・・・

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
				// XXX 確認：画面は何を表示するのか？？？						【確認】
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
			/*
			 * 行削除
			 */
//			$("#ca_table_tbody tr").each(function() {
//				var $tr = $(this);
//				$tr.find('td[name="btn_delete"]').click(function(e) {
//					$tr.remove();
//				});
//			});

			/*
			 * 事業ユニット変更イベント
			 */
			//$("#ca_unitID").change(this._onUnitChange);
		},

		/**
		 * メーカー品番変更イベント
		 * @param e
		 */
		_onMakerItemCodeChange: function(e) {
			var $tgt = $(e.target);

			var $td_maker = $tgt.parent().prev();
			var $input_maker = $td_maker.find('input');
			var data_maker = $input_maker.autocomplete('clAutocompleteItem');
			var maker_id = data_maker.id;

			var $td_itgrp = $td_maker.prev();
			var $input_itgrp = $td_itgrp.find('input');
			var data_itgrp = $input_itgrp.autocomplete('clAutocompleteItem');
			var itgrp_id = data_itgrp.id;
			var code = $(e.target).val();

			// codeの入力が不正ならば何もしない
			if (!this.isValidCode(e.target)) {
				return;
			}

			var srchFromDate = clutil.dateFormat($("#ca_fromDate").val(), 'yyyymmdd');
			var srchToDate = clutil.dateFormat($("#ca_toDate").val(), 'yyyymmdd');

			var arg = {
				itgrp_id: itgrp_id,
				maker_id: maker_id,
				maker_code: code,
				srchFromDate: srchFromDate,
				srchToDate: srchToDate,
			};

			clutil.clmakeritemcode2item(arg, e);
		},

		isValidCode: function(el) {
			var $el = $(el),
				value = $el.val(),
				validator = $el.attr('data-validator');

			var error = clutil.Validators.checkAll({
				validator: validator,
				value: value,
				$el: $el
			});

			if (error) {
				return false;
			}
			return true;
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
			this.validator2.clear();

			var $tgt = $(e.target);	// input;
			var $tr = $tgt.parents('tr');
			var $td_code = $tgt.parent();	// td(メーカー品番)
			var $td_name = $td_code.next();	// td(商品名)
			var $td_id = $td_code.next().next().next();
			var $input_itemID = $td_id.children('input');
			var $input_makerID = $tr.find('input[name="ca_makerID"]');
//			var $input_Div = $tr.find('input[name="ca_divID"]');
			var $input_ItgrpID = $tr.find('input[name="ca_itgrpID"]');

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
			if (!this.isValidItemID(itemID)) {
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
			 * 行削除
			 */
//			$tr_last.find('td[name="btn_delete"]').click(function(e) {
//				var $tgt_tr = $(this).parents('tr');
//				$tgt_tr.remove();
//			});

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
			var $inputItgrp = $tr_last.find("input[name='ca_itgrpID']");
			clutil.clitgrpcode($inputItgrp, optItgrp);
			$inputItgrp.on('autocompletechange', this._onItgrpChange);

			// メーカー
			var optMaker = {
				getVendorTypeId: this.getVendorTypeId,
				getUnitId: this.getUnitId,
			};
			var $inputMaker = $tr_last.find("input[name='ca_makerID']");
			clutil.clvendorcode($inputMaker, optMaker);
			$inputMaker.on('autocompletechange', this._onMakerChange);

			// 品番
			var $inputCode = $tr_last.find("input[name='ca_makerItemCode']");
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
			var $tbody = $("#ca_table_tbody");
			$tbody.empty();
			var that = this;

			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				var len = list.length;
				for (var i = len; i < 5; i++) {
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
					list.push(add_tmp);
				}
			}
			$.each(list, function() {
//				var dataDiv = {
//						id: this.divID,
//						code: this.divCode,
//						name: this.divName,
//					};
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
//				$inputDiv.on('autocompletechange', that._onDivChange);

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
				var $inputItgrp = $tr.find("input[name='ca_itgrpID']");
				clutil.clitgrpcode($inputItgrp, optItgrp);
				$inputItgrp.on('autocompletechange', that._onItgrpChange);


				var optMaker = {
					getVendorTypeId: that.getVendorTypeId,
					getUnitId: that.getUnitId,
				};
				var $inputMaker = $tr.find("input[name='ca_makerID']");
				clutil.clvendorcode($inputMaker, optMaker);
				$inputMaker.on('autocompletechange', that._onMakerChange);

				var $inputCode = $tr.find("input[name='ca_makerItemCode']");
				$inputCode.change(that._onMakerItemCodeChange);	// 変更イベント
				//clutil.mediator.on('onCLmakerItemCodeCompleted', _onCLmakerItemCodeComplete);

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
			var getRsp = data.AMMSV0200GetRsp;
			var setup = getRsp.setup;
			this.itemList = getRsp.itemList;

			for (var i = 0; i < this.itemList.length; i++) {
				this.itemList[i].no = i;
			}

			switch(args.status){
			case 'OK':
				clutil.viewRemoveReadonly(this.$("#ca_form"));
				clutil.viewRemoveReadonly($("#ca_table"));
				$("#ca_table").removeClass('readonly');

				clutil.inputReadonly(this.$("#ca_toDate"));

				switch (this.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					// fromDate調整
					if (setup.fromDate < clcom.getOpeDate()) {
						// 開始日が運用日以下の場合は、運用日＋１にする
						setup.fromDate = clcom.getOpeDate();
					}
					break;
				default:
					break;
				}

				// args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				clutil.data2view(this.$("#ca_form"), setup);
				this.renderTable(this.itemList);

				this.state.recno = setup.recno;
				this.state.state = setup.state;

				//this._addEvent();

				switch (this.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					// 事業ユニットは入力不可
					clutil.viewReadonly(this.$('#div_unitID'));

					this.resetFocus($("#ca_fromDate"));
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					clutil.viewReadonly($("#ca_form"));
					clutil.inputRemoveReadonly($('#ca_fromDate'));
					this.resetFocus($("#ca_fromDate"));
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
					clutil.viewReadonly($("#ca_form"));
					clutil.viewReadonly($("#ca_table"));
					$("#ca_table").addClass('readonly');
					break;
				}

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), setup);
				this.renderTable(this.itemList);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table"));
				$("#ca_table").addClass('readonly');
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table"));
				$("#ca_table").addClass('readonly');
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), setup);
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

			// 適用期間
			clutil.datepicker($("#ca_fromDate"));
			clutil.datepicker($("#ca_toDate"));

			// 事業ユニットselectpicker
			clutil.clbusunitselector($('#ca_unitID'));

			clutil.cltxtFieldLimit($("#ca_name"));
			clutil.cltxtFieldLimit($("#ca_memo"));

			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLmakerItemCodeCompleted', this._onCLmakerItemCodeComplete);

			// 適用期間終了日は、編集不可
			clutil.viewReadonly($("#div_ca_toDate"));

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
				var fromDate = clcom.getOpeDate();
				var toDate = clcom.max_date;
				$("#ca_fromDate").datepicker("setIymd", fromDate);
				$("#ca_toDate").datepicker("setIymd", toDate);

				this.renderTable([]);

				this.resetFocus($("#ca_fromDate"));
			} else if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
				// 「適用期間」を「削除日」にする
				this.$("#ca_upper").find('p.fieldName').text('削除日');
				this.$("#ca_upper").find('.deldspn').hide();

				this.$("#div_ca_fromDate").before('<p id="ca_tp_del"><span>?</span></p>');

				$("#ca_tp_del").addClass("txtInFieldUnit flright help").attr("data-original-title", "削除日以降、当セットアップは無効扱いとなります").tooltip({html: true});
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
				AMMSV0200GetReq: {
					srchID: chkData.id,		// 商品ID
					srchDate: chkData.toDate,		// 適用終了日
					delFlag: chkData.delFlag,	// 削除フラグ
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMMSV0200UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMMSV0200',
				data: getReq
			};
		},

		isValidTable: function() {
			var f_valid = true;
			// テーブル領域エラーチェック
			// テーブルデータを取りながら、行末空欄スキップと、入力チェックを行う。
		    var items = clutil.tableview2ValidData({
		        $tbody: this.$('#ca_table_tbody'),    // <tbody> の要素を指定する。
		        validator: this.validator,   // validator インスタンスを指定する。（どこのものでもかまわない）
		        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。//ラジオボタン選択値をとる
		        	if ((item.divID != null && item.divID.id != 0) ||
		        			(item.itgrpID != null && item.itgrpID.id != 0) ||
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
			this.validator3.clear();

			var f_error = false;

			if (!this.validator.valid()) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				f_error = true;
			}
			if (!this.validator3.valid()) {
				this.validator3.setErrorHeader(clmsg.cl_echoback);
				f_error = true;
			}
			if (!this.isValidTable()) {
				f_error = true;
			}

			// 日付チェック
			var ope_date = clcom.getOpeDate();
			var $fromDate = this.$("#ca_fromDate");//$toDate = this.$("#ca_toDate");
			var fromDate = clutil.dateFormat($fromDate.val(), 'yyyymmdd');
			var recfromDate = null;
			var rectoDate = null;
			if (this.options.chkData !== undefined && this.options.chkData.length > 0){
				recfromDate = this.options.chkData[pgIndex].fromDate;
				rectoDate = this.options.chkData[pgIndex].toDate;
			}
			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
				if (fromDate < ope_date){ // 開始日が今日以降でない
					this.validator.setErrorHeader(clmsg.cl_st_date_min_opedate);
					this.validator.setErrorMsg($fromDate, clmsg.cl_st_date_min_opedate);
					f_error = true;
				}
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				var compfromDate = ope_date < recfromDate ? recfromDate : ope_date;
				var msg = ope_date > recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
				if (ope_date >= recfromDate) {
					if (fromDate < compfromDate && rectoDate == clcom.max_date) {
						this.validator.setErrorHeader(msg);
						this.validator.setErrorMsg($fromDate, msg);
						f_error = true;
					}
				} else {
					if (fromDate < compfromDate && rectoDate == clcom.max_date) {
						this.validator.setErrorHeader(msg);
						this.validator.setErrorMsg($fromDate, msg);
						f_error = true;
					}
				}
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				if (fromDate <= ope_date || fromDate < recfromDate){ // 設定開始日が明日以降かつ編集前開始日以降でない
					var msg = ope_date >= recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
					this.validator.setErrorHeader(msg);
					this.validator.setErrorMsg($fromDate, msg);
					f_error = true;
				}
				break;
			default:
				break;
			}
			if(f_error){ // エラーチェック毎にメッセージが決まっている⇒複数ある場合、一気に表示できていない。
				return null;
			}

			// テーブルのチェック
			var itemIDMap = {};
			var msg = clutil.fmtargs(clmsg.EGM0009, ["メーカー品番"]);
			_.each($("#ca_table_tbody tr"), _.bind(function(tr) {
				var $tr = $(tr);
//				var $inputDiv = $tr.find('input[name="ca_divID"]');
				var $inputItgrpID = $tr.find('input[name="ca_itgrpID"]');
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
//						this.validator2.setErrorMsg($inputDiv, msg);
						this.validator2.setErrorMsg($inputItgrpID, msg);
						this.validator2.setErrorMsg($inputMakerID, msg);
						this.validator2.setErrorMsg($inputMakerCode, msg);
						f_error = true;
					} else {
						itemIDMap[itemID] = true;
					}
				}
			}, this));

			if (f_error) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return null;
			}

			var setup = clutil.view2data($("#ca_form"));

			var itemList = clutil.tableview2data($("#ca_table_tbody tr"));
			itemList = _.filter(itemList, _.bind(function(v) {
				return v.itemID != 0;
			}, this));
			if (itemList == null || itemList.length < 2) {
				var msg2 = clutil.fmtargs(clmsg.EMS0007, ["2"]);
				this.validator2.setErrorHeader(msg2);
				return null;
			}

			$.each(itemList, function() {
//				delete this.divData;
				delete this.itgrpData;
				delete this.makerData;

				this.id = setup.id;
				this.fromDate = setup.fromDate;
				this.toDate = setup.toDate;
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
				AMMSV0200GetReq: {
				},
				// 商品分類マスタ更新リクエスト
				AMMSV0200UpdReq: {
					setup: setup,
					itemList: itemList,
				},
			};
			return {
				resId: clcom.pageId,
				data:  updReq,
			};

		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			}
		},

		_eof: 'AMSSV0200.MainView//'
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
