useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3010 = Backbone.View.extend({
    el: $('#container'),
    events: {
      'click #csv': 'onclickCsv', // [発行先CSV出力]押下
      'click #search': 'onclickSearch', // [検索]押下
      'click #excel': 'onclickExcel', // [Excel出力]押下
      'click #searchAgain': 'onclickSearchAgain', // [検索条件を再指定]押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({ title: '法人' })
        .initUIElement()
        .render();

      this.validator = this.baseView.validator;

      this.staff = new StaffView({ el: '#staff' });
      _([this.$('#締日1'), this.$('#締日2'), this.$('#締日3')]).each(
        ($select) => {
          clutil.cltypeselector3({
            $select: $select,
            list: [
              { id: -1, code: '00', name: '都度' },
              { id: 15, code: '15', name: '15日' },
              { id: 20, code: '20', name: '20日' },
              { id: 25, code: '25', name: '25日' },
              { id: 99, code: '99', name: '末日' },
            ],
            unselectedflag: true,
          });
        }
      );

      this.paginationViews = _(
        clutil.View.buildPaginationView(this.cid, this.$el)
      ).map((paginationView) => {
        return paginationView.render();
      });

      const $table1 = this.$('#table1');
      this.rowSelectListView1 = _.extend(
        new clutil.View.RowSelectListView({
          el: $table1,
          template: _.template($table1.find('script').html()),
          groupid: this.cid,
        })
          .initUIElement()
          .render(),
        { uniqKeys: ['bbcustId'] }
      );
      const $table2 = this.$('#table2');
      this.rowSelectListView2 = _.extend(
        new clutil.View.RowSelectListView({
          el: $table2,
          template: _.template($table2.find('script').html()),
          groupid: this.cid,
        })
          .initUIElement()
          .render(),
        { uniqKeys: ['bbcustId', 'bbcustbillId'] }
      );
      this.rowSelectListView = this.rowSelectListView1;

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
          const recs = this.rowSelectListView.getSelectedRecs();
          clcom.pushPage({
            url: ((code) => {
              return [
                clcom.appRoot,
                code.slice(0, 4),
                code,
                code + '.html',
              ].join('/');
            })('AMBBV3020'),
            args: {
              opeTypeId: opeTypeId,
              recs: _(recs)
                .uniq((rec) => {
                  return [rec.bbcustId].join();
                })
                .map((rec) => {
                  return _.pick(rec, 'bbcustId');
                }),
            },
            saved: { request: this.request, recs: recs },
            newWindow: opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
          });
        });

      if (clcom.pageData) {
        const pageData = clcom.pageData;
        const request = pageData.request;
        this.data2view(request.getReq);
        return this.search(request).then(() => {
          this.rowSelectListView.setSelectRecs(
            pageData.recs,
            true,
            this.rowSelectListView.uniqKeys
          );
        });
      }
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return { format: Number(data.format) };
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
      if (!validator.valid()) {
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
            switch (request.getReq.format) {
              case 1:
                _.extend(this, { rowSelectListView: this.rowSelectListView1 });
                break;
              case 2:
                _.extend(this, { rowSelectListView: this.rowSelectListView2 });
                break;
              default:
                return;
            }
            this.rowSelectListView1.$el.hide();
            this.rowSelectListView2.$el.hide();
            this.rowSelectListView.setRecs(list);
            this.rowSelectListView.$el.show();
            this.controlSrchArea.show_result();
          })
          // モック用
          .then(() => {
            clutil.unblockUI();
          })
      );
    },

    // [発行先CSV出力]押下時の処理
    onclickCsv: function () {},

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
    onclickExcel: function () {},

    // [検索条件を再指定]押下時の処理
    onclickSearchAgain: function () {
      this.controlSrchArea.show_srch();
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
