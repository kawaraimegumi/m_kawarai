useSelectpicker2();

var traceWrite = function(){
	var text = $.fn.text;
	$.fn.text = function(){
		// console.log('XXXX text');
		return text.apply(this, arguments);
	};
	
	var html = $.fn.html;
	$.fn.html = function(){
		// console.trace('XXXX html');
		return html.apply(this, arguments);
	};
	
	var val = $.fn.val;
	$.fn.val = function(){
		if (arguments.length === 1) {
			console.trace('XXXX val');
		}
		return val.apply(this, arguments);
	};
};

$(document).on('click', 'a', function(e){
	console.log('**** click');
	// e.stopPropagation();
});
$(document).on('click', function(){
	console.log('**** click document');
});
var validator;
$(function(){
	clutil.enterFocusMode();
	// traceWrite();

	validator = clutil.validator($('body'), {
		echoback: $('.cl_echoback')
	});
	
	$('#foo').selectpicker();
	console.log('1 #foo val:', $('#foo').val());
	
	clutil.cltypeselector({
		el: '#bar',
		kind: amcm_type.AMCM_TYPE_DLV_ROUTE
	});
	console.log('2 #bar val:', $('#bar').val());

	$('#foo_val').click(function(){
		console.log('#foo val:', $('#foo').val());
	});
	$('#bar_val').click(function(){
		console.log('#bar val:', $('#bar').val());
	});
	$('#foo_set').click(function(){
		$('#foo').selectpicker('val', $('#foo_inp').val());
	});
	$('#bar_set').click(function(){
		$('#bar').selectpicker('val', $('#bar_inp').val());
	});

	$('#bs').bootstrapSelect();
	
	var View = Backbone.View.extend({
		el: 'body',
		events: {
			'change select': function(e){
				var $el = $(e.currentTarget);
				console.log('****', $el.attr('id'), $el.val()); 
			},
			'click #save': function(){
				validator.valid();
			}
		}
	});
	new View();
});
