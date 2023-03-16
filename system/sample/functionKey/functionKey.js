$(function () {

  $('body').on('keydown', function (ev) {

    switch(ev.keyCode) {
    case 112:                   // F1
      ev.preventDefault();      // おまじない

      // ここにそれぞれの処理を書く
      $('.messageBox').text('F1 pressed');
      console.log('F1 pressed');
      break;
    case 113:                   // F2
      ev.preventDefault();      // おまじない

      // ここにそれぞれの処理を書く
      $('.messageBox').text('F2 pressed');
      console.log('F2 pressed');
      break;
    case 114:                   // F3
      ev.preventDefault();      // おまじない

      // ここにそれぞれの処理を書く
      $('.messageBox').text('F3 pressed');
      console.log('F3 pressed');
      break;
    case 115:                   // F4
      ev.preventDefault();      // おまじない

      // ここにそれぞれの処理を書く
      $('.messageBox').text('F4 pressed');
      console.log('F4 pressed');
      break;
    case 116:                   // F5
      ev.preventDefault();      // おまじない

      // ここにそれぞれの処理を書く
      $('.messageBox').text('F5 pressed');
      console.log('F5 pressed');
      break;
    case 117:                   // F6
      ev.preventDefault();      // おまじない

      // ここにそれぞれの処理を書く
      $('.messageBox').text('F6 pressed');
      console.log('F6 pressed');
      break;
    case 118:                   // F7
      ev.preventDefault();      // おまじない

      // ここにそれぞれの処理を書く
      $('.messageBox').text('F7 pressed');
      console.log('F7 pressed');
      break;
    case 119:                   // F8
      ev.preventDefault();      // おまじない

      // ここにそれぞれの処理を書く
      $('.messageBox').text('F8 pressed');
      console.log('F8 pressed');
      break;
    case 120:                   // F9
      ev.preventDefault();      // おまじない

      // ここにそれぞれの処理を書く
      $('.messageBox').text('F9 pressed');
      console.log('F9 pressed');
      break;
    case 121:                   // F10
      ev.preventDefault();      // おまじない

      // ここにそれぞれの処理を書く
      $('.messageBox').text('F10 pressed');
      console.log('F10 pressed');
      break;
    case 122:                   // F11
      ev.preventDefault();      // おまじない

      // ここにそれぞれの処理を書く
      $('.messageBox').text('F11 pressed');
      console.log('F11 pressed');
      break;
    case 123:                   // F12
      ev.preventDefault();      // おまじない

      // ここにそれぞれの処理を書く
      $('.messageBox').text('F12 pressed');
      console.log('F12 pressed');

      break;
    default:
    }
  });
});