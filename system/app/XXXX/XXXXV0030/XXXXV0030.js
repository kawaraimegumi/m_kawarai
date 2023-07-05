useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const MainView = Backbone.View.extend({
    el: $('#container'),
    events: { 'click #out': 'onclickOut' }, // [出力]押下

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        btn_new: false,
        title: '〇〇出力', // ★
        subtitle: '',
      })
        .initUIElement()
        .render();

      this.validator = this.baseView.validator;

      // ★
    },

    // [出力]押下時の処理
    onclickOut: function () {
      if (!this.validator.valid()) {
        return;
      }
    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new MainView();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
