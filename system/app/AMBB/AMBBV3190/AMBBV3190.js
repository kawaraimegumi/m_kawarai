useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3190 = Backbone.View.extend({
    el: $('#container'),
    events: {
      'click #search': 'onclickSearch', // [検索]押下
      'click #excel': 'onclickExcel', // [Excel出力]押下
      'click #searchAgain': 'onclickSearchAgain', // [検索条件を再指定]押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        btn_new: false,
        title: '売掛金',
      })
        .initUIElement()
        .render();

      this.validator = this.baseView.validator;

      this.bbcust = new BBcustView({ el: '#bbcust' });
      this.bbcustbill = new BBcustbillView({ el: '#bbcustbill' });
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
      _([this.$('#請求年from'), this.$('#請求年to')]).each(($select) => {
        clutil.cltypeselector3({
          $select: $select,
          list: _(10).times((index) => {
            const year = bbutil.ymd2y(clcom.getOpeDate()) - index;
            return { id: year, name: year + '年' };
          }),
        });
      });
      _([this.$('#請求月from'), this.$('#請求月to')]).each(($select) => {
        clutil.cltypeselector3({
          $select: $select,
          list: _(12).times((index) => {
            const month = index + 1;
            return { id: month, name: month + '月' };
          }),
        });
      });

      this.paginationViews = _(
        clutil.View.buildPaginationView(this.cid, this.$el)
      ).map((paginationView) => {
        return paginationView.render();
      });

      this.rowSelectListView = new clutil.View.RowSelectListView({
        el: this.$('#table'),
        template: _.template(this.$('#rowTemplate').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      this.detail = new DetailView();

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
        .on('onRowSelectChanged', (groupid, arg) => {
          if (groupid != this.cid) {
            return;
          }
          if (!arg.selectedRecsCount || arg.selectedRecsCount > 1) {
            clutil.inputReadonly(this.$('#AMBBV3210'), true);
            return;
          }
        })
        .on('onOperation', (opeTypeId) => {
          this.detail.show();
        });

      const opeDate = clcom.getOpeDate();
      this.data2view({
        請求年from: bbutil.ymd2y(bbutil.computeDate(opeDate, 0, -2, 0)),
        請求月from: bbutil.ymd2m(bbutil.computeDate(opeDate, 0, -2, 0)),
        請求年to: bbutil.ymd2y(opeDate),
        請求月to: bbutil.ymd2m(opeDate),
      });

      if (clcom.pageData) {
        const pageData = clcom.pageData;
        const request = pageData.request;
        this.data2view(request.getReq);
        return this.search(request).then(() => {
          this.rowSelectListView.setSelectRecs(pageData.recs, true, [
            'bbcustId',
            'bbcustbillId',
          ]);
        });
      }
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return {
        請求年from: Number(data.請求年from),
        請求月from: Number(data.請求月from),
        請求年to: Number(data.請求年to),
        請求月to: Number(data.請求月to),
      };
    },

    data2view: function (data) {
      clutil.data2view(this.$el, JSON.parse(JSON.stringify(data)), null, true);
    },

    postJSON: function (request, id = clcom.pageId) {
      // return clutil.postJSON(id, request).then(
      //   (response) => {
      //     return response;
      //   },
      //   (response) => {
      //     const rspHead = response.rspHead;
      //     this.validator.setErrorHeader(
      //       clutil.fmtargs(clutil.getclmsg(rspHead.message), rspHead.args)
      //     );
      //   }
      // );

      // モック用
      return Promise.resolve().then(() => {
        clutil.blockUI();
        return {
          rspPage: {
            curr_record: 0,
            total_record: 10,
            page_record: 10,
            page_size: 10,
            page_num: 1,
          },
          getRsp: {
            list: _(10).times((index) => {
              index += 1;
              return {
                bbcustId: index,
                bbcustCode: ('0000000000' + index).slice(-5),
                bbcustName: '法人' + index,
                bbcustbillId: index,
                bbcustbillCode: ('0000000000' + index).slice(-2),
                bbcustbillName: '請求先' + index,
              };
            }),
          },
        };
      });
    },

    validate: function () {
      const validator = this.validator;
      const data = this.view2data();
      if (
        !_([
          validator.valid(),
          validator.validFromTo([
            data.請求年from != data.請求年to
              ? { stval: '請求年from', edval: '請求年to' }
              : { stval: '請求月from', edval: '請求月to' },
          ]),
        ]).reduce((memo, valid) => {
          return valid && memo;
        }, true)
      ) {
        validator.setErrorHeader(clmsg.cl_echoback);
        return false;
      }
      return true;
    },

    search: function (request) {
      return (
        this.postJSON(request)
          .then((response) => {
            const list = response.getRsp.list;
            if (!list.length) {
              this.validator.setErrorHeader(clmsg.cl_no_data);
              return;
            }
            _.extend(this, { request: request, response: response });
            this.rowSelectListView.setRecs(list);
            this.controlSrchArea.show_result();
          })
          // モック用
          .then(() => {
            clutil.unblockUI();
          })
      );
    },

    // [検索]押下時の処理
    onclickSearch: function () {
      if (!this.validate()) {
        return;
      }
      return this.search({
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
        reqPage: _(this.paginationViews).first().buildReqPage0(),
        getReq: this.view2data(),
      });
    },

    // [Excel出力]押下時の処理
    onclickExcel: function () {
      return this.postJSON({
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV },
        getReq: this.view2data(),
      }).then((response) => {
        // clutil.download();
      });
    },

    // [検索条件を再指定]押下時の処理
    onclickSearchAgain: function () {
      this.controlSrchArea.show_srch();
    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new AMBBV3190();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
