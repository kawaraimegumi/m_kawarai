$(function () {
  var AMDBV0010 = Backbone.View.extend({
    el: $('body'),
    events: {
      'click #searchButton': 'onclickSearchButton', // [表示]押下
      'click .rankButton:not(.disabled)': 'onclickRankButton', // ランキング押下
    },

    initialize: function () {
      _.bindAll(this);
      // 基盤
      this.baseView = new mdbBaseView({
        getPageArgs: _.bind(function () {
          return this.getRequest().xxx;
        }, this),
      });
      // 期間
      this.period = new mdbPeriod({ el: this.$('#period') });
      // 店舗
      this.orgTree = new mdbOrgTree({ el: this.$('#orgTree') });

      $(window).resize(this.onresize);
    },

    // 初期値設定(通信はこちらで行う)
    initialize2: function () {
      var pageArgs = clcom.pageArgs || {};
      return Promise.resolve()
        .then(this.baseView.set)
        .then(_.bind(this.period.set, this, pageArgs.period))
        .then(
          _.bind(
            this.orgTree.set,
            this,
            pageArgs.orgTree || clcom.userInfo.orgTree // 引き継いだ情報がない場合はログインした店舗を設定
          )
        )
        .then(this.onclickSearchButton);
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
      var period = this.period.get();
      var orgTree = this.orgTree.get();
      return {
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
        cond: {
          date_type: period.type,
          term_from: period.from,
          term_to: period.to,
          unit_id: orgTree.unit.org_id,
          area_id: orgTree.area.org_id,
          zone_id: orgTree.zone.org_id,
          org_id: orgTree.org.org_id,
        },
        // 以下は通信に無関係
        xxx: { period: period, orgTree: orgTree },
      };
    },

    // リクエスト setter
    setRequest: function (request) {
      this.request = _.deepClone(request); // 最新のリクエストを保持
      var orgTree = request.xxx.orgTree;
      var area = orgTree.area;
      var zone = orgTree.zone;
      var org = orgTree.org;
      this.$('#request').get(0).innerText = _.compact([
        area.name,
        zone.org_id ? zone.name : '',
        org.org_id ? org.name : '',
      ]).join(' ');
    },

    // レスポンス setter
    setResponse: function (response, request) {
      this.response = _.deepClone(response); // 最新のレスポンスを保持
      this.setSaleAm(response, request); // 売上高
      this.setProfitAm(response, request); // 営業利益
      this.setProfAm(response, request); // 経準高
      this.setProfAmRt(response, request); // 経準率
      this.setCustomerQy(response, request); // 客数
      this.setCustomerUam(response, request); // 客単価
      this.setSale1Price(response, request); // 一品単価
      this.setCustSaleQy(response, request); // 買上点数
      this.onresize();
    },

    // 売上高 setter
    setSaleAm: function (response, request) {
      var rspRec = response.rsp_rec;
      var nf = mdbUtil.numberFormatMap;
      var dfColor = mdbUtil.dfColor;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 実績
          { val: nf.sale_am(rec.sale_am) },
          // 計画値
          { val: nf.sale_plan_am(rec.sale_plan_am) },
          // 計画比
          {
            val: nf.planrt_sale_am(rec.planrt_sale_am),
            color: rtColor(rec.plandf_sale_am, rec.planrt_sale_am),
          },
          // 計画差
          {
            val: nf.plandf_sale_am(rec.plandf_sale_am),
            color: dfColor(rec.plandf_sale_am, rec.planrt_sale_am),
          },
          // 前年実績
          { val: nf.ly_sale_am(rec.ly_sale_am) },
          // 前年比
          {
            val: nf.lyrt_sale_am(rec.lyrt_sale_am),
            color: rtColor(rec.lydf_sale_am, rec.lyrt_sale_am),
          },
          // 前年差
          {
            val: nf.lydf_sale_am(rec.lydf_sale_am),
            color: dfColor(rec.lydf_sale_am, rec.lyrt_sale_am),
          },
        ];
      };
      this.setTable(
        this.$('#saleAm'),
        { id: amgbd_defs.AMGBD_DEFS_RANK_SALE_AM, name: '売上高' },
        rspRec.sale_am_rank,
        '',
        [
          { name: '実績', unit: '(千円)' },
          { name: '計画値', unit: '(千円)' },
          { name: '計画比', unit: '(%)' },
          { name: '計画差', unit: '(千円)' },
          { name: '前年実績', unit: '(千円)' },
          { name: '前年比', unit: '(%)' },
          { name: '前年差', unit: '(千円)' },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 営業利益 setter
    setProfitAm: function (response, request) {
      var rspRec = response.rsp_rec;
      var nf = mdbUtil.numberFormatMap;
      var dfColor = mdbUtil.dfColor;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 実績
          { val: nf.profit_am(rec.profit_am) },
          // 計画値
          { val: nf.profit_plan_am(rec.profit_plan_am) },
          // 計画比
          {
            val: nf.planrt_profit_am(rec.planrt_profit_am),
            color: rtColor(rec.plandf_profit_am, rec.planrt_profit_am),
          },
          // 計画差
          {
            val: nf.plandf_profit_am(rec.plandf_profit_am),
            color: dfColor(rec.plandf_profit_am, rec.planrt_profit_am),
          },
          // 前年実績
          { val: nf.ly_profit_am(rec.ly_profit_am) },
          // 前年比
          {
            val: nf.lyrt_profit_am(rec.lyrt_profit_am),
            color: rtColor(rec.lydf_profit_am, rec.lyrt_profit_am),
          },
          // 前年差
          {
            val: nf.lydf_profit_am(rec.lydf_profit_am),
            color: dfColor(rec.lydf_profit_am, rec.lyrt_profit_am),
          },
        ];
      };
      this.setTable(
        this.$('#profitAm'),
        { id: amgbd_defs.AMGBD_DEFS_RANK_PROFIT_AM, name: '営業利益' },
        rspRec.profit_am_rank,
        '当月内の営業利益は表示されません',
        [
          { name: '実績', unit: '(千円)' },
          { name: '計画値', unit: '(千円)' },
          { name: '計画比', unit: '(%)' },
          { name: '計画差', unit: '(千円)' },
          { name: '前年実績', unit: '(千円)' },
          { name: '前年比', unit: '(%)' },
          { name: '前年差', unit: '(千円)' },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 経準高 setter
    setProfAm: function (response, request) {
      var rspRec = response.rsp_rec;
      var nf = mdbUtil.numberFormatMap;
      var dfColor = mdbUtil.dfColor;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 実績
          { val: nf.prof_am(rec.prof_am) },
          // 計画値
          { val: nf.prof_plan_am(rec.prof_plan_am) },
          // 計画比
          {
            val: nf.planrt_prof_am(rec.planrt_prof_am),
            color: rtColor(rec.plandf_prof_am, rec.planrt_prof_am),
          },
          // 計画差
          {
            val: nf.plandf_prof_am(rec.plandf_prof_am),
            color: dfColor(rec.plandf_prof_am, rec.planrt_prof_am),
          },
          // 前年実績
          { val: nf.ly_prof_am(rec.ly_prof_am) },
          // 前年比
          {
            val: nf.lyrt_prof_am(rec.lyrt_prof_am),
            color: rtColor(rec.lydf_prof_am, rec.lyrt_prof_am),
          },
          // 前年差
          {
            val: nf.lydf_prof_am(rec.lydf_prof_am),
            color: dfColor(rec.lydf_prof_am, rec.lyrt_prof_am),
          },
        ];
      };
      this.setTable(
        this.$('#profAm'),
        { id: amgbd_defs.AMGBD_DEFS_RANK_PROF_AM, name: '経準高' },
        rspRec.prof_am_rank,
        '',
        [
          { name: '実績', unit: '(千円)' },
          { name: '計画値', unit: '(千円)' },
          { name: '計画比', unit: '(%)' },
          { name: '計画差', unit: '(千円)' },
          { name: '前年実績', unit: '(千円)' },
          { name: '前年比', unit: '(%)' },
          { name: '前年差', unit: '(千円)' },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 経準率 setter
    setProfAmRt: function (response, request) {
      var rspRec = response.rsp_rec;
      var nf = mdbUtil.numberFormatMap;
      var dfColor = mdbUtil.dfColor;
      var row = function (rec) {
        return [
          // 実績
          { val: nf.prof_am_rt(rec.prof_am_rt) },
          // 前年実績
          { val: nf.ly_prof_am_rt(rec.ly_prof_am_rt) },
          // 前年差
          {
            val: nf.lydf_prof_am_rt(rec.lydf_prof_am_rt),
            color: dfColor(rec.lydf_prof_am_rt),
          },
        ];
      };
      this.setTable(
        this.$('#profAmRt'),
        { id: amgbd_defs.AMGBD_DEFS_RANK_PROF_AM_RT, name: '経準率' },
        rspRec.prof_am_rt_rank,
        '',
        [
          { name: '実績', unit: '(%)' },
          { name: '前年実績', unit: '(%)' },
          { name: '前年差', unit: '(%)' },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 客数 setter
    setCustomerQy: function (response, request) {
      var rspRec = response.rsp_rec;
      var nf = mdbUtil.numberFormatMap;
      var dfColor = mdbUtil.dfColor;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 実績
          { val: nf.customer_qy(rec.customer_qy) },
          // 前年実績
          { val: nf.ly_customer_qy(rec.ly_customer_qy) },
          // 前年比
          {
            val: nf.lyrt_customer_qy(rec.lyrt_customer_qy),
            color: rtColor(rec.lydf_customer_qy, rec.lyrt_customer_qy),
          },
          // 前年差
          {
            val: nf.lydf_customer_qy(rec.lydf_customer_qy),
            color: dfColor(rec.lydf_customer_qy, rec.lyrt_customer_qy),
          },
        ];
      };
      this.setTable(
        this.$('#customerQy'),
        { id: amgbd_defs.AMGBD_DEFS_RANK_CUSTOMER_QY, name: '客数' },
        rspRec.customer_qy_rank,
        '',
        [
          { name: '実績', unit: '(名)' },
          { name: '前年実績', unit: '(名)' },
          { name: '前年比', unit: '(%)' },
          { name: '前年差', unit: '(名)' },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 客単価 setter
    setCustomerUam: function (response, request) {
      var rspRec = response.rsp_rec;
      var nf = mdbUtil.numberFormatMap;
      var dfColor = mdbUtil.dfColor;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 実績
          { val: nf.customer_uam(rec.customer_uam) },
          // 前年実績
          { val: nf.ly_customer_uam(rec.ly_customer_uam) },
          // 前年比
          {
            val: nf.lyrt_customer_uam(rec.lyrt_customer_uam),
            color: rtColor(rec.lydf_customer_uam, rec.lyrt_customer_uam),
          },
          // 前年差
          {
            val: nf.lydf_customer_uam(rec.lydf_customer_uam),
            color: dfColor(rec.lydf_customer_uam, rec.lyrt_customer_uam),
          },
        ];
      };
      this.setTable(
        this.$('#customerUam'),
        { id: amgbd_defs.AMGBD_DEFS_RANK_CUSTOMER_UAM, name: '客単価' },
        rspRec.customer_uam_rank,
        '',
        [
          { name: '実績', unit: '(円)' },
          { name: '前年実績', unit: '(円)' },
          { name: '前年比', unit: '(%)' },
          { name: '前年差', unit: '(円)' },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 一品単価 setter
    setSale1Price: function (response, request) {
      var rspRec = response.rsp_rec;
      var nf = mdbUtil.numberFormatMap;
      var dfColor = mdbUtil.dfColor;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 実績
          { val: nf.sale_1price(rec.sale_1price) },
          // 前年実績
          { val: nf.ly_sale_1price(rec.ly_sale_1price) },
          // 前年比
          {
            val: nf.lyrt_sale_1price(rec.lyrt_sale_1price),
            color: rtColor(rec.lydf_sale_1price, rec.lyrt_sale_1price),
          },
          // 前年差
          {
            val: nf.lydf_sale_1price(rec.lydf_sale_1price),
            color: dfColor(rec.lydf_sale_1price, rec.lyrt_sale_1price),
          },
        ];
      };
      this.setTable(
        this.$('#sale1Price'),
        { id: amgbd_defs.AMGBD_DEFS_RANK_SALE_1PRICE, name: '一品単価' },
        rspRec.sale_1price_rank,
        '',
        [
          { name: '実績', unit: '(円)' },
          { name: '前年実績', unit: '(円)' },
          { name: '前年比', unit: '(%)' },
          { name: '前年差', unit: '(円)' },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 買上点数 setter
    setCustSaleQy: function (response, request) {
      var rspRec = response.rsp_rec;
      var nf = mdbUtil.numberFormatMap;
      var dfColor = mdbUtil.dfColor;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 実績
          { val: nf.cust_sale_qy(rec.cust_sale_qy) },
          // 前年実績
          { val: nf.ly_cust_sale_qy(rec.ly_cust_sale_qy) },
          // 前年比
          {
            val: nf.lyrt_cust_sale_qy(rec.lyrt_cust_sale_qy),
            color: rtColor(rec.lydf_cust_sale_qy, rec.lyrt_cust_sale_qy),
          },
          // 前年差
          {
            val: nf.lydf_cust_sale_qy(rec.lydf_cust_sale_qy),
            color: dfColor(rec.lydf_cust_sale_qy, rec.lyrt_cust_sale_qy),
          },
        ];
      };
      this.setTable(
        this.$('#custSaleQy'),
        { id: amgbd_defs.AMGBD_DEFS_RANK_CUST_SALE_QY, name: '買上点数' },
        rspRec.cust_sale_qy_rank,
        '',
        [
          { name: '実績', unit: '(点)' },
          { name: '前年実績', unit: '(点)' },
          { name: '前年比', unit: '(%)' },
          { name: '前年差', unit: '(点)' },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // テーブル setter
    setTable: function (
      $field,
      rankItem,
      rank,
      message,
      header,
      rows,
      request
    ) {
      var $tableTemplate = this.$('#tableTemplate');
      var $theadTemplate = this.$('#theadTemplate');
      var $tbodyTemplate = this.$('#tbodyTemplate');
      var $columnTemplate0 = this.$('#columnTemplate0');
      var $columnTemplate = this.$('#columnTemplate');
      var $rowTemplate = this.$('#rowTemplate');
      var $dataTemplate0 = this.$('#dataTemplate0');
      var $dataTemplate = this.$('#dataTemplate');
      var nf = mdbUtil.numberFormatMap;
      var pageArgs = _.extend({ rankItem: rankItem }, request.xxx);
      var cond = request.cond;
      var _row = _.identity;
      var _hyphenatedRow = function (row) {
        return _.map(row, function (data) {
          return _.extend(data, { val: '-' });
        });
      };
      var row = _row;
      var zoneRow = !Boolean(cond.zone_id) ? _hyphenatedRow : _row; // ゾーン未指定時はハイフン表示
      var allRow =
        clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
          ? _hyphenatedRow // 店舗アカウント時はハイフン表示
          : _row;
      $field.empty().append(
        $tableTemplate
          .tmpl({
            rankItem: rankItem,
            allRank: nf.all_rank(rank.all_rank),
            zoneRank: nf.zone_rank(rank.zone_rank),
            message: message,
          })
          .find('.rankButton')
          .data('pageArgs', pageArgs)
          .filter('.all')
          .addClass(nf.all_rank(rank.all_rank) == '-' ? 'disabled' : '')
          .end()
          .filter('.zone')
          .addClass(nf.zone_rank(rank.zone_rank) == '-' ? 'disabled' : '')
          .end()
          .end()
          .filter('table')
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
            $tbodyTemplate
              .tmpl()
              .append(
                _.reduce(
                  row(rows[0]),
                  function ($row, data) {
                    return $row.append($dataTemplate.tmpl(data));
                  },
                  $rowTemplate.tmpl().append(
                    $dataTemplate0.tmpl({
                      name: cond.org_id
                        ? '店舗実績'
                        : cond.zone_id
                        ? 'ゾーン実績'
                        : cond.area_id
                        ? '地区実績'
                        : cond.unit_id
                        ? '事業ユニット実績'
                        : '実績',
                    })
                  )
                )
              )
              .append(
                _.reduce(
                  zoneRow(rows[1]),
                  function ($row, data) {
                    return $row.append($dataTemplate.tmpl(data));
                  },
                  $rowTemplate
                    .tmpl()
                    .append($dataTemplate0.tmpl({ name: 'ゾーン実績' }))
                )
              )
              .append(
                _.reduce(
                  allRow(rows[2]),
                  function ($row, data) {
                    return $row.append($dataTemplate.tmpl(data));
                  },
                  $rowTemplate
                    .tmpl()
                    .append($dataTemplate0.tmpl({ name: '全国実績' }))
                )
              )
          )
          .end()
      );
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

    // ランキング押下時の処理
    onclickRankButton: function (e) {
      var code = 'AMDBV0060'; // AMDBV0060 ランキング へ遷移
      clcom.pushPage({
        url: [clcom.appRoot, code.slice(0, 4), code, code + '.html'].join('/'),
        args: this.$(e.target.closest('.rankButton')).data('pageArgs'),
        newWindow: true,
      });
    },

    // 画面サイズ変更時の処理
    onresize: function (e) {
      // 「経準高」「客数」「一品単価」は「売上高」の列に揃える
      var widthList = _.map(this.$('#saleAm').find('th'), function (th) {
        return parseFloat(getComputedStyle(th).width);
      });
      [this.$('#profAm'), this.$('#customerQy'), this.$('#sale1Price')].forEach(
        function ($field) {
          $field.find('th').each(
            _.bind(function (index, th) {
              this.$(th).css({ width: widthList[index] });
            }, this)
          );
        }
      );
      // 「経準率」「客単価」「買上点数」は「営業利益」の列に揃える
      var widthList = _.map(this.$('#profitAm').find('th'), function (th) {
        return parseFloat(getComputedStyle(th).width);
      });
      [
        this.$('#profAmRt'),
        this.$('#customerUam'),
        this.$('#custSaleQy'),
      ].forEach(function ($field) {
        $field.find('th').each(
          _.bind(function (index, th) {
            this.$(th).css({ width: widthList[index] });
          }, this)
        );
      });
    },
  });
  mdbUtil.getIniJSON().then(function () {
    mainView = new AMDBV0010();
    return mainView.initialize2();
  });
});
