/*
 * 	exChangeSelect 0.1.0 - jQuery plugin
 *	written by Cyokodog	
 *
 *	Copyright (c) 2010 Cyokodog (http://d.hatena.ne.jp/cyokodog/)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
(function($){
	$.fn.exChangeSelect = function (namespace, callback){
		if ($.isFunction(namespace)) {
			callback = namespace;
			namespace = 'ex-change-select';
		}
		$(this).each(function(){
			var target = $(this);
			//if (target.attr('tagName') != 'select') return;
			var orgValue = target.val(), changeStart;
			target
				.bind('change.' + namespace, function(){
					changeStart = 0;
					if (orgValue != target.val()) {
						orgValue = target.val();
						callback.apply(this, arguments);
					}
				})
				.bind('keydown.' + namespace, function(){
					if (!changeStart) {
						changeStart = 1;
						orgValue = target.val();
					}
				})
				.bind('keyup.' + namespace, function(){
					setTimeout(function(){
						if (changeStart && orgValue != target.val()) {
							target.trigger( 'change.' + namespace );
						}
						changeStart = 0;
					},0);
				})
		});
	}
})(jQuery);
