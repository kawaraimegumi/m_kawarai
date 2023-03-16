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
			// XXX アコーディオンのアクション制御はここでするかなー？
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
					title: 'モデル',
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

			// TODO:アプリ個別の View や部品をインスタンス化するとか・・・

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			// validatorエラー時の表示領域
			this.validator1 = clutil.validator($("#ca_base_form"), {
				echoback : $('.cl_echoback')
			});

			// 適用期間
			clutil.datepicker(this.$("#ca_stDate"));
			this.$("#ca_stDate").datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
			clutil.datepicker(this.$("#ca_edDate"));
			this.$("#ca_edDate").datepicker('setIymd', clcom.max_date);
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				// TODO: args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// TODO: args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// TODO: 入力値エラー情報が入っていれば、個別 View へセットする。
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});

				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}

			var data = args.data;
			var getRsp = data.AMPOV0090GetRsp;
			this.setReadOnlyAllItems(false);
			switch(args.status){
			case 'OK':
				// TODO: args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$('#ca_base_form'), getRsp.model);

				// TODO: 編集可の状態にする。
				clutil.viewReadonly($("#div_ca_unitID"));
				clutil.inputReadonly($("#ca_ｃode"));

				var ope_date = clcom.getOpeDate();
				var $stDate = this.$("#ca_stDate");
				var stDate = clutil.dateFormat($stDate.val(), "yyyymmdd");
				var startDate = null;

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					clutil.viewReadonly(this.$(".ca_stDate_div"));
					clutil.viewReadonly(this.$(".ca_edDate_div"));
					clutil.viewReadonly(this.$(".ca_unitID_div"));
					clutil.viewReadonly(this.$(".ca_poTypeID_div"));
					clutil.inputReadonly($("#ca_code"));
					clutil.inputReadonly($("#ca_name"));
					startDate = stDate;
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					//clutil.viewReadonly(this.$(".ca_stDate_div"));
					clutil.viewReadonly(this.$(".ca_stDate_div"));
					clutil.viewReadonly(this.$(".ca_edDate_div"));

					clutil.viewReadonly(this.$(".ca_unitID_div"));
					clutil.viewReadonly(this.$(".ca_poTypeID_div"));
					clutil.inputReadonly($("#ca_code"));
					clutil.inputReadonly($("#ca_name"));

//					if (stDate <= ope_date) {
//						startDate = clutil.addDate(ope_date, 1);
//					} else {
//						startDate = clutil.addDate(stDate, 1);
//					}
					break;

				default:
					clutil.viewReadonly(this.$(".ca_unitID_div"));
					clutil.viewReadonly(this.$(".ca_poTypeID_div"));
					clutil.inputReadonly($("#ca_code"));
					clutil.setFocus($('#ca_name'));
					break;
				}

				if (startDate != null) {
					$stDate.datepicker('setIymd', startDate);
				} else {
//					if (stDate <= ope_date) {
//						$stDate.datepicker('setIymd', clutil.addDate(ope_date, 1));
//					}
				}
				clutil.cltxtFieldLimitReset($("#ca_code"));
				clutil.cltxtFieldLimitReset($("#ca_name"));
				break;

			case 'DONE':		// 確定済
				// TODO: args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$('#ca_base_form'), getRsp.model);
				clutil.cltxtFieldLimitReset($("#ca_code"));
				clutil.cltxtFieldLimitReset($("#ca_name"));
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				clutil.data2view(this.$('#ca_base_form'), getRsp.model);
				clutil.cltxtFieldLimitReset($("#ca_code"));
				clutil.cltxtFieldLimitReset($("#ca_name"));
				// 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$('#ca_base_form'), getRsp.model);
				clutil.cltxtFieldLimitReset($("#ca_code"));
				clutil.cltxtFieldLimitReset($("#ca_name"));
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;

			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			}
		},

		setReadOnlyAllItems: function(readOnly){
			if (readOnly == true){
				clutil.viewReadonly($("#ca_base_form"));
			}else{
				clutil.viewRemoveReadonly($("#ca_base_form"));
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'), 1);

			// ＰＯ種別
			clutil.cltypeselector({$select: this.$("#ca_poTypeID"),
				kind: amcm_type.AMCM_TYPE_PO_CLASS,
				ids:[
				     amcm_type.AMCM_VAL_PO_CLASS_LADYS
				     ],
				     unselectedflag: 1
			}).done(_.bind(function(){
				this.$("#ca_poTypeID").selectpicker('val', amcm_type.AMCM_VAL_PO_CLASS_LADYS);
			}));
			clutil.cltxtFieldLimit($("#ca_code"));
			clutil.cltxtFieldLimit($("#ca_name"));


			// 初期のアコーディオン展開状態をつくる。 <<？

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.$("#ca_unitID").val(clcom.userInfo.unit_id);
			this.mdBaseView.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				$('#ca_edDate').datepicker('setIymd', clcom.max_date);
				//初期フォーカス
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.setFocus(this.$('#ca_poTypeID'));
				}
				else{
					clutil.setFocus(this.$('#ca_unitID'));
				}
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 親ブランド検索リクエスト
				AMPOV0090GetReq: {
					srchID: this.options.chkData[pgIndex].id,	// ID
					//srchDate: this.options.srchDate								// 適用開始日
					srchDate: this.options.chkData[pgIndex].stDate,			// 適用開始日
					delFlag : this.options.chkData[pgIndex].delFlag
				},
				// 親ブランド更新リクエスト
				AMPOV0090UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMPOV0090',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			// validation
			this.validator.clear();

			var f_error = false;
			if(!this.validator1.valid()) {
				f_error = true;
			}
			var ope_date = clcom.getOpeDate();

			// 適用開始日 運用日翌日
			var $stDate = this.$el.find('input[name="stDate"]')
			.each(function(){
				stDate = clutil.dateFormat(this.value, "yyyymmdd");
			});

			// 適用終了日 最大日付
			var $edDate = this.$el.find('input[name="edDate"]')
			.each(function(){
				edDate = clutil.dateFormat(this.value, "yyyymmdd");
			});
			if (stDate > edDate){
				f_error = true;
				this.validator.setErrorMsg( $stDate, clmsg.EGM0013);
				this.validator.setErrorMsg( $edDate, clmsg.EGM0013);
			}
			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				break;

			default:
				break;
			}
			if(f_error){
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return null;
			}

			// 期間反転チェック
//			var chkInfo = [];
//			chkInfo.push({
//				stval : 'ca_stDate',
//				edval : 'ca_edDate'
//			});
//			if(!this.validator.validFromTo(chkInfo)){
//				f_error = true;
//			}
//			if(f_error){
//				return null;
//			}

			// TODO: 画面入力値をかき集めて、Rec を構築する。
			var model = clutil.view2data(this.$('#ca_base_form'));

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				model.recno = "";
				model.state = 0;
				model.id = 0;
			}

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: this.options.opeTypeId,
					recno: model.recno,
					state: model.state
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 親ブランド検索リクエスト
				AMPOV0090GetReq: {
				},
				// 親ブランド更新リクエスト
				AMPOV0090UpdReq: {
					model: model
				}
			};

			// TODO: 前回取得時と比較、同一内容ならば、メッセージを表示して、Null を渡す。
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
				resId: clcom.pageId,	//'AMPOV0090',
				data: updReq
			};
		},

		_eof: 'AMPOV0090.MainView//'
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
