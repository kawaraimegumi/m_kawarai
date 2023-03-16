// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var AMIGV0060View = Backbone.View.extend({
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
				title: '月別不良品件数・金額出力',
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
			var _this = this;
			this.mdBaseView.initUIElement();
			clutil.inputlimiter(this.$el);

			this.$el.delegate(':radio[name=srchType]', 'toggle', function (ev) {
				_this.onRadioClick($(this).val());
			});

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);
			// 年selector
			clutil.clyearselector(this.$("#ca_srchYear"), 0, 10, 0, "年度");
			// 月オートコンプ
			var initMonth = Math.floor(clcom.getOpeDate() / 100);
			this.fromYearMonth = clutil.clyearmonthcode({
				el:"#ca_srchMonth",
				initValue: initMonth
			});

			// 初期値設定
			if (clcom.userInfo && clcom.userInfo.unit_id) {
				this.$("#ca_srchUnitID").selectpicker('val', clcom.userInfo.unit_id);
			}
			var ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');
			this.$("#ca_srchYear").selectpicker('val', ope_year);
			// 月selector
			var month = this.twodigit(Math.floor((clcom.getOpeDate()%10000)/100));
			this.$("#ca_srchMonth").selectpicker('val', clutil.cStr(month));

			clutil.initUIelement(this.$el);

			this.onRadioClick(1);

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
		 * ラジオボタン click
		 */
		onRadioClick : function(type) {
			this.srchType = type;
			this.validator.clear();
			
			var initMonth = Math.floor(clcom.getOpeDate() / 100);
			var setMonth = {};
			
			var ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');
			this.$("#ca_srchYear").selectpicker('val', ope_year);
			
			if (type == 1) {
				// 全社実績
				$("#ca_p_month").removeClass("required");
				$("#ca_srchMonth").removeClass("cl_required");
				$("#ca_p_year").addClass("required");
				$("#ca_srchYear").addClass("cl_required");
				clutil.viewReadonly($("#month"));
				clutil.viewRemoveReadonly($("#ca_year"));
				
				//初期値入れ替え
				this.$("#ca_srchYear").selectpicker('val', ope_year);
				setMonth = {
						srchMonth: 0
				};
				
			} else {
				$("#ca_p_month").addClass("required");
				$("#ca_srchMonth").addClass("cl_required");
				$("#ca_p_year").removeClass("required");
				$("#ca_srchYear").removeClass("cl_required");
				clutil.viewRemoveReadonly($("#month"));
				clutil.viewReadonly($("#ca_year"));
				
				//初期値入れ替え
				this.$("#ca_srchYear").selectpicker('val', 0);
				setMonth = {
						srchMonth: initMonth
				};
			}
			clutil.data2view(this.$("#ca_p_month"), setMonth);
		},

		/**
		 * 数値を2桁文字列に変換
		 * @param obj
		 * @returns obj
		 */
		twodigit : function(month) {
			var obj = '';
			// 前年
			if (month == 1) {
				month = 12;
			} else {
				month = month - 1;
			}
			if (month < 10) {
			  obj = '0' + month;
			} else {
				  obj = '' + month;
			}

			return obj;
		},

		/**
		 * 初期フォーカス
		 */
		setFocus: function(){
			// 初期フォーカスをセット
			var $tgt = null;
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$tgt = $("#ca_srchYear");
			}
			else{
				$tgt = $("#ca_srchUnitID");
			}
			clutil.setFocus($tgt);
		},

		buildReq: function(rtyp){
			// validation
			if (!this.validator.valid()) {
				return null;
			}

			//リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
				},
				AMIGV0060GetReq: srchDto
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
			var defer = clutil.postDLJSON('AMIGV0060', srchReq);
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
		mainView = new AMIGV0060View().initUIElement().render();
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
