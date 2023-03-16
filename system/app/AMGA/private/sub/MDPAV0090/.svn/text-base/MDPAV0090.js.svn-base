$(function () {
  MDPAV0090PanelView = Backbone.View.extend({
    id: 'ca_MDPAV0090_view',
    tagName: 'table',
    className: 'tree mrgb10',
    template: _.template(
      '' +
        '<tr id="ca_MDPAV0090_showbuttons">' +
        '<th colspan="2" class="required"><span class="treeClose"></span>軸</th>' +
        '</tr>'
    ),
    events: {},
    axisList: {},
    panelId: 'MDPAV0090',

    initialize: function (opt) {
      _.extend(this, opt);
      _.bindAll(this);

      // Lv2: 軸のメニューアイテム
      this.navItemView = new AnaNaviItemView({
        title: '軸',
        tr: { id: 'ca_navItemMDCMV0090' },
      }).on('onNaviItemClick', this.navItemClick);

      // 軸選択画面
      this.MDCMV0090Selector = new MDCMV0090SelectorView({
        el: $('#ca_MDCMV0090_dialog'),
        $parentView: this.$parentView,
        anadata: this.anadata,
        anaProc: this.anaProc,
      });
      this.MDCMV0090Selector.render();

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

      // 軸ボタン群
      $('#ca_MDPAV0090_view').append(this.navItemView.render().$el);

      this.initUIelement();

      return this;
    },

    // 初期データ取得後に呼ばれる関数
    initUIelement: function () {
      clutil.inputlimiter(this.$el);
      clutil.initUIelement(this.$el);

      // 軸押下
      $('#ca_MDPAV0090_showbuttons').click(function (e) {
        var tr_button = $(e.target).closest('tr');
        var span = $(tr_button).find('span');

        if ($(span).hasClass('treeClose')) {
          $(span).removeClass('treeClose');
          $(span).addClass('treeOpen');
          $('#ca_MDPAV0090_view').find('tr.ca_button').hide();
          $('#ca_MDPAV0090_view').find('tr.ca_condview').hide();
        } else {
          $(span).removeClass('treeOpen');
          $(span).addClass('treeClose');
          $('#ca_MDPAV0090_view').find('tr.ca_button').show();
          $('#ca_MDPAV0090_view').find('tr.ca_condview').show();
        }
      });

      //////////////////////////
      // 設定済条件の表示
      this.condUpdateAll();
      // カタログの場合制限フラグによって編集可・不可を設定する
      if (this.anaProc.catalog != null) {
        var f_anacond = this.anaProc.catalog.f_anacond;
        if (
          (f_anacond & amcm_type.AMCM_VAL_ANACOND_AXIS) ==
          amcm_type.AMCM_VAL_ANACOND_AXIS
        ) {
          var th = $('#ca_MDPAV0090_view').find('th.ca_th_edit');
          $(th).removeClass('ca_th_edit');
          var span = $('#ca_MDPAV0090_view').find('span.edit');
          $(span).remove();
          var span = $('#ca_MDPAV0090_view').find('span.ca_title');
          $(th).removeClass('category');
          $(th).addClass('ca_th_disabled');
          $(span).addClass('ca_span_disabled');
        }
      }
    },

    // 表示押下 - this.navItemView のクリックイベントに関連付けしている。
    navItemClick: function (e) {
      this.navItemView.setActive();
      this.MDCMV0090Selector.show();
      this.MDCMV0090Selector.okProc = _.bind(function (data) {
        if (data) {
          this.anaProc.removeFocus1({
            kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_LASTSTORE,
          });
          data.cond.focuslist = _.union(
            this.anaProc.cond.focuslist,
            data.cond.focuslist
          );
          _.extend(this.anaProc.cond, data.cond);
          this.condUpdateAll();
        }
        this.navItemView.unsetActive();
      }, this);
    },

    // すべての条件を更新する
    condUpdateAll: function () {
      // 軸
      this.onCondUpdated(this.anaProc, {
        id: 'ca_navItemMDCMV0090',
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
      var id = from.id;
      $('tr.ca_condview[tgt-id=' + id + ']').remove();
      var cond = anaproc.cond;
      if (!cond) {
        return;
      }
      this.setAxisInfo(id, cond, 'h');
      this.setAxisInfo(id, cond, 'v');
    },

    setAxisInfo: function (id, cond, type) {
      if (type == 'v') {
        var axisList = cond.vAxisList || [];
        var label = '縦軸';
        // var fzerosuppress = cond.vfzerosuppress;
      } else if (type == 'h') {
        var axisList = cond.hAxisList || [];
        var label = '横軸';
        // var fzerosuppress = cond.hfzerosuppress;
      }
      if (!axisList.length) {
        return;
      }
      var html_source = '';
      for (var i = 0; i < axisList.length; i++) {
        var axis = axisList[i];
        var nAxis = i + 1;
        html_source += '<tr class="ca_condview" tgt-id="' + id + '">';
        html_source += '<td width="200px">' + label + nAxis + '</td>';
        html_source +=
          '<td>' + axis.name2 + (axis.name ? ':' + axis.name : '') + '</td>';
        html_source += '</tr>';
      }
      html_source += '<tr class="ca_condview" tgt-id="' + id + '">';
      // html_source +=
      //   '<td colspan="2">すべての項目が0の場合、明細列を表示' +
      //   (fzerosuppress ? 'しない' : 'する') +
      //   '</td>';
      html_source += '</tr>';
      $(html_source).insertAfter($('#' + id));
    },
  });
});
