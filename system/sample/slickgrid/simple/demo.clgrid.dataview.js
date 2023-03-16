var view, grid, dataView, graph;

var vent = new clutil.EventAggregator();

var View = Backbone.View.extend({
	el: "body"
});

var checkboxSelector = new Slick.CheckboxSelectColumn({
	cssClass: "slick-cell-checkboxsel"
});

var columns = [
	{
		id: 'checked',
		name: 'x',
		field: 'checked',
		cellType: {
			type: 'checkbox'
		},
		headCellType: {
			type: 'checkbox'
		}
	},
	{
		id: "rank",
		name: "ランク",
		field: "rank",
		cellType: {
			type: "selector",
			editorOptions: function(item, dataView){
				// 行インデックス
				var row = dataView.getBodyRowById(item[dataView.idProperty]);
				return {
					items: [
						{id: 1, label: "良い"},
						{id: 2, label: "悪い"}
					]
				};
			},
			formatter: function(item){
				return item ? item.label : '';
			}
		}
	},
	{
		id: "slipID",
		name: "伝票区分",
		field: "slipID",
		cellType: {
			type: "cltypeselector",
			editorOptions: {
				kind: amcm_type.AMCM_TYPE_SLIP
			}
		}
	},
	{
		id: "date",
		name: "日付け",
		field: "date",
		width: 120,
		cellType: {
			type: "date"
		}
	},
	{
		id: "price",
		name: "価格",
		field: "price",
		cellType: {
			type: "text",
			validator: "decimal min:0, max:1000",
			limit: "number:,2",
			formatFilter: "comma"
		},
		headCellType: function(args){
			// 1行目は編集可能に
			if (args.row === 1){
				return {
					type: "text"
				};
			}
		}

	},
	{
		id: "count",
		name: " 数量",
		field: "count",
		cellType: {
			type: "text",
			align: "right",
			validator: "required int min:0",
			limit: "number:3,0",
			formatFilter: "comma"
		}
	},
	{
		id: "orgfuncID",
		name: "組織体系",
		field: "orgfuncID",
		cellType: {
			type: "clajaxselector",
			editorOptions: {
				funcName: "orgfunc"
			}
		},
		width: 180
	},
	{
		id: "orglevelID",
		name: "組織階層",
		field: "orglevelID",
		cellType:{
			type: "clajaxselector",
			editorOptions: {
				funcName: "orglevel",
				dependAttrs: function(item){
					return {
						orgfunc_id: item.orgfuncID.id
					};
				}
			},
			// エディタ作成前に呼ばれる. falseをリターンでエディタの作成を行わない
			isEditable: function(item, row, column, dataView){
				if (!item.orgfuncID.id){
					return false;
				}
			}
		},
		width: 180
	},
	{
		id: "orgID",
		name: "組織コード",
		field: "orgID",
		cellType:{
			type: "clajaxac",
			editorOptions: {
				funcName: "orgcode",
				dependAttrs: function(item){
					return {
						orgfunc_id: item.orgfuncID.id,
						orglevel_id: item.orglevelID.id
					};
				},
				isEditable: function(item, row, column, dataView){
					if (!item.orgfuncID.id || !item.orglevelID.id){
						return false;
					}
				}
			}
		},
		width: 120
	},
	{
		id: "total",
		name: " 合計",
		field: "total",
		cellType: {
			formatFilter: 'comma'
		}
	}
];

var options = {
	editorFactory: new ClGrid.EditorFactory(),
	formatterFactory: new ClGrid.FormatterFactory(),

	editable: true,
	// DnDによる列の入れ替えを無効にする
	enableColumnReorder: false	,
	// 縦スクロールバーがつかないようにした
	autoHeight: true,
	// trueのとき、空の行を最後に追加して、それをクリックすると新しい行が追加される。
	// onAddNewRowを購読して値を保存するようにしなくてはならないらしい。
	enableAddRow: true,
	// 行の高さ
	rowHeight: 40
};

var headData = _(2).chain()
		.range()
		.map(function(i){
			return {
				id: _.uniqueId('id'),
				checked: '',
				rank: 'ランク',
				date: "開始日",
				slipID: '伝票区分',
				price: '価格',
				count: '数量',
				orgfuncID: '組織体系',
				orglevelID: '組織階層',
				orgID: '組織コード',
				total: '合計'
			};
		}).value();

var data = _(10).chain()
		.range()
		.map(function(i){
			return {
				id: _.uniqueId('id'),
				checked: i % 2 === 0,
				date: clutil.addDate(20140401, i),
				slipID: 10,
				price: 100 + 50*i,
				count: 0,
				orgfuncID: {id: 1, code: "001", name: "* 基本組織"},
				orglevelID: {id: 6, code: "0006", name: "* 店舗・部"},
				orgID: {id:0011, code: '0011', name: '諏訪赤沼店'},
				total: 0
			};
		}).value();

$(function () {
	view = new View();
	clutil.getIniJSON();

    graph = new clutil.Relation.DependGraph()
		.add({
			id: "price"
		})
		.add({
			id: "count"
		})
		.add({
			id: "total",
			depends: ["price", "count"],
			onDependChange: function(e){
				var model = e.model,
					price = model.get("price"),
					count = model.get('count');
				model.set('total', price * count);
			}
		})
		.add({
			id: "orgfuncID.id"
		})
		.add({
			id: "orglevelID.id",
			depends: ["orgfuncID.id"],
			onDependChange: function(e){
				var flattend = e.model.toJSON(),
					attrs = clutil.nested.unflatten(flattend);
				attrs.orglevelID = {id: 0, code: '', name: ''};
				e.model.set(clutil.nested.flatten(attrs));
			}
		})
		.add({
			id: 'orgID.id',
			depends: ["orgfuncID.id", "orglevelID.id"],
			onDependChange: function(e){
				var flattend = e.model.toJSON(),
					attrs = clutil.nested.unflatten(flattend);
				attrs.orgID = {id: 0, code: '', name: ''};
				e.model.set(clutil.nested.flatten(attrs));
			}
		})
		.on('all', function(name){
			console.log('graph ev:', name);
		});
	dataView = new ClGrid.DataView();

	dataView.on({
		"grid:validation:error": function(args){
			var grid = args.grid;
			var hash = grid.getCellCssStyles("validation:error")||{};
			grid.removeCellCssStyles("validation:error");
			if (!hash[args.row]){
				hash[args.row] = {};
			}
			hash[args.row][args.column.id] = "cl_error_field";
			grid.setCellCssStyles("validation:error", hash);
		},
		"grid:validation:clear": function(args){
			var grid = args.grid;
			var hash = grid.getCellCssStyles("validation:error")||{};
			grid.removeCellCssStyles("validation:error");
			if (!hash[args.row]){
				return;
			}
			delete hash[args.row][args.column.id];
			grid.setCellCssStyles("validation:error", hash);
		}
	});

	grid = new Slick.Grid("#myGrid", dataView, columns, options);

	ClGrid.GridEvHandler.start({
		cid: 1,
		$el: $('#myGrid'),
		grid: grid
	});
	// selectionmodelの設定なしだとcheckboxselectorをつかったときにエラーがでる
	grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	grid.registerPlugin(checkboxSelector);

	options.formatterFactory.start(grid, dataView, vent);

	vent.on("formatter:checkbox:change", function(e){
		var dataView = e.dataView;
		if (e.column.field === "checked" &&
			dataView.isHeadRow(e.row)){
			dataView.beginUpdate();
			_.each(dataView.getBodyItems(), function(item){
				item.checked = e.item.checked;
				dataView.updateItem(item);
			});
			dataView.endUpdate();
		}
	});

	// Make the grid respond to DataView change events.
	dataView.on('row:count:changed', function(args){
		console.log('row:count:changed', dataView.getLength(), args);
		grid.updateRowCount();
		grid.render();
	});

	dataView.on('rows:changed', function(args){
		console.log('rows:changed', dataView.getLength(), args);
		grid.invalidateRows(args.rows);
		grid.render();
	});

	// 新規行を追加するためにonAddNewRowを購読
	grid.onAddNewRow.subscribe(function(e, args) {
		console.log('onAddNewRow', args);
		var item = args.item;
		item.id = _.uniqueId('id');
		grid.invalidateRow(data.length);
		dataView.addBodyItem(item);
	});

	// 項目連携
	dataView.on("grid:before:edit", function(item){
		var flattened = clutil.nested.flatten(item);
		graph.clear();
		graph.set(flattened);
		graph.sync({silent: true});
	});

	grid.onCellChange.subscribe(function(e, args){
		console.log(e, args);

		var flattened = clutil.nested.flatten(args.item);
		graph.clear();
		graph.set(flattened);
		graph.sync()
			.done(function(){
				var attrs = graph.model.toJSON();
				var item = clutil.nested.unflatten(attrs);
				console.log("sync", item);
				dataView.updateBodyItem(item[dataView.idProperty], item);
			});
	});

	dataView.beginUpdate();
	dataView.setHeadItems(headData);
	dataView.setBodyItems(data);
	dataView.endUpdate();

	////////////////////////////////////////////////////////////////
	// ボディ部のフィルタ処理
	// 価格を最大、最小で絞りこめるようにする
	var myFilter = function(item, args){
		if (item.price < args.priceMin) return false;
		if (item.price > args.priceMax) return false;
		return true;
	};

	// 入力情報からフィルタ引数の作成
	var getFilterArgsFromView = function(){
		var priceMin = parseInt($('#priceMin').val(), 10);
		var priceMax = parseInt($('#priceMax').val(), 10);
		if (_.isNaN(priceMin))
			priceMin = -Infinity;
		if (_.isNaN(priceMax))
			priceMax = Infinity;
		return {
			priceMin: priceMin,
			priceMax: priceMax
		};
	};

	// フィルタの登録 setBodyFilterArgs => setBodyFilterの順
	dataView.setBodyFilterArgs(getFilterArgsFromView());
	dataView.setBodyFilter(myFilter);

	// フィルタの実行
	$('#priceFilterBtn').click(function(){
		var filterArgs = getFilterArgsFromView();
		dataView.setBodyFilterArgs(filterArgs);
		grid.getEditorLock().cancelCurrentEdit();
		dataView.refresh();
	});
});
