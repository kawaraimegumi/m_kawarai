useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const XXHJV0160 = Backbone.View.extend({
    el: $('#ca_main'),
    events: {
      'click #search': 'onSearchClick', // [検索]ボタン押下
      'click #searchAgain': 'onSearchAgainClick', // [検索条件を再指定]ボタン押下
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
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return {};
    },

    data2view: function (data) {
      clutil.data2view(this.$el, JSON.parse(JSON.stringify(data)), null, true);
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

    // モック用
    search: function (request) {
      clutil.blockUI();
      return Promise.resolve().then(() => {
        const response = {
          rspHead: {
            status: 0,
            message: '',
            args: [],
            exmessage: '',
            fieldMessages: [],
            ope_iymd: clcom.getOpeDate(),
            uri: '',
            recno: '',
            state: 0,
          },
          rspPage: {
            curr_record: 0,
            total_record: 10,
            page_record: 10,
            page_size: 10,
            page_num: 1,
          },
          XXHJV0160GetRsp: {
            list: _.times(10, (index) => {
              return { index: (index += 1) };
            }),
          },
        };
        this.listView.setRecs(response.XXHJV0160GetRsp.list);
        this.searchArea.show_result();
        _.extend(this, { request: request, response: response });
        clutil.mediator.trigger('onRspPage', clcom.pageId, response.rspPage);
        clutil.unblockUI();
      });
    },

    // [検索]ボタン押下時の処理
    onSearchClick: function () {
      if (!this.validate()) {
        return;
      }
      return this.search({
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
        reqPage: _.first(this.paginationViews).buildReqPage0(),
        XXHJV0160GetReq: this.view2data(),
      });
    },

    // [検索条件を再指定]ボタン押下時の処理
    onSearchAgainClick: function () {
      this.searchArea.show_srch();
    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new XXHJV0160();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
