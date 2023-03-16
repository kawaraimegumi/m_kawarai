$.inputlimiter.noTrim = true;
useSelectpicker2();

(function(){
	var Behaviors = {};

	Marionette.Behaviors.behaviorsLookup = function(){
		return Behaviors;
	};

	_.extend(Behaviors, MyApp._Behaviors);

	// 計画をアップロードする
	Behaviors.Uptake = Behaviors.Uptake.extend({
		defaults: {
			fileUploadViewOpts: {
				maxFileSize: 1024 * 1024 * 5
			}
		},
		buildCSVInputReqFunction: function(){
			var getReq = _.clone(MyApp.srchData.AMMPV0040GetReq);

			getReq.csvType = this.options.csvType;

			return {
				resId: 'AMMPV0040',

				data: {
					AMMPV0040GetReq: getReq
				}
			};
		}
	});

	MyApp.download = function(options){
		var getReq = _.extend(MyApp.srchData.AMMPV0040GetReq);

		getReq.planType = options.planType;
		getReq.csvType = options.csvType;
		if (_.isFunction(options.version)){
			getReq.version = options.version();
		}

		clutil.postDLJSON({
			resId: 'AMMPV0040',
			data: {
				AMMPV0040GetReq: getReq
			}
		}).fail(function(data){
			MyApp.trigger('dlFail', data);
		});
	};


	// 在庫調整表
	var StockView = Marionette.ItemView.extend({
		template: '#OneDlView',
		ui: {
			// 基準計画ダウンロード
			dlBtn: '.ca_dl'
		},

		events: {
			'click @ui.dlBtn': function(){
				MyApp.download({
					csvType: AMMPV0040Req.AMMPV0040_CSV_STOCK
				});
			}
		},

		onShow: function(){
			this.ui.dlBtn.text('在庫調整表をダウンロードする');
		}
	});

	// 効率表
	var EffView = Marionette.ItemView.extend({
		template: '#OneDlView',
		ui: {
			// 基準計画ダウンロード
			dlBtn: '.ca_dl'
		},

		events: {
			'click @ui.dlBtn': function(){
				MyApp.download({
					csvType: AMMPV0040Req.AMMPV0040_CSV_EFFICIENT
				});
			}
		},

		onShow: function(){
			this.ui.dlBtn.text('効率表をダウンロードする');
		}
	});

	var DlUpView = Marionette.ItemView.extend({
		template: '#DlUpView1',

		templateHelpers: function(){
			return {
				baseYmd: Marionette.getOption(this, 'baseYmd'),
				newYmd: Marionette.getOption(this, 'newYmd'),
				dateFormat: clutil.dateFormat
			};
		}
	});

	// 週別・商品属性別別計画を登録・参照する
	var WeekView = DlUpView.extend({
		serializeData: function(){
			var getRsp = MyApp.data.AMMPV0040GetRsp;

			return {
				planAuto: MyApp.getLastVersionRec(
					getRsp.weekAutoVersionRec) || {},
				planInput: MyApp.getLastVersionRec(
					getRsp.weekInputVersionRec) || {}
			};
		},

		getVersionRecs: function(plan){
			var getRsp = MyApp.data.AMMPV0040GetRsp;
			if (plan === 'auto') {
				return getRsp.weekAutoVersionRec;
			} else {
				return getRsp.weekInputVersionRec;
			}
		},

		behaviors: {
			DlBasicPlan: {
				csvType: AMMPV0040Req.AMMPV0040_CSV_WEEK,
				version: function(){
					return MyApp.getLastVersion(
						MyApp.data.AMMPV0040GetRsp.weekAutoVersionRec);
				}
			},
			DlNewPlan: {
				csvType: AMMPV0040Req.AMMPV0040_CSV_WEEK,
				version: function(){
					return MyApp.getLastVersion(
						MyApp.data.AMMPV0040GetRsp.weekInputVersionRec);
				}
			},
			Uptake: {
				csvType: AMMPV0040Req.AMMPV0040_CSV_WEEK
			}
		},

		events: {
			'click .ca_sample_download': function(){
				clutil.download('/public/sample/週別商品属性別計画サンプル.xlsx');
			}
		},

		onUptakeDone: function(){
			$.when(Controller.research()).done(function(){
				clutil.MessageDialog2('取込が完了しました。');
			});
		}
	});

	// 商品属性別・サイズ別計画を登録・参照する
	var StoreView = DlUpView.extend({
		serializeData: function(){
			var getRsp = MyApp.data.AMMPV0040GetRsp;

			return {
				planAuto: MyApp.getLastVersionRec(
					getRsp.storeAutoVersionRec) || {},
				planInput: MyApp.getLastVersionRec(
					getRsp.storeInputVersionRec) || {}
			};
		},

		getVersionRecs: function(plan){
			var getRsp = MyApp.data.AMMPV0040GetRsp;
			if (plan === 'auto') {
				return getRsp.storeAutoVersionRec;
			} else {
				return getRsp.storeInputVersionRec;
			}
		},

		behaviors: {
			DlBasicPlan: {
				csvType: AMMPV0040Req.AMMPV0040_CSV_STORE,
				version: function(){
					return MyApp.getLastVersion(
						MyApp.data.AMMPV0040GetRsp.storeAutoVersionRec);
				}
			},
			DlNewPlan: {
				csvType: AMMPV0040Req.AMMPV0040_CSV_STORE,
				version: function(){
					return MyApp.getLastVersion(
						MyApp.data.AMMPV0040GetRsp.storeInputVersionRec);
				}
			},
			Uptake: {
				csvType: AMMPV0040Req.AMMPV0040_CSV_STORE
			}
		},

		events: {
			'click .ca_sample_download': function(){
				clutil.download('/public/sample/店舗別商品属性別計画サンプル.xlsx');
			}
		},

		onUptakeDone: function(){
			$.when(Controller.research()).done(function(){
				clutil.MessageDialog2('取込が完了しました。');
			});
		}
	});

	var MonthView = DlUpView.extend({
		serializeData: function(){
			var getRsp = MyApp.data.AMMPV0040GetRsp;

			return {
				planAuto: MyApp.getLastVersionRec(
					getRsp.monthAutoVersionRec) || {},
				planInput: MyApp.getLastVersionRec(
					getRsp.monthInputVersionRec) || {}
			};
		},

		getVersionRecs: function(plan){
			var getRsp = MyApp.data.AMMPV0040GetRsp;
			if (plan === 'auto') {
				return getRsp.monthAutoVersionRec;
			} else {
				return getRsp.monthInputVersionRec;
			}
		},

		behaviors: {
			DlBasicPlan: {
				csvType: AMMPV0040Req.AMMPV0040_CSV_MONTH,
				version: function(){
					return MyApp.getLastVersion(
						MyApp.data.AMMPV0040GetRsp.monthAutoVersionRec);
				}
			},
			DlNewPlan: {
				csvType: AMMPV0040Req.AMMPV0040_CSV_MONTH,
				version: function(){
					return MyApp.getLastVersion(
						MyApp.data.AMMPV0040GetRsp.monthInputVersionRec);
				}
			},
			Uptake: {
				csvType: AMMPV0040Req.AMMPV0040_CSV_MONTH
			}
		},

		events: {
			'click .ca_sample_download': function(){
				clutil.download('/public/sample/月別店舗別商品属性別計画サンプル.xlsx');
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
			weekView: '#weekView',
			stockView: '#stockView',
			storeView: '#storeView',
			monthView: '#monthView',
			effView: '#effView'
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
			var getRsp = MyApp.data.AMMPV0040GetRsp;
			this.weekView.show(new WeekView({
				baseYmd: getRsp.weekBaseUpdDate,
				newYmd: getRsp.weekNewUpdDate
			}));
			this.stockView.show(new StockView());
			this.storeView.show(new StoreView({
				baseYmd: getRsp.storeBaseUpdDate,
				newYmd: getRsp.storeNewUpdDate
			}));
			this.monthView.show(new MonthView({
				baseYmd: getRsp.monthBaseUpdDate,
				newYmd: getRsp.monthNewUpdDate
			}));
			this.effView.show(new EffView());
			if (Controller.lastTab != null){
				this.setActiveTab(Controller.lastTab);
			}
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
				reqType: AMMPV0040Req.AMMPV0040_REQTYPE_ATTR
			});
			var data = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},

				AMMPV0040GetReq: getReq
			};

			this.srchData = data;
			this._search();
		},

		_search: function(){
			if (this.srchData){
				return clutil.postJSON({
					resId: 'AMMPV0040',
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
				title: '商品投入振分計画策定',
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

		closeResultView: function(){
			MyApp.resultView.close();
		},

		cancelEdit: function(){
			this.closeResultView();
			MyApp.srchAreaCtrl.reset();
			this.hideFooter();
			this.getSrchCondView().changeSearchAreaState(true);
			this.getSrchCondView().resetFocus();
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

}());
