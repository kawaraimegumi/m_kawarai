useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3040 = Backbone.View.extend({
    el: $('#container'),
    events: {
      'click #search': 'onclickSearch', // [検索]ボタン押下
      'click #bbprojitem': 'onclickBBprojitem',
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        opeTypeId: clcom.pageArgs.opeTypeId,
        title: '案件',
      })
        .initUIElement()
        .render();

      clutil.datepicker(this.$('#契約期間from'));
      clutil.datepicker(this.$('#契約期間to'));
      clutil.cltypeselector3({
        $select: this.$('#センター在庫'),
        list: [
          { id: 978, code: '0978', name: '井原商品センター法人部' },
          { id: 9999, code: '9999', name: 'テストセンター' },
        ],
      });

      this.bbprojitemView = new BBprojitemView({ el: '#bbprojitemContainer' });
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
            AMBBV3040GetRsp: {
              list: _.times(10, (index) => {
                index += 1;
                return {};
              }),
            },
          };
        })
        .then((response) => {
          const list = response.AMBBV3040GetRsp.list;
          if (!list.length) {
            this.baseView.validator.setErrorHeader(clmsg.cl_no_data);
            return;
          }
          let $headerTemplate = null;
          let $rowTemplate = null;
          switch (request.AMBBV3040GetReq.format) {
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
        AMBBV3040GetReq: this.view2data(),
      });
    },

    onclickBBprojitem: function () {
      this.bbprojitemView.show();
    },
  });
  return clutil.getIniJSON().then(
    (response) => {
      mainView = new AMBBV3040();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});