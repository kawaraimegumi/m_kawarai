$(function() {
	//////////////////////////////////////////////
	// View
	CACMV0210SelectorView = Backbone.View.extend({

		screenId : "CACMV0210",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_CACMV0210_commit"			:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_CACMV0210_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_CACMV0210_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_CACMV0210_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
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

			clutil.inputlimiter(this.$el);

			// datepickerの作成
			clutil.datepicker($("#ca_CACMV0210_exist_iymd"), 20061101);

			clutil.data2view(this.$('#ca_CACMV0210_searchArea'), editList, 'ca_CACMV0210_');

			var _this = this;
			// 既存店ラジオボタンクリック
			this.$el.delegate(':radio[name="ca_CACMV0210_existsum"]', 'toggle', function (ev) {
				_this._onExistSumSelect($(this).val());
			});
			this._onExistSumSelect(editList.existsum);

			clutil.initUIelement(this.$el);

			// コンフィギュレーション
			// 表示項目並びの設定UIを非活性に。
			if(Ana.Config.cond.CACMV0210.disp_way == 'disabled'){
				clutil.viewReadonly(_this.$('#ca_CACMV0210_disp_way'));
			}
			// 小計あり/なし
			if(Ana.Config.cond.CACMV0210.f_subtotal == 'disabled'){
				clutil.viewReadonly(_this.$('#ca_CACMV0210_f_subtotal'));
			}
			// 既存店合計UI:要/不要
			if(Ana.Config.cond.CACMV0210.existsum == 'unused'){
				_this.$('#ca_CACMV0210_existsum').remove();
			}
            if(this.anaProc.func_code != 'AMGAV0100'){
				_this.$('#ca_CACMV0210_sizesum').remove();
            }
		},

		/**
		 * 既存店ラジオボタンクリック
		 */
		_onExistSumSelect: function(existsum) {
			if (Number(existsum) == 1) {
				// する
				clutil.viewRemoveReadonly($('#ca_CACMV0210_exist_iymd').closest('div.datepicker_wrap'));
				$('#ca_CACMV0210_exist_iymd').addClass('cl_valid');
			} else {
				// しない
				clutil.viewReadonly($('#ca_CACMV0210_exist_iymd').closest('div.datepicker_wrap'));
				$('#ca_CACMV0210_exist_iymd').removeClass('cl_valid');
			}
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
			this.validator = clutil.validator(this.$('#ca_CACMV0210_main'), {
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
			var editList = clutil.view2data(this.$('#ca_CACMV0210_searchArea'), 'ca_CACMV0210_');
			return editList;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			if(!this.validator.valid()){
				return;
			}
			var data = this.getData();
//			if (this.anaProc.has_mstitem(this.anaProc.cond.mstitem_list) && data.disp_way == amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_V) {
//				this.validator.setErrorHeader("軸属性が設定されている場合は、縦並びは選択できません。");
//				return;
//			}

			this.$parentView.show();
			this.okProc(data);
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
