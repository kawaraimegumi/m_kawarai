$(function () {
  var AMDBV0030 = Backbone.View.extend({
    el: $('body'),
    events: {
      'click #searchButton': 'onclickSearchButton', // [表示]押下
      'click #sortButton': 'onclickSortButton', // [並べ替え]押下
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
      // ソート要求ヘッダ
      this.sortReq = {
        key: new mdbSelect({
          el: this.$('#sortKey'),
          list: [
            {
              id: AMDBV0030Req.AMDBV0030_SORT_KEY_ITGRP,
              name: '部門・品種コード',
            },
            {
              id: AMDBV0030Req.AMDBV0030_SORT_KEY_SALE_QY,
              name: '売上数',
            },
            {
              id: AMDBV0030Req.AMDBV0030_SORT_KEY_SALE_AM,
              name: '売上高',
            },
            {
              id: AMDBV0030Req.AMDBV0030_SORT_KEY_PROF_AM_RT,
              name: '経準率',
            },
            {
              id: AMDBV0030Req.AMDBV0030_SORT_KEY_PROF_AM,
              name: '経準高',
            },
            {
              id: AMDBV0030Req.AMDBV0030_SORT_KEY_CUSTOMER_QY,
              name: '客数',
            },
            {
              id: AMDBV0030Req.AMDBV0030_SORT_KEY_CUSTOMER_UAM,
              name: '客単価',
            },
            {
              id: AMDBV0030Req.AMDBV0030_SORT_KEY_SALE_1PRICE,
              name: '一品単価',
            },
            {
              id: AMDBV0030Req.AMDBV0030_SORT_KEY_CUST_SALE_QY,
              name: '買上点数',
            },
          ],
          onchange: _.bind(function (key) {
            var sortReq = this.sortReq;
            var $key2 = sortReq.key2.$el;
            var $order = sortReq.order.$el;
            switch (key.id) {
              case AMDBV0030Req.AMDBV0030_SORT_KEY_ITGRP:
                $key2.hide();
                $order.hide();
                break;
              default:
                $key2.show();
                $order.show();
                break;
            }
          }, this),
        }),
        key2: new mdbSelect({
          el: this.$('#sortKey2').hide(),
          list: [
            { id: AMDBV0030Req.AMDBV0030_SORT_KEY2_VAL, name: '実績' },
            { id: AMDBV0030Req.AMDBV0030_SORT_KEY2_LYRT_VAL, name: '前年比' },
            { id: AMDBV0030Req.AMDBV0030_SORT_KEY2_LYDF_VAL, name: '前年差' },
          ],
        }),
        order: new mdbSelect({
          el: this.$('#sortOrder').hide(),
          list: [
            {
              id: am_proto_sort_req.AM_PROTO_SORT_ORDER_ASCENDING,
              name: '昇順',
            },
            {
              id: am_proto_sort_req.AM_PROTO_SORT_ORDER_DESCENDING,
              name: '降順',
            },
          ],
        }).set({ id: am_proto_sort_req.AM_PROTO_SORT_ORDER_DESCENDING }), // 初期値は「降順」
        get: function () {
          var key = this.key.get();
          var key2 = this.key2.get();
          var order = this.order.get();
          return {
            key: key,
            key2: key2,
            order: order,
            request:
              key.id == AMDBV0030Req.AMDBV0030_SORT_KEY_ITGRP
                ? {
                    sort_key: AMDBV0030Req.AMDBV0030_SORT_KEY_ITGRP,
                    sort_order: am_proto_sort_req.AM_PROTO_SORT_ORDER_ASCENDING,
                  }
                : {
                    sort_key: key.id + key2.id,
                    sort_order: order.id,
                  },
          };
        },
      };

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
      var sortReq = this.sortReq.get();
      var period = this.period.get();
      var orgTree = this.orgTree.get();
      return {
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
        sortreq: sortReq.request,
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
        xxx: { sortReq: sortReq, period: period, orgTree: orgTree },
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
      this.setTable(response, request);
      this.onresize();
    },

    // テーブル setter
    setTable: function (response, request) {
      var list = response.list;
      var $result = this.$('#result');
      if (!list.length) {
        $result.hide();
        this.baseView.validator.setErrorHeader(clmsg.cl_no_data);
        return;
      }
      $result.show();
      var $tableTemplate = this.$('#tableTemplate');
      var $theadTemplate = this.$('#theadTemplate');
      var $tbodyTemplate = this.$('#tbodyTemplate');
      var $columnTemplate0 = this.$('#columnTemplate0');
      var $columnTemplate = this.$('#columnTemplate');
      var $rowTemplate1 = this.$('#rowTemplate1');
      var $rowTemplate2 = this.$('#rowTemplate2');
      var $rowTemplate3 = this.$('#rowTemplate3');
      var $dataTemplate01 = this.$('#dataTemplate01');
      var $dataTemplate02 = this.$('#dataTemplate02');
      var $dataTemplate1 = this.$('#dataTemplate1');
      var $dataTemplate2 = this.$('#dataTemplate2');
      var nf = mdbUtil.numberFormatMap;
      var dfColor = mdbUtil.dfColor;
      var rtColor = mdbUtil.rtColor;
      var header = [
        {
          name: '売上数',
          unit: '(点)',
          lyName: '前年実績',
          lydfrtName: '前年差(比)',
          key: AMDBV0030Req.AMDBV0030_SORT_KEY_SALE_QY,
        },
        {
          name: '売上高',
          unit: '(千円)',
          lyName: '前年実績',
          lydfrtName: '前年差(比)',
          key: AMDBV0030Req.AMDBV0030_SORT_KEY_SALE_AM,
        },
        {
          name: '構成比',
          unit: '(%)',
          lyName: '　-　',
          lydfrtName: '　-　',
          key: AMDBV0030Req.AMDBV0030_SORT_KEY_SALE_AM,
        },
        {
          name: '経準率',
          unit: '(%)',
          lyName: '前年実績',
          lydfrtName: '前年差',
          key: AMDBV0030Req.AMDBV0030_SORT_KEY_PROF_AM_RT,
        },
        {
          name: '経準高',
          unit: '(千円)',
          lyName: '前年実績',
          lydfrtName: '前年差(比)',
          key: AMDBV0030Req.AMDBV0030_SORT_KEY_PROF_AM,
        },
        {
          name: '客数',
          unit: '(名)',
          lyName: '前年実績',
          lydfrtName: '前年差(比)',
          key: AMDBV0030Req.AMDBV0030_SORT_KEY_CUSTOMER_QY,
        },
        {
          name: '客単価',
          unit: '(円)',
          lyName: '前年実績',
          lydfrtName: '前年差(比)',
          key: AMDBV0030Req.AMDBV0030_SORT_KEY_CUSTOMER_UAM,
        },
        {
          name: '一品単価',
          unit: '(円)',
          lyName: '前年実績',
          lydfrtName: '前年差(比)',
          key: AMDBV0030Req.AMDBV0030_SORT_KEY_SALE_1PRICE,
        },
        {
          name: '買上点数',
          unit: '(点)',
          lyName: '前年実績',
          lydfrtName: '前年差(比)',
          key: AMDBV0030Req.AMDBV0030_SORT_KEY_CUST_SALE_QY,
        },
      ];
      var _lyrtVal = function (formattedNumber) {
        return '(' + formattedNumber + '%)';
      };
      var _row = function (rec) {
        return [
          // 売上数
          {
            val: nf.sale_qy(rec.sale_qy),
            lyVal: nf.ly_sale_qy(rec.ly_sale_qy),
            lydfColor: dfColor(rec.lydf_sale_qy, rec.lyrt_sale_qy),
            lydfVal: nf.lydf_sale_qy(rec.lydf_sale_qy),
            lyrtColor: rtColor(rec.lydf_sale_qy, rec.lyrt_sale_qy),
            lyrtVal: _lyrtVal(nf.lyrt_sale_qy(rec.lyrt_sale_qy)),
          },
          // 売上高
          {
            val: nf.sale_am(rec.sale_am),
            lyVal: nf.ly_sale_am(rec.ly_sale_am),
            lydfColor: dfColor(rec.lydf_sale_am, rec.lyrt_sale_am),
            lydfVal: nf.lydf_sale_am(rec.lydf_sale_am),
            lyrtColor: rtColor(rec.lydf_sale_am, rec.lyrt_sale_am),
            lyrtVal: _lyrtVal(nf.lyrt_sale_am(rec.lyrt_sale_am)),
          },
          // 構成比
          {
            val: nf.sumrt_sale_am(rec.sumrt_sale_am),
            lyVal: '-',
            lydfColor: '',
            lydfVal: '-',
          },
          // 経準率
          {
            val: nf.prof_am_rt(rec.prof_am_rt),
            lyVal: nf.ly_prof_am_rt(rec.ly_prof_am_rt),
            lydfColor: dfColor(rec.lydf_prof_am_rt),
            lydfVal: nf.lydf_prof_am_rt(rec.lydf_prof_am_rt),
          },
          // 経準高
          {
            val: nf.prof_am(rec.prof_am),
            lyVal: nf.ly_prof_am(rec.ly_prof_am),
            lydfColor: dfColor(rec.lydf_prof_am, rec.lyrt_prof_am),
            lydfVal: nf.lydf_prof_am(rec.lydf_prof_am),
            lyrtColor: rtColor(rec.lydf_prof_am, rec.lyrt_prof_am),
            lyrtVal: _lyrtVal(nf.lyrt_prof_am(rec.lyrt_prof_am)),
          },
          // 客数
          {
            val: nf.customer_qy(rec.customer_qy),
            lyVal: nf.ly_customer_qy(rec.ly_customer_qy),
            lydfColor: dfColor(rec.lydf_customer_qy, rec.lyrt_customer_qy),
            lydfVal: nf.lydf_customer_qy(rec.lydf_customer_qy),
            lyrtColor: rtColor(rec.lydf_customer_qy, rec.lyrt_customer_qy),
            lyrtVal: _lyrtVal(nf.lyrt_customer_qy(rec.lyrt_customer_qy)),
          },
          // 客単価
          {
            val: nf.customer_uam(rec.customer_uam),
            lyVal: nf.ly_customer_uam(rec.ly_customer_uam),
            lydfColor: dfColor(rec.lydf_customer_uam, rec.lyrt_customer_uam),
            lydfVal: nf.lydf_customer_uam(rec.lydf_customer_uam),
            lyrtColor: rtColor(rec.lydf_customer_uam, rec.lyrt_customer_uam),
            lyrtVal: _lyrtVal(nf.lyrt_customer_uam(rec.lyrt_customer_uam)),
          },
          // 一品単価
          {
            val: nf.sale_1price(rec.sale_1price),
            lyVal: nf.ly_sale_1price(rec.ly_sale_1price),
            lydfColor: dfColor(rec.lydf_sale_1price, rec.lyrt_sale_1price),
            lydfVal: nf.lydf_sale_1price(rec.lydf_sale_1price),
            lyrtColor: rtColor(rec.lydf_sale_1price, rec.lyrt_sale_1price),
            lyrtVal: _lyrtVal(nf.lyrt_sale_1price(rec.lyrt_sale_1price)),
          },
          // 買上点数
          {
            val: nf.cust_sale_qy(rec.cust_sale_qy),
            lyVal: nf.ly_cust_sale_qy(rec.ly_cust_sale_qy),
            lydfColor: dfColor(rec.lydf_cust_sale_qy, rec.lyrt_cust_sale_qy),
            lydfVal: nf.lydf_cust_sale_qy(rec.lydf_cust_sale_qy),
            lyrtColor: rtColor(rec.lydf_cust_sale_qy, rec.lyrt_cust_sale_qy),
            lyrtVal: _lyrtVal(nf.lyrt_cust_sale_qy(rec.lyrt_cust_sale_qy)),
          },
        ];
      };
      var _hyphenatedRow = function (rec) {
        return _.map(_row(rec), function (data) {
          return _.extend(data, { val: '-' });
        });
      };
      var row = _row;
      var zoneRow = !Boolean(request.cond.zone_id) ? _hyphenatedRow : _row; // ゾーン未指定時はハイフン表示
      var allRow =
        clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
          ? _hyphenatedRow // 店舗アカウント時はハイフン表示
          : _row;
      var xxx = request.xxx;
      var sortKey = xxx.sortReq.key.id;
      this.$('#table')
        .empty()
        .append(
          $tableTemplate
            .tmpl()
            .append(
              _.reduce(
                header,
                function ($thead, column) {
                  return $thead.append(
                    $columnTemplate
                      .tmpl(column)
                      // 並べ替える列のみ色を残す
                      .find('.sortKey')
                      .removeClass(column.key != sortKey ? 'sortKey' : '')
                      .end()
                  );
                },
                $theadTemplate.tmpl().append($columnTemplate0.tmpl())
              )
            )
            .append(
              _.reduce(
                list,
                function ($tbody, rspRec) {
                  var itgrp = rspRec.itgrp;
                  var pageArgs = _.extend(
                    {
                      itgrpTree: {
                        div: { itgrp_id: rspRec.div_id },
                        ctg: { itgrp_id: itgrp.id },
                      },
                    },
                    xxx
                  );
                  return $tbody
                    .append(
                      _.reduce(
                        row(rspRec.rec),
                        function ($row, data) {
                          return $row.append($dataTemplate1.tmpl(data));
                        },
                        $rowTemplate1
                          .tmpl()
                          .append($dataTemplate01.tmpl({ itgrp: itgrp }))
                      )
                    )
                    .append(
                      _.reduce(
                        zoneRow(rspRec.zone_avg_rec),
                        function ($row, data) {
                          return $row.append($dataTemplate2.tmpl(data));
                        },
                        $rowTemplate2.tmpl().append(
                          $dataTemplate02
                            .tmpl({
                              rankName: 'ゾ',
                              rank: nf.zone_rank(rspRec.zone_rank),
                              name: 'ゾーン実績',
                            })
                            .find('.rankButton')
                            .data('pageArgs', pageArgs)
                            .addClass(
                              nf.zone_rank(rspRec.zone_rank) == '-'
                                ? 'disabled'
                                : ''
                            )
                            .end()
                        )
                      )
                    )
                    .append(
                      _.reduce(
                        allRow(rspRec.all_avg_rec),
                        function ($row, data) {
                          return $row.append($dataTemplate2.tmpl(data));
                        },
                        $rowTemplate3.tmpl().append(
                          $dataTemplate02
                            .tmpl({
                              rankName: '全',
                              rank: nf.all_rank(rspRec.all_rank),
                              name: '全国実績',
                            })
                            .find('.rankButton')
                            .data('pageArgs', pageArgs)
                            .addClass(
                              nf.all_rank(rspRec.all_rank) == '-'
                                ? 'disabled'
                                : ''
                            )
                            .end()
                        )
                      )
                    );
                },
                $tbodyTemplate.tmpl()
              )
            )
        )
        .animate({
          scrollLeft: _.reduce(
            _.initial(
              this.$('.sortKey').first().closest('th').prevAll()
            ).reverse(),
            function (scrollLeft, th) {
              return scrollLeft + parseFloat(getComputedStyle(th).width);
            },
            0
          ),
          scrollTop: 0,
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

    // [並べ替え]押下時の処理
    onclickSortButton: function (e) {
      // 最新のリクエストのソート要求ヘッダを更新して検索する
      var request = this.request;
      var sortReq = this.sortReq.get();
      return this.search(
        _.defaults(
          {
            sortreq: sortReq.request,
            xxx: _.defaults({ sortReq: sortReq }, request.xxx),
          },
          request
        )
      );
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
      var scrollingElement = document.scrollingElement;
      this.$('#table').css({
        height: scrollingElement.clientHeight - 130,
        width: scrollingElement.clientWidth - 30,
      });
    },
  });
  mdbUtil.getIniJSON().then(function () {
    mainView = new AMDBV0030();
    return mainView.initialize2();
  });
});
