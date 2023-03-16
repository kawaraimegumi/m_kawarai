$(function () {
  MDCMV0050SelectorView = Backbone.View.extend({
    screenId: 'MDCMV0050',
    validator: null,
    events: {
      'change #MDCMV0050_dispgroup': 'onchangeDispgroup', // 分類変更
      'click #MDCMV0050_disp_item_table tr': 'onclickDispItemRow', // 表示項目 行押下
      'click #MDCMV0050_cond_table tr': 'onclickCondRow', // 条件 行押下
      'click .MDCMV0050_add_button': 'onclickAddButton', // 追加ボタン押下
      'click #MDCMV0050_up_button': 'onclickUpButton', // [↑]押下
      'click #MDCMV0050_down_button': 'onclickDownButton', // [↓]押下
      'click #MDCMV0050_plus_button': 'onclickPlusButton', // [+]押下
      'click #MDCMV0050_remove_all_button': 'onclickRemoveAllButton', // [すべて削除]押下
      'click .MDCMV0050_sort_button': 'onclickSortButton', // ソートボタン押下
      'click .MDCMV0050_gear_button': 'onclickGearButton', // 歯車ボタン押下
      'click .MDCMV0050_remove_button': 'onclickRemoveButton', // [×]押下
      'click #MDCMV0050_cancel_button': 'onclickCancelButton', // [キャンセル]押下
      'click #MDCMV0050_commit_button': 'onclickCommitButton', // [確定]押下
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
      this.validator = clutil.validator($('#ca_MDCMV0050_main'), {
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
      var dispgroupList = _.where(this.anadata.disp_item_list, {
        dispitem_id: 0,
      });
      clutil.cltypeselector2(
        $('#MDCMV0050_dispgroup'),
        dispgroupList,
        0,
        1,
        'dispgroup'
      );
      // [+]ボタン
      this.MDCMV0070Selector = new MDCMV0070SelectorView({
        el: $('#ca_MDCMV0050_MDCMV0070_dialog'),
        $parentView: $('#ca_MDCMV0050_main'),
        anadata: this.anadata,
        anaProc: this.anaProc,
      });
      this.MDCMV0070Selector.render();
      // 歯車ボタン
      this.MDCMV0060Selector = new MDCMV0060SelectorView({
        el: $('#ca_MDCMV0050_MDCMV0060_dialog'),
        $parentView: $('#ca_MDCMV0050_main'),
        anadata: this.anadata,
        anaProc: this.anaProc,
      });
      this.MDCMV0060Selector.render();
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
      this.setDispItemList(
        _.filter(
          this.anadata.disp_item_list,
          _.bind(function (dispItem) {
            return (
              dispItem.dispgroup == this.getDispgroup() &&
              dispItem.dispitem_id &&
              dispItem.sum_bitset
            );
          }, this)
        )
      );
    },

    // 表示項目 setter
    setDispItemList: function (dispItemList) {
      this.removeAllDispitemRows();
      for (var dispItem of dispItemList) {
        var $row = this.appendDispitemRow();
        this.setDispItem(dispItem, $row);
      }
      this.controlAddButtons();
    },

    // 表示項目 行全削除
    removeAllDispitemRows: function () {
      $('#MDCMV0050_disp_item_table tr').remove();
    },

    // 表示項目 行追加
    appendDispitemRow: function () {
      return this.appendRow(
        $('#MDCMV0050_disp_item_tbody'),
        $('#MDCMV0050_disp_item_tbody_template')
      );
    },

    // 表示項目 行 setter
    setDispItem: function (dispItem, $row) {
      $row.data('data', dispItem);
      $row.find('[name=MDCMV0050_name]').text(dispItem.name || '');
    },

    // 追加ボタンの状態を制御する
    controlAddButtons: function () {
      var $buttons = $('.MDCMV0050_add_button');
      $buttons.attr('disabled', false);
      var $buttonList = this.valuesTo$Object($buttons);
      var selectedDispItemList = this.getSelectedDispItemList();
      for (var selectedDispItem of selectedDispItemList) {
        for (var $button of $buttonList) {
          if (
            (selectedDispItem.sum_bitset &
              amgbp_AnaDefs[$button.attr('amgbp-AnaDefs')]) ==
            0
          ) {
            $button.attr('disabled', true);
          }
        }
      }
    },

    // 条件 setter
    setCond: function () {
      this.removeAllCondRows();
      var cond = this.anaProc.cond;
      for (var dispitem of cond.dispitemlist) {
        var $row = this.appendCondRow();
        var dispitem_id = dispitem.dispitem_id;
        this.setRowCond(
          {
            dispitem: dispitem,
            disprange:
              _.find(cond.disprangelist, function (disprange) {
                return disprange.dispitem_id == dispitem_id;
              }) || null,
            dispcolorlist: _.where(cond.dispcolorlist, {
              dispitem_id: dispitem_id,
            }),
            dispvsortkeylist: _.where(cond.dispvsortkeylist, {
              dispitem_id: dispitem_id,
            }),
          },
          $row
        );
      }
    },

    // 条件 行全削除
    removeAllCondRows: function () {
      $('#MDCMV0050_cond_table tr').remove();
    },

    // 条件 行追加
    appendCondRow: function () {
      return this.appendRow(
        $('#MDCMV0050_cond_tbody'),
        $('#MDCMV0050_cond_tbody_template')
      );
    },

    // 条件 行 setter
    setRowCond: function (rowCond, $row) {
      rowCond = _.extend(this.getRowCond($row), rowCond);
      $row.data('data', rowCond);
      $row.find('[name=MDCMV0050_name]').text(rowCond.dispitem.name || '');
      var dispvsortkeylist = rowCond.dispvsortkeylist;
      if (dispvsortkeylist.length) {
        var dispvsortkey = dispvsortkeylist[0];
        switch (dispvsortkey.order) {
          case amgbp_AnaSortKey.AMGBP_ANA_SORTKEY_ORDER_ASCENDING:
            $row.find('.asc').addClass('active');
            break;
          case amgbp_AnaSortKey.AMGBP_ANA_SORTKEY_ORDER_DESCENDING:
            $row.find('.dsc').addClass('active');
            break;
        }
      }
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

    // 分類変更時の処理
    onchangeDispgroup: function (e) {
      this.changeDispItemList();
    },

    // 表示項目 行押下
    onclickDispItemRow: function (e) {
      this.controlRowState(e);
      this.controlAddButtons();
    },

    // 条件 行押下
    onclickCondRow: function (e) {
      this.controlRowState(e);
    },

    // 行の選択状態を制御する
    controlRowState: function (e) {
      var $row = $(e.target).closest('tr');
      var $table = $row.closest('table');
      var index = this.number($row.index());
      if (e.shiftKey) {
        if (this.$shiftTable) {
          var tableID = $table.get(0).id;
          var shiftTableID = this.$shiftTable.get(0).id;
          if (tableID == shiftTableID) {
            interval = [index, this.shiftIndex].sort();
            var start = interval[0];
            var end = interval[1];
            var $rowList = this.valuesTo$Object($table.find('tr'));
            for (var i = start; i <= end; i++) {
              $rowList[i].addClass('selected');
            }
          }
        }
      } else if (e.ctrlKey) {
        if ($row.hasClass('selected')) {
          $row.removeClass('selected');
        } else {
          $row.addClass('selected');
        }
      } else {
        $table.find('tr.selected').removeClass('selected');
        $row.addClass('selected');
      }
      this.$shiftTable = $table;
      this.shiftIndex = index;
    },

    // 追加ボタン押下時の処理
    onclickAddButton: function (e) {
      this.addSelectedDispItem($(e.target).closest('button'));
    },

    // 選択された表示項目を条件に追加する
    addSelectedDispItem: function ($button) {
      var amgbpAnaDispItemDefs = $button.attr('amgbp-AnaDispItemDefs');
      var buttonName = $button.html();
      var unaddedDispItemList = _.reject(
        _.map(this.getSelectedDispItemList(), function (selectedDispItem) {
          return {
            dispitem_id:
              (selectedDispItem.dispitem_id &
                ~amgbp_AnaDispItemDefs.AMGBA_DI_S_MASK) |
              amgbp_AnaDispItemDefs[amgbpAnaDispItemDefs],
            name: selectedDispItem.name + buttonName,
          };
        }),
        _.bind(function (selectedDispItem) {
          return _.where(this.getCond().dispitemlist, {
            dispitem_id: selectedDispItem.dispitem_id,
          }).length;
        }, this)
      );
      for (unaddedDispItem of unaddedDispItemList) {
        var $row = this.appendCondRow();
        this.setRowCond(
          {
            dispitem: unaddedDispItem,
          },
          $row
        );
      }
    },

    // [↑]押下時の処理
    onclickUpButton: function (e) {
      this.controlRowOrderUp($('#MDCMV0050_cond_table'));
    },

    // [↑]押下時の行の順番を制御する
    controlRowOrderUp: function ($table) {
      this.controlRowOrder(
        this.valuesTo$Object($table.find('tr.selected')),
        this.valuesTo$Object($table.find('tr')),
        function ($selectedRow, $upUnselectedRow) {
          return $selectedRow.insertBefore($upUnselectedRow);
        }
      );
    },

    // [↓]押下時の処理
    onclickDownButton: function (e) {
      this.controlRowOrderDown($('#MDCMV0050_cond_table'));
    },

    // [↓]押下時の行の順番を制御する
    controlRowOrderDown: function ($table) {
      this.controlRowOrder(
        this.valuesTo$Object($table.find('tr.selected')).reverse(),
        this.valuesTo$Object($table.find('tr')).reverse(),
        function ($selectedRow, $upUnselectedRow) {
          return $selectedRow.insertAfter($upUnselectedRow);
        }
      );
    },

    // 行の順番を制御する
    controlRowOrder: function ($selectedRowList, $rowList, insert) {
      if (!$selectedRowList.length) {
        return;
      }
      var $upUnselectedRow = null;
      for (var $row of $rowList) {
        if ($row.hasClass('selected')) {
          break;
        }
        $upUnselectedRow = $row;
      }
      if (_.isNull($upUnselectedRow)) {
        for (var $row of $rowList) {
          if (!$row.hasClass('selected')) {
            $upUnselectedRow = $row;
            break;
          }
        }
      }
      if (_.isNull($upUnselectedRow)) {
        return;
      }
      for (var $selectedRow of $selectedRowList) {
        insert($selectedRow, $upUnselectedRow).show();
      }
    },

    // [+]押下時の処理
    onclickPlusButton: function (e) {
      if (this.isAnalyse_mode) {
        clutil.closeCondition();
      }
      this.MDCMV0070Selector.cond = {
        dispitem: {
          dispitem_id: this.getNewDispitemID(),
        },
      };
      this.MDCMV0070Selector.okProc = _.bind(function (data) {
        if (!data) {
          return;
        }
        var $row = this.appendCondRow();
        this.setRowCond(data.cond, $row);
      }, this);
      this.MDCMV0070Selector.show(true);
    },

    // 表示項目追加用のID getter
    getNewDispitemID: function () {
      return (
        _.reduce(
          _.union(this.anaProc.cond.dispitemlist, this.getCond().dispitemlist),
          function (memo, dispitem) {
            var dispitem_id = dispitem.dispitem_id;
            return dispitem_id < amgbp_AnaDispItemDefs.AMGBA_DI_T_MSTITEM
              ? _.max([memo, dispitem_id])
              : memo;
          },
          amgbp_AnaDispItemDefs.AMGBA_DI_T_EXPRITEM
        ) + 1
      );
    },

    // [すべて削除]押下時の処理
    onclickRemoveAllButton: function () {
      this.removeAllCondRows();
    },

    // ソートボタン押下時の処理
    onclickSortButton: function (e) {
      $('.MDCMV0050_sort_button').removeClass('active');
      var $sortButton = $(e.target).closest('.MDCMV0050_sort_button');
      if (!$sortButton.hasClass('active')) {
        $sortButton.addClass('active');
      }
    },

    // 歯車ボタン押下時の処理
    onclickGearButton: function (e) {
      if (this.isAnalyse_mode) {
        clutil.closeCondition();
      }
      var $row = $(e.target.closest('tr'));
      var cond = this.getRowCond($row);
      var selector = cond.dispitem.expr_formula
        ? this.MDCMV0070Selector
        : this.MDCMV0060Selector;
      selector.cond = cond;
      selector.okProc = _.bind(function (data) {
        if (!data) {
          return;
        }
        this.setRowCond(data.cond, $row);
      }, this);
      selector.show(true);
    },

    // [×]押下時の処理
    onclickRemoveButton: function (e) {
      this.removeRow($(e.target.closest('tr')));
    },

    // テーブル 行削除
    removeRow: function ($row) {
      $row.remove();
    },

    // [キャンセル]押下時の処理
    onclickCancelButton: function () {
      this.validator.clear();
      this.$parentView.show();
      this.okProc();
      this.$el.html('');
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode();
    },

    // [確定]押下時の処理
    onclickCommitButton: function () {
      this.validator.clear();
      this.$parentView.show();
      this.okProc(this.getData());
      this.$el.html('');
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode();
    },

    // 分類 getter
    getDispgroup: function () {
      return this.number($('#MDCMV0050_dispgroup').val());
    },

    // 選択された表示項目 getter
    getSelectedDispItemList: function () {
      return _.map(
        this.valuesTo$Object(
          $('#MDCMV0050_disp_item_table').find('tr.selected')
        ),
        function ($selectedDispItemRow) {
          return $selectedDispItemRow.data('data');
        }
      );
    },

    // getter
    getData: function () {
      return {
        cond: this.getCond(),
      };
    },

    // 条件 getter
    getCond: function () {
      var $rowList = this.valuesTo$Object($('#MDCMV0050_cond_table tr'));
      return {
        dispitemlist: _.map(
          $rowList,
          _.bind(function ($row) {
            return this.getRowCond($row).dispitem;
          }, this)
        ),
        disprangelist: _.without(
          _.map(
            $rowList,
            _.bind(function ($row) {
              return this.getRowCond($row).disprange;
            }, this)
          ),
          null
        ),
        dispcolorlist: _.reduce(
          $rowList,
          _.bind(function (memo, $row) {
            return memo.concat(this.getRowCond($row).dispcolorlist);
          }, this),
          []
        ),
        dispvsortkeylist: _.without(
          _.map(
            $rowList,
            _.bind(function ($row) {
              var $sortButtons = $row.find('.MDCMV0050_sort_button');
              return $sortButtons.hasClass('active')
                ? {
                    idx: 0,
                    dispitem_id: this.getRowCond($row).dispitem.dispitem_id,
                    order: $sortButtons.filter('.active').hasClass('asc')
                      ? amgbp_AnaSortKey.AMGBP_ANA_SORTKEY_ORDER_ASCENDING
                      : amgbp_AnaSortKey.AMGBP_ANA_SORTKEY_ORDER_DESCENDING,
                  }
                : null;
            }, this)
          ),
          null
        ),
      };
    },

    // 条件 行 getter
    getRowCond: function ($row) {
      return _.extend(
        {
          dispitem: null,
          disprange: null,
          dispcolorlist: [],
          dispvsortkeylist: [],
        },
        $row.data('data')
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
