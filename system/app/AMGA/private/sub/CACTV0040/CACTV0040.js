$(function() {
	var CATALOG_PERIOD_BEFORE = 1
	var CATALOG_PERIOD_UNIT_YMD = 0;
	//////////////////////////////////////////////
	// View
	CACTV0040SelectorView = Backbone.View.extend({

		screenId : "CACTV0040",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_CACTV0040_tbody tr"			:	"_onTblTrClick",			// テーブル内ノード押下
			"click #ca_CACTV0040_tbody span"		:	"_onTblSpanClick",			// テーブル内エキスパンダ押下
			"click #ca_CACTV0040_expandAll"			:	"_onExpandAllClick",		// すべて開く押下

			"click #ca_CACTV0040_commit"			:	"_onCommitClick",			// 登録ボタン押下
			"click #ca_CACTV0040_cancel"			:	"_onCancelClick"			// キャンセルボタン押下
		},

		initialize: function() {
			_.bindAll(this);
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), this.isAnalyse_mode);

			var _this = this;
			clutil.inputlimiter(this.$el);

			// 分析画面以外からのモード
			if (this.isAnalyse_mode == false) {
				this.$('.ca_CACMV0030_multi').remove();
				this.$('#mainColumninBox').addClass('noLeftColumn');
				this.$('#mainColumnFooter').addClass('noLeftColumn');
			} else {
				this.$('#mainColumnFooter').addClass('analytics');
			}

			// メニュー取得
			this.getMenuTree();
		},

		/**
		 * 選択画面の初期化処理
		 *
		 * 引数
		 * ・$parentView		: 親画面のjQueryオブジェクト (例：$('#ca_main'))
		 * ・isAnalyse_mode		: false 分析モードでない場合
		 * 						: true  分析モードの場合、デフォルト
		 */
		render: function(
				$parentView,
				isAnalyse_mode
				) {
			var _this = this;

			this.$parentView = $parentView;
			this.isAnalyse_mode = isAnalyse_mode;

//			var url = "";
//			url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
			var url = clcom.getAnaSubPaneURI(this.screenId);

			// HTMLソースを読み込む
			clutil.loadHtml(url, function(data) {
				_this.html_source = data;
			});
		},

		show: function(isSubDialog) {
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
			this.initUIelement();

			$('.ca_CACTV0040_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_CACTV0040_main'), {
				echoback		: $('.cl_echoback')
			});

			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode({
				view : this.$el
			});

			// フォーカスの設定
			this.setFocus();
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus(this.$('#ca_CACTV0040_cancel'));
		},

		// 分析メニュー取得
		getMenuTree: function() {
			var _this = this;

			var req = {};

			// データを取得
			var uri = 'gsan_se_menutree_srch';
			clutil.postAnaJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					// 確定時用にデータは保存しておく
					var resultList = data.anamenu;

					if (resultList == null || resultList.length == 0) {
						// なにもしない
					} else {
						// 取得したデータを表示する
						this.$('#ca_CACTV0040_tbody').html('');
						this.$('#ca_CACTV0040_tbody').html(_this.makeTree(resultList));
						$(window).scrollTo(1);	// ダブルスクロール防止
					}
				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}

				clutil.initUIelement(_this.$el);

				// 確定ボタンにフォーカスする
				_this.$('#ca_CACTV0040_commit').focus();

			}, this));
		},

		/**
		 * ツリーを作成する
		 */
		makeTree: function(anamenu) {
			if (anamenu == null || anamenu.length == 0) {
				return '';
			}
			var html_source = '';

			// パス名取得用のリストを作成
			this.anamenu_name_hash = {};
			this.anamenunode_name_hash = {};
			this.anamenunode_parentid_hash = {};

			for (var i = 0; i < anamenu.length; i++) {
				var menu = anamenu[i];

				html_source += '<tr id="' + menu.anamenu_id + '" class="ca_CACTV0040_anamenu" node-level="0">';
				if (menu.anamenunode != null && menu.anamenunode.length > 0) {
					html_source += '<td colspan="30"><span class="treeClose"></span>';
					html_source += menu.anamenu_name + '</td>';
				} else {
					html_source += '<td colspan="30">' + menu.anamenu_name + '</td>';
				}
				html_source += '</tr>';

				// パス名取得用のリストを作成
				this.anamenu_name_hash[menu.anamenu_id] = menu.anamenu_name;

				if (menu.anamenunode != null && menu.anamenunode.length > 0) {
					html_source += this.makeNode(menu.anamenunode, 1, 0, menu.anamenu_id);
				}
			}

			return html_source;
		},

		/**
		 * ノードを作成する
		 */
		makeNode: function(nodelist, level, parent_id, menu_id) {
			var html_source = '';

			for (var i = 0; i < nodelist.length; i++) {
				var node = nodelist[i];

				html_source += '<tr id="' + node.anamenunode_id + '" parent-id="';
				html_source += parent_id + '" node-level="' + level + '" menu-id="' + menu_id + '">';
				for (var j = 0; j < level; j++) {
					html_source += '<td width="100px" class="indent"></td>';
				}
				if (node.child != null && node.child.length > 0) {
					html_source += '<td colspan="30"><span class="treeClose"></span>';
					html_source += node.anamenunode_name + '</td>';
				} else {
					html_source += '<td colspan="30">' + node.anamenunode_name + '</td>';
				}
				html_source += '</tr>';

				// パス名取得用のリストを作成
				this.anamenunode_name_hash[node.anamenunode_id] = node.anamenunode_name;
				this.anamenunode_parentid_hash[node.anamenunode_id] = parent_id;

				if (node.child != null && node.child.length > 0) {
					html_source += this.makeNode(node.child, level+1, node.anamenunode_id, menu_id);
				}
			}

			return html_source;
		},

		/**
		 * ノード押下
		 */
		_onTblTrClick: function(e) {
			var tr = $(e.target).closest('tr');

			if ($(tr).hasClass('ca_CACTV0040_anamenu')) {
				// メニューにはなにもしない
				return;
			}

			if ($(tr).hasClass('selected')) {
				// なにもしない
			} else {
				this.$('#ca_CACTV0040_tbody tr').removeClass('selected');
				$(tr).addClass('selected');
			}
		},

		/**
		 * エキスパンダ押下
		 */
		_onTblSpanClick: function(e) {
			var $span = $(e.target);
			var treeClose = $span.hasClass('treeClose');

			var tr = $(e.target).closest('tr');
			var level = Number($(tr).attr('node-level'));
			var anamenu = tr.hasClass('ca_CACTV0040_anamenu')
			var trlist = this.$('#ca_CACTV0040_tbody tr');

			var start = 0;
			for (var i = 0; i < trlist.length; i++) {
				if ((anamenu == $(trlist[i]).hasClass('ca_CACTV0040_anamenu'))
						&& (tr.get(0).id == trlist[i].id)) {
					// 押下されたノードを取得
					break;
				}
			}
			for (var j = i+1; j < trlist.length; j++) {
				var node = trlist[j];
				var node_level = Number($(node).attr('node-level'));
				if (level < node_level) {
					// 配下のノードのみコントロール

					if (treeClose) {
						// ツリーを閉じる
						$(node).addClass('dispn');
					} else {
						// ツリーを開く
						$(node).removeClass('dispn');
					}
					// エキスパンダが開いているか確認する
					if ($(node).find('span.treeOpen').length > 0) {
						// エキスパンダが閉じている状態のため、これより配下は閉じた状態のままにする
						for (var k = j+1; k < trlist.length; k++) {
							var childnode = trlist[k];
							var childnode_level = Number($(childnode).attr('node-level'));
							// 同レベルになるまでなにもせずに進める
							if (childnode_level <= node_level) {
								j = k-1;
								break;
							}
						}
					}
				} else {
					// 同レベルになったら終了
					break;
				}
			}

			if (treeClose) {
				$span.removeClass('treeClose');
				$span.addClass('treeOpen');
			} else {
				$span.removeClass('treeOpen');
				$span.addClass('treeClose');
			}
		},

		/**
		 * すべて開く click
		 */
		_onExpandAllClick: function() {

			if (this.$('span.unexpandAll').hasClass('dispn')) {
				// すべて開く
				$.each(this.$('#ca_CACTV0040_tbody tr'), function() {
					$(this).removeClass('dispn');
					if ($(this).find('span.treeOpen').length > 0) {
						$(this).find('span').removeClass('treeOpen');
						$(this).find('span').addClass('treeClose');
					}
				});

				this.$('span.unexpandAll').removeClass('dispn');
				this.$('span.expandAll').addClass('dispn');
			} else {
				// すべて閉じる
				$.each(this.$('#ca_CACTV0040_tbody tr'), function() {
					if (Number($(this).attr('node-level')) != 0) {
						$(this).addClass('dispn');
					}
					if ($(this).find('span.treeClose').length > 0) {
						$(this).find('span').removeClass('treeClose');
						$(this).find('span').addClass('treeOpen');
					}
				});

				this.$('span.expandAll').removeClass('dispn');
				this.$('span.unexpandAll').addClass('dispn');
			}
		},

		/**
		 * ノード名を取得する
		 */
		getNodeName: function(pathname, node_id) {
			pathname = '/' + this.anamenunode_name_hash[node_id] + pathname;
			if (this.anamenunode_parentid_hash[node_id] != 0) {
				return this.getNodeName(pathname, this.anamenunode_parentid_hash[node_id]);
			} else {
				return pathname;
			}
		},


		/**
		 * フォルダのパス名を取得する
		 */
		getPathName: function(node_id, menu_id) {

			var pathname = '';

			pathname = this.getNodeName(pathname, node_id);

			// メニュー名を取得
			pathname = '/' + this.anamenu_name_hash[menu_id] + pathname;

			return pathname;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function(e) {
			// validation
			if(!this.validator.valid()) {
				return;
			}
			// 選択されたデータを取得
			var tr = this.$('#ca_CACTV0040_tbody').find('tr.selected');
			if (tr == null || tr.length == 0) {
				this.validator.setErrorHeader(clmsg.ca_CACTV0040_0001);
				return;
			}
			var node_id = tr.get(0).id;
			var menu_id = $(tr).attr('menu-id');
			var node_name = this.getPathName(node_id, menu_id);

			var retObj = {
					node_id : node_id,
					node_name : node_name
			};

			// 遷移元へ戻る
			this.$parentView.show();
			this.okProc(retObj);
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
