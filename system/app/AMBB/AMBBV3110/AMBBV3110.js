useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3110 = Backbone.View.extend({
    el: $('#container'),
    events: {
      'click #search': 'onclickSearch', // [検索]ボタン押下
      'click #searchAgain': 'onclickSearchAgain', // [検索条件を再指定]ボタン押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        title: '納品書出力',
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

      this.searchArea = clutil.controlSrchArea(
        this.$('#cond'),
        this.$('#search'),
        this.$('#result'),
        this.$('#searchAgain')
      );

      clutil.datepicker(this.$('#発行日from'));
      clutil.datepicker(this.$('#発行日to'));
      clutil.datepicker(this.$('#納品日from'));
      clutil.datepicker(this.$('#納品日to'));
      clutil.cltypeselector3({
        $select: this.$('#発行状態'),
        list: [
          { id: 1, code: '01', name: '未発行' },
          { id: 2, code: '02', name: '一部発行済' },
          { id: 3, code: '03', name: '発行済' },
        ],
      });

      clutil.mediator.on('onPageChanged', (groupid, reqPage) => {
        if (!this.request) {
          return;
        }
        return this.search(_.defaults({ reqPage: reqPage }, this.request));
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
          { $stval: this.$('#発行日from'), $edval: this.$('#発行日to') },
          { $stval: this.$('#納品日from'), $edval: this.$('#納品日to') },
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
            AMBBV3110GetRsp: {
              list: _.times(10, (index) => {
                index += 1;
                return {};
              }),
            },
          };
        })
        .then((response) => {
          const list = response.AMBBV3110GetRsp.list;
          if (!list.length) {
            this.baseView.validator.setErrorHeader(clmsg.cl_no_data);
            return;
          }
          let $headerTemplate = null;
          let $rowTemplate = null;
          switch (request.AMBBV3110GetReq.format) {
            case 1:
              $headerTemplate = this.$('#headerTemplate1');
              $rowTemplate = this.$('#rowTemplate1');
              break;
            case 2:
              $headerTemplate = this.$('#headerTemplate2');
              $rowTemplate = this.$('#rowTemplate2');
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
        AMBBV3110GetReq: this.view2data(),
      });
    },

    // [検索条件を再指定]ボタン押下時の処理
    onclickSearchAgain: function () {
      this.searchArea.show_srch();
    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new AMBBV3110();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
