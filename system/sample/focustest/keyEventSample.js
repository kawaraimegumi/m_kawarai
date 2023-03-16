// サンプル1
$(function () {
  $('#id1').on('keydown', function (event) {
    var keyCode = event.keyCode;

    switch (keyCode) {
    case 13: // ENTER

      // ブラウザのデフォルト動作を抑制する
      event.preventDefault();

      // ここに処理
      console.log('enter pressed');
      break;

    default:
      break;
    }
  });
});


////////////////////////////////////////////////////////////////
// サンプル2 Backbone を使用する場合

var View = Backbone.View.extend({
  events: {
    'keydown #id2': 'keydown'
  },

  keydown: function (event) {
    var keyCode = event.keyCode;
    console.log(event);
    switch (keyCode) {
    case 13: // ENTER

      // ブラウザのデフォルト動作を抑制する
      event.preventDefault();

      // ここに処理
      console.log('enter pressed');
      break;

    default:
      break;
    }
  }
});

$(function () {
  new View({el: 'body'});
});