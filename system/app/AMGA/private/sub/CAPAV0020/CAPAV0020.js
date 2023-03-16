$(function() {

	//////////////////////////////////////////////
	// View
	CAPAV0020PanelView = Backbone.View.extend({
		id: 'ca_CAPAV0020_view',
		tagName: 'table',
		className: 'tree mrgb10',
		template: _.template(''
				+ '<tr id="ca_CAPAV0020_showbuttons">'
				+ '<th colspan="2"><span class="treeClose"></span>店舗</th>'
				+ '</tr>'),

		// 押下イベント
		events: {
		},

		filter_ORG : {
			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ORG
		},
		filter_STORE : {
			kind : amanp_AnaDefs.AMAN_DEFS_KIND_STORE
		},
		filter_STOREATTRs : _.map([
			amanp_AnaDefs.AMAN_DEFS_KIND_STOREATTR_CLOSED,
			amanp_AnaDefs.AMAN_DEFS_KIND_NEWSTORE_LOGIC,
			amanp_AnaDefs.AMAN_DEFS_KIND_STOREATTR_SMX,
			amanp_AnaDefs.AMAN_DEFS_KIND_STORE_SORT,
			amanp_AnaDefs.AMAN_DEFS_KIND_NEWSTORE_COND
		], function(anaKind){ return { kind: anaKind }; }),
		filter_STORELIST : {
			kind : amanp_AnaDefs.AMAN_DEFS_KIND_STORELIST
		},

		panelId : 'CAPAV0020',

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			// Lv2: 組織階層のメニューアイテム
			this.navCACMV0020View = new AnaNaviItemView({
				title: '組織階層',
				tr : {id: 'ca_navItemCACMV0020'}
			}).on('onNaviItemClick', this.navItemCACMV0020Click);

			// Lv2: 店舗のメニューアイテム
			this.navCACMV0030View = new AnaNaviItemView({
				title: '店舗',
				tr : {id: 'ca_navItemCACMV0030'}
			}).on('onNaviItemClick', this.navItemCACMV0030Click);

			// Lv2: 店舗属性のメニューアイテム
			this.navMDCMV0020View = new AnaNaviItemView({
				title: '店舗属性',
				tr : {id: 'ca_navItemMDCMV0020'}
			}).on('onNaviItemClick', this.navItemMDCMV0020Click);

			// Lv2: 店舗リストのメニューアイテム
			this.navCACMV0040View = new AnaNaviItemView({
				title: '店舗リスト',
				tr : {id: 'ca_navItemCACMV0040'}
			}).on('onNaviItemClick', this.navItemCACMV0040Click);


			// -----------------------------
			// 各セレクタView

			// 組織選択画面
			this.CACMV0020Selector = new CACMV0020SelectorView({
				el : $('#ca_CACMV0020_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 店舗選択画面
			this.CACMV0030Selector = new CACMV0030SelectorView({
				el			: $('#ca_CACMV0030_dialog'),	// 配置場所
				$parentView	: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 店舗属性選択画面
			this.MDCMV0020Selector = new MDCMV0020SelectorView({
				el			: $('#ca_MDCMV0020_dialog'),	// 配置場所
				$parentView	: this.$parentView,
				anaProc		: this.anaProc
			});

			// 店舗リスト選択画面
			this.CACMV0040Selector = new CACMV0040SelectorView({
				el : $('#ca_CACMV0040_dialog'),	// 配置場所
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

			// 店舗ボタン群
			$('#ca_CAPAV0020_view')
			.append(this.navCACMV0020View.render().$el)
			.append(this.navCACMV0030View.render().$el)
			.append(this.navMDCMV0020View.render().$el)
			.append(this.navCACMV0040View.render().$el);

			this.CACMV0020Selector.render();
			this.CACMV0030Selector.render();
			this.MDCMV0020Selector.render();
			this.CACMV0040Selector.render();

			this.initUIelement();

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);
			clutil.initUIelement(this.$el);

			var _this = this;

			// 店舗押下
			$("#ca_CAPAV0020_showbuttons").click(function(e){
				var tr_button = $(e.target).closest('tr');
				var span = $(tr_button).find('span');

				if ($(span).hasClass('treeClose')) {
					$(span).removeClass('treeClose');
					$(span).addClass('treeOpen');
					$('#ca_CAPAV0020_view').find('tr.ca_button').hide();
					$('#ca_CAPAV0020_view').find('tr.ca_condview').hide();
				} else {
					$(span).removeClass('treeOpen');
					$(span).addClass('treeClose');
					$('#ca_CAPAV0020_view').find('tr.ca_button').show();
					$('#ca_CAPAV0020_view').find('tr.ca_condview').show();
				}
			});

			//////////////////////////
			// 設定済条件の表示
			this.condUpdateAll();
			// カタログの場合制限フラグによって編集可・不可を設定する
			if (this.anaProc.catalog != null) {
				var f_anacond = this.anaProc.catalog.f_anacond;
				if ((f_anacond & amcm_type.AMCM_VAL_ANACOND_STORE) == amcm_type.AMCM_VAL_ANACOND_STORE) {
					var th = $("#ca_CAPAV0020_view").find('th.ca_th_edit');
					$(th).removeClass('ca_th_edit');
					var span = $("#ca_CAPAV0020_view").find('span.edit');
					$(span).remove();
					var span = $("#ca_CAPAV0020_view").find('span.ca_title');
					$(th).removeClass('category');
					$(th).addClass('ca_th_disabled');
					$(span).addClass('ca_span_disabled');
				}
			}
		},

		// 組織階層
		navItemCACMV0020Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			var list = this.anaProc.getFocus1(this.filter_ORG);
			this.CACMV0020Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0020Selector.okProc = function(data) {
				if(data != null) {
					_this.anaProc.removeFocus1(_this.filter_ORG);
					_this.anaProc.pushFocus1(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0020',
						anafocus : _this.anaProc.getFocus1(_this.filter_ORG),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},
		// 店舗
		navItemCACMV0030Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			var list = this.anaProc.getFocus1(this.filter_STORE);
			this.CACMV0030Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0030Selector.okProc = function(data) {
				if(data != null) {
					_this.anaProc.removeFocus1(_this.filter_STORE);
					_this.anaProc.pushFocus1(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0030',
						anafocus : _this.anaProc.getFocus1(_this.filter_STORE),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},
		// 店舗属性
		navItemMDCMV0020Click: function(e){
//			alert('店舗属性');
			var _this = this;
			e.srcBackboneView.setActive();

			var list = this.anaProc.getFocus1(this.filter_STOREATTRs);
			this.MDCMV0020Selector.show(list);

			// サブ画面復帰後処理
			this.MDCMV0020Selector.okProc = function(data){
				if(data != null){
					_this.anaProc.removeFocus1(_this.filter_STOREATTRs);
					_this.anaProc.pushFocus1(data.anaFocus);
					_.extend(_this.anaProc.cond.dispopt, data.cond);
					_this.anaProc.fireAnaCondUpdated({
						id: 'ca_navItemMDCMV0020',
						anafocus: data.anaFocus,
						panelId: _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},
		// 店舗リスト
		navItemCACMV0040Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			var list = this.anaProc.getFocus1(this.filter_STORELIST);
			this.CACMV0040Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0040Selector.okProc = function(data) {
				if(data != null) {
					_this.anaProc.removeFocus1(_this.filter_STORELIST);
					_this.anaProc.pushFocus1(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0040',
						anafocus : _this.anaProc.getFocus1(_this.filter_STORELIST),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// すべての条件を更新する
		condUpdateAll: function() {
			// 組織階層
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0020',
				anafocus : this.anaProc.getFocus1(this.filter_ORG),
				panelId : this.panelId
			});
			// 店舗
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0030',
				anafocus : this.anaProc.getFocus1(this.filter_STORE),
				panelId : this.panelId
			});
			// 店舗属性
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV0020',
				anafocus : this.anaProc.getFocus1(this.filter_STOREATTRs),
				panelId : this.panelId
			});
			// 店舗リスト
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0040',
				anafocus : this.anaProc.getFocus1(this.filter_STORELIST),
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
			console.log('onCondUpdated');
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
			case 'ca_navItemMDCMV0020':
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
				var cond = anaproc.cond.dispopt;
				if (cond.exist_iymd) {
					html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '">';
					html_source += '<td width="200px">既存店基準日</td>';
					html_source += '<td colspan="2">' + clutil.dateFormat(cond.exist_iymd, 'yyyy/mm/dd') + '</td>';
					html_source += '</tr>';
				}
				if (cond.close_iymd) {
					html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '">';
					html_source += '<td width="200px">閉店基準日</td>';
					html_source += '<td colspan="2">' + clutil.dateFormat(cond.close_iymd, 'yyyy/mm/dd') + '</td>';
					html_source += '</tr>';
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
			}

			// 条件を表示
			console.log('html_source=' + html_source);
			$(html_source).insertAfter($('#' + tr_id));
		}
	});
});
