$(function() {

	//////////////////////////////////////////////
	// View
	MDPAV1020PanelView = Backbone.View.extend({
		id: 'ca_MDPAV1020_view',
		tagName: 'table',
		className: 'tree mrgb10',
		template: _.template(''
				+ '<tr id="ca_MDPAV1020_showbuttons">'
				+ '<th colspan="2"><span class="treeClose"></span>店舗</th>'
				+ '</tr>'),

		// 押下イベント
		events: {
		},

		filter_ORG : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ORG
		},
		filter_STORE : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_STORE
		},
		filter_STOREATTRs : _.map([
			amgbp_AnaDefs.AMGBA_DEFS_KIND_STOREATTR_CLOSED,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_NEWSTORE_LOGIC,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_STOREATTR_SMX,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_STORE_SORT,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_NEWSTORE_COND
		], function(anaKind){ return { kind: anaKind }; }),
		filter_STORELIST : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_STORELIST
		},
		filter_STOREATTRs_memb : _.map([
			amgbp_AnaDefs.AMGBA_DEFS_KIND_STOREATTR_SMX,
		], function(anaKind){ return { kind: anaKind }; }),

		panelId : 'MDPAV1020',

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			// 流入・流出分析の場合は店舗属性の表示を変更
			if (this.anaProc.func_code == "AMGAV2140") {
				this.filter_STOREATTRs = this.filter_STOREATTRs_memb;
			};

			// Lv2: 組織階層のメニューアイテム
			this.navMDCMV0170View = new AnaNaviItemView({
				title: '組織階層',
				tr : {id: 'ca_navItemMDCMV0170'}
			}).on('onNaviItemClick', this.navItemMDCMV0170Click);
			// Lv2: 店舗のメニューアイテム
			this.navMDCMV1030View = new AnaNaviItemView({
				title: '店舗',
				tr : {id: 'ca_navItemMDCMV1030'}
			}).on('onNaviItemClick', this.navItemMDCMV1030Click);

			// Lv2: 店舗属性のメニューアイテム
			this.navMDCMV1020View = new AnaNaviItemView({
				title: '店舗属性',
				tr : {id: 'ca_navItemMDCMV1020'}
			}).on('onNaviItemClick', this.navItemMDCMV1020Click);

			// Lv2: 店舗リストのメニューアイテム
			this.navMDCMV1040View = new AnaNaviItemView({
				title: '店舗リスト',
				tr : {id: 'ca_navItemMDCMV1040'}
			}).on('onNaviItemClick', this.navItemMDCMV1040Click);


			// -----------------------------
			// 各セレクタView

			// 組織選択画面
			this.MDCMV0170Selector = new MDCMV0170SelectorView({
				el : $('#ca_MDCMV0170_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});
			// 店舗選択画面
			this.MDCMV1030Selector = new MDCMV1030SelectorView({
				el			: $('#ca_MDCMV1030_dialog'),	// 配置場所
				$parentView	: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 店舗属性選択画面
			this.MDCMV1020Selector = new MDCMV1020SelectorView({
				el			: $('#ca_MDCMV1020_dialog'),	// 配置場所
				$parentView	: this.$parentView,
				anaProc		: this.anaProc
			});

			// 店舗リスト選択画面
			this.MDCMV1040Selector = new MDCMV1040SelectorView({
				el : $('#ca_MDCMV1040_dialog'),	// 配置場所
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
			$('#ca_MDPAV1020_view')
			.append(this.navMDCMV0170View.render().$el)
			.append(this.navMDCMV1030View.render().$el)
			.append(this.navMDCMV1020View.render().$el)
			.append(this.navMDCMV1040View.render().$el);

			this.MDCMV0170Selector.render();
			this.MDCMV1030Selector.render();
			this.MDCMV1020Selector.render();
			this.MDCMV1040Selector.render();

			this.initUIelement();

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);
			clutil.initUIelement(this.$el);

			// 店舗押下
			$("#ca_MDPAV1020_showbuttons").click(function(e){
				var tr_button = $(e.target).closest('tr');
				var span = $(tr_button).find('span');

				if ($(span).hasClass('treeClose')) {
					$(span).removeClass('treeClose');
					$(span).addClass('treeOpen');
					$('#ca_MDPAV1020_view').find('tr.ca_button').hide();
					$('#ca_MDPAV1020_view').find('tr.ca_condview').hide();
				} else {
					$(span).removeClass('treeOpen');
					$(span).addClass('treeClose');
					$('#ca_MDPAV1020_view').find('tr.ca_button').show();
					$('#ca_MDPAV1020_view').find('tr.ca_condview').show();
				}
			});

			//////////////////////////
			// 設定済条件の表示
			this.condUpdateAll();
			// カタログの場合制限フラグによって編集可・不可を設定する
			if (this.anaProc.catalog != null) {
				var f_anacond = this.anaProc.catalog.f_anacond;
				if ((f_anacond & amcm_type.AMCM_VAL_ANACOND_STORE) == amcm_type.AMCM_VAL_ANACOND_STORE) {
					var th = $("#ca_MDPAV1020_view").find('th.ca_th_edit');
					$(th).removeClass('ca_th_edit');
					var span = $("#ca_MDPAV1020_view").find('span.edit');
					$(span).remove();
					var span = $("#ca_MDPAV1020_view").find('span.ca_title');
					$(th).removeClass('category');
					$(th).addClass('ca_th_disabled');
					$(span).addClass('ca_span_disabled');
				}
			}
		},

		// 組織階層
		navItemMDCMV0170Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			var list = this.anaProc.getFocus1(this.filter_ORG);
			this.MDCMV0170Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV0170Selector.okProc = function(data) {
				if(data != null) {
					_this.anaProc.removeFocus1(_this.filter_ORG);
					_this.anaProc.pushFocus1(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV0170',
						anafocus : _this.anaProc.getFocus1(_this.filter_ORG),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 店舗
		navItemMDCMV1030Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			var list = this.anaProc.getFocus1(this.filter_STORE);
			this.MDCMV1030Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1030Selector.okProc = function(data) {
				if(data != null) {
					_this.anaProc.removeFocus1(_this.filter_STORE);
					_this.anaProc.pushFocus1(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1030',
						anafocus : _this.anaProc.getFocus1(_this.filter_STORE),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},
		// 店舗属性
		navItemMDCMV1020Click: function(e){
//			alert('店舗属性');
			var _this = this;
			e.srcBackboneView.setActive();

			var list = this.anaProc.getFocus1(this.filter_STOREATTRs);
			this.MDCMV1020Selector.show(list);

			// サブ画面復帰後処理
			this.MDCMV1020Selector.okProc = function(data){
				if(data != null){
					_this.anaProc.removeFocus1(_this.filter_STOREATTRs);
					_this.anaProc.pushFocus1(data.anaFocus);
					_.extend(_this.anaProc.cond, data.cond)
					_this.anaProc.fireAnaCondUpdated({
						id: 'ca_navItemMDCMV1020',
						anafocus: data.anaFocus,
						panelId: _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},
		// 店舗リスト
		navItemMDCMV1040Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			var list = this.anaProc.getFocus1(this.filter_STORELIST);
			this.MDCMV1040Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1040Selector.okProc = function(data) {
				if(data != null) {
					_this.anaProc.removeFocus1(_this.filter_STORELIST);
					_this.anaProc.pushFocus1(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1040',
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
				id : 'ca_navItemMDCMV0170',
				anafocus : this.anaProc.getFocus1(this.filter_ORG),
				panelId : this.panelId
			});
			// 店舗
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1030',
				anafocus : this.anaProc.getFocus1(this.filter_STORE),
				panelId : this.panelId
			});
			// 店舗属性
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1020',
				anafocus : this.anaProc.getFocus1(this.filter_STOREATTRs),
				panelId : this.panelId
			});
			// 店舗リスト
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1040',
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
			var _this = this;
			switch(tr_id){
			case 'ca_navItemMDCMV1020':
				for (var i = 0; i < anafocus.length; i++) {
					// 属性毎に<td>を作成する
					var focus_kind = anafocus[i];
					// 流入・流出分析はSMX店舗の絞込のみ
					if (_this.anaProc.func_code == "AMGAV2140") {
						if(focus_kind.kind != amgbp_AnaDefs.AMGBA_DEFS_KIND_STOREATTR_SMX) {
							continue;
						}
					}
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
				var cond = anaproc.cond;
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
