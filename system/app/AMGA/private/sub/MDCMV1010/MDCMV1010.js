$(function(){
	//////////////////////////////////////////////
	// View
	MDCMV1010SelectorView = Backbone.View.extend({

		screenId : "MDCMV1010",
		validator: null,

		// Eventes
		events: {
			"change #ca_MDCMV1010_ymd"			:	"_onYmdSelect",		// 日付単位変更
			"change #ca_MDCMV1010_c_ymd"		:	"_onCYmdSelect",	// 日付単位変更(比較)
//			"keyup #ca_MDCMV1020_func_id"		:	"_onFuncSelect",	// 種別変更
//			"keydown #ca_MDCMV1020_func_id"		:	"_onFuncSelect",	// 種別変更

			"click #ca_MDCMV1010_cancel"		:	"_onCancelClick",	// キャンセルボタン押下
			"click #ca_MDCMV1010_commit"		:	"_onCommitClick"	// 確定ボタン押下
		},

		initialize: function(opt) {
			var defaults = {
				search_date : clcom.ope_date,	// 運用日
				fCompPeriod : false				// 比較期間表示フラグ
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);

			// 分析期間リストを取得
			this.period_list = clcom.getPeriodList();
			this.past_years = clcom.getPastYears();
			this.future_years = clcom.getFutureYears();

			this.ymd_cond = {};
			this.opeweek = {};
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function(periodFolder) {
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), true);

			clutil.inputlimiter(this.$el);

			// 日付追加用
			this.period_addno = 1;

			// 条件に合わせて表示を設定する
			// 日単位
			if (!this.ymd_cond[amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YMD]) {
				this.$('.ca_MDCMV1010_day').remove();
				this.$('.ca_MDCMV1010_c_day').remove();
			};
			// 週単位
			if (!this.ymd_cond[amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YW]) {
				this.$('.ca_MDCMV1010_week').remove();
				this.$('.ca_MDCMV1010_c_week').remove();
			};
			// 月単位
			if (!this.ymd_cond[amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YM]) {
				this.$('.ca_MDCMV1010_month').remove();
				this.$('.ca_MDCMV1010_c_month').remove();
			}

			// カレンダー
			clutil.datepicker(this.$("#ca_MDCMV1010_day_temp").find(".ca_MDCMV1010_opt"));
			clutil.datepicker(this.$("#ca_MDCMV1010_c_day_temp").find(".ca_MDCMV1010_c_opt"));
			// 週単位
			this.opeweek =clutil.clweekselector(
					this.$("#ca_MDCMV1010_week_temp").find("#ca_MDCMV1010_week_y_p_from"),
					this.$("#ca_MDCMV1010_week_temp").find("#ca_MDCMV1010_week_w_p_from_div"),
					{id : "ca_MDCMV1010_week_w_p_from"}, "flleft ca_MDCMV1010_opt wt180 mrgl10 cl_valid cl_required",
					this.period_list, true);
			clutil.clweekselector(
					this.$("#ca_MDCMV1010_week_temp").find("#ca_MDCMV1010_week_y_p_to"),
					this.$("#ca_MDCMV1010_week_temp").find("#ca_MDCMV1010_week_w_p_to_div"),
					{id : "ca_MDCMV1010_week_w_p_to"}, "flleft ca_MDCMV1010_opt wt180 mrgl10 cl_valid cl_required",
					this.period_list);
			clutil.clweekselector(
					this.$("#ca_MDCMV1010_c_week_temp").find("#ca_MDCMV1010_c_week_y_p_from"),
					this.$("#ca_MDCMV1010_c_week_temp").find("#ca_MDCMV1010_c_week_w_p_from_div"),
					{id : "ca_MDCMV1010_c_week_w_p_from"}, "flleft ca_MDCMV1010_c_opt wt180 mrgl10 cl_valid cl_required",
					this.period_list);
			clutil.clweekselector(
					this.$("#ca_MDCMV1010_c_week_temp").find("#ca_MDCMV1010_c_week_y_p_to"),
					this.$("#ca_MDCMV1010_c_week_temp").find("#ca_MDCMV1010_c_week_w_p_to_div"),
					{id : "ca_MDCMV1010_c_week_w_p_to"}, "flleft ca_MDCMV1010_c_opt wt180 mrgl10 cl_valid cl_required",
					this.period_list);
			// 月単位
			clutil.clyearmonthselector(
					this.$("#ca_MDCMV1010_month_temp").find("#ca_MDCMV1010_month_y_p_from"),
					this.$("#ca_MDCMV1010_month_temp").find("#ca_MDCMV1010_month_m_p_from"),
					0, this.past_years, this.future_years); //10, 0);
			clutil.clyearmonthselector(
					this.$("#ca_MDCMV1010_month_temp").find("#ca_MDCMV1010_month_y_p_to"),
					this.$("#ca_MDCMV1010_month_temp").find("#ca_MDCMV1010_month_m_p_to"),
					0, this.past_years, this.future_years); //10, 0);
			clutil.clyearmonthselector(
					this.$("#ca_MDCMV1010_c_month_temp").find("#ca_MDCMV1010_c_month_y_p_from"),
					this.$("#ca_MDCMV1010_c_month_temp").find("#ca_MDCMV1010_c_month_m_p_from"),
					0, this.past_years, this.future_years); //10, 0);
			clutil.clyearmonthselector(
					this.$("#ca_MDCMV1010_c_month_temp").find("#ca_MDCMV1010_c_month_y_p_to"),
					this.$("#ca_MDCMV1010_c_month_temp").find("#ca_MDCMV1010_c_month_m_p_to"),
					0, this.past_years, this.future_years); //10, 0);

			// カレンダー
			clutil.datepicker(this.$(".ca_MDCMV1010_period"));

			clutil.initUIelement(this.$el);

			var _this = this;
			if (this.fCompPeriod) {
				// 比較チェックボックスクリック
				this.$el.delegate(':checkbox[id=ca_MDCMV1010_comp_chk]', 'toggle', function (ev) {
					if ($(this).prop('checked')) {
						clutil.viewRemoveReadonly(_this.$('#ca_MDCMV1010_comp_div'));
						_this._onCYmdSelect();
					} else {
						clutil.viewReadonly(_this.$('#ca_MDCMV1010_comp_div'));
					}
				});
			} else {
				// 比較期間を削除する
				this.$('div.ca_MDCMV1010_comp').remove();
			}

			// 編集データを表示する

			// 日付条件
			if (periodFolder != null) {
				// 対象条件
				if (periodFolder[amgbp_AnaHead.AMGBP_ANA_REQ_F_COMP_NONE] != null) {
					var anaPeriod = periodFolder[amgbp_AnaHead.AMGBP_ANA_REQ_F_COMP_NONE];
					if (anaPeriod.q_type == amgbp_AnaPeriod.AMGBP_ANA_PERIOD_QTYPE_NON) {
						// 指定種別
						this.$('#ca_MDCMV1010_ymd').selectpicker('val', anaPeriod.type*10);
						var ymd = this.$('#ca_MDCMV1010_ymd option:selected').attr('class');

						clutil.data2view(this.$('#' + ymd + '_temp'), anaPeriod, ymd + '_');

						switch (anaPeriod.type) {
						case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YM:
							// 月単位
							this.$("#ca_MDCMV1010_month_y_p_from").selectpicker('val', Math.floor(anaPeriod.p_from/100));
							this.$("#ca_MDCMV1010_month_m_p_from").selectpicker('val', Math.floor(anaPeriod.p_from%100));
							this.$("#ca_MDCMV1010_month_y_p_to").selectpicker('val', Math.floor(anaPeriod.p_to/100));
							this.$("#ca_MDCMV1010_month_m_p_to").selectpicker('val', Math.floor(anaPeriod.p_to%100));
							break;
						case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YW:
							// 週単位
							this.$("#ca_MDCMV1010_week_y_p_from").selectpicker('val', Math.floor(anaPeriod.p_from/100));
							this.$("#ca_MDCMV1010_week_w_p_from").selectpicker('val', Math.floor(anaPeriod.p_from%100));
							this.$("#ca_MDCMV1010_week_y_p_to").selectpicker('val', Math.floor(anaPeriod.p_to/100));
							this.$("#ca_MDCMV1010_week_w_p_to").selectpicker('val', Math.floor(anaPeriod.p_to%100));
							break;
						case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YMD:
							// 日単位
							break;
						default:
							break;
						}

					} else {
						// 簡易指定種別
						this.$('#ca_MDCMV1010_ymd').selectpicker('val', anaPeriod.q_type);
					}
				} else {
					// デフォルト当月
					this._onYmdSelect();
				}
				// 比較条件
				if (this.fCompPeriod && (periodFolder[amgbp_AnaHead.AMGBP_ANA_REQ_F_COMP_PERIOD] != null)) {
					var anaPeriod = periodFolder[amgbp_AnaHead.AMGBP_ANA_REQ_F_COMP_PERIOD];
					if (anaPeriod.q_type == amgbp_AnaPeriod.AMGBP_ANA_PERIOD_QTYPE_NON) {
						// 指定種別
						this.$('#ca_MDCMV1010_c_ymd').selectpicker('val', anaPeriod.type*10);
						var ymd = this.$('#ca_MDCMV1010_c_ymd option:selected').attr('class');

						clutil.data2view(this.$('#' + ymd + '_temp'), anaPeriod, ymd + '_');

						switch (anaPeriod.type) {
						case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YM:
							// 月単位
							this.$("#ca_MDCMV1010_c_month_y_p_from").selectpicker('val', Math.floor(anaPeriod.p_from/100));
							this.$("#ca_MDCMV1010_c_month_m_p_from").selectpicker('val', Math.floor(anaPeriod.p_from%100));
							this.$("#ca_MDCMV1010_c_month_y_p_to").selectpicker('val', Math.floor(anaPeriod.p_to/100));
							this.$("#ca_MDCMV1010_c_month_m_p_to").selectpicker('val', Math.floor(anaPeriod.p_to%100));
							break;
						case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YW:
							// 週単位
							this.$("#ca_MDCMV1010_c_week_y_p_from").selectpicker('val', Math.floor(anaPeriod.p_from/100));
							this.$("#ca_MDCMV1010_c_week_w_p_from").selectpicker('val', Math.floor(anaPeriod.p_from%100));
							this.$("#ca_MDCMV1010_c_week_y_p_to").selectpicker('val', Math.floor(anaPeriod.p_to/100));
							this.$("#ca_MDCMV1010_c_week_w_p_to").selectpicker('val', Math.floor(anaPeriod.p_to%100));
							break;
						case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YMD:
							// 日単位
							break;
						default:
							break;
						}
					} else {
						// 簡易指定種別
						this.$('#ca_MDCMV1010_c_ymd').selectpicker('val', anaPeriod.q_type);
					}
					// 絶対指定か相対指定か
					var select = (anaPeriod.select == true) ? 'check' : 'uncheck';
					this.$('#ca_MDCMV1010_comp_chk').checkbox(select);

					if (anaPeriod.select) {
						clutil.viewRemoveReadonly(this.$('#ca_MDCMV1010_comp_div'));
						this._onCYmdSelect();
					} else {
						clutil.viewReadonly(this.$('#ca_MDCMV1010_comp_div'));
					}
				} else {
					// デフォルト当月
					this._onCYmdSelect();
					clutil.viewReadonly(this.$('#ca_MDCMV1010_comp_div'));
				}
			} else {
				// デフォルト当月
				this._onYmdSelect();
				this._onCYmdSelect();
			}
		},

		/**
		 * 選択画面の初期化処理
		 */
		render: function() {
			var _this = this;

			if (this.anadata != null) {
				var fCondItemList = this.anadata.f_cond_item_list;

				// 絞込条件の設定
				if (fCondItemList != null && fCondItemList.length > 0) {
					for (var i = 0; i < fCondItemList.length-1; i++) {
						var conditem = fCondItemList[i];
						switch (conditem.cond_kind) {
						// 日付条件
						case amgbp_AnaDefs.AMGBA_DEFS_KIND_YMD:
							this.ymd_cond[conditem.cond_attr] = true;
							break;
						default:
							break;
						}
					}
				}
			}

//			var url = "";
//			url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
			var url = clcom.getAnaSubPaneURI(this.screenId);

			// HTMLソースを読み込む
			clutil.loadHtml(url, function(data) {
				_this.html_source = data;
			});

			return this;
		},

		show: function(periodFolder, isSubDialog) {
			var _this = this;

			// 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
			if (isSubDialog == null) {
				$('.cl_dialog').empty();
			}
			this.$parentView.hide();

			// htmlソースからダイアログを作成する
			this.$el.html('');
			this.$el.html(this.html_source);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_MDCMV1010_main'), {
				echoback		: $('.cl_echoback').hide()
			});

			// 画面の初期化
			this.initUIelement(periodFolder);

			// フォーカスの設定
			this.setFocus();
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus(this.$('#ca_MDCMV1010_ymd'));

		},

		/**
		 * 日付単位変更
		 */
		_onYmdSelect : function(e) {
			// クラスに合わせて表示する内容を変更
			var ymd = this.$('#ca_MDCMV1010_ymd option:selected').attr('class');
			var q_type = Number(this.$('#ca_MDCMV1010_ymd option:selected').attr('q-type'));

			this.$('#ca_MDCMV1010_opt_div').find('div.ca_MDCMV1010_temp').addClass('dispn');
			this.$('#' + ymd + '_temp').removeClass('dispn');

			clutil.viewRemoveReadonly(this.$('#' + ymd + '_temp'));

			this.setYmd(ymd, q_type, '');
		},

		/**
		 * 日付単位変更(比較期間)
		 */
		_onCYmdSelect : function(e) {
			if (!this.fCompPeriod) {
				return;
			}
			// クラスに合わせて表示する内容を変更
			var ymd = this.$('#ca_MDCMV1010_c_ymd option:selected').attr('class')
			var q_type = Number(this.$('#ca_MDCMV1010_c_ymd option:selected').attr('q-type'));

			this.$('#ca_MDCMV1010_c_opt_div').find('div.ca_MDCMV1010_c_temp').addClass('dispn');
			this.$('#' + ymd + '_temp').removeClass('dispn');

			clutil.viewRemoveReadonly(this.$('#' + ymd + '_temp'));

			this.setYmd(ymd, q_type, '_c');
		},

		setYmd : function(ymd, q_type, comp_type) {
			switch (ymd) {
			case 'ca_MDCMV1010' + comp_type + '_month':
				// 月単位
				switch (q_type) {
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_QTYPE_MONTH:
					// 当月
					this.validator.clear();
					var opeDate = clcom.getOpeDate();
					this.$('#ca_MDCMV1010' + comp_type + '_month_y_p_from').selectpicker('val', clutil.dateFormat(opeDate, 'yyyy'));
					this.$('#ca_MDCMV1010' + comp_type + '_month_m_p_from').selectpicker('val', clutil.dateFormat(opeDate, 'mm'));
					this.$('#ca_MDCMV1010' + comp_type + '_month_y_p_to').selectpicker('val', clutil.dateFormat(opeDate, 'yyyy'));
					this.$('#ca_MDCMV1010' + comp_type + '_month_m_p_to').selectpicker('val', clutil.dateFormat(opeDate, 'mm'));
					clutil.viewReadonly(this.$('#' + ymd + '_temp'));
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_QTYPE_PMONTH:
					// 前月
					this.validator.clear();
					var pDate = clutil.computeMonth(clcom.getOpeDate(), 'yyyymmdd', -1);
					this.$('#ca_MDCMV1010' + comp_type + '_month_y_p_from').selectpicker('val', clutil.dateFormat(pDate, 'yyyy'));
					this.$('#ca_MDCMV1010' + comp_type + '_month_m_p_from').selectpicker('val', clutil.dateFormat(pDate, 'mm'));
					this.$('#ca_MDCMV1010' + comp_type + '_month_y_p_to').selectpicker('val', clutil.dateFormat(pDate, 'yyyy'));
					this.$('#ca_MDCMV1010' + comp_type + '_month_m_p_to').selectpicker('val', clutil.dateFormat(pDate, 'mm'));
					clutil.viewReadonly(this.$('#' + ymd + '_temp'));
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_QTYPE_NON:
					// 月単位
					break;
				default:
					break;
				}
				break;
			case 'ca_MDCMV1010' + comp_type + '_week':
				// 週単位
				switch (q_type) {
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_QTYPE_WEEK:
					// 当週
					this.validator.clear();
					this.$('#ca_MDCMV1010' + comp_type + '_week_y_p_from').selectpicker('val', this.opeweek.ope_y);
					this.$('#ca_MDCMV1010' + comp_type + '_week_w_p_from').selectpicker('val', this.opeweek.ope_w);
					this.$('#ca_MDCMV1010' + comp_type + '_week_y_p_to').selectpicker('val', this.opeweek.ope_y);
					this.$('#ca_MDCMV1010' + comp_type + '_week_w_p_to').selectpicker('val', this.opeweek.ope_w);
					clutil.viewReadonly(this.$('#' + ymd + '_temp'));
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_QTYPE_PWEEK:
					// 前週
					this.validator.clear();
					this.$('#ca_MDCMV1010' + comp_type + '_week_y_p_from').selectpicker('val', this.opeweek.pOpe_y);
					this.$('#ca_MDCMV1010' + comp_type + '_week_w_p_from').selectpicker('val', this.opeweek.pOpe_w);
					this.$('#ca_MDCMV1010' + comp_type + '_week_y_p_to').selectpicker('val', this.opeweek.pOpe_y);
					this.$('#ca_MDCMV1010' + comp_type + '_week_w_p_to').selectpicker('val', this.opeweek.pOpe_w);
					clutil.viewReadonly(this.$('#' + ymd + '_temp'));
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_QTYPE_NON:
					// 週単位
					break;
				default:
					break;
				}
				break;
			case 'ca_MDCMV1010' + comp_type + '_day':
				// 日単位
				switch (q_type) {
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_QTYPE_DAY:
					// 当日
					this.validator.clear();
					this.$('#' + ymd + '_temp').find('.ca_MDCMV1010' + comp_type + '_opt').val(clutil.dateFormat(clcom.getOpeDate(), 'yyyy/mm/dd'));
					clutil.viewReadonly(this.$('#' + ymd + '_temp'));
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_QTYPE_PDAY:
					// 前日
					this.validator.clear();
					this.$('#' + ymd + '_temp').find('.ca_MDCMV1010' + comp_type + '_opt').val(clutil.computeDays(clcom.getOpeDate(), 'yyyy/mm/dd', -1));
					clutil.viewReadonly(this.$('#' + ymd + '_temp'));
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_QTYPE_NON:
					// 日単位
					break;
				default:
					break;
				}
				break;
			default:
				break;
			}
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// validatorの初期化
			this.validator.clear();
		},

		// 選択されたデータを取得
		getData : function(f_comp, isSelected){
			var periodFolder = {f_kind : f_comp};
			var anaPeriod = {};
			var prefix = 'ca_MDCMV1010_';

			switch (f_comp) {
			// 比較条件の場合は後尾に'c_'をつける
			case amgbp_AnaHead.AMGBP_ANA_REQ_F_COMP_PERIOD:
				prefix = 'ca_MDCMV1010_c_';
				break;
			default:
				break;
			}

			// 日付条件を取得
			anaPeriod.q_type = Number(this.$('#' + prefix + 'ymd option:selected').attr('q-type'));

			// 表示用に当・前の場合でも値を取得する
			var q_type2type = {1 : 2, 2 : 9, 3 : 3, 4 : 2, 5 : 9, 6 : 3};
			var anaPeriod_type;
			if (anaPeriod.q_type != amgbp_AnaPeriod.AMGBP_ANA_PERIOD_QTYPE_NON) {
				anaPeriod_type = q_type2type[anaPeriod.q_type];
			} else {
				anaPeriod.type = Number(this.$('#' + prefix + 'ymd option:selected').attr('type'));
				anaPeriod_type = anaPeriod.type;
			}

			// 指定種別
//			if (anaPeriod.q_type == amgbp_AnaPeriod.AMGBP_ANA_PERIOD_QTYPE_NON) {
//				anaPeriod.type = Number(this.$('#' + prefix + 'ymd option:selected').attr('type'));
				var ymd = this.$('#' + prefix + 'ymd option:selected').attr('class');
				var ymdData = clutil.view2data(this.$('#' + ymd + '_temp'), ymd + '_');

				// validatorエラー時の表示領域
				var validator = clutil.validator(this.$('#' + ymd + '_temp'), {
					echoback		: $('.cl_echoback')
				});
				// validation
				if(!validator.valid() && isSelected) {
					// ヘッダークリアー
					validator.clearErrorHeader();
					return null;
				}

				switch (anaPeriod_type) {
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YM:
					// 月単位
					// 範囲反転チェック
					// 年単位
					var chkInfo = [];
					chkInfo.push({
						stval : ymd + '_y_p_from',
						edval : ymd + '_y_p_to'
					});
					if(!validator.validFromTo(chkInfo) && isSelected){
						// ヘッダークリアー
						validator.clearErrorHeader();
						return null;
					}
					if (ymdData.y_p_from == ymdData.y_p_to) {
						var chkInfo = [];
						chkInfo.push({
							stval : ymd + '_m_p_from',
							edval : ymd + '_m_p_to'
						});
						if(!validator.validFromTo(chkInfo) && isSelected){
							// ヘッダークリアー
							validator.clearErrorHeader();
							return null;
						}
					}
					anaPeriod.p_from = Number(ymdData.y_p_from * 100) + Number(ymdData.m_p_from);
					anaPeriod.p_to = Number(ymdData.y_p_to * 100) + Number(ymdData.m_p_to);
					anaPeriod.name = ymdData.y_p_from + '年' + ymdData.m_p_from + '月～' +
										ymdData.y_p_to + '年' + ymdData.m_p_to + '月';
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YW:
					// 週単位
					// 範囲反転チェック
					// 年単位
					var chkInfo = [];
					chkInfo.push({
						stval : ymd + '_y_p_from',
						edval : ymd + '_y_p_to'
					});
					if(!validator.validFromTo(chkInfo) && isSelected){
						// ヘッダークリアー
						validator.clearErrorHeader();
						return null;
					}
					if (ymdData.y_p_from == ymdData.y_p_to) {
						var chkInfo = [];
						chkInfo.push({
							stval : ymd + '_w_p_from',
							edval : ymd + '_w_p_to'
						});
						if(!validator.validFromTo(chkInfo) && isSelected){
							// ヘッダークリアー
							validator.clearErrorHeader();
							return null;
						}
					}
					var w_p_from_name = this.$('#' + ymd + '_w_p_from').find('option[value=' + ymdData.w_p_from + ']').html() + ')';
					var w_p_to_name = this.$('#' + ymd + '_w_p_to').find('option[value=' + ymdData.w_p_to + ']').html() + ')';
					anaPeriod.p_from = Number(ymdData.y_p_from * 100) + Number(ymdData.w_p_from);
					anaPeriod.p_to = Number(ymdData.y_p_to * 100) + Number(ymdData.w_p_to);
					anaPeriod.name = ymdData.y_p_from + '年' + w_p_from_name + '～' +
										ymdData.y_p_to + '年' + w_p_to_name;
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YMD:
					// 日単位
					// 範囲反転チェック
					var chkInfo = [];
					chkInfo.push({
						stval : ymd + '_p_from',
						edval : ymd + '_p_to'
					});
					if(!validator.validFromTo(chkInfo) && isSelected){
						// ヘッダークリアー
						validator.clearErrorHeader();
						return null;
					}
					anaPeriod.p_from = ymdData.p_from;
					anaPeriod.p_to = ymdData.p_to;
					anaPeriod.name = clutil.dateFormat(ymdData.p_from, 'yyyy/mm/dd') + '～' +
										clutil.dateFormat(ymdData.p_to, 'yyyy/mm/dd')
					break;
				default:
					break;
				}
//			}
			periodFolder.anaPeriod = anaPeriod;
//			return periodFolder;
			return anaPeriod;
		},

		/**
		 * 確定ボタン click
		 */
		_onCommitClick: function() {
			var cmpIsSelected = this.$('#ca_MDCMV1010_comp_chk').prop('checked');
			// 対象条件
			var period = this.getData(amgbp_AnaHead.AMGBP_ANA_REQ_F_COMP_NONE, true);
			// 比較条件
			var c_period = null;
			if (this.fCompPeriod) {
				c_period = this.getData(amgbp_AnaHead.AMGBP_ANA_REQ_F_COMP_PERIOD, cmpIsSelected);
			}

			if (period == null || (this.fCompPeriod && cmpIsSelected && c_period == null)) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return this;
			}

			// 比較チェック条件
			// validatorチェックのため比較チェック条件は後で入れる
			if (this.fCompPeriod) {
				c_period['select'] = cmpIsSelected;
			}
			var anaperiod = [
				period, c_period
			];

			this.$parentView.show();
			this.okProc(anaperiod);
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
		},

		// 選択時処理  呼び出し側で override する
		okProc : function(){
			// 上位で上書きする。
		},

		/**
		 * キャンセルボタン click
		 */
		_onCancelClick: function() {
			this.$parentView.show();
			this.okProc(null);
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
		}
	});

});
