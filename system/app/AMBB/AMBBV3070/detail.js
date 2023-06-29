$(function () {
  const _DetailView = Backbone.View.extend({
    events: {
      'click #cancel': 'onclickCancel', // [戻る]押下
    },

    initialize: function (options) {
      _.extend(this, options);

      clutil.loadHtml(
        ((code) => {
          return [clcom.appRoot, code.slice(0, 4), code, 'detail.html'].join(
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

    // [キャンセル]押下時の処理
    onclickCancel: function () {
      this.hide();
    },
  });

  DetailView = Backbone.View.extend({
    initialize: function (options) {
      $('#ca_main').append(_.template('<div id="<%= cid %>"></div>')(this));
      this.$el.empty().data({
        view: new _DetailView(
          _.defaults({ el: '#' + this.cid, $main: $('#container') }, options)
        ),
      });
    },

    show: function () {
      this.$el.data().view.show();
    },
  });
});
