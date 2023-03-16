$(function () {
  function log() {
    console.log(arguments);
  }

  $('#btn2').click(function () {
    // メッセージダイアログ
    var view2 = new clutil.MessageDialog({
      message: 'メッセージ。'
    });
    // 閉じるが押されたとき close イベントが発生
    view2.on('close', log);
  });


  $('#btn3').click(function () {
    // 確認ダイアログ
    var view2 = new clutil.ConfirmDialog({
      message: 'いいですか?'
    });
    // 決定で apply, キャンセルで cancel イベント発生
    view2.on('apply', log);
    view2.on('cancel', log);
  });


  $('#btn5').click(function () {
    // エラー
    var view2 = new clutil.ErrorDialog({
      message: 'メッセージ。'
    });
    // 閉じるが押されたとき close イベントが発生
    view2.on('close', log);
  });



  $('#btn4').click(function () {
    // 警告
    var view2 = new clutil.WarningDialog({
      message: 'メッセージ。'
    });
    // 閉じるが押されたとき close イベントが発生
    view2.on('close', log);
  });


});