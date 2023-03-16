$(function () {
  var AMDBV0060 = Backbone.View.extend({
    el: $('body'),
    events: {
      'click #searchButton': 'onclickSearchButton', // [表示]押下
    },

    initialize: function () {
      _.bindAll(this);
      // 基盤
      this.baseView = new mdbBaseView({
        getPageArgs: _.bind(function () {
          return this.getRequest().xxx;
        }, this),
      });
      // ランキング対象(表示項目)
      this.rankItem = new mdbSelect({
        el: this.$('#rankItem'),
        list: [
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_SALE_AM,
            name: '売上高',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_SALE_QY,
            name: '売上数',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_PROF_AM,
            name: '経準高',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_PROF_AM_RT,
            name: '経準率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_CUSTOMER_QY,
            name: '客数',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_CUSTOMER_UAM,
            name: '客単価',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_SALE_1PRICE,
            name: '一品単価',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_CUST_SALE_QY,
            name: '買上点数',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_PROFIT_AM,
            name: '営業利益',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_BY3,
            name: 'BY3点付着率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_SHOES,
            name: 'シューズ付着率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_EIGHT,
            name: 'エイトストップ付着率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_HEART,
            name: 'ハートシック付着率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_PLT,
            name: 'プリーツ付着率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_SPC,
            name: 'SPCメンズ付着率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_L_SPC,
            name: 'SPCレディス付着率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_JUST,
            name: 'ジャスト感付着率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_NANO,
            name: 'ナノクリーン付着率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_DRY,
            name: 'ドライパッド付着率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_RR_SUITS,
            name: 'スーツ関連率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_RR_JK,
            name: 'JK関連率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_DR_JC3,
            name: '重中3着決定率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_RR_SL,
            name: 'SL関連率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_DR_SL3,
            name: 'SL3本決定率',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CQY_J,
            name: '重衣料客数',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CUP_J,
            name: '重衣料客単価',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CCP_J,
            name: '重衣料C単価',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CQY_C,
            name: '中衣料客数',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CUP_C,
            name: '中衣料客単価',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CCP_C,
            name: '中衣料C単価',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AM_L,
            name: 'レディス売上高',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CQY_L,
            name: 'レディススーツ・コート客数',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CUP_L,
            name: 'レディススーツ・コート客単価',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CCP_L,
            name: 'レディススーツ・コートC単価',
          },
        ],
        onchange: _.bind(function (rankItem) {
          var rankItemId = rankItem.id;
          var list = [
            { id: amgbd_defs.AMGBD_DEFS_RANK_VAL, name: '実績' },
            { id: amgbd_defs.AMGBD_DEFS_RANK_LY_VAL, name: '前年実績' },
            { id: amgbd_defs.AMGBD_DEFS_RANK_LYRT_VAL, name: '前年比' },
            { id: amgbd_defs.AMGBD_DEFS_RANK_LYDF_VAL, name: '前年差' },
          ];
          var list2 = [
            { id: amgbd_defs.AMGBD_DEFS_RANK_VAL, name: '実績' },
            { id: amgbd_defs.AMGBD_DEFS_RANK_PLAN_VAL, name: '計画値' },
            { id: amgbd_defs.AMGBD_DEFS_RANK_PLANRT_VAL, name: '計画比' },
            { id: amgbd_defs.AMGBD_DEFS_RANK_PLANDF_VAL, name: '計画差' },
            { id: amgbd_defs.AMGBD_DEFS_RANK_LY_VAL, name: '前年実績' },
            { id: amgbd_defs.AMGBD_DEFS_RANK_LYRT_VAL, name: '前年比' },
            { id: amgbd_defs.AMGBD_DEFS_RANK_LYDF_VAL, name: '前年差' },
          ];
          switch (rankItemId) {
            case amgbd_defs.AMGBD_DEFS_RANK_SALE_AM: // 売上高
            case amgbd_defs.AMGBD_DEFS_RANK_PROF_AM: // 経準高
            case amgbd_defs.AMGBD_DEFS_RANK_PROFIT_AM: // 営業利益
              list = _.union(list2, [
                { id: amgbd_defs.AMGBD_DEFS_RANK_SUMRT_VAL, name: '構成比' },
              ]);
              break;
            case amgbd_defs.AMGBD_DEFS_RANK_SALE_QY: // 売上数
            case amgbd_defs.AMGBD_DEFS_RANK_CUSTOMER_QY: // 客数
              list = _.union(list, [
                { id: amgbd_defs.AMGBD_DEFS_RANK_SUMRT_VAL, name: '構成比' },
              ]);
              break;
            case amgbd_defs.AMGBD_DEFS_RANK_PROF_AM_RT: // 経準率
              list = list2;
              break;
            default:
              break;
          }
          this.rankItemVal.setList(list);

          var $cond = this.$('#cond');
          switch (rankItemId) {
            case amgbd_defs.AMGBD_DEFS_RANK_SALE_AM: // 売上高
            case amgbd_defs.AMGBD_DEFS_RANK_SALE_QY: // 売上数
            case amgbd_defs.AMGBD_DEFS_RANK_PROF_AM: // 経準高
            case amgbd_defs.AMGBD_DEFS_RANK_PROF_AM_RT: // 経準率
            case amgbd_defs.AMGBD_DEFS_RANK_CUSTOMER_QY: // 客数
            case amgbd_defs.AMGBD_DEFS_RANK_CUSTOMER_UAM: // 客単価
            case amgbd_defs.AMGBD_DEFS_RANK_SALE_1PRICE: // 一品単価
            case amgbd_defs.AMGBD_DEFS_RANK_CUST_SALE_QY: // 買上点数
              $cond.show();
              break;
            default:
              $cond.hide();
              break;
          }
        }, this),
      });
      // ランキング対象(値)
      this.rankItemVal = new mdbSelect({
        el: this.$('#rankItemVal'),
        list: [
          { id: amgbd_defs.AMGBD_DEFS_RANK_VAL, name: '実績' },
          { id: amgbd_defs.AMGBD_DEFS_RANK_PLAN_VAL, name: '計画値' },
          { id: amgbd_defs.AMGBD_DEFS_RANK_PLANRT_VAL, name: '計画比' },
          { id: amgbd_defs.AMGBD_DEFS_RANK_PLANDF_VAL, name: '計画差' },
          { id: amgbd_defs.AMGBD_DEFS_RANK_LY_VAL, name: '前年実績' },
          { id: amgbd_defs.AMGBD_DEFS_RANK_LYRT_VAL, name: '前年比' },
          { id: amgbd_defs.AMGBD_DEFS_RANK_LYDF_VAL, name: '前年差' },
          { id: amgbd_defs.AMGBD_DEFS_RANK_SUMRT_VAL, name: '構成比' },
        ],
      });
      // 期間
      this.period = new mdbPeriod({ el: this.$('#period') });
      // 店舗
      this.orgTree = new mdbOrgTree({
        el: this.$('#orgTree'),
        onchange: _.bind(function (orgTree) {
          // 事業ユニット変更時のみ品種をsetし直す
          if (orgTree.unit.org_id == this.itgrpTree.cond.parent_id) {
            return;
          }
          return this.setItgrpTree();
        }, this),
      });
      // 品種
      this.itgrpTree = new mdbItgrpTree({ el: this.$('#itgrpTree') });
      // アプリ実績
      this.app = new mdbSelect({
    	 el: this.$('#app'),
    	 list: [
    	  { id: 0, name: '全体' },
    	  { id: amgbd_defs.AMGBD_DEFS_COND_APP_ONLY, name: 'アプリ実績'},
        ],
        onchange: _.bind(function (app) {
          if (!app.id) {
            return;
          }
          this.sex.set({ id: 0 }); // 男女は同時に選択できない
          this.age.set({ id: 0 }); // 年代は同時に選択できない
          this.market.set({ id: 0 }); // マーケットは同時に選択できない
        }, this),
      });
      // 男女
      this.sex = new mdbSelect({
        el: this.$('#sex'),
        list: [
          { id: 0, name: '全体' },
          { id: amgbd_defs.AMGBD_DEFS_COND_SEX_MAN, name: '男性' },
          { id: amgbd_defs.AMGBD_DEFS_COND_SEX_WOMAN, name: '女性' },
        ],
        onchange: _.bind(function (sex) {
          if (!sex.id) {
            return;
          }
          this.app.set({ id: 0 }); // アプリ実績は同時に選択できない
          this.market.set({ id: 0 }); // マーケットは同時に選択できない
          this.newmemb.set({ id: 0 }); // 会員・非会員は同時に選択できない
        }, this),
      });
      // 年代
      this.age = new mdbSelect({
        el: this.$('#age'),
        list: [
          { id: 0, name: '全体' },
          { id: amgbd_defs.AMGBD_DEFS_COND_AGE_10, name: '10代' },
          { id: amgbd_defs.AMGBD_DEFS_COND_AGE_20, name: '20代' },
          { id: amgbd_defs.AMGBD_DEFS_COND_AGE_30, name: '30代' },
          { id: amgbd_defs.AMGBD_DEFS_COND_AGE_40, name: '40代' },
          { id: amgbd_defs.AMGBD_DEFS_COND_AGE_50, name: '50代' },
          { id: amgbd_defs.AMGBD_DEFS_COND_AGE_60, name: '60代' },
          { id: amgbd_defs.AMGBD_DEFS_COND_AGE_70, name: '70代' },
        ],
        onchange: _.bind(function (age) {
          if (!age.id) {
            return;
          }
          this.app.set({ id: 0 }); // アプリ実績は同時に選択できない
          this.market.set({ id: 0 }); // マーケットは同時に選択できない
          this.newmemb.set({ id: 0 }); // 会員・非会員は同時に選択できない
        }, this),
      });
      // マーケット
      this.market = new mdbSelect({
        el: this.$('#market'),
        list: [
          {
            id: 0,
            name: '全体',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_GEN_SUM,
            name: '一般計',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_GEN_M,
            name: '一般メンズ',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_GEN_W,
            name: '一般レディス',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_FK_SUM,
            name: 'FK計',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_FK_M,
            name: 'FKメンズ',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_FK_W,
            name: 'FKレディス',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_FD_SUM,
            name: 'FD計',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_FD_M,
            name: 'FDメンズ',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_FD_W,
            name: 'FDレディス',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_RT_SUM,
            name: 'RT計',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_RT_M,
            name: 'RTメンズ',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_RT_W,
            name: 'RTレディス',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_COAC,
            name: '成人式',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_DUTY_FREE_SUM,
            name: '免税計',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_DUTY_FREE_M,
            name: '免税メンズ',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_COND_MARKET_TYPE_DUTY_FREE_W,
            name: '免税レディス',
          },
        ],
        onchange: _.bind(function (market) {
          if (!market.id) {
            return;
          }
          this.app.set({ id: 0 }); // アプリ実績は同時に選択できない
          this.sex.set({ id: 0 }); // 男女は同時に選択できない
          this.age.set({ id: 0 }); // 年代は同時に選択できない
          this.newmemb.set({ id: 0 }); // 会員・非会員は同時に選択できない
        }, this),
      });
      // 会員・非会員
      this.newmemb = new mdbSelect({
        el: this.$('#newmemb'),
        list: [
          { id: 0, name: '全体' },
          { id: amgbd_defs.AMGBD_DEFS_COND_NEWMEMB_MEMB, name: '既存会員' },
          { id: amgbd_defs.AMGBD_DEFS_COND_NEWMEMB_NEW, name: '新規会員' },
          { id: amgbd_defs.AMGBD_DEFS_COND_NEWMEMB_OTHER, name: '非会員' },
        ],
        onchange: _.bind(function (newmemb) {
          if (!newmemb.id) {
            return;
          }
          this.sex.set({ id: 0 }); // 男女は同時に選択できない
          this.age.set({ id: 0 }); // 年代は同時に選択できない
          this.market.set({ id: 0 }); // マーケットは同時に選択できない
        }, this),
      });

      $(window).resize(this.onresize);
    },

    // 初期値設定(通信はこちらで行う)
    initialize2: function () {
      var pageArgs = clcom.pageArgs || {};
      return Promise.resolve()
        .then(this.baseView.set)
        .then(_.bind(this.rankItem.set, this, pageArgs.rankItem))
        .then(this.rankItem.onchange)
        .then(_.bind(this.period.set, this, pageArgs.period))
        .then(
          _.bind(
            this.orgTree.set,
            this,
            pageArgs.orgTree || clcom.userInfo.orgTree // 引き継いだ情報がない場合はログインした店舗を設定
          )
        )
        .then(_.bind(this.setItgrpTree, this, pageArgs.itgrpTree))
        .then(
          _.bind(
        	this.app.set,
        	this,
        	pageArgs.newapp ? {id: amgbd_defs.AMGBD_DEFS_COND_APP_ONLY, name: 'アプリ実績'} : {id: 0, name: '全体'}))
        .then(this.app.onchange)
        .then(_.bind(this.sex.set, this, pageArgs.sex))
        .then(this.sex.onchange)
        .then(_.bind(this.age.set, this, pageArgs.age))
        .then(this.age.onchange)
        .then(_.bind(this.market.set, this, pageArgs.market))
        .then(this.market.onchange)
        .then(_.bind(this.newmemb.set, this, pageArgs.newmemb))
        .then(_.bind(this.newmemb.set, this, pageArgs.newapp))
        .then(this.newmemb.onchange)
        .then(this.onclickSearchButton);
    },

    // 品種 setter
    setItgrpTree: function (itgrpTree) {
      // 店舗で再検索する
      return this.itgrpTree.set(itgrpTree, {
        parent_id: this.orgTree.unit.get().org_id,
      });
    },

    // [表示]押下時の処理
    onclickSearchButton: function (e) {
      var isValid = true;
      if (!this.period.validate()) {
        // 期間未指定
        this.baseView.validator.setErrorHeader(clmsg.cl_echoback);
        isValid = false;
      }
      if (!isValid) {
        return;
      }
      return this.search();
    },

    // 検索
    search: function (request = this.getRequest()) {
      return clutil
        .postJSON(clcom.pageId, _.omit(request, 'xxx')) // 必要なものだけ送る
        .then(
          _.bind(function (response) {
            this.setRequest(request);
            this.setResponse(response, request);
          }, this),
          _.bind(function (response) {
            this.setError(response);
          }, this)
        );
    },

    // リクエスト getter
    getRequest: function () {
      var isHidden = Boolean(this.$('#cond:hidden').length);
      var rankItem = this.rankItem.get();
      var rankItemVal = this.rankItemVal.get();
      var period = this.period.get();
      var orgTree = this.orgTree.get();
      var itgrpTree = isHidden
        ? {
            div: _.first(this.itgrpTree.div.getList()),
            ctg: _.first(this.itgrpTree.ctg.getList()),
          }
        : this.itgrpTree.get();
      var app = isHidden ? _.first(this.app.getList()) : this.app.get();
      var sex = isHidden ? _.first(this.sex.getList()) : this.sex.get();
      var age = isHidden ? _.first(this.age.getList()) : this.age.get();
      var market = isHidden
        ? _.first(this.market.getList())
        : this.market.get();
      var newmemb = isHidden
        ? _.first(this.newmemb.getList())
        : this.newmemb.get();
      return {
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
        cond: {
          rank_item: rankItem.id,
          rank_item_val: rankItemVal.id,
          date_type: period.type,
          term_from: period.from,
          term_to: period.to,
          unit_id: orgTree.unit.org_id,
          area_id: orgTree.area.org_id,
          zone_id: orgTree.zone.org_id,
          org_id: orgTree.org.org_id,
          div_id: itgrpTree.div.itgrp_id,
          ctg_id: itgrpTree.ctg.itgrp_id,
          app: app.id,
          sex: sex.id,
          age: age.id,
          market: market.id,
          newmemb: newmemb.id,
        },
        // 以下は通信に無関係
        xxx: {
          rankItem: rankItem,
          rankItemVal: rankItemVal,
          period: period,
          orgTree: orgTree,
          itgrpTree: itgrpTree,
          app: app,
          sex: sex,
          age: age,
          market: market,
          newmemb: newmemb,
        },
      };
    },

    // リクエスト setter
    setRequest: function (request) {
      this.request = _.deepClone(request); // 最新のリクエストを保持
      var xxx = request.xxx;
      var orgTree = xxx.orgTree;
      var area = orgTree.area;
      var zone = orgTree.zone;
      var org = orgTree.org;
      this.$('#request').get(0).innerText = _.compact([
        area.name,
        zone.org_id ? zone.name : '',
        org.org_id ? org.name : '',
      ]).join(' ');
      var itgrpTree = xxx.itgrpTree;
      var div = itgrpTree.div;
      var ctg = itgrpTree.ctg;
      var app = xxx.app;
      var sex = xxx.sex;
      var age = xxx.age;
      var market = xxx.market;
      var newmemb = xxx.newmemb;
      var rankItem = xxx.rankItem;
      this.$('#request2').get(0).innerText = _.compact(
        _.union(
          this.$('#cond:hidden').length
            ? []
            : [
                ctg.itgrp_id ? ctg.name : div.name,
                (sex.id ? sex.name : '') + (age.id ? age.name : ''),
                market.id ? market.name : '',
                newmemb.id ? newmemb.name : '',
              ],
          [rankItem.name]
        )
      ).join(' - ');
    },

    // レスポンス setter
    setResponse: function (response, request) {
      this.response = _.deepClone(response); // 最新のレスポンスを保持
      this.setRspRec(response, request); // ランキングレスポンス
      this.setZoneRankList(response, request); // ゾーンランキングリスト
      this.setAllRankList(response, request); // 全国ランキングリスト
      this.onresize();
    },

    // ランキングレスポンス setter
    setRspRec: function (response, request) {
      var rspRec = response.rsp_rec;
      var rec = rspRec.rec;
      var nf = mdbUtil.numberFormatMap;
      var rankItem = request.xxx.rankItem;
      switch (rankItem.id) {
        case amgbd_defs.AMGBD_DEFS_RANK_SALE_AM: // 売上高
          var val = nf.sale_am(rec.sale_am);
          var lyVal = nf.ly_sale_am(rec.ly_sale_am);
          var lyrtVal = nf.lyrt_sale_am(rec.lyrt_sale_am);
          var lydfVal = nf.lydf_sale_am(rec.lydf_sale_am);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_SALE_QY: // 売上数
          var val = nf.sale_qy(rec.sale_qy);
          var lyVal = nf.ly_sale_qy(rec.ly_sale_qy);
          var lyrtVal = nf.lyrt_sale_qy(rec.lyrt_sale_qy);
          var lydfVal = nf.lydf_sale_qy(rec.lydf_sale_qy);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_PROF_AM: // 経準高
          var val = nf.prof_am(rec.prof_am);
          var lyVal = nf.ly_prof_am(rec.ly_prof_am);
          var lyrtVal = nf.lyrt_prof_am(rec.lyrt_prof_am);
          var lydfVal = nf.lydf_prof_am(rec.lydf_prof_am);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_PROF_AM_RT: // 経準率
          var val = nf.prof_am_rt(rec.prof_am_rt);
          var lyVal = nf.ly_prof_am_rt(rec.ly_prof_am_rt);
          var lyrtVal = nf.lyrt_prof_am_rt(rec.lyrt_prof_am_rt);
          var lydfVal = nf.lydf_prof_am_rt(rec.lydf_prof_am_rt);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_CUSTOMER_QY: // 客数
          var val = nf.customer_qy(rec.customer_qy);
          var lyVal = nf.ly_customer_qy(rec.ly_customer_qy);
          var lyrtVal = nf.lyrt_customer_qy(rec.lyrt_customer_qy);
          var lydfVal = nf.lydf_customer_qy(rec.lydf_customer_qy);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_CUSTOMER_UAM: // 客単価
          var val = nf.customer_uam(rec.customer_uam);
          var lyVal = nf.ly_customer_uam(rec.ly_customer_uam);
          var lyrtVal = nf.lyrt_customer_uam(rec.lyrt_customer_uam);
          var lydfVal = nf.lydf_customer_uam(rec.lydf_customer_uam);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_SALE_1PRICE: // 一品単価
          var val = nf.sale_1price(rec.sale_1price);
          var lyVal = nf.ly_sale_1price(rec.ly_sale_1price);
          var lyrtVal = nf.lyrt_sale_1price(rec.lyrt_sale_1price);
          var lydfVal = nf.lydf_sale_1price(rec.lydf_sale_1price);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_CUST_SALE_QY: // 買上点数
          var val = nf.cust_sale_qy(rec.cust_sale_qy);
          var lyVal = nf.ly_cust_sale_qy(rec.ly_cust_sale_qy);
          var lyrtVal = nf.lyrt_cust_sale_qy(rec.lyrt_cust_sale_qy);
          var lydfVal = nf.lydf_cust_sale_qy(rec.lydf_cust_sale_qy);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_PROFIT_AM: // 営業利益
          var val = nf.profit_am(rec.profit_am);
          var lyVal = nf.ly_profit_am(rec.ly_profit_am);
          var lyrtVal = nf.lyrt_profit_am(rec.lyrt_profit_am);
          var lydfVal = nf.lydf_profit_am(rec.lydf_profit_am);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_BY3: // BY3点付着率
          var val = nf.levelup_ar_by3(rec.levelup_ar_by3);
          var lyVal = nf.ly_levelup_ar_by3(rec.ly_levelup_ar_by3);
          var lyrtVal = nf.lyrt_levelup_ar_by3(rec.lyrt_levelup_ar_by3);
          var lydfVal = nf.lydf_levelup_ar_by3(rec.lydf_levelup_ar_by3);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_SHOES: // シューズ付着率
          var val = nf.levelup_ar_shoes(rec.levelup_ar_shoes);
          var lyVal = nf.ly_levelup_ar_shoes(rec.ly_levelup_ar_shoes);
          var lyrtVal = nf.lyrt_levelup_ar_shoes(rec.lyrt_levelup_ar_shoes);
          var lydfVal = nf.lydf_levelup_ar_shoes(rec.lydf_levelup_ar_shoes);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_EIGHT: // エイトストップ付着率
          var val = nf.levelup_ar_eight(rec.levelup_ar_eight);
          var lyVal = nf.ly_levelup_ar_eight(rec.ly_levelup_ar_eight);
          var lyrtVal = nf.lyrt_levelup_ar_eight(rec.lyrt_levelup_ar_eight);
          var lydfVal = nf.lydf_levelup_ar_eight(rec.lydf_levelup_ar_eight);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_HEART: // ハートシック付着率
          var val = nf.levelup_ar_heart(rec.levelup_ar_heart);
          var lyVal = nf.ly_levelup_ar_heart(rec.ly_levelup_ar_heart);
          var lyrtVal = nf.lyrt_levelup_ar_heart(rec.lyrt_levelup_ar_heart);
          var lydfVal = nf.lydf_levelup_ar_heart(rec.lydf_levelup_ar_heart);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_PLT: // プリーツ付着率
          var val = nf.levelup_ar_plt(rec.levelup_ar_plt);
          var lyVal = nf.ly_levelup_ar_plt(rec.ly_levelup_ar_plt);
          var lyrtVal = nf.lyrt_levelup_ar_plt(rec.lyrt_levelup_ar_plt);
          var lydfVal = nf.lydf_levelup_ar_plt(rec.lydf_levelup_ar_plt);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_SPC: // SPCメンズ付着率
          var val = nf.levelup_ar_spc(rec.levelup_ar_spc);
          var lyVal = nf.ly_levelup_ar_spc(rec.ly_levelup_ar_spc);
          var lyrtVal = nf.lyrt_levelup_ar_spc(rec.lyrt_levelup_ar_spc);
          var lydfVal = nf.lydf_levelup_ar_spc(rec.lydf_levelup_ar_spc);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_L_SPC: // SPCレディス付着率
          var val = nf.levelup_ar_l_spc(rec.levelup_ar_l_spc);
          var lyVal = nf.ly_levelup_ar_l_spc(rec.ly_levelup_ar_l_spc);
          var lyrtVal = nf.lyrt_levelup_ar_l_spc(rec.lyrt_levelup_ar_l_spc);
          var lydfVal = nf.lydf_levelup_ar_l_spc(rec.lydf_levelup_ar_l_spc);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_JUST: // ジャスト感付着率
          var val = nf.levelup_ar_just(rec.levelup_ar_just);
          var lyVal = nf.ly_levelup_ar_just(rec.ly_levelup_ar_just);
          var lyrtVal = nf.lyrt_levelup_ar_just(rec.lyrt_levelup_ar_just);
          var lydfVal = nf.lydf_levelup_ar_just(rec.lydf_levelup_ar_just);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_NANO: // ナノクリーン付着率
          var val = nf.levelup_ar_nano(rec.levelup_ar_nano);
          var lyVal = nf.ly_levelup_ar_nano(rec.ly_levelup_ar_nano);
          var lyrtVal = nf.lyrt_levelup_ar_nano(rec.lyrt_levelup_ar_nano);
          var lydfVal = nf.lydf_levelup_ar_nano(rec.lydf_levelup_ar_nano);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_DRY: // ドライパッド付着率
          var val = nf.levelup_ar_dry(rec.levelup_ar_dry);
          var lyVal = nf.ly_levelup_ar_dry(rec.ly_levelup_ar_dry);
          var lyrtVal = nf.lyrt_levelup_ar_dry(rec.lyrt_levelup_ar_dry);
          var lydfVal = nf.lydf_levelup_ar_dry(rec.lydf_levelup_ar_dry);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_RR_SUITS: // スーツ関連率
          var val = nf.levelup_rr_suits(rec.levelup_rr_suits);
          var lyVal = nf.ly_levelup_rr_suits(rec.ly_levelup_rr_suits);
          var lyrtVal = nf.lyrt_levelup_rr_suits(rec.lyrt_levelup_rr_suits);
          var lydfVal = nf.lydf_levelup_rr_suits(rec.lydf_levelup_rr_suits);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_RR_JK: // JK関連率
          var val = nf.levelup_rr_jk(rec.levelup_rr_jk);
          var lyVal = nf.ly_levelup_rr_jk(rec.ly_levelup_rr_jk);
          var lyrtVal = nf.lyrt_levelup_rr_jk(rec.lyrt_levelup_rr_jk);
          var lydfVal = nf.lydf_levelup_rr_jk(rec.lydf_levelup_rr_jk);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_DR_JC3: // 重中3着決定率
          var val = nf.levelup_dr_jc3(rec.levelup_dr_jc3);
          var lyVal = nf.ly_levelup_dr_jc3(rec.ly_levelup_dr_jc3);
          var lyrtVal = nf.lyrt_levelup_dr_jc3(rec.lyrt_levelup_dr_jc3);
          var lydfVal = nf.lydf_levelup_dr_jc3(rec.lydf_levelup_dr_jc3);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_RR_SL: // SL関連率
          var val = nf.levelup_rr_sl(rec.levelup_rr_sl);
          var lyVal = nf.ly_levelup_rr_sl(rec.ly_levelup_rr_sl);
          var lyrtVal = nf.lyrt_levelup_rr_sl(rec.lyrt_levelup_rr_sl);
          var lydfVal = nf.lydf_levelup_rr_sl(rec.lydf_levelup_rr_sl);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_DR_SL3: // SL3本決定率
          var val = nf.levelup_dr_sl3(rec.levelup_dr_sl3);
          var lyVal = nf.ly_levelup_dr_sl3(rec.ly_levelup_dr_sl3);
          var lyrtVal = nf.lyrt_levelup_dr_sl3(rec.lyrt_levelup_dr_sl3);
          var lydfVal = nf.lydf_levelup_dr_sl3(rec.lydf_levelup_dr_sl3);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CQY_J: // 重衣料客数
          var val = nf.levelup_cqy_j(rec.levelup_cqy_j);
          var lyVal = nf.ly_levelup_cqy_j(rec.ly_levelup_cqy_j);
          var lyrtVal = nf.lyrt_levelup_cqy_j(rec.lyrt_levelup_cqy_j);
          var lydfVal = nf.lydf_levelup_cqy_j(rec.lydf_levelup_cqy_j);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CUP_J: // 重衣料客単価
          var val = nf.levelup_cup_j(rec.levelup_cup_j);
          var lyVal = nf.ly_levelup_cup_j(rec.ly_levelup_cup_j);
          var lyrtVal = nf.lyrt_levelup_cup_j(rec.lyrt_levelup_cup_j);
          var lydfVal = nf.lydf_levelup_cup_j(rec.lydf_levelup_cup_j);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CCP_J: // 重衣料C単価
          var val = nf.levelup_ccp_j(rec.levelup_ccp_j);
          var lyVal = nf.ly_levelup_ccp_j(rec.ly_levelup_ccp_j);
          var lyrtVal = nf.lyrt_levelup_ccp_j(rec.lyrt_levelup_ccp_j);
          var lydfVal = nf.lydf_levelup_ccp_j(rec.lydf_levelup_ccp_j);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CQY_C: // 中衣料客数
          var val = nf.levelup_cqy_c(rec.levelup_cqy_c);
          var lyVal = nf.ly_levelup_cqy_c(rec.ly_levelup_cqy_c);
          var lyrtVal = nf.lyrt_levelup_cqy_c(rec.lyrt_levelup_cqy_c);
          var lydfVal = nf.lydf_levelup_cqy_c(rec.lydf_levelup_cqy_c);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CUP_C: // 中衣料客単価
          var val = nf.levelup_cup_c(rec.levelup_cup_c);
          var lyVal = nf.ly_levelup_cup_c(rec.ly_levelup_cup_c);
          var lyrtVal = nf.lyrt_levelup_cup_c(rec.lyrt_levelup_cup_c);
          var lydfVal = nf.lydf_levelup_cup_c(rec.lydf_levelup_cup_c);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CCP_C: // 中衣料C単価
          var val = nf.levelup_ccp_c(rec.levelup_ccp_c);
          var lyVal = nf.ly_levelup_ccp_c(rec.ly_levelup_ccp_c);
          var lyrtVal = nf.lyrt_levelup_ccp_c(rec.lyrt_levelup_ccp_c);
          var lydfVal = nf.lydf_levelup_ccp_c(rec.lydf_levelup_ccp_c);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AM_L: // レディス売上高
          var val = nf.levelup_am_l(rec.levelup_am_l);
          var lyVal = nf.ly_levelup_am_l(rec.ly_levelup_am_l);
          var lyrtVal = nf.lyrt_levelup_am_l(rec.lyrt_levelup_am_l);
          var lydfVal = nf.lydf_levelup_am_l(rec.lydf_levelup_am_l);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CQY_L: // レディススーツ・コート客数
          var val = nf.levelup_cqy_l(rec.levelup_cqy_l);
          var lyVal = nf.ly_levelup_cqy_l(rec.ly_levelup_cqy_l);
          var lyrtVal = nf.lyrt_levelup_cqy_l(rec.lyrt_levelup_cqy_l);
          var lydfVal = nf.lydf_levelup_cqy_l(rec.lydf_levelup_cqy_l);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CUP_L: // レディススーツ・コート客単価
          var val = nf.levelup_cup_l(rec.levelup_cup_l);
          var lyVal = nf.ly_levelup_cup_l(rec.ly_levelup_cup_l);
          var lyrtVal = nf.lyrt_levelup_cup_l(rec.lyrt_levelup_cup_l);
          var lydfVal = nf.lydf_levelup_cup_l(rec.lydf_levelup_cup_l);
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CCP_L: // レディススーツ・コートC単価
          var val = nf.levelup_ccp_l(rec.levelup_ccp_l);
          var lyVal = nf.ly_levelup_ccp_l(rec.ly_levelup_ccp_l);
          var lyrtVal = nf.lyrt_levelup_ccp_l(rec.lyrt_levelup_ccp_l);
          var lydfVal = nf.lydf_levelup_ccp_l(rec.lydf_levelup_ccp_l);
          break;
        default:
          var val = '-';
          var lyVal = '-';
          var lyrtVal = '-';
          var lydfVal = '-';
          break;
      }
      this.$('#rspRec')
        .empty()
        .append(
          this.$('#rspRecTemplate').tmpl({
            allRank: nf.all_rank(rspRec.all_rank),
            zoneRank: nf.zone_rank(rspRec.zone_rank),
            rankItem: rankItem,
            val: val,
            lyVal: lyVal,
            lydfVal: lydfVal,
            lyrtVal: lyrtVal,
          })
        );
    },

    // ゾーンランキングリスト
    setZoneRankList: function (response, request) {
      var $field = this.$('#zoneRankList');
      if (!request.cond.org_id) {
        // 全店舗選択時は非表示
        $field.hide();
        return;
      }
      this.setTable($field, 'ゾーン店舗実績', response.zone_rank_list, request);
    },

    // 全国ランキングリスト
    setAllRankList: function (response, request) {
      var $field = this.$('#allRankList');
      if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {
        // 店舗アカウントは非表示
        $field.hide();
        return;
      }
      this.setTable(
        $field,
        request.cond.org_id ? '全国店舗実績' : '全国ゾーン実績',
        response.all_rank_list,
        request
      );
    },

    // テーブル setter
    setTable: function ($field, name, list, request) {
      if (!list.length) {
        $field.hide();
        return;
      }
      $field.show();
      var $tableTemplate = this.$('#tableTemplate');
      var $theadTemplate = this.$('#theadTemplate');
      var $tbodyTemplate = this.$('#tbodyTemplate');
      var $columnTemplate0 = this.$('#columnTemplate0');
      var $columnTemplate = this.$('#columnTemplate');
      var $rowTemplate1 = this.$('#rowTemplate1');
      var $rowTemplate2 = this.$('#rowTemplate2');
      var $dataTemplate0 = this.$('#dataTemplate0');
      var $dataTemplate = this.$('#dataTemplate');
      var nf = mdbUtil.numberFormatMap;
      var xxx = request.xxx;
      var rankItem = xxx.rankItem;
      var org = xxx.orgTree.org;
      // 全店舗が選択時はゾーンを設定する
      if (org.org_id == 0) {
    	  org = xxx.orgTree.zone;
      }
      switch (rankItem.id) {
        case amgbd_defs.AMGBD_DEFS_RANK_SALE_AM: // 売上高
          var header = [
            { name: rankItem.name, unit: '(千円)' },
            { name: '計画値', unit: '(千円)' },
            { name: '計画比', unit: '(%)' },
            { name: '計画差', unit: '(千円)' },
            { name: '前年実績', unit: '(千円)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(千円)' },
            { name: '構成比', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.sale_am(rec.sale_am) }, // 実績
              { val: nf.sale_plan_am(rec.sale_plan_am) }, // 計画値
              { val: nf.planrt_sale_am(rec.planrt_sale_am) }, // 計画比
              { val: nf.plandf_sale_am(rec.plandf_sale_am) }, // 計画差
              { val: nf.ly_sale_am(rec.ly_sale_am) }, // 前年実績
              { val: nf.lyrt_sale_am(rec.lyrt_sale_am) }, // 前年比
              { val: nf.lydf_sale_am(rec.lydf_sale_am) }, // 前年差
              { val: nf.sumrt_sale_am(rec.sumrt_sale_am) }, // 構成比
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_SALE_QY: // 売上数
          var header = [
            { name: rankItem.name, unit: '(点)' },
            { name: '前年実績', unit: '(点)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(点)' },
            { name: '構成比', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.sale_qy(rec.sale_qy) }, // 実績
              { val: nf.ly_sale_qy(rec.ly_sale_qy) }, // 前年実績
              { val: nf.lyrt_sale_qy(rec.lyrt_sale_qy) }, // 前年比
              { val: nf.lydf_sale_qy(rec.lydf_sale_qy) }, // 前年差
              { val: nf.sumrt_sale_qy(rec.sumrt_sale_qy) }, // 構成比
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_PROF_AM: // 経準高
          var header = [
            { name: rankItem.name, unit: '(千円)' },
            { name: '計画値', unit: '(千円)' },
            { name: '計画比', unit: '(%)' },
            { name: '計画差', unit: '(千円)' },
            { name: '前年実績', unit: '(千円)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(千円)' },
            { name: '構成比', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.prof_am(rec.prof_am) }, // 実績
              { val: nf.prof_plan_am(rec.prof_plan_am) }, // 計画値
              { val: nf.planrt_prof_am(rec.planrt_prof_am) }, // 計画比
              { val: nf.plandf_prof_am(rec.plandf_prof_am) }, // 計画差
              { val: nf.ly_prof_am(rec.ly_prof_am) }, // 前年実績
              { val: nf.lyrt_prof_am(rec.lyrt_prof_am) }, // 前年比
              { val: nf.lydf_prof_am(rec.lydf_prof_am) }, // 前年差
              { val: nf.sumrt_prof_am(rec.sumrt_prof_am) }, // 構成比
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_PROF_AM_RT: // 経準率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '計画値', unit: '(%)' },
            { name: '計画比', unit: '(%)' },
            { name: '計画差', unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.prof_am_rt(rec.prof_am_rt) }, // 実績
              { val: nf.prof_plan_am_rt(rec.prof_plan_am_rt) }, // 計画値
              { val: nf.planrt_prof_am_rt(rec.planrt_prof_am_rt) }, // 計画比
              { val: nf.plandf_prof_am_rt(rec.plandf_prof_am_rt) }, // 計画差
              { val: nf.ly_prof_am_rt(rec.ly_prof_am_rt) }, // 前年実績
              { val: nf.lyrt_prof_am_rt(rec.lyrt_prof_am_rt) }, // 前年比
              { val: nf.lydf_prof_am_rt(rec.lydf_prof_am_rt) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_CUSTOMER_QY: // 客数
          var header = [
            { name: rankItem.name, unit: '(名)' },
            { name: '前年実績', unit: '(名)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(名)' },
            { name: '構成比', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.customer_qy(rec.customer_qy) }, // 実績
              { val: nf.ly_customer_qy(rec.ly_customer_qy) }, // 前年実績
              { val: nf.lyrt_customer_qy(rec.lyrt_customer_qy) }, // 前年比
              { val: nf.lydf_customer_qy(rec.lydf_customer_qy) }, // 前年差
              { val: nf.sumrt_customer_qy(rec.sumrt_customer_qy) }, // 構成比
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_CUSTOMER_UAM: // 客単価
          var header = [
            { name: rankItem.name, unit: '(円)' },
            { name: '前年実績', unit: '(円)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(円)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.customer_uam(rec.customer_uam) }, // 実績
              { val: nf.ly_customer_uam(rec.ly_customer_uam) }, // 前年実績
              { val: nf.lyrt_customer_uam(rec.lyrt_customer_uam) }, // 前年比
              { val: nf.lydf_customer_uam(rec.lydf_customer_uam) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_SALE_1PRICE: // 一品単価
          var header = [
            { name: rankItem.name, unit: '(円)' },
            { name: '前年実績', unit: '(円)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(円)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.sale_1price(rec.sale_1price) }, // 実績
              { val: nf.ly_sale_1price(rec.ly_sale_1price) }, // 前年実績
              { val: nf.lyrt_sale_1price(rec.lyrt_sale_1price) }, // 前年比
              { val: nf.lydf_sale_1price(rec.lydf_sale_1price) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_CUST_SALE_QY: // 買上点数
          var header = [
            { name: rankItem.name, unit: '(点)' },
            { name: '前年実績', unit: '(点)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(点)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.cust_sale_qy(rec.cust_sale_qy) }, // 実績
              { val: nf.ly_cust_sale_qy(rec.ly_cust_sale_qy) }, // 前年実績
              { val: nf.lyrt_cust_sale_qy(rec.lyrt_cust_sale_qy) }, // 前年比
              { val: nf.lydf_cust_sale_qy(rec.lydf_cust_sale_qy) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_PROFIT_AM: // 営業利益
          var header = [
            { name: rankItem.name, unit: '(千円)' },
            { name: '計画値', unit: '(千円)' },
            { name: '計画比', unit: '(%)' },
            { name: '計画差', unit: '(千円)' },
            { name: '前年実績', unit: '(千円)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(千円)' },
            { name: '構成比', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.profit_am(rec.profit_am) }, // 実績
              { val: nf.profit_plan_am(rec.profit_plan_am) }, // 計画値
              { val: nf.planrt_profit_am(rec.planrt_profit_am) }, // 計画比
              { val: nf.plandf_profit_am(rec.plandf_profit_am) }, // 計画差
              { val: nf.ly_profit_am(rec.ly_profit_am) }, // 前年実績
              { val: nf.lyrt_profit_am(rec.lyrt_profit_am) }, // 前年比
              { val: nf.lydf_profit_am(rec.lydf_profit_am) }, // 前年差
              { val: nf.sumrt_profit_am(rec.sumrt_profit_am) }, // 構成比
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_BY3: // BY3点付着率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_ar_by3(rec.levelup_ar_by3) }, // 実績
              { val: nf.ly_levelup_ar_by3(rec.ly_levelup_ar_by3) }, // 前年実績
              { val: nf.lyrt_levelup_ar_by3(rec.lyrt_levelup_ar_by3) }, // 前年比
              { val: nf.lydf_levelup_ar_by3(rec.lydf_levelup_ar_by3) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_SHOES: // シューズ付着率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_ar_shoes(rec.levelup_ar_shoes) }, // 実績
              { val: nf.ly_levelup_ar_shoes(rec.ly_levelup_ar_shoes) }, // 前年実績
              { val: nf.lyrt_levelup_ar_shoes(rec.lyrt_levelup_ar_shoes) }, // 前年比
              { val: nf.lydf_levelup_ar_shoes(rec.lydf_levelup_ar_shoes) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_EIGHT: // エイトストップ付着率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_ar_eight(rec.levelup_ar_eight) }, // 実績
              { val: nf.ly_levelup_ar_eight(rec.ly_levelup_ar_eight) }, // 前年実績
              { val: nf.lyrt_levelup_ar_eight(rec.lyrt_levelup_ar_eight) }, // 前年比
              { val: nf.lydf_levelup_ar_eight(rec.lydf_levelup_ar_eight) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_HEART: // ハートシック付着率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_ar_heart(rec.levelup_ar_heart) }, // 実績
              { val: nf.ly_levelup_ar_heart(rec.ly_levelup_ar_heart) }, // 前年実績
              { val: nf.lyrt_levelup_ar_heart(rec.lyrt_levelup_ar_heart) }, // 前年比
              { val: nf.lydf_levelup_ar_heart(rec.lydf_levelup_ar_heart) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_PLT: // プリーツ付着率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_ar_plt(rec.levelup_ar_plt) }, // 実績
              { val: nf.ly_levelup_ar_plt(rec.ly_levelup_ar_plt) }, // 前年実績
              { val: nf.lyrt_levelup_ar_plt(rec.lyrt_levelup_ar_plt) }, // 前年比
              { val: nf.lydf_levelup_ar_plt(rec.lydf_levelup_ar_plt) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_SPC: // SPCメンズ付着率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_ar_spc(rec.levelup_ar_spc) }, // 実績
              { val: nf.ly_levelup_ar_spc(rec.ly_levelup_ar_spc) }, // 前年実績
              { val: nf.lyrt_levelup_ar_spc(rec.lyrt_levelup_ar_spc) }, // 前年比
              { val: nf.lydf_levelup_ar_spc(rec.lydf_levelup_ar_spc) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_L_SPC: // SPCレディス付着率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_ar_l_spc(rec.levelup_ar_l_spc) }, // 実績
              { val: nf.ly_levelup_ar_l_spc(rec.ly_levelup_ar_l_spc) }, // 前年実績
              { val: nf.lyrt_levelup_ar_l_spc(rec.lyrt_levelup_ar_l_spc) }, // 前年比
              { val: nf.lydf_levelup_ar_l_spc(rec.lydf_levelup_ar_l_spc) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_JUST: // ジャスト感付着率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_ar_just(rec.levelup_ar_just) }, // 実績
              { val: nf.ly_levelup_ar_just(rec.ly_levelup_ar_just) }, // 前年実績
              { val: nf.lyrt_levelup_ar_just(rec.lyrt_levelup_ar_just) }, // 前年比
              { val: nf.lydf_levelup_ar_just(rec.lydf_levelup_ar_just) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_NANO: // ナノクリーン付着率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_ar_nano(rec.levelup_ar_nano) }, // 実績
              { val: nf.ly_levelup_ar_nano(rec.ly_levelup_ar_nano) }, // 前年実績
              { val: nf.lyrt_levelup_ar_nano(rec.lyrt_levelup_ar_nano) }, // 前年比
              { val: nf.lydf_levelup_ar_nano(rec.lydf_levelup_ar_nano) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_DRY: // ドライパッド付着率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_ar_dry(rec.levelup_ar_dry) }, // 実績
              { val: nf.ly_levelup_ar_dry(rec.ly_levelup_ar_dry) }, // 前年実績
              { val: nf.lyrt_levelup_ar_dry(rec.lyrt_levelup_ar_dry) }, // 前年比
              { val: nf.lydf_levelup_ar_dry(rec.lydf_levelup_ar_dry) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_RR_SUITS: // スーツ関連率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_rr_suits(rec.levelup_rr_suits) }, // 実績
              { val: nf.ly_levelup_rr_suits(rec.ly_levelup_rr_suits) }, // 前年実績
              { val: nf.lyrt_levelup_rr_suits(rec.lyrt_levelup_rr_suits) }, // 前年比
              { val: nf.lydf_levelup_rr_suits(rec.lydf_levelup_rr_suits) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_RR_JK: // JK関連率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_rr_jk(rec.levelup_rr_jk) }, // 実績
              { val: nf.ly_levelup_rr_jk(rec.ly_levelup_rr_jk) }, // 前年実績
              { val: nf.lyrt_levelup_rr_jk(rec.lyrt_levelup_rr_jk) }, // 前年比
              { val: nf.lydf_levelup_rr_jk(rec.lydf_levelup_rr_jk) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_DR_JC3: // 重中3着決定率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_dr_jc3(rec.levelup_dr_jc3) }, // 実績
              { val: nf.ly_levelup_dr_jc3(rec.ly_levelup_dr_jc3) }, // 前年実績
              { val: nf.lyrt_levelup_dr_jc3(rec.lyrt_levelup_dr_jc3) }, // 前年比
              { val: nf.lydf_levelup_dr_jc3(rec.lydf_levelup_dr_jc3) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_RR_SL: // SL関連率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_rr_sl(rec.levelup_rr_sl) }, // 実績
              { val: nf.ly_levelup_rr_sl(rec.ly_levelup_rr_sl) }, // 前年実績
              { val: nf.lyrt_levelup_rr_sl(rec.lyrt_levelup_rr_sl) }, // 前年比
              { val: nf.lydf_levelup_rr_sl(rec.lydf_levelup_rr_sl) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_DR_SL3: // SL3本決定率
          var header = [
            { name: rankItem.name, unit: '(%)' },
            { name: '前年実績', unit: '(%)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(%)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_dr_sl3(rec.levelup_dr_sl3) }, // 実績
              { val: nf.ly_levelup_dr_sl3(rec.ly_levelup_dr_sl3) }, // 前年実績
              { val: nf.lyrt_levelup_dr_sl3(rec.lyrt_levelup_dr_sl3) }, // 前年比
              { val: nf.lydf_levelup_dr_sl3(rec.lydf_levelup_dr_sl3) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CQY_J: // 重衣料客数
          var header = [
            { name: rankItem.name, unit: '(名)' },
            { name: '前年実績', unit: '(名)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(名)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_cqy_j(rec.levelup_cqy_j) }, // 実績
              { val: nf.ly_levelup_cqy_j(rec.ly_levelup_cqy_j) }, // 前年実績
              { val: nf.lyrt_levelup_cqy_j(rec.lyrt_levelup_cqy_j) }, // 前年比
              { val: nf.lydf_levelup_cqy_j(rec.lydf_levelup_cqy_j) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CUP_J: // 重衣料客単価
          var header = [
            { name: rankItem.name, unit: '(円)' },
            { name: '前年実績', unit: '(円)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(円)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_cup_j(rec.levelup_cup_j) }, // 実績
              { val: nf.ly_levelup_cup_j(rec.ly_levelup_cup_j) }, // 前年実績
              { val: nf.lyrt_levelup_cup_j(rec.lyrt_levelup_cup_j) }, // 前年比
              { val: nf.lydf_levelup_cup_j(rec.lydf_levelup_cup_j) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CCP_J: // 重衣料C単価
          var header = [
            { name: rankItem.name, unit: '(円)' },
            { name: '前年実績', unit: '(円)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(円)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_ccp_j(rec.levelup_ccp_j) }, // 実績
              { val: nf.ly_levelup_ccp_j(rec.ly_levelup_ccp_j) }, // 前年実績
              { val: nf.lyrt_levelup_ccp_j(rec.lyrt_levelup_ccp_j) }, // 前年比
              { val: nf.lydf_levelup_ccp_j(rec.lydf_levelup_ccp_j) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CQY_C: // 中衣料客数
          var header = [
            { name: rankItem.name, unit: '(名)' },
            { name: '前年実績', unit: '(名)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(名)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_cqy_c(rec.levelup_cqy_c) }, // 実績
              { val: nf.ly_levelup_cqy_c(rec.ly_levelup_cqy_c) }, // 前年実績
              { val: nf.lyrt_levelup_cqy_c(rec.lyrt_levelup_cqy_c) }, // 前年比
              { val: nf.lydf_levelup_cqy_c(rec.lydf_levelup_cqy_c) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CUP_C: // 中衣料客単価
          var header = [
            { name: rankItem.name, unit: '(円)' },
            { name: '前年実績', unit: '(円)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(円)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_cup_c(rec.levelup_cup_c) }, // 実績
              { val: nf.ly_levelup_cup_c(rec.ly_levelup_cup_c) }, // 前年実績
              { val: nf.lyrt_levelup_cup_c(rec.lyrt_levelup_cup_c) }, // 前年比
              { val: nf.lydf_levelup_cup_c(rec.lydf_levelup_cup_c) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CCP_C: // 中衣料C単価
          var header = [
            { name: rankItem.name, unit: '(円)' },
            { name: '前年実績', unit: '(円)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(円)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_ccp_c(rec.levelup_ccp_c) }, // 実績
              { val: nf.ly_levelup_ccp_c(rec.ly_levelup_ccp_c) }, // 前年実績
              { val: nf.lyrt_levelup_ccp_c(rec.lyrt_levelup_ccp_c) }, // 前年比
              { val: nf.lydf_levelup_ccp_c(rec.lydf_levelup_ccp_c) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AM_L: // レディス売上高
          var header = [
            { name: rankItem.name, unit: '(千円)' },
            { name: '前年実績', unit: '(千円)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(千円)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_am_l(rec.levelup_am_l) }, // 実績
              { val: nf.ly_levelup_am_l(rec.ly_levelup_am_l) }, // 前年実績
              { val: nf.lyrt_levelup_am_l(rec.lyrt_levelup_am_l) }, // 前年比
              { val: nf.lydf_levelup_am_l(rec.lydf_levelup_am_l) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CQY_L: // レディススーツ・コート客数
          var header = [
            { name: rankItem.name, unit: '(名)' },
            { name: '前年実績', unit: '(名)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(名)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_cqy_l(rec.levelup_cqy_l) }, // 実績
              { val: nf.ly_levelup_cqy_l(rec.ly_levelup_cqy_l) }, // 前年実績
              { val: nf.lyrt_levelup_cqy_l(rec.lyrt_levelup_cqy_l) }, // 前年比
              { val: nf.lydf_levelup_cqy_l(rec.lydf_levelup_cqy_l) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CUP_L: // レディススーツ・コート客単価
          var header = [
            { name: rankItem.name, unit: '(円)' },
            { name: '前年実績', unit: '(円)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(円)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_cup_l(rec.levelup_cup_l) }, // 実績
              { val: nf.ly_levelup_cup_l(rec.ly_levelup_cup_l) }, // 前年実績
              { val: nf.lyrt_levelup_cup_l(rec.lyrt_levelup_cup_l) }, // 前年比
              { val: nf.lydf_levelup_cup_l(rec.lydf_levelup_cup_l) }, // 前年差
            ];
          };
          break;
        case amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_CCP_L: // レディススーツ・コートC単価
          var header = [
            { name: rankItem.name, unit: '(円)' },
            { name: '前年実績', unit: '(円)' },
            { name: '前年比', unit: '(%)' },
            { name: '前年差', unit: '(円)' },
          ];
          var row = function (rec) {
            return [
              { val: nf.levelup_ccp_l(rec.levelup_ccp_l) }, // 実績
              { val: nf.ly_levelup_ccp_l(rec.ly_levelup_ccp_l) }, // 前年実績
              { val: nf.lyrt_levelup_ccp_l(rec.lyrt_levelup_ccp_l) }, // 前年比
              { val: nf.lydf_levelup_ccp_l(rec.lydf_levelup_ccp_l) }, // 前年差
            ];
          };
          break;
        default:
          var header = [];
          var row = function (rec) {
            return [];
          };
          break;
      }
      $field
        .empty()
        .append(
          $tableTemplate
            .tmpl({ name: name })
            .find('table')
            .append(
              _.reduce(
                header,
                function ($thead, column) {
                  return $thead.append($columnTemplate.tmpl(column));
                },
                $theadTemplate.tmpl().append($columnTemplate0.tmpl())
              )
            )
            .append(
              _.reduce(
                list,
                function ($tbody, rec) {
                  return $tbody.append(
                    _.reduce(
                      row(rec),
                      function ($row, data) {
                        return $row.append($dataTemplate.tmpl(data));
                      },
                      (rec.org.id == org.org_id
                        ? $rowTemplate2 // 絞り込みで選択されている店舗は青でハイライト
                        : $rowTemplate1
                      )
                        .tmpl()
                        .append(
                          $dataTemplate0.tmpl({
                            rank: rec.rank,
                            org: rec.org.name,
                          })
                        )
                    )
                  );
                },
                $tbodyTemplate.tmpl()
              )
            )
            .end()
        )
        .find('._table')
        .animate({
          scrollTop: _.reduce(
            $field.find('.searchedOrgRow').first().closest('tr').prevAll(),
            function (scrollTop, tr) {
              return scrollTop + parseFloat(getComputedStyle(tr).height);
            },
            0
          ),
        });
    },

    // エラー setter
    setError: function (response) {
      if (!(response && response.rspHead)) {
        return;
      }
      var rspHead = response.rspHead;
      if (rspHead.message) {
        this.baseView.validator.setErrorHeader(
          clutil.fmtargs(clmsg[rspHead.message], rspHead.args)
        );
      }
    },

    // 画面サイズ変更時の処理
    onresize: function (e) {
      var clientHeight = document.scrollingElement.clientHeight;
      this.$('#zoneRankList ._table').css({
        maxHeight:
          (clientHeight - 285) /
          (1 +
            Number(
              clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE
            )),
      });
      this.$('#allRankList ._table').css({ maxHeight: clientHeight - 35 });
    },
  });
  mdbUtil.getIniJSON().then(function () {
    mainView = new AMDBV0060();
    return mainView.initialize2();
  });
});
