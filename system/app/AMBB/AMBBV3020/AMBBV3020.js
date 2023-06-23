useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3020 = Backbone.View.extend({
    el: $('#ca_main'),
    events: {
      'click #bbcustbill': 'onclickBBcustbill',
      'click #bbcustdlv': 'onclickBBcustdlv',
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

      // switch (this.baseView.options.opeTypeId) {
      //   case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
      //   case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
      //   case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
      //     clutil.mediator.on('onMDGetCompleted', (args) => {
      //       switch (args.status) {
      //         case 'OK':
      //         case 'DONE':
      //           break;
      //         default:
      //           break;
      //       }
      //     });
      //     break;
      //   default:
      //     break;
      // }
      // switch (this.baseView.options.opeTypeId) {
      //   case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
      //   case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
      //   case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
      //     clutil.mediator.on('onMDSubmitCompleted', (args) => {
      //       switch (args.status) {
      //         case 'OK':
      //         case 'DONE':
      //           break;
      //         default:
      //           break;
      //       }
      //     });
      //     break;
      //   default:
      //     break;
      // }

      const $parent = this.$('#container');
      this.bbcustbillView = new BBcustbillView({
        el: '#bbcustbillContainer',
        $parent: $parent,
      });
      this.bbcustdlvView = new BBcustdlvView({
        el: '#bbcustdlvContainer',
        $parent: $parent,
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

    onclickBBcustbill: function () {
      this.bbcustbillView.show();
    },

    onclickBBcustdlv: function () {
      this.bbcustdlvView.show();
    },
  });
  return clutil.getIniJSON().then(
    (response) => {
      mainView = new AMBBV3020();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
