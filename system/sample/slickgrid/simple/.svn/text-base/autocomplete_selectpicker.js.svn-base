////////////////////////////////////////////////////////////////
// オートコンプリートとselectpickerをつかってみた

// エディタをラップしてデバッグする
var WrapEditor = function(className, Editor){
	var debug = function(name, args, result){
		console.log("*", className + "#" +  name);
		// console.log("  *", args);
		// if (result !== undefined){
		// 	console.log("  * result", result);
		// }
	};
	
	var wrap = function(name, fn, context){
		return function(){
			var args = _.toArray(arguments);
			var result = fn.apply(context, args);
			debug(name, args, result);
			return result;
		};
	};

	var constructor = function(args){
		this.editor = new Editor(args);
		_.each(_.functions(this.editor), function(name) {
			var fn = this.editor[name];
			this[name] = wrap(name, fn, this.editor);
		}, this);

		console.log("####");
		debug("constructor", arguments);
	};

	return constructor;
};

var MyText = WrapEditor("Text", Slick.Editors.Text);

////////////////////////////////////////////////////////////////
// autocompleteをやってみた
var acFormatter = function(row, cell, value, columnDef, dataContext){
	// console.log("acFormatter", row, cell, value, columnDef, dataContext);
	return value != null ? value.label : '';
};

var AutoComplete = function(args){
	var $input;
	var defaultValue;
	
	this.init = function(){
		$input = $('<input type="text">')
			.autocomplete({
				source: [
					{id: 1, label: "0001:good"},
					{id: 2, label: "0002:very good"},
					{id: 3, label: "0003:bad "},
					{id: 4, label: "0004:poor"}
				],
				getLabel: function(item){
					return item != null ? item.label : "";
				}
			})
			.appendTo(args.container)
			.focus()
			.select();
	};

	this.destroy = function(){
		$input.remove();
	};

	this.focus = function(){
		$input.focus();
	},
	
	this.loadValue = function(item){
		$input.autocomplete('clAutocompleteItem', item[args.column.field]);
		defaultValue = $input.val();
		$input.select();
	};

	this.serializeValue = function(){
		return $input.autocomplete('clAutocompleteItem');
	};

	this.applyValue = function(item, state){
		item[args.column.field] = state;
	};

	this.isValueChanged = function(){
		return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
	};

	this.validate = function(){
		var valid, item;
		item = this.serializeValue();
		valid = item != null && item.id !== 0;
		return {
			valid: valid,
			msg: 'error'
		};
	};

	this.init();
};
AutoComplete = WrapEditor("AutoComplete", AutoComplete);

////////////////////////////////////////////////////////////////
// selectpickerをつかってみた
var SelectPicker = function(args){
	var $input;
	var defaultValue;

	var collection = [
		{id: 1, label: "0001:good"},
		{id: 2, label: "0002:very good"},
		{id: 3, label: "0003:bad "},
		{id: 4, label: "0004:poor"}
	];
	
	this.init = function(){
		$input = $('<select></select>')
			.html(_.map(collection, function(item){
				return '<option value="' + item.id + '">' + item.label + '</option>';
			}).join(''))
			.appendTo(args.container)
			.selectpicker()
			.focus()
			.select();
	};

	this.destroy = function(){
		$input.remove();
	};

	this.focus = function(){
		$input.focus();
	},
	
	this.loadValue = function(item){
		var data = item[args.column.field];
		defaultValue = parseInt(data && data.id, 10) || 0;
		$input.selectpicker("val", defaultValue);
	};

	this.serializeValue = function(){
		return parseInt($input.selectpicker('val'), 10) || 0;
	};

	this.applyValue = function(item, state){
		item[args.column.field] = collection[state];
		item.finish = new Date().toString();
	};

	this.isValueChanged = function(){
		return this.serializeValue() !== defaultValue;
	};

	this.validate = function(){
		return {
			valid: this.serializeValue() > 0,
			msg: 'error'
		};
	};

	this.init();
};

SelectPicker = WrapEditor("SelectPicker", SelectPicker);
		
var grid;
var columns = [
	{id: "title", name: "Title", field: "title", editor: Slick.Editors.Text},
	{id: "lank", name: "Lank", field: "lank", editor: AutoComplete, width: 100, formatter: acFormatter},
	{id: "duration", name: "Duration", field: "duration", editor: MyText},
	{id: "%", name: "% Complete", field: "percentComplete", editor: Slick.Editors.Integer},
	{id: "start", name: "Start", field: "start", editor: SelectPicker, 
	 formatter: acFormatter, width: 120},
	{id: "finish", name: "Finish", field: "finish"},
	{id: "effort-driven", name: "Effort Driven", field: "effortDriven"}
];

var options = {
	// エディット可能にする。
	editable: true,
	// ダブルクリックでなくフォーカスインで編集可能にする。
	// 指定しない場合と同じ!!
	autoEdit: true,
	// DnDによる列の入れ替えを無効にする
	enableColumnReorder: false	,
	// 縦スクロールバーがつかないようにした
	autoHeight: true,
	// trueのとき、空の行を最後に追加して、それをクリックすると新しい行が追加される。
	// onAddNewRowを購読して値を保存するようにしなくてはならないらしい。
	enableAddRow: true
};

// カラムのリサイズを無効にしてみる
_.each(columns, function(column){
	column.resizable = false;
});

$(function () {
	var data = [];
	for (var i = 0; i < 20; i++) {
		data[i] = {
			title: "Task " + i,
			lank: {
				id: 1,
				label: "0001:good"
			},
			duration: "5 days",
			percentComplete: Math.round(Math.random() * 100),
			start: {
				id: 2,
				label: "0002:very good"
			},
			finish: "01/05/2009",
			effortDriven: (i % 5 ==- 0)
		};
	}

	grid = new Slick.Grid("#myGrid", data, columns, options);

	// 新規行を追加するためにonAddNewRowを購読
	grid.onAddNewRow.subscribe(function(e, args) {
		var item = args.item;
		grid.invalidateRow(data.length);
		data.push(item);
		grid.updateRowCount();
		grid.render();
	});

	grid.onCellChange.subscribe(function(e, data){
		console.log("onCellChange", data);
	})
});

$(function(){
	var foo = new ClGrid.Editors.ClDate();
	foo.$el.appendTo('#foo');
	foo.render();
	clutil.datepicker($("#bar"));
});
