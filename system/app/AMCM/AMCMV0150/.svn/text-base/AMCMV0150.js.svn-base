$(function(){

	clutil.enterFocusMode($('body'));

	var ListView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_srch" : "onSearchClick",
			"click #searchAgain" : "onResearchClick",
			'click #ca_btn_store_select'	: '_onOrgSelClick',
			"click .ca_dl_td a" : "_doDLAction"
		},
		resultList : [],
		fundList : {}, //検索リスト

		initialize : function(opt){
			_.bindAll(this);

			// デフォルトは「参照」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				srchOrgID: 0,
				_view2data_srchOrgID_cn : {
					id :0,
					code:"",
					name:""
				},
				srchDate: clcom.getOpeDate(),
				chkData: []
			});

			this.options = fixopt;

			this.logID = 0;								//検索用ログID
			this.showError = 0;							//エラー参照フラグ
			this.srchDate = 0;							//検索日
			this.htDataType = 0;						//データ種別
			this.tmpl = this.$("#ca_tmpl_ALL");	//テーブルテンプレート
			if(this.options.chkData && this.options.chkData[0] ){
				if(this.options.chkData[0].id){
					this.logID = this.options.chkData[0].id;
				}
				this.showError = this.options.chkData[0].showError;
				this.srchDate = String(this.options.chkData[0].timestamp).substring(0,8);
				if(this.options.chkData[0].result == "NG" ||
				   this.options.chkData[0].showError != 0){
				  // NG行
				  this.showError = 1;  //エラー参照フラグを立てる #20150905
				  this.$("#ca_table").find("th:not(.ca_ERROR)").remove();
				  this.tmpl = this.$("#ca_tmpl_ERROR");
				}
				else {
				  // OK行
				  if(this.options.chkData[0].htDataType){
					this.htDataType = this.options.chkData[0].htDataType;
					switch(this.options.chkData[0].htDataType){
					case amcm_type.AMCM_VAL_HT_DATA_TRANS_IN:
						this.$("#ca_table").find("th:not(.ca_TRANS_IN)").remove();
						this.tmpl = this.$("#ca_tmpl_TRANS_IN");
						break;
					case amcm_type.AMCM_VAL_HT_DATA_TRANS_OUT:
						this.$("#ca_table").find("th:not(.ca_TRANS_OUT)").remove();
						this.tmpl = this.$("#ca_tmpl_TRANS_OUT");
						break;
					case amcm_type.AMCM_VAL_HT_DATA_INVENT:
						this.$("#ca_table").find("th:not(.ca_INVENT)").remove();
						this.tmpl = this.$("#ca_tmpl_INVENT");
						break;
					case amcm_type.AMCM_VAL_HT_DATA_INVENT_PRICE:
						this.$("#ca_table").find("th:not(.ca_INVENT_PRICE)").remove();
						this.tmpl = this.$("#ca_tmpl_INVENT_PRICE");
						break;
					case amcm_type.AMCM_VAL_HT_DATA_TRANS_IN_SCM:
						this.$("#ca_table").find("th:not(.ca_TRANS_IN_SCM)").remove();
						this.tmpl = this.$("#ca_tmpl_TRANS_IN_SCM");
						break;
					case amcm_type.AMCM_VAL_HT_DATA_RETURN:
						this.$("#ca_table").find("th:not(.ca_RETURN)").remove();
						this.tmpl = this.$("#ca_tmpl_RETURN");
						break;
					case amcm_type.AMCM_VAL_HT_DATA_ORDER:
						this.$("#ca_table").find("th:not(.ca_ORDER)").remove();
						this.tmpl = this.$("#ca_tmpl_ORDER");
						break;
					default:
						clutil.mediator.trigger("onTicker","データ種別が不明です。");
						break;
					}
				  }
				}
			}

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: 'HTデータ取込ログ',
				subtitle: '明細',
				opeTypeId: -1,
				btn_submit: true,
				btn_cancel: true
			});


			// グループID -- AMCMV0150 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMCMV0150';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( this.tmpl.html() )
			});

			// イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント
//
//			// OPE系イベント
//			clutil.mediator.on('onOperation', this._doOpeAction);

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
//			clutil.datepicker(this.$("#ca_fromDate")).datepicker("setIymd", now);
//			clutil.datepicker(this.$("#ca_toDate")).datepicker("setIymd", now);

			clutil.cltypeselector(this.$("#ca_htDataType"), amcm_type.AMCM_TYPE_HT_DATA);

			// hide searchAgain button & click event
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.$('#ca_searchArea'),
					this.$('#ca_srch'),
					this.$('#ca_result'),
					this.$('#searchAgain'));

			return clutil.clbusunitselector(this.$("#ca_srchUnitID"));
		},

		/**
		 * 画面描画
		 */
		render: function() {
			// 初期値設定
			this.$("#ca_srchUnitID").selectpicker('val', clutil.cStr(this.options.srchUnitID));
			if (this.options._view2data_srchOrgID_cn.id) {
				this.$("#ca_srchOrgID").val(this.options._view2data_srchOrgID_cn.code + ":" + this.options._view2data_srchOrgID_cn.name);
			}
			if (this.options.chkData && this.options.chkData[0]) {
				this.$("#ca_htDataType").selectpicker('val', clutil.cStr(this.options.chkData[0].htDataType));
				var tsStr = "";
				if (this.options.chkData[0].timestamp){
					tsStr = String(this.options.chkData[0].timestamp);
					var stDisp = tsStr.substring(0,4);
					stDisp += "/" + tsStr.substring(4,6);
					stDisp += "/" + tsStr.substring(6,8);
					stDisp += " " + tsStr.substring(8,10);
					stDisp += ":" + tsStr.substring(10,12);
					stDisp += ":" + tsStr.substring(12,14);
					this.$("#ca_timestamp").val(stDisp);
				}
			}
//			clutil.initUIelement();
			this.mdBaseView.render();
			this.recListView.render();
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}
			//一覧画面が参照(別窓)だった場合、こちらも「＜」を消しておく
			if(this.options.isRel){
				$("#header").find("p.back").remove();
			}
			this.onSearchClick();
			return this;
		},


		/**
		 * 検索ボタン押下
		 */
		onSearchClick : function(){
			var searchData = {
					logID : this.logID,
					showError : this.showError,
					srchDate : Number(this.srchDate)
			};

			var req = {
					reqHead: {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMCMV0150GetReq : searchData
			};
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMCMV0150'){
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

//		/**
//		 * 検索条件を再指定 押下
//		 */
//		onResearchClick : function(){
//			this.srchAreaCtrl.show_srch();
//		},

		// ページャークリック
		doSrch: function(srchReq, chkData, $focusElem) {

			// 結果状態をクリアする
			this.clearResult();

			// データを取得
			var uri = 'AMCMV0150';
			clutil.postJSON(uri, srchReq).done(_.bind(function(data, dataType) {

					this.resultList = data.AMCMV0150GetRsp.detailList;

					if (_.isEmpty(this.resultList)) {
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_no_data'));
						this.srchAreaCtrl.show_both();
						this.resetFocus(this.$("#ca_srchCode"));
					} else {

						// 取得したデータを表示する
						// リクエストを保存。
						this.savedReq = srchReq;

						// 結果ペインを表示
						this.srchAreaCtrl.show_both();
//						this.srchAreaCtrl.show_result();

						// 内容物がある場合 --> 結果表示する。
						this.recListView.setRecs(this.resultList);

						this.resetFocus();
					}

				}, this)).fail(_.bind(function(data){
					console.log(data.rspHead);
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
//				if(this.$("#searchAgain").css("display")=="none"){
//					clutil.setFocus(this.$("#ca_srch"));
//				} else {
//					clutil.setFocus(this.$("#searchAgain"));
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
		ca_listView = new ListView(clcom.pageArgs);
		ca_listView.initUIelement().done(_.bind(function(){
			ca_listView.render();
		},this));
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
