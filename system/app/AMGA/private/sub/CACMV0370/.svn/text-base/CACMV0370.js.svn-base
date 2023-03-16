$(function() {

	//////////////////////////////////////////////
	// View
	CACMV0370SelectorView = Backbone.View.extend({

		screenId : "CACMV0370",
		validator: null,

		// 押下イベント
		events: {
			//"change #ca_CACMV0370_dispgroup"	:	"_onDispGroupSelect",	// 分類項目変更
			"click #ca_CACMV0370_main .ca_CACMV0370_addall"
												:	"_onAddAllClick",		// 全選択ボタン押下
			"click #ca_CACMV0370_main .ca_CACMV0370_add"
												:	"_onAddClick",			// 選択ボタン押下

			"click #ca_CACMV0370_edit_tbody .ca_CACMV0370_sort"
												:	"_onSortClick",			// ソートボタン押下

			"click #ca_CACMV0370_main .ca_CACMV0370_dispitem"
												:	"_onDispItemClick",		// 表示項目押下
			"click #ca_CACMV0370_edit_delall"	:	"_onEditDelAllClick",	// すべて削除ボタン押下
			"click #ca_CACMV0370_main .ca_CACMV0370_edit_delete"
												:	"_onEditDeleteClick",	// 単一削除ボタン押下
			"click #ca_CACMV0370_up"			:	"_onUpClick",			// ↑ボタン押下
			"click #ca_CACMV0370_down"			:	"_onDownClick",			// ↓ボタン押下

			"click #ca_CACMV0370_commit"		:	"_onCommitClick",		// 確定ボタン押下
			"click #ca_CACMV0370_main .close"	:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_CACMV0370_cancel"		:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_CACMV0370_main .modalBK"	:	"_onCancelClick"	// 枠外押下時
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
		initUIelement: function(editList, kind, func_id, name) {
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), this.isAnalyse_mode);

			clutil.inputlimiter(this.$el);

			// 選択対象マスタ項目名表示
			$("#ca_CACMV0370_dispgroup").val(name);
			this.mstitem_id = kind;
//			// 分類コンボの作成
//			var dispgroupList = _.where(this.anadata.disp_item_list, { dispitem_id: 0 });
//			clutil.cltypeselector2(this.$('#ca_CACMV0370_dispgroup'),
//					dispgroupList, 0,
//					1,
//					'dispgroup');
			// 初期値
			this._onDispGroupSelect();

			// 表示項目
			if (editList != null && editList.length > 0) {
				this.$('#ca_CACMV0370_edit_tbody_tmp').tmpl(editList).appendTo('#ca_CACMV0370_edit_tbody');
			}

			// ソートキー設定
			var vsortlist = this.anaProc.cond.dispvsortkeylist;
			if (vsortlist.length > 0) {
				var sortkey = vsortlist[0];
				var tr = this.$('#ca_CACMV0370_edit_tbody').find('tr[id=' + sortkey.dispitem_id + ']');
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

		show: function(editList, isSubDialog, kind, func_id, name) {

			// 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
			if (isSubDialog == null) {
				$('.cl_dialog').empty();
			}

			this.$parentView.hide();

			// htmlソースからダイアログを作成する
			this.$el.html('');
			this.$el.html(this.html_source);

			// 画面の初期化
			this.initUIelement(editList, kind, func_id, name);

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_CACMV0370_main'), {
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
			clutil.setFocus(this.$('#ca_CACMV0370_dispgroup'));
		},

		/**
		 * 分類変更
		 */
		_onDispGroupSelect: function(e) {
			// 分類から表示項目を作成
			var mstitemList = this.getDispItem();
			this.$('#ca_CACMV0370_tbody').empty();
			this.$('#ca_CACMV0370_tbody_tmp').tmpl(mstitemList).appendTo('#ca_CACMV0370_tbody');

			clutil.initUIelement(this.$('#ca_CACMV0370_tbody'));
		},

		/**
		 * 選択された分類の表示項目を取得
		 */
		getDispItem: function() {
			var t_group = this.mstitem_id;
			var mastitem_list = clcom.getStoredValue('mstitem_list');
			var mstitemList = [];
			if (mastitem_list != null && mastitem_list.length > 0) {
				for (var i = 0; i < mastitem_list.length; i++) {
					var mstitem = mastitem_list[i];
					// 分類ヘッダー以外を追加
					if (mstitem.t_group == t_group && mstitem.dispitem_id != 0) {
						mstitemList.push(mstitem);
					}
				}
			}
			return mstitemList;
		},
        /**
         * 選択済マスタ項目の dispitem_id マップを返す。
         */
        getSelectedDispitemIdMap: function(){
            var map = {};
            this.$('#ca_CACMV0370_edit_tbody tr').each(function(idx, elem){
                var $tr = $(elem);
    			var dispitem_id = $tr.find('input[name="dispitem_id"]').val();
    			var name = $tr.find('input[name="name"]').val();
    			var dto = {
    				dispitem_id: dispitem_id,
    				name: name,
    			};
                if(dto != null){
                    map[dto.dispitem_id] = dto;
                }
            });
            return map;
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
			var $buttons = this.$('button.ca_CACMV0370_add');
			// 一旦すべて使用可にする
			$buttons.removeAttr('disabled');
		},

		/**
		 * ソートボタン押下
		 */
		_onSortClick: function(e) {
			var isActive = $(e.target).hasClass('active');

			// すべてのソート解除
			this.$('#ca_CACMV0370_edit_tbody').find('span.asc').removeClass('active');
			this.$('#ca_CACMV0370_edit_tbody').find('span.dsc').removeClass('active');

			if (!isActive) {
				$(e.target).addClass('active');
			}
		},

		/**
		 * すべて削除ボタン押下
		 */
		_onEditDelAllClick: function() {
			this.$('#ca_CACMV0370_edit_tbody').empty();
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
			this.$('#ca_CACMV0370_tbody').empty();
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
			clutil.viewClear(this.$('#ca_CACMV0370_searchArea'));
			// validatorの初期化
			this.validator.clear();
		},

		/**
		 * 全選択ボタン押下
		 * @param e
		 */
		_onAddAllClick: function(e) {
			var $rPool = this.$("#ca_CACMV0370_edit_tbody");
			var $lastTR = null;

			var map = this.getSelectedDispitemIdMap();
			this.$('#ca_CACMV0370_tbl tr').each(_.bind(function(idx, elem){
				var $tr = $(elem);
				var dispitem_id = $tr.find('input[name="dispitem_id"]').val();
				var name = $tr.find('input[name="name"]').val();
				var dto = {
					dispitem_id: dispitem_id,
					name: name,
				};
				if(map[dto.dispitem_id] != null){
					return;
				}
				var $addTR = this.$('#ca_CACMV0370_edit_tbody_tmp').tmpl(dto);
				$rPool.append($addTR);
				$lastTR = $addTR;
            },this));
			// 末尾へスクロール
			if ($lastTR) {
				this.scrollTo($lastTR, 'fast');
			}
		},

		/**
		 * 選択ボタン押下
		 */
		_onAddClick:function(e) {
			/*
			 * 1.選択行の項目object取得
			 * 2.選択済にあるか確認→あればスキップ
			 * 3.選択済テーブルに追加
			 */
			var $rPool = this.$("#ca_CACMV0370_edit_tbody");
			var $lastTR = null;

			//var $tr = this.$('#ca_CACMV0370_tbl tr.selected');
			_.each(this.$('#ca_CACMV0370_tbl tr.selected'), _.bind(function(tr) {
				var $tr = $(tr);
				var dispitem_id = $tr.find('input[name="dispitem_id"]').val();
				var name = $tr.find('input[name="name"]').val();
				var dto = {
					dispitem_id: dispitem_id,
					name: name,
				};

				if (dto != null) {
					var map = this.getSelectedDispitemIdMap();
					if(map[dto.dispitem_id] != null){
						return; // 重複チェック: 選択済
					}
					var $addTR = this.$('#ca_CACMV0370_edit_tbody_tmp').tmpl(dto);
					$rPool.append($addTR);
					$lastTR = $addTR;

					// 1つ下の要素へ選択シフトする
					var $nextTR = $tr.next();
					if($nextTR.length != 0){
						$tr.removeClass('selected');
						$nextTR.addClass('selected');
						this.scrollTo($tr, 'fast');
					}
				}
			}, this));

			// 末尾へスクロール
			if ($lastTR) {
				this.scrollTo($lastTR, 'fast');
			}
		},
        /**
         * 指定要素 $elem の位置へスクロールする。
         */
        scrollTo: function($elem, speed){
            var $vp = $elem.closest('.ca_viewport');
            if(speed == null){
                var scrollTop = $elem.offset().top + $elem.outerHeight();   // FIXME: offset().top 値が小さいことがある？？？
                $vp.slimScroll({scrollTo: scrollTop});
            }else{
                // slimScroll 単体ではアニメーション効果付きスクロール移動できない。
                // よって、viewport に対して jQuery でスクロールし、アニメーション効果
                // 完了コールバックから slimScroll API でスクロール位置を再度設定する。
                $vp.scrollTo($elem, speed, function(){
                    var scrollTop = $vp.scrollTop();
                    $vp.slimScroll({scrollTo: scrollTop});
                });
            }
        },

		/**
		 * ↑ボタン押下
		 */
		_onUpClick: function(e) {
			var trlist = this.$('#ca_CACMV0370_edit_tbl').find('tr.selected');

			if (trlist == null || trlist.length == 0) {
				// なにも選択されていなければなにもしない
				return;
			}

			var $tr_up = null;
			var trlist_edit = this.$('#ca_CACMV0370_edit_tbl').find('tr');
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
			var trlist = this.$('#ca_CACMV0370_edit_tbl').find('tr.selected');

			if (trlist == null || trlist.length == 0) {
				// なにも選択されていなければなにもしない
				return;
			}

			var $tr_down = null;
			var trlist_edit = this.$('#ca_CACMV0370_edit_tbl').find('tr');
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
			editlist = clutil.tableview2data(this.$('#ca_CACMV0370_edit_tbody').children());
			_.each(editlist, _.bind(function(v) {
				v.t_group = this.mstitem_id;
			}, this));
			return editlist;
		},

		/**
		 * ソートキー取得
		 */
		getSortkey : function() {
			// ソートキー設定
			var sortkey = null;
			var $span = this.$('#ca_CACMV0370_edit_tbody').find('span.active');
			if ($span.length > 0) {
				var order = $span.hasClass('asc')
					? amanp_AnaSortKey.AMANP_ANA_SORTKEY_ORDER_ASCENDING
					: amanp_AnaSortKey.AMANP_ANA_SORTKEY_ORDER_DESCENDING;
				var $tr = $span.closest('tr');
				sortkey = {
						idx: 0,
						dispitem_id : $tr.get(0).id,
						order : order
				};
			}
			return sortkey;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			this.validator.clear();

			this.$parentView.show();

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
