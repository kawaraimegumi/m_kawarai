$(function () {
  MDCMV0070SelectorView = Backbone.View.extend({
    screenId: 'MDCMV0070',
    validator: null,
    events: {
      'change #MDCMV0070_dispgroup': 'onchangeDispgroup', // 分類変更
      'click .MDCMV0070_disp_item': 'onclickDispItem', // 表示項目押下
      'click #MDCMV0070_add_button': 'onclickAddButton', // テンキー[追加]押下
      'click #MDCMV0070_calc_button button': 'onclickCalcButton', // テンキー 数値、記号押下
      'click #MDCMV0070_clear_button': 'onclickClearButton', // テンキー[クリア]押下
      'click #MDCMV0070_cancel_button': 'onclickCancelButton', // [キャンセル]押下
      'click #MDCMV0070_commit_button': 'onclickCommitButton', // [確定]押下
    },

    initialize: function (opt) {
      var defaults = {
        isAnalyse_mode: true,
      };
      var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt, defaults);
      _.extend(this, fixedOpt);
      _.bindAll(this);
    },

    render: function () {
      var url = clcom.getAnaSubPaneURI(this.screenId);
      clutil.loadHtml(
        url,
        _.bind(function (data) {
          this.html_source = data;
        }, this)
      );
    },

    show: function (isSubDialog) {
      if (!isSubDialog) {
        $('.cl_dialog').empty();
      }
      this.$parentView.hide();
      this.$el.html(this.html_source);
      this.initUIelement();
      $('.cl_echoback').hide();
      this.validator = clutil.validator($('#ca_MDCMV0070_main'), {
        echoback: $('.cl_echoback'),
      });
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode({
        view: this.$el,
      });
    },

    initUIelement: function () {
      clutil.inputlimiter(this.$el);
      clutil.initUIelement(this.$el);

      // 分類
      this.dispgrouplist = _.where(this.anadata.disp_item_list, {
        dispitem_id: 0,
      });
      clutil.cltypeselector2(
        $('#MDCMV0070_dispgroup'),
        this.dispgrouplist,
        0,
        1,
        'dispgroup'
      );
      // テンキー
      this.calcButtons = {
        add: {
          expr_formula: '+',
          expr_formula_txt: '＋',
        },
        minus: {
          expr_formula: '-',
          expr_formula_txt: '－',
        },
        ast: {
          expr_formula: '*',
          expr_formula_txt: '＊',
        },
        st: {
          expr_formula: '(',
          expr_formula_txt: '（',
        },
        ed: {
          expr_formula: ')',
          expr_formula_txt: '）',
        },
        sla: {
          expr_formula: '/',
          expr_formula_txt: '／',
        },
      };
      _.each(
        _.range(10),
        _.bind(function (i) {
          this.calcButtons[i] = {
            expr_formula: String(i),
            expr_formula_txt: String(i),
          };
        }, this)
      );
      // 小数点
      this.exprDecpointList = _.map(_.range(4), function (decpoint) {
        return {
          id: decpoint,
          name: String(decpoint),
        };
      });
      clutil.cltypeselector2(
        $('#MDCMV0070_expr_decpoint'),
        this.exprDecpointList,
        0,
        1
      );
      // 初期値
      this.setData();
    },

    // setter
    setData: function () {
      this.setDispgroup();
      this.setCond();
    },

    // 分類 setter
    setDispgroup: function (dispgroup) {
      this.changeDispItemList();
    },

    // 表示項目リストを変更する
    changeDispItemList: function () {
      var dispgroup = this.getDispgroup();
      var dispItemList = _.filter(
        this.anadata.disp_item_list,
        function (dispItem) {
          return (
            dispItem.dispgroup == dispgroup &&
            dispItem.dispitem_id &&
            dispItem.sum_bitset
          );
        }
      );
      $('#MDCMV0070_disp_item_tbody').empty();
      $('#MDCMV0070_disp_item_tbody_template')
        .tmpl(dispItemList)
        .appendTo('#MDCMV0070_disp_item_tbody');
    },

    // 条件 setter
    setCond: function () {
      this.setDispitem(this.cond.dispitem);
    },

    // 条件.表示項目 setter
    setDispitem: function (dispitem) {
      $('#MDCMV0070_dispitem_id').val(dispitem.dispitem_id);
      $('#MDCMV0070_name').val(dispitem.name);
      this.setExprFormula({
        expr_formula: dispitem.expr_formula,
        expr_formula_txt: dispitem.expr_formula_txt,
      });
      $('#MDCMV0070_expr_decpoint').selectpicker('val', dispitem.expr_decpoint);
    },

    // 計算式 setter
    setExprFormula: function (exprFormula) {
      exprFormula = exprFormula || {};
      $('#MDCMV0070_expr_formula').val(exprFormula.expr_formula || '');
      $('#MDCMV0070_expr_formula_txt').val(exprFormula.expr_formula_txt || '');
    },

    // 分類変更時の処理
    onchangeDispgroup: function (e) {
      this.changeDispItemList();
    },

    // 表示項目押下時の処理
    onclickDispItem: function (e) {
      var $target = $(e.target);
      $target.closest('table').find('tr.selected').removeClass('selected');
      $target.closest('tr').addClass('selected');
    },

    // テンキー[追加]押下時の処理
    onclickAddButton: function (e) {
      var selectedDispItem = this.getSelectedDispItem();
      if (!selectedDispItem) {
        return;
      }
      var exprFormula = this.getExprFormula();
      this.setExprFormula({
        expr_formula:
          exprFormula.expr_formula + '$' + selectedDispItem.dispitem_id,
        expr_formula_txt: exprFormula.expr_formula_txt + selectedDispItem.name,
      });
    },

    // 選択された表示項目 getter
    getSelectedDispItem: function () {
      var number = this.number;
      var selectedDispItemList = _.map(
        clutil.tableview2data(
          $('#MDCMV0070_disp_item_tbody').find('tr.selected')
        ),
        function (viewData) {
          return {
            dispitem_id: number(viewData.dispitem_id),
            name: viewData.name || '',
            sum_bitset: number(viewData.sum_bitset),
          };
        }
      );
      return selectedDispItemList.length ? selectedDispItemList[0] : null;
    },

    // テンキー 数値、記号押下時の処理
    onclickCalcButton: function (e) {
      var exprFormula = this.getExprFormula();
      var buttonID = $(e.currentTarget).attr('id').slice(15);
      var calcButton = this.calcButtons[buttonID];
      this.setExprFormula({
        expr_formula: exprFormula.expr_formula + calcButton.expr_formula,
        expr_formula_txt:
          exprFormula.expr_formula_txt + calcButton.expr_formula_txt,
      });
    },

    // テンキー[クリア]押下時の処理
    onclickClearButton: function (e) {
      this.setExprFormula({
        expr_formula: '',
        expr_formula_txt: '',
      });
    },

    // [キャンセル]押下時の処理
    onclickCancelButton: function (e) {
      this.clearError();
      this.$parentView.show();
      this.okProc();
      this.$el.html('');
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode();
    },

    // [確定]押下時の処理
    onclickCommitButton: function (e) {
      if (!this.validate()) {
        return;
      }
      this.$parentView.show();
      this.okProc(this.getData());
      this.$el.html('');
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode();
    },

    // 入力チェック
    validate: function () {
      this.clearError();
      var isValid = this.validator.valid();
      var dispitem = this.getDispitem();
      // 表示項目名
      if (_.contains(dispitem.name, '、')) {
        this.validator.setErrorMsg(
          $('#MDCMV0070_name'),
          '「、(読点)」は使用できません。'
        );
        isValid = false;
      }
      // 計算式
      if (!dispitem.expr_formula) {
        this.validator.setErrorMsg(
          $('#MDCMV0070_expr_formula_txt'),
          '計算式が指定されていません。'
        );
        $('#MDCMV0070_expr_formula_txt').css('border-color', '#f2555f');
        isValid = false;
      }
      if (!isValid) {
        this.validator.setErrorHeader(clmsg.cl_echoback);
      }
      return isValid;
    },

    // エラーをクリアする
    clearError: function () {
      this.validator.clear();
      $('#MDCMV0070_expr_formula_txt').css('border-color', '');
    },

    // 分類 getter
    getDispgroup: function () {
      return this.number($('#MDCMV0070_dispgroup').val());
    },

    // getter
    getData: function () {
      return {
        cond: this.getCond(),
      };
    },

    // 条件 getter
    getCond: function () {
      return {
        dispitem: this.getDispitem(),
      };
    },

    // 条件.表示項目 getter
    getDispitem: function () {
      var number = this.number;
      var exprFormula = this.getExprFormula();
      return {
        dispitem_id: number($('#MDCMV0070_dispitem_id').val()),
        name: $('#MDCMV0070_name').val() || '',
        expr_formula: exprFormula.expr_formula,
        expr_formula_txt: exprFormula.expr_formula_txt,
        expr_decpoint: number(
          $('#MDCMV0070_expr_decpoint').selectpicker('val')
        ),
      };
    },

    // 計算式 getter
    getExprFormula: function () {
      return {
        expr_formula: $('#MDCMV0070_expr_formula').val() || '',
        expr_formula_txt: $('#MDCMV0070_expr_formula_txt').val() || '',
      };
    },

    // Number(''), Number(null)等が0となるのは不都合なので、こちらを使う
    number: function (val = null, val0 = null) {
      return val === '' || _.isNull(val) ? val0 : Number(val);
    },
  });
});
