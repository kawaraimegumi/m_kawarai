$(function(){

	clutil.enterFocusMode($('body'));

	var ListView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			".complete-btn > a" : "_onCompleteLinkClick"
		},
		resultList : [],

		initialize : function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				btn_new : false,
				title: 'ＳＣ依頼',
				subtitle: '一覧',
				btn_csv: false
			});

			// グループID -- AMCMV0180 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMCMV0180';

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

			clutil.inputlimiter(this.$el);

			var now = clcom.getOpeDate();
			console.log(now);
			// datepicker
			clutil.datepicker(this.$("#ca_srchDate"));
			this.$("#ca_srchDate").datepicker("setIymd", now);

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
			// TODO:検索条件入力
			var searchData = {};
			searchData.storeID = clcom.userInfo.org_id;
			//show results
			var req = {
					reqHead: {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMCMV0180GetReq : searchData
			};
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMCMV0180'){
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
//		onResearchClick : function(){
//			this.srchAreaCtrl.show_srch();
//		},

		// ページャークリック
		doSrch: function(srchReq, chkData, $focusElem) {

			// 結果状態をクリアする
			this.clearResult();

			// データを取得
			var uri = 'AMCMV0180';
			clutil.postJSON(uri, srchReq).done(_.bind(function(data, dataType) {

					this.resultList = data.AMCMV0180GetRsp.instructRecord;

					if (this.resultList == null || this.resultList.length == 0) {
						this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
						this.$('#ca_result').show();
					} else {

						// 取得したデータを表示する
						// リクエストを保存。
						this.savedReq = srchReq;

						// 内容物がある場合 --> 結果表示する。
						this.recListView.setRecs(this.resultList);

						// 初期選択の設定（オプション）
						if(!_.isEmpty(chkData)){
							this.recListView.setSelectRecs(chkData, true);
						}
						this.$('#ca_result').show();

//						this.resetFocus($focusElem);
						//TODO:どこにフォーカスする？
					}

				}, this)).fail(_.bind(function(data){
					console.log(data.rspHead);
//					this.srchAreaCtrl.show_srch();
					// エラーメッセージを通知。
					clutil.mediator.trigger('onTicker', data);
					this.resetFocus();
			}, this));
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規作成
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 参照
				var $td = $(e.target);
				if ($td.is("a") || $td.hasClass("complete-btn")){
					console.log('complete click received.');
					return;
//				} else if ($(e.target).is(this.$("#cl_rel"))){
//					this.showAMMSV0500page(rtyp, pgIndex, e);
				} else {
					return;
				}
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:	// PDF 出力
				console.log('PDF 出力');
				this.doPDFDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		buildReq: function(rtyp){
			//リクエストの内容をセットする
			var selectedRecs = this.recListView.getSelectedRecs();
			var srchDto = {
					srchStoreID : clcom.userInfo.org_id,
					srchTypeID : selectedRecs[0].type,
					srchID : selectedRecs[0].instructID
			};
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				AMCMV0190GetReq: srchDto
			};

			return reqDto;
		},

		doPDFDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMCMV0190', srchReq);
			defer.fail(_.bind(function(data){
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		// 完了ボタンクリック
		_onCompleteLinkClick : function(e){
			var $tr = $(e.target);
			this.doComplete($tr);
		},

		/**
		 * マークダウン依頼完了
		 */
		doComplete : function($tr){
			var instructID = Number($tr.attr("id"));
			var req = {
					reqHead : {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD	//TODO:何？
					},
					AMCMV0180UpdReq : {
						storeID : clcom.userInfo.org_id,
						instructTypeID : amcm_type.AMCM_VAL_REQUEST_TYPE_MARK_DOWN,
						instructID : instructID
					}
			};
			var defer = clutil.postJSON('AMCMV0180', req);
			defer.done(_.bind(function(data){
				$tr.find("td.status_line").html("済");
				$tr.find(".complete_btn").html("").removeClass("complete-btn");
			}, this));
			// this.doSrch(this.savedReq); 再検索必要？
			defer.fail(_.bind(function(data){
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

//		/**
//		 * 登録・修正画面遷移
//		 * @param ope_mode
//		 */
//		showAMMSV0500page: function(ope_mode, pgIndex/*一覧画面では利用しない*/, e){
//			var url = clcom.appRoot + '/AMMS/AMMSV0500/AMMSV0500.html';
//
//			// 画面遷移引数
//			var pushPageOpt = null;
//
//			switch(ope_mode){
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
//				var clickedRec = this.recListView.getLastClickedRec();
//				if(_.isEmpty(clickedRec)){
//					console.warn('照会：クリックした行が不明・・・Skip');
//					return;
//				}
//				pushPageOpt = {
//					url: url,
//					args: {
//						btnId: e.target.id,
//						opeTypeId: ope_mode,
//						srchDate: this.savedReq.srchDate,
//						chkData: [ clickedRec ]
//					},
//					newWindow: true				// 別窓で照会画面を起動
//				};
//				break;
//			default:										// その他、編集、予約取消、削除
//				var selectedRecs = this.recListView.getSelectedRecs();
//				if(_.isEmpty(selectedRecs)){
//					console.warn(clutil.opeTypeIdtoString(ope_mode) + ': なにもチェックされていない・・・Skip');
//					return;
//				}
//				pushPageOpt = {
//					url: url,
//					args: {
//						opeTypeId: ope_mode,
//						srchDate: this.savedReq.srchDate,
//						chkData: this.recListView.getSelectedRecs()
//					},
//					saved: {
//						btnId: e.target.id,
//						savedReq: this.savedReq,
//						savedCond: this.savedReq.AMCMV0180GetReq,
//						chkData: this.recListView.getSelectedRecs()
//					}
//				};
//			}
//			if(pushPageOpt){
//				clcom.pushPage(pushPageOpt);
//			}
//		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFocus($focusElem);
			}else{
				// TODO : 適当な場所を select してフォーカスを入れる。
//				if (this.$('#searchAgain').css('display') == 'none') {
//					// 検索ボタンにフォーカスする
//					this.$('#ca_AMRSV0010_search').focus();
//				} else {
//					// 条件を追加ボタンにフォーカスする
//					this.$('#ca_AMRSV0010_add').focus();
//				}
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
	clutil.getIniJSON(null, null, function(){
		console.log("completed()"); 			//コールバックtest表示
	})											//
	.done(_.bind(function(data,dataType){				// 画面の初期化を行う
		ca_listView = new ListView();
		ca_listView.initUIelement().render();
		console.log("_.bind start");
		clutil.setFocus($("#ca_srchCode"));
		if (clcom.pageData != null) {
			// メインviewにメソッド追加してもよい
			ca_listView.savedReq = clcom.pageData.savedReq;
			var cond = clcom.pageData.savedCond;

			if (ca_listView.savedReq != null) {
				ca_listView.doSrch(clcom.pageData.savedReq, clcom.pageData.chkData,  $('#' + clcom.pageData.btnId));
			}
		} else {
			console.log("userInfo:" + JSON.stringify(clcom.userInfo));
			//TODO:初期検索追加
			ca_listView.onSearchClick();
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
