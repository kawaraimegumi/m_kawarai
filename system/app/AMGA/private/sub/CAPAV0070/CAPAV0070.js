$(function() {
	//////////////////////////////////////////////
	// View
	CAPAV0070PanelView = Backbone.View.extend({
		id: 'ca_CAPAV0070_view',
		tagName: 'table',
		className: 'tree mrgb10',
		template: _.template(''
				+ '<tr id="ca_CAPAV0070_showbuttons">'
				+ '<th colspan="2" class="required"><span class="treeClose"></span>表示項目</th>'
				+ '</tr>'),

		// 押下イベント
		events: {
		},

		// 設定条件表示用オブジェクト
		CACMV0210dispname : {
			disp_way : {name : '表示項目並び', val1 : '縦並び', val2 : '横並び', val3 : '横並び（表示項目集約）'},
			f_total : {name : '合計表示', val1 : 'あり', val0 : 'なし'},
			f_subtotal : {name : '小計表示', val1 : 'あり', val2 : 'なし'},
			existsum : {name : '既存店集計', val1 : 'する', val2 : 'しない'},
			exist_iymd : {name : '既存店基準日'},
			disp_amunit : {name : '表示単位', val1 : '円単位', val2 : '千単位', val3 : '万単位'},
			sizesum : {name : 'サイズ名で集約', val1 : 'あり', val2 : 'なし'},
		},
		// モデルオブジェクト
		dispitemList: {},
		panelId : 'CAPAV0070',

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			// 既存店集計UI：要/不要
			if(Ana.Config.cond.CACMV0210.existsum == 'unused'){
				// 設定条件表示用オブジェクトで不要なものを削り取る
				delete this.CACMV0210dispname.existsum;
				delete this.CACMV0210dispname.exist_iymd;
			}
            // 自由分析以外はサイズ名集約なし
            if(this.anaProc.func_code != 'AMGAV0100'){
				delete this.CACMV0210dispname.sizesum;
            }

			// Lv2: 表示項目のメニューアイテム
			this.navCACMV0190View = new AnaNaviItemView({
				title: '表示項目',
				tr : {id: 'ca_navItemCACMV0190'}
			}).on('onNaviItemClick', this.navItemCACMV0190Click);

			// Lv2: 表示設定のメニューアイテム
			this.navCACMV0210View = new AnaNaviItemView({
				title: '表示設定',
				tr : {id: 'ca_navItemCACMV0210'}
			}).on('onNaviItemClick', this.navItemCACMV0210Click);

			// 表示項目選択画面
			this.CACMV0190Selector = new CACMV0190SelectorView({
				el : $('#ca_CACMV0190_dialog'),	// 配置場所
				$parentView		: this.$parentView,
				anadata			: this.anadata,
				anaProc			: this.anaProc
			});

			// 表示設定画面
			this.CACMV0210Selector = new CACMV0210SelectorView({
				el : $('#ca_CACMV0210_dialog'),	// 配置場所
				$parentView		: this.$parentView,
				anadata			: this.anadata,
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

			// 表示項目ボタン群
			var $190el = this.navCACMV0190View.render().$el;
			if(Ana.Config.cond.CACMV0190.display === false){
				$190el.hide();
			}
			var $210el = this.navCACMV0210View.render().$el;
			$('#ca_CAPAV0070_view').append($190el).append($210el);

            this.CACMV0190Selector.render();
            this.CACMV0210Selector.render();

			this.initUIelement();

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);
			clutil.initUIelement(this.$el);

			var _this = this;

			// 表示項目押下
			$("#ca_CAPAV0070_showbuttons").click(function(e){
				var tr_button = $(e.target).closest('tr');
				var span = $(tr_button).find('span');

				if ($(span).hasClass('treeClose')) {
					$(span).removeClass('treeClose');
					$(span).addClass('treeOpen');
					$('#ca_CAPAV0070_view').find('tr.ca_button').hide();
					$('#ca_CAPAV0070_view').find('tr.ca_condview').hide();
				} else {
					$(span).removeClass('treeOpen');
					$(span).addClass('treeClose');
					$('#ca_CAPAV0070_view').find('tr.ca_button').show();
					$('#ca_CAPAV0070_view').find('tr.ca_condview').show();
				}
			});

			//////////////////////////
			// 設定済条件の表示
			this.condUpdateAll();
			// カタログの場合制限フラグによって編集可・不可を設定する
			if (this.anaProc.catalog != null) {
				var f_anacond = this.anaProc.catalog.f_anacond;
				if ((f_anacond & amcm_type.AMCM_VAL_ANACOND_DISP) == amcm_type.AMCM_VAL_ANACOND_DISP) {
					var th = $("#ca_CAPAV0070_view").find('th.ca_th_edit');
					$(th).removeClass('ca_th_edit');
					var span = $("#ca_CAPAV0070_view").find('span.edit');
					$(span).remove();
					var span = $("#ca_CAPAV0070_view").find('span.ca_title');
					$(th).removeClass('category');
					$(th).addClass('ca_th_disabled');
					$(span).addClass('ca_span_disabled');
				}
			}
		},

		// 表示押下 - this.navCACMV0190View のクリックイベントに関連付けしている。
		navItemCACMV0190Click: function(e) {
			var _this = this;
			this.navCACMV0190View.setActive();

			this.CACMV0190Selector.show(this.anaProc.cond.dispitemlist);

			//サブ画面復帰後処理
			this.CACMV0190Selector.okProc = _.bind(function(data) {
				if(data != null) {
					var cond = _this.anaProc.cond;
					cond.dispitemlist = Ana.Util.valuesToNumber(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0190',
						anafocus : _this.anaProc.cond.dispitemlist,
						panelId : _this.panelId
					});
				}
				_this.navCACMV0190View.unsetActive();
			},this);
		},

//		getCACMV0190Model: function(){
//			if(this.anaProc){
//				return {
//					disp			: this.anaProc.cond.dispopt,
//					dispitemList	: this.anaProc.cond.dispitemlist
//					// TODO: ソート条件をわすれず！
//				};
//			}else{
//				return this.dispitemList;
//			}
//		},
//
//		setCACMV0190Model: function(dto){
//			if(this.anaProc){
//				var cond = this.anaProc.cond;
//				cond.dispopt = Ana.Util.valuesToNumber(dto.disp);
//				cond.dispitemlist = Ana.Util.valuesToNumber(dto.dispitemList);
//			}else{
//				this.dispitemList = dto;
//			}
//		}

		// 表示設定押下
		navItemCACMV0210Click: function(e) {
			var _this = this;
			this.navCACMV0210View.setActive();

			this.CACMV0210Selector.show(this.getCACMV0210Model());

			//サブ画面復帰後処理
			this.CACMV0210Selector.okProc = _.bind(function(data) {
				if(data != null) {
					_this.setCACMV0210Model(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0210',
						anafocus : _this.getCACMV0210Model(),
						panelId : _this.panelId
					});
				}
				this.navCACMV0210View.unsetActive();
			},this);
		},

		getCACMV0210Model: function(){
			if(this.anaProc){
				var dispopt = this.anaProc.cond.dispopt;
				return dispopt;
			}else{
				return this.dispopt;
			}
		},

		setCACMV0210Model: function(dto){
			this.dispopt = dto;
			if(this.anaProc){
				var cond = this.anaProc.cond;
				cond.dispopt = Ana.Util.valuesToNumber(dto);
			}
		},

		// すべての条件を更新する
		condUpdateAll: function() {
			// 表示項目
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0190',
				anafocus : this.anaProc.cond.dispitemlist,
				panelId : this.panelId
			});
			// 表示設定
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0210',
				anafocus : this.getCACMV0210Model(),
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
			var exist_iymd_source = '';
			switch(tr_id){
			case 'ca_navItemCACMV0210':
				var _this = this;
				// 表示設定
				$.each(anafocus, function(key, value) {
					var dispname = _this.CACMV0210dispname[key];

					// 既存店基準日は既存店集計するときのみ
					if (dispname && key == 'exist_iymd') {
						if (anafocus.existsum != null && Number(anafocus.existsum) == 1) {
							exist_iymd_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
							exist_iymd_source += dispname.name;
							exist_iymd_source += '</td>';
							exist_iymd_source += '<td>';
							exist_iymd_source += clutil.dateFormat(value, 'yyyy/mm/dd');
							exist_iymd_source += '</td></tr>';
						}
					} else if (dispname) {
						html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
						html_source += dispname.name;
						html_source += '</td>';
						html_source += '<td>';
						html_source += dispname['val' + value];
						html_source += '</td></tr>';
						// 既存店基準日は既存店集計の後に追加
						if (key == 'existsum') {
							html_source += exist_iymd_source;
						}
					}
				});
				break;
			default:
				if(Ana.Config.cond.CACMV0190.display === false){
					break;
				}
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
