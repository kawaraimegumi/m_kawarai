$(function () {
  BBprojitemView = Backbone.View.extend({
    events: {
      'click #search': 'onclickSearch', // [検索]ボタン押下
      'click #searchAgain': 'onclickSearchAgain', // [検索条件を再指定]ボタン押下
      'click #cancel': 'onclickCancel', // [キャンセル]押下
      'click #commit': 'onclickCommit', // [確定]押下
    },

    initialize: function (options) {
      clutil.loadHtml(
        ((code) => {
          return [
            clcom.appRoot,
            code.slice(0, 4),
            code,
            'bbprojitem.html',
          ].join('/');
        })(clcom.pageId),
        (html) => {
          _.defaults(_.extend(this, options), {
            validator: clutil.validator(this.$el, {
              echoback: $('.cl_echoback'),
            }),
            html: html,
          });
        }
      );
    },

    show: function () {
      this.$el.nextAll().hide().end().html(this.html);

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

      clutil.cltypeselector3({
        $select: this.$('#仕入形態'),
        list: [
          { id: 1, code: '01', name: '青山' },
          { id: 2, code: '02', name: '台湾' },
          { id: 3, code: '03', name: '中国' },
          { id: 4, code: '04', name: 'プレミアム' },
          { id: 5, code: '05', name: 'ＷＷＳ' },
          { id: 6, code: '06', name: '制服' },
          { id: 7, code: '07', name: 'ＮＢ' },
          { id: 8, code: '08', name: 'ＭＯＲＬＥＳ' },
        ],
      });
      clutil.datepicker(this.$('#商談日from'));
      clutil.datepicker(this.$('#商談日to'));

      clutil.mediator.on('onPageChanged', (groupid, reqPage) => {
        if (!this.request) {
          return;
        }
        return this.search(_.defaults({ reqPage: reqPage }, this.request));
      });
    },

    hide: function () {
      this.$el.nextAll().show().end().html('');
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
          this.validator.setErrorHeader(
            clutil.fmtargs(clutil.getclmsg(rspHead.message), rspHead.args)
          );
        }
      );
    },

    validate: function () {
      const validator = this.validator;
      if (
        !validator.valid() ||
        !validator.validFromToObj([
          { $stval: this.$('#商談日from'), $edval: this.$('#商談日to') },
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
            list: _.times(10, (index) => {
              index += 1;
              return {};
            }),
          };
        })
        .then((response) => {
          const list = response.list;
          if (!list.length) {
            this.validator.setErrorHeader(clmsg.cl_no_data);
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

    // [検索]押下時の処理
    onclickSearch: function () {
      if (!this.validate()) {
        return;
      }
      return this.search({
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
        reqPage: _.first(this.paginationViews).buildReqPage0(),
      });
    },

    // [検索条件を再指定]ボタン押下時の処理
    onclickSearchAgain: function () {
      this.searchArea.show_srch();
    },

    // [キャンセル]押下時の処理
    onclickCancel: function () {
      this.hide();
    },

    // [確定]押下時の処理
    onclickCommit: function () {
      if (!this.validate()) {
        return;
      }
      this.hide();
    },
  });
});
