$(function () {
  'use strict';
  var $messageBox = $('.messageBox');

  function mycallback (ev, key) {
    $messageBox.text(key);
    console.log(key);
  }

  clutil.globalSetKey('f11', mycallback);

  clutil.globalSetKey({
    f1: mycallback,
    f2: mycallback,
    f3: mycallback,
    f5: mycallback,
    'C-f': mycallback,
    'C-f9': mycallback,
    'M-S-C-f': mycallback
  });


  $('.off1').click(function () {
    clutil.globalUnsetKey('f1');
  });
});
