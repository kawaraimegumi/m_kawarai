useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3160 = Backbone.View.extend({
    el: $('#ca_main'),
    events: {
      'click #search': 'onclickSearch', // [検索]ボタン押下
      'click #excel': 'onclickExcel', // [Excel出力]ボタン押下
      'click #searchAgain': 'onclickSearchAgain', // [検索条件を再指定]ボタン押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        btn_new: false,
        title: '売上照会',
        subtitle: '',
      })
        .initUIElement()
        .render();

      this.paginationViews = clutil.View.buildPaginationView(
        clcom.pageId,
        this.$el
      );
      _.each(this.paginationViews, (paginationView) => {
        paginationView.render();
      });

      this.listView = new clutil.View.RowSelectListView({
        el: this.$('#table'),
        groupid: clcom.pageId,
        template: _.template(this.$('#rowTemplate').html()),
      })
        .initUIElement()
        .render();

      this.searchArea = clutil.controlSrchArea(
        this.$('#cond'),
        this.$('#search'),
        this.$('#result'),
        this.$('#searchAgain')
      );

      clutil.datepicker(this.$('#売上年月from'));
      clutil.datepicker(this.$('#売上年月to'));

      clutil.mediator.on('onPageChanged', (groupid, reqPage) => {
        if (!this.request) {
          return;
        }
        return this.search(_.defaults({ reqPage: reqPage }, this.request));
      });

      this.data2view({
        売上年月from: ((date) => {
          date.setMonth(date.getMonth() - 2);
          return clutil.dateFormat(date, 'yyyymmdd');
        })(clutil.ymd2date(clcom.getOpeDate())),
        売上年月to: clcom.getOpeDate(),
      });
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return {};
    },

    data2view: function (data) {
      clutil.data2view(this.$el, JSON.parse(JSON.stringify(data)), null, true);
    },

    postJSON: function (request, id = clcom.pageId) {
      return clutil.postJSON(id, request).then(
        (response) => {
          return response;
        },
        (response) => {
          const rspHead = response.rspHead;
          this.baseView.validator.setErrorHeader(
            clutil.fmtargs(clutil.getclmsg(rspHead.message), rspHead.args)
          );
        }
      );
    },

    validate: function () {
      const validator = this.baseView.validator;
      if (
        !validator.valid() ||
        !validator.validFromToObj([
          { $stval: this.$('#売上年月from'), $edval: this.$('#売上年月to') },
        ])
      ) {
        validator.setErrorHeader(clmsg.cl_echoback);
        return false;
      }
      return true;
    },

    search: function (request) {
      // return this.postJSON(request)
      return Promise.resolve() // モック用
        .then(() => {
          // モック用
          clutil.blockUI();
          return {
            rspPage: {
              curr_record: 0,
              total_record: 10,
              page_record: 10,
              page_size: 10,
              page_num: 1,
            },
            AMBBV3160GetRsp: {
              list: _.times(10, (index) => {
                index += 1;
                return {};
              }),
            },
          };
        })
        .then((response) => {
          const list = response.AMBBV3160GetRsp.list;
          if (!list.length) {
            this.baseView.validator.setErrorHeader(clmsg.cl_no_data);
            return;
          }
          _.extend(this, { request: request, response: response });
          this.listView.setRecs(list);
          this.searchArea.show_result();

          return response; // モック用
        })
        .then((response) => {
          // モック用
          clutil.mediator.trigger('onRspPage', clcom.pageId, response.rspPage);
          clutil.unblockUI();
        });
    },

    // [検索]ボタン押下時の処理
    onclickSearch: function () {
      if (!this.validate()) {
        return;
      }
      return this.search({
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
        reqPage: _.first(this.paginationViews).buildReqPage0(),
        AMBBV3160GetReq: this.view2data(),
      });
    },

    // [Excel出力]ボタン押下時の処理
    onclickExcel: function () {
      return this.postJSON({
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV },
        AMBBV3160GetReq: this.view2data(),
      }).then((response) => {
        // clutil.download();
      });
    },

    // [検索条件を再指定]ボタン押下時の処理
    onclickSearchAgain: function () {
      this.searchArea.show_srch();
    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new AMBBV3160();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
