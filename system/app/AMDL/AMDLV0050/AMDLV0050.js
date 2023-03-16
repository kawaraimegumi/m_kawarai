useSelectpicker2();

$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var isStoreUser;

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			"change #ca_srchDlvwapDispTypeID"	: "_onDlvTypeChanged",
			'click #ca_btn_store_select'	: '_onStoreSelClick',		// 店舗選択補助画面起動
			'click #ca_btn_store'			: '_onOutStoreSelClick',	// 店舗選択補助画面起動
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
			var srchCondView = this;

			// 店舗選択1(srchStoreID)
			this.AMPAV0010Selector1 = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog1"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select		// 単一選択
			});
			this.AMPAV0010Selector1.render();
			// 選択サブ画面復帰処理
			this.AMPAV0010Selector1.okProc = function(data) {
				if (data !== null && data.length == 1) {
					data[0].id = data[0].val;
					srchCondView.srchStoreIdField.setValue(data[0]);
				}
				_.defer(function(){							// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store_select")); 	// 参照ボタンへあてなおす
				});
			};

			// 店舗選択2(srchOutOrgID)
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView: $("#mainColumn"),
				select_mode: clutil.cl_single_select		// 単一選択
			});
			this.AMPAV0010Selector.render();
			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					data[0].id = data[0].val;
					srchCondView.srchOutOrgField.setValue(data[0]);
				}
				_.defer(function(){									// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store")); 	// 参照ボタンへあてなおす
				});
			};

			////////////////////////////////////////////////////////////////
			var unit = null;
			//店舗オートコンプリート
			this.srchStoreIdField = clutil.clorgcode({
				el: $("#ca_srchStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});

			// 店舗オートコンプリート
			this.srchOutOrgField = clutil.clorgselector( {
				el : '#ca_srchOutOrgID',
				dependAttrs : {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					org_typeid: amcm_type.AMCM_VAL_ORG_KIND_CENTER,
				    f_ignore_perm: 1
				}
		    });

			// 納品形態区分
			clutil.cltypeselector({
				el: this.$("#ca_srchDlvwapDispTypeID"),
				kind: amcm_type.AMCM_TYPE_DISP_DLV_ROUTE
			});

			// メーカー
			this.srchVendorField = clutil.clvendorcode({
				el: this.$('#ca_srchVendorID'),
				dependAttrs: {
					// メーカー
					vendor_typeid: amdb_defs.MTTYPE_F_VENDOR_MAKER
				}
			});

			// 入荷状態区分取得
			clutil.cltypeselector({
				el: this.$("#ca_srchDlvStatID"),
				kind: amcm_type.AMCM_TYPE_DLV_STAT
			});

			// 担当者
			clutil.clstaffcode2($("#ca_srchStaffID"));

			// 入荷状態区分	#ca_srchDlvStateID
			clutil.cltypeselector({
				el: this.$("#ca_srchDlvStateID"),
				kind: amcm_type.AMCM_TYPE_DLV_STAT
			});

			// 検収日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_fromDate'));
			this.srchDatePicker = clutil.datepicker(this.$('#ca_toDate'));

			// 初期値を設定
			this.deserialize({
//				srchStaffID: 0,
//				srchOpeTypeID: 0,
//				srchShipNo: 0,
//				srchMakerID: 0,
				fromDate: clcom.getOpeDate()				// 期間開始日 yyyymmdd
//				toDate: 0					// 期間終了日 yyyymmdd
			});

			this._onDlvTypeChanged();
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
			// 入力チェック
            var retStat = true;

            if(!this.validator.valid()){
                retStat = false;
            }

			var $stval = this.$('#ca_fromDate');
			var $edval = this.$('#ca_toDate');
            var stvaeLen = this.$('#ca_fromDate').val().length;
            var edvalLen = this.$('#ca_toDate').val().length;

			// ヌルチェック
			if (stvaeLen == 0 &&
					 edvalLen == 0) {
                this.validator.setErrorMsg($stval, '検収日は開始・終了どちらかは必ず入力してください。');
                this.validator.setErrorMsg($edval, '検収日は開始・終了どちらかは必ず入力してください。');
				retStat = false;
            }
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
		_onSrchClick: function() {
			// 入力チェック
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		/**
		 * 納品形態区分変更イベント
		 */
		_onDlvTypeChanged: function() {
			var dlvType = parseInt(this.$("#ca_srchDlvwapDispTypeID").val(), 10);
			if(!dlvType){
				this.srchVendorField.$el
					.attr("disabled", true)
					.closest('.fieldUnit')
					.show();

				clutil.inputReadonly(this.srchOutOrgField.$el);
				this.srchOutOrgField.$el
					.closest('.fieldUnit')
					.hide();

				this.srchVendorField.setValue();
				this.srchOutOrgField.setValue();
			}else if(dlvType == amcm_type.AMCM_VAL_DLV_ROUTE_DIRECT ||
				dlvType == amcm_type.AMCM_VAL_DLV_ROUTE_TC1){
				this.srchVendorField.$el
					.attr("disabled", false)
					.closest('.fieldUnit').show();

				clutil.inputReadonly(this.srchOutOrgField.$el);
				this.srchOutOrgField.$el
					.closest('.fieldUnit')
					.hide();

				this.srchOutOrgField.setValue();
			}else{
				this.srchVendorField.$el
					.attr("disabled", true)
					.closest('.fieldUnit')
					.hide();

				clutil.inputRemoveReadonly(this.srchOutOrgField.$el);
				this.srchOutOrgField.$el
					.closest('.fieldUnit')
					.show();

				this.srchVendorField.setValue();
			}
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onStoreSelClick: function() {
			var unit = null;
			var options = {
				org_id: unit,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_kind_set: [
					am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
		            am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ
				]
			};

			this.AMPAV0010Selector1.show(null, null, options);
///			this.AMPAV0010Selector1.show();
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onOutStoreSelClick: function() {
			var options = {
				org_kind_set: [
//					am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER
				],
			    f_ignore_perm: 1
			};

			this.AMPAV0010Selector.show(null, null, options);
		},

		_eof: 'AMDLV0050.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #searchAgain'				: '_onSearchAgainClick'		// 検索条件を再指定ボタン押下
		},

		mediatorEvents: {
			onRowSelectChanged: function(){
				this.validButtons();
			}
		},

		canDelete: function(selectedRecs){
			var item = _.first(selectedRecs);
			if (isStoreUser) {
				// 店舗ユーザーは削除不可
				return false;
			}
			if (selectedRecs.length === 1) {
				if (item.dlvStateName === '入荷予定未検収') {
					if (item.dlvwapDispTypeID == amcm_type.AMCM_VAL_DLV_ROUTE_DC1 ||
							item.dlvwapDispTypeID == amcm_type.AMCM_VAL_DLV_ROUTE_TRANSFER) {
						return false;
					} else {
						return this.isHQUser;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
//			return selectedRecs.length === 1 &&
//				(!this.isHQUser &&
//				item.dlvStateName !== '入荷予定未検収');
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

		isHQUser: false,

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
					title: 'SCM入荷データ',
					subtitle: '一覧',
					btn_csv: false
				});
			} else {
				this.mdBaseView = new clutil.View.MDBaseView({
					title: 'SCM入荷データ',
					subtitle: '一覧',
					btn_csv: false,
					btn_new: false,
				});
			}
//			this.mdBaseView = new clutil.View.MDBaseView({
//				title: 'SCM入荷データ',
//				subtitle: '一覧',
//				btn_csv: false
//			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMDLV0050 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDLV0050';

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

			this.isHQUser = clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STAFF_SYS
								|| clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STAFF_KEISEN
								|| clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STAFF;
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			this.recListView.initUIElement();

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				// 組織表示
				this.srchCondView.srchStoreIdField.setValue({
					id: clcom.userInfo.org_id,
					code: clcom.userInfo.org_code,
					name: clcom.userInfo.org_name
				});

				// 店舗ユーザー
				clutil.inputReadonly($("#ca_srchStoreID"));
				clutil.inputReadonly($("#ca_btn_store_select"));
			}

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
		 * 初期フォーカス
		 */
		setFocus:function(){
			clutil.focus(null, 0, {view: this.$el});
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
				AMDLV0050GetReq: srchReq
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
			if(groupid !== 'AMDLV0050'){
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
			var mainView = this;

			this.clearResult();
			$("#result").show();

			var defer = clutil.postJSON('AMDLV0050', srchReq).done(_.bind(function(data){
				this.searched = true;
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMDLV0050GetRsp.slipList;
				if(_.isEmpty(recs)){
					// 検索ペインを表示？
					mainView.srchAreaCtrl.show_srch();

					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					$("#result").hide();
					return;
				}

				// IDをつける
				_.each(recs, function(rec, i){
					rec.id = i;
					rec.srchVendorCode = rec.srchVendor && rec.srchVendor.code;
					rec.srchOrgCode = rec.srchOrg && rec.srchOrg.code;
				});

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();
				$("#mainColumnFooter").show();

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);

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
								 (rfid_flg === 1)
						);
					},
					enable: false
				});

				this.recListView.setEnableRecs(_.filter(recs, function(rec){
					// 店舗ユーザーは過去データの編集不可
					return isStoreUser &&
						rec.dlvStateID === amcm_type.AMCM_VAL_DLV_STAT_DELIVERED &&
						rec.recInspectDate < clcom.getOpeDate();
				}), false);

				// 初期選択の設定（オプション）
				this.recListView.setSelectRecs(selectedRecs, true, ['shipNo', 'srchVendorCode', 'srchOrgCode']);

				this.validButtons();

				this.resetFocus();

				this.setFooter();
			}, this)).fail(_.bind(function(data){
				this.searched = false;
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
			var defer = clutil.postDLJSON('AMDLV0050', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		setFooter: function(){
			var options = {};
			if (this.searched && !isStoreUser) {
				options.btn_csv = true;
			} else {
				options.btn_csv = false;
			}
			_.extend(this.mdBaseView.options, options);
			this.mdBaseView.renderFooterNavi();
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function(){
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(){
			// this.searched = false;
			this.setFooter();
			this.srchAreaCtrl.show_srch();
			$("#mainColumnFooter").hide();
		},

		/**
		 * 編集画面への遷移
		 */
		_jumpPage: function(rtyp){
			var url = clcom.appRoot + '/AMDL/AMDLV0060/AMDLV0060.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMDLV0050GetReq,
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
				this.srchCondView._onDlvTypeChanged();
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.selectedRecs);
			}

		},

		_eof: 'AMDLV0050.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		isStoreUser = clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE;

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
