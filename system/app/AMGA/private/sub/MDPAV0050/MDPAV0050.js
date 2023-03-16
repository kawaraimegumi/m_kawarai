$(function () {
  //////////////////////////////////////////////
  // View
  MDPAV0050PanelView = Backbone.View.extend({
    id: 'ca_MDPAV0050_view',
    tagName: 'table',
    className: 'tree mrgb10',
    template: _.template(
      '' +
        '<tr id="ca_MDPAV0050_showbuttons">' +
        '<th colspan="2" class="required"><span class="treeClose"></span>表示項目</th>' +
        '</tr>'
    ),

    // 押下イベント
    events: {},

    // 設定条件表示用オブジェクト
    MDCMV0080dispname: {
      disp_way: {
        name: '表示項目並び',
        val1: '縦並び',
        val2: '横並び',
        val3: '横並び（表示項目集約）',
      },
      f_total: { name: '合計表示', val1: 'あり', val0: 'なし' },
      f_subtotal: { name: '小計表示', val1: 'あり', val2: 'なし' },
      // existsum: { name: '既存店集計', val1: 'する', val2: 'しない' },
      exist_iymd: { name: '既存店基準日' },
      disp_amunit: {
        name: '表示単位',
        val1: '円単位',
        val2: '千単位',
        val3: '万単位',
      },
      sizesum: { name: 'サイズ名で集約', val1: 'あり', val2: 'なし' },
    },
    // モデルオブジェクト
    dispitemList: {},
    panelId: 'MDPAV0050',

    initialize: function (opt) {
      _.extend(this, opt);
      _.bindAll(this);

      // 既存店集計UI：要/不要
      // if (Ana.Config.cond.CACMV0210.existsum == 'unused') {
      //   // 設定条件表示用オブジェクトで不要なものを削り取る
      //   delete this.MDCMV0080dispname.existsum;
      //   delete this.MDCMV0080dispname.exist_iymd;
      // }
      // 自由分析以外はサイズ名集約なし
      // if (this.anaProc.func_code != 'AMGAV0100') {
      //   delete this.MDCMV0080dispname.sizesum;
      // }

      // Lv2: 表示項目のメニューアイテム
      this.navMDCMV0050View = new AnaNaviItemView({
        title: '表示項目',
        tr: { id: 'ca_navItemMDCMV0050' },
      }).on('onNaviItemClick', this.navItemMDCMV0050Click);

      // Lv2: 表示設定のメニューアイテム
      this.navMDCMV0080View = new AnaNaviItemView({
        title: '表示設定',
        tr: { id: 'ca_navItemMDCMV0080' },
      }).on('onNaviItemClick', this.navItemMDCMV0080Click);

      // 表示項目選択画面
      this.MDCMV0050Selector = new MDCMV0050SelectorView({
        el: $('#ca_MDCMV0050_dialog'), // 配置場所
        $parentView: this.$parentView,
        anadata: this.anadata,
        anaProc: this.anaProc,
      });

      // 表示設定画面
      this.MDCMV0080Selector = new MDCMV0080SelectorView({
        el: $('#ca_MDCMV0080_dialog'), // 配置場所
        $parentView: this.$parentView,
        anadata: this.anadata,
        anaProc: this.anaProc,
      });

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

      // 表示項目ボタン群
      $('#ca_MDPAV0050_view')
        .append(this.navMDCMV0050View.render().$el)
        .append(this.navMDCMV0080View.render().$el);

      this.MDCMV0050Selector.render();
      this.MDCMV0080Selector.render();

      this.initUIelement();

      return this;
    },

    // 初期データ取得後に呼ばれる関数
    initUIelement: function () {
      clutil.inputlimiter(this.$el);
      clutil.initUIelement(this.$el);

      // 表示項目押下
      $('#ca_MDPAV0050_showbuttons').click(function (e) {
        var tr_button = $(e.target).closest('tr');
        var span = $(tr_button).find('span');

        if ($(span).hasClass('treeClose')) {
          $(span).removeClass('treeClose');
          $(span).addClass('treeOpen');
          $('#ca_MDPAV0050_view').find('tr.ca_button').hide();
          $('#ca_MDPAV0050_view').find('tr.ca_condview').hide();
        } else {
          $(span).removeClass('treeOpen');
          $(span).addClass('treeClose');
          $('#ca_MDPAV0050_view').find('tr.ca_button').show();
          $('#ca_MDPAV0050_view').find('tr.ca_condview').show();
        }
      });

      //////////////////////////
      // 設定済条件の表示
      this.condUpdateAll();
      // カタログの場合制限フラグによって編集可・不可を設定する
      if (this.anaProc.catalog != null) {
        var f_anacond = this.anaProc.catalog.f_anacond;
        if (
          (f_anacond & amcm_type.AMCM_VAL_ANACOND_DISP) ==
          amcm_type.AMCM_VAL_ANACOND_DISP
        ) {
          var th = $('#ca_MDPAV0050_view').find('th.ca_th_edit');
          $(th).removeClass('ca_th_edit');
          var span = $('#ca_MDPAV0050_view').find('span.edit');
          $(span).remove();
          var span = $('#ca_MDPAV0050_view').find('span.ca_title');
          $(th).removeClass('category');
          $(th).addClass('ca_th_disabled');
          $(span).addClass('ca_span_disabled');
        }
      }
    },

    // 表示押下 - this.navMDCMV0050View のクリックイベントに関連付けしている。
    navItemMDCMV0050Click: function (e) {
      this.navMDCMV0050View.setActive();
      this.MDCMV0050Selector.show();
      this.MDCMV0050Selector.okProc = _.bind(function (data) {
        if (data) {
          if (
            _.where(data.cond.dispitemlist, {
              dispitem_id:
                amgbp_AnaDispItemDefs.AMGBA_DI_G_MEMB |
                amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL |
                amgbp_AnaDispItemDefs.AMGBA_DI_I_MEMB_ACTIVE,
            }).length
          ) {
            $('#ca_btn_savelist').closest('p').show();
            $('.btn-group').closest('p').show();
          } else {
            $('#ca_btn_savelist').closest('p').hide();
            $('.btn-group').closest('p').hide();
          }
          _.extend(this.anaProc.cond, data.cond);
          this.anaProc.fireAnaCondUpdated({
            id: 'ca_navItemMDCMV0050',
            anafocus: this.anaProc.cond.dispitemlist,
            panelId: this.panelId,
          });
        }
        this.navMDCMV0050View.unsetActive();
      }, this);
    },

    // 表示設定押下
    navItemMDCMV0080Click: function (e) {
      this.navMDCMV0080View.setActive();
      this.MDCMV0080Selector.show();
      this.MDCMV0080Selector.okProc = _.bind(function (data) {
        if (data) {
          _.extend(this.anaProc.cond, data.cond);
          this.anaProc.fireAnaCondUpdated({
            id: 'ca_navItemMDCMV0080',
            anafocus: this.anaProc.cond.dispopt,
            panelId: this.panelId,
          });
        }
        this.navMDCMV0080View.unsetActive();
      }, this);
    },

    // すべての条件を更新する
    condUpdateAll: function () {
      // 表示項目
      this.onCondUpdated(this.anaProc, {
        id: 'ca_navItemMDCMV0050',
        anafocus: this.anaProc.cond.dispitemlist,
        panelId: this.panelId,
      });
      // 表示設定
      this.onCondUpdated(this.anaProc, {
        id: 'ca_navItemMDCMV0080',
        anafocus: this.anaProc.cond.dispopt,
        panelId: this.panelId,
      });
    },

    // 「条件をクリア」⇒ エコーバックViewを更新
    onCondReset: function (anaproc, from) {
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
      var exist_iymd_source = '';
      switch (tr_id) {
        case 'ca_navItemMDCMV0080':
          var _this = this;
          // 表示設定
          $.each(anafocus, function (key, value) {
            var dispname = _this.MDCMV0080dispname[key];

            // 既存店基準日は既存店集計するときのみ
            if (dispname && key == 'exist_iymd') {
              if (anafocus.existsum != null && Number(anafocus.existsum) == 1) {
                exist_iymd_source +=
                  '<tr class="ca_condview" tgt-id="' +
                  tr_id +
                  '"><td width="200px">';
                exist_iymd_source += dispname.name;
                exist_iymd_source += '</td>';
                exist_iymd_source += '<td>';
                exist_iymd_source += clutil.dateFormat(value, 'yyyy/mm/dd');
                exist_iymd_source += '</td></tr>';
              }
            } else if (dispname) {
              html_source +=
                '<tr class="ca_condview" tgt-id="' +
                tr_id +
                '"><td width="200px">';
              html_source += dispname.name;
              html_source += '</td>';
              html_source += '<td>';
              html_source += dispname['val' + value];
              html_source += '</td></tr>';
              // 既存店基準日は既存店集計の後に追加
              if (key == 'existsum') {
                html_source += exist_iymd_source;
              }
            }
          });
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
