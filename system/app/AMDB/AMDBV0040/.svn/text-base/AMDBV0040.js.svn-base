$(function () {
  var AMDBV0040 = Backbone.View.extend({
    el: $('body'),
    events: {
      'click #searchButton': 'onclickSearchButton', // [表示]押下
      'click #sortButton': 'onclickSortButton', // [並べ替え]押下
      'click #hAxisFilterButton': 'onclickHAxisFilterButton', // [横軸フィルタ]押下
      'click #closeButton': 'onclickCloseButton', // [×]押下
      'click #allSelectButton': 'onclickAllSelectButton', // [全選択]押下
      'click #allClearButton': 'onclickAllClearButton', // [全解除]押下
      'click #confirmButton': 'onclickConfirmButton', // [完了]押下
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
      // 従業員
      this.postgrp = new mdbSelect({
        el: this.$('#postgrp'),
        list: [
          {
            id: amcm_type.AMCM_VAL_MDB_STAFFPOST_ALL,
            name: '全従業員',
          },
          {
            id: amcm_type.AMCM_VAL_MDB_STAFFPOST_STORE_ALL,
            name: '店舗全社員',
          },
          {
            id: amcm_type.AMCM_VAL_MDB_STAFFPOST_MANAGER,
            name: '世話人',
          },
          {
            id: amcm_type.AMCM_VAL_MDB_STAFFPOST_STORE_MANAGER,
            name: '店長',
          },
          {
            id: amcm_type.AMCM_VAL_MDB_STAFFPOST_SUB_MANAGER,
            name: '副店長',
          },
          {
            id: amcm_type.AMCM_VAL_MDB_STAFFPOST_GENERAL,
            name: '一般',
          },
          {
            id: amcm_type.AMCM_VAL_MDB_STAFFPOST_PARTNER,
            name: 'パートナー・アルバイト',
          },
          {
            id: amcm_type.AMCM_VAL_MDB_STAFFPOST_SC,
            name: 'SC社員',
          },
        ],
      });
      // 店舗別/担当者別
      this.viewType = new mdbSelect({
        el: this.$('#viewType'),
        list: [
          { id: AMDBV0040Req.AMDBV0040_VIEW_TYPE_STORE, name: '店舗別' },
          { id: AMDBV0040Req.AMDBV0040_VIEW_TYPE_STAFF, name: '担当者別' },
        ],
      });
      // ソート要求ヘッダ
      this.sortReq = {
        key: new mdbSelect({
          el: this.$('#sortKey'),
          list: [
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_SALE_AM,
              name: '売上高',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_SALE_QY,
              name: '売上数',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_CUST_SALE_QY,
              name: '買上点数',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_PROF_AM_RT,
              name: '経準率',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CQY_J,
              name: '重衣料客数',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CUP_J,
              name: '重衣料客単価',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CCP_J,
              name: '重衣料C単価',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CQY_C,
              name: '中衣料客数',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CUP_C,
              name: '中衣料客単価',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CCP_C,
              name: '中衣料C単価',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AM_L,
              name: 'レディス売上高',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CQY_L,
              name: 'レディススーツ・コート客数',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CUP_L,
              name: 'レディススーツ・コート客単価',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CCP_L,
              name: 'レディススーツ・コートC単価',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_BY3,
              name: 'BY3点付着率',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_SHOES,
              name: 'シューズ付着率',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_EIGHT,
              name: 'エイトストップ付着率',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_HEART,
              name: 'ハートシック付着率',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_PLT,
              name: 'プリーツ付着率',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_SPC,
              name: 'SPCメンズ付着率',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_L_SPC,
              name: 'SPCレディス付着率',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_JUST,
              name: 'ジャスト感付着率',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_NANO,
              name: 'ナノクリーン付着率',
            },
            {
              id: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_DRY,
              name: 'ドライパッド付着率',
            },
          ],
        }),
        order: new mdbSelect({
          el: this.$('#sortOrder'),
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
          var order = this.order.get();
          return {
            key: key,
            order: order,
            request: { sort_key: key.id, sort_order: order.id },
          };
        },
      };
      // 横軸フィルタ
      var $template = this.$('#hAxisFilterTemplate');
      var $hAxisFilter = this.$('.hAxisFilter');
      var sortKeyList = this.sortReq.key.getList();
      var len = sortKeyList.length;
      var n = Math.floor(len / 2);
      this.hAxisFilter = _.reduce(
        [sortKeyList.slice(0, n), sortKeyList.slice(n, len)],
        function (hAxisFilter, sortKeyList, index) {
          return _.union(
            hAxisFilter,
            _.map(sortKeyList, function (key) {
              return _.extend(key, {
                checkbox: new mdbCheckbox({
                  el: $template.tmpl(key).appendTo($hAxisFilter[index]),
                  name: key.name,
                }).set(true),
              });
            })
          );
        },
        []
      );
      // ページャー
      this.pager = new mdbPager({
        el: this.$('#pager'),
        onclick: _.bind(function (reqPage) {
          return this.search(_.defaults({ reqPage: reqPage }, this.request));
        }, this),
      });

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
      var viewType = this.viewType.get();
      var period = this.period.get();
      var orgTree = this.orgTree.get();
      var postgrp = this.postgrp.get();
      return {
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
        reqPage: { start_record: 0, page_size: 100 },
        sortreq: sortReq.request,
        cond: {
          view_type: viewType.id,
          date_type: period.type,
          term_from: period.from,
          term_to: period.to,
          unit_id: orgTree.unit.org_id,
          area_id: orgTree.area.org_id,
          zone_id: orgTree.zone.org_id,
          org_id: orgTree.org.org_id,
          postgrp1: postgrp.id,
          postgrp2: 0,
        },
        // 以下は通信に無関係
        xxx: {
          sortReq: sortReq,
          viewType: viewType,
          period: period,
          orgTree: orgTree,
          postgrp: postgrp,
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
      var postgrp = xxx.postgrp;
      var viewType = xxx.viewType;
      this.$('#request').get(0).innerText = [
        _.compact([
          area.name,
          zone.org_id ? zone.name : '',
          org.org_id ? org.name : '',
        ]).join(' '),
        postgrp.name,
        viewType.name,
      ].join(' - ');
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
      var _header = [
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_SALE_AM,
          name1: '',
          name2: '売上高',
          unit: '(千円)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_SALE_QY,
          name1: '',
          name2: '売上数',
          unit: '(点)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_CUST_SALE_QY,
          name1: '',
          name2: '買上点数',
          unit: '(点)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_PROF_AM_RT,
          name1: '',
          name2: '経準率',
          unit: '(%)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CQY_J,
          name1: '重衣料',
          name2: '客数',
          unit: '(名)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CUP_J,
          name1: '重衣料',
          name2: '客単価',
          unit: '(円)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CCP_J,
          name1: '重衣料',
          name2: 'C単価',
          unit: '(円)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CQY_C,
          name1: '中衣料',
          name2: '客数',
          unit: '(名)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CUP_C,
          name1: '中衣料',
          name2: '客単価',
          unit: '(円)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CCP_C,
          name1: '中衣料',
          name2: 'C単価',
          unit: '(円)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AM_L,
          name1: 'レディス',
          name2: '売上高',
          unit: '(千円)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CQY_L,
          name1: 'レディススーツ',
          name2: '・コート客数',
          unit: '(名)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CUP_L,
          name1: 'レディススーツ',
          name2: '・コート客単価',
          unit: '(円)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CCP_L,
          name1: 'レディススーツ',
          name2: '・コートC単価',
          unit: '(円)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_BY3,
          name1: 'BY3点',
          name2: '付着率',
          unit: '(%)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_SHOES,
          name1: 'シューズ',
          name2: '付着率',
          unit: '(%)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_EIGHT,
          name1: 'エイトストップ',
          name2: '付着率',
          unit: '(%)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_HEART,
          name1: 'ハートシック',
          name2: '付着率',
          unit: '(%)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_PLT,
          name1: 'プリーツ',
          name2: '付着率',
          unit: '(%)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_SPC,
          name1: 'SPCメンズ',
          name2: '付着率',
          unit: '(%)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_L_SPC,
          name1: 'SPCレディス',
          name2: '付着率',
          unit: '(%)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_JUST,
          name1: 'ジャスト感',
          name2: '付着率',
          unit: '(%)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_NANO,
          name1: 'ナノクリーン',
          name2: '付着率',
          unit: '(%)',
        },
        {
          key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_DRY,
          name1: 'ドライパッド',
          name2: '付着率',
          unit: '(%)',
        },
      ];
      var __row = function (rec) {
        return [
          // 売上高
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_SALE_AM,
            val: nf.sale_am(rec.sale_am),
          },
          // 売上数
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_SALE_QY,
            val: nf.sale_qy(rec.sale_qy),
          },
          // 買上点数
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_CUST_SALE_QY,
            val: nf.cust_sale_qy(rec.cust_sale_qy),
          },
          // 経準率
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_PROF_AM_RT,
            val: nf.prof_am_rt(rec.prof_am_rt),
          },
          // 重衣料客数
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CQY_J,
            val: nf.levelup_cqy_j(rec.levelup_cqy_j),
          },
          // 重衣料客単価
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CUP_J,
            val: nf.levelup_cup_j(rec.levelup_cup_j),
          },
          // 重衣料C単価
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CCP_J,
            val: nf.levelup_ccp_j(rec.levelup_ccp_j),
          },
          // 中衣料客数
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CQY_C,
            val: nf.levelup_cqy_c(rec.levelup_cqy_c),
          },
          // 中衣料客単価
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CUP_C,
            val: nf.levelup_cup_c(rec.levelup_cup_c),
          },
          // 中衣料C単価
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CCP_C,
            val: nf.levelup_ccp_c(rec.levelup_ccp_c),
          },
          // レディス売上高
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AM_L,
            val: nf.levelup_am_l(rec.levelup_am_l),
          },
          // レディススーツ・コート客数
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CQY_L,
            val: nf.levelup_cqy_l(rec.levelup_cqy_l),
          },
          // レディススーツ・コート客単価
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CUP_L,
            val: nf.levelup_cup_l(rec.levelup_cup_l),
          },
          // レディススーツ・コートC単価
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_CCP_L,
            val: nf.levelup_ccp_l(rec.levelup_ccp_l),
          },
          // BY3点付着率
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_BY3,
            val: nf.levelup_ar_by3(rec.levelup_ar_by3),
          },
          // シューズ付着率
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_SHOES,
            val: nf.levelup_ar_shoes(rec.levelup_ar_shoes),
          },
          // エイトストップ付着率
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_EIGHT,
            val: nf.levelup_ar_eight(rec.levelup_ar_eight),
          },
          // ハートシック付着率
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_HEART,
            val: nf.levelup_ar_heart(rec.levelup_ar_heart),
          },
          // プリーツ付着率
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_PLT,
            val: nf.levelup_ar_plt(rec.levelup_ar_plt),
          },
          // SPCメンズ付着率
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_SPC,
            val: nf.levelup_ar_spc(rec.levelup_ar_spc),
          },
          // SPCレディス付着率
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_L_SPC,
            val: nf.levelup_ar_l_spc(rec.levelup_ar_l_spc),
          },
          // ジャスト感付着率
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_JUST,
            val: nf.levelup_ar_just(rec.levelup_ar_just),
          },
          // ナノクリーン付着率
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_NANO,
            val: nf.levelup_ar_nano(rec.levelup_ar_nano),
          },
          // ドライパッド付着率
          {
            key: AMDBV0040Req.AMDBV0040_SORT_KEY_LEVELUP_AR_DRY,
            val: nf.levelup_ar_dry(rec.levelup_ar_dry),
          },
        ];
      };

      // 横軸フィルタでチェックされた項目のみで表を作成する
      var hAxisFilter = _.filter(this.hAxisFilter, function (key) {
        return key.checkbox.get();
      });
      var header = _.filter(_header, function (column) {
        return _.find(hAxisFilter, function (key) {
          return key.id == column.key;
        });
      });
      var _row = function (rec) {
        return _.filter(__row(rec), function (data) {
          return _.find(hAxisFilter, function (key) {
            return key.id == data.key;
          });
        });
      };

      var _hyphenatedRow = function (rec) {
        return _.map(_row(rec), function (data) {
          return _.extend(data, { val: '-' });
        });
      };
      var row = _row;
      var zoneRow = _row;
      var allRow =
        clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
          ? _hyphenatedRow // 店舗アカウント時はハイフン表示
          : _row;
      var sortKey = request.xxx.sortReq.key.id;
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
                  return $tbody
                    .append(
                      _.reduce(
                        row(rspRec.rec),
                        function ($row, data) {
                          return $row.append($dataTemplate1.tmpl(data));
                        },
                        $rowTemplate1.tmpl().append(
                          $dataTemplate01.tmpl({
                            staff: rspRec.staff,
                            org: rspRec.org,
                          })
                        )
                      )
                    )
                    .append(
                      _.reduce(
                        zoneRow(rspRec.zone_avg_rec),
                        function ($row, data) {
                          return $row.append($dataTemplate2.tmpl(data));
                        },
                        $rowTemplate2.tmpl().append(
                          $dataTemplate02.tmpl({
                            rankName: 'ゾ',
                            rank: nf.zone_rank(rspRec.zone_rank),
                            name: 'ゾーン実績',
                          })
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
                          $dataTemplate02.tmpl({
                            rankName: '全',
                            rank: nf.all_rank(rspRec.all_rank),
                            name: '全国実績',
                          })
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
      this.pager.set(response.rspPage);
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
            reqPage: { start_record: 0, page_size: 100 }, // 1ページ目
            sortreq: sortReq.request,
            xxx: _.defaults({ sortReq: sortReq }, request.xxx),
          },
          request
        )
      );
    },

    // [横軸フィルタ]押下時の処理
    onclickHAxisFilterButton: function (e) {
      this.openModal();
    },

    // モーダルを開く
    openModal: function (callback = function () {}) {
      this.$('#modal').fadeIn();
      this.baseView.blockUI();
      callback();
    },

    // [×]押下時の処理
    onclickCloseButton: function (e) {
      var $th = this.$('th');
      this.closeModal(
        _.bind(function () {
          for (var key of this.hAxisFilter) {
            key.checkbox.set(
              Boolean($th.filter('[key=' + String(key.id) + ']').length)
            );
          }
        }, this)
      );
    },

    // モーダルを閉じる
    closeModal: function (callback = function () {}) {
      this.$('#modal').fadeOut(
        null,
        _.bind(function () {
          this.baseView.unblockUI();
          callback();
        }, this)
      );
    },

    // [全選択]押下時の処理
    onclickAllSelectButton: function (e) {
      for (var key of this.hAxisFilter) {
        key.checkbox.set(true);
      }
    },

    // [全解除]押下時の処理
    onclickAllClearButton: function (e) {
      for (var key of this.hAxisFilter) {
        key.checkbox.set(false);
      }
    },

    // [完了]押下時の処理
    onclickConfirmButton: function (e) {
      this.setTable(this.response, this.request);
      this.closeModal();
    },

    // 画面サイズ変更時の処理
    onresize: function (e) {
      var scrollingElement = document.scrollingElement;
      this.$('#table').css({
        height: scrollingElement.clientHeight - 180,
        width: scrollingElement.clientWidth - 30,
      });
    },
  });
  mdbUtil.getIniJSON().then(function () {
    mainView = new AMDBV0040();
    return mainView.initialize2();
  });
});
