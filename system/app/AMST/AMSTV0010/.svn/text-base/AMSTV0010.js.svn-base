/**
 * 店舗別在庫変動内訳一覧出力
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
			'click #ca_btn_store_select'	: '_onStoreSelClick'	// 店舗選択
		},

		/**
		 * initialize関数
		 */
		initialize: function(){

			_this = this;
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '店舗別在庫変動内訳一覧出力',
				//subtitle: '',
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
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};

			this.AMPAV0010Selector.clear = function() {
				_this.srcStoreIdField.setValue();
			};

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

			//店舗オートコンプリート
			this.srcStoreIdField = this.getOrg(clcom.getUserData().unit_id);

			// 対象日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchDate'));

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {

			this.mdBaseView.render();

			//店舗検索部品
			this.AMPAV0010Selector.render();
			this.AMPAV0010Selector.clear();

			// 初期フォーカスをセット
			clutil.setFocus(this.$("#ca_srchUnitID"));

			return this;
		},

		/**
		 * 事業ユニット変更で店舗オートコンプ入れ替え
		 */
		_onUnitIDSelect: function(e){

			var unit = this.$("#ca_srchUnitID").val();

			this.getOrg(unit);
			this.srcStoreIdField.setValue();
			this.$("#ca_srchStoreID").attr("readonly", unit == 0);
			this.$("#ca_btn_store_select").attr("disabled", unit == 0);
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
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'),1),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'),6),
					f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ))
				}
			});
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){

			var unit = $("#ca_srchUnitID").val();

			/*if (unit != 0){
				this.AMPAV0010Selector.show(null, null, {
					org_id: unit,
					func_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'),1)
				});
			} else {
				this.AMPAV0010Selector.show(null, null, {
					org_id: 3, //TODO:定数化 (手順的には保険)
					func_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'),1)
				});
			}*/

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
				AMSTV0010GetReq: srchDto
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
			var defer = clutil.postDLJSON('AMSTV0010', srchReq);
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