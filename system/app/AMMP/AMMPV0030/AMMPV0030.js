useSelectpicker2();

(function(MyApp, AMMPV0030Req){
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

	MyApp.download = function(options){
		var getReq = _.extend(MyApp.srchData.AMMPV0030GetReq);

		getReq.planType = options.planType;
		getReq.csvType = options.csvType;
		getReq.version = options.version();

		clutil.postDLJSON({
			resId: 'AMMPV0030',
			data: {
				AMMPV0030GetReq: getReq
			}
		}).fail(function(data){
			MyApp.trigger('dlFail', data);
		});
	};

	Behaviors.Uptake = Behaviors.Uptake.extend({
		buildCSVInputReqFunction: function(){
			var getReq = _.clone(MyApp.srchData.AMMPV0030GetReq);

			getReq.csvType = this.options.csvType;

			return {
				resId: 'AMMPV0030',

				data: {
					AMMPV0030GetReq: getReq
				}
			};
		}
	});


	var ItemView = Marionette.ItemView.extend({
		template: '#DlUpView1',

		behaviors: {
			DlBasicPlan: {
				csvType: AMMPV0030Req.AMMPV0030_CSV_ITEM,
				version: function(){
					return MyApp.getLastVersion(MyApp.data.AMMPV0030GetRsp.itemAutoVersionRec);
				}
			},
			DlNewPlan: {
				csvType: AMMPV0030Req.AMMPV0030_CSV_ITEM,
				version: function(){
					return MyApp.getLastVersion(MyApp.data.AMMPV0030GetRsp.itemInputVersionRec);
				}
			},
			Uptake: {
				csvType: AMMPV0030Req.AMMPV0030_CSV_ITEM
			}
		},

		events: {
			'click .ca_sample_download': function(){
				clutil.download('/public/sample/品番別計画サンプル.xlsx');
			}
		},

		serializeData: function(){
			var getRsp = MyApp.data.AMMPV0030GetRsp;

			return {
				planAuto: MyApp.getLastVersionRec(
					getRsp.itemAutoVersionRec) || {},
				planInput: MyApp.getLastVersionRec(
					getRsp.itemInputVersionRec) || {}
			};
		},

		getVersionRecs: function(plan){
			var getRsp = MyApp.data.AMMPV0030GetRsp;
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

	// 商品属性別・サイズ別計画を登録・参照する
	var SizeView = Marionette.ItemView.extend({
		template: '#DlUpView1',

		behaviors: {
			DlBasicPlan: {
				csvType: AMMPV0030Req.AMMPV0030_CSV_SIZE,
				version: function(){
					return MyApp.getLastVersion(MyApp.data.AMMPV0030GetRsp.sizeAutoVersionRec);
				}
			},
			DlNewPlan: {
				csvType: AMMPV0030Req.AMMPV0030_CSV_SIZE,
				version: function(){
					return MyApp.getLastVersion(MyApp.data.AMMPV0030GetRsp.sizeInputVersionRec);
				}
			},
			Uptake: {
				csvType: AMMPV0030Req.AMMPV0030_CSV_SIZE
			}
		},

		events: {
			'click .ca_sample_download': function(){
				clutil.download('/public/sample/品番別サイズ別計画サンプル.xlsx');
			}
		},

		getVersionRecs: function(plan){
			var getRsp = MyApp.data.AMMPV0030GetRsp;
			if (plan === 'auto') {
				return getRsp.sizeAutoVersionRec;
			} else {
				return getRsp.sizeInputVersionRec;
			}
		},

		serializeData: function(){
			var getRsp = MyApp.data.AMMPV0030GetRsp;

			return {
				planAuto: MyApp.getLastVersionRec(
					getRsp.sizeAutoVersionRec) || {},
				planInput: MyApp.getLastVersionRec(
					getRsp.sizeInputVersionRec) || {}
			};
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
			itemView: '#itemView',
			sizeView: '#sizeView'
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
			var getRsp = MyApp.data.AMMPV0030GetRsp;
			this.itemView.show(new ItemView({
				baseYmd: getRsp.itemBaseUpdDate,
				newYmd: getRsp.itemNewUpdDate
			}));
			this.sizeView.show(new SizeView({
				baseYmd: getRsp.sizeBaseUpdDate,
				newYmd: getRsp.sizeNewUpdDate
			}));
			this.setActiveTab(Controller.lastTab || 0);
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

				clsizeptn_byitgrpselector: {
					el: '#ca_srchSizePtnID'
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
				reqType: AMMPV0030Req.AMMPV0030_REQTYPE_ATTR
			});
			var data = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},

				AMMPV0030GetReq: getReq
			};

			this.srchData = data;
			this._search();
		},

		_search: function(){
			if (this.srchData){
				clutil.postJSON({
					resId: 'AMMPV0030',
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
			_.bindAll(this);

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
				title: '品番別計画策定',
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
				// サイズパターンがないので検索できない
				// srchCondView.search();
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
}(MyApp, AMMPV0030Req));

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
