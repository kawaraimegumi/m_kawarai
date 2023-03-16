$(function () {
  MDCMV0080SelectorView = Backbone.View.extend({
    screenId: 'MDCMV0080',
    validator: null,
    events: {
      'click #MDCMV0080_cancel_button': 'onclickCancelButton', // [キャンセル]押下
      'click #MDCMV0080_commit_button': 'onclickCommitButton', // [確定]押下
    },

    initialize: function (opt) {
      var defaults = {
        isAnalyse_mode: true,
      };
      var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt, defaults);
      _.extend(this, fixedOpt);
      _.bindAll(this);
    },

    render: function () {
      var url = clcom.getAnaSubPaneURI(this.screenId);
      clutil.loadHtml(
        url,
        _.bind(function (data) {
          this.html_source = data;
        }, this)
      );
    },

    show: function (isSubDialog) {
      if (!isSubDialog) {
        $('.cl_dialog').empty();
      }
      this.$parentView.hide();
      this.$el.html(this.html_source);
      this.initUIelement();
      $('.cl_echoback').hide();
      this.validator = clutil.validator($('#ca_MDCMV0080_main'), {
        echoback: $('.cl_echoback'),
      });
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode({
        view: this.$el,
      });
    },

    initUIelement: function () {
      clutil.inputlimiter(this.$el);
      clutil.initUIelement(this.$el);

      // 初期値
      this.setData();
    },

    // setter
    setData: function () {
      clutil.data2view(
        $('#ca_MDCMV0080_main'),
        this.anaProc.cond.dispopt,
        'MDCMV0080_'
      );
    },

    // [キャンセル]押下時の処理
    onclickCancelButton: function () {
      this.validator.clear();
      this.$parentView.show();
      this.okProc();
      this.$el.html('');
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode();
    },

    // [確定]押下時の処理
    onclickCommitButton: function () {
      this.validator.clear();
      this.$parentView.show();
      this.okProc(this.getData());
      this.$el.html('');
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode();
    },

    // getter
    getData: function () {
      return {
        cond: {
          dispopt: Ana.Util.valuesToNumber(
            clutil.view2data($('#ca_MDCMV0080_main'), 'MDCMV0080_')
          ),
        },
      };
    },
  });
});
