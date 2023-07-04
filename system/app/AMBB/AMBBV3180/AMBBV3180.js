useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3180 = Backbone.View.extend({
    el: $('#container'),
    events: {
      'click #search': 'onclickSearch', // [検索]押下
      'click #取消': 'onclick取消', // [取消]押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        btn_new: false,
        title: '請求締取消',
        subtitle: '',
        btn_csv: false,
      })
        .initUIElement()
        .render();

      this.validator = this.baseView.validator;

      this.bbcust = new BBcustView({ el: '#bbcust' });
      this.bbcustbill = new BBcustbillView({ el: '#bbcustbill' });
      clutil.datepicker(this.$('#締日'));
      clutil.cltypeselector3({
        $select: this.$('#請求締年'),
        list: _(10).times((index) => {
          const year = bbutil.ymd2y(clcom.getOpeDate()) - index;
          return { id: year, name: year + '年' };
        }),
      });
      clutil.cltypeselector3({
        $select: this.$('#請求締月'),
        list: _(12).times((index) => {
          const month = index + 1;
          return { id: month, name: month + '月' };
        }),
      });

      const $list = this.$('#list');
      this.listView = new clutil.View.RowSelectListView({
        el: $list,
        template: _.template($list.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      // モック用
      this.data2view({ list: [] });
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return {};
    },

    data2view: function (data) {
      clutil.data2view(this.$el, JSON.parse(JSON.stringify(data)), null, true);
      if (data.list) {
        this.listView.setRecs(data.list);
      }
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
            this.listView.setRecs(list);
            this.$('#result').show();
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
        getReq: this.view2data(),
      });
    },

    // [取消]押下時の処理
    onclick取消: function () {
      clutil.ConfirmDialog('取消してよろしいですか？');
    },
  });
  return clutil.getIniJSON().then(
    (response) => {
      mainView = new AMBBV3180();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
