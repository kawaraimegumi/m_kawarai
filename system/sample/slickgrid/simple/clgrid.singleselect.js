////////////////////////////////////////////////////////////////
// title列, percentComplete列にエディタを使ってみた


var grid;
var columns = [
	{id: "title", name: "Title", field: "title",
	 formatter: function(row, cell, value, columnDef, dataContext){
		 // jshint unused: false
		 // console.log("acFormatter", row, cell, value, columnDef, dataContext);
		 return value != null ? value.label : '';
	 },
	 cellType: {
		 type: 'selector',
		 editorOptions: {
			 items: [
				 {id: 1, label: "Task 1"},
				 {id: 2, label: "Task 2"},
				 {id: 3, label: "Task 3"}
			 ]
		 },
		 formatter: function(data){
			 return data.label;
		 }
	 }
	},
	{id: "duration", name: "Duration", field: "duration"},
	{id: "duration", name: "Duration", field: "duration"},
	{id: "%", name: "% Complete", field: "percentComplete"},
	{id: "start", name: "Start", field: "start"},
	{id: "finish", name: "Finish", field: "finish"},
	{id: "effort-driven", name: "Effort Driven", field: "effortDriven"}
];

var options = {
	editorFactory: new ClGrid.EditorFactory(),
	// エディット可能にする。
	editable: true,
	// ダブルクリックでなくフォーカスインで編集可能にする。
	// 指定しない場合と同じ!!
	autoEdit: true,
	// DnDによる列の入れ替えを無効にする
	enableColumnReorder: false	,
	// 縦スクロールバーがつかないようにした
	autoHeight: true
};

var XDataView = function(){
	this.items = [];
};

_.extend(XDataView.prototype, {
	getLength: function(){
		return 10;
	},

	getItem: function(i){
		if (!this.items[i]) {
			this.items[i] = {
				id: i,
				title: {
					id: i % 3 + 1,
					label: "Task " + (i % 3 + 1)
				},
				duration: "5 days",
				percentComplete: Math.round(Math.random() * 100),
				start: "01/01/2009",
				finish: "01/05/2009",
				effortDriven: (i % 5 ==- 0)
			};
		}
		return this.items[i];
	},

	getIdxById: function(id){
		return id;
	}
});

// ClGrid.Editors.SingleSelector = wrapdebugClass(ClGrid.Editors.SingleSelector, "SingleSelector");

$(function () {
	var dataView = new ClGrid.DataView();
	dataView.setBodyItems(_.chain(10).range().map(function(i){
		return {
			id: i,
			title: {
				id: i % 3 + 1,
				label: "Task " + (i % 3 + 1)
			},
			duration: "5 days",
			percentComplete: Math.round(Math.random() * 100),
			start: "01/01/2009",
			finish: "01/05/2009",
			effortDriven: (i % 5 ==- 0)
		};
	}).value());
	grid = new Slick.Grid("#myGrid", dataView, columns, options);
});

var foo;
$(function(){
});