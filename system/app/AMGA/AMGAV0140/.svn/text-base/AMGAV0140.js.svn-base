// AMGAV0140: バスケット分析
$(function() {

	clutil.initAnaCondition();

	// コンフィギュレーション：特定日系条件をONに
	Ana.Config.cond.CACMV0011.sdayGroupDisplay = true;
	Ana.Config.cond.CACMV0210.disp_way = 'disabled';	// 表示項目並びを変更できないように。

	// メニュー画面から起動引数を clcom.pageArgs に入れて起動する。
	// pageArgs の形式等は後々に精査する。
	var args = _.defaults({
		searchURI: clcom.pageId,
		// 以下4項目は直リン対策のための初期設定値。
		func_id: 1014,
		func_code: clcom.pageId,
		f_anakind: 12,
		anamenuitem_name: "バスケット分析（拡張）",
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
			this.CAPAV0090Panel.isValidCond = _.bind(function(anaproc){
				var vAxisList = anaproc.cond.vAxisList;
				var vAxisListEx = anaproc.cond.vAxisListEx;
				var basketList = anaproc.cond.basket_list;
				// 縦軸 - 1軸必須
				if(vAxisList.length < 1){
					var msg = '縦軸を設定してください。';
					this.validator.setErrorInfo({_eb_: msg});
					return false;
				}
				// 比較対象必須
				if (vAxisListEx == null || vAxisListEx.length < 1 || vAxisListEx[0].kind == null || vAxisListEx[0].kind == 0) {
					var msg = '比較対象（基準）を設定してください。';
					this.validator.setErrorInfo({_eb_: msg});
					return false;
				}
				if (basketList == null || basketList[0] == null) {
					var msg = '比較対象（基準）を設定してください。';
					this.validator.setErrorInfo({_eb_: msg});
					return false;
				}
				if (vAxisListEx.length < 2 || vAxisListEx[1].kind == null || vAxisListEx[1].kind == 0) {
					var msg = '比較対象（比較）を設定してください。';
					this.validator.setErrorInfo({_eb_: msg});
					return false;
				}
				if (basketList == null || basketList[1] == null) {
					var msg = '比較対象（比較）を設定してください。';
					this.validator.setErrorInfo({_eb_: msg});
					return false;
				}


				// 商品・商品分類（基準）- 必須
				var anaKinds = this.CAPAV0030Panel.filter_ALL;
				var basisItemsFocus = anaproc.getFocus1(anaKinds);
				if(_.isEmpty(basisItemsFocus)){
					var msg = this.CAPAV0030Panel.navTitleLabel + 'を設定してください。';
					this.validator.setErrorInfo({_eb_: msg});
					return false;
				}
				return true;
			}, this);

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

			// 商品パネル（基準）
			this.CAPAV0030Panel = new  CAPAV0030PanelView({
//				el : $('#ca_CAPAV0030_view'),
				id				: 'ca_CAPAV0030_view',
				panelId			: 'CAPAV0030',
				side			: 'basis',
				navTitleLabel	: '商品・商品分類（基準）',
				$view		: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				condItemHash: this.condItemHash,	// anaProc に入れる予定。
				anaProc		: this.anaProc
			});

			// 商品パネル（比較）
			this.CAPAV0030Panel2 = new  CAPAV0030PanelView({
//				el : $('#ca_CAPAV0030_view'),
				id				: 'ca_CAPAV0030_view2',
				panelId			: 'CAPAV0030_2',
				side			: 'alt',
				navTitleLabel	: '商品・商品分類（比較）',
				$view			: $('#ca_panel'),
				$parentView		: $('#ca_result'),
				condItemHash	: this.condItemHash,	// anaProc に入れる予定。
				anaProc			: this.anaProc
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
				anaProc		: this.anaProc,
				isMDBascket	: true
			});

			// 軸設定パネル(その２)
			this.CAPAV0140Panel1 = new  CAPAV0140PanelView({
//				el : $('#ca_CAPAV0060_view'),
				id				: 'ca_CAPAV0140_view1',
				panelId			: 'CAPAV0140_1',
				side			: 'basis',
				navTitleLabel	: '比較対象を選択（基準）',
				$view		: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				anadata		: this.anadata,			// anaProc に入れる予定。
				anaProc		: this.anaProc,
				isMDBascket	: true
			});

			// 軸設定パネル(その３)
			this.CAPAV0140Panel2 = new  CAPAV0140PanelView({
//				el : $('#ca_CAPAV0060_view'),
				id				: 'ca_CAPAV0140_view2',
				panelId			: 'CAPAV0140_2',
				side			: 'alt',
				navTitleLabel	: '比較対象を選択（比較）',
				$view		: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				anadata		: this.anadata,			// anaProc に入れる予定。
				anaProc		: this.anaProc,
				isMDBascket	: true
			});

			// 表示項目設定パネル
			this.CAPAV0070Panel = new  CAPAV0070PanelView({
//				el : $('#ca_CAPAV0070_view'),
				$view	: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				navTitleLabel	: '商品・商品分類（比較）',
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
			this.CAPAV0140Panel1.render();		// 軸
			this.CAPAV0140Panel2.render();		// 軸
			this.CAPAV0070Panel.render();		// 表示項目

			this.CAPAV0070Panel.$el.find("#ca_navItemCACMV0210").hide();
			this.CAPAV0070Panel.$el.find('tr[tgt-id=ca_navItemCACMV0210]').hide();
			//this.CAPAV0070Panel.render().$el.hide();		// 表示項目

			$('<hr>').appendTo(this.$('#ca_panel'));//.hide();

			this.CAPAV0030Panel.render();//.$el.hide();		// 商品
			this.CAPAV0030Panel2.render();					// 商品（２）
			this.CAPAV0020Panel.render();//.$el.hide();		// 店舗
			this.CAPAV0050Panel.render();//.$el.hide();		// 社員
			this.CAPAV0130Panel.render();//.$el.hide();		// 売上
			this.MDPAV0010Panel.render();//.$el.hide();		// 取引先

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
		//var opeDate = Ana.Util.yyyyMMdd2Date(clcom.getOpeDate());
		/*
		 * 初期設定
		 */
		var c = this.cond;
		// 期間設定 -- 特になし。
		// 縦軸
		c.vAxisList = [
			// TODO: 縦軸初期設定 - 超ハードコーディングなのでなんとかする！！！
			{
				attr: 0,
				func_id: 0,
				kind: amanp_AnaDefs.AMAN_DEFS_KIND_STORE, //1011,
				name: "",
				name2: "店舗"
			},
		];
		c.vfzerosuppress = 1;
		// 横軸
		c.hAxisList = [];
		// 表示項目
		c.dispitemlist = this.buildDispItems([
//			{
//				// 0x1710f4: itemId[0xf4] name[基準商品]
//				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_ITEM1,
//				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
//			},{
//				// 0x1710f4: itemId[0xf4] name[比較商品]
//				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_ITEM2,
//				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
//			},
			{
				// 0x1710f4: itemId[0xf4] name[併売率実績]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_RT,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			},{
				// 0x1710f1: itemId[0xf1] name[対象商品レシート枚数実績]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_RCPT1_NUM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			},{
				// 0x1710f3: itemId[0xf3] name[共通レシート枚数実績]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_RCPT3_NUM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			},{
				// 0x1710f1: itemId[0xf1] name[対象商品売上数]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_ITEM1_SALE_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			},{
				// 0x1710f1: itemId[0xf1] name[対象商品売上高]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_ITEM1_SALE_AM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			},{
				// 0x1710f1: itemId[0xf1] name[対象商品経準高]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_ITEM1_PROFIT_AM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			},{
				// 0x1710f1: itemId[0xf1] name[比較商品売上数]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_ITEM2_SALE_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			},{
				// 0x1710f1: itemId[0xf1] name[比較商品売上高]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_ITEM2_SALE_AM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			},{
				// 0x1710f1: itemId[0xf1] name[比較商品経準高]
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_ITEM2_PROFIT_AM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			}
		]);
		// 縦軸ソート
		c.dispvsortkeylist = this.buildSortkeyList([
			{
				// 0x1710f4: itemId[0xf4] name[併売率実績] - 降順
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_RT,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL,
				order: amanp_AnaSortKey.AMANP_ANA_SORTKEY_ORDER_DESCENDING,
				idx: 0
			},
			{
				// 0x1710f4: itemId[0xf4] name[併売レシート枚数] - 降順
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_RCPT3_NUM,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL,
				order: amanp_AnaSortKey.AMANP_ANA_SORTKEY_ORDER_DESCENDING,
				idx: 1
			},
		]),
		// 表示設定
		c.dispopt = {
			disp_way	: amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_H,	// 表示項目並び: 横
			f_total		: 0,	// 合計表示：あり(1)/なし(2)
			f_subtotal	: 2,	// 小計表示
			//existsum	: amanp_AnaHead.AMANP_ANA_REQ_EXISTSUM_OFF,	// 既存店集計：しない(2)
			disp_amunit	: amanp_AnaHead.AMANP_ANA_REQ_DISP_AMUNIT_1	// 表示単位：円単位
		};

        // 絞込条件: 適当な品種を指定しておく。
//        if(clcom.userInfo.unit_id == clcom.getSysparam('PAR_AMMS_UNITID_ORI')){
//            // ORIHICA
//            c.focuslist.push({
//                func_id: 1,
//                kind: 201,
//                attr: 4,
//                val: 241,
//                code: '41',
//                name: 'スーツ'
//            });
//        }
//        else
//        {
//            // ORIでなければAOKIにしておく
//            c.focuslist.push({
//                func_id: 1,
//                kind: 201,
//                attr: 4,
//                val: 101,
//                code: '01',
//                name: 'スーツ'
//            });
//        }

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
