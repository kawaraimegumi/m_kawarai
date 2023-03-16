$(function () {

  function doit() {
    var $table = $('#mytable');
    var $td = $('#mytable>tbody>tr:eq(1)>td:eq(2)');
    var $event = $('.my-event');
    var pos = $td.position();
    var outerWidth = $td.outerWidth(true);
    var bounds = {
      r: $table.outerWidth(true) + $table.position().left,
      l: $table.position().left
    };
    console.log($td,pos, $td.get(0).outerWidth);
    
    $event.css({
      position: 'absolute',
      top: pos.top,
      left: pos.left,
      width: outerWidth,
      height: $td.outerHeight()
    });
    
    $event.resizable({
      handles: 'e, w',
      grid: outerWidth,
      minWidth: outerWidth,
      resize: function (e, ui) {
        // console.log('resize', ui);
      },
      containment: $table,
      stop: function (e, ui) {
        // var r = ui.position.left + ui.size.width,
        //     l = ui.position.left,
        //     $e = $(ui.element);
        // if (r > bounds.r) {
        //   $e.outerWidth(bounds.r - ui.position.left);
        // }
      }
    });
  }

  doit();
  // $(window).resize(function () {
  //   doit();
  // });
});