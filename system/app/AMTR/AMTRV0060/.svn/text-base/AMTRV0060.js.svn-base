//セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function() {
	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			"change #ca_srchUnitID"			:	"_onUnitIDSelect",				// 事業ユニット変更
			"click #ca_btn_store_select"	: "_onStoreSelClick"		// 店舗選択補助画面起動
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '移動エラーリスト',
				subtitle: '出力',
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

			//サブ画面配置
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector.render();

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);

			var unit = clcom.getUserData().unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				$('#ca_srchUnitID').selectpicker('val', clcom.getUserData().unit_id);
				clutil.viewRemoveReadonly($("#ca_srchStoreArea"));
				//clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}
			else{
				unit = null;
				clutil.viewReadonly($("#ca_srchStoreArea"));
			}

			// 検索日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchFromDate'));
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchToDate'));

			//店舗オートコンプ
			this.srcStoreIdField = this.getOrg(unit);
			return this;
		},

		/**
		 * 事業ユニット変更で店舗オートコンプ入れ替え
		 */
		_onUnitIDSelect: function(){
			var unit = $("#ca_srchUnitID").val();

			this.getOrg(unit);
			this.srcStoreIdField.setValue();

			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				clutil.viewRemoveReadonly($("#ca_srchStoreArea"));
			}
			else{
				clutil.viewReadonly($("#ca_srchStoreArea"));
			}
		},

		/**
		 * 店舗オートコンプ入れ替え
		 */
		getOrg: function(unit){
			return clutil.clorgcode({
				el: $("#ca_srchStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					f_stockmng: 1	//在庫有無フラグ(1:在庫有り店舗のみ)
				}
			});
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
			var unit = clcom.getUserData().unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				clutil.setFocus($('#ca_srchStoreID'));
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
		},

		/**
		 * 店舗参照押下
		 */
		_onStoreSelClick: function(e) {
			var _this = this;

			var unit = $("#ca_srchUnitID").val();
			_this.AMPAV0010Selector.show(null, null,{
				org_id: unit,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),		//基本組織を対象
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
				f_stockmng: 1	//在庫有無フラグ(1:在庫有り店舗のみ)
			});

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					var d = data[0];
					_this.srcStoreIdField.setValue({
						id: d.val,
						code: d.code,
						name: d.name
					});
				}
				_.defer(function(){// setFocusを_.defer()で後回しにする
					$(e.target).focus();
				});
			};
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				//最終来店日
				stval : 'ca_srchFromDate',
				edval : 'ca_srchToDate'
			});

			var retStat = true;

			// 日付エラー確認
			if(!this.validator.valid()){
				retStat = false;
			}
			// 反転エラー確認
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			// 日付が入力されていなければエラー
			var fromDate = $("#ca_srchFromDate").val().length;
			var toDate = $("#ca_srchToDate").val().length;

			if(fromDate * toDate == 0){
				this.validator.setErrorMsg($(".cl_date"), clmsg.ETR0022);
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
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
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMTRV0060GetReq: srchDto
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
			var defer = clutil.postDLJSON('AMTRV0060', srchReq);
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