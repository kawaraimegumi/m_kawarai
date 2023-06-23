$(function () {
  DetailView = Backbone.View.extend({
    events: {
      'click #cancel': 'onclickCancel', // [キャンセル]押下
      'click #commit': 'onclickCommit', // [確定]押下
    },

    initialize: function (options) {
      clutil.loadHtml(
        ((code) => {
          return [clcom.appRoot, code.slice(0, 4), code, 'detail.html'].join(
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
