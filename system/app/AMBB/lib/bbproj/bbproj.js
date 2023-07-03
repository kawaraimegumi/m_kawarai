$(function () {
  BBprojView = Backbone.View.extend({
    initialize: function (options) {
      $('#ca_main').append(_.template('<div id="<%= cid %>"></div>')(this));
      this.$el
        .empty()
        .append(
          '' +
            '<div style="display: flex">' +
            '<input type="text" class="form-control cl_valid wt280" disabled />' +
            '<button class="btn btn-default">参照</button>' +
            '</div>'
        );
    },
  });
});
