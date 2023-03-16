useSelectpicker2();

$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件部のデフォルト値
	var srchCondDefault = {
		srchSlipTypeID: amcm_type.AMCM_VAL_SLIP_DELIVER,// 伝票区分
//		storeID: 0,										// 店舗ID
//		srchVendorID: 0,								// 取引先ID
//		srchRecInspectFromDate: clcom.getOpeDate()-1,	// 検収日（開始日）
//		srchRecInspectToDate:clcom.getOpeDate()-1,		// 検収日（終了日）
		srchRecInspectFromDate: clutil.addDate(clcom.getOpeDate(),-1),	// 検収日（開始日）
		srchRecInspectToDate:clutil.addDate(clcom.getOpeDate(),-1),		// 検収日（終了日）
//		srchCountFromDate: 0,							// 勘定日（開始日）
//		srchCountToDate: 0,								// 勘定日（終了日）
		srchDeliverNo: null,							// 取引先名称
//		srchStaffID: 0,									// 担当者
		srchRegistTypeID: 0,							// 登録区分
		srchDlvwayTypeID: 0,							// 納品形態
		srchRedBlack: 1									// 赤黒表示
	};

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'toggle input[name="srchSlipTypeID"]'	: "_onSlipTypeChange",
			"click #ca_srch"						: "_onSrchClick",			// 検索ボタンが押下された
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

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 0);

			// 取引先オートコンプリート
			clutil.clvendorcode(this.$('#ca_srchVendorID'), {
				getVendorTypeId: _.bind(function(){
					return amdb_defs.MTTYPE_F_VENDOR_MAKER;   // メーカー
				}, this)
			});

			// 検収日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchRecInspectFromDate'));
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchRecInspectToDate'));
			// 勘定日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchCountFromDate'));
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchCountToDate'));

			// 担当者
			clutil.clstaffcode2($("#ca_srchStaffID"));

			// 入力区分	#ca_srchRegistTypeID
			clutil.cltypeselector(this.$("#ca_srchRegistTypeID"), amcm_type.AMCM_TYPE_DATA_ENTRY_TYPE, 1);

			// 初期値を設定 - deserialize中で 納品形態/依頼状態の typeselector を構築
			this.deserialize(srchCondDefault);
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

				// dto.伝票区分選択値に応じた、
				// 納品形態セレクタの中身を切り替える。
				this.setSlipTypeUI(dto.srchSlipTypeID);

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
			chkInfo.push({
				stval : 'ca_srchRecInspectFromDate',
				edval : 'ca_srchRecInspectToDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			chkInfo.push({
				stval : 'ca_srchCountFromDate',
				edval : 'ca_srchCountToDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return false;
			}
//			chkInfo.push({
//				stval : 'ca_srchCountFromDate',
//				edval : 'ca_srchCountToDate'
//			});
//			if(!this.validator.validFromTo(chkInfo)){
//				retStat = false;
//			}

			// 取引先コード・オートコンプリート設定チェック
			if(!this.$('#ca_srchVendorID').autocomplete('isValidClAutocompleteSelect')){
				// エラーメッセージを通知。
				var arg = {
					_eb_: '取引先コードの選択が正しくありません。選択肢の中から指定してください。',
					srchVendorID: '選択肢の中から指定してください。'
				};
				this.validator.setErrorInfo(arg, {prefix: 'ca_'});
				return false;
			}
			return true;
		},

		_onSlipTypeChange: function(e){
			var $target = $(e.target);
			var val = $target.val();
			this.setSlipTypeUI(val);
			$("#result").hide();
			mainView.setFocus();
		},

		// 伝票区分選択値に応じた UI を切り替える
		setSlipTypeUI: function(slipTypeVal){
			if(slipTypeVal == amcm_type.AMCM_VAL_SLIP_DELIVER){
				this.$("#ca_recInspectDate_label").text("検収日");
				this.$("#ca_dlvwapTypeID_label").text("納品形態");
				$("#ca_am_label").text("仕入金額（円）");
				clutil.cltypeselector(this.$("#ca_srchDlvwayTypeID"), amcm_type.AMCM_TYPE_DLV_ROUTE, 1);
			}else{
				this.$("#ca_recInspectDate_label").text("出荷日");
				this.$("#ca_dlvwapTypeID_label").text("依頼状態");
				$("#ca_am_label").text("返品金額（円）");
				clutil.cltypeselector(this.$("#ca_srchDlvwayTypeID"), amcm_type.AMCM_TYPE_REQ_STATUS_TYPE, 1);
			}
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 入力チェック
/*
			var retStat = true;
			if(!this.validator.valid()){
				retStat = false;
			}

			if (!retStat) {
				return;
			}
*/
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMDLV0010.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
//			'change #ca_srchUnitID'				:	'_onSrchUnitChanged',	// 事業ユニットが変更された
			'click #ca_btn_store_select'				: '_onStoreSelClick',		// 店舗選択補助画面起動
			'click #searchAgain'			: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			"click .ca_dl_td a" : "_doDLAction"
		},

		mediatorEvents: {
			onRowSelectChanged: function(){
				this.validButtons();
			}
		},

		canDelete: function(selectedRecs){
			var item = _.first(selectedRecs);
			return selectedRecs.length === 1 &&
				item.redBlack !== amcm_type.AMCM_VAL_REDBLACK_RED;
		},

		validButtons: function(){
			var canDel = true,
				selectedRecs = this.recListView.getSelectedRecs();

			if (_.isEmpty(selectedRecs)) {
				canDel = false;
			}

			if (canDel) {
				canDel = this.canDelete(selectedRecs);
			}

			clutil.inputReadonly('#cl_delete', !canDel);
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '仕入・返品伝票',
				subtitle: '一覧'
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMDLV0010 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDLV0010';

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
//			'click div#title p.addNew>a'	: '_onNewClick',			// 新規押下
//			'click #ca_edit'				: '_onEditClick',			// 編集ボタン押下
//			'click #ca_delete'				: '_onDeleteClick',			// 削除ボタン押下
//			'click #ca_rsvcancel'			: '_onReserveCancelClick'	// 予約取消ボタン押下
			clutil.mediator.on('onOperation', this._jumpPage);

			this.listenTo(clutil.mediator, this.mediatorEvents);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			this.recListView.initUIElement();

			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: this.$("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	this.$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector.render();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					var store = code + ":" + name;
					$("#ca_srchStoreID").val(store);
//					$("#ca_srchStoreID").attr("cs_id", id);
//					$("#ca_srchStoreID").attr("cs_code", code);
//					$("#ca_srchStoreID").attr("cs_name", name);
					$("#ca_srchStoreID").data('cl_store_item', {
                        id: id,
                        code: code,
                        name: name
                    });
				} else {
					$("#ca_srchStoreID").val("");
//					$("#ca_srchStoreID").attr("cs_id", "");
//					$("#ca_srchStoreID").attr("cs_code", "");
//					$("#ca_srchStoreID").attr("cs_name", "");
					var chk = $("#ca_srchStoreID").data("cl_store_item");
					if (chk == null || chk.length == 0) {
						$("#ca_srchStoreID").val("");
						$("#ca_srchStoreID").data('cl_store_item', "");
					}
				}
				_.defer(function(){									// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store_select")); 	// 参照ボタンへあてなおす
				});
			};
			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID",
					initValue: (clcom.userInfo) ? clcom.userInfo.unit_id : 0
				},
				// 店舗オートコンプリート
				clorgcode: {
					el: '#ca_srchStoreID',
					addDepends: ['p_org_id'],
					dependSrc: {
						p_org_id: 'unit_id'
					}
				},
				// 店舗参照ボタン
				AMPAV0010: {
					button: this.$('#ca_btn_store_select'),
					view: this.AMPAV0010Selector,
					showOptions: function(){
						return {
							org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
						};
					}
				},
			}, {
				dataSource: {
					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
				console.log("done in!!!!");
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					// 店舗ユーザー
//					this.storeAutocomplete.setValue({
//						id: clcom.userInfo.org_id,
//						code: clcom.userInfo.org_code,
//						name: clcom.userInfo.org_name
//					});

					clutil.inputReadonly($("#ca_srchStoreID"));
					clutil.inputReadonly($("#ca_btn_store_select"));
				}
			});
//			this.storeAutocomplete = this.getOrg(clcom.userInfo.unit_id);

			console.log(clcom.userInfo);
			var srchStoreID = {
				id : clcom.userInfo.org_id,
				code : clcom.userInfo.org_code,
				name : clcom.userInfo.org_name,
			};
			// 店舗
			if (clcom.userInfo.user_typeid) {
				if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS) {
					clutil.inputRemoveReadonly($('#ca_srchStoreID'));
					clutil.inputRemoveReadonly($('#ca_btn_store_select'));
				}
			}
			// 店舗
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				// 店舗階層ならユーザ店舗autocomplete初期値設定
				var userStore = {
						id : clcom.userInfo.org_id,
						code : clcom.userInfo.org_code,
						name : clcom.userInfo.org_name,
				};
				$("#ca_srchStoreID").autocomplete('clAutocompleteItem', userStore);
				clutil.inputReadonly($('#ca_srchStoreID'));
				clutil.inputReadonly($('#ca_btn_store_select'));
//			} else {
//				this._onSrchUnitChanged();
			}
/*
			// 店舗オートコンプリート
			this.storeAutocomplete = clutil.clorgcode( {
				el : '#ca_srchStoreID',
				dependAttrs : {
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
				},
		    });

			if (clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				// 店舗ユーザー
				this.storeAutocomplete.setValue({
					id: clcom.userInfo.org_id,
					code: clcom.userInfo.org_code,
					name: clcom.userInfo.org_name
				});

				clutil.inputReadonly($("#ca_srchStoreID"));
				clutil.inputReadonly($("#ca_btn_store_select"));
			}
*/

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

		dispSlipTypeData: function(val){
			if (val == amcm_type.AMCM_VAL_SLIP_DELIVER) {
				$("#type1").addClass('checked');
				$("#type2").removeClass('checked');
				$("#ca_recInspectDate_label").text("検収日");
				$("#ca_dlvwapTypeID_label").text("納品形態");
				$("#ca_am_label").text("仕入金額（円）");
				$("#ca_dlvwayTypeID_label").text("納品形態");
//				clutil.cltypeselector(this.$("#ca_srchDlvwayTypeID"), amcm_type.AMCM_TYPE_DLV_ROUTE, 1);
			} else {
				$("#type1").removeClass('checked');
				$("#type2").addClass('checked');
				$("#ca_recInspectDate_label").text("出荷日");
				$("#ca_dlvwapTypeID_label").text("依頼状態");
				$("#ca_am_label").text("返品金額（円）");
				$("#ca_dlvwayTypeID_label").text("依頼状態");
//				clutil.cltypeselector(this.$("#ca_srchDlvwayTypeID"), amcm_type.AMCM_TYPE_REQ_STATUS_TYPE, 1);
			}
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			clutil.setFocus($('#ca_srchUnitID'));
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
				reqPage: _.first(mainView.pagerViews).buildReqPage0(),
				AMDLV0010GetReq: srchReq
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
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}
			var unitID = Number($("#ca_srchUnitID").val());
			this.getOrg(unitID);
			this.storeAutocomplete.setValue();
			this.$("#ca_srchStoreID").attr("readonly", (unitID == 0));
		},
		/**
		 * 店舗オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: $("#ca_srchStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});
		},
		/**
		 * 店舗参照ボタン押下処理
		 */
		_onStoreSelClick: function(e) {
//			var _this = this;

//			_this.AMPAV0010Selector.show(null, null);
			var unitID = Number($("#ca_srchUnitID").val());
			var options = {
				editList : null,
				isSubDialog : null,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id : (unitID == 0) ? 3 : unitID,
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE, am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
			};
			this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMDLV0010'){
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
		doSrch: function(srchReq, selectedRecs){
			this.clearResult();
			$("#result").show();

			this.dispSlipTypeData(srchReq.AMDLV0010GetReq.srchSlipTypeID);

			var defer = clutil.postJSON('AMDLV0010', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMDLV0010GetRsp.slipList;
				if(_.isEmpty(recs)){
					// 検索ペインを表示？
					mainView.srchAreaCtrl.show_srch();

					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					$("#result").hide();
					return;
				}

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();
				$("#mainColumnFooter").show();

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);

				this.recListView.setRowState({
					isMatch: function(item){
						return (
							item.redBlack === amcm_type.AMCM_VAL_REDBLACK_RED ||
								item.firstDeliverID === 0
						);
					},
					enable: false
				});

				// 初期選択の設定（オプション）
				this.recListView.setSelectRecs(selectedRecs, true, ['deliverID']);

				this.validButtons();

				this.resetFocus();
			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				this.resetFocus();

			}, this));

			return defer;
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMDLV0010', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function(){
			// TODO
//			if (this.$('#searchAgain').css('display') == 'none') {
//				// 検索ボタンにフォーカスする
//				this.$('#ca_search').focus();
//			} else {
//				// 条件を追加ボタンにフォーカスする
//				this.$('#ca_add').focus();
//			}
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
		_jumpPage: function(rtyp, pgIndex, e){
			var url = clcom.appRoot + '/AMDL/AMDLV0020/AMDLV0020.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMDLV0010GetReq,
					selectedIds: this.recListView.getSelectedIdList(),
					selectedRecs: this.recListView.getSelectedRecs()
				};
				destData = {
					opeTypeId: rtyp,
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
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				// データが無くても可
				clcom.pushPage(url, destData, myData);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
				// チェックされたデータが必要（１）
				// fall through
				if(destData.chkData && destData.chkData.length >= 2){
					// 複数行選択されている		-- そもそもボタンを押せなくしているのでありえない
					console.warn('rtyp[' + rtyp + ']: '
							+ selectedRows.length + ' items selected, but single select only.');
					return;
				}
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
				// チェックされたデータが必要（Ｎ）
				if(_.isEmpty(destData.chkData)){
					// 行選択がない				-- そもそもボタンを押せなくしている
					console.warn('rtyp[' + rtyp + ']: item not specified.');
					return;
				}
				clcom.pushPage(url, destData, myData);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				var $tgt = $(e.target);
				if ($tgt.hasClass("ca_dl_td") || $tgt.attr('name') == 'a_pdf'){
					console.log('dl-td click received.');
				} else {
					var lastClickedRec = this.recListView.getLastClickedRec();
					if(_.isEmpty(lastClickedRec)){
						// 最後にクリックした行データがとれなかった
						console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
						return;
					}
					destData.chkData = [ lastClickedRec ];

					// 別窓で照会画面を起動
					clcom.pushPage({
						url: url,
						args: destData,
						newWindow: true
					});
				}
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
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
			var rec = $tr.data('cl_rec');
			var slipId = $tr.attr("id");
			var slipDate = $tr.attr("slipDate");
			var htDataType = amcm_type.AMCM_VAL_HT_DATA_RETURN;
			var storeID;
			if (rec != null) {
				storeID = rec.storeID;
			}
			var srchReq = {
					reqHead : {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF
					},
					AMCMV0140GetReq : {
						slipId : slipId,
						srchOrgID : storeID,
						htDataType : htDataType,
						fromDate : slipDate,
						toDate : slipDate,
					}
			};

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMCMV0140', srchReq).done(_.bind(function(data){
				// 表示変更clutil.gettypename(amcm_type.AMCM_TYPE_SLIP_PRINT, statusType).replace("印刷","出力")
				//$tr.find(".ca_status_td").html(clutil.gettypename(amcm_type.AMCM_TYPE_SLIP_PRINT, amcm_type.AMCM_VAL_SLIP_PRINT_DONE).replace("印刷","出力"));
			})).fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
			return;
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
//				this.doSrch(model.savedReq, model.selectedRecs);
				if(!_.isEmpty(model.updated)){
					this.doSrch(model.savedReq, model.updated);
				} else {
					if(model.selectedRecs[0].firstDeliverID == 0){
						this.doSrch(model.savedReq);
					} else {
						this.doSrch(model.savedReq, model.selectedRecs);
					}
				}
			}

		},

		_eof: 'AMDLV0010.MainView//'
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
			var model = _.extend({}, clcom.pageData, clcom.returnValue);
			mainView.load(model);
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
