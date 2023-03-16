$(function () {

	clutil.initAnaCondition();

	// メニュー画面から起動引数を clcom.pageArgs に入れて起動する。
	// pageArgs の形式等は後々に精査する。
	var args = _.defaults({
		searchURI: clcom.pageId,
		// 以下4項目は直リン対策のための初期設定値。
		func_id: 2190,
		func_code: clcom.pageId,
		f_anakind: amcm_type.AMCM_VAL_ANAKIND_PROM1,	// デフォルトはこれで
		anamenuitem_name: "チラシタイトル別実績帳票出力",
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
			"change #ca_outputTarget":	"_onOutputTargetSelect",	// 出力対象変更

			"click #ca_CACMV0030_show_CACMV0020"		:	"_onShowCACMV0020Click",		// 組織選択ボタン押下

			"click #cl_csv"				:	"_onCommitClick",			// 出力ボタン押下
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
				return data.type_id >= amcm_type.AMCM_VAL_ANAKIND_PROM1 && data.type_id <= amcm_type.AMCM_VAL_ANAKIND_PROM2;
			});
			clutil.cltypeselector2(this.$("#ca_outputTarget"), outputTargetList, 0, 1, 'type_id');
			// 対象チラシ折込日
			clutil.datepicker($("#ca_day_period_val1"));
			// 運用日-1をデフォルト表示
			var date = clutil.computeDays(clcom.getOpeDate(), "yyyy/mm/dd", -1);
			$("#ca_day_period_val1").val(date);
		},

		/**
		 * 出力対象変更
		 */
		_onOutputTargetSelect: function(e) {
			var $div_salesNo = $("#div_salesNo");
			var $ca_salesNo = $("#ca_salesNo");
			var val = $("#ca_outputTarget").selectpicker('val');
			if (val == amcm_type.AMCM_VAL_ANAKIND_PROM1) {
				// チラシタイトル別実績の場合、対象セールスNo.は必須
				$div_salesNo.addClass("required");
				$ca_salesNo.addClass("cl_required");
				clutil.inputRemoveReadonly($ca_salesNo);
			} else {
				// チラシタイトル別実績比較の場合、対象セールスの値をクリアして入力不可にする
				$div_salesNo.removeClass("required");
				$ca_salesNo.removeClass("cl_required");
				$ca_salesNo.val("");
				clutil.inputReadonly($ca_salesNo);
			}
		},

		/**
		 * 検索条件を取得し、anaProcに設定
		 */
		getData: function() {
			var period = [];	// 期間
			var data_salesNo = [];		// 対象セールスNo.
			var dto = clutil.view2data(this.$('#ca_searchArea'));
			// 対象チラシ折込日
			var ymd = {
				type: amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YMD,
				p_from: dto.day_period_val1,
				p_to: dto.day_period_val1,
			};
			period.push(ymd);
			// 対象セールスNo.
			if (dto.outputTarget == amcm_type.AMCM_VAL_ANAKIND_PROM1) {
				var salesNo = {
					kind: amanp_AnaDefs.AMAN_DEFS_KIND_SEGMENTCOND,
					val: dto.salesNo
				};
				data_salesNo.push(salesNo);
			}
			return {
				outputTarget: dto.outputTarget,
				period: period,
				salesNo: data_salesNo
			}
		},

		myInputCheck: function() {
			var valid = true;
			var $ca_outputTarget = this.$("#ca_outputTarget");
			var outputTarget = $ca_outputTarget.selectpicker("val");


			if (outputTarget == amcm_type.AMCM_VAL_ANAKIND_PROM1) {
				var $ca_salesNo = this.$("#ca_salesNo");
				this.validator.clearErrorMsg($ca_salesNo);

				var salesNo = $ca_salesNo.val();
				if (salesNo < 1 || salesNo > 20) {
					this.validator.setErrorMsg($ca_salesNo, clmsg.EGA0041);
					this.validator.setErrorHeader(clmsg.cl_echoback);
					valid = false;
				}
			}
			return valid;
		},
		/**
		 * 帳票出力ボタン押下
		 */
		_onCommitClick: function(e) {

			// 入力チェック
			if (!this.validator.valid()) {
				return null;
			}
			if (!this.myInputCheck()) {
				return null;
			}

			// 検索条件を取得
			var dto = this.getData();
			console.log(dto);

			var filter_SALESNO = {
				kind : amanp_AnaDefs.AMAN_DEFS_KIND_SEGMENTCOND
			};

			// 対象
			this.anaProc.f_anakind = dto.outputTarget;
			// 期間
			this.anaProc.cond.anaPeriods = dto.period;
			// 対象セールスNo.
			this.anaProc.removeFocus1(filter_SALESNO);
			if (dto.salesNo != null && dto.salesNo.length > 0) {
				this.anaProc.pushFocus1(dto.salesNo);
			}

			// リクエストパケット生成
			this.anaProc.savedReq = this.anaProc.buildAnaReq();

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
});
