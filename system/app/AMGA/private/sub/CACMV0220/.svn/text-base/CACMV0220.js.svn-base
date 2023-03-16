$(function() {
	//////////////////////////////////////////////
	// View
	CACMV0220SelectorView = Backbone.View.extend({

		screenId : "CACMV0220",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_CACMV0220_commit"			:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_CACMV0220_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_CACMV0220_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_CACMV0220_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
		},

		// コンストラクタの引数 opt について。
		// opt: {anaProc: obj, $parentView: aview}
		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function(editList) {
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), true);

			clutil.inputlimiter(this.$el);

			clutil.data2view(this.$('#ca_CACMV0220_searchArea'), editList, 'ca_CACMV0220_');

			clutil.initUIelement(this.$el);
		},

		/**
		 * 選択画面の初期化処理
		 */
		render: function() {
//			var url = "";
//			url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
			var url = clcom.getAnaSubPaneURI(this.screenId);

			// HTMLソースを読み込む
			clutil.loadHtml(url, _.bind(function(data) {
				this.html_source = data;
			}, this));

			return this;
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
			this.validator = clutil.validator(this.$('#ca_CACMV0220_main'), {
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
			// 当てる箇所なし
		},

		// Idより選択されたデータを取得
		getData : function(){
			var editList = clutil.view2data(this.$('#ca_CACMV0220_searchArea'), 'ca_CACMV0220_');
			return editList;
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
