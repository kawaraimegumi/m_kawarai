
function main(clutil) {
	f = clutil.clbusunitselector('#ca_busunitID', {
		dependAttrs: {
			flagHD:1
		}
		
	})
		.on('change', function (attrs, field) {
			console.log('!change ca_busunitID attrs:', attrs);
		})
		.done(function(){});

	g = clutil.clorgfuncselector('#ca_orgfuncID', {
		
	}).done(function(){});
	
	clutil.clorglevelselector('#ca_orglevelID', {
	}).done(function(){});
	
	z = clutil.cltypeselector({
		el: '#ca_slip',
		kind: amcm_type.AMCM_TYPE_SLIP
	}).on('change', function(attrs) {
		console.log('slip changed attrs:', attrs);
	});
	z.$el.on('change', function(attrs){
		console.log('** slip changed attrs:', attrs);
	});

	sizegrp = clutil.clsizegrpselector({
		el: "#ca_sizegrpID",
		emptyLabel: "全て"
	}).on("change", function(attrs){
		console.log("!change sizegrp attrs:", attrs);
	});

	sizeptncode = clutil.clsizeptncode({
		el: "#ca_sizeptnID",
		dependAttrs: {
			sizegrpID: function(){return sizegrp.getValue()}
		}
	}).on("change", function(attrs){
		console.log("!change sizeptn attrs:", attrs);
	});

	sizeptnsel = clutil.clsizeptnselector({
		el: "#ca_sel_sizeptnID",
		dependAttrs: {
			sizegrpID: 1
		}
	}).on("change", function(attrs){
		console.log("!change sizeptn attrs:", attrs);
	});

	sizeptn_byitgrp = clutil.clsizeptn_byitgrpselector({
		el: "#ca_sizeptnIdByItgrp",
		dependAttrs: {
			itgrp_id: 102
		}
	}).on("change", function(attrs){
		console.log("!change sizeptn attrs:", attrs);
	});

	typesel2 = clutil.cltypeselector2({
		$select: $("#typesel2"),
		list: [
			{id: 1, name: "name 1", code: "0001"},
			{id: 2, name: "name 2", code: "0002"},
			{id: 3, name: "name 3", code: "0003"}
		],
		emptyLabel: "SUBETE"
	});

	colorselector = clutil.clcolorselector({
		el: '#ca_colorID',
		dependAttrs: {
			// 期間開始日
			srchFromDate: function(){
				return clcom.getOpeDate();
			},
			// 期間終了日
			srchToDate: function(){
				return 0;
			},
			// 商品ID
			itemID: function(){
				return 25639
			}
		}
	});
	colorselector.on('change', function(a){
		console.log('change', a);
		
	});
	inventcntschselector = clutil.clinventcntschselector({
		el: '#ca_inventcntschID'
	});
	inventcntschselector.on("change", function(item){
		// 選択変更時コールバック
		console.log("!change inventcntsch attrs:", item);
		// item.year   年
		// item.month  月
		// item.unit_id 事業ユニットID
		// item.inventId 棚卸ID
	});
	
	sizerow = clutil.clsizerowselector({
		el: '#ca_sizerowID',
		dependAttrs: {
			sizePtnID: 14
		}
	});
	sizerow.on('change', function(item){
		console.log('!change sizerow attrs: ', item);
	});

	offsetitem = clutil.cloffsetitemselector({
		el: '#ca_offsetitemID',
		dependAttrs: {
			unit_id: 5,
			offsetTypeID: 1
		}
	});
}

$(function () {
	clutil.getIniJSON(null)
		.done(function(data){
			clcom._preventConfirm = true;
			main(clutil);
		});
});

