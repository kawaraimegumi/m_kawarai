$.inputlimiter.noTrim = true;
useSelectpicker2();

(function(MyApp, AMMPV0050Req){
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

	var Behaviors = {};

	Marionette.Behaviors.behaviorsLookup = function(){
		return Behaviors;
	};

	_.extend(Behaviors, MyApp._Behaviors);

	// 計画をアップロードする
	Behaviors.Uptake = Behaviors.Uptake.extend({
		buildCSVInputReqFunction: function(){
			var getReq = _.clone(MyApp.srchData.AMMPV0050GetReq);

			getReq.csvType = this.options.csvType;

			return {
				resId: 'AMMPV0050',

				data: {
					AMMPV0050GetReq: getReq
				}
			};
		}
	});

	MyApp.download = function(options){
		var getReq = _.extend(MyApp.srchData.AMMPV0050GetReq);

		getReq.planType = options.planType;
		getReq.csvType = options.csvType;
		getReq.version = options.version();

		clutil.postDLJSON({
			resId: 'AMMPV0050',
			data: {
				AMMPV0050GetReq: getReq
			}
		}).fail(function(data){
			MyApp.trigger('dlFail', data);
		});
	};

	var DlUpView = Marionette.ItemView.extend({
		template: '#DlUpView',

		templateHelpers: function(){
			return {
				baseYmd: Marionette.getOption(this, 'baseYmd'),
				newYmd: Marionette.getOption(this, 'newYmd'),
				dateFormat: clutil.dateFormat
			};
		}
	});

	// テーブルつき
	var ParamView = Marionette.ItemView.extend({
		template: '#ParamView',

		ui: {
			edit: '.ca_edit'
		},

		behaviors: {
			Uptake: {
				csvType: AMMPV0050Req.AMMPV0050_CSV_PARAM
			},
			Grid: {
				gridOptions: {
					autoHeight: false
				}
			},
			Update: {
				getData: function(){
					var getReq = _.clone(MyApp.srchData.AMMPV0050GetReq);
					var updReq = this.view.getUpdReq();
					getReq.csvType = AMMPV0050Req.AMMPV0050_CSV_PARAM;
					return {
						resId: 'AMMPV0050',
						data: {
							reqHead: {
								opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
							},
							AMMPV0050GetReq: getReq,
							AMMPV0050UpdReq: updReq
						}
					};
				}
			},
			CheckModified: {
				name: 'AttrRecView',
				numberFields: [
					'orderQy', 'dlvDate', 'planRate'
				]
			}
		},

		gridEvents: {
			'cell:change': function(e){
				if (e.isBody){
					this.triggerMethod('require:modified:check');
				}
			}
		},

		myEvents: {
			'modified:change': function(isModified){
				clutil.inputReadonly(this.ui.edit, !isModified);
				MyApp.setModifiedMarkTab(
					Controller.getResultView().$('li[target=s01]'),
					isModified);
			}
		},

		events: {
			'click .ca_sample_download': function(){
				clutil.download('/public/sample/支持率管理対象商品登録サンプル.xlsx');
			}
		},

		initialize: function(){
			this.listenTo(this, this.myEvents);
		},

		// 取込完了
		onUptakeDone: function(data){
			MyApp.data.AMMPV0050GetRsp.paramRecord = data.AMMPV0050GetRsp.paramRecord;
			this.triggerMethod('update:data');
			this.triggerMethod('require:modified:check');
		},

		// 更新完了
		onUpdateSuccess: function(){
			this.triggerMethod('require:save:previous:data');
			$.when(Controller.research()).done(function(){
				clutil.updMessageDialog();
			});
		},

		getUpdReq: function(){
			return {
				paramRecord: this.dataGrid.getData()
			};
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
			return MyApp.data.AMMPV0050GetRsp.paramRecord;
		},

		getColumns: function(){
			var columns = [];

			columns = columns.concat(
				[
					{
						name: 'メーカー',
						field: 'makerCode',
						width: 180,
						cellType: {
							formatter: function(value, options){
								// jshint unused: false
								var item = options.dataContext;
								return item.makerCode + ':' + item.makerName;
							}
						}
					},
					{
						name: 'メーカー品番',
						width: 120,
						field: 'itemCode'
					},
					{
						name: '商品区分',
						field: 'itemType',
						cellType: {
							formatter: 'cltypeselector',
							editorOptions: {
								kind: amcm_type.AMCM_TYPE_ITEM,
								nameOnly: true
							}
						}
					},
					{
						name: '発注数',
						field: 'orderQy',
						cssClass: 'txtalign-right',
						width: 80,
						cellType: {
							type: 'text',
							formatFilter: 'comma',
							// limit: 'number:6,0',
							validator: 'decimal:6,0 min:0'
						}
					},
					{
						name: '投入予定日',
						field: 'dlvDate',
						cellType: {
							type: 'date'
						}
					},
					{
						name: '期末支持率(%)',
						field: 'planRate',
						cssClass: 'txtalign-right',
						width: 110,
						cellType: {
							type: 'text',
							formatFilter: 'fixed:1',
							// limit: 'number:3,1',
							validator: 'decimal:3,1 max:100.0 min:0',
							placeholder: clcom.getSysparam(
								'PAR_AMCM_DEFAULT_PERCENT_DECIMAL')
						}
					},
					{
						name: '期末日',
						field: 'edDate',
						width: 180,
						cellType: {

							formatter: 'date'
						}
					}
				]);
			return columns;
		}
	});

	// 計画
	var PlanView = Marionette.ItemView.extend({
		template: '#DlUpView1',

		behaviors: {
			DlBasicPlan: {
				csvType: AMMPV0050Req.AMMPV0050_CSV,
				version: function(){
					return MyApp.getLastVersion(MyApp.data.AMMPV0050GetRsp.itemAutoVersionRec);
				}
			},
			DlNewPlan: {
				csvType: AMMPV0050Req.AMMPV0050_CSV,
				version: function(){
					return MyApp.getLastVersion(MyApp.data.AMMPV0050GetRsp.itemInputVersionRec);
				}
			},
			Uptake: {
				csvType: AMMPV0050Req.AMMPV0050_CSV
			}
		},

		events: {
			'click .ca_sample_download': function(){
				clutil.download('/public/sample/品番別支持率計画サンプル.xlsx');
			}
		},

		serializeData: function(){
			var getRsp = MyApp.data.AMMPV0050GetRsp;

			return {
				planAuto: MyApp.getLastVersionRec(
					getRsp.itemAutoVersionRec) || {},
				planInput: MyApp.getLastVersionRec(
					getRsp.itemInputVersionRec) || {}
			};
		},

		getVersionRecs: function(plan){
			var getRsp = MyApp.data.AMMPV0050GetRsp;
			if (plan === 'auto') {
				return getRsp.itemAutoVersionRec;
			} else {
				return getRsp.itemInputVersionRec;
			}
		},

		onUptakeDone: function(){
			$.when(Controller.research()).done(function(){
				clutil.MessageDialog2('取込が完了しました。');
			});
		}
	});

	var ResultView = Marionette.Layout.extend({
		template: '#ResultView',

		regions: {
			paramView: '#paramView',
			planView: '#planView'
		},

		events: {
			/**
			 * タブ切替
			 */
			"click .tabNavi li": function(e) {
				var tab_num = this.$(".tabNavi li").index(e.target);
				this.setActiveTab(tab_num);
			}
		},

		setActiveTab: function(no){
			this.$(".sht").hide();
			this.$(".sht").eq(no).fadeIn({
				complete: function(){
					MyApp.trigger('tabSwitch:' + no);
				}
			});
			this.$(".tabNavi li")
				.removeClass('on')
				.eq(no).addClass('on');
		},

		getActiveTab: function(){
			return this.$(".tabNavi li").index(this.$('.tabNavi li.on'));
		},

		onShow: function(){
			this.showParamView();
			this.showPlanView();
			this.setActiveTab(Controller.lastTab || 0);
		},

		showParamView: function(){
			var getRsp = MyApp.data.AMMPV0050GetRsp;
			this.paramView.show(new ParamView({
				baseYmd: getRsp.weekBaseUpdDate,
				newYmd: getRsp.weekNewUpdDate
			}));
		},

		showPlanView: function(){
			var getRsp = MyApp.data.AMMPV0050GetRsp;
			this.planView.show(new PlanView({
				baseYmd: getRsp.storeBaseUpdDate,
				newYmd: getRsp.storeNewUpdDate
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
				if ($('#searchArea').css('display') == 'none') {
					MyApp.srchAreaCtrl.show_srch();
					$("#searchAgain").text('検索条件を非表示');
					$("#searchAgain").fadeIn();
				} else {
					MyApp.srchAreaCtrl.show_result();
					$("#searchAgain").text('検索条件を再表示');
				}
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
			_.extend(getReq, {
				reqType: AMMPV0050Req.AMMPV0050_REQTYPE_ATTR
			});
			var data = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},

				AMMPV0050GetReq: getReq
			};

			this.srchData = data;
			this._search();
		},

		_search: function(){
			if (this.srchData){
				clutil.postJSON({
					resId: 'AMMPV0050',
					data: this.srchData
				})
					.done(this.onSearchSuccess)
					.fail(this.onSearchFail);
			}
		},

		research: function(){
			return this._search();
		},

		onSearchSuccess: function(data){
			MyApp.srchData = this.srchData;
			MyApp.data = data;
			MyApp.srchAreaCtrl.show_result();
			this.changeSearchAreaState(false);
			Controller.showFooter();
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
		},

		changeSearchAreaState: function(enable){
			if (enable) {
				clutil.viewRemoveReadonly(this.$('#searchArea'));
			} else {
				clutil.viewReadonly(this.$('#searchArea'));
			}
		}
	});


	var Controller = {
		start: function(){
			MyApp.addRegions({
				srchCondView: '#srchCondView',
				resultView: '#resultView'
			});

			if (!clcom.pushpop.popable){
				clcom._preventConfirm = true;
			}
			MyApp.unit_id = Number(clcom.userInfo.unit_id);
			// 共通ビュー(共通のヘッダなど内包）
			MyApp.mdBaseView = new clutil.View.MDBaseView({
				title: '品番別支持率計画策定',
				opeTypeId: -1,
				btn_submit: false,
				backBtnURL: clcom.pushpop.popable ? null : false
			});
			MyApp.mdBaseView.initUIElement();
			MyApp.mdBaseView.render();

			MyApp.srchCondView.show(new SrchCondView());

			if (clcom.pageArgs){
				this.load();
			}
			// 検索条件を再指定ボタンを隠す
			MyApp.srchAreaCtrl = clutil.controlSrchArea(
				$('#searchArea'),
				$('#ca_srch'),	// 検索条件領域
				$('#resultView'),				// 検索結果表示領域
				$('#searchAgain'));			// 検索条件を開く部品
		},

		load: function(){
			var srchCondView = this.getSrchCondView();
			clutil.data2view(srchCondView.$el, clcom.pageArgs);
			srchCondView.relation.done(function(){
				srchCondView.search();
			});
		},

		getSrchCondView: function(){
			return MyApp.srchCondView.currentView;
		},

		getResultView: function(){
			return MyApp.resultView.currentView;
		},

		showResultView: function(){
			MyApp.resultView.show(new ResultView());
		},

		showParamView: function(){
			this.getResultView().showParamView();
		},

		showPlanView: function(){
			this.getResultView().showPlanView();
		},


		closeResultView: function(){
			MyApp.resultView.close();
		},

		cancelEdit: function(){
			MyApp.confirmWhenModified(function(){
				this.closeResultView();
				MyApp.srchAreaCtrl.reset();
				this.hideFooter();
				this.getSrchCondView().changeSearchAreaState(true);
				this.getSrchCondView().resetFocus();
			}, this);
		},

		showFooter: function(){
			_.extend(MyApp.mdBaseView.options, {
				btn_cancel: {
					label: '条件再設定',
					action: this.cancelEdit
				},
				btn_submit: true
			});
			MyApp.mdBaseView.renderFooterNavi();
		},

		hideFooter: function(){
			_.extend(MyApp.mdBaseView.options, {
				btn_cancel: false,
				btn_submit: false
			});
			MyApp.mdBaseView.renderFooterNavi();
		},

		research: function(){
			var resultView = this.getResultView();
			Controller.lastTab = resultView.getActiveTab();
			return this.getSrchCondView().research();
		}
	};
	_.bindAll(Controller);

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
}(MyApp, AMMPV0050Req));
