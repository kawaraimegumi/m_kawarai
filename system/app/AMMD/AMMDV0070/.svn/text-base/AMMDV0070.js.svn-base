useSelectpicker2();

$(function() {

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),

		events: {

			'click #ca_srch':		'_onSrchClick',			// 検索ボタン押下時
			'change #ca_srchFunc':	'_onSrchFuncChange',	// 発注書区分変更イベント
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

			// 発注書区分
			clutil.cltypeselector($("#ca_srchFunc"), /*amcm_type.AMCM_TYPE_APPROVE_DATA*/282);

			// 更新者
			clutil.clusercode2($("#ca_srchApplyUserID"));
			clutil.clusercode2($("#ca_approve1UserID"));
			clutil.clusercode2($("#ca_approve2UserID"));

			// カレンダー
			clutil.datepicker(this.$('#ca_srchLimitDateFrom'));
			clutil.datepicker(this.$('#ca_srchLimitDateTo'));
			clutil.datepicker(this.$('#ca_srchApproveDateFrom'));
			clutil.datepicker(this.$('#ca_srchApproveDateTo'));

			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrpID",
				},
			}, {
				dataSource: {
				}
			});
			this.fieldRelation.done(function() {

			});

			var unit = null;
			var unit_id = clcom.getUserData().unit_id;
			if(unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				unit = unit_id;
				//clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}

			// 初期値を設定
			this.deserialize({
				srchUnitID: unit,					// 事業ユニットID
				srchFunc: 0,						// 発注書区分
				srchOrderNo: null,					// 発注書番号
				srchItgrpID: 0,						// 品種ID
				srchMakerID: 0,						// メーカーID
				srchCode: null,						// メーカー品番
				srchApplyFlag: 1,					// 申請
				srchReturnFlag: 1,					// 差戻し
				srchApprove1Flag: 1,				// 1次承認済み
				srchApprove2Flag: 1,				// 2次承認済み
				srchLimitDateFrom: 0,				// 承認期限日From
				srchLimitDateTo: 0,					// 承認期限日To
				srchApproveDateFrom: 0,				// 承認日From
				srchApproveDateTo: 0,				// 承認日To
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
			var f_valid = true;
			// 承認期限日の大小
			if (!this.validator.validFromToObj([{
				$stval: $("#ca_srchLimitDateFrom"),
				$edval: $("#ca_srchLimitDateTo")
			}])) {
				f_valid = false;
			}
			// 承認日の大小
			if (!this.validator.validFromToObj([{
				$stval: $("#ca_srchApproveDateFrom"),
				$edval: $("#ca_srchApproveDateTo")
			}])) {
				f_valid = false;
			}

			return f_valid;
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 商品分類体系コード/商品分類階層/上位分類コード・オートコンプリート設定チェック
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			//this.trigger('ca_onSearch', dto);
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		/**
		 * 発注書区分変更イベント
		 * @param e
		 */
		_onSrchFuncChange: function(e) {
			var $tgt = $(e.target);
			var val = $tgt.val();

			var $code = $("#ca_srchCode");

			if (val == amcm_type.AMCM_VAL_ORDER_FUNC_PACK) {
				// 発注兼振分書の場合、メーカー品番を操作不可にする
				$code.val('');
				clutil.inputReadonly($code);
			} else {
				// 発注兼振分書以外の場合、メーカー品番を操作可にする
				clutil.inputRemoveReadonly($code);
			}
		},

		_eof: 'AMSSV0510.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #ca_AMMDV0060':		'_onAMMDV0060Click',	// マークダウン・返品依頼承認一覧遷移

			'click #searchAgain'		: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click a[name="pdf_output"]': 'doDownload'
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: 'マークダウン・返品依頼承認状況確認',
				subtitle: '',
				btn_new: false,		// 新規作成は不要
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMMDV0070 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMMDV0070';

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
			clutil.mediator.on('onOperation', this._doOpeAction);

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
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
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}
			this.recListView.render();
			return this;
		},

		// TODO ここまで見た

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
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
				reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMMDV0070GetReq: srchReq,
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var retStat = true; // input check var
			// check by validator
			if(!this.validator.valid()){
				retStat = false;
			}

			// if some input is not correct, return
			if (!retStat) {
				return;
			}

			var req = this.buildReq(srchReqDto);

			// 検索実行
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMMDV0070'){
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
			this.doSrch(req, null, $('#ca_table'));
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedIds, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMMDV0070', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMMDV0070GetRsp.itemList;
				if(_.isEmpty(recs)){
					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					// 検索ペインを表示
					mainView.srchAreaCtrl.reset();
					mainView.srchAreaCtrl.show_srch();
					var $tgt = $("#ca_srchUnitID").next().children('input');
					this.resetFocus($tgt);
				} else {

					// リクエストを保存。
					this.savedReq = srchReq;

					// 結果ペインを表示
					var srchFunc = parseInt(this.savedReq.AMMDV0070GetReq.srchFunc, 10);
					this.srchAreaCtrl.show_result();
					// 内容物がある場合 --> 結果表示する。
					window.__srchFunc = srchFunc;
					this.recListView.setRecs(recs);
					delete window.__srchFunc;

					this.resetFocus($focusElem);
				}
			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 検索ペインを表示
				mainView.srchAreaCtrl.reset();
				mainView.srchAreaCtrl.show_srch();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				this.resetFocus($focusElem);

			}, this));

			return defer;
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧では使用しない*/, e){
			var url;
			if (this.savedReq != null && this.savedReq.AMMDV0070GetReq.srchFunc == amcm_type.AMCM_VAL_APPROVE_DATA_MD) {
				url = clcom.appRoot + '/AMMD/AMMDV0020/AMMDV0020.html';
			} else if (this.savedReq != null && this.savedReq.AMMDV0070GetReq.srchFunc == amcm_type.AMCM_VAL_APPROVE_DATA_DS) {
				url = clcom.appRoot + '/AMMD/AMMDV0050/AMMDV0050.html';
			} else {
				url = clcom.appRoot + '/AMDL/AMDLV0120/AMDLV0120.html';
			}

			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMMDV0060GetReq,
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
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				var lastClickedRec = this.recListView.getLastClickedRec();
				if(_.isEmpty(lastClickedRec)){
					// 最後にクリックした行データがとれなかった
					console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
					return;
				}
				lastClickedRec.id = lastClickedRec.markdownID;
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
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
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
		 * マークダウン・返品依頼承認(AMMDV0060)への遷移
		 * @param e
		 */
		_onAMMDV0060Click: function(e) {
			var url = clcom.appRoot + '/AMMD/AMMDV0060/AMMDV0060.html';

			clcom.pushPage({
				url: url,
				args: {},
			});
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
			} else {
				var $tgt = $("#ca_srchUnitID").next().children('input');
				this.resetFocus($tgt);
			}
		},

		/**
		 * 他ページからの遷移
		 * @param data
		 */
		load2: function(model) {
			if (!_.isEmpty(model.data)) {
				var unit = null;
				var unit_id = clcom.getUserData().unit_id;
				if(unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
						|| unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
					unit = unit_id;
					//clutil.viewReadonly($("#ca_srchUnitIDArea"));
				}

				var data = {
					srchUnitID: unit,
					srchFunc: model.data.vpOrderFuncTypeID,
					srchApplyFlag: 1,
					srchApprove1Flag: 1,
					srchReturnFlag: 1,
				};
				this.srchCondView.deserialize(data);
				var req = this.buildReq(data);
				this.doSrch(req);
			}
		},

		_eof: 'AMMDV0070.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();
		if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
			clutil.setFocus($('#ca_srchFunc'));
		}
		else{
			clutil.setFocus($('#ca_srchUnitID'));
		}

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
		} else if (clcom.pageArgs) {
			mainView.load2(clcom.pageArgs);
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
