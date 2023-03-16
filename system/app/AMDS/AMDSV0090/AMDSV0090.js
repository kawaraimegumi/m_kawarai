// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,
		events: {
			// アコーディオンのアクション制御はここでするかなー？
//			'change #ca_unitID'				: '_onUnitChanged',		// 事業ユニットが変更された
//			'click #ca_btn_store_select'	: '_onStoreBtnClick',	// 店舗選択
			'change #ca_stopType'			: '_onStopTypeChanged',	// 区分が変更された
		},

		/**
		 * 下部の「一覧に戻る」ボタンアクションの定義
		 */
		mdBaseViewOnCancelClick: function(e){
			// returnValue: 呼び出し元の一覧画面へデータを渡すには、
			/// popPage(returnValue) 第１引数でデータを渡す。
			// 戻った側の一覧画面では、clcom.returnValue に returnValue がセットされる。
			var returnValue = {
				chkData: this.options.chkData,
			};
			this.mdBaseView._ConfirmLeaving(function(){
				clcom.popPage(returnValue);
			});
		},

		initialize: function(opt){
			_.bindAll(this);

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
					btn_cancel: (o.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD)
					? this.mdBaseViewOnCancelClick : undefined,
					title: '自動振分停止期間',
					//subtitle: '登録・修正',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// それ以外は、Submit と、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			// 自動振分停止期間
//			clutil.datepicker(this.$("#ca_stopStDate"));
//			this.$("#ca_stopStDate").datepicker('setIymd');
			clutil.datepicker(this.$("#ca_stopEdDate"));
			this.$("#ca_stopEdDate").datepicker('setIymd');
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				// 更新データセット
				if (args.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
					var pgIndex = args.index;
					var rec = args.data.AMDSV0090GetRsp.record;
					this.options.chkData[pgIndex].storeID = rec.storeID;	// 店舗ID
					this.options.chkData[pgIndex].itgrpID = rec.itgrpID;	// 品種ID
					this.options.chkData[pgIndex].stopStDate = rec.stopStDate;	// 自動振分停止期間開始日
				}
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[args.data.rspHead.message], args.data.rspHead.args)});
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}

			var data = args.data;

			console.log(args.status);
			console.log(this.options.opeTypeId);
			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);

				// 編集可の状態にする。
				clutil.viewRemoveReadonly($("#ca_base_form"));

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
					this.setReadOnlyAllItems();
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
					this.fieldRelation.done(_.bind(function(){
						this.AMPAV0010Selector.clear();
						this._onStopTypeChanged();
					}, this));
					clutil.setFocus($("#ca_unitID"));
					break;
				default:
					this.fieldRelation.done(_.bind(function(){
						clutil.viewReadonly($("#div_ca_unitID"));
//						clutil.inputReadonly($("#ca_storeID"));
//						clutil.inputReadonly($("#ca_btn_store_select"));
//						clutil.inputReadonly($("#ca_itgrpID"));
						this._onStopTypeChanged();
					}, this));

					clutil.setFocus($("#ca_storeID"));
					break;
				}

				break;

			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 確認：画面は何を表示するのか？？？						【確認】
				this.data2view(data);

				// 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		data2view: function(data){
			this.saveData = data.AMDSV0090GetRsp;
			var rec = data.AMDSV0090GetRsp.record;

			rec.unitID = this.unitID;
			rec.itgrpID = {
				id: rec.itgrpID,
				code: rec.itgrpCode,
				name: rec.itgrpName,
			};
			rec.storeID = {
				id: rec.storeID,
				code: rec.storeCode,
				name: rec.storeName
			};
			clutil.data2view(this.$('#ca_base_form'), rec);
//			this.storeAutocomplete = this.getOrg(rec.unitID);
//			this.storeAutocomplete.setValue({
//				id: rec.storeID,
//				code: rec.storeCode,
//				name: rec.storeName
//			});
		},

		setReadOnlyAllItems: function(){
			this.fieldRelation.done(function(){
				clutil.viewReadonly($('#ca_base_form'));
			});
		},

		// 初期データ取得後に呼ばれる関数
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
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					_this.fieldRelation.set('clorgcode', {id: id, code: code, name: name});
					_this.fieldRelation.reset();
				} else {
					var chk = $("#ca_storeID").autocomplete("clAutocompleteItem");
					if (chk == null || chk.id == 0)  {
						_this.AMPAV0010Selector.clear();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
			this.AMPAV0010Selector.clear = function() {
				_this.fieldRelation.set('clorgcode', {id: 0, code: '', name: ''});
				_this.fieldRelation.reset();
			};

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 検索日
				datepicker: {
					el: "#ca_stopStDate",
					initValue: 0
				},
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID",
					initValue: clcom.userInfo.unit_id
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_itgrpID",
				},
				// 店舗オートコンプリート
				clorgcode: {
					el: '#ca_storeID',
					addDepends: ['p_org_id'],
					dependSrc: {
						p_org_id: 'unit_id'
					}
				},
				// 店舗参照ボタン
				AMPAV0010: {
					button: this.$('#ca_btn_store_select'),
					view: this.AMPAV0010Selector,
					showOptions: function(){
						return {
							org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
						};
					}
				},
			}, {
				dataSource: {
					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});

			// 停止理由区分selector
			clutil.cltypeselector(this.$("#ca_stopType"), amcm_type.AMCM_TYPE_STORE_BUILD_TYPE, 1);

			// 初期のアコーディオン展開状態をつくる。 <<？

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			this.AMPAV0010Selector.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.setFocus($('#ca_storeID'));
				}
				else{
					clutil.setFocus($('#ca_unitID'));
				}
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		/**
		 * 事業ユニットが変更されたイベント
		 *  ⇒ 品種コードオートコンプリートの内部設定値をクリアする。
		 */
		_onUnitChanged: function(e){
			//console.log(e);
			if(this.deserializing){
				// データセット中
				return;
			}
			var unitID = Number($("#ca_unitID").val());
			this.getOrg(unitID);
			this.storeAutocomplete.setValue();
			this.$("#ca_storeID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_store_select").attr("disabled", (unitID == 0));
			this.AMPAV0010Selector.clear();
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
//		_onStoreBtnClick: function(e){
//			var unitID = Number($("#ca_unitID").val());
//			var options = {
//				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
//				org_id : (unitID == 0) ? 3 : unitID,
//			};
//			this.AMPAV0010Selector.show(null, null, options);
//		},

		/**
		 * 店舗オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: $("#ca_storeID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				},
				initValue : {
//					code : clcom.userInfo.org_code,
//					id : clcom.userInfo.org_id,
//					name : clcom.userInfo.org_name,
				}
			});
		},

		/**
		 * 区分が変更されたイベント
		 *  ⇒ 閉店の場合に自動振分停止期間終了日を入力不可にする。
		 */
		_onStopTypeChanged: function(e){
			//console.log(e);
			var stopType = Number($("#ca_stopType").val());
			if (stopType == amcm_type.AMCM_VAL_STORE_BUILD_TYPE_CLOSED) {
				$("#ca_stopEdDate").removeClass("cl_required");
				clutil.inputReadonly($('#ca_stopEdDate'));
				$('#ca_stopEdDate').datepicker("setIymd");
			} else {
				clutil.inputRemoveReadonly($('#ca_stopEdDate'));
				$("#ca_stopEdDate").addClass("cl_required");
			}
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			console.log(this.options);
			// 事業ユニットを保存
			this.unitID = this.options.chkData[pgIndex].unitID;
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 自動振分停止期間検索リクエスト
				AMDSV0090GetReq: {
					srchStoreID: this.options.chkData[pgIndex].storeID,	// 店舗ID
					srchItgrpID: this.options.chkData[pgIndex].itgrpID,	// 品種ID
					srchDate: this.options.chkData[pgIndex].stopStDate	// 自動振分停止期間開始日
				},
				// 自動振分停止期間更新リクエスト
				AMDSV0090UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMDSV0090',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			// validation
			this.validator.clear();

			if(!this.validator.valid()) {
				return null;
			}

			var f_error = false;
			var ope_date = clcom.getOpeDate();
			var $stopStDate = this.$("#ca_stopStDate");
			var stopStDate = clutil.dateFormat($stopStDate.val(), "yyyymmdd");
			var recstopStDate = null;
//			var recstopEdDate = null;

			if (this.chkData !== undefined && this.chkData.length > 0){
				recstopStDate = this.chkData[this.chkDataIndex].stopStDate;
//				recstopEdDate = this.chkData[this.chkDataIndex].stopEdDate;
			}

			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				if (stopStDate <= ope_date) {
					// 開始日が運用日以前の場合はエラー
					this.validator.setErrorHeader(clmsg.cl_st_date_min_opedate);
					this.validator.setErrorMsg($stopStDate, clmsg.cl_st_date_min_opedate);
					f_error = true;
				}
				break;

//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
//				var compstopStDate = ope_date < recstopStDate ? recstopStDate : ope_date;
//				var msg = ope_date > recstopStDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
//
//				if (stopStDate <= compstopStDate && recstopEdDate == clcom.max_date && stopStDate != recstopStDate){ // 未来予約可能で修正でない状態で開始日が明日以降でない
//					this.validator.setErrorHeader(msg);
//					this.validator.setErrorMsg($stopStDate, msg);
//					f_error = true;
//				}
//				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				if (stopStDate < recstopStDate){ // 設定開始日が明日以降かつ編集前開始日以降でない
					var msg = ope_date >= recstopStDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
					this.validator.setErrorHeader(msg);
					this.validator.setErrorMsg($stopStDate, msg);
					f_error = true;
				}
				break;

			default:
				break;
			}
			if(f_error){
				return null;
			}

			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_stopStDate',
				edval : 'ca_stopEdDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				f_error = true;
			}
			if(f_error){
				return null;
			}

			// 画面入力値をかき集めて、Rec を構築する。
			var record = clutil.view2data(this.$('#ca_base_form'));

			var opeTypeId = (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) ?
					am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW : this.options.opeTypeId;

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: opeTypeId,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 自動振分停止期間検索リクエスト
				AMDSV0090GetReq: {
				},
				// 自動振分停止期間更新リクエスト
				AMDSV0090UpdReq: {
					record: record
				}
			};

			return {
				resId: clcom.pageId,	//'AMDSV0090',
				data: updReq
			};
		},

		_eof: 'AMDSV0090.MainView//'
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
