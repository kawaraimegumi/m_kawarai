$(function() {
	
	//////////////////////////////////////////////
	// View
	CAPAV0140PanelView = Backbone.View.extend({
		// 押下イベント
		events: {
		},
		
		filter_DMPROM : {
			kind : gsanp_AnaDefs.GSAN_DEFS_KIND_DMPROM
		},
		panelId : 'CAPAV0140',

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			this.panel = '<table class="tree mrgb10" id="ca_CAPAV0140_view">' +
							'<tr id="ca_CAPAV0140_showbuttons"><th colspan="2" class="required"><span class="treeClose"></span>DM企画</th></tr>' +
						 '</table>';

			// Lv2: DM企画のメニューアイテム
			this.navCACMV0270View = new AnaNaviItemView({
				title: 'DM企画',
				tr : {id: 'ca_navItemCACMV0270'}
			}).on('onNaviItemClick', this.navItemCACMV0270Click);

			// -----------------------------
			// 各セレクタView
			
			// DM企画選択画面
			this.CACMV0270Selector = new CACMV0270SelectorView({
				el 				: $('#ca_CACMV0270_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});
			
			// -----------------------------
			// イベントハンドリング
			if(this.anaProc){
				this.anaProc.on('onCondReset', this.onCondReset);		// 「条件をクリア」イベントを捕捉する
				this.anaProc.on('onCondUpdated', this.onCondUpdated);	// 「確定」イベントを捕捉する
			}
		},

		/**
		 * 画面描写
		 */
		render: function() {
			this.$view.append(this.panel);
			
			// DM企画ボタン群
			$('#ca_CAPAV0140_view')
			.append(this.navCACMV0270View.render().$el);
		
			this.CACMV0270Selector.render();

			this.initUIelement();

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);
			clutil.initUIelement(this.$el);
			
			var _this = this;

			// DM企画押下
			$("#ca_CAPAV0140_showbuttons").click(function(e){
				var tr_button = $(e.target).closest('tr');
				var span = $(tr_button).find('span');
				
				if ($(span).hasClass('treeClose')) {
					$(span).removeClass('treeClose');
					$(span).addClass('treeOpen');
					$('#ca_CAPAV0140_view').find('tr.ca_button').hide();
					$('#ca_CAPAV0140_view').find('tr.ca_condview').hide();
				} else {
					$(span).removeClass('treeOpen');
					$(span).addClass('treeClose');
					$('#ca_CAPAV0140_view').find('tr.ca_button').show();
					$('#ca_CAPAV0140_view').find('tr.ca_condview').show();
				}
			});
			//////////////////////////	
			// 設定済条件の表示
			this.condUpdateAll();
		},

		// DM企画
		navItemCACMV0270Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			var list = this.anaProc.getFocus1(this.filter_DMPROM);
			this.CACMV0270Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0270Selector.okProc = function(data) {
				if(data != null) {
					_this.anaProc.removeFocus1(_this.filter_DMPROM);
					_this.anaProc.pushFocus1(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0270',
						anafocus : _this.anaProc.getFocus1(_this.filter_DMPROM),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// すべての条件を更新する
		condUpdateAll: function() {
			// DM企画
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0270',
				anafocus : this.anaProc.getFocus1(this.filter_DMPROM),
				panelId : this.panelId
			});
		},
		
		// 「条件をクリア」⇒ エコーバックViewを更新
		onCondReset: function(anaproc, from){
			// 条件がクリアされたので、エコーバック View を更新する。
			// anaProc.cond または、anaProc.getFocus12() から分析条件を参照して、
			// エコーバック View の表示内容を更新すること。
			this.condUpdateAll();
		},
		
		// 「確定」⇒ エコーバックViewを更新
		onCondUpdated: function(anaproc, from){
			// 条件が確定したので、エコーバック View を更新する。
			// anaProc.cond または、anaProc.getFocus12() から分析条件を参照して、
			// エコーバック View の表示内容を更新すること。
			if (!from) {
				return;
			}
			if (this.panelId != from.panelId) {
				return;
			}
			var tr_id = from.id;
			var anafocus = from.anafocus;

			// 条件表示部分を削除
			$('tr.ca_condview[tgt-id=' + tr_id + ']').remove();
			
			// 条件が空の場合はなにも表示しない
			if (!anafocus || anafocus.length == 0) {
				return;
			}
			
			var html_source = '';
			html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td colspan="2">';
			var focus_source = '';
			for (var i = 0; i < anafocus.length; i++) {
				var focus = anafocus[i];

				if (clutil.chkStr(focus.code)) {
					focus_source += focus.code + ':';
				}
				focus_source += focus.name;
				
				// 文字数制限
				if (focus_source.length > clcom.focusStr_max) {
					focus_source = focus_source.slice(0, clcom.focusStr_max);
					focus_source += '...';
					break;
				}
				if (i != anafocus.length-1) {
					focus_source += ', ';
				}
			}
			html_source += focus_source;
			html_source += '</td></tr>';
			// 条件を表示
			$(html_source).insertAfter($('#' + tr_id));
		}
	});
});	
