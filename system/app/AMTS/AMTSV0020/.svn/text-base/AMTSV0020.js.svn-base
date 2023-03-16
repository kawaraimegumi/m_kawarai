/**
 * 移動依頼作成一覧（サイズアソート）
 */

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

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'));

			// 品種オートコンプリート
			clutil.FieldRelation.create("default", {
				// 事業ユニット取得
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrpID"
				}
			});

			// 状態
			clutil.cltypeselector(this.$("#ca_srchStatusID"), amcm_type.AMCM_TYPE_TEMP_TRANS_STATUS,1);

			// 担当者selector
			clutil.clusercode2($("#ca_srchUserID"));

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

			// 必須項目入力チェック
			if(!this.validator.valid()){
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				//this.validator.setErrorFocus();
				retStat = false;
			}

			return retStat;

		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {

			if(this.isValid() == false){
				return;
			}

			var dto = this.serialize();

			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMTSV0020.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View

	// グループID -- AMTSV0020 なデータに関連することを表すためのマーキング文字列
	var groupid = 'AMTSV0020';

	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #ca_AMTRV0010'	: '_onAMTRV0010Click',	// 移動依頼一覧(一括)(AMTRV0010)へ遷移
			'click #ca_AMTSV0050'	: '_onAMTSV0050Click',	// 移動依頼一覧(セットアップ)(AMTSV0050)へ遷移
			'click #searchAgain'	: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		/**
		 * initialize関数
		 */
		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '移動依頼作成（サイズアソート）',
				subtitle: '一覧'
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

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

			// 一覧選択のチェンジアクションを監視
			clutil.mediator.on('onRowSelectChanged', this._setOpeButtonUI);
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			this.recListView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srchArea'),
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

			// 初期フォーカスをセット
			var $tgt = null;
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$tgt = $("#ca_srchItgrpID");
			}
			else{
				$tgt = $("#ca_srchUnitID");
			}
			clutil.setFocus($tgt);

			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				srchReq = this.srchCondView.serialize();
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
				AMTSV0020GetReq: srchReq
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
			if(groupid !== 'AMTSV0020'){
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

			var defer = clutil.postJSON('AMTSV0020', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」

				if(_.isEmpty(data.AMTSV0020GetRsp)){

					// 画面を一旦リセット
					mainView.srchAreaCtrl.reset();
					// 検索ペインのみ表示する
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
				var recs = data.AMTSV0020GetRsp.monthPlans;
				this.recListView.setRecs(recs);

				// 初期選択の設定（オプション）
				if(!_.isEmpty(chkData)){
					// キーとなるプロパティを指定すること！
					this.recListView.setSelectRecs(chkData, true, ['instructNo']);
				}

				this.resetFocus($focusElem);

			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
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
//					// 検索ボタンにフォーカスする
//					this.$('#ca_AMRSV0010_search').focus();
//				} else {
//					// 条件を追加ボタンにフォーカスする
//					this.$('#ca_AMRSV0010_add').focus();
//				}
			}
		},

		/**
		 * 移動依頼一覧(一括)(AMTRV0010)へ遷移
		 * @param e
		 */
		_onAMTRV0010Click: function(e) {

			var url = clcom.appRoot + '/AMTR/AMTRV0010/AMTRV0010.html';

			clcom.pushPage({
				url: url,
				args: {}
			});
		},

		/**
		 * 移動依頼一覧(セットアップ)(AMTSV0050)へ遷移
		 * @param e
		 */
		_onAMTSV0050Click: function(e) {

			var url = clcom.appRoot + '/AMTS/AMTSV0050/AMTSV0050.html';

			clcom.pushPage({
				url: url,
				args: {}
			});
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
		_doOpeAction: function(rtyp, pgIndex/*一覧画面では使用しない*/, e){

			var url = clcom.appRoot + '/AMTS/AMTSV0030/AMTSV0030.html';

			var myData, destData, selectedRecs;

			if(this.savedReq){

				// 検索結果がある場合
				var selectedRecs = this.recListView.getSelectedRecs();

				myData = {
					btnId: e.target.id,
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMTSV0020GetReq,
					chkData: selectedRecs
				};

				var chkData;
				if (rtyp === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
					chkData = [ this.recListView.getLastClickedRec() ];
				} else if (rtyp === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
					chkData = [];
				} else {
					chkData = selectedRecs;
				}

				destData = {
					opeTypeId: rtyp,
					chkData: chkData
				};

			}else{

				// 検索結果が無い場合
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

			// ope_btn 系
			switch(rtyp){

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規

				// データが無くても可
				clcom.pushPage(url, destData, myData);
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除

				// チェックされたデータが必要（Ｎ）
				if(_.isEmpty(destData.chkData)){
					// 行選択がない				-- そもそもボタンを押せなくしている
					console.warn('rtyp[' + rtyp + ']: item not specified.');
					return;
				}

				for (var i = 0; i < destData.chkData.length; i++) {

					var data = destData.chkData[i];

					if (data.toDate < clcom.max_date) {
						this.srchCondView.validator.setErrorHeader(clmsg.cl_rtype_del);
						return;
					}
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

				for (var i = 0; i < destData.chkData.length; i++) {
					var data = destData.chkData[i];

					if (data.toDate < clcom.max_date) {
						this.srchCondView.validator.setErrorHeader(clmsg.cl_rtype_r_upd);
						return;
					}
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
				destData.opeTypeId = rtyp;

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
		 * ope ボタンのＵＩ制御
		 */
		_setOpeButtonUI: function(argGroupid, arg, from){
			if(argGroupid != groupid){
				return;
			}

			//	arg = {
			//		recs: [rec0, rec1, rec2 ],		// 行データ
			//		recsCount: 3,					// recs.length() 相当
			//		selectedRecs: [ rec1, rec2 ],	// 選択チェックを入れた行データ
			//		selectedRecsCount: 2,			// selectedRecs.length() 相当
			//	};
			console.log(arg);

			// TODO: args の内容を評価して、「編集」「削除」ボタンの活性化/非活性化を制御する

			// 編集ボタン
			if(arg.selectedRecsCount >= 1){

				// 編集ボタン有効フラグ
				var edit_flag = true;

				// 選択行が１行以上の場合
				for(var i=0; i < arg.selectedRecsCount; i++) {

					if(arg.selectedRecs[i].status == amcm_type.AMCM_VAL_TEMP_TRANS_STATUS_DONE) {

						// 選択行の中に１つでも「状態＝依頼作成済」のレコードが存在する場合
						edit_flag = false;
						break;
					}
				}

				if(edit_flag === true) {

					// 編集ボタンを有効にする
					this.$('#cl_edit').removeAttr('disabled');

				} else {

					// 編集ボタンを操作不可にする
					this.$('#cl_edit').attr('disabled', true);
				}
			}else{

				// それ以外の場合は編集ボタンを操作不可にする
				this.$('#cl_edit').attr('disabled', true);
			}

			// 削除ボタン
			if(arg.selectedRecsCount == 1){

				// 選択行が１行の場合
				if(arg.selectedRecs[0].status == amcm_type.AMCM_VAL_TEMP_TRANS_STATUS_TEMP) {

					// 状態が「一時保存」の場合は削除ボタンを有効にする
					this.$('#cl_delete').removeAttr('disabled');
				} else{
					this.$('#cl_delete').attr('disabled', true);
				}
			}else{
				// それ以外の場合は削除ボタンを操作不可にする
				this.$('#cl_delete').attr('disabled', true);
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
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}
		},

		_eof: 'AMTSV0020.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
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

	//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
	// テストデータ

	AMTSV0020GetRsp = {
		rspHead: {
			status: 0
		},
		pageRsp: {
			total_record: 3			// 総レコード数
		},
		monthPlans: [
			{
				instructNo: '1234567890',
				instructName: '14SS売切(東北)',
				status: 1,
				userName: '港北太郎'
			},
			{
				instructNo: '1234567891',
				instructName: '14SS売切(北関東)',
				status: 2,
				userName: '港北太郎'
			},
			{
				instructNo: '1234567892',
				instructName: '14SS売切(南関東)',
				status: 1,
				userName: '五反田花子'
			}
		]
	};

	// 結果データ偽装
	boo = function(){

		mainView.savedReq = mainView.buildReq();
		mainView.recListView.setRecs(AMTSV0020GetRsp.monthPlans);
		mainView.srchAreaCtrl.show_result();
	};
});



