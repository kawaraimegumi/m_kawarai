/**
 * 棚卸作業確認
 */

useSelectpicker2();

$(function(){

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// カラム定義
	var columns = [
		{
			id: 'stditgrpDispName',
			name: '品種',
			field: 'stditgrpDispName',
			width: 300
		},
		{
			id: 'stockQy',
			name: '帳簿在庫数',
			field: 'stockQy',
			width: 130,
			cssClass: 'txtalign-right',
			headCellType: {
				formatter: function(value, options){
					var helpText = '棚卸が確定するまでは毎日更新されます。昨日画面で参照した値と異なることがあります。';
					return '<div class="clgridhd-icon-help">'
						+ _.escape(value)
						+ '<p class="txtInFieldUnit flright help" data-cl-errmsg="' + _.escape(helpText) + '"><span>?</span></p>'
						+ '</div>';
				}
			},
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
		},
		{
			id: 'invQy',
			name: '棚卸数',
			field: 'invQy',
			width: 130,
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
			width: 130,
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
			width: 130,
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
			width: 130,
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
			width: 130,
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
			width: 130,
			cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
		}
		/*{
			id: 'lossRatio',
			name: 'ロス率(%)',
			field: 'lossRatio',
			width: 130,
			cssClass: 'txtalign-right'
		}*/
	];

	function buildColumns() {
		var cols = _.deepClone(columns);
		return cols;
	}

	var _unitID = "";
	var _xxCode = "";
	var _xxName = "";

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

			this.relation = clutil.FieldRelation.create("default", {
				// 店舗
				clorgcode: {
					el: '#ca_srchStoreID',
					branches: ['unit_id']
				},

				// 棚卸スケジュール用対象期取得部品
				clinventcntschselector: {
					el: this.$('#ca_srchYearMonth'),
					addDepends: ['org_id']
				}
			}, {
				dataSource: {
					// 上位組織を事業ユニットIDで選択されているものに設
					// 定する => たぶん指定してはだめ
					// p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					f_stockmng: 1
				}
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

		_eof: 'AMICV0060.SrchCondView//'
	});


	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',	// 店舗選択
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){

			_.bindAll(this);

			var opeTypeIdElem = [];

			if (clcom.userInfo) {

				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {

					// ログインユーザが店舗ユーザの場合、棚卸作業完了ボタンのみ表示
					opeTypeIdElem = [
										{
											opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
											label: '棚卸作業完了'
										}
									];

				} else {
					// ログインユーザが店舗ユーザでない場合、差戻ボタンのみ表示
					opeTypeIdElem = [
						 				am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK
									];

				}
			}

			// 出力ボタン構成
			var dlButtons =[
					{
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF,
						label: '棚番別ローディング数リスト',
						attr: 1
					},{
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF,
						label: '棚卸売上修正リスト',
						attr: 2
					},{
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF,
						label: '品種別棚卸情報',
						attr: 3
					},{
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV,
						label: '棚卸プルーフ',
						attr: 4
					}
				];

			/*var dlButtons = function(isKansa){
				var btns = [
					{
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF,
						label: '棚番別ローディング数リスト',
						attr: 1
					},{
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF,
						label: '棚卸売上修正リスト',
						attr: 2
					},{
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF,
						label: '品種別棚卸情報',
						attr: 3
					}
				];
				if(isKansa){
					btns.push({
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV,
						label: '棚卸プルーフ',
						attr: 4
					});
				}
				return btns;

			}(clcom.userInfo.user_typeid !== amcm_type.AMCM_VAL_USER_STORE);*/

			// 共通ビュー(共通のヘッダなど内包）
			var mdBaseViewOpt = {

				opeTypeId: opeTypeIdElem,
				title: '棚卸作業確認',
				btn_submit: true,
				//btn_cancel: this._onCancel,
				btn_cancel:{label:'条件再設定', action:this._onCancel},
				btns_dl: dlButtons,

				// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
				// リクエストビルダ関数を渡しておく。
				buildSubmitReqFunction: this._buildSubmitReqFunction

				// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
				// リクエストのビルダ関数を opt で渡しておく。
				// buildGetReqFunction: this._buildGetReqFunction

			};

			if(opt && opt.representOpeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
				mdBaseViewOpt.backBtnURL = false;
			}

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMICV0060 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMICV0060';

			// XXX:メニュー戻るボタン(<)押下時のメッセージ表示を抑制する
			this.mdBaseView.options.confirmLeaving = false;

			///////////////// 検索結果データグリッドの表示
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid'
			});

			this.dataGrid.getMetadata = this.getMetadata;

			var dataGrid = this.dataGrid;
			var mainView = this;

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
					data[0].id = data[0].val;
					// 組織表示
					this.srchCondView.relation.fields.clorgcode.setValue(data[0]);
				};
				_.defer(function(){// setFocusを_.defer()で後回しにする
					// 参照ボタンにフォーカスする
					clutil.setFocus(this.$("#ca_btn_store_select"));
				});
			},this);

			// イベント
			this.srchCondView.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			// 外部イベントの購読設定
			// Submit と、GET結果のデータを購読する。
			//clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);

			//更新回数ステータス設定
			this.state = {
				recno: "",
				state: 0
			};
		},

		/**
		 * データグリッドに合計行を表示する
		 */
		getMetadata: function(rowIndex){
			// 行データ
			var item = this.dataGrid.dataView.getBodyItem(rowIndex);
			if (rowIndex === 0) {
				return {
					cssClasses: 'reference'
				};
			}else{
				if(item.invStateID != amcm_type.AMCM_VAL_INV_STATE_INV_NOT_REPORTED){
					// 棚卸報告状態が「未報告」以外のときは指ポインタ
					return {
						cssClasses: 'csptr'
					};
				}
			}

		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			//this.recListView.initUIElement();

			this.AMPAV0010Selector.render();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));

			return this;
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){

			// this.AMPAV0010Selector.show(null, null);

			var org_id = null;

			if (clcom.userInfo.unit_id === Number(clcom.getSysparam('PAR_AMMS_UNITID_HD'))){
				// ログインユーザが事業ユニット(AOKI-HD)に属するユーザの場合
				org_id = null;

			} else {
				// それ以外の場合
				org_id = clcom.userInfo.unit_id;
			}

			/*var options = {
				func_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id	: org_id
			};*/

			var options = {
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),		//基本組織を対象
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					           am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
					           am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
				org_id	: org_id,
			    f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ))
			};

			this.AMPAV0010Selector.show(null, null, options);

		},

		/**
		 * this.recListView にGET応答データをセットする。
		 */
		setDataToRecListView: function(data){

			if(_.isEmpty(data.AMICV0060GetRsp)){

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// キャンセルボタン・登録ボタンは非表示にする
				$("#mainColumnFooter").hide();

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				return;
			}

			// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
			var invState = data.AMICV0060GetRsp.invState;
			var invItemList = data.AMICV0060GetRsp.invItemList;

			// 棚卸状態が空の場合
			if(_.isEmpty(invState)){

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// 下部ボタン群は非表示にする
				$("#mainColumnFooter").hide();

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				return;
			}

			// 棚卸明細リストが空の場合
			if(_.isEmpty(invItemList)){

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// 下部ボタン群は非表示にする
				$("#mainColumnFooter").hide();

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				return;
			}

			// 結果ペインを表示
			this.srchAreaCtrl.show_result();

			// 下部ボタン群を表示する
			$("#mainColumnFooter").show();

			// XXX:メニュー戻るボタン(<)押下時のメッセージを表示する
			this.mdBaseView.options.confirmLeaving = true;

			// 内容物がある場合 --> 結果表示する。

			// (1) 報告状態
			this.applyAMICV0060InvState(invState);

			// (2) 合計
			var sumDto = this.calcSummary(invState);
			//this.applySummaryRow(sumDto);

			// (3) 表の中身
			// this.recListView.setRecs(invState);
			var data = [];

			if(!sumDto.stockQy) {
				sumDto.stockQy = "";
			}
			if(!sumDto.invQy) {
				sumDto.invQy = "";
			}
			if(!sumDto.invAm) {
				sumDto.invAm = "";
			}
			if(!sumDto.lossQy) {
				sumDto.lossQy = "";
			}
			if(!sumDto.lossAm) {
				sumDto.lossAm = "";
			}
			if(!sumDto.surplusQy) {
				sumDto.surplusQy = "";
			}
			if(!sumDto.surplusAm) {
				sumDto.surplusAm = "";
			}

			//sumDto.lossRatio = "";

			data[0] = _.deepClone(sumDto);

			for(var i=0; i < invState.length; i++) {

				data[i+1] = _.deepClone(invState[i]);

				//data[i] = {
					// 品種
					//stditgrpDispName : invState[i].stditgrpDispName,
					// 帳簿在庫数
					//stockQy : invState[i].stockQy,
					// 棚卸数
					//invQy : invState[i].invQy,
					// 棚卸金額(税抜)
					//invAm : invState[i].invAm,
					// ロス数
					//lossQy : invState[i].lossQy,
					// ロス金額(税抜)
					//lossAm : invState[i].lossAm,
					// 逆ロス数
					//surplusQy : invState[i].surplusQy,
					// 逆ロス金額(税抜)
					//surplusAm : invState[i].surplusAm,
					// ロス率(%)
					//lossRatio : invState[i].lossRatio
				//};
			}

			// 検索条件を取得
			var savedCond = this.srchCondView.serialize();
			var orgAttrs = this.srchCondView.relation.fields.clorgcode.getAttrs();
			savedCond.unitID = orgAttrs && orgAttrs.unit_id;

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

				var url = clcom.appRoot + '/AMIC/AMICV0070/AMICV0070.html';
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

				if(lastClickedRec.invStateID === amcm_type.AMCM_VAL_INV_STATE_INV_NOT_REPORTED) {
					// クリックした行の棚卸報告状態が「未報告」の場合
					// 画面遷移を行わない
					return;
				}

				// 事業ユニットIDをセット
				if(!_unitID) {
					lastClickedRec.unitID = savedCond.unitID;
				} else {
					lastClickedRec.unitID = _unitID;
				}

				// 店舗コードをセット
				if(!_xxCode) {
					lastClickedRec.storeCode = savedCond._view2data_srchStoreID_cn.code;
				} else {
					lastClickedRec.storeCode = _xxCode;
				}

				// 店舗名をセット
				if(!_xxName) {
					lastClickedRec.storeName = savedCond._view2data_srchStoreID_cn.name;
				} else {
					lastClickedRec.storeName =  _xxName;
				}

				destData.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
				destData.chkData = [ lastClickedRec ];
				destData.representOpeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
				destData.srchStoreID = savedCond.srchStoreID;
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

			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

			// 検索エリアを入力可能にする
			this.srchCondView.setEnable(true);
			this.srchAreaCtrl.reset();

			// XXX:メニュー戻るボタン(<)押下時のメッセージ表示を抑止する
			this.mdBaseView.options.confirmLeaving = false;

			// 下部ボタン群は非表示にする
			$("#mainColumnFooter").hide();
		},

		/**
		 * GET 応答のイベントを受ける
		 */
		_onMDGetCompleted: function(args, e){
			console.log('args.status: [' + args.status + ']');

			// this.recListView を空欄にする
			this.recListView.clear();
			this.savedGetData = null;

			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 View へセットする。

				// 編集可の状態にする。
				var data = args.data;
				this.savedGetData = data;
				this.setDataToRecListView(data);

				var $focusElem = this.recListView.$el.find('input').first();
				this.resetFocus($focusElem);

				break;

			case 'DONE':		// 確定済
				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				break;

			default:
			case 'NG':			// その他エラー。
				break;
			}
		},

		/**
		 * Submit 応答のイベントを受ける
		 */
		_onMDSubmitCompleted: function(args, e){

			var data = args.data;

			switch(args.status){
			case 'DONE':		// 確定済

				if(args.req.reqHead.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {

					// 「棚卸作業完了」ボタンが押下された場合は帳票をZIPで固めて出力する
					this.doDownload(am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF, 99);
				}

				break;

			case 'CONFLICT':	// 別のユーザによって DB が更新された
				break;

			case 'DELETED':		// 別のユーザによって削除された
				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				//  入力値エラー情報が入っていれば、個別 View へセットする。

				// this.recListViewValidator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				break;
			}
		},

		/**
		 * 画面描画
		 */
		render: function() {

			this.mdBaseView.render().setSubmitEnable(true);

			this.srchCondView.render();

			//this.recListView.render();
			//this.recListView.$('#ca_stockQy_th .help').tooltip({html: true});

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

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {

				// ログインユーザが店舗ユーザの場合は初期フォーカスを対象期にセットする
				clutil.setFocus(this.$("#ca_srchYearMonth"));

			} else {

				// ログインユーザが店舗ユーザ以外の場合は初期フォーカスを店舗にセットする
				clutil.setFocus(this.$("#ca_srchStoreID"));
			};

			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;

				this.savedCond = srchReq;
				var orgAttrs = this.srchCondView.relation.fields.clorgcode.getAttrs();
				this.savedCond.unitID = orgAttrs && orgAttrs.unit_id;

			}else{
				if(!this.srchCondView.isValid()){
					return null;
				}
				srchReq = this.srchCondView.serialize();
				this.savedCond = srchReq;
				var orgAttrs = this.srchCondView.relation.fields.clorgcode.getAttrs();
				this.savedCond.unitID = orgAttrs && orgAttrs.unit_id;
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
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMICV0060GetReq: srchReq
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
			//this.mdBaseView.fetch();
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行データ（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){

			//this.recListView.clear();
			this.savedGetData = null;

			var defer = clutil.postJSON('AMICV0060', srchReq).done(_.bind(function(data){

				// リクエストを保存。
				this.savedReq = srchReq;

				this.savedGetData = data;
				this.setDataToRecListView(data);

				this.state.recno = data.rspHead.recno;
				this.state.state = data.rspHead.state;

				//var $focusElem = this.recListView.$el.find('input').first();
				this.resetFocus($focusElem);

			}, this)).fail(_.bind(function(data){

				//console.log(arguments);
				//this.clearResult();

				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// キャンセルボタン・登録ボタンは非表示にする
				$("#mainColumnFooter").hide();

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

			this.mdBaseView.clear();

			this.srchAreaCtrl.show_srch();

			// XXX:メニュー戻るボタン(<)押下時のメッセージ表示を抑制する
			this.mdBaseView.options.confirmLeaving = false;

			// 下部ボタン群は非表示にする
			$("#mainColumnFooter").hide();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧画面では使用しない*/, e){

			var url = clcom.appRoot + '/AMIC/AMICV0070/AMICV0070.html';
			var myData, destData;

			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					btnId: e.target.id,
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMICV0060GetReq
				};
				destData = {
					opeTypeId: rtyp
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

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会

				var lastClickedRec = this.recListView.getLastClickedRec();

				if(_.isEmpty(lastClickedRec)){
					// 最後にクリックした行データがとれなかった
					console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
					return;
				}

				// 事業ユニットIDをセット
				if(!_unitID) {
					lastClickedRec.unitID = this.savedCond.unitID;
				} else {
					lastClickedRec.unitID = _unitID;
				}

				if(!_xxCode) {
					lastClickedRec.storeCode = this.savedCond._view2data_srchStoreID_cn.code;
				} else {
					lastClickedRec.storeCode = _xxCode;
				}

				if(!_xxName) {
					lastClickedRec.storeName = this.savedCond._view2data_srchStoreID_cn.name;
				} else {
					lastClickedRec.storeName =  _xxName;
				}

				destData.chkData = [ lastClickedRec ];
				destData.representOpeTypeId = rtyp;
				destData.srchStoreID = this.savedReq.AMICV0060GetReq.srchStoreID;
				destData.srchYearMonth = this.savedReq.AMICV0060GetReq.srchYearMonth;

				// 別窓で照会画面を起動
				clcom.pushPage({
					url: url,
					args: destData,
					newWindow: true
				});
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:	// PDF 出力

				var model = $(e.target).data('cl_model');
				//if(confirm(clutil.opeTypeIdtoString(rtyp) + ': outputTarget[' + model.attr + ']') == false){
				//	return;
				//}
				this.doDownload(rtyp, (model) ? model.attr : 0);

				break;

			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(opeTypeId, attr){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}

			srchReq.reqHead.opeTypeId = opeTypeId;
			srchReq.AMICV0060GetReq.outputTarget = attr;

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMICV0060', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 棚卸作業完了/差戻しボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId){

			//if( this.recListViewValidator != null && !this.recListViewValidator.valid() ){
			//	return null;
			//}

			var invItemList = this.savedGetData.AMICV0060GetRsp.invItemList;
			//var invState = this.recListView.getRecs();
			var invState = this.savedGetData.AMICV0060GetRsp.invState;

			for(var i=0; i < invState.length; ++i) {

				if (opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {

					//棚卸作業完了の場合、報告状態を棚卸報告済にする
					invState[i].invStateID = amcm_type.AMCM_VAL_INV_STATE_INV_REPORTED;

				}else if(opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK) {

					//差し戻しの場合、報告状態を棚卸未報告にする
					invState[i].invStateID = amcm_type.AMCM_VAL_INV_STATE_INV_NOT_REPORTED;
				}
			}

			var reqObj = {
				reqHead: {
					opeTypeId: opeTypeId,
					recno: this.state.recno,
					state: this.state.state
				},
				AMICV0060UpdReq: {
					invState: invState,
					invItemList: invItemList
				}
			};

            var req = {
                resId : clcom.pageId,
                data: reqObj
            };

			// confirmダイアログ追加 #20150704
			// confirm文言変更 #20151117
			if (opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				return {
					resId : clcom.pageId,
					data: reqObj,
					confirm: '！棚卸作業を完了します。以降、追加の入力が出来なくなります。<br><br>よろしいですか？'
				};
			}
			else {
				return {
					resId : clcom.pageId,
					data: reqObj
				};
			}
		},

		/**
		 * Get リクエストを作る
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			if(this.iniGetReq){
				// 初期データ取得時の GetReq

				var req = {
					resId : clcom.pageId,
					data: this.iniGetReq
				};

				this.savedReq = this.iniGetReq;

				this.iniGetReq = undefined;

				return req;
			}

			if(!this.srchCondView.isValid()){
				return null;
			}
			var req = this.buildReq();

			this.savedReq = req;

			return {
				resId : clcom.pageId,
				data: req
			};
		},

		/**
		 * 合計値を計算する。
		 */
		calcSummary: function(collection){
			var sumIniDto = {
				stditgrpDispName: '合計',
				stockQy: 0,
				invQy: 0,
				invAm: 0,
				lossQy: 0,
				lossAm: 0,
				surplusQy: 0,
				surplusAm: 0
				//lossRatio: 0
			};
			return _.reduce(collection, function(sumDto, dto){
				for(var key in dto){
					switch(key){
					case 'stditgrpDispName':	// 品種 -- 不要
						break;
					default:
						sumDto[key] += dto[key];
					}
				}
				return sumDto;
			}, sumIniDto);
		},

		/**
		 * 合計行にデータをセットする
		 */
		applySummaryRow: function(sumDto){
			var $tr = this.recListView.$('#ca_table_summary_row');
			$tr.find('td[id]').each(function(){
				var $td = $(this);
				var id = this.id;
				var val = (sumDto && sumDto[id]) ? clutil.comma(sumDto[id]) : '';
				$td.text(val);
			});
		},

		/**
		 * 報告状態のデータをセットする
		 */
		applyAMICV0060InvState: function(invDto) {

			if(invDto[0].invStateID === amcm_type.AMCM_VAL_INV_STATE_INV_NOT_REPORTED) {
				// 報告状態が棚卸未報告の場合
				if (clcom.userInfo && clcom.userInfo.user_typeid !== amcm_type.AMCM_VAL_USER_STORE) {

					// ログインユーザが本部ユーザの場合、差戻しボタンを操作不可にする
					this.mdBaseView.setFooterNaviEnable(false, "submit");
					// ダウンロードボタンは操作可能とする
					this.mdBaseView.setFooterNaviEnable(true, "download");
				}

			} else {
				// 報告状態が棚卸未報告でない場合
				if (clcom.userInfo && clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE) {

					// ログインユーザが店舗ユーザの場合、棚卸作業完了ボタンを操作不可にする
					this.mdBaseView.setFooterNaviEnable(false, "submit");
					// ダウンロードボタンは操作可能とする
					this.mdBaseView.setFooterNaviEnable(true, "download");

				} else {

					// ログインユーザが本部ユーザの場合、棚卸作業完了ボタンを操作可能にする
					this.mdBaseView.setFooterNaviEnable(true, "submit");
					// ダウンロードボタンは操作可能とする
					this.mdBaseView.setFooterNaviEnable(true, "download");

				}

			}

			var $inv = this.$('#ca_AMICV0060InvState');

			$inv.find('[id]').each(function(){

				var $label = $(this);

				//var id = this.id;

				//var val = (invDto && invDto[id]) ? clutil.gettypename(amcm_type.AMCM_TYPE_INV_STATE, invDto[id]) : '';

				var val = (invDto && invDto[0].invStateID) ? clutil.gettypename(amcm_type.AMCM_TYPE_INV_STATE, invDto[0].invStateID) : '';

				$label.val(val);

			});
		},

		/**
		 * 初期検索データでロードする
		 */
		load: function(model){
			if(_.isEmpty(model)){
				return;
			}

			if(model.condModel){
				this.srchCondView.deserialize(model.condModel);
			}

			if(model.srchReq){
				this.iniGetReq = this.buildReq(model.srchReq);
				//this.mdBaseView.fetch();
				this.doSrch(this.iniGetReq);
			}
		},

		/**
		 * 店舗条件を初期表示する
		 */
		loadCond: function(model){
			if(_.isEmpty(model)){
				return;
			}

			if(model.condModel){
				this.srchCondView.deserialize(model.condModel);
			}
		},

		_eof: 'AMICV0060.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView(clcom.pageArgs).initUIElement().render();

		if(clcom.pageArgs){

			// 画面遷移引数がある
			if(_.isEmpty(clcom.pageArgs.chkData)) {

				// ログインユーザが店舗ユーザの場合、所属店舗を初期表示する
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {

					//_unitID = clcom.userInfo.unit_id;
					//_xxCode = clcom.userInfo.org_code;
					//_xxName = clcom.userInfo.org_name;

					var condModel = {
						_view2data_srchStoreID_cn: {
							id: clcom.userInfo.org_id,
							code: clcom.userInfo.org_code,
							name: clcom.userInfo.org_name,
							unit_id: clcom.userInfo.unit_id
						},
						srchStoreID: clcom.userInfo.org_id
					};

					mainView.loadCond({
						condModel: condModel
					});

					clutil.inputReadonly($("#ca_srchStoreID"));
					clutil.inputReadonly($("#ca_btn_store_select"));
				}

			} else {

				var chkdata = clcom.pageArgs.chkData[0];

				// DispName → code, name へ分解
				var xxCode = "";
				var xxName = "";

				if(!_.isEmpty(chkdata.storeDispName)){
					var xx = chkdata.storeDispName.split(':');
					if(xx.length > 1){
						xxCode = xx.shift();
					}
					xxName = xx.join('');
				}

				_unitID = chkdata.unitID;
				_xxCode = xxCode;
				_xxName = xxName;

				// SrchCondView が扱えるデータ型に変換
				var condModel = {

					_view2data_srchStoreID_cn: {
						id: chkdata.orgID,
						code: xxCode,
						name: xxName,
						unit_id: chkdata.unitID
					},

					srchStoreID: chkdata.orgID,
					srchYearMonth: clcom.pageArgs.srchYearMonth

				};

				var srchReq = {
					srchStoreID: chkdata.orgID,
					srchYearMonth: clcom.pageArgs.srchYearMonth
				};

				mainView.load({
					condModel: condModel,
					srchReq: srchReq
				});
			}
		} else {

			// 画面遷移引数がない→メニューから起動された場合
			if (clcom.userInfo && clcom.userInfo.org_id) {

				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {

					_unitID = clcom.userInfo.unit_id;
					_xxCode = clcom.userInfo.org_code;
					_xxName = clcom.userInfo.org_name;

					var condModel = {
						_view2data_srchStoreID_cn: {
							id: clcom.userInfo.org_id,
							code: clcom.userInfo.org_code,
							name: clcom.userInfo.org_name,
							unit_id: clcom.userInfo.unit_id
						},
						srchStoreID: clcom.userInfo.org_id
					};

					mainView.loadCond({
						condModel: condModel
					});

					clutil.inputReadonly($("#ca_srchStoreID"));
					clutil.inputReadonly($("#ca_btn_store_select"));
				}
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
