// AMGAV0010: 成績表
$(function() {

	clutil.initAnaCondition();

	// コンフィギュレーション
	Ana.Config.cond.CACMV0210.disp_way = 'disabled';	// 表示項目並びを変更できないように。

	// メニュー画面から起動引数を clcom.pageArgs に入れて起動する。
	// pageArgs の形式等は後々に精査する。
	var args = _.defaults({
		searchURI: clcom.pageId,
		// 以下4項目は直リン対策のための初期設定値。
		func_id: 1001,
		func_code: clcom.pageId,
		f_anakind: 1,
		anamenuitem_name: "成績表",
		directExec: null
	}, clcom.pageArgs);

	// 直接実行対応 #20150516
	var directExec = args.directExec;

	// 黒帯ヘッダの「＜」戻り先
	if(args.homeUrl){
		clcom.homeUrl = args.homeUrl;
	}
	var anaProc = new Ana.Proc(args);

	// タイトル名設定
	if(!_.isEmpty(anaProc.anamenuitem_name)){
		$('title').text(anaProc.anamenuitem_name);
	}

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		// 要素
		el						: $('#ca_main'),

		// 押下イベント
		events: {
		},

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validatorWithTicker(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			// 検索ボタンイベント
			this.anaProc.on('onSearchCompleted', this.showResultView);

			// 分析結果
			this.anaResultView = new Ana.ResultContainerView(_.extend({
				el			: $('#ca_result')
			}, opt));

//			// 条件表示パネル
//			this.CAPAV0080Panel = new CAPAV0080PanelView({
//				el			: $('#ca_CAPAV0080_view'),
//				$view		: $('#ca_panel'),
//				$parentView	: $('#ca_result'),
//				anadata		: this.anadata,			// anaProc に入れる予定。
//				anaProc		: this.anaProc
//			});

			// 結果表示パネル
			this.CAPAV0090Panel = new CAPAV0090PanelView({
				el				: $('#ca_CAPAV0070_view'),
				$result_view	: $('#ca_show_result'),
				$expand_view	: $('#ca_expand_panel'),
				$clear_view		: $('#ca_clear_panel'),
				$parentView		: $('#ca_result'),
				anadata			: this.anadata,			// anaProc に入れる予定。
				anaProc			: this.anaProc,
				isMDAnalyze		: true
			});

			// 期間パネル
			this.CAPAV0010Panel = new CAPAV0010PanelView({
//				el			: $('#ca_CAPAV0010_view'),
				$view		: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				condItemHash: this.condItemHash,	// anaProc に入れる予定。
				anadata		: this.anadata,			// anaProc に入れる予定。
				anaProc		: this.anaProc,
				fCompPeriod : true					// 比較条件あり
			});

			// 店舗パネル
			this.CAPAV0020Panel = new  CAPAV0020PanelView({
//				el			: $('#ca_CAPAV0020_view'),
				$view		: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				condItemHash: this.condItemHash,
				anaProc		: this.anaProc
			});

			// 商品パネル
			this.CAPAV0030Panel = new  CAPAV0030PanelView({
//				el : $('#ca_CAPAV0030_view'),
				$view		: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				condItemHash: this.condItemHash,	// anaProc に入れる予定。
				anaProc		: this.anaProc
			});

//			// 顧客パネル
//			this.CAPAV0040Panel = new  CAPAV0040PanelView({
//				el : $('#ca_CAPAV0040_view'),
//				$view		: $('#ca_panel'),
//				$parentView	: $('#ca_result'),
//				condItemHash: this.condItemHash,	// anaProc に入れる予定。
//				anaProc		: this.anaProc
//			});

			// 社員パネル
			this.CAPAV0050Panel = new  CAPAV0050PanelView({
//				el : $('#ca_CAPAV0050_view'),
				$view		: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				condItemHash: this.condItemHash,	// anaProc に入れる予定。
				anaProc		: this.anaProc
			});

			// 売上パネル
			this.CAPAV0130Panel = new  CAPAV0130PanelView({
//				el : $('#ca_CAPAV0130_view'),
				$view		: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				condItemHash: this.condItemHash,	// anaProc に入れる予定。
				anaProc		: this.anaProc
			});

			// 軸設定パネル
			this.CAPAV0060Panel = new  CAPAV0060PanelView({
//				el : $('#ca_CAPAV0060_view'),
				$view		: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				anadata		: this.anadata,			// anaProc に入れる予定。
				anaProc		: this.anaProc
			});

			// 表示項目設定パネル
			this.CAPAV0070Panel = new  CAPAV0070PanelView({
//				el : $('#ca_CAPAV0070_view'),
				$view	: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				anadata		: this.anadata,			// anaProc に入れる予定。
				anaProc		: this.anaProc
			});

			// 取引先パネル
			this.MDPAV0010Panel = new MDPAV0010PanelView({
//				el : $('#ca_MDPAV0010_view'),
				$view		: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				condItemHash: this.condItemHash,	// anaProc に入れる予定。
				anaProc		: this.anaProc
			});
		},

		/**
		 * 画面描写
		 */
		render: function() {
			this.initUIelement();

//			this.CAPAV0080Panel.render();		// 条件表示
			this.CAPAV0090Panel.render();		// 結果表示
			this.anaResultView.render();		// 結果表示View
			this.CAPAV0010Panel.render();		// 期間
			this.CAPAV0060Panel.render().$el.hide();		// 軸
			this.CAPAV0070Panel.render();//.$el.hide();		// 表示項目

			$('<hr>').appendTo(this.$('#ca_panel'));//.hide();

			this.CAPAV0020Panel.render();//.$el.hide();		// 店舗
			this.CAPAV0030Panel.render();//.$el.hide();		// 商品
			this.CAPAV0050Panel.render().$el.hide();		// 社員
			this.CAPAV0130Panel.render().$el.hide();		// 売上
			this.MDPAV0010Panel.render().$el.hide();		// 取引先

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);
			return this;
		},

		/**
		 * 結果部のコンテナを表示する。
		 */
		showResultView: function(){
			this.$('#ca_result').show();
			this.$('#container > .cl_dialog').empty();
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();

			// 結果データ変更につき、結果Viewを再描画する。
			this.anaResultView.showResultView();
			this.anaResultView.render();
		},

		/**
		 * デバグ用裏コマンド（SMX商品店舗成績表）条件を設定するもの。
		 */
		xxxSetSMXFocus: function(value){
			var focusKey = {
				kind: amanp_AnaDefs.AMAN_DEFS_KIND_STOREATTR_SMX
			};

			// valus は 区分で定義
			// amcm_type.*****
			// AMCM_TYPE_ANA_STOREATTR_SMX: 275,
			// AMCM_VAL_ANA_STOREATTR_SMX_NOP: 1,		// SMX店舗絞込なし
			// AMCM_VAL_ANA_STOREATTR_SMX_YES: 2,		// SMX店舗に絞込
			// AMCM_VAL_ANA_STOREATTR_SMX_NO: 3,		// SMX店舗以外に絞込
			if(value == null){
				// TODO: focus1 から取る。
				this.anaProc.removeFocus1(focusKey).pushFocus1();
			}else{
				// TODO: focus1 に値をセットする。
				switch(value){
				case amcm_type.AMCM_VAL_ANA_STOREATTR_SMX_NOP:
				case amcm_type.AMCM_VAL_ANA_STOREATTR_SMX_YES:
				case amcm_type.AMCM_VAL_ANA_STOREATTR_SMX_NO:
					var focus = {
						kind: amanp_AnaDefs.AMAN_DEFS_KIND_STOREATTR_SMX,
						val: value
					};
					this.anaProc.removeFocus1(focusKey).pushFocus1(focus);
					break;
				default:
					console.error('SMX店舗定義値はこのとおり：絞込なし-NOP[1], 絞込-YES[2], 以外に絞込み-NO[3]');
					return;
				}
			}
		},
		/**
		 * デバグ用裏コマンド（SMX商品店舗成績表）条件を確認する。
		 */
		xxxSMXFocus: function(){
			var focusKey = {
				kind: amanp_AnaDefs.AMAN_DEFS_KIND_STOREATTR_SMX
			};
			var ff = this.anaProc.getFocus1(focusKey);
			if(_.isEmpty(ff)){
				console.log('SMX 絞込条件：なし');
			}else{
				for(var i = 0; i < ff.length; i++){
					var f = ff[i];
					var cn = clcom.getTypeList(amcm_type.AMCM_TYPE_ANA_STOREATTR_SMX, f.val);
					if(cn && cn.length === 1){
						console.log('[' + i + ']: ', cn[0]);
					}else{
						console.log('[' + i + ']: unknown val[' + f.val + ']');
					}
				}
			}
		}
	});

	//////////////////////////////////////////////
	// ユーザ情報(clcom.getIniJSON()相当)、他、アプリ情報などをサーバへ問い合わせる。
	anaProc.iniGet().done(_.bind(function(){
		Ana.Util._initialize();
		var opeDate = Ana.Util.yyyyMMdd2Date(clcom.getOpeDate());

		/*
		 * 初期設定
		 */
		var c = this.cond;
		// 期間条件
		c.anaPeriods = _.map([-1, -2], function(dt, idx){
			var aDate = Ana.Util.addDay(opeDate, (dt*7));
			var iymd = Ana.Util.date2YYYYMMDD(aDate);
			var period = Ana.Util.findPeriod(amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YW, iymd);
			// period {year: 2014, period: 10, type: 9, st_iymd: 20140602, ed_iymd: 20140608}
			var fromLabel = period.year + '年' + period.period + '週' + '(' + clutil.dateFormat(period.st_iymd, 'yyyy/mm/dd') + '～)';
			var toLabel   = period.year + '年' + period.period + '週' + '(～' + clutil.dateFormat(period.ed_iymd, 'yyyy/mm/dd') + ')';
			return {
				name: fromLabel + '～' + toLabel,
				p_from: period.year * 100 + period.period,
				p_to: period.year * 100 + period.period,
				q_type: 0,
				type: amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YW,
				select: (idx === 0)
			};
		});
		// 縦軸
		c.vAxisList = [
			// TODO: 縦軸初期設定 - 超ハードコーディングなのでなんとかする！！！
			{
				attr: 4,
				dispattr: 8,
				func_id: 1,
				//kind: 201,
				//name: "品種",
				//name2: "基本商品分類"
				kind: 209,
				name: "成績表",
				name2: "成績表"
			}
		];
		// 横軸
		c.hAxisList = [];
		// 表示項目
		c.dispitemlist = this.buildDispItems([
			{
				// itemId[0x1] name[購入点数実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x1] name[購入点数前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x1] name[購入点数前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			},{
				// itemId[0x2a] name[購入点数年累計実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_QY_YACM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x2a] name[購入点数年累計前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_QY_YACM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x1] name[購入点数年累計前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_QY_YACM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0x1] name[購入点数縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0x15] name[購入金額(税抜)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x15] name[購入金額(税抜)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x15] name[購入金額(税抜)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			},{
				// itemId[0x15] name[購入金額(税抜)縦軸構成比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0x75] name[平均売価実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PRICE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PRICE_AVE_SAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x75] name[平均売価前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PRICE,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PRICE_AVE_SAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			//},{
			//	// itemId[0x75] name[平均売価縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PRICE,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PRICE_AVE_SAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0x15] name[購入金額(税抜)前年差]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYDF
			},{
				// itemId[0x2c] name[購入金額(税抜)年累計実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM_YACM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x2c] name[購入金額(税抜)年累計前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM_YACM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x2c] name[購入金額(税抜)年累計前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM_YACM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			},{
				// itemId[0x2c] name[購入金額(税抜)年累計縦軸構成比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM_YACM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0x17] name[経準率実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PROFRT,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x17] name[経準率前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PROFRT,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x17] name[経準率前年差]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PROFRT,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYDF
			//},{
			//	// itemId[0x17] name[経準率縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PROFRT,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			//},{
			//	// itemId[0x2d] name[経準率年累計実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PROFRT_YACM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x2d] name[経準率年累計前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PROFRT_YACM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x3] name[経準高実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x3] name[経準高前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x3] name[経準高前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0x3] name[経準高縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0x2b] name[経準高年累計実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM_YACM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			},{
				// itemId[0x2b] name[経準高年累計前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM_YACM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			},

			//// 在庫数
			{
				// itemId[0x62] name[期末数量実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_ED_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x62] name[期末数量前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_ED_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x62] name[期末数量前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_ED_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0x62] name[期末数量縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_ED_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xc0] name[シーズン別在庫数(AW)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AW_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xc0] name[シーズン別在庫数(AW)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AW_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xc0] name[シーズン別在庫数(AW)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AW_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xc0] name[シーズン別在庫数(AW)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AW_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xc2] name[シーズン別在庫数(SS)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SS_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xc2] name[シーズン別在庫数(SS)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SS_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xc2] name[シーズン別在庫数(SS)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SS_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xc2] name[シーズン別在庫数(SS)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SS_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xc4] name[シーズン別在庫数(SP)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SP_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xc4] name[シーズン別在庫数(SP)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SP_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xc4] name[シーズン別在庫数(SP)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SP_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xc4] name[シーズン別在庫数(SP)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SP_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xc6] name[シーズン別在庫数(ALL)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AL_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xc6] name[シーズン別在庫数(ALL)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AL_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xc6] name[シーズン別在庫数(ALL)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AL_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xc6] name[シーズン別在庫数(ALL)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AL_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xd0] name[年令別在庫数(1年未満)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_1_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xd0] name[年令別在庫数(1年未満)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_1_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xd0] name[年令別在庫数(1年未満)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_1_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xd0] name[年令別在庫数(1年未満)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_1_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xd2] name[年令別在庫数(2年未満)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_2_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xd2] name[年令別在庫数(2年未満)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_2_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xd2] name[年令別在庫数(2年未満)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_2_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xd2] name[年令別在庫数(2年未満)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_2_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xd4] name[年令別在庫数(3年未満)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_3_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xd4] name[年令別在庫数(3年未満)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_3_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xd4] name[年令別在庫数(3年未満)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_3_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xd4] name[年令別在庫数(3年未満)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_3_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xd6] name[年令別在庫数(4年未満)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_4_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xd6] name[年令別在庫数(4年未満)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_4_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xd6] name[年令別在庫数(4年未満)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_4_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xd6] name[年令別在庫数(4年未満)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_4_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xd8] name[年令別在庫数(4年以上)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_5_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xd8] name[年令別在庫数(4年以上)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_5_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xd8] name[年令別在庫数(4年以上)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_5_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xd8] name[年令別在庫数(4年以上)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_5_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},

			//// 在庫金額
			{
				// itemId[0x63] name[期末原価金額実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_ED_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x63] name[期末原価金額前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_ED_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x63] name[期末原価金額前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_ED_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			},{
				// itemId[0x63] name[期末原価金額縦軸構成比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_ED_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},
			{
				// itemId[0xc1] name[シーズン別在庫金額(AW)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AW_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xc1] name[シーズン別在庫金額(AW)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AW_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xc1] name[シーズン別在庫金額(AW)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AW_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xc1] name[シーズン別在庫金額(AW)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AW_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xc3] name[シーズン別在庫金額(SS)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SS_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xc3] name[シーズン別在庫金額(SS)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SS_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xc3] name[シーズン別在庫金額(SS)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SS_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xc3] name[シーズン別在庫金額(SS)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SS_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xc5] name[シーズン別在庫金額(SP)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SP_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xc5] name[シーズン別在庫金額(SP)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SP_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xc5] name[シーズン別在庫金額(SP)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SP_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xc5] name[シーズン別在庫金額(SP)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_SP_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xc7] name[シーズン別在庫金額(ALL)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AL_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xc7] name[シーズン別在庫金額(ALL)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AL_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xc7] name[シーズン別在庫金額(ALL)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AL_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xc7] name[シーズン別在庫金額(ALL)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_SEASON_AL_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xd1] name[年令別在庫金額(1年未満)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_1_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xd1] name[年令別在庫金額(1年未満)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_1_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xd1] name[年令別在庫金額(1年未満)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_1_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xd1] name[年令別在庫金額(1年未満)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_1_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xd3] name[年令別在庫金額(2年未満)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_2_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xd3] name[年令別在庫金額(2年未満)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_2_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xd3] name[年令別在庫金額(2年未満)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_2_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xd3] name[年令別在庫金額(2年未満)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_2_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xd5] name[年令別在庫金額(3年未満)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_3_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xd5] name[年令別在庫金額(3年未満)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_3_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xd5] name[年令別在庫金額(3年未満)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_3_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xd5] name[年令別在庫金額(3年未満)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_3_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xd7] name[年令別在庫金額(4年未満)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_4_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xd7] name[年令別在庫金額(4年未満)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_4_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xd7] name[年令別在庫金額(4年未満)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_4_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xd7] name[年令別在庫金額(4年未満)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_4_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// itemId[0xd9] name[年令別在庫金額(4年以上)実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_5_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0xd9] name[年令別在庫金額(4年以上)前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_5_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0xd9] name[年令別在庫金額(4年以上)前年比]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_5_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			//},{
			//	// itemId[0xd9] name[年令別在庫金額(4年以上)縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_RESULT,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_RESULT_AGE_5_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},

			//// 平均コスト
			{
				// itemId[0x74] name[平均在庫コスト実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PRICE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PRICE_AVE_STOCK_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x74] name[平均在庫コスト前年実績]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PRICE_AVE_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			//},{
			//	// itemId[0x74] name[平均在庫コスト縦軸構成比]
			//	gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PRICE_AVE_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			}
		]);
		// 表示設定
		c.dispopt = {
			disp_way	: amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_H,	// 表示項目並び: 横
			f_total		: 0, //1,	// 合計表示：あり(1)/なし(2)
			f_subtotal	: 1,	// 小計表示
			//existsum	: amanp_AnaHead.AMANP_ANA_REQ_EXISTSUM_OFF,	// 既存店集計：しない(2)
			disp_amunit	: amanp_AnaHead.AMANP_ANA_REQ_DISP_AMUNIT_1	// 表示単位：円単位
		};

		// 条件セットを初期化 -- カタログ条件をセットしたり、履歴条件をセットしたり
		this.initCondition();

		// タイトル名設定
		if(this.catalog && !_.isEmpty(this.catalog.name)){
			$('title').text(this.catalog.name);
		}

		mainView = new MainView({
			condItemHash: this.condItemHash,	// 条件ハッシュを作成 -- anaProc
			anadata		: this.anadata,
			anaProc: this
		});

		// ヘッダー部品
		headerView = new HeaderView({supportGuide: true});
		headerView.render(function(){
			// 共通部品の初期化
			mainView.render();
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

        // 直接実行対応 #20150516
        if( this.directExec != null ){
            if( this.directExec == "csv" ){
                mainView.anaResultView.onCSVClick(this);
            }
            else if( this.directExec == "xls" ){
                mainView.anaResultView.onEXCELClick(this);
            }
        }

	}, anaProc)).fail(function(){
		console.error('初期化に失敗', arguments);
	});

});
