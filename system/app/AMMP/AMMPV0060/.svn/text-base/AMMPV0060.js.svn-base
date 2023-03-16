$.inputlimiter.noTrim = true;
useSelectpicker2();

var MyApp;
(function(){
	MyApp = new Marionette.Application();

	var ResizeWatcher = function(options){
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

	_.extend(ResizeWatcher.prototype, Backbone.Events, {
		resize: function(){
			var outerHeight = this.$container.height() - this.$mainFooter.height();
			var offset = this.$el.offset();
			var height = outerHeight - offset.top + this.adjustHeight;
			var width = this.$el.width();
			// console.log(outerHeight, height);
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

	function getTooltipValue(value) {
		if (value == null) return '';
		value = value.substring(11);
		return value;
	}

	ClGrid.Formatters.defaultFormatter = function(value) {
		if (value == null) return '';
		return value;
	};

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


	ClGrid.Formatters.link = (function(){
		var template = ClGrid.buildTemplate(
			'<a class="clgr-link" href="<%- _.result(it, "url") %>">' +
				'<%- _.result(it, "label") %>' +
				'</a>'
		);

		var link = function(value, options){
			value = value.substring(0, 10);
			return template({
				url: options.cellType.url,
				label: value
			});
		};

		link.initialize = function(grid, dataView, vent){
			grid.onClick.subscribe(function(e, args){
				var $target = $(e.target);
				if($target.hasClass("clgr-link")){
					e.preventDefault();
					var ev = ClGrid.Formatters.buildEvent(args, grid, dataView);
					vent.trigger("formatter:link:click", ev);
				}
			});
		};

		return link;
	}());

	var Behaviors = {};

	Marionette.Behaviors.behaviorsLookup = function(){
		return Behaviors;
	};

	Behaviors.Grid = Marionette.Behavior.extend({
		ui: {
			dataGrid: '.dataGrid'
		},

		onShow: function(){
			var columns = this.view.getColumns();
			// 空の場合はグリッドは表示しない
			if (_.isEmpty(columns)) return;

			var dataGrid = this.view.dataGrid = new ClGrid.ClAppGridView(this.options.gridViewOptions);

			this.resizeWatcher = new ResizeWatcher({
				$el: this.view.dataGrid.$el
			});
			this.listenTo(this.resizeWatcher, 'resize', function(){
				this.view.dataGrid.grid.resizeCanvas();
			});

			if (_.isFunction(this.view.getMetadata)){
				dataGrid.getMetadata = this.view.getMetadata;
			}
			if (_.isFunction(this.view.getHeadMetadata)){
				dataGrid.getHeadMetadata = this.view.getHeadMetadata;
			}
			this.view.listenTo(dataGrid, this.view.gridEvents);

			this.ui.dataGrid.html(dataGrid.render().el);

			var setDataOptions = {};

			_.extend(setDataOptions, {
				columns: columns,
				data: this.view.loadGridData(),
				gridOptions: _.extend({}, this.options.gridOptions),
				colhdMetadatas: this.options.colhdMetadatas
			});

			dataGrid.setData(setDataOptions);
		},

		onClose: function(){
			console.log('#### onClose');
			this.resizeWatcher.stop();
		}
	});

	// テーブルつき
	var GridView = Marionette.ItemView.extend({
		template: '#GridView',

		behaviors: {
			Grid: {
				gridViewOptions: {
					attributes: {
						style: 'height: 500px;'
					}
				},

				gridOptions: {
					autoHeight: false,
					frozenColumn: 2
				},

				colhdMetadatas: [
					{
						columns: {
							seasonID: {
								name: 'シーズン'
							},
							1: {
								name: '部門'
							},
							2: {
								name: '品種'
							},
							3: {
								name: '商品属性<br>計画'
							},
							4: {
								name: '商品属性別<br>サイズ計画'
							},
							5: {
								name: '品番別<br>計画'
							},
							6: {
								name: '品番別<br>サイズ計画'
							},
							7: {
								name: '週別商品<br>属性別計画'
							},
							8: {
								name: '店舗別商品<br>属性別計画'
							},
							9: {
								name: '月別店舗別<br>商品属性別<br>計画'
							},
							10: {
								name: '品番別支持率<br>計画策定'
							}
						}
					}
				]
			}
		},

		getHeadMetadata: function(row){
			return {
				cssClasses: 'row' + row
			};
		},

		gridEvents: {
			'formatter:link:click': function(ev){
				var item = ev.item, cellType = ev.column.cellType,
					getReq = MyApp.srchData.AMMPV0060GetReq;
				if (cellType.linkClick){
					ev.data = {
						srchUnitID: getReq.srchUnitID,
						srchYear: getReq.srchYear,
						srchSeasonID: item.seasonID,
						srchItgrpID: item.itgrpCodeName
					};
					cellType.linkClick(ev);
				}
			}
		},

		isValid: function() {
			if (!this.dataGrid.getData().length){
				// 空のとき
			}
			if (!this.dataGrid.isValid()){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return false;
			}
			return true;
		},

		loadGridData: function(){
			return MyApp.data.AMMPV0060GetRsp.paramRecord;
		},

		getColumns: function(){
			var columns = [];

			columns = columns.concat(
				[
					{
						// name: 'シーズン',
						width: 75,
						id: 'seasonID',
						field: 'seasonID',
						cellType: {
							formatter: 'cltypeselector',
							editorOptions: {
								kind: amcm_type.AMCM_TYPE_SUBSEASON,
								nameOnly: true
							}
						}
					},
					{
						//name: '部門',
						width: 120,
						field: 'divCodeName',
						cellType: {
							formatter: 'codename'
						},
						cellMetadata: function(args){
							var value = args.item.itgrpCodeName;
							var data = {};
							if (value && value.id) {
								data.cellMessage = {
									message: ClGrid.Formatters.codename(value),
									level: 'info'
								};
							}
							return data;
						}
					},
					{
						//name: '品種',
						width: 140,
						field: 'itgrpCodeName',
						cellType: {
							formatter: 'codename'
						},
						cellMetadata: function(args){
							var value = args.item.itgrpCodeName;
							var data = {};
							if (value && value.id) {
								data.cellMessage = {
									message: ClGrid.Formatters.codename(value),
									level: 'info'
								};
							}
							return data;
						}
					},
					{
						//name: '商品属性計画',
						width: 100,
						field: 'attrPlanInfo',
						cellType: {
							formatter: 'link',
							linkClick: function(ev){
								clcom.pushPage({
									url: '../AMMPV0021/AMMPV0021.html',
									args: ev.data,
									newWindow: true
								});
							}
						},
						cellMetadata: function(args){
							var value = args.item.attrPlanInfo;
							var data = {};
							if (value == '未'){
								data.cssClasses = 'errorCell';
							} else {
								value = getTooltipValue(value);
								data.cellMessage = {message: value, level: 'info'};
							}
							return data;
						}
					},
					{
						//name: '商品属性別サイズ計画',
						field: 'attrSizePlanInfo',
						width: 100,
						cellType: {
							formatter: 'link',
							linkClick: function(ev){
								clcom.pushPage({
									url: '../AMMPV0021/AMMPV0021.html',
									args: ev.data,
									newWindow: true
								});
							}
						},
						cellMetadata: function(args){
							var value = args.item.attrSizePlanInfo;
							var data = {};
							if (value == '未'){
								data.cssClasses = 'errorCell';
							} else {
								value = getTooltipValue(value);
								data.cellMessage = {message: value, level: 'info'};
							}
							return data;
						}
					},
					{
						//name: '品番別計画',
						field: 'itemPlanInfo',
						width: 100,
						cellType: {
							formatter: 'link',
							linkClick: function(ev){
								clcom.pushPage({
									url: '../AMMPV0030/AMMPV0030.html',
									args: ev.data,
									newWindow: true
								});
							}
						},
						cellMetadata: function(args){
							var value = args.item.itemPlanInfo;
							var data = {};
							if (value == '未'){
								data.cssClasses = 'errorCell';
							} else {
								value = getTooltipValue(value);
								data.cellMessage = {message: value, level: 'info'};
							}
							return data;
						}
					},
					{
						//name: '品番別サイズ計画',
						field: 'itemSizePlanInfo',
						width: 100,
						cellType: {
							formatter: 'link',
							linkClick: function(ev){
								clcom.pushPage({
									url: '../AMMPV0030/AMMPV0030.html',
									args: ev.data,
									newWindow: true
								});
							}
						},
						cellMetadata: function(args){
							var value = args.item.itemSizePlanInfo;
							var data = {};
							if (value == '未'){
								data.cssClasses = 'errorCell';
							} else {
								value = getTooltipValue(value);
								data.cellMessage = {message: value, level: 'info'};
							}
							return data;
						}
					},
					{
						//name: '週別商品属性別計画',
						field: 'weekAttrPlanInfo',
						width: 100,
						cellType: {
							formatter: 'link',
							linkClick: function(ev){
								clcom.pushPage({
									url: '../AMMPV0040/AMMPV0040.html',
									args: ev.data,
									newWindow: true
								});
							}
						},
						cellMetadata: function(args){
							var value = args.item.weekAttrPlanInfo;
							var data = {};
							if (value == '未'){
								data.cssClasses = 'errorCell';
							} else {
								value = getTooltipValue(value);
								data.cellMessage = {message: value, level: 'info'};
							}
							return data;
						}
					},
					{
						//name: '店舗別商品属性別計画',
						width: 100,
						field: 'storeAttrPlanInfo',
						cellType: {
							formatter: 'link',
							linkClick: function(ev){
								clcom.pushPage({
									url: '../AMMPV0040/AMMPV0040.html',
									args: ev.data,
									newWindow: true
								});
							}
						},
						cellMetadata: function(args){
							var value = args.item.storeAttrPlanInfo;
							var data = {};
							if (value == '未'){
								data.cssClasses = 'errorCell';
							} else {
								value = getTooltipValue(value);
								data.cellMessage = {message: value, level: 'info'};
							}
							return data;
						}
					},
					{
						width: 100,
						// name: '月別店舗別商品属性別計画',
						field: 'monthStoreAttrPlanInfo',
						cellType: {
							formatter: 'link',
							linkClick: function(ev){
								clcom.pushPage({
									url: '../AMMPV0040/AMMPV0040.html',
									args: ev.data,
									newWindow: true
								});
							}
						},
						cellMetadata: function(args){
							var value = args.item.monthStoreAttrPlanInfo;
							var data = {};
							if (value == '未'){
								data.cssClasses = 'errorCell';
							} else {
								value = getTooltipValue(value);
								data.cellMessage = {message: value, level: 'info'};
							}
							return data;
						}
					},
					{
						width: 100,
						//name: '品番別支持率計画策定',
						field: 'digestPlanInfo',
						cellType: {
							formatter: 'link',
							linkClick: function(ev){
								clcom.pushPage({
									url: '../AMMPV0050/AMMPV0050.html',
									args: ev.data,
									newWindow: true
								});
							}
						},
						cellMetadata: function(args){
							var value = args.item.digestPlanInfo;
							var data = {};
							if (value == '未'){
								data.cssClasses = 'errorCell';
							} else {
								value = getTooltipValue(value);
								data.cellMessage = {message: value, level: 'info'};
							}
							return data;
						}
					}
				]);
			return columns;
		}
	});

	var ResultView = Marionette.Layout.extend({
		template: '#ResultView',

		regions: {
			gridView: '#gridView'
		},

		onShow: function(){
			this.gridView.show(new GridView({
			}));
		}
	});

	var SrchCondView = Marionette.Layout.extend({
		template: '#SrchCondView',

		events: {
			'click #search': function(){
				this.search();
			},
			// 検索条件を再指定ボタン押下
			'click #searchAgain': function(){
				MyApp.srchAreaCtrl.show_srch();
			}
		},

		ui: {
			searchArea: '#searchArea',
			srchYear: '#ca_srchYear'
		},

		initialize: function(){
			_.bindAll(this);

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		onShow: function(){
			clutil.initUIelement(this.$el);

			var ope_date = clcom.getOpeDate();
			var year = Math.floor(ope_date / 10000);
			var month = Math.floor((ope_date/100)%100);
			if (month < 4) {
				year--;
			}

			clutil.clyearselector({
				el: this.ui.srchYear,
				past: clutil.getclsysparam('PAR_AMCM_YEAR_FROM'),
				future: clutil.getclsysparam('PAR_AMCM_YEAR_TO'),
				value: year,
				argtext: '年度'
			});

			this.relation = clutil.FieldRelation.create('default', {
				clbusunitselector: {
					el: '#ca_srchUnitID'
				},

				clvarietycode: {
					el: '#ca_srchItgrpID'
				},

				cltypeselector: {
					el: '#ca_srchSeasonID',
					kind: amcm_type.AMCM_TYPE_PLAN_SEASON
				},

				clitemattrgrpfuncselector: {
					el: '#ca_srchAttrDef1ID'
				},

				clitemattrselector: {
					el: '#ca_srchAttr1ID',
					dependSrc: {
						iagfunc_id: 'itemattrgrpfunc_id'
					}
				}
			});
			var view = this;
			this.relation.done(function(){
				view.resetFocus();
			});
		},

		isValid: function(){
			var valid = this.validator.valid();
			return valid;
		},

		search: function(){
			if (!this.isValid()){
				return;
			}
			var getReq = clutil.view2data(this.ui.searchArea);
			var data = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},

				AMMPV0060GetReq: getReq
			};

			this.srchData = data;
			clutil.postJSON({
				resId: 'AMMPV0060',
				data: data
			})
				.done(this.onSearchSuccess)
				.fail(this.onSearchFail);
		},

		onSearchSuccess: function(data){
			MyApp.srchData = this.srchData;
			MyApp.data = data;
			MyApp.srchAreaCtrl.show_result();
			Controller.showResultView();
		},

		onSearchFail: function(data){
			MyApp.resultView.close();
			MyApp.srchAreaCtrl.show_srch();
			clutil.mediator.trigger('onTicker', data);	// エラーメッセージを通知。
			this.resetFocus();
		},

		resetFocus: function(){
			clutil.focus({view: this.$el});
		}
	});


	var Controller = {
		start: function(){
			_.bindAll(this);

			MyApp.addRegions({
				srchCondView: '#srchCondView',
				resultView: '#resultView'
			});

			MyApp.unit_id = Number(clcom.userInfo.unit_id);
			// 共通ビュー(共通のヘッダなど内包）
			MyApp.mdBaseView = new clutil.View.MDBaseView({
				title: '品種別計画進捗確認',
				opeTypeId: -1
			});
			MyApp.mdBaseView.initUIElement();
			MyApp.mdBaseView.render();

			MyApp.srchCondView.show(new SrchCondView());

			// 検索条件を再指定ボタンを隠す
			MyApp.srchAreaCtrl = clutil.controlSrchArea(
				$('#searchArea'),
				$('#ca_srch'),	// 検索条件領域
				$('#resultView'),				// 検索結果表示領域
				$('#searchAgain'));			// 検索条件を開く部品
		},

		getSrchCondView: function(){
			return MyApp.srchCondView.currentView;
		},

		getResultView: function(){
			return MyApp.resultView.currentView;
		},

		showResultView: function(){
			MyApp.resultView.show(new ResultView());
		}
	};

	MyApp.addInitializer(Controller.start);

	$(function(){
		// Enterキーによるフォーカスをする。
		clutil.enterFocusMode();

		//--------------------------------------------------------------
		// 初期データ取得
		clutil.getIniJSON().done(function(){
			MyApp.start();
		}).fail(function(data){
			console.error('iniJSON failed.');
			// clcom のネタ取得に失敗。
			// 動かしようがないので、Abort 扱いとしておく？？？
			clutil.View.doAbort({
				messages: [
					//'初期データ取得に失敗しました。'
					clutil.getclmsg('cl_ini_failed')
				],
				rspHead: data.rspHead
			});
		});
	});

	MyApp.on('dlFail', function(data){
		clutil.mediator.trigger('onTicker', data);
	});
}());
