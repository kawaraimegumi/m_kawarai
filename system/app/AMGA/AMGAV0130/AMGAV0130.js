// AMGAV0100: 自由分析
$(function() {

	clutil.initAnaCondition();

	// コンフィギュレーション
	// 表示項目設定を表示
	Ana.Config.cond.CACMV0190.display = true;
	// 特定日系条件を表示
	Ana.Config.cond.CACMV0011.sdayGroupDisplay = true;
	// 分析軸選択時の注意喚起ラベル
	Ana.Config.cond.CACMV0180.attentionText = '※サブクラスやサイズなどの商品属性系軸を複数指定した場合、品種や商品の絞り込み条件が無いと、セル数超過エラーになる事があります';

	// メニュー画面から起動引数を clcom.pageArgs に入れて起動する。
	// pageArgs の形式等は後々に精査する。
	var args = _.defaults({
		////searchURI: clcom.pageId,
		searchURI: "AMGAV0100",		// 直指定にしておく
		// 以下4項目は直リン対策のための初期設定値。
		func_id: 1013,
		////func_code: clcom.pageId,
		func_code: "AMGAV0100",		// 直指定にしておく
		f_anakind: 11,
		anamenuitem_name: "自由分析（世話人代表向け）",
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

//// ゾーンAJA向けには出さない #20151018
////			// 取引先パネル
////			this.MDPAV0010Panel = new MDPAV0010PanelView({
////  //				el : $('#ca_MDPAV0010_view'),
////				$view		: $('#ca_panel'),
////				$parentView	: $('#ca_result'),
////				condItemHash: this.condItemHash,	// anaProc に入れる予定。
////				anaProc		: this.anaProc
////			});
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
			this.CAPAV0070Panel.render();		// 表示項目

			$('<hr>').appendTo(this.$('#ca_panel'));//.hide();

			this.CAPAV0020Panel.render();//.$el.hide();		// 店舗
//// ゾーンAJA向けには商品仕様は出さない #20151018
////		this.CAPAV0030Panel.render();//.$el.hide();		// 商品
			this.CAPAV0030Panel.render(1);//.$el.hide();	// 商品
			this.CAPAV0050Panel.render();//.$el.hide();		// 社員
			this.CAPAV0130Panel.render();//.$el.hide();		// 売上
//// ゾーンAJA向けには出さない #20151018
////		this.MDPAV0010Panel.render();//.$el.hide();		// 取引先

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

		/*
		 * 初期条件
		 */
		var c = this.cond;

        // 表示項目
        c.dispitemlist = this.buildDispItems([
            {
                // 0x111001: itemId[0x1] name[購入点数実績]
                gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
                dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_QY,
                sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
            },{
                // 0x111015: itemId[0x15] name[購入金額(税抜)実績]
                gbit: amanp_AnaDispItemDefs.AMAN_DI_G_SALE,
                dispItemId: amanp_AnaDispItemDefs.AMAN_DI_I_AM,
                sbit: amanp_AnaDispItemDefs.AMAN_DI_S_VAL
            }
		]);

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
