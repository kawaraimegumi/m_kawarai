/* global MyApp: true */
$.inputlimiter.noTrim = true;
useSelectpicker2();

(function(MyApp, amcm_type){
	var APPID = 'AMSIV0040';

	var ItemView = MyApp.ItemView;
	
	/**
	 * @class ResultModel
	 * @constructor
	 * @param model
	 * @param options
	 * @param options.reqParams
	 */
	var ResultModel = Backbone.Model.extend({
		initialize: function(model, options){
			this.item = new Backbone.Model(this.get('item'));
			this.slipList = new Backbone.Collection(this.get('slipList'));
			this.dayList = new Backbone.Collection(this.get('dayList'));
			this.unset('item');
			this.unset('slipList');
			this.unset('dayList');
			this.reqParams = options.reqParams;
		}
	});

	/**
	 * 伝票情報レコード
	 * @class SlipListView
	 * @constructor
	 */
	var SlipListView = Marionette.ItemView.extend({
		template: '#SlipListView',

		attributes: {
			style: 'overflow-y:auto;'
		},
		
		templateHelpers: function(){
			return {
				model: this.model,
				item: this.options.item,
				getSlipTypeName: function(slipId){
					return clutil.gettypename(amcm_type.AMCM_TYPE_DISPSLIP_TYPE, slipId, true);
				},
				dateFormat: clutil.dateFormat,
				timeFormat: clutil.timeFormat,
				comma: clutil.comma
			};
		}
	});

	/**
	 * 受払情報レコード
	 * @class DayListView
	 * @constructor
	 */
	var DayListView = Marionette.ItemView.extend({
		template: '#DayListView',
		
		events: {
			// 行がクリックされた
			"click table tr[id]": function(e){
				e.preventDefault();
				e.stopPropagation();
				var id = $(e.target).closest('tr').attr('id');
				var item = this.collection.get(id);
				if (item){
					MyApp.trigger("DayListView:row:click", item);
				}
			}
		},
		
		templateHelpers: function(){
			return {
				dayList: this.collection,
				dateFormat: clutil.dateFormat,
				comma: clutil.comma
			};
		}
	});
	/**
	 * @class ResultLayout
	 * @param options
	 * @param {ResultModel} options.model
	 */
	var ResultLayout = Marionette.Layout.extend({
		template: '#ResultLayout',

		regions: {
			itemView: '.itemView',
			dayListView: '.dayListView'
		},

		onShow: function(){
			this.itemView.show(new ItemView({
				model: this.model.item
			}));

			this.dayListView.show(new DayListView({
				collection: this.model.dayList
			}));
		}
	});
	
	/**
	 * 条件入力部
	 * @class SrchCondView
	 * @constructor
	 */
	var SrchCondView = Backbone.View.extend({
		el: '#ca_srchArea',

		events: {
			// 検索ボタン押下時
			'click #searchStock': 'search',
			// 詳細条件を入力
			'click #ca_detailExpand': 'ca_detailExpand_click',
			"click #ca_btn_store_select": function () {
				this.AMPAV0010Selector.show(null, null, {
					org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
								   am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
								   am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
					f_stockmng: 1
				});
			}
		},

		initialize: function(){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var view = this;

			// 店舗選択
			this.orgcode = clutil.clorgcode({
				el: '#ca_srchOrgID',
				dependAttrs: {
					orgfunc_id: MyApp.ORG_FUNC_ID,
					orglevel_id: MyApp.ORG_LEVEL_ID,
					f_stockmng: 1
				}
			});

			// 店舗選択画面
			this.AMPAV0010Selector = new window.AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});
			this.AMPAV0010Selector.render();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					var item = data[0];
					item.id = item.val;
					view.orgcode.setValue(item);
				}
				_.defer(function(){
					$('#ca_btn_store_select').focus();
				});
			};

			// 対象期間
			clutil.datepicker($("#ca_srchStDate"));
			clutil.datepicker($("#ca_srchEdDate"));
			
			// // 初期値を設定
			this.deserialize({
				srchZeroChk: 1,
				srchStDate: clutil.addDate(clcom.getOpeDate(), -60),
				srchEdDate: clcom.getOpeDate()
			});
		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			return clutil.view2data(this.$el);
		},

		/**
		 * 検索リクエストパケットの設定値を UI へセットする。
		 */
		deserialize: function(obj){
			var dto = _.extend({}, obj);
			if (MyApp.isStoreUser) {
				// 店舗ユーザーの場合は自店舗のみ
				dto.srchOrgID = {
					id: clcom.userInfo.org_id,
					name: clcom.userInfo.org_name,
					code: clcom.userInfo.org_code
				};
			}
			clutil.data2view(this.$el, dto);
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			var ok = this.validator.valid();
			if (ok){
				var data = this.serialize();
				var diff = clutil.diffDate(data.srchEdDate, data.srchStDate) + 1;
				if (diff > 400){
					ok = false;
					this.validator.setErrorMsg(this.$('#ca_srchStDate'),
											   clutil.fmt(
												   clmsg.ESI0001,
												   diff));
					this.validator.setErrorMsg(this.$('#ca_srchEdDate'),
											   clutil.fmt(
												   clmsg.ESI0001,
												   diff));
				}else if (diff < 0){
					ok = false;
					this.validator.setErrorMsg(
						this.$('#ca_srchStDate'),
						clmsg.cl_date_error);
					this.validator.setErrorMsg(
						this.$('#ca_srchEdDate'),
						clmsg.cl_date_error);
				}
			}
			if (!ok){
				this.validator.setErrorHeader(clmsg.cl_echoback);
			}
			return ok;
		},

		/**
		 * 検索ボタン押下処理
		 */
		search: function() {
			// 取引先コード・オートコンプリート設定チェック
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		}
	});

	// View
	var MainView = MyApp.MainView = Backbone.View.extend({
		el:	'#ca_main',

		events: {
			// 検索条件を再指定ボタン押下
			'click #searchAgain': function(){
				this.srchAreaCtrl.show_srch();
				this.resetFocus();
			}
		},

		// 検索パネル srchCondView から検索ボタン押下イベント
		clMediatorEvents: {
			ca_onSearch: function(srchReqDto) {
				var req = this.buildReq(srchReqDto);
				this.doSrch(req);		// 検索実行
			}
		},

		appEvents: {
			'DayListView:row:click': function(model){
				var date = model.get('date');
				var getReq = _.extend({}, MyApp.model.savedReq.AMSIV0040GetReq, {
					srchStDate: date,
					srchDtlFlag: 1,
					srchItemID: MyApp.model.item.get('itemID')
				});

				var view = this;
				clutil.postJSON(APPID, {
					reqHead: MyApp.model.savedReq.reqHead,
					AMSIV0040GetReq: getReq
				})
					.done(function(data){
						view.showSlipList(data, model);
					})
					.fail(this.failOnSrch);
			}			
		},

		// sliplistを表示する
		showSlipList: function(data, item){
			var model = new ResultModel(data.AMSIV0040GetRsp, {
				reqParams: MyApp.model.savedReq
			});

			var slipListView = new SlipListView({
				model: model,
				item: item
			});
			MyApp.showDialog(slipListView);
		},
		
		initialize: function(){
			_.bindAll(this);

			// タグコード
			// this.tagCode = new MyApp.TagCode({el: '#ca_srchTagCode'});
			
			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '商品管理履歴照会',
				opeTypeId: clcom.pushpop.popable ? -1 : am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				btn_csv: false,
				btn_submit: false
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// clutil.mediatorのイベント
			this.listenTo(clutil.mediator, this.clMediatorEvents);

			// MyAppのイベント
			this.listenTo(MyApp, this.appEvents);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();

			// ページャ
			MyApp.pagerArea = $('#pagerArea');
			MyApp.pagerViews = _.invoke(
				clutil.View.buildPaginationView(APPID, MyApp.pagerArea),
				'render');
			
			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
				this.srchCondView.$el,
				this.srchCondView.$('#ca_srch'),	// 検索条件領域
				this.$('#resultWrapper'),				// 検索結果表示領域
				this.$('#searchAgain'));			// 検索条件を開く部品
			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.srchCondView.render();
			this.resetFocus();
			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				if(this.srchCondView.isValid()){
					srchReq = this.srchCondView.serialize();
				}else{
					return;	// メッセージは、srchConcView 側で出力済。
				}
			}
			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// reqPage: _.first(MyApp.pagerViews).buildReqPage0(),
				AMSIV0040GetReq: srchReq
			};
			return req;
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq){
			this.clearResult();
			this.srchOrgID = this.srchCondView.orgcode.getValue();
			var that = this;

			this.srchReq = srchReq;
			return clutil.postJSON(APPID, srchReq)
				.done(function(data){
					// 結果ペインを表示
					that.srchAreaCtrl.show_result();
					// 検索結果の表示
					that.onRsp(data);
				})
				.fail(this.failOnSrch);
		},

		onRsp: function(data){
			var model = MyApp.model = new ResultModel(data.AMSIV0040GetRsp, {
				reqParams: this.srchReq
			});
			// レスポンスを保存。
			model.savedRsp = data;
			// リクエストを保存。
			model.savedReq = this.srchReq;
			
			// 描画
			MyApp.resultArea.show(new ResultLayout({
				model: MyApp.model
			}));
			// フォーカス
			this.resetFocus();
		},
		
		// 検索に失敗した場合、検索結果を閉じて検索エリアを開く。ティッカーも表示する。
		failOnSrch: function(data){
			MyApp.getRegion('resultArea').close();
			this.srchAreaCtrl.show_srch();			// 検索ペインを表示
			clutil.mediator.trigger('onTicker', data);	// エラーメッセージを通知。
			this.resetFocus();
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if (!$focusElem){
				$focusElem = $("#ca_srchOrgID");
			}
			clutil.setFirstFocus($focusElem);
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();
			MyApp.model = null;
		},

		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(model) {
			// 条件部の復元
			if(!_.isEmpty(model.savedCond)){
				this.srchCondView.deserialize(model.savedCond);
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				_.defaults(model.savedReq, {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					}
					// reqPage: _.first(MyApp.pagerViews).buildReqPage0()
				});
				this.doSrch(model.savedReq, model.chkData);
			}

		},

		_eof: 'AMSSV0310.MainView//'
	});

	MyApp.addRegions({
		resultArea: '#resultArea'
	});
	
	// ================
	// 開始
	$(function(){
		// Enterキーによるフォーカスをする。
		clutil.enterFocusMode();

		//--------------------------------------------------------------
		// 初期データ取得
		clutil.getIniJSON().done(function(){
			MyApp.start();
			
			// ここで、clcom の内容が保証される /////////////////
			var mainView = MyApp.mainView = new MainView()
					.initUIElement()
					.render();

			if(clcom.pageData){
				// 保存パラメタがある場合
				// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
				mainView.load(clcom.pageData);
			} else if (clcom.pageArgs) {
				// 他の画面から遷移した場合
				mainView.load(clcom.pageArgs);
			}
			
			if (MyApp.isStoreUser){
				clutil.inputReadonly(mainView.srchCondView.orgcode.$el);
				clutil.inputReadonly('#ca_btn_store_select');
			}
			MyApp.trigger('resetFocus');
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

	// ================
	// テストコード
	MainView.boo = function(){
		clutil.data2view($('#ca_srchArea'), {
			srchOrgID: {
				id: 1001,name:'1001', code: '1001'
			},
			srchStDate: 20140601,
			srchEdDate: 20140630,
			srchTagCode: "2000001537091",
			srchZeroChk: 1
		});
	};
}(MyApp, amcm_type));
