useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3010 = Backbone.View.extend({
    el: $('#ca_main'),
    events: {
      'click #search': 'onSearchClick', // [検索]ボタン押下
      'click #searchAgain': 'onSearchAgainClick', // [検索条件を再指定]ボタン押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({ title: '法人' })
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

      _.each(
        [this.$('#締日1'), this.$('#締日2'), this.$('#締日3')],
        ($select) => {
          clutil.cltypeselector3({
            $select: $select,
            list: [
              { id: 0, code: '00', name: '都度' },
              { id: 15, code: '15', name: '15日' },
              { id: 20, code: '20', name: '20日' },
              { id: 25, code: '25', name: '25日' },
              { id: 99, code: '99', name: '末日' },
            ],
            unselectedflag: true,
          });
        }
      );

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
          })('AMBBV3020'),
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

      if (clcom.pageData) {
      }
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return { 表示形式: Number(data.表示形式) };
    },

    data2view: function (data) {
      clutil.data2view(this.$el, JSON.parse(JSON.stringify(data)), null, true);
    },

    validate: function () {
      const validator = this.baseView.validator;
      if (!validator.valid()) {
        validator.setErrorHeader(clmsg.cl_echoback);
        return false;
      }
      return true;
    },

    search: function (request) {
      const validator = this.baseView.validator;
      return clutil.postJSON(clcom.pageId, request).then(
        (response) => {
          const list = response.AMBBV3010GetRsp.list;
          if (!list.length) {
            validator.setErrorHeader(clmsg.cl_no_data);
            return;
          }
          let $headerTemplate = null;
          let $rowTemplate = null;
          switch (request.AMBBV3010GetReq.表示形式) {
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
          (this.listView = new clutil.View.RowSelectListView({
            el: this.$('#table')
              .find('thead')
              .html($headerTemplate.html())
              .end(),
            groupid: clcom.pageId,
            template: _.template($rowTemplate.html()),
          })
            .initUIElement()
            .render()).setRecs(response.AMBBV3010GetRsp.list);
          this.searchArea.show_result();
          _.extend(this, { request: request, response: response });
        },
        (response) => {
          const rspHead = response.rspHead;
          validator.setErrorHeader(
            clutil.fmtargs(clutil.getclmsg(rspHead.message), rspHead.args)
          );
        }
      );
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
          AMBBV3010GetRsp: {
            list: _.times(10, (index) => {
              return { index: (index += 1) };
            }),
          },
        };
        let $headerTemplate = null;
        let $rowTemplate = null;
        switch (request.AMBBV3010GetReq.表示形式) {
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
        (this.listView = new clutil.View.RowSelectListView({
          el: this.$('#table').find('thead').html($headerTemplate.html()).end(),
          groupid: clcom.pageId,
          template: _.template($rowTemplate.html()),
        })
          .initUIElement()
          .render()).setRecs(response.AMBBV3010GetRsp.list);
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
        AMBBV3010GetReq: this.view2data(),
      });
    },

    // [検索条件を再指定]ボタン押下時の処理
    onSearchAgainClick: function () {
      this.searchArea.show_srch();
    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new AMBBV3010();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
