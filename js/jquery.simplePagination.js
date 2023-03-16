/**
* simplePagination.js v1.4
* A simple jQuery pagination plugin.
* http://flaviusmatis.github.com/simplePagination.js/
*
* Copyright 2012, Flavius Matis
* Released under the MIT license.
* http://flaviusmatis.github.com/license.html
*/

(function($){

	var methods = {
		init: function(options) {
			var o = $.extend({
				items: 1,
				itemsOnPage: 1,
				pages: 0,
				displayedPages: 5,
				edges: 2,
				currentPage: 1,
				hrefText: '#page-',
				prevText: '&lt;&lt;前へ',
				nextText: '次へ&gt;&gt;',
				ellipseText: '&hellip;',
				//cssStyle: 'light-theme',
				selectOnClick: true,
				onPageClick: function(pageNumber) {
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
				p.empty();
				p.append('<span class="title">全' + o.items + '件中 ' + currentitem
								+ '-' + lastitem + '件表示</span>');
			}
			
			// Generate Prev link
			if (o.prevText) {
				//methods._appendItem.call(this, o.currentPage - 1, {text: o.prevText, classes: 'prev'});
				methods._appendItem.call(this, o.currentPage - 1, {text: o.prevText, classes: 'previous'});
			}

			// Generate start edges
			if (interval.start > 0 && o.edges > 0) {
				var end = Math.min(o.edges, interval.start);
				for (i = 0; i < end; i++) {
					methods._appendItem.call(this, i);
				}
				if (o.edges < interval.start && o.ellipseText) {
					$panel.append('<span class="ellipse">' + o.ellipseText + '</span>');
				}
			}

			// Generate interval links
			for (i = interval.start; i < interval.end; i++) {
				methods._appendItem.call(this, i);
			}

			// Generate end edges
			if (interval.end < o.pages && o.edges > 0) {
				if (o.pages - o.edges > interval.end && o.ellipseText) {
					$panel.append('<span class="ellipse">' + o.ellipseText + '</span>');
				}
				var begin = Math.max(o.pages - o.edges, interval.end);
				for (i = begin; i < o.pages; i++) {
					methods._appendItem.call(this, i);
				}
			}

			// Generate Next link
			if (o.nextText) {
				//methods._appendItem.call(this, o.currentPage + 1, {text: o.nextText, classes: 'next'});
				methods._appendItem.call(this, o.currentPage + 1, {text: o.nextText, classes: 'following'});
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
				$link = $('<span class="current">' + (options.text) + '</span>');
			} else {
				//$link = $('<a href="' + o.hrefText + (pageIndex + 1) + '" class="page-link">' + (options.text) + '</a>');
				$link = $('<a href="' + o.hrefText + (pageIndex + 1) + '" class="page">' + (options.text) + '</a>');
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
			if (o.selectOnClick) {
				o.onPageClick(pageIndex + 1);
				methods._draw.call(this);
			} else {
				o.onPageClick(pageIndex + 1);
			}
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