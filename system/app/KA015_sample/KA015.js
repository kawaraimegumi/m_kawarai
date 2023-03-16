$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var ListView = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		validator : null,

		// Events
		events : {
			"change #ca_tagcode" : "_onChange",
			"change #ca_makeritemcode" : "_onMakerItemCodeChange",
			"change #ca_color" : "_onColorChange",
			"change #ca_itemkind" : "_onKindChange",

			"click #header p.back"	: "_onBackClick",	// 戻るボタン押下時
			"click #ca_output"		: "_onOutPutClick",	// 表示ボタン押下時
			"click #ca_btn_store_select"	: "_onStoreSelClick",
			"click #ca_btn_item_select"	: "_onItemSelClick",
			"click #ca_btn_bundle_select"	: "_onBundleSelClick",
			"change #ca_orgfunc_select": "_onOrgFuncChenge",
			"change #ca_itgrpfunc_select": "_onItgrpFuncChenge",
//			"keyup #ca_itemkind":	"_onItemKindKeyUp",
//			//"keyup #ca_vendor":	"_onVendorKeyUp",
//			"keyup #ca_igfunc":	"_onIgFuncKeyUp",
//			"keyup #ca_iglevel":	"_onIgLevelKeyUp",
//			"keyup #ca_itgrp":	"_onItgrpKeyUp",
//			"autocompletechange #ca_vendor" : "_onChecngeVendor",

		},

		busunitList: [],
		subclass1List: [],
		subclass2List: [],
		seasonList: [],
		varietyList: [],
		vendorList: [],
		igfuncList: [],
		iglevelList: [],
		itgrpList: [],
		vList: [],

		initialize: function() {
			_.bindAll(this);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback')
			});

			// CSV取込
			this.fileInput = clutil.fileInput({
				files: [],
				fileInput: "#ca_csvinput1",
				showDialogOnSuccess : false,
				showDialogOnError : false
			});

			this.fileInput.on('success', _.bind(function(file){
				this.validator.clear();
				console.log('成功', file);

				var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT,
						fileId: file.id,
					},
				};

				var url = "KA015";	// 組合せ販売商品登録

				clutil.postJSON(url, req).done(_.bind(function(data,dataType){
					if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						//成功時処理
						var view = new clutil.MessageDialog2('取込が完了しました。');


					} else {
						// ヘッダーにメッセージを表示
						this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args),});
						this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_",});
						if (data.rspHead.uri){
							clutil.download(data.rspHead.uri);	//CSVダウンロード実行
						}
					}
				},this)).fail(_.bind(function(data){
					clutil.mediator.trigger('onTicker', data);

					// エラーファイルがあればダウンロードする
					if (data.rspHead.uri){
						clutil.download(data.rspHead.uri);	//CSVダウンロード実行
					}
				}, this));
			}, this));

		},

		/**
		 * 組織体系コードセレクタ
		 * @param $select : 組織体系セレクタ
		 * @param unselectedflag	: 未選択値 0:なし 1:あり
		 */
		clsizegrpselector: function($select, unselectedflag) {
			var cond = {
				codename: ""
			};
			var req = {
				cond: cond
			};
			// データを取得
			var uri = 'am_pa_sizegrp_srch';
			return clutil.postJSON(uri, req).done(_.bind(function(data, dataType) {
				if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					console.log("clsizegrpselector callback start");

					var sizeGrpList = [];

					$.each(data.list, function() {
						var size = {
							id : this.sizegrp.id,
							name : this.sizegrp.name,
							code : this.sizegrp.code,
						};
						sizeGrpList.push(size);
					});

					clutil.cltypeselector2($select, sizeGrpList, unselectedflag,
							null, 'id', 'name', 'code');

//					clutil.cltypeselector3({
//						$select: $select,
//						list: [{id:1,code:'001',name:'ああああ'}],
//						unselectedflag: true,
//						emptyLabel: '＼(^o^)／'
//					});

					console.log("clorgfuncselector callback done");

				}
			}, this));
		},

		/**
		 * 組織コードオートコンプリートの作成
		 * @param $view		: 組織コードinputのjQueryオブジェクト（例：$("#ca_srchOrgID")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getOrgFuncId(),getOrgLevelId()を実装すること
		 */
		clszieptncode : function($view, opt) {
			var option = $.extend({
				/**
				 * 商品分類体系IDを返すメソッドを実装する
				 * @returns {Number} 商品分類体系ID
				 */
				getSizeGrpId: function() {
					return 0;
				},
				source:function(request, response) {
					var sizegrp_id = this.options.getSizeGrpId();
					cond = {
						sizegrpID: sizegrp_id,
						codename:     request.term
					};
					req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_sizeptn_srch';
					clutil.postJSON(uri, req, _.bind(function(data, dataType) {
						if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							var sizeptnList = [];
							for (var i = 0; i < data.list.length; i++) {
								var dl = data.list[i].sizeptn;
								var val = {
									label: dl.code + ":" + dl.name,
									value: dl.code + ":" + dl.name,
									id: dl.id,
									code: dl.code,
									name: dl.name,
								};
								sizeptnList.push(val);
							}
							response(sizeptnList);
						}
					}, this));
				},
			}, opt || {});
			$view.autocomplete(option);
		},

		/**
		 * メニューオートコンプリートの作成
		 * @param $view		: メニューinputのjQueryオブジェクト（例：$("#ca_srchOrgID")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getOrgFuncId(),getOrgLevelId()を実装すること
		 */
		clmenu : function($view, opt) {
			var option = $.extend({
				source:function(request, response) {
					cond = {
						codename:     request.term
					};
					req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_menu_srch';
					clutil.postJSON(uri, req, _.bind(function(data, dataType) {
						if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							var menuList = [];
							for (var i = 0; i < data.list.length; i++) {
								var dl = data.list[i].menu;
								var val = {
									label: dl.name,
									value: dl.name,
									id: dl.id,
									code: null,
									name: dl.name,
								};
								menuList.push(val);
							}
							response(menuList);
						}
					}, this));
				},
			}, opt || {});
			$view.autocomplete(option);
		},

		/**
		 * ロールオートコンプリートの作成
		 * @param $view		: ロールinputのjQueryオブジェクト（例：$("#ca_srchOrgID")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getOrgFuncId(),getOrgLevelId()を実装すること
		 */
		clrole : function($view, opt) {
			var option = $.extend({
				source:function(request, response) {
					cond = {
						codename:     request.term
					};
					req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_role_srch';
					clutil.postJSON(uri, req, _.bind(function(data, dataType) {
						if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							var roleList = [];
							for (var i = 0; i < data.list.length; i++) {
								var dl = data.list[i].role;
								var val = {
									label: dl.code + ":" + dl.name,
									value: dl.code + ":" + dl.name,
									id: dl.id,
									code: dl.code,
									name: dl.name,
									menu: data.list[i].menu,
								};
								roleList.push(val);
							}
							response(roleList);
						}
					}, this));
				},
			}, opt || {});
			$view.autocomplete(option);
		},

		/**
		 * セットアップオートコンプリートの作成
		 * @param $view		: セットアップinputのjQueryオブジェクト（例：$("#ca_srchOrgID")）
		 * @param opt		: オートコンプリートへのオプション。最低限 getOrgFuncId(),getOrgLevelId()を実装すること
		 */
		clsetup : function($view, opt) {
			var option = $.extend({
				source:function(request, response) {
					var unitID = $("#ca_bus_unit").val();
					cond = {
						unitID: unitID,
						codename:     request.term
					};
					req = {
						cond: cond
					};
					// データを取得
					var uri = 'am_pa_setup_srch';
					clutil.postJSON(uri, req, _.bind(function(data, dataType) {
						if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

							var roleList = [];
							for (var i = 0; i < data.list.length; i++) {
								var dl = data.list[i].setup;
								var val = {
									label: dl.code + ":" + dl.name,
									value: dl.code + ":" + dl.name,
									id: dl.id,
									code: dl.code,
									name: dl.name,
								};
								roleList.push(val);
							}
							response(roleList);
						}
					}, this));
				},
			}, opt || {});
			$view.autocomplete(option);
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			var _this = this;
			clutil.inputlimiter(this.$el);
			clutil.datepicker($(".input_datepicker"));

			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: this.$("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	this.$("#mainColumn"),
				select_mode : clutil.cl_multiple_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector.render();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var code = data[0].code;
					var name = data[0].name;
					var store = code + ":" + name;
					$("#ca_store").val(store);
				} else {
					$("#ca_store").val("");
				}
			};

			this.AMPAV0030Selector = new AMPAV0030SelectorView({
				el: this.$("#ca_AMPAV0030_dialog"),		// 配置場所
				$parentView	:	this.$("#mainColumn"),
				select_mode : null,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0030Selector.render();

			// 選択サブ画面復帰処理
			this.AMPAV0030Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var code = data[0].code;
					var name = data[0].name;
					var store = code + ":" + name;
					$("#ca_item").val(store);
				} else {
					$("#ca_item").val("");
				}
			};

			// 組合せ商品
			this.AMPAV0070Selector = new AMPAV0070SelectorView({
				el: this.$("#ca_AMPAV0070_dialog"),		// 配置場所
				$parentView	:	this.$("#mainColumn"),
				select_mode : clutil.cl_multiple_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0070Selector.render();

			// 選択サブ画面復帰処理
			this.AMPAV0070Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var code = data[0].code;
					var name = data[0].name;
					var bundle = code + ":" + name;
					$("#ca_bundle").val(bundle);
				} else {
					$("#ca_bundle").val("");
				}
			};

			// 事業ユニット取得
			this.getBusUnit();
			// 商品属性取得
			this.getItemAttr();

//			var opt = {
//				getParentId: function() {
//					// 親ID（事業ユニットID）取得メソッドを実装する
//					return 2;
//				},
//				change: function(event, ui) {	// 変更時はcs_id属性に取引先IDを設定する
//					var $target = $(event.target);
//					if (ui.item && ui.item.id){
//						$target.attr('cs_id', ui.item.id).data('cl_autocomplete_item', ui.item);
//						clutil.clpriceline(ui.item);
//					} else {
//						$target.attr('cs_id', 0).removeData('cl_autocomplete_item');
//					}
//				},
//			};
//			clutil.clvarietycode($("#ca_itemkind"), opt);
			//$("#ca_itemkind").autocomplete({source: []});

			clutil.clusercode($("#ca_user"));

			clutil.clvendorcode($("#ca_vendor"), {
				getVendorTypeId: function() {
					return 1;
				},
			});

			clutil.clcolorcode($("#ca_color"), {
				getItemId: function() {
					return 1001;
				},
			});

			clutil.clsizecode($("#ca_size"), {
				getItemId: function() {
					return 1001;
				},
				getColorId: function() {
					return 26;
				},
			});

			// 区分（組織階層）取得
			clutil.cltypeselector($("#ca_org_level"), 1, 0);

			clutil.clorgfunccode($("#ca_orgfunc"));
			clutil.clorglevel($("#ca_orglevel"), {
				getOrgFuncId: function() {
					return 1;	// 基本を返す
				}
			});
			clutil.clorgcode($("#ca_org"), {
				getOrgFuncId: function() {
					return $('#ca_orgfunc_select').selectpicker('val');
				},
				getOrgLevelId: function() {
					return $('#ca_orglevel_select').selectpicker('val');
				}
			});

			clutil.clequipcode($('#ca_equipID'), {
				// TODO
			});

			//clutil.cltag2variety($("#ca_tagcode"));
			clutil.mediator.on('onCLtag2varietyCompleted', function(data, e) {
				console.log(data);
			});
			clutil.mediator.on('onCLmakerItemCodeCompleted', function(data, e) {
				console.log(data);
				var itemID = data.data.rec.itemID;
				var req = {
					cond: {
						srchFromDate: 20140101,
						srchToDate: 20141231,
						itemID: itemID,
					},
				};
				var uri = "am_pa_item2color";
				clutil.postJSON(uri, req).done(_.bind(function(data) {
					clutil.mediator.trigger('onItem2ColorCompleted', {status: 'OK', data: data}, e);
				}, this)).fail(_.bind(function(data) {
					clutil.mediator.trigger('onItem2ColorCompleted', {status: 'NG', data: data}, e);
				}, this));

			});
			clutil.mediator.on('onItem2ColorCompleted', function(data, e) {
				console.log(data);
			});
			clutil.mediator.on('onCLcolor2sizeCompleted', function(data, e) {
				console.log(data);
			});
			clutil.mediator.on('onCLpricelineCompleted', function(data, e) {
				console.log(data);
			});
			clutil.clorgfuncselector($("#ca_orgfunc_select"), 0);
			clutil.clorglevelselector($("#ca_orglevel_select"), 0, 0);
			clutil.clitgrpfuncselector($("#ca_itgrpfunc_select"), 0);
			clutil.clitgrplevelselector($("#ca_itgrplevel_select"), 0, 0);

			clutil.mediator.on('onClOrgLevelSelectorChanged', function(item, e) {
				console.log(item);
			});
			clutil.mediator.on('onJanCodeCompleted', function(item, e) {
				console.log(item);
			});
			this.clsizegrpselector($("#ca_sizegrpID"));
			this.clszieptncode($("#ca_sizeptnID"), {
				getSizeGrpId: function() {
					var id = $("#ca_sizegrpID").val();
					return id;
				},
			});
			this.clmenu($("#ca_menuID"));
			this.clrole($("#ca_roleID"));
			this.clsetup($("#ca_setupID"));

			return this;
		},

		_onOrgFuncChenge: function(e) {
			var orgFuncId = $("#ca_orgfunc_select").selectpicker("val");
			clutil.inputRemoveReadonly("#ca_orglevel_select");
			clutil.clorglevelselector($("#ca_orglevel_select"), orgFuncId, 0);
		},

		_onItgrpFuncChenge: function(e) {
			var itgrpFuncId = $("#ca_itgrpfunc_select").selectpicker("val");
			clutil.clitgrplevelselector($("#ca_itgrplevel_select"), itgrpFuncId, 0);
		},

		_onChange: function(e) {
			var $tgt = $(e.target);
			var code = $tgt.val();
			//clutil.cltag2variety(code);
			var req = {
				srchYmd: 20140425,
				janCode: "",
				itgrpID: 111,
				makerID: 24,
				makerItemCode: code,
			};
			var uri = "am_pa_jancode_srch";
			clutil.postJSON(uri, req).done(_.bind(function(data) {
				clutil.mediator.trigger('onJanCodeCompleted', {status: 'OK', data: data}, e);
			}, this)).fail(_.bind(function(data) {
				clutil.mediator.trigger('onJanCodeCompleted', {status: 'NG', data: data}, e);
			}, this));

		},

		_onMakerItemCodeChange: function(e) {
			var $tgt = $(e.target);
			var code = {
					itgrp_id: 111,
					maker_id: 127,
					maker_code: $tgt.val(),
					need_qy: 1,
					srchYmd: 20140302,
			};
			clutil.clmakeritemcode2item(code);
		},

		_onColorChange: function(e) {
			var $tgt = $(e.target);
			var colorID = $tgt.val();
			var itemID = 1005;
			clutil.clcolor2size(itemID, colorID, e);
		},

		_onKindChange: function(e) {
			var $tgt = $(e.target);
			var itgrpID = $tgt.val();
			clutil.clpriceline(itgrpID, e);
		},

		_onChecngeVendor: function(event, ui) {
			$(event.target).attr('cs_id', ui.item.id);
/* ==========================================================
			var val = $("#ca_vendor").val();
			var vals = val.split(':');
			var code = vals && vals.length > 0 ? vals[0] : "";
			for (var i = 0; i < this.vList.length; i++) {
				if (this.vList[i].code === code) {
					$("#ca_vendor").attr('cs_id', this.vList[i].id);
					$("#ca_vendor_id").val(this.vList[i].id);
				}
			}
   ========================================================== */
		},
		/**
		 * 事業ユニット取得
		 */
		getBusUnit: function() {
			cond = {
				ymd: 20140214,
			},
			req = {
				cond: cond,
			};
			// データを取得
			var uri = 'am_pa_busunit_srch';
			clutil.postJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					this.busunitList = data.body.list;

					clutil.cltypeselector2(this.$('#ca_bus_unit'), this.busunitList, 0,
							null,
							'busunit_id', 'busunit_name', 'busunit_code');

				}
			}, this));


		},
		/**
		 * 商品属性取得
		 */
		getItemAttr: function() {
			clutil.clitemattrselector(this.$('#ca_itemattr_subclass1'), 1, 11, 0);
			clutil.clitemattrselector(this.$('#ca_itemattr_subclass2'), 2, 11, 0);
			clutil.clitemattrselector(this.$('#ca_itemattr_season'), 10, 0, 0);

//			cond2 = {
//				iagfunc_id:	2,
//				itgrp_id:	11,
//			},
//			req2 = {
//				cond: cond2,
//			};
//			clutil.postJSON(uri, req2, _.bind(function(data, dataType) {
//				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
//
//					this.subclass2List = data.body.list;
//
//					clutil.cltypeselector2(this.$('#ca_itemattr_subclass2'), this.subclass2List, 0,
//							null,
//							'itemattr_id', 'itemattr_name', 'itemattr_code');
//
//				}
//			}, this));

//			cond3 = {
//				iagfunc_id:	10,
//			},
//			req3 = {
//				cond: cond3,
//			};
//			clutil.postJSON(uri, req3, _.bind(function(data, dataType) {
//				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
//
//					this.seasonList = data.body.list;
//
//					clutil.cltypeselector2(this.$('#ca_itemattr_season'), this.seasonList, 0,
//							null,
//							'itemattr_id', 'itemattr_name', 'itemattr_code');
//
//				}
//			}, this));

		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.initUIelement();

			return this;
		},

		formatDate: function(ymd) {

		},

		/**
		 * 戻るボタン押下時
		 */
		_onBackClick: function() {
			clcom.gohome();
			return this;
		},
		/**
		 * 出力ボタン押下処理
		 */
		_onOutPutClick: function() {
			// validation
			if (!this.validator.valid()) {
				return this;
			}

			// 画面の情報を取得する
			var resultdata = clutil.view2data($("#search"));
			this.req = {
				cond: resultdata,
			};
			console.log(this.req);

			// CSV出力リクエストを実行する
			var uri = "sample01";
			clutil.postJSON(uri, this.req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					// data.head.url に作成されたCSVファイルのURLがレスポンスされてくる
					clutil.download(data.body.path); // CSVダウンロード実行
				} else {
					// サーバーからのエラーがある場合、エラー通知 （TODO 顧客のエラー通知方法を確認）

					// ヘッダにメッセージを表示（TODO 同上）
				}
			}, this));
		},
		_onStoreSelClick: function(e) {
			var _this = this;

			this.AMPAV0010Selector.show(null, null);
		},
		_onItemSelClick: function(e) {
			var _this = this;

			this.AMPAV0030Selector.show(null, null);
		},
		_onBundleSelClick: function(e) {
			var _this = this;

			this.AMPAV0070Selector.show(null, null);
		},
		_onItemKindKeyUp: function(e) {
			var txt = $("#ca_itemkind").val();
			cond = {
				parent_id: 2,
				codename : txt,
			},
			req = {
				cond: cond,
			};
			// データを取得
			var uri = 'am_pa_variety_srch';
			clutil.postJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					this.varietyList = [];
					for (var i = 0; i < data.itgrplist.length; i++) {
						var codename = data.itgrplist[i].code + ":" + data.itgrplist[i].name;
						this.varietyList.push(codename);
					}
					$("#ca_itemkind").autocomplete({source: this.varietyList});
				}
			}, this));
		},
		_onVendorKeyUp: function(e) {
			switch (e.keyCode) {
			case 37:
			case 38:
			case 39:
			case 40:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 13:
			case 16:
			case 17:
			case 18:
			case 19:
			case 29:
			case 32:
				return;
			}
			var txt = $("#ca_vendor").val();
			cond = {
				vendor_typeid: 1,
				codename : txt,
			},
			req = {
				cond: cond,
			};
			// データを取得
			var uri = 'am_pa_vendor_srch';
			clutil.postJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					this.vendorList = [];
					for (var i = 0; i < data.list.length; i++) {
						var codename = data.list[i].vendor_code + ":" + data.list[i].vendor_name;
						this.vendorList.push(codename);
					}
					$("#ca_vendor").autocomplete({source: this.vendorList});
				}
			}, this));
		},
		_onIgFuncKeyUp: function(e) {
			switch (e.keyCode) {
			case 37:
			case 38:
			case 39:
			case 40:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 13:
			case 16:
			case 17:
			case 18:
			case 19:
			case 29:
			case 32:
				return;
			}
			var txt = $("#ca_igfunc").val();
			cond = {
				codename : txt,
			},
			req = {
				cond: cond,
			};
			// データを取得
			var uri = 'am_pa_itgrpfunc_srch';
			clutil.postJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					this.igfuncList = [];
					for (var i = 0; i < data.list.length; i++) {
						var codename = data.list[i].igfunc_code + ":" + data.list[i].igfunc_name;
						this.igfuncList.push(codename);
					}
					$("#ca_igfunc").autocomplete({source: this.igfuncList});
				}
			}, this));
		},
		_onIgLevelKeyUp: function(e) {
			switch (e.keyCode) {
			case 37:
			case 38:
			case 39:
			case 40:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 13:
			case 16:
			case 17:
			case 18:
			case 19:
			case 29:
			case 32:
				return;
			}
			var txt = $("#ca_iglevel").val();
			cond = {
				itgrpfunc_id: 1,
				codename : txt,
			},
			req = {
				cond: cond,
			};
			// データを取得
			var uri = 'am_pa_itgrplevel_srch';
			clutil.postJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					this.iglevelList = [];
					for (var i = 0; i < data.list.length; i++) {
						var codename = data.list[i].itgrplevel_code + ":" + data.list[i].itgrplevel_name;
						this.iglevelList.push(codename);
					}
					$("#ca_iglevel").autocomplete({source: this.iglevelList});
				}
			}, this));
		},
		_onItgrpKeyUp: function(e) {
			switch (e.keyCode) {
			case 37:
			case 38:
			case 39:
			case 40:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 13:
			case 16:
			case 17:
			case 18:
			case 19:
			case 29:
			case 32:
				return;
			}
			var txt = $("#ca_itgrp").val();
			cond = {
				itgrpfunc_id: 1,
				itgrplevel_id: 3,
				codename : txt,
			},
			req = {
				cond: cond,
			};
			// データを取得
			var uri = 'am_pa_itgrp_srch';
			clutil.postJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					this.itgrpList = [];
					for (var i = 0; i < data.list.length; i++) {
						var codename = data.list[i].itgrp_code + ":" + data.list[i].itgrp_name;
						this.itgrpList.push(codename);
					}
					$("#ca_itgrp").autocomplete({source: this.itgrpList});
				}
			}, this));
		},

	});
	ca_listView = new ListView();
	ca_listView.render();

	//ヘッダー,フッター部分は共通なのでhtmlに該当するidを振ること
	//headerView = new HeaderView();
	//footerView = new FooterView();
});
