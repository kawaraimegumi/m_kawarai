$(function() {

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),

		events: {
			'click #ca_srch'			: '_onSrchClick',			// 検索ボタン押下時
		},

		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			// 新規の場合、適用期間の初期表示を行う
			var fromDate = clcom.getOpeDate();
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 検索日
				datepicker: {
					el: "#ca_srchDate",
					initValue: fromDate
				},
				// 商品分類体系
				clitgrpfunccode: {
					el: "#ca_srchFuncID"
				},
				// 商品分類階層
				clitgrplevel: {
					el: "#ca_srchLevelID",
					branches: ['p_id'],
					dependSrc: {
						itgrpfunc_id: 'itgrpfunc_id',
					}
				},
				clitgrpcode: {
					el: "#ca_srchUpperID",
					dependSrc: {
						itgrplevel_id: 'p_id',
					},
				},
			}, {
			});
			this.fieldRelation.done(function() {

			});
		},

		/**
		 * 商品分類体系ID取得
		 */
		getItgrpFuncId: function() {
			var idstr = $("#ca_srchFuncID").attr("cs_id");
			var id = 0;
			try {
				if (idstr == null) {
					id = 0;
				} else {
					id = parseInt(idstr);
				}
			} catch (e) {
			}
			return id;
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			clutil.inputlimiter(this.$el);

			var defaultItgrpFunc = clcom.cmDefaults.defaultItgrpFunc;
			console.log(defaultItgrpFunc);
//			var req = {
//				srchFuncID: defaultItgrpFunc,
//			};
//			clutil.data2view($("#div_ca_srchFuncID"), req);
			$(".txtInFieldUnit.help").tooltip({html: true});

			// 初期値を設定
			this.deserialize({
				srchFuncID: defaultItgrpFunc,		// 商品分類体系ID
				srchLevelID: 0,						// 商品分類階層ID
				srchUpperID: 0,						// 上位分類ID
				srchCode: null,						// 商品分類コード
				srchName: null,						// 商品分類名称
				srchNameKana: null,					// 商品分類名称カナ
				srchShortName: null,				// 商品分類略称
				srchShortNameKana: null,			// 商品分類略称カナ
				srchDate: clcom.getOpeDate(),		// 検索日 yyyymmdd
				allHistFlag: 0						// 全出力フラグ
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
				if (dto._view2data_srchFuncID_cn != null) {
					dto.srchFuncID = dto._view2data_srchFuncID_cn;
				}
				if (dto._view2data_srchLevelID_cn != null) {
					dto.srchLevelID = dto._view2data_srchLevelID_cn;
					dto.srchLevelID.p_id = dto.p_id;
				}
				if (dto._view2data_srchUpperID_cn != null) {
					dto.srchUpperID = dto._view2data_srchUpperID_cn;
				}
				clutil.data2view(this.$el, dto);
//				this.fieldRelation.done(function() {
//					if (_.isNumber(dto.srchLevelID) && dto.srchLevelID !== 0) {
//						clutil.viewRemoveReadonly($("#div_srchUpperID"));
//					}
//				});
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
			if (!this.validator.valid()) {
				return false;
			}
			// 商品分類体系コード・オートコンプリート設定チェック
			if(!this.$('#ca_srchFuncID').autocomplete('isValidClAutocompleteSelect')){
				// エラーメッセージを通知。
				var arg = {
					_eb_: '商品分類体系コードの選択が正しくありません。選択肢の中から指定してください。',
					srchFuncID: '選択肢の中から指定してください。'
				};
				this.validator.setErrorInfo(arg, {prefix: 'ca_'});
				return false;
			}
			return true;
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

		_eof: 'AMSSV0030.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '商品分類マスタ',
				subtitle: '一覧'
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMMSV0030 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMMSV0030';

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
			this.recListView.render();
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}
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
				AMMSV0030GetReq: srchReq
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);

			// 検索実行
			this.doSrch(req, null, $('#ca_table'));
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMMSV0030'){
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

			var defer = clutil.postJSON('AMMSV0030', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMMSV0030GetRsp.itgrpList;
				if(_.isEmpty(recs)){
					// 検索ペインを表示？
					mainView.srchAreaCtrl.reset();
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
				this.recListView.setRecs(recs);
				this.recListView.setDeletedRowUI(function(dto) {
					return dto.delFlag != 0;
				});

				// 初期選択の設定（オプション）
				if(!_.isEmpty(selectedIds)){
					var uniqKeys = [];
					uniqKeys.push('itgrpID');
					this.recListView.setSelectRecs(selectedIds, true, uniqKeys);
				}

				this.resetFocus($focusElem);
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
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, e){
			var url = clcom.appRoot + '/AMMS/AMMSV0040/AMMSV0040.html';
			var myData, destData;
			if(this.savedReq){
				var chkData = this.recListView.getSelectedRecs();
				if (this.savedReq.AMMSV0030GetReq._view2data_srchLevelID_cn != null) {
					var item = $("#ca_srchLevelID").autocomplete('clAutocompleteItem');
					if (item != null) {
						this.savedReq.AMMSV0030GetReq.p_id = item.p_id;
					}
				}
				// 検索結果がある場合
				myData = {
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMMSV0030GetReq,
					chkData: chkData,
				};
				destData = {
					opeTypeId: rtyp,
					srchDate: this.savedReq.srchDate,
					chkData: chkData,
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
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
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

		_eof: 'AMSSV0030.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();
		mainView.resetFocus($("#ca_srchFuncID"));

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