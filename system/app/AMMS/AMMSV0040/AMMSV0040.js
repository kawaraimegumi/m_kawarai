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
			"autocompletechange #ca_itgrpfuncID" : "_onItgrpFuncChange",
			"autocompletechange #ca_itgrplevelID" : "_onItgrpLevelChange",
			"click #ca_table_tfoot tr" : "_onAddRowClick",
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
			var _this = this;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '商品分類マスタ',
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

			this.validator = clutil.validator(this.$("#ca_data"), {
				echoback : $('.cl_echoback')
			});

			// 新規の場合、適用期間の初期表示を行う
			var fromDate = clutil.addDate(clcom.getOpeDate(), 1);
			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 検索日
				datepicker: {
					el: "#ca_fromDate",
					initValue: fromDate
				},
				// 商品分類体系
				clitgrpfunccode: {
					el: "#ca_itgrpfuncID"
				},
				// 商品分類階層
				clitgrplevel: {
					el: "#ca_itgrplevelID",
					branches: ['p_id'],
					dependSrc: {
						itgrpfunc_id: 'itgrpfunc_id',
					}
				},
				clitgrpcode: {
					el: "#ca_upperItgrpID",
					dependSrc: {
						itgrplevel_id: 'p_id',
					},
				},
			}, {
			});
			this.fieldRelation.done(function() {

			});


			// アプリ個別の View や部品をインスタンス化するとか・・・
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid',
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				idProperty: "rowID"
			});
			this.listenTo(this.dataGrid, {
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					if (_this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
							_this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
						var newItem = {};
						gridView.addNewItem(newItem);
					}
				},
			});

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

			// シスパラ
			this.__ITGRP_FUNC_ID__ = clcom.getSysparam('PAR_AMMS_DEFAULT_ITGRP_FUNCID');
			this.__DIV_LEVEL_ID__ = 3;
			this.__VARIETY_LEVEL_ID__ = 4;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				this.dataGrid.setEditable(false);
				this.dataGrid.setEnable(false);
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				this.dataGrid.setEditable(false);
				this.dataGrid.setEnable(false);
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				this.dataGrid.setEditable(false);
				this.dataGrid.setEnable(false);
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
			$("#ca_table_tbody span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent('tr');
				$tgt_tr.remove();
			});

		},

		_onAddRowClick: function(e) {
			// 空データ挿入
			var add_tmp = {
				no: 0,
				relItgrpID: 0,
				relItgrpCode: "",
				relItgrpName: "",
				relItgrpDivID: 0,
				relItgrpDivCode: "",
				relItgrpDivName: "",

			};
			var tr = _.template($("#ca_rec_template").html(), add_tmp);
			$("#ca_table_tbody").append(tr);

			/*
			 * 行削除
			 */
			$("#ca_table_tbody tr:last span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});

			// autocomplete
			var optDiv = {
				getItgrpFuncId: function() {
					var id = clcom.getItgrpFuncBasic();
					id = id > 0 ? id : 1;
					return id;
				},
				getItgrpLevelId: function() {
					var id = clcom.getStdItgrpLevel();
					id = id > 0 ? id - 1 : 3;
					return id;
				},
			};
			var opt = {
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
				};
			var $inputDiv = $("#ca_table_tbody tr:last input:eq(0)");
			clutil.clitgrpcode($inputDiv, optDiv);

			var $input = $("#ca_table_tbody tr:last input:eq(1)");
			clutil.clitgrpcode($input, opt);

			clutil.initUIelement($("#ca_table"));
		},

		/**
		 * テーブル描画
		 * @param list
		 */
		renderTable: function(list) {
			var $tbody = $("#ca_table_tbody");
			$tbody.empty();
			$.each(list, function() {
				var dataDiv = {
					id: this.relItgrpDivID,
					code: this.relItgrpDivCode,
					name: this.relItgrpDivName,
				};
				var dataItgrp = {
					id: this.relItgrpID,
					code: this.relItgrpCode,
					name: this.relItgrpName,
				};
				var tr = _.template($("#ca_rec_template").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);

				var $tr = $tbody.find('tr:last');	// 追加した行

				// autocomplete初期化
				var optDiv = {
					getItgrpFuncId: function() {
						var id = clcom.getItgrpFuncBasic();
						id = id > 0 ? id : 1;
						return id;
					},
					getItgrpLevelId: function() {
						var id = clcom.getStdItgrpLevel();
						id = id > 0 ? id - 1 : 3;
						return id;
					},
				};
				var opt = {
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
				};
				var $inputDiv = $tr.find("input:eq(0)");
				clutil.clitgrpcode($inputDiv, optDiv);

				var $input = $tr.find("input:eq(1)");
				clutil.clitgrpcode($input, opt);

				// 改めてデータをセット
				$inputDiv.autocomplete('clAutocompleteItem', dataDiv);
				$input.autocomplete('clAutocompleteItem', dataItgrp);
			});
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			var _this = this;
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}

			// 一旦Viewを操作可能にする
			this.initReadonly();

			var data = args.data;
			var itgrp = data.AMMSV0040GetRsp.itgrp;
			var itgrpRel = data.AMMSV0040GetRsp.itgrpRel;
			var form = {
				fromDate: itgrp.fromDate,
				toDate: itgrp.toDate,
				itgrpID: itgrp.itgrpID,
				itgrpCode: itgrp.itgrpCode,
				itgrpName: itgrp.itgrpName,
				itgrpNameKana: itgrp.itgrpNameKana,
				itgrpShortName: itgrp.itgrpShortName,
				itgrpShortNameKana: itgrp.itgrpShortNameKana,
				writedownAge: itgrp.writedownAge,
				inventFlag: itgrp.inventFlag,
				itgrpfuncTypeID: itgrpRel.itgrpfuncTypeID,
				itgrpfuncID: {
					id: itgrpRel.itgrpfuncID,
					code: itgrpRel.itgrpfuncCode,
					name: itgrpRel.itgrpfuncName,
				},
				itgrplevelID: {
					id: itgrpRel.itgrplevelID,
					code: null,
					name: itgrpRel.itgrplevelName,
					p_id: itgrpRel.upperItgrpLevelID,
				},
				upperItgrpID: {
					id: itgrpRel.upperItgrpID,
					code: itgrpRel.upperItgrpCode,
					name: itgrpRel.upperItgrpName,
				},
			};
			var relItgrp = data.AMMSV0040GetRsp.relItgrp;
			this.relItgrpList = [];
			var i = 0;
			$.each(relItgrp, function() {
				var tmp = _.extend({}, this);
				//tmp.id = this.relItgrpID;
				tmp.relItgrpDivID = {
					id: this.relItgrpDivID,
					code: this.relItgrpDivCode,
					name: this.relItgrpDivName
				};
				tmp.relItgrpID = {
					id: this.relItgrpID,
					code: this.relItgrpCode,
					name: this.relItgrpName
				};
				tmp.no = i++;
				_this.relItgrpList.push(tmp);
			});

			// 基本分類＆品種階層の場合は、評価減対象年令を必須に
			var $ca_writedownAge = this.$("#ca_writedownAge");
			var $div_ca_writedownAge = this.$("#div_ca_writedownAge");
			var $ca_inventFlag = this.$("#ca_inventFlag");
			var $div_ca_inventFlag = this.$("#div_ca_inventFlag");
			if (itgrpRel.itgrpfuncTypeID == amcm_type.AMCM_VAL_ITGRPFUNC_BASIC &&
					itgrpRel.itgrplevelID == this.__VARIETY_LEVEL_ID__) {
				// 基本分類＆品種階層の場合は必須
				clutil.viewRemoveReadonly($div_ca_writedownAge);
				$div_ca_writedownAge.addClass('required');
				$ca_writedownAge.addClass('cl_valid cl_required');

				clutil.viewRemoveReadonly($div_ca_inventFlag);
				$div_ca_inventFlag.addClass('required');
				$ca_inventFlag.addClass('cl_valid cl_required');
			} else {
				// それ以外の場合は、編集不可
				clutil.viewReadonly($div_ca_writedownAge);
				$div_ca_writedownAge.removeClass('required');
				$ca_writedownAge.removeClass('cl_valid cl_required');

				clutil.viewReadonly($div_ca_inventFlag);
				$div_ca_inventFlag.removeClass('required');
				$ca_inventFlag.removeClass('cl_valid cl_required');
			}

			switch(args.status){
			case 'OK':
				if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD ||
						this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
					var ope_date = clcom.getOpeDate();
					if (form.fromDate <= ope_date) {
						form.fromDate = clutil.addDate(ope_date, 1);
					}
				}
				// args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				clutil.data2view(this.$("#ca_form"), form);
				//clutil.data2view(this.$("#ca_form"), itgrpRel);
				//this.renderTable(this.relItgrpList);
				this.fieldRelation.done(_.bind(function() {
					this._addEvent();
					this._onItgrpFuncChange();

					switch (this.opeTypeId) {
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
						// 体系は入力不可
						clutil.inputReadonly(this.$('#ca_itgrpfuncID'));
						// 階層は入力不可
						clutil.inputReadonly(this.$('#ca_itgrplevelID'));
						// コードは入力不可
						clutil.inputReadonly(this.$('#ca_itgrpCode'));
						this.dataGrid.setEditable(true);
						this.dataGrid.setEnable(true);

						this.dataGrid.setData({
							rowDelToggle: true,
							data: this.relItgrpList,
						});
						// 初期フォーカスは上位分類
						//this.resetFocus($("#ca_upperItgrpID"));
						this.resetFocus($("#ca_fromDate"));
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
						clutil.viewReadonly($("#ca_form"));
						clutil.inputRemoveReadonly($('#ca_fromDate'));
						this.dataGrid.setData({
							rowDelToggle: true,
							data: this.relItgrpList,
						});
						this.dataGrid.setEditable(false);
						this.dataGrid.setEnable(false);
						this.resetFocus($("#ca_fromDate"));
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
						clutil.viewReadonly($("#ca_form"));
						this.dataGrid.setData({
							rowDelToggle: true,
							data: this.relItgrpList,
						});
						this.dataGrid.setEditable(false);
						this.dataGrid.setEnable(false);
						break;
					}
				}, this));
				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), form);
				//clutil.data2view(this.$("#ca_form"), itgrpRel);
				//this.renderTable(this.relItgrpList);
				this.dataGrid.setData({
					rowDelToggle: false,
					data: this.relItgrpList,
				});

				this.fieldRelation.done(_.bind(function() {
					// 確定済なので、 全 <input> は readonly 化するなどの処理。
					clutil.viewReadonly($("#ca_form"));
					this.dataGrid.setEditable(false);
					this.dataGrid.setEnable(false);
				}, this));
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), form);
				//clutil.data2view(this.$("#ca_form"), itgrpRel);
				//this.renderTable(this.relItgrpList);
				this.dataGrid.setData({
					rowDelToggle: false,
					data: this.relItgrpList,
				});

				this.fieldRelation.done(_.bind(function() {
					// 確定済なので、 全 <input> は readonly 化するなどの処理。
					clutil.viewReadonly($("#ca_form"));
					this.dataGrid.setEditable(false);
					this.dataGrid.setEnable(false);
				}, this));
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			// 適用期間
			clutil.datepicker($("#ca_toDate"));

			clutil.cltxtFieldLimit($("#ca_itgrpCode"));
			clutil.cltxtFieldLimit($("#ca_itgrpName"));
			clutil.cltxtFieldLimit($("#ca_itgrpNameKana"));
			clutil.cltxtFieldLimit($("#ca_itgrpShortName"));
			clutil.cltxtFieldLimit($("#ca_itgrpShortNameKana"));

			// 適用期間終了日は、編集不可
			clutil.viewReadonly($("#div_ca_toDate"));
			// 初期のアコーディオン展開状態をつくる。

			return this;
		},

		getFromDate: function() {
			var ymd = $("#ca_fromDate").val();
			if (ymd == null || ymd == "") {
				return clcom.getOpeDate();
			}
			ymd = clutil.dateFormat(ymd, 'yyyymmdd');
			return ymd;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			var _this = this;
			this.mdBaseView.render();

			/*
			 * データグリッド
			 */
			var columns = [
				{
					id: 'col_1',
					name: '部門',
					field: 'relItgrpDivID',
					width: 180,
					cellType: {
						type: 'clajaxac',
						editorOptions: {
							funcName: 'itgrpcode',
							dependAttrs: function(item){
								return {
									ymd: _this.getFromDate(),
									itgrpfunc_id: _this.__ITGRP_FUNC_ID__,
									itgrplevel_id: _this.__DIV_LEVEL_ID__,
								};
							}
						},
						validator: 'required'
					}
				},
				{
					id: 'col_2',
					name: '品種',
					field: 'relItgrpID',
					width: 180,
					cellType: {
						type: 'clajaxac',
						editorOptions: {
							funcName: 'itgrpcode',
							dependAttrs: function(item){
								return {
									ymd: _this.getFromDate(),
									itgrpfunc_id: _this.__ITGRP_FUNC_ID__,
									itgrplevel_id: _this.__VARIETY_LEVEL_ID__,
									parent_id: item.relItgrpDivID.id,
								};
							}
						},
						validator: 'required'
					}
				},
			];
			var data = [];
			for (var i = 0; i < 5; i++) {
				var tmp = {
					relItgrpDivID: {
						id: 0,
						code: "",
						name: "",
					},
					relItgrpID: {
						id: 0,
						code: "",
						name: "",
					}
				};
				data.push(tmp);
			}

			this.dataGrid.render().setData({
				columns: columns,
				data: data,
			});

			this.mdBaseView.fetch();	// データを GET してくる。
			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				var toDate = clcom.max_date;
				$("#ca_toDate").datepicker("setIymd", toDate);

				var $ca_writedownAge = this.$("#ca_writedownAge");
				var $div_ca_writedownAge = this.$("#div_ca_writedownAge");
				var $ca_inventFlag = this.$("#ca_inventFlag");
				var $div_ca_inventFlag = this.$("#div_ca_inventFlag");

				clutil.viewReadonly($div_ca_writedownAge);
				$div_ca_writedownAge.removeClass('required');
				$ca_writedownAge.removeClass('cl_valid cl_required');

				clutil.viewReadonly($div_ca_inventFlag);
				$div_ca_inventFlag.removeClass('required');
				$ca_inventFlag.removeClass('cl_valid cl_required');

				// 初期フォーカスは期間開始日
				this.resetFocus($("#ca_fromDate"));
			} else if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
				// 「適用期間」を「削除日」にする
				this.$("#ca_term").find('p.fieldName').text('削除日');
				this.$("#ca_term").find('.deldspn').hide();

				this.$("#div_ca_fromDate").before('<p id="ca_tp_del"><span>?</span></p>');

				$("#ca_tp_del").addClass("txtInFieldUnit flright help").attr("data-original-title", "削除日以降、当商品分類は無効扱いとなります").tooltip({html: true});
			}
			return this;
		},

		getSrchYmd: function() {
			var ymd = $("#ca_fromDate").val();
			ymd = clutil.dateFormat(ymd, 'yyyymmdd');
			return ymd;
		},

		/**
		 * 商品分類体系ID取得
		 */
		getItgrpFuncId: function() {
			var data = $("#ca_itgrpfuncID").autocomplete('clAutocompleteItem');
			var id = 0;
			if (data != null && data.id != null) {
				id = data.id;
			}
			return id;
//			var idstr = $("#ca_itgrpfuncID").attr("cs_id");
//			var id = 0;
//			try {
//				if (idstr == null) {
//					id = 0;
//				} else {
//					id = parseInt(idstr);
//				}
//			} catch (e) {
//			}
//			return id;
		},

		/**
		 * 商品分類階層ID取得
		 */
		getItgrpLevelId: function() {
//			var data = $("#ca_itgrplevelID").data('cl_autocomplete_item');
			var data = $("#ca_itgrplevelID").autocomplete('clAutocompleteItem');
			var id = 0;
			if (data != null && data.p_id != null) {
				id = data.p_id;
			}
			return id;
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
				AMMSV0040GetReq: {
					srchID: chkData.itgrpID,		// 商品分類ID
					srchDate: chkData.toDate,		// 適用終了日
					delFlag: chkData.delFlag,	// 削除フラグ
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMMSV0040UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMMSV0040',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			var f_error = false;
			var _this = this;

			// エラー表示のクリア
			this.mdBaseView.validator.clear();
			this.validator.clear();
			this.dataGrid.clearCellMessage();

			this.dataGrid.stopEditing();
			if (!this.mdBaseView.validator.valid()) {
				return null;
			}
			var tailIsEmptyFunc = function(dto) {
				return ((dto.relItgrpDivID == null || dto.relItgrpDivID.id == 0) && (dto.relItgrpID == null || dto.relItgrpID.id == 0));
			};
			var errors = this.dataGrid.validate(tailIsEmptyFunc);
			if (!_.isEmpty(errors)) {
				// グリッド内に問題あり
				this.dataGrid.setCellMessage(errors);
				return null;
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
				if (fromDate <= ope_date){ // 開始日が明日以降でない
					this.validator.setErrorHeader(clmsg.cl_st_date_min_opedate);
					this.validator.setErrorMsg($fromDate, clmsg.cl_st_date_min_opedate);
					f_error = true;
				}
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				var compfromDate = ope_date < recfromDate ? recfromDate : ope_date;
				var msg = ope_date > recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
				if (ope_date >= recfromDate) {
					if (fromDate <= compfromDate && rectoDate == clcom.max_date) {
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

			var relItgrpX = this.dataGrid.getData({
				delflag: false,
			});
			console.log(relItgrpX);

			var itgrp = clutil.view2data($("#ca_form"));
			delete itgrp.itgrpfuncData;
			delete itgrp.itgrplevelData;
			delete itgrp.upperItgrpData;
			delete itgrp.itgrpfuncCode;
			delete itgrp.itgrpfuncName;
			delete itgrp.itgrplevelID;
			delete itgrp.itgrplevelCode;
			delete itgrp.itgrplevelName;
			delete itgrp.upperItgrpID;
			delete itgrp.upperItgrpCode;
			delete itgrp.upperItgrpName;
			delete itgrp.pa_itgrpName;
			delete itgrp.pa_itgrpNameKana;
			delete itgrp.pa_itgrpShortName;
			delete itgrp.pa_itgrpShortNameKana;

			var itgrprel = clutil.view2data($("#ca_form"));
			delete itgrprel.itgrpfuncData;
			delete itgrprel.itgrplevelData;
			delete itgrprel.upperItgrpData;
			delete itgrprel.itgrplevelCode;
			delete itgrprel.itgrpCode;
			delete itgrprel.itgrpName;
			delete itgrprel.itgrpNameKana;
			delete itgrprel.itgrpShortName;
			delete itgrprel.itgrpShortNameKana;
			delete itgrprel.pa_itgrpName;
			delete itgrprel.pa_itgrpNameKana;
			delete itgrprel.pa_itgrpShortName;
			delete itgrprel.pa_itgrpShortNameKana;

			var add = {
				fromDate: itgrp.fromDate,
				toDate: itgrp.toDate,
				itgrpID: itgrp.itgrpID,
			};
			var ids = [];
			var relItgrp = [];
//			var relItgrp = clutil.tableview2data($("#ca_table_tbody tr"));
			if (relItgrpX.length > 0) {
				$.each(relItgrpX, function(index) {
					if (this.relItgrpDivID == null || this.relItgrpID == null) {
						return;
					}
					if ((this.relItgrpDivID != null && this.relItgrpDivID.id != 0)
							|| (this.relItgrpID != null && this.relItgrpID.id != 0)) {
						if (_.indexOf(ids, this.relItgrpID.id) >= 0) {
							// 重複する品種が選択されている
							_this.dataGrid.setCellMessage(this.rowID, 'col_2', 'error', '関連基準分類が重複しています');
							f_error = true;
						} else {
							ids.push(this.relItgrpID.id);
						}
					}
					var rel = _.extend({}, this);
					rel = _.extend(rel, add);
					rel.relItgrpDivID = this.relItgrpDivID.id;
					rel.relItgrpID = this.relItgrpID.id;
					if (rel.relItgrpID != 0) {
						relItgrp.push(rel);
					}
				});
			}
			if (f_error) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return null;
			}

			if (relItgrp.length > 0) {
				itgrp.relItgrpFlag = 1;
			} else {
				itgrp.relItgrpFlag = 0;
			}

			// 画面入力値をかき集めて、Rec を構築する。
			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: opeTypeId,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
				AMMSV0040GetReq: {
				},
				// 商品分類マスタ更新リクエスト
				AMMSV0040UpdReq: {
					itgrp: itgrp,
					itgrpRel: itgrprel,
					relItgrp: relItgrp,
				},
			};
			return {
				resId: clcom.pageId,
				data:  updReq,
			};

		},

		_onItgrpFuncChange: function() {
			if(this.deserializing){
				// データセット中
				return;
			}

			var $tgt = this.$('#ca_itgrpfuncID');
			var item = $tgt.autocomplete('clAutocompleteItem');
			var id = item != null ? item.id : 0;

			if (id == 1) {
				// 基準の場合は関連基準分類を非表示
				this.$('#ca_table_tbody').empty();
				this.$('#div_table').hide();
			} else {
				this.$('#div_table').show();
			}
		},

		_onItgrpLevelChange: function() {
			if(this.deserializing){
				// データセット中
				return;
			}
			var $tgt = this.$("#ca_itgrplevelID");
			var item = $tgt.autocomplete('clAutocompleteItem');
			var id = item != null ? item.id : 0;

			var $ca_writedownAge = this.$("#ca_writedownAge");
			var $div_ca_writedownAge = this.$("#div_ca_writedownAge");
			var $ca_inventFlag = this.$("#ca_inventFlag");
			var $div_ca_inventFlag = this.$("#div_ca_inventFlag");

			if (id == this.__VARIETY_LEVEL_ID__) {
				// 階層が品種なら、棚卸対象フラグをONにする
				$ca_inventFlag.attr('checked', true).closest('label').addClass('checked');
				clutil.viewRemoveReadonly($div_ca_writedownAge);
				clutil.viewRemoveReadonly($div_ca_inventFlag);

				$div_ca_writedownAge.addClass('required');
				$ca_writedownAge.addClass('cl_valid cl_required');
			} else {
				// 品種でないなら、オフにして編集不可
				$ca_inventFlag.attr('checked', false).closest('label').removeClass('checked');

				clutil.viewReadonly($div_ca_writedownAge);
				clutil.viewReadonly($div_ca_inventFlag);
				$div_ca_inventFlag.removeClass('required');
				$ca_inventFlag.removeClass('cl_valid cl_required');

				$ca_writedownAge.val("");
				this.validator.clear();
			}
		},

		initReadonly: function() {
			clutil.viewRemoveReadonly($("#ca_form"));
			// 適用終了日は操作不可
			clutil.inputReadonly($("#ca_toDate"));
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			}
		},

		_eof: 'AMSSV0040.MainView//'
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
