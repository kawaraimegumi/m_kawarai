$(function () {
  if (clcom.pageArgs && clcom.pageArgs.homeUrl) {
    clcom.homeUrl = clcom.pageArgs.homeUrl;
  }
  if (clcom.pageData && clcom.pageData.homeUrl) {
    clcom.homeUrl = clcom.pageData.homeUrl;
  }
  var MainView = Backbone.View.extend({
    el: $('#ca_main'),
    validator: null,
    events: {
      'click #output_button': 'onclickOutputButton', // [帳票出力]押下
    },

    initialize: function () {
      _.bindAll(this);
      this.validator = clutil.validatorWithTicker(this.$el, {
        echoback: $('.cl_echoback').hide(),
      });
    },

    render: function () {
      return this;
    },

    initUIelement: function () {
      // 出力対象
      this.outputTargetList = [
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY1,
          name: '【全マーケット】品種別実績',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY2,
          name: '【全マーケット】ゾーン別実績',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY3,
          name: '【全マーケット】ゾーン別実績_グラフ',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY4,
          name: '【全マーケット】ゾーン別実績_顧客・新規別',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY5,
          name: '【全マーケット】品種別x年代別実績TTL',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY6,
          name: '【全マーケット】品種別x年代別実績_新規',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY7,
          name: '【全マーケット】品種別x年代別実績_顧客',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY8,
          name: '【全マーケット】ゾーン別実績x年代別_TTL',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY9,
          name: '【全マーケット】ゾーン別実績x年代別_男性',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY10,
          name: '【全マーケット】ゾーン別実績x年代別_女性',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY11,
          name: '【全マーケット】ゾーン別実績xクールビズ・ウォームビズ品種別',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY12,
          name: '週別×ゾーン別_新規顧客実績',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY15,
          name: '【全マーケット】ゾーン別実績x品種別',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY16,
          name: '【全マーケット】ゾーン別実績xマーケット別',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY17,
          name: '週間天気予報',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY18,
          name: '週別x品種別実績(既存店)',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY19,
          name: '年度シャツ＆礼服シーズン別実績',
        },
        {
          id: amcm_type.AMCM_VAL_ANAKIND_MONDAY20,
          name: ' 【全マーケット】品種別実績_顧客・新規別',
        },
      ];
      clutil.initcltypeselector2(
        $('#output_target'),
        this.outputTargetList,
        0,
        1,
        'id',
        'name',
        '',
        {
          id: 'output_target',
        },
        'mbn wt280 flleft'
      );
      // 対象週
      var yw = clutil.clweekselector(
        $('#ym_year'),
        $('#ym_week_div'),
        {
          id: 'ym_week',
        },
        'flleft wt180 mrgl10 cl_valid',
        clcom.getPeriodList()
      );
      // 対象日
      var opeDate = clcom.getOpeDate();
      clutil.datepicker($('#from_ymd'), null, opeDate);
      clutil.datepicker($('#to_ymd'), null, opeDate);
      // 初期値
      clutil.data2view($('#ca_main'), {
        from_ymd: 0,
        to_ymd: 0,
        ym_week: yw.ope_w,
      });
    },

    // [帳票出力]押下時の処理
    onclickOutputButton: function (e) {
      if (!this.validate()) {
        return;
      }
      var deferd = clutil.postAnaJSON(clcom.pageId, this.getReq());
      deferd.done(
        _.bind(function (data) {
          if (_.isEmpty(data.url)) {
            this.validator.setErrorInfo({
              _eb_: clmsg.cl_no_data,
            });
          } else {
            clutil.download(data.url);
          }
        }, this)
      );
      deferd.fail(
        _.bind(function (data) {
          if (
            _.isObject(data.head) &&
            _.isNumber(data.head.status) &&
            data.head.status !== am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK
          ) {
            this.validator.setErrorInfo({
              _eb_: clutil.fmtargs(
                clutil.getclmsg(data.head.message),
                data.head.args
              ),
            });
          }
        }, this)
      );
    },

    // 入力チェック
    validate: function () {
      this.validator.clear();
      var isValid = true;
      if (!this.validator.valid()) {
        isValid = false;
        return isValid;
      }
      if (
        !this.validator.validFromToObj([
          {
            $stval: $('#from_ymd'),
            $edval: $('#to_ymd'),
          },
        ])
      ) {
        isValid = false;
      }
      return isValid;
    },

    // リクエスト getter
    getReq: function () {
      var viewData = clutil.view2data($('#ca_main'));
      var ym = Number(viewData.ym_year + ('00' + viewData.ym_week).slice(-2));
      return {
        anaHead: {
          anakind: Number(viewData.output_target),
        },
        anaPeriod: [
          {
            type: amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YW,
            p_from: ym,
            p_to: ym,
          },
          {
            type: amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YMD,
            p_from: Number(viewData.from_ymd),
            p_to: Number(viewData.to_ymd),
          },
        ],
      };
    },
  });
  mainView = new MainView();
  mainView.render();
  clutil
    .getIniJSON(
      null,
      null,
      _.bind(function (data, dataType) {
        headerView = new HeaderView();
        headerView.render(function () {
          mainView.initUIelement();
        });
      }, this)
    )
    .done(function () {});
});
