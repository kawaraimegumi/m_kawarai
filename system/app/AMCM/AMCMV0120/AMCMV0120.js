$(function(){

	clutil.enterFocusMode($('body'));


	var ListView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_srch" : "onSearchClick",
			"click #searchAgain" : "onResearchClick",
			"click .ca_detail_td a" : "onDetailClick",
		},
		resultList : [],
		fundList : {}, //検索リスト

		initialize : function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '通知',
				subtitle: '一覧',
				btn_new:false,
				btn_csv: false
			});

			// グループID -- AMCMV0120 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMCMV0120';

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
			clutil.datepicker(this.$("#ca_fromNoticeDate")).datepicker("setIymd", now);
			clutil.datepicker(this.$("#ca_toNoticeDate")).datepicker("setIymd", now);

			var list = clcom.getTypeList(amcm_type.AMCM_TYPE_NOTICE_KIND);
			var list2 = [];
			_.each(list, _.bind(function(l) {
				if (l.type_id != amcm_type.AMCM_VAL_NOTICE_KIND_NOT_HHT_NOTICE) {
					list2.push(l);
				}
			}, this));
			clutil.cltypeselector2(this.$("#ca_noticeKind"), list2, 1, 0, 'type_id');

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
			if(!this.validator.valid()){
				retStat = false;
			}
			if (!retStat) {
				return;
			}
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_fromNoticeDate',
				edval : 'ca_toNoticeDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			if (!retStat) {
				return;
			}

			var searchData = clutil.view2data(this.$('#ca_searchArea'), 'ca_');
			searchData.srchUserID = clcom.userInfo.user_id;

			if(searchData.srchDate == ""){
				searchData.srchDate = 0;
			}

			var req = {
					reqHead: {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMCMV0120GetReq : searchData
			};
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMCMV0120'){
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

		/**
		 * 内容行クリック
		 * @param $tr
		 */
		onDetailClick :function(e){
			var $tr = $(e.target).closest("tr");
			var data = $tr.data("cl_rec");
			var argStr = data.transitArg;
			var code = data.transitProgCode;
			var url = clcom.appRoot + '/' + code.substring(0,4) + '/' + code + '/' + code + '.html';
			var typeId = data.transitModeTypeID;
			var argArray = [];
			var pushPageOpt = {};

			if(data.alarmTitle == "返品依頼の伝票出力"){
				var argStr2 = " fromDate=" + data.noticeDate + " toDate=" + data.noticeDate + " srchOrgID=" + data.srcOrgID;
				argStr = argStr + argStr2;
			}

			if(argStr){
				$.each(argStr.split(";"), function(i,v){
					var obj = {};
					$.each(this.split(" "), function(){
						var array = this.split("=");
						if (array.length == 2){
							obj[array[0]] = array[1];
						}
					});
					argArray.push(obj);
				});
			}
			console.log(argArray);
			// エラー回避
			if(argArray.length == 0){
				argArray[0] = {};
			}

			switch(data.alarmTitle){
//			case "マークダウン依頼":
//			case "評価減":
//				var srchReq = {
//					reqHead: {
//						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF
//					},
//					AMCMV0190GetReq: argArray[0]
//				};
//				var defer = clutil.postDLJSON("AMCMV0190", srchReq);
//				defer.fail(_.bind(function(data){
//					clutil.mediator.trigger('onTicker', data);
//				}, this));
//				return;
//				break;
//			case "返品依頼":
			case "移動依頼実施のお知らせ":
				var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF
					},
					AMCMV0190GetReq: argArray[0]
				};
				var defer = clutil.postDLJSON("AMCMV0190", srchReq);
				defer.done(_.bind(function(data){
				}, this));
				defer.fail(_.bind(function(data){
					clutil.mediator.trigger('onTicker', data);
				}, this));
				return;
				break;
//			case "逆ロス追求":
//				//「逆ロス追求リスト」を印刷(?)
//				var srchReq = {
//					reqHead: {
//						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF
//					}
//				};
//				srchReq[argArray[1].request] = argArray[1];
//				var defer = clutil.postDLJSON("AMBRV0060", srchReq);
//				defer.done(_.bind(function(data){
//					return;
//				}, this));
//				defer.fail(_.bind(function(data){
//					clutil.mediator.trigger('onTicker', data);
//				}, this));
//				return;
//				break;
			case "返品依頼の伝票出力":
				var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF
					},
					AMCMV0140GetReq: argArray[0]
				};
				var defer = clutil.postDLJSON("AMCMV0140", srchReq);
				defer.done(_.bind(function(data){
				}, this));
				defer.fail(_.bind(function(data){
					clutil.mediator.trigger('onTicker', data);
				}, this));
				return;
				break;
			case "出荷数相違アラーム":
				var chkData = [];
				chkData.push({
					tranOutID: argArray[0].transOutID,
					storeID: argArray[0].storeID,
					InStoreID: argArray[0].InStoreID,
				})
				pushPageOpt = {
					url: url,
					args: {
						chkData: chkData,
						opeTypeId: typeId,
					},
					saved: {
						savedReq: this.savedReq,
						savedCond: this.savedReq.AMCMV0120GetReq,
						chkData: [data],
					},
					newWindow: true
				};
				break;
			default:
				pushPageOpt = {
					url: url,
					args: {
						data : argArray[0],
						opeTypeId: typeId
					},
					saved: {
						savedReq: this.savedReq,
						savedCond: this.savedReq.AMCMV0120GetReq,
						chkData: [data]
					},
					newWindow: true
				};
				break;
			}
			if(!_.isEmpty(pushPageOpt)){
				clcom.pushPage(pushPageOpt);
			}
			return;
		},

		// ページャークリック
		doSrch: function(srchReq, chkData, $focusElem) {

			// 結果状態をクリアする
			this.clearResult();

			// データを取得
			var uri = 'AMCMV0120';
			clutil.postJSON(uri, srchReq).done(_.bind(function(data, dataType) {

					this.resultList = data.AMCMV0120GetRsp.noticeList;

					if (_.isEmpty(this.resultList)) {
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_no_data'));
						// 画面を一旦リセット
						this.srchAreaCtrl.reset();
						this.srchAreaCtrl.show_srch();
						this.resetFocus(this.$("#ca_fromNoticeDate"));
					} else {

						// 取得したデータを表示する
						// リクエストを保存。
						this.savedReq = srchReq;

						// 結果ペインを表示
						this.srchAreaCtrl.show_result();

						// 内容物がある場合 --> 結果表示する。
						this.recListView.setRecs(this.resultList);

//						// 初期選択の設定（オプション）
//						if(!_.isEmpty(chkData)){
//							this.recListView.setSelectRecs(chkData, true);
//						}
						$("#ca_table .help").tooltip({html: true});

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

		firstSearch: function(){
			var searchData = {
					// 初期検索のfromDateは空にする #20141128
					fromNoticeDate : clcom.getOpeDate(),
					toNoticeDate : clcom.getOpeDate(),
			};
			if (clcom.pageArgs.noticeKind != null) {
				searchData.noticeKind = clcom.pageArgs.noticeKind;
			}

			searchData.srchUserID = clcom.userInfo.user_id;

			var req = {
					reqHead: {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMCMV0120GetReq : searchData
			};
			this.doSrch(req);
		}
	});


	// 画面初期表示
	clutil.getIniJSON(null, null, function(){
		console.log("completed()"); 			//コールバックtest表示
	})											//
	.done(_.bind(function(data,dataType){				// 画面の初期化を行う
		ca_listView = new ListView();
		ca_listView.initUIelement().render();
		clutil.setFocus($("#ca_fromNoticeDate"));
		if (clcom.pageData != null) {
			// メインviewにメソッド追加してもよい
			ca_listView.savedReq = clcom.pageData.savedReq;
			var cond = clcom.pageData.savedCond;
			clutil.data2view(ca_listView.$('#ca_searchArea'), cond);

			if (ca_listView.savedReq != null) {
				ca_listView.doSrch(clcom.pageData.savedReq, clcom.pageData.chkData,  $('#' + clcom.pageData.btnId));
			}
		} else if(clcom.pageArgs != null){
			// ポータルからのクリック遷移の場合は、期間条件開始をクリアしておく #20141128
			if(clcom.pageArgs.clearFromNoticeDate){
				clutil.datepicker($("#ca_fromNoticeDate")).datepicker("setIymd");
			}
			ca_listView.firstSearch();
		}
		if(clcom.pageArgs && clcom.pageArgs.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
			$("#header").find("p.back").remove();
			clcom._preventConfirm = true;
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
