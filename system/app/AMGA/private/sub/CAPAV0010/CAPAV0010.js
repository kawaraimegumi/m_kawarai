$(function() {

	//////////////////////////////////////////////
	// View
	CAPAV0010PanelView = Backbone.View.extend({
		id: 'ca_CAPAV0010_view',
		tagName: 'table',
		className: 'tree mrgb10',
		template: _.template(''
				+ '<tr id="ca_CAPAV0010_showbuttons">'
				+ '<th colspan="3" class="required"><span class="treeClose"></span>期間</th>'
				+ '</tr>'),

		// 押下イベント
		events: {
		},

		// 設定条件表示用オブジェクト
		CACMV0010dispname : {
			q_type2type : {1 : 2, 2 : 9, 3 : 3, 4 : 2, 5 : 9, 6 : 3},
			type : {2 : '月単位', 9 : '週単位', 3 : '日単位'}
		},
		CACMV0011dispname : {
			wdayFocuses : {name : '曜日', 1 : '月曜日', 2 : '火曜日', 3: '水曜日', 4 : '木曜日',
				5 : '金曜日', 6 : '土曜日', 7 : '日曜日', 9 : '祝日'},
			spymdFocuses : {name : '特定日', name2 : '日'},
			holidayFocus : {name : '祝日', 1 : '含む', 0 : '除く'},
			tzFocus : {name : '時間帯'},
			anaDate : {srchiymd : 'マスタ検索日', org_srchiymd : '店舗検索日',
				itgrp_srchiymd : '商品検索日', memb_srchiymd : '会員検索日'},
			lyLogicFocus : {name : '前年度ロジック', 1 : '前年同日', 2 : '前年同曜日'}
		},

		CACMV0010Dto		: [],	// AnaPeriod プロトコル型と同じイメージで。[0]対象期、[1]比較期
		CACMV0011Dto		: {
			// マスタ検索日
			anaDate: function(){
				var opedt = clcom.getOpeDate();
				var f_srchiymd_type = amanp_AnaHead.AMANP_ANA_REQ_F_SRCHIYMD_TYPE_COM;
				return {
					f_srchiymd_type: f_srchiymd_type,	// 検索日タイプ
					srchiymd: opedt,		// マスタ検索日
					org_srchiymd: opedt,	// 組織マスタ検索日
					itgrp_srchiymd: opedt,	// 商品分類マスタ検索日
					memb_srchiymd: opedt	// 会員マスタ検索日
				};
			}(),
			wdayFocuses: [],		// 曜日
			spymdFocuses: [],		// 特定日
			holidayFocus: {			// 祝日
				kind: amanp_AnaDefs.AMAN_DEFS_KIND_HOLIDAY,
				val: 1
			},
			tzFocus: {				// 時間帯
				enable: false,		// AnaFocus拡張：true:時間帯指定が有効、false:時間帯指定が無効（終日）
				kind: amanp_AnaDefs.AMAN_DEFS_KIND_TIMEPERIOD,
				val: 900,
				val2: 2200
			}
		},

		panelId : 'CAPAV0010',

		initialize: function(opt) {
			var defaults = {
				fCompPeriod: false	// 比較期間表示フラグ
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);

			// -----------------------------
			// ナビゲーションメニュー

			// Lv2: 期間
			this.navCACMV0010View = new AnaNaviItemView({
				title: '期間',
				tr : {id: 'ca_navItemCACMV0010'}
			}).on('onNaviItemClick', this.navItemCACMV0010Click);

			// Lv2: 期間詳細
			this.navCACMV0011View = new AnaNaviItemView({
				title: '期間詳細',
				tr : {id: 'ca_navItemCACMV0011'}
			}).on('onNaviItemClick', this.navItemCACMV0011Click);


			// -----------------------------
			// 各セレクタView

			// 期間詳細設定画面
			this.CACMV0010Selector = new  CACMV0010SelectorView({
				el : $('#ca_CACMV0010_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
//				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc,
				anadata			: this.anadata,
				fCompPeriod		: this.fCompPeriod	// 比較期間表示フラグ
			});

			// マスタ検索日設定画面
			this.CACMV0011Selector = new  CACMV0011SelectorView({
				el : $('#ca_CACMV0011_dialog')	// 配置場所
			});

			// -----------------------------
			// イベントハンドリング
			if(this.anaProc){
				this.anaProc.on('onCondReset', this.onCondReset);		// 「条件をクリア」イベントを捕捉する
				this.anaProc.on('onCondUpdated', this.onCondUpdated);	// 「確定」イベントを捕捉する
			}

			// 設定済条件の表示
		},

		/**
		 * 画面描写
		 */
		render: function() {
			this.$el.html(this.template());
			this.$view.append(this.$el);

			// 期間ボタン群
			$('#ca_CAPAV0010_view')
				.append(this.navCACMV0010View.render().$el)
				.append(this.navCACMV0011View.render().$el);

			// 期間詳細設定画面
			this.CACMV0010Selector.render();

			// マスタ検索日設定画面
			this.CACMV0011Selector.render(
					this.$parentView,
					this.anadata
			);

			this.initUIelement();

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);
			clutil.initUIelement(this.$el);

			var _this = this;

			// 期間押下
			$("#ca_CAPAV0010_showbuttons").click(function(e){
				var tr_button = $(e.target).closest('tr');
				var span = $(tr_button).find('span');

				if ($(span).hasClass('treeClose')) {
					$(span).removeClass('treeClose');
					$(span).addClass('treeOpen');
					$('#ca_CAPAV0010_view').find('tr.ca_button').hide();
					$('#ca_CAPAV0010_view').find('tr.ca_condview').hide();
				} else {
					$(span).removeClass('treeOpen');
					$(span).addClass('treeClose');
					$('#ca_CAPAV0010_view').find('tr.ca_button').show();
					$('#ca_CAPAV0010_view').find('tr.ca_condview').show();
				}
			});

			//////////////////////////
			// 設定済条件の表示
			this.condUpdateAll();
			// カタログの場合制限フラグによって編集可・不可を設定する
			if (this.anaProc.catalog != null) {
				var f_anacond = this.anaProc.catalog.f_anacond;
				if ((f_anacond & amcm_type.AMCM_VAL_ANACOND_PERIOD) == amcm_type.AMCM_VAL_ANACOND_PERIOD) {
					var th = $("#ca_CAPAV0010_view").find('th.ca_th_edit');
					$(th).removeClass('ca_th_edit');
					var span = $("#ca_CAPAV0010_view").find('span.edit');
					$(span).remove();
					var span = $("#ca_CAPAV0010_view").find('span.ca_title');
					$(th).removeClass('category');
					$(th).addClass('ca_th_disabled');
					$(span).addClass('ca_span_disabled');
				}
			}
		},

		// 期間
		navItemCACMV0010Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			var periodDto = (this.anaProc) ? this.anaProc.cond.anaPeriods : this.CACMV0010Dto;
			this.CACMV0010Selector.show(periodDto, null);

			//サブ画面復帰後処理
			this.CACMV0010Selector.okProc = _.bind(function(data) {
				if(data != null) {
					_this.CACMV0010Dto = data;
					if (_this.anaProc) {
						_this.anaProc.cond.anaPeriods = data;
						_this.anaProc.fireAnaCondUpdated({
							id : 'ca_navItemCACMV0010',
							anafocus : _this.anaProc.cond.anaPeriods,
							panelId : _this.panelId
						});
					}
				}
				// ボタンにフォーカスする
				$(e.target).focus();
				e.srcBackboneView.unsetActive();
			},this);
		},

		// 期間詳細
		navItemCACMV0011Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			// anaProc からデータ取得してリストを渡す
			var dto = this.buildCACMV0011Dto(this.anaProc);
			if(_.isNull(dto)){
				dto = this.CACMV0011Dto;
			}
			this.CACMV0011Selector.show(dto);

			//サブ画面復帰後処理
			this.CACMV0011Selector.okProc = function(data) {
				if(data != null) {
					_this.CACMV0011Dto = data;
					var anaProc = _this.anaProc;
					if(anaProc){
						var optfocus = { kind: 0 };

						// 曜日
						optfocus.kind = amanp_AnaDefs.AMAN_DEFS_KIND_WDAY;
						anaProc.removeFocus1(optfocus);
						if(_.isArray(data.wdayFocuses) && data.wdayFocuses.length > 0){
							anaProc.pushFocus1(data.wdayFocuses);
						}

						// 特定日
						optfocus.kind = amanp_AnaDefs.AMAN_DEFS_KIND_SPYMD;
						anaProc.removeFocus1(optfocus);
						if(_.isArray(data.spymdFocuses) && data.spymdFocuses.length > 0){
							anaProc.pushFocus1(data.spymdFocuses);
						}

						// 祝日
						optfocus.kind = amanp_AnaDefs.AMAN_DEFS_KIND_HOLIDAY;
						anaProc.removeFocus1(optfocus);
						if(data.holidayFocus){
							anaProc.pushFocus1(data.holidayFocus);
						}

						// 時間帯
						optfocus.kind = amanp_AnaDefs.AMAN_DEFS_KIND_TIMEPERIOD;
						anaProc.removeFocus1(optfocus);
						if(data.tzFocus){
							anaProc.pushFocus1(data.tzFocus);
						}

						// マスタ検索日
						anaProc.cond.mstsrchdate = data.anaDate;

						// 前年度ロジック
						optfocus.kind = amanp_AnaDefs.AMAN_DEFS_KIND_LYLOGIC;
						anaProc.removeFocus1(optfocus);
						if(data.lyLogic){
							anaProc.pushFocus1(data.lyLogic);
						}

						// 変更通知
						_this.anaProc.fireAnaCondUpdated({
							id : 'ca_navItemCACMV0011',
							anafocus : _this.buildCACMV0011Dto(_this.anaProc),
							panelId : _this.panelId
						});
					}
				}
				// ボタンにフォーカスする
				$(e.target).focus();
				e.srcBackboneView.unsetActive();
			}
		},

		buildCACMV0011Dto: function(anaProc){
			if(!anaProc){
				return null;
			}
			// 曜日[N]: kind=amanp_AnaDefs.AMAN_DEFS_KIND_WDAY
			var wdayFocuses = anaProc.getFocus1({kind: amanp_AnaDefs.AMAN_DEFS_KIND_WDAY});

			// 特定日[N]: kind=amanp_AnaDefs.AMAN_DEFS_KIND_SPYMD
			var spymdFocuses = anaProc.getFocus1({kind: amanp_AnaDefs.AMAN_DEFS_KIND_SPYMD});

			// 祝日[1]: kind=amanp_AnaDefs.AMAN_DEFS_KIND_HOLIDAY
			var holidayFocuses = anaProc.getFocus1({kind: amanp_AnaDefs.AMAN_DEFS_KIND_HOLIDAY});

			// 時間帯[1]: kind=amanp_AnaDefs.AMAN_DEFS_KIND_TIMEPERIOD
			var tzFocuses = anaProc.getFocus1({kind: amanp_AnaDefs.AMAN_DEFS_KIND_TIMEPERIOD});

			// 前年度ロジック
			var lyLogicFocuses = anaProc.getFocus1({kind: amanp_AnaDefs.AMAN_DEFS_KIND_LYLOGIC});

			return {
				// 曜日
				wdayFocuses: wdayFocuses,

				// 祝日
				holidayFocus: _.first(holidayFocuses),

				// 特定日
				spymdFocuses: spymdFocuses,

				// 時間帯
				tzFocus: _.first(tzFocuses),

				// マスタ検索日
				anaDate: anaProc.cond.mstsrchdate,

				// 前年度ロジック
				lyLogicFocus: lyLogicFocuses
			};
		},

		// すべての条件を更新する
		condUpdateAll: function() {
			// 期間
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0010',
				anafocus : this.anaProc.cond.anaPeriods,
				panelId : this.panelId
			});
			// 期間詳細
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0011',
				anafocus : this.buildCACMV0011Dto(this.anaProc),
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
			case 'ca_navItemCACMV0010':
				// 期間設定
				// 対象条件
				if (anafocus[amanp_AnaHead.AMANP_ANA_REQ_F_COMP_NONE] != null) {
					var anaPeriod = anafocus[amanp_AnaHead.AMANP_ANA_REQ_F_COMP_NONE];
					var anaPeriod_type = anaPeriod.type
					html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '">';
					html_source += '<td width="100px">対象期間</td>';
					html_source += '<td width="100px">';
					if (anaPeriod.q_type != amanp_AnaPeriod.AMANP_ANA_PERIOD_QTYPE_NON) {
						anaPeriod_type = this.CACMV0010dispname.q_type2type[anaPeriod.q_type];
					}
					html_source += this.CACMV0010dispname.type[anaPeriod_type];
					html_source += '</td>';
					html_source += '<td>';
					html_source += anaPeriod.name;
					html_source += '</td></tr>';
				}
				// 比較条件
				if (anafocus[amanp_AnaHead.AMANP_ANA_REQ_F_COMP_PERIOD] != null) {
					var anaPeriod = anafocus[amanp_AnaHead.AMANP_ANA_REQ_F_COMP_PERIOD];
					if (anaPeriod.select) {
						var anaPeriod_type = anaPeriod.type
						html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '">';
						html_source += '<td width="100px">比較期間</td>';
						html_source += '<td width="100px">';
						if (anaPeriod.q_type != amanp_AnaPeriod.AMANP_ANA_PERIOD_QTYPE_NON) {
							anaPeriod_type = this.CACMV0010dispname.q_type2type[anaPeriod.q_type];
						}
						html_source += this.CACMV0010dispname.type[anaPeriod_type];
						html_source += '</td>';
						html_source += '<td>';
						html_source += anaPeriod.name;
						html_source += '</td></tr>';
					}
				}
				break;
			case 'ca_navItemCACMV0011':
				var _this = this;
				// 期間詳細設定
				$.each(anafocus, function(key, value) {
					switch(key){
					case 'wdayFocuses':
					case 'spymdFocuses':
						// 曜日, 特定日
						if(Ana.Config.cond.CACMV0011.sdayGroupDisplay === false){
							break;
						}
						var focuses = this;
						if (focuses != null && focuses.length > 0) {
							html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
							var focusesDispname = _this.CACMV0011dispname[key];
							html_source += focusesDispname.name;
							html_source += '</td><td colspan="2">';
							var focus_source = '';
							for (var i = 0; i < focuses.length; i++) {
								var focus = focuses[i];
								if (key == 'wdayFocuses') {
									// 曜日
									focus_source += focusesDispname[focus.val];
								} else {
									// 特定日
									focus_source += focus.val + focusesDispname['name2'];
								}
								// 文字数制限
								if (focus_source.length > clcom.focusStr_max) {
									focus_source = focus_source.slice(0, clcom.focusStr_max);
									focus_source += '...';
									break;
								}
								if (i != focuses.length-1) {
									focus_source += ', ';
								}
							}
							html_source += focus_source;
							html_source += '</td></tr>';
						}
						break;
					case 'holidayFocus':
						// 祝日
						if(Ana.Config.cond.CACMV0011.sdayGroupDisplay === false){
							break;
						}
						var focus = this;
						html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
						var focusesDispname = _this.CACMV0011dispname[key];
						html_source += focusesDispname.name;
						html_source += '</td><td colspan="2">';
						html_source += focusesDispname[Number(focus.val)];
						html_source += '</td></tr>';
						break;
					case 'tzFocus':
						// 時間帯
						var focus = this;
						if (this.val == null || Number(this.val) == 0) {
							break;
						}
						html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
						var focusesDispname = _this.CACMV0011dispname[key];
						html_source += focusesDispname.name;
						html_source += '</td><td colspan="2">';
						html_source += clutil.timeFormat(focus.val, 'hh:mm');
						html_source += '～';
						html_source += clutil.timeFormat(focus.val2, 'hh:mm');
						html_source += '</td></tr>';
						break;
					case 'anaDate':
						// マスタ検索日
						var focus = this;
						var type_com = focus.f_srchiymd_type == amanp_AnaHead.AMANP_ANA_REQ_F_SRCHIYMD_TYPE_COM ?
								true : false;

						// 共通指定
						var focusesDispname = _this.CACMV0011dispname[key];

						// 表示設定
						$.each(focus, function(key, value) {
							switch(key){
							case 'f_srchiymd_type':
								break;
							case 'srchiymd':
								if (type_com) {
									// 共通指定
									html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
									html_source += focusesDispname[key]
									html_source += '</td><td colspan="2">';
									html_source += clutil.dateFormat(value, 'yyyy/mm/dd');
									html_source += '</td></tr>';
								}
								break;
							default:
								if (!type_com) {
									// 個別指定
									html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
									html_source += focusesDispname[key]
									html_source += '</td><td colspan="2">';
									html_source += clutil.dateFormat(value, 'yyyy/mm/dd');
									html_source += '</td></tr>';
								}
								break;
							}
						});
						break;
					case 'lyLogicFocus':
						// 前年度ロジック
						var focuses = this;
						if (focuses != null && focuses.length > 0) {
							var f_val = false;
							for (var i = 0; i < focuses.length; i++) {
								var focus = focuses[i];
								if (focus.val != null) {
									f_val = true;
									break;
								}
							}
							if (!f_val) {
								break;
							}
							html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
							var focusesDispname = _this.CACMV0011dispname[key];
							html_source += focusesDispname.name;
							html_source += '</td><td colspan="2">';
							var focus_source = '';
							for (var i = 0; i < focuses.length; i++) {
								var focus = focuses[i];
								if (focus.val != null) {
									focus_source += focusesDispname[focus.val];
									// 文字数制限
									if (focus_source.length > clcom.focusStr_max) {
										focus_source = focus_source.slice(0, clcom.focusStr_max);
										focus_source += '...';
										break;
									}
									if (i != focuses.length-1) {
										focus_source += ', ';
									}
								}
							}
							html_source += focus_source;
							html_source += '</td></tr>';
						}
						break;
					default:
						console.warn('onCondUpdated: unknown property[' + key + '], ignore.');
					}
				}); // end of $.each(func)
				break;
			default:
				console.warn('onCondUpdated: unknown tr_id[' + tr_id + ']');
			}

			// 条件を表示
			$(html_source).insertAfter($('#' + tr_id));
		}
	});
});
