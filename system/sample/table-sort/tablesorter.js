$(function () {
  $('#table1')
    .tablesort()
    .bind('orderchange.tablesort', function (ev, order) {
      // ヘッダクリック時にここが呼ばれる
      // order にソート順序がはいっている
      // 例
      // [{"name":"b","order":-1},{"name":"d","order":1},{"name":"a","order":-1}]
      console.log(JSON.stringify(order));

    });
});
