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
			"click #ca_table2_tfoot tr" : "_onAddRowClick2",
			"click #ca_table3_tfoot tr" : "_onAddRowClick3",
			"click #ca_table4_tfoot tr" : "_onAddRowClick4",
			"click #ca_table2_tbody tr td[name='td_delete']": "_onDelRowClick2",
			"click #ca_table3_tbody tr td[name='td_delete']": "_onDelRowClick3",
			"click #ca_table4_tbody tr td[name='td_delete']": "_onDelRowClick4",
			"change #ca_zoneFlag": "_onZoneFlagChanged",
			"change #ca_storeFlag": "_onStoreFlagChanged",

			'click #ca_csv_download'	: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
		},

		state: {
			recno: "",
			state: 0,
		},

		relno: 0,
		itemList: [],

		sampleURL: "/public/sample/対象商品リストサンプル（部門なし）.xlsx",

		/*
		 * シスパラ
		 */
		__PAR_AMMS_DEFAULT_ORG_FUNCID: 1,
		__PAR_AMMS_STORE_LEVELID: 6,
		__PAR_AMMS_ZONE_LEVELID: 4,

		/**
		 * ページャー作成
		 */
		buildPaginationView: function(groupid, $elem){
			var pagerViews = [];
			$.each($elem.find('.pagination-wrapper'), function(arg){
				var opt = {
					el: this,
					groupid: groupid,
					pgOptions: {
						itemsOnPageSelection: [ 20 ]
					}
				};
				pagerViews.push(new clutil.View.PaginationView(opt));
			});
			return pagerViews;
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

			// グループID -- AMMSV0160 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMMSV0160';

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '組合せ販売マスタ',
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

			// ページャ
			this.pagerViews = this.buildPaginationView(groupid, this.$el);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$("#ca_main2"), {
				echoback		: $('.cl_echoback').hide()
			});
			this.validator2 = clutil.validator(this.$("#ca_table2"), {
				echoback		: $('.cl_echoback').hide()
			});
			this.validator3 = clutil.validator(this.$("#ca_main3"), {
				echoback		: $('.cl_echoback').hide()
			});

			// シスパラ取得
			this.__PAR_AMMS_DEFAULT_ORG_FUNCID = clcom.getSysparam(amcm_sysparams.PAR_AMMS_DEFAULT_ORG_FUNCID);
			this.__PAR_AMMS_STORE_LEVELID = clcom.getSysparam(amcm_sysparams.PAR_AMMS_STORE_LEVELID);
			this.__PAR_AMMS_ZONE_LEVELID = clcom.getSysparam(amcm_sysparams.PAR_AMMS_ZONE_LEVELID);

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

			clutil.mediator.on('onPageClickBefore', this._onPageClickBefore);	// ページクリック処理を行う前
			clutil.mediator.on('onSelectChangeBefore', this._onPageClickBefore);
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			clutil.mediator.on('onOperation', this._doOpeAction);	// Excelデータ出力用
			this.opeTypeId = fixopt.opeTypeId;	// 処理区分を保存
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table1"));
				clutil.viewReadonly($("#ca_table2"));
				clutil.viewReadonly($("#ca_table3"));
				clutil.viewReadonly($("#ca_table4"));

				$("#ca_table2").addClass('readonly');
				$("#ca_table3").addClass('readonly');
				$("#ca_table4").addClass('readonly');
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table1"));
				clutil.viewReadonly($("#ca_table2"));
				clutil.viewReadonly($("#ca_table3"));
				clutil.viewReadonly($("#ca_table4"));

				$("#ca_table2").addClass('readonly');
				$("#ca_table3").addClass('readonly');
				$("#ca_table4").addClass('readonly');
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table1"));
				clutil.viewReadonly($("#ca_table2"));
				clutil.viewReadonly($("#ca_table3"));
				clutil.viewReadonly($("#ca_table4"));

				$("#ca_table2").addClass('readonly');
				$("#ca_table3").addClass('readonly');
				$("#ca_table4").addClass('readonly');
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				var rspHead = args.data.rspHead;
				this.mdBaseView.validator.setErrorInfoFromSrv(rspHead.fieldMessages, {prefix: 'ca_'});
				if (rspHead.message == "EMS0164" || rspHead.message == "EMS0165") {	// FIXME 多分あってると思うけど
					// ダイアログを表示する
					var msg = clutil.fmtargs(clutil.getclmsg(rspHead.message), rspHead.args);
					clutil.ErrorDialog(msg);
				}
				_.each(rspHead.fieldMessages, _.bind(function(fieldMessage) {
					var field = 'ca_' + fieldMessage.field_name;
					if (field == 'ca_makerItemCode' ||
							field == 'ca_makerID' ||
							field == 'ca_rank') {
						var $tr = $("#ca_table2_tbody tr").eq(fieldMessage.lineno);
						var $input = $tr.find('input[name="' + field + '"]');
						var message = clutil.getclmsg(fieldMessage.message);
						var msg = clutil.fmtargs(message, fieldMessage.args);
						this.validator2.setErrorMsg($input, msg);
					}
				}, this));
				break;
			}
//			var itemList = this.getItemListByPage(0);
//			this.renderTable2(itemList);
		},

		/**
		 * 行追加・削除イベント追加
		 */
		_addEvent: function() {
			/*
			 * 行削除
			 */
			$("#ca_table2_tbody tr").each(function() {
				var $tr = $(this);
				$tr.find('td[name="td_delete"]').click(function(e) {
					$tr.remove();
				});
			});
			$("#ca_table3_tbody tr").each(function() {
				var $tr = $(this);
				$tr.find('td[name="td_delete"]').click(function(e) {
					$tr.remove();
				});
			});
			$("#ca_table4_tbody tr").each(function() {
				var $tr = $(this);
				$tr.find('td[name="td_delete"]').click(function(e) {
					$tr.remove();
				});
			});
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
			var code = $tgt.val();

			var srchFromDate = clutil.dateFormat($("#ca_saleStartDate").val(), 'yyyymmdd');
			var srchToDate = clutil.dateFormat($("#ca_saleEndDate").val(), 'yyyymmdd');

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
			_.each($("#ca_table2_tbody tr"), _.bind(function(tr) {
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
			//var $input_Div = $tr.find('input[name="ca_divID"]');
			var $input_ItgrpID = $tr.find('input[name="ca_itgrpID"]');
			var $input_itemName = $tr.find('input[name="ca_itemName"]');

			var head = data.data.head;
			if (head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_NG) {
				// 検索失敗
				var msg = clutil.getclmsg(head.message, head.args);
				//this.validator2.setErrorMsg($input_Div, msg);
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
				//this.validator2.setErrorMsg($input_Div, msg);
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

		_onDelRowClick2: function(e) {
			var $table = $("#ca_table2");
			if ($table.hasClass('readonly')) {
				return;
			}
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');
			var no = Number($tr.attr('name'));
			for (var i=0; i < this.itemList.length; i++) {
				if (this.itemList[i].no == no) {
					this.itemList.splice(i, 1);
					break;
				}
			}
			$tr.remove();
		},

		_onAddRowClick2: function(e) {
			var $table = $("#ca_table2");
			if ($table.hasClass('readonly')) {
				return;
			}
			switch (this.options.opeTypeId) {
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				break;
			default:
				return;
			}
			var $tbody = $("#ca_table2_tbody");
			// 行番号を調べる
			// 空データ挿入
			var add_tmp = {
				no: this.itemLineNo++,
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
				editableFlag: 1,
			};
			var tr = _.template($("#ca_rec_template2").html(), add_tmp);
			$tbody.append(tr);

			var $tr_last = $tbody.find('tr:last');
			/*
			 * 行削除
			 */
//			$tr_last.find('td[name="td_delete"]').click(function(e) {
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
//			var $inputDiv = $tr_last.find('input[name="ca_divID"]');
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
			var $inputItgrp = $tr_last.find('input[name="ca_itgrpID"]');
			clutil.clitgrpcode($inputItgrp, optItgrp);
			$inputItgrp.on('autocompletechange', this._onItgrpChange);

			// メーカー
			var optMaker = {
				getVendorTypeId: this.getVendorTypeId,
				getUnitId: this.getUnitId,
			};
			var $inputMaker = $tr_last.find('input[name="ca_makerID"]');
			clutil.clvendorcode($inputMaker, optMaker);
			$inputMaker.on('autocompletechange', this._onMakerChange);

			// 品番
			var $inputCode = $tr_last.find('input[name="ca_makerItemCode"]');
			$inputCode.change(this._onMakerItemCodeChange);	// 変更イベント


			clutil.initUIelement($("#ca_table2"));
		},

		_onDelRowClick3: function(e) {
			var $table = $("#ca_table3");
			if ($table.hasClass('readonly')) {
				return;
			}
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');
			$tr.remove();
		},

		/**
		 * ゾーンテーブル イベント追加
		 * @param e
		 */
		_onAddRowClick3: function(e) {
			var $table = $("#ca_table3");
			if ($table.hasClass('readonly')) {
				return;
			}
			switch (this.options.opeTypeId) {
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				break;
			default:
				return;
			}
			var $tbody = $("#ca_table3_tbody");
			// 空データ
			var add_tmp = {
				no: 0,
				orgID: 0,
				orgCode: "",
				orgName: "",
			};
			var tr = _.template($("#ca_rec_template3").html(), add_tmp);
			$tbody.append(tr);

			var $tr_last = $tbody.find('tr:last');
			/*
			 * 行削除
			 */
			$tr_last.find('td[name="td_delete"]').click(function(e) {
				var $tgt_tr = $(this).parent();
				$tgt_tr.remove();
			});

			/*
			 * autocomplete
			 */
			var unitID = Number($("#ca_unitID").val());
			// ゾーン(組織)
			var $inputZone = $tr_last.find('input[name="ca_orgID"]');
			var optZone = {
				el: $inputZone,
				dependAttrs: {
					p_org_id: unitID,
					orgfunc_id: Number(this.__PAR_AMMS_DEFAULT_ORG_FUNCID),
					orglevel_id: Number(this.__PAR_AMMS_ZONE_LEVELID),
				},
			};
			clutil.clorgcode(optZone);

			clutil.initUIelement($("#ca_table3"));
		},

		_onDelRowClick4: function(e) {
			var $table = $("#ca_table4");
			if ($table.hasClass('readonly')) {
				return;
			}
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');
			$tr.remove();
		},

		/**
		 * ゾーンテーブル イベント追加
		 * @param e
		 */
		_onAddRowClick4: function(e) {
			var $table = $("#ca_table4");
			if ($table.hasClass('readonly')) {
				return;
			}
			switch (this.options.opeTypeId) {
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				break;
			default:
				return;
			}
			var $tbody = $("#ca_table4_tbody");
			// 空データ
			var add_tmp = {
				no: 0,
				orgID: 0,
				orgCode: "",
				orgName: "",
			};
			var tr = _.template($("#ca_rec_template4").html(), add_tmp);
			$tbody.append(tr);

			var $tr_last = $tbody.find('tr:last');
			/*
			 * 行削除
			 */
			$tr_last.find('td[name="td_delete"]').click(function(e) {
				var $tgt_tr = $(this).parent();
				$tgt_tr.remove();
			});

			/*
			 * autocomplete
			 */
			var unitID = Number($("#ca_unitID").val());
			// 店舗(組織)
			var $inputStore = $tr_last.find('input[name="ca_orgID"]');
			var optStore = {
				el: $inputStore,
				dependAttrs: {
					p_org_id: unitID,
					orgfunc_id: Number(this.__PAR_AMMS_DEFAULT_ORG_FUNCID),
					orglevel_id: Number(this.__PAR_AMMS_STORE_LEVELID),
				},
			};
			clutil.clorgcode(optStore);

			clutil.initUIelement($("#ca_table4"));
		},

		/**
		 * テーブル描画(組合せ段階)
		 * @param list
		 */
		renderTable1: function(list, st_date) {
			var _this = this;
			var $tbody = $("#ca_table1_tbody");
			$tbody.empty();

			var n = 0;
			$.each(list, function() {
				var tr = _.template($("#ca_rec_template1").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);
				/*
				 * 開始日が運用日よりも前の場合は、金額以外は操作不可
				 */
				if (this.id > 0 && !_this.editableFlag) {
					var $tr = $tbody.find('tr:last');
					var $qy = $tr.find('input[name="ca_qy"]');
					clutil.inputReadonly($qy);
				}
				n++;
			});
			for (var i = n; i < 5; i++) {
				// 5行まで空行を追加する
				var add_tmp = {
					no: 0,
					step: i+1,
					qy: "",
					am: "",
				};
				var tr = _.template($("#ca_rec_template1").html(), add_tmp);
				$tbody.append(tr);
				if (this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
						&& !this.editableFlag) {
					var $tr = $tbody.find('tr:last');
					clutil.inputReadonly($tr.find('input'));
				}
			}
			var $tr1 = $tbody.find('tr:first');
			var $tr1_qy = $tr1.find('input[name="ca_qy"]');
			var $tr1_am = $tr1.find('input[name="ca_am"]');

			$tr1_qy.addClass('cl_valid cl_required');
			$tr1_am.addClass('cl_valid cl_required');

			switch (this.options.opeTypeId) {
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				this._addEvent_table1();
				break;
			default:
				break;
			}
		},
		_addEvent_table1: function() {
			$("#ca_table1_tbody tr").each(function() {
				var $tr = $(this);

				$tr.find('input[name="ca_qy"]').change(function(e) {
					var $input_qy = $(e.target);
					var qy = $input_qy.val();
					qy = qy == null ? 0 : Number(qy.split(",").join(''));

					var $input_am = $input_qy.parent().next().find('input[name="ca_am"]');
					var am = $input_am.val();
					am = am == null ? 0 : Number(am.split(",").join(''));

					var ave = qy == 0 ? "" : clutil.comma(Math.round(am/qy));
					ave = ave == "NaN" ? "" : ave;

					var $td_ave = $input_qy.parent().parent().find('td[name="ca_average"]');
					$td_ave.text(ave);
				});

				var $ca_am = $tr.find('input[name="ca_am"]');
				$ca_am.change(function(e) {
					var $input_am = $(e.target);
					var am = $input_am.val();
					am = am == null ? 0 : Number(am.split(",").join(''));

					var $input_qy = $input_am.parent().parent().find('input[name="ca_qy"]');
					var qy = $input_qy.val();
					qy = qy == null ? 0 : Number(qy.split(",").join(''));

					var ave = qy == 0 ? "" : clutil.comma(Math.round(am/qy));
					ave = ave == "NaN" ? "" : ave;

					var $td_ave = $input_am.parent().parent().find('td[name="ca_average"]');
					$td_ave.text(ave);
				});
			});
		},
		/**
		 * テーブル描画(対象商品)
		 * @param list
		 */
		renderTable2: function(list, st_date) {
			var _this = this;
			list = list == null ? [] : list;
			var curno = 0;
			for (var i=0; i < list.length; i++) {
				if (list[i].no > curno) {
					curno = list[i].no;
				}
			}

			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				var len = list.length;
				for (var i = len; i < 5; i++) {
					// ５行になるまで空データを入れる
					curno++;
					var add_tmp = {
						no: curno,
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
						editableFlag: 1,
					};
					list.push(add_tmp);
				}
			}

			var $tbody = $("#ca_table2_tbody");
			$tbody.empty();
			$.each(list, function() {
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
				var tr = _.template($("#ca_rec_template2").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);

				var $tr = $tbody.find('tr:last');	// 追加した行

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
				var $inputItgrp = $tr.find('input[name="ca_itgrpID"]');
				clutil.clitgrpcode($inputItgrp, optItgrp);
				$inputItgrp.on('autocompletechange', _this._onItgrpChange);


				var optMaker = {
					getVendorTypeId: _this.getVendorTypeId,
					getUnitId: _this.getUnitId,
				};
				var $inputMaker = $tr.find('input[name="ca_makerID"]');
				clutil.clvendorcode($inputMaker, optMaker);
				$inputMaker.on('autocompletechange', _this._onMakerChange);

				var $inputCode = $tr.find('input[name="ca_makerItemCode"]');
				$inputCode.change(_this._onMakerItemCodeChange);	// 変更イベント

				/*
				 * TODO 開始日(saleStartDate)の翌日以降の場合は、各inputをReadonly(disable?)にする
				 */
				if (_this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
						&& !this.editableFlag) {
					clutil.inputReadonly($tr.find('input'));
					var $td_name = $tr.find("td[name='td_delete']");
					$td_name.empty();
					$td_name.removeAttr('name');
				}
				// 改めてデータをセット
				$inputItgrp.autocomplete('clAutocompleteItem', dataItgrp);
				$inputMaker.autocomplete('clAutocompleteItem', dataMaker);
			});
			if (this.$("#ca_table2").hasClass('readonly')) {
				clutil.viewReadonly($("#ca_table2"));
			}
		},

		_onUnitChange: function(e) {
			// 部門クリア
			//$('input[name="ca_divID"]').autocomplete('removeClAutocompleteItem');
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
		 * テーブル描画(ゾーン)
		 * @param list
		 */
		renderTable3: function(list, unitID) {
			var _this = this;
			var $tbody = $("#ca_table3_tbody");
			$tbody.empty();
			$.each(list, function() {

				var dataZone = {
					id: this.orgID,
					code: this.orgCode,
					name: this.orgName,
				};
				var tr = _.template($("#ca_rec_template3").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);

				var $tr = $tbody.find('tr:last');	// 追加した行

				// autocomplete初期化
				// ゾーン
				var $inputZone = $tr.find('input[name="ca_orgID"]');
				var optZone = {
					el: $inputZone,
					dependAttrs: {
						p_org_id: unitID,
						orgfunc_id: Number(_this.__PAR_AMMS_DEFAULT_ORG_FUNCID),
						orglevel_id: Number(_this.__PAR_AMMS_ZONE_LEVELID),
					},
				};
				clutil.clorgcode(optZone);

				// 改めてデータをセット
				$inputZone.autocomplete('clAutocompleteItem', dataZone);

			});
		},
		/**
		 * テーブル描画(店舗)
		 * @param list
		 */
		renderTable4: function(list, unitID) {
			var _this = this;
			var $tbody = $("#ca_table4_tbody");
			$tbody.empty();
			$.each(list, function() {

				var dataStore = {
					id: this.orgID,
					code: this.orgCode,
					name: this.orgName,
				};
				var tr = _.template($("#ca_rec_template4").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);

				var $tr = $tbody.find('tr:last');	// 追加した行

				// autocomplete初期化
				// 店舗
				var $inputStore = $tr.find('input[name="ca_orgID"]');
				var optStore = {
					el: $inputStore,
					dependAttrs: {
						p_org_id: unitID,
						orgfunc_id: Number(_this.__PAR_AMMS_DEFAULT_ORG_FUNCID),
						orglevel_id: Number(_this.__PAR_AMMS_STORE_LEVELID),
					},
				};
				clutil.clorgcode(optStore);

				// 改めてデータをセット
				$inputStore.autocomplete('clAutocompleteItem', dataStore);
			});
		},

		/**
		 * 対象ゾーンを指定する クリックイベント
		 * @param e
		 */
		_onZoneFlagChanged: function(e) {
			var $tgt = $(e.target);
			var val = $tgt.attr("checked");
			var $tgt_div = $("#ca_div_zone");

			$tgt_div.toggleClass('dispn');	// 表示状態をトグル
			if (val == null) {
				// ゾーンを使用しないので、テールをクリアする
				var $tgt_table = $("#ca_table3_tbody");
				$tgt_table.empty();
			}
		},

		/**
		 * 対象店舗を指定する クリックイベント
		 * @param e
		 */
		_onStoreFlagChanged: function(e) {
			var $tgt = $(e.target);
			var val = $tgt.attr("checked");
			var $tgt_div = $("#ca_div_store");

			$tgt_div.toggleClass('dispn');	// 表示状態をトグル
			if (val == null) {
				// 店舗を使用しないので、テールをクリアする
				var $tgt_table = $("#ca_table4_tbody");
				$tgt_table.empty();
			}
		},

		pagechange: 0,
		/**
		 * ページ切り替え前の処理 編集内容の保存を行う
		 * @param ev
		 */
		_onPageClickBefore: function(ev) {
			console.log('pagechange=' + this.pagechange++);
			// itemIDをキーとしたマップを作成
			var map = {};
			for (var i = 0; i < this.itemList.length; i++) {
				var item = this.itemList[i];
				map[item.no] = item;
			}
			var def = {};
			if (this.itemList[0]) {
				def.id = this.itemList[0].id;
			}
			//var def = _.clone(this.itemList[0]) || {};

			var add_list = [];

			var $tbody = this.$("#ca_table2_tbody");
			_.each($tbody.find('tr'), _.bind(function(tr) {
				var $tr = $(tr);
				var trobjs = clutil.tableview2data($tr);
				var obj = trobjs[0];
				var no = Number($tr.attr('name'));
				if (_.isNaN(no)) {
					// そもそもおかしい
					return;
				}
				if (obj.editableFlag) {
					obj.editableFlag = parseInt(obj.editableFlag);
				}
				var item = map[no];
				if (item == null) {
					// 見つからないのは行追加したためなので、this.itemListの最後に突っ込む
					var tmp = _.clone(def);
					obj.no = no;
					if (obj._view2data_itgrpID_cn) {
						obj.itgrpCode = obj._view2data_itgrpID_cn.code;
						obj.itgrpName = obj._view2data_itgrpID_cn.name;
					} else {
						obj.itgrpCode = "";
						obj.itgrpName = "";
					}
					if (obj._view2data_makerID_cn) {
						obj.makerCode = obj._view2data_makerID_cn.code;
						obj.makerName = obj._view2data_makerID_cn.name;
					} else {
						obj.makerCode = "";
						obj.makerName = "";
					}
					_.extend(tmp, obj);
//					delete tmp.divData;
//					delete tmp._view2data_itgrpID_cn;
//					delete tmp._view2data_makerID_cn;
					add_list.push(tmp);
					return;
				}
				_.extend(item, obj);
				console.log(item, obj);
			}, this));
//			var trobjs = clutil.tableview2data($tbody.find('tr'));
//			for (var i=0; i < trobjs.length; i++) {
//				var obj = trobjs[i];
//				if (obj.itemID == null || obj.itemID == 0 || obj.itemID == "") {
//					// 商品が未入力な行は無視
//					continue;
//				}
//				if (obj.editableFlag) {
//					obj.editableFlag = parseInt(obj.editableFlag);
//				}
//				var item = map[obj.itemID];
//				if (item == null) {
//					// 見つからないのは行追加したためなので、this.itemListの最後に突っ込む
//					var tmp = _.clone(def);
//					_.extend(tmp, obj);
//					delete tmp.divData;
//					delete tmp.itgrpData;
//					delete tmp.makerData;
//					add_list.push(tmp);
//					continue;
//				}
//				_.extend(item, obj);
//				console.log(item, obj);
//			}
			for (var i=0; i < add_list.length; i++) {
				this.itemList.push(add_list[i]);
			}
		},
		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){

			console.log(arguments);

			if(groupid !== 'AMMSV0160'){
				return;
			}

			this.toNextPage(pageReq);
		},

		/**
		 * ページ切替処理
		 */
		toNextPage: function(pageReq){
			var itemList = this.getItemListByPage(pageReq.start_record);
			this.renderTable2(itemList);

			this.curPageReq = pageReq;
		},

		/**
		 * 商品リストから指定ページを切り出す
		 * @param page
		 * @returns {Array}
		 */
		getItemListByPage: function(start) {
			var len = this.itemList.length;
			var end = start + 20;
			end = end > len ? len : end;
			var list = [];

			for (var i = start; i < end; i++) {
				list.push(this.itemList[i]);
			}
			var pageRsp = {
					curr_record: start,
					total_record: len,
					page_size: 20
			};
			for (var i = 0; i < this.pagerViews.length; i++) {
				this.pagerViews[i]._setPageRsp('AMMSV0160', pageRsp);
			}
			return list;
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			var data = args.data;
			var getRsp = data.AMMSV0160GetRsp;
			var bundle = getRsp.bundle;

			this.editableFlag = bundle.editableFlag;	// 編集可能フラグ

			this.stepList = getRsp.stepList;
			this.itemList = getRsp.itemList;
			this.zoneList = getRsp.zoneList;
			this.storeList = getRsp.storeList;

			for (var i = 0; i < this.stepList.length; i++) {
				this.stepList[i].no = i;
			}

			this.itemLineNo = 0;
			for (var i = 0; i < this.itemList.length; i++) {
				this.itemList[i].no = this.itemLineNo;
				this.itemLineNo++;
			}

			for (var i = 0; i < this.zoneList.length; i++) {
				this.zoneList[i].no = i;
			}

			for (var i = 0; i < this.storeList.length; i++) {
				this.storeList[i].no = i;
			}

			bundle.zoneFlag = this.zoneList.length > 0 ? true : false;
			bundle.storeFlag = this.storeList.length > 0 ? true : false;

			clutil.viewRemoveReadonly($("#ca_form"));
			clutil.viewRemoveReadonly($("#ca_table1"));
			clutil.viewRemoveReadonly($("#ca_table2"));
			clutil.viewRemoveReadonly($("#ca_table3"));
			clutil.viewRemoveReadonly($("#ca_table4"));

			$("#ca_table2").removeClass('readonly');
			$("#ca_table3").removeClass('readonly');
			$("#ca_table4").removeClass('readonly');

			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				clutil.data2view(this.$("#ca_form"), bundle);
				if (bundle.zoneFlag) {
					$("#ca_div_zone").removeClass('dispn');
				} else {
					$("#ca_div_zone").addClass('dispn');
				}
				if (bundle.storeFlag) {
					$("#ca_div_store").removeClass('dispn');
				} else {
					$("#ca_div_store").addClass('dispn');
				}
				this.renderTable1(this.stepList);
				var itemList = this.getItemListByPage(0);
				this.renderTable2(itemList);
				this.renderTable3(this.zoneList, bundle.unitID);
				this.renderTable4(this.storeList, bundle.unitID);

				this.state.recno = bundle.recno;
				this.state.state = bundle.state;

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
//					this._addEvent();
					break;
				default:
					break;
				}

				//this._onItgrpFuncChange();

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					// 事業ユニットは入力不可
					clutil.viewReadonly(this.$('#div_unitID'));
					this.resetFocus($("#ca_name"));

					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
					clutil.viewReadonly($("#ca_form"));
					clutil.viewReadonly($("#ca_table1"));
					clutil.viewReadonly($("#ca_table2"));
					clutil.viewReadonly($("#ca_table3"));
					clutil.viewReadonly($("#ca_table4"));

					$("#ca_table2").addClass('readonly');
					$("#ca_table3").addClass('readonly');
					$("#ca_table4").addClass('readonly');

					clutil.inputRemoveReadonly($("#ca_csv_download"));
					break;
				}

				// 販売開始日の制御
				var ope_date = clcom.getOpeDate();
				if (bundle.saleStartDate <= ope_date) {
					// 販売開始日≦運用日の場合は操作不可にする
					clutil.viewReadonly($("#div_ca_saleStartDate"));
				}
				if (!this.editableFlag) {
					clutil.viewReadonly($("#div_discTypeID"));
				}

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), bundle);
				this.renderTable1(this.stepList);
				this.renderTable2(this.getItemListByPage(0));
				this.renderTable3(this.zoneList);
				this.renderTable4(this.storeList);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table1"));
				clutil.viewReadonly($("#ca_table2"));
				clutil.viewReadonly($("#ca_table3"));
				clutil.viewReadonly($("#ca_table4"));

				$("#ca_table2").addClass('readonly');
				$("#ca_table3").addClass('readonly');
				$("#ca_table4").addClass('readonly');
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table1"));
				clutil.viewReadonly($("#ca_table2"));
				clutil.viewReadonly($("#ca_table3"));
				clutil.viewReadonly($("#ca_table4"));

				$("#ca_table2").addClass('readonly');
				$("#ca_table3").addClass('readonly');
				$("#ca_table4").addClass('readonly');
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), bundle);
				this.renderTable1(this.stepList);
				this.renderTable2(this.getItemListByPage(0));
				this.renderTable3(this.zoneList);
				this.renderTable4(this.storeList);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table1"));
				clutil.viewReadonly($("#ca_table2"));
				clutil.viewReadonly($("#ca_table3"));
				clutil.viewReadonly($("#ca_table4"));

				$("#ca_table2").addClass('readonly');
				$("#ca_table3").addClass('readonly');
				$("#ca_table4").addClass('readonly');
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table1"));
				clutil.viewReadonly($("#ca_table2"));
				clutil.viewReadonly($("#ca_table3"));
				clutil.viewReadonly($("#ca_table4"));

				$("#ca_table2").addClass('readonly');
				$("#ca_table3").addClass('readonly');
				$("#ca_table4").addClass('readonly');
				break;
			}
		},

		/**
		 * 事業ユニットIDを取得する
		 * @returns
		 */
		getParentId: function() {
			var id = $("#ca_unitID").val();
			id = id == null ? 0 : id;
			return id;
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			// 組織別上代
			var org_price = clcom.getSysparam(amcm_sysparams.PAR_AMMS_ORG_PRICE);

			// 事業ユニットselectpicker
			clutil.clbusunitselector($('#ca_unitID'));

			// 値下げ区分
			var ids = [ amcm_type.AMCM_VAL_DISC_METHOD_DISCOUNT, amcm_type.AMCM_VAL_DISC_METHOD_PRICE];
			clutil.cltypeselector({
				$select: $("#ca_discTypeID"),
				kind: amcm_type.AMCM_TYPE_DISC_METHOD,
				ids: ids,
			});

			// 期間
			clutil.datepicker($("#ca_saleStartDate"));
			clutil.datepicker($("#ca_saleEndDate"));

			clutil.cltxtFieldLimit($("#ca_name"));

			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLmakerItemCodeCompleted', this._onCLmakerItemCodeComplete);

			// 組織別上代非表示？
			if (org_price == 0) {
				$("#div_org_price").addClass('dispn');
			}

			// 初期のアコーディオン展開状態をつくる。

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// 新規登録の場合は組合せ段階の初期表示を行う
				this.renderTable1({});

				// ゾーン、店舗は非表示
				$("#ca_div_zone").addClass("dispn");
				$("#ca_div_store").addClass("dispn");

				var fromDate = clutil.addDate(clcom.getOpeDate(), 1);
				$("#ca_saleStartDate").datepicker("setIymd", fromDate);
				$("#ca_saleEndDate").datepicker("setIymd", fromDate);


				var $focusElem = null;
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					$focusElem = $("#ca_name");
				}
				else{
					$focusElem = $("#ca_unitID").next().children('input');
				}

				this.resetFocus($focusElem);
			}
			return this;
		},

		/**
		 * CSVアップロード前の入力チェック処理
		 * @returns {Boolean}
		 */
		_beforeShowFileChooser: function() {
			var ret = true;
			if (!this.validator3.valid()) {
				ret = false;
			}
			if (!this.validator3.validFromTo([{stval: "ca_saleStartDate", edval: "ca_saleEndDate"}])) {
				ret = false;
			}
			return ret;
		},
		/**
		 * CSVアップロード
		 */
		_addFileInput: function() {
			// CSV取込
			this.fileInput = clutil.fileInput({
				files: [],
				fileInput: "#ca_csvinput1",
				showDialogOnSuccess : false,
				showDialogOnError : false,
				beforeShowFileChooser: this._beforeShowFileChooser
			});

			this.fileInput.on('success', _.bind(function(file){
				this.mdBaseView.validator.clear();
				console.log('成功', file);
				var unitID = $("#ca_unitID").val();
				var saleStartDate = $("#ca_saleStartDate").val();
				var saleEndDate = $("#ca_saleEndDate").val();
				saleStartDate = clutil.dateFormat(saleStartDate, 'yyyymmdd');
				saleEndDate = clutil.dateFormat(saleEndDate, 'yyyymmdd');
				var bundle = clutil.view2data($("#ca_form"));
				var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT,
						fileId: file.id,
					},
					AMMSV0160CsvReq: {
						bundle: bundle,
						unitID: unitID,
						srchFromDate: saleStartDate,
						srchToDate: saleEndDate,
						f_nodiv: 1,
					},
				};

				var url = "AMMSV0160";	// 組合せ販売商品登録

				clutil.postJSON(url, req).done(_.bind(function(data,dataType){
					if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						//成功時処理
						var view = new clutil.MessageDialog2('取込が完了しました。');
						console.log(view);

						//var itemList_tmp = clutil.tableview2data($("#ca_table2_tbody tr"));
						var itemList_tmp = this.itemList;
						var newlist = [];

						var itemMap = {};
						_.each(itemList_tmp, _.bind(function(v) {
							if (v.itemID > 0) {
								if (v._view2data_itgrpID_cn) {
									v.itgrpCode = v._view2data_itgrpID_cn.code;
									v.itgrpName = v._view2data_itgrpID_cn.name;
								}
								if (v._view2data_makerID_cn) {
									v.makerCode = v._view2data_makerID_cn.code;
									v.makerName = v._view2data_makerID_cn.name;
								}

								itemMap[v.itemID] = v;
								newlist.push(v);
							}
						}, this));

						var csvRsp = data.AMMSV0160CsvRsp;
						_.each(csvRsp.itemList, _.bind(function(v) {
							if (itemMap[v.itemID] == null) {
								//this.itemList.push(v);
								v.editableFlag = 1;	// 追加した行は編集可能
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
									editableFlag: 1,
								};
							newlist.push(add_tmp);
						}

						this.itemList = newlist;
						this.itemLineNo = 0;
						for (i = 0; i < this.itemList.length; i++) {
							this.itemList[i].no = this.itemLineNo;
							this.itemLineNo++;
						}

						// 内容物がある場合 --> 結果表示する。
						var itemList0 = this.getItemListByPage(0);
						this.renderTable2(itemList0);

					} else {
						// ヘッダーにメッセージを表示
						this.mdBaseView.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args),});
						this.mdBaseView.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_",});
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
		},
		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			this.mdBaseView.fetch();	// データを GET してくる。

			switch (this.options.opeTypeId) {
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				this.renderTable2([]);
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				this._addFileInput();
				break;
			default:
				break;
			}

			// ページャーの表示
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
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
				AMMSV0160GetReq: {
					srchID: chkData.id,		// 商品ID
					delFlag: chkData.delFlag,	// 削除フラグ
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMMSV0160UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMMSV0160',
				data: getReq
			};
		},

		isEmptyStep: function(step) {
			var b11 = (step.qy == 0);
			var b12 = (step.qy == "");
			var b21 = (step.am == 0);
			var b22 = (step.am == "");
			var b1 = (b11 || b12);
			var b2 = (b21 || b22);
			if (b1 && b2) {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * 組合せ段階のチェック
		 * @returns {Boolean}
		 */
		isValidStep: function() {
			var _this = this;
			var max_qy = 0;
			var min_ave = 999999999;
			var max_ave = 0;
			var f_empty = false;
			var $tr_empty = null;
			var discntTypeID = Number($("#ca_discTypeID").val());

			var ret = true;

			$.each($("#ca_table1_tbody tr"), function() {
				var f_qy = false;
				var $tr = $(this);
				var step = clutil.tableview2data($tr);

				var $input_qy = $tr.find('input[name="ca_qy"]');
				var qy = $input_qy.val();
				qy = qy == "" || qy == null ? 0 : Number(qy);

				var $input_am = $tr.find('input[name="ca_am"]');
				var am = $input_am.val();
				am = am == "" || am == null ? 0 : Number(am.split(',').join(''));

				if (_this.isEmptyStep(step[0])) {
					f_empty = true;
					$tr_empty = $tr;
					return;
				} else if (f_empty) {
					// 空行がある
					var $input_qy_empty = $tr_empty.find('input[name="ca_qy"]');

					_this.mdBaseView.validator.setErrorMsg($input_qy_empty, clmsg.EMS0039);
					ret = false;
				}
				// 組合せ点数が増加しているか
				if (qy <= max_qy) {
					_this.mdBaseView.validator.setErrorMsg($input_qy, clmsg.EMS0039);
					ret = false;
					f_qy = true;
				} else {
					max_qy = qy;
				}

				// 値下げ区分が価格指定の場合、平均額は減少しているか
				var ave = Math.round(am/qy);
				if (discntTypeID == amcm_type.AMCM_VAL_DISC_METHOD_PRICE) {
					if (ave > min_ave) {
						if (!f_qy) {
							_this.mdBaseView.validator.setErrorMsg($input_qy, clmsg.EMS0040);
						}
						_this.mdBaseView.validator.setErrorMsg($input_am, clmsg.EMS0040);
						ret = false;
					} else {
						min_ave = ave;
					}
				} else if (discntTypeID == amcm_type.AMCM_VAL_DISC_METHOD_DISCOUNT) {
					if (ave < max_ave) {
						if (!f_qy) {
							_this.mdBaseView.validator.setErrorMsg($input_qy, clmsg.EMS0041);
						}
						_this.mdBaseView.validator.setErrorMsg($input_am, clmsg.EMS0041);
						ret = false;
					} else {
						max_ave = ave;
					}
				}
			});
			return ret;
		},

		/**
		 * 対象商品のチェック
		 * @returns {Boolean}
		 */
		isValidItem: function() {
			var _this = this;
			var ret = true;
			var idList = [];
			var f_item = false;

			this._onPageClickBefore();
			var itemList_tmp = this.itemList;
			var itemList = _.filter(itemList_tmp, _.bind(function(item) {
				return item.itemID != null && item.itemID != 0 && item.itemID != "";
			}, this));

			for (var i = 0; i < itemList.length; i++) {
				var item_id = itemList[i].item_id;
				if (!_.include(idList, item_id)) {
					idList.push(item_id);
				}
				f_item = true;
			}

			$.each($("#ca_table2_tbody tr"), function() {
				var $tr = $(this);
				//var $input_div = $tr.find('input[name="ca_divID"]');
				var $input_itgrp = $tr.find('input[name="ca_itgrpID"]');
				var $input_maker = $tr.find('input[name="ca_makerID"]');
				var $input_code = $tr.find('input[name="ca_makerItemCode"]');

				var item_id = $tr.find('input[name="ca_itemID"]').val();
				var code = $input_code.val();
				if (item_id == null || item_id == 0 || item_id == "") {
					if (code != null && code != "") {
						// メーカー品番が入力されているのに商品IDが決定していない場合は、エラー
						_this.mdBaseView.validator.setErrorMsg($input_code, clmsg.EMS0166);
						ret = false;
					} else {
						// 商品IDは決定していない
						//_this.mdBaseView.validator.setErrorMsg($input_code, "商品が設定されていません。");
						//ret = false;
						return;
					}
				} else {
					f_item = true;
				}
				if (_.include(idList, item_id)) {
					// 商品重複
					var code = $input_code.val();
					var msg = clutil.fmtargs(clmsg.EGM0009, [code]);
					//_this.mdBaseView.validator.setErrorMsg($input_div, msg);
					_this.mdBaseView.validator.setErrorMsg($input_itgrp, msg);
					_this.mdBaseView.validator.setErrorMsg($input_maker, msg);
					_this.mdBaseView.validator.setErrorMsg($input_code, msg);
					ret = false;
				} else {
					idList.push(item_id);
				}
			});
			if (!f_item) {
				var msg = clutil.fmtargs(clmsg.EMS0007, ["１件"]);
				_this.mdBaseView.validator.setErrorInfo({_eb_: msg});
				ret = false;
			}

			return ret;
		},

		/**
		 * ゾーン入力チェック
		 * @returns {Boolean}
		 */
		isValidZone: function() {
			var _this = this;
			var ret = true;
			var idList = [];

			$.each($("#ca_table3_tbody tr"), function() {
				var $tr = $(this);
				var $input_org = $tr.find('input[name="ca_orgID"]');
				var orgID = null;
				var orgCode = "";
				var data = $input_org.autocomplete('clAutocompleteItem');

				if (data) {
					var cn = _.pick(data, 'id', 'code', 'name');
					orgID = cn.id;
					orgCode = cn.code;
				}
				if (orgID == null) {
					_this.mdBaseView.validator.setErrorMsg($input_org, "地区が入力されていません。");
					ret = false;
				} else if (_.include(idList, orgID)) {
					// ゾーン重複
					var msg = clutil.fmtargs(clmsg.EGM0009, [orgCode]);
					_this.mdBaseView.validator.setErrorMsg($input_org, msg);
					ret = false;
				} else {
					idList.push(orgID);
				}
			});

			return ret;
		},

		/**
		 * ゾーン入力チェック
		 * @returns {Boolean}
		 */
		isValidStore: function() {
			var _this = this;
			var ret = true;
			var idList = [];

			$.each($("#ca_table4_tbody tr"), function() {
				var $tr = $(this);
				var $input_org = $tr.find('input[name="ca_orgID"]');
				var orgID = null;
				var orgCode = "";
				var data = $input_org.autocomplete('clAutocompleteItem');

				if (data) {
					var cn = _.pick(data, 'id', 'code', 'name');
					orgID = cn.id;
					orgCode = cn.code;
				}
				if (orgID == null) {
					_this.mdBaseView.validator.setErrorMsg($input_org, "店舗が入力されていません。");
					ret = false;
				} else if (_.include(idList, orgID)) {
					// 店舗重複
					var msg = clutil.fmtargs(clmsg.EGM0009, [orgCode]);
					_this.mdBaseView.validator.setErrorMsg($input_org, msg);
					ret = false;
				} else {
					idList.push(orgID);
				}
			});

			return ret;
		},

		isValid: function() {
			var f_valid = true;
			this.validator.clear();
			if (!this.validator.valid()) {
				//this.validator.setErrorHeader(clmsg.cl_echoback);
				clutil.mediator.trigger('onTicker',clmsg.cl_echoback);
				f_valid = false;
			}
			this._onPageClickBefore();
			var itemList_tmp = this.itemList;
			var items = _.filter(itemList_tmp, _.bind(function(item) {
				return item.itemID != null && item.itemID != 0 && item.itemID != "";
			}, this));
//			// テーブル領域エラーチェック
//			// テーブルデータを取りながら、行末空欄スキップと、入力チェックを行う。
//		    var items = clutil.tableview2ValidData({
//		        $tbody: this.$('#ca_table2_tbody'),    // <tbody> の要素を指定する。
//		        validator: this.validator,   // validator インスタンスを指定する。（どこのものでもかまわない）
//		        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。//ラジオボタン選択値をとる
//		        	if ((item.divID != null && item.divID.id != 0) ||
//		        			(item.itgrpID != null && item.itgrpID.id != 0) ||
//		        			(item.makerID != null && item.makerID.id != 0) ||
//		        			item.makerItemCode != "" ||
//		        			(item.itemID != "" && item.itemID != 0)) {
//		        		return false;
//		        	} else {
//			            return true;
//		        	}
//		        }
//		    });
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
			this.mdBaseView.validator.clear();

			var f_error = false;
			// 入力チェック
			if (!this.isValid()) {
				f_error = true;
			}
			if (!this.validator.validFromToObj([{
				$stval: $("#ca_saleStartDate"),
				$edval: $("#ca_saleEndDate"),
			}])) {
				f_error = true;
			}
			// 組合せチェック
			if (!this.isValidStep()) {
				f_error = true;
			}

			// 対象商品チェック
			if (!this.isValidItem()) {
				f_error = true;
			}

			// ゾーンチェック
			if (!this.isValidZone()) {
				f_error = true;
			}

			// 店舗チェック
			if (!this.isValidStore()) {
				f_error = true;
			}

			if (f_error) {
				return null;
			}

			// 画面入力値をかき集めて、Rec を構築する。
			var bundle = clutil.view2data($("#ca_form"));
			var stepList_tmp = clutil.tableview2data($("#ca_table1_tbody tr"));
			//var itemList_tmp = clutil.tableview2data($("#ca_table2_tbody tr"));

			// 商品リストの作成
			this._onPageClickBefore();
			var itemList_tmp = this.itemList;
			var itemList = _.filter(itemList_tmp, _.bind(function(item) {
				return item.itemID != null && item.itemID != 0 && item.itemID != "";
			}, this));
			var zoneList = clutil.tableview2data($("#ca_table3_tbody tr"));
			var storeList = clutil.tableview2data($("#ca_table4_tbody tr"));

			var stepList = [];

			$.each(stepList_tmp, function() {
				if (this.qy == 0 && this.am == 0) {
					return;
				}
				this.id = bundle.id;
				stepList.push(this);
			});
			$.each(itemList, function() {
				delete this.divData;
				delete this.itgrpData;
				delete this.makerData;

				this.id = bundle.id;
			});
			$.each(zoneList, function() {
				delete this.orgData;

				this.id = bundle.id;
			});
			$.each(storeList, function() {
				delete this.orgData;

				this.id = bundle.id;
			});

			bundle.orgFlag = zoneList.length > 0 || storeList.length > 0 ?
					1 : 0;

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
				AMMSV0160GetReq: {
				},
				// 商品分類マスタ更新リクエスト
				AMMSV0160UpdReq: {
					bundle: bundle,
					stepList: stepList,
					itemList: itemList,
					zoneList: zoneList,
					storeList: storeList,
				},
			};
			return {
				resId: clcom.pageId,
				data:  updReq,
				onRspPage: false
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

		_onSampleDLClick: function() {
			clutil.download(this.sampleURL);
		},

		myTableview2data: function() {
			var f_cut = true;
			var itemList = [];

			for (var i = this.itemList.length-1; i >= 0; i--) {
				var obj = this.itemList[i];
				var itgrpCode = obj.itgrpCode;
				var makerCode = obj.makerCode;
				var makerItemCode = obj.makerItemCode;

				if (f_cut && _.isEmpty(itgrpCode+makerCode+makerItemCode)) {
					continue;
				}
				f_cut = false;

				var item = {
					itgrpCode: obj.itgrpCode,
					makerCode: obj.makerCode,
					makerItemCode: obj.makerItemCode
				};
				itemList.unshift(item);
			}
//			var trElem = $("#ca_table2_tbody tr");
//			var f_cut = true;
//			var itemList = [];
//			for (var i = trElem.length-1; i >= 0; i--) {
//				var $tr = $(trElem.get(i));
//				//var divCode = $tr.find('input[name="ca_divID"]').val().split(':')[0];
//				var itgrpCode = $tr.find('input[name="ca_itgrpID"]').val().split(':')[0];
//				var makerCode = $tr.find('input[name="ca_makerID"]').val().split(':')[0];
//				var makerItemCode = $tr.find('input[name="ca_makerItemCode"]').val().split(':')[0];
//				if (f_cut && _.isEmpty(itgrpCode+makerCode+makerItemCode)) {
//					continue;
//				}
//				f_cut = false;
//
//				var item = {
//					//divCode: divCode,
//					itgrpCode: itgrpCode,
//					makerCode: makerCode,
//					makerItemCode: makerItemCode
//				};
//				itemList.splice(0, 0, item);
//			}
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
			//    最後の空行はカット。中間にある空行は含める
//			var itemList_tmp = clutil.tableview2data($("#ca_table2_tbody tr"));
			this._onPageClickBefore();
			var itemList = this.myTableview2data();

//			var itemList = _.filter(itemList_tmp, _.bind(function(item) {
//				return item.itemID != null && item.itemID != 0 && item.itemID != "";
//			}, this));
//			_.each(itemList, _.bind(function(item) {
//				item.divCode = item._view2data_divID_cn.code;
//				item.itgrpCode = item._view2data_itgrpID_cn.code;
//				item.makerCode = item._view2data_makerID_cn.code;
//			}, this));
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

		_eof: 'AMSSV0160.MainView//'
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
