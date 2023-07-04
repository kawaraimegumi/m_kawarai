useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const MainView = Backbone.View.extend({
    el: $('#container'),
    events: {},

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        opeTypeId: clcom.pageArgs.opeTypeId,
        title: '売上',
      })
        .initUIElement()
        .render();

      this.bbcust = new BBcustView({ el: '#bbcust' });
      this.bbproj = new BBprojView({ el: '#bbproj' });
      clutil.datepicker(this.$('#受注日'));
      clutil.cltypeselector3({
        $select: this.$('#売上パターン'),
        list: [
          { id: 1, code: '1', name: '法人売／法人請求' },
          { id: 2, code: '2', name: '店売／法人請求' },
          { id: 3, code: '3', name: '店売／店請求' },
        ],
      });
      this.bbcustbill = new BBcustbillView({ el: '#bbcustbill' });
      _([this.$('#締日1'), this.$('#締日2'), this.$('#締日3')]).each(
        ($select) => {
          clutil.cltypeselector3({
            $select: $select,
            list: [
              { id: -1, code: '00', name: '都度' },
              { id: 15, code: '15', name: '15日' },
              { id: 20, code: '20', name: '20日' },
              { id: 25, code: '25', name: '25日' },
              { id: 99, code: '99', name: '末日' },
            ],
            unselectedflag: true,
          });
        }
      );
      clutil.datepicker(this.$('#売上日'));
      clutil.datepicker(this.$('#請求基準日'));
      clutil.datepicker(this.$('#回収予定日'));
      clutil.datepicker(this.$('#標準の回収予定日'));
      clutil.cltypeselector3({
        $select: this.$('#USJAN'),
        list: [
          { id: 88, code: '88', name: '(企業)法人テスト地区(テスト)用' },
          { id: 99, code: '99', name: '（学校）法人テスト地区（テスト）用' },
        ],
      });
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return {};
    },

    data2view: function (data) {
      clutil.data2view(this.$el, JSON.parse(JSON.stringify(data)), null, true);
    },

    validate: function () {
      const validator = this.validator;
      if (!validator.valid()) {
        validator.setErrorHeader(clmsg.cl_echoback);
        return false;
      }
      return true;
    },
  });
  return clutil.getIniJSON().then(
    (response) => {
      mainView = new MainView();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
