$(function(){

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	clutil.enterFocusMode($('body'));

	var ListView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_srch" : "onSearchClick",
			"click #searchAgain" : "onResearchClick"
		},
		resultList : [],
		fundList : {}, //検索リスト

		initialize : function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '組織体系マスタ',
				subtitle: '一覧',
				btn_csv: false
			});

//			// 検索パネル
//			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMMSV0230 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMMSV0230';

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
			clutil.mediator.on('onOperation', this.showAMMSV0240page);


			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			this.recListView.initUIElement();

			clutil.inputlimiter(this.$el);

			var now = clcom.getOpeDate();
			console.log(now);
//			// datepicker
//			clutil.datepicker(this.$("#ca_srchDate"));
//			this.$("#ca_srchDate").datepicker("setIymd", now);

			// hide searchAgain button & click event
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.$('#ca_searchArea'),
					this.$('#ca_srch'),
					this.$('#ca_result'),
					this.$('#searchAgain'));
			$(".txtInFieldUnit.help").tooltip({html: true});

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
					AMMSV0230GetReq : searchData
			};
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMMSV0230'){
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
		 * 検索条件を再指定 押下
		 */
		onResearchClick : function(){
			this.srchAreaCtrl.show_srch();
		},

		// ページャークリック
		doSrch: function(srchReq, chkData, $focusElem) {

			// 結果状態をクリアする
			this.clearResult();

			// データを取得
			var uri = 'AMMSV0230';
			clutil.postJSON(uri, srchReq).done(_.bind(function(data, dataType) {

					this.resultList = data.AMMSV0230GetRsp.orgfuncList;

					if (_.isEmpty(this.resultList)) {
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_no_data'));
						this.srchAreaCtrl.reset();
						this.srchAreaCtrl.show_srch();
						this.resetFocus(this.$('#ca_srchCode'));
					} else {

						// 取得したデータを表示する
						// リクエストを保存。
						this.savedReq = srchReq;

						// 結果ペインを表示
						this.srchAreaCtrl.show_result();

						// 内容物がある場合 --> 結果表示する。
						this.recListView.setRecs(this.resultList);
						this.recListView.setDeletedRowUI(function(dto) {
							return dto.delFlag != 0;
						});
						// 初期選択の設定（オプション）
						if(!_.isEmpty(chkData)){
//							this.recListView.setSelectById(selectedIds, true);
							this.recListView.setSelectRecs(chkData, true);
						}
						this.resetFocus();
					}

				}, this)).fail(_.bind(function(data){
					console.log(data.rspHead);
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
		showAMMSV0240page: function(ope_mode, pgIndex/*一覧画面では利用しない*/, e){
			var url = clcom.appRoot + '/AMMS/AMMSV0240/AMMSV0240.html';

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
//				var chkData = util.chkmode(ope_mode, selectedRecs, this.validator, "fromDate", "toDate");
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
						savedCond: this.savedReq.AMMSV0230GetReq,
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
		}
	});


	// 画面初期表示
	clutil.getIniJSON(null, null)
	.done(_.bind(function(data,dataType){				// 画面の初期化を行う
		ca_listView = new ListView();
		ca_listView.initUIelement().render();
		console.log("_.bind start");
		clutil.setFocus($("#ca_srchCode"));
		if (clcom.pageData != null) {
			// メインviewにメソッド追加してもよい
			ca_listView.savedReq = clcom.pageData.savedReq;
			var cond = clcom.pageData.savedCond;
			clutil.data2view(ca_listView.$('#ca_searchArea'), cond);

			if (ca_listView.savedReq != null) {
				ca_listView.doSrch(clcom.pageData.savedReq, clcom.pageData.chkData,  $('#' + clcom.pageData.btnId));
			}
		}
		console.log("_.bind done");
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
