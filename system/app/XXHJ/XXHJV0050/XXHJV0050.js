useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const XXHJV0050 = Backbone.View.extend({
    el: $('#ca_main'),
    events: {
      'click #search': 'onSearchClick', // [検索]ボタン押下
      'click #searchAgain': 'onSearchAgainClick', // [検索条件を再指定]ボタン押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        category: '法人販売管理',
        title: '受注',
      })
        .initUIElement()
        .render();

      clutil.datepicker(this.$('#契約期間from'));
      clutil.datepicker(this.$('#契約期間to'));
      clutil.datepicker(this.$('#受注日from'));
      clutil.datepicker(this.$('#受注日to'));
      clutil.datepicker(this.$('#希望納期from'));
      clutil.datepicker(this.$('#希望納期to'));

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
          url: clcom.appRoot + '/XXHJ/XXHJV0060/XXHJV0060.html',
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
        XXHJV0050GetReq: null,
      });
    },

    // [検索条件を再指定]ボタン押下時の処理
    onSearchAgainClick: function () {
      this.searchArea.show_srch();
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
      const validator = this.baseView.validator;
      _.extend(this, { request: null, response: null });
      return clutil.postJSON(clcom.pageId, request).then(
        (response) => {
          const list = response.XXHJV0050GetRsp.list;
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
          XXHJV0050GetRsp: {
            list: _.times(10, (index) => {
              index += 1;
              return {
                hojin: {
                  code: ('00000' + String(index)).slice(-5),
                  name: '法人' + String(index),
                },
                anken: {
                  code: ('0000000' + String(index)).slice(-7),
                  name: '案件' + String(index),
                },
                juchu: {
                  code: ('0000000' + String(index)).slice(-7),
                  date: clcom.getOpeDate(),
                  end: index % 2,
                  riyu: index % 2 ? '受注強制完了理由' + String(index) : '',
                  ew: Number(!(index % 2)),
                  noki: clcom.getOpeDate(),
                  status: { name: '受注済' },
                  pattern: { name: '法人売／法人請求' },
                  tanto: { name: '受注担当者' + String(index) },
                  su: index,
                  uriage: 1000 * index,
                  genka: 700 * index,
                  arari: 300 * index,
                  biko: '受注備考' + String(index),
                },
              };
            }),
          },
        };
        this.searchArea.show_result();
        this.listView.setRecs(response.XXHJV0050GetRsp.list);
        _.extend(this, { request: request, response: response });
        clutil.mediator.trigger('onRspPage', clcom.pageId, response.rspPage);
        clutil.unblockUI();
      });
    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new XXHJV0050();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
