useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const XXXXV0000 = Backbone.View.extend({
    el: $('#ca_main'),
    events: {},

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({ title: '' })
        .initUIElement()
        .render();
        clutil.cltypeselector3({
          $select: this.$('#テスト1'),
          list: [
            { id: 1, code: '01', name: 'A' },
            { id: 2, code: '02', name: 'B' },
            { id: 3, code: '03', name: 'C' },
          ],
        });  
        clutil.cltypeselector3({
          $select: this.$('#テスト2'),
          list: [
            { id: 1, code: '01', name: 'A' },
            { id: 2, code: '02', name: 'B' },
            { id: 3, code: '03', name: 'C' },
          ],
        });  
    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new XXXXV0000();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});