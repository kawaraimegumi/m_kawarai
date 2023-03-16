$(function() {

	//////////////////////////////////////////////
	// View
	CACMV0190SelectorView = Backbone.View.extend({

		screenId : "CACMV0190",
		validator: null,

		// 押下イベント
		events: {
			"change #ca_CACMV0190_dispgroup"	:	"_onDispGroupSelect",	// 分類項目変更
			"click #ca_CACMV0190_main .ca_CACMV0190_add"
												:	"_onAddClick",			// 追加ボタン押下

			"click #ca_CACMV0190_edit_tbody .ca_CACMV0190_sort"
												:	"_onSortClick",			// ソートボタン押下

			"click #ca_CACMV0190_main .ca_CACMV0190_dispitem"
												:	"_onDispItemClick",		// 表示項目押下
			"click #ca_CACMV0190_edit_delall"	:	"_onEditDelAllClick",	// すべて削除ボタン押下
			"click #ca_CACMV0190_main .ca_CACMV0190_edit_delete"
												:	"_onEditDeleteClick",	// 単一削除ボタン押下
			"click #ca_CACMV0190_up"			:	"_onUpClick",			// ↑ボタン押下
			"click #ca_CACMV0190_down"			:	"_onDownClick",			// ↓ボタン押下

			"click #ca_CACMV0190_commit"		:	"_onCommitClick",		// 確定ボタン押下
			"click #ca_CACMV0190_main .close"	:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_CACMV0190_cancel"		:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_CACMV0190_main .modalBK"	:	"_onCancelClick"	// 枠外押下時
		},

		initialize: function(opt) {
			var defaults = {
				isAnalyse_mode: true					// 分析画面で利用
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function(editList) {
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), this.isAnalyse_mode);

			var _this = this;
			clutil.inputlimiter(this.$el);

			// 分類コンボの作成
			var dispgroupList = _.where(this.anadata.disp_item_list, { dispitem_id: 0 });
			clutil.cltypeselector2(this.$('#ca_CACMV0190_dispgroup'),
					dispgroupList, 0,
					1,
					'dispgroup');
			// 初期値
			this._onDispGroupSelect();

			// 表示項目
			if (editList != null && editList.length > 0) {
				this.$('#ca_CACMV0190_edit_tbody_tmp').tmpl(editList).appendTo('#ca_CACMV0190_edit_tbody');
			}

			// ソートキー設定
			var vsortlist = this.anaProc.cond.dispvsortkeylist;
			if (vsortlist.length > 0) {
				var sortkey = vsortlist[0];
				var tr = this.$('#ca_CACMV0190_edit_tbody').find('tr[id=' + sortkey.dispitem_id + ']');
				var order = sortkey.order == amanp_AnaSortKey.AMANP_ANA_SORTKEY_ORDER_ASCENDING ?
						'asc' : 'dsc';
				$(tr).find('span.' + order).addClass('active');
			}

			// shiftキー押下時用
			this.$shift_table = null;
			this.shift_no = 0;

			clutil.initUIelement(this.$el);
			this.initAnimate(this.$el);
		},

		// アニメーション表示のための初期化
		initAnimate: function($view) {
			$view.undelegate('.btn-delete', 'mouseover');
			$view.undelegate('.btn-delete', 'mouseout');
			$view.undelegate('.btn-delete', 'mousedown');
			$view.delegate('.btn-delete', 'mouseover', function(){
				$(this).closest('tr').toggleClass('ovr');
			});
			$view.delegate('.btn-delete', 'mouseout', function(){
				$(this).closest('tr').toggleClass('ovr');
			});
			$view.delegate('.btn-delete', 'mousedown', function(){
				$(this).closest('tr').addClass('active');
			});
		},

		/**
		 * 選択画面の初期化処理
		 */
		render: function() {
			var _this = this;

//			var url = "";
//			url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
			var url = clcom.getAnaSubPaneURI(this.screenId);

			// HTMLソースを読み込む
			clutil.loadHtml(url, function(data) {
				_this.html_source = data;
			});
		},

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

			// 画面の初期化
			this.initUIelement(editList);

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_CACMV0190_main'), {
				echoback		: $('.cl_echoback')
			});
			// フォーカスの設定
			this.setFocus();

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
			clutil.setFocus(this.$('#ca_CACMV0190_dispgroup'));
		},

		/**
		 * 分類変更
		 */
		_onDispGroupSelect: function(e) {
			// ボタンの初期化
			var buttons = this.$('button.ca_CACMV0190_add');
			$(buttons).removeAttr('disabled');
			// 分類から表示項目を作成
			var dispitemList = this.getDispItem();
			this.$('#ca_CACMV0190_tbody').empty();
			this.$('#ca_CACMV0190_tbody_tmp').tmpl(dispitemList).appendTo('#ca_CACMV0190_tbody');

			clutil.initUIelement(this.$('#ca_CACMV0190_tbody'));
		},

		/**
		 * 選択された分類の表示項目を取得
		 */
		getDispItem: function() {
			var dispgroup = this.$('#ca_CACMV0190_dispgroup').val();
			var dispitemList = [];
			if (this.anadata.disp_item_list != null && this.anadata.disp_item_list.length > 0) {
				for (var i = 0; i < this.anadata.disp_item_list.length; i++) {
					var dispitem = this.anadata.disp_item_list[i];
					// 分類ヘッダー以外を追加
					if (dispitem.dispgroup == dispgroup && dispitem.dispitem_id != 0 &&
							dispitem.sum_bitset != 0) {
						dispitemList.push(dispitem);
					}
				}
			}
			return dispitemList;
		},

		/**
		 * 表示項目押下
		 */
		_onDispItemClick: function(e) {
			var ctrlkey = e.ctrlKey;
			var shiftkey = e.shiftKey;

			var $tr = $(e.target).closest("tr");
			var $table = $(e.target).closest("table");

			// shiftキー押下時用のフラグ
			var shiftkeyFlag = false;
			if (shiftkey) {
				if (this.$shift_table != null) {
					var table_id = $table.get(0).id;
					var shift_table_id = this.$shift_table.get(0).id;
					if (table_id == shift_table_id) {
						shiftkeyFlag = true;
					}
				}
			}

			// 選択モードによって挙動を変える
			if (shiftkeyFlag) {
				var no = Number($tr.index());
				var start_no = this.shift_no < no ? this.shift_no : no;
				var end_no = this.shift_no < no ? no : this.shift_no;
				var trlist = $table.find('tr');
				for (var i = start_no; i <= end_no; i++) {
					$(trlist[i]).addClass('selected');
				}
			} else if (!ctrlkey) {
				// 単一モードまたは複数モードでコントロールキー押下していない時
				// 選択されているノードをクリアする
				$table.find('tr.selected').removeClass('selected');
//				$.each($table.find($('tr.selected')), function() {
//					$(this).removeClass('selected');
//				});
				$tr.addClass('selected');
			} else {
				if ($tr.hasClass('selected')) {
					$tr.removeClass('selected');
				} else {
					$tr.addClass('selected');
				}
			}

			// shiftキー押下用にテーブル、noを保存しておく
			this.$shift_table = $table;
			this.shift_no = Number($tr.index());

			// ボタンの設定
			this.setButtons();
		},

		/**
		 * 押下された表示項目に応じてボタンの使用可・不可を変更する
		 */
		setButtons: function() {
			var $buttons = this.$('button.ca_CACMV0190_add');
			var $trlist = this.$('#ca_CACMV0190_tbl').find('tr.selected');
			var dispitemlist = clutil.tableview2data($trlist);
			// 一旦すべて使用可にする
			$buttons.removeAttr('disabled');

			for (var i = 0; i < dispitemlist.length; i++) {
				var dispitem = dispitemlist[i];
				$buttons.each(function() {
					var $this = $(this);
					var gsanpAnaDefs = $this.attr('gsanp-AnaDefs');
					if ((Number(dispitem.sum_bitset) & amanp_AnaDefs[gsanpAnaDefs]) == 0) {
						$this.attr('disabled', 'disabled');
					}
				});
			}
		},

		/**
		 * ソートボタン押下
		 */
		_onSortClick: function(e) {
			var isActive = $(e.target).hasClass('active');

			// すべてのソート解除
			this.$('#ca_CACMV0190_edit_tbody').find('span.asc').removeClass('active');
			this.$('#ca_CACMV0190_edit_tbody').find('span.dsc').removeClass('active');

			if (!isActive) {
				$(e.target).addClass('active');
			}
		},

		/**
		 * すべて削除ボタン押下
		 */
		_onEditDelAllClick: function() {
			this.$('#ca_CACMV0190_edit_tbody').empty();
		},

		/**
		 * 単一削除ボタン押下
		 */
		_onEditDeleteClick: function(e) {
			$(e.target).closest("tr").fadeOut(300).queue( function(){ this.remove() });
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// テーブルをクリア
			this.$('#ca_CACMV0190_tbody').empty();
			// ページャーの初期化
			this.initPager(1, clcom.itemsOnPage, 0);
			// validatorの初期化
			this.validator.clear();
			// 全選択チェックボックスを初期化
			this.chkall.init();
			// 確定時用のデータを初期化
			this.resultList = [];
		},

		/**
		 * クリアボタン押下
		 */
		_onClearClick: function() {
			clutil.viewClear(this.$('#ca_CACMV0190_searchArea'));
			// validatorの初期化
			this.validator.clear();
		},

		/**
		 * 追加ボタン押下
		 */
		_onAddClick:function(e) {
			var gsanpAnaDispItemDefs = $(e.target).attr('gsanp-AnaDispItemDefs');
			var trlist = this.$('#ca_CACMV0190_tbl').find('tr.selected');
			var dispitemlist = clutil.tableview2data(trlist);

			for (var i = 0; i < dispitemlist.length; i++) {
				var dispitem = dispitemlist[i];

				// 表示項目idの作成
				var dispitem_id = Number(dispitem.dispitem_id) & (~ amanp_AnaDispItemDefs.AMAN_DI_S_MASK);
				dispitem_id = dispitem_id | amanp_AnaDispItemDefs[gsanpAnaDispItemDefs];

				var editdispitemlist = this.$('#ca_CACMV0190_edit_tbl').find('tr[id=' + dispitem_id + ']');
				// 既に追加されている場合は追加しない
				if (editdispitemlist.length == 0) {
					// 実績値以外は後ろにボタンの名前を追加する
					var name = gsanpAnaDispItemDefs == 'GSAN_DI_S_VAL' ? dispitem.name : dispitem.name + $(e.target).html();
					var newdispitem = {
							dispitem_id : dispitem_id,
							name : name
					};
					this.$('#ca_CACMV0190_edit_tbody_tmp').tmpl(newdispitem).appendTo('#ca_CACMV0190_edit_tbody');
				}
			}
			this.initAnimate(this.$el);
		},

		/**
		 * ↑ボタン押下
		 */
		_onUpClick: function(e) {
			var trlist = this.$('#ca_CACMV0190_edit_tbl').find('tr.selected');

			if (trlist == null || trlist.length == 0) {
				// なにも選択されていなければなにもしない
				return;
			}

			var $tr_up = null;
			var trlist_edit = this.$('#ca_CACMV0190_edit_tbl').find('tr');
			for (var i = 0; i < trlist_edit.length; i++) {
				var $tr = $(trlist_edit[i]);
				if ($tr.hasClass('selected')) {
					break;
				}
				$tr_up = $tr;
			}

			if ($tr_up == null) {
				for (var i = 0; i < trlist_edit.length; i++) {
					var $tr = $(trlist_edit[i]);
					if (!$tr.hasClass('selected')) {
						$tr_up = $tr;
						break;
					}
				}
			}

			if ($tr_up == null) {
				return;
			}

			for (var i = 0; i < trlist.length; i++) {
				var tr = trlist[i];
				$(tr).insertBefore($tr_up).show();
			}
		},


		/**
		 * ↓ボタン押下
		 */
		_onDownClick: function(e) {
			var trlist = this.$('#ca_CACMV0190_edit_tbl').find('tr.selected');

			if (trlist == null || trlist.length == 0) {
				// なにも選択されていなければなにもしない
				return;
			}

			var $tr_down = null;
			var trlist_edit = this.$('#ca_CACMV0190_edit_tbl').find('tr');
			for (var i = trlist_edit.length-1; i >= 0 ; i--) {
				var $tr = $(trlist_edit[i]);
				if ($tr.hasClass('selected')) {
					break;
				}
				$tr_down = $tr;
			}

			if ($tr_down == null) {
				for (var i = trlist_edit.length-1; i >= 0 ; i--) {
					var $tr = $(trlist_edit[i]);
					if (!$tr.hasClass('selected')) {
						$tr_down = $tr;
						break;
					}
				}
			}

			if ($tr_down == null) {
				return;
			}

			for (var i = trlist.length-1; i >= 0 ; i--) {
				var tr = trlist[i];
				$(tr).insertAfter($tr_down).show();
			}
		},

		/**
		 * テーブルに表示されている編集リストを取得する
		 */
		getEditList : function() {
			var editlist = [];
			editlist = clutil.tableview2data(this.$('#ca_CACMV0190_edit_tbody').children());
			return editlist;
		},

		/**
		 * ソートキー取得
		 */
		getSortkey : function() {
			// ソートキー設定
			var sortkey = null;
			var $span = this.$('#ca_CACMV0190_edit_tbody').find('span.active');
			if ($span.length > 0) {
				var order = $span.hasClass('asc')
					? amanp_AnaSortKey.AMANP_ANA_SORTKEY_ORDER_ASCENDING
					: amanp_AnaSortKey.AMANP_ANA_SORTKEY_ORDER_DESCENDING;
				var $tr = $span.closest('tr');
				sortkey = {
						idx: 0,
						dispitem_id : $tr.get(0).id,
						order : order
				}
			}
			return sortkey;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			this.validator.clear();

			this.$parentView.show();

			// ソートキー設定
			this.anaProc.cond.dispvsortkeylist = function(sortkey){
				var sortkeys = [];
				if(!_.isNull(sortkey)){
					sortkeys.push(Ana.Util.valuesToNumber(sortkey));
				}
				return sortkeys;
			}(this.getSortkey());

			this.okProc(this.getEditList());
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
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
