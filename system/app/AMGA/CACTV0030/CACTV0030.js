$(function(){
	var CATALOG_PERIOD_BEFORE = 1
	var CATALOG_PERIOD_UNIT_YMD = 0;

	// 黒帯ヘッダの「＜」戻るボタン戻り先設定
	if(clcom.pageArgs && clcom.pageArgs.homeUrl){
		clcom.homeUrl = clcom.pageArgs.homeUrl;
	}
	if(clcom.pageData && clcom.pageData.homeUrl){
		clcom.homeUrl = clcom.pageData.homeUrl;
	}

	//////////////////////////////////////////////
	// View
	var EditView = Backbone.View.extend({
		// 要素
		el						: $('#ca_main'),

		validator: null,

		// Eventes
		events: {
			"change #ca_ymd"			:	"_onYmdSelect",				// 日付単位変更

			"click #ca_CACTV0040_show"	:	"_onCACTV0040ShowClick",	// メニュー登録場所ボタン押下
			"click #ca_menutree_clear"	:	"_onMenuTreeClearClick",	// メニュー登録場所クリアボタン押下

			"click #ca_commit"			:	"_onCommitClick",			// 登録ボタン押下
			"click #ca_cancel"			:	"_onCancelClick"			// キャンセルボタン押下
		},

		initialize: function() {
			_.bindAll(this);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validatorWithTicker(this.$('.ca_base_form'), {
				echoback		: $('.cl_echoback')
			});
			// validatorエラー時の表示領域
			this.type_before_validator = clutil.validator(this.$('.ca_type_before_div'), {
				echoback		: $('.cl_echoback')
			});
			// validatorエラー時の表示領域
			this.unit_ymd_validator = clutil.validator(this.$('.ca_unit_ymd_div'), {
				echoback		: $('.cl_echoback')
			});

			// 分析期間リストを取得
			this.period_list = clcom.getPeriodList();
			this.past_years = clcom.getPastYears();
			this.future_years = clcom.getFutureYears();

			// 分析カタログ名カウンタ
			this.catalogNameCounter = new clutil.view.InputCounter({
				$input: this.$('#ca_name'),
				className: 'wt280',
				maxLength: clcom.domain.MtAnaCatalog.name.maxLen
			});

			// ガイダンスカウンタ
			this.guideInputCounter = new clutil.view.InputCounter({
				$input: this.$('#ca_guide'),
				maxLength: clcom.domain.MtAnaCatalog.guide.maxLen
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

			clutil.initcltypeselector($('#ca_f_open_div'), amcm_type.AMCM_TYPE_OPEN,
					0, null,
					{id : "ca_f_open", name : "info"}, "mbn wt280 flleft");

			// 分析メニュー選択画面
			this.CACTV0040Selector = new  CACTV0040SelectorView({
				el : $('#ca_CACTV0040_dialog')	// 配置場所
			});
			this.CACTV0040Selector.render(
					$('#ca_main'),
					false				// 分析モードでない
            );

			// カレンダー
			clutil.datepicker($("#ca_day_temp").find(".ca_opt"));
			// 週単位
			clutil.clweekselector(
					this.$("#ca_week_temp").find("#ca_week_y_period_val1"),
					this.$("#ca_week_temp").find("#ca_week_w_period_val1_div"),
					{id : "ca_week_w_period_val1"}, "flleft ca_opt wt180 mrgl10 cl_valid",
					this.period_list);
			clutil.clweekselector(
					this.$("#ca_week_temp").find("#ca_week_y_period_val2"),
					this.$("#ca_week_temp").find("#ca_week_w_period_val2_div"),
					{id : "ca_week_w_period_val2"}, "flleft ca_opt wt180 mrgl10 cl_valid",
					this.period_list);
			// 月単位
			clutil.clyearmonthselector(
					this.$("#ca_month_temp").find("#ca_month_y_period_val1"),
					this.$("#ca_month_temp").find("#ca_month_m_period_val1"),
					0, this.past_years, this.future_years); //10, 0);
			clutil.clyearmonthselector(
					this.$("#ca_month_temp").find("#ca_month_y_period_val2"),
					this.$("#ca_month_temp").find("#ca_month_m_period_val2"),
					0, this.past_years, this.future_years); //10, 0);

			var _this = this;

			// ラジオボタンクリック
			this.$el.delegate(':radio[name=ca_catalog_period]', 'toggle', function (ev) {
				_this.onRadioClick($(this).val());
			});
		},

		/**
		 * 保存されたカタログ条件を再現
		 */
		showData: function(appdata) {
			// 条件制限
			var f_anacond = {};
			var f_anacond_chklist = clutil.view2data($('#ca_f_anacond_form'), 'ca_chk_');
			$.each(f_anacond_chklist, function(key, value) {
				if ((appdata.f_anacond & amcm_type['AMCM_VAL_ANACOND_' + key]) ==
						amcm_type['AMCM_VAL_ANACOND_' + key]) {
					f_anacond[key] = 1;
				} else {
					f_anacond[key] = 0;
				}
			});
			clutil.data2view($('#ca_f_anacond_form'), f_anacond, 'ca_chk_');

//XXX			// DM企画グループ、DM企画のときは期間設定なし
//XXX			if (Number(appdata.anakind) == gsdb_defs.MTTYPE_F_ANAKIND_CUST_DMPROMGRP ||
//XXX					Number(appdata.anakind) == gsdb_defs.MTTYPE_F_ANAKIND_CUST_DMPROM) {
//XXX				$('.ca_period_area').remove();
//XXX				return;
//XXX			}

			// 日付単位
			$('#ca_ymd').selectpicker('val', appdata.f_period_unit);
			this._onYmdSelect();
			this.onRadioClick(appdata.f_period_type);

			// 絶対指定か相対指定か
			$(':radio[name=ca_catalog_period][value=' +
					appdata.f_period_type + ']').radio('check');

			if (appdata.f_period_type == CATALOG_PERIOD_BEFORE) {
				// 相対指定
				clutil.data2view($('.ca_type_before_div'), appdata);
			} else {
				var ymd = this.$('#ca_ymd option:selected').attr('class')

				// 絶対指定
				clutil.data2view($('#' + ymd + '_temp'), appdata, ymd + '_');

				switch (Number(appdata.f_period_unit)) {
				case amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YM:
					// 月単位
					this.$("#ca_month_y_period_val1").selectpicker('val', Math.floor(appdata.period_val1/100));
					this.$("#ca_month_m_period_val1").selectpicker('val', Math.floor(appdata.period_val1%100));
					this.$("#ca_month_y_period_val2").selectpicker('val', Math.floor(appdata.period_val2/100));
					this.$("#ca_month_m_period_val2").selectpicker('val', Math.floor(appdata.period_val2%100));
					break;
				case amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YW:
					// 週単位
					this.$("#ca_week_y_period_val1").selectpicker('val', Math.floor(appdata.period_val1/100));
					this.$("#ca_week_w_period_val1").selectpicker('val', Math.floor(appdata.period_val1%100));
					this.$("#ca_week_y_period_val2").selectpicker('val', Math.floor(appdata.period_val2/100));
					this.$("#ca_week_w_period_val2").selectpicker('val', Math.floor(appdata.period_val2%100));
					break;
				case amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YMD:
					// 日単位
					break;
				default:
					break;
				}
			}

			// カタログ名カウンタ
			this.catalogNameCounter.showCounter();
			this.guideInputCounter.showCounter();
		},

		/**
		 * 画面描写
		 */
		render: function() {
			this.catalogNameCounter.render();
			this.guideInputCounter.render();
			return this;
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus($('#ca_name'));
		},

		/**
		 * 日付単位変更
		 */
		_onYmdSelect : function(e) {
			// クラスに合わせて表示する内容を変更
			var ymd = this.$('#ca_ymd option:selected').attr('class')
			var unit = this.$('#ca_ymd option:selected').attr('unit');

			this.$('div.ca_unit_ymd_div').addClass('dispn');
			this.$('#' + ymd + '_temp').removeClass('dispn');
			// 単位表示
			this.$('.ca_unit').html(unit);
		},

		/**
		 * ラジオボタン click
		 */
		onRadioClick: function(type) {
			clutil.viewRemoveReadonly(this.$('.ca_unit_ymd_div'));
			clutil.viewRemoveReadonly(this.$('.ca_type_before_div'));
			if (type == CATALOG_PERIOD_BEFORE) {
				// 相対指定
				clutil.viewReadonly(this.$('.ca_unit_ymd_div'));
			} else {
				// 絶対指定
				clutil.viewReadonly(this.$('.ca_type_before_div'));
			}
		},

		/**
		 * メニュー登録場所ボタン click
		 */
		_onCACTV0040ShowClick: function(e) {
			var _this = this;

			this.CACTV0040Selector.show();
			//サブ画面復帰後処理
			this.CACTV0040Selector.okProc = function(data) {
				if(data != null) {
					_this.$('#ca_menutree').val(data.node_name);
					_this.$('#ca_anamenunode_id').val(data.node_id);
				}
				// ボタンにフォーカスする
				$(e.target).focus();
				document.location = "#";
			}
		},

		/**
		 * メニュー登録場所クリアボタン click
		 */
		_onMenuTreeClearClick: function() {
			$('#ca_anamenunode_id').val("");
			$('#ca_menutree').val("");
		},

		// 期間データを取得
		getPeriodData : function(period_val, resultData){
			// 日付単位
			resultData.f_period_unit = this.$('#ca_ymd').val();
			// 絶対指定か相対指定か
			resultData.f_period_type = this.$(':radio[name=ca_catalog_period]:checked').val();

			resultData.period_val1 = period_val.period_val1;
			resultData.period_val2 = period_val.period_val2;

			return resultData;
		},

		// 条件制限データを取得
		getFAnacondData : function(resultData){
			var f_anacond_chklist = clutil.view2data($('#ca_f_anacond_form'), 'ca_chk_');
			var f_anacond = 0;

			$.each(f_anacond_chklist, function(key, value) {
				if (value) {
					f_anacond = f_anacond | amcm_type['AMCM_VAL_ANACOND_' + key];
				}
			});

			resultData['f_anacond'] = f_anacond;

			return resultData;
		},

		/**
		 * 登録ボタン
		 */
		_onCommitClick: function(e) {
			var retStat = true;

			// バリデータクリア
			this.type_before_validator.clear();
			this.unit_ymd_validator.clear();

			if (Number(this.$(':radio[name=ca_catalog_period]:checked').val()) ==
					CATALOG_PERIOD_BEFORE) {
				period_val = clutil.view2data($('.ca_type_before_div'), 'ca_');
				// 相対指定
				if(!this.type_before_validator.valid()) {
					retStat = false;
				}
				// 範囲反転チェック
				var chkInfo = [];
				chkInfo.push({
					stval : 'ca_period_val2',
					edval : 'ca_period_val1'
				});
				if(!this.type_before_validator.validFromTo(chkInfo)){
					retStat = false;
				}
			} else {
				// 絶対指定
				var ymd = this.$('#ca_ymd option:selected').attr('class')
				var type = this.$('#ca_ymd').val();
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
			// 画面の情報を取得する
			var resultdata = clutil.view2data($('.ca_base_form'));

			// 期間条件
			this.getPeriodData(obj.period_val, resultdata);
			// 条件制限
			this.getFAnacondData(resultdata);
			// MDB
			_.extend(resultdata, clutil.view2data($('#mdb')));

			var _this = this;

			var req = {
					rtype : this.ope_mode,
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
					clutil.updMessageDialog(_this.updConfirmcallback);

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
			clcom.popPage(null);
		},

		/**
		 * キャンセルボタン
		 */
		_onCancelClick: function() {
			clcom.popPage(null);
		},

		/**
		 * データを取得する
		 */
		showChkData: function(catalog_id) {
			var _this = this;

			var req = {
					cond : {
						catalog_id : catalog_id
					}
			};

			// データを取得
			clutil.postAnaJSON('gsan_ct_catalog_get', req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					var appdata = data.catalog;
					if (appdata != null) {
						clutil.data2view(_this.$('.ca_base_form'), appdata);

						// カタログ条件
						_this.showData(appdata);

						if (_this.is_upd != 1) {
							// 登録ボタンを削除し、キャンセルボタンの横幅を調整
							$('#ca_commit').closest('p').remove();
							$('#ca_cancel').closest('p').css('width', '100%');
							// 編集不可
							//clutil.viewReadonly($(".ca_editBtn"));
							clutil.viewReadonly(_this.$el);
							_this.validator.setErrorInfo({_eb_: clmsg.is_upd_false});
						}

					} else {
						// ヘッダーにメッセージを表示
						_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
						// 登録ボタンを削除し、キャンセルボタンの横幅を調整
						$('#ca_commit').closest('p').remove();
						$('#ca_cancel').closest('p').css('width', '100%');
					}

					// MDB表示対象
					var $mdb = this.$('#mdb');
					var permFunc = clcom.getPermfuncByCode('AMGAV0110');
					if (appdata.func_id == 2100 && permFunc.f_allow_em) {
						$mdb.show();
					}
					clutil.data2view($mdb, appdata);
				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});

					// 登録ボタンを削除し、キャンセルボタンの横幅を調整
					$('#ca_commit').closest('p').remove();
					$('#ca_cancel').closest('p').css('width', '100%');
				}
				// フォーカスの設定
				_this.setFocus();
			}, this));
		}
	});

	editView = new EditView();
	editView.render();

	// 初期データを取る
	clutil.getIniJSON(null, null, _.bind(function(data, dataType) {
		//////////////////////////////////////////////
		// ヘッダー部品
		headerview = new HeaderView();
		headerview.render(function() {
			// 部品の初期化
			editView.initUIelement();

			var catalog_id = 0;

			// #20151018 ゾーンAJA向け分析対応でsrcId拡張
			if(clcom.srcId == "CACTV0020" ||
			   clcom.srcId == "CACTV0040"){

				var args = clcom.pageArgs;
				// 画面起動モード
				editView.ope_mode = args.ope_mode;
				// 更新権限
				editView.is_upd = args.is_upd;

				catalog_id = args.catalog_id;

			} else {
				// 画面起動モードを新規作成にする
				editView.ope_mode = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
				// 更新権限
				editView.is_upd = 1;
			}
			// データを取得して画面に表示する
			// 新規の場合はID=0で検索する
			editView.showChkData(catalog_id);
		});
	},this)).done(function(){
		// スクロール表示の微調整
		ch_height();
		var sc = $('html').css('overflow-y');
		if(sc == 'scroll'){
			$('html').css('overflow-y', 'auto');
			_.defer(function(sc){
				$('html').css('overflow-y', sc);
			}, sc);
		}
	});

});
