useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const XXHJV0010 = Backbone.View.extend({
    el: $('#ca_main'),
    events: {
      'click #search': 'onSearchClick', // [検索]ボタン押下
      'click #searchAgain': 'onSearchAgainClick', // [検索条件を再指定]ボタン押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        category: '法人販売管理',
        title: '法人',
      })
        .initUIElement()
        .render();

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

      this.searchArea = clutil.controlSrchArea(
        this.$('#cond'),
        this.$('#search'),
        this.$('#result'),
        this.$('#searchAgain')
      );

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
        template: _.template(this.$('#template').html()),
      })
        .initUIElement()
        .render();

      clutil.mediator.on('onPageChanged', (groupid, reqPage) => {
        if (!this.request) {
          return;
        }
        return this.search(_.defaults({ reqPage: reqPage }, this.request));
      });

      clutil.mediator.on('onOperation', (opeTypeId) => {
        const options = {
          url: clcom.appRoot + '/XXHJ/XXHJV0020/XXHJV0020.html',
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

    // [検索]ボタン押下時の処理
    onSearchClick: function () {
      if (!this.validate()) {
        return;
      }
      return this.search({
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
        reqPage: _.first(this.paginationViews).buildReqPage0(),
        XXHJV0010GetReq: null,
      });
    },

    // [検索条件を再指定]ボタン押下時の処理
    onSearchAgainClick: function () {
      this.searchArea.show_srch();
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
      _.extend(this, { request: null, response: null });
      return clutil.postJSON(clcom.pageId, request).then(
        (response) => {
          const list = response.XXHJV0010GetRsp.list;
          if (!list.length) {
            validator.setErrorHeader(clmsg.cl_no_data);
            return;
          }
          this.searchArea.show_result();
          this.listView.setRecs(list);
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
      _.extend(this, { request: null, response: null });
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
          XXHJV0010GetRsp: {
            list: _.times(10, (index) => {
              index += 1;
              return {
                code: ('00000' + String(index)).slice(-5),
                name: '法人' + String(index),
              };
            }),
          },
        };
        this.searchArea.show_result();
        this.listView.setRecs(response.XXHJV0010GetRsp.list);
        _.extend(this, { request: request, response: response });
        clutil.mediator.trigger('onRspPage', clcom.pageId, response.rspPage);
        clutil.unblockUI();
      });
    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new XXHJV0010();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
