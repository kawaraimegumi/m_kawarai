/* global MyApp: true */
$.inputlimiter.noTrim = true;
useSelectpicker2();

var APPID = 'AMSIV0010';
(function(MyApp){
	MyApp.srchFuncType = 1;

	// View
	var MainView = MyApp.MainView = Backbone.View.extend({
		el:	'#ca_main',

		events: {
			/*
			 * TODO 作成するイベント
			 * 1. 詳細のクリックイベント
			 * 2. セット、関連商品、集約品番の各ボタン押下イベント
			 * 3. 店舗のクリックイベント
			 */
			'click #expand': '_acordionToggle',			// 詳細クリックイベント
			'click .js-acordion-btn': '_acordionToggle2',			// 詳細クリックイベント
			'click .js-acordion-btn_allsize': '_acordionToggle_allsize',	// 全サイズクリックイベント
			'click tr.tr_tagCode': '_onClickTagCode',	// ダイアログでのタグコードクリック
			'click .size--stock': '_onClickSize',		// サイズクリックイベント
//			'click .button_set': '_onClickSet',			// セット商品ボタン
//			'click .button_rel': '_onClickRel',			// 関連商品ボタン
//			'click .button_pack': '_onClickPack',		// 集約品番ボタン
		},

		_onClickTagCode: function(e) {
			console.log(e.target);
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');

			var tagCode = $tr.attr('tagcode');
			var args = "srchStoreCode=" + this.savedReq.AMSIV0010GetReq.srchOrgCode + "&srchJanCode=" + tagCode;
			var url = '/system/app/AMSI/AMSIV0060/AMSIV0060.html?' + args;
			clcom.location(url);
		},

		/**
		 * 詳細クリックインベント
		 * @param e
		 */
		_acordionToggle: function(e) {
			var $tgt = $(e.target);
			var $info = $("#expandInfo");

			$info.slideToggle();
			var span = $tgt.find('span');
			$(span).fadeToggle();

			$info.css('overflow', 'inherit');
		},

		_acordionToggle2: function(e) {
			var $tgt = $(e.target);
		    $tgt.find('.icon').toggleClass('icon-abui-arrow-right');
		    $tgt.find('.icon').toggleClass('icon-abui-arrow-down');

		    $tgt.closest('.js-acordion').find('.js-toggle-content').eq(0).slideToggle('fast');
		    $(this).children('.js-toggle-txt').toggle();
		},

		/**
		 * 全サイズクリックイベント
		 * @param e
		 */
		_acordionToggle_allsize: function(e) {
			var $tgt = $(e.target);
			$tgt.find('.icon').toggleClass('icon-abui-arrow-right');
			$tgt.find('.icon').toggleClass('icon-abui-arrow-down');

			$tgt.closest('.js-acordion').parent().find('.js-toggle-content').eq(0).slideToggle('fast');
		    $(this).parent().parent().parent().children('tbody').toggle();
		},

		/**
		 * セット商品ボタン押下
		 * @param e
		 */
		_onClickSet: function(e) {
			console.log("_onClickSet:", e);
			$("#div_modal_set").empty();

			var wh = window.innerHeight;
			$("#modal--set").find('.modal-content').css('min-height', wh+10+'px');

			var that = this;
			clutil.postJSON(APPID, {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fieldId: 0
				},
				AMSIV0010GetReq: {
					srchFuncType: 1,
					srchReqType: 3,
					srchFlag: 1,
					srchItemID: that.savedItem.itemID		// itemIDを
				}
			})
				.done(function(data){
					that.successOnSelectList(data, 1);
				})
				.fail(this.failOnSelectList);
		},

		/**
		 * 集約品番ボタン押下
		 * @param e
		 */
		_onClickPack: function(e) {
			console.log("_onClickPack:", e);
			$("#div_modal_pack").empty();

			var wh = window.innerHeight;
			$("#modal--pack").find('.modal-content').css('min-height', wh+10+'px');

			var that = this;
			clutil.postJSON(APPID, {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fieldId: 0
				},
				AMSIV0010GetReq: {
					srchFuncType: 1,
					srchReqType: 3,
					srchFlag: 2,
					srchItemID: that.savedItem.itemID		// itemIDを
				}
			})
				.done(function(data){
					that.successOnSelectList(data, 2);
				})
				.fail(this.failOnSelectList);
		},

		/**
		 * 関連商品ボタン押下
		 * @param e
		 */
		_onClickRel: function(e) {
			console.log("_onClickRel:", e);
			$("#div_modal_rel").empty();

			var wh = window.innerHeight;
			$("#modal--rel").find('.modal-content').css('min-height', wh+10+'px');

			var that = this;
			clutil.postJSON(APPID, {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fieldId: 0
				},
				AMSIV0010GetReq: {
					srchFuncType: 1,
					srchReqType: 3,
					srchFlag: 3,
					srchItemID: that.savedItem.itemID		// itemIDを
				}
			})
				.done(function(data){
					that.successOnSelectList(data, 3);
				})
				.fail(this.failOnSelectList);
		},

		_onClickItem: function(e) {
			console.log("_onClickItem:", e);
			$("#div_modal_item_header").empty();
			$("#div_modal_item_body").empty();

			var wh = window.innerHeight;
			$("#modal--item").find('.modal-content').css('min-height', wh+10+'px');

			var $tgt = $(e.relatedTarget);
			var itemID = $tgt.attr('itemid');

			var that = this;
			clutil.postJSON(APPID, {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fieldId: 0
				},
				AMSIV0010GetReq: {
					srchFuncType: 1,
					srchReqType: 4,
					srchItemID: itemID		// itemIDを
				}
			})
				.done(function(data){
					that.successOnSelectItem(data);
				})
				.fail(this.failOnSelectList);
		},

		/**
		 * 店舗クリックイベント
		 * @param e
		 */
		_onClickStore: function(e) {
			// TODO クリックされた行から店舗情報のダイアログを表示する
			console.log("_onClickStore:" + e);
		},

		// 検索パネル srchCondView から検索ボタン押下イベント
		clMediatorEvents: {
			ca_onSearch: function(srchReqDto) {
				var req = this.buildReq(srchReqDto);
				this.doSrch(req);		// 検索実行
			}
		},

		/**
		 * サイズクリックイベント
		 * @param e
		 */
		_onClickSize: function(e) {
			console.log("_onClickSize:" + e);

			var $tgt_num = e.srcElement.parentElement.attributes["data-num"].value;
			var $tgt_org = this.savedReq.AMSIV0010GetReq.srchOrgCode;
			var $tgt_mcode = this.savedItem.makerHinban;
			var $tgt_item = this.savedItem.sizeList[$tgt_num];
			var size = $tgt_item.size;
			var itemID = $tgt_item.colorSizeItemID;
			var new_req = {
					srchOrgCode: $tgt_org,
					srchItemID: itemID,
					srchSizeName: size,
					srchMakerHinban: $tgt_mcode,
					srchFuncType: 1,
					srchReqType: 1,
					srchFlag: 1,
			};
			var new_srchReq = {
					reqHead: this.savedReq.reqHead,
					AMSIV0010GetReq: new_req,
			};

			// テーブルをクリア
			var table_size = document.getElementById('ca_tbody_size');
			while(table_size.rows[1]) table_size.deleteRow(1);
			var table_area = document.getElementById('ca_tbody_area');
			while(table_area.rows[1]) table_area.deleteRow(1);
			var table_zone = document.getElementById('ca_tbody_zone');
			while(table_zone.rows[1]) table_zone.deleteRow(1);
			var table_pref = document.getElementById('ca_tbody_pref');
			while(table_pref.rows[1]) table_pref.deleteRow(1);
			var table_otherpref = document.getElementById('div_otherpref');
			for (var i=0; i<table_otherpref.children.length; i++){
				var tgt = table_otherpref.children[i].children[0];
				while(tgt.rows[0]) tgt.deleteRow(0);
			};

			// モーダル画面をクリア
			var modal_all = Array.prototype.slice.call(document.querySelectorAll("[id]"),0).filter(function(i){
				return i.id.match(/^modal--\d+$/);
			});
			for (var i=0; i<modal_all.length; i++){
				var tgt = document.getElementById(modal_all[i].id);
				tgt.remove();
			};

			// クリックしたサイズで再検索
			this.doSrch(new_srchReq);
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
			var $tgt = null;
			switch (srchFlag) {
			case 1:
				$tgt = $("#div_modal_set");
				break;
			case 2:
				$tgt = $("#div_modal_pack");
				break;
			case 3:
				$tgt = $("#div_modal_rel");
				break;
			default:
				this.failOnSelectList(data);
				return;
			}
			var $c = $tgt.parents('div.modal-content');
			$c.css('min-height', '');

			_.each(rsp.selectList, _.bind(function(select) {
				var section = _.template($("#setupModal1").html(), select);
				$tgt.append(section);
				var $tgt2 = $tgt.find('ul.stock-list:last');

				_.each(select.detailList, _.bind(function(detail) {
					var item = _.template($("#setupModal2").html(), detail);
					$tgt2.append(item);
				}, this));
			}, this));
		},

		successOnSelectItem: function(data) {
			var rsp = data.AMSIV0010GetRsp;

			// 空の場合はエラーを表示
			if (_.isEmpty(rsp.itemList)){
				this.failOnSelectList(clmsg.cl_no_data);
				return;
			}
			var $tgt = $("#div_modal_item_header");
			var $tbody = $("#div_modal_item_body");

			// ヘッダ
			var header = _.template($("#itemHeaderModal").html(), rsp.itemList[0]);
			$tgt.append(header);

			_.each(rsp.itemList, _.bind(function(item) {
				var body = _.template($("#itemBodyModal").html(), item);
				$tbody.append(body);
			}, this));

			$("#modal--item").find('.modal-content').css('min-height', '');
			$("#modal--item").scrollTo(0);
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

			// セットアップクリックイベント
			$("#modal--set").on("show.bs.modal", this._onClickSet);

			// 関連商品クリックイベント
			$("#modal--rel").on("show.bs.modal", this._onClickRel);

			// 集約品番クリックイベント
			$("#modal--pack").on("show.bs.modal", this._onClickPack);

			// 品番クリックイベント
			$("#modal--item").on("show.bs.modal", this._onClickItem);

		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.mdBaseView.commonHeader.$el.hide();

			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			// XXX テスト用
//			if (argSrchReq == null || argSrchReq.srchStoreCode == null) {
//				argSrchReq = {
//						srchStoreCode: "0104",
//						srchJanCode: "2000003979134",
//				};
//			}
			var srchReq = {
				srchOrgCode: argSrchReq.srchStoreCode,
				srchTagCode: argSrchReq.srchJanCode,
				srchFuncType: 1,
				srchReqType: 1,
				srchFlag: 1,
			};
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
				//this.srchOrgID = this.srchCondView.relation.get('clorgcode');

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
				/*
				 * 画面表示処理
				 */
				var itemList = rsp.itemList[0];
				itemList.div = itemList.divCode + ":" + itemList.divName;
				itemList.itgrp = itemList.itgrpCode + ":" + itemList.itgrpName;
				itemList.maker = itemList.makerCode + ":" + itemList.makerName;
//				itemList.seasonName = clutil.gettypename(amcm_type.AMCM_TYPE_SEASON, itemList.season, 1);
//				itemList.itemTypeName = clutil.gettypename(amcm_type.AMCM_TYPE_ITEM, itemList.itemTypeID, 1);
				itemList.priceInTaxText = clutil.comma(itemList.priceInTax);
				itemList.priceInTaxNowText = clutil.comma(itemList.priceInTaxNow);
				itemList.costText = clutil.comma(itemList.cost);
				itemList.profitRateText = itemList.profitRate.toFixed(1);
				clutil.data2view(this.$el, itemList);

				/*
				 * セット商品等のボタン表示
				 */
				if (itemList.setupFlag == 0) {
					$(".button_set").hide();
				} else {
					$(".button_set").show();
				}
				if (itemList.packItemFlag == 0) {
					$(".button_pack").hide();
				} else {
					$(".button_pack").show();
				}
				if (itemList.relItemFlag == 0) {
					$(".button_rel").hide();
				} else {
					$(".button_rel").show();
				}

//				$(".button_set").show();
//				$(".button_pack").show();
//				$(".button_rel").show();

				/*
				 * セット商品/関連商品/集約品番検索
				 */
				if (itemList.setupFlag != 0) {

				} else if (itemList.packItemFlag != 0) {

				} else if (itemList.relItemFlag != 0) {

				}

				// 自店舗
				var storeName = rsp.orgCode + ":" + rsp.orgName;
				$("#ca_store").text(storeName);
				$("#ca_myStockQy").text(itemList.myStockQy);
				$("#ca_allStockQy").text(itemList.allStockQy);

				// サイズ
				var seq = 0;
				_.each(itemList.sizeList, _.bind(function(size) {
					size.seq = seq++;
					var tr = _.template($("#SizeView2").html(), size);
					$("#ca_tbody_size").append(tr);
				}))

				// 自エリア
				var seq = 0;
				_.each(itemList.areaList.storeList, _.bind(function(area) {
					area.seq = seq++;
					var tr = _.template($("#StoreView").html(), area);
					$("#ca_tbody_area").append(tr);

					// ダイアログ
					var dialog = _.template($("#ca_modal_dialog").html(), area);
					$("#ca_main").append(dialog);
				}, this));

				// 自ゾーン
				_.each(itemList.zoneList.storeList, _.bind(function(zone) {
					zone.seq = seq++;
					var tr = _.template($("#StoreView").html(), zone);
					$("#ca_tbody_zone").append(tr);

					// ダイアログ
					var dialog = _.template($("#ca_modal_dialog").html(), zone);
					$("#ca_main").append(dialog);
				}, this));
				// 県内
				$("#ca_pref_name").text(itemList.prefList.orgName);
				_.each(itemList.prefList.storeList, _.bind(function(pref) {
					pref.seq = seq++;
					var tr = _.template($("#StoreView").html(), pref);
					$("#ca_tbody_pref").append(tr);

					// ダイアログ
					var dialog = _.template($("#ca_modal_dialog").html(), pref);
					$("#ca_main").append(dialog);
				}, this));

				// その他都道府県別
				var $otherpref = $("#div_otherpref");
				_.each(itemList.otherPrefList, _.bind(function(other) {
					var header = _.template($("#OtherView").html(), other);
					$otherpref.append(header);

					var $table = $otherpref.find('table:last');
					var $tbody = $table.find('tbody');

					_.each(other.storeList, _.bind(function(store) {
						store.seq = seq++;
						var tr = _.template($("#StoreView").html(), store);
						$tbody.append(tr);

						// ダイアログ
						var dialog = _.template($("#ca_modal_dialog").html(), store);
						$("#ca_main").append(dialog);
					}, this));
				}, this));

				this.savedItem = itemList;
				this.savedReq = srchReq;

				this.resetFocus();
			}, this)).fail(this.failOnSrch);
			return defer;
		},

		// 検索に失敗した場合、検索結果を閉じて検索エリアを開く。ティッカーも表示する。
		failOnSrch: function(data){
			MyApp.getRegion('resultArea').close();
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
		load: function() {
			// GETパラメータ解析
			var vars = this.getUrlVars();

			this.setAuthToken(vars.key);
			var srchReq = this.buildReq(vars);

			this.doSrch(srchReq);
		},

		/**
		 * 認証トークンをcookieに強制セット
		 * @param token
		 */
		setAuthToken: function(token) {
			if (token == null) {
				// tokenが未設定の場合はアボート
				var errHd = {
					status : 'error',
					message : 'cl_http_status_unauthorized',
					httpStatus : 401
				};

				var d = $.Deferred();
				return d.reject({
					head : errHd,
					rspHead : errHd
				});
			}
			var key = 'auth_token',
				expire = new Date(2070,(12-1),31,23,59,59,999),
				cookies = key + '=' + token + '; expires=' + expire.toUTCString() + '; path=/';
			document.cookie = cookies;
		},

		getUrlVars: function() {
		    var vars = {};
		    var param = location.search.substring(1).split('&');
		    for(var i = 0; i < param.length; i++) {
		        var keySearch = param[i].search(/=/);
		        var key = '';
		        if(keySearch != -1) key = param[i].slice(0, keySearch);
		        var val = param[i].slice(param[i].indexOf('=', 0) + 1);
		        if(key != '') vars[key] = decodeURI(val);
		    }
		    return vars;
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

		/*
		 * 認証トークンがcookieに設定されているか判定していたが、
		 * GETパラメータで貰って強制的に設定するように変更となった。
		 * 従って、ここでの判定は行わない。
		 */
		MyApp.start();

		var mainView = MyApp.mainView = new MainView()
				.initUIElement()
				.render();

		// GETパラメータ解析して検索＆結果表示する
		mainView.load();

		//		if (!clcom.hasAuthCookies()) {
//			var errHd = {
//				status: 'error',
//				message: 'cl_http_status_unauthorized',
//				httpStatus: 401
//			};
//
//			var d = $.Deferred();
//			return d.reject({ head: errHd, rspHead: errHd });
//		} else {
//			MyApp.start();
//
//			var mainView = MyApp.mainView = new MainView()
//					.initUIElement()
//					.render();
//
//			// GETパラメータ解析して検索＆結果表示する
//			mainView.load();
//
//		}

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
