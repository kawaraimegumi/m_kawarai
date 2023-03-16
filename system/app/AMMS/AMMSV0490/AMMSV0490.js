$(function(){

	clutil.enterFocusMode($('body'));

	var ListView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_srch" : "onSearchClick",
			"click #searchAgain" : "onResearchClick",
			"click #ca_btn_org_select" : "_onOrgSelClick"		// 組織選択ボタン押下
		},
		resultList : [],
		fundList : {}, //検索リスト

		initialize : function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				btn_new : false,
				title: '店舗',
				subtitle: '一覧',
				btn_csv: false
			});

			this.r_org_id = null;

			// グループID -- AMMSV0490 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMMSV0490';

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
			clutil.mediator.on('onOperation', this.showAMMSV0500page);


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

			// hide searchAgain button & click event
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.$('#ca_searchArea'),
					this.$('#ca_srch'),
					this.$('#ca_result'),
					this.$('#searchAgain'));

			// 組織選択画面
			this.AMPAV0020Selector = new  AMPAV0020SelectorView({
				el : this.$('#ca_AMPAV0020_dialog'),	// 配置場所
				$parentView		: this.$('#mainColumn'),
				isAnalyse_mode	: false,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_single_select,	// 複数選択モード
				anaProc			: this.anaProc
			});
			this.AMPAV0020Selector.render();

			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE					// 店舗
					|| clcom.userInfo.org_kind_typeid == amcm_type.AMCM_VAL_ORG_KIND_ZONE	// 所属がゾーン エリアのユーザ
					|| clcom.userInfo.org_kind_typeid == amcm_type.AMCM_VAL_ORG_KIND_AREA){
				this.orgAutocomplete = this.getOrg(clcom.userInfo.unit_id);
			} else {
				this.orgAutocomplete = this.getOrg(null);
			};

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

			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE){
				this.$("#ca_srchOrgID").autocomplete('clAutocompleteItem', {
					id		: clcom.userInfo.org_id,
					code	: clcom.userInfo.org_code,
					name	: clcom.userInfo.org_name
				}).attr("readonly", true);
				this.$("#ca_btn_org_select").attr("disabled", true);
			}

			if(clcom.userInfo.org_kind_typeid == amcm_type.AMCM_VAL_ORG_KIND_ZONE // 所属がゾーン エリアのユーザ
					|| clcom.userInfo.org_kind_typeid == amcm_type.AMCM_VAL_ORG_KIND_AREA){
				this.r_org_id = clcom.userInfo.unit_id;
				this.$("#ca_srchOrgID").autocomplete('clAutocompleteItem',{
					id 		: clcom.userInfo.org_id,
					code	: clcom.userInfo.org_code,
					name	: clcom.userInfo.org_name
				});
			}

			return this;
		},

		/**
		 * 組織オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: $('#ca_srchOrgID'),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				}
			});
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
					AMMSV0490GetReq : searchData
			};
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMMSV0490'){
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
			var uri = 'AMMSV0490';
			clutil.postJSON(uri, srchReq).done(_.bind(function(data, dataType) {

					this.resultList = data.AMMSV0490GetRsp.storeList;

					if (_.isEmpty(this.resultList)) {
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_no_data'));
						this.srchAreaCtrl.reset();
						this.srchAreaCtrl.show_srch();
						this.resetFocus(this.$("#ca_srchOrgID"));
					} else {

						// 取得したデータを表示する
						// リクエストを保存。
						this.savedReq = srchReq;

						// 結果ペインを表示
						this.srchAreaCtrl.show_result();

						// 内容物がある場合 --> 結果表示する。
						this.recListView.setRecs(this.resultList);

						// 初期選択の設定（オプション）
						if(!_.isEmpty(chkData)){
//							this.recListView.setSelectById(selectedIds, true);
							this.recListView.setSelectRecs(chkData, true, ["storeID"]);
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
		showAMMSV0500page: function(ope_mode, pgIndex/*一覧画面では利用しない*/, e){
			var url = clcom.appRoot + '/AMMS/AMMSV0500/AMMSV0500.html';

			// 画面遷移引数
			var pushPageOpt = null;

			switch(ope_mode){
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
						savedCond: this.savedReq.AMMSV0490GetReq,
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
		 * 組織選択ボタンクリック時
		 * @param e
		 */
		_onOrgSelClick: function(e) {
			var _this = this;
			this.AMPAV0020Selector.show(null, false, null, null, null, this.r_org_id);
			//サブ画面復帰後処理

			// 初期化
			this.AMPAV0020Selector.clear = function(){
				_this.orgAutocomplete.resetValue();
			};

			this.AMPAV0020Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					data[0].id = data[0].val;
					_this.orgAutocomplete.setValue(data[0]);
				} else {
					var org = _this.orgAutocomplete.getValue();
					if (org.id == 0) {
						_this.AMPAV0020Selector.clear();
					}
				}
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_org_select"));
				});

			};
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
		clutil.setFocus($("#ca_srchOrgID"));
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
