// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		validator : null,

		events: {
			'change #ca_unitID'			:	'_onUnitChanged',			// 事業ユニットが変更された
			'change #ca_vendorTypeID'	:	'_onVendorTypeChanged',		// 取引先区分が変更された
			'click #expand_addr'		:	'_onExpandAddrClick',		// 住所設定/閉じるクリック
			'click #expand_rtnaddr:not([disabled])'		:	'_onExpandRtnAddrClick',	// 返品先住所設定/閉じるクリック
			'click #expand_tag:not([disabled])'			:	'_onExpandTagClick',		// タグ送付先設定/閉じるクリック
			'click #expand_maker:not([disabled])'		:	'_onExpandMakerClick',		// メーカー設定/閉じるクリック
			'click #ca_table_tfoot1 tr' :	'_onAddRow1Click',
			'click #ca_table_tfoot2 tr' :	'_onAddRow2Click',
			'click #ca_table_tfoot3 tr' :	'_onAddRow3Click',
			'click #ca_tagtable_tfoot tr' : '_onAddTagRowClick',
			'toggle input:checkbox[name="dataSvcFlag"]'	: '_onDataSvcFlagToggle',	// 売上・在庫照会(オプション)クリック
//			'autocompletechange #ca_table_tbody1 input[name="ca_divID"]' :	'_onDiv1Changed',
//			'autocompletechange #ca_table_tbody2 input[name="ca_divID"]' :	'_onDiv2Changed',
//			'autocompletechange #ca_table_tbody3 input[name="ca_divID"]' :	'_onDiv3Changed',
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
					title: '取引先マスタ',
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

			// アプリ個別の View や部品をインスタンス化するとか・・・

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
				// それ以外は、Submit と、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// validatorエラー時の表示領域
			var $eb = $('.cl_echoback').hide();
//			this.validator = clutil.validator(this.$el, {
//				echoback : $('.cl_echoback')
//			});
			this.term2Validator = clutil.validator($('#ca_term_form'), {
				echoback : $eb
			});
			this.vendor2Validator = clutil.validator($('#ca_vendor_form'), {
				echoback : $eb
			});
			this.addr2Validator = clutil.validator($('#ca_addr_form'), {
				echoback : $eb
			});
			this.rtnaddr2Validator = clutil.validator($('#ca_rtnaddr_form'), {
				echoback : $eb
			});
			this.tag2Validator = clutil.validator($('#ca_tag_form'), {
				echoback : $eb
			});
			this.maker2Validator = clutil.validator($('#ca_maker_form'), {
				echoback : $eb
			});

			// datepicker
			clutil.datepicker(this.$("#ca_fromDate"));
			this.$("#ca_fromDate").datepicker("setIymd", clcom.getOpeDate() + 1);
			clutil.datepicker(this.$("#ca_toDate"));
			this.$("#ca_toDate").datepicker("setIymd", clcom.max_date);

			// Fieldlimit
			clutil.cltxtFieldLimit($("#ca_code"));
			clutil.cltxtFieldLimit($("#ca_name"));
			clutil.cltxtFieldLimit($("#ca_nameKana"));
			clutil.cltxtFieldLimit($("#ca_shortName"));
			clutil.cltxtFieldLimit($("#ca_shortNameKana"));
			clutil.cltxtFieldLimit($("#ca_oper_form").find("#ca_addr1"));
			clutil.cltxtFieldLimit($("#ca_oper_form").find("#ca_addr2"));
			clutil.cltxtFieldLimit($("#ca_oper_form").find("#ca_addr3"));
			clutil.cltxtFieldLimit($("#ca_oper_form").find("#ca_divName"));
			clutil.cltxtFieldLimit($("#ca_oper_form").find("#ca_operName"));
			clutil.cltxtFieldLimit($("#ca_act_form").find("#ca_addr1"));
			clutil.cltxtFieldLimit($("#ca_act_form").find("#ca_addr2"));
			clutil.cltxtFieldLimit($("#ca_act_form").find("#ca_addr3"));
			clutil.cltxtFieldLimit($("#ca_act_form").find("#ca_divName"));
			clutil.cltxtFieldLimit($("#ca_act_form").find("#ca_operName"));
			clutil.cltxtFieldLimit($("#ca_rtn1_form").find("#ca_addr1"));
			clutil.cltxtFieldLimit($("#ca_rtn1_form").find("#ca_addr2"));
			clutil.cltxtFieldLimit($("#ca_rtn1_form").find("#ca_addr3"));
			clutil.cltxtFieldLimit($("#ca_rtn1_form").find("#ca_corpName"));
			clutil.cltxtFieldLimit($("#ca_rtn2_form").find("#ca_addr1"));
			clutil.cltxtFieldLimit($("#ca_rtn2_form").find("#ca_addr2"));
			clutil.cltxtFieldLimit($("#ca_rtn2_form").find("#ca_addr3"));
			clutil.cltxtFieldLimit($("#ca_rtn2_form").find("#ca_corpName"));
			clutil.cltxtFieldLimit($("#ca_rtn3_form").find("#ca_addr1"));
			clutil.cltxtFieldLimit($("#ca_rtn3_form").find("#ca_addr2"));
			clutil.cltxtFieldLimit($("#ca_rtn3_form").find("#ca_addr3"));
			clutil.cltxtFieldLimit($("#ca_rtn3_form").find("#ca_corpName"));

			// ツールチップ
			$("#ca_tp_code").tooltip({html: true});

			clutil.viewReadonly(this.$(".ca_toDate_div"));

			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// args.data が null なら空欄表示化する。args.data に何かネタがあれば画面個別Viewへセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.term2Validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
//			args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log('args.status: [' + args.status + ']');

			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 View へセットする。
				this.data2view(args.data);

				// 編集可の状態にする。
				clutil.viewRemoveReadonly($("#ca_base_form"));
				this.tableRemoveReadonly($("#ca_table1"));
				this.tableRemoveReadonly($("#ca_table2"));
				this.tableRemoveReadonly($("#ca_table3"));
				this.tableRemoveReadonly($("#ca_tagtable"));

				// イベント追加
				this.addEvent();

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					// 事業ユニット,取引先区分,コード,名称,適用終了日は入力不可
					clutil.viewReadonly(this.$('#ca_unitID_div'));
					clutil.viewReadonly(this.$('#ca_vendorTypeID_div'));
					clutil.inputReadonly(this.$('#ca_code'));
					clutil.inputReadonly(this.$('#ca_accCode'));
					clutil.setFocus(this.$("#ca_fromDate"));
					clutil.viewReadonly(this.$(".ca_toDate_div"));
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					this.setReadOnlyAllItems();
					clutil.inputRemoveReadonly($('#ca_fromDate'));
					clutil.setFocus(this.$("#ca_fromDate"));
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
					this.setReadOnlyAllItems();
					break;
				}

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				this.data2view(args.data);
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				this.data2view(args.data);
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			}
		},

		tableRemoveReadonly: function ($table) {
			$table.find('input[type="text"]').removeAttr("readonly");
			$table.find('tbody span.btn-delete').show();
			$table.find('tbody span.btn-add').show();
			$table.find('tfoot').show();
		},

		setReadOnlyAllItems: function(){
			clutil.viewReadonly($("#ca_base_form"));
			var $table1 = this.$("#ca_table1");
			$table1.find('input[type="text"]').attr("readonly", true);
			$table1.find('tbody span.btn-delete').hide();
			$table1.find('tbody span.btn-add').hide();
			$table1.find('tfoot').hide();
			var $table2 = this.$("#ca_table2");
			$table2.find('input[type="text"]').attr("readonly", true);
			$table2.find('tbody span.btn-delete').hide();
			$table2.find('tbody span.btn-add').hide();
			$table2.find('tfoot').hide();
			var $table3 = this.$("#ca_table3");
			$table3.find('input[type="text"]').attr("readonly", true);
			$table3.find('tbody span.btn-delete').hide();
			$table3.find('tbody span.btn-add').hide();
			$table3.find('tfoot').hide();
			var $tagTable = this.$("#ca_tagtable");
			$tagTable.find('input[type="text"]').attr("readonly", true);
			$tagTable.find('tbody span.btn-delete').hide();
			$tagTable.find('tbody span.btn-add').hide();
			$tagTable.find('tfoot').hide();
		},

		data2view: function(data){
			var _this = this;

			this.saveData = data.AMMSV0320GetRsp;
			var vendor = data.AMMSV0320GetRsp.vendor;
			var attr = data.AMMSV0320GetRsp.attr;
			var addrList = data.AMMSV0320GetRsp.addrList;
			// ソート
			addrList.sort(function(a, b) {
				return (Number(a.addrSeq) - Number(b.addrSeq));
			});
			this.addrItgrpList = data.AMMSV0320GetRsp.addrItgrpList;
			var tagList = data.AMMSV0320GetRsp.tagList;

			// 取引先マスタ設定
			vendor.unitID = attr.unitID;
			clutil.data2view(_this.$('#ca_term_form'), vendor);
			clutil.data2view(_this.$('#ca_vendor_form'), vendor);

			$.each(addrList, function() {
				var telsplits = this.telNo.split("-");
//				var faxsplits = this.faxNo.split("-");
				var addr = {
						fromDate		: this.fromDate,
						toDate			: this.toDate,
						id				: this.id,
						addrSeq			: this.addrSeq,
						postalNo		: this.postalNo,
						addr1			: this.addr1,
						addr2			: this.addr2,
						addr3			: this.addr3,
						telNo1			: telsplits[0],
						telNo2			: telsplits[1],
						telNo3			: telsplits[2],
//						faxNo1			: faxsplits[0],
//						faxNo2			: faxsplits[1],
//						faxNo3			: faxsplits[2],
						corpName		: this.corpName,
						divName			: this.divName,
						operName		: this.operName
				};
				switch (this.vendorAddrTypeID) {
				case amcm_type.AMCM_VAL_VENDOR_ADDR_OPER:	// 営業
					clutil.data2view(_this.$('#ca_oper_form'), addr);
					break;
				case amcm_type.AMCM_VAL_VENDOR_ADDR_ACCOUNT:	// 経理
					clutil.data2view(_this.$('#ca_act_form'), addr);
					break;
				default:	// 返品先
					var itgrpList = _this.getItgrpList(this.addrSeq, _this.addrItgrpList);
					if (this.addrSeq == 3) {
						clutil.data2view(_this.$('#ca_rtn1_form'), addr);
						_this.renderTable($("#ca_table_tbody1"), itgrpList);
					} else if (this.addrSeq == 4) {
						clutil.data2view(_this.$('#ca_rtn2_form'), addr);
						_this.renderTable($("#ca_table_tbody2"), itgrpList);
					} else {
						clutil.data2view(_this.$('#ca_rtn3_form'), addr);
						_this.renderTable($("#ca_table_tbody3"), itgrpList);
					}
					break;
				}
			});

			// タグ送付先設定
			this.renderTagTable($("#ca_tagtable_tbody"), tagList);

			// メーカー設定
			var maker = {
					fromDate: attr.fromDate,
					toDate: attr.toDate,
					id: attr.id,
					unitID: attr.unitID,
					unitCode: attr.unitCode,
					unitName: attr.unitName,
					bscTypeID: attr.bscTypeID,
					tagsendTypeID: attr.tagsendTypeID,
					basicchargeTypeID: attr.basicchargeTypeID,
					sendOrdDtlFlag: attr.sendOrdDtlFlag,
					dataSvcFlag: attr.dataSvcFlag,
					svcPayVendorID: {
						id: attr.svcPayVendorID,
						code: attr.svcPayVendorCode,
						name: attr.svcPayVendorName,
					},
					jcaAcceptFlag: attr.jcaAcceptFlag,
//					jcaCode: attr.jcaCode,
//					destJcaCode: attr.destJcaCode
			};
			clutil.data2view(_this.$('#ca_maker_form'), maker);
			this._onVendorTypeChanged();
			this._onDataSvcFlagToggle();

		},

		/**
		 * テーブル描画
		 * @param list
		 */
		renderTable: function($tbody, list) {
			var _this = this;

			$tbody.empty();
			$.each(list, function() {
				var dataDiv = {
					id: this.divID,
					code: this.divCode,
					name: this.divName,
				};
				var dataItgrp = {
					id: this.itgrpID,
					code: this.itgrpCode,
					name: this.itgrpName,
				};
				var tr = _.template($("#ca_rec_template").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);

				var $tr = $tbody.find('tr:last');	// 追加した行

				// autocomplete初期化
				var $inputDiv = $tr.find("input:eq(0)");
				var unitID = Number($('#ca_unitID').val());
				unitID = unitID > 0 ? unitID : 0;
				var optDiv = _this.getAutoOption(3, unitID, true);
//				clutil.clitgrpcode($inputDiv, optDiv);
				var divComp = clutil.clitgrpcode($inputDiv, optDiv);
				divComp.on('change', function(item) {
					_this.resetItgrpAuto(item, $inputDiv);
				});
//				_this.listenTo(divComp, "change", _this._onDivChanged);

				var $input = $tr.find("input:eq(1)");
				var opt = _this.getAutoOption(4, dataDiv.id);
				clutil.clitgrpcode($input, opt);

				// 改めてデータをセット
				$inputDiv.autocomplete('clAutocompleteItem', dataDiv);
				$input.autocomplete('clAutocompleteItem', dataItgrp);
			});
		},

		/**
		 * テーブル描画
		 * @param list
		 */
		renderTagTable: function($tbody, list) {
			$tbody.empty();
			$.each(list, function() {
				var tr = _.template($("#ca_tag_template").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);
			});
		},

		getItgrpList: function (addrSeq, itgrpList) {
			var list = [];
			for (var i = 0; i < itgrpList.length; i++) {
				var cnt = 0;
				if (addrSeq == itgrpList[i].addrSeq) {
					itgrpList[i].no = cnt;
					list.push(itgrpList[i]);
				}
			}

			return list;
		},

		addRow: function($tbody, $table) {
			// 空データ挿入
			var add_tmp = {
				no: 0,
//				addrSeq: 0,
				itgrpID: 0,
				itgrpCode: "",
				itgrpName: "",
				divID: 0,
				divCode: "",
				divName: "",

			};
			var tr = _.template($("#ca_rec_template").html(), add_tmp);
			$tbody.append(tr);

			/*
			 * 行削除
			 */
			$tbody.find("tr:last span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).closest('tr');
				$tgt_tr.remove();
			});

			// autocomplete
			var $inputDiv = $tbody.find('tr:last input[name="ca_divID"]');
			var unitID = Number($('#ca_unitID').val());
			unitID = unitID > 0 ? unitID : 0;
			var optDiv = this.getAutoOption(3, unitID, true);
			var divComp = clutil.clitgrpcode($inputDiv, optDiv);
			divComp.on('change', function(item) {
				mainView.resetItgrpAuto(item, $inputDiv);
			});
			if (unitID == 0) {
				clutil.inputReadonly($inputDiv);
			} else {
				clutil.inputRemoveReadonly($inputDiv);
			}
//			this.listenTo(divComp, "change", this._onDivChanged);
			var $inputItgrp = $tbody.find('tr:last input[name="ca_itgrpID"]');
			clutil.inputReadonly($inputItgrp);
//			var optItgrp = this.getAutoOption(4, 0);
//			clutil.clitgrpcode($inputItgrp, optItgrp);

			clutil.initUIelement($table);
		},

		addTagRow: function($tbody, $table) {
			// 空データ挿入
			var add_tmp = {
				no: 0,
				fromDate: 0,
				toDate: 0,
				id: 0,
				tagSeq: "",
				tagAddr: "",

			};
			var tr = _.template($("#ca_tag_template").html(), add_tmp);
			$tbody.append(tr);

			/*
			 * 行削除
			 */
			$tbody.find("tr:last span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).closest('tr');
				$tgt_tr.remove();
			});

			clutil.initUIelement($table);
		},

		/**
		 * タグ送付先連番振り直し
		 */
		reTagSeq : function($tbody){
			var $input = $tbody.find('input[name="tagSeq"]');
			$input.each(function(i){
				if (Number($(this).val()) == 0) {
					$(this).val(i + 1);
				}
			});
			return this;
		},
		/**
		 * 行追加・削除イベント追加
		 */
		addEvent: function() {
			/*
			 * 行削除
			 */
			$("#ca_table_tbody1 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).closest('tr');
				$tgt_tr.remove();
			});
			$("#ca_table_tbody2 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).closest('tr');
				$tgt_tr.remove();
			});
			$("#ca_table_tbody3 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).closest('tr');
				$tgt_tr.remove();
			});
			$("#ca_tagtable_tbody span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).closest('tr');
				$tgt_tr.remove();
			});

		},

		/**
		 * テーブル項目のcl_requiredの有無を設定
		 */
		setTableRequired: function(required) {
			if (required) {
				$("#ca_table_tbody1 tr").each(function(i){
					var $div = $(this).find('input[name="ca_divID"]');
					var $itgrp = $(this).find('input[name="ca_itgrpID"]');
					$div.addClass('cl_required');
					$itgrp.addClass('cl_required');
				});
				$("#ca_table_tbody2 tr").each(function(i){
					var $div = $(this).find('input[name="ca_divID"]');
					var $itgrp = $(this).find('input[name="ca_itgrpID"]');
					$div.addClass('cl_required');
					$itgrp.addClass('cl_required');
				});
				$("#ca_table_tbody3 tr").each(function(i){
					var $div = $(this).find('input[name="ca_divID"]');
					var $itgrp = $(this).find('input[name="ca_itgrpID"]');
					$div.addClass('cl_required');
					$itgrp.addClass('cl_required');
				});
				$("#ca_tagtable_tbody tr").each(function(i){
					var $tagSeq = $(this).find('input[name="tagSeq"]');
					var $tagAddr = $(this).find('input[name="tagAddr"]');
					$tagSeq.addClass('cl_required');
					$tagSeq.attr('data-validator', 'min:1 max:99');
					$tagAddr.addClass('cl_required');
				});
			} else {
				$("#ca_table_tbody1 tr").each(function(i){
					var $div = $(this).find('input[name="ca_divID"]');
					var $itgrp = $(this).find('input[name="ca_itgrpID"]');
					$div.removeClass('cl_required');
					$itgrp.removeClass('cl_required');
				});
				$("#ca_table_tbody2 tr").each(function(i){
					var $div = $(this).find('input[name="ca_divID"]');
					var $itgrp = $(this).find('input[name="ca_itgrpID"]');
					$div.removeClass('cl_required');
					$itgrp.removeClass('cl_required');
				});
				$("#ca_table_tbody3 tr").each(function(i){
					var $div = $(this).find('input[name="ca_divID"]');
					var $itgrp = $(this).find('input[name="ca_itgrpID"]');
					$div.removeClass('cl_required');
					$itgrp.removeClass('cl_required');
				});
				$("#ca_tagtable_tbody tr").each(function(i){
					var $tagSeq = $(this).find('input[name="tagSeq"]');
					var $tagAddr = $(this).find('input[name="tagAddr"]');
					$tagSeq.removeClass('cl_required');
					$tagSeq.removeAttr('data-validator');
					$tagAddr.removeClass('cl_required');
				});
			}
		},

		/**
		 * 返品先住所のテーブルクリア
		 */
		clearRtnTable: function($tr) {
			var _this = this;

			$.each($tr, function(i){
				// 部門オートコンプリートリセット
				_this.resetDivAuto($(this));

				// 品種クリア
				var $itgrp = $(this).find('input[name="ca_itgrpID"]');
				if (!_.isEmpty($itgrp.val())) {
					if (!_.isEmpty($itgrp.autocomplete())) {
						$itgrp.autocomplete('removeClAutocompleteItem');
					}
					$itgrp.val('');
				}
				clutil.inputReadonly($itgrp);
			});
		},

		/**
		 * 部門オートコンプリートをリセット
		 */
		resetDivAuto: function($tr) {
			var _this = this;
			// 部門クリア
			var $div = $tr.find('input[name="ca_divID"]');
			if (!_.isEmpty($div.val())) {
				$div.autocomplete('removeClAutocompleteItem');
				$div.val('');
			}

			// 部門オートコンプリート
			var unitID = Number($('#ca_unitID').val());
			var opt = this.getAutoOption(3, unitID, true);
			var divComp = clutil.clitgrpcode($div, opt);
			divComp.on('change', function(item) {
				_this.resetItgrpAuto(item, $div);
			});
			if (unitID == 0) {
				clutil.inputReadonly($div);
			} else {
				clutil.inputRemoveReadonly($div);
			}
//			this.listenTo(divComp, "change", this._onDivChanged);
//			clutil.clitgrpcode($div, opt);
		},

		/**
		 * 品種オートコンプリートをリセット
		 */
		resetItgrpAuto: function(attr, $div) {
			var $tr = $div.closest('tr');

			// 品種クリア
			var $itgrp = $tr.find('input[name="ca_itgrpID"]');
			if (!_.isEmpty($itgrp.val())) {
//				$itgrp.autocomplete('removeClAutocompleteItem');
				if (!_.isEmpty($itgrp.autocomplete())) {
					$itgrp.autocomplete('removeClAutocompleteItem');
				}
				$itgrp.val('');
			}
//			console.log($itgrp);

			// 品種オートコンプリート
			var p_id = Number(attr.id);
			var opt = this.getAutoOption(4, p_id);
			clutil.clitgrpcode($itgrp, opt);
			console.log(p_id);
			if (!p_id ||p_id == 0) {
				clutil.inputReadonly($itgrp);
			} else {
				clutil.inputRemoveReadonly($itgrp);
			}
		},

		/**
		 * オートコンプリートのオプション取得
		 */
		getAutoOption: function(defaultItgrpLevel, parent_id, isDiv) {
//			var itgrpfunc_id = clcom.getItgrpFuncBasic();
			var itgrpfunc_id = clcom.getSysparam('PAR_AMMS_DEFAULT_ITGRP_FUNCID');
//			var itgrplevel_id = clcom.getStdItgrpLevel();
			var opt = {
				dependAttrs: {
					itgrpfunc_id: function() {
//						if (isDiv) {
//							itgrpfunc_id = itgrpfunc_id - 1;
//						}
//						itgrpfunc_id = itgrpfunc_id > 0 ? itgrpfunc_id : 1;
						return itgrpfunc_id;
					},
					itgrplevel_id: function() {
//						if (isDiv) {
//							itgrplevel_id = itgrplevel_id > 0 ? itgrplevel_id - 1 : defaultItgrpLevel;
//						} else {
//							itgrplevel_id = itgrplevel_id > 0 ? itgrplevel_id : defaultItgrpLevel;
//						}
////						itgrplevel_id = itgrplevel_id > 0 ? itgrplevel_id : defaultItgrpLevel;
						return defaultItgrpLevel;
					},
					parent_id: parent_id
				}
			};

			return opt;
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			// 取引先マスタ設定パネル	[ 1]
			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'), 1);
			// 取引先区分
			clutil.cltypeselector(this.$('#ca_vendorTypeID'), amcm_type.AMCM_TYPE_VENDOR, 1);

			// BSC区分
			clutil.cltypeselector(this.$('#ca_bscTypeID'), amcm_type.AMCM_TYPE_BSC, 1);
			// タグデータ送信先
			clutil.cltypeselector(this.$('#ca_tagsendTypeID'), amcm_type.AMCM_TYPE_TAGSEND, 1);
			// 基本料課金
			clutil.cltypeselector(this.$('#ca_basicchargeTypeID'), amcm_type.AMCM_TYPE_BASICCHARGE, 1);
			// 取引先オートコンプリート
			clutil.clvendorcode(this.$('#ca_svcPayVendorID'), {
				getVendorTypeId: _.bind(function(){
					return amdb_defs.MTTYPE_F_VENDOR_MAKER;   // メーカー
				}, this)
			});

			// 新規登録、編集時にプレースホルダ―住所表示
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				var postalNo = clcom.getSysparam("PAR_AMCM_DEFAULT_POSTAL_NUMBER");
				var addr1 = clcom.getSysparam("PAR_AMCM_DEFAULT_ADDR1");
				var addr2 = clcom.getSysparam("PAR_AMCM_DEFAULT_ADDR2");
				var addr3 = clcom.getSysparam("PAR_AMCM_DEFAULT_ADDR3");
				$("#ca_oper_form").find("#ca_postalNo").attr("placeholder", postalNo);
				$("#ca_oper_form").find("#ca_addr1").attr("placeholder", addr1);
				$("#ca_oper_form").find("#ca_addr2").attr("placeholder", addr2);
				$("#ca_oper_form").find("#ca_addr3").attr("placeholder", addr3);
				$("#ca_act_form").find("#ca_postalNo").attr("placeholder", postalNo);
				$("#ca_act_form").find("#ca_addr1").attr("placeholder", addr1);
				$("#ca_act_form").find("#ca_addr2").attr("placeholder", addr2);
				$("#ca_act_form").find("#ca_addr3").attr("placeholder", addr3);
				$("#ca_rtn1_form").find("#ca_postalNo").attr("placeholder", postalNo);
				$("#ca_rtn1_form").find("#ca_addr1").attr("placeholder", addr1);
				$("#ca_rtn1_form").find("#ca_addr2").attr("placeholder", addr2);
				$("#ca_rtn1_form").find("#ca_addr3").attr("placeholder", addr3);
				$("#ca_rtn2_form").find("#ca_postalNo").attr("placeholder", postalNo);
				$("#ca_rtn2_form").find("#ca_addr1").attr("placeholder", addr1);
				$("#ca_rtn2_form").find("#ca_addr2").attr("placeholder", addr2);
				$("#ca_rtn2_form").find("#ca_addr3").attr("placeholder", addr3);
				$("#ca_rtn3_form").find("#ca_postalNo").attr("placeholder", postalNo);
				$("#ca_rtn3_form").find("#ca_addr1").attr("placeholder", addr1);
				$("#ca_rtn3_form").find("#ca_addr2").attr("placeholder", addr2);
				$("#ca_rtn3_form").find("#ca_addr3").attr("placeholder", addr3);
			}
			// 初期のアコーディオン展開状態をつくる。

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			this.mdBaseView.fetch();	// データを GET してくる。
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				this._onVendorTypeChanged();
				clutil.viewReadonly(this.$(".ca_toDate_div"));
				clutil.setFocus(this.$("#ca_fromDate"));
			} else if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
				// 「適用期間」を「削除日」にする
				this.$("#ca_term_form").find('p.fieldName').text('削除日');
				this.$("#ca_term_form").find('.deldspn').hide();

				this.$(".ca_fromDate_div").before('<p id="ca_tp_del"><span>?</span></p>');

				$("#ca_tp_del").addClass("txtInFieldUnit flright help").attr("data-original-title", "削除日以降、当取引先は無効扱いとなります").tooltip({html: true});
//			} else {
//				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		/**
		 * 事業ユニット変更時
		 */
		_onUnitChanged: function(e) {
//			var _this = this;
//
//			$("#ca_table_tbody1 tr").each(function(i){
//				// 部門オートコンプリートリセット
//				_this.resetDivAuto($(this));
//
//				// 品種クリア
//				var $itgrp = $(this).find('input[name="ca_itgrpID"]');
////				$itgrp.attr('cs_id', '0');
//				if (!_.isEmpty($itgrp.val())) {
//					$itgrp.autocomplete('removeClAutocompleteItem');
//					$itgrp.val('');
//				}
//			});
			this.clearRtnTable($("#ca_table_tbody1 tr"));
			this.clearRtnTable($("#ca_table_tbody2 tr"));
			this.clearRtnTable($("#ca_table_tbody3 tr"));
		},

		/**
		 * 取引先区分変更時
		 */
		_onVendorTypeChanged: function(e) {
			var vendorTypeID = Number($('#ca_vendorTypeID').val());
//			console.log(vendorTypeID);

			switch (vendorTypeID) {
			case amcm_type.AMCM_VAL_VENDOR_MAKER:
				$('#expand_rtnaddr').removeAttr('disabled');
				$('#expand_tag').removeAttr('disabled');
				$('#expand_maker').removeAttr('disabled');
				// テーブル項目を必須にする
				this.setTableRequired(true);
				// メーカー設定のBSC区分～基本料課金を必須にする
				$('#ca_bscTypeID_div,#ca_tagsendTypeID_div,#ca_basicchargeTypeID_div').addClass('required');
				$('#ca_bscTypeID,#ca_tagsendTypeID,#ca_basicchargeTypeID').addClass('cl_required');
				var isSelected = $('input[name="dataSvcFlag"]').prop('checked');
				if (isSelected) {
					$('#ca_svcPayVendorID_div').addClass('required');
					$('#ca_svcPayVendorID').addClass('cl_required');
				}
				break;

			default:
				// 返品先住所設定,タグ送付先設定,メーカー設定を編集不可にする
				$('#rtnaddr_info').hide();
				$('#tag_info').hide();
				$('#maker_info').hide();
				$('#expand_rtnaddr').find('span.expand').css('display', 'block');
				$('#expand_rtnaddr').find('span.unexpand').css('display', 'none');
				$('#expand_rtnaddr').attr('disabled', true);
				$('#expand_tag').find('span.expand').css('display', 'block');
				$('#expand_tag').find('span.unexpand').css('display', 'none');
				$('#expand_tag').attr('disabled', true);
				$('#expand_maker').find('span.expand').css('display', 'block');
				$('#expand_maker').find('span.unexpand').css('display', 'none');
				$('#expand_maker').attr('disabled', true);
				// テーブル項目の必須をはずす
				this.setTableRequired(false);
				// メーカー設定のBSC区分～基本料課金の必須をはずす
				$('#ca_bscTypeID_div,#ca_tagsendTypeID_div,#ca_basicchargeTypeID_div, #ca_svcPayVendorID_div').removeClass('required');
				$('#ca_bscTypeID,#ca_tagsendTypeID,#ca_basicchargeTypeID, #ca_svcPayVendorID').removeClass('cl_required');
				break;
			}
		},

		/**
		 * 住所設定/閉じるボタンクリック
		 */
		_onExpandAddrClick: function(e){
			$('#addr_info').slideToggle();
			$('#expand_addr').find('span').fadeToggle();

			$('#addr_info').css('overflow', 'inherit');
		},

		/**
		 * 返品先住所設定/閉じるボタンクリック
		 */
		_onExpandRtnAddrClick: function(e){
			$('#rtnaddr_info').slideToggle();
			$('#expand_rtnaddr').find('span').fadeToggle();

			$('#rtnaddr_info').css('overflow', 'inherit');
		},

		/**
		 * タグ送付先設定/閉じるボタンクリック
		 */
		_onExpandTagClick: function(e){
			$('#tag_info').slideToggle();
			$('#expand_tag').find('span').fadeToggle();

			$('#tag_info').css('overflow', 'inherit');
		},

		/**
		 * メーカー設定/閉じるボタンクリック
		 */
		_onExpandMakerClick: function(e){
			$('#maker_info').slideToggle();
			$('#expand_maker').find('span').fadeToggle();

			$('#maker_info').css('overflow', 'inherit');
		},

		_onAddRow1Click: function(e) {
			this.addRow($("#ca_table_tbody1"), $("#ca_table1"));
		},

		_onAddRow2Click: function(e) {
			this.addRow($("#ca_table_tbody2"), $("#ca_table2"));
		},

		_onAddRow3Click: function(e) {
			this.addRow($("#ca_table_tbody3"), $("#ca_table3"));
		},

		_onAddTagRowClick: function(e) {
			console.log($("#ca_tagtable_tbody"));
			this.addTagRow($("#ca_tagtable_tbody"), $("#ca_tagtable"));
		},

		/**
		 * 部門変更時
		 */
		_onDivChanged : function(attrs, view, options){
			console.log($(view));
			this.resetItgrpAuto(attrs, $(view));
		},

//		_onDiv1Changed: function(e) {
//			console.log(e);
//			this.resetItgrpAuto($(e.target));
//		},
//
//		_onDiv2Changed: function(e) {
//			this.resetItgrpAuto($(e.target));
//		},
//
//		_onDiv3Changed: function(e) {
//			this.resetItgrpAuto($(e.target));
//		},

		/**
		 * 売上・在庫照会(オプション)クリック
		 */
		_onDataSvcFlagToggle: function(e) {
			var isSelected = $('input[name="dataSvcFlag"]').prop('checked');
			if (isSelected) {
				$('#ca_svcPayVendorID_div').addClass('required');
				$('#ca_svcPayVendorID').addClass('cl_required');
			} else {
				$('#ca_svcPayVendorID_div').removeClass('required');
				$('#ca_svcPayVendorID').removeClass('cl_required');
			}
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
				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},
				// 取引先マスタ検索リクエスト
				AMMSV0320GetReq: {
					srchID: chkData.id,			// 取引先ID
					srchDate: chkData.toDate	// 適用終了日
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMMSV0320UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMMSV0320',
				data: getReq
			};
		},

		validatorClear: function () {
			this.term2Validator.clear();
			this.vendor2Validator.clear();
			this.addr2Validator.clear();
			this.rtnaddr2Validator.clear();
			this.tag2Validator.clear();
			this.maker2Validator.clear();
		},

		//電話番号ハイフン追加
		chkTelNo: function(no1, no2, no3){
			var telno = "";
			var flag = true;

			if(no1 == null || no1 == ""){
				flag = false;
			}
			if(no2 == null || no2 == ""){
				flag = false;
			}
			if(no3 == null || no3 == ""){
				flag = false;
			}

			if(flag == true){
				telno = no1 + "-" + no2 + "-" + no3;
			}

			return telno;
		},

		//住所要素の空判定
		chkAddr: function(data){
			var flag = false;
			if(_.isEmpty(data)){
				return flag;
			}

			//住所
			if(data.postalNo != null && data.postalNo != ""){
				flag = true;
			}
			if(data.addr1 != null && data.addr1 != ""){
				flag = true;
			}
			if(data.addr2 != null && data.addr2 != ""){
				flag = true;
			}
			if(data.addr3 != null && data.addr3 != ""){
				flag = true;
			}

			//電話番号
			if(data.telNo != null && data.telNo != ""){
				flag = true;
			}

			//社名
			if(data.vendorAddrTypeID != amcm_type.AMCM_VAL_VENDOR_ADDR_RETURN){
				if(data.operName != null && data.operName != ""){
					flag = true;
				}
				if(data.divName != null && data.divName != ""){
					flag = true;
				}
			}
			else{
				if(data.corpName != null && data.corpName != ""){
					flag = true;
				}
			}

			return flag;
		},

		//送信用リスト作成
		margeList: function(list, flag1, flag2, flag3){
			var sendList = [];
			for(var i=0; i<5; i++){
				if(this.chkAddr(list[i]) == false){
					if(list[i].addrSeq == "3" && flag1 == true){
						sendList.push(list[i]);
					}
					else if(list[i].addrSeq == "4" && flag2 == true){
						sendList.push(list[i]);
					}
					else if(list[i].addrSeq == "5" && flag3 == true){
						sendList.push(list[i]);
					}
				}
				else{
					sendList.push(list[i]);
				}
			}
			return sendList;
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			/*
			 * 無効化チェック
			 */
			if ($("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}

//			this.validator.clear();
			this.validatorClear();

			var _this = this;
			var f_error = false;

			// 日付チェック
			var ope_date = clcom.getOpeDate();
			var $fromDate = this.$("#ca_fromDate");//$toDate = this.$("#ca_toDate");
			var fromDate = clutil.dateFormat($fromDate.val(), "yyyymmdd");
			var recfromDate = null;
			var rectoDate = null;
			if (this.options.chkData !== undefined && this.options.chkData.length > 0){
				recfromDate = this.options.chkData[pgIndex].fromDate;
				rectoDate = this.options.chkData[pgIndex].toDate;
			}
			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				if (fromDate <= ope_date){ // 開始日が明日以降でない
					this.term2Validator.setErrorHeader(clmsg.cl_st_date_min_opedate);
					this.term2Validator.setErrorMsg($fromDate, clmsg.cl_st_date_min_opedate);
					f_error = true;
				}
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				var compfromDate = ope_date < recfromDate ? recfromDate : ope_date;
				var msg = ope_date > recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
				if (fromDate <= compfromDate && rectoDate == clcom.max_date && fromDate != recfromDate){ // 未来予約可能で修正でない状態で開始日が明日以降でない
					this.term2Validator.setErrorHeader(msg);
					this.term2Validator.setErrorMsg($fromDate, msg);
					f_error = true;
				}
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				if (fromDate <= ope_date || fromDate < recfromDate){ // 設定開始日が明日以降かつ編集前開始日以降でない
					var msg = ope_date >= recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
					this.term2Validator.setErrorHeader(msg);
					this.term2Validator.setErrorMsg($fromDate, msg);
					f_error = true;
				}
				break;
			default:
				break;
			}
			if(f_error){ // エラーチェック毎にメッセージが決まっている⇒複数ある場合、一気に表示できていない。
				return null;
			}

			// 返品先住所の対象品種のチェック
			var itgrp1 = clutil.tableview2data($("#ca_table_tbody1 tr"));
			var itgrp2 = clutil.tableview2data($("#ca_table_tbody2 tr"));
			var itgrp3 = clutil.tableview2data($("#ca_table_tbody3 tr"));
			$.each(itgrp1, function(i) {
				if (!this.divID && this.itgrpID) {
					_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody1 tr:nth-child(" + (i + 1) + ") input[name='ca_divID']"), clutil.fmtargs(clmsg.cl_required));
					f_error = true;
				}
				if (this.divID && !this.itgrpID) {
					_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody1 tr:nth-child(" + (i + 1) + ") input[name='ca_itgrpID']"), clutil.fmtargs(clmsg.cl_required));
					f_error = true;
				}
			});
			$.each(itgrp2, function(i) {
				if (!this.divID && this.itgrpID) {
					_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody2 tr:nth-child(" + (i + 1) + ") input[name='ca_divID']"), clutil.fmtargs(clmsg.cl_required));
					f_error = true;
				}
				if (this.divID && !this.itgrpID) {
					_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody2 tr:nth-child(" + (i + 1) + ") input[name='ca_itgrpID']"), clutil.fmtargs(clmsg.cl_required));
					f_error = true;
				}
			});
			$.each(itgrp3, function(i) {
				if (!this.divID && this.itgrpID) {
					_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody3 tr:nth-child(" + (i + 1) + ") input[name='ca_divID']"), clutil.fmtargs(clmsg.cl_required));
					f_error = true;
				}
				if (this.divID && !this.itgrpID) {
					_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody3 tr:nth-child(" + (i + 1) + ") input[name='ca_itgrpID']"), clutil.fmtargs(clmsg.cl_required));
					f_error = true;
				}
			});

			// タグ送付先チェック
			var list = clutil.tableview2data($("#ca_tagtable_tbody tr"));
			console.log(list);
			$.each(list, function(i) {
				var tagSeq = this.tagSeq;
				var tagAddr = this.tagAddr;
				if (_.isEmpty(tagSeq) && !_.isEmpty(tagAddr)) {
					_this.tag2Validator.setErrorMsg(_this.$("#ca_tagtable_tbody tr:nth-child(" + (i + 1) + ") input[name='tagSeq']"), clutil.fmtargs(clmsg.cl_required));
					f_error = true;
				}
				if (!_.isEmpty(tagSeq) && _.isEmpty(tagAddr)) {
					_this.tag2Validator.setErrorMsg(_this.$("#ca_tagtable_tbody tr:nth-child(" + (i + 1) + ") input[name='tagAddr']"), clutil.fmtargs(clmsg.cl_required));
					f_error = true;
				}
			});

//			if(!this.validator.valid()) {
//				f_error = true;
//			}
			if(!this.term2Validator.valid()) {
				f_error = true;
			}
			if(!this.vendor2Validator.valid()) {
				f_error = true;
			}
			if(!this.maker2Validator.valid()) {
				f_error = true;
			}

			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_fromDate',
				edval : 'ca_toDate'
			});
			if(!this.term2Validator.validFromTo(chkInfo)){
				f_error = true;
			}
			if(f_error){
				clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
				return null;
			}

			// 画面入力値をかき集めて、Rec を構築する。
			var vendor = {};
			var attr = {};
			var addrList = [];
			var addrItgrpList = [];
			var tagList = [];

			// 取引先レコード
			var term = clutil.view2data($("#ca_term_form"));
			vendor = clutil.view2data($("#ca_vendor_form"));
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// 取引先区分と取引先コードの先頭１桁の対応が正しいこと。
				if (vendor.vendorTypeID == amcm_type.AMCM_VAL_VENDOR_CORRECT) {
					var code = vendor.code.substring(0, 1);
					if (code != "7") {
						this.vendor2Validator.setErrorHeader(clmsg.EMS0044);
						this.vendor2Validator.setErrorMsg($("#ca_code"), clmsg.EMS0044);
						return null;
					}
				} else {
					var code = vendor.code.substring(0, 1);
					if (code != "0") {
						this.vendor2Validator.setErrorHeader(clmsg.EMS0044);
						this.vendor2Validator.setErrorMsg($("#ca_code"), clmsg.EMS0044);
						return null;
					}
				}
				vendor.id = 0;
			}
			vendor.fromDate = term.fromDate;
			vendor.toDate = term.toDate;

			// 取引先住所レコード
			var oper = clutil.view2data($("#ca_oper_form"));
			if (!_.isEmpty(oper)){
				oper.fromDate = vendor.fromDate;
				oper.toDate = vendor.toDate;
				oper.id = vendor.id;
				if (oper.addrSeq == 0 || _.isEmpty(oper.addrSeq)) {
					oper.addrSeq = 1;
				}
				oper.vendorAddrTypeID = amcm_type.AMCM_VAL_VENDOR_ADDR_OPER;
				oper.telNo = _this.chkTelNo(oper.telNo1, oper.telNo2, oper.telNo3);
//				oper.faxNo = oper.faxNo1 + "-" + oper.faxNo2 + "-" + oper.faxNo3;
				addrList.push(oper);
			}
			var act = clutil.view2data($("#ca_act_form"));
			if (!_.isEmpty(act)){
				act.fromDate = vendor.fromDate;
				act.toDate = vendor.toDate;
				act.id = vendor.id;
				if (act.addrSeq == 0 || _.isEmpty(act.addrSeq)) {
					act.addrSeq = 2;
				}
				act.vendorAddrTypeID = amcm_type.AMCM_VAL_VENDOR_ADDR_ACCOUNT;
				act.telNo = _this.chkTelNo(act.telNo1, act.telNo2, act.telNo3);
//				act.faxNo = act.faxNo1 + "-" + act.faxNo2 + "-" + act.faxNo3;
				addrList.push(act);
			}

			// 取引先区分=メーカーのみ対応
			if (vendor.vendorTypeID == amcm_type.AMCM_VAL_VENDOR_MAKER) {
				// 取引先属性レコード
				attr = clutil.view2data($("#ca_maker_form"));
				// 売上・在庫照会オプションチェック時は、課金先コード必須
				if (attr.dataSvcFlag == 1 && (attr.svcPayVendorID == null || attr.svcPayVendorID == 0)) {
					this.maker2Validator.setErrorHeader(clmsg.EMS0015);
					this.maker2Validator.setErrorMsg($("#ca_svcPayVendorID"), clmsg.EMS0015);
					return null;
				}
				attr.fromDate = vendor.fromDate;
				attr.toDate = vendor.toDate;
				attr.id = vendor.id;

				var rtn1 = clutil.view2data($("#ca_rtn1_form"));
				if (!_.isEmpty(rtn1)){
					rtn1.fromDate = vendor.fromDate;
					rtn1.toDate = vendor.toDate;
					rtn1.id = vendor.id;
					if (rtn1.addrSeq == 0 || _.isEmpty(rtn1.addrSeq)) {
						rtn1.addrSeq = 3;
					}
					rtn1.vendorAddrTypeID = amcm_type.AMCM_VAL_VENDOR_ADDR_RETURN;
					rtn1.telNo = _this.chkTelNo(rtn1.telNo1, rtn1.telNo2, rtn1.telNo3);
	//				rtn1.faxNo = rtn1.faxNo1 + "-" + rtn1.faxNo2 + "-" + rtn1.faxNo3;
					addrList.push(rtn1);
				}
				var rtn2 = clutil.view2data($("#ca_rtn2_form"));
				if (!_.isEmpty(rtn2)){
					rtn2.fromDate = vendor.fromDate;
					rtn2.toDate = vendor.toDate;
					rtn2.id = vendor.id;
					if (rtn2.addrSeq == 0 || _.isEmpty(rtn2.addrSeq)) {
						rtn2.addrSeq = 4;
					}
					rtn2.vendorAddrTypeID = amcm_type.AMCM_VAL_VENDOR_ADDR_RETURN;
					rtn2.telNo = _this.chkTelNo(rtn2.telNo1, rtn2.telNo2, rtn2.telNo3);
	//				rtn2.faxNo = rtn2.faxNo1 + "-" + rtn2.faxNo2 + "-" + rtn2.faxNo3;
					addrList.push(rtn2);
				}
				var rtn3 = clutil.view2data($("#ca_rtn3_form"));
				if (!_.isEmpty(rtn3)){
					rtn3.fromDate = vendor.fromDate;
					rtn3.toDate = vendor.toDate;
					rtn3.id = vendor.id;
					if (rtn3.addrSeq == 0 || _.isEmpty(rtn3.addrSeq)) {
						rtn3.addrSeq = 5;
					}
					rtn3.vendorAddrTypeID = amcm_type.AMCM_VAL_VENDOR_ADDR_RETURN;
					rtn3.telNo = _this.chkTelNo(rtn3.telNo1, rtn3.telNo2, rtn3.telNo3);
	//				rtn3.faxNo = rtn3.faxNo1 + "-" + rtn3.faxNo2 + "-" + rtn3.faxNo3;
					addrList.push(rtn3);
				}

//				// 取引先住所対象品種レコード
//				var itgrp1 = clutil.tableview2data($("#ca_table_tbody1 tr"));
//				var itgrp2 = clutil.tableview2data($("#ca_table_tbody2 tr"));
//				var itgrp3 = clutil.tableview2data($("#ca_table_tbody3 tr"));

				// 返品先住所の対象品種の重複チェック
				var line_error = false;
				$("#ca_table_tbody1").find("input[name='ca_itgrpID']").each(function(i){
					console.log($(this).val());
					var val = $(this).val();
					if (val == "" || val == null || val == undefined) {
						return false;
					}
					var data = $(this).autocomplete('clAutocompleteItem');
					if (!data) {
						return false;
					}
					var cn = _.pick(data, 'id', 'code', 'name');
					for (var j = i + 1; j < itgrp1.length; j++) {
						if (cn.id == itgrp1[j].itgrpID){
							_this.rtnaddr2Validator.setErrorMsg($(this), clmsg.EMS0070);
							_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody1 tr:nth-child(" + (j + 1) + ") input[name='ca_itgrpID']"), clutil.fmtargs(clmsg.EMS0070));
							line_error = true;
							break;
						}
					}
					for (var j = 0; j < itgrp2.length; j++) {
						if (cn.id == itgrp2[j].itgrpID){
							_this.rtnaddr2Validator.setErrorMsg($(this), clmsg.EMS0070);
							_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody2 tr:nth-child(" + (j + 1) + ") input[name='ca_itgrpID']"), clutil.fmtargs(clmsg.EMS0070));
							line_error = true;
							break;
						}
					}
					for (var j = 0; j < itgrp3.length; j++) {
						if (cn.id == itgrp3[j].itgrpID){
							_this.rtnaddr2Validator.setErrorMsg($(this), clmsg.EMS0070);
							_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody3 tr:nth-child(" + (j + 1) + ") input[name='ca_itgrpID']"), clutil.fmtargs(clmsg.EMS0070));
							line_error = true;
							break;
						}
					}
					if (line_error) {
						f_error = true;
						return false;
					}
					if ($(this).autocomplete('isValidClAutocompleteSelect')){
						_this.rtnaddr2Validator.clearErrorMsg($(this));
					}
				});
				if (f_error) {
					clutil.mediator.trigger("onTicker", clmsg.EMS0070);
					return null;
				}

				$("#ca_table_tbody2").find("input[name='ca_itgrpID']").each(function(i){
					var val = $(this).val();
					if (val == "" || val == null || val == undefined) {
						return false;
					}
					var data = $(this).autocomplete('clAutocompleteItem');
					if (!data) {
						return false;
					}
					var cn = _.pick(data, 'id', 'code', 'name');
					for (var j = 0; j < itgrp1.length; j++) {
						if (cn.id == itgrp1[j].itgrpID){
							_this.rtnaddr2Validator.setErrorMsg($(this), clmsg.EMS0070);
							_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody1 tr:nth-child(" + (j + 1) + ") input[name='ca_itgrpID']"), clutil.fmtargs(clmsg.EMS0070));
							line_error = true;
							break;
						}
					}
					for (var j = i + 1; j < itgrp2.length; j++) {
						if (cn.id == itgrp2[j].itgrpID){
							_this.rtnaddr2Validator.setErrorMsg($(this), clmsg.EMS0070);
							_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody2 tr:nth-child(" + (j + 1) + ") input[name='ca_itgrpID']"), clutil.fmtargs(clmsg.EMS0070));
							line_error = true;
							break;
						}
					}
					for (var j = 0; j < itgrp3.length; j++) {
						if (cn.id == itgrp3[j].itgrpID){
							_this.rtnaddr2Validator.setErrorMsg($(this), clmsg.EMS0070);
							_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody3 tr:nth-child(" + (j + 1) + ") input[name='ca_itgrpID']"), clutil.fmtargs(clmsg.EMS0070));
							line_error = true;
							break;
						}
					}
					if (line_error) {
						f_error = true;
						return false;
					}
					if ($(this).autocomplete('isValidClAutocompleteSelect')){
						_this.rtnaddr2Validator.clearErrorMsg($(this));
					}
				});
				if (f_error) {
					clutil.mediator.trigger("onTicker", clmsg.EMS0070);
					return null;
				}

				$("#ca_table_tbody3").find("input[name='ca_itgrpID']").each(function(i){
					var val = $(this).val();
					if (val == "" || val == null || val == undefined) {
						return false;
					}
					var data = $(this).autocomplete('clAutocompleteItem');
					if (!data) {
						return false;
					}
					var cn = _.pick(data, 'id', 'code', 'name');
					for (var j = 0; j < itgrp1.length; j++) {
						if (cn.id == itgrp1[j].itgrpID){
							_this.rtnaddr2Validator.setErrorMsg($(this), clmsg.EMS0070);
							_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody1 tr:nth-child(" + (j + 1) + ") input[name='ca_itgrpID']"), clutil.fmtargs(clmsg.EMS0070));
							line_error = true;
							break;
						}
					}
					for (var j = 0; j < itgrp2.length; j++) {
						if (cn.id == itgrp2[j].itgrpID){
							_this.rtnaddr2Validator.setErrorMsg($(this), clmsg.EMS0070);
							_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody2 tr:nth-child(" + (j + 1) + ") input[name='ca_itgrpID']"), clutil.fmtargs(clmsg.EMS0070));
							line_error = true;
							break;
						}
					}
					for (var j = i + 1; j < itgrp3.length; j++) {
						if (cn.id == itgrp3[j].itgrpID){
							_this.rtnaddr2Validator.setErrorMsg($(this), clmsg.EMS0070);
							_this.rtnaddr2Validator.setErrorMsg(_this.$("#ca_table_tbody3 tr:nth-child(" + (j + 1) + ") input[name='ca_itgrpID']"), clutil.fmtargs(clmsg.EMS0070));
							clutil.mediator.trigger("onTicker", clmsg.EMS0070);
							line_error = true;
							break;
						}
					}
					if (line_error) {
						f_error = true;
						return false;
					}
					if ($(this).autocomplete('isValidClAutocompleteSelect')){
						_this.rtnaddr2Validator.clearErrorMsg($(this));
					}
				});
				if (f_error) {
					clutil.mediator.trigger("onTicker", clmsg.EMS0070);
					return null;
				}


				var itgrp1_flag = false;
				var itgrp2_flag = false;
				var itgrp3_flag = false;

				$.each(itgrp1, function() {
					delete this.divData;
					delete this.itgrpData;

					this.fromDate = vendor.fromDate;
					this.toDate = vendor.toDate;
					this.id = vendor.id;
					this.addrSeq = rtn1.addrSeq;
					if (this.divID && this.itgrpID) {
						addrItgrpList.push(this);
						itgrp1_flag = true;
					}
				});
				$.each(itgrp2, function() {
					delete this.divData;
					delete this.itgrpData;

					this.fromDate = vendor.fromDate;
					this.toDate = vendor.toDate;
					this.id = vendor.id;
					this.addrSeq = rtn2.addrSeq;
					if (this.divID && this.itgrpID) {
						addrItgrpList.push(this);
						itgrp2_flag = true;
					}
				});
				$.each(itgrp3, function() {
					delete this.divData;
					delete this.itgrpData;

					this.fromDate = vendor.fromDate;
					this.toDate = vendor.toDate;
					this.id = vendor.id;
					this.addrSeq = rtn3.addrSeq;
					if (this.divID && this.itgrpID) {
						addrItgrpList.push(this);
						itgrp3_flag = true;
					}
				});

				var sendList = [];
				sendList = this.margeList(addrList, itgrp1_flag, itgrp2_flag, itgrp3_flag);

				// 取引先タグ送付先レコード
//				tagList = clutil.tableview2data($("#ca_tagtable_tbody tr"));
				// 空白行は無視したリストを作成
				$.each(list, function() {
					if (_.isEmpty(this.tagSeq)) {
						return true;
					}
					this.fromDate = vendor.fromDate;
					this.toDate = vendor.toDate;
					this.id = vendor.id;
					tagList.push(this);
				});

				// タグ送付先番号の重複チェック
				var msg = 'タグ送付先番号が重複しています。';
				$("#ca_tagtable_tbody").find("input[name='tagSeq']").each(function(i){
					var tagSeq = $(this).val();
					for (var j = i + 1; j < tagList.length; j++) {
						if (tagSeq == tagList[j].tagSeq){
							_this.tag2Validator.setErrorMsg($(this), clutil.fmtargs(msg));
							_this.tag2Validator.setErrorMsg(_this.$("#ca_tagtable_tbody tr:nth-child(" + (j + 1) + ") input[name='tagSeq']"), clutil.fmtargs(msg));
							line_error = true;
							break;
						}
					}
					if (line_error) {
						f_error = true;
						return false;
					}
				});
				if (f_error) {
					clutil.mediator.trigger("onTicker", msg);
					return null;
				}
//				$.each(tagList, function() {
//					this.fromDate = vendor.fromDate;
//					this.toDate = vendor.toDate;
//					this.id = vendor.id;
//				});
			}
			attr.unitID = vendor.unitID;
			delete vendor.unitID;

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: opeTypeId,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 取引先マスタ検索リクエスト -- 更新なので、空を設定
				AMMSV0320GetReq: {
				},
				// 取引先マスタ更新リクエスト
				AMMSV0320UpdReq: {
					vendor: vendor,
					attr: attr,
					//addrList: addrList,
					addrList: sendList,
					addrItgrpList: addrItgrpList,
					tagList: tagList
				},
			};
			console.log(updReq);
//			return;
			return {
				resId: clcom.pageId,
				data:  updReq,
			};


//			// Null を渡すと、Ajax 呼び出しを Reject したものと FW 側では見なします。
//			return null;
		},

		_eof: 'AMMSV0320.MainView//'
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
