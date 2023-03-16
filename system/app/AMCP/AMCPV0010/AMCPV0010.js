useSelectpicker2();

$(function(){
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',
			'click #ca_srch'				: '_onSrchClick',			// 検索ボタン押下時
		},

		// 店舗選択ボタン
		_onStoreSelClick: function(e){
			var options = {
				func_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id	: this.utl_unit.getValue(),
				org_kind_set: [
								am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,		//店舗
								am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,		//倉庫
					            am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ			//本部
							]
			};
			this.AMPAV0010Selector.show(null, null, options);
		},

		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			this.initUIElement_AMPAV0010();
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			clutil.inputlimiter(this.$el);

			// シーズン
			this.utl_seasons = clutil.cltypeselector({
				el: '#ca_srchSeasons',
				kind: amcm_type.AMCM_TYPE_SEASON,
	    	});

			// 作成日
			this.utl_fromDate = clutil.datepicker(this.$('#ca_fromDate'));
			this.utl_toDate = clutil.datepicker(this.$('#ca_toDate'));

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: '#ca_unitID',
					initValue: clcom.userInfo.unit_id,
				},

				/** 1/14 追加実装 **/
				//店舗オートコンプ
				clorgcode: {
					el : '#ca_srchStoreID',
					addDepends: ['p_org_id'],
					dependSrc: {
						p_org_id: 'unit_id'
					}
				},
				// 店舗参照ボタン
				AMPAV0010: {
					button: this.$('#ca_btn_store_select'),
					view: this.AMPAV0010Selector
				},
				/** ここまで **/

				// 品種
				clvarietycode: {
					el: '#ca_srchStditgrpID'
				},
			}, {
				dataSource: {
					ymd : clcom.getOpeDate,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
				}
			});
			this.fieldRelation.done(function() {
				var tgtView = mainView.srchCondView;
				tgtView.utl_unit = this.fields.clbusunitselector;
				tgtView.utl_store = this.fields.clorgcode;
				tgtView.setInitializeValue();
				tgtView.setDefaultEnabledProp();
			});

			// 初期フォーカスオブジェクト設定
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
				clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				this.$tgtFocus = $('#ca_srchStditgrpID');
			} else {
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS){
					this.$tgtFocus = $('#ca_unitID');
				}else{
					this.$tgtFocus = $('#ca_srchStoreID');
				}
			}

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);
		},

		setInitializeValue: function(){
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
					clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				var storeID = clcom.userInfo.org_id;
				var storeCode = clcom.userInfo.org_code;
				var storeName = clcom.userInfo.org_name;
				$(this.utl_store.el).autocomplete('clAutocompleteItem', {id: storeID, code: storeCode, name: storeName});
				this.utl_store.setValue({id: storeID, code: storeCode, name: storeName});
			}

			if(!clcom.pageData){
				this.utl_fromDate.datepicker('setIymd', clcom.getOpeDate());
				this.utl_toDate.datepicker('setIymd', clcom.getOpeDate());
			}
		},

		setDefaultEnabledProp: function() {
			// 初期活性制御
			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS){
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
					clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					clutil.viewReadonly($("#div_ca_store"));
				}else{
					if (clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					}
				}
			}

			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS &&
				clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$("#div_ca_unitID").hide();
			}

			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE &&
				clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN &&
				clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS) {
				$("#div_ca_grp_editbtn").hide();
			}

		},

		initUIElement_AMPAV0010 : function(){
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el				: $("#ca_AMPAV0010_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				select_mode 	: clutil.cl_single_select,		// 単一選択
				isAnalyse_mode 	: false,						// 通常画面モード
			});

			this.AMPAV0010Selector.clear = function() {
				if (typeof mainView != "undefined") {
					var autocomplete = mainView.srchCondView.utl_store;
					autocomplete.resetValue();
				}
			};

			this.AMPAV0010Selector.render();
			this.AMPAV0010Selector.clear();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				var autocomplete = mainView.srchCondView.utl_store;
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					autocomplete.setValue({id: id, code: code, name: name});
				} else {
					var item = autocomplete.getValue();
					if (item.id == 0) {
						this.clear();
					}
				}

				_.defer(function(){
					clutil.setFocus($('#ca_btn_store_select'));
				});
			};
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
			var hasError = !this.validator.valid();

			var fromDate = clutil.dateFormat(this.utl_fromDate.val(), "yyyymmdd");
			var toDate = clutil.dateFormat(this.utl_toDate.val(), "yyyymmdd");

			if(fromDate.length == 0 && toDate.length == 0) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				this.validator.setErrorMsg(this.utl_fromDate, clmsg.cl_required2);
				this.validator.setErrorMsg(this.utl_toDate, clmsg.cl_required2);

				hasError = true;

			} else {
				var chkInfo = [];

				chkInfo.push({
					stval : 'ca_fromDate',
					edval : 'ca_toDate'
				});

				if(!this.validator.validFromTo(chkInfo)){
					hasError = true;
				}
			}

			return !hasError;
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 取引先コード・オートコンプリート設定チェック
			if(!this.isValid()){
				return;
			}
			if ($("#ca_srchArea").find('.cl_error_field').length > 0){
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return;
			}

			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMCPV0010.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'			: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
		},

		initialize: function(){
			_.bindAll(this);

			var btnNew = true;
			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE &&
				clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN &&
				clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS) {
				btnNew = false;
			}

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: 'プライス別棚卸報告',
				subtitle: '一覧',
				btn_new: btnNew,
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMCPV0010 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMCPV0010';

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
			clutil.mediator.on('onRowSelectChanged', this._onRowSelectChanged);

			// OPE系イベント
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
				AMCPV0010GetReq: srchReq
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
			if(groupid !== 'AMCPV0010'){
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

		_onRowSelectChanged: function(groupid, args, from){
			var enabled = true;

			if (args.selectedRecsCount == 0){
				enabled = false;
			}else{
				for(var i = 0; i < args.selectedRecsCount; i++){
					if (args.selectedRecs[i].status == 1){
						enabled = false;
					}
				}
			}

			var $btn = $("#result .cl_opebtngroup .cl_comment");
			if (enabled){
				clutil.inputRemoveReadonly($btn);
			}else{
				clutil.inputReadonly($btn);
			}
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem) {
			this.clearResult();

			var defer = clutil.postJSON('AMCPV0010', srchReq).done(_.bind(function(data){

				// データ取得
				var recs = data.AMCPV0010GetRsp.cntPrcList;

				if (_.isEmpty(recs)) {
					mainView.srchAreaCtrl.reset();

					// エラーメッセージ表示
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

					// フォーカス設定
					this.resetFocus(this.srchCondView.$tgtFocus);

				} else {
					$.each(recs, function() {
						this.cntPrcRprtID = this.cntPrcID;

						this.fromDate = clcom.min_date;
						this.toDate = clcom.max_date;

					});

					// リクエストを保存。
					this.savedReq = srchReq;

					// 結果ペインを表示
					this.srchAreaCtrl.show_result();

					// 内容物がある場合 --> 結果表示する。
					this.recListView.setRecs(recs);

					if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE &&
						clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN &&
						clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS) {
						for(var i = 0; i < recs.length; i++){
							mainView.recListView.setRowState({
								isMatch: function(item){ return true; },
								enable: false
							});
						}
					}

					// 初期選択の設定（オプション）
					if(!_.isEmpty(chkData)){
						this.recListView.setSelectRecs(chkData, true, ['cntPrcID']);
					}

					// フォーカス設定
					if(typeof $focusElem != 'undefined') {
						this.resetFocus($focusElem);
					}

					$.when($('#searchAgain')).done(function () {
						var $window = $(window);
						var offset = $('#searchAgain').offset();
						var location = {
							left	: offset.left - $window.scrollLeft(),
							top		: offset.top  - $window.scrollTop(),
						};

					    if (location.top < 0){
					    	clcom.targetJump('searchAgain', 50);
					    }
					});
				}
			}, this)).fail(_.bind(function(data){

				mainView.srchAreaCtrl.reset();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				// フォーカス設定
				this.resetFocus();
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
				this.srchAreaCtrl.show_srch();
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMCPV0010', srchReq);
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
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFocus($focusElem);
			}else{
				if (this.$('#searchAgain').css('display') == 'none') {
					clutil.setFocus($('#ca_srch'));
				} else {
					clutil.setFocus($('#searchAgain'));
				}
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
		_doOpeAction: function(rtyp, pgIndex, e){
			var store = this.srchCondView.utl_store.getValue();

			var url_comment = clcom.appRoot + '/AMCP/AMCPV0040/AMCPV0040.html';
			var url_edit = clcom.appRoot + '/AMCP/AMCPV0020/AMCPV0020.html';
			var url = url_edit;
			var myData, destData;

			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					btnId: e.target.id,
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMCPV0010GetReq,
					selectedIds: this.recListView.getSelectedIdList(),
					chkData: this.recListView.getSelectedRecs(),
				};
				destData = {
					opeTypeId: rtyp,
					srchDate: this.savedReq.srchDate,
					srchCond: this.savedReq.AMCPV0010GetReq,
					chkData: this.recListView.getSelectedRecs(),
					retUrl: location.href,
					saved:myData,
				};

				destData.srchCond.store = store;

			}else{
				// 検索結果が無い場合
				myData = {
					savedReq: null,
					savedCond: this.srchCondView.serialize(),
					selectedIds: [],
					chkData: [],
				};
				destData = {
					opeTypeId: rtyp,
					retUrl: location.href,
				};
			}

			var pushPageOpt = {
				url		: url,
				args	: destData,
				saved	: myData,
			};

			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				// データが無くても可
				clcom.pushPage(pushPageOpt);
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				var lastClickedRec = this.recListView.getLastClickedRec();
				if(_.isEmpty(lastClickedRec)){
					// 最後にクリックした行データがとれなかった
					console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
					return;
				}
				destData.chkData = [ lastClickedRec ];

				if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE &&
					clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN &&
					clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS) {

					if (destData.chkData[0].status == 1){
						clutil.MessageDialog2('店舗での登録作業が完了していません。');
						return;
					}

					pushPageOpt.url = url_comment;
				} else {

					pushPageOpt.url = url_edit;
				}
				pushPageOpt.newWindow = true;

				clcom.pushPage(pushPageOpt);
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:	// 複製
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
				// チェックされたデータが必要（１）
				if(destData.chkData && destData.chkData.length >= 2){
					// 複数行選択されている		-- そもそもボタンを押せなくしているのでありえない
					console.warn('rtyp[' + rtyp + ']: '
							+ selectedRows.length + ' items selected, but single select only.');
					return;
				}
				// fall through

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
				// チェックされたデータが必要（Ｎ）
				if(_.isEmpty(destData.chkData)){
					// 行選択がない				-- そもそもボタンを押せなくしている
					console.warn('rtyp[' + rtyp + ']: item not specified.');
					return;
				}

				if (e.currentTarget.name == 'comment') {
					pushPageOpt.url = url_comment;
				}

				clcom.pushPage(pushPageOpt);
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
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

		_eof: 'AMCPV0010.MainView//'
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
		}else if (clcom.srcUrl.indexOf('AMCPV0040') >= 0 && clcom.pageArgs){//ココ＞＞
			mainView.load(clcom.pageArgs);
		}
		//ココ＜＜
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
