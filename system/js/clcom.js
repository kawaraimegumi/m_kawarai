/**
 * ビルド時刻: 0
 * このファイルは自動生成されたものです。これを直接編集せずに build/src/js/clcom/*.js を編集してください。
 */

// MarionetteJS (Backbone.Marionette)
// ----------------------------------
// v1.8.3
//
// Copyright (c)2014 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://marionettejs.com


/*!
 * Includes BabySitter
 * https://github.com/marionettejs/backbone.babysitter/
 *
 * Includes Wreqr
 * https://github.com/marionettejs/backbone.wreqr/
 */


// Backbone.BabySitter
// -------------------
// v0.1.0
//
// Copyright (c)2014 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://github.com/marionettejs/backbone.babysitter

// Backbone.ChildViewContainer
// ---------------------------
//
// Provide a container to store, retrieve and
// shut down child views.

Backbone.ChildViewContainer = (function (Backbone, _) {

	// Container Constructor
	// ---------------------

	var Container = function (views) {
		this._views = {};
		this._indexByModel = {};
		this._indexByCustom = {};
		this._updateLength();

		_.each(views, this.add, this);
	};

	// Container Methods
	// -----------------

	_.extend(Container.prototype, {

		// Add a view to this container. Stores the view
		// by `cid` and makes it searchable by the model
		// cid (and model itself). Optionally specify
		// a custom key to store an retrieve the view.
		add: function (view, customIndex) {
			var viewCid = view.cid;

			// store the view
			this._views[viewCid] = view;

			// index it by model
			if (view.model) {
				this._indexByModel[view.model.cid] = viewCid;
			}

			// index by custom
			if (customIndex) {
				this._indexByCustom[customIndex] = viewCid;
			}

			this._updateLength();
			return this;
		},

		// Find a view by the model that was attached to
		// it. Uses the model's `cid` to find it.
		findByModel: function (model) {
			return this.findByModelCid(model.cid);
		},

		// Find a view by the `cid` of the model that was attached to
		// it. Uses the model's `cid` to find the view `cid` and
		// retrieve the view using it.
		findByModelCid: function (modelCid) {
			var viewCid = this._indexByModel[modelCid];
			return this.findByCid(viewCid);
		},

		// Find a view by a custom indexer.
		findByCustom: function (index) {
			var viewCid = this._indexByCustom[index];
			return this.findByCid(viewCid);
		},

		// Find by index. This is not guaranteed to be a
		// stable index.
		findByIndex: function (index) {
			return _.values(this._views)[index];
		},

		// retrieve a view by its `cid` directly
		findByCid: function (cid) {
			return this._views[cid];
		},

		// Remove a view
		remove: function (view) {
			var viewCid = view.cid;

			// delete model index
			if (view.model) {
				delete this._indexByModel[view.model.cid];
			}

			// delete custom index
			_.any(this._indexByCustom, function (cid, key) {
				if (cid === viewCid) {
					delete this._indexByCustom[key];
					return true;
				}
			}, this);

			// remove the view from the container
			delete this._views[viewCid];

			// update the length
			this._updateLength();
			return this;
		},

		// Call a method on every view in the container,
		// passing parameters to the call method one at a
		// time, like `function.call`.
		call: function (method) {
			this.apply(method, _.tail(arguments));
		},

		// Apply a method on every view in the container,
		// passing parameters to the call method one at a
		// time, like `function.apply`.
		apply: function (method, args) {
			_.each(this._views, function (view) {
				if (_.isFunction(view[method])) {
					view[method].apply(view, args || []);
				}
			});
		},

		// Update the `.length` attribute on this container
		_updateLength: function () {
			this.length = _.size(this._views);
		}
	});

	// Borrowing this code from Backbone.Collection:
	// http://backbonejs.org/docs/backbone.html#section-106
	//
	// Mix in methods from Underscore, for iteration, and other
	// collection related features.
	var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
		'select', 'reject', 'every', 'all', 'some', 'any', 'include',
		'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
		'last', 'without', 'isEmpty', 'pluck'];

	_.each(methods, function (method) {
		Container.prototype[method] = function () {
			var views = _.values(this._views);
			var args = [views].concat(_.toArray(arguments));
			return _[method].apply(_, args);
		};
	});

	// return the public API
	return Container;
})(Backbone, _);

// Backbone.Wreqr (Backbone.Marionette)
// ----------------------------------
// v1.1.0
//
// Copyright (c)2014 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://github.com/marionettejs/backbone.wreqr


Backbone.Wreqr = (function (Backbone, Marionette, _) {
	"use strict";
	var Wreqr = {};

	// Handlers
	// --------
	// A registry of functions to call, given a name

	Wreqr.Handlers = (function (Backbone, _) {
		"use strict";

		// Constructor
		// -----------

		var Handlers = function (options) {
			this.options = options;
			this._wreqrHandlers = {};

			if (_.isFunction(this.initialize)) {
				this.initialize(options);
			}
		};

		Handlers.extend = Backbone.Model.extend;

		// Instance Members
		// ----------------

		_.extend(Handlers.prototype, Backbone.Events, {

			// Add multiple handlers using an object literal configuration
			setHandlers: function (handlers) {
				_.each(handlers, function (handler, name) {
					var context = null;

					if (_.isObject(handler) && !_.isFunction(handler)) {
						context = handler.context;
						handler = handler.callback;
					}

					this.setHandler(name, handler, context);
				}, this);
			},

			// Add a handler for the given name, with an
			// optional context to run the handler within
			setHandler: function (name, handler, context) {
				var config = {
					callback: handler,
					context: context
				};

				this._wreqrHandlers[name] = config;

				this.trigger("handler:add", name, handler, context);
			},

			// Determine whether or not a handler is registered
			hasHandler: function (name) {
				return !!this._wreqrHandlers[name];
			},

			// Get the currently registered handler for
			// the specified name. Throws an exception if
			// no handler is found.
			getHandler: function (name) {
				var config = this._wreqrHandlers[name];

				if (!config) {
					return;
				}

				return function () {
					var args = Array.prototype.slice.apply(arguments);
					return config.callback.apply(config.context, args);
				};
			},

			// Remove a handler for the specified name
			removeHandler: function (name) {
				delete this._wreqrHandlers[name];
			},

			// Remove all handlers from this registry
			removeAllHandlers: function () {
				this._wreqrHandlers = {};
			}
		});

		return Handlers;
	})(Backbone, _);

	// Wreqr.CommandStorage
	// --------------------
	//
	// Store and retrieve commands for execution.
	Wreqr.CommandStorage = (function () {
		"use strict";

		// Constructor function
		var CommandStorage = function (options) {
			this.options = options;
			this._commands = {};

			if (_.isFunction(this.initialize)) {
				this.initialize(options);
			}
		};

		// Instance methods
		_.extend(CommandStorage.prototype, Backbone.Events, {

			// Get an object literal by command name, that contains
			// the `commandName` and the `instances` of all commands
			// represented as an array of arguments to process
			getCommands: function (commandName) {
				var commands = this._commands[commandName];

				// we don't have it, so add it
				if (!commands) {

					// build the configuration
					commands = {
						command: commandName,
						instances: []
					};

					// store it
					this._commands[commandName] = commands;
				}

				return commands;
			},

			// Add a command by name, to the storage and store the
			// args for the command
			addCommand: function (commandName, args) {
				var command = this.getCommands(commandName);
				command.instances.push(args);
			},

			// Clear all commands for the given `commandName`
			clearCommands: function (commandName) {
				var command = this.getCommands(commandName);
				command.instances = [];
			}
		});

		return CommandStorage;
	})();

	// Wreqr.Commands
	// --------------
	//
	// A simple command pattern implementation. Register a command
	// handler and execute it.
	Wreqr.Commands = (function (Wreqr) {
		"use strict";

		return Wreqr.Handlers.extend({
			// default storage type
			storageType: Wreqr.CommandStorage,

			constructor: function (options) {
				this.options = options || {};

				this._initializeStorage(this.options);
				this.on("handler:add", this._executeCommands, this);

				var args = Array.prototype.slice.call(arguments);
				Wreqr.Handlers.prototype.constructor.apply(this, args);
			},

			// Execute a named command with the supplied args
			execute: function (name, args) {
				name = arguments[0];
				args = Array.prototype.slice.call(arguments, 1);

				if (this.hasHandler(name)) {
					this.getHandler(name).apply(this, args);
				} else {
					this.storage.addCommand(name, args);
				}

			},

			// Internal method to handle bulk execution of stored commands
			_executeCommands: function (name, handler, context) {
				var command = this.storage.getCommands(name);

				// loop through and execute all the stored command instances
				_.each(command.instances, function (args) {
					handler.apply(context, args);
				});

				this.storage.clearCommands(name);
			},

			// Internal method to initialize storage either from the type's
			// `storageType` or the instance `options.storageType`.
			_initializeStorage: function (options) {
				var storage;

				var StorageType = options.storageType || this.storageType;
				if (_.isFunction(StorageType)) {
					storage = new StorageType();
				} else {
					storage = StorageType;
				}

				this.storage = storage;
			}
		});

	})(Wreqr);

	// Wreqr.RequestResponse
	// ---------------------
	//
	// A simple request/response implementation. Register a
	// request handler, and return a response from it
	Wreqr.RequestResponse = (function (Wreqr) {
		"use strict";

		return Wreqr.Handlers.extend({
			request: function () {
				var name = arguments[0];
				var args = Array.prototype.slice.call(arguments, 1);
				if (this.hasHandler(name)) {
					return this.getHandler(name).apply(this, args);
				}
			}
		});

	})(Wreqr);

	// Event Aggregator
	// ----------------
	// A pub-sub object that can be used to decouple various parts
	// of an application through event-driven architecture.

	Wreqr.EventAggregator = (function (Backbone, _) {
		"use strict";
		var EA = function () { };

		// Copy the `extend` function used by Backbone's classes
		EA.extend = Backbone.Model.extend;

		// Copy the basic Backbone.Events on to the event aggregator
		_.extend(EA.prototype, Backbone.Events);

		return EA;
	})(Backbone, _);

	// Wreqr.Channel
	// --------------
	//
	// An object that wraps the three messaging systems:
	// EventAggregator, RequestResponse, Commands
	Wreqr.Channel = (function (Wreqr) {
		"use strict";

		var Channel = function (channelName) {
			this.vent = new Backbone.Wreqr.EventAggregator();
			this.reqres = new Backbone.Wreqr.RequestResponse();
			this.commands = new Backbone.Wreqr.Commands();
			this.channelName = channelName;
		};

		_.extend(Channel.prototype, {

			// Remove all handlers from the messaging systems of this channel
			reset: function () {
				this.vent.off();
				this.vent.stopListening();
				this.reqres.removeAllHandlers();
				this.commands.removeAllHandlers();
				return this;
			},

			// Connect a hash of events; one for each messaging system
			connectEvents: function (hash, context) {
				this._connect('vent', hash, context);
				return this;
			},

			connectCommands: function (hash, context) {
				this._connect('commands', hash, context);
				return this;
			},

			connectRequests: function (hash, context) {
				this._connect('reqres', hash, context);
				return this;
			},

			// Attach the handlers to a given message system `type`
			_connect: function (type, hash, context) {
				if (!hash) {
					return;
				}

				context = context || this;
				var method = (type === 'vent') ? 'on' : 'setHandler';

				_.each(hash, function (fn, eventName) {
					this[type][method](eventName, _.bind(fn, context));
				}, this);
			}
		});


		return Channel;
	})(Wreqr);

	// Wreqr.Radio
	// --------------
	//
	// An object that lets you communicate with many channels.
	Wreqr.radio = (function (Wreqr) {
		"use strict";

		var Radio = function () {
			this._channels = {};
			this.vent = {};
			this.commands = {};
			this.reqres = {};
			this._proxyMethods();
		};

		_.extend(Radio.prototype, {

			channel: function (channelName) {
				if (!channelName) {
					throw new Error('Channel must receive a name');
				}

				return this._getChannel(channelName);
			},

			_getChannel: function (channelName) {
				var channel = this._channels[channelName];

				if (!channel) {
					channel = new Wreqr.Channel(channelName);
					this._channels[channelName] = channel;
				}

				return channel;
			},

			_proxyMethods: function () {
				_.each(['vent', 'commands', 'reqres'], function (system) {
					_.each(messageSystems[system], function (method) {
						this[system][method] = proxyMethod(this, system, method);
					}, this);
				}, this);
			}
		});


		var messageSystems = {
			vent: [
				'on',
				'off',
				'trigger',
				'once',
				'stopListening',
				'listenTo',
				'listenToOnce'
			],

			commands: [
				'execute',
				'setHandler',
				'setHandlers',
				'removeHandler',
				'removeAllHandlers'
			],

			reqres: [
				'request',
				'setHandler',
				'setHandlers',
				'removeHandler',
				'removeAllHandlers'
			]
		};

		var proxyMethod = function (radio, system, method) {
			return function (channelName) {
				var messageSystem = radio._getChannel(channelName)[system];
				var args = Array.prototype.slice.call(arguments, 1);

				messageSystem[method].apply(messageSystem, args);
			};
		};

		return new Radio();

	})(Wreqr);


	return Wreqr;
})(Backbone, Backbone.Marionette, _);

var Marionette = (function (global, Backbone, _) {
	"use strict";

	// Define and export the Marionette namespace
	var Marionette = {};
	Backbone.Marionette = Marionette;

	// Get the DOM manipulator for later use
	Marionette.$ = Backbone.$;

	// Helpers
	// -------

	// For slicing `arguments` in functions
	var slice = Array.prototype.slice;

	function throwError(message, name) {
		var error = new Error(message);
		error.name = name || 'Error';
		throw error;
	}

	// Marionette.extend
	// -----------------

	// Borrow the Backbone `extend` method so we can use it as needed
	Marionette.extend = Backbone.Model.extend;

	// Marionette.getOption
	// --------------------

	// Retrieve an object, function or other value from a target
	// object or its `options`, with `options` taking precedence.
	Marionette.getOption = function (target, optionName) {
		if (!target || !optionName) { return; }
		var value;

		if (target.options && (optionName in target.options) && (target.options[optionName] !== undefined)) {
			value = target.options[optionName];
		} else {
			value = target[optionName];
		}

		return value;
	};

	// Marionette.normalizeMethods
	// ----------------------

	// Pass in a mapping of events => functions or function names
	// and return a mapping of events => functions
	Marionette.normalizeMethods = function (hash) {
		var normalizedHash = {}, method;
		_.each(hash, function (fn, name) {
			method = fn;
			if (!_.isFunction(method)) {
				method = this[method];
			}
			if (!method) {
				return;
			}
			normalizedHash[name] = method;
		}, this);
		return normalizedHash;
	};


	// allows for the use of the @ui. syntax within
	// a given key for triggers and events
	// swaps the @ui with the associated selector
	Marionette.normalizeUIKeys = function (hash, ui) {
		if (typeof (hash) === "undefined") {
			return;
		}

		_.each(_.keys(hash), function (v) {
			var pattern = /@ui.[a-zA-Z_$0-9]*/g;
			if (v.match(pattern)) {
				hash[v.replace(pattern, function (r) {
					return ui[r.slice(4)];
				})] = hash[v];
				delete hash[v];
			}
		});

		return hash;
	};

	// Mix in methods from Underscore, for iteration, and other
	// collection related features.
	// Borrowing this code from Backbone.Collection:
	// http://backbonejs.org/docs/backbone.html#section-106
	Marionette.actAsCollection = function (object, listProperty) {
		var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
			'select', 'reject', 'every', 'all', 'some', 'any', 'include',
			'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
			'last', 'without', 'isEmpty', 'pluck'];

		_.each(methods, function (method) {
			object[method] = function () {
				var list = _.values(_.result(this, listProperty));
				var args = [list].concat(_.toArray(arguments));
				return _[method].apply(_, args);
			};
		});
	};

	// Trigger an event and/or a corresponding method name. Examples:
	//
	// `this.triggerMethod("foo")` will trigger the "foo" event and
	// call the "onFoo" method.
	//
	// `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
	// call the "onFooBar" method.
	Marionette.triggerMethod = (function () {

		// split the event name on the ":"
		var splitter = /(^|:)(\w)/gi;

		// take the event section ("section1:section2:section3")
		// and turn it in to uppercase name
		function getEventName(match, prefix, eventName) {
			return eventName.toUpperCase();
		}

		// actual triggerMethod implementation
		var triggerMethod = function (event) {
			// get the method name from the event name
			var methodName = 'on' + event.replace(splitter, getEventName);
			var method = this[methodName];

			// trigger the event, if a trigger method exists
			if (_.isFunction(this.trigger)) {
				this.trigger.apply(this, arguments);
			}

			// call the onMethodName if it exists
			if (_.isFunction(method)) {
				// pass all arguments, except the event name
				return method.apply(this, _.tail(arguments));
			}
		};

		return triggerMethod;
	})();

	// DOMRefresh
	// ----------
	//
	// Monitor a view's state, and after it has been rendered and shown
	// in the DOM, trigger a "dom:refresh" event every time it is
	// re-rendered.

	Marionette.MonitorDOMRefresh = (function (documentElement) {
		// track when the view has been shown in the DOM,
		// using a Marionette.Region (or by other means of triggering "show")
		function handleShow(view) {
			view._isShown = true;
			triggerDOMRefresh(view);
		}

		// track when the view has been rendered
		function handleRender(view) {
			view._isRendered = true;
			triggerDOMRefresh(view);
		}

		// Trigger the "dom:refresh" event and corresponding "onDomRefresh" method
		function triggerDOMRefresh(view) {
			if (view._isShown && view._isRendered && isInDOM(view)) {
				if (_.isFunction(view.triggerMethod)) {
					view.triggerMethod("dom:refresh");
				}
			}
		}

		function isInDOM(view) {
			return documentElement.contains(view.el);
		}

		// Export public API
		return function (view) {
			view.listenTo(view, "show", function () {
				handleShow(view);
			});

			view.listenTo(view, "render", function () {
				handleRender(view);
			});
		};
	})(document.documentElement);


	// Marionette.bindEntityEvents & unbindEntityEvents
	// ---------------------------
	//
	// These methods are used to bind/unbind a backbone "entity" (collection/model)
	// to methods on a target object.
	//
	// The first parameter, `target`, must have a `listenTo` method from the
	// EventBinder object.
	//
	// The second parameter is the entity (Backbone.Model or Backbone.Collection)
	// to bind the events from.
	//
	// The third parameter is a hash of { "event:name": "eventHandler" }
	// configuration. Multiple handlers can be separated by a space. A
	// function can be supplied instead of a string handler name.

	(function (Marionette) {
		"use strict";

		// Bind the event to handlers specified as a string of
		// handler names on the target object
		function bindFromStrings(target, entity, evt, methods) {
			var methodNames = methods.split(/\s+/);

			_.each(methodNames, function (methodName) {

				var method = target[methodName];
				if (!method) {
					throwError("Method '" + methodName + "' was configured as an event handler, but does not exist.");
				}

				target.listenTo(entity, evt, method);
			});
		}

		// Bind the event to a supplied callback function
		function bindToFunction(target, entity, evt, method) {
			target.listenTo(entity, evt, method);
		}

		// Bind the event to handlers specified as a string of
		// handler names on the target object
		function unbindFromStrings(target, entity, evt, methods) {
			var methodNames = methods.split(/\s+/);

			_.each(methodNames, function (methodName) {
				var method = target[methodName];
				target.stopListening(entity, evt, method);
			});
		}

		// Bind the event to a supplied callback function
		function unbindToFunction(target, entity, evt, method) {
			target.stopListening(entity, evt, method);
		}


		// generic looping function
		function iterateEvents(target, entity, bindings, functionCallback, stringCallback) {
			if (!entity || !bindings) { return; }

			// allow the bindings to be a function
			if (_.isFunction(bindings)) {
				bindings = bindings.call(target);
			}

			// iterate the bindings and bind them
			_.each(bindings, function (methods, evt) {

				// allow for a function as the handler,
				// or a list of event names as a string
				if (_.isFunction(methods)) {
					functionCallback(target, entity, evt, methods);
				} else {
					stringCallback(target, entity, evt, methods);
				}

			});
		}

		// Export Public API
		Marionette.bindEntityEvents = function (target, entity, bindings) {
			iterateEvents(target, entity, bindings, bindToFunction, bindFromStrings);
		};

		Marionette.unbindEntityEvents = function (target, entity, bindings) {
			iterateEvents(target, entity, bindings, unbindToFunction, unbindFromStrings);
		};

	})(Marionette);


	// Callbacks
	// ---------

	// A simple way of managing a collection of callbacks
	// and executing them at a later point in time, using jQuery's
	// `Deferred` object.
	Marionette.Callbacks = function () {
		this._deferred = Marionette.$.Deferred();
		this._callbacks = [];
	};

	_.extend(Marionette.Callbacks.prototype, {

		// Add a callback to be executed. Callbacks added here are
		// guaranteed to execute, even if they are added after the
		// `run` method is called.
		add: function (callback, contextOverride) {
			this._callbacks.push({ cb: callback, ctx: contextOverride });

			this._deferred.done(function (context, options) {
				if (contextOverride) { context = contextOverride; }
				callback.call(context, options);
			});
		},

		// Run all registered callbacks with the context specified.
		// Additional callbacks can be added after this has been run
		// and they will still be executed.
		run: function (options, context) {
			this._deferred.resolve(context, options);
		},

		// Resets the list of callbacks to be run, allowing the same list
		// to be run multiple times - whenever the `run` method is called.
		reset: function () {
			var callbacks = this._callbacks;
			this._deferred = Marionette.$.Deferred();
			this._callbacks = [];

			_.each(callbacks, function (cb) {
				this.add(cb.cb, cb.ctx);
			}, this);
		}
	});

	// Marionette Controller
	// ---------------------
	//
	// A multi-purpose object to use as a controller for
	// modules and routers, and as a mediator for workflow
	// and coordination of other objects, views, and more.
	Marionette.Controller = function (options) {
		this.triggerMethod = Marionette.triggerMethod;
		this.options = options || {};

		if (_.isFunction(this.initialize)) {
			this.initialize(this.options);
		}
	};

	Marionette.Controller.extend = Marionette.extend;

	// Controller Methods
	// --------------

	// Ensure it can trigger events with Backbone.Events
	_.extend(Marionette.Controller.prototype, Backbone.Events, {
		close: function () {
			this.stopListening();
			var args = Array.prototype.slice.call(arguments);
			this.triggerMethod.apply(this, ["close"].concat(args));
			this.off();
		}
	});

	// Region
	// ------
	//
	// Manage the visual regions of your composite application. See
	// http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/

	Marionette.Region = function (options) {
		this.options = options || {};
		this.el = Marionette.getOption(this, "el");

		if (!this.el) {
			throwError("An 'el' must be specified for a region.", "NoElError");
		}

		if (this.initialize) {
			var args = Array.prototype.slice.apply(arguments);
			this.initialize.apply(this, args);
		}
	};


	// Region Type methods
	// -------------------

	_.extend(Marionette.Region, {

		// Build an instance of a region by passing in a configuration object
		// and a default region type to use if none is specified in the config.
		//
		// The config object should either be a string as a jQuery DOM selector,
		// a Region type directly, or an object literal that specifies both
		// a selector and regionType:
		//
		// ```js
		// {
		//   selector: "#foo",
		//   regionType: MyCustomRegion
		// }
		// ```
		//
		buildRegion: function (regionConfig, defaultRegionType) {
			var regionIsString = _.isString(regionConfig);
			var regionSelectorIsString = _.isString(regionConfig.selector);
			var regionTypeIsUndefined = _.isUndefined(regionConfig.regionType);
			var regionIsType = _.isFunction(regionConfig);

			if (!regionIsType && !regionIsString && !regionSelectorIsString) {
				throwError("Region must be specified as a Region type, a selector string or an object with selector property");
			}

			var selector, RegionType;

			// get the selector for the region

			if (regionIsString) {
				selector = regionConfig;
			}

			if (regionConfig.selector) {
				selector = regionConfig.selector;
				delete regionConfig.selector;
			}

			// get the type for the region

			if (regionIsType) {
				RegionType = regionConfig;
			}

			if (!regionIsType && regionTypeIsUndefined) {
				RegionType = defaultRegionType;
			}

			if (regionConfig.regionType) {
				RegionType = regionConfig.regionType;
				delete regionConfig.regionType;
			}

			if (regionIsString || regionIsType) {
				regionConfig = {};
			}

			regionConfig.el = selector;

			// build the region instance
			var region = new RegionType(regionConfig);

			// override the `getEl` function if we have a parentEl
			// this must be overridden to ensure the selector is found
			// on the first use of the region. if we try to assign the
			// region's `el` to `parentEl.find(selector)` in the object
			// literal to build the region, the element will not be
			// guaranteed to be in the DOM already, and will cause problems
			if (regionConfig.parentEl) {
				region.getEl = function (selector) {
					var parentEl = regionConfig.parentEl;
					if (_.isFunction(parentEl)) {
						parentEl = parentEl();
					}
					return parentEl.find(selector);
				};
			}

			return region;
		}

	});

	// Region Instance Methods
	// -----------------------

	_.extend(Marionette.Region.prototype, Backbone.Events, {

		// Displays a backbone view instance inside of the region.
		// Handles calling the `render` method for you. Reads content
		// directly from the `el` attribute. Also calls an optional
		// `onShow` and `close` method on your view, just after showing
		// or just before closing the view, respectively.
		// The `preventClose` option can be used to prevent a view from being destroyed on show.
		show: function (view, options) {
			this.ensureEl();

			var showOptions = options || {};
			var isViewClosed = view.isClosed || _.isUndefined(view.$el);
			var isDifferentView = view !== this.currentView;
			var preventClose = !!showOptions.preventClose;

			// only close the view if we don't want to preventClose and the view is different
			var _shouldCloseView = !preventClose && isDifferentView;

			if (_shouldCloseView) {
				this.close();
			}

			view.render();
			Marionette.triggerMethod.call(this, "before:show", view);
			Marionette.triggerMethod.call(view, "before:show");

			if (isDifferentView || isViewClosed) {
				this.open(view);
			}

			this.currentView = view;

			Marionette.triggerMethod.call(this, "show", view);
			Marionette.triggerMethod.call(view, "show");
		},

		ensureEl: function () {
			if (!this.$el || this.$el.length === 0) {
				this.$el = this.getEl(this.el);
			}
		},

		// Override this method to change how the region finds the
		// DOM element that it manages. Return a jQuery selector object.
		getEl: function (selector) {
			return Marionette.$(selector);
		},

		// Override this method to change how the new view is
		// appended to the `$el` that the region is managing
		open: function (view) {
			this.$el.empty().append(view.el);
		},

		// Close the current view, if there is one. If there is no
		// current view, it does nothing and returns immediately.
		close: function () {
			var view = this.currentView;
			if (!view || view.isClosed) { return; }

			// call 'close' or 'remove', depending on which is found
			if (view.close) { view.close(); }
			else if (view.remove) { view.remove(); }

			Marionette.triggerMethod.call(this, "close", view);

			delete this.currentView;
		},

		// Attach an existing view to the region. This
		// will not call `render` or `onShow` for the new view,
		// and will not replace the current HTML for the `el`
		// of the region.
		attachView: function (view) {
			this.currentView = view;
		},

		// Reset the region by closing any existing view and
		// clearing out the cached `$el`. The next time a view
		// is shown via this region, the region will re-query the
		// DOM for the region's `el`.
		reset: function () {
			this.close();
			delete this.$el;
		}
	});

	// Copy the `extend` function used by Backbone's classes
	Marionette.Region.extend = Marionette.extend;

	// Marionette.RegionManager
	// ------------------------
	//
	// Manage one or more related `Marionette.Region` objects.
	Marionette.RegionManager = (function (Marionette) {

		var RegionManager = Marionette.Controller.extend({
			constructor: function (options) {
				this._regions = {};
				Marionette.Controller.prototype.constructor.call(this, options);
			},

			// Add multiple regions using an object literal, where
			// each key becomes the region name, and each value is
			// the region definition.
			addRegions: function (regionDefinitions, defaults) {
				var regions = {};

				_.each(regionDefinitions, function (definition, name) {
					if (_.isString(definition)) {
						definition = { selector: definition };
					}

					if (definition.selector) {
						definition = _.defaults({}, definition, defaults);
					}

					var region = this.addRegion(name, definition);
					regions[name] = region;
				}, this);

				return regions;
			},

			// Add an individual region to the region manager,
			// and return the region instance
			addRegion: function (name, definition) {
				var region;

				var isObject = _.isObject(definition);
				var isString = _.isString(definition);
				var hasSelector = !!definition.selector;

				if (isString || (isObject && hasSelector)) {
					region = Marionette.Region.buildRegion(definition, Marionette.Region);
				} else if (_.isFunction(definition)) {
					region = Marionette.Region.buildRegion(definition, Marionette.Region);
				} else {
					region = definition;
				}

				this._store(name, region);
				this.triggerMethod("region:add", name, region);
				return region;
			},

			// Get a region by name
			get: function (name) {
				return this._regions[name];
			},

			// Remove a region by name
			removeRegion: function (name) {
				var region = this._regions[name];
				this._remove(name, region);
			},

			// Close all regions in the region manager, and
			// remove them
			removeRegions: function () {
				_.each(this._regions, function (region, name) {
					this._remove(name, region);
				}, this);
			},

			// Close all regions in the region manager, but
			// leave them attached
			closeRegions: function () {
				_.each(this._regions, function (region, name) {
					region.close();
				}, this);
			},

			// Close all regions and shut down the region
			// manager entirely
			close: function () {
				this.removeRegions();
				Marionette.Controller.prototype.close.apply(this, arguments);
			},

			// internal method to store regions
			_store: function (name, region) {
				this._regions[name] = region;
				this._setLength();
			},

			// internal method to remove a region
			_remove: function (name, region) {
				region.close();
				region.stopListening();
				delete this._regions[name];
				this._setLength();
				this.triggerMethod("region:remove", name, region);
			},

			// set the number of regions current held
			_setLength: function () {
				this.length = _.size(this._regions);
			}

		});

		Marionette.actAsCollection(RegionManager.prototype, '_regions');

		return RegionManager;
	})(Marionette);


	// Template Cache
	// --------------

	// Manage templates stored in `<script>` blocks,
	// caching them for faster access.
	Marionette.TemplateCache = function (templateId) {
		this.templateId = templateId;
	};

	// TemplateCache object-level methods. Manage the template
	// caches from these method calls instead of creating
	// your own TemplateCache instances
	_.extend(Marionette.TemplateCache, {
		templateCaches: {},

		// Get the specified template by id. Either
		// retrieves the cached version, or loads it
		// from the DOM.
		get: function (templateId) {
			var cachedTemplate = this.templateCaches[templateId];

			if (!cachedTemplate) {
				cachedTemplate = new Marionette.TemplateCache(templateId);
				this.templateCaches[templateId] = cachedTemplate;
			}

			return cachedTemplate.load();
		},

		// Clear templates from the cache. If no arguments
		// are specified, clears all templates:
		// `clear()`
		//
		// If arguments are specified, clears each of the
		// specified templates from the cache:
		// `clear("#t1", "#t2", "...")`
		clear: function () {
			var i;
			var args = slice.call(arguments);
			var length = args.length;

			if (length > 0) {
				for (i = 0; i < length; i++) {
					delete this.templateCaches[args[i]];
				}
			} else {
				this.templateCaches = {};
			}
		}
	});

	// TemplateCache instance methods, allowing each
	// template cache object to manage its own state
	// and know whether or not it has been loaded
	_.extend(Marionette.TemplateCache.prototype, {

		// Internal method to load the template
		load: function () {
			// Guard clause to prevent loading this template more than once
			if (this.compiledTemplate) {
				return this.compiledTemplate;
			}

			// Load the template and compile it
			var template = this.loadTemplate(this.templateId);
			this.compiledTemplate = this.compileTemplate(template);

			return this.compiledTemplate;
		},

		// Load a template from the DOM, by default. Override
		// this method to provide your own template retrieval
		// For asynchronous loading with AMD/RequireJS, consider
		// using a template-loader plugin as described here:
		// https://github.com/marionettejs/backbone.marionette/wiki/Using-marionette-with-requirejs
		loadTemplate: function (templateId) {
			var template = Marionette.$(templateId).html();

			if (!template || template.length === 0) {
				throwError("Could not find template: '" + templateId + "'", "NoTemplateError");
			}

			return template;
		},

		// Pre-compile the template before caching it. Override
		// this method if you do not need to pre-compile a template
		// (JST / RequireJS for example) or if you want to change
		// the template engine used (Handebars, etc).
		compileTemplate: function (rawTemplate) {
			return _.template(rawTemplate);
		}
	});

	// Renderer
	// --------

	// Render a template with data by passing in the template
	// selector and the data to render.
	Marionette.Renderer = {

		// Render a template with data. The `template` parameter is
		// passed to the `TemplateCache` object to retrieve the
		// template function. Override this method to provide your own
		// custom rendering and template handling for all of Marionette.
		render: function (template, data) {

			if (!template) {
				throwError("Cannot render the template since it's false, null or undefined.", "TemplateNotFoundError");
			}

			var templateFunc;
			if (typeof template === "function") {
				templateFunc = template;
			} else {
				templateFunc = Marionette.TemplateCache.get(template);
			}

			return templateFunc(data);
		}
	};


	// Marionette.View
	// ---------------

	// The core view type that other Marionette views extend from.
	Marionette.View = Backbone.View.extend({

		constructor: function (options) {
			_.bindAll(this, "render");

			// this exposes view options to the view initializer
			// this is a backfill since backbone removed the assignment
			// of this.options
			// at some point however this may be removed
			this.options = _.extend({}, _.result(this, 'options'), _.isFunction(options) ? options.call(this) : options);

			// parses out the @ui DSL for events
			this.events = this.normalizeUIKeys(_.result(this, 'events'));

			if (_.isObject(this.behaviors)) {
				new Marionette.Behaviors(this);
			}

			Backbone.View.prototype.constructor.apply(this, arguments);

			Marionette.MonitorDOMRefresh(this);
			this.listenTo(this, "show", this.onShowCalled);
		},

		// import the "triggerMethod" to trigger events with corresponding
		// methods if the method exists
		triggerMethod: Marionette.triggerMethod,

		// Imports the "normalizeMethods" to transform hashes of
		// events=>function references/names to a hash of events=>function references
		normalizeMethods: Marionette.normalizeMethods,

		// Get the template for this view
		// instance. You can set a `template` attribute in the view
		// definition or pass a `template: "whatever"` parameter in
		// to the constructor options.
		getTemplate: function () {
			return Marionette.getOption(this, "template");
		},

		// Mix in template helper methods. Looks for a
		// `templateHelpers` attribute, which can either be an
		// object literal, or a function that returns an object
		// literal. All methods and attributes from this object
		// are copies to the object passed in.
		mixinTemplateHelpers: function (target) {
			target = target || {};
			var templateHelpers = Marionette.getOption(this, "templateHelpers");
			if (_.isFunction(templateHelpers)) {
				templateHelpers = templateHelpers.call(this);
			}
			return _.extend(target, templateHelpers);
		},


		normalizeUIKeys: function (hash) {
			var ui = _.result(this, 'ui');
			return Marionette.normalizeUIKeys(hash, ui);
		},

		// Configure `triggers` to forward DOM events to view
		// events. `triggers: {"click .foo": "do:foo"}`
		configureTriggers: function () {
			if (!this.triggers) { return; }

			var triggerEvents = {};

			// Allow `triggers` to be configured as a function
			var triggers = this.normalizeUIKeys(_.result(this, "triggers"));

			// Configure the triggers, prevent default
			// action and stop propagation of DOM events
			_.each(triggers, function (value, key) {

				var hasOptions = _.isObject(value);
				var eventName = hasOptions ? value.event : value;

				// build the event handler function for the DOM event
				triggerEvents[key] = function (e) {

					// stop the event in its tracks
					if (e) {
						var prevent = e.preventDefault;
						var stop = e.stopPropagation;

						var shouldPrevent = hasOptions ? value.preventDefault : prevent;
						var shouldStop = hasOptions ? value.stopPropagation : stop;

						if (shouldPrevent && prevent) { prevent.apply(e); }
						if (shouldStop && stop) { stop.apply(e); }
					}

					// build the args for the event
					var args = {
						view: this,
						model: this.model,
						collection: this.collection
					};

					// trigger the event
					this.triggerMethod(eventName, args);
				};

			}, this);

			return triggerEvents;
		},

		// Overriding Backbone.View's delegateEvents to handle
		// the `triggers`, `modelEvents`, and `collectionEvents` configuration
		delegateEvents: function (events) {
			this._delegateDOMEvents(events);
			Marionette.bindEntityEvents(this, this.model, Marionette.getOption(this, "modelEvents"));
			Marionette.bindEntityEvents(this, this.collection, Marionette.getOption(this, "collectionEvents"));
		},

		// internal method to delegate DOM events and triggers
		_delegateDOMEvents: function (events) {
			events = events || this.events;
			if (_.isFunction(events)) { events = events.call(this); }

			var combinedEvents = {};

			// look up if this view has behavior events
			var behaviorEvents = _.result(this, 'behaviorEvents') || {};
			var triggers = this.configureTriggers();

			// behavior events will be overriden by view events and or triggers
			_.extend(combinedEvents, behaviorEvents, events, triggers);

			Backbone.View.prototype.delegateEvents.call(this, combinedEvents);
		},

		// Overriding Backbone.View's undelegateEvents to handle unbinding
		// the `triggers`, `modelEvents`, and `collectionEvents` config
		undelegateEvents: function () {
			var args = Array.prototype.slice.call(arguments);
			Backbone.View.prototype.undelegateEvents.apply(this, args);

			Marionette.unbindEntityEvents(this, this.model, Marionette.getOption(this, "modelEvents"));
			Marionette.unbindEntityEvents(this, this.collection, Marionette.getOption(this, "collectionEvents"));
		},

		// Internal method, handles the `show` event.
		onShowCalled: function () { },

		// Default `close` implementation, for removing a view from the
		// DOM and unbinding it. Regions will call this method
		// for you. You can specify an `onClose` method in your view to
		// add custom code that is called after the view is closed.
		close: function () {
			if (this.isClosed) { return; }

			var args = Array.prototype.slice.call(arguments);

			// allow the close to be stopped by returning `false`
			// from the `onBeforeClose` method
			var shouldClose = this.triggerMethod.apply(this, ["before:close"].concat(args));
			if (shouldClose === false) {
				return;
			}

			// mark as closed before doing the actual close, to
			// prevent infinite loops within "close" event handlers
			// that are trying to close other views
			this.isClosed = true;
			this.triggerMethod.apply(this, ["close"].concat(args));

			// unbind UI elements
			this.unbindUIElements();

			// remove the view from the DOM
			this.remove();
		},

		// This method binds the elements specified in the "ui" hash inside the view's code with
		// the associated jQuery selectors.
		bindUIElements: function () {
			if (!this.ui) { return; }

			// store the ui hash in _uiBindings so they can be reset later
			// and so re-rendering the view will be able to find the bindings
			if (!this._uiBindings) {
				this._uiBindings = this.ui;
			}

			// get the bindings result, as a function or otherwise
			var bindings = _.result(this, "_uiBindings");

			// empty the ui so we don't have anything to start with
			this.ui = {};

			// bind each of the selectors
			_.each(_.keys(bindings), function (key) {
				var selector = bindings[key];
				this.ui[key] = this.$(selector);
			}, this);
		},

		// This method unbinds the elements specified in the "ui" hash
		unbindUIElements: function () {
			if (!this.ui || !this._uiBindings) { return; }

			// delete all of the existing ui bindings
			_.each(this.ui, function ($el, name) {
				delete this.ui[name];
			}, this);

			// reset the ui element to the original bindings configuration
			this.ui = this._uiBindings;
			delete this._uiBindings;
		}
	});

	// Item View
	// ---------

	// A single item view implementation that contains code for rendering
	// with underscore.js templates, serializing the view's model or collection,
	// and calling several methods on extended views, such as `onRender`.
	Marionette.ItemView = Marionette.View.extend({

		// Setting up the inheritance chain which allows changes to
		// Marionette.View.prototype.constructor which allows overriding
		constructor: function () {
			Marionette.View.prototype.constructor.apply(this, arguments);
		},

		// Serialize the model or collection for the view. If a model is
		// found, `.toJSON()` is called. If a collection is found, `.toJSON()`
		// is also called, but is used to populate an `items` array in the
		// resulting data. If both are found, defaults to the model.
		// You can override the `serializeData` method in your own view
		// definition, to provide custom serialization for your view's data.
		serializeData: function () {
			var data = {};

			if (this.model) {
				data = this.model.toJSON();
			}
			else if (this.collection) {
				data = { items: this.collection.toJSON() };
			}

			return data;
		},

		// Render the view, defaulting to underscore.js templates.
		// You can override this in your view definition to provide
		// a very specific rendering for your view. In general, though,
		// you should override the `Marionette.Renderer` object to
		// change how Marionette renders views.
		render: function () {
			this.isClosed = false;

			this.triggerMethod("before:render", this);
			this.triggerMethod("item:before:render", this);

			var data = this.serializeData();
			data = this.mixinTemplateHelpers(data);

			var template = this.getTemplate();
			var html = Marionette.Renderer.render(template, data);

			this.$el.html(html);
			this.bindUIElements();

			this.triggerMethod("render", this);
			this.triggerMethod("item:rendered", this);

			return this;
		},

		// Override the default close event to add a few
		// more events that are triggered.
		close: function () {
			if (this.isClosed) { return; }

			this.triggerMethod('item:before:close');

			Marionette.View.prototype.close.apply(this, arguments);

			this.triggerMethod('item:closed');
		}
	});

	// Collection View
	// ---------------

	// A view that iterates over a Backbone.Collection
	// and renders an individual ItemView for each model.
	Marionette.CollectionView = Marionette.View.extend({
		// used as the prefix for item view events
		// that are forwarded through the collectionview
		itemViewEventPrefix: "itemview",

		// constructor
		constructor: function (options) {
			this._initChildViewStorage();

			Marionette.View.prototype.constructor.apply(this, arguments);

			this._initialEvents();
			this.initRenderBuffer();
		},

		// Instead of inserting elements one by one into the page,
		// it's much more performant to insert elements into a document
		// fragment and then insert that document fragment into the page
		initRenderBuffer: function () {
			this.elBuffer = document.createDocumentFragment();
			this._bufferedChildren = [];
		},

		startBuffering: function () {
			this.initRenderBuffer();
			this.isBuffering = true;
		},

		endBuffering: function () {
			this.isBuffering = false;
			this.appendBuffer(this, this.elBuffer);
			this._triggerShowBufferedChildren();
			this.initRenderBuffer();
		},

		_triggerShowBufferedChildren: function () {
			if (this._isShown) {
				_.each(this._bufferedChildren, function (child) {
					Marionette.triggerMethod.call(child, "show");
				});
				this._bufferedChildren = [];
			}
		},

		// Configured the initial events that the collection view
		// binds to.
		_initialEvents: function () {
			if (this.collection) {
				this.listenTo(this.collection, "add", this.addChildView);
				this.listenTo(this.collection, "remove", this.removeItemView);
				this.listenTo(this.collection, "reset", this.render);
			}
		},

		// Handle a child item added to the collection
		addChildView: function (item, collection, options) {
			this.closeEmptyView();
			var ItemView = this.getItemView(item);
			var index = this.collection.indexOf(item);
			this.addItemView(item, ItemView, index);
		},

		// Override from `Marionette.View` to guarantee the `onShow` method
		// of child views is called.
		onShowCalled: function () {
			this.children.each(function (child) {
				Marionette.triggerMethod.call(child, "show");
			});
		},

		// Internal method to trigger the before render callbacks
		// and events
		triggerBeforeRender: function () {
			this.triggerMethod("before:render", this);
			this.triggerMethod("collection:before:render", this);
		},

		// Internal method to trigger the rendered callbacks and
		// events
		triggerRendered: function () {
			this.triggerMethod("render", this);
			this.triggerMethod("collection:rendered", this);
		},

		// Render the collection of items. Override this method to
		// provide your own implementation of a render function for
		// the collection view.
		render: function () {
			this.isClosed = false;
			this.triggerBeforeRender();
			this._renderChildren();
			this.triggerRendered();
			return this;
		},

		// Internal method. Separated so that CompositeView can have
		// more control over events being triggered, around the rendering
		// process
		_renderChildren: function () {
			this.startBuffering();

			this.closeEmptyView();
			this.closeChildren();

			if (!this.isEmpty(this.collection)) {
				this.showCollection();
			} else {
				this.showEmptyView();
			}

			this.endBuffering();
		},

		// Internal method to loop through each item in the
		// collection view and show it
		showCollection: function () {
			var ItemView;
			this.collection.each(function (item, index) {
				ItemView = this.getItemView(item);
				this.addItemView(item, ItemView, index);
			}, this);
		},

		// Internal method to show an empty view in place of
		// a collection of item views, when the collection is
		// empty
		showEmptyView: function () {
			var EmptyView = this.getEmptyView();

			if (EmptyView && !this._showingEmptyView) {
				this._showingEmptyView = true;
				var model = new Backbone.Model();
				this.addItemView(model, EmptyView, 0);
			}
		},

		// Internal method to close an existing emptyView instance
		// if one exists. Called when a collection view has been
		// rendered empty, and then an item is added to the collection.
		closeEmptyView: function () {
			if (this._showingEmptyView) {
				this.closeChildren();
				delete this._showingEmptyView;
			}
		},

		// Retrieve the empty view type
		getEmptyView: function () {
			return Marionette.getOption(this, "emptyView");
		},

		// Retrieve the itemView type, either from `this.options.itemView`
		// or from the `itemView` in the object definition. The "options"
		// takes precedence.
		getItemView: function (item) {
			var itemView = Marionette.getOption(this, "itemView");

			if (!itemView) {
				throwError("An `itemView` must be specified", "NoItemViewError");
			}

			return itemView;
		},

		// Render the child item's view and add it to the
		// HTML for the collection view.
		addItemView: function (item, ItemView, index) {
			// get the itemViewOptions if any were specified
			var itemViewOptions = Marionette.getOption(this, "itemViewOptions");
			if (_.isFunction(itemViewOptions)) {
				itemViewOptions = itemViewOptions.call(this, item, index);
			}

			// build the view
			var view = this.buildItemView(item, ItemView, itemViewOptions);

			// set up the child view event forwarding
			this.addChildViewEventForwarding(view);

			// this view is about to be added
			this.triggerMethod("before:item:added", view);

			// Store the child view itself so we can properly
			// remove and/or close it later
			this.children.add(view);

			// Render it and show it
			this.renderItemView(view, index);

			// call the "show" method if the collection view
			// has already been shown
			if (this._isShown && !this.isBuffering) {
				Marionette.triggerMethod.call(view, "show");
			}

			// this view was added
			this.triggerMethod("after:item:added", view);

			return view;
		},

		// Set up the child view event forwarding. Uses an "itemview:"
		// prefix in front of all forwarded events.
		addChildViewEventForwarding: function (view) {
			var prefix = Marionette.getOption(this, "itemViewEventPrefix");

			// Forward all child item view events through the parent,
			// prepending "itemview:" to the event name
			this.listenTo(view, "all", function () {
				var args = slice.call(arguments);
				var rootEvent = args[0];
				var itemEvents = this.normalizeMethods(this.getItemEvents());

				args[0] = prefix + ":" + rootEvent;
				args.splice(1, 0, view);

				// call collectionView itemEvent if defined
				if (typeof itemEvents !== "undefined" && _.isFunction(itemEvents[rootEvent])) {
					itemEvents[rootEvent].apply(this, args);
				}

				Marionette.triggerMethod.apply(this, args);
			}, this);
		},

		// returns the value of itemEvents depending on if a function
		getItemEvents: function () {
			if (_.isFunction(this.itemEvents)) {
				return this.itemEvents.call(this);
			}

			return this.itemEvents;
		},

		// render the item view
		renderItemView: function (view, index) {
			view.render();
			this.appendHtml(this, view, index);
		},

		// Build an `itemView` for every model in the collection.
		buildItemView: function (item, ItemViewType, itemViewOptions) {
			var options = _.extend({ model: item }, itemViewOptions);
			return new ItemViewType(options);
		},

		// get the child view by item it holds, and remove it
		removeItemView: function (item) {
			var view = this.children.findByModel(item);
			this.removeChildView(view);
			this.checkEmpty();
		},

		// Remove the child view and close it
		removeChildView: function (view) {

			// shut down the child view properly,
			// including events that the collection has from it
			if (view) {
				// call 'close' or 'remove', depending on which is found
				if (view.close) { view.close(); }
				else if (view.remove) { view.remove(); }

				this.stopListening(view);
				this.children.remove(view);
			}

			this.triggerMethod("item:removed", view);
		},

		// helper to check if the collection is empty
		isEmpty: function (collection) {
			// check if we're empty now
			return !this.collection || this.collection.length === 0;
		},

		// If empty, show the empty view
		checkEmpty: function () {
			if (this.isEmpty(this.collection)) {
				this.showEmptyView();
			}
		},

		// You might need to override this if you've overridden appendHtml
		appendBuffer: function (collectionView, buffer) {
			collectionView.$el.append(buffer);
		},

		// Append the HTML to the collection's `el`.
		// Override this method to do something other
		// than `.append`.
		appendHtml: function (collectionView, itemView, index) {
			if (collectionView.isBuffering) {
				// buffering happens on reset events and initial renders
				// in order to reduce the number of inserts into the
				// document, which are expensive.
				collectionView.elBuffer.appendChild(itemView.el);
				collectionView._bufferedChildren.push(itemView);
			}
			else {
				// If we've already rendered the main collection, just
				// append the new items directly into the element.
				collectionView.$el.append(itemView.el);
			}
		},

		// Internal method to set up the `children` object for
		// storing all of the child views
		_initChildViewStorage: function () {
			this.children = new Backbone.ChildViewContainer();
		},

		// Handle cleanup and other closing needs for
		// the collection of views.
		close: function () {
			if (this.isClosed) { return; }

			this.triggerMethod("collection:before:close");
			this.closeChildren();
			this.triggerMethod("collection:closed");

			Marionette.View.prototype.close.apply(this, arguments);
		},

		// Close the child views that this collection view
		// is holding on to, if any
		closeChildren: function () {
			this.children.each(function (child) {
				this.removeChildView(child);
			}, this);
			this.checkEmpty();
		}
	});

	// Composite View
	// --------------

	// Used for rendering a branch-leaf, hierarchical structure.
	// Extends directly from CollectionView and also renders an
	// an item view as `modelView`, for the top leaf
	Marionette.CompositeView = Marionette.CollectionView.extend({

		// Setting up the inheritance chain which allows changes to
		// Marionette.CollectionView.prototype.constructor which allows overriding
		constructor: function () {
			Marionette.CollectionView.prototype.constructor.apply(this, arguments);
		},

		// Configured the initial events that the composite view
		// binds to. Override this method to prevent the initial
		// events, or to add your own initial events.
		_initialEvents: function () {

			// Bind only after composite view is rendered to avoid adding child views
			// to nonexistent itemViewContainer
			this.once('render', function () {
				if (this.collection) {
					this.listenTo(this.collection, "add", this.addChildView);
					this.listenTo(this.collection, "remove", this.removeItemView);
					this.listenTo(this.collection, "reset", this._renderChildren);
				}
			});

		},

		// Retrieve the `itemView` to be used when rendering each of
		// the items in the collection. The default is to return
		// `this.itemView` or Marionette.CompositeView if no `itemView`
		// has been defined
		getItemView: function (item) {
			var itemView = Marionette.getOption(this, "itemView") || this.constructor;

			if (!itemView) {
				throwError("An `itemView` must be specified", "NoItemViewError");
			}

			return itemView;
		},

		// Serialize the collection for the view.
		// You can override the `serializeData` method in your own view
		// definition, to provide custom serialization for your view's data.
		serializeData: function () {
			var data = {};

			if (this.model) {
				data = this.model.toJSON();
			}

			return data;
		},

		// Renders the model once, and the collection once. Calling
		// this again will tell the model's view to re-render itself
		// but the collection will not re-render.
		render: function () {
			this.isRendered = true;
			this.isClosed = false;
			this.resetItemViewContainer();

			this.triggerBeforeRender();
			var html = this.renderModel();
			this.$el.html(html);
			// the ui bindings is done here and not at the end of render since they
			// will not be available until after the model is rendered, but should be
			// available before the collection is rendered.
			this.bindUIElements();
			this.triggerMethod("composite:model:rendered");

			this._renderChildren();

			this.triggerMethod("composite:rendered");
			this.triggerRendered();
			return this;
		},

		_renderChildren: function () {
			if (this.isRendered) {
				this.triggerMethod("composite:collection:before:render");
				Marionette.CollectionView.prototype._renderChildren.call(this);
				this.triggerMethod("composite:collection:rendered");
			}
		},

		// Render an individual model, if we have one, as
		// part of a composite view (branch / leaf). For example:
		// a treeview.
		renderModel: function () {
			var data = {};
			data = this.serializeData();
			data = this.mixinTemplateHelpers(data);

			var template = this.getTemplate();
			return Marionette.Renderer.render(template, data);
		},


		// You might need to override this if you've overridden appendHtml
		appendBuffer: function (compositeView, buffer) {
			var $container = this.getItemViewContainer(compositeView);
			$container.append(buffer);
		},

		// Appends the `el` of itemView instances to the specified
		// `itemViewContainer` (a jQuery selector). Override this method to
		// provide custom logic of how the child item view instances have their
		// HTML appended to the composite view instance.
		appendHtml: function (compositeView, itemView, index) {
			if (compositeView.isBuffering) {
				compositeView.elBuffer.appendChild(itemView.el);
				compositeView._bufferedChildren.push(itemView);
			}
			else {
				// If we've already rendered the main collection, just
				// append the new items directly into the element.
				var $container = this.getItemViewContainer(compositeView);
				$container.append(itemView.el);
			}
		},

		// Internal method to ensure an `$itemViewContainer` exists, for the
		// `appendHtml` method to use.
		getItemViewContainer: function (containerView) {
			if ("$itemViewContainer" in containerView) {
				return containerView.$itemViewContainer;
			}

			var container;
			var itemViewContainer = Marionette.getOption(containerView, "itemViewContainer");
			if (itemViewContainer) {

				var selector = _.isFunction(itemViewContainer) ? itemViewContainer.call(containerView) : itemViewContainer;

				if (selector.charAt(0) === "@" && containerView.ui) {
					container = containerView.ui[selector.substr(4)];
				} else {
					container = containerView.$(selector);
				}

				if (container.length <= 0) {
					throwError("The specified `itemViewContainer` was not found: " + containerView.itemViewContainer, "ItemViewContainerMissingError");
				}

			} else {
				container = containerView.$el;
			}

			containerView.$itemViewContainer = container;
			return container;
		},

		// Internal method to reset the `$itemViewContainer` on render
		resetItemViewContainer: function () {
			if (this.$itemViewContainer) {
				delete this.$itemViewContainer;
			}
		}
	});

	// Layout
	// ------

	// Used for managing application layouts, nested layouts and
	// multiple regions within an application or sub-application.
	//
	// A specialized view type that renders an area of HTML and then
	// attaches `Region` instances to the specified `regions`.
	// Used for composite view management and sub-application areas.
	Marionette.Layout = Marionette.ItemView.extend({
		regionType: Marionette.Region,

		// Ensure the regions are available when the `initialize` method
		// is called.
		constructor: function (options) {
			options = options || {};

			this._firstRender = true;
			this._initializeRegions(options);

			Marionette.ItemView.prototype.constructor.call(this, options);
		},

		// Layout's render will use the existing region objects the
		// first time it is called. Subsequent calls will close the
		// views that the regions are showing and then reset the `el`
		// for the regions to the newly rendered DOM elements.
		render: function () {

			if (this.isClosed) {
				// a previously closed layout means we need to
				// completely re-initialize the regions
				this._initializeRegions();
			}
			if (this._firstRender) {
				// if this is the first render, don't do anything to
				// reset the regions
				this._firstRender = false;
			} else if (!this.isClosed) {
				// If this is not the first render call, then we need to
				// re-initializing the `el` for each region
				this._reInitializeRegions();
			}

			return Marionette.ItemView.prototype.render.apply(this, arguments);
		},

		// Handle closing regions, and then close the view itself.
		close: function () {
			if (this.isClosed) { return; }
			this.regionManager.close();
			Marionette.ItemView.prototype.close.apply(this, arguments);
		},

		// Add a single region, by name, to the layout
		addRegion: function (name, definition) {
			var regions = {};
			regions[name] = definition;
			return this._buildRegions(regions)[name];
		},

		// Add multiple regions as a {name: definition, name2: def2} object literal
		addRegions: function (regions) {
			this.regions = _.extend({}, this.regions, regions);
			return this._buildRegions(regions);
		},

		// Remove a single region from the Layout, by name
		removeRegion: function (name) {
			delete this.regions[name];
			return this.regionManager.removeRegion(name);
		},

		// Provides alternative access to regions
		// Accepts the region name
		// getRegion('main')
		getRegion: function (region) {
			return this.regionManager.get(region);
		},

		// internal method to build regions
		_buildRegions: function (regions) {
			var that = this;

			var defaults = {
				regionType: Marionette.getOption(this, "regionType"),
				parentEl: function () { return that.$el; }
			};

			return this.regionManager.addRegions(regions, defaults);
		},

		// Internal method to initialize the regions that have been defined in a
		// `regions` attribute on this layout.
		_initializeRegions: function (options) {
			var regions;
			this._initRegionManager();

			if (_.isFunction(this.regions)) {
				regions = this.regions(options);
			} else {
				regions = this.regions || {};
			}

			this.addRegions(regions);
		},

		// Internal method to re-initialize all of the regions by updating the `el` that
		// they point to
		_reInitializeRegions: function () {
			this.regionManager.closeRegions();
			this.regionManager.each(function (region) {
				region.reset();
			});
		},

		// Internal method to initialize the region manager
		// and all regions in it
		_initRegionManager: function () {
			this.regionManager = new Marionette.RegionManager();

			this.listenTo(this.regionManager, "region:add", function (name, region) {
				this[name] = region;
				this.trigger("region:add", name, region);
			});

			this.listenTo(this.regionManager, "region:remove", function (name, region) {
				delete this[name];
				this.trigger("region:remove", name, region);
			});
		}
	});


	// Behavior
	// -----------

	// A Behavior is an isolated set of DOM /
	// user interactions that can be mixed into any View.
	// Behaviors allow you to blackbox View specific interactions
	// into portable logical chunks, keeping your views simple and your code DRY.

	Marionette.Behavior = (function (_, Backbone) {
		function Behavior(options, view) {
			// Setup reference to the view.
			// this comes in handle when a behavior
			// wants to directly talk up the chain
			// to the view.
			this.view = view;
			this.defaults = _.result(this, "defaults") || {};
			this.options = _.extend({}, this.defaults, options);

			// proxy behavior $ method to the view
			// this is useful for doing jquery DOM lookups
			// scoped to behaviors view.
			this.$ = function () {
				return this.view.$.apply(this.view, arguments);
			};

			// Call the initialize method passing
			// the arguments from the instance constructor
			this.initialize.apply(this, arguments);
		}

		_.extend(Behavior.prototype, Backbone.Events, {
			initialize: function () { },

			// stopListening to behavior `onListen` events.
			close: function () {
				this.stopListening();
			},

			// Setup class level proxy for triggerMethod.
			triggerMethod: Marionette.triggerMethod
		});

		// Borrow Backbones extend implementation
		// this allows us to setup a proper
		// inheritence pattern that follow in suite
		// with the rest of Marionette views.
		Behavior.extend = Marionette.extend;

		return Behavior;
	})(_, Backbone);

	// Marionette.Behaviors
	// --------

	// Behaviors is a utility class that takes care of
	// glueing your behavior instances to their given View.
	// The most important part of this class is that you
	// **MUST** override the class level behaviorsLookup
	// method for things to work properly.

	Marionette.Behaviors = (function (Marionette, _) {

		function Behaviors(view) {
			// Behaviors defined on a view can be a flat object literal
			// or it can be a function that returns an object.
			this.behaviors = Behaviors.parseBehaviors(view, _.result(view, 'behaviors'));

			// Wraps several of the view's methods
			// calling the methods first on each behavior
			// and then eventually calling the method on the view.
			Behaviors.wrap(view, this.behaviors, [
				'bindUIElements', 'unbindUIElements',
				'delegateEvents', 'undelegateEvents',
				'onShow', 'onClose',
				'behaviorEvents', 'triggerMethod',
				'setElement', 'close'
			]);
		}

		var methods = {
			setElement: function (setElement, behaviors) {
				setElement.apply(this, _.tail(arguments, 2));

				// proxy behavior $el to the view's $el.
				// This is needed because a view's $el proxy
				// is not set until after setElement is called.
				_.each(behaviors, function (b) {
					b.$el = this.$el;
				}, this);
			},

			close: function (close, behaviors) {
				var args = _.tail(arguments, 2);
				close.apply(this, args);

				// Call close on each behavior after
				// closing down the view.
				// This unbinds event listeners
				// that behaviors have registerd for.
				_.invoke(behaviors, 'close', args);
			},

			onShow: function (onShow, behaviors) {
				var args = _.tail(arguments, 2);

				_.each(behaviors, function (b) {
					Marionette.triggerMethod.apply(b, ["show"].concat(args));
				});

				if (_.isFunction(onShow)) {
					onShow.apply(this, args);
				}
			},

			onClose: function (onClose, behaviors) {
				var args = _.tail(arguments, 2);

				_.each(behaviors, function (b) {
					Marionette.triggerMethod.apply(b, ["close"].concat(args));
				});

				if (_.isFunction(onClose)) {
					onClose.apply(this, args);
				}
			},

			bindUIElements: function (bindUIElements, behaviors) {
				bindUIElements.apply(this);
				_.invoke(behaviors, bindUIElements);
			},

			unbindUIElements: function (unbindUIElements, behaviors) {
				unbindUIElements.apply(this);
				_.invoke(behaviors, unbindUIElements);
			},

			triggerMethod: function (triggerMethod, behaviors) {
				var args = _.tail(arguments, 2);
				triggerMethod.apply(this, args);

				_.each(behaviors, function (b) {
					triggerMethod.apply(b, args);
				});
			},

			delegateEvents: function (delegateEvents, behaviors) {
				var args = _.tail(arguments, 2);
				delegateEvents.apply(this, args);

				_.each(behaviors, function (b) {
					Marionette.bindEntityEvents(b, this.model, Marionette.getOption(b, "modelEvents"));
					Marionette.bindEntityEvents(b, this.collection, Marionette.getOption(b, "collectionEvents"));
				}, this);
			},

			undelegateEvents: function (undelegateEvents, behaviors) {
				var args = _.tail(arguments, 2);
				undelegateEvents.apply(this, args);

				_.each(behaviors, function (b) {
					Marionette.unbindEntityEvents(b, this.model, Marionette.getOption(b, "modelEvents"));
					Marionette.unbindEntityEvents(b, this.collection, Marionette.getOption(b, "collectionEvents"));
				}, this);
			},

			behaviorEvents: function (behaviorEvents, behaviors) {
				var _behaviorsEvents = {};
				var viewUI = _.result(this, 'ui');

				_.each(behaviors, function (b, i) {
					var _events = {};
					var behaviorEvents = _.result(b, 'events') || {};
					var behaviorUI = _.result(b, 'ui');

					// Construct an internal UI hash first using
					// the views UI hash and then the behaviors UI hash.
					// This allows the user to use UI hash elements
					// defined in the parent view as well as those
					// defined in the given behavior.
					var ui = _.extend({}, viewUI, behaviorUI);

					// Normalize behavior events hash to allow
					// a user to use the @ui. syntax.
					behaviorEvents = Marionette.normalizeUIKeys(behaviorEvents, ui);

					_.each(_.keys(behaviorEvents), function (key) {
						// append white-space at the end of each key to prevent behavior key collisions
						// this is relying on the fact backbone events considers "click .foo" the same  "click .foo "
						// starts with an array of two so the first behavior has one space

						// +2 is uses becauce new Array(1) or 0 is "" and not " "
						var whitespace = (new Array(i + 2)).join(" ");
						var eventKey = key + whitespace;
						var handler = _.isFunction(behaviorEvents[key]) ? behaviorEvents[key] : b[behaviorEvents[key]];

						_events[eventKey] = _.bind(handler, b);
					});

					_behaviorsEvents = _.extend(_behaviorsEvents, _events);
				});

				return _behaviorsEvents;
			}
		};

		_.extend(Behaviors, {

			// placeholder method to be extended by the user
			// should define the object that stores the behaviors
			// i.e.
			//
			// Marionette.Behaviors.behaviorsLookup: function() {
			//   return App.Behaviors
			// }
			behaviorsLookup: function () {
				throw new Error("You must define where your behaviors are stored. See https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.behaviors.md#behaviorslookup");
			},

			// Takes care of getting the behavior class
			// given options and a key.
			// If a user passes in options.behaviorClass
			// default to using that. Otherwise delegate
			// the lookup to the users behaviorsLookup implementation.
			getBehaviorClass: function (options, key) {
				if (options.behaviorClass) {
					return options.behaviorClass;
				}

				// Get behavior class can be either a flat object or a method
				return _.isFunction(Behaviors.behaviorsLookup) ? Behaviors.behaviorsLookup.apply(this, arguments)[key] : Behaviors.behaviorsLookup[key];
			},

			// Maps over a view's behaviors. Performing
			// a lookup on each behavior and the instantiating
			// said behavior passing its options and view.
			parseBehaviors: function (view, behaviors) {
				return _.map(behaviors, function (options, key) {
					var BehaviorClass = Behaviors.getBehaviorClass(options, key);
					return new BehaviorClass(options, view);
				});
			},

			// wrap view internal methods so that they delegate to behaviors.
			// For example, onClose should trigger close on all of the behaviors and then close itself.
			// i.e.
			//
			// view.delegateEvents = _.partial(methods.delegateEvents, view.delegateEvents, behaviors);
			wrap: function (view, behaviors, methodNames) {
				_.each(methodNames, function (methodName) {
					view[methodName] = _.partial(methods[methodName], view[methodName], behaviors);
				});
			}
		});

		return Behaviors;

	})(Marionette, _);


	// AppRouter
	// ---------

	// Reduce the boilerplate code of handling route events
	// and then calling a single method on another object.
	// Have your routers configured to call the method on
	// your object, directly.
	//
	// Configure an AppRouter with `appRoutes`.
	//
	// App routers can only take one `controller` object.
	// It is recommended that you divide your controller
	// objects in to smaller pieces of related functionality
	// and have multiple routers / controllers, instead of
	// just one giant router and controller.
	//
	// You can also add standard routes to an AppRouter.

	Marionette.AppRouter = Backbone.Router.extend({

		constructor: function (options) {
			Backbone.Router.prototype.constructor.apply(this, arguments);

			this.options = options || {};

			var appRoutes = Marionette.getOption(this, "appRoutes");
			var controller = this._getController();
			this.processAppRoutes(controller, appRoutes);
			this.on("route", this._processOnRoute, this);
		},

		// Similar to route method on a Backbone Router but
		// method is called on the controller
		appRoute: function (route, methodName) {
			var controller = this._getController();
			this._addAppRoute(controller, route, methodName);
		},

		// process the route event and trigger the onRoute
		// method call, if it exists
		_processOnRoute: function (routeName, routeArgs) {
			// find the path that matched
			var routePath = _.invert(this.appRoutes)[routeName];

			// make sure an onRoute is there, and call it
			if (_.isFunction(this.onRoute)) {
				this.onRoute(routeName, routePath, routeArgs);
			}
		},

		// Internal method to process the `appRoutes` for the
		// router, and turn them in to routes that trigger the
		// specified method on the specified `controller`.
		processAppRoutes: function (controller, appRoutes) {
			if (!appRoutes) { return; }

			var routeNames = _.keys(appRoutes).reverse(); // Backbone requires reverted order of routes

			_.each(routeNames, function (route) {
				this._addAppRoute(controller, route, appRoutes[route]);
			}, this);
		},

		_getController: function () {
			return Marionette.getOption(this, "controller");
		},

		_addAppRoute: function (controller, route, methodName) {
			var method = controller[methodName];

			if (!method) {
				throwError("Method '" + methodName + "' was not found on the controller");
			}

			this.route(route, methodName, _.bind(method, controller));
		}
	});

	// Application
	// -----------

	// Contain and manage the composite application as a whole.
	// Stores and starts up `Region` objects, includes an
	// event aggregator as `app.vent`
	Marionette.Application = function (options) {
		this._initRegionManager();
		this._initCallbacks = new Marionette.Callbacks();
		this.vent = new Backbone.Wreqr.EventAggregator();
		this.commands = new Backbone.Wreqr.Commands();
		this.reqres = new Backbone.Wreqr.RequestResponse();
		this.submodules = {};

		_.extend(this, options);

		this.triggerMethod = Marionette.triggerMethod;
	};

	_.extend(Marionette.Application.prototype, Backbone.Events, {
		// Command execution, facilitated by Backbone.Wreqr.Commands
		execute: function () {
			this.commands.execute.apply(this.commands, arguments);
		},

		// Request/response, facilitated by Backbone.Wreqr.RequestResponse
		request: function () {
			return this.reqres.request.apply(this.reqres, arguments);
		},

		// Add an initializer that is either run at when the `start`
		// method is called, or run immediately if added after `start`
		// has already been called.
		addInitializer: function (initializer) {
			this._initCallbacks.add(initializer);
		},

		// kick off all of the application's processes.
		// initializes all of the regions that have been added
		// to the app, and runs all of the initializer functions
		start: function (options) {
			this.triggerMethod("initialize:before", options);
			this._initCallbacks.run(options, this);
			this.triggerMethod("initialize:after", options);

			this.triggerMethod("start", options);
		},

		// Add regions to your app.
		// Accepts a hash of named strings or Region objects
		// addRegions({something: "#someRegion"})
		// addRegions({something: Region.extend({el: "#someRegion"}) });
		addRegions: function (regions) {
			return this._regionManager.addRegions(regions);
		},

		// Close all regions in the app, without removing them
		closeRegions: function () {
			this._regionManager.closeRegions();
		},

		// Removes a region from your app, by name
		// Accepts the regions name
		// removeRegion('myRegion')
		removeRegion: function (region) {
			this._regionManager.removeRegion(region);
		},

		// Provides alternative access to regions
		// Accepts the region name
		// getRegion('main')
		getRegion: function (region) {
			return this._regionManager.get(region);
		},

		// Create a module, attached to the application
		module: function (moduleNames, moduleDefinition) {

			// Overwrite the module class if the user specifies one
			var ModuleClass = Marionette.Module.getClass(moduleDefinition);

			// slice the args, and add this application object as the
			// first argument of the array
			var args = slice.call(arguments);
			args.unshift(this);

			// see the Marionette.Module object for more information
			return ModuleClass.create.apply(ModuleClass, args);
		},

		// Internal method to set up the region manager
		_initRegionManager: function () {
			this._regionManager = new Marionette.RegionManager();

			this.listenTo(this._regionManager, "region:add", function (name, region) {
				this[name] = region;
			});

			this.listenTo(this._regionManager, "region:remove", function (name, region) {
				delete this[name];
			});
		}
	});

	// Copy the `extend` function used by Backbone's classes
	Marionette.Application.extend = Marionette.extend;

	// Module
	// ------

	// A simple module system, used to create privacy and encapsulation in
	// Marionette applications
	Marionette.Module = function (moduleName, app, options) {
		this.moduleName = moduleName;
		this.options = _.extend({}, this.options, options);
		// Allow for a user to overide the initialize
		// for a given module instance.
		this.initialize = options.initialize || this.initialize;

		// Set up an internal store for sub-modules.
		this.submodules = {};

		this._setupInitializersAndFinalizers();

		// Set an internal reference to the app
		// within a module.
		this.app = app;

		// By default modules start with their parents.
		this.startWithParent = true;

		// Setup a proxy to the trigger method implementation.
		this.triggerMethod = Marionette.triggerMethod;

		if (_.isFunction(this.initialize)) {
			this.initialize(this.options, moduleName, app);
		}
	};

	Marionette.Module.extend = Marionette.extend;

	// Extend the Module prototype with events / listenTo, so that the module
	// can be used as an event aggregator or pub/sub.
	_.extend(Marionette.Module.prototype, Backbone.Events, {

		// Initialize is an empty function by default. Override it with your own
		// initialization logic when extending Marionette.Module.
		initialize: function () { },

		// Initializer for a specific module. Initializers are run when the
		// module's `start` method is called.
		addInitializer: function (callback) {
			this._initializerCallbacks.add(callback);
		},

		// Finalizers are run when a module is stopped. They are used to teardown
		// and finalize any variables, references, events and other code that the
		// module had set up.
		addFinalizer: function (callback) {
			this._finalizerCallbacks.add(callback);
		},

		// Start the module, and run all of its initializers
		start: function (options) {
			// Prevent re-starting a module that is already started
			if (this._isInitialized) { return; }

			// start the sub-modules (depth-first hierarchy)
			_.each(this.submodules, function (mod) {
				// check to see if we should start the sub-module with this parent
				if (mod.startWithParent) {
					mod.start(options);
				}
			});

			// run the callbacks to "start" the current module
			this.triggerMethod("before:start", options);

			this._initializerCallbacks.run(options, this);
			this._isInitialized = true;

			this.triggerMethod("start", options);
		},

		// Stop this module by running its finalizers and then stop all of
		// the sub-modules for this module
		stop: function () {
			// if we are not initialized, don't bother finalizing
			if (!this._isInitialized) { return; }
			this._isInitialized = false;

			Marionette.triggerMethod.call(this, "before:stop");

			// stop the sub-modules; depth-first, to make sure the
			// sub-modules are stopped / finalized before parents
			_.each(this.submodules, function (mod) { mod.stop(); });

			// run the finalizers
			this._finalizerCallbacks.run(undefined, this);

			// reset the initializers and finalizers
			this._initializerCallbacks.reset();
			this._finalizerCallbacks.reset();

			Marionette.triggerMethod.call(this, "stop");
		},

		// Configure the module with a definition function and any custom args
		// that are to be passed in to the definition function
		addDefinition: function (moduleDefinition, customArgs) {
			this._runModuleDefinition(moduleDefinition, customArgs);
		},

		// Internal method: run the module definition function with the correct
		// arguments
		_runModuleDefinition: function (definition, customArgs) {
			// If there is no definition short circut the method.
			if (!definition) { return; }

			// build the correct list of arguments for the module definition
			var args = _.flatten([
				this,
				this.app,
				Backbone,
				Marionette,
				Marionette.$, _,
				customArgs
			]);

			definition.apply(this, args);
		},

		// Internal method: set up new copies of initializers and finalizers.
		// Calling this method will wipe out all existing initializers and
		// finalizers.
		_setupInitializersAndFinalizers: function () {
			this._initializerCallbacks = new Marionette.Callbacks();
			this._finalizerCallbacks = new Marionette.Callbacks();
		}
	});

	// Type methods to create modules
	_.extend(Marionette.Module, {

		// Create a module, hanging off the app parameter as the parent object.
		create: function (app, moduleNames, moduleDefinition) {
			var module = app;

			// get the custom args passed in after the module definition and
			// get rid of the module name and definition function
			var customArgs = slice.call(arguments);
			customArgs.splice(0, 3);

			// Split the module names and get the number of submodules.
			// i.e. an example module name of `Doge.Wow.Amaze` would
			// then have the potential for 3 module definitions.
			moduleNames = moduleNames.split(".");
			var length = moduleNames.length;

			// store the module definition for the last module in the chain
			var moduleDefinitions = [];
			moduleDefinitions[length - 1] = moduleDefinition;

			// Loop through all the parts of the module definition
			_.each(moduleNames, function (moduleName, i) {
				var parentModule = module;
				module = this._getModule(parentModule, moduleName, app, moduleDefinition);
				this._addModuleDefinition(parentModule, module, moduleDefinitions[i], customArgs);
			}, this);

			// Return the last module in the definition chain
			return module;
		},

		_getModule: function (parentModule, moduleName, app, def, args) {
			var options = _.extend({}, def);
			var ModuleClass = this.getClass(def);

			// Get an existing module of this name if we have one
			var module = parentModule[moduleName];

			if (!module) {
				// Create a new module if we don't have one
				module = new ModuleClass(moduleName, app, options);
				parentModule[moduleName] = module;
				// store the module on the parent
				parentModule.submodules[moduleName] = module;
			}

			return module;
		},

		// ## Module Classes
		//
		// Module classes can be used as an alternative to the define pattern.
		// The extend function of a Module is identical to the extend functions
		// on other Backbone and Marionette classes.
		// This allows module lifecyle events like `onStart` and `onStop` to be called directly.
		getClass: function (moduleDefinition) {
			var ModuleClass = Marionette.Module;

			if (!moduleDefinition) {
				return ModuleClass;
			}

			// If all of the module's functionality is defined inside its class,
			// then the class can be passed in directly. `MyApp.module("Foo", FooModule)`.
			if (moduleDefinition.prototype instanceof ModuleClass) {
				return moduleDefinition;
			}

			return moduleDefinition.moduleClass || ModuleClass;
		},

		// Add the module definition and add a startWithParent initializer function.
		// This is complicated because module definitions are heavily overloaded
		// and support an anonymous function, module class, or options object
		_addModuleDefinition: function (parentModule, module, def, args) {
			var fn = this._getDefine(def);
			var startWithParent = this._getStartWithParent(def, module);

			if (fn) {
				module.addDefinition(fn, args);
			}

			this._addStartWithParent(parentModule, module, startWithParent);
		},

		_getStartWithParent: function (def, module) {
			var swp;

			if (_.isFunction(def) && (def.prototype instanceof Marionette.Module)) {
				swp = module.constructor.prototype.startWithParent;
				return _.isUndefined(swp) ? true : swp;
			}

			if (_.isObject(def)) {
				swp = def.startWithParent;
				return _.isUndefined(swp) ? true : swp;
			}

			return true;
		},

		_getDefine: function (def) {
			if (_.isFunction(def) && !(def.prototype instanceof Marionette.Module)) {
				return def;
			}

			if (_.isObject(def)) {
				return def.define;
			}

			return null;
		},

		_addStartWithParent: function (parentModule, module, startWithParent) {
			module.startWithParent = module.startWithParent && startWithParent;

			if (!module.startWithParent || !!module.startWithParentIsConfigured) {
				return;
			}

			module.startWithParentIsConfigured = true;

			parentModule.addInitializer(function (options) {
				if (module.startWithParent) {
					module.start(options);
				}
			});
		}
	});


	return Marionette;
})(this, Backbone, _);

(function () {
	var arrays, basicObjects, deepClone, deepExtend, deepExtendCouple, isBasicObject,
		__slice = [].slice;

	deepClone = function (obj) {
		var func, isArr;
		if (!_.isObject(obj) || _.isFunction(obj)) {
			return obj;
		}
		if (_.isDate(obj)) {
			return new Date(obj.getTime());
		}
		if (_.isRegExp(obj)) {
			return new RegExp(obj.source, obj.toString().replace(/.*\//, ""));
		}
		isArr = _.isArray(obj || _.isArguments(obj));
		func = function (memo, value, key) {
			if (isArr) {
				memo.push(deepClone(value));
			} else {
				memo[key] = deepClone(value);
			}
			return memo;
		};
		return _.reduce(obj, func, isArr ? [] : {});
	};

	isBasicObject = function (object) {
		return (object.prototype === {}.prototype || object.prototype === Object.prototype) && _.isObject(object) && !_.isArray(object) && !_.isFunction(object) && !_.isDate(object) && !_.isRegExp(object) && !_.isArguments(object);
	};

	basicObjects = function (object) {
		return _.filter(_.keys(object), function (key) {
			return isBasicObject(object[key]);
		});
	};

	arrays = function (object) {
		return _.filter(_.keys(object), function (key) {
			return _.isArray(object[key]);
		});
	};

	deepExtendCouple = function (destination, source, maxDepth) {
		var combine, recurse, sharedArrayKey, sharedArrayKeys, sharedObjectKey, sharedObjectKeys, _i, _j, _len, _len1;
		if (maxDepth == null) {
			maxDepth = 20;
		}
		if (maxDepth <= 0) {
			console.warn('_.deepExtend(): Maximum depth of recursion hit.');
			return _.extend(destination, source);
		}
		sharedObjectKeys = _.intersection(basicObjects(destination), basicObjects(source));
		recurse = function (key) {
			return source[key] = deepExtendCouple(destination[key], source[key], maxDepth - 1);
		};
		for (_i = 0, _len = sharedObjectKeys.length; _i < _len; _i++) {
			sharedObjectKey = sharedObjectKeys[_i];
			recurse(sharedObjectKey);
		}
		sharedArrayKeys = _.intersection(arrays(destination), arrays(source));
		combine = function (key) {
			return source[key] = _.union(destination[key], source[key]);
		};
		for (_j = 0, _len1 = sharedArrayKeys.length; _j < _len1; _j++) {
			sharedArrayKey = sharedArrayKeys[_j];
			combine(sharedArrayKey);
		}
		return _.extend(destination, source);
	};

	deepExtend = function () {
		var finalObj, maxDepth, objects, _i;
		objects = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), maxDepth = arguments[_i++];
		if (!_.isNumber(maxDepth)) {
			objects.push(maxDepth);
			maxDepth = 20;
		}
		if (objects.length <= 1) {
			return objects[0];
		}
		if (maxDepth <= 0) {
			return _.extend.apply(this, objects);
		}
		finalObj = objects.shift();
		while (objects.length > 0) {
			finalObj = deepExtendCouple(finalObj, deepClone(objects.shift()), maxDepth);
		}
		return finalObj;
	};

	_.mixin({
		deepClone: deepClone,
		isBasicObject: isBasicObject,
		basicObjects: basicObjects,
		arrays: arrays,
		deepExtend: deepExtend
	});

}).call(this);
/**
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.3.1
 */
; (function ($) { var h = $.scrollTo = function (a, b, c) { $(window).scrollTo(a, b, c) }; h.defaults = { axis: 'xy', duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1, limit: true }; h.window = function (a) { return $(window)._scrollable() }; $.fn._scrollable = function () { return this.map(function () { var a = this, isWin = !a.nodeName || $.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1; if (!isWin) return a; var b = (a.contentWindow || a).document || a.ownerDocument || a; return /webkit/i.test(navigator.userAgent) || b.compatMode == 'BackCompat' ? b.body : b.documentElement }) }; $.fn.scrollTo = function (e, f, g) { if (typeof f == 'object') { g = f; f = 0 } if (typeof g == 'function') g = { onAfter: g }; if (e == 'max') e = 9e9; g = $.extend({}, h.defaults, g); f = f || g.duration; g.queue = g.queue && g.axis.length > 1; if (g.queue) f /= 2; g.offset = both(g.offset); g.over = both(g.over); return this._scrollable().each(function () { if (e == null) return; var d = this, $elem = $(d), targ = e, toff, attr = {}, win = $elem.is('html,body'); switch (typeof targ) { case 'number': case 'string': if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)) { targ = both(targ); break } targ = $(targ, this); if (!targ.length) return; case 'object': if (targ.is || targ.style) toff = (targ = $(targ)).offset() }$.each(g.axis.split(''), function (i, a) { var b = a == 'x' ? 'Left' : 'Top', pos = b.toLowerCase(), key = 'scroll' + b, old = d[key], max = h.max(d, a); if (toff) { attr[key] = toff[pos] + (win ? 0 : old - $elem.offset()[pos]); if (g.margin) { attr[key] -= parseInt(targ.css('margin' + b)) || 0; attr[key] -= parseInt(targ.css('border' + b + 'Width')) || 0 } attr[key] += g.offset[pos] || 0; if (g.over[pos]) attr[key] += targ[a == 'x' ? 'width' : 'height']() * g.over[pos] } else { var c = targ[pos]; attr[key] = c.slice && c.slice(-1) == '%' ? parseFloat(c) / 100 * max : c } if (g.limit && /^\d+$/.test(attr[key])) attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max); if (!i && g.queue) { if (old != attr[key]) animate(g.onAfterFirst); delete attr[key] } }); animate(g.onAfter); function animate(a) { $elem.animate(attr, f, g.easing, a && function () { a.call(this, e, g) }) } }).end() }; h.max = function (a, b) { var c = b == 'x' ? 'Width' : 'Height', scroll = 'scroll' + c; if (!$(a).is('html,body')) return a[scroll] - $(a)[c.toLowerCase()](); var d = 'client' + c, html = a.ownerDocument.documentElement, body = a.ownerDocument.body; return Math.max(html[scroll], body[scroll]) - Math.min(html[d], body[d]) }; function both(a) { return typeof a == 'object' ? a : { top: a, left: a } } })(jQuery);
/*iPadフルスクリーンモード用リンク置換*/
$(function () {
	//ページ内のaタグ群を取得。aTagsに配列として代入。
	var aTags = $('a');
	//全てのaタグについて処理
	aTags.each(function () {
		//aタグのhref属性からリンク先url取得
		var url = $(this).attr('href');
		//念のため、href属性は削除
		$(this).removeAttr('href');
		//クリックイベントをバインド
		$(this).click(function () {
			location.href = url;
		});
	});

	/*メニューサブナビラベル*/
	$(".zone", "#lbl_navi-sub").mouseover(function () {
		$(this).css('opacity', '0.7');
		$(".zone a", "#navi-sub").addClass('ovr');
	});
	$(".zone", "#lbl_navi-sub").mouseout(function () {
		$(this).css('opacity', '1');
		$(".zone a", "#navi-sub").removeClass('ovr');
	});
	$(".list", "#lbl_navi-sub").mouseover(function () {
		$(this).css('opacity', '0.7');
		$(".list a", "#navi-sub").addClass('ovr');
	});
	$(".list", "#lbl_navi-sub").mouseout(function () {
		$(this).css('opacity', '1');
		$(".list a", "#navi-sub").removeClass('ovr');
	});
	$(".note", "#lbl_navi-sub").mouseover(function () {
		$(this).css('opacity', '0.7');
		$(".note a", "#navi-sub").addClass('ovr');
	});
	$(".note", "#lbl_navi-sub").mouseout(function () {
		$(this).css('opacity', '1');
		$(".note a", "#navi-sub").removeClass('ovr');
	});
	$(".permission", "#lbl_navi-sub").mouseover(function () {
		$(this).css('opacity', '0.7');
		$(".permission a", "#navi-sub").addClass('ovr');
	});
	$(".permission", "#lbl_navi-sub").mouseout(function () {
		$(this).css('opacity', '1');
		$(".permission a", "#navi-sub").removeClass('ovr');
	});
	$(".upload", "#lbl_navi-sub").mouseover(function () {
		$(this).css('opacity', '0.7');
		$(".upload a", "#navi-sub").addClass('ovr');
	});
	$(".upload", "#lbl_navi-sub").mouseout(function () {
		$(this).css('opacity', '1');
		$(".upload a", "#navi-sub").removeClass('ovr');
	});
});
var AMBPV0010Rsp = {
	AMBPV0010_TOTAL: 1,
	AMBPV0010_STORE: 2
};

var AMBPV0050Rsp = {
	AMBPV0050_TOTAL: 1,
	AMBPV0050_WEEK: 2,
	AMBPV0050_DAY: 3
};

var AMCMV0040_if = {
	AMCMV0040_REQ_SCH: 1,
	AMCMV0040_REQ_CSV: 101
};

var AMCMV0060_if = {
	AMCMV0060_REQ_SCH: 1,
	AMCMV0060_REQ_CSV: 101
};

var AMCMV0080_if = {
	AMCMV0080_REQ_SCH: 1,
	AMCMV0080_REQ_CSV: 101
};

var AMCPV0010CntPrc = {
	AMCPV0010_STATUS_NOT: 1,
	AMCPV0010_STATUS_INPUT: 2
};

var AMCPV0030Defs = {
	AMCPV0030_RECORD_TYPE_ITEM: 1,
	AMCPV0030_RECORD_TYPE_SUBTTL: 2,
	AMCPV0030_RECORD_TYPE_TTL: 3
};

var AMCPV0040Defs = {
	AMCPV0040_RECORD_TYPE_ITEM: 1,
	AMCPV0040_RECORD_TYPE_SUBTTL: 2,
	AMCPV0040_RECORD_TYPE_TTL: 3,
	AMCPV0040_ITEMRECORD_TYPE_QY: 1,
	AMCPV0040_ITEMRECORD_TYPE_RT: 2
};

var AMDLV0160Req = {
	AMDLV0160_SHIP_RETURN: 1,
	AMDLV0160_SHIP_TRANS: 2
};

var AMDSV0040Req = {
	AMDSV0040_GET_STORERANKPTN: 1,
	AMDSV0040_GET_BASESTOCKPTN: 2
};

var AMDSV0050Req = {
	AMDSV0050_RESULTTYPE_ITEM: 1,
	AMDSV0050_RESULTTYPE_STORE: 2
};

var AMDSV0060Req = {
	AMDSV0060_TYPE_ITEM: 1,
	AMDSV0060_TYPE_STORE: 2,
	AMDSV0060_TYPE_BASESTOCKPTN: 3,
	AMDSV0060_TYPE_STORERANK: 4
};

var AMDSV0100Req = {
	AMDSV0100_RESULTTYPE_ITEM: 1,
	AMDSV0100_RESULTTYPE_STORE: 2
};

var AMDSV0110Defs = {
	AMDSV0110_RESULTTYPE_ITEM: 1,
	AMDSV0110_RESULTTYPE_STORE: 2,
	AMDSV0110_RESULTTYPE_NEWOLD: 3,
	AMDSV0110_RESULTTYPE_SIZEITEM: 4,
	AMDSV0110_RESULTTYPE_SIZESTORE: 5,
	AMDSV0110_RESULTTYPE_SALESTOCK: 6,
	AMDSV0110_RESULTTYPE_SALESTOCKST: 7,
	AMDSV0110_STOREINFO_FLOOR: 1,
	AMDSV0110_STOREINFO_OPENYEAR: 2,
	AMDSV0110_STOREINFO_DISPNUM: 3,
	AMDSV0110_STOREINFO_SALE: 4,
	AMDSV0110_STOREINFO_EXIST: 5
};

var AMFUV0010_if = {
	AMFUV0010_REQ_SCH: 1
};

var AMMPV0010Req = {
	AMMPV0010_BASE_YEAR: 1,
	AMMPV0010_LAST_YEAR: 2,
	AMMPV0010_BASE_MONTH: 3,
	AMMPV0010_LAST_MONTH: 4,
	AMMPV0010_BASE_WEEK: 5,
	AMMPV0010_LAST_WEEK: 6
};

var AMMPV0020Req = {
	AMMPV0020_REQTYPE_SEASON: 1,
	AMMPV0020_REQTYPE_ATTR: 2,
	AMMPV0020_PLAN_AUTO: 1,
	AMMPV0020_PLAN_INPUT: 2,
	AMMPV0020_PARAM_CSV_SEASON: 1,
	AMMPV0020_PARAM_CSV_ATTR: 2,
	AMMPV0020_PARAM_CSV_SIZE: 3,
	AMMPV0020_CSV_SEASON: 4,
	AMMPV0020_CSV_ATTR: 5,
	AMMPV0020_CSV_SIZE: 6
};

var AMMPV0030Req = {
	AMMPV0030_CSVTYPE_BASE: 1,
	AMMPV0030_CSVTYPE_LAST: 2,
	AMMPV0030_CSV_ITEM: 1,
	AMMPV0030_CSV_SIZE: 2
};

var AMMPV0040Req = {
	AMMPV0040_PLAN_AUTO: 1,
	AMMPV0040_PLAN_INPUT: 2,
	AMMPV0040_CSV_WEEK: 1,
	AMMPV0040_CSV_STOCK: 2,
	AMMPV0040_CSV_STORE: 3,
	AMMPV0040_CSV_MONTH: 4,
	AMMPV0040_CSV_EFFICIENT: 5
};

var AMMPV0050Req = {
	AMMPV0050_CSVTYPE_BASE: 1,
	AMMPV0050_CSVTYPE_LAST: 2,
	AMMPV0050_CSV_PARAM: 1,
	AMMPV0050_CSV: 2
};

var AMRSV0010_if = {
	AMRSV0010_REQ_SCH: 1,
	AMRSV0010_REQ_CSV: 101
};

var AMRSV0030_if = {
	AMRSV0030_REQ_SCH: 1,
	AMRSV0030_REQ_CSV: 101
};

var AMRSV0050_if = {
	AMRSV0050_REQ_SCH: 1,
	AMRSV0050_REQ_CSV: 101
};

var AMRSV0070_if = {
	AMRSV0070_REQ_SCH: 1,
	AMRSV0070_REQ_CSV: 101
};

var AMRSV0090_if = {
	AMRSV0090_REQ_SCH: 1,
	AMRSV0090_REQ_CSV: 101
};

var AMRSV0100OutData = {
	AMRSV0100_REQ_XLS: 102
};

var AMRSV0100_if = {
	AMRSV0100_REQ_XLS: 102
};

var AMRSV0110_if = {
	AMRSV0110_REQ_XLS: 102
};

var AMRSV0120OutData = {
	AMRSV0120_REQ_XLS: 102
};

var AMRSV0120_if = {
	AMRSV0120_REQ_XLS: 102
};

var AMRSV0130OutData = {
	AMRSV0130_REQ_XLS: 102
};

var AMRSV0130_if = {
	AMRSV0130_REQ_XLS: 102
};

var am_pa_genlist_srch_if = {
	AM_PA_PROTO_SORT_KEY_NAME: 1,
	AM_PA_PROTO_SORT_KEY_FOPEN: 2,
	AM_PA_PROTO_SORT_KEY_UPDTIME: 3,
	AM_PA_PROTO_SORT_KEY_CRENAME: 4,
	AM_PA_PROTO_SORT_KEY_ELEMNUM: 5,
	AM_PA_PROTO_SORT_KEY_FLISTUSE: 6
};

var am_pa_item_srch_if = {
	AM_PA_PROTO_SORT_KEY_CODE: 1,
	AM_PA_PROTO_SORT_KEY_NAME: 2,
	AM_PA_PROTO_SORT_KEY_VCODE: 3,
	AM_PA_PROTO_SORT_KEY_VNAME: 4,
	AM_PA_PROTO_SORT_KEY_YEAR: 5
};

var am_pa_store_if = {
	AM_PA_PROTO_SORT_KEY_CODE: 1,
	AM_PA_PROTO_SORT_KEY_NAME: 2,
	AM_PA_DEFS_KIND_STORE: 102,
	AM_PA_STORE_ORG_KIND_HD: 1,
	AM_PA_STORE_ORG_KIND_CORP: 2,
	AM_PA_STORE_ORG_KIND_UNIT: 4,
	AM_PA_STORE_ORG_KIND_ZONE: 8,
	AM_PA_STORE_ORG_KIND_AREA: 16,
	AM_PA_STORE_ORG_KIND_STORE: 32,
	AM_PA_STORE_ORG_KIND_CENTER: 64,
	AM_PA_STORE_ORG_KIND_HQ: 128,
	AM_PA_STORE_ORG_KIND_OTHER: 16384
};

var am_proto_defs = {
	AMDB_DEFS_F_GENLIST_STORE: 1,
	AMDB_DEFS_F_GENLIST_ITEM: 2,
	AMDB_DEFS_F_GENLIST_MEMB: 3,
	AMDB_DEFS_F_GENLIST_ADDR: 4,
	AMDB_DEFS_F_GENLIST_MEMB_TMP: 13,
	AMDB_DEFS_HALF_PERIOD_FIRST: 1,
	AMDB_DEFS_HALF_PERIOD_SECOND: 2,
	AMDB_DEFS_QUARTER_PERIOD_FIRST: 1,
	AMDB_DEFS_QUARTER_PERIOD_SECOND: 2,
	AMDB_DEFS_QUARTER_PERIOD_THIRD: 3,
	AMDB_DEFS_QUARTER_PERIOD_FORTH: 4,
	AM_PROTO_COMMON_RSP_STATUS_OK: 0,
	AM_PROTO_COMMON_RSP_STATUS_NG: 1,
	AM_PROTO_COMMON_RTYPE_NEW: 1,
	AM_PROTO_COMMON_RTYPE_UPD: 2,
	AM_PROTO_COMMON_RTYPE_DEL: 3,
	AM_PROTO_COMMON_RTYPE_REL: 4,
	AM_PROTO_COMMON_RTYPE_CSV: 5,
	AM_PROTO_COMMON_RTYPE_CSV_INPUT: 6,
	AM_PROTO_COMMON_RTYPE_COPY: 7,
	AM_PROTO_COMMON_RTYPE_PDF: 8,
	AM_PROTO_COMMON_RTYPE_DELCANCEL: 9,
	AM_PROTO_COMMON_RTYPE_RSVCANCEL: 10,
	AM_PROTO_COMMON_RTYPE_TMPSAVE: 11,
	AM_PROTO_COMMON_RTYPE_APPLY: 12,
	AM_PROTO_COMMON_RTYPE_APPROVAL: 13,
	AM_PROTO_COMMON_RTYPE_PASSBACK: 14,
	AM_PROTO_ACTYPE_TEXT: 10,
	AM_PROTO_ACTYPE_NUMRANGE: 20,
	AM_PROTO_ACTYPE_NUMRANGE100: 21,
	AM_PROTO_ACTYPE_YMDRANGE: 30,
	AM_PROTO_ACTYPE_BIRTH_MONTH: 35,
	AM_PROTO_ACTYPE_ONOFF: 40,
	AM_PROTO_ACTYPE_TYPE: 50,
	AM_PROTO_ACTYPE_CDNAME: 51,
	AM_PROTO_ACTYPE_STAFFCDNAME: 52,
	AM_PROTO_ACTYPE_ORG: 60,
	AM_PROTO_ACTYPE_MARKETTYPE: 61,
	AM_PROTO_ACTYPE_AGETYPE: 62,
	AM_PROTO_CELL_TYPE_NUMBER: 10,
	AM_PROTO_CELL_TYPE_REAL: 11,
	AM_PROTO_CELL_TYPE_RATIO: 12,
	AM_PROTO_CELL_TYPE_YMD: 20,
	AM_PROTO_CELL_TYPE_STRING: 30,
	AM_PROTO_MEMBITEM_TYPE_TEXT: 1,
	AM_PROTO_MEMBITEM_TYPE_NUMBER: 2,
	AM_PROTO_MEMBITEM_TYPE_YMD: 3,
	AM_PROTO_MEMBITEM_TYPE_IYMD: 4,
	AM_PROTO_MEMBITEM_TYPE_REAL: 5,
	AM_PROTO_MEMBITEM_TYPE_ORGNAME: 6,
	AM_PROTO_MEMBITEM_TYPE_TYPE: 7
};

var am_proto_sort_req = {
	AM_PROTO_SORT_ORDER_ASCENDING: 1,
	AM_PROTO_SORT_ORDER_DESCENDING: -1
};

/******************************************************************************
 * * 説明  システムパラメータ定義
 *          Copyright (C) SURIGIKEN Co.,Ltd.  2013. All rights reserved.
 ******************************************************************************/
var amcm_sysparams = {

	// 01.営業計画
	PAR_AMBP_DAYOPERPLAN_ALARM_MDAY: 'PAR_AMBP_DAYOPERPLAN_ALARM_MDAY',	// 店舗日別計画未入力アラーム出力基準日(前月XX日)
	PAR_AMBP_APPLY_CANCEL_DAYS: 'PAR_AMBP_APPLY_CANCEL_DAYS',	// 申請取消期間

	// 05.マスタ管理
	PAR_AMMS_UNITID_TOP: 'PAR_AMMS_UNITID_TOP',	// 標準ツリーのトップ組織ID
	PAR_AMMS_CORPID_AOKI: 'PAR_AMMS_CORPID_AOKI',	// 会社(AOKI)の組織ID
	PAR_AMMS_UNITID_AOKI: 'PAR_AMMS_UNITID_AOKI',	// 事業ユニット(AOKI)の組織ID
	PAR_AMMS_UNITID_ORI: 'PAR_AMMS_UNITID_ORI',	// 事業ユニット(ORIHICA)の組織ID
	PAR_AMMS_ORG_PRICE: 'PAR_AMMS_ORG_PRICE',	// 組織別上代設定の可否
	PAR_AMMS_AGG_SEASON: 'PAR_AMMS_AGG_SEASON',	// 集約シーズン区分の定義
	PAR_AMMS_DEFAULT_ITGRP_FUNCID: 'PAR_AMMS_DEFAULT_ITGRP_FUNCID',	// 標準商品分類体系
	PAR_AMMS_DEFAULT_ORG_FUNCID: 'PAR_AMMS_DEFAULT_ORG_FUNCID',	// 標準組織体系
	PAR_AMMS_STORE_LEVELID: 'PAR_AMMS_STORE_LEVELID',	// "店舗"の階層ＩＤ
	PAR_AMMS_AREA_LEVELID: 'PAR_AMMS_AREA_LEVELID',	// "エリア"の階層ＩＤ
	PAR_AMMS_ZONE_LEVELID: 'PAR_AMMS_ZONE_LEVELID',	// "ゾーン"の階層ＩＤ
	PAR_AMMS_UNIT_LEVELID: 'PAR_AMMS_UNIT_LEVELID',	// "事業ユニット"の階層ＩＤ
	PAR_AMMS_COMPANY_LEVELID: 'PAR_AMMS_COMPANY_LEVELID',	// "会社"の階層ＩＤ
	PAR_AMMS_HD_LEVELID: 'PAR_AMMS_HD_LEVELID',	// "ＨＤ"の階層ＩＤ
	PAR_AMMS_APPROVELIST_MAX: 'PAR_AMMS_APPROVELIST_MAX',	// 商品マスタ・発注承認画面の出力最大件数
	PAR_AMMS_UNIT_ALTCD_5: 'PAR_AMMS_UNIT_ALTCD_5',	// 事業ユニット(AOKI)の別コード。サブクラスコード先頭に使用。キーの末端は事業ユニットIDになる
	PAR_AMMS_UNIT_ALTCD_6: 'PAR_AMMS_UNIT_ALTCD_6',	// 事業ユニット(ORIHICA)の別コード。サブクラスコード先頭に使用。キーの末端は事業ユニットIDになる
	PAR_AMMS_UNIT_STOREROLE_5: 'PAR_AMMS_UNIT_STOREROLE_5',	// 事業ユニット(AOKI)の店舗ユーザのロールID。キーの末端は事業ユニットIDになる
	PAR_AMMS_UNIT_STOREROLE_6: 'PAR_AMMS_UNIT_STOREROLE_6',	// 事業ユニット(ORIHICA)の店舗ユーザのロールID。キーの末端は事業ユニットIDになる
	PAR_AMMS_SMX_CATALOG_ITGRP_CODES: 'PAR_AMMS_SMX_CATALOG_ITGRP_CODES',	// 商品台帳取込で、区分3(SMXカタログ)の対象となる品種コード群

	// 13.振分
	PAR_AMDS_NEWSTORE_DAYS: 'PAR_AMDS_NEWSTORE_DAYS',	// 主に、振分時に新店取り置き用在庫を引き当てるために利用する定義。開店日からこの日数まで新店。それ以降は、既存店。

	// 14.入荷・出荷・返品
	PAR_AMDL_UNIQUE_DELIVER_NO_TERM: 'PAR_AMDL_UNIQUE_DELIVER_NO_TERM',	// 入荷伝票の番号は、同一の取引先、店舗で、90日以内では唯一。

	// 16.補正
	PAR_AMRS_OFFSETITEM_ID: 'PAR_AMRS_OFFSETITEM_ID',	// AOKIの補正相殺項目「SPC溶剤使用料」のID
	PAR_AMRS_ADJUSTITEM_SONOTA_CODE: 'PAR_AMRS_ADJUSTITEM_SONOTA_CODE',	// 補正項目マスタ「その他」のコード
	PAR_AMRS_ADJUSTITEM_KANNAI_CODE: 'PAR_AMRS_ADJUSTITEM_KANNAI_CODE',	// 補正項目マスタ「館内」のコード

	// 17.移動
	PAR_AMTR_SLIPSRCH_STDATE: 'PAR_AMTR_SLIPSRCH_STDATE',	// 移動エラーチェック対象伝票の検索期間開始日

	// 17.営業帳票
	PAR_AMBR_ABC_THRESHOLD_A: 'PAR_AMBR_ABC_THRESHOLD_A',	// ABC分析閾値（Ａランク）。パーセンテージを数値で設定する。
	PAR_AMBR_ABC_THRESHOLD_B: 'PAR_AMBR_ABC_THRESHOLD_B',	// ABC分析閾値（Ｂランク）。パーセンテージを数値で設定する。
	PAR_AMBR_STOREPLSHEET_ST_YYYYMM: 'PAR_AMBR_STOREPLSHEET_ST_YYYYMM',	// 店舗損益管理照会の対象月の開始年月
	PAR_AMBR_LEVELUPSHEET_ST_YYYYMM: 'PAR_AMBR_LEVELUPSHEET_ST_YYYYMM',	// 担当者別販売力レベルアップシート出力の対象期間・月報の開始年月

	// 28.PO
	PAR_AMPO_CUSTSRCH_PATH: 'PAR_AMPO_CUSTSRCH_PATH',	// 顧客情報取得のためのPATH
	PAR_AMPO_CUSTGET_PATH: 'PAR_AMPO_CUSTGET_PATH',	// 会員情報取得のためのPATH

	// 29.備品管理
	PAR_AMEQ_ORDER_INTERSPACE: 'PAR_AMEQ_ORDER_INTERSPACE',	// 備品に対する発注がある場合の警告表示するための発注間隔。随時で締められた場合、店舗は重複して発注する恐れがあるため。

	// 30.商品・在庫照会
	PAR_AMSI_DTLSEARCH_MAXREC: 'PAR_AMSI_DTLSEARCH_MAXREC',	// 詳細条件検索時の最大結果件数

	// 32.プライス別棚卸
	PAR_AMCP_ITEM_ATTRS: 'PAR_AMCP_ITEM_ATTRS',	// 商品属性に指定できる値の個数

	// 98.共通
	PAR_AMCM_PORTAL_NOTICES: 'PAR_AMCM_PORTAL_NOTICES',	// ポータル画面に表示する通知の個数
	PAR_AMCM_PORTAL_ALARMS: 'PAR_AMCM_PORTAL_ALARMS',	// ポータル画面に表示するアラームの個数
	PAR_AMCM_PORTAL_HHTNOTICES: 'PAR_AMCM_PORTAL_HHTNOTICES',	// ポータル画面に表示するHHT通知の個数
	PAR_AMCM_DAYS_UNTIL_LIMIT: 'PAR_AMCM_DAYS_UNTIL_LIMIT',	// 期限までの日数
	PAR_AMCM_YEAR_FROM: 'PAR_AMCM_YEAR_FROM',	// 年のコンボボックスで何年前からを表示するかのパラメータ
	PAR_AMCM_YEAR_TO: 'PAR_AMCM_YEAR_TO',	// 年のコンボボックスで何年後までを表示するかのパラメータ
	PAR_AMCM_ORG_MAX: 'PAR_AMCM_ORG_MAX',	// ユーザに設定可能な所属組織の最大値
	PAR_AMCM_ROLE_MAX: 'PAR_AMCM_ROLE_MAX',	// ユーザに設定可能な権限の最大値
	PAR_AMCM_PASSWD_DAYS: 'PAR_AMCM_PASSWD_DAYS',	// ログインパスワードの有効期限(日数)
	PAR_AMCM_LIMIT_SIZE_IMG: 'PAR_AMCM_LIMIT_SIZE_IMG',	// アップロードファイル（画像）の上限サイズは1M
	PAR_AMCM_LIMIT_SIZE_ATTACH: 'PAR_AMCM_LIMIT_SIZE_ATTACH',	// アップロードファイル（添付）の上限サイズは3M
	PAR_AMCM_LIMIT_SIZE_CSV: 'PAR_AMCM_LIMIT_SIZE_CSV',	// アップロードファイル（CSV）の上限サイズは1M
	PAR_AMCM_LIMIT_SIZE_GEN: 'PAR_AMCM_LIMIT_SIZE_GEN',	// アップロードファイル（その他）の上限サイズは1M
	PAR_AMCM_NOTICE_DATE_CHG_PASSWD: 'PAR_AMCM_NOTICE_DATE_CHG_PASSWD',	// ログインパスワードの変更通知日
	PAR_AMCM_LOGIN_SESSION_EXPIRE_MIN: 'PAR_AMCM_LOGIN_SESSION_EXPIRE_MIN',	// ログインセッション失効時間(分)
	PAR_AMCM_YEAR_ST_MMDD: 'PAR_AMCM_YEAR_ST_MMDD',	// 年度開始月日(MMDD)
	PAR_AMCM_YEAR_ED_MMDD: 'PAR_AMCM_YEAR_ED_MMDD',	// 年度終了月日(MMDD)
	PAR_AMCM_HALF_PERIOD_FIRST_ST_MMDD: 'PAR_AMCM_HALF_PERIOD_FIRST_ST_MMDD',	// 上半期開始月日(MMDD)
	PAR_AMCM_HALF_PERIOD_FIRST_ED_MMDD: 'PAR_AMCM_HALF_PERIOD_FIRST_ED_MMDD',	// 上半期終了月日(MMDD)
	PAR_AMCM_HALF_PERIOD_SECOND_ST_MMDD: 'PAR_AMCM_HALF_PERIOD_SECOND_ST_MMDD',	// 下半期開始月日(MMDD)
	PAR_AMCM_HALF_PERIOD_SECOND_ED_MMDD: 'PAR_AMCM_HALF_PERIOD_SECOND_ED_MMDD',	// 下半期終了月日(MMDD)
	PAR_AMCM_QUARTER_PERIOD_FIRST_ST_MMDD: 'PAR_AMCM_QUARTER_PERIOD_FIRST_ST_MMDD',	// 第１四半期開始月日(MMDD)
	PAR_AMCM_QUARTER_PERIOD_FIRST_ED_MMDD: 'PAR_AMCM_QUARTER_PERIOD_FIRST_ED_MMDD',	// 第１四半期終了月日(MMDD)
	PAR_AMCM_QUARTER_PERIOD_SECOND_ST_MMDD: 'PAR_AMCM_QUARTER_PERIOD_SECOND_ST_MMDD',	// 第２四半期開始月日(MMDD)
	PAR_AMCM_QUARTER_PERIOD_SECOND_ED_MMDD: 'PAR_AMCM_QUARTER_PERIOD_SECOND_ED_MMDD',	// 第２四半期終了月日(MMDD)
	PAR_AMCM_QUARTER_PERIOD_THIRD_ST_MMDD: 'PAR_AMCM_QUARTER_PERIOD_THIRD_ST_MMDD',	// 第３四半期開始月日(MMDD)
	PAR_AMCM_QUARTER_PERIOD_THIRD_ED_MMDD: 'PAR_AMCM_QUARTER_PERIOD_THIRD_ED_MMDD',	// 第３四半期終了月日(MMDD)
	PAR_AMCM_QUARTER_PERIOD_FORTH_ST_MMDD: 'PAR_AMCM_QUARTER_PERIOD_FORTH_ST_MMDD',	// 第４四半期開始月日(MMDD)
	PAR_AMCM_QUARTER_PERIOD_FORTH_ED_MMDD: 'PAR_AMCM_QUARTER_PERIOD_FORTH_ED_MMDD',	// 第４四半期終了月日(MMDD)
	PAR_AMCM_SRCH_RESULT_MAX: 'PAR_AMCM_SRCH_RESULT_MAX',	// 組織コード変更最大数(旧組織ID より 新組織ID までつながりの最大数)
	PAR_AMCM_GENLIST_IDARRAY_MAX: 'PAR_AMCM_GENLIST_IDARRAY_MAX',	// 組織マスタの最大ランク
	PAR_AMCM_ORGANIZE_MAXRANK: 'PAR_AMCM_ORGANIZE_MAXRANK',	// 汎用リスト順序保持最大要素数
	PAR_AMCM_ORGID_CHAIN_MAX: 'PAR_AMCM_ORGID_CHAIN_MAX',	// 検索画面出力結果最大数
	PAR_AMCM_LOGIN_LOCK_COUNT: 'PAR_AMCM_LOGIN_LOCK_COUNT',	// アカウントがロックされる連続失敗回数
	PAR_AMCM_ALARM_SEARCH_DAYS_FROM: 'PAR_AMCM_ALARM_SEARCH_DAYS_FROM',	// アラーム一覧、評価減アラーム一覧の期限from：運用日N日前

	// 05.マスタ管理
	PAR_AMMS_UNITID_HD: 'PAR_AMMS_UNITID_HD',	// 事業ユニット(AOKI-HD)の組織ID

	// 24.会計・経理
	PAR_AMAC_SLIP_PRICE: 'PAR_AMAC_SLIP_PRICE',	// ＥＤＩ伝票行数の単価

	// 33.移動サジェスチョン
	PAR_AMTS_UPPER_ITGRP: 'PAR_AMTS_UPPER_ITGRP',	// ボトム率を計算する際に、上着としてカウントされる品種のID群
	PAR_AMTS_BOTTOM_ITGRP: 'PAR_AMTS_BOTTOM_ITGRP',	// ボトム率を計算する際に、パンツ・スカートとしてカウントされる品種のID群

	// 21.不良品
	PAR_AMIG_PROCCESS_AT_SC: 'PAR_AMIG_PROCCESS_AT_SC',	// SCで不良品処理するときの、組織IDと不良理由区分IDのリスト

	// 33.移動サジェスチョン
	PAR_AMTS_PANTS_ITGRP: 'PAR_AMTS_PANTS_ITGRP',	// パンツ率を計算する際に、パンツとしてカウントされる品種のID群
	PAR_AMTS_SKIRT_ITGRP: 'PAR_AMTS_SKIRT_ITGRP',	// スカート率を計算する際に、スカートとしてカウントされる品種のID群

	// 98.共通
	PAR_AMCM_DEFAULT_ADDR1: 'PAR_AMCM_DEFAULT_ADDR1',	// 住所１のプレースホルダー
	PAR_AMCM_DEFAULT_ADDR2: 'PAR_AMCM_DEFAULT_ADDR2',	// 住所２のプレースホルダー
	PAR_AMCM_DEFAULT_ADDR3: 'PAR_AMCM_DEFAULT_ADDR3',	// 住所３のプレースホルダー
	PAR_AMCM_EXCEL_RECORDS_MAX: 'PAR_AMCM_EXCEL_RECORDS_MAX',	// 作成するExcelファイルの最大レコード数

	// 05.マスタ管理
	PAR_AMMS_TAG_VENDOR_TENTAC: 'PAR_AMMS_TAG_VENDOR_TENTAC',	// タグデータ（ORIHICA)IFでの、テンタックのコード
	PAR_AMMS_TAG_VENDOR_SATO: 'PAR_AMMS_TAG_VENDOR_SATO',	// タグデータ（ORIHICA)IFでの、さとーのコード

	// 98.共通
	PAR_AMCM_DEFAULT_PERCENT: 'PAR_AMCM_DEFAULT_PERCENT',	// パーセント（整数のみ）のプレースホルダー
	PAR_AMCM_DEFAULT_PERCENT_DECIMAL: 'PAR_AMCM_DEFAULT_PERCENT_DECIMAL',	// パーセント（小数点あり）のプレースホルダー
	PAR_AMCM_DEFAULT_POSTAL_NUMBER: 'PAR_AMCM_DEFAULT_POSTAL_NUMBER',	// 郵便番号のプレースホルダー
	PAR_AMCM_DEFAULT_PERCENT_DECIMAL2: 'PAR_AMCM_DEFAULT_PERCENT_DECIMAL2',	// パーセント（小数点以下２桁）のプレースホルダー

	// 26.商品情報分析
	PAR_AMGA_AXIS_MAX_ELEM: 'PAR_AMGA_AXIS_MAX_ELEM',	// 縦軸、または横軸の最大要素数
	PAR_AMGA_AXIS_MAX_CELL: 'PAR_AMGA_AXIS_MAX_CELL',	// 分析最大セル数
	PAR_AMGA_AXIS_MAX_CELL_IN_PAGE: 'PAR_AMGA_AXIS_MAX_CELL_IN_PAGE',	// 分析ページ内最大セル数
	PAR_AMGA_AXIS_MAX_LINE: 'PAR_AMGA_AXIS_MAX_LINE',	// 分析表示行数
	PAR_AMGA_ACTIVE_BITSET_SPLIT: 'PAR_AMGA_ACTIVE_BITSET_SPLIT',	// 購入会員ビットセット分割量
	PAR_AMGA_ACTIVE_BITSET_ALLOCMAX: 'PAR_AMGA_ACTIVE_BITSET_ALLOCMAX',	// 購入会員ビットセット最大メモリ量
	PAR_AMGA_MEMB_CARD_CHAIN_MAX: 'PAR_AMGA_MEMB_CARD_CHAIN_MAX',	// 新カード最大数（旧カードＩＤより新カードＩＤまで繋がりの最大数）
	PAR_AMGA_GENLIST_ID_ARRAY_MAX: 'PAR_AMGA_GENLIST_ID_ARRAY_MAX',	// 汎用リスト順序保持最大要素数
	PAR_AMGA_PERIOD_FROM_DAYS: 'PAR_AMGA_PERIOD_FROM_DAYS',	// 分析期間範囲：運用日からの過去日数
	PAR_AMGA_PERIOD_TO_DAYS: 'PAR_AMGA_PERIOD_TO_DAYS',	// 分析期間範囲：運用日からの未来日数
	PAR_AMGA_V_AXIS_MAX: 'PAR_AMGA_V_AXIS_MAX',	// Excel出力最大縦軸数
	PAR_AMGA_H_AXIS_MAX: 'PAR_AMGA_H_AXIS_MAX',	// Excel出力最大横軸数

	// 98.共通
	PAR_AMCM_AUTOCOMPLETE_MAX: 'PAR_AMCM_AUTOCOMPLETE_MAX',	// オートコンプリート候補返却最大数
	PAR_AMCM_SVF_DELIMITER: 'PAR_AMCM_SVF_DELIMITER',	// SVFに渡す改行文字

	// 24.会計・経理
	PAR_AMAC_VENDOR_MAX: 'PAR_AMAC_VENDOR_MAX',	// 検収通知書で一度に処理可能な最大取引先数
	PAR_AMAC_EXCEL_RECORDS_MAX: 'PAR_AMAC_EXCEL_RECORDS_MAX',	// 検収通知書で作成するExcelファイルの最大レコード数
	PAR_AMAC_TOTAL_EXCEL_RECORDS_MAX: 'PAR_AMAC_TOTAL_EXCEL_RECORDS_MAX',	// 検収通知書で作成する全Excelファイルのトータル最大レコード数

	// 98.共通
	PAR_AMCM_CENTER_CODE_LIST: 'PAR_AMCM_CENTER_CODE_LIST',	// 内部処理用センタコードと外部向けセンタコードとの対応表

	// 32.プライス別棚卸
	PAR_AMCP_RATIO_ITGRP: 'PAR_AMCP_RATIO_ITGRP',	// 関連率を表示する品種

	// 23.在庫
	PAR_AMST_ITGRP_OTHER: 'PAR_AMST_ITGRP_OTHER',	// その他商品受払表の対象品種ID
	PAR_AMST_SUBCLASS_OMIT_OTHER: 'PAR_AMST_SUBCLASS_OMIT_OTHER',	// その他商品受払表の除外サブクラスID

	// 98.共通
	PAR_AMCM_UNIFICATION_LIST: 'PAR_AMCM_UNIFICATION_LIST',	// 統括定義のパラメータキーリスト
	PAR_AMCM_UNIFICATION_AOKI_EAST: 'PAR_AMCM_UNIFICATION_AOKI_EAST',	// 統括定義：ＡＯＫＩ東日本
	PAR_AMCM_UNIFICATION_AOKI_NORTH: 'PAR_AMCM_UNIFICATION_AOKI_NORTH',	// 統括定義：ＡＯＫＩ北日本
	PAR_AMCM_UNIFICATION_AOKI_EAST1: 'PAR_AMCM_UNIFICATION_AOKI_EAST1',	// 統括定義：ＡＯＫＩ東日本①
	PAR_AMCM_UNIFICATION_AOKI_EAST2: 'PAR_AMCM_UNIFICATION_AOKI_EAST2',	// 統括定義：ＡＯＫＩ東日本②
	PAR_AMCM_UNIFICATION_AOKI_MID1: 'PAR_AMCM_UNIFICATION_AOKI_MID1',	// 統括定義：ＡＯＫＩ中日本①
	PAR_AMCM_UNIFICATION_AOKI_MID2: 'PAR_AMCM_UNIFICATION_AOKI_MID2',	// 統括定義：ＡＯＫＩ中日本②
	PAR_AMCM_UNIFICATION_AOKI_WEST: 'PAR_AMCM_UNIFICATION_AOKI_WEST',	// 統括定義：ＡＯＫＩ西日本
	PAR_AMCM_UNIFICATION_ORI_EAST: 'PAR_AMCM_UNIFICATION_ORI_EAST',	// 統括定義：ＯＲＩ東日本
	PAR_AMCM_UNIFICATION_ORI_WEST: 'PAR_AMCM_UNIFICATION_ORI_WEST',	// 統括定義：ＯＲＩ西日本

	// 05.マスタ管理
	PAR_AMMS_COSTITEM_DECIMAL2: 'PAR_AMMS_COSTITEM_DECIMAL2',	// 下代構成で小数以下を入力する項目

	// 98.共通
	PAR_AMCM_TYPE_SEQ: 'PAR_AMCM_TYPE_SEQ',	// 区分の並び
	PAR_AMCM_HT_SLIP_CHECK_DAYS: 'PAR_AMCM_HT_SLIP_CHECK_DAYS',	// HT取込で伝票番号の重複を見る期間

	// 05.マスタ管理
	PAR_AMMS_PLAN_SEASON: 'PAR_AMMS_PLAN_SEASON',	// 計画シーズン区分の定義

	// 20.評価減
	PAR_AMWD_OMIT_ITGRP: 'PAR_AMWD_OMIT_ITGRP',	// 評価減対象外品種

	// 29.備品管理
	PAR_AMEQ_TANOMAIL_URL: 'PAR_AMEQ_TANOMAIL_URL',	// たのメールURL

	// 98.共通
	PAR_AMCM_MDSYSTEM_STDATE: 'PAR_AMCM_MDSYSTEM_STDATE',	// 次世代MDシステムの稼動日
	PAR_AMCM_FULLSTOCK_DAYS: 'PAR_AMCM_FULLSTOCK_DAYS',	// 在庫がフルで入っている直近日数

	// 32.プライス別棚卸
	PAR_AMCP_CUST_SEG: 'PAR_AMCP_CUST_SEG',	// 客層

	// 20.評価減
	PAR_AMWD_AGE_LOGIC: 'PAR_AMWD_AGE_LOGIC',	// 年令計算ロジック

	// 98.共通
	PAR_AMCM_NET_STORE_CODE: 'PAR_AMCM_NET_STORE_CODE',	// ＩＮ通販店舗コード

	// 15.売上
	PAR_AMAS_AMASV0120_SUM_DIV: 'PAR_AMAS_AMASV0120_SUM_DIV',	// 客数客単価推移表での部門集約情報

	// 13.振分
	PAR_AMDS_NEWSTORE_IDS: 'PAR_AMDS_NEWSTORE_IDS',	// 強制的に新店発注として、発注データ・出荷指示データを送信する対象店舗

	// 21.不良品
	PAR_AMIG_PROFIT_REFLECT_DIVIDE_AOKI: 'PAR_AMIG_PROFIT_REFLECT_DIVIDE_AOKI',	// 顧客への不良品IFで、評価減が本部反映の場合の店舗コード(AOKI)
	PAR_AMIG_PROFIT_REFLECT_DIVIDE_ORI: 'PAR_AMIG_PROFIT_REFLECT_DIVIDE_ORI',	// 顧客への不良品IFで、評価減が本部反映の場合の店舗コード(ORIHICA)

	// 98.共通
	PAR_AMCM_OEI_SYSTEM_CODE: 'PAR_AMCM_OEI_SYSTEM_CODE',	// SSOシステムコード
	PAR_AMCM_OEI_SYSTEM_PASSWD: 'PAR_AMCM_OEI_SYSTEM_PASSWD',	// SSOシステムパスワード
	PAR_AMCM_SIZEPTN_SORT_COL_ROW: 'PAR_AMCM_SIZEPTN_SORT_COL_ROW',	// 列、行をソートキーとするサイズパターン
	PAR_AMCM_FLOATING_ERR_DISP_NUM: 'PAR_AMCM_FLOATING_ERR_DISP_NUM',	// フローティングエラーメッセージ表示件数
	PAR_AMCM_KEISEN_AOKI: 'PAR_AMCM_KEISEN_AOKI',	// AOKI経戦組織コード
	PAR_AMCM_KEISEN_ORI: 'PAR_AMCM_KEISEN_ORI',	// ORI経戦組織コード

	// 27.営業帳票
	PAR_AMBR_SURPLUS_TARGET_DAYS: 'PAR_AMBR_SURPLUS_TARGET_DAYS',	// 逆ロス対象期間

	_out: 'end of amcm_sysparams//'
};

/******************************************************************************
 *
 * 説明  区分定義
 *
 *          Copyright (C) SURIGIKEN Co.,Ltd.  2013. All rights reserved.
 ******************************************************************************/
var amcm_type = {

	/*
	 * 組織階層区分
	 */
	AMCM_TYPE_ORG_LEVEL: 1,
	AMCM_VAL_ORG_LEVEL_HD: 1,		// ＨＤ
	AMCM_VAL_ORG_LEVEL_CORP: 2,		// 会社
	AMCM_VAL_ORG_LEVEL_UNIT: 3,		// 事業ユニット
	AMCM_VAL_ORG_LEVEL_ZONE: 4,		// 地区
	AMCM_VAL_ORG_LEVEL_AREA: 5,		// ゾーン
	AMCM_VAL_ORG_LEVEL_BU: 6,		// 店舗・部
	AMCM_VAL_ORG_LEVEL_OTHER: 99,		// その他

	/*
	 * 組織区分
	 */
	AMCM_TYPE_ORG_KIND: 2,
	AMCM_VAL_ORG_KIND_HD: 1,		// HD
	AMCM_VAL_ORG_KIND_CORP: 2,		// 会社
	AMCM_VAL_ORG_KIND_UNIT: 3,		// 事業ユニット
	AMCM_VAL_ORG_KIND_ZONE: 4,		// 地区
	AMCM_VAL_ORG_KIND_AREA: 5,		// ゾーン
	AMCM_VAL_ORG_KIND_STORE: 6,		// 店舗
	AMCM_VAL_ORG_KIND_CENTER: 7,		// 倉庫
	AMCM_VAL_ORG_KIND_HQ: 8,		// 本部部署
	AMCM_VAL_ORG_KIND_OTHER: 99,		// その他

	/*
	 * 店舗タイプ区分
	 */
	AMCM_TYPE_STORE: 3,
	AMCM_VAL_STORE_TERMINAL: 1,		// ターミナル
	AMCM_VAL_STORE_URBAN: 2,		// 郊外（都市部）
	AMCM_VAL_STORE_LOCAL: 3,		// 郊外（地方）
	AMCM_VAL_STORE_STREET: 4,		// 商店街
	AMCM_VAL_STORE_INMALL: 5,		// インモール
	AMCM_VAL_STORE_OPENMALL: 6,		// オープンモール
	AMCM_VAL_STORE_OTHER: 99,		// その他

	/*
	 * シーズン区分
	 */
	AMCM_TYPE_SEASON: 4,
	AMCM_VAL_SEASON_AW: 1,		// 秋冬
	AMCM_VAL_SEASON_SPRING: 2,		// 春
	AMCM_VAL_SEASON_SUMMER: 3,		// 夏
	AMCM_VAL_SEASON_AUTUMN: 4,		// 秋
	AMCM_VAL_SEASON_WINTER: 5,		// 冬
	AMCM_VAL_SEASON_SS: 6,		// 春夏
	AMCM_VAL_SEASON_ALL: 9,		// オールシーズン

	/*
	 * サブシーズン区分
	 */
	AMCM_TYPE_SUBSEASON: 5,
	AMCM_VAL_SUBSEASON_AW: 1,		// 秋冬
	AMCM_VAL_SUBSEASON_SS: 2,		// 春夏

	/*
	 * 取引先区分
	 */
	AMCM_TYPE_VENDOR: 6,
	AMCM_VAL_VENDOR_MAKER: 1,		// メーカー
	AMCM_VAL_VENDOR_TAGISSUE: 2,		// タグ印刷業者
	AMCM_VAL_VENDOR_CORRECT: 3,		// 補正業者
	AMCM_VAL_VENDOR_HANGER: 4,		// リサイクルハンガー送付先
	AMCM_VAL_VENDOR_WOOLECO: 5,		// ウールエコ送付先
	AMCM_VAL_VENDOR_CUSTENTRY: 6,		// 顧客情報登録業者

	/*
	 * BSC区分
	 */
	AMCM_TYPE_BSC: 7,
	AMCM_VAL_BSC_SATO_NONE: 1,		// サトー（JCA)／受信なし
	AMCM_VAL_BSC_JCA_JCA: 2,		// ＪＣＡ／ＪＣＡ
	AMCM_VAL_BSC_GV_GV: 3,		// ＧＶ／ＧＶ
	AMCM_VAL_BSC_JCA_GV: 4,		// ＪＣＡ／ＧＶ

	/*
	 * タグデータ送信先区分
	 */
	AMCM_TYPE_TAGSEND: 8,
	AMCM_VAL_TAGSEND_JCA: 1,		// ＪＣＡ
	AMCM_VAL_TAGSEND_WEB: 2,		// Ｗｅｂ
	AMCM_VAL_TAGSEND_TENTAC: 8,		// テンタック
	AMCM_VAL_TAGSEND_SATO: 9,		// サトー

	/*
	 * 基本料課金区分
	 */
	AMCM_TYPE_BASICCHARGE: 9,
	AMCM_VAL_BASICCHARGE_DO: 1,		// あり
	AMCM_VAL_BASICCHARGE_NONE: 2,		// なし

	/*
	 * 取引先住所区分
	 */
	AMCM_TYPE_VENDOR_ADDR: 10,
	AMCM_VAL_VENDOR_ADDR_OPER: 1,		// 営業
	AMCM_VAL_VENDOR_ADDR_ACCOUNT: 2,		// 経理
	AMCM_VAL_VENDOR_ADDR_RETURN: 3,		// 返品先

	/*
	 * 商品分類階層区分
	 */
	AMCM_TYPE_ITGRP_LEVEL: 11,
	AMCM_VAL_ITGRP_LEVEL_CORP: 1,		// 会社
	AMCM_VAL_ITGRP_LEVEL_UNIT: 2,		// 事業ユニット
	AMCM_VAL_ITGRP_LEVEL_DIV: 3,		// 部門
	AMCM_VAL_ITGRP_LEVEL_CTG: 4,		// 品種
	AMCM_VAL_ITGRP_LEVEL_ITEM: 5,		// 商品
	AMCM_VAL_ITGRP_LEVEL_COLORSIZEITEM: 6,		// カラーサイズ商品(分析用)
	AMCM_VAL_ITGRP_LEVEL_OTHER: 99,		// その他

	/*
	 * 対象品種区分
	 */
	AMCM_TYPE_HINSYUTGT: 12,
	AMCM_VAL_HINSYUTGT_ALL: 1,		// 全品種
	AMCM_VAL_HINSYUTGT_SPECIFY: 2,		// 品種指定

	/*
	 * 商品区分
	 */
	AMCM_TYPE_ITEM: 13,
	AMCM_VAL_ITEM_REGULAR: 1,		// 定番
	AMCM_VAL_ITEM_SEMIREGULAR: 2,		// 準定番
	AMCM_VAL_ITEM_BULK: 3,		// 一括
	AMCM_VAL_ITEM_REG_3: 4,		// ３年定番
	AMCM_VAL_ITEM_REG_2: 5,		// ２年定番
	AMCM_VAL_ITEM_REG_1: 6,		// １年定番
	AMCM_VAL_ITEM_REG_J: 7,		// 半年定番
	AMCM_VAL_ITEM_REG_K: 9,		// クール定番

	/*
	 * KI区分
	 */
	AMCM_TYPE_KI: 14,
	AMCM_VAL_KI_PURCHASE: 1,		// 買取
	AMCM_VAL_KI_CONSIGN: 2,		// 委託

	/*
	 * 納品形態区分
	 */
	AMCM_TYPE_DLV_ROUTE: 15,
	AMCM_VAL_DLV_ROUTE_DIRECT: 1,		// 店直
	AMCM_VAL_DLV_ROUTE_TC1: 2,		// ＴＣ１
	AMCM_VAL_DLV_ROUTE_DC1: 4,		// ＤＣ１
	AMCM_VAL_DLV_ROUTE_DC2: 5,		// ＤＣ２
	AMCM_VAL_DLV_ROUTE_DC3: 6,		// ＤＣ３
	AMCM_VAL_DLV_ROUTE_TRANSFER: 7,		// 移動
	AMCM_VAL_DLV_ROUTE_CENTER2CENTER: 8,		// センター間移動

	/*
	 * タグ発行区分
	 */
	AMCM_TYPE_TAGISSUE: 16,
	AMCM_VAL_TAGISSUE_JAPAN: 1,		// 日本
	AMCM_VAL_TAGISSUE_CHINA: 2,		// 中国

	/*
	 * タグ種別
	 */
	AMCM_TYPE_TAG: 17,
	AMCM_VAL_TAG_SUIT: 111,		// 袖物タグ
	AMCM_VAL_TAG_SMX: 113,		// 袖物タグ(SMX)
	AMCM_VAL_TAG_PRICE: 114,		// 上代ありタグ
	AMCM_VAL_TAG_SHIRT: 115,		// シャツタグ
	AMCM_VAL_TAG_SLACKS: 116,		// スラックスタグ
	AMCM_VAL_TAG_GOODS: 131,		// 小物ラベル
	AMCM_VAL_TAG_BOX: 132,		// 箱ラベル
	AMCM_VAL_TAG_HAND: 133,		// ハンカチラベル
	AMCM_VAL_TAG_AT_BIG: 171,		// AT用大タグ(マトリクス)
	AMCM_VAL_TAG_AT_BIG_1: 172,		// AT用大タグ(サイズ1行)
	AMCM_VAL_TAG_AT_MIDDLE: 173,		// AT用中タグ
	AMCM_VAL_TAG_AT_SMALL: 174,		// AT用小タグ
	AMCM_VAL_TAG_AT_GOODS: 175,		// AT用小物ラベル
	AMCM_VAL_TAG_AT_GOODS_WEAK: 176,		// AT用小物ラベル（弱粘着）
	AMCM_VAL_TAG_ORBUS1: 811,		// ORビジネス１
	AMCM_VAL_TAG_ORBUS2: 812,		// ORビジネス２
	AMCM_VAL_TAG_ORGARAGE: 813,		// ORガレージ
	AMCM_VAL_TAG_ORRHYME: 814,		// ORライム
	AMCM_VAL_TAG_ORGOODSBUS: 815,		// OR小物タグビジネス
	AMCM_VAL_TAG_ORGOODSRHYME: 816,		// OR小物タグライム
	AMCM_VAL_TAG_ORLABEL: 831,		// OR小物ラベル
	AMCM_VAL_TAG_ORBOX: 832,		// ORシューズ用箱ラベル
	AMCM_VAL_TAG_ORHAND: 833,		// ORハンカチ用ラベル
	AMCM_VAL_TAG_OWN: 999,		// タグ発行機

	/*
	 * 処理区分
	 */
	AMCM_TYPE_OPE: 18,
	AMCM_VAL_OPE_REF: 1,		// 参照
	AMCM_VAL_OPE_ADD: 2,		// 新規
	AMCM_VAL_OPE_UPD: 3,		// 更新
	AMCM_VAL_OPE_DEL: 4,		// 削除
	AMCM_VAL_OPE_CANCEL: 5,		// 予約取消

	/*
	 * QR区分
	 */
	AMCM_TYPE_QR: 19,
	AMCM_VAL_QR_OFF: 1,		// 通常
	AMCM_VAL_QR_ON: 2,		// クイックレスポンス

	/*
	 * 自動振分区分
	 */
	AMCM_TYPE_AUTODISTR: 20,
	AMCM_VAL_AUTODISTR_YES: 1,		// する
	AMCM_VAL_AUTODISTR_NO: 9,		// しない

	/*
	 * 発注対象区分
	 */
	AMCM_TYPE_ORDERKIND: 22,
	AMCM_VAL_ORDERKIND_FIRST: 1,		// 生産発注・タグ情報
	AMCM_VAL_ORDERKIND_ADD: 2,		// 追加生産・追加タグ追加
	AMCM_VAL_ORDERKIND_TAGONLY: 3,		// タグ発行のみ
	AMCM_VAL_ORDERKIND_TAGCORRECT: 4,		// タグ訂正発行（タグ代金発生なし）

	/*
	 * 納品区分
	 */
	AMCM_TYPE_DELIVERY: 23,
	AMCM_VAL_DELIVERY_NORMAL: 1,		// 通常
	AMCM_VAL_DELIVERY_NEWSTORE: 2,		// 新店
	AMCM_VAL_DELIVERY_EC: 4,		// EC

	/*
	 * 緊急区分
	 */
	AMCM_TYPE_EMERGENCY: 24,
	AMCM_VAL_EMERGENCY_SCHEDULE: 1,		// 通常
	AMCM_VAL_EMERGENCY_DEMAND: 2,		// 緊急

	/*
	 * 振分区分
	 */
	AMCM_TYPE_DISTRIBUTE: 25,
	AMCM_VAL_DISTRIBUTE_AUTO: 1,		// 自動振分
	AMCM_VAL_DISTRIBUTE_MANUAL: 2,		// 手振り
	AMCM_VAL_DISTRIBUTE_ORDER: 3,		// 客注

	/*
	 * フェイスストック区分
	 */
	AMCM_TYPE_FACESTOCK: 26,
	AMCM_VAL_FACESTOCK_FACE: 1,		// フェイス
	AMCM_VAL_FACESTOCK_STOCK: 2,		// ストック

	/*
	 * 伝票区分
	 */
	AMCM_TYPE_SLIP: 27,
	AMCM_VAL_SLIP_DELIVER: 10,		// 仕入
	AMCM_VAL_SLIP_RETURN: 20,		// 返品
	AMCM_VAL_SLIP_DLVHAND: 40,		// 仕入手書
	AMCM_VAL_SLIP_NOORDER: 41,		// 未発注
	AMCM_VAL_SLIP_RETHAND: 50,		// 返品手書
	AMCM_VAL_SLIP_DISCOUNT: 70,		// 値引

	/*
	 * 伝票処理区分
	 */
	AMCM_TYPE_SLIP_OPE: 28,
	AMCM_VAL_SLIP_OPE_ENTRY: 1,		// 新規
	AMCM_VAL_SLIP_OPE_UPDATE: 2,		// 締め前訂正
	AMCM_VAL_SLIP_OPE_CORRECT: 3,		// 修正
	AMCM_VAL_SLIP_OPE_DELETE: 4,		// 削除
	AMCM_VAL_SLIP_OPE_REDBLACK: 5,		// 締め後赤黒

	/*
	 * 保管区分
	 */
	AMCM_TYPE_STOCK_KEEP: 29,
	AMCM_VAL_STOCK_KEEP_NORMAL: 1,		// 通常店
	AMCM_VAL_STOCK_KEEP_NEWSTORE: 2,		// 新店
	AMCM_VAL_STOCK_KEEP_CORE: 3,		// 都心店
	AMCM_VAL_STOCK_KEEP_EC: 4,		// EC

	/*
	 * 返品先区分
	 */
	AMCM_TYPE_RETURN_ADDR: 30,
	AMCM_VAL_RETURN_ADDR_MAKER1: 1,		// ＤＣ１→メーカー
	AMCM_VAL_RETURN_ADDR_MAKER2: 2,		// ＤＣ２→メーカー
	AMCM_VAL_RETURN_ADDR_MAKER3: 3,		// ＤＣ３→メーカー
	AMCM_VAL_RETURN_ADDR_DC2: 4,		// ＤＣ１→ＤＣ２
	AMCM_VAL_RETURN_ADDR_DC3: 5,		// ＤＣ１→ＤＣ３

	/*
	 * 更新区分
	 */
	AMCM_TYPE_UPDATE: 31,
	AMCM_VAL_UPDATE_ADD: 1,		// 新規
	AMCM_VAL_UPDATE_UPD: 2,		// 変更
	AMCM_VAL_UPDATE_DEL: 3,		// 削除

	/*
	 * 移動区分
	 */
	AMCM_TYPE_TRANSFER: 32,
	AMCM_VAL_TRANSFER_NORMAL: 1,		// 通常
	AMCM_VAL_TRANSFER_CUSTORDER: 2,		// 客注
	AMCM_VAL_TRANSFER_CENTER: 4,		// センター間移動

	/*
	 * 代行検品区分
	 */
	AMCM_TYPE_CENTER_CHECK: 33,
	AMCM_VAL_CENTER_CHECK_OFF: 1,		// なし
	AMCM_VAL_CENTER_CHECK_ON: 2,		// 済

	/*
	 * 明細欠品区分
	 */
	AMCM_TYPE_SLIPDETAIL: 34,
	AMCM_VAL_SLIPDETAIL_DETAIL: 1,		// 明細
	AMCM_VAL_SLIPDETAIL_STOCKOUT: 2,		// 欠品

	/*
	 * センター在庫区分
	 */
	AMCM_TYPE_CENTER_STOCK: 35,
	AMCM_VAL_CENTER_STOCK_DC1: 1,		// ＤＣ１
	AMCM_VAL_CENTER_STOCK_DC2: 2,		// ＤＣ２
	AMCM_VAL_CENTER_STOCK_DC3: 3,		// ＤＣ３
	AMCM_VAL_CENTER_STOCK_BEFORE_INVENT: 9,		// 棚卸前在庫

	/*
	 * 荷姿区分
	 */
	AMCM_TYPE_PACKAGE: 36,
	AMCM_VAL_PACKAGE_HANGER: 1,		// ハンガー
	AMCM_VAL_PACKAGE_CASE: 2,		// ケース

	/*
	 * 税区分
	 */
	AMCM_TYPE_TAX: 37,
	AMCM_VAL_TAX_OUT: 1,		// 外税
	AMCM_VAL_TAX_IN: 2,		// 内税
	AMCM_VAL_TAX_NO: 3,		// 非課税

	/*
	 * 格付区分
	 */
	AMCM_TYPE_GRADE: 38,
	AMCM_VAL_GRADE_GOOD: 1,		// 良品
	AMCM_VAL_GRADE_DEFECTIVE: 2,		// 不良品
	AMCM_VAL_GRADE_REPAIR: 4,		// 預り在庫
	AMCM_VAL_GRADE_XRAY: 7,		// 加工待ち
	AMCM_VAL_GRADE_OTHER: 99,		// 不明品

	/*
	 * 在庫調整区分
	 */
	AMCM_TYPE_STOCK_ADJUST: 39,
	AMCM_VAL_STOCK_ADJUST_QY: 1,		// 在庫数調整（格付変更なし）

	/*
	 * タグ種類
	 */
	AMCM_TYPE_TAGFORM: 40,
	AMCM_VAL_TAGFORM_TAG: 1,		// タグ
	AMCM_VAL_TAGFORM_SEAL: 2,		// シールタグ

	/*
	 * 商品分類体系区分
	 */
	AMCM_TYPE_ITGRPFUNC: 41,
	AMCM_VAL_ITGRPFUNC_BASIC: 1,		// 基本分類体系
	AMCM_VAL_ITGRPFUNC_CROSS: 2,		// 横断品種体系
	AMCM_VAL_ITGRPFUNC_ANY: 9,		// 任意分類体系

	/*
	 * 値下区分
	 */
	AMCM_TYPE_DISC_METHOD: 42,
	AMCM_VAL_DISC_METHOD_DISCOUNT: 1,		// 値引額指定
	AMCM_VAL_DISC_METHOD_RATE: 2,		// 値下率指定
	AMCM_VAL_DISC_METHOD_PRICE: 3,		// 価格指定

	/*
	 * ＰＯＳデータ種別
	 */
	AMCM_TYPE_POS_DATA: 43,
	AMCM_VAL_POS_DATA_SALE: 101,		// 売上
	AMCM_VAL_POS_DATA_POINT_PLUS_MINUS: 121,		// ポイント加減算(単独)
	AMCM_VAL_POS_DATA_CARD_REISSUE: 125,		// カード再発行
	AMCM_VAL_POS_DATA_CARD_SWITCH: 126,		// カード切替
	AMCM_VAL_POS_DATA_SALE_CANCEL: 191,		// 取消
	AMCM_VAL_POS_DATA_BACK: 201,		// 返品
	AMCM_VAL_POS_DATA_BACK_CANCEL: 291,		// 返品取消
	AMCM_VAL_POS_DATA_CREDIT_BACK: 401,		// 売掛返品
	AMCM_VAL_POS_DATA_CREDIT_BACK_CANCEL: 491,		// 売掛返品取消
	AMCM_VAL_POS_DATA_DEFECTIVE: 911,		// 不良品
	AMCM_VAL_POS_DATA_WRITEDOWN: 912,		// 評価減

	/*
	 * ＰＯＳ品種詳細区分
	 */
	AMCM_TYPE_POS_HINSYUDTL: 44,
	AMCM_VAL_POS_HINSYUDTL_CORRECT: 1,		// 補正代
	AMCM_VAL_POS_HINSYUDTL_BOX: 2,		// 箱代
	AMCM_VAL_POS_HINSYUDTL_DELIVERY: 3,		// 宅配代
	AMCM_VAL_POS_HINSYUDTL_SPEEDER: 4,		// スピーダー
	AMCM_VAL_POS_HINSYUDTL_PLEATS: 5,		// プリーツ加工
	AMCM_VAL_POS_HINSYUDTL_SUPERCREASE: 6,		// Ｓクリース加工
	AMCM_VAL_POS_HINSYUDTL_OTHER: 9,		// 洋品　その他

	/*
	 * 業務料金金額区分
	 */
	AMCM_TYPE_CENTERFEE_AMOUNT: 45,
	AMCM_VAL_CENTERFEE_AMOUNT_RATE: 1,		// 料率
	AMCM_VAL_CENTERFEE_AMOUNT_PRICE: 2,		// 価格
	AMCM_VAL_CENTERFEE_AMOUNT_TAX: 3,		// 消費税額

	/*
	 * 業務料確定区分
	 */
	AMCM_TYPE_CENTERFEE_FIX: 46,
	AMCM_VAL_CENTERFEE_FIX_FLASH: 1,		// 速報（月中データ）
	AMCM_VAL_CENTERFEE_FIX_FIX: 2,		// 確定（月末データ）

	/*
	 * 赤黒区分
	 */
	AMCM_TYPE_REDBLACK: 47,
	AMCM_VAL_REDBLACK_BLACK: 1,		// 黒
	AMCM_VAL_REDBLACK_RED: 2,		// 赤

	/*
	 * ロケ区分
	 */
	AMCM_TYPE_LOCATION: 48,
	AMCM_VAL_LOCATION_NORMAL: 1,		// 通常
	AMCM_VAL_LOCATION_TRANSFER: 2,		// 移動

	/*
	 * 完納区分
	 */
	AMCM_TYPE_DLV_COMPLETE: 49,
	AMCM_VAL_DLV_COMPLETE_YET: 1,		// 未完納
	AMCM_VAL_DLV_COMPLETE_COMPLETE: 2,		// 完納済

	/*
	 * ＫＴ区分
	 */
	AMCM_TYPE_KT: 50,
	AMCM_VAL_KT_NORMAL: 1,		// ＫＴでない
	AMCM_VAL_KT_KT: 2,		// ＫＴ

	/*
	 * 経準反映区分
	 */
	AMCM_TYPE_PROFIT_REFLECT: 51,
	AMCM_VAL_PROFIT_REFLECT_STORE: 1,		// 店舗直下
	AMCM_VAL_PROFIT_REFLECT_DIVIDE: 2,		// 本部反映

	/*
	 * 割引企画種別
	 */
	AMCM_TYPE_DISC_PROM: 52,
	AMCM_VAL_DISC_PROM_DM: 1,		// DM割引
	AMCM_VAL_DISC_PROM_FIX: 2,		// 固定割引
	AMCM_VAL_DISC_PROM_TIEUP: 3,		// 提携割引
	AMCM_VAL_DISC_PROM_COMPLIMENT: 4,		// 決算ご優待
	AMCM_VAL_DISC_PROM_COOP: 5,		// 大学生協

	/*
	 * DM区分
	 */
	AMCM_TYPE_DM_TYPE: 54,
	// AMCM_VAL_DM_TYPE_: ,		// 

	/*
	 * 団体区分
	 */
	AMCM_TYPE_ASSOC_TYPE: 55,
	// AMCM_VAL_ASSOC_TYPE_: ,		// 

	/*
	 * 出力区分
	 */
	AMCM_TYPE_REPORT_TYPE: 56,
	AMCM_VAL_REPORT_TYPE_DAILY_REPORT: 1,		// 日報
	AMCM_VAL_REPORT_TYPE_WEEKLY_REPORT: 2,		// 週報
	AMCM_VAL_REPORT_TYPE_MONTHLY_REPORT: 3,		// 月報
	AMCM_VAL_REPORT_TYPE_HALF_YEAR_REPORT: 4,		// 半期報
	AMCM_VAL_REPORT_TYPE_YEARLY_REPORT: 5,		// 年報

	/*
	 * 訂正理由区分
	 */
	AMCM_TYPE_CORR_REASON_TYPE: 57,
	// AMCM_VAL_CORR_REASON_TYPE_: ,		// 

	/*
	 * 集約シーズン区分
	 */
	AMCM_TYPE_AGG_SEASON: 58,
	AMCM_VAL_AGG_SEASON_AW: 1,		// AW
	AMCM_VAL_AGG_SEASON_SS: 2,		// SS
	AMCM_VAL_AGG_SEASON_SP: 3,		// SP
	AMCM_VAL_AGG_SEASON_ALL: 4,		// ALL

	/*
	 * ABC分析区分
	 */
	AMCM_TYPE_ABC_ANAL_RANK: 59,
	AMCM_VAL_ABC_ANAL_RANK_A: 1,		// Aランク
	AMCM_VAL_ABC_ANAL_RANK_B: 2,		// Bランク
	AMCM_VAL_ABC_ANAL_RANK_C: 3,		// Cランク
	AMCM_VAL_ABC_ANAL_RANK_D: 4,		// Dランク（売上０）

	/*
	 * プライス集約単位区分
	 */
	AMCM_TYPE_AGG_PRICE: 60,
	AMCM_VAL_AGG_PRICE_PRICE: 1,		// 販売価格
	AMCM_VAL_AGG_PRICE_PRICELINE: 2,		// 指定上代
	AMCM_VAL_AGG_PRICE_POSPRICE: 3,		// POS元上代

	/*
	 * ABC分析項目区分
	 */
	AMCM_TYPE_ABC_ANAL_ITEM: 61,
	AMCM_VAL_ABC_ANAL_ITEM_SALES_QY: 1,		// 売上数
	AMCM_VAL_ABC_ANAL_ITEM_SALES_AM: 2,		// 売上高
	AMCM_VAL_ABC_ANAL_ITEM_STOCK_QY: 3,		// 在庫数
	AMCM_VAL_ABC_ANAL_ITEM_STOCK_AM: 4,		// 在庫高

	/*
	 * 並び順区分
	 */
	AMCM_TYPE_ALIGN_SEQ: 62,
	AMCM_VAL_ALIGN_SEQ_ASCENDING: 1,		// 昇順
	AMCM_VAL_ALIGN_SEQ_DESCENDING: 2,		// 降順

	/*
	 * 削除状態区分
	 */
	AMCM_TYPE_DEL_STATE: 63,
	AMCM_VAL_DEL_STATE_NOT_DELELTED: 1,		// 未削除
	AMCM_VAL_DEL_STATE_DELETED: 2,		// 削除済

	/*
	 * 訂正状態区分
	 */
	AMCM_TYPE_CORR_STATE: 65,
	AMCM_VAL_CORR_STATE_NOT_CORRECTED: 1,		// 未訂正
	AMCM_VAL_CORR_STATE_CORRECTED: 2,		// 訂正済

	/*
	 * 確定状態区分
	 */
	AMCM_TYPE_FIX_STATE: 66,
	AMCM_VAL_FIX_STATE_NOT_FIXED: 1,		// 未確定
	AMCM_VAL_FIX_STATE_FIXED: 2,		// 確定

	/*
	 * 発注サイクル区分
	 */
	AMCM_TYPE_ORD_CYCLE: 67,
	AMCM_VAL_ORD_CYCLE_WEEKLY: 1,		// 毎週
	AMCM_VAL_ORD_CYCLE_FIRST_WEEK: 2,		// 第１週
	AMCM_VAL_ORD_CYCLE_SECOND_WEEK: 3,		// 第２週
	AMCM_VAL_ORD_CYCLE_THIRD_WEEK: 4,		// 第３週
	AMCM_VAL_ORD_CYCLE_FOURTH_WEEK: 5,		// 第４週
	AMCM_VAL_ORD_CYCLE_END_OF_MONTH: 6,		// 月末
	AMCM_VAL_ORD_CYCLE_NOT_PERIODIC: 7,		// 非定期

	/*
	 * 曜日区分
	 */
	AMCM_TYPE_DAY_OF_WEEK: 68,
	AMCM_VAL_DAY_OF_WEEK_MON: 1,		// 月曜日
	AMCM_VAL_DAY_OF_WEEK_TUE: 2,		// 火曜日
	AMCM_VAL_DAY_OF_WEEK_WED: 3,		// 水曜日
	AMCM_VAL_DAY_OF_WEEK_THU: 4,		// 木曜日
	AMCM_VAL_DAY_OF_WEEK_FRI: 5,		// 金曜日
	AMCM_VAL_DAY_OF_WEEK_SAT: 6,		// 土曜日
	AMCM_VAL_DAY_OF_WEEK_SUN: 7,		// 日曜日

	/*
	 * 棚卸状態区分
	 */
	AMCM_TYPE_INV_STATE: 69,
	AMCM_VAL_INV_STATE_INV_NOT_REPORTED: 1,		// 棚卸未報告
	AMCM_VAL_INV_STATE_INV_REPORTED: 2,		// 棚卸報告済
	AMCM_VAL_INV_STATE_INV_FIXED: 3,		// 棚卸確定済
	AMCM_VAL_INV_STATE_INV_APPROVE: 4,		// 棚卸承認済

	/*
	 * 取引種別区分
	 */
	AMCM_TYPE_DEAL_CLASS: 70,
	AMCM_VAL_DEAL_CLASS_COST: 1,		// 経費
	AMCM_VAL_DEAL_CLASS_ACC_RECEIVABLE: 2,		// 売掛
	AMCM_VAL_DEAL_CLASS_SALE: 3,		// 売上
	AMCM_VAL_DEAL_CLASS_TRANSFER: 4,		// 振替
	AMCM_VAL_DEAL_CLASS_MONNEY_RECEIVED: 5,		// 入金
	AMCM_VAL_DEAL_CLASS_PAYMENT: 6,		// 支払
	AMCM_VAL_DEAL_CLASS_INVENTORY: 7,		// 棚卸

	/*
	 * 商品登録区分
	 */
	AMCM_TYPE_ITEM_REGIST: 71,
	AMCM_VAL_ITEM_REGIST_YET: 1,		// 未登録
	AMCM_VAL_ITEM_REGIST_DONE: 2,		// 登録済

	/*
	 * 用途区分
	 */
	AMCM_TYPE_USE_TYPE: 72,
	AMCM_VAL_USE_TYPE_BUSINESS: 1,		// 仕事
	AMCM_VAL_USE_TYPE_FORMAL: 2,		// フォーマル
	AMCM_VAL_USE_TYPE_CASUAL: 3,		// カジュアル

	/*
	 * 棚卸差異報告分類区分
	 */
	AMCM_TYPE_INV_DIFF_REPORT: 73,
	AMCM_VAL_INV_DIFF_REPORT_LOSS_SEARCH: 1,		// ロス追求
	AMCM_VAL_INV_DIFF_REPORT_MASTER_INVALID: 2,		// 商品マスタインバリッド

	/*
	 * 備品区分
	 */
	AMCM_TYPE_EQUIP_TYPE: 74,
	AMCM_VAL_EQUIP_TYPE_PACKING: 10,		// 包装
	AMCM_VAL_EQUIP_TYPE_PACKAGE: 11,		// パッケージ
	AMCM_VAL_EQUIP_TYPE_PACKAGE_EQ: 999,		// パッケージ備品
	AMCM_VAL_EQUIP_TYPE_SYSTEM: 13,		// システム
	AMCM_VAL_EQUIP_TYPE_SYSTEM_EQ: 5,		// システム備品
	AMCM_VAL_EQUIP_TYPE_8H: 1,		// エイトハート
	AMCM_VAL_EQUIP_TYPE_RESIZE: 21,		// 補正
	AMCM_VAL_EQUIP_TYPE_BALOON: 30,		// 風船関連備品
	AMCM_VAL_EQUIP_TYPE_DISCOUNT: 31,		// 商品割引券
	AMCM_VAL_EQUIP_TYPE_MAIL: 32,		// メール会員登録他
	AMCM_VAL_EQUIP_TYPE_POP: 33,		// POP
	AMCM_VAL_EQUIP_TYPE_SLTAG: 39,		// SL下げ札
	AMCM_VAL_EQUIP_TYPE_SHTAG: 40,		// 肩タグ
	AMCM_VAL_EQUIP_TYPE_SHTAGSL: 41,		// 肩タグ用シール
	AMCM_VAL_EQUIP_TYPE_CCLTAG: 42,		// 円タグ
	AMCM_VAL_EQUIP_TYPE_SLVCOVER_ETC: 43,		// 袖かぶせその他
	AMCM_VAL_EQUIP_TYPE_LEAF: 44,		// リーフレット・ビラ
	AMCM_VAL_EQUIP_TYPE_SLVTAG: 45,		// 袖タグ
	AMCM_VAL_EQUIP_TYPE_PETSL: 46,		// PETシール
	AMCM_VAL_EQUIP_TYPE_PLC: 47,		// プライスカード
	AMCM_VAL_EQUIP_TYPE_MDSLVCOVER: 48,		// マークダウン袖かぶせ
	AMCM_VAL_EQUIP_TYPE_HALF_MDSLVCOVER: 49,		// 半額マークダウン袖かぶせ
	AMCM_VAL_EQUIP_TYPE_PLSL: 7,		// プライスシール
	AMCM_VAL_EQUIP_TYPE_MDSL: 50,		// マークダウンシール
	AMCM_VAL_EQUIP_TYPE_SIZESL: 51,		// サイズシールCY用
	AMCM_VAL_EQUIP_TYPE_SIZESLBY: 52,		// サイズシールSL用
	AMCM_VAL_EQUIP_TYPE_TSSIZESLTS: 53,		// TSサイズシールTS用
	AMCM_VAL_EQUIP_TYPE_SLETC: 54,		// シールその他
	AMCM_VAL_EQUIP_TYPE_RACK: 55,		// 棚挿し
	AMCM_VAL_EQUIP_TYPE_COLLECTSL: 56,		// タグ訂正シール
	AMCM_VAL_EQUIP_TYPE_SIZECHIP: 57,		// サイズチップスーツ・礼服・コート・JK・CY
	AMCM_VAL_EQUIP_TYPE_SIZECHIPSL: 58,		// サイズチップＳＬ
	AMCM_VAL_EQUIP_TYPE_SIZECHIPL: 59,		// サイズチップレディス
	AMCM_VAL_EQUIP_TYPE_SIZECHIP_OR: 3,		// サイズチップ
	AMCM_VAL_EQUIP_TYPE_CCLCHIP: 60,		// 円チップ
	AMCM_VAL_EQUIP_TYPE_HANGERNECKTAG: 61,		// ハンガーネックタグ
	AMCM_VAL_EQUIP_TYPE_ATTACH: 4,		// 商品付属品
	AMCM_VAL_EQUIP_TYPE_SCHIP_SMX: 62,		// サイズチップSMX専用
	AMCM_VAL_EQUIP_TYPE_BLAND_COVER: 63,		// ブランドかぶせ
	AMCM_VAL_EQUIP_TYPE_HANGER: 65,		// ハンガー
	AMCM_VAL_EQUIP_TYPE_STNBAR: 66,		// スタンバー
	AMCM_VAL_EQUIP_TYPE_ORG: 2,		// オリジナル
	AMCM_VAL_EQUIP_TYPE_STORE_EQUIP: 68,		// 店内備品
	AMCM_VAL_EQUIP_TYPE_OTHER: 9,		// その他
	AMCM_VAL_EQUIP_TYPE_ENVELOPE: 70,		// 事務・封筒
	AMCM_VAL_EQUIP_TYPE_STATIONARY: 6,		// 事務用品
	AMCM_VAL_EQUIP_TYPE_FAX: 72,		// FAX
	AMCM_VAL_EQUIP_TYPE_BOOK: 80,		// 伝票・冊子
	AMCM_VAL_EQUIP_TYPE_SLIP: 8,		// 伝票類
	AMCM_VAL_EQUIP_TYPE_SWEEP_OUT_OF_STORE: 90,		// 除草剤・噴霧器

	/*
	 * プレミアム商品区分
	 */
	AMCM_TYPE_PREM_TYPE: 75,
	AMCM_VAL_PREM_TYPE_FORMAL_PREMIUM: 1,		// 礼装プレミアム
	AMCM_VAL_PREM_TYPE_DM_PREMIUM: 2,		// DMプレミアム
	AMCM_VAL_PREM_TYPE_OTHER_PREMIUM: 3,		// その他プレミアム

	/*
	 * 備品管理区分
	 */
	AMCM_TYPE_EQUIP_ADMIN_TYPE: 77,
	AMCM_VAL_EQUIP_ADMIN_TYPE_EQUIP: 1,		// 備品
	AMCM_VAL_EQUIP_ADMIN_TYPE_PREMIUM: 2,		// プレミアム商品

	/*
	 * 返品理由区分
	 */
	AMCM_TYPE_RETURN_REASON: 78,
	AMCM_VAL_RETURN_REASON_DEFECTIVE: 1,		// 不良品

	/*
	 * 取込データ種区分
	 */
	AMCM_TYPE_IMPORT_DATA_TYPE: 79,
	AMCM_VAL_IMPORT_DATA_TYPE_ASN: 1,		// ASN
	AMCM_VAL_IMPORT_DATA_TYPE_DEFECTIVE: 2,		// 不良品実績
	AMCM_VAL_IMPORT_DATA_TYPE_MAKER_RETURN: 3,		// メーカー返品
	AMCM_VAL_IMPORT_DATA_TYPE_OPE_COST: 4,		// 業務料金請求
	AMCM_VAL_IMPORT_DATA_TYPE_INVENTORY: 5,		// 棚卸
	AMCM_VAL_IMPORT_DATA_TYPE_MISC_CHARGE: 6,		// 諸掛
	AMCM_VAL_IMPORT_DATA_TYPE_CENTER_STOCK: 7,		// センター在庫
	AMCM_VAL_IMPORT_DATA_TYPE_VENDOR_STOCK: 8,		// 取引先在庫
	AMCM_VAL_IMPORT_DATA_TYPE_DC2DC3: 9,		// DC2DC3入庫予定
	AMCM_VAL_IMPORT_DATA_TYPE_STOCK_ADJUST: 10,		// 在庫調整
	AMCM_VAL_IMPORT_DATA_TYPE_GV_RECEIPT: 11,		// 入荷実績
	AMCM_VAL_IMPORT_DATA_TYPE_POS_RECEIPT: 12,		// 売上
	AMCM_VAL_IMPORT_DATA_TYPE_POS_REASON: 13,		// 割引理由
	AMCM_VAL_IMPORT_DATA_TYPE_POS_FOLLOW: 14,		// 品種フォロー
	AMCM_VAL_IMPORT_DATA_TYPE_ACC_REPORT: 15,		// 経理日報
	AMCM_VAL_IMPORT_DATA_TYPE_PL: 16,		// 損益計算書
	AMCM_VAL_IMPORT_DATA_TYPE_BUDGET: 17,		// 予算書
	AMCM_VAL_IMPORT_DATA_TYPE_STAFF: 18,		// 社員
	AMCM_VAL_IMPORT_DATA_TYPE_ORDER_SCM: 19,		// オーダーSCM
	AMCM_VAL_IMPORT_DATA_TYPE_TRANSOUT: 20,		// 移動出荷
	AMCM_VAL_IMPORT_DATA_TYPE_WEATER_FORECAST: 21,		// 天気予報
	AMCM_VAL_IMPORT_DATA_TYPE_WEATER_ACT: 22,		// 天気実績
	AMCM_VAL_IMPORT_DATA_TYPE_DPOINT: 23,		// dPoint
	AMCM_VAL_IMPORT_DATA_TYPE_PONTA: 24,		// Ponta

	/*
	 * 取込状態区分
	 */
	AMCM_TYPE_IMPORT_STATE: 80,
	AMCM_VAL_IMPORT_STATE_NORMAL: 1,		// 正常終了
	AMCM_VAL_IMPORT_STATE_NORMAL_WITH_ERROR: 2,		// エラーあり（正常終了）
	AMCM_VAL_IMPORT_STATE_ABNORMAL: 3,		// 異常終了

	/*
	 * 実施状況区分
	 */
	AMCM_TYPE_OPER_STATE: 81,
	AMCM_VAL_OPER_STATE_OPERATED: 1,		// 実施済
	AMCM_VAL_OPER_STATE_NOT_OPERATED: 2,		// 未実施

	/*
	 * 指示区分
	 */
	AMCM_TYPE_REQUEST_TYPE: 82,
	AMCM_VAL_REQUEST_TYPE_RETURN: 1,		// 返品
	AMCM_VAL_REQUEST_TYPE_TRANSFER: 2,		// 移動
	AMCM_VAL_REQUEST_TYPE_MARK_DOWN: 3,		// マークダウン
	AMCM_VAL_REQUEST_TYPE_MARK_DOWN_WD: 4,		// マークダウン（評価減）
	AMCM_VAL_REQUEST_TYPE_TRANSFER_DEPOS: 5,		// 移動(DePos)

	/*
	 * センター区分
	 */
	AMCM_TYPE_CENTER_TYPE: 83,
	AMCM_VAL_CENTER_TYPE_FRC_DC1: 1,		// FRC DC1
	AMCM_VAL_CENTER_TYPE_FRC_DC2: 2,		// FRC DC2
	AMCM_VAL_CENTER_TYPE_FRC_TC1: 3,		// FRC TC1
	AMCM_VAL_CENTER_TYPE_HMK_DC1: 4,		// HMK DC1
	AMCM_VAL_CENTER_TYPE_HMK_DC2: 5,		// HMK DC2
	AMCM_VAL_CENTER_TYPE_HMK_DC3: 6,		// HMK DC3

	/*
	 * 不良理由分類区分
	 */
	AMCM_TYPE_DEFECT_REASON: 84,
	AMCM_VAL_DEFECT_REASON_BURN: 1,		// 日焼け(照明焼け)
	AMCM_VAL_DEFECT_REASON_MISSED_MESURE: 2,		// 採寸ﾐｽ･補正ﾐｽ
	AMCM_VAL_DEFECT_REASON_BLOT: 3,		// 汚れ･傷･破損
	AMCM_VAL_DEFECT_REASON_DIFF_SETUP: 4,		// 組み違い
	AMCM_VAL_DEFECT_REASON_CUST_RESPONSE_RETURN: 5,		// お客様都合返品
	AMCM_VAL_DEFECT_REASON_INSECT_DAMAGE: 6,		// 虫害
	AMCM_VAL_DEFECT_REASON_DEFECT_FABRIC: 7,		// 素材不良
	AMCM_VAL_DEFECT_REASON_TRIAL_FITTING: 8,		// 試着用
	AMCM_VAL_DEFECT_REASON_PROPERTY_LOSS: 9,		// 盗難（万引き）
	AMCM_VAL_DEFECT_REASON_ACC_RECEIVABLE_RETURN: 10,		// 回収不能売掛金返品
	AMCM_VAL_DEFECT_REASON_DEFECT_ITEM: 11,		// 製品不良（店舗責任がない）
	AMCM_VAL_DEFECT_REASON_HANDLING_AT_CENTER: 12,		// センター不良品処理
	AMCM_VAL_DEFECT_REASON_DONATION: 13,		// 寄贈
	AMCM_VAL_DEFECT_REASON_OFFER: 14,		// 衣装提供
	AMCM_VAL_DEFECT_REASON_PRESENT: 15,		// 商品提供・読者ﾌﾟﾚｾﾞﾝﾄ
	AMCM_VAL_DEFECT_REASON_SHOOTING_USAGE: 16,		// 撮影使用
	AMCM_VAL_DEFECT_REASON_CUST_RESPONSE_RETURN_SC: 17,		// お客様都合返品（SC）
	AMCM_VAL_DEFECT_REASON_MISSED_RESIZE: 18,		// 補正ミス・業者買取（SC）
	AMCM_VAL_DEFECT_REASON_SAMPLE: 19,		// サンプル品
	AMCM_VAL_DEFECT_REASON_OTHERS: 99,		// その他

	/*
	 * 承認状態区分
	 */
	AMCM_TYPE_APPROVE_STATE: 85,
	AMCM_VAL_APPROVE_STATE_NOT_APPROVE: 1,		// 未承認
	AMCM_VAL_APPROVE_STATE_APPROVE: 2,		// 承認
	AMCM_VAL_APPROVE_STATE_REJECT: 3,		// 不承認

	/*
	 * 年令別在庫残一覧区分
	 */
	AMCM_TYPE_STOCK_BY_ITEM_AGE: 87,
	AMCM_VAL_STOCK_BY_ITEM_AGE_ST001: 1,		// 品種別年令別在庫残一覧
	AMCM_VAL_STOCK_BY_ITEM_AGE_ST002: 2,		// 店舗別品種別年令別在庫残一覧
	AMCM_VAL_STOCK_BY_ITEM_AGE_ST003: 3,		// 品番別年令別在庫残一覧
	AMCM_VAL_STOCK_BY_ITEM_AGE_ST004: 4,		// 店舗別品番別年令別在庫残一覧
	AMCM_VAL_STOCK_BY_ITEM_AGE_ST005: 5,		// 品種別年令別在庫残一覧(経理用)
	AMCM_VAL_STOCK_BY_ITEM_AGE_ST006: 6,		// 品番別年令別在庫残一覧（経理用）

	/*
	 * 合計シーズン別区分
	 */
	AMCM_TYPE_SUM_SEASON: 88,
	AMCM_VAL_SUM_SEASON_SUM: 1,		// 合計
	AMCM_VAL_SUM_SEASON_SEASON: 2,		// シーズン別

	/*
	 * 出力対象年令区分
	 */
	AMCM_TYPE_ITEM_AGE: 89,
	AMCM_VAL_ITEM_AGE_FIRST_YEAR: 1,		// 1年未満
	AMCM_VAL_ITEM_AGE_SECOND_YEAR: 2,		// 1年以上2年未満
	AMCM_VAL_ITEM_AGE_THIRD_YEAR: 3,		// 2年以上3年未満
	AMCM_VAL_ITEM_AGE_FOURTH_YEAR: 4,		// 3年以上4年未満
	AMCM_VAL_ITEM_AGE_YEAR_AFTER_FIFTH: 5,		// 4年以上

	/*
	 * 評価減検索日区分
	 */
	AMCM_TYPE_DEVALUE_SEARCH_DATE: 90,
	AMCM_VAL_DEVALUE_SEARCH_DATE_CURRENT_AGE: 1,		// 現在の年令
	AMCM_VAL_DEVALUE_SEARCH_DATE_NEXT_SPRING_AGE: 2,		// 次の4/1の年令
	AMCM_VAL_DEVALUE_SEARCH_DATE_NEXT_AUTUMN_AGE: 3,		// 次の10/1の年令

	/*
	 * 評価減実施実績区分
	 */
	AMCM_TYPE_DEVALUE_RESULTS: 91,
	AMCM_VAL_DEVALUE_RESULTS_DEV001: 1,		// 品種別実績
	AMCM_VAL_DEVALUE_RESULTS_DEV002: 2,		// 店舗別実績
	AMCM_VAL_DEVALUE_RESULTS_DEV003: 3,		// 店舗別品種別実績
	AMCM_VAL_DEVALUE_RESULTS_DEV004: 4,		// 品番別実績
	AMCM_VAL_DEVALUE_RESULTS_DEV005: 5,		// 店舗別品番別実績

	/*
	 * 累計区分
	 */
	AMCM_TYPE_ACCUMULATE_TYPE: 92,
	AMCM_VAL_ACCUMULATE_TYPE_MONTH: 1,		// 月
	AMCM_VAL_ACCUMULATE_TYPE_HALF_YEAR: 2,		// 半期
	AMCM_VAL_ACCUMULATE_TYPE_YEAR: 3,		// 年間

	/*
	 * 移動指示対応状況区分
	 */
	AMCM_TYPE_TRANS_RESPONSE: 93,
	AMCM_VAL_TRANS_RESPONSE_NOT_SHIP: 1,		// 未出荷
	AMCM_VAL_TRANS_RESPONSE_SHIPPED: 2,		// 出荷済
	AMCM_VAL_TRANS_RESPONSE_RECEIVED: 3,		// 入荷済

	/*
	 * 移動入出荷区分
	 */
	AMCM_TYPE_TRANS_TYPE: 94,
	AMCM_VAL_TRANS_TYPE_SHIP: 1,		// 出荷
	AMCM_VAL_TRANS_TYPE_TMP_RCV: 2,		// 出荷済未確定
	AMCM_VAL_TRANS_TYPE_RECEIVE: 3,		// 入荷

	/*
	 * 商品任意属性区分
	 */
	AMCM_TYPE_ITEM_OPT_ATTR: 95,
	AMCM_VAL_ITEM_OPT_ATTR_EXIST: 1,		// 有
	AMCM_VAL_ITEM_OPT_ATTR_NOT_EXIST: 2,		// 無

	/*
	 * 振分先センター区分
	 */
	AMCM_TYPE_DELIV_CENTER: 96,
	AMCM_VAL_DELIV_CENTER_FRC: 1,		// ＦＲＣ
	AMCM_VAL_DELIV_CENTER_HMK: 2,		// HMK

	/*
	 * 入力通貨区分
	 */
	AMCM_TYPE_CURRENCY: 97,
	AMCM_VAL_CURRENCY_USD: 1,		// ドル
	AMCM_VAL_CURRENCY_EUR: 2,		// ユーロ
	AMCM_VAL_CURRENCY_CNY: 3,		// 元
	AMCM_VAL_CURRENCY_MMK: 4,		// チャット
	AMCM_VAL_CURRENCY_BDT: 5,		// タカ

	/*
	 * 承認対象区分
	 */
	AMCM_TYPE_APPROVE_TARGET: 98,
	AMCM_VAL_APPROVE_TARGET_TAG: 1,		// タグ発行
	AMCM_VAL_APPROVE_TARGET_FINAL: 2,		// 最終承認
	AMCM_VAL_APPROVE_TARGET_REAPPROVE: 3,		// マスタ再承認
	AMCM_VAL_APPROVE_TARGET_ORDERADD: 4,		// 追加発注
	AMCM_VAL_APPROVE_TARGET_ORDERCANCEL: 5,		// 発注取消

	/*
	 * 棚卸修正理由区分
	 */
	AMCM_TYPE_INV_FIX_REASON: 99,
	AMCM_VAL_INV_FIX_REASON_INV001: 1,		// ２度読み
	AMCM_VAL_INV_FIX_REASON_INV002: 2,		// 棚卸モレ
	AMCM_VAL_INV_FIX_REASON_INV003: 3,		// 読取間違い
	AMCM_VAL_INV_FIX_REASON_INV004: 4,		// タグ取付違い
	AMCM_VAL_INV_FIX_REASON_INV005: 5,		// 簿外商品読取り
	AMCM_VAL_INV_FIX_REASON_INV006: 6,		// インバリッド
	AMCM_VAL_INV_FIX_REASON_INV007: 7,		// 売上修正モレ
	AMCM_VAL_INV_FIX_REASON_INV008: 8,		// 在庫据え置き

	/*
	 * ダウンロード状態区分
	 */
	AMCM_TYPE_DL_STATE: 100,
	AMCM_VAL_DL_STATE_NOT_DL: 1,		// ダウンロード未
	AMCM_VAL_DL_STATE_DL: 2,		// ダウンロード済

	/*
	 * 備品発送元区分
	 */
	AMCM_TYPE_EQUIP_SENDER_TYPE: 101,
	AMCM_VAL_EQUIP_SENDER_TYPE_VENDER: 1,		// メーカー
	AMCM_VAL_EQUIP_SENDER_TYPE_FRC: 2,		// FRC備品センター
	AMCM_VAL_EQUIP_SENDER_TYPE_HMK: 3,		// HMK
	AMCM_VAL_EQUIP_SENDER_TYPE_SC: 4,		// SC

	/*
	 * 備品発注方法区分
	 */
	AMCM_TYPE_EQUIP_ORDER_TYPE: 102,
	AMCM_VAL_EQUIP_ORDER_TYPE_EQUIP: 1,		// 備品発注
	AMCM_VAL_EQUIP_ORDER_TYPE_PREMIUM: 2,		// プレミアム発注
	AMCM_VAL_EQUIP_ORDER_TYPE_TANOMERU: 3,		// たのめーる
	AMCM_VAL_EQUIP_ORDER_TYPE_WORKFLOW: 4,		// ワークフロー
	AMCM_VAL_EQUIP_ORDER_TYPE_MAIL: 5,		// メール
	AMCM_VAL_EQUIP_ORDER_TYPE_STORE119: 6,		// 店舗119
	AMCM_VAL_EQUIP_ORDER_TYPE_MESSAGE: 7,		// メッセージ

	/*
	 * PO種別
	 */
	AMCM_TYPE_PO_CLASS: 103,
	AMCM_VAL_PO_CLASS_MENS: 1,		// メンズ
	AMCM_VAL_PO_CLASS_LADYS: 2,		// レディス
	AMCM_VAL_PO_CLASS_SHIRT: 3,		// シャツ

	/*
	 * 費用区分
	 */
	AMCM_TYPE_COST_TYPE: 104,
	AMCM_VAL_COST_TYPE_PAY: 1,		// 有料
	AMCM_VAL_COST_TYPE_FREE: 2,		// 無料

	/*
	 * ベント区分
	 */
	AMCM_TYPE_BENT_TYPE: 105,
	AMCM_VAL_BENT_TYPE_NONE: 1,		// ノーベント
	AMCM_VAL_BENT_TYPE_SIDE: 2,		// サイドベンツ
	AMCM_VAL_BENT_TYPE_CENTER: 3,		// センターベント

	/*
	 * 裏地区分
	 */
	AMCM_TYPE_BACK_FABRIC_TYPE: 106,
	AMCM_VAL_BACK_FABRIC_TYPE_LINING: 1,		// 総裏
	AMCM_VAL_BACK_FABRIC_TYPE_UNLINED: 2,		// 背抜き
	AMCM_VAL_BACK_FABRIC_TYPE_UNLINED_KANNON: 3,		// 背抜き観音

	/*
	 * AMF区分
	 */
	AMCM_TYPE_AMF_TYPE: 107,
	AMCM_VAL_AMF_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_AMF_TYPE_EXIST: 2,		// 有

	/*
	 * 重ねボタン区分
	 */
	AMCM_TYPE_OVERLAP_BUTTON_TYPE: 108,
	AMCM_VAL_OVERLAP_BUTTON_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_OVERLAP_BUTTON_TYPE_EXIST: 2,		// 有

	/*
	 * スラントポケット区分
	 */
	AMCM_TYPE_SLANT_POCKET_TYPE: 109,
	AMCM_VAL_SLANT_POCKET_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_SLANT_POCKET_TYPE_EXIST: 2,		// 有

	/*
	 * ネーム区分
	 */
	AMCM_TYPE_NAME_TYPE: 110,
	AMCM_VAL_NAME_TYPE_NONE: 1,		// 無し
	AMCM_VAL_NAME_TYPE_FACT: 2,		// 工場
	AMCM_VAL_NAME_TYPE_STORE: 3,		// 店舗

	/*
	 * 補正区分
	 */
	AMCM_TYPE_RESIZE_TYPE: 111,
	AMCM_VAL_RESIZE_TYPE_SHORTEN: 1,		// 詰め
	AMCM_VAL_RESIZE_TYPE_EXTEND: 2,		// 伸ばし
	AMCM_VAL_RESIZE_TYPE_NONE: 3,		// ハーフ（直しなし）

	/*
	 * チェンジポケット区分
	 */
	AMCM_TYPE_CHANGE_POCKET_TYPE: 112,
	AMCM_VAL_CHANGE_POCKET_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_CHANGE_POCKET_TYPE_EXIST: 2,		// 有

	/*
	 * 本切羽区分
	 */
	AMCM_TYPE_REAL_BUTTON_HOLE_TYPE: 113,
	AMCM_VAL_REAL_BUTTON_HOLE_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_REAL_BUTTON_HOLE_TYPE_EXIST: 2,		// 有

	/*
	 * AMFステッチ区分
	 */
	AMCM_TYPE_AMF_STITCH_TYPE: 114,
	// AMCM_VAL_AMF_STITCH_TYPE_: ,		// 

	/*
	 * ボタン変更区分
	 */
	AMCM_TYPE_CHANGE_BUTTON_TYPE: 115,
	AMCM_VAL_CHANGE_BUTTON_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_CHANGE_BUTTON_TYPE_EXIST: 2,		// 有

	/*
	 * お台場区分
	 */
	AMCM_TYPE_ODAIBA_TYPE: 116,
	AMCM_VAL_ODAIBA_TYPE_NONE: 1,		// しない
	AMCM_VAL_ODAIBA_TYPE_KIRIDAIBA: 2,		// 切台場仕立て

	/*
	 * 裏地変更区分
	 */
	AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE: 117,
	AMCM_VAL_CHANGE_BACK_FABRIC_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_CHANGE_BACK_FABRIC_TYPE_EXIST: 2,		// 有

	/*
	 * サマー仕様区分
	 */
	AMCM_TYPE_SUMMAR_SPEC_TYPE: 118,
	AMCM_VAL_SUMMAR_SPEC_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_SUMMAR_SPEC_TYPE_EXIST: 2,		// 有

	/*
	 * スペア区分
	 */
	AMCM_TYPE_SPARE_TYPE: 119,
	AMCM_VAL_SPARE_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_SPARE_TYPE_EXIST: 2,		// 有

	/*
	 * 裾仕上区分
	 */
	AMCM_TYPE_COATTAIL_TYPE: 120,
	AMCM_VAL_COATTAIL_TYPE_SINGLE: 1,		// シングル
	AMCM_VAL_COATTAIL_TYPE_DOUBLE: 2,		// ダブル
	AMCM_VAL_COATTAIL_TYPE_NONE: 3,		// ハーフ（丈上げなし）
	AMCM_VAL_COATTAIL_TYPE_MORNING: 4,		// モーニング

	/*
	 * アジャスター区分
	 */
	AMCM_TYPE_ADJUSTER_TYPE: 121,
	AMCM_VAL_ADJUSTER_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_ADJUSTER_TYPE_EXIST: 2,		// 有

	/*
	 * ジャケット区分
	 */
	AMCM_TYPE_JACKET_TYPE: 122,
	// AMCM_VAL_JACKET_TYPE_: ,		// 

	/*
	 * スカート区分
	 */
	AMCM_TYPE_SKIRT_TYPE: 123,
	// AMCM_VAL_SKIRT_TYPE_: ,		// 

	/*
	 * パンツ区分
	 */
	AMCM_TYPE_PANTS_TYPE: 124,
	// AMCM_VAL_PANTS_TYPE_: ,		// 

	/*
	 * ベスト区分
	 */
	AMCM_TYPE_VEST_TYPE: 125,
	// AMCM_VAL_VEST_TYPE_: ,		// 

	/*
	 * センターベント区分
	 */
	AMCM_TYPE_CENTER_VENT_TYPE: 126,
	AMCM_VAL_CENTER_VENT_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_CENTER_VENT_TYPE_EXIST: 2,		// 有

	/*
	 * 袖デザイン区分
	 */
	AMCM_TYPE_ARM_DESIGN_TYPE: 127,
	AMCM_VAL_ARM_DESIGN_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_ARM_DESIGN_TYPE_RET_CUFFS: 2,		// リターンカフス

	/*
	 * 内ポケット区分
	 */
	AMCM_TYPE_INNER_POCKET_TYPE: 128,
	AMCM_VAL_INNER_POCKET_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_INNER_POCKET_TYPE_EXIST: 2,		// 有

	/*
	 * 尾錠区分
	 */
	AMCM_TYPE_PIN_BUCKLE_TYPE: 129,
	AMCM_VAL_PIN_BUCKLE_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_PIN_BUCKLE_TYPE_EXIST: 2,		// 有

	/*
	 * ボディ型区分
	 */
	AMCM_TYPE_BODY_FORM_TYPE: 130,
	AMCM_VAL_BODY_FORM_TYPE_PM2: 1,		// PM2(細身)
	AMCM_VAL_BODY_FORM_TYPE_PM3: 2,		// PM3(やや細身)
	AMCM_VAL_BODY_FORM_TYPE_PM4: 3,		// PM4(標準)
	AMCM_VAL_BODY_FORM_TYPE_PM5: 4,		// PM5(ややゆったり)
	AMCM_VAL_BODY_FORM_TYPE_PM7: 5,		// PM7(ゆったり)

	/*
	 * 袖区分
	 */
	AMCM_TYPE_ARM_TYPE: 131,
	AMCM_VAL_ARM_TYPE_LONG: 1,		// 長袖
	AMCM_VAL_ARM_TYPE_SHORT: 2,		// 半袖

	/*
	 * 衿型オプション区分
	 */
	AMCM_TYPE_COLLAR_OPTION_TYPE: 132,
	AMCM_VAL_COLLAR_OPTION_TYPE_TABHOCK: 21,		// タブホック
	AMCM_VAL_COLLAR_OPTION_TYPE_PINHOLE: 22,		// ピンポール
	AMCM_VAL_COLLAR_OPTION_TYPE_SNAPDOWN: 23,		// スナップダウン
	AMCM_VAL_COLLAR_OPTION_TYPE_HALF: 24,		// ハーフワンピース
	AMCM_VAL_COLLAR_OPTION_TYPE_HALF_BD: 25,		// ハーフワンピースＢＤ
	AMCM_VAL_COLLAR_OPTION_TYPE_MITER: 26,		// マイター

	/*
	 * クレリック区分
	 */
	AMCM_TYPE_CLERIC_TYPE: 134,
	AMCM_VAL_CLERIC_TYPE_CC_BROAD: 1,		// 衿・カフス　ブロード
	AMCM_VAL_CLERIC_TYPE_C_BROAD: 2,		// 衿のみ　ブロード
	AMCM_VAL_CLERIC_TYPE_CC_OXFORD: 3,		// 衿・カフス　オックス
	AMCM_VAL_CLERIC_TYPE_C_OXFORD: 4,		// 衿のみ　オックス
	AMCM_VAL_CLERIC_TYPE_CC_TWILL: 5,		// 衿・カフス　ツイル
	AMCM_VAL_CLERIC_TYPE_C_TWILL: 6,		// 衿のみ　ツイル

	/*
	 * 襟芯地区分
	 */
	AMCM_TYPE_INTERFACING_TYPE: 135,
	AMCM_VAL_INTERFACING_TYPE_FUSIBLE: 1,		// 接着芯地
	AMCM_VAL_INTERFACING_TYPE_NOT_FUSIBLE: 2,		// 非接着芯地

	/*
	 * カフス型区分
	 */
	AMCM_TYPE_CUFF_TYPE: 136,
	AMCM_VAL_CUFF_TYPE_ROUND: 1,		// ラウンド
	AMCM_VAL_CUFF_TYPE_KAKUOCHI: 2,		// 角落ち
	AMCM_VAL_CUFF_TYPE_OOMARU: 3,		// 大丸
	AMCM_VAL_CUFF_TYPE_OO_KAKUOCHI: 4,		// 大角落ち
	AMCM_VAL_CUFF_TYPE_SQUARE: 5,		// スクエア
	AMCM_VAL_CUFF_TYPE_KAKUOCHI_TWINPARELL: 6,		// 角落ちツインパレル
	AMCM_VAL_CUFF_TYPE_OOMARU_TWINPARELL: 7,		// 大丸ツインパレル
	AMCM_VAL_CUFF_TYPE_SHORT_ROUND: 8,		// ショートラウンド
	AMCM_VAL_CUFF_TYPE_SHORT_KAKUOCHI: 9,		// ショート角落ち
	AMCM_VAL_CUFF_TYPE_SHORT_SLEEVE: 10,		// 半袖

	/*
	 * 身頃区分
	 */
	AMCM_TYPE_BODY_TYPE: 137,
	// AMCM_VAL_BODY_TYPE_: ,		// 

	/*
	 * AMFステッチオプション区分
	 */
	AMCM_TYPE_AMF_STITCH_OPTION_TYPE: 138,
	AMCM_VAL_AMF_STITCH_OPTION_TYPE_WHITE: 1,		// ホワイト
	AMCM_VAL_AMF_STITCH_OPTION_TYPE_SAX: 2,		// サックス
	AMCM_VAL_AMF_STITCH_OPTION_TYPE_NAVY: 3,		// ネイビー
	AMCM_VAL_AMF_STITCH_OPTION_TYPE_LAVENDER: 4,		// ラベンダー
	AMCM_VAL_AMF_STITCH_OPTION_TYPE_BROWN: 5,		// ブラウン
	AMCM_VAL_AMF_STITCH_OPTION_TYPE_PINK: 6,		// ピンク
	AMCM_VAL_AMF_STITCH_OPTION_TYPE_WINERED: 7,		// ワインレッド
	AMCM_VAL_AMF_STITCH_OPTION_TYPE_PURPLE: 8,		// パープル
	AMCM_VAL_AMF_STITCH_OPTION_TYPE_GRAY: 9,		// グレー
	AMCM_VAL_AMF_STITCH_OPTION_TYPE_BLACK: 10,		// ブラック

	/*
	 * ポケット区分
	 */
	AMCM_TYPE_POCKET_TYPE: 139,
	AMCM_VAL_POCKET_TYPE_NONE: 1,		// 無し
	AMCM_VAL_POCKET_TYPE_ROUND: 2,		// ラウンド
	AMCM_VAL_POCKET_TYPE_KAKUOCHI: 3,		// 角落ち
	AMCM_VAL_POCKET_TYPE_TWO_ROUND: 4,		// 両ポケットラウンド
	AMCM_VAL_POCKET_TYPE_TWO_KAKUOCHI: 5,		// 両ポケット角落ち

	/*
	 * 縫製仕様ポケットチーフオプション区分
	 */
	AMCM_TYPE_POCKET_SQUARE_TYPE: 140,
	// AMCM_VAL_POCKET_SQUARE_TYPE_: ,		// 

	/*
	 * ボタン区分
	 */
	AMCM_TYPE_BUTTON_TYPE: 141,
	AMCM_VAL_BUTTON_TYPE_WHITE_2: 1,		// ホワイト(2mm)
	AMCM_VAL_BUTTON_TYPE_DARK_GRAY_2: 2,		// ダークグレー(2mm)
	AMCM_VAL_BUTTON_TYPE_WHITE_3: 3,		// ホワイト(3mm)
	AMCM_VAL_BUTTON_TYPE_PURPLE_3: 4,		// パープル(3mm)
	AMCM_VAL_BUTTON_TYPE_BROWN_3: 5,		// ブラウン(3mm)
	AMCM_VAL_BUTTON_TYPE_GRAY_3: 6,		// グレー(3mm)
	AMCM_VAL_BUTTON_TYPE_DARK_GRAY_3: 7,		// ダークグレー(3mm)
	AMCM_VAL_BUTTON_TYPE_WINERED_3: 8,		// ワインレッド(3mm)
	AMCM_VAL_BUTTON_TYPE_SAX_3: 9,		// サックス(3mm)
	AMCM_VAL_BUTTON_TYPE_PINK_3: 10,		// ピンク(3mm)
	AMCM_VAL_BUTTON_TYPE_NAVY_3: 11,		// ネイビー(3mm)
	AMCM_VAL_BUTTON_TYPE_SHELL_WHITE_3: 21,		// 貝ボタン白(3mm)
	AMCM_VAL_BUTTON_TYPE_SHELL_BROWN_3: 22,		// 貝ボタン茶蝶(3mm)
	AMCM_VAL_BUTTON_TYPE_SHELL_BLACK_3: 23,		// 貝ボタン黒蝶(3mm)

	/*
	 * ボタンホールオプション区分
	 */
	AMCM_TYPE_BUTTON_HOLE_OPTION_TYPE: 142,
	AMCM_VAL_BUTTON_HOLE_OPTION_TYPE_WHITE: 1,		// ホワイト
	AMCM_VAL_BUTTON_HOLE_OPTION_TYPE_SAX: 2,		// サックス
	AMCM_VAL_BUTTON_HOLE_OPTION_TYPE_NAVY: 3,		// ネイビー
	AMCM_VAL_BUTTON_HOLE_OPTION_TYPE_LAVENDER: 4,		// ラベンダー
	AMCM_VAL_BUTTON_HOLE_OPTION_TYPE_BROWN: 5,		// ブラウン
	AMCM_VAL_BUTTON_HOLE_OPTION_TYPE_PINK: 6,		// ピンク
	AMCM_VAL_BUTTON_HOLE_OPTION_TYPE_WINERED: 7,		// ワインレッド
	AMCM_VAL_BUTTON_HOLE_OPTION_TYPE_PURPLE: 8,		// パープル
	AMCM_VAL_BUTTON_HOLE_OPTION_TYPE_GRAY: 9,		// グレー
	AMCM_VAL_BUTTON_HOLE_OPTION_TYPE_BLACK: 10,		// ブラック

	/*
	 * ボタン付糸オプション区分
	 */
	AMCM_TYPE_BUTTON_SUTURE_TYPE: 143,
	AMCM_VAL_BUTTON_SUTURE_TYPE_WHITE: 1,		// ホワイト
	AMCM_VAL_BUTTON_SUTURE_TYPE_SAX: 2,		// サックス
	AMCM_VAL_BUTTON_SUTURE_TYPE_NAVY: 3,		// ネイビー
	AMCM_VAL_BUTTON_SUTURE_TYPE_LAVENDER: 4,		// ラベンダー
	AMCM_VAL_BUTTON_SUTURE_TYPE_BROWN: 5,		// ブラウン
	AMCM_VAL_BUTTON_SUTURE_TYPE_PINK: 6,		// ピンク
	AMCM_VAL_BUTTON_SUTURE_TYPE_WINERED: 7,		// ワインレッド
	AMCM_VAL_BUTTON_SUTURE_TYPE_PURPLE: 8,		// パープル
	AMCM_VAL_BUTTON_SUTURE_TYPE_GRAY: 9,		// グレー
	AMCM_VAL_BUTTON_SUTURE_TYPE_BLACK: 10,		// ブラック

	/*
	 * イニシャルオプション区分
	 */
	AMCM_TYPE_INITIAL_OPTION_TYPE: 144,
	AMCM_VAL_INITIAL_OPTION_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_INITIAL_OPTION_TYPE_EXIST: 2,		// 有

	/*
	 * 字体区分
	 */
	AMCM_TYPE_FORM_TYPE: 145,
	AMCM_VAL_FORM_TYPE_ORNATE: 1,		// 花文字
	AMCM_VAL_FORM_TYPE_GOTHIC: 2,		// ゴシック体
	AMCM_VAL_FORM_TYPE_CURSIVE: 3,		// 筆記体
	AMCM_VAL_FORM_TYPE_CURSIVE_FULL: 4,		// 筆記体フルネーム

	/*
	 * 場所区分
	 */
	AMCM_TYPE_INITIAL_AREA_TYPE: 146,
	AMCM_VAL_INITIAL_AREA_TYPE_LEFT_SLEEVE: 1,		// 左袖
	AMCM_VAL_INITIAL_AREA_TYPE_LEFT_SLV_CUFF: 2,		// 左袖カフス斜め
	AMCM_VAL_INITIAL_AREA_TYPE_LEFT_CUFF: 3,		// 左カフス
	AMCM_VAL_INITIAL_AREA_TYPE_POCKET: 4,		// ポケット

	/*
	 * 色区分
	 */
	AMCM_TYPE_COLOR_TYPE: 147,
	AMCM_VAL_COLOR_TYPE_WHITE: 1,		// ホワイト
	AMCM_VAL_COLOR_TYPE_SAX: 2,		// サックス
	AMCM_VAL_COLOR_TYPE_NAVY: 3,		// ネイビー
	AMCM_VAL_COLOR_TYPE_LAVENDER: 4,		// ラベンダー
	AMCM_VAL_COLOR_TYPE_BROWN: 5,		// ブラウン
	AMCM_VAL_COLOR_TYPE_PINK: 6,		// ピンク
	AMCM_VAL_COLOR_TYPE_WINERED: 7,		// ワインレッド
	AMCM_VAL_COLOR_TYPE_PURPLE: 8,		// パープル
	AMCM_VAL_COLOR_TYPE_GRAY: 9,		// グレー
	AMCM_VAL_COLOR_TYPE_BLACK: 10,		// ブラック

	/*
	 * 印刷状態区分
	 */
	AMCM_TYPE_PRINT_STATE: 148,
	AMCM_VAL_PRINT_STATE_NOT_PIRNT: 1,		// 印刷未実施
	AMCM_VAL_PRINT_STATE_PRINTED: 2,		// 印刷済
	AMCM_VAL_PRINT_STATE_RE_PRINT: 3,		// 再印刷

	/*
	 * 発送方法区分
	 */
	AMCM_TYPE_SHIP_PAYMENT: 149,
	AMCM_VAL_SHIP_PAYMENT_PAY_ON_DELIVERY: 1,		// 着払い
	AMCM_VAL_SHIP_PAYMENT_PAYID_BY_SHIPPER: 2,		// 元払い

	/*
	 * 登録区分
	 */
	AMCM_TYPE_DATA_ENTRY_TYPE: 150,
	AMCM_VAL_DATA_ENTRY_TYPE_BATCH: 1,		// バッチ
	AMCM_VAL_DATA_ENTRY_TYPE_SERVER: 2,		// 画面
	AMCM_VAL_DATA_ENTRY_TYPE_HT: 3,		// HT

	/*
	 * 備品発注締め状態区分
	 */
	AMCM_TYPE_EQUIP_ORDER_CLOSE_STATE: 151,
	AMCM_VAL_EQUIP_ORDER_CLOSE_STATE_BEFORE_ORDER_CLOSE: 1,		// 発注締め前
	AMCM_VAL_EQUIP_ORDER_CLOSE_STATE_AFTER_ORDER_CLOSE: 2,		// 発注締め後

	/*
	 * 備品発注締め区分
	 */
	AMCM_TYPE_EQUIP_ORDER_CLOSE_TYPE: 152,
	AMCM_VAL_EQUIP_ORDER_CLOSE_TYPE_FIXED_INTERVAL: 1,		// 定時
	AMCM_VAL_EQUIP_ORDER_CLOSE_TYPE_AS_NEEDED: 2,		// 随時

	/*
	 * 補正相殺区分
	 */
	AMCM_TYPE_OFFSET_TYPE: 153,
	AMCM_VAL_OFFSET_TYPE_FIXED: 1,		// 固定相殺
	AMCM_VAL_OFFSET_TYPE_NUMBER: 2,		// 件数入力

	/*
	 * 補正業者帳票出力区分
	 */
	AMCM_TYPE_ADJVEN_OUT_TYPE: 154,
	AMCM_VAL_ADJVEN_OUT_TYPE_NONE: 1,		// 帳票を出力しない
	AMCM_VAL_ADJVEN_OUT_TYPE_TOTAL: 2,		// 帳票は合計だけ出力する
	AMCM_VAL_ADJVEN_OUT_TYPE_DAILY: 3,		// 日別明細も出力する

	/*
	 * 備品発注区分
	 */
	AMCM_TYPE_EQUIP_ORDER_ORG_TYPE: 155,
	AMCM_VAL_EQUIP_ORDER_ORG_TYPE_STORE_ORDER: 1,		// 店舗発注
	AMCM_VAL_EQUIP_ORDER_ORG_TYPE_SC_ORDER: 2,		// 本部一括発注

	/*
	 * 備品発注締めタイミング区分
	 */
	AMCM_TYPE_EQUIP_ODER_CLOSE_TIMING: 156,
	AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_MON: 1,		// 月曜日
	AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_TUE: 2,		// 火曜日
	AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_WED: 3,		// 水曜日
	AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_THU: 4,		// 木曜日
	AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_FRI: 5,		// 金曜日
	AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_SAT: 6,		// 土曜日
	AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_SUN: 7,		// 日曜日
	AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_MONTH_END: 8,		// 月末
	AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_TWO_WEEK_BEFORE_EXECUTE: 9,		// 実施日の２週間前

	/*
	 * 商品系追加処理区分
	 */
	AMCM_TYPE_ITEM_OPE: 157,
	AMCM_VAL_ITEM_OPE_ADDORDER: 101,		// 追加発注
	AMCM_VAL_ITEM_OPE_UPDBASIC: 102,		// 基本属性変更

	/*
	 * 取引区分
	 */
	AMCM_TYPE_DEAL_TYPE: 158,
	AMCM_VAL_DEAL_TYPE_RECEIPT: 1,		// メーカー入荷
	AMCM_VAL_DEAL_TYPE_RETURN: 2,		// メーカー返品
	AMCM_VAL_DEAL_TYPE_TRANS_IN: 3,		// 移動入荷
	AMCM_VAL_DEAL_TYPE_TRANS_OUT: 4,		// 移動出荷
	AMCM_VAL_DEAL_TYPE_RECEIPT_CENTER: 5,		// センター入荷
	AMCM_VAL_DEAL_TYPE_RECEIPT_ERROR_FIX: 6,		// 仕入エラー・訂正
	AMCM_VAL_DEAL_TYPE_TRANS_ERROR_FIX: 7,		// 移動エラー・訂正
	AMCM_VAL_DEAL_TYPE_SALES: 8,		// 売上
	AMCM_VAL_DEAL_TYPE_SALE_RETURN: 9,		// 売上返品
	AMCM_VAL_DEAL_TYPE_DEFECTIVE: 10,		// 不良品

	/*
	 * 新店・既存店区分
	 */
	AMCM_TYPE_STORE_YEARTYPE: 159,
	AMCM_VAL_STORE_YEARTYPE_EXIST: 1,		// 既存店
	AMCM_VAL_STORE_YEARTYPE_2ND: 2,		// ２年目店
	AMCM_VAL_STORE_YEARTYPE_NEW: 3,		// 新店

	/*
	 * 計画区分
	 */
	AMCM_TYPE_PLANTYPE: 160,
	AMCM_VAL_PLANTYPE_OPER: 1,		// 営業計画
	AMCM_VAL_PLANTYPE_ITGRP: 2,		// 品種別計画
	AMCM_VAL_PLANTYPE_SEASON: 3,		// シーズン別計画
	AMCM_VAL_PLANTYPE_ATTR: 4,		// 商品属性別計画
	AMCM_VAL_PLANTYPE_ATTRSIZE: 5,		// 商品属性サイズ別計画
	AMCM_VAL_PLANTYPE_ITEM: 6,		// 品番別計画
	AMCM_VAL_PLANTYPE_ITEMSIZE: 7,		// 品番別サイズ別計画
	AMCM_VAL_PLANTYPE_DIGEST: 8,		// 品番別支持率計画
	AMCM_VAL_PLANTYPE_STOREATTR: 9,		// 店舗別商品属性別計画

	/*
	 * 原価構成表区分
	 */
	AMCM_TYPE_COSTFMT: 161,
	AMCM_VAL_COSTFMT_COMMON: 1,		// 共通
	AMCM_VAL_COSTFMT_JAPAN: 2,		// 国内
	AMCM_VAL_COSTFMT_FOREIGN: 3,		// 海外

	/*
	 * 原価構成項目区分
	 */
	AMCM_TYPE_COSTITEM: 162,
	AMCM_VAL_COSTITEM_INPUT: 1,		// 入力項目
	AMCM_VAL_COSTITEM_CALC: 2,		// 計算項目

	/*
	 * 伝票書式区分
	 */
	AMCM_TYPE_SLIP_FORMAT: 163,
	AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT8: 1,		// 仕入（伝票No8桁）
	AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT6: 2,		// 仕入（伝票No6桁）
	AMCM_VAL_SLIP_FORMAT_TRANS: 3,		// 移動

	/*
	 * 入荷状態区分
	 */
	AMCM_TYPE_DLV_STAT: 164,
	AMCM_VAL_DLV_STAT_DELIVERED: 1,		// 入荷済
	AMCM_VAL_DLV_STAT_DELIVERING: 2,		// 入荷予定未検収
	AMCM_VAL_DLV_STAT_MISSINNG: 3,		// 全欠品

	/*
	 * 発注書区分
	 */
	AMCM_TYPE_ORDER_FUNC: 165,
	AMCM_VAL_ORDER_FUNC_ITEM: 1,		// 商品台帳
	AMCM_VAL_ORDER_FUNC_PACK: 2,		// 発注兼振分書

	/*
	 * 承認区分
	 */
	AMCM_TYPE_APPROVE: 166,
	AMCM_VAL_APPROVE_ENTRY: 1,		// 未申請
	AMCM_VAL_APPROVE_APPLY: 2,		// 申請
	AMCM_VAL_APPROVE_RETURN: 3,		// 差戻し
	AMCM_VAL_APPROVE_APPROVE1: 4,		// 1次承認済
	AMCM_VAL_APPROVE_APPROVE: 5,		// 承認済

	/*
	 * ユーザ区分
	 */
	AMCM_TYPE_USER: 167,
	AMCM_VAL_USER_STAFF: 1,		// 社員ユーザ
	AMCM_VAL_USER_STORE: 2,		// 店舗ユーザ
	AMCM_VAL_USER_STORE_MAN: 3,		// 店長ユーザ
	AMCM_VAL_USER_STAFF_SYS: 4,		// 情シスユーザ
	AMCM_VAL_USER_STAFF_KEISEN: 5,		// 経戦ユーザ

	/*
	 * データパーミッション区分
	 */
	AMCM_TYPE_DATAPERM: 168,
	AMCM_VAL_DATAPERM_FULL: 1,		// 全体
	AMCM_VAL_DATAPERM_UNIT: 2,		// 所属事業ユニットのみ
	AMCM_VAL_DATAPERM_ZONE: 3,		// 所属地区のみ
	AMCM_VAL_DATAPERM_AREA: 4,		// 所属ゾーンのみ

	/*
	 * 機能区分
	 */
	AMCM_TYPE_FUNC: 169,
	AMCM_VAL_FUNC_VIEW: 1,		// 画面
	AMCM_VAL_FUNC_BATCH: 2,		// バッチ

	/*
	 * 機能分類区分
	 */
	AMCM_TYPE_FUNCGRP: 170,
	AMCM_VAL_FUNCGRP_CM: 1,		// 共通

	/*
	 * メンズスタイル・オプション分類
	 */
	AMCM_TYPE_MENS_STYLE_OPT_CLASS: 171,
	AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT: 1,		// スーツ
	AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET: 2,		// ジャケット
	AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS: 3,		// スラックス
	AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST: 4,		// ベスト

	/*
	 * レディススタイル・オプション分類
	 */
	AMCM_TYPE_LADYS_STYLE_OPT_CLASS: 172,
	AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET: 11,		// ジャケット
	AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT: 12,		// スカート
	AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS: 13,		// パンツ
	AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST: 14,		// ベスト

	/*
	 * 送信区分
	 */
	AMCM_TYPE_SEND_METHOD: 173,
	AMCM_VAL_SEND_METHOD_FAX: 1,		// FAX
	AMCM_VAL_SEND_METHOD_MAIL: 2,		// メール

	/*
	 * FAXメーカー記入欄有無区分
	 */
	AMCM_TYPE_FAX_MAKER_WRITE_FIELD: 174,
	AMCM_VAL_FAX_MAKER_WRITE_FIELD_EXIST: 1,		// 有
	AMCM_VAL_FAX_MAKER_WRITE_FIELD_NOT_EXIST: 2,		// 無

	/*
	 * カートリッジ色
	 */
	AMCM_TYPE_CART_COLOR: 175,
	AMCM_VAL_CART_COLOR_BLACK: 1,		// 黒
	AMCM_VAL_CART_COLOR_WHITE: 2,		// 白
	AMCM_VAL_CART_COLOR_BLUE: 3,		// 青

	/*
	 * 袖ボタン４つ区分
	 */
	AMCM_TYPE_FOUR_ARM_BUTTON_TYPE: 176,
	AMCM_VAL_FOUR_ARM_BUTTON_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_FOUR_ARM_BUTTON_TYPE_EXIST: 2,		// 有

	/*
	 * 店舗補正区分
	 */
	AMCM_TYPE_RESIZE_AT_STORE: 177,
	AMCM_VAL_RESIZE_AT_STORE_NONE: 1,		// なし
	AMCM_VAL_RESIZE_AT_STORE_EIGHTSTOP: 2,		// エイトストップ
	AMCM_VAL_RESIZE_AT_STORE_HEARTSHICK: 3,		// ハートシック
	AMCM_VAL_RESIZE_AT_STORE_EIGHTANDHEART: 4,		// エイト＆ハート
	AMCM_VAL_RESIZE_AT_STORE_HEARTSHICK_L: 5,		// ハートシック(L)
	AMCM_VAL_RESIZE_AT_STORE_EIGHTANDHEART_L: 6,		// エイト＆ハート(L)

	/*
	 * 無料胸ポケット区分
	 */
	AMCM_TYPE_FREE_BREAST_POCKET: 178,
	AMCM_VAL_FREE_BREAST_POCKET_NOT_EXIST: 1,		// 無
	AMCM_VAL_FREE_BREAST_POCKET_EXIST: 2,		// 有

	/*
	 * 補正有無区分
	 */
	AMCM_TYPE_IS_RESIZED: 179,
	AMCM_VAL_IS_RESIZED_EXIST: 1,		// あり
	AMCM_VAL_IS_RESIZED_NOT_EXIST: 2,		// なし

	/*
	 * ＰＯＳ機能区分
	 */
	AMCM_TYPE_POS_FUNC: 180,
	AMCM_VAL_POS_FUNC_POS001: 1,		// 売上返品
	AMCM_VAL_POS_FUNC_POS002: 2,		// 売掛返品
	AMCM_VAL_POS_FUNC_POS003: 3,		// 全返品
	AMCM_VAL_POS_FUNC_POS004: 4,		// 交換返品
	AMCM_VAL_POS_FUNC_POS005: 5,		// 売上取消
	AMCM_VAL_POS_FUNC_POS006: 6,		// 返品取消
	AMCM_VAL_POS_FUNC_POS007: 7,		// 売掛返品取消
	AMCM_VAL_POS_FUNC_POS008: 8,		// 入金取消
	AMCM_VAL_POS_FUNC_POS009: 9,		// 出金取消
	AMCM_VAL_POS_FUNC_POS010: 10,		// ポイント任意加算
	AMCM_VAL_POS_FUNC_POS011: 11,		// ポイント任意減算

	/*
	 * ＰＯＳ理由区分
	 */
	AMCM_TYPE_POS_REASON: 181,
	AMCM_VAL_POS_REASON_RT001: 1,		// サイズ交換
	AMCM_VAL_POS_REASON_RT002: 2,		// 色柄交換
	AMCM_VAL_POS_REASON_RT003: 3,		// 割引忘れ
	AMCM_VAL_POS_REASON_RT004: 4,		// ＰＯＳ操作ちがい
	AMCM_VAL_POS_REASON_RT005: 5,		// 提携ポイント対応
	AMCM_VAL_POS_REASON_RT006: 6,		// 商品不具合
	AMCM_VAL_POS_REASON_RT007: 7,		// ご返金対応
	AMCM_VAL_POS_REASON_RT008: 8,		// その他
	AMCM_VAL_POS_REASON_CA001: 9,		// お支払方法ちがい
	AMCM_VAL_POS_REASON_CA002: 10,		// 金額入力ちがい
	AMCM_VAL_POS_REASON_CA003: 11,		// 商品登録ちがい
	AMCM_VAL_POS_REASON_CA004: 12,		// 割引忘れ
	AMCM_VAL_POS_REASON_CA005: 13,		// その他
	AMCM_VAL_POS_REASON_PI001: 14,		// 加算入力忘れ
	AMCM_VAL_POS_REASON_PI002: 15,		// カード切替時対応
	AMCM_VAL_POS_REASON_PI003: 16,		// バースデーＤＭ
	AMCM_VAL_POS_REASON_PI004: 17,		// メルマガ
	AMCM_VAL_POS_REASON_PI005: 18,		// その他
	AMCM_VAL_POS_REASON_PD001: 19,		// 減算入力忘れ
	AMCM_VAL_POS_REASON_PD002: 20,		// カード切替時対応
	AMCM_VAL_POS_REASON_PD003: 21,		// その他

	/*
	 * 返品送付先区分
	 */
	AMCM_TYPE_RETURN_ADDR_TYPE: 182,
	AMCM_VAL_RETURN_ADDR_TYPE_RET_ADDR_TYPE1: 1,		// 返品先住所１
	AMCM_VAL_RETURN_ADDR_TYPE_RET_ADDR_TYPE2: 2,		// 返品先住所２
	AMCM_VAL_RETURN_ADDR_TYPE_RET_ADDR_TYPE3: 3,		// 返品先住所３
	AMCM_VAL_RETURN_ADDR_TYPE_CENTER: 4,		// 倉庫
	AMCM_VAL_RETURN_ADDR_TYPE_MANUAL: 5,		// 手入力

	/*
	 * 計画ブランチ区分
	 */
	AMCM_TYPE_PLAN_BRANCH_TYPE: 183,
	AMCM_VAL_PLAN_BRANCH_TYPE_SIGN: 1,		// 調印計画
	AMCM_VAL_PLAN_BRANCH_TYPE_REAL: 2,		// 本音計画
	AMCM_VAL_PLAN_BRANCH_TYPE_CHALLENGE: 3,		// チャレンジ計画

	/*
	 * 営業計画承認状態区分
	 */
	AMCM_TYPE_OPER_PLAN_APPROVE: 184,
	AMCM_VAL_OPER_PLAN_APPROVE_NOTYET: 1,		// 未申請
	AMCM_VAL_OPER_PLAN_APPROVE_YET: 2,		// 申請中
	AMCM_VAL_OPER_PLAN_APPROVE_AREA: 3,		// 世話人承認
	AMCM_VAL_OPER_PLAN_APPROVE_ZONE: 4,		// 世話人代表承認
	AMCM_VAL_OPER_PLAN_APPROVE_KEISEN: 5,		// 経戦承認

	/*
	 * 承認実行区分
	 */
	AMCM_TYPE_DO_APPROVAL: 185,
	AMCM_VAL_DO_APPROVAL_OK: 1,		// 承認
	AMCM_VAL_DO_APPROVAL_NG: 2,		// 差戻し
	AMCM_VAL_DO_APPROVAL_CANCEL: 3,		// 申請取消
	AMCM_VAL_DO_APPROVAL_NG_ZONEAJA: 4,		// 世話人代表差戻し
	AMCM_VAL_DO_APPROVAL_NG_AREAAJA: 5,		// 世話人差戻し
	AMCM_VAL_DO_APPROVAL_NG_STORE: 6,		// 店舗差戻し

	/*
	 * 補正箇所区分
	 */
	AMCM_TYPE_ADJ_GRP: 186,
	AMCM_VAL_ADJ_GRP_SLACKS: 1,		// スラックス
	AMCM_VAL_ADJ_GRP_JACKET: 2,		// 上着
	AMCM_VAL_ADJ_GRP_COAT: 3,		// コート
	AMCM_VAL_ADJ_GRP_LADIES: 4,		// レディス
	AMCM_VAL_ADJ_GRP_OTHER: 5,		// その他

	/*
	 * 入荷予定期間区分
	 */
	AMCM_TYPE_DELIV_TERM: 187,
	AMCM_VAL_DELIV_TERM_THISWEEK: 1,		// 当週
	AMCM_VAL_DELIV_TERM_NEXTWEEK: 2,		// 翌週
	AMCM_VAL_DELIV_TERM_AFT_NEXTWEEK: 3,		// 翌々週以降

	/*
	 * 補正実績出力区分
	 */
	AMCM_TYPE_ADJ_OUTTYPE: 188,
	AMCM_VAL_ADJ_OUTTYPE_VEND_ADJITEM: 1,		// 業者別補正箇所別実績
	AMCM_VAL_ADJ_OUTTYPE_STORE: 2,		// 店舗別外注工賃実績
	AMCM_VAL_ADJ_OUTTYPE_VENDOR: 3,		// 業者別外注工賃実績

	/*
	 * 支払外注工賃出力区分
	 */
	AMCM_TYPE_ADJAM_OUTTYPE: 189,
	AMCM_VAL_ADJAM_OUTTYPE_LIST: 1,		// 支払外注工賃一覧
	AMCM_VAL_ADJAM_OUTTYPE_ADJ_OFFSET: 2,		// 支払外注工賃相殺
	AMCM_VAL_ADJAM_OUTTYPE_PDF: 3,		// 送付用PDF出力

	/*
	 * 科目区分
	 */
	AMCM_TYPE_ACC_TYPE: 190,
	AMCM_VAL_ACC_TYPE_KOUSEIHI: 1,		// 非課税厚生費
	AMCM_VAL_ACC_TYPE_SHANAI: 2,		// 社内補正工賃
	AMCM_VAL_ACC_TYPE_LEASE: 3,		// リース料
	AMCM_VAL_ACC_TYPE_SLIP: 4,		// 伝票代
	AMCM_VAL_ACC_TYPE_TAG: 5,		// タグ代
	AMCM_VAL_ACC_TYPE_BASE: 6,		// 基本料
	AMCM_VAL_ACC_TYPE_STOCK: 7,		// 在庫照会
	AMCM_VAL_ACC_TYPE_CENTER: 8,		// センター業務料
	AMCM_VAL_ACC_TYPE_CHARGE: 9,		// 諸掛
	AMCM_VAL_ACC_TYPE_SPC: 10,		// スーパークリース

	/*
	 * HTデータ区分
	 */
	AMCM_TYPE_HT_DATA: 191,
	AMCM_VAL_HT_DATA_TRANS_IN: 1,		// 入荷
	AMCM_VAL_HT_DATA_TRANS_OUT: 2,		// 移動出荷
	AMCM_VAL_HT_DATA_INVENT: 3,		// 棚卸
	AMCM_VAL_HT_DATA_INVENT_PRICE: 4,		// プライス別棚卸
	AMCM_VAL_HT_DATA_TRANS_IN_SCM: 5,		// SCM入荷
	AMCM_VAL_HT_DATA_RETURN: 6,		// メーカー返品

	/*
	 * 伝票印刷状態区分
	 */
	AMCM_TYPE_SLIP_PRINT: 192,
	AMCM_VAL_SLIP_PRINT_NOTYET: 1,		// 未印刷
	AMCM_VAL_SLIP_PRINT_DONE: 2,		// 印刷済

	/*
	 * HT処理区分
	 */
	AMCM_TYPE_HT_ACCESS: 193,
	AMCM_VAL_HT_ACCESS_LOAD: 1,		// HTからのデータロード
	AMCM_VAL_HT_ACCESS_SEND_MST: 2,		// HTへのマスタ送り込み
	AMCM_VAL_HT_ACCESS_SEND_PG: 3,		// HTのPG送り込み

	/*
	 * HT処理状態区分
	 */
	AMCM_TYPE_HT_STATUS: 194,
	AMCM_VAL_HT_STATUS_OK: 1,		// 成功
	AMCM_VAL_HT_STATUS_NG_HT: 2,		// HT側エラー発生
	AMCM_VAL_HT_STATUS_NG_PC: 3,		// PC側エラー発生
	AMCM_VAL_HT_STATUS_NG_SV: 4,		// サーバ側エラー発生
	AMCM_VAL_HT_STATUS_NG_OTHER: 5,		// その他エラー発生

	/*
	 * 表示伝票タイプ
	 */
	AMCM_TYPE_DISPSLIP_TYPE: 195,
	AMCM_VAL_DISPSLIP_TYPE_DELIVER: 1,		// 入荷
	AMCM_VAL_DISPSLIP_TYPE_DELIV_RET: 2,		// 入荷返品
	AMCM_VAL_DISPSLIP_TYPE_TRANS_IN: 3,		// 移動入荷
	AMCM_VAL_DISPSLIP_TYPE_TRANS_OUT: 4,		// 移動出荷
	AMCM_VAL_DISPSLIP_TYPE_SALE: 5,		// 売上
	AMCM_VAL_DISPSLIP_TYPE_SALE_RET: 6,		// 売上返品
	AMCM_VAL_DISPSLIP_TYPE_DEFECTIVE: 7,		// 不良品

	/*
	 * 棚卸差異分類区分
	 */
	AMCM_TYPE_INV_DIFF_CLASS: 196,
	AMCM_VAL_INV_DIFF_CLASS_LOSS: 1,		// ロス
	AMCM_VAL_INV_DIFF_CLASS_SURPLUS: 2,		// 逆ロス
	AMCM_VAL_INV_DIFF_CLASS_MASTER_INVALID: 3,		// マスタインバリッド
	AMCM_VAL_INV_DIFF_CLASS_COQY: 4,		// 客注確認

	/*
	 * 移動指示区分
	 */
	AMCM_TYPE_TRANS_INSTRUCT_TYPE: 197,
	AMCM_VAL_TRANS_INSTRUCT_TYPE_ITEM_DEP: 1,		// 商品部依頼
	AMCM_VAL_TRANS_INSTRUCT_TYPE_CUST_REQ: 2,		// 要望対応
	AMCM_VAL_TRANS_INSTRUCT_TYPE_ITEM_DEP_DEPOS: 3,		// 商品部依頼(DePos)

	/*
	 * 登録状態区分
	 */
	AMCM_TYPE_REGIST_STATE_TYPE: 198,
	AMCM_VAL_REGIST_STATE_TYPE_NOT_REGISTRIED: 1,		// 未登録
	AMCM_VAL_REGIST_STATE_TYPE_TEMPORARY: 2,		// 一時保存
	AMCM_VAL_REGIST_STATE_TYPE_REGISTRIED: 3,		// 登録済

	/*
	 * サイズ名称区分
	 */
	AMCM_TYPE_SIZENAME: 199,
	AMCM_VAL_SIZENAME_AOKI: 1,		// AOKI
	AMCM_VAL_SIZENAME_ORIHICA: 2,		// ORIHICA
	AMCM_VAL_SIZENAME_UNFIED: 3,		// 統一名

	/*
	 * 棚卸数量区分
	 */
	AMCM_TYPE_INV_QY_TYPE: 200,
	AMCM_VAL_INV_QY_TYPE_INV_QY: 1,		// 棚卸数
	AMCM_VAL_INV_QY_TYPE_INV_CORR_QY: 2,		// 棚卸数修正
	AMCM_VAL_INV_QY_TYPE_SALES_QY: 3,		// 売上
	AMCM_VAL_INV_QY_TYPE_LOSS_QY: 4,		// ロス
	AMCM_VAL_INV_QY_TYPE_SURPLUS_QY: 5,		// 逆ロス
	AMCM_VAL_INV_QY_TYPE_MASTER_INVALID_QY: 6,		// マスタインバリッド

	/*
	 * 決徳・核商品区分
	 */
	AMCM_TYPE_COREITEM: 201,
	AMCM_VAL_COREITEM_CORE_A: 1,		// 核商品Ａ
	AMCM_VAL_COREITEM_CORE_B: 2,		// 核商品Ｂ

	/*
	 * 移動アラーム区分
	 */
	AMCM_TYPE_TRANS_ALARM_TYPE: 202,
	AMCM_VAL_TRANS_ALARM_TYPE_NO_TRANS_IN: 1,		// 入荷未入力
	AMCM_VAL_TRANS_ALARM_TYPE_NO_TRANS_OUT: 2,		// 出荷未入力
	AMCM_VAL_TRANS_ALARM_TYPE_IN_OUT_DIFF: 3,		// 出荷数・入荷数不一致

	/*
	 * 商品承認区分
	 */
	AMCM_TYPE_ITEM_APPROVE: 203,
	AMCM_VAL_ITEM_APPROVE_TEMP: 1,		// 一時保存
	AMCM_VAL_ITEM_APPROVE_TAGAPPLY: 2,		// タグ発行申請
	AMCM_VAL_ITEM_APPROVE_TAGRET: 3,		// タグ発行差戻し
	AMCM_VAL_ITEM_APPROVE_TAG1ST: 4,		// タグ発行1次承認
	AMCM_VAL_ITEM_APPROVE_TAGAPPROVE: 5,		// タグ発行承認済
	AMCM_VAL_ITEM_APPROVE_APPLY: 6,		// 最終承認申請
	AMCM_VAL_ITEM_APPROVE_RET: 7,		// 最終承認差戻し
	AMCM_VAL_ITEM_APPROVE_1ST: 8,		// 最終承認1次承認
	AMCM_VAL_ITEM_APPROVE_APPROVE: 9,		// 承認済

	/*
	 * 商品編集内容区分
	 */
	AMCM_TYPE_ITEM_EDIT: 204,
	AMCM_VAL_ITEM_EDIT_NEW: 1,		// 新規作成
	AMCM_VAL_ITEM_EDIT_EDIT: 2,		// 保存データ編集
	AMCM_VAL_ITEM_EDIT_ADDORDER: 3,		// 追加発注
	AMCM_VAL_ITEM_EDIT_UPDBASIC: 4,		// 基本属性変更
	AMCM_VAL_ITEM_EDIT_UPD: 5,		// 承認不要変更
	AMCM_VAL_ITEM_EDIT_CANCELORDER: 6,		// 発注取消

	/*
	 * 承認業務区分
	 */
	AMCM_TYPE_APPROVE_FUNC: 205,
	AMCM_VAL_APPROVE_FUNC_ITEM: 1,		// 商品マスタ・返品・マークダウン
	AMCM_VAL_APPROVE_FUNC_BUSIPLAN: 2,		// 営業計画

	/*
	 * 出荷レコード区分
	 */
	AMCM_TYPE_SHIP_REC_TYPE: 206,
	AMCM_VAL_SHIP_REC_TYPE_DETAIL: 1,		// 明細
	AMCM_VAL_SHIP_REC_TYPE_MISS_PART: 2,		// 欠品

	/*
	 * プライスライン区分
	 */
	AMCM_TYPE_PRICELINE: 207,
	AMCM_VAL_PRICELINE_MD: 1,		// 商品部
	AMCM_VAL_PRICELINE_SALES: 2,		// 営業部

	/*
	 * 商品再承認区分
	 */
	AMCM_TYPE_ITEM_REAPPROVE: 208,
	AMCM_VAL_ITEM_REAPPROVE_MST: 1,		// 再
	AMCM_VAL_ITEM_REAPPROVE_ODADD: 2,		// 追
	AMCM_VAL_ITEM_REAPPROVE_ODCANCEL: 3,		// 消

	/*
	 * アラーム区分
	 */
	AMCM_TYPE_ALARM_TYPE: 209,
	AMCM_VAL_ALARM_TYPE_ITEM_APPROVE_REQ: 1,		// 商品台帳承認依頼
	AMCM_VAL_ALARM_TYPE_PACK_APPROVE_REQ: 2,		// 発注兼振分承認依頼
	AMCM_VAL_ALARM_TYPE_ITEM_RET: 3,		// 商品台帳差戻し
	AMCM_VAL_ALARM_TYPE_PACK_RET: 4,		// 発注兼振分差戻し
	AMCM_VAL_ALARM_TYPE_RETURN_REQ: 5,		// 返品依頼
	AMCM_VAL_ALARM_TYPE_NOT_RECEIPT: 6,		// 未入荷アラーム
	AMCM_VAL_ALARM_TYPE_RESIZE: 7,		// 補正件数入力
	AMCM_VAL_ALARM_TYPE_REPORT_RET: 9,		// 棚卸作業完了の差戻し
	AMCM_VAL_ALARM_TYPE_LOSS_SRCH_RET: 10,		// ロス追求完了の差戻し
	AMCM_VAL_ALARM_TYPE_DIFF_SHIP: 11,		// 出荷数相違アラーム
	AMCM_VAL_ALARM_TYPE_DIFF_DELIVE: 12,		// 入荷数相違アラーム
	AMCM_VAL_ALARM_TYPE_PASSWD: 21,		// パスワード変更アラーム
	AMCM_VAL_ALARM_TYPE_DAYPLAN: 22,		// 日別計画未入力
	AMCM_VAL_ALARM_TYPE_DAYPLAN_RETURN: 23,		// 日別計画差し戻し
	AMCM_VAL_ALARM_TYPE_DAYPLAN_APPLY: 24,		// 日別計画申請
	AMCM_VAL_ALARM_TYPE_VENDOR_CORRECT: 25,		// 館内補正業者請求金額入力
	AMCM_VAL_ALARM_TYPE_TRANS_REQ: 26,		// 移動依頼
	AMCM_VAL_ALARM_TYPE_MARKDOWN_REQ: 27,		// マークダウン依頼
	AMCM_VAL_ALARM_TYPE_DEVALUE_REQ: 28,		// 評価減
	AMCM_VAL_ALARM_TYPE_DEFECTIVE_REPORT: 29,		// 不良品処理報告
	AMCM_VAL_ALARM_TYPE_MD_APPROVE_REQ: 32,		// マークダウンの承認依頼
	AMCM_VAL_ALARM_TYPE_MD_RET: 33,		// マークダウンの差戻し
	AMCM_VAL_ALARM_TYPE_DS_APPROVE_REQ: 34,		// 期間値下の承認依頼
	AMCM_VAL_ALARM_TYPE_DS_RET: 35,		// 期間値下の差戻し
	AMCM_VAL_ALARM_TYPE_RT_APPROVE_REQ: 36,		// 返品依頼の承認依頼
	AMCM_VAL_ALARM_TYPE_RT_RET: 37,		// 返品依頼の差戻し
	AMCM_VAL_ALARM_TYPE_COSTPLAN_RETURN: 38,		// 経費計画差し戻し
	AMCM_VAL_ALARM_TYPE_COSTPLAN_APPLY: 39,		// 経費計画申請
	AMCM_VAL_ALARM_TYPE_DAYPLAN_NOTYET: 40,		// 日別計画未申請
	AMCM_VAL_ALARM_TYPE_DAYPLAN_NOTAPPROVE: 41,		// 日別計画未承認
	AMCM_VAL_ALARM_TYPE_TRANS_REQ_DEPOS: 42,		// 移動依頼(リアソート)
	AMCM_VAL_ALARM_TYPE_INVALID_RETURN_REQ_CODE: 43,		// 返品依頼番号誤り
	AMCM_VAL_ALARM_TYPE_PROCESSED_RETURN_REQ_CODE: 44,		// 処理済み返品依頼
	AMCM_VAL_ALARM_TYPE_RETURN_REQ_RFID: 45,		// 返品依頼(RFID)

	/*
	 * 通知区分
	 */
	AMCM_TYPE_NOTICE_TYPE: 210,
	AMCM_VAL_NOTICE_TYPE_INV_CNT: 2,		// 棚卸通知日
	AMCM_VAL_NOTICE_TYPE_TRANS_OUT: 3,		// 移動出荷のお知らせ
	AMCM_VAL_NOTICE_TYPE_TRANS_OUT_SLIP_FIX: 4,		// 移動出荷伝票修正のお知らせ
	AMCM_VAL_NOTICE_TYPE_TRANS_IN_SLIP_FIX: 5,		// 移動入荷伝票修正のお知らせ
	AMCM_VAL_NOTICE_TYPE_TRANS_QY: 6,		// 移動数量のお知らせ
	AMCM_VAL_NOTICE_TYPE_TRANS_REQ: 7,		// 移動依頼実施のお知らせ
	AMCM_VAL_NOTICE_TYPE_DEFECTIVE: 8,		// 不良品処理
	AMCM_VAL_NOTICE_TYPE_SURPLUS: 9,		// 逆ロス追求
	AMCM_VAL_NOTICE_TYPE_HT_CHECKITEM: 10,		// 検品データのHT受信エラー
	AMCM_VAL_NOTICE_TYPE_HT_SCM: 11,		// SCM入荷データのHT受信エラー
	AMCM_VAL_NOTICE_TYPE_HT_BACK: 12,		// 返品データのHT受信エラー
	AMCM_VAL_NOTICE_TYPE_HT_TRANS_OUT: 13,		// 移動出荷データのHT取込エラー
	AMCM_VAL_NOTICE_TYPE_HT_TRANS_IN: 14,		// 移動入荷データのHT取込エラー
	AMCM_VAL_NOTICE_TYPE_HT_INVENT: 15,		// 棚卸データのHT取込エラー
	AMCM_VAL_NOTICE_TYPE_HT_CNT_PRC: 16,		// プライス別棚卸データのHT受信エラー
	AMCM_VAL_NOTICE_TYPE_HT_BACK_OK: 17,		// 返品データのHT受信
	AMCM_VAL_NOTICE_TYPE_HT_TRANS_OUT_OK: 18,		// 移動データのHT受信
	AMCM_VAL_NOTICE_TYPE_DS_END: 19,		// 期間値下終了のお知らせ
	AMCM_VAL_NOTICE_TYPE_RT_PRINT: 20,		// 返品依頼の伝票出力
	AMCM_VAL_NOTICE_TYPE_DAYPLAN_APPROVED: 21,		// 店舗日別計画承認
	AMCM_VAL_NOTICE_TYPE_NODIST: 22,		// 自動振分不可商品
	AMCM_VAL_NOTICE_TYPE_DIFF_DELIVE: 23,		// 入荷数相違
	AMCM_VAL_NOTICE_TYPE_DAYPLAN_APPLY: 24,		// 日別計画申請
	AMCM_VAL_NOTICE_TYPE_TRANS_QY_SZASSORT: 25,		// 移動数量のお知らせ
	AMCM_VAL_NOTICE_TYPE_TRANS_QY_SETUP: 26,		// 移動数量のお知らせ
	AMCM_VAL_NOTICE_TYPE_DAYPLAN_NOTYET: 27,		// 日別計画未申請
	AMCM_VAL_NOTICE_TYPE_HT_INVENT_IMPORTED: 28,		// 棚卸データのHT取込の二重取込エラー
	AMCM_VAL_NOTICE_TYPE_HT_TRANS_OUT_IMPORTED: 29,		// 移動出荷データのHT取込の二重取込エラー
	AMCM_VAL_NOTICE_TYPE_MARKDOWN_EXPIRED: 30,		// マークダウン依頼期限切れ
	AMCM_VAL_NOTICE_TYPE_ECSTOCK_OUT: 31,		// ECセンター在庫欠品
	AMCM_VAL_NOTICE_TYPE_EWS_TRANS: 32,		// EWS売上移動伝票発行
	AMCM_VAL_NOTICE_TYPE_FORM_FAILED: 33,		// 帳票作成失敗
	AMCM_VAL_NOTICE_TYPE_FORM_NO_AUTH: 34,		// 帳票作成権限エラー
	AMCM_VAL_NOTICE_TYPE_FORM_SUCCESS: 35,		// 帳票作成成功
	AMCM_VAL_NOTICE_TYPE_RT_OVER_PRINT: 36,		// 返品依頼の伝票出力(超過数量あり)
	AMCM_VAL_NOTICE_TYPE_DIFF_SHIP: 37,		// 出荷数相違アラーム

	/*
	 * 期間区分
	 */
	AMCM_TYPE_PERIOD_TYPE: 211,
	AMCM_VAL_PERIOD_TYPE_FY: 1,		// 年度
	AMCM_VAL_PERIOD_TYPE_Y2: 2,		// 半期
	AMCM_VAL_PERIOD_TYPE_Y4: 3,		// 四半期
	AMCM_VAL_PERIOD_TYPE_YM: 4,		// 年月
	AMCM_VAL_PERIOD_TYPE_YW: 5,		// 年週
	AMCM_VAL_PERIOD_TYPE_YMD: 6,		// 年月日

	/*
	 * 予測区分
	 */
	AMCM_TYPE_FORE_TYPE: 212,
	AMCM_VAL_FORE_TYPE_DM_DISC: 1,		// DM割引
	AMCM_VAL_FORE_TYPE_COUPON: 2,		// クーポン
	AMCM_VAL_FORE_TYPE_POINT_CARD: 3,		// メンバーズカード
	AMCM_VAL_FORE_TYPE_AVE_COST: 4,		// 平均下代
	AMCM_VAL_FORE_TYPE_REL_2SUITS_RT: 5,		// 関連率(01+01)
	AMCM_VAL_FORE_TYPE_CUR_PRICE: 6,		// 旧価格決着上代
	AMCM_VAL_FORE_TYPE_CUR_PROFIT_RT: 7,		// 旧決着経準率
	AMCM_VAL_FORE_TYPE_NEW_PRICE: 8,		// 新価格決着上代
	AMCM_VAL_FORE_TYPE_NEW_PROFIT_RT: 9,		// 新決着経準率
	AMCM_VAL_FORE_TYPE_DOWN_RT: 10,		// 税込修正へのダウン比率

	/*
	 * Msg区分
	 */
	AMCM_TYPE_MSG_TYPE: 214,
	AMCM_VAL_MSG_TYPE_ALARM: 1,		// アラーム
	AMCM_VAL_MSG_TYPE_NOTICE: 2,		// 通知

	/*
	 * 商品種別
	 */
	AMCM_TYPE_ITEMKIND: 216,
	AMCM_VAL_ITEMKIND_NORMAL: 1,		// 通常
	AMCM_VAL_ITEMKIND_HINSYU: 2,		// 品種ダミー

	/*
	 * 店舗区分
	 */
	AMCM_TYPE_STORE_BUILD_TYPE: 217,
	AMCM_VAL_STORE_BUILD_TYPE_REBUILD: 1,		// 改装
	AMCM_VAL_STORE_BUILD_TYPE_CLOSED: 2,		// 閉店

	/*
	 * 備品担当部署区分
	 */
	AMCM_TYPE_EQUIP_DEPART_TYPE: 218,
	AMCM_VAL_EQUIP_DEPART_TYPE_SOMU: 1,		// 営業支援部
	AMCM_VAL_EQUIP_DEPART_TYPE_HANSOKU: 2,		// 販促部
	AMCM_VAL_EQUIP_DEPART_TYPE_HINSHITSU_KANRI: 3,		// 品質管理部
	AMCM_VAL_EQUIP_DEPART_TYPE_TENPO_KANKYOU: 4,		// 店舗環境企画部
	AMCM_VAL_EQUIP_DEPART_TYPE_EIGYOU_KANRI: 5,		// 営業管理
	AMCM_VAL_EQUIP_DEPART_TYPE_SYSTEM: 6,		// 情報システム本部
	AMCM_VAL_EQUIP_DEPART_TYPE_KEIRI: 7,		// 経理部
	AMCM_VAL_EQUIP_DEPART_TYPE_JINJI: 8,		// 人事部
	AMCM_VAL_EQUIP_DEPART_TYPE_KOTOBUKI_HONPO: 9,		// 寿本舗
	AMCM_VAL_EQUIP_DEPART_TYPE_SHOUHIN_KANRI: 10,		// 商品管理部

	/*
	 * Msg処理区分
	 */
	AMCM_TYPE_MSG_PROC_TYPE: 219,
	AMCM_VAL_MSG_PROC_TYPE_NOT_PROCESS: 1,		// 未処理
	AMCM_VAL_MSG_PROC_TYPE_PROCESSED: 2,		// 処理完了

	/*
	 * Msgアクション区分
	 */
	AMCM_TYPE_MSG_ACTION_TYPE: 220,
	AMCM_VAL_MSG_ACTION_TYPE_ACT_01: 1,		// アラーム完了
	AMCM_VAL_MSG_ACTION_TYPE_ACT_02: 2,		// 出荷数の間違い
	AMCM_VAL_MSG_ACTION_TYPE_ACT_03: 3,		// 入荷数の間違い

	/*
	 * 伝票発行状態区分
	 */
	AMCM_TYPE_SLIP_ISSUE: 221,
	AMCM_VAL_SLIP_ISSUE_YET: 1,		// 未
	AMCM_VAL_SLIP_ISSUE_NOT_YET: 2,		// 済

	/*
	 * 返品移動伝票区分
	 */
	AMCM_TYPE_RET_TRANS_SPLIP_TYPE: 222,
	AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_NOT_REQ: 1,		// 依頼なし返品
	AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_REQ: 2,		// 依頼あり返品
	AMCM_VAL_RET_TRANS_SPLIP_TYPE_TRANS: 3,		// 移動

	/*
	 * 依頼状態区分
	 */
	AMCM_TYPE_REQ_STATUS_TYPE: 223,
	AMCM_VAL_REQ_STATUS_TYPE_REQUEST: 1,		// 依頼あり
	AMCM_VAL_REQ_STATUS_TYPE_UNREQUEST: 2,		// 依頼なし

	/*
	 * 商品属性項目定義区分
	 */
	AMCM_TYPE_IAGFUNC: 224,
	AMCM_VAL_IAGFUNC_RSV: 1,		// 予約
	AMCM_VAL_IAGFUNC_ANY: 2,		// 任意

	/*
	 * 予算対象期区分
	 */
	AMCM_TYPE_BGT_PERIOD: 225,
	AMCM_VAL_BGT_PERIOD_ALL: 1,		// 全期
	AMCM_VAL_BGT_PERIOD_SECOND: 2,		// 下半期

	/*
	 * 仮移動指示区分
	 */
	AMCM_TYPE_TEMP_TRANS: 226,
	AMCM_VAL_TEMP_TRANS_MAKER_CODE: 1,		// 品番
	AMCM_VAL_TEMP_TRANS_SETUP: 2,		// セットアップ

	/*
	 * 商品属性区分
	 */
	AMCM_TYPE_ITEM_ATTR_TYPE: 227,
	AMCM_VAL_ITEM_ATTR_TYPE_SUBCLASS1: 1,		// サブクラス１
	AMCM_VAL_ITEM_ATTR_TYPE_SUBCLASS2: 2,		// サブクラス２
	AMCM_VAL_ITEM_ATTR_TYPE_DESIGN: 3,		// 柄
	AMCM_VAL_ITEM_ATTR_TYPE_COLOR: 4,		// カラー
	AMCM_VAL_ITEM_ATTR_TYPE_METARIAL: 5,		// 素材
	AMCM_VAL_ITEM_ATTR_TYPE_SIZE: 6,		// サイズ
	AMCM_VAL_ITEM_ATTR_TYPE_PRICE: 7,		// プライス

	/*
	 * 前身頃区分
	 */
	AMCM_TYPE_FRONTBODY_TYPE: 228,
	AMCM_VAL_FRONTBODY_TYPE_OMOTE: 1,		// 表前立て
	AMCM_VAL_FRONTBODY_TYPE_URA: 2,		// 裏前立て
	AMCM_VAL_FRONTBODY_TYPE_HIYOKU: 3,		// 比翼前立て
	AMCM_VAL_FRONTBODY_TYPE_HALF: 4,		// ハーフワンピース専用

	/*
	 * 後身頃区分
	 */
	AMCM_TYPE_BACKBODY_TYPE: 229,
	AMCM_VAL_BACKBODY_TYPE_SIDE_TUCK: 1,		// サイドタック
	AMCM_VAL_BACKBODY_TYPE_BOX_PLEATS: 2,		// ボックスプリーツ
	AMCM_VAL_BACKBODY_TYPE_SIDE_DARTS: 3,		// サイドダーツ
	AMCM_VAL_BACKBODY_TYPE_NO_PLEATS: 4,		// ノープリーツ
	AMCM_VAL_BACKBODY_TYPE_YOKE: 5,		// 1枚ヨーク
	AMCM_VAL_BACKBODY_TYPE_YOKE_SIDE_DARTS: 6,		// 1枚ヨークサイドダーツ

	/*
	 * クール区分
	 */
	AMCM_TYPE_COUR: 230,
	AMCM_VAL_COUR_1: 1,		// １クール
	AMCM_VAL_COUR_2: 2,		// ２クール
	AMCM_VAL_COUR_3: 3,		// ３クール
	AMCM_VAL_COUR_4: 4,		// ４クール
	AMCM_VAL_COUR_5: 5,		// ５クール
	AMCM_VAL_COUR_6: 6,		// ６クール

	/*
	 * POサイズ種別区分
	 */
	AMCM_TYPE_POSIZE_TYPE: 231,
	AMCM_VAL_POSIZE_TYPE_MENS: 1,		// メンズ
	AMCM_VAL_POSIZE_TYPE_LADYS_GO: 2,		// レディス（号）
	AMCM_VAL_POSIZE_TYPE_LADYS_SML: 3,		// レディス（SML）
	AMCM_VAL_POSIZE_TYPE_SHIRT: 4,		// シャツ

	/*
	 * 予算パターン区分
	 */
	AMCM_TYPE_BGT_PTN: 232,
	AMCM_VAL_BGT_PTN_B01: 1,		// 期首計画
	AMCM_VAL_BGT_PTN_B02: 2,		// 第2計画
	AMCM_VAL_BGT_PTN_B03: 3,		// 下期計画
	AMCM_VAL_BGT_PTN_B04: 4,		// 第4計画

	/*
	 * 商品ID区分
	 */
	AMCM_TYPE_ITEMID_TYPE: 233,
	AMCM_VAL_ITEMID_TYPE_ITEM: 1,		// 商品マスタ
	AMCM_VAL_ITEMID_TYPE_CITEM: 2,		// カラー商品マスタ
	AMCM_VAL_ITEMID_TYPE_CSITEM: 3,		// カラーサイズ商品マスタ

	/*
	 * 社員区分
	 */
	AMCM_TYPE_STAFF: 234,
	AMCM_VAL_STAFF_DIRECTOR: 1,		// 役員
	AMCM_VAL_STAFF_CORP_OFFICER: 2,		// 執行役員
	AMCM_VAL_STAFF_STAFF: 3,		// 正社員
	AMCM_VAL_STAFF_CONTRACT: 4,		// 契約社員
	AMCM_VAL_STAFF_SALES: 5,		// 販売率先社員
	AMCM_VAL_STAFF_TEMP: 6,		// 派遣社員
	AMCM_VAL_STAFF_PART: 7,		// パート社員
	AMCM_VAL_STAFF_RS_PART: 8,		// 補正パート
	AMCM_VAL_STAFF_ARBEIT: 9,		// アルバイト

	/*
	 * 納品形態表示区分
	 */
	AMCM_TYPE_DISP_DLV_ROUTE: 235,
	AMCM_VAL_DISP_DLV_ROUTE_DIRECT: 1,		// 店直
	AMCM_VAL_DISP_DLV_ROUTE_TC: 2,		// ＴＣ
	AMCM_VAL_DISP_DLV_ROUTE_DC: 4,		// ＤＣ
	AMCM_VAL_DISP_DLV_ROUTE_TRANSFER: 7,		// 移動

	/*
	 * 基準在庫区分
	 */
	AMCM_TYPE_BASESTOCK_TYPE: 236,
	AMCM_VAL_BASESTOCK_TYPE_RANK: 1,		// 店舗ランク別
	AMCM_VAL_BASESTOCK_TYPE_STORE: 2,		// 店舗別

	/*
	 * 経理日報区分
	 */
	AMCM_TYPE_ACC_REPORT_TYPE: 237,
	AMCM_VAL_ACC_REPORT_TYPE_DAILY: 1,		// 経理日報
	AMCM_VAL_ACC_REPORT_TYPE_DETAIL: 2,		// その他入出金明細

	/*
	 * スペア用アジャスター区分
	 */
	AMCM_TYPE_SP_ADJUSTER_TYPE: 238,
	AMCM_VAL_SP_ADJUSTER_TYPE_NOT_EXIST: 1,		// 無
	AMCM_VAL_SP_ADJUSTER_TYPE_EXIST: 2,		// 有

	/*
	 * 商品更新処理パターン区分
	 */
	AMCM_TYPE_ITEM_OPEPTN: 239,
	AMCM_VAL_ITEM_OPEPTN_NEW: 1,		// 新規作成
	AMCM_VAL_ITEM_OPEPTN_NEW_EDIT: 2,		// 編集(未承認)
	AMCM_VAL_ITEM_OPEPTN_TAG_APPLY: 3,		// タグ発行承認申請
	AMCM_VAL_ITEM_OPEPTN_TAG_RETURN: 4,		// タグ発行承認差戻し
	AMCM_VAL_ITEM_OPEPTN_TAG_APPROVE1: 5,		// タグ発行1次承認
	AMCM_VAL_ITEM_OPEPTN_TAG_APPROVE: 6,		// タグ発行2次承認
	AMCM_VAL_ITEM_OPEPTN_APPLY: 7,		// 最終承認申請
	AMCM_VAL_ITEM_OPEPTN_RETURN: 8,		// 最終承認差戻し
	AMCM_VAL_ITEM_OPEPTN_APPROVE1: 9,		// 最終承認1次承認
	AMCM_VAL_ITEM_OPEPTN_APPROVE: 10,		// 最終承認2次承認
	AMCM_VAL_ITEM_OPEPTN_DEL: 11,		// 削除
	AMCM_VAL_ITEM_OPEPTN_EDIT_UPD: 21,		// 再承認不要編集
	AMCM_VAL_ITEM_OPEPTN_CANCEL: 22,		// 予約取消
	AMCM_VAL_ITEM_OPEPTN_MST_EDIT: 31,		// 基本属性編集
	AMCM_VAL_ITEM_OPEPTN_MST_APPLY: 32,		// 基本属性編集承認申請
	AMCM_VAL_ITEM_OPEPTN_MST_RETURN: 33,		// 基本属性編集承認差戻し
	AMCM_VAL_ITEM_OPEPTN_MST_APPROVE1: 34,		// 基本属性編集1次承認
	AMCM_VAL_ITEM_OPEPTN_MST_APPROVE: 35,		// 基本属性編集2次承認
	AMCM_VAL_ITEM_OPEPTN_ODADD_EDIT: 41,		// 追加発注編集
	AMCM_VAL_ITEM_OPEPTN_ODADD_APPLY: 42,		// 追加発注承認申請
	AMCM_VAL_ITEM_OPEPTN_ODADD_RETURN: 43,		// 追加発注承認差戻し
	AMCM_VAL_ITEM_OPEPTN_ODADD_APPROVE1: 44,		// 追加発注1次承認
	AMCM_VAL_ITEM_OPEPTN_ODADD_APPROVE: 45,		// 追加発注2次承認
	AMCM_VAL_ITEM_OPEPTN_ODCAN_EDIT: 51,		// 発注取消編集
	AMCM_VAL_ITEM_OPEPTN_ODCAN_APPLY: 52,		// 発注取消承認申請
	AMCM_VAL_ITEM_OPEPTN_ODCAN_RETURN: 53,		// 発注取消承認差戻し
	AMCM_VAL_ITEM_OPEPTN_ODCAN_APPROVE1: 54,		// 発注取消1次承認
	AMCM_VAL_ITEM_OPEPTN_ODCAN_APPROVE: 55,		// 発注取消2次承認

	/*
	 * 営業計画区分
	 */
	AMCM_TYPE_OPERPLANTYPE: 240,
	AMCM_VAL_OPERPLANTYPE_YEAR: 1,		// 年間営業計画
	AMCM_VAL_OPERPLANTYPE_MONTH: 2,		// 月別営業計画
	AMCM_VAL_OPERPLANTYPE_WEEK: 3,		// 週別営業計画
	AMCM_VAL_OPERPLANTYPE_DAY: 4,		// 日別営業計画

	/*
	 * Msg対象区分
	 */
	AMCM_TYPE_MSG_TARGET_TYPE: 241,
	AMCM_VAL_MSG_TARGET_TYPE_COLORSIZEITEM: 1,		// カラーサイズ商品
	AMCM_VAL_MSG_TARGET_TYPE_ITEM: 2,		// 商品
	AMCM_VAL_MSG_TARGET_TYPE_ITEMPACK: 3,		// 商品一括登録
	AMCM_VAL_MSG_TARGET_TYPE_INVENT: 4,		// 棚卸
	AMCM_VAL_MSG_TARGET_TYPE_HTACCESS: 5,		// ＨＴアクセス
	AMCM_VAL_MSG_TARGET_TYPE_STOREPLANKEY: 6,		// 店舗計画キー
	AMCM_VAL_MSG_TARGET_TYPE_TEMPTRANSFER: 7,		// 仮移動指示
	AMCM_VAL_MSG_TARGET_TYPE_MD: 8,		// マークダウン
	AMCM_VAL_MSG_TARGET_TYPE_DS: 9,		// 期間値下
	AMCM_VAL_MSG_TARGET_TYPE_RT: 10,		// 返品依頼
	AMCM_VAL_MSG_TARGET_TYPE_COSTPLANKEY: 11,		// 経費計画キー
	AMCM_VAL_MSG_TARGET_TYPE_DEFECTIVE: 12,		// 不良品
	AMCM_VAL_MSG_TARGET_TYPE_STOREPLAN_LIMIT_KEY: 13,		// 店舗計画キー
	AMCM_VAL_MSG_TARGET_TYPE_RETURN: 14,		// 返品伝票
	AMCM_VAL_MSG_TARGET_TYPE_TRANS: 15,		// 移動伝票
	AMCM_VAL_MSG_TARGET_TYPE_FORM: 16,		// 帳票作成

	/*
	 * 衿型（標準・オプション１）
	 */
	AMCM_TYPE_COLLAR_OP1_TYPE: 242,
	// AMCM_VAL_COLLAR_OP1_TYPE_: ,		// 

	/*
	 * 衿型（オプション２）
	 */
	AMCM_TYPE_COLLAR_OP2_TYPE: 243,
	// AMCM_VAL_COLLAR_OP2_TYPE_: ,		// 

	/*
	 * 首回り
	 */
	AMCM_TYPE_NECK_SIZE_TYPE: 244,
	// AMCM_VAL_NECK_SIZE_TYPE_: ,		// 

	/*
	 * 裄丈（左）
	 */
	AMCM_TYPE_DEGREE_LEFT_TYPE: 245,
	// AMCM_VAL_DEGREE_LEFT_TYPE_: ,		// 

	/*
	 * 裄丈(右）
	 */
	AMCM_TYPE_DEGREE_RIGHT_TYPE: 246,
	// AMCM_VAL_DEGREE_RIGHT_TYPE_: ,		// 

	/*
	 * イニシャル英字
	 */
	AMCM_TYPE_INITIAL_CHAR_TYPE: 247,
	// AMCM_VAL_INITIAL_CHAR_TYPE_: ,		// 

	/*
	 * 衿芯加工
	 */
	AMCM_TYPE_COLLAR_CORE_TYPE: 248,
	// AMCM_VAL_COLLAR_CORE_TYPE_: ,		// 

	/*
	 * 肩幅
	 */
	AMCM_TYPE_ACROSS_SHOULDERS_TYPE: 249,
	// AMCM_VAL_ACROSS_SHOULDERS_TYPE_: ,		// 

	/*
	 * 胸回り
	 */
	AMCM_TYPE_CHEST_MEASUREMENT_TYPE: 250,
	// AMCM_VAL_CHEST_MEASUREMENT_TYPE_: ,		// 

	/*
	 * 胴回り
	 */
	AMCM_TYPE_WAIST_MEASUREMENT_TYPE: 251,
	// AMCM_VAL_WAIST_MEASUREMENT_TYPE_: ,		// 

	/*
	 * 裾回り
	 */
	AMCM_TYPE_AROUND_BOTTOM_TYPE: 252,
	// AMCM_VAL_AROUND_BOTTOM_TYPE_: ,		// 

	/*
	 * 身丈
	 */
	AMCM_TYPE_BODY_LEN_TYPE: 253,
	// AMCM_VAL_BODY_LEN_TYPE_: ,		// 

	/*
	 * カフス丈（左）
	 */
	AMCM_TYPE_CUFF_LEN_LEFT_TYPE: 254,
	// AMCM_VAL_CUFF_LEN_LEFT_TYPE_: ,		// 

	/*
	 * カフス丈（右）
	 */
	AMCM_TYPE_CUFF_LEN_RIGHT_TYPE: 255,
	// AMCM_VAL_CUFF_LEN_RIGHT_TYPE_: ,		// 

	/*
	 * 出力金額単位区分
	 */
	AMCM_TYPE_OUTPUT_AMT_UNIT: 256,
	AMCM_VAL_OUTPUT_AMT_UNIT_THOUSAND_YEN: 1,		// 千円
	AMCM_VAL_OUTPUT_AMT_UNIT_YEN: 2,		// 円

	/*
	 * 返品・取消・ポイント任意加算区分
	 */
	AMCM_TYPE_DETAIL_OUTPUT_TYPE: 257,
	AMCM_VAL_DETAIL_OUTPUT_TYPE_STORE_RETURN_DETAIL: 1,		// 店舗別返品明細
	AMCM_VAL_DETAIL_OUTPUT_TYPE_CANCEL_REASON: 2,		// 取消理由
	AMCM_VAL_DETAIL_OUTPUT_TYPE_POINT_ADD: 3,		// ポイント任意加算

	/*
	 * 外部ＩＦ相手先区分
	 */
	AMCM_TYPE_OTHER_SYSTEM: 258,
	AMCM_VAL_OTHER_SYSTEM_POS: 1,		// ＰＯＳ
	AMCM_VAL_OTHER_SYSTEM_GV: 2,		// 物流ＧＶ
	AMCM_VAL_OTHER_SYSTEM_SAP: 3,		// 会計ＳＡＰ
	AMCM_VAL_OTHER_SYSTEM_ACUST: 4,		// 新顧客
	AMCM_VAL_OTHER_SYSTEM_GV_EDI: 5,		// ＧＶ－ＥＤＩ／Ｗｅｂ
	AMCM_VAL_OTHER_SYSTEM_EC: 6,		// ＥＣサイト
	AMCM_VAL_OTHER_SYSTEM_BLUECARD: 7,		// ブルーカード
	AMCM_VAL_OTHER_SYSTEM_POSITIVE: 8,		// 人事・給与
	AMCM_VAL_OTHER_SYSTEM_POMAKER: 9,		// POメーカー
	AMCM_VAL_OTHER_SYSTEM_OASYS: 10,		// OASYS
	AMCM_VAL_OTHER_SYSTEM_ECV: 11,		// ECV
	AMCM_VAL_OTHER_SYSTEM_JMA: 12,		// 気象庁
	AMCM_VAL_OTHER_SYSTEM_RFID: 13,		// RFID

	/*
	 * 外部ＩＦ結果区分
	 */
	AMCM_TYPE_OSYSIF_RESULT: 259,
	AMCM_VAL_OSYSIF_RESULT_OK: 1,		// 成功
	AMCM_VAL_OSYSIF_RESULT_WARN: 2,		// 警告
	AMCM_VAL_OSYSIF_RESULT_ERROR: 3,		// エラー
	AMCM_VAL_OSYSIF_RESULT_FATAL: 4,		// 致命的障害

	/*
	 * 不良品状態区分
	 */
	AMCM_TYPE_DEFECTIVE_STATE_TYPE: 260,
	AMCM_VAL_DEFECTIVE_STATE_TYPE_NOT_REGISTRIED: 1,		// 未登録
	AMCM_VAL_DEFECTIVE_STATE_TYPE_TEMPORARY: 2,		// 一時保存
	AMCM_VAL_DEFECTIVE_STATE_TYPE_REGISTRIED: 3,		// 登録済

	/*
	 * セット成立区分
	 */
	AMCM_TYPE_MEET_COMBINED_SALE: 261,
	AMCM_VAL_MEET_COMBINED_SALE_NONE: 10,		// なし
	AMCM_VAL_MEET_COMBINED_SALE_MANUAL: 11,		// 手動
	AMCM_VAL_MEET_COMBINED_SALE_AUTO: 12,		// 自動

	/*
	 * 移動依頼作成状態
	 */
	AMCM_TYPE_TEMP_TRANS_STATUS: 262,
	AMCM_VAL_TEMP_TRANS_STATUS_TEMP: 1,		// 一時保存
	AMCM_VAL_TEMP_TRANS_STATUS_DONE: 2,		// 移動依頼作成済

	/*
	 * POメンズ発注対象区分
	 */
	AMCM_TYPE_POMENS_ORD_TARGET: 263,
	AMCM_VAL_POMENS_ORD_TARGET_SUIT: 1,		// スーツ
	AMCM_VAL_POMENS_ORD_TARGET_JACKET: 2,		// ジャケット
	AMCM_VAL_POMENS_ORD_TARGET_SLACKS: 3,		// スラックス
	AMCM_VAL_POMENS_ORD_TARGET_JACKET_SLACKS: 4,		// ジャケット＆スラックス

	/*
	 * 販促費内容区分
	 */
	AMCM_TYPE_PROMCOST_CONTENTS: 264,
	AMCM_VAL_PROMCOST_CONTENTS_FLYER: 1,		// チラシ
	AMCM_VAL_PROMCOST_CONTENTS_DM: 2,		// ＤＭ
	AMCM_VAL_PROMCOST_CONTENTS_TVCF: 3,		// ＴＶＣＦ

	/*
	 * 商品台帳取込対象区分
	 */
	AMCM_TYPE_ITEMCSV_TGT: 265,
	AMCM_VAL_ITEMCSV_TGT_BASE: 1,		// 基本属性のみ
	AMCM_VAL_ITEMCSV_TGT_ALL: 2,		// 基本属性・カラーサイズ展開
	AMCM_VAL_ITEMCSV_TGT_SMX: 3,		// SMXカタログ

	/*
	 * ウォッシャブル
	 */
	AMCM_TYPE_WASHABLE_TYPE: 266,
	// AMCM_VAL_WASHABLE_TYPE_: ,		// 

	/*
	 * HT入荷区分
	 */
	AMCM_TYPE_HT_DELIV_TYPE: 267,
	AMCM_VAL_HT_DELIV_TYPE_TRANS_IN: 1,		// 移動入荷
	AMCM_VAL_HT_DELIV_TYPE_DELIVER: 2,		// 仕入入荷
	AMCM_VAL_HT_DELIV_TYPE_MANUAL: 3,		// 手書入荷

	/*
	 * 自動振分ロジック
	 */
	AMCM_TYPE_AUTODIST_LOGIC: 268,
	AMCM_VAL_AUTODIST_LOGIC_ONE: 1,		// 上位から１つずつ
	AMCM_VAL_AUTODIST_LOGIC_FULL: 2,		// 上位から振分数

	/*
	 * 追加定型タグ区分
	 */
	AMCM_TYPE_FIXEDFORM_TAG: 269,
	AMCM_VAL_FIXEDFORM_TAG_SECOND: 1,		// ２枚目タグ
	AMCM_VAL_FIXEDFORM_TAG_THIRD: 2,		// ３枚目タグ

	/*
	 * 公開区分
	 */
	AMCM_TYPE_OPEN: 270,
	AMCM_VAL_OPEN_PRIVATE: 1,		// 非公開
	AMCM_VAL_OPEN_PUBORG: 2,		// 所属内公開
	AMCM_VAL_OPEN_PUBLIC: 3,		// 公開

	/*
	 * フォルダ区分
	 */
	AMCM_TYPE_FOLDER: 271,
	AMCM_VAL_FOLDER_SYS: 1,		// システムフォルダ
	AMCM_VAL_FOLDER_USER: 2,		// ユーザフォルダ

	/*
	 * 分析区分
	 */
	AMCM_TYPE_ANAKIND: 272,
	AMCM_VAL_ANAKIND_RESULT: 1,		// 成績表
	AMCM_VAL_ANAKIND_SALES: 2,		// 販売速報
	AMCM_VAL_ANAKIND_SALES_ITGRP: 3,		// 品種別販売速報
	AMCM_VAL_ANAKIND_ITEMCNT: 4,		// 商品構成分析
	AMCM_VAL_ANAKIND_ITEMCNT_STORE: 5,		// 店舗別商品構成分析
	AMCM_VAL_ANAKIND_WEEK: 6,		// 週別時系列分析
	AMCM_VAL_ANAKIND_ABC: 7,		// ABC分析
	AMCM_VAL_ANAKIND_SEXAGE: 8,		// 年代分析
	AMCM_VAL_ANAKIND_BASKET: 9,		// バスケット分析
	AMCM_VAL_ANAKIND_MATRIX: 10,		// 自由分析
	AMCM_VAL_ANAKIND_MATRIX_ZONEAJA: 11,		// 自由分析（世話人代表向け）
	AMCM_VAL_ANAKIND_BASKET_EX: 12,		// バスケット分析（拡張）
	AMCM_VAL_ANAKIND_GROUPBY: 13,		// 新自由分析(GROUPBY)
	AMCM_VAL_ANAKIND_RCPT_QY: 14,		// 併売分析(併売点数分析)
	AMCM_VAL_ANAKIND_RCPT_ITGRP: 15,		// 併売分析(品種別分析)
	AMCM_VAL_ANAKIND_BASKET_EX2: 16,		// バスケット分析（拡張2）
	AMCM_VAL_ANAKIND_FLOW: 17,		// 流入・流出分析
	AMCM_VAL_ANAKIND_SALEREPORT1: 51,		// 売上配信自動化 ゾーン別実績
	AMCM_VAL_ANAKIND_SALEREPORT2: 52,		// 売上配信自動化 週累計
	AMCM_VAL_ANAKIND_SALEREPORT3: 53,		// 売上配信自動化(売上予測) 本日予測
	AMCM_VAL_ANAKIND_SALEREPORT4: 54,		// 売上配信自動化売上予測ダウンロード
	AMCM_VAL_ANAKIND_MONDAY1: 55,		// 月曜会議帳票　【全マーケット】品種別実績
	AMCM_VAL_ANAKIND_MONDAY2: 56,		// 月曜会議帳票　【全マーケット】ゾーン別実績
	AMCM_VAL_ANAKIND_MONDAY3: 57,		// 【全マーケット】ゾーン別実績_グラフ
	AMCM_VAL_ANAKIND_MONDAY4: 58,		// 【全マーケット】ゾーン別実績_顧客・新規別
	AMCM_VAL_ANAKIND_MONDAY5: 59,		// 【全マーケット】品種別x年代別実績TTL
	AMCM_VAL_ANAKIND_MONDAY6: 60,		// 【全マーケット】品種別x年代別実績_新規
	AMCM_VAL_ANAKIND_MONDAY7: 61,		// 【全マーケット】品種別x年代別実績_顧客
	AMCM_VAL_ANAKIND_MONDAY8: 62,		// 【全マーケット】ゾーン別実績x年代別_TTL
	AMCM_VAL_ANAKIND_MONDAY9: 63,		// 【全マーケット】ゾーン別実績x年代別_男性
	AMCM_VAL_ANAKIND_MONDAY10: 64,		// 【全マーケット】ゾーン別実績x年代別_女性
	AMCM_VAL_ANAKIND_MONDAY11: 65,		// 【全マーケット】ゾーン別xクール・ウォーム
	AMCM_VAL_ANAKIND_MONDAY12: 66,		// 月曜会議帳票　週別×ゾーン別_新規顧客実績
	AMCM_VAL_ANAKIND_MONDAY13: 67,		// 週別×ゾーン別_新規顧客実績_2(未使用)
	AMCM_VAL_ANAKIND_MONDAY14: 68,		// 週別×ゾーン別_新規顧客実績_3(未使用)
	AMCM_VAL_ANAKIND_MONDAY15: 69,		// 【全マーケット】ゾーン別実績x品種別
	AMCM_VAL_ANAKIND_MONDAY16: 70,		// 【全マーケット】ゾーン別実績xマーケット別
	AMCM_VAL_ANAKIND_MONDAY17: 71,		// 月曜会議帳票　週間天気予報
	AMCM_VAL_ANAKIND_MONDAY18: 72,		// 週別x品種別実績(既存店)
	AMCM_VAL_ANAKIND_MONDAY19: 73,		// 【全マーケット】品種別実績
	AMCM_VAL_ANAKIND_PREVDAY_AOOR: 74,		// 経戦前日実績_AOKI+ORIHICA
	AMCM_VAL_ANAKIND_PREVDAY_AO: 75,		// 経戦前日実績_AOKI
	AMCM_VAL_ANAKIND_PREVDAY_OR: 76,		// 経戦前日実績_ORIHICA
	AMCM_VAL_ANAKIND_PREVDAY_SMX: 77,		// 経戦前日実績_SMX
	AMCM_VAL_ANAKIND_PREVDAY_EC: 78,		// 経戦前日実績(EC受注ベース)未使用
	AMCM_VAL_ANAKIND_PROM1: 79,		// チラシタイトル別実績
	AMCM_VAL_ANAKIND_PROM2: 80,		// チラシタイトル別実績比較
	AMCM_VAL_ANAKIND_EC_AO: 81,		// EC受注実績_AOKI
	AMCM_VAL_ANAKIND_EC_OR: 82,		// EC受注実績_ORIHCA
	AMCM_VAL_ANAKIND_SALEREPORT5: 83,		// 売上配信自動化個店配信
	AMCM_VAL_ANAKIND_MONDAY20: 84,		// 【全マーケット】品種別実績_顧客・新規別

	/*
	 * 分析用新店ロジック区分
	 */
	AMCM_TYPE_ANA_NEWSTORE_LOGIC: 273,
	AMCM_VAL_ANA_NEWSTORE_LOGIC_BAISOKU: 1,		// 売速
	AMCM_VAL_ANA_NEWSTORE_LOGIC_IR: 2,		// ＩＲ
	AMCM_VAL_ANA_NEWSTORE_LOGIC_PLAN: 3,		// 計画

	/*
	 * 分析条件ビットセット
	 */
	AMCM_TYPE_ANACOND: 274,
	AMCM_VAL_ANACOND_PERIOD: 1,		// 期間
	AMCM_VAL_ANACOND_AXIS: 2,		// 軸
	AMCM_VAL_ANACOND_DISP: 4,		// 表示項目
	AMCM_VAL_ANACOND_STORE: 8,		// 店舗
	AMCM_VAL_ANACOND_ITEM: 16,		// 商品・商品分類
	AMCM_VAL_ANACOND_MEMB: 32,		// 会員
	AMCM_VAL_ANACOND_STAFF: 64,		// 社員
	AMCM_VAL_ANACOND_SALE: 128,		// 売上特性
	AMCM_VAL_ANACOND_MAKER: 256,		// 取引先

	/*
	 * 分析用SMX店舗区分
	 */
	AMCM_TYPE_ANA_STOREATTR_SMX: 275,
	AMCM_VAL_ANA_STOREATTR_SMX_NOP: 1,		// SMX店舗絞込なし
	AMCM_VAL_ANA_STOREATTR_SMX_YES: 2,		// SMX店舗に絞込
	AMCM_VAL_ANA_STOREATTR_SMX_NO: 3,		// SMX店舗以外に絞込

	/*
	 * 自動振分制御区分
	 */
	AMCM_TYPE_AUTODISTCNTL: 276,
	AMCM_VAL_AUTODISTCNTL_NORMAL: 1,		// 通常
	AMCM_VAL_AUTODISTCNTL_TERM: 2,		// 期間別

	/*
	 * 振分用納品形態区分
	 */
	AMCM_TYPE_DIST_DLV_ROUTE: 277,
	AMCM_VAL_DIST_DLV_ROUTE_DIRECT: 1,		// 店直
	AMCM_VAL_DIST_DLV_ROUTE_TC: 2,		// ＴＣ
	AMCM_VAL_DIST_DLV_ROUTE_DC: 3,		// ＤＣ

	/*
	 * SCM入荷区分
	 */
	AMCM_TYPE_SCM_DLV: 278,
	AMCM_VAL_SCM_DLV_DELIVER: 1,		// 入荷
	AMCM_VAL_SCM_DLV_CORRECT: 2,		// 訂正

	/*
	 * 経費計画内部区分
	 */
	AMCM_TYPE_COST_DATA: 279,
	AMCM_VAL_COST_DATA_SC: 1,		// SC案
	AMCM_VAL_COST_DATA_OPER: 2,		// 営業案

	/*
	 * 送信状態区分
	 */
	AMCM_TYPE_SEND_STATE: 280,
	AMCM_VAL_SEND_STATE_NOTYET: 1,		// 未送信
	AMCM_VAL_SEND_STATE_SENT: 2,		// 送信済

	/*
	 * 帳票出力状態区分
	 */
	AMCM_TYPE_REPORT_STATE: 281,
	AMCM_VAL_REPORT_STATE_NOTYET: 1,		// 未出力
	AMCM_VAL_REPORT_STATE_OUTPUT: 2,		// 出力済

	/*
	 * 承認対象データ区分
	 */
	AMCM_TYPE_APPROVE_DATA: 282,
	AMCM_VAL_APPROVE_DATA_MD: 1,		// マークダウン依頼
	AMCM_VAL_APPROVE_DATA_DS: 2,		// 期間値下
	AMCM_VAL_APPROVE_DATA_RT: 3,		// 返品依頼

	/*
	 * 分析用店舗並び順区分
	 */
	AMCM_TYPE_ANA_STORE_SORT: 283,
	AMCM_VAL_ANA_STORE_SORT_CODE: 1,		// コード順
	AMCM_VAL_ANA_STORE_SORT_BAISOKU: 2,		// 売速順

	/*
	 * 分析用新店既存店区分
	 */
	AMCM_TYPE_ANA_NEWSTORE_COND: 284,
	AMCM_VAL_ANA_NEWSTORE_COND_NOP: 1,		// 絞込なし
	AMCM_VAL_ANA_NEWSTORE_COND_NEW: 2,		// 新店のみ
	AMCM_VAL_ANA_NEWSTORE_COND_EXIST: 3,		// 既存店のみ

	/*
	 * POメーカー品番区分
	 */
	AMCM_TYPE_PO_MAKERCODE: 285,
	AMCM_VAL_PO_MAKERCODE_BODY: 1,		// 胴裏
	AMCM_VAL_PO_MAKERCODE_SLEEVE: 2,		// 袖裏
	AMCM_VAL_PO_MAKERCODE_BTN: 3,		// ボタン
	AMCM_VAL_PO_MAKERCODE_INBTN: 4,		// 内ボタン
	AMCM_VAL_PO_MAKERCODE_CCROSS: 5,		// カラークロス
	AMCM_VAL_PO_MAKERCODE_PAT: 6,		// パット
	AMCM_VAL_PO_MAKERCODE_COTTON: 7,		// 裄綿
	AMCM_VAL_PO_MAKERCODE_CORE: 8,		// 毛芯
	AMCM_VAL_PO_MAKERCODE_DRAPE: 9,		// 腰裏
	AMCM_VAL_PO_MAKERCODE_BAG: 10,		// 袋地
	AMCM_VAL_PO_MAKERCODE_BNAME1: 11,		// ブランドネーム①
	AMCM_VAL_PO_MAKERCODE_BNAME2: 12,		// ブランドネーム②
	AMCM_VAL_PO_MAKERCODE_BNAME3: 13,		// ブランドネーム③
	AMCM_VAL_PO_MAKERCODE_RATE1: 14,		// 混紡率①
	AMCM_VAL_PO_MAKERCODE_RATE2: 15,		// 混紡率②
	AMCM_VAL_PO_MAKERCODE_RATE3: 16,		// 混紡率③

	/*
	 * 移動区分
	 */
	AMCM_TYPE_TRANS_PROCESS_TYPE: 286,
	AMCM_VAL_TRANS_PROCESS_TYPE_SCM: 1,		// SCM
	AMCM_VAL_TRANS_PROCESS_TYPE_TRANS: 2,		// 移動

	/*
	 * 移動状況
	 */
	AMCM_TYPE_TRANS_STAT: 287,
	AMCM_VAL_TRANS_STAT_NOTINSTOCK: 1,		// 未入荷
	AMCM_VAL_TRANS_STAT_MISMATCH: 2,		// 入荷不一致

	/*
	 * SCM出荷元区分
	 */
	AMCM_TYPE_SCM_SRC: 288,
	AMCM_VAL_SCM_SRC_VENDOR: 1,		// 取引先
	AMCM_VAL_SCM_SRC_CENTER: 2,		// 倉庫

	/*
	 * 計画シーズン区分
	 */
	AMCM_TYPE_PLAN_SEASON: 289,
	AMCM_VAL_PLAN_SEASON_AW: 1,		// AW
	AMCM_VAL_PLAN_SEASON_SS: 2,		// SS
	AMCM_VAL_PLAN_SEASON_ALL_AW: 3,		// ALL-AW
	AMCM_VAL_PLAN_SEASON_ALL_SS: 4,		// ALL-SS

	/*
	 * 分析用閉店店舗区分
	 */
	AMCM_TYPE_ANA_STOREATTR_CLOSED: 290,
	AMCM_VAL_ANA_STOREATTR_CLOSED_EXCLUDE: 1,		// 閉店店舗を含めない
	AMCM_VAL_ANA_STOREATTR_CLOSED_INCLUDE: 2,		// 閉店店舗を含める

	/*
	 * POネーム区分
	 */
	AMCM_TYPE_PO_NAME_TYPE: 291,
	AMCM_VAL_PO_NAME_TYPE_NONE: 1,		// なし
	AMCM_VAL_PO_NAME_TYPE_KANJI: 2,		// 漢字
	AMCM_VAL_PO_NAME_TYPE_FULL: 3,		// ローマ字
	AMCM_VAL_PO_NAME_TYPE_INITIAL: 4,		// ローマ字イニシャル

	/*
	 * シャツネーム区分
	 */
	AMCM_TYPE_SHIRT_NAME_TYPE: 292,
	AMCM_VAL_SHIRT_NAME_TYPE_NONE: 1,		// なし
	AMCM_VAL_SHIRT_NAME_TYPE_FULL: 2,		// ローマ字(540円)
	AMCM_VAL_SHIRT_NAME_TYPE_INITIAL: 3,		// ローマ字イニシャル(540円)

	/*
	 * 切羽袖口第一ボタンホールカラー糸区分
	 */
	AMCM_TYPE_ARM_1ST_BTN_HOLE_COLOR_TYPE: 293,
	// AMCM_VAL_ARM_1ST_BTN_HOLE_COLOR_TYPE_: ,		// 

	/*
	 * フラワーホールカラー糸区分
	 */
	AMCM_TYPE_FLOWER_HOLE_COLOR_TYPE: 294,
	// AMCM_VAL_FLOWER_HOLE_COLOR_TYPE_: ,		// 

	/*
	 * POネーム区分(展開）
	 */
	AMCM_TYPE_PO_NAME_EX_TYPE: 295,
	AMCM_VAL_PO_NAME_EX_TYPE_NONE: 1,		// なし
	AMCM_VAL_PO_NAME_EX_TYPE_KANJI_FACT: 2,		// 漢字・工場
	AMCM_VAL_PO_NAME_EX_TYPE_FULL_FACT: 3,		// ローマ字・工場
	AMCM_VAL_PO_NAME_EX_TYPE_INITIAL_FACT: 4,		// ローマ字イニシャル・工場
	AMCM_VAL_PO_NAME_EX_TYPE_KANJI_STORE: 5,		// 漢字・店舗
	AMCM_VAL_PO_NAME_EX_TYPE_FULL_STORE: 6,		// ローマ字・店舗
	AMCM_VAL_PO_NAME_EX_TYPE_INITIAL_STORE: 7,		// ローマ字イニシャル・店舗

	/*
	 * 評価減検索日区分2
	 */
	AMCM_TYPE_DEVALUE_SEARCH_DATE2: 296,
	AMCM_VAL_DEVALUE_SEARCH_DATE2_CURRENT_AGE: 1,		// 現在の年令
	AMCM_VAL_DEVALUE_SEARCH_DATE2_NEXT_QUATER: 2,		// 次の四半期末
	AMCM_VAL_DEVALUE_SEARCH_DATE2_NEXTX2_QUATER: 3,		// その次の四半期末

	/*
	 * リターンカフスボタン
	 */
	AMCM_TYPE_ARM_DESIGN_BUTTON_TYPE: 297,
	// AMCM_VAL_ARM_DESIGN_BUTTON_TYPE_: ,		// 

	/*
	 * サイドベンツ
	 */
	AMCM_TYPE_SIDE_BENTS_TYPE: 298,
	// AMCM_VAL_SIDE_BENTS_TYPE_: ,		// 

	/*
	 * アラーム種別
	 */
	AMCM_TYPE_ALARM_KIND: 299,
	AMCM_VAL_ALARM_KIND_BUS_PLAN: 8,		// 営業計画
	AMCM_VAL_ALARM_KIND_COST_PLAN: 9,		// 経費計画
	AMCM_VAL_ALARM_KIND_MST_ADMIN: 11,		// マスタ管理
	AMCM_VAL_ALARM_KIND_DELIVERY: 1,		// 入荷・出荷・返品
	AMCM_VAL_ALARM_KIND_RESIZE: 5,		// 補正
	AMCM_VAL_ALARM_KIND_TRANSFER: 2,		// 移動
	AMCM_VAL_ALARM_KIND_MARKDOWN: 3,		// マークダウン
	AMCM_VAL_ALARM_KIND_DISCSALE: 10,		// 期間値下
	AMCM_VAL_ALARM_KIND_WRITEDOWN: 4,		// 評価減
	AMCM_VAL_ALARM_KIND_INFERIOR: 6,		// 不良品
	AMCM_VAL_ALARM_KIND_INVENT: 7,		// 棚卸
	AMCM_VAL_ALARM_KIND_COMMON: 99,		// 共通(パスワード変更)

	/*
	 * 通知種別
	 */
	AMCM_TYPE_NOTICE_KIND: 300,
	AMCM_VAL_NOTICE_KIND_HHT_NOTICE: 2,		// ＨＨＴ通知
	AMCM_VAL_NOTICE_KIND_BUS_PLAN: 4,		// 営業計画
	AMCM_VAL_NOTICE_KIND_TRANSFER: 1,		// 移動
	AMCM_VAL_NOTICE_KIND_NOT_HHT_NOTICE: 99,		// ＨＨＴ通知以外
	AMCM_VAL_NOTICE_KIND_ETC: 3,		// その他

	/*
	 * 取込対象
	 */
	AMCM_TYPE_TAKE_IN_TARGET: 301,
	AMCM_VAL_TAKE_IN_TARGET_BASE: 1,		// 基準在庫
	AMCM_VAL_TAKE_IN_TARGET_DISTRIBUTE: 2,		// 振分
	AMCM_VAL_TAKE_IN_TARGET_SD_BASE: 3,		// 基準在庫(StoCS)
	AMCM_VAL_TAKE_IN_TARGET_SD_DISTRIBUTE: 4,		// 振分(StoCS)

	/*
	 * 取込モード
	 */
	AMCM_TYPE_TAKE_IN_MODE: 302,
	AMCM_VAL_TAKE_IN_MODE_ADD: 1,		// 登録
	AMCM_VAL_TAKE_IN_MODE_UPD: 2,		// 上書

	/*
	 * 在庫変動
	 */
	AMCM_TYPE_STOCK_CHANGE: 303,
	AMCM_VAL_STOCK_CHANGE_NO: 1,		// 不可

	/*
	 * 分析用SMX・KT商品区分
	 */
	AMCM_TYPE_ANA_ITEMATTR_SMXKT: 304,
	AMCM_VAL_ANA_ITEMATTR_SMXKT_NOP: 1,		// SMX・KT商品絞込なし
	AMCM_VAL_ANA_ITEMATTR_SMXKT_YES: 2,		// SMX・KT商品に絞込
	AMCM_VAL_ANA_ITEMATTR_SMXKT_NO: 3,		// SMX・KT商品以外に絞込

	/*
	 * スケジュールサイクル区分
	 */
	AMCM_TYPE_SCHEDULE_CYCLE: 305,
	AMCM_VAL_SCHEDULE_CYCLE_EVERYDAY: 1,		// 毎日
	AMCM_VAL_SCHEDULE_CYCLE_WDAY: 2,		// 毎週
	AMCM_VAL_SCHEDULE_CYCLE_DOM: 3,		// 毎月
	AMCM_VAL_SCHEDULE_CYCLE_DATE: 4,		// 特定日付

	/*
	 * 分析出力区分
	 */
	AMCM_TYPE_ANA_OUTPUT: 306,
	AMCM_VAL_ANA_OUTPUT_XLS: 1,		// EXCEL
	AMCM_VAL_ANA_OUTPUT_CSV: 2,		// CSV

	/*
	 * SMX開始日
	 */
	AMCM_TYPE_SMX_START_DATE: 307,
	AMCM_VAL_SMX_START_DATE_DATE: 1,		// SMX開始日

	/*
	 * SMX店舗区分
	 */
	AMCM_TYPE_ORG_STOREATTR_SMX: 308,
	AMCM_VAL_ORG_STOREATTR_SMX_UNIT_SMX_STORE: 1,		// 単独
	AMCM_VAL_ORG_STOREATTR_SMX_ANNEX_SMX_STORE: 2,		// 併設別館
	AMCM_VAL_ORG_STOREATTR_SMX_ANNEX_SMX_LARGE_STORE: 3,		// 併設大型
	AMCM_VAL_ORG_STOREATTR_SMX_ANNEX_SMX_SMALLMEDIUM_STORE: 4,		// 併設BY
	AMCM_VAL_ORG_STOREATTR_SMX_ANNEX_SMX_IN_MAILORDER: 5,		// IN通販

	/*
	 * SMX面積(坪)
	 */
	AMCM_TYPE_SMX_FLOOR: 309,
	AMCM_VAL_SMX_FLOOR_FLOOR: 1,		// SMX面積

	/*
	 * 営業開始時間
	 */
	AMCM_TYPE_STORE_OPENING_TIME: 310,
	// AMCM_VAL_STORE_OPENING_TIME_: ,		// 

	/*
	 * 営業終了時間
	 */
	AMCM_TYPE_STORE_CLOSING_TIME: 311,
	// AMCM_VAL_STORE_CLOSING_TIME_: ,		// 

	/*
	 * 営業時間イレギュラー店舗フラグ
	 */
	AMCM_TYPE_F_IRREGULAR_BUSINESS_HOURS_STORE: 312,
	// AMCM_VAL_F_IRREGULAR_BUSINESS_HOURS_STORE_: ,		// 

	/*
	 * 上限在庫設定区分
	 */
	AMCM_TYPE_UP_LIMIT_DIST_SET: 313,
	AMCM_VAL_UP_LIMIT_DIST_SET_NO: 1,		// 設定しない
	AMCM_VAL_UP_LIMIT_DIST_SET_YES: 2,		// 設定する

	/*
	 * 店舗在庫振分区分
	 */
	AMCM_TYPE_STORE_STOCK_DIST: 314,
	AMCM_VAL_STORE_STOCK_DIST_ZERO: 1,		// 在庫0として振分
	AMCM_VAL_STORE_STOCK_DIST_MINUS: 2,		// マイナス在庫に振分

	/*
	 * 送信マスタ区分
	 */
	AMCM_TYPE_EXPORT_MST: 315,
	AMCM_VAL_EXPORT_MST_ORG: 1,		// 組織マスタ

	/*
	 * EC注文・数量指定種別
	 */
	AMCM_TYPE_ECORD_QTY_SPECIFY: 316,
	AMCM_VAL_ECORD_QTY_SPECIFY_QTY: 1,		// 数量指定
	AMCM_VAL_ECORD_QTY_SPECIFY_ALL: 2,		// 全数

	/*
	 * EC注文・注文種別
	 */
	AMCM_TYPE_ECORD_ORDER: 317,
	AMCM_VAL_ECORD_ORDER_ORDER: 1,		// 注文
	AMCM_VAL_ECORD_ORDER_COME_STORE: 2,		// 来店予定
	AMCM_VAL_ECORD_ORDER_TRANS: 3,		// 在庫移動

	/*
	 * EC注文・注文ステータス
	 */
	AMCM_TYPE_ECORD_ORDER_STATUS: 318,
	AMCM_VAL_ECORD_ORDER_STATUS_CONFIRMED: 1,		// 注文確認中
	AMCM_VAL_ECORD_ORDER_STATUS_ACCEPT: 2,		// 注文受
	AMCM_VAL_ECORD_ORDER_STATUS_ACHIEVING: 3,		// 一部引当済み
	AMCM_VAL_ECORD_ORDER_STATUS_ACHIEVED_ALL: 4,		// 全部引当済み
	AMCM_VAL_ECORD_ORDER_STATUS_PREPARING: 5,		// 商品準備中
	AMCM_VAL_ECORD_ORDER_STATUS_HOLD_SHIPPING: 6,		// 出荷保留
	AMCM_VAL_ECORD_ORDER_STATUS_SHIPPED: 7,		// 出荷済み
	AMCM_VAL_ECORD_ORDER_STATUS_CANCEL: 8,		// キャンセル
	AMCM_VAL_ECORD_ORDER_STATUS_FAILED: 9,		// 注文失敗

	/*
	 * EC注文・売上確定ステータス
	 */
	AMCM_TYPE_ECORD_PROCEEDS_FIXED: 319,
	AMCM_VAL_ECORD_PROCEEDS_FIXED_NOT_TARGET: 100,		// 確定対象外
	AMCM_VAL_ECORD_PROCEEDS_FIXED_TARGET: 101,		// 確定対象
	AMCM_VAL_ECORD_PROCEEDS_FIXED_FIXED: 199,		// 確定完了

	/*
	 * EC注文・シミュレーション判定
	 */
	AMCM_TYPE_ECORD_SIMULATION_DICISION: 320,
	AMCM_VAL_ECORD_SIMULATION_DICISION_NORMAL: 10,		// 通常
	AMCM_VAL_ECORD_SIMULATION_DICISION_SIMULATION: 11,		// シミュレーション

	/*
	 * EC注文・決済方法
	 */
	AMCM_TYPE_ECORD_PAYMENT_METHOD: 321,
	AMCM_VAL_ECORD_PAYMENT_METHOD_NONE: 10,		// 指定なし
	AMCM_VAL_ECORD_PAYMENT_METHOD_COD: 11,		// 代引き
	AMCM_VAL_ECORD_PAYMENT_METHOD_CREDITCARD: 12,		// クレジットカード
	AMCM_VAL_ECORD_PAYMENT_METHOD_AFTER_PAYMENT: 13,		// 後払い
	AMCM_VAL_ECORD_PAYMENT_METHOD_EXCHANGE_SHIP: 14,		// 交換出荷
	AMCM_VAL_ECORD_PAYMENT_METHOD_PAY_IN_STORE: 15,		// 店舗決済
	AMCM_VAL_ECORD_PAYMENT_METHOD_AMAZONPAY: 16,		// AmazonPay
	AMCM_VAL_ECORD_PAYMENT_METHOD_POINT: 17,		// 全額ポイント
	AMCM_VAL_ECORD_PAYMENT_METHOD_CREDITCARD2: 18,		// クレジットカード2
	AMCM_VAL_ECORD_PAYMENT_METHOD_CARRIER: 19,		// キャリア

	/*
	 * EC注文・注文明細ステータス
	 */
	AMCM_TYPE_ECORD_ORDER_SLIP_STATUS: 322,
	AMCM_VAL_ECORD_ORDER_SLIP_STATUS_NORMAL: 1,		// 通常
	AMCM_VAL_ECORD_ORDER_SLIP_STATUS_CANCEL: 2,		// キャンセル

	/*
	 * EC注文・商品種別
	 */
	AMCM_TYPE_ECORD_ITEM: 323,
	AMCM_VAL_ECORD_ITEM_SINGLE_ITEM: 1,		// 単品
	AMCM_VAL_ECORD_ITEM_SET: 2,		// セット品
	AMCM_VAL_ECORD_ITEM_SERVICE: 3,		// サービス品
	AMCM_VAL_ECORD_ITEM_NOVELTIY: 4,		// ノベルティ
	AMCM_VAL_ECORD_ITEM_GIFT: 5,		// ギフト
	AMCM_VAL_ECORD_ITEM_SYSTEM_ADMIN: 6,		// システム管理品
	AMCM_VAL_ECORD_ITEM_CHARGE_COD: 7,		// 代引手数料
	AMCM_VAL_ECORD_ITEM_SHIPPING_FEE: 9,		// 送料
	AMCM_VAL_ECORD_ITEM_CAMPAIGN: 10,		// キャンペーン
	AMCM_VAL_ECORD_ITEM_POINT: 11,		// ポイント
	AMCM_VAL_ECORD_ITEM_SALES_TAX: 12,		// 消費税

	/*
	 * EC注文・課税種別
	 */
	AMCM_TYPE_ECORD_TAXED: 324,
	AMCM_VAL_ECORD_TAXED_TAX: 1,		// 課税
	AMCM_VAL_ECORD_TAXED_NO_TAX: 2,		// 非課税

	/*
	 * EC注文・在庫ステータス
	 */
	AMCM_TYPE_ECORD_STOCK_STATUS: 325,
	AMCM_VAL_ECORD_STOCK_STATUS_REAL: 1,		// 実在庫
	AMCM_VAL_ECORD_STOCK_STATUS_PLAN: 2,		// 予定在庫
	AMCM_VAL_ECORD_STOCK_STATUS_ZERO: 99,		// 在庫なし

	/*
	 * EC注文・変更種別
	 */
	AMCM_TYPE_ECORD_CHANGE: 326,
	AMCM_VAL_ECORD_CHANGE_NO_CHANGE: 10,		// 変更なし
	AMCM_VAL_ECORD_CHANGE_CHANGE_ITEM: 11,		// 商品変更
	AMCM_VAL_ECORD_CHANGE_CANCEL: 12,		// キャンセル
	AMCM_VAL_ECORD_CHANGE_RETURN: 13,		// 返品
	AMCM_VAL_ECORD_CHANGE_RETURN_DEL: 14,		// 返品削除
	AMCM_VAL_ECORD_CHANGE_CHANGE_SHIPPING_ADDR: 15,		// 配送先情報変更
	AMCM_VAL_ECORD_CHANGE_CHANGE_SHIPPING_CENTER: 16,		// 倉庫出荷指示変更
	AMCM_VAL_ECORD_CHANGE_CHANGE_SHIPPED_ORD: 17,		// 出荷済み変更情報変更

	/*
	 * 来店種別
	 */
	AMCM_TYPE_STORE_VISIT_TYPE: 327,
	AMCM_VAL_STORE_VISIT_TYPE_STORE_RECEIVE: 1,		// 店舗受取
	AMCM_VAL_STORE_VISIT_TYPE_TRIAL_RESERVE: 2,		// 試着予約
	AMCM_VAL_STORE_VISIT_TYPE_SOLD: 3,		// 取置（試着）予約（売上有）

	/*
	 * マークダウン
	 */
	AMCM_TYPE_MARKDOWN: 328,
	AMCM_VAL_MARKDOWN_MARKDOWN: 1,		// マークダウン
	AMCM_VAL_MARKDOWN_CHANGE_ORG_PRICE: 2,		// 元上代修正
	AMCM_VAL_MARKDOWN_SUPER_DISCOUNT: 3,		// 超特価
	AMCM_VAL_MARKDOWN_RESTORE_PRICE: 4,		// 上代戻し

	/*
	 * 商品特性区分
	 */
	AMCM_TYPE_ITEM_FEATURE: 329,
	AMCM_VAL_ITEM_FEATURE_MANUAL: 1,		// 手動
	AMCM_VAL_ITEM_FEATURE_AUTO: 2,		// 自動
	AMCM_VAL_ITEM_FEATURE_EC: 3,		// EC

	/*
	 * 帳票出力形式区分
	 */
	AMCM_TYPE_FORM_OUTPUT: 330,
	AMCM_VAL_FORM_OUTPUT_EXCEL: 1,		// Excel
	AMCM_VAL_FORM_OUTPUT_PDF: 2,		// PDF
	AMCM_VAL_FORM_OUTPUT_IMAGE: 3,		// 画像

	/*
	 * 呼出機能区分
	 */
	AMCM_TYPE_FORM_FUNC: 331,
	AMCM_VAL_FORM_FUNC_MD_ANA: 1,		// MD分析
	AMCM_VAL_FORM_FUNC_MD_NEWANA: 2,		// MD新分析
	AMCM_VAL_FORM_FUNC_MD_FORM: 3,		// MD帳票
	AMCM_VAL_FORM_FUNC_CUST_ANA: 4,		// 顧客分析

	/*
	 * 流入・流出区分
	 */
	AMCM_TYPE_MEMBIO: 332,
	AMCM_VAL_MEMBIO_IN: 1,		// 流入
	AMCM_VAL_MEMBIO_OUT: 2,		// 流出

	/*
	 * 天気情報区分
	 */
	AMCM_TYPE_WEATHER_DATA: 333,
	AMCM_VAL_WEATHER_DATA_FORECAST: 1,		// 天気予報
	AMCM_VAL_WEATHER_DATA_ACT: 2,		// 天気実績

	/*
	 * 分析設定区分
	 */
	AMCM_TYPE_ANACONF: 334,
	AMCM_VAL_ANACONF_AO_NEWST_SAT: 1,		// 売上予測AOKI新店土曜日構成比
	AMCM_VAL_ANACONF_AO_NEWST_SUN: 2,		// 売上予測AOKI新店日曜日構成比
	AMCM_VAL_ANACONF_OR_NEWST_SAT: 3,		// 売上予測ORII新店土曜日構成比
	AMCM_VAL_ANACONF_OR_NEWST_SUN: 4,		// 売上予測ORI新店日曜日構成比
	AMCM_VAL_ANACONF_OMIT_ST: 5,		// 既存店除外
	AMCM_VAL_ANACONF_SHRT_SHORT_SEASON: 6,		// シャツ半袖対象シーズン
	AMCM_VAL_ANACONF_SHRT_LONG_SEASON: 7,		// シャツ長袖対象シーズン
	AMCM_VAL_ANACONF_FML_SUMMER_SEASON: 8,		// 礼服夏シーズン
	AMCM_VAL_ANACONF_FML_ALL_SEASON: 9,		// 礼服オールシーズン
	AMCM_VAL_ANACONF_SUIT_SS_SEASON: 10,		// スーツSSシーズン
	AMCM_VAL_ANACONF_SUIT_AW_SEASON: 11,		// スーツAWシーズン
	AMCM_VAL_ANACONF_COOL_OR_WARM: 12,		// クールビズ・ウォームビズ設定
	AMCM_VAL_ANACONF_MON_RESP_DEPT: 13,		// 月曜会議帳票責任者所属
	AMCM_VAL_ANACONF_MON_RESP: 14,		// 月曜会議帳票責任者氏名
	AMCM_VAL_ANACONF_SHRT_SHORT_SEASON_COM: 15,		// 月曜会議帳票シャツ半袖コメント
	AMCM_VAL_ANACONF_SHRT_LONG_SEASON_COM: 16,		// 月曜会議帳票シャツ長袖コメント
	AMCM_VAL_ANACONF_FML_SUMMER_SEASON_COM: 17,		// 月曜会議帳票礼服サマーコメント
	AMCM_VAL_ANACONF_FML_ALL_SEASON_COM: 18,		// 月曜会議帳票礼服オールシーズンコメント
	AMCM_VAL_ANACONF_SUIT_SS_SEASON_COM: 19,		// 月曜会議帳票スーツSSコメント
	AMCM_VAL_ANACONF_SUIT_AW_SEASON_COM: 20,		// 月曜会議帳票スーツAWコメント
	AMCM_VAL_ANACONF_NEW_ST: 21,		// 売上配信自動化個店配信対象

	/*
	 * ポイントカード種別
	 */
	AMCM_TYPE_POINTCARD_TYPE: 335,
	AMCM_VAL_POINTCARD_TYPE_DPOINT: 1,		// dポイント
	AMCM_VAL_POINTCARD_TYPE_PONTA: 2,		// Ponta

	/*
	 * エラー時進捗
	 */
	AMCM_TYPE_FORM_ERR_PROGRESS: 336,
	AMCM_VAL_FORM_ERR_PROGRESS_INIT: 1,		// 初期処理中
	AMCM_VAL_FORM_ERR_PROGRESS_COND: 2,		// 呼出機能取得完了
	AMCM_VAL_FORM_ERR_PROGRESS_ANA: 3,		// 分析結果取得完了
	AMCM_VAL_FORM_ERR_PROGRESS_EXCEL: 4,		// Excel帳票作成完了
	AMCM_VAL_FORM_ERR_PROGRESS_TRANS: 5,		// 帳票形式変換完了
	AMCM_VAL_FORM_ERR_PROGRESS_FOLDER: 6,		// 公開フォルダ移動完了
	AMCM_VAL_FORM_ERR_PROGRESS_MAIL: 7,		// メール配信完了

	/*
	 * 分析設定グループ
	 */
	AMCM_TYPE_ANACONF_GROUP: 337,
	AMCM_VAL_ANACONF_GROUP_SALE: 1,		// 売上予測構成比設定
	AMCM_VAL_ANACONF_GROUP_EXIST: 2,		// 既存店設定
	AMCM_VAL_ANACONF_GROUP_MONDAY: 3,		// 月曜会議帳票設定

	/*
	 * 全店評価減対象
	 */
	AMCM_TYPE_ALLWRITEDOWN: 338,
	AMCM_VAL_ALLWRITEDOWN_NONE: 1,		// 全店以外
	AMCM_VAL_ALLWRITEDOWN_ALL: 2,		// 全店

	/*
	 * 会員種別
	 */
	AMCM_TYPE_MEMB_TYPE: 339,
	AMCM_VAL_MEMB_TYPE_OMNI: 1,		// オムニチャネル会員
	AMCM_VAL_MEMB_TYPE_STORE: 2,		// 店舗のみ会員
	AMCM_VAL_MEMB_TYPE_EC: 3,		// ECのみ会員
	AMCM_VAL_MEMB_TYPE_EXIT: 4,		// 離脱会員

	/*
	 * 分析クールビズ・ウォームビズ設定
	 */
	AMCM_TYPE_ANACONF_CW: 340,
	AMCM_VAL_ANACONF_CW_COOL: 1,		// クールビズ
	AMCM_VAL_ANACONF_CW_WARM: 2,		// ウォームビズ

	/*
	 * StoCS_商品区分
	 */
	AMCM_TYPE_SD_ITEM_TYPE: 341,
	AMCM_VAL_SD_ITEM_TYPE_ITEM: 1,		// 通常商品
	AMCM_VAL_SD_ITEM_TYPE_PACKITEM: 2,		// 集約商品
	AMCM_VAL_SD_ITEM_TYPE_SDPACKITEM: 3,		// 振分用集約商品

	/*
	 * StoCS_取込マスタ種別区分
	 */
	AMCM_TYPE_SD_INPUT_MASTER_TYPE: 342,
	AMCM_VAL_SD_INPUT_MASTER_TYPE_ITGRP: 1,		// 品種
	AMCM_VAL_SD_INPUT_MASTER_TYPE_CATEGORY: 2,		// 商品カテゴリ
	AMCM_VAL_SD_INPUT_MASTER_TYPE_ITEM: 3,		// カラー商品
	AMCM_VAL_SD_INPUT_MASTER_TYPE_STORE_ITEM: 4,		// 店舗xカラー商品

	/*
	 * 店舗評価減対象
	 */
	AMCM_TYPE_STOREWRITEDOWN: 343,
	AMCM_VAL_STOREWRITEDOWN_OFF: 1,		// 対象外
	AMCM_VAL_STOREWRITEDOWN_ON: 2,		// 対象

	/*
	 * MDB役職区分
	 */
	AMCM_TYPE_MDB_STAFFPOST: 344,
	AMCM_VAL_MDB_STAFFPOST_ALL: 1,		// 全従業員
	AMCM_VAL_MDB_STAFFPOST_STORE_ALL: 2,		// 店舗全社員
	AMCM_VAL_MDB_STAFFPOST_SENIOR_MANAGER: 3,		// 世話人代表
	AMCM_VAL_MDB_STAFFPOST_MANAGER: 4,		// 世話人
	AMCM_VAL_MDB_STAFFPOST_STORE_MANAGER: 5,		// 総店長・店長
	AMCM_VAL_MDB_STAFFPOST_SUB_MANAGER: 6,		// 副店長
	AMCM_VAL_MDB_STAFFPOST_GENERAL: 7,		// 一般
	AMCM_VAL_MDB_STAFFPOST_PARTNER: 8,		// パートナー・アルバイト
	AMCM_VAL_MDB_STAFFPOST_SC: 9,		// SC社員

	/*
	 * StoCS_入力区分
	 */
	AMCM_TYPE_SD_INPUT_UNIT: 345,
	AMCM_VAL_SD_INPUT_UNIT_ITGRP: 1,		// 品種
	AMCM_VAL_SD_INPUT_UNIT_SUB1: 2,		// サブクラス１
	AMCM_VAL_SD_INPUT_UNIT_SUB2: 3,		// サブクラス２
	AMCM_VAL_SD_INPUT_UNIT_STYLE: 4,		// スタイル
	AMCM_VAL_SD_INPUT_UNIT_SEASON: 5,		// シーズン
	AMCM_VAL_SD_INPUT_UNIT_COLOR: 6,		// カラー
	AMCM_VAL_SD_INPUT_UNIT_ITEM: 7,		// 商品
	AMCM_VAL_SD_INPUT_UNIT_CITEM: 8,		// カラー商品
	AMCM_VAL_SD_INPUT_UNIT_ST_ITGRP: 9,		// 店舗x品種
	AMCM_VAL_SD_INPUT_UNIT_ST_SUB1: 10,		// 店舗xサブクラス１
	AMCM_VAL_SD_INPUT_UNIT_ST_SUB2: 11,		// 店舗xサブクラス２
	AMCM_VAL_SD_INPUT_UNIT_ST_STYLE: 12,		// 店舗xスタイル
	AMCM_VAL_SD_INPUT_UNIT_ST_SEASON: 13,		// 店舗xシーズン
	AMCM_VAL_SD_INPUT_UNIT_ST_COLOR: 14,		// 店舗xカラー
	AMCM_VAL_SD_INPUT_UNIT_ST_ITEM: 15,		// 店舗x商品
	AMCM_VAL_SD_INPUT_UNIT_ST_CITEM: 16,		// 店舗xカラー商品

	/*
	 * テイクアウト区分
	 */
	AMCM_TYPE_EC_TAKEOUT: 346,
	AMCM_VAL_EC_TAKEOUT_TAKEOUT: 1,		// テイクアウト
	AMCM_VAL_EC_TAKEOUT_NONE: 2,		// 非テイクアウト

	/*
	 * 店舗受取区分
	 */
	AMCM_TYPE_EC_STORERCPT: 347,
	AMCM_VAL_EC_STORERCPT_STORERCPT: 1,		// 店舗受取
	AMCM_VAL_EC_STORERCPT_NONE: 2,		// 非店舗受取

	/*
	 * 取置予約区分
	 */
	AMCM_TYPE_EC_RESERVE: 348,
	AMCM_VAL_EC_RESERVE_RESERVE: 1,		// 取置予約
	AMCM_VAL_EC_RESERVE_NONE: 2,		// 非取置予約

	/*
	 * ウェブオーダー区分
	 */
	AMCM_TYPE_EC_WEBORDER: 349,
	AMCM_VAL_EC_WEBORDER_WEBORDER: 1,		// ウェブオーダー
	AMCM_VAL_EC_WEBORDER_NONE: 2,		// 非ウェブオーダー

	_eof: 'end of amcm_type//'
};
var amdb_defs = {
	AM_PA_DEFS_KIND_NON: 0,
	AMDB_DEFS_F_GENLIST_STORE: 1,
	AMDB_DEFS_F_GENLIST_ITEM: 2,
	AMDB_DEFS_F_GENLIST_MEMB: 3,
	AMDB_DEFS_F_GENLIST_ADDR: 4,
	AMDB_DEFS_F_GENLIST_MEMB_TMP: 13,
	AM_PA_DEFS_KIND_ORG_MIN: 100,
	AM_PA_DEFS_KIND_ORG: 101,
	AM_PA_DEFS_KIND_STORE: 102,
	AM_PA_DEFS_KIND_STORELIST: 103,
	AM_PA_DEFS_KIND_ORG_MAX: 199,
	AM_PA_DEFS_KIND_ITGRP_MIN: 200,
	AM_PA_DEFS_KIND_ITGRP: 201,
	AM_PA_DEFS_KIND_ITEM: 202,
	AM_PA_DEFS_KIND_SKUCS: 203,
	AM_PA_DEFS_KIND_ITEMATTR_MIN: 210,
	AM_PA_DEFS_KIND_ITEMATTR_SUBCLASS1: 211,
	AM_PA_DEFS_KIND_ITEMATTR_SUBCLASS2: 212,
	AM_PA_DEFS_KIND_ITEMATTR_BRAND: 213,
	AM_PA_DEFS_KIND_ITEMATTR_STYLE: 214,
	AM_PA_DEFS_KIND_ITEMATTR_DESIGN: 215,
	AM_PA_DEFS_KIND_ITEMATTR_MATERIAL: 216,
	AM_PA_DEFS_KIND_ITEMATTR_COLOR: 217,
	AM_PA_DEFS_KIND_ITEMATTR_T_COLOR: 218,
	AM_PA_DEFS_KIND_ITEMATTR_K_SIZE: 219,
	AM_PA_DEFS_KIND_ITEMATTR_SEASON: 220,
	AM_PA_DEFS_KIND_ITEMATTR_USE: 221,
	AM_PA_DEFS_KIND_ITEMATTR_MAX: 210,
	AM_PA_DEFS_KIND_ITEMLIST: 230,
	AM_PA_DEFS_KIND_ITGRP_MAX: 299,
	AMDB_DEFS_F_GENLIST_STORE: 1,
	AMDB_DEFS_F_GENLIST_ITEM: 2,
	AMDB_DEFS_F_GENLIST_MEMB: 3,
	AMDB_DEFS_F_GENLIST_ADDR: 4,
	AMDB_DEFS_F_GENLIST_MEMB_TMP: 13,
	AMDB_DEFS_HALF_PERIOD_FIRST: 1,
	AMDB_DEFS_HALF_PERIOD_SECOND: 2,
	AMDB_DEFS_QUARTER_PERIOD_FIRST: 1,
	AMDB_DEFS_QUARTER_PERIOD_SECOND: 2,
	AMDB_DEFS_QUARTER_PERIOD_THIRD: 3,
	AMDB_DEFS_QUARTER_PERIOD_FORTH: 4,
	MTTYPETYPE_F_VENDOR: 6,
	MTTYPETYPE_F_OFFSET_TYPE: 153,
	MTTYPETYPE_F_ADJ_GRP: 186,
	MTTYPETYPE_F_ACC_TYPE: 190,
	MTTYPETYPE_F_OPEN: 1,
	MTTYPETYPE_F_LISTUSE: 2,
	MTTYPETYPE_F_PROM: 3,
	MTTYPETYPE_F_DISCNT: 4,
	MTTYPETYPE_F_PROC: 5,
	MTTYPETYPE_F_FUNC: 6,
	MTTYPETYPE_F_KANANAME: 7,
	MTTYPETYPE_F_ITEMGRP: 8,
	MTTYPETYPE_F_ORGLVL: 9,
	MTTYPETYPE_F_ITGRPLVL: 10,
	MTTYPETYPE_F_FOLDER: 11,
	MTTYPETYPE_F_KT: 12,
	MTTYPETYPE_F_LADYS: 13,
	MTTYPETYPE_F_ORDER: 14,
	MTTYPETYPE_F_TELCONNECT: 15,
	MTTYPETYPE_F_SOLIDBASE: 16,
	MTTYPETYPE_F_CUST: 17,
	MTTYPETYPE_F_DMSTAT: 18,
	MTTYPETYPE_F_ADDRLVL: 19,
	MTTYPETYPE_F_ANAKIND: 20,
	MTTYPETYPE_F_BIRTHDAY: 21,
	MTTYPETYPE_F_SEX: 22,
	MTTYPETYPE_F_USESTOP: 23,
	MTTYPETYPE_F_CARDTYPE: 24,
	MTTYPETYPE_F_EMAIL: 28,
	MTTYPETYPE_F_EMAIL_RESIGN: 29,
	MTTYPETYPE_F_EMAIL_SEND: 30,
	MTTYPETYPE_F_POINT: 31,
	MTTYPETYPE_F_WDAY: 32,
	MTTYPETYPE_F_CHANNEL: 33,
	MTTYPETYPE_F_UPD: 34,
	MTTYPETYPE_F_DMPOST: 35,
	MTTYPETYPE_F_ORGFUNC: 36,
	MTTYPETYPE_F_ITGRPFUNC: 37,
	MTTYPETYPE_F_TELNO: 38,
	MTTYPETYPE_F_STOREHQ: 39,
	MTTYPETYPE_F_MARKET: 40,
	MTTYPETYPE_F_SEXAGE: 41,
	MTTYPETYPE_F_SZ_SW: 42,
	MTTYPETYPE_F_SZ_NAME: 43,
	MTTYPETYPE_F_CUSTKARTE: 44,
	MTTYPETYPE_F_DELIVERY: 45,
	MTTYPETYPE_F_PREF: 46,
	MTTYPETYPE_F_NEWMEMB: 47,
	MTTYPETYPE_F_ANACOND: 48,
	MTTYPETYPE_F_PERIOD_TYPE: 49,
	MTTYPETYPE_F_DMPROM: 50,
	MTTYPE_F_VENDOR_MAKER: 1,
	MTTYPE_F_VENDOR_TAGISSUE: 2,
	MTTYPE_F_VENDOR_CORRECT: 3,
	MTTYPE_F_VENDOR_HANGER: 4,
	MTTYPE_F_VENDOR_WOOLECO: 5,
	MTTYPE_F_VENDOR_CUSTENTRY: 6,
	MTTYPE_F_OFFSET_TYPE_FIXED: 1,
	MTTYPE_F_OFFSET_TYPE_NUMBER: 2,
	MTTYPE_F_ADJ_GRP_TYPE_SLACKS: 1,
	MTTYPE_F_ADJ_GRP_TYPE_JACKET: 2,
	MTTYPE_F_ADJ_GRP_TYPE_COAT: 3,
	MTTYPE_F_ADJ_GRP_TYPE_LADIES: 4,
	MTTYPE_F_ADJ_GRP_TYPE_OTHER: 5,
	MTTYPE_F_ACC_TYPE_KOUSEIHI: 1,
	MTTYPE_F_ACC_TYPE_SHANAI: 2,
	MTTYPE_F_ACC_TYPE_LEASE: 3,
	MTTYPE_F_OPEN_PRIVATE: 1,
	MTTYPE_F_OPEN_PUBORG: 2,
	MTTYPE_F_OPEN_PUBLIC: 3,
	MTTYPE_F_LISTUSE_DM: 1,
	MTTYPE_F_LISTUSE_MAILMAGA: 2,
	MTTYPE_F_LISTUSE_CUSTANA: 3,
	MTTYPE_F_FUNC_CUST: 1,
	MTTYPE_F_FUNC_ANALYZE: 2,
	MTTYPE_F_KANANAME_FIRST: 1,
	MTTYPE_F_KANANAME_SECOND: 2,
	MTTYPE_F_ITEMGRP_PERSONAL: 1,
	MTTYPE_F_ORGLVL_HD: 1,
	MTTYPE_F_ORGLVL_CORP: 2,
	MTTYPE_F_ORGLVL_BU: 3,
	MTTYPE_F_ORGLVL_ZONE: 4,
	MTTYPE_F_ORGLVL_AREA: 5,
	MTTYPE_F_ORGLVL_STORE: 6,
	MTTYPE_F_ORGLVL_OTHER: 9,
	MTTYPE_F_ITGRPLVL_HD: 1,
	MTTYPE_F_ITGRPLVL_CORP: 1,
	MTTYPE_F_ITGRPLVL_BU: 2,
	MTTYPE_F_ITGRPLVL_BUMON: 3,
	MTTYPE_F_ITGRPLVL_VARIETY: 4,
	MTTYPE_F_ITGRPLVL_ITEM: 5,
	MTTYPE_F_ITGRPLVL_SKUCS: 7,
	MTTYPE_F_ITGRPLVL_OTHER: 9,
	MTTYPE_F_FOLDER_SYS: 1,
	MTTYPE_F_FOLDER_USER: 2,
	MTTYPE_F_TELCONNECT_ON: 1,
	MTTYPE_F_TELCONNECT_OFF: 2,
	MTTYPE_F_SOLIDBASE_REGULAR: 1,
	MTTYPE_F_SOLIDBASE_CANDIDATE: 2,
	MTTYPE_F_DMSTAT_NON: 1,
	MTTYPE_F_DMSTAT_NG: 2,
	MTTYPE_F_ADDRLVL_PREF: 1,
	MTTYPE_F_ADDRLVL_ADDR1: 2,
	MTTYPE_F_ADDRLVL_ADDR2: 3,
	MTTYPE_F_ADDRLVL_ADDR3: 4,
	MTTYPE_F_ANAKIND_CUST_MATRIX: 1,
	MTTYPE_F_ANAKIND_CUST_ABC: 2,
	MTTYPE_F_ANAKIND_CUST_DECIL: 3,
	MTTYPE_F_BIRTHDAY_REGIST: 1,
	MTTYPE_F_BIRTHDAY_NOREG: 2,
	MTTYPE_F_BIRTHDAY_REJCT: 3,
	MTTYPE_F_SEX_MALE: 1,
	MTTYPE_F_SEX_FEMALE: 2,
	MTTYPE_F_SEX_NON: 3,
	MTTYPE_F_USESTOP_NON: 1,
	MTTYPE_F_USESTOP_REISSUE: 2,
	MTTYPE_F_USESTOP_DELETE: 3,
	MTTYPE_F_CARDTYPE_OLD: 1,
	MTTYPE_F_CARDTYPE_NEW: 2,
	MTTYPE_F_EMAIL_PC: 1,
	MTTYPE_F_EMAIL_MOBILE: 2,
	MTTYPE_F_EMAIL_RESIGN_ON: 1,
	MTTYPE_F_EMAIL_RESIGN_OFF: 2,
	MTTYPE_F_EMAIL_SEND_OK: 1,
	MTTYPE_F_EMAIL_SEND_NG: 2,
	MTTYPE_F_POINT_11: 11,
	MTTYPE_F_POINT_21: 21,
	MTTYPE_F_POINT_31: 31,
	MTTYPE_F_POINT_32: 32,
	MTTYPE_F_POINT_41: 41,
	MTTYPE_F_POINT_42: 42,
	MTTYPE_F_POINT_61: 61,
	MTTYPE_F_POINT_81: 81,
	MTTYPE_F_WDAY_MON: 1,
	MTTYPE_F_WDAY_TUE: 2,
	MTTYPE_F_WDAY_WED: 3,
	MTTYPE_F_WDAY_THU: 4,
	MTTYPE_F_WDAY_FRI: 5,
	MTTYPE_F_WDAY_SAT: 6,
	MTTYPE_F_WDAY_SUN: 7,
	MTTYPE_F_CHANNEL_POINT: 1,
	MTTYPE_F_CHANNEL_EC: 2,
	MTTYPE_F_CHANNEL_MOBILE: 4,
	MTTYPE_F_UPD_NEW: 1,
	MTTYPE_F_UPD_UPD: 2,
	MTTYPE_F_UPD_DEL: 9,
	MTTYPE_F_DMPOST_OK: 1,
	MTTYPE_F_DMPOST_NG: 2,
	MTTYPE_F_ORGFUNC_BASE: 1,
	MTTYPE_F_ORGFUNC_OTHER: 9,
	MTTYPE_F_ITGRPFUNC_BASE: 1,
	MTTYPE_F_ITGRPFUNC_OTHER: 9,
	MTTYPE_F_TELNO_1: 1,
	MTTYPE_F_TELNO_2: 2,
	MTTYPE_F_KT_ON: 1,
	MTTYPE_F_KT_OFF: 2,
	MTTYPE_F_ORDER_ON: 1,
	MTTYPE_F_ORDER_OFF: 2,
	MTTYPE_F_STOREHQ_STORE: 1,
	MTTYPE_F_STOREHQ_HQ: 2,
	MTTYPE_F_SZ_SW_S: 1,
	MTTYPE_F_SZ_SW_W: 2,
	MTTYPE_F_SZ_NAME_NON: 1,
	MTTYPE_F_SZ_NAME_KANJI: 2,
	MTTYPE_F_SZ_NAME_ROMA: 3,
	MTTYPE_F_SZ_NAME_INI: 4,
	MTTYPE_F_CUSTKARTE_ON: 1,
	MTTYPE_F_CUSTKARTE_OFF: 2,
	MTTYPE_F_DELIVERY_YAMATO: 1,
	MTTYPE_F_DELIVERY_HUKUYAMA1: 2,
	MTTYPE_F_DELIVERY_HUKUYAMA2: 3,
	MTTYPE_F_DELIVERY_SEINO: 4,
	MTTYPE_F_DELIVERY_SAGAWA: 5,
	MTTYPE_F_DELIVERY_JPPOST1: 6,
	MTTYPE_F_DELIVERY_JPPOST2: 7,
	MTTYPE_F_PREF_01: 1,
	MTTYPE_F_PREF_02: 2,
	MTTYPE_F_PREF_03: 3,
	MTTYPE_F_PREF_04: 4,
	MTTYPE_F_PREF_05: 5,
	MTTYPE_F_PREF_06: 6,
	MTTYPE_F_PREF_07: 7,
	MTTYPE_F_PREF_08: 8,
	MTTYPE_F_PREF_09: 9,
	MTTYPE_F_PREF_10: 10,
	MTTYPE_F_PREF_11: 11,
	MTTYPE_F_PREF_12: 12,
	MTTYPE_F_PREF_13: 13,
	MTTYPE_F_PREF_14: 14,
	MTTYPE_F_PREF_15: 15,
	MTTYPE_F_PREF_16: 16,
	MTTYPE_F_PREF_17: 17,
	MTTYPE_F_PREF_18: 18,
	MTTYPE_F_PREF_19: 19,
	MTTYPE_F_PREF_20: 20,
	MTTYPE_F_PREF_21: 21,
	MTTYPE_F_PREF_22: 22,
	MTTYPE_F_PREF_23: 23,
	MTTYPE_F_PREF_24: 24,
	MTTYPE_F_PREF_25: 25,
	MTTYPE_F_PREF_26: 26,
	MTTYPE_F_PREF_27: 27,
	MTTYPE_F_PREF_28: 28,
	MTTYPE_F_PREF_29: 29,
	MTTYPE_F_PREF_30: 30,
	MTTYPE_F_PREF_31: 31,
	MTTYPE_F_PREF_32: 32,
	MTTYPE_F_PREF_33: 33,
	MTTYPE_F_PREF_34: 34,
	MTTYPE_F_PREF_35: 35,
	MTTYPE_F_PREF_36: 36,
	MTTYPE_F_PREF_37: 37,
	MTTYPE_F_PREF_38: 38,
	MTTYPE_F_PREF_39: 39,
	MTTYPE_F_PREF_40: 40,
	MTTYPE_F_PREF_41: 41,
	MTTYPE_F_PREF_42: 42,
	MTTYPE_F_PREF_43: 43,
	MTTYPE_F_PREF_44: 44,
	MTTYPE_F_PREF_45: 45,
	MTTYPE_F_PREF_46: 46,
	MTTYPE_F_PREF_47: 47,
	MTTYPE_F_NEWMEMB_NEW: 1,
	MTTYPE_F_NEWMEMB_MEMB: 2,
	MTTYPE_F_NEWMEMB_OTHER: 3,
	MTTYPE_F_ANACOND_PERIOD: 1,
	MTTYPE_F_ANACOND_AXIS: 2,
	MTTYPE_F_ANACOND_DISP: 4,
	MTTYPE_F_ANACOND_STORE: 8,
	MTTYPE_F_ANACOND_ITEM: 16,
	MTTYPE_F_ANACOND_MEMB: 32,
	MTTYPE_F_ANACOND_STAFF: 64,
	MTTYPE_F_ANACOND_SALE: 128,
	MTTYPE_F_PERIOD_TYPE_ABS: 1,
	MTTYPE_F_PERIOD_TYPE_OPP: 2,
	MTCDNAME_CNTYPE_STORE: 1,
	MTCDNAME_CNTYPE_AREA: 2,
	MTCDNAME_CNTYPE_ZONE: 3,
	MTITEM_CNTYPE_SUBCLASS1: 2,
	MTITEM_CNTYPE_SUBCLASS2: 3,
	MTITEM_CNTYPE_BRAND: 4,
	MTITEM_CNTYPE_STYLE: 5,
	MTITEM_CNTYPE_DESIGN: 6,
	MTITEM_CNTYPE_MATERIAL: 7,
	MTITEM_CNTYPE_COLOR: 8,
	MTITEM_CNTYPE_T_COLOR: 9,
	MTITEM_CNTYPE_K_SIZE: 10,
	MTITEM_CNTYPE_USE: 11,
	MTITEM_CNTYPE_SEASON: 12,
	MTSTAFF_CNTYPE_SEX: 101,
	MTSTAFF_CNTYPE_FAMILYREL: 102,
	MTSTAFF_CNTYPE_FAMILYLIVES: 103,
	MTSTAFF_CNTYPE_FAMILYSUP: 104,
	MTSTAFF_CNTYPE_CERT: 105,
	MTSTAFF_CNTYPE_CERTNAME: 106,
	MTSTAFF_CNTYPE_PRAISEBLAME: 107,
	MTSTAFF_CNTYPE_LICENCE: 108,
	MTSTAFF_CNTYPE_LICENCE_RESULT: 109,
	MTSTAFF_CNTYPE_TASK_EXTEND: 110,
	MTSTAFF_CNTYPE_TRAINING: 111,
	MTSTAFF_CNTYPE_TRAINING_NAME: 112,
	MTSTAFF_CNTYPE_HOPE_TRANS: 113,
	MTSTAFF_CNTYPE_TRAINING_ESTIMATE: 114,
	MTSTAFF_CNTYPE_JOBPOST: 115,
	MTSTAFF_CNTYPE_MARRIAGE: 116,
	MTSTAFF_CNTYPE_HOUSE: 117,
	MTSTAFF_CNTYPE_TRANS: 118,
	MTSTAFF_CNTYPE_STAFF: 119,
	MTSTAFF_CNTYPE_GRADE: 120,
	MTSTAFF_CNTYPE_BLOOD: 121,
	MTSTAFF_CNTYPE_NEWMID: 122,
	MTSTAFF_CNTYPE_JOIN_COMPANY: 123,
	MTSTAFF_CNTYPE_BUSI: 124,
	MTSTAFF_CNTYPE_HOPE_JOBTYPE: 125,
	MTSTAFF_CNTYPE_PREF: 126,
	MTSTAFF_CNTYPE_CIGARETTE: 127,
	MTSTAFF_CNTYPE_SCHOOL_SYS: 128,
	MTSTAFF_CNTYPE_SCHOOL_KIND: 129,
	MTSTAFF_CNTYPE_SCHOOL_TYPE: 130,
	MTSTAFF_CNTYPE_SINGLE_TRANS: 131,
	MTSTAFF_CNTYPE_BEFORE_JOBCLASS: 132,
	MTSTAFF_CNTYPE_XX1: 133,
	MTSTAFF_CNTYPE_XX2: 134,
	MTSTAFF_CNTYPE_XX3: 135,
	MTSTAFF_CNTYPE_TRANS_KIND: 136,
	MTGENLIST_FILETYPE_IDARRAY: 1,
	MTGENLIST_FILETYPE_IDSET: 2
};

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
			this.timeout = setTimeout(function () {
				if (self.hoverState == 'in') self.show()
			}, self.options.delay.show)
		}

		, leave: function (e) {
			var self = $(e.currentTarget)[this.type](this._options).data(this.type)

			if (this.timeout) clearTimeout(this.timeout)
			if (!self.options.delay || !self.options.delay.hide) return self.hide()

			self.hoverState = 'out'
			this.timeout = setTimeout(function () {
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
				, arrowPos;

			if (this.hasContent() && this.enabled) {
				$('body > .tooltip').remove();
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
						tp = { top: pos.top + pos.height, left: Math.max(pos.left + pos.width / 2 - actualWidth / 2, 20) };
						break;
					case 'top':
						tp = { top: pos.top - actualHeight, left: Math.max(pos.left + pos.width / 2 - actualWidth / 2, 20) };
						arrowPos = { left: (((pos.left + pos.width / 2 - tp.left) / Math.max(actualWidth, 1)) * 100) + '%' };
						break;
					case 'left':
						tp = { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth };
						break;
					case 'right':
						tp = { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
						break;
				}

				// ツールチップ表示位置補正：<body> 要素右端を超える場合は左へ寄せる。加えて arrows 位置も補正。
				var bodyWidth = $('body').width();
				var dw = tp.left + actualWidth - bodyWidth;
				if (dw > 0) {
					tp.left -= dw;
					arrowPos = { left: (((pos.left + pos.width / 2 - tp.left) / Math.max(actualWidth, 1)) * 100) + '%' };
				}

				$tip
					.offset(tp)
					.addClass(placement)
					.addClass('in');
				if (arrowPos) {
					$tip.find('.tooltip-arrow').css(arrowPos);
				}
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
			if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
				$e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
			}
		}

		, hasContent: function () {
			return this.getTitle()
		}

		, getPosition: function (inside) {
			return $.extend({}, (inside ? { top: 0, left: 0 } : this.$element.offset()), {
				width: this.$element[0].offsetWidth
				, height: this.$element[0].offsetHeight
			})
		}

		, getTitle: function () {
			var title
				, $e = this.$element
				, o = this.options

			title = $e.attr('data-original-title')
				|| (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)

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

	$.fn.tooltip = function (option) {
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
		animation: false
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

var store = (function () {
	var api = {},
		win = window,
		doc = win.document,
		localStorageName = 'localStorage',
		globalStorageName = 'globalStorage',
		storage;

	api.set = function (key, value) { };
	api.get = function (key) { };
	api.remove = function (key) { };
	api.clear = function () { };
	api.transact = function (key, transactionFn) {
		var val = api.get(key);
		if (typeof val == 'undefined') { val = {}; }
		transactionFn(val);
		api.set(key, val);
	};

	api.serialize = function (value) {
		return JSON.stringify(value);
	};
	api.deserialize = function (value) {
		if (typeof value != 'string') { return undefined; }
		return JSON.parse(value);
	};

	// Functions to encapsulate questionable FireFox 3.6.13 behavior 
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]); }
		catch (err) { return false; }
	}

	function isGlobalStorageNameSupported() {
		try { return (globalStorageName in win && win[globalStorageName] && win[globalStorageName][win.location.hostname]); }
		catch (err) { return false; }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName];
		api.set = function (key, val) { storage.setItem(key, api.serialize(val)); };
		api.get = function (key) { return api.deserialize(storage.getItem(key)); };
		api.remove = function (key) { storage.removeItem(key); };
		api.clear = function () { storage.clear(); };

	} else if (isGlobalStorageNameSupported()) {
		storage = win[globalStorageName][win.location.hostname];
		api.set = function (key, val) { storage[key] = api.serialize(val); };
		api.get = function (key) { return api.deserialize(storage[key] && storage[key].value); };
		api.remove = function (key) { delete storage[key]; };
		api.clear = function () { for (var key in storage) { delete storage[key]; } };

	} else if (doc.documentElement.addBehavior) {
		storage = doc.createElement('div');
		function withIEStorage(storeFunction) {
			return function () {
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
		api.set = withIEStorage(function (storage, key, val) {
			storage.setAttribute(key, api.serialize(val));
			storage.save(localStorageName);
		});
		api.get = withIEStorage(function (storage, key) {
			return api.deserialize(storage.getAttribute(key));
		});
		api.remove = withIEStorage(function (storage, key) {
			storage.removeAttribute(key);
			storage.save(localStorageName);
		});
		api.clear = withIEStorage(function (storage) {
			var attributes = storage.XMLDocument.documentElement.attributes;
			storage.load(localStorageName);
			for (var i = 0, attr; attr = attributes[i]; i++) {
				storage.removeAttribute(attr.name);
			}
			storage.save(localStorageName);
		});
	}

	return api;
})();

//////////////////////////////////////////////////////////////////
// store.js プラグイン拡張 - セットしているキーがどんなかを管理
(function (store) {
	if (!store) {
		throw 'store.js がロードされておりません。';
	}

	var origSetFunc = store.set;
	var origRemoveFunc = store.remove;
	var _keys = '_keys';

	/**
	 *
	 */
	store.set = function (k, v) {
		if (k != null) {
			var keyMap = store.get(_keys) || {};
			keyMap[k] = true;
			origSetFunc(_keys, keyMap);
		}
		origSetFunc(k, v);
	};

	/**
	 *
	 */
	store.remove = function (k) {
		var keyMap = store.get(_keys);
		var kk = _.isArray(k) ? k : [k];
		for (var i = 0; i < kk.length; i++) {
			var k = kk[i];
			origRemoveFunc(k);
			if (k != null) {
				if (keyMap && _.has(keyMap, k)) {
					delete keyMap[k];
				}
			}
		}
		if (keyMap) {
			origSetFunc(_keys, keyMap);
		}
	};

	/**
	 *
	 */
	store.keys = function () {
		var keyMap = store.get(_keys);
		return keyMap || {};
	};

}(store));
/**
 * ORIGINAL inputlimiter.js
 * @module jQuery
 */

/**
 * # 入力制限の制限とフィルタ処理を行う。
 *
 * - 入力制限 data-limit
 *
 *	 * IMEオフのとき
 *	   * オンラインで入力を制限する
 *	 * IMEオンのとき
 *	   * IMEで確定時に入力の制限を行う
 *	 * フォーカスアウトで禁止文字を除去
 *
 * - フィルタ処理 data-filter
 *
 *	 * フォーカスインでカンマなどをとりのぞく
 *	 * フォーカスアウトタイミングで3桁のカンマ区切りにする
 *
 *
 * ## サポートするエレメント
 * - input type="text"
 * - input type="password"
 * - textarea
 *
 * ## data-limit使用方法
 *
 * input type="text"やtextareaなどのHTMLエレメントのdata-limit属性を指
 * 定することで各種入力制限を行う。
 *
 * ```html
 * <!-- 数字のみの入力を許可する -->
 * <input type="text" data-limit="digit">
 * ```
 * 引数が必要な入力制限もある。
 * ```html
 * <!-- 整数部5桁以下、小数部3桁以下に制限 -->
 * <input type="text" data-limit="number:5,3">
 * ```
 *
 * 異なった種類の入力制限を行う場合にはdata-limit属性に空白で区切って指
 * 定する。
 *
 * ```html
 * <!-- アルファベット5字以内に制限する -->
 * <input type="text" data-limit="alpha len:5">
 * ```
 *
 * ## data-limitに設定可能な項目
 *
 *
 * #### `len:LENGTH`
 * 最大入力文字数をLENGTH以下に制限する
 *
 * ```html
 * <input type="text" data-limit="len:5">
 * ```
 *
 * #### time
 * 時刻入力
 * 00:00から35:59までの時刻の入力を行う。
 * 00:00ともに可能0:0
 *
 * ```html
 * <input type="text" data-limit="time">
 * ```
 *
 * #### alpha
 * アルファベット[A-Za-z]のみの入力を受けつける
 *
 * ```html
 * <input type="text" data-limit="alpha">
 * ```
 *
 * #### upper
 * アルファベット[A-Z]のみの入力を受けつける
 *
 * ```html
 * <input type="text" data-limit="upper">
 * ```
 *
 * #### lower
 * アルファベット[a-z]のみの入力を受けつける
 *
 * ```html
 * <input type="text" data-limit="lower">
 * ```
 *
 * #### alnum
 * [A-Za-z0-9]のみの入力に制限する
 *
 * ```html
 * <input type="text" data-limit="alnum">
 * ```
 *
 * * #### alnum2
 * [A-Za-z-0-9]のみの入力に制限する
 * (英数字とハイフンを許可)
 *
 * ```html
 * <input type="text" data-limit="alnum">
 * ```
 *
 * #### digit:LEN
 * [0-9]のみの入力に制限する
 *
 * - LEN - 最大桁数
 *
 * ```html
 * <input type="text" data-limit="digit">
 * ```
 *
 * #### code2
 * [-0-9]のみの入力に制限する
 *
 * ```html
 * <input type="text" data-limit="code2">
 * ```
 *
 * #### int:LEN
 * 整数のみの入力を受けつける。
 *
 * - LEN - 最大桁数(マイナス記号は含まない)
 *
 * - 00001などの入力は不可
 * - -1234は可だが、+1234は不可
 *
 * ```html
 * <input type="text" data-limit="int">
 * ```
 *
 * #### uint:LEN
 * 0以上の整数のみの入力を受けつける。
 *
 * - LEN - 最大桁数
 *
 * - 00001などの入力は不可
 * - +1234は不可
 *
 * ```html
 * <input type="text" data-limit="uint">
 * ```
 *
 * #### number:LEN1,LEN2,ALLOW_NEGATIVE
 *
 * 小数の入力のみに制限する
 *
 * - LEN1 - 整数部の最大桁長
 * - LEN2 - 小数部の最大桁長
 * - ALLOW_NEGATIVE - '-'が指定された場合は先頭の「-」の入力を許可する
 *
 * 5けたの整数のみの入力に制限
 * ```html
 * <input type="text" data-limit="number:5">
 * ```
 *
 * 整数部5桁以下、小数部3桁以下に制限
 * ```html
 * <input type="text" data-limit="number:5,3">
 * ```
 *
 * 整数部5桁以下、小数部3桁以下に制限。負数も許可。
 * ```html
 * <input type="text" data-limit="number:5,3,-">
 * ```
 *
 * #### hankaku
 *
 * 半角文字のみに制限
 *
 * ```html
 * <input type="text" data-limit="hankaku">
 * ```
 *
 * ##### 半角文字は以下で定義している
 * ```js
 *	isHalf = function (c) {
 *	  return (c >= 0x0 && c < 0x81) || (c == 0xf8f0) ||
 *		(c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
 *	},
 * ```
 *
 * #### zenkaku
 *
 * 全角文字のみに制限(半角でないもの)
 *
 * ```html
 * <input type="text" data-limit="zenkaku">
 * ```
 *
 * #### yyyymm
 *
 * TODO
 *
 * #### ym
 *
 * TODO
 *
 * #### kinsoku:PROHIBITED
 *
 * 禁則文字を排除
 *
 * - PROHIBITED 禁則文字列
 *
 * - デフォルトで全てのテキストフィールドで有効になっているので、指定しないでください。
 *
 * - 禁則文字の定義は clcom.kinsokuTable で行っています
 *
 * #### noSurrogatePair
 *
 * UTF-16でサロゲートペアな文字を禁止
 *
 * - デフォルトで全てのテキストフィールドで有効になっているので、指定しないでください。
 *
 * ## data-filterに設定可能な項目
 *
 * #### comma
 *
 * 数値を3桁ごとにカンマ「,]でくぎる。かならず以下のいずれかの
 * data-limitを指定してください。
 *
 * - int
 * - uint
 * - number
 *
 * ```html
 * <input type="text" data-limit="uint" data-filter="comma" >
 * ```
 *
 * #### time
 *
 * hh:mm形式に整形する。data-limit="time"と共に用いること。
 *
 * ```html
 * <input type="text" data-limit="time" data-filter="time" >
 * ```
 *
 * #### fixed:NUM
 *
 * 小数部(NUM+1)位の四捨五入をNUM桁にする。NUMは0以上の数
 * ```html
 * <!-- 12345.678 => 12345.68 -->
 * <input type="text" data-limit="number:,3" data-filter="fixed:2" >
 * ```
 *
 * #### floor:NUM
 *
 * 小数部(NUM+1)桁目の切り捨てを行いNUM桁にする。NUMは0以上の数
 * ```
 * <!-- 12345.678 => 12345.67 -->
 * <input type="text" data-limit="number:,3" data-filter="floor:2" >
 * ```
 *
 * ## Methods
 * ### .inputlimiter()
 * 使わないこと
 *
 * ### .inputlimiter('get')
 * フィルタに基づいてインプットの値を取得する
 *
 * ### .inputlimiter('set', value)
 * フィルタに基づいてインプットに値を設定する
 *
 * ### .inputlimiter('update')
 * フィルタに基づいてインプットの値を更新する。
 *
 * ### .inputlimiter('addfilter', filterName, filterFunc)
 * エレメントにフィルタを関連づける。
 *
 * ### .inputlimiter('addlimiter', limiterName, limiterFunc)
 * エレメントにリミッターを関連づける。
 *
 * @class inputlimiter
 * @namespace jQuery
 * @static
 */

(function ($) {
	var vent = _.extend({}, Backbone.Events);

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


	// デバッグ用
	var eventLogHandler = function (e) {
		// var str = (e.type + '																				').slice(0,20);
		// if (e.keyCode) str += '\tkeyCode:' + e.keyCode;
		// if (e.data) str += '\tdata:' + e.data;
		// console.log("inputlimiter:", str);
	};

	/**
	 * 入力制限モジュール
	 *
	 * @class Limiters
	 * @static
	 * @namespace jQuery.inputlimiter
	 */
	var Limiters = (function () {
		var regexLimiter = function (reg) {
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
					return _.reduce(_.map(regs, function (reg) { return reg(value); }), function (memo, v) {
						if (memo.length > v.length)
							return memo;
						else
							return v;
					}, '');
				};
			},

			/**
			 * アルファベット大文字
			 *
			 * @method upper
			 * @return {function}
			 */
			upper = function () {
				return regexLimiter(/[A-Z]+/);
			},

			/**
			 * アルファベット小文字
			 *
			 * @method lower
			 * @return {function}
			 */
			lower = function () {
				return regexLimiter(/[a-z]+/);
			},

			alpha = function () {
				return regexLimiter(/[A-Za-z]+/);
			},

			alphaperiod = function () {
				return regexLimiter(/[A-Za-z\.]+/);
			},

			alnumperiod = function () {
				return regexLimiter(/[A-Za-z0-9\.]+/);
			},

			passwd = function () {
				return regexLimiter(/[A-Za-z0-9-\.]+/);
			},

			uppernumperiod = function () {
				return regexLimiter(/[A-Z0-9\.]+/);
			},

			upperperiod = function () {
				return regexLimiter(/[A-Z\.]+/);
			},

			alnum = function () {
				return regexLimiter(/[A-Za-z0-9]+/);
			},

			alnum2 = function () {
				return regexLimiter(/[A-Za-z-0-9]+/);
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
					return match[1] + (match[2] || '').substring(0, len || undefined);
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
						(match[2] || '').substring(0, _.isNaN(len1) ? undefined : len1) +
						(match[3] || '') +
						(match[4] || '').substring(0, _.isNaN(len2) ? undefined : len2);
				};
			},

			yyyymm = function () {
				return function (value) {
					if (/[0-9\/]{0,7}/.test(value))
						return value;
					return '';
				};
			},

			ym = function (len) {
				return function (value) {
					if (!value) return '';
					if (!/^[0-9\/]+$/.test(value)) return '';
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

			isHalf_cr = function (c) {
				return (c >= 0x0 && c < 0x09) || (c >= 0x0b && c < 0x81)
					|| (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0)
					|| (c >= 0xf8f1 && c < 0xf8f4);
			},

			hankaku = function () {
				return truncateByCharMap(isHalf);
			},

			hankaku_cr = function () {
				return truncateByCharMap(isHalf_cr);
			},

			zenkaku = function () {
				return truncateByCharMap(function (c) { return !isHalf(c); });
			},
			//全角(改行許容)
			zenkaku_cr = function () {
				return truncateByCharMap(function (c) { return !isHalf_cr(c); });
			},

			// UTF-16でサロゲートペアで表現される文字を禁止する
			noSurrogatePair = function () {
				return function (value) {
					return value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "");
				};
			},

			kinsoku = function (prohibited) {
				// 禁則文字を排除する
				if (!_.isRegExp(prohibited)) {
					prohibited = new RegExp("[" + prohibited + "]", "g");
				}
				return function (value) {
					return value.replace(prohibited, "");
				};
			};

		return {
			'regex': regexLimiter,
			len: len,
			upper: upper,
			lower: lower,
			'int': integer,
			'int2': integer2,
			uint: integer2,
			time: time,
			code2: code2,
			alpha: alpha,
			alphaperiod: alphaperiod,
			alnumperiod: alnumperiod,
			upperperiod: upperperiod,
			uppernumperiod: uppernumperiod,
			alnum: alnum,
			alnum2: alnum2,
			passwd: passwd,
			// digit: digit,
			digit: code,
			number: number,
			hankaku: hankaku,
			hankaku_cr: hankaku_cr,
			zenkaku: zenkaku,
			zenkaku_cr: zenkaku_cr,
			yyyymm: yyyymm,
			ym: ym,
			kinsoku: kinsoku,
			noSurrogatePair: noSurrogatePair
		};
	}());

	/**
	 * フィルタモジュール
	 *
	 * @class Filters
	 * @static
	 * @namespace jQuery.inputlimiter
	 */
	var Filters = (function () {
		var fixed = function (num) {
			var f = function (value) {
				var n = Number(value);
				if (value != null && value !== '' && isFinite(n)) {
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
					if (value == null || value === '') return value;

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
						if (_.isString(value)) {
							value = $.trim(value);
						}
						var xs = value.split('.');
						value = xs[0].replace(format, function (t) {
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

			currency = function () {
				var format = /([\d]+?)(?=(?:\d{3})+$)/g;

				return {
					mask: function (value) {
						var xs = value.split('.');
						var xs0 = xs[0].replace(format, function (t) {
							return t + ',';
						});
						xs[0] = xs0;
						var appliedVal = xs.join('.');
						if (_.isFinite(value) && !_.isEmpty(appliedVal)) {
							appliedVal = '&yen; ' + appliedVal;
						}
						return appliedVal;
					},

					unmask: function (value) {
						return value.replace(/^&yen;\ /, '').split(',').join('');
					}
				};
			},

			time = function () {
				var format = /(\d+?)(?=(?:\d{2})+$)/g;

				return {
					mask: function (value) {
						return value.replace(format, function (t) { return t + ':' });
					},

					unmask: function (value) {
						return value.split(':').join('');
					}
				};
			};

		return {
			comma: comma,
			currency: currency,
			time: time,
			fixed: fixed,
			floor: floor
		};

	}());

	var compiledConverter = {},

		buildConverter = function (limiters) {
			var filter = function (method, value, options) {
				options = options || {};
				if (!limiters.filters)
					return value;
				value = _.reduce(limiters.filters, function (memo, filter) {
					if (filter[method])
						memo = filter[method].call(null, memo, options);
					return memo;
				}, value);
				return value;
			},

				limitValue = function (value) {
					if (!limiters.limiters)
						return value;
					value = _.reduce(limiters.limiters, function (memo, limiter) {
						return limiter.call(null, memo);
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

		buildLimiters = function (dataLimit, data) {
			dataLimit || (dataLimit = '');
			var limiters = _.map(_.compact(dataLimit.split(splitter)), function (s) {
				var args = s.split(':'),
					limiter = args.shift();
				args = (args[0] || "").split(',');
				if (!Limiters[limiter]) {
					console.warn('Invalid Filter:' + limiter);
					return;
				}

				return Limiters[limiter].apply(this, args);
			});
			// 共通のリミッターを設定する
			limiters = $.inputlimiter._commonLimiters.concat(limiters);

			if (data.limiters) {
				// エレメントに割りあてられたリミッターを設定する
				limiters = limiters.concat(_.values(data.limiters));
			}
			return limiters;
		},

		buildFilters = function (dataFilter, data) {
			dataFilter || (dataFilter = '');
			var filters = _.map(_.compact(dataFilter.split(splitter)), function (s) {
				var args = s.split(':'),
					filter = args.shift();
				args = (args[0] || '').split(',');
				if (!Filters[filter]) {
					console.warn('Invalid Filter:' + filter);
					return;
				}

				return Filters[filter].apply(this, args);
			});

			if (data.filters) {
				// エレメントに割りあてられたフィルタを設定する
				filters = filters.concat(_.values(data.filters));
			}
			return filters;
		},

		getConverter = function (limitExpr, filterExpr, data) {
			if (!data) {
				data = {
					cache: compiledConverter
				};
			}

			if (!data.cache[limitExpr]) {
				data.cache[limitExpr] = {};
			}
			var converter = data.cache[limitExpr][filterExpr];

			if (!converter) {
				var limiterFilter = {
					limiters: buildLimiters(limitExpr, data),
					filters: buildFilters(filterExpr, data)
				};
				converter = buildConverter(limiterFilter);
				data.cache[limitExpr][filterExpr] = converter;
			}

			return converter;
		},

		getConverterByElement = function ($input) {
			var data = $input.data('inputlimiter');
			var converter = getConverter($input.attr('data-limit') || '',
				$input.attr('data-filter') || '',
				data);
			if (data) {
				$input.data('inputlimiter', data);
			}
			return converter;
		},

		createHandler = function (_converter) {
			var focused = false,

				splice = function (s/*, index, howMany*//*[,s1][, ..., sN]*/) {
					var args = Array.prototype.slice.call(arguments, 1),
						array = s.split('');
					Array.prototype.splice.apply(array, args);
					return array.join('');
				},

				onKeyup = function () {
					// IME確定処理をここで行っていたが、onInputで行うよ
					// うに変更したのでここでは何も行わない
				},

				onCompositionStart = function (e) {
					eventLogHandler(e);
				},

				onCompositionEnd = function (e) {
					eventLogHandler(e);
					$(e.currentTarget).data("compositioningend", true);
				},

				// IMEで確定時用の処理
				onInput = function (e) {
					eventLogHandler(e);
					var input = e.currentTarget, $input = $(input);

					if ($input.data("compositioningend")) {
						$input.data("compositioningend", false);
					} else {
						return;
					}

					if ($.inputlimiter.noTrim) {
						// noTrimオプションが設定されている場合は何もしない
						clutil.mediator.trigger('validation:require', $input);
						return;
					}

					// IMEでENTERキーで確定時の処理
					var converter = _converter || getConverterByElement($input),
						pos,
						value = $input.val(),
						curVal = converter.filter('unmask', value),
						newVal = converter.limitValue(curVal);

					if (curVal !== newVal) {
						pos = getCursorPosition(e.currentTarget);
						$input.val(newVal);
						setCursorPosition($input, pos);

						$input.data('inputfilter.previousValue', newVal);
						$input.data('inputfilter.rawPreviousValue', value);
					}
				},

				onKeypress = function (e) {
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
							curVal = splice(prevVal, selection.start, selection.end - selection.start, ch),
							filtValu = converter.filter('unmask', curVal, { eventType: 'keypress' }),
							newVal = converter.limitValue(filtValu);

						// console.log('###(press)',
						// 			'curVal:', curVal,
						// 			'newVal:', newVal,
						// 			'prevVal:', prevVal,
						// 			'code:', e.which, 'ch:', ch);

						if (curVal !== newVal) {
							return false;
						}
					}
				},

				/*
				 * フォーカス時にUIの文字列を選択するためにマウスアップの
				 * イベントでselect()を呼ぶ。ただし、ここで無条件に
				 * select()を呼ぶと選択が解除できなくなるため、focus直後の
				 * マウスアップだけを対象とする。
				 */
				onMouseUp = function (e) {
					if (focused) {
						$(e.currentTarget).select();
						e.preventDefault();
						focused = false;
					}
				},

				/**
				 * Paste時のハンドラ。
				 */
				onPaste = function (e) {
					var input = e.currentTarget,
						$input = $(input);

					if ($.inputlimiter.noTrim) {
						// noTrimオプションが設定されている場合は何もしない
						clutil.mediator.trigger('validation:require', $input);
						return;
					}

					if (!$input.is('input,textarea'))
						return;

					var converter = _converter || getConverterByElement($input);
					// 遅延するのはpasteイベントがChromeではペーストす
					// る直前のタイミングで行われるため。
					_.defer(function () {
						var value = $input.val(),
							filtered = converter.filterValue(value),
							masked = converter.filter('unmask', filtered);

						$input.data('inputfilter.previousValue', masked);
						$input.data('inputfilter.rawPreviousValue', value);
						console.log('onPaste', input.id, input.className,
							value, filtered, masked);
						if (!$input.is(".bootstrap-select-searchbox >")) {
							// TODO bootstrap-select liveSearch
							$input.val(masked);
							vent.trigger('inputlimiter:change');
						}
					});
				},

				/*
				 * onFocusはfocusのイベントハンドラ。ここでは文字列をアン
				 * マスクしてインプットに設定する。
				 */
				onFocus = function (e) {
					var input = e.currentTarget,
						$input = $(input);

					if (!$input.is('input,textarea'))
						return;

					// MDBaseViewのブラー時のオートValidを無効にする。
					$input.addClass('cl_valid_blur_off');

					var converter = _converter || getConverterByElement($input),
						value = $input.val(),
						limited = converter.limitValue(value),
						filtered = converter.filter('unmask', value),
						isBsSrch = $input.is(".bootstrap-select-searchbox >");

					if ($.inputlimiter.noTrim &&
						value !== limited) {
						// noTrimオプションが設定されている場合でtrimさ
						// れる場合は何もしない
						clutil.mediator.trigger('validation:require', $input);
						filtered = value;
					} else if (!isBsSrch) {
						$input.val(filtered);
					}

					$input.data('inputfilter.previousValue', filtered);
					$input.data('inputfilter.rawPreviousValue', filtered);

					if (!isBsSrch) {
						$input.select();
					}
					focused = true;
				},

				/*
				 * onChangeとonBlurについて
				 * blur時にval()でマスク後の値を書き込むが、changeイベント
				 * が発生しない
				 * 場合がある。対処としてblur時には変更がない場合にのみval()で書き込み
				 * を行う。また、変更がある場合にはchangeイベントが発生するのでchangeの
				 * イベントハンドラないでマスク後の値を書き込む
				 * [追記]
				 * Paste または IME で入力テキストを一斉にセットする場合で、かつ、
				 * フィルタが作用した場合、change イベントが発火しない。（Chrome 固有な問題かもしれない）
				 * blur イベントには入ってくるので、ここから change イベントを発火する。
				 */
				onChange = function (e) {
					var input = e.currentTarget,
						$input = $(input);

					if (!$input.is('input,textarea'))
						return;

					if ($input.is(':focus'))
						return;

					var converter = _converter || getConverterByElement($input),
						value = $input.val(),
						limited = converter.limitValue(value),
						filtered = converter.filterValue(value);

					if ($.inputlimiter.noTrim &&
						value !== limited) {
						// noTrimオプションが設定されている場合でtrimさ
						// れる場合は何もしない
						clutil.mediator.trigger('validation:require', $input);
						return;
					}

					$input.val(filtered);
					clutil.mediator.trigger('validation:require', $input);
					$input.data('inputfilter.previousValue', value);
					$input.data('inputfilter.rawPreviousValue', value);
				},

				onBlur = function (e) {
					var input = e.currentTarget,
						$input = $(input);

					if (!$input.is('input,textarea'))
						return;

					// MDBaseViewのブラー時のオートValid無効を解除にする。
					_.defer(function () {
						$input.removeClass('cl_valid_blur_off');
					});

					var converter = _converter || getConverterByElement($input),
						value = $input.val(),
						limited = converter.limitValue(value),
						previous = $input.data('inputfilter.previousValue'),
						filtered = converter.filterValue(value);

					if ($.inputlimiter.noTrim &&
						value !== limited) {
						clutil.mediator.trigger('validation:require', $input);
						// noTrimオプションが設定されている場合でtrimさ
						// れる場合は何もしない
						return;
					}

					if (value === previous) {
						$input.val(filtered);
						clutil.mediator.trigger('validation:require', $input);
						var rawPrevious = $input.data('inputfilter.rawPreviousValue');
						if (previous != rawPrevious) {
							// ペーストまたは IME 確定等のまとまったテキスト入力で、フィルタが作用した場合、
							// change イベントが発火していない可能性があるので、change 発火！！！！
							console.info('inputlimiter.onBlur: change イベント発火');
							$input.trigger('change');
						}
					}
				};


			return {
				onBlur: onBlur,
				onChange: onChange,
				onFocus: onFocus,
				onKeypress: onKeypress,
				onKeyup: onKeyup,
				onMouseUp: onMouseUp,
				// ペースト時はフォーカス処理 TODO
				onPaste: onPaste,
				onInput: onInput,
				onCompositionStart: onCompositionStart,
				onCompositionEnd: onCompositionEnd
			};
		},

		start = function () {
			var handler = createHandler(),
				selector = 'input[type=text],input[type=password],textarea,[data-limit]:not(.bindInputlimiter),[data-filter]:not(.bindInputlimiter)';

			$(document).off('.inputlimiter')
				.on('compositionstart.inputlimiter', selector, handler.onCompositionStart)
				.on('compositionend.inputlimiter', selector, handler.onCompositionEnd)
				.on('input.inputlimiter', selector, handler.onInput)
				.on('keypress.inputlimiter', selector, handler.onKeypress)
				.on('keyup.inputlimiter', selector, handler.onKeyup)
				.on('focusin.inputlimiter', selector, handler.onFocus)
				.on('mouseup.inputlimiter', selector, handler.onMouseUp)
				.on('focusout.inputlimiter', selector, handler.onBlur)
				.on('paste.inputlimiter', selector, handler.onPaste)
				.on('change.inputlimiter', selector, handler.onChange);
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
				.bind('compositionstart.inputlimiter', handler.onCompositionStart)
				.bind('compositionend.inputlimiter', handler.onCompositionEnd)
				.bind('input.inputlimiter', handler.onInput)

				.bind('keypress.inputlimiter', handler.onKeypress)
				.bind('keyup.inputlimiter', handler.onKeyup)
				.bind('mouseup.inputlimiter', handler.onMouseUp)
				.bind('focusin.inputlimiter', handler.onFocus)
				.bind('focusout.inputlimiter', handler.onBlur)
				.bind('paste.inputlimiter', handler.onPaste)
				.bind('change.inputlimiter', handler.onChange)
				.addClass('bindInputlimiter');
		},

		addFilter = function ($el, id, filterFunc) {
			var data = $el.data('inputlimiter') || {
				filters: {},
				limiters: {}
			};
			// 追加されたらいつでもcacheをクリアする
			data.cache = {};
			data.filters[id] = filterFunc;
			$el.data('inputlimiter', data);
		},

		addLimiter = function ($el, id, limiterFunc) {
			var data = $el.data('inputlimiter') || {
				filters: {},
				limiters: {}
			};
			// 追加されたらいつでもcacheをクリアする
			data.cache = {};
			data.limiters[id] = limiterFunc;
			$el.data('inputlimiter', data);
		};

	$.fn.inputlimiter = function (method, options) {
		var args = _.toArray(arguments);
		if (typeof method === 'object') {
			method = undefined;
			options = method;
		}

		if (typeof method === 'undefined') {
			method = 'new';
		}

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

		var returnValue = this;
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
			} else if (method === 'addfilter') {
				addFilter.call(this, $element, args[1], args[2]);
			} else if (method === 'addlimiter') {
				addLimiter.call(this, $element, args[1], args[2]);
			}
		});
		return returnValue;
	};

	$.fn.inputlimiter.defaults = {
	};

	$.inputlimiter = {
		vent: vent,

		Limiters: Limiters,
		Filters: Filters,
		/**
		 * 入力値の制限やマスク処理に利用する
		 *
		 * @method mask
		 * @for jQuery.inputlimiter
		 * @param {String} value
		 * @param {Object} options
		 * @param {Function} [options.filter] フィルタを指定する
		 * @param {Function} [options.limit] リミッターを指定する
		 * @example
		 * カンマ区切りにする例
		 * ```js
		 * $.inputlimiter.mask("12345", {
		 *	 filter: "comma"
		 * }); //=> "12,345"
		 * ```
		 * 入力値検証例
		 * ```js
		 * var text = "abc123";
		 * var limited = $.inputlimiter.mask(text, {
		 *	 limiter: "alpha"
		 * }); // => "abc"
		 * if (text !== limited) {
		 *	 alert("入力値が不正です");
		 * }
		 * ```
		 */
		mask: function (value, options) {
			value = (value == null) ? '' : String(value);
			var converter = getConverter(options.limit, options.filter);
			return converter.filterValue(value);
		},
		/**
		 * 入力値の検証を行ったり、入力値のマスキングに利用する
		 *
		 * @method unmask
		 * @param {String} value
		 * @param {Object} options
		 * @param {Function} [options.filter] フィルタを指定する
		 * @param {Function} [options.limit] リミッターを指定する
		 * @example
		 *
		 */
		unmask: function (value, options) {
			value = (value == null) ? '' : String(value);
			var converter = getConverter(options.limit, options.filter);
			return converter.value(value);
		},

		clearCache: function () {
			compiledConverter = {};
		},

		/**
		 * 入力制限を開始する。
		 *
		 * `input[type=text],input[type=password],textarea`な全ての
		 * HTMLエレメントを監視して、data-limit, data-filterで指定され
		 * た入力制限およびマスク処理を行う。ただし、start()呼び出し前
		 * にsetCommonLimiters(LIMITERS...)を呼び出した場合は、そこで指
		 * 定された入力制限も実行される。
		 *
		 * Documentに対してdelegateされているため、後から追加された
		 * HTMLエレメントにも有効に働く。
		 *
		 * @method start
		 * @static
		 * @example
		 * ```js
		 * $.inputlimiter.start();
		 * ```
		 */
		start: start,
		/**
		 * 入力制限を停止する
		 *
		 * @method stop
		 */
		stop: stop,
		_commonLimiters: [],
		/**
		 * 全テキストフィールドに対して共通に入力を制限したい場合に使用
		 * する。ここで指定された入力制限は、data-limitの指定のありなし
		 * にかかわらずに必ず行われる。
		 *
		 * @method setCommonLimiters
		 * @param {Function} limiters...
		 * @example
		 * ```js
		 * // 「あ」は入力できない
		 * $.inputlimiter.setCommonLimiters($.inputlimiter.Limiters.kinsoku("あ"));
		 * ```
		 */
		setCommonLimiters: function () {
			var limiters = _.toArray(arguments);
			this._commonLimiters = limiters;
		}
	};
})(jQuery);


/**
 * ORIGINAL messages_ja.js
 */
var clmsg = _.extend((typeof clmsg === 'undefined') && {} || clmsg, {
	cl_echoback: "入力項目が間違っています。",
	// http エラー
	cl_http_status_xxx: '障害が発生しました。ご迷惑お掛けしています。しばらくお待ち下さい。',
	cl_http_status_0: 'サーバーに接続できませんでした。',
	cl_http_status_unauthorized: 'ログイン情報が確認できませんでした。しばらくお待ち下さい。',
	cl_http_status_forbidden: 'アクセスが拒否されました。',
	cl_http_status_501: 'サーバが混みあっています。しばらくお待ちいただいたのち、再度実行して下さい。',

	// validation メッセージ
	cl_required: "入力してください。",
	cl_its_required: "{0}を入力してください。",
	cl_required2: "どちらか入力してください。",
	cl_its_required2: "{0}のどちらかを入力してください。",

	cl_len1: '{0}文字で入力してください。',
	cl_len2: '{0}文字以上で入力してください。',
	cl_len3: '{1}文字以下で入力してください。',
	cl_len4: '{0}〜{1}文字で入力してください。',

	cl_length_short1: "{0}文字以上で入力してください。",
	cl_length_short2: "{0}〜{1}文字で入力してください。",
	cl_length_long1: "{0}文字以下で入力してください。",
	cl_length_long2: "{0}〜{1}文字で入力してください。",
	cl_its_length_short1: "{0}が短すぎます。{1}文字以上で入力してください。",
	cl_its_length_short2: "{0}が短すぎます。{1}〜{2}文字で入力してください。",
	cl_its_length_long1: "{0}が長すぎます。{1}文字以下で入力してください。",
	cl_its_length_long2: "{0}が長すぎます。{1}〜{2}文字で入力してください。",

	cl_less_than_oreqlto: "{0}以下で入力してください。",

	cl_email: "メールアドレス形式ではありません。",
	cl_email_long: "256文字以下で入力してください。",
	cl_its_email: "{0}はメールアドレス形式ではありません。入力をご確認ください。",
	cl_its_email_long: "{0}は256文字以下で入力してください。",

	cl_url: "URL形式ではありません。",
	cl_its_url: "{0}はURL形式ではありません。入力をご確認ください。",
	cl_zenkaku: "全角文字列で入力してください。",
	cl_zenkaku_length: "全角{0}〜{1}文字で入力してください。",
	cl_zenkaku_short: "全角{0}文字以上で入力してください。",
	cl_zenkaku_long: "全角{0}文字以下で入力してください。",
	cl_hankaku: "半角文字列で入力してください。",
	cl_hankaku_length: "半角{0}〜{1}文字で入力してください。",
	cl_hankaku_short: "半角{0}文字以上で入力してください。",
	cl_hankaku_long: "半角{0}文字以下で入力してください。",
	cl_zenhan: "全角{0}文字以内もしくは半角{1}文字以内で入力してください",

	cl_decimal1: "数値で入力してください(整数部{0}桁以下、小数部{1}桁以下)",
	cl_decimal2: "数値で入力してください(整数部{0}桁以下)",
	cl_decimal3: "数値で入力してください(小数部{0}桁以下)",
	cl_decimal4: "数値で入力してください",

	cl_numeric1: "数字で入力してください",

	cl_int1: "整数で入力してください({0}桁以内)",
	cl_int2: "整数で入力してください",

	cl_alphaperiod: '英字もしくはドットで入力してください',
	cl_alnumperiod: '英数字もしくはドットで入力してください',
	cl_passwd: '英数字、ドットもしくはハイフンで入力してください',
	cl_upperperiod: '英大文字もしくはドットで入力してください',
	cl_uppernumperiod: '英大文字、数字、もしくはドットで入力してください',
	cl_alnum: '英数字で入力してください',
	cl_alnum2: '英数字またはハイフンで入力してください',
	cl_alpha: '英字で入力してください',

	cl_upper: '英字大文字で入力してください',

	cl_minlen: '{0}文字以上で入力してください。',
	cl_maxlen: '{0}文字以下で入力してください。',

	cl_min: '{0}以上で入力してください。',
	cl_max: '{0}以下で入力してください。',

	cl_st_date_min_opedate: "運用日以前の適用開始日は設定できません。",
	cl_ed_date_min_opedate: "運用日以前の適用終了日は設定できません。",
	cl_st_date_min_eddate: "最終予約日以前の適用開始日は設定できません",

	cl_st_date_min_del: "適用開始日が運用日より前のデータは削除できません。",
	cl_postalcode_inval: "郵便番号が不正です",

	cl_its_time_inval: "時刻の形式が誤っています。",
	cl_time_inval: "時刻の形式が誤っています。",

	cl_date_inval: "日付形式が誤っています。",
	cl_month_inval: "日付形式が誤っています。",
	cl_its_month_inval: "日付形式が誤っています。",
	cl_date_max: "日付が範囲外です。{0}前の日付を入力してください。",
	cl_date_min: "日付が範囲外です。{0}後の日付を入力してください。",
	cl_date_range: "日付が範囲外です。{0}〜{1}の日付を入力してください。",
	cl_its_date_inval: "{0}の日付形式が誤っています。",
	cl_its_date_max: "{0}の日付が範囲外です。{1}前の日付を入力してください。",
	cl_its_date_min: "{0}の日付が範囲外です。{1}後の日付を入力してください。",
	cl_its_date_range: "{0}の日付が範囲外です。{1}〜{2}の日付を入力してください。",

	cl_regex: "形式が誤っています。",
	cl_its_regex: "{0}の形式が誤っています。入力をご確認ください。",
	cl_autocomplete_mismatch: "選択肢の中から指定してください。",
	cl_staffcode_mismatch: "コードの指定が誤っています。",

	// 共通メッセージコード
	cl_sys_error: 'システムエラーが発生しました。',

	cl_sys_db_nomem: 'メモリ確保に失敗しました。',
	cl_sys_db_error: 'システムエラー：データベースアクセスに失敗しました。',
	cl_sys_db_access: 'システムエラー：データベースアクセスに失敗しました。',
	cl_sys_db_other: '別のユーザによってDBが更新されました。',

	cl_sys_fread: 'ファイルの読み込みに失敗しました。',
	cl_sys_fwrite: 'ファイルの書き込みに失敗しました。',

	cl_invalid_args: 'システムは要求を受け付けられませんでした。もう一度入力をご確認ください。',
	cl_fromto_error: '開始値と終了値が反転しています',

	cl_apl_error: 'アプリケーションエラーが発生しました。',
	cl_apl_access_denied: 'アクセスが許可されておりません。',

	cl_no_data: '検索結果は0件です。',
	cl_nodata: '検索結果は0件です。',
	ca_srch_maxover: '検索結果が多ぎます。絞込条件を追加してください。',

	cl_ini_failed: '初期表示データ取得に失敗しました。',
	cl_ini_nodata: '初期表示データがありません。',

	// 日付選択部品
	cl_datepicker_button_text: 'カレンダー',
	cl_date_error: '開始期間と終了期間が反転しています',
	cl_month_error: '開始年月と終了年月が反転しています',
	cl_time_error: '開始時刻と終了時刻が反転しています',

	cl_rtype_r_upd: "登録できないデータが含まれています。",
	cl_rtype_r_edit: "編集できないデータが含まれています。",
	cl_rtype_r_del: "削除できないデータが含まれています。",

	cl_rtype_upd: "登録できないデータです。",
	cl_rtype_rsvcancel: "予約取消できないデータです。",
	cl_rtype_del: "削除できないデータです。",

	cl_rtype_add_confirm: "新規登録が完了しました。",
	cl_rtype_upd_confirm: "登録が完了しました。",
	cl_rtype_del_confirm: "削除が完了しました。",
	cl_rtype_any_confirm: "{0}が完了しました。",

	cl_rtype_add_confirm_chk: "新規登録を行います。よろしいですか。",
	cl_rtype_upd_confirm_chk: "登録を行います。よろしいですか。",
	cl_rtype_del_confirm_chk: "削除を行います。よろしいですか。",

	cl_repetition_select: "どちらかひとつのみ選択してください。",
	cl_repetition_input: "どちらかひとつのみ入力してください。",
	cl_repetition: "データが重複しています。",

	cl_repetition_select_required: "どちらか選択してください。",
	cl_repetition_input_required: "どちらか入力してください。",

	cl_re_enter: "もういちど入力してください",

	// 個別エラーメッセージ
	no_staff_list: "社員を登録してください。",
	no_auth_list: "権限を登録してください。",
	is_upd_false: "更新権限がないため、編集はできません。",
	is_del_false: "削除権限がないため、削除はできません。"
});

/**
 * ORIGINAL messages2_ja.js
 */
var clmsg = _.extend((typeof clmsg === 'undefined') && {} || clmsg, {
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
	WMS0188: "同ファイル内の他の集約品番({1})に同一商品が記載されています。",
	WMS0189: "MDシステムに登録済みの他の集約品番({1})に同一商品が登録済です。",
	EMS0190: "セットアップ対象商品に、既存のセットアップ({0})に登録済みの商品が含まれています。",
	EMS0191: "タグ発行承認済以降はカラー・サイズの削除はできません。",
	EMS0192: "セットアップ設定がある品番の為削除できません。",
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
	EDS0059: "同一シートに複数のサイズパターンが存在しています。",
	EDS0060: "同一カラー商品の取込情報について一致していない項目があります。",
	EDS0061: "シート区分に1,2以外の値が指定されています。",
	EDS0062: "同一品番・同一カラーの基準在庫がすでにマスタに複数存在するため上書きできません。",
	EDS0063: "同一品番・同一カラーの商品が複数のシートに存在しています。",
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
	WDS0023: "（警告）品番（{0}）、カラー（{1}）の基準在庫がすでに存在します。",
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
	ETR0034: "移動明細シートがありません。",
	ETR0035: "移動明細シートが複数存在します。",
	ETR0036: "画面で指定した事業ユニットと出荷店舗の事業ユニットは同じにしてください。",
	ETR0037: "画面で指定した事業ユニットと入荷店舗の事業ユニットは同じにしてください。",
	ETR0038: "画面で指定した事業ユニットと商品の事業ユニットは同じにしてください。",
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
	EMD0014: "商品がすでに組合せ販売({0}:{1})に登録されているため、期間値下に登録できません。",
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
	EIC0027: "JANコード／タグコードが不正です。({0}行目)",
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
	ECM0046: "ファイルの取り込みでエラーがありました。",
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
	EGA0044: "指定されたシートがテンプレートのExcelファイルにありません。",
	EGA0045: "貼付シートはExcelファイルで非表示になります。貼付シート以外に表示されるシートが必要です。",
	IGA0001: "帳票出力フォルダに試行で帳票を出力しました。",
	EGA0046: "削除済カタログのある帳票は登録できません。",
	ESD0001: "対象商品内に同じ商品またはカラー商品が存在します。",
	ESD0002: "順位が重複しています。",
	ESD0003: "対象商品には最低{0}商品の登録が必要です。",
	ESD0004: "他の振分用集約品番({0})に登録済です。",
	ESD0005: "振分用集約商品のサイズパターンと異なるサイズパターンの商品です。",
	ESD0006: "同一振分用集約商品内では、対象商品のカラーコードはすべて設定するかしないかのいずれかです。",
	ESD0007: "この振分用集約商品はStoCSカラー商品マスタに登録されているため、削除できません。",
	ESD0008: "同一振分用集約商品内では、説明・メモはすべて同一にしてください。",
	ESD0009: "同一振分用集約商品内では、振分用集約商品名称はすべて同一にしてください。",
	ESD0010: "この振分用集約商品はカラー別設定のため、カラーなしにはできません。",
	ESD0011: "この振分用集約商品はカラー別設定しないため、カラー設定はできません。",
	ESD0012: "画面で指定された品種と異なります。",
	ESD0013: "品番指定時は、メーカーコードの指定は必須です。",
	ESD0014: "画面で指定されたサイズパターンと、サイズ列数が異なります。",
	ESD0015: "画面で指定されたサイズパターンと、各サイズ名の並びが異なります。",
	ESD0016: "最低在庫数・基準在庫上限数・サイズ構成比のいずれかの入力が必要です。",
	ESD0017: "最低在庫数/基準在庫上限数は、設定する場合は全サイズの入力が必要です。",
	ESD0018: "サブクラス1・サブクラス2・スタイル・シーズン・カラーコードのいずれかの入力が必要です。",
	ESD0019: "品番・集約品番のいずれかの入力が必要です。",
	ESD0020: "品番・集約品番は、いずれか1つのみ入力してください。",
	ESD0021: "指定されたカラー商品は、StoCSカラー商品マスタに登録されていません。",
	ESD0022: "商品カテゴリ(サブクラス1・サブクラス2・スタイル・シーズン)と商品(品番・集約品番)はどちらかしか指定できません。",
	ESD0023: "商品カテゴリ(サブクラス1・サブクラス2)と商品(品番・集約品番)はどちらかしか指定できません。",
	ESD0024: "属性名に重複があります。",
	ESD0025: "品番指定時は、カラーコードの指定が必須です。",
	ESD0026: "集約商品がカラー設定なしのため、カラーコードの指定が必須です。",
	ESD0027: "集約商品がカラー設定ありのため、カラーコードの指定はできません。",
	ESD0028: "基準在庫_振分可能数を超えた際の動作には、1、2以外は設定できません。",
	ESD0029: "集約品番以外では、集約品番の1品目あたりの上限在庫数に値を設定することはできません。",
	ESD0030: "集約品番以外では、同一JAN振分上限数に値を設定することはできません。",
	ESD0031: "品番以外では、セットアップIDを設定することはできません。",
	ESD0032: "フォロー期間は設定する場合は、開始日・終了日両方設定してください。",
	ESD0033: "納品日は過去日を設定することはできません。",
	ESD0034: "該当の商品は対象の集約商品の紐付商品に登録されていません。",
	ESD0035: "0か1のみ入力可能です。",
	ESD0036: "サイズ名ラベル行の前にデータ行が存在しています。",
	ESD0037: "サイズ構成比は、何れかのサイズの入力が必要です。",
	ESD0038: "画面で指定されたサイズパターンと異なります。",
	ESD0039: "対象商品を選択してください。",
	ESD0040: "集約品番の1品目あたりの上限在庫数と基準在庫_振分可能数を超えた際の動作の両方を設定することはできません。",
	ESD0041: "入力ファイルの作成日付が運用日と異なります。有効期間は当日のみです。",
	ESD0042: "サイズ構成比設定時は、少なくとも1つ以上のサイズに1以上の値を設定してください。",
	ESD0043: "対象商品のサイズ構成比が存在していません。",
	ESD0044: "対象商品の最低在庫が存在していません。",
	ESD0045: "指定のメーカー品番、集約品番、カラーは登録済みです。",
	ESD0046: "対象カラー商品の業務設定がされていません。",
	ESD0047: "閉店店舗が含まれています。",
	ESD0048: "店舗以外の項目が設定されていません。",
	ESD0049: "全体シートと商品別シートでどちらかに存在しない店舗があります。",
	ESD0050: "全体シートと商品別シートでどちらかに存在しない商品があります。",
	ESD0051: "グループ-下限入荷数が指定されていません。",
	ESD0052: "指定されたグループが存在しません。",
	ESD0053: "商品にグループが設定されていません。",
	ESD0054: "展開品番数が設定されていません。",
	ESD0055: "移動エリアが指定されていません。",
	ESD0056: "入・出荷店舗数が指定されていません。",
	ESD0057: "評価が設定されていないか負です。",
	ESD0058: "紐付商品、振分数が一つも設定されていません。",
	ESD0059: "店舗（{0}）、商品（{1}）、サイズ（{2}）のサイズ構成比が設定されていません。",
	ESD0060: "店舗（{0}）、商品（{1}）、サイズ（{2}）の最低在庫が設定されていません。",
	ESD0061: "店舗（{0}）、商品（{1}）、サイズ（{2}）の業務設定がされていません。",
	ESD0062: "入荷店舗数に指定された数が入荷可能な店舗数より多いため、入出荷候補の算出ができません。",
	ESD0063: "出荷店舗数に指定された数が出荷可能な店舗数より多いため、入出荷候補の算出ができません。",
	ESD0064: "全ての入荷品番数上限が0のため、入出荷候補の算出ができません。",
	ESD0065: "全体シートがありません。",
	ESD0066: "商品別シートがありません。",
	ESD0067: "セットアップ別シートがありません。",
	ESD0068: "全体シートが複数存在します。",
	ESD0069: "現在のパラメータでは入出荷候補の算出ができません。パラメータの見直しをお願いします。",
	ESD0070: "個店設定された移動後在庫の総数が移動可能な在庫総数よりも多いので個店設定通りの割振りは出来ません。",
	ESD0071: "個店と出荷禁止の設定により、移動後在庫推奨値が正しく算出出来ません。",
	ESD0072: "個店と入荷禁止の設定により、移動後在庫推奨値が正しく算出出来ません。",
	ESD0073: "注意　個店設定、出荷禁止の設定により、移動後在庫推奨値が総在庫数を超えています。移動推奨値出力はこのままでも続行可能です。",
	ESD0074: "注意　個店設定、入荷禁止の設定により、移動後在庫推奨値が総在庫数を下回っています。移動推奨値出力はこのままでも続行可能です。",
	ESD0075: "全体シートにない店舗コードです。",
	ESD0076: "出荷が可能な設定の店舗がありません。",
	ESD0077: "入荷が可能な設定の店舗がありません。",
	ESD0078: "セットアップ構成商品に該当セットアップに含まれていない商品が含まれています。",
	ESD0079: "構成商品別記載項目の項目数が不正です。",
	ESD0080: "品番（{0}）、カラー（{1}）の、構成商品別記載項目が(「({2})」)と(「({3})」)で異なります。",
	ESD0081: "指定した入荷店舗数と出荷店舗数の合計が全店舗数より多いため、入出荷候補の算出ができません。",
	ESD0082: "指定した入荷品番数下限に全商品数より多い値が設定されているため、入出荷候補の算出ができません。",
	ESD0083: "指定した入荷品番数下限に全セットアップ数より多い値が設定されているため、入出荷候補の算出ができません。",
	ESD0084: "指定された商品数({0}件)がこの機能の実行上限数({1}件)を超えています。",
	ESD0085: "Excelをcsvに変換する処理に失敗しました。",
	ESD0086: "入荷が可能な設定の店舗がありません。",
	ESD0087: "指定された商品が全て業務停止になっています。",
	ESD0088: "一部のカラーサイズ商品の移動後在庫推奨値が算出できませんでした。ファイルを確認して下さい。",
	ESD0089: "対象商品のサイズ構成比の合計が0になっています。",
	ESD0090: "対象品種の品種マスタが存在しません。",
	ESD0091: "品種マスタにて、学習期間が設定されていません。",
	ESD0092: "対象商品に基準在庫の業務設定が存在していません。",
	ESD0093: "自動出力対象に指定された商品の全てで、基準在庫の業務が停止になっています。",
	ESD0094: "需要予測学習日数は{0}～{1}の範囲で設定してください。",
	ESD0095: "指定された集約商品を紐付商品に展開した後の全商品の合計数({0}件)がこの機能の展開後実行上限数({1}件)を超えています。",
	WSD0001: "StoCSマスタ設定上では、再投入不可の店舗です。",
	WSD0002: "指定した全商品の全店舗で学習期間内の売上がなく在庫が0のためファイルは出力されません。",
	WSD0003: "自動出力対象に指定された商品の全てで、学習期間内に売上と在庫の実績が両方無い店舗のみの為、推奨値を出力しませんでした。",
	ISD0001: "この品種には自動出力対象に指定されている商品がありませんでした。",
	_eof: "clmsg//"
});

/**
 * 定数
 * 
 * @module clconst
 */

/**
 * @class clconst
 * @static
 */
var clconst = {};

_.extend(clconst, {
	ITEMATTRGRPFUNC_ID_SUBCLS1: 1,   // サブクラス1
	ITEMATTRGRPFUNC_ID_SUBCLS2: 2,   // サブクラス2
	ITEMATTRGRPFUNC_ID_USETYPE: 3,   // 用途区分
	ITEMATTRGRPFUNC_ID_COLOR: 4,   // カラー
	ITEMATTRGRPFUNC_ID_SEASON: 5,   // シーズン
	ITEMATTRGRPFUNC_ID_BRAND: 6,   // ブランド
	ITEMATTRGRPFUNC_ID_STYLE: 7,   // スタイル
	ITEMATTRGRPFUNC_ID_DESIGN: 8,   // 柄
	ITEMATTRGRPFUNC_ID_MATERIAL: 9,   // 素材
	ITEMATTRGRPFUNC_ID_COUNTRY: 10,  // 国
	ITEMATTRGRPFUNC_ID_FACTORY: 11,  // 縫製工場
	ITEMATTRGRPFUNC_ID_PARTS: 12,  // 部位
	ITEMATTRGRPFUNC_ID_TAGMATERIAL: 13,  // 素材(タグ用)
	ITEMATTRGRPFUNC_ID_SUBDESIGN: 14,  // サブ柄
	ITEMATTRGRPFUNC_ID_DESIGNCOLOR: 15,  // ベース色(柄色)
	ITEMATTRGRPFUNC_ID_CURRENCY: 16,  // 通貨
	ITEMATTRGRPFUNC_ID_MODELNOPLACE: 17,  // 部位(型番)
	ITEMATTRGRPFUNC_ID_ITOLOX: 18,   // 糸LOX
	ITEMATTRGRPFUNC_ID_AGG_SEASON: 19,  // 集約シーズン   *区分(分析の都合でiagfunc_idだけ定義)
	ITEMATTRGRPFUNC_ID_ITEM_TYPE: 20,  // 商品区分       *区分(分析の都合でiagfunc_idだけ定義)
	ITEMATTRGRPFUNC_ID_KI: 21,  // KI区分         *区分(分析の都合でiagfunc_idだけ定義)
	ITEMATTRGRPFUNC_ID_SIZE: 22,  // サイズ         *MtSize(分析の都合でiagfunc_idだけ定義)
	ITEMATTRGRPFUNC_ID_PRICELINE: 23,  // プライスライン *MtPriceline(集計Libの都合でiagfunc_idだけ定義)
	ITEMATTRGRPFUNC_ID_CUSTOMER: 24   // 客層
});


/**
 * ORIGINAL clcom.js
 *
 * @module clcom
 */
var clcom = {};

(function () {
	//IEでは、[console]が使えないので、回避するためのおまじない
	if (typeof window.console != 'object') {
		window.console = { log: function () { }, debug: function () { }, info: function () { }, warn: function () { }, error: function () { }, assert: function () { }, dir: function () { }, dirxml: function () { }, trace: function () { }, group: function () { }, groupEnd: function () { }, time: function () { }, timeEnd: function () { }, profile: function () { }, profileEnd: function () { }, count: function () { } };
	} else if (typeof window.console.debug != 'object') {
		window.console.debug = function () { };
	}
	//IEでは、[console]が使えないので、回避するためのおまじない

	//IE8では、[indexOf]が使えないので、回避するためのおまじない
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (elt /*, from*/) {
			var len = this.length;

			var from = Number(arguments[1]) || 0;
			from = (from < 0)
				? Math.ceil(from)
				: Math.floor(from);
			if (from < 0)
				from += len;

			for (; from < len; from++) {
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
		return (pathname.split('/').pop() || '').split('.').shift() || '';
	}

	/** ルート取得 */
	var _getUrlRoot = function () {
		if (location.protocol == "file:") {
			var path = '';
			var localtok = encodeURI('03.レビュー用');
			if (location.pathname.indexOf(localtok) >= 0) {
				path = location.pathname.replace(new RegExp('\\/' + localtok + '\\/.*'), "/" + localtok);
			} else {
				path = location.pathname.replace(/\/web\/.*/, "/web");
			}
			var url = '';
			if (location.host === '') {
				url = location.protocol + "//" + path;
			} else {
				url = location.protocol + "//" + location.host + path;
			}
			return url;
		} else {
			return location.protocol + "//" + location.host;
		}
	};

	/**
	 * 離席監視タイマー: ClKeepAlive クラス
	 *
	 * @class ClKeepAlive
	 * @constructor
	 * @param [options]
	 * @param [options.heartbeat]
	 * @param [options.life]
	 * @param [options.pingerEvents]
	 */
	var ClKeepAlive = function (options) {
		var defaults = {
			heartbeat: (60 * 1000),	// 監視間隔（ミリ秒単位）
			life: (10 * 60 * 1000),	// 寿命（ミリ秒単位）
			pingerEvents: ['mousemove', 'mousedown', 'keydown']
		};
		_.extend(this, _.defaults(options || {}, defaults));
	};
	_.extend(ClKeepAlive.prototype, /*Backbone.Events,*/ {
		// ストレージキー
		_storageKey: clcom.storagePrefix + 'ClKeepAlive.tm',
		/**
		 *
		 */
		resetTm: function () {
			var tm = Date.now();
			store.set(this._storageKey, tm);
			return tm;
		},
		/**
		 *
		 */
		getTm: function () {
			var tm = store.get(this._storageKey);
			return tm;
		},
		/**
		 * 離席監視タイマーを開始する。
		 *
		 * @method start
		 * @for ClKeepAlive
		 * @param {Object} opt
		 * @param {Integer} [opt.heartbeat] 監視間隔（ミリ秒）
		 * @param {Integer} [opt.life] 生存時間（ミリ秒）
		 */
		start: function (opt) {
			if (opt) {
				if (_.isNumeric(opt.heartbeat) && opt.heartbeat > 0) {
					this.heartbeat = opt.heartbeat;
				}
				if (_.isNumeric(opt.life) && opt.life > 0) {
					this.life = opt.life;
				}
			}

			this.stop();

			// 監視タイマー
			var tm = this.resetTm();
			this.workingTimer = setInterval(_.bind(function () {
				//console.log('ClKeepAlive.HP: ', this.getHP());
				if (this._isAlive()) {
					return;
				}
				this.stop();
				this._notifyTimedOut();
			}, this), this.heartbeat);

			// 発信側 - 画面に触った系イベント発生で poke するよう仕込む。
			var pinger = {
				x: 0,
				y: 0,
				timer: null,
				evCallback: _.bind(this._evPoke, this)
			};
			var $w = $(window);
			for (var i = 0; i < this.pingerEvents.length; i++) {
				var ev = this.pingerEvents[i];
				$w.bind(ev, pinger.evCallback);
			}
			this.pinger = pinger;

			console.log('KeepAlive.start: ' + tm);
		},

		/**
		 * 離席監視タイマーを停止する。
		 *
		 * @method stop
		 * @for ClKeepAlive
		 */
		stop: function () {
			if (this.workingTimer) {
				clearInterval(this.workingTimer);
				this.workingTimer = null;
				console.log('KeepAlive: workingTimer stop.');
			}
			if (this.pinger) {
				var $w = $(window);
				for (var i = 0; i < this.pingerEvents.length; i++) {
					var ev = this.pingerEvents[i];
					$w.unbind(ev, this.pinger.evCallback);
				}
				this.pinger = null;
				console.log('KeepAlive: pinger stop.');
			}
		},
		/**
		 * 内部タイマーを更新する。
		 *
		 * @method poke
		 * @for ClKeepAlive
		 */
		poke: function () {
			if (!this.workingTimer) {
				// 動作していない。
				return 'not-working';
			}
			if (this._isAlive()) {
				this.resetTm();
				return 'fine';
			} else {
				this.stop();
				this._notifyTimedOut();
				return 'dead';
			}
		},
		/**
		 * window 内のマウスイベント用の poke 発信関数
		 *
		 * @method _evPoke
		 * @private
		 * @param {Object} e イベントオブジェクト
		 *
		 */
		// window 内のマウスイベント等から poke を発信する。
		// 頻度が多いので、発信を遅延させ間引く。
		_evPoke: function (e) {
			var pinger = this.pinger;
			var _this = this;
			if (!pinger) {
				return;
			}
			if (pinger.timer) {
				//clearTimeout(pinger.timer);
				//pinger.timer = null;
				return;
			}
			pinger.timer = setTimeout(function () {
				try {
					if (e.type == 'mousemove') {
						var x0 = pinger.x, y0 = pinger.y;
						pinger.x = e.clientX;
						pinger.y = e.clientY;
						if (pinger.x == x0 && pinger.y == y0) {
							// mousemove 移動量が無いので poke しない
							return;
						}
					}
					_this.poke();
					//console.log(e.type + ', poke!');
				} finally {
					pinger.timer = null;
				}
			}, 200);
		},
		/**
		 * 生存確認
		 *
		 * @method _isAlive
		 * @private
		 */
		_isAlive: function () {
			if (!this.workingTimer) {
				return false;
			}
			var elapsedTime = Date.now() - this.getTm();
			var lifeGouge = this.life - elapsedTime;

			//console.log('KeepAlive.isAlive: elapsedTime[' + elapsedTime + '] lifeGouge[' + lifeGouge + ']');
			return (lifeGouge > 0);
		},
		/**
		 * タイムアウトしたことを通知する。
		 *
		 * @method _notifyTimedOut
		 * @private
		 */
		_notifyTimedOut: function () {
			console.log('KeepAlive: dead.');
			if (_.isFunction(this.onTimedOut)) {
				this.onTimedOut();
			}
		},
		/**
		 * タイムアウトまでの残り時間を返す。（デバグ用）
		 */
		getHP: function () {
			if (!this.workingTimer) {
				return -1;
			}
			var elapsedTime = Date.now() - this.getTm();
			var lifeGouge = this.life - elapsedTime;
			return lifeGouge;
		},
		/**
		 * タイムアウトまでの残り時間を１秒間隔で監視する（デバグ用）
		 */
		dbgWatchHP: function () {
			if (!this.workingTimer) {
				console.warn(not - working);
				return;
			}
			var _this = this, prevHP = null, intervalId = null;
			intervalId = setInterval(function () {
				var curHP = _this.getHP();
				if (curHP <= 0) {
					console.warn('already expired.');
					clearInterval(intervalId);
					return;
				}
				if (_.isNumber(prevHP) && prevHP < curHP) {
					console.info(curHP + '  (+' + (curHP - prevHP) + ')');
				} else {
					console.log(curHP + '  (' + (curHP - prevHP) + ')');
				}
				prevHP = curHP;
			});
		}
	});

	/**
	 * 共通情報
	 * @class clcom
	 * @static
	 *
	 */
	_.extend(clcom, {

		/** ルート */
		urlRoot: _getUrlRoot(),

		/** Storage プレフィックス */
		storagePrefix: 'clcom.',

		/**
		 * デフォルト設定値集（デフォルト税率も含む）
		 * @property cmDefaults
		 * @type object
		 * @static
		 *
		 * clutil.getIniJSON() 処理中で値を注入するので、
		 * getIniJSON() 処理完了後でなければ設定値が保証されない。
		 */
		cmDefaults: {
			defaultTax: 0
		},

		/**
		 * システムパラメタのキー・値マップ（clutil.getclsysparam）互換用。
		 * @property cmSysparam
		 * @type object
		 * @static
		 *
		 * clutil.getIniJSON() 処理中で値を注入するので、
		 * getIniJSON() 処理完了後でなければ設定値が保証されない。
		 */
		cmSysparamMap: {
		},

		/** 区分取得済みフラグ */
		f_settype: function () {
			// TODO:
			// 現在のログインが有効かつ、ログイン時に既に区分取得してストレージに補完済ならば・・・
			// を判定するロジックを書く。単に、クッキーパラメタのログインチェック的なことで足りるのかも・・・
			return false;
		}(),

		/**
		 * @method clcom.hasStorageKey
		 * ストレージのキー有無チェック
		 * @param {string} key キー文字列
		 * @param {string} [prefix] キープレフィックス。undefined でない場合は clcom.storagePrefix が適用される。
		 */
		hasStorageKey: function (key, prefix) {
			if (_.isEmpty(key)) {
				// キーが空欄 or null or undefiend
				return false;
			}
			var fixedKey;
			if (_.isString(prefix)) {
				fixedKey = prefix + key;
			} else {
				fixedKey = clcom.storagePrefix + key;
			}
			var val = store.get(fixedKey);
			return (val != null);
		},

		/**
		 * 権限テーブルをローカルストレージに保存する。
		 * @param {Array} permfunc 権限テーブル(loginレスポンス の permfunc)
		 */
		setPermfuncMap: function (permfuncList) {
			var key = clcom.storagePrefix + 'permfunc';
			var map = _.reduce(permfuncList, function (map, item) {
				map[item.func_code] = item;
				return map;
			}, {});
			store.set(key, map);
		},

		/**
		 * 権限テーブルをローカルストレージから削除する。
		 */
		removePermfuncMap: function () {
			var key = clcom.storagePrefix + 'permfunc';
			return store.remove(key);
		},

		/**
		 * RFID対象店舗をローカルストレージに保存する。
		 */
		setRfidstoreMap: function (rfidstoreList) {
			var key = clcom.storagePrefix + 'rfidstore';
			store.set(key, rfidstoreList);
		},

		/**
		 * 権限テーブルを取得する
		 */
		getPermfuncByCode: function (code) {
			var key = clcom.storagePrefix + 'permfunc';
			var map = store.get(key);
			code || (code = clcom.pageId);
			return map ? map[code] : undefined;
		},

		/**
		 * MtFuncRelテーブルをローカルストレージに保存する
		 */
		setFuncRel: function (funcRelList) {
			var key = clcom.storagePrefix + 'funcrel';
			var map = _.reduce(funcRelList, function (map, item) {
				map[item.c_code] = item.p_code;
				return map;
			}, {});
			store.set(key, map);
		},

		/**
		 * 親機能コードを返す
		 */
		getFuncRelParentCode: function (code) {
			var key = clcom.storagePrefix + 'funcrel';
			var map = store.get(key);
			code || (code = clcom.pageId);
			return map && map[code] || '';
		},

		/**
		 * 画面コードからメニュー中分類名を取得する
		 */
		getMiddleMenuName: function (code, recur) {
			code = code || clcom.pageId;
			var map = store.get(clcom.storagePrefix + 'viewcode2menu');
			var menu = map && map[code];
			var title = menu && menu.name || '';
			if (!title) {
				code = clcom.getFuncRelParentCode(code);
				if (code) {
					menu = map && map[code];
					title = menu && menu.name || '';
				}
			}
			if (!title && clcom.srcId && recur !== false) {
				// 取得できない場合は遷移元を引き継ぐ
				return clcom.getMiddleMenuName(clcom.srcId, false);
			}
			return title;
		},

		/**
		 * AMCMV0030GetReqのレスポンスから画面コード=>中分類メニューの
		 * ひもづけを作成しローカルストレージに保存する
		 * @param data AMCMV0030GetRsp
		 */
		setViewCode2Menu: function (data) {
			var key = clcom.storagePrefix + 'viewcode2menu',
				middleMenuGrpList = data.middleMenuGrpList,
				largeMenuGrpList = data.largeMenuGrpList,
				viewcode2menu = {};
			_.reduce(data.viewList, function (mapping, view) {
				var menu = _.where(middleMenuGrpList, {
					menuNodeID: view.parentMenuNodeID
				})[0];
				if (menu && menu.seqNo === -1) {
					menu = _.where(largeMenuGrpList, {
						menuNodeID: menu.parentMenuNodeID
					})[0];
				} else if (!menu) {
					menu = _.where(largeMenuGrpList, {
						menuNodeID: view.parentMenuNodeID
					})[0];
				}
				if (menu && menu.seqNo !== -1) {
					mapping[view.viewCode] = {
						name: menu.menuNodeName
					};
				}
				return mapping;
			}, viewcode2menu);
			store.set(key, viewcode2menu);
		},

		/**
		 * ログインユーザーが指定処理が実行可能かどうか判定する。
		 *
		 * 第2引数の機能コード省略時には関数呼び出し画面に対して判定す
		 * るので通常第2引数は指定しないこと。
		 *
		 * @method checkPermfunc
		 * @for clcom
		 * @param {String} ope 処理種別。"read", "write", "del", "em"のいずれか
		 * @param {String} [code=呼び出しを行った画面の機能コード]機能
		 *  コードを指定する。指定されない場合は、関数呼び出し画面の機
		 *  能コードを使用する。
		 * @return {Boolean} 処理が可能かどうか
		 *
		 * @example
		 * <pre><code>
		 * if (clcom.checkPermfunc("em")) {
		 *   // 緊急メンテ可能
		 * }
		 * </code></pre>
		 */
		checkPermfunc: function (ope, code, permfunc) {
			code || (code = clcom.pageId);
			permfunc || (permfunc = clcom.getPermfuncByCode(code));
			if (_.indexOf(["read", "write", "del", "em"], ope) < 0) {
				throw "処理引数が不正です[" + ope + "]";
			}
			if (permfunc) {
				return !!permfunc["f_allow_" + ope];
			}
		},

		/**
		 * 共通デフォルト値をストレージに保存する。
		 */
		setCmDefaults: function (defs) {
			var key = clcom.storagePrefix + 'cmdefaults';
			store.set(key, defs);
		},

		/**
		 * 共通デフォルト値をストレージから取得する。
		 */
		getCmDefaults: function () {
			var key = clcom.storagePrefix + 'cmdefaults';
			return store.get(key);
		},

		/**
		 * 共通デフォルト値を削除する。
		 */
		removeCmDefaults: function () {
			var key = clcom.storagePrefix + 'cmdefaults';
			store.remove(key);
		},

		/**
		 * システムパラメタをローカルストレージに保存する。
		 */
		setSysparamList: function (sysparalist) {
			var key = clcom.storagePrefix + 'sysparam';
			store.set(key, sysparalist);
		},

		/**
		 * システムパラメタをローカルストレージから削除する。
		 */
		removeSysparamList: function () {
			var key = clcom.storagePrefix + 'sysparam';
			// 区分リスト
			store.remove(key);
		},

		/**
		 * システムパラメタをローカルストレージから取得する。
		 */
		getSysparamList: function () {
			var key = clcom.storagePrefix + 'sysparam';
			return store.get(key);
		},

		/**
		 * システムパラメタを取得する
		 */
		getSysparam: function (paramname) {
			var list = clcom.getSysparamList();
			var sysparams = _.where(list, { param: paramname });
			return (sysparams.length > 0) ? sysparams[0].value : null;
		},

		/** AOKI
		 * 区分テーブルをローカルストレージに保存する。
		 * @param {Array} typelist 区分リスト
		 */
		setTypeList: function (typelist) {
			clcom.removeTypeList();
			// 区分リスト
			var key = clcom.storagePrefix + 'typelist';
			store.set(key, typelist);
		},
		/**
		 * AOKI
		 * 区分テーブルをローカルストレージから削除する。
		 */
		removeTypeList: function () {
			var key = clcom.storagePrefix + 'typelist';
			// 区分リスト
			store.remove(key);
		},

		/**
		 * AOKI
		 * 区分テーブルをローカルストレージから取得する。
		 * 引数
		 * ・kind：区分値名（省略可）
		 * ・ids：kind 下の特定 id または id 配列（省略可）
		 * 引数を指定しない場合は全区分の mix を返す。
		 */
		getTypeList: function (kind, ids) {
			//			↓区分未取得の場合：ひとまず getIniJSON へ区分テーブルGET処理を委譲
			//			if (this.f_settype == false) {
			//			this.typegetFromServer();
			//			this.f_settype = true;
			//			}
			// 区分リスト
			var key = clcom.storagePrefix + 'typelist';
			var alllist = store.get(key);

			// kind が指定されている場合は kind で絞る。
			var list = alllist;
			if (_.isNumber(kind)) {
				list = _.where(alllist, { typetype: kind });
			}

			// 区分個々の ids が指定されている場合は絞り込む
			var fixIds = null;
			if (_.isArray(ids)) {
				fixIds = ids;
			} else if (ids !== null && ids !== undefined) {
				fixIds = [ids];
			}
			if (fixIds) {
				list = _.filter(list, function (kbn) {
					return _.contains(fixIds, kbn.type_id);
				});
			}

			return list;
		},

		/** AOKI
		 * 税履歴をローカルストレージに保存する
		 * @param taxhistlist
		 */
		setTaxHistList: function (taxhistlist) {
			clcom.removeTaxHistList();
			// 区分リスト
			var key = clcom.storagePrefix + 'taxhistlist';
			store.set(key, taxhistlist);
		},
		/**
		 * AOKI
		 * 税履歴をローカルストレージから削除する。
		 */
		removeTaxHistList: function () {
			var key = clcom.storagePrefix + 'taxhistlist';
			// 区分リスト
			store.remove(key);
		},

		/**
		 * AOKI
		 * 税履歴をローカルストレージから取得する。
		 * 引数
		 * ・iymd:検索基準日（必須）
		 * 引数を指定しない場合は税率0 を返す。
		 */
		getTaxHist: function (iymd) {
			// 税履歴リスト
			var key = clcom.storagePrefix + 'taxhistlist';
			var taxhistlist = store.get(key) || [];

			var tax = 0;
			for (var i = 0; i < taxhistlist.length; i++) {
				var taxhist = taxhistlist[i];
				if (taxhist.fromDate <= iymd && iymd <= taxhist.toDate) {
					tax = taxhist.tax;
					break;
				}
			}
			return tax;
		},

		/** AOKI
		 * 取引先別税履歴をローカルストレージに保存する
		 * @param vendortaxhistlist
		 */
		setVendorTaxHistList: function (vendortaxhistlist) {
			clcom.removeVendorTaxHistList();
			// 区分リスト
			var key = clcom.storagePrefix + 'vendortaxhistlist';
			store.set(key, vendortaxhistlist);
		},
		/**
		 * AOKI
		 * 取引先別税履歴をローカルストレージから削除する。
		 */
		removeVendorTaxHistList: function () {
			var key = clcom.storagePrefix + 'vendortaxhistlist';
			// 取引先別税履歴リスト
			store.remove(key);
		},

		/**
		 * AOKI
		 * 取引先別税履歴をローカルストレージから取得する。
		 * 引数
		 * ・vendor_id: 取引先ID（必須）
		 * ・iymd:検索基準日（必須）
		 * 見つからない場合はnullを返す
		 */
		getVendorTaxHist: function (vendor_id, iymd) {
			// 税履歴リスト
			var key = clcom.storagePrefix + 'vendortaxhistlist';
			var vendortaxhistlist = store.get(key) || [];

			var tax = null;
			for (var i = 0; i < vendortaxhistlist.length; i++) {
				var vtaxhist = vendortaxhistlist[i];
				if (vtaxhist.vendor_id == vendor_id &&
					vtaxhist.fromDate <= iymd && iymd <= vtaxhist.toDate) {
					tax = vtaxhist.tax;
					break;
				}
			}
			return tax;
		},

		/** AOKI
		 * 権限テーブルをローカルストレージに保存する。
		 * @param {Array} funclist 権限リスト
		 * @deprecated
		 */
		setFuncList: function (funclist) {
			clcom.removeFuncList();
			var key = clcom.storagePrefix + 'funclist';
			store.set(key, funclist);
			clutil.setFuncGrp(funclist);
		},

		/**
		 * AOKI
		 * 権限テーブルをローカルストレージから削除する。
		 * @deprecated
		 */
		removeFuncList: function () {
			var key = clcom.storagePrefix + 'funclist';
			store.remove(key);
			key = clcom.storagePrefix + 'funcgrp';
			store.remove(key);
		},

		/**
		 * AOKI
		 * 権限テーブルをローカルストレージから取得する。
		 * @deprecated
		 */
		getFuncList: function () {
			var key = clcom.storagePrefix + 'funclist';
			return store.get(key);
		},
		/**
		 * 権限グループ？
		 * @deprecated
		 */
		getFuncGrp: function () {
			var key = clcom.storagePrefix + 'funcgrp';
			return store.get(key);
		},

		/** AOKI
		 * よく使う項目を保存する。
		 * @param {Array} freqlist よく使う項目リスト
		 * @param {integer} userId ユーザーID
		 * @deprecated
		 */
		setFrequentList: function (freqlist, userId) {
			clcom.removeFrequentList(userId);
			var store = window.store;
			var key = clcom.storagePrefix + 'userId' + userId + 'frequent';
			store.set(key, freqlist);
		},

		/**
		 * AOKI
		 * よく使う項目をローカルストレージから削除する。
		 * @param {integer} userId ユーザーID
		 * @deprecated
		 */
		removeFrequentList: function (userId) {
			var key = clcom.storagePrefix + 'userId' + userId + 'frequent';
			var store = window.store;
			store.remove(key);
		},

		/**
		 * AOKI
		 * よく使う項目をローカルストレージから取得する。
		 * @param {integer} userId ユーザーID
		 * @deprecated
		 */
		getFrequentList: function (userId) {
			var key = clcom.storagePrefix + 'userId' + userId + 'frequent';
			var frequentList = store.get(key);
			clcom.removeFrequentList(userId);
			// 古い項目は消去する
			if (frequentList == null || frequentList.length == 0) {
				return [];
			}
			for (var i = frequentList.length - 1; i >= 0; i--) {
				var freq = frequentList[i];
				// 1ヶ月前のものは消す
				var today = clcom.getOpeDate();
				if (today - freq.date > 100) {
					frequentList.splice(i, 1);
				}
			}
			clcom.setFrequentList(frequentList, userId);
			return frequentList;
		},

		/** AOKI
		 * 役職区分を保存する。
		 * @param {Array} jobpostlist 役職区分リスト
		 * @deprecated
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
		 * @deprecated
		 */
		removeJobpostList: function () {
			var key = clcom.storagePrefix + 'jobpost';
			var store = window.store;
			store.remove(key);
		},

		/**
		 * AOKI
		 * 役職区分をローカルストレージから取得する。
		 * @deprecated
		 */
		getJobpostList: function () {
			var key = clcom.storagePrefix + 'jobpost';
			return store.get(key);
		},

		/**
		 * ストレージをクリアする
		 */
		clearStorage: function (args) {
			// クリア除外キー
			var savingKeys = {};
			if (!(args && args.removeUserData === true)) {
				// ログイン情報をストレージ - 引数 args.removeUserData で true 明示しない場合は保護対象。
				savingKeys[clcom.storagePrefix + 'userdata'] = true;
			}

			// キー一覧からストレージをクリアしていく。
			var storeKeyMap = store.keys();
			var regEx = new RegExp('^' + clcom.storagePrefix.replace(/\.*$/, '') + '\\.');
			var delKeys = _.reduce(storeKeyMap, function (delkeys, v, k) {
				do {
					if (!regEx.test(k)) {
						break;
					}
					if (savingKeys[k]) {
						break;
					}
					delkeys.push(k);
				} while (false);
				return delkeys;
			}, []);
			if (!_.isEmpty(delKeys)) {
				store.remove(delKeys);
			}

			//			// 共通
			//			// 運用日をストレージから消去
			//			clcom.removeOpeDate();
			//			// 区分リストをストレージから消去
			//			clcom.removeTypeList();
			//			// システムパラメタをストレージから消去
			//			clcom.removeSysparamList();
			//			// 共通デフォルト値をストレージから消去
			//			clcom.removeCmDefaults();
			//			// 権限
			//			clcom.removePermfuncMap();
			//			// 権限リストをストレージから消去
			//			clcom.removeFuncList();					// @deplicated
			//			if(args && args.removeUserData === true){
			//				// ログイン情報をストレージから消去
			//				clcom.removeUserData();
			//			}
			//			// pushpopをストレージから消去
			//			store.remove('clcom.pushpop');
		},

		/**
		 * ストレージキャッシュ情報を clcom のプロパティへロードする。
		 */
		loadStorage: function () {
			// 共通デフォルト値
			var defs = clcom.getCmDefaults();
			_.extend(clcom.cmDefaults, defs);

			// シスパラ - 旧暫定I/F互換用
			var sysparalist = clcom.getSysparamList();
			clcom.cmSysparamMap = _.reduce(sysparalist, function (keyValDto, item) {
				var key = item.param;
				var val = _.isFinite(item.value) ? Number(item.value) : item.value;
				keyValDto[key] = val;
				return keyValDto;
			}, {});
		},

		/** APIのパス */
		apiRoot: _getUrlRoot() + "/system/api",

		/** AOKI appのパス */
		appRoot: _getUrlRoot() + "/system/app",

		/** HOME とするページの URL */
		homeUrl: _getUrlRoot() + "/system/app/AMCM/AMCMV0030/AMCMV0030.html",

		/** アップロード先URI */
		uploadDestUri: _getUrlRoot() + '/system/api/fileupload',//'/system/api/am_cm_fileupload',

		/** ログアウトURI */
		logoutDestUri: _getUrlRoot() + '/api/logout',

		getPageIdFromPath: getPageId,

		/** 当該ページのID: 当該ページが foo.html ならば、pageIdは 'foo' */
		pageId: getPageId(location.pathname),

		// 当該ページのタイトル
		pageTitle: document.title,	// TODO DBから取得する

		// 画面遷移パラメタ(clcom定義の下で設定しています)
		pageArgs: undefined,

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

		// AOKI:ページ内レコード数(店舗)
		itemsOnPage: 10,

		// AOKI:ページ内レコード数(SC)
		itemsOnPageSC: 25,

		// AOKI:テーブルスクロール用高さ
		fixedHeaderTableHeight: 300,

		// ユーザ基本情報 - getIniJSON の後にセットされる。
		userInfo: {},

		// 運用日
		ope_date: 0,

		// 最終日付(固定)
		max_date: 20701231,

		// 最小日付(固定)
		min_date: 19910101,//19900102,

		// 編集領域に表示可能な要素数(店舗などの複数選択用)
		list_max: 1000,

		// 禁則文字の定義
		kinsokuTable: (function () {
			return "\u301C";
		}()),

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
		removeOpeDate: function () {
			var key = clcom.storagePrefix + 'opedate';
			var store = window.store;
			store.remove(key);
		},

		/**
		 * AOKI
		 * 運用日をローカルストレージから取得する。
		 */
		getOpeDate: function () {
			var key = clcom.storagePrefix + 'opedate';
			return store.get(key);
		},

		/**
		 * AOKI
		 * 基準商品分類体系IDを保存する
		 * @param {Integer} 基準商品分類体系ID
		 */
		setItgrpFuncBasic: function (basic_itgrp_func) {
			clcom.removeItgrpFuncBasic();
			var store = window.store;
			var key = clcom.storagePrefix + 'basicitgrpfunc';
			store.set(key, basic_itgrp_func);
		},

		/**
		 * AOKI
		 * 基準商品分類体系IDをローカルストレージから削除する
		 */
		removeItgrpFuncBasic: function () {
			var key = clcom.storagePrefix + 'basicitgrpfunc';
			var store = window.store;
			store.remove(key);
		},

		/**
		 * AOKI
		 * 基準商品分類体系IDをローカルストレージから取得する
		 * @returns
		 */
		getItgrpFuncBasic: function () {
			var key = clcom.storagePrefix + 'basicitgrpfunc';
			var store = window.store;
			return store.get(key);
		},

		/**
		 * AOKI
		 * （品種）商品分類階層IDを保存する
		 * @param {Integer} 基準商品分類体系ID
		 */
		setStdItgrpLevel: function (std_itgrp_level) {
			clcom.removeStdItgrpLevel();
			var store = window.store;
			var key = clcom.storagePrefix + 'stditgrplevel';
			store.set(key, std_itgrp_level);
		},

		/**
		 * AOKI
		 * （品種）商品分類階層IDをローカルストレージから削除する
		 */
		removeStdItgrpLevel: function () {
			var key = clcom.storagePrefix + 'stditgrplevel';
			var store = window.store;
			store.remove(key);
		},

		/**
		 * AOKI
		 * （品種）商品分類階層IDをローカルストレージから取得する
		 * @returns
		 */
		getStdItgrpLevel: function () {
			var key = clcom.storagePrefix + 'stditgrplevel';
			var store = window.store;
			return store.get(key);
		},

		// AOKI:pagerselectorの初期値
		pagerselectval: 10,

		/**
		 * ブラウザの状態を取得する
		 */
		onMobile: 0,
		onPC: 1,

		getAgent: function () {
			var agent = navigator.userAgent;

			if (agent.search(/iPhone/) != -1) {
				return clcom.onMobile;
			} else if (agent.search(/iPad/) != -1) {
				return clcom.onMobile;
			} else if (agent.search(/Android/) != -1) {
				return clcom.onMobile;
			} else {
				return clcom.onPC;
			}
		},

		// モバイルデバイス判定関数
		is_iPad: function () {
			var flag = false;
			var agent = navigator.userAgent;
			if (agent.search(/iPad/) != -1) {
				flag = true;
			}
			return flag;
		},
		is_iPhone: function () {
			var flag = false;
			var agent = navigator.userAgent;
			if (agent.search(/iPhone/) != -1) {
				flag = true;
			}
			return flag;
		},
		is_Android: function () {
			var flag = false;
			var agent = navigator.userAgent;
			if (agent.search(/Android/) != -1) {
				flag = true;
			}
			return flag;
		},

		/** AOKI
		 * ユーザ情報
		 */
		setUserData: function (userData) {
			var store = window.store;
			var key = clcom.storagePrefix + 'userdata';
			store.set(key, userData);
		},

		/**
		 * AOKI
		 * ユーザ情報
		 */
		removeUserData: function () {
			var key = clcom.storagePrefix + 'userdata';
			var store = window.store;
			store.remove(key);
		},

		/**
		 * AOKI
		 * ユーザ情報
		 */
		getUserData: function () {
			var key = clcom.storagePrefix + 'userdata';
			return store.get(key);
		},

		//////////////////////////////////////////////////////////////////////
		// 関数

		/**
		 * ページの状態をページスタックにつみ、ページ遷移する
		 * @param {String} url 遷移先ページURL
		 * @param {Mixed} args 遷移先ページへの引数
		 * @param {Mixed} data 保存データ
		 */
		pushPage: function (url, args, data) { },

		/**
		 * ページスタックのトップのページに戻る。スタックは1つ減る
		 *
		 * @param {Mixed} returnValue リターン値
		 * @param {Integer} n いくつ戻るか
		 */
		popPage: function (returnValue, n) { },

		/**
		 * pushPage の別名(とりあえず)
		 */
		transfer: function (url, args, data) { },

		/**
		 * 指定されたクッキーの有無を検査する。
		 * @param cookey
		 * @returns {Boolean} 値があれば True を返す。
		 */
		hasCookie: function (cookey) {
			var arg = cookey + '=';
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
		delCookie: function (cookey) {
			document.cookie = cookey + "=dummy;expires=Thu, 01 Jun 1970 00:00:00 GMT; path=/";
		},

		/**
		 * クッキーに認証情報があるかどうかを判定する。
		 * @returns {Boolean} 認証情報がある場合は True を返す。
		 */
		hasAuthCookies: function () {
			// JSESSIONID 有無
			//			if (!clcom.hasCookie('JSESSIONID')) {
			if (!clcom.hasCookie('auth_token')) {
				return false;
			}
			return true;
		},

		cancelBeforeUnload: function (url) {
			var target = null;
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

		// HOME へ戻る
		gohome: function (url) {
			if (_.isEmpty(url)) {
				url = clcom.homeUrl;
			}

			// ストレージをクリア	-- 再取得は遷移先で GetIniJSON でとるか・・・
			clcom.clearStorage();

			clcom.location(url);
		},

		/** ログアウト */
		logout: function (url/*省略可*/, keepPage/*省略可、true:ログアウト処理後、現在のページ維持*/) {
			var o = {
				url: clcom.urlRoot,
				keepPage: false
			};
			if (arguments.length === 1 && _.isObject(arguments[0])) {
				_.extend(o, arguments[0]);
			} else {
				o = _.defaults({
					url: arguments[0],
					keepPage: arguments[1]
				}, o);
			}

			// ストレージをクリア
			clcom.clearStorage({ removeUserData: true });

			// ログアウト処理
			return $.ajax(clcom.logoutDestUri, {
				type: 'GET',
				dateType: 'json',
				contentType: 'application/jason',
				cache: false,
				timeout: 5000,
				success: function () {
					console.log('logout success: ', arguments);
				},
				error: function (xhr, status, exp) {
					console.warn('[' + status + '] logout failed.');
				},
				complete: function (xhr, status) {
					if (!o.keepPage) {
						clcom.location(o.url);
					}
				}
			});
		},

		// 離席タイマー
		keepAlive: new ClKeepAlive({
			life: (20 * 60 * 1000),	// 生存時間：20分に設定
			heartbeat: (60 * 1000),	// 監視間隔: 1分毎

			// 離席タイムアウト時のアクション
			onTimedOut: function () {
				clcom.logout(clcom.urlRoot + '/err/unauthorized.html');
			}
		}),

		/**
		 * 指定 target 名の要素を表示するようスクロールジャンプする。
		 * @param {string} target ジャンプ先の target 属性名
		 * @param {integer} [delay] 指定ミリ秒遅らせる
		 */
		targetJump: function (target, delay) {
			var savedHash = location.hash;
			if (delay < 0) {
				delay = 0;
			}
			return setTimeout(function () {
				location.hash = "#" + target;
				if (_.isEmpty(savedHash)) {
					savedHash = '#' + Date.now();
					console.info('clcom.targetJump: replace new location.hash[' + savedHash + ']');
				}
				location.hash = savedHash;
			}, delay);
		},

		toString: function () {
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
	function newWindow(url, hash, target) {
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
			.filter(function (value, index) { return index % 2 === 1; })
			.map(function (value) {
				return {
					url: value.srcUrl,
					label: value.srcPageTitle // TODO
				};
			})
			.value();

		function push() {
			var opts;
			if (arguments.length === 1 && _.isObject(arguments[0])) {
				opts = arguments[0];
			} else {
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
			/* clearフラグ追加 2013/10/17 */
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
				popable: !opts.newWindow,
				srcUrl: location.href,
				srcId: clcom.pageId,
				srcPageTitle: clcom.pageTitle,
				hash: hash
			});

			store.set('clcom.pushpop', s);
			var newWindowTarget = (_.isString(opts.newWindow) && !_.isEmpty(opts.newWindow)) ? opts.newWindow : null;
			if (opts.download) {
				if (opts.newWindow) {
					window.open(opts.url, newWindowTarget);
				} else {
					location.href = opts.url;
				}
			} else if (opts.newWindow) {
				newWindowTarget = newWindowTarget || "_blank";
				newWindow(opts.url, hash, newWindowTarget);
			} else {
				go(opts.url, hash);
			}
		}


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

		function beforeunload() {
			console.log('beforeuload');
			if (!pushd) {
				if (clcom._nowdownloading) {
					location.hash = clcom.pageHash;
					return;
				}

				if (!clcom._preventConfirmOnce && !clcom._preventConfirm) {
					// ページ移動前の確認
					return 'ブラウザの【戻る】【進む】【リロード】ボタンを使用しています。【キャンセル】をクリックして、現在のページから移動しないでください。';
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
			transfer: push,
			srcId: current.srcId,
			srcPageTitle: current.pageTitle,
			srcUrl: current.srcUrl,
			dstId: savedData.dstId,
			dstUrl: savedData.dstUrl,
			returnValue: savedData.returnValue,
			pageArgs: current.args,
			pageData: savedData.saved,
			_history: history,
			pushpop: {
				popable: current.popable
			}
		};
	}());
	_.extend(clcom, pushpop);

	console.log(clcom.toString());
}());

/**
 * @module clutil
 */
/**
 * ORIGINAL clutil.js
 * @class clutil
 * @static
 */
var clutil = {};

var _clInternalErrorHandler = function (message) {
	clutil._setErrorHeader($('.cl_echoback'), message);
};

(function () {
	//	var getYmd =	function (ymd, format) {
	//		if (ymd instanceof jQuery) {
	//			ymd = ymd.val();
	//		}
	//		ymd = clutil.dateFormat(ymd, format || 'yyyymmdd');
	//		return ymd;
	//	};
	//
	//	var buildSelectorItems = function (template, list, firstItem, selializer) {
	//		selializer = selializer || _.identity;
	//		var markup = _.map(list, function (data) {
	//			return template({d: selializer(data, list)});
	//		}).join('');
	//		var $select = $('<select>').html(markup);
	//		_.each($select.children(), function (option, i) {
	//			$(option).data('cl', list[i]);
	//		});
	//		$select.prepend(firstItem);
	//		return $select.children();
	//	};

	/** ユーティリティ */
	_.extend(clutil, {
		// XXX selectpicker で必ず「未選択」を入れるかどうかフラグ。【暫定】
		forceUnselectFlag: true,

		/** 今ブロッキング中かどうかフラグ	*/
		UIBlocking: 0,
		/** 画面をブロックする */
		blockUI: function (a, options) {
			console.log('blockUI called, [' + a + '], flag[' + clutil.UIBlocking + ']');
			if (clutil.UIBlocking > 0) {
				clutil.UIBlocking++;	// TODO:clutilはthisにすべき？
				return;
			} else {
				clutil.UIBlocking++;
				//				$.blockUI({ centerY: 0, css: { top:'10px', left:'', right:'10px' } });
				var msg = '<div id="loading" class=""><img src="' + clcom.urlRoot + '/images/loader.gif"></div>';
				$.blockUI(_.extend({
					css: { 'backgroundColor': 'none', 'border': 'none' },
					message: msg
				}, options));
				console.log('blockUI blocked');
			}
		},
		/** 画面のブロックを解除する */
		unblockUI: function (a) {
			console.log('unblockUI called, [' + a + '], flag[' + clutil.UIBlocking + ']');
			clutil.UIBlocking--;
			if (clutil.UIBlocking <= 0) {
				clutil.UIBlocking = 0;
				$.unblockUI();
				console.log('unblockUI unblocked');
			}
		},

		/**
		 * サーバ呼び出しラッパ関数。
		 * @param t HTTPメソッド
		 * @param res リソースパス
		 * @param data JSONデータ
		 * @param appcallback function(data,dataType)
		 * @param {Function} completed
		 * @param {String} resType
		 * @param {jQuery Object} $form optional
		 * @param {object} options.blockUIOptions blockUIに渡すオプション
		 * data 形式は、
		 * {
		 *	 // ヘッダ情報
		 *	 rspHead: {
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
		httpcall: function (options, resId) {
			// 引数補完
			if (_.isUndefined(resId) && _.has(options, 'resId')) {
				resId = options.resId;
			}

			// セッションクッキーチェックは getIniJSON で実施済につき、ここでは省略。

			// タイマーをセット
			if (clcom.keepAlive.poke() == 'dead') {
				console.log('httpcall: keepAlive - dead.');
				var fakeRsp = {
					status: 'error',
					message: 'cl_http_status_unauthorized',
					httpStatus: 401
				};
				return $.Deferred().reject(clutil.ajaxErrorHandler({
					head: fakeRsp,		// 互換性のために残す
					rspHead: fakeRsp	// 通常のAPLはこっちを見る
				}));
			}

			var deferred = $.Deferred();

			var params = _.extend({
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

			var reqData = options.data;

			var success = params.success;
			params.success = function (data, dataType) {
				var appStat = am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK;	//0;
				if (data.rspHead) {
					appStat = data.rspHead.status;
					// AOKI 運用日を設定する
					if (data.rspHead.ope_iymd !== 0) {
						clcom.setOpeDate(data.rspHead.ope_iymd);
					}
				}
				if (data.rspPage && params.onRspPage !== false /* false を明示した場合はイベント発火させないでおく */) {
					// ページャ情報の応答を通報する
					// ページ応答は total_record しか信用しないので、ページ要求のパラメタで拡張して渡す。
					// このイベント発火によって、
					// clutil.view.PaginationView と連携し、自動的にページネーションの表示を同期化する。
					clutil.mediator.trigger('onRspPage', resId, _.extend({}, data.rspPage, reqData.reqPage));
				}
				if (success)
					success(data, dataType);
				if (appStat !== am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK)
					// fail(callback) で待ち受ければアプリエラーの場合に呼ばれる。
					deferred.reject(data);
				else
					// done(callback) や then(callback) で応答処理を待ち受ければ、必ず成功した場合に呼ばれる。
					deferred.resolve(data, dataType);
			};

			var error = params.error;
			params.error = function (xhr, textStatus, errorThrown) {
				console.error('error, textStatus[' + textStatus + "]");
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

			clutil.blockUI(params.url, options.blockUIOptions);
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
					clcom.location(clcom.urlRoot + '/err/unauthorized.html');
					break;
				case 501:		// Bad Gateway
					errcode = "cl_http_status_501";
					break;
				case 503:		  // forbidden
					clcom.location(clcom.urlRoot + '/err/unavailable.html');
					break;
				default:
					break;
			}
			var head = {
				status: "error",		// 0 でないのを入れる
				message: errcode,
				httpStatus: xhr.status
			};
			return {
				// 互換性のために残す
				head: head,
				// 通常のAPLはこっちを見る
				rspHead: head
			};
		},

		_dlDialogVer: function (url) {
			var template = _.template(
				'<button class="btn dlg-cancel">キャンセル</button>' +
				'<a class="btn btn-primary dlg-apply" href="<%= url %>"' +
				' target="_blank">ダウンロード</a>'
			);
			var $dialog = new clutil.ConfirmDialog({
				footer: template({ url: url }),
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
			$(template({ url: encodeURI(url) })).appendTo($('body'));
		},

		_download: function (url) {
			var $form = $('#clDownloadFrom');
			if (!$form.length) {
				$form = $(clutil._downloadFormTemplate({ url: encodeURI(url) }))
					.appendTo($('body'));
			}
			$form.submit();
		},

		download: function () {
			var opts;
			if (arguments.length === 1 && _.isObject(arguments[0])) {
				opts = arguments[0];
			} else {
				opts = {
					url: arguments[0],
					id: arguments[1]
				};
			}
			var url = encodeURI(opts.url);

			function startDownlaod(o) {
				clcom._preventConfirmOnce = true;
				if (window.navigator.standalone) {
					clcom.pushPage("dbapi-1://" + o.url, null, null, true);
					//					location.href = "dbapi-1://" + _url;
				} else {
					o.download = true;
					clcom.pushPage(o);
					//					location.href = _url;
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
			if (opts.id != null) {
				var req = {
					cond: {
						file_id: opts.id
					}
				};
				// データを取得
				clutil.postJSON('gscm_filechk', req, _.bind(function (data, dataType) {
					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						if ($.browser.msie && $.browser.version < 9) {
							removeDownloadBar();
							createDownloadBar(opts.url);
						} else {
							startDownlaod(opts.url);
						}
					} else {
						clutil.ErrorDialog('ファイルがみつかりませんでした。');
					}
				}, this));
			} else {
				if ($.browser.msie && $.browser.version < 9) {
					removeDownloadBar();
					createDownloadBar(opts.url);
				} else {
					startDownlaod(opts);
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
		getIniJSON: function (res, appcallback, completed) {
			// ユーザ情報を設定する
			clcom.userInfo = clcom.getUserData();

			// クッキーによるログインチェック
			if (!clcom.hasAuthCookies() || _.isEmpty(clcom.userInfo)) {
				// ログインしていない場合
				//clutil.gohome(clcom.urlRoot + '/err/nosession.html');
				var errHd = {
					status: 'error',
					message: 'cl_http_status_unauthorized',
					httpStatus: 401
				};

				var d = $.Deferred();
				return d.reject({ head: errHd, rspHead: errHd });
			}

			if (_.isEmpty(clutil.cStr(clcom.srcId))) {
				// ここは、直リンらしい。
				// 直リンされたら、強制ログアウト？
				//clcom.logout();					// FIXME: ポータル画面ができるまでＯＦＦ
			}

			// 離席タイマー開始
			//clcom.keepAlive.start();

			var defer = null;
			if (true) {
				// 初期パラメータの取得を仕掛ける。
				var dd = [];

				// 区分＆シスパラ
				if (!clcom.hasStorageKey('typelist')
					|| !clcom.hasStorageKey('sysparam')
					|| !clcom.hasStorageKey('cmdefaults')) {
					var typDefer = clutil.postJSON('am_pa_type_get', {}).done(function (data) {
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
						var defaults = _.reduce(data, function (defs, val, key) {
							if (/^default/.test(key)) {
								defs[key] = val;
							}
							return defs;
						}, {});
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
						return;	// OK
					}

					var pm = clcom.getPermfuncByCode(pageId);
					if (!_.isEmpty(pm) && (pm.f_allow_del || pm.f_allow_em || pm.f_allow_read || pm.f_allow_write)) {
						return; // OK
					}

					// 権限ＮＧ - 403 アク禁として扱う
					return errHd = {
						status: 'error',
						message: 'cl_http_status_forbidden',	// アクセスが拒否されました。
						httpStatus: 403
					};
				};
				if (!clcom.hasStorageKey('permfunc')) {
					var permDefer = clutil.postJSON('am_pa_perm_get', { cond: { user_id: clcom.userInfo.user_id } }).then(function (data) {
						// 権限情報をキャッシュに保存
						clcom.setPermfuncMap(data.perm_func);
						clcom.setRfidstoreMap(data.rfid_store_list);

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
				// 子機能コードから親機能コードへのマッピング作成と保存
				if (!clcom.hasStorageKey('funcrel')) {
					dd.push(clutil.postJSON('am_pa_funcrel_get', {}).then(function (data) {
						clcom.setFuncRel(data.type);
					}));
				}
				// 画面コードから中分類メニュー名のマッピング作成
				if (!clcom.hasStorageKey('viewcode2menu')) {
					// 2016/4/20 iPadフラグを設定(メニュー構築用)
					// 2016/11/25 iPod touch用も追加
					var isTablet = 0;
					if (clcom.is_iPad() || clcom.is_iPhone()) {
						isTablet = 1;
					}

					dd.push(clutil.postJSON('AMCMV0030', {
						reqHead: {
							opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						},
						AMCMV0030GetReq: {
							userID: clcom.userInfo.user_id,
							isTablet: isTablet
						}
					}).then(function (data) {
						clcom.setViewCode2Menu(data.AMCMV0030GetRsp);
						// ポータル画面からアクセスできるように保存しておく。
						// 2重リクエスト防止のため
						clcom.AMCMV0030data = data;
					}));
				}
				defer = $.when.apply($, dd);
			}

			// 画面コードから中分類メニューを取得する。
			defer = defer.then(function () {
				var title = clcom.getMiddleMenuName();
				if (title) {
					$('title').text(clcom.getMiddleMenuName());
				} else {
					console.warn('中分類メニュー名が取得できない');
				}
			});

			// アプリ個別コールが設定されている場合
			if (res != null) {
				defer = defer.then(function () {
					return clutil.getJSON(res, appcallback, completed);
				});
			} else if (_.isFunction(completed)) {
				defer = defer.then(function () {
					completed();
					return this;	// XXX これでいいのか未検証
				});
			}

			return defer.promise();
		},

		/**
		 * 初期データ取得用 GET メソッド
		 * AOKI
		 * @param res アプリ専用の初期情報取得リソース
		 * @param appcallback アプリ固有の初期情報取得コールバック
		 * @returns {jqXHR}
		 * @deprecated getIniJSON を使用してください。
		 *   アプリコールが欲しい場合は、postIniJSON の deferd に対して
		 *   then(callback), done(callback) を使用してください。
		 */
		postIniJSON: function (resId, data, appcallback, completed) {
			if (resId != null) {
				clutil.postJSON(resId, data, appcallback, completed, resId);
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
		 * ダウンロード要求を HTTP POST メソッドで投げます。
		 * リクエストデータ data に共通ヘッダが無い場合は補完します。
		 * ページデータが無い場合は 0～、page_size INT_MAX で補完します。
		 * 呼び出しが成功した場合は、返却された uri に対してダウンロードを
		 * 実行します。よって、成功時のハンドリングは不要です。
		 * 失敗の検出は、本メソッドが返却する Defered オブジェクトに対して、
		 * fail をハンドリングしてください。
		 *
		 * 注意：
		 * ・共通ヘッダの規約に則っていること。
		 * ・出力結果が０件の場合は、正常終了かつ、uri が空欄で返却すること。
		 *
		 * 実装例：
		 * var req = this.buildReq();	// リクエストをつくる
		 * var defer = clutil.postDLJSON('AOKMD9999', req);
		 * defer.fail(_.bind(function(data){
		 * 	// エラーが発生。
		 *	// ヘッダーにメッセージを表示
		 *	this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
		 * },this));
		 *
		 */
		postDLJSON: function (resId, data) {
			var params;

			if (arguments.length === 1 && _.isObject(resId)) {
				params = resId;
			} else {
				params = {
					resId: resId,
					data: data
				};
			}

			data = params.data;

			// リクエストヘッダ補完 - 共通ヘッダを補完
			if (!data.reqHead) {
				data.reqHead = {};
			}
			if (!data.reqHead.opeTypeId) {
				data.reqHead.opeTypeId = 0;
			}
			// 出力系以外の ope の場合は、CSV 出力へ倒す。
			var newWindow = false;
			switch (data.reqHead.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:
					newWindow = '_blank';
				// fall through
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:
					break;
				default:
					data.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV;
			}
			// ページ情報を上書き：空オブジェクト
			if (!_.isObject(data.reqPage)) {
				data.reqPage = {
					//start_record: 0,
					//page_size: 2147483647	//INT_MAX
				};
			}

			// AJAX 通信
			var defer = new $.Deferred();
			clutil.httpcall(_.extend({
				type: 'POST',
				url: clcom.apiRoot + '/' + params.resId,
				onRspPage: false					// 応答時、ページャ情報の通知をやらないオプション
			}, params)).then(function (data) {
				var uri = null;
				if (data && data.rspHead) {
					uri = data.rspHead.uri;
				}
				if (_.isEmpty(uri)) {
					// ０件でした
					// 共通応答パケットがあれば、メッセージを入れておく。
					data.rspHead.message = 'cl_no_data';
					// reject するので、呼び出し元は defer.fail(function(data){..}) で受け取ってね。
					return defer.reject(data);
				}
				//DLメソッドを呼び出す。
				clutil.download({ url: uri, newWindow: newWindow });
				return defer.resolve(data);
			}).fail(function (data) {
				return defer.reject(data);
			});
			return defer.promise();
		},

		/**
		 * JSONデータ取得関数
		 * @param resId リソースID 的な文字列。呼び出し先の uri の一部になる。
		 * @param appcallback
		 * @returns {promise}
		 */
		getJSON: function (resId, appcallback, complete) {
			return clutil.httpcall({
				type: 'GET',
				url: clcom.apiRoot + '/' + resId,
				success: appcallback,
				complete: complete
			}, res);
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
		postJSON: function (resId, data, success, complete) {
			var o = null;
			if (arguments.length === 1 && _.isObject(arguments[0])) {
				o = arguments[0];
			} else {
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
		 * @param resId リソースID 的な文字列。呼び出し先の uri の一部になる。
		 * @param data
		 * @param appcallback
		 * @returns {promise}
		 */
		putJSON: function (resId, data, appcallback, complete) {
			return clutil.httpcall({
				type: 'PUT',
				data: data,
				url: clcom.apiRoot + '/' + resId,
				success: appcallback,
				complete: complete
			}, resId);
		},
		/**
		 * JSONデータDELETE関数
		 * @param resId リソースID 的な文字列。呼び出し先の uri の一部になる。
		 * @param data
		 * @param appcallback
		 * @returns {promise}
		 */
		deleteJSON: function (resId, data, appcallback, complete) {
			return clutil.httpcall({
				type: 'DELETE',
				data: data,
				url: clcom.apiRoot + '/' + resId,
				success: appcallback,
				complete: complete
			}, resId);
		},

		/**
		 * AOKI
		 * HTMLファイルの読み込み
		 * @param url	// HTMLファイルのURL
		 * @param appcallback
		 */
		loadHtml: function (url, appcallback) {
			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'html',
				success: function (data) {
					appcallback(data);
				},
				error: function () {
					clutil.ErrorDialog('HTMLファイルの読み込みに失敗しました');
				}
			});
		},

		funcgrpname: ['search', 'tree', 'score', 'zone', 'list', 'note', 'permission', 'note', 'upload'],

		/** AOKI
		 * 権限グループに応じて権限名のリストを作成する
		 */
		setFuncGrp: function (funclist) {
			var funcgrp = {
				search: false,
				tree: false,
				score: false,
				zone: false,
				list: false,
				note: false,
				permission: false,
				upload: false
			};
			for (var i = 0; i < funclist.length; i++) {
				var func = funclist[i];
				switch (Number(func.f_funcgrp)) {
					case amdb_defs.MTCONSTTYPE_F_FUNCGRP_STAFFSRCH:
						funcgrp.search = true;
						break;
					case amdb_defs.MTCONSTTYPE_F_FUNCGRP_ORGTREE:
						funcgrp.tree = true;
						break;
					case amdb_defs.MTCONSTTYPE_F_FUNCGRP_ESTIMATE:
						funcgrp.score = true;
						break;
					case amdb_defs.MTCONSTTYPE_F_FUNCGRP_PERFORM:
						funcgrp.zone = true;
						break;
					case amdb_defs.MTCONSTTYPE_F_FUNCGRP_STAFFLIST:
						funcgrp.list = true;
						break;
					case amdb_defs.MTCONSTTYPE_F_FUNCGRP_NOTE:
						funcgrp.note = true;
						break;
					case amdb_defs.MTCONSTTYPE_F_FUNCGRP_AUTH:
						funcgrp.permission = true;
						break;
					case amdb_defs.MTCONSTTYPE_F_FUNCGRP_DATA:
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
		int32Max: 2147483647,

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
		fmt: function (fmt) {
			var i;
			for (i = 1; i < arguments.length; i++) {
				var reg = new RegExp("\\{" + (i - 1) + "\\}", "g");
				fmt = fmt.replace(reg, arguments[i]);
			}
			return fmt;
		},

		fmtargs: function (fmt, args) {
			var i;

			if (!fmt)
				return '';

			if (args instanceof Array) {
				for (i = 0; i < args.length; i++) {
					var reg = new RegExp("\\{" + i + "\\}", "g");
					fmt = fmt.replace(reg, args[i]);
				}
			}
			return fmt;
		},

		_setErrorHeader: function ($echoback, message) {
			if ($echoback != null) {
				clutil._clearErrorHeader($echoback);
				//				$echoback.css('display', 'block').html(message);
				// アニメーションで表示するように修正 11/6
				$echoback.html(message);
				$echoback.fadeIn('300');
				// なにもしなくても一定時間を過ぎるとエラーメッセージが消える
				clutil.errHeaderTimerId = setTimeout("clutil._stopErrorHeaderTimer()", 10000);
				clutil.err$echoback = $echoback;
				//				$echoback.delay(10000).fadeOut(300);
				// スクロール
				$('body').scrollTo($echoback, 800);
			}
		},

		_clearErrorHeader: function ($echoback) {
			if ($echoback) {
				$('.cl_error_echoback', $echoback).remove();
				// なにもしなくても一定時間を過ぎるとエラーメッセージが消えるイベントをストップ
				clearTimeout(clutil.errHeaderTimerId);
				//				$echoback.stop();
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
		 * # 指定form領域に適用する validator インスタンスを生成する。
		 *
		 * 入力検証は、指定form内の全ての.cl_validな要素に対して行われ
		 * る。はクラス属性に特定のクラスを指定するあるいは
		 * data-validator属性に特定の値を設定することで検証の種類を指定
		 * する。
		 *
		 * 指定が矛盾しないかぎり、複数の入力検証を組み合わせることがで
		 * きる。複数の入力検証を指定するには、空白で区切って指定する。
		 * クラス属性で指定する入力検証とdata-validator属性で指定する入
		 * 力検証は組み合わせてもよい。
		 *
		 * ## 例1 小数の入力のみを許可
		 *
		 * ```html
		 * <input type="text" class="cl_valid" data-validator="decimal">
		 * ```
		 *
		 * ## 例2 アルファベットで10文字以内
		 *
		 * 複数の種類の入力検証を行う場合は、空白で区切って指定する。
		 *
		 * ```html
		 * <input type="text" class="cl_valid" data-validator="alpha len:10">
		 * ```
		 *
		 * ### 例3 必須チェック
		 *
		 * ```html
		 * <input type="text" class="cl_valid required">
		 * ```
		 *
		 * ### 例4 必須項目で0以上の整数
		 *
		 * ```html
		 * <input type="text" class="cl_valid required" data-validator="int min:0">
		 * ```
		 *
		 * # 検証の種類
		 *
		 * ## data-validator属性に指定可能な入力検証の一覧
		 *
		 * 以下で特記ない場合は空文字も許可する。
		 *
		 * ### zenkaku
		 *
		 * 全角文字のみであるかチェック
		 *
		 * - 空文字もOK
		 *
		 * ### hankaku
		 *
		 * 半角文字のみであるかチェック
		 *
		 * - 空文字もOK
		 *
		 * ### zenhan:ZENLEN,HANLEN
		 *
		 * 全角文字列長がZENLEN以下でかつ半角文字列長がHANLEN以下であ
		 * るかチェック
		 *
		 * - 空文字もOK
		 *
		 * ### decimal:[IPART],[DPART]
		 *
		 * 入力が小数であるかチェック
		 *
		 * IPARTが指定された場合は、整数部の桁数がIPART以下であるかチェッ
		 * ク
		 *
		 * DPARTが指定された場合は、小数部の桁数がDPART以下であるかチェッ
		 * ク
		 *
		 * - 空文字もOK
		 *
		 * ### int:[LEN]
		 *
		 * 入力が整数であるかチェック。
		 *
		 * LENが指定された場合は、桁数がLEN以下であるかチェック。
		 *
		 * - 先頭に-も認める
		 * - 先頭に+は認めない
		 * - 0001などは認めない
		 * - 桁数に符号部分は数えない
		 * - 空文字もOK
		 *
		 * ### numeric
		 *
		 * 入力が数字文字のみであるかチェック。
		 *
		 * - 空文字もOK
		 *
		 * ### alpha
		 *
		 * 入力が`/^[a-zA-z]*$/`にマッチするかチェック
		 *
		 * ### alnum
		 *
		 * 入力が`(/^[a-zA-Z0-9]*$/`にマッチするかチェック
		 *
		 * - 空文字もOK
		 *
		 * ### len:[MIN],[MAX]
		 *
		 * 入力された文字列数がMIN以上かつMAX以下であるかチェック
		 *
		 * - 空文字もOK
		 *
		 * ### min:MIN
		 *
		 * 入力された数値がMIN以上であるかチェック
		 *
		 * - 空文字もOK
		 *
		 * ### max:MAX
		 *
		 * 入力された数値がMAX以下であるかチェック
		 *
		 * - 空文字もOK
		 *
		 * ## クラス属性で指定可能な入力検証の一覧
		 *
		 * required以外は特記ない場合は空文字も許可する。
		 *
		 * ### required
		 *
		 * 必須チェック。空文字は許可しない。
		 *
		 * ### cm_code
		 *
		 * メンテされていません。使わないでください。
		 *
		 * ### cl_length
		 *
		 * 使わないでください。data-validator="len"を使用してください。
		 *
		 * - 空文字もOK
		 *
		 * ### cl_email
		 *
		 * メールアドレス形式
		 *
		 * - 空文字もOK
		 *
		 * ### cl_url
		 *
		 * URLの検証
		 *
		 * - 空文字もOK
		 *
		 * ### cl_date
		 *
		 * 日付けチェック
		 *
		 * - 空文字もOK
		 *
		 * ### cl_ym
		 *
		 * ?
		 *
		 * ### cl_month
		 *
		 * ?
		 *
		 * ###  cl_time
		 *
		 * ?
		 *
		 * ### cl_regex
		 *
		 * 正規表現で入力の検証を行う。
		 *
		 * 正規表現は data-patternに指定する
		 *
		 *
		 * ### cl_autocomplete
		 *
		 * オートコンプリート部品で入力された値がサーバから取得された
		 * ものであるかチェック
		 *
		 * @method validator
		 * @for clutil
		 * @param {jQuery} form
		 * @param {Object} option
		 * @param {jQuery} options.echoback  $(エコーバック領域を指定),
		 * @param {Boolean} [options.writeErrorMark] 未使用
		 * @param {Boolean} [options.withErrorMessage] 未使用
		 *
		 * @example
		 *
		 * ```js
		 * var validator = clutil.validator($('#myForm'),{echoback:$('#echoback')});
		 * if(validator.valid()){
		 *	  $.post(...,
		 *	   success(){...},
		 *	   error(){validator.setErrorInfo({'要素タグ.id名': メッセージ})}
		 *	  );
		 * }
		 * ```
		 */
		validator: function (form, options) {
			var msgcd2msg = function (msgcd) {
				var fmtargs = _.toArray(arguments);
				var msg;
				fmtargs[0] = clmsg['cl_' + msgcd];
				if (fmtargs[0] == null) {
					// メッセージが整備されていない場合 => メッセージの更新が必要
					console.warn("No message code `" + msgcd + '`');
					fmtargs[0] = "XXXX";
				}
				msg = clutil.fmt.apply(this, fmtargs);			   // 項目名ラベルなし
				return msg;
			},

				setErrorMsg = function ($input, message, level) {
					// bootstrap用に対応 AOKI ACUST
					var cssClasses = 'cl_error_field cl_alert_field';
					var cssClass = (level == 'alert') ? 'cl_alert_field' : 'cl_error_field';
					if ($input.is('select') && _.isObject($input.data('selectpicker'))) {
						var $button = $($input.next('div').find('button'));
						$input
							.removeClass(cssClasses).addClass(cssClass)
							.attr('data-cl-errmsg', message);
						$button
							.removeClass(cssClasses).addClass(cssClass)
							.attr('data-cl-errmsg', message);
					} else if ($input.is('select') && _.isObject($input.data('combobox'))) {
						$input
							.removeClass(cssClasses).addClass(cssClass)
							.next('.combobox-wrap')
							.find('.combobox-input')
							.attr('data-cl-errmsg', message)
							.end();
					} else {
						$input
							.removeClass(cssClasses).addClass(cssClass)
							.attr('data-cl-errmsg', message);
					}

				},

				clearErrorHeader = function ($echoback) {
					clutil._clearErrorHeader($echoback);
				},

				clearErrorMsg = function ($input) {
					var cssClasses = 'cl_error_field cl_alert_field';
					if ($input.is('select')) {
						if (_.isObject($input.data('combobox'))) {
							$input
								.removeClass(cssClasses)
								.next('.combobox-wrap')
								.find('.combobox-input')
								.removeAttr('data-cl-errmsg')
								.end();
						} else if (_.isObject($input.data('selectpicker'))) {
							$input
								.removeClass(cssClasses)
								.removeAttr('data-cl-errmsg')
								.next('div').find('button')
								.removeClass(cssClasses)
								.removeAttr('data-cl-errmsg');
						}
					} else {
						$input.removeClass('cl_error_field cl_alert_field')
							.removeAttr('data-cl-errmsg');
					}
				},

				callValidator = function (s, value) {
					var splitted = s.split(':'),
						funcName = splitted[0],
						args = [];

					if (splitted[1] != null) {
						args = (splitted[1] || '').split(',');
					}

					args.unshift(value);
					var validateFunc = clutil.Validators[funcName];
					if (!validateFunc) {
						console.warn("Invalid validator name=", funcName);
					}
					if (validateFunc)
						return validateFunc.apply(clutil.Validators, args);
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
				setErrorHeader: function (errMsg) {
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
				 * @param {jQuery} [options.$scope] 適用範囲
				 */
				setErrorInfoFromSrv: function (fieldMessages, options) {
					if (!fieldMessages || !fieldMessages.length) {
						return;
					}
					options = options || {};
					var errInfo = {};
					_.each(fieldMessages, function (field) {
						var message = clutil.getclmsg(field.message);
						errInfo[field.field_name] = clutil.fmtargs(message, field.args);
					});
					this.setErrorInfo(errInfo, options);
				},

				/**
				 * サーバーレスポンスの個別項目におけるエラーメッセージ情報(data.head.fieldMessages)を<table>下の<tbody>へ設定する。
				 * @param {Array} fieldMessages レスポンスのhead.fieldMessages
				 * @param {Object} [options] オプション
				 * @param {String} [options.by] 要素の取得方法 "id"|"name"
				 * @param {String} [options.prefix] idに付与するプレフィックス
				 * @param {jQuery} [options.$scope] 適用範囲 -- 本メソッドにおいては table > tbody > tr を適用するので使用不可。
				 * @param {String} options.level メッセージレベル - "error"|"alert" デフォルト"error"
				 */
				setErrorInfoToTable: function (fieldMessages, struct_name, $table, options) {
					var args;
					if (arguments.length == 1 && _.isObject(arguments[0])) {
						args = arguments[0];
					} else {
						args = {
							fieldMessages: arguments[0],
							struct_name: arguments[1],
							$table: arguments[2],
							options: arguments[3]
						};
					}
					if (!_.isArray(args.fieldMessages) || _.isEmpty(args.fieldMessages)) {
						return;
					}
					if (!(args.$table instanceof jQuery)) {
						return;
					}

					var errInfos = function (fldMsgs) {
						var array = [];
						for (var i = 0; i < fldMsgs.length; i++) {
							var fldMsg = fldMsgs[i];
							if (!fldMsg.lineno || fldMsg.lineno <= 0 || _.isEmpty(fldMsg.field_name)) {
								continue;
							}
							var fldIndex = fldMsg.lineno - 1;
							var errInfo = array[fldIndex];
							if (errInfo == null) {
								errInfo = {};
								array[fldIndex] = errInfo;
							}
							var msg = clutil.getclmsg(fldMsg.message);
							errInfo[fldMsg.field_name] = clutil.fmtargs(msg, fldMsg.args);
						}
						return array;
					}(_.where(args.fieldMessages, { struct_name: args.struct_name }));
					var _this = this;

					args.options = args.options || {};
					args.$table.find('tbody > tr').each(function (index, element) {
						var $tr = $(element);
						var errInfo = errInfos[index];
						if (errInfo) {
							args.options.$scope = $tr;
							_this.setErrorInfo(errInfo, args.options);
						}
					});
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
				 * @param {String} options.level メッセージレベル - "error"|"alert" デフォルト"error"
				 * @example
				 * validator.errInfo({ field1.id: 'error-1', field2.id: 'error-2', ...})
				 */
				setErrorInfo: function (errInfo, options) {
					options = _.defaults(options || {}, { prefix: '' });

					var hasError = false,
						ebmsg = clmsg.cl_echoback,
						getElement = function (key) {
							if (options.$scope && options.$scope instanceof jQuery) {
								return options.$scope.find('#' + options.prefix + key);
							} else {
								return $('#' + options.prefix + key);
							}
						};

					if (options.by === 'name') {
						getElement = function (key) {
							if (options.$scope && options.$scope instanceof jQuery) {
								return options.$scope.find('[name="' + options.prefix + key + '"]');
							} else {
								return $('[name="' + options.prefix + key + '"]');
							}
						};
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
						setErrorMsg($input, msg, options.level);
						hasError = true;
					}

					if (hasError) {
						clutil.setFocus($('.cl_error_field,.cl_alert_field', this.form).first());
						//							$('.cl_error_field', this.form).first().focus();
						this.setErrorHeader(ebmsg);
					}
					return hasError;
				},

				/**
				 * エラー情報をクリアする。
				 * @return クラス cl_valid 要素を返す。
				 */
				clear: function ($form) {
					clearErrorHeader(this.echoback);

					if (!$form) {
						$form = $('.cl_valid', this.form);
					}

					// form 領域内のエラー色定義のクラスを取る
					clearErrorMsg($form.filter('.cl_error_field,.cl_alert_field'));

					$('div.tooltip').remove(); // XXXX なぜか消えない不具合対策
					return $form;
				},

				/**
				 * fm で指定された領域に対して、入力チェックを行います。
				 * 実行後、エラーフィールドに対して、クラス属性 cl_error_field が付加されます。
				 * エラーフィールドの後にはエラー個数の '*' がマーキングされます。
				 * '*'マーキングはクラス属性 cl_error_mark で検出できます。
				 * エラーメッセージは clmsg オブジェクトで定義されます。
				 * @returns {Boolean} true:OK, false:入力不備を検出。
				 */
				valid: function (options) {
					options = options || {};
					_.defaults(options, { $el: null, filter: function () { return true; } });
					var hasError = false,
						ebmsgs = [],		  // エコーバック表示用メッセージ
						setError = function (input, msgcd) {
							// この this は、$.each() 中の this っぽい？？？
							setErrorMsg($(input), msgcd2msg.apply(this, Array.prototype.slice.call(arguments, 1)));
							hasError = true;
						};
					//alreadyErrored = (options.$el instanceof jQuery) ? options.$el.hasClass('cl_error_field') : false;

					// 手抜き日本語のみ対応
					var dateToYmd = function (date) {
						try {
							return date.toLocaleString().split(' ')[0];
						} catch (e) {
							return date.toLocaleString();
						}
					};
					// エラー情報クリア - '.cl_valid' クラス一覧が返る。
					// '.cl_valid' クラスの入力を確認して、エラー情報を埋め込む
					//									  $('.cl_valid', this.form)
					this.clear(options.$el)
						//.removeClass('cl_error_field')
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
						.each(function () {
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
						.each(function () {
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
								validator = $el.attr('data-validator');

							var error = clutil.Validators.checkAll({
								validator: validator,
								value: value,
								$el: $el
							});

							if (error) {
								setErrorMsg($el, error);
								hasError = true;
							}
						})
						.end()
						// cl_email: メールアドレス形式 /////////////
						.filter('.cl_email')
						.each(function () {
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
						.each(function () {
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
						.each(function () {
							var maxDate = $(this).datepicker("option", "maxDate");
							var minDate = $(this).datepicker("option", "minDate");
							var error = clutil.Validators.date(this.value, minDate, maxDate);
							if (error) {
								setErrorMsg($(this), error);
								hasError = true;
							}
						})
						.end()
						// cl_date: YYYY/mm 形式のチェック
						.filter('.cl_ym')
						.each(function () {
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
						.each(function () {
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

						.filter('.cl_time') // 時刻指定
						.each(function () {
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
						.each(function () {
							var pat = $(this).data('pattern');
							var reg = new RegExp(pat);
							if (!reg.test($(this).val())) {
								// {0}の形式が誤っています。
								setError(this, 'regex');
							}
						})
						.end()
						// 社員コード
						.filter(".cl_codeinput")
						.each(function () {
							var $el = $(this);
							if ($el.is(".cl_codeinput") &&
								$el.val() &&
								!parseInt($el.attr("cs_id"), 10)) {
								setError(this, 'staffcode_mismatch');
							}
						})
						.end()

						// cl_autocomplete オートコンプリート /////
						.filter('.cl_autocomplete')
						.each(function () {
							if (!$(this).autocomplete('isValidClAutocompleteSelect')) {
								setError(this, 'autocomplete_mismatch');
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
								//								return true;
							}
							// すべてチェックするように修正 2013/07/11
							//							return false;
						})
						.value();

					if (hasError) {
						if (options.$el) {
							// 部品個別チェック: 正常→エラーに変わったときだけ留まる
							// => 留まらないように変更 2014/10/24
							// if(alreadyErrored == false){
							// 	clutil.setFocus(options.$el.filter('.cl_error_field').first());
							// }
						} else {
							clutil.setFocus($('.cl_error_field', this.form).first());
							if (this.echoback != null) {
								this.setErrorHeader(clmsg.cl_echoback);
							}
						}
					}
					return !hasError;
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
				validFromTo: function (chkInfo) {
					if (chkInfo == null || chkInfo.length === 0) {
						return true;
					}

					var errInfo = {};
					var errFlag = false;

					for (var i = 0; i < chkInfo.length; i++) {
						var stval = chkInfo[i].stval;
						var edval = chkInfo[i].edval;
						var $stval = $('#' + stval)[0];
						var $edval = $('#' + edval)[0];
						var orequalto = chkInfo[i].orequalto == null ? false : chkInfo[i].orequalto;
						var nullIsZero = chkInfo[i].nullIsZero == null ? false : chkInfo[i].nullIsZero;

						var stvalue = $stval.value;
						var edvalue = $edval.value;

						if (nullIsZero) {
							stvalue = stvalue == '0' ? '' : stvalue;
							edvalue = edvalue == '0' ? '' : edvalue;
						}

						// ヌルチェック
						if (stvalue == null || stvalue === '' ||
							edvalue == null || edvalue === '') {
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
								if (Number($stval.value) >= Number($edval.value)) {
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
								if (Number($stval.value) > Number($edval.value)) {
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
				validFromToObj: function (chkInfo) {
					if (chkInfo == null || chkInfo.length === 0) {
						return true;
					}

					var errInfo = {};
					var errFlag = false;

					for (var i = 0; i < chkInfo.length; i++) {
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
								// 数値大小チェック
								if (Number($stval.val()) >= Number($edval.val())) {
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
								// 数値大小チェック
								if (Number($stval.val()) > Number($edval.val())) {
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
			defaultValidator.echoback.click(function () {
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
		imgViewUtil: function (imgElem, errImg) {
			var util = {
				imgEl: imgElem,
				errImg: errImg,
				data: null,	// 任意データを一時的に預ける領域

				initialize: function () {
					var me = this;
					this.imgEl.error(function (e) {
						me.setImage(me.errImg);
					});

					this.imgEl.load(function () {
						me.onImgLoaded();
					});
					return this;
				},

				/**
				 * 再読み込みする
				 */
				reload: function () {
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
				setImage: function (srcURI) {
					return this.imgEl.attr('src', srcURI);
				},
				/**
				 * 表示中の画像URIを取得する
				 */
				getImage: function () {
					return this.imgEl.attr('src');
				},
				/**
				 * 画像を削除する
				 */
				removeImage: function () {
					return this.imgEl.removeAttr('src');
				},
				/**
				 * 画像読み込み通知
				 */
				onImgLoaded: function () {
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
		getActualDimension: function (image) {
			var mem, w, h, key = "actual";

			// for Firefox, Safari, Google Chrome
			if ("naturalWidth" in image) {
				return { width: image.naturalWidth, height: image.naturalHeight };
			}
			if ("src" in image) { // HTMLImageElement
				if (image[key] && image[key].src === image.src) { return image[key]; }

				if (document.uniqueID) { // for IE
					w = $(image).css("width");
					h = $(image).css("height");
				} else { // for Opera and Other
					mem = { w: image.width, h: image.height }; // keep current style
					$(this).removeAttr("width").removeAttr("height").css({ width: "", height: "" });    // Remove attributes in case img-element has set width  and height (for webkit browsers)
					w = image.width;
					h = image.height;
					image.width = mem.w; // restore
					image.height = mem.h;
				}
				return image[key] = { width: w, height: h, src: image.src }; // bond
			}

			// HTMLCanvasElement
			return { width: image.width, height: image.height };
		},

		/**
		 * 日付形式の判定をする
		 */
		checkDate: function (value, minDate, maxDate) {
			var o;
			if (arguments.length === 1 && _.isObject(arguments[0])) {
				o = arguments[0];
			} else {
				o = {
					value: arguments[0],
					minDate: arguments[1],
					maxDate: arguments[2],
					limitCheck: true
				};
			}

			if (_.isEmpty(o.value)) {
				// 空欄はOKとする。必須とするなら、cl_required と併用すること
				return true;
			}

			var date, srcymd;
			if (~o.value.indexOf('/')) {
				// slashが含まれている場合
				date = new Date(o.value);
				srcymd = o.value.split('/');
			} else {
				// /なしの場合
				date = clutil.ymd2date(o.value);
				srcymd = [o.value.substring(0, 4), o.value.substring(4, 6), o.value.substring(6)];
			}

			if (!_.isDate(date) || isNaN(date.getTime())) {
				return false;
			}

			var chkymd = [date.getFullYear(), date.getMonth() + 1, date.getDate()];	// [Year, Month, Day].length => 3
			if (srcymd.length != chkymd.length) {
				return false;
			} else {
				for (var i = 0; i < chkymd.length; i++) {
					if (_.isEmpty(srcymd[i])) {
						return false;
					}
					if (parseInt(srcymd[i], 10) !== chkymd[i]) {
						return false;
					}
				}
			}

			if (o.limitCheck) {
				var fixMinDate = new Date(o.minDate || clutil.ymd2date(clcom.min_date));
				var fixMaxDate = new Date(o.maxDate || clutil.ymd2date(clcom.max_date));
				if (date.getTime() > fixMaxDate.getTime() || date.getTime() < fixMinDate.getTime()) {
					return false;
				}
			}

			return true;
		},

		/**
		 * yyyymmdd形式の日付けから対応yyyyww形式の週を取得する。
		 * clutil.clyearweekcodeの初期値の取得のための利用を想定。
		 *
		 * ### doneコールバックの引数は以下の形式
		 * - data
		 * - data.id ID=yyyyww
		 * - data.yyyyww 年週
		 * - data.start_date 開始日
		 * - data.end_date 終了日
		 * - data.name 表示名
		 *
		 * @method ymd2week
		 * @param {ymd} ymd yyyymmdd形式の日付け もしくは yyyyww形式の週(このときはreverse=trueに設定する)
		 * @param {integer} [deffer=0] 取得する週のプラスマイナスを設定する
		 * (-1=前週、2=次々週など)。
		 * @param {boolean} [reverse=false] 第１引数にyyyymmdd形式の日付でなくyyyyww形式の週を渡す場合にtrueに設定する
		 * @return {promise}
		 * @example
		 * clcom.getOpeDate()から年週を求めて、clyearweekcodeの初期値に設定する例
		 * ```js
		 * var MainView = Backbone.View.extend({
		 *   ...
		 *   initUIElement: function(){
		 *     this.yearweekCode = clutil.clyearweekcode({
		 *       initValue: MainView.yyyywwData
		 *     });
		 *   },
		 *   ...
		 * });
		 *
		 * clutil.getIniJSON()
		 *   .then(function(){
		 *     // 年週部品の初期値を運用日から取得する
		 *     return clutil.ymd2week(clcom.getOpeDate())
		 *       .done(function(data){
		 *         // MainViewに年週部品の初期値を設定する
		 *         MainView.yyyywwData = data;
		 *       });
		 *   })
		 *   .done(function(){
		 *     MainView.mainView = new MainView()
		 *       .initUIElement()
		 *       .render();
		 *   })
		 *   .fail(function(data){
		 *     clutil.View.doAbort({
		 *       messages: [
		 *       '初期データ取得に失敗しました。'
		 *       ],
		 *       rspHead: data.rspHead
		 *     });
		 *   });
		 * ```
		 */
		ymd2week: function (ymd, differ, reverse) {
			var deferred = $.Deferred();
			differ || (differ = 0);
			clutil.postJSON('am_pa_yearweek_srch', {
				cond: {
					yyyymmdd: reverse ? 0 : ymd,
					yyyyww: reverse ? ymd : 0,
					differ: differ
				}
			}).done(function (data) {
				if (!data.rspHead.status && data.list[0]) {
					var item = data.list[0];
					// オートコンプリート部品はid属性が必須なので設定する
					item.id = item.yyyyww;
					deferred.resolve(item);
				} else {
					deferred.reject();
				}
			}).fail(function () {
				deferred.reject();
			});
			return deferred.promise();
		},

		/**
		 * yyyymmdd形式からDateオブジェクトへ変換
		 */
		ymd2date: function (ymd) {
			// 元から Date オブジェクトの場合
			if (_.isDate(ymd)) {
				return ymd;
			}

			var _iymd2Date = function (iymd) {
				var year = Math.floor(iymd / 10000);
				var month = (Math.floor(iymd / 100) % 100);
				var day = iymd % 100;
				// new Date(year, month-1, day) では、20149912 のようなありえない年月日指定は
				// 繰り上げてくれるので、Invalid Date 判定してくれない。
				// よって、文字列「yyyy/MM/dd」形式で new Date(ymdstr) を呼び出すことにした。
				return new Date(year + '/' + month + '/' + day);
			};

			// 数値の場合
			if (_.isNumber(ymd)) {
				return _iymd2Date(ymd);
			}

			// 文字列の場合
			if (_.isString(ymd)) {
				// 数文字8桁からなる文字列
				if (/^[0-9]{8}$/.test(ymd)) {
					var iymd = parseInt(ymd, 10);
					return _iymd2Date(iymd);
				}
				// yyyy/mm/dd な文字列
				if (/^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}$/.test(ymd)) {
					return new Date(ymd);
				}
			}

			// その他 Invalid Date を返しておく？
			return new Date('Invalid Date');
		},

		/**
		 * ymdにn日加算する。
		 * @param ymd yyyymmdd形式の日付
		 * @param days 加算する日数
		 * @return yyyymmdd形式の計算結果
		 */
		addDate: function (ymd, days) {
			var ymdDate = clutil.ymd2date(ymd);
			ymdDate.setDate(ymdDate.getDate() + days);

			var year = ymdDate.getFullYear();
			var month = ymdDate.getMonth() + 1;
			var day = ymdDate.getDate();
			return Number(clutil.fmt('{0}{1}{2}',
				year,
				_.last("0" + month, 2).join(''),
				_.last("0" + day, 2).join('')));
		},

		/**
		 * ymd1とymd2の日付けの差(何日間あるか)を求める
		 *
		 * @method diffDate
		 * @static
		 * @param {ymd} ymd1
		 * @param {ymd] ymd2
		 * @return {number}
		 */
		diffDate: function (ymd1, ymd2) {
			var d1 = clutil.ymd2date(ymd1),
				d2 = clutil.ymd2date(ymd2),
				diff = d1 - d2,
				diffDay = diff / 86400000;//1日は86400000ミリ秒
			return diffDay;
		},

		/**
		 * 指定した日付形式に変換する
		 * AOKI
		 * @param {string}
		 *					・int型8桁	または
		 *					・yyyy/mm/dd 	// 2014/3/13 yyyy/mm/dd(w)も変換(正確に判定していないが。)
		 * @param {string} format yyyy-mm-dd, yyyy/mm/dd, yyyy/mm/dd hh:ss, yyyymmdd
		 * @returns 文字列
		 */
		dateFormat: function (obj, format) {
			/*
			 * 曜日
			 */
			var wdays = [
				"日",
				"月",
				"火",
				"水",
				"木",
				"金",
				"土"
			];

			if (typeof obj === 'string' && !~obj.indexOf('/')) {
				obj = parseInt(obj, 10);
			}

			if (!obj) {
				return "";
			} else if (typeof obj == "number") {
				// サーバーからは8桁の数値で来る事を想定
				var n_year = Math.floor(obj / 10000);
				var n_month = Math.floor((obj % 10000) / 100);
				var n_day = Math.floor(obj % 100);

				obj = clutil.fmt('{0}/{1}/{2}', n_year, n_month, n_day);
			}
			var twodigit = function (obj) {
				if (obj < 10) {
					obj = '0' + obj;
				}
				return obj;
			};

			if (typeof obj === 'string') { // 2014313 TODO:(w)形式の回避
				obj = obj.replace("（", "(");
				obj = obj.replace("）", ")");
			}

			var dateObj = new Date(obj);
			if (!dateObj.valueOf()) {
				var sqlDateStr = obj.replace(/:| |T/g, "-");
				var YMDhms = sqlDateStr.split("-");
				dateObj.setFullYear(parseInt(YMDhms[0], 10), parseInt(YMDhms[1], 10) - 1, parseInt(YMDhms[2], 10));
				dateObj.setHours(parseInt(YMDhms[3], 10), parseInt(YMDhms[4], 10), parseInt(YMDhms[5], 10), 0/*msValue*/);
			}
			var year = dateObj.getFullYear();
			var month = twodigit(dateObj.getMonth() + 1);
			var day = twodigit(dateObj.getDate());
			var hours = twodigit(dateObj.getHours());
			var minutes = twodigit(dateObj.getMinutes());
			var ymddate = new Date(year, month - 1, day);
			var dd = ymddate.getDay();
			var wday = wdays[dd];

			switch (format) {
				case 'yyyymmdd':		  // サーバーに送る型
					return Number(clutil.fmt('{0}{1}{2}', year, month, day));
				case 'yyyy-mm-dd':	  // サーバーに送る型OLD
					return clutil.fmt('{0}-{1}-{2}', year, month, day);
				case 'yyyy/mm/dd':
					return clutil.fmt('{0}/{1}/{2}', year, month, day);
				case 'yyyy/mm/dd(w)':	// 曜日付き表示用
					return clutil.fmt('{0}/{1}/{2}（{3}）', year, month, day, wday);
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
		 * 指定した日付を月形式に変換する
		 * AOKI
		 * @param {string}
		 *					・int型6桁、8桁	または
		 *					・yyyy/mm
		 * @param {string} format yyyy/mm, yyyymm
		 * @returns {String}
		 */
		monthFormat: function (obj, format) {
			var year;
			var month;
			if (obj == null || obj === "") {
				return "";
			}
			var twodigit = function (obj) {
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
				year = Math.floor(date / 10);
				month = twodigit(Math.floor(date % 10));
			} else if (date > 9999999) {
				// 8桁の場合も対応
				year = Math.floor(date / 10000);
				month = twodigit(Math.floor((date % 10000) / 100));
			} else {
				year = Math.floor(date / 100);
				month = twodigit(Math.floor(date % 100));
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
		timeFormat: function (obj, format) {
			var hour;
			var minute;
			if (obj == null || obj === "") {
				return "";
			}
			var twodigit = function (obj) {
				if (obj < 10) {
					obj = '0' + obj;
				}
				return obj;
			};

			var time = obj;

			if (typeof obj === 'string') {
				time = obj.replace(":", "");
			}

			hour = Math.floor(time / 100);
			minute = twodigit(Math.floor(time % 100));

			switch (format) {
				case 'hhmm':		  // サーバーに送る型
					return Number(clutil.fmt('{0}{1}', hour, minute));
				case 'hh:mm':
				default:
					return clutil.fmt('{0}:{1}', hour, minute);
			}
		},

		/**
		 * 指定した時刻（時分秒）を時刻形式に変換する
		 * @param obj int型6桁 または hh:mm:ss
		 * @param format hh:mm:ss, hhmmss
		 * @return {String}
		 */
		hmsFormat: function (obj, format) {
			var hour, minute, second;
			if (obj == null || obj === "") {
				return "";
			}
			var twodigit = function (obj) {
				if (obj < 10) {
					obj = '0' + obj;
				}
				return obj;
			};
			var hms = obj;
			if (typeof obj === 'string') {
				hms = obj.replace(":", "");
			}
			hour = Math.floor(time / 10000);
			minute = twodigit(Math.floor((time / 100) % 100));
			second = twodigit(Math.floor(time % 100));

			switch (format) {
				case 'hhmmss':		// サーバーに送る型
				case 'hh:mm:ss':
					return Number(clutil.fmt('{0}{1}{2}', hour, minute, second));
				default:
					return clutil.fmt('{0}:{1}:{2}', hour, minute, second);
			}
		},

		/**
		 * 内税金額から税はがしを行う
		 *
		 * # 注意
		 * - 端数計算はAOKI仕様で行う
		 * - XXXX このようにはなっていません `=>` 各valueの単位系は、valueに合わせる (0.01円単位とか1円単位とか)
		 * @method parseTax
		 * @param {number} value 税込金額
		 * @param {integer} [taxRate] 税率パーセンテージ
		 * @return {object}
		 * 戻り値の形式
		 * ```
		 * {
		 *   // 税抜金額
		 *   withoutTax: 100,
		 *   // 税額
		 *   tax: 8
		 * }
		 * ```
		 * @example
		 * ```js
		 * clutil.parseTax(108); // => {withoutTax: 100, tax: 8}
		 * clutil.parseTax(105, 5); // => {withoutTax: 100, tax: 5}
		 * ```
		 */
		parseTax: function (value, taxRate) {
			taxRate || (taxRate = clcom.cmDefaults.defaultTax);
			var tmp1 = value * taxRate / (taxRate + 100);
			// 切り上げ版 -> 税額を切り捨て
			tmp1 = Math.floor(tmp1);
			return {
				withoutTax: value - tmp1,
				tax: tmp1
			};
		},

		/**
		 * 外税金額に税付与を行う
		 *
		 * # 注意
		 * - 端数計算はAOKI仕様で行う
		 * - XXXX このようになっていません `=>` 各valueの単位系は、valueに合わせる (0.01円単位とか1円単位とか)
		 * @method margeTax
		 * @param {number} value 税抜金額
		 * @param {integer} [taxRate] 税率パーセンテージ
		 * @return {object}
		 * 戻り値の形式
		 * ```
		 * {
		 *   // 税込金額
		 *   withTax: 108,
		 *   // 税額
		 *   tax: 8
		 * }
		 * ```
		 */
		mergeTax: function (value, taxRate) {
			taxRate || (tax = clcom.cmDefaults.defaultTax);
			var tax = value * taxRate / 100;
			// 切り捨て
			tax = Math.floor(tax);
			return {
				withTax: value + tax,
				tax: tax
			};
		},

		/**
		 * チェックディジットを取得する。モジュラス10ウェイト3に対応
		 * @param code チェックディジットを計算するコード
		 * @param len チェックディジット算出の対象となるコード長
		 * @returns -1:エラー >=0:チェックディジット
		 */
		getCheckDigitM10W13: function (code, len) {
			var wt = 3, mod = 10;
			var wsum = 0, ssum = 0, sum;
			var n;
			var cd = 0;

			if (code == null || code == "") {
				return -1;
			}
			var codes = code.split('');

			// 重みがない桁の合計
			for (var i = len - 2; i >= 0; i -= 2) {
				if (!$.isNumeric(codes[i])) {
					// 数字以外が含まれている
					return -1;
				}
				n = Number(codes[i]);
				ssum += n;
			}

			// 重みがある桁の合計
			for (var i = len - 1; i >= 0; i -= 2) {
				if (!$.isNumeric(codes[i])) {
					// 数字以外が含まれている
					return -1;
				}
				n = Number(codes[i]);
				wsum += n;
			}
			sum = wsum * wt + ssum;
			sum = sum % mod;
			sum = mod - sum;
			cd = sum % 10;

			return cd;
		},

		/**
		 * AOKI
		 * 年月を表示用に変換
		 * 引数
		 * ・yymm			: 年月の4桁
		 */
		iymFmt: function (yymm) {
			if (yymm == null) {
				return "";
			}
			var yy = parseInt(yymm / 100);
			var mm = yymm % 100;
			var yystr = yy != 0 ? yy + '年' : '';
			var mmstr;
			if (yy == 0) {
				// 0年の場合は無条件に表示
				mmstr = mm + 'ヶ月';
			} else {
				mmstr = mm != 0 ? mm + 'ヶ月' : '';
			}
			return yystr + mmstr;
		},

		/**
		 * 文字列取得
		 */
		cStr: function (str) {
			if (str == null || str.length === 0) {
				return "";
			} else {
				return str;
			}
		},

		/**
		 * 文字列判定
		 */
		chkStr: function (str) {
			if (str == null || str.length === 0) {
				return false;
			} else {
				return true;
			}
		},

		/**
		 * 数値取得
		 */
		cInt: function (intValue) {
			if (typeof intValue != "number" || isNaN(intValue)) {
				return 0;
			} else {
				return intValue;
			}
		},

		/*
		 * view2data および data2view のデフォルトプレフィックスマッチング用正規表現
		 */
		_v2dPrefixRegEx: /^ca_/,

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
		view2data: function ($view, prefix, resultdata) {
			resultdata = resultdata == null ? {} : resultdata;
			//var _prefix = prefix ? prefix : 'ca_';
			var _prefix = _.isRegExp(prefix) ? prefix : !_.isEmpty(prefix) ? new RegExp('^' + prefix.toString()) : clutil._v2dPrefixRegEx;
			var _id = '';
			$view
				.find("input[id]")
				.filter('[type="text"]').each(function () {
					var $this = $(this);
					//console.log(this);
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					if ($this.hasClass('cl_date')) {
						// datepickerの場合は日付をサーバーに送る型に変換する
						resultdata[_id] = clutil.dateFormat(this.value, 'yyyymmdd');
					} else if ($this.hasClass('cl_month')) {
						// 月選択の場合は月をサーバーに送る型に変換する
						resultdata[_id] = clutil.monthFormat(this.value, 'yyyymm');
					} else if ($this.hasClass('cl_time')) {
						// 時刻選択の場合は時刻をサーバーに送る型に変換する
						resultdata[_id] = clutil.timeFormat(this.value, 'hhmm');
					} else if ($this.hasClass('cl_autocomplete')) {
						var data = $this.autocomplete('clAutocompleteItem');
						if (data) {
							var cn = _.pick(data, 'id', 'code', 'name');
							resultdata['_view2data_' + _id + '_cn'] = cn;
							resultdata[_id] = cn.id;
						}
					} else if ($this.hasClass('cl_codeinput')) {
						var data = $(this).data('cl_codeinput_item');
						if (data) {
							var cn = _.pick(data, 'id', 'code', 'name');
							resultdata['_view2data_' + _id + '_cn'] = cn;
							resultdata[_id] = cn.id;
						}
					} else if ($this.hasClass('cl_store')) {
						// TODO: 店舗のコード入力 -- ただの input[type="text"] -- いずれオートコンプリートになり代わる予定でココは暫定対処
						var data = $this.data('cl_store_item');
						if (data) {
							var cn = _.pick(data, 'id', 'code', 'name');
							resultdata['_view2data_' + _id + '_cn'] = cn;
							resultdata[_id] = cn.id;
						} else {
							resultdata[_id] = $this.attr('cs_id');	// 互換
						}
					} else {
						resultdata[_id] = $.inputlimiter.unmask($this.val(), {
							limit: $this.attr('data-limit'),
							filter: $this.attr('data-filter')
						});
					}
				})
				.end()
				.filter('[type="hidden"]').each(function () {
					//console.log(this);
					// hiddenのものに対しても処理を行う(idなど)
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					resultdata[_id] = this.value;
				})
				.end()
				.filter('[type="password"]').each(function () {
					//console.log(this);
					// パスワード
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					resultdata[_id] = this.value;
				})
				.end()
				.filter('[type="checkbox"]').each(function () {
					//console.log(this);
					// チェックボックス
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					resultdata[_id] = this.checked ? 1 : 0;
				})
				.end()
				.end()
				.find("input[name]")
				.filter('[type="radio"]').each(function () {
					//console.log(this);
					// ラジオボタン
					// nameで取得する
					if (this.checked) {
						// プレフィックスを除去する
						_id = (this.name).replace(_prefix, "");
						// チェックされていたらデータ化する
						resultdata[_id] = this.value;
					}
				})
				.end()
				.end()
				.find("textarea[id]").each(function () {
					//console.log(this);
					// テキストエリア
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					resultdata[_id] = this.value;
				})
				.end()
				.find("select[id]").each(function () {
					//console.log(this);
					// コンボボックス(マルチセレクト未サポート)
					// valueの値が取得される
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					try {
						// selectpickerを使用している場合はselectpicker("val")を使う
						resultdata[_id] = $(this).selectpicker("val");
					} catch (e) {
						resultdata[_id] = this.value;
					}
				})
				.end()
				.find("span[id]").each(function () {
					var $this = $(this);
					//console.log(this);
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					if ($this.hasClass('cl_date')) {
						// datepickerの場合は日付をサーバーに送る型に変換する
						resultdata[_id] = clutil.dateFormat($this.text(), 'yyyymmdd');
					} else {
						resultdata[_id] = $.inputlimiter.unmask($this.text(), {
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
		 * ・skipundefined	: resultdata[any_id] が undefined の場合、=={0,null,undefined}: 空値をセットする、other:適用しない
		 * 戻り値
		 * ・なし
		 */
		data2view: function ($view, resultdata, prefix, skipundefined) {
			//var _prefix = prefix ? prefix : 'ca_';
			var _prefix = _.isRegExp(prefix) ? prefix : !_.isEmpty(prefix) ? new RegExp('^' + prefix.toString()) : clutil._v2dPrefixRegEx;
			var _id = '';

			function mask($el, value) {
				return $.inputlimiter.mask(value, {
					limit: $el.attr('data-limit'),
					filter: $el.attr('data-filter')
				});
			}
			function collectCodeName(cn1, cn2) {
				for (var i = 0; i < arguments.length; i++) {
					var xcn = arguments[i];
					if (_.isObject(xcn) && _.has(xcn, 'id') && _.has(xcn, 'code') && _.has(xcn, 'name')) {
						return xcn;
					}
				}
				return null;
			}
			function fieldrelation_set($el, value) {
				if (clutil.FieldRelation && $el.is('[data-field-cid]')) {
					clutil.FieldRelation.$set($el, value, { changedBy: 'data2view' });
					return true;
				}
			}
			function fieldrelation_complete() {
				if (clutil.FieldRelation) {
					return clutil.FieldRelation.resetAll({
						changeReadonlyState: false,
						data2view: true
					});
				}
			}

			// {foo: 1, _view2data_foo_cn:{id:1,code:'01',name:'001'}} => {foo:{id:1,code:'01',name:'001'}}
			function normailze_data(data) {
				return _.reduce(data, function (newdata, value, key) {
					if (!/^_view2data_/.test(key)) {
						var altkey = '_view2data_' + key + '_cn';
						var newvalue = collectCodeName(value, data['_view2data_' + key + '_cn']);
						newdata[key] = newvalue || value;
					}
					return newdata;
				}, {});
			}

			// 最初に_view2data_XX_cnなキーをXXに統一する。FieldRelationの
			// ためだが以下のコードで部品毎に
			// collectCodeName(resultdata[_id], resultdata[_view2data_XX_cn])
			// を行うのでなくresultdata[_id]を使えば良いのではないか。
			var orgData = resultdata;
			resultdata = normailze_data(orgData);

			$view
				.find("input[id]")
				.filter('[type="text"]').each(function () {
					//console.log(this);
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					if (skipundefined && !_.has(resultdata, _id)) return;	// 適用しない

					//		  _code = _id.replace("ID", "Code");
					//		  _name = _id.replace("ID", "Name");
					//		  _data = _id.replace("ID", "Data");

					var $this = $(this);

					// FieldRelationで管理される入力の場合
					if (fieldrelation_set($this, resultdata[_id])) {
						return;
					}
					if ($this.hasClass('cl_date')) {
						// datepickerの場合は日付を表示用に変換する
						if ($this.hasClass('hasDatepicker')) {
							$this.datepicker('setIymd', resultdata[_id]);
						} else {
							this.value = clutil.dateFormat(resultdata[_id], 'yyyy/mm/dd');
						}
					} else if ($this.hasClass('cl_month')) {
						// 月指定の場合は日付を表示用に変換する
						this.value = clutil.monthFormat(resultdata[_id], 'yyyy/mm');
					} else if ($this.hasClass('cl_time')) {
						// 時刻指定の場合は時刻を表示用に変換する
						this.value = clutil.timeFormat(resultdata[_id], 'hh:mm');
					} else if ($this.hasClass('cl_autocomplete')) {
						var cn = collectCodeName(resultdata[_id], resultdata['_view2data_' + _id + '_cn']);
						$this.autocomplete('clAutocompleteItem', cn);	// cn に null を入れるとクリアとして振る舞う
					} else if ($this.hasClass('cl_codeinput')) {
						var cn = collectCodeName(resultdata[_id], resultdata['_view2data_' + _id + '_cn']);
						var codeOnly = $this.hasClass('cl_codeonly');

						// TODO: clcodeinput を jQプラグインにするとかして、以下 setter 相当を隠蔽したい
						if (true) {
							var label = function (cn) {
								var strs = [];
								if (cn && cn.code) {
									strs.push(cn.code);
								}
								if (!codeOnly) {
									if (cn && cn.name) {
										strs.push(cn.name);
									}
								}
								return strs.join(':');
							}(cn);
							if (label.length > 0 && cn && cn.id > 0) {
								//var fixCN = _.extend({value: label}, cn);	// value に label 文字列 -- 互換のためだけど、autocomplete なやり方と統一しておきたいところ。
								$this.data('cl_codeinput_item', cn).val(label).attr('cs_id', cn.id);
							} else {
								$this.removeData('cl_codeinput_item').val('').removeAttr('cs_id');
							}
						}
					} else if ($this.hasClass('cl_store')) {
						var rspCN = null;
						if (_.isNumber(resultdata[_id])) {
							var _code = _id.replace("ID", "Code");
							var _name = _id.replace("ID", "Name");
							//rspCN = _.pick(resultdata, _id, _code, _name);
							rspCN = {
								id: resultdata[_id],
								code: resultdata[_code],
								name: resultdata[_name]
							};
						} else {
							rspCN = resultdata[_id];
						}
						var cn = collectCodeName(rspCN, resultdata['_view2data_' + _id + '_cn']);
						// TODO: 店舗のコード入力 -- ただの input[type="text"] -- いずれ、オートコンプリートになり代わる予定で、これは暫定対処
						if (true) {
							var label = function (cn) {
								var strs = [];
								if (cn && cn.code) {
									strs.push(cn.code);
								}
								if (cn && cn.name) {
									strs.push(cn.name);
								}
								return strs.join(':');
							}(cn);
							if (label.length > 0 && cn && cn.id > 0) {
								$this.data('cl_store_item', cn).val(label).attr('cs_id', cn.id);
							} else {
								$this.removeData('cl_codeinput_item').val('').removeAttr('cs_id');
							}
						}
					} else {
						this.value = clutil.cStr(mask($this, resultdata[_id]));
					}
				})
				.end()
				.filter('[type="hidden"]').each(function () {
					//console.log(this);
					// hidden
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					if (skipundefined && !_.has(resultdata, _id)) return;	// 適用しない
					// FieldRelationで管理される入力の場合
					if (fieldrelation_set($(this), resultdata[_id])) {
						return;
					}
					this.value = clutil.cStr(resultdata[_id]);
				})
				.end()
				.filter('[type="password"]').each(function () {
					//console.log(this);
					// パスワード
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					if (skipundefined && !_.has(resultdata, _id)) return;	// 適用しない
					// FieldRelationで管理される入力の場合
					if (fieldrelation_set($(this), resultdata[_id])) {
						return;
					}
					this.value = clutil.cStr(resultdata[_id]);
				})
				.end()
				.filter('[type="checkbox"]').each(function () {
					var $this = $(this);
					//console.log(this);
					// チェックボックス
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					if (skipundefined && !_.has(resultdata, _id)) return;	// 適用しない
					// FieldRelationで管理される入力の場合
					if (fieldrelation_set($(this), resultdata[_id])) {
						return;
					}
					if (resultdata[_id]) {
						// チェックをつける
						$this.attr("checked", true).closest("label").addClass("checked");
					} else {
						// チェックを外す
						$this.attr("checked", false).closest("label").removeClass("checked");
					}

				})
				.end()
				.end()
				.find("input[name]")
				.filter('[type="radio"]').each(function () {
					var $this = $(this);
					//console.log(this);
					// ラジオボタン
					// プレフィックスを除去する
					_id = (this.name).replace(_prefix, "");
					if (skipundefined && !_.has(resultdata, _id)) return;	// 適用しない
					// FieldRelationで管理される入力の場合
					if (fieldrelation_set($(this), resultdata[_id])) {
						return;
					}
					if (resultdata[_id] == $(this).val()) {
						// 同じ値であるものにチェックをつける
						$this.attr("checked", "checked");
						try {
							$this.radio('check');
						} catch (e) { }
					} else {
						$this.removeAttr("checked");
					}
				})
				.end()
				.end()
				.find("textarea[id]").each(function () {
					//console.log(this);
					// テキストエリア
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					if (skipundefined && !_.has(resultdata, _id)) return;	// 適用しない
					// FieldRelationで管理される入力の場合
					if (fieldrelation_set($(this), resultdata[_id])) {
						return;
					}
					this.value = clutil.cStr(resultdata[_id]);
				})
				.end()
				.find("select[id]").each(function () {
					//console.log(this);
					// コンボボックス(マルチセレクト未サポート)
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					if (skipundefined && !_.has(resultdata, _id)) return;	// 適用しない
					// FieldRelationで管理される入力の場合
					if (fieldrelation_set($(this), resultdata[_id])) {
						return;
					}
					this.value = clutil.cStr(resultdata[_id]);
					$(this).selectpicker('val', clutil.cStr(resultdata[_id]));
					//$(this).val(clutil.cStr(resultdata[_id]));
				})
				.end()
				.find("span[id]").each(function () {
					var $this = $(this);
					//console.log(this);
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					if (skipundefined && !_.has(resultdata, _id)) return;	// 適用しない
					if ($this.hasClass('cltxtFieldLimit')) return;	// 適用しない
					if ($this.hasClass('cl_date')) {
						// datepickerの場合は日付を表示用に変換する
						$this.html(clutil.dateFormat(resultdata[_id], 'yyyy/mm/dd'));
					} else if ($this.hasClass('cl_month')) {
						// 月指定の場合は日付を表示用に変換する
						$this.html(clutil.monthFormat(resultdata[_id], 'yyyy/mm'));
					} else if ($(this).hasClass('cl_time')) {
						// 時刻指定の場合は時刻を表示用に変換する
						$this.html(clutil.timeFormat(resultdata[_id], 'hh:mm'));
					} else {
						$this.text(clutil.cStr(mask($this, resultdata[_id])));
					}
				})
				.end()
				.find('button[data-toggle="dropdown"]').each(function () {
					//console.log(this);
					// flutui-selectbox
					// プレフィックスを除去する
					_id = (this.id).replace(_prefix, "");
					if (skipundefined && !_.has(resultdata, _id)) return;	// 適用しない
					//this.val(clutil.cStr(resultdata[_id]));
					//this.selectpicker('val', clutil.cStr(resultdata[_id]));
				})
				.end();

			var promise = fieldrelation_complete();
			if (promise) {
				promise.always(function () {
					// data2viewが終了したイベントを発行
					clutil.mediator.trigger('data2view:done');
				});
			} else {
				// data2viewが終了したイベントを発行
				clutil.mediator.trigger('data2view:done');
			}
		},

		/**
		 * 表示エリアよりデータオブジェクトを作成する(table版)
		 * 指定したプレフィックスを除去したnameの名前で作成する
		 * @param {jQuery} $trobj trのjQueryオブジェクト (例：$('#ca_tbody_dlv').children())
		 * @param {Object} options clutil.serializeへのオプション
		 * @return {Object} シリアライズ結果
		 */
		tableview2data: function ($trobj, prefix) {
			var resultArray = [];
			//var _prefix = prefix ? prefix : 'ca_';
			var _prefix = _.isRegExp(prefix) ? prefix : !_.isEmpty(prefix) ? new RegExp('^' + prefix.toString()) : clutil._v2dPrefixRegEx;
			var _name = '';
			$trobj.each(function () {
				var resultdata = {};
				$(this)
					.find("input[name]")
					.filter('[type="text"]').each(function () {
						var $this = $(this);
						console.log(this);
						// プレフィックスを除去する
						_name = $this.attr("name").replace(_prefix, "");
						if ($this.hasClass('cl_date')) {
							// datepickerの場合は日付をサーバーに送る型に変換する
							resultdata[_name] = clutil.dateFormat(this.value, 'yyyymmdd');
						} else if ($this.hasClass('cl_month')) {
							// 月選択の場合は月をサーバーに送る型に変換する
							resultdata[_name] = clutil.monthFormat(this.value, 'yyyymm');
						} else if ($this.hasClass('cl_time')) {
							// 時刻選択の場合は時刻をサーバーに送る型に変換する
							resultdata[_name] = clutil.timeFormat(this.value, 'hhmm');
						} else if ($this.hasClass('cl_autocomplete')) {
							// オートコンプリートの場合は $this.autocomplete('clAutocompleteItem') の取得値を使用する
							var data = $this.autocomplete('clAutocompleteItem');
							if (data) {
								var cn = _.pick(data, 'id', 'code', 'name');
								resultdata['_view2data_' + _name + '_cn'] = cn;
								resultdata[_name] = cn.id;
							}
						} else if ($this.hasClass('cl_store')) {
							// オートコンプリートの場合は'cs_id'属性の値を使用する
							var data = $this.data('cl_store_item');
							if (data) {
								var cn = _.pick(data, 'id', 'code', 'name');
								resultdata['_view2data_' + _name + '_cn'] = cn;
								resultdata[_name] = cn.id;
							} else {
								resultdata[_name] = $this.attr('cs_id');	// 互換
							}
						} else {
							resultdata[_name] = $.inputlimiter.unmask($this.val(), {
								limit: $this.attr('data-limit'),
								filter: $this.attr('data-filter')
							});
						}
					})
					.end()
					.filter('[type="hidden"]').each(function () {
						console.log(this);
						// hiddenのものに対しても処理を行う(idなど)
						// プレフィックスを除去する
						_name = $(this).attr("name").replace(_prefix, "");
						resultdata[_name] = this.value;
					})
					.end()
					.filter('[type="password"]').each(function () {
						console.log(this);
						// パスワード
						// プレフィックスを除去する
						_name = $(this).attr("name").replace(_prefix, "");
						resultdata[_name] = this.value;
					})
					.end()
					.filter('[type="checkbox"]').each(function () {
						console.log(this);
						// チェックボックス
						// プレフィックスを除去する
						_name = $(this).attr("name").replace(_prefix, "");
						resultdata[_name] = this.checked ? 1 : 0;
					})
					.end()
					.filter('[type="radio"]').each(function () {
						console.log(this);
						// ラジオボタン
						// nameで取得する
						if (this.checked) {
							// プレフィックスを除去する
							_name = $(this).attr("name").replace(_prefix, "");
							// チェックされていたらデータ化する
							resultdata[_id] = this.value;
						}
					})
					.end()
					.end()
					.find("textarea[name]").each(function () {
						console.log(this);
						// テキストエリア
						// プレフィックスを除去する
						_name = $(this).attr("name").replace(_prefix, "");
						resultdata[_name] = this.value;
					})
					.end()
					.find("select[name]").each(function () {
						console.log(this);
						// valueの値が取得される
						// プレフィックスを除去する
						_name = $(this).attr("name").replace(_prefix, "");
						try {
							// selectpickerを利用している場合
							resultdata[_name] = $(this).selectpicker("val");
						} catch (e) {
							resultdata[_name] = this.value;
						}
					})
					.end()
					.find("span[name]").each(function () {
						var $this = $(this);
						console.log(this);
						// プレフィックスを除去する
						_name = $(this).attr("name").replace(_prefix, "");
						if ($(this).hasClass('cl_date')) {
							// datepickerの場合は日付をサーバーに送る型に変換する
							resultdata[_name] = clutil.dateFormat($(this).text(), 'yyyymmdd');
						} else {
							resultdata[_name] = $.inputlimiter.unmask($(this).text(), {
								limit: $this.attr('data-limit'),
								filter: $this.attr('data-filter')
							});
						}
					})
					.end();
				resultArray.push(resultdata);
			});
			return resultArray;
		},
		//		旧版
		//		/**
		//		* 表示エリアよりデータオブジェクトを作成する(table版)
		//		* 指定したプレフィックスを除去したnameの名前で作成する
		//		* @param {jQuery} $trobj trのjQueryオブジェクト (例：$('#ca_tbody_dlv').children())
		//		* @param {Object} options clutil.serializeへのオプション
		//		* @return {Object} シリアライズ結果
		//		*/

		//		tableview2data: function($trobj, options) {
		//		return _.map($trobj, function (el) {
		//		var data = clutil.serialize(el, options);
		//		return data;
		//		});
		//		},

		/**
		 * テーブル内部 input の入力チェック
		 * @method tableview2ValidData
		 * @for clutil
		 * @param {object} arg
		 * @param {jQuery} arg.$tbody tbody 部の jQuery
		 * @param {object} [arg.validator] バリデータ
		 * @param {function} [arg.tailEmptyCheckFunc] 空DTOチェックメソッド
		 * @param {object} [arg.veiw2dataPrefix] 行データ使用時の prefix 引数
		 * @return {array, null or undefined} 配列を返した場合はOK、null or undefined の場合は NG。
		 */
		tableview2ValidData: function (arg) {
			var result = clutil.tableview2ValidDataWithStat(arg);
			return result.ngCount == 0 ? result.items : null;
		},
		/**
		 * テーブル内部 input の入力チェック
		 * @method tableview2ValidData
		 * @for clutil
		 * @param {object} arg
		 * @param {jQuery} arg.$tbody tbody 部の jQuery
		 * @param {object} [arg.validator] バリデータ
		 * @param {function} [arg.tailEmptyCheckFunc] 空DTOチェックメソッド
		 * @param {object} [arg.veiw2dataPrefix] 行データ使用時の prefix 引数
		 * @return {object} result 結果情報。
		 * .allItems は全行のデータ、.items は後ろ空行を取り除いたデータ、.stat は各行が有用かどうか状態で、
		 * キー:行インデックス、値: 'ok', 'empty' or 'inval' 文字列を返す。.ngCount は、
		 * 標準 validator チェックでNGになった行数を返す。
		 */
		tableview2ValidDataWithStat: function (arg) {
			var tailEmptyCheckFunc = _.isFunction(arg.tailEmptyCheckFunc) ? arg.tailEmptyCheckFunc : null;
			var result = {
				allItems: [],	// エラー有無にかかわらず、全行のデータ配列
				items: [],		// 後ろの空行を取り除いた行データ配列
				stat: {},		// 各行が有用かどうか状態, key:行インデックス、val: 'ok', 'empty' or 'inval'
				ngCount: 0		// エラー行数
			};
			var trElems = arg.$tbody.find('tr');
			for (var i = trElems.length - 1; i >= 0; i--) {
				var $tr = $(trElems.get(i));
				var itemDto = _.first(clutil.tableview2data($tr, arg.veiw2dataPrefix));
				result.allItems.splice(0, 0, itemDto);
				if (tailEmptyCheckFunc) {
					// オートコンプリートスペシャルチェック
					// オートコンプリートにテキスト入力アリ、かつ、選択肢から選んでいない場合、
					// clutil.tableview2data() では未入力と判断され、codename を返さないので、
					// 誤入力テキストを検出できない。よって特別チェックをやる。
					var autocompleteNG = 0;
					$tr.find('.cl_autocomplete').each(function () {
						var $input = $(this);
						if (!$input.autocomplete('isValidClAutocompleteSelect')) {
							autocompleteNG++;
						}
					});
					if (autocompleteNG === 0 && tailEmptyCheckFunc(itemDto)) {
						arg.validator.clear($tr.find('.cl_valid'));
						result.stat[i] = 'empty';
						continue;	// ここで、tail から連続する空欄行と判定。次行チェックへcontinue。
					}
				}
				// ここから、値が入っている行のチェック
				tailEmptyCheckFunc = null;
				if (arg.validator && !arg.validator.valid({ $el: $tr.find('.cl_valid') })) {
					result.ngCount++;
					result.stat[i] = 'inval';
				} else {
					result.stat[i] = 'ok';
				}
				result.items.splice(0, 0, itemDto);
			};
			if (result.ngCount !== 0 && arg.validator) {
				arg.validator.setErrorHeader(clmsg.cl_echoback);
			}
			return result;
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
		isViewEmpty: function ($view, options) {
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
				x = _.all(data, function (value) { return !value }),
				y = _.all(selectData, function (value) { return value === '0' });
			return x && y;
		},

		/**
		 * 表示エリアをクリアする
		 * 引数
		 * ・$view : 表示エリアのjQueryオブジェクト (例：$('#viewarea'))
		 * 戻り値
		 * ・なし
		 */
		viewClear: function ($view) {
			$view
				.find("input[id]")
				.filter('[type="text"]').each(function () {
					console.log(this);
					this.value = "";
				})
				.end()
				.filter('[type="password"]').each(function () {
					console.log(this);
					// パスワード
					this.value = "";
				})
				.end()
				.filter('[type="checkbox"]').each(function () {
					console.log(this);
					// チェックボックス
					$(this).attr("checked", "false");
				})
				.end()
				.end()
				.find('input[name]')
				.filter('[type="radio"]').each(function () {
					console.log(this);
					// ラジオボタン
					$(this).attr("checked", "false");
				})
				.end()
				.end()
				.find("textarea[id]").each(function () {
					console.log(this);
					// テキストエリア
					this.value = "";
				})
				.end()
				.find("select[id]").each(function () {
					console.log(this);
					// コンボボックス(マルチセレクト未サポート)
					$(this).prop('selectedIndex', 0);
				})
				.end()
				.find("span[id]").each(function () {
					$(this).html("");
				});
		},

		/**
		 * 何もしないので、使用しないでください。
		 *
		 * @deprecated
		 * @method inputlimiter
		 * @for clutil
		 * @deprecated
		 */
		inputlimiter: function ($el) {
			// clcomの一番最後でinputlimiter.startをしているので呼ばなくてもよい。
		},

		/**
		 * 数値をカンマ区切りにする。
		 *
		 * @method comma
		 * @for clutil
		 * @param {String} 数値の文字列形式
		 * @example
		 * clutil.comma('123456789') //=> 123,456,789
		 * clutil.comma('12345.67890') //=> 12,345.67890
		 */
		comma: function (value) {
			if (value == null) return '';
			return $.inputlimiter.Filters.comma().mask(String(value));
		},

		/**
		 * datepickerの作成
		 * 引数
		 * ・$view : 表示エリアのjQueryオブジェクト (例：$('#viewarea'))
		 * 戻り値
		 * ・datepicker 拡張JQueryオブジェクト
		 */
		datepicker: function ($view, options) {
			options || (options = {});
			var initValue = options.initValue == null ? 0 : clcom.getOpeDate();
			var min_date = options.min_date;
			var date = clutil.ymd2date(clcom.getOpeDate());
			min_date = min_date == null ? clutil.ymd2date(clcom.min_date) : clutil.ymd2date(min_date);
			var max_date = options.max_date == null ? clutil.ymd2date(clcom.max_date) : clutil.ymd2date(options.max_date);
			date.setFullYear(date.getFullYear() + 20);
			$view.attr('maxlength', 10);
			//$view.val(clutil.dateFormat(clcom.getOpeDate(), 'yyyy/mm/dd'));
			$view.on('input', function (e) {
				var $input = $(e.target);

				// 曜日表示を外す
				var $wrap = $input.closest('.datepicker_wrap')
					.removeClass("dayOfWeek0 dayOfWeek1 dayOfWeek2 dayOfWeek3 dayOfWeek4 dayOfWeek5 dayOfWeek6");

				// 入力テキストの DateFormat チェック
				var text = $input.val();
				if (_.isEmpty(text)) {
					return;
				}

				// Date オブジェクトに変換
				var dt = clutil.ymd2date(text);
				if (!_.isDate(dt) || _.isNaN(dt.getDay())) {
					return;
				}

				// 曜日表示を入れる
				var dayOfWeek = dt.getDay();
				$wrap.addClass('dayOfWeek' + dayOfWeek);

				// 数値だけの日付フォーマットの場合は、入力が yyyy/mm/dd フォーマットに
				// 則する場合と同様の内部値諸々のデータ同期をはかる
				if (_.isFinite(text)) {
					var inst = $.datepicker._getInst(e.target);
					if (text != inst.lastVal) {
						do {
							//$.datepicker._setDateFromField(inst); の内部を展開
							//var dates = text;//inst.lastVal = inst.input ? inst.input.val() : null;
							inst.selectedDay = dt.getDate();
							inst.drawMonth = inst.selectedMonth = dt.getMonth();
							inst.drawYear = inst.selectedYear = dt.getFullYear();
							inst.currentDay = dt.getDate();//(dates ? dt.getDate() : 0);
							inst.currentMonth = dt.getMonth();//(dates ? dt.getMonth() : 0);
							inst.currentYear = dt.getFullYear();//(dates ? dt.getFullYear() : 0);
							$.datepicker._adjustInstDate(inst);
						} while (0);
						$.datepicker._updateAlternate(inst);
						$.datepicker._updateDatepicker(inst);
					}
				}
			});
			var dpopt = {
				dateFormat: 'yy/mm/dd',
				changeMonth: true,
				changeYear: true,
				firstDay: 1,
				yearRange: min_date.getFullYear() + ':' + max_date.getFullYear(),
				minDate: min_date,
				maxDate: max_date,
				//					autoSize: true,
				showOn: 'button',
				buttonImage: clcom.appRoot + '/../images/icn_s_calendar.png',
				buttonText: clmsg.cl_datepicker_button_text,
				buttonImageOnly: true,
				//					defaultDate: clutil.ymd2date(clcom.getOpeDate())
				onSelect: function (text, ui) {
					var dayOfWeek = new Date(ui.selectedYear, ui.selectedMonth, ui.selectedDay).getDay();
					ui.input.closest('.datepicker_wrap')
						.removeClass("dayOfWeek0 dayOfWeek1 dayOfWeek2 dayOfWeek3 dayOfWeek4 dayOfWeek5 dayOfWeek6")
						.addClass('dayOfWeek' + dayOfWeek);
					ui.input.focus();
					// changeイベントがとばなくて困ったのでとりあえず
					ui.input.trigger('clDatepickerOnSelect');
				},
				foo: function () {
					return 'foo';
				}
			};
			var $dp = $view.datepicker(dpopt);

			// ope_date を初期値にセット
			$dp.datepicker('setIymd', initValue);

			// inputlimiterの設定
			$view.inputlimiter('addfilter', 'datepickerFilter', {
				// ブラー時などに20140808 => 2014/08/08に変換する
				mask: function (value) {
					// 8桁の数値のときのみフォーマットする
					var ret = value;
					var chkArg = {
						value: value,
						minDate: min_date,
						maxDate: max_date,
						limitCheck: false// 日付形式として正しいかどうかだけチェックするので false 指定で。
					};
					if (clutil.checkDate(chkArg) &&
						/^[0-9]{8,8}$/.test(value)) {
						ret = value.replace(
							/([0-9]{4,4})([0-9]{2,2})([0-9]{2,2})/,
							'$1/$2/$3'
						);
					}
					return ret;
				}
			});

			return $dp;
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
				//				$(this).next().show();
			});
			$el.find('.parent>.plus').each(function () {
				var tgt = $(this).next();
				tgt.animate({
					height: 'toggle',
					opacity: 'toggle'
				}, 'slow');
				//				$(this).next().hide();
			});

			$el.delegate('.parent>.minus', 'click', function (ev) {
				var $c = $(ev.currentTarget);
				//				$c.next().hide();
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
				//				$c.next().show();
				$c.attr('class', 'minus');
			});

			return $el;
		},

		/**
		 * 全選択、選択クリアcheckboxを作成する
		 * AOKI
		 * @param ($el) 全選択、選択クリアcheckboxを含むjQueryオブジェクト
		 * @param ($table) checkboxを監視するtableのjQueryオブジェクト
		 * @param ($tbody) checkboxを監視するtbodyのjQueryオブジェクト
		 * @param (name) checkboxのname属性 指定しない場合はすべてのcheckboxが対象
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
					$.each($tbody.find(checkbox), function () {
						if ($(this).prop('checked')) {
							chklist.push(this);
						}
					});
					// データの数とチェックボックスの数が一致したとき、全選択チェックボックスをオンにする
					if (trlist.length === chklist.length) {
						$el.checkbox('check');
					} else {
						$el.checkbox('uncheck');
					}
				}
			});

			var defaultchkbox = {
				init: function () {
					$table.find($(':checkbox')).checkbox('uncheck');
					$tbody.find('tr').removeClass('checked');
				},
				checkall: function () {
					$table.find($(':checkbox')).checkbox('check');
					$tbody.find('tr').addClass('checked');
				},
				check: function () {
					// チェックを行う
					// データの数とチェックボックスの数が一致したとき、全選択チェックボックスをオンにする
					var trlist = $tbody.find('tr');
					var chklist = [];
					$.each($tbody.find(checkbox), function () {
						if ($(this).prop('checked')) {
							$(this).closest('tr').addClass('checked');
							chklist.push(this);
						}
					});
					// データの数とチェックボックスの数が一致したとき、全選択チェックボックスをオンにする
					if (trlist.length != 0 &&
						(trlist.length === chklist.length)) {
						$el.checkbox('check');
					} else {
						$el.checkbox('uncheck');
					}
				}
			};

			return defaultchkbox;

		},

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
				init: function () {
					$btn_resrch.fadeOut();
					$div_resrch.addClass('dispn');
				},
				/**
				 * 検索条件エリアを表示する
				 * @method show_srch
				 * @return {promise} アニメーション等のUIエフェクト完了と接続する promise オブジェクトを返す。
				 */
				show_srch: function () {
					if ($div_srch.css('display') != 'none') {
						return $.Deferred().resolve();
					}

					var fadeOutDf = $.Deferred();
					$btn_resrch.fadeOut(function () {
						console.debug('show_srch: $div_srch.fadeOut() done.');
						fadeOutDf.resolve();
					});

					var animeDf = $.Deferred();
					var $tgt = $div_srch.parent();
					$tgt.animate({
						backgroundColor: "none",
						height: height
					}, {
						duration: 300,
						complete: function () {
							console.debug('show_srch: $div_srch.parent().animate() done.');
							$tgt.css('height', 'auto');
							animeDf.resolve();
						}
					});

					// IE不具合対応
					$div_srch.parent().css('overflow', 'inherit');
					// IE不具合対応
					var fadeInDf = $.Deferred();
					$div_srch.fadeIn(function () {
						console.debug('show_srch: $btn_resrch.fadeIn() done.');
						fadeInDf.resolve();
					});
					$btn_srch.focus();

					var df = $.Deferred();
					$.when(fadeOutDf, animeDf, fadeInDf).done(function () {
						console.debug('show_srch: {fadeOutDf, animeDf, fadeInDf} joined.');
						df.resolve();
					});
					return df.promise();
				},
				/**
				 * 結果表示部を表示する
				 * @method show_result
				 * @return {promise} アニメーション等のUIエフェクト完了と接続する promise オブジェクトを返す。
				 */
				show_result: function () {
					if ($div_srch.css('display') == 'none') {
						return $.Deferred().resolve();
					}
					var fadeOutDf = $.Deferred();
					$div_srch.fadeOut(function () {
						console.debug('show_result: $div_srch.fadeOut() done.');
						fadeOutDf.resolve();
					});

					var animeDf = $.Deferred();
					$div_srch.parent().animate({
						backgroundColor: "#0fb8aa",
						height: "40px",
					}, 300, null, function () {
						console.debug('show_result: $div_srch.parent().animate() done.');
						animeDf.resolve();
					});

					var fadeInDf = $.Deferred();
					$btn_resrch.fadeIn(function () {
						console.debug('show_result: $btn_resrch.fadeIn() done.');
						fadeInDf.resolve();
					});

					$div_resrch.removeClass('dispn');
					$btn_resrch.focus();

					var df = $.Deferred();
					$.when(fadeOutDf, animeDf, fadeInDf).done(function () {
						console.debug('show_result: {fadeOutDf, animeDf, fadeInDf} joined.');
						df.resolve();
					});
					return df.promise();
				},
				/**
				 * 検索条件＆結果表示エリアの両方を表示する
				 * @method show_both
				 * @return {promise} アニメーション等のUIエフェクト完了と接続する promise オブジェクトを返す。
				 */
				show_both: function () {
					var d0 = $.Deferred(), d1 = $.Deferred(), d2 = $.Deferred();
					if ($div_srch.css('display') == 'none') {
						// 検索エリアを表示する
						$div_srch.parent().animate({
							backgroundColor: "none",
							height: height
						}, 300, null, function () {
							console.debug('show_both: $div_srch.parent().animate() done.');
							d0.resolve();
						});
						// IE不具合対応
						$div_srch.parent().css('overflow', 'inherit');
						// IE不具合対応
						$div_srch.fadeIn(function () {
							console.debug('show_both: $div_srch.fadeOut() done.');
							d1.resolve();
						});
					}

					// 再検索ボタンを非表示に。
					if ($btn_resrch.css('display') != 'none') {
						$btn_resrch.fadeOut(function () {
							console.debug('show_result: $btn_resrch.fadeOut() done.');
							d2.resolve();
						});
					}

					if ($div_resrch.hasClass('dispn')) {
						// 結果エリアを表示する
						$div_resrch.removeClass('dispn');
					}

					var df = $.Deferred();
					$.when(d0, d1, d2).done(function () {
						console.debug('show_result: {fadeOutDf, animeDf, fadeInDf} joined.');
						df.resolve();
					});
					return df.promise();
				},
				/**
				 * 初期表示状態にリセットする
				 * @method reset
				 * @return {promise} アニメーション等のUIエフェクト完了と接続する promise オブジェクトを返す。
				 */
				reset: function () {
					var d0 = $.Deferred(), d1 = $.Deferred(), d2 = $.Deferred();
					if ($div_srch.css('display') == 'none') {
						$div_srch.parent().animate({
							backgroundColor: "none",
							height: height
						}, 300, null, function () {
							console.debug('reset: $div_srch.parent().animate() done.');
							d0.resolve();
						});
						// IE不具合対応
						$div_srch.parent().css('overflow', 'inherit');
						// IE不具合対応
						$div_srch.fadeIn(function () {
							console.debug('reset: $div_srch.fadeIn() done.');
							d1.resolve();
						});
					}
					// 再検索ボタンを非表示に。
					if ($btn_resrch.css('display') != 'none') {
						$btn_resrch.fadeOut(function () {
							console.debug('reset: $btn_resrch.fadeOut() done.');
							d2.resolve();
						});
					}
					$div_resrch.addClass('dispn');

					var df = $.Deferred();
					$.when(d0, d1, d2).done(function () {
						console.debug('reset: {fadeOutDf, animeDf, fadeInDf} joined.');
						df.resolve();
					});
					return df.promise();
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
			var right_side;
			//右ウィンドウ出し入れ関数化
			right_side = {
				//初回右ウインドウ表示
				firstshow: function () {
					//					$btn_add.die("click");
					$div_selected.animate(
						{ 'right': '-=240px' },
						{
							complete: function () {

								$div_selected.toggleClass("dispn");

								$div_selected.animate({ 'right': '+=240px' }, { duration: 200 });
							}, duration: 1
						});
				},
				//2回目以降右ウインドウ表示
				//右ウインドウ範囲外と追加ボタン同時に押下された時対策として時差を持たせるために一旦10pxバックしている。
				show: function () {
					//					$btn_add.die("click");
					$div_selected.animate(
						{ 'right': '-=10px' },
						{
							complete: function () {

								$div_selected.toggleClass("dispn");

								$div_selected.animate({ 'right': '+=250px' }, { duration: 200 });
							}, duration: 1
						});

				},
				//右ウインドウ非表示
				hide: function () {
					$div_selected.animate(
						{ 'right': '-=240px' },
						{
							complete: function () {
								//						$btn_add.live("click");

								if (!$div_selected.hasClass("second")) {

									$div_selected.toggleClass("second");
								}

								$div_selected.toggleClass("dispn");
							}, duration: 200
						});
				}
			};

			//追加ボタン押下時の処理 初回:firstshow 2回目以降:show
			$el.click(function (e) {
				if ($(e.target).get(0).id == $btn_add.get(0).id) {
					if ($div_selected.hasClass("dispn")) {

						if (!$div_selected.hasClass("second")) {
							right_side.firstshow();
							$div_selected.toggleClass(
								"second");
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
				if (!$div_selected.hasClass("dispn")) {
					right_side.hide();
				}
			});

			var defaultaddtoSelected = {
				right_side_hide: function () {
					right_side.hide();
				},
				right_side_show: function () {
					right_side.show();
				},
				// 状態を返却する
				// 開:true 閉:false
				right_side: function () {
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
		 * ・namedisp : 名称のみを取得したい場合1を設定。なにも指定されていない場合は "コード：名称" で返す
		 * 戻り値
		 * ・区分コード：区分名
		 */
		gettypename: function (kind, typeid, namedisp) {
			var s = '';
			var kbns = clcom.getTypeList(kind, typeid);
			if (!_.isEmpty(kbns)) {
				var kbn = kbns[0];
				if (namedisp) {
					if (kbn.name) {
						s = kbn.name;
					}
					if (_.isEmpty(s)) {
						s = kbn.code;	// 表示するものがないからコードで、余計なお世話カナ？
					}
				} else {
					var ss = [];
					if (kbn.code) {
						ss.push(kbn.code);
					}
					if (kbn.name) {
						ss.push(kbn.name);
					}
					s = ss.join(':');
				}
			}
			return s;
		},

		/**
		 * AOKI
		 * 区分リスト取得
		 * 引数
		 * ・kind : 区分値名
		 * ・ids：kind 下の id フィルタ（省略時は kind 下の全要素）
		 * 戻り値
		 * ・区分リスト
		 */
		gettypenamelist: function (kind, ids) {
			return clcom.getTypeList(kind, ids);
		},

		/**
		 * AOKI
		 * 区分selectorの作成
		 * 引数
		 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
		 * ・kind				: 区分名
		 * ・unselectedflag		: 未選択値 0:なし 1:あり
		 * ・namedisp : 名称のみを取得したい場合1を設定。なにも指定されていない場合はコード：名称で返す
		 */
		cltypeselector: function ($select, kind, unselectedflag, namedisp) {
			var o;
			if (arguments.length === 1 && !(arguments[0] instanceof jQuery) && _.isObject(arguments[0])) {
				o = arguments[0];
			} else {
				o = {
					$select: arguments[0],
					kind: arguments[1],
					unselectedflag: arguments[2],
					namedisp: arguments[3]
				};
			}

			var html_source = '';
			// 区分名より区分リストを取得する
			var typenamelist = clutil.gettypenamelist(o.kind, o.ids);
			if (typenamelist == null) {
				return;
			}
			var typename;
			for (var i = 0; i < typenamelist.length; i++) {
				typename = typenamelist[i];
				// selectorの中身を作成する
				if (o.namedisp == 1) {
					html_source += '<option value=' + typename.type_id + '>' +
						typename.name + '</option>';
				} else {
					html_source += '<option value=' + typename.type_id + '>' +
						typename.code + ':' + typename.name + '</option>';
				}
			}
			var nitem = typenamelist.length;

			// 未選択値を追加する
			var fixUnselectFlag = o.unselectedflag;
			if (nitem <= 0) {
				// 要素が無い場合は白牌を追加しておく。
				// [clutil.forceUnselectFlag] に依らない。
				fixUnselectFlag = true;
			} else {
				// 未選択要素を強制するフラグ評価。
				if (clutil.forceUnselectFlag) {
					// 入力必須かつ選択肢が１つの場合は１個で選択固定するので、白牌は追加しない。
					fixUnselectFlag = !($select.hasClass('cl_required') && nitem == 1);
				}
			}
			if (fixUnselectFlag) {
				var label = (o.emptyLabel) ? o.emptyLabel : '&nbsp';
				html_source = '<option value="0">label</option>' + html_source;
				nitem++;
			}

			o.$select.html('');
			o.$select.html(html_source);

			if (nitem <= 1) {
				// TODO: 選択肢が１つまたは無いので、変更できないようにする。
			}
		},

		/**
		 * AOKI
		 * 区分selectorの作成 No.2
		 * リストから区分selectorを作成する。
		 * 引数
		 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
		 * ・list				: 区分リスト
		 * ・unselectedflag		: 未選択値 0:なし 1:あり
		 * ・namedisp : 名称のみを取得したい場合1を設定。なにも指定されていない場合はコード：名称で返す
		 * ・idname				: IDのid名（defaultは"id")
		 * ・namename			: 名称のid名（defaultは"name")
		 * ・codename			: コードのid名（defaultは"code")
		 */
		cltypeselector2: function ($select, list, unselectedflag, namedisp, idname, namename, codename) {
			var o;
			if (arguments.length === 1 && !(arguments[0] instanceof jQuery) && _.isObject(arguments[0])) {
				o = arguments[0];
			} else {
				o = {
					$select: arguments[0],
					list: arguments[1],
					unselectedflag: arguments[2],
					namedisp: arguments[3],
					idname: arguments[4],
					namename: arguments[5],
					codename: arguments[6]
				};
			}

			// unselectflag 補正
			// $select が、入力必須（'.cl_required ' クラスを持っている）場合で、かつ、
			// list が１アイテムの場合、選択の余地が無いため、unselectflag は false に設定する。
			if (true) {
				var nitem = _.isEmpty(o.list) ? 0 : o.list.length;

				// 未選択値を追加する=>(デフォルトを未選択ありにする)
				var fixUnselectFlag = o.unselectedflag !== false && o.unselectedflag !== 0;
				if (o.$select.is('[multiple]')) {
					fixUnselectFlag = false;
				} else if (nitem <= 0) {
					// 要素が無い場合は白牌を追加しておく。
					// [clutil.forceUnselectFlag] に依らない。
					fixUnselectFlag = true;
				} else {
					// 未選択要素を強制するフラグ評価。
					if (clutil.forceUnselectFlag) {
						// 入力必須かつ選択肢が１つの場合は１個で選択固定するので、白牌は追加しない。
						fixUnselectFlag = !(o.$select.hasClass('cl_required') && nitem == 1);
					}
				}

				o.unselectedflag = fixUnselectFlag;
			}

			clutil.cltypeselector3(o);
		},

		/**
		 * 区分selectorの作成 No.3
		 * リストから区分selectorを作成する。
		 *
		 * cltypeselector2 では、対象となる select 要素 $select に入力
		 * 必須クラス `<select class="cl_required" ...>` 制限つきで、
		 * list 要素が１つの場合は、unselectedflag に依らず、１アイテム
		 * で選択変更不可としていたのに対して、cltypeselector3 では、未
		 * 選択アイテムあり/なしオプション unselectedflag は素直に適用
		 * する。
		 *
		 * @method clutil.cltypeselector3
		 *
		 * @param {object}	opt
		 * @param {jQuery}	opt.$select			区分selectのjQueryオブジェクト (例：$('#viewarea'))
		 * @param {array}	opt.list			{id, code, name} 要素を単位とするリスト。
		 * @param {boolean}	[opt.unselectedflag]	未選択値 false:なし、true:あり
		 * @param {string}	[opt.emptyLabel]	未選択アイテムに表示するラベル
		 * @param {boolean}	[opt.namedisp]		ラベル表示オプション、true:「名称」のみ、false:「コード:名称」表示
		 * @param {string}	[opt.idname]		任意の opt.list[n]要素の id プロパティ名、デフォルトは "id"
		 * @param {string}	[opt.codename]		任意の opt.list[n]要素の code プロパティ名、デフォルトは "code"
		 * @param {string}	[opt.namename]		任意の opt.list[n]要素の name プロパティ名、デフォルトは "name"
		 * @param {object}	[opt.selectpicker] selectpickerへのオプション
		 */
		cltypeselector3: function (opt) {
			if (opt.list == null) {
				return;
			}

			var id = opt.idname == null ? "id" : opt.idname;
			var name = opt.namename == null ? "name" : opt.namename;
			var code = opt.codename == null ? "code" : opt.codename;

			var typename;
			var html_source = '';
			opt.idMap = {};
			for (var i = 0; i < opt.list.length; i++) {
				typename = opt.list[i];
				// selectorの中身を作成する
				if (opt.namedisp == 1) {
					html_source += '<option value=' + typename[id] + '>' +
						typename[name] + '</option>';
				} else {
					var wkList = [];
					if (!_.isEmpty(typename[code])) {
						wkList.push(typename[code]);
					}
					if (!_.isEmpty(typename[name])) {
						wkList.push(typename[name]);
					}
					html_source += '<option value=' + typename[id] + '>' + wkList.join(':') + '</option>';
				}
				opt.idMap[typename[id]] = typename;
			}
			var nitem = opt.list.length;
			if (opt.unselectedflag) {
				var emptyLabel = opt.emptyLabel || "&nbsp;";
				html_source = '<option value="0">' + emptyLabel + '</option>' + html_source;
				nitem++;
			}

			opt.$select.html('');
			opt.$select.html(html_source);
			opt.$select.selectpicker(opt.selectpicker).selectpicker('refresh');

			if (opt.list.length <= 1) {
				// 選択肢が１つまたは無いので、変更できないようにする。
				var required = opt.$select.is('.requiredSelect > div > select');
				var multiple = opt.$select.is("[multiple]");
				// 1つで必須かつ複数選択でないとき、またはアイテムがないときにリードオンリーにする
				if (required && !multiple) {
					clutil.inputReadonly(opt.$select);
					if (opt.list.length) {
						opt.$select.selectpicker("val", opt.list[0].id);
					}
				} else if (nitem <= 1) {
					clutil.inputReadonly(opt.$select);
				}
			}
		},

		/**
		 * AOKI
		 * 役職selectorの作成
		 * 引数
		 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
		 * ・unselectedflag		: 未選択値 0:なし 1:あり
		 * ・namedisp : 名称のみを取得したい場合1を設定。なにも指定されていない場合はコード：名称で返す
		 */
		cljobpostselector: function ($select, unselectedflag, namedisp) {
			var html_source = '';
			// 役職区分リストを取得する
			var jobpostlist = clcom.getJobpostList();
			if (jobpostlist == null) {
				return;
			}
			// 未選択値を追加する
			var jobpost;
			if (unselectedflag == 1) {
				html_source += '<option value="0">&nbsp</option>';
			}
			for (var i = 0; i < jobpostlist.length; i++) {
				jobpost = jobpostlist[i];
				// selectorの中身を作成する
				if (namedisp == 1) {
					html_source += '<option value=' + jobpost.jobpost_id + '>' +
						jobpost.name + '</option>';
				} else {
					html_source += '<option value=' + jobpost.jobpost_id + '>' +
						jobpost.code + ':' + jobpost.name + '</option>';
				}
			}
			$select.html('');
			$select.html(html_source);
		},

		/**
		 * 年月selectorの作成
		 * AOKI
		 * 引数
		 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
		 * ・past		: 過去何年から defaultは10年
		 * ・future		: 未来何年まで defaultは0年
		 * ・pyyyymm	: 過去何年から(年月を直接指定) pastよりも優先
		 * ・fyyyymm	: 未来何年まで(年月を直接指定) futureよりも優先
		 * ・unselectedflag		: 未選択値 0:なし 1:あり
		 * ・f_month	: 0:表示を'yyyy/mm度'とする 1:表示を'yyyy/mm'とする
		 * ・f_default	: 初期表示位置（当月を0とする）
		 * ・sortOrder	: 昇順'a' or 降順'd'、デフォルトは昇順
		 */
		clmonthselector: function ($select, unselectedflag, past, future, pyyyymm, fyyyymm, f_month, f_default, sortOrder) {
			var html_source = '';

			var ope_month = clutil.dateFormat(clcom.getOpeDate(), 'yyyymm');
			var n_year = Math.floor(ope_month / 100);
			var n_month = Math.floor(ope_month % 100);

			unselectedflag = unselectedflag !== false && unselectedflag !== 0;

			f_default = f_default == null ? 0 : f_default;
			var d_year = n_year;
			var d_month = n_month + f_default;
			while (d_month < 0 || d_month > 12) {
				if (d_month < 0) {
					d_month += 12;
					d_year -= 1;
				} else if (d_month > 12) {
					d_month -= 12;
					d_year += 1;
				}
			}
			d_month = d_year * 100 + d_month;

			// 過去何年から
			var n_past = past == null ? 10 : past;
			// 未来何年まで
			var n_future = future == null ? 0 : future;

			// 未選択値を追加する
			if (unselectedflag) {
				html_source += '<option value="0">&nbsp</option>';
			}

			var st_month = n_month;
			var ed_month = 12;
			var py = null, fy = null;

			// 年月を直接指定した場合の処理(優先)
			if (pyyyymm != null) {
				py = Math.floor(pyyyymm / 100);
				n_past = n_year - py;
				st_month = Math.floor(pyyyymm % 100);
			}
			if (fyyyymm != null) {
				fy = Math.floor(fyyyymm / 100);
				n_future = fy - n_year;
				n_month = Math.floor(fyyyymm % 100);
			}
			if (pyyyymm != null && fyyyymm != null && py == fy) {
				ed_month = n_month;
			}

			var items = [];
			for (var i = n_year - n_past; i <= n_year + n_future; i++) {
				// selectorの中身を作成する
				for (var j = st_month; j <= ed_month; j++) {
					var month = i * 100 + j, dispMonth = month;
					var selected = month == d_month ? ' selected' : '';
					// selectorの中身を作成する

					if (f_month == 1) {
						items.push('<option value="' + month + '"' + selected + '>' +
							clutil.monthFormat(dispMonth, 'yyyy/mm') + '</option>');
					} else {
						if (j > 0 && j < 4) {
							dispMonth -= 100;
						}
						items.push('<option value="' + month + '"' + selected + '>' +
							clutil.monthFormat(dispMonth, 'yyyy/mm') + '月度</option>');
					}
				}
				st_month = 1;
				ed_month = i == n_year + n_future - 1 ? n_month : 12;
			}
			if (/^[dD]/.test(sortOrder)) {
				// 降順
				items.reverse();
			}
			if (!_.isEmpty(items)) {
				html_source += items.join('');
			}

			$select.html('');
			$select.html(html_source)
				.selectpicker().selectpicker('refresh');
			// 初期値は運用日
			$select.selectpicker('val', ope_month);
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
		clweekselector: function ($y_select, $w_div,
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
				if (week.type != gsanp_AnaPeriod.GSANP_ANA_PERIOD_TYPE_YW) {
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
				if (i < weeklist.length - 1) {
					pOpe_period = weeklist[i + 1];
				}
				if (pOpe_period != null) {
					pOpe_y = pOpe_period.year;
					pOpe_w = pOpe_period.period;
				}
			}

			// 年selectorの作成
			$.each(week_hash, function (key, value) {
				html_source += '<option value="' + key + '">' +
					key + '年' + '</option>';
			});

			$y_select.html('');
			$y_select.html(html_source);

			//コンボボックス変更時
			$y_select.change(function () {
				html_source = "";
				var year = $y_select.val();
				// 週selectorの作成
				var weeklist = week_hash[year];

				html_source += '<select ';
				$.each(w_option, function (key, value) {
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

				$w_div.find('select').selectpicker().selectpicker('refresh');
				;
			});

			// 初期値は運用日
			$y_select.val(ope_y);
			$y_select.selectpicker();
			$y_select.selectpicker('val', ope_y);

			// 当週、前週を返却
			return {
				ope_y: ope_y,
				ope_w: ope_w,
				pOpe_y: pOpe_y,
				pOpe_w: pOpe_w
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
		getweekdate: function (weeklist, yyyy, ww) {
			var retWeek = {};
			if (weeklist == null || weeklist.length == 0) {
				return retWeek;
			}
			var week_hash = {};

			for (var i = 0; i < weeklist.length; i++) {
				// 年から週リストを取得するハッシュを作成する
				var week = weeklist[i];
				if (week.type != gsanp_AnaPeriod.GSANP_ANA_PERIOD_TYPE_YW) {
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
		 * ・argtext 未使用
		 * ・reverse=true
		 */
		clhalfselector: function ($select, unselectedflag, past, future, argtext, reverse) {
			reverse = reverse !== false;
			unselectedflag = unselectedflag !== false && unselectedflag !== 0;

			var ope_month = clutil.dateFormat(clcom.getOpeDate(), 'yyyymm');
			var n_year = Math.floor(ope_month / 100);
			var n_month = Math.floor(ope_month % 100);
			if (n_month >= 1 && n_month < 4) {
				n_year -= 1;
			}

			// 過去何年から
			var n_past = past == null ? 10 : past;
			// 未来何年まで
			var n_future = future == null ? 0 : future;

			// 半期を設定 4～10 : 1期 11～12,1～3 : 2期
			if (n_month > 3 && n_month < 11) {
				n_month = 1;
			} else {
				n_month = 2;
			}

			var half_1 = n_month;
			var half_2 = 2;
			var labels = ['', '上期', '下期'];
			var items = [];
			for (var i = n_year - n_past; i <= n_year + n_future; i++) {
				// selectorの中身を作成する
				for (var j = half_1; j <= half_2; j++) {
					var half = i * 100 + j;
					// selectorの中身を作成する
					items.push('<option value=' + half + '>' +
						(i + '/' + labels[j]));
				}
				half_1 = 1;
				half_2 = i == n_year + n_future - 1 ? n_month : 2;
			}

			if (reverse) {
				items = items.reverse();
			}

			var html_source = items.join('');
			// 未選択値を追加する
			if (unselectedflag) {
				html_source = '<option value="0">&nbsp</option>' + html_source;
			}

			$select.html(html_source).selectpicker().selectpicker('refresh');
			// 初期値は運用日
			ope_month = n_year * 100 + n_month;
			$select.selectpicker('val', ope_month);
		},

		/**
		 * 半期selectorの作成2
		 * AOKI
		 * 引数
		 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
		 * ・unselectedflag		: 未選択値 0:なし 1:あり
		 * ・past		: 過去何期から defaultは20期
		 * ・future		: 未来何期まで defaultは0期
		 * ・argtext 未使用
		 * ・reverse=true
		 */
		clhalfselector2: function ($select, unselectedflag, past, future, argtext, reverse) {
			reverse = reverse !== false;
			unselectedflag = unselectedflag !== false && unselectedflag !== 0;

			var ope_month = clutil.dateFormat(clcom.getOpeDate(), 'yyyymm');
			var n_year = Math.floor(ope_month / 100);
			var n_month = Math.floor(ope_month % 100);
			if (n_month >= 1 && n_month < 4) {
				n_year -= 1;
			}

			// 過去何期から
			var n_past = past == null ? 20 : past;
			// 未来何期まで
			var n_future = future == null ? 0 : future;

			// 半期を設定 4～9 : 1期 10～12,1～3 : 2期
			if (n_month > 3 && n_month < 10) {
				n_month = 1;
			} else {
				n_month = 2;
			}

			var now_half = (n_year - 1990) * 2 + n_month;	// 今期を通算値にする
			var labels = ['', '上期', '下期'];
			var items = [];
			// 期でループ
			for (var i = now_half - n_past; i <= now_half + n_future; i++) {
				var half_num1 = Math.floor((i - 1) / 2) + 1990;
				var half_num2 = i % 2;
				if (half_num2 == 0) {
					half_num2 = 2;
				}
				var half = half_num1 * 100 + half_num2;
				// selectorの中身を作成する
				items.push('<option value=' + half + '>' +
					(half_num1 + '/' + labels[half_num2]));
			}

			if (reverse) {
				items = items.reverse();
			}

			var html_source = items.join('');
			// 未選択値を追加する
			if (unselectedflag) {
				html_source = '<option value="0">&nbsp</option>' + html_source;
			}

			$select.html(html_source).selectpicker().selectpicker('refresh');
			// 初期値は運用日
			ope_month = n_year * 100 + n_month;
			$select.selectpicker('val', ope_month);
		},

		/**
		 * 半期selectorの作成3
		 * AOKI
		 * 引数
		 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
		 * ・unselectedflag		: 未選択値 0:なし 1:あり
		 * ・from		: 開始半期(YYYY01 or YYYY02)
		 * ・to			: 終了半期(YYYY01 or YYYY02)
		 * ・argtext 未使用
		 * ・reverse=true
		 */
		clhalfselector3: function ($select, unselectedflag, from, to, argtext, reverse) {
			reverse = reverse !== false;
			unselectedflag = unselectedflag !== false && unselectedflag !== 0;

			var ope_month = clutil.dateFormat(clcom.getOpeDate(), 'yyyymm');
			var n_year = Math.floor(ope_month / 100);
			var n_month = Math.floor(ope_month % 100);
			if (n_month >= 1 && n_month < 4) {
				n_year -= 1;
			}
			// 半期を設定 4～9 : 1期 10～12,1～3 : 2期
			if (n_month > 3 && n_month < 10) {
				n_month = 1;
			} else {
				n_month = 2;
			}

			var labels = ['', '上期', '下期'];
			var items = [];
			for (var i = from; i <= to;) {
				var half_num1 = Math.floor(i / 100);
				var half_num2 = i % 100;

				var half = half_num1 * 100 + half_num2;
				items.push('<option value=' + half + '>' +
					(half_num1 + '/' + labels[half_num2]));

				if (half_num2 == 2) {
					half_num2 = 1;
					half_num1++;
				} else {
					half_num2++;
				}
				i = half_num1 * 100 + half_num2;
			}

			if (reverse) {
				items = items.reverse();
			}

			var html_source = items.join('');
			// 未選択値を追加する
			if (unselectedflag) {
				html_source = '<option value="0">&nbsp</option>' + html_source;
			}

			$select.html(html_source).selectpicker().selectpicker('refresh');
			// 初期値は運用日
			ope_month = n_year * 100 + n_month;
			$select.selectpicker('val', ope_month);
		},

		clquarteryearselector: function ($select, unselectedflag, past, future, argtext, reverse) {
			reverse = reverse !== false;
			unselectedflag = unselectedflag !== false && unselectedflag !== 0;

			var ope_month = clutil.dateFormat(clcom.getOpeDate(), 'yyyymm');
			var n_year = Math.floor(ope_month / 100);
			var n_month = Math.floor(ope_month % 100);
			if (n_month >= 1 && n_month < 4) {
				n_year -= 1;
			}

			// 過去何年から
			var n_past = past == null ? 10 : past;
			// 未来何年まで
			var n_future = future == null ? 0 : future;

			// 半期を設定 4～6: 1期, 7〜9 : 2期, 10〜12: 3期, 11～12 ,1～3 : 4期
			if (n_month >= 4 && n_month < 7) {
				n_month = 1;
			} else if (n_month >= 7 && n_month < 10) {
				n_month = 2;
			} else if (n_month >= 10 && n_month < 13) {
				n_month = 3;
			} else if (n_month >= 1 && n_month < 4) {
				n_month = 4;
			}

			var half_1 = n_month;
			var half_2 = 4;

			var items = [];
			for (var i = n_year - n_past; i <= n_year + n_future; i++) {
				// selectorの中身を作成する
				for (var j = half_1; j <= half_2; j++) {
					var half = i * 100 + j;
					// selectorの中身を作成する
					items.push('<option value=' + half + '>' +
						clutil.monthFormat(half, 'yyyy/mm') + '期</option>');
				}
				half_1 = 1;
				half_2 = i == n_year + n_future - 1 ? n_month : 4;
			}

			if (reverse) {
				items = items.reverse();
			}

			var html_source = items.join('');
			// 未選択値を追加する
			if (unselectedflag) {
				html_source = '<option value="0">&nbsp</option>' + html_source;
			}

			$select.html(html_source).selectpicker().selectpicker('refresh');
			// 初期値は運用日
			ope_month = n_year * 100 + n_month;
			$select.selectpicker('val', ope_month);
		},

		/**
		 * 年selectorの作成(形式1)
		 * @method clyearselector
		 * @param [options]
		 * @param {jQuery|String|DOMelement} [options.el]
		 * @param [options.unselectedflag=true] 未選択値(false or 0でなし)
		 * @param [options.past=10] 過去何年から defaultは10年
		 * @param [options.from] 何年から
		 * @param [options.future=0] 未来何年まで defaultは0年
		 * @param [options.argtext=""] 年の後に付けたい文字列(例:"年度")
		 * @param [options.reverse=true] falseで年の昇順に表示する
		 * @param [options.value=運用年] 初期値 falseで設定しない=最初の項目
		 */
		/**
		 * 年selectorの作成(形式2)
		 * AOKI
		 * @method clyearselector
		 * @param $select			区分selectのjQueryオブジェクト (例：$('#viewarea'))
		 * @param unselectedflag		未選択値 0:なし 1:あり
		 * @param past		過去何年から defaultは10年
		 * @param future		未来何年まで defaultは0年
		 * @param argtext		年の後に付けたい文字列(例:"年度")
		 */
		clyearselector: function ($select, unselectedflag, past, future, argtext) {
			var options;
			var ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');

			if ($select instanceof $ || !_.isObject($select)) {
				options = {
					el: $select,
					unselectedflag: unselectedflag,
					past: past,
					future: future,
					argtext: argtext
				};
			} else {
				options = $select;
			}

			_.defaults(options, {
				value: ope_year
			});

			options.$el = options.el instanceof $ ? options.el : $(options.el);
			if (options.reverse !== false) {
				options.reverse = true;
			}
			$select = options.$el;

			var text = (options.argtext == null) ? "" : options.argtext;

			// 過去何年から
			var n_past = options.past == null ? 10 : options.past;
			// 未来何年まで
			var n_future = options.future == null ? 0 : options.future;

			var items = [];
			var from = options.from || ope_year - n_past;
			for (var i = from; i <= ope_year + n_future; i++) {
				items.push('<option value="' + i + '">' + i + text + '</option>');
			}
			if (options.reverse) {
				items = items.reverse();
			}

			// 未選択値を追加する
			var nitem = items.length;
			var fixUnselectFlag = options.unselectedflag;
			if (nitem <= 0) {
				// 要素が無い場合は白牌を追加しておく。
				// [clutil.forceUnselectFlag] に依らない。
				fixUnselectFlag = true;
			} else {
				// 未選択要素を強制するフラグ評価。
				if (clutil.forceUnselectFlag) {
					// 入力必須かつ選択肢が１つの場合は１個で選択固定するので、白牌は追加しない。
					fixUnselectFlag = !($select.hasClass('cl_requied') && nitem == 1);
				}
			}

			var html_source = items.join('');

			if (fixUnselectFlag) {
				html_source = '<option value="0">&nbsp</option>' + html_source;
				nitem++;
			}

			$select.html('');
			$select.html(html_source);

			// bootstrap 適用
			$select.selectpicker().selectpicker('refresh');

			if (nitem <= 1) {
				// TODO: 選択肢が１つまたは無いので、変更できないようにする。
			} else if (options.value !== false) {
				// 初期値は運用日
				$select.selectpicker('val', options.value);
			}
		},

		/**
		 * 年月（ヶ月）selectorの作成
		 * AOKI
		 * 引数
		 * ・$select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
		 * ・unselectedflag		: 未選択値 0:なし 1:あり
		 */
		clymselector: function ($select, unselectedflag) {
			var html_source = '';

			// 何年分
			var n_year = 30;

			// 未選択値を追加する
			if (unselectedflag == 1) {
				html_source += '<option value="0">&nbsp</option>';
			}
			for (var i = 0; i <= n_year; i++) {
				// selectorの中身を作成する
				for (var j = 0; j <= 11; j++) {
					var month = i * 100 + j;
					// selectorの中身を作成する
					html_source += '<option value=' + month + '>';
					html_source += clutil.iymFmt(month) + '</option>';
				}
			}

			$select.html('');
			$select.html(html_source)
				.selectpicker()
				.selectpicker('refresh');
		},

		/**
		 * 全○件中○件表示selectorの作成
		 * AOKI
		 * 引数
		 * ・$viewarea			: divのjQueryオブジェクト (例：$('#viewarea'))
		 * ・totalCount			: 全件数
		 * ・selectVal			: 選択値
		 * ・callback			: select変更時に呼ばれる関数
		 */
		clpagerselector: function ($viewarea, totalCount, selectVal, callback) {
			var html_source = '';

			html_source += '<div class="report-count">全' + totalCount + '件中';
			html_source += '<select name="report-count">';
			html_source += '<option value="10">10</option>';
			html_source += '<option value="20">20</option>';
			html_source += '<option value="50">50</option>';
			html_source += '<option value="100">100</option>';
			html_source += '</select>';
			html_source += '件表示</div>';

			$viewarea.html('');
			$viewarea.html(html_source);

			// 選択値
			selectVal = selectVal == null ? 10 : selectVal;
			$viewarea.find('select').val(selectVal);

			// select変更時のイベントを削除
			$viewarea.undelegate('select', 'change');
			// select変更時のイベント
			$viewarea.delegate('select', 'change', function (ev) {
				var $c = $(ev.currentTarget);
				var value = Number($c.val());
				if (callback != null) {
					// select値を返す
					callback(value);
				}
			});
		},

		/**
		 * 商品属性selectorの作成
		 *
		 * @param $select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
		 * @param iagfuncId			: 商品属性項目定義ID
		 * @param itgrpId			: 対象商品分類ID
		 * @param unselectedflag	: 未選択値 0:なし 1:あり
		 */
		clitemattrselector: function ($select, iagfuncId, itgrpId, unselectedflag) {
			var req = {
				cond: {
					iagfunc_id: iagfuncId,
					itgrp_id: itgrpId
				}
			};
			// データを取得
			var uri = 'am_pa_itemattr_srch';
			return clutil.postJSON(uri, req).then(_.bind(function (data, dataType) {
				console.log("clitemattrselector callback start");
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					var busunitList = data.body.list;

					clutil.cltypeselector2($select, busunitList, unselectedflag,
						null, 'itemattr_id', 'itemattr_name', 'itemattr_code');
				}
				console.log("clitemattrselector callback done");
			}, this));
		},

		/**
		 * 商品属性selectorの作成
		 *
		 * @param $select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
		 * @param iagfuncId			: 商品属性項目定義ID
		 * @param itgrpId			: 対象商品分類ID
		 * @param unselectedflag	: 未選択値 0:なし 1:あり
		 */
		clitemattrselector2: function ($select, iagfuncId, itgrpIds, unselectedflag, ids) {
			itgrpIds = itgrpIds || [];
			var req = {
				cond: {
					iagfunc_id: iagfuncId,
					itgrp_ids: itgrpIds
				}
			};
			// データを取得
			var uri = 'am_pa_itemattr_srchM';
			return clutil.postJSON(uri, req).then(_.bind(function (data, dataType) {
				console.log("clitemattrselector2 callback start");
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					var busunitList = data.body.list;

					clutil.cltypeselector2($select, busunitList, unselectedflag,
						null, 'itemattr_id', 'itemattr_name', 'itemattr_code');
					if (ids) {
						$select.selectpicker('val', ids);
					}
				}
				console.log("clitemattrselector2 callback done");
			}, this));
		},

		/**
		 * 事業ユニットselectorの作成
		 * AOKI
		 * 引数
		 * @param $select			: 区分selectのjQueryオブジェクト (例：$('#viewarea'))
		 * @param unselectedflag	: 未選択値 0:なし 1:あり
		 */
		clbusunitselector: function ($select, unselectedflag) {
			cond = {
				ymd: 20140214	// XXX
			},
				req = {
					cond: cond
				};
			// データを取得
			var uri = 'am_pa_busunit_srch';
			return clutil.postJSON(uri, req).then(_.bind(function (data, dataType) {
				console.log("clbusselector callback start");
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					var busunitList = data.body.list;

					clutil.cltypeselector2($select, busunitList, unselectedflag,
						null,
						'busunit_id', 'busunit_name', 'busunit_code');
				}
				console.log("clbusselector callback done");
			}, this));
		},

		/**
		 * 組織体系コードセレクタ
		 * @param $select : 組織体系セレクタ
		 * @param unselectedflag	: 未選択値 0:なし 1:あり
		 */
		clorgfuncselector: function ($select, unselectedflag) {
			cond = {
				codename: ""
			};
			req = {
				cond: cond
			};
			// データを取得
			var uri = 'am_pa_orgfunc_srch';
			return clutil.postJSON(uri, req).done(_.bind(function (data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					console.log("clorgfuncselector callback start");
					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

						var orgFuncList = data.list;

						clutil.cltypeselector2($select, orgFuncList, unselectedflag,
							null, 'id', 'name', 'code');
					}
					console.log("clorgfuncselector callback done");

				}
			}, this));
		},

		_clorglevelselectorChange: function (e) {
			var $tgt = $(e.target);
			var id = Number($tgt.val());
			var item = null;
			for (var i = 0; i < clutil.orgLevelList.length; i++) {
				var level = clutil.orgLevelList[i];
				if (level.id == id) {
					item = level;
					break;
				}
			}
			clutil.mediator.trigger('onClOrgLevelSelectorChanged', item, e);
		},
		/**
		 * 組織階層コードセレクタ
		 * @param $select : 組織階層セレクタ
		 * @param orgFuncId : 組織体系ID
		 * @param unselectedflag	: 未選択値 0:なし 1:あり
		 */
		clorglevelselector: function ($select, orgFuncId, unselectedflag) {
			var cond = {
				orgfunc_id: orgFuncId,
				codename: ""
			};
			var req = {
				cond: cond
			};
			clutil.orgLevelList = [];

			$select.off("change", clutil._clorglevelselectorChange);
			$select.on("change", clutil._clorglevelselectorChange);

			// データを取得
			var uri = 'am_pa_orglevel_srch';
			if (orgFuncId != 0) {
				return clutil.postJSON(uri, req).done(_.bind(function (data, dataType) {
					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						console.log("clorglevelselector callback start");
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							for (var i = 0; i < data.list.length; i++) {
								var level = data.list[i];
								clutil.orgLevelList.push(level);
							}

							clutil.cltypeselector2($select, clutil.orgLevelList, unselectedflag,
								1, 'id', 'name', 'code');
							if (unselectedflag != 1) {
								$select.trigger('change');
							}
						}
						console.log("clorglevelselector callback done");
					} else {
						clutil.cltypeselector2($select, clutil.orgLevelList, unselectedflag,
							1, 'id', 'name', 'code');
					}
				}, this));
			} else {
				clutil.cltypeselector2($select, clutil.orgLevelList, unselectedflag,
					1, 'id', 'name', 'code');
				return $.Deferred().resolve().promise();
			}
		},

		/**
		 * 商品分類体系コードセレクタ
		 * @param $select : 商品分類体系セレクタ
		 * @param unselectedflag	: 未選択値 0:なし 1:あり
		 */
		clitgrpfuncselector: function ($select, unselectedflag) {
			cond = {
				codename: ""
			};
			req = {
				cond: cond
			};
			// データを取得
			var uri = 'am_pa_itgrpfunc_srch';
			clutil.postJSON(uri, req, _.bind(function (data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					console.log("clitgrpfuncselector callback start");
					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

						var itgrpFuncList = data.list;

						clutil.cltypeselector2($select, itgrpFuncList, unselectedflag,
							null, 'id', 'name', 'code');
					}
					console.log("clitgrpfuncselector callback done");

				}
			}, this));
		},

		/**
		 * 商品分類階層コードセレクタ
		 * @param $select : 商品分類階層セレクタ
		 * @param itgrpFuncId : 商品分類体系ID
		 * @param unselectedflag	: 未選択値 0:なし 1:あり
		 */
		clitgrplevelselector: function ($select, itgrpFuncId, unselectedflag) {
			var cond = {
				itgrpfunc_id: itgrpFuncId,
				codename: ""
			};
			var req = {
				cond: cond
			};
			var itgrpLevelList = [];

			// データを取得
			var uri = 'am_pa_itgrplevel_srch';
			if (itgrpFuncId != 0) {
				clutil.postJSON(uri, req, _.bind(function (data, dataType) {
					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						console.log("clitgrplevelselector callback start");
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							itgrpLevelList = data.list;

							clutil.cltypeselector2($select, itgrpLevelList, unselectedflag,
								1, 'id', 'name', 'code');
						}
						console.log("clitgrplevelselector callback done");
					} else {
						clutil.cltypeselector2($select, itgrpLevelList, unselectedflag,
							1, 'id', 'name', 'code');
					}
				}, this));
			} else {
				clutil.cltypeselector2($select, itgrpLevelList, unselectedflag,
					1, 'id', 'name', 'code');
			}
		},
		/**
		 * 商品分類(品種)コードセレクタ
		 * @param $select : 商品分類(品種)セレクタ
		 * @param parentId : 親商品分類ID
		 * @param unselectedflag	: 未選択値 0:なし 1:あり
		 */
		clvarietyselector: function ($select, itgrpFuncId, parentId, unselectedflag, itgrpIDs, div_sort) {
			var f_div_sort = div_sort ? 1 : 0;
			var cond = {
				itgrpfunc_id: itgrpFuncId,
				parent_id: parentId,
				f_div_sort: f_div_sort,
				codename: ""
			};
			var req = {
				cond: cond
			};
			var varietyList = [];

			// データを取得
			var uri = 'am_pa_variety_srch';
			if (itgrpFuncId && parentId) {
				clutil.postJSON(uri, req, _.bind(function (data, dataType) {
					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						console.log("clvarietyselector callback start");
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							varietyList = data.itgrplist;

							clutil.cltypeselector2($select, varietyList, unselectedflag,
								0, 'itgrp_id', 'name', 'code');
						}
						console.log("clvarietyselector callback done");
					} else {
						clutil.cltypeselector2($select, varietyList, unselectedflag,
							0, 'itgrp_id', 'name', 'code');
					}
					if (itgrpIDs) {
						$select.selectpicker('val', itgrpIDs);
						$select.trigger('change');	// Changeイベントをトリガー
					}
				}, this));
			} else {
				clutil.cltypeselector2($select, varietyList, unselectedflag,
					0, 'id', 'name', 'code');
			}
		},

		/**
		 * サイズパターンコードセレクタ（複数品種バージョン）
		 * @param $select : サイズパターンセレクタ
		 * @param itgrpIDs : 商品分類ID（複数）
		 * @param unselectedflag	: 未選択値 0:なし 1:あり
		 */
		clsizeptnMselector: function ($select, itgrpIDs, unselectedflag) {
			itgrpIDs = (itgrpIDs == null || itgrpIDs.length == 0) ? [] : itgrpIDs;
			var req = {
				cond: {
					itgrp_ids: itgrpIDs,
				}
			};
			var sizepthList = [];

			// データを取得
			var uri = 'am_pa_sizeptn_srchM';
			if (itgrpIDs.length > 0) {
				clutil.postJSON(uri, req, _.bind(function (data, dataType) {
					if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						console.log("clsizeptnMselector callback start");
						var i;
						for (i = 0; i < data.list.length; i++) {
							var obj = {
								id: data.list[i].sizeptn.id,
								code: data.list[i].sizeptn.code,
								name: data.list[i].sizeptn.name
							};
							sizepthList.push(obj);
						}
						clutil.cltypeselector2($select, sizepthList, unselectedflag, 0);
						console.log("clvarietyselector callback done");
					} else {
						clutil.cltypeselector2($select, sizepthList, unselectedflag, 0);
					}
				}, this));
			} else {
				clutil.cltypeselector2($select, sizepthList, unselectedflag, 0);
			}
		},

		/**
		 * サイズ行セレクタ
		 * @param $select : サイズ行セレクタ
		 * @param sizePtnId : サイズパターンID
		 * @param unselectedflag	: 未選択値 0:なし 1:あり
		 */
		clsizerowselector: function ($select, sizePtnId, unselectedflag) {
			var cond = {
				sizeptn_id: sizePtnId
			};
			var req = {
				cond: cond
			};
			var sizeRowList = [];

			// データを取得
			var uri = 'am_pa_sizerow_srch';
			if (sizePtnId != 0) {
				clutil.postJSON(uri, req, _.bind(function (data, dataType) {
					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						console.log("clsizerowselector callback start");
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							sizeRowList = data.list;

							clutil.cltypeselector2($select, sizeRowList, unselectedflag,
								1, 'row', 'name');
						}
						console.log("clitgrplevelselector callback done");
					} else {
						clutil.cltypeselector2($select, sizeRowList, unselectedflag,
							1, 'id', 'name');
					}
				}, this));
			} else {
				clutil.cltypeselector2($select, itgrpLevelList, unselectedflag,
					1, 'id', 'name', 'code');
			}
		},

		/**
		 * 客層セレクタ #20160219
		 * @param $select : 客層セレクタ
		 * @param unitId : 事業ユニットID
		 * @param unselectedflag	: 未選択値 0:なし 1:あり
		 */
		clmarkettypeselector: function ($select, unitId, unselectedflag) {
			var cond = {
				unit_id: unitId
			};
			var req = {
				cond: cond
			};
			var markettypeList = [];

			// データを取得
			var uri = 'am_pa_markettype_srch';
			if (unitId != 0) {
				clutil.postJSON(uri, req, _.bind(function (data, dataType) {
					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						console.log("clmarkettypeselector callback start");
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							markettypeList = data.list;

							clutil.cltypeselector2($select, markettypeList, unselectedflag);
						}
						console.log("clmarkettypeselector callback done");
					} else {
						clutil.cltypeselector2($select, markettypeList, unselectedflag);
					}
				}, this));
			}
		},

		/**
		 * 年代セレクタ #20160219
		 * @param $select : 年代セレクタ
		 * @param unitId : 事業ユニットID
		 * @param unselectedflag	: 未選択値 0:なし 1:あり
		 */
		clagetypeselector: function ($select, unitId, unselectedflag) {
			var cond = {
				unit_id: unitId
			};
			var req = {
				cond: cond
			};
			var agetypeList = [];

			// データを取得
			var uri = 'am_pa_agetype_srch';
			if (unitId != 0) {
				clutil.postJSON(uri, req, _.bind(function (data, dataType) {
					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						console.log("clagetypeselector callback start");
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							agetypeList = data.list;

							clutil.cltypeselector2($select, agetypeList, unselectedflag);
						}
						console.log("clagetypeselector callback done");
					} else {
						clutil.cltypeselector2($select, agetypeList, unselectedflag);
					}
				}, this));
			}
		},

		/**
		 * 備品コードオートコンプリートの作成
		 * @todo スタブです。正しく実装されていません。optの必須属性は変更になります。
		 * @param $view 備品コードinputのjQueryオブジェクト(例: $("#ca_equipID"))
		 * @param opt オートコンプリートへのオプション。
		 */
		clequipcode: function ($view, opt) {
			var option = $.extend({
				getUnitId: function () {
					return 0;	// 事業ユニット
				},
				getEquipManTypeId: function () {
					return 0;
				},
				//				change: function(event, ui) {	// 変更時はcs_id属性に備品取引先IDを設定する
				//				var $target = $(event.target);
				//				if (ui.item && ui.item.id){
				//				$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//				} else {
				//				$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//				}
				//				},
				//				source: [
				//				{id: 1, code: '0001', name: 'name1', label: '0001:name1'},
				//				{id: 2, code: '0002', name: 'name2', label: '0002:name2'},
				//				{id: 3, code: '0003', name: 'name3', label: '0003:name3'},
				//				{id: 4, code: '0004', name: 'name4', label: '0004:name4'},
				//				{id: 5, code: '0005', name: 'name5', label: '0005:name5'}
				//				]
				source: function (request, response) {
					var unit_id = this.options.getUnitId();
					var equip_man_typeid = this.options.getEquipManTypeId();
					var cond = {
						unit_id: unit_id,
						equip_man_typeid: equip_man_typeid,
						codename: request.term
					};
					var req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_equip_srch';
					clutil.postJSON(uri, req, _.bind(function (data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							this.equipList = [];
							for (var i = 0; i < data.list.length; i++) {
								var val = {
									label: data.list[i].equip_code + ":" + data.list[i].equip_name,
									value: data.list[i].equip_code + ":" + data.list[i].equip_name,
									id: data.list[i].equip_id,
									code: data.list[i].equip_code,
									name: data.list[i].equip_name
								};
								this.equipList.push(val);
							}
							response(this.equipList);
						}
					}, this));
				}
			}, opt || {});
			$view.autocomplete(option);
		},

		/**
		 * 備品取引先コードオートコンプリートの作成
		 * @param $view		: 備品取引先コードinputのjQueryオブジェクト（例：$("#ca_equipVendID")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getUnitId()を実装すること
		 */
		clequipvendcode: function ($view, opt) {
			var option = $.extend({
				getUnitId: function () {
					return 0;	// 事業ユニット
				},
				//				select: function(event, ui){
				//	var item = (ui.item) ? ui.item : null;
				//				$(event.target).autocomplete('clAutocompleteItem', item);
				//				},
				//				change: function(event, ui) {	// 変更時はcs_id属性に備品取引先IDを設定する
				//				var $target = $(event.target);
				//				if (ui.item && ui.item.id){
				//				$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//				} else {
				//				$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//				}
				//				},
				source: function (request, response) {
					var unit_id = this.options.getUnitId();
					var cond = {
						unit_id: unit_id,
						codename: request.term
					};
					var req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_equipvend_srch';
					clutil.postJSON(uri, req, _.bind(function (data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							this.equipList = [];
							for (var i = 0; i < data.list.length; i++) {
								var val = {
									label: data.list[i].equipvend_code + ":" + data.list[i].equipvend_name,
									value: data.list[i].equipvend_code + ":" + data.list[i].equipvend_name,
									id: data.list[i].equipvend_id,
									code: data.list[i].equipvend_code,
									name: data.list[i].equipvend_name
								};
								this.equipList.push(val);
							}
							response(this.equipList);
						}
					}, this));
				}
			}, opt || {});
			$view.autocomplete(option);
		},


		/**
		 * 取引先コードオートコンプリートの作成
		 * @param $view		: 取引先コードinputのjQueryオブジェクト（例：$("#ca_vendor_id")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getVendorId()を実装すること
		 */
		clvendorcode: function ($view, opt) {
			var option = $.extend({
				getVendorTypeId: function () {
					// 取引先区分取得メソッドを実装する
					return 0;
				},
				//				select: function(event, ui){
				//				var item = (ui.item) ? ui.item : null;
				//				$(event.target).autocomplete('clAutocompleteItem', item, 1);
				//				},
				//				change: function(event, ui) {	// 変更時はcs_id属性に取引先IDを設定する
				//				var $target = $(event.target);
				//				if (ui.item && ui.item.id){
				//				$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//				} else {
				//				$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//				}
				//				},
				source: function (request, response) {
					var vendor_typeid = this.options.getVendorTypeId();
					cond = {
						vendor_typeid: vendor_typeid,
						codename: request.term
					};
					req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_vendor_srch';
					clutil.postJSON(uri, req, _.bind(function (data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							this.vendorList = [];
							for (var i = 0; i < data.list.length; i++) {
								var val = {
									label: data.list[i].vendor_code + ":" + data.list[i].vendor_name,
									value: data.list[i].vendor_code + ":" + data.list[i].vendor_name,
									id: data.list[i].vendor_id,
									code: data.list[i].vendor_code,
									name: data.list[i].vendor_name,
								};
								this.vendorList.push(val);
							}
							response(this.vendorList);
						}
					}, this));
				}
			}, opt || {});
			$view.autocomplete(option);
		},
		/**
		 * 品種コードオートコンプリートの作成
		 * @param $view		: 品種コードinputのjQueryオブジェクト（例：$("#ca_stditgrp_id")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getParentId()を実装すること
		 */
		clvarietycode: function ($view, opt) {
			var option = $.extend({
				getParentId: function () {
					// 親ID（事業ユニットID）取得メソッドを実装する
					return 0;
				},
				//				select: function(event, ui){
				//				var item = (ui.item) ? ui.item : null;
				//				$(event.target).autocomplete('clAutocompleteItem', item);
				//				},
				//				change: function(event, ui) {	// 変更時はcs_id属性に取引先IDを設定する
				//				var $target = $(event.target);
				//				if (ui.item && ui.item.id){
				//				$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//				} else {
				//				$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//				}
				//				},
				source: function (request, response) {
					var parent_id = this.options.getParentId();
					cond = {
						parent_id: parent_id,
						codename: request.term
					};
					req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_variety_srch';
					clutil.postJSON(uri, req, _.bind(function (data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							this.varietyList = [];
							for (var i = 0; i < data.itgrplist.length; i++) {
								var val = {
									label: data.itgrplist[i].code + ":" + data.itgrplist[i].name,
									value: data.itgrplist[i].code + ":" + data.itgrplist[i].name,
									id: data.itgrplist[i].itgrp_id,
									code: data.itgrplist[i].code,
									name: data.itgrplist[i].name
								};
								this.varietyList.push(val);
							}
							response(this.varietyList);
						}
					}, this));
				}
			}, opt || {});
			$view.autocomplete(option);
		},
		/**
		 * メーカー品番コードオートコンプリートの作成
		 * @param $view		: メーカーコードinputのjQueryオブジェクト（例：$("#ca_item_id")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getParentId()を実装すること
		 */
		clmakeritemcode: function ($view, opt) {
			/*
			 * TODO メーカー品番テスト用スタブ
			 */
			var makerItemCodeList = [
				{
					label: "3A-1252:２ＷＬＭＳＰＸＰストレッチ２Ｐ",
					value: "3A-1252:２ＷＬＭＳＰＸＰストレッチ２Ｐ",
					id: 1001,
					code: "3A-1252",
					name: "２ＷＬＭＳＰＸＰストレッチ２Ｐ"
				},
				{
					label: "M1323151:３ＷＭＪ黒Ｐストレッチ２Ｐ",
					value: "M1323151:３ＷＭＪ黒Ｐストレッチ２Ｐ",
					id: 1002,
					code: "M1323151",
					name: "３ＷＭＪ黒Ｐストレッチ２Ｐ"
				},
				{
					label: "V1922160:１１ＳＳＭＦＧＰＷ２ＰＡＮ黒縞",
					value: "V1922160:１１ＳＳＭＦＧＰＷ２ＰＡＮ黒縞",
					id: 1003,
					code: "V1922160",
					name: "１１ＳＳＭＦＧＰＷ２ＰＡＮ黒縞"
				},
				{
					label: "4812221:８ＳＲＣ２Ｂ２Ｐサマー",
					value: "4812221:８ＳＲＣ２Ｂ２Ｐサマー",
					id: 1004,
					code: "M1323151",
					name: "８ＳＲＣ２Ｂ２Ｐサマー"
				},
				{
					label: "509200A:１０ＳＡＦＯＲＴＵＮＡ２Ｂ２Ｐ",
					value: "509200A:１０ＳＡＦＯＲＴＵＮＡ２Ｂ２Ｐ",
					id: 1005,
					code: "509200A",
					name: "１０ＳＡＦＯＲＴＵＮＡ２Ｂ２Ｐ"
				},
				{
					label: "509201A:１０ＳＡＦＯＲＴＵＮＡ２Ｂ２Ｐ",
					value: "509201A:１０ＳＡＦＯＲＴＵＮＡ２Ｂ２Ｐ",
					id: 1006,
					code: "509201A",
					name: "１０ＳＡＦＯＲＴＵＮＡ２Ｂ２Ｐ"
				},
				{
					label: "3C-1256:２ＷＬＭＳＰＰストレッチ２パン",
					value: "3C-1256:２ＷＬＭＳＰＰストレッチ２パン",
					id: 1007,
					code: "3C-1256",
					name: "２ＷＬＭＳＰＰストレッチ２パン"
				},
				{
					label: "M1223162:２ＷＭＪ白Ｐストレッチ２Ｂ２Ｐ",
					value: "M1223162:２ＷＭＪ白Ｐストレッチ２Ｂ２Ｐ",
					id: 1008,
					code: "M1223162",
					name: "２ＷＭＪ白Ｐストレッチ２Ｂ２Ｐ"
				},
				{
					label: "M1223163:２ＷＭＪ白Ｐストレッチ２Ｂ２Ｐ",
					value: "M1223163:２ＷＭＪ白Ｐストレッチ２Ｂ２Ｐ",
					id: 1009,
					code: "M1223163",
					name: "２ＷＭＪ白Ｐストレッチ２Ｂ２Ｐ"
				}
			];
			var option = $.extend({
				getMakerId: function () {
					// メーカーID（取引先ID）取得メソッドを実装する
					return 0;
				},
				//				select: function(event, ui){
				//					var item = (ui.item) ? ui.item : null;
				//					$(event.target).autocomplete('clAutocompleteItem', item);
				//				},
				//				change: function(event, ui) {	// 変更時はcs_id属性に取引先IDを設定する
				//					var $target = $(event.target);
				//					if (ui.item && ui.item.id){
				//						$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//					} else {
				//						$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//					}
				//				},
				/* =================================================================================
				source:function(request, response) {
					var parent_id = this.options.getParentId();
					cond = {
						parent_id: parent_id,
						codename: request.term
					};
					req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_variety_srch';
					clutil.postJSON(uri, req, _.bind(function(data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							this.varietyList = [];
							for (var i = 0; i < data.list.length; i++) {
								var val = {
									label: data.list[i].code + ":" + data.list[i].name,
									value: data.list[i].code + ":" + data.list[i].name,
									id: data.list[i].itgrp_id,
									code: data.list[i].code,
									name: data.list[i].name
								};
								this.varietyList.push(val);
							}
							response(this.varietyList);
						}
					}, this));
				}
				//================================================================================= */
				source: makerItemCodeList	// TODO とりあえず固定
			}, opt || {});
			$view.autocomplete(option);
		},
		/**
		 * 商品属性コードオートコンプリートの作成
		 * @param $view		: メーカーコードinputのjQueryオブジェクト（例：$("#ca_coloritem_id")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getIAGFuncId()を実装すること
		 */
		clitemattrgrpcode: function ($view, opt) {
			/*
			 * TODO メーカー品番テスト用スタブ
			 */
			var itemAttrGrpCodeList = [
				{
					label: "00:紺",
					value: "00:紺",
					id: 11,
					code: "00",
					name: "紺",
				},
				{
					label: "01:ブルー",
					value: "01:ブルー",
					id: 12,
					code: "01",
					name: "ブルー",
				},
				{
					label: "02:グレー",
					value: "02:グレー",
					id: 13,
					code: "02",
					name: "グレー",
				},
				{
					label: "03:ベージュ",
					value: "03:ベージュ",
					id: 14,
					code: "03",
					name: "ベージュ",
				},
				{
					label: "04:茶",
					value: "02:茶",
					id: 15,
					code: "04",
					name: "茶",
				},
				{
					label: "05:白",
					value: "05:白",
					id: 16,
					code: "05",
					name: "白",
				},
			];
			var option = $.extend({
				getIAGFuncId: function () {
					// 商品属性項目定義ID取得メソッドを実装する
					return 0;
				},
				//				select: function(event, ui){
				//					var item = (ui.item) ? ui.item : null;
				//					$(event.target).autocomplete('clAutocompleteItem', item);
				//				},
				//				change: function(event, ui) {	// 変更時はcs_id属性に取引先IDを設定する
				//					var $target = $(event.target);
				//					if (ui.item && ui.item.id){
				//						$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//					} else {
				//						$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//					}
				//				},
				/* =================================================================================
				source:function(request, response) {
					var parent_id = this.options.getParentId();
					cond = {
							parent_id: parent_id,
							codename: request.term,
					};
					req = {
							cond: cond,
					};
					// データを取得
					var uri = 'am_pa_variety_srch';
					clutil.postJSON(uri, req, _.bind(function(data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							this.varietyList = [];
							for (var i = 0; i < data.list.length; i++) {
								var val = {
									label: data.list[i].code + ":" + data.list[i].name,
									value: data.list[i].code + ":" + data.list[i].name,
									id: data.list[i].itgrp_id,
									code: data.list[i].code,
									name: data.list[i].name
								};
								this.varietyList.push(val);
							}
							response(this.varietyList);
						}
					}, this));
				}
				//================================================================================= */
				source: itemAttrGrpCodeList		// TODO とりあえず固定
			}, opt || {});
			$view.autocomplete(option);
		},
		/**
		 * カラーコードオートコンプリートの作成
		 * @param $view		: メーカーコードinputのjQueryオブジェクト（例：$("#ca_color_id")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getItemId()を実装すること
		 */
		clcolorcode: function ($view, opt) {
			/*
			 * TODO カラーテスト用スタブ
			 */
			var colorList = [
				{
					label: "00:紺",
					value: "00:紺",
					id: 11,
					code: "00",
					name: "紺",
				},
				{
					label: "01:ブルー",
					value: "01:ブルー",
					id: 12,
					code: "01",
					name: "ブルー",
				},
				{
					label: "02:グレー",
					value: "02:グレー",
					id: 13,
					code: "02",
					name: "グレー",
				},
				{
					label: "03:ベージュ",
					value: "03:ベージュ",
					id: 14,
					code: "03",
					name: "ベージュ",
				},
				{
					label: "04:茶",
					value: "02:茶",
					id: 15,
					code: "04",
					name: "茶",
				},
				{
					label: "05:白",
					value: "05:白",
					id: 16,
					code: "05",
					name: "白",
				},
			];
			var option = $.extend({
				getItemId: function () {
					// 商品ID取得メソッドを実装する
					return 0;
				},
				//				select: function(event, ui){
				//					var item = (ui.item) ? ui.item : null;
				//					$(event.target).autocomplete('clAutocompleteItem', item);
				//				},
				//				change: function(event, ui) {	// 変更時はcs_id属性に取引先IDを設定する
				//					var $target = $(event.target);
				//					if (ui.item && ui.item.id){
				//						$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//					} else {
				//						$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//					}
				//				},
				/* =================================================================================
				source:function(request, response) {
					var item_id = this.options.getItemId();
					cond = {
							item_id: item_id,
							codename: request.term,
					};
					req = {
							cond: cond,
					};
					// データを取得
					var uri = 'am_pa_variety_srch';
					clutil.postJSON(uri, req, _.bind(function(data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							this.varietyList = [];
							for (var i = 0; i < data.list.length; i++) {
								var val = {
									label: data.list[i].code + ":" + data.list[i].name,
									value: data.list[i].code + ":" + data.list[i].name,
									id: data.list[i].itgrp_id,
									code: data.list[i].code,
									name: data.list[i].name
								};
								this.varietyList.push(val);
							}
							response(this.varietyList);
						}
					}, this));
				}
				//================================================================================= */
				source: colorList		// TODO とりあえず固定
			}, opt || {});
			$view.autocomplete(option);
		},
		/**
		 * サイズコードオートコンプリートの作成
		 * @param $view		: サイズコードinputのjQueryオブジェクト（例：$("#ca_size_id")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getIAGFuncId()を実装すること
		 */
		clsizecode: function ($view, opt) {
			/*
			 * TODO カラーテスト用スタブ
			 */
			var sizeList = [
				{
					label: "42:A4",
					value: "42:A4",
					id: 555,
					code: "42",
					name: "A4",
				},
				{
					label: "66:A5",
					value: "66:A5",
					id: 556,
					code: "66",
					name: "A5",
				},
				{
					label: "32:A6",
					value: "32:A6",
					id: 557,
					code: "32",
					name: "A6",
				},
			];
			var option = $.extend({
				getItemId: function () {
					// 商品ID取得メソッドを実装する
					return 0;
				},
				getColorId: function () {
					// カラーID取得メソッドを実装する
					return 0;
				},
				//				select: function(event, ui){
				//					var item = (ui.item) ? ui.item : null;
				//					$(event.target).autocomplete('clAutocompleteItem', item);
				//				},
				//				change: function(event, ui) {	// 変更時はcs_id属性に取引先IDを設定する
				//					var $target = $(event.target);
				//					if (ui.item && ui.item.id){
				//						$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//					} else {
				//						$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//					}
				//				},
				/* =================================================================================
				source:function(request, response) {
					var item_id = this.options.getItemId();
					var color_id = this.options.getColorId();
					cond = {
						item_id: item_id,
						color_id: color_id,
						codename: request.term
					};
					req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_variety_srch';
					clutil.postJSON(uri, req, _.bind(function(data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							this.varietyList = [];
							for (var i = 0; i < data.list.length; i++) {
								var val = {
									label: data.list[i].code + ":" + data.list[i].name,
									value: data.list[i].code + ":" + data.list[i].name,
									id: data.list[i].itgrp_id,
									code: data.list[i].code,
									name: data.list[i].name
								};
								this.varietyList.push(val);
							}
							response(this.varietyList);
						}
					}, this));
				}
				//================================================================================= */
				source: sizeList		// TODO とりあえず固定
			}, opt || {});
			$view.autocomplete(option);
		},

		/**
		 * 商品分類体系コードオートコンプリートの作成
		 * @param $view		: 商品分類体系コードinputのjQueryオブジェクト（例：$("#ca_srchFuncID")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getItemId()を実装すること
		 */
		clitgrpfunccode: function ($view, opt) {
			var option = $.extend({
				varietyList: [],
				//				select: function(event, ui){
				//					var item = (ui.item) ? ui.item : null;
				//					$(event.target).autocomplete('clAutocompleteItem', item);
				//				},
				//				change: function(event, ui) {
				//					var $target = $(event.target);
				//					if (ui.item && ui.item.id){
				//						$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//					} else if (varietyList != null && varietyList.length == 1) {
				//						console.log(varietyList);
				//						$target.attr('cs_id', varietyList[0].id).data('cl_autocomplete_item', varietyList[0]);
				//					} else {
				//						$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//					}
				//				},
				getSrchYmd: function () {
					// マスタ検索日
					return clcom.getOpeDate();
				},
				source: function (request, response) {
					var cond = {
						srchYmd: this.options.getSrchYmd(),
						codename: request.term
					};
					var req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_itgrpfunc_srch';
					clutil.postJSON(uri, req, _.bind(function (data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							varietyList = [];
							for (var i = 0; i < data.list.length; i++) {
								var val = {
									label: data.list[i].code + ":" + data.list[i].name,
									value: data.list[i].code + ":" + data.list[i].name,
									id: data.list[i].id,
									code: data.list[i].code,
									name: data.list[i].name
								};
								varietyList.push(val);
							}
							response(varietyList);
						}
					}, this));
				},
			}, opt || {});
			$view.autocomplete(option);
		},

		/**
		 * 商品分類階層オートコンプリートの作成
		 * @param $view		: 商品分類階層inputのjQueryオブジェクト（例：$("#ca_srchLevelID")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getItgrpFuncId()を実装すること
		 */
		clitgrplevel: function ($view, opt) {
			var option = $.extend({
				/**
				 * 商品分類体系IDを返すメソッドを実装する
				 * @returns {Number} 商品分類体系ID
				 */
				getItgrpFuncId: function () {
					return 0;
				},
				//				select: function(event, ui){
				//					var item = (ui.item) ? ui.item : null;
				//					$(event.target).autocomplete('clAutocompleteItem', item);
				//				},
				//				change: function(event, ui) {
				//					var $target = $(event.target);
				//					if (ui.item && ui.item.id){
				//						$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//					} else {
				//						$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//					}
				//				},
				getSrchYmd: function () {
					// マスタ検索日
					return clcom.getOpeDate();
				},
				source: function (request, response) {
					var itgrpfunc_id = this.options.getItgrpFuncId();
					cond = {
						srchYmd: this.options.getSrchYmd(),
						itgrpfunc_id: itgrpfunc_id,
						codename: request.term
					};
					req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_itgrplevel_srch';
					clutil.postJSON(uri, req, _.bind(function (data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							this.itgrpLevelList = [];
							for (var i = 0; i < data.list.length; i++) {
								var val = {
									label: data.list[i].code + ":" + data.list[i].name,
									value: data.list[i].code + ":" + data.list[i].name,
									id: data.list[i].id,
									code: data.list[i].code,
									name: data.list[i].name,
									itgrpfunc_id: data.list[i].itgrpfunc_id,
									itgrplevel_level: data.list[i].itgrplevel_level,
									itgrplevel_typeid: data.list[i].itgrplevel_typeid,
									p_id: data.list[i].p_id,
									p_orglevel_level: data.list[i].p_itgrplevel_level
								};
								this.itgrpLevelList.push(val);
							}
							response(this.itgrpLevelList);
						}
					}, this));
				},
			}, opt || {});
			$view.autocomplete(option);
		},

		/**
		 * 商品分類コードオートコンプリートの作成
		 * @param $view		: 商品分類コードinputのjQueryオブジェクト（例：$("#ca_srchItgrpID")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getItgrpFuncId(),getItgrpLevelId()を実装すること
		 */
		clitgrpcode: function ($view, opt) {
			var option = $.extend({
				/**
				 * 商品分類体系IDを返すメソッドを実装する
				 * @returns {Number} 商品分類体系ID
				 */
				getItgrpFuncId: function () {
					return 0;
				},
				getSrchYmd: function () {
					// マスタ検索日
					return clcom.getOpeDate();
				},
				/**
				 * 商品分類階層IDを返すメソッドを実装する
				 * @returns {Number} 商品分類階層ID
				 */
				getItgrpLevelId: function () {
					return 0;
				},
				//				select: function(event, ui){
				//					var item = (ui.item) ? ui.item : null;
				//					$(event.target).autocomplete('clAutocompleteItem', item);
				//				},
				//				change: function(event, ui) {
				//					var $target = $(event.target);
				//					if (ui.item && ui.item.id){
				//						$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//					} else {
				//						$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//					}
				//				},
				source: function (request, response) {
					var itgrpfunc_id = this.options.getItgrpFuncId();
					var itgrplevel_id = this.options.getItgrpLevelId();
					var cond = {
						srchYmd: this.options.getSrchYmd(),
						itgrpfunc_id: itgrpfunc_id,
						itgrplevel_id: itgrplevel_id,
						codename: request.term
					};
					var req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_itgrp_srch';
					clutil.postJSON(uri, req, _.bind(function (data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							this.itgrpList = [];
							for (var i = 0; i < data.list.length; i++) {
								var dl = data.list[i];
								var val = {
									label: dl.code + ":" + dl.name,
									value: dl.code + ":" + dl.name,
									id: dl.id,
									code: dl.code,
									name: dl.name,
									itgrpfunc_id: dl.itgrpfunc_id,
									itgrplevel_level: dl.itgrplevel_level,
									itgrplevel_id: dl.itgrplevel_id
								};
								this.itgrpList.push(val);
							}
							response(this.itgrpList);
						}
					}, this));
				},
			}, opt || {});
			$view.autocomplete(option);
		},

		/**
		 * 組織体系コードオートコンプリートの作成
		 * @param $view		: 組織体系コードinputのjQueryオブジェクト（例：$("#ca_srchFuncID")）
		 * @param opt		: オートコンプリートへのオプション。
		 */
		clorgfunccode: function ($view, opt) {
			var option = $.extend({
				//				select: function(event, ui){
				//					var item = (ui.item) ? ui.item : null;
				//					$(event.target).autocomplete('clAutocompleteItem', item);
				//				},
				//				change: function(event, ui) {
				//					var $target = $(event.target);
				//					if (ui.item && ui.item.id){
				//						$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//					} else {
				//						$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//					}
				//				},

				getSrchYmd: function () {
					// マスタ検索日
					return clcom.getOpeDate();
				},
				source: function (request, response) {
					cond = {
						srchYmd: this.options.getSrchYmd(),
						codename: request.term
					};
					req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_orgfunc_srch';
					clutil.postJSON(uri, req, _.bind(function (data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							this.orgFuncList = [];
							for (var i = 0; i < data.list.length; i++) {
								var val = {
									label: data.list[i].code + ":" + data.list[i].name,
									value: data.list[i].code + ":" + data.list[i].name,
									id: data.list[i].id,
									code: data.list[i].code,
									name: data.list[i].name
								};
								this.orgFuncList.push(val);
							}
							response(this.orgFuncList);
						}
					}, this));
				},
			}, opt || {});
			$view.autocomplete(option);
		},

		/**
		 * 組織階層オートコンプリートの作成
		 * @param $view		: 組織階層inputのjQueryオブジェクト（例：$("#ca_srchLevelID")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getOrgFuncId()を実装すること
		 */
		clorglevel: function ($view, opt) {
			var getLabel = function (item) {
				return (item && item.name) ? item.name : '';
			};
			var option = $.extend({
				// ラベル表記を構成するプロパティ
				getLabel: getLabel,
				/**
				 * 組織体系IDを返すメソッドを実装する
				 * @returns {Number} 組織体系ID
				 */
				getOrgFuncId: function () {
					return 0;
				},
				//				select: function(event, ui){
				//					var item = (ui.item) ? ui.item : null;
				//					$(event.target).autocomplete('clAutocompleteItem', item);
				//				},
				//				change: function(event, ui) {
				//					var $target = $(event.target);
				//					if (ui.item && ui.item.id){
				//						$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//					} else {
				//						$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//					}
				//				},
				source: function (request, response) {
					var orgfunc_id = this.options.getOrgFuncId();
					cond = {
						orgfunc_id: orgfunc_id,
						codename: request.term
					};
					req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_orglevel_srch';
					clutil.postJSON(uri, req, _.bind(function (data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							this.orgLevelList = [];
							for (var i = 0; i < data.list.length; i++) {
								var val = {
									label: getLabel(data.list[i]),
									value: data.list[i].name,
									id: data.list[i].id,
									code: data.list[i].code,
									name: data.list[i].name,
									orgfunc_id: data.list[i].orgfunc_id,
									orglevel_level: data.list[i].orglevel_level,
									orglevel_typeid: data.list[i].orglevel_typeid,
									p_id: data.list[i].p_id,
									p_orglevel_level: data.list[i].p_orglevel_level
								};
								this.orgLevelList.push(val);
							}
							response(this.orgLevelList);
						}
					}, this));
				},
			}, opt || {});
			$view.autocomplete(option);
		},

		/**
		 * 組織コードオートコンプリートの作成
		 * @param $view		: 組織コードinputのjQueryオブジェクト（例：$("#ca_srchOrgID")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getOrgFuncId(),getOrgLevelId()を実装すること
		 */
		clorgcode: function ($view, opt) {
			var option = $.extend({
				/**
				 * 商品分類体系IDを返すメソッドを実装する
				 * @returns {Number} 商品分類体系ID
				 */
				getOrgFuncId: function () {
					return 0;
				},
				/**
				 * 商品分類階層IDを返すメソッドを実装する
				 * @returns {Number} 商品分類階層ID
				 */
				getOrgLevelId: function () {
					return 0;
				},
				//				select: function(event, ui){
				//					var item = (ui.item) ? ui.item : null;
				//					$(event.target).autocomplete('clAutocompleteItem', item);
				//				},
				//				change: function(event, ui) {
				//					var $target = $(event.target);
				//					if (ui.item && ui.item.id){
				//						$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
				//					} else {
				//						$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
				//					}
				//				},
				source: function (request, response) {
					var orgfunc_id = this.options.getOrgFuncId();
					var orglevel_id = this.options.getOrgLevelId();
					cond = {
						orgfunc_id: orgfunc_id,
						orglevel_id: orglevel_id,
						codename: request.term
					};
					req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_org_srch';
					clutil.postJSON(uri, req, _.bind(function (data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							this.orgList = [];
							for (var i = 0; i < data.list.length; i++) {
								var dl = data.list[i];
								var parentList = [];
								for (var j = 0; j < dl.parentList.length; j++) {
									var pl = dl.parentList[j];
									var pval = {
										id: pl.id,
										code: pl.code,
										name: pl.name,
										orgfunc_id: pl.orgfunc_id,
										orglevel_level: pl.orglevel_level,
										orglevel_id: pl.orglevel_id
									};
									parentList.push(pval);
								}
								var val = {
									label: dl.code + ":" + dl.name,
									value: dl.code + ":" + dl.name,
									id: dl.id,
									code: dl.code,
									name: dl.name,
									orgfunc_id: dl.orgfunc_id,
									orglevel_level: dl.orglevel_level,
									orglevel_id: dl.orglevel_id,
									parentList: parentList
								};
								this.orgList.push(val);
							}
							response(this.orgList);
						}
					}, this));
				},
			}, opt || {});
			$view.autocomplete(option);
		},

		/**
		 * ユーザーコード→ユーザーID、名称取得
		 *
		 * ※ clusercode2を使用してください。
		 *
		 * 入力されたコードを検証するためにこの部品はクラスにcl_validを
		 * 追加します。
		 *
		 * イベント
		 * - change item
		 *	 itemは未社員確定時にはnull
		 *
		 *	 ※ 入力コードが変更されているときに発生する。
		 *
		 * @method clstaffcode
		 * @deprecated
		 * @for clutil
		 * @param {jQuery} $view
		 * @param {Object} [options]
		 * @return {Backbone.Events}
		 */
		clusercode: function ($view) {
			var vent = new clutil.EventAggregator();

			var setCode = function (code, item) {
				if (!item) {
					// 短いので何もしない
					$view.attr('cs_id', 0).removeData('cl_codeinput_item');
				} else {
					// IDは'cs_id'にセット
					$view.attr('cs_id', item.id);
					$view.data('cl_codeinput_item', {
						id: item.id,
						code: item.code,
						name: item.name
					});
				}
				vent.trigger("change", item || null);
				clutil.mediator.trigger("validation:require", $view);
			};

			$view.addClass("cl_valid_auto_off").change(function (e) {
				var $target = $(e.target);
				var code = $target.val();
				// 入力されたコードの長さを確認
				if (code == null || code.length < 6) {
					// 短いので何もしない
					setCode(code);
					return false;
				};
				var reqHead = {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				};
				var req = {
					reqHead: reqHead,
					code: code
				};
				var uri = "am_pa_user_srch";
				clutil.postJSON(uri, req, _.bind(function (data, dataType) {
					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						if (data.list == null || data.list.length != 1) {
							setCode(code);
							return false;
						}
						var item = data.list[0];
						setCode(code, item);
					}

				}, this));
			});
			// cl_codeinputでいいかな
			$view.addClass('cl_codeinput').addClass('cl_codeonly');
		},

		/**
		 * ユーザーコード→ユーザーID、名称取得
		 *
		 * 入力されたコードを検証するためにこの部品はクラスにcl_validを
		 * 追加します。
		 *
		 * イベント
		 * - change item
		 *	 itemは未確定時にはnull
		 *
		 *	 ※ 入力コードが変更されているときに発生する。
		 *
		 * @method clusercode2
		 * @for clutil
		 * @param {jQuery} $view
		 * @param {Object} [options]
		 * @return {Backbone.Events}
		 */
		clusercode2: function ($view, options) {
			options || (options = {});
			var vent = new clutil.EventAggregator();

			vent.remove = function () {
				vent.stopListening();
			};

			var setCode = function (code, item) {
				if (!item) {
					// 短いので何もしない
					$view.attr('cs_id', 0).removeData('cl_codeinput_item');
				} else {
					// 社員IDは'cs_id'にセット
					$view.attr('cs_id', item.id);
					$view.data('cl_codeinput_item', {
						id: item.id,
						code: item.code,
						name: item.name
					});
				}
				addOverlay();
				vent.trigger("change", item || null);
				clutil.mediator.trigger("validation:require", $view);
			};

			var isEnabled = function () {
				return !$view.prop('readonly') && !$view.prop('disabled');
			};

			var removeOverlay = function (focus) {
				if (!isEnabled()) {
					return true;
				}
				$view
					.removeClass('clInputOverlaying')
					.next('.clInputOverlay')
					.remove();
			};

			var addOverlay = function () {
				// 検索中は何もしない
				if (vent._pending) return;

				var code = '';
				var item = $view.data('cl_codeinput_item');

				if (item == null) {
					code = $view.val();
				} else if (item.code) {
					code = item.code + '：＊＊＊＊';
				}

				// 削除できない場合は追加しない
				if (removeOverlay()) return;

				if (code) {
					// プレイスホルダー表示のために入力済みの場合のみオーバーレイ
					$view
						.addClass('clInputOverlaying')
						.after('<span class="clInputOverlay">' + code + '</span>')
						.next()
						.click(function () {
							if (isEnabled()) {
								$view.focus();
							}
						})
						.on('mouseenter', function () {
							$view.trigger('mouseenter');
						})
						.on('mouseleave', function () {
							$view.trigger('mouseleave');
						});
				}
			};

			$view
				.wrap('<div class="clInputOverlayWrap">')
				.parent().css({
					position: 'relative'
				})
				.end()

				.addClass("cl_valid")
				.attr('placeholder', 'コードのみ入力')
				.on("blur", function (e) {
					_.defer(function () {
						// changeイベントの後に実行したいからdefer
						addOverlay();
					});
				})
				.on('focusin', function () {
					removeOverlay();
				})
				.on("change", function () {
					var code = $view.val();

					// 入力されたコードの長さを確認
					if (code == null || code.length < 6) {
						setCode(code);
						return false;
					}
					var reqHead = {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					};
					var req = {
						reqHead: reqHead,
						code: code
					};
					var uri = "am_pa_user_srch";
					vent._pending = true;
					clutil.postJSON(uri, req)
						.always(function () {
							vent._pending = false;
						})
						.done(function (data, dataType) {
							if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK &&
								data.list && data.list.length == 1) {
								var item = data.list[0];
								setCode(code, item);
							} else {
								setCode();
							}
						})
						.fail(function () { setCode() });
				});

			// cl_codeinputでいいかな
			$view.addClass('cl_codeinput').addClass('cl_codeonly');

			vent.listenTo(clutil.mediator, 'data2view:done', function () {
				if (!$view.is(':focus')) {
					addOverlay();
				}
			});
			return vent;
		},

		/**
		 * 社員コード→ユーザーID、名称取得
		 *
		 * ※ clstaffcode2を使用してください。
		 *
		 * 入力されたコードを検証するためにこの部品はクラスにcl_validを
		 * 追加します。
		 *
		 * イベント
		 * - change item
		 *	 itemは未社員確定時にはnull
		 *
		 *	 ※ 入力コードが変更されているときに発生する。
		 *
		 * @method clstaffcode
		 * @for clutil
		 * @param {jQuery} $view
		 * @param {Object} [options]
		 * @return {Backbone.Events}
		 */
		clstaffcode: function ($view, options) {
			options || (options = {});
			var vent = new clutil.EventAggregator();

			var setCode = function (code, item) {
				if (!item) {
					// 短いので何もしない
					$view.attr('cs_id', 0).removeData('cl_codeinput_item');
				} else {
					// 社員IDは'cs_id'にセット
					$view.attr('cs_id', item.id);
					$view.data('cl_codeinput_item', {
						id: item.id,
						code: item.code,
						name: item.name
					});
				}
				vent.trigger("change", item || null);
				clutil.mediator.trigger("validation:require", $view);
			};

			$view.addClass("cl_valid")
				.on("blur", function (e) {
					e.stopPropagation();
				})
				.on("change", function () {
					var code = $view.val();

					// 入力されたコードの長さを確認
					if (code == null || code.length < 6) {
						setCode(code);
						return false;
					};
					var reqHead = {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					};
					var req = {
						reqHead: reqHead,
						code: code
					};
					var uri = "am_pa_staff_srch";
					clutil.postJSON(uri, req, _.bind(function (data, dataType) {
						if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							if (data.list == null || data.list.length != 1) {
								setCode(code);
								return false;
							}
							var item = data.list[0];
							setCode(code, item);
						}

					}, this));
				});

			// cl_codeinputでいいかな
			$view.addClass('cl_codeinput').addClass('cl_codeonly');
			return vent;
		},

		/**
		 * 社員コード→ユーザーID、名称取得
		 *
		 * 入力されたコードを検証するためにこの部品はクラスにcl_validを
		 * 追加します。
		 *
		 * イベント
		 * - change item
		 *	 itemは未社員確定時にはnull
		 *
		 *	 ※ 入力コードが変更されているときに発生する。
		 *
		 * @method clstaffcode2
		 * @for clutil
		 * @param {jQuery} $view
		 * @param {Object} [options]
		 * @return {Backbone.Events}
		 */
		clstaffcode2: function ($view, options) {
			options || (options = {});
			var vent = new clutil.EventAggregator();

			vent.remove = function () {
				vent.stopListening();
			};

			var setCode = function (code, item) {
				if (!item) {
					// 短いので何もしない
					$view.attr('cs_id', 0).removeData('cl_codeinput_item');
				} else {
					// 社員IDは'cs_id'にセット
					$view.attr('cs_id', item.id);
					$view.data('cl_codeinput_item', {
						id: item.id,
						code: item.code,
						name: item.name
					});
				}
				addOverlay();
				vent.trigger("change", item || null);
				clutil.mediator.trigger("validation:require", $view);
			};

			var isEnabled = function () {
				return !$view.prop('readonly') && !$view.prop('disabled');
			};

			var removeOverlay = function (focus) {
				if (!isEnabled()) {
					return true;
				}
				$view
					.removeClass('clInputOverlaying')
					.next('.clInputOverlay')
					.remove();
			};

			var addOverlay = function () {
				// 検索中は何もしない
				if (vent._pending) return;

				var code = '';
				var item = $view.data('cl_codeinput_item');

				if (item == null) {
					code = $view.val();
				} else if (item.code) {
					code = item.code + '：＊＊＊＊';
				}

				// 削除できない場合は追加しない
				if (removeOverlay()) return;

				if (code) {
					// プレイスホルダー表示のために入力済みの場合のみオーバーレイ
					$view
						.addClass('clInputOverlaying')
						.after('<span class="clInputOverlay">' + code + '</span>')
						.next()
						.click(function () {
							if (isEnabled()) {
								$view.focus();
							}
						})
						.on('mouseenter', function () {
							$view.trigger('mouseenter');
						})
						.on('mouseleave', function () {
							$view.trigger('mouseleave');
						});
				}
			};

			$view
				.wrap('<div class="clInputOverlayWrap">')
				.parent().css({
					position: 'relative'
				})
				.end()

				.addClass("cl_valid")
				.attr('placeholder', 'コードのみ入力')
				.on("blur", function (e) {
					clutil.mediator.trigger("validation:require", $view);
					_.defer(function () {
						// changeイベントの後に実行したいからdefer
						addOverlay();
					});
				})
				.on('focusin', function () {
					removeOverlay();
				})
				.on("change", function () {
					var code = $view.val();

					// 入力されたコードの長さを確認
					if (code == null || code.length < 6) {
						setCode(code);
						return false;
					}
					var reqHead = {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					};
					var req = {
						reqHead: reqHead,
						code: code
					};
					var uri = "am_pa_staff_srch";
					vent._pending = true;
					clutil.postJSON(uri, req)
						.always(function () {
							vent._pending = false;
						})
						.done(function (data, dataType) {
							if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK &&
								data.list && data.list.length == 1) {
								var item = data.list[0];
								setCode(code, item);
							} else {
								setCode();
							}
						})
						.fail(function () { setCode() });
				});

			// cl_codeinputでいいかな
			$view.addClass('cl_codeinput').addClass('cl_codeonly');

			vent.listenTo(clutil.mediator, 'data2view:done', function () {
				if (!$view.is(':focus')) {
					addOverlay();
				}
			});
			return vent;
		},

		/**
		 * タグコードから、商品、品種、メーカー名、メーカー品番、カラー、サイズを取得する
		 * @method cltag2variety
		 * @param {string} tagcode: タグコード（新旧対応）
		 *
		 * 画面APLは、イベント'onCLtag2varietyCompleted'で結果を受け取ること。
		 * clutil.mediator.on('onCLtag2varietyCompleted', function(data, e) {
		 * 		// data に結果が帰ってきている
		 * });
		 */
		/**
		 * タグコードから、商品、品種、メーカー名、メーカー品番、カラー、
		 * サイズを取得する
		 *
		 * @method cltag2variety
		 * @param {object} req リクエスト
		 * @param {string} req.code タグコード（新旧対応）
		 * @param {integer} [req.unitID] 事業ユニットID
		 * @param {object} [e]
		 *
		 * 画面APLは、イベント'onCLtag2varietyCompleted'で結果を受け取ること。
		 * clutil.mediator.on('onCLtag2varietyCompleted', function(data, e) {
		 * 		// data に結果が帰ってきている
		 * });
		 */
		cltag2variety: function (tagcode, e) {
			var reqHead = {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
			};
			var req = {
				reqHead: reqHead
			};
			if (_.isObject(tagcode)) {
				_.extend(req, tagcode);
			} else {
				req.code = tagcode;
			}
			var uri = "am_pa_taginfo";
			clutil.postJSON(uri, req).done(_.bind(function (data) {
				clutil.mediator.trigger('onCLtag2varietyCompleted', { status: 'OK', data: data }, e);
			}, this)).fail(_.bind(function (data) {
				clutil.mediator.trigger('onCLtag2varietyCompleted', { status: 'NG', data: data }, e);
			}, this));
		},

		/**
		 * メーカ－品番から、商品、品種、メーカー名、カラーを取得する
		 * @param tagcode: メーカー品番
		 *
		 * 画面APLは、イベント'onCLmakerItemCodeCompleted'で結果を受け取ること。
		 * clutil.mediator.on('onCLmakerItemCodeCompleted', function(data, e) {
		 * 		// data に結果が帰ってきている
		 * });
		 */
		clmakeritemcode2item: function (makeritemcode, e) {
			var itgrp_id = null;
			var maker_id = null;
			var code = null;
			var token = null;
			var srchFromDate = null;
			var srchToDate = null;
			var need_qy = null;
			var f_pack = null;
			if (typeof makeritemcode === 'object') {
				itgrp_id = makeritemcode.itgrp_id;
				maker_id = makeritemcode.maker_id;
				code = makeritemcode.maker_code;
				token = makeritemcode.token;
				srchFromDate = makeritemcode.srchFromDate;
				srchToDate = makeritemcode.srchToDate;
				need_qy = makeritemcode.need_qy;
				f_pack = makeritemcode.f_pack;
			} else {
				code = makeritemcode;
			}
			var reqHead = {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
			};
			var req = {
				reqHead: reqHead,
				code: code,
				itgrp_id: itgrp_id,
				maker_id: maker_id,
				srchFromDate: srchFromDate,
				srchToDate: srchToDate,
				need_qy: need_qy,
				f_pack: f_pack
			};
			var uri = "am_pa_makeritemcode";

			var deferred = $.Deferred();

			clutil.postJSON(uri, req).then(function (data) {
				var rspData = {
					status: 'OK',
					data: data,
					token: token
				};
				clutil.mediator.trigger('onCLmakerItemCodeCompleted', rspData, e);
				deferred.resolveWith(this, [data, e, rspData]);
			}, function (data) {
				var rspData = {
					status: 'NG',
					data: data,
					token: token
				};
				clutil.mediator.trigger('onCLmakerItemCodeCompleted', rspData, e);
				deferred.rejectWith(this, [data, e, rspData]);
			});

			return deferred.promise();
		},

		/**
		 * 商品ID、カラーIDからサイズを取得する
		 * @param itemID: 商品ID
		 * @param colorID: カラーID
		 *
		 * 画面APLは、イベント'onCLcolor2sizeCompleted'で結果を受け取ること。
		 * clutil.mediator.on('onCLcolor2sizeCompleted', function(data, e) {
		 * 		// data に結果が帰ってきている
		 * });
		 */
		clcolor2size: function (itemID, colorID, e) {
			var reqHead = {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
			};
			var req = {
				reqHead: reqHead,
				itemID: itemID,
				colorID: colorID
			};
			var uri = "am_pa_color2size";
			return clutil.postJSON(uri, req).done(_.bind(function (data) {
				clutil.mediator.trigger('onCLcolor2sizeCompleted', { status: 'OK', data: data }, e);
			}, this)).fail(_.bind(function (data) {
				clutil.mediator.trigger('onCLcolor2sizeCompleted', { status: 'NG', data: data }, e);
			}, this));
		},

		/**
		 * 品種IDからプライスラインを取得する
		 * @param {object} cond
		 * @param {integer} cond.itgrpID 品種ID
		 * @param {yyyymmdd} [cond.srchFromDate]
		 * @param {yyyymmdd} [cond.srchToDate]
		 * @param {priceline_type_id} [cond.priceline_type_id]
		 */
		/**
		 * 品種IDからプライスラインを取得する
		 * @param itgrpID: 品種ID
		 *
		 * 画面APLは、イベント'onCLcolor2sizeCompleted'で結果を受け取ること。
		 * clutil.mediator.on('onCLcolor2sizeCompleted', function(data, e) {
		 * 		// data に結果が帰ってきている
		 * });
		 */
		clpriceline: function (itgrpID, e) {
			var reqHead = {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
			};
			var req = {
				reqHead: reqHead,
			};
			if (_.isObject(itgrpID)) {
				_.extend(req, itgrpID);
			} else {
				req.itgrpID = itgrpID;
			}
			var uri = "am_pa_priceline";
			return clutil.postJSON(uri, req).done(_.bind(function (data) {
				clutil.mediator.trigger('onCLpricelineCompleted', { status: 'OK', data: data }, e);
			}, this)).fail(_.bind(function (data) {
				clutil.mediator.trigger('onCLpricelineCompleted', { status: 'NG', data: data }, e);
			}, this));
		},

		/**
		 * JANコードから、品種、メーカー、商品、サブクラス１・２情報を取得する。
		 */
		cljancode: function (args, e) {
			if (!args) {
				console.warn('clcom.cljancode: invalid arguments.');
				return;
			}
			var completed = _.isFunction(args.completed)
				? args.completed
				: function (resArgs, e) {
					clutil.mediator.trigger('onCLjancode_srchCompleted', resArgs, e);
				};
			var srchYmd = _.isNumber(args.srchYmd) ? args.srchYmd : clcom.getOpeDate();
			var req;
			if (_.has(args, 'janCode')) {
				// JANコードで検索 /////////////////////////////////////////
				var fixJanCode = _.isString(args.janCode) ? $.trim(args.janCode) : null;
				// JanCode 長さは 8桁 or 13桁。
				// 旧タグコード対応で15桁も許容。
				if (fixJanCode.length !== 8 && fixJanCode.length !== 13 && fixJanCode.length !== 15) {
					completed({ status: 'NG' }, e);
					return;
				}
				req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					janCode: fixJanCode,
					srchYmd: srchYmd
				};
			} else {
				// 品種ID, メーカーID, メーカー品番で検索 //////////////////
				var pickArgs = _.pick(args, 'itgrpID', 'makerID', 'makerItemCode');
				if (_.isEmpty(pickArgs)) {
					// 引数不十分
					completed({ status: 'NG' }, e);
					return;
				}
				req = _.extend({
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					srchYmd: srchYmd
				}, pickArgs);
			}
			var resId = 'am_pa_jancode_srch';
			clutil.postJSON(resId, req).done(function (data) {
				var status = (data.rec && !_.isEmpty(data.rec.janCode)) ? 'OK' : 'NG';	// ここの NG は not found に相当
				completed({ status: status, data: data }, e);
			}).fail(function (data) {
				completed({ status: 'NG', data: data }, e);
			});

		},

		/**
		 * テキストフィールドの入力制限値（残数）を表示する
		 * @param $view_span 残数表示用ビュー
		 * @param $view_input テキストフィールドビュー
		 * @param limit 制限文字数 省略時はテキストフィールドのdata-tflimit属性を用いる
		 */
		cltxtFieldLimit: function ($view_input, $view_span, limit) {
			if ($view_span == null) {
				$view_span = $view_input.prev();
			}
			var datalimit;
			var datalimits;
			var dlens;

			if (limit == null) {
				limit = $view_input.data('tflimit');
				if (limit != null) {
					limit = parseInt(limit, 10);
				} else {
					datalimit = $view_input.data('limit');
					if (datalimit != null) {
						datalimits = datalimit.split(' ');
					}
					if (datalimits != null) {
						dlens = datalimits[0].split(':');
					}
					if (dlens != null && dlens.length >= 2) {
						limit = parseInt(dlens[1]);
					}
				}
			}

			var danger = Math.floor(limit * 0.25);
			var len = $view_input.val().length;

			var remain = limit - len;
			$view_span.text(remain);

			var updateRemain = function () {
				len = $view_input.val().length;
				remain = limit - len;
				$view_span.text(remain);
				if (remain <= danger) {
					$view_span.addClass('allert');
				} else {
					$view_span.removeClass('allert');
				}
			};

			var prevInst = $view_input.data('cltxtFieldLimit');
			if (prevInst) {
				clutil.mediator.off('cltxtFieldLimit:requireUpdateRemain', null, prevInst);
			}
			var inst = _.extend({}, Backbone.Events);
			$view_input.data('cltxtFieldLimit', prevInst);

			$view_input
				.off('.cltxtFieldLimit')
				.on("keyup.cltxtFieldLimit", _.debounce(updateRemain, 300))
				.on("keydown.cltxtFieldLimit", _.debounce(updateRemain, 300))
				.on('change.cltxtFieldLimit', updateRemain);

			clutil.mediator.on('cltxtFieldLimit:requireUpdateRemain', updateRemain, inst);
			$view_span
				.addClass("cltxtFieldLimit");
			$view_span
				.off(".cltxtFieldLimit")
				.on("mouseover.cltxtFieldLimit", function () {
					$view_input.trigger('mouseover');
				})
				.on('mouseout.cltxtFieldLimit', function () {
					$view_input.trigger('mouseout');
				});

			updateRemain();
		},

		/**
		 * 現在の入力状況で制限文字数をリセットする
		 * @param $view_span
		 * @param $view_input
		 * @param limit
		 */
		cltxtFieldLimitReset: function ($view_input, $view_span, limit) {
			if ($view_span == null) {
				$view_span = $view_input.prev();
			}
			var datalimit = null;
			var datalimits = null;
			var dlens = null;
			var remain;

			if (limit == null) {
				limit = $view_input.data('tflimit');
				if (limit != null) {
					limit = parseInt(limit, 10);
				} else {
					datalimit = $view_input.data('limit');
					if (datalimit != null) {
						datalimits = datalimit.split(' ');
					}
					if (datalimits != null) {
						dlens = datalimits[0].split(':');
					}
					if (dlens != null && dlens.length >= 2) {
						limit = parseInt(dlens[1]);
					}
				}
			}

			var danger = Math.floor(limit * 0.25);
			var len = $view_input.val().length;

			len = $view_input.val().length;
			remain = limit - len;
			$view_span.text(remain);
			if (remain <= danger) {
				$view_span.addClass('allert');
			} else {
				$view_span.removeClass('allert');
			}
		},
		/**
		 * 選択されている行数をカウントします。
		 * @param tbody 対象テーブルtbodyのid
		 * @param chkClass チェックボックスのid
		 * @returns 選択されている行数
		 */
		chkcount: function (tbody, chkClass) {
			var chkRec = $(tbody + " input[name=" + chkClass + "]:checked");
			return chkRec.length;
		},
		/**
		 * 選択された行のIDからデータを取得し、ボタンモードを起動できるかチェック
		 * 引数
		 * ・searchData     : 検索結果データの配列
		 * ・chkClass       : 検索結果のチェックボックスのクラス名
		 * ・ope_mode       : 起動モード
		 * ・id             ：検索結果データのidのオブジェクト名（例："material_id"）
		 * ・validator      :エラー内容を表示するvalidator
		 * ・st_ymd         ：検索結果データの適用開始日のオブジェクト名（例："st_ymd"）
		 * ・ed_ymd         ：検索結果データの適用開始日のオブジェクト名（例："ed_ymd"）
		 * ・id2            ：(by Kaba追加 2013/03/19)キーが２個の場合　検索結果データのidのオブジェクト名（例："xxxx_id"）
		 * 注意
		 *          検索結果テーブルの各行のtrに埋め込まれているidは
		 *          id="${material_id}_${st_ymd}"
		 *          となっていることを想定している
		 * 戻り値
		 *          正常値：チェックされたデータの配列
		 *          ボタンモードが起動できないエラー：null
		 */
		chkmode: function (tbody, searchData, chkClass, ope_mode, validator, id, st_ymd, ed_ymd, id2) {
			var chkRec = $(tbody + " input[name=" + chkClass + "]:checked");
			var chkData = [];
			var data;
			var i;
			for (i = 0; i < chkRec.length; i++) {
				// チェックされた項目idを追加していく
				var selectId = chkRec[i].parentElement.parentElement.parentElement.id;
				var chktr = chkRec[i];
				for (var j = 0; j < searchData.length; j++) {
					data = searchData[j];
					var compare;
					//kaba ：keyが１個じゃ足りなくなったので追加
					if (st_ymd) {
						if (id2) {
							compare = data[id] + "_" + data[id2] + "_" + data[st_ymd];
						} else {
							compare = data[id] + "_" + data[st_ymd];
						}
					} else {
						// st_dateが無い場合に対応
						if (id2) {
							compare = data[id] + "_" + data[id2];
						} else {
							compare = data[id];
						}
					}
					if (selectId == compare) {
						//if (selectId == data[id] + "_" + data[st_ymd]) {
						if (ope_mode != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW &&
							ope_mode != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
							// 新規登録、予約参照以外はtrオブジェクトを保管しておく
							data.tr_obj = $(chkRec[i].parentElement);
						}
						chkData.push(data);
						break;
					}
				}
			}

			var retStat = true;

			// 新規登録はチェックしない
			if (ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
				ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
				return chkData;
			}

			for (i = 0; i < chkData.length; i++) {
				data = chkData[i];
				switch (ope_mode) {
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
						// 新規登録

						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
						// 編集

						/* ==========================
						// 最終日付のチェック
						if (ed_ymd) {
							if (data[ed_ymd] <= clcom.max_date) {
								// チェックボックスの背景色を赤にする
								data.tr_obj.css("background-color", "red");
								// エラー内容を表示
								// TODO
								//validator.setErrorHeader(clmsg.cl_rtype_r_add);
								retStat = false;
							}
						}
						// 適用開始日のチェック
						if (st_ymd) {
							if (data[st_ymd] < clcom.ope_date) {
								// チェックボックスの背景色を赤にする
								data.tr_obj.css("background-color", "red");
								// エラー内容を表示
								// TODO
								//validator.setErrorHeader(clmsg.cl_rtype_r_upd);
								retStat = false;
							}
						}
						//========================== */
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
						// 参照

						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
						// 削除

						/* ==========================
						// 適用開始日のチェック
						if (st_ymd) {
							if (data[st_ymd] < clcom.ope_date) {
								// チェックボックスの背景色を赤にする
								data.tr_obj.css("background-color", "red");
								retStat = false;
							}
						}
						if (ed_ymd) {
							// 最終日付のチェック
							if (data[ed_ymd] <= clcom.max_date) {
								// チェックボックスの背景色を赤にする
								data.tr_obj.css("background-color", "red");
								retStat = false;
							}
						}
						//========================== */
						break;
					default:
						break;
				}

				// trオブジェクトをヌルにする
				data.tr_obj = null;

			}

			if (!retStat) {
				// エラー内容を表示する
				switch (ope_mode) {
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
						// 予約追加
						validator.setErrorHeader(clmsg.cl_rtype_r_add);
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
						// 予約編集
						validator.setErrorHeader(clmsg.cl_rtype_r_upd);
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
						// 予約削除
						validator.setErrorHeader(clmsg.cl_rtype_r_del);
						break;
					default:
						break;
				}

				document.location = '#';

				return null;
			}

			return chkData;
		},

		/**
		 * bootstrap対応
		 * 選択画面起動時などに呼ぶ
		 */
		initUIelement: function ($view) {
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
				function () {
					var $this = $(this);
					(current_r = $this.parent().children("table td")).addClass(hoverClass);
					(current_c = tdovercells.filter(":nth-child(" + (current_r.index($this) + 1) + ")")).addClass(hoverClass);
				},
				function () {
					if (current_r) current_r.removeClass(hoverClass);
					if (current_c) current_c.removeClass(hoverClass);
				}
			);
			var tdRovercells = $("table.hilightRow td"),
				hoverClass = "hover",
				current_r,
				current_c;
			tdRovercells.hover(
				function () {
					var $this = $(this);
					(current_r = $this.parent().children("table td")).addClass(hoverClass);
				},
				function () {
					if (current_r) current_r.removeClass(hoverClass);
				}
			);

			$view.undelegate('td :checkbox', 'toggle');
			$view.undelegate('td :radio', 'toggle');

			//チェックされた行をハイライト
			$view.delegate('td :checkbox', 'toggle', function (e) {
				var tr = $(this).closest('tr');
				if ($(this).prop('checked')) {
					$(tr).addClass('checked');
				} else {
					$(tr).removeClass('checked');
				}
			});
			$view.delegate('td :radio', 'toggle', function (e) {
				$.each($(this).closest('table').find('tr'), function () {
					$(this).removeClass('checked')
				});
				$(this).closest('tr').addClass('checked');
			});

			$view.off('mouseover', '#selected .btn-delete');
			$view.off('mouseout', '#selected .btn-delete');
			$view.off('mousedown', '#selected .btn-delete');
			//選択した内容の削除ボタン
			$view.on('mouseover', '#selected .btn-delete', function () {
				$(this).parent('li').toggleClass('ovr');
			});
			$view.on('mouseout', '#selected .btn-delete', function () {
				$(this).parent('li').toggleClass('ovr');
			});
			$view.on('mousedown', '#selected .btn-delete', function () {
				$(this).parent('li').addClass('active');
			});
		},


		/*
		 * 選択画面起動時の複数選択または単数選択起動モード
		 */
		cl_single_select: 0,
		cl_multiple_select: 1,

		/**
		 * AOKI
		 * 権限によってボタンなどのオブジェクトを使用可、不可に設定する
		 */
		setFuncObj: function ($view) {
			var isFunc = function (func_code) {
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

			$.each($view.find('.cl_func'), function () {
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
		setFrequency: function (item, userId) {
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
			frequentList.sort(function (a, b) { return (Number(b.countUp) - Number(a.countUp)); });

			clcom.setFrequentList(frequentList, userId);
		},

		/**
		 * 初期フォーカスの設定をする
		 */
		setFirstFocus: function ($obj) {
			var agent = clcom.getAgent();
			// PCの場合はフォーカス設定
			if (agent == clcom.onPC) {
				$obj.focus();
			}
			// mobile, iPadの場合はなにもしない
		},

		/**
		 * フォーカスの設定をする
		 */
		setFocus: function ($obj) {
			var agent = clcom.getAgent();
			var $button = $obj;

			// bootstrap対応 AOKI ACUST
			if ($obj.is('select')) {
				if ($obj.is('._clcombobox')) {
					$button = $obj.next('div').find('>input');
				} else {
					$button = $obj.next('div').find('button');
				}
			}

			// enterFocusModeとの間で干渉をさけるためにイベントをトリガーす
			// る。enterFocusModeではこのイベントを補足している。
			$obj.trigger('clfocusing');

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

		han_txt: "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｬｭｮｯ､｡ｰ｢｣0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZﾞﾟ ",
		zen_txt: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォャュョッ、。ー「」０１２３４５６７８９ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ" +
			"　　　　　ガギグゲゴザジズゼゾダヂヅデド　　　　　バビブベボ　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　" +
			"　　　　　　　　　　　　　　　　　　　　　　　　　パピプペポ　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　",

		zen2han: function (txt) {
			var retStr = "";
			for (var i = 0; i < txt.length; i++) {
				var c = txt.charAt(i);
				var n = clutil.zen_txt.indexOf(c, 0);

				if (n == 122) {
					// 空白対応
					c = clutil.han_txt.charAt(124);
				} else if (n >= 182) {
					c = clutil.han_txt.charAt(n - 182);
					c += clutil.han_txt.charAt(123);
				} else if (n >= 122) {
					c = clutil.han_txt.charAt(n - 122);
					c += clutil.han_txt.charAt(122);
				} else if (n >= 0) {
					c = clutil.han_txt.charAt(n);
				}

				retStr += c;
			}
			return retStr;
		},

		han2zen: function (txt) {
			var retStr = "";
			for (var i = 0; i < txt.length; i++) {
				var c = txt.charAt(i);
				var cnext = txt.charAt(i + 1);
				var n = clutil.han_txt.indexOf(c, 0);
				var nnext = clutil.han_txt.indexOf(cnext, 0);
				if (n >= 0) {
					if (nnext == 122) {
						c = clutil.zen_txt.charAt(n + 122);
						i++;
					} else if (nnext == 123) {
						c = clutil.zen_txt.charAt(n + 182);
						i++;
					} else {
						c = clutil.zen_txt.charAt(n);
					}
				}
				if ((n != 122) && (n != 123)) {
					retStr += c;
				}
			}
			return retStr;
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
		 * ページャーを２つ画面に配置する
		 * @param $view1 上部ページャー
		 * @param $view2 下部ページャー
		 * @param method 各ページャーの設定値
		 */
		pagination2: function ($view1, $view2, method) {
			var method1 = $.extend({
				items: 1,
				itemsOnPage: 10,
				pages: 0,
				displayedPages: 5,
				edges: 2,
				currentPage: 1,
				hrefText: '#page-',
				prevText: 'Prev',
				nextText: 'Next',
				ellipseText: '&hellip;',
				//cssStyle: 'light-theme',
				selectOnClick: true,
				onPageClick: function (pageNumber, itemsOnPage) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				},
				onSelectChange: function (itemsOnPage) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				},
				onInit: function () {
					// Callback triggered immediately after initialization
				},
				displaypanel: 'displaypanel',
				pagination_select: 'pagination_select',
				pagination_store: true,	// true:件数を10,50に false:件数を25,100に
			}, method || {});
			if (method.displaypanel1 != null) {
				method1.displaypanel = method.displaypanel1;
			}
			if (method.pagination_select1 != null) {
				method1.pagination_select = method.pagination_select1;
			}
			var method2 = $.extend({
				items: 1,
				itemsOnPage: 10,
				pages: 0,
				displayedPages: 5,
				edges: 2,
				currentPage: 1,
				hrefText: '#page-',
				prevText: 'Prev',
				nextText: 'Next',
				ellipseText: '&hellip;',
				//cssStyle: 'light-theme',
				selectOnClick: true,
				onPageClick: function (pageNumber, itemsOnPage) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				},
				onSelectChange: function (itemsOnPage) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				},
				onInit: function () {
					// Callback triggered immediately after initialization
				},
				displaypanel: 'displaypanel',
				pagination_select: 'pagination_select',
				pagination_store: true,	// true:件数を10,50に false:件数を25,100に
			}, method || {});
			if (method.displaypanel2 != null) {
				method2.displaypanel = method.displaypanel2;
			}
			if (method.pagination_select2 != null) {
				method2.pagination_select = method.pagination_select2;
			}
			$view1.pagination(method1);
			$view2.pagination(method2);
		},

		// エラーメッセージ定義を取るためのラッパ関数
		getclmsg: function (key) {
			var msg = clmsg[key];
			return _.isEmpty(msg) ? key : msg;
		},

		// システムパラメータを取るためのラッパ関数
		getclsysparam: function (key, defaultvalue) {
			var val = clcom.cmSysparamMap[key];
			return (val != undefined) ? val : defaultvalue;
		},

		/**
		 * イベント中継用の Backbone.Event インスタンス
		 */
		mediator: _.extend({}, Backbone.Events),

		/**
		 * イベントアグリゲータ
		 *
		 * インスタンスはBackbone.Eventsのメソッドを持つ。
		 *
		 * コードはMarionette.EventAggregatorから借りた
		 *
		 * @class EventAggregator
		 * @for clutil
		 * @constructor
		 * @example
		 * ```js
		 * var vent = new clutil.EventAggregator();
		 * vent.on("foo", function(){alert("foo")});
		 * vent.trigger("foo");
		 * ```
		 */
		EventAggregator: (function () {
			var EA = function () { };

			EA.extend = Backbone.Model.extend;

			_.extend(EA.prototype, Backbone.Events);

			return EA;
		}()),

		_eof: '-- end of extend(clutil)//'
	});
}());


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
		var i, input = $el && $el.get(0);
		var supported = 'input[type=text],input[type=password],' +
			'input[type=checkbox],input[type=radio],' +
			'select,a,button,textarea,[tabindex]';
		var focusableElements = options.elements ||
			(options.view ? options.view.find(supported) : $(supported)),
			numElements = focusableElements.length;

		if (!numElements)
			return;

		if (_.has(options, 'filter')) {
			focusableElements = _.filter(focusableElements, options.filter);
		}

		if (options.useTabindex) {
			focusableElements = _.sortBy(focusableElements, function (el) {
				return el.tabIndex || Infinity;
			});
		}

		for (i = 0; i < numElements; i += 1) {
			if (input == null || focusableElements[i] === input) {
				break;
			}
		}
		var nowIndex = i;
		var n1, n2, inc = shift < 0 ? -1 : 1,
			nextIndex = nowIndex + (shift || 0);

		if (nowIndex === numElements) {
			nextIndex = inc > 0 ? 0 : -1;
		}

		if (shift < 0) {
			n1 = -1;
			n2 = numElements;
		} else {
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

	/**
	 * focusを設定する(1)
	 *
	 * @method focus
	 * @param {object} [options]
	 * @param {Integer} [options.shift] 基準エレメントからの位置
	 * @param {jQuery|String} [options.el] 基準となるエレメント
	 * nullの場合は、最初のエレメントを基準とする
	 * @param {jQuery} [options.view] 探すエリア
	 *
	 * @example
	 * ```js
	 * clutil.focus($("#current"), 1); // 次の項目にフォーカス
	 * ```
	 *
	 * ```js
	 * clutil.focus($("#current"), -1); // 前の項目にフォーカス
	 * ```
	 */

	/**
	 * focusを設定する(2)
	 *
	 * @method focus
	 * @param {jQuery|String} $input
	 * @param {Integer} shift
	 * @param {object} [options]
	 * @example
	 * ```js
	 * clutil.focus($("#current"), 1); // 次の項目にフォーカス
	 * ```
	 *
	 * ```js
	 * clutil.focus($("#current"), -1); // 前の項目にフォーカス
	 * ```
	 */
	var focus = function ($input, shift, options) {
		if (!($input instanceof $) && _.isObject($input)) {
			options = $input;
			$input = options.el;
			shift = options.shift;
		}
		$input = ($input instanceof $) || $input == null ? $input : $($input);
		options = options || {};

		if (shift || $input == null) {
			var target = findNextElement($input, shift, options);
			if (target) {
				var $target = $(target);
				$target.focus();
			}
		} else {
			$input.focus();
		}
	};

	var _deferFocus = function ($target) {
		_.defer(function () {
			$target.focus();
		});
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

	var checkButton = function ($el, tagName) {
		if ((tagName === 'button' &&
			$el.is('.dropdown-toggle.selectpicker')) ||
			(tagName === 'a' && $el.is('.dropdown-menu>li>a'))) {
			return false;
		}

		return tagName === 'button' ||
			$el.hasClass('btn') ||
			$el.is('input[type=button],input[type=submit]') ||
			tagName === 'a';
	};

	var parseEvent = function (ev, options) {
		var el = ev.target,
			$el = $(el),
			tagName = el.tagName.toLowerCase(),
			isButton = checkButton($el, tagName),
			shift = 0,
			upOrDown = false,
			keyCode = ev.which,
			shiftKey = ev.shiftKey;

		var parsed = {
			el: el,
			$el: $el,
			tagName: tagName,
			upOrDown: upOrDown,
			keyCode: keyCode,
			shiftKey: shiftKey,
			originalEvent: ev
		};

		if (clutil._modalDialogShown && !options.view) {
			parsed.shift = 0;
			return parsed;
		}

		switch (keyCode) {
			case 9:	 // TAB
			case 108:				// NUMPAD ENTER
			case 13: // ENTER
				shift = shiftKey ? -1 : 1;
				break;
			//	 case 39: // 右
			//	   if (isButton) {
			//		 shift = 1;
			//	   }
			//	   break;
			//	 case 40: // 下
			//	   shift = 1;
			//	   upOrDown = true;
			//	   break;
			//	 case 37: // 左
			//	   if (isButton) {
			//		 shift = -1;
			//	   }
			//	   break;
			//	 case 38: // 上
			//	   shift = -1;
			//	   upOrDown = true;
			//	   break;
		}

		// textareaの場合Enterキーを無視する
		if ('textarea' === tagName && keyCode == 13) {
			shift = 0;
		}

		if (isButton) {
			if (keyCode === 13 && !shiftKey) {	 // エンター時
				shift = 0;
			}
		}

		parsed.shift = shift;
		return parsed;
	};

	/**
	 * ENTERキーやTABなどフォーカス遷移対象EVENTの場合はenterFocusModeによる
	 * フォーカス遷移を抑制する。
	 *
	 * 注意 e.stopPropagation()を呼んでいるので上階層のDomのkeydownイベ
	 * ントが呼ばれなくなる。
	 * @method stopFocus
	 * @for clutil
	 * @param {Event} ev - keydownイベントでのevent
	 * @return {Boolean}フォーカス遷移を抑止した場合はtrue、そうでない場合はfalse
	 */
	var stopFocus = function (ev) {
		var parsed = parseEvent(ev, {});
		if (parsed.shift) {
			ev.stopPropagation();
		}
		return !!parsed.shift;
	};

	var triggerFocusBefore = function (e) {
		var events = _.extend({
			stop: function () {
				this.stopped = true;
			},
			stopped: false
		}, e);
		clutil.mediator.trigger('enterfocusmode:focus:before', events);
		return events.stopped;
	};

	var focusCallback = function (options, ev) {
		var parsed = parseEvent(ev, options);

		var el = parsed.el,
			$el = parsed.$el,
			tagName = parsed.tagName,
			keyCode = parsed.keyCode,
			shift = parsed.shift;

		$el.removeClass('clEnterFocusMode_focusing');

		if (!shift) {
			return;
		}

		if (options.beforeFocus) {
			options.beforeFocus(ev);
		}

		if (options.upDownRow && parsed.upOrDown) {
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

		// IEでENTERキーイベントをTABに置きかえる。
		if (options.convtab && window.event) {
			if (shift > 0 || keyCode === ENTER || keyCode === TAB) {
				window.event.keyCode = 9;
				return;
			}
		}

		ev.preventDefault();
		// blurイベントやchangeイベントのタイミングでアプリが入力
		// フィールドをdisabled、削除されることがある。対策として
		// blurイベントを投げた後、遅延を行い入力フィールドの
		// disabled、削除を待つ。その後にどのエレメントに移動するか
		// 計算する。また、このタイミングでclutil.setFocusを利用し
		// てフォーカスを行う場合があるが、その場合は遅延後のコール
		// バックでフォーカスを行ってはならない。これを回避するため
		// clEnterFocusMode_focusingクラスをつけている。
		clutil.mediator.trigger('enterfocusmode:focus:defer:before', parsed);
		$el.trigger('blur');
		_.defer(function () {
			var focusing = $el.hasClass('clEnterFocusMode_focusing');
			$el.removeClass('clEnterFocusMode_focusing');
			if (focusing) {
				return;
			}
			var target;
			if (options._cache) {
				target = findNextElementCache($el, shift, options);
			} else {
				target = findNextElement($el, shift, options);
			}
			if (target) {
				parsed.nextTarget = target;
				if (!triggerFocusBefore(parsed)) {
					$(target).focus();
				}
			}
		});
	};

	/**
	 * keydownイベント時のevent引数に基づいてフォーカスを行う。
	 * @method focus2
	 * @for clutil
	 * @param {Event} ev - keydownイベント
	 * @param {Object} options - enterFocusModeのoptionsを参照
	 * @example
	 * hogehogeにリクエストを投げてdoFocusがtrueのときにのみフォーカスを行う。
	 * ```js
	 * $("#foo").on("keydown", function(e) {
	 *     if (clutil.stopFocus(e)) {
	 *         clutil.postJSON("hogehoge")
	 *             .done(function(data){
	 *                 if (data.doFocus) {
	 *                     clutil.focus2(e);
	 *                 }
	 *             });
	 *     }
	 * });
	 * ```
	 */
	var focus2 = function (ev, options) {
		return focusCallback(options || {}, ev);
	};

	/**
	 * Enter、 上下キーによるフォーカス移動を可能にする。
	 * ###### deprecated:
	 * - `clutil.enterFocusMode(el, options)`の形式のelは使用していません。
	 * - options.filter=false 使用していません
	 *
	 * @method enterFocusMode
	 * @for clutil
	 * @param {Object} [options]
	 * @param {Boolean} [options.useTabindex=false] tabIndexによる順序付けするか
	 * @param {Boolean} [options.convtab=false] Enterキーをタブにコンバート(msieオンリー)
	 * @returns {jQuery} $el
	 * @example
	 * <pre>
	 * clutil.enterFocusMode($('#myForm'), { useTabindex: false, convtab: false });
	 * </pre>
	 */
	var enterFocusMode = (function () {

		return function (el, options) {
			if (!options)
				options = el;
			options = options || {};
			_.defaults(options, { filter: function () { return true } });
			options.convtab = options.convtab && $.browser.msie;

			$(document).off('.clEnterFocusMode')
				.on('clfocusing', function (ev) {
					console.log('^^^^^^^^clfocusing');
					var $el = $(ev.target);
					$el.addClass('clEnterFocusMode_focusing');
				});
			var cb = _.bind(focusCallback, null, options);
			if (options.convtab) {
				$(document).on('keydown.clEnterFocusMode', cb);
				clutil._enterFocusMode = 'convertTab';
			} else if (options.view) {
				$(options.view).on('keydown.clEnterFocusMode', cb);
			} else if (options.cache) {
				options._cache = buildCache();
				$(document).on('keydown.clEnterFocusMode', cb);
			} else {
				$(document).on('keydown.clEnterFocusMode', cb);
				clutil._enterFocusMode = 'emulateTab';
			}
			return el;
		};
	}());

	/**
	 * enterFocusModeを停止する
	 * @method leaveEnterFocusMode
	 */
	var leaveEnterFocusMode = function () {
		$(document).off('.clEnterFocusMode');
	};

	_.extend(clutil, {
		focus: focus,
		focus2: focus2,
		stopFocus: stopFocus,
		enterFocusMode: enterFocusMode,
		leaveEnterFocusMode: leaveEnterFocusMode
	});
}());


//form serializer, deserializer
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

					if (_.any(keys, function (key) { return registeredKeys[toKeyStr(ev, key)] })) {
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
	NaviView = Backbone.View.extend({
		// 要素
		el: $('#cl_navi'),

		// Events
		events: {
			//			"click .a"		:	"_onAClick"
		},

		initialize: function () {

		},

		render: function (navi_class, appCallback, option) {
			var _this = this;
			$('#cl_navi').empty();
			$('#cl_navi').load(clcom.appRoot + '/menu/navi.html', function () {
				$(this).find('#cl_' + navi_class).addClass('on');
				$(this).find('a').click(function () {
					var screenId = $(this).attr('data-tgt');
					clcom.pushPage(clcom.appRoot + '/' + screenId + '/' + screenId + '.html');
				});
				// 権限データに応じてタブを隠す
				_this.setFunc(this);


				// bodyを表示
				$('#ca_body').show();

				// ナビの固定
				_this.navi_load(option, navi_class);

				// コールバック関数を呼ぶ
				if (appCallback != null) {
					appCallback();
				}

			});
		},

		navi_load: function (option, navi_class) {
			var _this = this;
			var navi = '#navi';
			if (option != null && option.naviname != null) {
				navi = option.naviname;
			}
			var navileft = $(navi).css("left");
			var w = $(window).width();
			var wrapper = $('#wrapper').css("width");
			var scroll_flg = false;

			//単位付きでとれちゃうので
			navileft = navileft.replace("px", "");
			wrapper = wrapper.replace("px", "");

			//一番最初の処理
			if (w > wrapper) {
				jQuery('#navi').offset({ left: (w - wrapper) / 2 });
				var start_flg = true;
			}
			if (option != null && option.carte == true) {
				jQuery('#navi').offset({ left: navileft });
			}
			if (option != null && option.liquid == true) {
				jQuery('#navi').offset({ left: navileft });
			}

			// ナビの下の部分位置を調整 2013/09/27
			this.calcNavi(navi_class);

			//scrollした時
			$(window).scroll(function () {
				if (!start_flg) {
					var scrleft = $(document).scrollLeft();
					if (scrleft > 0 && w < wrapper) {
						jQuery('#navi').offset({ left: navileft - scrleft });
						$('#intervalValue').val(navileft);
						scroll_flg = true;
					} else if (w < wrapper) {
						jQuery('#navi').offset({ left: navileft });
					}
				} else {
					start_flg = false;
				}
			});

			//画面サイズ変更した時
			$(window).resize(function () {
				w = $(window).width();
				if (w > wrapper) {
					if (option != null && option.liquid == true) {
						jQuery('#navi').offset({ left: navileft });
					} else {
						jQuery('#navi').offset({ left: (w - wrapper) / 2 });
					}
					scroll_flg = false;
				} else if (!scroll_flg) {
					jQuery('#navi').offset({ left: navileft });
				}
				_this.calcNavi(navi_class);
			});
		},

		calcNavi: function (navi_class) {
			// ナビの下の部分位置を調整 2013/09/27
			switch (navi_class) {
				case 'carte':
					var h_navi_main = $('#navi-main').height()
					var h = $(window).height() - h_navi_main;
					h = h < h_navi_main + 40 ? h_navi_main + 40 : h;
					h = h > 495 ? 495 : h;
					$('#navi-sub').css("top", h + 20);
					break;
				case 'home':
					var h_sub = $(window).height() - $('#navi-sub').height();
					var min_sub = $('#navi-main').height() + 8;
					var max_sub = 515 - 60 * (4 - $('#navi-main li').length)
					h_sub = h_sub < min_sub ? min_sub : h_sub;
					h_sub = h_sub > max_sub ? max_sub : h_sub;
					$('#lbl_navi-sub').css('top', h_sub + 8);
				default:
					var h = $(window).height() -
						$('#navi-sub').height() -
						$('#navi-main').height();
					h = h < 0 ? 0 : h;
					h = h > 275 ? 275 : h;
					$('#navi-main').css("margin-bottom", h);
					break;
			}
		},

		/**
		 * @deprecated
		 */
		setFunc: function (_this) {
			// 権限データを取得
			var funcgrp = clcom.getFuncGrp();
			var agent = clcom.getAgent();
			$.each(clutil.funcgrpname, function () {
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

//AOKI
$(function () {
	$('.cl_check').click(function (e) {
		var $chkbox = $(this).find('input:checkbox');
		if ($(e.target).get(0).type == 'checkbox') {
			return;
		}
		if ($chkbox.is(":checked")) {
			$chkbox.attr('checked', false);
		} else {
			$chkbox.attr('checked', true);
		}
	});
	$('.cl_radio').click(function (e) {
		var $chkbox = $(this).find('input:radio');
		if ($(e.target).get(0).type == 'radio') {
			return;
		}
		if (!$chkbox.is(":checked")) {
			$chkbox.attr('checked', true);
		}
	});
});

//テーブルソート
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

		// ホームに戻る
		$('.cl_gohome').live('click', function (ev) {
			ev.preventDefault();
			clcom.gohome();
		});

		$('body').tooltip({
			// trueだとsetTimeoutなどを利用するためか動作が不安定になる
			animation: false,
			selector: '[data-cl-errmsg]',
			title: function () {
				//console.log(this);
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

//tablefix を無効にする。
(function () {
	$.fn.tablefix = function () { };
	$.inputlimiter.start();

	//	// cl_dateクラスのblur時に日付けフォーマットを実行する
	//	$(document).on('blur', 'input[type=text].cl_date.hasDatepicker', function (event) {
	//		var $input = $(event.currentTarget),
	//		value = $input.val();
	//
	//		// 8桁の数値のときのみフォーマットする
	//		if (clutil.checkDate(value) != false && /^[0-9]{8,8}$/.test(value)) {
	//			var s = value.replace(/([0-9]{4,4})([0-9]{2,2})([0-9]{2,2})/, '$1/$2/$3');
	//			$input.val(s);
	//		}
	//	});

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
	//	clutil.enterFocusMode();
}());

(function (exports) {
	////////////////////////////////////////////////////////////////
	var keyPathSeparator = '.';
	/**
	 * Takes a nested object and returns a shallow object keyed with the path names
	 * e.g. { "level1.level2": "value" }
	 *
	 * @param  {Object}      Nested object e.g. { level1: { level2: 'value' } }
	 * @return {Object}      Shallow object with path names e.g. { 'level1.level2': 'value' }
	 */
	function objToPaths(obj) {
		var ret = {},
			separator = keyPathSeparator;

		for (var key in obj) {
			var val = obj[key];

			if (val && val.constructor === Object && !_.isEmpty(val)) {
				//Recursion for embedded objects
				var obj2 = objToPaths(val);

				for (var key2 in obj2) {
					var val2 = obj2[key2];

					ret[key + separator + key2] = val2;
				}
			} else {
				ret[key] = val;
			}
		}

		return ret;
	}

	/**
	 * @param {Object}  Object to fetch attribute from
	 * @param {String}  Object path e.g. 'user.name'
	 * @return {Mixed}
	 */
	function getNested(obj, path, return_exists) {
		var separator = keyPathSeparator;

		var fields = path.split(separator);
		var result = obj;
		return_exists || (return_exists === false);
		for (var i = 0, n = fields.length; i < n; i++) {
			if (return_exists && !_.has(result, fields[i])) {
				return false;
			}
			result = result[fields[i]];

			if (result == null && i < n - 1) {
				result = {};
			}

			if (typeof result === 'undefined') {
				if (return_exists) {
					return true;
				}
				return result;
			}
		}
		if (return_exists) {
			return true;
		}
		return result;
	}

	/**
	 * @param {Object} obj                Object to fetch attribute from
	 * @param {String} path               Object path e.g. 'user.name'
	 * @param {Object} [options]          Options
	 * @param {Boolean} [options.unset]   Whether to delete the value
	 * @param {Mixed}                     Value to set
	 */
	function setNested(obj, path, val, options) {
		options = options || {};

		var separator = keyPathSeparator;

		var fields = path.split(separator);
		var result = obj;
		for (var i = 0, n = fields.length; i < n && result !== undefined; i++) {
			var field = fields[i];

			//If the last in the path, set the value
			if (i === n - 1) {
				options.unset ? delete result[field] : result[field] = val;
			} else {
				//Create the child object if it doesn't exist, or isn't an object
				if (typeof result[field] === 'undefined' || !_.isObject(result[field])) {
					result[field] = {};
				}

				//Move onto the next part of the path
				result = result[field];
			}
		}
	}

	function deleteNested(obj, path) {
		setNested(obj, path, null, { unset: true });
	}

	////////////////////////////////////////////////////////////////
	// The code bellow is borrowed from backbone.syphon

	// Assigns `value` to a parsed JSON key.
	//
	// The first parameter is the object which will be
	// modified to store the key/value pair.
	//
	// The second parameter accepts an array of keys as a
	// string with an option array containing a
	// single string as the last option.
	//
	// The third parameter is the value to be assigned.
	//
	// Examples:
	//
	// `["foo", "bar", "baz"] => {foo: {bar: {baz: "value"}}}`
	//
	// `["foo", "bar", ["baz"]] => {foo: {bar: {baz: ["value"]}}}`
	//
	// When the final value is an array with a string, the key
	// becomes an array, and values are pushed in to the array,
	// allowing multiple fields with the same name to be
	// assigned to the array.
	var assignKeyValue = function (obj, keychain, value) {
		if (!keychain) { return obj; }

		var key = keychain.shift();

		// build the current object we need to store data
		if (!obj[key]) {
			obj[key] = _.isArray(key) ? [] : {};
		}

		// if it's the last key in the chain, assign the value directly
		if (keychain.length === 0) {
			if (_.isArray(obj[key])) {
				obj[key].push(value);
			} else {
				obj[key] = value;
			}
		}

		// recursive parsing of the array, depth-first
		if (keychain.length > 0) {
			assignKeyValue(obj[key], keychain, value);
		}

		return obj;
	};

	// Flatten the data structure in to nested strings, using the
	// provided `KeyJoiner` function.
	//
	// Example:
	//
	// This input:
	//
	// ```js
	// {
	//   widget: "wombat",
	//   foo: {
	//     bar: "baz",
	//     baz: {
	//       quux: "qux"
	//     },
	//     quux: ["foo", "bar"]
	//   }
	// }
	// ```
	//
	// With a KeyJoiner that uses [ ] square brackets,
	// should produce this output:
	//
	// ```js
	// {
	//  "widget": "wombat",
	//  "foo[bar]": "baz",
	//  "foo[baz][quux]": "qux",
	//  "foo[quux]": ["foo", "bar"]
	// }
	// ```
	var flattenData = function (config, data, parentKey) {
		var flatData = {};

		_.each(data, function (value, keyName) {
			var hash = {};

			// If there is a parent key, join it with
			// the current, child key.
			if (parentKey) {
				keyName = config.keyJoiner(parentKey, keyName);
			}

			if (_.isArray(value)) {
				keyName += "[]";
				hash[keyName] = value;
			} else if (_.isObject(value)) {
				hash = flattenData(config, value, keyName);
			} else {
				hash[keyName] = value;
			}

			// Store the resulting key/value pairs in the
			// final flattened data object
			_.extend(flatData, hash);
		});

		return flatData;
	};

	var config = {
		keyJoiner: function (parentKey, keyName) {
			return parentKey + "." + keyName;
		},
		keySplitter: function (key) {
			return key.split(".");
		}
	};
	exports.nested = {
		flatten: function (data) {
			return objToPaths(data);
		},
		unflatten: function (data) {
			return _.reduce(data, function (memo, value, key) {
				var keychain = config.keySplitter(key);
				assignKeyValue(memo, keychain, value);
				return memo;
			}, {});
		},
		getNested: getNested,
		setNested: setNested,
		deleteNested: deleteNested
	};
}(clutil));

(function (clutil) {
	var msgcd2msg = function (msgcd) {
		var fmtargs = _.toArray(arguments);
		var msg;
		fmtargs[0] = clmsg['cl_' + msgcd];
		if (fmtargs[0] == null) {
			// メッセージが整備されていない場合 => メッセージの更新が必要
			console.warn("No message code `" + msgcd + '`');
			fmtargs[0] = "XXXX";
		}
		msg = clutil.fmt.apply(this, fmtargs);			   // 項目名ラベルなし
		return msg;
	};

	/**
	 * 入力バリデータの集合
	 * @class clutil.Validators
	 * @static
	 */
	var Validators = (function () {
		var safeString = function (value) {
			if (value == null) {
				value = '';
			}
			if (_.isNumber(value)) {
				value = String(value);
			}
			return value;
		};

		var isHalf = function (c) {
			c = c.charCodeAt(0);
			return (c >= 0x20 && c < 0x81) || (c == 0xf8f0) ||
				(c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
		};

		var isHalf_cr = function (c) {
			c = c.charCodeAt(0);
			return c == 0x0a || (c >= 0x20 && c < 0x81) || (c == 0xf8f0) ||
				(c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
		};

		var isHalf2 = function (c) {
			c = c.charCodeAt(0);
			return ((c >= 0x21 && c < 0x81) || (c == 0xf8f0) ||
				(c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) && c != 0x20;
		};

		var isHalfForZenkaku = function (c) {
			c = c.charCodeAt(0);
			return (c >= 0x0 && c < 0x81) || (c == 0xf8f0) ||
				(c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
		};

		var isHalfForZenkaku_cr = function (c) {
			c = c.charCodeAt(0);
			return (c >= 0x0 && c < 0x09) || (c >= 0x0b && c < 0x81)
				|| (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0)
				|| (c >= 0xf8f1 && c < 0xf8f4);
		};

		/**
		 * 全角
		 * @method zenkaku
		 * @param {String|Integer} [max] 最大長
		 * @return {String|undefined} エラーメッセージ
		 */
		function zenkaku(value, max) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			max = parseInt(max, 10);
			var len = _.reject(value.split(''), isHalfForZenkaku).length;
			if ((max && len > max) || len !== value.length) {
				if (arguments.length === 2) {
					return msgcd2msg('zenkaku_long', max);
				} else {
					return msgcd2msg('zenkaku');
				}
			}
		}
		/**
		 * 全角(改行許容)
		 * @method zenkaku_cr
		 * @param {String|Integer} [max] 最大長
		 * @return {String|undefined} エラーメッセージ
		 */
		function zenkaku_cr(value, max) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			max = parseInt(max, 10);
			var len = _.reject(value.split(''), isHalfForZenkaku_cr).length;
			if ((max && len > max) || len !== value.length) {
				if (arguments.length === 2) {
					return msgcd2msg('zenkaku_long', max);
				} else {
					return msgcd2msg('zenkaku');
				}
			}
		}

		/**
		 * 全角(全角半角モード用)
		 * @method zenkaku2
		 * @param {String|Integer} [max] 最大長
		 * @return {String|undefined} エラーメッセージ
		 */
		function zenkaku2(value, max) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			max = parseInt(max, 10);
			var len = _.reject(value.split(''), isHalfForZenkaku).length;
			if ((max && len > max)) {
				if (arguments.length === 2) {
					return msgcd2msg('zenkaku_long', max);
				} else {
					return msgcd2msg('zenkaku');
				}
			}
		}

		/**
		 * 半角
		 * @method hankaku
		 * @param {String|Integer} [max] 最大長
		 * @return {String|undefined} エラーメッセージ
		 */
		function hankaku(value, max) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			max = parseInt(max, 10);
			var len = _.filter(value.split(''), isHalf).length;
			if ((max && len > max) || len !== value.length) {
				if (arguments.length === 2) {
					return msgcd2msg('hankaku_long', max);
				} else {
					return msgcd2msg('hankaku');
				}
			}
		}

		/**
		 * 半角（改行あり）
		 * @method hankaku_cr
		 * @param {String|Integer} [max] 最大長
		 * @return {String|undefined} エラーメッセージ
		 */
		function hankaku_cr(value, max) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			max = parseInt(max, 10);
			var len = _.filter(value.split(''), isHalf_cr).length;
			if ((max && len > max) || len !== value.length) {
				if (arguments.length === 2) {
					return msgcd2msg('hankaku_long', max);
				} else {
					return msgcd2msg('hankaku');
				}
			}
		}

		/**
		 * 半角（空白文字NG）
		 * @method hankaku2
		 * @param {String|Integer} [max] 最大長
		 * @return {String|undefined} エラーメッセージ
		 */
		function hankaku2(value, max) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			max = parseInt(max, 10);
			var len = _.filter(value.split(''), isHalf2).length;
			if ((max && len > max) || len !== value.length) {
				if (arguments.length === 2) {
					return msgcd2msg('hankaku_long', max);
				} else {
					return msgcd2msg('hankaku');
				}
			}
		}

		/**
		 * 半角(全角半角モード用)
		 * @method hankaku3
		 * @param {String|Integer} [max] 最大長
		 * @return {String|undefined} エラーメッセージ
		 */
		function hankaku3(value, max) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			max = parseInt(max, 10);
			var len = _.filter(value.split(''), isHalf).length;
			if ((max && len > max)) {
				if (arguments.length === 2) {
					return msgcd2msg('hankaku_long', max);
				} else {
					return msgcd2msg('hankaku');
				}
			}
		}

		/**
		 * @method zenhan
		 * @param {String|Integer} zen 最大長
		 * @param {String|Integer} han 最大長
		 * @return {String|undefined} エラーメッセージ
		 */
		function zenhan(value, zen, han) {
			if (zenkaku2(value, zen) && hankaku3(value, han)) {
				return msgcd2msg('zenhan', zen, han);
			}
		}

		/**
		 * 小数点数
		 * @method decimal
		 * @param {String|Integer} [iport] 整数部の最大桁数
		 * @param {String|Integer} [dport] 小数部の最大桁数
		 * @return {String|undefined} エラーメッセージ
		 */
		function decimal(value, ipart, dpart) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);
			value = value.replace(/,/g, '');

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
			if (!match || (ipart && (match[1] || '').length > ipart) ||
				(dpart && (match[2] || '').length > dpart)) {
				return msg;
			}
		}

		/**
		 * 整数
		 * @method int
		 * @param {String} value
		 * @param [len] 最大桁数
		 * @return {String|undefined} エラーメッセージ
		 */
		function integer(value, len) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);
			value = value.replace(/,/g, '');

			len = parseInt(len, 10);
			var errcode = len ? 'int1' : 'int2';
			var match = value.match(/^(?:-?(0|[1-9][0-9]*))?$/);
			if (!match || (len && (match[1] || '').length > len)) {
				return msgcd2msg(errcode, len);
			}
		}

		/**
		 * 整数(>=0)
		 *
		 * @method uint
		 * @param {String} value
		 * @param [len] 最大桁数
		 * @return {String|undefined} エラーメッセージ
		 */
		function uint(value, len) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);
			value = value.replace(/,/g, '');

			len = parseInt(len, 10);
			var errcode = len ? 'int1' : 'int2';
			var match = value.match(/^(?:(0|[1-9][0-9]*))?$/);
			if (!match || (len && (match[1] || '').length > len)) {
				return msgcd2msg(errcode, len);
			}
		}

		/**
		 * 数字
		 * @method numeric
		 * @param {String} value
		 * @return {String|undefined} エラーメッセージ
		 */
		function numeric(value) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);

			var errcode = 'numeric1';
			var match = value.match(/^([0-9]+)$/);
			if (!match) {
				return msgcd2msg(errcode);
			}
		}

		/**
		 * アルファベット
		 * @method alpha
		 * @param {String} value
		 * @return {String|undefined} エラーメッセージ
		 */
		function alpha(value) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);

			if (!value.match(/^[a-zA-z]*$/)) {
				return msgcd2msg('alpha');
			}
		}

		/**
		 * 大文字
		 * @method upper
		 * @param {String} value
		 * @return {String|undefined} エラーメッセージ
		 */
		function upper(value) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);

			if (!value.match(/^[A-Z]*$/)) {
				return msgcd2msg('upper');
			}
		}
		/**
		 * アルファベットまたはピリオド('.')
		 * @method alnum
		 * @param {String} value
		 * @return {String|undefined} エラーメッセージ
		 * @example
		 * ```js
		 * clutil.Validators.alnum("foo"); // => 'エラー'
		 * ```
		 */
		function alphaPeriod(value) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);

			if (!value.match(/^[a-zA-Z\. ]*$/)) {
				return msgcd2msg('alphaperiod');
			}
		}
		/**
		 * アルファベット,数字またはピリオド('.')
		 * @method alphaNumericPeriod
		 * @param {String} value
		 * @return {String|undefined} エラーメッセージ
		 * @example
		 * ```js
		 * clutil.Validators.alnum("foo"); // => 'エラー'
		 * ```
		 */
		function alphaNumericPeriod(value) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);

			if (!value.match(/^[a-zA-Z0-9\. ]*$/)) {
				return msgcd2msg('alnumperiod');
			}
		}
		/**
		 * パスワード用（アルファベット,数字またはピリオド('.')またはハイフン('-')）
		 * @method passwd
		 * @param {String} value
		 * @return {String|undefined} エラーメッセージ
		 * @example
		 * ```js
		 * clutil.Validators.alnum("foo"); // => 'エラー'
		 * ```
		 */
		function passwd(value) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);

			if (!value.match(/^[a-zA-Z0-9-\. ]*$/)) {
				return msgcd2msg('passwd');
			}
		}
		/**
		 * アルファベットまたはピリオド('.')
		 * @method alnum
		 * @param {String} value
		 * @return {String|undefined} エラーメッセージ
		 * @example
		 * ```js
		 * clutil.Validators.alnum("foo"); // => 'エラー'
		 * ```
		 */
		function upperPeriod(value) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);

			if (!value.match(/^[A-Z\. ]*$/)) {
				return msgcd2msg('upperperiod');
			}
		}
		/**
		 * アルファベットまたはピリオド('.')
		 * @method alnum
		 * @param {String} value
		 * @return {String|undefined} エラーメッセージ
		 * @example
		 * ```js
		 * clutil.Validators.alnum("foo"); // => 'エラー'
		 * ```
		 */
		function upperNumericPeriod(value) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);

			if (!value.match(/^[A-Z0-9\. ]*$/)) {
				return msgcd2msg('uppernumperiod');
			}
		}
		/**
		 * アルファベットまたは数字
		 * @method alnum
		 * @param {String} value
		 * @return {String|undefined} エラーメッセージ
		 * @example
		 * ```js
		 * clutil.Validators.alnum("foo"); // => 'エラー'
		 * ```
		 */
		function alphaNumeric(value) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);

			if (!value.match(/^[a-zA-Z0-9]*$/)) {
				return msgcd2msg('alnum');
			}
		}

		/**
		 * アルファベットまたは数字またはハイフン
		 * @method alnum
		 * @param {String} value
		 * @return {String|undefined} エラーメッセージ
		 * @example
		 * ```js
		 * clutil.Validators.alnum("foo"); // => 'エラー'
		 * ```
		 */
		function alphaNumeric2(value) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);

			if (!value.match(/^[a-zA-Z-0-9]*$/)) {
				return msgcd2msg('alnum2');
			}
		}

		/**
		 * 最小桁数制限
		 *
		 * @method minlen
		 * @param {String} value
		 * @param {String|Integer} min 最小桁数
		 */
		function minlen(value, min) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);

			min = parseInt(min, 10);
			if (value.length < min) {
				return msgcd2msg('minlen', min);
			}
		}

		/**
		 * 最大桁数制限
		 *
		 * @method maxlen
		 * @param {String} value
		 * @param {String|Integer} max 最大桁数
		 */
		function maxlen(value, max) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);

			max = parseInt(max, 10);
			if (value.length > max) {
				return msgcd2msg('maxlen', max);
			}
		}

		/**
		 * 最小、最大桁数制限
		 * @method len
		 * @param {String} value
		 * @param {String|Integer} [min] 最小桁数
		 * @param {String|Integer} [max] 最大桁数
		 */
		function len(value, min, max) {
			if (value.length === 0) { // 空はOK!
				return;
			}
			value = safeString(value);

			min = parseInt(min, 10);
			max = parseInt(max, 10);
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

		/**
		 * @method min
		 * @param {String} value
		 * @param {String|Integer} min 最小値
		 */
		function min(value, minValue) {
			if (value.length === 0) { // 空はOK!
				return;
			}

			value = safeString(value);
			value = value.replace(/,/, '');
			value = Number(value);
			minValue = Number(minValue);
			if (isFinite(minValue) && value < minValue) {
				return msgcd2msg('min', minValue);
			}
		}

		/**
		 * @method max
		 * @param {String} value
		 * @param {String|Integer} min 最大値
		 * @return {String|undefined} エラーメッセージ
		 */
		function max(value, maxValue) {
			if (value.length === 0) { // 空はOK!
				return;
			}

			value = safeString(value);
			value = value.replace(/,/, '');
			value = Number(value);
			maxValue = Number(maxValue);
			if (isFinite(maxValue) && value > maxValue) {
				return msgcd2msg('max', maxValue);
			}
		}

		return {
			zenkaku: zenkaku,
			zenkaku_cr: zenkaku_cr,
			hankaku: hankaku,
			hankaku_cr: hankaku_cr,
			hankaku2: hankaku2,
			zenhan: zenhan,
			decimal: decimal,
			'int': integer,
			'uint': uint,
			'alpha': alpha,
			'alphaperiod': alphaPeriod,
			'alnumperiod': alphaNumericPeriod,
			'upperperiod': upperPeriod,
			'passwd': passwd,
			'uppernumperiod': upperNumericPeriod,
			'alnum': alphaNumeric,
			'alnum2': alphaNumeric2,
			numeric: numeric,
			digit: numeric,
			minlen: minlen,
			maxlen: maxlen,
			len: len,
			min: min,
			max: max,
			upper: upper
		};
	}());

	/**
	 * @method required
	 * @param {String} value
	 * @param {'id'|'date'|'select'} type チェック方法を指定する。
	 *
	 * - `id` autocompleteなどの複合型の値を持ちid属性が設定されているかどうかで必須チェックを行う。
	 * - `date` 日付け入力の必須チェックを行う
	 * - `select` プルダウンの必須チェックを行う
	 *
	 * @return {String|undefined} エラーメッセージ
	 */
	Validators.required = function (value, type) {
		var hasError = false;
		if (type === 'id') {
			hasError = !value || !value.id;
		} else if (type === 'ac') {
			hasError = !value || !value.id;
		} else if (type === 'date') {
			hasError = !parseInt(value, 10);
		} else if (type === 'select') {
			hasError = !parseInt(value, 10);
		} else {
			hasError = value == null || value === '';
		}

		if (hasError) {
			return msgcd2msg('required');
		}
	};

	Validators.accheck = function (value) {
		if (value && !value.id && value.name) {
			return msgcd2msg('autocomplete_mismatch');
		}
	};

	/**
	 * @method selected
	 * @param {String} value
	 * @return {String|undefined} エラーメッセージ
	 */
	Validators.selected = function (value) {
		if (!parseInt(value, 10)) {
			return msgcd2msg('required');
		}
	};

	/**
	 * @method required_ac
	 */
	Validators['required_ac'] = function (value) {
		if (!value || !parseInt(value.id, 10)) {
			return msgcd2msg('required');
		}
	};

	// 手抜き日本語のみ対応
	var dateToYmd = function (date) {
		try {
			return date.toLocaleString().split(' ')[0];
		} catch (e) {
			return date.toLocaleString();
		}
	};

	Validators.date = function (value, minDate, maxDate) {
		if (!clutil.checkDate({ value: value })) {
			return msgcd2msg('date_inval');
		}

		var date = new Date(value);
		// minDate
		if (!_.isDate(maxDate)) {
			maxDate = clutil.ymd2date(maxDate);
		}
		if (!_.isDate(maxDate) || isNaN(maxDate)) {
			maxDate = null;
		}
		// maxDate
		if (!_.isDate(minDate)) {
			minDate = clutil.ymd2date(minDate);
		}
		if (!_.isDate(minDate) || isNaN(minDate)) {
			maxDate = null;
		}

		if (maxDate != null && date.getTime() > maxDate.getTime()) {
			// 大きすぎ
			if (minDate != null) {
				return msgcd2msg('date_max', dateToYmd(maxDate));
			} else {
				return msgcd2msg('date_range', dateToYmd(minDate),
					dateToYmd(maxDate));
			}
		}
		if (minDate != null && date.getTime() < minDate.getTime()) {
			// 小さすぎ
			if (date.getTime() < minDate.getTime()) {
				return msgcd2msg('date_min', dateToYmd(minDate));
			} else {
				return msgcd2msg('date_range', dateToYmd(minDate), dateToYmd(maxDate));
			}
		}
	};

	/**
	 * `validator`で`value`をチェックする
	 * @method check
	 * @param {Any} validator
	 * @param {String} value
	 * @return {String|undefined} エラーメッセージ
	 * @example
	 * ```js
	 * clutils.Validators.check('int', '12345');
	 * ```
	 */
	var check = function (validateFunc, value) {
		var splitted, args, funcName;
		if (_.isString(validateFunc)) {
			splitted = validateFunc.split(':');
			if (splitted.length === 2) {
				args = splitted[1].split(',');
			}
			funcName = splitted[0];
			validateFunc = clutil.Validators[funcName];
		}

		if (!args) {
			args = [];
		}

		args.unshift(value == null ? '' : value);
		if (!validateFunc) {
			if (funcName) {
				console.warn("Invalid validator[name=" + funcName + "]");
			}
			return;
		}
		if (validateFunc)
			return validateFunc.apply(this, args);
	};

	/**
	 * `validators`で`value`をチェックする
	 * @method check
	 * @param {String} validators
	 * @param {Any} value
	 * @return {String|undefined} エラーメッセージ
	 * @example
	 * ```js
	 * clutils.Validators.checkAll('int required', '12345');
	 * ```
	 */
	var checkAll = function (validators, value) {
		var opt;

		if (_.isObject(validators) && !_.isArray(validators)) {
			opt = validators;
			validators = opt.validator;
			value = opt.value;
		} else {
			opt = {
				validators: validators,
				value: value
			};
		}

		if (_.isString(validators)) {
			validators = opt.validators = _.compact((validators || "").split(/ +/));
		}

		var error;
		_.some(validators, function (validator) {
			try {
				error = check.call(opt, validator, value);
				return error;
			} catch (e) {
				console.error(e, validators, validator, value);
			}
		});

		return error;
	};

	var getValidation = function (validation, name) {
		var arr = validation.split(/ +/), args, n;
		for (var i = 0; i < arr.length; i++) {
			args = arr[i].split(':');
			n = args[0];
			if (n === name)
				break;
		}

		if (i === arr.length)	// not found
			return;

		return {
			name: n,
			args: _.rest(args, 1)
		};
	};

	var _setValidationArgs = function (validations, name) {
		var vs = validations;
		var isStr = false;
		if (_.isString(vs)) {
			vs = vs.split(/ +/);
			isStr = true;
		}
		var newValidations = [];
		var newArgs = _.rest(arguments, 2).join(',');
		var newDef = newArgs ? name + ':' + newArgs : name;

		_.each(vs, function (d) {
			if (_.isString(d) && d.split(':')[0] === name) {
				newValidations.push(newDef);
			} else {
				newValidations.push(d);
			}
		});
		if (isStr) {
			return newValidations.join(' ');
		} else {
			return newValidations;
		}
	};

	var replaceValidation = function ($el) {
		var validations = $el,
			setAttr = false;
		if ($el instanceof jQuery) {
			validations = $el.attr('data-validator') || '';
			setAttr = true;
		}
		var args = _.rest(arguments, 1);
		args.unshift(validations);
		var newValidations = _setValidationArgs.apply(null, args);
		if (setAttr) {
			$el.attr('data-validator', newValidations);
		}
		return newValidations;
	};

	/**
	 * data-validator属性にバリデーションを追加する
	 * @method addValidation
	 * @param {jQuery} $el エレメント
	 * @param {String} name バリデーション名
	 * @param [args...] 引数
	 */
	var addValidation = function ($el, name) {
		// 引数部を組み立てる
		var args = _.rest(arguments, 2).join(',');
		// 現在のバリデーションを取る
		var v = $el.attr('data-validator') || '';
		var vs = v.split(/ +/);
		// 既存バリデーションを取り除く
		vs = _.filter(vs, function (d) {
			var n = d.split(':')[0];
			return name !== n;
		});
		// バリデーションを追加する
		vs.push(name + (args ? ':' + args : ''));
		v = vs.join(' ');
		// エレメントに割りあてる
		$el.attr('data-validator', v);
	};

	/**
	 * data-validator属性からバリデーションを削除する
	 *
	 * @method removeValidation
	 * @param {jQuery} $el エレメント
	 * @param {String} name バリデーション名
	 */
	var removeValidation = function ($el, name) {
		// 現在のバリデーション
		var v = $el.attr('data-validator') || '';
		var vs = v.split(/ +/);
		// 既存バリデーションを取り除く
		vs = _.filter(vs, function (d) {
			var n = d.split(':')[0];
			return name !== n;
		});
		v = vs.join(' ');
		// エレメントに割りあてる
		$el.attr('data-validator', v);
	};

	Validators.check = check;
	Validators.checkAll = checkAll;
	Validators.addValidation = addValidation;
	Validators.replaceValidation = replaceValidation;
	Validators.removeValidation = removeValidation;

	clutil.Validators = Validators;
}(clutil));

(function (clutil) {
	var $getElement = function (el) {
		return el instanceof $ ? el : $(el);
	};

	/**
	 * ビューのエレメントの状態のonとoffを切り替える
	 *
	 * @class ViewStateSwitcher
	 * @namespace clutil
	 * @constructor
	 */
	var ViewStateSwitcher = function () {
		this._handlers = {};
	};

	_.extend(ViewStateSwitcher.prototype, {
		/**
		 * クローンを作成する
		 * @method clone
		 * @return {ViewStateSwitcher}
		 */
		clone: function () {
			var viewStateSwitcher = new this.constructor();
			viewStateSwitcher.setHandlers(this._handlers);
			return viewStateSwitcher;
		},

		/**
		 * エレメントの状態のonとoffの切り替えを行うためのハンドラを登
		 * 録する。
		 *
		 * @method setHandlers
		 * @param {object} handlers ハンドラ
		 *
		 * ```js
		 * handlers = {
		 *   'あるCSSセレクター': {
		 *      on: function($el){
		 *        // onにするための処理
		 *      },
		 *      off: function($el){
		 *        // offにするための処理
		 *      },
		 *      check: function($el){
		 *        // onであればtrue、そうでない場合はfalseをかえす
		 *      }
		 *   },
		 *   'ほかのあるCSSセレクター': {
		 *      ...
		 *   }
		 * }
		 * ```
		 */
		setHandlers: function (handlers) {
			_.extend(this._handlers, handlers);
		},

		buildHandler: function (def) {
			return function (mode) {
				var args = _.toArray(arguments);
				return def[mode].apply(this, args);
			};
		},

		/**
		 * ビューの状態を保存する
		 *
		 * @method saveViewState
		 * @param {jquery|string|DOMelement} $view
		 * @param {object} [options]
		 * @param {string} [options.filter]
		 * @return {Array} コマンド配列 restoreViewState()に渡す
		 */
		saveViewState: function ($view, options) {
			$view = $getElement($view);
			options = _.defaults(options || {}, { filter: '*' });

			var filter = options.filter, commands = [];
			_.each(this._handlers, function (spec, is) {
				$view.find(is)
					.filter(filter)
					.each(function () {
						var el = this, $el = $(el), command, name;
						if (spec.check($el, options)) {
							command = spec.on;
							name = 'on';
						} else {
							command = spec.off;
							name = 'off';
						}
						commands.push({
							el: el,
							command: command,
							name: name
						});
					});
			});

			return commands;
		},

		/**
		 * ビューの状態を復元する
		 * @method restoreViewState
		 * @param {array} commands saveViewStateの戻り値
		 */
		restoreViewState: function (commands, options) {
			options = _.defaults(options || {});
			var that = this;
			_.each(commands.reverse(), function (command) {
				var $el = $(command.el);
				if (command.name === 'on' && that.isFixed($el, options)) {
					return;
				}
				command.command($(command.el), options);
			});
		},

		/**
		 * エレメントの状態がonに固定されているか確認する。
		 * 固定されている場合はoffに設定できない
		 * @param {jquery} $el
		 * @return {boolean} 固定されているかどうか
		 */
		isFixed: function () { return false; },

		/**
		 * 指定エレメントの状態をonに変更する
		 * @method turnOn
		 * @param {jquery|string|DOMelement} $el
		 * @param {object} [options]
		 * @param {string} [options.filter]
		 */
		turnOn: function ($el, options) {
			$el = $getElement($el);
			options || (options = {});
			_.each(this._handlers, function (spec, is) {
				if ($el.is(is)) {
					spec.on.call(null, $el, options);
				}
			});
		},

		/**
		 * 指定エレメントの状態をoffに変更する。ただしonに固定されてい
		 * る場合はoffにできない。
		 * @method turnOff
		 * @param {jquery|string|DOMelement} $el
		 * @param {object} [options]
		 * @param {string} [options.filter]
		 */
		turnOff: function ($el, options) {
			$el = $getElement($el);
			options || (options = {});
			// 固定されている場合はoffにできない
			if (this.isFixed($el, options)) return;
			_.each(this._handlers, function (spec, is) {
				if ($el.is(is)) {
					spec.off.call(null, $el, options);
				}
			});
		},

		/**
		 * ビュー内のエレメントの状態をonに変更する。
		 *
		 * @method turnOnAll
		 * @param {jquery|string|DOMelement} $el
		 * @param {object} [options]
		 * @param {string} [options.filter]
		 */
		turnOnAll: function ($view, options) {
			$view = $getElement($view);
			options = _.defaults(options || {}, { filter: '*' });

			var filter = options.filter;
			_.each(this._handlers, function (spec, is) {
				$view.find(is)
					.filter(filter)
					.each(function () {
						var el = this, $el = $(el);
						spec.on.call(null, $el, options);
					});
			});
		},

		/**
		 * ビュー内のエレメントの状態をonに変更する。ただしonに固定され
		 * ているエレメントはoffにできない。
		 *
		 * @method turnOffAll
		 * @param {jquery|string|DOMelement} $el
		 * @param {object} [options]
		 * @param {string} [options.filter]
		 */
		turnOffAll: function ($view, options) {
			$view = $getElement($view);
			options = _.defaults(options || {}, { filter: '*' });

			var filter = options.filter, that = this;
			_.each(this._handlers, function (spec, is) {
				$view.find(is)
					.filter(filter)
					.each(function () {
						var el = this, $el = $(el);
						// 固定されている場合はoffにできない
						if (that.isFixed($el, options)) return;
						// offにする
						spec.off.call(null, $el, options);
					});
			});
		}
	});

	ViewStateSwitcher.extend = Backbone.Model.extend;

	clutil.ViewStateSwitcher = ViewStateSwitcher;
}(clutil));

(function (clutil) {
	/**
	 * リードオンリー状態を切り替える
	 *
	 * @class ReadonlySwitcher
	 * @extend clutil.ViewStateSwitcher
	 * @namespace clutil
	 * @constructor
	 */
	var ReadonlySwitcher = clutil.ViewStateSwitcher.extend({
		isFixed: function ($el) {
			return $el.attr("cl-rofixed");
		}
	});

	var readonlySwitcher = new ReadonlySwitcher();
	readonlySwitcher.setHandlers({
		// Aタグ(利用されている?)
		'.cl-a-tag': {
			// readonlyに設定する
			on: function ($el) {
				$el.attr('data-href-orig', $el.attr('href'))
					.attr('href', 'javascript:void(0)')
					.addClass('cl-a-disabled')
					.prop('disabled', true);
			},
			// readonlyを解除する
			off: function ($el) {
				var href = $el.attr('data-href-orig');
				if (href)
					$el.attr('href', href);
				$el.removeClass('cl-a-disabled').prop('disabled', false);
			},
			// readonly状態ならtrueをかえす
			check: function ($el) {
				return $el.prop('disabled');
			}
		},
		// ファイルアップロード(利用されている?)
		//, input[type=file]'
		'.cl-file-attach': {
			on: function ($el) {
				if ($el.is('input')) {
					$el.prop('disabled', true);
				} else {
					$el.attr('disabled', true);
				}
			},
			off: function ($el) {
				if ($el.is('input')) {
					$el.prop('disabled', false);
				} else {
					$el.removeAttr('disabled');
				}
			},
			check: function ($el) {
				if ($el.is('input')) {
					return $el.prop('disabled');
				} else {
					return $el.attr('disabled');
				}
			}
		},
		// テキスト、テキストボックス
		'input[type=text]': {
			on: function ($el) {
				$el.prev('.cltxtFieldLimit').addClass('disabled');
				$el.prop('readonly', true).datepicker('disable');
				if ($el.hasClass('hasDatepicker')) {
					$el.parent('.datepicker_wrap').addClass('disabled');
				}
				if ($el.hasClass('cl_autocomplete')) {
					$el.prev('.autofill').hide();
				}
			},
			off: function ($el) {
				$el.prev('.cltxtFieldLimit').removeClass('disabled');
				$el.prop('readonly', false).datepicker('enable');
				if ($el.hasClass('hasDatepicker')) {
					$el.parent('.datepicker_wrap').removeClass('disabled');
				}
				if ($el.hasClass('cl_autocomplete')) {
					$el.prev('.autofill').show();
				}
			},
			check: function ($el) {
				return $el.prop('readonly');
			}
		},
		// テキストエリア
		'textarea': {
			on: function ($el) {
				$el.prev('.cltxtFieldLimit').addClass('disabled');
				$el.prop('readonly', true);

				// ここから照会モード用のためのひと手間
				var $clReadonlyContainer = $el.closest('.cl_readonly');
				var $fieldGroupInBox = $el.closest('.fieldgroupInBox ');
				if ($clReadonlyContainer.length > 0 && $fieldGroupInBox.length > 0) {
					// 照会モード表示を表すマーキング
					$fieldGroupInBox.addClass('view');
					$el.data('cl_readonly', true);

					var val = $el.val().replace(/[\n\r]/g, "<br />");
					if (_.isEmpty(val)) {
						val = '&nbsp;';		// 高さがつぶれるため空白1個入れておく
					}
					var $p = $('<p class="txtbox multiline">' + val + '</p>');
					$el.prev('p.txtbox.multiline').remove();	// ダブリが無いように。
					$el.before($p);
				}
			},
			off: function ($el) {
				var isReferenceMode = $el.data('cl_readonly');
				if (isReferenceMode) {
					// readonly なテキストエリア view を削除する
					$el.prev('p.txtbox.multiline').remove();

					// 照会モード表示を表すマーキング削除
					$el.removeData('cl_readonly');
					$el.closest('.fieldgroupInBox ').removeClass('view');
				}

				$el.prev('.cltxtFieldLimit').removeClass('disabled');
				$el.prop('readonly', false);
			},
			check: function ($el) {
				return $el.prop('readonly');
			}
		},

		// パスワード
		'input[type=password]': {
			on: function ($el) {
				$el.datepicker('disable').prop('readonly', true);
			},
			off: function ($el) {
				$el.datepicker('enable').prop('readonly', false);
			},
			check: function ($el) {
				return $el.prop('readonly');
			}
		},
		// チェックボックス：ON/OFF
		'input[type=checkbox][data-toggle=switch]': {
			on: function ($el) {
				$el.closest('.switch').bootstrapSwitch('setActive', false);
			},
			off: function ($el) {
				$el.closest('.switch').bootstrapSwitch('setActive', true);
			},
			check: function ($el) {
				return $el.closest('.switch').bootstrapSwitch('isActive') == false;
			}
		},
		// チェックボックス
		'input[type=checkbox]': {
			on: function ($el) {
				$el.prop('disabled', true).closest('label').addClass('disabled');
			},
			off: function ($el) {
				$el.prop('disabled', false).closest('label').removeClass('disabled');
			},
			check: function ($el) {
				return $el.prop('disabled');
			}
		},
		// ラジオボタン
		'input[type=radio]': {
			on: function ($el) {
				$el.prop('disabled', true);
				if ($el.is("label.radio>")) {
					$el.parent("label.radio").addClass("disabled");
				}
			},
			off: function ($el) {
				$el.prop('disabled', false);
				if ($el.is("label.radio>")) {
					$el.parent("label.radio").removeClass("disabled");
				}
			},
			check: function ($el) {
				return $el.prop('disabled');
			}
		},
		// コンボボックス(マルチセレクト未サポート)
		'select': {
			on: function ($el) {
				// TODO selectpicker('refresh')は、再レンダリングがはしっ
				// て非常に遅くなるので下のコメントのような軽量な実装に
				// 切り替えたいが、selectpickerはli要素にdisableを設定
				// するのでこれではうまくいかない
				if ($el.is('._clcombobox')) {
					$el.combobox('setEnable', false);
				} else {
					$el.prop('disabled', true)
						// .selectpicker('refresh');
						.next()
						.find('>button')
						.addClass('disabled')
						.prop('disabled', true);
				}
			},
			off: function ($el) {
				if ($el.is('._clcombobox')) {
					$el.combobox('setEnable', true);
				} else {
					$el.prop('disabled', false);
					// .next()
					// .find('>button')
					// .prop('disabled', false)
					// .end()
					// .end()
					// .selectpicker('refresh');
					var $button = $el.next().find('>button');
					$button
						.removeClass('disabled')
						.prop('disabled', false);
					if ($button.attr('tabindex') == -1) {
						$button.removeAttr('tabindex');
					}
				}
			},
			check: function ($el) {
				return $el.prop('disabled');
			}
		},
		// ボタン
		'button,.cl-file-delete': {
			on: function ($el) {
				$el.prop('disabled', true);
			},
			off: function ($el) {
				$el.prop('disabled', false);
			},
			check: function ($el) {
				return $el.prop('disabled');
			}
		}
	});

	_.extend(clutil, {
		getReadonlySwitcher: function () {
			return readonlySwitcher;
		},

		/**
		 * リードオンリーが固定された状態か判定する
		 *
		 * @method isFixedReadonly
		 * @for clutil
		 * @param {jQuery|String} el
		 * @return リードオンリーが固定されているかどうかを返す
		 */
		isFixedReadonly: function (el) {
			var $el = el instanceof $ ? el : $(el);
			return clutil.getReadonlySwitcher().isFixed($el);
		},

		/**
		 * リードオンリー状態をviewRemoveReadonlyなどで解除できないよ
		 * うに固定化する
		 *
		 * 権限モジュールがこれを使用して意図せずにリードオンリー状態を
		 * 解除できなくしている。アプリはこれを使用しないこと。
		 *
		 * @method fixReadonly
		 * @for clutil
		 * @param {jQuery|String} el
		 */
		fixReadonly: function (el) {
			var $el = el instanceof $ ? el : $(el);
			$el.attr("cl-rofixed", true);
		},

		/**
		 * リードオンリーの固定化状態を解除する。
		 *
		 * 権限モジュールがfixReadonlyを使用して意図せずにリードオンリー
		 * 状態を解除できなくしている。アプリはこれを使用しないこと。
		 *
		 * @method unfixReadonly
		 * @for clutil
		 * @param {jQuery|String} el
		 */
		unfixReadonly: function (el) {
			var $el = el instanceof $ ? el : $(el);
			$el.removeAttr("cl-rofixed", true);
		},

		/**
		 * 表示エリアを読み取り専用にする
		 *
		 * @method viewReadonly
		 * @for clutil
		 * @param {jQuery} $view 表示エリアのjQueryオブジェクト (例：$('#viewarea'))
		 * @param {Object} [options] オプション
		 * @param {String,Function} [options.filter] jQuery.filter関数への引数
		 */
		viewReadonly: function ($view, options) {
			return clutil.getReadonlySwitcher().turnOnAll($view, options);
		},

		/**
		 * 表示エリアのリードオンリー状態を保存する。
		 * @method saveReadonlyState
		 * @for clutil
		 * @param {string|jQuery|DOMElement} $view 表示エリアのjQueryオブジェクト (例：$('#viewarea'))
		 * @param {Object} [options] オプション
		 * @param {String,Function} [options.filter] jQuery.filter関数への引数
		 */
		saveReadonlyState: function ($view, options) {
			return clutil.getReadonlySwitcher().saveViewState($view, options);
		},

		/**
		 * 表示エリアを読み取り専用から戻す
		 *
		 * @method viewReadonly
		 * @for clutil
		 * @param {jQuery} $view 表示エリアのjQueryオブジェクト (例：$('#viewarea'))
		 * @param {Object} [options] オプション
		 * @param {String,Function} [options.filter] jQuery.filter関数への引数
		 */
		viewRemoveReadonly: function ($view, options) {
			return clutil.getReadonlySwitcher().turnOffAll($view, options);
		},

		/**
		 * 表示を復元する
		 * viewReadonly, viewRemoveReadonlyが行った変更を元に戻す。
		 *
		 * @method viewRestoreState
		 * @for clutil
		 * @param {Array} state - saveReadonlyStateの帰り値
		 * @param {Object} [options] オプション
		 * @param {String,Function} [options.filter] jQuery.filter関数への引数
		 * @example
		 * ```js
		 * state = clutil.saveReadonlyState($el);
		 * viewRestoreState(state);
		 * ```
		 */
		viewRestoreState: function (state, options) {
			if (!state)
				return;

			return clutil.getReadonlySwitcher().restoreViewState(state, options);
		},

		/**
		 * 指定されたエレメントのリードオンリーを解除する。
		 *
		 * @method inputReadonly
		 * @for clutil
		 * @param {jQuery|String} $input
		 * @return viewRestoreState()の引数に渡すための復元コマンド配列
		 */
		inputRemoveReadonly: function ($input) {
			return clutil.getReadonlySwitcher().turnOff($input);
		},

		/**
		 * 指定されたエレメントをリードオンリーにする。
		 *
		 * @method inputReadonly
		 * @for clutil
		 * @param {jQuery|String} $input
		 * @param {Boolean} [sw=true] falseで解除
		 * @return viewRestoreState()の引数に渡すための復元コマンド配列
		 */
		inputReadonly: function ($input, sw) {
			if (sw === false) {
				return clutil.getReadonlySwitcher().turnOff($input);
			} else {
				return clutil.getReadonlySwitcher().turnOn($input);
			}
		}
	});
}(clutil));

(function (clcom, clutil) {
	// require clutil.readonlyswitcher

	/**
	 * 権限制御に関する基本操作
	 *
	 * @class permcntl
	 * @namespace clutil
	 * @static
	 */
	clutil.permcntl = {
		/**
		 * 当該画面の権限制御対象リスト
		 * 
		 * @private
		 * @property permControledElements
		 * @for clutil.permcntl
		 */
		controled: {},

		readonlySwitcher: clutil.getReadonlySwitcher().clone(),

		/**
		 * リードオンリー状態切り替えを取得する
		 * @method getReadonlySwitcher
		 * @return {ViewStateSwitcher}
		 */
		getReadonlySwitcher: function () {
			return this.readonlySwitcher;
		},

		/**
		 * リードオンリー状態切り替えを設定する
		 * @method setReadonlySwitcher
		 * @param {ViewStateSwitcher} readonlySwitcher リードオンリー状態切り替え
		 */
		setReadonlySwitcher: function (readonlySwitcher) {
			this.readonlySwitcher = readonlySwitcher;
		},

		/**
		 * DOMエレメントに処理種別を割り当て権限制御対象リストに設定す
		 * る。その後permRefleshUI()を実行してUIの更新を行う。
		 * 
		 * @method set
		 * @param {object} perms 権限制御対象
		 * ```js
		 * perms = {
		 *   '対象エレメントのセレクター1': '処理種別1',
		 *   '対象エレメントのセレクター2': '処理種別2',
		 *   ...
		 * }
		 * ```
		 * @param {Boolean} refresh falseの場合はUIの更新を行わない。
		 * @example
		 * ```js
		 *   clutil.permcntl.set({
		 *      // 対象エレメント: 処理種別("read", "write", "del", "em"のいずれか)
		 *     // `#foo` は 参照ボタン
		 *     '#foo:' "read"
		 *     // `#bar` は 更新ボタン
		 *     "#bar": 'write',
		 *     ...
		 *   });
		 * ```
		 */
		set: function (perms, refresh) {
			this.controled = {};
			_.extend(this.controled, perms);
			if (refresh !== false) {
				this.refresh();
			}
		},

		/**
		 * DOMエレメントに処理種別を割り当て権限制御対象リストに追加す
		 * る。その後permRefleshUI()を実行してUIの更新を行う。
		 * 
		 * @method add
		 * @param {object} perms 追加する権限制御対象
		 * @param {Boolean} refresh falseの場合はUIの更新を行わない。
		 * @example
		 * ```js
		 * clutil.permcntl.add({
		 *    // 対象エレメント: 処理種別("read", "write", "del", "em"のいずれか)
		 *   '#hoge': 'read',
		 *   ...
		 * });
		 * ```
		 */
		add: function (perms, refresh) {
			_.extend(this.controled, perms);
			if (refresh !== false) {
				this.refresh();
			}
		},

		/**
		 * 権限制御対象リストをクリアする。
		 * 
		 * @method clear
		 * 
		 * @param {Bolean} [removeReadonly=false] true設定時にはクリア
		 * されるエレメントに対してclutil.inputRemoveReadonly()を行う。
		 */
		clear: function (removeReadonly) {
			var readonlySwitcher = this.getReadonlySwitcher();
			_.each(this.controled, function (role, el) {
				// jshint unused: false
				clutil.unfixReadonly(el);
				if (removeReadonly) {
					readonlySwitcher.trunOff(el);
				}
			}, this);
			this.controled = {};
		},

		/**
		 * 権限制御対象となるDOMエレメントに割り当てられた処理種別をユー
		 * ザーの権限にて実行不可の場合に、そのエレメントを無効に設定す
		 * る。
		 * @method refresh
		 */
		refresh: function () {
			var permfunc = clcom.getPermfuncByCode();
			if (!permfunc) {
				return;
			}
			var readonlySwitcher = this.getReadonlySwitcher();
			_.each(this.controled, function (role, el) {
				var allowed = clcom.checkPermfunc(role, null, permfunc);
				if (!allowed) {
					clutil.fixReadonly(el);
					readonlySwitcher.turnOn(el);
				} else {
					clutil.unfixReadonly(el);
				}
			}, this);
		},

		/**
		 * かくにん用コード
		 */
		boo: function () {
			clcom.setPermfuncMap([
				{
					func_code: "AMMSV0310",
					f_allow_read: 1,
					f_allow_write: 0,
					f_allow_del: 0,
					f_allow_em: 0
				}
			]);
		},

		/**
		 * 確認用コード2
		 * 
		 * booのあとにやると
		 */
		booo: function () {
			clutil.viewReadonly('#ca_main');
			clutil.permcntl.set({
				// リード権限があるのでreadonlyが解除される
				"#ca_srch": 'read',
				// ここから下はwrite権限がないのでreadonlyが解除されない
				'#cl_edit': 'write',
				'#ca_srchTypeID': 'write',
				"#ca_srchDate": 'write'
			});
			clutil.viewRemoveReadonly("#ca_main");
		}

	};
}(clcom, clutil));

/**
 * @module Relation
 */
(function (root) {
	var previousRelation = root.Relation;
	var Relation = {};

	Relation.noConflict = function () {
		root.Relation = previousRelation;
		return this;
	};

	Relation.tsort = function (nodes) {
		var i, sorted = [], visited = {};
		function visit(depends, id) {
			var i, nextId, deps;
			if (!visited[id]) {
				depends = depends || [];
				visited[id] = true;
				for (i = 0; i < depends.length; i++) {
					nextId = depends[i];
					visit(nodes[nextId], nextId);
				}
				sorted.push(id);
			}
		}
		_.each(nodes, visit);
		return sorted;
	};

	Relation.buildTemplate = function (text) {
		return _.template(text, null, { variable: 'it' });
	};

	Relation.getOption = Marionette.getOption;

	Relation.triggerMethod = Marionette.triggerMethod;

	root.Relation = Relation;
}(window));

(function (Relation) {
	Relation.buildAsync = function (target, doneContext, funcContext) {
		target.setAsync = function () {
			this.async = function () {
				var deferred = $.Deferred();
				if (!this.promises) {
					this.promises = [];
				}
				this.promises.push(deferred.promise());
				return function () {
					deferred.resolve();
				};
			};
		};

		target.asyncTrigger = function (name, args) {
			args = [name, this].concat(_.rest(arguments, 1));
			this.setAsync();
			var deferred = $.Deferred();
			try {
				Relation.triggerMethod.apply(funcContext, args);
				$.when.apply($, this.promises).done(function () {
					deferred.resolveWith(doneContext);
				});
			} catch (e) {
				console.error('An exception occured while processing the callback function:', e.stack);
				$.when.apply($, this.promises).done(function () {
					deferred.rejectWith(doneContext);
				});
			}
			return deferred.promise();
		};
	};
}(Relation));

(function (Relation) {
	var DependModel = Backbone.Model.extend({
		isSynced: false,

		constructor: function () {
			this.setAttrs = {};
			this.clearAttrs = {};
			Backbone.Model.prototype.constructor.apply(this, arguments);
			this.synced = new Backbone.Model(this.attributes);
			this.store();
		},

		set: function (key, val, options) {
			var attrs;

			// Handle both `"key", value` and `{key: value}` -style arguments.
			if (typeof key === 'object') {
				attrs = key;
				options = val;
			} else {
				(attrs = {})[key] = val;
			}

			options || (options = {});

			if (options.unset) {
				this.setAttrs = _.omit(this.setAttrs, _.keys(attrs));
				_.extend(this.clearAttrs, attrs);
			} else {
				_.extend(this.setAttrs, attrs);
				this.clearAttrs = _.omit(this.clearAttrs, _.keys(attrs));
			}
			if (this.isSynced && !_.isEmpty(attrs)) {
				this.isSynced = false;
			}

			var ret = Backbone.Model.prototype.set.call(this, attrs, options);

			return ret;
		},

		store: function () {
			this.setAttrs = {};
			this.clearAttrs = {};
			this.synced = new Backbone.Model(this.attributes);
			this.isSynced = true;
		},

		diff: function (attrs) {
			return this.synced.changedAttributes(this.attributes);
		}
	});

	Relation.DependModel = DependModel;
}(Relation));

/**
 * @module Relation
 */
Relation.DependGraph = (function (Relation) {

	var Handlers = Backbone.Wreqr.Handlers.extend({
		execute: function (name, args) {
			args = _.rest(arguments, 1);
			if (this.hasHandler(name)) {
				return this.getHandler(name).apply(this, args);
			}
		}
	});

	/**
	 * @class DependGraph
	 * @constructor
	 */
	var DependGraph = function (options) {
		_.bindAll(this, 'handle');
		this.options = options || {};
		this.nodes = {};
		this.model = new Relation.DependModel();
		this.handlers = new Handlers();
		this.stack = [];
	};

	DependGraph.handlers = new Handlers();

	_.extend(DependGraph.prototype, Backbone.Events, {
		triggerMethod: Relation.triggerMethod,

		clear: function () {
			this.model.clear.apply(this.model, arguments);
		},

		set: function () {
			this.model.set.apply(this.model, arguments);
		},

		/**
		 * @method sync
		 * @param [name]
		 * @param [options]
		 * @param [options.silent=false]
		 * @param [options.ev] 
		 */
		sync: function (name, options) {
			if (_.isObject(name)) {
				options = name;
				name = options.name;
			}
			name || (name = "sync");
			options || (options = {});

			// return if silent=true
			if (options.silent) {
				this.model.store();
				return;
			}

			return this.call(name, options.ev).done(function () {
				// sync model
				this.model.store();
			});
		},

		propagate: function () {
			return this.call("propagate");
		},

		handle: function (name, e) {
			if (this.handlers.hasHandler(name)) {
				return this.handlers.execute.call(this.handlers, name, e);
			} else {
				return DependGraph.handlers.execute.call(DependGraph.handlers, name, e);
			}
		},

		call: function (name, ev) {
			if (!this.sortedNodes) {
				this._sortNode();
			}
			this.triggerMethod("before", this);

			var deferred = _.reduce(this.sortedNodes, function (prev, node) {
				return prev.then(function () {
					var events = this.buildEvent(name, node, ev);
					return this.handle(name, events);
				});
			}, $.Deferred().resolveWith(this).promise(), this);

			return deferred.then(function () {
				this.triggerMethod("after", this);
				return ev;
			});
		},

		// ノードを追加する
		add: function (node) {
			this.nodes[node.id] = node;
			delete this.sortedNodes;
			return this;
		},

		// ノードを削除する
		clearNode: function () {
			this.nodes = {};
			delete this.sortedNodes;
			return this;
		},

		/**
		 * @param {Object} [name]
		 * @param {Boolean} [node]
		 * @param {Object} [ev]
		 * @return {Object}
		 * e.name イベント名
		 * e.graph このグラフのインスタンス
		 * e.node 当該ノード
		 * e.model model
		 * e.params ノードの依存パラメータ
		 * e.changes 当該nodeの依存パラメータの変更パラメータ名のリスト
		 * e.newVal ノードの更新値
		 * e.needSet ノードの値を更新するべきか
		 * e.needClear 値がクリアされるべきか
		 * e.setAsync
		 * e.trigger
		 */
		buildEvent: function (name, node, ev) {
			var model = this.model;
			var e = _.extend({}, ev);
			e.name = name;
			e.graph = this;
			e.node = node;
			e.model = model;
			e.params = model.pick(node.depends);

			// e.changes
			var changedAttrs = model.diff() || {};
			var changes = _.intersection(node.depends, _.keys(changedAttrs));
			if (!_.isEmpty(changes)) {
				e.changes = changes;
			}

			// e.needSet, e.newVal, e.needClear
			if (_.has(model.setAttrs || {}, node.id)) {
				e.needSet = true;
				e.newVal = model.get(node.id);
			} else if (e.changes) {
				e.needClear = true;
			}

			// e.setAsync, e.trigger
			Relation.buildAsync(e, this, node);

			return e;
		},

		_sortNode: function () {
			// build id => depends mapping.
			var deps = _.reduce(this.nodes, function (deps, node) {
				deps[node.id] = node.depends;
				return deps;
			}, {});

			var sorted = Relation.tsort(deps);

			// build sorted array of node.
			this.sortedNodes = [];
			_.each(sorted, function (id) {
				var node = this.nodes[id];
				if (node) {
					this.sortedNodes.push(node);
				}
			}, this);
		}
	});

	return DependGraph;
}(Relation));


(function (Relation) {
	Relation.DependGraph.handlers.setHandlers({
		"sync": function (e) {

			return e.asyncTrigger("visit")
				.then(function () {
					if (e.changes) {
						return e.asyncTrigger("depend:change");
					}
				})
				.then(function () {
					if (e.needClear) {
						return e.asyncTrigger("clear");
					}
				})
				.then(function () {
					if (e.needSet) {
						return e.asyncTrigger("set");
					}
				})
				.then(function () {
					return e.asyncTrigger("after:visit");
				});
		},
		"propagate": function (e) {
			e.changes = e.node.depends;
			e.needSet = true;
			e.newVal = e.model.get(e.node.id);
			return e.graph.handle("sync", e);
		}
	});

}(Relation));

(function (Relation) {
	var handle = Relation.DependGraph.prototype.handle;
	_.extend(Relation.DependGraph.prototype, {
		use: function (route, fn) {
			// default route to 'sync'
			if ('string' != typeof route) {
				fn = route;
				route = 'sync';
			}

			// add the middleware
			this.stack.push({ route: route, handle: fn });

			return this;
		},

		handle: function (name, e) {
			var stack = this.stack,
				graph = this,
				index = 0;
			function next() {
				var layer;

				// next callback
				layer = stack[index++];

				// all done
				if (!layer) {
					// delegate to parent
					return handle.call(graph, name, e);
				}

				if (name.indexOf(layer.route) !== 0)
					return next();

				return layer.handle(e, next);
			}
			return next();
		}
	});
}(Relation));

clutil.Relation = Relation.noConflict();

/**
 * # clutil.FieldRelation
 *
 * `clutil.FieldRelation` は、入力部品間の依存関係を管理して部品間の連携を
 * 行います。
 *
 * ## 使い方
 *
 * `relation = clutil.FieldRelation.create(name, fields, options);`
 *
 *
 * ```js
 * var view = Backbone.View.extend({
 *   initUIElement: function () {
 *     this.relation = clutil.FieldRelation.create('default', {
 *       // 組織体系選択
 *       clorgfuncselector: {
 *         el: '#ca_orgfunc_id'
 *       },
 *       // 組織レベル選択
 *       clorglevelselector: {
 *         el: '#ca_orglevel_id'
 *       },
 *       // 組織入力
 *       clorgcode: {
 *         el: '#ca_org_id'
 *       }
 *     });
 *   }
 * });
 * ```
 *
 * - clutil.FieldRelation.create(name, fields, options)を呼び出します。
 * nameで作成されるインスタンスに名前を付けます。同じ名前のインスタンス
 * は重複できないようになっています。
 *
 * - 組織レベル選択は組織体系選択に依存しています。組織入力は組織体系選
 * 択と組織レベル選択に依存しています。
 *
 * - `new clutil.FieldRelation`で初期化した時点では、組織体系選択のみの
 * プルダウン一覧が取得され選択可能な状態になります。
 *
 * - 組織体系選択部品の選択項目がUIから設定されるとその選択に応じて組織
 * レベル選択部品のプルダウン一覧が更新されます。
 *
 * - さらに組織レベル選択部品の選択項目がUIから設定されると、組織入力部
 * 品では組織体系選択と組織レベル選択の選択値に応じてコード補間が行われ
 * ます。
 *
 * - 組織体系選択を変更した場合、組織レベル選択と組織入力は空に設定され
 * ます。組織レベル選択をUIで変更した場合には、組織入力の設定値が空に設
 * 定されます。
 *
 * ## 例
 *
 * jsオブジェクトからUIの設定には`clutil.data2view`、
 * UIからJSオブジェクト生成には、`clutil.view2data` を利用する。
 * DOMから取得したり、直接DOMに設定した場合の動作は保証しない。
 *
 *
 * ```js
 *
 * // 条件入力部
 * var SrchCondView = Backbone.View.extend({
 *  el: '#ca_srchArea',
 *
 *  initialize: function(opt){
 *      // validatorエラー時の表示領域
 *      this.validator = clutil.validator(this.$el, {
 *          echoback        : $('.cl_echoback').hide()
 *      });
 *  },
 *  // 初期データ取得後に呼ばれる関数
 *  initUIElement: function(){
 *      clutil.inputlimiter(this.$el);
 *      this.fieldRelation = new clutil.FieldRelation({
 *          clitgrpfuncselector: {
 *              el: '#ca_srchItgrpFuncID'
 *          },
 *          clitgrplevelselector: {
 *              el: '#ca_srchItgrpLevelID'
 *          },
 *          clitgrpcode: {
 *              el: '#ca_srchItgrpID'
 *          }
 *      }, {
 *          // dataSourceは上の入力部品のパラメータを与える。
 *          dataSource: {
 *              ymd: clcom.ope_date
 *          }
 *      });
 *
 *      // 初期値を設定
 *      // FieldRelation(FR)で管理される部品への値の設定もdata2view
 *      // で行う。
 *
 *      // ※ ただしFRでは初期設定は不要。newした時点で適切なデフォ
 *      // ルト値が設定されるため。
 *      this.deserialize({
 *          srchItgrpFuncID: 0,
 *          srchItgrpLevelID: 0,
 *          srchItgrpID: 0
 *      });
 *  },
 *  serialize: function(){
 *      // FRな部品の値の取得もview2dataで行う。
 *      return clutil.view2data(this.$el);
 *  },
 *  deserialize: function(obj){
 *      this.deserializing = true;
 *      try{
 *          var dto = _.extend({}, obj);
 *          clutil.data2view(this.$el, dto);
 *      }finally{
 *          this.deserializing = false;
 *      }
 *  }
 * });
 * ```
 *
 * ## 入力部品一覧
 *
 * FieldRelationで管理できる入力部品は以下です。
 *
 * - clXXXXselector(clorglevelselector等)系のプルダウン部品
 * - autocomplete部品(clorgcode等),
 * - 区分選択部品 cltypeselector
 * - text: input[type=text]
 * - radio: input[type=radio]
 * - checkbox: input[type=checkbox]
 *
 * ## 依存定義
 *
 * clXXXXselectorとautocomplete部品は、部品間の依存関係が予め定義されてい
 * ます。依存関係の定義は clutil.field.js の先頭 にあります。
 *
 * ```js
 *
 * selector: {
 *         ...
 *  orgfunc: {
 *      depends: [],
 *      provide: 'orgfunc_id',
 *                 ...
 *  },
 *  orglevel: {
 *      depends: ['orgfunc_id'],
 *      provide: 'orglevel_id',
 *                 ...
 *  },
 *         ...
 * },
 * autocomplete: {
 *  ...
 *  // 商品分類入力
 *  orgcode: {
 *      depends: ['~ymd', 'orgfunc_id', 'orglevel_id'],
 *      provide: 'org_id',
 *  },
 *         ...
 * }
 * ```
 *
 * - provideで部品が出力するパラメータの名前を設定します。
 *
 * - dependsには依存パラメータの名前(他の部品がprovideしたもの)を列挙し
 * ます。
 *
 * - clXXXXXselector部品は依存パラメータ更新時にプルダウン項目をサーバ
 * から自動取得します。UIから依存パラメータが変更されたときには、未選択
 * 状態に設定されます。
 *
 * - autocomplete部品は依存パラメータが変更された時には、次回のコード入
 * 力時に更新されたパラメータでサーバ問い合わせを行います。UIから依存パ
 * ラメータが変更されたときには入力を空にします。
 *
 *
 * ## new clutil.FieldRelation
 *
 * TODO
 *
 * ## clutil.field.Field
 *
 * FRで管理する部品の基底クラス。Backbone.Viewをextendしている。
 * FRで管理される部品はこのクラスをextendする。
 *
 *
 *
 * - Field#getDependencies
 * Fieldの依存パラメータを取得する。
 *
 * - Field#setDependencies
 * Fieldの依存パラメータを設定する。
 *
 * - Field#getValue
 * Fieldの値を取得する。
 *
 * - Field#setValue
 * Fieldの値を設定する。
 *
 * - Field#render
 * 現在の依存パラメータと値をViewに反映する。
 *
 * - Field#getProvideAttrs
 * Fieldの値をFRに理解できる形式で返す。
 *
 * 以下は必要に応じてオーバーライドする。
 *
 * - Field#toAttrs
 * setValue, getValue形式をField#modelに設定するためにオブジェクトに変換
 * する。
 *
 * - Field#toValue
 * Field#modelをsetValue, getValueの形式に変換する。
 *
 * 以下をオーバーライドする
 *
 * - Field#defaultValue
 *
 * 初期化されたときのFieldの値
 *
 * - Field#onClearValue
 *
 * - Field#renderValue
 * - Field#renderDependencies
 * - Field#onCheckError
 * - Field#onClearValue
 *
 * ## clutil.fields
 *
 * clutil.fields にはFRで管理可能な全ての部品がある。
 *
 * ## checkAttrsオプション
 *
 * 依存パラメータが正しく設定されているかチェックする関数を設定できる。初
 * 期化時と部品の依存パラメータが更新時に行われる。
 *
 * 正しく設定されている場合は、falsyな値をreturnする。
 * Field#clearError関数が呼び出される。
 *
 * 依存パラメータが解決されていない場合は、trueな値をreturnする。
 * Field#onCheckError関数が呼び出される。
 *
 * ## onCheckErrorオプション, onClearCheckオプション
 *
 * 依存パラメータが未解決のときや解決されたときのコールバックを設定する。
 *
 * ```js
 * new clutil.FieldRelation({
 *   clorglevelselector: '#foo'
 *   'text hoge': {
 *     el: '#hoge',
 *     depends: ['foo'],
 *     onCheckError: function() {
 *       this.$el.prop('disabled', true);
 *     },
 *     onClearError: function() {
 *       this.$el.prop('disabled', false);
 *     }
 *   }
 * });
 * ```
 *
 * ## dependsの依存パラメータ名の表記方法
 *
 * `'~ymd'`でオプショナルなパラメータとする。
 *
 *
 * ## dependsオプション、provideオプション
 *
 * clutil.fields.text, clutil.fields.radio, clutil.fields.checkbox
 * などはdepends, provideが設定されていないので、明示的に設定する必要がある。
 *
 * 使い道はないかもしれないが、デフォルトの依存定義を上書きする。
 *
 * ```js
 * new clutil.FieldRelation({
 *   'text provide1': {
 *   },
 *   'text provide2': {
 *     depends: ['provide1']
 *   }
 * });
 * ```
 * ## addDependsオプション
 *
 * 使い道はないかもしれないが、デフォルトの依存定義に追加する。
 *
 * ## イベント
 *
 * ### `field:readonly:change` (`view`, `readonly`)
 *
 * FRに管理されるフィールドのリードオンリー状態が変更された場合に発火される。
 *
 * - `view` フィールドインスタンス
 * - `readonly` {true|false} true: 非活性化した、false: 活性化した
 *
 * @module FieldRelation
 */
if (typeof clutil.field === 'undefined') {
	clutil.field = {};
}

clutil.fieldDefs = {
	/**
	 * # セレクター部品共通オプション
	 *
	 * ###### `options.nameOnly=false`
	 * 名称のみの表示にする。
	 * ###### `options.unselectedflag=true`
	 * 空項目の表示を行わないようにする
	 * ###### `options.emptyLabel=""`
	 * 空項目のラベルを設定する
	 * ###### `options.reverse=false`
	 * 項目を逆順に並べる
	 * ###### `options.filter`
	 * 選択肢の絞り込みに利用するフィルタ関数を設定する。
	 *
	 * 例: hogeを含むものだけ表示
	 * ```js
	 * function(item){
	 *   return item.name.search(/hoge/);
	 * }
	 * ```
	 *
	 * ###### `options.selectpicker`
	 * selectpickerのオプション
	 *
	 * ###### `options.disableOnNoChoice=true`
	 *
	 * デフォルトでは必須かつ選択肢が1つ以下の場合にプルダウンをdisableにする。
	 * falseに設定するとこの処理を行わない
	 *
	 *
	 * # 共通メソッド
	 *
	 * ###### setValue(`id`)
	 * 項目を選択状態にする
	 *
	 * ###### getValue()
	 * 選択項目のidを取得
	 *
	 * ###### getAttrs()
	 *
	 * 選択項目の属性を取得
	 *
	 * ###### getItems()
	 *
	 * 候補一覧を取得
	 *
	 * ###### invalidate()
	 * 選択項目リストにない項目が設定されている場合、未選択状態にする
	 *
	 * # セレクター部品の発行イベント
	 *
	 * ##### "change" (`attrs`, `view`, `options`)
	 *
	 * 選択項目が変更された時トリガーされる。初期化時やdata2viewなどが
	 * きっかけで変更された場合でも発火される。UIから変更された場合は
	 * `options.changedByUI`が`true`に設定される。
	 *
	 * - `attrs` 選択された項目がもつ属性
	 * - `view` ビューインスタンス
	 * - `options`
	 * - `options.changedBy`
	 *     - `ui` UIから変更された場合
	 *     - `data2view` data2viewで変更された場合
	 *
	 * ##### "readonly:change" (`view`, `readonly`)
	 *
	 * 検索結果0件の場合等にビューのリードオンリー状態が変更された場合
	 * に発火される。
	 *
	 * - `view` フィールドインスタンス
	 * - `readonly` {true|false} true: 非活性化した、false: 活性化した
	 *
	 * @class clutil.fieldDefs.selector
	 * @static
	 *
	 */
	selector: {
		/**
		 * PO親ブランド選択
		 * @method clpoparentbrandselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.poTypeID - PO種別ID
		 */
		poparentbrand: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'unit_id', 'poTypeID'],
			provide: 'pbrandID',
			query: {
				url: 'am_pa_poparentbrand_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'pbrand.id': 'id',
					'pbrand.name': 'name',
					'pbrand.code': 'code'
				}
			}
		},

		/**
		 * 補正相殺項目検索
		 *
		 * 引数と返却オブジェクトのメソッドについては{{#crossLink
		 * "clutil.fieldDefs.selector"}}{{/crossLink}}も参照のこと
		 *
		 * @method cloffsetitemselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.offsetTypeID - 補正相殺区分
		 */
		offsetitem: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'unit_id', 'offsetTypeID'],
			provide: 'offsetitemID',
			query: {
				url: 'am_pa_offsetitem_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'offsetitem.id': 'id',
					'offsetitem.name': 'name',
					'offsetitem.code': 'code'
				}
			}
		},

		/**
		 * 商品属性項目定義検索プルダウンの作成
		 *
		 * 引数と返却オブジェクトのメソッドについては{{#crossLink
		 * "clutil.fieldDefs.selector"}}{{/crossLink}}も参照のこと
		 *
		 * @method clitemattrgrpfuncselector
		 * @for clutil
		 * @param {object} options
		 * @param {String|jQuery|DomElement} options.el - jQueryセレクター
		 */
		itemattrgrpfunc: {
			depends: [],
			provide: 'itemattrgrpfunc_id',
			query: {
				url: 'am_pa_itemattrgrpfunc_srch',
				itemMapping: {
					'iagfunc.id': 'id',
					'iagfunc.name': 'name',
					'iagfunc.code': 'code'
				}
			}
		},

		/**
		 * POブランド選択
		 * @method clpobrandselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.poTypeID - PO種別ID
		 */
		pobrand: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'unit_id', 'poTypeID'],
			provide: 'poBrandID',
			query: {
				url: 'am_pa_pobrand_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'brand.id': 'id',
					'brand.name': 'name',
					'brand.code': 'code'
				}
			}
		},

		/**
		 * POモデルプルダウン
		 *
		 * 引数と返却オブジェクトのメソッドについては{{#crossLink
		 * "clutil.fieldDefs.selector"}}{{/crossLink}}も参照のこと
		 *
		 * @method clpomodelselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.poTypeID - PO種別ID
		 */
		pomodel: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'unit_id', 'poTypeID'],
			provide: 'pomodelID',
			query: {
				url: 'am_pa_pomodel_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'model.id': 'id',
					'model.name': 'name',
					'model.code': 'code'
				}
			}
		},

		/**
		 * POブランドスタイルプルダウン
		 *
		 * 引数と返却オブジェクトのメソッドについては{{#crossLink
		 * "clutil.fieldDefs.selector"}}{{/crossLink}}も参照のこと
		 *
		 * @method clpobrandstyleselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.poBrandID - POブランドID
		 * @param {Integer} [options.dependAttrs.washableFlag] - ウォッシャブルフラグ
		 * @param {Integer} [options.dependAttrs.poTypeID] - PO種別ID
		 * @param {Integer} [options.dependAttrs.styleoptTypeID] - 分類区分ID
		 */
		pobrandstyle: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'poBrandID', '~washableFlag', '~poTypeID', '~styleoptTypeID'],
			provide: 'poBrandStyleID',
			query: {
				url: 'am_pa_pobrandstyle_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'brandstyle.id': 'id',
					'brandstyle.name': 'name',
					'brandstyle.code': 'code'
				}
			}
		},

		/**
		 * サイズ入力
		 *
		 * 引数と返却オブジェクトのメソッドについては{{#crossLink
		 * "clutil.fieldDefs.selector"}}{{/crossLink}}も参照のこと
		 *
		 * @method clsizeselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.itemID - 商品ID
		 * @param {Integer} options.dependAttrs.colorID - カラーID
		 */
		size: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'itemID', 'colorID'],
			provide: 'sizeID',
			query: {
				url: 'am_pa_color2size',
				requestMapping: {},
				itemMapping: {
					'sizeID': 'id',
					'sizeName': 'name',
					'sizeCode': 'code'
				},
				fakeData: {
					list: [
						{ id: 11, code: "00", name: "紺" },
						{ id: 12, code: "01", name: "ブルー" },
						{ id: 13, code: "02", name: "グレー" }
					]
				}
			}
		},

		/**
		 * POカレンダープルダウン
		 *
		 * 引数と返却オブジェクトのメソッドについては{{#crossLink
		 * "clutil.fieldDefs.selector"}}{{/crossLink}}も参照のこと
		 *
		 * @method clpocalenselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.poTypeID - PO種別ID
		 */
		pocalen: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'unit_id', 'poTypeID'],
			provide: 'pocalen_id',
			query: {
				url: 'am_pa_pocalen_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'calen.id': 'id',
					'calen.name': 'name',
					'calen.code': 'code'
				}
			}
		},
		/**
		 * 事業ユニット選択プルダウン
		 *
		 * 引数と返却オブジェクトのメソッドについては{{#crossLink
		 * "clutil.fieldDefs.selector"}}{{/crossLink}}も参照のこと
		 *
		 * @method clbusunitselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {1|0} [options.dependAttrs.flagHD=0] - HDを含むか(0:含まない,1:含む)
		 */
		busunit: {
			depends: [],
			provide: 'unit_id',
			query: {
				url: 'am_pa_busunit_srch',
				itemPath: 'body.list',
				itemMapping: {
					'busunit_id': 'id',
					'busunit_name': 'name',
					'busunit_code': 'code'
				},
				fakeData: {
					body: {
						list: [
							{ busunit_id: 1, busunit_code: '0001', busunit_name: 'name1' },
							{ busunit_id: 2, busunit_code: '0002', busunit_name: 'name2' },
							{ busunit_id: 3, busunit_code: '0003', busunit_name: 'name3' }
						]
					}
				}
			},
			clMediatorEvents: {
				change: 'clutil:clbusunitselector:change'
			},
			args: ['el', 'unselectedflag']
		},
		// 組織体系選択
		orgfunc: {
			depends: [],
			provide: 'orgfunc_id',
			query: {
				url: 'am_pa_orgfunc_srch',
				prepRequest: {
					'cond.codename': ''
				},
				fakeData: {
					list: [
						{ id: 1, code: "0001", name: "name1" },
						{ id: 2, code: "0002", name: "name2" },
						{ id: 3, code: "0003", name: "name3" }
					]
				}
			},
			args: ['el', 'unselectedflag']
		},
		// 組織階層選択
		orglevel: {
			depends: ['orgfunc_id'],
			provide: 'orglevel_id',
			query: {
				url: 'am_pa_orglevel_srch',
				prepRequest: {
					'cond.codename': ''
				},
				itemTemplate: '<%- it.name %>',
				fakeData: {
					list: [
						{ id: 1, code: "0001", name: "name1" },
						{ id: 2, code: "0002", name: "name2" },
						{ id: 3, code: "0003", name: "name3" }
					]
				}
			},
			viewOptions: {
				nameOnly: true
			},
			args: ['el',
				'orgfunc_id dependAttrs.@',
				'unselectedflag'],
			clMediatorEvents: {
				change: 'onClOrgLevelSelectorChanged'
			}
		},
		/**
		 * 組織入力プルダウン
		 *
		 * 引数と返却オブジェクトのメソッドについては{{#crossLink
		 * "clutil.fieldDefs.selector"}}{{/crossLink}}も参照のこと
		 *
		 * `options.dependAttrs.org_typeid`には以下から指定する
		 *
		 * - amcm_type.AMCM_VAL_ORG_KIND_STORE
		 *   店舗(6)
		 * - amcm_type.AMCM_VAL_ORG_KIND_CENTER
		 *   倉庫(7)
		 * - amcm_type.AMCM_VAL_ORG_KIND_HQ
		 *   本部(8)
		 *
		 * @method clorgselector
		 * @for clutil
		 * @static
		 *
		 * @param {Object} options
		 * @param {String|jQuery|HTMLElement} options.el - jQueryセレクター
		 * @param {Object|Function} options.dependAttrs
		 * @param {ymd|Function} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd|Function} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd|Function} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer|Function} options.dependAttrs.orgfunc_id - 組織体系ID
		 * @param {Integer|Function} options.dependAttrs.orglevel_id - 組織階層ID
		 * @param {Integer|Function} [options.dependAttrs.f_stockmng] - 在庫管理フラグ
		 * @param {Integer|Function} [options.dependAttrs.p_org_id] - 上位組織ID
		 * @param {Integer|Function} [options.dependAttrs.org_typeid] - 組織区分ID
		 * @param {Integer|Function} [options.dependAttrs.f_ignore_perm] 権限無視フラグ。 1の場合は、権限を見ないで検索します。上位組織IDも必ず指定すること
		 */
		org: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'orgfunc_id', '!orglevel_id', '~f_stockmng', '~p_org_id', '~org_typeid', '!f_ignore_perm'],
			provide: 'org_id',
			query: {
				url: 'am_pa_org_srch',
				itemTemplate: function (attrs) {
					if (!attrs) return '';
					var code = attrs.code || '',
						name = attrs.name || '',
						level = attrs.orglevel,
						arealevelID = clcom.getSysparam('PAR_AMMS_AREA_LEVELID') || 5,
						zonelevelID = clcom.getSysparam('PAR_AMMS_ZONE_LEVELID') || 4;

					if (level == arealevelID ||
						level == zonelevelID) {
						code = '';
					}

					return code + (name && code && ':' || '') + name;
				},
				serializeItem: function (item) {
					// unit_id属性を付与する
					var parentList = item.parentList;
					var unitLevelId = parseInt(
						clcom.getSysparam('PAR_AMMS_UNIT_LEVELID'), 10);
					var unit = _.where(parentList, { orglevel_id: unitLevelId })[0];
					item.unit_id = unit && unit.id;
					return item;
				},
				condMapping: {
					ymd: 'srchYmd',
					orgfunc_id: 'orgfunc_id',
					orglevel_id: 'orglevel_id'
				},
				itemPath: 'list',
				itemMapping: {}
			}
		},

		// 商品分類体系選択
		itgrpfunc: {
			depends: [],
			provide: 'itgrpfunc_id',
			query: {
				url: 'am_pa_itgrpfunc_srch',
				prepRequest: {
					'cond.codename': ''
				},
				fakeData: {
					list: [
						{ id: 1, code: "0001", name: "name1" },
						{ id: 2, code: "0002", name: "name2" },
						{ id: 3, code: "0003", name: "name3" }
					]
				}
			},
			args: ['el', 'unselectedflag']
		},
		// 商品分類階層選択
		itgrplevel: {
			depends: ['itgrpfunc_id'],
			provide: 'itgrplevel_id',
			query: {
				url: 'am_pa_itgrplevel_srch',
				prepRequest: {
					'cond.codename': ''
				},
				fakeData: {
					list: [
						{ id: 1, code: "0001", name: "name1" },
						{ id: 2, code: "0002", name: "name2" },
						{ id: 3, code: "0003", name: "name3" }
					]
				}
			},
			args: ['el',
				'itgrpfunc_id dependAttrs.@',
				'unselectedflag']
		},
		/**
		 * 商品属性コードのプルダウン
		 *
		 * 引数と返却オブジェクトのメソッドについては{{#crossLink
		 * "clutil.fieldDefs.selector"}}{{/crossLink}}も参照のこと
		 *
		 * @method clitemattrselector
		 * @for clutil
		 * @param {object} options
		 * @param {String|jQuery|DomElement} options.el - jQueryセレクター
		 * @param {object} options.dependAttrs
		 * @param {integer} options.dependAttrs.iagfunc_id
		 * 商品属性項目定義ID
		 * 定義IDはclconst.itemgrpfunc.jsにある。
		 * @param {integer} options.dependAttrs.itgrp_id 対象商品分類ID
		 * @param {integer} [options.dependAttrs.level] 階層([0:All,
		 * 1～:階層]) 商品属性項目定義IDがカラーかブランドのときのみ有効。さらに
		 * カラーまたはブランドのときに商品属性項目IDが未指定の場合は2となる
		 * @param {array} [options.dependAttrs.parent_ids] 親商品属性項目ID
		 * (０以外指定時有効)
		 *
		 */
		itemattr: {
			depends: ['iagfunc_id', 'itgrp_id', '!level'],
			provide: 'itemattr_id',
			defaultCond: function (attrs) {
				var iagfunc_id = attrs.iagfunc_id;
				if (iagfunc_id === clconst.ITEMATTRGRPFUNC_ID_COLOR ||
					iagfunc_id === clconst.ITEMATTRGRPFUNC_ID_BRAND) {
					// カラーかブランドの場合はlevelのデフォルト値を2に
					// 設定する
					return { level: 2 };
				}
			},
			query: {
				url: 'am_pa_itemattr_srch',
				condMapping: {},
				itemPath: 'body.list',
				itemMapping: {
					'itemattr_id': 'id',
					'itemattr_name': 'name',
					'itemattr_code': 'code'
				},
				fakeData: {
					body: {
						list: [
							{ itemattr_id: 1, itemattr_code: "0001", itemattr_name: "name1" },
							{ itemattr_id: 2, itemattr_code: "0002", itemattr_name: "name2" },
							{ itemattr_id: 3, itemattr_code: "0003", itemattr_name: "name3" }
						]
					}
				}
			},
			args: ['el',
				'iagfunc_id dependAttrs.@',
				'itgrp_id dependAttrs.@',
				'unselectedflag']
		},
		color: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'itemID'],
			provide: 'colorID',
			query: {
				url: 'am_pa_item2color',
				prepRequest: {
					'cond.codename': ''
				},
				itemMapping: {
					'color.id': 'id',
					'color.name': 'name',
					'color.code': 'code'
				},
				fakeData: {
					list: [
						{ id: 11, code: "00", name: "紺" },
						{ id: 12, code: "01", name: "ブルー" },
						{ id: 13, code: "02", name: "グレー" }
					]
				}
			}
		},

		/**
		 * サイズ行選択プルダウン
		 *
		 * 引数と返却オブジェクトのメソッドについては{{#crossLink
		 * "clutil.fieldDefs.selector"}}{{/crossLink}}も参照のこと
		 *
		 * @method clsizerowselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {Object} options.dependAttrs
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {Integer} options.dependAttrs.sizePtnID - サイズパターンID
		 * @example
		 * ```js
		 * this.sizerowField = clutil.clsizerowselector({
		 *   el: 'ca_sizerowID',
		 *   dependAttrs: {
		 *     sizePtnID: 14
		 *   }
		 * });
		 * this.sizerowField.on('change', function(item) {
		 *     console.log(item);
		 * });
		 * this.sizerowField.setValue(1);
		 * this.sizerowField.getValue(); //=> 1
		 * this.sizerowField.getAttrs(); //=> {id: 1, name: "XXX", code: "XXXX}
		 * ```
		 */
		sizerow: {
			depends: ['!srchFromDate', '!srchToDate', 'sizePtnID'],
			provide: 'sizerow_id',
			query: {
				url: 'am_pa_sizerow_srch',
				condMapping: {
					'sizePtnID': 'sizeptn_id'
				},
				itemMapping: {
					row: 'id'
				},
				fakeData: {
					list: [
						{ id: 11, code: "00", name: "紺" },
						{ id: 12, code: "01", name: "ブルー" },
						{ id: 13, code: "02", name: "グレー" }
					]
				}
			}
		},
		/**
		 * サイズグループ選択プルダウン
		 *
		 * 引数と返却オブジェクトのメソッドについては{{#crossLink
		 * "clutil.fieldDefs.selector"}}{{/crossLink}}も参照のこと
		 *
		 * @method clsizegrpselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {Boolean} [options.unselectedflag=true]
		 * falseで未選択項目を表示しない
		 * @param {String} [options.emptyLabel] 未選択項目のラベル
		 * @return {Field}
		 * @example
		 * <pre><code>
		 * this.sizegrpField = clutil.clsizegrpselector({el: 'ca_sizegrpID'});
		 * this.sizegrpField.on('change', function(item) {
		 *     console.log(item);
		 * });
		 * this.sizegrpField.setValue(1);
		 * this.sizegrpField.getValue(); //=> 1
		 * this.sizegrpField.getAttrs(); //=> {id: 1, name: "XXX", code: "XXXX}
		 * </code></pre>
		 */
		sizegrp: {
			depends: [],
			provide: "sizegrpID",
			query: {
				url: "am_pa_sizegrp_srch",
				itemMapping: {
					'sizegrp.id': 'id',
					'sizegrp.name': 'name',
					'sizegrp.code': 'code'
				}
			}
		},

		/**
		 * サイズパターン選択プルダウン(グループID指定バージョン)
		 *
		 * @method clsizeptnselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {Integer|Function} options.dependAttrs.sizegrpID - 品種ID
		 * @return {Field}
		 * @example
		 * <pre><code>
		 * this.sizeptnField = clutil.clsizeptnselector({
		 *     el: 'ca_sizeptnID',
		 *     dependAttrs: {
		 *         sizegrpID: 1,
		 *     }
		 * });
		 * this.sizeptnField.on('change', function(item) {
		 *     console.log(item);
		 * });
		 * this.sizeptnField.setValue(1);
		 * this.sizeptnField.getValue(); //=> 1
		 * this.sizeptnField.getAttrs(); //=> {id: 1, name: "XXX", code: "XXXX}
		 * </code></pre>
		 */
		sizeptn: {
			depends: ["sizegrpID"],
			provide: "sizeptnID",
			query: {
				url: "am_pa_sizeptn_srch",
				itemMapping: {
					'sizeptn.id': 'id',
					'sizeptn.name': 'name',
					'sizeptn.code': 'code'
				}
			}
		},

		/**
		 * サイズパターン選択プルダウン(品種ID指定バージョン)
		 *
		 * 引数と返却オブジェクトのメソッドについては{{#crossLink
		 * "clutil.fieldDefs.selector"}}{{/crossLink}}も参照のこと
		 *
		 * @method clsizeptn_byitgrpselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {Integer|Function} options.dependAttrs.igrp_id - 品種ID
		 * @return {Field}
		 * @example
		 * ```js
		 * this.sizeptnField = clutil.clsizeptn_byitgrpselector({
		 *     el: 'ca_sizeptnID',
		 *     dependAttrs: {
		 *         itgrp_id: 102,
		 *     }
		 * });
		 * this.sizeptnField.on('change', function(item) {
		 *     console.log(item);
		 * });
		 * this.sizeptnField.setValue(1);
		 * this.sizeptnField.getValue(); //=> 1
		 * this.sizeptnField.getAttrs(); //=> {id: 1, name: "XXX", code: "XXXX}
		 * ```
		 */
		sizeptn_byitgrp: {
			depends: ["itgrp_id"],
			provide: "sizeptnID",
			query: {
				url: "am_pa_sizeptn_srch",
				itemMapping: {
					'sizeptn.id': 'id',
					'sizeptn.name': 'name',
					'sizeptn.code': 'code'
				}
			}
		},

		/**
		 * POサイズ選択プルダウン
		 * @method clposizeselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.poBrandID - POブランドID
		 * @param {Integer} options.dependAttrs.poBrandStyleID - POブランドスタイルID
		 * @param {Integer}
		 * [options.dependAttrs.ladysStyleOptClassTypeID] - レディスス
		 * タイル・オプション分類区分ID(レディスでのみ使用)
		 */
		posize: {
			depends: ['ymd', '!srchFromDate', '!srchToDate', 'poBrandID',
				'poBrandStyleID', '!ladysStyleOptClassTypeID'],
			provide: 'poSizeID',
			query: {
				url: 'am_pa_posize_srch',
				itemMapping: {
					'size.id': 'id',
					'size.name': 'name',
					'size.code': 'code'
				}
			}
		},

		/**
		 * 棚卸スケジュール取選択プルダウン
		 *
		 * 引数と返却オブジェクトのメソッドについては{{#crossLink
		 * "clutil.fieldDefs.selector"}}{{/crossLink}}も参照のこと
		 *
		 * @method clinventcntschselector
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el jQueryセレクター
		 * @param {ymd} [options.dependAttrs.unit_id] 事業ユニットID
		 * @example
		 * ```js
		 * var inventcntschselector = clutil.clinventcntschselector({
		 *   el: "ca_inventchtschID",
		 *   dependAttrs: {unit_id: XXXX}
		 * });
		 * // 変更時コールバックの登録
		 * inventcntschselector.on("change", function(item){
		 *   // 選択変更時コールバック
		 *   // item.year   年
		 *   // item.month  月
		 *   // item.unit_id 事業ユニットID
		 *   // item.inventId 棚卸ID
		 * });
		 * // データの取得
		 * var item = inventcntscheselector.getAttrs();
		 * ```
		 */
		inventcntsch: {
			provide: 'inventcntsch_id',
			depends: ['unit_id'],
			itemTemplate: '<option value="<%- it.id %>"><%- it.year %>年<%- it.month %>月期</option>',
			defaultValue: function () {
				// 最後を選択する
				var model = this.collection.last();
				if (model) {
					return model.id;
				} else {
					return 0;
				}
			},
			query: {
				url: 'am_pa_inventcntsch_get',
				itemPath: "inventcntsch",
				getList: function (data) {
					return _(data.inventcntsch).chain()
						.map(function (item) {
							return {
								id: item.year * 100 + item.month,
								inventId: item.id,
								year: item.year,
								month: item.month,
								unit_id: item.unit_id
							};
						})
						.sortBy(function (item) {
							return item.id;
						})
						.uniq(false, function (item) {
							return item.id;
						})
						.value();
				}
			},
			onAfterInitialize: function () {
				// 降順をデフォルトにする
				if (this.options.reverse !== false) {
					this.options.reverse = true;
				}
			}
		}
	},

	/**
	 * # オートコンプリート部品共通オプション
	 *
	 * ###### `options.itemTemplate`
	 * ラベルを設定するための関数を設定する。
	 *
	 * ####### 名称のみの表示
	 * ```js
	 * clorgcode({
	 *   ...,
	 *   itemTemplate: function(attrs) {
	 *     例: 名称のみ
	 *     return attrs.name || '';
	 *   }
	 * });
	 * ```
	 *
	 * ####### 店舗ユーザーの場合は名称のみの表示
	 * ```js
	 * var org = clorgcode({
	 *   ...
	 * });
	 * var itemTemplate = org.itemTemplate;
	 * org.itemTemplate = function(attrs){
	 *   if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {
	 *     return attrs && attrs.name || '';
	 *   } else {
	 *     return itemTemplate.apply(this, arguments);
	 *   }
	 * };
	 * ```
	 * # 共通メソッド
	 *
	 * ###### setValue(`{id: ID, code: CODE, name: NAME}`)
	 * 値(id/code/nameオブジェクト)を設定する
	 *
	 * ###### getValue()
	 * 値(id/code/nameオブジェクト)を取得する。
	 *
	 * ###### getAttrs()
	 *
	 * getValue()と同じ
	 *
	 * # オートコンプリート部品の発行イベント
	 *
	 * ##### "change" (`attrs`, `view`, `options`)
	 *
	 * 選択項目が変更された時トリガーされる。初期化時やdata2viewなどが
	 * きっかけで変更された場合でも発火される。UIから変更された場合は
	 * `options.changedByUI`が`true`に設定される。
	 *
	 * - `attrs` 選択された項目がもつ属性
	 * - `view` ビューインスタンス
	 *
	 * @class clutil.fieldDefs.autocomplete
	 * @static
	 *
	 */
	autocomplete: {
		/**
		 * 追加定型タグ検索
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clfixedformtagcode
		 * @for clutil
		 * @param options
		 * @param {String|jQuery|HTMLElement} [options.el] - jQueryセレクター
		 * @param options.dependAttrs
		 * @param [options.dependAttrs.ymd]
		 * @param [options.dependAttrs.srchFromDate]
		 * @param [options.dependAttrs.srchToDate]
		 * @param options.dependAttrs.fftagType
		 *  amcm_type.AMCM_VAL_FIXEDFORM_TAG_SECOND もしくは
		 *  amcm_type.AMCM_VAL_FIXEDFORM_TAG_THIRDを指定
		 */
		fixedformtagcode: {
			depends: ['fftagType', '!ymd', '!srchFromDate', '!srchToDate'],
			query: {
				url: "am_pa_fixedformtag_srch"
			}
		},

		/**
		 * 都道府県オートコンプリート
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clprefcode
		 * @static
		 * @param {Object} options
		 * @param {String|jQuery|DOMElement} options.el - jQueryセレクター
		 * @param {object} options.dependAttrs - 条件
		 * @param {ymd|function} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd|function} [options.dependAttrs.srchToDate] - 期間終了日
		 * @example
		 * ```js
		 * clutil.clprefcode({
		 *   el: this.$('.prefID'),
		 *   dependAttrs: {
		 *     srchFromDate: clutil.getOpeDate()
		 *   }
		 * })
		 * ```
		 */
		prefcode: {
			query: {
				url: "am_pa_pref_srch",
				itemMapping: {
					'pref.id': 'id',
					'pref.code': 'code',
					'pref.name': 'name'
				}
			}
		},

		/**
		 * 画面名オートコンプリート
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clfunccode
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 */
		funccode: {
			query: {
				url: "am_pa_func_srch",
				itemMapping: {
					'func.id': 'id',
					'func.code': 'code',
					'func.name': 'name'
				}
			}
		},

		/**
		 * セットアップ検索のオートコンプリート入力
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clsetupcode
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd|Function} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd|Function} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd|Function} [options.dependAttrs.ymd] -
		 *  検索日(期間開始日=期間終了日のとき
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @return {Field}
		 */
		setupcode: {
			depends: ['unit_id', '!ymd', '!srchFromDate', '!srchToDate'],
			query: {
				url: 'am_pa_setup_srch',
				requestMapping: {
					unit_id: "cond.unitID"
				},
				itemMapping: {
					'setup.id': 'id',
					'setup.code': 'code',
					'setup.name': 'name'
				}
			}
		},

		/**
		 * セットアップ(カラー対応)検索のオートコンプリート入力
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clcolorsetupcode
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd|Function} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd|Function} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd|Function} [options.dependAttrs.ymd] -
		 *  検索日(期間開始日=期間終了日のとき
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @return {Field}
		 */
		colorsetupcode: {
			depends: ['unit_id', '!ymd', '!srchFromDate', '!srchToDate'],
			query: {
				url: 'am_pa_colorsetup_srch',
				requestMapping: {
					unit_id: "cond.unitID"
				},
				itemMapping: {
					'setup.id': 'id',
					'setup.code': 'code',
					'setup.name': 'name'
				}
			}
		},
		/**
		 * 権限検索のオートコンプリート入力
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clrolecode
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @return {Field}
		 */
		rolecode: {
			depends: [],
			query: {
				url: 'am_pa_role_srch',
				requestMapping: {},
				itemMapping: {
					'role.id': 'id',
					'role.code': 'code',
					'role.name': 'name'
				}
			}
		},
		/**
		 * POオプショングループのオートコンプリート入力
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clpooptgrpcode
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd|Function} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd|Function} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd|Function} [options.dependAttrs.ymd] -
		 *  検索日(期間開始日=期間終了日のとき
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.poTypeID - PO種別ID
		 * @return {Field}
		 */
		pooptgrpcode: {
			depends: ['unit_id', 'poTypeID', '!ymd', '!srchFromDate', '!srchToDate'],
			query: {
				url: 'am_pa_pooptgrp_srch',
				requestMapping: {
					unit_id: "cond.unitID",
					poTypeID: "cond.poTypeID"
				},
				itemMapping: {
					'optgrp.id': 'id',
					'optgrp.code': 'code',
					'optgrp.name': 'name'
				}
			}
		},
		/**
		 * メニュー選択オートコンプリート入力
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * 名称で補間を行う。
		 * @method clmenucode
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 */
		menucode: {
			depends: [],
			provide: "menuID",
			query: {
				url: "am_pa_menu_srch",
				itemTemplate: '<%- it.name %>',
				requestMapping: {},
				itemMapping: {
					'menu.id': 'id',
					'menu.code': 'code',
					'menu.name': 'name'
				}
			}
		},
		// 店舗ランクパターン検索
		storerankptncode: {
			depends: ['unit_id', '!ymd', '!srchFromDate', '!srchToDate'],
			provide: "storerankptn_id",
			query: {
				url: 'am_pa_storerankptn_srch',
				itemMapping: {
					'storerankptn_id': 'id',
					'storerankptn_code': 'code',
					'storerankptn_name': 'name'
				}
			}
		},
		// 基準在庫パターン検索
		basestockptncode: {
			depends: ['unit_id', '!ymd', '!srchFromDate', '!srchToDate'],
			provide: "basestockptn_id",
			query: {
				url: 'am_pa_basestockptn_srch',
				itemMapping: {
					'basestockptn_id': 'id',
					'basestockptn_code': 'code',
					'basestockptn_name': 'name'
				}
			}
		},

		/**
		 * 備品コード入力
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clequipcode
		 * @static
		 * @param {Object} options
		 * @param {String|jQuery|DOMElement} options.el - jQueryセレクター
		 * @param {object} options.dependAttrs - 条件
		 * @param {ymd|function} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd|function} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.equip_man_typeid 備品管理区分ID
		 * @param {Integer} [options.dependAttrs.equip_typeid] 備品区分ID
		 */
		equipcode: {
			depends: ['unit_id', 'equip_man_typeid', '!equip_typeid', '!ymd', '!srchFromDate', '!srchToDate'], // TODO
			provide: ['equip_id'],
			compat: {
				'unit_id': 'getUnitId',
				equip_man_typeid: 'getEquipManTypeId',
				ymd: 'getSrchYmd'
			},
			query: {
				url: 'am_pa_equip_srch',
				itemMapping: {
					'equip_id': 'id',
					'equip_code': 'code',
					'equip_name': 'name'
				},
				fakeData: {
					list: [
						{ vendor_id: 1, vendor_code: "0001", vendor_name: "name1" },
						{ vendor_id: 2, vendor_code: "0002", vendor_name: "name2" },
						{ vendor_id: 3, vendor_code: "0003", vendor_name: "name3" }
					]
				}
			}
		},
		// 備品取引先コード入力
		equipvendcode: {
			depends: ['unit_id', '!ymd', '!srchFromDate', '!srchToDate'], // TODO
			provide: ['equipvend_id'],
			compat: {
				'unit_id': 'getUnitId',
				ymd: 'getSrchYmd'
			},
			query: {
				url: 'am_pa_equipvend_srch',
				itemMapping: {
					'equipvend_id': 'id',
					'equipvend_code': 'code',
					'equipvend_name': 'name'
				}
			}
		},
		/**
		 * # 取引先入力オートコンプリート部品
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * ### FieldRelationで品種に依存するようにする場合にはaddDependsを使うこと
		 *
		 * ```js
		 * clvarietycode: {
		 *   ...
		 * },
		 * clvendorcode: {
		 *   ...
		 *   addDepends: ['itgrp_id']
		 * }
		 * ```
		 *
		 * @method clvendorcode
		 * @for clutil
		 * @param {object} options
		 * @param {object} options.dependAttrs
		 * @param {integer} opitons.dependAttrs.vendor_typeid 取引先区分
		 * @param {integer} [options.dependAttrs.itgrp_id] 品種
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 */
		vendorcode: {
			depends: ['vendor_typeid', '~itgrp_id', '!ymd', '!srchFromDate', '!srchToDate'],
			compat: {
				vendor_typeid: 'getVendorTypeId',
				'unit_id': 'getUnitId',
				'store_id': 'getStoreId',
				ymd: 'getSrchYmd'
			},
			provide: 'maker_id',
			query: {
				url: 'am_pa_vendor_srch',
				condMapping: {
					vendor_typeid: 'vendor_typeid'
				},
				itemPath: 'list',
				itemMapping: {
					vendor_id: 'id',
					vendor_code: 'code',
					vendor_name: 'name'
				},
				fakeData: {
					body: {
						list: [
							{ vendor_id: 1, vendor_code: "0001", vendor_name: "name1" },
							{ vendor_id: 2, vendor_code: "0002", vendor_name: "name2" },
							{ vendor_id: 3, vendor_code: "0003", vendor_name: "name3" }
						]
					}
				}
			}
		},
		/**
		 * 品種入力
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clvarietycode
		 * @for clutil
		 *
		 * @param {object} options
		 * @param {string} options.el - jQueryセレクター
		 * @param {object} options.dependAttrs
		 * @param {integer} [options.dependAttrs.unit_id] 親商品分類ID or 事業ユニットID
		 * @param {integer} [options.dependAttrs.org_id] 親組織ID
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @example
		 * # clutil.FieldRelationで管理し、事業ユニットIDを未指定にする方法
		 * ```js
		 * this.relation = clutil.FieldRelation.create('default', {
		 *   ...
		 *   clvarietycode: {
		 *     el: '#hoge',
		 *     // unit_idへの依存を取り除く
		 *     rmDepends: ['unit_id']
		 *   },
		 *   ...
		 * });
		 * ```

		 * # clutil.FieldRelationで管理し、事業ユニットでなく親組織でしぼりこむ方法
		 * ```js
		 * this.relation = clutil.FieldRelation.create('default', {
		 *   ...
		 *   clorgcode: {
		 *     el: '#ca_orgID'
		 *   },
		 *   clvarietycode: {
		 *     el: '#ca_varietyID',
		 *     // unit_idへの依存を取り除く
		 *     rmDepends: ['unit_id'],
		 *     // org_idへの依存を追加する
		 *     addDepends: ['org_id']
		 *   },
		 *   ...
		 * });
		 * ```
		 */
		varietycode: {
			depends: ['unit_id', '!ymd', '!srchFromDate', '!srchToDate'],
			provide: 'itgrp_id',
			compat: {
				unit_id: 'getParentId',
				ymd: 'getSrchYmd'
			},
			query: {
				url: 'am_pa_variety_srch',
				condMapping: {
					unit_id: 'parent_id'
				},
				itemPath: 'itgrplist',
				itemMapping: {
					itgrp_id: 'id'
				},
				fakeData: {
					body: {
						list: [
							{ itgrp_id: 1, code: "0001", name: "name1" },
							{ itgrp_id: 2, code: "0002", name: "name2" },
							{ itgrp_id: 3, code: "0003", name: "name3" }
						]
					}
				}
			}
		},

		// メーカー品番入力
		makeritemcode: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate',
				'maker_id', 'itgrp_id'],
			provide: 'itemID',
			compat: {
				maker_id: 'getMakerId',
				ymd: 'getSrchYmd'
			},
			query: {
				url: 'am_pa_makeritemcode_srch',
				requestMapping: {},
				itemMapping: {
					'itemID.id': 'id',
					'itemID.name': 'name',
					'itemID.code': 'code'
				},
				fakeData: {
					list: [
						{ id: 1001, code: "3A-1252", name: "２ＷＬＭＳＰＸＰストレッチ２Ｐ" },
						{ id: 1002, code: "M1323151", name: "３ＷＭＪ黒Ｐストレッチ２Ｐ" },
						{ id: 1003, code: "V1922160", name: "１１ＳＳＭＦＧＰＷ２ＰＡＮ黒縞" },
						{ id: 1004, code: "M1323151", name: "８ＳＲＣ２Ｂ２Ｐサマー" },
						{ id: 1005, code: "509200A", name: "１０ＳＡＦＯＲＴＵＮＡ２Ｂ２Ｐ" },
						{ id: 1006, code: "509201A", name: "１０ＳＡＦＯＲＴＵＮＡ２Ｂ２Ｐ" },
						{ id: 1007, code: "3C-1256", name: "２ＷＬＭＳＰＰストレッチ２パン" },
						{ id: 1008, code: "M1223162", name: "２ＷＭＪ白Ｐストレッチ２Ｂ２Ｐ" },
						{ id: 1009, code: "M1223163", name: "２ＷＭＪ白Ｐストレッチ２Ｂ２Ｐ" }
					]
				}
			}
		},

		/**
		 * 商品属性項目定義検索オートコンプリートの作成
		 *
		 * @method clitemattrgrpfunccode
		 * @for clutil
		 * @param {object} options
		 * @param {String|jQuery|DomElement} options.el - jQueryセレクター
		 */
		itemattrgrpfunccode: {
			depends: [],
			provide: 'itemattrgrpfunc_id',
			query: {
				url: 'am_pa_itemattrgrpfunc_srch',
				itemMapping: {
					'iagfunc.id': 'id',
					'iagfunc.name': 'name',
					'iagfunc.code': 'code'
				}
			}
		},

		/**
		 * 商品属性コードオートコンプリートの作成
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clitemattrgrpcode
		 * @for clutil
		 * @param {object} options
		 * @param {String|jQuery|DomElement} options.el - jQueryセレクター
		 * @param {object} options.dependAttrs
		 * @param {integer} options.dependAttrs.iagfunc_id
		 * 商品属性項目定義ID
		 * 定義IDはclconst.itemgrpfunc.jsにある。
		 * @param {integer} options.dependAttrs.itgrp_id 対象商品分類ID
		 * @param {integer} [options.dependAttrs.level] 階層([0:All,
		 * 1～:階層]) 商品属性項目定義IDがカラーかブランドのときのみ有効。さらに
		 * カラーまたはブランドのときに商品属性項目IDが未指定の場合は2となる
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {array} [options.dependAttrs.parent_ids] 親商品属性項目ID
		 * (０以外指定時有効)
		 *
		 */
		itemattrgrpcode: {
			depends: ['iagfunc_id', 'itgrp_id', '~level', '!ymd', '!srchFromDate', '!srchToDate'],
			provide: 'itemattr_id',
			defaultCond: function (attrs) {
				var iagfunc_id = attrs.iagfunc_id;
				if (iagfunc_id === clconst.ITEMATTRGRPFUNC_ID_COLOR ||
					iagfunc_id === clconst.ITEMATTRGRPFUNC_ID_BRAND) {
					// カラーかブランドの場合はlevelのデフォルト値を2に
					// 設定する
					return { level: 2 };
				}
			},
			query: {
				url: 'am_pa_itemattr_srch',
				itemPath: 'body.list',
				itemMapping: {
					'itemattr_id': 'id',
					'itemattr_name': 'name',
					'itemattr_code': 'code'
				},
				fakeData: {
					list: [
						{ id: 11, code: "00", name: "紺" },
						{ id: 12, code: "01", name: "ブルー" },
						{ id: 13, code: "02", name: "グレー" },
						{ id: 14, code: "03", name: "ベージュ" },
						{ id: 15, code: "04", name: "茶" },
						{ id: 16, code: "05", name: "白" }
					]
				}
			}
		},

		/**
		 * カラー入力
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @function clcolorcode
		 * @method clcolorcode
		 * @memberof clutil
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer|Function} options.dependAttrs.itemID - 商品ID
		 * @example
		 * <pre><code>
		 * this.colorField = clutil.clcolorcode({
		 *     el: 'ca_sizeID',
		 *     dependAttrs:{
		 *          itemID: 1
		 *     }
		 * });
		 * this.colorField.on('change', function(item) {
		 *     console.log(item);
		 * });
		 * this.colorField.setValue({id: 1, code:"001", name: "gray"});
		 * this.colorField.getValue();
		 * </code></pre>
		 */
		colorcode: {
			depends: ['iagfunc_id', 'itgrp_id', '~level', '!ymd', '!srchFromDate', '!srchToDate'],
			provide: 'itemattr_id',
			defaultCond: function (attrs) {
				return { iagfunc_id: amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_COLOR, level: 2 };
			},
			query: {
				url: 'am_pa_itemattr_srch',
				itemPath: 'body.list',
				itemMapping: {
					'itemattr_id': 'id',
					'itemattr_name': 'name',
					'itemattr_code': 'code'
				},
				fakeData: {
					list: [
						{ id: 11, code: "00", name: "紺" },
						{ id: 12, code: "01", name: "ブルー" },
						{ id: 13, code: "02", name: "グレー" },
						{ id: 14, code: "03", name: "ベージュ" },
						{ id: 15, code: "04", name: "茶" },
						{ id: 16, code: "05", name: "白" }
					]
				}
			}
		},

		/**
		 * サイズ入力
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clsizecode
		 * @for clutil
		 *
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.itemID - 商品ID
		 * @param {Integer} options.dependAttrs.colorID - カラーID
		 * @example
		 * <pre><code>
		 * this.sizeField = clutil.clsizecode({el: 'ca_sizeID', dependAttrs:{itemID: 1, colorID: 1}});
		 * this.sizeField.on('change', function(item) {
		 *     console.log(item);
		 * });
		 * this.sizeField.setValue({id: 1, code:"001", name: "gray"});
		 * this.sizeField.getValue();
		 * </code></pre>
		 */
		sizecode: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'itemID', 'colorID'],
			provide: 'sizeID',
			query: {
				url: 'am_pa_color2size',
				requestMapping: {},
				itemMapping: {
					'sizeID': 'id',
					'sizeName': 'name',
					'sizeCode': 'code'
				},
				codename: 'codename',
				fakeData: {
					list: [
						{ id: 11, code: "00", name: "紺" },
						{ id: 12, code: "01", name: "ブルー" },
						{ id: 13, code: "02", name: "グレー" }
					]
				}
			}
		},

		/**
		 * サイズ入力(sizeptnID指定バージョン)
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clsizecode2
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {Integer} options.dependAttrs.sizeptnID - サイズパターンID
		 * @example
		 * ```js
		 * this.sizeField = clutil.clsizecode2({
		 *   el: 'ca_sizeID',
		 *   dependAttrs:{sizeptnID: 1}
		 * });
		 * ```
		 */
		sizecode2: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'sizeptnID'],
			provide: 'sizeID',
			query: {
				url: 'am_pa_size_srch',
				itemMapping: {
					'size.id': 'id',
					'size.name': 'name',
					'size.code': 'code'
				}
			}
		},

		/**
		 * サイズパターン選択オートコンプリート
		 *
		 * @method clsizeptncode
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {Integer|Function} options.dependAttrs.sizegrpID - サイズグループID
		 * @return {Field}
		 * @example
		 * <pre><code>
		 * this.sizeptnField = clutil.clsizeptncode({
		 *     el: 'ca_sizeptnID',
		 *     dependAttrs: {
		 *         sizegrpID: 1,
		 *         // or
		 *         sizegrpID: function(){
		 *             return $sizegrpID.val()
		 *         }
		 *     }
		 * });
		 * this.sizeptnField.on('change', function(item) {
		 *     console.log(item);
		 * });
		 * this.sizeptnField.setValue(1);
		 * this.sizeptnField.getValue(); //=> 1
		 * this.sizeptnField.getAttrs(); //=> {id: 1, name: "XXX", code: "XXXX}
		 * </code></pre>
		 */
		sizeptncode: {
			depends: ["sizegrpID"],
			provide: "sizeptnID",
			query: {
				url: "am_pa_sizeptn_srch",
				itemMapping: {
					'sizeptn.id': 'id',
					'sizeptn.name': 'name',
					'sizeptn.code': 'code'
				}
			}
		},

		// 商品分類体系入力
		itgrpfunccode: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate'],
			provide: ['itgrpfunc_id'],
			compat: {
				ymd: 'getSrchYmd'
			},
			query: {
				url: 'am_pa_itgrpfunc_srch',
				condMapping: {
					ymd: 'srchYmd'
				},
				itemMapping: {}
			}
		},
		// 商品分類階層
		itgrplevel: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'itgrpfunc_id'],
			provide: 'itgrplevel_id',
			compat: {
				ymd: 'getSrchYmd',
				itgrpfunc_id: 'getItgrpFuncId'
			},
			query: {
				url: 'am_pa_itgrplevel_srch',
				condMapping: {
					ymd: 'srchYmd',
					itgrpfunc_id: 'itgrpfunc_id'
				},
				itemPath: 'list',
				itemMapping: {}
			}
		},
		/**
		 * 商品分類入力
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clitgrpcode
		 * @for clutil
		 *
		 * @param {Object} options
		 * @param {String|jQuery|HTMLElement} [options.el] - jQueryセレクター
		 * @param {Object|Function} options.dependAttrs
		 * @param {ymd|Function} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd|Function} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd|Function} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer|Function} options.dependAttrs.itgrpfunc_id - 商品体系ID
		 * @param {Integer|Function} options.dependAttrs.itgrplevel_id - 商品分類階層ID
		 * @param {Integer|function} options.dependAttrs.parent_id - 親商品分類ID
		 *
		 */
		itgrpcode: {
			depends: ['!ymd', '~parent_id', 'itgrpfunc_id', 'itgrplevel_id'],
			provide: 'itgrp_id',
			compat: {
				itgrpfunc_id: 'getItgrpFuncId',
				itgrplevel_id: 'getItgrpLevelId',
				parent_id: 'getParentId',
				ymd: 'getSrchYmd'
			},
			query: {
				url: 'am_pa_itgrp_srch',
				condMapping: {
					ymd: 'srchYmd',
					itgrpfunc_id: 'itgrpfunc_id',
					itgrplevel_id: 'itgrplevel_id'
				},
				itemPath: 'list',
				itemMapping: {}
			}
		},
		// 組織体系入力
		orgfunccode: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate'],
			provide: 'orgfunc_id',
			compat: {
				ymd: 'getSrchYmd'
			},
			query: {
				url: 'am_pa_orgfunc_srch',
				condMapping: {
					ymd: 'srchYmd'
				},
				itemPath: 'list',
				itemMapping: {}
			}
		},
		// 組織階層入力
		orglevel: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'orgfunc_id'],
			provide: 'orglevel_id',
			compat: {
				orgfunc_id: 'getOrgFuncId',
				ymd: 'getSrchYmd'
			},
			query: {
				url: 'am_pa_orglevel_srch',
				condMapping: {
					ymd: 'srchYmd',
					orgfunc_id: 'orgfunc_id'
				},
				itemPath: 'list',
				itemMapping: {}
			}
		},
		/**
		 * 組織入力オートコンプリート部品
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 *
		 * `options.dependAttrs.org_typeid`には以下から指定する
		 *
		 * - amcm_type.AMCM_VAL_ORG_KIND_STORE
		 *   店舗(6)
		 * - amcm_type.AMCM_VAL_ORG_KIND_CENTER
		 *   倉庫(7)
		 * - amcm_type.AMCM_VAL_ORG_KIND_HQ
		 *   本部(8)
		 *
		 * @method clorgcode
		 * @for clutil
		 * @static
		 *
		 * @param {Object} options
		 * @param {String|jQuery|HTMLElement} options.el - jQueryセレクター
		 * @param {Object|Function} options.dependAttrs
		 * @param {ymd|Function} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd|Function} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd|Function} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer|Function} options.dependAttrs.orgfunc_id - 組織体系ID
		 * @param {Integer|Function} options.dependAttrs.orglevel_id - 組織階層ID
		 * @param {Integer|Function} [options.dependAttrs.f_stockmng] - 在庫管理フラグ
		 * @param {Integer|Function} [options.dependAttrs.p_org_id] - 上位組織ID
		 * @param {Integer|Function} [options.dependAttrs.org_typeid]
		 *  組織区分ID 。
		 *  amcm_type.AMCM_VAL_ORG_KIND_XXXXを指定する。
		 *  組織区分ID(複数)との同時使用は不可。
		 * @param {Array|Function} [options.dependAttrs.org_typeid_list]
		 *	組織区分ID(複数) 。
		 *	``amcm_type.AMCM_VAL_ORG_KIND_XXXX``のリストを指定する。
		 *	組織区分IDとの同時使用は不可。
		 * @param {Integer|Function} [options.dependAttrs.f_ignore_perm] 権限無視フラグ。 1の場合は、権限を見ないで検索します。上位組織IDも必ず指定すること
		 * @param {Function} options.getOrgFuncId  deprecated 組織体系ID
		 * @param {Function} options.getOrgLevelId deprecated 組織階層ID
		 * @param {Function} [options.getSrchYmd] deprecated  検索日(期間開始日=期間終了日のとき)
		 *
		 */
		orgcode: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'orgfunc_id', '!orglevel_id', '~f_stockmng', '~p_org_id', '~org_typeid', '!f_ignore_perm'],
			compat: {
				orgfunc_id: 'getOrgFuncId',
				orglevel_id: 'getOrgLevelId',
				ymd: 'getSrchYmd'
			},
			provide: 'org_id',
			query: {
				url: 'am_pa_org_srch',
				itemTemplate: function (attrs) {
					if (!attrs) return '';
					var code = attrs.code || '',
						name = attrs.name || '',
						level = attrs.orglevel,
						arealevelID = clcom.getSysparam('PAR_AMMS_AREA_LEVELID') || 5,
						zonelevelID = clcom.getSysparam('PAR_AMMS_ZONE_LEVELID') || 4;

					if (level == arealevelID ||
						level == zonelevelID) {
						code = '';
					}

					return code + (name && code && ':' || '') + name;
				},
				serializeItem: function (item) {
					// unit_id属性を付与する
					var parentList = item.parentList;
					var unitLevelId = parseInt(
						clcom.getSysparam('PAR_AMMS_UNIT_LEVELID'), 10);
					var unit = _.where(parentList, { orglevel_id: unitLevelId })[0];
					item.unit_id = unit && unit.id;
					return item;
				},
				condMapping: {
					ymd: 'srchYmd',
					orgfunc_id: 'orgfunc_id',
					orglevel_id: 'orglevel_id'
				},
				prepRequest: {
					'cond.codename': ''
				},
				itemPath: 'list',
				itemMapping: {}
			}
		},

		/**
		 * POブランド選択
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @function clpobrandcode
		 * @method clpobrandcode
		 * @memberof clutil
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.poTypeID - PO種別ID
		 */
		pobrandcode: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'unit_id', 'poTypeID'],
			provide: 'poBrandID',
			query: {
				url: 'am_pa_pobrand_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'brand.id': 'id',
					'brand.name': 'name',
					'brand.code': 'code'
				}
			}
		},

		/**
		 * PO親ブランド選択
		 * @function clpoparentbrand
		 * @method clpoparentbrand
		 * @memberof clutil
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.poTypeID - PO種別ID
		 */
		poparentbrand: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'unit_id', 'poTypeID'],
			provide: 'pbrandID',
			query: {
				url: 'am_pa_poparentbrand_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'pbrand.id': 'id',
					'pbrand.name': 'name',
					'pbrand.code': 'code'
				}
			}
		},

		/**
		 * PO生地ID選択
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @function clpoclothid
		 * @method clpoclothid
		 * @memberof clutil
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.poTypeID - PO種別ID
		 */
		poclothid: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'unit_id', 'poTypeID'],
			provide: 'poclothidID',
			query: {
				url: 'am_pa_poclothid_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'clothid.id': 'id',
					'clothid.name': 'name',
					'clothid.code': 'code'
				}
			}
		},

		/**
		 * POメーカー検索
		 * @function clpomaker
		 * @method clpomaker
		 * @memberof clutil
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.poTypeID - PO種別ID
		 */
		pomaker: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'unit_id', 'poTypeID'],
			provide: 'pomaker_id',
			query: {
				url: 'am_pa_pomaker_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'maker.id': 'id',
					'maker.name': 'name',
					'maker.code': 'code'
				}
			}
		},

		/**
		 * PO店舗グループ検索
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @function clpostgrpcode
		 * @method clpostgrpcode
		 * @memberof clutil
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.poTypeID - PO種別ID
		 */
		postgrpcode: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'unit_id', 'poTypeID'],
			provide: 'postgrp_id',
			query: {
				url: 'am_pa_postgrp_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'stgrp.id': 'id',
					'stgrp.name': 'name',
					'stgrp.code': 'code'
				}
			}
		},

		/**
		 * POカレンダー検索
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @function clpocalencode
		 * @method clpocalencode
		 * @memberof clutil
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.poTypeID - PO種別ID
		 */
		pocalencode: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'unit_id', 'poTypeID'],
			provide: 'pocalen_id',
			query: {
				url: 'am_pa_pocalen_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'calen.id': 'id',
					'calen.name': 'name',
					'calen.code': 'code'
				}
			}
		},

		/**
		 * PO生地品番選択
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @function clpoclothcode
		 * @method clpoclothcode
		 * @memberof clutil
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} [options.dependAttrs.poclothidID] - PO生地IDID
		 * @param {Integer} [options.dependAttrs.poTypeID] - PO種別ID
		 */
		poclothcode: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'unit_id', '!poclothidID', '!poTypeID'],
			provide: 'poclothcodeID',
			query: {
				url: 'am_pa_poclothcode_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'clothcode.id': 'id',
					'clothcode.name': 'name',
					'clothcode.code': 'code'
				}
			}
		},

		/**
		 * POモデル選択
		 *
		 * @function clpomodelcode
		 * @method clpomodelcode
		 * @memberof clutil
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.unit_id - 事業ユニットID
		 * @param {Integer} options.dependAttrs.poTypeID - PO種別ID
		 */
		pomodelcode: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'unit_id', 'poTypeID'],
			provide: 'pomodelID',
			query: {
				url: 'am_pa_pomodel_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'model.id': 'id',
					'model.name': 'name',
					'model.code': 'code'
				}
			}
		},

		/**
		 * POブランドスタイル選択
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clpobrandstyle
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.poBrandID - POブランドID
		 * @param {Integer} [options.dependAttrs.washableFlag] - ウォッシャブルフラグ
		 * @param {Integer} [options.dependAttrs.poTypeID] - PO種別ID
		 * @param {Integer} [options.dependAttrs.styleoptTypeID] - 分類区分ID
		 */
		pobrandstyle: {
			depends: ['!ymd', '!srchFromDate', '!srchToDate', 'poBrandID', '~washableFlag', '~poTypeID', '~styleoptTypeID'],
			provide: 'poBrandStyleID',
			query: {
				url: 'am_pa_pobrandstyle_srch',
				condMapping: {
					unit_id: 'unitID'
				},
				itemMapping: {
					'brandstyle.id': 'id',
					'brandstyle.name': 'name',
					'brandstyle.code': 'code'
				}
			}
		},

		/**
		 * POサイズ選択オートコンプリート
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @method clposize
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {ymd} [options.dependAttrs.srchFromDate] - 期間開始日
		 * @param {ymd} [options.dependAttrs.srchToDate] - 期間終了日
		 * @param {ymd} [options.dependAttrs.ymd] - 検索日(期間開始日=期間終了日のとき)
		 * @param {Integer} options.dependAttrs.poBrandID - POブランドID
		 * @param {Integer} options.dependAttrs.poBrandStyleID - POブランドスタイルID
		 * @param {Integer}
		 * [options.dependAttrs.ladysStyleOptClassTypeID] - レディスス
		 * タイル・オプション分類区分ID(レディスでのみ使用)
		 */
		posize: {
			depends: ['ymd', '!srchFromDate', '!srchToDate', 'poBrandID',
				'poBrandStyleID', '~ladysStyleOptClassTypeID'],
			provide: 'poSizeID',
			query: {
				url: 'am_pa_posize_srch',
				requestMapping: {},
				itemMapping: {
					'size.id': 'id',
					'size.name': 'name',
					'size.code': 'code'
				}
			}
		},

		/**
		 * 年週選択オートコンプリート
		 *
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * ### TODO
		 *
		 * - 年の開始年と終了年
		 *
		 * @method clyearmonthcode
		 * @for clutil
		 * @static
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {yyyymm} options.initValue 初期値
		 * @param {yyyymm} options.startYearMonth 開始年月(指定月も含む)
		 * @param {yyyymm} options.endYearMonth 終了年月(指定月も含む)
		 * @example
		 * ### 初期化
		 * ```js
		 * yearmonthcode = clutil.clyearmonthcode({
		 *   el: '#yearmonthID'
		 * });
		 * ```
		 * ### 設定
		 * ```
		 * yearmonthcode.setValue(201408);
		 * ```
		 * ### 取得
		 * ```
		 * yearmonthcode.getValue(); //=> 201408
		 * ```
		 */
		yearmonthcode: {
			provide: 'yearmonthID',
			isCompoundValue: false,
			query: {
				itemTemplate: '<%- (it.id - it. id % 100) / 100 %>年<%- it.id % 100 %>月'
			},
			autocomplete: {
				minLength: 4,
				maxItems: 12,
				source: function (request, response, view) {
					var startYearMonth = view.options.startYearMonth,
						endYearMonth = view.options.endYearMonth;
					if (startYearMonth == null)
						startYearMonth = -Infinity;
					if (endYearMonth == null)
						endYearMonth = Infinity;

					var term = request.term || '';
					var reg = /^([0-9]{4,4})(月)?([0-9]{0,2})/;
					if (!reg.test(term)) {
						return;
					}
					term = term.replace(reg, '$1$3');
					var year = term.substring(0, 4);
					console.log(term);

					var data = [];
					for (var i = 0; i < 12; i++) {
						var month = i + 1;
						var id = year * 100 + month;

						if (String(id).indexOf(term) < 0) {
							continue;
						}
						if (id < startYearMonth || id > endYearMonth) {
							continue;
						}
						data.push({
							id: id
						});
					}
					response(data);
				}
			},

			onAfterInitialize: function (view) {
				// フォーカスしたときに yyyymm 形式、ブラーしたときは
				// yyyy年mm月を表示
				view.$el.inputlimiter('addfilter', '__yearmonthcode', {
					mask: function (value) {
						var attrs = view.getAttrs();
						if (attrs && attrs.id) {
							return view.itemTemplate(attrs);
						} else {
							return value;
						}
					},
					unmask: function (value, options) {
						var attrs = view.getAttrs();
						if (options.eventType !== 'keypress' &&
							attrs && attrs.id) {
							value = String(attrs.id);
						}
						return value;
					}
				});
			}
		},

		/**
		 * 年週選択オートコンプリート
		 *
		 * 初期値の設定および値の設定方法は`clutil.ymd2week` の例を参照
		 * のこと
		 *
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @static
		 * @method clyearweekcode
		 * @for clutil
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {yyyyww} options.initValue 初期値
		 * @example
		 * ### 初期化
		 * ```js
		 * yearweekcode = clutil.clyearweekcode({
		 *   el: '#yearweekID'
		 * });
		 * ```
		 * ### 取得
		 * ```
		 * yearmonthcode.getValue(); //=> {yyyyww: 201411, name: "..."}
		 * ```
		 */
		yearweekcode: {
			provide: 'yearweekID',
			query: {
				url: 'am_pa_yearweek_srch',
				itemTemplate: '<%= it.name %>',
				codename: 'cond.yyyyww',
				itemMapping: {
					'yyyyww': 'id'
				}
			},
			autocomplete: {
				minLength: 5
			},

			onAfterInitialize: function (view) {
				// フォーカスしたときに yyyyww 形式、ブラーしたときはnameを表示するinputlimiterを設定する
				view.$el.inputlimiter('addfilter', '__yearweekcode', {
					mask: function (value) {
						var attrs = view.getAttrs();
						if (attrs && attrs.name) {
							return attrs.name;
						} else {
							return value;
						}
					},
					unmask: function (value, options) {
						var attrs = view.getAttrs();
						if (options.eventType !== 'keypress' &&
							attrs && attrs.yyyyww) {
							value = String(attrs.yyyyww);
						}
						return value;
					}
				});
			}
		},

		/**
		 * ユーザー定義オートコンプリート
		 *
		 * {{#crossLink "clutil.fieldDefs.autocomplete"}}{{/crossLink}}も参照のこと
		 *
		 * @static
		 * @method clautocomplete1
		 * @for clutil
		 * @param {Object} options
		 * @param {String} options.el - jQueryセレクター
		 * @param {idCodeName} [options.initValue] 初期値
		 * @param {array|function} [options.candidate] 候補リスト
		 * @param {function} [options.getFilter] 絞り込み関数
		 * @example
		 * ### 初期化
		 * ```js
		 * foo = clutil.clautocomplete1({
		 *   el: '#foo',
		 *   candidate: [
		 *     {id: 1, code: '001', name: 'Item-1'},
		 *     {id: 2, code: '002', name: 'Item-2'},
		 *     {id: 3, code: '003', name: 'Item-3'}
		 *   ]
		 * });
		 * ```
		 * ### 設定
		 * ```js
		 * foo.setValue({id: 2, code: '002', name: 'Item-2'});
		 * ```
		 *
		 * ### 取得
		 * ```
		 * foo.getValue(); //=> {id: ..., code: ..., name: ...}
		 * ```
		 */
		autocomplete1: {
			autocomplete: {
				source: function (request, response, view) {
					var term = request.term;
					var template = view.itemTemplate;
					var candidate = view.options.candidate;
					if (_.isFunction(candidate)) {
						candidate = candidate.call(view);
					}
					var filter = function (item) {
						var label = template(item);
						return label.indexOf(term) >= 0;
					};
					if (view.options.getFilter) {
						filter = view.options.getFilter.call(view, request);
					}
					response(_.filter(candidate, filter));
				}
			}
		}
	}
};

(function (clcom, clutil, clutil_field) {
	var debug = _.identity;

	var fieldDefs = clutil.fieldDefs;

	// Some code is borrowed from Backbone.Mariontte

	////////////////////////////////////////////////////////////////
	// Trigger an event and a corresponding method name. Examples:
	//
	// `this.triggerMethod("foo")` will trigger the "foo" event and
	// call the "onFoo" method.
	//
	// `this.triggerMethod("foo:bar") will trigger the "foo:bar" event and
	// call the "onFooBar" method.
	var triggerMethod = (function () {

		// split the event name on the :
		var splitter = /(^|:)(\w)/gi;

		// take the event section ("section1:section2:section3")
		// and turn it in to uppercase name
		function getEventName(match, prefix, eventName) {
			return eventName.toUpperCase();
		}

		// actual triggerMethod name
		var triggerMethod = function (event) {
			// get the method name from the event name
			var methodName = 'on' + event.replace(splitter, getEventName);
			var method = this[methodName];

			// trigger the event
			this.trigger.apply(this, arguments);

			// call the onMethodName if it exists
			if (_.isFunction(method)) {
				// pass all arguments, except the event name
				return method.apply(this, _.tail(arguments));
			}
		};

		return triggerMethod;
	})();

	////////////////////////////////////////////////////////////////
	// Some code is borrowed from backbone-deep-model
	var keyPathSeparator = '.';
	/**
	 * Takes a nested object and returns a shallow object keyed with the path names
	 * e.g. { "level1.level2": "value" }
	 *
	 * @param  {Object}      Nested object e.g. { level1: { level2: 'value' } }
	 * @return {Object}      Shallow object with path names e.g. { 'level1.level2': 'value' }
	 */
	function objToPaths(obj) {
		var ret = {},
			separator = keyPathSeparator;

		for (var key in obj) {
			var val = obj[key];

			if (val && val.constructor === Object && !_.isEmpty(val)) {
				//Recursion for embedded objects
				var obj2 = objToPaths(val);

				for (var key2 in obj2) {
					var val2 = obj2[key2];

					ret[key + separator + key2] = val2;
				}
			} else {
				ret[key] = val;
			}
		}

		return ret;
	}

	/**
	 * @param {Object}  Object to fetch attribute from
	 * @param {String}  Object path e.g. 'user.name'
	 * @return {Mixed}
	 */
	function getNested(obj, path, return_exists) {
		var separator = keyPathSeparator;

		var fields = path.split(separator);
		var result = obj;
		return_exists || (return_exists === false);
		for (var i = 0, n = fields.length; i < n; i++) {
			if (return_exists && !_.has(result, fields[i])) {
				return false;
			}
			result = result[fields[i]];

			if (result == null && i < n - 1) {
				result = {};
			}

			if (typeof result === 'undefined') {
				if (return_exists) {
					return true;
				}
				return result;
			}
		}
		if (return_exists) {
			return true;
		}
		return result;
	}

	/**
	 * @param {Object} obj                Object to fetch attribute from
	 * @param {String} path               Object path e.g. 'user.name'
	 * @param {Object} [options]          Options
	 * @param {Boolean} [options.unset]   Whether to delete the value
	 * @param {Mixed}                     Value to set
	 */
	function setNested(obj, path, val, options) {
		options = options || {};

		var separator = keyPathSeparator;

		var fields = path.split(separator);
		var result = obj;
		for (var i = 0, n = fields.length; i < n && result !== undefined; i++) {
			var field = fields[i];

			//If the last in the path, set the value
			if (i === n - 1) {
				options.unset ? delete result[field] : result[field] = val;
			} else {
				//Create the child object if it doesn't exist, or isn't an object
				if (typeof result[field] === 'undefined' || !_.isObject(result[field])) {
					result[field] = {};
				}

				//Move onto the next part of the path
				result = result[field];
			}
		}
	}

	function deleteNested(obj, path) {
		setNested(obj, path, null, { unset: true });
	}
	////////////////////////////////////////////////////////////////
	function buildTemplate(text) {
		if (_.isFunction(text)) return text;
		return _.template(text, null, { variable: 'it' });
	}

	// this code is borrowed from backbone.marionette

	// Retrieve an object, function or other value from a target
	// object or its `options`, with `options` taking precedence.
	var getOption = function (target, optionName) {
		if (!target || !optionName) { return; }
		var value;

		if (target.options && (optionName in target.options) && (target.options[optionName] !== undefined)) {
			value = target.options[optionName];
		} else {
			value = target[optionName];
		}

		return value;
	};

	var objKeyConv = function (src, mapping, result) {
		result || (result = {});
		var converted = _.reduce(mapping, function (memo, newKey, key) {
			var value;
			if (/ +/.test(newKey)) {
				value = getNested(src, key);
				_.each(newKey.split(/ +/), function (newKey) {
					setNested(memo, newKey, value);
				});
			} else {
				value = getNested(src, key);
				setNested(memo, newKey, value);
			}
			return memo;
		}, {});
		return _.extend(result, src, converted);
	};

	var tsort = function (nodes) {
		var i, sorted = [], visited = {};
		function visit(depends, id) {
			var i, nextId, deps;
			if (!visited[id]) {
				depends = depends || [];
				visited[id] = true;
				for (i = 0; i < depends.length; i++) {
					nextId = depends[i];
					visit(nodes[nextId], nextId);
				}
				sorted.push(id);
			}
		}
		_.each(nodes, visit);
		return sorted;
	};

	////////////////////////////////////////////////////////////////
	/**
	 *
	 * @class clutil.FieldRelation
	 * @constructor
	 */
	var fieldNameSplitter = /\s+/;
	function FieldRelation(fields, options) {
		_.bindAll(this, 'onAfterReset');
		this.options = options || {};
		this.id = this.options.id;
		// 全インスタンスをスタティックに保存
		FieldRelation.addFieldRelation(this);
		// 全てのフィールドの依存属性を保持する
		this._deps = {};
		// 全てのフィールドを保持する
		this._fields = {};
		this.fields = {};
		// resolve()の呼び出しまでの変更を保持
		this._changes = {};
		// 全てのfieldの値を保存する
		this.model = new Backbone.Model();
		// fieldインスタンス作成とthis._deps, this._fieldsへの登録
		this.setFields(fields);
		// FR#resolveを遅延するためのDeferredオブジェクト
		this._resolveDeferred = $.Deferred().resolveWith(this);
		// FR#setを遅延するためDeferredオブジェクト
		this._setDeferred = $.Deferred().resolveWith(this);
		this.dataSource = this.options.dataSource || {};
	}

	_.extend(FieldRelation.prototype, Backbone.Events, {

		createField: function (funcName, fieldOptions) {
			if (_.isString(fieldOptions)) {
				// fieldOptionsはjQuery selectorのときもある
				fieldOptions = {
					el: fieldOptions
				};
			}

			var id = funcName, name, func, field;
			if (fieldNameSplitter.test(funcName)) {
				var names = funcName.split(fieldNameSplitter);
				name = names[1];
				funcName = names[0];
				id = names[1];
			}

			fieldOptions || (fieldOptions = {});
			if (_.isFunction(fieldOptions)) {
				func = fieldOptions;
				var options = {};
				if (name) {
					options.name = name;
				}
				field = func();
			} else {
				fieldOptions.hasFieldRelation = true;
				fieldOptions.render = false;
				if (name) {
					fieldOptions.name = name;
				}
				func = clutil.fields[funcName];
				if (!func) {
					throw ('clutil.' + funcName + ' is not a function');
				}
				field = func.call(null, fieldOptions);
			}

			field._frid = this.id;
			// field.idは
			// funcName: {
			//    ...
			// } => id=funcName;
			// 'funcName ID': {
			//    ...
			// } => id=ID
			field.id = id;

			_.each(field.branches, function (addParam) {
				var branch = new Branch({
					depends: [field.provide],
					provide: addParam
				});
				this.addField(branch);
			}, this);
			return field;
		},

		addField: function (field) {
			this._deps[field.provide] = field.depends;
			this._fields[field.provide] = field;
			this.fields[field.id] = field;
			this.model.set(field.getProvideAttrs());
			if (!field.isBranch) {
				this.listenTo(field, 'fr:change', this.onFieldChange);
				this.listenTo(field, 'fr:remove', this.onFieldRemove);
				this.listenTo(field, {
					all: function (name) {
						var args = _.toArray(arguments);
						if (!/^field:/.test(name)) {
							args[0] = 'field:' + name;
						}
						this.trigger.apply(this, args);
					}
				});
			}
		},

		setFields: function (fields) {
			_.each(fields, function (fieldOptions, funcName) {
				var field = this.createField(funcName, fieldOptions);
				this.addField(field);
			}, this);
		},

		// options.noreset
		onFieldChange: function (field, attrs, options) {
			debug('^^^^^^^^ fr#onFieldChange', field._seq, field.id, attrs[field.provide]);
			debug('* FR#onFieldChange id:', field.provide, 'attrs:', attrs);
			this.model.set(attrs);
			_.extend(this._changes, this.model.changed);
			if (!options.noreset && this.model.hasChanged()) {
				this.reset({ set: false, resetBy: options.changedBy });
			}
		},

		onFieldRemove: function (field) {
			this.removeField(field);
		},

		removeField: function (field) {
			_.each(field.branches, function (name) {
				delete this._fields[name];
				delete this._deps[name];
			}, this);
			delete this._fields[field.provide];
			delete this._deps[field.provide];
			FieldRelation._removeField(field);
		},

		_setFlag: function () {
			var i, name, sw, args = _.toArray(arguments);
			_.each(this._fields, function (field) {
				for (i = 0; i < args.length; i += 2) {
					name = args[i], sw = args[i + 1];
					field[name] = sw;
				}
			});
		},

		_reset: function (options) {
			// 最初にdataSourceの変更をみる
			this.model.set(_.result(this, 'dataSource'));
			_.extend(this._changes, this.model.changed);
			var sorted = tsort(this._deps);
			var that = this;

			var deferred = $.Deferred();

			// jQuery部品で値を$.fn.val()相当でセットしたときにUIからの
			// イベントを回避するために全てのフィールドにリセット中フラ
			// グを立てる
			this._setFlag('_resetting', true, '_seq', _.uniqueId());

			var when = [];
			var done = _.reduce(sorted, _.bind(function (prevResult, id) {
				var result = { id: id, field: this._fields[id] };
				result.deferred = prevResult.deferred.then(function () {
					debug('* FR#resolve id:', id,
						'model:', JSON.stringify(that.model),
						'changed:', that._changes);

					if (prevResult.field) {
						that.model.set(prevResult.field.getProvideAttrs());
						_.extend(that._changes, that.model.changedAttributes());

						debug('** resolve: provide:', prevResult.field.provide,
							'attrs:', prevResult.field.getProvideAttrs(),
							'model.cheanged:', that.model.changedAttributes());
					}

					var field = that._fields[id];
					if (!field) {
						return;
					}

					var depends = that._deps[id];
					var changedNodes = _.intersection(depends, _.keys(that._changes));
					var changeDependant = !_.isEmpty(changedNodes);
					var ret;
					if (changeDependant || options.init) {
						// 当該ノードの依存パラメータ
						var dependencies = that.model.pick(depends);
						if (field.isBranch) {
							_.extend(dependencies, that.model.pick(field.provide));
						}
						var initValue = field.options && field.options.initValue;
						// 変更されかつ伝搬するノード
						var propagateOnly = _.without.apply(
							_, [changedNodes].concat(field.nopropagete));
						var setOptions = {
							// UIもしくは初期化のときには遅延する
							deferReset: !options.set || !!options.init,
							// デフォルト値に設定する
							setDefault: !options.set &&
								(!initValue || !options.init),
							// 値の伝搬のみ
							setOnly: (_.isEmpty(propagateOnly) && !options.set && !options.init)
						};
						ret = field.setDependencies(dependencies, setOptions);
					} else if (options.set) {
						// callBy => debuging purpose
						if (options.changeReadonlyState !== false &&
							_.isFunction(field._checkAttrs)) {
							field._checkAttrs({ callBy: 'fr#reset' });
						}
						field.renderValue({ callBy: 'fr#reset' });
					}

					debug('** FR#reset id:', id,
						'depends:', depends,
						'changedNodes:', changedNodes,
						'changeDependant:', changeDependant);

					if (_.isFunction(field.invalidate)) {
						$.when(ret).done(function () {
							field.invalidate({ noreset: true });
						});
					}

					// options.setのときは同期的
					if (!options.set) {
						return ret;
					} else {
						when.push(ret);
					}
				});
				return result;
			}, this), { deferred: $.Deferred().resolve() });

			when.push(done.deferred);
			$.when.apply($, when)
				.always(function () {
					console.warn('FieldRelation#reset done');
					// リセット中フラグの解除
					that._setFlag('_resetting', false);
					// 初期化時もイベントをトリガーできるようにdeferする。
					_.defer(function () {
						that.onAfterReset(_.extend({
							sorted: sorted,
							deferred: deferred
						}, options));
					});
				});

			return deferred.promise();
		},

		/**
		 * @method reset
		 * @param [options.set=true] falseのときは依存パラメータ変更時
		 * に値をリセットする。
		 * @param [options.changeReadonlyState=true] falseでset=trueの
		 * ときに依存パラメータに変更がないフィールドのリードオンリー状
		 * 態の変更をしない(互換性のためのオプション)。
		 * @param [options.init] 全フィールドを初期値でリセットする
		 */
		reset: function (options) {
			this._seq = _.uniqueId();
			debug('^^^^^^^^ fr#reset', this._seq, this.id);
			options = options || {};
			options.set = options.set !== false && !options.init;
			this._resolveDeferred = this._setDeferred =
				this._resolveDeferred.then(function () {
					debug('^^^^^^^^ fr#reset then', this._seq, this.id);
					return this._reset(options);
				});
			this._resolveDeferred.promise(this);
			return this;
		},

		onAfterReset: function (options) {
			_.each(options.sorted, function (id) {
				var changed = _.has(this._changes, id);
				if (changed) {
					this._triggerChange(id);
				}
			}, this);
			if (options.init || !_.isEmpty(this._changes)) {
				this.trigger('reset', this.model.toJSON(), options, this);
			}
			this._changes = {};
			options.deferred.resolveWith(this);
		},

		_triggerChange: function (id) {
			var field = this._fields[id];
			if (field) {
				this.trigger('change:' + field.id,
					field.getValue(),
					field.getAttrs(),
					field);
			}
		},

		set: function (field, value, options) {
			if (_.isString(field)) {
				field = this.fields[field];
			}
			if (field) {
				return this._set(field, value, options);
			}
			console.error('No such field `' + field + "'");
			return this;
		},

		_set: function (field, value, options) {
			var setOptions = _.extend({ noreset: true, render: false }, options);
			this._resolveDeferred = this._setDeferred.then(function () {
				field.setValue(value, setOptions);
				// setValueは同期的なのでreturn undefined;
			});
			this._resolveDeferred.promise(this);
			return this;
		},

		get: function (field) {
			if (_.isString(field)) {
				field = this.fields[field];
			}
			if (field) {
				return this._get(field);
			}
			console.error('No such field `' + field + "'");
		},

		_get: function (field) {
			return field.getValue();
		},

		attr: function (fieldName) {
			if (_.isString(fieldName)) {
				var field = this.fields[fieldName];
				if (field) {
					return this._attr(field);
				}
			}
			console.error('No such field `' + fieldName + "'");
		},

		_attr: function (field) {
			var attrs = field.getAttrs();
			return _.clone(attrs);
		},

		remove: function () {
			this.stopListening();
			FieldRelation.removeFieldRelation(this);
		}
	});

	_.extend(FieldRelation, {
		// 全FieldRelationインスタンス
		_fieldRelations: {},
		// 全Fieldのインスタンス
		_bycid: {},

		addFieldRelation: function (fieldRelation) {
			if (!fieldRelation.id) {
				fieldRelation.id = _.uniqueId('fr');
			}
			this._fieldRelations[fieldRelation.id] = fieldRelation;
		},

		removeFieldRelation: function (fieldRelation) {
			delete this._fieldRelations[fieldRelation.id];
		},

		// domエレメントからFieldインスタンスを取得できるようにするため
		// とField#remove()を呼ばなくてもインスタンスを開放できるように
		// するためのmethod。
		// $elのdata-field-cid属性を見てfieldインスタンスが割
		// りあてずみいの場合に開放を行う。それから新fieldインスタンス
		// のcidを同属性に設定する。
		manageField: function (field) {
			var cid = field.$el.attr('data-field-cid');
			if (cid) {
				var old = this._bycid[cid];
				if (old) {
					console.log('remove old field', cid);
					old.remove();
					delete this._bycid[cid];
				}
			}
			field.$el.attr('data-field-cid', field.cid);
			this._bycid[field.cid] = field;
		},

		_removeField: function (field) {
			var cid = field.$el.attr('data-field-cid');
			field.$el.removeAttr('data-field-cid');
			delete this._bycid[cid];
		},

		removeField: function (field) {
			var fr = this.getFieldRelation(field);
			if (fr) {
				fr.removeField(field);
			} else {
				this._removeField(field);
			}
		},

		// cidからFieldを取得
		getFieldByCid: function (cid) {
			return this._bycid[cid];
		},

		// fieldからFieldRelationを取得
		getFieldRelation: function (field) {
			if (field) {
				return this._fieldRelations[field._frid];
			}
			console.warn('FieldRelation#getFieldRelation argument field not set');
		},

		getFieldRelationByCid: function (cid) {
			var field = this.getFieldByCid(cid);
			var fr = this.getFieldRelation(field);
			return fr;
		},

		set: function (field, value, options) {
			var fr = this.getFieldRelation(field);
			fr._set(field, value, options);
		},

		$set: function ($el, value, options) {
			options = options || {};
			var cid = $el.attr('data-field-cid');
			var field = this.getFieldByCid(cid);
			var fr;
			if (field) {
				fr = this.getFieldRelation(field);
			}
			if (fr) {
				fr.set(field.id, value, options);
			} else if (field) {
				field.setValue(value, options);
			}
		},

		resetAll: function (resetOptions) {
			console.log('XXXX resetAll');
			return $.when.apply($, _.map(this._fieldRelations, function (fr) {
				return fr.reset(_.extend({ set: true }, resetOptions));
			}, this));
		},

		/**
		 * フィールドリレーションを作成する
		 *
		 * @method create
		 * @for clutil.FieldRelation
		 * @static
		 * @param {string} id
		 * @param {object} fields
		 * @param {object} options
		 * @param {object} [options.dataSource]
		 *
		 * @return {FieldRelation}
		 */
		create: function (id, fields, options) {
			var oldInst = this._fieldRelations[id];
			if (oldInst) {
				oldInst.remove();
			}
			options || (options = {});
			options.id = id;
			var fr = new FieldRelation(fields, options);
			// 全フィールドの依存関係の解決
			fr.reset({ init: true });
			return fr;
		}
	});

	////////////////////////////////////////////////////////////////
	var queryOptions = ['url'];
	function Query(options) {
		this.options = options || {};
		_.extend(this, _.pick(this.options, queryOptions));
		if (_.isFunction(this.initialize)) {
			this.initialize.apply(this, arguments);
		}
	}

	_.extend(Query.prototype, Backbone.Events, {
		request: function (attrs, options, field, context) {
			console.log('Query#request attrs:', attrs);
			var request = this.createRequest.apply(this, arguments);
			var that = this;
			var deferred = $.Deferred();

			this.postJSON({
				resId: this.url,
				data: request
			})
				.done(function (data, dataType) {
					var response = that.createResponse(data, attrs, options);
					that.trigger('response', request, response, options);
					deferred.resolveWith(
						context, [response, options, data, dataType]);
				})
				.fail(function () {
					deferred.rejectWith(context);
				});
			return deferred.promise();
		},
		postJSON: function () {
			return clutil.postJSON.apply(clutil, arguments);
		},
		createRequest: function () { },
		createResponse: function () { }
	});

	Query.extend = Backbone.Model.extend;

	var NoQuery = Query.extend({
		postJSON: function () {
			return $.Deferred().resolve().promise();
		}
	});

	var AcQueryDefaultItemTemplate = _.template(
		'<%- it.code %><% it.code && it.name && print(":") %>' +
		'<%- it.name %>', null, { variable: 'it' }
	);
	var AcQueryBase = Query.extend({
		initialize: function () {
			this.itemTemplate = this.options.itemTemplate ||
				AcQueryDefaultItemTemplate;
			_.extend(this, _.pick(this.options, 'getList'));
		},

		createRequest: function (params, options) {
			options = options || {};
			var condMapping = this.options.condMapping || {};
			var request = { cond: {} };

			// XXXX ymdが設定されている場合は srchFromDate, srchToDateにも設定する。
			if (params.ymd !== undefined) {
				request.cond.srchFromDate = params.ymd;
				request.cond.srchToDate = params.ymd;
			}

			_.each(this.options.prepRequest, function (v, k) {
				setNested(request, k, v);
			}, this);

			if (this.options.requestMapping) {
				objKeyConv(params, this.options.requestMapping, request);
			} else {
				objKeyConv(params, condMapping, request.cond);
			}

			if (options.term) {
				setNested(request, this.options.codename || 'cond.codename', options.term);
			}
			return request;
		},

		createResponse: function (data, attrs, options) {
			var result = [];
			var list = this.getList(data);
			var serializeItem = this.options.serializeItem;
			var itemMapping = this.options.itemMapping || {};
			var itemTemplate = this.itemTemplate;
			return _.map(list, function (item) {
				if (_.isFunction(serializeItem)) {
					item = serializeItem(item, data);
				}
				var o = objKeyConv(item, itemMapping);
				o.label = itemTemplate(o);
				return o;
			});
		},

		getList: function (data) {
			var listProp = _.result(this.options, 'itemPath') || 'list';
			var list = getNested(data, listProp);
			return list;
		}
	});

	var acBlockUIEvents = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';

	var acBlockUIHandler = function (e) {
		// console.log('**** onBlockUIHandler', e.type, e.target, e.data.input);

		if (e.which === 9) {
			// setTimeout(function(){$(e.data.input).foucs()}, 10);
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		if (e.target === e.data.input) {
			// イベント対象が当該オートコンプリートのインプット

			return;
		}

		// 他はブロックする
		e.preventDefault();
		e.stopPropagation();
	};

	var AcQuery = AcQueryBase.extend({

		initialize: function () {
			_.bindAll(this, 'onBlock', 'onUnblock');
			AcQueryBase.prototype.initialize.apply(this, arguments);
		},

		postJSON: function (options) {
			options.blockUIOptions = {
				message: false,
				overlayCSS: {
					opacity: 0,
					cursor: 'normal'
				},
				css: {
					cursor: 'normal'
				},
				// 独自のブロック関数を使用する
				bindEvents: false,
				onBlock: this.onBlock,
				onUnblock: this.onUnblock
			};

			return clutil.postJSON(options);
		},

		onBlock: function () {
			// console.log('***** onBlock');
			$(document).on(acBlockUIEvents, this, acBlockUIHandler);
		},

		onUnblock: function () {
			// console.log('***** onUnblockBlock');
			$(document).off(acBlockUIEvents, acBlockUIHandler);
		},

		setInput: function (el) {
			this.input = el;
		}
	});

	var SelectorQuery = AcQueryBase.extend({
	});

	var StubQuery = AcQueryBase.extend({
		postJSON: function () {
			return $.Deferred().resolve(this.options.fakeData).promise();
		}
	});

	// Checkerはパラメータチェックを行う
	function Checker() {
	}
	_.extend(Checker.prototype, {
		check: function (attrs, options) {
			var required = options.required || [];
			// とりあえず
			var errors = [];
			_.each(required, function (r) {
				if (!attrs[r]) {
					errors.push(r);
				}
			});
			if (!_.isEmpty(errors)) {
				console.warn('Parameter not set', errors, options.id);
				return errors;
			}
		}
	});

	////////////////////////////////////////////////////////////////
	// Simple Behavior
	function Behavior() {
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}
	}
	_.extend(Behavior.prototype, Backbone.Events, {
		triggerMethod: triggerMethod
	});
	Behavior.extend = Backbone.Model.extend;

	function buildBehaviors(view) {
		if (_.isArray(view.behaviors)) {
			// normalize to object
			view.behaviors = _.object(view.behaviors, []);
		}
		return _.map(view.behaviors, function (options, name) {
			var Type = clutil.field.behaviors[name];
			if (Type) {
				var behavior = new Type(options);
				behavior.view = view;
				view.on('all', function () {
					this.triggerMethod.apply(this, arguments);
				}, behavior);
				return behavior;
			}
			throw 'unknown behavior `' + name + "'";
		});
	}

	// EnableDisableBehavior
	var ErrorOnDisableBehavior = Behavior.extend({
		onClearError: function () {
			clutil.inputRemoveReadonly(this.view.$el);
			this.view.trigger('readonly:change', this.view, false, {});
		},
		onCheckError: function () {
			clutil.inputReadonly(this.view.$el);
			this.view.trigger('readonly:change', this.view, true, {});
		}
	});

	clutil.field.behaviors = {
		'errorOnDisable': ErrorOnDisableBehavior
	};

	////////////////////////////////////////////////////////////////
	function fieldSetDepends(view, options) {
		var depends = getOption(view, 'depends') || [];
		if (_.isString(depends)) depends = [depends];
		// 依存追加
		var addDepends = getOption(view, 'addDepends') || [];
		if (_.isString(addDepends)) addDepends = [addDepends];
		depends = depends.concat(addDepends);
		// 依存削除
		var rmDepends = getOption(view, 'rmDepends') || [];
		if (_.isString(rmDepends)) rmDepends = [rmDepends];
		depends = _.bind(_.without, _, depends)
			.apply(null, (rmDepends.concat(
				_.map(rmDepends, function (s) { return '~' + s }),
				_.map(rmDepends, function (s) { return '!' + s }))));

		var dependsMap = _.reduce(depends, function (memo, depend) {
			var req = true;		// 必須
			var nop = false;	// 伝搬しない
			while (true) {
				if (depend[0] === '~') {
					depend = depend.substring(1);
					req = false;
				} else if (depend[0] === '!') {
					depend = depend.substring(1);
					nop = true;
					req = false;
				} else {
					break;
				}
			}

			memo[depend] = { req: req, nop: nop };
			return memo;
		}, {});

		dependsMap = _.reduce(dependsMap, function (memo, attr, depend) {
			if (options.dependSrc && _.has(options.dependSrc, depend)) {
				depend = options.dependSrc[depend];
			}
			memo[depend] = attr;
			return memo;
		}, {});

		// 必須パラメータ
		var required = [];
		// 伝搬しないパラメータ
		var nopropagete = [];
		_.each(dependsMap, function (attr, depend) {
			if (attr.req) required.push(depend);
			if (attr.nop) nopropagete.push(depend);
		});

		view.depends = _.keys(dependsMap);
		view.required = required;
		view.nopropagete = nopropagete;

		var provide = getOption(view, 'name') || getOption(view, 'provide');
		view.provide = String(provide);

		// console.log('* FieldRelation', _.pick(view, 'id', 'provide', 'depends', 'required', 'nopropagete'), dependsMap);
	}

	var fieldOptions = ['provide', 'defaultValue', 'reqres',
		'dependAttrs', 'checker', 'branches',
		'isCompoundValue',
		'renderDependencies', 'renderValue', 'behaviors',
		'onAfterInitialize'];

	var Field = Backbone.View.extend({
		idName: 'id',

		constructor: function (options) {
			this.options = options || {};
			Backbone.View.prototype.constructor.apply(this, arguments);
		},

		initialize: function () {
			_.bindAll(this, 'renderResponse', 'renderDependencies', 'renderValue');
			_.extend(this, _.pick(this.options, fieldOptions));
			_.extend(this, _.pick(this.options, _.values(this.options.compat)));
			fieldSetDepends(this, this.options);

			this.ModelType = this.createModel();
			this.model = new this.ModelType();
			this.dependencies = new Backbone.Model();

			this.collection = new Backbone.Collection([], {
				model: this.ModelType
			});

			var initValue = getOption(this, 'initValue');
			var defaultValue = _.result(this, 'defaultValue');
			var defaultAttrs = this.toAttrs(initValue || defaultValue);
			this.model.set(defaultAttrs);

			if (!this.$el.length) {
				console.warn('el not set', this.$el);
			}

			if (this.behaviors) {
				this._behaviors = buildBehaviors(this);
			}

			if (!this.checker) {
				this.checker = new Checker();
			}
			FieldRelation.manageField(this);

			this.triggerMethod("after:initialize", this);
		},

		triggerMethod: triggerMethod,

		createModel: function () {
			var Model = Backbone.Model.extend({
				idAttribute: this.idName
			});
			return Model;
		},

		// @param [options.addUserAttrs=true]
		getDependencies: function (options) {
			var that = this;
			var dependAttrs;
			options = (options || {});
			options.addUserAttrs = options.addUserAttrs !== false;

			if (options.addUserAttrs) {
				dependAttrs = _.result(this, 'dependAttrs');
				var fieldRelation = FieldRelation.getFieldRelation(this);
				dependAttrs = _.reduce(dependAttrs, function (memo, v, k) {
					if (_.isFunction(v)) {
						v = v.call(that, that, fieldRelation);
					}
					memo[k] = v;
					return memo;
				}, {});
			}
			var attrs = _.extend({}, this.dependencies.attributes,
				dependAttrs);
			if (options.addUserAttrs) {
				_.each(this.options.compat, function (v, k) {
					if (this[v]) {
						attrs[k] = _.result(this, v);
					}
				}, this);
			}

			return attrs;
		},

		// options.setOnly    依存パラメータの設定のみ
		// options.setDefault falseのときは値をリセットしない
		// options.deferReset 値のリセットを遅延しない
		setDependencies: function (dependencies, options) {
			options = _.extend({}, options);
			options.dependenciesChanged = true;
			var deferred;
			debug('^^^^^^^^ field#setDependencies', this._seq, this.id,
				this.requestOnSetDependencies,
				options.setDefault, options.deferReset, options.setOnly);
			this.dependencies.set(dependencies);
			if (options.setOnly) {
				// 日付けの更新などの場合はここでリターン
				return;
			}
			// 依存パラメータのチェック
			if (this._checkAttrs(options)) {
				return;
			}
			var resetOptions = { render: false, setDefault: options.setDefault };
			// 遅延しない場合はここでデフォルト値に設定する。
			if (!options.deferReset) {
				this.resetValue(null, resetOptions);
			}
			if (this.requestOnSetDependencies === false) {
				// オートコンプリートなど依存パラメータ時にリクエストをなげない場合
				this.resetValue(null, resetOptions);
				this.renderValue();
				return;
			}
			options.check = false;
			deferred = this.doRequest(options);
			if (deferred.errors) {
				return;
			}
			// レンダーする
			deferred.done(this.renderResponse);

			return deferred;
		},

		setValue: function (value, options) {
			if (value == null) {
				value = _.result(this, 'defaultValue');
			}
			debug('^^^^^^^^ field#setValue', this._seq, this.id, value);
			options = _.extend({}, options);
			options.set = false;
			var attrs = this.toAttrs(value);
			var oldId = this.model.id;
			this.model.clear({ silent: true });
			this.model.set(attrs, options);
			if (!_.isEqual(this.model.id, oldId)) {
				var provideAttrs = this.toProvideAttrs(attrs);
				this.trigger('fr:change', this, provideAttrs, options);
			}
			if (options.render !== false) {
				this.renderValue();
			}
		},

		getValue: function () {
			var value = this.toValue(this.model.toJSON());
			return value;
		},

		checkAttrs: function (attrs) {
			if (this.checker) {
				return this.checker.check(attrs, {
					required: this.required,
					name: this.id
				});
			}
		},

		_onCheckError: function (errors) {
			var onCheckError = getOption(this, 'onCheckError');
			this.triggerMethod('check:error');
			if (onCheckError) {
				onCheckError.call(this, errors);
			}
		},

		_onClearError: function () {
			var clearError = getOption(this, 'onClearError');
			this.triggerMethod('clear:error');
			if (clearError) {
				clearError.call(this);
			}
		},

		_isValid: function (options) {
			var attrs = this.getDependencies(options);
			var checkAttrs = getOption(this, 'checkAttrs');
			return checkAttrs.call(this, attrs);
		},

		// @param [options.addUserAttrs=false]
		isValid: function (options) {
			var errors = this._isValid(options || { addUserAttrs: false });
			return !errors;
		},

		// @param [options.check=true] falseでチェックしない
		// @param [options.onCheckError=true] falseでonCheckErrorを呼ばない
		_checkAttrs: function (options, attrs) {
			var errors;
			if (options.check !== false) {
				errors = this._isValid();
			}
			if (errors) {
				this._onCheckError(errors);
				return errors;
			}
			this._onClearError();
		},

		doRequest: function (options) {
			var attrs = this.getDependencies();
			if (options.check) {
				var errors = this._checkAttrs(options, attrs);
				if (errors) {
					var ret = $.Deferred().reject().promise();
					ret.errors = errors;
					return ret;
				}
			}
			this.response = this._callRequest(attrs, options);
			return this.response;
		},

		// callRequestを呼ぶ
		_callRequest: function (attrs, options) {
			attrs = _.clone(attrs) || {};
			var dependSrc = this.options.dependSrc;
			if (dependSrc) {
				var invert = _.invert(dependSrc);
				attrs = _.reduce(attrs, function (memo, value, key) {
					if (_.has(invert, key)) {
						key = invert[key];
					}
					memo[key] = value;
					return memo;
				}, {});
			}
			// デフォルト値の設定
			var defaults = this.options.defaultCond;
			if (_.isFunction(defaults)) {
				defaults = defaults.call(this, attrs, options);
			}
			_.defaults(attrs, defaults);
			this.beforeCallRequest();
			var buildAttrs = Marionette.getOption(this, 'buildAttrs');
			if (_.isFunction(buildAttrs)) {
				attrs = buildAttrs.call(this, attrs, options);
			}
			return this.callRequest(attrs, options, this.getFieldRelation());
		},

		getFieldRelation: function () {
			return FieldRelation.getFieldRelation(this);
		},

		beforeCallRequest: function () { },

		callRequest: function (attrs, options) {
			return $.Deferred().resolveWith(this, [attrs, options]).promise();
		},

		render: function (options) {
			options = options || {};
			var deferred = this.doRequest(options);
			var that = this;
			deferred.done(function (response) {
				that.renderResponse(response, options);
			});
			return deferred;
		},

		renderResponse: function (response, options) {
			debug('^^^^^^^^ field#render', this._seq, this.id);
			options = options || {};
			this.responseData = response;
			if (this.onBeforeRenderResponse) {
				this.onBeforeRenderResponse(response, options);
			}
			this.renderDependencies(response, options);
			if (this.onRenderDependencies) {
				this.onRenderDependencies(response, options);
			}
			// responseが1つのときにもリセットする
			if (options.deferReset) {
				this.resetValue(response, { render: false, setDefault: options.setDefault });
			}
			this.renderValue(options);
			if (this.onAfterRender) {
				this.onAfterRender(response, options);
			}
		},

		resetValue: function (items, options) {
			options || (options = {});
			debug('^^^^^^^^ field#resetValue', this._seq, this.id, options.setDefault);

			var onClearValue = getOption(this, 'onClearValue');
			if ((options.setDefault !== false || (_.isArray(items) && items.length === 1)) && onClearValue) {
				onClearValue.call(this, items, _.bind(function (value) {
					this.setValue(value, _.extend({ noreset: true }, options));
				}, this));
			}
		},

		toAttrs: function (value) {
			if (this.isCompoundValue) {
				return value || {};
			} else if (this.isMultiple) {
				return _.map(value, function (v) {
					var attrs = {};
					attrs[this.idName] = v;
					return attrs;
				});
			} else {
				var attrs = {};
				attrs[this.idName] = value;
				return attrs;
			}
		},

		getAttrs: function () {
			return this.toAttrs(this.getValue());
		},

		toProvideAttrs: function (attrs) {
			var r = {};
			r[this.provide] = attrs[this.idName];
			// 追加パラメータ(branches)を含める
			if (this.branches) {
				_.extend(r, _.pick(attrs, this.branches));
				// XXXX branchesのデフォルト値
				_.defaults(r, _.object(this.branches, []));
			}
			return r;
		},

		toValue: function (attrs) {
			if (this.isCompoundValue) {
				return attrs;
			} else {
				return attrs[this.idName];
			}
		},

		getProvideAttrs: function () {
			return this.toProvideAttrs(this.model.attributes);
		},

		onClearValue: function (items, set) {
			debug('* Field#onClearValue');
			set(_.result(this, 'defaultValue'));
		},

		renderDependencies: function (response, options) { },
		renderValue: function (options) { },

		remove: function (force) {
			if (force) {
				Backbone.View.prototype.remove.call(this);
			} else {
				this.stopListening();
			}
			this.trigger('fr:remove', this);
			this._removed = true;
			return this;
		},

		onCheckError: function () { }
	});

	var ListField = Field.extend({
		initialize: function () {
			Field.prototype.initialize.apply(this, arguments);
			this.listenTo(this.model, 'change', function (model, options) {
				this.triggerChangeEvent(options);
			});
		},

		onBeforeRenderResponse: function (items, options) {
			// コレクションを更新する。
			this.collection.reset(items);
		},

		beforeCallRequest: function () {
			this.collection.reset();
		},

		toAttrs: function (value) {
			var attrs = Field.prototype.toAttrs.call(this, value);
			var model = this.collection.get(attrs[this.idName]);
			if (model) {
				return model.toJSON();
			} else {
				return attrs;
			}
		},

		onClearValue: function (items, set) {
			if (!items || !this.collection.get(this.model.id)) {
				set(_.result(this, 'defaultValue'));
			} else {
				set(this.model.id);
			}
		},

		triggerChangeEvent: function (options) {
			options || (options = {});
			var val = this.getValue();
			var changed = !_.isEqual(this._previousTriggered, val);
			var attrs = this.getAttrs();

			if (this.collection.length > 0 && changed) {
				this.trigger('change', attrs, this, options);
				if (this.options.clMediatorEvents &&
					this.options.clMediatorEvents.change) {
					clutil.mediator.trigger(
						this.options.clMediatorEvents.change,
						attrs,
						options);
				}
				this._previousTriggered = val;
			}
		}
	});

	var AutoCompleteField = ListField.extend({
		tagName: "input",
		attributes: {
			type: "text"
		},

		isCompoundValue: true,

		requestOnSetDependencies: false,

		initialize: function () {
			ListField.prototype.initialize.apply(this, arguments);
			_.extend(this, _.pick(this.reqres, 'itemTemplate'));
			_.bindAll(this, 'onChange', 'buildSource');

			if (this.reqres.setInput) this.reqres.setInput(this.el);

			var acOptions = _.extend({
				getLabel: _.bind(function (item) {
					if (item) {
						return this.itemTemplate(item);
					} else {
						return '';
					}
				}, this),
				clchange: this.onChange,
				source: this.buildSource,
				maxItems: clcom.getSysparam('PAR_AMCM_AUTOCOMPLETE_MAX')
			}, _.omit(this.options.autocomplete, 'source'));

			this.$el.autocomplete(acOptions);

			if (!this.hasFieldRelation && this.options.initValue) {
				this.setValue(this.options.initValue);
			}
		},

		callRequest: function (attrs, options) {
			return this.reqres.request(attrs, options, this);
		},

		onChange: function (event, ui) {
			this._seq = _.uniqueId();
			console.log('^^^^^^^^ ac#clchange', this._seq, this.id, ui.item && ui.item.id);
			var setValueOptions = { render: false, changedByUI: true, changedBy: 'ui' };
			if (this.isCompoundValue) {
				this.setValue(ui.item, setValueOptions);
			} else {
				this.setValue(ui.item && ui.item[this.idName], setValueOptions);
			}
			this.triggerChangeEvent({ changedByUI: true, changedBy: 'ui' });
			// this.trigger('change', ui && ui.item);
		},

		buildSource: function (request, response) {
			if (this.options.autocomplete && this.options.autocomplete.source) {
				return this.buildSource2(request, response);
			}

			request.check = false;
			var collection = this.collection;
			this.doRequest(request).done(function (items) {
				collection.reset(items);
				response(items);
			});
		},

		buildSource2: function (request, response) {
			var itemTemplate = this.itemTemplate;
			this.options.autocomplete.source(request, function (list) {
				response(_.map(list, function (item) {
					item.label = itemTemplate(item || {});
					return item;
				}));
			}, this);
		},

		renderValue: function () {
			var attrs = this.model.toJSON();
			debug('^^^^^^^^ field#renderValue', this._seq, this.id, attrs);
			try {
				this.$el.autocomplete('clAutocompleteItem', attrs);
			} catch (e) {
				if (!this._removed) { // remove()後に呼びだしの暫定対処
					console.error(e.stack);
				}
			}
		},

		onCheckError: function () {
			this.setValue(_.result(this, 'defaultValue'), { noreset: true });
		}
	});

	function Multitable(view) {
		this.view = view;
		this.view.defaultValue = [];
		this.orgSetValue = this.view.setValue;
		this.origGetValue = this.view.getValue;
	}

	_.extend(Multitable.prototype, {
		toAttrs: function (values) {
			var attrs = {};
			attrs[this.idName] = _.map(values, function (value) {
				var model = this.view.collection.get(value);
				if (model) {
					return model.toJSON();
				} else {
					var attrs = {};
					attrs[this.view.idName] = value;
					return attrs;
				}
			}, this);
			return attrs;
		},

		setValue: function (values, options) {
			values == null && (values = []);
			if (!_.isArray(values)) {
				values = [values];
			}
			this.view.orgSetValue(values, options);
		},

		getValue: function () {
			var value = this.origGetValue();
			return _.map(value, function (v) {
				return v && v[this.idName];
			}, this);
		}
	});

	var SelectFieldDefaultItemTemplate = buildTemplate(
		'<option value="<%- it.id %>">' +
		'<%= it.code %>' +
		'<% it.code && it.name && print(":") %>' +
		'<%= it.name %></option>'
	);
	var SelectFieldNameOnlyTemplate = buildTemplate(
		'<option value="<%- it.id %>"><%= it.name %></option>'
	);

	var SelectField = ListField.extend({
		defaultValue: 0,
		tagName: 'select',
		events: {
			change: function (e) {
				this._seq = _.uniqueId();
				// selectpicker対策
				if (this._resetting) return;
				var val = this.$el.val();
				// console.log('^^^^^^^^ sel#change', this._seq, this.id, val, this.$el.val());
				this.setValue(val, { render: false, changedByUI: true, changedBy: 'ui' });
			}
		},

		callRequest: function (attrs, options) {
			return this.reqres.request(attrs, options, this);
		},

		initialize: function () {
			this.emptyFlag = this.options.unselectedflag !== false &&
				this.options.unselectedflag !== 0;

			if (this.options.container) {
				this.$el.appendTo(this.options.container);
			}
			this.isMultiple = !!this.options.multiple || this.$el.is('[multiple]');
			if (this.isMultiple) {
				this.emptyFlag = false;
				var multitable = new Multitable(this);
				_.extend(this, multitable);
			}
			this.$el.prop('multiple', this.isMultiple);

			ListField.prototype.initialize.apply(this, arguments);

			var selectpicker = this.$el.data('selectpicker');
			if (selectpicker) {
				this.$el.data('selectpicker', null);
				this.$el.next('.bootstrap-select').remove();
				this.$el.next('.select').remove();
			}
			this.$el.selectpicker(this.options.selectpicker);
			if (this.options.render !== false) {
				var deferred = $.Deferred();
				var that = this;
				var renderOptions = {
					deferReset: true,
					setDefault: this.options.setDefault
				};
				this.render(renderOptions).done(function (response, options, data, dataType) {
					deferred.resolve(data, dataType);
				});
				deferred.promise(this);
			}
		},

		getItemTemplate: function () {
			if (this.itemTemplate) {
				return this.itemTemplate;
			}
			var template;
			if (this.options.itemTemplate) {
				template = this.options.itemTemplate;
				if (_.isString(template)) {
					template = buildTemplate(template);
				}
			} else if (this.options.nameOnly) {
				template = SelectFieldNameOnlyTemplate;
			} else {
				template = SelectFieldDefaultItemTemplate;
			}
			this.itemTemplate = template;
			return this.itemTemplate;
		},

		onClearValue: function (items, set) {
			var value = _.result(this, 'defaultValue');
			var total = this.collection.length;
			if (this.emptyFlag) {
				total += 1;
			}

			if (items && this.collection.get(this.model.id)) {
				value = this.model.id;
			}

			if (this.options.disableOnNoChoice !== false &&
				this.collection.length <= 1) {

				if (!this.isMultiple &&
					this.collection.length === 1 &&
					this.isRequiredField) {
					value = this.collection.first().id;
				}

				if ((!this.isMultiple &&
					(this.isRequiredField || total <= 1)) ||
					total === 0) {
					clutil.inputReadonly(this.$el);
					this.trigger('readonly:change', this, true, {
						reason: 'nodata'
					});
				}
			}

			set(value);
		},

		toAttrs: function (value) {
			return ListField.prototype.toAttrs
				.call(this, parseInt(value, 10) || 0);
		},

		renderValue: function () {
			var id = this.getValue() || 0;
			this._selectpickerVal(id);
		},

		_selectpickerVal: function (val) {
			this.$el.attr('preventValhooks', '1');
			this.$el.selectpicker('val', val);
			this.$el.removeAttr('preventValhooks');
		},

		renderDependencies: function (items) {
			var markup = '';
			var itemTemplate = this.getItemTemplate();
			var emptyLabel = getOption(this, "emptyLabel") || "&nbsp;";
			if (this.emptyFlag) {
				markup += '<option value="0">' + emptyLabel + '</option>';
			}
			var chain = _(items).chain();
			if (this.options.filter) {
				chain = chain.filter(this.options.filter);
			}
			if (this.options.reverse) {
				chain = chain.reverse();
			}
			chain.each(function (item) {
				markup += itemTemplate(item);
			}, this).value();
			this.$el.html(markup)
				.selectpicker('refresh');
			if (!this.collection.get(this.getValue())) {
				this.resetValue(items);
			}
		},

		onCheckError: function () {
			console.warn('* Field#onCheckError', this.id);
			var options = { render: false, noreset: true };
			this.setValue(_.result(this, 'defaultValue'), options);
			this.$el.html('<option value="0">&nbsp;</option>')
				.selectpicker('refresh');
			this._selectpickerVal(0);
		},

		getItems: function () {
			return this.collection.toJSON();
		},

		invalidate: function (options) {
			if (this.isValid() &&
				(!this.collection || !this.collection.get(this.getValue()))) {
				var defaultValue;
				if (this.emptyFlag) {
					defaultValue = 0;
				} else if (this.collection && this.collection.length) {
					defaultValue = this.collection.first().id;
				}
				if (defaultValue != null) {
					this.setValue(defaultValue, options);
				}
			}
		}
	});

	// 区分クエリ
	var TypeQuery = Query.extend({
		request: function (attrs, options, field, context) {
			var typenamelist = clutil.gettypenamelist(
				field.options.kind, field.options.ids);
			typenamelist = _.map(typenamelist, function (item) {
				return {
					id: item.type_id,
					name: item.name,
					code: item.code
				};
			});
			return $.Deferred().resolveWith(context, [typenamelist]).promise();
		}
	});

	// 区分表示部品
	var TypeSelector = SelectField.extend({
		initialize: function (options) {
			options = (options || {});
			options.provide = options.kind;
			SelectField.prototype.initialize.call(this, options);
		}
	});

	var Select = SelectField.extend({
		initialize: function () {
			SelectField.prototype.initialize.apply(this, arguments);
		},

		callRequest: function (attrs, options, fieldRelation) {
			var getItems = getOption(this, 'getItems');
			if (_.isFunction(getItems)) {
				getItems = getItems.call(this, attrs, fieldRelation);
				if (getItems && getItems.done && getItems.then) {
					return getItems;
				}
			}
			return $.Deferred().resolveWith(this, [getItems || []]).promise();
		}
	});

	// input[type=text]
	var Text = Field.extend({
		defaultValue: '',
		events: {
			change: function () {
				this.setValue(this.$el.val(), { render: false });
			}
		},
		renderValue: function () {
			var value = this.getValue();
			this.$el.val(value);
		},
		onCheckError: function () {
			this.setValue(_.result(this, 'defaultValue'), { noreset: true });
		}
	});

	// input[type=radio]
	var Radio = Field.extend({
		defaultValue: false,
		events: {
			change: function () {
				this.setValue(this.$el.prop('checked'), { render: false });
			}
		},
		renderValue: function () {
			var value = this.getValue();
			this.$el.prop('checked', value);
		}
	});

	// input[type=checkbox]
	var CheckBox = Field.extend({
		defaultValue: false,
		events: {
			change: function () {
				this.setValue(this.$el.prop('checked'), { render: false });
			}
		},
		renderValue: function () {
			var value = this.getValue();
			this.$el.prop('checked', value);
		}
	});

	var Datepicker = Field.extend({
		provide: 'ymd',
		events: {
			clDatepickerOnSelect: 'onChange',
			change: 'onChange'
		},
		onChange: function () {
			var val = this.$el.val();
			var valid = clutil.checkDate(val);
			var ymd;
			if (val) {
				var date = this.$el.datepicker('getDate');
				ymd = clutil.dateFormat(date, 'yyyymmdd');
			} else {
				ymd = null;
			}
			this.setValue(ymd, { render: false });
		},
		initialize: function () {
			Field.prototype.initialize.apply(this, arguments);
			if (this.$el.hasClass('hasDatepicker')) {
				this.$el.datepicker('destroy');
			}
			clutil.datepicker(this.$el, _.pick(this.options, 'min_date', 'initValue'));
		},
		renderValue: function () {
			var value = this.getValue();
			this.$el.datepicker('setIymd', value);
		}
	});

	/**
	 * @class Node
	 * @namespace clutil.FieldRelation
	 * @constructor
	 *
	 * @param [options]
	 * @param [options.provide]
	 * @param [options.depends]
	 * @example
	 * ```js
	 *
	 * var relation = clutil.FieldRelation.create('default', {
	 *   'node foo': {
	 *      onDependChange: function(attrs){
	 *        // 何かする
	 *      }
	 *   }
	 *   }
	 * })
	 * ```
	 */
	var Node = function (options) {
		this.options = options || {};
		fieldSetDepends(this, this.options);
		this.initialize(this.options);
	};

	_.extend(Node.prototype, Backbone.Events, {
		triggerMethod: triggerMethod,
		/**
		 * FieldRelation初期化時に呼ばれる
		 *
		 * @method initialize
		 */
		initialize: function () { },
		/**
		 * 変更を通知する
		 * @method triggerChange
		 */
		triggerChange: function (options) {
			options = (options || {});

			this.trigger('fr:change', this, this.getProvideAttrs(), options);
		},
		setValue: function (/*value*/) { },

		renderValue: function () { },

		/**
		 * Nodeの値を返す。通常はこれをオーバーライドする。
		 *
		 * @method getValue
		 */
		getValue: function () { },

		/**
		 * Nodeの値を返す。
		 *
		 * @method getAttrs
		 */
		getAttrs: function () {
			var attrs = {};
			attrs[this.provide] = this.getValue();
			return attrs;
		},

		/**
		 * Nodeの値を返す。FieldRelationはこれを呼んでNodeの値を取得す
		 * る。
		 *
		 * @method getProvideAttrs
		 */
		getProvideAttrs: function () {
			return this.getAttrs();
		},

		/**
		 * 依存パラメータ変更時に呼ばれる
		 * @method onDependChange
		 */
		setDependencies: function (attrs, options) {
			var relation = FieldRelation.getFieldRelation(this);
			options = _.extend({}, options, { relation: relation });
			clutil.Relation.buildAsync(options, this, this);
			options.setAsync();
			this.triggerMethod('visit', options);
			this.triggerMethod('depend:change', attrs, options);
			if (options.setDefault) {
				this.triggerMethod('clear', attrs, options);
			}
			if (options.setOnly) {
				this.triggerMethod('set', options);
			}
			this.triggerMethod('after:visit', options);
			return $.when.apply($, options.promises);
		}
	});

	Node.extend = Backbone.Model.extend;

	Node.create = function (proto) {
		var type = Node.extend(proto);
		return function (options) {
			return new type(options);
		};
	};

	/**
	 * 店舗選択(AMPAV0010Selector)のボタンを事業ユニットによって有効も
	 * しく無効状態にする。
	 *
	 * # 注意点
	 *
	 * 1. 店舗の参照権限がない場合はclutil.inputReadonlyなどでボタンを
	 * 非活性にする。このとき、干渉をおこさないように
	 * `FieldRelation#done(function(){...})`の中に一連のコードをいれる。
	 *
	 * 2. options.viewが指定された場合は、options.buttonのclickイベント
	 * を監視して勝手に`AMPAV0010SelectorView#show`を呼ぶ。勝手に呼ばれ
	 * たくない場合は`options.view`を指定しないこと。
	 *
	 *
	 * # 依存パラメータ
	 *
	 * - `unit_id`
	 * - `orgfunc_id`
	 *
	 * # 事業ユニット、店舗オートコンプリート、店舗選択の配置例
	 *
	 * ```js
	 * this.relation = clutil.FieldRelation.create('default', {
	 *   // 事業ユニット
	 *   clbusunitselector: {
	 *     el: '#ca_srchUnitID',
	 *     initValue: clcom.userInfo.unit_id
	 *   },
	 *   // 店舗オートコンプリート
	 *   clorgcode: {
	 *     el: '#ca_srchStoreID',
	 *     // p_org_idに依存するために必要
	 *     addDepends: ['p_org_id'],
	 *     dependSrc: {
	 *       // unit_idをp_org_idに設定するために必要
	 *       p_org_id: 'unit_id'
	 *     }
	 *   },
	 *   // 店舗参照ボタン
	 *   AMPAV0010: {
	 *     button: this.$('#ca_btn_store_select'),
	 *     // this.AMPAV0010SelectorはAMPAV0010SelectorViewインスタンス、あらかじめ
	 *     // 初期化しておく
	 *     view: this.AMPAV0010Selector,
	 *     // this.AMPAV0010Selector.show()へのオプション
	 *     showOptions: function(){
	 *       // 店舗階層のみ表示するようにorg_kind_setを指定する
	 *       return {
	 *          org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
	 *                         am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
	 *                         am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
	 *       };
	 *     }
	 *   }
	 * }, {
	 *   dataSource: {
	 *     orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
	 *     orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
	 *   }
	 * });
	 *
	 * this.relation.done(function() {
	 *   // もし権限がない場合は、この中でreadonly処理を行う。
	 * });
	 * ```
	 * @class AMPAV0010Controller
	 * @constructor
	 * @param [options]
	 * @param {jQuery} [options.button] 店舗の参照ボタンを指定する。事
	 * 業ユニットが設定されている場合に有効に、そうでない場合に無効にな
	 * る。
	 *
	 * @param {AMPAV0010SelectorView} [options.view]
	 * `AMPAV0010SelectorView`のインスタンスを指定する。指定されている
	 * 場合は、ボタンクリックで`AMPAV0010SelectorView#show`の呼び出しが
	 * 行われる。その際、`options.org_id`と`options.func_id`を指定する。
	 * `options.org_id`または`options.func_id`の値は
	 * `options.showOptions`に設定したものが優先される。
	 *
	 * @param {function|object} [options.showOptions] -
	 * AMPAV0010SelectorView#show()のoptions引数を指定する。
	 *
	 */
	var AMPAV0010Controller = Node.extend({
		depends: ['unit_id', 'orgfunc_id'],

		initialize: function () {
			_.bindAll(this, 'onButtonClick');
			var button = this.options.button;
			this.$button = button instanceof $ ? button : $(button);
			if (this.options.view) {
				this.view = this.options.view;
				this.func_id = clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID');
				this.$button.on('click.AMPAV0010Controller.', this.onButtonClick);
			}
			this.listenTo(clutil.mediator, {
			});
		},

		onDependChange: function (attrs) {
			var unit_id = Number(attrs.unit_id),
				orgfunc_id = Number(attrs.orgfunc_id);

			if (unit_id && orgfunc_id) {
				clutil.inputRemoveReadonly(this.$button);
			} else {
				clutil.inputReadonly(this.$button);
			}
			this.unit_id = unit_id;
			this.orgfunc_id = orgfunc_id;
		},

		onButtonClick: function () {
			var showOptions = this.getShowOptions();
			this.view.show(showOptions);
		},

		getShowOptions: function () {
			var showOptions = getOption(this, 'showOptions') || {};
			if (_.isFunction(showOptions)) {
				showOptions = showOptions.call(this);
			}
			_.defaults(showOptions, {
				org_id: this.unit_id,
				func_id: this.func_id
			});
			return showOptions;
		},

		remove: function () {
			this.stopListening();
			this.$button.off('click.AMPAV0010Controller');
		}
	});

	var Branch = function (options) {
		this.isBranch = true;
		this.provide = options.provide;
		this.depends = options.depends;
		this.dependencies = new Backbone.Model();
		this.dependencies.set(this.provide, 0);
	};

	_.extend(Branch.prototype, Backbone.Events, {
		setValue: function () { },
		renderValue: function () { },
		getValue: function () {
			return this.dependencies.get(this.provide);
		},
		getAttrs: function () {
			return this.getProvideAttrs();
		},
		getProvideAttrs: function () {
			return this.dependencies.pick(this.provide);
		},
		setDependencies: function (attrs) {
			this.dependencies.set(attrs);
		}
	});


	////////////////////////////////////////////////////////////////

	var argDefSplitter = /\s+/;
	function buildOptions(argdef, args) {
		args = _.toArray(args);
		if (args.length === 1 && !(args[0] instanceof jQuery) && _.isObject(args[0])) {
			return args[0];
		} else if (args.length === 2 && _.isObject(args[1])) {
			args[1].el = args[0];
			return args[1];
		} else {
			return _.reduce(_.object(argdef, args), function (memo, v, k) {
				if (argDefSplitter.test(k)) {
					var keys = k.split(argDefSplitter);
					for (var i = 1; i < keys.length; i++) {
						setNested(memo, keys[i].replace('@', keys[0]), v);
					}
				} else {
					memo[k] = v;
				}
				return memo;
			}, {});
		}
	}

	function checkRequiredSelect(field) {
		if (field.$el.hasClass('cl_required') ||
			field.$el.is('.requiredSelect > div > select')) {
			field.isRequiredField = true;
		}
	}

	function addCommonOptions(options, def, userOptions) {
		options.behaviors = ['errorOnDisable'];
		options.checker = new Checker();
		def || (def = {});
		_.extend(
			options,
			_.pick(def, 'provide', 'depends', 'defaultValue', 'compat', 'clMediatorEvents', 'itemTemplate', 'autocomplete', 'isCompoundValue', 'onAfterInitialize', 'defaultCond', 'buildAttrs', 'checkAttrs'),
			def.viewOptions, userOptions);
		if (!options.hasFieldRelation && options.initValue != null) {
			options.setDefault = false;
		}
	}

	function buildAutocompleteFields(defs, exports) {
		// [def.funcName] 関数名
		// def.query    reuired object
		// def.query.url リクエストURL
		// def.getItems {Function or String} サーバレスポンスの候補配列のパス
		// condMapping {Object} プロパティ名からサーバリクエストのキーへのマップ
		// itemMapping {Object}
		_.each(defs, function (def, id) {
			var funcName = def.funcName || 'cl' + id;
			exports[funcName] = function (el, opt) {
				var reqres;
				if (def.query && !def.query.fake && !clutil.field.useDummyData) {
					reqres = new AcQuery(def.query);
				} else {
					reqres = new StubQuery(def.query);
				}
				var userOptions = buildOptions(def.args || ['el'], arguments);

				var options = {
					reqres: reqres,
					defaultValue: { id: 0, name: '', code: '' }
				};

				addCommonOptions(options, def, userOptions);
				if (options.itemTemplate) {
					options.reqres.itemTemplate = buildTemplate(options.itemTemplate);
				}
				if (!options.isCompoundValue) {
					options.defaultValue = 0;
				}
				var field = new AutoCompleteField(options);
				return field;
			};
		});
	}

	function buildSelectFields(defs, exports) {
		// [def.funcName] 関数名
		// def.query    reuired object
		// def.query.url リクエストURL
		// def.getItems {Function or String} サーバレスポンスの候補配列のパス
		// condMapping {Object} プロパティ名からサーバリクエストのキーへのマップ
		// itemMapping {Object}
		_.each(defs, function (def, id) {
			var funcName = def.funcName || 'cl' + id + 'selector';
			exports[funcName] = function ($view, opt) {
				var reqres;
				if (!def.query.fake && !clutil.field.useDummyData) {
					reqres = new SelectorQuery(def.query);
				} else {
					reqres = new StubQuery(def.query);
				}
				var userOptions = buildOptions(def.args || ['el', 'unselectedflag'],
					arguments);
				var options = {
					reqres: reqres,
					funcName: funcName
				};

				addCommonOptions(options, def, userOptions);

				var field = new SelectField(options);
				checkRequiredSelect(field);
				return field;
			};
		});
	}

	function buildAllFields(exports) {
		// autocomplete部品
		buildAutocompleteFields(fieldDefs.autocomplete, exports);
		// selector部品
		buildSelectFields(fieldDefs.selector, exports);
		// 区分selector部品
		exports.cltypeselector = function ($view, opt) {
			var reqres = new TypeQuery();
			var userOptions = buildOptions(
				['el', 'kind', 'unselectedflag', 'nameOnly'],
				arguments);
			var options = {
				reqres: reqres
			};
			if (!userOptions.el) {
				userOptions.el = userOptions.$select;
			}
			addCommonOptions(options, null, userOptions);
			var field = new TypeSelector(options);
			checkRequiredSelect(field);
			return field;
		};
		// input[type=text]
		exports.text = function (opt) {
			var options = {};
			addCommonOptions(options, null, opt);
			var field = new Text(options);
			return field;
		};
		exports.radio = function (opt) {
			var options = {};
			addCommonOptions(options, null, opt);
			var field = new Radio(options);
			return field;
		};
		exports.checkbox = function (opt) {
			var options = {};
			addCommonOptions(options, null, opt);
			var field = new CheckBox(options);
			return field;
		};
		exports.datepicker = function (opt) {
			var options = {};
			addCommonOptions(options, null, opt);
			_.defaults(options, {
				initValue: clcom.getOpeDate()
			});
			var field = new Datepicker(options);
			return field;
		};
		exports.select = function (opt) {
			var options = {};
			addCommonOptions(options, null, opt);
			var field = new Select(options);
			checkRequiredSelect(field);
			return field;
		};
		exports.node = function (opt) {
			var MyNode = Node.extend(opt);
			return new MyNode();
		};

		exports.AMPAV0010 = function (opt) {
			return new AMPAV0010Controller(opt);
		};
	}

	function showHelp() {
		var s = '';
		var template = '';
		// template += '/**\n';
		// template += ' * <%= it.funcName %>(<%= (it.args || []).join(", ") %>)\n';
		// template += '<% _.each(it.compat, function (name) { %>';
		// template += ' * @param options.<%= name %> <%= it.tr[name] %> \n';
		// template += '<% }); %>';
		// template += ' */\n';
		template += '# <%= it.funcName %>(<%= (it.args || []).join(", ") %>)\n';
		template = buildTemplate(template);
		var tr = {};
		_.each(clutil.fieldDefs.selector, function (def, name) {
			var it = _.extend({}, def, {
				tr: tr,
				funcName: 'cl' + name + 'selector',
				args: _.chain(def.args).map(function (name) {
					return name.split(/\s+/)[0];
				}).value()
			});
			s += template(it);
		});
		_.each(clutil.fieldDefs.autocomplete, function (def, name) {
			var it = _.extend({}, def, {
				tr: tr,
				funcName: 'cl' + name,
				args: ['el', 'options']
			});
			s += template(it);
		});

		console.log(s);
	}

	FieldRelation.showHelp = showHelp;

	_.extend(FieldRelation, {
		Node: Node
	});

	_.extend(clutil, {
		fields: {},
		FieldRelation: FieldRelation
	});

	_.extend(clutil.field, {
		AcDefaultItemTemplate: AcQueryDefaultItemTemplate,
		Behavior: Behavior,
		Field: Field,
		AutoCompleteField: AutoCompleteField,
		Query: Query,
		AcQuery: AcQuery,
		StubQuery: StubQuery
	});

	// テンプレートのコンパイルを行う。
	function prepFieldDefs(defs) {
		_.each(defs, function (sub, type) {
			_.each(sub, function (def, name) {
				if (def.query && def.query.itemTemplate &&
					!_.isFunction(def.itemTemplate)) {
					def.query.itemTemplate = buildTemplate(def.query.itemTemplate);
				}
			});
		});
	}
	prepFieldDefs(clutil.fieldDefs);
	buildAllFields(clutil.fields);

	// clではじまる関数だけclutilにexportする
	_.each(clutil.fields, function (func, name) {
		if (/^cl/.test(name)) {
			clutil[name] = func;
		}
	});
	// _.extend(clutil, clutil.fields);

	(function () {
		var origSet, origGet;
		if ($.valHooks.select) {
			origSet = $.valHooks.select.set;
			origGet = $.valHooks.select.get;
		} else {
			$.valHooks.select = {};
		}

		$.valHooks.select = {
			set: function (el, value) {
				var $el = $(el), cid = $el.attr('data-field-cid');
				if (cid) {
					var fr = clutil.FieldRelation.getFieldRelationByCid(cid);
					var field = clutil.FieldRelation.getFieldByCid(cid);
					if (field && !fr && !$el.attr('preventValhooks')
					) {
						clutil.FieldRelation.$set($el, value, { render: false });
					}
				}
				if (origSet) {
					return origSet.call(this, el, value);
				} else {
					el.value = value;
					return value;
				}
			},
			get: origGet
		};
	}());
}(clcom, clutil, clutil.field));


/*
 * 本 JS は、clcom.js の後に召喚してください。
 */
$(function () {

	// clutil 拡張
	_.extend(clutil, {
		/**
		 * 処理区分値に対するラベル名を返します。
		 */
		opeTypeIdtoString: function (opeTypeId, _btnlabel) {
			var s = '';
			switch (opeTypeId) {
				//case -1:											s = '';			break;
				//case 0:												s = '一覧';		break;	// SPECIAL
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
					s = (_btnlabel <= 1) ? '登録' : '新規登録';
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					s = (_btnlabel == 1) ? '登録' : '編集';
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL: s = '削除'; break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL: s = '照会'; break; //'参照'; break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV: s = 'Excelデータ出力'; break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT: s = 'Excelデータ取込'; break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
					s = (_btnlabel == 1) ? '登録' : '複製';
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF: s = '帳票出力'; break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DELCANCEL: s = '削除復活'; break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL: s = '予約取消'; break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE: s = '一時保存'; break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY: s = '申請'; break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL: s = '承認'; break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK: s = '差戻し'; break;
				default:
			}
			return s;
		},

		/**
		 * 処理区分値に対する権限分類
		 */
		opeTypeIdPerm: function (opeTypeId) {
			switch (opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW: return 'write';	// 新規登録
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD: return 'write';	// 編集
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL: return 'del';	// 削除
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL: return 'read';	// 参照
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV: return 'read';	// CSV出力
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT: return 'write';	// CSV取込
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY: return 'write';	// 複製
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF: return 'read';	// PDF出力
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DELCANCEL: return 'write';	// 削除復活
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL: return 'del';	// 予約取消
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE: return 'write';	// 一時保存
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY: return 'write';	// 申請
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL: return 'write';	// 承認
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK: return 'del';	// 差し戻し

				case 101:	// 保存
				case 102:	// タグ発行申請
				case 103:	// タグ発行差戻し
				case 104:	// タグ発行承認
				case 105:	// 最終承認申請
				case 106:	// 最終承認差戻し
				case 107:	// 最終承認
					return 'write';
			}
			return '';
		},

		/**
		 * ボタンタグ id に対する処理区分値を返します。定型の id 名を用いていない場合は -1 を返します。
		 */
		btnOpeTypeId: function (btn) {
			var btnId = null;
			if (btn instanceof jQuery && btn.length > 0) {
				btnId = btn[0].id;
			} else if (_.isElement(btn)) {
				btnId = btn.id;
			} else if (_.isString(btn)) {
				btnId = $.trim(btn);
			}
			if (!_.isEmpty(btnId)) {
				switch (btnId) {
					case 'cl_new': return am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;			// 新規登録
					case 'cl_edit': return am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;			// 編集
					case 'cl_delete': return am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL;			// 削除
					case 'cl_rel': return am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;			// 参照
					case 'cl_csv': return am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV;			// CSV出力
					case 'cl_csvinput': return am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT;	// CSV取込
					case 'cl_copy': return am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY;		// 複製
					case 'cl_pdf': return am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF;			// PDF出力
					case 'cl_delcancel': return am_proto_defs.AM_PROTO_COMMON_RTYPE_DELCANCEL;	// 削除復活
					case 'cl_rsvcancel': return am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL;	// 予約取消
					case 'cl_tmpsave': return am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE;		// 一時保存
					case 'cl_apply': return am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY;		// 申請
					case 'cl_approval': return am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL;	// 承認
					case 'cl_passback': return am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK;	// 差し戻し
					default:
				}
			}
			return -1;
		},

		/**
		 * 処理区分値が有効かどうか検査
		 */
		isValidOpeTypeId: function (opeTypeId) {
			// ラベルが取れないものは opeTypeId 範疇の外
			return !_.isEmpty(clutil.opeTypeIdtoString(opeTypeId));
		},

		/**
		 * ディープコピー版 clone 関数。
		 */
		dclone: _.deepClone,

		/**
		 * 空更新チェック用比較関数。
		 * val1 要素のプロパティを正とし、val2 要素と比較する。
		 * val1 に無い余分なプロパティが val2 側に含んでいる場合、その余剰プロパティは検査対象外とする。
		 */
		protoIsEqual: function (val1, val2) {
			if (val1 === val2) {
				// 参照先が同一。
				return true;
			}
			if (_.isArray(val1)) {
				// 配列: 各要素を再帰比較する。
				if (!_.isArray(val2)) {
					return false;
				}
				if (val1.length !== val2.length) {
					return false;
				}
				for (var i = 0; i < val1.length; i++) {
					if (!clutil.protoIsEqual(val1[i], val2[i])) {
						return false;
					}
				}
			} else if (_.isObject(val1)) {
				// Object: 各プロパティを再帰比較する。
				for (var key in val1) {
					if (!_.has(val2, key)) {
						return false;
					}
					if (!clutil.protoIsEqual(val1[key], val2[key])) {
						return false;
					}
				}
			} else {
				return val1 == val2;
			}
			return true;
		},

		/**
		 * 当該オブジェクトから、prefix で指定したプロパティを削除する。
		 */
		delPrefixedProperty: function (obj, prefix) {
			if (_.isEmpty(prefix)) {
				return obj;
			}
			var regex;
			if (_.isRegExp(prefix)) {
				regex = prefix;
			} else {
				regex = new RegExp('^' + prefix.toString());
			}
			if (_.isArray(obj)) {
				for (var i = 0; i < obj.length; i++) {
					clutil.deletePrefixedProperty(obj[i], regex);
				}
			} else if (_.isObject(obj)) {
				for (var key in obj) {
					if (key.match(regex)) {
						delete obj[key];
					}
				}
			}
			return obj;
		}
	});

	/**
	 * 共通で使える View クラス
	 */
	if (!clutil.View) {
		clutil.View = {};
	}
	_.extend(clutil.View, {

		/**
		 * 共通ヘッダ View
		 */
		CommonHeaderView: Backbone.View.extend({
			id: 'header',
			template: _.template(''
				+ '<% if(backBtnURL){ %>'
				+ '<p class="back"></p>'
				+ '<% } %>'
				+ '<% if(!_.isEmpty(category)) { %>'
				+ '<h1><%- category %></h1>'
				+ '<% } %>'
				+ '<div class="rightBox">'
				+ '	<span class="logo"></span>'
				+ '	<span class="logout"><a style="cursor: pointer;">ログアウト</a></span>'
				+ '	<span class="user"><%- clcom.userInfo.user_code %>:<%- clcom.userInfo.user_name %></span>'
				+ '	<span class="date"><%- clutil.dateFormat(clcom.getOpeDate(), "yyyy/mm/dd(w)") %></span>'
				+ '</div>'),
			events: {
				// ログアウト
				'click .back:not([disabled])': '_onBackClick',	// 戻るボタン押下時
				'click .logout a:not([disabled])': '_onLogout'		// ログアウト
			},
			initialize: function (opt) {
				// オプション補完
				this.options = _.defaults(opt || {}, {
					category: '',
					backBtnURL: clcom.homeUrl
				});
			},
			initUIElement: function () {
				return this;
			},
			render: function () {
				this.$el.html(this.template(this.options));
				return this;
			},

			/**
			 * 戻るボタン押下時
			 */
			_onBackClick: function (e) {
				if (_.isFunction(this.options.backBtnURL)) {
					// 関数指定の場合はコールバックする。
					this.options.backBtnURL(e);
				} else {
					// メニュー画面へ
					clcom.pushPage(this.options.backBtnURL, null, null, null, true);
				}
			},

			/**
			 * ログアウト
			 */
			_onLogout: function (e) {
				clcom.logout();
			},

			_eof: 'clutil.View.CommonHeaderView//'
		}),

		/**
		 * MDBaseView -- MD共通画面におけるデフォルトのオプション定義
		 */
		MDBaseViewDefaultOptions: function () {
			var map = new Object();

			var headTagTitle = $('head > title').text();

			// 一覧画面
			map[0] = {
				// ヘッダ部
				opeTypeId: 0,				// 処理区分値、一覧は定義されていないので 0 とする。
				btn_new: true,			// 新規作成ボタン有無
				category: headTagTitle,	// カテゴリ名：「商品」とか、「補正」とか・・・省略時は <title> 要素のテキストを適用する。
				title: '○○マスタ',	// タイトル名
				subtitle: '一覧',			// サブタイトル名 -- 省略可、opeTypeId 値から補完する。

				// フッタ部[A]
				btn_submit: false,			// True: [キャンセル|処理区分ボタン] がつく。False:なし。
				btn_cancel: false,			// True: [キャンセル] ボタンあり、False:なし。

				// フッタ部[B]
				pageCount: 0,				// 2以上を指定すると、＜前へ｜次へ＞ボタンがつく。
				pageIndex: 0,				// pageCount >= 2 の場合の、表示中アイテムに対する index
				btn_csv: true,			// True: CSV出力ボタンがつく。
				btn_pdf: false,			// True: PDF出力ボタンがつく。	[4/10 New!]

				// UI制御オプション
				opebtn_auto_enable: true,		// 行選択にともなう class="cl_opebtngroup" 要素配下のボタンの活性化/非活性化を自動で行う。
				auto_cl_validate: true,		// 個々の入力部品における blur イベントでの validation をするかどうか	[4/10 New!]
				updMessageDialog: true		// 「登録」完了時に「登録が完了しました」ダイアログを、true:表示する、false:しない
			};

			// 編集画面
			map[am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD] = {
				// ヘッダ部
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
				btn_new: false,			// 新規作成ボタン有無
				category: headTagTitle,	// カテゴリ名：「商品」とか、「補正」とか・・・省略時は <title> 要素のテキストを適用する。
				title: '○○マスタ',	// タイトル名
				subtitle: '編集',			// サブタイトル名 -- 省略可、opeTypeId 値から補完する。

				// フッタ部[A]
				btn_submit: true,			// True: [キャンセル|処理区分ボタン] がつく。False:なし。
				btn_cancel: true,			// True: [キャンセル] ボタンあり、False:なし。

				// フッタ部[B]
				pageCount: 1,				// 2以上を指定すると、＜前へ｜次へ＞ボタンがつく。
				pageIndex: 0,				// pageCount >= 2 の場合の、表示中アイテムに対する index
				btn_csv: false,			// True: CSV出力ボタンがつく。
				btn_pdf: false,			// True: PDF出力ボタンがつく。

				// UI制御オプション
				opebtn_auto_enable: false,
				auto_cl_validate: true,
				updMessageDialog: true,
				confirmLeaving: true		// 画面から離れるときに確認ダイアログを表示する
			};

			// 参照モード
			map[am_proto_defs.AM_PROTO_COMMON_RTYPE_REL] = {
				// ヘッダ部
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				btn_new: false,			// 新規作成ボタン有無
				category: headTagTitle,	// カテゴリ名：「商品」とか、「補正」とか・・・省略時は <title> 要素のテキストを適用する。
				title: '○○マスタ',	// タイトル名
				subtitle: '照会',			// サブタイトル名 -- 省略可、opeTypeId 値から補完する。

				// フッタ部[A]
				btn_submit: false,			// True: [キャンセル|処理区分ボタン] がつく。False:なし。
				btn_cancel: false,			// True: [キャンセル] ボタンあり、False:なし。

				// フッタ部[B]
				pageCount: 1,				// 2以上を指定すると、＜前へ｜次へ＞ボタンがつく。
				pageIndex: 0,				// pageCount >= 2 の場合の、表示中アイテムに対する index
				btn_csv: false,			// True: CSV出力ボタンがつく。
				btn_pdf: false,			// True: PDF出力ボタンがつく。

				// UI制御オプション
				opebtn_auto_enable: false,
				auto_cl_validate: false,
				updMessageDialog: true,

				// 参照モードスペシャル
				backBtnURL: false,				// 「＜」戻るボタンを使わない
				cssClasses: 'cl_readonly'		// mdBaseView.$el に付加するクラス
			};

			// その他、処理区分が明示されたもの：参照系標準(defaultRefTmpl)、更新系標準(defaultUpdTmpl)
			var defaultRefTmpl = {
				// ヘッダ部
				opeTypeId: -1,
				btn_new: false,			// 新規作成ボタン有無
				category: headTagTitle,	// カテゴリ名：「商品」とか、「補正」とか・・・省略時は <title> 要素のテキストを適用する。
				title: '○○マスタ',	// タイトル名
				subtitle: null,			// サブタイトル名 -- 省略可、opeTypeId 値から補完する。

				// フッタ部[A]
				btn_submit: true,			// True: [キャンセル|処理区分ボタン] がつく。False:なし。
				btn_cancel: true,			// True: [キャンセル] ボタンあり、False:なし。

				// フッタ部[B]
				pageCount: 1,				// 2以上を指定すると、＜前へ｜次へ＞ボタンがつく。
				pageIndex: 0,				// pageCount >= 2 の場合の、表示中アイテムに対する index
				btn_csv: false,			// True: CSV出力ボタンがつく。
				btn_pdf: false,			// True: PDF出力ボタンがつく。

				// UI制御オプション
				opebtn_auto_enable: false,
				auto_cl_validate: true,
				updMessageDialog: true
			};
			var defaultUpdTmpl = _.defaults({
				confirmLeaving: true			// 画面から離れるときに確認ダイアログを表示する
			}, defaultRefTmpl);

			map[am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW] = defaultUpdTmpl;			// 新規登録
			map[am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL] = defaultUpdTmpl;			// 削除
			map[am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT] = defaultUpdTmpl;	// CSV取込
			map[am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY] = defaultUpdTmpl;			// 複製
			map[am_proto_defs.AM_PROTO_COMMON_RTYPE_DELCANCEL] = defaultUpdTmpl;	// 削除復活
			map[am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL] = defaultUpdTmpl;	// 予約取消
			map[am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE] = defaultUpdTmpl;		// 一時保存
			map[am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY] = defaultUpdTmpl;		// 申請
			map[am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL] = defaultUpdTmpl;		// 承認
			map[am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK] = defaultUpdTmpl;		// 差し戻し

			// その他
			map['*'] = defaultRefTmpl;

			return {
				map: map,
				get: _.bind(function (opetype) {
					if (_.isArray(opetype) && opetype.length > 1) {
						opetype = opetype[0];
					}
					if (_.isObject(opetype) && _.has(opetype, 'opeTypeId')) {
						opetype = opetype.opeTypeId;
					}
					var dfopt = null;
					if (_.isFinite(opetype)) {
						dfopt = this[opetype];
					}
					if (dfopt == null) {
						dfopt = this['*'];
					}
					return dfopt;
				}, map)
			};
		}(),

		/**
		 * 全体を覆うMD基盤共通 View クラス
		 * 共通ヘッダ部を内包する。
		 */
		MDBaseView: Backbone.View.extend({
			el: $('body'),

			// 基本動作コンフィギュレーション
			config: {
				// 変更ナシデータによる更新許可、true:許可、false:空更新チェックをする
				allowUpdateByNonChangedData: true
			},

			// タイトル用テンプレート
			title_tmpl: _.template(''
				+ '<div id="title">'
				+ '<h2><%- title %><% if(!_.isEmpty(subtitle)){ %><span class="divider">|</span><%- subtitle %><% } %></h2>'
				+ '<div class="titleInBoxRight">'
				+ '<% if(btn_new){ %>'
				+ '<p class="addNew"><a id="cl_new">新規作成</a></p>'
				+ '<% } %>'
				+ '<% if(pageCount > 1){ %>'
				+ '<p><a id="cl_step"><%- (pageIndex+1) %>/<%- pageCount %></a></p>'
				+ '<% } %>'
				+ '</div>'
				+ '</div>'
			),

			// 確定済ラベルとか・・・ ==> $('#title').after(!ココに差し込む!)
			ribbonBox_tmpl: _.template('<div class="ribbonBox primary dispn"><%- text %></div>'),

			// フッタ部ナビペインテンプレート ==> this.$('#mainColumnFooter') の中身を構成する
			// 2段構成の場合は、this.$('#mainColumnFooter').addClass('x2') をセットする。
			footernav2_tmpl: _.template(''
				+ '<% if(btn_submit){ %>'
				+ '<% if(btn_cancel){ %>'
				+ '<p class="cancel"><a id="cl_cancel"><%- btn_cancel.label %></a></p>'
				+ '<% } %>'
				+ '<div class="submit_btn_group"></div>'
				+ '<div class="clear"></div>'
				+ '<% } %>'
				+ '<% if(pageCount > 1){ %>'
				+ '<p class="left"><a id="cl_prev" <% if(pageIndex <= 0){ %>style="display: none;"<% } %>>前へ</a></p>'
				+ '<% } %>'
				+ '<div class="dl_btn_group"></div>'
				+ '<% if(pageCount > 1){ %>'
				+ '<p class="right"><a id="cl_next" <% if(pageIndex >= pageCount-1){ %>style="display: none;"<% } %>>次へ</a></p>'
				+ '<% } %>'
				+ '<div class="clear"></div>'
			),
			// フッタ部ナビ：Submit ボタン系
			footernav2_submitbtn_tmpl: _.template(''
				+ '<p class="flleft <%= classNames %>" style="width: <%- width %>;">'
				+ '<a class="cl_submit" data-opetypeid="<%= opeTypeId %>"><%- label %></a>'
				+ '</p>'
			),
			// フッタ部ナビ：DL ボタン系
			footernav2_dlbtn_tmpl: _.template(''
				+ '<p class="flleft" style="width: <%- width %>;">'
				+ '<a class="cl_download" data-opetypeid="<%= opeTypeId %>"><%- label %></a>'
				+ '</p>'
			),

			events: {
				// イベント伝播しないもの
				'click #cl_cancel:not([disabled])': '_onCancelClick',	// キャンセル

				// 以下、clutil.mediator を通してイベント伝播させるもの
				// ope_btn 系 --------------------------------------------------------------//
				'click #cl_new:not([disabled])': '_onNewClick',		// 新規登録
				'click #cl_edit:not([disabled])': '_onEditClick',		// 編集
				'click #cl_delete:not([disabled])': '_onDelClick',		// 削除
				'click #cl_rel:not([disabled])': '_onCSVClick',		// 参照
				'click #cl_csv:not([disabled])': '_onCSVClick',		// CSV出力
				'click #cl_csvinput:not([disabled])': '_onCSVInputClick',	// CSV取込
				'click #cl_copy:not([disabled])': '_onCopyClick',		// 複製		// これはクラスセレクタのような・・・
				'click #cl_pdf:not([disabled])': '_onPDFClick',		// PDF出力
				'click #cl_delcancel:not([disabled])': '_onDelCancelClick',	// 削除復活
				'click #cl_rsvcancel:not([disabled])': '_onRsvCancelClick',	// 予約取消
				'click #cl_tmpsave:not([disabled])': '_onTmpSaveClick',	// 一時保存
				'click #cl_apply:not([disabled])': '_onApplyClick',		// 申請
				'click #cl_approval:not([disabled])': '_onApprovalClick',	// 承認
				'click #cl_passback:not([disabled])': '_onPassbackClick',	// 差し戻し

				// 画面制御系 --------------------------------------------------------------//
				//'click #cl_submit:not([disabled])'			: '_onSubmitClick',	// 登録/削除
				'click #mainColumnFooter .cl_submit:not([disabled])': '_onFooterNavSubmitClick',	// Submit 系ボタン
				'click #mainColumnFooter .cl_download:not([disabled])': '_onFooterNavDownloadClick',	// DL 系ボタン
				'click #cl_prev:not([disabled])': '_onPrevClick',	// 前へ
				'click #cl_next:not([disabled])': '_onNextClick',	// 次へ
				//				'focus .cl_valid'							: '_onFocusClValidate',		// 自動 validation: フォーカス
				'focusout .cl_valid': '_onBlurClValidate',		// 自動 validation: ブラー
				'focus :focusable': '_onFocusForScrollAdjust'	// body スクロール位置補正
			},

			// 必須要素が無かった場合の補完
			_prepareUIElement: function () {
				var $main = this.$('#ca_main');
				if ($main.length === 0) {
					$main = this.$el;	// $el は <body>
				} else {
					// モーダルダイアログでボカシエリア定義（⇒ #ca_main）を page-wrap する。
					var $pgWrap = this.$('#page-wrap');
					if ($pgWrap.length === 0) {
						// メモ：
						// この時点で #ca_main に対する View のインスタンス（MainView）は既に生成されている。
						// View インスタンスが出来た後で MainView.$el の構造を変化させると不具合がでる。
						// <div id="page-wrap">を入れたければ、最初から HTML に入れておくべき！！！！
						//						$main.wrap('<div id="page-wrap">');
					}
				}

				// ヘッダのエコーバック領域
				var $echoback = this.$('.cl_echoback').hide();
				if ($echoback.length === 0) {
					$echoback = $('<div class="cl_echoback msgBox error"></div>').hide();
					$main.prepend($echoback);
					console.log('attatch: $echoback element.');
				}
				// ダイアログ表示用領域
				var $dialog = this.$('#cl_dialog_area');
				if ($dialog.length === 0) {
					$dialog = $('<div id="cl_dialog_area" class="cl_dialog"></div>');
					this.$el.append($dialog);
					console.log('attatch: $dialog element.');
				}
			},

			initialize: function (opt) {
				_.bindAll(this);

				// 必須要素を準備する。
				this._prepareUIElement();

				// オプションを整理する
				var fixopt = function (opt) {
					var o = opt || {};

					// 一覧系かどうか -- opeTypeId の指定が無い場合は、一覧画面扱いとする。・・・やりすぎか？
					if (_.isNull(o.opeTypeId) || _.isUndefined(o.opeTypeId)) {
						o.opeTypeId = 0;
					}

					// オプションにデフォルト値を充てる
					var opt_default = clutil.View.MDBaseViewDefaultOptions.get(o.opeTypeId);
					_.defaults(o, opt_default);

					// カテゴリをこの画面のメニュー中分類名に設定する
					var title = clcom.getMiddleMenuName();
					if (title) {
						o.category = title;
					}

					// タイトル補完
					if (_.isNull(o.title) || _.isUndefined(o.title)) {
						o.title = '';						// template の関係で、無い場合は空文字入れておく
					}

					// サブタイトル補完
					if (_.isNull(o.subtitle) || _.isUndefined(o.subtitle)) {
						var s = clutil.opeTypeIdtoString(o.opeTypeId);
						o.subtitle = _.isEmpty(s) ? '' : s;	// template の関係で、無い場合は空文字入れておく
					}

					// pageCount 補正
					// 処理区分が「編集」以外は「＜前へ」「次へ＞」ナビを強制 OFF にする。
					//					if(o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD && o.pageCount > 1){
					//						o.pageCount = 1;
					//					}
					switch (o.opeTypeId) {
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:			// 新規登録
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:			// 削除
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:			// 参照
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:			// CSV出力
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT:		// CSV取込
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:			// 複製
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:			// PDF出力
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_DELCANCEL:		// 削除復活
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:		// 予約取消
							if (o.pageCount > 1) {
								o.pageCount = 1;
							}
							break;
						//					case 'cl_edit':		return am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;			// 編集
						//					case 'cl_tmpsave':	return am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE;		// 一時保存
						//					case 'cl_apply':	return am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY;		// 申請
						//					case 'cl_approval':	return am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL;	// 承認
						//					case 'cl_passback':	return am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK;	// 差し戻し
					}

					// キャンセルボタン拡張
					if (o.btn_cancel) {
						var btnCancel = {
							label: '一覧に戻る'
						};
						if (o.btn_cancel === true) {
							// boolean で true 明示 ⇒ デフォルト
							; //o.btn_cancel = btnCancel;
						} else if (_.isFunction(o.btn_cancel)) {
							// 関数 ⇒ キャンセルボタンクリックアクション
							btnCancel.action = o.btn_cancel;
						} else if (_.isObject(o.btn_cancel)) {
							// Objectで指定 ⇒ 拡張する。
							_.extend(btnCancel, o.btn_cancel);
						}
						o.btn_cancel = btnCancel;
					}

					return o;
				}(opt);
				this.options = fixopt;

				// clcom コンフィギュレーション - 参照モードならブラウザ戻るボタン、［×］ボタンの Confirm を行わない。
				var xOpeTypeId = this.getRepresentOpeTypeId(fixopt.opeTypeId, NaN);
				if (xOpeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
					// 照会モードの場合はブラウザ戻るボタン、［×］ボタンの Confirm を行わない。
					clcom._preventConfirm = true;
				} else if (_.isNaN(xOpeTypeId)) {
					console.warn('opeTypeId: 照会モードかどうか判断できない！');
				}

				// 共通ヘッダ
				var cmHeaderOpt = _.pick(fixopt, 'category', 'backBtnURL');
				if (cmHeaderOpt.backBtnURL !== false) {
					this.options.backBtnURL = cmHeaderOpt.backBtnURL || clcom.homeUrl;
					cmHeaderOpt.backBtnURL = _.bind(function (e) {
						var backURL = this.options.backBtnURL;
						if (this.options.confirmLeaving) {
							// メニュー画面へ
							this._ConfirmLeaving(clcom.pushPage, backURL, null, null, null, true);
						} else {
							clcom.pushPage(backURL, null, null, null, true);
						}
					}, this);
				} else {
					// backBtnURL 明示 false の場合、黒帯ヘッダ左上「＜」は表示しないモード。
				}
				this.commonHeader = new clutil.View.CommonHeaderView(cmHeaderOpt);

				// ページ: ＜前へ：次へ＞
				this.pagesStat = [];
				if (!fixopt.pageCount || fixopt.pageCount < 0) {
					this.pagesStat.push({
						comment: null,	// 当該ページを開いた時点でエラーメッセージを表示 -- 「登録済です」みたいな・・
						ribbon: null,	// リボンエリアのメッセージ
						status: null,	// データ取得状態
						// null			未取得
						// 'OK'			データ取得済、
						// 'DONE'		登録/削除完了 何の処理が完了したのかは、this.options.opeTypeId で判断。
						// 'CONFLICT'	他者が更新済
						// 'DELETED'	他者が削除済
						block: false,	// 「登録」/「削除」ボタンが操作可能かどうか
						data: null		// GET の応答データ
					});
				} else {
					for (var i = 0; i < fixopt.pageCount; i++) {
						this.pagesStat.push({
							comment: null,
							ribbon: null,
							status: null,
							block: false,
							data: null
						});
					}
				}
				// ページインデックス
				if (_.isNumber(fixopt.pageIndex)) {
					var idx = Math.max(fixopt.pageIndex, 0);
					idx = Math.min(idx, this.pagesStat.length - 1);
					fixopt.pageIndex = idx;
				}

				// イベント
				// ヘッダ表示のエラーメッセージを受け取る
				clutil.mediator.on('onTicker', this._onTicker);
				if (fixopt.opebtn_auto_enable) {
					// 行選択の変更イベントを受け取る
					clutil.mediator.on('onRowSelectChanged', this._setOpeButtonUI);
				}

				this.listenTo(clutil.mediator, {
					'validation:require': this._onBlurClValidateImpl
				});

				// 全体スタイル
				if (fixopt.cssClasses) {
					this.$el.addClass(fixopt.cssClasses);
				}
			},

			initUIElement: function () {
				this.commonHeader.initUIElement();

				/*
				 * validator エラー時の表示領域
				 * MDBaseView クラスでは、ヘッダ部へのメッセージ表示にしか使用しません。
				 * 各アプリフィールドのチェックのための validator は clutil.validator を別途立ててもらう。
				 */
				this.validator = clutil.validator(this.$el, {
					echoback: this.$('.cl_echoback').hide()
				});

				// 権限仕込み
				var permAdd = function () {
					var permadd = {
						// Ope ボタン
						'#cl_new': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW),		// 新規登録
						'#cl_edit': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD),		// 編集
						'#cl_delete': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL),		// 削除
						'#cl_rel': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_REL),		// 参照
						'#cl_csv': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV),		// CSV出力
						'#cl_csvinput': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT),	// CSV取込
						'#cl_copy': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY),		// 複製
						'#cl_pdf': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF),		// PDF出力
						'#cl_delcancel': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_DELCANCEL),	// 削除復活
						'#cl_rsvcancel': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL),	// 予約取消
						'#cl_tmpsave': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE),	// 一時保存
						'#cl_apply': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY),		// 申請
						'#cl_approval': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL),	// 承認
						'#cl_passback': clutil.opeTypeIdPerm(am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK)	// 差し戻し
					};

					// フッターナビ部（Submit）
					var naviOpeBtnAddPerm = function (permadd, opeTypeId) {
						var selector = '#mainColumnFooter .cl_submit[data-opetypeid="' + opeTypeId + '"]';
						var perm = clutil.opeTypeIdPerm(opeTypeId);
						permadd[selector] = perm;
						return permadd;
					};
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW);
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL);
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_REL);
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV);
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT);
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY);
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF);
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_DELCANCEL);
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL);
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE);
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY);
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL);
					naviOpeBtnAddPerm(permadd, am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK);
					// フッターナビ部（ダウンロード）
					permadd['#mainColumnFooter .cl_download'] = 'read';

					return permadd;
				}();
				clutil.permcntl.add(permAdd);		// 権限コントロール実装

				return this;
			},

			render: function () {
				// this.$('#header') 要素全部をここで作り直す <== CommonHeaderView.el をはめ込む。
				if (true) {
					var $hd = this.$('#header');
					var $newHd = this.commonHeader.render().$el;
					var $ca_main = this.$('#ca_main');
					if ($hd.length > 0) {
						// 既に id="header" 要素が存在する場合は共通ヘッダ要素を入れ替える
						var $wrap = $hd.wrap('<div>').parent();
						$wrap.prepend($newHd);
						$hd.unwrap().remove();
					} else if ($ca_main.length > 0) {
						// <div id="ca_main"> 要素が存在する場合は直下に共通ヘッダを入れる
						$ca_main.prepend($newHd);
					} else {
						this.$el.prepend($newHd);
					}
				}

				// タイトルのレンダリング
				if (true) {
					var $title = this.$('#title');
					var $newTitle = $(this.title_tmpl(this.options));
					if ($title.length > 0) {
						// 既に id="title" 要素が存在する場合はタイトル要素を入れ替える
						var $wrap = $title.wrap('<div>').parent();
						$wrap.prepend($newTitle);
						$title.unwrap().remove();
					} else {
						var $mainColBox = $('#mainColumninBox');
						if ($mainColBox.length === 0) {
							//							alert('処理を中断します：<div id="mainColumninBox"> 要素を入れてください。');
							//							return this;
						} else {
							$mainColBox.prepend($newTitle);
						}
					}
				}

				// 現在のページに応じて、＜前へ：次へ＞ ボタンの visible 制御する
				this.renderFooterNavi();

				// いろんなところクリア
				this.clear();

				// Body 部表示
				_.defer(function (myView) {
					if (false) {
						myView.fadeIn(myView.$el, 500, 50, function () {
							// firstStep: 初期表示時、Datepicker の表示がズレる場合があるのでリフレッシュしておく
							myView.$('.hasDatepicker').datepicker('refresh');
						}, function () {
						});
					} else {
						/* 2014-12-01
						 * Chrome バージョン 39.0.2171.71 m の更新で描画欠損が起こることが認められたため、
						 * 独自実装 fadeIn エフェクトを廃止する。
						 */
						// firstStep: 初期表示時、Datepicker の表示がズレる場合があるのでリフレッシュしておく
						myView.$('.hasDatepicker').datepicker('refresh');
						// Complete
						myView.$el.removeClass('cl_body_hidden');
					}
				}, this);

				return this;
			},

			/**
			 * body をじんわりと表示する。透過値 opacity を 0 → 1 へと変化させて実装。
			 * jQuery.fadeIn() だと display = none 状態から開始させるため、内部コンテンツの
			 * 大きさが保たれないのがダメだったので独自実装した。
			 * @param {jQuery} $el fadeIn 対象要素
			 * @param {number} term この時間かけて可視化する。単位はミリ秒。
			 * @param {number} freqTm この時間毎に opacity 値を増加させる。単位はミリ秒。
			 * @param {function} [firstStep] 初回表示ステップのときのコールバック関数。
			 * @param {function} [complete] 表示しきった後で呼び出すコールバック関数。
			 */
			fadeIn: function ($el, term, freqTm, firstStep, complete) {
				var iniOpac = $el.css('opacity');
				var style = { opacity: _.isFinite(iniOpac) ? Number(iniOpac) : 1 };
				if (style.opacity >= 1) {
					if (_.isFunction(firstStep)) {
						firstStep();
					}
					if (_.isFunction(complete)) {
						complete();
					}
					return;
				}
				var step = Math.ceil(term / freqTm), dOpac = 1 / step;
				var stTm = Date.now();
				var isWorking = true;
				var intervalID = setInterval(function () {
					var elapsedTm = Date.now() - stTm;
					style.opacity += dOpac;
					if (style.opacity >= 1 || elapsedTm >= term) {
						console.info('fadeIn: interval[#' + intervalID + '] end, elapsedTm=' + elapsedTm);
						clearInterval(intervalID);
						style.opacity = 1;
						isWorking = false;
					} else {
						//console.log('fadeIn: opacity[' + style.opacity + '], elapsedTm=' + elapsedTm);
					}
					$el.css('opacity', style.opacity);
					if (_.isFunction(firstStep)) {
						firstStep();
						firstStep = null;
					}
					if (!isWorking && _.isFunction(complete)) {
						complete();
						complete = null;
					}
				}, freqTm);
				console.info('fadeIn: interval[#' + intervalID + '] start, term[' + term + '] freqTm[' + freqTm + '] step[' + step + '] dOpac[' + dOpac + ']');
				return intervalID;
			},

			/**
			 * フッター部ナビボタンを描画（再描画）する。
			 */
			renderFooterNavi: function (opt) {
				// 現在のページに応じて、＜前へ：次へ＞ ボタンの visible 制御する
				var $mainColumnFooter = this.$('#mainColumnFooter');
				if ($mainColumnFooter.length === 0) {
					//					alert('処理を中断します：<div id="mainColumnFooter"> 要素を入れてください。');
					//					return this;
					console.warn('MDBaseView.renderFooterNavi: Element <div id="mainColumnFooter"> not found, skip!');
				} else {
					var footerLineCount = function (o) {
						var n = 0;
						if (o.btn_submit/*Submit ボタンあるよ*/) {
							n++;
						}
						if (o.pageCount > 1/*複数選択だよ*/) {
							n++;
						}
						if (o.btn_csv || o.btn_pdf || (o.btns_dl && o.btns_dl.length > 0) /*出力系ボタンあるよ*/) {
							n++;
						}
						return Math.min(n, 2);
					}(this.options);

					if (footerLineCount <= 0) {
						// フッタ部のコンテントが無いので削除
						//$mainColumnFooter.remove();
						$mainColumnFooter.empty().hide();
					} else {
						try {
							$mainColumnFooter.css('visibility', 'hidden').show();

							if (footerLineCount === 1) {
								$mainColumnFooter.addClass('noLeftColumn').removeClass('x2');
							} else {
								// ＜前へ｜次へ＞ボタンか、CSV出力ボタンがあれば、height 2行分
								$mainColumnFooter.addClass('noLeftColumn x2');
							}

							// フッタ部内部コンテントのハコモノをテンプレートから展開
							$mainColumnFooter.html(this.footernav2_tmpl(this.options));

							// Submit 系ボタンをテンプレートから展開
							var $submitbtngrp = $mainColumnFooter.find('.submit_btn_group').empty();
							var opeTypeIds = function (v) {
								var ids = [];
								//clutil.isValidOpeTypeId(num);
								if (_.isNumber(v) && clutil.isValidOpeTypeId(v)) {
									ids.push(v);
									return ids;
								}
								if (_.isArray(v)) {
									for (var i = 0; i < v.length; i++) {
										var vi = v[i];
										if (_.isNumber(vi) && clutil.isValidOpeTypeId(vi)) {
											ids.push(vi);
											continue;
										}
										if (_.isObject(vi)) {
											if (!_.isEmpty(vi.label)) {
												ids.push(vi);
												continue;
											}
											if (_.isNumber(vi.opeTypeId) && clutil.isValidOpeTypeId(vi)) {
												ids.push(vi);
												continue;
											}
										}
									}
								}
								return ids;
							}(this.options.opeTypeId);
							var opeTypeIds_n = opeTypeIds.length;
							if (opeTypeIds_n > 0) {
								for (var i = 0; i < opeTypeIds_n; i++) {
									var btn_ope = opeTypeIds[i];
									var model = null;
									if (_.isNumber(btn_ope)) {
										var label = clutil.opeTypeIdtoString(opeTypeIds[i], opeTypeIds_n);
										if (!_.isEmpty(label)) {
											model = {
												opeTypeId: opeTypeIds[i],
												label: label
											};
										}
									} else {
										model = btn_ope;
									}

									var w = (i < opeTypeIds_n - 1) ? Math.floor(100 / opeTypeIds_n) : Math.ceil(100 / opeTypeIds_n);
									model.width = w + '%';

									if (_.isEmpty(model.classNames)) {
										switch (model.opeTypeId) {
											case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
											case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
											case am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK:
												model.classNames = 'delete';
												break;
											default:
												model.classNames = 'apply';
										}
									}
									// ロス追求完了スペシャル #20151117
									if (model.classNames == 'apply' &&
										model.label == 'ロス追求完了') {
										model.classNames = 'applySpecial';
									}

									var $btn = $(this.footernav2_submitbtn_tmpl(model));//.data('cl_model', model);
									$submitbtngrp.append($btn);
									$btn.find('.cl_submit').data('cl_model', model);
								}
							} else {
								// ope 系ボタンが無い。キャンセルボタンぼっち ⇒ 幅を 100% にする。
								$submitbtngrp.remove();
								$mainColumnFooter.find('.cancel').css({ position: 'relative', width: '100%' });
							}

							// DL 系ボタンをテンプレートから展開
							var $dlbtngrp = $mainColumnFooter.find('.dl_btn_group').empty();
							var dlBtnModels = [];
							if (this.options.btn_csv) {
								var opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV;
								dlBtnModels.push({
									opeTypeId: opeTypeId,
									label: clutil.opeTypeIdtoString(opeTypeId)
								});
							}
							if (this.options.btn_pdf) {
								var opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF;
								dlBtnModels.push({
									opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF,
									label: clutil.opeTypeIdtoString(opeTypeId)
								});
							}
							if (_.isArray(this.options.btns_dl)) {
								for (var i = 0; i < this.options.btns_dl.length; i++) {
									var btn_dl = this.options.btns_dl[i];
									if (_.isNumber(btn_dl)) {
										dlBtnModels.push({
											opeTypeId: btn_dl,
											label: clutil.opeTypeIdtoString(btn_dl)
										});
									} else if (_.isObject(btn_dl)) {
										dlBtnModels.push(btn_dl);
									}
								}
							}
							for (var i = 0; i < dlBtnModels.length; i++) {
								var w = (i < dlBtnModels.length - 1) ? Math.floor(100 / dlBtnModels.length) : Math.ceil(100 / dlBtnModels.length);
								dlBtnModels[i].width = w + '%';
								var $btn = $(this.footernav2_dlbtn_tmpl(dlBtnModels[i]));//.data('cl_model', dlBtnModels[i]);
								$dlbtngrp.append($btn);
								$btn.find('.cl_download').data('cl_model', dlBtnModels[i]);
							}
						} finally {
							$mainColumnFooter.css('visibility', 'visible');
						}
					}
				}

				// 権限ネタリフレッシュ
				clutil.permcntl.refresh();

				return this;
			},

			/**
			 * クリアする - ヘッダのエラーメッセージ等をクリアする
			 * ＜オプション＞
			 * opt.setSubmitEnable	下部のSubmitボタンをblockする場合は true を指定。block解除する場合は false を指定。
			 */
			clear: function (opt) {

				// 内部のGETデータを破棄する。
				var stat = this.pagesStat[this.options.pageIndex];
				stat.status = null;
				if (opt && _.has(opt, 'setSubmitEnable')) {
					// 下部のSubmitボタンの活性/非活性状態は、基本キープ。
					// オプションで指定された場合のみ、指定状態でクリアする。
					stat.block = !opt.setSubmitEnable;
				}
				stat.comment = null,
					stat.ribbon = null;
				stat.data = null;

				// stat に応じたUI設定
				// 1) エラーメッセージ非表示 - this.validator.clearErrorHeader();
				// 2) リボンメッセージ非表示 - this.hideRibbon();
				// 3) フッター部のナビボタン非活性化 - this.setSubmitEnable(!stat.block);
				this._setConstraint(stat);

				// オプションボタンの自動 enable 設定が有効になっている場合は、すべて disanabled とする。
				if (this.options.opebtn_auto_enable) {
					this._setOpeButtonUI('*', null);
				}

				// XXX 何か、他にクリアすることとかあるか？

				return this;
			},

			/**
			 * キャンセルボタン
			 */
			_onCancelClick: function (e) {
				//clutil.mediator.trigger('onViewCtrl', 'onCancel', e);		// キャンセルボタン
				if (this.options.btn_cancel && _.isFunction(this.options.btn_cancel.action)) {
					// キャンセルボタンコールバック指定の場合
					this.options.btn_cancel.action(e);
					return;
				}
				if (this.options.confirmLeaving) {
					// 登録確認をして、元来たページへ戻る。
					this._ConfirmLeaving(clcom.popPage);
				} else {
					// 元来たページへ戻るのが基本動作のはず。
					clcom.popPage(null);
				}
			},

			// OPE 系
			// { name = 'AM_PROTO_COMMON_RTYPE_NEW',        val = 1, description = '新規登録' },
			_onNewClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_NEW)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW, this.options.pageIndex, e);
			},
			// { name = 'AM_PROTO_COMMON_RTYPE_UPD',        val = 2, description = '編集' },
			_onEditClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_UPD)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD, this.options.pageIndex, e);
			},
			// { name = 'AM_PROTO_COMMON_RTYPE_DEL',        val = 3, description = '削除' },
			_onDelClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_DEL)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL, this.options.pageIndex, e);
			},
			// { name = 'AM_PROTO_COMMON_RTYPE_REL',        val = 4, description = '参照' },
			_onCSVClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_REL)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_REL, this.options.pageIndex, e);
			},
			// { name = 'AM_PROTO_COMMON_RTYPE_CSV',        val = 5, description = 'CSV出力' },
			_onCSVClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_CSV)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV, this.options.pageIndex, e);
			},
			// { name = 'AM_PROTO_COMMON_RTYPE_CSV_INPUT',  val = 6, description = 'CSV取込' },
			_onCSVInputClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_CSV_INPUT)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT, this.options.pageIndex, e);
			},
			// { name = 'AM_PROTO_COMMON_RTYPE_COPY',       val = 7, description = '複製' },
			_onCopyClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_COPY)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY, this.options.pageIndex, e);
			},
			// { name = 'AM_PROTO_COMMON_RTYPE_PDF',        val = 8, description = 'PDF出力' },
			_onPDFClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_PDF)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF, this.options.pageIndex, e);
			},
			// { name = 'AM_PROTO_COMMON_RTYPE_DELCANCEL',  val = 9, description = '削除復活' },
			_onDelCancelClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_DELCANCEL)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_DELCANCEL, this.options.pageIndex, e);
			},
			// { name = 'AM_PROTO_COMMON_RTYPE_RSVCANCEL',  val = 10, description = '予約取消' },
			_onRsvCancelClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_RSVCANCEL)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL, this.options.pageIndex, e);
			},
			// { name = 'AM_PROTO_COMMON_RTYPE_TMPSAVE',    val = 11, description = '一時保存' },
			_onTmpSaveClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_TMPSAVE)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE, this.options.pageIndex, e);
			},
			// { name = 'AM_PROTO_COMMON_RTYPE_APPLY',      val = 12, description = '申請' },
			_onApplyClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_APPLY)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY, this.options.pageIndex, e);
			},
			// { name = 'AM_PROTO_COMMON_RTYPE_APPROVAL',   val = 13, description = '承認' },
			_onApprovalClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_APPROVAL)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL, this.options.pageIndex, e);
			},
			// { name = 'AM_PROTO_COMMON_RTYPE_PASSBACK',   val = 14, description = '差戻し' },
			_onPassbackClick: function (e) {
				console.log('trigger(onOperation, AM_PROTO_COMMON_RTYPE_PASSBACK)');
				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK, this.options.pageIndex, e);
			},

			// 画面制御系 --------------------------------------------------------------//

			// ダウンロード系ボタン
			_onFooterNavDownloadClick: function (e) {
				var $btn = $(e.currentTarget);
				var opeTypeId = parseInt($btn.data('opetypeid'));
				if (_.isNaN(opeTypeId) || opeTypeId <= 0) {
					return;
				}
				clutil.mediator.trigger('onOperation', opeTypeId, this.options.pageIndex, e);
			},

			/**
			 * アプリ用：サブミット処理発行
			 */
			doSubmit: function (opeTypeId, e) {
				this.__submitInternal(opeTypeId, e);
			},

			// Submit系ボタン
			_onFooterNavSubmitClick: function (e) {
				var $btn = $(e.currentTarget);
				var opeTypeId = parseInt($btn.data('opetypeid'));
				this.__submitInternal(opeTypeId, e);
			},

			// Submit 系 ope ボタン処理
			// Submit関数が仕込んでいる場合	＝＝＞	options.buildSubmitReqFunction			★buildSubmitReqFunction
			__submitInternal: function (opeTypeId, e) {
				if (_.isNull(opeTypeId) || _.isUndefined(opeTypeId) || _.isNaN(opeTypeId) || opeTypeId <= 0) {
					console.warn('__submitInternal: ivalid opeTypeId[' + opeTypeId + ']');
					return;
				}

				// 権限チェック内部関数
				var isBadPermFunc = function (opeTypeId) {
					if (clutil._XXXDBGGetIniPermChk === false) {
						// 権限チェックをスキップする
						return;
					}
					var pageId = clcom.pageId;
					if (_.isEmpty(pageId) || !/^AM[A-Z]{2}V[0-9]{4}$/.test(pageId)) {
						// MDの画面コード体系にマッチしていないので、権限制限外（制限を受けない）と判断する。
						return;	// OK
					}

					var pm = clcom.getPermfuncByCode(pageId);
					var permtype = clutil.opeTypeIdPerm(opeTypeId);

					if (permtype == 'write') {
						if (!_.isEmpty(pm) && (pm.f_allow_write)) {
							return;	// OK
						}
					} else if (permtype == 'del') {
						if (!_.isEmpty(pm) && (pm.f_allow_del)) {
							return;	// OK
						}
					}

					return permtype;
				};

				// 更新権限チェック追加
				var permChk = isBadPermFunc(opeTypeId);
				if (permChk == 'write') {
					this.validator.setErrorInfo({ _eb_: clmsg.is_upd_false });
					return;
				} else if (permChk == 'del') {
					this.validator.setErrorInfo({ _eb_: clmsg.is_del_false });
					return;
				}

				var pgIndex = this.options.pageIndex;
				if (_.isFunction(this.options.buildSubmitReqFunction)) {

					// ページジャンプ先のページ情報
					var stat = this.pagesStat[pgIndex];

					// リクエスト
					var req = this.options.buildSubmitReqFunction(opeTypeId, pgIndex);
					if (req === null || req === undefined) {
						// 画面先で、入力ミス等の理由でカレントページにとどまる意志と見做す。
						console.log('buildSubmitReqFunction: null, submit opeTypeId[' + opeTypeId + '] canceled.');
						return;
					}
					// 応答構造のチェック
					if (!_.isObject(req) || !_.isString(req.resId) || _.isEmpty(req.resId)) {
						// I/F が正しくない
						var m = 'buildSubmitReqFunction: ' + this.options.subtitle + ' 引数に誤りがあります。コードを見直してください。';
						console.error(m);
						alert(m);
						return;
					}

					// 共通Reqヘッダサポート
					if (true) {
						var defaultRecHead = (stat.data && stat.data.rspHead) ? {
							opeTypeId: opeTypeId,
							recno: stat.data.rspHead.recno,
							state: stat.data.rspHead.state
						} : {
							opeTypeId: opeTypeId
						};
						if (req.data.reqHead) {
							req.data.reqHead = _.defaults(req.data.reqHead, defaultRecHead);
						} else {
							req.data.reqHead = defaultRecHead;
						}

						// 強制モードは OFF
						req.data.reqHead.forceUpdFlag = 0;
					}

					if (this.config.allowUpdateByNonChangedData) {
						// 空更新チェックは行わない。
					} else {
						// 空更新チェックは行わない。
						// 空更新チェック
						// GET してきたときのデータ stat.data と同じ内容で更新しようとしていないかをチェックする。
						// 新規更新のときは、stat.submitreq は空っぽなので、この空更新チェックは通らない。
						if (opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD && !_.isEmpty(stat.submitCheckData)) {
							// XXXXV0000GetRsp
							var getRsp = _.omit(stat.submitCheckData, 'rspHead', 'rspPage');
							var getRecProp = _.keys(getRsp)[0];
							var getRec = getRsp[getRecProp];

							// XXXXV0000UpdReq
							var submitReq = _.omit(req.data, 'reqHead', 'reqPage', req.resId + 'GetReq');
							var submitRecProp = _.keys(submitReq)[0];
							var submitRec = req.data[submitRecProp];

							if (clutil.protoIsEqual(getRec, submitRec)) {
								// 空更新  -- 更新箇所が無い！
								var txt = (e && e.target) ? $(e.target).text() : clutil.opeTypeIdtoString(opeTypeId);
								clutil.MessageDialog2(txt + '変更箇所がありません。');
								return;
							}
						}
					}

					// Submit 処理関数を浮かせる。--- 確認ダイアログのコールバックにするために wrap。
					var doSubmit = _.bind(function () {
						this.__doSubmit(req, e);
					}, this);

					//確認ダイアログを出す
					var confirmMsg = null;
					if (!_.isEmpty(req.confirm)) {
						// アプリ指定の Confirm メッセージ
						confirmMsg = req.confirm.toString();
					} else {
						// デフォルトの Confirm メッセージ -- 「削除」と「予約取消」はデフォルトでメッセージを出す。
						switch (opeTypeId) {
							case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
							case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
								confirmMsg = clutil.opeTypeIdtoString(opeTypeId) + 'を行います。よろしいですか？';
						}
					}
					if (_.isEmpty(confirmMsg)) {
						// 確認メッセージが無い ⇒ すぐに submit 処理を続ける。
						doSubmit();
					} else {
						// confirm メッセージを出す。[OK]ならば、submit 処理を続行する。
						clutil.ConfirmDialog(confirmMsg, doSubmit);
					}

				} else {
					// クリックイベントを伝播させる。
					console.log('trigger(onOperation, ' + opeTypeId + ')');
					clutil.mediator.trigger('onOperation', opeTypeId, pgIndex, e);
				}
			},
			// Submit処理内部２
			__doSubmit: function (reqArg, e) {
				var pgIndex = this.options.pageIndex;
				var stat = this.pagesStat[pgIndex];

				var opeTypeId = reqArg.data.reqHead.opeTypeId;
				var forceUpdFlag = reqArg.data.reqHead.forceUpdFlag;

				// AJAX で処理を要求する
				clutil.postJSON(reqArg).done(_.bind(function (data) {
					// Submit 処理が成功
					//document.location = '#';

					// 更新完了ダイアログ表示
					if (this.options.updMessageDialog !== false) {	// false 明示しないと updMessageDialog スキップしない
						var dialogClosedFunc = undefined;
						// 「削除」と「予約取消」は処理完了後に遷移元へ戻す。
						switch (opeTypeId) {
							case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
							case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
								if (this.options.pageCount <= 1) {
									dialogClosedFunc = function () {
										// 元来たページへ戻るのが基本動作のはず。
										clcom.popPage(null);
									};
								}
						}
						// 表示時間が短い確認ダイアログ #20151117
						console.log("DEBUG: useShortDialog=" + this.options.useShortDialog);
						if (this.options.useShortDialog === true) {
							clutil.updMessageDialogShort({
								message: function (opeTypeId, e) {
									var opeLabel = null;
									if (e && e.target && !_.isEmpty(e.target.text)) {
										// ボタンラベル名
										opeLabel = e.target.text;
									} else {
										// 処理区分値からボタンラベル名を推測
										opeLabel = clutil.opeTypeIdtoString(opeTypeId, true);
									}
									return _.isEmpty(opeLabel)
										? clmsg.cl_rtype_upd_confirm	// デフォルト：「登録が完了しました。」
										: clutil.fmt(clmsg.cl_rtype_any_confirm, opeLabel);
								}(opeTypeId, e),
								okCallback: dialogClosedFunc
							});
						}
						else {
							clutil.updMessageDialog({
								message: function (opeTypeId, e) {
									var opeLabel = null;
									if (e && e.target && !_.isEmpty(e.target.text)) {
										// ボタンラベル名
										opeLabel = e.target.text;
									} else {
										// 処理区分値からボタンラベル名を推測
										opeLabel = clutil.opeTypeIdtoString(opeTypeId, true);
									}
									return _.isEmpty(opeLabel)
										? clmsg.cl_rtype_upd_confirm	// デフォルト：「登録が完了しました。」
										: clutil.fmt(clmsg.cl_rtype_any_confirm, opeLabel);
								}(opeTypeId, e),
								okCallback: dialogClosedFunc
							});
						}
					}

					// 確定済 - ブロックする。
					stat.status = 'DONE';
					stat.block = true,					// 登録ボタンを読み取り専用にする
						stat.comment = null;
					stat.ribbon = clutil.opeTypeIdtoString(opeTypeId, true) + '済';
					stat.data = clutil.dclone(data);	// Deep コピーを取ってキャッシュ
					this._setConstraint(stat);

					console.log('trigger(onMDSubmitCompleted, {status: ' + stat.status + ', index: ' + pgIndex + ', resId: ' + reqArg.resId + '})');
					clutil.mediator.trigger('onMDSubmitCompleted', { status: stat.status, index: pgIndex, resId: reqArg.resId, opeTypeId: opeTypeId, data: data, forceUpdFlag: forceUpdFlag, req: reqArg.data }, e);
				}, this)).fail(_.bind(function (data) {
					// 処理が失敗
					var stat_cd = 'NG';
					if (data && data.rspHead) {
						switch (data.rspHead.message) {
							case 'cl_sys_db_other':			// 別のユーザによってＤＢが更新されました。
								stat_cd = 'CONFLICT';
								data_pub = data;
								stat.status = stat_cd;
								stat.block = true;
								stat.comment = data.rspHead,
									stat.ribbon = null;
								stat.data = clutil.dclone(data);	// ★最新データが応答に入ってくるはず！
								this._setConstraint(stat);
								break;
							case 'ca_bad_dbdelete':		// データが既に削除されています。
								stat_cd = 'DELETED';
								data_pub = data;		// 削除済の場合、何が入っているのか？？？
								stat.status = stat_cd;
								stat.block = true;
								stat.comment = data.rspHead,
									stat.ribbon = null;
								//stat.data = clutil.dclone(data);	// キャッシュを維持？ -- これから復元すると、ユーザ入力編集入力前の状態になる。
								this._setConstraint(stat);
								break;
							case 'EMS0164':
							case 'EMS0165':
								this._onTicker(clmsg.cl_echoback);
								break;
							default:
							case 'cl_sys_error':		// システムエラーが発生しました。
							case 'cl_sys_nomem':		// メモリ確保に失敗しました。
							case 'cl_sys_db_error':		// システムエラー：データベースアクセスに失敗しました。
							case 'cl_sys_db_access':	// システムエラー：データベースアクセスに失敗しました。
								this._onTicker(data);
						}
					} else {
						// 致命的なエラーとか・・・
						this._onTicker(data);
					}
					console.log('trigger(onMDSubmitCompleted, {status: ' + stat_cd + ', index: ' + pgIndex + ', resId: ' + reqArg.resId + ', opeTypeId:' + opeTypeId + '})');
					clutil.mediator.trigger('onMDSubmitCompleted', { status: stat_cd, index: pgIndex, resId: reqArg.resId, opeTypeId: opeTypeId, data: data, forceUpdFlag: false, req: reqArg.data }, e);
				}, this));
			},

			__doSubmit2: function (reqArg, e) {
				// AJAX で処理を要求する
				clutil.postJSON(reqArg).then(function (data) {
					var hd = data.rspHead;
					if (!_.isEmpty(hd.message)) {
						clutil.mediator.trigger('onTicker', hd);
						//data.rspHead.message = null;	// fail で再表示しないように、null にしておく。
					}
					if (hd.uri) {
						// DLファイルが指定された ⇒ DLメソッドを呼び出す。
						// PDF ファイルを指定されるなど、別窓でDLをやらせるケースってあるの？
						clutil.download({ url: hd.uri });
					} else {
						return this;
					}
				}).done(function (data) {
					if (!clutil.saveFileUploadView.saveOpt.noDialogOnDone) {
						clutil.MessageDialog2('取込が完了しました。');				// FIXME: height を抑えたダイアログで
					}
					clutil.saveFileUploadView.trigger('done', data);
				}).fail(function (data) {
					console.warn(reqArg.resId + ': failed.', data);
					clutil.mediator.trigger('onTicker', data);
					clutil.saveFileUploadView.trigger('fail', data);
				});
			},

			/**
			 * 代表の処理区分値を類推して返す。
			 * ［一時保存］＆［登録］のように、２系統ある場合は、先頭の処理区分値を返す。
			 *
			 * @method
			 * @for clutil.View.MDBaseView
			 * @param {any} [opeTypeId] 処理区分値。省略可。省略時は本インスタンスの options.opeTypeId を検査する。
			 * @param {int} [defaultOpeType] 適切な処理区分値が見つからなかった場合のデフォルト値。
			 * @return {int} 処理区分値
			 */
			getRepresentOpeTypeId: function (opeTypeId, defaultOpeType) {
				if (opeTypeId == null) {
					opeTypeId = this.options.opeTypeId;
				}
				var anyType = opeTypeId;
				if (_.isArray(anyType) && anyType.length >= 1) {
					anyType = anyType[0];
				}
				if (_.isObject(anyType) && _.has(anyType, 'opeTypeId')) {
					anyType = anyType.opeTypeId;
				}
				if (_.isFinite(anyType)) {
					anyType = parseInt(anyType);
					if (!clutil.isValidOpeTypeId(anyType)) {
						anyType = defaultOpeType;
					}
				} else {
					anyType = defaultOpeType;
				}
				return anyType;
			},

			/**
			 * 強制モードの Submit 処理を実行する。
			 * @method
			 * @for clutil.View.MDBaseView
			 * @param {object} reqArgs
			 * @param {integer} reqArgs.resId 処理区分値
			 * @param {object} reqArgs.data リクエストデータ
			 * @param {string} [reqArgs.confirm] 確認ダイアログメッセージ。
			 * @param {function} [reqArgs.cancel] 確認ダイアログのキャンセルコールバック
			 */
			forceSubmit: function (reqArgs) {
				// 強制モードの Submit 処理の Ajax 呼び出し部
				var doForceSubmit = _.bind(function () {
					// 強制更新フラグ = ON
					reqArgs.data.reqHead.forceUpdFlag = 1;
					this.__doSubmit(reqArgs);
				}, this);

				// 確認ダイアログメッセージをつくる。
				var confirmMsgs = [];
				if (!_.isEmpty(reqArgs.confirm)) {
					// アプリ指定の Confirm メッセージ
					if (_.isArray(reqArgs.confirm)) {
						for (var i = 0; i < reqArgs.confirm.length; i++) {
							confirmMsgs.push(reqArgs.confirm[i].toString());
						}
					} else {
						confirmMsgs.push(reqArgs.confirm.toString());
					}
				}
				confirmMsgs.push(clutil.opeTypeIdtoString(reqArgs.data.reqHead.opeTypeId) + 'を強制実行します。よろしいですか？');

				// confirm メッセージを出す。[OK]ならば、submit 処理を続行する。
				clutil.ConfirmDialog(confirmMsgs.join('<br />'), doForceSubmit, reqArgs.cancel);
			},

			forceUpload: function (reqArgs) {
				// 強制モードの Submit 処理の Ajax 呼び出し部
				var doForceSubmit = _.bind(function () {
					// 強制更新フラグ = ON
					reqArgs.data.reqHead.forceUpdFlag = 1;
					this.__doSubmit2(reqArgs);
				}, this);

				// 確認ダイアログメッセージをつくる。
				var confirmMsgs = [];
				if (!_.isEmpty(reqArgs.confirm)) {
					// アプリ指定の Confirm メッセージ
					if (_.isArray(reqArgs.confirm)) {
						for (var i = 0; i < reqArgs.confirm.length; i++) {
							confirmMsgs.push(reqArgs.confirm[i].toString());
						}
					} else {
						confirmMsgs.push(reqArgs.confirm.toString());
					}
				}
				if (reqArgs.notDispCommonMessageFlag != true) {
					confirmMsgs.push(clutil.opeTypeIdtoString(reqArgs.data.reqHead.opeTypeId) + 'を強制実行します。よろしいですか？');
				}

				// confirm メッセージを出す。[OK]ならば、submit 処理を続行する。
				clutil.ConfirmDialog(confirmMsgs.join('<br />'), doForceSubmit, reqArgs.cancel);
			},

			// 戻るボタン
			_onPrevClick: function (e) {
				var fromIndex = this.options.pageIndex;
				var toIndex = this.options.pageIndex - 1;
				var pgCount = this.options.pageCount;

				if (this.options.confirmLeaving) {
					if (pgCount <= 0 /*新規作成はデータが無い*/ || toIndex < 0 || toIndex >= Math.max(pgCount, 1)) {
						// ボタン表示を fadeIn/fadeOut で表示コントロールすると滑ってイベントを拾うことがある。オーバーランは無視で。
						return;
					}
					this._ConfirmLeaving(this.__getInternal, fromIndex, toIndex, pgCount, e);
				} else {
					this.__getInternal(fromIndex, toIndex, pgCount, e);
				}
			},
			// 次へボタン
			_onNextClick: function (e) {
				var fromIndex = this.options.pageIndex;
				var toIndex = this.options.pageIndex + 1;
				var pgCount = this.options.pageCount;

				if (this.options.confirmLeaving) {
					if (pgCount <= 0 /*新規作成はデータが無い*/ || toIndex < 0 || toIndex >= Math.max(pgCount, 1)) {
						// ボタン表示を fadeIn/fadeOut で表示コントロールすると滑ってイベントを拾うことがある。オーバーランは無視で。
						return;
					}
					this._ConfirmLeaving(this.__getInternal, fromIndex, toIndex, pgCount, e);
				} else {
					this.__getInternal(fromIndex, toIndex, pgCount, e);
				}
			},
			// ページを離れる前に「登録が完了していません。このまま移動しますか？」確認する。
			_ConfirmLeaving: function (action, args) {
				var confirm = false;
				var pgIndex = this.options.pageIndex;
				do {
					var stat = this.pagesStat[pgIndex];
					if (stat.block) {
						// Submit 系処理ボタンがブロックされている。
						break;
					}
					confirm = true;
				} while (false);

				if (_.isFunction(action)) {
					var context = this;
					var actionArgs = _.map(arguments, function (a) { return a; });
					actionArgs.shift();
					if (this._isConfirmLeaving(confirm, pgIndex) === true) {
						// ページ遷移の確認ダイアログを表示する！！！
						var msg = function (myMdView) {
							var label = myMdView.options.subtitle;
							if (_.isEmpty(label)) {
								var ope = myMdView.getRepresentOpeTypeId(myMdView.options.opeTypeId);
								label = ope ? clutil.opeTypeIdtoString(ope) : '登録';
							}
							return label + 'が完了していません。このまま移動しますか？';
						}(this);
						var okcallback = function () {
							action.apply(context, actionArgs);
						};
						clutil.ConfirmDialog(msg, okcallback);
					} else {
						// 即アクション実行
						action.apply(context, actionArgs);
					}
				}
				return confirm;
			},
			/**
			 * ページを離れる前に「登録が完了していません。このまま移動しますか？」確認ダイアログを
			 * 表示するかどうかの判定をする。true を返す場合は確認ダイアログを表示する。
			 * アプリケーション側から確認ダイアログ表示/非表示判断を行う場合は、options.isConfirmLeaving プロパティで指定する。
			 *
			 * options.isConfirmLeaving 使用例
			 *
			 * (1) Boolean で指定する場合
			 * new clutil.View.MDBaseView({
			 *     ...省略...
			 *     isConfirmLeaving: true
			 * });
			 *
			 * (2) Function で指定する場合
			 * new clutil.View.MDBaseView({
			 *     ...省略...
			 *     isConfirmLeaving: function(isSubmitBlocking, pgIndex){
			 *         // 引数 isSubmitBlocking は、現在の Submit 処理がtrue:できる/false:できない状態を示す。
			 *         // 引数 pgIndex は、一覧画面で編集対象を複数選択した場合の、現在表示しているコンテントのインデックスを表す。
			 *         // 明示的に true を返した場合のみ、確認ダイアログは表示される。
			 *         return true;
			 *     }
			 * });
			 *
			 * @method
			 * @for clutil.View.MDBaseView
			 * @param {boolean} isSubmitBlocking true:現在表示しているコンテントは Submit 処理可能。false:Submit処理不可。
			 * @param {number} pgIndex 一覧で編集対象を複数選択した場合、現在表示しているコンテントのインデックスを表す。
			 * @return true:確認ダイアログは表示される。other:このまま移動する。
			 */
			_isConfirmLeaving: function (isSubmitBlocking, pgIndex) {
				var appFunc = this.options.isConfirmLeaving;
				if (_.isFunction(appFunc)) {
					return appFunc(isSubmitBlocking, pgIndex);
				} else if (_.isBoolean(appFunc)) {
					return appFunc;
				}
				return isSubmitBlocking;
			},
			//			// 更新データが編集中かどうか判定して、処理の続行を問う。
			//			_ConfirmLeaving: function(action, args){
			//				// XXX 処理区分が明確じゃない ⇒ デフォルトは AM_PROTO_COMMON_RTYPE_UPD 固定としておく？？？
			//				var opeTypeId = this.getRepresentOpeTypeId(this.options.opeTypeId, am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
			//				var isDirty = false;
			//
			//				do{
			//					var pgIndex = this.options.pageIndex;
			//					var stat = this.pagesStat[pgIndex];
			//					if(stat.block){
			//						// Submit 系処理ボタンがブロックされている。
			//						break;
			//					}
			//					// XXX 新規作成の場合は必ず Confirm を通す？？？
			//					if(opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW || opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
			//						isDirty = true;
			//						break;
			//					}
			//
			//					if(stat.submitCheckData == null){
			//						// 比較用データ（初期GETしてきたデータ）が無いのでスキップ
			//						break;
			//					}
			//					if(!_.isFunction(this.options.buildSubmitReqFunction)){
			//						// Submit 系リクエストデータ作成方法を知らないのでスキップ。（アプリでチェックをやってね）
			//						break;
			//					}
			//					var req = this.options.buildSubmitReqFunction(opeTypeId, pgIndex);
			//					if(req == null){
			//						// 入力エラー等で submit 処理できないことを検出。
			//						// 即ち、入力途中であると判断し、確認ダイアログルートに乗せる。
			//						isDirty = true;
			//						break;
			//					}
			//					// 応答構造のチェック
			//					if(!_.isObject(req) || !_.isString(req.resId) || _.isEmpty(req.resId)){
			//						// I/F が正しくない - アプリのバグ！！！
			//						var m = 'buildSubmitReqFunction: ' + this.options.subtitle + ' 引数に誤りがあります。コードを見直してください。';
			//						console.error(m);
			//						alert(m);			// バグ修正を喚起する
			//						return;
			//					}
			//
			//					// 以下、Get データと画面データとの比較
			//					// XXXXV0000GetRsp
			//					var getRsp     = _.omit(stat.submitCheckData, 'rspHead', 'rspPage');
			//					var getRecProp = _.keys(getRsp)[0];
			//					var getRec     = getRsp[getRecProp];
			//
			//					// XXXXV0000UpdReq
			//					var submitReq     = _.omit(req.data, 'reqHead', 'reqPage', req.resId + 'GetReq');
			//					var submitRecProp = _.keys(submitReq)[0];
			//					var submitRec     = req.data[submitRecProp];
			//
			//					isDirty = !clutil.protoIsEqual(getRec, submitRec);
			//				}while(false);
			//
			//				if(_.isFunction(action)){
			//					var context = this;
			//					var actionArgs = _.map(arguments,function(a){return a;});
			//					actionArgs.shift();
			//					if(isDirty){
			//						// ページ遷移の確認ダイアログを表示する！！！
			//						var msg = function(opeTypeId){
			//							switch(opeTypeId){
			//							case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			//							case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
			//								return '登録が完了していません。このまま移動しますか？';
			//							}
			//							return '編集が完了していません。このまま移動しますか？';
			//						}(opeTypeId);
			//						var okcallback = function(){
			//							action.apply(context, actionArgs);
			//						};
			//						clutil.ConfirmDialog(msg, okcallback);
			//					}else{
			//						// 編集途中じゃない ⇒ 即アクション実行
			//						action.apply(context, actionArgs);
			//					}
			//				}
			//				return isDirty;
			//			},

			// スクロール位置補正
			// カレントのフォーカス保持要素がフッタナビ部のボタンと被らないように、body のスクロール位置を調整する。
			_onFocusForScrollAdjust: function (e) {
				var $mainColumnFooter = this.$('#mainColumnFooter');
				if ($mainColumnFooter.length <= 0 || !$mainColumnFooter.is(':visible')) {
					// フッターナビ部無い OR 非表示 ⇒ input はFooterに隠れないので補正不要
					return;
				}
				var mainColumnFooterOff = $mainColumnFooter.offset();

				var $tgt = $(e.currentTarget);
				if ($tgt.is('div')) {
					// コンテナ系な要素は省略。ひとまず <div> 要素だけで判定。FIXME
					return;
				}
				if ($tgt.hasClass('cl_valid_blur_off')) {
					// 経験則的に・・・
					console.log('_onFocusForScrollAdjust: cl_valid_blur_off, skip.');
					return;
				}
				var off = $tgt.offset();

				console.log('_onFocusForScrollAdjust: ', e, $tgt);

				var bottomY = off.top + $tgt.outerHeight();
				if (bottomY >= mainColumnFooterOff.top) {
					// 入力部品がフッターナビ部と被っている: position 補正
					var scrollTop = this.$el.scrollTop();
					//					var y = scrollTop + Math.floor($(window).outerHeight() / 2);
					var y = scrollTop + $mainColumnFooter.outerHeight();

					// グリッド内部の input は、表頭表示位置を優先。
					var $dataGrid = $tgt.closest('.cl_datagrid');
					if ($dataGrid.length > 0) {
						// データグリッド内部のエディタ: なるべく表頭部のTOPを基準位置とする。
						var gridy = $dataGrid.offset().top - 24/*[24]適度なマージン*/;
						var dy = gridy - scrollTop;
						if (bottomY < mainColumnFooterOff.top + dy) {
							// エディタがフッターナビ部下に埋没しない
							y = gridy;
						}
					}

					// スクロール調整する契機がグリッド内部エディタから発したことを通知するイベント
					clutil.mediator.trigger('mdbaseview:onscrolladjusting', $tgt);

					this.$el.scrollTo(y);
				}
			},

			// バリデーションエラーのクリア
			_onFocusClValidate: function (e) {
				if (!this.options.auto_cl_validate) {
					return;
				}
				this.validator.clear($(e.currentTarget));
			},
			// バリデーションチェック（focusout イベント経由）
			_onBlurClValidate: function (e) {
				var $elem = $(e.currentTarget);
				if ($elem.is('[data-limit],[data-filter]')) {
					// inputlimiter
					return;
				}
				this._onBlurClValidateImpl($elem, 'focusout');
			},
			// バリデーションチェック（要素指定）
			_onBlurClValidateImpl: function ($elem, evType) {
				console.log('#AutoValid... evType:', evType);
				if (!this.options.auto_cl_validate) {
					return;
				}
				if ($elem.hasClass('cl_valid_auto_off')) {
					return;
				}
				if ($elem.hasClass('cl_valid_blur_off') && evType === 'focusout') {
					return;
				}
				if ($elem.hasClass('select') || $elem.hasClass('bootstrap-select')) {
					// selectpicker のボタンelementから発信したイベント
					$elem = $elem.prev();
					if (!$elem.is('select')) {
						return;
					}
				}
				this.validator.valid({ $el: $elem });
				console.log('#AutoValid called valid()... evType:', evType);
			},

			// ページ遷移時のデータ取得
			__getInternal: function (fromIndex, toIndex, pgCount, e) {
				if (pgCount <= 0 /*新規作成はデータが無い*/ || toIndex < 0 || toIndex >= Math.max(pgCount, 1)) {
					// ボタン表示を fadeIn/fadeOut で表示コントロールすると滑ってイベントを拾うことがある。オーバーランは無視で。
					return;
				}

				// ＜前へ｜次へ＞ 制御：ページの端っこにきたら、それ以上進めないように防御する
				var prevnextCtrl = function (mdView) {
					var pgCount = mdView.options.pageCount;
					if (toIndex > fromIndex) {
						// 次へ
						if (fromIndex === 0) {
							mdView.$('#cl_prev').fadeIn();
						}
						if (toIndex >= pgCount - 1) {
							mdView.$('#cl_next').fadeOut();
						}
					} else if (toIndex < fromIndex) {
						// 前へ
						if (toIndex === 0) {
							mdView.$('#cl_prev').fadeOut();
						}
						if (fromIndex === pgCount - 1) {
							mdView.$('#cl_next').fadeIn();
						}
					} else {
						if (toIndex === 0) {
							mdView.$('#cl_prev').hide();
							mdView.$('#cl_next').show();
						} else if (toIndex >= pgCount - 1) {
							mdView.$('#cl_prev').show();
							mdView.$('#cl_next').hide();
						} else {
							mdView.$('#cl_prev').show();
							mdView.$('#cl_next').show();
						}
					}
					// ラベル #cl_step
					mdView.$('#cl_step').text((toIndex + 1) + '/' + pgCount);

					// ページインデックス値入れ替え
					mdView.options.pageIndex = toIndex;
				};

				// GET関数が仕込んでいる場合	＝＝＞	options.buildGetReqFunction			★buildGetReqFunction
				if (_.isFunction(this.options.buildGetReqFunction)) {

					// ページジャンプ先のページ情報
					var stat = this.pagesStat[toIndex];

					// 削除済 or 削除済エラーが起きていないかチェック
					switch (stat.status) {
						case 'DONE':
							// Submit 処理が完了し、かつ、処理区分が削除 or 予約削除の場合 ⇒ 再検索無しでキャッシュ内容を返す。
							// 他の処理区分の場合は、他者に更新されていないかどうかを再検索してチェックする。
							if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
								|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL) {
								// ＜前へ｜次へ＞ ボタンの制御
								prevnextCtrl(this);
								// 削除系オペレーションが自身で完了済 ⇒ 再検索無しで、キャッシュ内容を返す。
								console.log('trigger(onMDGetCompleted, {status: ' + stat.status + ', fromIndex: ' + fromIndex + ', index: ' + toIndex + ', resId: ' + req.resId + '})');
								clutil.mediator.trigger('onMDGetCompleted', { status: stat.status, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: clutil.dclone(data) }, e);
								return;
							}
							// 更に他ユーザによる更新が無いかどうかチェックするために再検索する。
							break;
						case 'DELETED':		// 他者が削除済の場合
							// 再検索しても無駄なので、キャッシュ内容を返す。キャッシュが無い場合もありうるので、アプリ実装は要注意！
							// ＜前へ｜次へ＞ ボタンの制御
							prevnextCtrl(this);
							// 他者が削除済 ⇒ 再検索無しで、キャッシュ内容を返す。
							console.log('trigger(onMDGetCompleted, {status: ' + stat.status + ', fromIndex: ' + fromIndex + ', index: ' + toIndex + ', resId: ' + req.resId + '})');
							clutil.mediator.trigger('onMDGetCompleted', { status: stat.status, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: clutil.dclone(data) }, e);
							return;
					}

					// 再検索実行
					var req = this.options.buildGetReqFunction(this.options.opeTypeId, toIndex);
					if (req === null || req === undefined) {
						// 画面先で、入力ミス等の理由でカレントページに留まる意志と見做す。
						console.log('buildGetReqFunction: null, page[' + fromIndex + '->' + toIndex + '] change canceled.');
						return;
					}
					if (!_.isObject(req) || !_.isString(req.resId) || _.isEmpty(req.resId)) {
						// I/F が正しくないよ！
						var m = 'buildGetReqFunction: GET 引数に誤りがあります。コードを見直してください。';
						console.error(m);
						alert(m);
						return;
					}

					// AJAX データを取得
					clutil.postJSON(req).always(_.bind(function (data) {
						// [ALWAYS]	＜前へ|次へ＞ ボタンのコントロール
						prevnextCtrl(this);
					}, this)).done(_.bind(function (data) {
						// 処理が成功
						//document.location = '#';
						// [DONE]	ＧＥＴ処理がＯＫで完了
						var diff = false;
						if (stat.data) {
							// 比較する
							// 共通ヘッダの recno, status を、新旧で比較する。
							var old = _.pick(stat.data.rspHead, 'recno', 'state');
							var cur = _.pick(data.rspHead, 'recno', 'state');
							diff = _.isEqual(old, cur);
							if (!diff) {
								// 他人に更新されています。で、Submit ブロックする。
								//stat.data = data;
								stat.status = 'CONFLICT';
								stat.block = true,
									stat.comment = clmsg.cl_sys_db_other;
								stat.ribbon = null;
								stat.data = clutil.dclone(data);	// Deep コピーを取ってキャッシュ
							} else {
								// データが合致
								// 原則、元々の状態を保持する。
								// 元々が 'NG' だった場合は、'OK' に復帰させておく。いいのか？
								if (stat.status == 'NG') {
									stat.status = 'OK';
									stat.block = false;
									stat.comment = null,
										stat.ribbon = null;
								}
							}
						} else {
							// はじめてのデータ取得。
							// ブロッキングされている場合は解除
							stat.status = 'OK';
							stat.block = false;
							stat.comment = null,
								stat.ribbon = null;
							stat.data = clutil.dclone(data);			// Deep コピーを取ってキャッシュ

							// 空更新チェック用データをつくる。
							// アプリ側の buildSubmitCheckDataFunction(data) にチェック不要項目を delete してもらう。
							if (_.isFunction(this.options.buildSubmitCheckDataFunction)) {
								stat.submitCheckData = this.options.buildSubmitCheckDataFunction({
									index: toIndex,				// 複数レコード選択編集時におけるインデックス番号
									resId: req.resId,			// リソースId -- "XXXXV0010" など
									data: clutil.dclone(data)	// GETの応答データ（共通ヘッダも含む）
								});
							} else {
								stat.submitCheckData = stat.data;
							}
						}

						// ボタン非活性とか、登録済リボン表示とか、制約情報を表示する
						this._setConstraint(stat);

						// onMDGetSuccess イベントで結果を戻すので、View への値セットをお願い。
						console.log('trigger(onMDGetCompleted, {status: ' + stat.status + ', fromIndex: ' + fromIndex + ', index: ' + toIndex + ', resId: ' + req.resId + '})');
						clutil.mediator.trigger('onMDGetCompleted', { status: stat.status, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data }, e);
					}, this)).fail(_.bind(function (data) {
						// [FAIL] ＧＥＴ処理が失敗
						// キャッシュデータ stat.data は維持する
						var stat_cd = 'NG';
						if (data && data.rspHead) {
							switch (data.rspHead.message) {
								case 'cl_sys_db_other':		// 別のユーザによってＤＢが更新されました。
								case 'ca_bad_dbdelete':		// データが既に削除されています。
									stat_cd = 'DELETED';
									stat.status = stat_cd;
									stat.block = true;
									stat.comment = data.rspHead,
										stat.ribbon = null;
									break;
								case 'cl_sys_error':		// システムエラーが発生しました。
								case 'cl_sys_nomem':		// メモリ確保に失敗しました。
								case 'cl_sys_db_error':		// システムエラー：データベースアクセスに失敗しました。
								case 'cl_sys_db_access':	// システムエラー：データベースアクセスに失敗しました。
								//stat_cd = 'FATAL';
								// fall throgh
								default:
									// その他のエラー
									//stat_cd = 'NG';
									stat.status = stat_cd;
									stat.block = true;
									stat.comment = data.rspHead;
									stat.ribbon = null;
							}
						} else {
							// 致命的なエラーとか・・・GETでコケると何も操作できないので、Sbumit ボタンをブロックする。
							//stat_cd = 'FATAL';
							stat.status = stat_cd;
							stat.block = true;
							stat.comment = clmsg.cl_sys_error;	//data.rspHead,
							stat.ribbon = null;
						}
						// ボタン非活性とか、登録済リボン表示とか、制約情報を表示する
						this._setConstraint(stat);

						console.log('trigger(onMDGetCompleted, {status: ' + stat_cd + ', index: ' + toIndex + ', resId: ' + req.resId + '})');
						clutil.mediator.trigger('onMDGetCompleted', { status: stat_cd, index: toIndex, resId: req.resId, data: data }, e);
					}, this));
				} else {
					if (!e) {
						// ＜前へ｜次へ＞ ボタンクリック
						// ページ遷移情報を戻すだけ。
						prevnextCtrl(this);
						//						console.log('trigger(onViewCtrl, onItemChanged, {fromIndex: ' + fromIndex + ', index: ' + toIndex + '}');
						clutil.mediator.trigger('onSelectedItemChanged', { fromIndex: fromIndex, index: toIndex }, e);
					}
				}
			},

			/**
			 * 共通ヘッダの通知エリアにエラーメッセージを表示する
			 */
			_onTicker: function (anyArg) {
				// エラーメッセージをセット
				var msg = null;
				if (_.isEmpty(anyArg)) {
					;
				} else if (_.isString(anyArg)) {
					// 文字列型の場合
					msg = anyArg;
				} else if (anyArg._eb_) {
					// validator.setErrorInfo の引数の場合
					msg = anyArg._eb_;
				} else if (anyArg.status && anyArg.message) {
					// 共通ヘッダそのものの場合
					msg = clutil.fmtargs(clutil.getclmsg(anyArg.message), anyArg.args);
				} else if (anyArg.rspHead && anyArg.rspHead.message) {
					// 共通ヘッダを包括したオブジェクトの場合
					msg = clutil.fmtargs(clutil.getclmsg(anyArg.rspHead.message), anyArg.rspHead.args);
				} else {
					msg = '???';
				}
				if (_.isEmpty(anyArg)) {
					this.validator.clearErrorHeader();
				} else {
					this.validator.setErrorHeader(msg);
				}
			},

			/**
			 * ope ボタンのＵＩ制御
			 */
			_setOpeButtonUI: function (groupid, arg, from) {
				var opeDate = clcom.getOpeDate();
				var selectedRecs = (arg && _.isArray(arg.selectedRecs)) ? arg.selectedRecs : [];

				var hasHistory = false;
				if (from && _.isFunction(from.hasHistory)) {
					hasHistory = from.hasHistory();
				}

				// 履歴条件への考慮
				var ope1SelectedRecs = selectedRecs;	// 1種：編集、削除ができる要素
				var ope2SelectedRecs = selectedRecs;	// 2種：予約取消ができる要素
				if (hasHistory) {
					ope1SelectedRecs = _.filter(arg.selectedRecs, function (dto) {
						return dto.toDate >= clcom.max_date;
					});
					ope2SelectedRecs = _.filter(arg.selectedRecs, function (dto) {
						return dto.fromDate > opeDate && dto.toDate >= clcom.max_date;
					});
				}

				// デフォルトの活性/非活性判定関数
				var defaultIsEnabled = function (args) {
					if (args.selectedCount <= 0) {
						// 選択されていない。
						return false;
					} else if (args.selectedCount == 1) {
						// 1個選択
						if (args.hasHistory) {
							switch (args.btnOpeTypeId) {
								case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
								case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
									if (args.selectedCount - ope1SelectedRecs.length > 0) {
										// ＜履歴条件1種＞
										// 履歴適用外のものが含まれている
										return false;
									}
									break;
								case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約削除
									if (args.selectedCount - ope2SelectedRecs.length > 0) {
										// ＜履歴条件2種＞
										// 履歴適用外のものが含まれている
										return false;
									}
									break;
							}
						}
					} else {
						// 複数行選択
						if (args.selectionPolicy == 'single') {
							return false;
						}
						if (args.hasHistory
							&& args.btnOpeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
							&& (args.selectedCount - ope1SelectedRecs.length) > 0) {
							// 履歴適用外のものが含まれている
							return false;
						}
					}
					return true;
				};
				var opeBtnIsEnabled = _.isFunction(this.options.opebtn_auto_enable)
					? this.options.opebtn_auto_enable : defaultIsEnabled;

				var pmctlSwitcher = clutil.permcntl.getReadonlySwitcher();

				$('.cl_opebtngroup').each(function () {
					var $pdiv = $(this);
					var gid = $pdiv.data('cl_groupid');

					if (_.isEmpty(gid) || gid == '*' || _.isEmpty(groupid) || groupid == '*' || gid == groupid) {
						// ボタン個々に enabled(true/false) セットする、for-each() ループ
						$pdiv.find('.btn').each(function () {
							var $btn = $(this);
							var btnOpeTypeId = clutil.btnOpeTypeId($btn);
							var selectionPolicy = null;
							switch (btnOpeTypeId) {
								case -1:	// 処理区分不定
									if ($btn.hasClass('cl_selectui_multi')) {
										selectionPolicy = 'multi';
									} else if ($btn.hasClass('cl_selectui_single')) {
										selectionPolicy = 'single';
									} else {
										// 不定 -- コントロール下にないボタンなので SKIP する。
										return;
									}
									break;
								case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
									selectionPolicy = 'multi';
									break;
								default:
									selectionPolicy = 'single';
							}
							var args = {
								$btn: $btn,
								selectedRows: selectedRecs,
								selectedCount: selectedRecs.length,
								btnOpeTypeId: btnOpeTypeId,
								selectionPolicy: selectionPolicy,
								hasHistory: hasHistory,
								opeDate: opeDate
							};

							if (!false/* FIXME 権限コントロール実装＝ＯＦＦ中 */) {
								if (opeBtnIsEnabled(args)) {
									// 活性化
									pmctlSwitcher.turnOff($btn);
								} else {
									// 非活性化
									pmctlSwitcher.turnOn($btn);
								}
							} else {
								if (opeBtnIsEnabled(args)) {
									// 活性化
									$btn.removeAttr('disabled');
								} else {
									// 非活性化
									$btn.attr('disabled', true);
								}
							}
						});
					}
				});
			},

			/**
			 * リフレッシュ
			 * blocking = true を指定すると、以後、登録/削除系ボタンは使用不可にする。
			 * reason を指定すると、ヘッダメッセージを表示する。
			 */
			_setConstraint: function () {
				var stat = arguments[0];
				if (!stat) {
					stat = this.pagesStat[this.options.pageIndex];
				}

				// Submit ボタンの活性/非活性
				this.setSubmitEnable(!stat.block);

				// 上部のエラーメッセージエリアに表示するテキストをセット
				this._onTicker(stat.comment);

				// リボンエリアに表示するテキストをセット
				if (stat.ribbon) {
					this.showRibbon(stat.ribbon);
				} else {
					this.hideRibbon();
				}
			},

			/**
			 * 現在選択中アイテムのインデックスを取得する。
			 */
			getSelectedItemIndex: function () {
				return this.options.pageIndex;
			},

			/**
			 * 「登録」/「削除」ボタンの活性/非活性を設定する
			 * 【注意】出力ボタンにも活性化/非活性化が設定されます。
			 * @param {boolean} enable true:活性化、false:非活性化
			 * @param {object} [filterOpt] setEnable 操作を適用する要素フィルタ
			 */
			setSubmitEnable: function (enable, filterOpt) {
				var stat = this.pagesStat[this.options.pageIndex];
				stat.block = !enable;

				if (true/* 権限コントロール実装＝ＯＮ */) {
					var $footer = this.$('#mainColumnFooter');
					var switcher = clutil.permcntl.getReadonlySwitcher();
					try {
						var $w = $footer.wrap('<div></div>').parent();
						if (enable) {
							switcher.turnOffAll($w, filterOpt);
						} else {
							switcher.turnOnAll($w, filterOpt);
						}
					} finally {
						$footer.unwrap();
					}
				} else {
					// 権限実装＝ＯＦＦ
					var $btns = this.$('#mainColumnFooter .cl_submit');
					if (enable) {
						$btns.removeAttr('disabled').parent().removeClass('disable');
					} else {
						$btns.attr('disabled', 'disabled').parent().addClass('disable');
					}
				}
			},

			/**
			 * 下部フッターナビボタンの活性化/非活性化を設定する
			 * @param {boolean} enable true:活性化、false:非活性化
			 * @param {string} [side] "submit":オペボタンに適用、"download":出力ボタンに適用、指定ナシ:両方に適用
			 */
			setFooterNaviEnable: function (enable, side) {
				var filterOpt = null;
				switch (side) {
					case 'submit':
						filterOpt = { filter: '.cl_' + side }; break;
					case 'download':
						filterOpt = { filter: '.cl_' + side }; break;
				}
				this.setSubmitEnable(enable, filterOpt);
			},

			/**
			 * 字幕リボンを表示する。
			 */
			showRibbon: function (text) {
				// 確定済ラベルとか・・・ ==> $('#title').after(!ココに差し込む!)
				//ribbonBox_tmpl: _.template('<div class="ribbonBox primary dispn"><%- text %></div>'),
				if (this.$ribbon) {
					this.$ribbon.text(_.escape(text));
				} else {
					var $ribbon = $(this.ribbonBox_tmpl({ text: text }));
					this.$('#title').after($ribbon);
					this.$ribbon = $ribbon.show();
				}
			},

			/**
			 * 字幕リボン破棄
			 */
			hideRibbon: function () {
				if (this.$ribbon) {
					this.$ribbon.remove();
					this.$ribbon = null;
				}
			},

			/**
			 * GET リクエストを実行する。
			 */
			fetch: function () {
				var pgIndex = this.options.pageIndex;
				var pgCount = this.options.pageCount;
				this.__getInternal(pgIndex, pgIndex, pgCount, null);
				return this;
			},

			/**
			 * オートバリデートを on/off する。
			 */
			setAutoValidate: function (flag) {
				this.options.auto_cl_validate = flag;
			},



			_eof: 'clutil.View.MDBaseView//'
		}),

		/**
		 * ページネーションをコントロールするビュー
		 */
		PaginationView: Backbone.View.extend({
			// el 要素は、<div class="pagination-wrapper"></div> 要素。コンストラクタから渡す。
			//	<div class="pagination-wrapper">
			//		<div>
			//			<div class="count"></div>
			//			<div class="viewnum"></div>
			//		</div>
			//		<div class="pagination">
			//			<ul></ul>
			//		</div>
			//	</div>
			template: _.template(''
				+ '<div class="displaypanel">'
				//				+		'<div class="count"></div>'
				//				+		'<div class="viewnum"></div>'
				+ '</div>'
				+ '<div class="pagination">'
				+ '<ul></ul>'
				+ '</div>'
			),

			initialize: function (opt) {
				_.bindAll(this);

				// グループID
				this.groupid = opt.groupid ? opt.groupid : '*';

				// pagination プラグインの起動オプション
				var pgDefaultOpt = {
					_cid: this.cid,
					items: 0,
					itemsOnPage: 0,//25, 表示件数選択肢の中から補正する。
					//currentPage: 1,
					//isselect: true,	// MD 版は、itemsOnPageSelection で指定する。
					itemsOnPageSelection: [10, 25, 100],
					//displaypanel: this.$('.count'),		// ← 表示件数: render 直前で設定する。
					onPageClickBefore: this._onPageClickBefore,
					onSelectChangeBefore: this._onSelectChangeBefore,
					onPageClick: this._onPageClick,
					onSelectChange: this._onSelectChange,
					pagination_store: false
				};
				this.pgOptions = _.isObject(opt.pgOptions) ? _.defaults(opt.pgOptions, pgDefaultOpt) : pgDefaultOpt;

				// 検索実行結果の応答ページ情報を受ける。
				clutil.mediator.on('onRspPage', this._setPageRsp);
				clutil.mediator.on('onPageMirroring', this._onPageMirroring);
			},

			render: function () {
				this.$el.html(this.template(this));
				this.$ul = this.$('.pagination > ul');

				// pagination オプション補正
				this.pgOptions.displaypanel = this.$('.displaypanel');

				this.buildPager();
				return this;
			},

			buildPager: function (pgOptions) {
				var fixedPgOptions = this.pgOptions;
				if (_.isObject(pgOptions)) {
					fixedPgOptions = _.defaults({}, pgOptions, this.pgOptions);
				}
				//				this.savedPgOptions = fixedPgOptions;
				this.$ul.pagination(fixedPgOptions);
				return this;
			},

			// pageRsp から、ページを変える。
			_setPageRsp: function (groupid, pageRspDto) {
				if (this.groupid == groupid) {
					this.deserialize(pageRspDto);
				}
			},

			_onPageClickBefore: function (ev) {
				var that = this;
				var commit = ev.commit;
				ev.commit = function () {
					commit.call(ev);
					that._onPageClick(ev.pageIndex, ev.itemsOnPage);
				};
				clutil.mediator.trigger('onPageClickBefore', this.groupid, ev);
			},

			_onSelectChangeBefore: function (ev) {
				var that = this;
				var commit = ev.commit;
				ev.commit = function () {
					commit.call(ev);
					that._onSelectChange(ev.itemsOnPage);
				};
				clutil.mediator.trigger('onSelectChangeBefore', this.groupid, ev);
			},

			_onPageClick: function (pageNumber, itemsOnPage, cancel) {
				// ページ変更
				this._publishMirroring();

				var pageReq = {
					start_record: itemsOnPage * (pageNumber - 1),
					page_size: itemsOnPage
				};
				clutil.mediator.trigger('onPageChanged', this.groupid, pageReq, this);
			},

			_onSelectChange: function (itemsOnPage) {
				// 表示件数変更
				var pageReq = {
					start_record: 0,
					page_size: itemsOnPage
				};
				this._publishMirroring();
				clutil.mediator.trigger('onPageChanged', this.groupid, pageReq, this);
			},

			// ページャの表示を同期化する
			_onPageMirroring: function (groupid, pgOpt, from) {
				//				if(this === from){
				//					// 発信元が自分自身なので省略。
				//					return;
				//				}
				if (this.groupid != groupid) {
					return;
				}
				this.buildPager(pgOpt);
			},

			// ページ同期化イベントを発火する。
			_publishMirroring: function () {
				var $ul = this.$ul;
				var pgopt = _.pick($ul.data('pagination') || {}, 'items', 'itemsOnPage', 'currentPage');
				var mirroringArg = _.extend({
					items: 0,
					itemsOnPage: 0,
					currentPage: 0
				}, pgopt);

				// 現在ページ番号補正：simple_pagination 内部的には 0 オリジンだが、API 的には 1 オリジンなもので・・・
				mirroringArg.currentPage++;

				clutil.mediator.trigger('onPageMirroring', this.groupid, mirroringArg, this);
			},

			// ページのリクエストヘッダを生成する。
			serialize: function () {
				var pgData = this.$ul.data('pagination');
				return {
					start_record: pgData.itemsOnPage * pgData.currentPage,
					page_size: pgData.itemsOnPage
				};
			},

			// ページのレスポンスヘッダをセットする
			//	var pgRsp = {
			//		curr_record: 20,	// 開始レコードインデックス
			//		total_record: 100,	// 総レコード数
			//		page_record: 10,	// X ページ内レコード数
			//		page_size: 10,		// ページ内マックスレコード数
			//		page_num: 10		// X 総ページ数
			//	};
			deserialize: function (pgRsp) {
				// パラメターが揃っていいるかチェック
				var start_index = 0;
				var page_size = 0;
				var isValidPgRsp = _.bind(function (pgRsp) {
					if (!_.isObject(pgRsp)) {
						return false;
					}
					// 最低、以下３個のフィールドをもっていること
					if (!_.isNumber(pgRsp.curr_record)) {
						return false;
					}
					if (!_.isNumber(pgRsp.total_record)) {
						return false;
					}
					if (!_.isNumber(pgRsp.page_size)) {
						return false;
					}
					// page_size が 0 の場合、itemsOnPage 値で補正しておく。
					if (pgRsp.page_size <= 0) {
						page_size = this.get('itemsOnPage');
					} else {
						page_size = pgRsp.page_size;
					}
					// start_record と curr_record
					if (pgRsp.start_record) {
						start_index = pgRsp.start_record;
					} else {
						start_index = pgRsp.curr_record;
					}
					return true;
				}, this)(pgRsp);
				var fixOpt;
				if (isValidPgRsp) {
					fixOpt = {
						items: pgRsp.total_record,
						itemsOnPage: page_size,
						currentPage: Math.floor((start_index + page_size) / page_size)
					};
				} else {
					fixOpt = { items: 0, currentPage: 1 };	// itemsOnPage はそのまま。
				}
				this.buildPager(fixOpt);
			},

			/**
			 * Pagination パラメタの getter メソッド
			 * 使用例：
			 * 	var itemOnPage = pgView.get('itemsOnPage');
			 */
			get: function (pgPropName) {
				var pgData = this.$ul.data('pagination');
				if (!pgPropName) {
					return pgData;
				}
				return pgData[pgPropName];
			},

			/**
			 * 初回検索用ページリクエストヘッダを生成する。
			 */
			buildReqPage0: function () {
				return {
					start_record: 0,
					page_size: this.get('itemsOnPage')
				};
			},

			_eof: 'clutil.View.PaginationView//'
		}),

		/**
		 * 指定 $elem 下の .pagination-wrapper クラス要素に対して、
		 * ページネーションView を適用する。
		 * @return clutil.View.PaginationView の配列
		 */
		buildPaginationView: function (groupid, $elem) {
			var pagerViews = [];
			$.each($elem.find('.pagination-wrapper'), function (arg) {
				var opt = {
					el: this,
					groupid: groupid
				};
				pagerViews.push(new clutil.View.PaginationView(opt));
			});
			return pagerViews;
		},

		/**
		 * 行選択付きの表示専用リストビュークラス。
		 * ※注意１：レコードデータには、'id' プロパティが存在することが前提です。
		 * ※注意２：行描画は underscore.js のテンプレートに強く依存します。
		 *
		 * テンプレート例：
		 *	<script id="ca_rec_template" type="text/template">
		 *		<tr>
		 *			<td></td>
		 *			<td class="ca_c_link"><%- code %></td>
		 *			<td class="ca_c_link"><%- name %></td>
		 *			<td class="ca_c_link"><%- clutil.dateFormat(fromDate, 'yyyy/mm/dd') %></td>
		 *			<td class="ca_c_link"><%- clutil.dateFormat(toDate, 'yyyy/mm/dd') %></td>
		 *			<td class="ca_c_link"><%- clutil.gettypename(amcm_type.AMCM_TYPE_VENDOR, vendorTypeID, 0) %></td>
		 *			<td class="ca_c_link"><%- unitCode %>:<%- unitName %></td>
		 *		</tr>
		 *	</script>
		 */
		RowSelectListView: Backbone.View.extend({
			//el: $('#ca_table'),

			// 行データ用テンプレート：<tr><td></td>・・・・</tr>
			//template: _.template( $('#ca_rec_template').html() ),

			className: 'clutil_View_RowSelectListView',

			// テーブルヘッダ:全選択セル内部要素テンプレート
			cb_selectall_html: '<label class="checkbox"><input type="checkbox" data-toggle="checkbox"></label>',

			// 行選択列のセル内部要素テンプレート
			cb_template: _.template('<label class="checkbox <% if(_select){ %>checked<% } %>"><input type="checkbox" data-toggle="checkbox" <% if(_select){ %>checked<% } %>></label>'),
			rb_template: _.template('<label class="radio    <% if(_select){ %>checked<% } %>"><input type="radio"    data-toggle="radio"    <% if(_select){ %>checked<% } %>></label>'),

			events: {
				'toggle thead th.cl_checkbox_selectall input[type="checkbox"]': '_onToggleSelectAll',
				'toggle tbody td.cl_checkbox_selectrec input[type="checkbox"]': '_onToggleSelect',
				'toggle tbody td.cl_radio_selectrec input[type="radio"]': '_onRadioToggle',
				'click tbody td:not(.cl_checkbox_selectrec,.cl_radio_selectrec)': '_onRowClick',
				'click tbody tr': '_onClickTR'
			},

			_onClickTR: function (e) {
				var $tr = $(e.currentTarget);
				this.trigger('onClickTR', { rec: $tr.data('cl_rec'), from: this }, e);
			},

			_onRowClick: function (e) {
				if (this.onOperationSilent) {
					return;
				}
				var $td = $(e.target);
				var data = $td.closest('tr').data('cl_rec');
				this.lastClickedRec = data;

				var pgIndex = _.indexOf(this.collection, data);

				clutil.mediator.trigger('onOperation', am_proto_defs.AM_PROTO_COMMON_RTYPE_REL, pgIndex, e);
				//clutil.mediator.trigger('onRowClick', this.groupid, data, e);
			},

			initialize: function (opt) {
				_.bindAll(this);

				if (!_.isArray(this.collection)) {
					this.collection = [];
				}
				this.groupid = (opt && opt.groupid) ? opt.groupid : '*';

				// template 引数は必須！
				if (opt.template === null || opt.template === undefined) {
					alert('RowSelectListView: テンプレートを指定してください。');
				}
				this.template = opt.template;

				// onOperation イベントを発火するかどうか
				this.onOperationSilent = (opt && opt.onOperationSilent);
			},

			initUIElement: function () {
				this.$('thead th.cl_checkbox_selectall').html(this.cb_selectall_html);
				return this;
			},

			render: function () {
				// thead: Bootstrap 対応
				//clutil.initUIelement(this.$('thead'));

				if (this.className) {
					this.$el.addClass(this.className);
				}

				// tbody
				var $tbody = this.$('tbody').empty();
				if (_.isArray(this.collection)) {
					_.each(this.collection, function (rec) {
						if (!_.isBoolean(rec._select)) {
							rec._select = false;
						}

						// 行 <tr> にクラス設定など。
						var $tr = $(this.template(rec));

						// チェックボックス列にテンプレートを充てる + checkbox 対応
						$tr.find('td.cl_checkbox_selectrec').html(this.cb_template(rec)).find('[data-toggle="checkbox"]').checkbox();

						// ラジオボタン
						$tr.find('td.cl_radio_selectrec').html(this.rb_template(rec)).find('[data-toggle="radio"]').attr('name', this.cid);

						// 行に class 、data をセットして、tbody へ追加
						$tr.addClass('contextmenu' + (rec._select ? ' checked' : '')).data('cl_rec', rec).appendTo($tbody);
					}, this);
				}

				// Bootstrap の設定を充てる
				clutil.initUIelement(this.$el);

				// 全レコードが選択中の場合 or Not
				this._setupSelectAllToggle();

				// 行選択が変更されたイベント強制発火
				this._publishOnRowSelectChanged(true);

				return this;
			},

			/**
			 * 削除行UIをセットする。
			 * 行選択状態は解除され、選択 checkbox は非活性になる。
			 * 行の表示色には削除行デザインを適用する。
			 * @param isRowMatchFunc 行データが削除行かどうかを判定する関数。
			 */
			setDeletedRowUI: function (isRowMatchFunc) {
				var args = {
					isMatch: isRowMatchFunc,
					select: false,
					enable: false,
					addClasses: 'delflag',
					rmClasses: 'delflag'
				};
				return this.setRowState(args);
			},

			/**
			 * 削除行UIを解除する。
			 * 行の表示色から削除行デザインを解除する。
			 * @param isRowMatchFunc 行データが削除行かどうかを判定する関数。
			 */
			unsetDeletedRowUI: function (isRowMatchFunc) {
				var args = {
					isMatch: isRowMatchFunc,
					enable: true,
					rmClasses: 'delflag'
				};
				return this.setRowState(args);
			},

			/**
			 * 行の状態を設定する。
			 * @method setRowState
			 * @param {object} args
			 * @param {function} args.isMatch	行データのマッチング関数。
			 * @param {boolean} [select]		選択状態の指定、true:選択、false:選択解除、未指定:そのまま。
			 * @param {boolean} [enable]		選択checkboxの活性状態の指定、true:enable、false:disanable、未指定:そのまま。
			 * @param {string} [addClasses]		TR要素に追加するクラス。
			 * @param {string} [rmClasses]		TR要素から削除するクラス。
			 */
			setRowState: function (args) {
				if (!args || !_.isFunction(args.isMatch)) {
					console.warn('clutil.View.RowSelectListView.setRowState: invalid arguments.');
					return;
				}

				if (_.isEmpty(this.collection)) {
					return;
				}

				var changedCount = 0;
				var $trAll, $trtr = $();
				try {
					this._bulkUpdating = true;

					// 履歴を持つかどうか判定
					$trAll = this.$('tbody tr').each(function (rowIndex) {
						var $tr = $(this);
						var $chk_td = $tr.find('td.cl_checkbox_selectrec');
						var dto = $tr.data('cl_rec');
						if (!args.isMatch(dto)) {
							return;
						}

						// マッチ行<tr>要素をかき集めておく
						$trtr = $trtr.add($tr);

						// 選択状態をセット
						if (_.has(args, 'select')) {
							var fixSelect = (args.select == true);
							if (dto._select !== fixSelect) {
								dto._select = fixSelect;
								++changedCount;
								$chk_td.find('[data-toggle="checkbox"]').checkbox('toggle');
							}
						}

						// 活性化状態をセット
						if (_.has(args, 'enable')) {
							var fixEnabled = (args.enable == true);
							var dtoIsEnabled = !(dto._enable === false);	// false を明示して disabled。
							if (dtoIsEnabled !== fixEnabled) {
								dto._enable = fixEnabled;
								if (fixEnabled) {
									$chk_td.removeClass('notAvailable').removeAttr('disabled');
									$chk_td.find('label.checkbox').removeClass('disabled');
									$chk_td.find('[data-toggle="checkbox"]').removeAttr('disabled');
								} else {
									$chk_td.addClass('notAvailable').attr('disabled', true);
									$chk_td.find('label.checkbox').addClass('disabled');
									$chk_td.find('[data-toggle="checkbox"]').attr('disabled', true);
								}
							}
						}
					});
				} finally {
					this._bulkUpdating = false;
				}

				// <tr>要素への削除クラス
				if (args.rmClasses) {
					$trAll.removeClass(args.rmClasses);
				}
				// <tr>要素への追加クラス
				if (args.addClasses) {
					$trtr.addClass(args.addClasses);
				}

				if (changedCount > 0) {
					// 全レコードが選択中の場合 or Not
					this._setupSelectAllToggle();

					// 行選択が変更されたイベント発火
					this._publishOnRowSelectChanged();
				}

				return $trtr;
			},

			/**
			 * recs 配列各要素にマッチする行選択チェックボックスの活性/非活性を ON/OFF する。
			 * arg#1: selectedRecs 行データ
			 * arg#2: enable true:活性化、false:非活性化
			 * arg#3: uniqKeys 行データのキーとなるプロパティ名リスト。省略時は 'id' でマッチングする。
			 *
			 * @return 行操作対象 <tr> 要素の jQuery オブジェクトを返す。
			 */
			setEnableRecs: function (recs, enable, uniqKeys) {
				if (_.isEmpty(recs) || _.isEmpty(this.collection)) {
					return;
				}

				// 選択対象行データ補正
				var fixRecs = recs;
				if (!_.isArray(recs)) {
					if (!_.isObject(recs)) {
						console.error('setEnableRecs: 引数の型が違います。');
						throw '引数の型が違います';
					}
					fixRecs = [recs];
				}

				// enabled フラグ値補正 - 明示的 false 指定で非活性とする。null, undefined は true 扱い。
				var fixEnabled = !(enable === false);

				// キー名リスト補正
				var fixUniqKeys = uniqKeys;
				if (_.isEmpty(uniqKeys)) {
					fixUniqKeys = ['id'];
				}

				// ハッシュ値マップをつくる： key1=134&key2=999&key3=abcde
				var keyMap = this.buildRecsHashMap(fixRecs, fixUniqKeys);

				// 履歴をもつかどうか判定
				var hasHasHistory = this.hasHistory();
				var myView = this;
				var $trtr = $();
				this.$('tbody tr').each(function (rowIndex) {
					var $tr = $(this);
					var $chk_td = $tr.find('td.cl_checkbox_selectrec');
					var dto = $tr.data('cl_rec');
					var hash = myView.dtohash(dto, fixUniqKeys);
					var argDtoArray = keyMap[hash];
					var argDto;
					if (hasHasHistory) {
						argDto = _.find(argDtoArray, function (x) {
							// リレキありの場合
							// 適用期間チェック ⇒ 少しでも期間が重なる場合は対象とみなしておく。
							return (x.toDate >= dto.fromDate && x.fromDate <= dto.toDate);
						});
					} else {
						argDto = _.isEmpty(argDtoArray) ? null : argDtoArray[0];
					}

					if (argDto) {
						// キーマッチング＋期間マッチング ⇒ TRUE
						var dtoIsEnabled = !(dto._enable === false);
						if (dtoIsEnabled !== fixEnabled) {
							dto._enable = fixEnabled;
							if (fixEnabled) {
								$chk_td.removeClass('notAvailable').removeAttr('disabled');
								$chk_td.find('label.checkbox').removeClass('disabled');
								$chk_td.find('[data-toggle="checkbox"]').removeAttr('disabled');
							} else {
								$chk_td.addClass('notAvailable').attr('disabled', true);
								$chk_td.find('label.checkbox').addClass('disabled');
								$chk_td.find('[data-toggle="checkbox"]').attr('disabled', true);
							}
						}
						// マッチ行<tr>要素をかき集めておく
						$trtr = $trtr.add($tr);
					}
				});

				// 操作対象の <tr> 要素を返す。
				return $trtr;
			},

			// 行データのハッシュ値関数（内部関数）
			dtohash: function (dto, uniqKeys) {
				var ss = _.reduce(uniqKeys, _.bind(function (array, key) {
					array.push(key + '=' + dto[key]);
					return array;
				}, this), []);
				return ss.join('&');
			},

			// ハッシュ値 - [行データ,..]マップオブジェクトをつくる（内部関数）
			buildRecsHashMap: function (recs, uniqKeys) {
				var map = _.reduce(recs, _.bind(function (map, dto) {
					var hash = this.dtohash(dto, uniqKeys);
					var vv = map[hash];
					if (!vv) {
						vv = new Array();
						map[hash] = vv;
					}
					vv.push(dto);

					return map;
				}, this), {});
				return map;
			},

			// 履歴アリ/ナシレコードを判定する。
			hasHistory: function (dto) {
				var xdto = !_.isEmpty(dto) ? dto : !_.isEmpty(this.collection) ? this.collection[0] : null;
				return (xdto != null) ? _.has(xdto, 'fromDate') && _.has(xdto, 'toDate') : false;
			},

			/**
			 * selectedRecs 配列各要素にマッチする行を選択 ON/OFF する。
			 * arg#1: selectedRecs 行データ
			 * arg#2: select true:選択、false:選択を外す
			 * arg#3: uniqKeys 行データのキーとなるプロパティ名リスト。省略時は 'id' でマッチングする。
			 *
			 * @return 行操作対象 <tr> 要素の jQuery オブジェクトを返す。
			 */
			setSelectRecs: function (selectedRecs, select, uniqKeys) {
				if (_.isEmpty(selectedRecs) || _.isEmpty(this.collection)) {
					return;
				}

				// 選択対象行データ補正
				var fixSelectedRecs = selectedRecs;
				if (!_.isArray(selectedRecs)) {
					if (!_.isObject(selectedRecs)) {
						console.error('setSelectRecs: 引数の型が違います。');
						throw '引数の型が違います';
					}
					fixSelectedRecs = [selectedRecs];
				}

				// select フラグ値補正
				var fixSelect = (select == true);

				// キー名リスト補正
				var fixUniqKeys = uniqKeys;
				if (_.isEmpty(uniqKeys)) {
					fixUniqKeys = ['id'];
				}

				// ハッシュ値マップをつくる： key1=134&key2=999&key3=abcde
				var keyMap = this.buildRecsHashMap(fixSelectedRecs, fixUniqKeys);

				var changedCount = 0;
				var $trtr = $();
				try {
					this._bulkUpdating = true;

					// 履歴を持つかどうか判定
					var hasHistory = this.hasHistory();
					var myView = this;
					this.$('tbody tr').each(function (rowIndex) {
						var $tr = $(this);
						var $chk_td = $tr.find('td.cl_checkbox_selectrec');
						var dto = $tr.data('cl_rec');
						var hash = myView.dtohash(dto, fixUniqKeys);
						var argDtoArray = keyMap[hash];
						var argDto;
						if (hasHistory) {
							argDto = _.find(argDtoArray, function (x) {
								// リレキありの場合
								// 適用期間チェック ⇒ 少しでも期間が重なる場合は対象とみなしておく。
								return (x.toDate >= dto.fromDate && x.fromDate <= dto.toDate);
							});
						} else {
							argDto = _.isEmpty(argDtoArray) ? null : argDtoArray[0];
						}

						if (argDto) {
							// キーマッチング＋期間マッチング ⇒ TRUE
							if (dto._select !== fixSelect) {
								dto._select = fixSelect;
								++changedCount;
								$chk_td.find('[data-toggle="checkbox"]').checkbox('toggle');
							}
							// マッチ行<tr>要素をかき集めておく
							$trtr = $trtr.add($tr);
						}
					});
				} finally {
					this._bulkUpdating = false;
				}

				if (changedCount > 0) {
					// 全レコードが選択中の場合 or Not
					this._setupSelectAllToggle();

					// 行選択が変更されたイベント発火
					this._publishOnRowSelectChanged();
				}

				return $trtr;
			},

			/**
			 * id のリスト、または 'id' をプロパティに含む Dto のリストを指定して行選択する。
			 * 注意：履歴アリのマスタは、setSelectRecs() を使用してください。
			 */
			setSelectById: function (idList, select) {
				var idmap = {};
				if (_.isArray(idList)) {
					_.reduce(idList, function (map, id) {
						if (_.has(id, 'id')) {
							map[id.id] = true;
						} else {
							map[id] = true;
						}
						return map;
					}, idmap);
				} else if (_.isNumber(idList)) {
					idmap[idList] = true;
				} else if (_.has(idList, 'id')) {
					idmap[idList.id] = true;
				}

				var fixSelect = (select == true);

				var changedCount = 0;
				try {
					this._bulkUpdating = true;

					this.$('tbody tr').each(function (rowIndex) {
						var $tr = $(this);
						var $chk_td = $tr.find('td.cl_checkbox_selectrec');
						var dto = $tr.data('cl_rec');
						if (idmap[dto.id] && dto._select !== fixSelect) {
							dto._select = fixSelect;
							++changedCount;
							$chk_td.find('[data-toggle="checkbox"]').checkbox('toggle');
						}
					});
				} finally {
					this._bulkUpdating = false;
				}

				if (changedCount > 0) {
					// 全レコードが選択中の場合 or Not
					this._setupSelectAllToggle();

					// 行選択が変更されたイベント発火
					this._publishOnRowSelectChanged();
				}
			},

			// 結果表示をクリアする
			clear: function () {
				// クリア前の行数
				var beforeRecCount = this.recsCount();

				this.$('tbody').empty();
				this.collection = [];
				this.$('thead > th.cl_checkbox_selectall input').checkbox('uncheck');

				if (beforeRecCount !== 0) {
					// クリア前後で行数変化がある場合は、行選択が変更されたイベント発火 ⇒ opeBtn の enabled 制御へ伝播させる。
					this._publishOnRowSelectChanged();
				}

				return this;
			},

			/**
			 * 行データを取得する
			 */
			serialize: function () {
				return _.clone(this.collection);
			},

			/**
			 * 行データのコレクションをセットする
			 */
			deserialize: function (array) {
				this.collection = array;
				return this;
			},

			/**
			 * 行データをセットする
			 * deserialize() + render()
			 */
			setRecs: function (array) {
				this.deserialize(array);
				this.render();
				return this;
			},

			/**
			 * 全行データを取得する
			 * @returns
			 */
			getRecs: function () {
				return this.serialize();
			},

			/**
			 * レコード数を返す
			 */
			recsCount: function () {
				return _.isArray(this.collection) ? this.collection.length : 0;
			},

			/**
			 * 選択レコード数を返す
			 */
			selectedRecsCount: function () {
				return this.getSelectedRecs().length;
			},

			/**
			 * 選択された行データを返す
			 */
			getSelectedRecs: function () {
				return _.isArray(this.collection) ? _.where(this.collection, { _select: true }) : [];
			},

			/**
			 * 選択された行の id 値配列を返す。
			 */
			getSelectedIdList: function () {
				var selectedRows = this.getSelectedRecs();
				return _.reduce(selectedRows, function (array, dto) {
					if (_.has(dto, 'id')) {
						array.push(dto.id);
					}
					return array;
				}, []);
			},

			/**
			 * 最後にクリックされた行データを返す。
			 */
			getLastClickedRec: function () {
				return this.lastClickedRec;
			},

			// 選択状態変更、一括実行中の内部フラグ -- 余計なイベントを送出しないように・・・
			_bulkUpdating: false,

			// 全選択チェックボックスの選択値変更イベント
			_onToggleSelectAll: function (e) {
				var $target = $(e.target);
				var isSelected = $target.prop('checked');

				// View を更新
				var cb_arg = (isSelected) ? 'check' : 'uncheck';

				// <tr> に仕込んだ rec を更新
				try {
					this._bulkUpdating = true;

					this.$('tbody tr td.cl_checkbox_selectrec:not([disabled]) input').checkbox(cb_arg).closest('tr').each(function () {
						var $tr = $(this);
						var dto = $tr.data('cl_rec');
						if (!dto || dto._enable === false) {
							return;
						}

						dto._select = isSelected;
						if (isSelected) {
							$tr.addClass('checked');
						} else {
							$tr.removeClass('checked');
						}
					});
				} finally {
					this._bulkUpdating = false;
				}

				// 行選択が変更されたイベント発火
				this._publishOnRowSelectChanged();
			},

			// 単一選択：ラジオボタンの選択値変更イベント
			_onRadioToggle: function (e) {
				var $target = $(e.target);
				var $tr = $target.closest('tr');
				var dto = $tr.data('cl_rec');

				for (var i = 0; i < this.collection.length; i++) {
					var x = this.collection[i];
					x._select = false;
				}

				var isSelected = $target.prop('checked');
				dto._select = isSelected;

				// 行選択が変更されたイベント発火
				this._publishOnRowSelectChanged();
			},

			// 各行のチェックボックスの選択値変更イベント
			_onToggleSelect: function (e) {
				if (this._bulkUpdating) {
					// 一括実行中
					return;
				}
				var $target = $(e.target);
				var isSelected = $target.prop('checked');
				var cb_arg = (isSelected) ? 'check' : 'uncheck';

				// View を更新
				$target.checkbox(cb_arg);

				// <tr> に仕込んだ rec を更新
				var $tr = $target.closest('tr');
				$tr.data('cl_rec')._select = isSelected;
				if (isSelected) {
					$tr.addClass('checked');
				} else {
					$tr.removeClass('checked');
				}

				// 全選択 or 全未選択に応じて、selectall の表示を合わせる
				var selectarg = (this.selectedRecsCount() >= this.recsCount())
					? 'check' : 'uncheck';
				this.$('thead th.cl_checkbox_selectall input').checkbox(selectarg);

				// 行選択が変更されたイベント発火
				this._publishOnRowSelectChanged();
			},

			// 行選択変更イベントを発行する
			_publishOnRowSelectChanged: function (force) {
				if (force || this.recsCount() > 0) {
					var recs = this.collection;
					var selectedRecs = this.getSelectedRecs();
					var arg = {
						// 全体の個数
						recs: this.collection,
						recsCount: recs.length,
						// 選択レコード数
						selectedRecs: selectedRecs,
						selectedRecsCount: selectedRecs.length
					};
					clutil.mediator.trigger('onRowSelectChanged', this.groupid, arg, this);
				}
			},

			/**
			 * 各行が全選択されている or Not の状態で、テーブルヘッダ行のトグルとの整合性を合わせる。
			 */
			_setupSelectAllToggle: function () {
				var recCount = this.recsCount();
				var selectedRecCount = this.selectedRecsCount();
				var selectarg = (recCount > 0 && recCount === selectedRecCount) ? 'check' : 'uncheck';
				this.$('thead th.cl_checkbox_selectall input').checkbox(selectarg);
			},

			_eof: 'clutil.View.RowSelectListView//'
		}),

		/**
		 * 画面初期化で失敗した場合など、続行不能なエラーが発生したときに表示するView。
		 * 基本動作は、エラーメッセージを表示した後、５秒後にホームへ自動的に移動する。
		 *
		 * 使い方：
		 * new AbortView({messages:['１行目のメッセージ', '２行目のメッセージ', ...]}).doAbort();
		 *   または、
		 * new AbortView({rspHead: {<-- 共通応答ヘッダ -->}}).doAbort();
		 *
		 * オプション：
		 * ・messages		メッセージ。配列で指定した場合は行毎に出力する。
		 * ・rspHead		共通応答ヘッダ。エラーメッセージとる。優先度は rspHead > messages。
		 * ・homeURL		移動先URL。省略した場合は、ホームへ移動する。
		 * ・stayingMillis	Abort ビュー表示時間（ミリ秒）、-1 を指定すると留まる。
		 */
		AbortView: Backbone.View.extend({
			className: 'msgBox general',
			template: _.template('<% _.each(messages, function(msg){ %><p><%- msg %></p><% }) %>'),
			defaultopt: {
				messages: [],
				//homeURL: '/',
				stayingMillis: 5000
			},
			initialize: function (opt) {
				this.options = function (argopt, dopt) {
					var opt = _.defaults(argopt || {}, dopt);
					if (opt.rspHead && opt.rspHead.httpStatus == 401) {
						// 401 エラーは別格扱い
						var xx = ['自動的にログアウトしました。'];
						var stayingSec = Math.floor(opt.stayingMillis / 1000);
						if (stayingSec > 0) {
							xx.push(stayingSec + '秒後にログインページに移動します。');
						}
						opt.messages = xx;
					} else {
						var rspHdMsg = (opt.rspHead)
							? clutil.fmtargs(clutil.getclmsg(opt.rspHead.message), opt.rspHead.message.args)
							: null;
						if (_.isString(opt.messages)) {
							opt.messages = [opt.messages];
						}
						if (!_.isArray(opt.messages)) {
							opt.messages = [];
						}
						if (rspHdMsg) {
							opt.messages.push(rspHdMsg);
						}
						if (_.isEmpty(opt.messages)) {
							opt.messages.push('Abort!');
						}
					}

					return opt;
				}(opt, this.defaultopt);
			},
			render: function () {
				var content = this.template(this.options);
				this.$el.html(content);
				return this;
			},
			doAbort: function () {
				var opt = this.options;
				$('body').html(this.render().el).show().css({ visibility: 'visible' }).removeClass('cl_body_hidden');

				// デバッグ用: ページ移動を抑止する。
				if (clcom._preventGoHome) {
					return;
				}

				if (opt.stayingMillis === 0) {
					// 速攻でページ移動
					if (opt.logout) {
						clcom.logout(opt.homeURL);
					} else {
						clcom.gohome(opt.homeURL);
					}
				} else if (opt.stayingMillis < 0) {
					// 留まる。
				} else {
					// 指定ミリ秒後にジャンプする
					setTimeout(function () {
						if (opt.logout) {
							clcom.logout(opt.homeURL);
						} else {
							clcom.gohome(opt.homeURL);
						}
					}, opt.stayingMillis);
				}
				return this;
			},
			_eof: 'clutil.View.AbortView//'
		}),

		/**
		 * エラーメッセージを表示して、ホーム画面へ戻る。
		 * 引数は、AbortView のオプションと同じ。
		 */
		doAbort: function (abortopt) {
			var fixopt = {
				homeURL: clcom.urlRoot
			};
			if (abortopt) {
				_.extend(fixopt, abortopt);
			}
			new clutil.View.AbortView(fixopt).doAbort();
		},

		/**
		 * アップロードチェック用のファイルタイプ定義
		 */
		FileTypes: {
			image: {
				description: '画像ファイル',
				matcher: [/^image\//]
			},
			excel: {
				description: 'エクセルファイル',
				matcher: [
					//					'application/vnd.ms-excel',
					//					'application/vnd.ms-excel.sheet.macroEnabled.12',
					/^application\/vnd.ms-excel/,
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'	// *.xlsx
				],
				extension: [/\.xls$/i, /\.xlsx$/i, /\.xlsm$/i]
			},
			xlsx: {
				description: 'エクセルファイル(xlsx)',
				matcher: [
					//					'application/vnd.ms-excel',
					//					'application/vnd.ms-excel.sheet.macroEnabled.12',
					/^application\/vnd.ms-excel/,
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'	// *.xlsx
				],
				extension: [/\.xls$/i, /\.xlsx$/i]
			},
			xlsm: {
				description: 'エクセルファイル(xlsm)',
				matcher: [
					//					'application/vnd.ms-excel',
					//					'application/vnd.ms-excel.sheet.macroEnabled.12',
					/^application\/vnd.ms-excel/,
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'	// *.xlsx
				],
				extension: [/\.xlsm$/i]
			},
			csv: {
				description: 'ＣＳＶファイル',
				matcher: ['text/csv', 'application/vnd.ms-excel'],
				extension: [/\.csv$/i]
			},
			xml: {
				description: 'ＸＭＬファイル',
				matcher: ['text/xml']
			},
			text: {
				description: 'テキストファイル',
				matcher: ['text/plain']
			},
			pdf: {
				description: 'ＰＤＦファイル',
				extension: [/\.pdf$/i]
			},
			zip: {
				description: 'ＺＩＰファイル',
				extension: [/\.zip$/i]
			}
		},

		/**
		 * ファイルアップロード用のボタンView
		 * 複数ファイル選択は未対応。
		 */
		FileUploadButtonView: Backbone.View.extend({
			tagName: 'form',
			//className: 'fieldBox noName',

			template: _.template(''
				+ '<a href="javascript:void(0);" class="file-input-wrapper <%= btnCssClassName %> cl-file-attach">'
				+ '<%- label %>'
				+ '	<input type="file" class="hide-input" name="file">'
				+ '	<input class="cl-file-attr" name="attr" type="hidden">'
				+ '</a>'),

			events: {
				'mousemove a': '_adjustPosition',
				'click input[type=file]': function (e) {
					return this._beforeShowFileChooser();
				},
				'keydown a:not([disabled])': function (e) {
					// Enter キーでクリック発火
					if (e.keyCode === 13 && this._beforeShowFileChooser()) {
						this.$inputFile.trigger('click');
					}
				},
				'change input[type=file]': '_inputFileChanged'
			},

			/**
			 */
			initialize: function (opt) {
				_.bindAll(this);

				var defaultOpts = {
					label: 'ファイルアップロード',
					//width: 280,
					btnCssClassName: '',
					doUploadImmediately: true,		// ファイル選択後すぐにアップロードを実行
					url: clcom.uploadDestUri		// アップロードサービスURI: '/system/api/am_cm_fileupload',
				};
				this.options = _.isObject(opt) ? _.extend(defaultOpts, opt) : defaultOpts;
			},

			//			// お約束の内部部品初期化
			//			initUIElement: function(){
			//				return this;
			//			},

			render: function () {
				this.$el.html(this.template(this.options));
				this.$btn = this.$el.find('a');
				if (this.options.width) {
					this.$btn.css('width', this.options.width + 'px');
				}
				this.$inputFile = this.$el.find('input[name="file"]');
				this.$inputAttr = this.$el.find('input[name="attr"]');

				return this;
			},

			// <a> タグ内のmousemove で、内部の input[type=file] がストーキングするおまじない。
			_adjustPosition: function (cursor) {
				var input, wrapper,
					wrapperX, wrapperY,
					inputWidth, inputHeight,
					cursorX, cursorY,
					moveInputX, moveInputY;

				// This wrapper element (the button surround this file input)
				wrapper = this.$btn;//$(this);
				// The invisible file input element
				input = this.$inputFile;//wrapper.find("input[type=file]");
				// The left-most position of the wrapper
				wrapperX = wrapper.offset().left;
				// The top-most position of the wrapper
				wrapperY = wrapper.offset().top;
				// The with of the browsers input field
				inputWidth = input.width();
				// The height of the browsers input field
				inputHeight = input.height();
				//The position of the cursor in the wrapper
				cursorX = cursor.pageX;
				cursorY = cursor.pageY;

				//The positions we are to move the invisible file input
				// The 20 at the end is an arbitrary number of pixels that we can shift the input such that cursor is not pointing at the end of the Browse button but somewhere nearer the middle
				moveInputX = cursorX - wrapperX - inputWidth + 20;
				// Slides the invisible input Browse button to be positioned middle under the cursor
				moveInputY = cursorY - wrapperY - (inputHeight / 2);

				// Apply the positioning styles to actually move the invisible file input
				input.css({
					left: moveInputX,
					top: moveInputY
				});
			},
			// ファイル選択直前のアプリチェック割り込み
			_beforeShowFileChooser: function () {

				// 権限チェック内部関数
				var isBadPermFunc = function (opeTypeId) {
					if (clutil._XXXDBGGetIniPermChk === false) {
						// 権限チェックをスキップする
						return;
					}
					var pageId = clcom.pageId;
					if (_.isEmpty(pageId) || !/^AM[A-Z]{2}V[0-9]{4}$/.test(pageId)) {
						// MDの画面コード体系にマッチしていないので、権限制限外（制限を受けない）と判断する。
						return;	// OK
					}

					var pm = clcom.getPermfuncByCode(pageId);
					var permtype = clutil.opeTypeIdPerm(opeTypeId);

					if (permtype == 'write') {
						if (!_.isEmpty(pm) && (pm.f_allow_write)) {
							return;	// OK
						}
					} else if (permtype == 'del') {
						if (!_.isEmpty(pm) && (pm.f_allow_del)) {
							return;	// OK
						}
					}
					return permtype;
				};

				// 更新権限チェック追加
				var permChk = isBadPermFunc(am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT);	// CSV取込
				if (permChk == 'write') {
					clutil.mediator.trigger('onTicker', clmsg.is_upd_false);
					return false;
				} else if (permChk == 'del') {
					clutil.mediator.trigger('onTicker', clmsg.is_del_false);
					return false;
				}


				if (!_.isFunction(this.options.beforeShowFileChooser)) {
					return true;
				}
				// 明示的に false を返さないと、キャンセル扱いにしない。
				return this.options.beforeShowFileChooser() !== false;
			},
			// ファイル選択が変更された
			_inputFileChanged: function (e) {
				var files = e.target.files;
				if (files.length <= 0) {
					// キャンセル？
					this.clear();
					return;
				}

				var selectedFile = files[0];

				// ファイルタイプチェック
				var chkFileType = this.options.fileType;
				if (chkFileType) {
					var isMatch = function (str, matcher) {
						if (_.isRegExp(matcher)) {
							return str.match(matcher);
						} else {
							return str == matcher;
						}
						return false;
					};
					var ftypeNG_Abort = _.bind(function () {
						// ファイルタイプがNG
						var msg = chkFileType.description + 'を選択してください。';
						clutil.mediator.trigger('onTicker', msg);
						this.clear();
					}, this);

					// ファイルタイプチェック
					var isValidFileType = true;
					if (_.isArray(chkFileType.matcher) && chkFileType.matcher.length > 0) {
						isValidFileType = false;
						for (var i = 0; i < chkFileType.matcher.length; i++) {
							var matcher = chkFileType.matcher[i];
							if (isMatch(selectedFile.type, matcher)) {
								isValidFileType = true;
								break;
							}
						}
					}
					if (!isValidFileType) {
						// ファイルタイプがNG
						ftypeNG_Abort();
						return;
					}

					// ファイル拡張子チェック
					var isValidExtension = true;
					var fname = e.target.value;
					if (_.isArray(chkFileType.extension) && chkFileType.extension.length > 0) {
						isValidExtension = false;
						for (var i = 0; i < chkFileType.extension.length; i++) {
							var ext = chkFileType.extension[i];
							if (isMatch(fname, ext)) {
								isValidExtension = true;
								break;
							}
						}
					}
					if (!isValidExtension) {
						// ファイル拡張子がNG
						ftypeNG_Abort();
						return;
					}
				}

				// ファイルサイズのチェック
				if (this.options.maxFileSize > 0 && selectedFile.size > this.options.maxFileSize) {
					var msg = 'ファイルサイズが大きすぎます。{0} 以下のファイルを選択してください。';
					var arg = (this.options.maxFileSize / 1024) + '[KB]';
					clutil.mediator.trigger('onTicker', clutil.fmt(msg, arg));
					this.clear();
					return;
				}

				// 即時アップロード
				if (this.options.doUploadImmediately) {
					this.doUpload(selectedFile);
				}
			},
			// Windows形式のパス表現文字列からファイル名のみをぬきだす。
			// input type=file のvalueの値からファイル名取得するために使用
			_baseName: function (path) {
				var filename = _.last(path.split('\\'));
				return filename;
			},

			/**
			 * アップロードする。
			 */
			doUpload: function (selectedFile) {
				if (!selectedFile) {
					var files = this.$inputFile[0].files;
					if (files.length === 0) {
						clutil.mediator.trigger('onTicker', 'ファイルを選択してください。');
						return;
					}
					selectedFile = files[0];
				}

				// ファイル名を Attr にセット
				var filename = (selectedFile.name)
					? selectedFile.name : this._baseName(this.$inputFile.val());
				this.$inputAttr.val(JSON.stringify({
					filename: filename
				}));

				// ファイルアップロード
				var url = this.options.url;
				clutil.blockUI(url);
				return this.$el.ajaxSubmit({
					type: 'POST',
					dataType: 'json',
					contentType: 'multipart/form-data',
					url: url,
					success: this._onUploadSuccess,
					error: this._onUploadError,
					complete: this._onUploadComplete
				});
			},
			_onUploadSuccess: function (data, dataType) {
				var attr = JSON.parse(this.$inputAttr.val());
				var file = {
					id: data.id,
					filename: attr.filename,
					uri: data.uri
				};
				this.clear();
				this.trigger('success', file, data, dataType);
			},
			_onUploadError: function (jqXHR, textStatus, errorThrown) {
				console.error(textStatus, errorThrown);
				//				if (this.options.showDialogOnError) {
				//					new clutil.ErrorDialog('ファイルアップロードに失敗しました。');
				//				}
				clutil.mediator.trigger('onTicker', 'ファイルアップロードに失敗しました。');

				this.trigger('error', jqXHR, textStatus, errorThrown);
			},
			_onUploadComplete: function (jqXHR, textStatus) {
				clutil.unblockUI(this.options.url);
				this.trigger('complete', jqXHR, textStatus);
			},

			/**
			 * クリアする。
			 */
			clear: function () {
				// ファイル選択解除
				this.$el.resetForm();

				// Attr 用 input クリア
				this.$inputAttr.val(null);
			},

			/**
			 * ボタンの活性化/非活性化を設定する。
			 */
			setEnable: function (enable) {
				if (enable) {
					this.$btn.removeAttr('disabled');
				} else {
					this.$btn.attr('disabled', true);
				}
			},

			/**
			 * ボタンの活性/非活性状態を取得する。
			 */
			isEnabled: function () {
				//return this.$btn.prop('disabled');
				return !this.$btn.attr('disabled');
			},

			_eof: 'clutil.View.FileUploadButtonView//'

		}),

		/**
		 * ファイルアップロード用ボタンビューをつくる。
		 * 引数 btn のボタン要素は、FileUploadButtonView.$el に置き換えられます。
		 */
		buildFileUploadButtonView: function (btn, opts) {
			var $btn = (btn instanceof jQuery) ? btn : $(btn);

			var defaulOpts = {
				label: function ($btn) {
					var label;
					if ($btn.is('input')) {
						label = $btn.val();
					} else {
						label = $btn.text();
					}
					if (_.isEmpty(label)) {
						var id = $btn.attr('id');
						var opeTypeId = clutil.btnOpeTypeId(id);
						label = clutil.opeTypeIdtoString(opeTypeId);
					}
					return label;
				}($btn),
				btnCssClassName: $btn.attr('class')		// ボタンクラス名複写用
			};
			if (_.isObject(opts)) {
				opts = _.extend(defaulOpts, opts);
			} else {
				opts = defaulOpts;
			}
			var fileUploadView = new clutil.View.FileUploadButtonView(opts);

			// ボタンを差し替える
			$btn.hide().after(fileUploadView.render().$el).remove();

			return fileUploadView;
		},

		/**
		 * CSV取込処理専用のボタンビュークラスを作る。
		 * opt.btn - アップロード用のボタン要素
		 * opt.fileUploadViewOpts - FileUploadButtonView へ渡す引数
		 * opt.buildCSVInputReqFunction - CSV取込用のリクエストビルダ関数
		 * opt.noDialogOnDone - ファイルアップロード成功時にダイアログを表示しない
		 */
		OpeCSVInputController: function (opt/*btn, buildCSVInputReqFunction, fileUploadViewOpts*/) {
			var fixFileUploadOpts = _.extend({
				maxFileSize: 1024 * 1024,					// ファイルサイズ上限：1MB
				fileType: clutil.View.FileTypes.excel		// エクセル
			}, (opt && opt.fileUploadViewOpts) || {});

			var fileUploadView = clutil.View.buildFileUploadButtonView(opt.btn, fixFileUploadOpts);
			fileUploadView.on('success', function (file) {
				// サーバスプールへのアップロードまで成功。
				// file: { id: <ファイルID>, filename: <ファイル名>, uri: <ファイルアクセス用のURI> }
				if (!_.isFunction(opt.buildCSVInputReqFunction)) {
					// 取込用の要求パケットの作り方がわからないので、すぐ return する。
					return;
				}

				var req = opt.buildCSVInputReqFunction(file);
				if (req == null) {
					// アプリ側の事情でキャンセルした。
					console.log('buildCSVInputReqFunction: req is null, canceled.');
					return;
				}
				// 応答構造のチェック
				if (!_.isObject(req) || !_.isString(req.resId) || _.isEmpty(req.resId)) {
					// I/F が正しくない
					var m = 'buildCSVInputReqFunction: 引数に誤りがあります。コードを見直してください。';
					console.error(m);
					alert(m);
					return;
				}

				// 共通Reqヘッダ補完サポート
				if (true) {
					var defaultReqHead = {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT,
						fileId: file.id
					};
					if (req.data.reqHead) {
						req.data.reqHead = _.defaults(req.data.reqHead, defaultReqHead);
					} else {
						req.data.reqHead = defaultReqHead;
					}
					if (!_.isObject(req.data.reqPage)) {
						req.data.reqPage = {};
					}
				}

				// 応答時、ページャ部品のページ変更通知を起こさないオプションを指定する。
				req.onRspPage = false;

				// 要求
				clutil.postJSON(req).then(function (data) {
					var hd = data.rspHead;
					if (!_.isEmpty(hd.message)) {
						clutil.mediator.trigger('onTicker', hd);
						//data.rspHead.message = null;	// fail で再表示しないように、null にしておく。
					}
					if (hd.uri) {
						// DLファイルが指定された ⇒ DLメソッドを呼び出す。
						// PDF ファイルを指定されるなど、別窓でDLをやらせるケースってあるの？
						clutil.download({ url: hd.uri });
					} else {
						return this;
					}
				}).done(function (data) {
					if (!opt.noDialogOnDone) {
						clutil.MessageDialog2('取込が完了しました。');				// FIXME: height を抑えたダイアログで
					}
					fileUploadView.trigger('done', data);
				}).fail(function (data) {
					clutil.saveFileUploadView = fileUploadView;
					clutil.saveFileUploadView.saveOpt = opt;
					console.warn(req.resId + ': failed.', data);
					clutil.mediator.trigger('onTicker', data);
					fileUploadView.trigger('fail', data);
				});
			});

			return fileUploadView;
		},

		_eof: 'clutil.View.*//'
	});

});

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

//////////////////////////////////////////////////////////////////
// Datepicker.js プラグインに独自メソッド追加
(function () {
	var dpPROP_NAME = 'Datepicker';

	if (!$.datepicker) {
		console.warn('Datepicker not found.');
		return;
	}

	/**
	 * Datepicker に８ケタ日付を設定する。yyyyMMdd 引数を省略した場合はクリアに相当。
	 * 使い方: $elem.datepicker('setIymd', yyyyMMdd)
	 */
	$.datepicker['_setIymd' + dpPROP_NAME] = function (target, iymd) {
		console.log('_setIymd' + dpPROP_NAME);

		var $dp = $(target).val('');
		var $dpWrap = $dp.closest('.datepicker_wrap');

		// クリア
		$dpWrap.removeClass("dayOfWeek0 dayOfWeek1 dayOfWeek2 dayOfWeek3 dayOfWeek4 dayOfWeek5 dayOfWeek6");

		if (iymd == null || iymd == undefined || iymd <= 0) {
			// テキストを空欄にする。
			$dp.datepicker('setDate', null);
			return;
		}
		var fixDate = clutil.ymd2date(iymd);
		if (!_.isDate(fixDate) || isNaN(fixDate)) {
			console.warn('datepicker.setIymd: bad iymd[' + iymd + ']');
			return;
		}

		$dp.datepicker('setDate', fixDate);
		$dpWrap.addClass('dayOfWeek' + fixDate.getDay());
	};

	/**
	 * Datepicker 表示をリフレッシュする。
	 * 使い方: $elem.datepicker('refresh')
	 */
	$.datepicker['_refresh' + dpPROP_NAME] = function (target) {
		var $target = $(target);
		var iymd = -1;
		var val = $target.val();
		if (!_.isEmpty(val)) {
			var date = new Date(val);
			if (_.isDate(date) || !isNaN(date.getMilliseconds())) {
				// valid date format
				var iymd = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
			}
		}

		console.log('_refresh' + dpPROP_NAME + ': iymd[' + iymd + '], reflesh');

		$target.datepicker('setIymd', iymd);
	};
}());
////////////////////////////////////////////////////////////////
//jQuery ui-autocomplete プラグインに独自メソッド追加
(function () {

	if (!$.widget) {
		console.warn('$.widget: not available.');
		return;
	}
	if (!$.ui || !$.ui.autocomplete) {
		console.warn('$.ui: not available.');
		return;
	}

	$.widget('ui.autocomplete', $.ui.autocomplete, {
		_renderMenu: function (ul, items) {
			var maxItems = this.options.maxItems || Infinity;
			var i, len;
			for (i = 0, len = items.length; i < len && i < maxItems; i++) {
				this._renderItemData(ul, items[i]);
			}
			if (maxItems !== Infinity && len > maxItems) {
				ul.append('<li class="cl-ac-more"><span>&#183;&#183;&#183;</span></li>');
			}
		},

		_renderItem: function (ul, item) {
			var li = $("<li>")
				.append($("<a>").text(item.label))
				.appendTo(ul);
			if (this.selectedItem && item.id == this.selectedItem.id) {
				li.addClass('selected');
			}
			return li;
		},

		_resizeMenu: function () {
			var ul = this.menu.element;
			if (this.options.resizeMenu) {
				this.options.resizeMenu.call(this, ul);
			} else {
				this._superApply(arguments);
			}
		},

		_isClAutocomplete: function () {
			return $(this.element).hasClass('cl_autocomplete');
		},
		_clItem2LabelText: function (item) {
			if (_.isFunction(this.options.getLabel)) {
				var labelText = this.options.getLabel(item);
				return (_.isEmpty(labelText)) ? '' : labelText.toString();
			}
			if (_.isString(this.options.getLabel)) {
				return (item) ? item[this.options.getLabel] : '';
			}

			var cn = [];
			if (item) {
				var keys = (_.isArray(this.options.getLabel))
					? this.options.getLabel : ['code', 'name'];
				for (var i = 0; i < keys.length; i++) {
					var val = item[keys[i]];
					if (!_.isEmpty(val)) {
						cn.push(val);
					}
				}
			}
			return cn.join(':');
		},
		_getInputTextValue: function () {
			var $elem = $(this.element);
			var val = $elem.val();
			return (val) ? val : '';
		},
		_getClItem: function (opt) {
			// empty check
			var valLabel = this._getInputTextValue();
			var data = undefined;
			if (valLabel == '') {
				this._clClear(opt);
			} else {
				data = this.selectedItem;//$(this.element).data('cl_autocomplete_item');
			}
			return data;
		},
		_setClItem: function (item, keepinputval) {
			if (item && item._mismatch) {
				// グリッドで未確定時の入力をクリアしないため
				keepinputval = true;
			}
			var $this_element = $(this.element);

			var label = this._clItem2LabelText(item);
			var fixLabel = (keepinputval) ? $this_element.val() : label;
			var fixItem = item;
			if (label.length > 0 && item && item.id) {
				fixItem = (item.label && item.value) ? item : _.extend({ label: label, value: label }, item);
				$this_element.val(fixLabel);
			} else {
				this._clClear({ keepinputval: keepinputval });
			}
			this.selectedItem = fixItem;
		},
		_clClear: function (opt) {
			var $el = $(this.element);
			var val = (opt && opt.keepinputval) ? $el.val() : '';
			$el.val(val);
			this.selectedItem = null;
		},
		/**
		 * 独自拡張した autocomplete 要素かどうか判定
		 * 要素にクラス 'cl_autocomplete' が付いているかどうかで判定するロジックで実装。
		 */
		isClAutocomplete: function () {
			return this._isClAutocomplete();
		},
		/**
		 * 独自拡張上の内部オブジェクトを get or set する。
		 * 引数が無い場合は get、引数つきの場合は set 扱い。
		 */
		clAutocompleteItem: function () {
			if (!this._isClAutocomplete()) {
				return;
			}
			if (arguments.length === 0) {
				// get
				var item = this._getClItem();
				return item ? item : null;
			} else {
				// set: data-cl_autocomplete_item に保持しつつ、ラベル表示を設定する。
				this._setClItem(arguments[0], arguments[1]);
			}
		},
		/**
		 * 独自拡張上の内部設定値を削除する。
		 */
		removeClAutocompleteItem: function () {
			if (!this._isClAutocomplete()) {
				return false;
			}
			this._setClItem();
		},
		/**
		 * 正しい設定状態かどうか検査する。未設定は正とみなす。
		 * 使用用途は、表示名が選択肢から選ばれたものなのかどうかを判定するのに利用することを想定。
		 * 表示ラベルと内部設定オブジェクトとの整合性を検査する。
		 * @returns true:正常、false:不整合 or 独自拡張モンじゃない
		 */
		isValidClAutocompleteSelect: function () {
			console.log('cl_autocomplete: isValidClAutocompleteSelect');
			// cl_no_autocomplete_checkの場合オートコンプリートチェックしない
			if ($(this.element).hasClass('cl_no_autocomplete_check')) {
				return true;
			}
			if (!this._isClAutocomplete()) {
				return false;
			}
			var item = this._getClItem();
			var label = this._clItem2LabelText(item);
			var valLabel = this._getInputTextValue();

			var isValid = ((label == valLabel) && (!item || item.id));
			if (!isValid) {
				this._clClear({ keepinputval: true });
			}
			return isValid;
		},

		_clselect: function (e, ui) {
			//console.log('^^^^^^^^^^^_clselect', ui);
			var api = $(e.target).data('uiAutocomplete');
			if (!api) return;
			api.clAutocompleteItem(ui ? ui.item : null, 1/* keepinputval */);
			// clAutocompleteItemの呼び出しでapi.selectedItemが変更され
			// ている可能性があるからuiを更新する。
			var newUi = { item: api.selectedItem };
			if (_.isFunction(api.user_select)) {
				api.user_select.call(this, e, newUi);
			}
			api._trigger('clchange', e, newUi);
		},

		_clchange: function (e, ui) {
			//console.log('^^^^^^^^^^^_clchange', ui);
			var api = $(e.target).data('uiAutocomplete');
			api.clAutocompleteItem(ui ? ui.item : null, 1/* keepinputval */);
			var newUi = { item: api.selectedItem };
			if (_.isFunction(api.user_change)) {
				api.user_change.apply(this, arguments);
				api.user_select.call(this, e, newUi);
			}
			api._trigger('clchange', e, newUi);
		},

		_create: function () {
			this.user_select = this.options.select;
			this.user_change = this.options.change;
			if (!this.options.disableClChange) {
				this.options.select = this._clselect;
				this.options.change = this._clchange;
			}

			this._super();
			this._clAutocompleteInit();
			var that = this;
			this.options.response = function (e, ui) {
				that.lastcontent = ui.content;
				console.log('^^^^ ac', 'lastcontent changed', ui.content);
			};
		},

		/**
		 * cl_autocomplete 初期化
		 */
		_clAutocompleteInit: function () {
			var $el = $(this.element);
			if ($el.hasClass('cl_autocomplete')) {
				return;
			}
			$el.addClass('cl_autocomplete');

			// $el を wrap して、オートコンプリート識別アイコンを挿入
			if (!this.options.noAutoFillIcon) {
				$el.wrap('<div class="cl_autocomplete_wrap">').parent()
					// クラス cl_autocomplete_wrap で、styel2.css でスタイル定義した。
					//					.css({
					//						float: 'left',
					//						position: 'relative'
					//					})
					.prepend('<span class="autofill"></span>');
			}

			// keydown イベント
			// Enter キー押下時に候補要素が１個の場合は、その１個を選択する
			var that = this;
			$el.keydown(function (e) {
				var keyCode = $.ui.keyCode,
					keyEvents = e;
				if (!(e.keyCode == keyCode.ENTER ||
					e.keyCode == keyCode.NUMPAD_ENTER ||
					e.keyCode == keyCode.TAB)) {
					// ENTERとTAB キー以外は興味なし
					return;
				}
				console.log('cl_autocomplete: keydown[ENTER]', that.selectedItem);

				var value = that._value();

				if (value.length < that.options.minLength) {
					// 入力値が短かい場合は興味なし
					if (that.term !== that._value()) {
						that._clClear({ keepinputval: true });
						console.log('^^^^', 9.01);
					}
					console.log('^^^^', 9.02);
					return;
				}

				// 以降の検索を中止する
				clearTimeout(that.searching);

				var count = 1;

				if (that.pending) {
					// 検索中
					if (that.term === that._value()) {
						console.log('^^^^', 0.11);
						// 何もしない
					} else {
						console.log('^^^^', 0.12);
						// 再検索必要
						count += 1;
						that.search(null, {});
					}
					//that.term が信用できないので再検索 TODO
				} else if (that.clAutocompleteItem() &&
					that.term === that._value()) {
					console.log('^^^^', 0.2);
					// 既に検索済
				} else {
					console.log('^^^^', 0.3);
					// 再検索必要
					that.search(null, {});
				}

				var $target = $(e.target);
				var api = $target.data('uiAutocomplete');

				console.log('^^^^', 1);
				if (that.pending) {
					// 検索中のとき
					console.log('^^^^', 3);
					that.options.prevResponse = that.options.response;
					that.options.response = _.after(count, _.once(function (e, ui) {
						var content = ui.content;
						console.log('^^^^', 4, content);
						if (content && content.length === 1) {
							console.log('^^^^', 5);
							api._setClItem(content[0]);
						} else {
							api._clClear({ keepinputval: true });
						}
						clutil.focus2(keyEvents);
						clutil.mediator.trigger('validation:require', $el);
						that.options.response = that.options.prevResponse;
					}));
				} else {
					// 既に検索済
					var item = that.clAutocompleteItem();
					console.log('^^^^', 2.5, that.lastcontent, item);
					if (that.lastcontent && that.lastcontent.length === 1) {
						console.log('^^^^', 9.1);
						api._setClItem(that.lastcontent[0]);
					} else if (item) {
						console.log('^^^^', 9.2);
						api._setClItem(item);
					} else {
						console.log('^^^^', 9.3);
						api._clClear({ keepinputval: true });
					}
					clutil.focus2(keyEvents);
					clutil.mediator.trigger('validation:require', $el);
				}

				console.log('^^^^', 20);
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
			});

			/*
			 * TODO: change イベントを発信するためのしくみ【検討】
			 * １）<input type=["text"]> に対して 'change' イベントを監視すると、
			 * 		候補選択肢のサブメニューから選択した場合に change イベントが発生しない。
			 * ２）そもそもが、autocomplete プラグインの change イベントを利用するべきだが、
			 * 		<input type=["text"]> 表示内容と内部選択アイテムが異なると齟齬が起きるので、
			 * 		独自拡張で data('cl_autocomplete_item') キーに有効なアイテムを持つようにしている。
			 * ３）data('cl_autocomplete_item') 選択の変更をもって、'change' イベントを
			 * 		発生するようにしたら、autocomplete 本来の 'change' イベントとぶつかるので、
			 * 		'cl_change' としておくが、そこまでやる必要あるのかな？？？
			 */

			// change イベントが飛ばない措置（その１）
			// focus イベントで選択アイテムを憶えておく。
			$el.focus(function (e) {
				var api = $(e.target).data('uiAutocomplete');
				api.cl_previous = api._getClItem({ keepinputval: true });
			});

			// change イベントが飛ばない措置（その２）
			// blur イベントで focus 時のものと異なっていれば cl_change イベントを出す。
			$el.blur(function (e) {
				var api = $(e.target).data('uiAutocomplete');
				var cl_item = api._getClItem({ keepinputval: true });
				var prev_item = null;
				if (api.cl_previous) {
					prev_item = _.pick(api.cl_previous, 'label', 'value', 'id', 'code', 'name');
				}
				if (cl_item) {
					cl_item = _.pick(cl_item, 'label', 'value', 'id', 'code', 'name');
				}
				if (!_.isEqual(prev_item, cl_item)) {
					$el.trigger('cl_change');
				}
			});
		}
	});

}());

// bootstrap-selectをAOKライクに変更
(function () {
	if (!$.fn.selectpicker) return;

	$.fn.selectpicker.defaults.style = "btn-input btn-info";
	$.fn.selectpicker.defaults.liveSearch = true;
	$.fn.selectpicker.defaults.noneSelectedText = '';
}());

(function ($) {
	var instanceCount = 0;

	var ESC_NBSP = $('<span>&nbsp;</span>').text();

	$(document)
		.on('focusin', '.combobox-wrap', function (e) {
			var $cw = $(e.currentTarget),
				$input = $cw.find('.combobox-input');
			if (!$input.is('[readonly]')) {
				$cw.find('button').css('border', '2px solid #1e9ce6');
			}
		})
		.on('focusout', '.combobox-wrap ', function (e) {
			var $cw = $(e.currentTarget);
			$cw.find('button').css('border', '');
		});


	$.widget("custom.combobox", {
		_create: function () {
			if (instanceCount++ === 0) {
				$('body').append('<div id="ca_comboboxMenuWrap"></div>');
			}
			_.defaults(this.options, $.fn.combobox.defaults);
			this.element.addClass('_clcombobox').hide();
			this.$dropdown = this._createDropdown();
			this.$dropdown.insertAfter(this.element);
			this._bindUIElement();
			this._createAutocomplete();
			this._createShowAllButton();
			this._setStyle();
			this.setWidth(this.options.width);
			this.refresh();

			this.element.attr('debug', _.uniqueId());
			// console.log('**** _create', this.element.attr('debug'));
		},

		_bindUIElement: function () {
			this.$input = this.$dropdown.find('input');
			this.$button = this.$dropdown.find('button');
		},

		_createDropdown: function () {
			var $drop = $('<div class="btn-group combobox-wrap">' +
				'<input type="text" class="form-control combobox-input cl_no_autocomplete_check ">' +
				'<button type="button" tabindex="-1" class="btn btn-input btn-info combobox-btn">' +
				'<!-- <span class="filter-option pull-left">&nbsp;</span>&nbsp; -->' +
				'<span class="caret"></span>' +
				'</button>' +
				'</div>');
			return $drop;
		},

		_setStyle: function () {
			this.$button.addClass(
				this.element.attr('class')
					.replace(/_clcombobox|cl[_a-z0-9A-Z]+/gi, ''));
		},

		setWidth: function (width) {
			var $button = this.$dropdown.find('button');
			var $input = this.$dropdown.find('input');
			if (width == 'auto') {
				var $buttonClone = $button.clone().appendTo('body');
				var w = parseInt($buttonClone.css('width')) || 0;
				$input.css('width', Math.max(60, w - 40));
				$buttonClone.remove();
			} else if (width) {
				$button.css('width', width);
				$input.css('width', Math.max(60, width - 40));
			}
		},

		_createAutocomplete: function () {
			var $button = this.$dropdown.find('button');
			this.$input
				.autocomplete({
					disableClChange: true,
					noAutoFillIcon: true,
					delay: 0,
					minLength: 0,
					source: $.proxy(this, "_source"),
					getLabel: function (item) {
						return item && item.label || '';
					},
					appendTo: this.options.appendTo || '#ca_comboboxMenuWrap',
					position: {
						my: "left top",
						at: "left bottom",
						collision: "none",
						of: this.$dropdown
					},
					resizeMenu: function (ul) {
						ul.outerWidth(Math.max(
							// Firefox wraps long text (possibly a rounding bug)
							// so we add 1px to avoid the wrapping (#7513)
							ul.width("").outerWidth() + 1,
							$button.outerWidth()
						));
					}
				});

			this._on(this.$input, {
				autocompleteselect: function (event, ui) {
					// console.log('**** autocomplete select', ui.item);
					ui.item.option.selected = true;
					this._trigger("select", event, {
						item: ui.item.option
					});
					this._triggerIfChanged(ui.item);
					clutil.mediator.trigger('validation:require', this.element);
				},

				autocompletechange: "_removeIfInvalid"
			});
		},

		_createShowAllButton: function () {
			var input = this.$input,
				wasOpen = false;

			if (this.options.noButton) {
				this.$button.find('.caret').remove();
				return;
			}
			this.$button
				.mousedown(function () {
					wasOpen = input.autocomplete("widget").is(":visible");
				})
				.click(function () {
					input.focus();

					// Close if already visible
					if (wasOpen) {
						return;
					}

					// Pass empty string as value to search for, displaying all results
					input.autocomplete("search", "");
				});
		},

		_optionToData: function (option) {
			if (!option) return null;

			var text = $(option).text();
			if (option.value == '0' && text === ESC_NBSP) {
				text = '';
			}
			return {
				id: option.value,
				label: text,
				value: text,
				option: option
			};
		},

		_source: function (request, response) {
			var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
			var that = this;
			response(this.element.children("option").map(function () {
				var data = that._optionToData(this);
				if (data.id && (!request.term || matcher.test(data.value))) {
					return data;
				}
			}));
		},

		_removeIfInvalid: function (event, ui) {
			// console.log('**** autocomplete change', ui.item);
			var item = ui.item;
			var val = this.$input.val();
			this._refreshSelected(ui.item, true, !item && !val);
			clutil.mediator.trigger('validation:require', this.element);
		},

		_triggerIfChanged: function (item) {
			var id = item && item.id;
			if (this._previousId != id) {
				this.element.trigger('change');
			}
			this._previousId = id;
		},

		_destroy: function () {
			// console.log('**** destroy', this.element.attr('debug'));
			this.element.removeClass('_clcombobox');
			this.$dropdown.remove();
			this.element.show();
		},

		_refreshSelected: function (_item, triggerChange, empty) {
			var items = this.items,
				prevVal = this.val(),
				value = _item && _item.id || prevVal,
				item;
			if (empty) {
				// 空のときは最初を選択する
				item = items[0];
				value = item && item.id;
			} else {
				for (var i = 0, l = items.length; i < l; i++) {
					if (value == items[i].id) {
						item = items[i];
						break;
					}
				}
			}
			if (item) {
				this.$input.autocomplete('clAutocompleteItem', item);
			}
			if (prevVal != value) {
				this.element.val(value);
			}
			if (triggerChange) {
				this._triggerIfChanged(item);
			} else {
				this._previousId = value;
			}
		},

		_refreshState: function () {
			var disabled = this.element.prop('disabled');
			this.setEnable(!disabled);
		},

		refresh: function () {
			var that = this;
			this._refreshState();
			this.items = this.element.children("option").map(function () {
				var data = that._optionToData(this);
				if (data.id) {
					return data;
				}
			});
			this._refreshSelected();
			return this;
		},

		setEnable: function (sw) {
			if (arguments.length === 0 || sw) {
				this.element
					.prop('disabled', false)

					.next('.combobox-wrap')
					.removeClass('disabled')

					.find('.combobox-input')
					.attr('readonly', false)
					.end()

					.find('.combobox-btn')
					.prop('disabled', false)
					.end();
			} else {
				this.element
					.prop('disabled', true)

					.next('.combobox-wrap')
					.addClass('disabled')

					.find('.combobox-input')
					.attr('readonly', true)
					.end()

					.find('.combobox-btn')
					.prop('disabled', true)
					.end();
			}
		},

		val: function (value) {
			if (arguments.length) {
				this.element.val(value);
				this._refreshSelected();
			} else {
				var selected = this.element.children('option:selected');
				if (!selected.length) {
					selected = this.element.children('option:first');
				}
				var val = selected.val();
				return val === undefined ? null : val;
			}
			return this;
		},

		open: function () {
			var input = this.$input;
			input.focus();

			// Pass empty string as value to search for, displaying all results
			input.autocomplete("search", "");
		}
	});

	$.fn.combobox.defaults = {
		width: 'auto',
		select: function (e) {
			// console.log('**** comboboxselect');
		}
	};

	var _selectpicker;
	var callold = function (target, args) {
		var ret;
		$.fn.selectpicker = $.fn.bootstrapSelect;
		try {
			ret = $.fn.selectpicker.apply(target, args);
		} catch (e) { }
		$.fn.selectpicker = _selectpicker;
		return ret;
	};

	window.useSelectpicker2 = function () {
		$.fn.bootstrapSelect = $.fn.selectpicker;
		_selectpicker = $.fn.selectpicker = function (option, event) {
			// console.log('**** selectpicker', option, event, this.attr('debug'));
			//get the args of the outer function..
			var ret, args = arguments;
			var value;
			var multiple = option && option.multiple;
			if (multiple) {
				return callold(this, [option, event]);
			} else {
				var target = this.filter('[multiple]');
				if (target.length) {
					value = callold(target, args);
				}
				target = this.filter(':not([multiple])');
				if (target.length) {
					try {
						value = $.fn.combobox.apply(target, args);
					} catch (e) {
						console.error(e.stack);
					}
				}
			}
			if (value !== undefined) {
				return value;
			} else {
				return this;
			}
		};
	};

})(jQuery);

// perfectscrollbar のデフォルト設定変更 - { wheelPropagation: true }
(function () {
	if (!$.fn.perfectScrollbar) return;

	var origFunc = $.fn.perfectScrollbar;
	$.fn.perfectScrollbar = function () {
		var argArray = _.map(arguments, function (x) { return x; });
		if (argArray.length === 0) {
			argArray.push({ wheelPropagation: true });
		} else if (_.isObject(argArray[0])) {
			_.defaults(argArray[0], { wheelPropagation: true });
		}
		return origFunc.apply(this, argArray);
	}
}());

/**
 * ORIGINAL dialog.js - clutil extension.
 */
(function (exports) {
	/**
	 * ダイアログチューニングパラメタ
	 */
	var Config = {
		/**
		 * キャンセルクリックイベントを発生させる要素セレクタ
		 * '.modalBK' を含めると、ダイアログ外領域のクリックで閉じるようにできる。
		 */
		cancelClickSelector: '.close, .cl_cancel',	//'.close, .modalBK, .cl_cancel',
		/**
		 * ＯＫクリックイベントを発生させる要素セレクタ
		 */
		okClickSelector: '.cl_ok'
	};
	/**
	 * 確認ダイアログ
	 * msg: 表示するメッセージ
	 * okcallback: ok押下時のcallback関数
	 * cancelcallback: cancel,close押下時のcallback関数
	 * obj: ok押下時に渡したいオブジェクト
	 * $dialog_area: ダイアログ表示エリアのオブジェクト デフォルトはcl_dialog_area
	 */
	exports.ConfirmDialog = function (msg, okcallback, cancelcallback, obj, $dialog_area) {
		var $dialogArea = $dialog_area == null ? $('#cl_dialog_area') : $dialog_area;
		var html_source = "";
		html_source += '<div class="modal wd1">';
		html_source += '<div class="modalBody">';
		html_source += '<div class="msg txtPrimary"></div>';
		html_source += '<div class="btnBox">';
		html_source += '<button class="btn btn-default wt280 mrgr20 cl_cancel">キャンセル</button>';
		html_source += '<button class="btn btn-primary wt280 cl_ok">はい</button>';
		html_source += '</div>';
		html_source += '</div>';
		html_source += '<div class="modalBK"></div>';
		html_source += '</div>';

		$dialogArea.html(html_source);
		$dialogArea.find('.msg.txtPrimary').html(msg);

		var $wn = $dialogArea.find('.wd1');
		var $modalBody = $wn.find('.modalBody');
		var mW = $modalBody.innerWidth() / 2;
		var mH = $modalBody.innerHeight() / 2;
		$modalBody.css({ 'margin-left': -mW, 'margin-top': -mH });
		var $body = $("body").toggleClass("dialogIsOpen");

		// Enterキーによるフォーカスをする。
		clutil.leaveEnterFocusMode();
		clutil.enterFocusMode({
			view: $dialogArea
		});

		// キャンセルボタンにフォーカス
		$('.cl_cancel').focus();

		// キャンセル、閉じるボタン
		$(Config.cancelClickSelector).click(function () {
			$wn.fadeOut(500, function () {
				$dialogArea.empty();
				$body.toggleClass("dialogIsOpen");
				clutil.leaveEnterFocusMode();
				clutil.enterFocusMode();
				if (cancelcallback != null) {
					cancelcallback(obj);
				}
			});
		});
		// はいボタン
		$(Config.okClickSelector).click(function () {
			$wn.fadeOut(500, function () {
				$dialogArea.empty();
				$body.toggleClass("dialogIsOpen");
				clutil.leaveEnterFocusMode();
				clutil.enterFocusMode();
				if (okcallback != null) {
					okcallback(obj);
				}
			});
		});
	};

	/**
	 * エラーダイアログ
	 * msg: 表示するメッセージ
	 * okcallback: ok押下時のcallback関数
	 */
	exports.ErrorDialog = function (msg, okcallback, obj, $dialog_area) {
		clutil.showDialog(msg, okcallback, 'wd2', 'txtDanger', obj, $dialog_area);
	};
	/**
	 * ワーニングダイアログ
	 * msg: 表示するメッセージ
	 * okcallback: ok押下時のcallback関数
	 */
	exports.WarningDialog = function (msg, okcallback, obj, $dialog_area) {
		clutil.showDialog(msg, okcallback, 'wd3', 'txtWarning', obj, $dialog_area);
	};
	/**
	 * インフォメーションダイアログ
	 * msg: 表示するメッセージ
	 * okcallback: ok押下時のcallback関数
	 */
	exports.MessageDialog = function (msg, okcallback, obj, $dialog_area) {
		clutil.showDialog(msg, okcallback, 'wd4', 'txtInfo', obj, $dialog_area);
	};
	/**
	 * インフォメーションダイアログ
	 * msg: 表示するメッセージ
	 * okcallback: ok押下時のcallback関数
	 */
	exports.MessageDialog2 = function (msg, okcallback, obj, $dialog_area) {
		clutil.showDialog2(msg, okcallback, 'wd5', 'txtPrimary', obj, $dialog_area, 3000);
	};
	exports.MessageDialogShort = function (msg, okcallback, obj, $dialog_area) {
		clutil.showDialog2(msg, okcallback, 'wd5', 'txtPrimary', obj, $dialog_area, 500);
	};

	/**
	 * 用途に合わせたダイアログを表示する
	 * msg: 表示するメッセージ
	 * okcallback: ok押下時のcallback関数
	 * wnclass: ダイアログのクラス
	 * $dialog_area: ダイアログ表示エリアのオブジェクト デフォルトはcl_dialog_area
	 */
	exports.showDialog2 = function (msg, okcallback, wnclass, txtclass, obj, $dialog_area, millisec) {
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
		$msgBody.css({ 'margin-left': -mW, 'margin-top': -mH });
		var $body = $("body").toggleClass("dialogIsOpen");

		setTimeout(function () {
			$wn.fadeOut(500, function () {
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
	exports.showDialog = function (msg, okcallback, wnclass, txtclass, obj, $dialog_area) {
		var $dialogArea = $dialog_area == null ? $('#cl_dialog_area') : $dialog_area;
		var html_source = "";
		html_source += '<div class="modal ' + ((wnclass == null) ? '' : wnclass) + '">';
		html_source += '<div class="modalBody">';
		html_source += '<div class="msg myDialogContent ' + ((txtclass == null) ? '' : txtclass) + '"></div>';
		html_source += '<div class="btnBox">';
		html_source += '<button class="btn btn-info wt280 cl_ok">確認</button>';
		html_source += '</div>';
		html_source += '</div>';
		html_source += '<div class="modalBK"></div>';
		html_source += '</div>';

		$dialogArea.html(html_source);
		$dialogArea.find('.myDialogContent').html(msg);

		var $wn = $dialogArea.find('.modal');//$('.' + wnclass);
		var $modalBody = $wn.find('.modalBody');
		var mW = $modalBody.innerWidth() / 2;
		var mH = $modalBody.innerHeight() / 2;
		$modalBody.css({ 'margin-left': -mW, 'margin-top': -mH });
		var $body = $("body").toggleClass("dialogIsOpen");

		// Enterキーによるフォーカスをする。
		clutil.leaveEnterFocusMode();
		clutil.enterFocusMode({
			view: $dialogArea
		});

		// OKボタンにフォーカス
		$('.cl_ok').focus();

		// キャンセル、閉じるボタン
		$(Config.cancelClickSelector).click(function () {
			$wn.fadeOut(500, function () {
				$dialogArea.empty();
				$body.toggleClass("dialogIsOpen");
				clutil.leaveEnterFocusMode();
				clutil.enterFocusMode();
				if (okcallback != null) {
					okcallback(obj);
				}
			});
		});
		// はいボタン
		$(Config.okClickSelector).click(function () {
			$wn.fadeOut(500, function () {
				$dialogArea.empty();
				$body.toggleClass("dialogIsOpen");
				clutil.leaveEnterFocusMode();
				clutil.enterFocusMode();
				if (okcallback != null) {
					okcallback(obj);
				}
			});
		});
	};


	/**
	 * 削除確認ダイアログ
	 */
	exports.delConfirmDialog = function (okcallback, cancelcallback, obj, $dialog_area) {
		clutil.ConfirmDialog(clmsg.cl_rtype_del_confirm_chk, okcallback, cancelcallback, obj, $dialog_area);
	};

	/**
	 * 削除完了ダイアログ
	 */
	exports.delMessageDialog = function (okcallback, obj, $dialog_area) {
		clutil.MessageDialog(clmsg.cl_rtype_del_confirm, okcallback, obj, $dialog_area);
	};

	/**
	 * 更新確認ダイアログ
	 */
	exports.updConfirmDialog = function (okcallback, cancelcallback, obj, $dialog_area) {
		clutil.ConfirmDialog(clmsg.cl_rtype_upd_confirm_chk, okcallback, cancelcallback, obj, $dialog_area);
	};

	/**
	 * 更新完了ダイアログ
	 */
	exports.updMessageDialog = function (okcallback, obj, $dialog_area) {
		var arg;
		if (arguments.length === 1 && !_.isFunction(arguments[0])) {
			arg = _.defaults(arguments[0], {
				message: clmsg.cl_rtype_upd_confirm
			});
		} else {
			arg = {
				message: clmsg.cl_rtype_upd_confirm,
				okCallback: okcallback,
				okCallbackArg: obj,
				$dialog_area: $dialog_area
			};
		}
		//clutil.MessageDialog(arg.message, arg.okCallback, arg.okCallbackArg, arg.$dialog_area);
		clutil.MessageDialog2(arg.message, arg.okCallback, arg.okCallbackArg, arg.$dialog_area);
	};
	exports.updMessageDialogShort = function (okcallback, obj, $dialog_area) {
		var arg;
		if (arguments.length === 1 && !_.isFunction(arguments[0])) {
			arg = _.defaults(arguments[0], {
				message: clmsg.cl_rtype_upd_confirm
			});
		} else {
			arg = {
				message: clmsg.cl_rtype_upd_confirm,
				okCallback: okcallback,
				okCallbackArg: obj,
				$dialog_area: $dialog_area
			};
		}
		//clutil.MessageDialog(arg.message, arg.okCallback, arg.okCallbackArg, arg.$dialog_area);
		clutil.MessageDialogShort(arg.message, arg.okCallback, arg.okCallbackArg, arg.$dialog_area);
	};

	/**
	 * 削除取消確認ダイアログ
	 */
	exports.delCancelConfirmDialog = function (okcallback, cancelcallback, obj, $dialog_area) {
		clutil.ConfirmDialog(clmsg.cl_rtype_delcancel_confirm_chk, okcallback, cancelcallback, obj, $dialog_area);
	};

	/**
	 * 削除取消完了ダイアログ
	 */
	exports.delCancelMessageDialog = function (okcallback, obj, $dialog_area) {
		clutil.MessageDialog(clmsg.cl_rtype_delcancel_confirm, okcallback, obj, $dialog_area);
	};


}(clutil));

/**
 * ORIGINAL FileAttachTable.js - clutil extension.
 */
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
		//		'<td><a target="_blank" href="<%- uri %>"><%- filename %></a></td>' +
		'<td><a target="_blank" file-id="<%- id %>" file-uri="<%- uri %>" class="cl_filedownld"><%- filename %></a></td>' +
		'</tr>'
	);

	//	function adjustPosition(cursor) {
	//		var input, wrapper,
	//		wrapperX, wrapperY,
	//		inputWidth, inputHeight,
	//		cursorX, cursorY,
	//		moveInputX, moveInputY;
	//
	//		// This wrapper element (the button surround this file input)
	//		wrapper = $(this);
	//		// The invisible file input element
	//		input = wrapper.find("input[type=file]");
	//		// The left-most position of the wrapper
	//		wrapperX = wrapper.offset().left;
	//		// The top-most position of the wrapper
	//		wrapperY = wrapper.offset().top;
	//		// The with of the browsers input field
	//		inputWidth= input.width();
	//		// The height of the browsers input field
	//		inputHeight= input.height();
	//		//The position of the cursor in the wrapper
	//		cursorX = cursor.pageX;
	//		cursorY = cursor.pageY;
	//
	//		//The positions we are to move the invisible file input
	//		// The 20 at the end is an arbitrary number of pixels that we can shift the input such that cursor is not pointing at the end of the Browse button but somewhere nearer the middle
	//		moveInputX = cursorX - wrapperX - inputWidth + 20;
	//		// Slides the invisible input Browse button to be positioned middle under the cursor
	//		moveInputY = cursorY- wrapperY - (inputHeight/2);
	//
	//		// Apply the positioning styles to actually move the invisible file input
	//		input.css({
	//			left:moveInputX,
	//			top:moveInputY
	//		});
	//	}

	// input type='file'をaタグでwrapする
	function wrapInputElement($elem, $button) {
		var input = $('<div>').append($elem.eq(0).clone()).html();
		// $button.before(
		//   '<a class="file-input-wrapper ' + $button.attr('class') + '"></a>'
		// ).hide();
		var href = 'javascript:void(0)';//'';//'#';
		$button.before(
			'<a href="' + href + '" class="file-input-wrapper ' + $button.attr('class') + '">' +
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
		url: clcom.uploadDestUri,	// '/system/api/am_cm_fileupload',

		events: {
			'click input[type=file]': function (e) {
				return this.beforeShowFileChooser();
			},
			'change input[type=file]': 'inputChanged',
			'click .cl-file-delete': 'deleteClicked',
			'mousemove .file-input-wrapper': '_adjustPosition',
			'keydown .file-input-wrapper': function (e) {
				if (e.keyCode === 13 && this.beforeShowFileChooser()) {
					this.$('input[type=file]').trigger('click');//focus();//
				}
			}
		},

		// <a> タグ内のmousemove で、内部の input[type=file] がストーキングするおまじない。
		_adjustPosition: function (cursor) {
			var input, wrapper,
				wrapperX, wrapperY,
				inputWidth, inputHeight,
				cursorX, cursorY,
				moveInputX, moveInputY;

			// This wrapper element (the button surround this file input)
			wrapper = $(cursor.target);//$(this);
			// The invisible file input element
			input = wrapper.find("input[type=file]");
			// The left-most position of the wrapper
			wrapperX = wrapper.offset().left;
			// The top-most position of the wrapper
			wrapperY = wrapper.offset().top;
			// The with of the browsers input field
			inputWidth = input.width();
			// The height of the browsers input field
			inputHeight = input.height();
			//The position of the cursor in the wrapper
			cursorX = cursor.pageX;
			cursorY = cursor.pageY;

			//The positions we are to move the invisible file input
			// The 20 at the end is an arbitrary number of pixels that we can shift the input such that cursor is not pointing at the end of the Browse button but somewhere nearer the middle
			moveInputX = cursorX - wrapperX - inputWidth + 20;
			// Slides the invisible input Browse button to be positioned middle under the cursor
			moveInputY = cursorY - wrapperY - (inputHeight / 2);

			// Apply the positioning styles to actually move the invisible file input
			input.css({
				left: moveInputX,
				top: moveInputY
			});
		},

		beforeShowFileChooser: function () {
			if (!_.isFunction(this.options.beforeShowFileChooser)) {
				return true;
			}
			// 明示的に false を返さないと、キャンセル扱いにしない。
			return this.options.beforeShowFileChooser() !== false;
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
			//			this.$('.file-input-wrapper').mousemove(adjustPosition);
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
		//			'<a target="_blank" href="<%- uri %>"><%- filename %></a>'
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

				$('.cl_filedownld').click(function (e) {
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
			this.$el.html(this.tableTemplate({ headerFileName: options.headerFileName || '添付ファイル' }));
			this.listenTo(this.collection, 'add', this.addOne);
			this.listenTo(this.collection, 'reset', this.addAll);
			this.listenTo(this.collection, 'remove', this.addAll);
			this.addAll();
		},

		serializeData: function (model) {
			var serialized = _.extend(model.toJSON(), {
				no: model.collection.indexOf(model) + 1,
				cid: model.cid,
				checked: model.checked ? 'checked' : ''
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
			model.set({ checked: $input.is(':checked') });
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
				beforeShowFileChooser: options.beforeShowFileChooser,
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

(function ($) {

	// コンボボックスの選択値
	var dispSelect = null;
	var methods = {
		init: function (options) {
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
				isselect: true,	// コンボ表示フラグ defaultは表示（互換用） ⇒ MD 版では itemsOnPageSelection で指定
				itemsOnPageSelection: null,
				//cssStyle: 'light-theme',
				onPageClickBefore: function (pageNumber, itemsOnPage, cancel) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				},
				onSelectChange: function (itemsOnPage, cancel) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				},
				onPageClick: function (pageNumber, itemsOnPage) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				},
				onSelectChange: function (itemsOnPage) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				},
				onInit: function () {
					// Callback triggered immediately after initialization
				},
				displaypanel: 'displaypanel'
			}, options || {});

			var self = this;

			o.pages = o.pages ? o.pages : Math.ceil(o.items / o.itemsOnPage) ? Math.ceil(o.items / o.itemsOnPage) : 1;
			o.currentPage = o.currentPage - 1;
			o.halfDisplayed = o.displayedPages / 2;

			this.each(function () {
				self.addClass(o.cssStyle).data('pagination', o);
				methods._draw.call(self);
			});

			o.onInit();

			return this;
		},

		selectPage: function (page) {
			methods._selectPage.call(this, page - 1);
			return this;
		},

		prevPage: function () {
			var o = this.data('pagination');
			if (o.currentPage > 0) {
				methods._selectPage.call(this, o.currentPage - 1);
			}
			return this;
		},

		nextPage: function () {
			var o = this.data('pagination');
			if (o.currentPage < o.pages - 1) {
				methods._selectPage.call(this, o.currentPage + 1);
			}
			return this;
		},

		destroy: function () {
			this.empty();
			return this;
		},

		redraw: function () {
			methods._draw.call(this);
			return this;
		},

		disable: function () {
			var o = this.data('pagination');
			o.disabled = true;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		},

		enable: function () {
			var o = this.data('pagination');
			o.disabled = false;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		},

		_draw: function () {
			var self = this, options, $link, o = self.data('pagination');
			var $panel = this,
				o = $panel.data('pagination'),
				interval = methods._getInterval(o),
				i;

			methods.destroy.call(this);

			// o.itemsOnPage 補正
			{
				if ($.isArray(o.itemsOnPageSelection) && o.itemsOnPageSelection.length > 0) {
					var fixItemsOnPage = null;
					for (i = 0; i < o.itemsOnPageSelection.length; i++) {
						if (o.itemsOnPage === o.itemsOnPageSelection[i]) {
							fixItemsOnPage = o.itemsOnPageSelection[i];
						}
					}
					if (fixItemsOnPage === null) {
						fixItemsOnPage = o.itemsOnPageSelection[0];
					}
					o.itemsOnPage = fixItemsOnPage;
				} else if (o.isselect) {
					// 旧 I/F 互換用。
					o.itemsOnPageSelection = [10, 25, 100];
					switch (o.itemsOnPage) {
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
				if (o.displaypanel instanceof Object) {
					dp = o.displaypanel;
				} else {
					dp = $('#' + o.displaypanel).empty();
				}

				// 選択されている表示件数には<a>タグはつけない
				var makenum = function (n) {
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
				if ($.isArray(o.itemsOnPageSelection) && o.itemsOnPageSelection.length > 0) {
					str += '<div class="viewnum">'
						+ '<p class="group">表示件数：';
					for (i = 0; i < o.itemsOnPageSelection.length; i++) {
						str += makenum(o.itemsOnPageSelection[i]);
					}
					str += '</p>'
						+ '</div>';
				}
				dp.empty().append(str);

				dp.find('span.pagination_select').removeClass('selected');
				dp.find('span.pagination_select[num=' + o.itemsOnPage + ']').addClass('selected');
				dp.find('span.pagination_select').click(function (e) {
					var num = parseInt($(e.target).closest('span.pagination_select').attr('num'));
					var ev = {
						itemsOnPage: num,
						cancel: function () {
							this._cancel = true;
							return this.commit;
						},
						commit: function () {
							o.itemsOnPage = num;
						}
					};
					o.onSelectChangeBefore(ev);
					console.log("select: " + num, 'cancel: ', ev._cancel);
					if (ev._cancel) return this;

					ev.commit();
					o.onSelectChange(num);

					return this;
					//処理を記述する
				});
			}

			// Generate Prev link
			if (o.prevText) {
				methods._appendItem.call(this, o.currentPage - 1, { text: o.prevText, classes: 'previous', a_class: 'fui-arrow-left' });
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
				methods._appendItem.call(this, o.currentPage + 1, { text: o.nextText, classes: 'next', a_class: 'fui-arrow-right' });
			}

		},

		_getInterval: function (o) {
			return {
				start: Math.ceil(o.currentPage > o.halfDisplayed ? Math.max(Math.min(o.currentPage - o.halfDisplayed, (o.pages - o.displayedPages)), 0) : 0),
				end: Math.ceil(o.currentPage > o.halfDisplayed ? Math.min(o.currentPage + o.halfDisplayed, o.pages) : Math.min(o.displayedPages, o.pages))
			};
		},

		_appendItem: function (pageIndex, opts) {
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
				$link = $('<li><a class="page ' + (options.a_class) + '">' + (options.text) + '</a></li>');
				//
				$link.click(function () {
					methods._selectPage.call(self, pageIndex);
				});
			}

			if (options.classes) {
				$link.addClass(options.classes);
			}

			self.append($link);
		},

		_selectPage: function (pageIndex) {
			var that = this, o = this.data('pagination');
			var ev = {
				pageIndex: pageIndex + 1,
				itemsOnPage: o.itemsOnPage,
				cancel: function () {
					this._cancel = true;
					return this.commit;
				},
				_cancel: false,
				commit: function () {
					var o = that.data('pagination');
					o.currentPage = pageIndex;
				}
			};
			o.onPageClickBefore(ev);
			if (ev._cancel) {
				return;
			}
			ev.commit();
			o.onPageClick(pageIndex + 1, o.itemsOnPage);
		}

	};

	$.fn.pagination = function (method) {

		// Method calling logic
		if (methods[method] && method.charAt(0) != '_') {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.pagination');
		}

	};

})(jQuery);

/**
 * ORIGINAL - clstart.js
 */
jQuery.ajaxSetup({
	//	timeout: 3 * 60 * 1000		// タイムアウト3分
	timeout: 10 * 60 * 1000		// タイムアウト10分
});

(function () {
	// cltxtFieldLimitへのイベントのとりまわし
	clutil.mediator.on({
		// data2view時にカウンターを更新
		'data2view:done': function () {
			clutil.mediator.trigger('cltxtFieldLimit:requireUpdateRemain');
		}
	});

	$.inputlimiter.vent.on({
		// inputlimiterの入力制限時にカウンターを更新
		'inputlimiter:change': function () {
			clutil.mediator.trigger('cltxtFieldLimit:requireUpdateRemain');
		}
	});
}());

$(function () {
	var kinsokuRegxp = new RegExp("[" + clcom.kinsokuTable + "]", "g");
	var errorTemplate = _.template(
		'禁則文字が入力されたため、以下の文字は削除されました。\n\n' +
		'<%= it.errors.join("、") %>', null, { variable: 'it' });
	$(document).on('blur', 'input[type=text],textarea', function (e) {
		try {
			var $input = $(e.currentTarget);
			var value = $input.val();
			if (!value) return;
			var msg, hasError, errors = {};
			value = value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function (err) {
				hasError = true;
				errors[err] = 1;
				return '';
			});

			value = value.replace(kinsokuRegxp, function (err) {
				hasError = true;
				errors[err] = 1;
				return '';
			});

			if (hasError) {
				msg = errorTemplate({ errors: _.keys(errors) });
				$input.val(value);
				$input.trigger('change');
				alert(msg);
			}
		} catch (err) {
			console.error(err);
		}
	});
});

$(function () {
	// 共通の入力制限を設定する：
	// 1. 4バイトなunicode文字の入力を制限する
	// 2. 禁則文字表による制限を行う
	/* 10/24 禁則チェックもinputlimiterで処理しない
	$.inputlimiter.setCommonLimiters(
		$.inputlimiter.Limiters.noSurrogatePair(),
		$.inputlimiter.Limiters.kinsoku(clcom.kinsokuTable)
	);
	 */
	// 入力制限の開始をする!
	$.inputlimiter.start();
});

(function () {
	clutil.permcntl.getReadonlySwitcher().setHandlers({
		// MDBaseView フッタナビ部
		'#mainColumnFooter .cl_submit': {
			off: function ($el) {
				$el.removeAttr('disabled').parent().removeClass('disable');
			},
			on: function ($el) {
				$el.attr('disabled', 'disabled').parent().addClass('disable');
			},
			check: function ($el) {
				return $el.parent().hasClass('disable');
			}
		},
		// MDBaseView ダウンロードボタン
		'#mainColumnFooter .cl_download': {
			off: function ($el) {
				$el.removeAttr('disabled').parent().removeClass('disable');
			},
			on: function ($el) {
				$el.attr('disabled', 'disabled').parent().addClass('disable');
			},
			check: function ($el) {
				return $el.parent().hasClass('disable');
			}
		},
		// 「＋新規追加」ボタン
		'a#cl_new': {
			off: function ($el) {
				$el.removeAttr('disabled');
			},
			on: function ($el) {
				$el.attr('disabled', true);
			},
			check: function ($el) {
				return $el.attr('disabled') == 'disabled';
			}
		}
	});
}());

// bootstrap-selctのプルダウンのボタンにフォーカス時にENTERでプルダウン
// をオープンするのでなく次のフィールドに移動する。
$(document).on('keydown', '.selectpicker.dropdown-toggle', function (e) {
	if (e.which === 13 || e.which === 108) {
		e.preventDefault();
	}
});

/**
 * 開発用設定 cldev
 *
 * LocalStorageに以下のキーで設定して、clcomのふるまいを設定できる(開発用)
 *
 * 設定値一覧
 * - cldev.noConfirmOnReload
 * リロード時に確認ダイアログを表示しない
 * - cldev.errOnGoHome
 * エラーでポータルに飛ばない
 * @module cldev
 */
(function (clcom) {
	var store = window.store;
	var prefix = 'cldev.';
	var key, value;

	key = prefix + 'noConfirmOnReload';
	value = store.get(key);
	if (value) {
		clcom._preventConfirm = true;
	}

	key = prefix + 'errOnGoHome';
	value = store.get(key);
	if (value === false) {
		clcom._preventGoHome = true;
	}

	// ------------------------------------------------------------------------
	// テスト用スタイルの設定
	TestStyleCtrl = {
		testHosts: [
			'172.30.214.97',	// 情シス環境#1
			'172.30.214.101',	// 情シス環境#2
			'172.30.214.107',	// 情シス環境#3
			'172.23.35.30',		// AWS検証環境#1
			'mds.mdsd.e-aoki.com',	// AWS検証環境#1
			'172.23.35.28',		// AWS検証環境#2
			'172.23.35.29',		// AWS検証環境#3
			'172.23.35.12',		// AWS検証環境#4
			'mdsystemst.aoki',	//
			'127.0.0.1',		// 個人開発環境
			'10.1.9.61',		// aoki-md.suri.co.jp
			'10.1.3.171', 		// aokmd.suri.co.jp
			'10.1.3.175',		// aokmd01.suri.co.jp
			'10.1.3.176',		// aokmd98.suri.co.jp
			'10.1.3.177'		// aokmd99.suri.co.jp
		],
		isTestHost: function (hostname) {
			return _.find(this.testHosts, function (hostname) { return hostname == location.hostname; });
		},
		doApply: function () {
			var testCSS = '<link media="screen" rel="stylesheet" type="text/css" href="/css/test.css">';
			$('head > link[rel="stylesheet"][href$="\/css\/style.css"]').after(testCSS);
		}
	};
	if (TestStyleCtrl.isTestHost(location.hostname)) {
		TestStyleCtrl.doApply();
	}
	// ------------------------------------------------------------------------

}(clcom));
