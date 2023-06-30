useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3080 = Backbone.View.extend({
    el: $('#container'),
    events: {
      'click #search': 'onclickSearch', // [検索]押下
      'click #excel': 'onclickExcel', // [Excel出力]押下
      'click #searchAgain': 'onclickSearchAgain', // [検索条件を再指定]押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        btn_new: false,
        title: '出荷指示',
      })
        .initUIElement()
        .render();

      this.validator = this.baseView.validator;

      this.bbcust = new BBcustView({ el: '#bbcust' });
      clutil.datepicker(this.$('#契約期間from'));
      clutil.datepicker(this.$('#契約期間to'));
      clutil.datepicker(this.$('#受注日from'));
      clutil.datepicker(this.$('#受注日to'));
      clutil.datepicker(this.$('#希望納期from'));
      clutil.datepicker(this.$('#希望納期to'));
      this.staff = new StaffView({ el: '#staff' });

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
        { uniqKeys: ['bbcustId', 'bbprojId', 'bborderId', 'bbshipId'] }
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
        { uniqKeys: ['bbcustId', 'bbprojId', 'bborderId', 'bbshipId'] }
      );
      const $table3 = this.$('#table3');
      this.rowSelectListView3 = _.extend(
        new clutil.View.RowSelectListView({
          el: $table3,
          template: _.template($table3.find('script').html()),
          groupid: this.cid,
        })
          .initUIElement()
          .render(),
        { uniqKeys: ['bbcustId', 'bbprojId', 'bborderId', 'bbshipId'] }
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
            })('AMBBV3090'),
            args: {
              opeTypeId: opeTypeId,
              recs: _(recs)
                .uniq((rec) => {
                  return [
                    rec.bbcustId,
                    rec.bbprojId,
                    rec.bborderId,
                    rec.bbshipId,
                  ].join();
                })
                .map((rec) => {
                  return _.pick(
                    rec,
                    'bbcustId',
                    'bbprojId',
                    'bborderId',
                    'bbshipId'
                  );
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
                bbprojId: index,
                bbprojCode: ('0000000000' + index).slice(-7),
                bbprojName: '案件' + index,
                bborderId: index,
                bborderCode: ('0000000000' + index).slice(-7),
                bbshipId: index,
                bbshipCode: ('0000000000' + index).slice(-9),
                bbshipName: '出荷指示件名' + index,
              };
            }),
          },
        };
      });
    },

    validate: function () {
      const validator = this.validator;
      if (
        !_([
          validator.valid(),
          validator.validFromTo([
            { stval: '契約期間from', edval: '契約期間to' },
            { stval: '受注日from', edval: '受注日to' },
            { stval: '希望納期from', edval: '希望納期to' },
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
            switch (request.getReq.format) {
              case 1:
                _.extend(this, { rowSelectListView: this.rowSelectListView1 });
                break;
              case 2:
                _.extend(this, { rowSelectListView: this.rowSelectListView2 });
                break;
              case 3:
                _.extend(this, { rowSelectListView: this.rowSelectListView3 });
                break;
              default:
                return;
            }
            this.rowSelectListView1.$el.hide();
            this.rowSelectListView2.$el.hide();
            this.rowSelectListView3.$el.hide();
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
      mainView = new AMBBV3080();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
