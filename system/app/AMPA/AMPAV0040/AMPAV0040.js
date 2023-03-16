$(function() {

	//////////////////////////////////////////////
	// View
	AMPAV0040SelectorView = Backbone.View.extend({

		screenId : "AMPAV0040",
		categoryId : "AMPA",
		validator: null,

		// 押下イベント
		events: {
			"change #ca_AMPAV0040_func_id"		:	"_onFuncSelect",		// 種別変更
//			"keyup #ca_AMPAV0040_func_id"		:	"_onFuncSelect",		// 種別変更
//			"keydown #ca_AMPAV0040_func_id"		:	"_onFuncSelect",		// 種別変更

			"keyup .ca_AMPAV0040_srch_input"	:	"_onSrchInputKeyPress",	// テーブル上でリスト名編集確定

			"click .ca_AMPAV0040_node"			:	"_onNodeClick",			// ツリーノード押下

//			"click #ca_AMPAV0040_search"		:	"_onSearchClick",		// 検索ボタン押下
//			"click #ca_AMPAV0040_showSearchArea":	"_onShowSearchAreaClick",	// 検索条件を再指定ボタン押下
			"click #ca_AMPAV0040_add"			:	"_onAddClick",			// 追加ボタン押下

			"click .ca_AMPAV0040_edit_del"		:	"_onEditDelClick",		// 単一削除ボタン押下
			"click #ca_AMPAV0040_edit_delall"	:	"_onEditDelAllClick",	// すべて削除ボタン押下

			"click #ca_AMPAV0040_clear"			:	"_onClearClick",		// クリアボタン押下
			"click #ca_AMPAV0040_commit"		:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_AMPAV0040_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_AMPAV0040_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_AMPAV0040_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
		},

		funclist: [],
		lvllist: [],
		levelList: [],

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
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt, defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

			// 単一選択モード
			if (this.select_mode == clutil.cl_single_select) {
				this.$('.ca_AMPAV0040_multi').remove();
			}
			// 分析画面以外からのモード
			if (this.isAnalyse_mode == false) {
				this.$('.ca_AMPAV0040_multi').remove();
				this.$('#mainColumninBox').addClass('noLeftColumn');
				this.$('#mainColumnFooter').addClass('noLeftColumn');
			} else {
				this.$('#mainColumnFooter').addClass('analytics');
			}

			if (this.isAnalyse_mode && this.select_mode != clutil.cl_single_select){
				// 条件表示エリアの設定
				this.addtoSelected = clutil.addtoSelected(
						this.$('#ca_AMPAV0040_add'),
						this.$('#selected'),
						this.$('#mainColumn'));
			}

			//選択した内容のスクロール
			this.$('#innerScroll').perfectScrollbar();

			// 種別が設定されている場合は種別変更不可
			if (this.func_id != -1) {
				this.$('#ca_AMPAV0040_func_id').attr('disabled', 'disabled');
			}
			clutil.cltypeselector2(this.$('#ca_AMPAV0040_func_id'), this.funclist, 0,
					null,
					'func_id', 'func_name', 'func_code');
			if (this.func_id != -1) {
				this.$('#ca_AMPAV0040_func_id').selectpicker('val', this.func_id);
			}

			// 検索条件を再指定ボタンを隠す
			this.srchArea = clutil.controlSrchArea(this.$('#ca_AMPAV0040_searchArea'),
					this.$('#ca_AMPAV0040_search'),
					this.$('#result'),
					this.$('#searchAgain'));

			// shiftキー押下時用
			this.$shift_table = null;
			this.shift_no = 0;
		},

		/**
		 * 選択画面の初期化処理
		 */
		render: function() {

			var url = clcom.urlRoot + "/system/app/" + this.categoryId + "/" + this.screenId + "/" + this.screenId + ".html";

			// HTMLソースを読み込む
			clutil.loadHtml(url, _.bind(function(data) {
				this.html_source = data;

				// 初期情報を取得する
				var req = {};

				// データを取得
				var uri = 'am_pa_itgrptree_init';
				clutil.postJSON(uri, req, _.bind(function(data, dataType) {
					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						this.funclist = data.func_list;
						this.lvllist = data.lvl_list;
						this.levelList = {
							0 : []
						};
						// 種別から階層リストを作成する
						for (var i = 0; i < this.funclist.length; i++) {
							var func = this.funclist[i];
							this.levelList[func.func_id] = [];
						}
						for (var i = 0; i < this.lvllist.length; i++) {
							var lvl = this.lvllist[i];
							this.levelList[lvl.lvl_func_id].push(lvl);
						}
					} else {
//						// ヘッダーにメッセージを表示
//						this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					}
				}, this));
			},this));

			return this;
		},

		/**
		 * editList		: 編集領域に保存されているリスト
		 * isSubDialog	: ダイアログからダイアログを表示したときにのみtrueを設定
		 * func_id		: 選択する種別を指定する場合に設定する
		 * lvl			: 選択する階層を指定する場合に設定する
		 * initData		: 初期表示条件 itgrp_id, func_idを設定する
		 *
		 */
		show: function(editList, isSubDialog, func_id, lvl, initData) {
			var _this = this;

			// 画面切り替え前のスクロール位置
			this.savedPos = {
				top: $('body').scrollTop(),
				left: $('body').scrollLeft()
			};

			// 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
			if (isSubDialog == null) {
				$('.cl_dialog').empty();
			}

			this.$parentView.hide();

			// htmlソースからダイアログを作成する
			this.$el.html('');
			this.$el.html(this.html_source);

			// 選択種別を設定
			this.func_id = func_id == null ? -1 : func_id;
			// 選択階層を設定
			this.lvl_id = lvl == null ? -1 : lvl.lvl_id;
			this.lvl_no = lvl == null ? -1 : lvl.lvl_no;

			// 初期データ
			this.initData = initData;

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_AMPAV0040_main'), {
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
				this.$('#ca_AMPAV0040_edit_tbl').html(html_source);

				if (this.initData == null || clutil.cStr(this.initData.itgrp_id) == "") {
					this.initData = {};
					// 編集情報の最後の情報を検索する
					var last = editList.length - 1;
					this.initData.func_id = editList[last].func_id;
					this.initData.itgrp_id = editList[last].val;
				}

			} else {
				if (this.addtoSelected != null) {
					this.addtoSelected.right_side_hide();
				}
//				this.initData = null;
			}


			// 結果状態をクリアする
			this.clearResult();

			// 初期情報を取得する
			if (this.initData != null) {
				this.$('#ca_AMPAV0040_func_id').selectpicker('val', this.initData.func_id);
//				// 親組織=0で第1階層を取得
//				this.onSearchClick(null, initData.itgrp_id);
			} else {
				// 引数がない場合のみ検索
				if (this.func_id == -1) {
					// 親組織=0で第1階層を取得
					this.onSearchClick(0);
				}
			}

			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode({
				view : this.$el
			});

			// 初期スクロール位置は原点に。
			$('body').scrollTop(0).scrollLeft(0);
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus(this.$('#ca_AMPAV0040_func_id'));
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
				this.$('#ca_AMPAV0040_box_' + i).closest('div.drilldownItem').remove();
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
				this.$('#ca_AMPAV0040_box_' + select_level).addClass('final');
			}

			var is_leaf = Number($(tr).attr('is-leaf'));

			// 選択されているノードの配下を検索
			// 複数選択またはなにも選択されていない場合場合は検索しない
			// 最終階層の場合は検索しない
			if (!is_leaf && $(table).find($('tr.selected')).length == 1) {
				var select_tr = $(table).find($('tr.selected'))[0];
				this.level = level+1;
				var parent_id = select_tr.id;
				// 結果表示
				this.onSearchClick(parent_id);
			}
		},

		/**
		 * 種別変更
		 */
		_onFuncSelect: function(e) {
			// 結果状態をクリアする
			this.clearResult();
			// 結果表示
			// 親組織=0で第1階層を取得
			this.onSearchClick(0);
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
		onSearchClick: function(parent_id, itgrp_id) {
			var _this = this;
			if (this.initData != null && clutil.cStr(this.initData.itgrp_id) != "") {
				itgrp_id = this.initData.itgrp_id;
				this.initData = null;
			}

			// 画面の情報を取得する
			var searchData = clutil.view2data(this.$('#ca_AMPAV0040_searchArea'), 'ca_AMPAV0040_');

			if (itgrp_id != null) {
				// 組織IDを設定
				searchData['itgrp_id'] = itgrp_id;
				searchData['f_upper'] = 1;
			} else if (parent_id == 0) {
				// 階層IDを設定
				var lvllist = this.levelList[searchData.func_id];
				searchData['lvl_id'] = lvllist[0].lvl_id;
			} else {
				// 親組織IDを設定
				searchData['parent_id'] = parent_id;
			}

			// 終端階層番号
			searchData['leaf_no'] = this.lvl_no == -1 ? 0 : this.lvl_no;

			var req = {
					cond : searchData
			};

			// データを取得
			var uri = 'am_pa_itgrptree_srch';
			clutil.postJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					if (itgrp_id != null) {
						// 確定時用にデータは保存しておく
						var resultList = data.itgrplist;

						if (resultList == null || resultList.length == 0) {
							// 配下組織が存在しない場合は内部レベルを戻す
							_this.level--;
						} else {
							// 取得したデータを表示する
							_this.idList = [];
							_this.makeTree(resultList, searchData.func_id);
							for (var i = 0; i < _this.idList.length; i++) {
								var tr = $('#ca_AMPAV0040_itgrptree tr[id=' + _this.idList[i] + ']')
								$(tr).addClass('ca_selected');
								if (i == _this.idList.length-1) {
									$(tr).closest('table').addClass('final');
									$(tr).addClass('selected');
								} else {
									$(tr).addClass('selected');
								}
								// スクロール
						        $(tr).closest('div').scrollTo('#' + _this.idList[i]);
							}
						}

					} else {
						// 確定時用にデータは保存しておく
						var resultList = data.itgrplist;

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
							// 階層名を取得
							var lvllist = _this.levelList[searchData.func_id];
							var lvl_obj = {
									lvl_name : lvllist[_this.level].lvl_name,
									level : _this.level};
							// 取得したデータを表示する
							_this.$('#ca_AMPAV0040_box_tmp').tmpl(lvl_obj).appendTo('#ca_AMPAV0040_itgrptree');
							_this.$('#ca_AMPAV0040_node_tmp').tmpl(resultList).appendTo('#ca_AMPAV0040_box_' + _this.level);
						}


					}
					// スクロール
			        $('#ca_AMPAV0040_itgrptree').scrollTo('#ca_AMPAV0040_box_' + _this.level);

					clutil.initUIelement(_this.$el);
				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}

				// 条件を追加ボタンにフォーカスする
				_this.$('#ca_AMPAV0040_add').focus();
			}, this));
		},

		/**
		 * ツリーを作成する
		 */
		makeTree: function(list, func_id) {
			if (list == null || list.length == 0) {
				return false;
			}

			var childlist = [];
			for (var i = 0; i < list.length; i++) {
				var node = list[i];
				if (node.child != null && node.child.length > 0) {
					// 子組織リストを保存しておく
					childlist = node.child;
					this.idList.push(node.itgrp_id);
					break;
				}
			}
			var no = 0;	//表示番号セット
			// 取得したデータを表示する
			$.each(list, function() {
				this.no = no++;
			});
			// 取得したデータを表示する
			var lvllist = this.levelList[func_id];
			var lvl_obj = {
					lvl_name : lvllist[this.level].lvl_name,
					level : this.level
					};
			this.$('#ca_AMPAV0040_box_tmp').tmpl(lvl_obj).appendTo('#ca_AMPAV0040_itgrptree');
			this.$('#ca_AMPAV0040_node_tmp').tmpl(list).appendTo('#ca_AMPAV0040_box_' + this.level);
			this.resultList.push(list);

			if (childlist != null && childlist.length > 0) {
				this.level++;
				this.makeTree(childlist, func_id);
			}

			return true;
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// 結果表示エリアをクリア
			this.$('#ca_AMPAV0040_itgrptree').empty();
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
			clutil.viewClear(this.$('#ca_AMPAV0040_searchArea'));
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
			var lvl_flag = false;
			$.each(this.$("#ca_AMPAV0040_itgrptree table.final tr.selected"), function() {
				if (_this.lvl_id != -1 &&
						Number($(this).attr('lvl-id')) != Number(_this.lvl_id)) {
					_this.validator.setErrorInfo({_eb_: clmsg.ca_select_lvl});
					lvl_flag = true;
					return;
				}
				chkId.push(this.id);
			});
			// 選択できない階層を選択していた場合
			if (lvl_flag) {
				return;
			}

			if (chkId.length > 0) {
				var selectlist = this.getData(chkId);
				// 編集領域のIDリストを取得する
				var idlist = [];
				var html_source = '';

				$.each(this.$('#ca_AMPAV0040_edit_tbl li'), function() {
					idlist.push(Number(this.id));
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
					if(idlist.indexOf(select.itgrp_id) != -1){
						// 重複する場合は追加しない
						continue;
					}
					// 重複していない場合は追加
					var newdata = {};
					newdata.val = select.itgrp_id;
					newdata.code = select.code;
					newdata.name = select.name;
					newdata.attr = select.lvl_no;
					// 種別を挿入する
					newdata.kind = amdb_defs.AM_PA_DEFS_KIND_ITGRP;
					// 階層種別
					newdata.func_id = this.$('#ca_AMPAV0040_func_id').val();

					html_source += this.makeEditTmp(newdata);
					num++;
					editlist.push(newdata);
				}
				this.$('#ca_AMPAV0040_edit_tbl').append(html_source);
			} else {
				// なにもしない
			}
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
						if (data.itgrp_id == selectId) {
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
			html_source += '<li id="' + data.val + '"><span>' + data.name + '</span><span class="code">';
			html_source += data.code + '</span><span class="btn-delete ca_AMPAV0040_edit_del"></span>'
			html_source += '<input type="hidden" name="kind" value="' + data.kind + '">';
			html_source += '<input type="hidden" name="val" value="' + data.val + '">';
			html_source += '<input type="hidden" name="code" value="' + data.code + '">';
			html_source += '<input type="hidden" name="name" value="' + data.name + '">';
			html_source += '<input type="hidden" name="attr" value="' + data.attr + '">';
			html_source += '<input type="hidden" name="func_id" value="' + data.func_id + '">';
			html_source += '</li>';

			return html_source;
		},

		/**
		 * 編集領域単一削除ボタン
		 */
		_onEditDelClick: function(e) {
			// クリックされた行を削除する
			$(e.target).closest("li").remove();
			this.$('#ca_AMPAV0040_add').focus();
		},

		/**
		 * 編集領域すべて削除ボタン押下
		 */
		_onEditDelAllClick: function() {
			// 削除対象IDリストを取得する
			var idlist = [];
			var html_source = '';
			this.$('#ca_AMPAV0040_edit_tbl').html("");
		},

		/**
		 * テーブルに表示されている編集リストを取得する
		 */
		getEditList : function() {
			var editlist = [];
			editlist = clutil.tableview2data(this.$('#ca_AMPAV0040_edit_tbl').children());
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
				var lvl_flag = false;
				var lvl_id = 0;
				$.each(this.$("#ca_AMPAV0040_itgrptree table.final tr.selected"), function() {
					lvl_id = Number($(this).attr('lvl-id'));
					if (_this.lvl_id != -1 &&
							lvl_id != Number(_this.lvl_id)) {
						_this.validator.setErrorInfo({_eb_: clmsg.ca_select_lvl});
						lvl_flag = true;
						return;
					}
					var tr = $(this).closest('tr');
					chkId.push(tr.get(0).id);
				});
				// 選択できない階層を選択していた場合
				if (lvl_flag) {
					return;
				}

				if (chkId.length > 0) {
					var selectlist = this.getData(chkId);

					for (var i = 0; i < selectlist.length; i++) {
						var select = selectlist[i];

						var newdata = {};
						newdata.val = select.itgrp_id;
						newdata.code = select.code;
						newdata.name = select.name;
						newdata.attr = select.lvl_no;
						// 種別を挿入する
						newdata.kind = amdb_defs.AM_PA_DEFS_KIND_ITGRP;
						// 階層種別
						newdata.func_id = this.$('#ca_AMPAV0040_func_id').val();

						if (this.select_mode == clutil.cl_single_select) {
							// 単一選択モード時はlevelidを挿入する
							newdata.lvl_id = lvl_id;
						}

						editlist.push(newdata);
					}
					this.$parentView.show();
					this._okProc(editlist);
					this.$el.html('');
					clutil.leaveEnterFocusMode();
					clutil.enterFocusMode();
				} else {
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clmsg.ca_AMPAV0040_0001});
				}
			} else {
				// 編集リストを取得
				this.$parentView.show();
				this._okProc(this.getEditList());
				this.$el.html('');
				clutil.leaveEnterFocusMode();
				clutil.enterFocusMode();
			}
		},

		// 選択時処理  呼び出し側で override する
		okProc : function(){
			// 上位で上書きする。
		},
		_okProc: function(){
			// Appコールバック呼び出し
			if(_.isFunction(this.okProc)){
				this.okProc.apply($, arguments);
			}
			// サブ画面からの復帰後のスクロール位置調整
			if(this.savedPos){
				_.defer(function(top, left){
					$('body').scrollTop(top).scrollLeft(left);
				}, this.savedPos.top, this.savedPos.left);
			}
		},

		/**
		 * キャンセル
		 */
		_onCancelClick: function() {
			this.$parentView.show();
			this._okProc(null);
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
		}
	});

});
