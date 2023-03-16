/**
 * メーカー別品番別寄託在庫明細出力
 */

useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {

		},

		/**
		 * initialize関数
		 */
		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: 'メーカー別品番別寄託在庫明細出力',
				btn_submit: false
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			this.mdBaseView.initUIElement();

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'));

			// 品種オートコンプリート
			clutil.FieldRelation.create("default", {
				// 事業ユニット取得
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrpID"
				}
			});

			// 取引先
			clutil.clvendorcode(this.$('#ca_srchVendorID'), {
				getVendorTypeId: _.bind(function(){
					return amdb_defs.MTTYPE_F_VENDOR_MAKER;   // メーカー
				}, this)
			});

			// 対象日に運用日の前日をセットする
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchDate'));
			this.srchDatePicker.datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), -1));

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {

			this.mdBaseView.render();

			// 初期データ
			var iniData = {
				srchUnitID: clcom.userInfo.unit_id
			};
			// 事業ユニットにログインユーザが所属する事業ユニットをセットする
			clutil.data2view(this.$("#ca_searchArea"), iniData, 'ca_', true);

			// 初期フォーカスをセット
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.setFocus($('#ca_srchItgrpID'));
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}

			return this;
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){

			// ope_btn 系
			switch(rtyp){

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV出力

				console.log('CSV出力');

				this.doCSVDownload(rtyp);

				break;

			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * リクエスト作成
		 */
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
					start_record: 0,
					page_size: 0
				},
				AMSTV0050GetReq: srchDto
			};

			return reqDto;
		},

		/**
		 * CSVダウンロード
		 */
		doCSVDownload: function(rtyp){

			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMSTV0050', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		}

	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

//		if(clcom.pageData){
//			// 保存パラメタがある場合
//			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
//			mainView.load(clcom.pageData);
//		}
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