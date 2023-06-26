useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3070 = Backbone.View.extend({
    el: $('#container'),
    events: {
      'click #search': 'onclickSearch', // [検索]ボタン押下
      'click #excel': 'onclickExcel', // [Excel出力]ボタン押下
      'click #searchAgain': 'onclickSearchAgain', // [検索条件を再指定]ボタン押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        btn_new: false,
        title: '受注進捗',
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

      clutil.cltypeselector3({
        $select: this.$('#締日'),
        list: [
          { id: -1, code: '00', name: '都度' },
          { id: 15, code: '15', name: '15日' },
          { id: 20, code: '20', name: '20日' },
          { id: 25, code: '25', name: '25日' },
          { id: 99, code: '99', name: '末日' },
        ],
      });
      clutil.datepicker(this.$('#受注日from'));
      clutil.datepicker(this.$('#受注日to'));
      clutil.cltypeselector3({
        $select: this.$('#売上パターン'),
        list: [
          { id: 1, code: '1', name: '法人売／法人請求' },
          { id: 2, code: '2', name: '店売／法人請求' },
          { id: 3, code: '3', name: '店売／店請求' },
        ],
      });
      _([this.$('#受注ステータスfrom'), this.$('#受注ステータスto')]).each(
        ($select) => {
          clutil.cltypeselector3({
            $select: $select,
            list: [
              { id: 1, code: '01', name: '受注済' },
              { id: 2, code: '02', name: '出荷指示済（受注残あり）' },
              { id: 3, code: '03', name: '出荷指示済' },
              { id: 4, code: '04', name: '一部出荷済' },
              { id: 5, code: '05', name: '出荷済' },
              { id: 6, code: '06', name: '一部仕入済' },
              { id: 7, code: '07', name: '仕入済' },
              { id: 8, code: '08', name: '一部売上済' },
              { id: 9, code: '09', name: '売上済' },
              { id: 10, code: '10', name: '一部請求済' },
              { id: 11, code: '11', name: '請求済' },
              { id: 12, code: '12', name: '一部訂正請求済' },
              { id: 13, code: '13', name: '訂正請求済' },
            ],
            unselectedflag: true,
          });
        }
      );

      this.detailView = new DetailView({ el: '#detailContainer' });

      clutil.mediator.on('onPageChanged', (groupid, reqPage) => {
        if (!this.request) {
          return;
        }
        return this.search(_.defaults({ reqPage: reqPage }, this.request));
      });

      clutil.mediator.on('onOperation', () => {
        this.detailView.show();
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
          { $stval: this.$('#受注日from'), $edval: this.$('#受注日to') },
          {
            $stval: this.$('#受注ステータスfrom'),
            $edval: this.$('#受注ステータスto'),
          },
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
            AMBBV3070GetRsp: {
              list: _.times(10, (index) => {
                index += 1;
                return {};
              }),
            },
          };
        })
        .then((response) => {
          const list = response.AMBBV3070GetRsp.list;
          if (!list.length) {
            this.baseView.validator.setErrorHeader(clmsg.cl_no_data);
            return;
          }
          let $headerTemplate = null;
          let $rowTemplate = null;
          switch (request.AMBBV3070GetReq.format) {
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
        AMBBV3070GetReq: this.view2data(),
      });
    },

    // [Excel出力]ボタン押下時の処理
    onclickExcel: function () {
      return this.postJSON({
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV },
        AMBBV3070GetReq: this.view2data(),
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
      mainView = new AMBBV3070();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
