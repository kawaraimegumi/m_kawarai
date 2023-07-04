useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const MainView = Backbone.View.extend({
    el: $('#container'),
    events: {
      'click #search': 'onclickSearch', // [検索]押下
      'click #searchAgain': 'onclickSearchAgain', // [検索条件を再指定]押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({ title: '〇〇' }) // ★
        .initUIElement()
        .render();

      this.validator = this.baseView.validator;

      // ★

      this.paginationViews = _(
        clutil.View.buildPaginationView(this.cid, this.$el)
      ).map((paginationView) => {
        return paginationView.render();
      });

      const $list = this.$('#list');
      this.listView = new clutil.View.RowSelectListView({
        el: $list,
        template: _.template($list.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      this.controlSrchArea = clutil.controlSrchArea(
        this.$('#cond'),
        this.$('#search'),
        this.$('#result'),
        this.$('#searchAgain')
      );

      clutil.mediator
        .on('onPageChanged', (groupid, reqPage) => {
          if (groupid != this.cid) {
            return;
          }
          return this.search(_.defaults({ reqPage: reqPage }, this.request));
        })
        .on('onOperation', (opeTypeId) => {
          const recs = this.listView.getSelectedRecs();
          clcom.pushPage({
            url: ((code) => {
              return [
                clcom.appRoot,
                code.slice(0, 4),
                code,
                code + '.html',
              ].join('/');
            })('XXXXV9999'), // ★
            args: { opeTypeId: opeTypeId, recs: recs },
            saved: { request: this.request, recs: recs },
            newWindow: opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
          });
        });

      if (clcom.pageData) {
        const pageData = clcom.pageData;
        const request = pageData.request;
        clutil.data2view(this.$el, request.getReq);
        return this.search(request).then(() => {
          this.listView.setSelectRecs(pageData.recs, true);
        });
      }
    },

    search: function (request) {
      Promise.resolve()
        .then((response) => {
          clutil.blockUI();
          return {
            getRsp: {
              // ★
              list: _(10).times((index) => {
                index += 1;
                return {
                  id: index,
                  code: ('0000000000' + index).slice(-5),
                  name: '名称' + index,
                };
              }),
            },
          };
        })
        .then((response) => {
          const list = response.getRsp.list;
          if (!list.length) {
            this.validator.setErrorHeader(clmsg.cl_no_data);
            return;
          }
          _.extend(this, { request: request, response: response });
          this.listView.setRecs(list);
          this.controlSrchArea.show_result();
        })
        .then(() => {
          clutil.unblockUI();
        });
    },

    // [検索]押下時の処理
    onclickSearch: function () {
      if (!this.validator.valid()) {
        this.validator.setErrorHeader(clmsg.cl_echoback);
        return;
      }
      return this.search({
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
        reqPage: _(this.paginationViews).first().buildReqPage0(),
        getReq: clutil.view2data(this.$el),
      });
    },

    // [検索条件を再指定]押下時の処理
    onclickSearchAgain: function () {
      this.controlSrchArea.show_srch();
    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new MainView();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
