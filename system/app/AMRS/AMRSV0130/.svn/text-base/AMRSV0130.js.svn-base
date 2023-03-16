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
			'change input[name="ca_srchOutType"]': '_onSrchOutTypeChanged',
		},

		/**
		 * 初期化
		 */
		initialize: function() {
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '補正実績',
				subtitle: '出力',
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

			/*
			 * シスパラ
			 */
			//var PAR_AMCM_YEAR_FROM = Number(clcom.getSysparam(amcm_sysparams.PAR_AMCM_YEAR_FROM));
			//var PAR_AMCM_YEAR_TO = Number(clcom.getSysparam(amcm_sysparams.PAR_AMCM_YEAR_TO));

			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				clvendorcode: {
					el: "#ca_srchVendorID",
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
//			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);
//
//			// 取引先オートコンプリート
//			clutil.clvendorcode($("#ca_srchVendorID"), {
//				getVendorTypeId: function() {
//					return amcm_type.AMCM_VAL_VENDOR_CORRECT;	// 補正業者
//				},
//			});

			// 対象年
			clutil.clyearselector({
				el: $("#ca_srchYear"),
				unselectedflag: true,
				past: null,
				future: null,
				argtext: "年度"
			});

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();

			return this;
		},

		buildReq: function(rtyp){
			// validation
			if (!this.validator.valid()) {
				return null;
			}

			// リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));

			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				rtype: rtyp,
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
			var defer = clutil.postDLJSON('AMRSV0130', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 出力タイプ変更処理
		 * @param e
		 */
		_onSrchOutTypeChanged: function(e) {
			var $tgt = $(e.target);
			if (!$tgt.prop('checked')) {
				return;
			}
			var val = $tgt.val();
			var $vender = $("#ca_srchVendorID");
			var $div = $("#div_srchVendorID");

			if (val == 3) {
				// 業者別外注実績の場合、取引先は任意
				$div.removeClass('required');
				$vender.removeClass('cl_required');
			} else {
				// 業者別外注実績以外の場合、取引先は必須
				$div.addClass('required');
				$vender.addClass('cl_required');
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

	});

	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();
		//初期フォーカス
		var $tgt = null;
		if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
			$tgt = $("#ca_srchYear").next().children('input');
		}
		else{
			$tgt = $("#ca_srchUnitID").next().children('input');
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
