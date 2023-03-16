$(function() {
	//////////////////////////////////////////////
	// View
	CAPAV0060PanelView = Backbone.View.extend({
		id: 'ca_CAPAV0060_view',
		tagName: 'table',
		className: 'tree mrgb10',
		template: _.template(''
				+ '<tr id="ca_CAPAV0060_showbuttons">'
				+ '<th colspan="2" class="required"><span class="treeClose"></span>軸</th>'
				+ '</tr>'),

		// 押下イベント
		events: {
		},

		axisList: {},
		panelId : 'CAPAV0060',

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			// Lv2: 軸のメニューアイテム
			this.navItemView = new AnaNaviItemView({
				title: '軸',
				tr : {id: 'ca_navItemCACMV0180'}
			}).on('onNaviItemClick', this.navItemClick);

			// 軸選択画面
			this.CACMV0180Selector = new  CACMV0180SelectorView({
				el : $('#ca_CACMV0180_dialog'),	// 配置場所
				isMDBascket: this.isMDBascket,	// MD商品分析のバスケット分析
				isMDRcpt: this.isMDRcpt,		// MD商品分析の併売分析
				anaProc: this.anaProc
			});
			this.CACMV0180Selector.render(
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
			this.$el.html(this.template());
			this.$view.append(this.$el);

			// 軸ボタン群
			$('#ca_CAPAV0060_view')
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
			$("#ca_CAPAV0060_showbuttons").click(function(e){
				var tr_button = $(e.target).closest('tr');
				var span = $(tr_button).find('span');

				if ($(span).hasClass('treeClose')) {
					$(span).removeClass('treeClose');
					$(span).addClass('treeOpen');
					$('#ca_CAPAV0060_view').find('tr.ca_button').hide();
					$('#ca_CAPAV0060_view').find('tr.ca_condview').hide();
				} else {
					$(span).removeClass('treeOpen');
					$(span).addClass('treeClose');
					$('#ca_CAPAV0060_view').find('tr.ca_button').show();
					$('#ca_CAPAV0060_view').find('tr.ca_condview').show();
				}
			});

			//////////////////////////
			// 設定済条件の表示
			this.condUpdateAll();
			// カタログの場合制限フラグによって編集可・不可を設定する
			if (this.anaProc.catalog != null) {
				var f_anacond = this.anaProc.catalog.f_anacond;
				if ((f_anacond & amcm_type.AMCM_VAL_ANACOND_AXIS) == amcm_type.AMCM_VAL_ANACOND_AXIS) {
					var th = $("#ca_CAPAV0060_view").find('th.ca_th_edit');
					$(th).removeClass('ca_th_edit');
					var span = $("#ca_CAPAV0060_view").find('span.edit');
					$(span).remove();
					var span = $("#ca_CAPAV0060_view").find('span.ca_title');
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

        	this.CACMV0180Selector.show(this.getModel());

			//サブ画面復帰後処理
        	this.CACMV0180Selector.okProc = _.bind(function(data) {
				if(data != null) {
					_this.setModel(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0180',
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
				return {
					vAxisList		: cond.vAxisList,
					vfzerosuppress	: cond.vfzerosuppress,
					hAxisList		: cond.hAxisList,
					hfzerosuppress	: cond.hfzerosuppress,
//					disply			: cond.disply,
					fromtoList		: Ana.Util.dclone(cond.fromtoList),
					mdabc_type		: cond.extra.mdabc_type,
					mstitemList		: cond.mstitem_list,
				};
			}else{
				return this.axisList;
			}
		},
		setModel: function(dto){
			this.axisList = dto.axisFolder;
			if(this.anaProc){
				var fixedDto = Ana.Util.valuesToNumber(dto.axisFolder);
				var mstitemDto = Ana.Util.valuesToNumber(dto.mstitemFolder);
				var cond = this.anaProc.cond;
				cond.vAxisList = fixedDto.vAxisList;
				cond.vfzerosuppress = fixedDto.vfzerosuppress;
				cond.hAxisList = fixedDto.hAxisList;
				cond.hfzerosuppress = fixedDto.hfzerosuppress;
//				cond.disply = fixedDto.disply;
				cond.fromtoList = fixedDto.fromtoList;
				cond.extra.mdabc_type = fixedDto.mdabc_type;
				cond.mstitem_list = mstitemDto;
			}
		},

		// すべての条件を更新する
		condUpdateAll: function() {
			// 軸
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0180',
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
			if (!anafocus.vAxisList || anafocus.vAxisList.length == 0) {
				return;
			}

			var html_source = '';

			// 軸毎に<td>を作成する

			// 縦軸
			for (var i = 0; i < anafocus.vAxisList.length; i++) {
				// 属性毎に<td>を作成する
				var vAxis = anafocus.vAxisList[i];
				var nAxis = i + 1;
				var axis_type = 'v' + nAxis;
				html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
				html_source += '縦軸' + nAxis;
				html_source += '</td>';
				html_source += '<td>';
				// 種別
				html_source += vAxis.name2;
				if (clutil.cStr(vAxis.name) != '') {
					// 属性
					html_source += ':' + vAxis.name;
				}
				if (anafocus.mstitemList && anafocus.mstitemList[axis_type]) {
					var mstitem_name = "";
					_.each(anafocus.mstitemList[axis_type], _.bind(function(dto, index) {
						if (index > 0) {
							mstitem_name += ",";
						}
						mstitem_name += dto.name;
					}, this));
					html_source += ':' + mstitem_name;
				}

				html_source += '</td></tr>';
			}
			// MD商品分析 - ABC分析基準
			if(Ana.Config.cond.CACMV0180.isMDABCAxis && anafocus.mdabc_type){
				var typlabel = "";
				switch(anafocus.mdabc_type){
				case amanp_AnaHead.AMANP_ANA_REQ_ABC_TYPE_QY:
					typlabel = '売上数';
					break;
				case amanp_AnaHead.AMANP_ANA_REQ_ABC_TYPE_AM:
					typlabel = '売上高';
					break;
				case amanp_AnaHead.AMANP_ANA_REQ_ABC_TYPE_SUPPORT_RT:
					typlabel = '支持率(選択期間内)';
					break;
				case amanp_AnaHead.AMANP_ANA_REQ_ABC_TYPE_SUPPORT_RT_CM:
					typlabel = '支持率(累計)';
					break;
				}
				if(!_.isEmpty(typlabel)){
					html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
					html_source += 'ABC分析基準';
					html_source += '</td>';
					html_source += '<td>';
					html_source += typlabel;
					html_source += '</td></tr>';
				}else{
					console.warn('Unknown abc_type[' + anafocus.mdabc_type + ']');
				}
			}
			// 縦軸 項目0
			html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td colspan="2">';
			html_source += 'すべての項目が0の場合、明細列を表示';
			html_source += anafocus.vfzerosuppress ? 'しない' : 'する';
			html_source += '</td></tr>';

			// 横軸が空の場合はなにも表示しない
			if (anafocus.hAxisList && anafocus.hAxisList.length > 0) {
				for (var i = 0; i < anafocus.hAxisList.length; i++) {
					// 属性毎に<td>を作成する
					var hAxis = anafocus.hAxisList[i];
					var nAxis = i + 1;
					html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
					html_source += '横軸' + nAxis;
					html_source += '</td>';
					html_source += '<td>';
					// 種別
					html_source += hAxis.name2;
					if (clutil.cStr(hAxis.name) != '') {
						// 属性
						html_source += ':' + hAxis.name;
					}

					html_source += '</td></tr>';
				}
				// 横軸 項目0
				html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td colspan="2">';
				html_source += 'すべての項目が0の場合、明細列を表示';
				html_source += anafocus.hfzerosuppress ? 'しない' : 'する';
				html_source += '</td></tr>';
			}

			// 条件を表示
			$(html_source).insertAfter($('#' + tr_id));
		}
	});
});
