useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const XXXXV0000 = Backbone.View.extend({
    el: $('#ca_main'),
    events: {},

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        title: 'POS外売上一覧',
        subtitle: '',
      })
        .initUIElement()
        .render();
        clutil.clbusunitselector(this.$('#業態'), 1);
        clutil.datepicker(this.$('#テスト1'));
        clutil.datepicker(this.$('#テスト2'));
    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new XXXXV0000();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
