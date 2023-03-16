/**
 * 棚卸売上修正
 */

useSelectpicker2();

///**
// * ブラウザのウィンドウサイズに合わせて、データグリッドの高さを調整する
// * @param options
// * @return
// */
//var ResizeWatcher = function(options){
//	this.options = options;
//	_.defaults(options, {
//		//minHeight: 250
//		//minHeight: 150
//		//minHeight: 288
//	});
//	this.$el = options.$el;
//	this.$container = $(window);
//	this.setSize = _.debounce(this.setSize, 100);
//	this.start();
//};
//
//_.extend(ResizeWatcher.prototype, Backbone.Events, {
//	resize: function(){
//		var windowHeight = window.innerHeight;
//		var offset = this.$el.offset();
//		var height = windowHeight - offset.top - 100;
//		if (this.previousHeight != height){
//			this.setSize({
//				height: height
//			});
//		}
//	},
//
//	setSize: function(size){
//		this.$el.height(Math.max(size.height, this.options.minHeight));
//		this.trigger('resize');
//		this.previousHeight = size.height;
//	},
//
//	start: function(){
//		var that = this;
//		this.tid = setInterval(function(){
//			that.resize();
//		}, 200);
//	},
//
//	stop: function(){
//		if (this.tid){
//			clearTimeout(this.tid);
//		}
//	}
//});

$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// カラム定義
	var columns = [
	    {
	    	id: 'rackNo',
	    	name: '棚番',
	    	field: 'rackNo',
	    	width: 140
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
	    }
    ];

	/**
	 * データグリッドのカラム作成
	 */
	function buildColumns() {
		var cols = _.deepClone(columns);
		return cols;
	}

	var _unitID = "";
	var _savedReq = null;

	//////////////////////////////////////////////
	// 条件入力部
	var SrchCondView = Backbone.View.extend({

		el: $('#ca_srchArea'),

		/**
		 * イベント
		 */
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

			//タグコードのフィールドカウント
			clutil.cltxtFieldLimit($("#ca_srchRackNo"));

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

		_eof: 'AMICV0090.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({

		el:	$('#ca_main'),

		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',	// 店舗選択

			'click #searchAgain'			: '_onSearchAgainClick',// 検索条件を再指定ボタン押下
		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){

			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({

				opeTypeId:  am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL,

				title: '棚番削除',
				subtitle: '',
				btn_submit: true,
				btn_new: false,
				btn_cancel: false,

				// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
				// リクエストビルダ関数を渡しておく。
				buildSubmitReqFunction: this._buildSubmitReqFunction
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMICV0090 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMICV0090';

			this.dupFlg = false;

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

			// 外部イベントの購読設定
			// Submit結果のデータを購読する。
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();

			this.AMPAV0010Selector.render();

			// 社員コード
			clutil.clstaffcode2($("#ca_srchStaffCode"));

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

			// 店舗の属する事業ユニットを取得する
			var orgAttrs = this.srchCondView.relation.fields.clorgcode.getAttrs();
			_unitID = orgAttrs && orgAttrs.unit_id;

			// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」

			if(_.isEmpty(data.AMICV0090GetRsp)){

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// キャンセル・登録ボタンを非表示にする
				$("#mainColumnFooter").hide();

				return;
			}

			// 結果ペインを表示
			this.srchAreaCtrl.show_result();

			// キャンセル・登録ボタンを表示する
			$("#mainColumnFooter").show();

			// 本日＜店舗通知日の場合、棚卸数が０の場合は削除ボタンを非表示
			var opeDate = clcom.getOpeDate();
			if (opeDate < data.AMICV0090GetRsp.noticeDate || data.AMICV0090GetRsp.invQy == 0) {
				// 削除ボタンを非活性化する
				mainView.mdBaseView.setSubmitEnable(false);
			} else {
				// 削除ボタンを有効に
				mainView.mdBaseView.setSubmitEnable(true);
			}

			clutil.data2view($("#result"), data.AMICV0090GetRsp);
		},

		/**
		 * Submit 応答のイベントを受ける
		 */
		_onMDSubmitCompleted: function(args, e){

			switch(args.status){
			case 'DONE':		// 確定済
				clutil.viewReadonly($("#result"));
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				break;
			case 'DELETED':		// 別のユーザによって削除された
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				//  入力値エラー情報が入っていれば、個別 View へセットする。

				// XXX どうなるか・・・・
				// this.recListViewValidator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				//var msg = clmsg[args.data.rspHead.message];
				//this.recListViewValidator.setErrorInfoFromSrv(args.data.rspHead.message, {prefix: 'ca_'});

				break;
			}
		},

		/**
		 * 画面描画
		 */
		render: function() {

			this.mdBaseView.render().setSubmitEnable(false);

			this.srchCondView.render();

			// キャンセルボタン・登録ボタンは非表示にする
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
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				if(!this.srchCondView.isValid()){
					return null;
				}
				srchReq = this.srchCondView.serialize();
			}

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
				AMICV0090GetReq: srchReq
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
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行データ（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){

			this.savedGetData = null;

			var defer = clutil.postJSON('AMICV0090', srchReq).done(_.bind(function(data){

				// リクエストを保存。
				this.savedReq = srchReq;
				_savedReq = srchReq;

				// 検索結果を保存
				this.savedGetData = data;

				// 内容物がある場合 --> 結果表示する。
				this.setDataToRecListView(data);

			}, this)).fail(_.bind(function(data){

				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// キャンセルボタン・登録ボタンは非表示にする
				$("#mainColumnFooter").hide();

				var rspHead = data.rspHead;
				if (rspHead.message == "EIC0022") {
					// EIC0022の場合はダイアログを表示
					clutil.ErrorDialog(clutil.getclmsg(rspHead.message));
				} else {
					// エラーメッセージを通知。
					clutil.mediator.trigger('onTicker', data);
				}

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
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){

			this.mdBaseView.clear();

			this.srchAreaCtrl.show_srch();

			// Excelボタンは非表示にする
			$("#mainColumnFooter").hide();
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){

			// 編集データをクリア
			this.savedGetData = null;

			// 検索条件を再指定
			this.srchAreaCtrl.show_srch();

			/*this.srchCondView.setEnable(true);
			this.srchAreaCtrl.reset();*/

			// 登録ボタンを不活性、内部GETデータ破棄、リボンメッセージ非表示・・・など
			this.mdBaseView.clear();

			// 下部ボタン群は非表示にする
			$("#mainColumnFooter").hide();

		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId){

			// 入力項目のチェック
			if(!this.validator.valid()) {
				return null;
			}

			var updReq = clutil.view2data($("#result"));
			_.extend(updReq, this.savedReq.AMICV0090GetReq);
			_.extend(updReq, this.savedGetData.AMICV0090GetRsp);

			var reqObj = {
				reqHead: {
					opeTypeId: opeTypeId
				},
				AMICV0090UpdReq: updReq,
			};

			var confirm = "「" + updReq.rackNo +  "」の棚番を削除します。本当によろしいですか？";

			// 確認ダイアログ
			return {
				resId : clcom.pageId,
				data: reqObj,
				confirm: confirm
			};
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {

			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

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

		_eof: 'AMICV0090.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

		// 画面遷移引数がない→メニューから起動された場合
		if (clcom.userInfo && clcom.userInfo.org_id) {

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {

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
