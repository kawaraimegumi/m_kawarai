$(function() {
	
	//////////////////////////////////////////////
	// View
	CAPAV0100PanelView = Backbone.View.extend({
		// 押下イベント
		events: {
		},
		// 設定条件表示用オブジェクト
		CACMV0100dispname : {
			sale_am : {name : '購入金額', unit : '円'},
			sale_qy : {name : '購入点数', unit : '点'},
			prof_am : {name : '経準高', unit : '円'},
			prof_rt : {name : '経準率', unit : '％'},
			coming_count : {name : '来店回数', unit : '回'},
			coming_days : {name : '来店日数', unit : '日'},
			num : {name : '抽出人数（上位）', unit : '人'}
		},
		
		panelId : 'CAPAV0100',

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			this.panel = '<table class="tree mrgb10" id="ca_CAPAV0100_view">' +
							'<tr id="ca_CAPAV0100_showbuttons"><th colspan="2" class="required"><span class="treeClose"></span>購買</th></tr>' +
						 '</table>';

			// Lv2: 購買抽出条件のメニューアイテム
			this.navCACMV0230View = new AnaNaviItemView({
				title: '購買抽出条件',
				tr : {id: 'ca_navItemCACMV0230'}
			}).on('onNaviItemClick', this.navItemCACMV0230Click);

			// -----------------------------
			// 各セレクタView
			
			// 購買抽出条件選択画面
			this.CACMV0230Selector = new CACMV0230SelectorView({
				el 				: $('#ca_CACMV0230_dialog'),	// 配置場所
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
			$('#ca_CAPAV0100_view')
			.append(this.navCACMV0230View.render().$el);
		
			this.CACMV0230Selector.render();

			this.initUIelement();

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);
			clutil.initUIelement(this.$el);
			
			var _this = this;

			// DM企画押下
			$("#ca_CAPAV0100_showbuttons").click(function(e){
				var tr_button = $(e.target).closest('tr');
				var span = $(tr_button).find('span');
				
				if ($(span).hasClass('treeClose')) {
					$(span).removeClass('treeClose');
					$(span).addClass('treeOpen');
					$('#ca_CAPAV0100_view').find('tr.ca_button').hide();
					$('#ca_CAPAV0100_view').find('tr.ca_condview').hide();
				} else {
					$(span).removeClass('treeOpen');
					$(span).addClass('treeClose');
					$('#ca_CAPAV0100_view').find('tr.ca_button').show();
					$('#ca_CAPAV0100_view').find('tr.ca_condview').show();
				}
			});
			//////////////////////////	
			// 設定済条件の表示
			this.condUpdateAll();
		},

		// 購買抽出条件
		navItemCACMV0230Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			this.CACMV0230Selector.show(this.anaProc.cond.anabuyingcond);

			//サブ画面復帰後処理
			this.CACMV0230Selector.okProc = function(data) {
				if(data != null) {
					var cond = _this.anaProc.cond;
					cond.anabuyingcond = data;
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0230',
						anafocus : _this.anaProc.cond.anabuyingcond,
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// すべての条件を更新する
		condUpdateAll: function() {
			// 購買抽出条件
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0230',
				anafocus : this.anaProc.cond.anabuyingcond,
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
			var _this = this;
			$.each(anafocus, function(key, value) {
				var dispname = _this.CACMV0100dispname[key];
				if (key == 'num' && (clutil.pInt(value) != 0) && dispname) {
					html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
					html_source += dispname.name;
					html_source += '</td>';
					html_source += '<td>';
					html_source += clutil.comma(value) + dispname.unit;
					html_source += '</td></tr>';
				} else if (dispname && (clutil.pInt(value.from) != 0) || (clutil.pInt(value.to) != 0)) {
					html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
					html_source += dispname.name;
					html_source += '</td>';
					html_source += '<td>';
					html_source += clutil.comma(value.from) + '～' + clutil.comma(value.to) + dispname.unit;
					html_source += '</td></tr>';
				}
			});
			html_source += '</td></tr>';
			// 条件を表示
			$(html_source).insertAfter($('#' + tr_id));
		}
	});
	
	//////////////////////////////////////////////
	// 結果View
	CAPAV0100ResultView = Backbone.View.extend({
		// 押下イベント
		events: {
		},

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);
		},

		/**
		 * 画面描写
		 */
		render: function() {
			return this;
		},

		// 初期データ取得後に呼ばれる関数
		showResultView: function(result) {
			var memblist = result.memblist;
			var anaBuying = result.anaBuyingRsp;
			
			$('#ca_anagridview').hide();
			this.$tbody.empty();
			this.$el.show();
			
			// 会員数
			anaBuying.elem_num_disp = clutil.comma(memblist.elem_num);
			// 表示用に変換
			anaBuying.sale_am_disp = clutil.comma(anaBuying.sale_am);
			anaBuying.sale_qy_disp = clutil.comma(anaBuying.sale_qy);
			anaBuying.prof_am_disp = clutil.comma(anaBuying.prof_am);
			
			// 少数点位置に合わせて四捨五入する
			var val = anaBuying.prof_rt*100;
			var pow = Math.pow(10, 1);
			val = val * pow;
			val = Math.round(val) / pow;
			val = val.toFixed(1);
			anaBuying.prof_rt_disp = clutil.comma(val);
			
			anaBuying.coming_count_disp = clutil.comma(anaBuying.coming_count);
			anaBuying.coming_days_disp = clutil.comma(anaBuying.coming_days);
			
			(this.$tbody_tmp).tmpl(anaBuying).appendTo(this.$tbody);
			clutil.initUIelement(this.$tbl);
		}
	});
});	
