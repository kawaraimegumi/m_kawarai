var grid;
var columns = [
	{id: "title", name: "Title", field: "title"},
	{id: "duration", name: "Duration", field: "duration"},
	{id: "%", name: "% Complete", field: "percentComplete"},
	{id: "start", name: "Start", field: "start"},
	{id: "finish", name: "Finish", field: "finish"},
	{id: "effort-driven", name: "Effort Driven", field: "effortDriven"}
];

var options = {
	editable: true,
	autoEdit: true
};

var data = _(2)
		.chain()
		.range()
		.map(function(i){
			return {
				id: i,
				title: "Task " + i,
				duration: "5 days",
				percentComplete: Math.round(Math.random() * 100),
				start: "01/01/2009",
				finish: "01/05/2009",
				effortDriven: (i % 5 ==- 0)
			};
		})
		.value();

$(function () {
	var dataView = new Slick.Data.DataView();
	wrapdebugAll(dataView, "dataView");

	grid = new Slick.Grid("#myGrid", dataView, columns, options);
	wrapdebugAll(grid, "#### grid ####");
	
	// Make the grid respond to DataView change events.
	dataView.onRowCountChanged.subscribe(function (e, args) {
		console.log("onRowCountChanged", dataView.getLength(), args);
		grid.updateRowCount();
		grid.render();
	});

	dataView.onRowsChanged.subscribe(function (e, args) {
		console.log("onRowCountChanged", dataView.getLength(), args);
		grid.invalidateRows(args.rows);
		grid.render();
	});

	dataView.setItems(data);
});
