$(function() {

	//////////////////////////////////////////////
	// View
	CACMV0070SelectorView = Backbone.View.extend({

		screenId : "CACMV0070",
		validator: null,

		// 押下イベント
		events: {
			"change #ca_CACMV0070_kind"		:	"_onKindSelect",		// 種別変更
//			"keyup #ca_CACMV0070_kind"		:	"_onKindSelect",		// 種別変更
//			"keydown #ca_CACMV0070_kind"		:	"_onKindSelect",		// 種別変更

			"keyup .ca_CACMV0070_srch_input"	:	"_onSrchInputKeyPress",	// テーブル上でリスト名編集確定

			"click .ca_CACMV0070_node"			:	"_onNodeClick",			// ツリーノード押下

//			"click #ca_CACMV0070_search"		:	"_onSearchClick",		// 検索ボタン押下
//			"click #ca_CACMV0070_showSearchArea":	"_onShowSearchAreaClick",	// 検索条件を再指定ボタン押下
			"click #ca_CACMV0070_add"			:	"_onAddClick",			// 追加ボタン押下

			"click .ca_CACMV0070_edit_del"		:	"_onEditDelClick",		// 単一削除ボタン押下
			"click #ca_CACMV0070_edit_delall"	:	"_onEditDelAllClick",	// すべて削除ボタン押下

			"click #ca_CACMV0070_clear"			:	"_onClearClick",		// クリアボタン押下
			"click #ca_CACMV0070_commit"		:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_CACMV0070_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_CACMV0070_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_CACMV0070_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
		},

		funclist: [],
		lvllist: [],
		levelList: {},

		/**
		 * 引数
		 * ・$parentView		: 親画面のjQueryオブジェクト (例：$('#ca_main'))
		 * ・select_mode		: チェックボックス/ラジオボタン選択
		 * 						  nullの場合はラジオ
		 * ・isAnalyse_mode		: false 分析モードでない場合
		 * 						: true  分析モードの場合、デフォルト
		 * ・ymd				: 検索日
		 *						  指定がない場合は運用日
		 */
		initialize: function(opt) {
			var defaults = {
				search_date: clcom.ope_date,			// 運用日
				select_mode: clutil.cl_single_select,	// 単一選択モード
				isAnalyse_mode: true					// 分析画面で利用
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), this.isAnalyse_mode);

			clutil.inputlimiter(this.$el);

			// 単一選択モード
			if (this.select_mode == clutil.cl_single_select) {
				this.$('.ca_CACMV0070_multi').remove();
			}
			// 分析画面以外からのモード
			if (this.isAnalyse_mode == false) {
				this.$('.ca_CACMV0070_multi').remove();
				this.$('#mainColumninBox').addClass('noLeftColumn');
				this.$('#mainColumnFooter').addClass('noLeftColumn');
			} else {
				this.$('#mainColumnFooter').addClass('analytics');
			}

			if (this.isAnalyse_mode && this.select_mode != clutil.cl_single_select){
				// 条件表示エリアの設定
				this.addtoSelected = clutil.addtoSelected(
						this.$('#ca_CACMV0070_add'),
						this.$('#selected'),
						this.$('#mainColumn'));
			}

			//選択した内容のスクロール
			this.$('#innerScroll').perfectScrollbar();

			if (this.isBasket_mode) {
				// バスケット分析（拡張）の場合は別のリストを使用する
				this.kindlist = this.getItemAttrListForBasket();
			} else {
				// 属性リストを取得
				this.kindlist =  clcom.getItemAttrList();
			}


			// コンボボックスの中身を作成
			clutil.cltypeselector2(this.$('#ca_CACMV0070_kind'), this.kindlist, 0,
					1, 'kind');
			if (this.kindlist != null && this.kindlist.length > 0) {
				this.$('#ca_CACMV0070_kind').selectpicker('val', this.kindlist[0]);
			}

			// shiftキー押下時用
			this.$shift_table = null;
			this.shift_no = 0;
		},

		getItemAttrListForBasket: function() {
			var cond_list = this.anaProc.anadata.cond_item_list;
			var kindlist = clcom.getItemAttrList();
			var map = {};

			_.each(cond_list, function(cond) {
				if (cond.f_basket == 1 && cond.f_axis == 0 && cond.cond_attr == 0) {
					map[cond.cond_kind] = cond;
				}
			});

			var list = _.filter(kindlist, function(item) {
				if (map[item.kind]) {
					return item;
				}
			});
			return list;
		},

		/**
		 * 選択画面の初期化処理
		 */
		render: function() {
//			var url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
			var url = clcom.getAnaSubPaneURI(this.screenId);

			var _this = this;

			// HTMLソースを読み込む
			clutil.loadHtml(url, _.bind(function(data) {
				_this.html_source = data;
			},this));

			return this;
		},

		/**
		 * editList		: 編集領域に保存されているリスト
		 * isSubDialog	: ダイアログからダイアログを表示したときにのみtrueを設定
		 */
		show: function(editList, isSubDialog) {
			var _this = this;

			// 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
			if (isSubDialog == null) {
				$('.cl_dialog').empty();
			}

			this.$parentView.hide();

			// htmlソースからダイアログを作成する
			this.$el.html('');
			this.$el.html(this.html_source);

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_CACMV0070_main'), {
				echoback		: $('.cl_echoback')
			});

			// 画面の初期化
			this.initUIelement();

			// フォーカスの設定
			this.setFocus();

			// 複数選択モードで編集データがある場合
			if (this.select_mode == clutil.cl_multiple_select &&
					editList != null && editList.length > 0) {
				var html_source = '';
				for (var i = 0; i < editList.length; i++) {
					html_source += this.makeEditTmp(editList[i]);
				}
				this.$('#ca_CACMV0070_edit_tbl').html(html_source);
			} else {
				if (this.addtoSelected != null) {
					this.addtoSelected.right_side_hide();
				}
			}

			// 結果状態をクリアする
			this.clearResult();

			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode({
				view : this.$el
			});
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus(this.$('#ca_CACMV0070_kind'));
		},

		/**
		 * ツリーノード選択
		 */
		_onNodeClick: function(e) {
			this.validator.clear();
			var ctrlkey = e.ctrlKey;
			var shiftkey = e.shiftKey;

			var tr = $(e.target).closest("tr");
			var table = $(e.target).closest("table");

			// 単一モードで既に選択されている場合はなにもしない
			if ((this.select_mode == clutil.cl_single_select || (!ctrlkey && !shiftkey)) &&
					$(tr).hasClass('selected')) {
				if ($(table).find($('tr.selected')).length == 1 && $(table).hasClass('final')) {
					return;
				}
			}

			// 選択された内部レベルを取得
			var level = Number($(table).attr("box-level"));
			for (var i = this.level; i > level; i--) {
				// 内部レベルより大きいボックスは消去する
				this.$('#ca_CACMV0070_box_' + i).closest('div.drilldownItem').remove();
				this.resultList.splice(i, 1);
			}
			this.level = level;

			// shiftキー押下時用のフラグ
			var shiftkeyFlag = false;
			if (shiftkey) {
				if (this.$shift_table != null) {
					var table_lvl = Number(this.$shift_table.attr("box-level"));
					if (table_lvl == level) {
						shiftkeyFlag = true;
					}
				}
			}


			// 選択モードによって挙動を変える
			if (this.select_mode == clutil.cl_single_select || (!ctrlkey && !shiftkey)) {
				// 単一モードまたは複数モードでコントロールキー押下していない時
				// 選択されているノードをクリアする
				$.each($(table).find($('tr.selected')), function() {
					$(this).removeClass('selected');
				});
				$(tr).addClass('selected');
			} else if (shiftkeyFlag) {
				var no = Number($(tr).attr('no'));
				var start_no = this.shift_no < no ? this.shift_no : no;
				var end_no = this.shift_no < no ? no : this.shift_no;
				for (var i = start_no; i <= end_no; i++) {
					$(table).find($('tr[no=' + i + ']')).addClass('selected');
				}
			} else {
				if ($(tr).hasClass('selected')) {
					$(tr).removeClass('selected');
				} else {
					$(tr).addClass('selected');
				}
			}

			// shiftキー押下用にテーブル、noを保存しておく
			this.$shift_table = $(table);
			this.shift_no = Number($(tr).attr('no'));

			// tableのfinalクラスを削除
			$.each(this.$('table'), function() {
				$(this).removeClass('final');
			});

			// 選択されているtableにfinalクラスを追加
			if ($(table).find($('tr.selected')).length > 0) {
				$(table).addClass('final');
			} else if ($(table).find($('tr.selected')).length == 0) {
				var select_level = this.level - 1;
				this.$('#ca_CACMV0070_box_' + select_level).addClass('final');
			}

			var is_leaf = Number($(tr).attr('is-leaf'));

			// 選択されているノードの配下を検索
			// 複数選択またはなにも選択されていない場合場合は検索しない
			// 最終階層の場合は検索しない
			if (!is_leaf && $(table).find($('tr.selected')).length == 1) {
				var select_tr = $(table).find($('tr.selected'))[0];
				this.level = level+1;
				var parent_id = select_tr.id;
				var lvl_no = Number($(select_tr).attr('lvl-no'));
				// 結果表示
				this.onSearchClick(parent_id, lvl_no+1);
			}
		},

		/**
		 * 種別変更
		 */
		_onKindSelect: function(e) {
			// 結果状態をクリアする
			this.clearResult();
			// 結果表示
			// 親組織=0で第1階層を取得
			this.onSearchClick(0, 1);
		},

		/**
		 * 検索条件入力
		 */
		_onSrchInputKeyPress: function(e, ev) {
			var _this = this;

			var input = $(e.target).closest('input');
			var table_id = $(input).attr('tgt-id');
			var srch_word = $(input).val();
			srch_word = srch_word.replace(/\s+/g, "");
			var trlist = $('#' + table_id + ' tr');

			// 一旦すべてを表示
			for (var i = 0; i < trlist.length; i++) {
				var tr = trlist[i];
				$(tr).show();
			}

			// なにも入力されていない場合はなにもしない
			if (clutil.chkStr(srch_word)) {
				for (var i = 0; i < trlist.length; i++) {
					var tr = trlist[i];
					var word = $(tr).find('td').html();
					if (word.indexOf(srch_word) == -1) {
						$(tr).hide();
					}
				}
			}

		},

		// 結果表示
		onSearchClick: function(parent_id, lvl_no) {
			var _this = this;

			// 画面の情報を取得する
			var searchData = clutil.view2data(this.$('#ca_CACMV0070_searchArea'), 'ca_CACMV0070_');

			if (searchData.kind == amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS1
					|| searchData.kind == amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS2) {
				// サブクラス1,2の場合は品種を取得する
				var ctg_list = _.filter(this.anaProc.cond.focuslist, function(o) {
					return o.kind == amanp_AnaDefs.AMAN_DEFS_KIND_ITGRP;
				});
				if (ctg_list != null && ctg_list.length > 0) {
					searchData['itgrp_ids'] = [];
					_.each(ctg_list, function(o) {
						searchData['itgrp_ids'].push(Number(o.val));
					});
				}
			}

			// 親組織IDと階層番号を設定
			searchData['parent_id'] = parent_id;
			searchData['lvl_no'] = lvl_no;
			// 終端階層番号
			searchData['leaf_no'] = 0;
			// マスタ検索日
			searchData['srch_iymd'] = clutil.getMstSrchDate(this.isAnalyse_mode, this.anaProc, 'itgrp');

			var req = {
					cond : searchData
			};

			// データを取得
			var uri = 'gsan_se_itemattr_srch';
			if(Ana.Config.cond.CACMV0070 && !_.isEmpty(Ana.Config.cond.CACMV0070.itemattr_srch_resId)){
				uri = Ana.Config.cond.CACMV0070.itemattr_srch_resId;
			}
			clutil.postAnaJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					// 確定時用にデータは保存しておく
					var resultList = data.itemattrlist;
					if(uri != 'gsan_se_itemattr_srch' && data.body && _.isArray(data.body.list)){
						resultList = data.body.list;
					}

					_this.resultList.push(resultList);

					if (resultList == null || resultList.length == 0) {
						// 配下組織が存在しない場合は内部レベルを戻す
						_this.level--;
					} else {
						var no = 0;	//表示番号セット
						// 取得したデータを表示する
						$.each(resultList, function() {
							this.no = no++;
						});
						// 階層を表示
						var lvl_obj = {
								level : _this.level};
						// 取得したデータを表示する
						_this.$('#ca_CACMV0070_box_tmp').tmpl(lvl_obj).appendTo('#ca_CACMV0070_itemattrtree');
						_this.$('#ca_CACMV0070_node_tmp').tmpl(resultList).appendTo('#ca_CACMV0070_box_' + _this.level);
					}
					// スクロール
			        $('#ca_CACMV0070_itemattrtree').scrollTo('#ca_CACMV0070_box_' + _this.level);
					clutil.initUIelement(_this.$el);
//					$('#ca_CACMV0070_box_' + _this.level).closest('.yScroll').slimScroll({
//						color: '#ccc',
//					});
				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}

				// 条件を追加ボタンにフォーカスする
				_this.$('#ca_CACMV0070_add').focus();
			}, this));
		},


		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// 結果表示エリアをクリア
			this.$('#ca_CACMV0070_itemattrtree').empty();
			// validatorの初期化
			this.validator.clear();
			// 内部用レベルを初期化
			this.level = 0;
			// 確定時用のデータを初期化
			this.resultList = [];
		},

		/**
		 * クリアボタン押下
		 */
		_onClearClick: function() {
			clutil.viewClear(this.$('#ca_CACMV0070_searchArea'));
			// validatorの初期化
			this.validator.clear();
		},

		/**
		 * 追加ボタン押下
		 */
		_onAddClick:function(e) {
			// 編集領域を閉じる際はなにもしない
			if (this.addtoSelected.right_side()) {
				return;
			}
			var chkId = [];
			var _this = this;
			$.each(this.$("#ca_CACMV0070_itemattrtree table.final tr.selected"), function() {
				chkId.push(this.id);
			});

			if (chkId.length > 0) {
				var selectlist = this.getData(chkId);
				// 編集領域のIDリストを取得する
				var idlist = [];
				var html_source = '';
				var kind = this.$('#ca_CACMV0070_kind').val();

				$.each(this.$('#ca_CACMV0070_edit_tbl li'), function() {
					var edit_kind = $(this).find('input[name=kind]').val()
					if (kind == edit_kind) {
						idlist.push(Number(this.id));
					}
				});

				// 現在の要素数を取得
				var num = idlist.length;
				var editlist = [];

				for (var i = 0; i < selectlist.length; i++) {
					var select = selectlist[i];

					// 追加可能な要素数を超えている場合はこれ以上追加しない
					if (num == clcom.list_max) {
						this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.number_overflow, [clcom.list_max])});
						break;
					}
					// 重複チェック
					if(idlist.indexOf(select.cn_id) != -1){
						// 重複する場合は追加しない
						continue;
					}
					// 重複していない場合は追加
					var newdata = {};
					newdata.val = select.cn_id;
					newdata.code = select.code;
					newdata.name = select.name;
					newdata.attr = select.lvl_no;
					newdata.name2 = this.$('#ca_CACMV0070_kind').find('option[value=' +
							this.$('#ca_CACMV0070_kind').val() + ']').html();

					// 種別を挿入する
					newdata.kind = kind;

					html_source += this.makeEditTmp(newdata);
					num++;
					editlist.push(newdata);
				}
				this.$('#ca_CACMV0070_edit_tbl').append(html_source);
			} else {
				// なにもしない
			}
			// アニメーション表示のための初期化
			clutil.initUIelement(this.$el);
		},

		// Idより選択されたデータを取得
		getData : function(chkId){
			var selectData = [];
			for (var r = 0; r < this.resultList.length; r++) {
				var resultList = this.resultList[r];
				for (var i = 0; i < resultList.length; i++) {
					var data = resultList[i];
					for (var j = 0; j < chkId.length; j++) {
						var selectId = chkId[j];
						if (data.cn_id == selectId) {
							selectData.push(data);
							break;
						}
					}
				}
			}
			return selectData;
		},

		/**
		 * 編集領域テンプレート
		 */
		makeEditTmp: function(data) {
			var html_source = '';
			html_source += '<li id="' + data.val + '"><span>' + data.code + ':' + data.name + '</span><span class="code">';
			html_source += data.name2 + '</span><span class="btn-delete ca_CACMV0070_edit_del"></span>'
			html_source += '<input type="hidden" name="kind" value="' + data.kind + '">';
			html_source += '<input type="hidden" name="val" value="' + data.val + '">';
			html_source += '<input type="hidden" name="code" value="' + data.code + '">';
			html_source += '<input type="hidden" name="name" value="' + data.name + '">';
			html_source += '<input type="hidden" name="name2" value="' + data.name2 + '">';
			html_source += '<input type="hidden" name="attr" value="' + data.attr + '">';
			html_source += '</li>';

			return html_source;
		},

		/**
		 * 編集領域単一削除ボタン
		 */
		_onEditDelClick: function(e) {
			// クリックされた行を削除する
			$(e.target).closest("li").fadeOut(300).queue( function(){ this.remove() });
			this.$('#ca_CACMV0070_add').focus();
		},

		/**
		 * 編集領域すべて削除ボタン押下
		 */
		_onEditDelAllClick: function() {
			// 削除対象IDリストを取得する
			var idlist = [];
			var html_source = '';
			this.$('#ca_CACMV0070_edit_tbl').html("");
			this.$('#innerScroll').perfectScrollbar('update');
		},

		/**
		 * テーブルに表示されている編集リストを取得する
		 */
		getEditList : function() {
			var editlist = [];
			editlist = clutil.tableview2data(this.$('#ca_CACMV0070_edit_tbl').children());
			return editlist;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			this.validator.clear();
			var editlist = [];

			// 単一選択モード、分析画面ではない画面から呼び出された場合
			if (this.select_mode == clutil.cl_single_select ||
					this.isAnalyse_mode == false) {
				var _this = this;
				var chkId = [];
				$.each(this.$("#ca_CACMV0070_itemattrtree table.final tr.selected"), function() {
					var tr = $(this).closest('tr');
					chkId.push(tr.get(0).id);
				});

				if (chkId.length > 0) {
					var selectlist = this.getData(chkId);

					for (var i = 0; i < selectlist.length; i++) {
						var select = selectlist[i];

						var newdata = {};
						newdata.val = select.cn_id;
						newdata.code = select.code;
						newdata.name = select.name;
						newdata.attr = select.lvl_no;
						newdata.name2 = this.$('#ca_CACMV0070_kind').find('option[value=' +
								this.$('#ca_CACMV0070_kind').val() + ']').html();

						// 種別を挿入する
						newdata.kind = this.$('#ca_CACMV0070_kind').val();

						editlist.push(newdata);
					}
					this.$parentView.show();
					this.okProc(editlist);
					this.$el.html('');
					clutil.leaveEnterFocusMode();
					clutil.enterFocusMode();
				} else {
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clmsg.ca_CACMV0070_0001});
				}
			} else {
				// 編集リストを取得
				this.$parentView.show();
				this.okProc(this.getEditList());
				this.$el.html('');
				clutil.leaveEnterFocusMode();
				clutil.enterFocusMode();
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
