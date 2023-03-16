$(function() {
	//////////////////////////////////////////////
	// View
	CACMV0100SelectorView = Backbone.View.extend({

		screenId : "CACMV0100",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_CACMV0100_clear"				:	"_onClearClick",		// クリアボタン押下
			"click #ca_CACMV0100_commit"			:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_CACMV0100_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_CACMV0100_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_CACMV0100_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
		},

		initialize: function(opt) {
			var defaults = {
				search_date: clcom.ope_date,			// 運用日
				select_mode: clutil.cl_single_select,	// 単一選択モード
				isAnalyse_mode: true					// 分析画面で利用
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);

			this.defaultranklist = [];
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), this.isAnalyse_mode);

			clutil.inputlimiter(this.$el);

			this.chkall = clutil.checkall(this.$('#ca_CACMV0100_chkall'), this.$('#ca_CACMV0100_age'));
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

			this.kind = amanp_AnaDefs.AMAN_DEFS_KIND_GENERATION;
			this.attr = amanp_AnaDefs.AMAN_DEFS_ATTR_GENERATION;
			// デフォルトのランクリストを保存
			this.defaultranklist = clcom.getFromToList(this.kind, this.attr);

			// 画面の初期化
			this.initUIelement();

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_CACMV0100_main'), {
				echoback		: $('.cl_echoback')
			});
			// フォーカスの設定
			this.setFocus();

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
			// 当てる箇所なし
		},

		/**
		 * 編集データの表示
		 */
		showData: function(editList) {
			this.$('#ca_CACMV0100_age_tmp').tmpl(this.defaultranklist).appendTo('#ca_CACMV0100_age');

			if (editList != null && editList.length > 0) {
				for (var i = 0; i < editList.length; i++) {
					var edit = editList[i];
					var inputlist = this.$('#ca_CACMV0100_age').find('input[name=val]');
					$.each(inputlist, function() {
						if ($(this).val() == edit.val) {
							var div = $(this).closest('div');
							$(div).find(':checkbox').checkbox('check');
						}
					});
				}
			}

			clutil.initUIelement(this.$el);
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
			this.$('#ca_CACMV0100_age').empty();
		},

		// Idより選択されたデータを取得
		getData : function(){
			var _this = this;
			var ranklist = [];
			$.each(this.$('div.ca_CACMV0100_age_div'), function() {
				var chk = $(this).find('input:checkbox')
				if ($(chk).prop('checked')) {
					var rank = {
						val : $(this).find('input[name=val]').val(),
						val2 : $(this).find('input[name=val2]').val(),
						name : $(this).find('input[name=name]').val(),
						kind : _this.kind,
						attr : _this.attr
					}
					ranklist.push(rank);
				}

			});

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
