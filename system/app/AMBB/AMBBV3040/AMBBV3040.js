useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3040 = Backbone.View.extend({
    el: $('#ca_main'),
    events: {},

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        opeTypeId: clcom.pageArgs.opeTypeId,
        title: '案件',
        buildGetReqFunction: (opeTypeId) => {
          return {
            resId: clcom.pageId,
            data: {
              reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
              AMBBV3020GetReq: {},
            },
          };
        },
        buildSubmitReqFunction: (opeTypeId) => {
          if (!this.validate()) {
            return;
          }
          return {
            resId: clcom.pageId,
            data: {
              reqHead: { opeTypeId: opeTypeId },
              AMBBV3020UpdReq: {},
            },
          };
        },
      })
        .initUIElement()
        .render();

      this.bbprojitemView = new BBprojitemView({
        el: '#bbprojitemContainer',
        $parent: this.$('#container'),
      });
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
      mainView = new AMBBV3040();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
