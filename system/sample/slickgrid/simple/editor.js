////////////////////////////////////////////////////////////////
// title列, percentComplete列にエディタを使ってみた

// エディタをラップしてデバッグする
var WrapEditor = function(className, Editor){
	var debug = function(name, args, result){
		console.log("*", className + "#" +  name);
		console.log("  *", args);
		if (result !== undefined){
			console.log("  * result", result);
		}
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


var grid;
var columns = [
	{id: "title", name: "Title", field: "title", editor: Slick.Editors.Text},
	{id: "duration", name: "Duration", field: "duration"},
	{id: "duration", name: "Duration", field: "duration", editor: MyText},
	{id: "%", name: "% Complete", field: "percentComplete", editor: Slick.Editors.Integer},
	{id: "start", name: "Start", field: "start"},
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
			duration: "5 days",
			percentComplete: Math.round(Math.random() * 100),
			start: "01/01/2009",
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
});
