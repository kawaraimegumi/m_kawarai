$(function() {

	//////////////////////////////////////////////
	// View
	MDCMV0030SelectorView = Backbone.View.extend({

		screenId : "MDCMV0030",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_MDCMV0030_clear"			:	"_onClearClick",		// クリアボタン押下
			"click #ca_MDCMV0030_commit"		:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_MDCMV0030_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_MDCMV0030_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_MDCMV0030_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
		},

		attrlist: [
			{id:1, code: "1", name: "1" },
			{id:2, code: "2", name: "2" },
			{id:3, code: "3", name: "3" },
			{id:4, code: "4", name: "4" },
			{id:5, code: "5", name: "5" },
			{id:6, code: "6", name: "6" },
			{id:7, code: "7", name: "7" },
			{id:8, code: "8", name: "8" },
			{id:9, code: "9", name: "9" },
			{id:10, code: "10", name: "10" },
			{id:11, code: "11", name: "11～" },
		],

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

			// コンボボックスの中身を作成
			var unselectflag = 1;
			if (Ana.Config.cond.MACMV0030.required) {
				unselectflag = 0;
				$("#div_MDCMV0030_anaattr").addClass('required');
				$("#ca_MDCMV0030_anaattr").addClass('cl_required');
			}

			clutil.cltypeselector2(this.$('#ca_MDCMV0030_anaattr'), this.attrlist, unselectflag, 1);
			clutil.initUIelement(this.$el);

			if (editList != null && editList.length > 0) {
				var item = editList[0];
				var val = _.find(this.attrlist, function(v) {return v.id == item.val;});
				if (val != null) {
					this.$('#ca_MDCMV0030_anaattr').selectpicker('val', val.id);
				}
			}
		},

		/**
		 * 選択画面の初期化処理
		 */
		render: function() {
			var _this = this;

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
			this.validator = clutil.validator(this.$('#ca_MDCMV0030_main'), {
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
			clutil.setFocus(this.$('#ca_MDCMV0030_anaattr'));
		},

		/**
		 * 現在の種別を取得
		 */
		getAnaAttr: function(kind) {
			var anaattr = {};
			for (var i = 0; i < this.attrlist.length; i++) {
				if (this.attrlist[i].id == kind) {
					anaattr = this.attrlist[i];
					break;
				}
			}
			return anaattr;
		},

		// Idより選択されたデータを取得
		getData : function(chkId, idname){
			var selectdata = [];
			var val = this.$("#ca_MDCMV0030_anaattr").selectpicker('val');
			var anaattr = this.getAnaAttr(val);
			var data = {
				kind: amanp_AnaDefs.AMAN_DEFS_KIND_RCPT_QY,
				val: val,
				anaattr: anaattr,
				name: "購入点数"
			};
			selectdata.push(data);
			return selectdata;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			if(!this.validator.valid()){
				return;
			}

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
