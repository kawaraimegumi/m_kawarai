$(function () {
  const View = Backbone.View.extend({
    events: {
      'click #cancel': 'onclickCancel', // [キャンセル]押下
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

    show: function (options) {
      this.$el.html(this.html);
      this.$main.hide();

      this.headerRowSelectListView = new clutil.View.RowSelectListView({
        el: this.$('#headerTable'),
        template: _.template(this.$('#headerRowTemplate').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      this.headerRowSelectListView.setRecs(options.recs);
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
        view: new View(
          _.defaults({ el: '#' + this.cid, $main: $('#container') }, options)
        ),
      });
    },

    show: function (options) {
      this.$el.data().view.show(options);
    },
  });
});
