useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const MainView = Backbone.View.extend({
    el: $('#container'),
    events: {
      'change #list [name=金額]': 'onchange金額', // [金額]変更
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        opeTypeId: clcom.pageArgs.opeTypeId,
        title: '入金',
      })
        .initUIElement()
        .render();

      this.validator = this.baseView.validator;

      const $recs = this.$('#recs');
      this.recsView = new clutil.View.RowSelectListView({
        el: $recs,
        template: _.template($recs.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      clutil.datepicker(this.$('#伝票日付'));

      // モック用
      const recs = [];
      this.data2view({ recs: recs, list: [], items: recs });
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return {
        list: _(
          clutil.tableview2data(this.$('#list').find('tbody').children())
        ).map((data) => {
          return {
            取引コード: Number(data.取引コード),
            金額: Number(data.金額),
          };
        }),
      };
    },

    data2view: function (data) {
      clutil.data2view(this.$el, JSON.parse(JSON.stringify(data)), null, true);
      if (data.recs) {
        this.recsView.setRecs(data.recs);
      }
      if (data.list) {
        const $table = this.$('#list');
        const $tbody = $table.find('tbody').empty();
        const template = _.template($table.find('script').html());
        _(data.list).each((rec) => {
          const $tr = $(template(rec)).appendTo($tbody);
          clutil.cltypeselector3({
            $select: $tr.find('[name=取引コード]'),
            list: [
              { id: 200, code: '200', name: '銀行振込' },
              { id: 210, code: '210', name: '手数料' },
            ],
            unselectedflag: true,
          });
        });
      }
      this.onchange金額();
    },

    validate: function () {
      const validator = this.validator;
      if (!validator.valid()) {
        validator.setErrorHeader(clmsg.cl_echoback);
        return false;
      }
      return true;
    },

    // [金額]変更時の処理
    onchange金額: function () {
      const data = this.view2data();
      this.$('#入金額合計').val(
        _(data.list).reduce((memo, rec) => {
          return memo + rec.金額;
        }, 0)
      );
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
