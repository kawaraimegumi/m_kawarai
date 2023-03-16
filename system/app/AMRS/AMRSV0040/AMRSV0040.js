useSelectpicker2();

$(function() {

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		validator : null,

		// Events
		events : {
			'change #ca_offsetTypeID': '_onOffsetTypeIDChange',		// 補正相殺区分変更
		},

		initialize: function(opt) {
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
					title: '補正相殺項目マスタ',
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

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			// アプリ個別の View や部品をインスタンス化するとか・・・

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
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}
			this.opeTypeId = fixopt.opeTypeId;	// 処理区分を保存
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.mdBaseView.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			var data = args.data;
			var offsetItem = data.getRsp.offsetItem;

			// 全てを入力可にする
			clutil.viewRemoveReadonly($("#ca_form"));

			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				clutil.data2view(this.$("#ca_form"), offsetItem);
				$("#ca_offsetTypeID").trigger('change');	// 変更イベントを飛ばしておく

				switch (this.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					// 事業ユニットは入力不可
					clutil.inputReadonly(this.$('#ca_unitID'));
					// コードは入力不可
					clutil.inputReadonly(this.$('#ca_offsetItemCode'));
					// 初期フォーカスは名称
					this.resetFocus($("#ca_offsetItemName"));
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					clutil.viewReadonly($("#ca_form"));
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
					clutil.viewReadonly($("#ca_form"));
					break;
				}

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), offsetItem);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), offsetItem);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function() {
			this.mdBaseView.initUIElement();

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'), 1);

			// 補正相殺区分
			clutil.cltypeselector(this.$("#ca_offsetTypeID"), amcm_type.AMCM_TYPE_OFFSET_TYPE, 1);

			// 科目区分
			clutil.cltypeselector(this.$("#ca_accTypeID"), amcm_type.AMCM_TYPE_ACC_TYPE, 1);

			// カウンタ設置 #20140324
			clutil.cltxtFieldLimit($("#ca_offsetItemCode"));
			clutil.cltxtFieldLimit($("#ca_offsetItemName"));

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();

			this.mdBaseView.fetch();	// データを GET してくる。
			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// 新規の場合は、初期フォーカスを事業ユニットにする
				var $tgt = null;
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					$tgt = $("#ca_offsetItemCode");
				}
				else{
					$tgt = $("#ca_unitID").next().children('input');
				}
				this.resetFocus($tgt);
			}
			return this;
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			//console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var chkData = this.options.chkData[pgIndex];
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ		・・・これ、必要なの？					【確認】
				reqPage: {
				},
				// 取引先マスタ検索リクエスト
				getReq: {
					srchOffsetItemID: chkData.offsetItemID,		// 補正相殺項目ID
					delFlag : chkData.delFlag					// 削除(参照)フラグ
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				updReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMRSV0040',
				data: getReq
			};
		},

		/**
		 * 入力チェック
		 */
		isValid: function() {
			var f_valid = true;
			this.validator.clear($("#ca_form"));
			if (!this.validator.valid()) {
				f_valid = fasle;
			}
			var offsetTypeID = $('#ca_offsetTypeID').val();
			var price = $("#ca_price").val();
			if (offsetTypeID == amcm_type.AMCM_VAL_OFFSET_TYPE_NUMBER) {
				if (price == "" || price == 0) {
					this.validator.setErrorHeader(clmsg.cl_echoback);
					this.validator.setErrorMsg($('#ca_price'), clmsg.ERS0005);
					f_valid = fasle;
				}
			}

			return f_valid;
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			// 入力チェック
			if (!this.isValid()) {
				return null;
			}

			// 画面入力値をかき集めて、Rec を構築する。
			var offsetItem = clutil.view2data($("#ca_form"));

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: opeTypeId,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
				getReq: {
				},
				// 商品分類マスタ更新リクエスト
				updReq: {
					offsetItem: offsetItem,
				},
			};
			return {
				resId: clcom.pageId,
				data:  updReq,
			};
		},

		/**
		 * 補正相殺区分変更イベント
		 * @param e
		 */
		_onOffsetTypeIDChange: function(e) {
			var $tgt = $(e.target);
			var val = $tgt.val();
			if (val == amcm_type.AMCM_VAL_OFFSET_TYPE_NUMBER) {
				// 件数入力の場合は「単価」を必須入力にする
				this.$("#ca_price").addClass('cl_valid cl_required');
				this.$("#div_ca_price").addClass('required');
			} else {
				this.$("#ca_price").removeClass('cl_required');
				this.$("#div_ca_price").removeClass('required');
			}
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			}
		},

		_eof: 'AMRSV0040.MainView//'
	});

	////////////////////////////////////////////////

	// 初期データを取る
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