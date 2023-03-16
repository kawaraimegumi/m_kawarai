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
			'autocompletechange #ca_itgrpID' : '_onUnitChange',
			'click #ca_table_tbody td[name="btn_delete"]': "_onDeleteRowClick",
			"click #ca_table_tfoot tr" : "_onAddRowClick",
			'change #cl_setColor' : '_onClickSetColor',	//MT-xxxx カラー選択セレクトボックスの表示切替 yamaguchi
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
					title: '集約商品マスタ',
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

			this.validator = clutil.validator(this.$("#ca_base"), {
				echoback : $('.cl_echoback')
			});
			this.validator2 = clutil.validator(this.$("#ca_table"), {
				echoback : $('.cl_echoback')
			});

			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_itgrpID",
				},
				// サイズパターン
				'clsizeptn_byitgrpselector sizeptn': {
					el: "#ca_sizePtnID",
				},
			}, {
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

			// 新規作成の場合、店舗表示オン
			if (fixopt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				$('#ca_dispFlag').prop("checked",true);
				$('#ca_dispFlag').parents('label').addClass('checked');
			}
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			var argsMessage = args.data.rspHead.message;
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
				var alertInput = [];
				this.mdBaseView.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				_.each(args.data.rspHead.fieldMessages, _.bind(function(fieldMessage) {
					var field = 'ca_' + fieldMessage.field_name;
					if (field == 'ca_makerItemCode' ||
							field == 'ca_makerID' ||
							field == 'ca_rank') {
						var $tr = $("#ca_table_tbody tr").eq(fieldMessage.lineno);
						var $input = $tr.find('input[name="' + field + '"]');
						var message = clutil.getclmsg(fieldMessage.message);
						var msg = clutil.fmtargs(message, fieldMessage.args);
						if (argsMessage == 'WMS0155') {
							alertInput.push({
								input: $input,
								msg: msg
							});
						}
						this.validator2.setErrorMsg($input, msg);
					}
				}, this));

				if (argsMessage == 'WMS0155') {
					if (!_.isEmpty(alertInput)) {
						for (var i = 0; i < alertInput.length; i++) {
							this.validator2.setErrorMsg(alertInput[i].input, alertInput[i].msg, 'alert');
						}
					}
					var updReq = this.savedUpdReq;
					var send = {
							resId:	"AMMSV0180",
							data: updReq,
							confirm: clmsg.WMS0155,
					};
					this.mdBaseView.forceSubmit(send);
				}
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
			var $td_maker = $tgt.parent().prev();
			var $input_maker = $td_maker.find('input');
			var data_maker = $input_maker.autocomplete('clAutocompleteItem');
			var maker_id = data_maker.id;
			var data_itgrp = $("#ca_itgrpID").autocomplete('clAutocompleteItem');
			var itgrp_id = data_itgrp.id;
			var code = $(e.target).val();

			var arg = {
				itgrp_id: itgrp_id,
				maker_id: maker_id,
				maker_code: code,
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
			this.validator2.clear();

			var $tgt = $(e.target);	// input;
			var $td_code = $tgt.parent();	// td(メーカー品番)
			var $td_name = $td_code.next();	// td(商品名)
			var $td_id = $td_code.next().next().next().next().next(); //MT-xxxx カラー選択列追加したためnext()を一つ追加 yamaguchi
			var $input_itemID = $td_id.children('input');
			//var $input_makerID = $td_code.prev().children('input');

			var itemName = data.data.rec.itemName;
			var itemID = data.data.rec.itemID;
			if (itemID == 0) {
				// 商品の検索に失敗した
				this.validator2.setErrorHeader(clmsg.cl_echoback);
				this.validator2.setErrorMsg($tgt, clmsg.EGM0026);
			}
			/*
			商品重複チェックは個々では行わない（カラーも含めて重複チェックをする必要が有るため）
			else if (!this.isValidItemID(itemID)) {
				var msg = clutil.fmtargs(clmsg.EGM0009, ["メーカー、メーカー品番"]);
				this.validator2.setErrorHeader(clmsg.cl_echoback);
				this.validator2.setErrorMsg($input_makerID, msg);
				this.validator2.setErrorMsg($tgt, msg);
				$input_itemID.val(itemID);	// 無視して登録行こうとした時にもエラーとなるように
				$td_name.text("");			// 商品名はクリアする
				return;
			}
			*/
			$input_itemID.val(itemID);
			$td_name.text(itemName);

			//MT-xxxx 製品カラー情報取得 yamaguchi
			var $sel_color = $tgt.parent().siblings('.setColor').find('select');
			var list = [];

			list = data.data.list;
			$.each(list, function(){
				this.name = this.colorName;
				this.code = this.colorCode;
				this.id = this.colorID;
			});
			clutil.cltypeselector3({
				  $select: $sel_color,
				  list: list,
				  unselectedflag: 1
			});

			var f_setcolor = $('#cl_setColor').prop('checked');
			if (f_setcolor) {
				if (list && list.length > 0) {
					$sel_color.selectpicker("val", list[0].id);
				} else {
					$sel_color.selectpicker("val", 0);
				}
			} else {
				$sel_color.selectpicker("val", 0);
			}

			clutil.viewRemoveReadonly($sel_color.parent());

			$('.setColor').addClass('wt280');
			$('.setColor').find($('.btn-group')).addClass('wt100pct');
			$('.setColor').find($('.combobox-input')).addClass('wt240imp');
		},

		getVendorTypeId: function() {
			// 取引先区分=メーカー
			return amcm_type.AMCM_VAL_VENDOR_MAKER;
		},

		getUnitId: function() {
			var id = $("#ca_unitID").val();
			return id;
		},

		_onUnitChange: function(e) {
			// メーカークリア
			$('input[name="ca_makerID"]').autocomplete('removeClAutocompleteItem');
			// メーカー品番クリア
			$('input[name="ca_makerItemCode"]').val("");
			// 商品名クリア
			$('td[name="td_name"]').text("");
			// 商品IDクリア
			$('input[name="ca_itemID"]').val('');
			// MD-2861：カラーもクリア
			var f_setcolor = $('#cl_setColor').prop('checked');
			if (f_setcolor) {
				// 「カラー別に設定する」のチェックONならクリアする
				this._clearColor();
			}
			// MD-2861：ランクもクリア
			$('input[name="ca_rank"]').val("");
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

		_onDeleteRowClick: function(e) {
			if (this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW &&
					this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				return;
			}
			var $table = $("#ca_table");
			if ($table.hasClass('readonly')) {
				return;
			}
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');

			$tr.remove();

			//selectのid連番振り直し
			var num = 1;
			$('.setColor').find($('select[name="ca_color"]')).each(function(){
				$(this).attr('id', 'ca_color' + num);
				num++;
			});
		},

		_onAddRowClick: function(e) {
			if (this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW &&
					this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				return;
			}
			var $table = $("#ca_table");
			if ($table.hasClass('readonly')) {
				return;
			}
			// 空データ挿入
			var add_tmp = {
				no: 0,
				makerID: 0,
				makerCode: "",
				makerName: "",
				makerItemCode: "",
				itemName: "",
				itemID: 0,
				rank: "",
			};
			var tr = _.template($("#ca_rec_template").html(), add_tmp);
			$("#ca_table_tbody").append(tr);

			// autocomplete
			var optMaker = {
				getVendorTypeId: this.getVendorTypeId,
				getUnitId: this.getUnitId,
			};
			var $inputMaker = $('#ca_table_tbody tr:last input[name="ca_makerID"]');
			clutil.clvendorcode($inputMaker, optMaker);
			$inputMaker.on('autocompletechange', this._onMakerChange);

			// 品番
			var $inputCode = $('#ca_table_tbody tr:last input[name="ca_makerItemCode"]');
			$inputCode.change(this._onMakerItemCodeChange);	// 変更イベント


			//MT-xxxx カラー選択セレクトボックス追加 yamaguchi
//			clutil.initUIelement($("#ca_table"));

			var $newE = $('#ca_table_tbody tr:last');
			var num = 1;
			$('.setColor').find($('select[name="ca_color"]')).each(function(){
				$(this).attr('id', 'ca_color' + num);
				num++;
			});

			var list = [];
			$newE.find($('[name=ca_color]')).each(function(){
				var $sel_color = $(this);
				clutil.cltypeselector3({
					  $select: $sel_color,
					  list: list,
					  unselectedflag: 1
				});
			});

			$newE.find($('.setColor')).each(function(){
				$(this).addClass('wt280');
			});
			$newE.find($('.setColor')).find($('.btn-group')).each(function(){
				$(this).addClass('wt100pct');
				$(this).removeClass('disabled');
			});
			$newE.find($('.setColor')).find($('.combobox-input')).each(function(){
				$(this).addClass('wt240imp');
			});

			if ($('#cl_setColor').prop('checked')) {
				$newE.find($('select[name="ca_color"]')).addClass('cl_valid').addClass('cl_required');
				$newE.find($('.setColor')).show();
			}
		},

		//MT-xxxx カラー選択セレクトボックスの表示切替 yamaguchi
		_onClickSetColor: function(args){
			if (args.currentTarget.checked) {
				$('.setColor').each(function(){
					$(this).show();
					$(this).find($('select[name="ca_color"]')).addClass('cl_valid').addClass('cl_required');
					$('.btn-add').parent().attr('colSpan', 6);
				});
			} else {
				// MD-2861：カラムだけでなくデータも削除
				this._clearColor();

				$('.setColor').each(function(){
					$(this).hide();
					$(this).find($('select[name="ca_color"]')).removeClass('cl_valid').removeClass('cl_required');
					$('.btn-add').parent().attr('colSpan', 5);
				});
			}
		},

		/**
		 * 「カラー」列の値をクリアする
		 */
		_clearColor: function() {
			var $tbody = $("#ca_table_tbody");
			$tbody.find($('[name=ca_color]')).each(function(){
				var $sel_color = $(this);
				$sel_color.val(0);
				$sel_color.selectpicker('refresh');
			});
		},

		/**
		 * テーブル描画
		 * @param list
		 */
		renderTable: function(list) {
			var _this = this;
			list = list == null ? [] : list;

			// MD-2873 集約商品マスタ一覧_複数編集時にカラー別設定チェック状態不正_PGM開発
			// 商品の中にカラー設定があるか調べる（∵集約商品マスタにはカラー設定有無を保持していない）
			var f_colorExist = false;
			for (var i = 0; i < list.length; i++) {
				if (list[i].color > 0) {
					f_colorExist = true;
					break;
				}
			}

			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				var len = list.length;

				for (var i = len; i < 5; i++) {
					// 5行になるまで空データを入れる
					var add_tmp = {
						no: 0,
						makerID: 0,
						makerCode: "",
						makerName: "",
						makerItemCode: "",
						itemName: "",
						itemID: 0,
						rank: "",
					};
					list.push(add_tmp);
				}
			}

			var $tbody = $("#ca_table_tbody");
			$tbody.empty();
			$.each(list, function() {
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
				var optMaker = {
					getVendorTypeId: _this.getVendorTypeId,
					getUnitId: _this.getUnitId,
				};
				var $inputMaker = $tr.find('input[name="ca_makerID"]');
				clutil.clvendorcode($inputMaker, optMaker);
				$inputMaker.on('autocompletechange', _this._onMakerChange);

				var $inputCode = $tr.find('input[name="ca_makerItemCode"]');
				$inputCode.change(_this._onMakerItemCodeChange);	// 変更イベント

				// 改めてデータをセット
				$inputMaker.autocomplete('clAutocompleteItem', dataMaker);
			});

			//MT-xxxx セレクトボックスの追加 yamaguchi
			var num = 1;
			$('.setColor').find($('select[name="ca_color"]')).each(function(){
				$(this).attr('id', 'ca_color' + num);
				num++;
			});

			//カラー別設定あり
			// MD-2873 集約商品マスタ一覧_複数編集時にカラー別設定チェック状態不正_PGM開発
			// 一覧から渡された先頭のレコードではなく、処理対象とするレコードのカラー設定状態で切り分ける
			if (f_colorExist === true) {
				//編集
				if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
					var num = 0;
					$tbody.find($('[name=ca_color]')).each(function(){
						var $sel_color = $(this);
						if (list[num].colorList) {
							$.each(list[num].colorList, function(){
								this.name = this.colorName;
								this.code = this.colorCode;
								this.id = this.colorID;
							});
							clutil.cltypeselector3({
								  $select: $sel_color,
								  list: list[num].colorList,
								  unselectedflag: 1
							});

							var val = 0;
							var numVal = 0;
							//初期値設定
							$.each(list[num].colorList, function(){
								if (list[num].colorName == this.colorName) {
									val = this.id;
								}
								numVal++;
							});

							$sel_color.addClass('cl_valid').addClass('cl_required');
							if (val != 0) {
								$sel_color.val(val);
							}
							$sel_color.selectpicker('refresh');
						} else {
							var emptyList = [];
							clutil.cltypeselector3({
								  $select: $sel_color,
								  list: emptyList,
								  unselectedflag: 1
							});
						}
						num++;
					});
					$('.setColor').find($('.btn-group')).each(function(){
						$(this).removeClass('disabled');
					});
				//参照
				} else {
					var i = 0;
					$tbody.find($('[name=ca_color]')).each(function(){
						var $sel_color = $(this);
						if (list[i].colorList) {
							$.each(list[i].colorList, function(){
								this.name = this.colorName;
								this.code = this.colorCode;
								this.id = this.colorID;
							});
							clutil.cltypeselector3({
								  $select: $sel_color,
								  list: list[i].colorList,
								  unselectedflag: 1
							});

							var val = 0;
							var numVal = 0;
							//初期値設定
							$.each(list[i].colorList, function(){
								if (list[i].colorName == this.colorName) {
									val = this.id;
								}
								numVal++;
							});

							if (val != 0) {
								$sel_color.val(val);
							}
							$sel_color.selectpicker('refresh');
						} else {
							var emptyList = [];
							clutil.cltypeselector3({
								  $select: $sel_color,
								  list: emptyList,
								  unselectedflag: 1
							});
						}
//						clutil.cltypeselector2({
//							  $select: $sel_color,
//							  list: list,
//						});
						i++;
					});

					var _list = list;
					var num = 0;
					$('.setColor').find($('.combobox-input')).each(function(){
						var colorCode = "";
						$.each(_list[num].colorList, function(){
							if (this.colorName == _list[num].colorName) {
								colorCode = this.colorCode;
							}
						});
						$(this).val(colorCode+':'+_list[num].colorName);
						num++;
					});
					$('.setColor').find($('.btn-group')).each(function(){
						$(this).addClass('disabled');
					});
				}
				var num = 0;
				$('.setColor').find($('.combobox-input')).each(function(){
					$(this).addClass('wt240imp');
					num++;
				});
				$('.setColor').each(function(){
					$(this).addClass('wt280');
				});
				$('.setColor').find($('.btn-group')).each(function(){
					$(this).addClass('wt100pct');
				});

				$('#cl_setColor').prop("checked",true);
				$('#cl_setColor').parents('label').addClass('checked');

				$('.setColor').show();
			//カラー別設定なし
			} else {
				//編集
				if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
					var num = 0;
					$tbody.find($('[name=ca_color]')).each(function(){
						$sel_color = $(this);
						if (list[num].colorList) {
							$.each(list[num].colorList, function(){
								this.name = this.colorName;
								this.code = this.colorCode;
								this.id = this.colorID;
							});
							clutil.cltypeselector3({
								  $select: $sel_color,
								  list: list[num].colorList,
								  unselectedflag: 1
							});
						} else {
							var emptyList = [];
							clutil.cltypeselector3({
								  $select: $sel_color,
								  list: emptyList,
								  unselectedflag: 1
							});
						}
						num++;
					});
					$('.setColor').find($('.btn-group')).each(function(){
						$(this).removeClass('disabled');
					});
				//新規登録
				} else {
					var list = [];
					$tbody.find($('[name=ca_color]')).each(function(){
						var $sel_color = $(this);
						clutil.cltypeselector3({
							  $select: $sel_color,
							  list: list,
							  unselectedflag: 1
						});
					});
				}

				$('.setColor').each(function(){
					$(this).addClass('wt280');
				});
				$('.setColor').find($('.btn-group')).each(function(){
					$(this).addClass('wt100pct');
					$(this).removeClass('disabled');
				});
				$('.setColor').find($('.combobox-input')).each(function(){
					$(this).addClass('wt240imp');
				});

				// MD-2873 集約商品マスタ一覧_複数編集時にカラー別設定チェック状態不正_PGM開発
				// カラー設定なしの時はカラー列を表示しない
				$('.setColor').hide();
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			var data = args.data;
			var getRsp = data.AMMSV0180GetRsp;
			var packItem = getRsp.packItem;

			var form = {
				id: packItem.id,
				code: packItem.code,
				name: packItem.name,
				memo: packItem.memo,
				itgrpID: {
					id: packItem.itgrpID,
					code: packItem.itgrpCode,
					name: packItem.itgrpName,
				},
				unitID: packItem.unitID,
				unitCode: packItem.unitCode,
				unitName: packItem.unitName,
				sizePtnID: packItem.sizePtnID,
				dispFlag: packItem.dispFlag,
			};
			this.itemList = getRsp.itemList;
			for (var i = 0; i < this.itemList.length; i++) {
				this.itemList[i].no = i;
			}

			clutil.viewRemoveReadonly($("#ca_form"));
			clutil.viewRemoveReadonly($("#ca_table"));

			$("#ca_table").removeClass('readonly');

			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				clutil.data2view(this.$("#ca_form"), form);
				this.renderTable(this.itemList);

				this.fieldRelation.done(_.bind(function() {
					this.state.recno = packItem.recno;
					this.state.state = packItem.state;

					switch (this.opeTypeId) {
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
						// 事業ユニットは入力不可
						clutil.viewReadonly(this.$('#div_unitID'));
						// 品種は入力不可
						clutil.inputReadonly(this.$('#ca_itgrpID'));
						// 集約品番は入力不可
						clutil.inputReadonly(this.$('#ca_code'));
						// カラー別設定は変更不可
						clutil.inputReadonly(this.$('#cl_setColor'));

						this.resetFocus($("#ca_name"));
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
						clutil.viewReadonly($("#ca_form"));
						clutil.viewReadonly($("#ca_table"));
						$("#ca_table").addClass('readonly');
						break;
					}
				}, this));

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), form);
				this.renderTable(this.itemList);

				this.fieldRelation.done(_.bind(function() {
					// 確定済なので、 全 <input> は readonly 化するなどの処理。
					clutil.viewReadonly($("#ca_form"));
					clutil.viewReadonly($("#ca_table"));
					$("#ca_table").addClass('readonly');
				}, this));
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
				clutil.data2view(this.$("#ca_form"), form);
				this.renderTable(this.itemList);

				this.fieldRelation.done(_.bind(function() {
					// 確定済なので、 全 <input> は readonly 化するなどの処理。
					clutil.viewReadonly($("#ca_form"));
					clutil.viewReadonly($("#ca_table"));
					$("#ca_table").addClass('readonly');
				}, this));
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table"));
				$("#ca_table").addClass('readonly');
				break;
			}
			clutil.initUIelement($("#ca_table"));
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			clutil.cltxtFieldLimit($("#ca_code"));
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
				this.renderTable([]);


				//初期フォーカス
				var $tgt = null;
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					$tgt = $("#ca_itgrpID");
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
				AMMSV0180GetReq: {
					srchID: chkData.id,			// 商品ID
					delFlag: chkData.delFlag,	// 削除フラグ
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMMSV0180UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMMSV0180',
				data: getReq
			};
		},

		/**
		 * テーブルの入力チェック
		 * @returns {Boolean}
		 */
		isTableValid: function() {
			var f_valid = true;

			var items = clutil.tableview2ValidData({
				$tbody: this.$("#ca_table_tbody"),
				validator: this.validator2,
				tailEmptyCheckFunc: function(item) { // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように
					if ((item.makerID != null && item.makerID.id != 0)
							|| item.makerItemCode != ""
							|| (_.isNumber(item.itemID) && item.itemID != 0)
							|| $('#cl_setColor').prop('checked') && item.color != 0
							|| item.rank != "") {
						return false;
					} else {
						return true;
					}
				}
			});

			if (_.isEmpty(items)) {
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

			if (!this.validator.valid()) {
				f_error = true;
			}
			if (!this.isTableValid()) {
				f_error = true;
			}
			// テーブルのチェック
			var itemIDMap = {};
			var rankMap = {};
			var f_setcolor = $('#cl_setColor').prop('checked');
			var msg = clutil.fmtargs(clmsg.EGM0009, ["メーカー、メーカー品番"]);
			var msg2 = clutil.fmtargs(clmsg.EGM0009, ["メーカー、メーカー品番、カラー"]);
			_.each($("#ca_table_tbody tr"), _.bind(function(tr) {
				var $tr = $(tr);
				var $inputMakerID = $tr.find('input[name="ca_makerID"]');
				var $inputMakerCode = $tr.find('input[name="ca_makerItemCode"]');
				var $inputRank = $tr.find('input[name="ca_rank"]');
				var $inputItemID = $tr.find('input[name="ca_itemID"]');
				var $inputColorID = $tr.find('select[name="ca_color"]');
				var itemID = $inputItemID.val();
				var rank = $inputRank.val();

				if (itemID == 0) {
					//this.validator2.setErrorMsg($inputMakerCode, "メーカー品番が入力されていません");
					//f_error = true;
				} else {
					if (f_setcolor) {
						// カラーが設定されているか
						var colorID = $inputColorID.selectpicker('val');
						console.log("colorID=" + colorID);
						if (colorID == null || colorID == "" || colorID == "0") {
							this.validator2.setErrorMsg($inputColorID, clmsg.cl_required);
							f_error = true;
						} else {
							// 重複チェック
							var key = itemID + ":" + colorID;
							if (itemIDMap[key] == true) {
								// 重複
								this.validator2.setErrorMsg($inputMakerID, msg2);
								this.validator2.setErrorMsg($inputMakerCode, msg2);
								this.validator2.setErrorMsg($inputColorID, msg2);
								f_error = true;
							} else {
								itemIDMap[key] = true;
							}
						}

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
				}
				if (rank == "") {
					// 空はスキップ（エラーチェック済）
				} else if (rankMap[rank] == true) {
					this.validator2.setErrorMsg($inputRank, clmsg.EMS0006);
					f_error = true;
				} else {
					rankMap[rank] = true;
				}
			}, this));

			if (f_error) {
				this.validator2.setErrorHeader(clmsg.cl_echoback);
			}

			var packItem = clutil.view2data($("#ca_form"));
			delete packItem._view2data_itgrpID_cn;

			var itemList = clutil.tableview2data($("#ca_table_tbody tr"));
			itemList = _.filter(itemList, _.bind(function(v) {
				return v.itemID != 0;
			}, this));
			if (itemList == null || itemList.length < 2) {
				var msg2 = clutil.fmtargs(clmsg.EMS0007, ["2"]);
				this.validator2.setErrorHeader(msg2);
				f_error = true;
			}

			if (f_error) {
				return null;
			}

			$.each(itemList, function() {
				delete this.makerData;

				this.id = packItem.id;
			});

			// TODO: 画面入力値をかき集めて、Rec を構築する。
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
				AMMSV0180GetReq: {
				},
				// 商品分類マスタ更新リクエスト
				AMMSV0180UpdReq: {
					packItem: packItem,
					itemList: itemList,
				},
			};

			var reqObj = {
					reqHead : updReq.reqHead,
					AMMSV0180UpdReq  : updReq.AMMSV0180UpdReq,
			};
			this.savedUpdReq = reqObj;

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

		_eof: 'AMSSV0180.MainView//'
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
