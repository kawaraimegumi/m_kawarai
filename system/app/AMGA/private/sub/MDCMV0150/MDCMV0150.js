
$(function() {

	//////////////////////////////////////////////
	// View
	MDCMV0150SelectorView = Backbone.View.extend({
		screenId : "MDCMV0150",
		validator: null,

		mstitem_list: {},
		select_lists: {},
		old_lists: {},

		// 押下イベント
		events: {
			"change #ca_MDCMV0150_main .ca_MDCMV0150_axis_kind"	:	"_onAxisKindSelect",		// 軸種別項目変更

			"click #ca_MDCMV0150_main .button_MDCMV0150_show_CACMV0370"	:	"_onAxisDispClick",	// 表示項目選択サブ画面

			"click #ca_MDCMV0150_commit"						:	"_onCommitClick",	// 確定ボタン押下

			"change #ca_MDCMV0150_main .ca_MDCMV0150_val"		:	"_onFromAmFocusout",	// 開始値フォーカスアウト

			"click #ca_MDCMV0150_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_MDCMV0150_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_MDCMV0150_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
		},

		initialize: function(opt) {
			_.bindAll(this);
			this.options = opt || {};
			this.isAnalyse_mode = true;	// 分析モード
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function(axisFolder) {
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), true);

			this.initializing = true;
			clutil.inputlimiter(this.$el);
			// 縦軸１ 未選択値なし
			clutil.cltypeselector2(this.$('select.ca_MDCMV0150_axis_kind'),
					this.axisList, 0,
					1,
					'index');

			clutil.initUIelement(this.$el);

			// fromtoリストを設定
			if (axisFolder != null) {
				this.fromtoList = axisFolder.fromtoList;
			} else {
				this.fromtoList = {};
			}

			// 縦軸１の属性コンボ初期選択
			if (this.axisList != null && this.axisList.length > 0) {
				this.makeAttrSelect('v1', this.axisList[0].cond_kind, this.axisList[0].func_id);
			}

			if (axisFolder != null) {
				// 編集データを反映
				clutil.data2view(this.$('.ca_MDCMV0150_searchArea'), axisFolder, 'ca_MDCMV0150_');

//				var vAxisListEx = axisFolder.vAxisListEx;
//				var basketList = axisFolder.basketList;

//				var axis = null;
				switch (this.options.side) {
				case "basis":
					var vAxisListEx = axisFolder.vAxisListEx;
					var basketList = axisFolder.basketList;
//					axis = vAxisListEx;
					break;
				case "alt":
					var vAxisListEx = axisFolder.vAxisListEx2;
					var basketList = axisFolder.basketList2;
//					axis = vAxisListEx[1];
					break;
				}
				var axis = vAxisListEx;
				if (axis != null) {
					this.$('select.ca_MDCMV0150_axis_kind')
						.selectpicker('val', this.getAxisListIndex(axis.kind, axis.func_id));
					this.makeAttrSelect('v1', axis.kind, axis.func_id);
					this.setAttr(axis);
					this.setMstItem(axis, basketList);
				}
			}

			// 商品分類選択画面
			this.MDCMV0150_CACMV0050Selector = new  CACMV0050SelectorView({
				el : this.$('#ca_MDCMV0150_CACMV0050_dialog'),	// 配置場所
				$parentView		: this.$('#ca_MDCMV0150_main'),
//				isAnalyse_mode  : this.isAnalyse_mode,		// 分析ユースかどうかフラグ？？？
// 				ymd : null, // 検索日
				select_mode		: clutil.cl_multiple_select,	// 単一選択モード
				anaProc			: this.options.anaProc
			});
			// 商品選択画面
			this.MDCMV0150_CACMV0060Selector = new  CACMV0060SelectorView({
				el : this.$('#ca_MDCMV0150_CACMV0060_dialog'),	// 配置場所
				$parentView		: this.$('#ca_MDCMV0150_main'),
//			 	isAnalyse_mode : this.isAnalyse_mode, // 分析ユースかどうかフラグ？？？
// 				ymd : null, // 検索日
				select_mode		: clutil.cl_multiple_select,	// 単一選択モード
				anaProc			: this.options.anaProc
			});
			// 商品属性選択画面
			this.MDCMV0150_CACMV0070Selector = new  CACMV0070SelectorView({
				el : this.$('#ca_MDCMV0150_CACMV0070_dialog'),	// 配置場所
				$parentView		: this.$('#ca_MDCMV0150_main'),
//	 			isAnalyse_mode : this.isAnalyse_mode, // 分析ユースかどうかフラグ？？？
// 				ymd : null, // 検索日
				select_mode		: clutil.cl_multiple_select,	// 単一選択モード
				isBasket_mode	: true,
				anaProc			: this.options.anaProc
			});
			// JANコード
			this.MDCMV0150_CACMV0240Selector = new CACMV0240SelectorView({
				el : this.$('#ca_MDCMV0150_CACMV0240_dialog'),	// 配置場所
				$parentView		: this.$('#ca_MDCMV0150_main'),
//	 			isAnalyse_mode : this.isAnalyse_mode, // 分析ユースかどうかフラグ？？？
// 				ymd : null, // 検索日
				select_mode 	: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.options.anaProc
			});
			// 商品リスト
			this.MDCMV0150_CACMV0080Selector = new CACMV0080SelectorView({
				el : this.$('#ca_MDCMV0150_CACMV0080_dialog'),	// 配置場所
				$parentView		: this.$('#ca_MDCMV0150_main'),
//	 			isAnalyse_mode : this.isAnalyse_mode, // 分析ユースかどうかフラグ？？？
// 				ymd : null, // 検索日
				select_mode 	: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.options.anaProc
			});
			this.MDCMV0150_CACMV0050Selector.render();
			this.MDCMV0150_CACMV0060Selector.render();
			this.MDCMV0150_CACMV0070Selector.render();
			this.MDCMV0150_CACMV0240Selector.render();
			this.MDCMV0150_CACMV0080Selector.render();

			this.initializing = false;
		},

		/**
		 * 属性値を設定
		 */
		setAttr : function(axis) {
			var select = this.$('select.ca_MDCMV0150_axis_attr');

			switch (Number(axis.kind)) {
			case amanp_AnaDefs.AMAN_DEFS_KIND_ORG:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITGRP:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS1:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS2:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_BRAND:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_STYLE:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_DESIGN:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_MATERIAL:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_COLOR:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_T_COLOR:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_K_SIZE:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SEASON:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_USE:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ADDR:
            case amanp_AnaDefs.AMAN_DEFS_KIND_PACKITEM:
            	// ここにはこない
				break;
			default:
				$(select).selectpicker('val', axis.attr);
				break;
			}
			return axis;
		},

		setMstItem: function(axis, mstitemList) {
//			this.olg_lists = {};
			if (mstitemList == null) {
				return;
			}
//			var num = 1;
//			var $input = this.$('input.input_CACNV0380_mastitem.v' + num);

			var mstitem = [];
//			switch (this.options.side) {
//			case "basis":
//				mstitem = mstitemList[0];
//				break;
//			case "alt":
//				mstitem = mstitemList[1];
//				break;
//			}

			var num = 1;
			if (mstitemList.length != 0) {
				for (var i = 0; i < mstitemList.length; i++) {
					var mstitem_list = [];
					if (mstitemList[i].kind == amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_OP) {
						num++;
						continue;
					}
					var $input = this.$('input.input_CACNV0380_mastitem.v' + num);
					var _this = this;
					mstitem.push(mstitemList[i]);
					var input_name = mstitemList[i].name;
					for (var j = i + 1; j < mstitemList.length; j++) {
						if (mstitemList[j].kind != amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_OP) {
							i++;
							mstitem.push(mstitemList[j]);
							input_name += ",";
							input_name += mstitemList[j].name;
						} else {
							break;
						}
					}
					switch(num) {
					case 1:
						_this.select_lists.v1 = mstitem;
//						_this.old_lists.v1 = mstitem;
						break;
					case 2:
						_this.select_lists.v2 = mstitem;
//						_this.old_lists.v2 = mstitem;
						break;
					case 3:
						_this.select_lists.v3 = mstitem;
//						_this.old_lists.v3 = mstitem;
						break;
					}
					$input.val(input_name);
				}
				this.mstitem_list = mstitem;
			} else {
				this.mstitem_list = {};
			}



//			var mstitem = mstItemList;
//
//			if (mstitem) {
//				for (var i = 0; i < mstitem.length; i++) {
//					var num = i + 1;
//					var $input = this.$('input.input_CACNV0380_mastitem.v' + num);
//					var _this = this;
//					switch(i) {
//					case 0:
//						_this.select_lists.v1 = mstitem[i];
//						break;
//					case 1:
//						_this.select_lists.v2 = mstitem[i];
//						break;
//					case 2:
//						_this.select_lists.v3 = mstitem[i];
//						break;
//					}
//					var input_name = null;
////					var input_name = mstitem[i][0].name;
//					for (var j = 0; j < mstitem[i].length; j++) {
//						if (j == 0) {
//							input_name = mstitem[i][j].name;
//						} else {
//							input_name = input_name + "," + mstitem[i][j].name;
//						}
////						var input_name = input_name + "," + mstitem[i][j].name;
//					}
//					$input.val(input_name);
//				}
////				$input.val(mstitem[0][0].name);
//				this.mstitem_list = mstitem;
//			} else {
//				this.mstitem_list = {};
//			}
		},

		/**
		 * 選択画面の初期化処理
		 *
		 * 引数
		 * ・$parentView		: 親画面のjQueryオブジェクト (例：$('#ca_main'))
		 * ・anadata			: 分析情報
		 */
		render: function(
				$parentView,
				anadata
				) {
			var _this = this;

			this.$parentView = $parentView;
			this.anadata = anadata;

			var url = clcom.getAnaSubPaneURI(this.screenId);

			// 軸分類を取得し保存リストに格納
			this.axisList = [];
			var index = 1;
			if (this.anadata.cond_item_list != null && this.anadata.cond_item_list.length > 0) {
				for (var i = 0; i < this.anadata.cond_item_list.length; i++) {
					var axis = this.anadata.cond_item_list[i];
					if (axis.f_basket == 1 && axis.f_axis == 2 && axis.cond_attr == 0) {
						// インデックスを振る
						axis['index'] = index;
						index++;
						this.axisList.push(axis);
					}
				}
			}

			// HTMLソースを読み込む
			clutil.loadHtml(url, function(data) {
				_this.html_source = data;
			});
		},

		show: function(axisFolder, isSubDialog) {
			// 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
			if (isSubDialog == null) {
				$('.cl_dialog').empty();
			}

			this.$parentView.hide();

			// htmlソースからダイアログを作成する
			this.$el.html('');
			this.$el.html(this.html_source);

			// 画面の初期化
			this.initUIelement(axisFolder);

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_MDCMV0150_main'), {
				echoback		: $('.cl_echoback')
			});
			// フォーカスの設定
			this.setFocus();
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus(this.$('select.ca_MDCMV0150_axis_kind[axis-type=v1]'));
		},

		/**
		 * 種別変更
		 */
		_onAxisKindSelect: function(e) {
			var index = Number($(e.target).val()) - 1;
			var kind = 0;
			var func_id = 0;

			this.mstitem_list = {};	// 削除

			if (index >= 0) {
				kind = this.axisList[index].cond_kind;
				func_id = this.axisList[index].func_id;
			}
			if (kind == amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_ITGRP	// 商品分類階層
					|| kind == amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_ITEM	// 商品・品番
					|| kind == amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_IA	// 商品属性
					|| kind == amanp_AnaDefs.AMAN_DEFS_KIND_COLORSIZEITEM	// JANコード
					|| kind == amanp_AnaDefs.AMAN_DEFS_KIND_ITEMLIST	// 商品リスト
					) {
				// 表示項目選択画面表示用ボタンを表示
				this.makeDispItemButton(kind, func_id);
			} else {
				var $select = this.makeAttrSelect(axis_type, kind, func_id);
				if(!this.initializing
						&& !$select.closest('div').hasClass('dispn')
						&& $select.find('option').length >= 2){
					// Attr が複数個の場合は選択肢を開いて見せる
					_.defer(function(){
						// FIXME: selectpicker 選択肢を開いて見せる API ないの？
						$select.next().find('button').click();
					});
				}
			}
		},

		/**
		 * 表示項目選択ダイアログボタンの作成
		 */
		makeDispItemButton: function(kind, func_id) {
			var divobj = this.getAttrSelectDiv(kind);
			var $div_s = divobj.div_s;
			var $div_m = divobj.div_m;
			var $div = divobj.div;

			switch (Number(kind)) {
			case amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_ITGRP:
			case amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_ITEM:
			case amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_IA:	// TODO 未定義？
			case amanp_AnaDefs.AMAN_DEFS_KIND_COLORSIZEITEM:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMLIST:
				// ボタンを表示
				if ($div_s) {
					clutil.initcltypeselector2(
							$div_s, null, 1, null,
							null, null, null,
							{name : "info", }, "mbn wt280 flleft ca_MDCMV0150_axis_attr");
				}
				if ($div_m) {
					clutil.initcltypeselector2(
							$div_m, null, 1, null,
							null, null, null,
							{name : "info", }, "mbn wt280 flleft ca_MDCMV0150_axis_attr");
				}
				// 属性値をクリア
				var $input = $div.find('input');
//				$input.val('');
				break;
			default:
				// ボタンを非表示
				break;
			}
		},

		/**
		 * 属性コンボの作成
		 */
		makeAttrSelect: function(axis_type, kind, func_id) {
			// 属性値コンボを取得
			this.getAttrSelectDiv(kind);

			switch (kind) {
			case amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_ITGRP:
				break;
			case amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_ITEM:
				break;
			case amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_IA:
				break;
			case amanp_AnaDefs.AMAN_DEFS_KIND_COLORSIZEITEM:
				break;
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMLIST:
				break;
			}
			return null;
		},

		/**
		 * 属性値コンボ作成用divを取得
		 */
		getAttrSelectDiv : function(kind) {
			// var div_m = this.$('div.ca_MDCMV0150_axis_attr[axis-type=' +
			// axis_type + '_m]');
			var div_i = this.$('div.ca_MDCMV0150_axis_attr');

			switch (Number(kind)) {
			case amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_ITGRP:
			case amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_ITEM:
			case amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_IA:
			case amanp_AnaDefs.AMAN_DEFS_KIND_COLORSIZEITEM:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMLIST:
				// $(div_m).addClass('dispn');
				$(div_i).removeClass('dispn');
				return {div : div_i, multiple : false, div_m: null};
				break;
			default:
				// $(div_m).addClass('dispn');
				// $(div_i).addClass('dispn');
				return {div : null, multiple : false};
				break;
			}
		},

		/**
		 * 属性値コンボを取得
		 */
		getAttrSelect : function(kind, axis_type) {
			var select = this.$('select.ca_MDCMV0150_axis_attr[axis-type=' + axis_type + ']');
			var select_m = this.$('select.ca_MDCMV0150_axis_attr[axis-type=' + axis_type + '_m]');
			var div = this.$('div.ca_MDCMV0150_axis_attr[axis-type=' + axis_type + ']');
			var div_m = this.$('div.ca_MDCMV0150_axis_attr[axis-type=' + axis_type + '_m]');

			switch (Number(kind)) {
			case amanp_AnaDefs.AMAN_DEFS_KIND_ORG:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITGRP:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS1:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS2:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_BRAND:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_STYLE:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_DESIGN:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_MATERIAL:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_COLOR:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_T_COLOR:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_K_SIZE:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SEASON:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_USE:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ADDR:
			case amanp_AnaDefs.AMAN_DEFS_KIND_PACKITEM:
				if ($(div_m).hasClass('dispn')) {
					return null;
				} else {
					return select_m;
				}
				break;
			default:
				if ($(div).hasClass('dispn')) {
					return null;
				} else {
					return select;
				}
				break;
			}
		},

		/**
		 * 種別リストのインデックスを取得
		 */
		getAxisListIndex : function(kind, func_id) {
			if (this.axisList != null && this.axisList.length > 0) {
				for (var i = 0; i < this.axisList.length; i++) {
					var axis = this.axisList[i];
					if (axis.cond_kind == kind && axis.func_id == func_id) {
						return i+1;
					}
				}
			}
			return 0;
		},

		/**
		 * 種別から属性リストを取得
		 */
		getAttrList : function(kind, func_id) {
			// funcが空の場合は0にしておく
			func_id = func_id == null ? 0 : func_id;
			var attrList = [];
			if (this.anadata.cond_item_list != null && this.anadata.cond_item_list.length > 0) {
				for (var i = 0; i < this.anadata.cond_item_list.length; i++) {
					var axis = this.anadata.cond_item_list[i];
					if (axis.f_axis == 1 && axis.cond_kind == kind && axis.cond_attr != 0 && axis.func_id == func_id) {
						attrList.push(axis);
					}
				}
			}
			return attrList;
		},

		/**
		 * 表示属性選択ボタン押下
		 *
		 * @param e
		 */
		_onAxisDispClick: function(e) {
			console.log("CLICK:", e);
			var _this = this;

			if (this.isAnalyse_mode) {
				// 分析条件部分を閉じる
				clutil.closeCondition();
			}

			// どのボタンが押されたか取得
			var axis_type = $(e.target).attr('axis-type');
			var $select = this.$("select.ca_MDCMV0150_axis_kind");

			switch(axis_type) {
			case "v1":
				$select = $($select[0]);
				var $input = _this.$("input.input_CACNV0380_mastitem.v1");
				break;
			case "v2":
				$select = $($select[1]);
				var $input = _this.$("input.input_CACNV0380_mastitem.v2");
				break;
			case "v3":
				$select = $($select[2]);
				var $input = _this.$("input.input_CACNV0380_mastitem.v3");
				break;
			}

			// 軸の選択値を取得
			var index = Number($select.val()) - 1;
			var kind = 0;
			var func_id = 0;
			var name = "";

			if (index >= 0) {
				kind = this.axisList[index].cond_kind;
				func_id = this.axisList[index].func_id;
				name = this.axisList[index].name;
			}
			console.log("kind=" + kind + " func_id=" + func_id + " name=" + name);

			switch (kind) {
			case amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_ITGRP:
				this.MDCMV0150_CACMV0050Selector.show(null, true);
				// サブ画面復帰後処理
				this.MDCMV0150_CACMV0050Selector.okProc = function(data) {
					console.log("okProc:", data);
					var txt = "";
					if (data != null) {
						_.each(data, function(item, i) {
							if (i != 0) {
								txt += ",";
							}
							txt += item.name;
						});
						$input.val(txt);

						switch(axis_type) {
						case "v1":
							_this.select_lists.v1 = data;
							break;
						case "v2":
							_this.select_lists.v2 = data;
							break;
						case "v3":
							_this.select_lists.v3 = data;
							break;
						}

					}
				};
				break;
			case amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_ITEM:
				this.MDCMV0150_CACMV0060Selector.show(null, true);	// TODO
																	// 選択済みリスト
				// サブ画面復帰後処理
				this.MDCMV0150_CACMV0060Selector.okProc = function(data) {
					console.log("okProc:", data);
					var txt = "";
					if (data != null) {
						_.each(data, function(item, i) {
							if (i != 0) {
								txt += ",";
							}
							txt += item.name;
						});
						$input.val(txt);

						switch(axis_type) {
						case "v1":
							_this.select_lists.v1 = data;
							break;
						case "v2":
							_this.select_lists.v2 = data;
							break;
						case "v3":
							_this.select_lists.v3 = data;
							break;
						}
					}
				};
				break;
			case amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_IA:
				this.MDCMV0150_CACMV0070Selector.show(null, true);	// TODO
																	// 選択済みリスト
				// サブ画面復帰後処理
				this.MDCMV0150_CACMV0070Selector.okProc = function(data) {
					console.log("okProc:", data);
					var txt = "";
					if (data != null) {
						_.each(data, function(item, i) {
							if (i != 0) {
								txt += ",";
							}
							txt += item.name;
						});
						$input.val(txt);

						switch(axis_type) {
						case "v1":
							_this.select_lists.v1 = data;
							break;
						case "v2":
							_this.select_lists.v2 = data;
							break;
						case "v3":
							_this.select_lists.v3 = data;
							break;
						}
					}
				};
				break;
			case amanp_AnaDefs.AMAN_DEFS_KIND_COLORSIZEITEM:
				this.MDCMV0150_CACMV0240Selector.show(null, true);	// TODO
																	// 選択済みリスト
				// サブ画面復帰後処理
				this.MDCMV0150_CACMV0240Selector.okProc = function(data) {
					console.log("okProc:", data);
					var txt = "";
					if (data != null) {
						_.each(data, function(item, i) {
							if (i != 0) {
								txt += ",";
							}
							txt += item.name;
						});
						$input.val(txt);

						switch(axis_type) {
						case "v1":
							_this.select_lists.v1 = data;
							break;
						case "v2":
							_this.select_lists.v2 = data;
							break;
						case "v3":
							_this.select_lists.v3 = data;
							break;
						}
					}
				};
				break;
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMLIST:
				this.MDCMV0150_CACMV0080Selector.show(null, true);	// TODO
																	// 選択済みリスト
				// サブ画面復帰後処理
				this.MDCMV0150_CACMV0080Selector.okProc = function(data) {
					console.log("okProc:", data);
					var txt = "";
					if (data != null) {
						_.each(data, function(item, i) {
							if (i != 0) {
								txt += ",";
							}
							txt += item.name;
						});
						$input.val(txt);

						switch(axis_type) {
						case "v1":
							_this.select_lists.v1 = data;
							break;
						case "v2":
							_this.select_lists.v2 = data;
							break;
						case "v3":
							_this.select_lists.v3 = data;
							break;
						}
					}
				};
				break;
			}
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// validatorの初期化
			this.validator.clear();
		},

		/**
		 * 開始値フォーカスアウト
		 */
		_onFromAmFocusout: function(e) {
			var axis_type = $(e.target).closest('div.ca_MDCMV0150_fromto').attr('axis-type');
			var attr = this.$('select.ca_MDCMV0150_axis_attr[axis-type=' + axis_type + ']').val();
			var fromtolist = this.getFromToList(axis_type);

			// 領域のエラークリア
			var rank_validator = clutil.validator(this.$('#ca_MDCMV0150_' + axis_type + '_fromto'), {
				echoback		: $('.cl_echoback')
			});
			rank_validator.clear();

			if (!this.checkNumber(fromtolist, axis_type)) {
				return;
			}
			this.calcToAm(fromtolist, axis_type);
		},

		/**
		 * 昇順/降順で入力されたかのチェック
		 */
		checkNumber: function(fromtolist, axis_type) {
			var inputlist = this.$('#ca_MDCMV0150_' + axis_type + '_fromto input[name=val]');
			var attr = this.$('select.ca_MDCMV0150_axis_attr[axis-type=' + axis_type + ']').val();

			if (fromtolist == null || fromtolist.length <= 1) {
				return true;
			} else {
				if (this.chkAscend(attr)) {
					// 昇順
					var last = fromtolist.length - 1;
					var isAscending = true;

					for (var i = 0; i <= last-1; i++) {
						var rank1 = fromtolist[i];
						if (clutil.cStr(rank1.val) != "") {

							// 割合タイプは100以上は入力不可
							if (this.chkSumrt(attr) && Number(rank1.val) >= 100) {
								this.validator.setErrorMsg($(inputlist[i]), clmsg.ca_MDCMV0150_0004);
								isAscending = false;
							}

							for (var j = i+1; j <= last; j++) {
								var rank2 = fromtolist[j];
								// 次に入力されている値との昇順チェック
								if (clutil.cStr(rank2.val) != "") {
									if (Number(rank1.val) >= Number(rank2.val)) {
										// エラーの設定
										this.validator.setErrorMsg($(inputlist[i]), clmsg.ca_MDCMV0150_0001);
										this.validator.setErrorMsg($(inputlist[j]), clmsg.ca_MDCMV0150_0001);
										isAscending = false;
									}
									break;
								}
							}
						}
					}

					// 割合タイプは100以上は入力不可（最終行のチェック）
					if (this.chkSumrt(attr) && Number(fromtolist[last].val) >= 100) {
						this.validator.setErrorMsg($(inputlist[last]), clmsg.ca_MDCMV0150_0004);
						isAscending = false;
					}

					if (!isAscending) {
						this.validator.setErrorHeader(clmsg.cl_echoback);
						// フォーカスの設定
						var err = $('#ca_MDCMV0150_' + axis_type + '_fromto input.cl_error_field:first[name=val]');
						$(err).focus();
						return false;
					}
				} else {
					// 降順
					var last = 0;
					var isDescending = true;

					for (var i = fromtolist.length-1; i >= last+1; i--) {
						var rank1 = fromtolist[i];
						if (clutil.cStr(rank1.val) != "") {

							// 割合タイプは100以上は入力不可
							if (this.chkSumrt(attr) && Number(rank1.val) >= 100) {
								this.validator.setErrorMsg($(inputlist[i]), clmsg.ca_MDCMV0150_0004);
								isDescending = false;
							}

							for (var j = i-1; j >= last; j--) {
								var rank2 = fromtolist[j];
								// 次に入力されている値との降順チェック
								if (clutil.cStr(rank2.val) != "") {
									if (Number(rank1.val) >= Number(rank2.val)) {
										// エラーの設定
										this.validator.setErrorMsg($(inputlist[i]), clmsg.ca_MDCMV0150_0006);
										this.validator.setErrorMsg($(inputlist[j]), clmsg.ca_MDCMV0150_0006);
										isDescending = false;
									}
									break;
								}
							}
						}
					}

					// 割合タイプは100以上は入力不可（最終行のチェック）
					if (this.chkSumrt(attr) && Number(fromtolist[last].val) >= 100) {
						this.validator.setErrorMsg($(inputlist[last]), clmsg.ca_MDCMV0150_0004);
						isDescending = false;
					}

					if (!isDescending) {
						this.validator.setErrorHeader(clmsg.cl_echoback);
						// フォーカスの設定
						var err = $('#ca_MDCMV0150_' + axis_type + '_fromto input.cl_error_field:first[name=val]');
						$(err).focus();
						return false;
					}
				}

				return true;
			}
		},

		/**
		 * 昇順/降順で計算をする
		 */
		calcToAm: function(fromtolist, axis_type) {
			var attr = this.$('select.ca_MDCMV0150_axis_attr[axis-type=' + axis_type + ']').val();

			if (fromtolist == null) {
				// なにもしない
				return;
			} else {
				if (this.chkAscend(attr)) {
					// 昇順
					var last = fromtolist.length - 1;

					for (var i = 0; i <= last-1; i++) {
						var rank = fromtolist[i];
						if (clutil.cStr(rank.val) != "") {
							for (var j = i+1; j <= last; j++) {
								var nextrank = fromtolist[j];
								if (clutil.cStr(nextrank.val) != "") {
									// 次に入力されている値-1をセットする
									rank.val2 = Number(nextrank.val) - 1;
									break;
								}

								// 次に入力されている値がなければMax値は空
								if (j == last) {
									rank.val2 = "";
								}
							}
						} else {
							// from値が空ならto値も空にする
							rank.val2 = "";
						}
					}
					// 最終行のチェック
					if (clutil.cStr(fromtolist[last].val) == "") {
						// from値が空ならto値も空にする
						fromtolist[last].val2 = "";
					}

					// 最後に入力されている行を取得
					for (var i = fromtolist.length-1; i >= 0; i--) {
						var rank = fromtolist[i];
						if (clutil.cStr(rank.val) != "") {
							last = i;
							break;
						}
					}

					// 最終行の終了値は常に空
					if (this.chkSumrt(attr)) {
						fromtolist[last].val2 = 100;
					} else {
						fromtolist[last].val2 = "";
					}
				} else {
					// 降順
					var last = 0;

					for (var i = fromtolist.length-1; i >= last+1; i--) {
						var rank = fromtolist[i];
						if (clutil.cStr(rank.val) != "") {
							for (var j = i-1; j >= last; j--) {
								var nextrank = fromtolist[j];
								if (clutil.cStr(nextrank.val) != "") {
									// 次に入力されている値-1をセットする
									rank.val2 = Number(nextrank.val) - 1;
									break;
								}

								// 次に入力されている値がなければMax値は空
								if (j == last) {
									rank.val2 = "";
								}
							}
						} else {
							// from値が空ならto値も空にする
							rank.val2 = "";
						}
					}
					// 最終行のチェック
					if (clutil.cStr(fromtolist[last].val) == "") {
						// from値が空ならto値も空にする
						fromtolist[last].val2 = "";
					}

					// 最後に入力されている行を取得
					for (var i = 0; i <= fromtolist.length-1; i++) {
						var rank = fromtolist[i];
						if (clutil.cStr(rank.val) != "") {
							last = i;
							break;
						}
					}

					// 最終行の終了値は常に空
					if (this.chkSumrt(attr)) {
						fromtolist[last].val2 = 100;
					} else {
						fromtolist[last].val2 = "";
					}
				}
			}

			// 終了値の再設定
			var inputlist = $('#ca_MDCMV0150_' + axis_type + '_fromto input[name=val2]');
			for (var i = 0; i < inputlist.length; i++) {
				var input = inputlist[i];
				$(input).val(fromtolist[i].val2);
			}
			// カンマ表示のため再設定
			clutil.inputlimiter(this.$el);

		},

		/**
		 * 期間最終来店店舗fromtoチェック
		 */
		checkLastStore : function(laststorelist, axis_type) {
			var inputfrom = this.$('#ca_MDCMV0150_' + axis_type + '_laststore input[name=val]');
			var inputto = this.$('#ca_MDCMV0150_' + axis_type + '_laststore input[name=val2]');
			var chkInfo = [];
			for (var i = 0; i < inputfrom.length; i++) {
				// 範囲反転チェック
				chkInfo.push({
					$stval : $(inputfrom[i]),
					$edval : $(inputto[i])
				});
			}

			if(!this.validator.validFromToObj(chkInfo)){
				return false;
			}
			return true;
		},

		// FromToリストを取得
		getFromToList : function(axis_type, splice, attr){
			var divlist = this.$('div.ca_MDCMV0150_' + axis_type + '_fromto_elem');
			var fromtolist = clutil.tableview2data(divlist);

			// 空行を削除するフラグ
			if (splice) {
				for (var i = fromtolist.length-1; i >= 0; i--) {
					fromto = fromtolist[i];
					// 開始値が入力されていなかったら要素を削除する
					if (clutil.cStr(fromto.val) == "") {
						fromtolist.splice(i, 1);
						continue;
					}
				}
				// 最後の値を入力
				if (this.chkSumrt(attr)) {
					if (this.chkAscend(attr)) {
						// 昇順
						fromtolist[fromtolist.length-1].val2 = 100;
					} else {
						// 降順
						fromtolist[0].val2 = 100;
					}
				} else {
					if (this.chkAscend(attr)) {
						// 昇順
						fromtolist[fromtolist.length-1].val2 = clcom.int_max;
					} else {
						// 降順
						fromtolist[0].val2 = clcom.int_max;
					}
				}
			}

			return fromtolist;
		},

		// LastStoreリストを取得
		getLastStoreList : function(axis_type){
			var divlist = this.$('div.ca_MDCMV0150_' + axis_type + '_laststore_elem');
			var laststorelist = clutil.tableview2data(divlist);

			return laststorelist;
		},

		/**
		 * fromtoハッシュを作成
		 */
		makeFromToHash : function(kind, attr, fromtolist) {
			attr = attr == null ? 0 : attr;
			if (this.fromtoList == null) {
				this.fromtoList = {};
			}
			if (this.fromtoList[kind] == null) {
				this.fromtoList[kind] = {};
			}
			var kindhash = this.fromtoList[kind];
			kindhash[attr] = fromtolist;
			this.fromtoList[kind] = kindhash;
		},

		/**
		 * fromtoハッシュからリストを取得
		 */
		getFromToHash : function(kind, attr) {
			attr = attr == null ? 0 : attr;
			if (this.fromtoList == null) {
				return [];
			} else if (this.fromtoList[kind] == null) {
				return [];
			} else {
				var kindhash = this.fromtoList[kind];
				return kindhash[attr];
			}
		},

		/**
		 * 割合属性かチェック
		 */
		chkSumrt : function(attr) {
			if ((Number(attr) & amanp_AnaDispItemDefs.GSAN_DI_S_MASK) ==
				amanp_AnaDispItemDefs.GSAN_DI_S_SUMRT) {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * 昇順/降順のチェック 最新来店日(実績値)のみ昇順となる
		 */
		chkAscend : function(attr) {
			if (((Number(attr) & amanp_AnaDispItemDefs.GSAN_DI_S_MASK) ==
				amanp_AnaDispItemDefs.GSAN_DI_S_VAL) && ((Number(attr) & amanp_AnaDispItemDefs.GSAN_DI_I_MASK) ==
					amanp_AnaDispItemDefs.GSAN_DI_I_COMING_LASTDAY)) {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * 選択された軸データの整合性チェック
		 */
		chkData : function() {
			var AxisList = [];
			var index = Number(this.$('select.ca_MDCMV0150_axis_kind').val()) - 1;
			if (index >= 0) {
				axis.kind = this.axisList[index].cond_kind;
			} else {
				axis.kind = 0;
			}
			axis.$kind_select = $(this.$('select.ca_MDCMV0150_axis_kind'));
			axis.$attr_select = this.getAttrSelect(axis.kind, axis.axis_type);
			axis.attr = $(axis.$attr_select).val();

			AxisList.push(axis);

			// 複数選択で未選択の場合はエラー
			for (var i = 0; i < AxisList.length; i++) {
				var pAxis = AxisList[i];
				switch (Number(pAxis.kind)) {
				case amanp_AnaDefs.AMAN_DEFS_KIND_ORG:
				case amanp_AnaDefs.AMAN_DEFS_KIND_ITGRP:
				case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS1:
				case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS2:
				case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_BRAND:
				case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_STYLE:
				case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_DESIGN:
				case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_MATERIAL:
				case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_COLOR:
				case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_T_COLOR:
				case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_K_SIZE:
				case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SEASON:
				case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_USE:
				case amanp_AnaDefs.AMAN_DEFS_KIND_ADDR:
			    case amanp_AnaDefs.AMAN_DEFS_KIND_PACKITEM:
					if ((Number(pAxis.kind) != 0) && (pAxis.attr == null)) {
						// 属性値がない場合はエラーにならない
						// 属性値が存在するのに選択されていない場合はエラー
						if (pAxis.$attr_select != null &&
								!$(pAxis.$attr_select.closest('div')).hasClass('dispn')) {
							this.validator.setErrorMsg(pAxis.$attr_select, clmsg.ca_MDCMV0150_0005);
							retStat = true;
						}
					}
					break;
				default:
					break;
				}
			}

			if (retStat) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				// フォーカスの設定
// var err = $('#ca_MDCMV0150_' + axis_type + '_fromto
// input.cl_error_field:first[name=val]');
// $(err).focus();
				return false;
			}

			// チェックを通過した場合のみリストを格納
			if (AxisList.length > 0) {
				// fromtoリストを格納
				for (var i = 0; i < AxisList.length; i++) {
					var axis = AxisList[i];

					switch (Number(axis.kind)) {
					case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_RFM:
					case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_DECIL:
					case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_ABC:
						var fromtolist = this.getFromToList(axis.axis_type, true, axis.attr);
						// fromtoリストを格納
						this.makeFromToHash(axis.kind, axis.attr, fromtolist);
						break;
					// 期間最終来店店舗
					case amanp_AnaDefs.AMAN_DEFS_KIND_LASTSTORE:
						var laststorelist = this.getLastStoreList(axis.axis_type);
						// laststoreリストを格納
						this.makeFromToHash(axis.kind, 0, laststorelist);
						break;
					}
				}
			}
			return true;

		},

		/**
		 * 選択された軸データを取得
		 */
		getAxisData : function() {
			var axisFolder = clutil.view2data(this.$('.ca_MDCMV0150_searchArea'), 'ca_MDCMV0150_');
			var vAxisList = [];
			var hAxisList = [];
//			for (var i = 1; i <= this.anadata.axis_num.v_axis_num; i++) {
			for (var i = 1; i <= 3; i++) {
				var axis = {};
				var $select = this.$("select.ca_MDCMV0150_axis_kind");
//				var index = Number(this.$('select.ca_MDCMV0150_axis_kind').val()) - 1;
				$select = $($select[i - 1]);
				var index = Number($select.val()) - 1;

				if (index >= 0) {
					axis.kind = this.axisList[index].cond_kind;
					axis.name2 = this.axisList[index].name;
					axis.func_id = this.axisList[index].func_id;
					axis = this.getAttr(axis, 'v' + i);
					vAxisList.push(axis);
				}
			}
			for (var i = 1; i <= this.anadata.axis_num.h_axis_num; i++) {
				var axis = {};
				var index = Number(this.$('select.ca_MDCMV0150_axis_kind').val()) - 1;

				if (index >= 0) {
					axis.kind = this.axisList[index].cond_kind;
					axis.name2 = this.axisList[index].name;
					axis.func_id = this.axisList[index].func_id;
					axis = this.getAttr(axis, 'h' + i);
					hAxisList.push(axis);
				}
			}
			axisFolder.vAxisList = vAxisList;
			axisFolder.hAxisList = hAxisList;

			return axisFolder;
		},

		/**
		 * 属性値を取得
		 */
		getAttr : function(axis, axis_type) {
			var select = this.$('select.ca_MDCMV0150_axis_attr');

			// 名称を空に
			axis.name = '';

			// TODO ここで表示項目も設定するか？
			switch (Number(axis.kind)) {
			case amanp_AnaDefs.AMAN_DEFS_KIND_ORG:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITGRP:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS1:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS2:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_BRAND:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_STYLE:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_DESIGN:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_MATERIAL:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_COLOR:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_T_COLOR:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_K_SIZE:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SEASON:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_USE:
			case amanp_AnaDefs.AMAN_DEFS_KIND_ADDR:
            case amanp_AnaDefs.AMAN_DEFS_KIND_PACKITEM:
// var attrlist = $(select_m).val();
// var dispattr = 0;
// if (attrlist != null && attrlist.length > 0) {
// for (var i = 0; i < attrlist.length; i++) {
// var attr = attrlist[i];
// dispattr = dispattr | 1 << (attr-1);
// var name = $(select_m).find('option[value=' + attr + ']').html();
// axis.name = axis.name + name;
// if (i != attrlist.length-1) {
// axis.name = axis.name + '⇒';
// }
// }
// axis.attr = attrlist[attrlist.length-1];
// axis.dispattr = dispattr;
// }
				break;
			default:
//				axis.attr = this.select_list.kind;
// axis.attr = $(select).val();
// if (Number(axis.attr) == 0) {
// // 属性値0の場合は空文字を入れる
// axis.name = '';
// } else {
// axis.name = $(select).find('option[value=' + $(select).val() + ']').html();
// }
				break;
			}
			return axis;
		},

		/**
		 * マスタ表示項目を取得
		 */
		getMastItemData: function() {
			var select_list = [];
			var _this = this;
			var cond = [
				{
					kind : amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_OP,
					attr : amanp_AnaDefs.AMAN_DEFS_ATTR_BASKET_OP_AND,
					val : 1,
					name : "AND",
				},
				{
					kind : amanp_AnaDefs.AMAN_DEFS_KIND_BASKET_OP,
					attr : amanp_AnaDefs.AMAN_DEFS_ATTR_BASKET_OP_OR,
					val : 2,
					name : "OR",
				}
			];
			var obj_len = Object.keys(this.select_lists).length;
//			var old_len = Object.keys(this.old_lists).length;
//			if (obj_len == 0 && old_len !=0) {
//				this.select_lists = this.old_lists;
//				obj_len = old_len;
//			}
			for (var i = 1; i <= obj_len ; i++) {
				switch(i) {
				case 1:
					if ('v1' in _this.select_lists === false) {
						break;
					}
					for (var j = 0; j < _this.select_lists.v1.length; j++) {
						select_list.push(_this.select_lists.v1[j]);
					}
//					select_list.push(_this.select_lists.v1);
					delete _this.select_lists.v1;
					break;
				case 2:
					if ('v2' in _this.select_lists === false) {
						break;
					}
					var num = $("[name=v2_cond]").length;
					for (var j = 0; j < num; j++) {
						if ($("[name=v2_cond]")[j].checked) {
							_this.select_lists.v2.cond_val = $("[name=v2_cond]")[j].value;
						}
					}
					var cond_val = _this.select_lists.v2.cond_val -1;
					select_list.push(cond[cond_val])
					for (var k = 0; k < _this.select_lists.v2.length; k++) {
						select_list.push(_this.select_lists.v2[k]);
					}
//					select_list.push(_this.select_lists.v2);
					delete _this.select_lists.v2;
					break;
				case 3:
					var num = $("[name=v3_cond]").length;
					for (var j = 0; j < num; j++) {
						if ($("[name=v3_cond]")[j].checked) {
							_this.select_lists.v3.cond_val = $("[name=v3_cond]")[j].value;
						}
					}
					var cond_val = _this.select_lists.v3.cond_val -1;
					select_list.push(cond[cond_val])
					for (var k = 0; k < _this.select_lists.v3.length; k++) {
						select_list.push(_this.select_lists.v3[k]);
					}
//					select_list.push(_this.select_lists.v3);
					delete _this.select_lists.v3;
					break;
				}
			}
			this.select_lists = {};
			return select_list;
		},

		/**
		 * 選択した軸に「集約商品」があるか？
		 *
		 * @param axisFolder
		 * @returns {Boolean}
		 */
		isPackItem: function(axisFolder) {
			var f_pack = false;

			if (axisFolder != null) {
				if (axisFolder.vAxisList != null) {
					for (var i = 0; i < axisFolder.vAxisList.length; i++) {
						var axis = axisFolder.vAxisList[i];
						if (axis.kind == amanp_AnaDefs.AMAN_DEFS_KIND_PACKITEM) {
							f_pack = true;
							break;
						}
					}
				}
				if (!f_pack && axisFolder.hAxisList != null) {
					for (var i = 0; i < axisFolder.hAxisList.length; i++) {
						var axis = axisFolder.hAxisList[i];
						if (axis.kind == amanp_AnaDefs.AMAN_DEFS_KIND_PACKITEM) {
							f_pack = true;
							break;
						}
					}
				}
			}

			return f_pack;
		},

		_onCommitClick2: function() {
			this.$parentView.show();
			this.okProc({axisFolder: this._tmpAxisFolder, basketFolder: this._tmpMastItemFolder});
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			this.validator.clear();
			var retStat = true;

			if (!this.validator.valid()) {
				retStat = false;
			}
			// 表示項目の取得
			var mastItemFolder = this.getMastItemData();
			if (mastItemFolder == null || mastItemFolder.length == 0) {
//			if (mastItemFolder.length == 0 && 'v1' in this.old_lists === false) {
				var msg = '比較対象を選択して下さい。';
				this.validator.setErrorInfo({_eb_: msg});
				retStat = false;
			}
			if (!retStat) {
				this.validator.setErrorFocus();
				return;
			}

			// 軸データの取得
			var axisFolder = this.getAxisData();
			// fromtoデータを設定
			axisFolder.fromtoList = this.fromtoList;

			this._tmpAxisFolder = axisFolder;

			this._tmpMastItemFolder = mastItemFolder;

			this._onCommitClick2();

		},

		// 選択時処理 呼び出し側で override する
		okProc : function(){
			// 上位で上書きする。
		},

		/**
		 * キャンセル
		 */
		_onCancelClick: function() {
			this.$parentView.show();
			this.okProc(null);
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
		}
	});

});
