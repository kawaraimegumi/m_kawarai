$(function() {
	
	//////////////////////////////////////////////
	// View
	CAPAV0160PanelView = Backbone.View.extend({
		// 押下イベント
		events: {
		},
		
		filter_DMATTR : [{
			kind : gsanp_AnaDefs.GSAN_DEFS_KIND_DMRFM
		}],
		
		panelId : 'CAPAV0160',

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			this.panel = '<table class="tree mrgb10" id="ca_CAPAV0160_view">' +
							'<tr id="ca_CAPAV0160_showbuttons"><th colspan="2"><span class="treeClose"></span>DM企画属性</th></tr>' +
						 '</table>';

			// Lv2: DM企画属性のメニューアイテム
			this.navCACMV0310View = new AnaNaviItemView({
				title: 'DM企画属性',
				tr : {id: 'ca_navItemCACMV0310'}
			}).on('onNaviItemClick', this.navItemCACMV0310Click);

			// -----------------------------
			// 各セレクタView
			
			// DM企画属性選択画面
			this.CACMV0310Selector = new CACMV0310SelectorView({
				el 				: $('#ca_CACMV0310_dialog'),	// 配置場所
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
			
			// DM企画属性ボタン群
			$('#ca_CAPAV0160_view')
			.append(this.navCACMV0310View.render().$el);
		
			this.CACMV0310Selector.render();

			this.initUIelement();

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);
			clutil.initUIelement(this.$el);
			
			var _this = this;

			// DM企画属性押下
			$("#ca_CAPAV0160_showbuttons").click(function(e){
				var tr_button = $(e.target).closest('tr');
				var span = $(tr_button).find('span');
				
				if ($(span).hasClass('treeClose')) {
					$(span).removeClass('treeClose');
					$(span).addClass('treeOpen');
					$('#ca_CAPAV0160_view').find('tr.ca_button').hide();
					$('#ca_CAPAV0160_view').find('tr.ca_condview').hide();
				} else {
					$(span).removeClass('treeOpen');
					$(span).addClass('treeClose');
					$('#ca_CAPAV0160_view').find('tr.ca_button').show();
					$('#ca_CAPAV0160_view').find('tr.ca_condview').show();
				}
			});
			//////////////////////////	
			// 設定済条件の表示
			this.condUpdateAll();
		},

		// DM企画属性
		navItemCACMV0310Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			var list = this.anaProc.getFocus1(this.filter_DMATTR);
			this.CACMV0310Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0310Selector.okProc = function(data) {
				if(data != null) {
					_this.anaProc.removeFocus1(_this.filter_DMATTR);
					_this.anaProc.pushFocus1(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0310',
						anafocus : _this.anaProc.getFocus1(_this.filter_DMATTR),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// すべての条件を更新する
		condUpdateAll: function() {
			// DM企画属性
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0310',
				anafocus : this.anaProc.getFocus1(this.filter_DMATTR),
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
			// 会員属性
			// 種別でソートする
			anafocus.sort(function(a, b){
				if (a.kind > b.kind) return 1;
				if (a.kind < b.kind) return -1;
				return 0;
			});
			for (var i = 0; i < anafocus.length; i++) {
				// 属性毎に<td>を作成する
				var focus_kind = anafocus[i];
				html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
				html_source += focus_kind.name2;
				html_source += '</td>';
				html_source += '<td>';
				var focus_source = '';
				for (var j = i; j < anafocus.length; j++) {
					var focus = anafocus[j];
					if (clutil.chkStr(focus.code)) {
						focus_source += focus.code + ':';
					}
					focus_source += focus.name;
					
					// 文字数制限
					if (focus_source.length > clcom.focusStr_max) {
						focus_source = focus_source.slice(0, clcom.focusStr_max);
						focus_source += '...';
						for (; j < anafocus.length; j++) {
							if (j != anafocus.length-1 && anafocus[j+1].kind == focus_kind.kind) {
								// 次の異なる属性までjをインクリメントする
								continue;
							}
							break;
						}
						i = j;
						break;
					}
					// 次の属性が異なる場合はbreak;
					if (j != anafocus.length-1 && anafocus[j+1].kind == focus_kind.kind) {
						focus_source += ', ';
					} else {
						i = j;
						break;
					}
				}
				html_source += focus_source;
				html_source += '</td></tr>';
			}
			// 条件を表示
			$(html_source).insertAfter($('#' + tr_id));
		}
	});
});	
