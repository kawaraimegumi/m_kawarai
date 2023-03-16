$(function() {
	//////////////////////////////////////////////
	// View
	CACMV0230SelectorView = Backbone.View.extend({

		screenId : "CACMV0230",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_CACMV0230_commit"			:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_CACMV0230_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_CACMV0230_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_CACMV0230_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
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

			if (editList != null) {
				$.each(editList, function(key, value) {
					if (key == 'num') {
						var div = _this.$('#ca_CACMV0230_' + key);
						$(div).find('input[name=num]').val(value);
					} else {
						var div = _this.$('#ca_CACMV0230_' + key);
						$(div).find('input[name=from]').val(value.from);
						$(div).find('input[name=to]').val(value.to);
						$(div).find('input[name=seqno]').val(value.seqno);
					}
				});
			}
			clutil.inputlimiter(this.$el);
			clutil.initUIelement(this.$el);
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
			this.validator = clutil.validator(this.$('#ca_CACMV0230_main'), {
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
			clutil.setFocus(this.$('#ca_CACMV0230_sale_am').find('input[name=from]'));
		},

		// Idより選択されたデータを取得
		getData : function(){
			// 必須項目すべて解除
			this.$('input.cl_required').removeClass('cl_required');

			var retList = clutil.tableview2data(this.$('div.fieldgroupInBox'));
			var retObj = {};
			for (var i = 0; i < retList.length; i++) {
				var ret = retList[i];
				if (ret.name == 'num') {
					retObj[ret.name] = ret.num;
				} else {
					// fromtoのどちらかに入力があれば順位は必須
					if (clutil.pInt(ret.from) != 0 || clutil.pInt(ret.to) != 0) {
						var input = $('#ca_CACMV0230_' + ret.name).find('input[name=seqno]');
						$(input).addClass('cl_required');
						retObj[ret.name] = {
								from : ret.from,
								to : ret.to,
								seqno : ret.seqno
						};
					}
				}
			}
			return retObj;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			var retStat = true;

			// 設定値を取得して必須項目を設定する
			var retObj = this.getData();

			if (!this.validator.valid()) {
				retStat = false;
			}

			// fromtoチェック
			var inputfrom = this.$('input[name=from]');
			var inputto = this.$('input[name=to]');

			var chkInfo = [];
			for (var i = 0; i < inputfrom.length; i++) {
				// 範囲反転チェック
				chkInfo.push({
					$stval : $(inputfrom[i]),
					$edval : $(inputto[i])
				});
			}

			if(!this.validator.validFromToObj(chkInfo)){
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorFocus();
				return;
			}

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
