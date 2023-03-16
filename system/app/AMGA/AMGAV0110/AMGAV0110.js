$(function(){
	//////////////////////////////////////////////
	// View
	var ListView = Backbone.View.extend({
		// 要素
		el						: $('#ca_main'),

		validator: null,

		// Eventes
		events: {
			"click #ca_reload"					:	"_onReloadClick",			// 更新クリック

			"click #ca_ana_tbl tr.ca_anamenuitem":	"_onAnaTblTrClick",			// 要素テーブル内ノードクリック
			"click #ca_ana_tbl tr.ca_hist"		:	"_onAnaTblTrHistClick",		// 要素テーブル内ノードクリック（履歴アイテム）

			"click #ca_tbl tr"					:	"_onTblTrClick",			// テーブル内ノード押下
			"click #ca_tbl span.ca_expand"		:	"_onExpandClick",			// テーブル内エキスパンダ押下

			"click #ca_add"						: function(e){					// 追加クリック
				this.stopInputAny();
				this._onAddClick(e);
				e.stopImmediatePropagation();	// stopInputAny() 防止のため。
			},
			"keydown .editable input.ca_add"	:	"_onInputAddKeydown",		// 追加inputフォーカスアウト

			"click .editable span.edit"			: function(e){					// 編集クリック
				this.stopInputAny();
				this._onSpanEditClick(e);
				e.stopImmediatePropagation();	// stopInputAny() 防止のため。
			},
			"keydown .editable input.ca_edit"	:	"_onInputEditKeydown",		// 編集inputフォーカスアウト
			"click .editable span.btn-delete"	: 	"_onSpanDeleteClick",		// 削除クリック

			// 任意箇所クリックで、アクティブなフォルダ名エディタを刈り取る
			'click #container': function(e){
				var $target = $(e.target);
				if($target.is('input.ca_edit')){
					// アクティブなフォルダ名編集 input
					e.preventDefault();
					return false;
				}else if($target.is('input.ca_add')){
					// アクティブな新規フォルダ input
					e.preventDefault();
					return false;
				}
				this.stopInputAny();
			},

			"click #cust_menu"					:	"_onCustMenuClick"			// 顧客分析メニュークリック
		},

		initialize: function() {
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validatorWithTicker(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			// システム管理者
			this.f_admin = false;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

			// フォルダ追加ボタン
			if (this.f_admin) {
				$('#ca_add').closest('div.fieldUnit').removeClass('dispn');
				$('#ca_tbl_div').removeClass('ht500');
				$('#ca_tbl_div').addClass('ht440');
			}
			this.initAnimate();
		},

		// アニメーション表示のための初期化
		initAnimate: function() {
			$('#ca_tbl').undelegate('.btn-delete', 'mouseover');
			$('#ca_tbl').undelegate('.btn-delete', 'mouseout');
			$('#ca_tbl').undelegate('.btn-delete', 'mousedown');
			$('#ca_tbl').delegate('.btn-delete', 'mouseover', function(){
				$(this).closest('tr').toggleClass('ovr');
			});
			$('#ca_tbl').delegate('.btn-delete', 'mouseout', function(){
				$(this).closest('tr').toggleClass('ovr');
			});
//			$('#ca_tbl').delegate('.btn-delete', 'mousedown', function(){
//				$(this).closest('tr').addClass('active');
//			});
		},

		// 初期フォーカス設定
		setFocus: function() {
			$('#ca_add').focus();
		},

		// ツリー表示
		getMenuTree: function(f_admin) {
			// 追加、編集フラグ
			this.addFlag = false;
			this.editFlag = false;

			this.validator.clear();

			var $ca_tbl = this.$('#ca_tbl');
			var $thead = this.$('#ca_tbl > thead');
			var $tbody = this.$('#ca_tbl > tbody');
			var $ca_ana_tbl = this.$('#ca_ana_tbl');

			// データを取得
			var req = {};

			// 現URLを取得してreqを調整 #20151018
			var cururl = location.href;
console.log("DEBUG: cururl=" + cururl);
			var myfuncid = null;
			var myarray = cururl.split("/");
			if( myarray != null && myarray.length > 0 ){
				var mylast = myarray[myarray.length-1];
console.log("DEBUG: mylast=" + mylast);
				if( mylast != null ){
					var myarray2 = mylast.split(".");
					if( myarray2 != null && myarray2.length > 0 ){
						myfuncid = myarray2[0];
					}
				}
			}
console.log("DEBUG: myfuncid=" + myfuncid);
			var main_menu_id = 1;
			if( myfuncid != null && myfuncid == "AMGAV0120" ){
				// ゾーンAJA向け分析
				main_menu_id = 3;
			}
			var reqcond = { main_menu_id: main_menu_id };
			req.cond = reqcond;

			var uri = 'gsan_cm_menu_get';
			clutil.postAnaJSON(uri, req)
			.done(_.bind(function(data){

				// 確定時用にデータは保存しておく
				var resultList = data.anamenu;
				// システム管理者
				this.f_admin = data.f_admin;

				this.savedReq = req;

				// 管理者フラグが指定されていない場合はそのまま取得
				// 管理者フラグを指定されて、権限が変わった場合は再取得
				if (f_admin == null || f_admin != this.f_admin) {
					if (resultList == null || resultList.length == 0) {
						// テーブルを空にする
						$thead.empty();
						$tbody.empty();
					} else {
						// 取得したデータを表示する
						$thead.html(this.makeHistoryTree(resultList));
						$tbody.html(this.makeTree(resultList));
					}
				}

				// 区分selectorを初期化する
				this.initUIelement();
				clutil.initUIelement($ca_tbl);

				this.setFocus();
			}, this))
			.fail(_.bind(function(data){
				// テーブルを空にする
				$thead.empty();
				$tbody.empty();
				$ca_ana_tbl.empty();

				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});

				// 区分selectorを初期化する
				this.initUIelement();
				clutil.initUIelement($ca_tbl);

				this.setFocus();
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

			// メニュー項目、カタログ取得用のリストを作成
			this.anamenu_item_hash = {};
			this.anamenu_catalog_hash = {};

			for (var i = 0; i < anamenu.length; i++) {
				var menu = anamenu[i];

				// ノードレベル0直下へのフォルダ追加可否設定 #20150107
				if (menu.can_add_folder) {
					html_source += '<tr id="' + menu.anamenu_id + '" class="ca_anamenu" node-level="0">';
				} else {
					html_source += '<tr id="' + menu.anamenu_id + '" class="ca_anamenu ca_cannot_add_folder" node-level="0">';
				}
				if (menu.anamenunode != null && menu.anamenunode.length > 0) {
					// 初期値Closed対応 #20150107
					if (menu.is_closed == 0) {
						html_source += '<td colspan="30"><span class="treeClose ca_expand"></span>';
					} else {
						html_source += '<td colspan="30"><span class="treeOpen ca_expand"></span>';
					}
					html_source += menu.anamenu_name + '</td>';
				} else {
					html_source += '<td colspan="30">' + menu.anamenu_name + '</td>';
				}
				html_source += '</tr>';

				if (menu.anamenunode != null && menu.anamenunode.length > 0) {
					html_source += this.makeNode(menu.anamenunode, 1, 0, menu.anamenu_id, menu.is_closed);
				}
			}

			return html_source;
		},

		/**
		 * 履歴ツリーを作成する
		 */
		makeHistoryTree: function(anamenu){
			if (anamenu == null || anamenu.length == 0) {
				return '';
			}

			// 履歴メニューのルートノード。
			var html_source = '<tr id="0" class="ca_anamenu ca_hist" node-level="0">';
			html_source += '<td colspan="30"><span class="treeOpen ca_expand"></span>';
			html_source += '最近実行した条件' + '</td>';
			html_source += '</tr>';

			// メニューノード木構造を歩き回って分析メニューアイテムをかき集める再帰関数
			var rMenuTreeWalk = function(menuNode, anaItems){
				if(!_.isArray(anaItems)){
					anaItems = [];
				}
				var items = menuNode.item;
				if(_.isArray(items)){
					for(var i = 0; i < items.length; i++){
						var item = items[i];
						if(item.f_anakind){
							var anaItem = _.extend({ pNode: menuNode }, item);
							anaItems.push(anaItem);
						}
					}
				}
				var children = menuNode.child;
				if(_.isArray(children)){
					for(var i = 0; i < children.length; i++){
						var child = children[i];
						rMenuTreeWalk(child, anaItems);
					}
				}
				return anaItems;
			};

			var anaItems = [];
			for(var i = 0; i < anamenu.length; i++){
				var menu = anamenu[i];
				if(_.isArray(menu.anamenunode)){
					for(var j = 0; j < menu.anamenunode.length; j++){
						var menuNode = menu.anamenunode[j];
						rMenuTreeWalk(menuNode, anaItems);
					}
				}
			}

			// anaItems で行要素を構築する。
			var chkMap = {};
			for(var i = 0; i < anaItems.length; i++){
				var anaItem = anaItems[i];
				if(chkMap[anaItem.func_code]){
					continue;
				}
				chkMap[anaItem.func_code] = true;
				html_source += '<tr id="'+ anaItem.pNode.anamenunode_id + '" parent-id="0" node-level="1" menu-id="0" data-hist_func_code="' + anaItem.func_code + '" class="ca_hist dispn">';
				html_source += '<td width="60px" class="indent"></td>';
				html_source += '<td colspan="30" class="">' + anaItem.pNode.anamenunode_name + '</td>';
				html_source += '</tr>';
			}

			return html_source;
		},

		/**
		 * ノードを作成する
		 */
		makeNode: function(nodelist, level, parent_id, menu_id, is_closed) {
			var html_source = '';

			var MTTYPE_F_FOLDER_USER = _.first(clcom.getTypeList(amcm_type.AMCM_TYPE_FOLDER, amcm_type.AMCM_VAL_FOLDER_USER));
			if(!MTTYPE_F_FOLDER_USER){
				throw "フォルダ区分が取れません。";
			}

			for (var i = 0; i < nodelist.length; i++) {
				var node = nodelist[i];

				html_source += '<tr id="' + node.anamenunode_id + '" parent-id="';
				html_source += parent_id + '" node-level="' + level + '" menu-id="' + menu_id + '"';
				// ユーザフォルダの場合は編集可能
				// 初期値Closed対応 #20150107
				if (is_closed == 0) {
					if (node.f_folder == MTTYPE_F_FOLDER_USER.type_id) {
						html_source += ' class="deletable">';
					} else {
						html_source += '>';
					}
				}
				else {
					if (node.f_folder == MTTYPE_F_FOLDER_USER.type_id) {
						html_source += ' class="deletable dispn">';
					} else {
						html_source += ' class="dispn">';
					}
				}

				for (var j = 0; j < level; j++) {
					html_source += '<td width="60px" class="indent"></td>';
				}

				// ユーザフォルダの場合は編集可能
				if (node.f_folder == MTTYPE_F_FOLDER_USER.type_id) {
					html_source += '<td colspan="30" class="editable">';
				} else {
					html_source += '<td colspan="30">';
				}

				// 配下にフォルダがある場合はエキスパンダを追加
				if (node.child != null && node.child.length > 0) {
					// 初期値Closed対応 #20150107
					if (is_closed == 0) {
						html_source += '<span class="treeClose ca_expand"></span>';
					} else {
						html_source += '<span class="treeOpen ca_expand"></span>';
					}
				}
				// ユーザフォルダの場合は編集可能
				if (this.f_admin && node.f_folder == MTTYPE_F_FOLDER_USER.type_id) {
					html_source += '<span class="data">' + node.anamenunode_name + '</span>';
					html_source += '<span class="btn-delete flright"></span>';
					html_source += '<span class="edit mrgr20">編集</span>';
					html_source += '<input type="text" x-data-limit="len:32" placeholder="" class="form-control ca_edit dispn">';
				} else {
					html_source += node.anamenunode_name;
				}

				html_source += '</td></tr>';

				// メニュー項目、カタログ取得用のハッシュリストを作成
				this.anamenu_item_hash[node.anamenunode_id] = node.item;
				this.anamenu_catalog_hash[node.anamenunode_id] = node.catalog;

				if (node.child != null && node.child.length > 0) {
					html_source += this.makeNode(node.child, level+1, node.anamenunode_id, menu_id, is_closed);
				}
			}

			return html_source;
		},

		/**
		 * ノード押下（要素テーブル）
		 */
		_onAnaTblTrClick: function(e) {
			this.validator.clear();

			var $tr = $(e.target).closest('tr');
			$('#ca_ana_tbl tr').removeClass('selected');
			$tr.addClass('selected');

			// メニュー情報をストレージに保存しておく
			clcom.setMenuStore({
				anamenu_item_hash: this.anamenu_item_hash,
				anamenu_catalog_hash: this.anamenu_catalog_hash,
				ca_tbl: $('#ca_tbl').html(),
				ca_ana_tbl: $('#ca_ana_tbl').html(),
				f_admin: this.f_admin
			});

			var func_code = $tr.attr('func-code');

			var args = {
				homeUrl: window.location.href,	// MD 追加。「＜」ボタンのホーム設定を本メニューへと向けさせる。
				func_id : $tr.attr('func-id'),
				func_code : func_code,
				f_anakind : $tr.attr('f-anakind'),
				anamenuitem_name: $tr.find('td').html()
			};

			// カタログor機能によって遷移の方法を変える
			if ($tr.hasClass('ca_catalog')) {
				args.catalog_id = $tr.attr('catalog-id');
				args.catalog_name = args.anamenuitem_name;
			}

			var url = "";
			// 直接実行対応 #20150516
			args.directExec = null;
			var $td = $(e.target).closest('td');
			if ($td.hasClass('ca_catalog_sch')) {
				args.is_upd = Number($tr.attr('is_upd'));
				args.ope_mode = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
				url = clcom.appRoot + '/AMGA/CACTV0050/CACTV0050.html';
			} else {
				if ($td.hasClass('ca_catalog_xls')) {
					args.directExec = "xls";
				}
				if ($td.hasClass('ca_catalog_csv')) {
					args.directExec = "csv";
				}

				url = clcom.appRoot + '/AMGA/' + func_code + '/' + func_code + '.html';
			}

			clcom.pushPage(url, args, null, null, true);
		},

		/**
		 * 履歴ノード押下（要素テーブル）
		 */
		_onAnaTblTrHistClick: function(e){
			this.validator.clear();

			var $tr = $(e.target).closest('tr');
			$('#ca_ana_tbl tr').removeClass('selected');
			$tr.addClass('selected');

			var histIdx = $tr.attr('hist-idx');
			if(_.isUndefined(histIdx)){
				return;
			}
			var histItem = this.hist_item_hash[histIdx];
			var func_code = this.hist_item_hash.func_code;

			// メニュー情報をストレージに保存しておく
			clcom.setMenuStore({
				anamenu_item_hash: this.anamenu_item_hash,
				anamenu_catalog_hash: this.anamenu_catalog_hash,
				ca_tbl: $('#ca_tbl').html(),
				ca_ana_tbl: '',				// 履歴復元時、右側ペインは再構築するので省く。
				f_admin: this.f_admin,
				// 履歴パート
				hist: {
					func_code: func_code,
					tm: histItem.lru_tm
				}
			});

			var args = _.extend({
				homeUrl: window.location.href,	// MD 追加。「＜」ボタンのホーム設定を本メニューへと向けさせる。
				func_code: func_code
			}, histItem);

			var url = clcom.appRoot + '/AMGA/' + func_code + '/' + func_code + '.html';
			clcom.pushPage(url, args, null, null, true);
		},

		/**
		 * ノード押下
		 */
		_onTblTrClick: function(e) {
			var $target = $(e.target);
			if ($target.hasClass('ca_expand') || $target.hasClass('btn-delete')) {
				// エキスパンダクリック時、削除ボタン押下時はなにもしない
				return;
			}
			var $tr = $target.closest('tr');
			if ($tr.hasClass('ca_anamenu')) {
				// メニューにはなにもしない
				$('#ca_tbl tr').removeClass('selected');
				$tr.addClass('selected');
				// 要素テーブルを空にする
				$('#ca_ana_tbl').empty();
				return;
			}

			this.validator.clear();

			if($tr.data('hist_func_code')){
				// 履歴のメニュー表示
				this.showHistTbl(e);
			}else{
				// 通常のメニュー表示
				this.showAnaTbl(e);
			}
		},

		/**
		 * 履歴メニューアイテム表示
		 */
		showHistTbl: function(e){
			var $tr = $(e.target).closest('tr');
			if($tr.hasClass('selected')){
				// 既に選択されている場合はなにもしない
			}else{
				$('#ca_tbl tr').removeClass('selected');
				$tr.addClass('selected');

				var funcCode = $tr.data('hist_func_code');
				this.buildHIstTbl(funcCode);
			}
		},
		// 右側テーブルに履歴アイテムを表示する
		buildHIstTbl: function(funcCode, selectedTm){
			var today = new Date();
			var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);
			var tmLabel = function(tm) {
				var labels = [];
				var dt = new Date(tm);
				// 年月日ラベル
				if(dt.getFullYear() === today.getFullYear()
						&& dt.getMonth() === today.getMonth()
						&& dt.getDate() === today.getDate()){
					labels.push('今日');
				}else if(dt.getFullYear() === yesterday.getFullYear()
						&& dt.getMonth() === yesterday.getMonth()
						&& dt.getDate() === yesterday.getDate()){
					labels.push('昨日');
				}else{
					labels.push(dt.getFullYear() + '年' + (dt.getMonth()+1) + '月' + dt.getDate() + '日');
				}
				// 時分ラベル
				labels.push(dt.getHours() + ':' + ('0' + dt.getMinutes()).slice(-2));
				return labels.join(' ');
			}

			// 右側メニューアイテム構築
			var html_source = '';
			var histItems = clcom.amanHistory.getConds(funcCode);
			for(var i = 0; i < histItems.length; i++){
				var node = histItems[i];
				html_source += '<tr class="ca_cursor ca_hist"';
				html_source += '" hist-idx="' + i;
				html_source += '" hist-tm="' + node.lru_tm
				html_source += '">';
				html_source += '<td class="lru_tm">' + tmLabel(node.lru_tm) + '</td>'
				html_source += '<td>' + node.anamenuitem_name + '</td>';
				html_source += '</tr>';
			}
			histItems.func_code = funcCode;
			this.hist_item_hash = histItems;

			var $ana_tbl = this.$('#ca_ana_tbl');
			$ana_tbl.html(html_source);
			clutil.initUIelement($ana_tbl);

			if(!_.isUndefined(selectedTm)){
				// 当該タイムスタンプのアイテムを selected な表示にする。
				$ana_tbl.find('tr[hist-tm=' + selectedTm + ']').addClass('selected');
			}
		},

		/**
		 * メニューアイテム表示
		 */
		showAnaTbl: function(e) {
			var tr = $(e.target).closest('tr');

			if ($(tr).hasClass('selected')) {
				// 既に選択されている場合はなにもしない
			} else {
				$('#ca_tbl tr').removeClass('selected');
				$(tr).addClass('selected');

				var id = tr.get(0).id;

				// 要素テーブルを空にする
				$('#ca_ana_tbl').empty();

				var html_source = '';

				// メニュー項目を取得
				var list = this.anamenu_item_hash[id];
				if (list != null && list.length > 0) {
					for (var i = 0; i < list.length; i++) {
						var node = list[i];

						html_source += '<tr class="ca_cursor ca_anamenuitem" func-id="' + node.func_id;
						html_source += '" func-code="' + node.func_code;
						html_source += '" f-anakind="' + node.f_anakind;
						html_source += '">';
						html_source += '<td>' + node.anamenuitem_name + '</td>';
						html_source += '</tr>';
					}
				}

				// カタログリストを取得
				var list = this.anamenu_catalog_hash[id];
				if (list != null && list.length > 0) {
					for (var i = 0; i < list.length; i++) {
						var node = list[i];

						html_source += '<tr class="ca_cursor ca_anamenuitem ca_catalog" catalog-id="' + node.catalog_id;
						html_source += '" func-id="' + node.func_id;
						html_source += '" func-code="' + node.func_code;
						html_source += '" is_upd="' + node.is_upd;
						html_source += '" f_scheduled="' + node.f_scheduled;
						html_source += '" f-anakind="' + node.f_anakind + '">';
						if( node.catalog_id >= 10 ){
							// 直接実行対応 #20150516
							html_source += '<td width=24><nobr><span class="edit">' + "開く" + '</span></nobr></td>';
							html_source += '<td width=24 style="border-left: 0px;" class="ca_catalog_xls"><nobr><span class="edit">' + "XLS" + '</span></nobr></td>';
							html_source += '<td width=24 style="border-left: 0px;" class="ca_catalog_csv"><nobr><span class="edit">' + "CSV" + '</span></nobr></td>';
							if (this.savedReq.cond.main_menu_id == 1) {
								// 分析メニュー
								html_source += '<td width=24 style="border-left: 0px;" class="ca_catalog_sch"><nobr><span class="edit">' + "スケジュール" + '</span></nobr></td>';
							} else {
								// 分析メニュー（ゾーンAJA向け）
							}
						}
						html_source += '<td>' + node.catalog_name + '</td>';
						if (this.savedReq.cond.main_menu_id == 1 && node.f_scheduled) {
							// 分析メニューかつスケジュールが登録済
							html_source += '<td><span class="icon-abui-time"></span></td>';
						} else {
							html_source += '<td><span></span></td>';
						}
						html_source += '</tr>';
					}
				}
				$('#ca_ana_tbl').html(html_source);

				clutil.initUIelement($('#ca_ana_tbl'));

			}
		},

		/**
		 * エキスパンダ押下
		 */
		_onExpandClick: function(e) {
			this.validator.clear();

			var $span = $(e.target);
			var treeClose = $span.hasClass('treeClose');

			var tr = $(e.target).closest('tr');
			var level = Number($(tr).attr('node-level'));
			var anamenu = tr.hasClass('ca_anamenu');
			var trlist = this.$('#ca_tbl tr');

			//var start = 0;
			for (var i = 0; i < trlist.length; i++) {
				if ((anamenu == $(trlist[i]).hasClass('ca_anamenu'))
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
		 * フォルダ削除クリック
		 */
		_onSpanDeleteClick: function(e) {
			this.validator.clear();

			// 削除するフォルダid取得
			var tr = $(e.target).closest('tr');
			var id = tr.get(0).id;
			var parent_id = $(tr).attr('parent-id');
			var menu_id = $(tr).attr('menu-id');
			var level = $(tr).attr('node-level');

			// 子供が存在する場合削除不可
			if ($(tr).find('span.ca_expand').length > 0) {
				this.validator.setErrorHeader(clmsg.ca_menu_0001);
				this.showAnaTbl(e);
				return;
			}

			// メニュー項目が存在する場合削除不可
			var list = this.anamenu_item_hash[id];
			if (list != null && list.length > 0) {
				this.validator.setErrorHeader(clmsg.ca_menu_0001);
				this.showAnaTbl(e);
				return;
			}

			// カタログリストが存在する場合削除不可
			var list = this.anamenu_catalog_hash[id];
			if (list != null && list.length > 0) {
				this.validator.setErrorHeader(clmsg.ca_menu_0001);
				this.showAnaTbl(e);
				return;
			}

			// 削除データ
			var req = {
					rtype : am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL,
					nodechg : {
						anamenu_id : menu_id,
						p_id : parent_id,
						id : id
					}
			};

			var parent_tr = $("#ca_tbl").find('tr[id=' + parent_id + '][menu-id=' + menu_id + ']');

			// メニューを更新
			this.updMenuTree(req, function(retStat) {
				if (retStat) {
					$(tr).remove();

					// 子供が存在しない場合はエキスパンダを削除する
					var child_tr = $("#ca_tbl").find('tr[parent-id=' + parent_id + '][menu-id=' + menu_id + '][node-level=' + level + ']');
					if (child_tr.length == 0) {
						$(parent_tr).find('span.ca_expand').remove();
					}

				} else {
					// なにもしない
				}
			});
		},

		/**
		 * アクティブなフォルダ名編集エディタがあれば、編集を破棄する。
		 */
		stopInputAny: function(){
			if(this.folderNameCounter == null){
				return;
			}
			if(this.folderNameCounter.options.side == 'ca_edit'){
//				this.stopInputEdit();
				// 変更されなかったら編集モード解除
				this.editFlag = false;
				this.removeNameEdit();		// ★この先で this.folderNameCounter は廃棄する
			}else{
//				this.stopInputAdd();
				this.addFlag = false;
				var tr = $("#ca_tbl").find('.pdg0').closest('tr');
				if (tr.length > 0) {
					this.removeNameEdit();	// ★この先で this.folderNameCounter は廃棄する
					$(tr).remove();
				}
			}
		},

		/**
		 * フォルダ追加クリック
		 */
		_onAddClick: function(e) {
			this.validator.clear();

			var _this = this;

			// 選択されている行のtrを取得する
			var tr = this.$('#ca_tbl').find('tr.selected');

			if (tr.length == 0) {
				// 選択されているフォルダがなければなにもしない
				return;
			}
			if(tr.hasClass('ca_hist')){
				// 履歴メニュー階層下にはフォルダを追加しない
				return;
			}
			if(tr.hasClass('ca_cannot_add_folder')){
				// ノードレベル0直下へのフォルダ追加可否設定対応 #20150107
				return;
			}
			if ($(tr).find('span.edit').length == 0) {
				if (!$(tr).hasClass('ca_anamenu')) {
					// メニューでなく、ユーザフォルダでなければなにもしない
					return;
				}
			}
//			if ($('input.ca_add').length != 0) {
//				// 追加中はなにもしない
//				return;
//			}

			var level = Number($(tr).attr('node-level')) + 1;

			var parent_id = 0;
			var menu_id = 0;
			if ($(tr).hasClass('ca_anamenu')) {
				parent_id = 0;
				menu_id = tr.get(0).id;
			} else {
				parent_id = tr.get(0).id;
				menu_id = $(tr).attr('menu-id');
			}

			var html_source = '';
			html_source += '<tr class="deletable" parent-id="' + parent_id;
			html_source += '" node-level="' + level + '" menu-id="' + menu_id + '">';
			for (var i = 0; i < level; i++) {
				html_source += '<td width="60px" class="indent"></td>';
			}
			html_source += '<td colspan="30" class="editable pdg0" colspan="30">';
			html_source += '<span class="data" style="display: none;">新規フォルダ</span>';
			html_source += '<span class="btn-delete flright" style="display: none;"></span>';
			html_source += '<span class="edit mrgr20" style="display: none;">編集</span>';
			html_source += '<input class="form-control ca_add" type="text" placeholder="" x-data-limit="len:32" ';
			html_source += 'value="新規フォルダ">';
			html_source += '</td></tr>';


			var trlist = this.$('#ca_tbl tr');
			var anamenu = tr.hasClass('ca_anamenu');
			for (var i = 0; i < trlist.length; i++) {
				if ((anamenu == $(trlist[i]).hasClass('ca_anamenu'))
						&& (tr.get(0).id == trlist[i].id)) {
					// 押下されたノードを取得
					break;
				}
			}
			// 最終ノード選択時はレベル判定しない 2014/05/15修正
			var j = i;
			if (i == trlist.length-1) {
				$(html_source).insertAfter($(trlist[j]));
			} else {
				for (j = j+1; j < trlist.length; j++) {
					var node = trlist[j];
					var node_level = Number($(node).attr('node-level'));
					if (level >= node_level) {
						// 同レベルになったら終了
						break;
					}
				}
				$(html_source).insertBefore($(trlist[j]));
			}
			var $input = $('input.ca_add');
			this.folderNameCounter = new clutil.view.InputCounter({
				$input: $input,
				maxLength: clcom.domain.MtAnaMenuNode.name.maxLen,
				side: 'ca_add'	// フォルダ名編集 or 新規フォルダを識別するためのマーカー。
			}).render();
			this.folderNameCounter.showCounter();
			$input.focus();

//			$input.blur(function(e){
//				// 新規の時のみのイベント
//				if ($(e.target).hasClass('ca_add')) {
//					_this.inputAdd(e);
//				}
//			});
		},

		/**
		 * フォルダ追加inputフォーカスアウト
		 */
		_onInputAddKeydown: function(e) {
			var key = e.which ? e.which : e.keyCode;

			if (key == 13 || key == 9) {
				// エンター、タブが押下されたら実行
				this.inputAdd(e);
			}
		},

		/**
		 * フォルダ追加処理
		 */
		inputAdd: function(e) {
			if (this.addFlag) {
				return;
			}

			this.addFlag = true;

			// 入力長チェック
			if(this.folderNameCounter && this.folderNameCounter.getCounterState() != 'normal'){
				// アラートメッセージは既に表示中のはず。
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				_.defer(function(input){
					input.focus();
					this.addFlag = true;
				}, e.target);
				return;
			}

			// フォルダ名を取得
			var $input = $('input.ca_add');
			var afterName = $input.val();

			// フォルダのparent_idを取得
			var tr = $("#ca_tbl").find('.pdg0').closest('tr');
			if (tr.length == 0) {
				this.addFlag = false;
				return;
			}
			var parent_id = $(tr).attr('parent-id');
			var menu_id = $(tr).attr('menu-id');

			var parent_tr = $("#ca_tbl").find('tr[id=' + parent_id + '][menu-id=' + menu_id + ']');

			if(clutil.chkStr(afterName)) {
				// イベントリセット
				e.preventDefault();

				// spanを変更後の値に書き換える
				var span = $input.closest('td.editable').find('span.data');
				$(span).html(afterName);

				// 新規データ
				var req = {
						rtype : am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
						nodechg : {
							anamenu_id : menu_id,
							p_id : parent_id,
							name : afterName
						}
				};

				var _this = this;
				// メニューを更新
				this.updMenuTree(req, function(retStat, id){
					if (retStat) {
						// セルのクラスを変更
						$input.removeClass('ca_add');
						$input.addClass('ca_edit');
						// idを挿入
						tr.get(0).id = id;
						// セルの編集モード解除
						_this.removeNameEdit({delayFolderNameCounterDestroy: true});
						// 親にエキスパンダを追加する
						if ($(parent_tr).find('span.ca_expand').length == 0) {
							var span_data = $(parent_tr).find('span.data');
							$('<span class="treeClose ca_expand"></span>').insertBefore($(span_data));
						}
					} else {
						// エラーの場合は削除
						_this.removeNameEdit({delayFolderNameCounterDestroy: true});
						$(tr).remove();
					}
					_this.addFlag = false;
				});
			} else {
				// 空白の場合は削除
				_this.removeNameEdit({delayFolderNameCounterDestroy: true});
				$(tr).remove();
				this.addFlag = false;
			}
		},

		/**
		 * フォルダ編集クリック
		 */
		_onSpanEditClick: function(e) {
			this.validator.clear();

			var _this = this;

			var tr = $(e.target).closest('tr');

			// 編集用のinputを表示する
			var $input = $(tr).find('input');
			var beforeName = $(tr).find('.data').text();
			$input.val(beforeName);
			$(e.target).parent().find('span').hide();
			$(e.target).parent().addClass('pdg0');
			$input.show();
			this.folderNameCounter = new clutil.view.InputCounter({
				$input: $input,
				maxLength: clcom.domain.MtAnaMenuNode.name.maxLen,
				side: 'ca_edit'	// フォルダ名編集 or 新規フォルダを識別するためのマーカー。
			}).render();
			this.folderNameCounter.showCounter();

			$input.focus();
		},

		/**
		 * フォルダ編集inputフォーカスアウト
		 */
		_onInputEditKeydown: function(e) {
			var key = e.which ? e.which : e.keyCode;

			if (key == 13 || key == 9) {
				// エンター、タブが押下されたら実行
				var ret = this.inputEdit(e);
				if(ret === false){
					e.preventDefault();
					return false;
				}
			}
		},

		/**
		 * フォルダ編集処理
		 */
		inputEdit: function(e) {
			if (this.editFlag) {
				return;
			}

			this.editFlag = true;

			// 入力長チェック
			if(this.folderNameCounter && this.folderNameCounter.getCounterState() != 'normal'){
				// アラートメッセージは既に表示中のはず。
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				var $input = $(e.target);
				var inputVal = $input.val();
				var counterView = this.folderNameCounter;
				_.defer(function(){
					$input.focus().val(inputVal).select();
					counterView.setCount();
					this.editFlag = false;
				});
				return false;
			}

			// 変更前後のフォルダ名を取得
			var afterName = $("#ca_tbl").find('td.pdg0').find('input').val();

			// 変更するフォルダid取得
			var tr = $("#ca_tbl").find('.pdg0').closest('tr');
			if (tr.length == 0) {
				this.editFlag = false;
				return;
			}
			var id = tr.get(0).id;
			var parent_id = $(tr).attr('parent-id');
			var menu_id = $(tr).attr('menu-id');
			var beforeName = $(tr).find('.data').text();

			if(afterName != beforeName) {
				if(clutil.chkStr(afterName)) {
					// イベントリセット
					e.preventDefault();

					// spanを変更後の値に書き換える
					var span = $(tr).find('span.data');
					$(span).html(afterName);

					// 編集データ
					var req = {
							rtype : am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
							nodechg : {
								anamenu_id : menu_id,
								p_id : parent_id,
								id : id,
								name : afterName
							}
					};

					var _this = this;
					// メニューを更新
					this.updMenuTree(req, function(retStat){
						// セルの編集モード解除
						_this.removeNameEdit({delayFolderNameCounterDestroy: true});

						if (!retStat) {
							// もとに戻す
							$(span).html(beforeName);
						}
						_this.editFlag = false;
					});
				} else {
					// 変更後のリスト名に文字がなかったら編集モード解除
					this.removeNameEdit({delayFolderNameCounterDestroy: true});
					this.editFlag = false;
				}
			} else {
				// 変更されなかったら編集モード解除
				this.removeNameEdit({delayFolderNameCounterDestroy: true});
				this.editFlag = false;
			}
		},

		/**
		 * フォルダ名編集モード解除
		 */
		removeNameEdit: function(opt) {
			if(this.folderNameCounter){
				if(opt && opt.delayFolderNameCounterDestroy){
					_.defer(function(counter){
						counter.destroy();
					}, this.folderNameCounter);
				}else{
					this.folderNameCounter.destroy();
				}
				this.folderNameCounter = null;
			}

			$('.editable').find('input').hide();
			$('.editable').removeClass('pdg0');
			$('.editable').find('span').show();
		},

		/**
		 * 更新処理
		 */
		updMenuTree: function(req, callback) {
			var uri = 'gsan_cm_menu_upd';
			clutil.postAnaJSON(uri, req, _.bind(function(data, dataType) {
				var _this = this;
				var retStat = false;
				var id = 0;

				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					id = data.id;
					retStat = true;
				} else {
					retStat = false;
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}

				if (callback != null) {
					callback(retStat, id);
				}
			}, this));
		},

		/**
		 * 更新ボタン click
		 */
		_onReloadClick: function() {
			// ストレージのメニュー情報を削除
			clcom.removeMenuStore();

			// メニュー取得
			this.getMenuTree();
		},

		/**
		 * 顧客分析メニュークリック
		 */
		_onCustMenuClick: function() {
			micaosUtil.openCustAnaMenu();
		}
	});

	listView = new ListView();
	listView.render();

	var initListView = function() {
		//////////////////////////////////////////////
		// ヘッダー部品
		headerView = new HeaderView();
		headerView.render(function(){

			var menustore = clcom.getMenuStore();

			if((clcom.srcId == null && clcom.dstId == null)|| menustore == null){
				clcom.removeMenuStore();
				// メニュー取得
				listView.getMenuTree();
			} else if(menustore.catalog_upd) {
				// カタログ更新されている場合フラグを下げて
				menustore.catalog_upd = false;
				// メニュー取得
				listView.getMenuTree();
			} else {
				// 追加、編集フラグ
				listView.addFlag = false;
				listView.editFlag = false;
				// メニュー情報をストレージから取得する
				listView.anamenu_item_hash = menustore.anamenu_item_hash;
				listView.anamenu_catalog_hash = menustore.anamenu_catalog_hash;
				$('#ca_tbl').html(menustore.ca_tbl);
				$('#ca_ana_tbl').html(menustore.ca_ana_tbl);
				if(menustore.hist){
					// 履歴リストを再構築する
					listView.buildHIstTbl(menustore.hist.func_code, menustore.hist.tm);
				}
				// システム管理者
				listView.f_admin = menustore.f_admin;

				// 要素押下時のhoverクラスがついてしまっているので削除
				$('#ca_ana_tbl').find('td.hover').removeClass('hover');

				clutil.initUIelement($('#ca_tbl'));

				// メニュー取得（管理者権限が変わっていないか確認する）
				listView.getMenuTree(listView.f_admin);
			}
		});
		//////////////////////////////////////////////
	};

	// キャッシュ情報を更新するため、ストレージをクリアする。（メニュー画面だけ特別）
	clcom.clearStorage();

	// 現URLを取得してreqを調整 #20151018
	var cururl = location.href;
	var myfuncid = null;
	var myarray = cururl.split("/");
	if( myarray != null && myarray.length > 0 ){
		var mylast = myarray[myarray.length-1];
		if( mylast != null ){
			var myarray2 = mylast.split(".");
			if( myarray2 != null && myarray2.length > 0 ){
				myfuncid = myarray2[0];
			}
		}
	}
	var main_menu_id = 1;
	if( myfuncid != null && myfuncid == "AMGAV0120" ){
		// ゾーンAJA向け分析
		main_menu_id = 3;
	}

	////var d = clutil.getAnaIniJSON();
	var d = clutil.getAnaIniJSON(main_menu_id);
	d.done(function(){
		// 画面の初期化
		initListView();

		// スクロール表示の微調整
		ch_height();
		var sc = $('html').css('overflow-y');
		if(sc == 'scroll'){
			$('html').css('overflow-y', 'auto');
			_.defer(function(sc){
				$('html').css('overflow-y', sc);
			}, sc);
		}
	});
	d.fail(function(){
//		clutil.gohome(clcom.urlRoot + '/err/error.html', true);
		clcom.gohome(clcom.urlRoot + '/err/error.html');
	});

});
