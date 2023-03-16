useSelectpicker2();

$(function(){
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'		: '_onSrchClick',		// 検索ボタン押下時
			'change #ca_srchUnitID'	: '_onUnitChanged'			// 事業ユニット変更
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

			// 事業ユニット
			this.utl_unit = clutil.clbusunitselector({
				el: '#ca_srchUnitID',
				initValue: clcom.userInfo.unit_id
	    	});

			// 発注方法
			this.utl_orderFuncType = clutil.cltypeselector({
				el: '#ca_srchOrderFuncTypeID',
				kind: amcm_type.AMCM_TYPE_EQUIP_ORDER_TYPE,
				ids: [
						amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_EQUIP,
						amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_PREMIUM,
				]
	    	});

			// 備品担当部署区分
			this.utl_department = clutil.cltypeselector({
				el: '#ca_srchDepartmentID',
				kind: amcm_type.AMCM_TYPE_EQUIP_DEPART_TYPE
				/*ids: [
						amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_SOMU,
						amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_HANSOKU,
						amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_SHOUHIN_KANRI,
						amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_TENPO_KIKAKU,
					]*/
	    	});
			// 備品担当部署区分
			this.utl_department2 = clutil.cltypeselector({
				el: '#ca_srchDepartmentID_ori',
				kind: amcm_type.AMCM_TYPE_EQUIP_DEPART_TYPE,
				ids: [
						amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_EIGYOU_KANRI,
					]
	    	});
			$("#div_ca_departmentID").show();
			$("#div_ca_departmentID_ori").hide();

			// 発注日
			// this.utl_orderDate = clutil.datepicker(this.$('#ca_srchOrderDate'));
			this.utl_fromDate = clutil.datepicker(this.$('#ca_fromDate'));
			this.utl_toDate = clutil.datepicker(this.$('#ca_toDate'));

			// 発送元
			this.utl_senderType = clutil.cltypeselector({
				el: '#ca_srchSenderTypeID',
				kind: amcm_type.AMCM_TYPE_EQUIP_SENDER_TYPE
	    	});

			// 初期値を設定
			this.deserialize( {
				srchUnitID		: clcom.userInfo.unit_id,
				//srchOrderDate	: clcom.getOpeDate(),	// 発注日
				fromDate		: clcom.getOpeDate(),	// 発注締め日（from）
				toDate			: null,					// 発注締め日（to）
				equipManTypeID		: amcm_type.AMCM_VAL_EQUIP_ADMIN_TYPE_EQUIP
			});

			this.setInitializeValue();
			this.setDefaultEnabledProp();

			// 初期フォーカスオブジェクト設定
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				this.$tgtFocus = $("#ca_srchDepartmentID");
			}
			else{
				this.$tgtFocus = $('#ca_srchUnitID');
			}

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);
		},

		setInitializeValue: function(){
		},

		setDefaultEnabledProp: function(){
			if (clcom.userInfo.user_typeid== amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.viewReadonly("#div_ca_srchUnitID");
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

 				var callback = this._onUnitChanged;
				this.utl_unit.done(function() {callback();});
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
		isValid: function() {

			//return this.validator.valid();

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

		_onUnitChanged: function(e){
			if(this.deserializing){
				return;
			}

			var val = Number(this.utl_unit.getValue());

			//事業ユニットがORIHICAの場合は、担当部署に「営業管理部」を表示し操作不可能とする
			if (val === clutil.getclsysparam('PAR_AMMS_UNITID_ORI')) {
				$("#div_ca_departmentID").hide();
				$("#div_ca_departmentID_ori").show();

				this.utl_department2.setValue(amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_EIGYOU_KANRI);
				clutil.viewReadonly($("#div_ca_departmentID"));
				clutil.viewReadonly($("#div_ca_departmentID_ori"));

			} else {
				$("#div_ca_departmentID").show();
				$("#div_ca_departmentID_ori").hide();

				clutil.viewRemoveReadonly($("#div_ca_departmentID"));
				clutil.viewRemoveReadonly($("#div_ca_departmentID_ori"));
			}

			this.utl_unit.prevValue = val;
		},

		_eof: 'AMEQV0120.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'		: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title		: '備品・プレミアム商品',
				subtitle	: '店舗別発注状況確認',
				btn_new		: false,
				btn_csv		: false,
				btn_submit	: true,
				btn_cancel	: true,
				btn_cancel	: this._doCancel
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMEQV0120 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMEQV0120';

			// ページャ
			//this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			//clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){
			this.mdBaseView.commonHeader._onBackClick(e);
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
			//for(var i = 0; i < this.pagerViews.length; i++){
			//	this.pagerViews[i].render();
			//}
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
				//reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMEQV0120GetReq: srchReq
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

//		/**
//		 * ページ切り替え/表示件数変更からの再検索
//		 */
//		_onPageChanged: function(groupid, pageReq, from){
//			if(groupid !== 'AMEQV0120'){
//				return;
//			}
//
//			if(!this.savedReq){
//				console.warn('検索条件が保存されていません。');
//				return;
//			}
//
//			// 検索条件を複製してページリクエストを差し替える
//			var req = _.extend({}, this.savedReq);
//			req.reqPage = pageReq;
//
//			// 検索実行
//			this.doSrch(req);
//		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMEQV0120', srchReq).done(_.bind(function(data){

				// データ取得
				var recs = data.AMEQV0120GetRsp.equipOrderList;

				if (_.isEmpty(recs)) {
					mainView.srchAreaCtrl.reset();

					// エラーメッセージ表示
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

					// フォーカス設定
					this.resetFocus(this.srchCondView.$tgtFocus);

				} else {

					var quantityTotal = 0;
					var amountTotal = 0;
					var quantityANTotal = 0;
					var amountANTotal = 0;

					// 各項目の合計値の計算
					$.each(recs,function(){

						//this.orderDate =  clutil.dateFormat(mainView.srchCondView.utl_orderDate.val(), "yyyymmdd");

						quantityTotal += this.quantity;
						amountTotal += this.amount;
						quantityANTotal += this.quantityAN;
						amountANTotal += this.amountAN;
					});

					// 合計行の内容を表示する
					$("#ca_quantityTotal").text(clutil.comma(quantityTotal));
					$("#ca_amountTotal").text(clutil.comma(amountTotal));
					$("#ca_quantityANTotal").text(clutil.comma(quantityANTotal));
					$("#ca_amountANTotal").text(clutil.comma(amountANTotal));

					// リクエストを保存。
					this.savedReq = srchReq;

					// 結果ペインを表示
					this.srchAreaCtrl.show_result();

					// 内容物がある場合 --> 結果表示する。
					this.recListView.setRecs(recs);

					// 初期選択の設定（オプション）
					if(!_.isEmpty(chkData)){
						this.recListView.setSelectRecs(chkData, true);
					}

					// フォーカスの設定
					if(typeof $focusElem != 'undefined') {
						this.resetFocus($focusElem);
					}

					$.when($('#searchAgain')).done(function () {
						var $window = $(window);
						var offset = $('#searchAgain').offset();
						var location = {
							left	: offset.left - $window.scrollLeft(),
							top		: offset.top  - $window.scrollTop()
						};

					    if (location.top < 0){
					    	clcom.targetJump('searchAgain', 50);
					    }
					});
				}
			}, this)).fail(_.bind(function(data){

				// 検索ペインを表示
				mainView.srchAreaCtrl.reset();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				// フォーカスの設定
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
			var defer = clutil.postDLJSON('AMEQV0120', srchReq);
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
		_doOpeAction: function(rtyp, pgIndex, e) {
			if($(e.currentTarget).find('select').length > 0){
				return;
			}

			var url = clcom.appRoot + '/AMEQ/AMEQV0060/AMEQV0060.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					btnId: e.target.id,
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMEQV0120GetReq,
					selectedIds: this.recListView.getSelectedIdList(),
					chkData: this.recListView.getSelectedRecs()
				};
				destData = {
					opeTypeId: rtyp,
					srchDate: this.savedReq.srchDate,
					srchCond: this.savedReq.AMEQV0120GetReq,
					chkData: this.recListView.getSelectedRecs()
				};
			}else{
				// 検索結果が無い場合
				myData = {
					btnId: e.target.id,
					savedReq: null,
					savedCond: this.srchCondView.serialize(),
					selectedIds: [],
					chkData: []
				};
				destData = {
					opeTypeId: rtyp,
					srchCond: {}
				};
			}

			var pushPageOpt = {
				url		: url,
				args	: destData,
				saved	: myData
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
				pushPageOpt.newWindow = true;

				var store = {
					id		:destData.chkData[0].storeID,
					code	:destData.chkData[0].storeCode,
					name	:destData.chkData[0].storeName,
					val		:destData.chkData[0].storeCode + ':' + destData.chkData[0].storeName
				};
				destData.srchCond.store = store;
				destData.chkData[0].srchEquipIDList = destData.chkData[0].equipIDList;

				// fall through

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:	// 複製
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

			$("#ca_quantityTotal").text('');
			$("#ca_amountTotal").text('');
			$("#ca_quantityANTotal").text('');
			$("#ca_amountANTotal").text('');
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

		_eof: 'AMEQV0120.MainView//'
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

