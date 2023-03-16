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
			"click .ca_dl_td a" : "_doDLAction"
		},
		resultList : [],
		fundList : {}, //検索リスト

		initialize : function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: 'HTデータ取込ログ',
				subtitle: '一覧',
				btn_new:false,
				btn_csv: false
			});

			// グループID -- AMCMV0140 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMCMV0140';

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

			// 店舗部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
		},

		initUIelement : function(){
			var _this = this;
			this.mdBaseView.initUIElement();
			this.recListView.initUIElement();

			clutil.inputlimiter(this.$el);

			var now = clcom.getOpeDate();
			console.log(now);
			// datepicker
			clutil.datepicker(this.$("#ca_fromDate")).datepicker("setIymd", now);
			clutil.datepicker(this.$("#ca_toDate")).datepicker("setIymd", now);

			clutil.cltypeselector(this.$("#ca_htDataType"), amcm_type.AMCM_TYPE_HT_DATA);

			// hide searchAgain button & click event
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.$('#ca_searchArea'),
					this.$('#ca_srch'),
					this.$('#ca_result'),
					this.$('#searchAgain')
			);

			// 事業ユニット-店舗リレーション
			this.relation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: '#ca_srchUnitID'//,
//					initValue: clcom.userInfo.unit_id
				},
				// 店舗オートコンプリート
				clorgcode: {
					el: '#ca_srchOrgID',
					// p_org_idに依存するために必要
					addDepends: ['p_org_id'],
					dependSrc: {
						// unit_idをp_org_idに設定するために必要
						p_org_id: 'unit_id'
					}
				},
				// 店舗参照ボタン
				AMPAV0010: {
					button: this.$('#ca_btn_store_select'),
					// this.AMPAV0010SelectorはAMPAV0010SelectorViewインスタンス、あらかじめ
					// 初期化しておく
					view: this.AMPAV0010Selector,
					// this.AMPAV0010Selector.show()へのオプション
					showOptions: function(){
						// 店舗階層のみ表示するようにorg_kind_setを指定する
						return {
							org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
						};
					}
				}
			}, {
				dataSource: {
					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
				}
			});


			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					data[0].id = data[0].val;
					_this.$("#ca_srchOrgID").autocomplete("clAutocompleteItem", data[0]);
				} else {
					var chk = $("#ca_srchOrgID").autocomplete("clAutocompleteItem");

					if (chk == null || chk.id == 0)  {
						_this.AMPAV0010Selector.clear();
					}
				}
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
			this.AMPAV0010Selector.clear = function() {
				$("#ca_srchOrgID").autocomplete("removeClAutocompleteItem");
			};

			return this.relation;
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
			this.AMPAV0010Selector.render();
			this.AMPAV0010Selector.clear();
			if(clcom.userInfo && (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) && clcom.userInfo.org_id){
				this.$("#ca_srchOrgID").autocomplete('clAutocompleteItem', {
					id: clcom.userInfo.org_id,
					code: clcom.userInfo.org_code,
					name: clcom.userInfo.org_name
				});
				this.$("#ca_srchOrgID").attr("readonly", true);
				this.$('#ca_btn_store_select').attr("disabled", true);
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
				stval : 'ca_fromDate',
				edval : 'ca_toDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			if (!retStat) {
				return;
			}

			var searchData = clutil.view2data(this.$('#ca_searchArea'), 'ca_');

			var req = {
					reqHead: {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMCMV0140GetReq : searchData
			};
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMCMV0140'){
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
			var uri = 'AMCMV0140';
			clutil.postJSON(uri, srchReq).done(_.bind(function(data, dataType) {

					this.resultList = data.AMCMV0140GetRsp.logList;

					if (_.isEmpty(this.resultList)) {
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_no_data'));
						// 画面を一旦リセット
						this.srchAreaCtrl.reset();
						this.srchAreaCtrl.show_srch();
						this.resetFocus(this.$("#ca_srchCode"));
					} else {

						$.each(this.resultList,function(){
							if (this.timestamp != 0) {
								this.timestampDisp = String(this.timestamp).substring(0,4) + "/" + String(this.timestamp).substring(4,6) + "/" + String(this.timestamp).substring(6,8) +
								" " + String(this.timestamp).substring(8,10) + ":" + String(this.timestamp).substring(10,12)+ ":" + String(this.timestamp).substring(12,14);
							}
						});

						// 取得したデータを表示する
						// リクエストを保存。
						this.savedReq = srchReq;
						console.log(this.savedReq);

						// 結果ペインを表示
						this.srchAreaCtrl.show_result();

						// 内容物がある場合 --> 結果表示する。
						this.recListView.setRecs(this.resultList);

						// 初期選択の設定（オプション）
//						if(!_.isEmpty(chkData)){
//							this.recListView.setSelectRecs(chkData, true);
//						}
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
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			if($(e.target).is("a")){
				console.log('e.target is a');
				var $mytd = $(e.target);
				if ($mytd.hasClass("ca_ng_td")){
					console.log('ng-td click received.');
					this.showRELpage(rtyp, pgIndex, e, 1);
				}
				return;
			}
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 参照
				var $td = $(e.target);
				if ($td.hasClass("ca_dl_td")){
					console.log('dl-td click received.');
				} else if ($td.hasClass("ca_ng_td")){
					console.log('ng-td click received.');
					this.showRELpage(rtyp, pgIndex, e, 1);
				} else {
					console.log('rel-td click received.');
					this.showRELpage(rtyp, pgIndex, e, 0);
				}
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * 内容行クリック
		 * @param e
		 */
		_doDLAction :function(e){
			var $tr = $(e.target).closest("tr");
			var logID = $tr.attr("id");
			var htDataType = $tr.data("htdatatype");
			var tmpOpeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF;
			if (htDataType == amcm_type.AMCM_VAL_HT_DATA_INVENT_PRICE) {
				tmpOpeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV;
			}
			var timestamp = $tr.data("timestamp");
			var date = String(timestamp).substring(0,8);
			var srchReq = {
					reqHead : {
						opeTypeId : tmpOpeTypeId
					},
					AMCMV0140GetReq : {
						id : logID,
						srchUnitID: this.savedReq.AMCMV0140GetReq.srchUnitID,
						srchOrgID: this.savedReq.AMCMV0140GetReq.srchOrgID,
						htDataType : htDataType,
						fromDate : date,
						toDate : date,
					}
			};

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMCMV0140', srchReq).done(_.bind(function(data){
				// 表示変更clutil.gettypename(amcm_type.AMCM_TYPE_SLIP_PRINT, statusType).replace("印刷","出力")
				$tr.find(".ca_status_td").html(clutil.gettypename(amcm_type.AMCM_TYPE_SLIP_PRINT, amcm_type.AMCM_VAL_SLIP_PRINT_DONE).replace("印刷","出力"));
			})).fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
			return;
		},

		/**
		 * 画面遷移
		 * @param ope_mode
		 */
		showRELpage: function(ope_mode, pgIndex/*一覧画面では利用しない*/, e, showError){
			var url = clcom.appRoot + '/AMCM/AMCMV0150/AMCMV0150.html';

			// 画面遷移引数
			var pushPageOpt = null;

			switch(ope_mode){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				var clickedRec = this.recListView.getLastClickedRec();
				if(_.isEmpty(clickedRec)){
					console.warn('照会：クリックした行が不明・・・Skip');
					return;
				}
				if( clickedRec != null ){
					clickedRec.showError = showError;
				}
				pushPageOpt = {
					url: url,
					args: {
						btnId: e.target.id,
						opeTypeId: ope_mode,
						srchDate: this.savedReq.AMCMV0140GetReq.srchFromDate,
						srchUnitID: this.savedReq.AMCMV0140GetReq.srchUnitID,
						srchOrgID: this.savedReq.AMCMV0140GetReq.srchOrgID,
						_view2data_srchOrgID_cn: this.savedReq.AMCMV0140GetReq._view2data_srchOrgID_cn,
						chkData: [ clickedRec ],
						isRel : clcom._preventConfirm == true
					},
					saved: {
						btnId: e.target.id,
						savedReq: this.savedReq,
						savedCond: this.savedReq.AMCMV0140GetReq,
						chkData: this.recListView.getLastClickedRec(),
						isRel : clcom._preventConfirm == true
					}
				};
				break;
			default:										// その他、新規、編集、予約取消、削除
				console.warn('照会以外:'+ ope_mode);
				return;
				break;
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
		 * 初期検索
		 * @param pageArgs
		 */
		transitSrch : function(pageArgs){
			var data = pageArgs.data;
			var opeTypeId = pageArgs.opeTypeId;
			if(data.vpHtDataType){
				this.$("#ca_htDataType").selectpicker("val", data.vpHtDataType);
			}
			if(data.vpFromDate){
				this.$("#ca_fromDate").datepicker("setIymd", data.vpFromDate);
			}
			if(data.vpToDate){
				this.$("#ca_toDate").datepicker("setIymd", data.vpToDate);
			}
			clutil.initUIelement(this.$("#ca_htDataType"));

//			clutil.data2view(this.$('#ca_searchArea'), data);

			var req = {
					reqHead: {
						opeTypeId : opeTypeId,
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMCMV0140GetReq : clutil.view2data(this.$("#ca_searchArea"))
			};
			this.doSrch(req);
		},
	});


	// 画面初期表示
	clutil.getIniJSON(null, null, function(){
		console.log("completed()"); 			//コールバックtest表示
	})											//
	.done(_.bind(function(data,dataType){				// 画面の初期化を行う
		ca_listView = new ListView();
		ca_listView.initUIelement().done(_.bind(function(){
			ca_listView.render();
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					clutil.setFocus($('#ca_htDataType'));
				}
				else if(clcom.userInfo.permit_top_org_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.setFocus($('#ca_srchOrgID'));
				}
				else{
					clutil.setFocus($('#ca_srchUnitID'));
				}
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
			if (clcom.pageData != null) {
				// メインviewにメソッド追加してもよい
				ca_listView.savedReq = clcom.pageData.savedReq;
				var cond = clcom.pageData.savedCond;
				clutil.data2view(ca_listView.$('#ca_searchArea'), cond);
				if(clcom.pageData.isRel){// かつてアラーム一覧から来た
					$("#header").find("p.back").remove();
					clcom._preventConfirm = true;
				}

				if (ca_listView.savedReq != null) {
					ca_listView.doSrch(clcom.pageData.savedReq, clcom.pageData.chkData,  $('#' + clcom.pageData.btnId));
				}
			} else if(clcom.pageArgs != null) { //アラーム一覧から(clcom.pageArgs.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL)
				console.log(JSON.stringify(clcom.pageArgs));
				ca_listView.transitSrch(clcom.pageArgs);
				if(clcom.pageArgs && clcom.pageArgs.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					$("#header").find("p.back").remove();
					clcom._preventConfirm = true;
				}
			}
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
