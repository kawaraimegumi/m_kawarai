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
			'change #ca_srchUnitID'	: '_onUnitChanged',		// 事業ユニット変更
			'change input[name="equipManTypeID"]:first'	: '_onChangeEquipManType'	// 備品管理区分ラジオボタン変更
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

			clutil.FieldRelation.create("default", {
				// 事業ユニット取得
				clbusunitselector: {
					el: "#ca_srchUnitID",
					initValue: clcom.userInfo.unit_id
				},
				// 備品取引先
				clequipvendcode: {
					el: '#ca_equipVendID'
				}
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

			$("#div_ca_srchDepartmentID").show();
			$("#div_ca_srchDepartmentID_ori").hide();

			// 発注締め日
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
				equipManTypeID	: amcm_type.AMCM_VAL_EQUIP_ADMIN_TYPE_EQUIP,
				fromDate		: clcom.getOpeDate(),	// 発注締め日（from）
				toDate			: null					// 発注締め日（to）
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
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
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

			if (~~dto.srchUnitID == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				dto.srchDepartmentID = dto.srchDepartmentID_ori;
			}

			clutil.mediator.trigger('ca_onSearch', dto);
		},

		/**
		 * 事業ユニット変更
		 */
		_onUnitChanged: function(e){
			if(this.deserializing){
				return;
			}

			var val = Number(this.utl_unit.getValue());

				//事業ユニットがORIHICAの場合は、担当部署に「営業管理部」を表示し操作不可能とする
			if (val === clutil.getclsysparam('PAR_AMMS_UNITID_ORI')) {
				$("#div_ca_srchDepartmentID").hide();
				$("#div_ca_srchDepartmentID_ori").show();

				this.utl_department2.setValue(amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_EIGYOU_KANRI);
				clutil.viewReadonly($("#div_ca_srchDepartmentID"));
				clutil.viewReadonly($("#div_ca_srchDepartmentID_ori"));
			} else {

				$("#div_ca_srchDepartmentID").show();
				$("#div_ca_srchDepartmentID_ori").hide();

				clutil.viewRemoveReadonly($("#div_ca_srchDepartmentID"));
				clutil.viewRemoveReadonly($("#div_ca_srchDepartmentID_ori"));
			}

			var dto = this.serialize();

			if (dto.equipManTypeID == 1) {
				// 備品がチェックされた場合
				if (val == 0) {
					// 事業ユニットが選択されていない場合、備品取引先は操作不可
					clutil.inputReadonly('#ca_equipVendID');
				} else {
					// それ以外の場合、備品取引先は操作可能
					clutil.inputReadonly('#ca_equipVendID', false);
				}
			} else if (dto.equipManTypeID == 2) {

				// プレミアム商品がチェックされた場合、備品取引先は操作不可
				clutil.inputReadonly('#ca_equipVendID');
			}

//			if (typeof this.utl_unit.prevValue != 'undefined' &&
//				this.utl_unit.prevValue === clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
//				this.utl_department.setValue(0);
//			}

			this.utl_unit.prevValue = val;
		},

		/**
		 * 備品管理区分のラジオボタンの選択値が変わった
		 */
		_onChangeEquipManType: function(e){
			if (e.target.checked) {
				var val = Number(this.utl_unit.getValue());
				if (val == 0) {
					// 事業ユニットが選択されていない場合、備品取引先は操作不可
					clutil.inputReadonly('#ca_equipVendID');
				} else {
					// 備品がチェックされた場合、備品取引先は操作可能
					clutil.inputReadonly('#ca_equipVendID', false);
				}
			} else {
				// プレミアム商品がチェックされた場合、備品取引先は操作不可
				clutil.inputReadonly('#ca_equipVendID');
				$("#ca_equipVendID").val('');
			}

		},

		_eof: 'AMEQV0100.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'		: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click #cl_close'			: '_onCloseClick'
			//'change .cl_operStateID'	: '_onOperStateIDChange',
		},

		initialize: function(){
			_.bindAll(this);

			var btns = [
			            	{
			            		opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV,
			            		label: '締対象データ確認'
			            	}
			            ];

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title		: '備品・プレミアム商品',
				subtitle	: '発注締処理（随時）',
				btn_new		: false,
				btn_csv		: false,
				btns_dl		: btns
//				btn_submit	: true,
//				btn_cancel	: true,
//				btn_cancel	: this._doCancel,

			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMEQV0100 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMEQV0100';

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

			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}

			// 下部ボタン群は非表示にする
			$("#mainColumnFooter").hide();

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
				AMEQV0100GetReq: srchReq
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
			if(groupid !== 'AMEQV0100'){
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
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMEQV0100', srchReq).done(_.bind(function(data){

				// データ取得
				var recs = data.AMEQV0100GetRsp.equipOrderList;

				if (_.isEmpty(recs)) {
					// エラーメッセージ表示
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

					mainView.srchAreaCtrl.reset();

					// フォーカス設定
					this.resetFocus(this.srchCondView.$tgtFocus);
				} else {
					var i=0;
					$.each(recs,function(){
						this.departmentDispName = clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_DEPART_TYPE, this.departmentID);
						this.senderTypeDispName = clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_SENDER_TYPE, this.senderTypeID);

						// 備品取引先をセットする
						if (recs[i].vendorID <= 0) {
							// 備品取引先が取得できなかった場合は空白とする
							this.vendorDispName = "";
						} else {
							this.vendorDispName = recs[i].vendorCode + ":" + recs[i].vendorName;
						}
						this.orderFuncTypeDispName = clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_ORDER_TYPE, this.orderFuncTypeID);
						this.countStatusDispName = clutil.gettypename(amcm_type.AMCM_TYPE_OPER_STATE, this.countStatus);

						i++;
					});

					// リクエストを保存。
					this.savedReq = srchReq;

					// 結果ペインを表示
					this.srchAreaCtrl.show_result();

					// 内容物がある場合 --> 結果表示する。
					this.recListView.setRecs(recs);

					// 下部ボタン群は表示する
					$("#mainColumnFooter").show();

					// 発注締め状態のコンボボックスを設定する
					this.utl_operState = [];
					this.$("#ca_table_tbody").find("tr").each(function(){
						mainView.setOperState($(this));

						var $tgt = $(this).find("div").filter(function(index){
							//return $(this).hasClass('cl_operStateID');
							return $(this).hasClass('combobox-wrap');
						});

						$tgt.each(function(){
							$(this).css('margin', '0');
							$(this).css('width', '100%');
							$(this).find("input").css('width', '85%');
							$(this).find("button").css('width', '100%');
						});
					});

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

				mainView.srchAreaCtrl.reset();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				// フォーカスの設定
				this.resetFocus();

			}, this));

			return defer;
		},

		setOperState : function($tr){
			return $tr

			.find('select[name="operStateID"]')
			.each(function(){
				var selector = clutil.cltypeselector(this, amcm_type.AMCM_TYPE_OPER_STATE);
				var chkVal = $(this).data().chkval;
				selector.setValue(chkVal);
				mainView.utl_operState.push(selector);
			}).end();
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
			var defer = clutil.postDLJSON('AMEQV0100', srchReq);
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

			// 下部ボタン群は表示しない
			$("#mainColumnFooter").hide();
		},

		/**
		 * 締め処理ボタン押下
		 */
		_onCloseClick: function(e) {
			var req = this.savedReq;
			var equipOrder = clutil.tableview2data(this.$('#ca_table_tbody').children());
			var equipOrderList = [];

			$.each(equipOrder,function(){
				if (typeof this.operStateID != 'undefined') {
					this.countStatus = this.operStateID;
				}
				if (this.operStateID == amcm_type.AMCM_VAL_OPER_STATE_OPERATED) {
					equipOrderList.push(this);
				}
			});

			if(equipOrderList.length == 0) {
				this.validator.setErrorHeader(clmsg.WEQ0001);
				return;
			}

			req.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
			req.AMEQV0100UpdReq = { equipOrderList: equipOrder };

			// 要求を送出
			var defer = clutil.postJSON('AMEQV0100', req).done(_.bind(function(data){

				// 再検索
				req.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
				this.doSrch(req);

			}, this)).fail(_.bind(function(data){
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
			}, this));

			return defer;
		},

		/**
		 * 発注締め状態変更
		 */
		_onOperStateIDChange: function(e) {
			var unSelected = false;
			var hasItem = false;

			$.each(this.utl_operState, function(){
				var val = this.getValue();

				if (val == 0) {
					unSelected = true;
				} else if (val == amcm_type.AMCM_VAL_OPER_STATE_OPERATED) {
					hasItem = true;
				}
			});

			if (unSelected) {
				mainView.$('#cl_close').attr('disabled', true);
			} else {
				if (hasItem) {
					mainView.$('#cl_close').attr('disabled', false);
				} else {
					mainView.$('#cl_close').attr('disabled', true);
				}
			}
		},


		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex, e) {
			if($(e.currentTarget).find('select').length > 0){
				return;
			}

			//var url = clcom.appRoot + '/AMEQ/AMEQV0120/AMEQV0120.html';

			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					btnId: e.target.id,
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMEQV0100GetReq,
					selectedIds: this.recListView.getSelectedIdList(),
					chkData: this.recListView.getSelectedRecs()
				};
				destData = {
					opeTypeId: rtyp,
					srchDate: this.savedReq.srchDate,
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
					opeTypeId: rtyp
				};
			}

//			var pushPageOpt = {
//				url		: url,
//				args	: destData,
//				saved	: myData
//			};

			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				// データが無くても可
				clcom.pushPage(pushPageOpt);
				break;

//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
//				var lastClickedRec = this.recListView.getLastClickedRec();
//				if(_.isEmpty(lastClickedRec)){
					// 最後にクリックした行データがとれなかった
//					console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
//					return;
//				}
				// クリック行の内容を画面遷移引数にセット
//				destData.chkData = [ lastClickedRec ];
//				pushPageOpt.newWindow = true;
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

			srchReq.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV;

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMEQV0100', srchReq);
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

		_eof: 'AMEQV0100.MainView//'
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
