// AMGAV2120: 併売分析（品種別分析）
$(function() {

	clutil.initAnaCondition();

	// コンフィギュレーション：特定日系条件をONに
	Ana.Config.cond.CACMV0011.sdayGroupDisplay = true;
	Ana.Config.cond.CACMV0210.disp_way = 'disabled';	// 表示項目並びを変更できないように。
	Ana.Config.cond.CACMV0180.nodisp_v1_i = true;			// 表示属性選択を非表示
	Ana.Config.cond.MACMV0030.required = true;			// 購入点数必須

	// メニュー画面から起動引数を clcom.pageArgs に入れて起動する。
	// pageArgs の形式等は後々に精査する。
	var args = _.defaults({
		searchURI: clcom.pageId,
		// 以下4項目は直リン対策のための初期設定値。
		func_id: 2120,
		func_code: clcom.pageId,
		f_anakind: 15,
		anamenuitem_name: "併売分析（品種別分析）",
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
				// 縦軸 - 1軸必須(軸1は「購入点数」固定、軸2は「未指定」または「品種」
				if(anaproc.cond.vAxisList.length < 1){
					var msg = '縦軸1を設定してください。';
					this.validator.setErrorInfo({_eb_: msg});
					return false;
				}
				// 購入点数分、品種が選択されているか
				var qy = 0;
				var ctg = 0;
				var i;
				for (i = 0; i < anaproc.cond.focuslist.length; i++) {
					var focus = anaproc.cond.focuslist[i];
					if (focus.kind == amanp_AnaDefs.AMAN_DEFS_KIND_RCPT_QY) {
						qy = focus.val;
					}
					if (focus.kind == amanp_AnaDefs.AMAN_DEFS_KIND_RCPT_ITGRP) {
						ctg++;
					}
				}
				if (qy > ctg) {
					var msg = '購入点数分の品種を選択してください。';
					this.validator.setErrorInfo({_eb_: msg});
					return false;
				}
				return true;
			}, this);

			// 期間パネル
			this.CAPAV0010Panel = new CAPAV0010PanelView({
				$view		: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				condItemHash: this.condItemHash,	// anaProc に入れる予定。
				anadata		: this.anadata,			// anaProc に入れる予定。
				anaProc		: this.anaProc,
				fCompPeriod : false					// 比較条件なし
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

			// 併売点数設定パネル
			this.MDPAV0030Panel = new  MDPAV0030PanelView({
//				el : $('#ca_CAPAV0070_view'),
				$view	: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				condItemHash: this.condItemHash,	// anaProc に入れる予定。
				anaProc		: this.anaProc
			});

			// 品種設定パネル
			this.MDPAV0040Panel = new  MDPAV0040PanelView({
//				el : $('#ca_CAPAV0070_view'),
				$view	: $('#ca_panel'),
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
			});

			// 表示項目設定パネル
			this.CAPAV0070Panel = new  CAPAV0070PanelView({
//				el : $('#ca_CAPAV0070_view'),
				$view	: $('#ca_panel'),
				$parentView	: $('#ca_result'),
				anadata		: this.anadata,			// anaProc に入れる予定。
				anaProc		: this.anaProc
			});
		},

		/**
		 * 画面描写
		 */
		render: function() {
			this.initUIelement();

			this.CAPAV0090Panel.render();		// 結果表示
			this.anaResultView.render();		// 結果表示View
			this.CAPAV0010Panel.render();		// 期間
			this.CAPAV0060Panel.render();		// 軸
			this.CAPAV0070Panel.render();//.$el.hide();		// 表示項目

			$('<hr>').appendTo(this.$('#ca_panel'));//.hide();

			this.MDPAV0030Panel.render();//.$el.hide();		// 併売点数選択
			this.MDPAV0040Panel.render();//.$el.hide();		// 品種選択
			this.CAPAV0020Panel.render();//.$el.hide();		// 店舗
			this.CAPAV0030Panel.render();//.$el.hide();		// 商品
			this.CAPAV0130Panel.render();//.$el.hide();		// 売上

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
			}
		];
		c.vfzerosuppress = 1;
		// 横軸
		c.hAxisList = [];
		// 表示項目
		c.dispitemlist = this.buildDispItems([
			{
				// 0x400001: itemId[0x1] name[購入点数実績]
				gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_QY,
				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			},{
                // 0x400015: itemId[0x15] name[購入金額(税抜)実績]
                gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
                dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
                sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			},{
                // 0x400040: itemId[0x40] name[客数実績]
                gbit: amanp_AnaDispItemDefs.AMAN_DI_G_CUSTOMER,
                dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_CUSTOMER_QY,
                sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			},{
                // 0x400040: itemId[0x40] name[経準高実績]
                gbit: amanp_AnaDispItemDefs.AMAN_DI_G_PROF,
                dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
                sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
			}
		]);
		var ope_date = clcom.getOpeDate();
		var dispopt = {
			close_iymd: ope_date,
			exist_iymd: ope_date
		};
		_.extend(c.dispopt, dispopt);
//		// 縦軸ソート
//		c.dispvsortkeylist = this.buildSortkeyList([
//			{
//				// 0x1710f4: itemId[0xf4] name[併売率実績] - 降順
//				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_RT,
//				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL,
//				order: amanp_AnaSortKey.AMANP_ANA_SORTKEY_ORDER_DESCENDING,
//				idx: 0
//			},
//			{
//				// 0x1710f4: itemId[0xf4] name[併売レシート枚数] - 降順
//				dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_BASKET_RCPT3_NUM,
//				sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL,
//				order: amanp_AnaSortKey.AMANP_ANA_SORTKEY_ORDER_DESCENDING,
//				idx: 1
//			},
//		]),
//		// 表示設定
//		c.dispopt = {
//			disp_way	: amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_V,	// 表示項目並び: 縦
//			f_total		: 1,	// 合計表示：あり(1)/なし(2)
//			f_subtotal	: 1,	// 小計表示
//			//existsum	: amanp_AnaHead.AMANP_ANA_REQ_EXISTSUM_OFF,	// 既存店集計：しない(2)
//			disp_amunit	: amanp_AnaHead.AMANP_ANA_REQ_DISP_AMUNIT_1	// 表示単位：円単位
//		};

		// 購入点数初期表示
        c.focuslist.push({
            kind: amanp_AnaDefs.AMAN_DEFS_KIND_RCPT_QY,
            val: 1,
            name: '1',
            anaattr: {
            	id: 1, code: '1', name: '1'
            }
        });
//        // 絞込条件: 適当な品種を指定しておく。
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
