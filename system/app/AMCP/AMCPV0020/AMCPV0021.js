$(function() {

	AMCPV0021SelectorView = Backbone.View.extend({

		dialogId : "AMCPV0021",
		screenId : "AMCPV0020",
		categoryId : "AMCP",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_AMCPV0021_commit"			:	"_onCommitClick",		// 確定ボタン押下
			"click #ca_AMCPV0021_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_AMCPV0021_cancel"			:	"_onCancelClick"	// キャンセルボタン押下時
		},

		initialize: function(opt) {
			var defaults = {
				search_date: clcom.ope_date,			// 運用日
				select_mode: clutil.cl_single_select	// 単一選択モード
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);

		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

			this.$('#mainColumninBox').addClass('noLeftColumn');
			this.$('#mainColumnFooter').addClass('noLeftColumn');

			//選択した内容のスクロール
			this.$('#innerScroll').perfectScrollbar();

			clutil.initUIelement(this.$el);

			// 全選択チェックボックスを初期化
			this.chkall = clutil.checkallbox(this.$('#ca_AMCPV0021_chkall'),
					this.$('#ca_AMCPV0021_tbl'),
					this.$('#ca_AMCPV0021_tbody')
					);
		},

		/**
		 * 選択画面の初期化処理
		 *
		 * 初期化後にshow()の呼び出し前に必ず呼び出すこと
		 *
		 * @method render
		 * @for AMCPV0021SelectorView
		 */
		render: function() {
			var url = clcom.urlRoot + "/system/app/" + this.categoryId + "/" + this.screenId + "/" + this.dialogId + ".html";

			// HTMLソースを読み込む
			clutil.loadHtml(url, _.bind(function(data) {
				this.html_source = data;
			}, this));

			return this;
		},

		/**
		 * 描画を行う。先にrender()を実行すること
		 *
		 * @method show
		 * @for AMCPV0021SelectorView
		 * @param {Array} [editList] - 編集領域に保存されているリスト
		 * @param {Array} [isSubDialog] - ダイアログからダイアログを表示したときにのみtrueを設定
		 * @param {Object} [options]
		 * @param {Array} [options.editList] - 編集領域に保存されているリスト
		 * @param {Array} [options.isSubDialog] - ダイアログからダイアログを表示したときにのみtrueを設定
		 */
		show: function(editList, isSubDialog, options) {
			if (arguments.length === 1 && _.isObject(editList) && !_.isArray(editList)){
				options = editList;
				editList = options.editList;
				isSubDialog = options.isSubDialog;
			}

			options || (options = {});

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

			$('.cl_echoback').hide();

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_AMCPV0021_main'), {
				echoback		: $('.cl_echoback')
			});

			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode({
				view : this.$el
			});


			this.setCntPrc(editList);

			// フォーカスの設定
			this.setFocus();
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus(this.$('#ca_AMCPV0021_code'));
		},

		setCntPrc: function(editList) {
			// 結果状態をクリアする
			this.clearResult();

			// 取得したデータを表示する
			$.each(editList, function() {
				this.cntPrcDateDisp = clutil.dateFormat(this.cntPrcDate, 'yyyy/mm/dd(w)');
				this.cntPrcTimeDisp = clutil.timeFormat(this.cntPrcTime, 'hh:mm');
			});
			this.resultList = editList;

			$select_template = this.$('#ca_AMCPV0021_tbody_multiple_tmp');

			// 取得したデータを表示する
			$select_template.tmpl(this.resultList).appendTo('#ca_AMCPV0021_tbody');

			clutil.initUIelement(this.$('#ca_AMCPV0021_tbl'));
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// テーブルをクリア
			this.$('#ca_AMCPV0021_tbody').empty();

			// validatorの初期化
			this.validator.clear();

			// 全選択チェックボックスを初期化
			this.chkall.init();

			// 確定時用のデータを初期化
			this.resultList = [];
		},

		// Idより選択されたデータを取得
		getData : function(chkId){
			var selectData = [];
			for (var i = 0; i < this.resultList.length; i++) {
				var data = this.resultList[i];
				for (var j = 0; j < chkId.length; j++) {
					var selectId = chkId[j];
					if (data.accessLogID == selectId) {
						selectData.push(data);
						break;
					}
				}
			}
			return selectData;
		},

		/**
		 * テーブルに表示されている編集リストを取得する
		 */
		getEditList : function() {
			var editlist = [];
			editlist = clutil.tableview2data(this.$('#ca_AMCPV0021_edit_tbl').children());
			return editlist;
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			this.validator.clear();
			var editlist = [];
			var chkId = [];

			$.each(this.$('#ca_AMCPV0021_tbody').find("[name=ca_AMCPV0021_chk]:checked"), function() {
				var tr = $(this).closest('tr');
				chkId.push(tr.get(0).id);
			});


			if (chkId.length > 0) {
				var selectlist = this.getData(chkId);

				for (var i = 0; i < selectlist.length; i++) {
					var select = selectlist[i];

					var newdata = {};
					newdata.accessLogID = select.accessLogID;
					newdata.cntPrcRprtID = select.cntPrcRprtID;
					newdata.cntPrcDate = select.cntPrcDate;
					newdata.cntPrcTime = select.cntPrcTime;
					newdata.htid = select.htid;

					editlist.push(newdata);
				}

				this.$parentView.show();
				this.okProc(editlist);
				this.$el.html('');
				clutil.leaveEnterFocusMode();
				clutil.enterFocusMode();
			} else {
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clmsg.ca_AMCPV0021_0001});
			}
		},

		/**
		 * 選択時処理コールバック
		 *
		 * 呼び出し側で override すること
		 *
		 * @method okProc
		 * @for AMCPV0021SelectorView
		 * @param {Array} data 選択アイテムのリスト
		 */
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
