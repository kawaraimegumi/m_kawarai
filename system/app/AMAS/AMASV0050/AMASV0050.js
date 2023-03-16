/**
 * 月別店別日別現金過不足一覧出力
 */

useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	/**
	 *  View
	 */
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'change #ca_srchUnitID'		: '_onUnitIDSelect',	// 事業ユニット変更
			'click #ca_btn_org_select'	: '_onOrgSelClick'
		},

		/**
		 * initialize関数
		 */
		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '月別店別日別現金過不足一覧出力',
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

			var _this = this;

			this.mdBaseView.initUIElement();

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'));

			// 現在年月日を取得
			var opeDate = String(clcom.getOpeDate());
			// 現在年月を取得
			var opeYearMonth = opeDate.substr(0,6);
			var initYearMonth = Number(opeYearMonth);

			// 対象月取得
			var yearmonthcode = clutil.clyearmonthcode({
				  el: '#ca_srchYm',
				  initValue: initYearMonth
			});

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
				// inputにフォーカスする
				_.defer(function(){

					// 参照ボタンにフォーカスする
					clutil.setFocus(_this.$("#ca_btn_org_select"));
				});
			};

			//組織オートコンプリート
			this.srcOrgIdField = this.getOrg(clcom.getUserData().unit_id);

			return this;
		},

		/**
		 * 組織オートコンプ入れ替え
		 */
		getOrg: function(unit){
			return clutil.clorgcode({
				el: $("#ca_srchOrgID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'))
				}
			});
		},

		/**
		 * 画面描画
		 */
		render: function() {

			this.mdBaseView.render();

			// 初期フォーカスをセット
			clutil.setFocus(this.$("#ca_srchUnitID"));

			this.AMPAV0020Selector.render();

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
				this.getOrg(unit);
				this.srcOrgIdField.setValue();

				// 組織検索部品を操作可能にする
				this.$("#ca_srchOrgID").attr("readonly", false);
				this.$('#ca_btn_org_select').attr('disabled', false);

			} else {

				// 事業ユニットが選択されていない場合
				this.srcOrgIdField.setValue();

				// 組織検索部品を操作不可にする
				this.$("#ca_srchOrgID").attr("readonly", true);
				this.$('#ca_btn_org_select').attr('disabled', true);
			}
		},

		/**
		 * 組織［参照］ボタンクリック
		 */
		_onOrgSelClick: function(e){
			var selectedOrgList = [];
			if(this.selectedOrg){
				selectedOrgList.push(this.selectedOrg);
			}
			//this.AMPAV0020Selector.show(selectedOrgList, null);	// XXX 引数？
			this.AMPAV0020Selector.show(selectedOrgList, null, null, null, null, this.$('#ca_srchUnitID').val());
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

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){

			var flag = true;
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			var yearMonth = String(srchDto.srchYm);

			// 入力された年を取得
			var year = yearMonth.substr(0,4);
			// 入力された月を取得
			var month = yearMonth.substr(4,2);

			// 現在年月日を取得
			var opeDate = String(clcom.getOpeDate());

			// 現在年を取得
			var opeYear = opeDate.substr(0,4);
			// 現在月を取得
			var opeMonth = opeDate.substr(4,2);

			// 未入力エラー確認
			if(!this.validator.valid()){
				flag = false;
			}

			var intYear = Number(year);
			var intMonth = Number(month);

			var intOpeYear = Number(opeYear);
			var intOpeMonth = Number(opeMonth);

			// 選択された対象月が現在年月より未来の場合はエラーとする
			if(intYear > intOpeYear){
				//未来年
				this.validator.setErrorMsg($("#ca_srchYm"), clmsg.EAS0001);
				flag = false;
			}
			else if((intYear == intOpeYear) && (intMonth > intOpeMonth)){
				//同じ年の未来月
				this.validator.setErrorMsg($("#ca_srchYm"), clmsg.EAS0001);
				flag = false;
			}

			return flag;
		},

		/**
		 * 検索リクエストを作成する
		 */
		buildReq: function(rtyp){
			/*// validation
			if (!this.validator.valid()) {
				return null;
			}*/

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
				AMASV0050GetReq: srchDto
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
			var defer = clutil.postDLJSON('AMASV0050', srchReq);
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