useSelectpicker2();

$(function(){
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,
		events: {
			// イベント
		},

		initialize: function(opt){
			_.bindAll(this);

			var isChild = false;
			if (opt != null && opt.opeTypeId){
				isChild = true;
			}

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});

			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '取引先マスタ（備品）',
					//subtitle: '登録・修正',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					btn_cancel: (o.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && !isChild)
							? this._doCancel : true,
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			}
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){
			this.mdBaseView.commonHeader._onBackClick(e);
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				this.setReadOnlyAllItems();
				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				if (args.data.rspHead.fieldMessages){
					$.each(args.data.rspHead.fieldMessages, function() {
						mainView.validator.setErrorMsg($('#ca_' + this.field_name), clmsg[this.message]);
					});
				}
				break;
			}

			this.doClear = true;
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){

			var data = args.data;
			var getRsp = data.AMEQV0020GetRsp;

			var setReadOnly = false;

			switch(args.status){
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				this.doClear = true;
				setReadOnly = true;
				// FallThrough

			case 'OK':
				var ope_date = clcom.getOpeDate();
				var apply_date = clutil.addDate(ope_date, 1);

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					if (getRsp.equipVend.fromDate < apply_date){
						getRsp.equipVend.fromDate = apply_date;
					}
					clutil.setFocus($('#ca_fromDate'));
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					clutil.viewReadonly(this.$(".ca_fromDate_div"));
					clutil.inputReadonly($("#ca_equipVendCode"));
					clutil.inputReadonly($("#ca_equipVendName"));
					clutil.inputReadonly($("#ca_senderTypeID"));

					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					clutil.inputReadonly($("#ca_equipVendCode"));
					clutil.inputReadonly($("#ca_equipVendName"));
					clutil.inputReadonly($("#ca_senderTypeID"));

					if (getRsp.equipVend.fromDate < apply_date){
						getRsp.equipVend.fromDate = apply_date;
					} else {
						getRsp.equipVend.fromDate = clutil.addDate(getRsp.equipVend.fromDate, 1);
					}
					break;

				default:
					// 画面遷移時初期フォーカス
					clutil.setFocus($('#ca_equipVendName'));
				}

				// TODO: args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$('#ca_base_form'), getRsp.equipVend);

				// 編集不可の状態にする。
				clutil.viewReadonly($("#div_ca_unitID"));
				clutil.inputReadonly($("#ca_equipVendCode"));

				this.fixedLimit();

				if (setReadOnly) {
					this.setReadOnlyAllItems();
				}

				break;

			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			}
		},

		setReadOnlyAllItems: function(){
			clutil.viewReadonly($("#ca_base_form"));
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			// 事業ユニット
			this.utl_unit = clutil.clbusunitselector({
				el: '#ca_unitID',
				initValue: clcom.userInfo.unit_id,
			});

			// 発送元
			this.utl_senderType = clutil.cltypeselector({
				el: '#ca_senderTypeID',
				kind: amcm_type.AMCM_TYPE_EQUIP_SENDER_TYPE,
	    	});

			// 適用期間
			this.utl_fromDate = clutil.datepicker(this.$("#ca_fromDate"));
			this.utl_toDate = clutil.datepicker(this.$("#ca_toDate"));

			this.utl_fromDate.datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));

			this.setInitializeValue();
			this.setDefaultEnabledProp();
			this.fixedLimit();

			clutil.setFocus($('#ca_fromDate'));

			return this;
		},

		setInitializeValue: function(){
		},

		setDefaultEnabledProp: function(){
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.viewReadonly("#div_ca_unitID");
			}

			// 表示状態設定
			clutil.viewReadonly(this.$(".ca_toDate_div"));

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
				$('#div_ca_toDate').hide();
				$('#pFromTo').text('削除日');

				// ツールチップ
				$("#ca_tp_del").tooltip({html: true});

			}else{
				// ツールチップ
				$('#ca_tp_del').hide();
			}
		},

		fixedLimit: function(){
			clutil.cltxtFieldLimit($("#ca_equipVendCode"));
			clutil.cltxtFieldLimit($("#ca_equipVendName"));
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				$('#ca_toDate').datepicker('setIymd', clcom.max_date);
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			if (typeof this.doClear != 'undefined'){
				clutil.viewRemoveReadonly($('#ca_base_form'));
				this.setDefaultEnabledProp();
			}

			this.chkDataIndex = pgIndex;

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMEQV0020GetReq: {
					srchUnitID: this.options.chkData[pgIndex].unitID,			// 事業ユニットID
					srchEquipVendID: this.options.chkData[pgIndex].equipVendID,	// 備品取引先ID
					srchDate: this.options.chkData[pgIndex].fromDate			// 適用開始日
				},
				// 更新リクエスト
				AMEQV0020UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMEQV0020',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){

			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL &&
				this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				if(!this.validator.valid()) {
					return null;
				}
			}

			var hasError = false;
			var ope_date = clcom.getOpeDate();
			var fromDate = clutil.dateFormat(this.utl_fromDate.val(), "yyyymmdd");
			var recfromDate = null;
			var rectoDate = null;

			var chkData = this.options.chkData;
			if (chkData !== undefined && chkData.length > 0 &&
					typeof this.chkDataIndex != 'undefined'){
				recfromDate = chkData[this.chkDataIndex].fromDate;
				rectoDate = chkData[this.chkDataIndex].toDate;
			}

			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				if (fromDate <= ope_date) {
					// 開始日が運用日以前の場合はエラー
					this.validator.setErrorHeader(clmsg.cl_st_date_min_opedate);
					this.validator.setErrorMsg(this.utl_fromDate, clmsg.cl_st_date_min_opedate);
					hasError = true;
				}
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				var compfromDate = ope_date < recfromDate ? recfromDate : ope_date;
				var msg = ope_date > recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;

				if (fromDate <= compfromDate && rectoDate == clcom.max_date && fromDate != recfromDate){ // 未来予約可能で修正でない状態で開始日が明日以降でない
					this.validator.setErrorHeader(msg);
					this.validator.setErrorMsg(this.utl_fromDate, msg);
					hasError = true;
				}
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				if (fromDate <= ope_date || fromDate <= recfromDate){ // 設定開始日が明日以降かつ編集前開始日以降でない
					var msg = ope_date >= recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
					this.validator.setErrorHeader(msg);
					this.validator.setErrorMsg(this.utl_fromDate, msg);
					hasError = true;
				}
				break;

			default:
				break;
			}
			if(hasError){
				return null;
			}

			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_fromDate',
				edval : 'ca_toDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				hasError = true;
			}
			if(hasError){
				return null;
			}

			// Recを構築する。
			var equipVend = clutil.view2data(this.$('#ca_base_form'));

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				equipVend.recno = "";
				equipVend.state = 0;
				equipVend.equipVendID = 0;
			}

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: this.options.opeTypeId,
					recno: equipVend.recno,
					state: equipVend.state
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// マスタ検索リクエスト
				AMEQV0020GetReq: {
				},
				// マスタ更新リクエスト
				AMEQV0020UpdReq: {
					equipVend: equipVend
				}
			};
//return null;
			return {
				resId: clcom.pageId,	//'AMEQV0020',
				data: updReq
			};
		},

		_eof: 'AMEQV0010.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////

		// 一覧画面からの引継データ pageArgs があれば渡す。
		//	pageArgs: {
		//		// 機能種別
		//		opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL,
		//		// 一覧画面で選択されたアイテム要素の配列
		//		chkData: [
		//			{id:1,code:'code-001',name:'item-001',},
		//			{id:2,code:'code-002',name:'item-002',},
		//			{id:3,code:'code-003',name:'item-003',}
		//		]
		//	};
		mainView = new MainView(clcom.pageArgs).initUIElement().render();
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
