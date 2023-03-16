$(function () {
  AMPAV0080SelectorView = Backbone.View.extend({
    screenId: 'AMPAV0080',
    categoryId: 'AMPA',
    validator: null,
    events: {
      'click #AMPAV0080_clear_button': 'onclickClearButton', // [クリア]押下
      'click #AMPAV0080_search_button': 'onclickSearchButton', // [検索]押下
      'click #searchAgain': 'onclickSearchAgainButton', // [検索条件を再指定]押下
      'click #AMPAV0080_add_button': 'onclickAddButton', // [チェックしたものを選択内容に追加]押下
      'click #AMPAV0080_remove_all_button': 'onclickRemoveAllButton', // [すべて削除]押下
      'click .AMPAV0080_remove_button': 'onclickRemoveButton', // [×]押下
      'click #AMPAV0080_cancel_button': 'onclickCancelButton', // [キャンセル]押下
      'click #AMPAV0080_commit_button': 'onclickCommitButton', // [確定]押下
    },

    initialize: function (opt) {
      var defaults = {
        search_date: clcom.ope_date,
        select_mode: clutil.cl_single_select,
      };
      var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt, defaults);
      _.extend(this, fixedOpt);
      _.bindAll(this);
    },

    render: function () {
      clutil.loadHtml(
        clcom.urlRoot +
          '/system/app/' +
          this.categoryId +
          '/' +
          this.screenId +
          '/' +
          this.screenId +
          '.html',
        _.bind(function (data) {
          this.html_source = data;
        }, this)
      );
      return this;
    },

    show: function (isSubDialog) {
      if (!isSubDialog) {
        $('.cl_dialog').empty();
      }
      this.$parentView.hide();
      this.$el.html(this.html_source);
      this.initUIelement();
      $('.cl_echoback').hide();
      this.validator = clutil.validator($('#ca_AMPAV0080_main'), {
        echoback: $('.cl_echoback'),
      });
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode({
        view: this.$el,
      });

      if (this.addtoSelected) {
        this.addtoSelected.right_side_hide();
      }
      $('body').scrollTop(0).scrollLeft(0);
    },

    initUIelement: function () {
      clutil.inputlimiter(this.$el);
      clutil.initUIelement(this.$el);

      // 機能区分
      clutil.cltypeselector3({
        $select: $('#AMPAV0080_type'),
        list: [
          {
            id: amcm_type.AMCM_VAL_FORM_FUNC_MD_NEWANA,
            name: 'MDカタログ',
          },
          {
            id: amcm_type.AMCM_VAL_FORM_FUNC_MD_FORM,
            name: 'MD帳票',
          },
          {
            id: amcm_type.AMCM_VAL_FORM_FUNC_CUST_ANA,
            name: '顧客カタログ',
          },
        ],
        unselectedflag: false,
      });
      // 更新日
      clutil.datepicker($('#AMPAV0080_upd_date'));

      $('#mainColumninBox').addClass('noLeftColumn');
      $('#mainColumnFooter').addClass('noLeftColumn');
      if (this.select_mode == clutil.cl_single_select) {
        $('.AMPAV0080_multi').remove();
        $('#AMPAV0080_chkall').remove();
      }
      $('#innerScroll').perfectScrollbar();
      this.chkall = clutil.checkallbox(
        $('#AMPAV0080_chkall'),
        $('#AMPAV0080_func_table'),
        $('#AMPAV0080_func_tbody')
      );
      if (this.select_mode != clutil.cl_single_select) {
        this.addtoSelected = clutil.addtoSelected(
          $('#AMPAV0080_add_button'),
          $('#selected'),
          $('#mainColumn')
        );
      }
      this.srchArea = clutil.controlSrchArea(
        $('#AMPAV0080_searchArea'),
        $('#AMPAV0080_search_button'),
        $('#result'),
        $('#searchAgain')
      );
    },

    // [クリア]押下時の処理
    onclickClearButton: function () {
      this.clearCond();
    },

    // 条件部クリア処理
    clearCond: function () {
      this.validator.clear();
      clutil.viewClear($('#AMPAV0080_searchArea'), false);
      clutil.data2view(
        $('#AMPAV0080_searchArea'),
        {
          type: [],
          name: '',
          upd_user: '',
          upd_date: 0,
        },
        'AMPAV0080_'
      );
    },

    // [検索]押下時の処理
    onclickSearchButton: function () {
      if (!this.validate()) {
        return;
      }
      this.search(1, clcom.itemsOnPage);
    },

    // 入力チェック
    validate: function () {
      var isValid = true;
      if (!this.validator.valid()) {
        isValid = false;
      }
      return isValid;
    },

    // [検索条件を再指定]押下時の処理
    onclickSearchAgainButton: function () {
      this.srchArea.show_srch();
    },

    // [チェックしたものを選択内容に追加]押下時の処理
    onclickAddButton: function () {
      if (this.addtoSelected.right_side()) {
        return;
      }
      this.addCheckedFunc();
    },

    // チェックされた帳票作成機能を追加する
    addCheckedFunc: function () {
      var addedFuncList = this.getSelectedFuncList();
      var unaddedFuncList = _.reject(
        this.getCheckedFuncList(),
        function (checkedFunc) {
          return _.where(addedFuncList, {
            typeID: checkedFunc.typeID,
            id: checkedFunc.id,
          }).length;
        }
      );
      if (addedFuncList.length + unaddedFuncList.length > clcom.list_max) {
        this.validator.setErrorInfo({
          _eb_: clutil.fmtargs(clmsg.number_overflow, [clcom.list_max]),
        });
        return;
      }
      this.setSelectedFuncList(unaddedFuncList);
      this.chkall.init();
    },

    // 選択された帳票作成機能 setter
    setSelectedFuncList: function (selectedFuncList) {
      for (var selectedFunc of selectedFuncList) {
        var row = $('#AMPAV0080_selected_func_template')
          .tmpl(selectedFunc)
          .appendTo($('#AMPAV0080_selected_func_table'));
        $(row).data('data', selectedFunc);
      }
    },

    // [すべて削除]押下時の処理
    onclickRemoveAllButton: function () {
      this.removeAllSelectedFuncRows();
    },

    // 選択された帳票作成機能 行全削除
    removeAllSelectedFuncRows: function () {
      $('#AMPAV0080_selected_func_table').empty();
    },

    // [×]押下時の処理
    onclickRemoveButton: function (e) {
      this.removeSelectedFuncRow($(e.target).closest('li'));
    },

    // 選択された帳票作成機能 行削除
    removeSelectedFuncRow: function ($row) {
      $row.fadeOut(300).queue(function () {
        this.remove();
      });
      $('#AMPAV0080_add_button').focus();
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

    // 検索リクエスト getter
    getReq: function (pageNumber, itemsOnPage) {
      var viewData = clutil.view2data($('#AMPAV0080_searchArea'), 'AMPAV0080_');
      return {
        reqPage: {
          start_record: itemsOnPage * (pageNumber - 1),
          page_size: itemsOnPage,
        },
        AMPAV0080GetReq: {
          cond: {
            typeIDList: _.map(viewData.type || [], function (type) {
              return Number(type);
            }),
            name: clutil.han2zen(viewData.name || ''),
            updUserName: clutil.han2zen(viewData.upd_user || ''),
            updDate: viewData.upd_date || 0,
          },
        },
      };
    },

    // 検索処理
    search: function (pageNumber, itemsOnPage, isPager) {
      this.clearResult(itemsOnPage);
      clutil.postJSON(
        this.screenId,
        this.getReq(pageNumber, itemsOnPage),
        _.bind(function (data, dataType) {
          var expanderPromise = null;
          if (
            data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK
          ) {
            var funcList = data.AMPAV0080GetRsp.funcList;
            if (!funcList || !funcList.length) {
              this.validator.setErrorInfo({
                _eb_: clmsg.cl_no_data,
              });
              $('#result').show();
            } else {
              this.setFuncList(funcList);
              clutil.initUIelement($('#AMPAV0080_func_table'));
              if (!isPager) {
                expanderPromise = this.srchArea.show_result();
                $('.fieldUnitsHidden').hide();
                $('.expand').show();
                $('.unexpand').hide();
              }
              var totalRec = data.rspPage.total_record;
              this.setPagers(pageNumber, itemsOnPage, totalRec);
            }
          } else {
            this.validator.setErrorInfo({
              _eb_: clutil.fmtargs(
                clutil.getclmsg(data.rspHead.message),
                data.rspHead.args
              ),
            });
          }
          var focusSetting = _.bind(function () {
            if ($('#searchAgain').css('display') == 'none') {
              $('#AMPAV0080_search_button').focus();
            } else {
              $('#AMPAV0080_add_button').focus();
            }
          }, this);
          if (expanderPromise) {
            expanderPromise.done(focusSetting);
          } else {
            focusSetting();
          }
        }, this)
      );
    },

    // 結果部クリア処理
    clearResult: function (itemsOnPage) {
      this.validator.clear();
      this.setPagers(1, itemsOnPage || clcom.itemsOnPage, 0);
      this.removeAllFuncRows();
    },

    // 全ページャー
    setPagers: function (pageNumber, itemsOnPage, totalCount) {
      this.setPager(
        pageNumber,
        itemsOnPage,
        totalCount,
        $('#AMPAV0080_pager_1'),
        $('#AMPAV0080_pager_1_displaypanel')
      );
      this.setPager(
        pageNumber,
        itemsOnPage,
        totalCount,
        $('#AMPAV0080_pager_2'),
        $('#AMPAV0080_pager_2_displaypanel')
      );
    },

    // ページャー
    setPager: function (
      pageNumber,
      itemsOnPage,
      totalCount,
      pager,
      displaypanel
    ) {
      pager.pagination({
        items: totalCount,
        itemsOnPage: itemsOnPage,
        currentPage: pageNumber,
        displaypanel: displaypanel,
        onSelectChange: _.bind(function (itemsOnPage) {
          this.search(1, itemsOnPage, true);
        }, this),
        onPageClick: _.bind(function (pageNumber, itemsOnPage) {
          this.search(pageNumber, itemsOnPage, true);
        }, this),
        onSelectChangeBefore: function (e) {
          e.commit = _.bind(function () {
            // e.commit.call(e);
            this.onSelectChange(e.itemsOnPage);
          }, this);
        },
      });
    },

    // 帳票作成機能 行全削除
    removeAllFuncRows: function () {
      $('#AMPAV0080_func_tbody').empty();
    },

    // 帳票作成機能 setter
    setFuncList: function (funcList) {
      this.removeAllFuncRows();
      switch (this.select_mode) {
        case clutil.cl_single_select:
          var $select_template = $('#AMPAV0080_func_template_single');
          break;
        case clutil.cl_multiple_select:
          var $select_template = $('#AMPAV0080_func_template_multiple');
          break;
      }
      for (var func of funcList) {
        var row = $select_template.tmpl(func).appendTo('#AMPAV0080_func_tbody');
        $(row).data('data', func);
      }
    },

    // getter
    getData: function () {
      switch (this.select_mode) {
        case clutil.cl_single_select:
          var funcList = this.getCheckedFuncList();
          break;
        case clutil.cl_multiple_select:
          var funcList = this.getSelectedFuncList();
          break;
      }
      return {
        funcList: funcList,
      };
    },

    // チェックされた帳票作成機能 getter
    getCheckedFuncList: function () {
      return _.map(
        this.valuesTo$Object(
          $('#AMPAV0080_func_tbody').find('[name=AMPAV0080_chk]:checked')
        ),
        function ($row) {
          return $row.closest('tr').data('data');
        }
      );
    },

    // 選択された帳票作成機能 getter
    getSelectedFuncList: function () {
      return _.map(
        this.valuesTo$Object($('#AMPAV0080_selected_func_table li')),
        function ($row) {
          return $row.data('data');
        }
      );
    },

    // 配列の各要素をjQueryオブジェクト化する
    valuesTo$Object: function (list) {
      return _.map(list, function (value) {
        return $(value);
      });
    },
  });
});
