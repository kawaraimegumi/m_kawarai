/**
 * このファイルは自動生成されたものです。これを直接編集せずに build/src/js/clcom/*.js を編集してください。
 */

/**
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.3.1
 */
;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,e,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
function ch_width(){
	// 横スクロールが存在した場合もヘッダーは必ず右上に配置する様に修正 2014/04/02
	w = $(window).width();
	sl = $(window).scrollLeft();
	cs = w+sl;
	mw = $('#mainColumninBox').width();
	// ノーサインのサブ画面は左を計算しない
	lw = $(".cl_cu_submain").css('display') == 'block' ? 0 : $('#leftColumn').width();
//	cs = mw+lw;
	$('#header').css("width",cs+'px');
	// ノーサインのフッターは除く
	$('#mainColumnFooter').not(".cl_cu_mainColumnFooter").css("width",mw+'px');
	$('#mainColumnFooter p a').css("width",'100%');
	$('.conditionFooter').css("width",lw+'px');
}

function ch_height(first_flg){
	mh = $('#mainColumn').height();
	mbh = $('#mainColumninBox').height();
	leh = mh > mbh ? mh : mbh;
	leh = leh + 60;
	hh = $('#header').height();
	// Chrome対応、右ウィンドウをスクロールすると白くなってしまう対応
	wh = $(window).height() - hh;

	lh = $('#leftColumnInBox').height();

	$('body').css("height",wh+'px');

	// ノーサイン用
	$('#leftColumn').css("height",leh+'px');
	// 分析用 $(window).scrollTop()を追加
	// chromeで条件部分のフッターが隠れてしまう対応
	wh_an = wh + $(window).scrollTop();
	$('#leftColumn.analytics').css("height",wh_an+'px');

	$('#mainColumn').css("height",wh+'px');

	$('#container').css("height",wh+'px');
}

function setReSizeEvent(){
	$(window).resize(function(){
		ch_width();
	});
	$(document).scroll(function(){
		ch_width();
		sl = $(window).scrollLeft();
		// ノーサインのサブ画面は左を計算しない
		lw = $(".cl_cu_submain").css('display') == 'block' ? 0 : $('#leftColumn').width();
		// ノーサインのサブ画面フッターは除く
		$('#mainColumnFooter').not('.cl_cu_submainColumnFooter').css("left",lw-sl+'px');
		$('.conditionFooter').css("left",'-'+sl+'px');
	});
}

$(function(){
	sl = $(window).scrollLeft();
	ww = $(window).width();
	rbw = $(".rightBox").width()*1.25;
	hw = $("#header h1").width();
	if(0 < $("#header p").size()){
		pw = $("#header p").width();
		h_rightbox = ww-rbw-hw-pw;
		$('#header p').css("margin-left",sl+'px');
	}else{
		h_rightbox = ww-rbw-hw;
		$('#header h1').css("padding-left",sl+'px');
	}
	$('.rightBox').css("margin-left",h_rightbox+'px');

	/* header footer 固定 : tori@20131210 */
	//conditionFooterがある場合適用
	if(0 < $(".conditionFooter").size()){
		setReSizeEvent();
	}
	/* header footer 固定 end */

	//画面サイズを#containerの高さに
	ch_height(true);

	$(window).resize(function(){
		//ヘッダー位置
		ch_height();

		// ヘッダーがずれてしまうため一度0pxにする
		$('.rightBox').css("margin-left",'0px');

		sl = $(window).scrollLeft();
		ww = $(window).width();
		rbw = $(".rightBox").width()*1.25;
		hw = $("#header h1").width();
		if(0 < $("#header p").size()){
			pw = $("#header p").width();
			h_rightbox = ww-rbw-hw-pw;
			$('#header p').css("margin-left",sl+'px');
		}else{
			h_rightbox = ww-rbw-hw;
			$('#header h1').css("padding-left",sl+'px');
		}
		$('.rightBox').css("margin-left",h_rightbox+'px');
	});
	$(window).scroll(function(){
		ch_height();
		//ヘッダー位置
		sl = $(window).scrollLeft();
		ww = $(window).width();
		rbw = $(".rightBox").width()*1.25;
		hw = $("#header h1").width();
		if(0 < $("#header p").size()){
			pw = $("#header p").width();
			h_rightbox = ww-rbw-hw-pw;
		}else{
			h_rightbox = ww-rbw-hw;
		}
		mw = $('div#content').width();
		lw = $('#leftColumn').width();
		cs = mw+lw;
		wc = cs - ww + 40;//誤差修正
		if(wc < 0){
			wc = 0;
		}
		//ブラウザビヨーン対策
		if(wc < sl && sl > 0){
			h_rightbox = h_rightbox - sl + wc;
		}
		if(0 < $("#header p").size()){
			$('#header p').css("margin-left",sl+'px');
			$('.rightBox').css("margin-left",h_rightbox+'px');
		}else{
			$('#header h1').css("padding-left",sl+'px');
			$('.rightBox').css("margin-left",h_rightbox+'px');
		}

	});
	//inputにfocus時、疑似要素を削除
	$('.required input[type=text]').focusin(function(){
		$(this).parent('.fieldBox').removeClass('required');
	});
	$('.required input[type=text]').focusout(function(){
		$(this).parent('.fieldBox').addClass('required');
	});

	//セルの位置をハイライト 行、列、セル
	$(function(){
		var overcells = $("table.hilight td"),
			hoverClass = "hover",
			current_r,
			current_c;
		overcells.hover(
			function(){
				var $this = $(this);
				(current_r = $this.parent().children("table td")).addClass(hoverClass);
				(current_c = overcells.filter(":nth-child("+ (current_r.index($this)+1) +")")).addClass(hoverClass);
			},
			function(){
			current_r.removeClass(hoverClass);
			current_c.removeClass(hoverClass);
			}
		);
	});
	//セルの位置をハイライト 行のみ
	$(function(){
		var overcells = $("table.hilightRow td"),
			hoverClass = "hover",
			current_r,
			current_c;
		overcells.hover(
			function(){
				var $this = $(this);
				(current_r = $this.parent().children("table td")).addClass(hoverClass);
			},
			function(){
			current_r.removeClass(hoverClass);
			}
		);
	});

	//チェックされた行をハイライト
	$('table td .checkbox').click(function(){
		$(this).parent().parent().toggleClass('checked');
	});


	//ガイダンスの表示
	$('#guidanceBtn').click(function(){
		$('#guidanceBox').toggle();
	});

	/* tori@20131001 start */

	//レベル初期指定用
	 Lv = {
			lv_fixed : function (lv_cnt_fixed , next_id){
				lv_cnt = lv_cnt_fixed;
				var leftColumn_ul_width = lv_cnt*140;
				var leftColumn_ul_left = lv_cnt*140 - 140;

				//ul幅変更
				$('#leftColumn_ul').css("width",leftColumn_ul_width+'px');

				var prev_id = '#sideNavi'+next_id;
				for(i=lv_cnt_fixed;i>1;i--){
					if(i != 2 && i != lv_cnt_fixed){
						//この要素より前にこの要素をしている要素はないか検索
						prev_replace = prev_id.replace("#sideNavi", "");
						prev_id_find = $( prev_id ).prevAll().find('#'+prev_replace).parents(".sideNavi_ul").find('.prev_lv').attr("id");
						prev_id = "#sideNavi"+prev_id_find;

						$( prev_id ).toggleClass("dispn");
					}else if(i == lv_cnt_fixed){
						//取得したIDを用いて次の階層を表示する
						$( prev_id ).toggleClass("dispn");

						//この要素より前にこの要素をしている要素はないか検索
						prev_replace = prev_id.replace("#sideNavi", "");
						prev_id_find = $( prev_id ).prevAll().find('#'+prev_replace).parents(".sideNavi_ul").find('.prev_lv').attr("id");
						prev_id = "#sideNavi"+prev_id_find;

						$( prev_id ).toggleClass("dispn");
					}

				}
				//移動アニメーション（右方向）
				$('#leftColumn_ul').css({'left': '-='+leftColumn_ul_left},300);
			}
		};
	/* tori@20131001 end */


	var before_href = [];
	//sideNaviチェックボックス
	$('.sideNavi .group .checkbox').click(function(){
		//.groupのID取得
		var parent_id = $(this).parent('.group').attr('id');
		//check判定
		if(!$(this).hasClass('checked')){
			for(var i = 0; i < $("."+parent_id).length; i++){
				before_href[parent_id+i] = $("."+parent_id).eq(i).children("a").attr("href");
				$("."+parent_id).eq(i).children("a").attr("href","#");
				$("."+parent_id).eq(i).children("a").toggleClass("disable");
			}
		}else{
			for(var i = 0; i < $("."+parent_id).length; i++){
				$("."+parent_id).eq(i).children("a").attr("href",before_href[parent_id+i]);
				$("."+parent_id).eq(i).children("a").toggleClass("disable");
			}
		}
	});

});
/*
 * Purl (A JavaScript URL parser) v2.3.1
 * Developed and maintanined by Mark Perkins, mark@allmarkedup.com
 * Source repository: https://github.com/allmarkedup/jQuery-URL-Parser
 * Licensed under an MIT-style license. See https://github.com/allmarkedup/jQuery-URL-Parser/blob/master/LICENSE for details.
 */

;(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.purl = factory();
    }
})(function() {

    var tag2attr = {
            a       : 'href',
            img     : 'src',
            form    : 'action',
            base    : 'href',
            script  : 'src',
            iframe  : 'src',
            link    : 'href',
            embed   : 'src',
            object  : 'data'
        },

        key = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'], // keys available to query

        aliases = { 'anchor' : 'fragment' }, // aliases for backwards compatability

        parser = {
            strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
            loose :  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
        },

        isint = /^[0-9]+$/;

    function parseUri( url, strictMode ) {
        var str = decodeURI( url ),
        res   = parser[ strictMode || false ? 'strict' : 'loose' ].exec( str ),
        uri = { attr : {}, param : {}, seg : {} },
        i   = 14;

        while ( i-- ) {
            uri.attr[ key[i] ] = res[i] || '';
        }

        // build query and fragment parameters
        uri.param['query'] = parseString(uri.attr['query']);
        uri.param['fragment'] = parseString(uri.attr['fragment']);

        // split path and fragement into segments
        uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g,'').split('/');
        uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g,'').split('/');

        // compile a 'base' domain attribute
        uri.attr['base'] = uri.attr.host ? (uri.attr.protocol ?  uri.attr.protocol+'://'+uri.attr.host : uri.attr.host) + (uri.attr.port ? ':'+uri.attr.port : '') : '';

        return uri;
    }

    function getAttrName( elm ) {
        var tn = elm.tagName;
        if ( typeof tn !== 'undefined' ) return tag2attr[tn.toLowerCase()];
        return tn;
    }

    function promote(parent, key) {
        if (parent[key].length === 0) return parent[key] = {};
        var t = {};
        for (var i in parent[key]) t[i] = parent[key][i];
        parent[key] = t;
        return t;
    }

    function parse(parts, parent, key, val) {
        var part = parts.shift();
        if (!part) {
            if (isArray(parent[key])) {
                parent[key].push(val);
            } else if ('object' == typeof parent[key]) {
                parent[key] = val;
            } else if ('undefined' == typeof parent[key]) {
                parent[key] = val;
            } else {
                parent[key] = [parent[key], val];
            }
        } else {
            var obj = parent[key] = parent[key] || [];
            if (']' == part) {
                if (isArray(obj)) {
                    if ('' !== val) obj.push(val);
                } else if ('object' == typeof obj) {
                    obj[keys(obj).length] = val;
                } else {
                    obj = parent[key] = [parent[key], val];
                }
            } else if (~part.indexOf(']')) {
                part = part.substr(0, part.length - 1);
                if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
                parse(parts, obj, part, val);
                // key
            } else {
                if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
                parse(parts, obj, part, val);
            }
        }
    }

    function merge(parent, key, val) {
        if (~key.indexOf(']')) {
            var parts = key.split('[');
            parse(parts, parent, 'base', val);
        } else {
            if (!isint.test(key) && isArray(parent.base)) {
                var t = {};
                for (var k in parent.base) t[k] = parent.base[k];
                parent.base = t;
            }
            if (key !== '') {
                set(parent.base, key, val);
            }
        }
        return parent;
    }

    function parseString(str) {
        return reduce(String(str).split(/&|;/), function(ret, pair) {
            try {
                pair = decodeURIComponent(pair.replace(/\+/g, ' '));
            } catch(e) {
                // ignore
            }
            var eql = pair.indexOf('='),
                brace = lastBraceInKey(pair),
                key = pair.substr(0, brace || eql),
                val = pair.substr(brace || eql, pair.length);

            val = val.substr(val.indexOf('=') + 1, val.length);

            if (key === '') {
                key = pair;
                val = '';
            }

            return merge(ret, key, val);
        }, { base: {} }).base;
    }

    function set(obj, key, val) {
        var v = obj[key];
        if (typeof v === 'undefined') {
            obj[key] = val;
        } else if (isArray(v)) {
            v.push(val);
        } else {
            obj[key] = [v, val];
        }
    }

    function lastBraceInKey(str) {
        var len = str.length,
            brace,
            c;
        for (var i = 0; i < len; ++i) {
            c = str[i];
            if (']' == c) brace = false;
            if ('[' == c) brace = true;
            if ('=' == c && !brace) return i;
        }
    }

    function reduce(obj, accumulator){
        var i = 0,
            l = obj.length >> 0,
            curr = arguments[2];
        while (i < l) {
            if (i in obj) curr = accumulator.call(undefined, curr, obj[i], i, obj);
            ++i;
        }
        return curr;
    }

    function isArray(vArg) {
        return Object.prototype.toString.call(vArg) === "[object Array]";
    }

    function keys(obj) {
        var key_array = [];
        for ( var prop in obj ) {
            if ( obj.hasOwnProperty(prop) ) key_array.push(prop);
        }
        return key_array;
    }

    function purl( url, strictMode ) {
        if ( arguments.length === 1 && url === true ) {
            strictMode = true;
            url = undefined;
        }
        strictMode = strictMode || false;
        url = url || window.location.toString();

        return {

            data : parseUri(url, strictMode),

            // get various attributes from the URI
            attr : function( attr ) {
                attr = aliases[attr] || attr;
                return typeof attr !== 'undefined' ? this.data.attr[attr] : this.data.attr;
            },

            // return query string parameters
            param : function( param ) {
                return typeof param !== 'undefined' ? this.data.param.query[param] : this.data.param.query;
            },

            // return fragment parameters
            fparam : function( param ) {
                return typeof param !== 'undefined' ? this.data.param.fragment[param] : this.data.param.fragment;
            },

            // return path segments
            segment : function( seg ) {
                if ( typeof seg === 'undefined' ) {
                    return this.data.seg.path;
                } else {
                    seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; // negative segments count from the end
                    return this.data.seg.path[seg];
                }
            },

            // return fragment segments
            fsegment : function( seg ) {
                if ( typeof seg === 'undefined' ) {
                    return this.data.seg.fragment;
                } else {
                    seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; // negative segments count from the end
                    return this.data.seg.fragment[seg];
                }
            }

        };

    }

    purl.jQuery = function($){
        if ($ != null) {
            $.fn.url = function( strictMode ) {
                var url = '';
                if ( this.length ) {
                    url = $(this).attr( getAttrName(this[0]) ) || '';
                }
                return purl( url, strictMode );
            };

            $.url = purl;
        }
    };

    purl.jQuery(window.jQuery);

    return purl;

});
/**
 * Intro.js v0.7.0
 * https://github.com/usablica/intro.js
 * MIT licensed
 *
 * Copyright (C) 2013 usabli.ca - A weekend project by Afshin Mehrabani (@afshinmeh)
 */


(function (root, factory) {

  if (typeof exports === 'object') {
    // CommonJS
    factory(exports);
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports'], factory);
  } else {
    // Browser globals
    factory(root);
  }

} (this, function (exports) {
  //Default config/variables
  var VERSION = '0.7.0';

	// 2014/3/17@tori page判定
	var url = $.url();
	var urlfile = url.attr('file');
	var tab_flg = 0;
	var tab_start = 0;
	var tab_end = 100;
	var bodyheight = "700px";
	$(document).ready(function(){
		if(urlfile == "cisSGeneral02.html" || urlfile == "CUMEV0030.html"){
			//顧客詳細

			tab_flg = 1;
			tab_start = 0;
			tab_end = 100;
		    //顧客詳細
			$('#tab1').click(function() {
				tab_flg = 1;
				tab_start = 0;
				tab_end = 100;
			});
			$('#tab2').click(function() {
				tab_flg = 2;
				tab_start = 100;
				tab_end = 200;
			});
			$('#tab3').click(function() {
				tab_flg = 3;
				tab_start = 300;
				tab_end = 400;
			});
			$('#tab4').click(function() {
				tab_flg = 4;
				tab_start = 400;
				tab_end = 500;
			});
			$('#tab5').click(function() {
				tab_flg = 5;
				tab_start = 500;
				tab_end = 600;
			});
		}
		bodyheight = $(document).height();
	});



  /**
   * IntroJs main class
   *
   * @class IntroJs
   */
  function IntroJs(obj) {
    this._targetElement = obj;

    this._options = {
      /* Next button label in tooltip box */
      nextLabel: '次へ >',
      /* Previous button label in tooltip box */
      prevLabel: '< 前へ',
      /* Skip button label in tooltip box */
      skipLabel: 'Skip',
      /* Done button label in tooltip box */
      doneLabel: 'Done',
      /* Default tooltip box position */
      tooltipPosition: 'bottom',
      /* Next CSS class for tooltip boxes */
      tooltipClass: '',
      /* Close introduction when pressing Escape button? */
      exitOnEsc: true,
      /* Close introduction when clicking on overlay layer? */
      exitOnOverlayClick: true,
      /* Show step numbers in introduction? */
      showStepNumbers: false,
      /* Let user use keyboard to navigate the tour? */
      keyboardNavigation: true,
      /* Show tour control buttons? */
      showButtons: true,
      /* Show tour bullets? */
      showBullets: true,
      /* Scroll to highlighted element? */
      scrollToElement: true
    };
  }

  /**
   * Initiate a new introduction/guide from an element in the page
   *
   * @api private
   * @method _introForElement
   * @param {Object} targetElm
   * @returns {Boolean} Success or not?
   */
  function _introForElement(targetElm) {

    var introItems = [],
        self = this;

    if (this._options.steps) {
      //use steps passed programmatically
      var allIntroSteps = [];

      for (var i = 0, stepsLength = this._options.steps.length; i < stepsLength; i++) {
        var currentItem = _cloneObject(this._options.steps[i]);
        //set the step
        currentItem.step = introItems.length + 1;
        //use querySelector function only when developer used CSS selector
        if (typeof(currentItem.element) === 'string') {
          //grab the element with given selector from the page
          currentItem.element = document.querySelector(currentItem.element);
        }

        if (currentItem.element != null) {
          introItems.push(currentItem);
        }
      }

    } else {
       //use steps from data-* annotations
      var allIntroSteps = targetElm.querySelectorAll('*[data-intro]');
      //if there's no element to intro
      if (allIntroSteps.length < 1) {
        return false;
      }

      //first add intro items with data-step
      for (var i = 0, elmsLength = allIntroSteps.length; i < elmsLength; i++) {
        var currentElement = allIntroSteps[i];
        var step = parseInt(currentElement.getAttribute('data-step'), 10);
		//2014/3/17@tori display:noneの要素は外す
		if(currentElement.offsetHeight){
			if(tab_flg > 0){
		        if ((step >= tab_start && step < tab_end) || step >= 1000) {
		          introItems[step - 1] = {
		            element: currentElement,
		            intro: currentElement.getAttribute('data-intro'),
		            step: parseInt(currentElement.getAttribute('data-step'), 10),
		            tooltipClass: currentElement.getAttribute('data-tooltipClass'),
		            position: currentElement.getAttribute('data-position') || this._options.tooltipPosition
		          };
		        }

			}else{
		        if (step > 0) {
		          introItems[step - 1] = {
		            element: currentElement,
		            intro: currentElement.getAttribute('data-intro'),
		            step: parseInt(currentElement.getAttribute('data-step'), 10),
		            tooltipClass: currentElement.getAttribute('data-tooltipClass'),
		            position: currentElement.getAttribute('data-position') || this._options.tooltipPosition
		          };
		        }
			}
	    }
      }

      //next add intro items without data-step
      //todo: we need a cleanup here, two loops are redundant
      var nextStep = 0;
      for (var i = 0, elmsLength = allIntroSteps.length; i < elmsLength; i++) {
        var currentElement = allIntroSteps[i];
		//2014/3/17@tori display:noneの要素は外す
		if(currentElement.offsetHeight){
	        if (currentElement.getAttribute('data-step') == null) {

	          while (true) {
	            if (typeof introItems[nextStep] == 'undefined') {
	              break;
	            } else {
	              nextStep++;
	            }
	          }
	          introItems[nextStep] = {
	            element: currentElement,
	            intro: currentElement.getAttribute('data-intro'),
	            step: nextStep + 1,
	            tooltipClass: currentElement.getAttribute('data-tooltipClass'),
	            position: currentElement.getAttribute('data-position') || this._options.tooltipPosition
	          };
	        }
	     }
      }
    }

    //removing undefined/null elements
    var tempIntroItems = [];
    for (var z = 0; z < introItems.length; z++) {
      introItems[z] && tempIntroItems.push(introItems[z]);  // copy non-empty values to the end of the array
    }

    introItems = tempIntroItems;

    //Ok, sort all items with given steps
    introItems.sort(function (a, b) {
      return a.step - b.step;
    });

    //set it to the introJs object
    self._introItems = introItems;

    //add overlay layer to the page
    if(_addOverlayLayer.call(self, targetElm)) {
      //then, start the show
      _nextStep.call(self);

      var skipButton     = targetElm.querySelector('.introjs-skipbutton'),
          nextStepButton = targetElm.querySelector('.introjs-nextbutton');

      self._onKeyDown = function(e) {
        if (e.keyCode === 27 && self._options.exitOnEsc == true) {
          //escape key pressed, exit the intro
          _exitIntro.call(self, targetElm);
          //check if any callback is defined
          if (self._introExitCallback != undefined) {
            self._introExitCallback.call(self);
          }
        } else if(e.keyCode === 37) {
          //left arrow
          _previousStep.call(self);
        } else if (e.keyCode === 39 || e.keyCode === 13) {
          //right arrow or enter
          _nextStep.call(self);
          //prevent default behaviour on hitting Enter, to prevent steps being skipped in some browsers
          if(e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
      };

      self._onResize = function(e) {
        _setHelperLayerPosition.call(self, document.querySelector('.introjs-helperLayer'));
      };

      if (window.addEventListener) {
        if (this._options.keyboardNavigation) {
          window.addEventListener('keydown', self._onKeyDown, true);
        }
        //for window resize
        window.addEventListener("resize", self._onResize, true);
      } else if (document.attachEvent) { //IE
        if (this._options.keyboardNavigation) {
          document.attachEvent('onkeydown', self._onKeyDown);
        }
        //for window resize
        document.attachEvent("onresize", self._onResize);
      }
    }
    return false;
  }

 /*
   * makes a copy of the object
   * @api private
   * @method _cloneObject
  */
  function _cloneObject(object) {
      if (object == null || typeof (object) != 'object' || object.hasOwnProperty("nodeName") === true) {
          return object;
      }
      var temp = {};
      for (var key in object) {
          temp[key] = _cloneObject(object[key]);
      }
      return temp;
  }
  /**
   * Go to specific step of introduction
   *
   * @api private
   * @method _goToStep
   */
  function _goToStep(step) {
    //because steps starts with zero
    this._currentStep = step - 2;
    if (typeof (this._introItems) !== 'undefined') {
      _nextStep.call(this);
    }
  }

  /**
   * Go to next step on intro
   *
   * @api private
   * @method _nextStep
   */
  function _nextStep() {
    if (typeof (this._currentStep) === 'undefined') {
      this._currentStep = 0;
    } else {
      ++this._currentStep;
    }

    if ((this._introItems.length) <= this._currentStep) {
      //end of the intro
      //check if any callback is defined
      if (typeof (this._introCompleteCallback) === 'function') {
        this._introCompleteCallback.call(this);
      }
      _exitIntro.call(this, this._targetElement);
      return;
    }

    var nextStep = this._introItems[this._currentStep];
    if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
      this._introBeforeChangeCallback.call(this, nextStep.element);
    }

    _showElement.call(this, nextStep);
  }

  /**
   * Go to previous step on intro
   *
   * @api private
   * @method _nextStep
   */
  function _previousStep() {
    if (this._currentStep === 0) {
      return false;
    }

    var nextStep = this._introItems[--this._currentStep];
    if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
      this._introBeforeChangeCallback.call(this, nextStep.element);
    }

    _showElement.call(this, nextStep);
  }

  /**
   * Exit from intro
   *
   * @api private
   * @method _exitIntro
   * @param {Object} targetElement
   */
  function _exitIntro(targetElement) {
    //remove overlay layer from the page
    var overlayLayer = targetElement.querySelector('.introjs-overlay');
    //return if intro already completed or skipped
    if (overlayLayer == null) {
      return;
    }
    //for fade-out animation
    overlayLayer.style.opacity = 0;
    setTimeout(function () {
      if (overlayLayer.parentNode) {
        overlayLayer.parentNode.removeChild(overlayLayer);
      }
    }, 500);
    //remove all helper layers
    var helperLayer = targetElement.querySelector('.introjs-helperLayer');
    if (helperLayer) {
      helperLayer.parentNode.removeChild(helperLayer);
    }
    //remove `introjs-showElement` class from the element
    var showElement = document.querySelector('.introjs-showElement');
    if (showElement) {
      showElement.className = showElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, ''); // This is a manual trim.
    }

    //remove `introjs-fixParent` class from the elements
    var fixParents = document.querySelectorAll('.introjs-fixParent');
    if (fixParents && fixParents.length > 0) {
      for (var i = fixParents.length - 1; i >= 0; i--) {
        fixParents[i].className = fixParents[i].className.replace(/introjs-fixParent/g, '').replace(/^\s+|\s+$/g, '');
      };
    }
    //clean listeners
    if (window.removeEventListener) {
      window.removeEventListener('keydown', this._onKeyDown, true);
    } else if (document.detachEvent) { //IE
      document.detachEvent('onkeydown', this._onKeyDown);
    }
    //set the step to zero
    this._currentStep = undefined;
  }

  /**
   * Render tooltip box in the page
   *
   * @api private
   * @method _placeTooltip
   * @param {Object} targetElement
   * @param {Object} tooltipLayer
   * @param {Object} arrowLayer
   */
  function _placeTooltip(targetElement, tooltipLayer, arrowLayer , plus) {
    //reset the old style
    tooltipLayer.style.top     = null;
    tooltipLayer.style.right   = null;
    tooltipLayer.style.bottom  = null;
    tooltipLayer.style.left    = null;

    //prevent error when `this._currentStep` is undefined
    if (!this._introItems[this._currentStep]) return;

    var tooltipCssClass = '';

    //if we have a custom css class for each step
    var currentStepObj = this._introItems[this._currentStep];
    if (typeof (currentStepObj.tooltipClass) === 'string') {
      tooltipCssClass = currentStepObj.tooltipClass;
    } else {
      tooltipCssClass = this._options.tooltipClass;
    }

    tooltipLayer.className = ('introjs-tooltip ' + tooltipCssClass).replace(/^\s+|\s+$/g, '');

    //custom css class for tooltip boxes
    var tooltipCssClass = this._options.tooltipClass;

    var currentTooltipPosition = this._introItems[this._currentStep].position;
    switch (currentTooltipPosition) {
      case 'top':
        //tooltipLayer.style.left = '15px';
        tooltipLayer.style.top = '-' + (_getOffset(tooltipLayer).height + 10) + 'px';
        arrowLayer.className = 'introjs-arrow bottom';
        arrowLayer.style.top = "";
        break;
      case 'right':
        tooltipLayer.style.left = (_getOffset(targetElement).width + 20) + 'px';
        arrowLayer.className = 'introjs-arrow left';
        arrowLayer.style.top = "";
        break;
      case 'left':
        if (this._options.showStepNumbers == true) {
          tooltipLayer.style.top = '15px';
        }
        tooltipLayer.style.right = (_getOffset(targetElement).width + 20) + 'px';
        arrowLayer.className = 'introjs-arrow right';
        if(_getOffset(tooltipLayer).height > _getOffset(targetElement).height){
	        tooltipLayer.style.top = '-' + (_getOffset(tooltipLayer).height - _getOffset(targetElement).height - 10) + 'px';
	        arrowLayer.style.top = (_getOffset(tooltipLayer).height - 30) + 'px'
        }
        break;
      case 'bottom':
      // Bottom going to follow the default behavior
      default:
        tooltipLayer.style.bottom = '-' + (_getOffset(tooltipLayer).height + 10 + plus) + 'px';
        arrowLayer.className = 'introjs-arrow top';
        arrowLayer.style.top = "";
        break;
    }
  }

  /**
   * Update the position of the helper layer on the screen
   *
   * @api private
   * @method _setHelperLayerPosition
   * @param {Object} helperLayer
   */
  function _setHelperLayerPosition(helperLayer) {
    if (helperLayer) {
      //prevent error when `this._currentStep` in undefined
      if (!this._introItems[this._currentStep]) return;

      var elementPosition = _getOffset(this._introItems[this._currentStep].element);
      //set new position to helper layer
      helperLayer.setAttribute('style', 'width: ' + (elementPosition.width  + 10)  + 'px; ' +
                                        'height:' + (elementPosition.height + 10)  + 'px; ' +
                                        'top:'    + (elementPosition.top    - 5)   + 'px;' +
                                        'left: '  + (elementPosition.left   - 5)   + 'px;');
    }
  }

  /**
   * Show an element on the page
   *
   * @api private
   * @method _showElement
   * @param {Object} targetElement
   */
  function _showElement(targetElement) {

    if (typeof (this._introChangeCallback) !== 'undefined') {
        this._introChangeCallback.call(this, targetElement.element);
    }

    var self = this,
        oldHelperLayer = document.querySelector('.introjs-helperLayer'),
        elementPosition = _getOffset(targetElement.element);

    if (oldHelperLayer != null) {
      var oldHelperNumberLayer = oldHelperLayer.querySelector('.introjs-helperNumberLayer'),
          oldtooltipLayer      = oldHelperLayer.querySelector('.introjs-tooltiptext'),
          oldArrowLayer        = oldHelperLayer.querySelector('.introjs-arrow'),
          oldtooltipContainer  = oldHelperLayer.querySelector('.introjs-tooltip'),
//          skipTooltipButton    = oldHelperLayer.querySelector('.introjs-skipbutton'),
          prevTooltipButton    = oldHelperLayer.querySelector('.introjs-prevbutton'),
          nextTooltipButton    = oldHelperLayer.querySelector('.introjs-nextbutton');

      //hide the tooltip
      oldtooltipContainer.style.opacity = 0;

      //set new position to helper layer
      _setHelperLayerPosition.call(self, oldHelperLayer);

      //remove `introjs-fixParent` class from the elements
      var fixParents = document.querySelectorAll('.introjs-fixParent');
      if (fixParents && fixParents.length > 0) {
        for (var i = fixParents.length - 1; i >= 0; i--) {
          fixParents[i].className = fixParents[i].className.replace(/introjs-fixParent/g, '').replace(/^\s+|\s+$/g, '');
        };
      }

      //remove old classes
      var oldShowElement = document.querySelector('.introjs-showElement');
      oldShowElement.className = oldShowElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, '');
      //we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and `width` calculation
      if (self._lastShowElementTimer) {
        clearTimeout(self._lastShowElementTimer);
      }
      self._lastShowElementTimer = setTimeout(function() {
        //set current step to the label
        if (oldHelperNumberLayer != null) {
          oldHelperNumberLayer.innerHTML = targetElement.step;
        }
        //set current tooltip text
        oldtooltipLayer.innerHTML = targetElement.intro;
        //set the tooltip position
        _placeTooltip.call(self, targetElement.element, oldtooltipContainer, oldArrowLayer,0);

        //change active bullet
        oldHelperLayer.querySelector('.introjs-bullets li > a.active').className = '';
        oldHelperLayer.querySelector('.introjs-bullets li > a[data-stepnumber="' + targetElement.step + '"]').className = 'active';

        //show the tooltip
        oldtooltipContainer.style.opacity = 1;
      }, 350);

	  // 2014/3/17@tori
	  if($(targetElement.element).hasClass('scroll_flg')){
	      oldHelperLayer.className = 'introjs-helperLayer introjs-scrollflg';

		  window.onscroll = function(){
			// スクロールされたピクセル数
		    var scrollTop =
		        document.documentElement.scrollTop || // IE、Firefox、Opera
		        document.body.scrollTop;              // Chrome、Safari	  alert(scroll);
			    var beforetop = document.documentElement.clientHeight - 40;
		    var aftertop = beforetop+scrollTop;
//			var bodyheight = document.getElementById('container').scrollHeight;
			if(bodyheight < aftertop){
				aftertop = bodyheight;
			}

			$(".introjs-scrollflg").css("top",aftertop+"px");
		  }
		setTimeout(function(){
			// スクロールされたピクセル数
			var scrollTop =
			    document.documentElement.scrollTop || // IE、Firefox、Opera
			    document.body.scrollTop;              // Chrome、Safari	  alert(scroll);
			    var beforetop = document.documentElement.clientHeight - 40;
			var aftertop = beforetop+scrollTop;
			if($(".introjs-scrollflg").css("width")){
				if($(targetElement.element).hasClass('right_flg')){
					var width_px = parseInt($(".introjs-scrollflg").css("width").replace("px","")*0.90);
				}else{
					var width_px = parseInt($(".introjs-scrollflg").css("width").replace("px",""));
				}
				$(".introjs-scrollflg").css("width",width_px+"px");
			}
			$(".introjs-scrollflg").css("top",aftertop+"px");
		},300);
	  }else{
	      oldHelperLayer.className = 'introjs-helperLayer';
	  }

    } else {
      var helperLayer       = document.createElement('div'),
          arrowLayer        = document.createElement('div'),
          tooltipLayer      = document.createElement('div'),
          tooltipTextLayer  = document.createElement('div'),
          bulletsLayer      = document.createElement('div'),
          buttonsLayer      = document.createElement('div');

	  // 2014/3/17@tori
	  if($(targetElement.element).hasClass('scroll_flg')){
	      helperLayer.className = 'introjs-helperLayer introjs-scrollflg';

		  window.onscroll = function(){
			// スクロールされたピクセル数
		    var scrollTop =
		        document.documentElement.scrollTop || // IE、Firefox、Opera
		        document.body.scrollTop;              // Chrome、Safari	  alert(scroll);
			    var beforetop = document.documentElement.clientHeight - 40;
		    var aftertop = beforetop+scrollTop;
//			var bodyheight = document.getElementById('container').scrollHeight;
			if(bodyheight < aftertop){
				aftertop = bodyheight;
			}
			$(".introjs-scrollflg").css("top",aftertop+"px");
		  }
		// スクロールされたピクセル数
		var scrollTop =
		    document.documentElement.scrollTop || // IE、Firefox、Opera
		    document.body.scrollTop;              // Chrome、Safari	  alert(scroll);
		    var beforetop = document.documentElement.clientHeight - 40;
		var aftertop = beforetop+scrollTop;
		$(".introjs-scrollflg").css("top",aftertop+"px");

	  }else{
	      helperLayer.className = 'introjs-helperLayer';
	  }


      //set new position to helper layer
      _setHelperLayerPosition.call(self, helperLayer);

      //add helper layer to target element
      this._targetElement.appendChild(helperLayer);

      arrowLayer.className = 'introjs-arrow';

      tooltipTextLayer.className = 'introjs-tooltiptext';
      tooltipTextLayer.innerHTML = targetElement.intro;
      bulletsLayer.className = 'introjs-bullets';

      if (this._options.showBullets === false) {
        bulletsLayer.style.display = 'none';
      }

      var ulContainer = document.createElement('ul');

      for (var i = 0, stepsLength = this._introItems.length; i < stepsLength; i++) {
        var innerLi    = document.createElement('li');
        var anchorLink = document.createElement('a');

        anchorLink.onclick = function() {
          self.goToStep(this.getAttribute('data-stepnumber'));
        };

        if (i === 0) anchorLink.className = "active";

//        anchorLink.href = 'javascript:void(0);';
        anchorLink.innerHTML = "&nbsp;";
        anchorLink.setAttribute('data-stepnumber', this._introItems[i].step);

        innerLi.appendChild(anchorLink);
        ulContainer.appendChild(innerLi);
      }

      bulletsLayer.appendChild(ulContainer);

      buttonsLayer.className = 'introjs-tooltipbuttons';
      if (this._options.showButtons === false) {
        buttonsLayer.style.display = 'none';
      }

      tooltipLayer.className = 'introjs-tooltip';
      tooltipLayer.appendChild(tooltipTextLayer);

      //add helper layer number
      if (this._options.showStepNumbers == true) {
        var helperNumberLayer = document.createElement('span');
        helperNumberLayer.className = 'introjs-helperNumberLayer';
        helperNumberLayer.innerHTML = targetElement.step;
        helperLayer.appendChild(helperNumberLayer);
      }
      tooltipLayer.appendChild(arrowLayer);
      helperLayer.appendChild(tooltipLayer);


      //next button
      var nextTooltipButton = document.createElement('a');

      nextTooltipButton.onclick = function() {
        if (self._introItems.length - 1 != self._currentStep) {
          _nextStep.call(self);
        }
      };

//      nextTooltipButton.href = 'javascript:void(0);';
      nextTooltipButton.innerHTML = this._options.nextLabel;



      //previous button
      var prevTooltipButton = document.createElement('a');

      prevTooltipButton.onclick = function() {
        if (self._currentStep != 0) {
          _previousStep.call(self);
        }
      };

//      prevTooltipButton.href = 'javascript:void(0);';
      prevTooltipButton.innerHTML = this._options.prevLabel;

      //skip button
/*　2014/3/14 @tori
      var skipTooltipButton = document.createElement('a');
      skipTooltipButton.className = 'introjs-button introjs-skipbutton';
      skipTooltipButton.href = 'javascript:void(0);';
      skipTooltipButton.innerHTML = this._options.skipLabel;

      skipTooltipButton.onclick = function() {
        if (self._introItems.length - 1 == self._currentStep && typeof (self._introCompleteCallback) === 'function') {
          self._introCompleteCallback.call(self);
        }

        if (self._introItems.length - 1 != self._currentStep && typeof (self._introExitCallback) === 'function') {
          self._introExitCallback.call(self);
        }

        _exitIntro.call(self, self._targetElement);
      };
      buttonsLayer.appendChild(skipTooltipButton);
*/


      //in order to prevent displaying next/previous button always
      if (this._introItems.length > 1) {
        buttonsLayer.appendChild(prevTooltipButton);
		buttonsLayer.appendChild(bulletsLayer);

        buttonsLayer.appendChild(nextTooltipButton);
      }

      tooltipLayer.appendChild(buttonsLayer);

      //set proper position
      _placeTooltip.call(self, targetElement.element, tooltipLayer, arrowLayer , 10);
    }
   targetElement.element.onclick = function() {
        if (self._introItems.length - 1 == self._currentStep && typeof (self._introCompleteCallback) === 'function') {
          self._introCompleteCallback.call(self);
        }

        if (self._introItems.length - 1 != self._currentStep && typeof (self._introExitCallback) === 'function') {
          self._introExitCallback.call(self);
        }

        _exitIntro.call(self, self._targetElement);
    };
    if (this._currentStep == 0 && this._introItems.length > 1) {
      prevTooltipButton.className = 'introjs-button introjs-prevbutton introjs-disabled';
      nextTooltipButton.className = 'introjs-button introjs-nextbutton';

      nextTooltipButton.onclick = function() {
        if (self._introItems.length - 1 != self._currentStep) {
          _nextStep.call(self);
        }
      };

//      skipTooltipButton.innerHTML = this._options.skipLabel;
    } else if (this._introItems.length - 1 == this._currentStep || this._introItems.length == 1) {
//      skipTooltipButton.innerHTML = this._options.doneLabel;
      prevTooltipButton.className = 'introjs-button introjs-prevbutton';
      nextTooltipButton.className = 'introjs-button introjs-nextbutton introjs-exit';
	  nextTooltipButton.innerHTML = "終了";
/*
	  $(".introjs-exit").on("click", function(e){
	        if (self._introItems.length - 1 == self._currentStep && typeof (self._introCompleteCallback) === 'function') {
	          self._introCompleteCallback.call(self);
	        }

	        if (self._introItems.length - 1 != self._currentStep && typeof (self._introExitCallback) === 'function') {
	          self._introExitCallback.call(self);
	        }
//	        _exitIntro.call(self, self._targetElement);
	});
*/
      nextTooltipButton.onclick = function() {
        if (self._introItems.length - 1 == self._currentStep && typeof (self._introCompleteCallback) === 'function') {
          self._introCompleteCallback.call(self);
        }

        if (self._introItems.length - 1 != self._currentStep && typeof (self._introExitCallback) === 'function') {
          self._introExitCallback.call(self);
        }

        _exitIntro.call(self, self._targetElement);
      };
    } else {
      prevTooltipButton.className = 'introjs-button introjs-prevbutton';
      nextTooltipButton.className = 'introjs-button introjs-nextbutton';
	  nextTooltipButton.innerHTML = this._options.nextLabel;
//	  $(nextTooltipButton).off("click");

      nextTooltipButton.onclick = function() {
        if (self._introItems.length - 1 != self._currentStep) {
          _nextStep.call(self);
        }
      };
      //      skipTooltipButton.innerHTML = this._options.skipLabel;
    }

	if($(targetElement.element).hasClass('scroll_flg')){
		$(".introjs-helperLayer").css("background-color", "rgba(255,255,255,.5)");
	}else{
		$(".introjs-helperLayer").css("background-color", "rgba(255,255,255,.9)");
	}

//Set focus on "next" button, so that hitting Enter always moves you onto the next step
//    nextTooltipButton.focus();

    //add target element position style
    targetElement.element.className += ' introjs-showElement';

    var currentElementPosition = _getPropValue(targetElement.element, 'position');
    if (currentElementPosition !== 'absolute' &&
        currentElementPosition !== 'relative') {
      //change to new intro item
      targetElement.element.className += ' introjs-relativePosition';
    }

    var parentElm = targetElement.element.parentNode;
    while (parentElm != null) {
      if (parentElm.tagName.toLowerCase() === 'body') break;

      //fix The Stacking Contenxt problem.
      //More detail: https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context
      var zIndex = _getPropValue(parentElm, 'z-index');
      var opacity = parseFloat(_getPropValue(parentElm, 'opacity'));
      if (/[0-9]+/.test(zIndex) || opacity < 1) {
        parentElm.className += ' introjs-fixParent';
      }

      parentElm = parentElm.parentNode;
    }

    if (!_elementInViewport(targetElement.element) && this._options.scrollToElement === true) {
      var rect = targetElement.element.getBoundingClientRect(),
        winHeight=_getWinSize().height,
        top = rect.bottom - (rect.bottom - rect.top),
        bottom = rect.bottom - winHeight;

      //Scroll up
      if (top < 0 || targetElement.element.clientHeight > winHeight) {
        window.scrollBy(0, top - 30); // 30px padding from edge to look nice

      //Scroll down
      } else {
        window.scrollBy(0, bottom + 100); // 70px + 30px padding from edge to look nice
      }
    }

    if (typeof (this._introAfterChangeCallback) !== 'undefined') {
        this._introAfterChangeCallback.call(this, targetElement.element);
    }
  }

  /**
   * Get an element CSS property on the page
   * Thanks to JavaScript Kit: http://www.javascriptkit.com/dhtmltutors/dhtmlcascade4.shtml
   *
   * @api private
   * @method _getPropValue
   * @param {Object} element
   * @param {String} propName
   * @returns Element's property value
   */
  function _getPropValue (element, propName) {
    var propValue = '';
    if (element.currentStyle) { //IE
      propValue = element.currentStyle[propName];
    } else if (document.defaultView && document.defaultView.getComputedStyle) { //Others
      propValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propName);
    }

    //Prevent exception in IE
    if (propValue && propValue.toLowerCase) {
      return propValue.toLowerCase();
    } else {
      return propValue;
    }
  }

  /**
   * Provides a cross-browser way to get the screen dimensions
   * via: http://stackoverflow.com/questions/5864467/internet-explorer-innerheight
   *
   * @api private
   * @method _getWinSize
   * @returns {Object} width and height attributes
   */
  function _getWinSize() {
    if (window.innerWidth != undefined) {
      return { width: window.innerWidth, height: window.innerHeight };
    } else {
      var D = document.documentElement;
      return { width: D.clientWidth, height: D.clientHeight };
    }
  }

  /**
   * Add overlay layer to the page
   * http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
   *
   * @api private
   * @method _elementInViewport
   * @param {Object} el
   */
  function _elementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      (rect.bottom+80) <= window.innerHeight && // add 80 to get the text right
      rect.right <= window.innerWidth
    );
  }

  /**
   * Add overlay layer to the page
   *
   * @api private
   * @method _addOverlayLayer
   * @param {Object} targetElm
   */
  function _addOverlayLayer(targetElm) {
    var overlayLayer = document.createElement('div'),
        styleText = '',
        self = this;

    //set css class name
    overlayLayer.className = 'introjs-overlay';

    //check if the target element is body, we should calculate the size of overlay layer in a better way
    if (targetElm.tagName.toLowerCase() === 'body') {
      styleText += 'top: 0;bottom: 0; left: 0;right: 0;position: fixed;';
      overlayLayer.setAttribute('style', styleText);
    } else {
      //set overlay layer position
      var elementPosition = _getOffset(targetElm);
      if (elementPosition) {
        styleText += 'width: ' + elementPosition.width + 'px; height:' + elementPosition.height + 'px; top:' + elementPosition.top + 'px;left: ' + elementPosition.left + 'px;';
        overlayLayer.setAttribute('style', styleText);
      }
    }

    targetElm.appendChild(overlayLayer);

    overlayLayer.onclick = function() {
      if (self._options.exitOnOverlayClick == true) {
        _exitIntro.call(self, targetElm);

        //check if any callback is defined
        if (self._introExitCallback != undefined) {
          self._introExitCallback.call(self);
        }
      }
    };

    setTimeout(function() {
      styleText += 'opacity: .8;';
      overlayLayer.setAttribute('style', styleText);
    }, 10);
    return true;
  }

  /**
   * Get an element position on the page
   * Thanks to `meouw`: http://stackoverflow.com/a/442474/375966
   *
   * @api private
   * @method _getOffset
   * @param {Object} element
   * @returns Element's position info
   */
  function _getOffset(element) {
    var elementPosition = {};

    //set width
    elementPosition.width = element.offsetWidth;

    //set height
    elementPosition.height = element.offsetHeight;

    //calculate element top and left
    var _x = 0;
    var _y = 0;
    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
      _x += element.offsetLeft;
      _y += element.offsetTop;
      element = element.offsetParent;
    }
    //set top
    elementPosition.top = _y;
    //set left
    elementPosition.left = _x;

    return elementPosition;
  }

  /**
   * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
   * via: http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
   *
   * @param obj1
   * @param obj2
   * @returns obj3 a new object based on obj1 and obj2
   */
  function _mergeOptions(obj1,obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
  }

  var introJs = function (targetElm) {
    if (typeof (targetElm) === 'object') {
      //Ok, create a new instance
      return new IntroJs(targetElm);

    } else if (typeof (targetElm) === 'string') {
      //select the target element with query selector
      var targetElement = document.querySelector(targetElm);

      if (targetElement) {
        return new IntroJs(targetElement);
      } else {
        throw new Error('There is no element with given selector.');
      }
    } else {
      return new IntroJs(document.body);
    }
  };

  /**
   * Current IntroJs version
   *
   * @property version
   * @type String
   */
  introJs.version = VERSION;

  //Prototype
  introJs.fn = IntroJs.prototype = {
    clone: function () {
      return new IntroJs(this);
    },
    setOption: function(option, value) {
      this._options[option] = value;
      return this;
    },
    setOptions: function(options) {
      this._options = _mergeOptions(this._options, options);
      return this;
    },
    start: function () {
      _introForElement.call(this, this._targetElement);
      return this;
    },
    goToStep: function(step) {
      _goToStep.call(this, step);
      return this;
    },
    nextStep: function() {
      _nextStep.call(this);
      return this;
    },
    previousStep: function() {
      _previousStep.call(this);
      return this;
    },
    exit: function() {
      _exitIntro.call(this, this._targetElement);
    },
    refresh: function() {
      _setHelperLayerPosition.call(this, document.querySelector('.introjs-helperLayer'));
      return this;
    },
    onbeforechange: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introBeforeChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onbeforechange was not a function');
      }
      return this;
    },
    onchange: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onchange was not a function.');
      }
      return this;
    },
    onafterchange: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introAfterChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onafterchange was not a function');
      }
      return this;
    },
    oncomplete: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introCompleteCallback = providedCallback;
      } else {
        throw new Error('Provided callback for oncomplete was not a function.');
      }
      return this;
    },
    onexit: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introExitCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onexit was not a function.');
      }
      return this;
    }
  };

  exports.introJs = introJs;
  return introJs;
}));
jQuery(function($){
	//ガイド表示
	$('body').on('click', '#demo_introjs', function(){
		introJs().start();
	  });
});

// -----------------------------------------------------------------------
//var gs_proto_defs = {
//	GS_PROTO_COMMON_RSP_STATUS_OK : 0,
//	GS_PROTO_COMMON_RSP_STATUS_NG : 1,
//	GS_PROTO_COMMON_RTYPE_NEW : 1,
//	GS_PROTO_COMMON_RTYPE_UPD : 2,
//	GS_PROTO_COMMON_RTYPE_DEL : 3,
//	GS_PROTO_COMMON_RTYPE_REL : 4,
//	GS_PROTO_COMMON_RTYPE_CSV : 5,
//	GS_PROTO_COMMON_RTYPE_DELCANCEL : 9,
//	GS_PROTO_ACTYPE_TEXT : 10,
//	GS_PROTO_ACTYPE_NUMRANGE : 20,
//	GS_PROTO_ACTYPE_NUMRANGE100 : 21,
//	GS_PROTO_ACTYPE_YMDRANGE : 30,
//	GS_PROTO_ACTYPE_BIRTH_MONTH : 35,
//	GS_PROTO_ACTYPE_ONOFF : 40,
//	GS_PROTO_ACTYPE_TYPE : 50,
//	GS_PROTO_ACTYPE_CDNAME : 51,
//	GS_PROTO_ACTYPE_STAFFCDNAME : 52,
//	GS_PROTO_ACTYPE_ORG : 60,
//	GS_PROTO_CELL_TYPE_NUMBER : 10,
//	GS_PROTO_CELL_TYPE_REAL : 11,
//	GS_PROTO_CELL_TYPE_RATIO : 12,
//	GS_PROTO_CELL_TYPE_YMD : 20,
//	GS_PROTO_CELL_TYPE_STRING : 30,
//	GS_PROTO_MEMBITEM_TYPE_TEXT : 1,
//	GS_PROTO_MEMBITEM_TYPE_NUMBER : 2,
//	GS_PROTO_MEMBITEM_TYPE_YMD : 3,
//	GS_PROTO_MEMBITEM_TYPE_IYMD : 4,
//	GS_PROTO_MEMBITEM_TYPE_REAL : 5,
//	GS_PROTO_MEMBITEM_TYPE_ORGNAME : 6,
//	GS_PROTO_MEMBITEM_TYPE_TYPE : 7
//};
//var gs_proto_sort_req = {

//	GS_PROTO_SORT_ORDER_ASCENDING : 1,
//	GS_PROTO_SORT_ORDER_DESCENDING : -1
//};
//var gsan_se_staff_srch_if = {
//	GSAN_PROTO_SORT_KEY_CODE : 1,
//	GSAN_PROTO_SORT_KEY_NAME : 2
//};
//var gscu_cust_receipt_srch_if = {
//	GSCU_RCPT_TYPE_SALE : 1,
//	GSCU_RCPT_TYPE_CANCEL : 2,
//	GSCU_RCPT_TYPE_RETURN : 3,
//	GSCU_RCPT_TYPE_RETCAN : 4,
//	GSCU_RCPT_TYPE_HSALE : 5,
//	GSCU_RCPT_TYPE_HCANCEL : 6,
//	GSCU_RCPT_TYPE_HRETURN : 7,
//	GSCU_RCPT_TYPE_HRETCAN : 8,
//	GSCU_RCPT_TYPE_OTHER : 9
//};
//var gscu_do_regularcust_if = {
//	GSCU_DO_REGULARCUST_REPORTTYPE_STORE : 1,
//	GSCU_DO_REGULARCUST_REPORTTYPE_JOBPOST : 2,
//	GSCU_DO_REGULARCUST_REPORTTYPE_STORE_SINGLE : 3
//};
//-----------------------------------------------------------------------
/**
 * ORIGINAL tooltip.js
 */

!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (this.options.trigger != 'manual') {
        eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

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
        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .offset(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)
      self[self.tip().hasClass('in') ? 'hide' : 'show']()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

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
  }

}(window.jQuery);
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
(function ($) {
  function getRange(el) {
    var start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange, $el;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
      start = el.selectionStart;
      end = el.selectionEnd;
    } else if (document.selection) {
      $el = $(el);
      if ($el.is(':visible:not(:disabled)')) {

        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
          len = el.value.length;
          normalizedValue = el.value.replace(/\r\n/g, "\n");

          // Create a working TextRange that lives only in the input
          textInputRange = el.createTextRange();
          textInputRange.moveToBookmark(range.getBookmark());

          // Check if the start and end of the selection are at the very end
          // of the input, since moveStart/moveEnd doesn't return what we want
          // in those cases
          endRange = el.createTextRange();
          endRange.collapse(false);

          if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
            start = end = len;
          } else {
            start = -textInputRange.moveStart("character", -len);
            start += normalizedValue.slice(0, start).split("\n").length - 1;

            if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
              end = len;
            } else {
              end = -textInputRange.moveEnd("character", -len);
              end += normalizedValue.slice(0, end).split("\n").length - 1;
            }
          }
        }
      }
    }

    return {
      start: start,
      end: end
    };
  }

  function getCursorPosition(input) {
    if (!input) return; // No (input) element found
    if ('selectionStart' in input) {
      // Standard-compliant browsers
      return input.selectionStart;
    } else if (document.selection) {
      // IE
      var $input = $(input);
      if ($input.is(':visible:not(:disabled)')) {
        input.focus();
        var sel = document.selection.createRange();
        var selLen = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return sel.text.length - selLen;
      } else {
        return $input.val().length;
      }
    }
    return 0;
  }

  function setRange($input, start, end) {
    var input = $input.get(0);
    if (input.setSelectionRange) {
      if ($input.is(':visible:not(:disabled)')) {
        input.focus();
        input.setSelectionRange(start, end);
      }
    } else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', end);
      range.moveStart('character', start);
      range.select();
    }
  }

  function setCursorPosition($input, pos) {
    setRange($input, pos, pos);
  }


  var compiledLimiters = {},
      compiledFilters = {};

  var Limiters = (function () {
    var i,

        regexLimiter = function (reg) {
          if (!reg instanceof RegExp)
            reg = new RegExp(reg);
          return function (value) {
            return (value.match(reg) || [])[0] || "";
          };
        },

        len = function (length) {
          return function (value) {
            return value.substring(0, parseInt(length, 10));
          };
        },

        time = function () {
          var regs = [
            regexLimiter(/[0-1](?:[0-9](?:[0-5][0-9]?)?)?/),
            regexLimiter(/2(?:[0-9](?:[0-5][0-9]?)?)?/),
            regexLimiter(/3(?:[0-5](?:[0-5][0-9]?)?)?/),
            regexLimiter(/3(6(0(0?)?)?)?/),
            regexLimiter(/[0-9](?:[0-5][0-9]?)?/)
          ];

          return function (value) {
            return _.reduce(_.map(regs, function (reg) {return reg(value)}), function (memo, v) {
              if (memo.length > v.length)
                return memo;
              else
                return v;
            }, '');
          };
        },

        alpha = function () {
          return regexLimiter(/[A-Za-z]+/);
        },

        alnum = function () {
          return regexLimiter(/[A-Za-z0-9]+/);
        },

        reg = function (r) {
          var compiled = r;
          if (!r instanceof RegExp)
            compiled = new RegExp(reg);
          return function (value) {
            var match = value.match(reg);
            return match ? match[0] : '';
          };
        },

        code = function (len) {
          var reg = /([0-9]+)/;
          return function (value) {
            var match = value.match(reg);
            if (!match)
              return '';
            return match[1].substring(0, len || undefined);
          };
        },

        code2 = function (len) {
          var reg = /([-0-9]+)/;
          return function (value) {
            var match = value.match(reg);
            if (!match)
              return '';
            return match[1].substring(0, len || undefined);
          };
        },

        // :5
        integer2 = function (len) {
          var reg = /(0|[1-9][0-9]*)/;
          return function (value) {
            var match = value.match(reg);
            if (!match)
              return '';
            return match[1].substring(0, len || undefined);
          };
        },

        // integer:5
        integer = function (len) {
          var reg = /(-?)(0|[1-9][0-9]*)?/;
          return function (value) {
            var match = value.match(reg);
            if (!match)
              return '';
            return match[1] + (match[2]||'').substring(0, len || undefined);
          };
        },

        // number:10,3
        number = function (len1, len2, allowNegative) {
          var reg = /([-]?)(?:(0|[1-9][0-9]*))?(?:(\.)([0-9]*))?/;
          len1 = parseInt(len1, 10);
          len2 = parseInt(len2, 10);
          allowNegative = allowNegative === '-';
          return function (value) {
            var match = value.match(reg);
            if (!match)
              return '';
            return (allowNegative ? (match[1] || '') : '') +
              (match[2] || '').substring(0, len1 || undefined) +
              (match[3] || '') +
              (match[4] || '').substring(0, len2 || undefined);
          };
        },

        yyyymm = function () {
          return function (value) {
            if (/[0-9/]{0,7}/.test(value))
              return value;
            return '';
          };
        },

        ym = function (len) {
          return function (value) {
            if (!value) return '';
            if (!/^[0-9/]+$/.test(value)) return '';
            return value.substring(0, len);
          };
        },

        truncateByCharMap = function (charMap) {
          return function (value) {
            var length, valueLength = value.length;
            for (length = 0; length < valueLength; length++) {
              if (!charMap(value.charCodeAt(length)))
                break;
            }
            return value.substring(0, length);
          };
        },

        isHalf = function (c) {
          return (c >= 0x0 && c < 0x81) || (c == 0xf8f0) ||
            (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
        },

        hankaku = function () {
          return truncateByCharMap(isHalf);
        },

        zenkaku = function () {
          return truncateByCharMap(function (c) { return !isHalf(c);});
        };

    return {
      'regex': regexLimiter,
      len: len,
      'int': integer,
      'int2': integer2,
      time: time,
      code2: code2,
      alpha: alpha,
      alnum: alnum,
      // digit: digit,
      digit: code,
      number: number,
      hankaku: hankaku,
      zenkaku: zenkaku,
      yyyymm: yyyymm,
      ym: ym
    };
  }());

  var Filters = (function () {
    var i,

        fixed = function (num) {
          var f = function (value) {
            var n = Number(value);
            if (isFinite(n)) {
              var d = Math.pow(10, num);
              n = Math.round(n * d) / d;
              return n.toFixed(num);
            } else {
              return value;
            }
          };
          return {
            set: f
          };
        },

        /**
         * @param {Number} digits 0から20までの整数
         */
        floor = function (digits) {
          var f = function (value) {
            var x = value.split('.'),
                dpart = (x[0] || '0'),
                ipart = ((x[1] || '') + '00000000000000000000').substring(0, digits);
            return digits > 0 ? dpart + '.' + ipart : dpart;
          };
          return {
            set: f
          };
        },

        comma = function () {
          var format = /([\d]+?)(?=(?:\d{3})+$)/g;

          return {
            mask: function (value) {
              var xs = value.split('.');
              value = xs[0].replace(format, function(t){
                return t + ',';
              });
              xs[0] = value;
              return xs.join('.');
            },

            unmask: function (value) {
              return value.split(',').join('');
            }
          };
        },

        time = function () {
          var format = /(\d+?)(?=(?:\d{2})+$)/g;

          return {
            mask: function (value) {
              return value.replace(format, function (t) {return t + ':'});
            },

            unmask: function (value) {
              return value.split(':').join('');
            }
          };
        };

    return {
      comma: comma,
      time: time,
      fixed: fixed,
      floor: floor
    };

  }());

  var compiledConverter = {},

      buildConverter = function (limiters) {
        var i,

            filter = function (method, value) {
              if (!limiters.filters)
                return value;
              value = _.reduce(limiters.filters, function (memo, filter) {
                var args = filter.args.slice();
                args.unshift(memo);
                if (filter.filter[method])
                  memo = filter.filter[method].apply(null, args);
                return memo;
              }, value);
              return value;
            },

            limitValue = function (value) {
              if (!limiters.limiters)
                return value;
              value = _.reduce(limiters.limiters, function (memo, limiter) {
                var args = limiter.args.slice();
                args.unshift(memo);
                return limiter.limiter.apply(null, args);
              }, value);
              return value;
            },

            filterValue = function (value) {
              value = _.compose(
                _.bind(filter, null, 'mask'),
                limitValue,
                _.bind(filter, null, 'set'),
                _.bind(filter, null, 'unmask')
              )(value);
              return value;
            },

            value = function (value) {
              value = _.compose(
                _.bind(filter, null, 'unmask'),
                filterValue
              )(value);
              return value;
            };

        return {
          filter: filter,
          limitValue: limitValue,
          filterValue: filterValue,
          value: value
        };

      },

      splitter = /\s+/,

      buildLimiter = function (dataLimit, dataFilter) {
        var limiters,
            filters;

        if (dataLimit) {
          limiters = compiledLimiters[dataLimit];
          if (!limiters) {
            limiters = _.map(dataLimit.split(splitter), function (s) {
              var args = s.split(':'),
                  limiter = args.shift();
              args = (args[0] || "").split(',');
              if (!Limiters[limiter]) {
                throw new Error('Invalid limiter:' + limiter);
              }

              return {
                limiter: Limiters[limiter].apply(this, args),
                args: args
              };
            });
            compiledLimiters[dataLimit] = limiters;
          }
        }

        if (dataFilter) {
          filters = compiledFilters[dataFilter];
          if (!filters) {
            filters = _.map(dataFilter.split(splitter), function (s) {
              var args = s.split(':'),
                  filter = args.shift();
              args = (args[0] || '').split(',');
              if (!Filters[filter]) {
                throw new Error('Invalid Filter:' + filter);
              }

              return {
                filter: Filters[filter].apply(this, args),
                args: args
              };
            });
            compiledFilters[dataFilter] = filters;
          }
        }

        return {
          limiters: limiters,
          filters: filters
        };
      },

      getConverter = function (limitExpr, filterExpr) {
        if (!compiledConverter[limitExpr]) {
          compiledConverter[limitExpr] = {};
        }
        var converter = compiledConverter[limitExpr][filterExpr];

        if (!converter) {
          converter = buildConverter(buildLimiter(limitExpr, filterExpr));
          compiledConverter[limitExpr][filterExpr] = converter;
        }

        return converter;
      },

      getConverterByElement = function ($input) {
        return getConverter(
          $input.attr('data-limit') || '',
          $input.attr('data-filter') || ''
        );
      },

      createHandler = function (_converter) {
        var focused = false,

            splice = function (s, index, howMany/*[,s1][, ..., sN]*/) {
              var args = Array.prototype.slice.call(arguments, 1),
                  array = s.split('');
              Array.prototype.splice.apply(array, args);
              return array.join('');
            },

            onKeyup = function (e) {
              var isEnter = e.which === 13;
              if (!isEnter) {
                return;
              }

              var input = e.currentTarget,
                  $input = $(input);

              if (!$input.is('input,textarea'))
                return;

              // IMEでENTERキーで確定時の処理
              var converter = _converter || getConverterByElement($input),
                  pos,
                  curVal = converter.filter('unmask', $(e.currentTarget).val()),
                  newVal = converter.limitValue(curVal),
                  modifierKeyPressed = e.ctrlKey || e.altKey || e.metaKey;

              if (curVal !== newVal) {
                pos = getCursorPosition(e.currentTarget);
                $input.val(newVal);
                setCursorPosition($input, pos);
              }
            },

            onKeypress = function (e) {
              // // カーソルキー XXXX
              // if (e.which >= 33 && e.which <= 40) {
              //   return;
              // }

              var modifierKeyPressed = e.ctrlKey || e.altKey || e.metaKey;

              var input = e.currentTarget,
                  $input = $(input);

              if (!$input.is('input,textarea'))
                return;

              if (!modifierKeyPressed && (e.which >= 32 && e.which <= 122)) {
                var selection = getRange(input),
                    converter = _converter || getConverterByElement($input),
                    ch = String.fromCharCode(e.which),
                    prevVal = $(e.currentTarget).val(),
                    curVal = converter.filter('unmask', splice(prevVal, selection.start, selection.end - selection.start, ch)),
                    newVal = converter.limitValue(curVal);

                // console.log('###(press)', 'type:', e.type, 'prv:', prevVal, 'new:', newVal,
                //             'code:', e.which, 'ch:', ch, 'pos:', pos, 'p:', curVal);

                if (curVal !== newVal) {
                  return false;
                }
              }
            },

            onceMouseUp = function (e) {
              var $input = $(e.currentTarget);
              if ($input.is(':focusable')) {
                $input.select();
                e.preventDefault();
              }
            },

            onMouseUp = function (e) {
              if (focused) {
                $(e.currentTarget).select();
                e.preventDefault();
                focused = false;
              }
            },

            onFocus = function (e) {
              var input = e.currentTarget,
                  $input = $(input);

              if (!$input.is('input,textarea'))
                return;

//                $input.trigger('focus.placeholder');

              var converter = _converter || getConverterByElement($input),
                  value = $input.val();
              value = converter.filter('unmask', value);
              $input.val(value).select();
              focused = true;
              $input.select();
            },

            onBlur = function (e) {
              var input = e.currentTarget,
                  $input = $(input);

              if (!$input.is('input,textarea'))
                return;

//              $input.trigger('blur.placeholder');

              var converter = _converter || getConverterByElement($input),
                  value = $input.val();
              value = converter.filterValue(value);
              $input.val(value);
            };


        return {
          onBlur: onBlur,
          onFocus: onFocus,
          onKeypress: onKeypress,
          onKeyup: onKeyup,
          onMouseUp: onMouseUp
        };
      },

      start = function () {
        var handler = createHandler(),
            selector = '[data-limit]:not(.bindInputlimiter),[data-filter]:not(.bindInputlimiter)';

        $(document).off('.inputlimiter')
          .on('keypress.inputlimiter', selector, handler.onKeypress)
          .on('keyup.inputlimiter', selector, handler.onKeyup)
          .on('focusin.inputlimiter', selector, handler.onFocus)
          .on('mouseup.inputlimiter', selector, handler.onMouseUp)
          .on('focusout.inputlimiter', selector, handler.onBlur);
        this._started = true;
      },

      stop = function () {
        $(document).off('.inputlimiter');
        this._started = false;
      },

      bindElement = function ($el, converter) {
        if (!$el.is('input,textarea')) {
          return;
        }

        var handler = createHandler(converter);
        $el.unbind('.inputlimiter')
          .bind('keypress.inputlimiter', handler.onKeypress)
          .bind('keyup.inputlimiter', handler.onKeyup)
          .bind('mouseup.inputlimiter', handler.onMouseUp)
          .bind('focusin.inputlimiter', handler.onFocus)
          .bind('focusout.inputlimiter', handler.onBlur)
          .addClass('bindInputlimiter');
      };

  $.fn.inputlimiter = function (method, options) {
    if (typeof method === 'object') {
      method = undefined;
      options = method;
    }

    if (typeof method === 'undefined') {
      method = 'new';
    }

    var opts = $.extend({}, $.fn.inputlimiter.defaults, options),

        $elements = $(this);

    function val($element, value) {
      if (arguments.length === 1) {
        if ($element.is('input,textarea')) {
          return $element.val();
        } else {
          return $element.text();
        }
      } else {
        if ($element.is('input,textarea')) {
          return $element.val(value);
        } else {
          return $element.text(value);
        }
      }
    }

    var returnValue;
    _.some($(this), function (element) {
      var $element = $(element),
          converter = getConverterByElement($element);

      if (method === 'update') {
        val($element, converter.filterValue(val($element)));
      } else if (method === 'get') {
        returnValue = converter.value(val($element));
        return true;
      } else if (method === 'set') {
        val($element, converter.filterValue(options));
      } else if (method === 'destroy') {
        $element.unbind('.inputlimiter').removeClass('bindInputlimiter');
      } else if (method === 'new') {
        bindElement($element, converter);
      }
    });
    return returnValue;
  };

  $.fn.inputlimiter.defaults = {
  };

  $.inputlimiter = {
    Filters: Filters,
    mask: function (value, options) {
      value = (value == null) ? '' : String(value);
      var converter = getConverter(options.limit, options.filter);
      return converter.filterValue(value);
    },
    unmask: function (value, options) {
      value = (value == null) ? '' : String(value);
      var converter = getConverter(options.limit, options.filter);
      return converter.value(value);
    },
    start: start,
    stop: stop
  };
})(jQuery);
/**
 * ORIGINAL messages_ja.js
 */

$(function(){
	clmsg = {
		cl_echoback: "入力項目が間違っています。",
		 // http エラー
	    cl_http_status_xxx: '障害が発生しました。ご迷惑をお掛けしています。システム管理者へご連絡下さい。',
	    cl_http_status_0: 'サーバーに接続できませんでした。',
	    cl_http_status_unauthorized: 'ログイン情報が確認できませんでした。しばらくお待ち下さい。',

		// validation メッセージ
		cl_required				: "入力してください。",
		cl_its_required : "{0}を入力してください。",
		cl_required2 : "どちらか入力してください。",
		cl_required3 : "いずれか入力してください。",
		cl_its_required2 : "{0}のどちらかを入力してください。",

		cl_len1: '{0}文字で入力してください。',
	    cl_len2: '{0}文字以上で入力してください。',
	    cl_len3: '{1}文字以下で入力してください。',
	    cl_len4: '{0}〜{1}文字で入力してください。',

		cl_length_short1		: "{0}文字以上で入力してください。",
		cl_length_short2		: "{0}～{1}文字で入力してください。",
		cl_length_long1 : "{0}文字以下で入力してください。",
		cl_length_long2 : "{0}～{1}文字で入力してください。",
		cl_its_length_short1	: "{0}が短すぎます。{1}文字以上で入力してください。",
		cl_its_length_short2	: "{0}が短すぎます。{1}～{2}文字で入力してください。",
		cl_its_length_long1		: "{0}が長すぎます。{1}文字以下で入力してください。",
		cl_its_length_long2		: "{0}が長すぎます。{1}～{2}文字で入力してください。",


		cl_less_than_oreqlto	   : "{0}以下で入力してください。",

		cl_lack_postnum	   : "7桁の数字を入力してください。",
		cl_no_postnum	   : "存在しない郵便番号です。",

		cl_email						: "メールアドレス形式ではありません。",
		cl_email_long	: "256文字以下で入力してください。",
		cl_its_email					: "{0}はメールアドレス形式ではありません。入力をご確認ください。",
		cl_its_email_long		: "{0}は256文字以下で入力してください。",

		cl_url					: "URL形式ではありません。",
		cl_its_url				: "{0}はURL形式ではありません。入力をご確認ください。",
		cl_zenkaku: "全角文字列で入力してください。",
		cl_zenkaku_length: "全角{0}～{1}文字で入力してください。",
		cl_zenkaku_short: "全角{0}文字以上で入力してください。",
		cl_zenkaku_long: "全角{0}文字以下で入力してください。",
		cl_hankaku: "半角文字列で入力してください。",
		cl_hankaku_length: "半角{0}～{1}文字で入力してください。",
		cl_hankaku_short: "半角{0}文字以上で入力してください。",
		cl_hankaku_long: "半角{0}文字以下で入力してください。",

		cl_st_date_min_opedate	: "運用日以前の適用開始日は設定できません。",
		cl_st_date_min_eddate	: "最終予約日以前の適用開始日は設定できません",

		cl_st_date_min_del		: "適用開始日が運用日より前のデータは削除できません。",
		cl_postalcode_inval		: "郵便番号が不正です",

		cl_its_time_inval		: "時刻の形式が誤っています。",
		cl_time_inval			: "時刻の形式が誤っています。",

		cl_date_inval			: "日付形式が誤っています。",
		cl_month_inval			: "日付形式が誤っています。",
		cl_its_month_inval		: "日付形式が誤っています。",
		cl_date_max				: "日付が範囲外です。{0}前の日付を入力してください。",
		cl_date_min				: "日付が範囲外です。{0}後の日付を入力してください。",
		cl_date_range			: "日付が範囲外です。{0}～{1}の日付を入力してください。",
		cl_its_date_inval		: "{0}の日付形式が誤っています。",
		cl_its_date_max			: "{0}の日付が範囲外です。{1}前の日付を入力してください。",
		cl_its_date_min			: "{0}の日付が範囲外です。{1}後の日付を入力してください。",
		cl_its_date_range		: "{0}の日付が範囲外です。{1}～{2}の日付を入力してください。",

		cl_regex				: "形式が誤っています。",
		cl_its_regex			: "{0}の形式が誤っています。入力をご確認ください。",

		// 共通メッセージコード
		cl_sys_error			: '障害が発生しました。ご迷惑をお掛けしています。システム管理者へご連絡下さい。',
		cl_sys_nomem			: 'メモリ確保に失敗しました。',

		cl_sys_db_nomem			: 'メモリ確保に失敗しました。',
		cl_sys_db_error			: 'システムエラー：データベースアクセスに失敗しました。',
		cl_sys_db_access		: 'システムエラー：データベースアクセスに失敗しました。',
		cl_sys_db_other			: '別のユーザによってDBが更新されました。',

		cl_sys_fread			: 'ファイルの読み込みに失敗しました。',
		cl_sys_fwrite			: 'ファイルの書き込みに失敗しました。',

		cl_invalid_args			: 'システムは要求を受け付けられませんでした。もう一度入力をご確認ください。',
		cl_fromto_error			: '開始値と終了値が反転しています',

		cl_apl_error			: 'アプリケーションエラーが発生しました。',

		cl_userinfo_warning		: 'ログイン情報が変更されました。ログイン画面へ遷移します。',

		cl_no_data			: '検索結果は0件です。',
		cl_no_env			: '環境情報を設定してください。',
		cl_cng_IE			: '印刷対応ブラウザではありません。ブラウザをInternetExplorerに変更してください。',

		// 日付選択部品
		cl_datepicker_button_text						: 'カレンダー',
		cl_date_error					: '開始期間と終了期間が反転しています',
		cl_month_error					: '開始年月と終了年月が反転しています',
		cl_time_error					: '開始時刻と終了時刻が反転しています',

		cl_rtype_r_upd	: "登録できないデータが含まれています。",
		cl_rtype_r_del	: "削除できないデータが含まれています。",

		cl_rtype_upd  : "登録できないデータです。",
		cl_rtype_del  : "削除できないデータです。",

		cl_rtype_add_confirm 		: "新規登録が完了しました。",
		cl_rtype_upd_confirm  		: "登録が完了しました。",
		cl_rtype_del_confirm  		: "削除が完了しました。",
		cl_rtype_delcancel_confirm  : "削除取消が完了しました。",
		cl_rtype_send_confirm  		: "送信が完了しました。",

		cl_rtype_add_confirm_chk  		: "新規登録を行います。よろしいですか。",
		cl_rtype_upd_confirm_chk 		: "登録を行います。よろしいですか。",
		cl_rtype_del_confirm_chk  		: "削除を行います。よろしいですか。",
		cl_rtype_delcancel_confirm_chk  : "削除取消を行います。よろしいですか。",

		cl_repetition_select		: "どちらかひとつのみ選択してください。",
		cl_repetition_input			: "どちらかひとつのみ入力してください。",
		cl_repetition				: "データが重複しています。",

		cl_repetition_select_required	: "どちらか選択してください。",
		cl_repetition_input_required	: "どちらか入力してください。",

		cl_select_required	: "対象データを選択してください。",

		cl_re_enter	: "もういちど入力してください",

		// 個別エラーメッセージ
		no_staff_list		: "社員を登録してください。",
		no_auth_list		: "権限を登録してください。",
		is_upd_false		: "更新権限がないため、編集はできません。",
		del_false			: "更新権限がないため、削除はできません。",

		no_gen_list			: "リスト要素を登録してください。",
		no_show_element		: "表示項目を選択してください。",
		del_gen_list		: "現在のリストは削除されます。よろしいですか？",
		over_gen_list		: "追加可能な要素数を超えています。",

		number_overflow		: "追加可能な要素数を超えています。追加可能な要素数は{0}までです。",
		gen_list_overflow	: "編集可能な要素数を超えています。要素リストは編集できません。",

		other_store			: "異なる店舗を選択してください。",

		cl_zen2han				: "全角文字が含まれています。半角文字で入力してください。",
		cl_input				: '入力できない文字（,"）が含まれています。',

		// 選択画面
		ca_CAAUV0020_0001		: "{0}は{1}とあわせて登録してください。",
		ca_CACMV0020_0001		: "組織を選択してください。",
		ca_CACMV0030_0001		: "店舗を選択してください。",
		ca_CACMV0050_0001		: "商品分類を選択してください。",
		ca_CACMV0060_0001		: "商品を選択してください。",
		ca_CACMV0070_0001		: "商品属性を選択してください。",
		ca_CACMV0310_0001		: "商品仕様を選択してください。",
		ca_CACMV0090_0001		: "メーカーを選択してください。",
		ca_CACMV0110_0001		: "住所を選択してください。",
		ca_CACMV0120_0001		: "住所リストを選択してください。",
		ca_CACMV0130_0001		: "会員リストを選択してください。",
		ca_CACMV0150_0001		: "会員を選択してください。",
		ca_CACMV0160_0001		: "社員役職を選択してください。",
		ca_CACMV0170_0001		: "社員を選択してください。",
		ca_CACMV0180_0001		: "昇順に入力してください。",
		ca_CACMV0180_0002		: "同一種別は選択できません。",
		ca_CACMV0180_0003		: "同一属性は選択できません。",
		ca_CACMV0180_0004		: "100以上は入力できません。",
		ca_CACMV0180_0005		: "選択してください。",
		ca_CACMV0180_0006		: "降順に入力してください。",
		ca_CACMV0180_0007		: "基本商品分類と商品・品番は同時に選択できません。",
		ca_CACMV0230_0001		: "購買抽出条件を選択してください。",
		ca_CACMV0240_0001		: "カラーサイズＳＫＵを選択してください。",
		ca_CACMV0260_0001		: "DM企画グループを選択してください。",
		ca_CACMV0270_0001		: "DM企画を選択してください。",
		ca_CAMEV0100_0001		: "会員リストを選択してください。",
		ca_CAMEV0100_0002		: "人数を選択してください。",
		ca_CAMEV0110_0001		: "企画種別を選択してください。",
		ca_CAMEV0110_0002		: "データ送信日を過ぎたデータは削除できません。",
		ca_CAMEV0120_0001		: "投函日より前の日付を指定してください。",
		ca_CAMEV0120_0002		: "データ送信日より後の日付を指定してください。",
		ca_CAMEV0120_0003		: "利用開始日より前の日付を指定してください。",
		ca_CAMEV0120_0004		: "投函日より後の日付を指定してください。",
		ca_CAMEV0120_0005		: "事業区分が変更されたため企画リストは削除されます。よろしいですか？",
		ca_CAMEV0120_0006		: "運用日より後の日付を指定してください。",
		ca_CAMEV0120_0007		: "条件抽出を行ってからCSVダウンロードしてください。",
		ca_CACTV0010_0001		: "仮会員リストの登録をしてください。",
		ca_CACTV0040_0001		: "フォルダを選択してください。",
		ca_CAINV0060_0001		: "条件を選択してください。",
		ca_CUMEV0140_0001		: "選択された顧客はすでに会員登録されています。",
		ca_CUMEV0140_0002		: "検索結果は0件です。新規登録画面へ遷移しますか？",
		ca_CUMEV0150_0001		: "パスワード最終更新日から1ヶ月が経過しました。安全のためパスワードを変更してください。",
		ca_CAANV0080_0001		: "反応会員リストを選択してください。",

		ca_menu_0001		: "選択されたノードは削除できません。",

		ca_upld_submit		: "ファイルアップロードに成功しました。登録ボタンを押下してください。",
		ca_upld_err			: "エラーが見つかりました。修正後再度実行してください。",

		ca_del_data			: "入力した内容は破棄されます。よろしいですか？",
		no_print_data		: "印刷データが読み込めませんでした。",
		ca_select_lvl		: "この階層は選択できません。",
		ca_select_attr		: "属性項目を設定してください。",

		new_passwd_confirm	: "パスワードを変更しました。",
		diff_new_passwd		: "確認のために新しいパスワードをもういちど入力してください。",

		// 個別エラーメッセージ サーバー側
		ca_bad_password		: "パスワードが間違っています。",
		ca_password_alnum	: "新しいパスワードは半角英数字で入力してください。",
		ca_bad_dbdelete		: "データが既に削除されています。",
		ca_srch_maxover		: "検索結果が多ぎます。絞込条件を追加してください。",

		/////////////////////////////////////////////////////////////////////////////////
		ca_gscu_cust_0001   :           "指定された会員には顧客情報がありません。",
		ca_gscu_cust_0002   :           "指定された会員は削除されています。",
		ca_gscu_cust_0003   :           "指定された会員には顧客情報が存在します。",
		ca_gscu_cust_0004   :           "指定された会員には会員情報がありません。",
		ca_gscu_cust_0005   :           "指定された会員は削除されています。",
		ca_gscu_cust_0006   :           "指定された会員は切替済みの会員です。",
		ca_gscu_cust_0007   :           "指定されたカードNoはマスタに登録されていません。",
		ca_gscu_cust_0008   :           "指定されたカードNoはAOKIカンパニーコードの番号ではありません。",
		ca_gscu_cust_0009   :           "指定されたカードNoはORIHICAカンパニーコードの番号ではありません。",
		ca_gscu_cust_0010   :           "指定されたカードNoはカード無しカードNoです。",
		ca_gscu_cust_0011   :           "指定されたカードNoには会員情報が存在します。",
		ca_gscu_cust_0012	:			"検索結果が{0}件を超えています。氏名、住所条件で更に絞り込んでください。",
		ca_gscu_cust_0013	:			"カードNoは13桁で指定してください。",
		ca_gscu_cust_0014	:			"カードNoが不正です。",
		ca_gscu_cust_0015	:			"カードNoのチェックディジットが不正です。",
		ca_gscu_cust_0016	:			"指定されたカードNoは切替済みの番号です。有効なカードNoは {0} です。",


		ca_gsan_cm_menu_0001    :       "配下に要素があるため削除できません。",

		ca_gsan_ct_catalog_menu_notfound    :       "登録場所が既に削除されています。",

		ca_gsan_cm_auth_codedup :       "指定されたコードは既に登録されています。",
		ca_gsan_cm_auth_used    :           "指定された権限はユーザが登録されているため削除できません。",

		ca_gsan_cm_memblisty_other  :       "統合元の会員リストが変更されたため会員リストの登録はできませんでした。",

		ca_gsan_ap_anaproc_need_axis    :           "軸条件を指定してください。",
		ca_gsan_ap_anaproc_need_dispitem    :     "表示項目を指定してください。",
		ca_gsan_ap_anaproc_bad_comp_time    :     "期間対比で日付軸を指定することはできません。",

		ca_gsan_me_listview_max :       "出力最大数を超えています。{0}",

		ca_gsan_sg_cond_nomemblist	:	"指定された会員リストは既に削除されています。",
		ca_gsan_sg_cond_noaddrlist	:	"指定された住所リストは既に削除されています。",
		ca_gsan_sg_cond_nosegcond	:	"指定された保存済み条件は既に削除されています。",

		ca_gsan_sg_exec_nomemb  :       "対象会員がいません。",
		ca_gsan_sg_exec_conddepth	:	"保存済み条件が階層が深すぎます。階層数[{0}]",
		ca_gsan_sg_exec_used	:		"指定された条件は別の条件で利用されているため削除できません",


		ca_gsan_cp_dmproggrp_upd_codeexist	:	"指定されたＤＭ企画コードは既に登録されています。",
		ca_gsan_cp_dmproggrp_upd_membdup	:	"ＤＭ企画で会員が重複しています。{0}",
		ca_gsan_cp_dmproggrp_upd_procdone	:	"既に抽出処理済みです。更新はできません。",

		ca_gsan_di_smlist_noelem	:	"要素が指定されていません。",

		ca_gsan_cm_genlist_memb_used	:	"任意条件で利用されているため削除できません。",
		ca_gsan_cm_genlist_addr_used	:	"任意条件で利用されているため削除できません。",

		ca_gsan_lib_badexpr :           "計算式が正しくありません。",
		ca_gsan_lib_nodispitem  :       "表示項目を１つ以上指定してください。",
		ca_gsan_lib_maxbitmap   :           "購入会員集計用領域の確保に失敗しました。絞込条件を追加してください。",
		ca_gsan_lib_maxelem :           "軸要素数が最大値を超えています。",
		ca_gsan_lib_axis_maxelem    :       "集計最大セル数を超えています。{0}",
		ca_gsan_lib_axis_maxelem_inpage :       "表示最大セル数を超えています。{0}",
		ca_gsan_lib_memblist_iszero :           "対象会員が０人のため会員リストの登録はできませんでした。",
		ca_gsan_lib_memblist_del    :               "指定された会員リストは削除されています。",
		ca_gsan_lib_noaxiselem  :               "絞込条件により対象となる軸の要素数がゼロになりました。",

		ca_gsan_lib_maxcell :           "セルの数が最大値を超えています。{0}",

		ca_gsan_lib_orglist :           "指定された店舗リストは削除されています。",
		ca_gsan_lib_itemlist    :           "指定された商品リストは削除されています。",
		ca_gsan_lib_memblist    :           "指定された会員リストは削除されています。",
		ca_gsan_lib_addrlist    :           "指定された住所リストは削除されています。",

		ca_gsan_lib_del_dmpromgrp		:	"指定されたDM企画グループは削除されています。",
		ca_gsan_lib_del_dmprom			:	"指定されたDM企画は削除されています。",
		ca_gsan_lib_noelem_dmpromgrp	:	"指定されたDM企画グループにはDM企画が存在しません。",


		ca_gsan_lib_focus_genlist_org   :       "指定された組織リストの組織階層が店舗検索日では有効ではありません。",
		ca_gsan_lib_focus_genlist_item  :       "指定された商品リストの商品分類階層が商品検索日では有効ではありません。",

		ca_gsan_lib_need_focusrank  :       "閾値条件を指定してください。",

		ca_gsan_lib_excel_vaxis_max	:	"縦軸の要素数がEXCEL出力が最大値を超えています。{0}",
		ca_gsan_lib_excel_haxis_max	:	"横軸の要素数がEXCEL出力が最大値を超えています。{0}",

	};
	/**
	 * ORIGINAL messages2_ja.js
	 */
	clmsg = _.extend((typeof clmsg === 'undefined') && {} || clmsg, {
		EGM0001: "必須項目が入力されていません。",
		EGM0002: "入力可能文字数は　{0} 文字です。",
		EGM0003: "日付のみ入力可能です。",
		EGM0004: "数値のみ入力可能です。",
		EGM0005: "英数字のみ入力可能です。",
		EGM0006: "半角のみ入力可能です。",
		EGM0007: "全角のみ入力可能です。",
		EGM0008: "存在しない {0} コードです。",
		EGM0009: "同じキー({0})の行が存在します。",
		EGM0010: "同じキー({0})の列が存在します。",
		EGM0011: "条件に合致するデータがありません。",
		EGM0012: "すでに指定のコードは使用されています。",
		EGM0013: "期間の終了日には、開始日以降の日付を指定してください。",
		EGM0014: "ファイル名({0})が正しくありません。",
		EGM0015: "ファイル({0})が存在しません。",
		EGM0016: "指定したタグコード（{0}）は存在しません。",
		EGM0017: "指定されたデータは過去履歴のため、{0}の操作はできません。",
		EGM0018: "指定されたデータは先日付に予約データがあるため、{0}の操作はできません。",
		EGM0019: "適用開始日には明日以降の日付を入力してください。",
		EGM0020: "適用開始日には今日以降の日付を入力してください。",
		EGM0021: "入力項目が間違っています。",
		EGM0022: "{0}が参照しているため、{1}を削除出来ません。",
		EGM0023: "{0}が存在しません。",
		EGM0024: "項目数が不足しています。",
		EGM0025: "項目数が多すぎます。",
		EGM0026: "コードが存在しません。",
		EGM0027: "コードが重複しています。",
		EGM0028: "必須項目が設定されていません。",
		EGM0029: "該当データが別のユーザによって更新されました。",
		EGM0030: "Excelデータ取込が出来ませんでした。",
		EGM0031: "開始日と終了日はどちらかが必須です。",
		EGM0032: "指定可能な桁数を超えています。",
		EGM0033: "有効な日付を指定して下さい。",
		EGM0034: "有効な値を指定して下さい。",
		EGM0035: "今日以降の日付は入力できません。",
		EGM0036: "文字として認識できない、または使用不可な値が入力されています。",
		EGM0037: "取込対象行が0行です。ファイルを確認してください。",
		EGM0038: "{0}以上の値を設定してください。",
		EGM0039: "ディレクトリの読み込みに失敗しました。",
		EGM0040: "ディレクトリ({0})が存在しません。",
		EGM0041: "END ファイルに対するデータファイルが存在しません。",
		EGM0042: "ファイルの移動に失敗しました。",
		EGM0043: "ファイル長エラーです。",
		EGM0044: "出力対象がありません。",
		EGM0045: "ファイル名の店舗と伝票の店舗が異なります。",
		EGM0046: "事業ユニットが異なります。",
		EGM0047: "運用日翌日以降の日付を指定してください。",
		EGM0048: "この事業ユニットでは扱っていない商品です。",
		EGM0049: "対象店舗がありません。店舗出力日に在庫がある店舗が対象店舗となります。",
		EGM0050: "{0}が多すぎます。",
		EGM0051: "該当品番に展開の無いカラーです。",
		EGM0052: "該当品番に展開の無いサイズです。",
		EGM0053: "指定した事業ユニット所属の店舗コードではありません。",
		EBP0001: "売上計画の下１桁が０以外。",
		EBP0002: "売上高　！＝　０　かつ　経準率　＝　０の場合はエラー",
		EBP0003: "売上高　＝　０　かつ　経準率　！＝　０の場合はエラー",
		EBP0004: "（Excelデータ取込時）売上高は少数は指定不可。",
		EBP0005: "（Excelデータ取込時）経準率は、小数点1桁まで設定可能。",
		EBP0006: "日別計画の合計が月別計画に一致しない。",
		EBP0101: "店舗日別計画(申請者{0})の承認者マスタが存在しません。",
		EBP0102: "店舗日別計画(申請者{0})の承認者ではありません。",
		EBP0103: "承認済なので差戻しはできません。",
		EBP0104: "申請者登録されていないため、承認申請することはできません。",
		EBP0105: "年月が設定されていません。",
		EBP0106: "数字でありません。",
		EBP0107: "長さ({0})が最大({1})を超えています。",
		EBP0108: "年月が正しくありません。",
		EBP0109: "年月が重複しています。",
		EBP0110: "不正な日付です。",
		EBP0111: "計画年月日は「年月」以前でなければなりません。",
		EBP0112: "申請期限はアラーム表示日以降でなければなりません。",
		EBP0113: "世話人の指定は店舗の指定以降でなければなりません。",
		EBP0114: "世話人代表の指定は世話人の指定以降でなければなりません。",
		EBP0115: "入力範囲外です。",
		EBP0116: "最新バージョンと同じ内容であったため更新は行われませんでした。",
		EBP0117: "未申請の店舗は一括承認の対象となりません。申請が行われてから再度実施して下さい。",
		EBP0118: "承認可能な店舗はありません。",
		EBP0119: "申請者登録されていないため、一時保存することはできません。",
		EBP0120: "SMX対象組織の店舗コード({0})ではありません。",
		EBP0121: "指定した対象月範囲外の日付です。",
		EBP0122: "指定した事業ユニット所属の店舗コード({0})ではありません。",
		EBP0123: "店舗コードと日付が({0})行目と同じです。",
		EBP0124: "少数点第1位までの入力が可能です。",
		EMP0001: "指定年度の営業計画が登録されていません。",
		EMP0002: "指定年度の品種別計画が登録されていません。",
		EMP0003: "指定年度・シーズンのシーズン別計画が登録されていません。",
		EMS0001: "商品分類体系所属の商品分類が存在しています。階層の削除はできません。",
		EMS0002: "商品分類体系所属の商品分類が存在しています。体系の削除はできません。",
		EMS0003: "指定の上位商品分類は、画面指定の商品分類階層の1つ上の階層ではない{0}に所属しています。",
		EMS0004: "自身に紐づく下位商品分類が存在するため、削除できません。",
		EMS0005: "自身に紐づく下位商品属性項目が存在するため、削除できません。",
		EMS0006: "順位が重複しています。",
		EMS0007: "対象商品には最低{0}商品の登録が必要です。",
		EMS0008: "同一上位組織内の組織({0})で同じ表示順が設定されています。",
		EMS0009: "組織体系所属の組織が存在しています。階層の削除はできません。",
		EMS0010: "組織体系所属の組織が存在しています。体系の削除はできません。",
		EMS0011: "閉店日が開店日より過去になっています。",
		EMS0012: "自身に紐づく下位組織が存在するため、削除できません。",
		EMS0013: "同じ店舗で客注禁止期間(開始日＝{0}、終了日＝{1})が重なっています。",
		EMS0014: "該当の組織は指定の事業ユニット({0})の所属ではありません。",
		EMS0015: "売上・在庫照会オプションチェック時は、課金先コードを入力してください。",
		EMS0016: "納品形態が店直以外の場合、振分先(センター)の入力は必須です。",
		EMS0017: "売り切り年が商品展開年より過去になっています。",
		EMS0018: "製品仕上日は承認期限日以降を設定してください。",
		EMS0019: "仕入予定日は製品仕上日以降を設定してください。",
		EMS0020: "販売開始日は仕入予定日以降を設定してください。",
		EMS0021: "販売終了日は販売開始日以降を設定してください。",
		EMS0022: "同じメーカー品番の行で{0}が一致していません。",
		EMS0023: "同じメーカー品番、カラーの行で色番が一致していません。",
		EMS0024: "自身に紐づくサイズマスタが存在するため、削除できません。",
		EMS0025: "祝日名が設定されていない年月日が存在しています。",
		EMS0026: "原反工場着日は原反発注日以降を設定してください。",
		EMS0027: "型番表内に同じ部位が存在しています。",
		EMS0028: "カラー展開で同じカラーが重複して登録されています。",
		EMS0029: "カラー展開でカラーは最低1つ登録してください。",
		EMS0030: "サイズ展開でサイズは最低1つ選択してください。",
		EMS0031: "JANコードが設定されていません。",
		EMS0032: "JANコードが同一商品内で重複しています。",
		EMS0033: "商品がすでに期間値下({0}:{1})に登録されているため、組合せ販売に登録できません。",
		EMS0034: "JANコードが他の商品(品種[{0}:{1}] メーカー[{2}:{3}] メーカー品番[{4}])で使用されています。",
		EMS0035: "品種、メーカー、メーカー品番の組合せがすでに他の商品で使用されています。",
		EMS0036: "商品は{0}に登録されているため削除できません(該当データのコード：{1})",
		EMS0037: "差戻し時は、差戻し理由を入力してください。",
		EMS0038: "商品がすでに他の組合せ販売({0}:{1})に登録されています。",
		EMS0039: "組合せ段階の組合せ点数は段階ごとに増加するように設定してください。",
		EMS0040: "価格指定の場合には、組合せ段階ごとの平均額は減少するように設定してください。",
		EMS0041: "値引額指定の場合には、組合せ段階ごとの平均額は増加するように設定してください。",
		EMS0042: "該当の商品はタグ発行承認済のため、削除できません。",
		EMS0043: "該当の発注兼振分データはタグ発行承認済のため、削除できません。",
		EMS0044: "該当の取引先コードは、指定の取引先区分では使用できません。",
		EMS0045: "追加発注時、該当登録番号で登録済みの商品以外の商品を投入することはできません",
		EMS0046: "メーカー品番、カラー、サイズが商品明細に存在していません",
		EMS0047: "画面指定の商品属性項目定義と違うコードがExcelデータで指定されています。",
		EMS0048: "現在存在している商品属性項目({0})がExcelデータ内に存在しません。項目の削除はできません。",
		EMS0049: "定義で指定されている階層数と、Excelデータ内で設定されている各項目マスタの最大階層数が一致していません。",
		EMS0050: "この品種は、上位階層の対象品種内に含まれていません。",
		EMS0051: "指定の部門、品種、メーカー、メーカー品番が、商品マスタに存在しません。",
		EMS0052: "内容が重複する行が存在します。",
		EMS0053: "週番号が設定されていない行が存在します。",
		EMS0054: "日付が設定されていない行が存在します。",
		EMS0055: "取込レコード数が{0}行未満です。",
		EMS0056: "取込レコード数が{0}行を超えています。",
		EMS0057: "必須項目が設定されていない行が存在します。",
		EMS0058: "対象年度が画面で入力された年度と異なる行が存在します。",
		EMS0059: "シーズンクール終了日が開始日より過去になっている行が存在します。",
		EMS0060: "異なるシーズン番号間でシーズンクール期間が重複する行が存在します。",
		EMS0061: "対象年度内でシーズン番号が設定されていない期間が存在します。",
		EMS0062: "本年度より未来の年度を指定してください。",
		EMS0063: "未承認のため、{0}できません。",
		EMS0064: "移動先の上位商品分類内に同一コードの商品分類があるため移動できません。",
		EMS0065: "{0}が重複しています。",
		EMS0066: "{0}が重複する行が存在します。",
		EMS0067: "{0}が空白の行が存在します。",
		EMS0068: "{0}が空白の列が存在します。",
		EMS0069: "基本属性変更中の商品のため、{0} できません。",
		EMS0070: "返品先住所の対象品種が重複しています",
		EMS0071: "承認申請中のため、{0}できません。",
		EMS0072: "組織階層がトップ(HD)以外の場合、上位組織の入力は必須です。",
		EMS0073: "プライスラインは最低1つ登録してください。",
		EMS0074: "プライスラインの上限値は行ごとに増加するように設定してください。",
		EMS0075: "プライスラインの上限値は下限値より大きくなるように設定してください。",
		EMS0076: "選択した品種は既に他のサイズグループに紐付いています。",
		EMS0077: "週番号が1から開始になっていない年月日が存在します。",
		EMS0078: "週番号が連続していない年月日が存在します。",
		EMS0079: "同一の週番号内で連続していない年月日が存在します。",
		EMS0080: "週番号の開始日が直前の週番号の最終日から連続していません。",
		EMS0081: "対象年度一年分の年月日を指定してください。足りない年月日が存在します。({0})",
		EMS0082: "{0}行目：同一の行No({1})が存在します。",
		EMS0083: "{0}行目：同一の行名({1})が存在します。",
		EMS0084: " 取込データの行No.={0},列No.={1}に同一のサイズコード({2})が存在しています。",
		EMS0085: " 取込データの行No.={0},列No.={1}に同一のサイズ名称({2})が存在しています。",
		EMS0086: "サイズパターンコード({0})に同一のサイズコード({1})が存在しています。",
		EMS0087: "指定されたサイズパターン({0})は移行用サイズパターンであるため更新できません。",
		EMS0088: "取込データの行数が既存レコードの行数より少なくなっています。",
		EMS0089: "取込データの列数が既存レコードの列数より少なくなっています。",
		EMS0090: "取込データの行No.={0},列No.={1}のサイズコードが既存レコードのサイズコード({2})と一致しません。",
		EMS0091: "既存レコードの行No.={0},列No.={1}のサイズコード({2})が取込データに存在しません。",
		EMS0092: "{0}行目：行名1を設定した場合、行名2は必須となります。",
		EMS0093: "{0}行目：列名1を設定した場合、列名2は必須となります。",
		EMS0094: "サイズコードを設定した場合、サイズ名称は必須となります。",
		EMS0095: "行区分が不正です。",
		EMS0096: "仕入ありの場合、必須項目です。",
		EMS0097: "限定店舗フラグがONの場合、対象店舗を1店舗以上指定してください。",
		EMS0098: "階層({0})には組織区分({1})の組織は登録できません。",
		EMS0099: "画面指定の事業ユニット、品種と取込データが異なっています。",
		WMS0100: "上代＜下代になっています。",
		EMS0101: "組織体系が存在しません。",
		EMS0102: "組織階層が存在しません。",
		EMS0103: "組織が存在しません。",
		EMS0104: "商品名が他の企画商品で使用されています。変更してください。",
		WMS0105: "基本属性変更を選択されましたが、承認不要項目のみの編集です。承認なしでこのまま登録してもよろしいですか？",
		EMS0106: "指定組織（{0}:{1}）は事業ユニットではありません。",
		EMS0107: "コードが、同じ上位商品分類を親に持つ商品分類中に存在しています。別のコードにしてください。",
		EMS0108: "組織階層は少なくとも２層入力してください。",
		WMS0109: "組織区分が店舗または倉庫ですが、在庫管理フラグがOFFです。<br/>このまま登録してもよろしいですか？",
		EMS0110: "店別振分数の合計が商品の発注数と一致していません。",
		EMS0111: "メーカーの事業ユニットと商品の事業ユニットが違います。",
		EMS0112: "指定のコードは品種対象ではありません。",
		EMS0113: "手入力JANコードの先頭2桁は、45または49のみ有効です。",
		EMS0114: "サイズコードを設定した場合、ＫＴ区分は必須となります。",
		EMS0115: "行No.は1から開始して下さい。",
		EMS0116: "列No.は1から開始して下さい。",
		EMS0117: "行No.に抜けがあります。",
		EMS0118: "列No.に抜けがあります。",
		EMS0119: "出力最大件数({0})を超えています。",
		EMS0120: "行区分には1～4を指定して下さい。",
		EMS0121: "階層数には1または2を指定して下さい。",
		EMS0122: "商品属性項目定義で指定されたコード長を超えています。",
		EMS0123: "品種指定フラグに0を指定する場合には対象品種を指定しないで下さい。",
		EMS0124: "品種指定フラグに1を指定する場合には対象品種を指定して下さい。",
		EMS0125: "{0}行目に同じキーが存在しています。",
		EMS0126: "階層数の変更はできません。",
		EMS0127: "他の集約品番({0})に登録済です。",
		EMS0128: "商品属性項目定義行(行区分＝1)は最初に1行だけ指定して下さい。",
		EMS0129: "商品属性項目行(行区分＝2)を1行以上指定して下さい。",
		EMS0130: "申請者登録されていないため、承認申請することはできません。",
		EMS0131: "該当のカラーは既に発注済みのため、削除できません。",
		EMS0132: "該当のカラー・サイズは既に発注済みのため、削除できません。",
		EMS0133: "タグ送付先番号が取引先マスタで登録されていない番号です。",
		EMS0134: "発注兼振分登録で登録している商品のため、取り込めません。",
		EMS0135: "承認済の商品を編集することはできません。",
		EMS0136: "基本属性のみの取込の場合、1商品1行にしてください。",
		EMS0137: "サイズ展開の異なるカラーが同一カラーグループ番号になっています。",
		EMS0138: "指定された{0}は対象年度の日付ではありません。",
		EMS0139: "POS停止日を設定する場合はPOS設置日以降の日付にしてください。",
		EMS0140: "商品展開年と販売開始日から計算される年度が一致していません。",
		EMS0141: "集約商品のサイズパターンと異なるサイズパターンの商品です。",
		EMS0142: "対象年度の年月日ではありません。",
		EMS0143: "％を設定する場合は、素材を設定して下さい。",
		EMS0144: "部門が、指定の事業ユニットの所属ではありません。",
		EMS0145: "品種が、指定の部門の所属ではありません。",
		EMS0146: "サブクラスコードの1桁目(1:AOKI/2:ORIHICA)と対象品種の事業ユニットコードが不整合です。",
		EMS0147: "サブクラスコードの2～3桁目と対象品種の品種コードが不一致です。",
		EMS0148: "振分数は発注数({0})以下に設定してください。",
		EMS0149: "最上位階層の組織は移動できません。",
		EMS0150: "カラー・サイズ情報が設定されていないため、商品発注台帳出力ができません。",
		EMS0151: "SMXカタログ取込で指定できない品種です。",
		EMS0152: "SMXカタログ取込では発注数を0に指定してください。",
		EMS0153: "SMXカタログ取込ではタグ発行フラグを0に指定してください。",
		EMS0154: "追加発注情報が設定されていません。",
		WMS0155: "他の集約品番で登録済の品番があります。",
		EMS0156: "指定された品種では指定できないサイズパターンです。",
		EMS0157: "SMX開始日を設定した場合、SMX店舗タイプは必須です。",
		EMS0158: "SMX店舗タイプを設定した場合、SMX開始日は必須です。",
		EMS0159: "全ての任意組織体系から削除した後、基本組織体系からの削除が可能になります。",
		WMS0160: "下代が1円以下で入力されています。",
		EMS0161: "存在しない事業ユニットIDです。",
		WMS0162: "登録年度から1年以上経過している商品ですが登録しますか？",
		WMS0163: "登録年度から1年以上経過している商品ですが承認しますか？",
		EMS0164: "他の組合せ販売に登録済みの商品があります。<br>{0}",
		EMS0165: "他の期間値下げに登録済みの商品があります。<br>{0}",
		EMS0166: "メーカー品番が正しくありません。",
		EMS0167: "SPC不可を設定して下さい。",
		EMS0168: "自社タグ発行の取引先では選択できないタグ種別です。",
		EMS0169: "カラー別設定されていたものが、カラー別設定でない集約商品として登録されようとしています。システム管理者に相談して下さい。",
		EMS0170: "カラー別設定されていないものが、カラー別設定された集約商品として登録されようとしています。システム管理者に相談して下さい。",
		EMS0171: "承認期限日には翌日以降の日付を入力してください。",
		WMS0172: "申請出来ないデータが含まれていました。申請可能なデータのみ申請しました。",
		WMS0173: "申請出来ないデータ内容です。データの内容を確認して下さい。",
		WMS0174: "選択されたデータの一括承認を行います。宜しいですか？",
		WMS0175: "選択されたデータの一括差戻しを行います。宜しいですか？",
		EMS0176: "対象商品のサイズパターンと異なります。",
		EMS0177: "同一集約商品内ではカラーコードを指定しない商品と指定する商品を同時に指定することはできません。",
		EMS0178: "基準在庫が登録されている集約品番は削除することができません。",
		WMS0179: "同一集約商品内で説明・メモが異なるものが存在します。",
		WMS0180: "同一集約商品内で集約商品名称が異なるものが存在します。",
		EMS0181: "エラー箇所が多過ぎる為、最初の{0}件のみ記載しています。",
		EMS0182: "タグ増産率には0～5%の値を指定することができます。",
		WMS0183: "増産分のタグ発行枚数が0枚になるサイズがあります。",
		EMS0184: "カタカナを含む場合は、先頭8文字が他の品番と重複しない様に設定してください。",
		EMS0185: "タグ発行区分が中国の場合、タグ送付先を必ず指定して下さい。",
		EMS0186: "カラー別の商品で登録された集約商品をカラー別でない商品に変更することはできません。",
		EMS0187: "カラー別でない商品で登録された集約商品をカラー別の商品に変更することはできません。",
		EDS0003: "基準在庫パターンとサイズが合っていません。",
		EDS0004: "振分可能数が０の商品の基準在庫は設定できません。",
		EDS0005: "店舗別設定の店舗コードが設定されていません。",
		EDS0006: "店舗別の基準在庫が設定されていません。",
		EDS0007: "店舗別基準在庫設定済の店舗です。",
		EDS0008: "発注日は納品日より前に設定して下さい。",
		EDS0009: "発注日はセンター納品日より前に設定して下さい。",
		EDS0010: "センター納品日は納品日以前に設定して下さい。",
		EDS0011: "既に同一店舗と同一品種で、期間の重複する自動振分停止設定が存在します。",
		EDS0012: "指定された品番には展開が無いサイズです。",
		EDS0013: "基準在庫で使用しされています。削除できません。",
		EDS0014: "設定されていません。",
		EDS0015: "長さ({0})が最大({1})を超えています。",
		EDS0016: "数字でありません。",
		EDS0017: "日付({0})が不正です。",
		EDS0018: "品種コード({0})が見つかりません。",
		EDS0019: "メーカーコード({0})が見つかりません。",
		EDS0020: "品番({0})が見つかりません。",
		EDS0021: "カラーコード({0})が見つかりません。",
		EDS0022: "期間終了日が期間開始日以前に設定されています。",
		EDS0023: "店舗ランクパターンコード（{0}）が見つかりません。",
		EDS0024: "対象は店舗ランク指定はR, 店舗指定はSを指定してください。",
		EDS0025: "サイズ名（{0}）が見つかりません。",
		EDS0026: "サイズが{0}列目と同じです。",
		EDS0027: "店舗ランクコード（{0}）が見つかりません。",
		EDS0028: "店舗ランクが{0}行目と同じです。",
		EDS0029: "店舗コード（{0}）が見つかりません。",
		EDS0030: "店舗が{0}行目と同じです。",
		EDS0031: "納品形態は、1, 2, 3のいずれかを指定してください。(1:店直、2:TC、3:DC)",
		EDS0032: "センターコード({0})が見つかりません。",
		EDS0033: "客注区分は、0,1のいずれかを指定してください。(0:未設定、1:客注)",
		EDS0034: "緊急区分は、0,1のいずれかを指定してください。(0:未設定、1:緊急)",
		EDS0035: "振分方法は、0,1,2のいずれかを指定してください。(0:未設定、1:フェイス、2:ストック)",
		EDS0036: "納品日は発注日翌日以降を指定してください。",
		EDS0037: "センター納品日は発注日翌日以降、納品日前日までを指定してください。",
		EDS0038: "日付はMM/DD形式で指定して下さい。",
		EDS0039: "「自動振分数が振分可能数を超えた場合」には、0,1,2のいずれかを指定してください。",
		EDS0040: "品番・カラーが同じシートが複数ある場合には左から最初にみつかったシートのものだけが取り込まれます。",
		EDS0041: "品番({0})＋カラーコード({1})が見つかりません。",
		EDS0042: "振分方法指定時にはセンター納品日を指定して下さい",
		EDS0043: "品番({0})＋カラーコード({1})＋サイズ({2})が見つかりません。",
		EDS0044: "基準在庫数が入力されていません。",
		EDS0045: "指定した事業ユニット所属のセンターコード({0})ではありません。",
		EDS0046: "指定した事業ユニット所属の店舗コード({0})ではありません。",
		EDS0047: "カラー別に指定されていない集約品番の場合、カラーコードを指定して下さい。",
		EDS0048: "カラー別に指定された集約品番の場合、カラーコードを指定しない下さい。",
		EDS0049: "前日以前の発注日は取り込めません。",
		EDS0050: "期間開始、終了を片方のみ設定することはできません。",
		EDS0051: "店舗ランクコードに前０を設定することは出来ません。",
		EDS0052: "入力した店舗納品日で振分停止期間が設定されている店舗があります。",
		EDS0053: "振分停止期間が設定されている店舗には振分出来ません。",
		EDS0054: "閉店日が設定されている店舗には振分出来ません。",
		EDS0055: "該当データは発注済のため、更新できません。",
		EDS0056: "{0}と{1}を同時に有効にすることはできません。何れかの設定を無効(0)にしてください。",
		EDS0057: "メーカーコード({0})が設定されています。メーカー品番に上限在庫の設定はできません。",
		EDS0058: "サイズ名が指定されていません。",
		WDS0001: "店舗が設定されていない店舗ランクが存在します。",
		WDS0002: "店舗ランクに所属する全ての店舗が店舗別設定がされています。<br />このまま登録しますか？",
		WDS0003: "店舗別で更新すると更新した基準在庫は全て店舗別設定になります。",
		WDS0004: "振分可能数以上の数を振分ようとしています。振分けますか？",
		WDS0005: "振分停止期間が設定されている店舗に振分数が設定されています。振分けますか？",
		WDS0006: "同一発注日・同一品番・同一カラー・同一店舗の振分データが存在します。振分けますか？",
		WDS0007: "登録しようとしている品番は、既に集約品番の基準在庫が存在します。登録しますか？",
		WDS0008: "登録しようとしている集約品番は、既に単独品番の基準在庫が存在します。登録しますか？",
		WDS0009: "（警告）同一品番・カラーの基準在庫がすでに存在します。",
		WDS0010: "（警告）同一集約品番・カラーの基準在庫がすでに存在します。",
		WDS0011: "（警告）集約品番に属する品番({0})の基準在庫がすでに存在します。",
		WDS0012: "（警告）振分可能数以上の振分をしようとしています。",
		WDS0013: "（警告）振分停止期間が設定されている店舗に振分数が設定されています。",
		WDS0014: "（警告）同一発注日・同一品番・同一カラーの振分データが存在します。",
		WDS0015: "期間指定外の登録が存在します。指定期間のみ取込みますか？",
		WDS0016: "（警告）品番を含む集約品番({0})の基準在庫がすでに存在します。",
		WDS0017: "警告で取り込まれなかったシートがあります。",
		WDS0018: "エラーで取り込まれなかったシートがあります。",
		WDS0019: "警告、エラーで取り込まれなかったシートがあります。",
		WDS0020: "取り込まれたシートと警告で取り込まれなかったシートがあります。",
		WDS0021: "取り込まれたシートとエラーで取り込まれなかったシートがあります。",
		WDS0022: "取り込まれたシートと警告、エラーで取り込まれなかったシートがあります。",
		EDL0001: "同一の日付({0})、伝票番号({1})、取引先({2}:{3})、店舗({4}:{5})の仕入伝票が存在しています。",
		EDL0002: "返品数は、返品依頼数({0})以下に設定します。",
		EDL0003: "同一の日付({0})、店舗({1}:{2})、品種({3}:{4})、メーカー／倉庫({5}:{6})、荷番({7})の仕入伝票が存在しています。",
		EDL0004: "送り先に手書きを選択していますので、郵便番号を入力します。",
		EDL0005: "送り先に手書きを選択していますので、住所を入力します。",
		EDL0006: "メーカー品番({0})、カラーコード({1})が重複しています。",
		EDL0007: "伝票の合計数量({0})と検品結果の合計数量({1})が合いません。",
		EDL0008: "存在しないJANコード({0})です。",
		EDL0009: "SCMの合計数量({0})と検品結果の合計数量({1})が合いません。",
		EDL0010: "メーカー({0})が異なる商品({1})です。",
		EDL0012: "商品({0})は増納です。入荷予定数は{1}、検品数は{2}です。",
		EDL0013: "発注に存在しない伝票（タイプ）({0})です。",
		EDL0014: "入荷予定とは異なる商品({0})です。",
		EDL0015: "検索した時の伝票と更新時の伝票が異なっています。「明細表示」ボタンをクリックして、伝票情報を最新化します。",
		EDL0016: "同一の日付({0})、伝票番号({1})、移動出荷元({2}:{3})、店舗({4}:{5})の移動入荷伝票が存在しています。",
		EDL0017: "返品期限は、店舗出力日以降を設定してください。",
		EDL0018: "移動入荷処理を実施済みのため、移動出荷伝票を削除できません。",
		EDL0019: "SCMコード({0})に対応する出荷データが存在しません。",
		EDL0020: "同一の日付({0})、店舗({1}:{2})、商品({3}:{4})、出荷元({5}:{6})、荷番({7})の移動入荷伝票が存在しています。",
		EDL0021: "この伝票は２つ以上のSCMで構成されています。SCM入荷データ画面をご使用ください。",
		EDL0022: "同一の日付({0})、店舗({1}:{2})、出荷元({3}:{4})、荷番({5})、伝票番号（{6}）、伝票行番号（{7}）の伝票が存在しています。",
		EDL0023: "画面で指定した取引先は、このメーカー品番を扱っていません。",
		EDL0024: "指定されたSCMコードは既に取り込み済みです。",
		EDL0025: "数量が多すぎます。",
		EDL0026: "検索結果は0件です。伝票の入荷店舗をチェックして下さい。",
		EDL0027: "取引先出荷伝票のない納品形態 TC1 の仕入伝票は登録できません。",
		EDL0028: "既に入荷伝票が作成されています。",
		EDL0029: "SCMに関連する伝票が別のSCMで確定されています。",
		EDL0030: "明細に入力された商品の品種が混在しています。",
		EDL0031: "返品依頼数以上の登録はできません。依頼数を超えた数量分については通常の返品手続き・登録を進めてください。",
		EDL0032: "明細行数が９を超えています。",
		EDL0033: "出荷店舗は在庫変動不可店舗です。",
		EDL0034: "入荷店舗は在庫変動不可店舗です。",
		EDL0035: "1つの手書き伝票に対して、品種が混在する明細がスキャンされました。",
		EDL0036: "SCMとは異なる取引先の商品がスキャンされました。",
		EDL0037: "SCM伝票です。SCM入荷データ一覧より入荷してください。",
		EDL0038: "同じメーカー品番({0})でカラーコード・すべてを指定する場合には別の行で他のカラーコードを指定することはできません。",
		EDL0039: "出荷点数0は登録できません。",
		EDL0040: "取引先コードが違う商品が含まれています。",
		EDL0041: "出荷点数0は登録できません。<br>画面左下の「一覧に戻る」を押下し伝票を削除して下さい。」",
		EDL0042: "明細は最低1点以上入力してください。",
		EDL0043: "店舗と出荷元メーカーの事業ユニットが異なっています。",
		EDL0044: "正しいJANコードを入力してください。",
		EDL0045: "存在しない返品依頼番号です。",
		EDL0046: "当該店舗は対象になっていない返品依頼番号です。",
		WDL0001: "同一の伝票番号({0})、取引先({1}:{2})、店舗({3}:{4})の入荷伝票が{5}日以内に存在しています。",
		WDL0002: "商品({0})は欠品です。入荷予定数は{1}、検品数は{2}です。",
		WDL0003: "SCMで入荷／移動入荷した処理しました。伝票で修正しようとしていますが、よろしいでしょうか。",
		WDL0004: "同一の伝票番号({0})、移動出荷元({1}:{2})、店舗({3}:{4})の移動入荷伝票が{5}日以内に存在しています。",
		EAS0001: "対象月が未来になっています。当月以前を指定して下さい。",
		EAS0002: "対象日が未来になっています。運用日以前を指定して下さい。",
		EAS0003: "対象週が未来になっています。当週以前を指定して下さい。",
		EAS0004: "対象期が未来になっています。当期以前を指定して下さい。",
		EAS0005: "対象年が未来になっています。当年以前を指定して下さい。",
		ERS0001: "この補正項目コードは既に使用されています。",
		ERS0002: "この補正項目には、補正業者({0}:{1})で単価が設定されているため、削除できません。",
		ERS0003: "この補正相殺項目コードは既に使用されています。",
		ERS0004: "この補正相殺項目には、補正業者({0}:{1})で単価が設定されているため、削除できません。",
		ERS0005: "補正相殺区分が「件数入力」の場合は、単価を指定してください。",
		ERS0006: "最低保証金額は入力されていますが、最低保証対象月が指定されていません。",
		ERS0007: "最低保証対象月は指定されていますが最低保証金額が入力されていません。",
		ERS0008: "指定された適用期間開始日の時点で有効でない店舗が存在します。",
		ERS0009: "補正件数が０件の場合は、「補正なし」をチェックＯＮして登録してください。",
		ERS0010: "既に同じ補正項目が入力されています。",
		ERS0011: "指定された店舗が存在しません。",
		ERS0012: "指定された補正業者が存在しません。",
		ERS0013: "対象月に存在しない週({0})に使用件数が入力されています。",
		ERS0014: "店舗に通常業者として補正業者を2件登録することはできません。",
		ERS0015: "店舗に館内業者として補正業者を2件登録することはできません。",
		ERS0016: "指定された取引先の補正業者マスタは既に登録されています。",
		ERS0017: "指定の補正業者は店舗の取引先として登録されていません。",
		ERS0018: "登録可能な補正項目マスタまたは補正項目単価マスタが存在しません。",
		ERS0019: "店舗コード＋補正業者コードが重複した行が存在します。",
		ETR0001: "メーカーコード、メーカー品番、カラーコード、サイズコードのタグコードとの紐付が正しくありません。",
		ETR0002: "メーカーコード、メーカー品番、カラーコード、サイズコードの紐付が正しくありません。",
		ETR0003: "メーカーコード、メーカー品番、カラーコード、サイズコード、タグコードが、画面上の品種配下に存在しません。",
		ETR0004: "同一商品に対し、出荷店({0}:{1})が「すべて」である行と店舗指定されている行が存在します。",
		ETR0005: "同一商品に対し、同一の出荷店({0})から異なる入荷店への移動のうち、数量に「すべて」を含む行が存在します。",
		ETR0006: "すでに指定の移動依頼番号は使用されています。",
		ETR0007: "出荷店舗と入荷店舗に同じ店舗が指定されています。",
		ETR0008: "入荷日は出荷日以降に設定してください。",
		ETR0009: "すでに指定の伝票番号は使用されています。",
		ETR0010: "店舗出力日を過ぎているため、削除はできません。",
		ETR0011: "出荷店舗、入荷店舗、商品が同じ移動依頼が既に存在します。（移動依頼番号：{0})",
		ETR0012: "移動出荷期限は、店舗出力日より未来の日付を指定してください。",
		ETR0013: "アラーム表示期限は移動出荷期限より未来の日付を指定してください。",
		ETR0014: "出荷店舗の事業ユニットと入荷店舗の事業ユニットは同じにしてください。",
		WTR0015: "直近１週間に移動依頼が出ています（商品：{0}、出荷店：{1}、入荷店：{2}）",
		ETR0016: "数量全てフラグが0の場合は、正しく数量指定してください。",
		ETR0017: "数量全てフラグが1の場合は、数量指定はできません。",
		ETR0018: "{0}行目：指定の事業ユニットに所属した出荷店を指定してください。",
		ETR0019: "{0}行目：指定の事業ユニットに所属した入荷店を指定してください。",
		ETR0020: "{0}行目：指定の品種に所属した商品を指定してください。",
		ETR0021: "内容が重複する行が存在します。",
		ETR0022: "出荷日、入荷日のどちらかは指定してください。",
		WTR0023: "直近1週間に移動依頼の出ている店舗があります。",
		ETR0024: "同一商品に対し、複数行で出荷店に「すべて」を指定することはできません。",
		ETR0025: "指定された出荷日は直近の棚卸日以前の日付なので新規登録はできません。",
		ETR0026: "同一品番商品に対し、同一出荷店の移動のうち、カラーに「すべて」を含む行が存在します。",
		ETR0027: "同一品番商品に対し、同一出荷店の移動のうち、サイズに「すべて」を含む行が存在します。",
		ETR0028: "出荷店舗は在庫変動不可店舗です。",
		ETR0029: "入荷店舗は在庫変動不可店舗です。",
		ETR0030: "DePO'sからの移動依頼の為、品種コードは入力しないでください。",
		ETR0031: "『当月に評価減処理』かつ『評価減処理前に移動』の商品が含まれています。<br/>次月の1日以降に修正・削除して下さい。",
		ETR0032: "店舗の事業ユニットと商品の事業ユニットは同じにしてください。",
		ETR0033: "この伝票は評価減商品を含むため編集できません。新規に伝票を作成して数量の調整を行ってください。",
		EMD0001: "{0}行目：同一のメーカー品番({1})が存在します。",
		EMD0002: "{0}行目：値下率が設定されていません。",
		EMD0003: "{0}行目：変更後上代が設定されていません。",
		EMD0004: "期間値下対象の商品は最低1つ登録してください。",
		EMD0005: "対応期限は店舗出力日以降の日付を指定してください。",
		EMD0006: "アラーム表示期限は対応期限以降の日付を指定してください。",
		EMD0007: "アラーム表示期限は店舗出力日以降の日付を指定してください。",
		EMD0008: "マークダウン対象の商品は最低1つ登録してください。",
		EMD0009: "店舗出力日を過ぎたマークダウン依頼は削除できません。",
		EMD0010: "{0} 以降に値下変更されている商品です。",
		EMD0011: "指定品種に属していない商品です。",
		EMD0012: "店舗出力日は明日以降の日付を指定してください。",
		EMD0013: "この商品は、依頼番号：{0}でマークダウン予定があります。マークダウン期限日の翌日以降は、現在画面表示されている元上代から変更となり、マークダウン後の元上代から割引されます。",
		WMD0001: "同一期間に同一商品のマークダウン指示が存在します。",
		WMD0002: "承認期限を過ぎているので、期限を自動で変更しました。",
		WMD0003: "マークダウン予定の商品があります。登録しますか？",
		EFU0001: "ファンド商品期間はファンド期間内に収めてください。",
		EFU0002: "締め後登録でなければ、ファンド期間は今月以降を指定してください。",
		EFU0003: "対象商品が特定されていない行が存在します。",
		EFU0004: "指定されたユーザコードはユーザマスターに登録されていません。",
		EFU0005: "ファンド期間開始日は最初に登録を行った月以降のみ設定可能です",
		EFU0006: "遡及登録時、ファンド期間終了日は前月以前のみ設定可能です",
		EFU0007: "遡及登録時、ファンド期間終了日は登録月の前月以前のみ設定可能です",
		EWD0001: "指定された商品が評価減対象年令未満です。",
		EWD0002: "指定品種に属していない商品です。",
		EWD0003: "同一評価減実施日に同一商品の評価減依頼が存在します。",
		EWD0004: "変更前上代＞変更後上代となる金額を指定してください。",
		EWD0005: "変更後下代＝変更後上代となる金額を指定してください。",
		EWD0006: "最高年齢が評価減対象年齢未満です。",
		EWD0007: "同日実施日で同一品番が登録されています。",
		WWD0001: "在庫数が０です。",
		WWD0002: "評価減対象年令未満の在庫が存在します。",
		WWD0003: "変更後上代が未指定の品番があります。宜しいですか。",
		WWD0004: "変更後上代が未指定の品番があります。",
		EIG0001: "処理日が過去になっております。",
		EIG0002: "指定したタグコード（{0}）は存在しません。",
		EIG0003: "取込対象外の組織です。",
		EIG0004: "過去月のデータは取り込めません。",
		EIC0001: "店舗通知日({0})は棚卸日({1})以前に設定します。",
		EIC0002: "棚卸日({0})は店舗確定期限日({1})以前に設定します。",
		EIC0003: "店舗確定期限日({0})は本部確定期限日({1})以前に設定します。",
		EIC0004: "開始棚番({0})は終了棚番({1})より前の番号を設定します。",
		EIC0005: "指定した棚番({0})とタグコード({1})は表の中にあります。存在する行に対して棚卸数を修正します。",
		EIC0007: "ロス完了を報告するときは、店長コードを入力します。",
		EIC0008: "店舗通知日({0})は本日以降の日付を設定します。",
		EIC0009: "棚卸で設定する日付({0})の年月が棚卸期({1})と異なります。２ヶ月以内の日付を設定します。",
		EIC0010: "修正理由を入力してください。",
		EIC0011: "指定された店舗・棚卸期の、棚卸状態データがありません。",
		EIC0012: "指定された事業ユニット・棚卸期の、棚卸スケジュールがありません。",
		EIC0013: "指定された棚卸スケジュールは登録済みです。",
		EIC0014: "指定された事業ユニット・棚卸期の棚卸作業は既に完了しています。",
		EIC0015: "棚卸通知日から棚卸日の間({0})でなければ操作できません。",
		EIC0016: "棚卸日の翌日以降({0})でなければ操作できません。",
		EIC0017: "店舗確定日の翌日以降({0})でなければ操作できません。",
		EIC0018: "社員コードが不正です。",
		EIC0019: "棚卸数よりHT読取後売上数を多くすることはできません。",
		EIC0020: "事業ユニット違いの商品は再棚卸数０でのみ登録可能です。",
		EIC0021: "棚卸数がマイナスになるような修正が含まれています。",
		EIC0022: "「棚卸売上修正」登録済のため、「棚番削除」機能は利用できません。<br/>「棚卸確定前修正」機能で修正登録して下さい。",
		EIC0023: "商品マスタにない商品は再棚卸数０でのみ登録可能です。",
		EIC0024: "HT読取後売上数はマイナスにできません。",
		EIC0025: "登録を行う前に、棚卸数取得ボタンを押してください。",
		EIC0026: "一時保存していない在庫据え置き商品を含むページがあります。該当ページを表示して一時保存して下さい。",
		WIC0001: "売上数({0})が棚卸数({1})より多くなっています。",
		WIC0002: "棚卸数が取得されていません",
		EST0001: "センターコードが組織マスタに登録されていません。",
		EST0002: "商品コードが商品マスタに登録されていません。",
		EST0003: "仕入先コードが取引先マスタに登録されていません。",
		EST0004: "不正な区分です。[0]",
		EST0005: "数値項目に数値以外の値が設定されています。",
		EST0006: "不正な日付です。",
		EST0007: "会社コードが組織マスタに登録されていません。",
		EST0008: "部門コードが商品分類マスタに登録されていません。",
		EST0009: "品種コードが商品分類マスタに登録されていません。",
		EST0010: "科目コードが科目マスタに登録されていません。",
		EST0011: "品番が商品マスタに登録されていません。",
		EST0012: "月中速報値と月末確定値が混在しています。",
		EAC0001: "発注日、検収日、勘定日のどれかを指定してください。",
		EAC0002: "期間の指定は、最大400日です。",
		EAC0003: "科目コードが重複しています。",
		EAC0004: "親科目コードがありません。",
		EAC0005: "科目コードと親科目コードが同じです。",
		EAC0006: "出力対象となる取引先数が多すぎます。条件を絞り込んでください。",
		EAC0007: "出力ファイルのレコード数が多すぎます。条件を絞り込んでください。",
		EBR0001: "品種にプライスラインが設定されていません。",
		EBR0002: "指定された組織は組織変更などにより組織コードに変更があったため、組織変更以前の分析はできません。",
		EPO0001: "この生地ＩＤは既に使用されています。",
		EPO0002: "この生地品番は既に使用されています。",
		EPO0003: "この親ブランドＩＤは既に使用されています。",
		EPO0004: "このブランドコードは既に使用されています。",
		EPO0005: "このモデルＩＤは既に使用されています。",
		EPO0006: "スタイル名を入力してください。",
		EPO0007: "生地プライスを入力してください。",
		EPO0008: "付属を入力してください。",
		EPO0009: "分類区分１を指定してください。",
		EPO0010: "分類区分２を指定してください。",
		EPO0011: "オプション名称を入力してください。",
		EPO0012: "適用開始日を入力してください。",
		EPO0013: "スタイルが１件も入力されていません。",
		EPO0014: "スタイル品番が既に使用されています。",
		EPO0015: "オプションコードが既に使用されています。",
		EPO0016: "ブランド({0}：{1})、店舗グループ({2}：{3})が同じ行があります。",
		EPO0017: "ブランドが指定されていません",
		EPO0018: "メーカーが指定されていません",
		EPO0019: "店舗グループが指定されていません",
		EPO0020: "カレンダーが指定されていません",
		EPO0021: "指定されたブランドが存在しません。",
		EPO0022: "指定されたメーカーが存在しません。",
		EPO0023: "指定された店舗グループが存在しません。",
		EPO0024: "指定されたカレンダーが存在しません。",
		EPO0025: "基本金額は、PO種別がシャツの時のみ入力できます。",
		EPO0026: "この店舗グループコードは既に使用されています。",
		EPO0027: "事業ユニットの異なる店舗({0})です。",
		EPO0028: "このPOメーカーコードは既に使用されています。",
		EPO0029: "指定された店舗が存在しません。",
		EPO0030: "店舗着日が入力されていない商品発注日({0})があります。",
		EPO0031: "同じカレンダーＩＤ({0})の列が存在します。",
		EPO0032: "指定されたカレンダーID({0})が存在しません。",
		EPO0033: "カレンダーIDが指定されていません。",
		EPO0034: "同じ商品発注日({0})の行が存在します。",
		EPO0035: "商品発注日が指定されていません。",
		EPO0036: "店舗着日が入力されていない商品発注日({0})があります。",
		EPO0037: "「首回りが51cm～55cmの場合は、ボディ型には「PM7」のみ指定可能です。",
		WPO0038: "閉店日を過ぎた店舗が指定されています。",
		EPO0039: "このオプショングループコードは既に使用されています。",
		EPO0040: "展開サイズは1つ以上選択して下さい。",
		EPO0041: "事業ユニット、ＰＯ種別、生地ＩＤが同じレコードが既に存在します。",
		EPO0042: "この付属は既に使用されています。",
		EPO0043: "対象店舗に１店舗以上指定してください。",
		EPO0044: "オプションは、No、内容、オプション品番、費用区分、適用開始日、適用終了日をセットで指定してください。",
		EPO0045: "オプションは、オプション品番、料金をセットで指定してください。",
		EPO0046: "店舗着日は商品発注日より未来を指定してください。",
		EPO0047: "お渡し日は店舗着日より未来を指定してください。",
		EPO0048: "発注締め時刻前後5分の間は、データの変更はできません。",
		EPO0049: "対象店舗の入力されていない無効な行は削除してください。",
		EPO0050: "発注停止日には明日以降の日付を指定してください。",
		EPO0051: "発注停止日には適用終了日以前の日付を指定してください。",
		EPO0052: "事業ユニット、PO種別の異なる{0}({1}:{2})です。",
		EPO0053: "発注停止日には適用開始日以降の日付を指定してください。",
		EPO0054: "商品発注日は、対象年月内の日付を指定してください。",
		EPO0055: "{0} には、{1} 以降の日付を指定してください。",
		EPO0056: "ブランド{0} の店舗グループ内で店舗が重複しており登録できません。あるブランド内では店舗は一意になる必要があります。",
		EPO0057: "ウォッシャブルを指定している場合は、裾仕上、スペア裾仕上に「ダブル」は指定できません。",
		EPO0058: "ウォッシャブルを指定している場合は指定できません。",
		EPO0059: "オプションの適用期間は、オプショングループの適用期間内の日付を指定して下さい。",
		EPO0060: "この店舗、ブランド、生地の組み合わせでは発注できません。",
		EPO0061: "ジャケット/スカート/パンツ/ベストのどれかはモデルを指定して下さい。",
		EPO0062: "過去分の登録でない時は過去日は指定できません。",
		EPO0063: "オプションは、No、内容、オプション品番、料金（税込）（円）、適用開始日、適用終了日をセットで指定してください。",
		EPO0064: "オプションが１件も入力されていません。",
		EPO0065: "対象月内で商品発注日を指定していない日付があります。確認して下さい。",
		EPO0066: "前月以前のカレンダーは更新できません。",
		EPO0067: "送信済のデータなので変更処理はできません。",
		EPO0068: "4行まで入力可能です。",
		WPO0069: "複製してそのままの状態で登録しようとしています。このまま登録して良いですか？",
		EPO0070: "店舗、ブランド、生地、商品発注日に対応する店舗着日がありません。",
		EPO0071: "店舗着日は商品発注日以降を指定してください。",
		EPO0072: "お渡し日は店舗着日以降を指定してください。",
		EPO0073: "指定の{0}は、発注停止されているため選択できません。",
		EPO0074: "指定された発注はメール送信済みのため編集・削除はできません。一覧に戻るボタンをクリックしてPO発注一覧でご確認下さい。",
		EPO0075: "次の項目が発注停止になっています。発注可能なものを選択して下さい。",
		EPO0076: "17:00を過ぎたため指定された店舗着日で登録できませんでした。編集画面に戻るボタンをクリックして発注登録画面に戻って新しい店舗着日にしてから登録して下さい。",
		EPO0077: "発注登録はOASYSで行ってください。",
		EEQ0001: "備品マスタ（{0}）が参照しているため、備品取引先マスタを削除出来ません。",
		EEQ0002: "単価（{0}）には０より大きい値を設定します。",
		EEQ0003: "箱入数（{0}）には０より大きい値を設定します。",
		EEQ0004: "最大発注箱数（{0}）には０以上の値を設定します。",
		EEQ0005: "リードタイム（{0}）が０より大きい値を設定します。",
		EEQ0006: "随時がチェックされていない場合は、発注サイクル、発注締めタイミング、リードタイムは必須です。",
		EEQ0007: "発注箱数（{0}）には０以上の値を設定します。",
		EEQ0008: "既に締め処理が実行されていました。検索ボタンをクリックして再度ご確認ください。",
		EEQ0009: "発注箱数（{0}）には最大発注箱数（{1}）以下の値を設定します。",
		EEQ0010: "最大発注数量（{0}）以下の値を設定します。",
		EEQ0011: "発注を締め切りました。登録する場合は発注日を次の日にして入力してください。",
		EEQ0012: "棚卸日が重複しています。別の日付を設定します。",
		EEQ0013: "箱数（{0}）には０以上の値を設定します。",
		EEQ0014: "バラ数（{0}）には０以上の値を設定します。",
		EEQ0015: "店長IDを入力して、棚卸完了をクリックしてください。",
		EEQ0016: "備品の時は、定時は必須です。",
		EEQ0017: "備品の発注日が決定できません。",
		WEQ0001: "発注締めが１つも選択されていませんので、締め処理は実行しません。",
		WEQ0002: "{0}日内に発注しています。",
		ESI0001: "対象期間には400日を超えない期間を指定してください。（現在 {0}日間）",
		ESI0002: "詳細条件のどれか1つは指定してください。",
		ESI0003: "最低１件のタグコードは指定してください。",
		ESI0004: "同一コードのタグコードが入力されています。",
		ESI0005: "検索結果が最大件数（{0}件）を超えています。条件を追加してください。",
		ECP0001: "プライス別棚卸のHT読込結果を指定してください。",
		ECP0002: "商品属性の値には{0}個まで指定してください。",
		ECP0003: "プライスを設定してください。",
		ECP0004: "プライス({0})が０以下です。",
		ECP0005: "数量({0})が０以下です。",
		ECP0006: "変更されている項目があります。登録完了後に再度出力して下さい。",
		ETS0001: "出荷店と入荷店が同一です。",
		ETS0002: "同一の品番が指定されています。",
		ETS0003: "在庫数以上の指示数量が登録されています。",
		ETS0004: "出荷店と入荷店の事業ユニットが異なります。",
		EEP0001: "入力区分(1:売上高, 2:経準率, 3: 経準高, 4: 営業利益高, 5: 営業利益率)は必須です。",
		EEP0002: "入力区分(1:売上高, 2:経準率, 3: 経準高, 4: 営業利益高, 5: 営業利益率)の指定行は1つだけ指定してください。",
		EEP0003: "指定された適用開始日よりも未来の科目マスタが既に登録済みです。",
		ECM0001: "ログインコードまたはパスワードが違います。",
		ECM0002: "ユーザコードと一致する社員コードが存在しません。",
		ECM0003: "パスワードが違います。",
		ECM0004: "旧パスワードと異なるパスワードを入力してください。",
		ECM0005: "新パスワードを再度入力してください。",
		ECM0006: "申請ルートIDが重複しています。",
		ECM0007: "申請者と承認者に同じユーザを指定することはできません。",
		ECM0008: "指定された業務に必要な承認者が不足しています。",
		ECM0009: "第一承認者、第二承認者、第三承認者に同じユーザを指定することはできません。",
		ECM0010: "{0}行目に申請ユーザコードが同じ行が存在しています。",
		ECM0011: "パスワードは６文字以上の英数字を入力してください。",
		ECM0012: "英字のみ・数字のみのパスワードは不可です。英数字が混在したパスワードを入力してください。",
		ECM0013: "権限が重複しています。",
		ECM0014: "中分類を設定してください。中分類を作成しない場合は(中分類なし)を選択してください。",
		ECM0015: "画面名を設定してください。",
		ECM0016: "大分類が重複しています。",
		ECM0017: "中分類が重複しています。",
		ECM0018: "画面が重複しています。",
		ECM0019: "設定した所属組織の数が設定可能な最大値を超えています。",
		ECM0020: "設定した権限の数が設定可能な最大値を超えています。",
		ECM0021: "店舗ユーザ情報を編集することはできません。",
		ECM0022: "店舗ユーザ情報を予約取消することはできません。",
		ECM0023: "店舗ユーザ情報を削除することはできません。",
		ECM0024: "このコードに対応する社員のユーザアカウントは既に作成されています。",
		ECM0025: "承認・差戻しを行う権限がありません。",
		ECM0026: "メニュー名が重複しています。",
		ECM0027: "承認・差戻しはできません。",
		ECM0028: "相手店舗コードが指定されていません。",
		ECM0029: "相手店舗コードが不正です。",
		ECM0030: "JANコード／タグコードが不正です。",
		ECM0031: "明細データがありません。",
		ECM0032: "担当者が指定されていません。",
		ECM0033: "担当者コードが不正です。",
		ECM0034: "ファイルフォーマットが不正です。",
		ECM0035: "JANコード／タグコードが指定されていません。",
		ECM0036: "取引先コードが指定されていません。",
		ECM0037: "取引先コードが不正です。",
		ECM0038: "伝票のキーが重複しています。",
		ECM0039: "伝票番号が不正です。",
		ECM0040: "対応する伝票がありません。",
		ECM0041: "サーバエラーが発生しました。",
		ECM0042: "社員コードを持たないユーザを登録する場合、担当組織を必ず設定してください。",
		ECM0043: "店長ユーザを登録する場合、担当組織（店舗）を必ず設定してください。",
		ECM0044: "異なる事業ユニットのJANコード／タグコードが指定されています。",
		ECM0045: "既に取り込み済みの伝票番号です。",
		EGA0001: "購入会員集計用領域の確保に失敗しました。絞込条件を追加してください。",
		EGA0002: "軸要素数が最大値を超えています。",
		EGA0003: "集計最大セル数を超えています。{0}",
		EGA0004: "表示最大セル数を超えています。{0}",
		EGA0005: "表示項目を１つ以上指定してください",
		EGA0006: "計算式が正しくありません。",
		EGA0007: "セルの数が最大値を超えています。{0}",
		EGA0008: "指定された店舗リストは削除されています。",
		EGA0009: "指定された商品リストは削除されています。",
		EGA0010: "指定された会員リストは削除されています。",
		EGA0011: "指定された住所リストは削除されています。",
		EGA0012: "指定された組織リストの組織階層が店舗検索日では有効ではありません。",
		EGA0013: "指定された商品リストの商品分類階層が商品検索日では有効ではありません。",
		EGA0014: "閾値条件を指定してください",
		EGA0015: "縦軸の要素数がEXCEL出力が最大値を超えています。{0}",
		EGA0016: "横軸の要素数がEXCEL出力が最大値を超えています。{0}",
		EGA0017: "絞込条件により対象となる軸の要素数がゼロになりました。",
		EGA0018: "配下に要素があるため削除できません",
		EGA0019: "軸条件を指定してください。",
		EGA0020: "表示項目を指定してください",
		EGA0021: "期間対比で日付軸を指定することはできません。",
		EGA0022: "登録場所が既に削除されています。",
		EGA0023: "任意条件で利用されているため削除できません。",
		EGA0024: "任意条件で利用されているため削除できません。",
		EGA0025: "検索結果が多ぎます。絞込条件を追加してください。",
		EGA0026: "在庫日数を表示する場合は、売上数も指定してください。",
		EGA0027: "CSVテキストファイルではありません。",
		EGA0028: "ABC分析では、「ランク」表示項目を必ず指定してください。",
		EGA0029: "ABC分析基準が売上高の場合、「売上高(税抜)順位」表示項目を必ず指定してください。",
		EGA0030: "ABC分析基準が売上数の場合、「売上数順位」表示項目を必ず指定してください。",
		EGA0031: "ABC分析基準が支持率(選択期間内)の場合、「支持率(選択期間内)順位」表示項目を必ず指定してください。",
		EGA0032: "ABC分析基準が支持率(累計)の場合、「支持率(累計)順位」表示項目を必ず指定してください。",
		EGA0033: "貼付位置の指定は、ExcelのA1形式で入力してください。",
		EGA0034: "貼付位置の右下の設定が、左上より左、又は右に設定されています。",
		EGA0035: "チラシ折込日が画面指定の対象チラシ折込日と異なります。",
		EGA0036: "指定した対象週範囲外の日付です。",
		EGA0037: "店舗コードが({0})行目と同じです。",
		EGA0038: "チラシ折込日は対象日付(終了)までの日付を指定してください。",
		EGA0039: "同じセール管理番号では、本年・前年・表示セールタイトルは同じにしてください。",
		EGA0040: "会員リスト機能は顧客分析の権限が無い方は利用できません。",
		EGA0041: "顧客カタログ機能は顧客分析の権限が無い方は利用できません。",
		EGA0042: "対象セールスNoは1-20を指定してください。",
		EGA0043: "対象店舗に１店舗以上指定してください。",
		_eof: "clmsg//"
	});

});

/**
 * ORIGINAL clcom.js
 */

/*
 * 変数の命名ルール
 * 種類											規則									例
 * -------------------------------------------------------------------
 * インデント 2 タブなし
 * コンストラクタ						大文字から始める				Member
 * 定数扱いの変数						すべて大文字とする				CONFIG
 * コレクション（配列など）		複数形とする					members, $messages
 * jQueryオブジェクト			先頭に$を付ける					$target
 * HTML文字列							末尾に_htmlとつける				target_html
 * プライベート扱いの変数		先頭に_を付ける(オブジェクトのメンバのみ)				  _id, _counter
 */

var clcom = {};
var clutil = {};

// AOKI
// underscore.js 独自拡張
if (!_.isFunction(_.isNullOrUndefined)) {
	/**
	 * null か undefined の場合は true を返す。
	 */
	_.isNullOrUndefined = function(o) {
		return _.isUndefined(o) || _.isNull(o);
	};
}

var _clInternalErrorHandler = function (message) {
  clutil._setErrorHeader($('.cl_echoback'), message);
};

jQuery.ajaxSetup({
	timeout: 60000
});

(function () {
  //IEでは、[console]が使えないので、回避するためのおまじない
  if (typeof window.console != 'object'){
	window.console = {log:function(){},debug:function(){},info:function(){},warn:function(){},error:function(){},assert:function(){},dir:function(){},dirxml:function(){},trace:function(){},group:function(){},groupEnd:function(){},time:function(){},timeEnd:function(){},profile:function(){},profileEnd:function(){},count:function(){}};
  } else if (typeof window.console.debug != 'object') {
	window.console.debug = function(){};
  }
  //IEでは、[console]が使えないので、回避するためのおまじない

  //IE8では、[indexOf]が使えないので、回避するためのおまじない
  if (!Array.prototype.indexOf)
  {
    Array.prototype.indexOf = function(elt /*, from*/)
    {
      var len = this.length;

      var from = Number(arguments[1]) || 0;
      from = (from < 0)
           ? Math.ceil(from)
           : Math.floor(from);
      if (from < 0)
        from += len;

      for (; from < len; from++)
      {
        if (from in this &&
            this[from] === elt)
          return from;
      }
      return -1;
    };
  }
  //IE8では、[indexOf]が使えないので、回避するためのおまじない

  var store = window.store;

  function getPageId(pathname) {
	var pageId = (pathname.split('/').pop() || '').split('.').shift() || '';
	if(_.isEmpty(pageId)){
		pageId = '/';
	}
	return pageId;
  }

  /** ルート取得 */
  var _getUrlRoot = function(){
	if(location.protocol == "file:"){
	  var path = location.pathname.replace(/\/WebContent\/.*/, "/WebContent");
	  var url = location.protocol + "//" + path;
	  return url;
	}else{
	  return location.protocol + "//" + location.host;
	}
  };

  /*
   * セッション情報について
   * 認証がされていれば、クッキーに以下の値が設定されるものとする。
   *  1) JSESSIONID	 -- これは tomcat が払い出す文字列
   *  2) extra -- ログイン成功時に払いだす値。
   *  extra は、以下のオブジェクト構造を JSON.stringify() したものとする。
   *  {
   *	uid: ユーザID,
   *	mid: ログインメールID,
   *	addr: 個人情報サーバアドレス（ローカルIPアドレス）
   *	lang: 'ja' とか, 'en' とか・・・
   *  }
   */

  /** 共通情報 */
  _.extend(clcom, {

	/** ルート */
	urlRoot: _getUrlRoot(),

	/** Storage プレフィックス */
	storagePrefix: 'clcom.',

	/** AOKI
	 * ストレージに値の有無を確認する。
	 */
	hasStorageKey: function(key, prefix) {
		var fixedKey;
		if (_.isString(prefix)) {
			fixedKey = prefix + key;
		} else {
			fixedKey = clcom.storagePrefix + key;
		}
		if (_.isEmpty(fixedKey)) {
			// キーが空欄 or null or undefined
			return false;
		}
		var store = window.store;
		var val = store.get(fixedKey);
		return !_.isNullOrUndefined(val);
	},

	/** 権限テーブルをローカルストレージに保存する。
	 * @param {Array} procperm 権限テーブル(loginレスポンス の procperm)
	 */
	setCertificationTable: function (procperm) {
	  var store = window.store,
		  key = clcom.storagePrefix + 'procperm',
		  table = _.reduce(procperm, function (memo, item) {
			memo[item.code] = item.perm;
			return memo;
		  }, {});

	  store.set(key, table);
	},
	/**
	 * 権限テーブルをローカルストレージから削除する。
	 */
	removeCertificationTable: function() {
	  var key = clcom.storagePrefix + 'procperm';
	  var store = window.store;
	  return store.remove(key);
	},

	/** AOKI
	 * 区分テーブルをローカルストレージに保存する。
	 * @param {Array} typelist 区分リスト
	 * @param {Array} cdnamelist コード名称リスト
	 * @param {Array} staffcdnamelist 社員コード名称リスト
	 */
	setTypeList: function (typelist, cdnamelist, staffcdnamelist, pagetype) {
	  var pageType = pagetype == null ? clcom.getPageType() : pagetype;
	  clcom.removeTypeList();
	  var store = window.store;
	  // 区分リスト
	  var key = clcom.storagePrefix + pageType + 'typelist';
	  store.set(key, typelist);
	  // コード名称リスト
	  key = clcom.storagePrefix + pageType + 'cdnamelist';
	  store.set(key, cdnamelist);
	  // 社員コード名称リスト
	  key = clcom.storagePrefix + pageType + 'staffcdnamelist';
	  store.set(key, staffcdnamelist);
	},
	/**
	 * AOKI
	 * 区分テーブルをローカルストレージから削除する。
	 */
	removeTypeList: function() {
	  var key = clcom.storagePrefix + clcom.getPageType() + 'typelist';
	  var store = window.store;
	  // 区分リスト
	  store.remove(key);
	  // コード名称リスト
	  key = clcom.storagePrefix + clcom.getPageType() + 'cdnamelist';
	  store.remove(key);
	  // 社員コード名称リスト
	  key = clcom.storagePrefix + clcom.getPageType() + 'staffcdnamelist';
	  store.remove(key);
	},

	/**
	 * AOKI
	 * 区分テーブルをローカルストレージから取得する。
	 */
	getTypeList: function() {
	  // 区分リスト
	  var key = clcom.storagePrefix + clcom.getPageType() + 'typelist';
	  return store.get(key);
	},
	getCdNameList: function() {
	  // コード名称リスト
	  var key = clcom.storagePrefix + clcom.getPageType() + 'cdnamelist';
	  return store.get(key);
	},
	getStaffCdNameList: function() {
	  // 社員コード名称リスト
	  var key = clcom.storagePrefix + clcom.getPageType() + 'staffcdnamelist';
	  return store.get(key);
	},

	/** AOKI
	 * メニュー情報をローカルストレージに保存する。
	 * @param {Array} menustore メニュー情報
	 */
	setMenuStore: function (menustore) {
	  clcom.removeMenuStore();
	  var store = window.store;
	  var key = clcom.storagePrefix + 'menustore';
	  store.set(key, menustore);
	},

	/**
	 * AOKI
	 * メニュー情報をローカルストレージから削除する。
	 */
	removeMenuStore: function() {
	  var key = clcom.storagePrefix + 'menustore';
	  var store = window.store;
	  store.remove(key);
	},

	/**
	 * AOKI
	 * メニュー情報をローカルストレージから取得する。
	 */
	getMenuStore: function() {
	  var key = clcom.storagePrefix + 'menustore';
	  return store.get(key);
	},

	/** AOKI
	 * 権限テーブルをローカルストレージに保存する。
	 * @param {Array} funclist 権限リスト
	 */
	setFuncList: function (funclist) {
	  clcom.removeFuncList();
	  var store = window.store;
	  var key = clcom.storagePrefix + 'funclist';
	  store.set(key, funclist);
	  clutil.setFuncGrp(funclist);
	},

	/**
	 * AOKI
	 * 権限テーブルをローカルストレージから削除する。
	 */
	removeFuncList: function() {
	  var key = clcom.storagePrefix + 'funclist';
	  var store = window.store;
	  store.remove(key);
	  key = clcom.storagePrefix + 'funcgrp';
	  store.remove(key);
	},

	/**
	 * AOKI
	 * 権限テーブルをローカルストレージから取得する。
	 */
	getFuncList: function() {
	  var key = clcom.storagePrefix + 'funclist';
	  return store.get(key);
	},
	getFuncGrp: function() {
	  var key = clcom.storagePrefix + 'funcgrp';
	  return store.get(key);
	},

	/** AOKI
	 * 役職区分を保存する。
	 * @param {Array} jobpostlist 役職区分リスト
	 */
	setJobpostList: function (jobpostlist) {
	  clcom.removeJobpostList();
	  var store = window.store;
	  var key = clcom.storagePrefix + 'jobpost';
	  store.set(key, jobpostlist);
	},

	/**
	 * AOKI
	 * 役職区分をローカルストレージから削除する。
	 */
	removeJobpostList: function() {
	  var key = clcom.storagePrefix + 'jobpost';
	  var store = window.store;
	  store.remove(key);
	},

	/**
	 * AOKI
	 * 役職区分をローカルストレージから取得する。
	 */
	getJobpostList: function() {
	  var key = clcom.storagePrefix + 'jobpost';
	  return store.get(key);
	},


	/** AOKI
	 * 分析初期情報を保存する。
	 * @param {Array} item_attr_list 商品属性条件リスト
	 * @param {Array} memb_attr_list 顧客属性条件リスト
	 * @param {Array} staff_attr_list 社員属性条件リスト
	 * @param {Array} fromto_list 分析範囲条件リスト
	 * @param {Array} period_list 分析期間リスト
	 * @param {Array} tran_attr_list 売上属性条件リスト
	 * @param {Array} dm_attr_list DM属性条件リスト
	 * @param {Array} item_spec_list 商品仕様条件リスト
	 * @param {Array} priceline_list プライスラインリスト(POS元上代)
	 * @param {Array} priceline_m_list プライスラインリスト
	 */
	setAnaprocInit: function (
			item_attr_list,
			memb_attr_list,
			staff_attr_list,
			fromto_list,
			period_list,
			tran_attr_list,
			dm_attr_list,
			item_spec_list,
			priceline_list,
			priceline_m_list,
			priceline_sl_list,
			priceline_sl_m_list) {
	  clcom.removeAnaprocInit();

	  var store = window.store;
	  var key = clcom.storagePrefix + 'item_attr_list';
	  store.set(key, item_attr_list);
	  var key = clcom.storagePrefix + 'memb_attr_list';
	  store.set(key, memb_attr_list);
	  var key = clcom.storagePrefix + 'staff_attr_list';
	  store.set(key, staff_attr_list);
	  var key = clcom.storagePrefix + 'period_list';
	  store.set(key, period_list);
	  var key = clcom.storagePrefix + 'tran_attr_list';
	  store.set(key, tran_attr_list);
	  var key = clcom.storagePrefix + 'dm_attr_list';
	  store.set(key, dm_attr_list);
	  var key = clcom.storagePrefix + 'item_spec_list';
	  store.set(key, item_spec_list);
	  var key = clcom.storagePrefix + 'priceline_list';
	  store.set(key, priceline_list);
	  var key = clcom.storagePrefix + 'priceline_m_list';
	  store.set(key, priceline_m_list);
	  var key = clcom.storagePrefix + 'priceline_sl_list';
	  store.set(key, priceline_sl_list);
	  var key = clcom.storagePrefix + 'priceline_sl_m_list';
	  store.set(key, priceline_sl_m_list);

	  // 範囲条件を作成

	  // 種別でハッシュを作成
	  var kindhash = {};
	  for (var i = 0; i < fromto_list.length; i++) {
		  var fromto = fromto_list[i];
		  if (kindhash[fromto.kind] == null) {
			  kindhash[fromto.kind] = [];
		  }
		  kindhash[fromto.kind].push(fromto);
	  }
	  var fromtohash = {};
	  $.each(kindhash, function(key, value) {
		  // 各種別毎に属性でハッシュを作成
		  var kindlist = kindhash[key];
		  var attrhash = {};
		  for (var i = 0; i < kindlist.length; i++) {
			  var kind = kindlist[i];
			  if (attrhash[kind.attr] == null) {
				  attrhash[kind.attr] = [];
			  }
			  attrhash[kind.attr].push(kind);
		  }
		  fromtohash[key] = attrhash;
	  });

	  var key = clcom.storagePrefix + 'fromtolist';
	  store.set(key, fromtohash);
	},

	/**
	 * AOKI
	 * 分析初期情報をローカルストレージから削除する。
	 */
	removeAnaprocInit: function() {
	  var store = window.store;
	  var key = clcom.storagePrefix + 'item_attr_list';
	  store.remove(key);
	  var key = clcom.storagePrefix + 'memb_attr_list';
	  store.remove(key);
	  var key = clcom.storagePrefix + 'staff_attr_list';
	  store.remove(key);
	  var key = clcom.storagePrefix + 'fromtolist';
	  store.remove(key);
	  var key = clcom.storagePrefix + 'period_list';
	  store.remove(key);
	  var key = clcom.storagePrefix + 'tran_attr_list';
	  store.remove(key);
	  var key = clcom.storagePrefix + 'dm_attr_list';
	  store.remove(key);
	  var key = clcom.storagePrefix + 'item_spec_list';
	  store.remove(key);
	  var key = clcom.storagePrefix + 'priceline_list';
	  store.remove(key);
	  var key = clcom.storagePrefix + 'priceline_m_list';
	  store.remove(key);
	  var key = clcom.storagePrefix + 'priceline_sl_list';
	  store.remove(key);
	  var key = clcom.storagePrefix + 'priceline_sl_m_list';
	  store.remove(key);
	},

	/**
	 * AOKI
	 * 分析初期情報:商品属性条件リストをローカルストレージから取得する。
	 */
	getItemAttrList: function() {
	  var key = clcom.storagePrefix + 'item_attr_list';
	  return store.get(key);
	},
	/**
	 * AOKI
	 * 分析初期情報:商品仕様条件リストをローカルストレージから取得する。
	 */
	getItemSpecList: function() {
	  var key = clcom.storagePrefix + 'item_spec_list';
	  return store.get(key);
	},
	/**
	 * AOKI
	 * 分析初期情報:プライスラインリストをローカルストレージから取得する。
	 */
	getPricelineList: function() {
	  var key = clcom.storagePrefix + 'priceline_list';
	  return store.get(key);
	},
	// マスタ上代用
	getPricelineMList: function() {
	  var key = clcom.storagePrefix + 'priceline_m_list';
	  return store.get(key);
	},
	// 営業部
	getPricelineSlList: function() {
	  var key = clcom.storagePrefix + 'priceline_sl_list';
	  return store.get(key);
	},
	// 営業部
	getPricelineSlMList: function() {
	  var key = clcom.storagePrefix + 'priceline_sl_m_list';
	  return store.get(key);
	},
	/**
	 * AOKI
	 * 分析初期情報:顧客属性条件リストをローカルストレージから取得する。
	 */
	getMembAttrList: function() {
	  var key = clcom.storagePrefix + 'memb_attr_list';
	  return store.get(key);
	},
	/**
	 * AOKI
	 * 分析初期情報:社員属性条件リストをローカルストレージから取得する。
	 */
	getStaffAttrList: function() {
	  var key = clcom.storagePrefix + 'staff_attr_list';
	  return store.get(key);
	},
	/**
	 * AOKI
	 * 分析初期情報:DM属性条件リストをローカルストレージから取得する。
	 */
	getDMAttrList: function() {
	  var key = clcom.storagePrefix + 'dm_attr_list';
	  return store.get(key);
	},
	/**
	 * AOKI
	 * 分析初期情報:分析範囲条件リストをローカルストレージから取得する。
	 */
	getFromToList: function(kind, attr) {
	  var key = clcom.storagePrefix + 'fromtolist';
	  var fromtolist = store.get(key);
	  var kindhash = fromtolist[kind];
	  if (kindhash != null) {
		  return kindhash[attr];
	  } else {
		  return [];
	  }
	},
	/**
	 * AOKI
	 * 分析初期情報:売上属性条件リストをローカルストレージから取得する。
	 */
	getTranAttrList: function() {
	  var key = clcom.storagePrefix + 'tran_attr_list';
	  return store.get(key);
	},

	/** AOKI
	 * 事業ユニット情報を保存する。
	 * @param {Integer} 8桁の運用日
	 */
	setBuinfo: function (buinfo) {
	  clcom.removeBuinfo();
	  var store = window.store;
	  var key = clcom.storagePrefix + 'buinfo';
	  store.set(key, buinfo);
	},

	/**
	 * AOKI
	 * 事業ユニット情報をローカルストレージから削除する。
	 */
	removeBuinfo: function() {
	  var key = clcom.storagePrefix + 'buinfo';
	  var store = window.store;
	  store.remove(key);
	},

	/**
	 * AOKI
	 * 事業ユニット情報をローカルストレージから取得する。
	 */
	getBuinfo: function() {
	  var key = clcom.storagePrefix + 'buinfo';
	  return store.get(key);
	},

	/**
	 * AOKI
	 * 分析初期情報:分析期間リストをローカルストレージから取得する。
	 */
	getPeriodList: function() {
	  var key = clcom.storagePrefix + 'period_list';
	  return store.get(key);
	},

	/**
	 * AOKI
	 * 分析初期情報:分析期間リストをローカルストレージから取得する。
	 */
	getPastYears: function() {
	  var key = clcom.storagePrefix + 'period_list';
	  var plist = store.get(key);
	  var minyear = 0;
	  if( plist != null ){
		var i;
		for( i=0; i < plist.length; i++ ){
			if( minyear == 0 || plist[0].year < minyear )
				minyear = plist[0].year;
		}
	  }
	  var ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');
	  var result =  ope_year - minyear;
	  return (result > 0 ? result : 10);
	},
	getFutureYears: function() {
	  var key = clcom.storagePrefix + 'period_list';
	  var plist = store.get(key);
	  var maxyear = 0;
	  if( plist != null ){
		var i;
		for( i=0; i < plist.length; i++ ){
			if( plist[0].year > maxyear )
				maxyear = plist[0].year;
		}
	  }
	  var ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');
	  var result =  maxyear - ope_year;
	  return (result > 0 ? result : 0);
	},

	/**
	 * 分析画面の場合"an"
	 * ノーサイン画面の場合"cu"を返す
	 */
	getPageType: function() {
		return clcom.pageId.substr(0, 2) == "CU" ? "cu" : "an";
	},

	/** APIのパス */
	apiRoot: _getUrlRoot() + "/system/api",
	//apiRoot: _getUrlRoot() + "/api",

	/** AOKI appのパス */
	appRoot: _getUrlRoot() + "/system/app",

	getPageIdFromPath: getPageId,

	/** 当該ページのID: 当該ページが foo.html ならば、pageIdは 'foo' */
	pageId: getPageId(location.pathname),

	// 当該ページのタイトル
	pageTitle: document.title,	// TODO DBから取得する

	// 画面遷移パラメタ(clcom定義の下で設定しています)
	pageArgs : undefined,

	// popPage でもどってきた場合、pushPage で保存されたデータが設定される
	pageData: undefined,

	// popPage でもどってきた場合、どこから戻ってきたを設定(ID)
	dstId: undefined,

	// popPage でもどってきた場合、どこから戻ってきたを設定(URL)
	dstUrl: undefined,

	// popPage でもどってきた場合、リターン値が設定される
	returnValue: undefined,

	// 遷移前ページID
	srcId: undefined,

	// 遷移前ページURL
	srcUrl: undefined,

	// AOKI:ページ内レコード数
	itemsOnPage: 10,

	// 編集領域に表示可能な要素数
	list_max: 1000,

	// AOKI:テーブルスクロール用高さ
	fixedHeaderTableHeight: 300,

	// 運用日
	ope_date : 0,

	// 最終日付(固定)
	max_date : 20701231
	,

	// 最小日付(固定)
	min_date: 19900102,

	// 条件表示文字数制限
	focusStr_max: 100,

	/** AOKI
	 * 運用日を保存する。
	 * @param {Integer} 8桁の運用日
	 */
	setOpeDate: function (ope_date) {
	  clcom.removeOpeDate();
	  var store = window.store;
	  var key = clcom.storagePrefix + 'opedate';
	  store.set(key, ope_date);
	},

	/**
	 * AOKI
	 * 運用日をローカルストレージから削除する。
	 */
	removeOpeDate: function() {
	  var key = clcom.storagePrefix + 'opedate';
	  var store = window.store;
	  store.remove(key);
	},

	/**
	 * AOKI
	 * 運用日をローカルストレージから取得する。
	 */
	getOpeDate: function() {
	  var key = clcom.storagePrefix + 'opedate';
	  return store.get(key);
	},

	// int型最大値
	int_max : 2147483647,

	/**
	 * ブラウザの状態を取得する
	 */
	onMobile	: 0,
	onPC		: 1,

	getAgent: function() {
		var agent = navigator.userAgent;

		if(agent.search(/iPhone/) != -1) {
			return clcom.onMobile;
		} else if(agent.search(/iPad/) != -1) {
			return clcom.onMobile;
		} else if(agent.search(/Android/) != -1) {
			return clcom.onMobile;
		} else {
			return clcom.onPC;
		}
	},

	chkIEAgent: function(validator) {
		// ブラウザチェック
		var userAgent = window.navigator.userAgent;
		// IE以外の場合はエラー
		if(userAgent.match(/MSIE/) || userAgent.match(/Trident/) ) {
			return true;
		}
		if (validator != null) {
			validator.setErrorInfo({_eb_: clmsg.cl_cng_IE});
		}

		return false;
	},

	/** AOKI
	 * ユーザ情報
	 * ノーサイン：本部・店舗フラグを保存する。
	 * navi_date = true:店舗, false:本部
	 */
	setUserData: function (userData, pagetype) {
	  var pageType = pagetype == null ? clcom.getPageType() : pagetype;
	  clcom.removeUserData(pageType);
	  var store = window.store;
	  var key = clcom.storagePrefix + pageType + 'userdata';
	  store.set(key, userData);
	},

	/**
	 * AOKI
	 * ユーザ情報
	 * ノーサイン：本部・店舗フラグをローカルストレージから削除する。
	 */
	removeUserData: function(pagetype) {
	  var pageType = pagetype == null ? clcom.getPageType() : pagetype;
	  var key = clcom.storagePrefix + pageType + 'userdata';
	  var store = window.store;
	  store.remove(key);
	},

	/**
	 * AOKI
	 * ユーザ情報
	 * ノーサイン：本部・店舗フラグをローカルストレージから取得する。
	 */
	getUserData: function(pagetype) {
	  var pageType = pagetype == null ? clcom.getPageType() : pagetype;
	  var key = clcom.storagePrefix + pageType + 'userdata';
	  return store.get(key);
	},



	his_list	: [],
	//閲覧履歴の上限数
	his_list_max : 20,

	/** AOKI
	 * 閲覧履歴を保存する。
	 *
	 * set_data = {
	 * 		memb_id : memb_id,
	 * 		memb_cd : memb_cd
	 * }
	 * f_upd = 情報更新フラグ(true)
	 */
	setHisList: function (set_data, f_upd) {
		//リスト取得
		var his_list = clcom.getHisList();

		//リスト最大数設定
		if(his_list == null){
			his_list[0] = set_data;
			return;
		}
		else if(his_list.length < clcom.his_list_max){
			hisLen = his_list.length;
		}
		else {
			hisLen = clcom.his_list_max;
		}

		//	重複確認
		for(var i = 0; i < hisLen; i++){
			var data = his_list[i];
//
			if(data.memb_id == set_data.memb_id){
			//既存リストに重複があった場合
				if(i == 0) {
					if(f_upd == true){
						//情報更新ならデータ入れ替え
						his_list[0] = set_data;
						//上書き登録
						var store = window.store;
						var key = clcom.storagePrefix + 'hisList';
						store.set(key, his_list);
					}
					return
				}
				else{
					//重複が出たところまでを入れ替える
					his_list = clcom.moveHisList(his_list, i);
					if(f_upd == true){
						//情報更新ならデータ入れ替え
						his_list[0] = set_data;
						//上書き登録
						var store = window.store;
						var key = clcom.storagePrefix + 'hisList';
						store.set(key, his_list);
					}
					else{
						//その他なら順序のみ入れ替え
						his_list[0] = data;
					}
					break;
				}
			}
		}

		if(i == hisLen){
			//重複がなかった場合
			//全てを入れ替える
			his_list = clcom.moveHisList(his_list, hisLen);
			his_list[0] = set_data;
		}

		//上書き登録
		var store = window.store;
		var key = clcom.storagePrefix + 'hisList';
		store.set(key, his_list);

	},


	/**
	 * AOKI
	 * 閲覧履歴をずらす。
	 *
	 * list :リスト
	 * num :リスト最大数
	 *
	 */
	moveHisList: function(list, num) {
		//返り値用の配列作成
		var cp_list = [];

		for(var i = 0; i < num; i++){
			if(i == (clcom.his_list_max-1)){
				//最大数に達したらループから抜ける
				break;
			}
			//1つずらしてコピー
			cp_list[i+1] = list[i];
		}

		//重複があった場合は、重複分を抜いてコピー
		if(i < list.length){
			for(var i = num+1 ; i < list.length; i++){
				cp_list[i] = list[i]
			}
		}

		return cp_list;
	},


	/**
	 * AOKI
	 * 閲覧履歴を取得する。
	 */
	getHisList: function() {
	  var key = clcom.storagePrefix + 'hisList';

	  var getData = store.get(key);

	  if(getData == null) {
		  var sendData = clcom.his_list;
	  }
	  else {
		  var sendData = getData;
	  }

	  return sendData;
	},

	/**
	 * AOKI
	 * 閲覧履歴を削除する
	 */
	removeHisList: function() {
		  var key = clcom.storagePrefix + 'hisList';
		  var store = window.store;
		  store.remove(key);
	},



	//////////////////////////////////////////////////////////////////////
	// 関数

	/**
	 * ページの状態をページスタックにつみ、ページ遷移する
	 * @param {String} url 遷移先ページURL
	 * @param {Mixed} args 遷移先ページへの引数
	 * @param {Mixed} data 保存データ
	 */
	pushPage: function (url, args, data) {},

	/**
	 * ページスタックのトップのページに戻る。スタックは1つ減る
	 *
	 * @param {Mixed} returnValue リターン値
	 * @param {Integer} n いくつ戻るか
	 */
	popPage: function (returnValue, n) {},

	/**
	 * pushPage の別名(とりあえず)
	 */
	transfer: function (url, args, data) {},

	/**
	 * ローカルに保存しているアプリ情報を削除する
	 * ログアウトやセッション期限切れ等の後処理で呼び出す。
	 * TODO:この関数は何に使うか帰山さんに確認
	 */
	destroyStoredValues: function() {
	  // ストレージ全部破棄
	  store.clear();

	  // クッキー破棄 - キー[extra]
	  // 有効期限切れな expire日時をセットするとクッキーが削除される。
	  //					  authInfo: {
	  //							  JSESSIONID: '123456789qwertyuiop',			  // tomcat のセッションID - 放置
	  //							  extra: encodeURI(JSON.stringify({uid:1,mid:'100',addr:'10.10.10.1'}));
	  //									  // ↑extraは、{ uid:ユーザID, mid:ログインメールID, addr:サーバアドレス }
	  //							  lang: 'ja',					  // 使用言語 - ずっと保存
	  //					  },
	  //★ セッションクッキーは仕様上削除できないそうで・・・ ★//
	  //						var exp = new Date();
	  //						exp.setTime(exp.getTime() - 1);
	  //						document.cookie = 'extra=; expires=' + exp.toGMTString();
	  //						document.cookie = 'JSESSIONID=; expires=' + exp.toGMTString();
	},

	/**
	 * 指定されたクッキーの有無を検査する。
	 * @param cookey
	 * @returns {Boolean} 値があれば True を返す。
	 * TODO:この関数は何に使うか帰山さんに確認
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
		document.cookie = cookey + "=dummy;expires=Thu, 01 Jun 1970 00:00:00 GMT; path=/"
	},

	/**
	 * クッキーに認証情報があるかどうかを判定する。
	 * @returns {Boolean} 認証情報がある場合は True を返す。
	 * TODO:この関数は何に使うか帰山さんに確認
	 */
	hasAuthCookies : function() {
	  // JSESSIONID 有無
//	  if (!clcom.hasCookie('JSESSIONID')) {
		// TODO:テスト用にtrueを返す
	  if (!clcom.hasCookie('auth_token')) {
		return false;
	  }
	  return true;
	},

	cancelBeforeUnload: function (url) {
      var target;
      if (url instanceof $) {
        target = url.attr('target');
        url = url.attr('href');
      }

      if (target) {
        return;
      }

      if (url === undefined || /^#/.test(url))
        return;

      if (/^javascript:/.test(url)) {
        if (/^javascript:/.test(url)) {
          clcom._preventConfirmOnce = true;
        }
        return;
      }

      clcom._preventConfirm = true;
    },

    // 確認ダイアログなしでURLを変更する。
    location: function (url) {
      clcom.cancelBeforeUnload(url);
      window.location.href = url;
    },

	toString: function() {
	  return JSON.stringify(this);
	}
  });
}());

(function () {
  function removeHash(url) {
    return url.split('#')[0];
  }

  function generateHash() {
    return String(new Date().getTime());
  }

  function getPageHash() {
    var ret = location.hash;
    if (!ret) {
      return null;
    }
    ret = ret.replace(/^#/, "");
    return $.browser.fx ? ret : decodeURIComponent(ret);
  }

  function go(url, hash) {
    hash = encodeURIComponent(hash);
    url = removeHash(url);
    window.location.href = url + '#' + hash;
  }
  function newWindow(url, hash, target){
    hash = encodeURIComponent(hash);
    url = removeHash(url);
    window.open(url + '#' + hash, target);
  }
	// ページ遷移用スタック操作
  var pushpop = (function () {
	var store = window.store,
		stack,
		current,
		savedData,
		history,
		pushd;

	stack = store.get('clcom.pushpop') || [];
    // store.remove('clcom.pushpop');
	if (stack.length > 0) {
      var last = _.last(stack),
          type = last.type,
          hash = last.hash;

      if (last.hash !== getPageHash() && !getPageHash()) {
        store.remove('clcom.pushpop');
        stack = [];
      } else {
        if (last.type === 0) {
          savedData = stack.pop();
        }
      }
    }
	savedData = savedData || {};
	current = _.last(stack) || {};

	history = _(stack)
	  .chain()
	  .filter(function (value, index) {return index % 2 === 1;})
	  .map(function (value) {
		return {
		  url: value.srcUrl,
		  label: value.srcPageTitle // TODO
		};
	  })
	  .value();

	function push(){
		var opts;
		if(arguments.length === 1 && _.isObject(arguments[0])){
			opts = arguments[0];
		}else{
			opts = {
				url: arguments[0],
				args: arguments[1],
				saved: arguments[2],
				download: arguments[3],
				clear: arguments[4]
			};
		}
		pushd = true;
		var s = stack.slice();
		/* clearフラグを追加 2013/10/17 */
		if (opts.clear) {
			store.remove('clcom.pushpop');
			s = [];
		}
		var dstId = clcom.getPageIdFromPath(opts.url);
		var hash = generateHash();

		s.push({
			type: 0,
			saved: opts.saved,
			dstId: dstId,
			dstUrl: opts.url
		});
		s.push({
			type: 1,
			args: opts.args,
			srcUrl: location.href,
			srcId: clcom.pageId,
			srcPageTitle: clcom.pageTitle,
			hash: hash
		});

		store.set('clcom.pushpop', s);
		if (opts.download) {
			location.href = opts.url;
		} else if(opts.newWindow) {
			var target = null;
			if(_.isString(opts.newWindow)){
				target = opts.newWindow;
			}else if(_.has(opts.newWindow, 'target')){
				target = opts.newWindow.target;
			}
			newWindow(opts.url, hash, target);
		} else {
			go(opts.url, hash);
		}
	}
//	function push(url, args, saved, download, clear) {
//	  pushd = true;
//	  var s = stack.slice();
//	  /* clearフラグを追加 2013/10/17 */
//	  if (clear) {
//		  store.remove('clcom.pushpop');
//		  s = [];
//	  }
//	  var dstId = clcom.getPageIdFromPath(url);
//	  var hash = generateHash();
//
//	  s.push({
//		type: 0,
//		saved: saved,
//		dstId: dstId,
//		dstUrl: url
//	  });
//	  s.push({
//		type: 1,
//		args: args,
//		srcUrl: location.href,
//		srcId: clcom.pageId,
//		srcPageTitle: clcom.pageTitle,
//        hash: hash
//	  });
//
//	  store.set('clcom.pushpop', s);
//	  if (download) {
//		  location.href = url;
//	  } else {
//		  go(url, hash);
//	  }
//	}


	function pop(returnValue, n) {
	  var hash = generateHash();
      n = n != null ? n : 1;
      if (stack.length - 2 * n + 1 < 0)
        return;
      pushd = true;
      var s = stack.slice(0, stack.length - 2 * n + 1);
      var l = s[s.length - 1];
      l.returnValue = returnValue;
      l.hash = hash;
      store.set('clcom.pushpop', s);
      go(current.srcUrl, hash);
      // window.location.href = current.srcUrl;
    }

	function beforeunload(e) {
      console.log('beforeuload');
      if (!pushd) {
        if (clcom._nowdownloading) {
          location.hash = clcom.pageHash;
          return;
        }

        if (!clcom._preventConfirmOnce && !clcom._preventConfirm) {
          // ページ移動前の確認
          return 'ブラウザの【戻る】【進む】【リロード】ボタンを使用しています。入力したデータは保存されません。現在のページから移動しないでください。';
        }
      }
      clcom._preventConfirmOnce = false;
    }

    $(document).on('click', 'a', function (e) {
      clcom.cancelBeforeUnload($(e.currentTarget));
    });

    $(window).on('beforeunload', beforeunload);

	return {
	  pageHash: getPageHash(),
      pushPage: push,
      popPage: pop,
      go: go,
      newWindow: newWindow,
      transfer: push,
      srcId: current.srcId,
      srcPageTitle: current.pageTitle,
      srcUrl: current.srcUrl,
      dstId: savedData.dstId,
      dstUrl: savedData.dstUrl,
      returnValue: savedData.returnValue,
      pageArgs: current.args,
      pageData: savedData.saved,
      _history: history
    };
  }());
  _.extend(clcom, pushpop);

  console.log(clcom.toString());
}());

(function () {
  var getYmd =	function (ymd, format) {
	if (ymd instanceof jQuery) {
	  ymd = ymd.val();
	}
	ymd = clutil.dateFormat(ymd, format || 'yyyymmdd');
	return ymd;
  },

	  buildSelectorItems = function (template, list, firstItem, selializer) {
		selializer = selializer || _.identity;
		var markup = _.map(list, function (data) {
		  return template({d: selializer(data, list)});
		}).join('');
		var $select = $('<select>').html(markup);
		_.each($select.children(), function (option, i) {
		  $(option).data('cl', list[i]);
		});
		$select.prepend(firstItem);
		return $select.children();
	  };

  /** ユーティリティ */
  _.extend(clutil, {
	/** 今ブロッキング中かどうかフラグ	*/
	UIBlocking : 0,
	/** 画面をブロックする */
	blockUI : function(a) {
	  console.log('blockUI called, [' + a + '], flag[' + clutil.UIBlocking + ']');
	  if (clutil.UIBlocking > 0) {
		clutil.UIBlocking++;	// TODO:clutilはthisにすべき？
		return;
	  }else{
		clutil.UIBlocking++;
//		$.blockUI({ centerY: 0, css: { top:'10px', left:'', right:'10px' } });
//		// 余計なborderが表示されてしまうためcssを修正
//		$('#loading').parent('div').css('border', 'none');
		var msg = '<div id="loading" class=""><img src="' + clcom.urlRoot + '/images/loader.gif"></div>';
		$.blockUI({
			css: { 'backgroundColor':'none', 'border':'none' },
			message: msg
		});
		console.log('blockUI blocked');
	  }
	},
	/** 画面のブロックを解除する */
	unblockUI : function(a) {
	  console.log('unblockUI called, [' + a + '], flag[' + clutil.UIBlocking + ']');
	  clutil.UIBlocking--;
	  if (clutil.UIBlocking <= 0) {
		clutil.UIBlocking = 0;
		$.unblockUI();

		console.log('unblockUI unblocked');
	  }
	},

	/**
	 * AOKI 一定時間操作がなかった場合Cookieを削除する
	 */
	timeout : new Date(),
	timer : null,
	screentimercount : 1000,
	timercount : 300000,	// 5分
	timeroutcount : 600000,	// 10分

	// ノーサイン：１分 分析：５分
	//ajax_timeout : clcom.getPageType() == 'cu' ? 60000 : 300000,
	ajax_timeout : clcom.getPageType() == 'cu' ? 60000 : 600000,	// タイムアウトは10分

	/**
	 * AOKI 操作があった場合その時刻を記録しておく
	 * 顧客用は未定のためとりあえずコメントアウトしておく
	 */
	setTimeout: function() {
//		clutil.isTimeout(false);
//		clutil.timeout = new Date();
	},

	/**
	 * AOKI 操作確認のためタイマーをセットする
	 * 顧客用は未定のためとりあえずコメントアウトしておく
	 */
	clearScreen: function() {
		if (window.clipboardData) {
			window.clipboardData.clearData();
		}
		setTimeout("clutil.clearScreen()", clutil.screentimercount);
	},

	/**
	 * AOKI 操作確認のためタイマーをセットする
	 * 顧客用は未定のためとりあえずコメントアウトしておく
	 */
	setTimer: function() {
//		setTimeout("clutil.isTimeout(true)", clutil.timercount);
//		setTimeout("clutil.clearScreen()", clutil.screentimercount);
	},

	/**
	 * AOKI 一定時間操作がなかった場合Cookieを削除する
	 * 顧客用は未定のためとりあえずコメントアウトしておく
	 */
	isTimeout: function(timer) {
//		var now = new Date();
//		var sec = now.getTime() - clutil.timeout.getTime();
//
//		if (sec > clutil.timeroutcount) {
//			clutil.gohome(clcom.urlRoot + '/err/unauthorized.html', true)
//		} else if (timer) {
//			clutil.setTimer();
//		}
	},

	/**
	 * AOKI
	 * ログイン画面に遷移する
	 */
	clearStorage: function() {
		// 共通
		// 運用日をストレージから消去
		clcom.removeOpeDate();
		// 区分リストをストレージから消去
		clcom.removeTypeList();
		// 権限リストをストレージから消去
		clcom.removeFuncList();
		// ログイン情報をストレージから消去
		clcom.removeUserData();
		// pushpopをストレージから消去
		store.remove('clcom.pushpop');

		switch (clcom.getPageType()) {
		case "an":	// 分析
			// メニュー情報をストレージから消去
			clcom.removeMenuStore();
			// 分析情報をストレージから消去
			clcom.removeAnaprocInit();
			clcom.removeBuinfo();
			break;
		case "cu":	// ノーサイン
			//閲覧履歴情報をストレージから削除
			clcom.removeHisList();
			break;
		  default:
			break;
		}
	},

	gohome: function (url, logout, gohome) {
		// ログイン画面に戻るかフラグ デフォルトは戻る
		var gohome = gohome == null ? true : false;
		// ストレージをクリア
		clutil.clearStorage();
		// クッキーのクリア
//		clcom.delCookie('auth_token');
		if (url == null) {
			url = clcom.urlRoot;
		}

		if (logout == true) {
			$.ajax("/api/gs" + clcom.getPageType() + "_cm_logout",{
				type : "GET",
				dataType: "json",
				contentType: "application/json",
				cache: false,
				timeout: 5000,
				success: function() {
					if (gohome) {
						// success
						clcom.cancelBeforeUnload(clcom.urlRoot);

					    location.href = url;
					}
				},
				error: function(xhr, status, exp) {
					//エラーは無視する？
					//location="system/app/err/error.html";
				},
				complete: function(xhr, status) {
				}
			});
		} else {
			clcom.cancelBeforeUnload(url);
			location.href = url;
		}
	},

	/** 区分値リスト */
	cltypenamelist : [],

	/**
	 * サーバ呼び出しラッパ関数。
	 * @param t HTTPメソッド
	 * @param res リソースパス
	 * @param data JSONデータ
	 * @param appcallback function(data,dataType)
	 * @param {Function} completed
	 * @param {String} resType
	 * @param {jQuery Object} $form optional
	 * data 形式は、
	 * {
	 *	 // ヘッダ情報
	 *		 head: {
	 *	   status: {'success' or 'warn' or 'error'},
	 *	   message: メッセージコード
	 *	   args: [ val1, val2, ...] // メッセージ引数
	 *	   fieldMessages : [
	 *		 {
	 *		   name:項目名,
	 *		   message:メッセージコード,
	 *		   args: [ メッセージ引数... ]
	 *		 },
	 *		 ...
	 *		]
	 *	 },
	 *	 // アプリデータ
	 *	 body: {
	 *	   アプリケーションデータ
	 *	 }
	 * }
	 * @return {promise}
	 */
	httpcall : function(options) {
	  if (!clcom.hasAuthCookies()) {
		  // ログインしていない場合
		  clutil.gohome(clcom.urlRoot + '/err/nosession.html');
		  return;
	  }
	  // ノーサインの場合画面情報とストレージ情報のチェックを行う
	  // パスワード画面は除外
	  if (clcom.getPageType() == 'cu' && clcom.pageId != 'CUMEV0150') {
		  if (!clutil.chkCustPageType()) {
			  return;
		  }
	  }

	  // タイマーをセット
	  clutil.setTimeout();

	  var deferred = $.Deferred();

	  var params = _.extend({
		timeout : clutil.ajax_timeout,
		cache: false,
		dataType: 'json',
		async: true,
		contentType: 'application/json'
		// beforeSend: function(xhr){
		//	 // リクエストヘッダ付加 - GET メソッドでの妙なキャッシュ作用を防ぐため XXXX cache オプションをfalseに指定すれば良いはず
		//	 if (this.type == 'GET') {
		//	   xhr.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT");
		//	   //xhr.setRequestHeader("Cache-Control", "no-cache");
		//	 }
		// }
	  }, options || {});

	  var success = params.success;
	  params.success = function (data, dataType) {
		// AOKI 運用日を設定する
		if (data.head && data.head.ope_iymd != 0) {
			clcom.setOpeDate(data.head.ope_iymd);
		}
		if (success)
		  success(data, dataType);
		if (data.head && data.head.status !== 0)
		  deferred.reject(data);
		else
		  deferred.resolve(data, dataType);
	  };

	  var error = params.error;
	  params.error = function (xhr, textStatus, errorThrown) {
		console.log('XXX error, textStatus[' + textStatus + "]");
		// 致命的なエラーということで共通処理する。
		var ret = clutil.ajaxErrorHandler(xhr, textStatus, errorThrown);
		if (ret) {
		  if (success) {
			success.apply(this, [ret]);
		  }
		  if (error)
			error(xhr, textStatus, errorThrown);
		  deferred.reject(ret);
		}
	  };

	  var complete = params.complete;
	  params.complete = function (xhr, textStatus) {
		// 呼び出し完了は Indicator 終了処理とかで共通処理する。
		clutil.unblockUI(params.url);
		console.log('XXX completed, stat[' + textStatus + ']); statusCode[' + xhr.status + ']');
		if (complete) {
		  complete(xhr, textStatus);
		}
	  };

	  // Don't process data on a non-GET request.
	  if (params.type !== 'GET') {
		params.data = JSON.stringify(options.data);
		params.processData = false;
	  }

	  clutil.blockUI(params.url);
	  $.ajax(params);
	  return deferred.promise();
	},

	ajaxErrorHandler: function (xhr, textStatus, errorThrow) {
	  var errcode = 'cl_http_status_xxx';
	  switch (xhr.status) {
	  case 0:		// unauthorized
		errcode = "cl_http_status_0";
		break;
	  case 401:		  // unauthorized
		errcode = "cl_http_status_unauthorized";
		  clutil.gohome(clcom.urlRoot + '/err/unauthorized.html', true);
		break;
	  case 503:		  // forbidden
		location.href = clcom.urlRoot + '/err/unavailable.html';
		break;
	  default:
		break;
	  }

	  return {
		head : {
		  status  : "error",		// 0 でないのを入れる
		  message : errcode,
		  httpStatus: xhr.status
		}
	  };
	},

	_dlDialogVer: function (url) {
	  var template = _.template(
		'<button class="btn dlg-cancel">キャンセル</button>' +
		  '<a class="btn btn-primary dlg-apply" href="<%= url %>"' +
		  ' target="_blank">ダウンロード</a>'
	  );
	  var $dialog = new clutil.ConfirmDialog({
		footer: template({url: url}),
		message: 'ダウンロードしますか？',
		title: 'ダウンロード'
	  });
	},

	_downloadFormTemplate: _.template(
	  '<form id="clDownloadForm" class="far-afield" method="GET"' +
		' target="_blank" action="<%= url %>">' +
		' <input type="submit">' +
		' </form>'
	),

	_dlIframeVer: function (url) {
	  var template = _.template(
		'<iframe width="1" height="1" frameborder="0"' +
		  ' src="<%= url %>"></iframe>'
	  );
	  $(template({url: encodeURI(url)})).appendTo($('body'));
	},

	_download: function (url) {
	  var $form = $('#clDownloadFrom');
	  if (!$form.length) {
		$form = $(clutil._downloadFormTemplate({url: encodeURI(url)}))
		  .appendTo($('body'));
	  }
	  $form.submit();
	},

    download: function (url, id) {
	    var url = encodeURI(url);

	    function startDownlaod(_url) {
	      clcom._preventConfirmOnce = true;
	      if (window.navigator.standalone) {
	    	  clcom.pushPage("dbapi-1://" + _url, null, null, true);
//		      location.href = "dbapi-1://" + _url;
	      } else {
	    	  clcom.pushPage(_url, null, null, true);
//	    	  location.href = _url;
	      }
	    }

	    function removeDownloadBar() {
	      $('.clDownloadBar').remove();
	      $('body').removeClass('clDownloadBarAdded');
	    }

	    function createDownloadBar(_url) {
	      var $alert = $(
	        '<div id="clDownloadBar" class="clDownloadBar alert alert-info">' +
	          '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
	          '<a href="' + _url + '"><strong>ダウンロードが開始されない場合はここをクリックしてください。</strong></a></div>'
	      );

	      $alert
	        .on('click', 'button,a', function (e) {
	          removeDownloadBar();
	          if ($(e.currentTarget).is('a')) {
	            startDownlaod(_url);
	          }
	          e.preventDefault();
	        })
	        .appendTo('body');
	      $('body').addClass('clDownloadBarAdded');
	    }


	    // ファイルの存在チェック
	    if (id != null) {
	    	var req = {
					cond : {
						file_id : id
					}
			};
	    	// データを取得
			clutil.postJSON('gscm_filechk', req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					if ($.browser.msie && $.browser.version < 9) {
				      removeDownloadBar();
				      createDownloadBar(url);
				    } else {
				      startDownlaod(url);
				    }
				} else {
					clutil.ErrorDialog('ファイルがみつかりませんでした。');
				}
			}, this));
	    } else {
	    	if ($.browser.msie && $.browser.version < 9) {
	  	      removeDownloadBar();
	  	      createDownloadBar(url);
	  	    } else {
	  	      startDownlaod(url);
	  	    }
	    }
	},

	/**
	 * 初期データ取得用 GET メソッド
	 * AOKI
	 * @param res アプリ専用の初期情報取得リソース
	 * @param appcallback アプリ固有の初期情報取得コールバック
	 * @returns {jqXHR}
	 */
	getIniJSON : function(res, appcallback, completed) {
		if (!clcom.hasAuthCookies()) {
			// ログインしていない場合
			clutil.gohome(clcom.urlRoot + '/err/nosession.html');
			return;
		}
		if (clutil.cStr(clcom.srcId) == ""){
			clutil.gohome(null, true);
		}

		if (res != null) {
			clutil.getJSON(res, appcallback, completed);
		} else {
			completed();
		}
		//clutil.blockUI();
		var param = {
			//TODO: サーバー側に/clcomを実装する
		};

		return $.ajax(param);
	},

	/**
	 * 初期データ取得用 GET メソッド
	 * AOKI
	 * @param res アプリ専用の初期情報取得リソース
	 * @param appcallback アプリ固有の初期情報取得コールバック
	 * @returns {jqXHR}
	 */
	postIniJSON : function(res, data, appcallback, completed) {
		if (!clcom.hasAuthCookies()) {
			// ログインしていない場合
			clutil.gohome(clcom.urlRoot + '/err/nosession.html');
			return;
		}
		if (clutil.cStr(clcom.srcId) == ""){
			clutil.gohome(null, true);
		}

		if (res != null) {
			clutil.postJSON(res, data, appcallback, completed);
		} else {
			completed();
		}
		//clutil.blockUI();
		var param = {
			//TODO: サーバー側に/clcomを実装する
		};

		return $.ajax(param);
	},


	/**
	 * JSONデータ取得関数
	 * @param res
	 * @param appcallback
	 * @returns {promise}
	 */
	getJSON : function(res, appcallback, complete) {
	  return clutil.httpcall({
		type: 'GET',
		url: clcom.apiRoot + '/' + res,
		success: appcallback,
		complete: complete
	  });
	},
	/**
	 * JSONデータPOST関数
	 *
	 * ##### オブジェクト引数コール
	 * ```js
	 * clutil.postJSON(options)
	 * ```
	 * - options
	 *   - resId
	 *   - [data]
	 *   - [success]
	 *   - [complete]
	 *   - その他のAjaxオプション
	 *
	 * @method postJSON
	 * @for clutil
	 * @param resId リソースID 的な文字列。呼び出し先の uri の一部になる。
	 * @param [data]
	 * @param [success]
	 *
	 *
	 * @returns {promise}
	 */
	 postJSON: function(resId, data, success, complete) {
		var o = null;
		if(arguments.length === 1 && _.isObject(arguments[0])){
			o = arguments[0];
		}else{
			o = {
				resId: resId,
				data: data,
				success: success,
				complete: complete
			};
		}
		var resId = o.resId;
		var url = clcom.apiRoot + '/' + resId;
		var fixopt = _.defaults(o, {
			type: 'POST',
			url: url
		});
		return clutil.httpcall(fixopt);
	},
	/**
	 * JSONデータPUT関数
	 * @param res
	 * @param data
	 * @param appcallback
	 * @returns {promise}
	 */
	putJSON : function(res, data, appcallback, complete) {
	  return clutil.httpcall({
		type: 'PUT',
		data: data,
		url: clcom.apiRoot + '/' + res,
		success: appcallback,
		complete: complete
	  });
	},
	/**
	 * JSONデータDELETE関数
	 * @param res
	 * @param data
	 * @param appcallback
	 * @returns {promise}
	 */
	deleteJSON : function(res, data, appcallback, complete) {
	  return clutil.httpcall({
		type: 'PUT',
		data: data,
		url: clcom.apiRoot + '/' + res,
		success: appcallback,
		complete: complete
	  });
	},

	/**
	 * AOKI
	 * HTMLファイルの読み込み
	 * @param url	// HTMLファイルのURL
	 * @param appcallback
	 */
	loadHtml : function(url, appcallback) {
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'html',
			success: function(data) {
				appcallback(data);
			},
			error:function() {
				clutil.ErrorDialog('HTMLファイルの読み込みに失敗しました');
			}
		});
	},

	funcgrpname : ['search', 'tree', 'score', 'zone', 'list', 'note', 'permission', 'note', 'upload'],

	/** AOKI
	 * 権限グループに応じて権限名のリストを作成する
	 */
	setFuncGrp: function (funclist) {
		var funcgrp = {
			search	: false,
			tree	: false,
			score	: false,
			zone	: false,
			list	: false,
			note	: false,
			permission	: false,
			upload	: false
		};
		for (var i = 0; i < funclist.length; i++) {
			var func = funclist[i];
			switch (Number(func.f_funcgrp)) {
			case gsdb_defs.MTCONSTTYPE_F_FUNCGRP_STAFFSRCH :
				funcgrp.search = true;
				break;
			case gsdb_defs.MTCONSTTYPE_F_FUNCGRP_ORGTREE :
				funcgrp.tree = true;
				break;
			case gsdb_defs.MTCONSTTYPE_F_FUNCGRP_ESTIMATE :
				funcgrp.score = true;
				break;
			case gsdb_defs.MTCONSTTYPE_F_FUNCGRP_PERFORM :
				funcgrp.zone = true;
				break;
			case gsdb_defs.MTCONSTTYPE_F_FUNCGRP_STAFFLIST :
				funcgrp.list = true;
				break;
			case gsdb_defs.MTCONSTTYPE_F_FUNCGRP_NOTE :
				funcgrp.note = true;
				break;
			case gsdb_defs.MTCONSTTYPE_F_FUNCGRP_AUTH :
				funcgrp.permission = true;
				break;
			case gsdb_defs.MTCONSTTYPE_F_FUNCGRP_DATA :
				funcgrp.upload = true;
				break;
			default:
				break;
			}
		}
		var store = window.store;
		var key = clcom.storagePrefix + 'funcgrp';
		store.set(key, funcgrp);
	},

	// AOKI:INT32の最大値
	int32Max : 2147483647,

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
	  // {0}とかが残るケースの救済（取り敢えず{0}と{1}だけ）
	  for (i = 0; i < 2; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "g");
		if( reg != null ){
			fmt = fmt.replace(reg, "");
		}
	  }
	  return fmt;
	},

	fmtargs: function(fmt, args) {
	  var i;

	  if (!fmt)
		return '';

	  if(args instanceof Array){
		for (i = 0; i < args.length; i++) {
		  var reg = new RegExp("\\{" + i + "\\}", "g");
		  fmt = fmt.replace(reg,args[i]);
		}
	  }
	  // {0}とかが残るケースの救済（取り敢えず{0}と{1}だけ）
	  for (i = 0; i < 2; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "g");
		if( reg != null ){
			fmt = fmt.replace(reg, "");
		}
	  }
	  return fmt;
	},

	_setErrorHeader: function ($echoback, message) {
	  if ($echoback != null) {
		clutil._clearErrorHeader($echoback);
//		$echoback.css('display', 'block').html(message);
		// アニメーションで表示するように修正 11/6
		$echoback.html(message);
		$echoback.fadeIn('300');
		// なにもしなくても一定時間を過ぎるとエラーメッセージが消える
		clutil.errHeaderTimerId = setTimeout("clutil._stopErrorHeaderTimer()", 10000);
		clutil.err$echoback = $echoback;
//		$echoback.delay(10000).fadeOut(300);
		// スクロール
        $('body').scrollTo($echoback, 800);
	  }
	},

	_clearErrorHeader: function ($echoback) {
	  if ($echoback) {
		$('.cl_error_echoback', $echoback).remove();
		// なにもしなくても一定時間を過ぎるとエラーメッセージが消えるイベントをストップ
		clearTimeout(clutil.errHeaderTimerId);
//		$echoback.stop();
		$echoback.hide();
	  }
	},

	_stopErrorHeaderTimer: function () {
	  if (clutil.err$echoback) {
		  clutil.err$echoback.fadeOut();
		  clutil.err$echoback = null;
	  }
	},

	/**
	 * 指定form領域に適用する validator インスタンスを生成する。
	 * @param form
	 * @param option
	 * {
	 *	 echoback: $(エコーバック領域を指定),
	 *	 withErrorMark: true/false,			// エラーフィールドの隣に '*' マークを付加する
	 *	 withErrorMessage: true/false		// エラーフィールドの隣りにメッセージを表示する
	 * }
	 * @example
	 * var validator = clutil.validator($('#myForm'),{echoback:$('#echoback')});
	 * if(validator.valid()){
	 *	  $.post(...,
	 *	   success(){...},
	 *	   error(){validator.setErrorInfo({'要素タグ.id名': メッセージ})}
	 *	  );
	 * }
	 */
	validator: function(form, options) {
	  var msgcd2msg = function (msgcd) {
		var fmtargs = _.toArray(arguments);
		fmtargs[0] = clmsg['cl_'+msgcd];
		var msg = clutil.fmt.apply(this, fmtargs);			   // 項目名ラベルなし
		return msg;
	  },

		  setErrorMsg = function ($input, message) {
		  // bootstrap用に対応 AOKI ACUST
		  if ($input.is('select')) {
			  var $button = $($input.next('div').find('button'));
			  $input
			  .addClass('cl_error_field')
			  .attr('data-cl-errmsg', message);
			  $button
			  .addClass('cl_error_field')
			  .attr('data-cl-errmsg', message);
		  } else {
			  $input
			  .addClass('cl_error_field')
			  .attr('data-cl-errmsg', message);
		  }

		  },

		  clearErrorHeader = function ($echoback) {
			clutil._clearErrorHeader($echoback);
		  },

		  clearErrorMsg = function ($input) {
			$input.removeClass('cl_error_field')
			  .removeAttr('data-cl-errmsg');
		  },

		  Validators = (function () {
			var isHalf = function (c) {
			  c = c.charCodeAt(0);
			  return (c >= 0x0 && c < 0x81) || (c == 0xf8f0) ||
				(c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
			};

			function zenkaku(value, max) {
			  if (!value.length) { // 空はOK!
				return;
			  }
			  max = parseInt(max, 10);
			  var len = _.reject(value.split(''), isHalf).length;
			  if ((max && len > max) || len !== value.length) {
				return msgcd2msg('zenkaku', max);
			  }
			}

			function hankaku(value, max) {
			  if (!value.length) { // 空はOK!
				return;
			  }
			  max = parseInt(max, 10);
			  var len = _.filter(value.split(''), isHalf).length;
			  if ((max && len > max) || len !== value.length) {
				return msgcd2msg('hankaku', max);
			  }
			}

			function zenhan(value, zen, han) {
			  if (zenkaku(value, zen) && hankaku(value, han)) {
				return msgcd2msg('zenhan', zen, han);
			  }
			}

			function decimal(value, ipart, dpart) {
			  if (!value.length) { // 空はOK!
				return;
			  }
			  ipart = parseInt(ipart, 10);
			  dpart = parseInt(dpart, 10);
			  var msg;
			  if (ipart && dpart) {
				msg = msgcd2msg('decimal1', ipart, dpart);
			  } else if (ipart) {
				msg = msgcd2msg('decimal2', ipart);
			  } else if (dpart) {
				msg = msgcd2msg('decimal3', dpart);
			  } else {
				msg = msgcd2msg('decimal4');
			  }

			  var match = value.match(/^(?:-?(0|[1-9][0-9]*))?(?:\.([0-9]*))?$/);
			  if (!match || (ipart && (match[1]||'').length > ipart) ||
				  (dpart && (match[2]||'').length > dpart)) {
				return msg;
			  }
			}

			function integer(value, len) {
			  if (!value.length) { // 空はOK!
				return;
			  }
			  len = parseInt(len, 10);
			  var errcode = len ? 'int1' : 'int2';
			  var match = value.match(/^(?:-?(0|[1-9][0-9]*))?$/);
			  if (!match || (len && (match[1]||'').length > len)) {
				return msgcd2msg(errcode, len);
			  }
			}

			function numeric(value) {
			  if (!value.length) { // 空はOK!
				return;
			  }
			  var errcode = 'numeric1';
			  var match = value.match(/^([0-9]+)$/);
			  if (!match) {
				return msgcd2msg(errcode);
			  }
			}

			function alpha(value) {
			  if (!value.length) { // 空はOK!
				return;
			  }
			  if (!value.match(/^[a-zA-z]*$/)) {
				return msgcd2msg('alpha');
			  }
			}

			function alphaNumeric(value) {
			  if (!value.length) { // 空はOK!
				return;
			  }
			  if (!value.match(/^[a-zA-Z0-9]*$/)) {
				return msgcd2msg('alnum');
			  }
			}

			function minlen(value, min) {
			  if (!value.length) { // 空はOK!
				return;
			  }
			  min = parseInt(min, 10);
			  if (value.length < min) {
				return msgcd2msg('minlen', min);
			  }
			}

			function maxlen(value, max) {
			  if (!value.length) { // 空はOK!
				return;
			  }
			  max = parseInt(max, 10);
			  if (value.length > max) {
				return msgcd2msg('maxlen', max);
			  }
			}

			function len(value, min, max) {
			  min = parseInt(min, 10);
			  max = parseInt(max, 10);
			  if (!value.length) { // 空はOK!
				return;
			  }
			  var ecode;
			  if (isFinite(min) && isFinite(max)) {
				ecode = min === max ? 'len1' : 'len4';
			  } else if (isFinite(min)) {
				ecode = 'len2';
				max = Infinity;
			  } else {
				ecode = 'len3';
				min = 0;
			  }
			  console.log(value.length, min, max, ecode);
			  if (value.length < min || value.length > max) {
				return msgcd2msg(ecode, min, max);
			  }
			}

			function min(value, minValue) {
			  value = Number(value);
			  minValue = Number(minValue);
			  if (isFinite(minValue) && value < minValue) {
				return msgcd2msg('min', minValue);
			  }
			}

			function max(value, maxValue) {
			  value = Number(value);
			  maxValue = Number(maxValue);
			  if (isFinite(maxValue) && value > maxValue) {
				return msgcd2msg('max', maxValue);
			  }
			}

			return {
			  zenkaku: zenkaku,
			  hankaku: hankaku,
			  zenhan: zenhan,
			  decimal: decimal,
			  'int': integer,
			  'alpha': alpha,
			  'alnum': alphaNumeric,
			  numeric: numeric,
			  minlen: minlen,
			  maxlen: maxlen,
			  len: len,
			  min: min,
			  max: max
			};
		  }()),

		  callValidator = function (s, value) {
			var splitted = s.split(':'),
				args = (splitted[1] || '').split(','),
				funcName = splitted[0];
			args.unshift(value);
			var validateFunc = Validators[funcName];
			if (validateFunc)
			  return validateFunc.apply(Validators, args);
		  };

	  var defaultValidator = {

		/** form領域 (formタグでなくてもよい) */
		form: null,

		/** エコーバック領域 */
		echoback: null,

		/**
		 * エラー表示領域にエラー情報を設定する。エラー情報は外部から渡す。
		 * @param {String} errMsg ヘッダーに表示するエラーメッセージ
		 */
		setErrorHeader: function(errMsg) {
		  clutil._setErrorHeader(this.echoback, errMsg);
		  return false;
		},

		/**
		 * 指定フィールドにエラーをセットする
		 * @param {jQuery} $input 対象フィールド
		 * @param {String} message エラーメッセージ
		 */
		setErrorMsg: setErrorMsg,

		/**
		 * 指定フィールドのエラーを解除する
		 * @param {jQuery} $input 対象フィールド
		 */
		clearErrorMsg: clearErrorMsg,

		/**
		 * エコーバックのエラーを解除する
		 */
		clearErrorHeader: function () {
		  clearErrorHeader(this.echoback);
		},

		/**
		 * サーバーレスポンスの個別項目におけるエラーメッセージ情報(data.head.fieldMessages)を設定する。
		 * @param {Array} fieldMessages レスポンスのhead.fieldMessages
		 * @param {Object} [options] オプション
		 * @param {String} [options.by] 要素の取得方法 "id"|"name"
		 * @param {String} [options.prefix] idに付与するプレフィックス
		 */
		setErrorInfoFromSrv: function (fieldMessages, options) {
		  if (!fieldMessages || !fieldMessages.length) {
			return;
		  }
		  options = options || {};
		  var errInfo = {};
		  _.each(fieldMessages, function (field) {
			errInfo[field.field_name] = clutil.fmtargs(field.message, field.args);
		  });
		  this.setErrorInfo(errInfo, options);
		},

		/**
		 * 個別のエラー情報を設定する。エラー情報は外部から渡す。
		 * @param errInfo
		 * {
		 *	 _eb_: エコーバックだけに表示するメッセージ,
		 *	 フィールドに付加したID名: エラーメッセージ,
		 *	 フィールドに付加したID名: エラーメッセージ,
		 *	 ...
		 * }
		 * @param {String} options.by 要素の取得方法 "id"|"name"
		 * @param {String} options.prefix idに付与するプレフィックス
		 * @example
		 * validator.errInfo({ field1.id: 'error-1', field2.id: 'error-2', ...})
		 */
		setErrorInfo: function(errInfo, options) {
		  options = _.defaults(options || {}, {prefix: ''});

		  var hasError = false,
			  ebmsg = clmsg.cl_echoback,
			  getElement = function (key) {return $('#' + options.prefix + key)};

		  if (options.by === 'name') {
			getElement = function (key) {return $('[name="' + options.prefix + key + '"]')};
		  }

		  // エコーバックだけのメッセージ
		  if (errInfo._eb_ !== undefined && errInfo._eb_.length > 0) {
			hasError = true;
			ebmsg = errInfo._eb_;
		  }

		  // 各フィールド毎のメッセージ
		  for (var id in errInfo) {
			var msg = errInfo[id],
				$input = getElement(id);
			if ($input.size() === 0) {
			  console.debug('validator.setErrorInfo(): id[' + id + '] not found, skip.');
			  continue;
			}
			setErrorMsg($input, msg);
			hasError = true;
		  }

		  if (hasError) {
			this.setErrorHeader(ebmsg);
			clutil.setFocus($('.cl_error_field', this.form).first());
//	        $('body').scrollTo($('.cl_error_field', this.form).first(), 800);
		  }
		  return hasError;
		},

		/**
		 * エラー情報をクリアする。
		 * @return クラス cl_valid 要素を返す。
		 */
		clear: function() {
		  clearErrorHeader(this.echoback);

		  // form 領域内のエラー色定義のクラスを取る
		  clearErrorMsg($('.cl_error_field', this.form));

		  $('div.tooltip').remove(); // XXXX なぜか消えない不具合対策
		  return $('.cl_valid', this.form);
		},

		/**
		 * fm で指定された領域に対して、入力チェックを行います。
		 * 実行後、エラーフィールドに対して、クラス属性 cl_error_field が付加されます。
		 * エラーフィールドの後にはエラー個数の '*' がマーキングされます。
		 * '*'マーキングはクラス属性 cl_error_mark で検出できます。
		 * エラーメッセージは clmsg オブジェクトで定義されます。
		 * @returns {Boolean} true:OK, false:入力不備を検出。
		 */
		valid: function(options) {
		  options = options || {};
		  _.defaults(options, {filter: function() {return true}});
		  var me = this,
			  hasError = false,
			  ebmsgs = [],		  // エコーバック表示用メッセージ
			  setError = function (input, msgcd) {
				setErrorMsg($(input), msgcd2msg.apply(this, Array.prototype.slice.call(arguments, 1)));
				hasError = true;
			  };


		  // 手抜き日本語のみ対応
		  var dateToYmd = function(date) {
			try {
			  return date.toLocaleString().split(' ')[0];
			} catch (e) {
			  return date.toLocaleString();
			}
		  };
		  // エラー情報クリア - '.cl_valid' クラス一覧が返る。
		  // '.cl_valid' クラスの入力を確認して、エラー情報を埋め込む
		  //									  $('.cl_valid', this.form)
		  this.clear()
			.removeClass('cl_error_field')
			.filter(options.filter)
			.filter('.cl_cm_code_input')
			.each(function () {
			  var $this = $(this),
				  val = $this.val(),
				  data = $this.data('cm_code'),
				  id = data && data.id;
			  if (val && !id) {
				// 共通部品コードセレクターでコードは入力済みだがidが設定されていない
				setError(this, 'cmcodeerror');
			  } else if ($this.hasClass('cl_required') && !id) {
				setError(this, 'required');
			  }
			})
			.end()
		  // cl_required: 入力必須 //////////////////////
			.filter('.cl_required:not(.cl_cm_code_input)')
			.each(function(){
			  var $this = $(this);
			  if ($this.is('select') && $this.val() === '0') {
				setError(this, 'required');
				// AOKI
			  } else if ($this.is('span')) {
				  if ($this.html().length === 0) {
					  setError(this, 'required');
				  }
			  } else if ($this.is('td')) {
				  if (!clutil.chkStr($this.text())) {
					  setError(this, 'required');
				  }
			  } else if (!$this.is('div') && !$(this).val()) {
				// selectpicker用にdivの場合は考えない
				setError(this, 'required');
			  }
			})
			.end()
		  // cl_length: 入力長制限 /////////////////////
			.filter('.cl_length')
			.each(function(){
			  var len = $(this).val().length;
			  var max = $(this).data('max');
			  var min = $(this).data('min');
			  var hasMax = _.isNumber(max);
			  var hasMin = _.isNumber(min);
			  if (hasMax && hasMin) {
				if (len < min) {
				  // {0}が短すぎます。{1}～{2}文字で入力してください。
				  setError(this, 'length_short2', min, max);
				} else if (len > max) {
				  // {0}が長すぎます。{1}～{2}文字で入力してください。
				  setError(this, 'length_long2', min, max);
				}
			  } else if (hasMax) {
				if (len > max) {
				  // {0}が長すぎます。{1}文字以下で入力してください。
				  setError(this, 'length_long1', max);
				}
			  } else if (hasMin) {
				// len == 0 は、cl_required (必須）でチェックすることとする！
				if (len > 0 && len < min) {
				  // {0}が短すぎます。{1}文字以上で入力してください。
				  setError(this, 'length_short1', min);
				}
			  }
			})
			.end()
			.filter('[data-validator]')
			.each(function (i, el) {
			  var $el = $(el),
				  value = $el.val(),
				  validators = _.compact(
					$el.attr('data-validator').split(/ +/)
				  ),
				  errors = _.chain(validators).map(function (validator) {
					return callValidator(validator, value);
				  }).compact().value();

			  if (errors.length) {
				setErrorMsg($el, errors[0]);
				hasError = true;
			  }
			})
			.end()
		  // cl_email: メールアドレス形式 /////////////
			.filter('.cl_email')
			.each(function(){
			  var value = $(this).val();
			  if (value === '') {
				// 空欄はOKとする。必須とするなら、cl_required と併用すること
				return;
			  }
			  if (value.length > 256) {
				setError(this, 'email_long');
				return;
			  }
			  var reg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
			  if (!reg.test(value)) {
				setError(this, 'email');
			  }
			})
			.end()
		  // cl_url: URL形式 //////////////////////////
			.filter('.cl_url')
			.each(function(){
			  var value = $(this).val();
			  if (value === '') {
				// 空欄はOKとする。必須とするなら、cl_required と併用すること
				return;
			  }
			  var reg = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
			  if (!reg.test(value)) {
				setError(this, 'url');
			  }
			})
			.end()
		  // cl_date: 日付 - datepicker によるもの ////
			.filter('.cl_date')
			.each(function(){
			  var value = $(this).val();
			  if (value === '') {
				// 空欄はOKとする。必須とするなら、cl_required と併用すること
				return;
			  }
			  var date = new Date(value);
			  if (!_.isDate(date) || isNaN(date.getTime())) {
				setError(this, 'date_inval');
				return;
			  }
			  var srcymd = value.split('/');
			  var chkymd = [date.getFullYear(), date.getMonth()+1, date.getDate()];
			  if (srcymd.length != chkymd.length) {
				setError(this, 'date_inval');
				return;
			  } else {
				for (var i=0; i<chkymd.length; i++) {
				  if (parseInt(srcymd[i], 10) != chkymd[i]) {
					setError(this, 'date_inval');
					return;
				  }
				}
			  }
			  var maxDate = $(this).datepicker("option", "maxDate");
			  var minDate = $(this).datepicker("option", "minDate");
			  if (maxDate != null && date.getTime() > maxDate.getTime()) {
				// 大きすぎ
				if (minDate != null) {
				  setError(this, 'date_max', dateToYmd(maxDate));
				} else {
				  setError(this, 'date_range', dateToYmd(minDate), dateToYmd(maxDate));
				}
			  }
			  if (minDate != null && date.getTime() < minDate.getTime()) {
				// 小さすぎ
				if (date.getTime() < minDate.getTime()) {
				  setError(this, 'date_min', dateToYmd(minDate));
				} else {
				  setError(this, 'date_range', dateToYmd(minDate), dateToYmd(maxDate));
				}
			  }
			})
			.end()
		  // cl_date: YYYY/mm 形式のチェック
			.filter('.cl_ym')
			.each(function(){
			  var value = $(this).val();
			  if (value === '') {
				// 空欄はOKとする。必須とするなら、cl_required と併用すること
				return;
			  }
			  var match = value.match(/^([0-9]{4,4})\/([0-9]{2,2})$/);
			  if (!match) {
				setError(this, 'month_inval');
				return;
			  }
			  console.log(match);
			  var year = match[1],
				  month = match[2];
			  if (month < 1 || month > 12) {
				setError(this, 'month_inval');
			  }
			})
			.end()
			.filter('.cl_month') // 月
			.each(function(){
			  var value = $(this).val();
			  if (value === '') {
				// 空欄はOKとする。必須とするなら、cl_required と併用すること
				return;
			  }

			  var date = value.split('/');
			  if (date.length !== 2 || !/^[0-9]+$/.test(date[0]) ||
				  !/^[0-9]+$/.test(date[1])) {
				setError(this, 'month_inval');
				return;
			  }
			  if (date[1] < 1 || date[1] > 12) {
				setError(this, 'month_inval');
				return;
			  }
			})
			.end()

			.filter('.cl_zenkaku') // 全角（半角入力を許可してからのチェック）
			.each(function(){
				var val = $(this).val();
				if (!val.length) { // 空はOK!
					return;
				}
				var len = _.reject(val.split(''), clutil.isHalf).length;
				if (len !== val.length) {
					return setError(this, 'zenkaku');
				}
			})
			.end()

			.filter('.cl_hankaku') // 半角（全角入力を許可してからのチェック）
			.each(function(){
				var val = $(this).val();
				var han = clutil.zen2han(val);
				$(this).val(han);
				var han_retStat = clutil.chkzen2han(han);
				if (han_retStat == 0) {
					setError(this, 'hankaku');
					return;
				} else if (han_retStat == -1) {
					setError(this, 'input');
					return;
				}
			})
			.end()

			.filter('.cl_valid') // ,"のチェック
			.each(function(){
				var val = $(this).val();
				if ($(this).attr('data-filter') != 'comma') {
					var han_retStat = clutil.chkzen2han(val);
					if (han_retStat == -1) {
						setError(this, 'input');
						return;
					}
				}
			})
			.end()

			.filter('.cl_time') // 時刻指定
			.each(function(){
			  var value = $(this).val();
			  if (value === '') {
				// 空欄はOKとする。必須とするなら、cl_required と併用すること
				return;
			  }

			  var date = value.split(':');
			  if (date.length !== 2 || !/^[0-9]+$/.test(date[0]) ||
				  !/^[0-9]+$/.test(date[1])) {
				setError(this, 'time_inval');
				return;
			  }
			  if (date[0] < 0 || date[0] > 23) {
				setError(this, 'time_inval');
				return;
			  }
			  if (date[1] < 0 || date[1] > 59) {
				setError(this, 'time_inval');
				return;
			  }
			})
			.end()

		  // cl_regex: 正規表現 ///////////////////////
			.filter('.cl_regex')
			.each(function(){
			  var pat = $(this).data('pattern');
			  var reg = new RegExp(pat);
			  if (!reg.test($(this).val())) {
				// {0}の形式が誤っています。
				setError(this, 'regex');
			  }
			});

		  _($('[data-required2]', this.form)).chain()
			.reduce(function (memo, element) {
			  var attr = $(element).attr('data-required2');
			  memo[attr] = (memo[attr] || []);
			  memo[attr].push(element);
			  return memo;
			}, {})
			.some(function (elements, key) {
			  if (_.all(elements, function (element, id) {
				return $(element).val() === '';
			  })) {
				_.each(elements, function (element) {
				  setError(element, 'required2');
				});
				// すべてチェックするように修正 2013/07/11
//				return true;
			  }
			// すべてチェックするように修正 2013/07/11
//			  return false;
			})
			.value();

		  // どちらかに入力があった場合、入力必須とする
		  _($('[data-required3]', this.form)).chain()
			.reduce(function (memo, element) {
			  var attr = $(element).attr('data-required3');
			  memo[attr] = (memo[attr] || []);
			  memo[attr].push(element);
			  return memo;
			}, {})
			.some(function (elements, key) {
			  if (_.some(elements, function (element, id) {
//				return  $(element).val() !== '' && $(element).val() !== 0 && $(element).val() !== '0';
				return  $(element).val() !== '';
			  })) {
				_.each(elements, function (element) {
//					if ($(element).val() === '' || $(element).val() === 0 || $(element).val() === '0') {
					if ($(element).val() === '') {
						setError(element, 'required');
					}
				});
			  }
			})
			.value();

		  // どちらかに入力があった場合、入力必須とする
		  _($('[data-required03]', this.form)).chain()
			.reduce(function (memo, element) {
			  var attr = $(element).attr('data-required3');
			  memo[attr] = (memo[attr] || []);
			  memo[attr].push(element);
			  return memo;
			}, {})
			.some(function (elements, key) {
			  if (_.some(elements, function (element, id) {
				return  $(element).val() !== '' && $(element).val() !== 0 && $(element).val() !== '0';
			  })) {
				_.each(elements, function (element) {
					if ($(element).val() === '' || $(element).val() === 0 || $(element).val() === '0') {
						setError(element, 'required');
					}
				});
			  }
			})
			.value();

		  if (hasError) {
			if (this.echoback != null) {
			  this.setErrorHeader(clmsg.cl_echoback);
//			  this.echoback.css('display', 'block').html(clmsg.cl_echoback);
			}
			clutil.setFocus($('.cl_error_field', this.form).first());
//	        $('body').scrollTo($('.cl_error_field', this.form).first(), 800);
		  }
		  return !hasError;
		},

        isHalf : function (c) {
console.log("DEBUG: c["+ c +"]");
            return (c >= 0x0 && c < 0x81) || (c == 0xf8f0) ||
              (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
        },

		isHalfStr : function (value) {
console.log("DEBUG: value["+ value +"]");
            var length, valueLength = value.length;
            for (length = 0; length < valueLength; length++) {
              if (!this.isHalf(value.charCodeAt(length)))
                return false;
            }
            return true;
        },

		/**
		 * from>toのチェックを行う
		 * AOKI
		 * @param chkInfo
		 * [ {
		 *	 stval : 開始inputのid名,
		 *	 edval : 終了inputのid名,
		 *	 orequalto : from>=toのチェックを行う場合trueを指定。なにも指定されていない、nullの場合はfrom>toチェックをする
		 * }, {
		 *	 stval : 開始inputのid名,
		 *	 edval : 終了inputのid名
		 * }, { ...
		 * } ]
		 * @example
		 * validFromTo([ {stval: 'stdate', edval: 'eddate'}, {stval: 'age_st', edval: 'age_ed'}, ... } ] )
		 *
		 * 戻り値
		 * ・true				: 大小チェック正常
		 * ・false				: 大小チェック反転
		 */
		validFromTo : function(chkInfo){
		  if (chkInfo == null || chkInfo.length === 0) {
			return true;
		  }

		  var errInfo = {};
		  var errFlag = false;

		  for (var i = 0; i < chkInfo.length; i++ ) {
			var stval = chkInfo[i].stval;
			var edval=	chkInfo[i].edval;
			var $stval = $('#' + stval)[0];
			var $edval = $('#' + edval)[0];
			var orequalto = chkInfo[i].orequalto == null ? false : chkInfo[i].orequalto;

			// 文字種チェックを行う #20150516
			if( $stval != null && $stval.value != null ){
				if( !this.isHalfStr($stval.value) ){
				  errInfo[stval] = clmsg.cl_zen2han;
				  errFlag = true;
				}
			}
			if( $edval != null && $edval.value != null ){
				if( !this.isHalfStr($edval.value) ){
				  errInfo[edval] = clmsg.cl_zen2han;
				  errFlag = true;
				}
			}
			if( errFlag == true )
				continue;

			// ヌルチェック
			if ($stval.value == null || $stval.value === '' ||
				$edval.value == null || $edval.value === '') {
			  continue;
			}

			if (orequalto) {

			  // from>=toチェックを行う
			  if ($($stval).hasClass('cl_date') && $($edval).hasClass('cl_date')) {
				// 日付大小チェック
				if (clutil.dateFormat($stval.value, 'yyyymmdd') >= clutil.dateFormat($edval.value, 'yyyymmdd')) {
				  errInfo[stval] = clmsg.cl_date_error;
				  errInfo[edval] = clmsg.cl_date_error;
				  errFlag = true;
				}
			  } else if ($($stval).hasClass('cl_month') && $($edval).hasClass('cl_month')) {
				// 月大小チェック
				if (clutil.monthFormat($stval.value, 'yyyymm') >= clutil.monthFormat($edval.value, 'yyyymm')) {
				  errInfo[stval] = clmsg.cl_month_error;
				  errInfo[edval] = clmsg.cl_month_error;
				  errFlag = true;
				}
			  } else if ($($stval).hasClass('cl_time') && $($edval).hasClass('cl_time')) {
				// 時刻大小チェック
				if (clutil.timeFormat($stval.value, 'hhmm') >= clutil.timeFormat($edval.value, 'hhmm')) {
				  errInfo[stval] = clmsg.cl_time_error;
				  errInfo[edval] = clmsg.cl_time_error;
				  errFlag = true;
				}
			  } else {
				// 数値大小チェック
				// カンマ除去
				var stNum = $.inputlimiter.unmask($stval.value, {
				  limit: $($stval).attr('data-limit'),
				  filter: $($stval).attr('data-filter')
				});
				var edNum = $.inputlimiter.unmask($edval.value, {
				  limit: $($edval).attr('data-limit'),
				  filter: $($edval).attr('data-filter')
				});
				if (Number(stNum) >= Number(edNum)) {
				  errInfo[stval] = clmsg.cl_fromto_error;
				  errInfo[edval] = clmsg.cl_fromto_error;
				  errFlag = true;
				}
			  }
			} else {
			  if ($($stval).hasClass('cl_date') && $($edval).hasClass('cl_date')) {
				// 日付大小チェック
				if (clutil.dateFormat($stval.value, 'yyyymmdd') > clutil.dateFormat($edval.value, 'yyyymmdd')) {
				  errInfo[stval] = clmsg.cl_date_error;
				  errInfo[edval] = clmsg.cl_date_error;
				  errFlag = true;
				}
			  } else if ($($stval).hasClass('cl_month') && $($edval).hasClass('cl_month')) {
				// 月大小チェック
				if (clutil.monthFormat($stval.value, 'yyyymm') > clutil.monthFormat($edval.value, 'yyyymm')) {
				  errInfo[stval] = clmsg.cl_month_error;
				  errInfo[edval] = clmsg.cl_month_error;
				  errFlag = true;
				}
			  } else if ($($stval).hasClass('cl_time') && $($edval).hasClass('cl_time')) {
				// 時刻大小チェック
				if (clutil.timeFormat($stval.value, 'hhmm') > clutil.timeFormat($edval.value, 'hhmm')) {
				  errInfo[stval] = clmsg.cl_time_error;
				  errInfo[edval] = clmsg.cl_time_error;
				  errFlag = true;
				}
			  } else {
				// 数値大小チェック
				var stNum = $.inputlimiter.unmask($stval.value, {
				  limit: $($stval).attr('data-limit'),
				  filter: $($stval).attr('data-filter')
				});
				var edNum = $.inputlimiter.unmask($edval.value, {
				  limit: $($edval).attr('data-limit'),
				  filter: $($edval).attr('data-filter')
				});
				if (Number(stNum) > Number(edNum)) {
				  errInfo[stval] = clmsg.cl_fromto_error;
				  errInfo[edval] = clmsg.cl_fromto_error;
				  errFlag = true;
				}
			  }
			}

		  }
		  if (errFlag) {
			this.setErrorInfo(errInfo);
			return false;
		  }

		  return true;
		},

		/**
		 * from>toのチェックを行う(オブジェクトを引数とするver)
		 * AOKI
		 * @param chkInfo
		 * [ {
		 *	 $stval : 開始inputのオブジェクト,
		 *	 $edval : 終了inputのオブジェクト,
		 *	 orequalto : from>=toのチェックを行う場合trueを指定。なにも指定されていない、nullの場合はfrom>toチェックをする
		 * }, {
		 *	 $stval : 開始inputのオブジェクト,
		 *	 $edval : 終了inputのオブジェクト
		 * }, { ...
		 * } ]
		 * @example
		 * validFromTo([ {$stval: $('#stdate'), $edval: $('#eddate')}, {$stval: $('#age_st'), $edval: $('#age_ed')}, ... } ] )
		 *
		 * 戻り値
		 * ・true				: 大小チェック正常
		 * ・false				: 大小チェック反転
		 */
		validFromToObj : function(chkInfo){
		  if (chkInfo == null || chkInfo.length === 0) {
			return true;
		  }

		  var errInfo = {};
		  var errFlag = false;

		  for (var i = 0; i < chkInfo.length; i++ ) {
			var $stval = chkInfo[i].$stval;
			var $edval = chkInfo[i].$edval;
			var orequalto = chkInfo[i].orequalto == null ? false : chkInfo[i].orequalto;

			// ヌルチェック
			if ($stval.val() == null || $stval.val() === '' ||
				$edval.val() == null || $edval.val() === '') {
			  continue;
			}

			if (orequalto) {
			  // from>=toチェックを行う
			  if ($($stval).hasClass('cl_date') && $($edval).hasClass('cl_date')) {
				// 日付大小チェック
				if (clutil.dateFormat($stval.val(), 'yyyymmdd') >= clutil.dateFormat($edval.val(), 'yyyymmdd')) {
				  this.setErrorMsg($stval, clmsg.cl_date_error);
				  this.setErrorMsg($edval, clmsg.cl_date_error);
				  errFlag = true;
				}
			  } else if ($($stval).hasClass('cl_month') && $($edval).hasClass('cl_month')) {
				// 月大小チェック
				if (clutil.monthFormat($stval.val(), 'yyyymm') >= clutil.monthFormat($edval.val(), 'yyyymm')) {
				  this.setErrorMsg($stval, clmsg.cl_month_error);
				  this.setErrorMsg($edval, clmsg.cl_month_error);
				  errFlag = true;
				}
			  } else if ($($stval).hasClass('cl_time') && $($edval).hasClass('cl_time')) {
				// 時刻大小チェック
				if (clutil.timeFormat($stval.val(), 'hhmm') >= clutil.timeFormat($edval.val(), 'hhmm')) {
				  this.setErrorMsg($stval, clmsg.cl_time_error);
				  this.setErrorMsg($edval, clmsg.cl_time_error);
				  errFlag = true;
				}
			  } else {
				var stNum = $.inputlimiter.unmask($stval.val(), {
				  limit: $stval.attr('data-limit'),
				  filter: $stval.attr('data-filter')
				});
				var edNum = $.inputlimiter.unmask($edval.val(), {
				  limit: $edval.attr('data-limit'),
				  filter: $edval.attr('data-filter')
				});
				// 数値大小チェック
				if (Number(stNum) >= Number(edNum)) {
				  this.setErrorMsg($stval, clmsg.cl_fromto_error);
				  this.setErrorMsg($edval, clmsg.cl_fromto_error);
				  errFlag = true;
				}
			  }
			} else {
			  if ($($stval).hasClass('cl_date') && $($edval).hasClass('cl_date')) {
				// 日付大小チェック
				if (clutil.dateFormat($stval.val(), 'yyyymmdd') > clutil.dateFormat($edval.val(), 'yyyymmdd')) {
				  this.setErrorMsg($stval, clmsg.cl_date_error);
				  this.setErrorMsg($edval, clmsg.cl_date_error);
				  errFlag = true;
				}
			  } else if ($($stval).hasClass('cl_month') && $($edval).hasClass('cl_month')) {
				// 月大小チェック
				if (clutil.monthFormat($stval.val(), 'yyyymm') > clutil.monthFormat($edval.val(), 'yyyymm')) {
				  this.setErrorMsg($stval, clmsg.cl_month_error);
				  this.setErrorMsg($edval, clmsg.cl_month_error);
				  errFlag = true;
				}
			  } else if ($($stval).hasClass('cl_time') && $($edval).hasClass('cl_time')) {
				// 時刻大小チェック
				if (clutil.timeFormat($stval.val(), 'hhmm') > clutil.timeFormat($edval.val(), 'hhmm')) {
				  this.setErrorMsg($stval, clmsg.cl_time_error);
				  this.setErrorMsg($edval, clmsg.cl_time_error);
				  errFlag = true;
				}
			  } else {
				var stNum = $.inputlimiter.unmask($stval.val(), {
				  limit: $stval.attr('data-limit'),
				  filter: $stval.attr('data-filter')
				});
				var edNum = $.inputlimiter.unmask($edval.val(), {
				  limit: $edval.attr('data-limit'),
				  filter: $edval.attr('data-filter')
				});
				// 数値大小チェック
				if (Number(stNum) > Number(edNum)) {
				  this.setErrorMsg($stval, clmsg.cl_fromto_error);
				  this.setErrorMsg($edval, clmsg.cl_fromto_error);
				  errFlag = true;
				}
			  }
			}

		  }
		  if (errFlag) {
			this.setErrorHeader(clmsg.cl_echoback);
			return false;
		  }

		  return true;
		},

		/**
		 * 最初のエラー項目にフォーカスを当てる
		 */
		setErrorFocus: function() {
			var errField = $('.cl_error_field');
			$.each(errField, function() {
				if ($(this).is('input') || $(this).is('textarea') || $(this).is('button')) {
					clutil.setFocus($(this));
//			        $('body').scrollTo($(this), 800);
					return false;
				}
			});
		}
	  };

	  defaultValidator.form = form;
	  if (arguments.length > 0) {
		$.extend(defaultValidator, options);
	  }

	  /**
	   * 2013/12/25追加
	   * クリックするとエラーメッセージが消える
	   */
	  defaultValidator.echoback.click(function() {
		defaultValidator.echoback.stop();
		defaultValidator.echoback.fadeOut('300');
	  });

	  return defaultValidator;
	},

    /**
     * <IMG>タグ要素に対して画像切替操作のユーティリティを提供。
     * @param imgElem <IMG>タグ要素
     * @returns {___anonymous92_104}
     */
	imgViewUtil : function(imgElem, errImg){
    	var util = {
    		imgEl : imgElem,
    		errImg : errImg,
    		data : null,	// 任意データを一時的に預ける領域

    		initialize : function() {
    			var me = this;
    			this.imgEl.error(function(e){
    				me.setImage(me.errImg);
    			});

    			this.imgEl.load(function(){
    				me.onImgLoaded();
    			});
    			return this;
    		},

    		/**
    		 * 再読み込みする
    		 */
    		reload : function() {
    			var curSrc = this.imgEl.attr('src');
    			if (curSrc.length > 0) {
    				// 一旦 src 属性を削除してから再設定
    				this.imgEl.removeAttr('src').attr('src', curSrc);
    			}
    		},

    		/**
    		 * 画像を設定する
    		 * @param srcURI
    		 */
    		setImage : function(srcURI) {
    			return this.imgEl.attr('src', srcURI);
    		},
    		/**
    		 * 表示中の画像URIを取得する
    		 */
    		getImage : function() {
    			return this.imgEl.attr('src');
    		},
    		/**
    		 * 画像を削除する
    		 */
    		removeImage : function() {
    			return this.imgEl.removeAttr('src');
    		},
    		/**
    		 * 画像読み込み通知
    		 */
    		onImgLoaded : function() {
    			// this = imgEl
    			console.log('Loaded: ' + $(this).attr('src'));
    		}
    	};
    	return util.initialize();
    },

    /**
     * 実際の画像のサイズを取得する
     * @param image
     * @returns
     */
    getActualDimension: function(image) {
        var mem, w, h, key = "actual";

        // for Firefox, Safari, Google Chrome
        if ("naturalWidth" in image) {
            return {width: image.naturalWidth, height: image.naturalHeight};
        }
        if ("src" in image) { // HTMLImageElement
            if (image[key] && image[key].src === image.src) {return  image[key];}

            if (document.uniqueID) { // for IE
                w = $(image).css("width");
                h = $(image).css("height");
            } else { // for Opera and Other
                mem = {w: image.width, h: image.height}; // keep current style
                $(this).removeAttr("width").removeAttr("height").css({width:"",  height:""});    // Remove attributes in case img-element has set width  and height (for webkit browsers)
                w = image.width;
                h = image.height;
                image.width  = mem.w; // restore
                image.height = mem.h;
            }
            return image[key] = {width: w, height: h, src: image.src}; // bond
        }

        // HTMLCanvasElement
        return {width: image.width, height: image.height};
    },

	/**
	 * 日付形式の判定をする
	 */
    checkDate : function (value, minDate, maxDate) {
        if (value === '') {
          // 空欄はOKとする。必須とするなら、cl_required と併用すること
          return;
        }

        minDate = new Date(minDate || clutil.ymd2date(clcom.min_date));
        maxDate = new Date(maxDate || clutil.ymd2date(clcom.max_date));

        var date, srcymd;
        if (~value.indexOf('/')) {
          // slashが含まれている場合
          date = new Date(value);
          srcymd = value.split('/');
        } else {
          // /なしの場合
          date = clutil.ymd2date(value);
          srcymd = [value.substring(0,4), value.substring(4,6), value.substring(6)];
        }

        if (!_.isDate(date) || isNaN(date.getTime())) {
          return false;
        }

        var chkymd = [date.getFullYear(), date.getMonth()+1, date.getDate()];
        if (srcymd.length != chkymd.length) {
          return false;
        } else {
          for (var i=0; i<chkymd.length; i++) {
            if (parseInt(srcymd[i], 10) !== chkymd[i]) {
              return false;
            }
          }
        }

        if (date.getTime() > maxDate.getTime() || date.getTime() < minDate.getTime()) {
            return false;
        }
      },

	/**
     * yyyymmdd形式からDateオブジェクトへ変換
     */
    ymd2date: function (ymd) {
      var y, m, d, n = parseInt(ymd, 10);
      d = n % 100;
      n = Math.floor(n / 100);
      m = n % 100;
      y = Math.floor(n / 100);
      return new Date(y, m - 1, d);
    },

	/**
	 * 指定した日付形式に変換する
	 * AOKI
	 * @param {string}
	 *					・int型8桁	または
	 *					・yyyy/mm/dd
	 * @param {string} format yyyy-mm-dd, yyyy/mm/dd, yyyy/mm/dd hh:ss, yyyymmdd
	 * @returns 文字列
	 */
	dateFormat : function(obj, format) {

	  if (typeof obj === 'string' && !~obj.indexOf('/')) {
		obj = parseInt(obj, 10);
	  }

	  if (!obj) {
		return "";
	  } else if (typeof obj == "number") {
		// サーバーからは8桁の数値で来る事を想定
		var n_year = Math.floor(obj/10000);
		var n_month = Math.floor((obj%10000)/100);
		var n_day = Math.floor(obj%100);

		obj = clutil.fmt('{0}/{1}/{2}', n_year, n_month, n_day);
	  }
	  var twodigit = function(obj) {
		if (obj < 10) {
		  obj = '0' + obj;
		}
		return obj;
	  };

	  var dateObj = new Date(obj);
	  if (! dateObj.valueOf()) {
		var sqlDateStr = obj.replace(/:| |T/g,"-");
		var YMDhms = sqlDateStr.split("-");
		dateObj.setFullYear(parseInt(YMDhms[0], 10), parseInt(YMDhms[1], 10)-1, parseInt(YMDhms[2], 10));
		dateObj.setHours(parseInt(YMDhms[3], 10), parseInt(YMDhms[4], 10), parseInt(YMDhms[5], 10), 0/*msValue*/);
	  }
	  var year = dateObj.getFullYear();
	  var month = twodigit(dateObj.getMonth()+1);
	  var day = twodigit(dateObj.getDate());
	  var hours = twodigit(dateObj.getHours());
	  var minutes = twodigit(dateObj.getMinutes());


	  switch (format) {
	  case 'yyyymmdd':		  // サーバーに送る型
		return Number(clutil.fmt('{0}{1}{2}', year, month, day));
	  case 'yyyy-mm-dd':	  // サーバーに送る型OLD
		return clutil.fmt('{0}-{1}-{2}', year, month, day);
	  case 'yyyy/mm/dd':
		return clutil.fmt('{0}/{1}/{2}', year, month, day);
		//case 'yyyy/mm/dd hh:ss':
	  case 'yyyymm':
		return Number(clutil.fmt('{0}{1}', year, month));
	  case 'yyyy':
		return Number(clutil.fmt('{0}', year));
	  case 'mm':
		return Number(clutil.fmt('{0}', month));
	  case 'dd':
		  return Number(clutil.fmt('{0}', day));
	  default:
		return clutil.fmt('{0}/{1}/{2} {3}:{4}'
						  , year, month, day, hours, minutes);
	  }
	},

	/**
	 * 指定した日付を月形式に変換する
	 * AOKI
	 * @param {string}
	 *					・int型6桁、8桁	または
	 *					・yyyy/mm
	 * @param {string} format yyyy/mm, yyyymm
	 * @returns {String}
	 */
	monthFormat : function(obj, format) {
	  var year;
	  var month;
	  if (obj == null || obj === "") {
		return "";
	  }
	  var twodigit = function(obj) {
		if (obj < 10) {
		  obj = '0' + obj;
		}
		return obj;
	  };

	  var date = obj;

	  if (typeof obj === 'string') {
		date = obj.replace("/", "");
	  }

	  // 5桁の場合
	  if (date < 100000) {
		year = Math.floor(date/10);
		month = twodigit(Math.floor(date%10));
	  } else if (date > 9999999) {
		// 8桁の場合も対応
		year = Math.floor(date/10000);
		month = twodigit(Math.floor((date%10000)/100));
	  } else {
		year = Math.floor(date/100);
		month = twodigit(Math.floor(date%100));
	  }

	  switch (format) {
	  case 'yyyymm':		// サーバーに送る型
		return Number(clutil.fmt('{0}{1}', year, month));
	  case 'yyyy/mm':
		return clutil.fmt('{0}/{1}', year, month);
	  default:
		return clutil.fmt('{0}/{1}', year, month);
	  }
	},

	/**
	 * 指定した時刻を時刻形式に変換する
	 * @param {string}
	 *					・int型4桁	または
	 *					・hh:mm
	 * @param {string} format hh:mm, hhmm
	 * @returns {String}
	 */
	timeFormat : function(obj, format) {
	  var hour;
	  var minute;
	  if (obj == null || obj === "") {
		return "";
	  }
	  var twodigit = function(obj) {
		if (obj < 10) {
		  obj = '0' + obj;
		}
		return obj;
	  };

	  var time = obj;

	  if (typeof obj === 'string') {
		time = obj.replace(":", "");
	  }

	  hour = Math.floor(time/100);
	  minute = twodigit(Math.floor(time%100));

	  switch (format) {
	  case 'hhmm':		  // サーバーに送る型
		return Number(clutil.fmt('{0}{1}', hour, minute));
	  case 'hh:mm':
	  default:
		return clutil.fmt('{0}:{1}', hour, minute);
	  }
	},

	/**
	 * AOKI
	 * 年月を表示用に変換
	 * 引数
	 * ・yymm			: 年月の4桁
	 */
	iymFmt: function(yymm) {
		if (yymm == null) {
			return "";
		}
		var yy = parseInt(yymm/100);
		var mm = yymm%100;
		var yystr = yy != 0 ? yy + '年' : '';
		if (yy == 0) {
			// 0年の場合は無条件に表示
			var mmstr = mm + 'ヶ月';
		} else {
			var mmstr = mm != 0 ? mm + 'ヶ月' : '';
		}
		return yystr + mmstr;
	},

	/**
	 * 指定した数日後の日付形式に変換する
	 * AOKI
	 * @param {string}
	 *					・int型8桁	または
	 *					・yyyy/mm/dd
	 * @param {string} format yyyy-mm-dd, yyyy/mm/dd, yyyy/mm/dd hh:ss, yyyymmdd
	 * @param {int}	addDays 数日後
	 * @returns 文字列
	 */
	computeDays : function(obj, format, addDays) {
		if (typeof obj === 'string' && !~obj.indexOf('/')) {
			obj = parseInt(obj, 10);
		  }

		  if (!obj) {
			return "";
		  } else if (typeof obj == "number") {
			// サーバーからは8桁の数値で来る事を想定
			var n_year = Math.floor(obj/10000);
			var n_month = Math.floor((obj%10000)/100);
			var n_day = Math.floor(obj%100);

			obj = clutil.fmt('{0}/{1}/{2}', n_year, n_month, n_day);
		  }
		  var twodigit = function(obj) {
			if (obj < 10) {
			  obj = '0' + obj;
			}
			return obj;
		  };

		  var dateObj = new Date(obj);
		  if (! dateObj.valueOf()) {
			var sqlDateStr = obj.replace(/:| |T/g,"-");
			var YMDhms = sqlDateStr.split("-");
			dateObj.setFullYear(parseInt(YMDhms[0], 10), parseInt(YMDhms[1], 10)-1, parseInt(YMDhms[2], 10));
			dateObj.setHours(parseInt(YMDhms[3], 10), parseInt(YMDhms[4], 10), parseInt(YMDhms[5], 10), 0/*msValue*/);
		  }

		  var baseSec = dateObj.getTime();
		  var addSec = addDays * 86400000;//日数 * 1日のミリ秒数
		  var targetSec = baseSec + addSec;
		  dateObj.setTime(targetSec);

		  var year = dateObj.getFullYear();
		  var month = dateObj.getMonth()+1;
		  var day = twodigit(dateObj.getDate());
		  var hours = twodigit(dateObj.getHours());
		  var minutes = twodigit(dateObj.getMinutes());

		  switch (format) {
		  case 'yyyymmdd':		  // サーバーに送る型
			return Number(clutil.fmt('{0}{1}{2}', year, month, day));
		  case 'yyyy-mm-dd':	  // サーバーに送る型OLD
			return clutil.fmt('{0}-{1}-{2}', year, month, day);
		  case 'yyyy/mm/dd':
			return clutil.fmt('{0}/{1}/{2}', year, month, day);
			//case 'yyyy/mm/dd hh:ss':
		  case 'yyyymm':
			return Number(clutil.fmt('{0}{1}', year, month));
		  case 'yyyy':
			return Number(clutil.fmt('{0}', year));
		  default:
			return clutil.fmt('{0}/{1}/{2} {3}:{4}'
							  , year, month, day, hours, minutes);
		  }
	},

	/**
	 * 指定した数ヶ月後の日付形式に変換する
	 * AOKI
	 * @param {string}
	 *					・int型8桁	または
	 *					・yyyy/mm/dd
	 * @param {string} format yyyy-mm-dd, yyyy/mm/dd, yyyy/mm/dd hh:ss, yyyymmdd
	 * @param {int}	addMonths 数ヶ月後
	 * @returns 文字列
	 */
	computeMonth : function(obj, format, addMonths) {
		if (typeof obj === 'string' && !~obj.indexOf('/')) {
			obj = parseInt(obj, 10);
		  }

		  if (!obj) {
			return "";
		  } else if (typeof obj == "number") {
			// サーバーからは8桁の数値で来る事を想定
			var n_year = Math.floor(obj/10000);
			var n_month = Math.floor((obj%10000)/100);
			var n_day = Math.floor(obj%100);

			obj = clutil.fmt('{0}/{1}/{2}', n_year, n_month, n_day);
		  }

		  // 1桁数値を2桁文字列に揃える
		  var twodigit = function(obj) {
			if (obj < 10) {
			  obj = '0' + obj;
			}
			return obj;
		  };
		  // Month 加減算術関数
		  var addMonth = function(dateObj, dMonth) {
			if (dMonth == null || dMonth == 0) {
				return dateObj;
			}
			var y = dateObj.getFullYear();
			var m = dateObj.getMonth();
			var d = dateObj.getDate();
			var calcDate = new Date(y, (m + dMonth), d);
			var over1stDate = new Date(y, (m + dMonth + 1), 1);
			if (calcDate.getTime() >= over1stDate.getTime()) {
				calcDate = new Date(calcDate.getFullYear(), calcDate.getMonth(), 0);
			}
			calcDate.setHours(dateObj.getHours());
			calcDate.setMinutes(dateObj.getMinutes());
			calcDate.setSeconds(dateObj.getSeconds());
			calcDate.setMilliseconds(dateObj.getMilliseconds());
			return calcDate;
		  };

		  var dateObj = new Date(obj);
		  if (! dateObj.valueOf()) {
			var sqlDateStr = obj.replace(/:| |T/g,"-");
			var YMDhms = sqlDateStr.split("-");
			dateObj.setFullYear(parseInt(YMDhms[0], 10), parseInt(YMDhms[1], 10)-1, parseInt(YMDhms[2], 10));
			dateObj.setHours(parseInt(YMDhms[3], 10), parseInt(YMDhms[4], 10), parseInt(YMDhms[5], 10), 0/*msValue*/);
		  }
		  var calcDate = addMonth(dateObj, addMonths);
		  var year = calcDate.getFullYear();
		  var month = twodigit(calcDate.getMonth()+1);
		  var day = twodigit(calcDate.getDate());
		  var hours = twodigit(calcDate.getHours());
		  var minutes = twodigit(calcDate.getMinutes());

		  switch (format) {
		  case 'yyyymmdd':		  // サーバーに送る型
			return Number(clutil.fmt('{0}{1}{2}', year, month, day));
		  case 'yyyy-mm-dd':	  // サーバーに送る型OLD
			return clutil.fmt('{0}-{1}-{2}', year, month, day);
		  case 'yyyy/mm/dd':
			return clutil.fmt('{0}/{1}/{2}', year, month, day);
			//case 'yyyy/mm/dd hh:ss':
		  case 'yyyymm':
			return Number(clutil.fmt('{0}{1}', year, month));
		  case 'yyyy':
			return Number(clutil.fmt('{0}', year));
		  default:
			return clutil.fmt('{0}/{1}/{2} {3}:{4}'
							  , year, month, day, hours, minutes);
		  }
	},


	/**
	 * 指定した数年後の日付形式に変換する
	 * AOKI
	 * @param {string}
	 *					・int型8桁	または
	 *					・yyyy/mm/dd
	 * @param {string} format yyyy-mm-dd, yyyy/mm/dd, yyyy/mm/dd hh:ss, yyyymmdd
	 * @param {int}	addYears 数年後
	 * @returns 文字列
	 */
	computeYear : function(obj, format, addYears) {
		if (typeof obj === 'string' && !~obj.indexOf('/')) {
			obj = parseInt(obj, 10);
		  }

		  if (!obj) {
			return "";
		  } else if (typeof obj == "number") {
			// サーバーからは8桁の数値で来る事を想定
			var n_year = Math.floor(obj/10000);
			var n_month = Math.floor((obj%10000)/100);
			var n_day = Math.floor(obj%100);

			obj = clutil.fmt('{0}/{1}/{2}', n_year, n_month, n_day);
		  }
		  var twodigit = function(obj) {
			if (obj < 10) {
			  obj = '0' + obj;
			}
			return obj;
		  };

		  var dateObj = new Date(obj);
		  if (! dateObj.valueOf()) {
			var sqlDateStr = obj.replace(/:| |T/g,"-");
			var YMDhms = sqlDateStr.split("-");
			dateObj.setFullYear(parseInt(YMDhms[0], 10), parseInt(YMDhms[1], 10)-1, parseInt(YMDhms[2], 10));
			dateObj.setHours(parseInt(YMDhms[3], 10), parseInt(YMDhms[4], 10), parseInt(YMDhms[5], 10), 0/*msValue*/);
		  }
		  var year = dateObj.getFullYear();
		  var month = twodigit(dateObj.getMonth()+1);
		  var day = twodigit(dateObj.getDate());
		  var hours = twodigit(dateObj.getHours());
		  var minutes = twodigit(dateObj.getMinutes());

		  // うるう年で2/29指定の場合は2/28指定に変換する
		  if (clutil.checkLeapyear(year)) {
			  if (month == '02' && day == '29') {
				  day = '28';
			  }
		  }
		  year = year + addYears;

		  switch (format) {
		  case 'yyyymmdd':		  // サーバーに送る型
			return Number(clutil.fmt('{0}{1}{2}', year, month, day));
		  case 'yyyy-mm-dd':	  // サーバーに送る型OLD
			return clutil.fmt('{0}-{1}-{2}', year, month, day);
		  case 'yyyy/mm/dd':
			return clutil.fmt('{0}/{1}/{2}', year, month, day);
			//case 'yyyy/mm/dd hh:ss':
		  case 'yyyymm':
			return Number(clutil.fmt('{0}{1}', year, month));
		  case 'yyyy':
			return Number(clutil.fmt('{0}', year));
		  default:
			return clutil.fmt('{0}/{1}/{2} {3}:{4}'
							  , year, month, day, hours, minutes);
		  }
	},

	/**
	 * うるう年判定
	 * true:うるう年
	 * false:うるう年でない
	 */
	checkLeapyear : function(year) {
	    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
	},

	/**
	 * 文字列取得
	 */
	cStr : function(str) {
	  if (str == null || str.length === 0) {
		return "";
	  } else {
		return str;
	  }
	},

	/**
	 * 文字列判定
	 */
	chkStr : function(str) {
	  if (typeof str != "string") {
		return false;
	  }
	  var cstr = str.replace(/\s+/g, "");
	  if (cstr == null || cstr.length === 0) {
		return false;
	  } else {
		return true;
	  }
	},

	/**
	 * 数値取得
	 */
	cInt : function(intValue) {
	  if (typeof intValue != "number" || isNaN(intValue)) {
		return 0;
	  } else {
		return intValue;
	  }
	},

	/**
	 * 数値変換
	 */
	pInt : function(intValue) {
	  if (isNaN(parseInt(intValue))) {
		return 0;
	  } else {
		return parseInt(intValue);
	  }
	},

	/**
	 * 表示エリアよりデータオブジェクトを作成する
	 * 指定したプレフィックスを除去したidの名前で作成する
	 * ラジオボタンのみnameで検索する
	 * 引数
	 * ・$view		: jQueryオブジェクト (例：$('#viewarea'))
	 * ・prefix		: アプリ固有のプレフィックス 指定されない場合は 'ca_'
	 * ・resultdata : 作成するデータオブジェクトを上書きする場合はオブジェクトを指定
	 *							  なにも指定されていない場合は新しいオブジェクトを作成する
	 * 戻り値
	 * ・オブジェクト
	 */
	view2data: function($view, prefix, resultdata) {
	  resultdata = resultdata == null ? {} : resultdata;
	  var _prefix = prefix ? prefix : 'ca_';
	  var _id = '';
	  $view
		.find("input[id]")
		.filter('[type="text"]').each(function(){
		  var $this = $(this);
		  console.log(this);
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  if ($(this).hasClass('cl_date')) {
			// datepickerの場合は日付をサーバーに送る型に変換する
			resultdata[_id] = clutil.dateFormat(this.value, 'yyyymmdd');
		  } else if ($(this).hasClass('cl_month')) {
			// 月選択の場合は月をサーバーに送る型に変換する
			resultdata[_id] = clutil.monthFormat(this.value, 'yyyymm');
		  } else  if ($(this).hasClass('cl_time')) {
			// 時刻選択の場合は時刻をサーバーに送る型に変換する
			resultdata[_id] = clutil.timeFormat(this.value, 'hhmm');
		  } else {
			resultdata[_id] = $.inputlimiter.unmask($this.val(), {
			  limit: $this.attr('data-limit'),
			  filter: $this.attr('data-filter')
			});
		  }
		})
		.end()
		.filter('[type="hidden"]').each(function(){
		  console.log(this);
		  // hiddenのものに対しても処理を行う(idなど)
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  resultdata[_id] = this.value;
		})
		.end()
		.filter('[type="password"]').each(function(){
		  console.log(this);
		  // パスワード
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  resultdata[_id] = this.value;
		})
		.end()
		.filter('[type="checkbox"]').each(function(){
		  console.log(this);
		  // チェックボックス
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  resultdata[_id] = this.checked ? 1 : 0;
		})
		.end()
		.end()
		.find("input[name]")
		.filter('[type="radio"]').each(function(){
		  console.log(this);
		  // ラジオボタン
		  // nameで取得する
		  if(this.checked){
			// プレフィックスを除去する
			_id = (this.name).replace(_prefix, "");
			// チェックされていたらデータ化する
			resultdata[_id] = this.value;
		  }
		})
		.end()
		.end()
		.find("textarea[id]").each(function(){
		  console.log(this);
		  // テキストエリア
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  resultdata[_id] = this.value;
		})
		.end()
		.find("select[id]").each(function(){
		  console.log(this);
		  // コンボボックス(マルチセレクト未サポート)
		  // valueの値が取得される
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  resultdata[_id] = this.value;
		})
		.end()
		.find("span[id]").each(function(){
		  var $this = $(this);
		  console.log(this);
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  if ($(this).hasClass('cl_date')) {
			// datepickerの場合は日付をサーバーに送る型に変換する
			resultdata[_id] = clutil.dateFormat($(this).text(), 'yyyymmdd');
		  } else {
			resultdata[_id] = $.inputlimiter.unmask($(this).text(), {
			  limit: $this.attr('data-limit'),
			  filter: $this.attr('data-filter')
			});
		  }
		})
		.end()
		.find("p[id]").each(function(){
		  var $this = $(this);
		  console.log(this);
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  if ($(this).hasClass('cl_date')) {
			// datepickerの場合は日付をサーバーに送る型に変換する
			resultdata[_id] = clutil.dateFormat($(this).text(), 'yyyymmdd');
		  } else {
			resultdata[_id] = $.inputlimiter.unmask($(this).text(), {
			  limit: $this.attr('data-limit'),
			  filter: $this.attr('data-filter')
			});
		  }
		})
		.end();
	  return resultdata;
	},
	/**
	 * データオブジェクトより表示エリアを作成する
	 * 指定したプレフィックスを追加したidの名前で作成する
	 * ラジオボタンのみnameで検索する
	 * 引数
	 * ・$view : 表示エリアのjQueryオブジェクト (例：$('#viewarea'))
	 * ・resultdata : データオブジェクト
	 * ・prefix		: アプリ固有のプレフィックス 指定されない場合は 'ca_'
	 * 戻り値
	 * ・なし
	 */
	data2view: function($view, resultdata, prefix) {
	  var _prefix = prefix ? prefix : 'ca_';
	  var _id = '';

	  function mask($el, value) {
		return $.inputlimiter.mask(value, {
		  limit: $el.attr('data-limit'),
		  filter: $el.attr('data-filter')
		});
	  }

	  $view
		.find("input[id]")
		.filter('[type="text"]').each(function(){
		  console.log(this);
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  if (resultdata[_id] == null) {
			// なにもしない
			return;
		  } else if ($(this).hasClass('cl_date')) {
			// datepickerの場合は日付を表示用に変換する
			this.value = clutil.dateFormat(resultdata[_id], 'yyyy/mm/dd');
		  } else if ($(this).hasClass('cl_month')) {
			// 月指定の場合は日付を表示用に変換する
			this.value = clutil.monthFormat(resultdata[_id], 'yyyy/mm');
		  } else if ($(this).hasClass('cl_time')) {
			// 時刻指定の場合は時刻を表示用に変換する
			this.value = clutil.timeFormat(resultdata[_id], 'hh:mm');
		  } else {
			this.value = clutil.cStr(mask($(this), resultdata[_id]));
		  }
		})
		.end()
		.filter('[type="hidden"]').each(function(){
		  console.log(this);
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  if (resultdata[_id] == null) {
			// なにもしない
			return;
		  }
		  // hidden
		  this.value = clutil.cStr(resultdata[_id]);
		})
		.end()
		.filter('[type="password"]').each(function(){
		  console.log(this);
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  if (resultdata[_id] == null) {
			// なにもしない
			return;
		  }
		  // パスワード
		  this.value = clutil.cStr(resultdata[_id]);
		})
		.end()
		.filter('[type="checkbox"]').each(function(){
		  console.log(this);
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  if (resultdata[_id] == null) {
			// なにもしない
			return;
		  }
		  var f_check = clutil.pInt(resultdata[_id]);
		  // チェックボックス
		  if(f_check){
			// チェックをつける
			$(this).attr("checked", true);
			$(this).checkbox('check');
		  } else {
			// チェックを外す
			$(this).attr("checked", false);
			$(this).checkbox('uncheck');
		  }

		})
		.end()
		.end()
		.find("input[name]")
		.filter('[type="radio"]').each(function(){
		  console.log(this);
		  // プレフィックスを除去する
		  _id = (this.name).replace(_prefix, "");
		  if (resultdata[_id] == null) {
			// なにもしない
			return;
		  }
		  // ラジオボタン
		  if(resultdata[_id] == $(this).val()){
			// 同じ値であるものにチェックをつける
			$(this).attr("checked", "checked");
			$(this).radio('check')
		  } else {
//			$(this).removeAttr("checked");
//			$(this).radio('uncheck')
		  }
		})
		.end()
		.end()
		.find("textarea[id]").each(function(){
		  console.log(this);
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  if (resultdata[_id] == null) {
			// なにもしない
			return;
		  }
		  // テキストエリア
		  this.value = clutil.cStr(resultdata[_id]);
		})
		.end()
		.find("select[id]").each(function(){
		  console.log(this);
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  if (resultdata[_id] == null) {
			// なにもしない
			return;
		  }
		  // コンボボックス(マルチセレクト未サポート)
		  this.value = clutil.cStr(resultdata[_id]);
		  $(this).selectpicker('val', resultdata[_id]);
		})
		.end()
		.find("span[id]").each(function(){
		  console.log(this);
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  if (resultdata[_id] == null) {
			// なにもしない
			return;
		  } else if ($(this).hasClass('cl_date')) {
			// datepickerの場合は日付を表示用に変換する
			$(this).html(clutil.dateFormat(resultdata[_id], 'yyyy/mm/dd'));
		  } else if ($(this).hasClass('cl_month')) {
			// 月指定の場合は日付を表示用に変換する
			$(this).html(clutil.monthFormat(resultdata[_id], 'yyyy/mm'));
		  } else if ($(this).hasClass('cl_time')) {
			// 時刻指定の場合は時刻を表示用に変換する
			$(this).html(clutil.timeFormat(resultdata[_id], 'hh:mm'));
		  } else {
			$(this).text(clutil.cStr(mask($(this), resultdata[_id])));
		  }
		})
		.end()
		.find("p[id]").each(function(){
		  console.log(this);
		  // プレフィックスを除去する
		  _id = (this.id).replace(_prefix, "");
		  if (resultdata[_id] == null) {
			// なにもしない
			return;
		  } else if ($(this).hasClass('cl_date')) {
			// datepickerの場合は日付を表示用に変換する
			$(this).html(clutil.dateFormat(resultdata[_id], 'yyyy/mm/dd'));
		  } else if ($(this).hasClass('cl_month')) {
			// 月指定の場合は日付を表示用に変換する
			$(this).html(clutil.monthFormat(resultdata[_id], 'yyyy/mm'));
		  } else if ($(this).hasClass('cl_time')) {
			// 時刻指定の場合は時刻を表示用に変換する
			$(this).html(clutil.timeFormat(resultdata[_id], 'hh:mm'));
		  } else {
			$(this).html(clutil.cStr(mask($(this), resultdata[_id])));
		  }
		})
		.end();
	},

	/**
	 * 表示エリアよりデータオブジェクトを作成する(table版)
	 * 指定したプレフィックスを除去したnameの名前で作成する
	 * @param {jQuery} $trobj trのjQueryオブジェクト (例：$('#ca_tbody_dlv').children())
	 * @param {Object} options clutil.serializeへのオプション
	 * @return {Object} シリアライズ結果
	 */
	tableview2data: function($trobj, options) {
	  return _.map($trobj, function (el) {
		var data = clutil.serialize(el, options);
		return data;
	  });
	},

	/**
	 * 指定Viewになにか入力されたかの判断を行う
	 * @param {jQuery} $view jQueryオブジェクト (例：$('#ca_tbody_dlv tr:last')
	 * @param {Object} options clutil.serializeへのオプション
	 * @param {Array} options.exclude 除外フィールドのキー(name属性)のリスト
	 * @return {boolean} 入力されたかどうか
	 * @example
	 *	 var isEmpty = clutil.isViewEmpty($('#ca_tbody_dlv_info_div > tr:last'), {exclude: ['ca_dlv_place_sw']});
	 */
	isViewEmpty: function($view, options) {
	  var myOptions = options || {},
		  selectNames = _.reduce($view.find('select[name]'), function (memo, select) {
			var name = select.name;
			if (!~_.indexOf(myOptions.exclude || [], name))
			  memo.push(name);
			return memo;
		  }, []),
		  data = clutil.serialize($view, _.extend({}, myOptions, {
			exclude: selectNames.concat(myOptions.exclude)
		  })),
		  selectData = clutil.serialize($view, _.extend({}, myOptions, {
			include: selectNames
		  })),
		  x = _.all(data, function (value) {return !value}),
		  y = _.all(selectData, function (value) {return value === '0'});
	  return x && y;
	},

	_readonlySupportedList: [
         ['input[type=text],[type=password]', 'readonly'],
         ['input', 'disabled'],
         ['textarea', 'readonly'],
         ['select', 'disabled'],
         ['button', 'disabled']
    ],

	/**
	 * 指定されたエレメントをリードオンリーにする。
	 */
	inputReadonly: function ($input) {
      var supportedList = clutil._readonlySupportedList;
      _.some(supportedList, function (args) {
        if ($input.is(args[0])) {
          $input.attr(args[1], args[1]);
          $input.datepicker('disable');
          return true;
        }
      });
    },

	/**
	 * 指定されたエレメントのリードオンリーを解除する。
	 */
	inputRemoveReadonly: function ($input) {
      var supportedList = clutil._readonlySupportedList;
      _.some(supportedList, function (args) {
        if ($input.is(args[0])) {
          $input.removeAttr(args[1]);
          $input.datepicker('enable');
          return true;
        }
      });
    },

	/**
	 * 表示エリアを読み取り専用にする
	 * 引数
	 *
	 * @param {jQuery} $view 表示エリアのjQueryオブジェクト (例：$('#viewarea'))
	 * @param {Object} [options] オプション
	 * @param {String,Function} [options.filter] jQuery.filter関数への引数
	 */
    viewReadonly: function ($view, options) {
	    options = options || {};
	    _.defaults(options, {
	      filter: '*'
	    });

	    $view
	      .filter(options.filter)
	      .find('.cl-a-tag').each(function () {
	        var $this = $(this);
	        $(this).attr('data-href-orig', $this.attr('href'));
	        $(this).attr('href', 'javascript:void(0);');
	        $this.addClass('cl-a-disabled');
	        $(this).attr('disabled', true);
	      })
	      .end()
	      .find('.cl-file-attach [type=file]').each(function () {
	        $(this).attr('disabled', true)
	          .closest('.cl-file-attach').attr('disabled', 'disabled');
	      })
	      .end()
	      .find("input[id],.cl-file-table input")
	      .filter('[type="text"]').each(function(){
	        var $this = $(this);
	        console.log(this);
	        $this.datepicker('disable');
	        $(this).attr("readonly", "readonly");
	      })
	      .end()
	      .filter('[type="number"]').each(function(){
	        console.log(this);
	        $(this).attr("readonly", "readonly");
	      })
	      .end()
	      .filter('[type="password"]').each(function(){
	        console.log(this);
	        // パスワード
	        $(this).attr("readonly", "readonly");
	      })
	      .end()
	      .filter('[type="checkbox"]').each(function(){
	        console.log(this);
	        // チェックボックス

	        /////藤岡修正///////////////////
//	      	$(this).attr("disabled", "true");
	        $(this).attr("disabled", true);
	        $($(this).closest('label')).addClass("disabled");
	        ///////////////////////////
	      })
	      .end()
	      .end()
	      .find("input[name]")
	      .filter('[type="radio"]').each(function(){
	        console.log(this);
	        // ラジオボタン

	        /////藤岡修正///////////////////
//	     	 $(this).attr("disabled", "true");
	        $(this).attr("disabled", true);
	        $($(this).closest('label')).addClass("disabled");
	        ///////////////////////////
	      })
	      .end()
	      .end()
	      .find("textarea[id]").each(function(){
	        console.log(this);
	        // テキストエリア
	        $(this).attr("readonly", "readonly");
	      })
	      .end()
	      .find("select[id]").each(function(){
	        console.log(this);
	        // コンボボックス(マルチセレクト未サポート)


	      })
	      .end()
	      .find("button[id],.cl-file-delete").each(function(){
	        console.log(this);
	        // ボタン

	        /////藤岡修正///////////////////
//	     	 $(this).attr("disabled", "true");
	        $(this).attr("disabled", true);
	        ///////////////////////////
	      })
	      .end();
	},
	/**
	 * 表示エリアを読み取り専用から戻す
	 * 引数
	 * ・$view : 表示エリアのjQueryオブジェクト (例：$('#viewarea'))
	 * 戻り値
	 * ・なし
	 */
	viewRemoveReadonly: function($view) {
      $view
        .find('.cl-a-tag').each(function () {
          var $this = $(this);
          $this.attr('href', $this.attr('data-href-orig'));
          $this.removeClass('cl-a-disabled');
        })
        .end()
        .find('.cl-file-attach [type=file]').each(function () {
          $(this).attr('disabled', false)
            .closest('.cl-file-attach').attr('disabled', false);
        })
        .end()
        .find("input[id],.cl-file-table input")
        .filter('[type="text"]').each(function(){
          var $this = $(this);
          console.log(this);
          $this.datepicker('enable');
          $this.removeAttr("readonly");
        })
        .end()
        .filter('[type="number"]').each(function(){
		  console.log(this);
		  $(this).removeAttr("readonly");
		})
		.end()
        .filter('[type="password"]').each(function(){
          console.log(this);
          // パスワード
          $(this).removeAttr("readonly");
        })
        .end()
        .filter('[type="checkbox"]').each(function(){
          console.log(this);
          // チェックボックス
          $(this).removeAttr("disabled");
	      $($(this).closest('label')).removeClass("disabled");
        })
        .end()
        .end()
        .find("input[name]")
        .filter('[type="radio"]').each(function(){
          console.log(this);
          // ラジオボタン
          $(this).removeAttr("disabled");
	      $($(this).closest('label')).removeClass("disabled");
        })
        .end()
        .end()
        .find("textarea[id]").each(function(){
          console.log(this);
          // テキストエリア
          $(this).removeAttr("readonly");
        })
        .end()
        .find("select[id]").each(function(){
          console.log(this);
          // コンボボックス(マルチセレクト未サポート)
          $(this).removeAttr("disabled");
        })
        .end()
        .find("button[id],.cl-file-delete").each(function(){
          console.log(this);
          // ボタン
          $(this).removeAttr("disabled");
        })
        .end();
    },
	/**
	 * 表示エリアをクリアする
	 * 引数
	 * ・$view : 表示エリアのjQueryオブジェクト (例：$('#viewarea'))
	 * ・f_opedate : 日付を運用日に戻すフラグ デフォルトはtrue
	 * 戻り値
	 * ・なし
	 */
	viewClear: function($view, f_opedate) {
	  f_opedate = f_opedate == null ? true : f_opedate;
	  $view
		.find("input[id]")
		.filter('[type="text"]').each(function(){
		  console.log(this);
		  this.value = "";

		  // datepickerの場合は運用日を入れなおす
		  if (f_opedate && $(this).hasClass('cl_date')) {
			this.value = clutil.dateFormat(clcom.getOpeDate(), 'yyyy/mm/dd');
		  }
		})
		.end()
		.filter('[type="hidden"]').each(function(){
		  console.log(this);
		  this.value = "";
		})
		.end()
		.filter('[type="password"]').each(function(){
		  console.log(this);
		  // パスワード
		  this.value = "";
		})
		.end()
		.filter('[type="checkbox"]').each(function(){
		  console.log(this);
		  // チェックボックス
		  $(this).attr("checked", "false");
		  $(this).checkbox('uncheck')
		})
		.end()
		.end()
		.find('input[name]')
		.filter('[type="radio"]').each(function(){
		  console.log(this);
		  // ラジオボタン
		  $(this).attr("checked", "false");
		  $(this).radio('uncheck')
		})
		.end()
		.end()
		.find("textarea[id]").each(function(){
		  console.log(this);
		  // テキストエリア
		  this.value = "";
		})
		.end()
		.find("select[id]").each(function(){
		  console.log(this);
		  // コンボボックス(マルチセレクト未サポート)
		  $(this).prop('selectedIndex', 0);
		  $(this).selectpicker('val', 0);

		  // datepickerの場合は運用日を入れなおす
		  if (f_opedate && $(this).hasClass('cl_yyyy')) {
			var ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');
			$(this).selectpicker('val', ope_year);
		  } else if (f_opedate && $(this).hasClass('cl_mm')) {
			var ope_month = clutil.dateFormat(clcom.getOpeDate(), 'mm');
			$(this).selectpicker('val', ope_month);
		  }
		})
		.end()
		.find("span[id]").each(function(){
		  $(this).html("");
		});
	},

	/**
	 * オンライン入力制限
	 * キャラマップによる制限(全角、半角、アルファベット、数字、正規表現)と
	 * 文字数による制限をする。
	 *
	 *
	 * @param {jQuery Object} $el
	 * @return {undefined}
	 * @example
	 * <form id="myForm">
	 * <input type="text" data-limit="len:5 zenkaku">
	 * <input type="text" data-limit="digit">
	 * </form>
	 * clcom.inputlimiter($('#myForm'));
	 *
	 * data-limit に指定できるのは以下
	 * len:長さ 長さ制限
	 * zenkaku 全角のみ
	 * hankaku 半角のみ
	 * alpha アルファベットのみ
	 * alnum 英数字のみ
	 * digit 数値のみ
	 */
	inputlimiter: function ($el) {
	  var $elements = $el.find('[data-limit],[data-filter]'),
		  fn = $.fn.inputlimiter;
//		  args = Array.prototype.slice.call(arguments, 1);

	  if ($elements.length > 0) {
		$elements.each(function (i, e) {
		  fn.call($(e), 'update');
		});
	  } else if ($el.is('[data-limit],[data-filter]')) {
		  return fn.call($el, 'update');
	  }
//	  else {
//
//	  }
	},

	/**
	 * 数値をカンマ区切りにする。
	 *
	 * @param {String} 数値の文字列形式
	 * @example
	 * clutil.comma('123456789') //=> 123,456,789
	 * clutil.comma('12345.67890') //=> 12,345.67890
	 */
	comma: function (value) {
	  if (value == null) return '';
	  return $.inputlimiter.Filters.comma().mask(value.toString());
	},

	/**
	 * datepickerの作成
	 * 引数
	 * ・$view : 表示エリアのjQueryオブジェクト (例：$('#viewarea'))
	 * 戻り値
	 * ・datepickerオブジェクト
	 */
	datepicker: function($view, min_date, max_date) {
	  var date = clutil.ymd2date(clcom.getOpeDate());
	  var min_date = min_date == null ? clutil.ymd2date(clcom.min_date) :  clutil.ymd2date(min_date);
      var max_date = max_date == null ? clutil.ymd2date(clcom.max_date) :  clutil.ymd2date(max_date);;
	  date.setFullYear(date.getFullYear() + 20);
	  $view.attr('maxlength', 10);
	  $view.val(clutil.dateFormat(clcom.getOpeDate(), 'yyyy/mm/dd'));
	  return $view.datepicker({
		dateFormat: 'yy/mm/dd',
		changeMonth: true,
		changeYear: true,
		yearRange: min_date.getFullYear() + ':' + max_date.getFullYear(),
        minDate: min_date,
        maxDate: max_date,
		autoSize: true,
		showOn: 'button',
		buttonImage: clcom.appRoot + '/../images/icn_s_calendar.png',
		buttonText: clmsg.cl_datepicker_button_text,
		buttonImageOnly: true
//		numberOfMonths: 3, // 表示月数
//		showCurrentAtPos: 1 // 先月から表示する
//		defaultDate: clutil.ymd2date(clcom.getOpeDate())
	  });
	},

	/**
	 * ポータル画面のツリーメニューを作成する
	 * AOKI
	 * @param ($el) ツリーを含むjQueryオブジェクト
	 * @return $el
	 */
	treemenu: function ($el) {
	  $el.find('.parent>.minus').each(function () {
		  var tgt = $(this).next();
			tgt.animate({
				height: 'toggle',
				opacity: 'toggle'
			}, 'slow');
//		$(this).next().show();
	  });
	  $el.find('.parent>.plus').each(function () {
		  var tgt = $(this).next();
			tgt.animate({
				height: 'toggle',
				opacity: 'toggle'
			}, 'slow');
//		$(this).next().hide();
	  });

	  $el.delegate('.parent>.minus', 'click', function (ev) {
		var $c = $(ev.currentTarget);
//		$c.next().hide();
		var tgt = $c.next();
		tgt.animate({
			height: 'toggle',
			opacity: 'toggle'
		}, 'slow');
		$c.attr('class', 'plus');
	  });

	  $el.delegate('.parent>.plus', 'click', function (ev) {
		var $c = $(ev.currentTarget);
		var tgt = $c.next();
		tgt.animate({
			height: 'toggle',
			opacity: 'toggle'
		}, 'slow');
//		$c.next().show();
		$c.attr('class', 'minus');
	  });

	  return $el;
	},


	/**
	 * 全角を半角に変換する
	 */
	inputzen2han: function (e) {
		var addFlag = false;

		var input = $(e.target).closest('input');

		if (addFlag) {
			return;
		}
		addFlag = true;

		// 入力値を取得
		var val = $(input).val();

		// イベントリセット
		e.preventDefault();
		$(input).val(clutil.zen2han(val));
		addFlag = false;
	},

	/**
	 * 全選択、選択クリアcheckboxを作成する
	 * テーブル内チェックボックス
	 * AOKI
	 * @param ($el) 全選択、選択クリアcheckboxのjQueryオブジェクト
	 * @param ($table) checkboxを監視するtableのjQueryオブジェクト
	 * @param ($tbody) checkboxを監視するtbodyのjQueryオブジェクト
	 * @param (name) 選択値を制御するcheckboxのname属性 指定しない場合はすべてのcheckboxが対象
	 * @return $el
	 */
	checkallbox: function ($el, $table, $tbody, name) {
		var checkbox = name == null ? "input:checkbox" :
			  "input:checkbox[name=" + name + "]";

		$table.delegate(':checkbox', 'toggle', function (e) {
			if (this.id == $el.get(0).id) {
				// ヘッダーの場合
				if ($el.prop('checked')) {
					$table.find($(':checkbox')).checkbox('check');
					$tbody.find('tr').addClass('checked');
				} else {
					$table.find($(':checkbox')).checkbox('uncheck');
					$tbody.find('tr').removeClass('checked');
				}
			} else {
				// 名前属性チェック
				if (name != null && $(this).attr('name') != name) {
					return;
				}
				var trlist = $tbody.find('tr');
				var chklist = [];
				$.each($tbody.find(checkbox), function() {
					if ($(this).prop('checked')) {
						chklist.push(this);
					}
				});
				// データの数とチェックボックスの数が一致したとき、全選択チェックボックスをオンにする
				if (trlist.length === chklist.length ){
					$el.checkbox('check');
				} else {
					$el.checkbox('uncheck');
				}
			}
		});

		var defaultchkbox = {
			init: function() {
				$table.find($(':checkbox')).checkbox('uncheck');
				$tbody.find('tr').removeClass('checked');
			},
			checkall: function() {
				$table.find($(':checkbox')).checkbox('check');
				$tbody.find('tr').addClass('checked');
			},
			check: function() {
				// チェックを行う
				// データの数とチェックボックスの数が一致したとき、全選択チェックボックスをオンにする
				var trlist = $tbody.find('tr');
				var chklist = [];
				$.each($tbody.find(checkbox), function() {
					if ($(this).prop('checked')) {
						$(this).closest('tr').addClass('checked');
						chklist.push(this);
					}
				});
				// データの数とチェックボックスの数が一致したとき、全選択チェックボックスをオンにする
				if (trlist.length != 0 &&
						(trlist.length === chklist.length) ){
					$el.checkbox('check');
				} else {
					$el.checkbox('uncheck');
				}
			}
		};

	  return defaultchkbox;

	},

	/**
	 * 全選択、選択クリアcheckboxを作成する
	 * テーブル以外のチェックボックス
	 * AOKI
	 * @param ($el) 全選択、選択クリアcheckboxを含むjQueryオブジェクト
	 * @param ($table) checkboxを監視するtableのjQueryオブジェクト
	 * @param (name) checkboxのname属性 指定しない場合はすべてのcheckboxが対象
	 * @return $el
	 */
	checkall: function ($el, $table, name, chkallcallback, unchkallcallback) {
	  var checkbox = name == null ? "input:checkbox" :
		  "input:checkbox[name=" + name + "]";

	  // 一旦保留
//	  $table.delegate(':checkbox', 'toggle', function (e) {
//	  	// 名前属性チェック
//		if (name != null && $(this).attr('name') != name) {
//			return;
//		}
//		var inputlist = $table.find(checkbox);
//		var chklist = [];
//		$.each($table.find(checkbox), function() {
//			if ($(this).prop('checked')) {
//				chklist.push(this);
//			}
//		});
//		// データの数とチェックボックスの数が一致したとき、全選択チェックボックスをオンにする
//		if (inputlist.length === chklist.length ){
//			$el.find('.uncheckall').addClass('dispn');
//			$el.find('.checkall').removeClass('dispn');
//		} else {
//			$el.find('.checkall').addClass('dispn');
//			$el.find('.uncheckall').removeClass('dispn');
//		}
//	  });

	  $el.delegate('.checkall', 'click', function (ev) {
		var $c = $(ev.currentTarget);
		$table.find(checkbox).checkbox('check');
		$el.find('.checkall').addClass('dispn');
		$el.find('.uncheckall').removeClass('dispn');
		if (chkallcallback) {
			chkallcallback();
		}
	  });

	  $el.delegate('.uncheckall', 'click', function (ev) {
		var $c = $(ev.currentTarget);
		$table.find(checkbox).checkbox('uncheck');
		$el.find('.uncheckall').addClass('dispn');
		$el.find('.checkall').removeClass('dispn');
		if (unchkallcallback) {
			unchkallcallback();
		}
	  });

	  var defaultchkbox = {
		init: function() {
			$el.find('.checkall').removeClass('dispn');
			$el.find('.uncheckall').addClass('dispn');
		},
		checkall: function() {
			if ($el.find('.checkall').hasClass('dispn')) {
				return  true;
			} else {
				return false;
			}
		},
		set: function(checkall) {
			if (checkall) {
				$el.find('.checkall').addClass('dispn');
				$el.find('.uncheckall').removeClass('dispn');
			} else {
				$el.find('.uncheckall').addClass('dispn');
				$el.find('.checkall').removeClass('dispn');
			}
		}

	  };

	  return defaultchkbox;

	},

	/**
	 * 郵便番号にハイフン入れて返す
	 * ・postNum: 郵便番号
	 */
	cngPost: function(postNum){
		if(postNum == null || postNum.length == 0){
			var post = ""
			return post;
		}

		if(postNum.length == 7) {
			var post_1 = postNum.slice(0,3);
			var post_2 = postNum.slice(3,7);

			var post = "〒" + post_1 + "-" + post_2;
		}
		else {
			var post = ""
		}

		return post;
	},


	/**
	 * 郵便番号のハイフンとって返す
	 * ・postNum: 郵便番号
	 */
	cngPost2Num: function(postNum){
		if(postNum == null || postNum.length == 0){
			return;
		}

		if(postNum.length == 9) {
			var post_1 = postNum.slice(1,4);
			var post_2 = postNum.slice(5,9);

			var post = post_1 + post_2;
		}
		else {
			var post = ""
		}

		return post;
	},


	/**
	 * 郵便番号から該当住所を検索
	 * $button: 検索ボタン
	 * $postNumArea: 郵便番号入力テキストボックス
	 * $setDataArea: 住所1テキストボックス
	 * $selArea: 住所1のセレクトボックス領域
	 * selBoxName: 住所1のセレクトボックス名
	 * $addArea: 住所1,2,3テキストボックス
	 * validator: バリデーター領域
	 */
	searchPostNum: function($button, $postNumArea, $setDataArea,
							$selArea, selBoxName, $addArea, validator, boxName){
		var _this = this;
		//コンボボックスを隠しておく
		$selArea.hide();

		//検索ボタン押下時
		$button.click(function() {
			validator.clear();

			var postData = "";
			var num = $postNumArea.val();

			if(num.length != 7){
				//7桁数字がそろっていなければエラー
				// ヘッダーにメッセージを表示
				validator.setErrorMsg($postNumArea, clmsg.cl_lack_postnum);
				validator.setErrorInfo({_eb_: clmsg.cl_echoback});

				return;
			}


			// データを取得
			var req = {
					cond : {
						postal_num : num
					}
			};
			var uri = 'gscu_se_postal_srch';
			clutil.postJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					 _this.resultList = data.list;

					if (_this.resultList == null || _this.resultList.length == 0) {
						//リストの中身がなかったらエラー表示
						validator.setErrorMsg($postNumArea, clmsg.cl_no_postnum);
						validator.setErrorInfo({_eb_: clmsg.cl_no_data});
//						validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.head.message], data.head.args)});
					} else if (_this.resultList.length == 1) {
						//コンボボックスを隠す(コンボ状態で通常検索するとコンボが隠れないため)
						$setDataArea.show();
						$selArea.hide();

						//結果が1つならそのままそのまま入れる
						//文字列が20文字以上の場合対応2014/03/04
						var name = _this.resultList[0].name;
						if (name.length > 20){
							var name1 = name.slice(0,20);
							var name2 = name.slice(20,name.length);
							$setDataArea.val(name1);
							$($setDataArea.next('input')).val(name2);
						} else {
							$setDataArea.val(name);
						}
					} else {
						//2件以上が該当したらコンボボックス化
						$setDataArea.hide();
						$selArea.show();

						//idをつけかえる
						for (var i = 0; i < _this.resultList.length; i++){
							_this.resultList[i].id = i;
						}

						//コンボ作成
						clutil.initcltypeselector2(
								$selArea, _this.resultList, 0, 1,
								'id', 'name', 'code',
								{id : selBoxName, name : "info"}, "mbn wt280 flleft mrgr10");

						$selBox = $("#" + selBoxName);

						//コンボボックス変更時
						$selBox.change(function(e) {
							var addr_id = $(e.target).val();

							for(var i = 0; i < _this.resultList.length; i++){
								if(_this.resultList[i].id == addr_id){
									//コンボボックスを隠す
									$selArea.hide();
									$setDataArea.show();


									//文字列が20文字以上の場合対応2014/03/04
									var name = _this.resultList[i].name;
									if (name.length > 20){
										var name1 = name.slice(0,20);
										var name2 = name.slice(20,name.length);
										$setDataArea.val(name1);
										$($setDataArea.next('input')).val(name2);
									} else {
										$setDataArea.val(name);
									}
									break;
								}
							}
						});

					}
				} else {
					// ヘッダーにメッセージを表示
					validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.head.message], data.head.args)});
				}
			}, this));
		});

		// echoback trueの場合はheaderにエラーを表示する
		var defaultPostNum = {
			checkPostNum: function(callback, echoback) {
				var num = $postNumArea.val();
				if (num.length != 7) {
					// 7桁数字がそろっていなければエラー
					// ヘッダーにメッセージを表示
					validator.setErrorMsg($postNumArea, clmsg.cl_lack_postnum);
					if (echoback) {
						validator.setErrorInfo({_eb_: clmsg.cl_echoback});
					}
					callback(false);
					return false;
				}
				// コンボボックスを選択していなかったら強制選択する
				if ($selArea.css('display') == 'block') {
					$selBox.trigger('change');
				}
				callback(true);
				return true;

				// 郵便番号が存在するかチェックはとりあえずしない

				// データを取得
				var req = {
						cond : {
							postal_num : num
						}
				};
				var uri = 'gscu_se_postal_srch';
				clutil.postJSON(uri, req, _.bind(function(data, dataType) {
					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						 _this.resultList = data.list;

						if (_this.resultList == null || _this.resultList.length == 0) {
							// リストの中身がなかったらエラー表示
							validator.setErrorMsg($postNumArea, clmsg.cl_no_postnum);
							if (echoback) {
								validator.setErrorInfo({_eb_: clmsg.cl_echoback});
							}
							callback(false);
							return false;
						} else {
							// 正しい郵便番号
							callback(true);
							return true;
						}
					} else {
						// ヘッダーにメッセージを表示
						if (echoback) {
							validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.head.message], data.head.args)});
						}
						callback(false);
						return false;
					}
				}, this));
			},
			checkSelBox: function() {
				// コンボボックスを選択していなかったら強制選択する
				if ($selArea.css('display') == 'block') {
					$selBox.trigger('change');
				}
			}
		};
		return defaultPostNum;

	},


	/**
	 * 未入力カード数を表示
	 * ・$guideArea: ガイダンスエリア
	 * ・$numArea: 未入力件数表示エリア
	 * ・validator: バリデータ
	 */
	unregistArea: function($guideArea, $numArea, validator) {

		var userData = clcom.getUserData();

		var req = {
			//店舗idを渡す
			cond : {
				store_id : userData.org_id
			}
		}


		var uri = 'gscu_se_unregist_num';
		// 未登録件数を取得
		clutil.postJSON(uri, req, _.bind(function(data, dataType) {
//
			if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
				var num = data.num;

				//未入力顧客カード処理
				if(num != 0){
					//未入力顧客カードがあれば件数表示
					$numArea.html(num);


					//ガイダンスエリア押下時
					$guideArea.click(function() {
						validator.clear();

						// 情報未登録顧客ページへ
						clcom.pushPage(
								'../CUMEV0050/CUMEV0050.html',	// 遷移先url
								null,		// 画面引数
								null		// 保存データ
						);
					});


				}
				else {
					//未入力件数がなければガイダンス非表示
					$guideArea.hide();
				}
			}
			else {
				// ヘッダーにメッセージを表示
				validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.head.message], data.head.args)});
			}
		}, this));
	},


//		//ガイダンスエリア押下時
//		$guideArea.click(function() {
//			validator.clear();
//
//			// 情報未登録顧客ページへ
//			clcom.pushPage(
//					'../CUMEV0050/CUMEV0050.html',	// 遷移先url
//					null,		// 画面引数
//					null		// 保存データ
//			);
//		});
//	},


	/**
	 * 検索条件、条件結果表示エリアをコントロールする
	 * AOKI
	 * @param ($div_srch) 検索条件エリアのjQueryオブジェクト
	 * @param ($btn_srch) 検索ボタンのjQueryオブジェクト
	 * @param ($div_resrch) 条件結果エリアのjQueryオブジェクト
	 * @param ($btn_resrch) 検索条件を再指定ボタンのjQueryオブジェクト
	 * @param ($btn_add) 追加ボタンのjQueryオブジェクト
	 * @return defaultsrchArea
	 */
	controlSrchArea: function ($div_srch, $btn_srch, $div_resrch, $btn_resrch, $btn_add) {
		var height = $div_srch.parent().height();
		var defaultsrchArea = {
			init: function() {
				$btn_resrch.fadeOut();
				$div_resrch.addClass('dispn');
			},
			show_srch: function() {
				if ($div_srch.css('display') != 'none') {
					return;
				}
				$btn_resrch.fadeOut();
				$div_srch.parent().animate({
					backgroundColor: "none",
					height: height
				}, 300 );
				// IE不具合対応
				$div_srch.parent().css('overflow', 'inherit');
				// IE不具合対応
				$div_srch.fadeIn();
				$btn_srch.focus();
			},
			show_result: function() {
				if ($div_srch.css('display') == 'none') {
					return;
				}
				$div_srch.fadeOut();
				$div_srch.parent().animate({
					backgroundColor: "#0fb8aa",
					height: "40px",
				}, 300 );
				$btn_resrch.fadeIn();
				$div_resrch.removeClass('dispn');
				$btn_resrch.focus();
			}
		};

		return defaultsrchArea;

	},

	/**
	 * 追加ボタン押下後の条件表示エリアの表示、非表示をコントロールする
	 * AOKI
	 * @param ($btn_add) 追加ボタンのjQueryオブジェクト
	 * @param ($div_selected) エコーバックエリアのjQueryオブジェクト
	 * @return
	 */
	addtoSelected: function ($btn_add, $div_selected, $el) {
		//右ウィンドウ出し入れ関数化
		right_side = {
				//初回右ウインドウ表示
				firstshow : function (){
//					$btn_add.die("click");
					$div_selected.animate({'right': '-=240px'},
						{complete: function(){
								$div_selected.toggleClass( "dispn");
								$div_selected.animate({'right': '+=240px'},{duration:200});
						},duration:1});
				},
				//2回目以降右ウインドウ表示
				//右ウインドウ範囲外と追加ボタン同時に押下された時対策として時差を持たせるために一旦10pxバックしている。
				show : function (){
//					$btn_add.die("click");
					$div_selected.animate({'right': '-=10px'},
					{complete: function(){
							$div_selected.toggleClass( "dispn");
							$div_selected.animate({'right': '+=250px'},{duration:200});
					},duration:1});

				},
				//右ウインドウ非表示
				hide : function (){
				$div_selected.animate({'right': '-=240px'},
					{complete: function(){
//						$btn_add.live("click");
							if(!$div_selected.hasClass("second")){
								$div_selected.toggleClass( "second");
							}
							$div_selected.toggleClass( "dispn");
					},duration:200});
				}
		};

		//追加ボタン押下時の処理 初回:firstshow 2回目以降:show
		$el.click(function(e){
			if ($(e.target).get(0).id == $btn_add.get(0).id) {
				if($div_selected.hasClass("dispn")){
					if(!$div_selected.hasClass("second")){
						right_side.firstshow();
						$div_selected.toggleClass( "second");
					} else {
						right_side.show();
					}
				} else {
					right_side.hide();
				}
				return;
			}
			var $div = $(e.target).closest('div.selected');
			if ($div.length > 0) {
				return;
			}
			if(!$div_selected.hasClass("dispn")){
				right_side.hide();
			}
		});

		var defaultaddtoSelected = {
				right_side_hide: function() {
					right_side.hide();
				},
				right_side_show: function() {
					right_side.show();
				},
				// 状態を返却する
				// 開:true 閉:false
				right_side: function() {
					if ($div_selected.hasClass('dispn')) {
						return false;
					} else {
						return true;
					}
				}
			};
		return defaultaddtoSelected;
	},

	/**
	 * AOKI
	 * 区分名取得
	 * 引数
	 * ・kind : 区分値名
	 * ・typeid : 区分id
	 * ・namedisp : 名称のみを取得したい場合1を設定。なにも指定されていない場合はコード：名称で返す
	 * 戻り値
	 * ・区分コード：区分名
	 */
	gettypename: function(kind, typeid, namedisp) {
	  var typenamelist = this.gettypelist(kind);
	  for (var i = 0; i < typenamelist.length; i++) {
		var typename = typenamelist[i];
		if (typename.type_id == typeid) {
		  if (namedisp == 1) {
			return typename.name;
		  } else {
			return typename.code + ':' + typename.name;
		  }
		}
	  }
	  return "";
	},

	/**
	 * AOKI
	 * 区分リスト取得
	 * 引数
	 * ・kind : 区分値名
	 * 戻り値
	 * ・区分リスト
	 */
	gettypelist: function(typetype) {
	  var typelist = clcom.getTypeList();
	  var typenamelist = [];
	  if(_.isArray(typelist)){
		  for (var i = 0; i < typelist.length; i++) {
			  var type = typelist[i];
			  if (type.typetype == typetype) {
				  typenamelist.push(type);
			  }
		  }
	  }else{
		  console.warn('gettypelist: 区分リストが存在しません');
	  }
	  return typenamelist;
	},
	getcdnamelist: function(cntype) {
	  var typelist = clcom.getCdNameList();
	  var typenamelist = [];
	  for (var i = 0; i < typelist.length; i++) {
		  var type = typelist[i];
		  if (type.cntype == cntype) {
			  typenamelist.push(type);
		  }
	  }
	  return typenamelist;
	},
	getstaffcdnamelist: function(cntype) {
	  var typelist = clcom.getStaffCdNameList();
	  var typenamelist = [];
	  for (var i = 0; i < typelist.length; i++) {
		  var type = typelist[i];
		  if (type.cntype == cntype) {
			  typenamelist.push(type);
		  }
	  }
	  return typenamelist;
	},

	/**
	 * 分析条件となるものだけ取得
	 */
	getfconditemlist: function(anaCondItemList) {
	  var fCondItemList = [];
	  for (var i = 0; i < anaCondItemList.length; i++) {
		  var conditem = anaCondItemList[i];
		  if (conditem.f_cond == 1) {
			  fCondItemList.push(conditem);
		  }
	  }
	  return fCondItemList;
	},
	/**
	 * 顧客区分リスト取得
	 */
	gettypecustlist: function(typetype) {
		  var typelist = clcom.getTypeCustList();
		  var typenamelist = [];
		  if(_.isArray(typelist)){
			  for (var i = 0; i < typelist.length; i++) {
				  var type = typelist[i];
				  if (type.typetype == typetype) {
					  typenamelist.push(type);
				  }
			  }
		  }else{
			  console.warn('gettypelist: 区分リストが存在しません');
		  }
		  return typenamelist;
		},

	/**
	 * AOKI
	 * ラジオボタンの作成
	 * 引数
	 * ・$div				: ラジオボタンを作成する親divのjQueryオブジェクト (例：$('#viewarea'))
	 * ・rName				: ラジオボタンname
	 * ・data				: ラジオvalue,ラベル名オブジェクト
	 */
	initclradio: function($div, rName, data) {
		var html_source = '';

		var rNum = data.length;

		if(rNum == null || rNum < 1) {
			return;
		}

		  html_source += '<ul>';
		  for(var i = 0; i < rNum; i++){
			  html_source += '<li><label class="radio">';
			  html_source += '<input type="radio" name="' + rName;
			  html_source += '" value="' + data[i].val + '" data-toggle="radio">';
			  html_source += data[i].label;
			  html_source += '</label></li>';
		  }
		  html_source += '</ul>';

		  $div.html('');
		  $div.html(html_source);
	},

	/**
	 * AOKI
	 * 区分selectorの作成
	 * 引数
	 * ・$div				: 区分selectを作成する親divのjQueryオブジェクト (例：$('#viewarea'))
	 * ・kind				: 区分名
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・namedisp 			: 名称のみを取得したい場合1を設定。なにも指定されていない場合はコード：名称で返す
	 * ・option 			: id名、nameなどを記述
	 * 						: 例 { id : "ca_select", name : "info" }
	 * ・cls 				: classに追加したいものを文字列で羅列
	 * 						: 例 "mbn wt280 flleft"
	 */
	initcltypeselector: function($div, kind, unselectedflag, namedisp, option, cls) {
	  var html_source = '';
	  // 区分名より区分リストを取得する
	  var typenamelist = clutil.gettypelist(kind);
	  if (typenamelist == null) {
		return;
	  }
	  html_source += '<select ';
	  $.each(option, function(key, value) {
		  html_source += key + '="' + value + '"';
	  });
	  if (cls != null) {
		  html_source += 'class="' + cls + '"';
	  }
	  html_source += '>';

	  // 未選択値を追加する
	  var typename;
	  if (unselectedflag == 1) {
		html_source += '<option value="0">&nbsp;</option>';
	  }
	  for (var i = 0; i < typenamelist.length; i++) {
		typename = typenamelist[i];
		// selectorの中身を作成する
		if (namedisp == 1) {
		  html_source += '<option value=' + typename.type_id + '>' +
			typename.name + '</option>';
		} else {
		  html_source += '<option value=' + typename.type_id + '>' +
			typename.code + ':' + typename.name + '</option>';
		}
	  }
	  html_source += '</select>';

	  $div.html('');
	  $div.html(html_source);
	  $div.find('select').selectpicker();
	},

	/**
	 * AOKI
	 * 区分selectorの作成
	 * 引数
	 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
	 * ・kind				: 区分名
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・namedisp 			: 名称のみを取得したい場合1を設定。なにも指定されていない場合はコード：名称で返す
	 */
	cltypeselector: function($select, kind, unselectedflag, namedisp) {
	  var html_source = '';
	  // 区分名より区分リストを取得する
	  var typenamelist = clutil.gettypelist(kind);
	  if (typenamelist == null) {
		return;
	  }
	  // 未選択値を追加する
	  var typename;
	  if (unselectedflag == 1) {
		html_source += '<option value="0">&nbsp;</option>';
	  }
	  for (var i = 0; i < typenamelist.length; i++) {
		typename = typenamelist[i];
		// selectorの中身を作成する
		if (namedisp == 1) {
		  html_source += '<option value=' + typename.type_id + '>' +
			typename.name + '</option>';
		} else {
		  html_source += '<option value=' + typename.type_id + '>' +
			typename.code + ':' + typename.name + '</option>';
		}
	  }
	  $select.html('');
	  $select.html(html_source);

	  $select.selectpicker();
	},

	/**
	 * AOKI
	 * 区分(顧客)selectorの作成
	 * 引数
	 * ・$div				: 区分selectを作成する親divのjQueryオブジェクト (例：$('#viewarea'))
	 * ・kind				: 区分名
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・namedisp 			: 名称のみを取得したい場合1を設定。なにも指定されていない場合はコード：名称で返す
	 * ・option 			: id名、nameなどを記述
	 * 						: 例 { id : "ca_select", name : "info" }
	 * ・cls 				: classに追加したいものを文字列で羅列
	 * 						: 例 "mbn wt280 flleft"
	 */
	initcltypecustselector: function($div, kind, unselectedflag, namedisp, option, cls) {
	  var html_source = '';
	  // 区分名より区分リストを取得する
	  var typenamelist = clutil.gettypecustlist(kind);
	  if (typenamelist == null) {
		return;
	  }
	  html_source += '<select ';
	  $.each(option, function(key, value) {
		  html_source += key + '="' + value + '"';
	  });
	  if (cls != null) {
		  html_source += 'class="' + cls + '"';
	  }
	  html_source += '>';

	  // 未選択値を追加する
	  var typename;
	  if (unselectedflag == 1) {
		html_source += '<option value="0">&nbsp;</option>';
	  }
	  for (var i = 0; i < typenamelist.length; i++) {
		typename = typenamelist[i];
		// selectorの中身を作成する
		if (namedisp == 1) {
		  html_source += '<option value=' + typename.type_id + '>' +
			typename.name + '</option>';
		} else {
		  html_source += '<option value=' + typename.type_id + '>' +
			typename.code + ':' + typename.name + '</option>';
		}
	  }
	  html_source += '</select>';

	  $div.html('');
	  $div.html(html_source);
	  $div.find('select').selectpicker();
	},

	/**
	 * AOKI
	 * 区分(顧客)selectorの作成
	 * 引数
	 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
	 * ・kind				: 区分名
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・namedisp 			: 名称のみを取得したい場合1を設定。なにも指定されていない場合はコード：名称で返す
	 */
	cltypecustselector: function($select, kind, unselectedflag, namedisp) {
	  var html_source = '';
	  // 区分名より区分リストを取得する
	  var typenamelist = clutil.gettypecustlist(kind);
	  if (typenamelist == null) {
		return;
	  }
	  // 未選択値を追加する
	  var typename;
	  if (unselectedflag == 1) {
		html_source += '<option value="0">&nbsp;</option>';
	  }
	  for (var i = 0; i < typenamelist.length; i++) {
		typename = typenamelist[i];
		// selectorの中身を作成する
		if (namedisp == 1) {
		  html_source += '<option value=' + typename.type_id + '>' +
			typename.name + '</option>';
		} else {
		  html_source += '<option value=' + typename.type_id + '>' +
			typename.code + ':' + typename.name + '</option>';
		}
	  }
	  $select.html('');
	  $select.html(html_source);

	  $select.selectpicker();
	},

	/**
	 * AOKI
	 * 区分selectorの作成
	 * 引数
	 * ・$div				: 区分selectを作成する親divのjQueryオブジェクト (例：$('#viewarea'))
	 * ・list				: 区分リスト
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・namedisp 			: 名称のみを取得したい場合1を設定。なにも指定されていない場合はコード：名称で返す
	 * ・idname				: IDのid名（defaultは"id")
	 * ・namename			: 名称のid名（defaultは"name")
	 * ・codename			: コードのid名（defaultは"code")
	 * ・option 			: id名、nameなどを記述
	 * 						: 例 { id : "ca_select", name : "info" }
	 * ・cls 				: classに追加したいものを文字列で羅列
	 * 						: 例 "mbn wt280 flleft"
	 */
	initcltypeselector2: function($div, list, unselectedflag, namedisp,
			idname, namename, codename,
			option, cls) {
	  var id = idname == null ? "id" : idname;
	  var name = namename == null ? "name" : namename;
	  var code = codename == null ? "code" : codename;

	  var html_source = '';

	  html_source += '<select ';
	  $.each(option, function(key, value) {
		  html_source += key + '="' + value + '"';
	  });
	  if (cls != null) {
		  html_source += 'class="' + cls + '"';
	  }
	  html_source += '>';

	  // 未選択値を追加する
	  var typename;
	  if (unselectedflag == 1) {
		html_source += '<option value="0">&nbsp;</option>';
	  }

	  if (list != null) {
		for (var i = 0; i < list.length; i++) {
			typename = list[i];
			// selectorの中身を作成する
			if (namedisp == 1) {
				html_source += '<option value="' + typename[id] + '" ';
				html_source += '>' +  typename[name] + '</option>';
			} else {
				html_source += '<option value="' + typename[id] + '" ';
				html_source += '>' + typename[code] + ':' + typename[name] + '</option>';
			}
		}
	  }
	  html_source += '</select>';

	  $div.html('');
	  $div.html(html_source);
	  $div.find('select').selectpicker();
	},

	/**
	 * AOKI
	 * 区分selectorの作成 No.2
	 * リストから区分selectorを作成する
	 * 引数
	 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
	 * ・list				: 区分リスト
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・namedisp 			: 名称のみを取得したい場合1を設定。なにも指定されていない場合はコード：名称で返す
	 * ・idname				: IDのid名（defaultは"id")
	 * ・namename			: 名称のid名（defaultは"name")
	 * ・codename			: コードのid名（defaultは"code")
	 */
	cltypeselector2: function($select, list, unselectedflag, namedisp,
								idname, namename, codename) {
		var html_source = '';

		var id = idname == null ? "id" : idname;
		var name = namename == null ? "name" : namename;
		var code = codename == null ? "code" : codename;

		// 未選択値を追加する￥
		var typename;
		if (unselectedflag == 1) {
			html_source += '<option value="0">&nbsp;</option>';
		}

		if (list != null) {
			for (var i = 0; i < list.length; i++) {
				typename = list[i];
				// selectorの中身を作成する
				if (namedisp == 1) {
					html_source += '<option value="' + typename[id] + '" ';
					html_source += '>' +  typename[name] + '</option>';
				} else {
					html_source += '<option value="' + typename[id] + '" ';
					html_source += '>' + typename[code] + ':' + typename[name] + '</option>';
				}
			}
		}
		$select.html('');
		$select.html(html_source);

		$select.selectpicker();
	},

	/**
	 * AOKI
	 * 事業ユニット情報selectorの作成
	 * 引数
	 * ・$div				: 事業ユニット情報selectを作成する親divのjQueryオブジェクト (例：$('#viewarea'))
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・namedisp 			: 名称のみを取得したい場合1を設定。なにも指定されていない場合はコード：名称で返す
	 * ・option 			: id名、nameなどを記述
	 * 						: 例 { id : "ca_select", name : "info" }
	 * ・cls 				: classに追加したいものを文字列で羅列
	 * 						: 例 "mbn wt280 flleft"
	 */
	initbuinfoselector: function($div, unselectedflag, namedisp, option, cls) {
	  var html_source = '';
	  // 事業ユニット情報リストを取得する
	  var buinfolist = clcom.getBuinfo();
	  if (buinfolist == null) {
		return;
	  }
	  html_source += '<select ';
	  $.each(option, function(key, value) {
		  html_source += key + '="' + value + '"';
	  });
	  if (cls != null) {
		  html_source += 'class="' + cls + '"';
	  }
	  html_source += '>';

	  // 未選択値を追加する
	  var buinfo;
	  if (unselectedflag == 1) {
		html_source += '<option value="0">&nbsp;</option>';
	  }
	  for (var i = 0; i < buinfolist.length; i++) {
		buinfo = buinfolist[i];
		// selectorの中身を作成する
		if (namedisp == 1) {
		  html_source += '<option value=' + buinfo.id + '>' +
			buinfo.name + '</option>';
		} else {
		  html_source += '<option value=' + buinfo.id + '>' +
			buinfo.code + ':' + buinfo.name + '</option>';
		}
	  }
	  html_source += '</select>';

	  $div.html('');
	  $div.html(html_source);
	  $div.find('select').selectpicker();
	},

	/**
	 * AOKI
	 * 役職selectorの作成
	 * 引数
	 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・namedisp : 名称のみを取得したい場合1を設定。なにも指定されていない場合はコード：名称で返す
	 */
	cljobpostselector: function($select, unselectedflag, namedisp) {
	  var html_source = '';
	  // 役職区分リストを取得する
	  var jobpostlist = clcom.getJobpostList();
	  if (jobpostlist == null) {
		return;
	  }
	  // 未選択値を追加する
	  var jobpost;
	  if (unselectedflag == 1) {
		html_source += '<option value="0">&nbsp;</option>';
	  }
	  for (var i = 0; i < jobpostlist.length; i++) {
		jobpost = jobpostlist[i];
		// selectorの中身を作成する
		if (namedisp == 1) {
		  html_source += '<option value="' + jobpost.jobpost_id + '">' +
			jobpost.name + '</option>';
		} else {
		  html_source += '<option value="' + jobpost.jobpost_id + '">' +
			jobpost.code + ':' + jobpost.name + '</option>';
		}
	  }
	  $select.html('');
	  $select.html(html_source);

	  $select.selectpicker();
	},

	/**
	 * 年月selectorの作成
	 * AOKI
	 * 引数
	 * ・$div			: 区分selectを作成する親divのjQueryオブジェクト (例：$('#viewarea'))
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・past		: 過去何年から defaultは10年
	 * ・future		: 未来何年まで defaultは0年
	 * ・pyyyymm	: 過去何年から(年月を直接指定) pastよりも優先
	 * ・fyyyymm	: 未来何年まで(年月を直接指定) futureよりも優先
	 * ・option 			: id名、nameなどを記述
	 * 						: 例 { id : "ca_select", name : "info" }
	 * ・cls 				: classに追加したいものを文字列で羅列
	 * 						: 例 "mbn wt280 flleft"
	 */
	initclmonthselector: function($div, unselectedflag, past, future, pyyyymm, fyyyymm,
			option, cls) {
		var ope_month = clutil.dateFormat(clcom.getOpeDate(), 'yyyymm');
		var n_year = Math.floor(ope_month/100);
		var n_month = Math.floor(ope_month%100);

		// 過去何年から
		var n_past = past == null ? 10 : past;
		// 未来何年まで
		var n_future = future == null ? 0 : future;

		var html_source = '';

		html_source += '<select ';
		$.each(option, function(key, value) {
			html_source += key + '="' + value + '"';
		});
		if (cls != null) {
			html_source += 'class="' + cls + '"';
		}
		html_source += '>';


		// 未選択値を追加する
		if (unselectedflag == 1) {
			html_source += '<option value="0">&nbsp;</option>';
		}

		var st_month = n_month;
		var ed_month = 12;

		// 年月を直接指定した場合の処理(優先)
		if (pyyyymm != null) {
			n_past = n_year - Math.floor(pyyyymm/100);
			st_month = Math.floor(pyyyymm%100);
		}
		if (fyyyymm != null) {
			n_future = Math.floor(fyyyymm/100) - n_year;
			n_month = Math.floor(fyyyymm%100);
		}

		for (var i = n_year-n_past; i <= n_year+n_future; i++) {
			// selectorの中身を作成する
			for (j = st_month; j <= ed_month; j++) {
				var month = i*100 + j;
				// selectorの中身を作成する
				html_source += '<option value="' + month + '">' +
				clutil.monthFormat(month, 'yyyy/mm') + '</option>';
			}
			st_month = 1;
			ed_month = i == n_year+n_future-1 ? n_month : 12;
		}
		html_source += '</select>';

		$div.html('');
		$div.html(html_source);
		var $select = $div.find('select');
		$select.selectpicker();
		$select.selectpicker('val', ope_month);
	},

	/**
	 * 年月selectorの作成
	 * AOKI
	 * 引数
	 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・past		: 過去何年から defaultは10年
	 * ・future		: 未来何年まで defaultは0年
	 * ・pyyyymm	: 過去何年から(年月を直接指定) pastよりも優先
	 * ・fyyyymm	: 未来何年まで(年月を直接指定) futureよりも優先
	 */
	clmonthselector: function($select, unselectedflag, past, future, pyyyymm, fyyyymm) {
		var html_source = '';

		var ope_month = clutil.dateFormat(clcom.getOpeDate(), 'yyyymm');
		var n_year = Math.floor(ope_month/100);
		var n_month = Math.floor(ope_month%100);

		// 過去何年から
		var n_past = past == null ? 10 : past;
		// 未来何年まで
		var n_future = future == null ? 0 : future;

		// 未選択値を追加する
		if (unselectedflag == 1) {
			html_source += '<option value="0">&nbsp;</option>';
		}

		var st_month = n_month;
		var ed_month = 12;

		// 年月を直接指定した場合の処理(優先)
		if (pyyyymm != null) {
			n_past = n_year - Math.floor(pyyyymm/100);
			st_month = Math.floor(pyyyymm%100);
		}
		if (fyyyymm != null) {
			n_future = Math.floor(fyyyymm/100) - n_year;
			n_month = Math.floor(fyyyymm%100);
		}

		for (var i = n_year-n_past; i <= n_year+n_future; i++) {
			// selectorの中身を作成する
			for (j = st_month; j <= ed_month; j++) {
				var month = i*100 + j;
				// selectorの中身を作成する
				html_source += '<option value="' + month + '">' +
				clutil.monthFormat(month, 'yyyy/mm') + '</option>';
			}
			st_month = 1;
			ed_month = i == n_year+n_future-1 ? n_month : 12;
		}

		$select.html('');
		$select.html(html_source);
		// 初期値は運用日
		$select.val(ope_month);

		$select.selectpicker();
		$select.selectpicker('val', ope_month);
	},

	/**
	 * 年月別selectorの作成
	 * AOKI
	 * 引数
	 * ・$y_select			: 年表示用selectのjQueryオブジェクト (例：$('#viewarea'))
	 * ・$m_select			: 月表示用selectのjQueryオブジェクト (例：$('#viewarea'))
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・past		: 過去何年から defaultは10年
	 * ・future		: 未来何年まで defaultは0年
	 * ・pyyyymm	: 過去何年から(年月を直接指定) pastよりも優先
	 * ・fyyyymm	: 未来何年まで(年月を直接指定) futureよりも優先
	 */
	clyearmonthselector: function($y_select, $m_select,
			unselectedflag, past, future, pyyyymm, fyyyymm) {

		// 年selectorの作成
		var html_source = '';
		var ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');

		// 過去何年から
		var n_past = past == null ? 10 : past;
		// 未来何年まで
		var n_future = future == null ? 0 : future;

		// 未選択値を追加する
		if (unselectedflag == 1) {
			html_source += '<option value="0">&nbsp;</option>';
		}

		// 2006年～にする 5/8
		var pyyyy = 2006;
//		for (var i = ope_year+n_future; i >= ope_year-n_past; i--) {
		for (var i = ope_year+n_future; i >= pyyyy; i--) {
			html_source += '<option value="' + i + '">' + i + '年</option>';
		}

		$y_select.html('');
		$y_select.html(html_source);
		// 初期値は運用日
		$y_select.val(ope_year);

		$y_select.selectpicker();
		$y_select.selectpicker('val', ope_year);

		// 月selectorの作成
		html_source = '';
		var ope_month = clutil.dateFormat(clcom.getOpeDate(), 'mm');

		for (var i = 1; i <= 12; i++) {
			html_source += '<option value="' + i + '">' + i + '月</option>';
		}

		$m_select.html('');
		$m_select.html(html_source);
		// 初期値は運用日
		$m_select.val(ope_month);

		$m_select.selectpicker();
		$m_select.selectpicker('val', ope_month);
	},

	s_time : 900,
	e_time : 2259,
	time_range : 1,

	/**
	 * 時間selectorの作成
	 * AOKI
	 * 引数
	 * ・$hh_select			: 時区分selectのjQueryオブジェクト (例：$('#viewarea'))
	 * ・$mm_select			: 分区分selectのjQueryオブジェクト (例：$('#viewarea'))
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・start		: 開始時刻から defaultは900
	 * ・end		: 終了時刻まで defaultは2200
	 * ・minute		: 刻み分数 defaultは30
	 */
	cltimeselector: function($hh_select, $mm_select,
			unselectedflag, start, end, minute) {
		// 開始時刻から
		var n_start = start == null ? clutil.s_time : start;
		// 終了時刻まで
		var n_end = end == null ? clutil.e_time : end;
		// 刻み分数
		var n_minute = minute == null ? clutil.time_range : minute;

		var twodigit = function(obj) {
			if (obj < 10) {
				obj = '0' + obj;
			}
			return obj;
		};

		// 時セレクターの作成
		var html_source = '';

		var h_start = Math.floor(n_start/100);
		var h_end = Math.floor(n_end/100);

		// 未選択値を追加する
		if (unselectedflag == 1) {
			html_source += '<option value="">&nbsp;</option>';
		}
		for (var i = h_start; i <= h_end; i ++) {
			// selectorの中身を作成する
			html_source += '<option value="' + i + '">' + twodigit(i) + '</option>';
		}
		$hh_select.html('');
		$hh_select.html(html_source);
		// 初期選択値を設定
//		$hh_select.val(h_st?art);
		$hh_select.selectpicker();

		// 分セレクターの作成
		html_source = '';

		// 未選択値を追加する
		if (unselectedflag == 1) {
			html_source += '<option value="">&nbsp;</option>';
		}
		for (var i = 0; i < 60; i += n_minute) {
			// selectorの中身を作成する
			html_source += '<option value="' + i + '">' + twodigit(i) + '</option>';
		}
		$mm_select.html('');
		$mm_select.html(html_source);
		// 初期選択値を設定
//		$mm_select.val(n_minute);
		$mm_select.selectpicker();
	},

	/**
	 * 週selectorの作成
	 * AOKI
	 * 引数
	 * ・$y_select			: 年表示用selectのjQueryオブジェクト (例：$('#viewarea'))
	 * ・$w_div				: 週表示用selectを作成する親divのjQueryオブジェクト (例：$('#viewarea'))
	 * ・w_option 			: 週表示用selectのid名、nameなどを記述
	 * 						: 例 { id : "ca_select", name : "info" }
	 * ・w_cls 				: 週表示用selectのclassに追加したいものを文字列で羅列
	 * 						: 例 "mbn wt280 flleft"
	 * ・weeklist			: 週リスト
	 * ・getOpeWeek			: 運用週を取得する場合trueを指定
	 */
	clweekselector: function($y_select, $w_div,
			w_option, w_cls, weeklist, getOpeWeek) {
		if (weeklist == null || weeklist.length == 0) {
			$y_select.remove();
			$w_div.remove();
			return {};
		}
		var html_source = '';
		var week_hash = {};

		// 年から週リストを取得するハッシュを作成する
		for (var i = 0; i < weeklist.length; i++) {
			var week = weeklist[i];
			if (week.type != amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YW) {
				continue;
			}
			var year = week.year;

			if (week_hash[year] == null) {
				week_hash[year] = [];
			}
			week_hash[year].push(week);
		}

		// 運用日の週を取得
		var ope_y, ope_w;
		var pOpe_period = null;
		var pOpe_y, pOpe_w;
		if (weeklist != null && weeklist.length > 0) {
			for (var i = 0; i < weeklist.length; i++) {
				var week = weeklist[i];

				if (clcom.getOpeDate() >= week.st_iymd &&
						clcom.getOpeDate() <= week.ed_iymd) {
					ope_y = week.year;
					ope_w = week.period;
					break;
				}
			}

			// 前週の取得
			if (i < weeklist.length-1) {
				pOpe_period = weeklist[i+1];
			}
			if (pOpe_period != null) {
				pOpe_y = pOpe_period.year;
				pOpe_w = pOpe_period.period;
			}
		}

		// 年selectorの作成
		// 降順表示をするためソート
		var tmp_week_hash = [];
		$.each(week_hash, function(key, value) {
			tmp_week_hash.push(key);
		});
		tmp_week_hash.sort(function(a,b){
		    return(b-a);
		});
		$.each(tmp_week_hash, function() {
			html_source += '<option value="' + this + '">' +
			this + '年' + '</option>';
		});

		$y_select.html('');
		$y_select.html(html_source);

		//コンボボックス変更時
		$y_select.change(function() {
			html_source = "";
			var year = $y_select.val();
			// 週selectorの作成
			var weeklist = week_hash[year];

			html_source += '<select ';
			$.each(w_option, function(key, value) {
				html_source += key + '="' + value + '"';
			});
			if (w_cls != null) {
				html_source += 'class="' + w_cls + '"';
			}
			html_source += '>';

			for (var i = 0; i < weeklist.length; i++) {
				// selectorの中身を作成する
				var week = weeklist[i];

				html_source += '<option value="' + week.period + '">' + week.period + '週(' +
				clutil.dateFormat(week.st_iymd, 'yyyy/mm/dd') + '～' + '</option>';
			}
			html_source += '</select>';

			$w_div.html('');
			$w_div.html(html_source);

			$w_div.find('select').selectpicker();
		});

		// 初期値は運用日
		$y_select.val(ope_y);
		$y_select.selectpicker();
		$y_select.selectpicker('val', ope_y);

		// 当週、前週を返却
		return {
			ope_y : ope_y,
			ope_w : ope_w,
			pOpe_y : pOpe_y,
			pOpe_w : pOpe_w
		};
	},

	/**
	 * 週リストから対象週を取得
	 * AOKI
	 * 引数
	 * ・weeklist	: 週リスト
	 * ・yyyy		: 対象年
	 * ・ww			: 対象週
	 */
	getweekdate: function(weeklist, yyyy, ww) {
		var retWeek = {};
		if (weeklist == null || weeklist.length == 0) {
			return retWeek;
		}
		var week_hash = {};

		for (var i = 0; i < weeklist.length; i++) {
			// 年から週リストを取得するハッシュを作成する
			var week = weeklist[i];
			if (week.type != amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YW) {
				continue;
			}
			var year = week.year;

			if (week_hash[year] == null) {
				week_hash[year] = [];
			}
			week_hash[year].push(week);
		}
		var week_list = week_hash[yyyy];
		for (var i = 0; i < week_list.length; i++) {
			var week = week_list[i];
			if (ww == week.period) {
				retWeek = week;
				break;
			}
		}

		// 対象週を返却
		return retWeek;
	},

	/**
	 * 半期selectorの作成
	 * AOKI
	 * 引数
	 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・past		: 過去何年から defaultは10年
	 * ・future		: 未来何年まで defaultは0年
	 */
	clhalfselector: function($select, unselectedflag, past, future) {
		var html_source = '';

		var ope_month = clutil.dateFormat(clcom.getOpeDate(), 'yyyymm');
		var n_year = Math.floor(ope_month/100);
		var n_month = Math.floor(ope_month%100);

		// 過去何年から
		var n_past = past == null ? 10 : past;
		// 未来何年まで
		var n_future = future == null ? 0 : future;

		// 未選択値を追加する
		if (unselectedflag == 1) {
			html_source += '<option value="0">&nbsp;</option>';
		}

		// 半期を設定 4～10 : 1期 11～12,1～3 : 2期
		if (n_month > 3 && n_month < 11) {
			n_month = 1;
		} else {
			n_month = 2;
		}

		var half_1 = n_month;
		var half_2 = 2;
		for (var i = n_year-n_past; i <= n_year+n_future; i++) {
			// selectorの中身を作成する
			for (j = half_1; j <= half_2; j++) {
				var half = i*100 + j;
				// selectorの中身を作成する
				html_source += '<option value="' + half + '">' +
				clutil.monthFormat(half, 'yyyy/mm') + '期</option>';
			}
			half_1 = 1;
			half_2 = i == n_year+n_future-1 ? n_month : 2;
		}

		$select.html('');
		$select.html(html_source);
		// 初期値は運用日
		ope_month = n_year*100 + n_month;
		$select.val(ope_month);

		$select.selectpicker();
	},

	/**
	 * 年selectorの作成
	 * AOKI
	 * 引数
	 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 * ・past		: 過去何年から defaultは10年
	 * ・future		: 未来何年まで defaultは0年
	 */
	clyearselector: function($select, unselectedflag, past, future) {
		var html_source = '';

		var ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');

		// 過去何年から
		var n_past = past == null ? 10 : past;
		// 未来何年まで
		var n_future = future == null ? 0 : future;

		// 未選択値を追加する
		if (unselectedflag == 1) {
			html_source += '<option value="0">&nbsp;</option>';
		}

		for (var i = ope_year-n_past; i <= ope_year+n_future; i++) {
			html_source += '<option value="' + i + '">' + i + '</option>';
		}

		$select.html('');
		$select.html(html_source);
		// 初期値は運用日
		$select.val(ope_year);

		$select.selectpicker();
	},

	/**
	 * 年月（ヶ月）selectorの作成
	 * AOKI
	 * 引数
	 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
	 * ・unselectedflag		: 未選択値 0:なし 1:あり
	 */
	clymselector: function($select, unselectedflag) {
		var html_source = '';

		// 何年分
		var n_year = 30;

		// 未選択値を追加する
		if (unselectedflag == 1) {
			html_source += '<option value="0">&nbsp;</option>';
		}
		for (var i = 0; i <= n_year; i++) {
			// selectorの中身を作成する
			for (j = 0; j <= 11; j++) {
				var month = i*100 + j;
				// selectorの中身を作成する
				html_source += '<option value="' + month + '">';
				html_source += clutil.iymFmt(month) + '</option>';
			}
		}

		$select.html('');
		$select.html(html_source);

		$select.selectpicker();
	},

	/**
	 * bootstrap対応
	 * 選択画面起動時などに呼ぶ
	 */
	initUIelement: function($view) {
		  $view.find('[data-toggle="checkbox"]').each(function () {
			  $(this).checkbox();
		  });
		  $view.find('[data-toggle="radio"]').each(function () {
			  $(this).radio();
		  });
		  $view.find('select').each(function () {
			  $(this).selectpicker();
			  $(this).selectpicker('refresh');
		  });
		  var tdovercells = $("table.hilight td"),
			hoverClass = "hover",
			current_r,
			current_c;
		  tdovercells.hover(
			function(){
				var $this = $(this);
				(current_r = $this.parent().children("table td")).addClass(hoverClass);
				(current_c = tdovercells.filter(":nth-child("+ (current_r.index($this)+1) +")")).addClass(hoverClass);
			},
			function(){
				if (current_r) current_r.removeClass(hoverClass);
				if (current_c) current_c.removeClass(hoverClass);
			}
		  );
		  var tdRovercells = $("table.hilightRow td"),
			hoverClass = "hover",
			current_r,
			current_c;
		  tdRovercells.hover(
				function(){
					var $this = $(this);
					(current_r = $this.parent().children("table td")).addClass(hoverClass);
				},
				function(){
					if (current_r) current_r.removeClass(hoverClass);
				}
		  );

		  $view.undelegate('td :checkbox', 'toggle');
		  $view.undelegate('td :radio', 'toggle');

		  //チェックされた行をハイライト
		  $view.delegate('td :checkbox', 'toggle', function(e) {
			  var tr = $(this).closest('tr');
			  if ($(this).prop('checked')) {
				  $(tr).addClass('checked');
			  } else {
				  $(tr).removeClass('checked');
			  }
		  });
		  $view.delegate('td :radio', 'toggle', function(e) {
			  $.each($(this).closest('table').find('tr'), function() {
				$(this).removeClass('checked')
			  });
			  $(this).closest('tr').addClass('checked');
		  });

		  $view.find('#selected').undelegate('.btn-delete', 'mouseover');
		  $view.find('#selected').undelegate('.btn-delete', 'mouseout');
		  $view.find('#selected').undelegate('.btn-delete', 'mousedown');
		  //選択した内容の削除ボタン
		  $view.find('#selected').delegate('.btn-delete', 'mouseover', function(){
			  $(this).parent('li').toggleClass('ovr');
		  });
		  $view.find('#selected').delegate('.btn-delete', 'mouseout', function(){
			  $(this).parent('li').toggleClass('ovr');
		  });
		  $view.find('#selected').delegate('.btn-delete', 'mousedown', function(){
			  $(this).parent('li').addClass('active');
		  });
//		  $view.find('.btn-delete').mouseover(function(){
//			  $(this).closest('tr').toggleClass('ovr');
//		  });
//		  $view.find('.btn-delete').mouseout(function(){
//			  $(this).closest('tr').toggleClass('ovr');
//		  });
//		  $view.find('.btn-delete').mousedown(function(){
//			  $(this).closest('tr').addClass('active');
//		  });
	},

	/**
	 * 絞込条件をハッシュ化
	 */
	makeCondHash: function(anaCondItemList) {
		var condItemHash = {};
		if (anaCondItemList == null || anaCondItemList.length == 0) {
			return condItemHash;
		}
		for (var i = 0; i < anaCondItemList.length; i++) {
			var anaCondItem = anaCondItemList[i];
			if (anaCondItem.f_cond == 1) {
				condItemHash[anaCondItem.cond_kind] = true;
			}
		}
		return condItemHash;

	},

	/*
	 * 選択画面起動時の複数選択または単数選択起動モード
	 */
	cl_single_select : 0,
	cl_multiple_select : 1,

	/**
	 * AOKI
	 * 権限によってボタンなどのオブジェクトを使用可、不可に設定する
	 */
	setFuncObj: function($view) {
		var isFunc = function(func_code) {
			var funclist = clcom.getFuncList();
			var flag = false;
			for (var i = 0; i < funclist.length; i++) {
				var func = funclist[i];
				if (func_code == func.func_code) {
					flag = true;
					break;
				}
			}
			return flag;
		};

		$.each($view.find('.cl_func'), function() {
			var func_code = $(this).attr('func-code');
			if (!isFunc(func_code)) {
				$(this).remove();
			}
		});
	},

	/**
	 * AOKI
	 * よく使う項目を設定する
	 * @param {Integer} item 登録するアイテム
	 * @param {Integer} userId ユーザーID
	 */
	setFrequency: function(item, userId) {
		var frequentList = clcom.getFrequentList(userId);
		if (frequentList == null) {
			// 初期化
			frequentList = [];
		}
		var isExist = false;
		for (var i = 0; i < frequentList.length; i++) {
			var freq = frequentList[i];
			// 同じアイテムを探してカウントアップする
			if (freq.item_id == item.item_id) {
				freq.countUp++;
				freq.date = clcom.getOpeDate();
				isExist = true;
				break;
			}
		}
		if (!isExist) {
			// まだ追加されていなければアイテムを追加する
			item.countUp = 1;
			item.date = clcom.getOpeDate();
			frequentList.push(item);
		}

		// countUpでソート
		frequentList.sort(function(a, b) {return (Number(b.countUp) - Number(a.countUp));});

		clcom.setFrequentList(frequentList, userId);
	},

	/**
	 * 初期フォーカスの設定をする
	 */
	setFirstFocus: function($obj){
		var agent = clcom.getAgent();
		// PCの場合はフォーカス設定
		if (agent == clcom.onPC) {
			clutil.setFocus($obj);
		}
		// mobile, iPadの場合はなにもしない
	},

	/**
	 * フォーカスの設定をする
	 */
	setFocus: function($obj){
		var agent = clcom.getAgent();
		var $button = $obj;

		// bootstrap対応 AOKI ACUST
		if ($obj.is('select')) {
			var $button = $obj.next('div').find('button');
		}

		if (agent == clcom.onPC) {
			// PCの場合はフォーカス設定
			$obj.focus();
			$button.focus();
		} else if (agent == clcom.onMobile && !$obj.is('input') && !$obj.is('select')) {
			// mobile, iPadの場合はinput,selectにはfocusしない
			$obj.focus();
			$button.focus();
		}
	},

	han_txt : "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｬｭｮｯ､｡ｰ｢｣0123456789ﾞﾟ ",
	zen_txt : "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォャュョッ、。ー「」０１２３４５６７８９" +
			  "　　　　　ガギグゲゴザジズゼゾダヂヅデド　　　　　バビブベボ　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　" +
			  "　　　　　　　　　　　　　　　　　　　　　　　　　パピプペポ　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　",

	zen2han: function(txt) {
		var retStr = "";
		for (var i = 0; i < txt.length; i++) {
			var c = txt.charAt(i);
			var n = clutil.zen_txt.indexOf(c, 0);

			if (n == 70) {
				// 空白対応
				c = clutil.han_txt.charAt(72);
			} else if (n >= 130) {
				c = clutil.han_txt.charAt(n-130);
				c += clutil.han_txt.charAt(71);
			} else if (n >= 70) {
				c = clutil.han_txt.charAt(n-70);
				c += clutil.han_txt.charAt(70);
			} else if (n >= 0) {
				c = clutil.han_txt.charAt(n);
			}

			retStr += c;
		}
		return retStr;
	},

	han2zen: function(txt) {
		var retStr = "";
		for (var i = 0; i < txt.length; i++) {
			var c = txt.charAt(i);
			var cnext = txt.charAt(i+1);
			var n = clutil.han_txt.indexOf(c, 0);
			var nnext = clutil.han_txt.indexOf(cnext,0);
			if (n >= 0) {
				if (nnext == 70) {
					c = clutil.zen_txt.charAt(n+70);
					i++;
				} else if (nnext == 71) {
					c = clutil.zen_txt.charAt(n+130);
					i++;
				} else {
					c = clutil.zen_txt.charAt(n);
				}
			}
			if ((n != 70) && (n != 71)) {
				retStr += c;
			}
		}
		return retStr;
	},

	/**
	 * 全角が入力されているかチェック
	 * 入力されていた場合retStatにfalseを返す
	 */
	chkzen2han: function(txt) {
		var retStat = 1;
		for (var i = 0; i < txt.length; i++) {
			var c = txt.charAt(i);
			var n = clutil.han_txt.indexOf(c, 0);
			if (c == ',' || c == '"') {
				retStat = -1;
				break;
			}
			if (n < 0) {
				if (!c.match(/[^A-Za-z\s.-]+/)){

				} else if (!c.match( /[^0-9]+/)){

				} else {
					retStat = 0;
				}
			}
		}
		return retStat;
	},

	/**
	 * 半角文字チェック
	 */
	isHalf : function (c) {
		c = c.charCodeAt(0);
		return (c >= 0x0 && c < 0x81) || (c == 0xf8f0) ||
			(c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
	},

	/**
	 * 分析条件設定部分の開閉を制御
	 */
	initAnaCondition : function() {
		$('#leftColumn.closed').hover(
				function(){clutil.closedHover1(this)},
				function(){clutil.closedHover2(this)}
		);
		// 条件設定を展開
		$('#leftColumn.closed').click(function(e){
			var defer = clutil.openCondition(this);
			if(defer){
				// animation 処理が全部完了したら呼び出す。-- ナビペインが開いたイベントを通知
				defer.done(function(){
					clutil.AnaNaviItemNotifier.publish('onNaviPaneOpened', e);
				});
			}
		});

		// 条件設定を格納
		$('.closeCondition').click(function(e){
			var defer = clutil.closeCondition(this);
			if(defer){
				// animation 処理が全部完了したら呼び出す。-- ナビペインが閉じたイベントを通知
				defer.done(function(){
					clutil.AnaNaviItemNotifier.publish('onNaviPaneClosed', e);
				});
			}
		});
//		$('#mainColumn').addClass('ca_yScroll');
//		$('#mainColumn').perfectScrollbar({wheelSpeed: 100});
		$('#leftColumn').perfectScrollbar({wheelSpeed: 100});
		// 初期時は条件設定を展開
		clutil.openCondition();
	},

	// 分析画面の場合右ウィンドウにもスクロールバーをつける
	setMainColumnScrollbar : function($mainColumn, isAnalyse_mode) {
		if (!isAnalyse_mode) {
			return;
		}
		/**
		 *  保留
		 *  function.js(19行目)でleftColumnをwindowのスクロールした分だけ伸ばす事で対応
		 */
//		$mainColumn.addClass('analytics');
//		$mainColumn.perfectScrollbar({wheelSpeed: 100});
//		$mainColumn.addClass('ca_yScroll');
//		$(window).scrollTo(1);	// ダブルスクロール防止
	},

	open_flg : false,
	leftColumn_top : 0,

	closedHover1 : function() {
		if(!clutil.open_flg){
			$("#leftColumnInBox").animate({
			backgroundColor: "#a2a9b3",
			width: "60px",
			}, 200 );
			$(".mainColumninBox").animate({
			marginLeft: "60px",
			}, 200 );
			$("#mainColumnFooter").animate({
			left: "60px",
			}, 200 );
		}
	},

	closedHover2 : function() {
		if(!clutil.open_flg){
			$("#leftColumnInBox").animate({
			backgroundColor: "#667180",
			width: "40px",
			}, 200 );
			$(".mainColumninBox").animate({
			marginLeft: "40px",
			}, 200 );
			$("#mainColumnFooter").animate({
			left: "40px",
			}, 200 );
		}
	},

	openCondition : function() {
		if(!clutil.open_flg){
			clutil.open_flg = true;
			// 上からの位置を修正
			console.log('clutil.leftColumn_top = ' + clutil.leftColumn_top);
			$('#leftColumn').scrollTop(clutil.leftColumn_top);

			$('#leftColumn').find(".lC_button").removeClass('dispn');
			$('#leftColumn').removeClass('closed');
			$('#leftColumn').addClass('opened');

			var p1 = $('#leftColumn').find("#leftColumnInBox").animate({
				backgroundColor: "#a2a9b3",
				width: "580px"
			}, 200 ).promise();

			var p2 = $('#leftColumn').parent().find(".mainColumninBox").animate({
				marginLeft: "580px"
			},{
				complete: function(){
					$('#mainColumnFooter.analytics').css("left",'580px');
					$('#mainColumnFooter.analytics').css("width", $('#mainColumninBox').width()+'px');
					$('#mainColumnFooter.analytics p a').css("width",'100%');
					// 下部ボタンを一度隠す perfectscrollbar対応
					$('.conditionFooter').removeClass('dispn');
					$('.conditionFooter').css("width",$('#leftColumn').width()+'px');
					$('.conditionFooter').css("left",'0px');
					ch_width();
					// openした時は右ウィンドウを上まで戻す
					$(window).scrollTo(0);
				}
			}, 200 ).promise();

			var p3 = $("#mainColumnFooter").animate({
				left: "580px"
			}, 200 ).promise();

			$(".condition").removeClass('dispn');
			$('#leftColumn').find(".condition").fadeIn();

			return $.when(p1, p2, p3);
		}
		return null;
	},

	closeCondition : function() {
		// 上からの位置を記憶
		// 0の場合は前の位置を記憶
		var leftColumn_scrollTop = $('#leftColumn').scrollTop() == 0 ?
				clutil.leftColumn_top : $('#leftColumn').scrollTop();
		clutil.leftColumn_top = leftColumn_scrollTop;
		$('#leftColumn').scrollTop(0);

		$(".condition").addClass('dispn');
		$('.closeCondition').parents("#leftColumn").addClass('closed');
		$('.closeCondition').parents("#leftColumn").removeClass('opened');

		var p1 = $('.closeCondition').parents("#leftColumnInBox").animate({
			backgroundColor: "#667180",
			width: "40px"
		}, 200 ).promise();

		var p2 = $("#mainColumnFooter").animate({
			left: "40px"
		}, 200 ).promise();

		// 下部ボタンを再表示 perfectscrollbar対応
		$('.conditionFooter').addClass('dispn');

		var p3 = $('.closeCondition').parents("#container").find('.mainColumninBox').animate({
			marginLeft: "40px",
		}, {
			complete: function(){
				clutil.open_flg = false;
				$('#mainColumnFooter.analytics').css("left",'40px');
				$('#mainColumnFooter.analytics').css("width", $('#mainColumninBox').width()+'px');
				$('#mainColumnFooter.analytics p a').css("width",'100%');
				$('.conditionFooter').css("width",$('#leftColumn').width()+'px');
				$('.conditionFooter').css("left",'0px');
				ch_width();
			}
		}, 200 ).promise();

		return $.when(p1, p2, p3);
	},

	// エラーメッセージ定義を取るためのラッパ関数
	getclmsg: function(key) {
		var msg = clmsg[key];
		return _.isEmpty(msg) ? key : msg;
	},

	/**
	 * マスタ検索日をタイプに合わせて返却する
	 * isAnalyse_mode: 分析でない場合は運用日を返却
	 */
	getMstSrchDate: function(isAnalyse_mode, anaProc, s_type) {
		if (isAnalyse_mode) {
			return anaProc.getMstSrchDate(s_type)
		} else {
			return clcom.getOpeDate();
		}
	},

	/**
	 * ノーサイン用
	 * サーバー接続時、タブ押下時は必ず画面情報とストレージ情報のチェックを行う
	 */
	chkCustPageType: function() {
		var screenCd = $("#ca_userInfo").html().split(':')[0];
		var userInf = clcom.getUserData();
		var cd = userInf.org_cd;
		if (clutil.chkStr(screenCd) && screenCd != cd) {
			// 画面情報とストレージ情報が異なる場合は強制的にログイン画面へ戻る
			clutil.WarningDialog(clmsg.cl_userinfo_warning, function(e){
				url = clcom.urlRoot;
				clcom.cancelBeforeUnload(url);
				location.href = url;
			});
			return false;
		}
		return true;
	},

	/**
	 * ノーサイン用
	 * プリント情報を作成
	 */
	printInfo: function() {
		var defaultPrintInfo = {
			getInitObj : function() {
				return {template : '',
						postal_code1 : '',
						postal_code2 : '',
						address1 : '',
						address2 : '',
						address3 : '',
						name1 : '',
						name2 : '',
						kana1 : '',
						kana2 : '',
						tel1 : '',
						tel2 : '',
						tel3 : '',
						unit : '',
						shop : '',
						shopAddress1 : '',
						shopAddress2 : '',
						shopAddress3 : '',
						shopTel : '',
						year : '',
						month : '',
						day : '',
						birthYear : '',
						birthMonth : '',
						birthDay : '',
						point : '',
						card : '',
						name_merge : ''};
			},
			makeUrl : function(printObj) {
				var url = clcom.urlRoot + '/crm_auto_print_jnlp/jnlp.jsp?';
				$.each(printObj, function(key, value) {
					url += key + '=' + value + '&';
				});
				// 最後の&をとる
				url = url.slice(0,url.length-1);
				return url;
			}
		}
		return defaultPrintInfo;
	}

  });
}());

////////////////////////////////////////////////////////////////
//フォーカス遷移部品
(function () {
var ENTER = 13, TAB = 9;

var tabbableSelector = 'input,select,a,button,textarea,[tabindex]';
function tabbable(el) {
 var $el = $(el),
       exclude = $el.is('[readonly],[type="hidden"]'),
     isTabbable = $el.is(':tabbable'),
     isCmButton = $el.hasClass('cm_button_single');
 return !exclude && isTabbable && !isCmButton;
}

var findNextElement = function ($el, shift, options) {
 var i, input = $el.get(0);
 if (!input)
   return;

 var focusableElements = options.elements || (options.view ?
                                              options.view.find('input,select,a,button,textarea,[tabindex]') :
                                              $('input,select,a,button,textarea,[tabindex]')),
     numElements = focusableElements.length;

 if (!numElements)
   return;

 if (options.useTabindex) {
   focusableElements = _.sortBy(focusableElements, function (el) {
     return el.tabIndex || Infinity;
   });
 }

 for (i = 0; i < numElements; i += 1) {
   if (focusableElements[i] === input) {
     break;
   }
 }
 var nowIndex = i;

 var n1, n2, inc = shift < 0 ? -1 : 1,
     nextIndex = nowIndex + inc;

 if (nowIndex === numElements) {
   nextIndex = inc > 0 ? 0 : -1;
 }

 if (shift < 0) {
   inc = -1;
   n1 = -1;
   n2 = numElements;
 } else {
   inc = 1;
   n1 = numElements;
   n2 = -1;
 }

 var target;
 i = nextIndex;
 while (i !== n1) {
   if (tabbable(focusableElements[i])) {
     target = focusableElements[i];
     break;
   }
   i += inc;
 }

 if (!target) {
   i = n2 + inc;
   while (i !== nextIndex) {
     if (tabbable(focusableElements[i])) {
       target = focusableElements[i];
       break;
     }
     i += inc;
   }
 }

 return target;
};

var focus = function ($input, shift, options) {
 if ($input) {
   options = options || {};

   if (shift) {
     var target = findNextElement($input, shift, options);
     if (target) {
       $(target).focus();
     }
   } else {
     $input.focus();
   }
 }
};

function buildCache($elements) {
 if (!$elements) {
   $elements = $(tabbableSelector);
 }

 var i, l, el;
 var cache = [];
 for (i = 0, l = $elements.length; i < l; i += 1) {
   el = cache[i] = $elements[i];
   $(el).attr('data-tabindex', i);
 }

 return cache;
}

function findNextElementCache($input, shift, options) {
 var index = $input.attr('data-tabindex');
 if (!index) {
   if (shift > 0)
     index = -1;
   else
     index = 0;
 }

 index = parseInt(index, 10);
 var cache = options._cache;
 var l = cache.length;
 return cache[(index + shift + l) % l];
}

/**
* Enter、 上下キーによるフォーカス移動を可能にする。
* @deprecate {jQuery} $el 使用していません
* @deprecate {jQuery,Function} [options.filter=false] 使用していません
* @param {Boolean} [options.useTabindex=false] tabIndexによる順序付けするか
* @param {Boolean} [options.convtab=false] Enterキーをタブにコンバート(msieオンリー)
* @returns {jQuery} $el
* @example
* <pre>
* clutil.enterFocusMode($('#myForm'), { useTabindex: false, convtab: false });
* </pre>
*/
var enterFocusMode = (function () {

 var callback = function (options, ev) {
   if (clutil._modalDialogShown && !options.view) {
     return;
   }

   var el = ev.target,
       $el = $(el),
       tagName = el.tagName.toLowerCase(),
       isButton =
    	   		tagName === 'button' ||
       			$el.hasClass('btn') ||
       			$el.is('input[type=button],input[type=submit]') ||
       			tagName === 'a',
       isNoEnterFocus = $el.hasClass('cl_noEnterFocus'),
       shift = 0,
       upOrDown = false,
       keyCode = ev.which,
       shiftKey = ev.shiftKey;

   switch (keyCode) {
   case 9:  // TAB
   case 13: // ENTER
     shift = shiftKey ? -1 : 1;
     break;
//   case 39: // 右
//     if (isButton) {
//       shift = 1;
//     }
//     break;
//   case 40: // 下
//     shift = 1;
//     upOrDown = true;
//     break;
//   case 37: // 左
//     if (isButton) {
//       shift = -1;
//     }
//     break;
//   case 38: // 上
//     shift = -1;
//     upOrDown = true;
//     break;
   }

   if (!shift) {
     return;
   }

   if (options.beforeFocus) {
     options.beforeFocus(ev);
   }

   if (options.upDownRow && upOrDown) {
     var $table = $el.closest('.updownfocus');
     if ($table.length && $table.get(0) !== el) {
       var $tr = $el.closest('tr'),
           index = $tr.find(tagName).index($el),
           $nextTr = shift > 0 ? $tr.next() : $tr.prev(),
           $next;
       while ($nextTr.length) {
         $next = $nextTr.find(tagName).eq(index);
         if (tabbable($next)) {
           break;
         }
       }
       if ($next && $next.length) {
         ev.preventDefault();
         $next.focus();
       }
       return;
     }
   }

   // textareaはEnterのときのみ無視
   if ('textarea' === tagName && keyCode == 13) {
     return;
   }

   if (isButton) {
     if (keyCode === 13 && !shiftKey) {   // エンター時
       return;
     }
   }

   /** Enter時ボタン以外はなにもしない **/
   if (keyCode === 13 && isNoEnterFocus) {
	   return;
   }
   /** Enter時ボタン以外はなにもしない **/
   if (options.convtab && window.event) {
     if (shift > 0 || keyCode === ENTER || keyCode === TAB) {
       window.event.keyCode = 9;
       return;
     }
   }

   var target;
   if (options._cache) {
     target = findNextElementCache($el, shift, options);
   } else {
     target = findNextElement($el, shift, options);
   }
   if (target) {
     ev.preventDefault();
     $(target).focus();
   }
 };

 return function (el, options) {
   if (!options)
     options = el;
   options = options || {};
   _.defaults(options, {filter: function () {return true}});
   options.convtab = options.convtab && $.browser.msie;

   var cb = _.bind(callback, null, options);
   if (options.convtab) {
     $(document).off('.clEnterFocusMode')
       .on('keydown.clEnterFocusMode', cb);
     clutil._enterFocusMode = 'convertTab';
   } else if (options.view) {
     $(options.view).off('.clEnterFocusMode')
       .on('keydown.clEnterFocusMode', cb);
   } else if (options.cache) {
     options._cache = buildCache();
     $(document).off('.clEnterFocusMode')
       .on('keydown.clEnterFocusMode', cb);
   } else {
     $(document).off('.clEnterFocusMode')
       .on('keydown.clEnterFocusMode', cb);
     clutil._enterFocusMode = 'emulateTab';
   }
   return el;
 };
}());

var leaveEnterFocusMode = function () {
 $(document).off('.clEnterFocusMode');
};

_.extend(clutil, {
 focus: focus,
 enterFocusMode: enterFocusMode,
 leaveEnterFocusMode: leaveEnterFocusMode
});
}());

////////////////////////////////////////////////////////////////
// form serializer, deserializer
(function () {
  _.extend(clutil, (function (Syphon) {
	var inputReaders = new Syphon.InputReaderSet(),
		inputWriters = new Syphon.InputWriterSet(),
		keyExtractors = new Syphon.KeyExtractorSet(),
		elementExtractor = function ($view) {
		  return $view.find('input,textarea,select,span[data-name]');
		},
		defaultOptions = {
		  inputReaders: inputReaders,
		  inputWriters: inputWriters,
		  keyExtractors: keyExtractors,
		  elementExtractor: elementExtractor
		},
		unmaskValue = function ($el, value) {
		  if ($el.hasClass('cl_date')) {
			value = clutil.dateFormat(value, 'yyyymmdd');
		  } else if ($el.hasClass('cl_month')) {
			value = clutil.monthFormat(value, 'yyyymm');
		  } else if ($el.hasClass('cl_time')) {
			value = clutil.timeFormat(value, 'hhmm');
		  } else {
			value = $.inputlimiter.unmask(value, {
			  limit: $el.attr('data-limit'),
			  filter: $el.attr('data-filter')
			});
		  }
		  return clutil.cStr(value);
		},
		maskValue = function ($el, value) {
		  if ($el.hasClass('cl_date')) {
			value = clutil.dateFormat(value, 'yyyy/mm/dd');
		  } else if ($el.hasClass('cl_month')) {
			value = clutil.monthFormat(value, 'yyyy/mm');
		  } else if ($el.hasClass('cl_time')) {
			value = clutil.timeFormat(value, 'hh:mm');
		  } else {
			value = $.inputlimiter.mask(value, {
			  limit: $el.attr('data-limit'),
			  filter: $el.attr('data-filter')
			});
		  }
		  return clutil.cStr(value);
		},

		buildOptions = function () {

		  // inputReaders
		  inputReaders.registerDefault(function ($el) {
			return $el.val();
		  });
		  inputReaders.register('checkbox', function ($el) {
			return $el.prop('checked') ? 1 : 0;
		  });
		  inputReaders.register('text', function ($el) {
			var val = $el.val();
			return unmaskValue($el, val);
		  });
		  inputReaders.register('span', function ($el) {
			var val = $el.text();
			return unmaskValue($el, val);
		  });

		  // inputWriters
		  inputWriters.registerDefault(function ($el, value) {
			$el.val(clutil.cStr(value));
		  });
		  inputWriters.register('text', function ($el, value) {
			value = maskValue($el, value);
			clutil.inputlimiter($el, 'set', value);
		  });
		  inputWriters.register('checkbox', function ($el, value) {
			$el.prop('checked', value);
		  });
		  inputWriters.register('radio', function ($el, value) {
			$el.prop('checked', $el.val() === value);
		  });
		  inputWriters.register('span', function ($el, value) {
			value = maskValue($el, value);
			$el.text(value);
		  });

		  // KeyExtractor
		  keyExtractors.registerDefault(function ($el) {
			return $el.prop('name');
		  });
		  keyExtractors.register('span', function ($el) {
			return $el.attr('data-name');
		  });
		};

	buildOptions();

	var deserialize = function ($view, resultdata, options) {
	  options = _.extend({}, defaultOptions, options);
	  return Syphon.deserialize($view, resultdata, options);
	};

	var serialize = function ($view, options, resultdata) {
	  resultdata = resultdata || {};
	  options = _.extend({}, defaultOptions, options);
	  var serialized = Syphon.serialize($view, options);
	  return _.extend(resultdata, serialized);
	};

	return {
	  /**
	   * データをビューに反映する
	   * @param {jQuery or Backbone.View} $view 表示エリアのjQueryオブジェクト (例：$('#viewarea'))
	   * @param {Object or Array} resultdata
	   * @param {Object} options
	   */
	  deserialize: deserialize,

	  /**
	   * ビューからデータオブジェクトを作成する
	   * @param {jQuery or Backbone.View} $view jQueryオブジェクト (例：$('#viewarea'))
	   * @param {Object} resultdata 作成するデータオブジェクトを上書きする場合はオブジェクトを指定
	   *							なにも指定されていない場合は新しいオブジェクトを作成する
	   * @return {Object}
	   */
	  serialize: serialize
	};
  }(Backbone.Syphon)));

}());

(function () {
  /** キー用イベント作成関数
   * @param {jQuery Object} $el 監視ターゲットエレメント
   * @returns {Event Object} Backbone.Eventをmixinしたオブジェクト
   */
  var makeKeyvent = (function () {

	var keyMap = {
	  //function keys
	  "112": ["f1"],
	  "113": ["f2"],
	  "114": ["f3"],
	  "115": ["f4"],
	  "116": ["f5"],
	  "117": ["f6"],
	  "118": ["f7"],
	  "119": ["f8"],
	  "120": ["f9"],
	  "121": ["f10"],
	  "122": ["f11"],
	  "123": ["f12"]
	};

	//a-z and A-Z
	for (var aI = 65; aI <= 90; aI += 1) {
	  keyMap[aI] = String.fromCharCode(aI + 32);
	}

	return function ($el) {
	  var registeredKeys = {},

		  vent = _.extend({}, Backbone.Events),

		  toKeyStr = function (ev, key) {
			var code = ev.keyCode,// || e.which;
				codes = [];
			if (ev.ctrlKey)
			  codes.push('C');
			if (ev.shiftKey)
			  codes.push('S');
			if (ev.altKey)
			  codes.push('M');
			codes.sort();
			codes.push(key);
			return codes.join('-');
		  },

		  normalizeKey = function (key) {
			var codes = key.split('-'),
				k = codes.pop();
			codes.sort();
			codes.push(k);
			return codes.join('-');
		  },

		  keydownCallback = function (ev) {
			var code = ev.keyCode,// || e.which;
				keys = keyMap[code] || [];

			if (_.any(keys, function (key) {return registeredKeys[toKeyStr(ev, key)]})) {
			  ev.preventDefault();
			}
		  },

		  keyupCallback = function (ev) {
			var code = ev.keyCode,// || e.which;
				keys = keyMap[code];

			_.each(keys, function (key) {
			  key = toKeyStr(ev, key);
			  vent.trigger(key, ev, key);
			});
		  };

	  vent.on = function (name, callback, context) {
		if (typeof name !== 'object') {
		  name = normalizeKey(name);
		  registeredKeys[name] = true;
		}
		Backbone.Events.off.call(this, name);
		Backbone.Events.on.call(this, name, callback, context);
	  };

	  vent.off = function (name, callback, context) {
		if (typeof name !== 'object') {
		  name = normalizeKey(name);
		  delete registeredKeys[name];
		}
		Backbone.Events.off.call(this, name);
	  };

	  vent.stop = function () {
		$el.off('keydown', keydownCallback);
		$el.off('keyup', keyupCallback);
	  };

	  vent.start = function () {
		vent.stop();
		$el.on('keydown', keydownCallback);
		$el.on('keyup', keyupCallback);
	  };

	  vent.start();

	  return vent;
	};
  }());


  // グローバルなキーイベント
  var globalKeyvent;

  $(function () {
	globalKeyvent = makeKeyvent($('body'));
  });

  ////////////////////////////////////////////////////////////////
  // public
  _.extend(clutil, {
	/**
	 * body にキーイベント処理を割りあてる。
	 *
	 * 注意: ブラウザに割りあてられたキーが上書きされる。
	 * @param {String} key キー
	 * @param {Function} callback 処理関数
	 * @param {Object} context コンテキスト
	 * @example
	 * <pre>
	 * // f1 キーでアラート
	 * clutil.globalSetKey("f1", function () {alert('f1 pressed')});
	 * // Ctrlとfキー同時押しでアラート
	 * clutil.globalSetKey("C-f", function () {alert('C-f pressed')});
	 * // Ctrl, Shift, Alt と g 同時押しでアラート
	 * clutil.globalSetKey("C-M-S-g", function () {alert('S-M-S-g pressed')});
	 * </pre>
	 */
	globalSetKey: function (key, callback, context) {
	  globalKeyvent.on(key, callback, context);
	},

	/**
	 * body に割り当てたキーイベント処理を解除する。
	 * @param {String} key キー
	 * @param {Function} callback 処理関数
	 * @param {Object} context コンテキスト
	 * @example
	 * <pre>
	 * clutil.globalUnsetKey("f1");
	 * clutil.globalUnsetKey("C-f");
	 * </pre>
	 */
	globalUnsetKey: function (key, callback, context) {
	  globalKeyvent.off(key, callback, context);
	}
  });
}());


$(function () {
  // AOKI
  HeaderView = Backbone.View.extend({
	  // 要素
	  el	: $('#cl_header'),

	  // Events
	  events: {
	  },

	  initialize: function() {
	  },

	  render: function(appCallback, option) {
		  var _this = this;
		  $('#cl_header').empty();
		  $('#cl_header').load(clcom.urlRoot + '/analyze_header.html', function(){
			  // メニュー画面では＜ボタンは非表示
			  if (clcom.pageId == 'menu') {
				  $(this).find('#cl_menu').remove();
			  } else {
				  $(this).find('#cl_menu').click(function(){
					  // メニュー画面へ
					  clcom.pushPage(clcom.appRoot + '/menu/menu.html',
							  null, null, null, true);
				  });
			  }

			  // bodyを表示
			  $('#ca_body').show();

			  var userData = clcom.getUserData();
			  var userName = clutil.cStr(userData.staff_name) == "" ? "" :
				  				userData.staff_code + ":" + userData.staff_name
			  $("#ca_userInfo").html(userName);
			  $("#ca_opeDate").html(clutil.dateFormat(clcom.getOpeDate(), "yyyy/mm/dd"));

			  //ヘッダー位置
			  mh = $('#mainColumn').height();
			  wh = $('body').height();
			  if(wh <= mh){
				  ch = mh;
			  }else{
				  ch = wh - 50;
			  }
			  $('#container').css("height",ch+'px');
			  $('#leftColumn').css("height",ch+'px');

			  sl = $(window).scrollLeft();
			  ww = $(window).width();
			  rbw = $(".rightBox").width()*1.25;
			  hw = $("#header h1").width();
			  if(0 < $("#header p").size()){
				  pw = $("#header p").width();
				  h_rightbox = ww-rbw-hw-pw;
				  $('#header p').css("margin-left",sl+'px');
			  }else{
				  h_rightbox = ww-rbw-hw;
				  $('#header h1').css("padding-left",sl+'px');
			  }

			  $('.rightBox').css("margin-left",h_rightbox+'px');

			  //conditionFooterがある場合適用
			  if(0 < $(".conditionFooter").size()){
				  ch_width();
			  }

			  // コールバック関数を呼ぶ
			  if (appCallback != null) {
				  appCallback();
			  }

		  });
		  return this;
	  },

	  setFunc: function(_this) {
		  // 権限データを取得
		  var funcgrp = clcom.getFuncGrp();
		  var agent = clcom.getAgent();
		  $.each(clutil.funcgrpname, function() {
			  // 権限に応じてタブを隠す
			  if (!funcgrp[this.toString()]) {
				  $(_this).find('li.' + this.toString()).remove();
			  }
		  });
		  // iPad時は権限設定、データ登録は操作不可
		  if (agent == clcom.onMobile) {
			  $(_this).find('li.permission').remove();
			  $(_this).find('li.upload').remove();
		  }
		  clutil.setFuncObj($('body'));
	  }
  });
});


$(function () {
	  // AOKI
	  Cust_HeaderView = Backbone.View.extend({
		  // 要素
		  el	: $('#cl_header'),

		  // Events
		  events: {
		  },

		  initialize: function() {
		  },

		  render: function(appCallback, option) {
			  var _this = this;
			  $('#cl_header').empty();
			  $('#cl_header').load(clcom.urlRoot + '/cust_header.html', function(){
				  // bodyを表示
				  $('#ca_body').show();

				  var userId = clcom.getUserData();

				  var cd = userId.org_cd;
				  var name = userId.org_name;

				  var data = cd + ":" + name;

				  $("#ca_userInfo").html(data);
				  $("#ca_opeDate").html(clutil.dateFormat(clcom.getOpeDate(), "yyyy/mm/dd"));

				  //ヘッダー位置
				  mh = $('#mainColumn').height();
				  mbh = $('#mainColumninBox').height();
				  leh = mh > mbh ? mh : mbh;
				  leh = leh + 60;
				  wh = $('body').height();
				  if(wh <= mh){
					  ch = mh;
				  }else{
					  ch = wh - 50;
				  }
				  $('#container').css("height",ch+'px');
				  $('#leftColumn').css("height",leh+'px');

				  sl = $(window).scrollLeft();
				  ww = $(window).width();
				  rbw = $(".rightBox").width()*1.25;
				  hw = $("#header h1").width();
				  if(0 < $("#header p").size()){
					  pw = $("#header p").width();
					  h_rightbox = ww-rbw-hw-pw;
					  $('#header p').css("margin-left",sl+'px');
				  }else{
					  h_rightbox = ww-rbw-hw;
					  $('#header h1').css("padding-left",sl+'px');
				  }

				  $('.rightBox').css("margin-left",h_rightbox+'px');

				  // コールバック関数を呼ぶ
				  if (appCallback != null) {
					  appCallback();
				  }

			  });
			  return this;
		  },

		  setFunc: function(_this) {
			  // 権限データを取得
			  var funcgrp = clcom.getFuncGrp();
			  var agent = clcom.getAgent();
			  $.each(clutil.funcgrpname, function() {
				  // 権限に応じてタブを隠す
				  if (!funcgrp[this.toString()]) {
					  $(_this).find('li.' + this.toString()).remove();
				  }
			  });
			  // iPad時は権限設定、データ登録は操作不可
			  if (agent == clcom.onMobile) {
				  $(_this).find('li.permission').remove();
				  $(_this).find('li.upload').remove();
			  }
			  clutil.setFuncObj($('body'));
		  }
	  });
	});





$(function () {
  // 店舗用ナビ
  Navi_StoreView = Backbone.View.extend({
	  // 要素
	  el	: $('#cl_navi'),

	  // Events
	  events: {
	  },

	  initialize: function() {

	  },

	  render: function(navi_class, appCallback, option) {
		  var _this = this;

		  $('#cl_navi').empty();
		  $('#cl_navi').load(clcom.urlRoot + '/navi_store.html', function(){

			  //画面サイズを#containerの高さに
			  wh = $(window).height();
			  ch = wh - 50;
			  mh = $('#mainColumn').height();
			  mbh = $('#mainColumninBox').height();
			  leh = mh > mbh ? mh : mbh;
			  leh = leh + 60;
			  $('#container').css("height",ch+'px');
			  $('#leftColumn').css("height",leh+'px')

			  // ヘッダー位置修正イベント
			  setReSizeEvent();

			  $(this).find('#cl_' + navi_class).closest('li').addClass('active');
			  $(this).find('a').click(function(){
				  // ログイン情報が変更されていた場合はログイン画面へ戻る
				  if (!clutil.chkCustPageType()) {
					  return;
				  }
				  var screenId = $(this).attr('data-tgt');
				  clcom.pushPage(clcom.appRoot + '/' + screenId + '/' + screenId + '.html',
						  null, null, null, true);
			  });

			  // bodyを表示
			  $('#ca_body').show();

			  // コールバック関数を呼ぶ
			  if (appCallback != null) {
				  appCallback();
			  }

		  });
	  },

	  setFunc: function(_this) {
		  // 権限データを取得
		  var funcgrp = clcom.getFuncGrp();
		  var agent = clcom.getAgent();
		  $.each(clutil.funcgrpname, function() {
			  // 権限に応じてタブを隠す
			  if (!funcgrp[this.toString()]) {
				  $(_this).find('li.' + this.toString()).remove();
			  }
		  });
		  // iPad時は権限設定、データ登録は操作不可
		  if (agent == clcom.onMobile) {
			  $(_this).find('li.permission').remove();
			  $(_this).find('li.upload').remove();
		  }
		  clutil.setFuncObj($('body'));
	  }
  });

  // 本部用ナビ
  Navi_MainView = Backbone.View.extend({
	  // 要素
	  el	: $('#cl_navi'),

	  // Events
	  events: {
	  },

	  initialize: function() {

	  },

	  render: function(navi_class, appCallback, option) {
		  var _this = this;

		  $('#cl_navi').empty();
		  $('#cl_navi').load(clcom.urlRoot + '/navi_main.html', function(){

			  //画面サイズを#containerの高さに
			  wh = $(window).height();
			  ch = wh - 50;
			  mh = $('#mainColumn').height();
			  mbh = $('#mainColumninBox').height();
			  leh = mh > mbh ? mh : mbh;
			  leh = leh + 60;
			  $('#container').css("height",ch+'px');
			  $('#leftColumn').css("height",leh+'px')

			  // 2014/4/24追加 システム管理者のみマスタメンテを表示する
			  userInf = clcom.getUserData();
			  var flag = userInf.org_flag;
			  if(flag != gsdb_defs.MTTYPE_F_STOREHQ_ADMIN) {
				  $(this).find('#cl_upload').closest('li').remove();
			  }

			  // ヘッダー位置修正イベント
			  setReSizeEvent();

			  $(this).find('#cl_' + navi_class).closest('li').addClass('active');
			  $(this).find('a').click(function(){
				// ログイン情報が変更されていた場合はログイン画面へ戻る
				  if (!clutil.chkCustPageType()) {
					  return;
				  }
				  var screenId = $(this).attr('data-tgt');
				  clcom.pushPage(clcom.appRoot + '/' + screenId + '/' + screenId + '.html',
						  null, null, null, true);
			  });

			  // bodyを表示
			  $('#ca_body').show();

//			// ナビの固定
//			  _this.navi_load(option);

			  // コールバック関数を呼ぶ
			  if (appCallback != null) {
				  appCallback();
			  }

		  });
	  },

	  setFunc: function(_this) {
		  // 権限データを取得
		  var funcgrp = clcom.getFuncGrp();
		  var agent = clcom.getAgent();
		  $.each(clutil.funcgrpname, function() {
			  // 権限に応じてタブを隠す
			  if (!funcgrp[this.toString()]) {
				  $(_this).find('li.' + this.toString()).remove();
			  }
		  });
		  // iPad時は権限設定、データ登録は操作不可
		  if (agent == clcom.onMobile) {
			  $(_this).find('li.permission').remove();
			  $(_this).find('li.upload').remove();
		  }
		  clutil.setFuncObj($('body'));
	  }
  });


  // AOKI - 分析画面の条件入力ナビメニューが開いた/閉じたを判定する
  clutil.AnaNaviItemNotifier = _.extend({
	  activeCounter: 0,
	  notifySetActive: function(triggedVeiw){
		  // 条件ペインがアクティブになった。（条件入力中）
		  this.activeCounter++;
		  this.trigger('onNaviItemActived', triggedVeiw);
	  },
	  notifyUnsetActive: function(triggedVeiw){
		  // 条件ペインが閉じた。（条件入力完了）
		  this.activeCounter = 0;
		  this.trigger('onNaviItemUnActived', triggedVeiw);
	  },
	  isNaviContentActive: function(){
		  return this.activeCounter > 0;
	  },
	  publish: function(ev_name, args){
		  this.trigger(ev_name, this, args);
	  }
  }, Backbone.Events);

  // AOKI - 分析画面左側の <li> 要素を表す View。
  // <a>要素のクリックは、イベント名 'onNaviItemClick' に関連付ける。
  AnaNaviItemView = Backbone.View.extend({
	  el: '<tr class="ca_button"><th colspan="3" class="category ca_th_edit"><span class="ca_title"></span><span class="edit">変更</span></th></tr>',
	  events: { 'click th.ca_th_edit': 'onClick', 'click a': 'onClick', 'click button': 'onClick' },
	  initialize: function(opt) {
		  if (opt) {
			  if (_.isString(opt.title)) {
				  this.$el.find('span.ca_title').html(opt.title);
			  } else if(_.isString(opt.html)) {
				  this.$el.find('span.html').html(opt.html);
			  }
			  // <li> タグの属性をつける。
			  if(opt.li){
				  this.decorateEl(this.$el, opt.li);
			  }
			  // <a> タグの属性をつける。
			  if(opt.a){
				  this.decorateEl(this.$el.find('a'), opt.a);
			  }
			  // <tr> タグの属性をつける。
			  if(opt.tr){
				  this.decorateEl(this.$el, opt.tr);
			  }
			  if(!opt.notificationOff){
				  // ナビペイン切り替え契機の通知を行わないフラグ
				  this.notifier = clutil.AnaNaviItemNotifier;
			  }
		  }
	  },
	  decorateEl: function($x, opt) {
		  for(var k in opt) {
			  var v = opt[k];
			  if(!_.isString(v)){
				  continue;
			  }
			  switch(k){
			  case 'class':
				  $x.addClass(v);
				  break;
			  default:
				  $x.attr(k,v);
			  }
		  }
	  },
	  onClick: function(e){
		  e.srcBackboneView = this;
		  this.trigger('onNaviItemClick', e);
	  },
	  setActive: function(){
		  clutil.closeCondition();
		  if(this.notifier){
			  this.notifier.notifySetActive(this);
		  }
	  },
	  unsetActive: function(){
		  clutil.openCondition();
		  if(this.notifier){
			  this.notifier.notifyUnsetActive(this);
		  }
	  },
	  isActive: function(){
		  return this.$el.hasClass('active');
	  }
  });
});
// AOKI
$(function () {
	$('.cl_check').click(function(e){
		var $chkbox = $(this).find('input:checkbox');
		if ($(e.target).get(0).type == 'checkbox') {
			return;
		}
		if ($chkbox.is(":checked")){
			$chkbox.attr('checked', false);
		} else {
			$chkbox.attr('checked', true);
		}
	});
	$('.cl_radio').click(function(e){
		var $chkbox = $(this).find('input:radio');
		if ($(e.target).get(0).type == 'radio') {
			return;
		}
		if (!$chkbox.is(":checked")){
			$chkbox.attr('checked', true);
		}
	});
});

/**
 * AOKI 一定時間操作がなかった場合タイマーをセットする
 */
$(function () {
	$('button').click(function(e){
		clutil.setTimeout();
	});
	$(window).keydown(function(e){
		clutil.setTimeout();
	});
	$(window).mousemove(function(e){
		clutil.setTimeout();
	});
});

// テーブルソート
(function ($) {
  $.fn.tablesort = function (options) {
	$(this).each(function (i) {
	  var $this = $(this),
		  order = [];

	  function onClick(ev) {
		var $th = $(ev.currentTarget);
		var columnName = $th.attr('data-column'),
			iterator = function (column) {
			  return column.name === columnName;
			},
			column = _.find(order, iterator);

		if (column) {
		  if (column === order[0]) {
			column.order *= -1;
		  }
		} else {
		  column = {
			name: columnName,
			order: 1
		  };
		}

		order = _.reject(order, iterator);
		order.unshift(column);

		$this.find('thead tr th')
		  .removeClass('tableSortDown')
		  .removeClass('tableSortUp');

		$th.addClass(order[0].order > 0 ? 'tableSortDown' : 'tableSortUp');

		$this.trigger('orderchange.tablesort', [order]);
	  }

	  $this.find('[data-column]').addClass('tableSort');

	  $this.undelegate('.tablesort');
	  $this.delegate('[data-column]', 'click.tablesort', onClick);
	});

	return this;
  };
}(jQuery));

(function () {
  function ensure$(element) {
	return element instanceof $ ? element : $(element);
  }

  // ぱんくずリスト
  var doBreadCrumb = (function () {
	return function ($el) {
	  $el = ensure$($el);
	  var history = _.pluck(_.toArray(clcom._history), 'label');
	  history.push(clcom.pageTitle);
	  $el.text(history.join('〉'));
	};
  }());

  $(function () {

	// ぱんくずリスト TODO 現在は document.title を元に構成しています。
	doBreadCrumb('.pageTitle');

	// ダウンロード
	$('body').delegate('a[data-cl-dl]', 'click', function (ev) {
	  ev.preventDefault();
	  window.open($(ev.currentTarget).attr('data-cl-dl'), '_blank');
	});

	// 自動プッシュ
	$('body').delegate('a[data-cl-push]', 'click', function (ev) {
	  ev.preventDefault();
	  clcom.pushPage(ev.currentTarget.href);
	});

	// 自動ポップ
	$('body').delegate('[data-cl-back]', 'click', function (ev) {
	  ev.preventDefault();
	  clcom.popPage();
	});

	// パスワード変更（分析）
	$('.cl_analyze_chgpswd').live('click', function (ev) {
	  ev.preventDefault();
	  var screenId = 'CAMEV0160';
	  clcom.pushPage(clcom.appRoot + '/' + screenId + '/' + screenId + '.html',
			  null, null, null, true);
	});

	// ログアウト（分析）
	$('.cl_analyze_logout').live('click', function (ev) {
	  ev.preventDefault();
	  clutil.gohome(null, true);
	});

	// ログアウト（ノーサイン）
	$('.cl_cust_logout').live('click', function (ev) {
	  ev.preventDefault();
	  clutil.gohome(null, true);
	});

	$('body').tooltip({
	  selector: '[data-cl-errmsg]',
	  title: function () {
		console.log(this);
		return $(this).attr('data-cl-errmsg');
	  },
	  position: 'right',
	  container: 'body'
	});

	// 必須属性に星を付ける
	function showRequiredMark(options) {
	  options = _.defaults(options || {}, {
		el: 'body'
	  });

	  var $area = $(options.el),
		  $elements = $area.find('input.cl_required');

	  $('.cl_required_mark').removeClass('cl_required_mark');
	  $elements
		.closest('th + td')
		.prev('th')
		.addClass('cl_required_mark');

	  $elements
		.closest('.control-group')
		.find('.control-label')
		.addClass('cl_required_mark');
	}
	showRequiredMark();
	clutil.showRequiredMark = showRequiredMark;

	_.extend(clutil, (function () {

	  function init($el) {
		$el = ensure$($el);
		// $el.append('<button class="btn btn-mini less-link btn-hide">非表示</button>');
		$el.append('<span class="more-link-block">' +
				   '<a class="more-link pull-right" href="javascript:void(0);">続きを表示...</a><' +
				   '/span>');
		showSearchArea($el);
	  }

	  function hideSearchArea($el) {
		$el = ensure$($el);
		$el.addClass('less').removeClass('more');
	  }

	  function showSearchArea($el) {
		$el = ensure$($el);
		$el.addClass('more').removeClass('less');
	  }

	  init($('.searchArea'));
	  $('body').delegate('.searchArea .more-link', 'click', function () {
		showSearchArea($(this).parents('.searchArea'));
	  });

	  $('body').delegate('.searchArea .less-link', 'click', function () {
		hideSearchArea($(this).parents('.searchArea'));
	  });
	  return {
		hideSearchArea: hideSearchArea,
		showSearchArea: showSearchArea
	  };
	}()));
  });
}());

// tablefix を無効にする。
(function () {
  $.fn.tablefix = function () {};
  $.inputlimiter.start();

  // cl_dateクラスのblur時に日付けフォーマットを実行する
  $(document).on('blur', 'input[type=text].cl_date.hasDatepicker', function (event) {
    var $input = $(event.currentTarget),
        value = $input.val();

    // 8桁の数値のときのみフォーマットする
    if (!clutil.checkDate(value) && /^[0-9]{8,8}$/.test(value)) {
      var s = value.replace(/([0-9]{4,4})([0-9]{2,2})([0-9]{2,2})/, '$1/$2/$3');
      $input.val(s);
    }
  });

  // 全角を半角に変換する
  $(document).on('keydown', 'input[type=text].cl_hankaku', function (e) {
	  var key = e.which ? e.which : e.keyCode;
	  if (key == 13 || key == 9) {
		  // エンター、タブが押下されたら実行
		  clutil.inputzen2han(e);
	  }
  });
  $(document).on('blur', 'input[type=text].cl_hankaku', function (e) {
	  clutil.inputzen2han(e);
  });

  //Enterキーによるフォーカスをする。
  clutil.enterFocusMode();
  // タイマーの開始
  clutil.setTimeout();
}());
(function (Syphon, clutil) {

  ////////////////////////////////////////////////////////////////
  Syphon.ElementExtractor = function ($view) {
    return $view.find('input,textarea,select,span[data-name]');
  };

  ////////////////////////////////////////////////////////////////
  // KeyExtractor
  var supportedTags = ['span'];
  _.each(supportedTags, function (tagName) {
    Syphon.KeyExtractors.register(tagName, function ($el) {
      return $el.attr('data-name');
    });
  });

  ////////////////////////////////////////////////////////////////
  // InputReader
  Syphon.InputReaders.register('text', function ($el) {
    var val = $el.val();

    if ($el.hasClass('cl_date')) {
      val = clutil.dateFormat(val, 'yyyymmdd');
    } else if ($el.hasClass('cl_month')) {
      val = clutil.monthFormat(val, 'yyyymm');
    } else if ($el.hasClass('cl_time')) {
      val = clutil.timeFormat(val, 'hhmm');
    }

    return val;
  });

  Syphon.InputReaders.register('checkbox', function ($el) {
    return $el.prop('checked') ? 1 : 0;
  });

  Syphon.InputReaders.register('span', function ($el) {
    return $el.text();
  });

  ////////////////////////////////////////////////////////////////
  // InputWriters
  Syphon.InputWriters.register('span', function ($el, value) {
    return $el.text(value);
  });

  Syphon.InputWriters.register('text', function ($el, value) {
    if ($el.hasClass('cl_date')) {
      value = clutil.dateFormat(value, 'yyyy/mm/dd');
    } else if ($el.hasClass('cl_month')) {
      value = clutil.monthFormat(value, 'yyyy/mm');
    } else if ($el.hasClass('cl_time')) {
      value = clutil.timeFormat(value, 'hh:mm');
    } else {
      value = clutil.cStr(value);
    }
    $el.val(value);
  });
}(Backbone.Syphon, clutil));
/**
 * ORIGINAL dialog.js
 */

(function (exports) {
	/**
	 * 確認ダイアログ
	 * msg: 表示するメッセージ
	 * okcallback: ok押下時のcallback関数
	 * cancelcallback: cancel,close押下時のcallback関数
	 * obj: ok押下時に渡したいオブジェクト
	 * $dialog_area: ダイアログ表示エリアのオブジェクト デフォルトはcl_dialog_area
	 * f_del: 削除の場合は文字を赤くする
	 */
	exports.ConfirmDialog = function(msg, okcallback, cancelcallback, obj, $dialog_area, f_del) {
		var $dialogArea = $dialog_area == null ? $('#cl_dialog_area') : $dialog_area;
		var txtclass = f_del == null ? "txtPrimary1" : "txtDanger";
		var html_source = "";
		html_source += '<div class="modal wd1">';
		html_source += '<div class="modalBody">';
		html_source += '<div class="msg ' + txtclass + '">' + msg + '</div>';
		html_source += '<div class="btnBox">';
		html_source += '<button class="btn btn-default wt280 mrgr20 cl_cancel">キャンセル</button>';
		html_source += '<button class="btn btn-primary wt280 cl_ok">はい</button>';
		html_source += '</div>';
		html_source += '</div>';
		html_source += '<div class="modalBK"></div>';
		html_source += '</div>';

		$dialogArea.html('');
		$dialogArea.html(html_source);

		$("body").toggleClass("dialogIsOpen");
		var wn = '.wd1';
		var mW = $(wn).find('.modalBody').innerWidth() / 2;
		var mH = $(wn).find('.modalBody').innerHeight() / 2;
		$(wn).find('.modalBody').css({'margin-left':-mW,'margin-top':-mH});
		$(wn).fadeIn(500);

//		clutil.viewReadonly($('#ca_main'));
		// Enterキーによるフォーカスをする。
		clutil.leaveEnterFocusMode();
		clutil.enterFocusMode({
			view : $dialogArea
		});

		// キャンセルボタンにフォーカス
		$('.cl_cancel').focus();

		// キャンセル、閉じるボタン
		$('.close,.modalBK, .cl_cancel').click(function(){
//			clutil.viewRemoveReadonly($('#ca_main'));
			$(wn).fadeOut(500);
			$("body").toggleClass("dialogIsOpen");
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
			if (cancelcallback != null) {
				cancelcallback(obj);
			}
		});
		// はいボタン
		$('.cl_ok').click(function(){
//			clutil.viewRemoveReadonly($('#ca_main'));
			$(wn).fadeOut(500);
			$("body").toggleClass("dialogIsOpen");
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
			if (okcallback != null) {
				okcallback(obj);
			}
		});
	};

	/**
	 * エラーダイアログ
	 * msg: 表示するメッセージ
	 * okcallback: ok押下時のcallback関数
	 */
	exports.ErrorDialog = function(msg, okcallback, obj, $dialog_area) {
		clutil.showDialog(msg, okcallback, 'wd2', 'txtDanger', obj, $dialog_area);
	};
	/**
	 * ワーニングダイアログ
	 * msg: 表示するメッセージ
	 * okcallback: ok押下時のcallback関数
	 */
	exports.WarningDialog = function(msg, okcallback, obj, $dialog_area) {
		clutil.showDialog(msg, okcallback, 'wd3', 'txtWarning', obj, $dialog_area);
	};
	/**
	 * インフォメーションダイアログ
	 * msg: 表示するメッセージ
	 * okcallback: ok押下時のcallback関数
	 */
	exports.MessageDialog = function(msg, okcallback, obj, $dialog_area) {
		clutil.showDialog(msg, okcallback, 'wd4', 'txtInfo', obj, $dialog_area);
	};
	/**
	 * インフォメーションダイアログ
	 * msg: 表示するメッセージ
	 * okcallback: ok押下時のcallback関数
	 */
	 exports.MessageDialog2 = function(msg, okcallback, obj, $dialog_area) {
		clutil.showDialog2(msg, okcallback, 'wd5', 'txtPrimary', obj, $dialog_area, 3000);
	};
	exports.MessageDialogShort = function(msg, okcallback, obj, $dialog_area) {
		clutil.showDialog2(msg, okcallback, 'wd5', 'txtPrimary', obj, $dialog_area, 500);
	};

	/**
	 * 用途に合わせたダイアログを表示する
	 * msg: 表示するメッセージ
	 * okcallback: ok押下時のcallback関数
	 * wnclass: ダイアログのクラス
	 * $dialog_area: ダイアログ表示エリアのオブジェクト デフォルトはcl_dialog_area
	 */
	exports.showDialog2 = function(msg, okcallback, wnclass, txtclass, obj, $dialog_area, millisec) {
		console.log("DEBUG: millisec=" + millisec);
		var $dialogArea = $dialog_area == null ? $('#cl_dialog_area') : $dialog_area;
		var html_source = "";
		html_source += '<div class="modal msgPassing ' + ((wnclass == null) ? '' : wnclass) + '">';
		html_source += '<div class="msgBody">';
		html_source += '<div class="msg myDialogContent ' + ((txtclass == null) ? '' : txtclass) + '"></div>';
		html_source += '</div>';
		html_source += '<div class="modalBK"></div>';
		html_source += '</div>';

		$dialogArea.html(html_source);
		$dialogArea.find('.myDialogContent').html(msg);

		var $wn = $dialogArea.find('.modal');//$('.' + wnclass);
		var $msgBody = $wn.find('.msgBody');
		var mW = $msgBody.innerWidth() / 2;
		var mH = $msgBody.innerHeight() / 2;
		$msgBody.css({'margin-left':-mW,'margin-top':-mH});
		var $body = $("body").toggleClass("dialogIsOpen");

		setTimeout(function() {
			$wn.fadeOut(500, function(){
				$dialogArea.empty();
				$body.toggleClass("dialogIsOpen");
				clutil.leaveEnterFocusMode();
				clutil.enterFocusMode();
				if (okcallback != null) {
					okcallback(obj);
				}
				// ダイアログ終了を通知
				clutil.mediator.trigger('onDialog2Close');
			});
		}, millisec > 0 ? millisec : 3000);
	};
	/**
	 * 用途に合わせたダイアログを表示する
	 * msg: 表示するメッセージ
	 * okcallback: ok押下時のcallback関数
	 * wnclass: ダイアログのクラス
	 * $dialog_area: ダイアログ表示エリアのオブジェクト デフォルトはcl_dialog_area
	 */
	exports.showDialog = function(msg, okcallback, wnclass, txtclass, obj, $dialog_area) {
		var $dialogArea = $dialog_area == null ? $('#cl_dialog_area') : $dialog_area;
		var html_source = "";
		html_source += '<div class="modal ' + wnclass + '">';
		html_source += '<div class="modalBody">';
		html_source += '<div class="msg ' + txtclass + '">' + msg + '</div>';
		html_source += '<div class="btnBox">';
		html_source += '<button class="btn btn-info wt280 cl_ok">確認</button>';
		html_source += '</div>';
		html_source += '</div>';
		html_source += '<div class="modalBK"></div>';
		html_source += '</div>';

		$dialogArea.html('');
		$dialogArea.html(html_source);

		$("body").toggleClass("dialogIsOpen");
		var wn = '.' + wnclass;
		var mW = $(wn).find('.modalBody').innerWidth() / 2;
		var mH = $(wn).find('.modalBody').innerHeight() / 2;
		$(wn).find('.modalBody').css({'margin-left':-mW,'margin-top':-mH});
		$(wn).fadeIn(500);

//		clutil.viewReadonly($('#ca_main'));
		// Enterキーによるフォーカスをする。
		clutil.leaveEnterFocusMode();
		clutil.enterFocusMode({
			view : $dialogArea
		});

		// OKボタンにフォーカス
		$('.cl_ok').focus();

		// キャンセル、閉じるボタン
		$('.close,.modalBK').click(function(){
//			clutil.viewRemoveReadonly($('#ca_main'));
			$(wn).fadeOut(500);
			$("body").toggleClass("dialogIsOpen");
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
			if (okcallback != null) {
				okcallback(obj);
			}
		});
		// はいボタン
		$('.cl_ok').click(function(){
//			clutil.viewRemoveReadonly($('#ca_main'));
			$(wn).fadeOut(500);
			$("body").toggleClass("dialogIsOpen");
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
			if (okcallback != null) {
				okcallback(obj);
			}
		});
	};


	/**
	 * 削除確認ダイアログ
	 */
	exports.delConfirmDialog = function(okcallback, cancelcallback, obj, $dialog_area) {
		clutil.ConfirmDialog(clmsg.cl_rtype_del_confirm_chk, okcallback, cancelcallback, obj, $dialog_area, true);
	};

	/**
	 * 削除完了ダイアログ
	 */
	exports.delMessageDialog = function(okcallback, obj, $dialog_area) {
		clutil.MessageDialog(clmsg.cl_rtype_del_confirm, okcallback, obj, $dialog_area);
	};

	/**
	 * 更新確認ダイアログ
	 */
	exports.updConfirmDialog = function(okcallback, cancelcallback, obj, $dialog_area) {
		clutil.ConfirmDialog(clmsg.cl_rtype_upd_confirm_chk, okcallback, cancelcallback, obj, $dialog_area);
	};

	/**
	 * 更新完了ダイアログ
	 */
	exports.updMessageDialog = function(okcallback, obj, $dialog_area) {
		clutil.MessageDialog(clmsg.cl_rtype_upd_confirm, okcallback, obj, $dialog_area);
	};

	/**
	 * 削除取消確認ダイアログ
	 */
	exports.delCancelConfirmDialog = function(okcallback, cancelcallback, obj, $dialog_area) {
		clutil.ConfirmDialog(clmsg.cl_rtype_delcancel_confirm_chk, okcallback, cancelcallback, obj, $dialog_area);
	};

	/**
	 * 削除取消完了ダイアログ
	 */
	exports.delCancelMessageDialog = function(okcallback, obj, $dialog_area) {
		clutil.MessageDialog(clmsg.cl_rtype_delcancel_confirm, okcallback, obj, $dialog_area);
	};

}(clutil));
(function (exports, clcom) {
  // private
  var tableTemplate = _.template(
    '<thead>' +
      '<tr>' +
      '<th><input class="toggleall" type="checkbox"></th><th>No</th><th><%- headerFileName %></th>' +
      '</tr>' +
      '</thead>' +
      '<tbody></tbody>'
  );

  var itemTemplate = _.template(
    '<tr data-cid="<%- cid %>">' +
      '<td><input class="delcheck" type="checkbox" <%- checked %>></td>' +
      '<td><%- no %></td>' +
//      '<td><a target="_blank" href="<%- uri %>"><%- filename %></a></td>' +
      '<td><a target="_blank" file-id="<%- id %>" file-uri="<%- uri %>" class="cl_filedownld"><%- filename %></a></td>' +
      '</tr>'
  );

  function adjustPosition(cursor) {
    var input, wrapper,
        wrapperX, wrapperY,
        inputWidth, inputHeight,
        cursorX, cursorY,
        moveInputX, moveInputY;

    // This wrapper element (the button surround this file input)
    wrapper = $(this);
    // The invisible file input element
    input = wrapper.find("input[type=file]");
    // The left-most position of the wrapper
    wrapperX = wrapper.offset().left;
    // The top-most position of the wrapper
    wrapperY = wrapper.offset().top;
    // The with of the browsers input field
    inputWidth= input.width();
    // The height of the browsers input field
    inputHeight= input.height();
    //The position of the cursor in the wrapper
    cursorX = cursor.pageX;
    cursorY = cursor.pageY;

    //The positions we are to move the invisible file input
    // The 20 at the end is an arbitrary number of pixels that we can shift the input such that cursor is not pointing at the end of the Browse button but somewhere nearer the middle
    moveInputX = cursorX - wrapperX - inputWidth + 20;
    // Slides the invisible input Browse button to be positioned middle under the cursor
    moveInputY = cursorY- wrapperY - (inputHeight/2);

    // Apply the positioning styles to actually move the invisible file input
    input.css({
      left:moveInputX,
      top:moveInputY
    });
  }

  // input type='file'をaタグでwrapする
  function wrapInputElement($elem, $button) {
    var input = $('<div>').append($elem.eq(0).clone()).html();
    // $button.before(
    //   '<a class="file-input-wrapper ' + $button.attr('class') + '"></a>'
    // ).hide();
    $button.before(
      '<a class="file-input-wrapper ' + $button.attr('class') + '">' +
        $button.text() + input + '</a>'
    ).hide();
    $elem.remove();
  }

  var Collection = Backbone.Collection.extend({
  });

  // Windows形式のパス表現文字列からファイル名のみをぬきだす。
  // input type=file のvalueの値からファイル名取得するために使用
  var getFileName = function (path) {
    var filename = _.last(path.split('\\'));
    return filename;
  };

  // 削除、添付ボタン
  var FileInputView = Backbone.View.extend({

	// AOKIのURLはmonoと違う
    url: clcom.apiRoot + '/cm_fileupload',

    events: {
      'change input[type=file]': 'inputChanged',
      'click .cl-file-delete': 'deleteClicked',
      'mousemouve .file-input-wrapper': 'adjustPosition'
    },

    adjustPosition: function (cursor) {
    },

    initialize: function (options) {
      this.options = options || {};
      if (this.options.url)
        this.url = this.url;
      _.bindAll(this);
      this.$fileInput = this.$('input[type=file]');
      this.$fileInput.attr('name', 'file');
      wrapInputElement(this.$fileInput, this.$('.cl-file-attach'));
      this.$fileInput = this.$('input[type=file]');
      this.$('.file-input-wrapper').mousemove(adjustPosition);
      this.vent = this.options.vent;
    },

    onUploadSuccess: function (data, dataType) {
      var filename = getFileName(this.$fileInput.val()),
          file = {
            id: data.id,            // ファイル識別子
            filename: filename,
            uri: data.uri           // ファイル取得用URI
          };
      if (this.options.selectMode === 'single') {
        this.collection.reset([file]);
      } else {
        this.collection.add(file);
      }
      this.vent.trigger('success', file, data, dataType);
    },

    onUploadError: function (jqXHR, textStatus, errorThrown) {
      console.error(textStatus, errorThrown);
      if (this.options.showDialogOnError) {
    	// AOKI
        new clutil.ErrorDialog('ファイルアップロードに失敗しました。');
      }

      this.vent.trigger('error', jqXHR, textStatus, errorThrown);
    },

    onUploadComplete: function (jqXHR, textStatus) {
      var $form = this.$fileInput.closest('form'),
          form = $form.get(0);
      $form.find('.cl-file-attr').remove();

      if (form) {
        form.reset();
        this.$fileInput.unwrap();
      }
      clutil.unblockUI(this.url);

      this.vent.trigger('complete', jqXHR, textStatus);
    },

    inputChanged: function (event) {
      var filename = getFileName(this.$fileInput.val()),
          $form = this.$fileInput.wrap('<form>').parent(),
          $hidden = $('<input class="cl-file-attr" name="attr" type="hidden">').appendTo($form);

      $hidden.val(JSON.stringify({
        filename: filename
      }));

      clutil.blockUI(this.url);
      $form.ajaxSubmit({
        type: 'POST',
        dataType: 'json',
        contentType: 'multipart/form-data',
        url: this.url,
        success: this.onUploadSuccess,
        error: this.onUploadError,
        complete: this.onUploadComplete
      });
    },

    deleteClicked: function (event) {
      var items = this.collection.filter(function (model) {
        return model.get('checked');
      });
      console.log(items);
      this.collection.remove(items);
    }

  });

  var fileLabelTemplate = _.template(
//    '<a target="_blank" href="<%- uri %>"><%- filename %></a>'
	'<a target="_blank" file-id="<%- id %>" file-uri="<%- uri %>" class="cl_filedownld"><%- filename %></a>'
  );
  var FileLabel = Backbone.View.extend({
    initialize: function (options) {
      this.options = options || {};
      this.listenTo(this.collection, 'reset remove', this.render);
    },

    serializeData: function (model) {
      return model.toJSON();
    },

    render: function () {
      this.$el.html('&nbsp;');
      this.collection.some(function (model) {
        this.$el.html(fileLabelTemplate(this.serializeData(model)));

    	$('.cl_filedownld').click(function(e){
    		var uri = $(e.target).attr('file-uri');
    		var id = $(e.target).attr('file-id');
    		clutil.download(uri, id);
    	});

        model.set('checked', true);
        return true;
      }, this);
      return this;
    }
  });


  // 添付ファイルリスト
  var FileAttachTable = Backbone.View.extend({
    tagName: 'table',

    className: 'table table-bordered table-striped',

    events: {
      'change .delcheck': 'checkItem',
      'change .toggleall': 'toggleAll'
    },

    tableTemplate: tableTemplate,

    itemTemplate: itemTemplate,

    initialize: function (options) {
      _.bindAll(this);
      this.$el.html(this.tableTemplate({headerFileName: options.headerFileName || '添付ファイル'}));
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'reset', this.addAll);
      this.listenTo(this.collection, 'remove', this.addAll);
      this.addAll();
    },

    serializeData: function (model) {
      var serialized = _.extend(model.toJSON(), {
        no: model.collection.indexOf(model) + 1,
        cid: model.cid,
        checked: model.checked ? 'checked': ''
      });
      return serialized;
    },

    addOne: function (model) {
      var serialized = this.serializeData(model);
      this.$('tbody').append(this.itemTemplate(serialized));
    },

    addAll: function () {
      this.$('.toggleall').removeAttr('checked');
      this.$('tbody').empty();
      this.collection.each(this.addOne);
    },

    checkItem: function (event) {
      this.checkItem2(event.currentTarget);
    },

    checkItem2: function (input) {
      var $input = $(input),
          $tr = $input.parents('tr'),
          cid = $tr.attr('data-cid'),
          model = this.collection.get(cid);
      model.set({checked: $input.is(':checked')});
    },

    toggleAll: function () {
      // this.$('.delcheck').attr('checked', function(idx, oldAttr) {
      //   return !oldAttr;
      // });
      this.$('.delcheck').attr('checked', this.$('.toggleall').is(':checked'));
      _.each(this.$('.delcheck'), this.checkItem2, this);
    }
  });

  // public

  /**
   * 複数選択モードと択一選択モードがある。
   * options.selectMode が指定された場合は、指定モードになる。
   * それ以外の場合、fileTableが指定されたら、複数選択モードになる。それ以外では択一選択モード
   *
   * options.files に必須な属性は, id, filename, uri
   *
   * @param {Object} options options
   * @param {String} options.fileInput  jQueryのセレクター
   * @param {String} [options.fileTable]  jQueryのセレクター
   * @param {String} [options.fileLabel]  jQueryのセレクター
   * @param {String} [options.selectMode] "single" or "multiple"
   * @param {Boolean} [options.showDialogOnError] エラー時にダイアログを表示するか default:true
   * @param {Object} [options.tableOptions] テーブル(Optional)
   * @param {String} [options.headerFileName] ファイル名用テーブルヘッダの表示文字列
   * @param {Array} [options.files]  fileInput.getFiles で取得した添付ファイルリストを渡す(Optional)
   * @param {String} [options.filename]
   * @param {String} [options.uri]
   * @param {String} [options.id]
   * @event success, error, complete
   * @example
   *  html
   *    <div id="tenpu">
   *      <input type="file" class="hide-input">
   *      <button class="cl-file-attach">添付</button>
   *      <button class="cl-file-delete">削除</button>
   *    </div>
   *    <div id="tenpuTable">
   *    </div>
   *
   *  js
   *     var fileInput = clutil.fileInput({
   *       fileInput: '#tenpu',
   *       fileTable: '#tenpuTable'
   *     });
   *     var files = fileInput.getFiles();
   * @return {Object}
   */
  var fileInput = function (options) {
    if (typeof options === 'undefined') {
      options = {};
    }

    var selectMode;
    if (options.selectMode) {
      selectMode = options.selectMode;
    } else {
      selectMode = options.fileTable ? 'multiple' : 'single';
    }

    _.defaults(options, {
      showDialogOnError: true,
      filename: 'filename',
      'id': 'id',
      'uri': 'uri'
    });

    var vent = _.extend({}, Backbone.Events),

        normalizeFiles = function (files) {
          return _.map(files, function (file) {
            return {
              id: file[options['id']],
              filename: file[options.filename],
              uri: file[options.uri]
            };
          });
        },

        collection = new Collection(normalizeFiles(options.files)),

        fileInputView = new FileInputView({
          el: options.fileInput,
          selectMode: selectMode,
          collection: collection,
          showDialogOnError: options.showDialogOnError,
          vent: vent
        }),

        fileAttachTable,
        fileLabel;

    if (options.fileTable) {
      fileAttachTable = new FileAttachTable(_.defaults({
        collection: collection,
        headerFileName: options.headerFileName
      }, options.tableOptions));

      $(options.fileTable).html(fileAttachTable.el);
    }

    if (options.fileLabel) {
      fileLabel = new FileLabel(_.defaults({
        el: options.fileLabel,
        collection: collection
      }));
    }

    /**
     * クリーンアップ処理を行なう
     */
    function close() {
      if (fileLabel)
        fileLabel.remove();
      if (fileAttachTable)
        fileAttachTable.remove();
      if (fileInputView)
        fileInputView.remove();
    }

    /**
     * getFilesの返り値から添付一覧を復元する
     *
     * @param {Array} files
     */
    function setFiles(files) {
      collection.reset(normalizeFiles(files));
    }

    /**
     * サーバー送信用もしくは、のちに復元できるように添付一覧を返却する
     *
     * @return {Array}
     */
    function getFiles() {
      return _.map(collection.toJSON(), function (file) {
        var o = {};
        o[options.filename] = file.filename;
        o[options['id']] = file['id'];
        o[options.uri] = file.uri;
        return o;
      });
    }

    return _.extend(vent, {
      close: close,
      setFiles: setFiles,
      getFiles: getFiles
    });
  };
  exports.fileInput = fileInput;

}(clutil, clcom));
/**
 * ORIGINAL simplePagination.js
 */

/** simplePagination.js v1.4
* A simple jQuery pagination plugin.
* http://flaviusmatis.github.com/simplePagination.js/
*
* Copyright 2012, Flavius Matis
* Released under the MIT license.
* http://flaviusmatis.github.com/license.html
*/

(function($){

	// コンボボックスの選択値
	var dispSelect = null;
	var methods = {
		init: function(options) {
			var o = $.extend({
				items: 1,
				itemsOnPage: 10,
				pages: 0,
				displayedPages: 5,
				edges: 2,
				currentPage: 1,
				hrefText: '#page-',
				prevText: '&nbsp;',
				nextText: '&nbsp;',
				ellipseText: '&hellip;',
				isselect : true,	// コンボ表示フラグ defaultは表示
				//cssStyle: 'light-theme',
				onPageClick: function(pageNumber, itemsOnPage) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				},
				onSelectChange: function(itemsOnPage) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				},
				onInit: function() {
					// Callback triggered immediately after initialization
				},
				displaypanel : 'displaypanel'
			}, options || {});

			var self = this;

			o.pages = o.pages ? o.pages : Math.ceil(o.items / o.itemsOnPage) ? Math.ceil(o.items / o.itemsOnPage) : 1;
			o.currentPage = o.currentPage - 1;
			o.halfDisplayed = o.displayedPages / 2;

			this.each(function() {
				self.addClass(o.cssStyle).data('pagination', o);
				methods._draw.call(self);
			});

			o.onInit();

			return this;
		},

		selectPage: function(page) {
			methods._selectPage.call(this, page - 1);
			return this;
		},

		prevPage: function() {
			var o = this.data('pagination');
			if (o.currentPage > 0) {
				methods._selectPage.call(this, o.currentPage - 1);
			}
			return this;
		},

		nextPage: function() {
			var o = this.data('pagination');
			if (o.currentPage < o.pages - 1) {
				methods._selectPage.call(this, o.currentPage + 1);
			}
			return this;
		},

		destroy: function(){
			this.empty();
			return this;
		},

		redraw: function(){
			methods._draw.call(this);
			return this;
		},

		disable: function(){
			var o = this.data('pagination');
			o.disabled = true;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		},

		enable: function(){
			var o = this.data('pagination');
			o.disabled = false;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		},

		_draw: function() {
			var self = this, options, $link, o = self.data('pagination');
			var $panel = this,
				o = $panel.data('pagination'),
				interval = methods._getInterval(o),
				i;

			methods.destroy.call(this);

			// 全件表示
			{
				var currentitem = o.currentPage * o.itemsOnPage + 1;
				var lastitem = 0;
				if (o.items == 0) {
					currentitem = 0;
					lastitem = 0;
				} else if (o.items % o.itemsOnPage == 0) {
					lastitem = currentitem + o.itemsOnPage - 1;
				} else if (o.currentPage == (o.pages - 1)) {
					lastitem = currentitem + (o.items % o.itemsOnPage) - 1;
				} else {
					lastitem = currentitem + o.itemsOnPage - 1;
				}

				var p = null;
				if(o.displaypanel instanceof Object){
					p = o.displaypanel;
				}else{
					p = $('#' + o.displaypanel).empty();
				}

				// 選択されている表示件数には<a>タグはつけない
				var makenum = function(n) {
					var s = '<span class="pagination_select';
					if (n == o.itemsOnPage) {
						s += 'selected';
					}
					s += '" num="' + n + '">';
					if (n != o.itemsOnPage) {
						s += '<a>' + n + '</a>';
					} else {
						s += n;
					}
					s += '</span>';
					return s;
				};

				// パネルにcountクラスを付けてしまっているため外す 4/24
				p.removeClass('count');
				p.empty();
				var str = '<div class="count">' +
				currentitem + '-' + lastitem + '表示 / ' + o.items + '件中 ';
				str += '</div>';

				// コンボを表示するフラグが立っている時のみ表示
				if (o.isselect) {
					str += '<div class="viewnum">';
					str += '<p class="group">表示件数：';
					str += makenum(10);
					str += makenum(25);
					str += makenum(100);
					str += '</p>'
						str += '</div>';
				}

				p.append(str);
				p.find('span.pagination_select').removeClass('selected');
				p.find('span.pagination_select[num=' + o.itemsOnPage + ']').addClass('selected');
				p.find('span.pagination_select').click(function(e){
					var num = $(e.target).closest('span.pagination_select').attr('num');
					console.log("select");
					o.onSelectChange(Number(num));
					 return this;
				    //処理を記述する
				});
			}

			// Generate Prev link
			if (o.prevText) {
				methods._appendItem.call(this, o.currentPage - 1, {text: o.prevText, classes: 'previous', a_class: 'fui-arrow-left'});
			}

			// Generate start edges
			if (interval.start > 0 && o.edges > 0) {
				var end = Math.min(o.edges, interval.start);
				for (i = 0; i < end; i++) {
					methods._appendItem.call(this, i);
				}
				if (o.edges < interval.start && o.ellipseText) {
					$panel.append('<li><p class="bridge">' + o.ellipseText + '</p></li>');
				}
			}

			// Generate interval links
			for (i = interval.start; i < interval.end; i++) {
				methods._appendItem.call(this, i);
			}

			// Generate end edges
			if (interval.end < o.pages && o.edges > 0) {
				if (o.pages - o.edges > interval.end && o.ellipseText) {
					$panel.append('<li><p class="bridge">' + o.ellipseText + '</p></li>');
				}
				var begin = Math.max(o.pages - o.edges, interval.end);
				for (i = begin; i < o.pages; i++) {
					methods._appendItem.call(this, i);
				}
			}

			// Generate Next link
			if (o.nextText) {
				methods._appendItem.call(this, o.currentPage + 1, {text: o.nextText, classes: 'next', a_class: 'fui-arrow-right'});
			}

		},

		_getInterval: function(o) {
			return {
				start: Math.ceil(o.currentPage > o.halfDisplayed ? Math.max(Math.min(o.currentPage - o.halfDisplayed, (o.pages - o.displayedPages)), 0) : 0),
				end: Math.ceil(o.currentPage > o.halfDisplayed ? Math.min(o.currentPage + o.halfDisplayed, o.pages) : Math.min(o.displayedPages, o.pages))
			};
		},

		_appendItem: function(pageIndex, opts) {
			var self = this, options, $link, o = self.data('pagination');

			pageIndex = pageIndex < 0 ? 0 : (pageIndex < o.pages ? pageIndex : o.pages - 1);

			options = $.extend({
				text: pageIndex + 1,
				classes: ''
			}, opts || {});

			if (pageIndex == o.currentPage || o.disabled) {
				$link = $('<li class="active"><span class="current">' + (options.text) + '</span></li');
			} else {
				//$link = $('<a href="' + o.hrefText + (pageIndex + 1) + '" class="page-link">' + (options.text) + '</a>');
				$link = $('<li><a href="' + o.hrefText + (pageIndex + 1) + '" class="page ' + (options.a_class) +'">' + (options.text) + '</a></li>');
				$link.click(function(){
					methods._selectPage.call(self, pageIndex);
				});
			}

			if (options.classes) {
				$link.addClass(options.classes);
			}

			self.append($link);
		},

		_selectPage: function(pageIndex) {
			var o = this.data('pagination');
			o.currentPage = pageIndex;
			o.onPageClick(pageIndex + 1, o.itemsOnPage);
		}

	};

	$.fn.pagination = function(method) {

		// Method calling logic
		if (methods[method] && method.charAt(0) != '_') {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.pagination');
		}

	};

})(jQuery);
/*
 * jQuery contextmenu plugin
 * Version: 1.1.1
 * Update (d/m/y): 09/03/13
 * Original author: @gokercebeci
 * Licensed under the MIT license
 * Demo: http://gokercebeci.com/dev/contextmenu
 */

(function($) {
    // Methods
    var methods = {
        init: function(element, options) {
            $this = this;
            // Bind options
            var contextmenu = $.extend(element, options);
            contextmenu.init(contextmenu);
            contextmenu.bind({
                'contextmenu': function(e) {
                    if (!e.ctrlKey || !contextmenu.ctrl) {
                        e.preventDefault();
                        $this.start(contextmenu);
                        $('#contextmenu').remove();
                        var c = $('<div id="contextmenu">')
                                .addClass(contextmenu.style)
                        c.css({
                            position: 'absolute',
                            display: 'none',
                            'z-index': '10000'
                        })
                                .appendTo($('body'));
                        for (var i in contextmenu.menu)
                            $('<a value=' + contextmenu.menu[i] + '>')
//                            $('<a>', {
//                                'href': contextmenu.menu[i]
//                            })
                                    .html(i).appendTo(c);
                        /************ 追加shimizu ***************/
                        // id取得 追加Shimizu
                        var tr = $(e.target).closest('tr')
                        var th = $(e.target).closest('th')
                        var id = 0;
                        if (tr != null && contextmenu.idname == 'id') {
                        	id = tr.get(0).id;
                        } else if (th != null) {
                        	// ソート時を想定 thよりKEYを取得する
                        	id = $(th).attr(contextmenu.idname);
                        }
                        c.find('a').click(function(e){
                        	var val = $(e.target).attr('value');
                        	$this.callback(contextmenu, val, id);
                        });
                        /************ 追加shimizu ***************/
                        // Set position
                        var ww = $(document).width();
                        var wh = $(document).height();
                        var w = c.outerWidth();
                        var h = c.outerHeight();
                        var x = e.pageX > (ww - w) ? ww : e.pageX;
                        var y = e.pageY > (wh - h) ? wh : e.pageY;
                        c.css({
                            display: 'block',
                            top: y,
                            left: x
                        });
                    }
                }
            });
            $(document)
                    .click(function() {
                $this.finish(contextmenu);
            })
                    .keydown(function(e) {
                if (e.keyCode == 27) {
                    $this.finish(contextmenu);
                }
            })
                    .scroll(function() {
                $this.finish(contextmenu);
            })
                    .resize(function() {
                $this.finish(contextmenu);
            });
        },
        start: function(contextmenu) {
            contextmenu.start(contextmenu);
            return;
        },
        finish: function(contextmenu) {
            contextmenu.finish(contextmenu);
            $('#contextmenu').remove();
            return;
        },
        error: function(contextmenu) {
            contextmenu.error(contextmenu);
            return;
        },
        callback: function(contextmenu, val, id) {
            contextmenu.callback(val, id);
            return;
        }
    };
    $.fn.contextmenu = function(options) {
        options = $.extend({
            init: function() {
            },
            start: function() {
            },
            finish: function() {
            },
            error: function() {
            },
            callback: function() {
            },
            ctrl: 1,
            style: '',
            menu: [],
            idname : 'id'
        }, options);
        this.each(function() {
            methods.init($(this), options);
        });
    };
})(jQuery);
