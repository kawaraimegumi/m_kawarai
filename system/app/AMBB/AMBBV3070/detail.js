$(function () {
  const _DetailView = Backbone.View.extend({
    events: {
      'change [name=format], [name=content]': 'onchangeFormat', // [表示形式][表示内容]変更
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

      const $table = this.$('#table');
      this.rowSelectListView = new clutil.View.RowSelectListView({
        el: $table,
        template: _.template($table.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      const $bborderTable1 = this.$('#bborderTable1');
      this.bborderRowSelectListView1 = new clutil.View.RowSelectListView({
        el: $bborderTable1,
        template: _.template($bborderTable1.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      const $bborderTable2 = this.$('#bborderTable2');
      this.bborderRowSelectListView2 = new clutil.View.RowSelectListView({
        el: $bborderTable2,
        template: _.template($bborderTable2.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      const $bbshipTable1 = this.$('#bbshipTable1');
      this.bbshipRowSelectListView1 = new clutil.View.RowSelectListView({
        el: $bbshipTable1,
        template: _.template($bbshipTable1.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      const $bbshipTable2 = this.$('#bbshipTable2');
      this.bbshipRowSelectListView2 = new clutil.View.RowSelectListView({
        el: $bbshipTable2,
        template: _.template($bbshipTable2.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      const $bbdeliverTable1 = this.$('#bbdeliverTable1');
      this.bbdeliverRowSelectListView1 = new clutil.View.RowSelectListView({
        el: $bbdeliverTable1,
        template: _.template($bbdeliverTable1.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      const $bbdeliverTable2 = this.$('#bbdeliverTable2');
      this.bbdeliverRowSelectListView2 = new clutil.View.RowSelectListView({
        el: $bbdeliverTable2,
        template: _.template($bbdeliverTable2.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      clutil.initUIelement(this.$el);

      this.rowSelectListView.setRecs(options.recs);
    },

    hide: function () {
      this.$el.html('');
      this.$main.show();
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return { format: Number(data.format), content: Number(data.content) };
    },

    data2view: function (data) {
      clutil.data2view(this.$el, JSON.parse(JSON.stringify(data)), null, true);
    },

    // [表示形式][表示内容]変更時の処理
    onchangeFormat: function () {
      this.bborderRowSelectListView1.$el.hide();
      this.bborderRowSelectListView2.$el.hide();
      this.bbshipRowSelectListView1.$el.hide();
      this.bbshipRowSelectListView2.$el.hide();
      this.bbdeliverRowSelectListView1.$el.hide();
      this.bbdeliverRowSelectListView2.$el.hide();
      const data = this.view2data();
      switch (data.format) {
        case 1:
          this.bborderRowSelectListView1.$el.show();
          switch (data.content) {
            case 1:
              this.bbshipRowSelectListView1.$el.show();
              break;
            case 2:
              this.bbdeliverRowSelectListView1.$el.show();
              break;
            case 3:
              break;
            default:
              return;
          }
          break;
        case 2:
          this.bborderRowSelectListView2.$el.show();
          switch (data.content) {
            case 1:
              this.bbshipRowSelectListView2.$el.show();
              break;
            case 2:
              this.bbdeliverRowSelectListView2.$el.show();
              break;
            case 3:
              break;
            default:
              return;
          }
          break;
        default:
          return;
      }
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

    show: function (options) {
      this.$el.data().view.show(options);
    },
  });
});
