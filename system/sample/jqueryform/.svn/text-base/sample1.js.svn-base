var View = Backbone.View.extend({
  events: {
    'submit': 'submit'
  },

  initialize: function (options) {
    _.bindAll(this, 'onSuccess');
    clutil.fileinput($('#fileinput1'));
  },

  submit: function (event) {
    console.log('submit');
    // !!!重要 ブラウザのデフォルトの挙動を抑制する!!!
    event.preventDefault();
    var data = {
      foo: 'bar'
    };
    clutil.upload(this.$el, 'exampleupload', data, this.onSuccess);
  },

  onSuccess: function(data, statusText, xhr, $form) {
    console.log('!!!SUCCESS!!!', data, statusText, xhr, $form, this);
  }
});

$(function () {
  var view = new View({el: '#form1'});
});