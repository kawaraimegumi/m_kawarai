var View = Backbone.View.extend({
  events: {
    'submit': 'submit'
  },

  initialize: function (options) {
    _.bindAll(this, 'onSuccess');
  },

  submit: function (event) {
    console.log('submit');
    // !!!重要 ブラウザのデフォルトの挙動を抑制する!!!
    event.preventDefault();

    this.$el.ajaxSubmit({
      url: '/hoge',
      type: 'post',
      dataType: 'json',
      success: this.onSuccess,
      error: function () {
        console.log(arguments);
      },

      complete: function () {
        console.log(arguments);
      },

      beforeSend: function () {
        console.log(arguments);
      },

      data: {
        request: JSON.stringify({
          name1: 'x',
          name2: 'y'
        })
      }
    });
  },

  onSuccess: function(data, statusText, xhr, $form) {
    console.log(data, statusText, xhr, $form, this);
  }
});

$(function () {
  var view = new View({el: '#form1'});
});