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

		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var unit = null;
			//店舗オートコンプリート
			this.srcStoreIdField = clutil.clorgcode({
				el: $("#ca_srchStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});

			// メーカー取得
			this.srchVendorIDField = clutil.clvendorcode({
				el: this.$('#ca_srchVendorID'),
				dependAttrs: {
					vendor_typeid: function(){
						return amdb_defs.MTTYPE_F_VENDOR_MAKER;   // メーカー
					}
				}
			});

			// 店舗・倉庫
			this.srchOutStoreIDField = clutil.clorgcode({
				el: '#ca_srchOutStoreID',
				dependAttrs : {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					org_typeid_list: [amcm_type.AMCM_VAL_ORG_KIND_STORE,amcm_type.AMCM_VAL_ORG_KIND_CENTER],
				    f_ignore_perm: 1
				}
			});

			// 伝票区分
			this.srchSlipFmtIDField = clutil.cltypeselector({
				el: this.$("#ca_srchSlipFmtID"),
				kind: amcm_type.AMCM_TYPE_SLIP_FORMAT
			});

			// 検索日
			clutil.datepicker(this.$('#ca_fromDate'));
			clutil.datepicker(this.$('#ca_toDate'));

			// 初期値を設定
			this.deserialize({
//TODO:初期値->ログインユーザの事業ユニット
//				srchStoreID : srchStoreID,
				fromDate: clcom.getOpeDate(),	// 開始日 yyyymmdd
				toDate: null,					// 終了日 yyyymmdd
				srchShipNo: null,				// 荷番
				srchDlvNo: null					// 伝票番号
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
/*
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
*/

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				//最終来店日
				stval : 'ca_fromDate',
				edval : 'ca_toDate'
			});

			var retStat = true;

			// 日付エラー確認
			if(!this.validator.valid()){
				retStat = false;
			}
			// 反転エラー確認
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				//this.validator.setErrorFocus();
				return false;
			}



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

		_eof: 'AMDLV0080.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			"change #ca_srchSlipFmtID"		: "_onDlvTypeChanged",
			'click #ca_btn_store_select'	: '_onStoreSelClick',		// 店舗選択補助画面起動
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		/**
		 * 伝票区分変更イベント
		 */
		_onDlvTypeChanged: function() {
			var dlvType = this.srchCondView.srchSlipFmtIDField.getValue();
			var srchVendorIDField = this.srchCondView.srchVendorIDField;
			var srchOutStoreIDField = this.srchCondView.srchOutStoreIDField;
			if(!dlvType){
				srchVendorIDField.$el
					.attr("disabled", true)
					.closest('.fieldUnit')
					.show();
				srchOutStoreIDField.$el
					.attr("disabled", true)
					.closest('.fieldUnit')
					.hide();
				srchOutStoreIDField.setValue();
				srchVendorIDField.setValue();
			}else if(dlvType == amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_TRANS){
				srchVendorIDField.$el
					.attr("disabled", true)
					.closest('.fieldUnit')
					.hide();
				srchOutStoreIDField.$el
					.attr("disabled", false)
					.closest('.fieldUnit')
					.show();
				srchVendorIDField.setValue();
				this.$("#ca_btn_store").attr("disabled", false);
			}else{
				srchVendorIDField.$el
					.attr("disabled", false)
					.closest('.fieldUnit')
					.show();
				srchOutStoreIDField.$el
					.attr("disabled", true)
					.closest('.fieldUnit')
					.hide();
				srchOutStoreIDField.setValue();
				this.$("#ca_btn_store").attr("disabled", true);
			}
		},

		initialize: function(){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '入荷予定リスト',
				subtitle: '',
				btn_new : false
				//subtitle: '一覧'
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMDLV0080 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDLV0080';

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

//			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var mainView = this;
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			this.recListView.initUIElement();

			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: this.$("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	this.$("#mainColumn"),
				select_mode : clutil.cl_single_select		// 単一選択
			});
			this.AMPAV0010Selector.render();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					data[0].id = data[0].val;
					mainView.srchCondView.srcStoreIdField.setValue(data[0]);
					mainView.setFocus();
				}
				_.defer(function(){									// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store_select")); 	// 参照ボタンへあてなおす
				});
			};

			this._onDlvTypeChanged();

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
			if (!_.isEmpty(clcom.pageArgs)) {
				if (!_.isEmpty(clcom.pageArgs.data.vpFromDate)) {
					this.$('#ca_fromDate').val(Number(clcom.pageArgs.data.vpFromDate));
					var rec = clcom.pageArgs.data;
					rec.fromDate = Number(rec.vpFromDate);
					clutil.data2view(this.$('#ca_srchArea'), rec);
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
				reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMDLV0080GetReq: srchReq
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
			};

			_this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			//console.log(arguments);
			if(groupid !== 'AMDLV0080'){
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
			// 入力チェック
			var retStat = true;
			if(!this.validator.valid()){
				retStat = false;
			}

			if (!retStat) {
				return;
			}
			this.clearResult();
			$("#result").show();

			var defer = clutil.postJSON('AMDLV0080', srchReq).done(_.bind(function(data){
				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMDLV0080GetRsp.slipList;
				var i = 0;

				//予定数にカンマ付与
				for(i = 0; i < recs.length ;i++){
					recs[i].qy = clutil.comma(recs[i].qy);
				}

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

				// 初期選択の設定（オプション）
				if(!_.isEmpty(selectedIds)){
					this.recListView.setSelectById(selectedIds, true);
				}

			}, this)).fail(_.bind(function(data){

				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

			}, this));

			this.resetFocus();

			return defer;
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// リクエストをつくる
			var srchReqdt;
			srchReqdt = clutil.view2data(this.$el);
			var srchReq = this.buildReq(srchReqdt);
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMDLV0080', srchReq);
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
		_doOpeAction: function(rtyp, e){
			var url = clcom.appRoot + '/AMDL/AMDLV0040/AMDLV0040.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMDLV0080GetReq,
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
				lastClickedRec.storeID = this.savedReq.AMDLV0080GetReq.srchStoreID;
				destData.chkData = [ lastClickedRec ];

				// 別窓で照会画面を起動
				clcom.pushPage({
					url: url,
					args: destData,
					newWindow: true
				});
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
				this.doSrch(model.savedReq, model.selectedIds);
			}

		},

		_eof: 'AMDLV0080.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();
		mainView.setFocus();


//		if(){
		//店舗でログイン時は自分の組織が初期値固定
//		var org = 1;
//		$("#ca_srchOrgID_View").val();
//		$("#ca_srchOrgID").val();

		//店舗でログイン時はリードオンリー
		clutil.viewReadonly($("#ca_readOnly"));
//	}


		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
		}

		if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
			// 組織表示
			mainView.srchCondView.srcStoreIdField.setValue({
				id: clcom.userInfo.org_id,
				code: clcom.userInfo.org_code,
				name: clcom.userInfo.org_name
			});
			// 店舗ユーザー
			clutil.inputReadonly($("#ca_srchStoreID"));
			clutil.inputReadonly($("#ca_btn_store_select"));
		}

		//			var type = clcom.userInfo.user_typeid;
		//			if (type == amcm_type.AMCM_VAL_USER_STORE){
		var dto = mainView.srchCondView.serialize();
		if (dto.srchStoreID){
			// 検索実行
			mainView._onSrch(dto);
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
