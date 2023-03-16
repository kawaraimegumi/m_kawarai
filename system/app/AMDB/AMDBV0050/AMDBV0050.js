$(function () {
  var AMDBV0050 = Backbone.View.extend({
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
      // 店舗
      this.orgTree = new mdbOrgTree({ el: this.$('#orgTree') });

      $(window).resize(this.onresize);
    },

    // 初期値設定(通信はこちらで行う)
    initialize2: function () {
      var pageArgs = clcom.pageArgs || {};
      return Promise.resolve()
        .then(this.baseView.set)
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
      var orgTree = this.orgTree.get();
      return {
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
        cond: {
          unit_id: orgTree.unit.org_id,
          area_id: orgTree.area.org_id,
          zone_id: orgTree.zone.org_id,
          org_id: orgTree.org.org_id,
        },
        // 以下は通信に無関係
        xxx: { orgTree: orgTree },
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
      this.setWeekPlan(response, request); // 当週計画達成必要額
      this.setWeekLand(response, request); // 当週着地見込
      this.setMonthPlan(response, request); // 当月計画達成必要額
      this.setMonthLand(response, request); // 当月着地見込
      this.setYear2Plan(response, request); // 当半期計画達成必要額
      this.setYear2Land(response, request); // 当半期着地見込
      this.setYearPlan(response, request); // 当年計画達成必要額
      this.setYearLand(response, request); // 当年着地見込
      this.onresize();
    },

    // 当週計画達成必要額 setter
    setWeekPlan: function (response, request) {
      var rspRec = response.week_plan_rec;
      var nf = mdbUtil.numberFormatMap;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 売上高
          {
            val: nf.sale_am(rec.sale_am),
            plandfVal: nf.plandf_sale_am(rec.plandf_sale_am),
            planrtVal: nf.planrt_sale_am(rec.planrt_sale_am),
            color: rtColor(rec.plandf_sale_am, rec.planrt_sale_am),
          },
          // 経準高
          {
            val: nf.prof_am(rec.prof_am),
            plandfVal: nf.plandf_prof_am(rec.plandf_prof_am),
            planrtVal: nf.planrt_prof_am(rec.planrt_prof_am),
            color: rtColor(rec.plandf_prof_am, rec.planrt_prof_am),
          },
        ];
      };
      this.setTable(
        this.$('#weekPlan'),
        '当週計画達成必要額',
        7,
        rspRec.remain_days,
        [
          {
            name: '売上高',
            unit: '(千円)',
            name1: '目標数値',
            name2: '計画差(比)',
          },
          {
            name: '経準高',
            unit: '(千円)',
            name1: '目標数値',
            name2: '計画差(比)',
          },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 当週着地見込 setter
    setWeekLand: function (response, request) {
      var rspRec = response.week_land_rec;
      var nf = mdbUtil.numberFormatMap;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 売上高
          {
            val: nf.sale_am(rec.sale_am),
            plandfVal: nf.plandf_sale_am(rec.plandf_sale_am),
            planrtVal: nf.planrt_sale_am(rec.planrt_sale_am),
            color: rtColor(rec.plandf_sale_am, rec.planrt_sale_am),
          },
          // 経準高
          {
            val: nf.prof_am(rec.prof_am),
            plandfVal: nf.plandf_prof_am(rec.plandf_prof_am),
            planrtVal: nf.planrt_prof_am(rec.planrt_prof_am),
            color: rtColor(rec.plandf_prof_am, rec.planrt_prof_am),
          },
        ];
      };
      this.setTable(
        this.$('#weekLand'),
        '当週着地見込',
        0,
        rspRec.remain_days,
        [
          {
            name: '売上高',
            unit: '(千円)',
            name1: '',
            name2: '計画差(比)',
          },
          {
            name: '経準高',
            unit: '(千円)',
            name1: '',
            name2: '計画差(比)',
          },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 当月計画達成必要額 setter
    setMonthPlan: function (response, request) {
      var rspRec = response.month_plan_rec;
      var nf = mdbUtil.numberFormatMap;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 売上高
          {
            val: nf.sale_am(rec.sale_am),
            plandfVal: nf.plandf_sale_am(rec.plandf_sale_am),
            planrtVal: nf.planrt_sale_am(rec.planrt_sale_am),
            color: rtColor(rec.plandf_sale_am, rec.planrt_sale_am),
          },
          // 経準高
          {
            val: nf.prof_am(rec.prof_am),
            plandfVal: nf.plandf_prof_am(rec.plandf_prof_am),
            planrtVal: nf.planrt_prof_am(rec.planrt_prof_am),
            color: rtColor(rec.plandf_prof_am, rec.planrt_prof_am),
          },
        ];
      };
      this.setTable(
        this.$('#monthPlan'),
        '当月計画達成必要額',
        mdbUtil.getMonthDays(),
        rspRec.remain_days,
        [
          {
            name: '売上高',
            unit: '(千円)',
            name1: '目標数値',
            name2: '計画差(比)',
          },
          {
            name: '経準高',
            unit: '(千円)',
            name1: '目標数値',
            name2: '計画差(比)',
          },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 当月着地見込 setter
    setMonthLand: function (response, request) {
      var rspRec = response.month_land_rec;
      var nf = mdbUtil.numberFormatMap;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 売上高
          {
            val: nf.sale_am(rec.sale_am),
            plandfVal: nf.plandf_sale_am(rec.plandf_sale_am),
            planrtVal: nf.planrt_sale_am(rec.planrt_sale_am),
            color: rtColor(rec.plandf_sale_am, rec.planrt_sale_am),
          },
          // 経準高
          {
            val: nf.prof_am(rec.prof_am),
            plandfVal: nf.plandf_prof_am(rec.plandf_prof_am),
            planrtVal: nf.planrt_prof_am(rec.planrt_prof_am),
            color: rtColor(rec.plandf_prof_am, rec.planrt_prof_am),
          },
        ];
      };
      this.setTable(
        this.$('#monthLand'),
        '当月着地見込',
        0,
        rspRec.remain_days,
        [
          {
            name: '売上高',
            unit: '(千円)',
            name1: '',
            name2: '計画差(比)',
          },
          {
            name: '経準高',
            unit: '(千円)',
            name1: '',
            name2: '計画差(比)',
          },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 当半期計画達成必要額 setter
    setYear2Plan: function (response, request) {
      var rspRec = response.year2_plan_rec;
      var nf = mdbUtil.numberFormatMap;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 売上高
          {
            val: nf.sale_am(rec.sale_am),
            plandfVal: nf.plandf_sale_am(rec.plandf_sale_am),
            planrtVal: nf.planrt_sale_am(rec.planrt_sale_am),
            color: rtColor(rec.plandf_sale_am, rec.planrt_sale_am),
          },
          // 経準高
          {
            val: nf.prof_am(rec.prof_am),
            plandfVal: nf.plandf_prof_am(rec.plandf_prof_am),
            planrtVal: nf.planrt_prof_am(rec.planrt_prof_am),
            color: rtColor(rec.plandf_prof_am, rec.planrt_prof_am),
          },
        ];
      };
      this.setTable(
        this.$('#year2Plan'),
        '当半期計画達成必要額',
        mdbUtil.getYearDays() / 2,
        rspRec.remain_days,
        [
          {
            name: '売上高',
            unit: '(千円)',
            name1: '目標数値',
            name2: '計画差(比)',
          },
          {
            name: '経準高',
            unit: '(千円)',
            name1: '目標数値',
            name2: '計画差(比)',
          },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 当半期着地見込 setter
    setYear2Land: function (response, request) {
      var rspRec = response.year2_land_rec;
      var nf = mdbUtil.numberFormatMap;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 売上高
          {
            val: nf.sale_am(rec.sale_am),
            plandfVal: nf.plandf_sale_am(rec.plandf_sale_am),
            planrtVal: nf.planrt_sale_am(rec.planrt_sale_am),
            color: rtColor(rec.plandf_sale_am, rec.planrt_sale_am),
          },
          // 経準高
          {
            val: nf.prof_am(rec.prof_am),
            plandfVal: nf.plandf_prof_am(rec.plandf_prof_am),
            planrtVal: nf.planrt_prof_am(rec.planrt_prof_am),
            color: rtColor(rec.plandf_prof_am, rec.planrt_prof_am),
          },
        ];
      };
      this.setTable(
        this.$('#year2Land'),
        '当半期着地見込',
        0,
        rspRec.remain_days,
        [
          {
            name: '売上高',
            unit: '(千円)',
            name1: '',
            name2: '計画差(比)',
          },
          {
            name: '経準高',
            unit: '(千円)',
            name1: '',
            name2: '計画差(比)',
          },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 当年計画達成必要額 setter
    setYearPlan: function (response, request) {
      var rspRec = response.year_plan_rec;
      var nf = mdbUtil.numberFormatMap;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 売上高
          {
            val: nf.sale_am(rec.sale_am),
            plandfVal: nf.plandf_sale_am(rec.plandf_sale_am),
            planrtVal: nf.planrt_sale_am(rec.planrt_sale_am),
            color: rtColor(rec.plandf_sale_am, rec.planrt_sale_am),
          },
          // 経準高
          {
            val: nf.prof_am(rec.prof_am),
            plandfVal: nf.plandf_prof_am(rec.plandf_prof_am),
            planrtVal: nf.planrt_prof_am(rec.planrt_prof_am),
            color: rtColor(rec.plandf_prof_am, rec.planrt_prof_am),
          },
        ];
      };
      this.setTable(
        this.$('#yearPlan'),
        '当年計画達成必要額',
        mdbUtil.getYearDays(),
        rspRec.remain_days,
        [
          {
            name: '売上高',
            unit: '(千円)',
            name1: '目標数値',
            name2: '計画差(比)',
          },
          {
            name: '経準高',
            unit: '(千円)',
            name1: '目標数値',
            name2: '計画差(比)',
          },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // 当年着地見込 setter
    setYearLand: function (response, request) {
      var rspRec = response.year_land_rec;
      var nf = mdbUtil.numberFormatMap;
      var rtColor = mdbUtil.rtColor;
      var row = function (rec) {
        return [
          // 売上高
          {
            val: nf.sale_am(rec.sale_am),
            plandfVal: nf.plandf_sale_am(rec.plandf_sale_am),
            planrtVal: nf.planrt_sale_am(rec.planrt_sale_am),
            color: rtColor(rec.plandf_sale_am, rec.planrt_sale_am),
          },
          // 経準高
          {
            val: nf.prof_am(rec.prof_am),
            plandfVal: nf.plandf_prof_am(rec.plandf_prof_am),
            planrtVal: nf.planrt_prof_am(rec.planrt_prof_am),
            color: rtColor(rec.plandf_prof_am, rec.planrt_prof_am),
          },
        ];
      };
      this.setTable(
        this.$('#yearLand'),
        '当年着地見込',
        0,
        rspRec.remain_days,
        [
          {
            name: '売上高',
            unit: '(千円)',
            name1: '',
            name2: '計画差(比)',
          },
          {
            name: '経準高',
            unit: '(千円)',
            name1: '',
            name2: '計画差(比)',
          },
        ],
        [row(rspRec.rec), row(rspRec.zone_avg_rec), row(rspRec.all_avg_rec)],
        request
      );
    },

    // テーブル setter
    setTable: function ($field, name, days, remainDays, header, rows, request) {
      var $tableTemplate = this.$('#tableTemplate');
      var $theadTemplate = this.$('#theadTemplate');
      var $tbodyTemplate = this.$('#tbodyTemplate');
      var $columnTemplate0 = this.$('#columnTemplate0');
      var $columnTemplate = this.$('#columnTemplate');
      var $rowTemplate = this.$('#rowTemplate');
      var $dataTemplate0 = this.$('#dataTemplate0');
      var $dataTemplate = this.$('#dataTemplate');
      var r = days ? remainDays / days : 0;
      var cond = request.cond;
      var _row = _.identity;
      var _hyphenatedRow = function (row) {
        return _.map(row, function (data) {
          return _.extend(data, { val: '-', plandfVal: '-', planrtVal: '-' });
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
            name: name,
            remainDays: days ? '残り' + remainDays + '日' : '',
          })
          .filter('.remainDays') // 残り日数によって色と線の長さを変える
          .css({ width: String(100 * r) + '%' })
          .addClass(
            !r
              ? ''
              : r < 1 / 3
              ? 'remainDaysRed'
              : r < 2 / 3
              ? 'remainDaysYellow'
              : 'remainDaysBlue'
          )
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

    // 画面サイズ変更時の処理
    onresize: function (e) {
      // 「当週計画達成必要額」「当月計画達成必要額」「当半期計画達成必要額」は「当年計画達成必要額」の列に揃える
      var widthList = _.map(this.$('#yearPlan').find('th'), function (th) {
        return parseFloat(getComputedStyle(th).width);
      });
      [this.$('#weekPlan'), this.$('#monthPlan'), this.$('#year2Plan')].forEach(
        function ($field) {
          $field.find('th').each(
            _.bind(function (index, th) {
              this.$(th).css({ width: widthList[index] });
            }, this)
          );
        }
      );
      // 「当週着地見込」「当月着地見込」「当半期着地見込」は「当年着地見込」の列に揃える
      var widthList = _.map(this.$('#yearLand').find('th'), function (th) {
        return parseFloat(getComputedStyle(th).width);
      });
      [this.$('#weekLand'), this.$('#monthLand'), this.$('#year2Land')].forEach(
        function ($field) {
          $field.find('th').each(
            _.bind(function (index, th) {
              this.$(th).css({ width: widthList[index] });
            }, this)
          );
        }
      );
    },
  });
  mdbUtil.getIniJSON().then(function () {
    mainView = new AMDBV0050();
    return mainView.initialize2();
  });
});
