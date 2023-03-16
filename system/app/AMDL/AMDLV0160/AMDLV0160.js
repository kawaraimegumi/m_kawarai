/**
 * 出荷返品／移動出荷取込
 */
$(function(){

	//////////////////////////////////////////////
	// View
	var CsvOutView = Backbone.View.extend({

		el:	$('#ca_main'),

		validator : null,

		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick'	// 店舗選択
		},

		uri : "AMDLV0160",

		/**
		 * initialize関数
		 */
		initialize: function(opt){

			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({

				opeTypeId:		-1,
				title: '出荷返品／移動出荷取込',
				btn_submit: false,
				btn_csv: false

			});

			this.validator = clutil.validator($("#ca_srchArea"), {
				echoback : $('.cl_echoback')
			});

		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			var _this = this;

			this.mdBaseView.initUIElement();

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
					// 選択サブ画面から戻ったら参照ボタンにフォーカスを当てる
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};

			// 店舗オートコンプリート
			this.srcStoreIdField = clutil.clorgcode({
				el: $("#ca_srchStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					// p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'),1),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'),6),
					f_stockmng: 1
				}
			});

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({

				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				/**
				 * CSV取込実行のときのリクエストを作る関数
				 */
				buildCSVInputReqFunction: _.bind(function(uploadedFile){

					// リクエストデータ本体
					var request = {

						//AMDLV0160UpdReq: clutil.view2data(this.$("#ca_searchArea"))

						AMDLV0160GetReq: clutil.view2data(this.$("#ca_srchArea"))

					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMDLV0160',
						data: request
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {

					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(function(){
						return this.validator.valid();
					}, this),

					// ファイル種別を指定 -- テキスト
					fileType: clutil.View.FileTypes.text

					//maxFileSize: 1024 * 1024	// ファイルサイズ上限：1MB
				}
			});

			// 取込処理が成功した。後処理が必要な場合は↓イベントを購読する。
//			this.opeCSVInputCtrl.on('done', function(data){
//				// 何か後処理があれば、ここに記述する。
//			});

			// 取込処理が失敗した。後処理が必要な場合は↓イベントを購読する。
			this.opeCSVInputCtrl.on('fail', _.bind(function(data){

				if(data.rspHead.fieldMessages){

					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}

				if (data.rspHead.uri){
					clutil.download(data.rspHead.uri);	//CSVダウンロード実行
				}

			}, this));
			// ---------------------------------------- [CSV取込ボタン]: ここまで

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {

			this.mdBaseView.render();

			this.AMPAV0010Selector.render();

			// 初期フォーカスを店舗にセットする
			clutil.setFocus(this.$("#ca_srchStoreID"));

			return this;
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){
			this.AMPAV0010Selector.show(null, null,{
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),		//基本組織を対象
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
				 f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ))
			});
		}

	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null, null).done(_.bind(function(data,dataType){

		CsvOutView = new CsvOutView().initUIElement().render();

		/*ca_csvOutView = new CsvOutView;

		ca_csvOutView.initUIelement();*/

		//clutil.setFocus($("#ca_targetYear"));

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
