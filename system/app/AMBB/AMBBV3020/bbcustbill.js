$(function () {
  BBcustbillView = Backbone.View.extend({
    events: {
      'click #cancel': 'onclickCancel', // [キャンセル]押下
      'click #commit': 'onclickCommit', // [確定]押下
    },

    initialize: function (options) {
      clutil.loadHtml(
        ((code) => {
          return [
            clcom.appRoot,
            code.slice(0, 4),
            code,
            'bbcustbill.html',
          ].join('/');
        })(clcom.pageId),
        (html) => {
          _.defaults(_.extend(this, options), {
            validator: clutil.validator(this.$el, {
              echoback: $('.cl_echoback'),
            }),
            html: html,
          });
        }
      );
    },

    show: function () {
      this.$el.nextAll().hide().end().html(this.html);

      clutil.cltypeselector3({
        $select: this.$('#敬称'),
        list: [
          { id: 1, code: '1', name: '御中' },
          { id: 2, code: '2', name: '様' },
        ],
      });
      clutil.cltypeselector3({
        $select: this.$('#預金種類'),
        list: [
          { id: 1, code: '1', name: '普通' },
          { id: 2, code: '2', name: '当座' },
        ],
      });
      clutil.cltypeselector3({
        $select: this.$('#取引区分'),
        list: [{ id: 1, code: '1', name: '掛売' }],
      });
      clutil.cltypeselector3({
        $select: this.$('#税端数処理'),
        list: [
          { id: 1, code: '1', name: '四捨五入' },
          { id: 2, code: '2', name: '切捨て' },
          { id: 3, code: '3', name: '切上げ' },
        ],
      });
      clutil.cltypeselector3({
        $select: this.$('#税計算単位'),
        list: [
          { id: 0, code: '0', name: '伝票単位' },
          { id: 1, code: '1', name: '明細単位' },
        ],
      });
      clutil.cltypeselector3({
        $select: this.$('#手数料負担'),
        list: [
          { id: 1, code: '1', name: '先方負担' },
          { id: 2, code: '2', name: '当社負担' },
        ],
      });
      clutil.cltypeselector3({
        $select: this.$('#商品分税表示区分'),
        list: [
          { id: 1, code: '1', name: '税抜表示' },
          { id: 2, code: '2', name: '税込表示' },
        ],
      });
      clutil.cltypeselector3({
        $select: this.$('#その他税表示区分'),
        list: [
          { id: 1, code: '1', name: '税抜表示' },
          { id: 2, code: '2', name: '税込表示' },
        ],
      });
      clutil.cltypeselector3({
        $select: this.$('#回収方法'),
        list: [{ id: 1, code: '1', name: '銀行振込' }],
        unselectedflag: true,
      });
      clutil.cltypeselector3({
        $select: this.$('#法人販管請求書発行'),
        list: [
          { id: 0, code: '0', name: '発行しない' },
          { id: 1, code: '1', name: '発行する' },
        ],
      });
      clutil.cltypeselector3({
        $select: this.$('#税額計算区分'),
        list: [
          { id: 0, code: '0', name: '計算しない' },
          { id: 1, code: '1', name: '計算する' },
        ],
      });
      _.each(
        [this.$('#締日1'), this.$('#締日2'), this.$('#締日3')],
        ($select, index) => {
          clutil.cltypeselector3({
            $select: $select,
            list: [
              { id: 0, code: '00', name: '都度' },
              { id: 15, code: '15', name: '15日' },
              { id: 20, code: '20', name: '20日' },
              { id: 25, code: '25', name: '25日' },
              { id: 99, code: '99', name: '末日' },
            ],
            unselectedflag: index,
          });
        }
      );
      clutil.cltypeselector3({
        $select: this.$('#インフォマート請求書CSV出力'),
        list: [
          { id: 0, code: '0', name: '出力しない' },
          { id: 1, code: '1', name: '出力する' },
        ],
      });
    },

    hide: function () {
      this.$el.nextAll().show().end().html('');
    },

    validate: function () {
      const validator = this.validator;
      if (!validator.valid()) {
        validator.setErrorHeader(clmsg.cl_echoback);
        return false;
      }
      return true;
    },

    // [キャンセル]押下時の処理
    onclickCancel: function () {
      this.hide();
    },

    // [確定]押下時の処理
    onclickCommit: function () {
      if (!this.validate()) {
        return;
      }
      this.hide();
    },
  });
});
