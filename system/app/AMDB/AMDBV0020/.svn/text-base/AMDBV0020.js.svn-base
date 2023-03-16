$(function () {
  var AMDBV0020 = Backbone.View.extend({
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
        .then(_.bind(this.setItgrpTree, this, pageArgs.itgrpTree))
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
      var period = this.period.get();
      var orgTree = this.orgTree.get();
      var itgrpTree = this.itgrpTree.get();
      return {
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
        cond: {
          info_type: 0,
          date_type: period.type,
          term_from: period.from,
          term_to: period.to,
          unit_id: orgTree.unit.org_id,
          area_id: orgTree.area.org_id,
          zone_id: orgTree.zone.org_id,
          org_id: orgTree.org.org_id,
          div_id: itgrpTree.div.itgrp_id,
          ctg_id: itgrpTree.ctg.itgrp_id,
        },
        // 以下は通信に無関係
        xxx: { period: period, orgTree: orgTree, itgrpTree: itgrpTree },
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
      this.setSexage(response, request);
      this.setMarket(response, request);
      this.setMemb(response, request);
      this.setApp(response, request);
      this.setAr(response, request);
      this.setRrdr(response, request);
      this.onresize();
    },

    // 男女・年代別 setter
    setSexage: function (response, request) {
      var $field = this.$('#sexage');
      var $tableTemplate = this.$('#sexageTableTemplate');
      var $theadTemplate = this.$('#theadTemplate');
      var $tbodyTemplate = this.$('#tbodyTemplate');
      var $columnTemplate0 = this.$('#columnTemplate0');
      var $columnTemplate1 = this.$('#sexageColumnTemplate1');
      var $columnTemplate2 = this.$('#sexageColumnTemplate2');
      var $rowTemplate0 = this.$('#rowTemplate0');
      var $rowTemplate1 = this.$('#rowTemplate1');
      var $rowTemplate2 = this.$('#rowTemplate2');
      var $rowTemplate3 = this.$('#rowTemplate3');
      var $dataTemplate01 = this.$('#dataTemplate01');
      var $dataTemplate02 = this.$('#dataTemplate02');
      var $dataTemplate03 = this.$('#dataTemplate03');
      var $dataTemplate1 = this.$('#sexageDataTemplate1');
      var $dataTemplate2 = this.$('#sexageDataTemplate2');
      var nf = mdbUtil.numberFormatMap;
      var rtColor = mdbUtil.rtColor;
      var header = [
        { name: '売上高', unit: '(千円)' },
        { name: '客数', unit: '(名)' },
        { name: '客単価', unit: '(円)' },
      ];
      var list = response.sexage_list;
      var _row = function (all, man, woman) {
        return [
          // 売上高
          {
            manVal: nf.sale_am(man.sale_am),
            womanVal: nf.sale_am(woman.sale_am),
            manLydfVal: nf.lydf_sale_am(man.lydf_sale_am),
            womanLydfVal: nf.lydf_sale_am(woman.lydf_sale_am),
            manLyrtVal: nf.lyrt_sale_am(man.lyrt_sale_am),
            womanLyrtVal: nf.lyrt_sale_am(woman.lyrt_sale_am),
            manColor: rtColor(man.lydf_sale_am, man.lyrt_sale_am),
            womanColor: rtColor(woman.lydf_sale_am, woman.lyrt_sale_am),
            allSumrtVal: nf.sumrt_sale_am(all.sumrt_sale_am),
            manSumrtVal: nf.sumrt_sale_am(man.sumrt_sale_am),
            womanSumrtVal: nf.sumrt_sale_am(woman.sumrt_sale_am),
          },
          // 客数
          {
            manVal: nf.customer_qy(man.customer_qy),
            womanVal: nf.customer_qy(woman.customer_qy),
            manLydfVal: nf.lydf_customer_qy(man.lydf_customer_qy),
            womanLydfVal: nf.lydf_customer_qy(woman.lydf_customer_qy),
            manLyrtVal: nf.lyrt_customer_qy(man.lyrt_customer_qy),
            womanLyrtVal: nf.lyrt_customer_qy(woman.lyrt_customer_qy),
            manColor: rtColor(man.lydf_customer_qy, man.lyrt_customer_qy),
            womanColor: rtColor(woman.lydf_customer_qy, woman.lyrt_customer_qy),
            allSumrtVal: nf.sumrt_customer_qy(all.sumrt_customer_qy),
            manSumrtVal: nf.sumrt_customer_qy(man.sumrt_customer_qy),
            womanSumrtVal: nf.sumrt_customer_qy(woman.sumrt_customer_qy),
          },
          // 客単価
          {
            manVal: nf.customer_uam(man.customer_uam),
            womanVal: nf.customer_uam(woman.customer_uam),
            manLydfVal: nf.lydf_customer_uam(man.lydf_customer_uam),
            womanLydfVal: nf.lydf_customer_uam(woman.lydf_customer_uam),
            manLyrtVal: nf.lyrt_customer_uam(man.lyrt_customer_uam),
            womanLyrtVal: nf.lyrt_customer_uam(woman.lyrt_customer_uam),
            manColor: rtColor(man.lydf_customer_uam, man.lyrt_customer_uam),
            womanColor: rtColor(
              woman.lydf_customer_uam,
              woman.lyrt_customer_uam
            ),
          },
        ];
      };
      var _hyphenatedRow = function (all, man, woman) {
        return _.map(_row(all, man, woman), function (data) {
          return _.extend(data, { manVal: '-', womanVal: '-' });
        });
      };
      var row = _row;
      var zoneRow = !Boolean(request.cond.zone_id) ? _hyphenatedRow : _row; // ゾーン未指定時はハイフン表示
      var allRow =
        clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
          ? _hyphenatedRow // 店舗アカウント時はハイフン表示
          : _row;
      $field.empty().append(
        $tableTemplate
          .tmpl()
          .filter('table')
          .append(
            _.reduce(
              header,
              function ($thead, column) {
                return $thead
                  .find('tr')
                  .first()
                  .append($columnTemplate1.tmpl(column))
                  .end()
                  .last()
                  .append($columnTemplate2.tmpl(column))
                  .end()
                  .end();
              },
              $theadTemplate
                .tmpl()
                .append($rowTemplate0.tmpl().append($columnTemplate0.tmpl()))
                .append($rowTemplate0.tmpl().append($columnTemplate0.tmpl()))
            )
              // 客単価の構成比は不要
              .find('tr')
              .each(function (index, tr) {
                $(tr).find('.sumrt').last().hide();
              })
              .end()
          )
          .append(
            _.reduce(
              list,
              function ($tbody, rspRec) {
                var item = rspRec.item;
                var pageArgs = _.extend(
                  {
                    sex: { id: amgbd_defs.AMGBD_DEFS_COND_SEX_MAN },
                    age: item,
                  },
                  request.xxx
                );
                return $tbody
                  .append(
                    _.reduce(
                      row(rspRec.all.rec, rspRec.man.rec, rspRec.woman.rec),
                      function ($row, data) {
                        return $row.append($dataTemplate1.tmpl(data));
                      },
                      $rowTemplate1
                        .tmpl()
                        .append($dataTemplate01.tmpl({ item: item }))
                    )
                  )
                  .append(
                    _.reduce(
                      zoneRow(
                        rspRec.all.zone_avg_rec,
                        rspRec.man.zone_avg_rec,
                        rspRec.woman.zone_avg_rec
                      ),
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
                      allRow(
                        rspRec.all.all_avg_rec,
                        rspRec.man.all_avg_rec,
                        rspRec.woman.all_avg_rec
                      ),
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
              // 1行目の構成比はハイフン表示
              .find('tr')
              .first()
              .find('.sumrt')
              .replaceWith($dataTemplate03.tmpl().get(0).outerHTML)
              .end()
              .end()
              .end()
              // 客単価の構成比は不要
              .find('tr')
              .each(function (index, tr) {
                $(tr).find('.sumrt').last().hide();
              })
              .end()
          )
          .end()
      );
    },

    // マーケット別 setter
    setMarket: function (response, request) {
      var $field = this.$('#market');
      var $tableTemplate = this.$('#marketTableTemplate');
      var $theadTemplate = this.$('#theadTemplate');
      var $tbodyTemplate = this.$('#tbodyTemplate');
      var $columnTemplate0 = this.$('#columnTemplate0');
      var $columnTemplate = this.$('#itemRspColumnTemplate');
      var $rowTemplate1 = this.$('#rowTemplate1');
      var $rowTemplate2 = this.$('#rowTemplate2');
      var $rowTemplate3 = this.$('#rowTemplate3');
      var $dataTemplate01 = this.$('#dataTemplate01');
      var $dataTemplate02 = this.$('#dataTemplate02');
      var $dataTemplate03 = this.$('#dataTemplate03');
      var $dataTemplate1 = this.$('#itemRspDataTemplate1');
      var $dataTemplate2 = this.$('#itemRspDataTemplate2');
      var nf = mdbUtil.numberFormatMap;
      var rtColor = mdbUtil.rtColor;
      var header = [
        { name: '売上高', unit: '(千円)' },
        { name: '客数', unit: '(名)' },
        { name: '客単価', unit: '(円)' },
      ];
      var list = response.market_list;
      var _row = function (rec) {
        return [
          // 売上高
          {
            val: nf.sale_am(rec.sale_am),
            lydfVal: nf.lydf_sale_am(rec.lydf_sale_am),
            lyrtVal: nf.lyrt_sale_am(rec.lyrt_sale_am),
            color: rtColor(rec.lydf_sale_am, rec.lyrt_sale_am),
            sumrtVal: nf.sumrt_sale_am(rec.sumrt_sale_am),
          },
          // 客数
          {
            val: nf.customer_qy(rec.customer_qy),
            lydfVal: nf.lydf_customer_qy(rec.lydf_customer_qy),
            lyrtVal: nf.lyrt_customer_qy(rec.lyrt_customer_qy),
            color: rtColor(rec.lydf_customer_qy, rec.lyrt_customer_qy),
            sumrtVal: nf.sumrt_customer_qy(rec.sumrt_customer_qy),
          },
          // 客単価
          {
            val: nf.customer_uam(rec.customer_uam),
            lydfVal: nf.lydf_customer_uam(rec.lydf_customer_uam),
            lyrtVal: nf.lyrt_customer_uam(rec.lyrt_customer_uam),
            color: rtColor(rec.lydf_customer_uam, rec.lyrt_customer_uam),
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
      $field.empty().append(
        $tableTemplate
          .tmpl()
          .filter('table')
          .append(
            _.reduce(
              header,
              function ($thead, column) {
                return $thead.append($columnTemplate.tmpl(column));
              },
              $theadTemplate.tmpl().append($columnTemplate0.tmpl())
            )
              // 客単価の構成比は不要
              .find('.sumrt')
              .last()
              .hide()
              .end()
              .end()
          )
          .append(
            _.reduce(
              list,
              function ($tbody, rspRec) {
                var item = rspRec.item;
                var pageArgs = _.extend({ market: item }, request.xxx);
                return $tbody
                  .append(
                    _.reduce(
                      row(rspRec.rec),
                      function ($row, data) {
                        return $row.append($dataTemplate1.tmpl(data));
                      },
                      $rowTemplate1
                        .tmpl({ type: rspRec.market_type })
                        .append($dataTemplate01.tmpl({ item: item }))
                    )
                  )
                  .append(
                    _.reduce(
                      zoneRow(rspRec.zone_avg_rec),
                      function ($row, data) {
                        return $row.append($dataTemplate2.tmpl(data));
                      },
                      $rowTemplate2.tmpl({ type: rspRec.market_type }).append(
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
                      $rowTemplate3.tmpl({ type: rspRec.market_type }).append(
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
              // 1行目の構成比はハイフン表示
              .find('tr')
              .first()
              .find('.sumrt')
              .replaceWith($dataTemplate03.tmpl().get(0).outerHTML)
              .end()
              .end()
              .end()
              // 客単価の構成比は不要
              .find('tr')
              .each(function (index, tr) {
                $(tr).find('.sumrt').last().hide();
              })
              .end()
          )
          .end()
      );
      // タブ情報
      var marketType = new mdbTab({
        el: this.$('#marketType'),
        list: [
          {
            id: AMDBV0020Rsp.AMDBV0020_MARKET_TYPE_GEN,
            name: '一般',
          },
          {
            id: AMDBV0020Rsp.AMDBV0020_MARKET_TYPE_FK_FD,
            name: 'FK・FD',
          },
          {
            id: AMDBV0020Rsp.AMDBV0020_MARKET_TYPE_RT_COAC,
            name: 'RT・成人式',
          },
          {
            id: AMDBV0020Rsp.AMDBV0020_MARKET_TYPE_DUTY_FREE,
            name: '免税',
          },
        ],
        onchange: _.bind(function (marketType) {
          var $trList = this.$('#market tbody tr').filter(
            ':not([value=0])' // 「全体」は常に表示
          );
          var filter = '[value=' + String(marketType.id) + ']';
          $trList.filter(filter).show();
          $trList.filter(':not(' + filter + ')').hide();
        }, this),
      });
      marketType.onchange();
    },

    // 会員・非会員 setter
    setMemb: function (response, request) {
      var $field = this.$('#memb');
      var $tableTemplate = this.$('#membTableTemplate');
      var $theadTemplate = this.$('#theadTemplate');
      var $tbodyTemplate = this.$('#tbodyTemplate');
      var $columnTemplate0 = this.$('#columnTemplate0');
      var $columnTemplate = this.$('#itemRspColumnTemplate');
      var $rowTemplate1 = this.$('#rowTemplate1');
      var $rowTemplate2 = this.$('#rowTemplate2');
      var $rowTemplate3 = this.$('#rowTemplate3');
      var $dataTemplate01 = this.$('#dataTemplate01');
      var $dataTemplate02 = this.$('#dataTemplate02');
      var $dataTemplate03 = this.$('#dataTemplate03');
      var $dataTemplate1 = this.$('#itemRspDataTemplate1');
      var $dataTemplate2 = this.$('#itemRspDataTemplate2');
      var nf = mdbUtil.numberFormatMap;
      var rtColor = mdbUtil.rtColor;
      var header = [
        { name: '売上高', unit: '(千円)' },
        { name: '客数', unit: '(名)' },
        { name: '客単価', unit: '(円)' },
      ];
      var list = response.memb_list;
      var _row = function (rec) {
        return [
          // 売上高
          {
            val: nf.sale_am(rec.sale_am),
            lydfVal: nf.lydf_sale_am(rec.lydf_sale_am),
            lyrtVal: nf.lyrt_sale_am(rec.lyrt_sale_am),
            color: rtColor(rec.lydf_sale_am, rec.lyrt_sale_am),
            sumrtVal: nf.sumrt_sale_am(rec.sumrt_sale_am),
          },
          // 客数
          {
            val: nf.customer_qy(rec.customer_qy),
            lydfVal: nf.lydf_customer_qy(rec.lydf_customer_qy),
            lyrtVal: nf.lyrt_customer_qy(rec.lyrt_customer_qy),
            color: rtColor(rec.lydf_customer_qy, rec.lyrt_customer_qy),
            sumrtVal: nf.sumrt_customer_qy(rec.sumrt_customer_qy),
          },
          // 客単価
          {
            val: nf.customer_uam(rec.customer_uam),
            lydfVal: nf.lydf_customer_uam(rec.lydf_customer_uam),
            lyrtVal: nf.lyrt_customer_uam(rec.lyrt_customer_uam),
            color: rtColor(rec.lydf_customer_uam, rec.lyrt_customer_uam),
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
      $field.empty().append(
        $tableTemplate
          .tmpl()
          .filter('table')
          .append(
            _.reduce(
              header,
              function ($thead, column) {
                return $thead.append($columnTemplate.tmpl(column));
              },
              $theadTemplate.tmpl().append($columnTemplate0.tmpl())
            )
              // 客単価の構成比は不要
              .find('.sumrt')
              .last()
              .hide()
              .end()
              .end()
          )
          .append(
            _.reduce(
              list,
              function ($tbody, rspRec) {
                var item = rspRec.item;
                var pageArgs = _.extend({ newmemb: item }, request.xxx);
                return $tbody
                  .append(
                    _.reduce(
                      row(rspRec.rec),
                      function ($row, data) {
                        return $row.append($dataTemplate1.tmpl(data));
                      },
                      $rowTemplate1
                        .tmpl()
                        .append($dataTemplate01.tmpl({ item: item }))
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
              // 1行目の構成比はハイフン表示
              .find('tr')
              .first()
              .find('.sumrt')
              .replaceWith($dataTemplate03.tmpl().get(0).outerHTML)
              .end()
              .end()
              .end()
              // 客単価の構成比は不要
              .find('tr')
              .each(function (index, tr) {
                $(tr).find('.sumrt').last().hide();
              })
              .end()
          )
          .end()
      );
    },

    // アプリ実績 setter
    setApp: function (response, request) {
      var $field = this.$('#app');
      var $tableTemplate = this.$('#appTableTemplate');
      var $theadTemplate = this.$('#theadTemplate');
      var $tbodyTemplate = this.$('#tbodyTemplate');
      var $columnTemplate0 = this.$('#columnTemplate0');
      var $columnTemplate = this.$('#itemRspColumnTemplate');
      var $rowTemplate1 = this.$('#rowTemplate1');
      var $rowTemplate2 = this.$('#rowTemplate2');
      var $rowTemplate3 = this.$('#rowTemplate3');
      var $dataTemplate01 = this.$('#dataTemplate01');
      var $dataTemplate02 = this.$('#dataTemplate02');
      var $dataTemplate03 = this.$('#dataTemplate03');
      var $dataTemplate1 = this.$('#itemRspDataTemplate1');
      var $dataTemplate2 = this.$('#itemRspDataTemplate2');
      var nf = mdbUtil.numberFormatMap;
      var rtColor = mdbUtil.rtColor;
      var header = [
        { name: '売上高', unit: '(千円)' },
        { name: '客数', unit: '(名)' },
        { name: '客単価', unit: '(円)' },
      ];
      var list = response.app_list;
      var _row = function (rec) {
        return [
          // 売上高
          {
            val: nf.sale_am(rec.sale_am),
            lydfVal: nf.lydf_sale_am(rec.lydf_sale_am),
            lyrtVal: nf.lyrt_sale_am(rec.lyrt_sale_am),
            color: rtColor(rec.lydf_sale_am, rec.lyrt_sale_am),
            sumrtVal: nf.sumrt_sale_am(rec.sumrt_sale_am),
          },
          // 客数
          {
            val: nf.customer_qy(rec.customer_qy),
            lydfVal: nf.lydf_customer_qy(rec.lydf_customer_qy),
            lyrtVal: nf.lyrt_customer_qy(rec.lyrt_customer_qy),
            color: rtColor(rec.lydf_customer_qy, rec.lyrt_customer_qy),
            sumrtVal: nf.sumrt_customer_qy(rec.sumrt_customer_qy),
          },
          // 客単価
          {
            val: nf.customer_uam(rec.customer_uam),
            lydfVal: nf.lydf_customer_uam(rec.lydf_customer_uam),
            lyrtVal: nf.lyrt_customer_uam(rec.lyrt_customer_uam),
            color: rtColor(rec.lydf_customer_uam, rec.lyrt_customer_uam),
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
      $field.empty().append(
        $tableTemplate
          .tmpl()
          .filter('table')
          .append(
            _.reduce(
              header,
              function ($thead, column) {
                return $thead.append($columnTemplate.tmpl(column));
              },
              $theadTemplate.tmpl().append($columnTemplate0.tmpl())
            )
              // 客単価の構成比は不要
              .find('.sumrt')
              .last()
              .hide()
              .end()
              .end()
          )
          .append(
            _.reduce(
              list,
              function ($tbody, rspRec) {
                var item = rspRec.item;
                var pageArgs = _.extend({ newapp: item }, request.xxx);
                return $tbody
                  .append(
                    _.reduce(
                      row(rspRec.rec),
                      function ($row, data) {
                        return $row.append($dataTemplate1.tmpl(data));
                      },
                      $rowTemplate1
                        .tmpl()
                        .append($dataTemplate01.tmpl({ item: item }))
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
              // 1行目の構成比はハイフン表示
              .find('tr')
              .first()
              .find('.sumrt')
              .replaceWith($dataTemplate03.tmpl().get(0).outerHTML)
              .end()
              .end()
              .end()
              // 客単価の構成比は不要
              .find('tr')
              .each(function (index, tr) {
                $(tr).find('.sumrt').last().hide();
              })
              .end()
          )
          .end()
      );
    },

    // 付着率 setter
    setAr: function (response, request) {
      var $field = this.$('#ar');
      var arRec = response.ar_rec;
      var $tableTemplate = this.$('#arTableTemplate');
      var $theadTemplate = this.$('#theadTemplate');
      var $tbodyTemplate = this.$('#tbodyTemplate');
      var $columnTemplate = this.$('#arrrdrColumnTemplate');
      var $rowTemplate1 = this.$('#rowTemplate1');
      var $rowTemplate2 = this.$('#rowTemplate2');
      var $rowTemplate3 = this.$('#rowTemplate3');
      var $dataTemplate1 = this.$('#arrrdrDataTemplate1');
      var $dataTemplate2 = this.$('#arrrdrDataTemplate2');
      var nf = mdbUtil.numberFormatMap;
      var dfColor = mdbUtil.dfColor;
      var rec = arRec.rec;
      var zoneAvgRec = arRec.zone_avg_rec;
      var allAvgRec = arRec.all_avg_rec;
      var cond = request.cond;
      var isORIHICA =
        cond.unit_id ==
        Number(clcom.getSysparam(amcm_sysparams.PAR_AMMS_UNITID_ORI));
      var list = [
        [
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_BY3,
                name: 'BY3点',
              },
              val: nf.levelup_ar_by3(rec.levelup_ar_by3.val),
              lydfVal: nf.lydf_levelup_ar_by3(rec.levelup_ar_by3.lydf_val),
              color: dfColor(rec.levelup_ar_by3.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_ar_by3.zone_rank),
              val: nf.levelup_ar_by3(zoneAvgRec.levelup_ar_by3.val),
            },
            {
              rank: nf.all_rank(rec.levelup_ar_by3.all_rank),
              val: nf.levelup_ar_by3(allAvgRec.levelup_ar_by3.val),
            },
          ],
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_PLT,
                name: 'プリーツ',
              },
              val: nf.levelup_ar_plt(rec.levelup_ar_plt.val),
              lydfVal: nf.lydf_levelup_ar_plt(rec.levelup_ar_plt.lydf_val),
              color: dfColor(rec.levelup_ar_plt.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_ar_plt.zone_rank, isORIHICA),
              val: nf.levelup_ar_plt(zoneAvgRec.levelup_ar_plt.val),
            },
            {
              rank: nf.all_rank(rec.levelup_ar_plt.all_rank, isORIHICA),
              val: nf.levelup_ar_plt(allAvgRec.levelup_ar_plt.val),
            },
          ],
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_NANO,
                name: 'ナノクリーン',
              },
              val: nf.levelup_ar_nano(rec.levelup_ar_nano.val),
              lydfVal: nf.lydf_levelup_ar_nano(rec.levelup_ar_nano.lydf_val),
              color: dfColor(rec.levelup_ar_nano.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_ar_nano.zone_rank),
              val: nf.levelup_ar_nano(zoneAvgRec.levelup_ar_nano.val),
            },
            {
              rank: nf.all_rank(rec.levelup_ar_nano.all_rank),
              val: nf.levelup_ar_nano(allAvgRec.levelup_ar_nano.val),
            },
          ],
        ],
        [
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_SHOES,
                name: 'シューズ',
              },
              val: nf.levelup_ar_shoes(rec.levelup_ar_shoes.val),
              lydfVal: nf.lydf_levelup_ar_shoes(rec.levelup_ar_shoes.lydf_val),
              color: dfColor(rec.levelup_ar_shoes.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_ar_shoes.zone_rank),
              val: nf.levelup_ar_shoes(zoneAvgRec.levelup_ar_shoes.val),
            },
            {
              rank: nf.all_rank(rec.levelup_ar_shoes.all_rank),
              val: nf.levelup_ar_shoes(allAvgRec.levelup_ar_shoes.val),
            },
          ],
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_SPC,
                name: 'SPCメンズ',
              },
              val: nf.levelup_ar_spc(rec.levelup_ar_spc.val),
              lydfVal: nf.lydf_levelup_ar_spc(rec.levelup_ar_spc.lydf_val),
              color: dfColor(rec.levelup_ar_spc.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_ar_spc.zone_rank),
              val: nf.levelup_ar_spc(zoneAvgRec.levelup_ar_spc.val),
            },
            {
              rank: nf.all_rank(rec.levelup_ar_spc.all_rank),
              val: nf.levelup_ar_spc(allAvgRec.levelup_ar_spc.val),
            },
          ],
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_DRY,
                name: 'ドライパッド',
              },
              val: nf.levelup_ar_dry(rec.levelup_ar_dry.val),
              lydfVal: nf.lydf_levelup_ar_dry(rec.levelup_ar_dry.lydf_val),
              color: dfColor(rec.levelup_ar_dry.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_ar_dry.zone_rank),
              val: nf.levelup_ar_dry(zoneAvgRec.levelup_ar_dry.val),
            },
            {
              rank: nf.all_rank(rec.levelup_ar_dry.all_rank),
              val: nf.levelup_ar_dry(allAvgRec.levelup_ar_dry.val),
            },
          ],
        ],
        [
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_EIGHT,
                name: 'エイトストップ',
              },
              val: nf.levelup_ar_eight(rec.levelup_ar_eight.val),
              lydfVal: nf.lydf_levelup_ar_eight(rec.levelup_ar_eight.lydf_val),
              color: dfColor(rec.levelup_ar_eight.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_ar_eight.zone_rank),
              val: nf.levelup_ar_eight(zoneAvgRec.levelup_ar_eight.val),
            },
            {
              rank: nf.all_rank(rec.levelup_ar_eight.all_rank),
              val: nf.levelup_ar_eight(allAvgRec.levelup_ar_eight.val),
            },
          ],
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_L_SPC,
                name: 'SPCレディス',
              },
              val: nf.levelup_ar_l_spc(rec.levelup_ar_l_spc.val),
              lydfVal: nf.lydf_levelup_ar_l_spc(rec.levelup_ar_l_spc.lydf_val),
              color: dfColor(rec.levelup_ar_l_spc.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_ar_l_spc.zone_rank, isORIHICA),
              val: nf.levelup_ar_l_spc(zoneAvgRec.levelup_ar_l_spc.val),
            },
            {
              rank: nf.all_rank(rec.levelup_ar_l_spc.all_rank, isORIHICA),
              val: nf.levelup_ar_l_spc(allAvgRec.levelup_ar_l_spc.val),
            },
          ],
        ],
        [
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_HEART,
                name: 'ハートシック',
              },
              val: nf.levelup_ar_heart(rec.levelup_ar_heart.val),
              lydfVal: nf.lydf_levelup_ar_heart(rec.levelup_ar_heart.lydf_val),
              color: dfColor(rec.levelup_ar_heart.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_ar_heart.zone_rank),
              val: nf.levelup_ar_heart(zoneAvgRec.levelup_ar_heart.val),
            },
            {
              rank: nf.all_rank(rec.levelup_ar_heart.all_rank),
              val: nf.levelup_ar_heart(allAvgRec.levelup_ar_heart.val),
            },
          ],
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_AR_JUST,
                name: 'ジャスト感',
              },
              val: nf.levelup_ar_just(rec.levelup_ar_just.val),
              lydfVal: nf.lydf_levelup_ar_just(rec.levelup_ar_just.lydf_val),
              color: dfColor(rec.levelup_ar_just.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_ar_just.zone_rank, isORIHICA),
              val: nf.levelup_ar_just(zoneAvgRec.levelup_ar_just.val),
            },
            {
              rank: nf.all_rank(rec.levelup_ar_just.all_rank, isORIHICA),
              val: nf.levelup_ar_just(allAvgRec.levelup_ar_just.val),
            },
          ],
        ],
      ];
      var isDivFiltered = Boolean(cond.div_id);
      var f_hyphen0 = isDivFiltered; // 品種指定時はハイフン表示
      var f_hyphen1 = isDivFiltered || !Boolean(cond.zone_id); // 品種指定時、ゾーン未指定時はハイフン表示
      var f_hyphen2 =
        isDivFiltered ||
        clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE; // 品種指定時、店舗アカウント時はハイフン表示
      var xxx = request.xxx;
      var row = function (_row) {
        return _.map(_row, function (data) {
          return _.extend(
            data[0],
            f_hyphen0 ? { val: '-', lydfVal: '-', color: '' } : {}
          );
        });
      };
      var zoneRow = function (_row) {
        return _.map(_row, function (data) {
          return _.extend(
            data[1],
            {
              rankName: 'ゾ',
              name: 'ゾーン実績',
              pageArgs: _.extend({ rankItem: data[0].rankItem }, xxx),
            },
            f_hyphen1 ? { val: '-' } : {}
          );
        });
      };
      var allRow = function (_row) {
        return _.map(_row, function (data) {
          return _.extend(
            data[2],
            {
              rankName: '全',
              name: '全国実績',
              pageArgs: _.extend({ rankItem: data[0].rankItem }, xxx),
            },
            f_hyphen2 ? { val: '-' } : {}
          );
        });
      };
      $field.empty().append(
        $tableTemplate
          .tmpl()
          .filter('table')
          .append(
            $theadTemplate
              .tmpl()
              .append($columnTemplate.tmpl())
              .append($columnTemplate.tmpl())
              .append($columnTemplate.tmpl())
          )
          .append(
            _.reduce(
              list,
              function ($tbody, _row) {
                return $tbody
                  .append(
                    _.reduce(
                      row(_row),
                      function ($row, data) {
                        return $row.append($dataTemplate1.tmpl(data));
                      },
                      $rowTemplate1.tmpl()
                    )
                  )
                  .append(
                    _.reduce(
                      zoneRow(_row),
                      function ($row, data) {
                        return $row.append(
                          $dataTemplate2
                            .tmpl(data)
                            .find('.rankButton')
                            .data('pageArgs', data.pageArgs)
                            .addClass(data.rank == '-' ? 'disabled' : '')
                            .end()
                        );
                      },
                      $rowTemplate2.tmpl()
                    )
                  )
                  .append(
                    _.reduce(
                      allRow(_row),
                      function ($row, data) {
                        return $row.append(
                          $dataTemplate2
                            .tmpl(data)
                            .find('.rankButton')
                            .data('pageArgs', data.pageArgs)
                            .addClass(data.rank == '-' ? 'disabled' : '')
                            .end()
                        );
                      },
                      $rowTemplate3.tmpl()
                    )
                  );
              },
              $tbodyTemplate.tmpl()
            )
          )
          .end()
      );
    },

    // 関連率・決定率 setter
    setRrdr: function (response, request) {
      var $field = this.$('#rrdr');
      var rrdrRec = response.rrdr_rec;
      var $tableTemplate = this.$('#rrdrTableTemplate');
      var $theadTemplate = this.$('#theadTemplate');
      var $tbodyTemplate = this.$('#tbodyTemplate');
      var $columnTemplate = this.$('#arrrdrColumnTemplate');
      var $rowTemplate1 = this.$('#rowTemplate1');
      var $rowTemplate2 = this.$('#rowTemplate2');
      var $rowTemplate3 = this.$('#rowTemplate3');
      var $dataTemplate1 = this.$('#arrrdrDataTemplate1');
      var $dataTemplate2 = this.$('#arrrdrDataTemplate2');
      var nf = mdbUtil.numberFormatMap;
      var dfColor = mdbUtil.dfColor;
      var rec = rrdrRec.rec;
      var zoneAvgRec = rrdrRec.zone_avg_rec;
      var allAvgRec = rrdrRec.all_avg_rec;
      var cond = request.cond;
      var list = [
        [
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_RR_SUITS,
                name: 'スーツ関連率',
              },
              val: nf.levelup_rr_suits(rec.levelup_rr_suits.val),
              lydfVal: nf.lydf_levelup_rr_suits(rec.levelup_rr_suits.lydf_val),
              color: dfColor(rec.levelup_rr_suits.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_rr_suits.zone_rank),
              val: nf.levelup_rr_suits(zoneAvgRec.levelup_rr_suits.val),
            },
            {
              rank: nf.all_rank(rec.levelup_rr_suits.all_rank),
              val: nf.levelup_rr_suits(allAvgRec.levelup_rr_suits.val),
            },
          ],
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_RR_SL,
                name: 'SL関連率',
              },
              val: nf.levelup_rr_sl(rec.levelup_rr_sl.val),
              lydfVal: nf.lydf_levelup_rr_sl(rec.levelup_rr_sl.lydf_val),
              color: dfColor(rec.levelup_rr_sl.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_rr_sl.zone_rank),
              val: nf.levelup_rr_sl(zoneAvgRec.levelup_rr_sl.val),
            },
            {
              rank: nf.all_rank(rec.levelup_rr_sl.all_rank),
              val: nf.levelup_rr_sl(allAvgRec.levelup_rr_sl.val),
            },
          ],
        ],
        [
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_RR_JK,
                name: 'JK関連率',
              },
              val: nf.levelup_rr_jk(rec.levelup_rr_jk.val),
              lydfVal: nf.lydf_levelup_rr_jk(rec.levelup_rr_jk.lydf_val),
              color: dfColor(rec.levelup_rr_jk.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_rr_jk.zone_rank),
              val: nf.levelup_rr_jk(zoneAvgRec.levelup_rr_jk.val),
            },
            {
              rank: nf.all_rank(rec.levelup_rr_jk.all_rank),
              val: nf.levelup_rr_jk(allAvgRec.levelup_rr_jk.val),
            },
          ],
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_DR_SL3,
                name: 'SL3本決定率',
              },
              val: nf.levelup_dr_sl3(rec.levelup_dr_sl3.val),
              lydfVal: nf.lydf_levelup_dr_sl3(rec.levelup_dr_sl3.lydf_val),
              color: dfColor(rec.levelup_dr_sl3.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_dr_sl3.zone_rank),
              val: nf.levelup_dr_sl3(zoneAvgRec.levelup_dr_sl3.val),
            },
            {
              rank: nf.all_rank(rec.levelup_dr_sl3.all_rank),
              val: nf.levelup_dr_sl3(allAvgRec.levelup_dr_sl3.val),
            },
          ],
        ],
        [
          [
            {
              rankItem: {
                id: amgbd_defs.AMGBD_DEFS_RANK_LEVELUP_DR_JC3,
                name: '重中3着決定率',
              },
              val: nf.levelup_dr_jc3(rec.levelup_dr_jc3.val),
              lydfVal: nf.lydf_levelup_dr_jc3(rec.levelup_dr_jc3.lydf_val),
              color: dfColor(rec.levelup_dr_jc3.lydf_val),
            },
            {
              rank: nf.zone_rank(rec.levelup_dr_jc3.zone_rank),
              val: nf.levelup_dr_jc3(zoneAvgRec.levelup_dr_jc3.val),
            },
            {
              rank: nf.all_rank(rec.levelup_dr_jc3.all_rank),
              val: nf.levelup_dr_jc3(allAvgRec.levelup_dr_jc3.val),
            },
          ],
        ],
      ];
      var isDivFiltered = Boolean(cond.div_id);
      var f_hyphen0 = isDivFiltered; // 品種指定時はハイフン表示
      var f_hyphen1 = isDivFiltered || !Boolean(cond.zone_id); // 品種指定時、ゾーン未指定時はハイフン表示
      var f_hyphen2 =
        isDivFiltered ||
        clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE; // 品種指定時、店舗アカウント時はハイフン表示
      var xxx = request.xxx;
      var row = function (_row) {
        return _.map(_row, function (data) {
          return _.extend(
            data[0],
            f_hyphen0 ? { val: '-', lydfVal: '-', color: '' } : {}
          );
        });
      };
      var zoneRow = function (_row) {
        return _.map(_row, function (data) {
          return _.extend(
            data[1],
            {
              rankName: 'ゾ',
              name: 'ゾーン実績',
              pageArgs: _.extend({ rankItem: data[0].rankItem }, xxx),
            },
            f_hyphen1 ? { val: '-' } : {}
          );
        });
      };
      var allRow = function (_row) {
        return _.map(_row, function (data) {
          return _.extend(
            data[2],
            {
              rankName: '全',
              name: '全国実績',
              pageArgs: _.extend({ rankItem: data[0].rankItem }, xxx),
            },
            f_hyphen2 ? { val: '-' } : {}
          );
        });
      };
      $field.empty().append(
        $tableTemplate
          .tmpl()
          .filter('table')
          .append(
            $theadTemplate
              .tmpl()
              .append($columnTemplate.tmpl())
              .append($columnTemplate.tmpl())
          )
          .append(
            _.reduce(
              list,
              function ($tbody, _row) {
                return $tbody
                  .append(
                    _.reduce(
                      row(_row),
                      function ($row, data) {
                        return $row.append($dataTemplate1.tmpl(data));
                      },
                      $rowTemplate1.tmpl()
                    )
                  )
                  .append(
                    _.reduce(
                      zoneRow(_row),
                      function ($row, data) {
                        return $row.append(
                          $dataTemplate2
                            .tmpl(data)
                            .find('.rankButton')
                            .data('pageArgs', data.pageArgs)
                            .addClass(data.rank == '-' ? 'disabled' : '')
                            .end()
                        );
                      },
                      $rowTemplate2.tmpl()
                    )
                  )
                  .append(
                    _.reduce(
                      allRow(_row),
                      function ($row, data) {
                        return $row.append(
                          $dataTemplate2
                            .tmpl(data)
                            .find('.rankButton')
                            .data('pageArgs', data.pageArgs)
                            .addClass(data.rank == '-' ? 'disabled' : '')
                            .end()
                        );
                      },
                      $rowTemplate3.tmpl()
                    )
                  );
              },
              $tbodyTemplate.tmpl()
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
      // 「マーケット別」「会員・非会員」「アプリ実績」は「男女・年代別」の列に揃える
      var widthList = _.map(this.$('#sexage').find('th'), function (th) {
        return parseFloat(getComputedStyle(th).width);
      });
      [this.$('#market'), this.$('#memb'), this.$('#app')].forEach(function ($field) {
        $field.find('th').each(
          _.bind(function (index, th) {
            this.$(th).css({ width: widthList[index] });
          }, this)
        );
      });
      // 「関連率・決定率」は「付着率」の列に揃える
      var widthList = _.map(this.$('#ar').find('th'), function (th) {
        return parseFloat(getComputedStyle(th).width);
      });
      [this.$('#rrdr')].forEach(function ($field) {
        $field.find('th').each(
          _.bind(function (index, th) {
            this.$(th).css({ width: widthList[index] });
          }, this)
        );
      });
    },
  });
  mdbUtil.getIniJSON().then(function () {
    mainView = new AMDBV0020();
    return mainView.initialize2();
  });
});
