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
			'click #ca_srch'					: '_onSrchClick'			// 検索ボタン押下時
		},

		initialize: function(){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var srchCondView = this;
/*
			var type = clcom.userInfo.user_typeid;
			if (type == amcm_type.AMCM_VAL_USER_STORE){
				// 店舗
				var id = clcom.userInfo.org_id;
				var code = clcom.userInfo.org_code;
				var name = clcom.userInfo.org_name;
				var store = code + ":" + name;
				$("#ca_srchStoreID").data('cl_store_item', {
					id: id,
					code: code,
					name: name
				});
				srchStoreID = {
					id: id,
					code: code,
					name: name
				};
				this.$("#ca_srchStoreID").attr("readonly", true);
				this.$("#ca_btn_store_select").attr("disabled", true);
			} else {
				$("#ca_srchStoreID").val("");
				srchStoreID = {
					id: 0,
					code: null,
					name: null
				};
			}
*/
			//---------------------------------------------------------------
			var unit = null;
			//店舗オートコンプリート
			this.srchStoreIdField = clutil.clorgcode({
				el: $("#ca_srchStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
				}
			});

			//---------------------------------------------------------------
			// 担当者
			clutil.clstaffcode2($("#ca_srchStaffID"));

			// 入荷状態区分	#ca_srchDlvStateID
			clutil.cltypeselector(this.$("#ca_srchDlvStateID"), amcm_type.AMCM_TYPE_DLV_STAT, 1);

			// 伝票区分	#ca_srchSlipFmtID
			clutil.cltypeselector(this.$("#ca_srchSlipFmtID"), amcm_type.AMCM_TYPE_SLIP_FORMAT, 1);

			// メーカーオートコンプリート
			clutil.clvendorcode(this.$('#ca_vendorID'), {
				getVendorTypeId: _.bind(function(){
					return amdb_defs.MTTYPE_F_VENDOR_MAKER;   // メーカー
				}, this)
			});

			// 店舗：選択サブ画面
			var AMPAV0010Selector1 = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog1"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector1 = AMPAV0010Selector1.render();

			// 選択サブ画面復帰処理
			AMPAV0010Selector1.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					data[0].id = data[0].val;
					srchCondView.srchStoreIdField.setValue(data[0]);
					mainView.setFocus();
				}
//				clutil.setFocus(srchCondView.srchStoreIdField.$el);
				_.defer(function(){									// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store_select")); 	// 参照ボタンへあてなおす
				});
			};

			//---------------------------------------------------------------
			// 店舗・倉庫
			// 店舗・倉庫オートコンプリート
			var outStoreAutocomplete = clutil.clorgcode( {
				el : '#ca_outStoreID',
				dependAttrs : {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					org_typeid_list: [
							amcm_type.AMCM_VAL_ORG_KIND_STORE,
							amcm_type.AMCM_VAL_ORG_KIND_CENTER,
							amcm_type.AMCM_VAL_ORG_KIND_HQ
					],
				    f_ignore_perm: 1,
					f_stockmng: 1	//在庫有無フラグ(1:在庫有り店舗のみ)
				}
		    });
			this.outStoreAutocomplete = outStoreAutocomplete;

			// 店舗・倉庫：選択サブ画面
			var AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector = AMPAV0010Selector.render();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					data[0].id = data[0].val;
					outStoreAutocomplete.setValue(data[0]);
				}
//				clutil.setFocus(outStoreAutocomplete.$el);
				_.defer(function(){							// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store")); 	// 参照ボタンへあてなおす
				});
			};


			// 検収日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_fromDate'));
			this.srchDatePicker = clutil.datepicker(this.$('#ca_toDate'));

			// 初期値を設定
			this.deserialize({
				vendorID : 0,
//				srchStaffID: 0,
				srchDlvStateID: 0,
				srchSlipFmtID: 0,
//				srchShipNo: 0,
//				srchDlvNo: 0,
//				srchMakerID: 0,
				fromDate: clcom.getOpeDate(),				// 期間開始日 yyyymmdd
//				toDate: 0				// 期間終了日 yyyymmdd
			});
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
/**/
            if(!this.validator.valid()){
                retStat = false;
            }
/**/
            // 期間反転チェック
            var chkInfo = [];
            chkInfo.push({
                stval : 'ca_fromDate',
                edval : 'ca_toDate'
            });
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
			// 入力チェック
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMDLV0030.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			"change #ca_srchSlipFmtID"		: "_onDlvTypeChanged",
			'click #ca_btn_store_select'	: '_onStoreSelClick',		// 店舗選択補助画面起動
			'click #ca_btn_store'			: '_onOutStoreSelClick',	// 店舗選択補助画面起動
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},


		mediatorEvents: {
			onRowSelectChanged: function(){
				this.validButtons();
			}
		},

		canDelete: function(selectedRecs){
			var item = _.first(selectedRecs);
			return selectedRecs.length === 1 &&
				item.dlvStateName === '入荷済';
		},

		validButtons: function(){
			var selectedRecs = this.recListView.getSelectedRecs(),
				canDel = this.canDelete(selectedRecs);
			clutil.inputReadonly('#cl_delete', !canDel);
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			var user_store = clcom.userInfo['org_id'];
			var json = localStorage.getItem('clcom.rfidstore');
			var rfid_list = JSON.parse(json);
			var rfid_flg = 0;
			if (clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				if (rfid_list.includes(user_store)) {
					rfid_flg = 1;
				}
			}
			if (rfid_flg == 0) {
				this.mdBaseView = new clutil.View.MDBaseView({
					title: '仕入／移動検収',
					subtitle: '一覧',
					btn_csv: false,
				});
			} else {
				this.mdBaseView = new clutil.View.MDBaseView({
					title: '仕入／移動検収',
					subtitle: '一覧',
					btn_csv: false,
					btn_new: false,
				});
			}
//			this.mdBaseView = new clutil.View.MDBaseView({
//				title: '仕入／移動検収',
//				subtitle: '一覧',
//				btn_csv: false,
//			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMDLV0030 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDLV0030';

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

			if (clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				// 店舗ユーザー
				this.srchCondView.srchStoreIdField.setValue({
					id: clcom.userInfo.org_id,
					code: clcom.userInfo.org_code,
					name: clcom.userInfo.org_name
				});

				clutil.inputReadonly($("#ca_srchStoreID"));
				clutil.inputReadonly($("#ca_btn_store_select"));
			}

			this._onDlvTypeChanged();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));
			$(".txtInFieldUnit.help").tooltip({html: true});

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			// 通知一覧から遷移時に引数から検索条件をセット
			if (!_.isEmpty(clcom.pageArgs)) {
				if (!_.isEmpty(clcom.pageArgs.data.fromDate)) {
					var rec = {
							srchStoreID: clcom.pageArgs.data.storeID,
							srchStaffID: clcom.pageArgs.data.staffCode,
							fromDate: clcom.pageArgs.data.fromDate,
							srchSlipFmtID: "3",
					}
					rec.fromDate = Number(rec.fromDate);
					rec.srchStaffID={
							id: Number(clcom.pageArgs.data.staffCode),
							code: clcom.pageArgs.data.staffCode,
							name: "XX",
					}
					clutil.data2view(this.$('#ca_srchArea'), rec);

					this.srchCondView.srchStoreIdField.setValue({
						id: clcom.userInfo.org_id,
						code: clcom.userInfo.org_code,
						name: clcom.userInfo.org_name
					});

					clutil.inputReadonly($("#ca_srchStoreID"));
					clutil.inputReadonly($("#ca_btn_store_select"));
				}
			}
			this.srchCondView.render();
			this.recListView.render();
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}
			return this;
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			clutil.focus({view: this.$('#ca_srchArea')});
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
				AMDLV0030GetReq: srchReq
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
		 * 伝票区分変更イベント
		 */
		_onDlvTypeChanged: function(e) {
			var dlvType = parseInt(this.$("#ca_srchSlipFmtID").val(), 10);
			if(!dlvType){
				this.$("#ca_vendorID").attr("disabled", true).closest('.fieldUnit').show();
				this.$("#ca_outStoreID").attr("disabled", true).closest('.fieldUnit').hide();
				this.$("#ca_outStoreID").autocomplete('clAutocompleteItem', {});
				this.$("#ca_vendorID").autocomplete('clAutocompleteItem', {});
			}else if(dlvType == amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_TRANS){
				this.$("#ca_vendorID").autocomplete('clAutocompleteItem', {});
				this.$("#ca_vendorID").attr("disabled", true).closest('.fieldUnit').hide();
				this.$("#ca_outStoreID").attr("disabled", false).closest('.fieldUnit').show();
				this.$("#ca_btn_store").attr("disabled", false);
			}else{
				this.$("#ca_vendorID").attr("disabled", false).closest('.fieldUnit').show();
				this.$("#ca_outStoreID").autocomplete('clAutocompleteItem', {});
				this.$("#ca_outStoreID").attr("disabled", true).closest('.fieldUnit').hide();
				this.$("#ca_btn_store").attr("disabled", true);
			}
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onStoreSelClick: function(e) {
			var unit = null;
			var _this = this;
			var options = {
				org_id: unit,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_kind_set: [
					am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
		            am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ
				],
				f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
			};

			_this.srchCondView.AMPAV0010Selector1.show(null, null, options);
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onOutStoreSelClick: function(e) {
			var options = {
				org_kind_set: [
					am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
		            am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ
				],
			    f_ignore_perm: 1,
			    f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
			};

			this.srchCondView.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMDLV0030'){
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
		 * @param selectedRecs 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedRecs){
			this.clearResult();
			$("#result").show();

			var defer = clutil.postJSON('AMDLV0030', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMDLV0030GetRsp.slipList;
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

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);

				var user_id = clcom.getUserData().user_id;
				var user_typeid = clcom.userInfo.user_typeid;
				var user_store = clcom.userInfo['org_id'];
				var json = localStorage.getItem('clcom.rfidstore');
				var rfid_list = JSON.parse(json);
				var rfid_flg = 0;
				if (clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					if (rfid_list.includes(user_store)) {
						rfid_flg = 1;
					}
				}

				this.recListView.setRowState({
					isMatch: function(item){
						return (
							item.dlvStateName === '入荷済' &&
								item.recInspectDate != clcom.getOpeDate()
						) || (
							// 荷番があればチェック不可
							item.shipNo.length > 0
						) || (
							item.dlvStateName === '全欠品'
						) || (
							// 店舗ユーザーの場合、自分が編集者でないときはチェック不可
							// 但し、更新ユーザーがシステムの場合を除く
							(user_typeid === amcm_type.AMCM_VAL_USER_STORE
									|| user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN)
							&& item.userID !== 0	// 20161118 更新ユーザーが0の場合はチェック可とする
							&& item.userID !== 2
							&& item.userID !== user_id
							&& item.dlvStateName === '入荷済'
						) || (
							 (rfid_flg === 1)
						);
					},
					enable: false
				});

				// 初期選択の設定（オプション）
				this.recListView.setSelectRecs(selectedRecs, true, [
//					'deliverID', 'tranInID', 'vendorOutID', 'tranOutID', 'dlvNo']);
					'firstDeliverID', 'firstTranInID', 'vendorOutID', 'tranOutID', 'dlvNo']);

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
			var defer = clutil.postDLJSON('AMDLV0030', srchReq);
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
		},

		/**
		 * 編集画面への遷移
		 */
		_jumpPage: function(rtyp, e){
			var url = clcom.appRoot + '/AMDL/AMDLV0040/AMDLV0040.html';
			var myData, destData;
			var storeID = null;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMDLV0030GetReq,
					selectedIds: this.recListView.getSelectedIdList(),
					selectedRecs: this.recListView.getSelectedRecs()
				};
				destData = {
					opeTypeId: rtyp,
					chkData: this.recListView.getSelectedRecs()
				};
				if (this.savedReq.AMDLV0030GetReq) {
					storeID = this.savedReq.AMDLV0030GetReq.srchStoreID;
				}
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

			// 選択レコードに店舗IDを埋め込む
			if (storeID && myData.selectedRecs) {
				for (var i = 0; i < myData.selectedRecs.length; i++) {
					myData.selectedRecs[i].storeID = storeID;
				}
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
				var lastClickedRec = this.recListView.getLastClickedRec();
				if(_.isEmpty(lastClickedRec)){
					// 最後にクリックした行データがとれなかった
					console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
					return;
				}
				lastClickedRec.storeID = storeID;
				destData.chkData = [ lastClickedRec ];

				// 別窓で照会画面を起動
				clcom.pushPage({
					url: url,
					args: destData,
					newWindow: true
				});
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
				this._onDlvTypeChanged();
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.selectedRecs);
			}

		},

		_eof: 'AMDLV0030.MainView//'
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
		// 他画面から遷移した場合は引数を検索条件にセット
		if(clcom.pageArgs) {
			if(clcom.pageArgs.data) {
				var data = clcom.pageArgs.data
				var dto = {
						srchStoreID: Number(data.storeID),
						srchStaffID: Number(data.staffCode),
						fromDate: Number(data.fromDate),
						srchSlipFmtID: "3",
				}
				mainView._onSrch(dto);
			}
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
