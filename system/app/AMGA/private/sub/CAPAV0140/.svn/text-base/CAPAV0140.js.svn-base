$(function() {
	//////////////////////////////////////////////
	// View
	CAPAV0140PanelView = Backbone.View.extend({
		id: 'ca_CAPAV0140_view',
		tagName: 'table',
		className: 'tree mrgb10',
		template: _.template(''
				+ '<tr id="ca_CAPAV0140_showbuttons">'
				+ '<th colspan="2" class="required"><span class="treeClose"></span><%- navTitleLabel %></th>'
				+ '</tr>'),

		// 押下イベント
		events: {
		},

		axisList: {},
		panelId : 'CAPAV0140',
		navTitleLabel: '軸',

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			var sideLabel = _.isEmpty(this.side) ? '' : this.side;

			// Lv2: 軸のメニューアイテム
			this.navItemView = new AnaNaviItemView({
				title: this.navTitleLabel,
				tr : {id: 'ca_navItemCACMV0380' + sideLabel}
			}).on('onNaviItemClick', this.navItemClick);

			// 軸選択画面
			this.CACMV0380Selector = new  CACMV0380SelectorView({
				el : $('#ca_CACMV0380' + sideLabel + '_dialog'),	// 配置場所
				isMDBascket: this.isMDBascket,	// MD商品分析のバスケット分析
				side: this.side,
				anaProc: this.anaProc
			});
			this.CACMV0380Selector.render(
					this.$parentView,
					this.anadata
			);

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
			this.$el.html(this.template(this));
			this.$view.append(this.$el);

			// 軸ボタン群
			this.$el
			.append(this.navItemView.render().$el);

			this.initUIelement();

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);
			clutil.initUIelement(this.$el);

			var _this = this;

			// 軸押下
			this.$("#ca_CAPAV0140_showbuttons").click(function(e){
				var tr_button = $(e.target).closest('tr');
				var span = $(tr_button).find('span');

				if ($(span).hasClass('treeClose')) {
					$(span).removeClass('treeClose');
					$(span).addClass('treeOpen');
					_this.$el.find('tr.ca_button').hide();
					_this.$el.find('tr.ca_condview').hide();
				} else {
					$(span).removeClass('treeOpen');
					$(span).addClass('treeClose');
					_this.$el.find('tr.ca_button').show();
					_this.$el.find('tr.ca_condview').show();
				}
			});

			//////////////////////////
			// 設定済条件の表示
			this.condUpdateAll();
			// カタログの場合制限フラグによって編集可・不可を設定する
			if (this.anaProc.catalog != null) {
				var f_anacond = this.anaProc.catalog.f_anacond;
				if ((f_anacond & amcm_type.AMCM_VAL_ANACOND_AXIS) == amcm_type.AMCM_VAL_ANACOND_AXIS) {
					var th = $("#ca_CAPAV0140_view").find('th.ca_th_edit');
					$(th).removeClass('ca_th_edit');
					var span = $("#ca_CAPAV0140_view").find('span.edit');
					$(span).remove();
					var span = $("#ca_CAPAV0140_view").find('span.ca_title');
					$(th).removeClass('category');
					$(th).addClass('ca_th_disabled');
					$(span).addClass('ca_span_disabled');
				}
			}
		},

		// 表示押下 - this.navItemView のクリックイベントに関連付けしている。
		navItemClick: function(e) {
			var _this = this;
			this.navItemView.setActive();

        	this.CACMV0380Selector.show(this.getModel());

			//サブ画面復帰後処理
        	this.CACMV0380Selector.okProc = _.bind(function(data) {
				if(data != null) {
					_this.setModel(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0380' + _this.side,
						anafocus : _this.getModel(),
						panelId : _this.panelId
					});
				}
				_this.navItemView.unsetActive();
			},this);
		},

		getModel: function(){
			if(this.anaProc){
				var cond = this.anaProc.cond;
				var vAxisListEx = cond.vAxisListEx == null ? new Array() : cond.vAxisListEx;
				return {
					vAxisListEx		: vAxisListEx,
					vfzerosuppress	: cond.vfzerosuppress,
					hAxisList		: cond.hAxisList,
					hfzerosuppress	: cond.hfzerosuppress,
//					disply			: cond.disply,
					fromtoList		: Ana.Util.dclone(cond.fromtoList),
					mdabc_type		: cond.extra.mdabc_type,
					basketList		: cond.basket_list,
				};
			}else{
				return this.axisList;
			}
		},
		setModel: function(dto){
			this.axisList = dto.axisFolder;
			if(this.anaProc){
				var fixedDto = Ana.Util.valuesToNumber(dto.axisFolder);
				var basketDto = Ana.Util.valuesToNumber(dto.basketFolder);
				var cond = this.anaProc.cond;
				// vAxisListの[1]か[2]にセットする→vAxisListだと拙いのでvAxisListExに変更
				if (cond.vAxisListEx == null) {
					cond.vAxisListEx = new Array();
				}
				if (this.side == 'basis') {
					cond.vAxisListEx[0] = fixedDto.vAxisList[0];
				} else if (this.side == 'alt') {
					cond.vAxisListEx[1] = fixedDto.vAxisList[0];
				}
				if (cond.basket_list == null) {
					cond.basket_list = new Array();
				}
				if (this.side == 'basis') {
					cond.basket_list[0] = basketDto;
				} else if (this.side == 'alt') {
					cond.basket_list[1] = basketDto;
				}
			}
		},

		// すべての条件を更新する
		condUpdateAll: function() {
			// 軸
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0380' + this.side,
				anafocus : this.getModel(),
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
			// 縦軸が空の場合はなにも表示しない
			if (!anafocus.vAxisListEx || anafocus.vAxisListEx.length == 0) {
				return;
			}
			// 'basis'なら[1],'alt'なら[2]を参照する
			var vAxis = null;
			var vName = "";
			var name2 = "";
			var axis_type = null;
			switch (this.side) {
			case "basis":
				if (!anafocus.vAxisListEx || anafocus.vAxisListEx.length < 1) {
					return;
				}
				vAxis = anafocus.vAxisListEx[0];
				vName = "基準";
				axis_type = 0;
				break;
			case "alt":
				if (!anafocus.vAxisListEx || anafocus.vAxisListEx.length < 2) {
					return;
				}
				vAxis = anafocus.vAxisListEx[1];
				vName = "比較";
				axis_type = 1;
				break;
			default:
				return;
			}
			if (vAxis && vAxis.name2) {
				name2 = vAxis.name2;
			}

			var html_source = '';

			// 軸毎に<td>を作成する
			html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
			html_source += vName;
			html_source += '</td>';
			html_source += '<td>';
			// 種別
			html_source += name2;
			if (vAxis && clutil.cStr(vAxis.name) != '') {
				// 属性
				html_source += ':' + vAxis.name;
			}
			// 選択した項目 TODO FIXME
			if (anafocus.basketList && axis_type != null && anafocus.basketList[axis_type]) {
				html_source += ':' + anafocus.basketList[axis_type].name;
			}

			html_source += '</td></tr>';

			// 条件を表示
			$(html_source).insertAfter($('#' + tr_id));
		}
	});
});
