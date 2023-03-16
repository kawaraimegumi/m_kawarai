var data = [
  {id: 'p1', level: 1, label: '売上高', hasChild: true},
  {label: '店舗売上', level: 2, parent: 'p1'},
  {label: '掛売上', level: 2, parent: 'p1'},
  {label: 'ＦＣ事業売上', level: 2, parent: 'p1'},
  {label: '内部売上', level: 2, parent: 'p1'},
  {label: '売上値引戻高', level: 2, parent: 'p1'},

  {id: 'p2', level: 1, label: '売上原価', hasChild: true},
  {parent: 'p2', label: '期首棚卸高', level: 2},
  {parent: 'p2', label: '仕入高', level: 2},
  {parent: 'p2', label: 'ＦＣ仕入高', level: 2},
  {parent: 'p2', label: '期末棚卸高', level: 2},

  {id: 'p3', level: 1, label: '委託外注/原価費用', hasChild: true},
  {parent: 'p3', label: '食材運用費', level: 2},
  {parent: 'p3', label: '委託外注費', level: 2},
  {parent: 'p3', label: '他勘定振替高', level: 2},
  {parent: 'p3', label: '仕入割戻高', level: 2},

  {id: 'p4', level: 1, label: '売上総利益', hasChild: false},

  {id: 'p5', level: 1, label: '販売一般管理費', hasChild: true},
  {parent: 'p5', label: '人件費', level: 2},
  {parent: 'p5', label: '消耗品費', level: 2},
  {parent: 'p5', label: '水光熱費', level: 2},
  {parent: 'p5', label: 'その他経費', level: 2},

  {id: 'p6', level: 1, label: '営業利益'},

  {id: 'p7', level: 1, label: '営業外収益', hasChild: true},
  {parent: 'p7', label: '受取利息', level: 2},
  {parent: 'p7', label: '有価証券利息', level: 2},
  {parent: 'p7', label: '受取配当金', level: 2},
  {parent: 'p7', label: '受取手数料', level: 2},
  {parent: 'p7', label: '現金過不足', level: 2},
  {parent: 'p7', label: '雑収入', level: 2},

  {id: 'p8', level: 1, label: '営業外費用', hasChild: true},
  {parent: 'p8', label: '支払利息', level: 2},
  {parent: 'p8', label: 'その他営業外費用', level: 2},
  {parent: 'p8', label: '現金過不足', level: 2},
  {parent: 'p8', label: '雑損失', level: 2},

  {id: 'p9', level: 1, label: '経常利益'}
];

var xLabels = [
  '一番カルビ五反田'
];

var footers = [
  '客数',
  '客単価',
  '値引前売上',
  '値引率'
];

$(function () {
  var $table = $('#table1'),
      $thead = $table.find('thead'),
      $theadRow = $('<tr>').appendTo($thead);

  $theadRow.append('<th class=""></th>');

  _.each(xLabels, function (label)  {
    $theadRow.append('<th class="">' + label + '</th>');
  });

  var template = _.template('<td class="l<%= level %>"><%= label %></td>');
  var $tbody = $table.find('tbody');
  var parent;
  _.each(data, function (item) {
    var $tr = $('<tr>').appendTo($tbody);
    $tr.addClass('l' + item.level);
    if (item.id) {
      $tr.attr('data-id', item.id);
    }
    if (item.parent) {
      $tr.attr('data-parent', item.parent);
    }
    if (item.hasChild) {
      $tr.addClass('parent');
    }
    var $td = $(template(item)).appendTo($tr);
    if (item.hasChild) {
      $td.prepend('<i class="icon-plus"></i><i class="icon-minus"></i>');
    }
    _.each(xLabels, function () {
      $('<td class="align-right">9,999,999</td>').appendTo($tr);
    });
  });

  $('tr.parent').addClass('closed');
  $('tr.closed td.l1').live('click', function () {
    $(this).parent().removeClass('closed').addClass('opened');
    $('[data-parent="' + $(this).parent().attr('data-id') + '"]').show();
  });
  $('tr.opened td.l1').live('click', function () {
    $(this).parent().addClass('closed').removeClass('opened');
    $('[data-parent="' + $(this).parent().attr('data-id') + '"]').hide();
  });

  $('tbody tr[data-parent]').hide();

  _.each(footers, function (x) {
    var $tr = $('<tr>').appendTo($('#footer1').find('tbody'));
    $('<td>' + x + '</td>').appendTo($tr);
    _.each(_.range(Math.min(xLabels.length, 5)), function () {
      $('<td class="align-right">999,999,999</td>').appendTo($tr);
    });
  });

  $('#table1').tablefix({
    height: 270,
    fixRows: 1
    // fixCols: 1,
    // width: $('#table1').parent().width()
  });
});