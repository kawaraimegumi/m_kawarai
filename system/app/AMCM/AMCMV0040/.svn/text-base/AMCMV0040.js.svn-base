// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	clutil.enterFocusMode($('body'));
	var util = {
			/**
			 * 行選択 - Ope系ボタンの活性化/非活性化コントロール
			 *	var args = {
			 *		$btn: $btn,							// ボタン要素の jQuery オブジェクト
			 *		selectedRows: selectedRecs,			// 選択した行データ配列
			 *		selectedCount: selectedRecs.length,	// 選択行数
			 *		btnOpeTypeId: btnOpeTypeId,			// $btn に因んだ処理区分 opeTypeID 値。不定の場合は -1。
			 *		selectionPolicy: selectionPolicy,	// $btn の操作が複数行選択できるかどうか。値は 'single' or 'multi' をとる。
			 *		hasHistory: hasHistory,				// 行データが履歴を持つかどうか。行データに formDate, toDate プロパティを持つものを履歴ありと判定。
			 *		opeDate: opeDate					// 運用日（いま）。呼出元で clcom.getOpeDate() で取得した値。
			 *	};
			 */
			// 遷移可能判定実装
			opeBtnIsEnabled: function(args){
				// 行選択が無い。⇒ 全部非活性化
				if(args.selectedCount <= 0){
					// 選択されていない。
					return false;
				}
				var able = true;
				var opeDate = clcom.getOpeDate();
				if(args.selectedCount == 1){
					// 1個選択
					switch(args.btnOpeTypeId){
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
						$.each(args.selectedRows,function(){
							if (this.toDate < clcom.max_date
									|| this.userType == amcm_type.AMCM_VAL_USER_STORE){
								able = false;
							}
						});
						break;
					case -1:
						$.each(args.selectedRows,function(){
							if (this.toDate < clcom.max_date){
								able = false;
							}
						});
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
						$.each(args.selectedRows,function(){
							if (this.toDate < clcom.max_date
									|| this.fromDate < opeDate
									/*|| this.userType == amcm_type.AMCM_VAL_USER_STORE*/){
								able = false;
							}
						});
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
						$.each(args.selectedRows,function(){
							if (this.toDate < clcom.max_date
									|| this.userType == amcm_type.AMCM_VAL_USER_STORE){
								able = false;
							}
						});
						break;
					}
				}else{
					// 複数行選択
					if(args.selectionPolicy == 'single'){
						return false;
					}
					// 複数行選択可なのは、編集とパスワード初期化。
					switch(args.btnOpeTypeId){
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
						$.each(args.selectedRows,function(){
							if (this.toDate < clcom.max_date
									|| this.userType == amcm_type.AMCM_VAL_USER_STORE){
								able = false;
							}
						});
						break;
					case -1:
						$.each(args.selectedRows,function(){
							if (this.toDate < clcom.max_date){
								able = false;
							}
						});
						break;
					}
				}

				return able;
			}

	};

	var ListView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_srch" : "onSearchClick",
			"click #searchAgain" : "onResearchClick",
			"click #cl_reset" : "_onResetClick"

//			"toggle #ca_table_thead input:checkbox" : "_onCheckBoxToggle",
//			"toggle #ca_table_tbody input:checkbox" : "_onCheckBoxToggle"
		},
		resultList : [],
		fundList : {}, //検索リスト

		initialize : function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opebtn_auto_enable: util.opeBtnIsEnabled,	// 行選択 - Opeボタン活性/非活性コントロールの独自実装
				title: 'ユーザ',
				subtitle: '一覧',
				btn_csv: false,
			});

//			// 検索パネル
//			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMCMV0040 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMCMV0040';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_tbody_template').html() )
			});

			// イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);


			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			this.recListView.initUIElement();
			$(".txtInFieldUnit.help").tooltip({html: true});

			clutil.inputlimiter(this.$el);

			var now = clcom.getOpeDate();
			console.log(now);
			// datepicker
			clutil.datepicker(this.$("#ca_srchDate"));
			this.$("#ca_srchDate").datepicker("setIymd", now);

			clutil.cltypeselector(this.$("#ca_srchUserType"), amcm_type.AMCM_TYPE_USER);

			// hide searchAgain button & click event
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.$('#ca_searchArea'),
					this.$('#ca_srch'),
					this.$('#ca_result'),
					this.$('#searchAgain'));

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.recListView.render();
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}
			return this;
		},


		/**
		 * 検索ボタン押下
		 */
		onSearchClick : function(){
			var retStat = true; // input check var
			// check by validator
			if(!this.validator.valid()){
				retStat = false;
			}

			// if some input is not correct, return
			if (!retStat) {
				return;
			}

			// get input data from condition's view
			var searchData = clutil.view2data(this.$('#ca_searchArea'), 'ca_');

			// if Date is not definited
			if(searchData.srchDate == ""){
				searchData.srchDate = 0;
			}

			//show results
			var req = {
					reqHead: {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMCMV0040GetReq : searchData
			};
			this.doSrch(req);
		},

		_onResetClick : function(e){
			this.showAMCMV0050page(-1, e);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMCMV0040'){
				return;
			}

			if(!this.savedReq){
				console.warn('検索条件が保存されていません。');
				return;
			}

			// 検索条件を複製してページリクエストを差し替える
			var req = _.extend({}, this.savedReq);
			req.reqPage = pageReq;

			// 検索実行
			this.doSrch(req);
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				console.log('CSV 出力');
				this.doDownload(rtyp);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				this.showAMCMV0050page(rtyp, e);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * 検索条件を再指定 押下
		 */
		onResearchClick : function(){
			this.srchAreaCtrl.show_srch();
			this.mdBaseView.options.btn_csv = false;
			this.mdBaseView.renderFooterNavi();
		},

		// ページャークリック
		doSrch: function(srchReq, chkData, $focusElem) {

			// 結果状態をクリアする
			this.clearResult();

			// データを取得
			var uri = 'AMCMV0040';
			clutil.postJSON(uri, srchReq).done(_.bind(function(data, dataType) {

					this.resultList = data.AMCMV0040GetRsp.userList;

					if (_.isEmpty(this.resultList)) {
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_no_data'));
						// 画面を一旦リセット
						this.srchAreaCtrl.reset();
						this.srchAreaCtrl.show_srch();
						this.resetFocus(this.$("#ca_srchCode"));
					} else {

						// 取得したデータを表示する
						// リクエストを保存。
						this.savedReq = srchReq;

						// 結果ペインを表示
						this.srchAreaCtrl.show_result();

						// 内容物がある場合 --> 結果表示する。
						this.recListView.setRecs(this.resultList);
						// 削除行UIをセットする
						this.recListView.setDeletedRowUI(function(dto) {
							console.log(dto);
							return dto.delFlag != 0;
						});

						// 初期選択の設定（オプション）
						if(!_.isEmpty(chkData)){
							// TODO:そのままチェックしてもいいのか？
//							this.recListView.setSelectById(selectedIds, true);
							this.recListView.setSelectRecs(chkData, true);
						}

						// Excelダウンロードボタンを表示する
						this.mdBaseView.options.btn_csv = true;
						this.mdBaseView.renderFooterNavi();

						this.resetFocus();
					}

				}, this)).fail(_.bind(function(data){
					console.log(data.rspHead);
					// 画面を一旦リセット
					this.srchAreaCtrl.reset();
					this.srchAreaCtrl.show_srch();
					// エラーメッセージを通知。
					clutil.mediator.trigger('onTicker', data);
					this.resetFocus();
			}, this));
		},

		/**
		 * 登録・修正画面遷移
		 * @param ope_mode
		 */
		showAMCMV0050page: function(ope_mode, e){
			var url = clcom.appRoot + '/AMCM/AMCMV0050/AMCMV0050.html';

			// 画面遷移引数
			var pushPageOpt = null;

			switch(ope_mode){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				pushPageOpt = {
					// 遷移先url
					url: url,
					// 画面引数 -- 遷移先画面に渡すネタ
					args: {
						opeTypeId: ope_mode
					},
					// 保存データ -- 戻ってきたときにリロードするネタ
					saved: {
						btnId: e.target.id,
						savedReq: null,
						savedCond: clutil.view2data($('#ca_searchArea')),
						chkData: this.recListView.getSelectedRecs()
					}
				};
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				var clickedRec = this.recListView.getLastClickedRec();
				if(_.isEmpty(clickedRec)){
					console.warn('照会：クリックした行が不明・・・Skip');
					return;
				}
				pushPageOpt = {
					url: url,
					args: {
						btnId: e.target.id,
						opeTypeId: ope_mode,
						srchDate: this.savedReq.srchDate,
						chkData: [ clickedRec ]
					},
					newWindow: true				// 別窓で照会画面を起動
				};
				break;
			default:										// その他、編集、予約取消、削除
				var selectedRecs = this.recListView.getSelectedRecs();
				if(_.isEmpty(selectedRecs)){
					console.warn(clutil.opeTypeIdtoString(ope_mode) + ': なにもチェックされていない・・・Skip');
					return;
				}
				pushPageOpt = {
					url: url,
					args: {
						opeTypeId: ope_mode,
						srchDate: this.savedReq.srchDate,
						chkData: this.recListView.getSelectedRecs()
					},
					saved: {
						btnId: e.target.id,
						savedReq: this.savedReq,
						savedCond: this.savedReq.AMCMV0040GetReq,
						chkData: this.recListView.getSelectedRecs()
					}
				};
			}
			if(pushPageOpt){
				clcom.pushPage(pushPageOpt);
			}
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFocus($focusElem);
			}else{
				if(this.$("#searchAgain").css("display")=="none"){
					clutil.setFocus(this.$("#ca_srch"));
				} else {
					clutil.setFocus(this.$("#searchAgain"));
				}
			}
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();
			// 確定時用のデータを初期化
			this.savedReq = null;
			// テーブルをクリア
			this.recListView.clear();
		},


		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				srchReq = clutil.view2data(this.$('#ca_searchArea'), 'ca_');
			}

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMCMV0040GetReq: srchReq
			};
			return req;
		},

		/**
		 * 出力ボタン押下処理
		 */
		doDownload: function(rtyp) {
			var retStat = true; // input check var
			// check by validator
			if(!this.validator.valid()){
				retStat = false;
			}

			// if some input is not correct, return
			if (!retStat) {
				return;
			}
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				return;
			}

			srchReq.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV;
			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMCMV0040', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
			return false;
		}
	});


	// 画面初期表示
	clutil.getIniJSON(null, null, function(){
		console.log("completed()"); 			//コールバックtest表示
	})											//
	.done(_.bind(function(data,dataType){				// 画面の初期化を行う
		ca_listView = new ListView();
		ca_listView.initUIelement().render();
		clutil.setFocus($("#ca_srchCode"));
		if (clcom.pageData != null) {
			// メインviewにメソッド追加してもよい
			ca_listView.savedReq = clcom.pageData.savedReq;
			var cond = clcom.pageData.savedCond;
			clutil.data2view(ca_listView.$('#ca_searchArea'), cond);

			console.log(ca_listView.savedReq);
			if (ca_listView.savedReq != null) {
				ca_listView.doSrch(clcom.pageData.savedReq, clcom.pageData.chkData,  $('#' + clcom.pageData.btnId));
			}
		}
	}, this))
	.fail(_.bind(function(data){
		console.error('iniJSON failed.');
		console.log(arguments);

		// clcom のネタ取得に失敗。
		// 動かしようがないので、Abort 扱いとしておく？？？
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	}, this));
});
