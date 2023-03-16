$(function () {
  var MainView = Backbone.View.extend({
    el: $('body'),
    events: {
      'click #logout': 'onclickLogout', // [ログアウト]押下
      'click #ana': 'onclickAna', // [自由分析]押下
      'click #form': 'onclickForm', // [自動帳票作成]押下
      'click #catalog': 'onclickCatalog', // [カタログ]押下
      'click .menu': 'onclickMenu', // メニュー押下
    },

    initialize: function () {
      var $menuList = $('#menuList');
      $('.micaos1').fadeIn(null, function () {
        $('#logout').animate({ opacity: 1 });
        $('.micaos2').animate({ left: 0, opacity: 1 });
        $('.afc').animate({ opacity: 1, top: 0 });
        $menuList.animate({ opacity: 1, top: 0 });
      });
      if (!micaosUtil.openableCustAnaMenu()) {
        $('#custAnaMenu').hide();
      }
      var menuList = _.reduce(
        _.union(
          [
            { code: 'AMGAV0110', name: 'MD分析メニュー' },
            { code: '', name: '顧客分析メニュー' },
          ],
          micaosUtil.getLoginResponse().menu_list
        ),
        function (memo, element, index) {
          if (!(index % 2)) {
            memo.push([element]);
          } else {
            _.last(memo).push(element);
          }
          return memo;
        },
        []
      );
      var $menuTemplate = $('#menuTemplate');
      for (var menus of menuList) {
        var $row = $.tmpl('<div class="flex"></div>').appendTo($menuList);
        for (var menu of menus) {
          $menuTemplate
            .tmpl(menu)
            .appendTo($row)
            .data('code', menu.code)
            .addClass(menu.code ? '' : 'custAnaMenu');
        }
      }
    },

    // [ログアウト]押下時の処理
    onclickLogout: function (e) {
      micaosUtil.logout();
    },

    // [自由分析]押下時の処理
    onclickAna: function (e) {
      this.openMenu({ code: 'AMGAV2100' });
    },

    // [自動帳票作成]押下時の処理
    onclickForm: function (e) {
      this.openMenu({ code: 'AMGAV2000' });
    },

    // [カタログ]押下時の処理
    onclickCatalog: function (e) {
      this.openMenu({ url: clcom.appRoot + '/AMGA/CACTV0020/CACTV0020.html' });
    },

    // メニュー押下時の処理
    onclickMenu: function (e) {
      var $menu = $(e.target.closest('.menu'));
      if ($menu.hasClass('custAnaMenu')) {
        micaosUtil.openCustAnaMenu();
      } else {
        this.openMenu({ code: $menu.data('code') });
      }
    },

    // メニュー opener
    openMenu: function (options) {
      var code = options.code;
      clcom.pushPage({
        url:
          options.url ||
          [clcom.appRoot, code.slice(0, 4), code, code + '.html'].join('/'),
        newWindow: true,
      });
    },
  });
  clutil.getIniJSON = function (res, appcallback, completed) {
    // ユーザ情報を設定する
    clcom.userInfo = clcom.getUserData();
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
    var defer = null;
    if (true) {
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
      defer = $.when.apply($, dd);
    }
    // 権限
    if (!clcom.hasStorageKey('permfunc')) {
      var d = clutil
        .postJSON('am_pa_perm_get', {
          cond: { user_id: clcom.userInfo.user_id },
        })
        .done(function (data) {
          // 権限情報をキャッシュに保存
          clcom.setPermfuncMap(data.perm_func);
        });
      dd.push(d);
    }
    return defer.promise();
  };
  clutil.blockUI = function (a, options) {
    console.log('blockUI called, [' + a + '], flag[' + clutil.UIBlocking + ']');
    if (clutil.UIBlocking > 0) {
      clutil.UIBlocking++; // TODO:clutilはthisにすべき？
      return;
    } else {
      clutil.UIBlocking++;
      //				$.blockUI({ centerY: 0, css: { top:'10px', left:'', right:'10px' } });
      var msg =
        '<div class="nowloading">Now loading...</div><div id="loading" class=""><img src="/css/micaos/circle_1.gif"></div>';
      $.blockUI(
        _.extend(
          {
            css: { backgroundColor: 'none', border: 'none' },
            message: msg,
          },
          options
        )
      );
      console.log('blockUI blocked');
    }
  };
  clutil
    .getIniJSON()
    .done(function (data) {
      mainView = new MainView();
    })
    .fail(function (data) {
      clutil.View.doAbort({
        messages: [clutil.getclmsg('cl_ini_failed')],
        rspHead: data.rspHead,
        homeURL: micaosUtil.loginURL,
      });
    });
});
