/* global MyApp: true */

(function(MyApp){
	var comma = function(value){
		if(_.isNaN(value)){
			return '-';
		}else{
			return clutil.comma(value) || '0';
		}
	};

	var DistrView = Marionette.ItemView.extend({
		template: '#DistrView',

		ui: {
			dataGrid: '.dataGrid',
			goBack: '.goBackToItem'
		},

		events: {
			'click @ui.goBack': function(){
				this.dataGrid.stopEditing();
				MyApp.trigger('goBackToItem');
			}
		},

		gridEvents: {
			'cell:change': function(){
				this.updateTotal();
			}
		},

		appEvents: {
			goBackToItemClick: function(){
				this.dataGrid.stopEditing();
				MyApp.trigger('goBackToItem');
			}
		},

		initialize: function(){
			_.bindAll(this, 'getMetadata');
			// グリッドの初期化
			this.initDataGrid();
			this.listenTo(MyApp, this.appEvents);
			this.itemRecords = this.options.itemRecords;
		},

		initDataGrid: function(){
			this.dataGrid = new ClGrid.ClAppGridView({
				attributes: {
					style: 'height: 800px;'
				},
				idProperty: 'id',
				graph: this.getGraph(),
				errorInside: true
			});
			this.dataGrid.getMetadata = this.getMetadata;
			this.listenTo(this.dataGrid, this.gridEvents);
			this.dataGrid.render();
		},

		getGraph: function(){
			if (!this.graph) {
				this.graph = new clutil.Relation.DependGraph();
			}
			return this.graph;
		},

		formatters: {
			1: function(value){return value.name;},
			2: function(value){return value.name;},
			3: function(value){return clutil.dateFormat(value, 'yyyy/mm/dd');},
			4: function(value){return clutil.gettypename(amcm_type.AMCM_TYPE_DELIVERY, value, true);},
			5: function(value){return comma(value);},
			6: function(value){return comma(value);},
			7: function(value){return comma(value);}
		},

		getMetadata: function(rowIndex){
			var gridColumns = this.dataGrid.grid.getColumns();
			var columns = {};
			if (rowIndex > 4) {
				_.each(gridColumns, function(column, i){
					if (i > 0) {
						columns[column.id] = {
							cssClasses: 'txtalign-right'
						};
					}
				});
			}
			return {
				columns: columns
			};
		},

		getColumns: function(){
			var model = MyApp.reqres.request("getModel"),
				itemRecords = model.itemRecords,
				distrRecords = model.distrRecords;

			var view = this;
			var columns = [
				{
					id: 'colHdr',
					field: 'colHdr',
					name: '',
					width: 120,
					cellType: {
						formatter: function(value, options){
							var data = options.dataContext;
							if (options.bodyRow > 7){
								return _.escape(data.storeCode) + ':' + _.escape(data.storeName);
							}else{
								return value;
							}
						}
					}
				}
			];
			this.itemRecords.each(function(item, i){
				var id = item.id;

				columns.push({
					id: id,
					field: id,
					name: String(i+1),
					width: 150,
					// cssClass: 'txtalign-right',		// 右寄せ,
					cellType: {
						type: 'text',
						beforeValid: function(item){
							// falseを返却でチェックしない
							return item.body === true;
						},
						validator: [function(value){
							var id = item.id + ':' + this.item.storeID;
							var distr = distrRecords.get(id);
							var qy = distr && distr.get('distrQy');
							return clutil.Validators.checkAll({
								validator: 'uint maxlen:3',
								value: qy
							});
						}],
						// limit: 'uint:3',
						editorOptions: {
							loadValueFromItem: function(item, args){
								var id = args.column.id + ':' +
										item.storeID,
									distr = distrRecords.get(id);
								return distr ? distr.get('distrQy') : '0';
							},
							applyValueToItem: function(item, state, args){
								var model = itemRecords.get(args.column.id);
								distrRecords.set({
									csitemID: model.get('csitemID'),
									storeID: item.storeID,
									colorID: model.get('color').id,
									colorCode: model.get('color').code,
									sizeID: model.get('size').id,
									sizeCode: model.get('size').code,
									makerItemCode: model.get('makerItemCode'),
									distrQy: state
								}, {
									add: true,
									remove: false,
									merge: true
								});
							}
						},
						formatter: function(value, options){
							var formatter = view.formatters[options.bodyRow],
								data = options.dataContext,
								text = value;

							if (formatter){
								text = formatter(value, options);
							}else if(data.body){
								var id = options.columnDef.id + ':' +
										data.storeID,
									distr = distrRecords.get(id);
								if (distr){
									text = clutil.comma(distr.get('distrQy'));
								}else{
									text = '0';
								}
							}

							return _.escape(text);
						},
						isEditable: function(item){
							return !!item.body;
						}
					}
				});
			});
			return columns;
		},

		createGridData: function(columns){
			var model = MyApp.reqres.request("getModel"),
				itemRecords = model.itemRecords;

			var data = [];
			var createRow = function(label, attrName, rowId){
				var row = _.reduce(columns, function(row, item){
					var model = itemRecords.get(item.id);
					if (!model) return row;
					row[item.id] = model.get(attrName);
					return row;
				}, {colHdr: label});
				if (rowId) row.id = rowId;
				return row;
			};

			data.push(createRow('メーカー品番', 'makerItemCode'));
			data.push(createRow('カラー', 'color'));
			data.push(createRow('サイズ', 'size'));
			data.push(createRow('仕入予定日', 'dlvDate'));
			data.push(createRow('納品区分', 'dlvTypeID', 'dlvTypeId'));
			data.push(createRow('発注数', 'orderQy'));
			data.push({id: 'distrSumQy', colHdr: '振分数'});
			data.push({id: 'diffQy', colHdr: '残'});

			var body = _.map(model.storeList, function(store){
				return {
					body: true,
					storeID: store.storeID,
					storeName: store.storeName,
					storeCode: store.storeCode
				};
			});

			return data.concat(body);
		},

		// 振分数と残の更新を行う
		updateTotal: function(){
			var dataView = this.dataGrid.grid.getData(),
				sumItem = dataView.getBodyItemById('distrSumQy'),
				diffItem = dataView.getBodyItemById('diffQy'),
				distrSumQy = this.calcDistrSumQy(),
				diffQy = this.calcDiffQy(distrSumQy);

			// 振分数の更新
			_.extend(sumItem, distrSumQy);
			dataView.updateItem('distrSumQy', sumItem);
			// 残の更新
			_.extend(diffItem, diffQy);
			dataView.updateItem('diffQy', diffItem);

			// 残チェック
			this.itemRecords.each(function(model){
				this.dataGrid.clearCellMessage('distrSumQy', model.id);
			}, this);
			_.each(MyApp.reqres.request('validDistrRecords'), function(err){
				this.dataGrid.setCellMessage('distrSumQy', err.id, 'error', err.msg);
				console.log(err.msg);
			}, this);
		},

		calcDiffQy: function(distrSumQy){
			var model = MyApp.reqres.request("getModel"),
				itemRecords = model.itemRecords;

			var diff = {};
			itemRecords.each(function(model){
				var orderQy = model.get('orderQy'),
					sumQy = distrSumQy[model.id];
				diff[model.id] = Number(orderQy) - Number(sumQy ? sumQy : 0);
			});
			return diff;
		},

		calcDistrSumQy: function(){
			return MyApp.reqres.request('calcDistrSumQy');
		},

		onShow: function(){
			this.ui.dataGrid.html(this.dataGrid.el);
			var columns = this.getColumns();
			this.dataGrid.setData({
				columns: columns,
				data: this.createGridData(columns),
				gridOptions: {
					frozenRow: 9,
					editable: !!this.options.editable,
					autoHeight: false
				}
			});
			// 振分数、残の更新を行う
			this.updateTotal();
		},

		isValid: function(){
			var msg, hasError = false,
				dataGrid = this.dataGrid;

			if (!dataGrid.isValid()){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return false;
			}

			// 残が0であることを確認
			_.each(MyApp.reqres.request('validDistrRecords'), function(err){
				dataGrid.setCellMessage('distrSumQy', err.id, 'error', err.msg);
				console.log(err.msg);
				hasError = true;
			});
			if (hasError){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return false;
			}

			return true;
		}
	});

	MyApp.DistrView = DistrView;
}(MyApp));
