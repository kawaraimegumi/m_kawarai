$(function() {
	//////////////////////////////////////////////
	// View
	MDPAV0140PanelView = Backbone.View.extend({
		id: 'ca_MDPAV0140_view',
		tagName: 'table',
		className: 'tree mrgb10',
		template: _.template(''
				+ '<tr id="ca_MDPAV0140_showbuttons">'
				+ '<th colspan="2"><span class="treeClose"></span>流入・流出区分</th>'
				+ '</tr>'),

		// 押下イベント
		events: {

		},

		filter_QY : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_MEMBIO
		},

		panelId : 'MDPAV0140',

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			// Lv2: 購入点数のメニューアイテム
			this.navMDCMV0140View = new AnaNaviItemView({
				title: '流入・流出区分',
				tr : {id: 'ca_navItemMDCMV0140'}
			}).on('onNaviItemClick', this.navItemMDCMV0140Click);

			// -----------------------------
			// 各セレクタView

			// 購入点数選択画面
			this.MDCMV0140Selector = new MDCMV0140SelectorView({
				el : $('#ca_MDCMV0140_dialog'),	// 配置場所
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
			this.$el.html(this.template());
			this.$view.append(this.$el);

			// 流入・流出区分ボタン群
			var $navViewContainer = $('#ca_MDPAV0140_view');
			$navViewContainer.append(this.navMDCMV0140View.render().$el);

			this.MDCMV0140Selector.render();

			this.initUIelement();

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);
			clutil.initUIelement(this.$el);

			var _this = this;

			// 流入・流出区分押下
			$("#ca_MDPAV0140_showbuttons").click(function(e){
				var tr_button = $(e.target).closest('tr');
				var span = $(tr_button).find('span');

				if ($(span).hasClass('treeClose')) {
					$(span).removeClass('treeClose');
					$(span).addClass('treeOpen');
					$('#ca_MDPAV0140_view').find('tr.ca_button').hide();
					$('#ca_MDPAV0140_view').find('tr.ca_condview').hide();
				} else {
					$(span).removeClass('treeOpen');
					$(span).addClass('treeClose');
					$('#ca_MDPAV0140_view').find('tr.ca_button').show();
					$('#ca_MDPAV0140_view').find('tr.ca_condview').show();
				}
			});
			//////////////////////////
			// 設定済条件の表示
			this.condUpdateAll();
			// カタログの場合制限フラグによって編集可・不可を設定する
			if (this.anaProc.catalog != null) {
				var f_anacond = this.anaProc.catalog.f_anacond;
				if ((f_anacond & amcm_type.AMCM_VAL_ANACOND_STAFF) == amcm_type.AMCM_VAL_ANACOND_STAFF) {
					var th = $("#ca_MDPAV0140_view").find('th.ca_th_edit');
					$(th).removeClass('ca_th_edit');
					var span = $("#ca_MDPAV0140_view").find('span.edit');
					$(span).remove();
					var span = $("#ca_MDPAV0140_view").find('span.ca_title');
					$(th).removeClass('category');
					$(th).addClass('ca_th_disabled');
					$(span).addClass('ca_span_disabled');
				}
			}
		},

		// 流入・流出区分
		navItemMDCMV0140Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			var list = this.anaProc.getFocus1(this.filter_QY);
			this.MDCMV0140Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV0140Selector.okProc = function(data) {
				if(data != null) {
					_this.anaProc.removeFocus1(_this.filter_QY);
					_this.anaProc.pushFocus1(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV0140',
						anafocus : _this.anaProc.getFocus1(_this.filter_QY),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// すべての条件を更新する
		condUpdateAll: function() {
			// 流入・流出区分
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV0140',
				anafocus : this.anaProc.getFocus1(this.filter_QY),
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
			switch(tr_id){
			default:
				html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td colspan="2">';
				var focus_source = '';

				for (var i = 0; i < anafocus.length; i++) {
					var focus = anafocus[i];

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
				break;
			}

			// 条件を表示
			$(html_source).insertAfter($('#' + tr_id));
		}
	});
});
