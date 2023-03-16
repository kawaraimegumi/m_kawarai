// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	clutil.enterFocusMode($('body'));

	var ListView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_srch" : "onSearchClick",
			"click #searchAgain" : "onResearchClick",
			"click .ca_detail_td a" : "onDetailClick",
			"click .ca_btn_td button" : "onBtnClick",
			"change #ca_srchProcState" : "onStateChange"
		},
		resultList : [],
		fundList : {}, //検索リスト

		initialize : function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: 'アラーム',
				subtitle: '一覧',
				btn_new:false,
				btn_csv: false
			});

			// グループID -- AMCMV0110 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMCMV0110';

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

			// 期限開始日：運用日マイナス「PAR_AMCM_ALARM_SEARCH_DAYS_FROM」
			var alarmSearchDays = clutil.getclsysparam('PAR_AMCM_ALARM_SEARCH_DAYS_FROM');
			var fromLimitDate = clutil.addDate(now, -alarmSearchDays);
			// 期限終了日：運用日プラス「PAR_AMCM_ALARM_SEARCH_DAYS_TO」
			var alarmSearchDaysTo = clutil.getclsysparam('PAR_AMCM_ALARM_SEARCH_DAYS_TO');
			var toLimitDate = clutil.addDate(now, alarmSearchDaysTo);

			//syspara
			this.today = now;
			this.UNTIL_LIMIT = clutil.getclsysparam('PAR_AMCM_DAYS_UNTIL_LIMIT', 3);
			this.alartday = function(now, addSec){
				var dt = new Date(Number(String(now).substring(0,4)), Number(String(now).substring(4,6)) - 1, Number(String(now).substring(6,8)));
				var baseSec = dt.getTime();
				var targetSec = baseSec + addSec;
				dt.setTime(targetSec);
				var y = dt.getFullYear();
				var m = ("0" + (dt.getMonth() + 1)).slice(-2);
				var d = ("0" + dt.getDate()).slice(-2);
				return Number("" + y + m + d);
			}(now, this.UNTIL_LIMIT * 86400000 /*日数 * 1日のミリ秒数*/);
			// datepicker
			clutil.datepicker(this.$("#ca_fromLimitDate")).datepicker("setIymd", fromLimitDate);
			clutil.datepicker(this.$("#ca_toLimitDate")).datepicker("setIymd", toLimitDate);

			clutil.cltypeselector(this.$("#ca_srchProcState"), amcm_type.AMCM_TYPE_MSG_PROC_TYPE);
			this.$("#ca_srchProcState").val(amcm_type.AMCM_VAL_MSG_PROC_TYPE_NOT_PROCESS);

			if (clcom.getUserData().user_typeid != amcm_type.AMCM_VAL_USER_STORE) {
				clutil.cltypeselector(this.$("#ca_alarmKind"), amcm_type.AMCM_TYPE_ALARM_KIND);
			} else {
				var list = this.getAlarmKindList();
				clutil.cltypeselector2(this.$("#ca_alarmKind"),list, 1, 0, 'type_id');
			}

			clutil.initUIelement(this.$el);

			// hide searchAgain button & click event
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.$('#ca_searchArea'),
					this.$('#ca_srch'),
					this.$('#ca_result'),
					this.$('#searchAgain'));

			return this;
		},

		getAlarmKindList: function() {
			var list = clcom.getTypeList(amcm_type.AMCM_TYPE_ALARM_KIND);
			var list2 = [];

			_.each(list, _.bind(function(type) {
				if (type.type_id != amcm_type.AMCM_VAL_ALARM_KIND_MST_ADMIN			// マスタ管理
						&& type.type_id != amcm_type.AMCM_VAL_ALARM_KIND_BUS_PLAN	// 営業計画
						&& type.type_id != amcm_type.AMCM_VAL_ALARM_KIND_COST_PLAN	// 経費計画
						&& type.type_id != amcm_type.AMCM_VAL_ALARM_KIND_DISCSALE	// 期間値下
						) {
					list2.push(type);
				}
			}, this));
			return list2;
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
				stval : 'ca_fromLimitDate',
				edval : 'ca_toLimitDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			if (!retStat) {
				return;
			}

			var searchData = clutil.view2data(this.$('#ca_searchArea'), 'ca_');
			searchData.srchUserID = clcom.userInfo.user_id;


			var req = {
					reqHead: {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMCMV0110GetReq : searchData
			};
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMCMV0110'){
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
		doSrch: function(srchReq, chkData, $focusElem, f_complete) {

			// 結果状態をクリアする
			this.clearResult();

			// データを取得
			var uri = 'AMCMV0110';
			clutil.postJSON(uri, srchReq).done(_.bind(function(data, dataType) {

					this.resultList = data.AMCMV0110GetRsp.alarmList;

					if (_.isEmpty(this.resultList)) {
						if (!f_complete) {
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_no_data'));
						}
//						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_no_data'));
						// 画面を一旦リセット
						this.srchAreaCtrl.reset();
						this.srchAreaCtrl.show_srch();
						this.resetFocus(this.$("#ca_srchProcState"));
					} else {

						// 取得したデータを表示する
						// リクエストを保存。
						this.savedReq = srchReq;

						// 結果ペインを表示
						this.srchAreaCtrl.show_result();

						// 内容物がある場合 --> 結果表示する。
						this.recListView.setRecs(this.resultList);

						// 初期選択の設定（オプション）
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
					if (!f_complete) {
						clutil.mediator.trigger('onTicker', data);
					}
//					clutil.mediator.trigger('onTicker', data);
					this.resetFocus();
			}, this));
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 参照
//				var $td = $(e.target);
//				if ($td.hasClass("cl_detail_td")){
//					console.log('detail-td click received.');
//					if($(e.target).is("p")){
//						var $tr = $(e.target).parent();
//						this._doDatailAction($tr,e);
//					}
//				} else {
//					return;
//				}
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * 内容行クリック
		 * @param $tr
		 */
		onDetailClick :function(e){
			var _this = this;
			var $tr = $(e.target).closest("tr");
			var data = $tr.data("cl_rec");
			var argStr = data.transitArg;
			var code = data.transitProgCode;
			var url = clcom.appRoot + '/' + code.substring(0,4) + '/' + code + '/' + code + '.html';
			var typeId = data.transitModeTypeID;
			var argArray = [];
			var pushPageOpt = {};

			// 処理完了でもリンク先に移動可能にする
//			if(data.procStatus == amcm_type.AMCM_VAL_MSG_PROC_TYPE_PROCESSED){
//				return;
//			}

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
			// エラー回避
			if(argArray.length == 0){
				argArray[0] = {};
			}
			console.log(argArray);

			switch(data.alarmTitle){
			case "マークダウン依頼":
			case "評価減":
				var url0220 = clcom.appRoot + '/AMCM/AMCMV0220/AMCMV0220.html';
				var getReq0220 = {
					srchUserID: clcom.getUserData().user_id,
					srchProcState: data.procStatus,
					msgFormID: data.msgFormID,
//					fromLimitDate: data.limitDate,
//					toLimitDate: data.limitDate,
					fromLimitDate: data.noticeDate,		// TrMsg.head.date（発生日）
					toLimitDate: data.limitDate,		// TrMsg.act_limit_date（対応期限日）
					showAllFlag: this.savedReq.AMCMV0110GetReq.showAllFlag
				};
				pushPageOpt = {
						url: url0220,
						args: {
							data: getReq0220,
							opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						},
						saved: {
							savedReq: this.savedReq,
							savedCond: this.savedReq.AMCMV0110GetReq,
							chkData: [data]
						},
						newWindow: true
				};

				break;
			case "返品依頼":
			case "移動依頼":
			case "移動依頼(リアソート)":
				argArray[0].srchLimitDate = data.limitDate;
				var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF
					},
					AMCMV0190GetReq: argArray[0]
				};
				var defer = clutil.postDLJSON("AMCMV0190", srchReq);
				defer.done(_.bind(function(data){
					// 「店舗返品依頼」帳票出力後に遷移
//					pushPageOpt = {
//						url: url,
//						args: {
//							data : argArray[0],
//							opeTypeId: typeId
//						},
//						saved: {
//							savedReq: this.savedReq,
//							savedCond: this.savedReq.AMCMV0110GetReq,
//							chkData: [data]
//						},
//						newWindow: true
//					};
//					if(!_.isEmpty(pushPageOpt)){
//						clcom.pushPage(pushPageOpt);
//					}
				}, this));
				defer.fail(_.bind(function(data){
					clutil.mediator.trigger('onTicker', data);
				}, this));
				return;
				break;
			case "逆ロス追求":
				//「逆ロス追求リスト」を印刷(?)
				var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF
					}
				};
				srchReq[argArray[1].request] = argArray[1];
				var defer = clutil.postDLJSON("AMBRV0060", srchReq);
				defer.done(_.bind(function(data){
					return;
				}, this));
				defer.fail(_.bind(function(data){
					clutil.mediator.trigger('onTicker', data);
				}, this));
				return;
				break;
			case "不良品処理報告":
				var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF
					},
					AMIGV0030GetReq: argArray[0]
				};
				if (data.procStatus == amcm_type.AMCM_VAL_MSG_PROC_TYPE_PROCESSED) {
				    srchReq.AMIGV0030GetReq.srchRprtStateID = amcm_type.AMCM_VAL_REPORT_STATE_OUTPUT;
				}
				var defer = clutil.postDLJSON("AMIGV0030", srchReq);
				defer.done(_.bind(function(arg){
					// アラーム完了報告
					_this._doClickReq({
						alarm : data,
						actTypeID : amcm_type.AMCM_VAL_MSG_ACTION_TYPE_ACT_01
					}).done(_.bind(function(arg){
						_this.doSrch(this.savedReq, null, null, true);
//						clutil.MessageDialog2('アラーム完了報告を受け付けました。');
					},this));
				}, this));
				defer.fail(_.bind(function(arg){
					clutil.mediator.trigger('onTicker', arg);
				}, this));
				return;
				break;
			// MD-3507 アラーム追加対応
			case "返品依頼番号誤り":
			case "処理済み返品依頼":
				var chkData = [];
				chkData.push({
					deliverID: argArray[0].deliverID,
					storeID: argArray[0].storeID,
				})
				pushPageOpt = {
						url: url,
						args: {
							chkData: chkData,
							opeTypeId: typeId,
						},
						saved: {
							savedReq: this.savedReq,
							savedCond: this.savedReq.AMCMV0110GetReq,
							chkData: [data],
						},
						newWindow: true
					};
				break;
//			case "商品台帳承認依頼":
//			case "発注兼振分承認依頼":
//			case "商品台帳差戻し":
//			case "発注兼振分差戻し":
//			case "未入荷アラーム":
//			case "補正件数入力":
//			case "不良品処理":
//			case "棚卸作業完了の差戻し":
//			case "ロス追求完了の差戻し":
//			case "出荷数相違アラーム":
//			case "入荷数相違アラーム":
//			case "検品データのＨＴ受信エラー":
//			case "ＳＣＭ入荷データのＨＴ受信エラー":
//			case "返品データのＨＴ受信エラー":
//			case "移動出荷データのＨＴ取込エラー":
//			case "移動入荷データのＨＴ取込エラー":
//			case "棚卸データのＨＴ取込エラー":
//			case "プライス別棚卸データのＨＴ受信エラー":
//			case "パスワード変更アラーム":
//			case "日別計画未入力":
//			case "日別計画差し戻し":
//			case "日別計画申請":
//			case "館内補正業者請求金額入力":
			default:
				pushPageOpt = {
					url: url,
					args: {
						data : argArray[0],
						opeTypeId: typeId
					},
					saved: {
						savedReq: this.savedReq,
						savedCond: this.savedReq.AMCMV0110GetReq,
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

		/**
		 *
		 * @param e
		 */
		onBtnClick : function(e){
			var _this = this;
			var $tr = $(e.target).closest("tr");
			var data = $tr.data("cl_rec");
			var actTypeID = $(e.target).data("acttypeid");
			var confirmFlag = $(e.target).data("confirmflag");

			if(data.procStatus == amcm_type.AMCM_VAL_MSG_PROC_TYPE_PROCESSED){
				return;
			}

			if (confirmFlag) {
				var msg = "登録してよろしいですか？";
				if (data.alarmTitle == "移動依頼(リアソート)") {
					msg = "店舗での移動出荷作業は完了していますか？";
				}
				//clutil.ConfirmDialog("登録してよろしいですか？", function(_this){
				clutil.ConfirmDialog(msg, function(_this){
					try{
						_this._doClickReq({
							alarm : data,
							actTypeID : actTypeID
						}).done(_.bind(function(data){
							_this.doSrch(_this.savedReq, null, null, true);
							clutil.MessageDialog2('アラーム完了報告を受け付けました。');
						},_this));
					}finally{
					}
				}, function(_this){
					console.log('CANCEL', arguments);
					try{
						return;;
					}finally{
					}
				}, _this);
			} else {
				this._doClickReq({
					alarm : data,
					actTypeID : actTypeID
				}).done(_.bind(function(data){
					this.doSrch(this.savedReq, null, null, true);
					clutil.MessageDialog2('アラーム完了報告を受け付けました。');
				},this));
			}

//			switch(data.alarmTitle){
//			case "不良品処理":
//			case "出荷数相違アラーム":
//			case "マークダウン依頼":
//			case "評価減":
				// アラーム消える
//				this._doClickReq({
//					alarm : data,
//					actTypeID : actTypeID
//				}).done(_.bind(function(data){
//					this.doSrch(this.savedReq);
//					clutil.MessageDialog2('アラーム完了報告を受け付けました。');
//				},this));
//				break;
//			default:
//				console.warn("undefined pattern clicked.");
//				break;
//			}
			return;
		},

		// [状態]項目変更時に期間設定を変更
		onStateChange : function(e){
			var $from = this.$("#ca_fromLimitDate");
			var $to = this.$("#ca_toLimitDate");
			var $div = $from.closest(".fieldUnit");
			var state = Number(this.$("#ca_srchProcState").val());
			if (state == amcm_type.AMCM_VAL_MSG_PROC_TYPE_NOT_PROCESS){ // 未処理
				// 期限必須なし
				$from.removeAttr("data-required2");
				$to.removeAttr("data-required2");
				$div.removeClass("required");
				this.validator.clear();
			} else {
				// 期限開始終了どちらか必須
				$from.attr("data-required2", "date");
				$to.attr("data-required2", "date");
				$div.addClass("required");
			}
		},

		_doClickReq : function(updreq){
			var req = {
					reqHead: {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
					},
					AMCMV0110UpdReq : updreq
			};
			return clutil.postJSON('AMCMV0110', req).fail(_.bind(function(data){
				console.log(data.rspHead);
				this.srchAreaCtrl.show_srch();
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
				this.resetFocus();
			},this));
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
//			var searchData = {
//				srchProcState : amcm_type.AMCM_VAL_MSG_PROC_TYPE_NOT_PROCESS,
////				fromLimitDate : "",
////				toLimitDate : clcom.getOpeDate(),
//				srchUserID : clcom.userInfo.user_id
//			};

			var searchData = clutil.view2data(this.$('#ca_searchArea'), 'ca_');
			searchData.srchUserID = clcom.userInfo.user_id;

			var req = {
				reqHead: {
					opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMCMV0110GetReq : searchData
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
		clutil.setFocus($("#ca_srchProcState"));
		if (clcom.pageData != null) {
			// メインviewにメソッド追加してもよい
			ca_listView.savedReq = clcom.pageData.savedReq;
			var cond = clcom.pageData.savedCond;
			clutil.data2view(ca_listView.$('#ca_searchArea'), cond);

			if (ca_listView.savedReq != null) {
				ca_listView.doSrch(clcom.pageData.savedReq, clcom.pageData.chkData,  $('#' + clcom.pageData.btnId));
			}
		} else {
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
