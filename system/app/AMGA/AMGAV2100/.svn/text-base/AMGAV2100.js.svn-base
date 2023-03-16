// AMGAV2100: 新自由分析(上限緩和分析)
$(function () {
  clutil.initAnaCondition();

  // コンフィギュレーション
  // 表示項目設定を表示
  // Ana.Config.cond.CACMV0190.display = true;
  // 特定日系条件を表示
  Ana.Config.cond.MDCMV1011.sdayGroupDisplay = true;
  // 分析軸選択時の注意喚起ラベル
  // Ana.Config.cond.CACMV0180.attentionText =
  //   '※サブクラスやサイズなどの商品属性系軸を複数指定した場合、品種や商品の絞り込み条件が無いと、セル数超過エラーになる事があります';

  // メニュー画面から起動引数を clcom.pageArgs に入れて起動する。
  // pageArgs の形式等は後々に精査する。
  var args = _.defaults(
    {
      searchURI: clcom.pageId,
      // 以下4項目は直リン対策のための初期設定値。
      func_id: 2100, // TODO
      func_code: clcom.pageId,
      f_anakind: amcm_type.AMCM_VAL_ANAKIND_GROUPBY,
      anamenuitem_name: '新自由分析(上限緩和分析)',
      directExec: null,
      getIniURI: 'aman_ap_gbaproc_init',
    },
    clcom.pageArgs
  );

  // 直接実行対応 #20150516
  var directExec = args.directExec;

  // 黒帯ヘッダの「＜」戻り先
  if (args.homeUrl) {
    clcom.homeUrl = args.homeUrl;
  }
  var anaProc = new Ana.Proc(args);

  // タイトル名設定
  if (!_.isEmpty(anaProc.anamenuitem_name)) {
    $('title').text(anaProc.anamenuitem_name);
  }

  //////////////////////////////////////////////
  // View
  var MainView = Backbone.View.extend({
    // 要素
    el: $('#ca_main'),

    // 押下イベント
    events: {},

    initialize: function (opt) {
      _.extend(this, opt);
      _.bindAll(this);

      // validatorエラー時の表示領域
      this.validator = clutil.validatorWithTicker(this.$el, {
        echoback: $('.cl_echoback').hide(),
      });

      // 検索ボタンイベント
      this.anaProc.on('onSearchCompleted', this.showResultView);

      // 分析結果
      this.anaResultView = new Ana.ResultContainerView(
        _.extend(
          {
            el: $('#ca_result'),
          },
          opt
        )
      );

      // 結果表示パネル
      this.MDPAV1090Panel = new MDPAV1090PanelView({
        el: $('#ca_CAPAV0070_view'),
        $result_view: $('#ca_show_result'),
        $expand_view: $('#ca_expand_panel'),
        $clear_view: $('#ca_clear_panel'),
        $parentView: $('#ca_result'),
        anadata: this.anadata, // anaProc に入れる予定。
        anaProc: this.anaProc,
        isMDAnalyze: true,
      });

      // 期間パネル
      this.MDPAV1010Panel = new MDPAV1010PanelView({
        //				el			: $('#ca_MDPAV1010_view'),
        $view: $('#ca_panel'),
        $parentView: $('#ca_result'),
        condItemHash: this.condItemHash, // anaProc に入れる予定。
        anadata: this.anadata, // anaProc に入れる予定。
        anaProc: this.anaProc,
        fCompPeriod: false, // 比較条件なし
      });

      // 軸設定パネル
      this.MDPAV0090Panel = new MDPAV0090PanelView({
        //				el : $('#ca_MDPAV0090_view'),
        $view: $('#ca_panel'),
        $parentView: $('#ca_result'),
        anadata: this.anadata, // anaProc に入れる予定。
        anaProc: this.anaProc,
      });

      // 表示項目設定パネル
      this.MDPAV0050Panel = new MDPAV0050PanelView({
        //				el : $('#ca_MDPAV0050_view'),
        $view: $('#ca_panel'),
        $parentView: $('#ca_result'),
        anadata: this.anadata, // anaProc に入れる予定。
        anaProc: this.anaProc,
      });

      // 店舗パネル
      this.MDPAV1020Panel = new MDPAV1020PanelView({
        //				el			: $('#ca_MDPAV1020_view'),
        $view: $('#ca_panel'),
        $parentView: $('#ca_result'),
        condItemHash: this.condItemHash,
        anaProc: this.anaProc,
      });

      // 商品パネル
      this.MDPAV1030Panel = new MDPAV1030PanelView({
        //				el : $('#ca_MDPAV1030_view'),
        $view: $('#ca_panel'),
        $parentView: $('#ca_result'),
        condItemHash: this.condItemHash, // anaProc に入れる予定。
        anaProc: this.anaProc,
      });

      // 会員パネル
      this.MDPAV0100Panel = new MDPAV0100PanelView({
        //				el : $('#ca_MDPAV0100_view'),
        $view: $('#ca_panel'),
        $parentView: $('#ca_result'),
        condItemHash: this.condItemHash, // anaProc に入れる予定。
        anaProc: this.anaProc,
      });

      // 社員パネル
      this.MDPAV1050Panel = new MDPAV1050PanelView({
        //				el : $('#ca_MDPAV1050_view'),
        $view: $('#ca_panel'),
        $parentView: $('#ca_result'),
        condItemHash: this.condItemHash, // anaProc に入れる予定。
        anaProc: this.anaProc,
      });

      // 売上パネル
      this.MDPAV1130Panel = new MDPAV1130PanelView({
        //				el : $('#ca_MDPAV1130_view'),
        $view: $('#ca_panel'),
        $parentView: $('#ca_result'),
        condItemHash: this.condItemHash, // anaProc に入れる予定。
        anaProc: this.anaProc,
      });

      // 取引先パネル
      this.MDPAV0160Panel = new MDPAV0160PanelView({
        //				el : $('#ca_MDPAV0160_view'),
        $view: $('#ca_panel'),
        $parentView: $('#ca_result'),
        condItemHash: this.condItemHash, // anaProc に入れる予定。
        anaProc: this.anaProc,
      });
    },

    /**
     * 画面描写
     */
    render: function () {
      this.initUIelement();
      this.MDPAV1090Panel.render(); // 結果表示
      this.anaResultView.render(); // 結果表示View
      this.MDPAV1010Panel.render(); // 期間
      this.MDPAV0090Panel.render(); // 軸
      this.MDPAV0050Panel.render(); // 表示項目
      $('<hr>').appendTo(this.$('#ca_panel')); //.hide();
      this.MDPAV1020Panel.render(); //.$el.hide();		// 店舗
      this.MDPAV1030Panel.render(); //.$el.hide();		// 商品
      this.MDPAV0100Panel.render(); //.$el.hide();		// 会員
      this.MDPAV1050Panel.render(); //.$el.hide();		// 社員
      this.MDPAV1130Panel.render(); //.$el.hide();		// 売上
      this.MDPAV0160Panel.render(); //.$el.hide();		// 取引先
      // 初期表示時に「他分析へ」は非表示にする
      // 20220131 カタログから開いた場合の考慮漏れ対応
      if (
    		  _.where(this.anaProc.cond.dispitemlist, {
    			  dispitem_id:
    				  amgbp_AnaDispItemDefs.AMGBA_DI_G_MEMB |
    				  amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL |
    				  amgbp_AnaDispItemDefs.AMGBA_DI_I_MEMB_ACTIVE,
    		  }).length
      ) {
    	  $('#ca_btn_savelist').closest('p').show();
    	  $('.btn-group').closest('p').show();
      } else {
    	  $('#ca_btn_savelist').closest('p').hide();
    	  $('.btn-group').closest('p').hide();
      }

      return this;
    },

    // 初期データ取得後に呼ばれる関数
    initUIelement: function () {
      clutil.inputlimiter(this.$el);
      return this;
    },

    /**
     * 結果部のコンテナを表示する。
     */
    showResultView: function () {
      this.$('#ca_result').show();
      this.$('#container > .cl_dialog').empty();
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode();

      // 結果データ変更につき、結果Viewを再描画する。
      this.anaResultView.showResultView();
      this.anaResultView.render();
    },
  });

  //////////////////////////////////////////////
  // ユーザ情報(clcom.getIniJSON()相当)、他、アプリ情報などをサーバへ問い合わせる。
  anaProc
    .iniGet()
    .done(
      _.bind(function () {
        Ana.Util._initialize();

        /*
         * 初期条件
         */
        var c = this.cond;

        // 条件セットを初期化 -- カタログ条件をセットしたり、履歴条件をセットしたり
        this.initCondition();

        // タイトル名設定
        if (this.catalog && !_.isEmpty(this.catalog.name)) {
          $('title').text(this.catalog.name);
        }

        mainView = new MainView({
          condItemHash: this.condItemHash, // 条件ハッシュを作成 -- anaProc
          anadata: this.anadata,
          anaProc: this,
        });

        // ヘッダー部品
        headerView = new HeaderView({ supportGuide: true });
        headerView.render(function () {
          // 共通部品の初期化
          mainView.render();
        });

        // スクロール表示の微調整
        ch_height();
        var sc = $('html').css('overflow-y');
        if (sc == 'scroll') {
          $('html').css('overflow-y', 'auto');
          _.defer(function (sc) {
            $('html').css('overflow-y', sc);
          }, sc);
        }

        // 直接実行対応 #20150516
        if (this.directExec != null) {
          if (this.directExec == 'csv') {
            mainView.anaResultView.onCSVClick(this);
          } else if (this.directExec == 'xls') {
            mainView.anaResultView.onEXCELClick(this);
          }
        }
      }, anaProc)
    )
    .fail(function () {
      console.error('初期化に失敗', arguments);
    });
});
