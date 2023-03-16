/* global MyApp: true */
(function(MyApp){
// 商品レコード
	/**
	 * @class ItemListView
	 * @constructor
	 * @param options
	 * @param options.itemRecords
	 * @param [options.readOnlyMode=false] 参照モード
	 */
	var ItemListView = Marionette.ItemView.extend({
		template: '#ItemListView',

		events: {
			'click @ui.gotoDistr': function(){
				this.dataGrid.stopEditing();
				MyApp.trigger('gotoDistr');
			}
		},

		ui: {
			dataGrid: '.dataGrid',
			gotoDistr: '.gotoDistr'
		},

		gridEvents: {
			'footer:addNewRow': function(){
				this.addEmptyRecord();
			},
			'cell:change': function(){
			}
		},

		initialize: function(){
			this.itemRecords = this.options.itemRecords;
			this.isLastApply = MyApp.reqres.request('isLastApply');
			this.canAddDel = !this.options.readOnlyMode && !this.isLastApply;
			// グリッドの初期化
			this.initDataGrid();
		},

		initDataGrid: function(){
			var canAddDel = this.canAddDel;

			this.dataGrid = new ClGrid.ClAppGridView({
				// 行削除ボタンを使用するフラグ。
				delRowBtn: canAddDel,
				// フッター部の新規行追加ボタンを使用するフラグ。
				footerNewRowBtn: canAddDel,
				graph: this.getGraph(),
				errorInside: true
			});
			this.listenTo(this.dataGrid, this.gridEvents);
			this.dataGrid.render();
		},

		getGraph: function(){
			var _this = this;
			if (!this.graph) {
				this.graph = new clutil.Relation.DependGraph()
				.add({
					id: 'priceIntax',
					depends: ['price'],
					onDependChange: function(e){
						var price = parseInt(e.model.get('price'), 10),
							priceIntax = '-';
						var maker = $("#ca_maker").autocomplete('clAutocompleteItem');
						var maker_id = 0;
						if (maker && maker.id) {
							maker_id = maker.id;
						}
						var taxrt = _this.getTaxRate(maker_id, clcom.getOpeDate());

						if (!_.isNaN(price)){
							priceIntax = clutil.mergeTax(price, taxrt).withTax;
						}
						e.model.set('priceIntax', priceIntax);
					}
				});
//				.add({
//					id: 'price',
//					depends: ['priceIntax'],
//					onDependChange: function(e){
//						var priceIntax = parseInt(e.model.get('priceIntax'), 10),
//							price = '-';
//						if (!_.isNaN(priceIntax)){
//							price = clutil.parseTax(priceIntax).withoutTax;
//						}
//						e.model.set('price', price);
//					}
//				});
			}
			return this.graph;
		},

		/**
		 * 空のレコードを返す
		 */
		createEmptyRecord: function(){
			return new MyApp.ItemRecords.prototype.model().toJSON();
		},

		addEmptyRecord: function(){
			var item = this.createEmptyRecord();
			this.dataGrid.addNewItem(item);
		},

		getColumns: function(){
			var lastApply = this.isLastApply;
			var beforeValid = function(item){
				item.emptyItem = false;
				if (!lastApply) return;
				// 追加発注時は空行ならばOK
				if ((!item.orderQy || item.orderQy === '0') &&
					!parseInt(item.dlvTypeID, 10) &&
					!item.finishDate &&
					!item.dlvDate){
					item.emptyItem = true;
					return false;
				}
			};

			return [
				{
					id: 'itemName',
					field: 'itemName',
					name: '商品名',
					width: 360,
					cellType: {
						type: 'text',
						validator: 'required zenkaku:25',
						// limit: 'zenkaku len:25',
						isEditable: function(){
							return !lastApply;
						}
					}
				},
				{
					id: 'makerItemCode',
					field: 'makerItemCode',
					name: 'メーカー品番',
					width: 150,
					cellType: {
						type: 'text',
						validator: 'required hankaku2:10',
						// limit: 'hankaku len:10',
						isEditable: function(){
							return !lastApply;
						}
					}
				},
				{
					id: 'makerColor',
					field: 'makerColor',
					name: '色番',
					cellType: {
						type: 'text',
						validator: 'required hankaku:3',
						// limit: 'alnum hankaku len:3',
						isEditable: function(item){
							return Boolean(!lastApply && MyApp.reqres.request('itgrpID'));
						}
					}
				},
				{
					id: 'color',
					field: 'color',
					name: 'カラー',
					cellType: {
						type: 'clajaxac',
						validator: 'required',
						editorOptions: {
							funcName: 'itemattrgrpcode',
							dependAttrs: function(){
								return {
									itgrp_id: MyApp.reqres.request('itgrpID'),
									iagfunc_id: MyApp.ITEMATTRGRPFUNC_ID_COLOR
								};
							}
						},
						isEditable: function(item){
							return Boolean(!lastApply &&
										   MyApp.reqres.request('itgrpID'));
						}
					}
				},
				{
					id: 'design',
					field: 'design',
					name: '柄',
					cellType: {
						type: 'clajaxac',
						validator: 'required',
						editorOptions: {
							funcName: 'itemattrgrpcode',
							dependAttrs: function(){
								return {
									itgrp_id: MyApp.reqres.request('itgrpID'),
									iagfunc_id: MyApp.ITEMATTRGRPFUNC_ID_DESIGN
								};
							}
						},
						isEditable: function(item){
							return Boolean(!lastApply &&
										   MyApp.reqres.request('itgrpID'));
						}
					}
				},
				{
					id: 'material',
					field: 'material',
					name: '素材',
					cellType: {
						type: 'clajaxac',
						validator: 'required',
						editorOptions: {
							funcName: 'itemattrgrpcode',
							dependAttrs: function(){
								return {
									itgrp_id: MyApp.reqres.request('itgrpID'),
									iagfunc_id: MyApp.ITEMATTRGRPFUNC_ID_MATERIAL
								};
							}
						},
						isEditable: function(item){
							return Boolean(!lastApply &&
										   MyApp.reqres.request('itgrpID'));
						}
					}
				},
				{
					id: 'style',
					field: 'style',
					name: 'スタイル',
					cellType: {
						type: 'clajaxac',
						validator: 'required',
						editorOptions: {
							funcName: 'itemattrgrpcode',
							dependAttrs: function(){
								return {
									itgrp_id: MyApp.reqres.request('itgrpID'),
									iagfunc_id: MyApp.ITEMATTRGRPFUNC_ID_STYLE
								};
							}
						},
						isEditable: function(item){
							return Boolean(!lastApply && MyApp.reqres.request('itgrpID'));
						}
					}
				},
				{
					id: 'brand',
					field: 'brand',
					name: '属性ブランド',
					cellType: {
						type: 'clajaxac',
						validator: 'required',
						editorOptions: {
							funcName: 'itemattrgrpcode',
							dependAttrs: function(){
								return {
									itgrp_id: MyApp.reqres.request('itgrpID'),
									iagfunc_id: MyApp.ITEMATTRGRPFUNC_ID_BRAND
								};
							}
						},
						isEditable: function(){
							return Boolean(!lastApply &&
										   MyApp.reqres.request('itgrpID'));
						}
					}
				},
				{
					id: 'size',
					field: 'size',
					name: 'サイズ',
					cellType: {
						type: 'clajaxac',
						validator: 'required',
						editorOptions: {
							funcName: 'sizecode2',
							dependAttrs: function(){
								return {
									sizeptnID: MyApp.reqres.request('sizeptnID')
								};
							}
						},
						isEditable: function(){
							return Boolean(!lastApply &&
										   MyApp.reqres.request('sizeptnID'));
						}
					}
				},
				{
					id: 'import',
					field: 'import',
					name: '生産国',
					cellType: {
						type: 'clajaxac',
						validator: 'required',
						editorOptions: {
							funcName: 'itemattrgrpcode',
							dependAttrs: function(){
								return {
									itgrp_id: MyApp.reqres.request('itgrpID'),
									iagfunc_id: MyApp.ITEMATTRGRPFUNC_ID_COUNTRY
								};
							}
						},
						isEditable: function(){
							return Boolean(!lastApply &&
										   MyApp.reqres.request('itgrpID'));
						}
					}
				},
				{
					id: 'cost',
					field: 'cost',
					name: '下代(税抜)',
					cssClass: 'txtalign-right',		// 右寄せ,
					cellType: {
						type: 'text',
						validator: 'required uint:7',
						// limit: 'uint:7',
						formatFilter: 'comma',
						isEditable: function(){
							return !lastApply;
						}
					}
				},
				{
					id: 'priceIntax',
					field: 'priceIntax',
					name: '上代(税込)',
					cssClass: 'txtalign-right',		// 右寄せ,
					width: 100,
					cellType: {
						formatFilter: 'comma',
					}
				},
				{
					id: 'price',
					field: 'price',
					name: '上代(税抜)',
					cssClass: 'txtalign-right',		// 右寄せ,
					cellType: {
						formatFilter : 'comma',
						type: 'text',
						validator: 'required int uint:7',
						// limit: 'int2',
						isEditable: function(){
						 	return !lastApply;
						}
					}
				},
				{
					id: 'orderQy',
					field: 'orderQy',
					cssClass: 'txtalign-right',		// 右寄せ,
					name: '発注数',
					cellType: {
						type: 'text',
						validator: 'required int maxlen:6 min:1',
						formatFilter: 'comma',
						// limit: 'uint:6',
						beforeValid: beforeValid
					}
				},
				{
					id: 'dlvTypeID',
					field: 'dlvTypeID',
					name: '納品区分',
					cellType: {
						type: 'cltypeselector',
						validator: 'required',
						beforeValid: beforeValid,
						editorOptions: {
							kind: amcm_type.AMCM_TYPE_DELIVERY
						}
					}
				},
				{
					id: 'quality',
					field: 'quality',
					name: '品質',
					cellType: {
						validator: 'hankaku:15',
						// limit: 'hankaku len:15',
						type: 'text',
						isEditable: function(){
							return !lastApply;
						}
					},
					headCellType: {
						formatter: function(){
							return '<div class="clgridhd-icon-help">品質<p class="txtInFieldUnit flright help" data-cl-errmsg="糸の混率を記入します。<br>例）W90/N10, ﾎﾟﾘｴｽﾃﾙ100%"><span>?</span></p></div>';
						}
					}
				},
				{
					id: 'finishDate',
					field: 'finishDate',
					name: '製品仕上日',
					cellType: {
						validator: 'required date',
						beforeValid: beforeValid,
						type: 'date'
					}
				},
				{
					id: 'dlvDate',
					field: 'dlvDate',
					name: '仕入予定日',
					cellType: {
						validator: 'required date',
						beforeValid: beforeValid,
						type: 'date'
					},
					headCellType: {
						formatter: function(){
							return '<div class="clgridhd-icon-help">仕入予定日<p class="txtInFieldUnit flright help" data-cl-errmsg="仕入予定日以降に店舗での在庫検索が可能となります。"><span>?</span></p></div>';
						}
					}
				},
				{
					id: 'saleStartDate',
					field: 'saleStartDate',
					name: '販売開始日',
					cellType: {
						validator: 'required date',
						type: 'date',
						isEditable: function(){
							return !lastApply;
						}
					}
				},
				{
					id: 'saleEndDate',
					field: 'saleEndDate',
					name: '販売終了日',
					cellType: {
						validator: 'required date',
						type: 'date',
						isEditable: function(){
							return !lastApply;
						}
					}
				}
			];
		},

		// グリッドのデータを返す
		getData: function(){
			return this.dataGrid.getData({
				filterFunc: ClGrid.getEmptyCheckFunc(this.dataGrid)
			});
		},

		onShow: function(){
			this.ui.dataGrid.html(this.dataGrid.el);

			var data = this.itemRecords.toJSON();

			if (this.canAddDel && data.length < 5){
				data = data.concat(
					_.times(5 - data.length,
							function(){return this.createEmptyRecord();}, this));
			}

			this.dataGrid.setData({
				columns: this.getColumns(),
				// rowDelToggle: true,
				// gridOptions: {
				// 	frozenColumn: 1
				// },
				data: data,
				gridOptions: {
					editable: !this.options.readOnlyMode
				}
			});
		},

		/**
		 * 税率を取得する
		 * @param vendor_id メーカーID
		 * @param iymd 取得日
		 */
		getTaxRate: function(vendor_id, iymd) {
			// 取引先別税率を取得
			var taxrt = clcom.getVendorTaxHist(vendor_id, iymd);
			if (taxrt == null) {
				// 取引先別がなければデフォルト税率を取得
				taxrt = clcom.getTaxHist(iymd);
			}
			return taxrt;
		},

		checkYear: function(pack,data){
			var isLastApply = this.isLastApply;
			var errors = {};
			//var ss = [
			//		amcm_type.AMCM_VAL_SEASON_SS,
			//		amcm_type.AMCM_VAL_SEASON_SPRING,
			//		amcm_type.AMCM_VAL_SEASON_SUMMER
			//	];
			var saleStartYear = Math.round(data.saleStartDate / 10000),
				salerStartMonthDate = Math.floor(data.saleStartDate % 10000),
				correctYear = saleStartYear;

			/*
			 * シーズンがSS(春夏・春・夏)かつ販売開始日が10/1～12/31の場合は販売開始日の年の翌年、その他は販売開始日の年。
			 * 画面で入力されている商品展開年と一致しているかをチェックする。
			 */
			correctYear = saleStartYear;
			var season = Number(pack.seasonTypeID);
			switch (season) {
			case amcm_type.AMCM_VAL_SEASON_SS:		// 春夏
			case amcm_type.AMCM_VAL_SEASON_SPRING:	// 春
			case amcm_type.AMCM_VAL_SEASON_SUMMER:	// 夏
				if (salerStartMonthDate >= 1001 && salerStartMonthDate <= 1231) {
					correctYear += 1;
				}
				break;
			case amcm_type.AMCM_VAL_SEASON_ALL:		// オールシーズン
				if (pack.subSeasonTypeID == amcm_type.AMCM_VAL_SUBSEASON_SS) {
					if (salerStartMonthDate >= 1001 && salerStartMonthDate <= 1231) {
						correctYear += 1;
					}
				}
				break;
			default:
				break;
			}

			if (correctYear !== Number(pack.year)){
				errors.saleStartDate = clutil.getclmsg('EMS0140');
			}
			// FIXME シーズン、サブシーズンのチェックが間違ってる ↑で対応
//			if (pack.seasonTypeID === amcm_type.AMCM_VAL_SEASON_ALL &&
//				_.indexOf(ss, Number(pack.subSeasonTypeID))){
//				correctYear = saleStartYear + 1;
//			}else if(_.indexOf(ss, Number(pack.seasonTypeID))){
//				correctYear = saleStartYear + 1;
//			}

			// FIXME 販売開始年と商品展開年の比較が間違っている
//			if (Number(saleStartYear) !== Number(pack.year)){
//				errors.saleStartDate = clutil.getclmsg('EMS0140');
//			}

			if (!data.emptyItem && pack.approveDate > data.finishDate){
				errors.finishDate = clutil.getclmsg('EMS0018');
			}
			if (data.finishDate > data.dlvDate){
				errors.dlvDate = clutil.getclmsg('EMS0019');
			}
			if (!isLastApply){
				// 承認後の追加発注時は仕入予定日と販売開始日のチェックは不要
				if (data.dlvDate > data.saleStartDate){
					errors.saleStartDate = clutil.getclmsg('EMS0020');
				}
			}
			if (data.saleStartDate > data.saleEndDate){
				errors.saleEndDate = clutil.getclmsg('EMS0021');
			}
			if (_.size(errors)){
				return errors;
			}
		},

		setReadonly: function(){
			this.dataGrid.setEditable(false);
		},

		isValid: function(){
			var msg,
				pack = MyApp.reqres.request('getPackViewData'),
				dataGrid = this.dataGrid;

			this.hasWarning = false;

			// グリッドのレコード
			var data = this.getData();

			dataGrid.clearCellMessage();

			// 1行もない場合はエラーとする。
			if (!data.length){
				// clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
				clutil.mediator.trigger('onTicker', '商品を1つ以上設定してください');
				dataGrid._setErrorInside(true);
				return false;
			}

			if (!dataGrid.isValid({
				tailEmptyCheckFunc: ClGrid.getEmptyCheckFunc(this.dataGrid)
			})){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return false;
			}

			var idProperty = this.dataGrid.idProperty;
			// 上代、下代チェック
			var priceCheck = _.reduce(data, function(memo, data){
				var price = parseInt(data.price, 10),
					cost = parseInt(data.cost, 10);
				if (cost > price){
					memo.push(data[idProperty]);
				}
				return memo;
			}, []);
			if (priceCheck.length){
				_.each(priceCheck, function(id){
					dataGrid.setCellMessage(id, 'price', 'warn',
											clutil.getclmsg('WMS0100'));
				});
				this.hasWarning = true;
			}

			// 後の重複チェック、商品レコードの一貫性、カラー商品レコー
			// ドの一貫性のチェックを行うためのデータを作成する
			var tempData = _.reduce(data, function(memo, data){
				var errors = {};
				var id = MyApp.reqres.request('generateItemId', data);
				var rowId = data[dataGrid.dataView.idProperty];
				var map = memo.map;
				if (!map[id]){
					map[id] = [];
				}
				map[id].push({
					id: rowId,
					makerItemCode: data.makerItemCode,
					colorName: data.color.name,
					sizeName: data.size.name
				});
				if (map[id].length > 1){
					memo.dups.push(id);
				}

				var itemMap = memo.itemMap,
					makerItemCode = data.makerItemCode;
				if (!itemMap[makerItemCode]){
					itemMap[makerItemCode] = data;
				}

				var itemColorMap = memo.itemColorMap,
					itemColorId = makerItemCode + ':' + data.color.id;
				if (!itemColorMap[itemColorId]){
					itemColorMap[itemColorId] = data;
				}

				var yearErrors = this.checkYear(pack, data);
				if (yearErrors){
					_.extend(errors ,yearErrors);
				}

				if (_.size(errors)){
					memo.errors[rowId] = errors;
				}
				return memo;
			}, {
				map: {},
				dups: [],
				itemMap: {},
				itemColorMap: {},
				errors: {}
			}, this);

			if (_.size(tempData.errors)){
				_.each(tempData.errors, function(error, rowId){
					_.each(error, function(msg, colId){
						dataGrid.setCellMessage(rowId, colId, 'error', msg);
					});
				});
				clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
				return false;
			}

			if (tempData.dups.length){
				// カラーサイズ商品の重複のエラーがあればメッセージを設
				// 定して終了する

				var template = _.template('メーカー品番:<%- it.makerItemCode %>, カラー:<%- it.colorName %>, サイズ:<%- it.sizeName %>', null, {variable: 'it'});
				_.each(tempData.dups, function(id){
					_.each(tempData.map[id], function(errInfo){
						msg = clutil.fmt(clutil.getclmsg('EGM0009'),
										 template(errInfo));
						dataGrid.setCellMessage(
							errInfo.id, 'makerItemCode', 'error', msg);
						// dataGrid.setCellMessage(rowId, 'color', 'error', msg);
						// dataGrid.setCellMessage(rowId, 'size', 'error', msg);
					});
				});
				clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
				return false;
			}

			// 商品レコードの一貫性チェック
			var checkKeys = ['itemName', 'quality', 'priceIntax', 'cost',
							 'saleStartDate', 'saleEndDate',
							 'dlvDate', 'finishDate', 'dlvTypeID'],
				checkIdObjKeys = ['brand', 'style', 'design', 'material', 'import'],
				labels = _.extend(
					_.object(
						checkKeys,
						['商品名', '品質', '上代', '下代',
						 '販売開始日', '販売終了日',
						 '仕入予定日',  '製品仕上日', '納品区分']),
					_.object(
						checkIdObjKeys,
						['属性ブランド', 'スタイル', '柄', '素材', '生産国']));
			var consistencyErrors = _.reduce(data, function(memo, data){
				var other = tempData.itemMap[data.makerItemCode];
				if (data === other) return memo;

				var errorKeys = {};
				_.each(checkKeys, function(key){
					if (String(data[key]) !== String(other[key])){
						errorKeys[key] = 'EMS0022';
					}
				});

				_.each(checkIdObjKeys, function(key){
					var a = data[key], b = other[key];
					if (Number(a.id) !== Number(b.id)) {
						errorKeys[key] = 'EMS0022';
					}
				});

				if (!_.isEmpty(errorKeys)){
					var rowIds = {}, rowId;
					rowId = data[dataGrid.dataView.idProperty];
					rowIds[rowId] = rowId;
					rowId = other[dataGrid.dataView.idProperty];
					rowIds[rowId] = rowId;

					if (!memo[data.makerItemCode])
						memo[data.makerItemCode] = {rows: {}, cols: {}};
					_.extend(memo[data.makerItemCode].cols, errorKeys);
					_.extend(memo[data.makerItemCode].rows, rowIds);
				}

				return memo;
			}, {});

			if (_.size(consistencyErrors)){
				// 商品レコードの一貫性エラー=>エラーを表示
				_.each(consistencyErrors, function(err){
					_.each(err.rows, function(rowId){
						_.each(err.cols, function(msg, colId){
							dataGrid.setCellMessage(
								rowId, colId, 'error',
								clutil.fmt(clutil.getclmsg(msg), labels[colId]));
						});
					});
				});
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return false;
			}


			// カラー商品レコードの一貫性チェック
			consistencyErrors = _.reduce(data, function(memo, data){
				var id = data.makerItemCode + ':' + data.color.id,
					other = tempData.itemColorMap[id];
				if (data !== other && data.makerColor !== other.makerColor) {
					if (!memo[id])
						memo[id] = {rows: {}, cols: {'colorName': 'colorName'}};

					var rowIds = {}, rowId;
					rowId = data[dataGrid.dataView.idProperty];
					rowIds[rowId] = rowId;
					rowId = other[dataGrid.dataView.idProperty];
					rowIds[rowId] = rowId;
					_.extend(memo[id].rows, rowIds);
				}

				return memo;
			}, {});

			if (_.size(consistencyErrors)){
				msg = clutil.getclmsg('EMS0022');
				_.each(consistencyErrors, function(err){
					_.each(err.rows, function(rowId){
						_.each(err.cols, function(colId){
							dataGrid.setCellMessage(rowId, colId, 'error', msg);
						});
					});
				});
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return false;
			}

			return true;
		}
	});

	_.extend(MyApp, {
		ItemListView: ItemListView
	});
}(MyApp));
