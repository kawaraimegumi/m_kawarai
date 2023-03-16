$(function(){

	var AMCMV0090Const = {
		MIDDLENAME_NONE : "（中分類なし）",
	};

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,

		events: {
			'click #ca_table_tbody_large tr'	:	'_onLargeRowClick',
			'click #ca_table_tbody_middle tr'	:	'_onMiddleRowClick',
			'click #ca_table_tbody_view tr'		:	'_onViewRowClick',
			'click #ca_table_tfoot_large tr'	:	'_onAddLargeRowClick',
			'click #ca_table_tfoot_middle tr'	:	'_onAddMiddleRowClick',
			'click #ca_table_tfoot_view tr'		:	'_onAddViewRowClick',
			'click #ca_large_up'				:	'_onLargeUpClick',
			'click #ca_large_down'				:	'_onLargeDownClick',
			'click #ca_middle_up'				:	'_onMiddleUpClick',
			'click #ca_middle_down'				:	'_onMiddleDownClick',
			'click #ca_view_up'					:	'_onViewUpClick',
			'click #ca_view_down'				:	'_onViewDownClick',
//			'change input[name="ca_viewID"]'	:	'_onChangeViewID'
		},

		initialize: function(opt){

			_.bindAll(this);

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: 'メニュー',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,

					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,

					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,

					buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// アプリ個別の View や部品をインスタンス化するとか・・・

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// それ以外は、Submit と、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// Fieldlimit
			clutil.cltxtFieldLimit($("#ca_menuName"));

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			// 保存データ
			this.menuNodeID = 0;
			this.largeMenuGrpList = [];
			this.middleMenuGrpList = [];
			this.viewList = [];
			this.submit = false;

			return this;
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){
//			var _this = this;

			this.mdBaseView.initUIElement();

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				this.tableDisabled(this.$("#ca_table_middle"), true);
				this.tableDisabled(this.$("#ca_table_view"), true);
				clutil.inputReadonly(this.$("#ca_middle_up"));
				clutil.inputReadonly(this.$("#ca_middle_down"));
				clutil.inputReadonly(this.$("#ca_view_up"));
				clutil.inputReadonly(this.$("#ca_view_down"));
				clutil.setFocus(this.$("#ca_menuName"));
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		/**
		 * Submit 応答のイベントを受ける
		 */
		_onMDSubmitCompleted: function(args, e){
			console.log("SubmitCompleted status:" + args.status);
			this.submit = true;

			var data = args.data;

			switch(args.status){
			case 'DONE':		// 確定済
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				document.location = '#';
				this.setReadOnlyAllItems();
				break;

			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				this.submit = false;
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		/**
		 * GET 応答のイベントを受ける
		 */
		_onMDGetCompleted: function(args, e){
			console.log("GetCompleted status:" + args.status);
			this.submit = true;

			var data = args.data;

			switch(args.status){
			case 'OK':
				this.submit = false;
				// args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				this.data2view(data);

				clutil.viewRemoveReadonly(this.$el);
				var $tbody = this.$('#ca_table_large');
				clutil.viewRemoveReadonly($tbody);
				this.tableDisabled($tbody, false);

				// イベント追加
				this.addEvent();

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
					// 照会モード・削除モードは、Edit ブロッキングしておく。
					this.setReadOnlyAllItems();
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
					this.tableDisabled(this.$("#ca_table_middle"), true);
					this.tableDisabled(this.$("#ca_table_view"), true);
					clutil.inputReadonly(this.$("#ca_middle_up"));
					clutil.inputReadonly(this.$("#ca_middle_down"));
					clutil.setFocus($("#ca_menuName"));
					break;
				default:
					clutil.inputReadonly($("#ca_menuName"));
					this.tableDisabled(this.$("#ca_table_middle"), true);
					this.tableDisabled(this.$("#ca_table_view"), true);
					clutil.inputReadonly(this.$("#ca_middle_up"));
					clutil.inputReadonly(this.$("#ca_middle_down"));
					clutil.inputReadonly(this.$("#ca_view_up"));
					clutil.inputReadonly(this.$("#ca_view_down"));
					var $focusElem = $("#ca_table_large").find("input[type='text']:first");
					clutil.setFocus($focusElem);
					break;
				}
				break;

			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化する
				this.setReadOnlyAllItems();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		/**
		 * 仮のメニューノードＩＤを自動採番
		 */
		getMenuNodeID: function() {
			return --this.menuNodeID;
		},

		/**
		 * データを表示
		 */
		data2view: function(data) {

			// テーブル初期化
			$("#ca_table_tbody_large").empty();
			$("#ca_table_tbody_middle").empty();
			$("#ca_table_tbody_view").empty();

			var menuRec = data.AMCMV0090GetRsp.menuRec;
			this.largeMenuGrpList = data.AMCMV0090GetRsp.largeMenuGrpList;
			this.middleMenuGrpList = data.AMCMV0090GetRsp.middleMenuGrpList;
			this.viewList = data.AMCMV0090GetRsp.viewList;

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				// 複製の場合、メニューＩＤを０にし、現在のＩＤをマイナスにしてin～に設定し、０にする
				menuRec.menuID = 0;
				menuRec.menuName = "";
				$.each(this.largeMenuGrpList, function() {
					this.menuID = 0;
					this.inMenuNodeID = - this.menuNodeID;
					this.menuNodeID = 0;
				});
				$.each(this.middleMenuGrpList, function() {
					this.menuID = 0;
					this.inMenuNodeID = - this.menuNodeID;
					this.inParentMenuNodeID = - this.parentMenuNodeID;
					this.menuNodeID = 0;
					this.parentMenuNodeID = 0;
				});
				$.each(this.viewList, function() {
					this.inMenuNodeID = - this.menuNodeID;
					this.inParentMenuNodeID = - this.parentMenuNodeID;
					this.menuNodeID = 0;
					this.parentMenuNodeID = 0;
				});
			}

			// テキストボックス系反映
			clutil.data2view(this.$('#ca_base_form'), menuRec);
			// テーブルに設定し、値を表示
			this.makeTable(this.largeMenuGrpList, $("#ca_large_template"), $("#ca_table_tbody_large"));

		},

		/**
		 * テーブルに設定し、値を表示
		 * @param list
		 */
		makeTable: function(list, $template, $tbody, isAuto) {

			// テーブル初期化
			$tbody.empty();

//			var no = 1;	//表示番号セット
			$.each(list, function() {
//				this.seqNo = no++;

				var tr = _.template($template.html(), this);
				$tbody.append(tr);
				if (isAuto) {
					var $input = $tbody.find("tr:last input[type='text']");
					var view = clutil.clfunccode({
						el:$input,
						itemTemplate: '<%- it.name %>',
					});
					view.setValue({id: this.viewID, code: "", name: this.viewName});
				}
				// 中分類なしは編集不可
				var $name = $tbody.find("tr:last input[name='ca_menuNodeName']");
				if ($name.val() == AMCMV0090Const.MIDDLENAME_NONE) {
					$tbody.find("tr:last").addClass("not-editable");
					$tbody.find("tr:last span.btn-delete").removeClass("btn-delete");
					$tbody.find("tr:last td:eq(6)").removeClass("editable");
					clutil.inputReadonly($name);
				}

			});

		},

		/**
		 * 画面を編集不可にする
		 */
		setReadOnlyAllItems: function(){
			clutil.viewReadonly(this.$el);
			this.tableDisabled(this.$("#ca_table_large"), true);
			this.tableDisabled(this.$("#ca_table_middle"), true);
			this.tableDisabled(this.$("#ca_table_view"), true);
		},

		tableDisabled: function($table, isReadonly, isMiddle) {
			$table.find('input[type="text"]').attr("readonly", isReadonly);
			if (isReadonly) {
				$table.find('tbody span.btn-delete').hide();
				$table.find('tbody span.btn-add').hide();
				$table.find('tfoot').hide();
			} else {
				$table.find('tbody span.btn-delete').show();
				$table.find('tbody span.btn-add').show();
				$table.find('tfoot').show();
				if (isMiddle) {
					// 中分類なしは編集不可
					$.each($table.find("tr input[name='ca_menuNodeName']"), function() {
						if ($(this).val() == AMCMV0090Const.MIDDLENAME_NONE) {
							clutil.inputReadonly($(this));
						}
					});
				}
			}
		},

		/**
		 * 中分類リスト削除
		 */
		delMiddleMenuGrpList: function (parentMenuNodeID, inParentMenuNodeID) {
			var _this = this;
			var tmplist = $.extend(true, [], this.middleMenuGrpList);
			this.middleMenuGrpList = [];
			$.each(tmplist, function(i) {
				if (parentMenuNodeID == 0) {
					if (inParentMenuNodeID == this.inParentMenuNodeID) {
						// 紐付く画面名リスト削除
						_this.delViewList(this.menuNodeID, this.inMenuNodeID);
						return true;
					}
				} else {
					if (parentMenuNodeID == this.parentMenuNodeID) {
						// 紐付く画面名リスト削除
						_this.delViewList(this.menuNodeID, this.inMenuNodeID);
						return true;
					}
				}
				// 該当しない中分類を追加
				_this.middleMenuGrpList.push(this);
			});

			// クリア
			$("#ca_table_tbody_middle").empty();
		},

		/**
		 * 画面名リスト削除
		 */
		delViewList: function (parentMenuNodeID, inParentMenuNodeID) {
			var _this = this;
			var tmplist = $.extend(true, [], this.viewList);
			this.viewList = [];
			$.each(tmplist, function(i) {
				if (parentMenuNodeID == 0) {
					if (inParentMenuNodeID == this.inParentMenuNodeID) {
						return true;
					}
				} else {
					if (parentMenuNodeID == this.parentMenuNodeID) {
						return true;
					}
				}
				// 該当しない画面名を追加
				_this.viewList.push(this);
			});
//			console.log(this.viewList);

			// クリア
			$("#ca_table_tbody_view").empty();
		},

		/**
		 * 大分類削除
		 */
		delLargeMenuGrp: function ($tgt_tr) {
			var _this = this;

			// 現在表示されている中分類リスト
			var mList = clutil.tableview2data(this.$('#ca_table_tbody_middle').children());
//			// ソート
//			mList.sort(function(a, b) {
//				return (Number(a.seqNo) - Number(b.seqNo));
//			});
			var seqNo = 1;
			$.each(mList, function(i) {
				if (Number(this.seqNo) != -1) {
					this.seqNo = seqNo;
					seqNo++;
				}
//				this.seqNo = i + 1;
				// 中分類保存
				_this.saveMiddleMenuGrpList(this);
			});
			// 現在表示されている画面名リスト
			var vList = clutil.tableview2data(this.$('#ca_table_tbody_view').children());
//			// ソート
//			vList.sort(function(a, b) {
//				return (Number(a.seqNo) - Number(b.seqNo));
//			});
			$.each(vList, function(i) {
				this.seqNo = i + 1;
				// 画面名保存
				_this.saveViewList(this);
			});

			var menuNodeID = Number($tgt_tr.children("td:eq(1)").text());
			$.each(this.largeMenuGrpList, function(i) {
				if (menuNodeID == 0) {
					var inMenuNodeID = Number($tgt_tr.children("td:eq(4)").text());
					if (inMenuNodeID == this.inMenuNodeID) {
						// 紐付く中分類リスト削除
						_this.delMiddleMenuGrpList(this.menuNodeID, this.inMenuNodeID);
						// 大分類削除
						_this.largeMenuGrpList.splice(i, 1);
						return false;
					}
				} else {
					if (menuNodeID == this.menuNodeID) {
						// 紐付く中分類リスト削除
						_this.delMiddleMenuGrpList(this.menuNodeID, this.inMenuNodeID);
						// 大分類削除
						_this.largeMenuGrpList.splice(i, 1);
						return false;
					}
				}
			});
		},

		/**
		 * 中分類削除
		 */
		delMiddleMenuGrp: function ($tgt_tr) {
			var _this = this;

			// 現在表示されている画面名リスト
			var vList = clutil.tableview2data(this.$('#ca_table_tbody_view').children());
//			// ソート
//			vList.sort(function(a, b) {
//				return (Number(a.seqNo) - Number(b.seqNo));
//			});
			$.each(vList, function(i) {
				this.seqNo = i + 1;
				// 画面名保存
				_this.saveViewList(this);
			});

			var menuNodeID = Number($tgt_tr.children("td:eq(1)").text());
			$.each(this.middleMenuGrpList, function(i) {
				if (menuNodeID == 0) {
					var inMenuNodeID = Number($tgt_tr.children("td:eq(4)").text());
					if (inMenuNodeID == this.inMenuNodeID) {
						// 紐付く画面名リスト削除
						_this.delViewList(this.menuNodeID, this.inMenuNodeID);
						// 中分類削除
						_this.middleMenuGrpList.splice(i, 1);
						return false;
					}
				} else {
					if (menuNodeID == this.menuNodeID) {
						// 紐付く画面名リスト削除
						_this.delViewList(this.menuNodeID, this.inMenuNodeID);
						// 中分類削除
						_this.middleMenuGrpList.splice(i, 1);
						return false;
					}
				}
			});
		},

		/**
		 * 画面名削除
		 */
		delView: function ($tgt_tr) {
			var _this = this;
			var menuNodeID = Number($tgt_tr.children("td:eq(1)").text());
			$.each(this.viewList, function(i) {
				if (menuNodeID == 0) {
					var inMenuNodeID = Number($tgt_tr.children("td:eq(3)").text());
					if (inMenuNodeID == this.inMenuNodeID) {
						// 画面名削除
						_this.viewList.splice(i, 1);
						return false;
					}
				} else {
					if (menuNodeID == this.menuNodeID) {
						// 画面名削除
						_this.viewList.splice(i, 1);
						return false;
					}
				}
			});
		},

		/**
		 * 大分類追加
		 */
		addLargeMenuGrp: function($template, $tbody, $table) {
			var _this = this;

			var seqNo = $tbody.find("tr:last span[name='ca_seqNo']").text();

			// 空データ挿入
			var add_tmp = {
				menuID: Number($("#ca_menuID").val()),
				menuNodeID: 0,
				menuNodeName: "",
				parentMenuNodeID: 0,
				seqNo: seqNo + 1,
				inMenuNodeID: this.getMenuNodeID(),
			};
			var tr = _.template($template.html(), add_tmp);
			$tbody.append(tr);
//			this.largeMenuGrpList.push(add_tmp);

			/*
			 * 行削除
			 */
			$tbody.find("tr:last span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).closest('tr');
				// 保存している大分類削除
				_this.delLargeMenuGrp($tgt_tr);
				$tgt_tr.remove();
			});
			/*
			 * 名称変更
			 */
			$("#ca_table_tbody_large").find("tr:last input[type='text']").change(function(e) {
				// 大分類保存
				var menuNodeID = Number($(this).closest('tr').children("td:eq(1)").text());
				var inMenuNodeID = Number($(this).closest('tr').children("td:eq(4)").text());
				var menuNodeName = $(this).val();
				_this.saveLargeMenuGrp(menuNodeID, inMenuNodeID, menuNodeName);
//				console.log(_this.largeMenuGrpList);
			});

			clutil.initUIelement($table);
		},

		/**
		 * 中分類追加
		 */
		addMiddleMenuGrp: function($template, $tbody, $table, largeMenuGrpID, list) {
			var _this = this;

//			var seqNo = $tbody.find("tr:last span[name='ca_seqNo']").text();

			// 空データ挿入
			var parentMenuNodeID = (largeMenuGrpID) ? largeMenuGrpID : this.savePNodeID;
			var add_tmp = {
				menuID: 0,
				menuNodeID: 0,
				menuNodeName: (largeMenuGrpID) ? AMCMV0090Const.MIDDLENAME_NONE : "",
				parentMenuNodeID: (parentMenuNodeID < 0) ? 0 : parentMenuNodeID,
				seqNo: (largeMenuGrpID) ? -1 : 0,
				inMenuNodeID: this.getMenuNodeID(),
				inParentMenuNodeID: (parentMenuNodeID < 0) ? parentMenuNodeID : 0,
			};
			var tr = _.template($template.html(), add_tmp);
			$tbody.append(tr);
//			this.middleMenuGrpList.push(add_tmp);

			// 中分類なしは編集不可
			if (largeMenuGrpID) {
				list.push(add_tmp);
				$tbody.find("tr:last").addClass("not-editable");
				$tbody.find("tr:last span.btn-delete").removeClass("btn-delete");
				$tbody.find("tr:last td:eq(6)").removeClass("editable");
				var $name = $tbody.find("tr:last input[name='ca_menuNodeName']");
				clutil.inputReadonly($name);
			}

			/*
			 * 行削除
			 */
			$tbody.find("tr:last span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).closest('tr');
				// 保存している中分類削除
				_this.delMiddleMenuGrp($tgt_tr);
				$tgt_tr.remove();
			});
			/*
			 * 名称変更
			 */
			$tbody.find("tr:last input[type='text']").change(function(e) {
				var $tgt_tr = $(this).closest('tr');
				var menuNodeName = $(this).val();
				_this.saveMiddleMenuGrp($tgt_tr, menuNodeName);
//				console.log(_this.middleMenuGrpList);
			});

//			if (!largeMenuGrpID) {
//				this.doUpRow($tbody.find("tr:last input[type='text']"), $tbody);
//			}

			clutil.initUIelement($table);
		},

		/**
		 * 画面名追加
		 */
		addView: function($template, $tbody, $table) {
			var _this = this;

			var seqNo = $tbody.find("tr:last span[name='ca_seqNo']").text();
//			console.log("seqNo:" + seqNo);

			// 空データ挿入
			var add_tmp = {
				seqNo: seqNo + 1,
				viewID: 0,
				viewCode: "",
				viewName: "",
				menuNodeID: 0,
				parentMenuNodeID: (this.saveNodeID < 0) ? 0 : this.saveNodeID,
				inMenuNodeID: this.getMenuNodeID(),
				inParentMenuNodeID: (this.saveNodeID < 0) ? this.saveNodeID : 0,
			};
			var tr = _.template($template.html(), add_tmp);
			$tbody.append(tr);
//			this.viewList.push(add_tmp);

			/*
			 * 行削除
			 */
			$tbody.find("tr:last span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).closest('tr');
				// 保存している画面名削除
				_this.delView($tgt_tr);
				$tgt_tr.remove();
			});

			// 画面名autocomplete
			var $input = $tbody.find("tr:last input[type='text']");
			var view = clutil.clfunccode({
				el:$input,
				itemTemplate: '<%- it.name %>',
			});
			view.on('change', function(data) {
				if (data != null) {
//					console.log(data);
					// GET:画面名設定
					return this.setValue({id: data.id, code: "", name: data.name});
				}
			});
// ↓655行目へ処理委譲

			clutil.initUIelement($table);
		},

		// 「画面名」選択の変更イベントを捕捉
		_onChangeViewID: function(e){
			console.log(e);
			// TODO: チェンジイベントが届かない？？？
		},

		/**
		 * 行追加・削除イベント追加
		 */
		addEvent: function() {
			var _this = this;
			/*
			 * 行削除
			 */
			$("#ca_table_tbody_large span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).closest('tr');
				// 保存している大分類削除
				_this.delLargeMenuGrp($tgt_tr);
				$tgt_tr.remove();
			});
			$("#ca_table_tbody_middle span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).closest('tr');
				// 保存している中分類削除
				_this.delMiddleMenuGrp($tgt_tr);
				$tgt_tr.remove();
			});
			$("#ca_table_tbody_view span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).closest('tr');
				// 保存している画面名削除
				_this.delView($tgt_tr);
				$tgt_tr.remove();
			});
			$("#ca_table_tbody_large input[type='text']").change(function(e) {
				// 大分類保存
				var menuNodeID = Number($(this).closest('tr').children("td:eq(1)").text());
				var inMenuNodeID = Number($(this).closest('tr').children("td:eq(4)").text());
				var menuNodeName = $(this).val();
				_this.saveLargeMenuGrp(menuNodeID, inMenuNodeID, menuNodeName);
//				console.log(_this.largeMenuGrpList);
			});
			// 画面名autocomplete
			$.each($("#ca_table_tbody_view").find("tr input[type='text']"), function() {
				var view = clutil.clfunccode({
					el:this,
					itemTemplate: '<%- it.name %>',
				});
				view.on('change', function(data) {
					if (data != null) {
//						console.log(data);
						// GET:画面名設定
						return this.setValue({id: data.id, code: "", name: data.name});
					}
				});
			});
		},

		/**
		 * 大分類保存
		 */
		saveLargeMenuGrp: function (menuNodeID, inMenuNodeID, menuNodeName) {
			var found = false;
			$.each(this.largeMenuGrpList, function() {
				if (menuNodeID == 0) {	// 新規
					if (inMenuNodeID == this.inMenuNodeID) {
						this.menuNodeName = menuNodeName;
						found = true;
						return false;
					}
				} else {
					if (this.menuNodeID == menuNodeID) {
						this.menuNodeName = menuNodeName;
						found = true;
						return false;
					}
				}
			});
			if (!found) {
				var add_rec = {
					menuID: Number($("#ca_menuID").val()),
					menuNodeID: menuNodeID,
					menuNodeName: menuNodeName,
					parentMenuNodeID: 0,
					seqNo: this.largeMenuGrpList.length + 1,
					inMenuNodeID: inMenuNodeID,
				};
				this.largeMenuGrpList.push(add_rec);
			}
		},

		/**
		 * 中分類保存
		 */
		saveMiddleMenuGrp: function ($tgt, menuNodeName) {
			var found = false;
			var menuNodeID = Number($tgt.children("td:eq(1)").text());
			var pMenuNodeID = Number($tgt.children("td:eq(2)").text());
			var inMenuNodeID = Number($tgt.children("td:eq(4)").text());
			var inPMenuNodeID = Number($tgt.children("td:eq(5)").text());
			$.each(this.middleMenuGrpList, function() {
				if (menuNodeID == 0) {	// 新規
					if (inMenuNodeID == this.inMenuNodeID) {
						this.menuNodeName = menuNodeName;
						found = true;
						return false;
					}
				} else {
					if (this.menuNodeID == menuNodeID) {
						this.menuNodeName = menuNodeName;
						found = true;
						return false;
					}
				}
			});
			if (!found) {
				var add_rec = {
					menuID: Number($("#ca_menuID").val()),
					menuNodeID: menuNodeID,
					menuNodeName: menuNodeName,
					parentMenuNodeID: pMenuNodeID,
					seqNo: this.middleMenuGrpList.length + 1,
					inMenuNodeID: inMenuNodeID,
					inParentMenuNodeID: inPMenuNodeID,
				};
				this.middleMenuGrpList.push(add_rec);
			}
		},

		/**
		 * 中分類リスト保存
		 */
		saveMiddleMenuGrpList: function (updrec) {
			var found = false;
			$.each(this.middleMenuGrpList, function(i) {
				if (Number(updrec.menuNodeID) != this.menuNodeID) {
					return true;
				}
				if (Number(updrec.menuNodeID) == 0) {
					if (Number(updrec.inMenuNodeID) == this.inMenuNodeID ) {
						this.menuNodeName = updrec.menuNodeName;
						this.seqNo = Number(updrec.seqNo);
						found = true;
						return false;
					}
				} else {
					this.menuNodeName = updrec.menuNodeName;
					this.seqNo = Number(updrec.seqNo);
					found = true;
					return false;
				}
			});
			// 見つからなかったら追加
			if (!found) {
				this.middleMenuGrpList.push(updrec);
			}
		},

		/**
		 * 画面名リスト保存
		 */
		saveViewList: function (updrec) {
			var found = false;

			var data = null;
			if (updrec._view2data_viewID_cn) {
				data = _.pick(updrec._view2data_viewID_cn, 'id', 'code', 'name');
			}
			if (!data) {
				return;
			}
			$.each(this.viewList, function(i) {
				if (Number(updrec.menuNodeID) == 0) {
					if (Number(updrec.inMenuNodeID) == this.inMenuNodeID ) {
						this.seqNo = Number(updrec.seqNo);
						if (data) {
							this.viewID = data.id;
							this.viewName = data.name;
						}
						found = true;
						return false;
					}
				} else {
					if (Number(updrec.menuNodeID) == this.menuNodeID ) {
						this.seqNo = Number(updrec.seqNo);
						if (data) {
							this.viewID = data.id;
							this.viewName = data.name;
						}
						found = true;
						return false;
					}
				}
			});
			// 見つからなかったら追加
			if (!found) {
				var add_data = {
					viewID: data.id,
					viewCode: data.code,
					viewName: data.name,
					seqNo:  Number(updrec.seqNo),
					menuNodeID: Number(updrec.menuNodeID),
					parentMenuNodeID: Number(updrec.parentMenuNodeID),
					inMenuNodeID: Number(updrec.inMenuNodeID),
					inParentMenuNodeID: Number(updrec.inParentMenuNodeID),
//					_view2data_viewID_cn : {
//						id: data.id,
//						code: data.code,
//						name: data.name,
//					},
				};
				this.viewList.push(add_data);
			}
		},

		/**
		 * メニューリスト取得
		 */
		getMiddleMenuGrpList: function(largeMenuGrpID) {
			var _this = this;

			// 現在表示されている中分類リスト
			var mList = clutil.tableview2data(this.$('#ca_table_tbody_middle').children());
			var seqNo = 1;
			$.each(mList, function(i) {
				if (Number(this.seqNo) != -1) {
					this.seqNo = seqNo;
					seqNo++;
				}
//				this.seqNo = i + 1;
				// 中分類保存
				_this.saveMiddleMenuGrpList(this);
			});
			// 現在表示されている画面名リスト
			var vList = clutil.tableview2data(this.$('#ca_table_tbody_view').children());
			$.each(vList, function(i) {
				this.seqNo = i + 1;
				// 画面名保存
				_this.saveViewList(this);
			});
			// 画面名リストクリア
			this.$('#ca_table_tbody_view').empty();

			// 中分類リスト表示
			var list = [];
			var find = false;
			$.each(this.middleMenuGrpList, function() {
				if (this.parentMenuNodeID == 0) {
					if (this.inParentMenuNodeID == largeMenuGrpID) {
						if (this.menuNodeName == AMCMV0090Const.MIDDLENAME_NONE) {
							find = true;
						}
						list.push(this);
					}
				} else {
					if (this.parentMenuNodeID == largeMenuGrpID) {
						if (this.menuNodeName == AMCMV0090Const.MIDDLENAME_NONE) {
							find = true;
						}
						list.push(this);
					}
				}
			});
			// 中分類なしを追加
			if (!find) {
				this.addMiddleMenuGrp($("#ca_middle_template"), $("#ca_table_tbody_middle"), $("#ca_table_middle"), largeMenuGrpID, list);
			}
			// ソート
			list.sort(function(a, b) {
//				if (a.menuNodeName == AMCMV0090Const.MIDDLENAME_NONE) {
//					return b - a;
//				}
//				if (b.menuNodeName == AMCMV0090Const.MIDDLENAME_NONE) {
//					return a - b;
//				}
				return (Number(a.seqNo) - Number(b.seqNo));
			});
			this.makeTable(list, $("#ca_middle_template"), $("#ca_table_tbody_middle"));
//			// 中分類なしを追加
//			if (!find) {
//				this.addMiddleMenuGrp($("#ca_middle_template"), $("#ca_table_tbody_middle"), $("#ca_table_middle"), largeMenuGrpID);
//			}
			this.addEvent();
		},

		/**
		 * 画面名リスト取得
		 */
		getViewList: function(middleMenuGrpID) {
			var _this = this;

			// 現在表示されている画面名リスト
			var vList = clutil.tableview2data(this.$('#ca_table_tbody_view').children());
			$.each(vList, function(i) {
				this.seqNo = i + 1;
				// 画面名保存
				_this.saveViewList(this);
			});

			// 画面名リスト表示
			var list = [];
			$.each(this.viewList, function() {
				if (this.parentMenuNodeID == 0) {
					if (this.inParentMenuNodeID == middleMenuGrpID) {
						list.push(this);
					}
				} else {
					if (this.parentMenuNodeID == middleMenuGrpID) {
						list.push(this);
					}
				}
			});
			// ソート
			list.sort(function(a, b) {
				return (Number(a.seqNo) - Number(b.seqNo));
			});
			this.makeTable(list, $("#ca_view_template"), $("#ca_table_tbody_view"), true);
			this.addEvent();
		},

		// レコードを上に移動
		doUpRow : function(tgt, $tbody) {
			if (!tgt) {
				return this;
			}
			// 中分類なしは動かさない
			if (tgt.val() == AMCMV0090Const.MIDDLENAME_NONE) {
				return this;
			}

//			var ii = 0;
			if (tgt.length > 0) {
//				for (ii = 0; ii < tgt.length; ii++) {
//					// 親の<tr>タグオブジェクト
//					var currTrObj = tgt[ii].parentElement.parentElement;
//					// 見つけた<tr>オブジェクトの直前の<tr>オブジェクト
//					var prevTrObj = $(currTrObj).prev();
//					// 先頭行の場合は実行しない
//					if ($(prevTrObj).hasClass('not-editable')) {
//						continue;
//					}
//					if (prevTrObj) {
//						// 直前のセレクタの前に移動する
//						$(prevTrObj).before(currTrObj);
//					}
//				}
				// 親の<tr>タグオブジェクト
				var $currTrObj = $(tgt).closest('tr');
				// 見つけた<tr>オブジェクトの直前の<tr>オブジェクト
				var $prevTrObj = $currTrObj.prev();
				// 先頭行の場合は実行しない
				if ($prevTrObj.hasClass('not-editable')) {
					return this;
				}
				if ($prevTrObj) {
					// 直前のセレクタの前に移動する
					$prevTrObj.before($currTrObj);
				}
			}

//			// seqNoの再割り当てchildren();
//			var trobj = $tbody.children();		// 子要素(<tr>TAG)検索
//			$(trobj).each(function (i) {
//				var target = $(this).find("td span[name='ca_seqNo']");	// <tr>タグから No の TDタグを検索
//				$(target).text(i + 1);							// seqNoテキストの置き換え
//			});
		},

		// レコードを下に移動
		doDownRow : function(tgt, $tbody) {
			if (!tgt) {
				return this;
			}
			// 中分類なしは動かさない
			if (tgt.val() == AMCMV0090Const.MIDDLENAME_NONE) {
				return this;
			}

//			var ii = 0;
			if (tgt.length > 0) {
//				for (ii = tgt.length - 1; ii >= 0; ii--) {
//					// 親の<tr>タグオブジェクト
//					var currTrObj = tgt[ii].parentElement.parentElement;
//					// 見つけた<tr>オブジェクトの直後の<tr>オブジェクト
//					var nextTrObj = $(currTrObj).next();
////					// 最終行の場合は実行しない
////					if ($(nextTrObj).hasClass('not-editable')) {
////						continue;
////					}
//					if (nextTrObj) {
//						// 直後のセレクタ後ろに移動する
//						$(nextTrObj).after(currTrObj);
//					}
//				}
				// 親の<tr>タグオブジェクト
				var $currTrObj = $(tgt).closest('tr');
				// 見つけた<tr>オブジェクトの直前の<tr>オブジェクト
				var $nextTrObj = $currTrObj.next();
				if ($nextTrObj) {
					// 直前のセレクタの前に移動する
					$nextTrObj.after($currTrObj);
				}
			}

//			// seqNoの再割り当てchildren();
//			var trobj = $tbody.children();		// 子要素(<tr>TAG)検索
//			$(trobj).each(function (i) {
//				var target = $(this).find("td span[name='ca_seqNo']");	// <tr>タグから No の TDタグを検索
//				$(target).text(i + 1);							// seqNoテキストの置き換え
//			});
		},

		/**
		 * 行クリック時
		 */
		_onLargeRowClick: function(e){
			this.currLarge = $(e.target);
			var largeMenuGrpID = Number(this.currLarge.closest('tr').children("td:eq(1)").text());
			if (largeMenuGrpID == 0) {
				largeMenuGrpID = Number(this.currLarge.closest('tr').children("td:eq(4)").text());
			}
			// ×ボタンが押せないと無限に増えるのでリターン
			if (largeMenuGrpID == 0) {
				return;
			}
			if (this.savePNodeID == 0) {
				this.savePNodeID = largeMenuGrpID;
			}

			// 中分類表示
			this.getMiddleMenuGrpList(largeMenuGrpID);
			this.savePNodeID = largeMenuGrpID;

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL ||
					this.submit) {
				this.tableDisabled(this.$("#ca_table_middle"), true);
				clutil.inputReadonly(this.$("#ca_middle_up"));
				clutil.inputReadonly(this.$("#ca_middle_down"));
			} else {
				// 	テーブル、上下ボタンを編集可能にする
				this.tableDisabled(this.$("#ca_table_middle"), false, true);
				clutil.inputRemoveReadonly(this.$("#ca_middle_up"));
				clutil.inputRemoveReadonly(this.$("#ca_middle_down"));
			}
			this.tableDisabled(this.$("#ca_table_view"), true);
			clutil.inputReadonly(this.$("#ca_view_up"));
			clutil.inputReadonly(this.$("#ca_view_down"));
		},

		_onMiddleRowClick: function(e){
			this.currMiddle = $(e.target);
			var middleMenuGrpID = Number(this.currMiddle.closest('tr').children("td:eq(1)").text());
			if (middleMenuGrpID == 0) {
				middleMenuGrpID = Number(this.currMiddle.closest('tr').children("td:eq(4)").text());
			}
			if (this.saveNodeID == 0) {
				this.saveNodeID = middleMenuGrpID;
			}

			// 画面名表示
			this.getViewList(middleMenuGrpID);
			this.saveNodeID = middleMenuGrpID;

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL ||
					this.submit) {
				this.tableDisabled(this.$("#ca_table_view"), true);
				clutil.inputReadonly(this.$("#ca_view_up"));
				clutil.inputReadonly(this.$("#ca_view_down"));
			} else {
				// 	テーブル、上下ボタンを編集可能にする
				this.tableDisabled(this.$("#ca_table_view"), false);
				clutil.inputRemoveReadonly(this.$("#ca_view_up"));
				clutil.inputRemoveReadonly(this.$("#ca_view_down"));
			}
		},

		_onViewRowClick: function(e){
			this.currView = $(e.target);
		},

		/**
		 * 行追加押下時
		 */
		_onAddLargeRowClick: function(e) {
			this.addLargeMenuGrp($("#ca_large_template"), $("#ca_table_tbody_large"), $("#ca_table_large"));
		},

		_onAddMiddleRowClick: function(e) {
			this.addMiddleMenuGrp($("#ca_middle_template"), $("#ca_table_tbody_middle"), $("#ca_table_middle"));
		},

		_onAddViewRowClick: function(e) {
			this.addView($("#ca_view_template"), $("#ca_table_tbody_view"), $("#ca_table_view"));
		},

		/**
		 * ▲、▼ボタン押下時
		 */
		_onLargeUpClick : function(e) {
			this.doUpRow(this.currLarge, $("#ca_table_tbody_large"));
		},

		_onLargeDownClick : function(e) {
			this.doDownRow(this.currLarge, $("#ca_table_tbody_large"));
		},

		_onMiddleUpClick : function(e) {
			this.doUpRow(this.currMiddle, $("#ca_table_tbody_middle"));
		},

		_onMiddleDownClick : function(e) {
			this.doDownRow(this.currMiddle, $("#ca_table_tbody_middle"));
		},

		_onViewUpClick : function(e) {
			this.doUpRow(this.currView, $("#ca_table_tbody_view"));
		},

		_onViewDownClick : function(e) {
			this.doDownRow(this.currView, $("#ca_table_tbody_view"));
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var _this = this;

			// 現在表示されている大分類リスト
			var largeMenuGrpList = clutil.tableview2data(this.$('#ca_table_tbody_large').children());
			$.each(largeMenuGrpList, function(i) {
				this.seqNo = i + 1;
			});
			// 現在表示されている中分類リスト
			var mList = clutil.tableview2data(this.$('#ca_table_tbody_middle').children());
//			console.log(mList);
			var seqNo = 1;
			$.each(mList, function(i) {
				if (Number(this.seqNo) != -1) {
					this.seqNo = seqNo;
					seqNo++;
				}
//				this.seqNo = i + 1;
				// 中分類保存
				_this.saveMiddleMenuGrpList(this);
			});
			// 現在表示されている画面名リスト
			var vList = clutil.tableview2data(this.$('#ca_table_tbody_view').children());
//			console.log(vList);
			$.each(vList, function(i) {
				this.seqNo = i + 1;
				// 画面名保存
				_this.saveViewList(this);
			});
//			console.log(this.viewList);

			// TODO:エラーチェック
			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
				var f_error = false;

				this.validator.clear();

				if(!this.validator.valid()) {
					return null;
				}

				// 大分類配下に中分類を設定していない場合
				$("#ca_table_tbody_large").find("tr").each(function() {
					var menuNodeID = Number($(this).children("td:eq(1)").text());
					var inMenuNodeID = Number($(this).children("td:eq(4)").text());
					var find = false;
					for (var i = 0; i < _this.middleMenuGrpList.length; i++) {
						var parentMenuNodeID = _this.middleMenuGrpList[i].parentMenuNodeID;
						var inParentMenuNodeID = _this.middleMenuGrpList[i].inParentMenuNodeID;
						if (menuNodeID == parentMenuNodeID && inMenuNodeID == inParentMenuNodeID) {
//							var menuNodeName = _this.middleMenuGrpList[i].menuNodeName;
//							// 中分類なしは画面名が設定されていればＯＫ
//							if (menuNodeName == AMCMV0090Const.MIDDLENAME_NONE) {
//								var middleID = _this.middleMenuGrpList[i].menuNodeID;
//								var inMiddleID = _this.middleMenuGrpList[i].inMenuNodeID;
//								for (var j = 0; j < _this.viewList.length; j++) {
//									var viewPID = _this.viewList[j].parentMenuNodeID;
//									var viewInPID = _this.viewList[j].inParentMenuNodeID;
//									if (middleID == viewPID && inMiddleID == viewInPID) {
//										find = true;
//										break;
//									}
//								}
//							} else {
//								find = true;
//								break;
//							}
							find = true;
							break;
						}
					}
					if (!find) {
						var $tgt = $(this).find("input[name='ca_menuNodeName']");
						_this.validator.setErrorMsg($tgt, clutil.getclmsg(clmsg.ECM0014));
						f_error = true;
//						return false;
					}
				});

				if (f_error) {
					clutil.mediator.trigger("onTicker", clutil.getclmsg(clmsg.ECM0014));
					return null;
				}
//				console.log(this.middleMenuGrpList.length);
				// 中分類配下に画面を設定していない場合
				$.each(this.middleMenuGrpList, function(i) {
					var find = false;
					if (this.menuNodeName == AMCMV0090Const.MIDDLENAME_NONE) {
						var parentMenuNodeID = this.parentMenuNodeID;
						var inParentMenuNodeID = this.inParentMenuNodeID;
						for (var j = 0; j < _this.middleMenuGrpList.length; j++) {
							var tgt = _this.middleMenuGrpList[j];
							if (tgt.menuNodeName == AMCMV0090Const.MIDDLENAME_NONE) {
								continue;
							}
							if (parentMenuNodeID == tgt.parentMenuNodeID && inParentMenuNodeID == tgt.inParentMenuNodeID) {
								find = true;
								break;
							}
						}
					}
					if (find) {
						return true;
					}
					var menuNodeID = this.menuNodeID;
					var inMenuNodeID = this.inMenuNodeID;
//					var find = false;
					find = false;
					for (var j = 0; j < _this.viewList.length; j++) {
						var parentMenuNodeID = _this.viewList[j].parentMenuNodeID;
						var inParentMenuNodeID = _this.viewList[j].inParentMenuNodeID;
						if (menuNodeID == parentMenuNodeID && inMenuNodeID == inParentMenuNodeID) {
							find = true;
							break;
						}
					}
					if (!find) {
						clutil.mediator.trigger("onTicker", clutil.getclmsg(clmsg.ECM0015));
						f_error = true;
						return false;
					}

				});
				if (f_error) {
					return null;
				}

				// 大分類が重複している
				$("#ca_table_tbody_large").find("input[name='ca_menuNodeName']").each(function(i){
					var name = $(this).val();
					var $tgt = $(this);
					$("#ca_table_tbody_large").find("input[name='ca_menuNodeName']").each(function(j){
						if (j <= i) {
							return true;
						}
						if (name == $(this).val()) {
							_this.validator.setErrorMsg($tgt, clutil.getclmsg(clmsg.ECM0016));
							_this.validator.setErrorMsg($(this), clutil.getclmsg(clmsg.ECM0016));
							clutil.mediator.trigger("onTicker", clutil.getclmsg(clmsg.ECM0016));
							f_error = true;
						}
					});
				});
				if (f_error) {
					return null;
				}

				// 大分類配下に同一の中分類が存在している
				$.each(this.middleMenuGrpList, function(i) {
					var parentMenuNodeID = this.parentMenuNodeID;
					var inParentMenuNodeID = this.inParentMenuNodeID;
					var menuNodeName = this.menuNodeName;
					var find = false;
					for (var j = i + 1; j < _this.middleMenuGrpList.length; j++) {
						var tgt = _this.middleMenuGrpList[j];
						if (parentMenuNodeID == tgt.parentMenuNodeID && inParentMenuNodeID == tgt.inParentMenuNodeID && menuNodeName == tgt.menuNodeName) {
							find = true;
							break;
						}
					}
					if (find) {
						clutil.mediator.trigger("onTicker", clutil.getclmsg(clmsg.ECM0017));
						f_error = true;
						return false;
					}
				});
				if (f_error) {
					return null;
				}

				// 中分類配下に同一の画面名が存在している
				$.each(this.viewList, function(i) {
					var parentMenuNodeID = this.parentMenuNodeID;
					var inParentMenuNodeID = this.inParentMenuNodeID;
					var viewName = this.viewName;
					var find = false;
					for (var j = i + 1; j < _this.viewList.length; j++) {
						var tgt = _this.viewList[j];
						if (parentMenuNodeID == tgt.parentMenuNodeID && inParentMenuNodeID == tgt.inParentMenuNodeID && viewName == tgt.viewName) {
							find = true;
							break;
						}
					}
					if (find) {
						clutil.mediator.trigger("onTicker", clutil.getclmsg(clmsg.ECM0018));
						f_error = true;
						return false;
					}
				});
				if (f_error) {
					return null;
				}
			}

			var updReq = {};

			var menu = clutil.view2data(this.$('#ca_base_form'));

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				menu.recno = "";
				menu.state = 0;
				menu.menuID = 0;
			}

			updReq = {
				menuRec : menu,
				largeMenuGrpList : largeMenuGrpList,
				middleMenuGrpList : this.middleMenuGrpList,
				viewList : this.viewList,
			};

			var reqHead = {
				opeTypeId : this.options.opeTypeId,
				recno : menu.recno,
				state : menu.state
			};
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var reqObj = {
				reqHead : reqHead,
				AMCMV0090UpdReq  : updReq
			};
//			console.log(reqObj);
//			return;

			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		/**
		 * Get リクエストを作る
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var chkData = this.options.chkData[pgIndex];

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},

				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},

				// メニュー検索リクエスト
				AMCMV0090GetReq: {
					srchMenuID: chkData.id,	// メニューID
					srchLargeMenuGrpID: 0,	// 大分類ID
					srchMiddleMenuGrpID: 0,	// 中分類ID
					srchFuncTypeID: 0,		// 機能区分ID
				},
				// メニュー更新リクエスト -- 今は検索するので、空を設定
				AMCMV0090UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMCMV0090',
				data: getReq
			};
		},

		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){

		},

		_eof: 'AMCMV0090.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){

		mainView = new MainView(clcom.pageArgs).initUIElement().render();

	}).fail(function(data){
		// clcom のネタ取得に失敗。
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});
