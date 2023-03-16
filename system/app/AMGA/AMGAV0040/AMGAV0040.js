// AMGAV0040: 商品構成分析
$(function() {

	clutil.initAnaCondition();

	// コンフィギュレーション
	Ana.Config.cond.CACMV0210.disp_way = 'disabled';	// 表示項目並びを変更できないように。

	// メニュー画面から起動引数を clcom.pageArgs に入れて起動する。
	// pageArgs の形式等は後々に精査する。
	var args = _.defaults({
		searchURI: clcom.pageId,
		// 以下4項目は直リン対策のための初期設定値。
		func_id: 1004,
		func_code: clcom.pageId,
		f_anakind: 4,
		anamenuitem_name: "商品構成分析",
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
			this.CAPAV0060Panel.render();		// 軸
			this.CAPAV0070Panel.render();//.hide();		// 表示項目

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
				func_id: 0,
				kind: 211,
				name: "",
				name2: "サブクラス１"
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
            //  gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x1] name[購入点数前年比]
                gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			},{
				// itemId[0x15] name[購入金額(税抜)実績]
                gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x15] name[購入金額(税抜)前年実績]
            //  gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
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
				// 0x141075: itemId[0x75] name[平均売価実績]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PRICE_AVE_SAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// 0x146075: itemId[0x75] name[平均売価前年実績]
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PRICE_AVE_SAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// 0x141074: itemId[0x74] name[平均コスト実績]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PRICE_AVE_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// 0x146074: itemId[0x74] name[平均コスト前年実績]
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PRICE_AVE_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x17] name[経準高実績]
                gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			},{
				// itemId[0x15] name[経準高前年比]
                gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYRT
			},{
				// itemId[0x17] name[経準率実績]
                gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PROFRT,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x17] name[経準率前年実績]
            //  gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PROFRT,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x62] name[期末数量実績]
                gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_ED_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x62] name[期末数量前年実績]
            //  gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_ED_QY,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x63] name[期末原価金額実績]
                gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_ED_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// itemId[0x63] name[期末原価金額前年実績]
            //  gbit: amanp_AnaDispItemDefs.AMAN_DI_G_STOCK,
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_ED_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// 0x141076: itemId[0x76] name[在庫平均コスト実績]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PRICE_AVE_STOCK_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// 0x146076: itemId[0x76] name[在庫平均コスト前年実績]
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_PRICE_AVE_STOCK_OAM,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			},{
				// itemId[0x63] name[期末原価金額縦軸構成比]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_ED_OAM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VSUMRT
			},{
				// 0x131066: itemId[0x66] name[在庫日数実績]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_DAYS,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			//},{
			//	// 0x136066: itemId[0x66] name[在庫日数前年実績]
			//	dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_STOCK_DAYS,
			//	sbit: amanp_AnaDispItemDefs.AMAN_DI_S_LYVAL
			}
		]);
		// 表示設定
		c.dispopt = {
			disp_way	: amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_H,	// 表示項目並び: 横
			f_total		: 1,	// 合計表示：あり(1)/なし(2)
			f_subtotal	: 1,	// 小計表示
			//existsum	: amanp_AnaHead.AMANP_ANA_REQ_EXISTSUM_OFF,	// 既存店集計：しない(2)
			disp_amunit	: amanp_AnaHead.AMANP_ANA_REQ_DISP_AMUNIT_1	// 表示単位：円単位
		};
		// 絞込条件: 適当な品種を指定しておく。
		if(clcom.userInfo.unit_id == clcom.getSysparam('PAR_AMMS_UNITID_ORI')){
			// ORIHICA
			c.focuslist.push({
				func_id: 1,
				kind: 201,
				attr: 4,
				val: 241,
				code: '41',
				name: 'スーツ'
			});
		}
		else
		////if(clcom.userInfo.unit_id == clcom.getSysparam('PAR_AMMS_UNITID_AOKI'))
		{
			// ORIでなければAOKIにしておく
			c.focuslist.push({
				func_id: 1,
				kind: 201,
				attr: 4,
				val: 101,
				code: '01',
				name: 'スーツ'
			});
		}

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
