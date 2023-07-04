useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const XXXXV0000 = Backbone.View.extend({
    el: $('#ca_main'),
    events: {},

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({ title: '' })
        .initUIElement()
        .render();
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
