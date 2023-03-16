useSelectpicker2();

$(function() {

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
		},

		/**
		 * 初期化
		 */
		initialize: function() {
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '支払外注工賃',
				subtitle: '一覧出力',
				btn_submit: false,
				btn_csv: false
			});

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function() {
			this.mdBaseView.initUIElement();
			clutil.inputlimiter(this.$el);

			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID"
				},
				clvendorcode: {
					el: "#ca_vendorID",
					dependAttrs: {
						vendor_typeid: amcm_type.AMCM_VAL_VENDOR_CORRECT,
					},
					addDepends:['unit_id'],
				},
			}, {
			});
			this.fieldRelation.done(function() {

			});

//			// 事業ユニット取得
//			clutil.clbusunitselector(this.$('#ca_unitID'), 0);
//
//			// 取引先オートコンプリート
//			clutil.clvendorcode($("#ca_vendorID"), {
//				getVendorTypeId: function() {
//					return amcm_type.AMCM_VAL_VENDOR_CORRECT;	// 補正業者
//				},
//			});

			// 対象月
			clutil.clmonthselector($("#ca_targetYm"), 1, 1, null, null, null, 1, 0, 'd');

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();

			return this;
		},

		changeYM: function(srchReq) {
			var targetYm = Number(srchReq.targetYm);
			var year = Math.floor(targetYm / 100);
			var month = targetYm % 100;
			if (month <= 3) {
				// １～３月の場合は年を調整する
				year += 1;
			}
			srchReq.targetYm = year * 100 + month;
		},

		buildReq: function(rtyp){
			// validation
			if (!this.validator.valid()) {
				return null;
			}

			// リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
//			this.changeYM(srchDto);

			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				cond: srchDto
			};

			return reqDto;
		},

		/**
		 * 表示ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				console.log('CSV 出力');
				this.doCSVDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		doCSVDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMRSV0100', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			}
		},

	});

	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

		//初期フォーカス
		var $tgt = null;
		if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
			$tgt = $("#ca_targetYm").next().children('input');
		}
		else{
			$tgt = $("#ca_unitID").next().children('input');
		}
		mainView.resetFocus($tgt);
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