(function(){
	var slice = Array.prototype.slice;

	_.partial = function(func) {
		var boundArgs = slice.call(arguments, 1);
		return function() {
			var position = 0;
			var args = boundArgs.slice();
			for (var i = 0, length = args.length; i < length; i++) {
				if (args[i] === _) args[i] = arguments[position++];
			}
			while (position < arguments.length) args.push(arguments[position++]);
			return func.apply(this, args);
		};
	};

	Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate){
		return _.template(rawTemplate, null, {variable: 'it'});
	};
}());

var MyApp = new Marionette.Application();

MyApp.ResizeWatcher = function(options){
	this.options = options;
	_.defaults(options, {
		minHeight: 250
	});
	this.$el = options.$el;
	this.$container = $('#container');
	this.$mainFooter = $('#mainColumnFooter');
	this.adjustHeight = options.adjustHeight == null ? -20 : options.adjustHeight;
	this.setSize = _.debounce(this.setSize, 100);
	this.start();
};

_.extend(MyApp.ResizeWatcher.prototype, Backbone.Events, {
	resize: function(){
		var outerHeight = this.$container.height() - this.$mainFooter.height();
		var offset = this.$el.offset();
		var height = outerHeight - offset.top + this.adjustHeight;
		var width = this.$el.width();
		if (this.previousHeight != height ||
			this.previousWidth != width) {
			this.setSize({
				height: height,
				width: width
			});				
		}
	},

	setSize: function(size){
		this.$el.height(Math.max(size.height, this.options.minHeight));
		this.trigger('resize');
		this.previousHeight = size.height;
		this.previousWidth = size.width;
	},
	
	start: function(){
		var that = this;
		this.tid = setInterval(function(){
			that.resize();
		}, 200);
	},

	stop: function(){
		if (this.tid){
			clearTimeout(this.tid);
		}
	}
});

MyApp._modified = false;
MyApp._modifiedList = {};

MyApp.on('modified:change', function(name, isModified){
	MyApp._modifiedList[name] = isModified;
	MyApp._modified = _.some(MyApp._modifiedList, function(isModified){
		return isModified;
	});
	MyApp.mdBaseView.options.confirmLeaving = MyApp._modified;
});
MyApp.resetModified = function(){
	MyApp._modified = false;
	MyApp._modifiedList = {};
	MyApp.mdBaseView.options.confirmLeaving = MyApp._modified;
};
MyApp.confirmWhenModified = function(callback, context){
	if (MyApp.mdBaseView.options.confirmLeaving) {
		clutil.ConfirmDialog(
			'登録が完了していません。変更が失われますがよろしいですか？',
			_.bind(callback, context));
		MyApp.resetModified();
	} else {
		callback.call(context);
	}
};

MyApp.setModifiedMarkTab = function($tab, isModified){
	$tab.find(' > .changeInside').remove();
	
	if (isModified){
		$tab.prepend('<span class="changeInside">変更あり</span>');
	}
};

MyApp._Behaviors =  {};

MyApp._Behaviors.CheckModified = Marionette.Behavior.extend({
	/**
	 * 変更前のデータを設定する
	 */
	onRequireSavePreviousData: function(){
		this.previousData = _.map(this.getData(), function(rec){
			return _.clone(rec);
		});
		this.view.triggerMethod('modified:change', false);
		MyApp.triggerMethod('modified:change', this.options.name, false);
	},
	
	onRequireModifiedCheck: function(){
		var isModified = this.isModified();
		this.view.triggerMethod('modified:change', isModified);
		MyApp.triggerMethod('modified:change', this.options.name, isModified);
	},

	_isModifiedRow: function(prev, curr){
		var numberFields = this.options.numberFields;
		if (_.isFunction(numberFields)){
			numberFields = numberFields();
		}
		return _.some(numberFields, function(field){
			var pv = Number(prev[field]),
				cv = Number(curr[field]);
			return pv !== cv;
		});
	},
	
	isModified: function(){
		var prev = this.previousData;
		var curr = this.getData();
		
		if (prev.length !== curr.length) return true;
		
		var isChanged;
		
		isChanged = _.some(prev, function(p, i){
			return this._isModifiedRow(p, curr[i]);
		}, this);				
		
		return isChanged;
	},

	getData: function(){
		return this.view.dataGrid.getData();
	}
});


MyApp._Behaviors.Grid = Marionette.Behavior.extend({
	ui: {
		dataGrid: '.dataGrid'
	},

	onShow: function(){
		var columns = this.view.getColumns();
		// 空の場合はグリッドは表示しない
		if (_.isEmpty(columns)) return;
		
		var dataGrid = this.view.dataGrid = new ClGrid.ClAppGridView(this.options.gridViewOptions);
		this.resizeWatcher = new MyApp.ResizeWatcher({
			$el: this.view.dataGrid.$el
		});
		this.listenTo(this.resizeWatcher, 'resize', function(){
			this.view.dataGrid.grid.resizeCanvas();
		});
		
		if (_.isFunction(this.view.getHeadMetadata)){
			dataGrid.getHeadMetadata = this.view.getHeadMetadata;
		}

		this.view.listenTo(dataGrid, this.view.gridEvents);
		
		this.ui.dataGrid.html(dataGrid.render().el);

		this.onUpdateData();

		this.view.triggerMethod('require:save:previous:data');
	},

	onUpdateData: function(data, columns, options){
		if (!columns)
			columns = this.view.getColumns();

		var colhdMetadatas;
		if (_.isFunction(this.view.colhdMetadatas)){
			colhdMetadatas = this.view.colhdMetadatas(columns);
		}
		var setDataOptions = {};

		if (!data)
			data = this.view.loadGridData();
		
		_.extend(setDataOptions, {
			columns: columns,
			data: data,
			gridOptions: _.extend({}, this.options.gridOptions),
			colhdMetadatas: colhdMetadatas
		}, options);
		
		this.view.dataGrid.setData(setDataOptions);

		if (this.options.setMaxWidth){
			var maxWidth = MyApp.getCanvasWidth(this.view.dataGrid.grid);
			this.ui.dataGrid.css('max-width', maxWidth);
		}
	},
	
	onDomRefresh: function(){
		if (this.view.dataGrid){
			this.view.dataGrid.grid.resizeCanvas();
		}
	},

	onClose: function(){
		console.log('#### onClose');
		this.resizeWatcher.stop();
	}
});

// 計画をアップロードする
MyApp._Behaviors.Uptake = Marionette.Behavior.extend({
	ui: {
		// 計画をアップロードする
		uptake: '.ca_uptake'
	},

	initialize: function(){
		_.bindAll(this, 'buildCSVInputReqFunction');
	},
	
	onShow: function(){
		var inputControllerOptions = _.extend({
			btn: this.ui.uptake,
			buildCSVInputReqFunction: this.buildCSVInputReqFunction,
			fileUploadViewOpts: this.options.fileUploadViewOpts
		}, this.options.inputControllerOptions);
		this.uptakeCtrl = clutil.View.OpeCSVInputController(inputControllerOptions);
		this.listenTo(this.uptakeCtrl, {
			done: function(data){
				this.triggerMethod('uptake:done', data);
				this.view.triggerMethod('uptake:done', data);
			},
			
			fail: function(data){
				if (data.rspHead.uri){
					//CSVダウンロード実行
					clutil.download(data.rspHead.uri);	
				}
			}
		});
	}
});

// グリッド更新を行う
MyApp._Behaviors.Update = Marionette.Behavior.extend({
	ui: {
		edit: '.ca_edit'
	},

	initialize: function(){
		_.bindAll(this, 'onUpdSuccess', 'onUpdFail');
	},
	
	events: {
		'click @ui.edit': function(){
			if (!this.view.isValid()){
				return;
			}
			var data = this.options.getData.call(this);
			
			clutil.postJSON(data)
				.done(this.onUpdSuccess)
				.fail(this.onUpdFail);
		}
	},

	getData: function(){
	},
	
	onUpdSuccess: function(){
		this.view.triggerMethod('update:success');
		clutil.updMessageDialog();
	},
	
	onUpdFail: function(data){
		this.view.triggerMethod('update:fail');
		clutil.mediator.trigger('onTicker', data);
	}
});

MyApp.getLastVersion = function(versions){
	var lastRec = MyApp.getLastVersionRec(versions);
	return lastRec && lastRec.version;
};

MyApp.getLastVersionRec = function(versions){
	var lastVersion = -Infinity;
	var lastRec; 
	_.each(versions, function(rec){
		if (lastVersion < rec.version) {
			lastVersion = rec.version;
			lastRec = rec;
		}
	});
	return lastRec;
};

var VersionView = MyApp.VersionView = Marionette.ItemView.extend({
	template: '#VersionView',
	
	events: {
		'click .planLink': function(e){
			var cid = $(e.currentTarget).closest('tr').attr('id');
			var model = this.collection.get(cid);
			var options = _.clone(this.options);
			options.version = function(){
				return model.get('version');
			};
			MyApp.download(options);
		}
	},
	
	templateHelpers: function(){
		return {
			collection: this.collection,
			title: this.options.title
		};
	}
});

(function(){
	// 自動按分計画(基準計画)ダウンロードする
	MyApp._Behaviors.DlBasicPlan = Marionette.Behavior.extend({
		ui: {
			// 基準計画ダウンロード
			dlBasicPlan: '.ca_dlBasicPlan,.planAutoLink',
			planAutoMore: '.planAutoMore'
		},

		defaults: {
			planType: AMMPV0020Req.AMMPV0020_PLAN_AUTO
		},
		
		events: {
			'click @ui.dlBasicPlan': function(){
				MyApp.download(this.options);
			},
			'click @ui.planAutoMore': function(){
				var versionRecs = this.view.getVersionRecs('auto');
				var options = _.clone(this.options);
				options.collection = new Backbone.Collection(versionRecs);
				options.title = '自動按分計画バージョン一覧';
				var versionView = new VersionView(options);
				MyApp.showDialog(versionView);
			}
		}
	});
	
	// 取込計画(最新計画)ダウンロードする
	MyApp._Behaviors.DlNewPlan = Marionette.Behavior.extend({
		ui: {
			// 最新計画ダウンロード
			dlNewPlan: '.ca_dlNewPlan,.planInputLink',
			planInputMore: '.planInputMore'
		},
		
		defaults: {
			planType: AMMPV0020Req.AMMPV0020_PLAN_INPUT
		},
		
		events: {
			'click @ui.dlNewPlan': function(){
				MyApp.download(this.options);
			},
			'click @ui.planInputMore': function(){
				var versionRecs = this.view.getVersionRecs('input');
				var options = _.clone(this.options);
				options.collection = new Backbone.Collection(versionRecs);
				options.title = '取込計画バージョン一覧';
				var versionView = new VersionView(options);
				// var maxHeight = Math.max($(window).height() - 200, 200);
				// versionView.$('.table-body').css('max-height', maxHeight);
				MyApp.showDialog(versionView);
			}
		}
	});
}());


MyApp.measureScrollbar = function() {
    var $c = $("<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo("body");
    var dim = {
        width: $c.width() - $c[0].clientWidth,
        height: $c.height() - $c[0].clientHeight
    };
    $c.remove();
    return dim;
};

MyApp.getCanvasWidth = function(grid){
	return _.reduce(
		grid.getCanvases().filter('.grid-canvas-top'),
		function(n, el){return n + $(el).width()});
};

MyApp.showDialog = function(view) {
	view.render();
	clutil.ConfirmDialog(view.el, function(){
		view.remove();
	});
	var $modalBody = view.$el.closest('.modalBody');
	$modalBody.find('>.msg').removeClass('msg').removeClass('txtPrimary');
	var btnBox = $modalBody.find('.btnBox');
	var height = view.$el.height() + btnBox.outerHeight();
	var maxHeight = $(window).height() - btnBox.outerHeight();
	height = Math.min(maxHeight, height);
	view.$el.css('max-height', maxHeight);
	$modalBody.css('margin-top', -height / 2);
	$modalBody.height(_.reduce($modalBody.find('>*'), function(h, e){
		return $(e).outerHeight() + h;
	}, 0));
	$('.cl_dialog .cl_cancel').remove();
	$('.cl_dialog .cl_ok').text('閉じる');
};


$(function(){
	$('body').tooltip('destroy');
	
	$('body').tooltip({
		// trueだとsetTimeoutなどを利用するためか動作が不安定になる
		html: true,
		animation: false,
		selector: '[data-message],[data-cl-errmsg]',
		title: function () {
			var msg = $(this).attr('data-cl-errmsg');
			if (msg)
				return msg;
			return $(this).attr('data-message');
		},
		position: 'right',
		container: 'body'
	});
});
