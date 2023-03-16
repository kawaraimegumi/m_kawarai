/**
 * 売上速報
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
			"click #ca_btn_store_select"	: "_onStoreSelClick"		// 店舗選択補助画面起動
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '伝票番号ダブリリスト出力',
				subtitle: '',
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

			// 事業ユニット取得
//			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 0);
			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
			}, {
			});
			this.fieldRelation.done(function() {

			});

			var unit = null;
			var unit_id = clcom.userInfo.unit_id;
			if(clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS) {
				unit = unit_id;
			}

			// カレンダー
			clutil.datepicker(this.$('#ca_fromDate'), {
				initValue: clutil.dateFormat(clcom.getOpeDate(),"yyyy/mm/dd")
			});
			clutil.datepicker(this.$('#ca_toDate'));

			// 初期値を設定
//			this.deserialize({
//				srchUnitID: unit,		// 事業ユニットID
//			});

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
		setFocus:function(){
			clutil.setFocus($('#ca_srchUnitID'));
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			var retStat = true;

			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				//検収日
				stval : 'ca_fromDate',
				edval : 'ca_toDate'
			});

			// 日付エラー確認
			if(!this.validator.valid()){
				retStat = false;
			}
			// 反転エラー確認
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				//this.validator.setErrorFocus();
			}

			return retStat;
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// エラーチェック
			if(this.isValid() == false){
				return;
			}


			// ope_btn 系
			switch(rtyp){
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:	// PDF 出力
//				console.log('PDF 出力');
//				this.doPDFDownload(rtyp);
//				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
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

			//srchDto.srchUnit = Number(srchDto.srchUnit);

			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				//ダミー用、本番時は9999を0070に変更してください
				AMDLV0090GetReq: srchDto
			};

			return reqDto;
		},

		doPDFDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。

			//ダミー用、本番時は9999を0070に変更してください
			var defer = clutil.postDLJSON('AMDLV0090', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		doCSVDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			//ダミー用、本番時は9999を0070に変更してください
			var defer = clutil.postDLJSON('AMDLV0090', srchReq);
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
		mainView.setFocus();

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
