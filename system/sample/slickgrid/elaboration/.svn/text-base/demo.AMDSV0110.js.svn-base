/* global dummyData: false */
var MyApp = {};
MyApp.data = dummyData;
// MyApp.data.AMDSV0110GetRsp.storeRecords = _.first(MyApp.data.AMDSV0110GetRsp.storeRecords, 10);

Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate){
	return _.template(rawTemplate, null, {variable: 'it'});
};

var myHdrFormatter = function(value, options){
	console.log(options);
	var label = '&nbsp;';
	if (options.cell === 3){
		label = 'サイズ';
	}else if(options.grid.getColumns().length - 1 === options.cell){
		label = '<div class="viewAll">全て表示</div>';
	}
	var template = Marionette.TemplateCache.get('#HdrCell');
	
	return template({
		label: label,
		value: value
	});
};
myHdrFormatter.initialize = function(grid, dataView, vent){
	grid.onClick.subscribe(function(e, args){
		var $target = $(e.target);
		var ev;
		if($target.is(".deleteRow .viewAll")){
			ev = ClGrid.Formatters.buildEvent(args, grid, dataView);
			vent.trigger("formatter:hideSize:click", ev);
		} else if ($target.is(".viewAll")){
			ev = ClGrid.Formatters.buildEvent(args, grid, dataView);
			vent.trigger("formatter:showAll:click", ev);
		}
	});
};

ClGrid.Formatters.myHdrFormatter = myHdrFormatter;

var SizeEditor = Marionette.ItemView.extend({
	template: '#SizeEditor',

	events: {
		click: function(e){
			e.stopPropagation();
		}
	},
	
	constructor: function(args, editorOptions, cellType){
		this.args = args;
		this.cellType = cellType;
		Marionette.ItemView.prototype.constructor.call(this, editorOptions);
	},

	initialize: function(){
		this.render();
		this.$el.appendTo(this.args.container);
		this.focus();
	},

	focus: function(){
		var $el = this.$('[type=text]');
		$el.focus();
		_.defer(function(){
			$el.select();
		});
	},
	
	serializeData: function(){
		return _.clone(this.args.item[this.args.column.field]);
	},
	
	templateHelpers: function(){
		return {
			editMode: true
		};
	},

	loadValue: function(item){
		this.$('input').val(item[this.args.column.field].distQy);
	},

	applyValue: function(item, state){
		item[this.args.column.field].distQy = parseInt(state, 10) || 0;
	},

	serializeValue: function(){
		return this.$('input').val();
	},

	isValueChanged: function(){
		return true;
	},

	destroy: function(){
		this.remove();
	},
	
	validate: function(){
		this.trigger('validate', this.serializeValue());
		
		return {
			valid: true,
			msg: null
		};
	}
});

var sizeFormatter = function(value, options){
	// jshint unused: false
	var template = Marionette.TemplateCache.get('#SizeEditor'),
		data = options.dataContext[options.columnDef.id] || {};
	return template(data);
};

var totalColFormatter = function(value, options){
	// jshint unused: false
	var template = Marionette.TemplateCache.get('#TotalColFormatter'),
		data = options.dataContext[options.columnDef.id] || {};
	return template(data);
};

var saleStockDistFormatter = function(data){
	// jshint unused: false
	var template = Marionette.TemplateCache.get('#SaleStockDistFormatter');
	return template(data);
};

var StoreFilterView = Marionette.ItemView.extend({
	template: '#StoreFilterView',

	className: 'clgrid-editor-select',
	
	ui: {
		parent: '.parentSelect',
		child: '.childSelect'
	},
	
	onRender: function(){
		var parentItems = _.where(MyApp.data.AMDSV0110GetRsp.storeInfoRecords, {
			parentTypeID: 0
		});
		this.parent = new ClGrid.Editors.ClSelector.createSelector({
			labelTemplate: function(item){return item.typeName},
			idAttribute: 'typeID',
			items: parentItems
		});
		
		this.child = new ClGrid.Editors.ClSelector.createSelector({
			labelTemplate: function(item){return item.typeName},
			idAttribute: 'typeID'
		});
		
		this.ui.parent.html(this.parent.el);
		this.ui.child.html(this.child.el);
		
		this.listenTo(this.child, 'change:ui', this.triggerChange);
		this.listenTo(this.parent, 'change:ui', this.updateChild);
	},
	
	getChildItems: function(){
		if (!this.parentID) return;
		
		var childItems = _.where(MyApp.data.AMDSV0110GetRsp.storeInfoRecords, {
			parentTypeID: this.parentID
		});
		return childItems;
	},

	triggerChange: function(){
		this.trigger('change');
		console.log('XXXXXXXXXXXXXXX');
	},
	
	updateChild: function(trigger){
		var items, parentID = parseInt(this.parent.getValue(), 10);
		
		if (parentID){
			items = _.where(MyApp.data.AMDSV0110GetRsp.storeInfoRecords, {
				parentTypeID: parentID
			});
		}
		this.child.setItems(items);
		if (trigger !== false){
			this.triggerChange();
		}
	},
	
	templateHelpers: function(){
		return {
			editMode: true
		};
	}
});

var StoreFilterEditor = function(args, editorOptions){
	this.args = args;
	this.options = editorOptions;
	var view = this.view = new StoreFilterView();
	view.render();
	view.$el.appendTo(args.container);
	ClGrid.fixSelector(view.$el, args.grid);
	this.listenTo(this.view, 'change', function(){
		this.args.commitChanges();
	});
	if (args.editorContext.type === 'click'){
		if ($(args.editorContext.target).is('.parentSelect *')){
			this.view.parent.open();
		}else{
			this.view.child.open();
		}
	}
};

_.extend(StoreFilterEditor.prototype, Backbone.Events, {
	////////////////////////////////////////////////////////////////
	// Editor Interfaces
	loadValue: function(item){
		this.view.parent.setValue(item.parentID);
		this.view.updateChild(false);
		this.view.child.setValue(item.childID);
	},

	applyValue: function(item){
		item.parentID = parseInt(this.view.parent.getValue(),10)||0;
		item.parent = this.view.parent.getAttrs();
		item.childID = parseInt(this.view.child.getValue(), 10) || 0;
		item.child = this.view.child.getAttrs();
	},

	serializeValue: function(){},

	isValueChanged: function(){
		return true;
	},

	destroy: function(){
		this.stopListening();
		this.view.remove();
	},
	
	validate: function(){
		return {
			valid: true,
			msg: null
		};
	}
});

var View = Backbone.View.extend({
	el: 'body',

	events: {
		'click #save': function(){
			window.alert('保存しました\n\n' + JSON.stringify(
				this.dataGrid.getData()), null, 4);
		},
		'click #valid': function(){
			var errors = this.dataGrid.validate();
			var isValid = this.dataGrid.isValid();
			if (!isValid){
				window.alert('NGです。\n\n' + JSON.stringify(errors, null, 4));
			}else{
				window.alert('OKです。\n\n');
			}
		},
		'change #ca_bodyTypeID': function(){
			var bodyTypeID = parseInt(this.$('#ca_bodyTypeID').val(), 10);
			this.dataGrid.setColumns(this.getColumns(bodyTypeID));
		},
		'click #addColumn': '_addColumn'
	},

	gridEvents: {
		'footer:addNewRow': function(gridView){
			// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
			var newItem = {};
			gridView.addNewItem(newItem);
		},
		'cell:change': function(args){
			var item = args.item;
			if (args.cell === 1 && args.row === 0){
				var fieldName = null;
				switch (item.parentID) {
				case 1:
					fieldName = 'floorArea';
					break;
				case 2:
					fieldName = 'openYear';
					break;
				case 3:
					fieldName = 'displayNum';
					break;
				case 4:
					fieldName = 'annualSales';
					break;
				case 5:
					fieldName = 'newStoreType';
					break;
				default:
				}
				this.storeFilterData.fieldName = fieldName;
				this.storeFilterData.parentID = item.parentID;
				this.storeFilterData.childID = item.childID;
				this.storeFilterData.child = item.child;
				this.onStoreFilterChange();
			}
		},
		'formatter:hideSize:click': function(e){
			console.log(e);
			this.removeSizeList[e.column.sizeID] = true;
			this.dataGrid.setColumns(this.getColumns());
		},
		'formatter:showAll:click': function(e){
			console.log(e);
			this.removeSizeList = {};
			this.dataGrid.setColumns(this.getColumns());
		}
	},

	storeFilter: function(item, args){
		var value = item[args.fieldName],
			typeName = args.child && args.child.typeName;
		return args.fieldName == null || !args.childID ||
			!item.body || value == typeName;
	},
	
	onStoreFilterChange: function(){
		this.dataGrid.dataView.setBodyFilterArgs({
			fieldName: this.storeFilterData.fieldName,
			childID: this.storeFilterData.childID,
			child: this.storeFilterData.child
		});
		this.dataGrid.dataView.setBodyFilter(this.storeFilter);
		this.dataGrid.grid.invalidate();
	},
	
	initialize: function(){
		_.bindAll(this, 'getMetadata');

		this.removeSizeList = {};
		
		this.storeFilterData = {
			parentID: 0,
			childID: 0
		};
		this.dataGrid = new ClGrid.ClAppGridView({
			el: '#ca_datagrid',
			delRowBtn: false,		// 行削除ボタンを使用するフラグ。
			footerNewRowBtn: false	// フッター部の新規行追加ボタンを使用するフラグ。
		});
		this.dataGrid.getMetadata = this.getMetadata;
		
		this.buildColumns();
		
		this.listenTo(this.dataGrid, this.gridEvents);
	},

	getMetadata: function(rowIndex){
		if (rowIndex >= 0 && rowIndex < 4) {
			return {
				cssClasses: 'reference'
			};
		}
	},
	
	getUpdReq: function(){
		var data = this.dataGrid.getData();
		return data;
	},
	
	buildColumns: function(){
		var view = this;
		var columns = [
			{
				id : 'label',
				name : '店舗名',
				field : 'label'
			},
			{
				id: 'saleStockDist',
				name: '',
				field: 'saleStockDist',
				width: 140,
				headCellType: {
					editorType: StoreFilterEditor,
					formatter: function(value, options){
						var dc = options.dataContext,
							parentID = dc.parentID,
							childID = dc.childID,
							getRsp = MyApp.data.AMDSV0110GetRsp,
							parent = _.where(getRsp.storeInfoRecords, {
								typeID: parentID
							})[0] || {},
							child = _.where(getRsp.storeInfoRecords, {
								typeID: childID
							})[0] || {},
							template = Marionette.TemplateCache.get('#StoreFilterView');
						return template({
							parent: ClGrid.Formatters.selectpicker(
								parent.typeName||''),
							child: ClGrid.Formatters.selectpicker(
								child.typeName||'')
						});
					}
				},
				cellType: {
					formatter: function(value, options) {
						var parentID = view.storeFilterData.parentID;
						var item = options.dataContext;
						
						var col1 = '', col2 = '';
						if (item.distAbleRow){
						}else if(item.totalRow){
						}else {
							switch (parentID) {
							case 1:
								col2 = item.floorArea;
								break;
							case 2:
								col2 = item.openYear;
								break;
							case 3:
								col2 = item.displayNum;
								break;
							case 4:
								col2 = item.annualSales;
								break;
							case 5:
								col2 = item.newStoreType;
								break;
							default:
							}
						}
						
						return saleStockDistFormatter({
							col1: col1, 
							col2: col2
						});						
					}
				}
			},
			{id: 'total', name : '合計', field : 'total', cellType: {
				formatter: function(value, options){
					if (options.dataContext.distAbleRow){
						return saleStockDistFormatter({
							col1: '',
							col2: options.dataContext.total
						});
					}else{
						return totalColFormatter(value, options);
					}
				}
			}}
		];
		var numSize = MyApp.data.AMDSV0110GetRsp.sizeRecords.length;
		_.each(MyApp.data.AMDSV0110GetRsp.sizeRecords, function(sizeRec, index){
			var id = sizeRec.sizeID + ':' + sizeRec.bodyTypeID;
			columns.push(_.extend({}, sizeRec, {
				id: id,
				field: id,
				sizeID: sizeRec.sizeID,
				firstSizeCol: index === 0,
				lastSizeCol: index === numSize - 1,
				name: sizeRec.sizeName,
				sizeColumn: true,
				width: 84,
				bodyTypeID: sizeRec.bodyTypeID,
				headCellType: {
					formatter: 'myHdrFormatter'
				},
				
				cellType: {
					editorType: SizeEditor,
					isEditable: function(item){
						return !item.distAbleRow && !item.totalRow;
					},
					formatter: function(value, options){
						if (options.dataContext.distAbleRow) {
							return saleStockDistFormatter({
								col2: options.dataContext.total
							});
						}else if (options.dataContext.totalRow) {
							return totalColFormatter(value, options);
						} else {
							return sizeFormatter(value, options);
						}
					}
				}
			}));
		});
		this._columns = columns;
	},

	buildData: function(){
		var getRsp = MyApp.data.AMDSV0110GetRsp,
			storeRecords = getRsp.storeRecords,
			sizeRecords = getRsp.sizeRecords,
			cellRecords = getRsp.cellRecords,
			id2CellIdx = {},
			existData,
			newData,
			urbanData,
			totalData,
			// 店舗レコード
			body;

		_.each(cellRecords, function(cell, index){
			var id = cell.storeID + ':' +
					cell.sizeID + ':' +
					cell.bodyTypeID;
			id2CellIdx[id] = index;
		});

		existData = _.reduce(sizeRecords, function(data, sizeRec){
			var colId = sizeRec.sizeID + ':' + sizeRec.bodyTypeID,
				cell = _.where(getRsp.existCellRecords, {
					sizeID: sizeRec.sizeID,
					bodyTypeID: sizeRec.bodyTypeID
				})[0] || {distAbleQy: 0};
			data[colId] = cell;
			data.total += cell.distAbleQy;
			return data;
		}, {distAbleRow: true, label: 'あ', total: 0});
		
		newData = _.reduce(sizeRecords, function(data, sizeRec){
			var colId = sizeRec.sizeID + ':' + sizeRec.bodyTypeID,
				cell = _.where(getRsp.newCellRecords, {
					sizeID: sizeRec.sizeID,
					bodyTypeID: sizeRec.bodyTypeID
				})[0] || {distAbleQy: 0};
			data[colId] = cell;
			data.total += cell.distAbleQy;
			return data;
		}, {distAbleRow: true, label: 'い', total: 0});

		urbanData = _.reduce(sizeRecords, function(data, sizeRec){
			var colId = sizeRec.sizeID + ':' + sizeRec.bodyTypeID,
				cell = _.where(getRsp.urbanCellRecords, {
					sizeID: sizeRec.sizeID,
					bodyTypeID: sizeRec.bodyTypeID
				})[0] || {distAbleQy: 0};
			data[colId] = cell;
			data.total += cell.distAbleQy;
			return data;
		}, {distAbleRow: true, label: 'う', total: 0});
		
		body = _.map(storeRecords, function(store){
			var rec = {},
				storeID = store.storeID,
				// 行ごとの合計
				totalSaleQy = 0,
				totalStockQy = 0,
				totalDistQy = 0;
			
			_.each(sizeRecords, function(sizeRec){
				var colId = sizeRec.sizeID + ':' + sizeRec.bodyTypeID,
					id = store.storeID + ':' + colId,
					cellIdx = id2CellIdx[id],
					cell = cellRecords[cellIdx] || {
						storeID: storeID,
						bodyTypeID: sizeRec.bodyTypeID,
						sizeID: sizeRec.sizeID,
						saleQy: 0,
						stockQy: 0,
						distQy: 0,
						distAbleQy: 0
					};

				totalSaleQy += cell.saleQy;
				totalStockQy += cell.stockQy;
				totalDistQy += cell.distQy;
				
				rec[colId] = cell;
			});

			_.extend(rec, store, {
				body: true,
				label: store.storeName,
				total: {
					saleQy: totalSaleQy,
					stockQy: totalStockQy,
					distQy: totalDistQy
				}	
			});
			
			return rec;
		});

		// 合計行
		totalData = {totalRow: true, label: '合計'};
		_.each(sizeRecords, function(sizeRec){
			var colId = sizeRec.sizeID + ':' + sizeRec.bodyTypeID;
			totalData[colId] = {
				saleQy: 0,
				stockQy: 0,
				distQy: 0
			};
		});
		totalData.total = {
			saleQy: 0,
			stockQy: 0,
			distQy: 0
		};
		_.each(body, function(rec){
			_.each(sizeRecords, function(sizeRec){
				var colId = sizeRec.sizeID + ':' + sizeRec.bodyTypeID;
				totalData[colId].saleQy += rec[colId].saleQy;
				totalData[colId].stockQy += rec[colId].stockQy;
				totalData[colId].distQy += rec[colId].distQy;
			});
			totalData.total.saleQy += rec.total.saleQy;
			totalData.total.stockQy += rec.total.stockQy;
			totalData.total.distQy += rec.total.distQy;
		});

		return [
			existData,
			newData,
			urbanData,
			totalData
		].concat(body);
	},
	
	getColumns: function(bodyTypeID){
		var removeSizeList = this.removeSizeList || {};
		var columns = _.filter(this._columns, function(column){
			return !column.sizeColumn || 
				(!bodyTypeID || column.bodyTypeID === bodyTypeID) &&
				!_.has(removeSizeList, column.sizeID);
		});
		
		return columns;
	},

	renderGrid: function(){
		this.dataGrid.render().setData({
			gridOptions: {
				rowHeight: 68,
				autoHeight: false,
				frozenColumn: 2,
				frozenRow: 5
			},
			columns: this.getColumns(),
			data: this.buildData(),
			rowDelToggle: true
		});
	},

	onDomRefresh: function(){
		this.dataGrid.grid.resizeCanvas();
	}
}, {
	startApp: function (){
		var view = this.view = new View();
		view.renderGrid();
	}
});

$(function(){
	clutil._XXXDBGGetIniPermChk = false;
	clutil.getIniJSON().done(_.bind(View.startApp, View));
});

