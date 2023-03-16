// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,
		events: {
//			'change #ca_unitID'				: '_onUnitChanged',		// 事業ユニット区分
//			'click #ca_btn_store_select'	: '_onStoreSelClick',	// 店舗選択
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
					title: '客注禁止',
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

			// アプリ個別の View や部品をインスタンス化するとか・・・

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
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

			// 適用期間
			clutil.datepicker(this.$("#ca_fromDate"));
			clutil.datepicker(this.$("#ca_toDate"));

			// Fieldlimit
			clutil.cltxtFieldLimit($("#ca_reason"));

			return this;
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
					var rec = args.data.AMMSV0300GetRsp.rec;
					this.options.chkData[pgIndex].id = rec.storeID;	// 店舗ID
					this.options.chkData[pgIndex].stopStartDate	= rec.fromDate;	// 客注禁止開始日
				}
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'DELETED':		// 別のユーザによって削除された
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

			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);

				// 編集可の状態にする。
				clutil.viewRemoveReadonly(this.$(".ca_fromDate_div"));
				clutil.viewRemoveReadonly(this.$(".ca_toDate_div"));
				clutil.inputRemoveReadonly($("#ca_reason"));

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
					this.setReadOnlyAllItems();
					break;
				default:
					this.fieldRelation.done(_.bind(function(){
						clutil.viewReadonly($("#div_ca_unitID"));
						clutil.inputReadonly($("#ca_storeID"));
						clutil.inputReadonly($("#ca_btn_store_select"));
					}, this));
					clutil.setFocus(this.$("#ca_fromDate"));
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
				// 画面表示する
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
				break;
			}
		},

		data2view: function(data){
			this.saveData = data.AMMSV0300GetRsp;
			var rec = data.AMMSV0300GetRsp.rec;

			rec.storeID = {
				id: rec.storeID,
				code: rec.storeCode,
				name: rec.storeName,
			};
			clutil.data2view(this.$('#ca_base_form'), rec);
		},

		setStoreData2View: function($view, rec){
			this.storeAutocomplete.setValue({
				id: rec.storeID,
				code: rec.storeCode,
				name: rec.storeName
			});
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
					$('#ca_storeID').autocomplete('clAutocompleteItem', {id: id, code: code, name: name});
				} else {
					var chk = $('#ca_storeID').autocomplete('clAutocompleteItem');
					if (chk === null || chk.length == 0) {
						_this.AMPAV0010Selector.clear();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
			this.AMPAV0010Selector.clear = function() {
				if (typeof mainView != "undefined") {
					$('#ca_storeID').autocomplete('removeClAutocompleteItem');
				}
			};

			// フィールドリレーションの設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				clbusunitselector: {
					el: '#ca_unitID'
				},
				clorgcode: {
					el: '#ca_storeID',
					addDepends: ['p_org_id'],
					dependSrc: {
						// 上位組織を事業ユニットIDで選択されているものに設定する
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
					// 組織階層と組織体系が画面にない場合はここで設定する。
					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			this.AMPAV0010Selector.render();
			this.AMPAV0010Selector.clear();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// 適用期間
				this.$("#ca_fromDate").datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
				this.$("#ca_toDate").datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					// 店舗ユーザー
					this.fieldRelation.done(_.bind(function(){
						$('#ca_storeID').autocomplete('clAutocompleteItem', {
							id: clcom.userInfo.org_id,
							code: clcom.userInfo.org_code,
							name: clcom.userInfo.org_name
						});
						clutil.inputReadonly($("#ca_storeID"));
						clutil.inputReadonly($("#ca_btn_store_select"));
					}, this));
					clutil.setFocus(this.$("#ca_fromDate"));
				} else if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF) {
					this.fieldRelation.done(_.bind(function(){
						var unitID = Number($('#ca_unitID').val());
						if (unitID != 0) {
							clutil.viewReadonly($("#div_ca_unitID"));
						}
					}, this));
					clutil.setFocus(this.$("#ca_storeID"));
				} else {
					this.fieldRelation.done(_.bind(function(){
						var unitID = Number($('#ca_unitID').val());
						this.$("#ca_storeID").attr("readonly", (unitID == 0));
						this.$("#ca_btn_store_select").attr("disabled", (unitID == 0));
					}, this));
					clutil.setFocus(this.$("#ca_unitID"));
				}

//				clutil.setFocus(this.$("#ca_unitID"));

			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		/**
		 * 事業ユニット区分変更時処理
		 */
		_onUnitChanged: function(e){
			if(this.deserializing){
				return;
			}
			var unitID = $(e.target).val();
			if (unitID <= 0) {
				clutil.inputReadonly($("#ca_storeID"));
				$("#ca_btn_store_select").attr('disabled', true);
			} else {
				clutil.inputRemoveReadonly($("#ca_storeID"));
				$("#ca_btn_store_select").removeAttr('disabled');
			}
			if (typeof mainView != "undefined") {
				mainView.AMPAV0010Selector.clear();
			}
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){
			var options = {
				editList : null,
				isSubDialog : null,
				func_id : 1,
				org_id : Number($("#ca_unitID").val()),
//				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE, am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER, am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
			};
			this.AMPAV0010Selector.show(null, null, options);
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			console.log(this.options.chkData[pgIndex]);
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 客注禁止検索リクエスト
				AMMSV0300GetReq: {
					srchID: this.options.chkData[pgIndex].id,	// 店舗ID
					srchDate: this.options.chkData[pgIndex].stopStartDate	// 客注禁止開始日
				},
				// 客注禁止更新リクエスト
				AMMSV0300UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMMSV0300',
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
			var $fromDate = this.$("#ca_fromDate");
			var fromDate = clutil.dateFormat($fromDate.val(), "yyyymmdd");
			var recfromDate = null;
//			var rectoDate = null;

			if (this.chkData !== undefined && this.chkData.length > 0){
				recfromDate = this.chkData[this.chkDataIndex].fromDate;
//				rectoDate = this.chkData[this.chkDataIndex].toDate;
			}

			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				if (fromDate <= ope_date) {
					// 開始日が運用日以前の場合はエラー
					this.validator.setErrorHeader(clmsg.cl_st_date_min_opedate);
					this.validator.setErrorMsg($fromDate, clmsg.cl_st_date_min_opedate);
					f_error = true;
				}
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				var compfromDate = ope_date < recfromDate ? recfromDate : ope_date;
				var msg = ope_date > recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;

				if (fromDate <= compfromDate && fromDate != recfromDate){ // 未来予約可能で修正でない状態で開始日が明日以降でない
					this.validator.setErrorHeader(msg);
					this.validator.setErrorMsg($fromDate, msg);
					f_error = true;
				}
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				if (fromDate <= ope_date){ // 設定開始日が明日以降でない
					var msg = clmsg.cl_st_date_min_del;
					this.validator.setErrorHeader(msg);
					this.validator.setErrorMsg($fromDate, msg);
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
				stval : 'ca_fromDate',
				edval : 'ca_toDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				f_error = true;
			}
			if(f_error){
				return null;
			}

			// 画面入力値をかき集めて、Rec を構築する。
			var rec = clutil.view2data(this.$('#ca_base_form'));

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				rec.recno = "";
				rec.state = 0;
			}

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: this.options.opeTypeId,
					recno: rec.recno,
					state: rec.state
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 客注禁止検索リクエスト
				AMMSV0300GetReq: {
				},
				// 客注禁止更新リクエスト
				AMMSV0300UpdReq: {
					rec: rec
				}
			};

			// 前回取得時と比較、同一内容ならば、メッセージを表示して、Null を渡す。
			// ＜検討＞
			// FW 側で、編集用に GET してきたデータの複製を保持しているので、
			// 同一内容チェックは、FW へ追い出しできるかも・・・
			// 問題点：
			//  [1] 編集用に GET してきたデータを独自拡張されると、一致しなくなる。
			// 		⇒ 命名規約 '_' からはじまるプロパティ「_name」は比較対象にしない、、、とすることも可。
			//  [2] data2view とか、view2data とかで、<input hidden id="ca_xxxx"> 等のテクのために、
			//      余分なフィールドが紛れないか？？？  たぶん、「_name」命名規約に準拠できない気がする。
			//  [3] この、_buildSubmitReqFunction では、プロトコル規定以外の余計なメンバを付加しない約束にする？
			//  [4] FW で保持しているキャッシュデータを返す API を用意するので、比較はアプリ層でやってね。ということにする？

			// Null を渡すと、Ajax 呼び出しを Reject したものと FW 側では見なします。

			//return null;

			return {
				resId: clcom.pageId,	//'AMMSV0300',
				data: updReq
			};
		},

		_eof: 'AMMSV0300.MainView//'
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
