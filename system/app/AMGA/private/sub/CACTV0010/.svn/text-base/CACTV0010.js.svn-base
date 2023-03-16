$(function() {
	var CATALOG_PERIOD_BEFORE = 1
	var CATALOG_PERIOD_UNIT_YMD = 0;
	//////////////////////////////////////////////
	// View
	CACTV0010SelectorView = Backbone.View.extend({

		screenId : "CACTV0010",
		validator: null,

		filter_MEMBLIST : {
			kind : amanp_AnaDefs.AMAN_DEFS_KIND_MEMBLIST
		},

		// 押下イベント
		events: {
			"change #ca_CACTV0010_ymd"				:	"_onYmdSelect",				// 日付単位変更

			"click #ca_CACTV0010_CACTV0040_show"	:	"_onCACTV0040ShowClick",	// メニュー登録場所ボタン押下
			"click #ca_CACTV0010_menutree_clear"	:	"_onMenuTreeClearClick",	// メニュー登録場所クリアボタン押下

			"click #ca_CACTV0010_commit"			:	"_onCommitClick",			// 登録ボタン押下
			"click #ca_CACTV0010_cancel"			:	"_onCancelClick"			// キャンセルボタン押下
		},

		period_list: [],

		initialize: function(opt) {
			var defaults = {};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);

			// 分析期間リストを取得
			this.period_list = clcom.getPeriodList();
			this.past_years = clcom.getPastYears();
			this.future_years = clcom.getFutureYears();
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), true);

			var _this = this;
			clutil.inputlimiter(this.$el);

			clutil.cltypeselector(this.$('#ca_CACTV0010_f_open'), amcm_type.AMCM_TYPE_OPEN);

			// 分析メニュー選択画面
			this.CACTV0010_CACTV0040Selector = new  CACTV0040SelectorView({
				el : this.$('#ca_CACTV0010_CACTV0040_dialog')	// 配置場所
			});
			this.CACTV0010_CACTV0040Selector.render(
					this.$('#ca_CACTV0010_main'),
					true				// 分析モード
			);

//			// DM企画グループ、DM企画のときは期間設定なし
//			if (Number(this.anaProc.f_anakind) == gsdb_defs.MTTYPE_F_ANAKIND_CUST_DMPROMGRP ||
//					Number(this.anaProc.f_anakind) == gsdb_defs.MTTYPE_F_ANAKIND_CUST_DMPROM) {
//				this.$('.ca_CACTV0010_period_area').remove();
//				clutil.initUIelement(this.$el);
//				return;
//			}

			// カレンダー
			clutil.datepicker(this.$("#ca_CACTV0010_day_temp").find(".ca_CACTV0010_opt"));
			// 週単位
			clutil.clweekselector(
					this.$("#ca_CACTV0010_week_temp").find("#ca_CACTV0010_week_y_period_val1"),
					this.$("#ca_CACTV0010_week_temp").find("#ca_CACTV0010_week_w_period_val1_div"),
					{id : "ca_CACTV0010_week_w_period_val1"}, "flleft ca_CACTV0010_opt wt180 mrgl10 cl_valid",
					this.period_list);
			clutil.clweekselector(
					this.$("#ca_CACTV0010_week_temp").find("#ca_CACTV0010_week_y_period_val2"),
					this.$("#ca_CACTV0010_week_temp").find("#ca_CACTV0010_week_w_period_val2_div"),
					{id : "ca_CACTV0010_week_w_period_val2"}, "flleft ca_CACTV0010_opt wt180 mrgl10 cl_valid",
					this.period_list);
			// 月単位
			clutil.clyearmonthselector(
					this.$("#ca_CACTV0010_month_temp").find("#ca_CACTV0010_month_y_period_val1"),
					this.$("#ca_CACTV0010_month_temp").find("#ca_CACTV0010_month_m_period_val1"),
					0, this.past_years, this.future_years); //10, 0);
			clutil.clyearmonthselector(
					this.$("#ca_CACTV0010_month_temp").find("#ca_CACTV0010_month_y_period_val2"),
					this.$("#ca_CACTV0010_month_temp").find("#ca_CACTV0010_month_m_period_val2"),
					0, this.past_years, this.future_years); //10, 0);

			// ラジオボタンクリック
			this.$el.delegate(':radio[name=ca_CACTV0010_catalog_period]', 'toggle', function (ev) {
				_this.onRadioClick($(this).val());
			});

			clutil.initUIelement(this.$el);

			// デフォルト設定
			this._onYmdSelect();
			this.onRadioClick(1);

			// リストに登録画面
			this.CACTV0010_CACMV0300Selector = new CACMV0300SelectorView({
				el : this.$('#ca_CACTV0010_CACMV0300_dialog'),	// 配置場所
				$parentView	: this.$('#ca_CACTV0010_main'),
				isAnalyse_mode	: true		// 分析ユースかどうかフラグ？？？
			});
			this.CACTV0010_CACMV0300Selector.render();
		},

		/**
		 * 選択画面の初期化処理
		 */
		render: function() {
			var _this = this;

//			var url = "";
//			url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
			var url = clcom.getAnaSubPaneURI(this.screenId);

			// HTMLソースを読み込む
			clutil.loadHtml(url, function(data) {
				_this.html_source = data;
			});
		},

		show: function(isSubDialog) {
			var _this = this;

			// 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
			if (isSubDialog == null) {
				$('.cl_dialog').empty();
			}

			this.$parentView.hide();

			// htmlソースからダイアログを作成する
			this.$el.html('');
			this.$el.html(this.html_source);
			this.catalogNameCounter = new clutil.view.InputCounter({
				$input: this.$('#ca_CACTV0010_name'),
				className: 'wt280',
				maxLength: clcom.domain.MtAnaCatalog.name.maxLen
			}).render();

			// 画面の初期化
			this.initUIelement();

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_CACTV0010_base_form'), {
				echoback		: $('.cl_echoback')
			});
			// validatorエラー時の表示領域
			this.type_before_validator = clutil.validator(this.$('.ca_CACTV0010_type_before_div'), {
				echoback		: $('.cl_echoback')
			});
			// validatorエラー時の表示領域
			this.unit_ymd_validator = clutil.validator(this.$('.ca_CACTV0010_unit_ymd_div'), {
				echoback		: $('.cl_echoback')
			});

			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode({
				view : this.$el
			});

			// フォーカスの設定
			this.setFocus();
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus(this.$('#ca_CACTV0010_name'));
		},

		/**
		 * 日付単位変更
		 */
		_onYmdSelect : function(e) {
			// クラスに合わせて表示する内容を変更
			var ymd = this.$('#ca_CACTV0010_ymd option:selected').attr('class')
			var unit = this.$('#ca_CACTV0010_ymd option:selected').attr('unit');

			this.$('div.ca_CACTV0010_unit_ymd_div').addClass('dispn');
			this.$('#' + ymd + '_temp').removeClass('dispn');
			// 単位表示
			this.$('.ca_CACTV0010_unit').html(unit);
		},

		/**
		 * ラジオボタン click
		 */
		onRadioClick: function(type) {
			clutil.viewRemoveReadonly(this.$('.ca_CACTV0010_unit_ymd_div'));
			clutil.viewRemoveReadonly(this.$('.ca_CACTV0010_type_before_div'));
			if (type == CATALOG_PERIOD_BEFORE) {
				// 相対指定
				clutil.viewReadonly(this.$('.ca_CACTV0010_unit_ymd_div'));
			} else {
				// 絶対指定
				clutil.viewReadonly(this.$('.ca_CACTV0010_type_before_div'));
			}
		},

		/**
		 * メニュー登録場所ボタン click
		 */
		_onCACTV0040ShowClick: function(e) {
			var _this = this;

			// 分析条件部分を閉じる
			clutil.closeCondition();

			this.CACTV0010_CACTV0040Selector.show(true);
			//サブ画面復帰後処理
			this.CACTV0010_CACTV0040Selector.okProc = function(data) {
				if(data != null) {
					_this.$('#ca_CACTV0010_menutree').val(data.node_name);
					_this.$('#ca_CACTV0010_anamenunode_id').val(data.node_id);
				}
				// ボタンにフォーカスする
				$(e.target).focus();
				// 画面位置修正
				document.location = "#";
			}
		},

		/**
		 * メニュー登録場所クリアボタン click
		 */
		_onMenuTreeClearClick: function() {
			$('#ca_CACTV0010_anamenunode_id').val("");
			$('#ca_CACTV0010_menutree').val("");
		},

		// 期間データを取得
		getPeriodData : function(period_val, resultData){
			// 日付単位
			resultData.f_period_unit = this.$('#ca_CACTV0010_ymd').val();
			// 絶対指定か相対指定か
			resultData.f_period_type = this.$(':radio[name=ca_CACTV0010_catalog_period]:checked').val();

			resultData.period_val1 = period_val.period_val1;
			resultData.period_val2 = period_val.period_val2;

			return resultData;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function(e) {
			var retStat = true;

			// バリデータクリア
			this.type_before_validator.clear();
			this.unit_ymd_validator.clear();

			var period_val = {};

			if (Number(this.$(':radio[name=ca_CACTV0010_catalog_period]:checked').val()) ==
				CATALOG_PERIOD_BEFORE) {
				// 相対指定
				period_val = clutil.view2data($('.ca_CACTV0010_type_before_div'), 'ca_CACTV0010_');
				if(!this.type_before_validator.valid()) {
					retStat = false;
				}
				// 範囲反転チェック
				var chkInfo = [];
				chkInfo.push({
					stval : 'ca_CACTV0010_period_val2',
					edval : 'ca_CACTV0010_period_val1'
				});
				if(!this.type_before_validator.validFromTo(chkInfo)){
					retStat = false;
				}
			} else {
				// 絶対指定
				var ymd = this.$('#ca_CACTV0010_ymd option:selected').attr('class');
				var type = this.$('#ca_CACTV0010_ymd').val();
				this.$('#' + ymd + '_temp').removeClass('dispn');

				// validatorエラー時の表示領域
				this.unit_ymd_validator = clutil.validator(this.$('#' + ymd + '_temp'), {
					echoback		: $('.cl_echoback')
				});
				if(!this.unit_ymd_validator.valid()) {
					retStat = false;
				}

				period_val = clutil.view2data($('#' + ymd + '_temp'), ymd + '_');

				switch (Number(type)) {
				case amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YM:
					// 月単位
					// 範囲反転チェック
					// 年単位
					var chkInfo = [];
					chkInfo.push({
						stval : ymd + '_y_period_val1',
						edval : ymd + '_y_period_val2'
					});
					if(!this.unit_ymd_validator.validFromTo(chkInfo)){
						retStat = false;
					}
					if (period_val.y_period_val1 == period_val.y_period_val2) {
						var chkInfo = [];
						chkInfo.push({
							stval : ymd + '_m_period_val1',
							edval : ymd + '_m_period_val2'
						});
						if(!this.unit_ymd_validator.validFromTo(chkInfo)){
							retStat = false;
						}
					}
					period_val.period_val1 = Number(period_val.y_period_val1 * 100) + Number(period_val.m_period_val1);
					period_val.period_val2 = Number(period_val.y_period_val2 * 100) + Number(period_val.m_period_val2);
					break;
				case amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YW:
					// 週単位
					// 範囲反転チェック
					// 年単位
					var chkInfo = [];
					chkInfo.push({
						stval : ymd + '_y_period_val1',
						edval : ymd + '_y_period_val2'
					});
					if(!this.unit_ymd_validator.validFromTo(chkInfo)){
						retStat = false;
					}
					if (period_val.y_period_val1 == period_val.y_period_val2) {
						var chkInfo = [];
						chkInfo.push({
							stval : ymd + '_w_period_val1',
							edval : ymd + '_w_period_val2'
						});
						if(!this.unit_ymd_validator.validFromTo(chkInfo)){
							retStat = false;
						}
					}
					period_val.period_val1 = Number(period_val.y_period_val1 * 100) + Number(period_val.w_period_val1);
					period_val.period_val2 = Number(period_val.y_period_val2 * 100) + Number(period_val.w_period_val2);
					break;
				case amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YMD:
					// 日単位
					// 範囲反転チェック
					var chkInfo = [];
					chkInfo.push({
						stval : ymd + '_period_val1',
						edval : ymd + '_period_val2'
					});
					if(!this.unit_ymd_validator.validFromTo(chkInfo)){
						retStat = false;
					}
					break;
				default:
					break;
				}
			}

			// 必須項目validation
			// フォーカスの関係でこちらを後にする
			if(!this.validator.valid()) {
				retStat = false;
			}


			if (!retStat) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return;
			}

			// 登録確認ダイアログを表示
			clutil.updConfirmDialog(this.updOkcallback, this.updCancelcallback,
					{e : e, period_val : period_val});
		},

		/**
		 * 登録確認ダイアログよりCancelで戻る
		 */
		updCancelcallback: function(obj) {
			$(obj.e.target).focus();
			return;
		},

		/**
		 * 登録確認ダイアログよりOKで戻る
		 */
		updOkcallback: function(obj) {
			// 会員リスト条件を取得
			var anafocus = (this.isMDAnalyze) ? null : this.anaProc.getFocus1(this.filter_MEMBLIST);

			// 会員リストが存在した場合は仮会員リストか確認する
			if (anafocus != null && anafocus.length > 0) {
				var uri = 'gsan_cm_genlist_get';
				var req = {
						cond : {
							genlist_id : anafocus[0].val,
							f_genlist : am_proto_defs.AMDB_DEFS_F_GENLIST_MEMB
						}
				};

				var _this = this;

				// 会員リストが仮会員リストか確認する
				clutil.postAnaJSON(uri, req, _.bind(function(data, dataType) {

					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						var appdata = data.genlist;

						if (appdata != null &&
								appdata.f_genlist == am_proto_defs.AMDB_DEFS_F_GENLIST_MEMB_TMP) {

							// 仮会員リスト登録ダイアログを表示
							clutil.MessageDialog(clmsg.ca_CACTV0010_0001, _this.genlistUpdOkcallback, anafocus);

						} else {
							_this.updGenlistOkcallback(obj);
						}
					} else {
						// ヘッダーにメッセージを表示
						_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					}
				}, this));
			} else {
				// カタログ登録
				this.updGenlistOkcallback(obj);
			}
		},

		/**
		 * 仮会員リスト登録ダイアログよりOKで戻る
		 */
		genlistUpdOkcallback: function(anafocus) {
			var req = {
				rtype : am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
				genlist : {
					id : anafocus[0].val,
					f_genlist : am_proto_defs.AMDB_DEFS_F_GENLIST_MEMB
				}
			};

			var _this = this;

			var uri = 'gsan_cm_genlist_upd';
			// リスト登録画面を表示
			this.CACTV0010_CACMV0300Selector.show(true, req, uri);
    		// サブ画面復帰後処理
           	this.CACTV0010_CACMV0300Selector.okProc = function(data) {
           		if (data != null && data.genlist != null) {
           			// 会員リスト名称を変更
           			anafocus[0].name = data.genlist.name;
           			_this.anaProc.removeFocus1(_this.filter_MEMBLIST);
					_this.anaProc.pushFocus1(anafocus[0]);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0130',
						anafocus : _this.anaProc.getFocus1(_this.filter_MEMBLIST),
						panelId : "CAPAV0040"
					});
           		}
    		}
		},

		/**
		 * 登録確認ダイアログよりOKで戻る
		 */
		updGenlistOkcallback: function(obj) {
			// 画面の情報を取得する
			var resultdata = clutil.view2data($('#ca_CACTV0010_base_form'), 'ca_CACTV0010_');

			// 条件を登録
			resultdata['condstr'] = JSON.stringify(this.anaProc.cond);
			// 期間条件
			this.getPeriodData(obj.period_val, resultdata);
			// 機能ID
			resultdata['func_id'] = this.anaProc.func_id;
			// 分析種別ID
			resultdata['anakind'] = this.anaProc.f_anakind;

			var _this = this;

			var req = {
					rtype : am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
					catalog : resultdata
			};

			var uri = 'gsan_ct_catalog_upd';
			clutil.postAnaJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					var menustore = clcom.getMenuStore();
					if(menustore != null) {
						// カタログ更新フラグを立てる
						menustore.catalog_upd = true;
						clcom.setMenuStore(menustore);
					}

					// 更新完了ダイアログを出す
					clutil.updMessageDialog(_this.updConfirmcallback, null);

				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}
			}, this));

		},

		/**
		 * 更新完了ダイアログよりOKで戻る
		 */
		updConfirmcallback: function() {
			// 遷移元へ戻る
			this.$parentView.show();
			this.okProc();
			this.catalogNameCounter.destroy();
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
		},

		// 選択時処理  呼び出し側で override する
		okProc : function(){
			// 上位で上書きする。
		},

		/**
		 * キャンセル
		 */
		_onCancelClick: function() {
			this.$parentView.show();
			this.okProc(null);
			this.catalogNameCounter.destroy();
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
		}
	});
});
