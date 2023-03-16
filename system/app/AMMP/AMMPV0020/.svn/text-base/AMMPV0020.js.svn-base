$.inputlimiter.noTrim = true;
// global MyApp:false
useSelectpicker2();
(function(){
	var ResizeWatcher = MyApp.ResizeWatcher;

	MyApp.download = function(options){
		var getReq = _.extend(MyApp.srchData.AMMPV0020GetReq);

		getReq.planType = options.planType;
		getReq.csvType = options.csvType;
		getReq.version = options.version();

		clutil.postDLJSON({
			resId: 'AMMPV0020',
			data: {
				AMMPV0020GetReq: getReq
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
				title: 'シーズン別計画策定',
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

		showSeasonParamView: function(){
			var resultView = this.getResultView();
			if (resultView){
				resultView.seasonParamView.show(new SeasonParamView());
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
			return this.getMainView().research();
		}
	};
	_.bindAll(Controller);

	var SeasonParamView = Marionette.ItemView.extend({
		template: '#SeasonParamView',

		ui: {
			dataGrid: '.dataGrid',
			// CSVとりこみ
			upSeasonParam: '#ca_csv_uptake3',

			edit: '#ca_edit'
		},

		events: {
			'click @ui.edit': function(){
				if (!this.isValid()){
					return;
				}
				var getReq = _.clone(MyApp.srchData.AMMPV0020GetReq);
				getReq.csvType = AMMPV0020Req.AMMPV0020_PARAM_CSV_SEASON;
				var seasonRec = this.getSeasonRec();
				clutil.postJSON({
					resId: clcom.pageId,
					data: {
						reqHead: {
							opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
						},
						AMMPV0020GetReq: getReq,
						AMMPV0020UpdReq: {
							seasonRec: seasonRec
						}
					}
				})
					.done(this.onUpdSuccess)
					.fail(this.onUpdFail);
			},

			'click .ca_sample_download': function(){
				clutil.download('/public/sample/シーズン別構成比登録サンプル.xlsx');
			}
		},

		checkModified: function(){
			var isModified = this.isModified();

			clutil.inputReadonly(this.ui.edit, !isModified);

			MyApp.setModifiedMarkTab(
				Controller.getResultView().$('li[target=s01]'),
				isModified);

			MyApp.trigger('modified:change', 'SeasonParamView', isModified);
		},

		/**
		 * 変更前のデータを設定する
		 */
		savePreviousData: function(){
			this.previousData = _.map(this.getSeasonRec(), function(rec){
				return _.clone(rec);
			});
			this.checkModified();
		},

		_isModifiedRow: function(prev, curr){
			var targetFields = [
				'compoRate', 'turnOver', 'avePrice', 'mrgnRate', 'aveCost'];

			return _.some(targetFields, function(field){
				var pv = Number(prev[field]),
					cv = Number(curr[field]);
				return pv !== cv;
			});
		},

		/**
		 * 変更されているかチェックする
		 */
		isModified: function(targetIndex){
			var prev = this.previousData;
			var curr = this.getSeasonRec();

			if (prev.length !== curr.length) return true;

			var isChanged;

			if (targetIndex){
				isChanged = this._isModifiedRow(prev[targetIndex], curr[targetIndex]);
			}else{
				isChanged = _.some(prev, function(p, i){
					return this._isModifiedRow(p, curr[i]);
				}, this);
			}

			return isChanged;
		},

		onUpdSuccess: function(){
			this.savePreviousData();
			$.when(Controller.research()).always(function(){
				clutil.updMessageDialog();
			});
		},

		onUpdFail: function(data){
			clutil.mediator.trigger('onTicker', data);
		},

		gridEvents: {
			'cell:change': function(e){
				if (e.isBody){
					this.checkModified();
				}
			}
		},

		isValid: function() {
			if (!this.dataGrid.isValid()){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return false;
			}
			var gridData = this.dataGrid.getData();
			var d = _.reduce(gridData, function(memo, item){
				memo.total += Number(item.compoRate);
				return memo;
			}, {total: 0});
			if (d.total.toFixed(2) !== '100.00'){
				clutil.mediator.trigger('onTicker', '構成比の合計が100%になりません。');
				return false;
			}

			return true;
		},

		getSeasonRec: function(){
			return this.dataGrid.getData();
		},

		getColumns: function(){
			return [
				{
					name: 'シーズン',
					field: 'season',
					minWidth: 100,
					width: 100,
					cellType: {
						formatter: function(value, options){
							var item = options.dataContext;
							return item.seasonCode + ':' + item.seasonName;
						}
					}
				},
				{
					name: '前年構成比(%)',
					field: 'compoRatePrev',
					cssClass: 'txtalign-right',
					width: 110,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					name: '構成比(%)',
					field: 'compoRate',
					cssClass: 'txtalign-right',
					minWidth: 80,
					width: 80,
					cellType: {
						type: 'text',
						formatFilter: 'comma fixed:2',
						// limit: 'number:3,2',
						validator: 'required decimal:3,2 min:0',
						placeholder: clcom.getSysparam(
							'PAR_AMCM_DEFAULT_PERCENT_DECIMAL')
					}
				},
				{
					name: '前年回転率(%)',
					field: 'turnOverPrev',
					cssClass: 'txtalign-right',
					width: 110,
					cellType: {
						formatFilter: 'comma fixed:2'
					}
				},
				{
					name: '回転率(%)',
					field: 'turnOver',
					cssClass: 'txtalign-right',
					minWidth: 80,
					width: 80,
					cellType: {
						type: 'text',
						formatFilter: 'comma fixed:2',
						// limit: 'number:4,2',
						validator: 'required decimal:4,2 min:0',
						placeholder: clcom.getSysparam(
							'PAR_AMCM_DEFAULT_PERCENT_DECIMAL2')
					}
				},
				{
					name: '前年平均売価(税抜)',
					field: 'avePricePrev',
					cssClass: 'txtalign-right',
					width: 130,
					cellType: {
						formatFilter: 'comma'
					}
				},
				{
					name: '平均売価(税抜)',
					field: 'avePrice',
					cssClass: 'txtalign-right',
					width: 110,
					cellType: {
						type: 'text',
						formatFilter: 'comma',
						// // limit: 'number:5,0',
						validator: 'required decimal:5,0 min:0'
					}
				},
				{
					name: '前年経準率(%)',
					field: 'mrgnRatePrev',
					cssClass: 'txtalign-right',
					width: 110,
					cellType: {
						formatFilter: 'comma'
					}
				},
				{
					name: '経準率(%)',
					field: 'mrgnRate',
					cssClass: 'txtalign-right',
					minWidth: 80,
					width: 80,
					cellType: {
						type: 'text',
						formatFilter: 'comma fixed:1',
						// limit: 'number:3,1',
						validator: 'required decimal:3,1',
						placeholder: clcom.getSysparam(
							'PAR_AMCM_DEFAULT_PERCENT_DECIMAL')
					}
				},
				{
					name: '前年平均コスト',
					field: 'aveCostPrev',
					cssClass: 'txtalign-right',
					width: 110,
					cellType: {
						formatFilter: 'comma'
					}
				},
				{
					name: '平均コスト',
					field: 'aveCost',
					cssClass: 'txtalign-right',
					minWidth: 90,
					width: 90,
					cellType: {
						type: 'text',
						formatFilter: 'comma',
						// limit: 'number:7',
						validator: 'required decimal:7 min:0'
					}
				}
			];
		},

		initialize: function(){
			_.bindAll(this, 'onUpdSuccess');
			this.initDataGrid();
		},

		setData: function(){
			this.dataGrid.setData({
				columns: this.getColumns(),
				rowDelToggle: false,
				data: MyApp.data.AMMPV0020GetRsp.seasonRec,
				gridOptions: {
					autoHeight: false,
					frozenColumn: 0
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

			this.upSeasonParamCtrl = clutil.View.OpeCSVInputController({
				btn: this.ui.upSeasonParam,
				buildCSVInputReqFunction: function(){
					var getReq = _.clone(MyApp.srchData.AMMPV0020GetReq);
					getReq.csvType = AMMPV0020Req.AMMPV0020_PARAM_CSV_SEASON;
					return {
						resId: clcom.pageId,
						data: {
							AMMPV0020GetReq: getReq
						}
					};
				}
			});
			this.listenTo(this.upSeasonParamCtrl, {
				done: function(data){
					MyApp.data.AMMPV0020GetRsp.seasonRec = data.AMMPV0020GetRsp.seasonRec;
					this.setData();
					this.checkModified();
				},
				fail: function(data){
					if (data.rspHead.uri){
						clutil.download(data.rspHead.uri);	//CSVダウンロード実行
					}
				}
			});

			this.savePreviousData();
		},

		initDataGrid: function(){
			this.dataGrid = new ClGrid.ClAppGridView({
				errorInside: true,
				attributes: {
					style: 'height: 400px'
				}
				// // 行削除ボタンを使用するフラグ。
				// delRowBtn: true,
				// // フッター部の新規行追加ボタンを使用するフラグ。
				// footerNewRowBtn: true
			});
			this.listenTo(this.dataGrid, this.gridEvents);
			this.dataGrid.render();
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
			dlSeasonBase: '.planAutoLink',
			// 最新計画ダウンロード
			dlSeasonLast: '.planInputLink',
			// 計画をアップロードする
			upSeasonPlan: '#ca_ul_season_plan'
		},

		regions: {
			seasonParamView: '#seasonParamView'
		},

		events: {
			// 自動按分計画ダウンロードする
			'click @ui.dlSeasonBase': function(){
				var getReq = _.clone(MyApp.srchData.AMMPV0020GetReq);
				getReq.planType = AMMPV0020Req.AMMPV0020_PLAN_AUTO;
				getReq.csvType = AMMPV0020Req.AMMPV0020_CSV_SEASON;
				getReq.version = MyApp.getLastVersion(MyApp.data.AMMPV0020GetRsp.seasonAutoVersionRec);
				clutil.postDLJSON({
					resId: 'AMMPV0020',
					data: {
						AMMPV0020GetReq: getReq
					}
				}).fail(this.onDlFail);
			},

			// 取込計画をダウンロードする(XXX最新計画ダウンロードする)
			'click @ui.dlSeasonLast': function(){
				var getReq = _.clone(MyApp.srchData.AMMPV0020GetReq);
				getReq.planType = AMMPV0020Req.AMMPV0020_PLAN_INPUT;
				getReq.csvType = AMMPV0020Req.AMMPV0020_CSV_SEASON;
				getReq.version = MyApp.getLastVersion(MyApp.data.AMMPV0020GetRsp.seasonInputVersionRec);
				clutil.postDLJSON({
					resId: 'AMMPV0020',
					data: {
						AMMPV0020GetReq: getReq
					}
				}).fail(this.onDlFail);
			},

			'click .planAutoMore': function(){
				var getRsp = MyApp.data.AMMPV0020GetRsp;
				var versionRecs = getRsp.seasonAutoVersionRec;
				var versionView = new MyApp.VersionView({
					collection: new Backbone.Collection(versionRecs),
					planType: AMMPV0020Req.AMMPV0020_PLAN_AUTO,
					csvType: AMMPV0020Req.AMMPV0020_CSV_SEASON,
					title: '自動按分計画バージョン一覧'
				});
				MyApp.showDialog(versionView);
			},
			'click .planInputMore': function(){
				var getRsp = MyApp.data.AMMPV0020GetRsp;
				var versionRecs = getRsp.seasonInputVersionRec;
				var versionView = new MyApp.VersionView({
					collection: new Backbone.Collection(versionRecs),
					planType: AMMPV0020Req.AMMPV0020_PLAN_INPUT,
					csvType: AMMPV0020Req.AMMPV0020_CSV_SEASON,
					title: '取込計画バージョン一覧'
				});
				MyApp.showDialog(versionView);
			},
			'click .ca_sample_download2': function(){
				clutil.download('/public/sample/シーズン別計画サンプル.xlsx');
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

		getActiveTab: function(){
			return this.$(".tabNavi li").index(this.$('.tabNavi li.on'));
		},

		serializeData: function(){
			var getRsp = MyApp.data.AMMPV0020GetRsp;

			return {
				planAuto: MyApp.getLastVersionRec(
					getRsp.seasonAutoVersionRec) || {},
				planInput: MyApp.getLastVersionRec(
					getRsp.seasonInputVersionRec) || {}
			};
		},

		onShow: function(){
			this.seasonParamView.show(new SeasonParamView());

			this.upSeasonPlanCtrl = clutil.View.OpeCSVInputController({
				btn: this.ui.upSeasonPlan,
				noDialogOnDone: true,
				buildCSVInputReqFunction: function(){
					var getReq = _.clone(MyApp.srchData.AMMPV0020GetReq);
					getReq.csvType = AMMPV0020Req.AMMPV0020_CSV_SEASON;
					return {
						resId: clcom.pageId,
						data: {
							AMMPV0020GetReq: getReq
						}
					};
				}
			});
			this.listenTo(this.upSeasonPlanCtrl, {
				done: function(){
					$.when(Controller.research()).done(function(){
						clutil.MessageDialog2('取込が完了しました。');
					});
				},
				fail: function(data){
					if (data.rspHead.uri){
						//CSVダウンロード実行
						clutil.download(data.rspHead.uri);
					}
				}
			});
			if (Controller.lastTab != null){
				this.setActiveTab(Controller.lastTab);
			}
		},

		onDlFail: function(data){
			clutil.mediator.trigger('onTicker', data);
		}
	});

	var MainView = Marionette.Layout.extend({
		template: '#MainView',

		events: {
			'click #search': function(){
				this.search();
			},
			// 検索条件を再指定ボタン押下
			'click #searchAgain': function(){
				if ($('#searchArea').css('display') == 'none') {
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
			searchArea: '#searchArea',
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

				clvarietycode: {
					el: '#ca_srchItgrpID'
				}
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
			_.extend(getReq, {
				reqType: AMMPV0020Req.AMMPV0020_REQTYPE_SEASON
			});
			var data = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},

				AMMPV0020GetReq: getReq
			};

			this.srchData = data;
			this._search();
		},

		_search: function(){
			if (this.srchData){
				return clutil.postJSON({
					resId: 'AMMPV0020',
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

		onSearchSuccess: function(data){
			MyApp.srchData = this.srchData;
			MyApp.data = data;
			this.srchAreaCtrl.show_result();
			this.changeSearchAreaState(false);
			Controller.showFooter();
			this.resultView.show(new ResultView());
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
