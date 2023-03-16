$(function () {

	clutil.initAnaCondition();

	// メニュー画面から起動引数を clcom.pageArgs に入れて起動する。
	// pageArgs の形式等は後々に精査する。
	var args = _.defaults({
		searchURI: clcom.pageId,
		// 以下4項目は直リン対策のための初期設定値。
		func_id: 2180,
		func_code: clcom.pageId,
		f_anakind: amcm_type.AMCM_VAL_ANAKIND_PREVDAY_AOOR,	// デフォルトはこれで
		anamenuitem_name: "経戦前日実績帳票出力",
		directExec: null,
		cond: {}
	}, clcom.pageArgs);

	// 直接実行対応 #20150516
	var directExec = args.directExec;

	// 黒帯ヘッダの「＜」戻り先
	if(args.homeUrl){
		clcom.homeUrl = args.homeUrl;
	}
	var anaProc = new Ana.Proc(args);

	// 黒帯ヘッダの「＜」戻るボタン戻り先設定
	if(clcom.pageArgs && clcom.pageArgs.homeUrl){
		clcom.homeUrl = clcom.pageArgs.homeUrl;
	}
	if(clcom.pageData && clcom.pageData.homeUrl){
		clcom.homeUrl = clcom.pageData.homeUrl;
	}

	var EditView = Backbone.View.extend({
		// 要素
		el						: $('#ca_main'),

		validator: null,

		// Eventes
		events: {
			"click #ca_CACMV0030_show_CACMV0020":	"_onShowCACMV0020Click",	// 組織選択ボタン押下
			"click #btn_orgClear": 					"_onClickBtnOrgClear",		// 組織クリア
			"click #cl_csv":						"_onCommitClick",			// 出力ボタン押下
		},

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validatorWithTicker(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
			// 分析期間リストを取得
			this.period_list = clcom.getPeriodList();
			this.past_years = clcom.getPastYears();
			this.future_years = clcom.getFutureYears();
			this.anaKindList = clutil.gettypelist(amcm_type.AMCM_TYPE_ANAKIND);	// 分析区分リスト
		},
		// 画面描写
		render: function() {
			this.initUIelement();
		},
		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);
			// 出力対象
			var outputTargetList = _.filter(this.anaKindList, function(data) {
				return (data.type_id >= amcm_type.AMCM_VAL_ANAKIND_PREVDAY_AOOR
								&& data.type_id <= amcm_type.AMCM_VAL_ANAKIND_PREVDAY_SMX)
						|| (data.type_id >= amcm_type.AMCM_VAL_ANAKIND_EC_AO
								&& data.type_id <= amcm_type.AMCM_VAL_ANAKIND_EC_OR);
			});
			_.each(outputTargetList, function(data) {
				if (data.type_id <= amcm_type.AMCM_VAL_ANAKIND_PREVDAY_SMX) {
					data.name = data.name.replace("経戦前日実績(", "").replace(")", "");
				}
				if (data.type_id == amcm_type.AMCM_VAL_ANAKIND_PREVDAY_SMX) {
					data.name = "サイズMAX";
				}
			});
			clutil.cltypeselector2(this.$("#ca_outputTarget"), outputTargetList, 0, 1, 'type_id');
			// 週単位
			var $ca_week_temp = this.$("#ca_week_temp");
			var $ca_week_y_period_val1 = $ca_week_temp.find("#ca_week_y_period_val1");
			var $ca_week_w_period_val1_div = $ca_week_temp.find("#ca_week_w_period_val1_div");
			var yw = clutil.clweekselector(
					$ca_week_y_period_val1,
					$ca_week_w_period_val1_div,
					{id : "ca_week_w_period_val1"},
					"flleft ca_opt wt180 mrgl10 cl_valid",
					this.period_list);
			$ca_week_w_period_val1_div.find('select').selectpicker('val', yw.ope_w);

			// 組織選択画面
			this.CACMV0030_CACMV0020Selector = new  CACMV0020SelectorView({
				el : this.$('#ca_CACMV0030_CACMV0020_dialog'),	// 配置場所
				$parentView		: this.$('#mainColumn'),
				isAnalyse_mode	: this.isAnalyse_mode,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_single_select,	// 単一選択モード
				anaProc			: this.anaProc
			});
			this.CACMV0030_CACMV0020Selector.render();
		},

		/**
		 * 組織クリアボタン押下
		 */
		_onClickBtnOrgClear: function(e) {
			this.$('#ca_CACMV0030_orgname').val("");
			this.$('#ca_CACMV0030_org_id').val("");
			this.$('#ca_CACMV0030_func_id').val("");
			this.$('#ca_CACMV0030_level_id').val("");
		},

		/**
		 * 組織選択ボタン押下
		 */
		_onShowCACMV0020Click: function(e) {
			var _this = this;

			// 選択された情報を初期値として検索する
			var initData = {};
			initData.func_id = this.$('#ca_CACMV0030_func_id').val();
			initData.org_id = this.$('#ca_CACMV0030_org_id').val();

			if (this.isAnalyse_mode) {
				// 分析条件部分を閉じる
				clutil.closeCondition();
			}

			this.CACMV0030_CACMV0020Selector.show(null, true, null, null, initData);
			//サブ画面復帰後処理
			this.CACMV0030_CACMV0020Selector.okProc = function(data) {
				if(data != null && data.length > 0) {
					_this.$('#ca_CACMV0030_orgname').val(data[0].code + ":" + data[0].name);
					_this.$('#ca_CACMV0030_org_id').val(data[0].val);
					_this.$('#ca_CACMV0030_func_id').val(data[0].func_id);
					_this.$('#ca_CACMV0030_level_id').val(data[0].attr);
				}
				// ボタンにフォーカスする
				$(e.target).focus();
			}
		},

		/**
		 * 検索条件を取得し、anaProcに設定
		 */
		getData: function() {
			var period = [];	// 期間
			var data_org = [];		// 組織
			var dto = clutil.view2data(this.$('#ca_searchArea'));
			// 年週
			var ww = ("00" + dto.week_w_period_val1).slice(-2);
			var yw = {
				type: amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YW,
				p_from: dto.week_y_period_val1 + ww,
				p_to: dto.week_y_period_val1 + ww,
			};
			period.push(yw);

			// 組織
			if (dto.CACMV0030_org_id) {
				var org = {
					kind: amanp_AnaDefs.AMAN_DEFS_KIND_ORG,
					val: dto.CACMV0030_org_id,
					val2: 0,
					attr: dto.CACMV0030_level_id,
					func_id: dto.CACMV0030_func_id
				};
				data_org.push(org);
			}
			return {
				outputTarget: dto.outputTarget,
				period: period,
				org: data_org,
			}
		},

		/**
		 * 帳票出力ボタン押下
		 */
		_onCommitClick: function(e) {
			var _this = this;

			// 検索条件を取得
			var dto = this.getData();
			console.log(dto);

			var filter_ORG = {
				kind : amanp_AnaDefs.AMAN_DEFS_KIND_ORG
			};

			// 対象
			this.anaProc.f_anakind = dto.outputTarget;
			// 期間
			this.anaProc.cond.anaPeriods = dto.period;
			// 組織
			this.anaProc.removeFocus1(filter_ORG);
			this.anaProc.pushFocus1(dto.org);

			// リクエストパケット生成
			this.anaProc.savedReq = _this.anaProc.buildAnaReq();

			var deferd = this.anaProc.doEXCELDURI();
			deferd.done(_.bind(function(data){
				if(_.isEmpty(data.url)){
					console.warn('DL 先の url が無い！');
					this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
				}else{
					clutil.download(data.url);
				}
			}, this));
			deferd.fail(_.bind(function(data){
				// clutil.postAnaJSON の内部の作りから、data.head.status を見て
				// STATUS_OK 以外の場合のみ、fail が呼ばれる。
				if(_.isObject(data.head) && _.isNumber(data.head.status)
						&& data.head.status !== am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK){
					console.log("anaProc.doEXCELDL(), status[ " + data.head.status + '] failed[' + data.head.message + '] ###');
					this.validator.setErrorInfo({_eb_:clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}
			}, this));

		}
	});
	//////////////////////////////////////////////
	// ユーザ情報(clcom.getIniJSON()相当)、他、アプリ情報などをサーバへ問い合わせる。
	anaProc.iniGet().done(_.bind(function(){
		Ana.Util._initialize();

		// 条件セットを初期化 -- カタログ条件をセットしたり、履歴条件をセットしたり
		this.initCondition();

		var c = this.cond;
		c.focuslist = [];	// 初期条件をクリア
		console.log('c', c);

		// タイトル名設定
		if(this.catalog && !_.isEmpty(this.catalog.name)){
			$('title').text(this.catalog.name);
		}

		editView = new EditView({
			condItemHash: this.condItemHash,	// 条件ハッシュを作成 -- anaProc
			anadata		: this.anadata,
			anaProc: this
		});

		// ヘッダー部品
		headerView = new HeaderView({supportGuide: true});
		headerView.render(function(){
			// 共通部品の初期化
			editView.render();
		});

		// スクロール表示の微調整
		ch_height();
		var sc = $('html').css('overflow-y');
		if(sc == 'scroll'){
			$('html').css('overflow-y', 'auto');
			_.defer(function(sc){
				$('html').css('overflow-y', sc);
			}, sc);
		}
	}, anaProc)).fail(function(){
		console.error('初期化に失敗', arguments);
	});

//	editView = new EditView();
//	editView.render();
//
//	// 初期データを取る
//	clutil.getIniJSON(null, null, _.bind(function(data, dataType) {
//			//////////////////////////////////////////////
//			// ヘッダー部品
//			headerview = new HeaderView();
//			headerview.render(function() {
//			if (data == null || data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
//				// 部品の初期化
//				editView.initUIelement();
//
//				// 画面起動モードを参照にする
//				editView.ope_mode = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
//				// 更新権限
//				editView.is_upd = 0;
//				// データを取得して画面に表示する
//				// 新規の場合はID=0で検索する
//				//editView.showChkData(catalog_id);
//			} else {
//				editView.validator.setErrorInfo({
//					_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)
//				});
//			}
//		});
//	},this)).done(function(){
//		// スクロール表示の微調整
//		ch_height();
//		var sc = $('html').css('overflow-y');
//		if(sc == 'scroll'){
//			$('html').css('overflow-y', 'auto');
//			_.defer(function(sc){
//				$('html').css('overflow-y', sc);
//			}, sc);
//		}
//	});
});
