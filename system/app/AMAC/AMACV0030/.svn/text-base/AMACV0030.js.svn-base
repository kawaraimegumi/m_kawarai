/**
 * 会計・経理 メーカー別伝票代金出力
 */
// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			"click label.radio" : "_onRadioClick"
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: 'メーカー別伝票代金出力',
				btn_submit: false
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

//			clutil.clmonthselector(this.$("#ca_srchMonth"),0,5,5,null,null,1,0);
			clutil.clyearmonthcode({el:this.$("#ca_srchMonth")});
			clutil.clvendorcode(this.$("#ca_srchMakerID"), {
				getVendorTypeId: function() {
					// 取引先区分取得メソッド
					return amcm_type.AMCM_VAL_VENDOR_MAKER; // TODO:区分値なに？
				}
			});

			// 事業ユニット取得
			return clutil.clbusunitselector(this.$('#ca_srchUnitID'),1);
//			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.$("#cl_pdf").attr("disabled", true);
			clutil.setFocus(this.$("input[type='radio']:first"));
			return this;
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:	// PDF 出力
				console.log('CSV 出力');
				this.doCSVDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		buildReq: function(rtyp){
			// validation
			if (!this.validator.valid()) {
				return null;
			}

			//リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
//			if(this.selectedOrg){
//				srchDto.srchStoreID = this.selectedOrg.val;
//			}
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMACV0030GetReq: srchDto
			};

			return reqDto;
		},

		doCSVDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMACV0030', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		_onRadioClick : function(e){
			var checked = $(e.target).find("input[name='ca_srchType']").val();
			this.$("#cl_pdf").attr("disabled", checked == 1);
		}
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView();
		mainView.initUIElement().done(_.bind(function(){
			mainView.render();
			clutil.setFocus($("#ca_srchUnitID"));
		}, this));
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