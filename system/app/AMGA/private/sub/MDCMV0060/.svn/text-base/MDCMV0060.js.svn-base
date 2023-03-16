$(function () {
  MDCMV0060SelectorView = Backbone.View.extend({
    screenId: 'MDCMV0060',
    validator: null,
    events: {
      'change [name=MDCMV0060_mode]:checked': 'onchangeMode', // モード(出力範囲 or 上位下位抽出)変更
      'change [name=MDCMV0060_disp_mode]:checked': 'onchangeDispMode', // モード(出力範囲)変更
      'change [name=MDCMV0060_pickup_mode]:checked': 'onchangePickupMode', // モード(上位下位抽出)変更
      'click #MDCMV0060_dispcolor_append_button':
        'onclickDispcolorAppendButton', // 表示色設定[追加]押下
      'change [name=MDCMV0060_from_val]': 'onchangeFromVal', // 表示色設定 from値変更
      'change [name=MDCMV0060_color]': 'onchangeColor', // 表示色設定 色変更
      'click .MDCMV0060_dispcolor_remove_button':
        'onclickDispcolorRemoveButton', // 表示色設定[削除]押下
      'click #MDCMV0060_cancel_button': 'onclickCancelButton', // [キャンセル]押下
      'click #MDCMV0060_commit_button': 'onclickCommitButton', // [確定]押下
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
      this.disprangeValidator = clutil.validator(
        $('#MDCMV0060_disprange_field'),
        {
          echoback: $('.cl_echoback'),
        }
      );
      this.dispcolorValidator = clutil.validator(
        $('#MDCMV0060_dispcolor_field'),
        {
          echoback: $('.cl_echoback'),
        }
      );
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode({
        view: this.$el,
      });
    },

    initUIelement: function () {
      clutil.inputlimiter(this.$el);
      clutil.initUIelement(this.$el);

      // 閾値設定(出力範囲)
      this.fDispRangeNotList = [
        {
          id: 0,
          name: '含む',
        },
        {
          id: 1,
          name: '含まない',
        },
      ];
      clutil.cltypeselector2(
        $('#MDCMV0060_f_disp_range_not'),
        this.fDispRangeNotList,
        0,
        1
      );
      this.dispValueTypeList = [
        {
          id: amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_DISP_TYPE_LT,
          name: '未満',
        },
        {
          id: amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_DISP_TYPE_LE,
          name: '以下',
        },
        {
          id: amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_DISP_TYPE_GT,
          name: 'より大きい',
        },
        {
          id: amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_DISP_TYPE_GE,
          name: '以上',
        },
        {
          id: amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_DISP_TYPE_EQ,
          name: 'と等しい',
        },
        {
          id: amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_DISP_TYPE_NE,
          name: 'と等しくない',
        },
      ];
      clutil.cltypeselector2(
        $('#MDCMV0060_disp_value_type'),
        this.dispValueTypeList,
        0,
        1
      );
      // 閾値設定(上位下位抽出)
      this.pickupValueTypeList = [
        {
          id: amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_PICKUP_VALUE_TYPE_HIGH,
          name: '上位',
        },
        {
          id: amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_PICKUP_VALUE_TYPE_LOW,
          name: '下位',
        },
      ];
      clutil.cltypeselector2(
        $('#MDCMV0060_pickup_value_type'),
        this.pickupValueTypeList,
        0,
        1
      );
      // 表示色設定
      this.colorList = _.map(clutil.color.samples, function (c) {
        return {
          id: c.name,
          name: '',
        };
      });
      // 計算項目追加設定
      this.stcalcList = [
        {
          id: 0,
          name: '指定しない',
        },
        {
          id: 1,
          name: '平均',
        },
        {
          id: 2,
          name: '中央値',
        },
        {
          id: 3,
          name: '最大値',
        },
        {
          id: 4,
          name: '最小値',
        },
        {
          id: 5,
          name: '分散',
        },
        {
          id: 6,
          name: '標準偏差値',
        },
      ];
      clutil.cltypeselector2($('#MDCMV0060_stcalc'), this.stcalcList, 0, 1);
      // 初期値
      this.setData();
    },

    // setter
    setData: function () {
      var cond = this.cond;
      this.setDispitem(cond.dispitem);
      this.setDisprange(cond.disprange);
      this.setDispcolorlist(cond.dispcolorlist);
    },

    // 表示項目 setter
    setDispitem: function (dispitem) {
      var number = this.number;
      var dispitem_id = number(dispitem.dispitem_id);
      $('#MDCMV0060_dispitem_id').val(dispitem_id);
      $('#MDCMV0060_name').val(dispitem.name || '');
      $('#MDCMV0060_stcalc').selectpicker('val', number(dispitem.stcalc));
    },

    // 値範囲制約 setter
    setDisprange: function (disprange) {
      if (_.isNull(disprange)) {
        this.controlDisprangeField();
        return;
      }
      var fMode = disprange.f_mode;
      this.setFMode(fMode);
      var number = this.number;
      switch (fMode) {
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_DISP_RANGE:
          $('#MDCMV0060_disp_range_min').val(number(disprange.disp_range_min));
          $('#MDCMV0060_disp_range_max').val(number(disprange.disp_range_max));
          $('#MDCMV0060_f_disp_range_not').selectpicker(
            'val',
            number(disprange.f_disp_range_not)
          );
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_DISP_VALUE:
          $('#MDCMV0060_disp_value_type').selectpicker(
            'val',
            number(disprange.disp_value_type)
          );
          $('#MDCMV0060_disp_value').val(number(disprange.disp_value));
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_RANGE:
          $('#MDCMV0060_pickup_range_min').val(
            number(disprange.pickup_range_min)
          );
          $('#MDCMV0060_pickup_range_max').val(
            number(disprange.pickup_range_max)
          );
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_VALUE:
          $('#MDCMV0060_pickup_value_type').selectpicker(
            'val',
            number(disprange.pickup_value_type)
          );
          $('#MDCMV0060_pickup_value').val(number(disprange.pickup_value));
          break;
      }
    },

    // モード setter
    setFMode: function (fMode) {
      switch (fMode) {
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_DISP_RANGE:
          $('[name=MDCMV0060_mode][value=disp]').radio('check');
          $('[name=MDCMV0060_disp_mode][value=range]').radio('check');
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_DISP_VALUE:
          $('[name=MDCMV0060_mode][value=disp]').radio('check');
          $('[name=MDCMV0060_disp_mode][value=value]').radio('check');
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_RANGE:
          $('[name=MDCMV0060_mode][value=pickup]').radio('check');
          $('[name=MDCMV0060_pickup_mode][value=range]').radio('check');
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_VALUE:
          $('[name=MDCMV0060_mode][value=pickup]').radio('check');
          $('[name=MDCMV0060_pickup_mode][value=value]').radio('check');
          break;
      }
      this.controlDisprangeField();
    },

    // 閾値設定の状態を制御する
    controlDisprangeField: function () {
      var $dispPane = $('#MDCMV0060_disp_pane');
      var $pickupPane = $('#MDCMV0060_pickup_pane');
      var $dispRangeInput = $('#MDCMV0060_disp_range_input');
      var $dispValueInput = $('#MDCMV0060_disp_value_input');
      var $pickupRangeInput = $('#MDCMV0060_pickup_range_input');
      var $pickupValueInput = $('#MDCMV0060_pickup_value_input');
      switch (this.getFMode()) {
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_DISP_RANGE:
          $dispPane.show();
          $pickupPane.hide();
          clutil.viewRemoveReadonly($dispRangeInput);
          clutil.viewReadonly($dispValueInput);
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_DISP_VALUE:
          $dispPane.show();
          $pickupPane.hide();
          clutil.viewReadonly($dispRangeInput);
          clutil.viewRemoveReadonly($dispValueInput);
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_RANGE:
          $dispPane.hide();
          $pickupPane.show();
          clutil.viewRemoveReadonly($pickupRangeInput);
          clutil.viewReadonly($pickupValueInput);
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_VALUE:
          $dispPane.hide();
          $pickupPane.show();
          clutil.viewReadonly($pickupRangeInput);
          clutil.viewRemoveReadonly($pickupValueInput);
          break;
      }
    },

    // 色分け条件リスト setter
    setDispcolorlist: function (dispcolorlist) {
      this.removeAllDispcolorRows();
      for (var dispcolor of dispcolorlist) {
        var $row = this.appendDispcolorRow();
        this.setDispcolor(dispcolor, $row);
      }
    },

    // 表示色設定 テーブル初期化
    removeAllDispcolorRows: function () {
      this.removeAllRows($('#MDCMV0060_dispcolor_tbody'));
    },

    // テーブル初期化
    removeAllRows: function ($tbody) {
      $tbody.children().remove();
    },

    // 表示色設定 行追加
    appendDispcolorRow: function () {
      return this.appendRow(
        $('#MDCMV0060_dispcolor_tbody'),
        $('#MDCMV0060_dispcolor_tbody_template'),
        _.bind(function ($row) {
          clutil.cltypeselector2(
            $row.find('[name=MDCMV0060_color]'),
            this.colorList,
            0,
            1
          );
          this.controlDispcolorRow();
        }, this)
      );
    },

    // テーブル 行追加
    appendRow: function ($tbody, $tbody_template, initializeRow) {
      $tbody_template.tmpl().appendTo($tbody);
      var $rowList = this.valuesTo$Object($tbody.children());
      var $row = $rowList[$rowList.length - 1];
      if (initializeRow) {
        initializeRow($row);
      }
      return $row;
    },

    // 表示色設定行の状態を制御する
    controlDispcolorRow: function () {
      var $rowList = this.valuesTo$Object(
        $('#MDCMV0060_dispcolor_tbody').children()
      );
      var len = $rowList.length;
      if (!len) {
        return;
      }
      var $row = $rowList[0];
      var $fromVal = $row.find('[name=MDCMV0060_from_val]');
      $fromVal.attr('disabled', true);
      $fromVal.removeClass('cl_required');
    },

    // 色分け条件 setter
    setDispcolor: function (dispcolor, $row) {
      var number = this.number;
      $row.find('[name=MDCMV0060_from_val]').val(number(dispcolor.from_val));
      $row.find('[name=MDCMV0060_to_val]').val(number(dispcolor.to_val));
      $row
        .find('[name=MDCMV0060_color]')
        .selectpicker('val', dispcolor.color || 'default');
    },

    // モード(出力範囲 or 上位下位抽出)変更時の処理
    onchangeMode: function (e) {
      this.controlDisprangeField();
    },

    // モード(出力範囲)変更時の処理
    onchangeDispMode: function (e) {
      this.controlDisprangeField();
    },

    // モード(上位下位抽出)変更時の処理
    onchangePickupMode: function (e) {
      this.controlDisprangeField();
    },

    // 表示色設定[追加]押下時の処理
    onclickDispcolorAppendButton: function (e) {
      this.appendDispcolorRow();
    },

    // 表示色設定 from値変更時の処理
    onchangeFromVal: function (e) {
      this.changeDispcolorVals();
    },

    // 表示色設定 to値を変更する
    changeDispcolorVals: function () {
      var dispcolorlist = this.getDispcolorlist();
      var $rowList = this.valuesTo$Object(
        $('#MDCMV0060_dispcolor_tbody').children()
      );
      var len = dispcolorlist.length;
      if (!len) {
        return;
      }
      var dispcolor = dispcolorlist[0];
      dispcolor.from_val = null;
      this.setDispcolor(dispcolor, $rowList[0]);
      for (var i = 1; i < len; i++) {
        var preDispcolor = dispcolorlist[i - 1];
        var dispcolor = dispcolorlist[i];
        preDispcolor.to_val = dispcolor.from_val;
        this.setDispcolor(preDispcolor, $rowList[i - 1]);
      }
      var dispcolor = dispcolorlist[len - 1];
      dispcolor.to_val = null;
      this.setDispcolor(dispcolor, $rowList[len - 1]);
    },

    // 表示色設定 色変更時の処理
    onchangeColor: function (e) {
      var $row = $(e.currentTarget.closest('.row'));
      var $fromVal = $row.find('[name=MDCMV0060_from_val]');
      var $toVal = $row.find('[name=MDCMV0060_to_val]');
      var $color = $row.find('[name=MDCMV0060_color]');
      var colorName = $color.val();
      clutil.color.applyColor(colorName, $fromVal, $toVal);

      var $btn = $color.data('selectpicker').button;
      var color = clutil.color.sampleMap[colorName];
      $btn.removeClass(clutil.color.cssClasses().join(' '));
      if (
        !_.isNull(color) &&
        (!_.isNull(color.bgcolor) || !_.isNull(color.fgcolor))
      ) {
        $btn.addClass(colorName);
      }
    },

    // 表示色設定[削除]押下時の処理
    onclickDispcolorRemoveButton: function (e) {
      this.removeDispcolorRow($(e.target.closest('.row')));
      this.controlDispcolorRow();
      this.changeDispcolorVals();
    },

    // 表示色設定 行削除
    removeDispcolorRow: function ($row) {
      this.removeRow($row);
    },

    // テーブル 行削除
    removeRow: function ($row) {
      $row.remove();
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
      var isValid = true;
      if (!this.validateDisprange()) {
        isValid = false;
      }
      if (!this.validateDispcolor()) {
        isValid = false;
      }
      // 初めのvalidatorのsetErrorHeaderが効かないことがあるので、ここで。。。
      if (!isValid) {
        this.dispcolorValidator.setErrorHeader(clmsg.cl_echoback);
      }
      return isValid;
    },

    // エラーをクリアする
    clearError: function () {
      this.disprangeValidator.clear();
      this.dispcolorValidator.clear();
    },

    // 閾値設定 入力チェック
    validateDisprange: function () {
      var validator = this.disprangeValidator;
      var isValid = validator.valid();
      if (!isValid) {
        return isValid;
      }
      var disprange = this.getDisprange();
      if (_.isNull(disprange)) {
        return isValid;
      }
      var maxNum = 999999999;
      switch (disprange.f_mode) {
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_DISP_RANGE:
          var disp_range_min = disprange.disp_range_min;
          var disp_range_max = disprange.disp_range_max;
          var re = RegExp(/^[0-9]+(\.[0-9]){0,1}?$/);
          var $dispRangeMin = $('#MDCMV0060_disp_range_min');
          var $dispRangeMax = $('#MDCMV0060_disp_range_max');
          if (!re.test(disp_range_min)) {
            validator.setErrorMsg(
              $dispRangeMin,
              '0以上の整数または小数点1桁の数値を入力してください。'
            );
            isValid = false;
          }
          if (disp_range_min > maxNum) {
            validator.setErrorMsg(
              $dispRangeMin,
              clutil.fmtargs(clmsg.cl_less_than_oreqlto, [maxNum])
            );
            isValid = false;
          }
          if (!re.test(disp_range_max)) {
            validator.setErrorMsg(
              $dispRangeMax,
              '0以上の整数または小数点1桁の数値を入力してください。'
            );
            isValid = false;
          }
          if (disp_range_max > maxNum) {
            validator.setErrorMsg(
              $dispRangeMax,
              clutil.fmtargs(clmsg.cl_less_than_oreqlto, [maxNum])
            );
            isValid = false;
          }
          if (
            isValid &&
            !validator.validFromToObj([
              {
                $stval: $dispRangeMin,
                $edval: $dispRangeMax,
              },
            ])
          ) {
            isValid = false;
          }
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_DISP_VALUE:
          var disp_value = disprange.disp_value;
          var re = RegExp(/^[0-9]+(\.[0-9]){0,1}?$/);
          var $dispValue = $('#MDCMV0060_disp_value');
          if (!re.test(disp_value)) {
            validator.setErrorMsg(
              $dispValue,
              '0以上の整数または小数点1桁の数値を入力してください。'
            );
            isValid = false;
          }
          if (disp_value > maxNum) {
            validator.setErrorMsg(
              $dispValue,
              clutil.fmtargs(clmsg.cl_less_than_oreqlto, [maxNum])
            );
            isValid = false;
          }
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_RANGE:
          var pickup_range_min = disprange.pickup_range_min;
          var pickup_range_max = disprange.pickup_range_max;
          var re = RegExp(/^[0-9]+$/);
          var $pickupRangeMin = $('#MDCMV0060_pickup_range_min');
          var $pickupRangeMax = $('#MDCMV0060_pickup_range_max');
          if (!re.test(pickup_range_min) || pickup_range_min < 1) {
            validator.setErrorMsg(
              $pickupRangeMin,
              '1以上の整数を入力してください。'
            );
            isValid = false;
          }
          if (pickup_range_min > maxNum) {
            validator.setErrorMsg(
              $pickupRangeMin,
              clutil.fmtargs(clmsg.cl_less_than_oreqlto, [maxNum])
            );
            isValid = false;
          }
          if (!re.test(pickup_range_max) || pickup_range_max < 1) {
            validator.setErrorMsg(
              $pickupRangeMax,
              '1以上の整数を入力してください。'
            );
            isValid = false;
          }
          if (pickup_range_max > maxNum) {
            validator.setErrorMsg(
              $pickupRangeMax,
              clutil.fmtargs(clmsg.cl_less_than_oreqlto, [maxNum])
            );
            isValid = false;
          }
          if (
            isValid &&
            !validator.validFromToObj([
              {
                $stval: $pickupRangeMin,
                $edval: $pickupRangeMax,
              },
            ])
          ) {
            isValid = false;
          }
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_VALUE:
          var pickup_value = disprange.pickup_value;
          var re = RegExp(/^[0-9]+$/);
          var $pickupValue = $('#MDCMV0060_pickup_value');
          if (!re.test(pickup_value) || pickup_value < 1) {
            validator.setErrorMsg(
              $pickupValue,
              '1以上の整数を入力してください。'
            );
            isValid = false;
          }
          if (pickup_value > maxNum) {
            validator.setErrorMsg(
              $pickupValue,
              clutil.fmtargs(clmsg.cl_less_than_oreqlto, [maxNum])
            );
            isValid = false;
          }
          break;
      }
      // if (!isValid) {
      //   validator.setErrorHeader(clmsg.cl_echoback);
      // }
      return isValid;
    },

    // 表示色設定 入力チェック
    validateDispcolor: function () {
      var validator = this.dispcolorValidator;
      var isValid = validator.valid();
      if (!isValid) {
        return isValid;
      }
      var dispcolorlist = this.getDispcolorlist();
      var $rowList = this.valuesTo$Object(
        $('#MDCMV0060_dispcolor_tbody').children()
      );
      var re = RegExp(/^[0-9]+(\.[0-9]){0,1}?$/);
      var maxNum = 999999999;
      var preRowIsValid = true;
      for (var i = 1; i < dispcolorlist.length; i++) {
        var rowIsValid = true;
        var dispcolor = dispcolorlist[i];
        var from_val = dispcolor.from_val;
        var $row = $rowList[i];
        var $fromVal = $row.find('[name=MDCMV0060_from_val]');
        if (!re.test(from_val)) {
          validator.setErrorMsg(
            $fromVal,
            '0以上の整数または小数点1桁の数値を入力してください。'
          );
          rowIsValid = false;
        }
        if (from_val > maxNum) {
          validator.setErrorMsg(
            $fromVal,
            clutil.fmtargs(clmsg.cl_less_than_oreqlto, [maxNum])
          );
          rowIsValid = false;
        }
        if (preRowIsValid && rowIsValid && i >= 2) {
          var preDispcolor = dispcolorlist[i - 1];
          var pre_from_val = preDispcolor.from_val;
          if (pre_from_val >= from_val) {
            validator.setErrorMsg(
              $fromVal,
              String(pre_from_val) + 'より大きい値を設定してください。'
            );
            rowIsValid = false;
          }
        }
        preRowIsValid = rowIsValid;
        isValid = isValid && rowIsValid;
      }
      // if (!isValid) {
      //   validator.setErrorHeader(clmsg.cl_echoback);
      // }
      return isValid;
    },

    // getter
    getData: function () {
      return {
        cond: {
          dispitem: this.getDispitem(),
          disprange: this.getDisprange(),
          dispcolorlist: this.getDispcolorlist(),
        },
      };
    },

    // 表示項目 getter
    getDispitem: function () {
      var number = this.number;
      return {
        dispitem_id: number($('#MDCMV0060_dispitem_id').val()),
        name: $('#MDCMV0060_name').val() || '',
        stcalc: number($('#MDCMV0060_stcalc').selectpicker('val')),
      };
    },

    // 値範囲制約 getter
    getDisprange: function () {
      var dispitem = this.getDispitem();
      var f_mode = this.getFMode();
      var data = {
        dispitem_id: dispitem.dispitem_id,
        f_mode: f_mode,
      };
      var number = this.number;
      switch (f_mode) {
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_DISP_RANGE:
          _.extend(data, {
            disp_range_min: number($('#MDCMV0060_disp_range_min').val()),
            disp_range_max: number($('#MDCMV0060_disp_range_max').val()),
            f_disp_range_not: number(
              $('#MDCMV0060_f_disp_range_not').selectpicker('val')
            ),
          });
          data =
            _.isNull(data.disp_range_min) && _.isNull(data.disp_range_max)
              ? null
              : data;
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_DISP_VALUE:
          _.extend(data, {
            disp_value_type: number(
              $('#MDCMV0060_disp_value_type').selectpicker('val')
            ),
            disp_value: number($('#MDCMV0060_disp_value').val()),
          });
          data = _.isNull(data.disp_value) ? null : data;
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_RANGE:
          _.extend(data, {
            pickup_range_min: number($('#MDCMV0060_pickup_range_min').val()),
            pickup_range_max: number($('#MDCMV0060_pickup_range_max').val()),
            f_pickup_range_not: 0,
          });
          data =
            _.isNull(data.pickup_range_min) && _.isNull(data.pickup_range_max)
              ? null
              : data;
          break;
        case amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_VALUE:
          _.extend(data, {
            pickup_value_type: number(
              $('#MDCMV0060_pickup_value_type').selectpicker('val')
            ),
            pickup_value: number($('#MDCMV0060_pickup_value').val()),
          });
          data = _.isNull(data.pickup_value) ? null : data;
          break;
      }
      return data;
    },

    // モード getter
    getFMode: function () {
      var activePane = $('[name=MDCMV0060_mode]:checked').val();
      switch (activePane) {
        case 'disp':
          var dispInputMode = $('[name=MDCMV0060_disp_mode]:checked').val();
          switch (dispInputMode) {
            case 'range':
              return amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_DISP_RANGE;
            case 'value':
              return amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_DISP_VALUE;
          }
        case 'pickup':
          var pickupInputMode = $('[name=MDCMV0060_pickup_mode]:checked').val();
          switch (pickupInputMode) {
            case 'range':
              return amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_RANGE;
            case 'value':
              return amgbp_AnaDispRange.AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_VALUE;
          }
      }
      return 0;
    },

    // 色分け条件リスト getter
    getDispcolorlist: function () {
      var dispitem = this.getDispitem();
      var dispitem_id = dispitem.dispitem_id;
      var number = this.number;
      return _.map(
        clutil.tableview2data($('#MDCMV0060_dispcolor_tbody').children()),
        function (viewData) {
          var color = _.find(clutil.color.samples, function (color) {
            return color.name == viewData.MDCMV0060_color;
          });
          return {
            dispitem_id: dispitem_id,
            from_val: number(viewData.MDCMV0060_from_val),
            to_val: number(viewData.MDCMV0060_to_val),
            color: color.name,
            fgcolor: color.fg,
            bgcolor: color.bg,
          };
        }
      );
    },

    // 配列の各要素をjQueryオブジェクト化する
    valuesTo$Object: function (list) {
      return _.map(list, function (value) {
        return $(value);
      });
    },

    // Number(''), Number(null)等が0となるのは不都合なので、こちらを使う
    number: function (val = null, val0 = null) {
      return val === '' || _.isNull(val) ? val0 : Number(val);
    },
  });
});
