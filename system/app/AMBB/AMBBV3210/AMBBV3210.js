useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3210 = Backbone.View.extend({
    el: $('#container'),
    events: {},

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        opeTypeId: clcom.pageArgs.opeTypeId,
        title: '入金',
      })
        .initUIElement()
        .render();

      this.validator = this.baseView.validator;

      const $headerTable = this.$('#headerTable');
      this.headerRowSelectListView = new clutil.View.RowSelectListView({
        el: $headerTable,
        template: _.template($headerTable.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      clutil.datepicker(this.$('#伝票日付'));
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return {};
    },

    data2view: function (data) {
      clutil.data2view(this.$el, JSON.parse(JSON.stringify(data)), null, true);
    },

    validate: function () {
      const validator = this.validator;
      if (!validator.valid()) {
        validator.setErrorHeader(clmsg.cl_echoback);
        return false;
      }
      return true;
    },
  });
  return clutil.getIniJSON().then(
    (response) => {
      mainView = new AMBBV3210();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
