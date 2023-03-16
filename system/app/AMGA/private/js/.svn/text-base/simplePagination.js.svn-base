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
				isselect : true,	// コンボ表示フラグ defaultは表示（互換用） ⇒ MD 版では itemsOnPageSelection で指定
				itemsOnPageSelection: null,
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

			// o.itemsOnPage 補正
			{
				if($.isArray(o.itemsOnPageSelection) && o.itemsOnPageSelection.length > 0){
					var fixItemsOnPage = null;
					for(i = 0; i < o.itemsOnPageSelection.length; i++) {
						if(o.itemsOnPage === o.itemsOnPageSelection[i]){
							fixItemsOnPage = o.itemsOnPageSelection[i];
						}
					}
					if(fixItemsOnPage === null){
						fixItemsOnPage = o.itemsOnPageSelection[0];
					}
					o.itemsOnPage = fixItemsOnPage;
				}else if(o.isselect){
					// 旧 I/F 互換用。
					o.itemsOnPageSelection = [ 10, 25, 100 ];
					switch(o.itemsOnPage){
					case 25:
					case 100:
						break;
					default:
						o.itemsOnPage = o.itemsOnPageSelection[0];
					}
				}
			}

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

				var dp = null;
				if(o.displaypanel instanceof Object){
					dp = o.displaypanel;
				}else{
					dp = $('#' + o.displaypanel).empty();
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

				// 表示件数エリア - itemsOnPageSelection 指定されている場合はページ内件数を変更するセレクタ要素を付け加える。
				var str = '<div class="count">' + currentitem + '-' + lastitem + '表示 / ' + o.items + '件中 </div>';
				if($.isArray(o.itemsOnPageSelection) && o.itemsOnPageSelection.length > 0){
					str += '<div class="viewnum">'
						+  '<p class="group">表示件数：';
					for(i = 0; i < o.itemsOnPageSelection.length; i++){
						str += makenum(o.itemsOnPageSelection[i]);
					}
					str += '</p>'
						+  '</div>';
				}
				dp.empty().append(str);

				dp.find('span.pagination_select').removeClass('selected');
				dp.find('span.pagination_select[num=' + o.itemsOnPage + ']').addClass('selected');
				dp.find('span.pagination_select').click(function(e){
					var num = parseInt($(e.target).closest('span.pagination_select').attr('num'));
					console.log("select: " + num);
					o.itemsOnPage = num;
					o.onSelectChange(num);
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
//fix: kaeriyama
				a_class: '',
//---
				text: pageIndex + 1,
				classes: ''
			}, opts || {});

			if (pageIndex == o.currentPage || o.disabled) {
				$link = $('<li class="active"><span class="current">' + (options.text) + '</span></li>');
			} else {
				//$link = $('<a href="' + o.hrefText + (pageIndex + 1) + '" class="page-link">' + (options.text) + '</a>');
//fix: kaeriyama: フォーカス制御から外すため、href を付けない。
//				$link = $('<li><a href="' + o.hrefText + (pageIndex + 1) + '" class="page ' + (options.a_class) +'">' + (options.text) + '</a></li>');
//---
				$link = $('<li><a class="page ' + (options.a_class) +'">' + (options.text) + '</a></li>');
//
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