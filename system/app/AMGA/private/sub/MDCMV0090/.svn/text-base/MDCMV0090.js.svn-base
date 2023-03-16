$(function () {
  MDCMV0090SelectorView = Backbone.View.extend({
    screenId: 'MDCMV0090',
    validator: null,

    mstitem_list: {},

    events: {
      'change #MDCMV0090_cond_grp': 'onchangeCondGrp', // 分類変更
      'click #MDCMV0090_axis_table tr': 'onclickAxisRow', // 軸 行押下
      'click #MDCMV0090_v_axis_table tr': 'onclickVAxisRow', // 縦軸 行押下
      'click #MDCMV0090_h_axis_table tr': 'onclickHAxisRow', // 横軸 行押下
      'click #MDCMV0090_v_axis_button': 'onclickVAxisButton', // [縦軸]押下
      'click #MDCMV0090_h_axis_button': 'onclickHAxisButton', // [横軸]押下
      'click #MDCMV0090_v_up_button': 'onclickVUpButton', // 縦軸[↑]押下
      'click #MDCMV0090_v_down_button': 'onclickVDownButton', // 縦軸[↓]押下
      'click #MDCMV0090_h_up_button': 'onclickHUpButton', // 横軸[↑]押下
      'click #MDCMV0090_h_down_button': 'onclickHDownButton', // 横軸[↓]押下
      'click #MDCMV0090_v_axis_remove_all_button':
        'onclickVAxisRemoveAllButton', // 縦軸[すべて削除]押下
      'click #MDCMV0090_h_axis_remove_all_button':
        'onclickHAxisRemoveAllButton', // 横軸[すべて削除]押下
      'click #MDCMV0090_mstitemlist_set_button': "_onAxisDispClick", // 表示項目設定押下
      'click .MDCMV0090_v_axis_remove_button': 'onclickVAxisRemoveButton', // 縦軸[×]押下
      'click .MDCMV0090_h_axis_remove_button': 'onclickHAxisRemoveButton', // 横軸[×]押下
      'click #MDCMV0090_cancel_button': 'onclickCancelButton', // [キャンセル]押下
      'click #MDCMV0090_commit_button': 'onclickCommitButton', // [確定]押下
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
      this.validator = clutil.validator($('#ca_MDCMV0090_main'), {
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
      this.condGrpSet = _.groupBy(
        _.map(
          _.where(this.anadata.cond_item_list, {
            f_axis: 1,
          }),
          function (condItem) {
            return _.extend(
              {
                kind: condItem.cond_kind,
                attr: condItem.cond_attr,
                name2: condItem.cond_grp,
              },
              condItem
            );
          }
        ),
        'cond_grp'
      );
      this.condGrpList = _.map(_.keys(this.condGrpSet), function (key) {
        return {
          id: key,
          name: key,
        };
      });
      clutil.cltypeselector2($('#MDCMV0090_cond_grp'), this.condGrpList, 0, 1);
      // 期間最終来店店舗期間
      clutil.datepicker($('#MDCMV0090_laststore_from'));
      clutil.datepicker($('#MDCMV0090_laststore_to'));
      // 初期値
      this.setData();

      // 表示属性選択補助画面
      this.MDCMV0090_MDCMV1370Selector = new MDCMV1370SelectorView({
    	el : this.$('#ca_MDCMV0090_MDCMV1370_dialog'),	// 配置場所
		$parentView		: this.$('#ca_MDCMV0090_main'),
		isAnalyse_mode	: this.isAnalyse_mode,			// 分析ユースかどうかフラグ？？？
//		ymd				: null,			// 検索日
		select_mode		: clutil.cl_single_select,	// 単一選択モード
		anadata			: this.anadata,			// anaProc に入れる予定。
		anaProc			: this.anaProc
      });
      this.MDCMV0090_MDCMV1370Selector.render();
    },

    // setter
    setData: function () {
      var axis_num = this.anadata.axis_num;
      var cond = this.anaProc.cond;
      this.setCondGrp();
      $('#MDCMV0090_v_axis_num').text(axis_num.v_axis_num);
      this.setVAxisList(cond.vAxisList);
      $('#MDCMV0090_h_axis_num').text(axis_num.h_axis_num);
      this.setHAxisList(cond.hAxisList);
//      $('#MDCMV0090_fzerosuppress').checkbox(
//        cond.vfzerosuppress && cond.hfzerosuppress ? 'check' : 'uncheck'
//      );
      $('#MDCMV0090_vfzerosuppress').checkbox(
    	cond.vfzerosuppress ? 'check' : 'uncheck'
      );
      $('#MDCMV0090_hfzerosuppress').checkbox(
    	cond.hfzerosuppress ? 'check' : 'uncheck'
      );
      // 連携された条件に表示属性が存在すればセットする
      if(cond.mstitem_list && cond.mstitem_list.v1) {
    	  this.setZAxisList(cond.mstitem_list.v1);
      }
      var focuslist = _.where(cond.focuslist, {
        kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_LASTSTORE,
      });
      if (focuslist.length) {
        var focus = _.first(focuslist);
        this.setDate($('#MDCMV0090_laststore_from'), focus.val);
        this.setDate($('#MDCMV0090_laststore_to'), focus.val2);
      }
      this.controlLaststore();
      this.controlMstItemList();
    },

    // 分類 setter
    setCondGrp: function () {
      this.changeAxisList();
    },

    // 軸リストを変更する
    changeAxisList: function () {
      this.setAxisList(this.condGrpSet[this.getCondGrp()]);
    },

    // 軸 setter
    setAxisList: function (axisList) {
      this.removeAllAxisRows();
      for (var axis of axisList) {
        var $row = this.appendAxisRow();
        this.setAxis(axis, $row);
      }
    },

    // 軸 行全削除
    removeAllAxisRows: function () {
      $('#MDCMV0090_axis_table tr').remove();
    },

    // 軸 行追加
    appendAxisRow: function () {
      return this.appendRow(
        $('#MDCMV0090_axis_tbody'),
        $('#MDCMV0090_axis_tbody_template')
      );
    },

    // 軸 行 setter
    setAxis: function (axis, $row) {
      $row.data('data', axis);
      $row.find('[name=MDCMV0090_name]').text(axis.name || '');
    },

    // 縦軸 setter
    setVAxisList: function (vAxisList) {
      this.removeAllVAxisRows();
      for (var vAxis of vAxisList) {
        var $row = this.appendVAxisRow();
        this.setVAxis(vAxis, $row);
      }
    },

    // 縦軸 行全削除
    removeAllVAxisRows: function () {
      $('#MDCMV0090_v_axis_table tr').remove();
    },

    // 縦軸 行追加
    appendVAxisRow: function () {
      return this.appendRow(
        $('#MDCMV0090_v_axis_tbody'),
        $('#MDCMV0090_v_axis_tbody_template')
      );
    },

    // 縦軸 行 setter
    setVAxis: function (vAxis, $row) {
      $row.data('data', vAxis);
      $row.find('[name=MDCMV0090_name]').text(vAxis.name || '');
    },

    // 横軸 setter
    setHAxisList: function (hAxisList) {
      this.removeAllHAxisRows();
      for (var hAxis of hAxisList) {
        var $row = this.appendHAxisRow();
        this.setHAxis(hAxis, $row);
      }
    },

    // 横軸 行全削除
    removeAllHAxisRows: function () {
      $('#MDCMV0090_h_axis_table tr').remove();
    },

    // 横軸 行追加
    appendHAxisRow: function () {
      return this.appendRow(
        $('#MDCMV0090_h_axis_tbody'),
        $('#MDCMV0090_h_axis_tbody_template')
      );
    },

    // 横軸 行 setter
    setHAxis: function (hAxis, $row) {
      $row.data('data', hAxis);
      $row.find('[name=MDCMV0090_name]').text(hAxis.name || '');
    },

    // 表示属性 setter
    setZAxisList: function (zAxisList) {
    	this.removeAllZAxisRows();
    	for (var zAxis of zAxisList) {
    		var $row = this.appendZAxisRow();
    		this.setZAxis(zAxis, $row);
    	}
    },

    // 表示属性 行全削除
    removeAllZAxisRows: function () {
    	$('#MDCMV0090_mstitemlist_table tr').remove();
    },

    // 表示属性 行追加
    appendZAxisRow: function () {
    	return this.appendRow(
    			$('#MDCMV0090_mstitemlist_tbody'),
    			$('#MDCMV0090_mstitemlist_tbody_template')
    	);
    },

    // 表示属性 行 setter
    setZAxis: function (zAxis, $row) {
    	$row.data('data', zAxis);
    	$row.find('[name=MDCMV0090_name]').text(zAxis.name || '');
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

    setDate: function ($date, date) {
      $date.val(clutil.dateFormat(date, 'yyyy/mm/dd'));
    },

    // 期間最終来店店舗期間の表示/非表示を制御する
    controlLaststore: function () {
      var $laststore = $('#MDCMV0090_laststore');
      if (
        _.where(_.union(this.getVAxisList(), this.getHAxisList()), {
          kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_LASTSTORE,
        }).length
      ) {
        $laststore.show();
      } else {
        $laststore.hide();
      }
    },

    // 表示属性の表示/非表示を制御する
    controlMstItemList: function () {
    	var $mstitemlist = $('#MDCMV0090_mstitemlist');
    	if (_.where(this.getVAxisList(), {kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEM}).length
    		|| _.where(this.getVAxisList(), {kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORSIZEITEM}).length
    		|| _.where(this.getVAxisList(), {kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORITEM}).length
    	) {
    		$mstitemlist.show();
    	} else {
    		$mstitemlist.hide();
    		this.removeAllZAxisRows();
    		this.mstitem_list = {};
    	}
    },

    // 分類変更時の処理
    onchangeCondGrp: function (e) {
      this.changeAxisList();
    },

    // 軸 行押下時の処理
    onclickAxisRow: function (e) {
      this.controlRowState(e);
    },

    // 縦軸 行押下時の処理
    onclickVAxisRow: function (e) {
      this.controlRowState(e);
    },

    // 横軸 行押下時の処理
    onclickHAxisRow: function (e) {
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

    // [縦軸]押下時の処理
    onclickVAxisButton: function (e) {
      this.addSelectedAxisToVAxis();
      this.controlLaststore();
      this.controlMstItemList();
    },

    // 選択された軸を縦軸に追加する
    addSelectedAxisToVAxis: function () {
      this.addSelectedAxis(
        this.getVAxisList(),
        this.anadata.axis_num.v_axis_num,
        this.appendVAxisRow,
        this.setVAxis
      );
    },

    // [横軸]押下時の処理
    onclickHAxisButton: function (e) {
      this.addSelectedAxisToHAxis();
      this.controlLaststore();
    },

    // 選択された軸を横軸に追加する
    addSelectedAxisToHAxis: function () {
      this.addSelectedAxis(
        this.getHAxisList(),
        this.anadata.axis_num.h_axis_num,
        this.appendHAxisRow,
        this.setHAxis
      );
    },

    // 選択された軸を追加する
    addSelectedAxis: function (
      addedAxisList,
      axis_num,
      appendAxisRow,
      setAxis
    ) {
      var unaddedAxisList = _.reject(
        this.getSelectedAxisList(),
        _.bind(function (selectedAxis) {
          if (selectedAxis.kind == amgbp_AnaDefs.AMGBA_DEFS_KIND_LASTSTORE) {
            return _.where(_.union(this.getVAxisList(), this.getHAxisList()), {
              kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_LASTSTORE,
            }).length;
          }
          return _.where(addedAxisList, {
            cond_grp: selectedAxis.cond_grp,
            cond_kind: selectedAxis.cond_kind,
            cond_attr: selectedAxis.cond_attr,
          }).length;
        }, this)
      );
      if (addedAxisList.length + unaddedAxisList.length > axis_num) {
        return;
      }
      for (var unaddedAxis of unaddedAxisList) {
        var $row = appendAxisRow();
        setAxis(unaddedAxis, $row);
      }
    },

    // 縦軸[↑]押下時の処理
    onclickVUpButton: function (e) {
      this.controlRowOrderUp($('#MDCMV0090_v_axis_table'));
    },

    // 縦軸[↓]押下時の処理
    onclickVDownButton: function (e) {
      this.controlRowOrderDown($('#MDCMV0090_v_axis_table'));
    },

    // 横軸[↑]押下時の処理
    onclickHUpButton: function (e) {
      this.controlRowOrderUp($('#MDCMV0090_h_axis_table'));
    },

    // 横軸[↓]押下時の処理
    onclickHDownButton: function (e) {
      this.controlRowOrderDown($('#MDCMV0090_h_axis_table'));
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

    // 縦軸[すべて削除]押下時の処理
    onclickVAxisRemoveAllButton: function (e) {
      this.removeAllVAxisRows();
      this.controlLaststore();
      this.controlMstItemList();
    },

    // 横軸[すべて削除]押下時の処理
    onclickHAxisRemoveAllButton: function (e) {
      this.removeAllHAxisRows();
      this.controlLaststore();
    },

    /**
	 * 表示属性選択ボタン押下
	 * @param e
	 */
	_onAxisDispClick: function(e) {
		console.log("CLICK:", e);
		var _this = this;

		if (this.isAnalyse_mode) {
			// 分析条件部分を閉じる
			clutil.closeCondition();
		}

		// 対象の軸を取得
		var axis = this.getVAxisList();
		var tgt = 0;

		if(_.where(axis, {kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORSIZEITEM,}).length) {
			tgt = axis.findIndex(v => v.kind === amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORSIZEITEM);
		} else if(_.where(axis, {kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORITEM,}).length) {
			tgt = axis.findIndex(v => v.kind === amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORITEM);
		} else if(_.where(axis, {kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEM,}).length) {
			tgt = axis.findIndex(v => v.kind === amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEM);
		} else {
			// ないはず
			;
		}

		var kind = axis[tgt].kind;
		var func_id = axis[tgt].func_id;
		var name = axis[tgt].name;

		this.mstitem_list = this.anaProc.cond.mstitem_list ? this.anaProc.cond.mstitem_list : {};
		var v1 = this.getZAxisList();
		this.mstitem_list.v1 = v1;

		// TODO サブ画面を表示
		this.MDCMV0090_MDCMV1370Selector.show(this.mstitem_list.v1, true, kind, func_id, name);	// TODO 選択済みリスト

		// TODO 戻ってきたときのコールバック設定
		this.MDCMV0090_MDCMV1370Selector.okProc = function(data) {
			console.log("okProc:", data);
			var txt = "";
			if (data != null) {
				_.each(data, function(item, i) {
					if (i != 0) {
						txt += ",";
					}
					txt += item.name;
				});
				var $input = _this.$("input.input_MDCMV0090_mastitem[v1]");
				$input.val(txt);

				for (var i = 0; i < data.length; i++) {
					var dispitem_id = Number(data[i].dispitem_id);
					data[i].dispitem_id = dispitem_id;
				}

				_this.mstitem_list.v1 = data;

				_this.setZAxisList(data);

				_this.anaProc.cond.mstitem_list = _this.mstitem_list;
			}
//			if(data != null && data.length > 0) {
//				_this.$('#ca_CACMV0030_orgname').val(data[0].code + ":" + data[0].name);
//				_this.$('#ca_CACMV0030_org_id').val(data[0].val);
//				_this.$('#ca_CACMV0030_func_id').val(data[0].func_id);
//			}
//			// ボタンにフォーカスする
//			$(e.target).focus();
		};

	},

    // 縦軸[×]押下時の処理
    onclickVAxisRemoveButton: function (e) {
      this.removeRow($(e.target.closest('tr')));
      this.controlLaststore();
      this.controlMstItemList();
    },

    // 横軸[×]押下時の処理
    onclickHAxisRemoveButton: function (e) {
      this.removeRow($(e.target.closest('tr')));
      this.controlLaststore();
    },

    // テーブル 行削除
    removeRow: function ($tr) {
      $tr.remove();
    },

    // [キャンセル]押下時の処理
    onclickCancelButton: function (e) {
      this.validator.clear();
      this.$parentView.show();
      this.okProc();
      this.$el.html('');
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode();
    },

    // [確定]押下時の処理
    onclickCommitButton: function (e) {
      this.validator.clear();
      this.$parentView.show();
      this.okProc(this.getData());
      this.$el.html('');
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode();
    },

    // 分類 getter
    getCondGrp: function () {
      return $('#MDCMV0090_cond_grp').val() || '';
    },

    // 選択された軸 getter
    getSelectedAxisList: function () {
      return _.map(
        this.valuesTo$Object($('#MDCMV0090_axis_table').find('tr.selected')),
        _.bind(function ($selectedAxis) {
          return this.getAxis($selectedAxis);
        }, this)
      );
    },

    // 軸 getter
    getAxis: function ($row) {
      return $row.data('data');
    },

    // getter
    getData: function () {
      return {
        cond: this.getCond(),
      };
    },

    // 条件 getter
    getCond: function () {
      var vAxisList = this.getVAxisList();
      var hAxisList = this.getHAxisList();
      var vfzerosuppress = Number($('#MDCMV0090_vfzerosuppress').get(0).checked);
      var hfzerosuppress = Number($('#MDCMV0090_hfzerosuppress').get(0).checked);
      // 対象の軸が設定されていれば表示属性を条件にセット
      var tgt_mstitem = 0;
      if(_.where(vAxisList, {kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEM,}).length) {
    	  tgt_mstitem++;
      } else if(_.where(vAxisList, {kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORSIZEITEM,}).length) {
    	  tgt_mstitem++;
      } else if(_.where(vAxisList, {kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORITEM,}).length) {
    	  tgt_mstitem++;
      }
      var mstitem_list = {};
      var v1 = this.getZAxisList();
      mstitem_list.v1 = v1;
      return {
        vAxisList: vAxisList,
        hAxisList: hAxisList,
        vfzerosuppress: vfzerosuppress,
        hfzerosuppress: hfzerosuppress,
        mstitem_list : tgt_mstitem > 0 ? mstitem_list : {},
        focuslist: _.where(_.union(vAxisList, hAxisList), {
          kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_LASTSTORE,
        }).length
          ? [
              {
                kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_LASTSTORE,
                val: this.getDate($('#MDCMV0090_laststore_from')),
                val2: this.getDate($('#MDCMV0090_laststore_to')),
                axis_only: 1,
              },
            ]
          : [],
      };
    },

    getDate: function ($date) {
      return clutil.dateFormat($date.datepicker('getDate'), 'yyyymmdd') || 0;
    },

    // 縦軸リスト getter
    getVAxisList: function () {
      return _.map(
        this.valuesTo$Object($('#MDCMV0090_v_axis_table tr')),
        _.bind(function ($row) {
          return this.getVAxis($row);
        }, this)
      );
    },

    // 縦軸 getter
    getVAxis: function ($row) {
      return $row.data('data');
    },

    // 横軸リスト getter
    getHAxisList: function () {
      return _.map(
        this.valuesTo$Object($('#MDCMV0090_h_axis_table tr')),
        _.bind(function ($row) {
          return this.getHAxis($row);
        }, this)
      );
    },

    // 横軸 getter
    getHAxis: function ($row) {
      return $row.data('data');
    },

    // 表示属性 getter
    getZAxisList: function ($row) {
    	return _.map(
    		this.valuesTo$Object($('#MDCMV0090_mstitemlist_table tr')),
    		_.bind(function ($row) {
    		return this.getZAxis($row);
    		}, this)
    	);
    },

    // 表示属性 getter
    getZAxis: function ($row) {
    	return $row.data('data');
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
