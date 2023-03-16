useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'					: 	'_onSrchClick'			// 検索ボタン押下時
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

			// datepicker
			clutil.datepicker(this.$("#ca_srchStOrderDate"));
			clutil.datepicker(this.$("#ca_srchEdOrderDate"));
			clutil.datepicker(this.$("#ca_srchStArrivalDate"));
			clutil.datepicker(this.$("#ca_srchEdArrivalDate"));
			clutil.datepicker(this.$("#ca_srchStSaleDate"));
			clutil.datepicker(this.$("#ca_srchEdSaleDate"));
//			TODO
			// ＰＯ種別 お離被架ユーザにシャツは存在しない
			if (clcom.userInfo.unit_id == clcom.getSysparam('PAR_AMMS_UNITID_ORI')){
				clutil.cltypeselector({$select: this.$("#ca_srchPOTypeID"),
					kind: amcm_type.AMCM_TYPE_PO_CLASS,
					ids:[
					     amcm_type.AMCM_VAL_PO_CLASS_MENS,
					     amcm_type.AMCM_VAL_PO_CLASS_LADYS
					     ],
					     unselectedflag: 1
				});
			}else{
				clutil.cltypeselector(this.$("#ca_srchPOTypeID"), amcm_type.AMCM_TYPE_PO_CLASS);
			}
			//担当者
			clutil.clstaffcode2($("#ca_srchUserID"));
		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			return clutil.view2data(this.$el);
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
		 * 指定プロパティ名（ ⇔ 検索 Req 上のメンバ名）の UI 設定値を取得する。
		 * defaultVal は、設定値が無い場合に返す値。
		 */
		getValue: function(propName, defaultVal){
			if(_.isUndefined(defaultVal)){
				defaultVal = null;
			}
			if(!_.isString(propName) || _.isEmpty(propName)){
				return defaultVal;
			}
			var dto = this.serialize();
			var val = dto[propName];
			return (_.isUndefined(val) || _.isNull(val) || _.isEmpty(val)) ? defaultVal : val;
		},
		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			var retStat = true;

			if(!this.validator.valid()){
				retStat = false;
			}
			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push(
					{
						stval : 'ca_srchStOrderDate',
						edval : 'ca_srchEdOrderDate'
					},
					{
						stval : 'ca_srchStArrivalDate',
						edval : 'ca_srchEdArrivalDate'
					},
					{
						stval : 'ca_srchStSaleDate',
						edval : 'ca_srchEdSaleDate'
					}
			);
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return false;
			}

			return true;
		},
		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {

			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();

			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMPOV0260.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'change #ca_srchUnitID'			:	'_onSrchUnitChanged',		// 事業ユニットが変更された
			'click #ca_btn_store_select'	: 	'_onStoreSelClick',		// 店舗選択
			'click #searchAgain'			: 	'_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click #ca_btn_PDF_DL'			: 	'_onPDFDLClick'			// 出力クリック
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: 'PO発注',
				subtitle: '履歴照会',
				btn_new: false,		// 新規作成は不要
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});
			// グループID -- AMPOV0260 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMPOV0260';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);


			// 店舗初期値設定
			var storeID = clcom.userInfo.org_id;
			var storeCode = clcom.userInfo.org_code;
			var storeName = clcom.userInfo.org_name;
			this.utl_store;
			
			var p_org_id = null;
			if(clcom.userInfo.unit_id == clcom.getSysparam('PAR_AMMS_UNITID_AOKI')){
				p_org_id = clcom.userInfo.unit_id;
			}else if(clcom.userInfo.unit_id == clcom.getSysparam('PAR_AMMS_UNITID_ORI')){
				p_org_id = clcom.userInfo.unit_id;
			}
			
			this.utl_store = clutil.clorgcode( {
				el : '#ca_srchStoreID',
				dependAttrs : {
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
//					orglevel_id : Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
//					org_typeid:	amcm_type.AMCM_VAL_ORG_KIND_STORE,
					f_ignore_perm : 1,
					p_org_id	: p_org_id
				},
			});
			
			
			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
//				this.utl_store = clutil.clorgcode( {
//					el : '#ca_srchStoreID',
//					dependAttrs : {
//						orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_HD_LEVELID')),
//						orglevel_id : Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
//						org_typeid:	amcm_type.AMCM_VAL_ORG_KIND_STORE,
//						//p_org_id	: clcom.userInfo.unit_id
//					},
//
//				});
				this.utl_store.setValue({id: storeID, code: storeCode, name: storeName});
				$('#ca_srchUnitID').selectpicker('val', clcom.getUserData().unit_id);
				clutil.viewReadonly($("#ca_srchUnitID_div"));
			}else{
				clutil.viewReadonly($("#ca_srchStoreID_div"));

//				this.utl_store = clutil.clorgcode( {
//					el : '#ca_srchStoreID',
//					dependAttrs : {
//						orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
////						orglevel_id : Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
////						org_typeid:	amcm_type.AMCM_VAL_ORG_KIND_STORE,
//						p_org_id	: p_org_id
//					},
//				});

			}
			this.initUIElement_AMPAV0020();

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント
		},

		initUIElement_AMPAV0010 : function(){
			var _this = this;

			// 店舗部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el				: this.$("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView		: this.$("#mainColumn"),
				select_mode		: clutil.cl_single_select,		// 単一選択
				isAnalyse_mode	: false	// 通常画面モード
			});

			this.AMPAV0010Selector.clear = function() {
//				$("#ca_storeID").val("");
//				$("#ca_storeID").data('cl_store_item', "");
				if (typeof ca_editView != "undefined") {
					var autocomplete = mainView.utl_store;
					autocomplete.resetValue();
				}
			};
			this.AMPAV0010Selector.render();
			this.AMPAV0010Selector.clear();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				var autocomplete = mainView.utl_store;
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					var parentList = data[0].parentList;
					autocomplete.setValue({id: id, code: code, name: name, parentList: parentList});
				} else {
					var item = autocomplete.getValue();
					if (item.id == 0) {
						this.clear();
					}
				}
				// ボタンにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};

		},

		initUIElement_AMPAV0020 : function(){
			var _this = this;
			// 店舗部品
			this.AMPAV0020Selector = new AMPAV0020SelectorView({
				el				: this.$("#ca_AMPAV0020_dialog"),		// 配置場所
				$parentView		: this.$("#mainColumn"),
				select_mode		: clutil.cl_single_select,		// 単一選択
				isAnalyse_mode	: false	// 通常画面モード
			});

			this.AMPAV0020Selector.clear = function() {
				if (typeof ca_editView != "undefined") {
					var autocomplete = mainView.utl_store;
					autocomplete.resetValue();
				}
			};
			this.AMPAV0020Selector.render();
			this.AMPAV0020Selector.clear();

			// 選択サブ画面復帰処理
			this.AMPAV0020Selector.okProc = function(data) {
				var autocomplete = mainView.utl_store;
				if (data !== null && data.length == 1) {
//					console.log(data);
					var level =  data[0].attr;
					// 店舗を取出す
					var id = data[0].val;
					var code = ((level == amcm_type.AMCM_VAL_ORG_KIND_ZONE || level == amcm_type.AMCM_VAL_ORG_KIND_AREA)? "":data[0].code);
					var name = data[0].name;
//					var parentList = data[0].parentList;
					autocomplete.setValue({id: id, code: code, name: name});
				} else {
//					var item = autocomplete.getValue();
//					if (item.id == 0) {
//						this.clear();
//					}
				}
				// ボタンにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};

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
			$("#tp_store").tooltip({html:true});
			$("#tp_tel").tooltip({html: true});
			$("#tp_name").tooltip({html: true});

			return this;
		},


		/**
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE 
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				return;
			}
			var unitID = Number($(e.target).val());

			if(unitID < clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.viewReadonly($("#ca_srchStoreID_div"));
			}
			else{
				clutil.viewRemoveReadonly($("#ca_srchStoreID_div"));
			}

			this.getOrg($("#ca_srchStoreID"), unitID);
			
			// 店舗未選択状態
			this.utl_store.setValue({id: 0, code: "", name: ""});
		},

		/**
		 * 組織オートコンプ入れ替え
		 */
		getOrg: function($tgt, unitID){
			return clutil.clorgcode({
				el: $tgt,
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				}
			});
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
			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				this.$("#ca_srchStoreID_name").text("店舗");
				clutil.setFocus($('#ca_srchStoreID'));
				this.$("#ca_srchStoreID").show();
				this.$("#ca_btn_store_select").show();
			}else{
				this.$("#ca_srchStoreID_name").text("組織");
				clutil.setFocus($('#ca_srchUnitID'));
				this.$("#ca_srchStoreID").show();
				this.$("#ca_btn_store_select").show();
			}
			return this;
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){
			//var r_org_id = this.$("#ca_srchUnitID").val() == 0 ? 3 : Number(this.$("#ca_srchUnitID").val());
			var func_id = Number(clutil.getclsysparam("PAR_AMMS_DEFAULT_ORG_FUNCID", 1));
			var r_org_id = this.$("#ca_srchUnitID").val() == 0 ? 3 : Number(this.$("#ca_srchUnitID").val());
//			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
//					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
//				r_org_id = clcom.userInfo.permit_top_org_id;
//			} else {
//				r_org_id = this.$("#ca_srchUnitID").val() == 0 ? 3 : Number(this.$("#ca_srchUnitID").val());
//			}

			//this.AMPAV0020Selector.show(null, false, func_id, null, null, r_org_id);
			this.AMPAV0020Selector.show(null, false, func_id, null, null, r_org_id, null, 1);
		},

		_onPDFDLClick: function(e){
			this.doDownload();
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
			srchReq.srchCustName = srchReq.srchCustName.replace(/　| /g,"");
			if(srchReq._view2data_srchStoreID_cn == null){
				srchReq.srchStoreID = 0;
			}else{
				srchReq.srchStoreID = srchReq._view2data_srchStoreID_cn.id;
			}

			// 検索条件
			var req = {
					reqHead: {
						//{ name = 'AM_PROTO_COMMON_RTYPE_NEW',        val = 1, description = '新規登録' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_UPD',        val = 2, description = '編集' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_DEL',        val = 3, description = '削除' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_REL',        val = 4, description = '参照' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_CSV',        val = 5, description = 'CSV出力' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_CSV_INPUT',  val = 6, description = 'CSV取込' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_COPY',       val = 7, description = '複製' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_PDF',        val = 8, description = 'PDF出力' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_DELCANCEL',  val = 9, description = '削除復活' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_RSVCANCEL',  val = 10, description = '予約取消' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_TMPSAVE',    val = 11, description = '一時保存' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_APPLY',      val = 12, description = '申請' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_APPROVAL',   val = 13, description = '承認' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_PASSBACK',   val = 14, description = '差戻し' },
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
						fileId: 0			// CSV取込などで使用する
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMPOV0260GetReq: srchReq
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
			console.log(arguments);
			if(groupid !== 'AMPOV0260'){
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
		 * @param chkData 初期選択行データ（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMPOV0260', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMPOV0260GetRsp.orderList;

				if(_.isEmpty(recs)){

					// 画面を一旦リセット
					mainView.srchAreaCtrl.reset();
					// 検索ペインを表示？
					mainView.srchAreaCtrl.show_srch();

					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					return;
				}

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);

				// 初期選択の設定（オプション）
				if(!_.isEmpty(chkData)){
					this.recListView.setSelectRecs(chkData, true, ['firstID']);
				}

				this.resetFocus($focusElem);
			}, this)).fail(_.bind(function(data){
				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				this.resetFocus($focusElem);

			}, this));

			return defer;
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFirstFocus($focusElem);
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// リクエストをつくる
			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF,
					},
			};
			var lastClickedRec = this.recListView.getLastClickedRec();
			if(_.isEmpty(lastClickedRec)){
				// 最後にクリックした行データがとれなかった
				console.warn('last clicked item not found.');
				return;
			}
			var aplID;
			if(this.savedReq.AMPOV0260GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				//メンズ
				aplID = 'AMPOV0260';
				srchReq.AMPOV0260GetReq = {
						reqType:		1,
						poTypeID:		amcm_type.AMCM_VAL_PO_CLASS_MENS,
						srchPOOrderID:	lastClickedRec.poOrderID
				};
			}else if(this.savedReq.AMPOV0260GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				//レディス
				aplID = 'AMPOV0260';
				srchReq.AMPOV0260GetReq = {
						reqType:		1,
						poTypeID:		amcm_type.AMCM_VAL_PO_CLASS_LADYS,
						srchPOOrderID:	lastClickedRec.poOrderID
				};
			}else if(this.savedReq.AMPOV0260GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				//（シャツ）
				aplID = 'AMPOV0260';
				srchReq.AMPOV0260GetReq = {
						reqType:		1,
						poTypeID:		amcm_type.AMCM_VAL_PO_CLASS_SHIRT,
						srchPOOrderID:	lastClickedRec.poOrderID
				};
			}else{
				console.warn('POTypeID(' + this.savedReq.AMPOV0260GetReq.srchPOTypeID + ') not found.');
				return;
			}

//			srchReq.AMPOV0260GetReq.srchPOOrderID = lastClickedRec.poOrderID;
//			srchReq.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF;
			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON(aplID, srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
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
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}
		},

		_eof: 'AMPOV0260.MainView//'
	});

//	--------------------------------------------------------------
//	初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

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