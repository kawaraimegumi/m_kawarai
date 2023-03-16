$(function() {
	//////////////////////////////////////////////
	// View
	CACMV0200SelectorView = Backbone.View.extend({

		screenId : "CACMV0200",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_CACMV0200_clear"				:	"_onClearClick",		// クリアボタン押下
			"click #ca_CACMV0200_commit"			:	"_onCommitClick",		// 確定ボタン押下
			"click #ca_CACMV0200_default"			:	"_onDefaultClick",		// 初期値に戻すボタン押下

			"change #ca_CACMV0200_main .ca_CACMV0200_val"		:	"_onFromAmFocusout",	// 開始値フォーカスアウト

			"click #ca_CACMV0200_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_CACMV0200_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_CACMV0200_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
		},

		initialize: function() {
			_.bindAll(this);
			this.defaultranklist = [];
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

			this.max_rank = 7;
		},

		/**
		 * 選択画面の初期化処理
		 *
		 * 引数
		 * ・$parentView		: 親画面のjQueryオブジェクト (例：$('#ca_main'))
		 */
		render: function(
				$parentView
				) {
			var _this = this;

			this.$parentView = $parentView;

//			var url = "";
//			url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
			var url = clcom.getAnaSubPaneURI(this.screenId);

			// HTMLソースを読み込む
			clutil.loadHtml(url, function(data) {
				_this.html_source = data;
			});
		},

		show: function(editList, isSubDialog, kind, attr) {
			var _this = this;

			// 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
			if (isSubDialog == null) {
				$('.cl_dialog').empty();
			}

			this.$parentView.hide();

			// htmlソースからダイアログを作成する
			this.$el.html('');
			this.$el.html(this.html_source);

			// デフォルトのランクリストを保存
			this.defaultranklist = clcom.getFromToList(kind, attr);
			this.kind = kind;
			this.attr = attr;

			// 画面の初期化
			this.initUIelement();

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_CACMV0200_main'), {
				echoback		: $('.cl_echoback')
			});
			// フォーカスの設定
			this.setFocus();

			// ABC以外は7がMAXRANK
			if (this.kind == amanp_AnaDefs.AMAN_DEFS_KIND_MEMB_PARA) {
				this.max_rank = 3;
			}

			// タイトルの表示
			if (this.defaultranklist != null && this.defaultranklist.length > 0) {
				this.$('#ca_CACMV0200_name').html(this.defaultranklist[0].name)
			}
			// 編集データを表示
			this.showData(editList);

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
			this.$('#ca_CACMV0200_name').focus();
		},

		/**
		 * 編集データの表示
		 */
		showData: function(editList) {
			// 編集データがない場合はデフォルトランクリストを表示する
			if (editList == null || editList.length == 0) {
				editList = this.defaultranklist;
			}
			// 最終行は空にする
			editList[editList.length-1].val2 = "";
			this.$('#ca_CACMV0200_fromto_tmp').tmpl(editList).appendTo('#ca_CACMV0200_fromto');
			this.setFirstRow();

			for (var i = editList.length; i < this.max_rank; i++) {
				var newdata = {};
				this.$('#ca_CACMV0200_fromto_tmp').tmpl(newdata).appendTo('#ca_CACMV0200_fromto');
			}

			// カンマ表示のため再設定
			clutil.inputlimiter(this.$el);
		},

		/**
		 * 最初の１行は開始値disabled
		 */
		setFirstRow: function() {
			var input = this.$('#ca_CACMV0200_fromto input:first');
			$(input).attr('disabled', 'disabled');
		},

		/**
		 * 初期値に戻す押下
		 */
		_onDefaultClick:function() {
			this.$('#ca_CACMV0200_fromto').empty();
			this.showData(this.defaultranklist);
		},

		/**
		 * 開始値フォーカスアウト
		 */
		_onFromAmFocusout: function(e) {
			this.ranklist = clutil.tableview2data($('#ca_CACMV0200_fromto').children());
			if (!this.checkNumber()) {
				return;
			}
			this.calcToAm();
		},


		/**
		 * 昇順で入力されたかのチェック
		 */
		checkNumber: function() {
			this.validator.clear();

			var isAscending = true;
			var inputlist = $('#ca_CACMV0200_fromto input[name=val]');

			if (this.ranklist == null || this.ranklist.length <= 1) {
				return true;
			} else {
				var last = this.ranklist.length - 1;

				for (var i = 0; i <= last-1; i++) {
					var rank1 = this.ranklist[i];
					if (clutil.cStr(rank1.val) != "") {
						//
						for (var j = i+1; j <= last; j++) {
							var rank2 = this.ranklist[j];
							// 次に入力されている値との昇順チェック
							if (clutil.cStr(rank2.val) != "") {
								if (Number(rank1.val) >= Number(rank2.val)) {
									// エラーの設定
									this.validator.setErrorMsg($(inputlist[i]), clmsg.ca_ME150_0001);
									this.validator.setErrorMsg($(inputlist[j]), clmsg.ca_ME150_0001);
									isAscending = false;
								}
								break;
							}
						}
					}
				}
				if (!isAscending) {
					this.validator.setErrorHeader(clmsg.cl_echoback);
					// フォーカスの設定
					var err = $('#ca_CACMV0200_fromto input.cl_error_field:first[name=val]');
					$(err).focus();
					return false;
				}

				return true;
			}
		},

		/**
		 * 計算をする
		 */
		calcToAm: function() {
			if (this.ranklist == null) {
				// なにもしない
				return;
			} else if (this.ranklist.length == 1) {
				// １行しかない場合は終了値を空にする
				this.ranklist[0].val2 = "";
			} else {
				var last = this.ranklist.length - 1;

				for (var i = 0; i <= last-1; i++) {
					var rank = this.ranklist[i];
					if (clutil.cStr(rank.val) != "") {
						//
						for (var j = i+1; j <= last; j++) {
							var nextrank = this.ranklist[j];
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

				// 最終行の終了値は常に空
				this.ranklist[last].val2 = "";
			}

			// 終了値の再設定
			var inputlist = $('#ca_CACMV0200_fromto input[name=val2]');
			for (var i = 0; i < inputlist.length; i++) {
				var input = inputlist[i];
				$(input).val(this.ranklist[i].val2);
			}
			// カンマ表示のため再設定
			clutil.inputlimiter(this.$el);

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
		_onClearClick: function() {
			this.clearResult();
			this.$('#ca_CACMV0200_fromto').empty();
			this.showData([{
				val : 0
			}]);
		},

		// Idより選択されたデータを取得
		getData : function(){
			var ranklist = clutil.tableview2data($('#ca_CACMV0200_fromto').children());

			// 昇順のチェック
			if (!this.checkNumber()) {
				return;
			}
			this.calcToAm();

			// validation
			if(!this.validator.valid()) {
				return this;
			}

			for (var i = ranklist.length-1; i >= 0; i--) {
				rank = ranklist[i];
				// 開始値が入力されていなかったら要素を削除する
				if (clutil.cStr(rank.val) == "") {
					ranklist.splice(i, 1);
					continue;
				}
			}

			return ranklist;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			this.validator.clear();

			this.$parentView.show();
			this.okProc(this.getData());
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
