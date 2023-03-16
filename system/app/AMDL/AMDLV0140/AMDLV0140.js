/**
 * 返品／移動削除一覧
 */
useSelectpicker2();

$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// 条件入力部
	var SrchCondView = Backbone.View.extend({

		el: $('#ca_srchArea'),

		events: {
			'click #ca_srch'					: '_onSrchClick'			// 検索ボタン押下時
		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			clutil.inputlimiter(this.$el);

			// 店舗
			/*var srchStoreID = {
				id : clcom.userInfo.org_id,
				code : clcom.userInfo.org_code,
				name : clcom.userInfo.org_name,
			};*/

			var unit = null;
			//店舗オートコンプリート
			this.srcStoreIdField = clutil.clorgcode({
				el: $("#ca_srchStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					org_typeid: amcm_type.AMCM_VAL_ORG_KIND_STORE,
				}
			});

			// 担当者
			clutil.clstaffcode2($("#ca_srchStaffID"));

			// 伝票区分	#ca_srchSlipFmtID
//			clutil.cltypeselector(this.$("#ca_srchDlvTypeID"), amcm_type.AMCM_TYPE_RET_TRANS_SPLIP_TYPE, 1);
			this.utl_dlvType = clutil.cltypeselector({
				el: '#ca_srchDlvTypeID',
				kind: amcm_type.AMCM_TYPE_RET_TRANS_SPLIP_TYPE
	    	});

			// メーカー取得
			clutil.clvendorcode(this.$('#ca_srchMakerID'), {
				getVendorTypeId: _.bind(function(){
					return amdb_defs.MTTYPE_F_VENDOR_MAKER;   // メーカー
				}, this)
			});

			// 出荷日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_fromDate'));
			this.srchDatePicker = clutil.datepicker(this.$('#ca_toDate'));

			// 初期値を設定
			this.deserialize({
				//srchStoreID : srchStoreID,
				ca_srchDlvName: null,			// 伝票区分名称
				srchSlipFmtID: 0,
//				srchRetCode: 0,
//				srchDlvNo: 0,
//				srchMakerID: 0,
				fromDate: clcom.getOpeDate()				// 期間開始日 yyyymmdd
//				toDate: 0					// 期間終了日 yyyymmdd
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
			// 入力チェック
            var retStat = true;

            if(!this.validator.valid()){
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
		_onSrchClick: function(e) {
/**/
			// 入力チェック
			if(!this.isValid()){
				return;
			}
/**/
			// validation
			var f_error = false;
			this.validator.clear();
			if(!this.validator.valid()) {
				f_error = true;
			}
			// 伝票区分によるチェック
/*
			var $deliverNo = this.$("#ca_srchDlvNo");
			var dlvType = this.$("#ca_srchDlvTypeID").val();
			var deliverNoLen = this.$('#ca_srchDlvNo').val().length;
			if(dlvType == amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_TRANS){
				if(deliverNoLen != 7 && deliverNoLen != 0){
					this.validator.setErrorMsg($deliverNo, '伝票番号入力時は７桁で入力してください。');
					f_error = true;
				}
			}else{
				if(deliverNoLen != 8 && deliverNoLen != 0){
					this.validator.setErrorMsg($deliverNo, '伝票番号入力時は８桁で入力してください。');
					f_error = true;
				}
			}
*/
			if(f_error){
                this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return null;
			}
			var dto = this.serialize();

			// 伝票区分リスト設定
			var srchDlvTypeIDList = [];
			var $selectList = this.utl_dlvType.getValue();
			$.each($selectList,function(){
				srchDlvTypeIDList.push(Number(this));
			});
			dto.srchDlvTypeID = srchDlvTypeIDList;

			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMDLV0140.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({

		el:	$('#ca_main'),

		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',		// 店舗選択補助画面起動
			'click #ca_btn_center'	: '_onCenterSelClick',		// 倉庫選択補助画面起動
			'click #searchAgain'			: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			"click .ca_dl_td a" : "_doDLAction"
		},

		/**
		 * initialize関数
		 */
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
					title: '返品／移動出荷',
					subtitle: '一覧'
				});
			} else {
				this.mdBaseView = new clutil.View.MDBaseView({
					title: '返品／移動出荷',
					subtitle: '一覧',
					btn_new: false,
				});
			}
//			this.mdBaseView = new clutil.View.MDBaseView({
//				title: '返品／移動出荷',
//				subtitle: '一覧'
//			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMDLV0140 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDLV0140';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			/////////////////////////////////////////////////////////
			// 店舗部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = _.bind(function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var storeCodeName = {
						id: data[0].val,
						code: data[0].code,
						name: data[0].name
					};
					// 組織表示
					this.$('#ca_srchStoreID').autocomplete('clAutocompleteItem', storeCodeName);
					mainView.setFocus();
				}
				_.defer(function(){									// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store_select")); 	// 参照ボタンへあてなおす
				});
			},this);

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント
			clutil.mediator.on('onRowSelectChanged', this._setOpeButtonUI);

			// OPE系イベント
//			'click div#title p.addNew>a'	: '_onNewClick',			// 新規押下
//			'click #ca_edit'				: '_onEditClick',			// 編集ボタン押下
//			'click #ca_delete'				: '_onDeleteClick',			// 削除ボタン押下
//			'click #ca_rsvcancel'			: '_onReserveCancelClick'	// 予約取消ボタン押下
			clutil.mediator.on('onOperation', this._jumpPage);
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			this.mdBaseView.initUIElement();

			this.srchCondView.initUIElement();

			this.recListView.initUIElement();

			this.AMPAV0010Selector.render();

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				// 組織表示
				this.$('#ca_srchStoreID').autocomplete('clAutocompleteItem', {
					id: clcom.userInfo.org_id,
					code: clcom.userInfo.org_code,
					name: clcom.userInfo.org_name
				});
					// 店舗ユーザー
				clutil.inputReadonly($("#ca_srchStoreID"));
				clutil.inputReadonly($("#ca_btn_store_select"));
			}

			this.AMPAV0010Selector1 = new AMPAV0010SelectorView({
				el: this.$("#ca_AMPAV0010_dialog1"),		// 配置場所
				$parentView	:	this.$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector1.render();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector1.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					var store = code + ":" + name;
					$("#ca_srchOrgID").val(store);
//					$("#ca_srchOrgID").attr("cs_id", id);
//					$("#ca_srchOrgID").attr("cs_code", code);
//					$("#ca_srchOrgID").attr("cs_name", name);
					$("#ca_srchOrgID").data('cl_store_item', {
                        id: id,
                        code: code,
                        name: name
                    });
					mainView.setFocus();
				} else {
					$("#ca_srchOrgID").val("");
//					$("#ca_srchOrgID").attr("cs_id", "");
//					$("#ca_srchOrgID").attr("cs_code", "");
//					$("#ca_srchOrgID").attr("cs_name", "");
					var chk = $("#ca_srchOrgID").data("cl_store_item");
					if (chk == null || chk.length == 0) {
						$("#ca_srchOrgID").val("");
						$("#ca_srchOrgID").data('cl_store_item', "");
					}
				}
				_.defer(function(){							// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_center")); 	// 参照ボタンへあてなおす
				});
			};

			var unit = null;
			// 店舗オートコンプリート
			this.storeAutocomplete = clutil.clorgcode( {
				el : '#ca_srchOrgID',
				dependAttrs : {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
//					org_typeids: [amcm_type.AMCM_VAL_ORG_KIND_STORE,amcm_type.AMCM_VAL_ORG_KIND_CENTER],
					org_typeid_list: [amcm_type.AMCM_VAL_ORG_KIND_STORE,amcm_type.AMCM_VAL_ORG_KIND_CENTER,amcm_type.AMCM_VAL_ORG_KIND_HQ],
				    f_stockmng: 1, //在庫管理有無フラグ(1:在庫有り店舗のみ)
				    f_ignore_perm: 1
				},
		    });

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
		 * 初期フォーカス
		 */
		setFocus:function(){

			// clutil.setFocus($('#ca_srchStaffID'));

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {

				// ログインユーザが店舗ユーザの場合は初期フォーカスを担当者にセットする
				clutil.setFocus(this.$("#ca_srchStaffID"));

			} else {

				// ログインユーザが店舗ユーザ以外の場合は初期フォーカスを店舗にセットする
				clutil.setFocus(this.$("#ca_srchStoreID"));
			};
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
				AMDLV0140GetReq: srchReq
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
		 * 店舗参照ボタン押下処理
		 */
		_onStoreSelClick: function(e) {

			var _this = this;

			var options = {
				org_kind_set: [
					am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE
				]
			};

			_this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onCenterSelClick: function(e) {
			var unit = clcom.getUserData().unit_id;
			var _this = this;
			var options = {
				org_id: unit,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_kind_set: [
					am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
					am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ
				],
			    f_ignore_perm: 1,
			    f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
			};

			_this.AMPAV0010Selector1.show(null, null, options);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMDLV0140'){
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

		_setOpeButtonUI: function(groupid, arg, from) {
			var opeDate = clcom.getOpeDate();
			var selectedRecs = (arg && _.isArray(arg.selectedRecs)) ? arg.selectedRecs : [];

			//var ope1SelectedRecs = selectedRecs;	// 編集可能フラグ
			var ope2SelectedRecs = selectedRecs;	// 削除不可リスト

			ope2SelectedRecs = _.filter(arg.selectedRecs, function(dto) {
				return dto.dlvType === amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_REQ;
			});
			// デフォルトの活性/非活性判定関数
			var defaultIsEnabled = function(args){
				if(args.selectedCount <= 0){
					// 選択されていない。
					return false;
				}else if(args.selectedCount == 1){
					switch(args.btnOpeTypeId){
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
						if (ope2SelectedRecs.length > 0) {
							// 依頼あり返品は削除不可
							return false;
						}
						break;
					}
				}else{
					// 複数行選択
					if(args.selectionPolicy == 'single'){
						return false;
					} else {
						return true;
					}
				}
				return true;
			};
			var opeBtnIsEnabled = defaultIsEnabled;
			var pmctlSwitcher = clutil.permcntl.getReadonlySwitcher();

			$('.cl_opebtngroup').each(function(){
				var $pdiv = $(this);
				var gid = $pdiv.data('cl_groupid');

				if(_.isEmpty(gid) || gid == '*' || _.isEmpty(groupid) || groupid == '*' || gid == groupid){
					// ボタン個々に enabled(true/false) セットする、for-each() ループ
					$pdiv.find('.btn').each(function(){
						var $btn = $(this);
						var btnOpeTypeId = clutil.btnOpeTypeId($btn);
						var selectionPolicy = null;
						switch(btnOpeTypeId){
						case -1:	// 処理区分不定
							if($btn.hasClass('cl_selectui_multi')){
								selectionPolicy = 'multi';
							}else if($btn.hasClass('cl_selectui_single')){
								selectionPolicy = 'single';
							}else{
								// 不定 -- コントロール下にないボタンなので SKIP する。
								return;
							}
							break;
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
							selectionPolicy = 'multi';
							break;
						default:
							selectionPolicy = 'single';
						}
						var args = {
							$btn: $btn,
							selectedRows: selectedRecs,
							selectedCount: selectedRecs.length,
							btnOpeTypeId: btnOpeTypeId,
							selectionPolicy: selectionPolicy,
							hasHistory: true,
							opeDate: opeDate
						};

						if(!false/* FIXME 権限コントロール実装＝ＯＦＦ中 */){
							if(opeBtnIsEnabled(args)){
								// 活性化
								pmctlSwitcher.turnOff($btn);
							}else{
								// 非活性化
								pmctlSwitcher.turnOn($btn);
							}
						}else{
							if(opeBtnIsEnabled(args)){
								// 活性化
								$btn.removeAttr('disabled');
							}else{
								// 非活性化
								$btn.attr('disabled', true);
							}
						}
					});
				}
			});
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedRecs 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedRecs){
			this.clearResult();
			$("#result").show();

			var defer = clutil.postJSON('AMDLV0140', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMDLV0140GetRsp.slipList;
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

				var user_store = clcom.userInfo['org_id'];
				var json = localStorage.getItem('clcom.rfidstore');
				var rfid_list = JSON.parse(json);
				var rfid_flg = 0;
				if (clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					if (rfid_list.includes(user_store)) {
						rfid_flg = 1;
					}
				}

				_.each(recs, _.bind(function(item) {
					var redBlack = amcm_type.AMCM_VAL_REDBLACK_BLACK;
					if (item.dlvType === amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_REQ &&
							item.retConfirm == 1) {
						// 「依頼あり」で未確認の場合はチェック可
						redBlack = amcm_type.AMCM_VAL_REDBLACK_BLACK;
					} else if (item.shipDate != clcom.getOpeDate()) {
						// 出荷日が当日でなければチェック不可
						redBlack = amcm_type.AMCM_VAL_REDBLACK_RED;
					} else if (rfid_flg == 1) {
						// 所属店舗がRFID対象店舗の場合はチェック不可
						redBlack = amcm_type.AMCM_VAL_REDBLACK_RED;
					} else {
						// それ以外はチェック可
						redBlack = amcm_type.AMCM_VAL_REDBLACK_BLACK;
					}
					item.redBlack = redBlack;
				}, this));

				var user_id = clcom.getUserData().user_id;
				var user_typeid = clcom.userInfo.user_typeid;

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);
				this.recListView.setRowState({
					isMatch: function(item){
						if (item.dlvType === amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_REQ &&
								item.retConfirm == 1) {
							// 「依頼あり」で未確認の場合はチェック可
							return false;
						}
						if (item.shipDate != clcom.getOpeDate()) {
							// 出荷日が当日でなければチェック不可
							return true;
						}
						if ((user_typeid === amcm_type.AMCM_VAL_USER_STORE || user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN)
								&& item.userID !== user_id) {
							// 店舗ユーザで、編集者が自分で無い場合

							if (item.userID == 0 || item.userID == 2) {
								// 更新ユーザーがシステムの場合は、チェック可
								return false;
							} else {
								// それ以外はチェック不可
								return true;
							}
						}
						// それ以外はチェック可
						return false;
					},
					enable: false
				});

				// 初期選択の設定（オプション）
				this.recListView.setSelectRecs(selectedRecs, true, [
					'deliverID', 'tranOutID']);

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
			var defer = clutil.postDLJSON('AMDLV0140', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 内容行クリック
		 * @param e
		 */
		_doDLAction :function(e){
			var $tr = $(e.target).closest("tr");
			var rec = $tr.data('cl_rec');
			var slipId ;
			var $input = $tr.find('input[name="ca_dlvType"]');
			var dlvType = $input.val();
			var htDataType;
			var storeID;
			if (rec != null) {
				storeID = rec.storeID;
			}
			if (dlvType == amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_TRANS) {
				slipId = $tr.attr("tranid");
				htDataType = amcm_type.AMCM_VAL_HT_DATA_TRANS_OUT;
			} else {
				slipId = $tr.attr("delvid");
				htDataType = amcm_type.AMCM_VAL_HT_DATA_RETURN;
			}
			var shipDate = $tr.attr("shipDate");

			var srchReq = {
					reqHead : {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF
					},
					AMCMV0140GetReq : {
						slipId : slipId,
						srchOrgID: storeID,
						htDataType : htDataType,
						fromDate : shipDate,
						toDate : shipDate,
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
		_jumpPage: function(rtyp, pgIndex, e){
			var url = clcom.appRoot + '/AMDL/AMDLV0150/AMDLV0150.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMDLV0140GetReq,
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
					if(model.selectedRecs[0] != null && model.selectedRecs[0].deliverID == 0 && model.selectedRecs[0].tranOutID == 0){
						this.doSrch(model.savedReq);
					} else {
						this.doSrch(model.savedReq, model.selectedRecs);
					}
				}
			}

		},

		_eof: 'AMDLV0140.MainView//'
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
//			mainView.load(clcom.pageData);
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
