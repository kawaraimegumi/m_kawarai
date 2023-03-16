
$(function() {

	//////////////////////////////////////////////
	// View
	CACMV0180SelectorView = Backbone.View.extend({
		screenId : "CACMV0180",
		validator: null,

		mstitem_list: {},

		// 押下イベント
		events: {
			"change #ca_CACMV0180_main .ca_CACMV0180_axis_kind"	:	"_onAxisKindSelect",		// 軸種別項目変更
			"change #ca_CACMV0180_main .ca_CACMV0180_axis_attr"	:	"_onAxisAttrSelect",		// 軸属性項目変更
//			"keyup #ca_CACMV0020_func_id"		:	"_onFuncSelect",		// 種別変更
//			"keydown #ca_CACMV0020_func_id"		:	"_onFuncSelect",		// 種別変更

			"click #ca_CACMV0180_main .button_CACMV0180_show_CACMV0370"	:	"_onAxisDispClick",	// 表示項目選択サブ画面

			"click #ca_CACMV0180_main .ca_CACMV0180_clear"		:	"_onClearClick",		// クリアボタン押下
			"click #ca_CACMV0180_main .ca_CACMV0180_default"	:	"_onDefaultClick",		// 初期値に戻すボタン押下

			"click #ca_CACMV0180_commit"						:	"_onCommitClick",	// 確定ボタン押下

			"change #ca_CACMV0180_main .ca_CACMV0180_val"		:	"_onFromAmFocusout",	// 開始値フォーカスアウト

			"click #ca_CACMV0180_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_CACMV0180_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_CACMV0180_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
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

			// 軸数によって表示を変える
			if (this.anadata.axis_num.v_axis_num == 1) {
				this.$('.ca_CACMV0180_v2').remove();
				this.$('.ca_CACMV0180_v3').remove();
			} else if (this.anadata.axis_num.v_axis_num == 2) {
				this.$('.ca_CACMV0180_v3').remove();
			} else if (this.anadata.axis_num.v_axis_num == 0) {
				this.$('.ca_CACMV0180_v').remove();
				this.$('.ca_CACMV0180_v1').remove();
				this.$('.ca_CACMV0180_v2').remove();
				this.$('.ca_CACMV0180_v3').remove();
			}

			// 軸数によって表示を変える
			if (this.anadata.axis_num.h_axis_num == 1) {
				this.$('.ca_CACMV0180_h2').remove();
			} else if (this.anadata.axis_num.h_axis_num == 0) {
				this.$('.ca_CACMV0180_h').remove();
				this.$('.ca_CACMV0180_h1').remove();
				this.$('.ca_CACMV0180_h2').remove();
			}
			// 併売分析（併売点数分析）の場合は軸によって項目を変更する
			if (this.options.isMDRcpt) {
				var axis1 = _.filter(this.axisList, function(axis) {
					return axis.cond_kind == amanp_AnaDefs.AMAN_DEFS_KIND_RCPT_QY
						|| axis.cond_kind == amanp_AnaDefs.AMAN_DEFS_KIND_TRANATTR_MARKET
						|| axis.cond_kind == amanp_AnaDefs.AMAN_DEFS_KIND_TRANATTR_SEXAGE
						|| axis.cond_kind == amanp_AnaDefs.AMAN_DEFS_KIND_STORE;
				});
				var axis2 = _.filter(this.axisList, function(axis) {
					return axis.cond_kind != amanp_AnaDefs.AMAN_DEFS_KIND_YMD;
				});
				var axis3 = _.filter(this.axisList, function(axis) {
					return axis.cond_kind == amanp_AnaDefs.AMAN_DEFS_KIND_RCPT_ITGRP;
				});
				var axis4 = _.filter(this.axisList, function(axis) {
					return axis.cond_kind == amanp_AnaDefs.AMAN_DEFS_KIND_YMD;
				});
				// 縦軸１ 未選択値なし
				clutil.cltypeselector2(this.$('select.ca_CACMV0180_axis_kind[axis-type=v1]'),
						axis1, 0,
						1,
						'index');
				// 縦軸２
				clutil.cltypeselector2(this.$('select.ca_CACMV0180_axis_kind[axis-type=v2]'),
						axis2, 1,
						1,
						'index');
				// 縦軸３
				clutil.cltypeselector2(this.$('select.ca_CACMV0180_axis_kind[axis-type=v3]'),
						axis3, 1,
						1,
						'index');
				// 横軸１
				clutil.cltypeselector2(this.$('select.ca_CACMV0180_axis_kind[axis-type=h1]'),
						axis4, 1,
						1,
						'index');
			} else {
				// 縦軸１ 未選択値なし
				clutil.cltypeselector2(this.$('select.ca_CACMV0180_axis_kind[axis-type=v1]'),
						this.axisList, 0,
						1,
						'index');
				// 縦軸２
				clutil.cltypeselector2(this.$('select.ca_CACMV0180_axis_kind[axis-type=v2]'),
						this.axisList, (this.options.isMDBascket ? 0 : 1),
						1,
						'index');
				// 縦軸３
				clutil.cltypeselector2(this.$('select.ca_CACMV0180_axis_kind[axis-type=v3]'),
						this.axisList, 1,
						1,
						'index');
				// 横軸１
				clutil.cltypeselector2(this.$('select.ca_CACMV0180_axis_kind[axis-type=h1]'),
						this.axisList, 1,
						1,
						'index');
			}
			// 横軸２
			clutil.cltypeselector2(this.$('select.ca_CACMV0180_axis_kind[axis-type=h2]'),
					this.axisList, 1,
					1,
					'index');

			// MD商品分析版のABC軸基準設定
			if(!Ana.Config.cond.CACMV0180.isMDABCAxis){
				this.$('.ca_CACMV0180_mdabc').remove();
			}

			// 表示属性選択を非表示
			if (Ana.Config.cond.CACMV0180.nodisp_v1i) {

			}

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
				clutil.data2view(this.$('.ca_CACMV0180_searchArea'), axisFolder, 'ca_CACMV0180_');

				var vAxisList = axisFolder.vAxisList;
				var hAxisList = axisFolder.hAxisList;
				var mstitemList = axisFolder.mstitemList;
				if (vAxisList != null && vAxisList.length > 0) {
					for (var i = 1; i <= vAxisList.length; i++) {
						var axis = vAxisList[i-1];
						this.$('select.ca_CACMV0180_axis_kind[axis-type=v' + i + ']')
							.selectpicker('val', this.getAxisListIndex(axis.kind, axis.func_id));
						this.makeAttrSelect('v' + i, axis.kind, axis.func_id);
						this.setAttr(axis, 'v' + i);
						this.setMstItem(axis, 'v' + i, mstitemList);
					}
				}
				if (hAxisList != null && hAxisList.length > 0) {
					for (var i = 1; i <= hAxisList.length; i++) {
						var axis = hAxisList[i-1];
						this.$('select.ca_CACMV0180_axis_kind[axis-type=h' + i + ']')
							.selectpicker('val', this.getAxisListIndex(axis.kind, axis.func_id));
						this.makeAttrSelect('h' + i, axis.kind, axis.func_id);
						this.setAttr(axis, 'h' + i);
					}
				}

				// MD商品分析 ABC 基準の設定
				if(Ana.Config.cond.CACMV0180.isMDABCAxis){
					this.$(':radio[name="ca_CACMV0180_mdabc_type"][value=' + axisFolder.mdabc_type + ']').radio('check');
				}
			}

			// 軸選択注意喚起ラベル
			if (Ana.Config.cond.CACMV0180.attentionText) {
				this.$('#title .attentionText').text(Ana.Config.cond.CACMV0180.attentionText);
			}

			// 表示属性選択補助画面
			this.CACMV0180_CACMV0370Selector = new  CACMV0370SelectorView({
				el : this.$('#ca_CACMV0180_CACMV0370_dialog'),	// 配置場所
				$parentView		: this.$('#ca_CACMV0180_main'),
				isAnalyse_mode	: this.isAnalyse_mode,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_single_select,	// 単一選択モード
				anadata			: this.anadata,			// anaProc に入れる予定。
				anaProc			: this.options.anaProc
			});
			this.CACMV0180_CACMV0370Selector.render();

			this.initializing = false;
		},

		/**
		 * 属性値を設定
		 */
		setAttr : function(axis, axis_type) {
			var select = this.$('select.ca_CACMV0180_axis_attr[axis-type=' + axis_type + ']');
			var select_m = this.$('select.ca_CACMV0180_axis_attr[axis-type=' + axis_type + '_m]');

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
				var attrlist = [];
				var axis_attrlist = this.getAttrList(axis.kind, axis.func_id);
				if (axis_attrlist != null && axis_attrlist.length > 0) {
					for (var i = 0; i < axis_attrlist.length; i++) {
						var attr = axis_attrlist[i].cond_attr;
						var shift_attr = 1 << (attr-1);
						if ((axis.dispattr & shift_attr) == shift_attr) {
							attrlist.push(attr);
						}
					}
				}
				$(select_m).selectpicker('val', attrlist);
				break;
			default:
				$(select).selectpicker('val', axis.attr);
				break;
			}
			return axis;
		},

		setMstItem: function(axis, axis_type, mstitemList) {
			if (mstitemList == null) {
				return;
			}
			var $input = this.$("input.input_CACNV0180_mastitem[axis-type='" + axis_type + "']");
			var mstitem = mstitemList[axis_type];
			if (mstitem) {
				var txt = "";
				_.each(mstitem, function(item, i) {
					if (i != 0) {
						txt += ",";
					}
					txt += item.name;
				});
				$input.val(txt);
				this.mstitem_list[axis_type] = mstitem;
			} else {
				this.mstitem_list[axis_type] = [];
			}
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

//			var url = "";
//			url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
			var url = clcom.getAnaSubPaneURI(this.screenId);

			// 軸分類を取得し保存リストに格納
			this.axisList = [];
			var index = 1;
			if (this.anadata.cond_item_list != null && this.anadata.cond_item_list.length > 0) {
				for (var i = 0; i < this.anadata.cond_item_list.length; i++) {
					var axis = this.anadata.cond_item_list[i];
					if (axis.f_axis == 1 && axis.cond_attr == 0) {
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
			this.validator = clutil.validator(this.$('#ca_CACMV0180_main'), {
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
			clutil.setFocus(this.$('select.ca_CACMV0180_axis_kind[axis-type=v1]'));
		},

		/**
		 * 種別変更
		 */
		_onAxisKindSelect: function(e) {
			var axis_type = $(e.target).attr('axis-type');
			var index = Number($(e.target).val()) - 1;
			var kind = 0;
			var func_id = 0;

			this.mstitem_list[axis_type] = [];	// 削除

			if (index >= 0) {
				kind = this.axisList[index].cond_kind;
				func_id = this.axisList[index].func_id;
			}
			if (kind == amanp_AnaDefs.AMAN_DEFS_KIND_ITEM	// 商品・品番
					|| kind == amanp_AnaDefs.AMAN_DEFS_KIND_COLORITEM	// カラー商品
					|| kind == amanp_AnaDefs.AMAN_DEFS_KIND_COLORSIZEITEM	// JAN・タグコード
					) {
				// 表示項目選択画面表示用ボタンを表示
				this.makeDispItemButton(axis_type, kind, func_id);
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
		makeDispItemButton: function(axis_type, kind, func_id) {
			var divobj = this.getAttrSelectDiv(kind, axis_type);
			var $div_s = divobj.div_s;
			var $div_m = divobj.div_m;
			var $div = divobj.div;

			switch (Number(kind)) {
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEM:
			case amanp_AnaDefs.AMAN_DEFS_KIND_COLORSIZEITEM:
			case amanp_AnaDefs.AMAN_DEFS_KIND_COLORITEM:	// TODO 未定義？
				// ボタンを表示
				if ($div_s) {
					clutil.initcltypeselector2(
							$div_s, null, 1, null,
							null, null, null,
							{name : "info", 'axis-type' : axis_type}, "mbn wt280 flleft ca_CACMV0180_axis_attr");
				}
				if ($div_m) {
					clutil.initcltypeselector2(
							$div_m, null, 1, null,
							null, null, null,
							{name : "info", 'axis-type' : axis_type}, "mbn wt280 flleft ca_CACMV0180_axis_attr");
				}
				// 属性値をクリア
				var $input = $div.find('input');
				$input.val('');
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
			var attrlist = this.getAttrList(kind, func_id);
			// 属性値コンボを取得
			var divobj = this.getAttrSelectDiv(kind, axis_type);
			var $div = divobj.div;
			var multiple = divobj.multiple;

			switch (kind) {
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEM:
			case amanp_AnaDefs.AMAN_DEFS_KIND_COLORSIZEITEM:
			case amanp_AnaDefs.AMAN_DEFS_KIND_COLORITEM:	// TODO 未定義？
				return null;
			}

			if (attrlist == null || attrlist.length == 0) {
//				clutil.cltypeselector2($select, null, 1);
				clutil.initcltypeselector2(
						$div, null, 1, null,
						null, null, null,
						{name : "info", 'axis-type' : axis_type}, "mbn wt280 flleft ca_CACMV0180_axis_attr");


				$div.addClass('dispn');

				// 期間最終来店店舗
				switch (Number(kind)) {
				case amanp_AnaDefs.AMAN_DEFS_KIND_LASTSTORE:
					var laststorelist = this.getFromToHash(kind, 0);
					// fromto領域を表示
					this.showLastStoreArea(laststorelist, axis_type);
					break;
				default:
					// fromto領域を非表示
					this.hideFromToArea(axis_type);
					// laststore領域を非表示
					this.hideLastStoreArea(axis_type);
					break;
				}
			} else {
				var option = {
						name : "info",
						'axis-type' : axis_type
				};
				// 複数選択の場合
				if (multiple) {
					option['multiple'] = true;
					option['axis-type'] = axis_type + '_m';
				}
				clutil.initcltypeselector2(
						$div, attrlist, 0, 1,
						'cond_attr', null, null,
						option, "mbn wt280 flleft ca_CACMV0180_axis_attr");

//				clutil.cltypeselector2($select, attrlist, 0,
//						1,
//						'cond_attr');
				$div.closest('div').removeClass('dispn');

				switch (Number(kind)) {
				case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_RFM:
				case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_DECIL:
				case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_ABC:
					var fromtolist = this.getFromToHash(kind, attrlist[0].cond_attr);
					// fromto領域を表示
					this.showFromToArea(fromtolist, axis_type);
					break;
				default:
					// fromto領域を非表示
					this.hideFromToArea(axis_type);
					// laststore領域を非表示
					this.hideLastStoreArea(axis_type);
					break;
				}
			}
			var $select = $($div.find('select'));
			return $select;
		},

		/**
		 * 属性値コンボ作成用divを取得
		 */
		getAttrSelectDiv : function(kind, axis_type) {
			var div = this.$('div.ca_CACMV0180_axis_attr[axis-type=' + axis_type + ']');
			var div_m = this.$('div.ca_CACMV0180_axis_attr[axis-type=' + axis_type + '_m]');
			var div_i = this.$('div.ca_CACMV0180_axis_attr[axis-type=' + axis_type + '_i]');

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
				$(div).addClass('dispn');
				$(div_m).removeClass('dispn');
				$(div_i).addClass('dispn');
				return {div : div_m, multiple : true};
				break;
			case amanp_AnaDefs.AMAN_DEFS_KIND_ITEM:
			case amanp_AnaDefs.AMAN_DEFS_KIND_COLORITEM:
			case amanp_AnaDefs.AMAN_DEFS_KIND_COLORSIZEITEM:
				$(div).addClass('dispn');
				$(div_m).addClass('dispn');
				if (Ana.Config.cond.CACMV0180.nodisp_v1_i === true) {
					$(div_i).addClass('dispn');
				} else {
					$(div_i).removeClass('dispn');
				}
				return {div : div_i, multiple : false, div_s: div, div_m: div_m};
				break;
			default:
				$(div_m).addClass('dispn');
				$(div).removeClass('dispn');
				$(div_i).addClass('dispn');
				return {div : div, multiple : false};
				break;
			}
		},

		/**
		 * 属性値コンボを取得
		 */
		getAttrSelect : function(kind, axis_type) {
			var select = this.$('select.ca_CACMV0180_axis_attr[axis-type=' + axis_type + ']');
			var select_m = this.$('select.ca_CACMV0180_axis_attr[axis-type=' + axis_type + '_m]');
			var div = this.$('div.ca_CACMV0180_axis_attr[axis-type=' + axis_type + ']');
			var div_m = this.$('div.ca_CACMV0180_axis_attr[axis-type=' + axis_type + '_m]');

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
		 * 属性値変更
		 */
		_onAxisAttrSelect: function(e) {
			var axis_type = $(e.target).attr('axis-type');
			// 複数選択の場合はなにもしない
			if (axis_type.slice(3,4) == 'm'){
				this.hideFromToArea(axis_type.slice(0,2));
				return;
			}
			var index = Number(this.$('select.ca_CACMV0180_axis_kind[axis-type=' + axis_type + ']').val()) - 1;
			var kind = this.axisList[index].cond_kind;
			var attr = this.$('select.ca_CACMV0180_axis_attr[axis-type=' + axis_type + ']').val();

			switch (Number(kind)) {
			case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_RFM:
			case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_DECIL:
			case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_ABC:
				var fromtolist = this.getFromToHash(kind, attr);
				this.showFromToArea(fromtolist, axis_type);
				break;
			default:
				this.hideFromToArea(axis_type);
				break;
			}
		},
		/**
		 * FromToデータの非表示
		 */
		hideFromToArea: function(axis_type) {
			this.$('#ca_CACMV0180_' + axis_type + '_fromto').empty();
			this.$('.ca_CACMV0180_' + axis_type + '_fromto_div').addClass('dispn');
		},

		/**
		 * FromToデータの表示
		 */
		showFromToArea: function(fromtolist, axis_type) {
			var index = Number(this.$('select.ca_CACMV0180_axis_kind[axis-type=' + axis_type + ']').val()) - 1;
			var kind = this.axisList[index].cond_kind;
			var attr = this.$('select.ca_CACMV0180_axis_attr[axis-type=' + axis_type + ']').val();

			// デフォルトのランクリストを保存
			var defaultfromtolist = clcom.getFromToList(kind, attr);

			// 編集データがない場合はデフォルトランクリストを表示する
			if (fromtolist == null || fromtolist.length == 0) {
				fromtolist = defaultfromtolist;
			}

			this.$('#ca_CACMV0180_' + axis_type + '_fromto').empty();
			this.$('.ca_CACMV0180_' + axis_type + '_fromto_div').removeClass('dispn');

			// ランク値の階数
			var max_rank = 10;
			var numbering = {};

			switch (Number(kind)) {
			case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_ABC:
				max_rank = 3;
				var ABC = {0 : 'A', 1 : 'B', 2 : 'C'};
				numbering = ABC;
				break;
			default:
				var NO = {};
				for (var i = 0; i < 10; i++) {
					NO[i] = i+1;
				}
				numbering = NO;
				break;
			}
			var isAscend = this.chkAscend(attr);
			var max_len = this.chkSumrt(attr) ? 2 : 13;

			// デフォルトランクリストが存在しない場合は初期化する
			if (fromtolist == null || fromtolist.length == 0) {
				fromtolist = [];
				fromtolist.push({val : 1, max_len : max_len});
				if (this.chkSumrt(attr) || this.chkAscend(attr)) {
					fromtolist[0].val = 0;
				}
			}

			// 最終行は空にする
			var last = isAscend ? fromtolist.length-1 : 0;
			if (this.chkSumrt(attr)) {
				fromtolist[last].val2 = 100;
			} else {
				fromtolist[last].val2 = '';
			}

			if (isAscend) {
				// 昇順
				for (var i = 0; i < max_rank; i++) {
					if (i >= fromtolist.length) {
						var newdata = {no : numbering[i], axis_type : axis_type, max_len : max_len};
						this.$('#ca_CACMV0180_fromto_tmp').tmpl(newdata).appendTo('#ca_CACMV0180_' + axis_type + '_fromto');
					} else {
						var fromto = fromtolist[i];
						fromto.no = numbering[i];
						fromto.axis_type = axis_type;
						fromto.max_len = max_len;
						this.$('#ca_CACMV0180_fromto_tmp').tmpl(fromto).appendTo('#ca_CACMV0180_' + axis_type + '_fromto');
					}
				}
			} else {
				// 降順
				var no = 0;
				for (var i = max_rank-1; i >= fromtolist.length; i--) {
					var newdata = {no : numbering[no++], axis_type : axis_type, max_len : max_len};
					this.$('#ca_CACMV0180_fromto_tmp').tmpl(newdata).appendTo('#ca_CACMV0180_' + axis_type + '_fromto');
				}
				for (var i = 0; i < fromtolist.length; i++) {
					var fromto = fromtolist[i];
					fromto.no = numbering[no++];
					fromto.axis_type = axis_type;
					fromto.max_len = max_len;
					this.$('#ca_CACMV0180_fromto_tmp').tmpl(fromto).appendTo('#ca_CACMV0180_' + axis_type + '_fromto');
				}
			}

			this.setFirstRow(axis_type, attr);

			// カンマ表示のため再設定
			clutil.inputlimiter(this.$el);
		},

		/**
		 * 最初の１行は開始値disabled
		 */
		setFirstRow: function(axis_type, attr) {
			if (this.chkAscend(attr)) {
				// 昇順
				var input = this.$('#ca_CACMV0180_' + axis_type + '_fromto input:first');
				$(input).attr('disabled', 'disabled');
			} else {
				// 降順
				var input = this.$('#ca_CACMV0180_' + axis_type + '_fromto input:last');
				input = $(input).prev().prev();
				$(input).attr('disabled', 'disabled');
			}
		},

		/**
		 * LastStoreデータの非表示
		 */
		hideLastStoreArea: function(axis_type) {
			this.$('#ca_CACMV0180_' + axis_type + '_laststore').empty();
			this.$('.ca_CACMV0180_' + axis_type + '_laststore_div').addClass('dispn');
		},

		/**
		 * LastStoreデータの表示
		 */
		showLastStoreArea: function(fromtolist, axis_type) {
			var index = Number(this.$('select.ca_CACMV0180_axis_kind[axis-type=' + axis_type + ']').val()) - 1;

			this.$('#ca_CACMV0180_' + axis_type + '_laststore').empty();
			this.$('.ca_CACMV0180_' + axis_type + '_laststore_div').removeClass('dispn');

			this.$('#ca_CACMV0180_laststore_tmp').tmpl({
				axis_type : axis_type
			}).appendTo('#ca_CACMV0180_' + axis_type + '_laststore');
			clutil.datepicker(this.$('#ca_CACMV0180_' + axis_type + '_laststore').find('input'));

			// 編集データがある場合は編集データを表示する
			if (fromtolist != null && fromtolist.length == 1) {
				this.$('#ca_CACMV0180_' + axis_type + '_laststore').find('input[name=val]').val(
						clutil.dateFormat(fromtolist[0].val, 'yyyy/mm/dd')
				);
				this.$('#ca_CACMV0180_' + axis_type + '_laststore').find('input[name=val2]').val(
						clutil.dateFormat(fromtolist[0].val2, 'yyyy/mm/dd')
				);
			}

		},

		/**
		 * 表示属性選択ボタン押下
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
			var $select = this.$("select.ca_CACMV0180_axis_kind[axis-type='" + axis_type + "']");

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

			// TODO サブ画面を表示
			this.CACMV0180_CACMV0370Selector.show(this.mstitem_list[axis_type], true, kind, func_id, name);	// TODO 選択済みリスト

			// TODO 戻ってきたときのコールバック設定
			this.CACMV0180_CACMV0370Selector.okProc = function(data) {
				console.log("okProc:", data);
				var txt = "";
				if (data != null) {
					_.each(data, function(item, i) {
						if (i != 0) {
							txt += ",";
						}
						txt += item.name;
					});
					var $input = _this.$("input.input_CACNV0180_mastitem[axis-type='" + axis_type + "']");
					$input.val(txt);

					_this.mstitem_list[axis_type] = data;
				}
//				if(data != null && data.length > 0) {
//					_this.$('#ca_CACMV0030_orgname').val(data[0].code + ":" + data[0].name);
//					_this.$('#ca_CACMV0030_org_id').val(data[0].val);
//					_this.$('#ca_CACMV0030_func_id').val(data[0].func_id);
//				}
//				// ボタンにフォーカスする
//				$(e.target).focus();
			};
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// validatorの初期化
			this.validator.clear();
		},

		/**
		 * クリアボタン押下
		 */
		_onClearClick: function(e) {
			var axis_type = $(e.target).attr('axis-type');
			var attr = this.$('select.ca_CACMV0180_axis_attr[axis-type=' + axis_type + ']').val();

			this.clearResult();
			this.$('#ca_CACMV0180_' + axis_type + '_fromto').empty();

			var max_len = this.chkSumrt(attr) ? 2 : 13;
			var list = [];
			list.push({val : 1, max_len : max_len});
			if (this.chkSumrt(attr) || this.chkAscend(attr)) {
				list[0].val = 0;
			}
			this.showFromToArea(list, axis_type);
		},

		/**
		 * 初期値に戻す押下
		 */
		_onDefaultClick:function(e) {
			var axis_type = $(e.target).attr('axis-type');
			this.clearResult();
			this.$('#ca_CACMV0180_' + axis_type + '_fromto').empty();
			this.showFromToArea(null, axis_type);
		},

		/**
		 * 開始値フォーカスアウト
		 */
		_onFromAmFocusout: function(e) {
			var axis_type = $(e.target).closest('div.ca_CACMV0180_fromto').attr('axis-type');
			var attr = this.$('select.ca_CACMV0180_axis_attr[axis-type=' + axis_type + ']').val();
			var fromtolist = this.getFromToList(axis_type);

			// 領域のエラークリア
			var rank_validator = clutil.validator(this.$('#ca_CACMV0180_' + axis_type + '_fromto'), {
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
			var inputlist = this.$('#ca_CACMV0180_' + axis_type + '_fromto input[name=val]');
			var attr = this.$('select.ca_CACMV0180_axis_attr[axis-type=' + axis_type + ']').val();

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
								this.validator.setErrorMsg($(inputlist[i]), clmsg.ca_CACMV0180_0004);
								isAscending = false;
							}

							for (var j = i+1; j <= last; j++) {
								var rank2 = fromtolist[j];
								// 次に入力されている値との昇順チェック
								if (clutil.cStr(rank2.val) != "") {
									if (Number(rank1.val) >= Number(rank2.val)) {
										// エラーの設定
										this.validator.setErrorMsg($(inputlist[i]), clmsg.ca_CACMV0180_0001);
										this.validator.setErrorMsg($(inputlist[j]), clmsg.ca_CACMV0180_0001);
										isAscending = false;
									}
									break;
								}
							}
						}
					}

					// 割合タイプは100以上は入力不可（最終行のチェック）
					if (this.chkSumrt(attr) && Number(fromtolist[last].val) >= 100) {
						this.validator.setErrorMsg($(inputlist[last]), clmsg.ca_CACMV0180_0004);
						isAscending = false;
					}

					if (!isAscending) {
						this.validator.setErrorHeader(clmsg.cl_echoback);
						// フォーカスの設定
						var err = $('#ca_CACMV0180_' + axis_type + '_fromto input.cl_error_field:first[name=val]');
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
								this.validator.setErrorMsg($(inputlist[i]), clmsg.ca_CACMV0180_0004);
								isDescending = false;
							}

							for (var j = i-1; j >= last; j--) {
								var rank2 = fromtolist[j];
								// 次に入力されている値との降順チェック
								if (clutil.cStr(rank2.val) != "") {
									if (Number(rank1.val) >= Number(rank2.val)) {
										// エラーの設定
										this.validator.setErrorMsg($(inputlist[i]), clmsg.ca_CACMV0180_0006);
										this.validator.setErrorMsg($(inputlist[j]), clmsg.ca_CACMV0180_0006);
										isDescending = false;
									}
									break;
								}
							}
						}
					}

					// 割合タイプは100以上は入力不可（最終行のチェック）
					if (this.chkSumrt(attr) && Number(fromtolist[last].val) >= 100) {
						this.validator.setErrorMsg($(inputlist[last]), clmsg.ca_CACMV0180_0004);
						isDescending = false;
					}

					if (!isDescending) {
						this.validator.setErrorHeader(clmsg.cl_echoback);
						// フォーカスの設定
						var err = $('#ca_CACMV0180_' + axis_type + '_fromto input.cl_error_field:first[name=val]');
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
			var attr = this.$('select.ca_CACMV0180_axis_attr[axis-type=' + axis_type + ']').val();

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
			var inputlist = $('#ca_CACMV0180_' + axis_type + '_fromto input[name=val2]');
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
			var inputfrom = this.$('#ca_CACMV0180_' + axis_type + '_laststore input[name=val]');
			var inputto = this.$('#ca_CACMV0180_' + axis_type + '_laststore input[name=val2]');
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
			var divlist = this.$('div.ca_CACMV0180_' + axis_type + '_fromto_elem');
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
			var divlist = this.$('div.ca_CACMV0180_' + axis_type + '_laststore_elem');
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
		 * 昇順/降順のチェック
		 * 最新来店日(実績値)のみ昇順となる
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
			for (var i = 1; i <= this.anadata.axis_num.v_axis_num; i++) {
				var axis = {};
				axis.axis_type = 'v' + i;
				var index = Number(this.$('select.ca_CACMV0180_axis_kind[axis-type=' + axis.axis_type + ']').val()) - 1;
				if (index >= 0) {
					axis.kind = this.axisList[index].cond_kind;
				} else {
					axis.kind = 0;
				}
				axis.$kind_select = $(this.$('select.ca_CACMV0180_axis_kind[axis-type=' + axis.axis_type + ']'));
				axis.$attr_select = this.getAttrSelect(axis.kind, axis.axis_type);
				axis.attr = $(axis.$attr_select).val();

				AxisList.push(axis);
			}
			for (var i = 1; i <= this.anadata.axis_num.h_axis_num; i++) {
				var axis = {};
				axis.axis_type = 'h' + i;
				var index = Number(this.$('select.ca_CACMV0180_axis_kind[axis-type=' + axis.axis_type + ']').val()) - 1;
				if (index >= 0) {
					axis.kind = this.axisList[index].cond_kind;
				} else {
					axis.kind = 0;
				}
				axis.$kind_select = $(this.$('select.ca_CACMV0180_axis_kind[axis-type=' + axis.axis_type + ']'));
				axis.$attr_select = this.getAttrSelect(axis.kind, axis.axis_type);
				axis.attr = $(axis.$attr_select).val();

				AxisList.push(axis);
			}

			var retStat = false;
			if (!this.options.isMDBascket && AxisList.length > 1) {
				// 軸重複チェック
				for (var i = 0; i < AxisList.length-1; i++) {
					var pAxis = AxisList[i];
					for (var j = i + 1; j < AxisList.length; j++) {
						var nAxis = AxisList[j];

						switch (Number(pAxis.kind)) {
						case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_RFM:
						case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_DECIL:
						case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_ABC:
						// 会員属性
						case amanp_AnaDefs.AMAN_DEFS_KIND_MEMBATTR:
						// 社員属性
						case amanp_AnaDefs.AMAN_DEFS_KIND_STAFFATTR:
						// DM企画属性
						case amanp_AnaDefs.AMAN_DEFS_KIND_DMRFM:
							// 同一軸種別の場合は種別をチェック
							if (pAxis.axis_type[0] == nAxis.axis_type[0]) {
								// 同一種別の場合はエラー
								if ((Number(pAxis.kind) != 0) && (pAxis.kind == nAxis.kind)) {
									this.validator.setErrorMsg(pAxis.$kind_select, clmsg.ca_CACMV0180_0002);
									this.validator.setErrorMsg(nAxis.$kind_select, clmsg.ca_CACMV0180_0002);
									retStat = true;
								}
							} else {
								// 同一属性の場合はエラー
								if ((pAxis.kind == nAxis.kind) &&
										(Number(pAxis.attr) != 0) && (pAxis.attr == nAxis.attr)) {
									this.validator.setErrorMsg(pAxis.$attr_select, clmsg.ca_CACMV0180_0003);
									this.validator.setErrorMsg(nAxis.$attr_select, clmsg.ca_CACMV0180_0003);
									retStat = true;
								}
							}
							break;
						default:
							// 同一種別の場合はエラー
							if ((Number(pAxis.kind) != 0) && (pAxis.kind == nAxis.kind)) {
								this.validator.setErrorMsg(pAxis.$kind_select, clmsg.ca_CACMV0180_0002);
								this.validator.setErrorMsg(nAxis.$kind_select, clmsg.ca_CACMV0180_0002);
								retStat = true;
							}
							break;
						}
					}
				}

				// 縦軸内で商品分類体系と商品を同時に指定するのは駄目 #20150916
				if( retStat != true ){
					var vcc = 0;
					for (var i = 1; i <= this.anadata.axis_num.v_axis_num; i++) {
						var vaxis_type = 'v' + i;
						var vkind;
						var vindex = Number(this.$('select.ca_CACMV0180_axis_kind[axis-type=' + vaxis_type + ']').val()) - 1;
						if (vindex >= 0) {
							vkind = this.axisList[vindex].cond_kind;
						} else {
							vkind = 0;
						}
						//
						if (vkind == amanp_AnaDefs.AMAN_DEFS_KIND_ITGRP ||
						    vkind == amanp_AnaDefs.AMAN_DEFS_KIND_ITEM) {
							vcc++;
							if( vcc > 1 ){
								this.validator.setErrorMsg(this.$('select.ca_CACMV0180_axis_kind[axis-type=' + vaxis_type + ']'), clmsg.ca_CACMV0180_0007);
								retStat = true;
							}
						}
					}
				}
			}

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
							this.validator.setErrorMsg(pAxis.$attr_select, clmsg.ca_CACMV0180_0005);
							retStat = true;
						}
					}
					break;
				default:
					break;
				}
			}

			// fromtoチェック
			for (var i = 0; i < AxisList.length; i++) {
				var axis = AxisList[i];

				switch (Number(axis.kind)) {
				case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_RFM:
				case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_DECIL:
				case amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_ABC:
					var fromtolist = this.getFromToList(axis.axis_type);
					if (!this.checkNumber(fromtolist, axis.axis_type)) {
						retStat = true;
					}
					break;
				// 期間最終来店店舗
				case amanp_AnaDefs.AMAN_DEFS_KIND_LASTSTORE:
					var laststorelist = this.getLastStoreList(axis.axis_type);
					if (!this.checkLastStore(laststorelist, axis.axis_type)) {
						retStat = true;
					}
					break;
				}
			}
			if (retStat) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				// フォーカスの設定
//				var err = $('#ca_CACMV0180_' + axis_type + '_fromto input.cl_error_field:first[name=val]');
//				$(err).focus();
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
			var axisFolder = clutil.view2data(this.$('.ca_CACMV0180_searchArea'), 'ca_CACMV0180_');
			var vAxisList = [];
			var hAxisList = [];
			for (var i = 1; i <= this.anadata.axis_num.v_axis_num; i++) {
				var axis = {};
				var index = Number(this.$('select.ca_CACMV0180_axis_kind[axis-type=v' + i + ']').val()) - 1;

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
				var index = Number(this.$('select.ca_CACMV0180_axis_kind[axis-type=h' + i + ']').val()) - 1;

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

			// MD商品分析版のABC軸基準設定
			if(Ana.Config.cond.CACMV0180.isMDABCAxis){
				axisFolder.mdabc_type = this.$(':radio[name="ca_CACMV0180_mdabc_type"]:checked').val();
			}

			return axisFolder;
		},

		/**
		 * 属性値を取得
		 */
		getAttr : function(axis, axis_type) {
			var select = this.$('select.ca_CACMV0180_axis_attr[axis-type=' + axis_type + ']');
			var select_m = this.$('select.ca_CACMV0180_axis_attr[axis-type=' + axis_type + '_m]');

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
				var attrlist = $(select_m).val();
				var dispattr = 0;
				if (attrlist != null && attrlist.length > 0) {
					for (var i = 0; i < attrlist.length; i++) {
						var attr = attrlist[i];
						dispattr = dispattr | 1 << (attr-1);
						var name = $(select_m).find('option[value=' + attr + ']').html();
						axis.name = axis.name + name;
						if (i != attrlist.length-1) {
							axis.name = axis.name + '⇒';
						}
					}
					axis.attr = attrlist[attrlist.length-1];
					axis.dispattr = dispattr;
				}
				break;
			default:
				axis.attr = $(select).val();
				if (Number(axis.attr) == 0) {
					// 属性値0の場合は空文字を入れる
					axis.name = '';
				} else {
					axis.name = $(select).find('option[value=' + $(select).val() + ']').html();
				}
				break;
			}
			return axis;
		},

		/**
		 * マスタ表示項目を取得
		 */
		getMastItemData: function() {
			return this.mstitem_list;
		},

		/**
		 * 選択した軸に「集約商品」があるか？
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
			this.okProc({axisFolder: this._tmpAxisFolder, mstitemFolder: this._tmpMastItemFolder});
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
			// 軸の整合性チェック
			if (!this.chkData()) {
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

			// 表示項目の取得
			var mastItemFolder = this.getMastItemData();
			this._tmpMastItemFolder = mastItemFolder;

			if (this.isPackItem(axisFolder)) {
				// 軸に「集約商品」がある場合はダイアログを表示する
				console.log('集約商品あり');
				clutil.MessageDialog("【絞込み条件を設定する際の注意点】<br />例えば、特定ブランドの絞込み設定をすると、<br />集約品番の特定ブランド分だけが表示されます。", this._onCommitClick2);
			} else {
				this._onCommitClick2();
			}

		},

		// 選択時処理  呼び出し側で override する
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
