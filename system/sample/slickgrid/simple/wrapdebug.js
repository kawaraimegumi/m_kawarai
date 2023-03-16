var wrapdebugClass = function(Type, id){
	var child = function() {
		Type.apply(this, arguments);
		wrapdebugAll(this, id);
	};
	_.extend(child.prototype, Type.prototype);
	return child;
};
	
var wrapdebugAll = function(instance, id){
	var fs = _.functions(instance);
	_.each(fs, function(name){
		instance[name] = _.wrap(instance[name], function(fn){
			var args = _.rest(arguments, 1);
			var result = fn.apply(instance, args);
			console.log("* id:", id, "name:", name);
			console.log("  * args:", args);
			console.log("  * ret :", result);
			return result;
		});
	});
};

var wrapdebug = function(func, id, context){
	return _.wrap(func, function(fn){
		var args = _.rest(arguments, 1);
		var result = fn.apply(context, args);
		console.log("* id:", id);
		console.log("  * args:", args);
		console.log("  * ret :", result);
		return result;
	});
};
