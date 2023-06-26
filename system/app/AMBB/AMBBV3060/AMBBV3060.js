useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3060 = Backbone.View.extend({
    el: $('#container'),
    events: {},

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        opeTypeId: clcom.pageArgs.opeTypeId,
        title: '受注',
      })
        .initUIElement()
        .render();

      clutil.cltypeselector3({
        $select: this.$('#売上パターン'),
        list: [
          { id: 1, code: '1', name: '法人売／法人請求' },
          { id: 2, code: '2', name: '店売／法人請求' },
          { id: 3, code: '3', name: '店売／店請求' },
        ],
      });
      clutil.datepicker(this.$('#受注日'));
      clutil.datepicker(this.$('#希望納期'));
    },

    validate: function () {
      const validator = this.baseView.validator;
      if (!validator.valid()) {
        validator.setErrorHeader(clmsg.cl_echoback);
        return false;
      }
      return true;
    },
  });
  return clutil.getIniJSON().then(
    (response) => {
      mainView = new AMBBV3060();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});