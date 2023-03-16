// プルダウン部品新実装
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
			'click #ca_srch'					: '_onSrchClick',			// 検索ボタン押下時
			'change #ca_srchTypeID'				: '_onSrchTypeChanged'		// 取引先区分が変更された
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

			// 検索日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchDate'));

			// 取引先区分	#ca_srchTypeID
			clutil.cltypeselector({
				$select: this.$("#ca_srchTypeID"),
				kind: amcm_type.AMCM_TYPE_VENDOR,
				unselectedflag: 1
			});

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);

//			// 取引先オートコンプリート
//			clutil.clvendorcode(this.$('#ca_srchID'), {
//				getVendorTypeId: _.bind(function(){
//					return this.getValue('srchTypeID', 0);
//				}, this)
//			});

			// 初期値を設定
			this.deserialize({
				srchTypeID: 0,						// 取引先区分
				srchUnitID: 0,						// 事業ユニット
				srchCode: null,						// 取引先コード
//				srchID: 0,							// 取引先ID
				srchName: null,						// 取引先名称
				srchKana: null,						// 取引先名称カナ
				srchDate: clcom.getOpeDate(),		// 検索日 yyyymmdd
				allHistFlag: 0						// 全出力フラグ
			});
		},

		render: function(){
			// 一番最初のフォーカスを入れる要素
			this.$firstInput = this.$('#ca_srchTypeID').next().find('.selectpicker').first();

			return this;
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
//			// 取引先コード・オートコンプリート設定チェック
//			if(!this.$('#ca_srchID').autocomplete('isValidClAutocompleteSelect')){
//				// エラーメッセージを通知。
//				var arg = {
//					_eb_: '取引先コードの選択が正しくありません。選択肢の中から指定してください。',
//					srchID: '選択肢の中から指定してください。'
//				};
//				this.validator.setErrorInfo(arg, {prefix: 'ca_'});
//				return false;
//			}else{
//				this.validator.clear();
//			}
//			return true;
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 取引先コード・オートコンプリート設定チェック
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			this.trigger('ca_onSearch', dto);
		},
		// 取引先区分が変更されたイベント ⇒ 取引先コード・オートコンプリートの内部設定値をクリアする。
		_onSrchTypeChanged: function(e){
			//console.log(e);
			if(this.deserializing){
				// データセット中
				return;
			}
			//clutil.data2view(this.$el, {srchID: null}, null, 'skipundefined-on');
//			this.$('#ca_srchID').autocomplete('removeClAutocompleteItem');
		},

		_eof: 'AMSSV0310.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #ca_action1'			: '_onClickAppAction',	// XXX アプリボタンデモ
			'click #ca_action2'			: '_onClickAppAction',	// XXX アプリボタンデモ
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		// XXX アプリボタンデモ
		_onClickAppAction: function(e){
			alert('［' + e.target.textContent + '］がクリックされました。');
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '取引先マスタ',
				subtitle: '一覧'
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMMSV0310 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMMSV0310';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			// イベント
			this.srchCondView.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
//			'click div#title p.addNew>a'	: '_onNewClick',			// 新規押下
//			'click #ca_edit'				: '_onEditClick',			// 編集ボタン押下
//			'click #ca_delete'				: '_onDeleteClick',			// 削除ボタン押下
//			'click #ca_rsvcancel'			: '_onReserveCancelClick'	// 予約取消ボタン押下
			clutil.mediator.on('onOperation', this._doOpeAction);
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

			// Fieldlimit
//			clutil.cltxtFieldLimit(this.$("#ca_srchName"));
//			clutil.cltxtFieldLimit(this.$("#ca_srchKana"));

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

			this.resetFocus(this.srchCondView.$firstInput);
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
				AMMSV0310GetReq: srchReq
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
			if(groupid !== 'AMMSV0310'){
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

			var defer = clutil.postJSON('AMMSV0310', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMMSV0310GetRsp.vendorList;
				if(_.isEmpty(recs)){
					// 検索ペインを表示？
					this.showSearchPane('reset');
					this.resetFocus(this.srchCondView.$firstInput);

					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					return;
				}

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.showResultPane();

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);

				// 初期選択の設定（オプション）
				if(!_.isEmpty(chkData)){
					this.recListView.setSelectRecs(chkData, true);
				}

				this.resetFocus($focusElem);
			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 検索ペインを表示
				this.showSearchPane();
				var focusElemId = ($focusElem && _.isFunction($focusElem.attr)) ? $focusElem.attr('[id]') : null;
				if(focusElemId == 'searchAgain'){
					// [検索条件を再指定]ボタンを指定している。
					// 検索条件ペインを表示すると、［・・再指定］ボタンは非表示に
					// なるので、取引先区分
					$focusElem = this.srchCondView.$firstInput;
				}

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				this.resetFocus($focusElem);

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
				this.showSearchPane();
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMMSV0310', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				this.showSearchPane();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
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
		 * 条件設定ペインを表示する。
		 */
		showSearchPane: function(srchAreaUI){
			if(srchAreaUI == 'reset'){
				this.srchAreaCtrl.reset();
			}else{
				this.srchAreaCtrl.show_srch();
			}
			this.mdBaseView.$('#mainColumnFooter').fadeOut();
		},

		/**
		 * 検索結果表示ペインを表示する。
		 */
		showResultPane: function(){
			this.srchAreaCtrl.show_result();
			this.mdBaseView.$('#mainColumnFooter').fadeIn();
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.showSearchPane();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧画面では使用しない*/, e){
			var url = clcom.appRoot + '/AMMS/AMMSV0320/AMMSV0320.html';
			var myData, destData, selectedRecs;
			if(this.savedReq){
				// 検索結果がある場合
//				var selectedRecs = this.recListView.getSelectedRecs();
				selectedRecs = this.recListView.getSelectedRecs();
				myData = {
					btnId: e.target.id,
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMMSV0310GetReq,
					chkData: selectedRecs
				};
				destData = {
					opeTypeId: rtyp,
					//srchDate: this.savedReq.srchDate,
					chkData: (rtyp === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL)
							? [ this.recListView.getLastClickedRec() ] : selectedRecs
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
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
				// チェックされたデータが必要（１）
				// fall through
				if(destData.chkData && destData.chkData.length >= 2){
					// 複数行選択されている		-- そもそもボタンを押せなくしているのでありえない
					console.warn('rtyp[' + rtyp + ']: '
							+ selectedRows.length + ' items selected, but single select only.');
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
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
				// チェックされたデータが必要（１）
				// fall through
				if(destData.chkData && destData.chkData.length >= 2){
					// 複数行選択されている		-- そもそもボタンを押せなくしているのでありえない
					console.warn('rtyp[' + rtyp + ']: '
							+ selectedRows.length + ' items selected, but single select only.');
					return;
				}
				for (var i = 0; i < destData.chkData.length; i++) {
					var data = destData.chkData[i];
					var f_error = false;

					if (data.fromDate <= clcom.getOpeDate()) {
						f_error = true;
					}
					if (data.toDate < clcom.max_date) {
						f_error = true;
					}
					if (f_error) {
						this.srchCondView.validator.setErrorHeader("予約取消できないデータです。");
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
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
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
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}
		},

		_eof: 'AMSSV0310.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

		var pageData = clcom.pageData;
		if(pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
		}else{
			// 保存パラメタが無い場合
			// 初期検索用の条件を仕込んで、結果表示させる。
			var savedReq = mainView.buildReq();
			pageData = {
				btnId: 'searchAgain',
				chkData: [],
				savedCond: savedReq.AMMSV0310GetReq,
				savedReq: savedReq
			};
		}
		mainView.load(pageData);
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

	// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
	// テストデータ
	xxx = {
		rspHead: {
			status: 0
		},
		rspPage: {
			curr_record: 1,				// 開始レコードインデックス
			total_record: 5,			// 総レコード数
			page_record: 5,				// ページ内レコード数
			page_size: 25,				// ページ内マックスレコード数
			page_num: 1					// 総ページ数
		},
		AMMSV0310GetRsp: {
			vendorList: [
				{
					id: 1,
					code: 'code-001',
					name: 'vendor-001',
					fromDate: 20120101,
					toDate: clcom.max_date,
					vendorTypeID: 1,
					unitCode: '001',
					unitName: '事業ユニット＃１ - 編集・削除できる'
				},
				{
					_select: true,
					id: 2,
					code: 'code-002',
					name: 'vendor-002',
					fromDate: 20120101,
					toDate:   20201231,				// 終了日が切られている
					vendorTypeID: 1,
					unitCode: '002',
					unitName: '事業ユニット＃２ - 終了日が切られている'
				},
				{
					id: 3,
					code: 'code-003',
					name: 'vendor-003',
					fromDate: 20201231,				// 開始日：opeDate 以降
					toDate:   clcom.max_date,
					vendorTypeID: 1,
					unitCode: '003',
					unitName: '事業ユニット＃３ - 予約削除できる'
				},
				{
					id: 4,
					code: 'code-004',
					name: 'vendor-004',
					fromDate: 20120101,
					toDate:   20191231,
					vendorTypeID: 1,
					unitCode: '004',
					unitName: '事業ユニット＃４ - 終了日が切られている'
				},
				{
					id: 4,
					code: 'code-004',
					name: 'vendor-004',
					fromDate: 20200101,
					toDate:   clcom.max_date,
					vendorTypeID: 1,
					unitCode: '004',
					unitName: '事業ユニット＃４ - 予約削除できる'
				},
				{
					id: 5,
					code: 'code-005',
					name: 'vendor-005',
					fromDate: 20120101,
					toDate:   clcom.max_date,
					vendorTypeID: 5,
					unitCode: '005',
					unitName: '事業ユニット＃５ - 編集・削除できる'
				}
			]
		}
	};
	// 結果データ偽装
	boo = function(){
		mainView.savedReq = mainView.buildReq();
		mainView.recListView.setRecs(xxx.AMMSV0310GetRsp.vendorList);
		mainView.srchAreaCtrl.show_result();
	};
});
