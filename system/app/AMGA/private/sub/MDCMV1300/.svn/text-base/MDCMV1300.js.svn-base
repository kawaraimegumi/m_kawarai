$(function() {

	//////////////////////////////////////////////
	// View
	MDCMV1300SelectorView = Backbone.View.extend({

		screenId : "MDCMV1300",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_MDCMV1300_commit"		:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_MDCMV1300_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
		},

		/**
		 * 引数
		 * ・$parentView		: 親画面のjQueryオブジェクト (例：$('#ca_main'))
		 * ・select_mode		: チェックボックス/ラジオボタン選択
		 * 						  nullの場合はラジオ
		 * ・isAnalyse_mode		: false 分析モードでない場合
		 * 						: true  分析モードの場合、デフォルト
		 * ・ymd				: 検索日
		 *						  指定がない場合は運用日
		 */
		initialize: function(opt) {
			var defaults = {
				search_date: clcom.ope_date,			// 運用日
				select_mode: clutil.cl_single_select,	// 単一選択モード
				isAnalyse_mode: true					// 分析画面で利用
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);

		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), this.isAnalyse_mode);

			var _this = this;
			clutil.inputlimiter(this.$el);
			clutil.initUIelement(this.$el);

			// 分析画面以外からのモード
			if (this.isAnalyse_mode == false) {
				this.$('.ca_MDCMV1300_multi').remove();
				this.$('#mainColumninBox').addClass('noLeftColumn');
				this.$('#mainColumnFooter').addClass('noLeftColumn');
			} else {
				this.$('#mainColumnFooter').addClass('analytics');
			}

			// 公開区分
			clutil.initcltypecustselector($('#ca_MDCMV1300_f_open_div'), gsdb_defs.MTTYPETYPE_F_OPEN,
					0, null,
					{id : "ca_MDCMV1300_f_open", name : "info"}, "mbn wt280 flleft");
			// リスト利用区分
			clutil.initcltypecustselector($('#ca_MDCMV1300_f_listuse_div'), gsdb_defs.MTTYPETYPE_F_LISTUSE, 0, null,
					{id : "ca_MDCMV1300_f_listuse", name : "info"}, "mbn wt280 flleft");

		},

		/**
		 * 選択画面の初期化処理
		 */
		render: function() {
//			var url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
			var url = clcom.getAnaSubPaneURI(this.screenId);

			// HTMLソースを読み込む
			clutil.loadHtml(url, _.bind(function(data) {
				this.html_source = data;
			}, this));

			return this;
		},

		show: function(isSubDialog, req, uri) {

			// 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
			if (isSubDialog == null) {
				$('.cl_dialog').empty();
			}

			this.$parentView.hide();

			// URI,条件を保存
			this.uri = uri;
			this.req = req;

			// htmlソースからダイアログを作成する
			this.$el.html('');
			this.$el.html(this.html_source);

			// 画面の初期化
			this.initUIelement();

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_MDCMV1300_main'), {
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
			clutil.setFocus(this.$('#ca_MDCMV1300_listname'));
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function(e) {
			if(!this.validator.valid()){
				return;
			}

			// 登録確認ダイアログを表示
			clutil.updConfirmDialog(this.updOkcallback, this.updCancelcallback, e);
		},


		/**
		 * 登録確認ダイアログよりCancelで戻る
		 */
		updCancelcallback: function(e) {
			$(e.target).focus();
			return;
		},

		/**
		 * 登録確認ダイアログよりOKで戻る
		 */
		updOkcallback: function(e) {
			// input の中身
			// Object {listname: "xxx", f_open: "1", f_listuse: "1"}
			var inputData = clutil.view2data(this.$('#ca_MDCMV1300_searchArea'), 'ca_MDCMV1300_');

			if(window.Ana && this.req instanceof Ana.Proc){
				// 分析
				var anaProc = this.req;
				var deferd = anaProc.doSaveCustList(inputData.listname, inputData.f_open, inputData.f_listuse);
				deferd.done(_.bind(function(data){
					// 更新完了ダイアログを出す
					clutil.updMessageDialog(this.updConfirmcallback, e);
				}, this));
				deferd.fail(_.bind(function(data){
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}, this));
			}else{
				// 通常
				var _this = this;

				// 仮会員リスト登録用に名称変更
				if (this.uri == "gsan_cm_genlist_upd") {
					inputData.name = inputData.listname;
					this.req.genlist = _.extend(this.req.genlist, inputData);
				} else {
					this.req = _.extend(this.req, inputData);
				}

				clutil.postAnaJSON(this.uri, this.req, _.bind(function(data, dataType) {
					if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

						// 更新完了ダイアログを出す
						clutil.updMessageDialog(_this.updConfirmcallback, this.req);

					} else {
						// ヘッダーにメッセージを表示
						_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					}
				}, this));
			}
		},

		/**
		 * 更新完了ダイアログよりOKで戻る
		 */
		updConfirmcallback: function(e) {
			this.$parentView.show();
			this.okProc(this.req);		// 呼び出し元に結果データを返す。返すものが無いので、空Objectを返しておく。
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
