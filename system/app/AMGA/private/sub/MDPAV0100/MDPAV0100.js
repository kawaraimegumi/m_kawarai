$(function () {
  //////////////////////////////////////////////
  // View
  MDPAV0100PanelView = Backbone.View.extend({
    id: 'ca_MDPAV0100_view',
    tagName: 'table',
    className: 'tree mrgb10',
    template: _.template(
      '' +
        '<tr id="ca_MDPAV0100_showbuttons">' +
        '<th colspan="2"><span class="treeClose ca_MDPAV0100_tree"></span>会員' +
        '<label class="checkbox ca_MDPAV0100_custall" for="ca_MDPAV0100_custall_chk">' +
        '<input type="checkbox" class="ca_MDPAV0100_custall" id="ca_MDPAV0100_custall_chk" data-toggle="checkbox">全顧客' +
        '</label>' +
        '</th>' +
        '</tr>'
    ),

    // 押下イベント
    events: {},

    filter_ADDR: {
      kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_ADDR,
    },
    filter_ADDRLIST: {
      kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_ADDRLIST,
    },
    filter_MEMBLIST: {
      kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_MEMBLIST,
    },
    filter_MEMBATTR: {
      kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_MEMBATTR,
    },
    panelId: 'MDPAV0100',

    // 保存用条件リスト
    condList: {},

    initialize: function (opt) {
      var defaults = {
        disableMemb: false, // 全顧客指定不可能フラグ
      };
      var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt, defaults);
      _.extend(this, fixedOpt);
      _.bindAll(this);

      //			// Lv2: 年代のメニューアイテム
      //			this.navCACMV0100View = new AnaNaviItemView({
      //				title: '年代'
      //			}).on('onNaviItemClick', this.navItemCACMV0100Click);

      // Lv2: 住所のメニューアイテム
      this.navMDCMV0110View = new AnaNaviItemView({
        title: '住所',
        tr: { id: 'ca_navItemMDCMV0110' },
      }).on('onNaviItemClick', this.navItemMDCMV0110Click);

      // Lv2: 住所リストのメニューアイテム
      // this.navCACMV0120View = new AnaNaviItemView({
      //   title: '住所リスト',
      //   tr: { id: 'ca_navItemCACMV0120' },
      // }).on('onNaviItemClick', this.navItemCACMV0120Click);

      // Lv2: 会員リストのメニューアイテム
      this.navMDCMV0120View = new AnaNaviItemView({
        title: '会員リスト',
        tr: { id: 'ca_navItemMDCMV0120' },
      }).on('onNaviItemClick', this.navItemMDCMV0120Click);

      // Lv2: 会員属性のメニューアイテム
      this.navMDCMV0130View = new AnaNaviItemView({
        title: '会員属性',
        tr: { id: 'ca_navItemMDCMV0130' },
      }).on('onNaviItemClick', this.navItemMDCMV0130Click);

      //			// Lv2: 会員のメニューアイテム
      //			this.navCACMV0150View = new AnaNaviItemView({
      //				title: '会員'
      //			}).on('onNaviItemClick', this.navItemCACMV0150Click);

      // -----------------------------
      // 各セレクタView

      //			// 年代選択画面
      //			this.CACMV0100Selector = new CACMV0100SelectorView({
      //				el : $('#ca_CACMV0100_dialog'),	// 配置場所
      //				$parentView		: this.$parentView,
      ////				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
      ////				ymd				: null,			// 検索日
      ////				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
      //				anaProc			: this.anaProc
      //			});

      // 住所選択画面
      this.MDCMV0110Selector = new MDCMV0110SelectorView({
        el: $('#ca_MDCMV0110_dialog'), // 配置場所
        $parentView: this.$parentView,
        //				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
        //				ymd				: null,			// 検索日
        select_mode: clutil.cl_multiple_select, // 複数選択モード
        anaProc: this.anaProc,
      });

      // 住所リスト選択画面
      // this.CACMV0120Selector = new CACMV0120SelectorView({
      //   el: $('#ca_CACMV0120_dialog'), // 配置場所
      //   $parentView: this.$parentView,
      //   //				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
      //   //				ymd				: null,			// 検索日
      //   select_mode: clutil.cl_multiple_select, // 複数選択モード
      //   anaProc: this.anaProc,
      // });

      // 会員リスト選択画面
      this.MDCMV0120Selector = new MDCMV0120SelectorView({
        el: $('#ca_MDCMV0120_dialog'), // 配置場所
        $parentView: this.$parentView,
        //				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
        //				ymd				: null,			// 検索日
        select_mode: clutil.cl_multiple_select, // 複数選択モード
        anaProc: this.anaProc,
      });

      // 会員属性選択画面
      this.MDCMV0130Selector = new MDCMV0130SelectorView({
        el: $('#ca_MDCMV0130_dialog'), // 配置場所
        $parentView: this.$parentView,
        //				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
        //				ymd				: null,			// 検索日
        select_mode: clutil.cl_multiple_select, // 複数選択モード
        anaProc: this.anaProc,
      });

      //			// 会員選択画面
      //			this.CACMV0150Selector = new CACMV0150SelectorView({
      //				el : $('#ca_CACMV0150_dialog'),	// 配置場所
      //				$parentView	: this.$parentView,
      ////				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
      ////				ymd				: null,			// 検索日
      //				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
      //				anaProc			: this.anaProc
      //			});

      // -----------------------------
      // イベントハンドリング
      if (this.anaProc) {
        this.anaProc.on('onCondReset', this.onCondReset); // 「条件をクリア」イベントを捕捉する
        this.anaProc.on('onCondUpdated', this.onCondUpdated); // 「確定」イベントを捕捉する
      }
    },

    /**
     * 画面描写
     */
    render: function () {
      this.$el.html(this.template());
      this.$view.append(this.$el);

      // 会員ボタン群
      $('#ca_MDPAV0100_view')
        //			.append(this.navCACMV0100View.render().$el)
        .append(this.navMDCMV0110View.render().$el)
        // .append(this.navCACMV0120View.render().$el)
        .append(this.navMDCMV0120View.render().$el)
        .append(this.navMDCMV0130View.render().$el);
      //			.append(this.navCACMV0150View.render().$el);

      //			this.CACMV0100Selector.render();
      this.MDCMV0110Selector.render();
      // this.CACMV0120Selector.render();
      this.MDCMV0120Selector.render();
      this.MDCMV0130Selector.render();
      //			this.CACMV0150Selector.render();

      this.initUIelement();

      return this;
    },

    // 初期データ取得後に呼ばれる関数
    initUIelement: function () {
      clutil.inputlimiter($('#ca_MDPAV0100_view'));
      clutil.initUIelement($('#ca_MDPAV0100_view'));

      var _this = this;

      // 会員押下
      $('#ca_MDPAV0100_showbuttons').click(function (e) {
        // チェックボックス押下時はなにもしない
        if ($(e.target).closest('label').hasClass('ca_MDPAV0100_custall')) {
          return;
        }
        // 全顧客にチェックが入っていたらなにもしない
        if ($('#ca_MDPAV0100_custall_chk').prop('checked')) {
          return;
        }
        var tr_button = $(e.target).closest('tr');
        var span = $(tr_button).find('span.ca_MDPAV0100_tree');

        if ($(span).hasClass('treeClose')) {
          $(span).removeClass('treeClose');
          $(span).addClass('treeOpen');
          $('#ca_MDPAV0100_view').find('tr.ca_button').hide();
          $('#ca_MDPAV0100_view').find('tr.ca_condview').hide();
        } else {
          $(span).removeClass('treeOpen');
          $(span).addClass('treeClose');
          $('#ca_MDPAV0100_view').find('tr.ca_button').show();
          $('#ca_MDPAV0100_view').find('tr.ca_condview').show();
        }
      });

      var _this = this;

      // 全顧客チェックボックス押下
      $('#ca_MDPAV0100_view').delegate(':checkbox', 'toggle', function (e) {
        var tr_button = $(e.target).closest('tr');
        var span = $(tr_button).find('span.ca_MDPAV0100_tree');

        // チェックがついたらエキスパンダを閉じる
        if ($(this).prop('checked')) {
          _this.setMembCond(amgbp_AnaHead.AMGBP_ANA_REQ_MEMBCOND_ALL);

          // 条件リストを保存してクリアする
          _this.condList = {};

          _this.condList['filter_ADDR'] = _this.anaProc.getFocus1(
            _this.filter_ADDR
          );
          _this.condList['filter_ADDRLIST'] = _this.anaProc.getFocus1(
            _this.filter_ADDRLIST
          );
          _this.condList['filter_MEMBLIST'] = _this.anaProc.getFocus1(
            _this.filter_MEMBLIST
          );
          _this.condList['filter_MEMBATTR'] = _this.anaProc.getFocus1(
            _this.filter_MEMBATTR
          );
          _this.anaProc.removeFocus1(_this.filter_ADDR);
          _this.anaProc.removeFocus1(_this.filter_ADDRLIST);
          _this.anaProc.removeFocus1(_this.filter_MEMBLIST);
          _this.anaProc.removeFocus1(_this.filter_MEMBATTR);

          _this.anaProc.fireAnaCondUpdated(
            _this /* XXX 何を渡すかはおまかせ。*/
          );

          // 全顧客タイプに設定
          _this.anaProc.cond.extra.membcond =
            amgbp_AnaHead.AMGBP_ANA_REQ_MEMBCOND_ALL;
        } else {
          _this.setMembCond(amgbp_AnaHead.AMGBP_ANA_REQ_MEMBCOND_MEMB);

          // 保存しておいた条件リストを復元
          _this.anaProc.pushFocus1(_this.condList['filter_ADDR']);
          _this.anaProc.pushFocus1(_this.condList['filter_ADDRLIST']);
          _this.anaProc.pushFocus1(_this.condList['filter_MEMBLIST']);
          _this.anaProc.pushFocus1(_this.condList['filter_MEMBATTR']);

          _this.anaProc.fireAnaCondUpdated(
            _this /* XXX 何を渡すかはおまかせ。*/
          );

          _this.condList = {};
          // 会員タイプに設定
          _this.anaProc.cond.extra.membcond =
            amgbp_AnaHead.AMGBP_ANA_REQ_MEMBCOND_MEMB;
        }
      });

      //////////////////////////
      // 設定済条件の表示
      this.condUpdateAll();
      // カタログの場合制限フラグによって編集可・不可を設定する
      if (this.anaProc.catalog != null) {
        var f_anacond = this.anaProc.catalog.f_anacond;
        if (
          (f_anacond & amcm_type.AMCM_VAL_ANACOND_MEMB) ==
          amcm_type.AMCM_VAL_ANACOND_MEMB
        ) {
          var th = $('#ca_MDPAV0100_view').find('th.ca_th_edit');
          $(th).removeClass('ca_th_edit');
          var span = $('#ca_MDPAV0100_view').find('span.edit');
          $(span).remove();
          var span = $('#ca_MDPAV0100_view').find('span.ca_title');
          $(th).removeClass('category');
          $(th).addClass('ca_th_disabled');
          $(span).addClass('ca_span_disabled');
          // 全顧客チェックボックスを使用不可にする
          clutil.viewReadonly($('#ca_MDPAV0100_showbuttons'));
        }
      }

      // 全顧客指定不可能の場合はチェックボックスを削除
      if (this.disableMemb) {
        $('.ca_MDPAV0100_custall').remove();
      }
    },

    // 会員タイプで表示方法を変える
    setMembCond: function (membcond) {
      var span = $('#ca_MDPAV0100_view').find('span.ca_MDPAV0100_tree');
      var tr = $('#ca_MDPAV0100_view').find('tr');

      if (membcond == amgbp_AnaHead.AMGBP_ANA_REQ_MEMBCOND_ALL) {
        // エキスパンダを閉じる
        $(span).removeClass('treeClose');
        $(span).addClass('treeOpen');
        $(tr).addClass('disabled');
        $('#ca_MDPAV0100_view').find('tr.ca_button').hide();
        $('#ca_MDPAV0100_view').find('tr.ca_condview').hide();

        // 全顧客タイプに設定
        $('#ca_MDPAV0100_custall_chk').checkbox('check');
        $('#ca_MDPAV0100_label').removeClass('ca_memball');
        $('#ca_MDPAV0100_label').addClass('ca_custall');
      } else {
        // エキスパンダを開く
        $(span).removeClass('treeOpen');
        $(span).addClass('treeClose');
        $(tr).removeClass('disabled');
        $('#ca_MDPAV0100_view').find('tr.ca_button').show();
        $('#ca_MDPAV0100_view').find('tr.ca_condview').show();

        // 会員タイプに設定
        $('#ca_MDPAV0100_label').removeClass('ca_custall');
        $('#ca_MDPAV0100_label').addClass('ca_memball');
      }
    },

    //		// 年代
    //		navItemCACMV0100Click: function(e) {
    //			var _this = this;
    //			e.srcBackboneView.setActive();
    //
    //			var list = this.anaProc.getFocus1(this.filter_STORE);
    //			this.CACMV0100Selector.show(this.CACMV0100List);
    //
    //			//サブ画面復帰後処理
    //			this.CACMV0100Selector.okProc = function(data) {
    //				if(data != null) {
    //					_this.CACMV0100List = data;
    //				}
    //				e.srcBackboneView.unsetActive();
    //			}
    //		},

    // 住所
    navItemMDCMV0110Click: function (e) {
      var _this = this;
      e.srcBackboneView.setActive();

      var list = this.anaProc.getFocus1(this.filter_ADDR);
      this.MDCMV0110Selector.show(list);

      //サブ画面復帰後処理
      this.MDCMV0110Selector.okProc = function (data) {
        if (data != null) {
          _this.anaProc.removeFocus1(_this.filter_ADDR);
          _this.anaProc.pushFocus1(data);
          _this.anaProc.fireAnaCondUpdated({
            id: 'ca_navItemMDCMV0110',
            anafocus: _this.anaProc.getFocus1(_this.filter_ADDR),
            panelId: _this.panelId,
          });
        }
        e.srcBackboneView.unsetActive();
      };
    },

    // 住所リスト
    // navItemCACMV0120Click: function (e) {
    //   var _this = this;
    //   e.srcBackboneView.setActive();

    //   var list = this.anaProc.getFocus1(this.filter_ADDRLIST);
    //   this.CACMV0120Selector.show(list);

    //   //サブ画面復帰後処理
    //   this.CACMV0120Selector.okProc = function (data) {
    //     if (data != null) {
    //       _this.anaProc.removeFocus1(_this.filter_ADDRLIST);
    //       _this.anaProc.pushFocus1(data);
    //       _this.anaProc.fireAnaCondUpdated({
    //         id: 'ca_navItemCACMV0120',
    //         anafocus: _this.anaProc.getFocus1(_this.filter_ADDRLIST),
    //         panelId: _this.panelId,
    //       });
    //     }
    //     e.srcBackboneView.unsetActive();
    //   };
    // },

    // 会員リスト
    navItemMDCMV0120Click: function (e) {
      var _this = this;
      e.srcBackboneView.setActive();

      var list = this.anaProc.getFocus1(this.filter_MEMBLIST);
      this.MDCMV0120Selector.show(list);

      //サブ画面復帰後処理
      this.MDCMV0120Selector.okProc = function (data) {
        if (data != null) {
          _this.anaProc.removeFocus1(_this.filter_MEMBLIST);
          _this.anaProc.pushFocus1(data);
          _this.anaProc.fireAnaCondUpdated({
            id: 'ca_navItemMDCMV0120',
            anafocus: _this.anaProc.getFocus1(_this.filter_MEMBLIST),
            panelId: _this.panelId,
          });
        }
        e.srcBackboneView.unsetActive();
      };
    },

    // 会員属性
    navItemMDCMV0130Click: function (e) {
      var _this = this;
      e.srcBackboneView.setActive();

      var list = this.anaProc.getFocus1(this.filter_MEMBATTR);
      this.MDCMV0130Selector.show(list);

      //サブ画面復帰後処理
      this.MDCMV0130Selector.okProc = function (data) {
        if (data != null) {
          _this.anaProc.removeFocus1(_this.filter_MEMBATTR);
          _this.anaProc.pushFocus1(data);
          _this.anaProc.fireAnaCondUpdated({
            id: 'ca_navItemMDCMV0130',
            anafocus: _this.anaProc.getFocus1(_this.filter_MEMBATTR),
            panelId: _this.panelId,
          });
        }
        e.srcBackboneView.unsetActive();
      };
    },

    //		// 会員
    //		navItemCACMV0150Click: function(e) {
    //			var _this = this;
    //			e.srcBackboneView.setActive();
    //
    //			var list = this.anaProc.getFocus1(this.filter_MEMB);
    //			this.CACMV0150Selector.show(list);
    //
    //			//サブ画面復帰後処理
    //			this.CACMV0150Selector.okProc = function(data) {
    //				if(data != null) {
    //					_this.anaProc.removeFocus1(_this.filter_MEMB);
    //					_this.anaProc.pushFocus1(data);
    //					_this.anaProc.fireAnaCondUpdated(_this/* XXX 何を渡すかはおまかせ。*/);
    //				}
    //				e.srcBackboneView.unsetActive();
    //			}
    //		}

    // すべての条件を更新する
    condUpdateAll: function () {
      // 会員タイプを取得してチェックボックスを設定
      this.setMembCond(this.anaProc.cond.extra.membcond);

      // 住所
      this.onCondUpdated(this.anaProc, {
        id: 'ca_navItemMDCMV0110',
        anafocus: this.anaProc.getFocus1(this.filter_ADDR),
        panelId: this.panelId,
      });
      // 住所リスト
      // this.onCondUpdated(this.anaProc, {
      //   id: 'ca_navItemCACMV0120',
      //   anafocus: this.anaProc.getFocus1(this.filter_ADDRLIST),
      //   panelId: this.panelId,
      // });
      // 会員リスト
      this.onCondUpdated(this.anaProc, {
        id: 'ca_navItemMDCMV0120',
        anafocus: this.anaProc.getFocus1(this.filter_MEMBLIST),
        panelId: this.panelId,
      });
      // 会員属性
      this.onCondUpdated(this.anaProc, {
        id: 'ca_navItemMDCMV0130',
        anafocus: this.anaProc.getFocus1(this.filter_MEMBATTR),
        panelId: this.panelId,
      });
    },

    // 条件をクリアボタン押下
    onCondReset: function () {
      // 条件がクリアされたので、エコーバック View を更新する。
      // anaProc.cond または、anaProc.getFocus12() から分析条件を参照して、
      // エコーバック View の表示内容を更新すること。
      this.condUpdateAll();
    },

    // 「確定」⇒ エコーバックViewを更新
    onCondUpdated: function (anaproc, from) {
      // 条件が確定したので、エコーバック View を更新する。
      // anaProc.cond または、anaProc.getFocus12() から分析条件を参照して、
      // エコーバック View の表示内容を更新すること。
      if (!from) {
        return;
      }
      if (this.panelId != from.panelId) {
        return;
      }
      var tr_id = from.id;
      var anafocus = from.anafocus;

      // 条件表示部分を削除
      $('tr.ca_condview[tgt-id=' + tr_id + ']').remove();

      // 条件が空の場合はなにも表示しない
      if (!anafocus || anafocus.length == 0) {
        return;
      }

      var html_source = '';
      switch (tr_id) {
        case 'ca_navItemMDCMV0130':
          // 会員属性
          // 属性でソートする
          anafocus.sort(function (a, b) {
            if (a.attr > b.attr) return 1;
            if (a.attr < b.attr) return -1;
            return 0;
          });
          for (var i = 0; i < anafocus.length; i++) {
            // 属性毎に<td>を作成する
            var focus_attr = anafocus[i];
            html_source +=
              '<tr class="ca_condview" tgt-id="' +
              tr_id +
              '"><td width="200px">';
            html_source += focus_attr.name2;
            html_source += '</td>';
            html_source += '<td>';
            var focus_source = '';
            for (var j = i; j < anafocus.length; j++) {
              var focus = anafocus[j];
              if (clutil.chkStr(focus.code)) {
                focus_source += focus.code + ':';
              }
              focus_source += focus.name;

              // 文字数制限
              if (focus_source.length > clcom.focusStr_max) {
                focus_source = focus_source.slice(0, clcom.focusStr_max);
                focus_source += '...';
                for (; j < anafocus.length; j++) {
                  if (
                    j != anafocus.length - 1 &&
                    anafocus[j + 1].attr == focus_attr.attr
                  ) {
                    // 次の異なる属性までjをインクリメントする
                    continue;
                  }
                  break;
                }
                i = j;
                break;
              }
              // 次の属性が異なる場合はbreak;
              if (
                j != anafocus.length - 1 &&
                anafocus[j + 1].attr == focus_attr.attr
              ) {
                focus_source += ', ';
              } else {
                i = j;
                break;
              }
            }
            html_source += focus_source;
            html_source += '</td></tr>';
          }
          break;
        default:
          html_source +=
            '<tr class="ca_condview" tgt-id="' + tr_id + '"><td colspan="2">';
          var focus_source = '';

          for (var i = 0; i < anafocus.length; i++) {
            var focus = anafocus[i];

            if (clutil.chkStr(focus.code)) {
              focus_source += focus.code + ':';
            }
            focus_source += focus.name;

            // 文字数制限
            if (focus_source.length > clcom.focusStr_max) {
              focus_source = focus_source.slice(0, clcom.focusStr_max);
              focus_source += '...';
              break;
            }
            if (i != anafocus.length - 1) {
              focus_source += ', ';
            }
          }
          html_source += focus_source;
          html_source += '</td></tr>';
          break;
      }

      // 条件を表示
      $(html_source).insertAfter($('#' + tr_id));
    },
  });
});
