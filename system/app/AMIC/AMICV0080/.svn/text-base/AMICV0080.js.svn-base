/**
 * 棚卸進捗確認
 */

useSelectpicker2();

$(function(){

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// カラム定義
	var columns = [
	    {
	    	id: 'storeDispName',
	    	name: '店舗',
	    	field: 'storeDispName',
	    	width: 240
	    },
	    {
	    	id: 'invStateDisp',
	    	name: '報告状態',
	    	field: 'invStateDisp',
	    	width: 150,
			cellMetadata: function(args){
				var id = args.item.invStateID;
				var data = {};
				if(id === amcm_type.AMCM_VAL_INV_STATE_INV_NOT_REPORTED){
					data.cssClasses = 'alertCell';
				}
				return data;
			}
	    },
	    {
	    	id: 'stockQy',
	    	name: '帳簿在庫数',
	    	field: 'stockQy',
	    	width: 100,
	    	cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
	    },
	    {
	    	id: 'invQy',
	    	name: '棚卸数',
	    	field: 'invQy',
	    	width: 100,
	    	cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
	    },
	    {
	    	id: 'invAm',
	    	name: '棚卸金額(税抜)',
	    	field: 'invAm',
	    	width: 120,
	    	cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
	    },
	    {
	    	id: 'lossQy',
	    	name: 'ロス数',
	    	field: 'lossQy',
	    	width: 100,
	    	cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
	    },
	    {
	    	id: 'lossAm',
	    	name: 'ロス金額(税抜)',
	    	field: 'lossAm',
	    	width: 120,
	    	cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
	    },
	    {
	    	id: 'surplusQy',
	    	name: '逆ロス数',
	    	field: 'surplusQy',
	    	width: 100,
	    	cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
	    },
	    {
	    	id: 'surplusAm',
	    	name: '逆ロス金額(税抜)',
	    	field: 'surplusAm',
	    	width: 120,
	    	cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
	    },
	    {
	    	id: 'offsetLossQy',
	    	name: '相殺後ロス数',
	    	field: 'offsetLossQy',
	    	width: 100,
	    	cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
	    },
	    {
	    	id: 'offsetLossAm',
	    	name: '相殺後ロス金額(税抜)',
	    	field: 'offsetLossAm',
	    	width: 120,
	    	cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
	    },
	    {
	    	id: 'salesCostAm',
	    	name: '売上高原価(税抜)',
	    	field: 'salesCostAm',
	    	width: 120,
	    	cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
	    },
	    {
	    	id: 'lossRatio',
	    	name: 'ロス率(%)',
	    	field: 'lossRatio',
	    	width: 100,
	    	cssClass: 'txtalign-right',
	    	headCellType: {
				formatter: function(value, options){
	    			// (参考)ロス率の計算式について
	    			// \\eggplant2\aok\03.基本設計\02.成果物\01.業務機能\18.在庫\4.バッチ設計書\AMSTB0080_在庫計算.xlsx
					var helpText = '会社の数字が確定後に計算表示されます。ロス率(%)＝(ロス金額/売上原価)×100です。';
					return '<div class="clgridhd-icon-help">'
						+ _.escape(value)
						+ '<p class="txtInFieldUnit flright help" data-cl-errmsg="' + _.escape(helpText) + '"><span>?</span></p>'
						+ '</div>';
				}
	    	},
	    	cellType: {
				formatter: function(value){
					var v = value / 1000;
					return _.escape(v.toFixed(3));	/* 小数点以下三桁表示にする #20151015 */
				}
	    	}
	    }
	];

	function buildColumns() {
		var cols = _.deepClone(columns);
		return cols;
	}

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
		 *  初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			clutil.inputlimiter(this.$el);

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'));
			// 事業ユニットの初期値に所属する事業ユニットをセットする
			var unitID = clcom.userInfo.unit_id;

			this.relation = clutil.FieldRelation.create("default", {
				// 事業ユニット取得
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},

				// 棚卸スケジュール用対象期取得部品
				clinventcntschselector: {
					el: this.$('#ca_srchYearMonth')
				}
			}, {
				dataSource: {
					// 上位組織を事業ユニットIDで選択されているものに設
					// 定する => たぶん指定してはだめ
					// p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});

			// 棚卸報告状態
			clutil.cltypeselector(this.$("#ca_srchState"), amcm_type.AMCM_TYPE_INV_STATE);

			this.deserialize({
				srchUnitID: unitID,
				srchState: amcm_type.AMCM_VAL_INV_STATE_INV_NOT_REPORTED
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
			return this.validator.valid();
		},

		/**
		 * 検索条件の入力ブロッキング/解除
		 */
		setEnable: function(enable){
			if(enable){
				clutil.viewRemoveReadonly(this.$el);
			}else{
				clutil.viewReadonly(this.$el);
			}
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {

			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			this.trigger('ca_onSearch', dto);
		},

		_eof: 'AMICV0080.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){

			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({

				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL,

				title: '棚卸進捗確認',
				subtitle: '',
				btn_cancel: false,
				btn_submit: true,
				btn_new: false,
				btn_csv: true,

				// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
				// リクエストビルダ関数を渡しておく。
				buildSubmitReqFunction: this._buildSubmitReqFunction,

				// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
				// リクエストのビルダ関数を opt で渡しておく。
				buildGetReqFunction: this._buildGetReqFunction

			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMICV0080 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMICV0080';

			///////////////// 検索結果データグリッドの表示
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid'
			});

			this.dataGrid.getMetadata = this.getMetadata;

			var dataGrid = this.dataGrid;
			var mainView = this;

			// イベント
			this.srchCondView.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			// 外部イベントの購読設定
			// Submit と、GET結果のデータを購読する。
			clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);

			// ツールチップ
			$("#ca_tp_code1").tooltip({html: true});
		},

		/**
		 * 合計行の表示
		 */
		getMetadata: function(rowIndex){
			if (rowIndex === 0) {
				return {
					cssClasses: 'reference'
				};
			}else{
				return {
					// XXX: 指ポインタに変更
					cssClasses: 'csptr'
				};
			}
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));

			return this;
		},

		/**
		 * this.recListView にGET応答データをセットする。
		 */
		setDataToRecListView: function(data){

			// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」

			// GET応答が空の場合
			if(_.isEmpty(data.AMICV0080GetRsp)){

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// 報告店舗数などクリア
				this.applyAMICV0080Inv(null);

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// 下部ボタン群は非表示にする
				$("#mainColumnFooter").hide();

				return;
			}

			var recInv = data.AMICV0080GetRsp.inv;
			var recInvStateList = data.AMICV0080GetRsp.invState;

			// 棚卸情報が空の場合
			if(_.isEmpty(recInv)){

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// 下部ボタン群は非表示にする
				$("#mainColumnFooter").hide();

				// 報告店舗数などクリア
				this.applyAMICV0080Inv(null);

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				return;
			}

			// 棚卸状態が空の場合
			if(_.isEmpty(recInvStateList)){

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// 下部ボタン群は非表示にする
				$("#mainColumnFooter").hide();

				// 報告店舗数などクリア
				this.applyAMICV0080Inv(null);

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				return;
			}

			// 結果ペインを表示
			this.srchAreaCtrl.show_result();

			// 下部ボタン群は表示する
			$("#mainColumnFooter").show();

			// 内容物がある場合 --> 結果表示する。

			// (1) 報告店舗数など
			this.applyAMICV0080Inv(recInv);

			// 一旦承認ボタンをtrueに
			this.mdBaseView.setFooterNaviEnable(true, "submit");

			if(recInv.allStores != recInv.fixedStores) {
				// 全店舗が確定済みでない場合、承認ボタンのみ操作不可
				this.mdBaseView.setFooterNaviEnable(false, "submit");

				// Excel出力ボタンは報告状態にかかわらず操作可能とする
				this.mdBaseView.setFooterNaviEnable(true, "download");
			}

			// (2) 表の中身
			var data = [];

			for(var i=0; i < recInvStateList.length; i++) {

				data[i] = _.deepClone(recInvStateList[i]);

				if(i===0) {
					// 20151016 MT-0844
					// 合計行のロス率を空白にする
					//data[i].lossRatio = "";
					// 合計行フラグをセットする
					data[i].totalRecFlag = true;
				}

				if(recInvStateList[i].invStateID) {
					data[i].invStateDisp = clutil.gettypename(amcm_type.AMCM_TYPE_INV_STATE, recInvStateList[i].invStateID);
				}
			}

			// 検索条件を取得
			var savedCond = this.srchCondView.serialize();

			// (3) 報告状態での絞込があったら承認ボタンは操作不可
			if(savedCond.srchState != null && savedCond.srchState != 0){
				this.mdBaseView.setFooterNaviEnable(false, "submit");
			}

			// 検索結果をデータグリッドに表示する
			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 2
				},
				columns: buildColumns(),
				data: data,
				rowDelToggle: true,
				graph: this.graph
			});

			// データグリッドの行クリックを実装する
			// .off('click:cell') --- 一旦クリアしてから実装する
			this.dataGrid.off('click:cell').on('click:cell', function(e, args){

				var url = clcom.appRoot + '/AMIC/AMICV0060/AMICV0060.html';
				var destData = {};

				var dataView = args.grid.getData();

				var lastClickedRec = dataView.getItem(args.row);

				if(_.isEmpty(lastClickedRec)){
					// 最後にクリックした行データがとれなかった
					console.warn('last clicked item not found.');
					return;
				}

				if(!lastClickedRec.invStateID) {
					// クリックした行の棚卸報告状態が定義されていない場合
					// 画面遷移を行わない
					return;
				}

				// 事業ユニットIDをセット
				lastClickedRec.unitID = savedCond.srchUnitID;

				destData.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
				destData.chkData = [ lastClickedRec ];
				destData.representOpeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
				destData.srchYearMonth = savedCond.srchYearMonth;

				// 別窓で照会画面を起動
				clcom.pushPage({
					url: url,
					args: destData,
					newWindow: true
				});
			});

		},

		/**
		 * キャンセルボタン押下
		 */
		_onCancel: function(e){
			// 結果データの破棄と、結果ビューをクリア
			this.clearResult();

			// 検索エリアを入力可能にする
			this.srchCondView.setEnable(true);
			this.srchAreaCtrl.reset();
		},

		/**
		 * GET 応答のイベントを受ける
		 */
		_onMDGetCompleted: function(args, e){
			console.log('args.status: [' + args.status + ']');

			this.savedGetData = null;

			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 View へセットする。

				// 編集可の状態にする。
				this.savedGetData = args.data;

				// 検索結果を表示する
				this.setDataToRecListView(args.data);

				break;

			case 'DONE':		// 確定済

				// args.data をアプリ個別 View へセットする。
				this.setDataToRecListView(args.data);

				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み

				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース

				this.setDataToRecListView(args.data);

				break;

			default:
			case 'NG':			// その他エラー。

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// 下部ボタン群は非表示にする
				$("#mainColumnFooter").hide();

				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.mdBaseView.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				break;

			}
		},

		/**
		 * Submit 応答のイベントを受ける
		 */
		_onMDSubmitCompleted: function(args, e){

			switch(args.status){

			case 'DONE':		// 確定済

				break;

			case 'CONFLICT':	// 別のユーザによって DB が更新された

				break;

			case 'DELETED':		// 別のユーザによって削除された

				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。

				break;

			}
		},

		/**
		 * 画面描画
		 */
		render: function() {

			this.mdBaseView.render().setSubmitEnable(false);

			this.srchCondView.render();

			// グリッドにデータを設定する
			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 2
				},
				columns: buildColumns(),
				data: [],
				rowDelToggle: true,
				graph: this.graph
			});

			// 下部ボタン群は非表示にする
			$("#mainColumnFooter").hide();

			// 初期フォーカスを事業ユニットにセットする
			clutil.setFocus(this.$("#ca_srchUnitID"));

			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(){

			if(!this.srchCondView.isValid()){
				return null;
			}

			srchReq = this.srchCondView.serialize();

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMICV0080GetReq: srchReq
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function() {

			// 検索実行
			this.mdBaseView.fetch();
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFirstFocus($focusElem);
			}else{
				// 適当な場所を select してフォーカスを入れる。
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
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){

			this.srchAreaCtrl.show_srch();

			// 下部ボタン群は非表示にする
			$("#mainColumnFooter").hide();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧画面では使用しない*/, e){

			// ope_btn 系
			switch(rtyp){

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力

				this.doDownload();

				break;

			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * 承認ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId){

			var inv = this.savedGetData.AMICV0080GetRsp.inv;

			// データグリッドの内容を取得
			var invState = this.dataGrid.getData({filterFunc: function(item){
				return Boolean(item.totalRecFlag);
			}});

			var reqObj = {
				reqHead: {
					opeTypeId: opeTypeId
				},
				AMICV0080UpdReq: {
					inv: inv,
					invState: invState
				}
			};
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		/**
		 * Get リクエストを作る
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			if(!this.srchCondView.isValid()){
				return null;
			}

			// Getリクエスト作成
			var req = this.buildReq();

			this.savedReq = req;

			return {
				resId : clcom.pageId,
				data: req
			};
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
			var defer = clutil.postDLJSON('AMICV0080', srchReq);
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

			// 報告店舗数などクリア
			this.applyAMICV0080Inv(null);

		},

		/**
		 * 報告店舗数などのデータをセットする
		 */
		applyAMICV0080Inv: function(invDto) {
			var $inv = this.$('#ca_AMICV0080Inv');
			$inv.find('[id]').each(function(){
				var $label = $(this);
				var id = this.id;
				var val = (invDto && invDto[id]) ? clutil.comma(invDto[id]) : '-';
				$label.text(val);
			});
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

		_eof: 'AMICV0080.MainView//'
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
});
