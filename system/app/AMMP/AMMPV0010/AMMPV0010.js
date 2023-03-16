$.inputlimiter.noTrim = true;
// global MyApp:false
useSelectpicker2();
$(function() {
	var ResizeWatcher = MyApp.ResizeWatcher;

	MyApp.download = function(options){
		var getReq = _.extend(MyApp.srchData.AMMPV0010GetReq);

		getReq.downPlanType = options.downPlanType;
		getReq.csvOutType = options.csvOutType;
		getReq.downVersion = options.version();

		clutil.postDLJSON({
			resId: 'AMMPV0010',
			data: {
				AMMPV0010GetReq: getReq
			}
		}).fail(function(data){
			MyApp.trigger('dlFail', data);
		});
	};
	var Controller = {
		buildSubmitReq: function(){
		},

		buildGetReq: function(){
		},

		start: function(){
			MyApp.addRegions({
				mainView: '#content'
			});

			if (!clcom.pushpop.popable){
				clcom._preventConfirm = true;
			}

			MyApp.unit_id = Number(clcom.userInfo.unit_id);
			// 共通ビュー(共通のヘッダなど内包）
			MyApp.mdBaseView = new clutil.View.MDBaseView({
				title: '品種別計画策定',
				opeTypeId: -1,
				btn_submit: false,
				buildSubmitReqFunction: this.buildSubmitReq,
				buildGetReqFunction: this.buildGetReq,
				backBtnURL: clcom.pushpop.popable ? null : false
			});
			MyApp.mdBaseView.initUIElement();
			MyApp.mdBaseView.render();
			MyApp.mainView.show(new MainView());
		},

		getMainView: function(){
			return MyApp.mainView.currentView;
		},

		getResultView: function(){
			return this.getMainView().resultView.currentView;
		},

		showParamRecordView: function(){
			var resultView = this.getResultView();
			if (resultView){
				resultView.paramRecordView.show(new ParamRecordView());
			}
		},

		showFooter: function(){
			_.extend(MyApp.mdBaseView.options, {
				btn_cancel: {
					label: '条件再設定',
					action: function (){
						Controller.getMainView().cancelEdit();
					}
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
			this.getMainView().research();
		}
	};
	_.bindAll(Controller);

	var ParamRecordView = Marionette.ItemView.extend({
		template: '#ParamRecordView',

		ui: {
			dataGrid: '.dataGrid',
			// CSVとりこみ
			upParamRecord: '#ca_csv_uptake',
		},
		events: {
			'click #ca_csv_download'		: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
		},

		getColhdMetadatas: function() {
			// 二段組の一段目
			var hd = {
				columns: {
					col_1: {
						colspan: 1,
						name: '部門',
					},
					col_2: {
						colspan: 1,
						name: '品種',
					},
					col_3: {
						colspan: 10,
						name: '既存店',
					},
					col_13: {
						colspan: 10,
						name: '2年目店',
					},
					col_23: {
						colspan: 10,
						name: '新店',
					},
				}
			};

			return [ hd ];
		},


		getColumns: function(){
			// 二段組の二段目
			return [
				{
					id: 'col_1',
					name: '',
					field: 'div',
					minWidth: 100,
					width: 100,
					cellType: {
						formatter: function(value, options){
							var item = options.dataContext;
							return item.divCode + ':' + item.divName;
						}
					}
				},
				{
					id: 'col_2',
					name: '',
					field: 'itgrp',
					minWidth: 100,
					width: 100,
					cellType: {
						formatter: function(value, options){
							var item = options.dataContext;
							return item.itgrpCode + ':' + item.itgrpName;
						}
					}
				},
				// 既存店
				{
					id: 'col_3',
					name: '前年構成比',
					field: 'exCompoRatePrev',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:6'
					}
				},
				{
					id: 'col_4',
					name: '構成比',
					field: 'exCompoRate',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:6'
					}
				},
				{
					id: 'col_5',
					name: '前年回転率',
					field: 'exTurnOverPrev',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					id: 'col_6',
					name: '回転率',
					field: 'exTurnOver',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					id: 'col_7',
					name: '前年平均売価',
					field: 'exAvePricePrev',
					cssClass: 'txtalign-right',
					width: 130,
					cellType: {
						formatFilter: 'comma'
					}
				},
				{
					id: 'col_8',
					name: '平均売価',
					field: 'exAvePrice',
					cssClass: 'txtalign-right',
					width: 130,
					cellType: {
						formatFilter: 'comma'
					}
				},
				{
					id: 'col_9',
					name: '前年経準率',
					field: 'exMrgnRatePrev',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					id: 'col_10',
					name: '経準率',
					field: 'exMrgnRate',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					id: 'col_11',
					name: '前年平均コスト',
					field: 'exAveCostPrev',
					cssClass: 'txtalign-right',
					width: 130,
					cellType: {
						formatFilter: 'comma'
					}
				},
				{
					id: 'col_12',
					name: '平均コスト',
					field: 'exAveCost',
					cssClass: 'txtalign-right',
					width: 130,
					cellType: {
						formatFilter: 'comma'
					}
				},
				// 2年目店
				{
					id: 'col_13',
					name: '前年構成比',
					field: 'sndCompoRatePrev',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:6'
					}
				},
				{
					id: 'col_14',
					name: '構成比',
					field: 'sndCompoRate',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:6'
					}
				},
				{
					id: 'col_15',
					name: '前年回転率',
					field: 'sndTurnOverPrev',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					id: 'col_16',
					name: '回転率',
					field: 'sndTurnOver',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					id: 'col_17',
					name: '前年平均売価',
					field: 'sndAvePricePrev',
					cssClass: 'txtalign-right',
					width: 130,
					cellType: {
						formatFilter: 'comma'
					}
				},
				{
					id: 'col_18',
					name: '平均売価',
					field: 'sndAvePrice',
					cssClass: 'txtalign-right',
					width: 130,
					cellType: {
						formatFilter: 'comma'
					}
				},
				{
					id: 'col_19',
					name: '前年経準率',
					field: 'sndMrgnRatePrev',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					id: 'col_20',
					name: '経準率',
					field: 'sndMrgnRate',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					id: 'col_21',
					name: '前年平均コスト',
					field: 'sndAveCostPrev',
					cssClass: 'txtalign-right',
					width: 130,
					cellType: {
						formatFilter: 'comma'
					}
				},
				{
					id: 'col_22',
					name: '平均コスト',
					field: 'sndAveCost',
					cssClass: 'txtalign-right',
					width: 130,
					cellType: {
						formatFilter: 'comma'
					}
				},
				// 新店
				{
					id: 'col_23',
					name: '前年構成比',
					field: 'newCompoRatePrev',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:6'
					}
				},
				{
					id: 'col_24',
					name: '構成比',
					field: 'newCompoRate',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:6'
					}
				},
				{
					id: 'col_25',
					name: '前年回転率',
					field: 'newTurnOverPrev',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					id: 'col_26',
					name: '回転率',
					field: 'newTurnOver',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					id: 'col_27',
					name: '前年平均売価',
					field: 'newAvePricePrev',
					cssClass: 'txtalign-right',
					width: 130,
					cellType: {
						formatFilter: 'comma'
					}
				},
				{
					id: 'col_28',
					name: '平均売価',
					field: 'newAvePrice',
					cssClass: 'txtalign-right',
					width: 130,
					cellType: {
						formatFilter: 'comma'
					}
				},
				{
					id: 'col_29',
					name: '前年経準率',
					field: 'newMrgnRatePrev',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					id: 'col_30',
					name: '経準率',
					field: 'newMrgnRate',
					cssClass: 'txtalign-right',
					minWidth: 130,
					width: 130,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					id: 'col_31',
					name: '前年平均コスト',
					field: 'newAveCostPrev',
					cssClass: 'txtalign-right',
					width: 130,
					cellType: {
						formatFilter: 'comma'
					}
				},
				{
					id: 'col_32',
					name: '平均コスト',
					field: 'newAveCost',
					cssClass: 'txtalign-right',
					width: 130,
					cellType: {
						formatFilter: 'comma'
					}
				},
			];
		},

		initialize: function(){
			_.bindAll(this);
			this.initDataGrid();
		},

		setData: function(){
			this.dataGrid.setData({
				columns: this.getColumns(),
				colhdMetadatas: this.getColhdMetadatas(),
				rowDelToggle: false,
				data: MyApp.data.AMMPV0010GetRsp.paramRecord,
				gridOptions: {
					autoHeight: false,
					frozenColumn: 1
				}
			});
		},
		onShow: function(){
			this.ui.dataGrid.html(this.dataGrid.el);
			this.resizeWatcher = new ResizeWatcher({
				$el: this.dataGrid.$el
			});
			this.listenTo(this.resizeWatcher, 'resize', function(){
				if (this.dataGrid.grid) {
					this.dataGrid.grid.resizeCanvas();
				}
				// console.log('resize', this.resizeWatcher.$el.height());
			});

			this.setData();

			this.ui.dataGrid.css('max-width', 1110 + MyApp.measureScrollbar().width);

			this.upParamRecordCtrl = clutil.View.OpeCSVInputController({
				btn: this.ui.upParamRecord,
				buildCSVInputReqFunction: function(){
					var getReq = _.clone(MyApp.srchData.AMMPV0010GetReq);
					return {
						resId: clcom.pageId,
						data: {
							AMMPV0010GetReq: getReq
						}
					};
				}
			});
			this.listenTo(this.upParamRecordCtrl, {
				done: function(data){
//					MyApp.data.AMMPV0010GetRsp.paramRecord = data.AMMPV0010GetRsp.paramRecord;
//					this.setData();
					this.getMainView().onSearchSuccess(data);
				},
				fail: function(data){
					if (data.rspHead.uri){
						clutil.download(data.rspHead.uri);	//CSVダウンロード実行
					}
				}
			});
			var perm = clcom.getPermfuncByCode('AMMPV0010');
			if (perm == null || perm.f_allow_write == 0) {
				// 更新権限無し
				clutil.viewReadonly("#ca_csvinput1");
			}
		},

		initDataGrid: function(){
			this.dataGrid = new ClGrid.ClAppGridView({
				errorInside: true,
				attributes: {
					style: 'height: 600px'
				}
				// // 行削除ボタンを使用するフラグ。
				// delRowBtn: true,
				// // フッター部の新規行追加ボタンを使用するフラグ。
				// footerNewRowBtn: true
			});
			this.listenTo(this.dataGrid, this.gridEvents);
			this.dataGrid.render();
		},

		sampleURL: "/public/sample/品種別構成比登録サンプル.xlsx",

		_onSampleDLClick: function() {
			//this.doCSV(AMMPV0010Req.AMMPV0010_SAMPLE);
			//window.location = "/public/sample/品種別構成比登録サンプル.xlsx";
			clutil.download(this.sampleURL);
		},

		getMainView: function(){
			return MyApp.mainView.currentView;
		},

		getResultView: function(){
			return this.getMainView().resultView.currentView;
		},

		onClose: function(){
			this.resizeWatcher.stop();
			this.stopListening();
		}
	});

	var ResultView = Marionette.Layout.extend({
		template: '#ResultView',

		ui: {
			// 基準計画ダウンロード
			dlYearBase: '.planAutoYearLink',
			// 最新計画ダウンロード
			dlYearLast: '.planInputYearLink',
			// 基準計画ダウンロード
			dlMonthBase: '.planAutoMonthLink',
			// 最新計画ダウンロード
			dlMonthLast: '.planInputMonthLink',
			// 基準計画ダウンロード
			dlWeekBase: '.planAutoWeekLink',
			// 最新計画ダウンロード
			dlWeekLast: '.planInputWeekLink',

			// 品種別年商アップロード
			upS02Plan: "#ca_ul_s02_plan",

			// 品種別月別アップロード
			upS03Plan: "#ca_ul_s03_plan",

			// 品種別週別アップロード
			upS04Plan: "#ca_ul_s04_plan",
		},

		regions: {
			ParamRecordView: '#paramRecordView'
		},

		sampleURL2: "/public/sample/品種別年商計画サンプル.xlsx",
		sampleURL3: "/public/sample/品種別月別計画サンプル.xlsx",
		sampleURL4: "/public/sample/品種別週別計画サンプル.xlsx",

		events: {
			// 自動按分計画ダウンロードする（年商）
			'click @ui.dlYearBase': function(){
				var getReq = _.clone(MyApp.srchData.AMMPV0010GetReq);
				getReq.downPlanType = AMMPV0010Req.AMMPV0010_DOWNPLAN_AUTO;
				getReq.csvOutType = AMMPV0010Req.AMMPV0010_CSVOUT_YEAR;
				getReq.downVersion = MyApp.getLastVersion(MyApp.data.AMMPV0010GetRsp.yearAutoVersionRec);
				clutil.postDLJSON({
					resId: 'AMMPV0010',
					data: {
						AMMPV0010GetReq: getReq
					}
				}).fail(this.onDlFail);
			},

			// 取込計画をダウンロードする(XXX最新計画ダウンロードする)
			'click @ui.dlYearLast': function(){
				var getReq = _.clone(MyApp.srchData.AMMPV0010GetReq);
				getReq.downPlanType = AMMPV0010Req.AMMPV0010_DOWNPLAN_INPUT;
				getReq.csvOutType = AMMPV0010Req.AMMPV0010_CSVOUT_YEAR;
				getReq.downVersion = MyApp.getLastVersion(MyApp.data.AMMPV0010GetRsp.yearInputVersionRec);
				clutil.postDLJSON({
					resId: 'AMMPV0010',
					data: {
						AMMPV0010GetReq: getReq
					}
				}).fail(this.onDlFail);
			},

			'click .planAutoYearMore': function(){
				var getRsp = MyApp.data.AMMPV0010GetRsp;
				var versionRecs = getRsp.yearAutoVersionRec;
				var versionView = new MyApp.VersionView({
					collection: new Backbone.Collection(versionRecs),
					downPlanType: AMMPV0010Req.AMMPV0010_DOWNPLAN_AUTO,
					csvOutType: AMMPV0010Req.AMMPV0010_CSVOUT_YEAR,
					title: '自動按分計画バージョン一覧'
				});
				MyApp.showDialog(versionView);
			},
			'click .planInputYearMore': function(){
				var getRsp = MyApp.data.AMMPV0010GetRsp;
				var versionRecs = getRsp.yearInputVersionRec;
				var versionView = new MyApp.VersionView({
					collection: new Backbone.Collection(versionRecs),
					downPlanType: AMMPV0010Req.AMMPV0010_DOWNPLAN_INPUT,
					csvOutType: AMMPV0010Req.AMMPV0010_CSVOUT_YEAR,
					title: '取込計画バージョン一覧'
				});
				MyApp.showDialog(versionView);
			},

			// 自動按分計画ダウンロードする（月別）
			'click @ui.dlMonthBase': function(){
				var getReq = _.clone(MyApp.srchData.AMMPV0010GetReq);
				getReq.downPlanType = AMMPV0010Req.AMMPV0010_DOWNPLAN_AUTO;
				getReq.csvOutType = AMMPV0010Req.AMMPV0010_CSVOUT_MONTH;
				getReq.downVersion = MyApp.getLastVersion(MyApp.data.AMMPV0010GetRsp.monthAutoVersionRec);
				clutil.postDLJSON({
					resId: 'AMMPV0010',
					data: {
						AMMPV0010GetReq: getReq
					}
				}).fail(this.onDlFail);
			},

			// 取込計画をダウンロードする(XXX最新計画ダウンロードする)
			'click @ui.dlMonthLast': function(){
				var getReq = _.clone(MyApp.srchData.AMMPV0010GetReq);
				getReq.downPlanType = AMMPV0010Req.AMMPV0010_DOWNPLAN_INPUT;
				getReq.csvOutType = AMMPV0010Req.AMMPV0010_CSVOUT_MONTH;
				getReq.downVersion = MyApp.getLastVersion(MyApp.data.AMMPV0010GetRsp.monthInputVersionRec);
				clutil.postDLJSON({
					resId: 'AMMPV0010',
					data: {
						AMMPV0010GetReq: getReq
					}
				}).fail(this.onDlFail);
			},

			'click .planAutoMonthMore': function(){
				var getRsp = MyApp.data.AMMPV0010GetRsp;
				var versionRecs = getRsp.monthAutoVersionRec;
				var versionView = new MyApp.VersionView({
					collection: new Backbone.Collection(versionRecs),
					downPlanType: AMMPV0010Req.AMMPV0010_DOWNPLAN_AUTO,
					csvOutType: AMMPV0010Req.AMMPV0010_CSVOUT_MONTH,
					title: '自動按分計画バージョン一覧'
				});
				MyApp.showDialog(versionView);
			},
			'click .planInputMonthMore': function(){
				var getRsp = MyApp.data.AMMPV0010GetRsp;
				var versionRecs = getRsp.monthInputVersionRec;
				var versionView = new MyApp.VersionView({
					collection: new Backbone.Collection(versionRecs),
					downPlanType: AMMPV0010Req.AMMPV0010_DOWNPLAN_INPUT,
					csvOutType: AMMPV0010Req.AMMPV0010_CSVOUT_MONTH,
					title: '取込計画バージョン一覧'
				});
				MyApp.showDialog(versionView);
			},

			// 自動按分計画ダウンロードする（週別）
			'click @ui.dlWeekBase': function(){
				var getReq = _.clone(MyApp.srchData.AMMPV0010GetReq);
				getReq.downPlanType = AMMPV0010Req.AMMPV0010_DOWNPLAN_AUTO;
				getReq.csvOutType = AMMPV0010Req.AMMPV0010_CSVOUT_WEEK;
				getReq.downVersion = MyApp.getLastVersion(MyApp.data.AMMPV0010GetRsp.weekAutoVersionRec);
				clutil.postDLJSON({
					resId: 'AMMPV0010',
					data: {
						AMMPV0010GetReq: getReq
					}
				}).fail(this.onDlFail);
			},

			// 取込計画をダウンロードする(XXX最新計画ダウンロードする)
			'click @ui.dlWeekLast': function(){
				var getReq = _.clone(MyApp.srchData.AMMPV0010GetReq);
				getReq.downPlanType = AMMPV0010Req.AMMPV0010_DOWNPLAN_INPUT;
				getReq.csvOutType = AMMPV0010Req.AMMPV0010_CSVOUT_WEEK;
				getReq.downVersion = MyApp.getLastVersion(MyApp.data.AMMPV0010GetRsp.weekInputVersionRec);
				clutil.postDLJSON({
					resId: 'AMMPV0010',
					data: {
						AMMPV0010GetReq: getReq
					}
				}).fail(this.onDlFail);
			},

			'click .planAutoWeekMore': function(){
				var getRsp = MyApp.data.AMMPV0010GetRsp;
				var versionRecs = getRsp.weekAutoVersionRec;
				var versionView = new MyApp.VersionView({
					collection: new Backbone.Collection(versionRecs),
					downPlanType: AMMPV0010Req.AMMPV0010_DOWNPLAN_AUTO,
					csvOutType: AMMPV0010Req.AMMPV0010_CSVOUT_WEEK,
					title: '自動按分計画バージョン一覧'
				});
				MyApp.showDialog(versionView);
			},
			'click .planInputWeekMore': function(){
				var getRsp = MyApp.data.AMMPV0010GetRsp;
				var versionRecs = getRsp.weekInputVersionRec;
				var versionView = new MyApp.VersionView({
					collection: new Backbone.Collection(versionRecs),
					downPlanType: AMMPV0010Req.AMMPV0010_DOWNPLAN_INPUT,
					csvOutType: AMMPV0010Req.AMMPV0010_CSVOUT_WEEK,
					title: '取込計画バージョン一覧'
				});
				MyApp.showDialog(versionView);
			},

			// 年商計画サンプルダウンロード
			'click #ca_csv_download2': function() {
				clutil.download(this.sampleURL2);
			},

			// 月別計画サンプルダウンロード
			'click #ca_csv_download3': function() {
				clutil.download(this.sampleURL3);
			},

			// 週別計画サンプルダウンロード
			'click #ca_csv_download4': function() {
				clutil.download(this.sampleURL4);
			},

			/**
			 * タブ切替
			 */
			"click .tabNavi li": function(e) {
				var tab_num = $(".tabNavi li").index(e.target);
				this.setActiveTab(tab_num);
			}
		},

		setActiveTab: function(no){
			this.$(".sht").hide();
			this.$(".sht").eq(no).fadeIn();
			this.$(".tabNavi li")
				.removeClass('on')
				.eq(no).addClass('on');
		},

		getMainView: function(){
			return MyApp.mainView.currentView;
		},

		getActiveTab: function(){
			return this.$(".tabNavi li").index(this.$('.tabNavi li.on'));
		},

		serializeData: function(){
			var getRsp = MyApp.data.AMMPV0010GetRsp;

			return {
				planAutoYear: MyApp.getLastVersionRec(
					getRsp.yearAutoVersionRec) || {},
				planInputYear: MyApp.getLastVersionRec(
					getRsp.yearInputVersionRec) || {},
				planAutoMonth: MyApp.getLastVersionRec(
						getRsp.monthAutoVersionRec) || {},
				planInputMonth: MyApp.getLastVersionRec(
					getRsp.monthInputVersionRec) || {},
				planAutoWeek: MyApp.getLastVersionRec(
						getRsp.weekAutoVersionRec) || {},
				planInputWeek: MyApp.getLastVersionRec(
					getRsp.weekInputVersionRec) || {},
			};
		},

		onShow: function(){
			this.ParamRecordView.show(new ParamRecordView());

			if (Controller.lastTab != null){
				this.setActiveTab(Controller.lastTab);
			}

			this.upS02PlanCtrl = clutil.View.OpeCSVInputController({
				btn: this.ui.upS02Plan,
				noDialogOnDone: true,
				buildCSVInputReqFunction: function(){
					var getReq = _.clone(MyApp.srchData.AMMPV0010GetReq);
					getReq.csvOutType = AMMPV0010Req.AMMPV0010_CSVOUT_YEAR;
					return {
						resId: clcom.pageId,
						data: {
							AMMPV0010GetReq: getReq
						}
					};
				}
			});
			this.listenTo(this.upS02PlanCtrl, {
				done: function(){
					this.getMainView().setShowDialog(true);
					Controller.research();
				},
				fail: function(data){
					if (data.rspHead.uri){
						//CSVダウンロード実行
						clutil.download(data.rspHead.uri);
					}
				}
			});
			this.upS03PlanCtrl = clutil.View.OpeCSVInputController({
				btn: this.ui.upS03Plan,
				noDialogOnDone: true,
				buildCSVInputReqFunction: function(){
					var getReq = _.clone(MyApp.srchData.AMMPV0010GetReq);
					getReq.csvOutType = AMMPV0010Req.AMMPV0010_CSVOUT_MONTH;
					return {
						resId: clcom.pageId,
						data: {
							AMMPV0010GetReq: getReq
						}
					};
				}
			});
			this.listenTo(this.upS03PlanCtrl, {
				done: function(){
					this.getMainView().setShowDialog(true);
					Controller.research();
				},
				fail: function(data){
					if (data.rspHead.uri){
						clutil.download(data.rspHead.uri);	//CSVダウンロード実行
					}
				}
			});
			this.upS04PlanCtrl = clutil.View.OpeCSVInputController({
				btn: this.ui.upS04Plan,
				noDialogOnDone: true,
				buildCSVInputReqFunction: function(){
					var getReq = _.clone(MyApp.srchData.AMMPV0010GetReq);
					getReq.csvOutType = AMMPV0010Req.AMMPV0010_CSVOUT_WEEK;
					return {
						resId: clcom.pageId,
						data: {
							AMMPV0010GetReq: getReq
						}
					};
				}
			});
			this.listenTo(this.upS04PlanCtrl, {
				done: function(){
					this.getMainView().setShowDialog(true);
					Controller.research();
				},
				fail: function(data){
					if (data.rspHead.uri){
						clutil.download(data.rspHead.uri);	//CSVダウンロード実行
					}
				}
			});
		},

		onDlFail: function(data){
			clutil.mediator.trigger('onTicker', data);
		}

	});

	var MainView = Marionette.Layout.extend({
		template: '#MainView',

		events: {
			'click #ca_srch': function(){
				this.search();
			},
			// 検索条件を再指定ボタン押下
			'click #searchAgain': function(){
				if ($('#ca_srchArea').css('display') == 'none') {
					this.srchAreaCtrl.show_srch();
					$("#searchAgain").text('検索条件を非表示');
					$("#searchAgain").fadeIn();
				} else {
					this.srchAreaCtrl.show_result();
					$("#searchAgain").text('検索条件を再表示');
				}
			}
		},

		ui: {
			searchArea: '#ca_srchArea',
			srchYear: '#ca_srchYear'
		},

		regions: {
			resultView: '#resultView'
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

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
				this.ui.searchArea,
				this.ui.searchArea.find('#ca_srch'),	// 検索条件領域
				this.$('#resultView'),				// 検索結果表示領域
				this.$('#searchAgain'));			// 検索条件を開く部品

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
			});

			this.resetFocus();
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

				AMMPV0010GetReq: getReq
			};

			this.srchData = data;
			this._search();
		},

		_search: function(){
			if (this.srchData){
				return clutil.postJSON({
					resId: 'AMMPV0010',
					data: this.srchData
				})
					.done(this.onSearchSuccess)
					.fail(this.onSearchFail);
			}
		},

		research: function(){
			return this._search();
		},

		changeSearchAreaState: function(enable){
			if (enable) {
				clutil.viewRemoveReadonly(this.$('#searchArea'));
				Controller.lastTab = null;
			} else {
				clutil.viewReadonly(this.$('#searchArea'));
			}
		},

		onSearchFail: function(data){
			this.resultView.close();
			this.srchAreaCtrl.show_srch();
			clutil.mediator.trigger('onTicker', data);	// エラーメッセージを通知。
			this.resetFocus();
		},

		isShowDialog: false,

		onSearchSuccess: function(data){
			MyApp.srchData = this.srchData;
			MyApp.data = data;
			this.srchAreaCtrl.show_result();
			this.changeSearchAreaState(false);
			Controller.showFooter();
			this.resultView.show(new ResultView());
			if (this.isShowDialog) {
				clutil.MessageDialog2('取込が完了しました。');
				this.isShowDialog = false;
			}
		},

		setShowDialog: function(f) {
			this.isShowDialog = f;
		},

		cancelEdit: function(){
			MyApp.confirmWhenModified(function(){
				this.resultView.close();
				this.srchAreaCtrl.reset();
				Controller.hideFooter();
				this.changeSearchAreaState(true);
				MyApp.resetModified();
			}, this);
		},

		resetFocus: function(){
			clutil.focus(null, 0, {view: this.$el});
		}
	});

	MyApp.addInitializer(Controller.start);

	$(function(){
		// Enterキーによるフォーカスをする。
		clutil.enterFocusMode();

		//--------------------------------------------------------------
		// 初期データ取得
		clutil.getIniJSON().done(function(){
			MyApp.start();
			// MyApp.boo();
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

	MyApp.boo = function(){
		clutil.data2view(MyApp.mainView.currentView.$el, {
			srchYear: '2014',
			srchUnitID: 5,
			srchItgrpID: {
				id: 111,
				code: '01',
				name: 'スト'
			}
		});
		Controller.getMainView().relation.done(function(){
			Controller.getMainView().search();
		});
	};
}());
