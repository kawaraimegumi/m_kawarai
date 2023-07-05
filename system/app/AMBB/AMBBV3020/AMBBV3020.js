useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const MainView = Backbone.View.extend({
    el: $('#container'),
    events: {
      'click #bbcustbill tfoot': 'onclickBBcustbill', // 請求先情報[+]押下
      'click #bbcustdlv tfoot': 'onclickBBcustdlv', // 納品先情報[+]押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        opeTypeId: clcom.pageArgs.opeTypeId,
        title: '法人',
        buildGetReqFunction: (opeTypeId) => {
          return {
            resId: clcom.pageId,
            data: {
              reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
              getReq: {},
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
              updReq: {},
            },
          };
        },
      })
        .initUIElement()
        .render();

      this.bbcustbillView = new BBcustbillView();
      this.bbcustdlvView = new BBcustdlvView();

      switch (this.baseView.options.opeTypeId) {
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
          this.disable();
          break;
        default:
          break;
      }
      switch (this.baseView.options.opeTypeId) {
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
          clutil.mediator.on('onMDGetCompleted', (args) => {});
          break;
        default:
          break;
      }
      switch (this.baseView.options.opeTypeId) {
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
          clutil.mediator.on('onMDSubmitCompleted', (args) => {});
          break;
        default:
          break;
      }
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return {};
    },

    data2view: function (data) {
      clutil.data2view(this.$el, JSON.parse(JSON.stringify(data)), null, true);
    },

    disable: function (disabled = true) {
      if (disabled) {
        clutil.viewReadonly(this.$el);
        this.$('#bbcustbill').find('tfoot').hide();
        this.$('#bbcustdlv').find('tfoot').hide();
      } else {
        clutil.viewRemoveReadonly(this.$el);
        this.$('#bbcustbill').find('tfoot').show();
        this.$('#bbcustdlv').find('tfoot').show();
      }
    },

    validate: function () {
      const validator = this.validator;
      if (!validator.valid()) {
        validator.setErrorHeader(clmsg.cl_echoback);
        return false;
      }
      return true;
    },

    // 請求先情報[+]押下時の処理
    onclickBBcustbill: function () {
      this.bbcustbillView.show();
    },

    // 納品先情報[+]押下時の処理
    onclickBBcustdlv: function () {
      this.bbcustdlvView.show();
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
