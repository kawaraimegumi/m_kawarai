$(function () {
  var AMGAV2010Const = {
    AMCM_VAL_SCHEDULE_CYCLE_OTHER: -1, // その他
    AMCM_VAL_SCHEDULE_CYCLE_LASTDAY: 99, // 末日
  };
  var MainView = Backbone.View.extend({
    el: $('#ca_main'),
    events: {
      'change #cycle_type_1': 'onchangeCycleType1', // サイクル1変更
      'change #cycle_type_2': 'onchangeCycleType2', // サイクル2変更
      'click #tg_date_append_button': 'onclickTgDateAppendButton', // 特定日[追加]押下
      'click .tg_date_remove_button': 'onclickTgDateRemoveButton', // 特定日[削除]押下
      'click #tg_time_append_button': 'onclickTgTimeAppendButton', // 時刻[追加]押下
      'click .tg_time_remove_button': 'onclickTgTimeRemoveButton', // 時刻[削除]押下
      'click #template_file_download_button':
        'onclickTemplateFileDownloadButton', // 貼付ファイル名押下
      'click #template_file_remove_button': 'onclickTemplateFileRemoveButton', // [貼付ファイルを削除]押下
      'click #func_search_button': 'onclickFuncSearchButton', // [機能検索]押下
      'click .func_remove_button': 'onclickFuncRemoveButton', // 帳票作成機能[削除]押下
      'click #to_mailaddr_append_button': 'onclickToMailaddrAppendButton', // 配信メールアドレス[追加]押下
      'click .to_mailaddr_remove_button': 'onclickToMailaddrRemoveButton', // 配信メールアドレス[削除]押下
      'change [name=notice]:checked': 'onchangeNotice', // エラー通知有無変更
    },

    initialize: function (opt) {
      _.bindAll(this);
      var fixopt = _.defaults(opt || {}, {
        opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
        chkData: [],
      });
      this.options = fixopt;

      var mdBaseViewOpt = _.bind(function (o) {
        var mdOpt = {
          title: '帳票作成',
          //   subtitle: '',
          confirmLeaving: true,
          opeTypeId: o.opeTypeId,
          pageCount: o.chkData.length,
          btn_csv: false,
          buildGetReqFunction: this.buildGetReqFunction,
          buildSubmitReqFunction: this.buildSubmitReqFunction,
        };
        return mdOpt;
      }, this)(fixopt);
      this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

      $('.cl_echoback').hide();
      this.validator = clutil.validator($('#ca_main'), {
        echoback: $('.cl_echoback'),
      });

      switch (fixopt.opeTypeId) {
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
          clutil.mediator.on('onMDSubmitCompleted', this.onMDSubmitCompleted);
          break;
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
          clutil.mediator.on('onMDGetCompleted', this.onMDGetCompleted);
          clutil.mediator.on('onMDSubmitCompleted', this.onMDSubmitCompleted);
          break;
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
          clutil.mediator.on('onMDGetCompleted', this.onMDGetCompleted);
          break;
        default:
          break;
      }
    },

    initUIElement: function () {
      this.mdBaseView.initUIElement();
      // 権限
      var permfunc = clcom.getPermfuncByCode();
      var f_allow_em = permfunc.f_allow_em;
      // 帳票出力形式
      this.outputTypeList = [
        {
          id: amcm_type.AMCM_VAL_FORM_OUTPUT_EXCEL,
          name: 'Excel',
        },
        {
          id: amcm_type.AMCM_VAL_FORM_OUTPUT_PDF,
          name: 'PDF',
        },
        {
          id: amcm_type.AMCM_VAL_FORM_OUTPUT_IMAGE,
          name: '画像',
        },
      ];
      clutil.cltypeselector3({
        $select: $('#output_type'),
        list: this.outputTypeList,
        unselectedflag: false,
      });
      // 実行期間
      clutil.datepicker($('#period_from'));
      clutil.datepicker($('#period_to'));
      // サイクル
      this.cycleType1List = [
        {
          id: amcm_type.AMCM_VAL_SCHEDULE_CYCLE_EVERYDAY,
          name: '毎日',
        },
        {
          id: AMGAV2010Const.AMCM_VAL_SCHEDULE_CYCLE_OTHER,
          name: 'その他',
        },
      ];
      clutil.cltypeselector3({
        $select: $('#cycle_type_1'),
        list: this.cycleType1List,
        unselectedflag: false,
      });
      this.cycleType2List = [
        {
          id: amcm_type.AMCM_VAL_SCHEDULE_CYCLE_WDAY,
          name: '毎週',
        },
        {
          id: amcm_type.AMCM_VAL_SCHEDULE_CYCLE_DOM,
          name: '毎月',
        },
        {
          id: amcm_type.AMCM_VAL_SCHEDULE_CYCLE_DATE,
          name: '特定日',
        },
      ];
      clutil.cltypeselector3({
        $select: $('#cycle_type_2'),
        list: this.cycleType2List,
        unselectedflag: false,
      });
      // 曜日
      this.tgWdayList = [
        {
          id: amcm_type.AMCM_VAL_DAY_OF_WEEK_MON,
          name: '月',
        },
        {
          id: amcm_type.AMCM_VAL_DAY_OF_WEEK_TUE,
          name: '火',
        },
        {
          id: amcm_type.AMCM_VAL_DAY_OF_WEEK_WED,
          name: '水',
        },
        {
          id: amcm_type.AMCM_VAL_DAY_OF_WEEK_THU,
          name: '木',
        },
        {
          id: amcm_type.AMCM_VAL_DAY_OF_WEEK_FRI,
          name: '金',
        },
        {
          id: amcm_type.AMCM_VAL_DAY_OF_WEEK_SAT,
          name: '土',
        },
        {
          id: amcm_type.AMCM_VAL_DAY_OF_WEEK_SUN,
          name: '日',
        },
      ];
      clutil.cltypeselector3({
        $select: $('#tg_wday'),
        list: this.tgWdayList,
        unselectedflag: false,
      });
      // 日にち
      this.tgDomList = _.map(_.range(1, 29), function (day) {
        return {
          id: day,
          name: String(day),
        };
      });
      this.tgDomList.push({
        id: AMGAV2010Const.AMCM_VAL_SCHEDULE_CYCLE_LASTDAY,
        name: '末日',
      });
      clutil.cltypeselector3({
        $select: $('#tg_dom'),
        list: this.tgDomList,
        unselectedflag: false,
      });
      // 時刻
      this.tgTimeHHList = _.map(_.range(8, 23), function (hour) {
        return {
          id: hour,
          name: ('0' + hour).slice(-2),
        };
      });
      this.tgTimeMMList = _.map(_.range(0, 60, 30), function (minute) {
        return {
          id: minute,
          name: ('0' + minute).slice(-2),
        };
      });
      if (f_allow_em) {
        $('#tg_time_field').show();
      }
      // Excelテンプレート
      var fileType = _.defaults(
        {
          extension: [/\.xlsm$/i, /\.xlsx$/i],
        },
        clutil.View.FileTypes.excel
      );
      var fileUploadButtonView = clutil.View.buildFileUploadButtonView(
    	// MD-4522 テンプレートのファイルサイズの上限値を設定(100MB)
        $('#template_file_upload_button'),
        {
          fileType: fileType,
          maxFileSize: 1024 * 100000,
        }
      );
      fileUploadButtonView.on(
        'success',
        _.bind(function (file) {
          this.validator.clearErrorMsg($('#template_file'));
          this.setTemplateFile({
            id: file.id,
            name: file.filename,
            uri: file.uri,
          });
        }, this)
      );
      // 帳票作成機能
      this.AMPAV0080Selector = new AMPAV0080SelectorView({
        el: $('#AMPAV0080_dialog'),
        $parentView: $('#mainColumn'),
        select_mode: clutil.cl_multiple_select,
        isAnalyse_mode: false,
      });
      this.AMPAV0080Selector.render();
      this.catalogOutputTypeList = [
        {
          id: amcm_type.AMCM_VAL_ANA_OUTPUT_XLS,
          name: 'Excel',
        },
        {
          id: amcm_type.AMCM_VAL_ANA_OUTPUT_CSV,
          name: 'CSV',
        },
      ];
      // 配信メールアドレス
      if (f_allow_em) {
        $('#to_mailaddr_field').show();
      }
      // メモ
      if (f_allow_em) {
        $('#memo2').get(0).innerText =
          '<メール本文>ｘｘｘｘｘ</メール本文>と記載すると、ｘｘｘｘｘの記載部分（改行可）がメール配信時の本文となります。';
      }
      // 初期値
      this.setForm();
      // 削除時は入力不可とする
      switch (this.options.opeTypeId) {
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
          this.viewReadonly();
          break;
      }
      return this;
    },

    // setter
    setForm: function (form) {
      form = form || {};
      $('#id').val(form.id || 0);
      $('#name').val(form.name || '');
      $('#output_type').selectpicker('val', form.outputTypeID || 0);
      this.setPeriod(form.period);
      this.setTgWdayList(form.tgWdayList);
      this.setTgDomList(form.tgDomList);
      this.setTgDateList(form.tgDateList);
      this.setTgTimeList(form.tgTimeList);
      this.setCycleTypeIDList(form.cycleTypeIDList);
      this.setTemplateFile(form.templateFile);
      this.setFuncList(form.funcList);
      this.setToMailaddrList(form.toMailaddrList);
      this.setNotice(form.notice);
      this.setNoticeMailaddr(form.noticeMailaddr);
      $('#memo').val(form.memo || '');
      $($('[name=trial]')[1 - (form.trial || 0)]).radio('check');
      // MD帳票がfuncListに存在すれば試行を変更不可にする
      var vals = [];
      var funcList = document.getElementById('func_tbody');
      var func_len = funcList.rows.length;
      for (var i = 0; i < func_len; i++) {
    	  var val = Number(funcList.rows.item(i).cells[0].getElementsByTagName('input')[0].value)
    	  vals.push(val);
      }
      if (vals.includes(amcm_type.AMCM_VAL_FORM_FUNC_MD_FORM)) {
    	  clutil.viewReadonly($('#ca_trial'));
    	  $($('[name=trial]')[1]).radio('check');
      }
    },

    // 実行期間 setter
    setPeriod: function (period) {
      period = period || {};
      this.setDate(period.from, $('#period_from'));
      this.setDate(period.to, $('#period_to'));
    },

    // サイクルリスト setter
    setCycleTypeIDList: function (cycleTypeIDList) {
      this.setCycleType1ID(cycleTypeIDList);
      this.setCycleType2IDList(cycleTypeIDList);
      this.controlScheduleField();
    },

    // サイクル1 setter
    setCycleType1ID: function (cycleTypeIDList) {
      cycleTypeIDList = _.isEmpty(cycleTypeIDList)
        ? [amcm_type.AMCM_VAL_SCHEDULE_CYCLE_EVERYDAY]
        : cycleTypeIDList;
      var cycleType1ID = _.contains(
        cycleTypeIDList,
        amcm_type.AMCM_VAL_SCHEDULE_CYCLE_EVERYDAY
      )
        ? amcm_type.AMCM_VAL_SCHEDULE_CYCLE_EVERYDAY
        : AMGAV2010Const.AMCM_VAL_SCHEDULE_CYCLE_OTHER;
      $('#cycle_type_1').selectpicker('val', cycleType1ID);
    },

    // サイクル2 setter
    setCycleType2IDList: function (cycleTypeIDList) {
      cycleTypeIDList = _.isEmpty(cycleTypeIDList)
        ? [amcm_type.AMCM_VAL_SCHEDULE_CYCLE_EVERYDAY]
        : cycleTypeIDList;
      var cycleType2IDList = _.contains(
        cycleTypeIDList,
        amcm_type.AMCM_VAL_SCHEDULE_CYCLE_EVERYDAY
      )
        ? []
        : cycleTypeIDList;
      $('#cycle_type_2').selectpicker('val', cycleType2IDList);
    },

    // スケジュール入力項目の状態を制御する
    controlScheduleField: function () {
      var cycleType1ID = this.getCycleType1ID();
      if (cycleType1ID == amcm_type.AMCM_VAL_SCHEDULE_CYCLE_EVERYDAY) {
        this.hideCycleType2();
        this.hideTgWday();
        this.hideTgDom();
        this.hideTgDate();
      } else {
        this.showCycleType2();
        var cycleType2IDList = this.getCycleType2IDList();
        if (
          _.contains(cycleType2IDList, amcm_type.AMCM_VAL_SCHEDULE_CYCLE_WDAY)
        ) {
          this.showTgWday();
        } else {
          this.hideTgWday();
        }
        if (
          _.contains(cycleType2IDList, amcm_type.AMCM_VAL_SCHEDULE_CYCLE_DOM)
        ) {
          this.showTgDom();
        } else {
          this.hideTgDom();
        }
        if (
          _.contains(cycleType2IDList, amcm_type.AMCM_VAL_SCHEDULE_CYCLE_DATE)
        ) {
          this.showTgDate();
        } else {
          this.hideTgDate();
        }
      }
    },

    // 曜日リスト setter
    setTgWdayList: function (tgWdayList) {
      tgWdayList = _.isEmpty(tgWdayList) ? [] : tgWdayList;
      $('#tg_wday').selectpicker('val', tgWdayList);
    },

    // 日にちリスト setter
    setTgDomList: function (tgDomList) {
      tgDomList = _.isEmpty(tgDomList) ? [] : tgDomList;
      $('#tg_dom').selectpicker('val', tgDomList);
    },

    // 特定日リスト setter
    setTgDateList: function (tgDateList) {
      tgDateList = _.isEmpty(tgDateList) ? [0] : tgDateList;
      $('#tg_date_tbody').empty();
      for (var tgDate of tgDateList) {
        var $tr = this.appendTgDateRow();
        this.setDate(tgDate, $tr.find('[name=tg_date]'));
      }
    },

    // 特定日 行追加
    appendTgDateRow: function () {
      return this.appendRow(
        $('#tg_date_tbody'),
        $('#tg_date_tbody_template'),
        _.bind(function ($tr) {
          clutil.datepicker($tr.find('[name=tg_date]'));
          this.controlTgDateRemoveButton();
        }, this)
      );
    },

    // 特定日[削除]ボタンの操作可否を制御する
    controlTgDateRemoveButton: function () {
      var $removeButtonList = this.valuesTo$Object($('.tg_date_remove_button'));
      var len = $removeButtonList.length;
      if (!len) {
        return this.appendTgDateRow();
      } else if (len == 1) {
        var isDisabled = true;
      } else {
        var isDisabled = false;
      }
      $removeButtonList[0].attr('disabled', isDisabled);
    },

    // 時刻リスト setter
    setTgTimeList: function (tgTimeList) {
      tgTimeList = _.isEmpty(tgTimeList) ? [] : tgTimeList;
      $('#tg_time_tbody').empty();
      for (var tgTime of tgTimeList) {
        var $tr = this.appendTgTimeRow();
        tgTime = tgTime || 0;
        $tr
          .find('[name=tg_time_hh]')
          .selectpicker('val', (tgTime - (tgTime % 100)) / 100);
        $tr.find('[name=tg_time_mm]').selectpicker('val', tgTime % 100);
      }
    },

    // 時刻 行追加
    appendTgTimeRow: function () {
      return this.appendRow(
        $('#tg_time_tbody'),
        $('#tg_time_tbody_template'),
        _.bind(function ($tr) {
          clutil.cltypeselector3({
            $select: $tr.find('[name=tg_time_hh]'),
            list: this.tgTimeHHList,
            unselectedflag: false,
          });
          clutil.cltypeselector3({
            $select: $tr.find('[name=tg_time_mm]'),
            list: this.tgTimeMMList,
            unselectedflag: false,
          });
        }, this)
      );
    },

    // Excelテンプレート setter
    setTemplateFile: function (templateFile) {
      templateFile = templateFile || {};
      $('#template_file_id').val(templateFile.id || 0);
      $('#template_file_name').val(templateFile.name || '');
      $('#template_file_uri').val(templateFile.uri || '');
      this.controlTemplateFileDownloadButton(true);
    },

    // 貼付ファイルのダウンロード可否を制御する
    controlTemplateFileDownloadButton: function (downloadable) {
      var templateFile = this.getTemplateFile();
      if (downloadable) {
        var html =
          '<a class="cl_filedownld" id="template_file_download_button" target="_blank">' +
          templateFile.name +
          '</a>';
        var isDisabled = false;
      } else {
        var html = templateFile.name;
        var isDisabled = true;
      }
      var $templateFile = $('#template_file');
      $templateFile.html(html);
      $templateFile.attr('disabled', isDisabled);
    },

    // 帳票作成機能リスト setter
    setFuncList: function (funcList) {
      funcList = _.isEmpty(funcList) ? [] : funcList;
      $('#func_tbody').empty();
      for (var func of funcList) {
        var $tr = this.appendFuncRow();
        func = func || {};
        $tr.find('[name=type_id]').val(func.typeID || 0);
        $tr.find('[name=type_name]').val(func.typeName || '');
        $tr.find('[name=id]').val(func.id || 0);
        $tr.find('[name=name]').val(func.name || '');
        $tr
          .find('[name=catalog_output_type]')
          .selectpicker('val', func.catalogOutputTypeID || 0);
        $tr.find('[name=sheet_name]').val(func.sheetName || '');
        $tr.find('[name=paste_top]').val(func.pasteTop || '');
        $tr.find('[name=paste_bottom]').val(func.pasteBottom || '');
        $tr.find('[name=from]').datepicker('setIymd', func.from || 0);
        $tr.find('[name=to]').datepicker('setIymd', func.to || 0);
      }
    },

    // 帳票作成機能 行追加
    appendFuncRow: function () {
      return this.appendRow(
        $('#func_tbody'),
        $('#func_tbody_template'),
        _.bind(function ($tr) {
          clutil.cltypeselector3({
            $select: $tr.find('[name=catalog_output_type]'),
            list: this.catalogOutputTypeList,
            unselectedflag: false,
          });
          clutil.datepicker($tr.find('[name=from]'));
          clutil.datepicker($tr.find('[name=to]'));
        }, this)
      );
    },

    // 配信メールアドレスリスト setter
    setToMailaddrList: function (toMailaddrList) {
      toMailaddrList = _.isEmpty(toMailaddrList) ? [] : toMailaddrList;
      $('#to_mailaddr_tbody').empty();
      for (var toMailaddr of toMailaddrList) {
        var $tr = this.appendToMailaddrRow();
        $tr.find('[name=to_mailaddr]').val(toMailaddr || '');
      }
    },

    // 配信メールアドレス 行追加
    appendToMailaddrRow: function () {
      return this.appendRow(
        $('#to_mailaddr_tbody'),
        $('#to_mailaddr_tbody_template')
      );
    },

    // エラー通知有無 setter
    setNotice: function (notice) {
      notice = notice || 0;
      $($('[name=notice]')[1 - notice]).radio('check');
      this.controlNoticeMailaddr();
    },

    // 通知メールアドレスの入力可否を制御する
    controlNoticeMailaddr: function () {
      var notice = this.getNotice();
      var $noticeMailaddr = $('#noticeMailaddr');
      switch (notice) {
        case 1:
          $noticeMailaddr.attr('disabled', false);
          $noticeMailaddr.addClass('cl_required');
          break;
        case 0:
          $noticeMailaddr.attr('disabled', true);
          $noticeMailaddr.removeClass('cl_required');
          this.validator.clearErrorMsg($noticeMailaddr);
          this.setNoticeMailaddr('');
          break;
        default:
          break;
      }
    },

    // 通知メールアドレス setter
    setNoticeMailaddr: function (noticeMailaddr) {
      noticeMailaddr = noticeMailaddr || '';
      $('#noticeMailaddr').val(noticeMailaddr);
    },

    // カレンダーデータ setter
    setDate: function (date, $date) {
      $date.datepicker('setIymd', date || 0);
    },

    // テーブル 行追加
    appendRow: function ($tbody, $tbody_template, initializeRow) {
      $tbody_template.tmpl().appendTo($tbody);
      var $trList = this.valuesTo$Object($tbody.children());
      var $tr = $trList[$trList.length - 1];
      if (initializeRow) {
        initializeRow($tr);
      }
      return $tr;
    },

    render: function () {
      this.mdBaseView.render();
      this.mdBaseView.fetch();
      return this;
    },

    buildGetReqFunction: function (opeTypeId, pgIndex) {
      return {
        resId: clcom.pageId,
        data: {
          reqHead: {
            opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
          },
          AMGAV2010GetReq: {
            form: clcom.pageArgs.form[pgIndex],
          },
        },
      };
    },

    buildSubmitReqFunction: function (opeTypeId, pgIndex) {
      switch (opeTypeId) {
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
        case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
          if (!this.validate()) {
            return;
          }
          break;
        default:
          break;
      }
      return {
        resId: clcom.pageId,
        data: {
          reqHead: {
            opeTypeId: opeTypeId,
          },
          AMGAV2010UpdReq: {
            form: this.getForm(),
          },
        },
      };
    },

    // 入力チェック
    validate: function () {
      this.clearError();
      var isValid = this.validator.valid();
      var form = this.getForm();
      // 帳票名
      // 全角文字、半角英数字、半角アンダーバー(_)、半角ハイフン(-)以外はエラー
      for (var c of form.name) {
        if (
          /[^ -~｡-ﾟ]/.test(c) ||
          /[a-zA-Z0-9]/.test(c) ||
          c == '_' ||
          c == '-' ||
          c == '+'
        ) {
          continue;
        }
        this.validator.setErrorMsg(
          $('#name'),
          '全角文字、半角英数字、半角アンダーバー(_)、半角ハイフン(-)、半角プラス(+)のみ入力可能です。'
        );
        isValid = false;
        break;
      }
      // 実行期間
      // 開始日 > 終了日 の場合はエラー
      if (
        !this.validator.validFromToObj([
          {
            $stval: $('#period_from'),
            $edval: $('#period_to'),
          },
        ])
      ) {
        isValid = false;
      }
      // Excelテンプレート
      // 未貼付の場合はエラー
      var templateFile = this.getTemplateFile();
      if (!templateFile.id) {
        this.validator.setErrorMsg($('#template_file'), '貼付してください。');
        isValid = false;
      }
      // 帳票作成機能
      // 未入力の場合はエラー
      var funcList = form.funcList;
      if (!funcList.length) {
        this.setFuncRequiredError();
        isValid = false;
      }
      var $funcRowList = this.valuesTo$Object($('#func_tbody').children());
      for (var i = 0; i < funcList.length; i++) {
        var func = funcList[i];
        var id = func.id;
        var pasteTop = func.pasteTop;
        var pasteBottom = func.pasteBottom;
        var $funcRow = $funcRowList[i];
        var $name = $funcRow.find('[name=name]');
        var $pasteTop = $funcRow.find('[name=paste_top]');
        var $pasteBottom = $funcRow.find('[name=paste_bottom]');
        var $from = $funcRow.find('[name=from]');
        var $to = $funcRow.find('[name=to]');
        if (!id) {
          this.validator.setErrorMsg($name, clmsg.EGA0046);
          isValid = false;
          continue;
        }
        if (pasteTop || pasteBottom) {
          // 右下のみ入力されている場合はエラー
          if (!pasteTop) {
            this.validator.setErrorMsg(
              $pasteTop,
              '貼付位置の設定は「未設定」「左上のみ」「両方」のどれかとしてください。'
            );
            this.validator.setErrorMsg(
              $pasteBottom,
              '貼付位置の設定は「未設定」「左上のみ」「両方」のどれかとしてください。'
            );
            isValid = false;
          } else {
            // 貼付位置がA1形式でない場合はエラー
            if (!this.isCellFormat(pasteTop)) {
              this.validator.setErrorMsg($pasteTop, clmsg.EGA0033);
              isValid = false;
            } else if (pasteBottom) {
              // 貼付位置がA1形式でない場合はエラー
              if (!this.isCellFormat(pasteBottom)) {
                this.validator.setErrorMsg($pasteBottom, clmsg.EGA0033);
                isValid = false;
              } else if (!this.compareCellCoordinates(pasteTop, pasteBottom)) {
                // 貼付位置(右下)に貼付位置(左上)より左または上のセルが指定されている場合はエラー
                this.validator.setErrorMsg($pasteTop, clmsg.EGA0034);
                this.validator.setErrorMsg($pasteBottom, clmsg.EGA0034);
                isValid = false;
              }
            }
          }
        }
        // 検索期間
        // 開始日 > 終了日 の場合はエラー
        if (
          !this.validator.validFromToObj([
            {
              $stval: $from,
              $edval: $to,
            },
          ])
        ) {
          isValid = false;
        }
      }
      return isValid;
    },

    // エラーをクリアする
    clearError: function () {
      this.validator.clear();
      this.validator.clearErrorMsg($('#template_file'));
      this.clearFuncRequiredError();
    },

    // 帳票作成機能の未入力エラーをクリアする
    clearFuncRequiredError: function () {
      var $funcTable = $('#func_tbody').closest('.table');
      $funcTable.removeClass('cl_error_field');
      this.validator.clearErrorMsg($funcTable);
    },

    // 帳票作成機能の未入力エラーをセットする
    setFuncRequiredError: function () {
      var $funcTable = $('#func_tbody').closest('.table');
      $funcTable.addClass('cl_error_field');
      this.validator.setErrorMsg($funcTable, clmsg.cl_required);
    },

    // 文字列がA1形式であるかを確認する
    isCellFormat: function (str) {
      return str.match(/^[A-Z]{1,}[0-9]{1,}$/) != null;
    },

    // セルの座標を比較する
    compareCellCoordinates: function (cell1, cell2) {
      var row1 = this.getCellRow(cell1);
      var row2 = this.getCellRow(cell2);
      if (row1 > row2) {
        return false;
      }
      var column1 = this.getCellColumn(cell1);
      var column2 = this.getCellColumn(cell2);
      if (column1 > column2) {
        return false;
      }
      return true;
    },

    // セルの行番号(数値)を取得する
    getCellRow: function (cell) {
      return Number(cell.match(/[0-9]{1,}$/)[0]);
    },

    // セルの列番号(数値)を取得する
    getCellColumn: function (cell) {
      return _.reduce(
        cell.match(/^[A-Z]{1,}/)[0].split(''),
        function (memo, al) {
          return 26 * memo + parseInt(al, 36) - 9;
        },
        0
      );
    },

    // getter
    getForm: function () {
      return {
        id: Number($('#id').val() || ''),
        name: $('#name').val() || '',
        outputTypeID: Number($('#output_type').selectpicker('val') || ''),
        period: this.getPeriod(),
        cycleTypeIDList: this.getCycleTypeIDList(),
        tgWdayList: this.getTgWdayList(),
        tgDomList: this.getTgDomList(),
        tgDateList: this.getTgDateList(),
        tgTimeList: this.getTgTimeList(),
        templateFile: this.getTemplateFile(),
        funcList: this.getFuncList(),
        toMailaddrList: this.getToMailaddrList(),
        notice: this.getNotice(),
        noticeMailaddr: this.getNoticeMailaddr(),
        memo: $('#memo').val() || '',
        trial: Number($('[name=trial]:checked').val() || ''),
      };
    },

    // 実行期間 getter
    getPeriod: function () {
      return {
        from: this.getDate($('#period_from')),
        to: this.getDate($('#period_to')),
      };
    },

    // サイクルリスト getter
    getCycleTypeIDList: function () {
      var cycleType1ID = this.getCycleType1ID();
      return cycleType1ID == amcm_type.AMCM_VAL_SCHEDULE_CYCLE_EVERYDAY
        ? [amcm_type.AMCM_VAL_SCHEDULE_CYCLE_EVERYDAY]
        : this.getCycleType2IDList();
    },

    // サイクル1 getter
    getCycleType1ID: function () {
      return Number($('#cycle_type_1').selectpicker('val') || '');
    },

    // サイクル2 getter
    getCycleType2IDList: function () {
      return this.valuesToNumber($('#cycle_type_2').selectpicker('val') || []);
    },

    // 曜日リスト getter
    getTgWdayList: function () {
      return _.contains(
        this.getCycleTypeIDList(),
        amcm_type.AMCM_VAL_SCHEDULE_CYCLE_WDAY
      )
        ? this.valuesToNumber($('#tg_wday').selectpicker('val') || [])
        : [];
    },

    // 日にちリスト getter
    getTgDomList: function () {
      return _.contains(
        this.getCycleTypeIDList(),
        amcm_type.AMCM_VAL_SCHEDULE_CYCLE_DOM
      )
        ? this.valuesToNumber($('#tg_dom').selectpicker('val') || [])
        : [];
    },

    // 特定日リスト getter
    getTgDateList: function () {
      return _.contains(
        this.getCycleTypeIDList(),
        amcm_type.AMCM_VAL_SCHEDULE_CYCLE_DATE
      )
        ? this.getTableData($('#tg_date_tbody'), function (viewData) {
            return viewData.tg_date || 0;
          })
        : [];
    },

    // 時刻リスト getter
    getTgTimeList: function () {
      return this.getTableData($('#tg_time_tbody'), function (viewData) {
        return (
          Number(viewData.tg_time_hh || '') * 100 +
          Number(viewData.tg_time_mm || '')
        );
      });
    },

    // Excelテンプレート getter
    getTemplateFile: function () {
      return {
        id: Number($('#template_file_id').val() || ''),
        name: $('#template_file_name').val() || '',
        uri: $('#template_file_uri').val() || '',
      };
    },

    // 帳票作成機能リスト getter
    getFuncList: function () {
      return this.getTableData($('#func_tbody'), function (viewData) {
        return {
          typeID: Number(viewData.type_id || ''),
          typeName: viewData.type_name || '',
          id: Number(viewData.id || ''),
          name: viewData.name || '',
          catalogOutputTypeID: Number(viewData.catalog_output_type || ''),
          sheetName: viewData.sheet_name || '',
          pasteTop: viewData.paste_top || '',
          pasteBottom: viewData.paste_bottom || '',
          from: Number(viewData.from || ''),
          to: Number(viewData.to || ''),
        };
      });
    },

    // 配信メールアドレスリスト getter
    getToMailaddrList: function () {
      return this.getTableData($('#to_mailaddr_tbody'), function (viewData) {
        return viewData.to_mailaddr || '';
      });
    },

    // エラー通知有無 getter
    getNotice: function () {
      return Number($('[name=notice]:checked').val() || '');
    },

    // 通知メールアドレス getter
    getNoticeMailaddr: function () {
      return $('#noticeMailaddr').val() || '';
    },

    // カレンダーデータ getter
    getDate: function ($date) {
      return clutil.dateFormat($date.datepicker('getDate'), 'yyyymmdd') || 0;
    },

    // テーブルデータ getter
    getTableData: function ($tbody, iteratee) {
      var viewDataList = clutil.tableview2data($tbody.children());
      return _.map(viewDataList, iteratee);
    },

    // 配列やオブジェクトの各要素を数値化する
    valuesToNumber: function (obj) {
      var xdst = [];
      for (var k in obj) {
        xdst[k] = Number(obj[k]);
      }
      return xdst;
    },

    onMDGetCompleted: function (args, e) {
      switch (args.status) {
        case 'OK':
        case 'DONE':
          var data = args.data || {};
          var form = data.AMGAV2010GetRsp.form || {};
          switch (this.options.opeTypeId) {
            case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
              _.extend(form, {
                id: 0,
                tgTimeList: [],
                toMailaddrList: [],
              });
              break;
          }
          this.setForm(form);
          switch (this.options.opeTypeId) {
            case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
            case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
              this.viewReadonly();
              break;
          }
          break;
        default:
          break;
      }
    },

    onMDSubmitCompleted: function (args, e) {
      switch (args.status) {
        case 'OK':
        case 'DONE':
          this.viewReadonly();
          break;
        default:
          var data = args.data || {};
          var rspHead = data.rspHead || {};
          for (var fieldMessage of rspHead.fieldMessages || []) {
            if (
              fieldMessage.field_name == 'distQy' &&
              fieldMessage.struct_name == 'AMGAV2010Func'
            ) {
              var tr = $('#func_tbody').find('tr')[fieldMessage.lineno - 1];
              var $sheetName = $(tr).find('[name=sheet_name]');
              this.validator.setErrorMsg(
                $sheetName,
                clmsg[fieldMessage.message]
              );
            }
          }
          break;
      }
    },

    // 画面を読み取り専用にする
    viewReadonly: function () {
      clutil.viewReadonly($('#ca_main'));
      this.controlTemplateFileDownloadButton(false);
      $('body').removeClass('cl_readonly');
    },

    // サイクル1変更時の処理
    onchangeCycleType1: function (e) {
      this.controlScheduleField();
    },

    // サイクル2変更時の処理
    onchangeCycleType2: function (e) {
      this.controlScheduleField();
    },

    // サイクル2を表示する
    showCycleType2: function () {
      $('#cycle_type_2_field').show();
      $('#cycle_type_2').addClass('cl_required');
    },

    // サイクル2を非表示にする
    hideCycleType2: function () {
      $('#cycle_type_2_field').hide();
      $('#cycle_type_2').removeClass('cl_required');
    },

    // 曜日を表示する
    showTgWday: function () {
      $('#tg_wday_field').show();
      $('#tg_wday').addClass('cl_required');
    },

    // 曜日を非表示にする
    hideTgWday: function () {
      $('#tg_wday_field').hide();
      $('#tg_wday').removeClass('cl_required');
    },

    // 日にちを表示する
    showTgDom: function () {
      $('#tg_dom_field').show();
      $('#tg_dom').addClass('cl_required');
    },

    // 日にちを非表示にする
    hideTgDom: function () {
      $('#tg_dom_field').hide();
      $('#tg_dom').removeClass('cl_required');
    },

    // 特定日を表示する
    showTgDate: function () {
      $('#tg_date_field').show();
      var $tgDateList = this.valuesTo$Object($('[name=tg_date]'));
      for ($tgDate of $tgDateList) {
        $tgDate.addClass('cl_required');
      }
    },

    // 特定日を非表示にする
    hideTgDate: function () {
      $('#tg_date_field').hide();
      var $tgDateList = this.valuesTo$Object($('[name=tg_date]'));
      for ($tgDate of $tgDateList) {
        $tgDate.removeClass('cl_required');
      }
    },

    // 特定日[追加]押下時の処理
    onclickTgDateAppendButton: function (e) {
      this.appendTgDateRow();
    },

    // 特定日[削除]押下時の処理
    onclickTgDateRemoveButton: function (e) {
      $(e.target.closest('tr')).remove();
      this.controlTgDateRemoveButton();
    },

    // 時刻[追加]押下時の処理
    onclickTgTimeAppendButton: function (e) {
      this.appendTgTimeRow();
    },

    // 時刻[削除]押下時の処理
    onclickTgTimeRemoveButton: function (e) {
      $(e.target.closest('tr')).remove();
    },

    // 貼付ファイル名押下時の処理
    onclickTemplateFileDownloadButton: function (e) {
      var templateFile = this.getTemplateFile();
      if (templateFile.id) {
        clutil.download({
          url: templateFile.uri,
          newWindow: false,
        });
      }
    },

    // [貼付ファイルを削除]押下時の処理
    onclickTemplateFileRemoveButton: function (e) {
      this.setTemplateFile();
    },

    // [機能検索]押下時の処理
    onclickFuncSearchButton: function (e) {
      this.AMPAV0080Selector.show();
      this.AMPAV0080Selector.okProc = _.bind(function (data) {
        if (!data) {
          return;
        }
        var funcList = data.funcList || [];
        funcList = this.getFuncList().concat(funcList);
        funcList = _.uniq(funcList, function (func) {
          var k = func.typeID + func.id;
          return (k * (k + 1)) / 2 + func.typeID;
        });
        funcList = _.sortBy(funcList, function (func) {
          return func.id;
        });
        funcList = _.sortBy(funcList, function (func) {
          return func.typeID;
        });
        if (funcList.length) {
          this.clearFuncRequiredError();
          this.setFuncList(funcList);
          // MD帳票が選択されている場合は試行を無しで変更不可
          if(funcList.some(list => list.typeID === amcm_type.AMCM_VAL_FORM_FUNC_MD_FORM)) {
        	  clutil.viewReadonly($('#ca_trial'));
        	  $($('[name=trial]')[1]).radio('check');
          } else {
        	  clutil.viewRemoveReadonly($('#ca_trial'));
          }
        }
      }, this);
    },

    // 帳票作成機能[削除]押下時の処理
    onclickFuncRemoveButton: function (e) {
      $(e.target.closest('tr')).remove();
      // 行削除時にMD帳票が残っていなければ試行を変更可にする
      var vals = [];
      var funcList = document.getElementById('func_tbody');
      var func_len = funcList.rows.length;
      for (var i = 0; i < func_len; i++) {
    	  var val = Number(funcList.rows.item(i).cells[0].getElementsByTagName('input')[0].value)
    	  vals.push(val);
      }
      if (!vals.includes(amcm_type.AMCM_VAL_FORM_FUNC_MD_FORM)) {
    	  clutil.viewRemoveReadonly($('#ca_trial'));
      }
    },

    // 配信メールアドレス[追加]押下時の処理
    onclickToMailaddrAppendButton: function (e) {
      this.appendToMailaddrRow();
    },

    // 配信メールアドレス[削除]押下時の処理
    onclickToMailaddrRemoveButton: function (e) {
      $(e.target.closest('tr')).remove();
    },

    // エラー通知有無変更時の処理
    onchangeNotice: function (e) {
      this.controlNoticeMailaddr();
    },

    // 配列の各要素をjQueryオブジェクト化する
    valuesTo$Object: function (list) {
      return _.map(list, function (value) {
        return $(value);
      });
    },
  });
  clutil
    .getIniJSON()
    .done(function (data) {
      mainView = new MainView(clcom.pageArgs).initUIElement().render();
    })
    .fail(function (data) {
      clutil.View.doAbort({
        messages: [clutil.getclmsg('cl_ini_failed')],
        rspHead: data.rspHead,
      });
    });
});
