useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3070 = Backbone.View.extend({
    el: $('#container'),
    events: {
      'click #search': 'onclickSearch', // [検索]押下
      'click #excel': 'onclickExcel', // [Excel出力]押下
      'click #searchAgain': 'onclickSearchAgain', // [検索条件を再指定]押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        btn_new: false,
        title: '受注進捗',
      })
        .initUIElement()
        .render();

      this.validator = this.baseView.validator;

      this.bbcust = new BBcustView({ el: '#bbcust' });
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
      this.staff = new StaffView({ el: '#staff' });

      this.paginationViews = _(
        clutil.View.buildPaginationView(this.cid, this.$el)
      ).map((paginationView) => {
        return paginationView.render();
      });

      const $table1 = this.$('#table1');
      this.rowSelectListView1 = new clutil.View.RowSelectListView({
        el: $table1,
        template: _.template($table1.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();
      const $table2 = this.$('#table2');
      this.rowSelectListView2 = new clutil.View.RowSelectListView({
        el: $table2,
        template: _.template($table2.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();
      this.rowSelectListView = this.rowSelectListView1;

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
        .on('onOperation', () => {
          this.detail.show({
            recs: [this.rowSelectListView.getLastClickedRec()],
          });
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
            { stval: '受注日from', edval: '受注日to' },
            { stval: '受注ステータスfrom', edval: '受注ステータスto' },
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
