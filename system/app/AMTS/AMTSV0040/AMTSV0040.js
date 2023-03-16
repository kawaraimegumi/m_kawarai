/**
 * 移動候補店舗検索（セットアップ）
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
			'change #ca_srchUnitID'			: '_onUnitIDSelect',	// 事業ユニット変更

			'click #ca_btn_store_select'	: '_onStoreSelClick',	// 店舗選択
			'click #ca_btn_org_select'	: '_onOrgSelClick',	// 絞込組織選択

			'change #ca_srchDecisionStore'	: '_onChangeDecisionStore',	// 出荷店舗または入荷店舗が決まっているチェックボックス
			'change input[name="srchTransInOut"]:first'	: '_onChangeTransInOut' // 入荷店舗指定または出荷店舗指定ラジオボタン
		},

		/**
		 * initialize関数
		 */
		initialize: function(){

			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '移動候補店舗検索（セットアップ）',
				btn_submit: false
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			// ツールチップ
			$("#ca_tp_code1").tooltip({html: true});
			$("#ca_tp_code2").tooltip({html: true});
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			var _this = this;

			this.mdBaseView.initUIElement();

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'));

			// セットアップオートコンプリート
			clutil.FieldRelation.create("default", {
				// 事業ユニット取得
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// セットアップオートコンプリート
				clsetupcode: {
					el: "#ca_srchSetupID"
				}
			});

			// 対象週取得
			var yearweekcode = clutil.clyearweekcode({
				  el: '#ca_srchWeek',
				  initValue: MainView.yyyywwData
			});

			// 店舗選択部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
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
					// 参照ボタンにフォーカスする
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};

			//店舗オートコンプリート
			this.srcStoreIdField = this.getStore(clcom.getUserData().unit_id);

			// 組織部品
			this.AMPAV0020Selector = new AMPAV0020SelectorView({
				el: $("#ca_AMPAV0020_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});

			// 選択サブ画面復帰処理
			this.AMPAV0020Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 組織を取出す
					data[0].id = data[0].val;
					_this.srcOrgIdField.setValue(data[0]);
				} else {
					var org = _this.srcOrgIdField.getValue();
					if (org.id == 0) {
						_this.srcOrgIdField.resetValue();
					}
				}
				// 参照ボタンにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_org_select"));
				});
			};

			//組織オートコンプリート
			this.srcOrgIdField = this.getOrg(clcom.getUserData().unit_id);

			return this;
		},

		/**
		 * 店舗オートコンプ入れ替え
		 */
		getStore: function(unit){
			return clutil.clorgcode({
				el: $("#ca_srchStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'),1),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'),6),
					f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ))
				}
			});
		},

		/**
		 * 組織オートコンプ入れ替え
		 */
		getOrg: function(unit){
			return clutil.clorgcode({
				el: $("#cax_srchOrgID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ))
				}
			});
		},

		/**
		 * 画面描画
		 */
		render: function() {

			this.mdBaseView.render();

			// 店舗検索部品
			this.AMPAV0010Selector.render();

			// 店舗絞込組織検索部品
			this.AMPAV0020Selector.render();

			// 初期フォーカスをセット
			var $tgt = null;
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$tgt = $("#ca_srchSetupID");
			}
			else{
				$tgt = $("#ca_srchUnitID");
			}
			clutil.setFocus($tgt);

			return this;
		},

		/**
		 * 事業ユニット変更
		 */
		_onUnitIDSelect: function(e){

			// 事業ユニットを取得
			var unit = this.$("#ca_srchUnitID").val();

			if(unit !== "0") {

				// 事業ユニットが選択されている場合

				var v = $('#ca_srchDecisionStore').prop('checked');

				if (v === true) {

					this.getStore(unit);
					this.srcStoreIdField.setValue();

					this.getOrg(unit);
					this.srcOrgIdField.setValue();

					// 出荷店舗または入荷店舗指定チェックボックスがチェックされている場合

					// 店舗検索部品を操作可能にする
					this.$("#ca_srchStoreID").attr("readonly", false);
					this.$('#ca_btn_store_select').attr('disabled', false);

					// 組織検索部品を操作可能にする
					this.$("#cax_srchOrgID").attr("readonly", false);
					this.$('#ca_btn_org_select').attr('disabled', false);
				}

			} else {

				// 事業ユニットが選択されていない場合

				this.srcStoreIdField.setValue();
				this.srcOrgIdField.setValue();

				// 店舗検索部品/組織検索部品を操作不可にする
				this.$("#ca_srchStoreID").attr("readonly", true);
				this.$('#ca_btn_store_select').attr('disabled', true);

				// 店舗検索部品/組織検索部品を操作不可にする
				this.$("#cax_srchOrgID").attr("readonly", true);
				this.$('#ca_btn_org_select').attr('disabled', true);

			}
		},

		/**
		 * 出荷店舗又は入荷店舗が決まっているチェックボックスをチェック
		 */
		_onChangeDecisionStore: function(e){

			var v = $('#ca_srchDecisionStore').prop('checked');

			if (v === true) {

				// チェックボックスがチェックされた場合

				// 入荷店舗指定/出荷店舗指定ラジオボタンを有効にする
				$('input[name="srchTransInOut"]:radio').attr('disabled', false);
				$('label.radio').removeClass('disabled');

				// 店舗ラベルに必須項目マークを表示
				$("#p_srchStoreID").addClass('required');

				// 店舗を必須項目にする
				$("#ca_srchStoreID").addClass('cl_required');

				// 事業ユニットを取得する
				var unit = this.$("#ca_srchUnitID").val();

				if(unit !== "0") {

					this.getStore(unit);
					this.srcStoreIdField.setValue();

					this.getOrg(unit);
					this.srcOrgIdField.setValue();

					// 事業ユニットが選択されている場合

					// 店舗検索部品を操作可能にする
					this.$("#ca_srchStoreID").attr("readonly", false);
					this.$('#ca_btn_store_select').attr('disabled', false);

					// 組織検索部品を操作可能にする
					this.$("#cax_srchOrgID").attr("readonly", false);
					this.$('#ca_btn_org_select').attr('disabled', false);
				}

			} else {

				// チェックボックスがチェックされていない場合

				// 入荷店舗指定/出荷店舗指定ラジオボタンを無効にする
				$('input[name="srchTransInOut"]:radio').attr('disabled', true);
				$('label.radio').addClass('disabled');

				// 店舗ラベルに必須項目マークを表示しない
				$("#p_srchStoreID").removeClass('required');

				//店舗を必須項目にしない
				$("#ca_srchStoreID").removeClass('cl_required');

				this.srcStoreIdField.setValue();

				// 店舗検索部品/組織検索部品を操作不可にする
				this.$("#ca_srchStoreID").attr("readonly", true);
				this.$('#ca_btn_store_select').attr('disabled', true);

				// 店舗検索部品/組織検索部品を操作不可にする
				this.$("#cax_srchOrgID").attr("readonly", true);
				this.$('#ca_btn_org_select').attr('disabled', true);

			}

		},

		/**
		 * 入荷店舗指定ラジオボタンの選択値が変わった
		 */
		_onChangeTransInOut: function(e){
			if (e.target.checked) {
				$("#ca_store_label").text("入荷店舗");
				$("#ca_org_label").text("出荷店舗絞込組織");
			} else {
				$("#ca_store_label").text("出荷店舗");
				$("#ca_org_label").text("入荷店舗絞込組織");
			}
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){

			var unit = $("#ca_srchUnitID").val();
			if (unit != 0){
				this.AMPAV0010Selector.show(null, null, {
					org_id: unit,
					func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),		//基本組織を対象
					org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
					               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
					f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ))
				});
			} else {
				this.AMPAV0010Selector.show(null, null, {
					org_id: 3, //TODO:定数化 (手順的には保険)
					func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),		//基本組織を対象
					org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
					               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
					f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ))
				});
			}
		},

		/**
		 * 店舗絞込組織［参照］ボタンクリック
		 */
		_onOrgSelClick: function(e){
			var selectedOrgList = [];
			if(this.selectedOrg){
				selectedOrgList.push(this.selectedOrg);
			}
			// 組織検索子画面を表示
			// 引数:在庫有無フラグ 1:在庫有り店舗のみ
			this.AMPAV0020Selector.show(selectedOrgList, null, null, null, null, this.$('#ca_srchUnitID').val(),1);
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
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * Getリクエストを作る
		 */
		buildReq: function(rtyp){
			// validation
			if (!this.validator.valid()) {
				return null;
			}

			//リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			if(this.selectedOrg){
				srchDto.srchOrgID = this.selectedOrg.val;
			}
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMTSV0040GetReq: srchDto
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
			var defer = clutil.postDLJSON('AMTSV0040', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		}

	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null)

	.then(function(){

		//return clutil.ymd2week(clcom.getOpeDate()).done(function(data){
		return clutil.ymd2week(clcom.getOpeDate(),-1).done(function(data){

			// MainViewに運用日の前週の週番号を設定する
			MainView.yyyywwData = data;

		});
	})
	.done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

	}).fail(function(data){
		console.error('iniJSON failed.');
		console.log(arguments);

		// clcom のネタ取得に失敗。
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});