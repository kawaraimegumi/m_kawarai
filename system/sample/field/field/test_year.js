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
		clutil.clquarteryearselector($('#quarter'));
		clutil.clyearselector($('#year'));
		clutil.clyearselector({
			el: '#year2',
			reverse: false
		});
		clutil.clmonthselector($('#clmonth'));
		clutil.clhalfselector($('#clhalf'));
		clutil.clquarteryearselector($('#clquarteryear'));
		
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
