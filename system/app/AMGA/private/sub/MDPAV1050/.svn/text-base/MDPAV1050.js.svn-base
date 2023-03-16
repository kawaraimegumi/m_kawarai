$(function() {
	//////////////////////////////////////////////
	// View
	MDPAV1050PanelView = Backbone.View.extend({
		id: 'ca_MDPAV1050_view',
		tagName: 'table',
		className: 'tree mrgb10',
		template: _.template(''
				+ '<tr id="ca_MDPAV1050_showbuttons">'
				+ '<th colspan="2"><span class="treeClose"></span>社員</th>'
				+ '</tr>'),

		// 押下イベント
		events: {

		},

		filter_STAFF : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_STAFF
		},
		filter_STAFFATTR : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_STAFFATTR
		},
		filter_STAFFPOST : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_STAFFPOST
		},

		panelId : 'MDPAV1050',

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			// Lv2: 社員のメニューアイテム
			this.navMDCMV1170View = new AnaNaviItemView({
				title: '社員',
				tr : {id: 'ca_navItemMDCMV1170'}
			}).on('onNaviItemClick', this.navItemMDCMV1170Click);

			// Lv2: 社員属性のメニューアイテム
			this.navMDCMV1160View = new AnaNaviItemView({
				title: '社員属性',
				tr : {id: 'ca_navItemMDCMV1160'}
			}).on('onNaviItemClick', this.navItemMDCMV1160Click);

			// -----------------------------
			// 各セレクタView

			// 社員選択画面
			this.MDCMV1170Selector = new MDCMV1170SelectorView({
				el : $('#ca_MDCMV1170_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 社員属性選択画面
			this.MDCMV1160Selector = new MDCMV1160SelectorView({
				el			: $('#ca_MDCMV1160_dialog'),	// 配置場所
				$parentView	: this.$parentView,
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

			// 社員ボタン群
			var $navViewContainer = $('#ca_MDPAV1050_view');
			$navViewContainer.append(this.navMDCMV1170View.render().$el);
			$navViewContainer.append(this.navMDCMV1160View.render().$el);

			this.MDCMV1170Selector.render();
			this.MDCMV1160Selector.render();

			this.initUIelement();

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);
			clutil.initUIelement(this.$el);

			var _this = this;

			// 社員押下
			$("#ca_MDPAV1050_showbuttons").click(function(e){
				var tr_button = $(e.target).closest('tr');
				var span = $(tr_button).find('span');

				if ($(span).hasClass('treeClose')) {
					$(span).removeClass('treeClose');
					$(span).addClass('treeOpen');
					$('#ca_MDPAV1050_view').find('tr.ca_button').hide();
					$('#ca_MDPAV1050_view').find('tr.ca_condview').hide();
				} else {
					$(span).removeClass('treeOpen');
					$(span).addClass('treeClose');
					$('#ca_MDPAV1050_view').find('tr.ca_button').show();
					$('#ca_MDPAV1050_view').find('tr.ca_condview').show();
				}
			});
			//////////////////////////
			// 設定済条件の表示
			this.condUpdateAll();
			// カタログの場合制限フラグによって編集可・不可を設定する
			if (this.anaProc.catalog != null) {
				var f_anacond = this.anaProc.catalog.f_anacond;
				if ((f_anacond & amcm_type.AMCM_VAL_ANACOND_STAFF) == amcm_type.AMCM_VAL_ANACOND_STAFF) {
					var th = $("#ca_MDPAV1050_view").find('th.ca_th_edit');
					$(th).removeClass('ca_th_edit');
					var span = $("#ca_MDPAV1050_view").find('span.edit');
					$(span).remove();
					var span = $("#ca_MDPAV1050_view").find('span.ca_title');
					$(th).removeClass('category');
					$(th).addClass('ca_th_disabled');
					$(span).addClass('ca_span_disabled');
				}
			}
		},

		// 社員
		navItemMDCMV1170Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			var list = this.anaProc.getFocus1(this.filter_STAFF);
			this.MDCMV1170Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1170Selector.okProc = function(data) {
				if(data != null) {
					_this.anaProc.removeFocus1(_this.filter_STAFF);
					_this.anaProc.pushFocus1(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1170',
						anafocus : _this.anaProc.getFocus1(_this.filter_STAFF),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},
		// 社員属性
		navItemMDCMV1160Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			var list = _.union(this.anaProc.getFocus1(this.filter_STAFFATTR), this.anaProc.getFocus1(this.filter_STAFFPOST));
			this.MDCMV1160Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1160Selector.okProc = function(data) {
				if(data != null) {
					_this.anaProc.removeFocus1(_this.filter_STAFFATTR);
					_this.anaProc.removeFocus1(_this.filter_STAFFPOST);
					_this.anaProc.pushFocus1(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1160',
						anafocus : _.union(_this.anaProc.getFocus1(_this.filter_STAFFATTR), _this.anaProc.getFocus1(_this.filter_STAFFPOST)),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// すべての条件を更新する
		condUpdateAll: function() {
			// 社員
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1170',
				anafocus : this.anaProc.getFocus1(this.filter_STAFF),
				panelId : this.panelId
			});
			// 社員属性
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1160',
				anafocus : _.union(this.anaProc.getFocus1(this.filter_STAFFATTR), this.anaProc.getFocus1(this.filter_STAFFPOST)),
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
			case 'ca_navItemMDCMV1160':
				// 社員属性
				// 属性でソートする
				anafocus.sort(function(a, b){
					if (a.attr > b.attr) return 1;
					if (a.attr < b.attr) return -1;
					return 0;
				});
				for (var i = 0; i < anafocus.length; i++) {
					// 属性毎に<td>を作成する
					var focus_attr = anafocus[i];
					html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
					html_source += focus_attr.name2;
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
								if (j != anafocus.length-1 && anafocus[j+1].attr == focus_attr.attr) {
									// 次の異なる属性までjをインクリメントする
									continue;
								}
								break;
							}
							i = j;
							break;
						}
						// 次の属性が異なる場合はbreak;
						if (j != anafocus.length-1 && anafocus[j+1].attr == focus_attr.attr) {
							focus_source += ', ';
						} else {
							i = j;
							break;
						}
					}
					html_source += focus_source;
					html_source += '</td></tr>';
				}
				break;
			default:
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
				break;
			}

			// 条件を表示
			$(html_source).insertAfter($('#' + tr_id));
		}
	});
});
