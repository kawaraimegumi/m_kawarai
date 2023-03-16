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
      'click #download_button': 'onclickDownloadButton', // [Excelデータ出力]押下
      'click #sample_download_button': 'onclickSampleDownloadButton', // [Excelサンプルダウンロード]押下
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
      // 対象チラシ折込日
      clutil.datepicker($('#srch_ymd'));
      // Excelデータアップロード
      this.opeCSVInputCtrl = clutil.view.OpeCSVInputController({
        btn: $('#upload_button'),
        buildCSVInputReqFunction: this.buildCSVInputReqFunction,
        fileUploadViewOpts: {
          beforeShowFileChooser: this.validator.valid,
        },
      });
      this.opeCSVInputCtrl.on(
        'fail',
        _.bind(function (data) {
          if (data.head.message) {
            this.validator.setErrorInfoFromSrv(data.head.message);
          }
          if (data.head.uri) {
            clutil.download(data.head.uri);
          }
        }, this)
      );
    },

    buildCSVInputReqFunction: function () {
      return {
        resId: clcom.pageId,
        data: {
          AMGAV2040UpdReq: this.getReq(),
        },
      };
    },

    // [Excelデータ出力]押下時の処理
    onclickDownloadButton: function (e) {
      if (!this.validate()) {
        return;
      }
      clutil
        .postJSON(clcom.pageId, {
          reqHead: {
            opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV,
          },
          AMGAV2040GetReq: this.getReq(),
        })
        .done(
          _.bind(function (data) {
            if (_.isEmpty(data.head) || _.isEmpty(data.head.uri)) {
              this.validator.setErrorInfo({
                _eb_: clmsg.cl_no_data,
              });
            } else {
              clutil.download(data.head.uri);
            }
          }, this)
        )
        .fail(
          _.bind(function (data) {
            if (_.isEmpty(data.head) || _.isEmpty(data.head.uri)) {
              this.validator.setErrorInfo({
                _eb_: clmsg.cl_no_data,
              });
            } else if (
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
      return isValid;
    },

    // リクエスト getter
    getReq: function () {
      var viewData = clutil.view2data($('#ca_main'));
      return {
        srchYmd: viewData.srch_ymd,
      };
    },

    // [Excelサンプルダウンロード]押下時の処理
    onclickSampleDownloadButton: function (e) {
      clutil.download('/public/sample/セールスマスタサンプル.xlsx');
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
