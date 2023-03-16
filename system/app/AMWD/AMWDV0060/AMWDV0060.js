//セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){
	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),

		events: {
			"click .ca_btn_store"	: "_onStoreSelClick",		// 店舗選択補助画面起動
			'click #ca_srch'		: '_onSrchClick'			// 検索ボタン押下時
		},

		initialize: function(opt){
			_.bindAll(this);
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			clutil.inputlimiter(this.$el);

			//サブ画面配置
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector.render();

			// 検索日区分
			clutil.cltypeselector(this.$("#ca_srchYMD"), amcm_type.AMCM_TYPE_DEVALUE_SEARCH_DATE2, 1);
			$('#ca_srchYMD').selectpicker('val', amcm_type.AMCM_VAL_DEVALUE_SEARCH_DATE2_CURRENT_AGE);
			// シーズン区分
			clutil.cltypeselector(this.$("#ca_srchSeason"), amcm_type.AMCM_TYPE_SEASON, 1);

			// 初期値を設定
			this.deserialize({
				srchYMD: 1,					// 検索日
				srchTotalType: "1",			//ラジオボタン
				srchSeasonID: 0				// シーズン区分
			});

			var unit = null;
			//店舗オートコンプ
			this.srcStoreIdField = clutil.clorgcode({
				el: $("#ca_srcStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});

			//店舗 or 店長ユーザなら組織部品に初期値設定
			var userType = clcom.userInfo.user_typeid;
			if(userType == amcm_type.AMCM_VAL_USER_STORE
					|| userType == amcm_type.AMCM_VAL_USER_STORE_MAN){
				var userStore = {
						id : clcom.getUserData().org_id,
						code : clcom.getUserData().org_code,
						name: clcom.getUserData().org_name
				};
				$("#ca_srcStoreID").autocomplete('clAutocompleteItem', userStore);
			}
		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			var data = clutil.view2data(this.$el);

			data.srchTotalType = Number(data.srchTotalType);
			data.srchYMD = Number(data.srchYMD);

			if(data.srchSeason == null || data.srchSeason.length == 0){
				data.srchSeason = [];
			}
			else{
				for(var i=0; i<data.srchSeason.length; i++){
					data.srchSeason[i] = Number(data.srchSeason[i]);
				}
			}

			return data;
		},

		/**
		 * 検索リクエストパケットの設定値を UI へセットする。
		 */
		deserialize: function(obj){
			this.deserializing = true;
			try{
				var dto = _.extend({}, obj);
				clutil.data2view(this.$el, dto);
			}finally{
				this.deserializing = false;
			}
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			var retStat = true;

			// 日付エラー確認
			if(!this.validator.valid()){
				retStat = false;
			}
			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return false;
			}
		},

		/**
		 * 店舗参照押下
		 */
		_onStoreSelClick: function(e) {
			var _this = this;

			var unit = null;
			_this.AMPAV0010Selector.show(null, null,{
				org_id: unit,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),		//基本組織を対象
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
			});

			// 選択サブ画面復帰処理
			_this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					var d = data[0];
					_this.srcStoreIdField.setValue({
						id: d.val,
						code: d.code,
						name: d.name
					});
				}
				_.defer(function(){// setFocusを_.defer()で後回しにする
					$(e.target).focus();
				});
			};
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 取引先コード・オートコンプリート設定チェック
			if(this.isValid() == false){
				return;
			}
			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMWDV0060.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '年令別在庫',
				subtitle: '確認',
				btn_new: false,
				btn_csv: true
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});
			// グループID -- AMWDV0060 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMWDV0060';
			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント
			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			this.recListView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));
			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.srchCondView.render();
			this.recListView.render();
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}
			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;

			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				if(this.srchCondView.isValid()){
					srchReq = this.srchCondView.serialize();

				}else{
					// メッセージは、srchConcView 側で出力済。
					return;
				}
			}

			//ラジオボタン条件を付ける
			var radio = $("input:radio[name=ca_srchTotalType]:checked");
			var selBtn = radio.val();
			srchReq.srchTotalType = selBtn;

			srchReq.srchYMD = Number(srchReq.srchYMD);
			srchReq.srchTotalType = Number(srchReq.srchTotalType);

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
				reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMWDV0060GetReq: srchReq
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);
			// 検索実行
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			if(groupid !== 'AMWDV0060'){
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
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedIds){
			this.clearResult();
			var defer = clutil.postJSON('AMWDV0060', srchReq).done(_.bind(function(data){
				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMWDV0060GetRsp.stockRecords;

				var radio = $("input:radio[name=ca_srchTotalType]:checked");
				var selBtn = radio.val();

				if(_.isEmpty(recs)){
					// 検索ペインを表示？
					mainView.srchAreaCtrl.reset();
					mainView.srchAreaCtrl.show_srch();
					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

					if(selBtn == "1"){
						//合計表示ならシーズン列非表示
						$(".ca_seasonLine").addClass("dispn");
					}
					else{
						//シーズン表示ならシーズン列表示
						$(".ca_seasonLine").removeClass("dispn");
					}

					return;
				}

				// リクエストを保存。
				this.savedReq = srchReq;
				// 結果ペインを表示
				this.srchAreaCtrl.show_result();
				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);

				if(selBtn == "1"){
					//合計表示ならシーズン列非表示
					$(".ca_seasonLine").addClass("dispn");
				}
				else{
					//シーズン表示ならシーズン列表示
					$(".ca_seasonLine").removeClass("dispn");
				}

				//評価減年令により、セル背景色を変化させる
				this.setCell(recs);
				// 初期選択の設定（オプション）
				if(!_.isEmpty(selectedIds)){
					this.recListView.setSelectById(selectedIds, true);
				}
				this.resetFocus();

			}, this)).fail(_.bind(function(data){
				// 検索ペインを表示
				mainView.srchAreaCtrl.reset();
				mainView.srchAreaCtrl.show_srch();
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
				this.resetFocus();
			}, this));
			return defer;
		},

		/**
		 * 評価減年令により、セル背景色を変化させる
		 * 2:赤(評価減対象)、1:黄(評価減1年以内)、0:なし
		 */
		setCell: function(recs){
			for(var i=0; i<recs.length; i++){
				if(recs[i].age4_f_hg == 2){
					$("tr").eq(i+3).find(".ca_age4Area").addClass("errorCell");
				}
				else if(recs[i].age4_f_hg == 1){
					$("tr").eq(i+3).find(".ca_age4Area").addClass("alertCell");
				}

				if(recs[i].age3_f_hg == 2){
					$("tr").eq(i+3).find(".ca_age3Area").addClass("errorCell");
				}
				else if(recs[i].age3_f_hg == 1){
					$("tr").eq(i+3).find(".ca_age3Area").addClass("alertCell");
				}

				if(recs[i].age2_f_hg == 2){
					$("tr").eq(i+3).find(".ca_age2Area").addClass("errorCell");
				}
				else if(recs[i].age2_f_hg == 1){
					$("tr").eq(i+3).find(".ca_age2Area").addClass("alertCell");
				}

				if(recs[i].age1_f_hg == 2){
					$("tr").eq(i+3).find(".ca_age1Area").addClass("errorCell");
				}
				else if(recs[i].age1_f_hg == 1){
					$("tr").eq(i+3).find(".ca_age1Area").addClass("alertCell");
				}

				if(recs[i].age0_f_hg == 2){
					$("tr").eq(i+3).find(".ca_age0Area").addClass("errorCell");
				}
				else if(recs[i].age0_f_hg == 1){
					$("tr").eq(i+3).find(".ca_age0Area").addClass("alertCell");
				}
			}
		},


		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			var userType = clcom.userInfo.user_typeid;
			if(userType == amcm_type.AMCM_VAL_USER_STORE
					|| userType == amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.setFocus($('#ca_srchYMD'));
				clutil.viewReadonly($("#ca_srcStoreIDArea"));
			}
			else{
				clutil.setFocus($('#ca_srcStoreID'));
			}
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function(){
			if (this.$('#searchAgain').css('display') == 'none') {
				// 検索ボタンにフォーカスする
				this.$('#ca_srch').focus();
			} else {
				 //再検索にフォーカスする
				//this.$('#searchAgain').focus();
				$('#searchAgain').focus();
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pageIndex, e){
			var url = clcom.appRoot + '/AMWD/AMWDV0070/AMWDV0070.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMWDV0060GetReq,
					selectedIds: this.recListView.getSelectedIdList()
				};
				destData = {
					opeTypeId: rtyp,
					srchDate: this.savedReq.srchDate,
					chkData: this.recListView.getSelectedRecs()
				};
			}else{
				// 検索結果が無い場合
				myData = {
					savedReq: null,
					savedCond: this.srchCondView.serialize(),
					selectedIds: []
				};
				destData = {
					opeTypeId: rtyp
				};
			}

			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:    // 照会
				var lastClickedRec = this.recListView.getLastClickedRec();
                if(_.isEmpty(lastClickedRec)){
                    // 最後にクリックした行データがとれなかった
                    console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
                    return;
                }
                destData.chkData = [ lastClickedRec ];
                destData.myData = myData;

                //合計選択時
                if(myData.savedCond.srchTotalType == 1){
                	//選択シーズンを渡す
                	destData.chkData[0].seasonID = myData.savedCond.srchSeason;
                }
                	//押下セルの商品年令を渡す
                	var age_type = $(e.target).attr('age_type');
                	if(age_type == 0){
                		myData.savedCond.age_type = {};
                	}
                	else if(age_type == 1){
                		myData.savedCond.age_type = {srchAge1:1};
                	}
                	else if(age_type == 2){
                		myData.savedCond.age_type = {srchAge2:1};
                	}
                	else if(age_type == 3){
                		myData.savedCond.age_type = {srchAge3:1};
                	}
                	else if(age_type == 4){
                		myData.savedCond.age_type = {srchAge4:1};
                	}
                	else if(age_type == 5){
                		myData.savedCond.age_type = {srchAge5:1};
                	}


                //ページ遷移
                clcom.pushPage(url, destData, myData);
                break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
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
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(model) {
			// 条件部の復元
			if(!_.isEmpty(model.savedCond)){
				this.srchCondView.deserialize(model.savedCond);
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.selectedIds);
			}
		},

		_eof: 'AMWDV0060.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();
		mainView.setFocus();

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
		}
	}).fail(function(data){
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
	});

});
