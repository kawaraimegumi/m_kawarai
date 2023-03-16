var View = Backbone.View.extend({
  el: '#form1',

  events: {
    'submit': 'onSubmit'
  },

  initialize: function () {
    this.validator = clutil.validator(this.$el, {
      echoback: $('.cl_echoback')
    });
    this.validator.valid();
  },

  onSubmit: function (event) {
    event.preventDefault();
    if (!this.validator.valid()) {
      return this;
    }
  }
});


$(function () {
  new View();
});