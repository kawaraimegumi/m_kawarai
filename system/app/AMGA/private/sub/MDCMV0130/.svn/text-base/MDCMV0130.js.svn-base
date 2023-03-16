$(function () {
  //////////////////////////////////////////////
  // View
  MDCMV0130SelectorView = Backbone.View.extend({
    screenId: 'MDCMV0130',
    validator: null,

    // 押下イベント
    events: {
      'click #ca_MDCMV0130_add': '_onAddClick', // 追加ボタン押下

      'click .ca_MDCMV0130_edit_del': '_onEditDelClick', // 単一削除ボタン押下
      'click #ca_MDCMV0130_edit_delall': '_onEditDelAllClick', // すべて削除ボタン押下

      'click #ca_MDCMV0130_clear': '_onClearClick', // クリアボタン押下
      'click #ca_MDCMV0130_commit': '_onCommitClick', // 確定ボタン押下

      'click #ca_MDCMV0130_show_MDCMV1030': '_onShowMDCMV1030Click', // 店舗選択ボタン押下

      'change #ca_MDCMV0130_anaattr': '_onAnaAttrSelect', // 属性値変更
      //			"keyup #ca_MDCMV0130_anaattr"		:	"_onAnaAttrSelect",		// 属性値変更
      //			"keydown #ca_MDCMV0130_anaattr"		:	"_onAnaAttrSelect",		// 属性値変更

      'click #ca_MDCMV0130_main .close': '_onCancelClick', // 閉じるボタン押下時
      'click #ca_MDCMV0130_cancel': '_onCancelClick', // キャンセルボタン押下時
      'click #ca_MDCMV0130_main .modalBK': '_onCancelClick', // 枠外押下時
    },

    initialize: function (opt) {
      var defaults = {
        search_date: clcom.ope_date, // 運用日
        select_mode: clutil.cl_single_select, // 単一選択モード
        isAnalyse_mode: true, // 分析画面で利用
      };
      var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt, defaults);
      _.extend(this, fixedOpt);
      _.bindAll(this);
    },

    // 初期データ取得後に呼ばれる関数
    initUIelement: function () {
      clutil.setMainColumnScrollbar(this.$('#mainColumn'), this.isAnalyse_mode);

      var _this = this;
      clutil.inputlimiter(this.$el);

      // 単一選択モード
      if (this.select_mode == clutil.cl_single_select) {
        this.$('.ca_MDCMV0130_multi').remove();
        this.$('#ca_MDCMV0130_chkall').remove();
      }
      // 分析画面以外からのモード
      if (this.isAnalyse_mode == false) {
        this.$('#mainColumninBox').addClass('noLeftColumn');
        this.$('#mainColumnFooter').addClass('noLeftColumn');
      } else {
        this.$('#mainColumnFooter').addClass('analytics');
      }

      //選択した内容のスクロール
      this.$('#innerScroll').perfectScrollbar();
      // 条件表示エリアの設定
      this.addtoSelected = clutil.addtoSelected(
        this.$('#ca_MDCMV0130_add'),
        this.$('#selected'),
        this.$('#mainColumn')
      );

      // 属性リストを取得
      this.attrlist = clcom.getMembAttrList();

      //			// 組織選択画面
      //			this.MDCMV0130_CACMV0020Selector = new  CACMV0020SelectorView({
      //				el : this.$('#ca_MDCMV0130_CACMV0020_dialog')	// 配置場所
      //			});
      //			this.MDCMV0130_CACMV0020Selector.render(
      //					this.$('#ca_MDCMV0130_main'),
      //            		clutil.cl_single_select,	// 単一数選択モード
      //            		null						// 検索日
      //            );

      // 店舗選択画面
      this.MDCMV0130_MDCMV1030Selector = new MDCMV1030SelectorView({
        el: this.$('#ca_MDCMV0130_MDCMV1030_dialog'), // 配置場所
        $parentView: this.$('#ca_MDCMV0130_main'),
        isAnalyse_mode: this.isAnalyse_mode, // 分析ユースかどうかフラグ？？？
        //				ymd				: null,			// 検索日
        select_mode: clutil.cl_single_select, // 複数選択モード
        anaProc: this.anaProc,
      });
      this.MDCMV0130_MDCMV1030Selector.render();

      // コンボボックスの中身を作成
      clutil.cltypeselector2(
        this.$('#ca_MDCMV0130_anaattr'),
        this.attrlist,
        0,
        1,
        'attr',
        'name'
      );
      if (this.attrlist != null && this.attrlist.length > 0) {
        this.showData(this.attrlist[0]);
      }

      clutil.initUIelement(this.$el);
    },

    /**
     * 選択画面の初期化処理
     */
    render: function () {
      var _this = this;

      //			var url = "";
      //			url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
      var url = clcom.getAnaSubPaneURI(this.screenId);

      // HTMLソースを読み込む
      clutil.loadHtml(url, function (data) {
        _this.html_source = data;
      });
    },

    show: function (editList, isSubDialog) {
      var _this = this;

      // 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
      if (isSubDialog == null) {
        $('.cl_dialog').empty();
      }

      this.$parentView.hide();

      // htmlソースからダイアログを作成する
      this.$el.html('');
      this.$el.html(this.html_source);

      // 画面の初期化
      this.initUIelement();

      $('.cl_echoback').hide();
      // validatorエラー時の表示領域
      this.validator = clutil.validator(this.$('#ca_MDCMV0130_main'), {
        echoback: $('.cl_echoback'),
      });
      // フォーカスの設定
      this.setFocus();

      // 複数選択モードで編集データがある場合
      if (
        this.select_mode == clutil.cl_multiple_select &&
        editList != null &&
        editList.length > 0
      ) {
        var html_source = '';
        for (var i = 0; i < editList.length; i++) {
          if (i == editList.length) {
            break;
          }
          html_source += this.makeEditTmp(editList[i]);
        }
        this.$('#ca_MDCMV0130_edit_tbl').html(html_source);
      } else {
        this.addtoSelected.right_side_hide();
      }

      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode({
        view: this.$el,
      });
    },

    /**
     * フォーカスの設定
     */
    setFocus: function () {
      // フォーカスの設定
      clutil.setFocus(this.$('#ca_MDCMV0130_anaattr'));
    },

    /**
     * 種別変更
     */
    _onAnaAttrSelect: function (e) {
      this.validator.clear();
      this.showData(this.getAnaAttr());
    },

    /**
     * 現在の種別を取得
     */
    getAnaAttr: function () {
      var attr = this.$('#ca_MDCMV0130_anaattr').val();
      var anaattr = {};
      for (var i = 0; i < this.attrlist.length; i++) {
        if (this.attrlist[i].attr == attr) {
          anaattr = this.attrlist[i];
          break;
        }
      }
      return anaattr;
    },

    /**
     * 初期表示
     */
    showData: function (anaattr) {
      var template = '';
      // 最大桁数
      anaattr.maxlen = anaattr.maxlen == null ? 9 : anaattr.maxlen;

      switch (anaattr.attr) {
        case amgbp_AnaDefs.AMGBA_DEFS_ATTR_MEMBATTR_AGE:
          // 年齢の場合は3桁
          anaattr.maxlen = 3;
          break;
        case amgbp_AnaDefs.AMGBA_DEFS_ATTR_MEMBATTR_R:
        case amgbp_AnaDefs.AMGBA_DEFS_ATTR_MEMBATTR_F:
        case amgbp_AnaDefs.AMGBA_DEFS_ATTR_MEMBATTR_M:
          // RFMの場合は3桁
          anaattr.maxlen = 1;
          break;
      }

      switch (Number(anaattr.actype)) {
        case am_proto_defs.AM_PROTO_ACTYPE_TEXT:
          template = 'ca_MDCMV0130_text_template';
          break;
        case am_proto_defs.AM_PROTO_ACTYPE_NUMRANGE:
        case am_proto_defs.AM_PROTO_ACTYPE_NUMRANGE100:
          template = 'ca_MDCMV0130_text_fromto_template';
          break;
        case am_proto_defs.AM_PROTO_ACTYPE_YMDRANGE:
          template = 'ca_MDCMV0130_date_fromto_template';
          break;
        case am_proto_defs.AM_PROTO_ACTYPE_BIRTH_MONTH:
          template = 'ca_MDCMV0130_birth_month_template';
          break;
        case am_proto_defs.AM_PROTO_ACTYPE_ONOFF:
          template = 'ca_MDCMV0130_onoff_template';
          break;
        case am_proto_defs.AM_PROTO_ACTYPE_TYPE:
        case am_proto_defs.AM_PROTO_ACTYPE_CDNAME:
        case am_proto_defs.AM_PROTO_ACTYPE_STAFFCDNAME:
          template = 'ca_MDCMV0130_table_template';
          //				template = "ca_MDCMV0130_MDCMV1030_template";
          break;
        case am_proto_defs.AM_PROTO_ACTYPE_ORG:
          template = 'ca_MDCMV0130_MDCMV1030_template';
          break;
        default:
          break;
      }
      this.$('#ca_MDCMV0130_result').empty();
      this.$('#' + template)
        .tmpl(anaattr)
        .appendTo('#ca_MDCMV0130_result');

      switch (Number(anaattr.actype)) {
        case am_proto_defs.AM_PROTO_ACTYPE_TEXT:
          // 全角
          this.$('#ca_MDCMV0130_val').addClass('ime-active');
          //				// 半角カナチェックボックス表示 2013/09/06
          ////				this.$('.ca_MDCMV0130_check').show();
          break;
        case am_proto_defs.AM_PROTO_ACTYPE_TYPE:
        case am_proto_defs.AM_PROTO_ACTYPE_CDNAME:
        case am_proto_defs.AM_PROTO_ACTYPE_STAFFCDNAME:
          switch (Number(anaattr.actype)) {
            case am_proto_defs.AM_PROTO_ACTYPE_TYPE:
              this.typelist = clutil.gettypecustlist(anaattr.xtype);
              this.$('#ca_MDCMV0130_tbody_type_tmp')
                .tmpl(this.typelist)
                .appendTo('#ca_MDCMV0130_tbody');
              break;
            case am_proto_defs.AM_PROTO_ACTYPE_CDNAME:
              this.typelist = clutil.getcdnamelist(anaattr.xtype);
              this.$('#ca_MDCMV0130_tbody_cdname_tmp')
                .tmpl(this.typelist)
                .appendTo('#ca_MDCMV0130_tbody');
              break;
            case am_proto_defs.AM_PROTO_ACTYPE_STAFFCDNAME:
              this.typelist = clutil.getstaffcdnamelist(anaattr.xtype);
              this.$('#ca_MDCMV0130_tbody_cdname_tmp')
                .tmpl(this.typelist)
                .appendTo('#ca_MDCMV0130_tbody');
              break;
          }

          var _this = this;
          // 全選択チェックボックスを初期化
          this.chkall = clutil.checkallbox(
            this.$('#ca_MDCMV0130_chkall'),
            this.$('.ca_MDCMV0130_tbl'),
            this.$('#ca_MDCMV0130_tbody')
          );
          break;
          $(window).scrollTo(1); // ダブルスクロール防止
        //			case am_proto_defs.AM_PROTO_ITEM_TYPE_TEXTHAN:
        //				// 半角
        //				this.$('#ca_MDCMV0130_text').addClass("ime-disabled");
        //				this.$('#ca_MDCMV0130_text').attr("data-limit", "len:" + maxlen);
        //				break;
        //			case am_proto_defs.AM_PROTO_ITEM_TYPE_TEXTNUM:
        //				// 半角数値
        //				this.$('#ca_MDCMV0130_text').addClass("ime-disabled");
        //				this.$('#ca_MDCMV0130_text').attr("data-limit", "len:" + maxlen + " digit");
        //				break;
        case am_proto_defs.AM_PROTO_ACTYPE_YMDRANGE:
          // 生年月日の場合は1900/01/02～
          if (anaattr.attr == amgbp_AnaDefs.AMGBA_DEFS_ATTR_MEMBATTR_BIRTHDAY) {
            clutil.datepicker(this.$('#ca_MDCMV0130_val'), 19000102);
            clutil.datepicker(this.$('#ca_MDCMV0130_val2'), 19000102);
          } else {
            clutil.datepicker(this.$('#ca_MDCMV0130_val'));
            clutil.datepicker(this.$('#ca_MDCMV0130_val2'));
          }
          break;
        case am_proto_defs.AM_PROTO_ACTYPE_BIRTH_MONTH:
          // すべて選択の初期化
          this.birth_month_chkall = clutil.checkall(
            this.$('#ca_MDCMV0130_birth_month_chkall'),
            this.$('#ca_MDCMV0130_birth_month_chk')
          );
          break;
        default:
          break;
      }

      // 単位の表示
      this.$('#ca_MDCMV0130_item_unit').html(clutil.cStr(anaattr.item_unit));

      // 画面の初期化
      clutil.initUIelement(this.$el);
      clutil.inputlimiter(this.$el);
      // Enterキーによるフォーカスをする。
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode({
        view: $('.cl_dialog'),
      });
    },

    /**
     * 店舗選択ボタン押下
     */
    _onShowMDCMV1030Click: function (e) {
      var _this = this;

      this.validator.clear();

      this.MDCMV0130_MDCMV1030Selector.show(null, true);
      //サブ画面復帰後処理
      this.MDCMV0130_MDCMV1030Selector.okProc = function (data) {
        if (data != null) {
          _this
            .$('#ca_MDCMV0130_dispname')
            .val(data[0].code + ':' + data[0].name);
          _this.$('#ca_MDCMV0130_name').val(data[0].name);
          _this.$('#ca_MDCMV0130_code').val(data[0].code);
          _this.$('#ca_MDCMV0130_val').val(data[0].val);
        }
        // ボタンにフォーカスする
        $(e.target).focus();
      };
    },

    /**
     * 結果のクリア
     */
    clearResult: function () {
      // テーブルをクリア
      this.$('#ca_MDCMV0130_tbody').empty();
      // ページャーの初期化
      this.initPager(1, clcom.itemsOnPage, 0);
      // validatorの初期化
      this.validator.clear();
      // 全選択チェックボックスを初期化
      this.chkall.init();
      // 確定時用のデータを初期化
      this.resultList = [];
    },

    /**
     * クリアボタン押下
     */
    _onClearClick: function () {
      clutil.viewClear(this.$('#ca_MDCMV0130_searchArea'));
      // validatorの初期化
      this.validator.clear();
    },

    /**
     * 追加ボタン押下
     */
    _onAddClick: function () {
      var _this = this;

      // 編集領域を閉じる際はなにもしない
      if (this.addtoSelected.right_side()) {
        return;
      }
      var retStat = true;
      if (!this.validator.valid()) {
        // ヘッダーにメッセージを表示
        this.validator.setErrorInfo({ _eb_: clmsg.ca_select_attr });
        retStat = false;
      }
      // 画面の情報を取得する
      var searchData = clutil.view2data(
        this.$('#ca_MDCMV0130_result'),
        'ca_MDCMV0130_'
      );

      var anaattr = this.getAnaAttr();

      // 編集領域のIDリストを取得する
      var idlist = {};
      $.each(this.$('#ca_MDCMV0130_edit_tbl li'), function () {
        if (this.id == anaattr.attr) {
          var val = $(this).find('input[name=val]').val();
          idlist[val] = true;
        }
      });
      // 現在の要素数を取得
      var num = this.$('#ca_MDCMV0130_edit_tbl li').length;

      switch (Number(anaattr.actype)) {
        case am_proto_defs.AM_PROTO_ACTYPE_TEXT:
        case am_proto_defs.AM_PROTO_ACTYPE_NUMRANGE:
        case am_proto_defs.AM_PROTO_ACTYPE_NUMRANGE100:
        case am_proto_defs.AM_PROTO_ACTYPE_YMDRANGE:
          if (!retStat) {
            return;
          }
          var newdata = {};
          newdata.name2 = anaattr.name;
          newdata.kind = anaattr.kind;
          newdata.attr = anaattr.attr;
          switch (Number(anaattr.actype)) {
            case am_proto_defs.AM_PROTO_ACTYPE_TEXT:
              newdata.val = searchData.val;
              newdata.name = searchData.val;
              break;
            case am_proto_defs.AM_PROTO_ACTYPE_NUMRANGE:
            case am_proto_defs.AM_PROTO_ACTYPE_NUMRANGE100:
              // 範囲反転チェック
              var chkInfo = [];
              chkInfo.push({
                stval: 'ca_MDCMV0130_val',
                edval: 'ca_MDCMV0130_val2',
              });
              if (!this.validator.validFromTo(chkInfo) || !retStat) {
                return;
              }
              newdata.val = searchData.val;
              newdata.val2 = searchData.val2;
              if (clutil.pInt(newdata.val2) == 0) {
                // 終了値にint_maxを入れる
                newdata.val2 = clcom.int_max;
              }
              newdata.name =
                clutil.comma(searchData.val) +
                '～' +
                clutil.comma(searchData.val2);
              break;
            case am_proto_defs.AM_PROTO_ACTYPE_YMDRANGE:
              // 範囲反転チェック
              var chkInfo = [];
              chkInfo.push({
                stval: 'ca_MDCMV0130_val',
                edval: 'ca_MDCMV0130_val2',
              });
              if (!this.validator.validFromTo(chkInfo) || !retStat) {
                return;
              }
              newdata.val = searchData.val;
              newdata.val2 = searchData.val2;
              newdata.name =
                clutil.dateFormat(searchData.val, 'yyyy/mm/dd') +
                '～' +
                clutil.dateFormat(searchData.val2, 'yyyy/mm/dd');
              break;
            default:
              break;
          }
          this.$('#ca_MDCMV0130_edit_tbl').append(this.makeEditTmp(newdata));
          break;
        case am_proto_defs.AM_PROTO_ACTYPE_ONOFF:
          if (!retStat) {
            return;
          }
          // 重複チェック
          if (idlist[searchData.val]) {
            // 重複する場合は追加しない
            break;
          }
          var newdata = {};
          newdata.name2 = anaattr.name;
          newdata.kind = anaattr.kind;
          newdata.attr = anaattr.attr;
          newdata.val = searchData.val;
          newdata.name =
            searchData.val == '1' ? anaattr.on_name : anaattr.off_name;
          this.$('#ca_MDCMV0130_edit_tbl').append(this.makeEditTmp(newdata));
          break;
        //			case gs_proto_defs.buttontype:
        //				if(!retStat) {
        //					return;
        //				}
        //				var newdata = {};
        //				newdata.name = anaattr.name;
        //				newdata.kind = anaattr.kind;
        //				newdata.attr = anaattr.attr;
        //				newdata.val = searchData.val;
        //				newdata.name2 = searchData.name;
        //				// 重複チェック
        //				if(idlist[newdata.val]){
        //					// 重複する場合は追加しない
        //					break;
        //				}
        //				this.$('#ca_MDCMV0130_edit_tbl').append(this.makeEditTmp(newdata));
        //				break;
        case am_proto_defs.AM_PROTO_ACTYPE_TYPE:
        case am_proto_defs.AM_PROTO_ACTYPE_CDNAME:
        case am_proto_defs.AM_PROTO_ACTYPE_STAFFCDNAME:
          var chkId = [];
          $.each(
            this.$('#ca_MDCMV0130_tbody').find(
              '[name=ca_MDCMV0130_chk]:checked'
            ),
            function () {
              var tr = $(this).closest('tr');
              chkId.push(tr.get(0).id);
            }
          );

          var idname = '';
          switch (Number(anaattr.actype)) {
            case am_proto_defs.AM_PROTO_ACTYPE_TYPE:
              idname = 'type_id';
              break;
            case am_proto_defs.AM_PROTO_ACTYPE_STAFFCDNAME:
            case am_proto_defs.AM_PROTO_ACTYPE_CDNAME:
              idname = 'cn_id';
              break;
          }

          if (chkId.length > 0) {
            var selectlist = this.getData(chkId, idname);
            var html_source = '';
            for (var i = 0; i < selectlist.length; i++) {
              var select = selectlist[i];

              // 追加可能な要素数を超えている場合はこれ以上追加しない
              if (num == clcom.list_max) {
                this.validator.setErrorInfo({
                  _eb_: clutil.fmtargs(clmsg.number_overflow, [clcom.list_max]),
                });
                break;
              }
              // 重複チェック
              if (idlist[select[idname]]) {
                // 重複する場合は追加しない
                continue;
              }
              // 重複していない場合は追加
              var newdata = {};
              newdata.val = select[idname];
              newdata.code = select.code;
              newdata.name = select.name;
              newdata.attr = anaattr.attr;
              newdata.name2 = anaattr.name;
              // 種別を挿入する
              newdata.kind = amgbp_AnaDefs.AMGBA_DEFS_KIND_MEMBATTR;

              html_source += this.makeEditTmp(newdata, idname);
              num++;
            }
            this.$('#ca_MDCMV0130_edit_tbl').append(html_source);
          } else {
            // なにもしない
          }
          // 全選択チェックボックスを初期化
          this.chkall.init();

          break;
        case am_proto_defs.AM_PROTO_ACTYPE_ORG:
          if (!retStat) {
            return;
          }
          // 重複チェック
          if (idlist[searchData.val]) {
            // 重複する場合は追加しない
            break;
          }
          var newdata = {};
          newdata.name2 = anaattr.name;
          newdata.kind = anaattr.kind;
          newdata.attr = anaattr.attr;
          newdata.val = searchData.val;
          newdata.name = searchData.name;
          newdata.code = searchData.code;
          this.$('#ca_MDCMV0130_edit_tbl').append(this.makeEditTmp(newdata));
          break;
        case am_proto_defs.AM_PROTO_ACTYPE_BIRTH_MONTH:
          var html_source = '';
          $.each(searchData, function (key, value) {
            if (value) {
              // 重複チェック
              if (idlist[key]) {
                // 重複する場合は追加しない
                return true;
              }
              var newdata = {};
              newdata.name2 = anaattr.name;
              newdata.kind = anaattr.kind;
              newdata.attr = anaattr.attr;
              newdata.val = key;
              newdata.name = key + '月';
              html_source += _this.makeEditTmp(newdata);
            }
          });
          this.$('#ca_MDCMV0130_edit_tbl').append(html_source);
          break;
        default:
          break;
      }
      // アニメーション表示のための初期化
      clutil.initUIelement(this.$el);
    },

    // Idより選択されたデータを取得
    getData: function (chkId, idname) {
      var selectData = [];
      for (var i = 0; i < this.typelist.length; i++) {
        var data = this.typelist[i];
        for (var j = 0; j < chkId.length; j++) {
          var selectId = chkId[j];
          if (data[idname] == selectId) {
            selectData.push(data);
            break;
          }
        }
      }
      return selectData;
    },

    /**
     * 編集領域テンプレート
     */
    makeEditTmp: function (data) {
      var html_source = '';
      html_source += '<li id="' + data.attr + '"><span>';
      if (clutil.chkStr(data.code)) {
        html_source += data.code + ':';
      } else {
        data.code = '';
      }
      html_source += data.name + '</span><span class="code">';
      html_source +=
        data.name2 +
        '</span><span class="btn-delete ca_MDCMV0130_edit_del"></span>';
      html_source +=
        '<input type="hidden" name="kind" value="' + data.kind + '">';
      html_source +=
        '<input type="hidden" name="attr" value="' + data.attr + '">';
      html_source +=
        '<input type="hidden" name="val" value="' + data.val + '">';
      if (data.val2) {
        html_source +=
          '<input type="hidden" name="val2" value="' + data.val2 + '">';
      }
      html_source +=
        '<input type="hidden" name="name" value="' + data.name + '">';
      html_source +=
        '<input type="hidden" name="name2" value="' + data.name2 + '">';
      html_source +=
        '<input type="hidden" name="code" value="' + data.code + '">';
      html_source += '</li>';

      return html_source;
    },

    /**
     * 編集領域単一削除ボタン
     */
    _onEditDelClick: function (e) {
      // クリックされた行を削除する
      $(e.target)
        .closest('li')
        .fadeOut(300)
        .queue(function () {
          this.remove();
        });
      this.$('#ca_MDCMV0130_add').focus();
    },

    /**
     * 編集領域すべて削除ボタン押下
     */
    _onEditDelAllClick: function () {
      // 削除対象IDリストを取得する
      var idlist = [];
      var html_source = '';
      this.$('#ca_MDCMV0130_edit_tbl').html('');
      this.$('#innerScroll').perfectScrollbar('update');
    },

    /**
     * テーブルに表示されている編集リストを取得する
     */
    getEditList: function () {
      var editlist = clutil.tableview2data(
        this.$('#ca_MDCMV0130_edit_tbl').children()
      );
      return editlist;
    },

    /**
     * 確定ボタン押下
     */
    _onCommitClick: function () {
      this.validator.clear();

      // 編集リストを取得
      this.$parentView.show();
      this.okProc(this.getEditList());
      this.$el.html('');
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode();
    },

    // 選択時処理  呼び出し側で override する
    okProc: function () {
      // 上位で上書きする。
    },

    /**
     * キャンセル
     */
    _onCancelClick: function () {
      this.$parentView.show();
      this.okProc(null);
      this.$el.html('');
      clutil.leaveEnterFocusMode();
      clutil.enterFocusMode();
    },
  });
});
