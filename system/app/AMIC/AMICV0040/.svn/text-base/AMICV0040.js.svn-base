/**
 * 棚卸数確定前修正
 */

useSelectpicker2();

$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var srchResult;

	var savedSrchReq;

	// 棚番別棚卸数テーブルのヘッダ
	var columns = [
		{
			id: 'rackNo',
			name: '棚番',
			field: 'rackNo',
			//cssClass: 'txtalign-right',
			width: 130
		},
		{
			id: 'invQy',
			name: '棚卸数',
			field: 'invQy',
			width: 130,
			cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
		}
	];

	function buildColumns() {
		var cols = _.deepClone(columns);
		return cols;
	}

	// 棚卸の修正数テーブルのヘッダ
	var columns_ModInvQy = [
	    {
	    	id: 'rackNo',
	    	name: "棚番",
	    	field: "rackNo",
	    	width: 130,
	    	//cssClass: 'txtalign-right',
	    	cellType: {
	    		type: 'text',
	            //limit: 'digit len:4',
	            validator: 'required digit min:0 maxlen:4'
	        }
	    },
	    {
	    	id: "invQy",
	    	name: "棚卸数",
	    	field: "invQy",
	    	width: 130,
	    	cssClass: 'txtalign-right',
	    	cellType: {
	    		type: 'text',
	            formatFilter: 'comma',
	            //limit: 'digit len:6',
	            validator: 'required digit min:0 maxlen:6'
	    	}
	    }
	];

	function buildColumns_ModInvQy() {
		var cols = _.deepClone(columns_ModInvQy);
		return cols;
	}

	var _unitID = "";
	var _stat = true;

	//////////////////////////////////////////////
	// 条件入力部
	var SrchCondView = Backbone.View.extend({

		el: $('#ca_srchArea'),

		events: {
			'blur #ca_srchTagCode'	: '_onSrchClick'			// タグコードのロストフォーカス
		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			//タグコードのフィールドカウント
			clutil.cltxtFieldLimit($("#ca_srchTagCode"));

			//社員コードのフィールドカウント
			//clutil.cltxtFieldLimit($("#ca_srchStaffCode"));
		},

		/**
		 *  初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			clutil.inputlimiter(this.$el);

			this.relation = clutil.FieldRelation.create("default", {
				// 店舗
				clorgcode: {
					el: '#ca_srchStoreID',
					branches: ['unit_id']
				},

				// 棚卸スケジュール用対象期取得部品
				clinventcntschselector: {
					el: this.$('#ca_srchYearMonth'),
					addDepends: ['org_id']
				}
			}, {
				dataSource: {
					// 上位組織を事業ユニットIDで選択されているものに設
					// 定する => たぶん指定してはだめ
					// p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					f_stockmng: 1
				}
			});

			// 社員コードselector
			/////clutil.clusercode2($("#ca_srchStaffCode"));
			clutil.clstaffcode2($("#ca_srchStaffCode"));
		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			return clutil.view2data(this.$el);
		},

		/**
		 * 検索リクエストパケットの設定値を UI へセットする。
		 */
		deserialize: function(obj){
			this.deserializing = true;
			try{
				var dto = _.extend({}, obj);
				clutil.data2view(this.$el, dto);
			}finally{
				this.deserializing = false;
			}
		},

		/**
		 * 指定プロパティ名（ ⇔ 検索 Req 上のメンバ名）の UI 設定値を取得する。
		 * defaultVal は、設定値が無い場合に返す値。
		 */
		getValue: function(propName, defaultVal){
			if(_.isUndefined(defaultVal)){
				defaultVal = null;
			}
			if(!_.isString(propName) || _.isEmpty(propName)){
				return defaultVal;
			}
			var dto = this.serialize();
			var val = dto[propName];
			return (_.isUndefined(val) || _.isNull(val) || _.isEmpty(val)) ? defaultVal : val;
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			return this.validator.valid();
		},

		/**
		 * 検索条件の入力ブロッキング/解除
		 */
		setEnable: function(enable){
			if(enable){
				clutil.viewRemoveReadonly(this.$el);
			}else{
				clutil.viewReadonly(this.$el);
			}
		},

		/**
		 * タグコードのロストフォーカス処理
		 */
		_onSrchClick: function(e) {

			this.validator.clearErrorHeader();
			this.validator.clearErrorMsg($("#ca_srchStaffCode"));

			var stat = true;

			var dto = this.serialize();
			////console.log("DEBUG: dto.srchTagCode[" + dto.srchTagCode + "]");

			savedSrchReq = dto;

			if(!dto.srchStoreID) {

				// 店舗が指定されていない場合はエラーメッセージを表示
				var msg = clutil.getclmsg('cl_required');
				this.validator.setErrorMsg($("#ca_srchStoreID"), msg);
				stat = false;

			}

			if(!dto.srchYearMonth) {

				// 対象期が指定されていない場合はエラーメッセージを表示
				var msg = clutil.getclmsg('cl_required');
				this.validator.setErrorMsg($("#ca_srchYearMonth"), msg);
				stat = false;

			}

			if(!dto.srchStaffCode) {

				// 社員コードが指定されていない場合はエラーメッセージを表示
				var msg = clutil.getclmsg('cl_required');
				this.validator.setErrorMsg($("#ca_srchStaffCode"), msg);
				stat = false;

			}

			if(!dto.srchTagCode) {

				// タグコードが指定されていない場合はエラーメッセージを表示
				var msg = clutil.getclmsg('cl_required');
				this.validator.setErrorMsg($("#ca_srchTagCode"), msg);
				stat = false;

			}

			if(stat === false) {

				// ヘッダにメッセージを表示する
				clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
				return;

			} else {

				// 店舗の属する事業ユニットを取得する
				var orgAttrs = this.relation.fields.clorgcode.getAttrs();
				_unitID = orgAttrs && orgAttrs.unit_id;

				var req = {
					code : dto.srchTagCode,
					unitID : _unitID
				};

				_myView = this;

				// タグコード検索
				////console.log("DEBUG: call cltag2variety\n");
				clutil.cltag2variety(req, e);

				clutil.mediator.once('onCLtag2varietyCompleted', function(data, e)  {
				////console.log("DEBUG: called cltag2variety. status=[" + data.status + "]");

					if(data.status == 'OK') {

						// タグコードに該当する商品が見つかったら
						// 検索を実行する
						/////console.log("DEBUG: call trigger.\n");
						_myView.trigger('ca_onSearch', dto);

					}else {

						// 検索に失敗したときはエラー
						var msg = clutil.fmt(clutil.getclmsg('EGM0016'),dto.srchTagCode);
						_myView.validator.setErrorMsg($("#ca_srchTagCode"), msg);
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
						return;
					}
				});
			}
		},

		_eof: 'AMICV0040.SrchCondView//'
	});


	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({

		el:	$('#ca_main'),

		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',	// 店舗選択
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){

			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({

				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,

				title: '棚卸数確定前修正',
				subtitle: '',
				btn_submit: true,
				btn_new: false,

				// キャンセルボタンのコールバック
				btn_cancel:{label:'条件再設定', action:this._doCancel},

				// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
				// リクエストビルダ関数を渡しておく。
				buildSubmitReqFunction: this._buildSubmitReqFunction

				// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
				// リクエストのビルダ関数を opt で渡しておく。
				//buildGetReqFunction: this._buildGetReqFunction

			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMICV0040 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMICV0040';

			///////////////// 棚番別棚卸数データグリッドの表示
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid'
			});

			var dataGrid = this.dataGrid;
			var mainView = this;

			this.dataGrid.render().setData({
				gridopt: {},
				columns: buildColumns(),
				data: [],
				rowDelToggle: true,
				graph: this.graph
			});

			///////////////// 棚卸の修正数データグリッドの表示
			this.dataGrid_ModInvQy = new ClGrid.ClAppGridView({
				el: '#ca_datagrid_ModInvQy'
			});

			var dataGrid_ModInvQy = this.dataGrid_ModInvQy;

			// 初期表示で１行追加する
			var initData = [
                {
                	rackNo: "",
                	invQy: ""
                }
            ];

			this.graph_ModInvQy = new clutil.Relation.DependGraph()
			.add({

				// 棚卸数（修正用）の初期値は棚番が変更されたときに取得する
				id: 'invQy',
				depends: ['rackNo'],
				onDependChange: function(e){

					// 「棚番」が変更された
					var model = e.model;

					// 棚番を取得
					var rackNo = model.get('rackNo');

					// 棚卸数を空にする関数
					var setEmpty = function(){
						model.set({
							invQy: ''
						});
					};

					if (!rackNo){
						// 何も設定されていなければ空にして終わり
						setEmpty();
						return;
					}

					// 棚番が４桁に満たない場合は０埋めする
					while (rackNo.length < 4) {
						rackNo = "0"+rackNo;
					}

					var rackFoundFlag = false;

					if(srchResult) {

						if(srchResult.invItemList) {

							for(var i=0; i < srchResult.invItemList.length; i++) {

								if(srchResult.invItemList[i].rackNo === rackNo) {

									model.set({
										rackNo		: rackNo,
										invQy		: srchResult.invItemList[i].invQy
									});
									rackFoundFlag = true;
									break;
								}
							}
						}
					}

					if(rackFoundFlag === false) {
						setEmpty();
						model.set({
							rackNo		: rackNo
						});
					}
				}
			});

			this.dataGrid_ModInvQy.render().setData({
				gridopt: {},
				columns: buildColumns_ModInvQy(),
				data: initData,
				rowDelToggle: true,
				graph: this.graph_ModInvQy
			});

			/////////////////////////////////////////////////////////

			// 店舗部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = _.bind(function(data) {
				if (data !== null && data.length == 1) {
					data[0].id = data[0].val;
					// 組織表示
					this.srchCondView.relation.fields.clorgcode.setValue(data[0]);
				};
				_.defer(function(){// setFocusを_.defer()で後回しにする
					// 参照ボタンにフォーカスする
					clutil.setFocus(this.$("#ca_btn_store_select"));
				});
			},this);

			// タグコードのロストフォーカスで検索イベント
			this.srchCondView.on('ca_onSearch', this._onSrch);

			// 外部イベントの購読設定
			// Submit と、GET結果のデータを購読する。
			//clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);

			//更新回数ステータス設定
			this.state = {
				recno: "",
				state: 0
			};
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			this.mdBaseView.initUIElement();

			this.srchCondView.initUIElement();

			this.AMPAV0010Selector.render();

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {

			// 初期状態では登録ボタンは押下不可
			this.mdBaseView.render().setSubmitEnable(false);

			// 条件入力部を描画
			this.srchCondView.render();

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {

				// ログインユーザが店舗ユーザの場合は初期フォーカスを対象期にセットする
				clutil.setFocus(this.$("#ca_srchYearMonth"));

			} else {

				// ログインユーザが店舗ユーザ以外の場合は初期フォーカスを店舗にセットする
				clutil.setFocus(this.$("#ca_srchStoreID"));
			};

			// 棚卸の修正数データグリッドを操作不可にする
			this.dataGrid_ModInvQy.setEditable(false);

			return this;
		},

		/**
		 * GET 応答のイベントを受ける
		 */
		_onMDGetCompleted: function(args, e){

			console.log('args.status: [' + args.status + ']');

			this.savedGetData = null;

			// 品種の表示内容をクリア
			this.$('#ca_stditgrpDispName').text("");

			// 商品名の表示内容をクリア
			this.$('#ca_itemName').text("");

			// 棚番別棚卸数データグリッドの表示内容をクリア
			var clearData1 = [];

			this.dataGrid.setData({
				rowDelToggle: true,
				data: clearData1
			});

			// 棚卸の修正数データグリッドの表示内容をクリア
			var clearData2 = [
			                  {
			                	  rackNo: "",
			                	  invQy: ""
			                  }
			                  ];

			this.dataGrid_ModInvQy.setData({
				rowDelToggle: true,
				data: clearData2
			});

			switch(args.status){
			case 'OK':

				// args.data をアプリ個別 View へセットする。
				// 編集可の状態にする。

				this.currentData = args.data;

				// Get応答を画面に表示する
				var flag = this.data2view(args.data);

				if(flag === true) {

					// 検索結果が存在する場合は、以下の処理を実行する

					// 現在年月日を取得
					var opeDate = clcom.getOpeDate();

					if(opeDate < args.data.AMICV0040GetRsp.noticeDate ||
					   opeDate > args.data.AMICV0040GetRsp.invDate) {

						// 本日が店舗通知日～棚卸日の間で無ければ、棚番と棚卸数は入力不可
						this.dataGrid_ModInvQy.setEditable(false);

						// 本日が店舗通知日～棚卸日の間で無ければ、「登録」ボタンは操作不可
						mainView.mdBaseView.setSubmitEnable(false);

					} else {

						if(args.data.AMICV0040GetRsp.invStateID === amcm_type.AMCM_VAL_INV_STATE_INV_NOT_REPORTED) {
							// 棚卸状態が「未報告」の場合のみ棚卸の修正数データグリッドを操作可にする
							this.dataGrid_ModInvQy.setEditable(true);

							// 棚卸の修正数データグリッドの棚番にフォーカスをセットする
							this.dataGrid_ModInvQy.setFocusRowAt(0);

							mainView.mdBaseView.setSubmitEnable(true);

						} else {
							// 棚卸状態が「未報告」でない場合は登録ボタンは操作不可にする
							mainView.mdBaseView.setSubmitEnable(false);
						}
					}

					// 検索領域を入力不可に。
					this.srchCondView.setEnable(false);

				} else {

					// 検索結果０件の場合、登録ボタンは操作不可
					this.dataGrid_ModInvQy.setEditable(false);
					mainView.mdBaseView.setSubmitEnable(false);
				}

				this.state.recno = args.data.rspHead.recno;
				this.state.state = args.data.rspHead.state;

				break;

			case 'DONE':		// 確定済

				// args.data をアプリ個別 View へセットする。
				this.data2view(args.data);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.dataGrid_ModInvQy.setEditable(true);

				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み

				this.dataGrid_ModInvQy.setEditable(true);

				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース

				// 検索結果を画面に表示する
				this.data2view(args.data);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.dataGrid_ModInvQy.setEditable(true);

				break;

			default:
			case 'NG':			// その他エラー。

				this.mdBaseView.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});

				this.dataGrid_ModInvQy.setEditable(false);

				break;
			}
		},

		/**
		 * 検索結果を画面に表示する
		 */
		data2view: function(data){

			var flag = true;

			this.saveData = data.AMICV0040GetRsp;

			srchResult = data.AMICV0040GetRsp;

			// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」

			if(_.isEmpty(this.saveData)){

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				flag = false;

				return flag;
			}

			if(!this.saveData.invID){
				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				flag = false;

				return flag;
			}

			if(!this.saveData.orgID){
				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				flag = false;

				return flag;
			}

			if(!this.saveData.invDate){
				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				flag = false;

				return flag;
			}

			/*if(!this.saveData.noticeDate){
			// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
			clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
			flag = false;

			return flag;
		}*/

			/*if(!this.saveData.invStateID){
			// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
			clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
			flag = false;

			return flag;
		}*/

			if(_.isEmpty(this.saveData.stditgrpDispName)){
				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				flag = false;

				return flag;
			}

			/*if(_.isEmpty(this.saveData.tagCode)){
			// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
			clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
			flag = false;

			return flag;
		}*/

			if(_.isEmpty(this.saveData.itemName)){
				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				flag = false;

				return flag;
			}

			if(_.isEmpty(this.saveData.invItemList)){
				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				flag = false;

				return flag;

			} else {

				/*if((this.saveData.invItemList.length) === 1 && (this.saveData.invItemList[0].rackNo === "0000")){
					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

					// 品種を表示する
					this.$('#ca_stditgrpDispName').text(this.saveData.stditgrpDispName);

					// 商品名を表示する
					this.$('#ca_itemName').text(this.saveData.itemName);

					// 検索結果をデータグリッドに表示する
					this.dataGrid.render().setData({
						gridOptions: {
							autoHeight: false,
							frozenRow: 1
						},
						columns: buildColumns(),
						data: [],
						rowDelToggle: true,
						graph: this.graph
					});

					return flag;
				}*/

				/*if((this.saveData.invItemList.length) === 1 && (this.saveData.invItemList[0].invQy === 0)){
					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

					// 品種を表示する
					this.$('#ca_stditgrpDispName').text(this.saveData.stditgrpDispName);

					// 商品名を表示する
					this.$('#ca_itemName').text(this.saveData.itemName);

					// 検索結果をデータグリッドに表示する
					this.dataGrid.render().setData({
						gridOptions: {
							autoHeight: false,
							frozenRow: 1
						},
						columns: buildColumns(),
						data: [],
						rowDelToggle: true,
						graph: this.graph
					});

					return flag;
				}*/
			}

			// 内容物がある場合 --> 結果表示する。

			// 品種を表示する
			this.$('#ca_stditgrpDispName').text(this.saveData.stditgrpDispName);

			// 商品名を表示する
			this.$('#ca_itemName').text(this.saveData.itemName);

			// 棚番別棚卸数データグリッドの内容を表示
			var data = [];

			for(var i=0; i < this.saveData.invItemList.length; i++) {

				data[i] = {
						rackNo : this.saveData.invItemList[i].rackNo,
						invQy: this.saveData.invItemList[i].invQy
					};
			};

			// 検索結果をデータグリッドに表示する
			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1
				},
				columns: buildColumns(),
				data: data,
				rowDelToggle: true,
				graph: this.graph
			});

			return flag;
		},

		/**
		 * Submit 応答のイベントを受ける
		 */
		_onMDSubmitCompleted: function(args, e){

			switch(args.status){
			case 'DONE':		// 確定済

				// 品種の表示内容をクリア
				this.$('#ca_stditgrpDispName').text("");

				// 商品名の表示内容をクリア
				this.$('#ca_itemName').text("");

				// 棚番別棚卸数データグリッドの表示内容をクリア
				var clearData1 = [];

				this.dataGrid.setData({
					rowDelToggle: true,
					data: clearData1
				});

				// 棚卸の修正数データグリッドの表示内容をクリア
				var clearData2 = [
				                  {
				                	  rackNo: "",
				                	  invQy: ""
				                  }
				                  ];

				this.dataGrid_ModInvQy.setData({
					rowDelToggle: true,
					data: clearData2
				});

				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.dataGrid_ModInvQy.setEditable(false);

				// 検索領域を入力可に。
				this.srchCondView.setEnable(true);

				// 検索条件を保存
				var savedReq = clutil.view2data(this.$('#ca_srchArea'));

				// 保存した検索条件を画面にセット
				//this.srchCondView.deserialize({
				//	srchStoreID: savedReq.srchStoreID,
				//	srchTagCode: ""
				//	srchYearMonth: savedReq.srchYearMonth
				//});

				// 保存した検索条件のうち、店舗を画面にセット
				if (clcom.userInfo && clcom.userInfo.org_id) {
					// 組織表示
					//this.$('#ca_srchStoreID').autocomplete('clAutocompleteItem', {
						//id: savedReq._view2data_srchStoreID_cn.id,
						//code: savedReq._view2data_srchStoreID_cn.code,
						//name: savedReq._view2data_srchStoreID_cn.name
					//});
					if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {
						// 店舗ユーザー
						clutil.inputReadonly($("#ca_srchStoreID"));
						clutil.inputReadonly($("#ca_btn_store_select"));
					}
				}

				this.$("#ca_srchTagCode").val("");

				//タグコードのフィールドカウントを再実装
				clutil.cltxtFieldLimit($("#ca_srchTagCode"));

				// ヘッダメッセージをクリア
				this.mdBaseView.clear();

				// フォーカスをセット
				clutil.setFocus(this.$("#ca_srchTagCode"));

				break;

			case 'CONFLICT':	// 別のユーザによって DB が更新された

				// 全 <input> を readonly 化するなどの処理
				this.dataGrid_ModInvQy.setEditable(false);

				break;

			case 'DELETED':		// 別のユーザによって削除された

				// 全 <input> を readonly 化するなどの処理
				this.dataGrid_ModInvQy.setEditable(false);

				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。

				this.mdBaseView.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				//this.dataGrid_ModInvQy.setEditable(false);

				break;
			}
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){

			// this.AMPAV0010Selector.show(null, null);

			var org_id = null;

			if (clcom.userInfo.unit_id === Number(clcom.getSysparam('PAR_AMMS_UNITID_HD'))){
				// ログインユーザが事業ユニット(AOKI-HD)に属するユーザの場合
				org_id = null;

			} else {
				// それ以外の場合
				org_id = clcom.userInfo.unit_id;
			}

			/*var options = {
				func_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id	: org_id
			};*/

			var options = {
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),		//基本組織を対象
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					           am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
					           am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
				org_id	: org_id,
			    f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ))
			};

			this.AMPAV0010Selector.show(null, null, options);

		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {

			// XXX: 検索リクエスト
			var req = this.buildReq(srchReqDto);

			// 検索条件の「社員コード」に「社員コード」をセットする
			req.AMICV0040GetReq.srchStaffCode = req.AMICV0040GetReq._view2data_srchStaffCode_cn.code;

			// XXX: 検索実行
			this.doSrch(req);
			// this.mdBaseView.fetch();
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行データ（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){

			var defer = clutil.postJSON('AMICV0040', srchReq).done(_.bind(function(data){

				// XXX:検索成功

				// 検索結果を画面に表示する
				var flag = this.data2view(data);

				if(flag === true) {

					// 検索結果が存在する場合は、以下の処理を実行する

					// 現在年月日を取得
					var opeDate = clcom.getOpeDate();

					if(opeDate < data.AMICV0040GetRsp.noticeDate ||
					   opeDate > data.AMICV0040GetRsp.invDate) {

						// 本日が店舗通知日～棚卸日の間でなければ、棚番と棚卸数は入力不可
						this.dataGrid_ModInvQy.setEditable(false);

						// 本日が店舗通知日～棚卸日の間でなければ、「登録」ボタンは操作不可
						mainView.mdBaseView.setSubmitEnable(false);

					} else {

						if(data.AMICV0040GetRsp.invStateID === amcm_type.AMCM_VAL_INV_STATE_INV_NOT_REPORTED) {
							// 棚卸状態が「未報告」の場合のみ棚卸の修正数データグリッドを操作可にする
							this.dataGrid_ModInvQy.setEditable(true);

							// 棚卸の修正数データグリッドの棚番にフォーカスをセットする
							this.dataGrid_ModInvQy.setFocusRowAt(0);

							mainView.mdBaseView.setSubmitEnable(true);

						} else {
							// 棚卸状態が「未報告」でない場合は登録ボタンは操作不可にする
							mainView.mdBaseView.setSubmitEnable(false);
						}
					}

					// ログインユーザの所属店舗がRFID対象店舗の場合は棚番と棚卸数は入力不可
					var user_store = clcom.userInfo['org_id'];
					var json = localStorage.getItem('clcom.rfidstore');
					var rfid_list = JSON.parse(json);
					var rfid_flg = 0;
					if (clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
						if (rfid_list.includes(user_store)) {
							rfid_flg = 1;
						}
					}
					if (rfid_flg == 1) {
						this.dataGrid_ModInvQy.setEditable(false);
						mainView.mdBaseView.setSubmitEnable(false);
					}

					// 検索領域を入力不可に。
					this.srchCondView.setEnable(false);

				} else {

					// 検索結果０件の場合、登録ボタンは操作不可
					this.dataGrid_ModInvQy.setEditable(false);
					mainView.mdBaseView.setSubmitEnable(false);
				}

				this.state.recno = data.rspHead.recno;
				this.state.state = data.rspHead.state;

			}, this)).fail(_.bind(function(data){

				// 検索エラー

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				// エラーメッセージ内容を該当する画面項目に表示する
				if(data.rspHead.fieldMessages){
					this.mdBaseView.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}

				// 棚番別棚卸数の修正データグリッドは操作不可にする
				this.dataGrid_ModInvQy.setEditable(false);

			}, this));

			return defer;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){

			var srchReq;

			if(arguments.length > 0){

				srchReq = argSrchReq;

			}else{
				if(!this.srchCondView.isValid()){
					return null;
				}
				srchReq = this.srchCondView.serialize();
			}

			// 検索条件
			var req = {
				reqHead: {
					//{ name = 'AM_PROTO_COMMON_RTYPE_NEW',        val = 1, description = '新規登録' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_UPD',        val = 2, description = '編集' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_DEL',        val = 3, description = '削除' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_REL',        val = 4, description = '参照' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_CSV',        val = 5, description = 'CSV出力' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_CSV_INPUT',  val = 6, description = 'CSV取込' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_COPY',       val = 7, description = '複製' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_PDF',        val = 8, description = 'PDF出力' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_DELCANCEL',  val = 9, description = '削除復活' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_RSVCANCEL',  val = 10, description = '予約取消' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_TMPSAVE',    val = 11, description = '一時保存' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_APPLY',      val = 12, description = '申請' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_APPROVAL',   val = 13, description = '承認' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_PASSBACK',   val = 14, description = '差戻し' },
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMICV0040GetReq: srchReq
			};
			return req;
		},

		/**
		 * Get リクエストを作る
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			if(!this.srchCondView.isValid()){
				return null;
			}

			var req = this.buildReq();

			return {
				resId : clcom.pageId,
				data: req
			};
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){

			// 編集データをクリア
			this.savedGetData = null;

			// 品種の表示内容をクリア
			this.$('#ca_stditgrpDispName').text("");

			// 商品名の表示内容をクリア
			this.$('#ca_itemName').text("");

			// 棚番別棚卸数データグリッドの表示内容をクリア
			var clearData1 = [];

			this.dataGrid.setData({
				rowDelToggle: true,
				data: clearData1
			});

			// 棚卸の修正数データグリッドの表示内容をクリア
			var clearData2 = [
			                  {
			                	  rackNo: "",
			                	  invQy: ""
			                  }
			                  ];

			this.dataGrid_ModInvQy.setData({
				rowDelToggle: true,
				data: clearData2
			});

			this.dataGrid_ModInvQy.setEditable(false);

			// 検索条件の初期化
			//this.initUIElement();
			// 検索条件を保存
			var savedReq = clutil.view2data(this.$('#ca_srchArea'));

			// 保存した検索条件を画面にセット
			/*this.srchCondView.deserialize({
				srchStoreID: savedReq.srchStoreID,
				srchTagCode: "",
				srchYearMonth: savedReq.srchYearMonth
			});*/

			// 保存した検索条件のうち、店舗を画面にセット
			/*if (clcom.userInfo && clcom.userInfo.org_id) {
				// 組織表示
				this.$('#ca_srchStoreID').autocomplete('clAutocompleteItem', {
					id: savedReq._view2data_srchStoreID_cn.id,
					code: savedReq._view2data_srchStoreID_cn.code,
					name: savedReq._view2data_srchStoreID_cn.name
				});
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {
					// 店舗ユーザー
					clutil.inputReadonly($("#ca_srchStoreID"));
					clutil.inputReadonly($("#ca_btn_store_select"));
				}
			}*/

			// 検索条件を再指定
			this.srchCondView.setEnable(true);

			if (clcom.userInfo && clcom.userInfo.org_id) {

				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {
					// ログインユーザが店舗ユーザの場合

					// 店舗は操作不可にする
					clutil.inputReadonly($("#ca_srchStoreID"));
					clutil.inputReadonly($("#ca_btn_store_select"));

					// 初期フォーカスは対象期にセットする
					clutil.setFocus(this.$("#ca_srchYearMonth"));

				} else {

					// ログインユーザが店舗ユーザ以外の場合、初期フォーカスは店舗にセットする
					clutil.setFocus(this.$("#ca_srchStoreID"));
				}
			}

			if(_.isEmpty(savedReq._view2data_srchStoreID_cn)) {

				this.relation = clutil.FieldRelation.create("default", {
					// 店舗
					clorgcode: {
						el: '#ca_srchStoreID',
						branches: ['unit_id']
					},

					// 棚卸スケジュール用対象期取得部品
					clinventcntschselector: {
						el: this.$('#ca_srchYearMonth')
					}
				}, {
						dataSource: {
						// 上位組織を事業ユニットIDで選択されているものに設
						// 定する => たぶん指定してはだめ
						// p_org_id: unit,
						orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						orglevel_id: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
						f_stockmng: 1
					}
				});
			}

			// XXX:タグコードの表示内容をクリア
			this.$("#ca_srchTagCode").val("");
			//clutil.cltxtFieldLimitReset(this.$("#ca_srchTagCode"));

			//タグコードのフィールドカウントを再実装
			clutil.cltxtFieldLimit($("#ca_srchTagCode"));

			// 登録ボタンを不活性、内部GETデータ破棄、リボンメッセージ非表示・・・など
			this.mdBaseView.setSubmitEnable(false);
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){

			var flag = true;

			// 棚卸の修正数データグリッドの未入力エラー確認
			if(! this.dataGrid_ModInvQy.isValid()){
				clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
				flag = false;
			};

			return flag;
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId){

			// editモードをかりとる
			this.dataGrid_ModInvQy.stopEditing();

			// エラーチェック
			if(this.isValid() == false){
				return;
			};

			// 棚卸の修正数テーブルの内容を取得
			var modInvQyList = this.dataGrid_ModInvQy.getData({
				delflag: false
			});

			var invItem = {};

			var rackNo_flag = false;

			for(var i=0; i < this.saveData.invItemList.length; i++) {

				if(modInvQyList[0].rackNo === this.saveData.invItemList[i].rackNo) {

					rackNo_flag = true;

					// 棚番別棚卸数データグリッドに存在する棚番を入力した場合
					invItem = {

							invitemID : this.saveData.invItemList[i].invItemID,
							invID :		this.saveData.invItemList[i].invID,
							orgID :		this.saveData.invItemList[i].orgID,
							itemID:		this.saveData.invItemList[i].itemID,
							tagCode:	this.saveData.invItemList[i].tagCode,
							rackNo:		modInvQyList[0].rackNo,
							// 棚卸数には「入力値－左側の数値」をセット
							invQy:		modInvQyList[0].invQy - this.saveData.invItemList[i].invQy
					};

					break;
				}
			};

			if(rackNo_flag === false) {
				// 棚番別棚卸数データグリッドに存在しない棚番を入力した場合
				invItem = {

						invitemID : 0,
						invID :		this.saveData.invItemList[0].invID,
						orgID :		this.saveData.invItemList[0].orgID,
						itemID:		this.saveData.invItemList[0].itemID,
						tagCode:	this.saveData.invItemList[0].tagCode,
						rackNo:		modInvQyList[0].rackNo,
						invQy:		modInvQyList[0].invQy
				};

			};

			var tmp = savedSrchReq;
			//var staffcode = this.$("#ca_srchStaffCode").val;
			var staffcode = savedSrchReq.srchStaffCode;

			var reqObj = {
				reqHead: {
					opeTypeId: opeTypeId,
					recno: this.state.recno,
					state: this.state.state
				},
				AMICV0040UpdReq: {
					srchStaffCode: staffcode,
					invItem: invItem
				}
			};
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		/**
		 * 店舗条件を初期表示する
		 */
		loadCond: function(model){
			if(_.isEmpty(model)){
				return;
			}

			if(model.condModel){
				this.srchCondView.deserialize(model.condModel);
			}
		},

		_eof: 'AMICV0040.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){

		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView(clcom.pageArgs).initUIElement().render();

		if (clcom.userInfo && clcom.userInfo.org_id) {

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {

				var condModel = {
					_view2data_srchStoreID_cn: {
						id: clcom.userInfo.org_id,
						code: clcom.userInfo.org_code,
						name: clcom.userInfo.org_name,
						unit_id: clcom.userInfo.unit_id
					},
					srchStoreID: clcom.userInfo.org_id
				};

				mainView.loadCond({
					condModel: condModel
				});

				clutil.inputReadonly($("#ca_srchStoreID"));
				clutil.inputReadonly($("#ca_btn_store_select"));
			}
		}
	}).fail(function(data){

		console.error('iniJSON failed.');
		console.log(arguments);

		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});
});
