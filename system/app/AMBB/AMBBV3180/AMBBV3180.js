useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3180 = Backbone.View.extend({
    el: $('#container'),
    events: {
      'click #search': 'onclickSearch', // [検索]押下
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
