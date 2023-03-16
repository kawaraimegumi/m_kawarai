var MainView = Backbone.View.extend({

	el: '#ca_main',

	initialize: function(){
		this.mdBaseView = new clutil.View.MDBaseView({
			title: 'オートコンプリート部品',

			pageCount: 1
		});

		this.validator = clutil.validator(this.$el, {
			echoback : $('.cl_echoback')
		});
	},

	initUIElement: function(){
		this.mdBaseView.initUIElement();

		function getDependAttrs() {
			var vendor_type = $('#ca_vendorID').autocomplete('clAutocompleteItem') || {};
			return {
				ymd: clcom.getOpeDate(),
				vendor_typeid: 1,
				unit_id: $('#ca_busunitID').val(),
				itgrpfunc_id: 1,
				itgrplevel_id: 5
			};
		}
		
		bus = clutil.clbusunitselector('#ca_busunitID', {
		})
			.on('change', function(attrs){
				console.log('xxxxxxxxxxxxxxxx', attrs);
			});

		// rx = clutil.cltypeselectorx('#rx', [
		// 	{id:1,name:1,code:1},
		// 	{id:2,name:2,code:2}
		// ], 0, 0, 'ida');

		// 備品コード
		clutil.clequipcode('#ca_equipID', {
			dependAttrs: {
				unit_id: function () {
					return $('#ca_busunitID').val();
				}
			}
		}).on("change", function(item){
			console.log("equip", item);
		});
		// 備品取引先
		clutil.clequipvendcode('#ca_equipVendID', {
			dependAttrs: {
				unit_id: function () {
					return $('#ca_busunitID').val();
				}
			}
		});
		// 取引先
		var vendorField = clutil.clvendorcode('#ca_vendorID', {
			dependAttrs: getDependAttrs
		});
		// 品種コード
		var varietyField = clutil.clvarietycode('#ca_varietyID', {
			dependAttrs: {
				ymd: clcom.getOpeDate(),
				unit_id: 5
			}
		});
		// メーカー品番
		clutil.clmakeritemcode('#ca_makerHinbanID', {
			dependAttrs: function () {
				var maker = vendorField.getValue() || {};
				var itgrp = varietyField.getValue() || {};
				return {
					maker_id: maker.id,
					itgrp_id: itgrp.id
				};
			}
		});
		// 品種属性コード
		clutil.clitemattrgrpcode('#ca_itattrgrpID', {
			dependAttrs: {
				vendor_typeid: 1
			}
		});
		// サイズコード(D)
		clutil.clcolorcode('#ca_sizeID', {
		});
		
		// 商品分類体系コード(O)
		clutil.clitgrpfunccode('#ca_itgrpfuncID', {
			dependAttrs: {
				ymd: clcom.getOpeDate
			}
		});
		// 商品階層コード(O)
		clutil.clitgrplevel('#ca_itgrplevelID', {
			dependAttrs: {
				ymd: clcom.getOpeDate,
				// itgrpfunc_id: function (){
				// 	var a = $('#ca_itgrpfuncID').autocomplete('clAutocompleteItem')||{};
				// 	return a.id;
				// }
			},
			getItgrpFuncId: function (){
				var a = $('#ca_itgrpfuncID').autocomplete('clAutocompleteItem')||{};
				return a.id;
			}
			
		});
		// 商品コード(O=1,5)
		clutil.clitgrpcode('#ca_itgrpID', {
			dependAttrs: function () {
				var a = $('#ca_itgrpfuncID').autocomplete('clAutocompleteItem') || {};
				var b = $('#ca_itgrplevelID').autocomplete('clAutocompleteItem') || {};
				return {
					ymd: 0,
					itgrpfunc_id: a.id||0,
					itgrplevel_id: b.id||0
				};
			}
		});

		// 組織体系コード
		clutil.clorgfunccode('#ca_orgfuncID', {
			dependAttrs: {
				ymd: clcom.getOpeDate
			}
		});
		// 組織階層コード
		clutil.clorglevel('#ca_orglevelID',{
			dependAttrs: {
				ymd: clcom.getOpeDate,
				orgfunc_id: 1
			}
		});
		// 組織コード
		orgField = clutil.clorgcode('#ca_orgID', {
			dependAttrs: {
				ymd: 20140221,
				orgfunc_id: 1,
				orglevel_id: 6,
				// f_stockmng: 0,
				p_org_id: 5,
				org_typeid: 7
			}
		});
		orgField.on('change', function(attrs){
			console.log('%%%%', attrs);
		});
		
		// カラー
		colorField = clutil.clcolorcode({
			el: '#ca_colorID',
			dependAttrs: {
				itemID: 11316
			}
		});

		// サイズ
		var sizeCode = clutil.clsizecode({
			el: '#ca_sizeID',
			dependAttrs: {
				itemID: 11316,
				colorID: 17,
				srchFromDate: 20120101,
				srchToDate: 20120101
			}
		});
		sizeCode.on('change', function(attrs){
			console.log('%%%%', attrs);
		});

		colorSelector = clutil.clcolorselector({
			el: '#ca_colorID2',
			dependAttrs: {
				// 期間開始日
				srchFromDate: function(){
					return 20121011;
				},
				// 期間終了日
				srchToDate: function(){
					return 0;
				},
				// 商品ID
				itemID: function(){
					return 10414;
				}
			}
		});

		pooptgrp = clutil.clpooptgrpcode({
			el: "#ca_pooptgrpID",
			dependAttrs: {
				unit_id: 5,
				poTypeID: 1
			}
		});
		pooptgrp.on("change", function(attrs){
			console.log("change pooptgrp:", attrs);
		});

		menu = clutil.clmenucode({
			el: "#ca_menuID"
		});
		menu.on("change", _.bind(console.log, console, "change pooptgrp:"));

		setup = clutil.clsetupcode({
			el: "#ca_setupID",
			dependAttrs: {
				unit_id: 5
			}
		});
		setup.on("change", _.bind(console.log, console, "change setup:"));

		role = clutil.clrolecode({
			el: "#ca_roleID"
		});
		role.on("change", _.bind(console.log, console, "change role:"));


		func = clutil.clfunccode({
			el: "#ca_funcID",
			itemTemplate: '** <%= it.name %> **'
		});
		func.on("change", _.bind(console.log, console, "change func:"));
		
		staff = clutil.clstaffcode($("#ca_staffID"));
		staff.on("change", _.bind(console.log, console, "change staff:"));

		yearmonth = clutil.clyearmonthcode({
			el: $("#ca_yearmonthID"),
			initValue: 201409,
			startYearMonth: 201208,
			endYearMonth: 201305
			// initValue: {
			// 	id: 201409
			// }
		});
		yearmonth.on("change", _.bind(console.log, console, "change yearmonth:"));

		yearweek = clutil.clyearweekcode({
			el: '#ca_yearweekID',
			initValue: MainView.yyyywwData
		});
		yearweek.on("change", _.bind(console.log, console, "change yearweek:"));

		sizegrp = clutil.clsizegrpselector({
			el: '#ca_sizegrpID'
		});
		
		sizeptn = clutil.clsizeptncode({
			el: '#ca_sizeptn',
			dependAttrs: {
				sizegrpID: function(){
					return sizegrp.getValue();
				}
			}
		});
		size = clutil.clsizecode2({
			el: '#ca_size2',
			dependAttrs: {
				sizeptnID: function(){
					var d = sizeptn.getValue();
					return d && d.id;
				},
				ymd: clcom.getOpeDate()
			}
		});
		// 都道府県
		pref = clutil.clprefcode({
			el: '#ca_pref'
			// , dependAttrs: {
			// }
		});

		iagfunc = clutil.clitemattrgrpfunccode({
			el: '#ca_iagfunc'
		});
		iagfunc2 = clutil.clitemattrgrpfuncselector({
			el: '#ca_iagfunc2'
		});

		clutil.clquarteryearselector($('#quarter'));
		clutil.clyearselector({
			el: '#year'
		});
		clutil.clyearselector({
			el: '#year2',
			reverse: true
		});

		this.ac1 = clutil.clautocomplete1({
			el: '#ca_ac1',
			candidate: [
				{id: 1, code: '001', name: 'Item-1'},
				{id: 2, code: '002', name: 'Item-2'},
				{id: 3, code: '003', name: 'Item-3'}
			]
		});
	},

	render: function(){
		this.mdBaseView.render();
		this.mdBaseView.fetch();
		return this;
	}
});

$(function () {
	clutil.getIniJSON()
		.then(function(){
			return clutil.ymd2week(clcom.getOpeDate()).done(function(data){
				MainView.yyyywwData = data;
			});
		})
		.done(function(){
			var view = MainView.view = new MainView();
			view.initUIElement();
			view.render();
		})
		.fail(function(){
			console.error('error');
		});
});
