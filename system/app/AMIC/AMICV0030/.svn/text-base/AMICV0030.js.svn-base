/**
 * 品種別在庫総数確認
 */

$(function(){

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
		 *  初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			clutil.inputlimiter(this.$el);

			// 対象日に運用日の前日をセットする
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchDate'));
			this.srchDatePicker.datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), -1));

			var unit = null;

			if (clcom.userInfo) {

				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {

					// 店舗ユーザの場合
					unit = clcom.userInfo.unit_id;
				} else {

					// 店舗ユーザでない場合
					unit = null;
				}
			}
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

			var flag = true;
			var srchDto = clutil.view2data($("#ca_srchArea"));
			var day = srchDto.srchDate;

			// 未入力エラー確認
			if(!this.validator.valid()){
				flag = false;
			}

			if(day >= clcom.getOpeDate()){
				this.validator.setErrorMsg($("#ca_srchDate"), clmsg.EGM0035);
				flag = false;
			}

			return flag;

		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {

			if(this.isValid() === false){
				return;
			}

			var dto = this.serialize();
			this.trigger('ca_onSearch', dto);
		},

		_eof: 'AMICV0030.SrchCondView//'
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

			// Excelデータ出力ボタン表示フラグ
			var csvFlag = false;

			if (clcom.userInfo) {

				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {

					// ログインユーザが店舗ユーザの場合
					 csvFlag = false;
				} else {
					// ログインユーザが店舗ユーザでない場合
					csvFlag = true;
				}
			}

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({

				opeTypeId: -1,
				title: '品種別在庫総数確認',
				btn_submit: false,
				btn_new: false,
				btn_csv: csvFlag,

				// キャンセルボタンのコールバック
				btn_cancel: this._doCancel,

				// Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
				// リクエストのビルダ関数を渡しておく。
				buildGetReqFunction: this._buildGetReqFunction

			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMICV0030 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMICV0030';

			///////////////// 検索結果リストの表示
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			var mainView = this;

			/////////////////////////////////////////////////////////

			// イベント
			this.srchCondView.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント

			// 外部イベントの購読設定
			// Submit と、GET結果のデータを購読する。
			clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			var _this = this;

			this.mdBaseView.initUIElement();

			// 店舗部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					var d = data[0];
					_this.srcStoreIdField.setValue({
						id: d.val,
						code: d.code,
						name: d.name
					});
				}
				_.defer(function(){// setFocusを_.defer()で後回しにする
					// 選択サブ画面から戻ったら参照ボタンにフォーカスを当てる
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};

			// 店舗オートコンプリート
			this.srcStoreIdField = clutil.clorgcode({
				el: $("#ca_srchStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					// p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'),1),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'),6),
					f_stockmng: 1
				}
			});

			this.srchCondView.initUIElement();
			this.recListView.initUIElement();

			if (clcom.userInfo && clcom.userInfo.org_id) {

				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {

					// ログインユーザが店舗ユーザである

					// 所属店舗名を表示する
					this.$('#ca_srchStoreID').autocomplete('clAutocompleteItem', {
						id: clcom.userInfo.org_id,
						code: clcom.userInfo.org_code,
						name: clcom.userInfo.org_name
					});

					// 店舗項目は操作不可とする
					clutil.inputReadonly($("#ca_srchStoreID"));
					clutil.inputReadonly($("#ca_btn_store_select"));

				}
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

			this.AMPAV0010Selector.render();

			// Excel出力ボタンを非表示にする
			$("#mainColumnFooter").hide();

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {

				// ログインユーザが店舗ユーザの場合は初期フォーカスを対象日にセットする
				clutil.setFocus(this.$("#ca_srchDate"));

			} else {

				// ログインユーザが店舗ユーザ以外の場合は初期フォーカスを店舗にセットする
				clutil.setFocus(this.$("#ca_srchStoreID"));
			};

			this.recListView.render();

			return this;
		},

		/**
		 * GET 応答のイベントを受ける
		 */
		_onMDGetCompleted: function(args, e){

			console.log('args.status: [' + args.status + ']');

			this.savedGetData = null;

			switch(args.status){
			case 'OK':

				// Get応答を画面に表示する
				this.data2view(args.data);

				break;

			case 'DONE':		// 確定済

				// args.data をアプリ個別 View へセットする。
				this.data2view(args.data);

				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み

				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース

				// 検索結果を画面に表示する
				this.data2view(args.data);

				break;

			default:
			case 'NG':	// その他エラー。

				// 全 <input> を readonly 化するなどの処理。
				// clutil.viewReadonly(this.$("#ca_srchArea"));
				break;
			}

		},

		/**
		 * 検索結果を画面に表示する
		 */
		data2view: function(data){

			// 検索結果をクリア
			this.clearResult();

			this.saveData = data.AMICV0030GetRsp;

			// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」

			if(_.isEmpty(this.saveData)){

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// Excelボタンを非表示にする
				$("#mainColumnFooter").hide();

				return;
			}

			if(_.isEmpty(this.saveData.stockList)){

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// Excelボタンを非表示にする
				$("#mainColumnFooter").hide();

				return;
			}

			// 結果ペインを表示
			this.srchAreaCtrl.show_result();

			if (clcom.userInfo) {

				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {

					// 店舗ユーザの場合、Excelボタンを表示しない
					$("#mainColumnFooter").hide();

				} else {

					// 店舗ユーザでない場合、Excelボタンを表示する
					$("#mainColumnFooter").show();
				}
			}

			// 内容物がある場合 --> 結果表示する。

			var data = [];

			for(var i=0; i < this.saveData.stockList.length; i++) {

				data[i] = {
					// 部門
					departCodeName : this.saveData.stockList[i].departCode + ":" + this.saveData.stockList[i].departName,
					// 品種コード'
					stditgrpCode : this.saveData.stockList[i].stditgrpCode,
					// 品種名
					stditgrpName : this.saveData.stockList[i].stditgrpName,
					// 在庫数
					qy : this.saveData.stockList[i].qy,
					// 積送数 #20150720
					shipmentQy : this.saveData.stockList[i].shipmentQy
				};
			}

			// テーブルに表示する
			this.recListView.setRecs(data);

		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){

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
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {

			//var req = this.buildReq(srchReqDto);

			// 検索実行
			this.mdBaseView.fetch();
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){

			//alert("buildReq: 検索条件をつくる");

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
				AMICV0030GetReq: srchReq
			};
			return req;
		},

		/**
		 * Get リクエストを作る
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			if(!this.srchCondView.isValid()){
				return null;
			}
			var req = this.buildReq();
			return {
				resId : clcom.pageId,
				data: req
			};
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){

			this.srchAreaCtrl.show_srch();

			// Excelボタンは非表示にする
			$("#mainColumnFooter").hide();

		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {

			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

			// テーブルをクリア
			//this.recListView.clear();
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
			var defer = clutil.postDLJSON('AMICV0030', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		_eof: 'AMICV0030.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){

		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

	}).fail(function(data){

		// clcom のネタ取得に失敗。
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});
});
