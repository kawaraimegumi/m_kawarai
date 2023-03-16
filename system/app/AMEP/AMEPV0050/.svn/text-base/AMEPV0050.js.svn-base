// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var AMEPV0050View = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		validator : null,

		// Events
		events : {
		},

		initialize: function() {
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '経費予算データ出力',
				btn_submit: false
			});

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function() {
//			var _this = this;
			this.mdBaseView.initUIElement();
			clutil.inputlimiter(this.$el);

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);

			// 年selector
			//clutil.clyearselector(this.$("#ca_srchYear"), 1, 10, 0, "年度");
			clutil.clyearselector(this.$("#ca_srchYear"), 0, clutil.getclsysparam('PAR_AMCM_YEAR_FROM'), 2, "年度");
			this.$("#ca_srchYear").selectpicker('val', 0);

			// 月selector
			// bootstrap 適用
			$("#ca_srchStMonth").selectpicker().selectpicker('refresh');
			$("#ca_srchEdMonth").selectpicker().selectpicker('refresh');

			clutil.initUIelement(this.$el);

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			return this;
		},

		/**
		 * 初期フォーカス
		 */
		setFocus: function(){
			clutil.setFocus($('#ca_srchUnitID'));
		},

		buildReq: function(rtyp){
			var retStat = true;

			// validation
			if (!this.validator.valid()) {
				retStat = false;
			}

			// 期間反転チェック
			var stMonth = Number($('#ca_srchStMonth').val());
			var edMonth = Number($('#ca_srchEdMonth').val());
			if (stMonth!= 0 && stMonth < 4) {
				stMonth = stMonth + 10;
			}
			if (edMonth != 0 && edMonth < 4) {
				edMonth = edMonth + 10;
			}
			if (stMonth > edMonth) {
				this.validator.setErrorMsg($('#ca_srchStMonth'), clmsg.cl_fromto_error);
				this.validator.setErrorMsg($('#ca_srchEdMonth'), clmsg.cl_fromto_error);
				retStat = false;
			}

			if (!retStat) {
				clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
				return null;
			}

			// リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
				},
				AMEPV0050GetReq: srchDto
			};

			return reqDto;
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				console.log('CSV 出力');
				this.doDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		doDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMEPV0050', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		}

	});

	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new AMEPV0050View().initUIElement().render();
		mainView.setFocus();
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
