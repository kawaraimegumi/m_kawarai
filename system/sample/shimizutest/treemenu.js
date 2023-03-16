$(function(){
	// body 部を隠す。
	$('body').hide();
		//////////////////////////////////////////////
		// View
		var ListView = Backbone.View.extend({
			// 要素
			el						: $('#ca_main'),

			validator: null,

			// Eventes
			events: {
				
			},

			initialize: function() {
				_.bindAll(this);
				
				var _this = this;
				
				clutil.treemenu($('#ca_menu'));
			},

			// 初期データ取得後に呼ばれる関数
			initUIelement: function() {
				
			},

			/**
			 * 画面描写
			 */
			render: function() {
					return this;
			}

		});
	ca_listView = new ListView();
	ca_listView.render();

	// 初期データを取る
//	clutil.getIniJSON(null, null, _.bind(function(data, dataType) {
		// 区分selectorを初期化する
		ca_listView.initUIelement();
		
		//ヘッダー,フッター部分は共通なのでhtmlに該当するidを振ること
//		headerView = new HeaderView();
//		footerView = new FooterView();
		
		$('body').show();
		
//	},this));

});
