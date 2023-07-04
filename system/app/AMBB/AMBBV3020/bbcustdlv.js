$(function () {
  const View = Backbone.View.extend({
    events: {
      'click #cancel': 'onclickCancel', // [キャンセル]押下
      'click #commit': 'onclickCommit', // [確定]押下
    },

    initialize: function (options) {
      _.extend(this, options);

      clutil.loadHtml(
        ((code) => {
          return [clcom.appRoot, code.slice(0, 4), code, 'bbcustdlv.html'].join(
            '/'
          );
        })(clcom.pageId),
        (html) => {
          this.html = html;
        }
      );
    },

    show: function () {
      this.$el.html(this.html);
      this.$main.hide();

      this.validator = clutil.validator(this.$el, {
        echoback: $('.cl_echoback'),
      });

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
      this.$main.show();
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return {};
    },

    data2view: function (data) {
      clutil.data2view(this.$el, JSON.parse(JSON.stringify(data)), null, true);
    },

    validate: function () {
      const validator = this.validator;
      if (!validator.valid()) {
        validator.setErrorHeader(clmsg.cl_echoback);
        return false;
      }
      return true;
    },

    // [キャンセル]押下時の処理
    onclickCancel: function () {
      this.hide();
      this.callback(null);
    },

    // [確定]押下時の処理
    onclickCommit: function () {
      if (!this.validate()) {
        return;
      }
      const data = this.view2data();
      this.hide();
      this.callback(data);
    },
  });

  BBcustdlvView = Backbone.View.extend({
    initialize: function (options) {
      $('#ca_main').append(_.template('<div id="<%= cid %>"></div>')(this));
      this.$el
        .empty()
        .append()
        .data({
          view: new View(
            _.defaults(
              {
                el: '#' + this.cid,
                $main: $('#container'),
                callback: (data) => {
                  if (!data) {
                    return;
                  }
                  this.set(data);
                },
              },
              options
            )
          ),
        });
    },

    show: function (options) {
      this.$el.data().view.show(options);
    },
  });
});
