$(function () {
  BBcustdlvView = Backbone.View.extend({
    events: {
      'click #cancel': 'onclickCancel', // [キャンセル]押下
      'click #commit': 'onclickCommit', // [確定]押下
    },

    initialize: function (options) {
      clutil.loadHtml(
        ((code) => {
          return [clcom.appRoot, code.slice(0, 4), code, 'bbcustdlv.html'].join(
            '/'
          );
        })(clcom.pageId),
        (html) => {
          _.defaults(_.extend(this, options), {
            validator: clutil.validator(this.$el, {
              echoback: $('.cl_echoback'),
            }),
            html: html,
          });
        }
      );
    },

    show: function () {
      this.$el.html(this.html);
      this.$parent.hide();

      clutil.cltypeselector3({
        $select: this.$('#敬称'),
        list: [
          { id: 1, code: '1', name: '御中' },
          { id: 2, code: '2', name: '様' },
        ],
      });
      clutil.cltypeselector3({
        $select: this.$('#県コード'),
        list: [
          { id: 1, code: '01', name: '北海道' },
          { id: 13, code: '13', name: '東京都' },
          { id: 27, code: '27', name: '大阪府' },
          { id: 47, code: '47', name: '沖縄県' },
        ],
      });
    },

    hide: function () {
      this.$el.html('');
      this.$parent.show();
    },

    // [キャンセル]押下時の処理
    onclickCancel: function () {
      this.hide();
    },

    // [確定]押下時の処理
    onclickCommit: function () {
      if (!this.validate()) {
        return;
      }
      this.hide();
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
});
