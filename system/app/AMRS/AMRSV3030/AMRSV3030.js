useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMRSV3010 = Backbone.View.extend({
    el: $('#ca_main'),
    events: {},

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        title: '補正賃対比分析表出力', btn_new: false,
        subtitle: '',
      })
        .initUIElement()
        .render();

      // clutil.datepicker(this.$('#カレンダー任意'));

      clutil.datepicker(this.$('#カレンダー必須'));

      // clutil.datepicker(this.$('#カレンダーfrom'));
      // clutil.datepicker(this.$('#カレンダーto'));

      // clutil.cltypeselector3({
      //   $select: this.$('#プルダウン単一'),
      //   list: [
      //     { id: 1, code: '01', name: 'A' },
      //     { id: 2, code: '02', name: 'B' },
      //     { id: 3, code: '03', name: 'C' },
      //   ],
      //   unselectedflag: true,
      // });
      clutil.clbusunitselector(this.$('#プルダウン単一'), 1);

      // clutil.cltypeselector3({
      //   $select: this.$('#プルダウン複数任意'),
      //   list: [
      //     { id: 1, code: '01', name: 'A' },
      //     { id: 2, code: '02', name: 'B' },
      //     { id: 3, code: '03', name: 'C' },
      //   ],
      // });

      // clutil.cltypeselector3({
      //   $select: this.$('#プルダウン複数必須'),
      //   list: [
      //     { id: 1, code: '01', name: 'A' },
      //     { id: 2, code: '02', name: 'B' },
      //     { id: 3, code: '03', name: 'C' },
      //   ],
      // });

    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new AMRSV3010();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
