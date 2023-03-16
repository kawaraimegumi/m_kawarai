/**
 * 会計・経理 検収通知書出力
 */
// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function() {

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '検収通知書出力',
				btn_submit: false
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});

			// 店舗部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var _this = this;
			this.mdBaseView.initUIElement();

			// 前月1日と前月末日の生成
			var thisDate = clutil.ymd2date(clcom.getOpeDate());
			var Y = thisDate.getFullYear();
			var M = thisDate.getMonth();
			var D = 0;
			var prevMonthEndDate = new Date(Y,M,D);
			Y = prevMonthEndDate.getFullYear();
			M = prevMonthEndDate.getMonth();
			D = 1;
			var prevMonthStDate = new Date(Y,M,D);
			var date2ymd = function(date){
				var y = date.getFullYear();
				var m = ("0" + (date.getMonth() + 1)).slice(-2);
				var d = ("0" + date.getDate()).slice(-2);
				return Number(y + m + d);
			};
			var prevMonthEndDay = date2ymd(prevMonthEndDate);
			var prevMonthStDay = date2ymd(prevMonthStDate);

			// 対象日
			clutil.datepicker(this.$('#ca_srchOdrStDate'));
			clutil.datepicker(this.$('#ca_srchOdrEdDate'));
			clutil.datepicker(this.$('#ca_srchRecvStDate'));
			clutil.datepicker(this.$('#ca_srchRecvEdDate'));
			clutil.datepicker(this.$('#ca_srchAccStDate'));
			clutil.datepicker(this.$('#ca_srchAccEdDate'));
			this.$('#ca_srchOdrStDate').datepicker("setIymd");
			this.$('#ca_srchOdrEdDate').datepicker("setIymd");
			this.$('#ca_srchRecvStDate').datepicker("setIymd");
			this.$('#ca_srchRecvEdDate').datepicker("setIymd");
			this.$("#ca_srchAccStDate").datepicker("setIymd", prevMonthStDay);
			this.$("#ca_srchAccEdDate").datepicker("setIymd", prevMonthEndDay);

			clutil.clvendorcode(this.$("#ca_srchVendorID"), {
				getVendorTypeId: function() {
					// 取引先区分取得メソッド
					return amcm_type.AMCM_VAL_VENDOR_MAKER;
				}
			});

			// 事業ユニット-店舗リレーション
			this.relation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: '#ca_srchUnitID',
				},
				clvarietycode: {
					el: '#ca_srchItgrpID'
				},
				// 店舗オートコンプリート
				clorgcode: {
					el: '#ca_srchStoreID',
					// p_org_idに依存するために必要
					addDepends: ['p_org_id'],
					dependSrc: {
						// unit_idをp_org_idに設定するために必要
						p_org_id: 'unit_id'
					}
				},
				// 店舗参照ボタン
				AMPAV0010: {
					button: this.$('#ca_btn_store_select'),
					// this.AMPAV0010SelectorはAMPAV0010SelectorViewインスタンス、あらかじめ
					// 初期化しておく
					view: this.AMPAV0010Selector,
					// this.AMPAV0010Selector.show()へのオプション
					showOptions: function(){
						// 店舗階層のみ表示するようにorg_kind_setを指定する
						return {
							org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
						};
					}
				}
			}, {
				dataSource: {
					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
				}
			});

			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					var d = data[0];
					_this.$("#ca_srchStoreID")
					.autocomplete("clAutocompleteItem", {id:d.val, code:d.code, name:d.name});
				} else {
					var chk = $("#ca_srchStoreID").autocomplete("clAutocompleteItem");
					if (chk == null || chk.id == 0)  {
						_this.AMPAV0010Selector.clear();
					}
				}
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
			this.AMPAV0010Selector.clear = function() {
				_this.$("#ca_srchStoreID").autocomplete("removeClAutocompleteItem");
			};

			return this.relation;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.AMPAV0010Selector.render();
			clutil.setFocus(this.$("#ca_srchUnitID"));
			return this;
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				console.log('CSV 出力');
				this.doCSVDownload(rtyp);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:	// PDF 出力
				console.log('PDF 出力');
				this.doCSVDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		buildReq: function(rtyp){
			var f_error = false;
			// validation
			if (!this.validator.valid()) {
				f_error = true;
			}
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_srchOdrStDate',
				edval : 'ca_srchOdrEdDate'
			});
			chkInfo.push({
				stval : 'ca_srchRecvStDate',
				edval : 'ca_srchRecvEdDate'
			});
			chkInfo.push({
				stval : 'ca_srchAccStDate',
				edval : 'ca_srchAccEdDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				f_error = true;
			}

			var $odrSt = this.$("#ca_srchOdrStDate");
			var $odrEd = this.$("#ca_srchOdrEdDate");
			var $RecvSt = this.$("#ca_srchRecvStDate");
			var $RecvEd = this.$("#ca_srchRecvEdDate");
			var $AccSt = this.$("#ca_srchAccStDate");
			var $AccEd = this.$("#ca_srchAccEdDate");

			// 必須入力チェック
			if ($odrSt.val() == 0 && $odrEd.val() == 0
					&& $RecvSt.val() == 0 && $RecvEd.val() == 0
					&& $AccSt.val() == 0 && $AccEd.val() == 0){
				this.validator.setErrorMsg($odrSt, clmsg.EAC0001);
				this.validator.setErrorMsg($odrEd, clmsg.EAC0001);
				this.validator.setErrorMsg($RecvSt, clmsg.EAC0001);
				this.validator.setErrorMsg($RecvEd, clmsg.EAC0001);
				this.validator.setErrorMsg($AccSt, clmsg.EAC0001);
				this.validator.setErrorMsg($AccEd, clmsg.EAC0001);
				clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
				f_error = true;
			}

			var isTermError = function($st, $ed){
				var stYmd = clutil.dateFormat($st.val(), "yyyymmdd");
				var edYmd = clutil.dateFormat($ed.val(), "yyyymmdd");
				if(_.isNaN(stYmd) || _.isNaN(edYmd)){
					return false; // 入力形式エラーなのでスルーさせる
				}
				var yyyy = Math.floor(stYmd / 10000);
				var mm  = Math.floor(stYmd / 100) % 100;
				var dd = stYmd % 100;
				var af400Date = new Date(yyyy, mm - 1, dd + 400);
				var af400Ymd = clutil.dateFormat(af400Date, "yyyymmdd");
				return af400Ymd < edYmd;
			};
			// 各期間入力チェック
			if ($odrSt.val() != 0 || $odrEd.val() != 0){
				if ($odrSt.val() == 0 || $odrEd.val() == 0){
					this.validator.setErrorMsg($odrSt, "指定する場合は開始日、終了日両方入力してください");
					this.validator.setErrorMsg($odrEd, "指定する場合は開始日、終了日両方入力してください");
					clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
					f_error = true;
				} else {
					if(isTermError($odrSt, $odrEd)){
						this.validator.setErrorMsg($odrSt, clmsg.EAC0002);
						this.validator.setErrorMsg($odrEd, clmsg.EAC0002);
						clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
						f_error = true;
					}
				}
			}
			if ($RecvSt.val() != 0 || $RecvEd.val() != 0){
				if ($RecvSt.val() == 0 || $RecvEd.val() == 0){
					this.validator.setErrorMsg($RecvSt, "指定する場合は開始日、終了日両方入力してください");
					this.validator.setErrorMsg($RecvEd, "指定する場合は開始日、終了日両方入力してください");
					clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
					f_error = true;
				} else {
					if(isTermError($RecvSt, $RecvEd)){
						this.validator.setErrorMsg($RecvSt, clmsg.EAC0002);
						this.validator.setErrorMsg($RecvEd, clmsg.EAC0002);
						clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
						f_error = true;
					}
				}
			}
			if ($AccSt.val() != 0 || $AccEd.val() != 0){
				if ($AccSt.val() == 0 || $AccEd.val() == 0){
					this.validator.setErrorMsg($AccSt, "指定する場合は開始日、終了日両方入力してください");
					this.validator.setErrorMsg($AccEd, "指定する場合は開始日、終了日両方入力してください");
					clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
					f_error = true;
				} else {
					if(isTermError($AccSt, $AccEd)){
						this.validator.setErrorMsg($AccSt, clmsg.EAC0002);
						this.validator.setErrorMsg($AccEd, clmsg.EAC0002);
						clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
						f_error = true;
					}
				}
			}

			if(f_error){
				return null;
			}

			//リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMACV0010GetReq: srchDto
			};

			return reqDto;
		},

		doCSVDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}
			var params = {
					resId : "AMACV0010",
					data : srchReq
			};

			// PDFはzipなので別窓開かない方法でDL
			clutil.httpcall(_.extend({
				type: 'POST',
				url: clcom.apiRoot + '/' + params.resId,
				onRspPage: false,
				timeout: 15 * 60 * 1000
			}, params)).then(function(data){
				var uri = null;
				if(data && data.rspHead){
					uri = data.rspHead.uri;
				}
				if(_.isEmpty(uri)){
					// 共通応答パケットがあれば、メッセージを入れておく。
					data.rspHead.message = 'cl_no_data';
					clutil.mediator.trigger('onTicker', data);
					return;
				}
				//DLメソッドを呼び出す。
				clutil.download({url: uri, newWindow: false});
				return;
			}).fail(function(data){
				clutil.mediator.trigger('onTicker', data);
			});
		}

	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		mainView = new MainView();
		mainView.initUIElement().done(_.bind(function(){
			mainView.render();
		}, this));
	}).fail(function(data){
		console.error('iniJSON failed.');
		console.log(arguments);

		clutil.View.doAbort({
			messages: [
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});
});
