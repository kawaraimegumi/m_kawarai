useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));
	
	
	var util = {
			/**
			 * 行選択 - Ope系ボタンの活性化/非活性化コントロール
			 *	var args = {
			 *		$btn: $btn,							// ボタン要素の jQuery オブジェクト
			 *		selectedRows: selectedRecs,			// 選択した行データ配列
			 *		selectedCount: selectedRecs.length,	// 選択行数
			 *		btnOpeTypeId: btnOpeTypeId,			// $btn に因んだ処理区分 opeTypeID 値。不定の場合は -1。
			 *		selectionPolicy: selectionPolicy,	// $btn の操作が複数行選択できるかどうか。値は 'single' or 'multi' をとる。
			 *		hasHistory: hasHistory,				// 行データが履歴を持つかどうか。行データに formDate, toDate プロパティを持つものを履歴ありと判定。
			 *		opeDate: opeDate					// 運用日（いま）。呼出元で clcom.getOpeDate() で取得した値。
			 *	};
			 */
			opeBtnIsEnabled: function(args){
				// 納期変更ボタンの区分番号宣言
				var limCngBtn = -1;
				
				// ログインユーザが店舗かどうかフラグ
				// ログインユーザの店舗ID
				var f_store = false;
				var storeID = 0;
				if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
					// 店舗or店長ユーザなら設定
					f_store = true;
					storeID = clcom.getUserData().org_id;
				}
				
				
				// 行選択が無い。⇒ 全部非活性化
				if(args.selectedCount <= 0){
					// 選択されていない。
					return false;
				}
				
				if(args.selectedCount == 1){
					// 1個選択
					if(args.btnOpeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
							|| args.btnOpeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY
							|| args.btnOpeTypeId == limCngBtn
							|| args.btnOpeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
						if(f_store == true && args.selectedRows[0].storeID != storeID){
							// 店舗ユーザの場合、自店の行でなければ操作不可
							return false;
						}
					}
				}
				else{
					// 複数行選択
					if(args.selectionPolicy == 'single'){
						return false;
					}
					if(args.btnOpeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
							|| args.btnOpeTypeId == limCngBtn){
						// 複数行選択可なのは、編集・納期変更のみ。
						// insDate 境界チェックが NG のものが含まれれば、編集ボタンを押せないように。
						for(var i=0; i<args.selectedCount; i++){
							if(f_store == true && args.selectedRows[i].storeID != storeID){
								// 店舗ユーザの場合、自店の行でなければ操作不可
								return false;
							}
						}
					}
				}
				return true;
			}
	};
	
	
	

	var Dialog = Marionette.ItemView.extend({
//		template: ((clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) && (clcom.userInfo.unit_id == clcom.getSysparam('PAR_AMMS_UNITID_ORI')))?'#NewDialog2':'#NewDialog',
		template: '#NewDialog',
		events: {

		},

//		getPoType: function(){
//		var $POTypeID = this.$("#ca_srchPOTypeID_dialog");
//		return $POTypeID.val();
//		},
		getPoType: function(){
			var radio = this.$("input:radio[name=ca_orderType]:checked");
			return radio.val();
		},

		onShow: function(){
			clutil.initUIelement(this.$el);
		}
	});
	var Dialog2 = Marionette.ItemView.extend({
//		template: ((clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) && (clcom.userInfo.unit_id == clcom.getSysparam('PAR_AMMS_UNITID_ORI')))?'#NewDialog2':'#NewDialog',
		template: '#NewDialog2',
		events: {

		},

//		getPoType: function(){
//		var $POTypeID = this.$("#ca_srchPOTypeID_dialog");
//		return $POTypeID.val();
//		},
		getPoType: function(){
			var radio = this.$("input:radio[name=ca_orderType]:checked");
			return radio.val();
		},

		onShow: function(){
			clutil.initUIelement(this.$el);
		}
	});
	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'					: '_onSrchClick'			// 検索ボタン押下時
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

		_eof: 'AMPOV0220.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'change #ca_srchUnitID'			: '_onSrchUnitChanged',		// 事業ユニットが変更された
			'click #ca_btn_store_select'	: '_onStoreSelClick',		// 店舗選択
			'click #searchAgain'			: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click #ca_btn_PDF_DL'			: '_onPDFDLClick',			// 出力クリック
			'click #cl_edit_term'			: '_onTermClick'			// 納期変更クリック
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opebtn_auto_enable: util.opeBtnIsEnabled,
				title: 'PO発注',
				subtitle: '一覧'
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});
			// グループID -- AMPOV0220 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMPOV0220';

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
					f_ignore_perm : 1,
					p_org_id	: p_org_id
				},
			});
			
			/** MT-877対応 2015/10/22 藤岡*/
//			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
//					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
			if(p_org_id != null){
				if(clcom.userInfo.org_kind_typeid == amcm_type.AMCM_VAL_ORG_KIND_STORE){
					// 店舗系ユーザの場合のみ、店舗欄に初期値表示
					this.utl_store.setValue({id: storeID, code: storeCode, name: storeName});
				}
				//this.utl_store.setValue({id: storeID, code: storeCode, name: storeName});
			/** MT-877対応 2015/10/22 ここまで*/
				$('#ca_srchUnitID').selectpicker('val', clcom.getUserData().unit_id);
				clutil.viewReadonly($("#ca_srchUnitID_div"));
			}else{
				clutil.viewReadonly($("#ca_srchStoreID_div"));
			}
			this.initUIElement_AMPAV0020();

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
			// 行選択の変更イベントを受け取る
			clutil.mediator.on('onRowSelectChanged', this._onRowSelectChanged);

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
			$("#tp_tel").tooltip({html: true});
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
			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				this.$("#ca_srchStoreID_name").text("店舗");
				clutil.setFocus($('#ca_srchPOTypeID'));
				// 納期変更は非表示
				this.$("#cl_edit_term").hide();
				this.$("#ca_srchStoreID").show();
			}else{
				this.$("#ca_srchStoreID_name").text("組織");
				clutil.setFocus($('#ca_srchStoreID'));
				this.$("#ca_srchStoreID").show();
			}
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
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){
			var func_id = Number(clutil.getclsysparam("PAR_AMMS_DEFAULT_ORG_FUNCID", 1));
			var r_org_id = this.$("#ca_srchUnitID").val() == 0 ? 3 : Number(this.$("#ca_srchUnitID").val());
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
					AMPOV0220GetReq: srchReq
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
			if(groupid !== 'AMPOV0220'){
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

			var defer = clutil.postJSON('AMPOV0220', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMPOV0220GetRsp.orderList;

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
				//console.log(arguments);
				//this.clearResult();

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
			}else{
				// TODO : 適当な場所を select してフォーカスを入れる。
//				if (this.$('#searchAgain').css('display') == 'none') {
//				// 検索ボタンにフォーカスする
//				this.$('#ca_AMRSV0100_search').focus();
//				} else {
//				// 条件を追加ボタンにフォーカスする
//				this.$('#ca_AMRSV0100_add').focus();
//				}
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
		},

		/**
		 * 所属事業ユニットから遷移先のURLを取得する
		 */
		_getURL: function(unitID) {
			var url = clcom.appRoot;
			if (unitID == null) {
				unitID = clcom.getUserData().unit_id;
			}
			var ori = clcom.getSysparam('PAR_AMMS_UNITID_ORI');

			if (unitID == ori) {
				url = url + '/AMPO/AMPOV0280/AMPOV0280.html';
			} else {
				url = url + '/AMPO/AMPOV0270/AMPOV0270.html';
			}

			return url;
		},

		/**
		 * 納期変更押下
		 */
		_onTermClick:function() {
			var url = null;
			var myData, destData;
//			var $POTypeID = this.$("#ca_srchPOTypeID");
//			if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_MENS){
//			//メンズ
//			url = url + '/AMPO/AMPOV0230/AMPOV0230.html';
//			}else if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
//			//レディス
//			url = url + '/AMPO/AMPOV0240/AMPOV0240.html';
//			}else{
//			//その他（シャツ）
//			url = url + '/AMPO/AMPOV0250/AMPOV0250.html';
//			}
//			if(this.savedReq.AMPOV0220GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_MENS){
//				//メンズ
//				url = url + '/AMPO/AMPOV0230/AMPOV0230.html';
//			}else if(this.savedReq.AMPOV0220GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
//				//レディス
//				url = url + '/AMPO/AMPOV0240/AMPOV0240.html';
//			}else if(this.savedReq.AMPOV0220GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
//				//その他（シャツ）
//				url = url + '/AMPO/AMPOV0250/AMPOV0250.html';
//			}else{
//				return;
//			}
			if(this.savedReq){
				// 検索結果がある場合
				var selectedRecs = this.recListView.getSelectedRecs();
				var poTypeID = this.savedReq.AMPOV0220GetReq.srchPOTypeID;
				$.each(selectedRecs, function(){
					this.mode = 1;
					this.poTypeID = poTypeID;
				});
				var unitID = selectedRecs[0].unitID;
				url = this._getURL(unitID);
				myData = {
						btnId: "cl_edit_term",
						savedReq: this.savedReq,
						savedCond: this.savedReq.AMPOV0220GetReq,
						chkData: selectedRecs
				};
				destData = {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
						chkData: selectedRecs
				};
			}else{
				url = this._getURL();
				// 検索結果が無い場合
				myData = {
						btnId: e.target.id,
						savedReq: null,
						savedCond: this.srchCondView.serialize(),
						selectedIds: []
				};
				destData = {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
				};
			}
			//編集可能時間のチェック
			var srchReq = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					AMPOV0240GetReq :{
						reqType: 5,
						poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS
					}
			};
			var defer = clutil.postJSON('AMPOV0240', srchReq).done(_.bind(function(data){
//				送信済みチェック
//				今は使用しない
//				var idlist = new Array;
//				if(_.isEmpty(destData.chkData)){
//				// 行選択がないのは来ないはず
//				console.warn('rtyp[' + rtyp + ']: item not specified.');
//				return;
//				}
//				$.each(destData.chkData, function() {
//				var obj ={
//				poorderID: this.firstID
//				};
//				idlist.push(obj);
//				});
//				//データが送信済みのチェック
//				var srchReq2 = {
//				reqHead: {
//				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
//				},
//				AMPOV0230GetReq :{
//				reqType: 6,
//				poTypeID: _this.savedReq.AMPOV0220GetReq.srchPOTypeID,
//				orderIDList: idlist
//				}
//				};
//				var defer2 = clutil.postJSON('AMPOV0230', srchReq2).done(_.bind(function(data2){

				// チェックされたデータが必要（Ｎ）
				if(_.isEmpty(destData.chkData)){
					// 行選択がない				-- そもそもボタンを押せなくしている
					console.warn('rtyp[' + am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD + ']: item not specified.');
					return;
				}
				//納期変更画面に移動
				clcom.pushPage(url, destData, myData);


//				}, this)).fail(_.bind(function(data2){
//				// 検索ペインを表示
////				mainView.srchAreaCtrl.show_srch();
//				// エラーメッセージを通知。
//				clutil.mediator.trigger('onTicker', data2);
//				return ;
//				}, this));


			}, this)).fail(_.bind(function(data){
				// 検索ペインを表示
//				mainView.srchAreaCtrl.show_srch();
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
				return ;
			}, this));
		},
		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧画面では使用しない*/, e){
			// 特定列排除

			if(e.target.id == "ca_btn_PDF_DL" || $(e.target).hasClass("xxx")){
				return;
			}
//			if($(e.target).hasClass("xxx")){
//			return;
//			}
			var url = null;
			var myData, destData;
//			var $POTypeID = this.$("#ca_srchPOTypeID");
//			if(rtyp != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
//				if(this.savedReq.AMPOV0220GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_MENS){
//					//メンズ
//					url = url + '/AMPO/AMPOV0230/AMPOV0230.html';
//				}else if(this.savedReq.AMPOV0220GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
//					//レディス
//					url = url + '/AMPO/AMPOV0240/AMPOV0240.html';
//				}else if(this.savedReq.AMPOV0220GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
//					//その他（シャツ）
//					url = url + '/AMPO/AMPOV0250/AMPOV0250.html';
//				}else{
//					return;
//				}
//			}

			if(this.savedReq){
				// 検索結果がある場合
				var selectedRecs = this.recListView.getSelectedRecs();
				var poTypeID = this.savedReq.AMPOV0220GetReq.srchPOTypeID;
				$.each(selectedRecs, function(){
					this.mode = 0;
					this.poTypeID = poTypeID;
				});
				var unitID = null;
				if (rtyp != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
						&& rtyp != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
					unitID = selectedRecs[0].unitID;
				}
				url = this._getURL(unitID);
				myData = {
						btnId: e.target.id,
						savedReq: this.savedReq,
						savedCond: this.savedReq.AMPOV0220GetReq,
						chkData: selectedRecs
				};
				destData = {
						opeTypeId: rtyp,
						chkData: selectedRecs
				};
			}else{
				// 検索結果が無い場合
				url = this._getURL();
				myData = {
						btnId: e.target.id,
						savedReq: null,
						savedCond: this.srchCondView.serialize(),
						selectedIds: []
				};
				destData = {
						opeTypeId: rtyp
				};
			}
			if (rtyp != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
				//編集可能時間のチェック
				var srchReq = {
						reqHead: {
							opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
						},
						AMPOV0240GetReq :{
							reqType: 5,
							poTypeID: amcm_type.AMCM_VAL_PO_CLASS_LADYS
						}
				};
				var defer = clutil.postJSON('AMPOV0240', srchReq).done(_.bind(function(data){
//					if(rtyp == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
//						//新規
//						var dialog
//						if (clcom.userInfo.unit_id == clcom.getSysparam('PAR_AMMS_UNITID_ORI')){
//							dialog = new Dialog2();
//						}else{
//							dialog = new Dialog();
//						}
//
//						dialog.render();
////						clutil.cltypeselector(dialog.$("#ca_srchPOTypeID_dialog"), amcm_type.AMCM_TYPE_PO_CLASS);
//						clutil.initUIelement(dialog.$el);
//						clutil.ConfirmDialog(dialog.el, function(dialog){
//							console.log('OK', arguments);
//							try{
//								var url = clcom.appRoot;
//								var myData, destData;
//								if(dialog.getPoType() == amcm_type.AMCM_VAL_PO_CLASS_MENS){
//									//メンズ
//									url = url + '/AMPO/AMPOV0230/AMPOV0230.html';
//								}else if(dialog.getPoType() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
//									//レディス
//									url = url + '/AMPO/AMPOV0240/AMPOV0240.html';
//								}else if(dialog.getPoType() == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
//									//その他（シャツ）
//									url = url + '/AMPO/AMPOV0250/AMPOV0250.html';
//								}else{
//									return;
//								}
//								if(mainView.savedReq){
//									// 検索結果がある場合
//									var selectedRecs = mainView.recListView.getSelectedRecs();
//									myData = {
//											savedReq: mainView.savedReq,
//											savedCond: mainView.savedReq.AMPOV0220GetReq,
//											chkData: selectedRecs
//									};
//									destData = {
//											opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
//											chkData: selectedRecs
//									};
//								}else{
//									// 検索結果が無い場合
//									myData = {
//											savedReq: null,
//											savedCond: mainView.srchCondView.serialize(),
//											selectedIds: []
//									};
//									destData = {
//											opeTypeId:  am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
//									};
//								}
//								clcom.pushPage(url, destData, myData);
//							}finally{
//								dialog.remove();
//							}
//						}, function(dialog){
//							console.log('CANCEL', arguments);
//							try{
//								;
//							}finally{
//								dialog.remove();
//							}
//						}, dialog);
//					}else if(rtyp == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
					if(rtyp == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
						// チェックされたデータが必要（Ｎ）
						if(_.isEmpty(destData.chkData)){
							// 行選択がない				-- そもそもボタンを押せなくしている
							console.warn('rtyp[' + rtyp + ']: item not specified.');
							return;
						}
						clcom.pushPage(url, destData, myData);
					}else{
						//送信済みチェック
						//今は使用しない
//						var idlist = new Array;
//						if(_.isEmpty(destData.chkData)){
//						// 行選択がないのは来ないはず
//						console.warn('rtyp[' + rtyp + ']: item not specified.');
//						return;
//						}
//						$.each(destData.chkData, function() {
//						var obj ={
//						poorderID: this.firstID
//						};
//						idlist.push(obj);
//						});
//						//データが送信済みのチェック
//						var srchReq2 = {
//						reqHead: {
//						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
//						},
//						AMPOV0230GetReq :{
//						reqType: 6,
//						poTypeID: _this.savedReq.AMPOV0220GetReq.srchPOTypeID,
//						orderIDList: idlist
//						}
//						};
//						var defer2 = clutil.postJSON('AMPOV0230', srchReq2).done(_.bind(function(data2){

						// ope_btn 系
						switch(rtyp){
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
							// チェックされたデータが必要（Ｎ）
							if(_.isEmpty(destData.chkData)){
								// 行選択がない				-- そもそもボタンを押せなくしている
								console.warn('rtyp[' + rtyp + ']: item not specified.');
								return;
							}
							clcom.pushPage(url, destData, myData);

							break;
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
							// チェックされたデータが必要（Ｎ）
							if(_.isEmpty(destData.chkData)){
								// 行選択がない				-- そもそもボタンを押せなくしている
								console.warn('rtyp[' + rtyp + ']: item not specified.');
								return;
							}
							clcom.pushPage(url, destData, myData);
							break;

						case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
							clcom.pushPage(url, destData, myData);

							break;
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会

							break;

						default:
							console.warn('unsupported rtyp[' + rtyp + '] received.');
						return;
						}
//						}, this)).fail(_.bind(function(data2){
//						// 検索ペインを表示
////						mainView.srchAreaCtrl.show_srch();
//						// エラーメッセージを通知。
//						clutil.mediator.trigger('onTicker', data2);
//						return ;
//						}, this));
					}
				}, this)).fail(_.bind(function(data){
					// 検索ペインを表示
//					mainView.srchAreaCtrl.show_srch();
					// エラーメッセージを通知。
					clutil.mediator.trigger('onTicker', data);
					return ;
				}, this));
				return defer;
			}else{
				var lastClickedRec = this.recListView.getLastClickedRec();
				if(_.isEmpty(lastClickedRec)){
					// 最後にクリックした行データがとれなかった
					console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
					return;
				}
				if (lastClickedRec.oldFlag == 1) {
					return;
				}
				url = this._getURL(lastClickedRec.unitID);

				destData.chkData = [ lastClickedRec ];

				// 別窓で照会画面を起動
				clcom.pushPage({
					url: url,
					args: destData,
					newWindow: true
				});
			}
		},

		/**
		 * recListView の選択 chage イベントを購読する。
		 */
		_onRowSelectChanged: function(groupid, arg, from){
			console.log(arguments);

			if(groupid != 'AMPOV0220'){
				return;
			}
			if(this.savedReq == null || this.savedReq.AMPOV0220GetReq == null){
				return;
			}
			// 一個も選択なしは除外
			if(arg.selectedRecs.length == 0){
				return;
			}
			if(this.savedReq.AMPOV0220GetReq.srchPOTypeID != amcm_type.AMCM_VAL_PO_CLASS_MENS
					&& this.savedReq.AMPOV0220GetReq.srchPOTypeID != amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				this.$("#cl_edit_term").removeAttr('disabled');
				this.$("#cl_edit_term").removeAttr('Enable');
				this.$("#cl_edit_term").attr('disabled', true);
				this.$("#cl_edit_term").attr('Enable', false);
			}else{
				this.$("#cl_edit_term").removeAttr('disabled');
				this.$("#cl_edit_term").removeAttr('Enable');
				this.$("#cl_edit_term").attr('disabled', false);
				this.$("#cl_edit_term").attr('Enable', true);
			}
			var unitID = 0;
			var f_edit = true;
			var f_copy = true;
			for (var i =0; i <  arg.selectedRecs.length; i++ ){
				if (i == 0) {
					unitID = arg.selectedRecs[i].unitID;
				} else if (arg.selectedRecs[i].unitID != unitID) {
					f_edit = false;
				}
				if (arg.selectedRecs[i].oldFlag == 1) {
					f_copy = false;
				}
				if(arg.selectedRecs[i].sendFlag > 0){
					this.$("#cl_edit").removeAttr('disabled');
					this.$("#cl_edit").removeAttr('Enable');
					this.$("#cl_edit").attr('disabled', true);
					this.$("#cl_edit").attr('Enable', false);
					this.$("#cl_edit_term").removeAttr('disabled');
					this.$("#cl_edit_term").removeAttr('Enable');
					this.$("#cl_edit_term").attr('disabled', true);
					this.$("#cl_edit_term").attr('Enable', false);
//					this.$("#cl_copy").removeAttr('disabled');
//					this.$("#cl_copy").removeAttr('Enable');
//					this.$("#cl_copy").attr('disabled', true);
//					this.$("#cl_copy").attr('Enable', false);
					this.$("#cl_delete").removeAttr('disabled');
					this.$("#cl_delete").removeAttr('Enable');
					this.$("#cl_delete").attr('disabled', true);
					this.$("#cl_delete").attr('Enable', false);
				}
			}
			if (!f_edit) {
				this.$("#cl_edit_term").removeAttr('disabled');
				this.$("#cl_edit_term").removeAttr('Enable');
				this.$("#cl_edit_term").attr('disabled', true);
				this.$("#cl_edit_term").attr('Enable', false);
				this.$("#cl_edit").removeAttr('disabled');
				this.$("#cl_edit").removeAttr('Enable');
				this.$("#cl_edit").attr('disabled', true);
				this.$("#cl_edit").attr('Enable', false);
				this.$("#cl_delete").removeAttr('disabled');
				this.$("#cl_delete").removeAttr('Enable');
				this.$("#cl_delete").attr('disabled', true);
				this.$("#cl_delete").attr('Enable', false);
				this.$("#cl_copy").removeAttr('disabled');
				this.$("#cl_copy").removeAttr('Enable');
				this.$("#cl_copy").attr('disabled', true);
				this.$("#cl_copy").attr('Enable', false);

			}
			if (!f_copy) {
				this.$("#cl_copy").removeAttr('disabled');
				this.$("#cl_copy").removeAttr('Enable');
				this.$("#cl_copy").attr('disabled', true);
				this.$("#cl_copy").attr('Enable', false);
			}
			
			// 2015/10/23 納期変更ボタン制御
			var f_write = clcom.getPermfuncByCode().f_allow_write;
			if(f_write == 0){
				this.$("#cl_edit_term").removeAttr('disabled');
				this.$("#cl_edit_term").removeAttr('Enable');
				this.$("#cl_edit_term").attr('disabled', true);
				this.$("#cl_edit_term").attr('Enable', false);
			}
			// 2015/10/23 納期変更ボタン制御 ここまで

			return;
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// リクエストをつくる
//			var srchReq = this.buildReq();
//			if(_.isNull(srchReq)){
//			// 入力エラーがある：条件設定ペインを開いてあげる
//			this.srchAreaCtrl.show_srch();
//			return;
//			}
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
			if (lastClickedRec.oldFlag == 1) {
				aplID = 'AMPOV0220';
				srchReq.AMPOV0220GetReq = {
						srchPOOrderID:	lastClickedRec.poOrderID
				};
			} else if(this.savedReq.AMPOV0220GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				//メンズ
				aplID = 'AMPOV0230';
				srchReq.AMPOV0230GetReq = {
						reqType:		1,
						poTypeID:		amcm_type.AMCM_VAL_PO_CLASS_MENS,
						srchID:	lastClickedRec.poOrderID
				};
			}else if(this.savedReq.AMPOV0220GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				//レディス
				aplID = 'AMPOV0240';
				srchReq.AMPOV0240GetReq = {
						reqType:		1,
						poTypeID:		amcm_type.AMCM_VAL_PO_CLASS_LADYS,
						srchID:	lastClickedRec.poOrderID
				};
			}else if(this.savedReq.AMPOV0220GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				//（シャツ）
				aplID = 'AMPOV0250';
				srchReq.AMPOV0250GetReq = {
						reqType:		1,
						poTypeID:		amcm_type.AMCM_VAL_PO_CLASS_SHIRT,
						srchID:	lastClickedRec.poOrderID
				};
			}else{
				console.warn('POTypeID(' + this.savedReq.AMPOV0220GetReq.srchPOTypeID + ') not found.');
				return;
			}

//			srchReq.AMPOV0220GetReq.srchPOOrderID = lastClickedRec.poOrderID;
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
		 * テーブルにエラーメッセージを表示
		 * 使用しないようになった。
		 * もしかしたら使うかもしれない
		 */
//		tableResultPrint: function(idList, errMessage) {
//		for (var i = 0; i < errMessage.length; i++){
//		if(errMessage[i].struct_name == "orderIDList"){
//		var poOrderID = idList[errMessage[i].lineno];
//		this.validator.setErrorMsg(this.$("#ca_table_tbody tr:nth-child("
//		+ (error[i].lineno)
//		+ ") input[name='storeID']"),
//		clutil.fmtargs(clutil.getclmsg(error[i].message), error[i].args));
//		}
//		}

//		},


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

		_eof: 'AMPOV0220.MainView//'
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