$(function () {
  var define = {
    MDB_INVALID_RATE: -9999999999, // 意味を持たない比の値

    AMGBD_DEFS_PERIOD_QTYPE_UNCONFIRMED: 0, // 未確定
    AMGBD_DEFS_PERIOD_QTYPE_CONFIRMED: -1, // 確定済
  };
  // 小数点、カンマ編集を行う
  var toFixedLocaleString = function (number, n) {
    number = Number(number.toFixed(n));
    var fixed = number.toFixed(n).split('.');
    return Number(fixed[0]).toLocaleString() + (n ? '.' + fixed[1] : '');
  };
  // 符号、小数点、カンマ編集を行う
  var toSignedFixedLocaleString = function (number, n) {
    number = Number(number.toFixed(n));
    return (number > 0 ? '+' : '') + toFixedLocaleString(number, n);
  };
  // うるう年判定
  var isLeapYear = function (year) {
    return (!(year % 4) && year % 100) || !(year % 400);
  };
  mdbUtil = {
    // 初期データ取得用 GETメソッド
    getIniJSON: function (res, appcallback, completed) {
      // ユーザ情報を設定する
      clcom.userInfo = clcom.getUserData();
      // 組織階層を使いやすい形で持っておく
      var userInfo = clcom.userInfo;
      var orgtree = userInfo.orgtree || {};
      _.extend(userInfo, {
        orgTree: {
          unit: { org_id: orgtree.unit_id || 0 },
          area: { org_id: orgtree.area_id || 0 },
          zone: { org_id: orgtree.zone_id || 0 },
          org: { org_id: orgtree.org_id || 0 },
        },
      });

      // クッキーによるログインチェック
      if (!clcom.hasAuthCookies() || _.isEmpty(clcom.userInfo)) {
        // ログインしていない場合
        //clutil.gohome(clcom.urlRoot + '/err/nosession.html');
        var errHd = {
          status: 'error',
          message: 'cl_http_status_unauthorized',
          httpStatus: 401,
        };
        var d = $.Deferred();
        return d.reject({ head: errHd, rspHead: errHd });
      }

      // 初期パラメータの取得を仕掛ける。
      var dd = [];

      // 区分＆シスパラ
      if (
        !clcom.hasStorageKey('typelist') ||
        !clcom.hasStorageKey('sysparam') ||
        !clcom.hasStorageKey('cmdefaults')
      ) {
        var typDefer = clutil
          .postJSON('am_pa_type_get', {})
          .done(function (data) {
            // 区分をキャッシュに保存
            clcom.setTypeList(data.type);
            // シスパラをキャッシュに保存
            clcom.setSysparamList(data.sysparam);
            // 税履歴をキャッシュに保存
            clcom.setTaxHistList(data.defTaxHis);
            // 取引先別税履歴をキャッシュに保存
            clcom.setVendorTaxHistList(data.vendorTaxHis);
            // 共有デフォルト値をキャッシュに保存
            // デフォルト税率はこちらへ統合。
            var defaults = _.reduce(
              data,
              function (defs, val, key) {
                if (/^default/.test(key)) {
                  defs[key] = val;
                }
                return defs;
              },
              {}
            );
            clcom.setCmDefaults(defaults);
            clcom.loadStorage();
          });
        dd.push(typDefer);
      } else {
        // 共通デフォルト値を clcom にロードする。
        clcom.loadStorage();
      }

      // 権限
      // 権限チェック用内部関数
      var isBadPermFunc = function () {
        if (clutil._XXXDBGGetIniPermChk === false) {
          // 権限チェックをスキップする
          return;
        }
        var pageId = clcom.pageId;
        if (_.isEmpty(pageId) || !/^AM[A-Z]{2}V[0-9]{4}$/.test(pageId)) {
          // MDの画面コード体系にマッチしていないので、権限制限外（制限を受けない）と判断する。
          return; // OK
        }
        var pm = clcom.getPermfuncByCode(pageId);
        if (
          !_.isEmpty(pm) &&
          (pm.f_allow_del ||
            pm.f_allow_em ||
            pm.f_allow_read ||
            pm.f_allow_write)
        ) {
          return; // OK
        }
        // 権限ＮＧ - 403 アク禁として扱う
        return (errHd = {
          status: 'error',
          message: 'cl_http_status_forbidden', // アクセスが拒否されました。
          httpStatus: 403,
        });
      };
      if (!clcom.hasStorageKey('permfunc')) {
        var permDefer = clutil
          .postJSON('am_pa_perm_get', {
            cond: { user_id: clcom.userInfo.user_id },
          })
          .then(function (data) {
            // 権限情報をキャッシュに保存
            clcom.setPermfuncMap(data.perm_func);
            var permChk = isBadPermFunc();
            if (permChk) {
              // 権限が無い！！！
              var d = $.Deferred();
              return d.reject({ head: permChk, rspHead: permChk });
            }
          });
        dd.push(permDefer);
      } else {
        var permChk = isBadPermFunc();
        if (permChk) {
          var d = $.Deferred();
          return d.reject({ head: permChk, rspHead: permChk });
        }
      }

      var defer = $.when.apply($, dd);

      // アプリ個別コールが設定されている場合
      if (res != null) {
        defer = defer.then(function () {
          return clutil.getJSON(res, appcallback, completed);
        });
      } else if (_.isFunction(completed)) {
        defer = defer.then(function () {
          completed();
          return this; // XXX これでいいのか未検証
        });
      }

      return defer.promise();
    },
    // 年の日数を返す
    getYearDays: function (
      year = Number(String(clcom.getOpeDate()).slice(0, 4))
    ) {
      return 365 + (isLeapYear(year) ? 1 : 0);
    },
    // 月の日数を返す
    getMonthDays: function (
      year = Number(String(clcom.getOpeDate()).slice(0, 4)),
      month = Number(String(clcom.getOpeDate()).slice(4, 6))
    ) {
      return (
        [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] +
        (isLeapYear(year) && month == 2 ? 1 : 0)
      );
    },
    // 各表示項目の書式変換関数群
    numberFormatMap: (function () {
      var numberFormat = function (n1, n2, options = {}) {
        var options = _.defaults(options, { df: false, rt: false, scale: 1 });
        var toString = options.df
          ? toSignedFixedLocaleString
          : toFixedLocaleString;
        return function (number, f_hyphen) {
          if (f_hyphen) {
            return '-'; // 強制ハイフン表示
          }
          if (options.rank && !number) {
            return '-'; // 「0位」は意味を持たないのでハイフン表示
          }
          if (options.rt && number == define.MDB_INVALID_RATE) {
            return '-'; // 意味を持たない比の値はハイフン表示
          }
          number /= options.scale;
          var fixed = number.toFixed(n2);
          return Math.abs(parseInt(Number(fixed))) < Math.pow(10, n1)
            ? toString(number, n2)
            : '...'; // 桁数オーバー
        };
      };
      return {
        // ランキング
        all_rank: numberFormat(4, 0, { rank: true }), // 全国
        ly_all_rank: numberFormat(4, 0, { rank: true }), // 全国(前年)
        zone_rank: numberFormat(4, 0, { rank: true }), // ゾーン
        ly_zone_rank: numberFormat(4, 0, { rank: true }), // ゾーン(前年)
        // 売上高
        sale_am: numberFormat(9, 0, { scale: 1000 }), // 実績(千円)
        sale_plan_am: numberFormat(9, 0, { scale: 1000 }), // 計画値(千円)
        planrt_sale_am: numberFormat(5, 1, { rt: true }), // 計画比(%)
        plandf_sale_am: numberFormat(9, 0, { df: true, scale: 1000 }), // 計画差(千円)
        ly_sale_am: numberFormat(9, 0, { scale: 1000 }), // 前年実績(千円)
        lyrt_sale_am: numberFormat(5, 1, { rt: true }), // 前年比(%)
        lydf_sale_am: numberFormat(9, 0, { df: true, scale: 1000 }), // 前年差(千円)
        sumrt_sale_am: numberFormat(3, 1, { rt: true }), // 構成比(%)
        // 売上数
        sale_qy: numberFormat(8, 0), // 実績(点)
        ly_sale_qy: numberFormat(8, 0), // 前年実績(点)
        lyrt_sale_qy: numberFormat(5, 1, { rt: true }), // 前年比(%)
        lydf_sale_qy: numberFormat(8, 0, { df: true }), // 前年差(点)
        sumrt_sale_qy: numberFormat(3, 1, { rt: true }), // 構成比(%)
        // 経準高
        prof_am: numberFormat(8, 0, { scale: 1000 }), // 実績(千円)
        prof_plan_am: numberFormat(8, 0, { scale: 1000 }), // 計画値(千円)
        planrt_prof_am: numberFormat(5, 1, { rt: true }), // 計画比(%)
        plandf_prof_am: numberFormat(8, 0, { df: true, scale: 1000 }), // 計画差(千円)
        ly_prof_am: numberFormat(8, 0, { scale: 1000 }), // 前年実績(千円)
        lyrt_prof_am: numberFormat(5, 1, { rt: true }), // 前年比(%)
        lydf_prof_am: numberFormat(8, 0, { df: true, scale: 1000 }), // 前年差(千円)
        sumrt_prof_am: numberFormat(3, 1, { rt: true }), // 構成比(%)
        // 経準率
        prof_am_rt: numberFormat(3, 1, { rt: true }), // 実績(%)
        prof_plan_am_rt: numberFormat(3, 1, { rt: true }), // 計画値(%)
        planrt_prof_am_rt: numberFormat(3, 1, { rt: true }), // 計画比(%)
        plandf_prof_am_rt: numberFormat(3, 1, { dt: true, rt: true }), // 計画差(%)
        ly_prof_am_rt: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_prof_am_rt: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_prof_am_rt: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // 客数
        customer_qy: numberFormat(7, 0), // 実績(名)
        ly_customer_qy: numberFormat(7, 0), // 前年実績(名)
        lyrt_customer_qy: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_customer_qy: numberFormat(7, 0, { df: true }), // 前年差(名)
        sumrt_customer_qy: numberFormat(3, 1, { rt: true }), // 構成比(%)
        // 客単価
        customer_uam: numberFormat(6, 0), // 実績(円)
        ly_customer_uam: numberFormat(6, 0), // 前年実績(円)
        lyrt_customer_uam: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_customer_uam: numberFormat(6, 0, { df: true }), // 前年差(円)
        // 一品単価
        sale_1price: numberFormat(6, 0), // 実績(円)
        ly_sale_1price: numberFormat(6, 0), // 前年実績(円)
        lyrt_sale_1price: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_sale_1price: numberFormat(6, 0, { df: true }), // 前年差(円)
        // 買上点数
        cust_sale_qy: numberFormat(3, 2), // 実績(点)
        ly_cust_sale_qy: numberFormat(3, 2), // 前年実績(点)
        lyrt_cust_sale_qy: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_cust_sale_qy: numberFormat(3, 2, { df: true }), // 前年差(点)
        // 営業利益
        profit_am: numberFormat(7, 0, { scale: 1000 }), // 実績(千円)
        profit_plan_am: numberFormat(7, 0, { scale: 1000 }), // 計画値(千円)
        planrt_profit_am: numberFormat(5, 1, { rt: true }), // 計画比(%)
        plandf_profit_am: numberFormat(7, 0, { df: true, scale: 1000 }), // 計画差(千円)
        ly_profit_am: numberFormat(7, 0, { scale: 1000 }), // 前年実績(千円)
        lyrt_profit_am: numberFormat(5, 1, { rt: true }), // 前年比(%)
        lydf_profit_am: numberFormat(7, 0, { df: true, scale: 1000 }), // 前年差(千円)
        sumrt_profit_am: numberFormat(3, 1, { rt: true }), // 構成比(%)
        // BY3点付着率
        levelup_ar_by3: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_ar_by3: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_ar_by3: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_ar_by3: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // シューズ付着率
        levelup_ar_shoes: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_ar_shoes: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_ar_shoes: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_ar_shoes: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // エイトストップ付着率
        levelup_ar_eight: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_ar_eight: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_ar_eight: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_ar_eight: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // ハートシック付着率
        levelup_ar_heart: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_ar_heart: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_ar_heart: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_ar_heart: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // プリーツ付着率
        levelup_ar_plt: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_ar_plt: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_ar_plt: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_ar_plt: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // SPCメンズ付着率
        levelup_ar_spc: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_ar_spc: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_ar_spc: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_ar_spc: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // SPCレディス付着率
        levelup_ar_l_spc: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_ar_l_spc: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_ar_l_spc: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_ar_l_spc: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // ジャスト感付着率
        levelup_ar_just: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_ar_just: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_ar_just: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_ar_just: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // ナノクリーン付着率
        levelup_ar_nano: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_ar_nano: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_ar_nano: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_ar_nano: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // ドライパッド付着率
        levelup_ar_dry: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_ar_dry: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_ar_dry: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_ar_dry: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // スーツ関連率
        levelup_rr_suits: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_rr_suits: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_rr_suits: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_rr_suits: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // JK関連率
        levelup_rr_jk: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_rr_jk: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_rr_jk: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_rr_jk: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // 重中3着決定率
        levelup_dr_jc3: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_dr_jc3: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_dr_jc3: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_dr_jc3: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // SL関連率
        levelup_rr_sl: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_rr_sl: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_rr_sl: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_rr_sl: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // SL3本決定率
        levelup_dr_sl3: numberFormat(3, 1, { rt: true }), // 実績(%)
        ly_levelup_dr_sl3: numberFormat(3, 1, { rt: true }), // 前年実績(%)
        lyrt_levelup_dr_sl3: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_dr_sl3: numberFormat(3, 1, { df: true, rt: true }), // 前年差(%)
        // 重衣料客数
        levelup_cqy_j: numberFormat(7, 0), // 実績(名)
        ly_levelup_cqy_j: numberFormat(7, 0), // 前年実績(名)
        lyrt_levelup_cqy_j: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_cqy_j: numberFormat(7, 0, { df: true }), // 前年差(名)
        // 重衣料客単価
        levelup_cup_j: numberFormat(6, 0), // 実績(円)
        ly_levelup_cup_j: numberFormat(6, 0), // 前年実績(円)
        lyrt_levelup_cup_j: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_cup_j: numberFormat(6, 0, { df: true }), // 前年差(円)
        // 重衣料C単価
        levelup_ccp_j: numberFormat(6, 0), // 実績(円)
        ly_levelup_ccp_j: numberFormat(6, 0), // 前年実績(円)
        lyrt_levelup_ccp_j: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_ccp_j: numberFormat(6, 0, { df: true }), // 前年差(円)
        // 中衣料客数
        levelup_cqy_c: numberFormat(7, 0), // 実績(名)
        ly_levelup_cqy_c: numberFormat(7, 0), // 前年実績(名)
        lyrt_levelup_cqy_c: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_cqy_c: numberFormat(7, 0, { df: true }), // 前年差(名)
        // 中衣料客単価
        levelup_cup_c: numberFormat(6, 0), // 実績(円)
        ly_levelup_cup_c: numberFormat(6, 0), // 前年実績(円)
        lyrt_levelup_cup_c: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_cup_c: numberFormat(6, 0, { df: true }), // 前年差(円)
        // 中衣料C単価
        levelup_ccp_c: numberFormat(6, 0), // 実績(円)
        ly_levelup_ccp_c: numberFormat(6, 0), // 前年実績(円)
        lyrt_levelup_ccp_c: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_ccp_c: numberFormat(6, 0, { df: true }), // 前年差(円)
        // レディス売上高
        levelup_am_l: numberFormat(7, 0, { scale: 1000 }), // 実績(千円)
        ly_levelup_am_l: numberFormat(7, 0, { scale: 1000 }), // 前年実績(千円)
        lyrt_levelup_am_l: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_am_l: numberFormat(7, 0, { df: true, scale: 1000 }), // 前年差(千円)
        // レディススーツ・コート客数
        levelup_cqy_l: numberFormat(7, 0), // 実績(名)
        ly_levelup_cqy_l: numberFormat(7, 0), // 前年実績(名)
        lyrt_levelup_cqy_l: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_cqy_l: numberFormat(7, 0, { df: true }), // 前年差(名)
        // レディススーツ・コート客単価
        levelup_cup_l: numberFormat(6, 0), // 実績(円)
        ly_levelup_cup_l: numberFormat(6, 0), // 前年実績(円)
        lyrt_levelup_cup_l: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_cup_l: numberFormat(6, 0, { df: true }), // 前年差(円)
        // レディススーツ・コートC単価
        levelup_ccp_l: numberFormat(6, 0), // 実績(円)
        ly_levelup_ccp_l: numberFormat(6, 0), // 前年実績(円)
        lyrt_levelup_ccp_l: numberFormat(3, 1, { rt: true }), // 前年比(%)
        lydf_levelup_ccp_l: numberFormat(6, 0, { df: true }), // 前年差(円)
      };
    })(),
    // 差の値の色を返す
    dfColor: function (df, rt = define.MDB_INVALID_RATE) {
      return df == 0 ? '' : df > 0 ? 'green' : rt < 90 ? 'red' : 'yellow';
    },
    // 比の値の色を返す
    rtColor: function (df, rt = define.MDB_INVALID_RATE) {
      return rt == define.MDB_INVALID_RATE || df == 0
        ? ''
        : df > 0
        ? 'green'
        : rt < 90
        ? 'red'
        : 'yellow';
    },
  };

  // 全体を覆うMDB基盤共通 View クラス
  // メニュー、共通ヘッダ部を内包する。
  mdbBaseView = Backbone.View.extend({
    el: $('#mdbMain'),
    events: {
      'click #mdbMenuOpener': 'onclickMenuOpener', // メニュー開く
      'click #mdbMenuCloser': 'onclickMenuCloser', // メニュー閉じる
      'click #mdbMenuLogout': 'onclickMenuLogout', // [ログアウト]押下
      'click .mdbMenuFunc': 'onclickMenuFunc', // 機能名押下
      'click .mdbMenuCatalog': 'onclickMenuCatalog', // カタログ名押下
      'click #mdbMenuFormula': 'onclickMenuFormula', // [計算式一覧]押下
    },

    initialize: function (options = {}) {
      _.bindAll(this);
      var headerTemplate = _.template(
        '<div class="cl_echoback msgBox error dispn"></div>' +
          '<div id="mdbHeader">' +
          '<div id="mdbHeaderPage">' +
          '<div id="mdbHeaderPageTitle"><%= pageTitle %></div>' +
          '<div id="mdbHeaderPageId"><%= pageId %></div>' +
          '</div>' +
          '<div class="right flex">' +
          '<div id="mdbHeaderOpeDate"><%= opeDate %></div>' +
          '<div id="mdbHeaderConfidential"></div>' +
          '</div>' +
          '</div>'
      );
      var menuTemplate = _.template(
        '<div id="mdbMenu">' +
          '<div id="mdbMenuDrawer">' +
          '<div id="mdbMenuCloser">' +
          '<div id="mdbMenuUser"><%= user_name %></div>' +
          '<div id="mdbMenuCloseIcon"></div>' +
          '</div>' +
          '<div class="mdbMenuTitleRow">' +
          '<div class="mdbMenuTitle"><%= org_name %></div>' +
          '<div id="mdbMenuLogout">ログアウト</div>' +
          '</div>' +
          '<div id="mdbMenuFuncList"></div>' +
          '<div class="mdbMenuTitleRow">' +
          '<div class="mdbMenuTitle">カタログ</div>' +
          '</div>' +
          '<div id="mdbMenuCatalogList"></div>' +
          '<div id="mdbMenuFormula" class="mdbMenuTitleRow">計算式一覧</div>' +
          '</div>' +
          '<div id="mdbMenuOpener">' +
          '<div id="mdbMenuOpenIcon"></div>' +
          '</div>' +
          '</div>'
      );
      var menuFuncTemplate = _.template(
        '<div class="mdbMenuFunc"><%= name %></div>'
      );
      this.$el
        .data('options', _.defaults(options, { getPageArgs: function () {} }))
        .find('#mdbContainer')
        .prepend(
          headerTemplate(
            _.defaults(
              {
                opeDate: clutil.dateFormat(clcom.getOpeDate(), 'yyyy/mm/dd(w)'),
              },
              clcom
            )
          )
        )
        .end()
        .append(
          $.tmpl(menuTemplate(clcom.userInfo))
            .find('#mdbMenuFuncList')
            .append(
              _.reduce(
                [
                  { code: 'AMDBV0010', name: '店舗基本情報' },
                  { code: 'AMDBV0020', name: '売上分析' },
                  { code: 'AMDBV0030', name: '品種別実績' },
                  { code: 'AMDBV0040', name: '個人売上実績' },
                  { code: 'AMDBV0050', name: '計画達成必要額・着地見込' },
                  { code: 'AMDBV0060', name: 'ランキング' },
                ],
                function ($memo, func) {
                  return $memo.add(
                    $.tmpl(menuFuncTemplate(func))
                      .data('func', func)
                      .addClass(
                        func.code == clcom.pageId ? 'mdbMenuFuncDisabled' : ''
                      )
                  );
                },
                this.$()
              )
            )
            .end()
        );

      //
      this.validator = clutil.validator(this.$el, {
        echoback: this.$('.cl_echoback'),
      });
    },

    // getter
    get: function () {},

    // setter
    set: function () {
      return Promise.resolve().then(this.search);
    },

    search: _.once(function () {
      return clutil
        .postJSON('am_pa_mdb_ctlg_srch', {
          cond: { unit_id: clcom.userInfo.unit_id },
        })
        .then(
          _.bind(function (response) {
            var list = response.list;
            var menuCatalogTemplate = _.template(
              '<div class="mdbMenuCatalog"><%= name %></div>'
            );
            this.$el.find('#mdbMenuCatalogList').append(
              _.reduce(
                list,
                function ($memo, catalog) {
                  return $memo.add(
                    $.tmpl(menuCatalogTemplate(catalog)).data(
                      'catalog',
                      catalog
                    )
                  );
                },
                this.$()
              )
            );
          }, this),
          _.bind(function (response) {
            return response;
          }, this)
        );
    }),

    // メニュー開く
    onclickMenuOpener: function (e) {
      this.blockUI(false);
      this.$('#mdbMenuOpener').fadeOut();
      this.$('#mdbMenu').animate({ left: 0 });
    },

    // メニュー閉じる
    onclickMenuCloser: function (e) {
      this.$('#mdbMenuOpener').fadeIn();
      this.$('#mdbMenu').animate(
        {
          left:
            -1 *
            parseFloat(getComputedStyle(this.$('#mdbMenuDrawer').get(0)).width),
        },
        _.bind(function () {
          this.unblockUI();
        }, this)
      );
    },

    // [ログアウト]押下時の処理
    onclickMenuLogout: function (e) {
      clcom.logout(clcom.urlRoot + '/mdb_login.html');
    },

    // 機能名押下時の処理
    onclickMenuFunc: function (e) {
      var options = this.$el.data('options');
      var func = this.$(e.target.closest('.mdbMenuFunc')).data('func');
      var code = func.code; // 各画面へ遷移
      clcom.pushPage({
        url: [clcom.appRoot, code.slice(0, 4), code, code + '.html'].join('/'),
        args: options.getPageArgs(),
        newWindow: false,
      });
    },

    // カタログ名押下時の処理
    onclickMenuCatalog: function (e) {
      var catalog = this.$(e.target.closest('.mdbMenuCatalog')).data('catalog');
      var code = 'AMGAV2100'; // AMGAV2100 新自由分析 へ遷移
      var pageId = clcom.pageId;
      clcom.pushPage({
        url: [clcom.appRoot, code.slice(0, 4), code, code + '.html'].join('/'),
        args: {
          homeUrl: [
            clcom.appRoot,
            pageId.slice(0, 4),
            pageId,
            pageId + '.html',
          ].join('/'),
          func_id: 2100,
          func_code: code,
          catalog_id: catalog.id,
          catalog_name: catalog.name,
          f_anakind: amcm_type.AMCM_VAL_ANAKIND_GROUPBY,
          anamenuitem_name: catalog.name,
          directExec: null,
        },
        newWindow: true,
      });
    },

    // [計算式一覧]押下時の処理
    onclickMenuFormula: function (e) {
      clutil.download({
        url: '/public/sample/MDB項目計算式.pdf',
        newWindow: true,
      });
    },

    // 画面をブロックする
    blockUI: function (menuBlocked = true) {
      var template = _.template('<div class="mdbBlocked"></div>');
      var zIndex = Number(this.$('#mdbMenu').css('zIndex'));
      this.$el
        .append(template())
        .children()
        .last()
        .css({ zIndex: menuBlocked ? zIndex + 1 : zIndex - 1 });
      this.$('#mdbContainer').addClass('mdbFilter');
    },

    // 画面のブロックを解除する
    unblockUI: function () {
      this.$('#mdbContainer').removeClass('mdbFilter');
      this.$('.mdbBlocked').remove();
    },
  });

  // チェックボックス
  mdbCheckbox = Backbone.View.extend({
    initialize: function (options = {}) {
      _.bindAll(this);
      var template = _.template(
        '<label class="mdbFieldText checkbox"><input type="checkbox" data-toggle="checkbox"><%= name %></label>'
      );
      this.$el
        .empty()
        .append(template({ name: options.name }))
        .data('options', _.defaults(options, { name: '' }));
      clutil.initUIelement(this.$el);
    },

    // getter
    get: function () {
      return Boolean(this.$(':checked').length);
    },

    // setter
    set: function (value) {
      this.$(':checkbox').checkbox(value ? 'check' : 'uncheck');
      return this;
    },
  });
  // ページャー
  mdbPager = Backbone.View.extend({
    events: {
      'click .mdbPageEnabled': 'onclick', // 押下
    },

    initialize: function (options = {}) {
      _.bindAll(this);
      var template = _.template('<div class="mdbPager"></div>');
      this.$el
        .empty()
        .append(template())
        .data('options', _.defaults(options, { onclick: function () {} }));
    },

    // ページ応答ヘッダ setter
    set: function (rspPage) {
      var $pager = this.$('.mdbPager').empty();
      if (!rspPage.total_record) {
        return this;
      }
      var currRecord = rspPage.curr_record;
      var pageSize = rspPage.page_size;
      if (currRecord >= pageSize) {
        var template = _.template(
          '<div class="mdbPrevPage mdbPageEnabled fui-arrow-left"></div>'
        );
        $pager
          .append(template())
          .children()
          .last()
          .data('reqPage', {
            start_record: currRecord - pageSize,
            page_size: pageSize,
          });
      }
      var template = _.template('<div class="mdbPage"><%= page %></div>');
      var currPage = currRecord / pageSize + 1;
      var pageNum = rspPage.page_num;
      var dn = 3;
      var pageList = []
        .concat(currPage - dn >= 3 ? [1, 0] : currPage - dn == 2 ? [1] : [])
        .concat(
          _.range(
            Math.max(1, currPage - dn),
            Math.min(currPage + dn, pageNum) + 1
          )
        )
        .concat(
          currPage + dn <= pageNum - 2
            ? [0, pageNum]
            : currPage + dn == pageNum - 1
            ? [pageNum]
            : []
        );
      for (var page of pageList) {
        $pager
          .append(template({ page: page ? String(page) : '...' }))
          .children()
          .last()
          .data('reqPage', {
            start_record: page ? (page - 1) * pageSize : 0,
            page_size: page ? pageSize : 0,
          })
          .addClass(
            !page || page == currPage
              ? 'currPage mdbPageDisabled'
              : 'mdbPageEnabled'
          );
      }
      if (currRecord < (pageNum - 1) * pageSize) {
        var template = _.template(
          '<div class="mdbNextPage mdbPageEnabled fui-arrow-right"></div>'
        );
        $pager
          .append(template())
          .children()
          .last()
          .data('reqPage', {
            start_record: currRecord + pageSize,
            page_size: pageSize,
          });
      }
      return this;
    },

    // 押下時の処理
    onclick: function (e) {
      var options = this.$el.data('options');
      return options.onclick(
        this.$(e.target.closest('.mdbPageEnabled')).data('reqPage')
      );
    },
  });
  // ラジオボタン
  mdbRadio = Backbone.View.extend({
    events: {
      'change input:checked': 'onchange', // 変更
    },

    initialize: function (options = {}) {
      _.bindAll(this);
      var template = _.template(
        '<ul class="mdbRadioList mdbFieldText flex"></ul>'
      );
      this.$el
        .empty()
        .append(template())
        .data(
          'options',
          _.defaults(options, {
            name: _.uniqueId(),
            list: [],
            onchange: function () {},
          })
        );
      this.setList(options.list);
    },

    // getter
    get: function () {
      var options = this.$el.data('options');
      var list = options.list;
      var id = Number(this.$('input:checked').val());
      return _.deepClone(
        _.find(list, function (value) {
          return value.id == id;
        })
      );
    },

    // setter
    set: function (value) {
      if (_.isEmpty(value)) {
        return this;
      }
      var options = this.$el.data('options');
      var list = options.list;
      var id = value.id;
      value = _.find(list, function (element) {
        return element.id == id;
      });
      if (!value) {
        return this;
      }
      this.$('[value=' + String(id) + ']').radio('check');
      return this;
    },

    // リスト getter
    getList: function () {
      var options = this.$el.data('options');
      return _.deepClone(options.list);
    },

    // リスト setter
    setList: function (list) {
      var template = _.template(
        '<li><label class="radio">' +
          '<input type="radio" name="<%= name %>" value="<%= value %>" data-toggle="radio">' +
          '<%= text %>' +
          '</label></li>'
      );
      var $radioList = this.$('.mdbRadioList').empty();
      for (var value of list) {
        $radioList.append(
          template({ value: String(value.id), text: value.name })
        );
      }
      clutil.initUIelement(this.$el);
      return this.set(_.first(list));
    },

    // 変更時の処理
    onchange: function (e) {
      var options = this.$el.data('options');
      return options.onchange(this.get());
    },
  });
  // セレクター
  mdbSelect = Backbone.View.extend({
    events: {
      'change .mdbSelect': 'onchange', // 変更
      'click li': 'onclick', // 押下
    },

    initialize: function (options = {}) {
      _.bindAll(this);
      var template = _.template('<select class="mdbSelect"></select>');
      this.$el
        .empty()
        .append(template())
        .data(
          'options',
          _.defaults(options, {
            $select: this.$el.find('.mdbSelect'),
            list: [],
            unselectedflag: false,
            emptyLabel: '',
            namedisp: true,
            idname: 'id',
            codename: 'code',
            namename: 'name',
            onchange: function () {},
            onclick: function () {},
          })
        );
      this.setList(options.list);
    },

    // getter
    get: function () {
      var options = this.$el.data('options');
      return _.deepClone(options.idMap[options.$select.selectpicker('val')]);
    },

    // setter
    set: function (value) {
      if (_.isEmpty(value)) {
        return this;
      }
      var options = this.$el.data('options');
      var idname = options.idname;
      var id = value[idname];
      if (!options.idMap[id]) {
        return this;
      }
      var selectedClass = 'selected';
      var list = options.list;
      options.$select
        .selectpicker('val', id)
        .next()
        .find('li')
        .removeClass(selectedClass)
        .each(
          _.bind(function (index, li) {
            if (list[index][idname] == id) {
              this.$(li).addClass(selectedClass);
            }
          }, this)
        );
      return this;
    },

    // リスト getter
    getList: function () {
      var options = this.$el.data('options');
      return _.deepClone(options.list);
    },

    // リスト setter
    setList: function (list) {
      var options = this.$el.data('options');
      clutil.cltypeselector3(_.extend(options, { list: list }));
      var $select = options.$select;
      clutil.inputRemoveReadonly($select); // list.length == 1 のときにreadonlyにならないように
      var $button = $select.next('div').find('button');
      $button.html($button.html().replace('&nbsp;', '')); // 不要なスペースを除去
      return this;
    },

    clearError: function () {
      var options = this.$el.data('options');
      var cssClasses = 'cl_error_field cl_alert_field';
      options.$select
        .removeClass(cssClasses)
        .removeAttr('data-cl-errmsg')
        .next('div')
        .find('button')
        .removeClass(cssClasses)
        .removeAttr('data-cl-errmsg');
      return this;
    },

    setError: function (message, level) {
      var options = this.$el.data('options');
      var cssClasses = 'cl_error_field cl_alert_field';
      var cssClass = level == 'alert' ? 'cl_alert_field' : 'cl_error_field';
      options.$select
        .removeClass(cssClasses)
        .addClass(cssClass)
        .attr('data-cl-errmsg', message)
        .next('div')
        .find('button')
        .removeClass(cssClasses)
        .addClass(cssClass)
        .attr('data-cl-errmsg', message);
      return this;
    },

    // 変更時の処理
    onchange: function (e) {
      var options = this.$el.data('options');
      return options.onchange(this.get());
    },

    // 押下時の処理
    onclick: function (e) {
      var options = this.$el.data('options');
      return options.onclick(this.get());
    },
  });
  // タブ
  mdbTab = Backbone.View.extend({
    events: {
      'click .mdbTab:not(.mdbTabSelected)': 'onchange', // 変更
    },

    initialize: function (options = {}) {
      _.bindAll(this);
      var template = _.template('<div class="mdbTabList"></div>');
      this.$el
        .empty()
        .append(template())
        .data(
          'options',
          _.defaults(options, {
            list: [],
            onchange: function () {},
          })
        );
      this.setList(options.list);
    },

    // getter
    get: function () {
      var options = this.$el.data('options');
      var list = options.list;
      var id = Number(this.$('.mdbTabSelected').attr('value'));
      return _.deepClone(
        _.find(list, function (value) {
          return value.id == id;
        })
      );
    },

    // setter
    set: function (value) {
      if (_.isEmpty(value)) {
        return this;
      }
      var options = this.$el.data('options');
      var list = options.list;
      var id = value.id;
      value = _.find(list, function (element) {
        return element.id == id;
      });
      if (!value) {
        return this;
      }
      var selectedClass = 'mdbTabSelected';
      this.$('.mdbTabList').children().removeClass(selectedClass);
      this.$('[value=' + String(id) + ']').addClass(selectedClass);
      return this;
    },

    // リスト getter
    getList: function () {
      var options = this.$el.data('options');
      return _.deepClone(options.list);
    },

    // リスト setter
    setList: function (list) {
      var template = _.template(
        '<div class="mdbTab" value=<%= id %>><%= name %></div>'
      );
      var $tabList = this.$('.mdbTabList').empty();
      for (var value of list) {
        $tabList.append(template(value));
      }
      return this.set(_.first(list));
    },

    // 変更時の処理
    onchange: function (e) {
      var options = this.$el.data('options');
      if (e) {
        this.set({ id: Number(this.$(e.target).attr('value')) });
      }
      return options.onchange(this.get());
    },
  });

  // 品種
  mdbItgrpTree = Backbone.View.extend({
    initialize: function (options = {}) {
      _.bindAll(this);
      var template = _.template(
        '<div class="flex">' +
          '<div class="div"></div>' +
          '<div class="ctg"></div>' +
          '</div>'
      );
      this.$el
        .empty()
        .append(template())
        .data('options', _.defaults(options, { onchange: function () {} }));
      // 部門
      this.div = new mdbSelect({
        el: this.$('.div'),
        idname: 'itgrp_id',
        onchange: this.changeCtg,
      });
      // 品種
      this.ctg = new mdbSelect({
        el: this.$('.ctg'),
        idname: 'itgrp_id',
        onchange: this.onchange,
      });

      this.cond = {};
    },

    // getter
    get: function () {
      return {
        div: this.div.get(),
        ctg: this.ctg.get(),
      };
    },

    // setter
    set: function (itgrpTree, cond = {}) {
      this.cond = _.deepClone(cond); // 最新の条件を保持
      itgrpTree = itgrpTree || this.get();
      return Promise.resolve()
        .then(
          _.bind(function () {
            return this.setDiv(itgrpTree.div);
          }, this)
        )
        .then(
          _.bind(function () {
            return this.setCtg(itgrpTree.ctg);
          }, this)
        );
    },

    // 部門 setter
    setDiv: function (div) {
      return this.setNode(div, this.div, { itgrp_id: this.cond.parent_id }, [
        { itgrp_id: 0, name: '全商品' },
      ]);
    },

    // 品種 setter
    setCtg: function (ctg) {
      return this.setNode(ctg, this.ctg, this.div.get(), [
        { itgrp_id: 0, name: '全品種' },
      ]);
    },

    setNode: function (value, node, parent, list = []) {
      var parent_id = parent.itgrp_id;
      var $el = node.$el.hide();
      if (!parent_id) {
        node.setList(list);
        return Promise.resolve();
      }
      $el.show();
      return this.search({ parent_id: parent_id }).then(function (response) {
        node.setList(_.union(list, response.itgrplist)).set(value);
      });
    },

    // 検索
    search: function (cond) {
      return clutil
        .postJSON('am_pa_mdb_itgrptree_srch', {
          cond: _.extend(
            { func_id: clcom.cmDefaults.defaultItgrpFunc.id },
            this.cond,
            cond
          ),
        })
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          }
        );
    },

    // 部門 changer
    changeDiv: function () {
      return Promise.resolve().then(this.setDiv).then(this.changeCtg);
    },

    // 品種 changer
    changeCtg: function () {
      return Promise.resolve().then(this.setCtg).then(this.onchange);
    },

    // 変更時の処理
    onchange: function (e) {
      var options = this.$el.data('options');
      return options.onchange(this.get());
    },
  });
  // 店舗
  mdbOrgTree = Backbone.View.extend({
    initialize: function (options = {}) {
      _.bindAll(this);
      var template = _.template(
        '<div class="flex">' +
          '<div class="unit"></div>' +
          '<div class="area"></div>' +
          '<div class="zone"></div>' +
          '<div class="org"></div>' +
          '</div>'
      );
      this.$el
        .empty()
        .append(template())
        .data('options', _.defaults(options, { onchange: function () {} }));
      // 事業ユニット
      this.unit = new mdbSelect({
        el: this.$('.unit'),
        idname: 'org_id',
        onchange: this.changeArea,
      });
      // 地区
      this.area = new mdbSelect({
        el: this.$('.area'),
        idname: 'org_id',
        onchange: this.changeZone,
      });
      // ゾーン
      this.zone = new mdbSelect({
        el: this.$('.zone'),
        idname: 'org_id',
        onchange: this.changeOrg,
      });
      // 店舗
      this.org = new mdbSelect({
        el: this.$('.org'),
        idname: 'org_id',
        onchange: this.onchange,
      });

      this.cond = {};
    },

    // getter
    get: function () {
      return {
        unit: this.unit.get(),
        area: this.area.get(),
        zone: this.zone.get(),
        org: this.org.get(),
      };
    },

    // setter
    set: function (orgTree, cond = {}) {
      this.cond = _.deepClone(cond); // 最新の条件を保持
      orgTree = orgTree || this.get();
      return Promise.resolve()
        .then(
          _.bind(function () {
            return this.setUnit(orgTree.unit);
          }, this)
        )
        .then(
          _.bind(function () {
            return this.setArea(orgTree.area);
          }, this)
        )
        .then(
          _.bind(function () {
            return this.setZone(orgTree.zone);
          }, this)
        )
        .then(
          _.bind(function () {
            return this.setOrg(orgTree.org);
          }, this)
        );
    },

    // 事業ユニット setter
    setUnit: function (unit) {
      return this.setNode(unit, this.unit, {
        org_id: Number(clcom.getSysparam(amcm_sysparams.PAR_AMMS_CORPID_AOKI)),
      });
    },

    // 地区 setter
    setArea: function (area) {
      var list = [];
      switch (clcom.userInfo.dataperm_typeid) {
        case amcm_type.AMCM_VAL_DATAPERM_FULL:
        case amcm_type.AMCM_VAL_DATAPERM_UNIT:
          list.push({ org_id: 0, name: '全地区' });
          break;
        default:
          break;
      }
      return this.setNode(area, this.area, this.unit.get(), list);
    },

    // ゾーン setter
    setZone: function (zone) {
      var list = [];
      switch (clcom.userInfo.dataperm_typeid) {
        case amcm_type.AMCM_VAL_DATAPERM_FULL:
        case amcm_type.AMCM_VAL_DATAPERM_UNIT:
        case amcm_type.AMCM_VAL_DATAPERM_ZONE:
          list.push({ org_id: 0, name: '全ゾーン' });
          break;
        default:
          break;
      }
      return this.setNode(zone, this.zone, this.area.get(), list);
    },

    // 店舗 setter
    setOrg: function (org) {
      var list = [];
      switch (clcom.userInfo.dataperm_typeid) {
        case amcm_type.AMCM_VAL_DATAPERM_FULL:
        case amcm_type.AMCM_VAL_DATAPERM_UNIT:
        case amcm_type.AMCM_VAL_DATAPERM_ZONE:
        case amcm_type.AMCM_VAL_DATAPERM_AREA:
          list.push({ org_id: 0, name: '全店舗' });
          break;
        default:
          break;
      }
      return this.setNode(org, this.org, this.zone.get(), list);
    },

    setNode: function (value, node, parent, list = []) {
      var parent_id = parent.org_id;
      var $el = node.$el.hide();
      if (!parent_id) {
        node.setList(list);
        return Promise.resolve();
      }
      $el.show();
      return this.search({ parent_id: parent_id }).then(function (response) {
        node.setList(_.union(list, response.orglist)).set(value);
      });
    },

    // 検索
    search: function (cond) {
      return clutil
        .postJSON('am_pa_mdb_orgtree_srch', {
          cond: _.extend(
            { func_id: clcom.cmDefaults.defaultOrgFunc.id },
            this.cond,
            cond
          ),
        })
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          }
        );
    },

    // 事業ユニット changer
    changeUnit: function () {
      return Promise.resolve().then(this.setUnit).then(this.changeArea);
    },

    // 地区 changer
    changeArea: function () {
      return Promise.resolve().then(this.setArea).then(this.changeZone);
    },

    // ゾーン changer
    changeZone: function () {
      return Promise.resolve().then(this.setZone).then(this.changeOrg);
    },

    // 店舗 changer
    changeOrg: function () {
      return Promise.resolve().then(this.setOrg).then(this.onchange);
    },

    // 変更時の処理
    onchange: function (e) {
      var options = this.$el.data('options');
      return options.onchange(this.get());
    },
  });
  // 期間
  mdbPeriod = Backbone.View.extend({
    events: {
      'change .from': 'onchangeFrom', // 期間開始変更
      'change .to': 'onchangeTo', // 期間終了変更
      'click .mdbPeriodConfirmButton': 'onclickConfirmButton', // [確定]押下
    },

    initialize: function (options = {}) {
      _.bindAll(this);
      var template = _.template(
        '<div class="qtype"></div>' +
          '<div class="mdbPeriodField">' +
          '<div class="type"></div><button class="mdbPeriodConfirmButton mdbBtn btn">確定</button>' +
          // 日単位
          '<div class="ymd">' +
          '<div class="from flex"><div class="y"></div><div class="m"></div><div class="d"></div><div class="mdbFieldText">から</div></div>' +
          '<div class="to flex"><div class="y"></div><div class="m"></div><div class="d"></div><div class="mdbFieldText">まで</div></div>' +
          '</div>' +
          // 週単位
          '<div class="yw">' +
          '<div class="from flex"><div class="y"></div><div class="w"></div><div class="mdbFieldText">から</div></div>' +
          '<div class="to flex"><div class="y"></div><div class="w"></div><div class="mdbFieldText">まで</div></div>' +
          '</div>' +
          // 月単位
          '<div class="ym">' +
          '<div class="from flex"><div class="y"></div><div class="m"></div><div class="mdbFieldText">から</div></div>' +
          '<div class="to flex"><div class="y"></div><div class="m"></div><div class="mdbFieldText">まで</div></div>' +
          '</div>' +
          // 期単位
          '<div class="y2">' +
          '<div class="from flex"><div class="y"></div><div class="n"></div><div class="mdbFieldText">から</div></div>' +
          '<div class="to flex"><div class="y"></div><div class="n"></div><div class="mdbFieldText">まで</div></div>' +
          '</div>' +
          // 年単位
          '<div class="y1">' +
          '<div class="from flex"><div class="y"></div><div class="mdbFieldText">から</div></div>' +
          '<div class="to flex"><div class="y"></div><div class="mdbFieldText">まで</div></div>' +
          '</div>' +
          '</div>'
      );
      this.$el
        .empty()
        .append(template())
        .data('options', _.defaults(options, { onchange: function () {} }));
      //
      this.qtype = new mdbSelect({
        el: this.$('.qtype'),
        onchange: _.bind(function (qtype) {
          switch (qtype.id) {
            case define.AMGBD_DEFS_PERIOD_QTYPE_UNCONFIRMED:
              return;
            default:
              return this.onchange();
          }
        }, this),
        onclick: _.bind(function (qtype) {
          var $field = this.$('.mdbPeriodField');
          switch (qtype.id) {
            case define.AMGBD_DEFS_PERIOD_QTYPE_UNCONFIRMED:
            case define.AMGBD_DEFS_PERIOD_QTYPE_CONFIRMED:
              $field.show();
              break;
            default:
              $field.hide();
              break;
          }
        }, this),
      });
      //
      this.type = new mdbRadio({
        el: this.$('.type'),
        list: [
          {
            id: amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YMD,
            code: 'ymd',
            name: '日単位',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YW,
            code: 'yw',
            name: '週単位',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YM,
            code: 'ym',
            name: '月単位',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y2,
            code: 'y2',
            name: '期単位',
          },
          {
            id: amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y1,
            code: 'y1',
            name: '年単位',
          },
        ],
        onchange: _.bind(function (type) {
          var $ymd = this.$('.ymd').hide();
          var $yw = this.$('.yw').hide();
          var $ym = this.$('.ym').hide();
          var $y2 = this.$('.y2').hide();
          var $y1 = this.$('.y1').hide();
          switch (type.id) {
            case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YMD:
              $ymd.show();
              break;
            case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YW:
              $yw.show();
              break;
            case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YM:
              $ym.show();
              break;
            case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y2:
              $y2.show();
              break;
            case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y1:
              $y1.show();
              break;
          }
        }, this),
      });
      // 日単位
      var $ymd = this.$('.ymd');
      var $from = $ymd.find('.from');
      var $to = $ymd.find('.to');
      var typeYMD = _.first(
        _.where(this.type.getList(), {
          id: amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YMD,
        })
      );
      this.ymd = [
        {
          y: new mdbSelect({
            el: $from.find('.y'),
            onchange: _.bind(function (y) {
              return this.onchangeY(typeYMD, 0);
            }, this),
          }),
          m: new mdbSelect({
            el: $from.find('.m'),
            onchange: _.bind(function (m) {
              return this.onchangeM(typeYMD, 0);
            }, this),
          }),
          d: new mdbSelect({ el: $from.find('.d') }),
        },
        {
          y: new mdbSelect({
            el: $to.find('.y'),
            onchange: _.bind(function (y) {
              return this.onchangeY(typeYMD, 1);
            }, this),
          }),
          m: new mdbSelect({
            el: $to.find('.m'),
            onchange: _.bind(function (m) {
              return this.onchangeM(typeYMD, 1);
            }, this),
          }),
          d: new mdbSelect({ el: $to.find('.d') }),
        },
      ];
      // 週単位
      var $yw = this.$('.yw');
      var $from = $yw.find('.from');
      var $to = $yw.find('.to');
      var typeYW = _.first(
        _.where(this.type.getList(), {
          id: amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YW,
        })
      );
      this.yw = [
        {
          y: new mdbSelect({
            el: $from.find('.y'),
            onchange: _.bind(function (y) {
              return this.onchangeY(typeYW, 0);
            }, this),
          }),
          w: new mdbSelect({ el: $from.find('.w') }),
        },
        {
          y: new mdbSelect({
            el: $to.find('.y'),
            onchange: _.bind(function (y) {
              return this.onchangeY(typeYW, 1);
            }, this),
          }),
          w: new mdbSelect({ el: $to.find('.w') }),
        },
      ];
      // 月単位
      var $ym = this.$('.ym');
      var $from = $ym.find('.from');
      var $to = $ym.find('.to');
      var typeYM = _.first(
        _.where(this.type.getList(), {
          id: amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YM,
        })
      );
      this.ym = [
        {
          y: new mdbSelect({
            el: $from.find('.y'),
            onchange: _.bind(function (y) {
              return this.onchangeY(typeYM, 0);
            }, this),
          }),
          m: new mdbSelect({
            el: $from.find('.m'),
            onchange: _.bind(function (y) {
              return this.onchangeM(typeYM, 0);
            }, this),
          }),
        },
        {
          y: new mdbSelect({
            el: $to.find('.y'),
            onchange: _.bind(function (y) {
              return this.onchangeY(typeYM, 1);
            }, this),
          }),
          m: new mdbSelect({
            el: $to.find('.m'),
            onchange: _.bind(function (y) {
              return this.onchangeM(typeYM, 1);
            }, this),
          }),
        },
      ];
      // 期単位
      var $y2 = this.$('.y2');
      var $from = $y2.find('.from');
      var $to = $y2.find('.to');
      var typeY2 = _.first(
        _.where(this.type.getList(), {
          id: amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y2,
        })
      );
      this.y2 = [
        {
          y: new mdbSelect({
            el: $from.find('.y'),
            onchange: _.bind(function (y) {
              return this.onchangeY(typeY2, 0);
            }, this),
          }),
          n: new mdbSelect({ el: $from.find('.n') }),
        },
        {
          y: new mdbSelect({
            el: $to.find('.y'),
            onchange: _.bind(function (y) {
              return this.onchangeY(typeY2, 1);
            }, this),
          }),
          n: new mdbSelect({ el: $to.find('.n') }),
        },
      ];
      // 年単位
      var $y1 = this.$('.y1');
      var $from = $y1.find('.from');
      var $to = $y1.find('.to');
      var typeY1 = _.first(
        _.where(this.type.getList(), {
          id: amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y1,
        })
      );
      this.y1 = [
        {
          y: new mdbSelect({
            el: $from.find('.y'),
            onchange: _.bind(function (y) {
              return this.onchangeY(typeY1, 0);
            }, this),
          }),
        },
        {
          y: new mdbSelect({
            el: $to.find('.y'),
            onchange: _.bind(function (y) {
              return this.onchangeY(typeY1, 1);
            }, this),
          }),
        },
      ];

      $(document).click(
        _.bind(function (e) {
          if (!this.$el.has(this.$(e.target)).length) {
            this.$('.mdbPeriodField').hide();
          }
        }, this)
      );
    },

    // getter
    get: function () {
      return this.qtype.get();
    },

    // setter
    set: function (period) {
      return Promise.resolve()
        .then(this.search)
        .then(
          _.bind(function () {
            period = period || this.get();
            var periodType = period.type;
            var qtype = this.qtype;
            switch (periodType) {
              case amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_DAY:
              case amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_PDAY:
              case amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_WEEK:
              case amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_PWEEK:
              case amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_MONTH:
              case amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_PMONTH:
              case amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_YEAR:
              case amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_PYEAR:
                qtype.set({ id: periodType });
                break;
              case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YMD:
              case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YW:
              case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YM:
              case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y2:
              case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y1:
                qtype
                  .setList(_.union(_.initial(qtype.getList()), period))
                  .set(period);
                var type = _.find(this.type.getList(), function (type) {
                  return type.id == periodType;
                });
                this.type.set(type);
                for (var index of [0, 1]) {
                  var yyyyxxxx = String(index ? period.to : period.from);
                  this.setY({ id: Number(yyyyxxxx.slice(0, 4)) }, type, index);
                  this.setM({ id: Number(yyyyxxxx.slice(4, 6)) }, type, index);
                  this.setD({ id: Number(yyyyxxxx.slice(6, 8)) }, type, index);
                  this.setW({ id: Number(yyyyxxxx.slice(4, 6)) }, type, index);
                  this.setN({ id: Number(yyyyxxxx.slice(4, 6)) }, type, index);
                }
                break;
              default:
                break;
            }
          }, this)
        );
    },

    search: _.once(function () {
      var opeDay = clcom.getOpeDate();
      var opeDate = clutil.ymd2date(opeDay);
      var opeY = opeDate.getFullYear();
      var opeM = opeDate.getMonth() + 1;
      var opeD = opeDate.getDate();
      var opeW = opeDate.getDay();
      return clutil
        .postJSON('am_pa_yearweek_init', {
          cond: { from_year: opeY - 4, to_year: opeY - Number(opeM < 4) },
        })
        .then(
          _.bind(function (response) {
            this.yearWeekList = _.filter(response.list, function (yearWeek) {
              return yearWeek.start_date <= opeDay;
            });
            var yearWeekList = this.yearWeekList;
            var pd = clutil.addDate(opeDay, -1);
            var d = opeDay;
            var pyw = _.last(_.initial(yearWeekList));
            var yw = _.last(yearWeekList);
            var pm = (function () {
              opeDate.setDate(1);
              opeDate.setMonth(opeDate.getMonth() - 1);
              return Number(clutil.dateFormat(opeDate, 'yyyymm'));
            })();
            var m = Number(String(opeDay).slice(0, 6));
            var py = Number(String(yw.yyyyww).slice(0, 4)) - 1;
            var y = py + 1;
            var qtypeD = function (id, name, d) {
              return {
                id: id,
                name: name + ' (' + clutil.dateFormat(d, 'yyyy/mm/dd') + ')',
                type: id,
                from: d,
                to: d,
                ymd: d,
              };
            };
            var qtypeW = function (id, name, yw) {
              var w = yw.yyyyww;
              var _w = String(w);
              return {
                id: id,
                name:
                  name + ' (' + _w.slice(0, 4) + '/' + _w.slice(4, 6) + '週)',
                type: id,
                from: w,
                to: w,
                ymd: yw.end_date,
              };
            };
            var qtypeM = function (id, name, m) {
              var _m = String(m);
              return {
                id: id,
                name: name + ' (' + clutil.monthFormat(m, 'yyyy/mm') + '月)',
                type: id,
                from: m,
                to: m,
                ymd: Number(
                  _m +
                    String(
                      mdbUtil.getMonthDays(
                        Number(_m.slice(0, 4)),
                        Number(_m.slice(4, 6))
                      )
                    )
                ),
              };
            };
            var qtypeY = function (id, name, y) {
              return {
                id: id,
                name: name + ' (' + String(y) + '年度)',
                type: id,
                from: y,
                to: y,
                ymd: Number(String(y + 1) + '0331'),
              };
            };
            this.qtype.setList(
              _.compact([
                qtypeD(amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_PDAY, '昨日', pd),
                qtypeD(amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_DAY, '本日', d),
                qtypeW(amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_PWEEK, '前週', pyw),
                opeW == 1
                  ? null // 月曜なら選択不可
                  : qtypeW(amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_WEEK, '当週', yw),
                qtypeM(amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_PMONTH, '前月', pm),
                opeD == 1
                  ? null // 1日なら選択不可
                  : qtypeM(amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_MONTH, '当月', m),
                qtypeY(amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_PYEAR, '前年', py),
                opeM == 4 && opeD == 1
                  ? null // 4/1なら選択不可
                  : qtypeY(amgbd_defs.AMGBD_DEFS_PERIOD_QTYPE_YEAR, '当年', y),
                {
                  id: define.AMGBD_DEFS_PERIOD_QTYPE_UNCONFIRMED,
                  name: '期間指定...',
                  type: define.AMGBD_DEFS_PERIOD_QTYPE_UNCONFIRMED,
                  from: 0,
                  to: 0,
                  ymd: 0,
                },
              ])
            );
            for (var type of this.type.getList()) {
              for (var index of [0, 1]) {
                this.setYList(type, index);
              }
            }
            return;
          }, this),
          function (response) {
            return response;
          }
        );
    }),

    // validator
    validate: function () {
      var qtype = this.qtype.clearError();
      switch (qtype.get().id) {
        case define.AMGBD_DEFS_PERIOD_QTYPE_UNCONFIRMED:
          qtype.setError('指定してください。');
          return false;
      }
      return true;
    },

    // 年 setter
    setY: function (value, type, index) {
      return this[type.code][index].y.set(value).onchange();
    },

    // 月 setter
    setM: function (value, type, index) {
      switch (type.id) {
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YMD:
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YM:
          break;
        default:
          return;
      }
      return this[type.code][index].m.set(value).onchange();
    },

    // 日 setter
    setD: function (value, type, index) {
      switch (type.id) {
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YMD:
          break;
        default:
          return;
      }
      return this[type.code][index].d.set(value).onchange();
    },

    // 週 setter
    setW: function (value, type, index) {
      switch (type.id) {
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YW:
          break;
        default:
          return;
      }
      return this[type.code][index].w.set(value).onchange();
    },

    // 期 setter
    setN: function (value, type, index) {
      switch (type.id) {
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y2:
          break;
        default:
          return;
      }
      return this[type.code][index].n.set(value).onchange();
    },

    // 年リスト setter
    setYList: function (type, index) {
      var yxx = this[type.code][index];
      var opeDate = String(clcom.getOpeDate());
      var opeY = Number(opeDate.slice(0, 4));
      var opeM = Number(opeDate.slice(4, 6));
      var typeId = type.id;
      var start =
        opeY -
        Number(
          (typeId == amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YW ||
            typeId == amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y2 ||
            typeId == amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y1) &&
            opeM < 4
        );
      var end = opeY - 4;
      return yxx.y
        .setList(
          _.map(_.range(start, end - 1, -1), function (y) {
            var code = ('0000' + String(y)).slice(-4);
            return { id: y, code: code, name: code + '年' };
          })
        )
        .onchange();
    },

    // 月リスト setter
    setMList: function (type, index) {
      switch (type.id) {
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YMD:
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YM:
          break;
        default:
          return;
      }
      var yxx = this[type.code][index];
      var y = yxx.y.get().id;
      var opeDate = String(clcom.getOpeDate());
      var opeY = Number(opeDate.slice(0, 4));
      var opeM = Number(opeDate.slice(4, 6));
      var start = 1;
      var end = y == opeY ? opeM : 12;
      return yxx.m
        .setList(
          _.map(_.range(start, end + 1), function (m) {
            var code = ('00' + String(m)).slice(-2);
            return { id: m, code: code, name: code + '月' };
          })
        )
        .onchange();
    },

    // 日リスト setter
    setDList: function (type, index) {
      switch (type.id) {
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YMD:
          break;
        default:
          return;
      }
      var yxx = this[type.code][index];
      var y = yxx.y.get().id;
      var m = yxx.m.get().id;
      var opeDate = String(clcom.getOpeDate());
      var opeY = Number(opeDate.slice(0, 4));
      var opeM = Number(opeDate.slice(4, 6));
      var opeD = Number(opeDate.slice(6, 8));
      var start = 1;
      var end = y == opeY && m == opeM ? opeD : mdbUtil.getMonthDays(y, m);
      return yxx.d
        .setList(
          _.map(_.range(start, end + 1), function (d) {
            var code = ('00' + String(d)).slice(-2);
            return { id: d, code: code, name: code + '日' };
          })
        )
        .onchange();
    },

    // 週リスト setter
    setWList: function (type, index) {
      switch (type.id) {
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YW:
          break;
        default:
          return;
      }
      var yxx = this[type.code][index];
      var y = yxx.y.get().id;
      var start = 1;
      var end = _.filter(this.yearWeekList, function (yearWeek) {
        return Number(String(yearWeek.yyyyww).slice(0, 4)) == y;
      }).length;
      return yxx.w
        .setList(
          _.map(_.range(start, end + 1), function (w) {
            var code = ('00' + String(w)).slice(-2);
            return { id: w, code: code, name: code + '週' };
          })
        )
        .onchange();
    },

    // 期リスト setter
    setNList: function (type, index) {
      switch (type.id) {
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y2:
          break;
        default:
          return;
      }
      var yxx = this[type.code][index];
      var y = yxx.y.get().id;
      var opeDate = String(clcom.getOpeDate());
      var opeY = Number(opeDate.slice(0, 4));
      var opeM = Number(opeDate.slice(4, 6));
      var start = 1;
      var end = y == opeY && 4 <= opeM && opeM <= 9 ? 1 : 2;
      return yxx.n
        .setList(
          _.map(_.range(start, end + 1), function (n) {
            var code = ('00' + String(n)).slice(-2);
            return { id: n, code: code, name: code + '期' };
          })
        )
        .onchange();
    },

    // 年変更時の処理
    onchangeY: function (type, index) {
      this.setMList(type, index);
      this.setWList(type, index);
      this.setNList(type, index);
    },

    // 月変更時の処理
    onchangeM: function (type, index) {
      this.setDList(type, index);
    },

    // 期間開始変更時の処理
    onchangeFrom: function (e) {
      index = 1;
      this.changeY(index);
      this.changeM(index);
      this.changeD(index);
      this.changeW(index);
      this.changeN(index);
    },

    // 期間終了変更時の処理
    onchangeTo: function (e) {
      index = 0;
      this.changeY(index);
      this.changeM(index);
      this.changeD(index);
      this.changeW(index);
      this.changeN(index);
    },

    // 年 changer
    changeY: function (index) {
      var type = this.type.get();
      var yx = this[type.code];
      var from = _.first(yx);
      var to = _.last(yx);
      if (from.y.get().id > to.y.get().id) {
        this.setY(yx[Number(!index)].y.get(), type, index);
      }
    },

    // 月 changer
    changeM: function (index) {
      var type = this.type.get();
      switch (type.id) {
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YMD:
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YM:
          break;
        default:
          return;
      }
      var yx = this[type.code];
      var from = _.first(yx);
      var to = _.last(yx);
      if (from.y.get().id == to.y.get().id && from.m.get().id > to.m.get().id) {
        this.setM(yx[Number(!index)].m.get(), type, index);
      }
    },

    // 日 changer
    changeD: function (index) {
      var type = this.type.get();
      switch (type.id) {
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YMD:
          break;
        default:
          return;
      }
      var yx = this[type.code];
      var from = _.first(yx);
      var to = _.last(yx);
      if (
        from.y.get().id == to.y.get().id &&
        from.m.get().id == to.m.get().id &&
        from.d.get().id > to.d.get().id
      ) {
        this.setD(yx[Number(!index)].d.get(), type, index);
      }
    },

    // 週 changer
    changeW: function (index) {
      var type = this.type.get();
      switch (type.id) {
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YW:
          break;
        default:
          return;
      }
      var yx = this[type.code];
      var from = _.first(yx);
      var to = _.last(yx);
      if (from.y.get().id == to.y.get().id && from.w.get().id > to.w.get().id) {
        this.setW(yx[Number(!index)].w.get(), type, index);
      }
    },

    // 期 changer
    changeN: function (index) {
      var type = this.type.get();
      switch (type.id) {
        case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y2:
          break;
        default:
          return;
      }
      var yx = this[type.code];
      var from = _.first(yx);
      var to = _.last(yx);
      if (from.y.get().id == to.y.get().id && from.n.get().id > to.n.get().id) {
        this.setN(yx[Number(!index)].n.get(), type, index);
      }
    },

    // [確定]押下時の処理
    onclickConfirmButton: function (e) {
      var type = this.type.get();
      var typeId = type.id;
      var period = _.map(
        [0, 1],
        _.bind(function (index) {
          return _.reduce(
            this[type.code][index],
            function (memo, yxx) {
              var value = yxx.get();
              memo.code += value.code;
              memo.name += value.name;
              return memo;
            },
            { code: '', name: '' }
          );
        }, this)
      );
      var from = _.first(period);
      var to = _.last(period);
      this.$('.mdbPeriodField').hide();
      return this.set({
        id: define.AMGBD_DEFS_PERIOD_QTYPE_CONFIRMED,
        name: [from.name, to.name].join('～'),
        type: typeId,
        from: Number(from.code),
        to: Number(to.code),
        ymd: _.bind(function () {
          var toCode = to.code;
          switch (typeId) {
            case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YMD:
              return Number(toCode);
            case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YW:
              return _.find(this.yearWeekList, function (yearWeek) {
                return yearWeek.yyyyww == Number(toCode);
              }).end_date;
            case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_YM:
              var y = Number(toCode.slice(0, 4));
              var m = Number(toCode.slice(4, 6));
              return Number(toCode + String(mdbUtil.getMonthDays(y, m)));
            case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y2:
              var y = Number(toCode.slice(0, 4));
              var m = Number(toCode.slice(4, 6));
              return m == 1
                ? Number(String(y) + '0930')
                : Number(String(y + 1) + '0331');
            case amgbd_defs.AMGBD_DEFS_PERIOD_TYPE_Y1:
              return Number(String(Number(toCode) + 1) + '0331');
            default:
              return 0;
          }
        }, this)(),
      }).then(this.onchange);
    },

    // 変更時の処理
    onchange: function (e) {
      var options = this.$el.data('options');
      return options.onchange(this.get());
    },
  });
});
