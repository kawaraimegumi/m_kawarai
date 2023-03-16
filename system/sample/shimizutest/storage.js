$(function(){
	//////////////////////////////////////////////
	// View
	var ListView = Backbone.View.extend({
		// 要素
		el						: $('#ca_main'),

		validator: null,

		// Eventes
		events: {
			"click #ca_next"		:	"_onNextClick"
		},

		initialize: function() {
			_.bindAll(this);
			
			if(clcom.pageData != null){
				$('#ca_input').val(clcom.pageData.cond);
			}
		},

		/**
		 * 画面描写
		 */
		render: function() {
				return this;
		},

		
		/**
		 * 次の画面へ遷移ボタン click
		 */
		_onNextClick: function(){
			var args = {
					ca_input : $('#ca_input').val()
			};
			
			var data = {
					cond : $('#ca_input').val()
			};

			clcom.pushPage(
					'./storage2.html',	// 遷移先url
					args,					// 画面引数
					data					// 保存データ
			);
		}
	});
	
	ca_listView = new ListView();
	ca_listView.render();
	

});
