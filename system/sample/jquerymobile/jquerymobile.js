$(function(){
	
	//////////////////////////////////////////////
	// View
	var JqueryMobileView = Backbone.View.extend({
		// 要素
		el						: $('#ca_main'),

		validator: null,

		// Eventes
		events: {
			"click #opendialog"	:	"_onOpenDialogClick",
			"click #openpopup"	:	"_onOpenPopupClick",
			"click #openpage1"	:	"_onOpenPage1Click",
			"click #openpage2"	:	"_onOpenPage2Click",
			"click #showbox"	:	"_onShowBoxClick",
			"click #showbox2"	:	"_onShowBox2Click",
			"click .showmore"	:	"_onShowMoreClick"

		},

		initialize: function() {
			_.bindAll(this);
			var _this = this;
			
			$('#ca_main').swipeleft(function(e){
				_this._onOpenPage2Click();
			})
			
			$('#ca_main').swiperight(function(e){
				_this._onOpenPage1Click();
			})
		},
	   
		render: function() {
			return this;
		},
		
		_onOpenDialogClick: function() {
			document.location="#dialog";
		},
		
		_onOpenPopupClick: function() {
			document.location="#popup";
		},
		
		_onOpenPage1Click: function() {
			$.mobile.changePage("#page1", {
				transition: 'slide',
				reverse: true
			})
		},
		
		_onOpenPage2Click: function() {
//			$.mobile.changePage("#page2", {
//				transition: 'slide'
//			})
			// 同じページ
			$.mobile.changePage("#", {
				transition: 'slide',
				reloadPage: true
			})
		},
		
		_onShowBoxClick: function() {
			$('.box').show().animate({
		          top: 0,
		          left: 0,
		          width: '100px',
		          height: '100px'
		    }, 500);
		},
		
		_onShowBox2Click: function() {
			$("#box2").animate(
		            {
		                width: 'toggle',
		            },
		            {
		                duration: 2000,
		                easing: 'easeOutBounce',
		            }
		        );
		},
		
		_onShowMoreClick: function(e) {
			var tgt = $(e.target).next();
			tgt.animate({
				height: 'toggle',
				opacity: 'toggle'
			}, 'slow');
		}
		
	});
	ca_sampleView = new JqueryMobileView();
	ca_sampleView.render();

});
