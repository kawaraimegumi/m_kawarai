var xLabels = [
  '一番カルビ品川',
  '一番カルビ田町',
  '一番カルビ浜松町',
  '一番カルビ新橋',
  '一番カルビ有楽町',
  '一番カルビ東京',
  '一番カルビ神田',
  '一番カルビ秋葉原',
  '一番カルビ御徒町',
  '一番カルビ上野',
  '一番カルビ鶯谷',
  '一番カルビ日暮里',
  '一番カルビ西日暮里',
  '一番カルビ田端',
  '一番カルビ駒込',
  '一番カルビ巣鴨',
  '一番カルビ大塚',
  '一番カルビ池袋',
  '一番カルビ目白',
  '一番カルビ高田馬場',
  '一番カルビ新大久保',
  '一番カルビ新宿',
  '一番カルビ代々木',
  '一番カルビ原宿',
  '一番カルビ渋谷',
  '一番カルビ恵比寿',
  '一番カルビ目黒',
  '一番カルビ五反田',
  '一番カルビ大崎'
];

var yLabels = [
  [
    '20130301',
    '20130302',
    '20130303',
    '20130304',
    '20130305',
    '20130306',
    '20130307',
    '20130308',
    '20130309',
    '20130310',
    '20130311',
    '20130312',
    '20130313',
    '20130314',
    '20130315',
    '20130316',
    '20130317',
    '20130318',
    '20130319',
    '20130320',
    '20130321',
    '20130322',
    '20130323',
    '20130324',
    '20130325',
    '20130326',
    '20130327',
    '20130328',
    '20130329',
    '20130330',
    '20130331'
  ],
  [
    '売上金額',
    '客数',
    '社員労働時間',
    // '清算数',
    // 'ＰＡ労働時間',
    // 'ロス金額',
    // '平均客単価',
    // '社員労働賃金',
    // 'ＰＩ値',
    // 'ＰＡ労働賃金',
    // '粗利金額',
    // 'クーポン回収数',
    // '粗利率',
    // 'クーポン対象金額',
    // '科目金額',
    // '仕入金額',
    // 'クーポン割引金額',
    // 'クーポン対象客数',
    // '科目予算',
    // '発注金額',
    // '売上予算',
    // '客数予算',
    // '在庫金額'
  ]
];

$(function () {
  var $table = $('#table1'),
      $thead = $table.find('thead'),
      $theadRow = $('<tr>').appendTo($thead);

  for (var i = 0; i < yLabels.length; i++) {
    $theadRow.append('<th class="yLabel' + i + '"></th>');
  }
  _.each(xLabels, function (label)  {
    $('thead > tr', $table).append('<th class="">' + label + '</th>');
  });

  var template = _.template('<td><%= label %></td>');
  var $tbody = $table.find('tbody');
  _.each(yLabels[0], function (yLabel0) {
    var attr0 = {
      rowspan: String(yLabels[1].length)
    };
    _.each(yLabels[1], function (yLabel1) {
      var $tr = $('<tr>').appendTo($tbody);
      $(template({label: yLabel0})).attr(attr0).appendTo($tr);
      $(template({label: yLabel1})).appendTo($tr);
      _.each(xLabels, function () {
        $tr.append('<td class="align-right">9,999,999</td>');
      });
      attr0.style = 'display: none;';
    });
  });

  $('#table1').tablefix({width: $('#table1').parent().width(), fixRows: 1, height: 400, fixCols: 2});
});
