$(function() {
	//////////////////////////////////////////////
	// View
	MDPAV0150PanelView = Backbone.View.extend({
		id: 'ca_MDPAV0150_view',
		tagName: 'table',
		className: 'tree mrgb10',
		template: _.template(''
				+ '<tr id="ca_MDPAV0150_showbuttons">'
				+ '<th colspan="2" class="required"><span class="treeClose"></span><%- navTitleLabel %></th>'
				+ '</tr>'),

		// 押下イベント
		events: {
		},

		axisList: {},
		panelId : 'MDPAV0150',
		navTitleLabel: '軸',

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			var sideLabel = _.isEmpty(this.side) ? '' : this.side;

			// Lv2: 軸のメニューアイテム
			this.navItemView = new AnaNaviItemView({
				title: this.navTitleLabel,
				tr : {id: 'ca_navItemMDCMV0150' + sideLabel}
			}).on('onNaviItemClick', this.navItemClick);

			// 軸選択画面
			this.MDCMV0150Selector = new  MDCMV0150SelectorView({
				el : $('#ca_MDCMV0150' + sideLabel + '_dialog'),	// 配置場所
				isMDBascket: this.isMDBascket,	// MD商品分析のバスケット分析
				side: this.side,
				anaProc: this.anaProc
			});
			this.MDCMV0150Selector.render(
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
			this.$("#ca_MDPAV0150_showbuttons").click(function(e){
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
					var th = $("#ca_MDPAV0150_view").find('th.ca_th_edit');
					$(th).removeClass('ca_th_edit');
					var span = $("#ca_MDPAV0150_view").find('span.edit');
					$(span).remove();
					var span = $("#ca_MDPAV0150_view").find('span.ca_title');
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

        	this.MDCMV0150Selector.show(this.getModel());

			//サブ画面復帰後処理
        	this.MDCMV0150Selector.okProc = _.bind(function(data) {
				if(data != null) {
					_this.setModel(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV0150' + _this.side,
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
				var vAxisListEx2 = cond.vAxisListEx2 == null ? new Array() : cond.vAxisListEx2;
				return {
					vAxisListEx		: vAxisListEx,
					vAxisListEx2	: vAxisListEx2,
					vfzerosuppress	: cond.vfzerosuppress,
					hAxisList		: cond.hAxisList,
					hfzerosuppress	: cond.hfzerosuppress,
//					disply			: cond.disply,
					fromtoList		: Ana.Util.dclone(cond.fromtoList),
					mdabc_type		: cond.extra.mdabc_type,
					basketList		: cond.basket_list,
					basketList2		: cond.basket_list2,
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
				if (cond.vAxisListEx2 == null) {
					cond.vAxisListEx2 = new Array();
				}
				if (this.side == 'basis') {
//					cond.vAxisListEx[0] = fixedDto.vAxisList[0];
//					cond.vAxisListEx[0] = fixedDto.vAxisList;
					cond.vAxisListEx = fixedDto.vAxisList;
				} else if (this.side == 'alt') {
//					cond.vAxisListEx[1] = fixedDto.vAxisList[0];
//					cond.vAxisListEx[1] = fixedDto.vAxisList;
					cond.vAxisListEx2 = fixedDto.vAxisList;
				}
				if (cond.basket_list == null) {
					cond.basket_list = new Array();
				}
				if (cond.basket_list2 == null) {
					cond.basket_list2 = new Array();
				}
				if (this.side == 'basis') {
//					cond.basket_list[0] = basketDto;
					cond.basket_list = basketDto;
				} else if (this.side == 'alt') {
//					cond.basket_list[1] = basketDto;
					cond.basket_list2 = basketDto;
				}
			}
		},

		// すべての条件を更新する
		condUpdateAll: function() {
			// 軸
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV0150' + this.side,
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
//			if (!anafocus.vAxisListEx || anafocus.vAxisListEx.length == 0) {
//				return;
//			}
			// vAxisListEx vAxisListEx2がどちらも空の場合はなにも表示しない
			if (anafocus.vAxisListEx.length == 0 && anafocus.vAxisListEx2.length == 0) {
				return;
			}
			// 'basis'なら[1],'alt'なら[2]を参照する
			var vAxis = [];
			var vName = "";
			var name2 = "";
			var axis_type = null;
			var basketList = [];
			switch (this.side) {
			case "basis":
				if (!anafocus.vAxisListEx || anafocus.vAxisListEx.length < 1) {
					return;
				}
//				vAxis = anafocus.vAxisListEx[0];
				vAxis = anafocus.vAxisListEx;
				vName = "基準";
//				basketList = anafocus.basketList[0];
				basketList = anafocus.basketList;
				axis_type = 0;
				break;
			case "alt":
				if (!anafocus.vAxisListEx2 || anafocus.vAxisListEx2.length < 1) {
					return;
				}
//				vAxis = anafocus.vAxisListEx[1];
				vAxis = anafocus.vAxisListEx2;
				vName = "比較";
//				basketList = anafocus.basketList[1];
				basketList = anafocus.basketList2;
				axis_type = 1;
				break;
			default:
				return;
			}
//			if (vAxis && vAxis.name2) {
//				name2 = vAxis.name2;
//			}

			var html_source = '';
			var num = 0

			for (i = 0; i < basketList.length; i++) {
				if (vAxis[num] && vAxis[num].name2) {
					name2 = vAxis[num].name2;
				}

				if (basketList[i].kind == amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_OP) {
					vName = basketList[i].name;
					num++;
					continue;
				}

				// 軸毎に<td>を作成する
				html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
				html_source += vName;
				html_source += '</td>';
				html_source += '<td>';
				// 種別
				html_source += name2;
				html_source += ':';
				if (vAxis && clutil.cStr(vAxis.name) != '') {
					// 属性
					html_source += ':' + vAxis.name;
				}

//				var focus_kind = basketList;
				var focus_source = '';

				focus_source += basketList[i].name;

				for (var j = i + 1; j < basketList.length; j++) {
					if (basketList[j].kind != amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_OP) {
						i++;
						focus_source += "," ;
						focus_source += basketList[i].name;
					} else {
						break;
					}
				}

				// 文字数制限
				if (focus_source.length > clcom.focusStr_max) {
					focus_source = focus_source.slice(0, clcom.focusStr_max);
					focus_source += '...';
				}


//				for (var j = 0; j < basketList[i].length; j++) {
//					var focus = basketList[i][j];
//					if (clutil.chkStr(focus.code)) {
//						focus_source += focus.code + ':';
//					}
//					focus_source += focus.name;
//
//					// 文字数制限
//					if (focus_source.length > clcom.focusStr_max) {
//						focus_source = focus_source.slice(0, clcom.focusStr_max);
//						focus_source += '...';
//						for (; j < basketList[i].length; j++) {
//							if (j != basketList[i].length-1 && basketList[i][j+1].kind == focus_kind[i].kind) {
//								// 次の異なる属性までjをインクリメントする
//								continue;
//							}
//							break;
//						}
////						i = j;
//						break;
//					}
//					// 次の属性が異なる場合はbreak;
//					if (j != basketList[i].length-1 && basketList[i][j+1].kind == focus_kind[i][j].kind) {
//						focus_source += ', ';
//					} else {
////						i = j;
//						break;
//					}
//				}
				html_source += focus_source;


				html_source += '</td></tr>';
			}

//一旦コメント
//			// 軸毎に<td>を作成する
//			html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
//			html_source += vName;
//			html_source += '</td>';
//			html_source += '<td>';
//			// 種別
//			html_source += name2;
//			html_source += ':';
//			if (vAxis && clutil.cStr(vAxis.name) != '') {
//				// 属性
//				html_source += ':' + vAxis.name;
//			}
//			// 選択した項目 TODO FIXME
////			if (anafocus.basketList && axis_type != null && anafocus.basketList[axis_type]) {
////				html_source += ':' + anafocus.basketList[axis_type].name;
////			}
//
//			for (var i = axis_type; i < anafocus.basketList.length; i++) {
//				// 属性毎に<td>を作成する
//				var focus_kind = anafocus.basketList[i];
////				html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
////				html_source += focus_kind.name2;
////				html_source += '</td>';
////				html_source += '<td>';
//				var focus_source = '';
//				for (var j = 0; j < anafocus.basketList[i].length; j++) {
//					var focus = anafocus.basketList[i][j];
//					if (clutil.chkStr(focus.code)) {
//						focus_source += focus.code + ':';
//					}
//					focus_source += focus.name;
//
//					// 文字数制限
//					if (focus_source.length > clcom.focusStr_max) {
//						focus_source = focus_source.slice(0, clcom.focusStr_max);
//						focus_source += '...';
//						for (; j < anafocus.basketList[i].length; j++) {
//							if (j != anafocus.basketList[i].length-1 && anafocus.basketList[i][j+1].kind == focus_kind[i].kind) {
//								// 次の異なる属性までjをインクリメントする
//								continue;
//							}
//							break;
//						}
////						i = j;
//						break;
//					}
//					// 次の属性が異なる場合はbreak;
//					if (j != anafocus.basketList[i].length-1 && anafocus.basketList[i][j+1].kind == focus_kind[i].kind) {
//						focus_source += ', ';
//					} else {
////						i = j;
//						break;
//					}
//				}
//				html_source += focus_source;
//
//
//				html_source += '</td></tr>';
//			}

			// 条件を表示
			$(html_source).insertAfter($('#' + tr_id));
		}
	});
});
