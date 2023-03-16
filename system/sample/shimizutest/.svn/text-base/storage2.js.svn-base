$(function(){
	//////////////////////////////////////////////
	// View
	var ListView = Backbone.View.extend({
		// 要素
		el						: $('#ca_main'),

		validator: null,

		// Eventes
		events: {
			"click #ca_back"		:	"_onBackClick"
		},

		initialize: function() {
			_.bindAll(this);
			
			if(clcom.srcId == "storage"){
				var args = clcom.pageArgs;
				$('#ca_input').val(args.ca_input);
			}
		},

		/**
		 * 画面描写
		 */
		render: function() {
				return this;
		},

		
		/**
		 * 元の画面へ戻るボタン click
		 */
		_onBackClick: function(){
			clcom.popPage();
		}
	});
	
	ca_listView = new ListView();
	ca_listView.render();
	

});
