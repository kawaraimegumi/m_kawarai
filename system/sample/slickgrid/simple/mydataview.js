var grid;
var columns = [
	{id: "title", name: "Title", field: "title"},
	{id: "duration", name: "Duration", field: "duration"},
	{id: "%", name: "% Complete", field: "percentComplete"},
	{id: "start", name: "Start", field: "start"},
	{id: "finish", name: "Finish", field: "finish"},
	{id: "effort-driven", name: "Effort Driven", field: "effortDriven"}
];

var options = {};

var XDataView = function(){};
	
_.extend(XDataView.prototype, {
	getLength: function(){
		console.log("getLength: ", JSON.stringify(arguments));
		return 5;
	},

	getItem: function(i){
		console.log("getItem: ", JSON.stringify(arguments));
		return {
			id: i,
			title: "Task " + i,
			duration: "5 days",
			percentComplete: Math.round(Math.random() * 100),
			start: "01/01/2009",
			finish: "01/05/2009",
			effortDriven: (i % 5 ==- 0)
		};
	}
});

$(function () {
	var dataView = new XDataView();
	
	grid = new Slick.Grid("#myGrid", dataView, columns, options);
});

