/* global MyApp: true */
$.inputlimiter.noTrim = true;


useSelectpicker2();
(function(MyApp){
	var APPID = 'AMSIV0030';

	// デバッグ用
	var triggerOnRspPage = (function(){
		var reqPage = {
			curr_record: 0,
			total_record: 125,
			page_size: 10
		};
		return function(){
			clutil.mediator.on('onPageChanged', function(gid, page){
				_.extend(reqPage, page);
			});

			clutil.mediator.trigger('onRspPage', APPID, reqPage);
		};
	}());

	$(".div_scroll").scroll(function() {
		$("#header_h").scrollLeft($(".div_scroll").scrollLeft());
		$("#header_v").scrollTop($(".div_scroll").scrollTop());
	});

	/**
	 * @class ResultModel
	 * @constructor
	 * @param model
	 * @param options
	 * @param options.reqParams
	 */
	var ResultModel = Backbone.Model.extend({
		initialize: function(model, options){
			this.itemList = new Backbone.Collection(this.get('itemList'));
			this.sizeList = new Backbone.Collection(this.get('sizeList'));
			this.unset('itemList');
			this.unset('sizeList');
			this.reqParams = options.reqParams;
		}
	});

	/**
	 * @class ItemListView
	 * @constructor
	 * @param options
	 * @param {ResultModel} options.model
	 */
	var ItemListView = Marionette.ItemView.extend({
		template: '#ItemListView',

		templateHelpers: function(){
			return {
				model: this.model,
				srchDispItem: parseInt(this.model.reqParams.AMSIV0030GetReq.srchDispItem, 10),
				dateFormat: clutil.dateFormat,
				getTotalDelivQy: function(delivList){
					return _.reduce(delivList, function(a, deliv){
						return a+deliv.delivQy;
					}, 0);
				},
				getTotalStockQy: function(delivList){
					return _.reduce(delivList, function(a, deliv){
						return a+deliv.stockQy;
					}, 0);
				},
				getTotalIdouQy: function(delivList){
					return _.reduce(delivList, function(a, deliv){
						return a+deliv.idouQy;
					}, 0);
				},
				getTotalNyukaQy: function(delivList){
					return _.reduce(delivList, function(a, deliv){
						return a+deliv.nyukaQy;
					}, 0);
				}
			};
		},

		onShow: function(){
			clutil.initUIelement(this.$el);
		}
	});

	/**
	 * @class ResultLayout
	 * @param options
	 * @param {ResultModel} options.model
	 */
	var ResultLayout = Marionette.Layout.extend({
		template: '#ResultLayout',

		ui: {
			pager1: '.pager1',
			pager2: '.pager2'
		},

		regions: {
			itemList: '.itemList'
		},

		onShow: function(){
			// ページャー
			this.ui.pager1.html(MyApp.pagerViews[0].el);
			this.ui.pager2.html(MyApp.pagerViews[1].el);

			// 入荷予定明細
			this.itemList.show(new ItemListView({
				model: this.model
			}));
		},

		onBeforeClose: function(){
			MyApp.pagerArea.empty()
				.append(this.ui.pager1)
				.append(this.ui.pager2);
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

			// タグコード
			// this.tagCode = new MyApp.TagCode({el: '#ca_srchTagCode'});

			// 商品展開年
			clutil.clyearselector({
				el: this.$('#ca_srchYear'),
				past: Number(clcom.getSysparam(amcm_sysparams.PAR_AMCM_YEAR_FROM)),
				future: Number(clcom.getSysparam(amcm_sysparams.PAR_AMCM_YEAR_TO))
			});

			this.relation = clutil.FieldRelation.create("default", {
				// シーズン
				'cltypeselector season': {
					el: '#ca_srchSeasonID',
					kind: amcm_type.AMCM_TYPE_SEASON
				},

				clorgcode: {
					el: '#ca_srchOrgID',
					dependAttrs: {
						f_stockmng: 1
					}
				},

				// 品種
				clvarietycode: {
					el: '#ca_srchItgrpID',
					rmDepends: ['unit_id'],
					addDepends: ['org_id']
				},

				// 期間
				'cltypeselector delivTerm': {
					el: '#ca_srchDelivTermTypeID',
					kind: amcm_type.AMCM_TYPE_DELIV_TERM
				},

				// メーカー
				clvendorcode: {
					el: '#ca_srchMakerID'
				},

				// メーカー品番
				text: {
					el: '#ca_srchMakerHinban'
				},

				// サブ1
				'clitemattrgrpcode sub1': {
					el: '#ca_srchSub1ID',
					dependSrc: {
						iagfunc_id: 'iagfunc.sub1'
					}
				},

				// サブ2
				'clitemattrgrpcode sub2': {
					el: '#ca_srchSub2ID',
					dependSrc: {
						iagfunc_id: 'iagfunc.sub2'
					}
				},

				// カラー
				'clitemattrgrpcode color': {
					el: '#ca_srchColorID',
					dependSrc: {
						iagfunc_id: 'iagfunc.color'
					}
				},

                // プライスライン
                'select priceline': {
                    el: "#ca_srchPriceline",
                    depends: ['itgrp_id', 'ymd'],
					dependSrc: {
						ymd: 'delivTerm'
					},
					checkAttrs: function(attrs) {
						return !parseInt(attrs.itgrp_id, 10);
					},
					buildAttrs: function(attrs){
						return {
							itgrp_id: attrs.itgrp_id,
							ymd: MyApp.delivTerm2Date[attrs.ymd || 0]
						};
					},
                    getItems: function (attrs) {
						console.log(attrs);
                        var ret = clutil.clpriceline({
							itgrpID: attrs.itgrp_id,
							srchFromDate: attrs.ymd
						});
                        return ret.then(function (data) {
                            return _.map(data.list, function(item) {
                                return {
                                    id: item.pricelineID,
                                    code: item.pricelineCode,
                                    name: item.pricelineName
                                };
                            });
                        });
                    }
                }

			}, {
				dataSource: {
					myYmd: clcom.getOpeDate(),
					unit_id: MyApp.UNIT_ID,
					orgfunc_id: MyApp.ORG_FUNC_ID,
					orglevel_id: MyApp.ORG_LEVEL_ID,
					vendor_typeid: amdb_defs.MTTYPE_F_VENDOR_MAKER,
					'iagfunc.sub1': amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SUBCLASS1,
					'iagfunc.sub2': amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SUBCLASS2,
					'iagfunc.color': amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_COLOR
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
					view.relation.set('clorgcode', item);
					view.relation.reset();
				}
				_.defer(function(){
					$('#ca_btn_store_select').focus();
				});
			};

			// // 初期値を設定
			this.deserialize({
				srchDispItem: 1
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
			return this.validator.valid();
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
		},

		// 詳細条件を入力
		ca_detailExpand_click : function(){
			this.$('.fieldUnitsHidden').slideToggle();
			this.$('#ca_detailExpand').find('span').fadeToggle();
			if ($('#ca_srchTagCode').prop('disabled') === false) {
				$('#ca_srchTagCode').prop('disabled', true).val('');
			}else{
				$('#ca_srchTagCode').prop('disabled', false);
			}
		},

		_eof: 'AMSIV0010.SrchCondView//'
	});

	// View
	var MainView = MyApp.MainView = Backbone.View.extend({
		el:	'#ca_main',

		events: {
			// 検索条件を再指定ボタン押下
			'click #searchAgain': function(){
				this.hideFooter();
				this.srchAreaCtrl.show_srch();
				this.resetFocus();
			},
		},

		// 検索パネル srchCondView から検索ボタン押下イベント
		clMediatorEvents: {
			ca_onSearch: function(srchReqDto) {
				var req = this.buildReq(srchReqDto);
				this.doSrch(req);		// 検索実行
			},

			onPageChanged: function(gid, pageReq){
				if (this.savedReq){
					var onAMSIV0030Rsp = _.bind(
						this.onAMSIV0030Rsp,
						this,
						this.savedReq);
					clutil.postJSON(gid, {
						AMSIV0030GetReq: this.savedReq.AMSIV0030GetReq,
						reqHead: this.savedReq.reqHead,
						reqPage: pageReq
					})
						.done(onAMSIV0030Rsp)
						.fail(this.failOnSrch);
						// .done(triggerOnRspPage); // XXXX
				}
			},

			onOperation: function(opetype){
				if (opetype === am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV){
					// CSV出力
					var req = this.buildReq();
					req.reqHead.opeTypeId = opetype;
					clutil.postDLJSON({
						resId: clcom.pageId,
						data: req,
						timeout: 600000
					})
						.fail(this.failOnSrch);
				}
			}
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '入荷予定照会',
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

			// ウィンドウリサイズイベント
			window.addEventListener('resize', _.bind(function(e) {
				if (this.resizeTimer !== false) {
					clearTimeout(this.resizeTimer);
				}
				this.resizeTimer = setTimeout(_.bind(function() {
					this.tableResize();
				}, this));
			}, this));
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
			this.tableResize();
			// チェックボックス初期化
			$("#ca_srchFlagZero").prop('checked', true).closest("label").addClass("checked");
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
			// 商品名条件の半角を全角に変換する
			if (srchReq.srchItemName != null) {
				srchReq.srchItemName = clutil.han2zen(srchReq.srchItemName);
			}

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				reqPage: _.first(MyApp.pagerViews).buildReqPage0(),
				AMSIV0030GetReq: srchReq
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
			this.srchOrgID = this.srchCondView.relation.get('clorgcode');
			var that = this;
			return clutil.postJSON('AMSIV0030', srchReq)
				.done(function(data){
					if (_.isEmpty(data.AMSIV0030GetRsp.itemList)) {
						that.failOnSrch(clmsg.cl_nodata);
						return;
					}
					// 結果ペインを表示
					that.srchAreaCtrl.show_result();
					// 検索結果の表示
					that.onAMSIV0030Rsp(srchReq, data);

					_.defer(_.bind(function() {
						// テーブルリサイズ
						that.tableResize();
						that.tableRowResize();
					}, this));
				})
				.fail(this.failOnSrch);
		},

		onAMSIV0030Rsp: function(srchReq, data){
			// レスポンスを保存。
			this.savedRsp = _.deepClone(data);
			// リクエストを保存。
			this.savedReq = srchReq;
			// sizeListからitemList.delivListを沸かす
			this.makeDelivList(srchReq, data.AMSIV0030GetRsp);

			// XXXX
			// triggerOnRspPage();

			// モデルの保存
			// this.model = new ResultModel(dummyData.AMSIV0030GetRsp, {
			// 	reqParams: srchReq
			// }); // XXXX
			this.model = new ResultModel(data.AMSIV0030GetRsp, {
				reqParams: srchReq
			});
			// 描画
			MyApp.resultArea.show(new ResultLayout({
				model: this.model
			}));
			// フォーカス
			this.resetFocus();
			this.showFooter();

			this.tableWidthResize(srchReq, data);
			_.defer(_.bind(function() {
				// テーブルリサイズ
				this.tableResize();
			}, this));

			// イベント追加
			$(".div_scroll").scroll(function() {
				$("#header_h").scrollLeft($(".div_scroll").scrollLeft());
				$("#header_v").scrollTop($(".div_scroll").scrollTop());
			});
		},

		/**
		 * 入荷予定リストをサイズリスト順にソート
		 * @param srchReq
		 * @param data
		 */
		makeDelivList: function(srchReq, data) {
			// 各商品でサイズIDをキーに入荷予定のマップを作成
			_.each(data.itemList, _.bind(function(item) {
				item.sizemap = {};
				_.each(item.delivList, _.bind(function(deliv) {
					item.sizemap[deliv.sizeID] = deliv;
				}, this));
			}, this));

			_.each(data.itemList, _.bind(function(item) {
				var newdelivlist = [];
				_.each(data.sizeList, _.bind(function(size) {
					var deliv = item.sizemap[size.sizeID];
					if (deliv == null) {
						deliv = {
							itemID: item.itemID,
							sizeID: size.sizeID,
							sizePtnID: size.sizePtnID,
							row: size.row,
							column: size.column,
							sizeCode: size.sizeCode,
							stockQyFlag: 0,
							stockQy: 0,
							delivQy: 0,
							idouQy: 0,
							nyukaQy: 0,
						};
					}
					newdelivlist.push(deliv);
				}, this));
				item.saveDelivList = item.delivList;
				item.delivList = newdelivlist;
			}, this));
		},

		// 検索に失敗した場合、検索結果を閉じて検索エリアを開く。ティッカーも表示する。
		failOnSrch: function(data){
			MyApp.getRegion('resultArea').close();
			this.srchAreaCtrl.show_srch();			// 検索ペインを表示
			clutil.mediator.trigger('onTicker', data);	// エラーメッセージを通知。
			this.resetFocus();
			this.hideFooter();
			$("#p_memo1").remove();	// メモを消去
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

			// 確定時用のデータを初期化
			this.savedReq = null;

			// 前回レスポンスのクリア
			this.savedReq = null;
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
				// _.defaults(srchReq.AMSIV0030GetReq, {
				// 	srchMakerHinban: ''
				// });
				_.defaults(model.savedReq, {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					reqPage: _.first(MyApp.pagerViews).buildReqPage0()
				});
				this.doSrch(model.savedReq, model.chkData);
			}
		},

		showFooter: function(){
			_.extend(this.mdBaseView.options, {
				btn_csv: !MyApp.isStoreUser
			});
			this.mdBaseView.renderFooterNavi();
		},

		hideFooter: function(){
			_.extend(this.mdBaseView.options, {
				btn_csv: false
			});
			this.mdBaseView.renderFooterNavi();
		},

		tableWidthResize: function(req, data) {
			console.log(req);
			console.log(data);

			var sizeList = data.AMSIV0030GetRsp.sizeList;

			var w1 = 0,
				w2 = 0;
			if (req.AMSIV0030GetReq.srchDispItem == 1) {
				w1 = 40;
				w2 = 80;
			} else {
				w1 = 45;
				w2 = 45;
			}
			var width = w2 + sizeList.length * w1;
			var now_width = $("#h_fix_header").width();
			if (width < now_width) {
				$("#h_fix_header").css('width', width);
				$("#h_fix_tbl").css('width', width);
			}
		},

		/**
		 * テーブルリサイズ処理
		 */
		tableResize: function() {
			var $p;
			var display = $("#ca_srchArea").css('display');
			if (display == 'none') {
				$p = $("#resultArea");
			} else {
				$p = $("#ca_srchArea").parent();
			}
			var width = $p.width() - 880;
			$("#header_h").css('width', width);
			$("#data").css('width', width+17);

			var $h_fix_header = $("#h_fix_header");

			width = $h_fix_header.width();
			$("#h_fix_tbl").css('width', width);
		},

		tableRowResize: function() {
			var $tbody = $("#ca_table_tbody");

			_.each($tbody.find('tr'), _.bind(function(t) {
				var $tr = $(t);
				var max_height = 0;
				_.each($tr.find('td'), _.bind(function(d) {
					// 各行の最大高さを取得する
					var $td = $(d);
					var height = $td.outerHeight();
					if (max_height < height) {
						max_height = height;
					}
				}, this));
				$tr.find('td').css('height', max_height);
			}, this));
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
		clutil.getIniJSON()
			.then(function(){
				return $.when(
					clutil.ymd2week(clcom.getOpeDate(), 0),
					clutil.ymd2week(clcom.getOpeDate(), 1),
					clutil.ymd2week(clcom.getOpeDate(), 2)
				).done(function(w0, w1, w2){
					MyApp.delivTerm2Date = [
						w0.start_date,
						w0.start_date,
						w1.start_date,
						w2.start_date
					];
				});
			})
			.done(function(){
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

				var relation = mainView.srchCondView.relation;
				relation.done(function(){
					if (MyApp.isStoreUser){
						clutil.inputReadonly(relation.fields.clorgcode.$el);
						clutil.inputReadonly('#ca_btn_store_select');
					}
					MyApp.trigger('resetFocus');
				});
			})
			.fail(function(data){
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
			srchDelivTermTypeID: "1",
			srchDispItem: "1",
			srchItgrpID: {
				id: 111, name: 'xxx', code: 'yyy'
			},
			srchMakerID: {
				id: 3, name: '3', code: '3'
			},
			srchColorID: {
				id: 12,name:'12', code: '12'
			},
			srchOrgID: {
				id: 1001,name:'1001', code: '1001'
			}
		});
	};
	clutil.mediator.on('onTicker', function(){
		console.trace();
	});
}(MyApp));
