useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3120 = Backbone.View.extend({
    el: $('#ca_main'),
    events: {
      'click #search': 'onclickSearch', // [検索]ボタン押下
      'click #excel': 'onclickExcel', // [Excel出力]ボタン押下
      'click #searchAgain': 'onclickSearchAgain', // [検索条件を再指定]ボタン押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        btn_new: false,
        title: '直納分仕入',
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

      this.searchArea = clutil.controlSrchArea(
        this.$('#cond'),
        this.$('#search'),
        this.$('#result'),
        this.$('#searchAgain')
      );

      clutil.datepicker(this.$('#契約期間from'));
      clutil.datepicker(this.$('#契約期間to'));
      clutil.datepicker(this.$('#受注日from'));
      clutil.datepicker(this.$('#受注日to'));
      clutil.datepicker(this.$('#希望納期from'));
      clutil.datepicker(this.$('#希望納期to'));

      clutil.mediator.on('onPageChanged', (groupid, reqPage) => {
        if (!this.request) {
          return;
        }
        return this.search(_.defaults({ reqPage: reqPage }, this.request));
      });

      clutil.mediator.on('onOperation', (opeTypeId) => {
        const options = {
          url: ((code) => {
            return [clcom.appRoot, code.slice(0, 4), code, code + '.html'].join(
              '/'
            );
          })('AMBBV3130'),
          args: { opeTypeId: opeTypeId },
          saved: null,
          newWindow: false,
        };
        switch (opeTypeId) {
          case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
          case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
          case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
            break;
          case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
            _.extend(options, { newWindow: true });
            break;
          default:
            return;
        }
        clcom.pushPage(options);
      });
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return { format: Number(data.format) };
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
          { $stval: this.$('#契約期間from'), $edval: this.$('#契約期間to') },
          { $stval: this.$('#受注日from'), $edval: this.$('#受注日to') },
          { $stval: this.$('#希望納期from'), $edval: this.$('#希望納期to') },
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
            AMBBV3120GetRsp: {
              list: _.times(10, (index) => {
                index += 1;
                return {};
              }),
            },
          };
        })
        .then((response) => {
          const list = response.AMBBV3120GetRsp.list;
          if (!list.length) {
            this.baseView.validator.setErrorHeader(clmsg.cl_no_data);
            return;
          }
          let $headerTemplate = null;
          let $rowTemplate = null;
          switch (request.AMBBV3120GetReq.format) {
            case 1:
              $headerTemplate = this.$('#headerTemplate1');
              $rowTemplate = this.$('#rowTemplate1');
              break;
            case 2:
              $headerTemplate = this.$('#headerTemplate2');
              $rowTemplate = this.$('#rowTemplate2');
              break;
            case 3:
              $headerTemplate = this.$('#headerTemplate3');
              $rowTemplate = this.$('#rowTemplate3');
              break;

            default:
              return;
          }
          _.extend(this, {
            listView: new clutil.View.RowSelectListView({
              el: this.$('#table')
                .find('thead')
                .html($headerTemplate.html())
                .end(),
              template: _.template($rowTemplate.html()),
              groupid: clcom.pageId,
            })
              .initUIElement()
              .render(),
            request: request,
            response: response,
          });
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
        AMBBV3120GetReq: this.view2data(),
      });
    },

    // [Excel出力]ボタン押下時の処理
    onclickExcel: function () {
      return this.postJSON({
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV },
        AMBBV3120GetReq: this.view2data(),
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
      mainView = new AMBBV3120();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
