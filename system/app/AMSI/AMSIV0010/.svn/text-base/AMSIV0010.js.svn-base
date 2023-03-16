/* global MyApp: true */
$.inputlimiter.noTrim = true;
useSelectpicker2();

var APPID = 'AMSIV0010';
(function(MyApp){
	MyApp.srchFuncType = 1;

	var TagCode = MyApp.TagCode,
		ResultModel = MyApp.ResultModel,
		SelectListView = MyApp.SelectListView,
		ResultLayout = MyApp.ResultLayout,
		HelpListView = MyApp.HelpListView;

	var ColorSizeEditView = MyApp.ColorSizeEditView;

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: '#ca_srchArea',

		events: {
			// 検索ボタン押下時
			'click #searchStock': 'search',
			// タグコードの全角->半角対応
			"blur  #ca_srchTagCode"	: "_onBlurSrchTagCode",
			// 詳細条件を入力
			'click #ca_detailExpand': 'ca_detailExpand_click',
			"click #ca_btn_store_select": function () {
				this.AMPAV0010Selector.show(null, null, {
					org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
								   am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
								   am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
					f_stockmng: 1
				});
			},
			'click .caTagBtn': function(e){
				var tagNo = $(e.currentTarget).attr('tagno'),
					region = MyApp[tagNo];

				if (region.currentView){
					// 開いてるときは閉じるだけ
					region.close();
					return;
				}

				this.showColorSizeArea(tagNo);
			}
		},

		appEvents: {
			'tagCode:change': function(item, tagNo, tagCode){
				var view = this,
					colorSizeView = MyApp[tagNo].currentView;
				if (colorSizeView){
					view.showColorSizeArea(tagNo);
				} else {
					/*  タグコード変更で検索するときは以下コメント外す */
					/*
					if (tagCode && tagCode.length >= 13) {
						view.search();
					}
					 */
				}
			}
		},

		getColorSizeItemIDByTagNo: function(tagNo){
			var view = MyApp[tagNo].currentView;
			if (view){
				var attrs = view.relation.fields.clsizeselector.getAttrs();
				return attrs && attrs.colorSizeItemID;
			}
		},

		closeColorSizeArea: function(){
			var region = MyApp.srchTagCode;
			if (region.currentView){
				region.close();
			}
		},

		showColorSizeArea: function(tagNo){
			var region = MyApp[tagNo];

			if (!this.validator.valid()){
				return;
			}
			var data = this.serialize();
			if (!data.srchOrgID || !data[tagNo]){
				// 入力が足りないときは
				clutil.mediator.trigger('onTicker', 'タグコードを入力してください');
				this.validator.setErrorMsg(
					$('#ca_' + tagNo),
					clutil.fmt(clmsg.cl_required));

				region.close();
				return;
			}

			var view = this;
			var onFail = function(){
				view.validator.setErrorMsg($('#ca_' + tagNo), clmsg.EGM0026);
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);	// エラーメッセージを通知。
				region.close();
			};

			var tagCode = data[tagNo];
			clutil.postJSON('am_pa_taginfo', {
				code: tagCode,
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				}
			}).done(function(data){
				if (data.head.status){
					return onFail(data);
				}

				var item = _.extend({}, data.rec, {
					tagCode: data.rec.colorSizeItemCode,
					itemID: data.rec.colorSizeItemID,
					size: data.rec.sizeName,
					mtItemID: data.rec.itemID,
					itgrpCode: data.rec.varietyCode,
					itgrpName: data.rec.varietyName,
					makerHinban: data.rec.makerItemCode
				});
				var model = new Backbone.Model(item);
				// タグの保存
				MyApp.trigger('AMSIV0010:addTag', model);
				region.show(new ColorSizeEditView({
					model: model
				}));
			}).fail(onFail);
		},

		initialize: function(){
			_.bindAll(this);

			// MyAppのイベント
			this.listenTo(MyApp, this.appEvents);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var view = this;

			// // 事業ユニット取得
			// clutil.clbusunitselector('#ca_srchUnitID');

			this.tagCode = new TagCode({el: '#ca_srchTagCode', tagNo: 'srchTagCode'});

			// 商品展開年
			clutil.clyearselector({
				el: '#ca_srchYear',
				past: Number(clcom.getSysparam(amcm_sysparams.PAR_AMCM_YEAR_FROM)),
				future: Number(clcom.getSysparam(amcm_sysparams.PAR_AMCM_YEAR_TO))
			});
			// シーズン
			clutil.cltypeselector({
				el: '#ca_srchSeasonID',
				kind: amcm_type.AMCM_TYPE_SEASON
			});

			this.relation = clutil.FieldRelation.create("default", {
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

				// メーカー
				clvendorcode: {
					el: '#ca_srchMakerID'
				},

				// メーカー品番
				'text makerHinban': {
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

				'node foo': {
					depends: 'sub1',
					onDependChange: function(attrs){
						console.log('%%%%%%%%%%%%%%%%', attrs);
					}
				},

				// カラー
				'clitemattrgrpcode color': {
					el: '#ca_srchColorID',
					dependSrc: {
						iagfunc_id: 'iagfunc.color'
					}
				}
			}, {
				dataSource: {
					ymd: clcom.getOpeDate,
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

			// 初期値を設定
			this.deserialize({});
		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			var data = clutil.view2data(this.$el);
			data.srchTagCode = this.tagCode.$el.val();
			data.srchItemID = this.getColorSizeItemIDByTagNo("srchTagCode");
			return data;
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
			this.resetElementValidation();
			var valid = this.validator.valid();
			if (this.isDetailOpen()){
				var data = this.serialize();
				if (!data.srchItgrpID &&
					!data.srchMakerHinban &&
					!data.srchMakerID &&
					!data.srchSub1ID &&
					!data.srchSub2ID &&
					!data.srchColorID &&
					!data.srchSeasonID &&
					!data.srchYear &&
					!data.srchSizeName){
					clutil.mediator.trigger('onTicker', clmsg.ESI0002);
					valid = false;
				}
			}
			return valid;
		},

		/**
		 * タグコードのフォーカスはずれ
		 */
		_onBlurSrchTagCode:function(e){
			var $el = $(e.target);
			var val = $el.val();

			// 入力内容変換
			this.validator.clearErrorMsg($el);
			val = clutil.zen2han(val);
			$el.val(val);
		},

		/**
		 * 入力検証用のクラスを状態に応じて付ける
		 */
		resetElementValidation: function(){
			// 詳細が開いている場合はタグコードは必須でない
			if (this.isDetailOpen()){
				clutil.Validators.removeValidation(this.tagCode.$el, 'required');
				this.tagCode.$el.closest('.fieldUnit').removeClass('required');
				this.closeColorSizeArea();
			}else{
				clutil.Validators.addValidation(this.tagCode.$el, 'required');
				this.tagCode.$el.closest('.fieldUnit').addClass('required');
			}
			clutil.inputReadonly(this.$('.caTagBtn'), this.isDetailOpen());
			this.validator.clear();
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
				this.detailOpened = true;
				this.resetFocus(this.$('#ca_srch2'));
			}else{
				$('#ca_srchTagCode').prop('disabled', false);
				clutil.data2view($('#ca_srch2'), {});
				this.detailOpened = false;
				this.resetFocus(this.$el);
			}
			this.resetElementValidation();
		},

		/**
		 * 詳細条件が開いているかどうか
		 */
		detailOpened: false,

		/**
		 * 詳細条件が開いているかどうか
		 */
		isDetailOpen: function(){
			return this.detailOpened;
		},

		resetFocus: function(view){
			MyApp.trigger('resetFocus', view);
		},

		_eof: 'AMSIV0010.SrchCondView//'
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
			// セットアップ、... がクリックされた
			showSelectList: function(args){
				var that = this;
				clutil.postJSON(APPID, {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
						fieldId: 0
					},
					AMSIV0010GetReq: {
						srchFuncType: 1,
						srchReqType: 3,
						srchFlag: args.srchFlag,
						srchItemID: args.item.get('itemID')
					}
				})
					.done(function(data){
						that.successOnSelectList(data, args.srchFlag);
					})
					.fail(this.onSelectListFail);
			},

			// 候補リストの行がクリックされた
			'selectList:click': function(args){
				var attrs = args.item.toJSON();
				clcom.pushPage({
					url: '../AMSIV0010/AMSIV0010.html',
					args: {
						savedCond: {
							srchOrgID: this.srchOrgID,
							srchMakerHinban: attrs.makerHinban,
							srchItgrpID: {
								id: attrs.itgrpID,
								code: attrs.itgrpCode,
								name: attrs.itgrpName
							}
						}
					},
					newWindow: true
				});
			},

			// 詳細条件補助リストの行がクリックされた
			'helpList:row:click': function(args){
				var attrs = args.item.toJSON();
				if(this.srchOrgID&&this.srchOrgID.id){
					this.doSrch({
						reqHead: {
							opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
							fieldId: 0
						},
						AMSIV0010GetReq: {
							srchFuncType: 1,
							srchReqType: 2,
							srchItemID: attrs.itemID,
							srchOrgID: this.srchOrgID.id
						}
					});
				}
			},

			// サイズが変更れたとき
			'size:click': function(item){
				if(this.srchOrgID&&this.srchOrgID.id){
					this.doSrch({
						reqHead: {
							opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
							fieldId: 0
						},
						AMSIV0010GetReq: {
							srchFuncType: 1,
							srchReqType: 2,
							srchItemID: item.itemID,
							srchOrgID: this.srchOrgID.id
						}
					});
				}
			},

			// 入荷予定明細リンク
			'show:AMPAV0030': function(item){
				var attrs = item.toJSON();
				clcom.pushPage({
					url: '../AMSIV0030/AMSIV0030.html',
					args: {
						savedCond: {
							srchOrgID: this.srchOrgID,
							srchTagCode: attrs.tagCode,
							srchItgrpID: {
								id: attrs.itgrpID,
								code: attrs.itgrpCode,
								name: attrs.itgrpName
							},
							srchDispItem: 1
						},
						savedReq: {
							AMSIV0030GetReq: {
								srchOrgID: this.srchOrgID.id,
								srchTagCode: attrs.tagCode,
								srchItgrpID: attrs.itgrpID,
								srchDispItem: 1
							}
						}
					},
					newWindow: true
				});
			},

			// 商品履歴管理照会リンク
			'show:AMPAV0040': function(item){
				var attrs = item.toJSON();
				clcom.pushPage({
					url: '../AMSIV0040/AMSIV0040.html',
					args: {
						savedCond: {
							srchZeroChk: 1,
							srchOrgID: this.srchOrgID,
							srchTagCode: attrs.tagCode,
							srchStDate: clutil.addDate(clcom.getOpeDate(), -182),
							srchEdDate: clcom.getOpeDate()
						},
						savedReq: {
							AMSIV0040GetReq: {
								srchZeroChk: 1,
								srchOrgID: this.srchOrgID.id,
								srchTagCode: attrs.tagCode,
								srchStDate: clutil.addDate(clcom.getOpeDate(), -182),
								srchEdDate: clcom.getOpeDate()
							}
						}
					},
					newWindow: true
				});
			}
		},

		/**
		 * 候補リストダイアログの表示
		 * @method showSelectListDialog
		 * @param {Object} data - サーバレスポンス
		 */
		successOnSelectList: function(data, srchFlag){
			var rsp = data.AMSIV0010GetRsp;

			// 空の場合はエラーを表示
			if (_.isEmpty(rsp.selectList)){
				this.failOnSelectList(clmsg.cl_no_data);
				return;
			}

			var model = new ResultModel(rsp);

			var selectView = new SelectListView({
				srchFlag: srchFlag,
				collection: model.selectList
			});
			MyApp.showDialog(selectView);
			// clutil.MessageDialog(selectView.render().el);
			// $(".cl_dialog .btnBox").hide();
		},

		/**
		 * 候補リスト検索でエラー
		 */
		failOnSelectList: function(data){
			// エラーメッセージを通知。
			clutil.mediator.trigger('onTicker', data);
		},

		initialize: function(){
			_.bindAll(this);
			var opeTypeId = -1;
			var backBtnURL = clcom.homeUrl;
			if (clcom.is_iPad() || clcom.is_iPhone()) {
				backBtnURL = false;
			} else if (!clcom.pushpop.popable) {
				opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
			}

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '商品在庫照会',
				subtitle: false,
				btn_new: false,
				backBtnURL: backBtnURL,
				opeTypeId: opeTypeId

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
			srchReq.srchFuncType = 1;
			srchReq.srchReqType = 1;
			srchReq.srchFlag = 1;
			if (srchReq.srchItemID != null) {
				// srchItemIDが設定されている場合は「２：詳細条件補助画面で選択さ
				// れたタグコード（商品）での検索」
				srchReq.srchReqType = 2;
			}
			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
				AMSIV0010GetReq: srchReq
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
			var defer = clutil.postJSON('AMSIV0010', srchReq).done(_.bind(function(data){
				this.srchOrgID = this.srchCondView.relation.get('clorgcode');

				var rsp = data.AMSIV0010GetRsp;

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。
				// 「検索結果は0件です。」
				if (_.isEmpty(rsp.itemList) &&
					_.isEmpty(rsp.helpList)){
					if (srchReq.AMSIV0010GetReq.srchTagCode) {
						this.failOnSrch(
							clutil.fmt(clmsg.EIG0002, srchReq.AMSIV0010GetReq.srchTagCode));
					}else{
						this.failOnSrch(clmsg.cl_no_data);
					}
					return;
				}

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// 結果モデルの作成
				var model = new ResultModel(rsp);
				// レスポンスを保存。
				model.savedRsp = data;
				// リクエストを保存。
				model.savedReq = srchReq;
				MyApp.model = model;

				// itemIDが0かどうかで、詳細条件補助リストを表示するか
				// 商品情報リストを表示するか判断する。
				if (rsp.itemList.length && rsp.itemList[0].itemID > 0) {
					// 商品情報リストを表示する場合のみにタグを保存する
					MyApp.trigger('AMSIV0010:addTag', model);
					// 結果描画
					MyApp.getRegion('resultArea').show(
						new ResultLayout({
							model: model
						}));
					return;
				}

				MyApp.getRegion('resultArea').show(
					new HelpListView({
						model: model
					}));

				this.resetFocus();
			}, this)).fail(this.failOnSrch);
			return defer;
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
			MyApp.trigger('resetFocus');
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
				this.srchCondView.ca_detailExpand_click();
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.chkData);
			}

		},

		_eof: 'AMSSV0310.MainView//'
	});

	MyApp.addRegions({
		resultArea: '#resultArea',
		srchTagCode: '#select_div1'
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

			var relation = mainView.srchCondView.relation;
			relation.done(function(){
				if (MyApp.isStoreUser) {
					clutil.inputReadonly(relation.fields.clorgcode.$el);
					clutil.inputReadonly('#ca_btn_store_select');
				}
				MyApp.trigger('resetFocus');
			});
		}).fail(function(data){
			console.error('iniJSON failed.');
			var opt_logout = (clcom.is_iPad() || clcom.is_iPhone()) ? true : false;

			// clcom のネタ取得に失敗。
			// 動かしようがないので、Abort 扱いとしておく？？？
			clutil.View.doAbort({
				messages: [
					//'初期データ取得に失敗しました。'
					clutil.getclmsg('cl_ini_failed')
				],
				logout: opt_logout,
				rspHead: data.rspHead
			});
		});
	});

	// ================
	// テストコード
	MainView.boo = function(){
		clutil.data2view($('#ca_srchArea'), {
			srchOrgID: {
				id: 1703,
				code: '0782',
				name: 'xxxx'
			},
			srchTagCode: '2000001341889'
			// srchTagCode: '2000004634117'
		});
	};

	MainView.boo2 = function(){
		clutil.data2view($('#ca_srchArea'), {
			srchOrgID: {
				id: 1703,
				code: '0782',
				name: 'xxxx'
			},
			srchItgrpID: {
				code: "01",
				id: 111,
				name: "スーツ"
			},
			srchMakerHinban: "M1223155"
		});
	};
}(MyApp));

$(function(){
	ClGrid.ImgScaler.start({
		target: 'img.magnify',
		wrapper: 'td',
		duration: 200
	});
});

// ================ めも
/* セットアップ有
 0621
 2000001341889

 2000001402139


 0005
 2000001341247		10013


 */
