$(function() {

	//////////////////////////////////////////////
	// View
	CAPAV0080PanelView = Backbone.View.extend({
		// 押下イベント
		events: {
		},

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			this.navItemView = new AnaNaviItemView({title:'条件'})
				.on('onNaviItemClick', this.navItemClick);

			this.CACMV0220List = {};
			
			if(this.anaProc){
				// 分析条件変更のイベント通知を設定する。
				this.anaProc.on('onCondUpdated', this.condUpdated);
			}
		},

		/**
		 * 画面描写
		 */
		render: function() {
			this.$view.append(this.navItemView.render().$el);

			this.initUIelement();

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

			// 条件表示画面
			this.CACMV0220Selector = new  CACMV0220SelectorView({
				el			: $('#ca_CACMV0220_dialog'),	// 配置場所
				$parentView	: this.$parentView,
				anaProc		: this.anaProc
			}).render(
					this.$parentView
			);
		},

		// 表示押下 - this.navItemView のクリックイベントに関連付けしている。
		navItemClick: function(e) {
			// liのactive表示
			this.navItemView.setActive();

			this.CACMV0220Selector.show(this.CACMV0220List);

			//サブ画面復帰後処理
			this.CACMV0220Selector.okProc = function(data) {
				if(data != null) {
					this.CACMV0220List = data;
				}
				// ボタンにフォーカスする
				$(e.target).focus();
			}
		},
		
		/**
		 * 条件変更通知を受けた
		 */
		condUpdated: function(proc, e) {
			console.log('### onCondUpdated recieved: isActive[' + this.navItemView.isActive() + ']');
			if(this.navItemView.isActive()){
				// TODO: 分析条件の更新通知が届いたので、Viewを更新すること。
			}
		},

		/**
		 * ボタン群の表示
		 */
		showButtons: function(e) {
			$('.cl_dialog').empty();
			$('.ca_buttons').hide();
			this.CAPAV0080Buttons.showButtons(e);
		}
	});
});	
