/**
 * ログイン
 */
$(function() {

	//IEでは、[console]が使えないので、回避するためのおまじない
	if (typeof window.console != 'object'){
		window.console = {log:function(){},debug:function(){},info:function(){},warn:function(){},error:function(){},assert:function(){},dir:function(){},dirxml:function(){},trace:function(){},group:function(){},groupEnd:function(){},time:function(){},timeEnd:function(){},profile:function(){},profileEnd:function(){},count:function(){}};
	} else if (typeof window.console.debug != 'object') {
	    window.console.debug = function(){};
	}
	//IEでは、[console]が使えないので、回避するためのおまじない

	/**
	 * ORIGINAL store.js
	 */

	/* Copyright (c) 2010 Marcus Westin
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */
	var store = (function(){
		var api = {},
			win = window,
			doc = win.document,
			localStorageName = 'localStorage',
			globalStorageName = 'globalStorage',
			storage;

		api.set = function(key, value) {};
		api.get = function(key) {};
		api.remove = function(key) {};
		api.clear = function() {};
		api.transact = function(key, transactionFn) {
			var val = api.get(key);
			if (typeof val == 'undefined') { val = {}; }
			transactionFn(val);
			api.set(key, val);
		};

		api.serialize = function(value) {
			return JSON.stringify(value);
		};
		api.deserialize = function(value) {
			if (typeof value != 'string') { return undefined; }
			return JSON.parse(value);
		};

		// Functions to encapsulate questionable FireFox 3.6.13 behavior
		// when about.config::dom.storage.enabled === false
		// See https://github.com/marcuswestin/store.js/issues#issue/13
		function isLocalStorageNameSupported() {
			try { return (localStorageName in win && win[localStorageName]); }
			catch(err) { return false; }
		}

		function isGlobalStorageNameSupported() {
			try { return (globalStorageName in win && win[globalStorageName] && win[globalStorageName][win.location.hostname]); }
			catch(err) { return false; }
		}

		if (isLocalStorageNameSupported()) {
			storage = win[localStorageName];
			api.set = function(key, val) { storage.setItem(key, api.serialize(val)); };
			api.get = function(key) { return api.deserialize(storage.getItem(key)); };
			api.remove = function(key) { storage.removeItem(key); };
			api.clear = function() { storage.clear(); };

		} else if (isGlobalStorageNameSupported()) {
			storage = win[globalStorageName][win.location.hostname];
			api.set = function(key, val) { storage[key] = api.serialize(val); };
			api.get = function(key) { return api.deserialize(storage[key] && storage[key].value); };
			api.remove = function(key) { delete storage[key]; };
			api.clear = function() { for (var key in storage ) { delete storage[key]; } };

		} else if (doc.documentElement.addBehavior) {
			storage = doc.createElement('div');
			function withIEStorage(storeFunction) {
				return function() {
					var args = Array.prototype.slice.call(arguments, 0);
					args.unshift(storage);
					// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
					// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
					doc.body.appendChild(storage);
					storage.addBehavior('#default#userData');
					storage.load(localStorageName);
					var result = storeFunction.apply(api, args);
					doc.body.removeChild(storage);
					return result;
				};
			}
			api.set = withIEStorage(function(storage, key, val) {
				storage.setAttribute(key, api.serialize(val));
				storage.save(localStorageName);
			});
			api.get = withIEStorage(function(storage, key) {
				return api.deserialize(storage.getAttribute(key));
			});
			api.remove = withIEStorage(function(storage, key) {
				storage.removeAttribute(key);
				storage.save(localStorageName);
			});
			api.clear = withIEStorage(function(storage) {
				var attributes = storage.XMLDocument.documentElement.attributes;
				storage.load(localStorageName);
				for (var i=0, attr; attr = attributes[i]; i++) {
					storage.removeAttribute(attr.name);
				}
				storage.save(localStorageName);
			});
		}

		return api;
	})();
	//////////////////////////////////////////////////////////////////
	// store.js プラグイン拡張 - セットしているキーがどんなかを管理
	(function(store){
		if(!store){
			throw 'store.js がロードされておりません。';
		}

		var origSetFunc = store.set;
		var origRemoveFunc = store.remove;
		var _keys = '_keys';

		/**
		 *
		 */
		store.set = function(k,v){
			if(k != null){
				var keyMap = store.get(_keys) || {};
				keyMap[k] = true;
				origSetFunc(_keys, keyMap);
			}
			origSetFunc(k,v);
		};

		/**
		 *
		 */
		store.remove = function(k){
			var keyMap = store.get(_keys);
			var kk = _.isArray(k) ? k : [ k ];
			for(var i = 0; i < kk.length; i++){
				var k = kk[i];
				origRemoveFunc(k);
				if(k != null){
					if(keyMap && _.has(keyMap, k)){
						delete keyMap[k];
					}
				}
			}
			if(keyMap){
				origSetFunc(_keys, keyMap);
			}
		};

		/**
		 *
		 */
		store.keys = function(){
			var keyMap = store.get(_keys);
			return keyMap || {};
		};

	}(store));

	/**
	 * ORIGINAL tooltip.js
	 */

	!function ($) {

	  "use strict"; // jshint ;_;


	 /* TOOLTIP PUBLIC CLASS DEFINITION
	  * =============================== */

	  var Tooltip = function (element, options) {
	    this.init('tooltip', element, options);
	  };

	  Tooltip.prototype = {

	    constructor: Tooltip

	  , init: function (type, element, options) {
	      var eventIn
	        , eventOut;

	      this.type = type;
	      this.$element = $(element);
	      this.options = this.getOptions(options);
	      this.enabled = true;

	      if (this.options.trigger == 'click') {
	        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
	      } else if (this.options.trigger != 'manual') {
	        eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus';
	        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur';
	        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
	        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
	      }

	      this.options.selector ?
	        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
	        this.fixTitle();
	    }

	  , getOptions: function (options) {
	      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data());

	      if (options.delay && typeof options.delay == 'number') {
	        options.delay = {
	          show: options.delay
	        , hide: options.delay
	        };
	      }

	      return options;
	    }

	  , enter: function (e) {
	      var self = $(e.currentTarget)[this.type](this._options).data(this.type);

	      if (!self.options.delay || !self.options.delay.show) return self.show();

	      clearTimeout(this.timeout);
	      self.hoverState = 'in';
	      this.timeout = setTimeout(function() {
	        if (self.hoverState == 'in') self.show();
	      }, self.options.delay.show);
	    }

	  , leave: function (e) {
	      var self = $(e.currentTarget)[this.type](this._options).data(this.type);

	      if (this.timeout) clearTimeout(this.timeout);
	      if (!self.options.delay || !self.options.delay.hide) return self.hide();

	      self.hoverState = 'out';
	      this.timeout = setTimeout(function() {
	        if (self.hoverState == 'out') self.hide();
	      }, self.options.delay.hide);
	    }

	  , show: function () {
	      var $tip
	        , inside
	        , pos
	        , actualWidth
	        , actualHeight
	        , placement
	        , tp = null;

	      if (this.hasContent() && this.enabled) {
	        $tip = this.tip();
	        this.setContent();

	        if (this.options.animation) {
	          $tip.addClass('fade');
	        }

	        placement = typeof this.options.placement == 'function' ?
	          this.options.placement.call(this, $tip[0], this.$element[0]) :
	          this.options.placement;

	        inside = /in/.test(placement);

	        $tip
	          .detach()
	          .css({ top: 0, left: 0, display: 'block' });

	        switch (this.options.container || 'parent') {
	          case "parent":
	            $tip.insertAfter(this.$element);
	          break;
	          case "body":
	            $tip.appendTo(document.body);
	          break;
	          default:
	            var container = $(this.options.container);
	            if (container.length) {
	              $tip.appendTo(container);
	            } else {
	              $tip.insertAfter(this.$element);
	            }
	        }
	        pos = this.getPosition(inside);

	        actualWidth = $tip[0].offsetWidth;
	        actualHeight = $tip[0].offsetHeight;

	        switch (inside ? placement.split(' ')[1] : placement) {
	          case 'bottom':
	            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2};
	            break;
	          case 'top':
	            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2};
	            break;
	          case 'left':
	            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth};
	            break;
	          case 'right':
	            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width};
	            break;
	        }

	        $tip
	          .offset(tp)
	          .addClass(placement)
	          .addClass('in');
	      }
	    }

	  , setContent: function () {
	      var $tip = this.tip()
	        , title = this.getTitle();

	      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
	      $tip.removeClass('fade in top bottom left right');
	    }

	  , hide: function () {
	      var that = this
	        , $tip = this.tip();

	      $tip.removeClass('in');

	      function removeWithAnimation() {
	        var timeout = setTimeout(function () {
	          $tip.off($.support.transition.end).detach();
	        }, 500);

	        $tip.one($.support.transition.end, function () {
	          clearTimeout(timeout);
	          $tip.detach();
	        });
	      }

	      $.support.transition && this.$tip.hasClass('fade') ?
	        removeWithAnimation() :
	        $tip.detach();

	      return that;
	    }

	  , fixTitle: function () {
	      var $e = this.$element;
	      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
	        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title');
	      }
	    }

	  , hasContent: function () {
	      return this.getTitle();
	    }

	  , getPosition: function (inside) {
	      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
	        width: this.$element[0].offsetWidth
	      , height: this.$element[0].offsetHeight
	      });
	    }

	  , getTitle: function () {
	      var title
	        , $e = this.$element
	        , o = this.options;

	      title = $e.attr('data-original-title')
	        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title);

	      return title;
	    }

	  , tip: function () {
	      return this.$tip = this.$tip || $(this.options.template);
	    }

	  , validate: function () {
	      if (!this.$element[0].parentNode) {
	        this.hide();
	        this.$element = null;
	        this.options = null;
	      }
	    }

	  , enable: function () {
	      this.enabled = true;
	    }

	  , disable: function () {
	      this.enabled = false;
	    }

	  , toggleEnabled: function () {
	      this.enabled = !this.enabled;
	    }

	  , toggle: function (e) {
	      var self = $(e.currentTarget)[this.type](this._options).data(this.type);
	      self[self.tip().hasClass('in') ? 'hide' : 'show']();
	    }

	  , destroy: function () {
	      this.hide().$element.off('.' + this.type).removeData(this.type);
	    }

	  };


	 /* TOOLTIP PLUGIN DEFINITION
	  * ========================= */

	  $.fn.tooltip = function ( option ) {
	    return this.each(function () {
	      var $this = $(this)
	        , data = $this.data('tooltip')
	        , options = typeof option == 'object' && option;
	      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)));
	      if (typeof option == 'string') data[option]();
	    });
	  };

	  $.fn.tooltip.Constructor = Tooltip;

	  $.fn.tooltip.defaults = {
	    animation: true
	  , placement: 'top'
	  , selector: false
	  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
	  , trigger: 'hover'
	  , title: ''
	  , delay: 0
	  , html: false
	  , container: 'parent'
	  };

	}(window.jQuery);

	// ツールチップ設定
	$('body').tooltip({
		selector: '[data-cl-errmsg]',
		title: function () {
			//console.log(this);
			return $(this).attr('data-cl-errmsg');
		},
		position: 'right',
		container: 'body'
	});

	/**
	 * ユーティリティ
	 * 主に clcom, clutil からポーティング。
	 */
	myUtil = {
		//accessTestURI:	'/system/js/cl_accesstest.js',		// このファイルにアクセスできなかったらセッション切れ
		accessTestURI:	'/system/api/am_pa_type_get',	// アクセスチェック用
		loginURI:	'/api/am_cm_micaoslogin',
		passwdURI:	'/api/passwdchg',

		homeURL: micaosUtil.homeURL, //'/index.html',	//clcom.appRoot + '/menu/menu.html'
		unavailablePageURL: '/err/unavailable.html',

		passwordDomain: {
			minLength: 8,
			maxLength: 20
		},

		/**
		 * メッセージマップ（切出し）
		 */
		msgCodeMap: {
			// http エラー
			cl_http_status_xxx: '障害が発生しました。ご迷惑お掛けしています。しばらくお待ち下さい。',
			cl_http_status_0: 'サーバーに接続できませんでした。',
			cl_http_status_unauthorized: 'ログイン情報が確認できませんでした。しばらくお待ち下さい。',

		    // validation メッセージ
			cl_echoback: "入力項目が間違っています。",
			cl_required: '入力してください。',
			cl_length_long2: '{0}〜{1}文字で入力してください。',

			// サーバアプリメッセージ（１）
			cl_sys_error: 'システムエラーが発生しました。',
			ca_bad_password: 'パスワードが間違っています。',

			// サーバアプリメッセージ（２）
			ECM0001: "ログインコードまたはパスワードが違います。",
			ECM0012: "英字のみ・数字のみのパスワードは不可です。英数字が混在したパスワードを入力してください。",
			ECM0004: "旧パスワードと異なるパスワードを入力してください。",
			ECM0005: "新パスワードを再度入力してください。"
		},

		/** 今ブロッキング中かどうかフラグ  */
		UIBlocking : 0,
		/** 画面をブロックする */
		blockUI : function() {
			if (myUtil.UIBlocking > 0) {
				myUtil.UIBlocking++;
				return;
			}else{
				myUtil.UIBlocking++;
//				$.blockUI({ centerY: 0, css: { top:'10px', left:'', right:'10px' } });
				var msg = '<div class="nowloading">Now loading...</div><div id="loading" class=""><img src="/css/micaos/circle_1.gif"></div>';
				$.blockUI({
					css: { 'backgroundColor':'none', 'border':'none' },
					message: msg
				});
				console.log('blockUI blocked');
			}
		},
		/** 画面のブロックを解除する */
		unblockUI : function(a) {
			console.log('unblockUI called, [' + a + '], flag[' + myUtil.UIBlocking + ']');
			myUtil.UIBlocking--;
			if (myUtil.UIBlocking <= 0) {
				myUtil.UIBlocking = 0;
				$.unblockUI();
				console.log('unblockUI unblocked');
			}
		},

		// ---------------------------------------------------
		httpcall : function(method, uri, data, appcallback, errcallback, completecallback) {
			var param = {
				type: method,
				url: uri,
				async: true,
				success: appcallback,
				error: function(xhr, textStatus, errorThrow){
					switch(xhr.status) {
//					case 503:		// forbidden
//						location = myUtil.unavailablePageURL;
//						break;
					case 0:
						errcallback(xhr, myUtil.getclmsg('cl_http_status_0'));
						break;
					default:
						if (_.isFunction(errcallback)) {
							errcallback(xhr, textStatus, errorThrow);
						}
					}
				},
				complete: function(req, stat) {
					myUtil.unblockUI(uri);
					if (_.isFunction(completecallback) ) {
						completecallback(req, stat);
					}
				},
				beforeSend: function(xhr) {
					// キャッシュ作用を防ぐため
					xhr.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT");
				},
				dataType: 'json'
			};
			if (data !== null) {
				param.data = JSON.stringify(data);
				param.contentType = 'application/json';
			}
			myUtil.blockUI();
			return $.ajax(param);
		},

		/**
		 * 指定されたクッキーの有無を検査する。
		 * @param cookey
		 * @returns {Boolean} 値があれば True を返す。
		 */
		hasCookie : function(cookey) {
			var arg = cookey+'=';
			var alen = arg.length;
			var clen = document.cookie.length;
			var i = 0;
			while (i < clen) {
				var j = i + alen;
				if (document.cookie.substring(i, j) == arg) {
					return true;
				}
				i = document.cookie.indexOf(" ", i) + 1;
				if (i === 0) {
					break;
				}
			}
			return false;
		},

		/**
		 * 指定されたクッキーを削除する。
		 * @param cookey
		 */
		delCookie : function(cookey) {
			document.cookie = cookey + "=dummy;expires=Thu, 01 Jun 1970 00:00:00 GMT; path=/";
		},

		/**
		 * ログイン中かどうか判断するために、サーバへアクセステストする。
		 * @returns {promise}
		 */
		getIniJSON: function(){
			var userInfo = store.get('clcom.userdata');

			/*
			 * パラメーターにユーザーコードが設定されていたら、それと比較する
			 */
			var param = myUtil.getParam();
			console.log(param);

			// クッキーによるログインチェック
			if(!myUtil.hasCookie('auth_token') || _.isEmpty(userInfo) || (!_.isEmpty(param) && userInfo.user_code != param.userCd)){
				// 認証NG
				var errHd = {
					status: 'error',
					message: 'cl_http_status_unauthorized',
					httpStatus: 401
				};

				var d = $.Deferred();
				return d.reject({ head: errHd, rspHead: errHd });
			}

			var d = $.Deferred();

			myUtil.httpcall('POST', myUtil.accessTestURI, {}, function(data){
				// success
				var appStat = -1;
				if(data.rspHead){
					appStat = data.rspHead.status;
				}else if(data.head){
					appStat = data.head.status;
				}
				if(appStat === 0){
					// OK
					d.resolve(data, 'success');
				}else{
					// NG
					d.reject(data);
				}
			}, function(xhr, textStatus, errorThrown){
				// error
				// 一律に認証NGあつかいとでもしておく・・・
				var errHd = {
					status: 'error',
					message: 'cl_http_status_unauthorized',
					httpStatus: 401
				};
				d.reject({ head: errHd, rspHead: errHd });
			});

			return d.promise();
		},

		/**
		 * メッセージコードから、エラーメッセージを取得する。
		 * @param key
		 * @returns
		 */
		getclmsg: function(key) {
			var msg = myUtil.msgCodeMap[key];
			return _.isEmpty(msg) ? key : msg;
		},

		/**
		 * 書式つき文字列
		 * @param {String} fmt フォーマット
		 * @returns 文字列
		 * @example
		 * <pre>
		 * > clutil.fmt("range: {0}-{1}", 123, 456);
		 * > range: 123-456
		 * </pre>
		 * TODO:エラーメッセージをID化するか文字列化するか？
		 */
		fmt: function(fmt) {
			var i;
			for (i = 1; i < arguments.length; i++) {
				var reg = new RegExp("\\{" + (i - 1) + "\\}", "g");
				fmt = fmt.replace(reg,arguments[i]);
			}
			return fmt;
		},

		/** 指定テキストが英数混じりであることを検査する */
		mixCheck: function(text){
			var regex_alpha = /[a-zA-Z]/;
			var regex_num = /[0-9]/;
			return (regex_alpha.test(text) && regex_num.test(text));
		},

		setUserData: function(data){
//			clcom.setUserData(data);
			var key = 'clcom.userdata';
			store.set(key, data);
		},
		// モバイルデバイス判定関数
		is_iPad:function(){
			var flag = false;
			var agent = navigator.userAgent;
			if(agent.search(/iPad/) != -1) {
				flag = true;
			}
			return flag;
		},
		is_iPhone:function(){
			var flag = false;
			var agent = navigator.userAgent;
			if(agent.search(/iPhone/) != -1) {
				flag = true;
			}
			return flag;
		},
		is_Android:function(){
			var flag = false;
			var agent = navigator.userAgent;
			if(agent.search(/Android/) != -1) {
				flag = true;
			}
			return flag;
		},

		goHome: function(){
//			clcom.pushPage(myUtil.homeURL, null, null, null, true);
			var myurl = myUtil.homeURL;
			if (this.is_iPad() || this.is_iPhone()) {
				myurl = '/system/app/AMSI/AMSIV0010/AMSIV0010.html';
			}
			var dstId = function(pathname){
				return (pathname.split('/').pop() || '').split('.').shift() || '';
			}(myurl);
			var hash = function(){
				// generateHash();
				return String(Date.now());
			}();

			var s = [];
			s.push({
				type: 0,
				dstId: dstId,
				dstUrl: myurl
			});
			s.push({
				type: 1,
				srcUrl: location.href,
				srcId: '',
				srcPageTitle: document.title,
				hash: hash
			});
			store.set('clcom.pushpop', s);

			var go = function(url, hash){
				hash = encodeURIComponent(hash);
				url = url.split('#')[0];
				window.location.href = url + '#' + hash;
			};
			go(myurl, hash);
		},

		clearStorage: function(){
			// クリア除外キー
			var savingKeys = {};
//			if(!(args && args.removeUserData === true)){
//				// ログイン情報をストレージ - 引数 args.removeUserData で true 明示しない場合は保護対象。
//				savingKeys[clcom.storagePrefix + 'userdata'] = true;
//			}

			// キー一覧からストレージをクリアしていく。
			var storeKeyMap = store.keys();
			var regEx = /^clcom\./;
			var delKeys = _.reduce(storeKeyMap, function(delkeys, v, k){
				do{
					if(!regEx.test(k)){
						break;
					}
					if(savingKeys[k]){
						break;
					}
					delkeys.push(k);
				}while(false);
				return delkeys;
			}, []);

			if(!_.isEmpty(delKeys)){
				// 削除
				store.remove(delKeys);
			}
		},

		goMicaosHome: function(response) {
			micaosUtil.setLoginResponse(response);
			this.goHome();
		},

		/*
		 * 以下SSO関連 #20160509
		 */

		/**
		 * パラメータ取得
		 */
		getParam: function() {
			if (1 < document.location.search.length) {
				// 最初の1文字 (?記号) を除いた文字列を取得する
				var query = document.location.search.substring(1);

				// クエリの区切り記号 (&) で文字列を配列に分割する
				var parameters = query.split('&');

				var result = new Object();
				for (var i = 0; i < parameters.length; i++) {
					// パラメータ名とパラメータ値に分割する
					var element = parameters[i].split('=');
					var paramName = decodeURIComponent(element[0]);
					var paramValue = decodeURIComponent(element[1]);
					// パラメータ名をキーとして連想配列に追加する
					result[paramName] = decodeURIComponent(paramValue);
				}
				return result;
			}
			return null;
		},

		_eof: '---login.js//'

	};

	/**
	 * ログインリクエストモデルクラス
	 */
	var LoginReqModel = Backbone.Model.extend({
		defaults: {
			loginname: null,
			password: null
		},
		initialize: function(){
			console.log('LoginReqMode#' + this.cid);
		},
		validate: function(attrs, opt){
			console.log('LoginReqModel#' + this.cid + ': validate() called.');
			if(opt.name){
				// 特定の項目だけチェック
				if(_.isEmpty(attrs[opt.name])){
					// 間違った値でもモデルに値をセットしておく・・・
					// ∵）Inputを留めない＆最後に全項目チェックをやるから。
					this.set(opt.name, attrs[opt.name]);
					//'入力してください。';
					return myUtil.getclmsg('cl_required');
				}
			}else{
				// 全項目をチェック
				var errInfo = {};
				for(var key in this.defaults){
					if(_.isEmpty(attrs[key])){
						//'入力してください。';
						errInfo[key] = myUtil.getclmsg('cl_echoback');
					}
				}
				if(!_.isEmpty(errInfo)){
					opt.errInfo = errInfo;
					// cl_echoback: "入力項目が間違っています。"
					return myUtil.getclmsg('cl_echoback');
				}
			}
		}
	});

	/**
	 * ログインビュークラス
	 */
	var LoginView = Backbone.View.extend({
		events: {
			'keydown input[name]': function(e){
				switch(e.which){
				case 32:	// スペース
				//case 229:
					return false;
				}
			},
			'keypress input[name]'	: '_onKeyPress',
			'focusout input[name]'	: '_onStopEditing',
			'click #ca_btn_login'	: '_onClickLoginBtn'
		},
		template: _.template( $('#ca_login_template').html() ),
		initialize: function(opt){
			console.log('LoginView#' + this.cid + ', this.model#' + this.model.cid);
			_.bindAll();

			this.listenTo(this.model, 'invalid', this._onModelInvalid);
			this.listenTo(this.model, 'change', _.bind(function(model, opt){
				console.log('LoginView: model.changed: ', arguments);
//				if(_.isEmpty(opt)){
//					// 新しい DTO がモデルにセットされた → View 側の表示を更新するっ！
//					this.$('input[name]').each(function(){
//						var $input = $(this);
//						var name = $input.attr('name');
//						var val = model.get(name);
//						$input.removeClass('cl_error_field').removeAttr('data-cl-errmsg').val(val);
//					});
//				}
			},this));
		},
		render: function(){
			var tmpl = this.template(this.model.toJSON());
			this.$el.html(tmpl);
//			this.$('[name="loginname"]').focus();
			return this;
		},
//		destroy: function(){
//			this.model.destroy();
//		},
		// 編集ストップ：view → model へデータをセットする。
		_onStopEditing: function(e){
			var $input = $(e.target);
			var name = $input.attr('name');
			var val = $input.val();
			var setVal = function(n,v){
				var obj = {};
				obj[n] = v;
				return obj;
			}(name, val);
			if(this.model.set(setVal, {validate: true, name: name})){
				// isValid[OK]: エラーメッセージを取る。
				$input.removeAttr('data-cl-errmsg').removeClass('cl_error_field');
			}
		},
		// [ログイン]ボタンクリックアクション
		_onClickLoginBtn: function(e){
			var p = {target: $("input[name='password']")};
			this._onStopEditing(p);

			if(!this.model.isValid()){
				return;
			}
			this.clearError();
			this.trigger('loginReqReady', this.model.toJSON());
		},
		// モデルから、入力チェックＮＧのイベントを購読
		_onModelInvalid: function(model, error, options){
			console.log('LoginView#' + this.cid + ', this.model#' + this.model.cid + ': model#' + model.cid + ' is invalid, error[' + error + ']');
			if(options.name){
				this.$('[name=' + options.name + ']').addClass('cl_error_field').attr('data-cl-errmsg', error);
			}else if(options.errInfo){
				for(var name in options.errInfo){
					this.$('[name=' + name + ']').addClass('cl_error_field').attr('data-cl-errmsg', options.errInfo[name]);
				}
				this.$('.cl_error_field').first().focus();
				this.trigger('ticker', error);
			}
		},
		// キーイベントのバインディング
		_onKeyPress: function(e) {
			// Enter キー以外は無視
			if (e.which != 13) return;

			var $target = $(e.target);
			if (_.isEmpty($target.val())) {
				// カレントの input が空欄ならその場所に待機
				return;
			}

			// 空欄 input へフォーカスを入れる
			var $next = ($target.attr('name') == 'loginname') ? this.$('[name="password"]') : this.$('[name="loginname"]');
			if(_.isEmpty($next.val())){
				$next.focus();
				return;
			}

			// ログインボタンへフォーカス移動して、ボタンクリックを実行。
			this.$('#ca_btn_login').focus().click();
		},
		/**
		 * エラー情報をクリアする。
		 */
		clearError: function(){
			this.$('input').removeAttr('data-cl-errmsg').removeClass('cl_error_field');
			this.model.validationError = null;
			return this.$('[name="loginname"]');	// 呼出元で必要があれば、このElementにフォーカスを入れるとか・・
		},
		/**
		 * 入力をクリアする。
		 */
		clear: function(){
			this.model.clear();
			// XXX モデルからチェンジイベント経由でViewが更新されるかな？、と思ったら、チェンジイベントが飛んでこない？？？
			this._sync();
			this.model.validationError = null;
			return this.$('input[name]').text('').first();	// 呼出元で必要があれば、この Element にフォーカスを入れるとか・・・
		},
		// 本来は、モデルの change イベントを以て、view の表示を更新したいのだが、
		// model.set() や、model.clear() で change イベントが発しない？？？
		// ごり押しでモデルデータをViewへ反映する。
		_sync: function(){
			var _m = this.model;
			this.$('input[name]').each(function(){
				var $input = $(this);
				var name = $input.attr('name');
				var val = _m.get(name);
				$input.removeClass('cl_error_field').removeAttr('data-cl-errmsg').val(val);
			});
		},
		getDefaultFocusElement: function(){
			return this.$('[name="loginname"]');
			//return this.$('input:not([disabled]):first');
		}
	});

	/**
	 * パスワード変更リクエストモデルクラス
	 */
	var PasswdChangeReqModel = Backbone.Model.extend({
		defaults: {
			user_id: 0,
			user_code: '???',
			oldpassword: null,
			newpassword: null,
			newpassword2: null,
		},
		initialize: function(){
			console.log('PasswdChangeReqModel#' + this.cid);
		},
		validate: function(attrs, opt){
			console.log('PasswdChangeReqModel#' + this.cid + ': validate() called.');
			var _validateInternal = function(attrs, name){
				var val = attrs[name];
				if(_.isFinite(val) && val !== 0){
					val = val.toString();
				}
				if(_.isEmpty(val)){
					//'入力してください。';
					return myUtil.getclmsg('cl_required');
				}

				// newpassword, newpassword2 共通チェック
				switch(name){
				case 'newpassword':
				case 'newpassword2':
					// 8 文字以上 20 文字以下で。
					if(val.length < myUtil.passwordDomain.minLength || val.length > myUtil.passwordDomain.maxLength){
						// cl_length_long2: {0}〜{1}文字で入力してください。
						return myUtil.fmt(myUtil.getclmsg('cl_length_long2')
								, myUtil.passwordDomain.minLength
								, myUtil.passwordDomain.maxLength);
					}
					// 数値＆英字ミックスで
					// ECM0012: "英字のみ・数字のみのパスワードは不可です。英数字が混在したパスワードを入力してください。
					if(!myUtil.mixCheck(val)){
						return myUtil.getclmsg('ECM0012');
					}
				}

				// 個別チェック
				switch(name){
				case 'newpassword':
					// oldpassword と異なること
					if(attrs.oldpassword == val){
						// ECM0004: "旧パスワードと異なるパスワードを入力してください。",
						return myUtil.getclmsg('ECM0004');
					}
					break;
				case 'newpassword2':
					// newpassword と一致すること
					if(attrs.newpassword != val){
						// ECM0005: "新パスワードを再度入力してください。",
						return myUtil.getclmsg('ECM0005');
					}
					break;
				}
			};

			if(opt.name){
				// 特定の項目だけチェック
				try{
					return _validateInternal(attrs, opt.name);
				}finally{
					// 間違った値でもモデルに値をセットしておく・・・
					// ∵）Inputを留めない＆最後に全項目チェックをやるから。
					var val = attrs[opt.name];
					this.set(opt.name, val);
				}
			}else{
				// 全項目をチェック
				var errInfo = {};
				for(var name in this.defaults){
					var invalMsg = _validateInternal(attrs, name);
					if(invalMsg){
						errInfo[name] = invalMsg;
					}
				}
				if(!_.isEmpty(errInfo)){
					opt.errInfo = errInfo;
					// cl_echoback: "入力項目が間違っています。"
					return myUtil.getclmsg('cl_echoback');
				}
			}
		}
	});

	/**
	 * パスワード変更ビュークラス
	 */
	var PasswdView = Backbone.View.extend({
		events: {
			'keydown input[name]': function(e){
				switch(e.which){
				case 32:	// スペース
				//case 229:
					return false;
				}
			},
			'keypress input[name]'		: '_onKeyPress',
			'focusout input[name]'		: '_onStopEditing',
			'click #ca_btn_passwdchg'	: '_onClickPasswdchgBtn',
			'click #ca_btn_back'		: '_onClickBackBtn'
		},
		template: _.template( $('#ca_passwd_template').html() ),
		initialize: function(opt){
			console.log('PasswdView#' + this.cid + ', this.model#' + this.model.cid);
			_.bindAll();

			this.listenTo(this.model, 'invalid', this._onModelInvalid);
			this.listenTo(this.model, 'change', _.bind(function(model, opt){
				console.log('PasswdView: model.changed: ', arguments);
//				if(_.isEmpty(opt)){
//					// 新しい DTO がモデルにセットされた → View 側の表示を更新するっ！
//					this.$('input[name]').each(function(){
//						var $input = $(this);
//						var name = $input.attr('name');
//						var val = model.get(name);
//						$input.removeClass('cl_error_field').removeAttr('data-cl-errmsg').val(val);
//					});
//				}
			}, this));
		},
		render: function(){
			var tmpl = this.template(this.model.toJSON());
			this.$el.html(tmpl);
//			this.$('[name="oldpassword"]').focus();
			return this;
		},
		// キーイベントのバインディング
		_onKeyPress: function(e) {
			// Enter キー以外は無視
			if (e.which != 13) return;

			var $target = $(e.target);
			if (_.isEmpty($target.val())) {
				// カレントの input が空欄ならその場所に待機
				return;
			}

			// 空欄 input へフォーカスを入れる
			var $firstEmptyInput = null, $nextEmptyInput = null, isPrev = true, targetName = $target.attr("name");
			this.$('input[name]:not("[disabled]")').each(function(){
				var $this = $(this);
				if($this.attr('name') == targetName){
					isPrev = false;
				}
				var val = $this.val();
				if(!val){
					if(isPrev){
						if($firstEmptyInput == null){
							$firstEmptyInput = $this;
						}
					}else{
						if($nextEmptyInput == null){
							$nextEmptyInput = $this;
						}
					}
				}
			});
			if($nextEmptyInput){
				// $target より後方の空欄 input へフォーカス。
				$nextEmptyInput.focus();
				return;
			}
			if($firstEmptyInput){
				// $target より後方に空欄 input なし。前方の空欄 input へフォーカス。
				$firstEmptyInput.focus();
				return;
			}

			// パスワード変更ボタンへフォーカス移動して、ボタンクリックを実行。
			$('#ca_btn_passwdchg').focus().click();
		},
		// 編集ストップ：view → model へデータをセットする。
		_onStopEditing: function(e){
			var $input = $(e.target);
			var name = $input.attr('name');
			var val = $input.val();
			var setVal = function(n,v){
				var obj = {};
				obj[n] = v;
				return obj;
			}(name, val);
			if(this.model.set(setVal, {validate: true, name: name})){
				// isValid[OK]: エラーメッセージを取る。
				$input.removeAttr('data-cl-errmsg').removeClass('cl_error_field');
			}
		},
		_onClickPasswdchgBtn: function(e){
			if(!this.model.isValid()){
				return;
			}
			this.clearError();
			this.trigger('passwdReqReady', this.model.toJSON());
		},
		// ログイン画面へ戻る
		_onClickBackBtn: function(e){
			this.trigger('back');
		},
		// モデルから、入力チェックＮＧのイベントを購読
		_onModelInvalid: function(model, error, options){
			console.log('PasswdView#' + this.cid + ', this.model#' + this.model.cid + ': model#' + model.cid + ' is invalid, error[' + error + ']');
			if(options.name){
				this.$('[name=' + options.name + ']').addClass('cl_error_field').attr('data-cl-errmsg', error);
			}else if(options.errInfo){
				for(var name in options.errInfo){
					this.$('[name=' + name + ']').addClass('cl_error_field').attr('data-cl-errmsg', options.errInfo[name]);
				}
				this.$('.cl_error_field').first().focus();
				this.trigger('ticker', error);
			}
		},
		/**
		 * エラー情報をクリアする。
		 */
		clearError: function(){
			this.$('input:not([disabled])').removeAttr('data-cl-errmsg').removeClass('cl_error_field');
			this.model.validationError = null;
			return this.$('[name="oldpassword"]');	// 呼出元で必要があれば、このElementにフォーカスを入れるとか・・
		},
		/**
		 * 入力をクリアする。
		 */
		clear: function(){
			this.model.clear();
			// XXX モデルからチェンジイベント経由でViewが更新されるかな？、と思ったら、チェンジイベントが飛んでこない？？？
			this._sync();
			this.model.validationError = null;
			return this.$('input[name]:not([disabled])').text('').first();	// 呼出元で必要があれば、この Element にフォーカスを入れるとか・・・
		},
		/**
		 * データをセットする。
		 */
		setData: function(dto){
			this.model.set(dto);
			// XXX モデルからチェンジイベント経由でViewが更新されるかな？、と思ったら、チェンジイベントが飛んでこない？？？
			this._sync();
		},
		// 本来は、モデルの change イベントを以て、view の表示を更新したいのだが、
		// model.set() や、model.clear() で change イベントが発しない？？？
		// ごり押しでモデルデータをViewへ反映する。
		_sync: function(){
			var _m = this.model;
			this.$('input[name]').each(function(){
				var $input = $(this);
				var name = $input.attr('name');
				var val = _m.get(name);
				$input.removeClass('cl_error_field').removeAttr('data-cl-errmsg').val(val);
			});
		},
		getDefaultFocusElement: function(){
			return this.$('[name="oldpassword"]');
			//return this.$('input:not([disabled]):first');
		}
	});

	/**
	 * メインビュークラス
	 */
	var MainView = Backbone.View.extend({
		el: $('body'),
		events: {
			'click #ca_errRegion'	: function(e){
				$(e.target).hide();
			}
		},
		initialize: function(){
			_.bindAll();

			// ログインView
			this.loginView = new LoginView({
//				el: $('#ca_content'),
				model: new LoginReqModel()
			});
			this.listenTo(this.loginView, 'loginReqReady', this.doLogin);
			this.listenTo(this.loginView, 'ticker', this.setTicker);

			// パスワード変更View
			this.passwdView = new PasswdView({
//				el: $('#ca_content'),
				model: new PasswdChangeReqModel()
			});
			this.listenTo(this.passwdView, 'passwdReqReady', this.doPasswordChange);
			this.listenTo(this.passwdView, 'back', _.bind(function(){
				this.loginView.model.clear();
				this.showLoginView();
			}, this));
			this.listenTo(this.passwdView, 'ticker', this.setTicker);
		},
		render: function(){
			if (this.hasParamURL()) {
			} else {
				this.loginView.render().$el.hide().appendTo(this.$('#ca_content'));
				this.passwdView.render().$el.hide().appendTo(this.$('#ca_content'));
				this.showLoginView();
				this.$el.css('visibility', 'visible').show().removeClass('cl_body_hidden');
			}
			return this;
		},
		render2: function(req){
			this.loginView.render().$el.hide().appendTo(this.$('#ca_content'));
			this.passwdView.render().$el.hide().appendTo(this.$('#ca_content'));
			this.showLoginView();
			this.$el.css('visibility', 'visible').show().removeClass('cl_body_hidden');

			if (req != null) {
				this.$('input[name="loginname"]').val(req.loginname);
			}
			return this;
		},
		/** エラーメッセージを表示 */
		setTicker: function(msg){
			if(this.tickerTimer){
				clearTimeout(this.tickerTimer);
				this.tickerTimer = null;
			}
			if(_.isEmpty(msg)){
				this.$("#ca_errRegion").hide().text('');
			}else{
				this.$("#ca_errRegion").text(msg).fadeIn();
				this.tickerTimer = setTimeout(_.bind(function(){
					this.$("#ca_errRegion").fadeOut('slow', function(){
						$(this).text('');
					});
				}, this), 5000);
			}
		},
		/** ログインViewを表示 */
		showLoginView: function(){
			this.$('.tooltip').remove();
			this.setTicker(null);

			this.passwdView.$el.hide();

			this.savedUserData = null;
			this.loginView.clear();

			this.loginView.$el.show();
			this.loginView.getDefaultFocusElement().focus();
		},
		/** パスワード変更Viewを表示 */
		showPasswordView: function(){
			this.$('.tooltip').remove();
			this.setTicker(null);

			this.loginView.$el.hide();

			var dto = _.pick(this.savedUserData || {}, 'user_id', 'user_code');
//			this.passwdView.model.set(dto);
			this.passwdView.setData(dto);
			this.passwdView.$el.show();
			this.passwdView.getDefaultFocusElement().focus();
		},
		/** ログイン処理 */
		doLogin: function(dto){
			this.setTicker(null);
			myUtil.httpcall('POST', myUtil.loginURI, dto, _.bind(function(data){
				// 0=成功、1=失敗、2=パスワード期限切れ、3=パスワード初期状態
				switch(data.status){
				case 0:		// 成功
					// success - ユーザデータを WebStorage に保存する
					myUtil.setUserData(data);
					myUtil.goMicaosHome(data);
					break;
				case 1: 	// 失敗
					// ECM0001: ログインコードまたはパスワードが違います。
					this.setTicker(myUtil.getclmsg('ECM0001'));
					this.loginView.clear().focus();
					break;
				case 4: 	// アカウントロック中
					this.setTicker('このアカウントはロック中です。');
					this.loginView.clear().focus();
					break;
				case 2:		// パスワード期限切れ
//					this.renderPasswordView(_.pick(data, 'user_id', 'user_code'));
					this.savedUserData = data;
					this.showPasswordView();
					this.setTicker('パスワードが期限切れです。新しいパスワードを設定してください。');
					break;
				case 3:		// パスワード初期状態
//					this.renderPasswordView(_.pick(data, 'user_id', 'user_code'));
					this.savedUserData = data;
					this.showPasswordView();
					this.setTicker('初期パスワードです。新しいパスワードを設定してください。');
					break;
				}
			},this), _.bind(function(xhr, textStatus, errorThrow){
				// error
				console.error('[login] failed.', arguments);
				// 致命的エラー
				this.loginView.clearError().focus();
				var msg = _.isEmpty(textStatus)
					? "システム障害が発生しました。しばらくお待ち下さい。(" + xhr.status + ':' + $.trim(xhr.statusText) + ")"
					: textStatus;
				this.setTicker(msg);
			}, this));
		},
		/** パスワード変更処理 */
		doPasswordChange: function(dto){
			this.setTicker(null);

			// プロトコルヘッダを補完
			dto.head = {
				opeTypeId: 2//am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
			};
			myUtil.httpcall('POST', myUtil.passwdURI, dto, _.bind(function(data){
				// OK
				var hd = data.head;
				if(hd.status == 0){
					// 成功
					myUtil.setUserData(this.savedUserData);
					myUtil.goHome();
					return;
				}
				if(hd.message){
					var arg = _.isArray(hd.args) ? hd.args : [];
					var msg = myUtil.fmt(myUtil.getclmsg(hd.message)
							, arg[0], arg[1], arg[2], arg[3], arg[4], arg[5]);
					this.setTicker(msg);
				}
			}, this), _.bind(function(xhr, textStatus, errorThrow){
				// error
				console.error('[passwdchg] failed.', arguments);
				// 致命的エラー
				this.passwdView.clearError().focus();
				this.setTicker("システム障害が発生しました。しばらくお待ち下さい。(" + $.trim(xhr.responseText) + ")");
			}, this));
		},

		/**
		 * URL引数にSSOのパラメータがあれば、それを使用してログインする
		 * @returns {Boolean}
		 */
		hasParamURL: function() {
			var http_param = myUtil.getParam();
			if (http_param==null) {
				return false;
			}
			else{
				// パケット名称修正
				http_param.loginname = http_param.userCd;
				http_param.passwordHash = http_param.passwd;
				//http_param.password = http_param.passwd;
				delete http_param.userCd;
				delete http_param.passwd;
				// ユーザコードとパスワードを入れて問い合わせ
				var checkParam = this.callCheckParam(http_param);	// TODO
				if(!checkParam){
					$("input[name='loginname'").val(http_param.loginname);
				}
				// クッキー削除
				myUtil.delCookie("auth_token");	// TODO
				return true;
			}
		},

		callCheckParam: function(req) {
			myUtil.httpcall('POST', myUtil.loginURI, req, _.bind(function(data) {
				// 0=成功、1=失敗、2=パスワード期限切れ、3=パスワード初期状態
				switch(data.status){
				case 0:		// 成功
					// success - ユーザデータを WebStorage に保存する
					myUtil.setUserData(data);
					myUtil.goMicaosHome(data);
					break;
				case 1: 	// 失敗
					// ECM0001: ログインコードまたはパスワードが違います。
					this.render2(req);
					this.setTicker(myUtil.getclmsg('ECM0001'));
					//this.loginView.clear().focus();
					break;
				case 4: 	// アカウントロック中
					this.render2(req);
					this.setTicker('このアカウントはロック中です。');
					//this.loginView.clear().focus();
					break;
				}
			}, this), _.bind(function(xhr, textStatus, errorThrow) {
				// error
				console.error('[login] failed.', arguments);
				// 致命的エラー
				//this.loginView.clearError().focus();
				var msg = _.isEmpty(textStatus)
					? "システム障害が発生しました。しばらくお待ち下さい。(" + xhr.status + ':' + $.trim(xhr.statusText) + ")"
					: textStatus;
					this.setTicker(msg);
			}, this));
		},

	});

	// ストレージのキャッシュの再取得をする。
	// ログインセッションが無ければサーバからエラー応答が返るので、ログイン画面を表示。
	// キャッシュ情報の最新取得ができれば、セッションが確立しているので、即効で HOME 画面へ遷移。
	myUtil.getIniJSON().done(function(data){
		// ログインセッションな Cookie が有効なら、ここに入る
		// 速攻でホーム画面へ遷移する。
		myUtil.goHome();
	}).fail(function(data){
		myUtil.clearStorage();
		myUtil.delCookie('auth_token');
		mainView = new MainView().render();
	});


	// ------------------------------------------------------------------------
	// テスト用スタイルの設定
	var TestStyleCtrl = {
		testHosts: [
			'172.23.35.30',		// AWS検証環境#1
			'mds.mdsd.e-aoki.com',	// AWS検証環境#1
			'172.23.35.28',		// AWS検証環境#2
			'172.23.35.29',		// AWS検証環境#3
			'172.23.35.12',		// AWS検証環境#4
			'172.30.214.97',	// 情シス環境#1
			'172.30.214.101',	// 情シス環境#2
			'172.30.214.107',	// 情シス環境#3
			'mdsystemst.aoki',	//
			'127.0.0.1',		// 個人開発環境
			'10.1.9.61',		// aoki-md.suri.co.jp
			'10.1.3.171', 		// aokmd.suri.co.jp
			'10.1.3.175',		// aokmd01.suri.co.jp
			'10.1.3.176',		// aokmd98.suri.co.jp
			'10.1.3.177'		// aokmd99.suri.co.jp
		],
		isTestHost: function(hostname){
			return _.find(this.testHosts, function(hostname){ return hostname == location.hostname;});
		},
		doApply: function(){
			var testCSS = '<link media="screen" rel="stylesheet" type="text/css" href="css/test.css">';
			$('head').append(testCSS);
		}
	};
	if(TestStyleCtrl.isTestHost(location.hostname)){
		TestStyleCtrl.doApply();
	}
	// ------------------------------------------------------------------------

	// TEST ------------------------------------------------
	boo = function(){
		// パスワード変更 Viw を表示する
		var dto = {
			approve_list: [],
			org_code: "0344",
			org_id: 1311,
			org_name: "春日井総本店",
			staff_code: "000000001",
			staff_id: 1,
			staff_name: "青木　太郎",
			status: 2,
			unit_code: "5",
			unit_id: 5,
			unit_name: "ＡＯＫＩカンパニー",
			user_code: "000002",
			user_id: 102,
			user_name: "管理者",
			user_name_kana: "ｶﾝﾘｼｬ",
			user_typeid: 1
		};
		mainView.savedUserData = dto;
		mainView.showPasswordView();
	};

});
