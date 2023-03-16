// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var CsvOutView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			'change #ca_srchUnitID'			:	'_onSrchUnitChanged',	// 事業ユニットが変更された
		},

		uri : "AMEPV0030",
		initialize: function(){
			_.bindAll(this);
			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '販促情報取込',
				btn_submit: false,
				btn_csv: true
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		initUIelement : function(){
			var _this = this;
			clutil.inputlimiter(this.$el);
			this.mdBaseView.initUIElement();

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {
							AMEPV0030UpdReq: clutil.view2data(this.$("#ca_searchArea"))
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMEPV0030',
						data: request
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(this.validator.valid, this.validator)
				}
			});
			// 取込処理が失敗した。後処理が必要な場合は↓イベントを購読する。
			this.opeCSVInputCtrl.on('fail', function(data){
				if(data.rspHead.fieldMessages){
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					_this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}
				if (data.rspHead.uri){
					// CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				}
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで

			// 初期フォーカスオブジェクト設定
			this.$tgtFocus = $('#ca_srchUnitID');

			// 事業ユニット
			this.utl_unit = clutil.clbusunitselector({
				el: '#ca_srchUnitID',
				initValue: clcom.userInfo.unit_id,
			});
			clutil.clyearselector(this.$("#ca_srchYear"), 0, clutil.getclsysparam('PAR_AMCM_YEAR_FROM'), 2, "年度");
			this.$("#ca_srchYear").selectpicker('val', 0);
			// 販促費内容区分
			clutil.cltypeselector(this.$("#ca_srchType"), amcm_type.AMCM_TYPE_PROMCOST_CONTENTS, 1);

			// 組織
			this.orgAutocomplete = this.getOrg(clcom.userInfo.unit_id);

			var tgtView = this;
			this.utl_unit.done(function() {
				// 初期活性制御
				tgtView.setDefaultEnabledProp();

				// 初期フォーカス設定
				clutil.setFocus(tgtView.$tgtFocus);
			});

			clutil.initUIelement(this.$el);

			return this;
		},

		render : function(){
			this.mdBaseView.render();
			return this;
		},

		setDefaultEnabledProp: function() {
			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS){
				if (clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.viewReadonly($("#div_ca_srchUnitID"));
					if (clcom.userInfo.org_kind_typeid == amcm_type.AMCM_VAL_ORG_KIND_ZONE) {
						var userData = clcom.getUserData();
						var orgObj = {
							id: userData.org_id,
							code: userData.org_code,
							name: userData.org_name,
						};
						$("#ca_srchOrgID").autocomplete('clAutocompleteItem', orgObj);
						clutil.inputReadonly($("#ca_srchOrgID"));
						this.$tgtFocus = $("#ca_srchYear");
					} else {
						this.$tgtFocus = $('#ca_srchOrgID');
					}
				}
			}

		},

		/**
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}

			var unitID = ~~$('#ca_srchUnitID').val();

			if (unitID == '0'){
				clutil.inputReadonly("#ca_srchOrgID");
			}else{
				if (clcom.userInfo.org_kind_typeid != amcm_type.AMCM_VAL_ORG_KIND_ZONE &&
					clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE &&
					clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN){
					clutil.inputRemoveReadonly("#ca_srchOrgID");
				}
			}

			if (unitID == '0' || unitID != this.prevUnitId){
				this.orgAutocomplete.resetValue();
			}

			this.prevUnitId = unitID;
		},

		/**
		 * 組織オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: '#ca_srchOrgID',
				dependAttrs : function(item) {
					var p_org_id = $('#ca_srchUnitID').val();
					var s_org_id = 0;
					var orglevel_id = Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID'));
					if (clcom.userInfo.org_kind_typeid == amcm_type.AMCM_VAL_ORG_KIND_ZONE) {
						p_org_id = clcom.userInfo.org_id;
						//orglevel_id = 0;
					}
					return {
						orgfunc_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						p_org_id	: p_org_id,
						s_org_id	: s_org_id,
						orglevel_id	: orglevel_id,
					};
				}
			});
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
				AMEPV0030GetReq: srchDto
			};
			console.log(srchDto);
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

		/**
		 * 出力ボタン押下処理
		 */
		doDownload: function(rtyp) {
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMEPV0030', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
			return false;
		}
	});


	clutil.getIniJSON(null, null)
	.done(_.bind(function(data,dataType){
		ca_csvOutView = new CsvOutView;
		ca_csvOutView.initUIelement().render();
		clutil.setFocus($("#ca_srchUnitID"));
	}, this)).fail(function(data){
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