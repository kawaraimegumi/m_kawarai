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
			"click .ca_btn_store"	: "_onStoreSelClick",				// 店舗選択補助画面起動
			'click #ca_srch'					: '_onSrchClick'		// 検索ボタン押下時
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

			// 検索日区分	#ca_srchTypeID
			clutil.cltypeselector(this.$("#ca_srchYMD"), amcm_type.AMCM_TYPE_DEVALUE_SEARCH_DATE2, 1);
			// シーズン区分	#ca_srchTypeID
			clutil.cltypeselector(this.$("#ca_srchSeason"), amcm_type.AMCM_TYPE_SEASON, 1);

			// 初期値を設定
			this.deserialize({
				//TODO:初期値->ログインユーザの事業ユニット
				//srchStoreID: null,			// 店舗
				srchYMD: 1,					// 検索日
				//srchItgrpID: null,			// 品種
				srchSeason: 0				// シーズン区分
			});

			// ツールチップ
			$("#ca_tp_code").tooltip({html: true});


			var initStore = {
					id: clcom.userInfo.org_id,
					code: clcom.userInfo.org_code,
					name: clcom.userInfo.org_name
				};

			//店舗と品種リレーション
			this.relation = clutil.FieldRelation.create("default", {
				clorgcode: {
					el: '#ca_srcStoreID',
					initValue: (clcom.userInfo && clcom.userInfo.org_id && (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN)) ? initStore : null,
					dependAttrs: {
						//f_stockmng: 1
					}
				},

				// 品種
				clvarietycode: {
					el: '#ca_srchItgrpID',
					rmDepends: ['unit_id'],
					addDepends: ['org_id']
				}
			}, {
				dataSource: {
					unit_id: clcom.getUserData().unit_id,
					orgfunc_id: clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'),
					orglevel_id: clcom.getSysparam('PAR_AMMS_STORE_LEVELID')
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
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			var retStat = true;

			// 必須項目確認
			if(!this.validator.valid()){
				retStat = false;
			}
			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
			}

			return retStat;
		},


		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 必須項目チェック
			if(this.isValid() == false){
				return;
			}
			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMWDV0070.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			"click .cl_download"	: "_onDLClick",		// PDF押下
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				btn_new: false,
				title: '品番別年令別在庫',
				subtitle: '確認',
				btn_csv: false,
				btn_pdf: true
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});
			// グループID -- AMWDV0070 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMWDV0070';
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
			$("#mainColumnFooter").hide();
			return this;
		},

		/**
		 * 年令リスト作成
		 */
		makeAgeList: function(srchDto){
			var list = [];

			if(srchDto.srchAge5 == 1){
				list.push(5);
			}
			if(srchDto.srchAge4 == 1){
				list.push(4);
			}
			if(srchDto.srchAge3 == 1){
				list.push(3);
			}
			if(srchDto.srchAge2 == 1){
				list.push(2);
			}
			if(srchDto.srchAge1 == 1){
				list.push(1);
			}

			return list;
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
			//年令リスト設定
			var srchAge = this.makeAgeList(srchReq);
			srchReq.srchAge = srchAge;

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
				reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMWDV0070GetReq: srchReq
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
			if(groupid !== 'AMWDV0070'){
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
			var defer = clutil.postJSON('AMWDV0070', srchReq).done(_.bind(function(data){
				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMWDV0070GetRsp.stockRecords;
				if(_.isEmpty(recs)){
					// 検索ペインを表示？
					mainView.srchAreaCtrl.reset();
					mainView.srchAreaCtrl.show_srch();

					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					return;
				}

				// リクエストを保存。
				this.savedReq = srchReq;
				// 結果ペインを表示
				this.srchAreaCtrl.show_result();
				$("#mainColumnFooter").show();

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);
				//評価減年令により、セル背景色を変化させる
				this.itgrp_age = data.AMWDV0070GetRsp.itgrp_age;
				//this.itgrp_age = 3;
				this.setLine(recs);

				// 初期選択の設定（オプション）
				if(!_.isEmpty(selectedIds)){
					this.recListView.setSelectById(selectedIds, true);
				}

				this.resetFocus();
			}, this)).fail(_.bind(function(data){

				// 検索ペインを表示
				mainView.srchAreaCtrl.reset();
				mainView.srchAreaCtrl.show_srch();
				$("#mainColumnFooter").hide();
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
				this.resetFocus();
			}, this));
			return defer;
		},


		/**
		 * 評価減年令により、セル背景色を変化させる
		 */
		setLine: function(recs){
			for(var i=0; i<recs.length; i++){
				var gap = this.itgrp_age - recs[i].age;

				if(gap == 1){
					//対象まで1年
					$("tr").eq(i+1).addClass("alertCell");
				}
				else if(gap < 1){
					//対象年齢以上
					$("tr").eq(i+1).addClass("errorCell");
				}
				if (recs[i].fAll == 1) {
					$("tr").eq(i+1).addClass("fontbold");
				}
			}
		},


		/**
		 * ダウンロードする
		 */
		_onDLClick: function(){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}

			srchReq.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF;	//8

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMWDV0070', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			var userType = clcom.userInfo.user_typeid;
			if(userType == amcm_type.AMCM_VAL_USER_STORE
					|| userType == amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.viewReadonly($("#ca_srcStoreIDArea"));
				clutil.setFocus($('#ca_srchYMD'));
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
			$("#mainColumnFooter").hide();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧では使用しない*/, e){
			if ($(e.target).is('a[name="a_codeLink"]') || $(e.target).is('td[name="td_codeLink"]')) {

				var url = clcom.appRoot + '/AMMS/AMMSV0140/AMMSV0140.html';

				var tr = $(e.target).closest("tr");
				var tblData = clutil.tableview2data($(tr));
				var infoData = clutil.view2data($("#ca_srchArea"));


				// 別窓で照会画面を起動
                clcom.pushPage({
                    url: url,
                    args: {
						srchDate: clcom.getOpeDate(),
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
						chkData: [{
							id: tblData[0].item_id,			// 商品ID
							orgID: infoData.srcStoreID		// 店舗ID
						}],
						savedCond: {
						},
						savedReq: {
						}
					},
                    newWindow: true
                });
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


		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		set: function(model) {
			// 条件部の復元
			if(!_.isEmpty(model.myData)){

				//店舗オートコンプリート
				var userStore = {
						id : model.myData.savedCond._view2data_srcStoreID_cn.id,
						code : model.myData.savedCond._view2data_srcStoreID_cn.code,
						name: model.myData.savedCond._view2data_srcStoreID_cn.name
				};
				//品種オートコンプ
				var dataItgrp = {
						id: model.chkData[0].itgrpID,
						code: model.chkData[0].itgrpCode,
						name: model.chkData[0].itgrpName
				};

				var sendData = {
						srchYMD	 	: model.myData.savedCond.srchYMD,		// 検索日
						srchSeason 	: model.chkData[0].seasonID,			// シーズン区分
						srcStoreID	: userStore,	//店舗
						srchItgrpID	: dataItgrp,	//品種
				};
				this.srchCondView.deserialize(sendData);

				//年令指定
				clutil.data2view($("#ca_age"), model.myData.savedCond.age_type);

				$("#ca_srcStoreID").autocomplete('clAutocompleteItem', userStore);
				$("#ca_srchItgrpID").autocomplete('clAutocompleteItem', dataItgrp);


				var req = clutil.view2data($("#ca_srchArea"));

				//シーズンを配列の数値化(0060からの遷移の場合は1つだけ)
				if(req.srchSeason != null){
					for(var i=0; i<req.srchSeason.length; i++){
						req.srchSeason[i] = Number(req.srchSeason[i]);
					}
				}
				else{
					req.srchSeason = [];
				}

				// 再検索
				var srchReq = this.buildReq(req);
				if(_.isNull(srchReq)){
					// 入力エラーがある：条件設定ペインを開いてあげる
					this.srchAreaCtrl.show_srch();
					return;
				}
				this.doSrch(srchReq);
			}
		},

		_eof: 'AMWDV0070.MainView//'
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
		if(clcom.pageArgs){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.set(clcom.pageArgs);
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
