useSelectpicker2();

$(function() {
	ClGrid.Formatters.defaultFormatter = function(value) {
		if (value == null) return '';
		return value;
	};

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));
	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),

		events: {
			'blur .srchCond': "_onSrchCondBlur",
		},

		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			clutil.inputlimiter(this.$el);

			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 検索日
				datepicker: {
					el: "#ca_fromDate",
				},
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID"
				},
				clvendorcode: {
					el: "#ca_vendorID",
					dependAttrs: {
						vendor_typeid: amcm_type.AMCM_VAL_VENDOR_CORRECT,
					},
					addDepends:['unit_id'],
				},
			}, {
			});
			this.fieldRelation.done(function() {

			});

			var unit = null;
			var unit_id = clcom.getUserData().unit_id;
			if(unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				unit = unit_id;
				//clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}

			// 取引先
//			clutil.clvendorcode(this.$("#ca_vendorID"), {
//				getVendorTypeId: function() {
//					return amcm_type.AMCM_VAL_VENDOR_CORRECT;	// 補正業者
//				},
//			});
			clutil.datepicker($("#ca_toDate"));
			//$("#ca_vendorID").removeAttr('data-field-cid');

			// 初期値を設定
			this.deserialize({
				unitID: unit,					// 事業ユニットID
				vendorID: 0,					// 取引先ID
				fromDate: clutil.addDate(clcom.getOpeDate(), 1),	// 検索日
				toDate: clcom.max_date,
			});

		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			return clutil.view2data(this.$el);
		},

		/**
		 * 検索リクエストパケットの設定値を UI へセットする。
		 */
		deserialize: function(obj){
			this.deserializing = true;
			try{
				var dto = _.extend({}, obj);
				clutil.data2view(this.$el, dto);
			}finally{
				this.deserializing = false;
			}
		},
		/**
		 * 指定プロパティ名（ ⇔ 検索 Req 上のメンバ名）の UI 設定値を取得する。
		 * defaultVal は、設定値が無い場合に返す値。
		 */
		getValue: function(propName, defaultVal){
			if(_.isUndefined(defaultVal)){
				defaultVal = null;
			}
			if(!_.isString(propName) || _.isEmpty(propName)){
				return defaultVal;
			}
			var dto = this.serialize();
			var val = dto[propName];
			return (_.isUndefined(val) || _.isNull(val) || _.isEmpty(val)) ? defaultVal : val;
		},
		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			return true;
		},

		/**
		 * 検索条件が整っているか
		 * @param e
		 */
		_onSrchCondBlur: function(e) {
//			if(!this.isValid()){
//				return;
//			}
			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		validator: null,

		// Events
		events : {
		},

		f_srch: false,
		f_confirm: true,

		initialize: function(opt) {
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
					title: '補正業者マスタ',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					isConfirmLeaving: this._isConfirmLeaving,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// アプリ個別の View や部品をインスタンス化するとか・・・

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// データグリッド
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid',
				gridOptions: {
					autoHeight: false,
					frozenColumn: 0,
				},
			});

			this.dataGrid.getHeadMetadata = this.getHeadMetadata;

			this.listenTo(this.dataGrid, {
				'cell:change': this.changeCell,
			});

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// この画面はGETも受け取る
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);

				this.f_srch = true;
				this.f_confirm = false;
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

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			clutil.mediator.on('ca_onSearch', this._onSrch);

			this.srchCond = {
				fromDate: 0,
				toDate: 0,
				unitID: 0,
				vendorID: 0,
			};
			// 検索パネル srchCondView から検索ボタン押下イベント
		},

		getHeadMetadata: function(row){
			return {
				cssClasses: 'row' + row
			};
		},

		/**
		 * 単価設定テーブルの描画
		 * @param priceInfoList
		 */
		renderTablePriceInfo: function(priceInfoList) {
			// 一旦クリア
			$('#ca_table2_tbody').empty();

			var _this = this;
			/*
			 * 補正単価情報
			 */
			_this.priceInfoList = _.extend([], priceInfoList); // 一応コピー
			var no = 1;
			$.each(_this.priceInfoList, function() {
				this.no = no++;
				this.adjustPrice = clutil.comma(this.adjustPrice);
			});
			$select_template2 = this.$('#ca_table2_tbody_template');
			// 取得したデータを表示する
			$select_template2.tmpl(_this.priceInfoList).appendTo('#ca_table2_tbody');

			clutil.initUIelement(_this.$('#ca_table2'));
		},

		/**
		 * 店舗設定テーブルヘッダ描画
		 */
		renderTableStoreInfoHeader: function() {
			// 一旦クリア
			this.$("#ca_table1_thead").empty();

			if (this.storeInfoList == null || this.storeInfoList.length == 0) {
				return;
			}

			var offsetInfoHead = this.storeInfoList[0];
			offsetInfoHead.colspan = offsetInfoHead.offsetInfoList.length;

			// ヘッダ
			$store_head_tmpl = this.$('#ca_table1_thead_template');
			$store_head_tmpl.tmpl(offsetInfoHead).appendTo('#ca_table1_thead');
		},

		/**
		 * 店舗設定テーブルボディ描画
		 * @param filter 店舗フィルタ
		 */
		renderTableStoreInfoBody: function(filter) {
			// 一旦クリア
			this.$("#ca_table1_tbody").empty();

			var _this = this;
			var storeList = [];
			var storeMap = {};

			$.each(_this.storeInfoList, function() {
				if (filter != null && filter != "") {
					var store = this.storeCode + ":" + this.storeName;
					if (store.search(filter) < 0) {
						return;
					}
				}
				storeList.push(this);
				storeMap[this.no] = this;
			});

			// ボディ
			$select_template1 = this.$('#ca_table1_tbody_template');
			// 取得したデータを表示する
			$select_template1.tmpl(storeList).appendTo('#ca_table1_tbody');

			clutil.initUIelement(_this.$('#ca_table1'));

			// チェックボックスの再現
			$.each(this.$("#ca_table1_tbody tr"), function() {
				var $tr = $(this);
				var no = $tr.attr('name');
				var store = storeMap[no];

				// 館内業者
				var $kannai = $tr.find('input[name="ca_kannaiFlag"]');
				if (store.kannaiFlag != 0) {
					$kannai.attr('checked', true).closest('label').addClass('checked');
				} else {
					$kannai.attr('checked', false).closest('label').removeClass('checked');
				}

				// 最低保障対象月
				var months = $tr.find('input[name="ca_month"]');
				for (var i = 0; i < months.length; i++) {
					var $month = $(months[i]);
					if (store.month[i] != 0) {
						$month.attr('checked', true).closest('label').addClass('checked');
					} else {
						$month.attr('checked', false).closest('label').removeClass('checked');
					}
				}

			});
		},

		/**
		 * 店舗設定テーブル描画
		 */
		renderTableStoreInfo: function(storeInfoList) {
			var _this = this;
			var no = 1;
			/*
			 * 店舗別設定情報
			 */
			_this.storeInfoList = _.extend([], storeInfoList);
			var len = _this.storeInfoList.length;
			$.each(_this.storeInfoList, function() {
				// 番号
				this.no = no++;
				this.storeFromIDate = clutil.dateFormat(this.storeFromDate, "yyyy/mm/dd(w)");
				this.storeToIDate = clutil.dateFormat(this.storeToDate, "yyyy/mm/dd(w)");
				// 館内業者フラグ
				if (this.kannaiFlag != 0) {
					this.f_kannai = "checked";
				} else {
					this.f_kannai = "";
				}
				// 最低保障対象月
				this.mon = new Array(12);
				for (var i = 0; i < this.month.length; i++) {
					var val = {};
					if (this.month[i] == 1) {
						val.f_month = "checked";
					} else {
						val.f_month = "";
					}
					this.mon[i] = val;
				}
			});

			this.renderTableStoreInfoHeader();	// ヘッダ描画
			this.renderTableStoreInfoBody();	// ボディ描画

			// 件数表示
			$("#p_comment").text('全部で' + len + '件あります');
		},

		/**
		 * テーブル描画
		 * @param adjustVendor
		 */
		renderTable: function(adjustVendor) {
			var columns = this.getColumns(adjustVendor);
			var header = this.getColhdMetadatas(adjustVendor);
			/*
			 * 補正単価情報
			 */
			this.renderTablePriceInfo(adjustVendor.priceInfoList);
			this.dataGrid.setData({
				columns: columns,
				colhdMetadatas: header,
				data: adjustVendor.storeInfoList,
				gridOptions: {
					autoHeight: false,
					frozenColumn: 0,
				},
			});
			this.dataGrid.grid.resizeCanvas();

			this.storeInfoList = _.extend([], adjustVendor.storeInfoList);
			var len = this.storeInfoList.length;

			// 件数表示
			$("#p_comment").text('全部で' + len + '件あります');
			//this.renderTableStoreInfo(adjustVendor.storeInfoList);
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			var data = args.data;
			var getRsp = data.getRsp;
			var adjustVendor = _.deepClone(getRsp.adjustVendor);	// まずディープクローンを取る
			var vendorData = {
				id: adjustVendor.vendorID,
				code: adjustVendor.vendorCode,
				name: adjustVendor.vendorName,
			};
			adjustVendor.vendorID = vendorData;

			if (adjustVendor.outTypeID == 0) {
				adjustVendor.outTypeID = 1;
			}

			_.each(adjustVendor.storeInfoList, _.bind(function(store) {
				store.storeView = store.storeCode + ';' + store.storeName;
				store.storeFromIDate = clutil.dateFormat(store.storeFromDate, 'yyyy/mm/dd(w)');
				store.storeToIDate = clutil.dateFormat(store.storeToDate, 'yyyy/mm/dd(w)');
				for (var i = 0; i < 12; i++) {
					var field = 'month' + (i+1);
					store[field] = store.month[i];
				}
				_.each(store.offsetInfoList, _.bind(function(offset, j) {
					var offsetPrice = 'offsetPrice' + j;
					store[offsetPrice] = offset.offsetPrice;
				}, this));
			}, this));

			_.each(adjustVendor.priceInfoList, _.bind(function(price) {
				if (price.adjustPrice === 0) {
					price.adjustPrice = '';
				}
			}, this));

			clutil.viewRemoveReadonly($("#ca_form"));
			clutil.inputReadonly($("#ca_toDate"));
			clutil.viewRemoveReadonly($("#ca_table1_form"));
			clutil.viewRemoveReadonly($("#ca_table2_form"));

			switch(args.status){
			case 'OK':
				if (adjustVendor.storeInfoList.length == 0 ||
						adjustVendor.priceInfoList.length == 0) {
					// 店舗情報がないのでエラー
					this.mdBaseView.validator.setErrorHeader(clmsg.EGM0011);
					return;
				}
				// args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				clutil.data2view(this.$("#ca_form"), adjustVendor);
				this.renderTable(adjustVendor);

				this.srchCondView.fieldRelation.done(_.bind(function() {
					switch (this.opeTypeId) {
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
						// 事業ユニットは入力不可
						clutil.inputReadonly(this.$('#ca_unitID'));
						// 取引先は入力不可
						clutil.inputReadonly(this.$('#ca_vendorID'));
						// 初期フォーカスは適用開始日
						this.resetFocus($("#ca_fromDate"));
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
						// 事業ユニットは入力不可
						//clutil.inputReadonly(this.$('#ca_unitID'));
						// 取引先は入力不可
						//clutil.inputReadonly(this.$('#ca_vendorID'));
						// 帳票出力を入力可
						clutil.viewRemoveReadonly(this.$("#ca_list_form"));
						this.dataGrid.setEditable(true);
						this.dataGrid.setEnable(true);

						this.addEvents();

						this.mdBaseView.setSubmitEnable(true);
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
						clutil.viewReadonly($("#ca_form"));
						clutil.viewReadonly($("#ca_table1_form"));
						clutil.viewReadonly($("#ca_table2_form"));
						this.dataGrid.setEditable(false);
						this.dataGrid.setEnable(false);

						clutil.inputRemoveReadonly($('#ca_fromDate'));
						clutil.setFocus($("#ca_fromDate"));
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
						clutil.viewReadonly($("#ca_form"));
						clutil.viewReadonly($("#ca_table1_form"));
						clutil.viewReadonly($("#ca_table2_form"));
						//this.dataGrid.setEditable(false);
						this.dataGrid.setEnable(false);
						break;
					}
				}, this));
				this.f_confirm = true;
				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), adjustVendor);
				this.renderTable(adjustVendor);

				this.srchCondView.fieldRelation.done(_.bind(function() {
					// 確定済なので、 全 <input> は readonly 化するなどの処理。
					clutil.viewReadonly($("#ca_form"));
					clutil.viewReadonly($("#ca_table1_form"));
					clutil.viewReadonly($("#ca_table2_form"));
					this.dataGrid.setEditable(true);
					this.dataGrid.setEnable(true);
				}, this));
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table1_form"));
				clutil.viewReadonly($("#ca_table2_form"));
				this.dataGrid.setEditable(true);
				this.dataGrid.setEnable(true);
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), adjustVendor);
				this.renderTable(adjustVendor);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.srchCondView.fieldRelation.done(_.bind(function() {
					// 確定済なので、 全 <input> は readonly 化するなどの処理。
					clutil.viewReadonly($("#ca_form"));
					clutil.viewReadonly($("#ca_table1_form"));
					clutil.viewReadonly($("#ca_table2_form"));
					this.dataGrid.setEditable(true);
					this.dataGrid.setEnable(true);
				}, this));
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_table2_form"));
				this.dataGrid.setEditable(true);
				this.dataGrid.setEnable(true);
				clutil.mediator.trigger('onTicker', data.rspHead);
				break;
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function() {
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();

			clutil.inputlimiter(this.$el);

			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// 登録ボタンは操作不可にする
				this.mdBaseView.setSubmitEnable(false);
			}
			switch (this.opeTypeId) {
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
				clutil.fixReadonly($("#ca_vendorID"));
				break;
			}

			return this;
		},

		/**
		 * セル変更イベント
		 * @param e
		 */
		changeCell: function(e) {
			if (e.isBody) {
				// ボディ部のセル変更なので何もしない
			} else {
				// ヘッダの店舗コード
				if (e.cell === 0) {
					this.updateFilter({storeCode: e.item.storeView});
				}
			}
		},

		/**
		 * フィルター更新
		 * @param args
		 */
		updateFilter: function(args) {
			this.dataGrid.dataView.setBodyFilterArgs(args);
			this.dataGrid.dataView.setBodyFilter(this.gridFilter);
			this.dataGrid.grid.invalidate();
		},

		unsetFilter: function() {
			this.updateFilter({storeCode: null });
		},

		/**
		 * 店舗コードフィルタ
		 * @param item
		 * @param args
		 */
		gridFilter: function(item, args) {
			return !args.storeCode || item.storeView.indexOf(args.storeCode) >= 0;
		},

		/*
		 * 店舗データグリッドのカラム情報作成
		 */
		getColumns: function(adjustVendor) {
			var offsetInfo = [];

			if (adjustVendor != null) {
				var storeInfoList = adjustVendor.storeInfoList;
				if (storeInfoList != null && storeInfoList.length > 0) {
					if (storeInfoList[0].offsetInfoList != null) {
						offsetInfo = storeInfoList[0].offsetInfoList;
					}
				}
			}

			// 固定部
			var columns = [
				{
					id: 'col_1',
					name: '',
					field: 'storeView',
					width: 120,
					headCellType: function(args) {
						if (args.row == 1) {
							return {
								type: 'text',
								//limit: "len:4 digit",
							};
						}
					}
				},
				{
					id: 'col_2',
					name: '',
					field: 'storeFromIDate',
					width: 140,
				},
				{
					id: 'col_3',
					name: '',
					field: 'storeToIDate',
					width: 140,
				},
				{
					id: 'col_4',
					name: '',
					field: 'kannaiFlag',
					width: 80,
					cellType: {
						type: 'checkbox'
					},
				},
				{
					id: 'col_5',
					name: '',
					field: 'minSecurity',
					width: 130,
					cssClass: 'txtalign-right',		// 右寄せ,
					cellType: {
						type: "text",
						validator: "int:8",
						//limit: "int:8",
						formatFilter: "comma",
						editorOptions: {
							addClass: 'txtar'		// エディタ：右寄せ
						}
					}
				},
				{
					id: 'col_6',
					name: '1',
					field: 'month1',
					width: 32,
					cellType: {
						type: 'checkbox'
					},
				},
				{
					id: 'col_7',
					name: '2',
					field: 'month2',
					width: 32,
					cellType: {
						type: 'checkbox'
					},
				},
				{
					id: 'col_8',
					name: '3',
					field: 'month3',
					width: 32,
					cellType: {
						type: 'checkbox'
					},
				},
				{
					id: 'col_9',
					name: '4',
					field: 'month4',
					width: 32,
					cellType: {
						type: 'checkbox'
					},
				},
				{
					id: 'col_10',
					name: '5',
					field: 'month5',
					width: 32,
					cellType: {
						type: 'checkbox'
					},
				},
				{
					id: 'col_11',
					name: '6',
					field: 'month6',
					width: 32,
					cellType: {
						type: 'checkbox'
					},
				},
				{
					id: 'col_12',
					name: '7',
					field: 'month7',
					width: 32,
					cellType: {
						type: 'checkbox'
					},
				},
				{
					id: 'col_13',
					name: '8',
					field: 'month8',
					width: 32,
					cellType: {
						type: 'checkbox'
					},
				},
				{
					id: 'col_14',
					name: '9',
					field: 'month9',
					width: 32,
					cellType: {
						type: 'checkbox'
					},
				},
				{
					id: 'col_15',
					name: '10',
					field: 'month10',
					width: 32,
					cellType: {
						type: 'checkbox'
					},
				},
				{
					id: 'col_16',
					name: '11',
					field: 'month11',
					width: 32,
					cellType: {
						type: 'checkbox'
					},
				},
				{
					id: 'col_17',
					name: '12',
					field: 'month12',
					width: 32,
					cellType: {
						type: 'checkbox'
					},
				},
			];

			// 補正相殺項目
			_.each(offsetInfo, _.bind(function(item, i) {
				var id = 'col_' + (18 + i);
				var field = 'offsetPrice' + i;
				var c = {
					id : id,
					name: item.offsetItemName,
					field: field,
					width: 140,
					cssClass: 'txtalign-right',		// 右寄せ,
					cellType: {
						type: "text",
						validator: "int:8",
						//limit: "int:8",
						formatFilter: "comma",
						editorOptions: {
							addClass: 'txtar'		// エディタ：右寄せ
						}
					}
				};
				columns.push(c);
			}, this));

//XXX		// 全列の幅を可変にする
//			_.each(columns, function(item) {
//				item.resizable = true;
//			});

			return columns;
		},

		getColhdMetadatas: function(adjustVendor) {
			var offsetInfo = [];

			if (adjustVendor != null) {
				var storeInfoList = adjustVendor.storeInfoList;
				if (storeInfoList != null && storeInfoList.length > 0) {
					if (storeInfoList[0].offsetInfoList != null) {
						offsetInfo = storeInfoList[0].offsetInfoList;
					}
				}
			}
			var colspan = offsetInfo.length;

			var hd = {
				columns: {
					col_1: {
						colspan: 1,
						name: '店舗',
					},
					col_2: {
						colspan: 1,
						name: '店舗有効期間開始日',
					},
					col_3: {
						colspan: 1,
						name: '店舗有効期間終了日',
					},
					col_4: {
						colspan: 1,
						name: '館内業者',
					},
					col_5: {
						colspan: 1,
						name: '最低保障金額<br>（税抜）（円）',
					},
					col_6: {
						colspan: 12,
						name: '最低保障対象月',
					},
				}
			};
			if (colspan > 0) {
				var col_18 = {
					colspan: colspan,
					name: '固定相殺（税抜）（円）',
				};
				hd.columns.col_18 = col_18;
			}

			return [ hd ];
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();

			var columns = this.getColumns(null);
			var header = this.getColhdMetadatas(null);

			// データグリッド
			this.dataGrid.render().setData({
				columns: columns,
				colhdMetadatas: header,
				data: [],
				gridOptions: {
					autoHeight: false,
					frozenColumn: 0,
				},
			});

			this.mdBaseView.fetch();	// データを GET してくる。
			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// 新規の場合は、条件部以外を操作不可にする
				clutil.viewReadonly($("#ca_list_form"));

				// 新規の場合は、適用開始日に初期フォーカスする
				this.resetFocus($("#ca_fromDate"));
			} else if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
				// 「適用期間」を「削除日」にする
				this.$("#ca_term").find('p.fieldName').text('削除日');
				this.$("#ca_term").find('.deldspn').hide();

				this.$("#div_ca_fromDate").before('<p id="ca_tp_del"><span>?</span></p>');

				$("#ca_tp_del").addClass("txtInFieldUnit flright help").attr("data-original-title", "削除日以降、当補正業者は無効扱いとなります").tooltip({html: true});
			}
			clutil.viewReadonly($(".ca_toDate_div"));


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
				getReq: {
					srchUnitID: chkData.unitID,		// 事業ユニットID
					srchVendorID: chkData.vendorID,	// 取引先ID
					srchDate: chkData.toDate,		// 適用終了日
					delFlag : chkData.delFlag		// 削除(参照)フラグ
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				updReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMRSV0060',
				data: getReq
			};
		},

		_buildPriceInfoList: function(orglist) {
			var newlist = [];
			_.each(orglist, _.bind(function(v) {
				var vv = _.clone(v);
				if (_.isString(vv.adjustPrice)) {
					vv.adjustPrice = v.adjustPrice.split(",").join("");
				}
				newlist.push(vv);
			}, this));
			return newlist;
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			//var _this = this;
			var hasErr = false;

			// 店舗フィルタを解除
			$('.cl-colhead > .slick-cell.input').text('');
			this.dataGrid.dataView.getHeadItems()[1].storeView = '';
			this.unsetFilter();

			this.mdBaseView.validator.clear();

			if(!this.mdBaseView.validator.valid()) {
				return null;
			}

//			$('input[name="filterStore').val('');
//			this.renderTableStoreInfoBody();
//			this.addEventsStore();	// なんかやだ

			// 画面入力値をかき集めて、Rec を構築する。
			var adjustVendor = clutil.view2data(this.$('#ca_form'));
			// dataGrid
			this.dataGrid.stopEditing();
			if (!this.dataGrid.isValid()) {
				return null;
			}
			var tmp_storeInfoList = this.dataGrid.getData();
			_.each(tmp_storeInfoList, _.bind(function(store) {
				// 最低保障対象月
				for (var i = 0; i < 12; i++) {
					var field = 'month' + (i+1);
					store.month[i] = store[field];
				}

				// 補正単価情報
				_.each(store.offsetInfoList, _.bind(function(offset, j) {
					var offsetPrice = 'offsetPrice' + j;
					offset.offsetPrice = store[offsetPrice];
				}, this));
			}, this));

			adjustVendor.storeInfoList = tmp_storeInfoList;
			adjustVendor.priceInfoList = this._buildPriceInfoList(this.priceInfoList);

			var ope_date = clcom.getOpeDate();
			var $fromDate = this.$("#ca_fromDate");//$toDate = this.$("#ca_toDate");
			var fromDate = adjustVendor.fromDate;
			var recfromDate = null;
			var rectoDate = null;
			if (this.options.chkData !== undefined && this.options.chkData.length > 0){
				recfromDate = this.options.chkData[pgIndex].fromDate;
				rectoDate = this.options.chkData[pgIndex].toDate;
			}
			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				//if (fromDate <= ope_date){ // 開始日が明日以降でない
				//	this.validator.setErrorHeader(clmsg.cl_st_date_min_opedate);
				//	this.validator.setErrorMsg($fromDate, clmsg.cl_st_date_min_opedate);
				//	hasErr = true;
				//}

				/* 過去開始日を設定する場合があるようなので、チェックを外します（情シス-1240） */
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				var compfromDate = recfromDate;
				var msg = clmsg.cl_st_date_min_eddate;
				/* 過去開始日を設定する場合があるようなので、既存開始日以前チェックのみ行います。（情シス-1240） */
				if (fromDate < compfromDate && rectoDate == clcom.max_date) {
					this.validator.setErrorHeader(msg);
					this.validator.setErrorMsg($fromDate, msg);
					hasErr = true;
				}
//				if (ope_date >= recfromDate) {
//					if (fromDate <= compfromDate && rectoDate == clcom.max_date) {
//						this.validator.setErrorHeader(msg);
//						this.validator.setErrorMsg($fromDate, msg);
//						hasErr = true;
//					}
//				} else {
//					if (fromDate < compfromDate && rectoDate == clcom.max_date) {
//						this.validator.setErrorHeader(msg);
//						this.validator.setErrorMsg($fromDate, msg);
//						hasErr = true;
//					}
//				}
//				if (fromDate <= compfromDate && rectoDate == clcom.max_date/* && fromDate != recfromDate*/){ // 未来予約可能で修正でない状態で開始日が明日以降でない
//					this.validator.setErrorHeader(msg);
//					this.validator.setErrorMsg($fromDate, msg);
//					hasErr = true;
//				}
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				if (fromDate <= ope_date || fromDate < recfromDate){ // 設定開始日が明日以降かつ編集前開始日以降でない
					var msg = ope_date >= recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
					this.validator.setErrorHeader(msg);
					this.validator.setErrorMsg($fromDate, msg);
					hasErr = true;
				}
				break;
			default:
				break;
			}
			if(hasErr){ // エラーチェック毎にメッセージが決まっている⇒複数ある場合、一気に表示できていない。
				return null;
			}

			// 店舗入力チェック
			_.each(tmp_storeInfoList, _.bind(function(store, row) {
				var f_month = 0;
				for (var i = 0; i < 12; i++) {
					if (store.month[i] != 0) {
						f_month = 1;
					}
				}
				if (store.minSecurity > 0) {
					if (f_month == 0) {
						// 最低保障金額が設定されているが、対象月が選択されていない
						this.validator.setErrorHeader(clmsg.ERS0006);
						this.dataGrid.setCellMessage(store._cl_gridRowId, 'col_5', 'error', clmsg.ERS0006);
						hasErr = true;
					}
				} else {
					if (f_month != 0) {
						// 最低保障金額が設定されていないが、対象月が選択されている
						this.validator.setErrorHeader(clmsg.ERS0007);
						this.dataGrid.setCellMessage(store._cl_gridRowId, 'col_5', 'error', clmsg.ERS0007);
						hasErr = true;
					}
				}
				// 店舗有効期限
				if (adjustVendor.fromDate < store.storeFromDate || adjustVendor.fromDate > store.storeToDate) {
					// 適用開始日が店舗有効期間外
					this.validator.setErrorHeader(clmsg.ERS0008);
					this.dataGrid.setCellMessage(store._cl_gridRowId, 'col_5', 'error', clmsg.ERS0008);
					hasErr = true;
				}
			}, this));

			if (hasErr) {
				return null;
			}
			var ope;
			if (opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				ope = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
			} else {
				ope = opeTypeId;
			}
			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: ope,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
				getReq: {
				},
				// 商品分類マスタ更新リクエスト
				updReq: {
					adjustVendor: adjustVendor,
				},
			};
			return {
				resId: clcom.pageId,
				data:  updReq,
			};
		},

		/**
		 * 戻るなどの押下時に警告を出すかの判断
		 * @param isSubmitBlocking
		 * @param pgIndex
		 * @returns
		 */
		_isConfirmLeaving: function(isSubmitBlocking, pgIndex) {
			var flg = isSubmitBlocking;
			if (!flg && this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && !this.f_confirm) {
				flg = true;
			}
			return flg;
		},

		_isEmptyGetReq: function(getReq) {
			if (getReq.fromDate == null || getReq.fromDate == 0) {
				return true;
			}
			if (getReq.toDate == null || getReq.toDate == 0) {
				return true;
			}
			if (getReq.unitID == null || getReq.unitID == 0) {
				return true;
			}
			if (getReq.vendorID == null || getReq.vendorID == 0) {
				return true;
			}
			return false;
		},

		_isSameGetReq: function(getReq) {
			if (this.srchCond.fromDate !== getReq.fromDate) {
				return false;
			}
			if (this.srchCond.toDate !== getReq.toDate) {
				return false;
			}
			if (this.srchCond.unitID !== getReq.unitID) {
				return false;
			}
			if (this.srchCond.vendorID !== getReq.vendorID) {
				return false;
			}
			return true;
		},

		buildReq: function(srchReqDto) {
			var srchReq = {
				srchUnitID: srchReqDto.unitID,
				srchVendorID: srchReqDto.vendorID,
				srchDate: srchReqDto.fromDate,
				srchNewFlag: 1		// 新規登録モード
			};
			return srchReq;
		},

		/**
		 * 新規時の初期検索イベント
		 * @param e
		 */
		_onSrch: function(srchReqDto) {
			if (this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				return;
			}
			if (!this.f_srch) {
				return;
			}

			if (this._isEmptyGetReq(srchReqDto)) {
				// 未設定項目があれば終了
				return;
			}
			if (this._isSameGetReq(srchReqDto)) {
				// 前回と同じなら終了
				return;
			}
			if (!this.validator.valid()) {
				// 入力チェック
				return;
			}

			this.srchCond = _.clone(srchReqDto);
			var getReq = this.buildReq(srchReqDto);

			// 検索をする
			var reqHead = {
				opeTypeId :	am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
			};

			var req = {
				reqHead: reqHead,
				getReq : getReq
			};
			this.postJSON(req);
		},

		postJSON : function(req) {
			var uri = "AMRSV0060";

			clutil.postJSON(uri, req).done(_.bind(function(data, dataType) {
				clutil.mediator.trigger('onMDGetCompleted', {status: 'OK', data: clutil.dclone(data)});
			}, this)).fail(_.bind(function(data, dataType) {
				clutil.mediator.trigger('onMDGetCompleted', {status: 'NG', data: clutil.dclone(data)});
			}));
		},

		addEventsStore: function() {
			var _this = this;
			// StoreInfoのキー押下イベントを監視する
			$(".ca_store_info").on('keyup keydown', _.debounce(function(e) {
				var keyCode = e.keyCode;
				if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
					_this.changeStore($(this), e);
				}
			}, 300));
			$('.ca_store_info').change(function(e) {
				_this.changeStore($(this), e);
			});
		},

		addEvents: function() {
			var _this = this;
			// PriceInfoのキー押下イベントを監視する
			$(".ca_price_info").on('keyup keydown', _.debounce(function(e) {
				var keyCode = e.keyCode;
				if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
					_this.changePrice($(this), e);
				}
			}, 300));
			$(".ca_price_info").change(function(e) {
				_this.changePrice($(this), e);
			});
			// StoreInfoの店舗フィルタ
//			$('input[name="filterStore"]').on('keyup keydown', _.debounce(function(e) {
//				var keyCode = e.keyCode;
//				if (keyCode != 9 && keyCode != 13) {
//					var $tgt = $(e.target);
//					var filter = $tgt.val();
//					_this.renderTableStoreInfoBody(filter);
//					_this.addEventsStore();
//				}
//			}, 300));
//			$('input[name="filterStore"]').change(function(e) {
//				var $tgt = $(e.target);
//				var filter = $tgt.val();
//				_this.renderTableStoreInfoBody(filter);
//				_this.addEventsStore();
//			});

//			this.addEventsStore();
		},

	    /**
	     * 数値取得
	     */
	    getNum : function(value) {
	      if (isNaN(value)) {
	        return 0.00;
	      } else {
	        return value;
	      }
	    },

		/**
		 * 店舗別情報変更イベント
		 * @param $tr
		 * @param e
		 */
		changeStore: function($tr, e) {
			var _this = this;
			var i;
			var no;
			console.log($tr);

			no = Number($tr.attr('name'));	// 1オリジン

			// 館内フラグ
			var target = $tr.find("input[name='ca_kannaiFlag']");
			if ($(target).prop('checked')) {
				_this.storeInfoList[no-1].kannaiFlag = 1;
			} else {
				_this.storeInfoList[no-1].kannaiFlag = 0;
			}

			// 最低保障金額
			target = $tr.find("input[name='minSecurity']");
			var val = $(target).val().split(",").join("");
			var minSecurity = _this.getNum(Number(val));

			_this.storeInfoList[no-1].minSecurity = minSecurity;

			// 最低保障対象月
			var targets = $tr.find("input[name='ca_month']");
			for (i = 0; i < targets.length; i++) {
				target = targets[i];

				if ($(target).prop('checked')) {
					_this.storeInfoList[no-1].month[i] = 1;
				} else {
					_this.storeInfoList[no-1].month[i] = 0;
				}
			}

			// 固定金額
			targets = $tr.find("input[name='ca_offsetInfo']");
			for (i = 0; i < targets.length; i++) {
				target = targets[i];
				val = $(target).val().split(",").join("");
				var offsetPrice = _this.getNum(Number(val));
				_this.storeInfoList[no-1].offsetInfoList[i].offsetPrice = offsetPrice;
			}
		},

		/**
		 * 補正単価変更イベント
		 */
		changePrice: function($tr, e) {
			var _this = this;
			var target = $tr.find("input[name='adjustPrice']");
			console.log($tr);

			// 単価
			var adjustPrice = Number($(target).val());
			var no = Number($tr.attr('name'));
			console.log("no:" + no);
			_this.priceInfoList[no-1].adjustPrice = adjustPrice;
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			}
		},

		_eof: 'AMRSV0060.MainView//'
	});

	////////////////////////////////////////////////

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
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
