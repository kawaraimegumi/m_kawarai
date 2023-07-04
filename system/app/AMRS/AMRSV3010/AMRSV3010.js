useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const srchCondView = Backbone.View.extend({
    el: $('#ca_searchArea'),
    events: {

    },

    initialize: function (opt) {
      _.bindAll(this);

      this.baseView = new clutil.View.MDBaseView({
        title: '支払明細入力',
        subtitle: '',
      })
        .initUIElement()
        .render();

      clutil.datapicker(this.$(''));

      clutil.clbusunitselector(this.$('#ca_srchTypeID'), 1);
    },

    initUIElement: function () {

      this.fieldRelation = cultil.fieldRelation.create('sunclass', {
        //対象月
        datapicker: {
          el: "#ca_srchData",
        },
        //業態
        clbusutypeselector: {
          el: "#ca_srchTypeID",
        },
        //補正業者
        vendor_typeid: {
          el: "#ca_srchVendorID",
        },
      });
      this.fieldRelation.done(function () {

      });

      //初期値を設定
      this.deserialize({
        srchTypeID: type,
        srchData: 0,
        srchVendorID: clcom.getOputData(),
      });
    },

    //UIの設定値から、検索リクエストパケットを生成する。
    serialize: function () {
      return cultil.view2data(this.$el);
    },

    //検索リクエストパケットの設定値をUIへセットする。
    deserialize: function (obj) {
      this.deserializing = true;
      try {
        var dto = _.extend({}, obj);
        cultil.data2view(this.$el, dto);
      } finally {
        this.derializing = false;
      }
    },
    //指定プロパティ名のUI設定値を取得する。
    //defaultValは、設定値が無い場合に返す値。
    getValue: function (propName, defaultVal) {
      if (_.isUndefined(defaultVal)) {
        defaultVal = null;
      }
      if (!_.isString(propName) || _.isEmpty(propName)) {
        return defaultVal;
      }
      var dto = this.serialize();
      var val = dto[propName];
      return (_.isUnderfined(val) || _.isNull(val) || _.isEmpty(val)) ? defaultVal : val;
    },
    //入力状態が正しいかどうかチェック。
    isValid: function () {
      if (!this.validator.valid()) {
        return false;
      }
      return true;
    },

    _eof: 'AMRSV3010.SrchCondView//'
  });

  /////////////////////////////////////////////////////////////
  // view
  var MainView = Backbone.View.extend({
    //要素
    el: $("#ca_main"),
    events: {
      'click #searchAgain': '_onSearchAgainClick',
    },
    initialize: function () {
      _.bindAll(this);

      //共通ビュー（共通のヘッダなどの内包）
      this.mdBaseView = new clutil.View.MDBaseView({
        title: '支払明細出力',
        subtitle: '一覧',
        btn_csv: false,
      });

      //検索パネル
      this.srchCondView = new srchCondView({ el: this.$('#ca_srchArea') });

      //グループID -- AMRSV3010 なデータに関することを表すためのマーキング文字列
      var groupid = 'AMRSV3010';


    },




  })

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new AMRSV3010();
      var $tgt = none;
      if (clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')) {
        $tgt = $("#ca_targetYM").next().children('input');
      }
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
