////////////////////////////////////////////////////////////////
// title列, percentComplete列にエディタを使ってみた

var EditorFactory = {
	getEditor: function(column){
		return Slick.Editors.Text;
	}
};
wrapdebugAll(EditorFactory, "EditorFactory");

var grid;
var columns = [
	{id: "title", name: "Title", field: "title"},
	{id: "duration", name: "Duration", field: "duration"}
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
	enableAddRow: true,
	editorFactory: EditorFactory
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
			duration: "5 days"
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
