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
			clutil.datepicker(this.$("#ca_srchFromDate"));
			clutil.datepicker(this.$("#ca_srchToDate"));

			// メッセージチップ
			$("#tp_vendor").tooltip({html:true});
			$("#tp_org").tooltip({html:true});
			$("#tp_jan").tooltip({html:true});
			$("#tp_sku").tooltip({html:true});
			$("#tp_makerItemCode").tooltip({html:true});
			$("#tp_billNo").tooltip({html:true});
			$("#tp_rcptNo").tooltip({html:true});
			$("#tp_invNo").tooltip({html:true});
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
						stval : 'ca_srchFromDate',
						edval : 'ca_srchToDate'
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

		_eof: 'AMSIV0050.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'change #ca_srchUnitID'			:	'_onSrchUnitChanged',		// 事業ユニットが変更された
			'click #ca_btn_store_select'	: 	'_onStoreSelClick',			// 店舗選択
			'click #ca_btn_Mystore_select'	: 	'_onMyStoreSelClick',		// 自店舗選択
			'click #searchAgain'			: 	'_onSearchAgainClick'		// 検索条件を再指定ボタン押下
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '商品管理',
				subtitle: '履歴検索',
				btn_new: false,		// 新規作成は不要
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});
			// グループID -- AMSIV0050 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMSIV0050';

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

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント
			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);		// JAN押下で商品マスタへ移動
		},


		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧では使用しない*/, e){
			if ($(e.target).is('a[name="a_codeLink"]') || $(e.target).is('td[name="td_codeLink"]')) {

				var url = clcom.appRoot + '/AMMS/AMMSV0140/AMMSV0140.html';

				var tr = $(e.target).closest("tr");
				var tblData = clutil.tableview2data($(tr));
				var commonData = clutil.view2data($("#ca_srchMyOrgID_div"));
				var orgID = commonData.srchMyOrgID;

				// 別窓で照会画面を起動
                clcom.pushPage({
                    url: url,
                    args: {
						srchDate: clcom.getOpeDate(),
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
						chkData: [{
							id: tblData[0].item_id,			// 商品ID
							orgID: orgID					// 店舗ID
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



		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			this.recListView.initUIElement();


			//サブ画面配置
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector.render();

			// 日付設定
			this.srchFrom = clutil.datepicker(this.$('#ca_srchFromDate'));
			this.srchFrom.datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), -30));
			this.srchTo = clutil.datepicker(this.$('#ca_srchToDate'));
			this.srchTo.datepicker('setIymd', clcom.getOpeDate());


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
				el : '#ca_srchOrgID',
				dependAttrs : {
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id : Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					org_typeid:	amcm_type.AMCM_VAL_ORG_KIND_STORE,
					f_ignore_perm : 1,
					p_org_id	: p_org_id
				},
			});
			this.my_store = clutil.clorgcode( {
				el : '#ca_srchMyOrgID',
				dependAttrs : {
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id : Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					org_typeid:	amcm_type.AMCM_VAL_ORG_KIND_STORE,
					f_ignore_perm : 1,
					p_org_id	: p_org_id
				},
			});


			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				//this.utl_store.setValue({id: storeID, code: storeCode, name: storeName});
				this.my_store.setValue({id: storeID, code: storeCode, name: storeName});
				$('#ca_srchUnitID').selectpicker('val', clcom.getUserData().unit_id);
				clutil.viewReadonly($("#ca_srchUnitID_div"));
			}else{
				// MD-4319 社員ユーザの場合は参照可能組織の値を見て制御を変更する
				if (clcom.userInfo.dataperm_typeid != amcm_type.AMCM_VAL_DATAPERM_FULL) {
					clutil.viewReadonly($("#ca_srchOrgID_div"));
					clutil.viewReadonly($("#ca_srchMyOrgID_div"));
				}
			}

			// 取引先オートコンプリート
			clutil.clvendorcode(this.$('#ca_srchVendorID'), {
				getVendorTypeId: _.bind(function(){
					return amdb_defs.MTTYPE_F_VENDOR_MAKER;   // メーカー
				}, this)
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
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				return;
			}
			var unitID = Number($(e.target).val());

			if(unitID < clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.viewReadonly($("#ca_srchOrgID_div"));
				clutil.viewReadonly($("#ca_srchMyOrgID_div"));
			}
			else{
				clutil.viewRemoveReadonly($("#ca_srchOrgID_div"));
				clutil.viewRemoveReadonly($("#ca_srchMyOrgID_div"));
			}

			this.getOrg($("#ca_srchOrgID"), unitID);
			this.getOrg($("#ca_srchMyOrgID"), unitID);

			// 店舗未選択状態
			this.utl_store.setValue({id: 0, code: "", name: ""});
			this.my_store.setValue({id: 0, code: "", name: ""});
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
				clutil.setFocus($('#ca_srchMyOrgID'));
				this.$("#ca_srchOrgID").show();
				this.$("#ca_srchMyOrgID").show();
				this.$("#ca_btn_store_select").show();
				this.$("#ca_btn_Mystore_select").show();
			}else{
				clutil.setFocus($('#ca_srchUnitID'));
				this.$("#ca_srchOrgID").show();
				this.$("#ca_srchMyOrgID").show();
				this.$("#ca_btn_store_select").show();
				this.$("#ca_btn_Mystore_select").show();
			}
			return this;
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){
			var _this = this;

			var unit = $("#ca_srchUnitID").val();
			_this.AMPAV0010Selector.show(null, null,{
				org_id: unit,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'), 1),		//基本組織を対象
//				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
//				               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
//				               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
				f_ignore_perm: 1	//権限無視フラグ
			});

			// 選択サブ画面復帰処理
			_this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var d = data[0];
					_this.utl_store.setValue({
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
		 * 自店舗［参照］ボタンクリック
		 */
		_onMyStoreSelClick: function(e){
			var _this = this;

			var unit = $("#ca_srchUnitID").val();
			_this.AMPAV0010Selector.show(null, null,{
				org_id: unit,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'), 1),		//基本組織を対象
//				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
//				               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
//				               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
				f_ignore_perm: 1	//権限無視フラグ
			});

			// 選択サブ画面復帰処理
			_this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var d = data[0];
					_this.my_store.setValue({
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

			// 検索区分が1つもなければエラー
			if(srchReq.cancelFlag == 0 && srchReq.defectFlag == 0
					&& srchReq.emendFlag == 0 && srchReq.exportFlag == 0 && srchReq.importFlag == 0
					&& srchReq.invFlag == 0 && srchReq.returnFlag == 0 && srchReq.saleFlag == 0){
				clutil.mediator.trigger('onTicker',clutil.fmtargs(clmsg.cl_its_required, ["1つ以上の区分"]));
				return null;
			}

			// 検索条件が1つもなければエラー
			if(srchReq.srchBillNo == "" && srchReq.srchInvNo == "" && srchReq.srchJAN == ""
				&& srchReq.srchMakerItemCode == "" && srchReq.srchRcptNo == "" && srchReq.srchSKU == ""
				&& (srchReq.srchVendorID == 0 || srchReq.srchVendorID == undefined)
				&& (srchReq.srchOrgID == 0 || srchReq.srchOrgID == undefined)){
				clutil.mediator.trigger('onTicker',clutil.fmtargs(clmsg.cl_its_required, ["1つ以上の条件"]));
				return null;
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
					//AMSIV0050GetReq: srchReq

					srchUnitID:srchReq.srchUnitID,
					srchMyOrgID:srchReq.srchMyOrgID,
					srchFromDate:srchReq.srchFromDate,
					srchToDate:srchReq.srchToDate,
					srchOrgID:srchReq.srchOrgID,
					srchVendorID:srchReq.srchVendorID,
					srchBillNo:srchReq.srchBillNo,
					srchInvNo:srchReq.srchInvNo,
					srchJAN:srchReq.srchJAN,
					srchMakerItemCode:srchReq.srchMakerItemCode,
					srchRcptNo:srchReq.srchRcptNo,
					srchSKU:srchReq.srchSKU,
					importFlag:srchReq.importFlag,
					exportFlag:srchReq.exportFlag,
					emendFlag:srchReq.emendFlag,
					invFlag:srchReq.invFlag,
					saleFlag:srchReq.saleFlag,
					returnFlag:srchReq.returnFlag,
					cancelFlag:srchReq.cancelFlag,
					defectFlag:srchReq.defectFlag
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);
			if(req == null){
				return;
			}
			// 検索実行
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMSIV0050'){
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

			var defer = clutil.postJSON('AMSIV0050', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.rspList;

				if(_.isEmpty(recs)){

					// 画面を一旦リセット
					mainView.srchAreaCtrl.reset();
					// 検索ペインを表示？
					mainView.srchAreaCtrl.show_srch();
					//合計点数表示リセット
					$("#disp_sumQy").text("0");

					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					return;
				}

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				var i;
				for(i = 0; i < recs.length; i++){
					// disp用に変形
					recs[i].disp_kind = "";
					recs[i].userCode = recs[i].user.code;
					recs[i].toOrgCode = recs[i].toOrg.code;
					recs[i].toOrgName = recs[i].toOrg.name;
					recs[i].toOrgID = recs[i].toOrg.id;
					recs[i].itgrpCode = recs[i].itgrp.code;
					recs[i].itgrpName = recs[i].itgrp.name;
					recs[i].itemName = recs[i].item.name;
					recs[i].itemID = recs[i].item.id;
					recs[i].dispToOrg = recs[i].toOrg.code + ":" + recs[i].toOrg.name;
					if(recs[i].toOrg.code == "" && recs[i].toOrg.name == ""){
						recs[i].dispToOrg = "";
					}

					if(recs[i].kind == 1){
						recs[i].disp_kind = "入荷";
					}
					else if(recs[i].kind == 2){
						recs[i].disp_kind = "出荷";
					}
					else if(recs[i].kind == 3){
						recs[i].disp_kind = "訂正";
					}
					else if(recs[i].kind == 4){
						recs[i].disp_kind = "棚卸";
					}
					else if(recs[i].kind == 5){
						recs[i].disp_kind = "売上";
					}
					else if(recs[i].kind == 6){
						recs[i].disp_kind = "売上返品";
					}
					else if(recs[i].kind == 7){
						recs[i].disp_kind = "売上取消";
					}
					else if(recs[i].kind == 8){
						recs[i].disp_kind = "不良品処理";
					}

				}

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);

//				// 初期選択の設定（オプション）
//				if(!_.isEmpty(chkData)){
//					this.recListView.setSelectRecs(chkData, true, ['firstID']);
//				}


				// 合計値表示
				var sumQy = data.sumQy;
				$("#disp_sumQy").text(sumQy);

				this.resetFocus($focusElem);

			}, this)).fail(_.bind(function(data){
				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
				//合計点数表示リセット
				$("#disp_sumQy").text("0");

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

		_eof: 'AMSIV0050.MainView//'
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