//セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

var OpeType = {
		AMMDV0050_OPETYPE_SAVE:		101,	// 一時保存
		AMMDV0050_OPETYPE_APPLY:	102,	// 申請
		AMMDV0050_OPETYPE_RETURN:	103,	// 差戻し
		AMMDV0050_OPETYPE_APPROVE1: 104,		// 1次承認済
		AMMDV0050_OPETYPE_APPROVE: 105,		// 承認済

		AMMDV0050_OPETYPE_NUM: 100,			//TypeID調整係数
};

$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));



	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		events: {
			"change #ca_unitID"			:	"_onUnitIDSelect",				// 事業ユニット変更
			"change #ca_disctypeID"			:	"_onDisctypeSelect",		// 値下げ区分変更

			"blur .ca_limitInput"	: "_onLimitInpuBlur",					//フィールドカウンター再計算
			"click #ca_fileDel_btn" 		: "_onDelFileClick",			//ファイル削除押下

			'click #ca_sample_download'		: '_onSampleDLClick',		// ExcelサンプルDLボタン押下

			"click .cl_download" 			: "_onCSVClick",				//CSV出力押下
			"click #ca_attachfileName" 		: "_onFileDLClick",				//添付ファイル押下

			"click #ca_btn_store"			: "_onStoreSelClick"			// 店舗選択補助画面起動

			// XXX アコーディオンのアクション制御はここでするかなー？
		},

		/**
		 * 事業ユニットが変更されたら店舗リストリセット
		 */
		_onUnitIDSelect: function(){
			$("#ca_orgID").val("");
			this.storeList = [];
		},

		initialize: function(opt){
			_.bindAll(this);

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '期間値下',
					//subtitle: '登録',
					confirmLeaving: true,		//戻る押下時のダイアログ設定
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					btn_csv: true,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					//「戻る」等の押下時の警告ダイアログ
					isConfirmLeaving: this._isConfirmLeaving,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined
				};

				if(o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					// 参照モード以外は、下部 Ope ボタンをカスタマイズする。
					_.extend(mdOpt, {
						opeTypeId: [
							{
								opeTypeId: OpeType.AMMDV0050_OPETYPE_SAVE,
								label: '一時保存'
							},
							{
								opeTypeId: OpeType.AMMDV0050_OPETYPE_APPLY,
								label: '申請'
							},
						],
						btn_cancel: true,
						btn_submit: true,
						btn_csv: true
					});
				}

				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				//clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				this.f_confirm = false;
				// fall through
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			}
			this.opeTypeId = fixopt.opeTypeId;	// 処理区分を保存

			// validatorエラー時の表示領域
			this.validator = clutil.validator($('#ca_search'), {
				echoback		: $('.cl_echoback').hide()
			});

			//更新回数ステータス設定
			this.state = {
				recno: "",
				state: 0,
			},
			//添付ファイルDL用
			this.fileURL = "";

			//画面ヘルプのツールチップ表示
			$("#tp_code").tooltip();
			//フィールドカウント
			clutil.cltxtFieldLimit($("#ca_Name"));
			clutil.cltxtFieldLimit($("#ca_reject"));


			//グリッド
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid',
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ。
			});
			//グリッド新規行追加
			this.listenTo(this.dataGrid, {
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {};
					gridView.addNewItem(newItem);
				},
				'cell:change': function(e){
					console.log('*** cell:change', e);

					// 商品取得エラーチェック(★)
					if (e.cell === 1){
						this.dataGrid.isValidCell(e.item, 'mfrItCode');
					}
				}
			});

			//グリッドリレーション
			this.graph = new clutil.Relation.DependGraph()
			.add({
				id: 'mfrItCode',
				depends: ['maker.id'],
				onDependChange: function(e){

					e.model.set({
						mfrItCode: '',
						itemID: 0,
						itemCode: '',
						itemName: '',
						subClass1Name: '',
						subClass2Name: '',
						retailPriceOrg: '',
						retailPriceDiscOrg: '',
						discRt: '',
						retailPriceDisc: ''
					});
				}
			})
			.add({
				id: 'itemName',
				depends: ['maker.id', 'mfrItCode'],
				onDependChange: function(e){

					var setData = clutil.view2data($("#ca_search"));

					var maker_code = e.model.get('mfrItCode');
					var maker_id = e.model.get('maker.id');
					var itgrp_id = setData.itgrpID;

					var fail = function(mfrItCodeError){
						e.model.set({
							itemID: 0,
							itemCode: '',
							itemName: '',
							subClass1Name: '',
							subClass2Name: '',
							retailPriceOrg: '',
							retailPriceDiscOrg: '',
							discRt: '',
							retailPriceDisc: '',

							// 商品の取得に失敗した場合は呼び出し元でエラー文字列を設定する。(★)
							mfrItCodeError: mfrItCodeError
						});
					};

					if (maker_code && maker_id && itgrp_id){
						var done = e.async();

						//検索用オブジェクト
						var obj = {
								maker_code : maker_code,	//メーカー品番
								itgrp_id : itgrp_id,		//品種ID
								maker_id : maker_id			//メーカーID
						};

						clutil.clmakeritemcode2item(obj)
						.done(function(data){
							if (data.head.status){
								// 何かエラーが発生した(1)(★)
								fail(clmsg[data.head.message]);
								return;
							}
							var rec  = data.rec;

							e.model.set({
								itemID: rec.itemID,
								itemName: rec.itemName,					//商品名
								subClass1Name: rec.sub1Name,			//サブ1
								subClass2Name: rec.sub2Name,			//サブ2
								retailPriceOrg: clutil.comma(rec.price),			//元上代
								retailPriceDiscOrg: clutil.comma(rec.sale_price),	//変更前上代
								discRt: 0,						//値下率
								retailPriceDisc: rec.sale_price,	//変更後上代

								// 商品が取得できたのでエラーをクリアする(★)
								mfrItCodeError: null
							});
						})
						.fail(function(){
								// 何かエラーが発生した(2)(★)
								fail('失敗');
							})
						.always(done);
					}else{
						// 依存パラメータが未設定のとき
						// エラーではないのでエラー文字列は渡さない(★)
						fail();
					}
				}
			});
		},

		/**
		 * フィールドカウンター再計算
		 */
		_onLimitInpuBlur: function(e){
			clutil.cltxtFieldLimit($(e.target));
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var _this = this;

			this.mdBaseView.initUIElement();
			// 値下区分
			clutil.cltypeselector({
				$select: this.$("#ca_disctypeID"),
				kind: amcm_type.AMCM_TYPE_DISC_METHOD,
				ids: [
					amcm_type.AMCM_VAL_DISC_METHOD_RATE,
					amcm_type.AMCM_VAL_DISC_METHOD_PRICE
				],
				unselectedflag: 1
			});

			// カレンダー
			this.fromDatePicker = clutil.datepicker(this.$('#ca_fromDate'));
			this.toDatePicker = clutil.datepicker(this.$('#ca_toDate'));

			$('#ca_fromDate').datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
			$('#ca_toDate').datepicker('setIymd', clcom.max_date);

			//フィールドリレーション
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_itgrpID",
				},
			});
			this.fieldRelation.done(function() {
			});

			if(clcom.getUserData().unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| clcom.getUserData().unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				this.setUnit({
					unitID: clcom.getUserData().unit_id	// 事業ユニット
				});
				//clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}

			//承認状態によってフッタボタンを再描画
			this.chkState(null);


			//サブ画面配置
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_multiple_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector.render();


			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体

					var sendData = {
							discSale : clutil.view2data(this.$("#ca_search"))
					};

					var request = {
						AMMDV0050UpdReq: sendData
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMMDV0050',
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

				//リジェクトされたファイルがあればダウンロード
				if(!_.isEmpty(data.rspHead.uri)){
					var uri = data.rspHead.uri;
					var newWindow = false;
					clutil.download({url: uri, newWindow: newWindow});
				}
			});

			// 取込処理が成功した。返ってきたデータからテーブル作成。
			this.opeCSVInputCtrl.on('done', function(data){
				var list = data.AMMDV0050GetRsp.discSaleItem;
				var sDate = clutil.view2data($("#ca_search"));
				var rtFlag = sDate.disctypeID;
				_this.makeTable(list, rtFlag, true);
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで

			// ---------------------------------------- [添付ファイルアップロード]
			var opeFileInputCtrl = clutil.View.buildFileUploadButtonView(this.$("#ca_fileUp_btn"));
			opeFileInputCtrl.on('success', _.bind(function(file){
				//ファイルID,名称反映
				var line = '<a id="ca_attachfileName" class="cl_filedownld" target="_blank">' + file.filename + '</a>';
				var id = file.id;

				$("#ca_label").html(line);
				$("#ca_label").attr("data-original-title", file.filename);
				$("#ca_fileDiv").find("span").tooltip({html: true});
				$("#ca_attachfileID").val(id);

				this.fileURL = file.uri;
			}, this));
			// ---------------------------------------- [添付ファイルアップロード]：ここまで

			//ボタン位置調整
			this.$("form").addClass("flleft");

			//店舗リスト
			this.storeList = [];
			return this;
		},

		/**
		 * 承認状況を設定する
		 * */
		chkState:function(stateID){
			// 処理区分
			var ope_id = this.opeTypeId;
			// 承認状態ID
			var approveTypeID = 0;
			if(stateID != null){
				approveTypeID = stateID;
			}
			// 遷移元画面
			var srcId = clcom.srcId;

			var opt = {
				opeTypeId: ope_id,
				approveTypeID: approveTypeID,
				srcId: srcId,
			};
			return this.setFooterButtons(opt);
		},

		/**
		 * 戻るなどの押下時に警告を出すかの判断
		 * @param isSubmitBlocking
		 * @param pgIndex
		 * @returns
		 */
		_isConfirmLeaving: function(isSubmitBlocking, pgIndex) {
			var flg = isSubmitBlocking;
			if (!flg && this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && !this.f_confirm) {
				flg = true;
			}
			if(this.f_force_confirm == false){
				flg = false;
			}
			return flg;
		},

		/**
		 * フッターボタンを各モード用に設定する
		 * @param opt
		 */
		setFooterButtons: function(opt) {
			//リードオンリーにするかどうかのフラグ
			var r_flag = false;
			//差し戻し理由欄は通常リードオンリー
			this.rej_flag = true;

			//通常のフッタ
			var opeTypeId = [
			 				{
			 					opeTypeId: OpeType.AMMDV0050_OPETYPE_SAVE,
			 					label: '一時保存'
			 				},
			 				{
			 					opeTypeId: OpeType.AMMDV0050_OPETYPE_APPLY,
			 					label: '申請'
			 				},
			 			];

			if (opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// 新規作成の場合はデフォルトのまま
				// 差戻し履歴ヘッダは隠す
				$("#ca_table_reject").hide();
				clutil.viewReadonly($("#ca_rejectArea"));
			}
			else if (opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				// 編集の場合
				if (opt.approveTypeID == amcm_type.AMCM_VAL_APPROVE_APPLY) {
					//一次承認申請の場合
					//リードオンリー化
					r_flag = true;
					if (opt.srcId == "AMMDV0040") {
						// 期間値下一覧からの遷移なら、キャンセルのみ
						opeTypeId = -1;
					}
					else{
						// 承認一覧からの遷移
						opeTypeId = [
							{
								opeTypeId: OpeType.AMMDV0050_OPETYPE_RETURN,
								label: '差戻し'
							},
							{
								opeTypeId: OpeType.AMMDV0050_OPETYPE_APPROVE1,
								label: '承認'
							},
						];
						//差し戻し理由欄は編集可能
						this.rej_flag = false;
					}
				}
				else if (opt.approveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE1) {
					//最終承認申請の場合
					//リードオンリー化
					r_flag = true;
					if (opt.srcId == "AMMDV0040") {
						// 期間値下一覧からの遷移なら、キャンセルのみ
						opeTypeId = -1;
					}
					else{
						// 承認一覧からの遷移
						opeTypeId = [
							{
								opeTypeId: OpeType.AMMDV0050_OPETYPE_RETURN,
								label: '差戻し'
							},
							{
								opeTypeId: OpeType.AMMDV0050_OPETYPE_APPROVE1,
								label: '承認'
							},
						];
						//差し戻し理由欄は編集可能
						this.rej_flag = false;
					}
				}
			}
			else if (opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
				//参照モードの場合はフッタを出さない
				opeTypeId = opt.opeTypeId;
				this.mdBaseView.options.btn_cancel = false;
				this.mdBaseView.options.btn_submit = false;
			}
			else {
				// その他は通常画面と同じ
				opeTypeId = opt.opeTypeId;
			}
			// ボタンの内容を設定して表示を変更
			this.mdBaseView.options.opeTypeId = opeTypeId;
			this.mdBaseView.renderFooterNavi();


			return r_flag;
		},

		/**
		 * フッタを「一覧へ戻る」へ書き換える
		 */
		backFooter:function(){
			opeTypeId = -1;

			// ボタンの内容を設定して表示を変更
			this.mdBaseView.options.opeTypeId = opeTypeId;
			this.mdBaseView.renderFooterNavi();
		},

		/**
		 * 検索リクエストパケットの設定値を UI へセットする。
		 */
		setUnit: function(obj){
			this.deserializing = true;
			try{
				var dto = _.extend({}, obj);
				clutil.data2view(this.$("#ca_srchUnitIDArea"), dto);
			}finally{
				this.deserializing = false;
			}
		},

		/**
		 * 添付ファイル削除押下
		 */
		_onDelFileClick: function(){
			$("#ca_label").html("");
			$("#ca_attachfileID").val("");
			$("#ca_label").removeAttr("data-original-title");
			this.fileURL = "";
		},

		/**
		 * 添付ファイルダウンロード
		 */
		_onFileDLClick: function(){
			//添付ファイルがあればダウンロード
			if(!_.isEmpty(this.fileURL) && this.fileURL != ""){
				var uri = this.fileURL;
				var newWindow = false;
				clutil.download({url: uri, newWindow: newWindow});
			}
		},

		/**
		 * サンプルファイルダウンロード
		 */
		_onSampleDLClick: function() {
			//this.doCSV(AMMPV0010Req.AMMPV0010_SAMPLE);
			//window.location = "/public/sample/品種別構成比登録サンプル.xlsx";
			var sampleURL = "/public/sample/期間値下サンプル.xlsx";

			clutil.download(sampleURL);
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			this.mdBaseView.fetch();	// データを GET してくる。
			this.makeDefaultTable();	//グリッドデフォ表示

			return this;
		},


		/**
		 * 新規作成時にデフォルト空欄表示
		 */
		makeDefaultTable: function(){
			this.dataGrid.render();

			var list = [];
			var i = 0;
			for (;i < 5; i++){
				list.push({

				});
			}

			this.renderGrid(list, false);
			return this;
		},

		/**
		 * 編集不可化
		 */
		readOnly: function(){
			//画面上部
			clutil.viewReadonly($("#ca_search"));

			//画面下部
			clutil.viewReadonly($("#ca_upld"));
			clutil.viewReadonly($("#ca_csv_uptake"));
			clutil.viewReadonly($("#ca_table_tbody"));

			//参照・削除の際はコメント欄編集不可化
			if(this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					|| this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				clutil.viewReadonly($("#ca_rejectArea"));
			}

			//テーブル部編集不可
			this.dataGrid.setEnable(false);
		},

		/**
		 * 編集可化
		 */
		removereadOnly: function(){
			//画面上部
			clutil.viewRemoveReadonly($("#ca_search"));

			//画面下部
			clutil.viewRemoveReadonly($("#ca_upld"));
			clutil.viewRemoveReadonly($("#ca_csv_uptake"));
			clutil.viewRemoveReadonly($("#ca_table_tbody"));

			//依頼番号のみ編集不可
			clutil.viewReadonly($("#ca_CodeArea"));
			this.setFocus();

			//テーブル部編集不可
			this.dataGrid.setEnable(true);
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			//「戻る」押下時の確認ダイアログを出さない
			this.f_force_confirm = false;
			// テーブル上のメッセージをクリア
			this.dataGrid.clearAllCellMessage();

			switch(args.status){
			case 'DONE':		// 確定済
				// TODO: args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.readOnly();
				clutil.viewReadonly($("#ca_rejectArea"));
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// TODO: args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.readOnly();
				clutil.viewReadonly($("#ca_rejectArea"));
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> を readonly 化するなどの処理。
				this.readOnly();
				clutil.viewReadonly($("#ca_rejectArea"));
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// TODO: 入力値エラー情報が入っていれば、個別 View へセットする
				var cellMessages = [];
				var list = this.dataGrid.getData({ delflag: false });
				var error = args.data.rspHead.fieldMessages;
				var argsMessage = args.data.rspHead.message;

				for(var i=0; i<error.length; i++){
					var line = error[i].lineno;
					var rowDto = list[line];
					var rowId = rowDto[this.dataGrid.dataView.idProperty];

					if(error[i].message == "EMD0011"){
						//品種違いエラー
						cellMessages.push({
							rowId: rowId,
							colId: 'mfrItCode',
							level: 'error',
							message: clmsg.EMD0011
						});
					}
					else if(error[i].message == "EMD0010"){
						var lim = $("#ca_limitDate").val();

						//未来日に値下変更予定がある
						cellMessages.push({
							rowId: rowId,
							colId: 'mfrItCode',
							level: 'error',
							message: clutil.fmtargs(clmsg.EMD0010, [lim])
						});
					}
					else if (error[i].message == "EMD0013") {
						// マークダウン存在警告
						cellMessages.push({
							rowId: rowId,
							colId: 'mfrItCode',
							level: 'alert',
							message: clutil.fmtargs(clmsg.EMD0013, [error[i].args[0]])
						});
					}
					else if (error[i].message == "EMD0014") {
						// 組合せ販売マスタ存在エラー
						cellMessages.push({
							rowId: rowId,
							colId: 'mfrItCode',
							level: 'error',
							message: clutil.fmtargs(clmsg.EMD0014, [error[i].args[0], error[i].args[1]])
						});
					}
					else{
						clutil.mediator.trigger('onTicker', args.data);
					}
				}
				if (argsMessage == 'WMD0003') {
					// 警告ダイアログを表示
					var updReq = this.savedUpdReq;
					var send = {
							resId:	"AMMDV0050",
							data: updReq,
							confirm: clmsg.WMD0003,
					};
					this.mdBaseView.forceSubmit(send);
				}

				if(!_.isEmpty(cellMessages)){
					this.dataGrid.setCellMessage(cellMessages);
				}
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			var data = args.data;
			var getRsp = data.AMMDV0050GetRsp;

			var serchData = getRsp.discSale;
			var tblData = getRsp.discSaleItem;
			var storeData = getRsp.storeSel;
			var headData = data.rspHead;

			//差し戻し理由リスト
			this.rejectList = serchData.rejectList;

			//日付警告リセット
			this.validator.clearErrorMsg($("#ca_fromDate"));
			this.validator.clearErrorMsg($("#ca_toDate"));

			if(this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				//編集(承認)時のみ
				if(serchData.stateID == amcm_type.AMCM_VAL_APPROVE_APPLY
						|| serchData.stateID == amcm_type.AMCM_VAL_APPROVE_APPROVE1){
					//[申請][一時承認済]のステータスで、
					//[店舗出力日][対応期限][アラーム表示期限]が切れている場合は日付を修正
					var today = clcom.getOpeDate();
					var fromDate = today;
					var toDate = today;


					//TODO:デートピッカーの日付(文字列)と、サーバー日付(数値)の比較方法検討

					if(today > serchData.fromDate){
						//店舗出力日が過ぎていたら日付変更
						this.fromDatePicker.datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
						fromDate = $('#ca_fromDate').val();
						//日付を文字から数値型へ変換
						fromDate = clutil.dateFormat(fromDate, 'yyyymmdd');
						//ペイン反映用
						serchData.fromDate = fromDate;

						this.validator.setErrorMsg($("#ca_fromDate"), clmsg.WMD0002, 'alert');

						if(fromDate >= serchData.toDate){
							//店舗出力日 >= 対応期限となってしまったら
							this.toDatePicker.datepicker('setIymd', clutil.addDate(fromDate, 3));
							toDate = $('#ca_toDate').val();
							//日付を文字から数値型へ変換
							fromDate = clutil.dateFormat(fromDate, 'yyyymmdd');
							serchData.toDate = toDate;
							this.validator.setErrorMsg($("#ca_toDate"), clmsg.WMD0002, 'alert');
						}

						clutil.mediator.trigger('onTicker', clutil.getclmsg('WMD0002'));
					}
				}
			}

			// TODO: args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
			this.makeData(serchData);	//条件部作成

			var rtFlag = serchData.disctypeID;
			this.makeTable(tblData, rtFlag, false);	//テーブル部作成
			this.makeRejectTable(this.rejectList);		//差し戻しテーブル部作成

			this.state.recno = headData.recno;
			this.state.state = headData.state;

			//店舗リストを作成
			this.setStoreList(storeData);
			var storeName = "";
			for(var i=0; i<storeData.length; i++){
				if(i==0){
					storeName = storeData[i].storeCode + ":" + storeData[i].storeName;
				}
				else{
					storeName = storeName + "," + storeData[i].storeCode + ":" + storeData[i].storeName;
				}
			}
			$("#ca_orgID").val(storeName);

			//承認状態によってフッタボタンを再描画
			//返り値によってリードオンリーかどうか判定
			var r_flag = this.chkState(serchData.stateID);

			var roCtrlFunc = null;
			switch(args.status){
			case 'OK':
				// TODO: args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				//起動モードで分岐
				switch (this.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					roCtrlFunc = this.removereadOnly;

					var val = $("#ca_disctypeID").selectpicker('val');
					this.onChangeDisctype(val);

					//差し戻し理由の編集可能判定
					if(this.rej_flag == false){
						clutil.viewRemoveReadonly($("#ca_rejectArea"));
					}
					else{
						clutil.viewReadonly($("#ca_rejectArea"));
					}
					this.f_confirm = true;

					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
					//編集禁止
					roCtrlFunc = this.readOnly;
					break;
				default:
					//なんか
					break;
				}

				break;
			case 'DONE':		// 確定済
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				roCtrlFunc = this.readOnly;
				clutil.viewReadonly($("#ca_rejectArea"));
				//フッタを「一覧に戻る」とする
				this.backFooter();
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				roCtrlFunc = this.readOnly;
				clutil.viewReadonly($("#ca_rejectArea"));
				//フッタを「一覧に戻る」とする
				this.backFooter();
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				roCtrlFunc = this.readOnly;
				clutil.viewReadonly($("#ca_rejectArea"));
				//フッタを「一覧に戻る」とする
				this.backFooter();
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				roCtrlFunc = this.readOnly;
				clutil.viewReadonly($("#ca_rejectArea"));
				//フッタを「一覧に戻る」とする
				this.backFooter();
				break;
			}

			if(r_flag == true){
				//承認状態によるフラグがあればリードオンリーに
				roCtrlFunc = this.readOnly;
			}

			clutil.cltxtFieldLimit($("#ca_Name"));
			clutil.cltxtFieldLimit($("#ca_reject"));

			if(_.isFunction(roCtrlFunc)){
				// 品種オートコンプリートの setter と、clutil.viewReadonly() との
				// 実行タイミング競合調整のため、_.defer 使用。
				// オートコンプリート値セットした後に、viewReadonly() 順で。
				_.defer(roCtrlFunc);
			}
		},

		/**
		 * 検索条件描画
		 */
		makeData: function(serchData) {
			//テキストボックス系反映
			clutil.data2view($('#ca_search'), _.extend({}, serchData, {
//				itgrpID: {
				_view2data_itgrpID_cn: {
					id: serchData.itgrpID,
					name: serchData.itgrpName,
					code: serchData.itgrpCode
				}
			}));


			//値下げ区分フラグ作成
			var disc = serchData.disctypeID;
			this.onChangeDisctype(disc);

			//添付ファイル作成
			if(serchData.attachfileName != ""){
				var line = '<a id="ca_attachfileName" class="cl_filedownld" target="_blank">' + serchData.attachfileName + '</a>';
				$("#ca_label").html(line);
				$("#ca_label").attr("data-original-title", serchData.attachfileName);
				$("#ca_fileDiv").find("span").tooltip({html: true});
				$("#ca_attachedFileID").val(serchData.attachfileID);
				this.fileURL = serchData.attachfileURL;
			}
		},

		/**
		 * テーブル描画
		 * @param list
		 */
		makeTable: function(list, rtFlag, csvFlag) {
			for(var i=0; i<list.length; i++){
				//メーカーオブジェクト作成
				list[i].maker = {
						name: list[i].mfrName,
						code: list[i].mfrCode,
						id: list[i].mfrID
				};

				if(rtFlag == 3){
					//価格指定なら値下率リセット
					list[i].discRt = "";
				}
				else if(csvFlag == true){
					//値下率なら計算
					var rt = Number(list[i].discRt);
					var pdo = Number(list[i].retailPriceDiscOrg);

					var down = Math.ceil(pdo * rt / 100);
					list[i].retailPriceDisc = pdo - down;
				}

				//カンマが必要な項目
				list[i].retailPriceOrg = clutil.comma(list[i].retailPriceOrg);
				list[i].retailPriceDiscOrg = clutil.comma(list[i].retailPriceDiscOrg);

			}
			this.renderGrid(list, true);

			return;
		},

		/**
		 * 店舗参照押下
		 */
		_onStoreSelClick: function(e) {
			var _this = this;

			//既存チェック復元用引数
			var list = _this.storeList;
			var unit = $("#ca_unitID").val();

			_this.AMPAV0010Selector.show(list, null,{
				org_id: unit,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),		//基本組織を対象
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
				f_stockmng: 1	//在庫有無フラグ(1:在庫有り店舗のみ)
			});

			// 選択サブ画面復帰処理
			_this.AMPAV0010Selector.okProc = function(data) {
				var $storeID = _this.$("#ca_orgID");
				var source = "";
				var tip = "";
				_this.storeList = data;

				if (data !== null && data.length != 0) {
					for(var i=0; i<data.length; i++){
						var code = data[i].code;
						var name = data[i].name;
						if(i == 0){
							source =  code + ":" + name;
							tip =  code + ":" + name;
						}
						else{
							source = source + "," + code + ":" + name;
							if(i < 10){
								tip = tip + "," + code + ":" + name;
							}
							else if(i == 10){
								tip = tip + "...";
							}
						}
					}
					$storeID.val(source);
				}
				_.defer(function(){// setFocusを_.defer()で後回しにする
					$(e.target).focus();
					if (data !== null && data.length != 0) {
						$storeID.attr("data-original-title", tip);
						$storeID.tooltip({html: true});
					}
				});
			};
		},

		/**
		 * 差し戻し理由テーブル描画
		 * @param list
		 */
		makeRejectTable: function(list) {
			//テーブル初期化
			var $tbody = $("#ca_table_reject_tbody");
			$tbody.empty();

			if(list.length == 0){
				$("#ca_table_reject").hide();
				$("#ca_reject").val("");
			}
			else{
				$("#ca_table_reject").show();
				for(var i=0; i<list.length; i++){
					var $tbody = $("#ca_table_reject_tbody");
					var $tmpl = $("#ca_tbody_template");
					$tmpl.tmpl({}).appendTo($tbody);

					// 追加した行定義
					var $tr = $tbody.find('tr:last');

					$tr.find(".ca_rejectNum").html(i+1);			//理由番号
					$tr.find(".ca_reject").html(list[i].reject);	//理由
				}
				clutil.initUIelement($('#ca_table_reject'));
			}
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			var chkData = this.options.chkData[pgIndex];

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ		・・・これ、必要なの？					【確認】
				reqPage: {
				},
				// 取引先マスタ検索リクエスト
				AMMDV0050GetReq: {
					srchID: chkData.id				// 指示ID
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMMDV0050UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMMDV0050',
				data: getReq
			};
		},


		/**
		 * 値下げ区分変更
		 */
		_onDisctypeSelect: function(e){
			console.info(e);
			var $target = $(e.target);
			var val = $target.selectpicker('val');
			this.onChangeDisctype(val);
		},

		/**
		 * 値下げ区分値によって、グリッドの「値下げ率(%)」「変更後上代(税抜)」列の編集可否をトグルする。
		 */
		onChangeDisctype: function(selectedDiscType){
			var discRateEditable = false;
			var discPriceEditable = false;
			switch(parseInt(selectedDiscType)){
			case amcm_type.AMCM_VAL_DISC_METHOD_RATE:
				// 値下げ率(%)
				discRateEditable = true;
				discPriceEditable = false;
				break;
			case amcm_type.AMCM_VAL_DISC_METHOD_PRICE:
				// 変更後上代(税抜)
				discRateEditable = false;
				discPriceEditable = true;
				break;
			default:
				// 両方とも表示のみ。
			}
			this.gridEditCtrl.discRateEditable = discRateEditable;
			this.gridEditCtrl.discPriceEditable = discPriceEditable;

			// グリッド再描画
			mainView.dataGrid.grid.invalidate();

			//エラーリセット
			var list = this.dataGrid.getData({ delflag: false });
			for(var i=0; i<list.length; i++){
				var rowDto = list[i];
				var rowId = rowDto[this.dataGrid.dataView.idProperty];

				if(discRateEditable == true){
					//価格エラーリセット
					this.dataGrid.clearCellMessage(rowId, "retailPriceDisc");
				}
				else{
					//値下率エラーリセット
					this.dataGrid.clearCellMessage(rowId, "discRt");
				}
			}
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			var unit = clcom.getUserData().unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				clutil.viewReadonly($("#ca_srchUnitIDArea"));
				if(clutil.getclsysparam('PAR_AMMS_ORG_PRICE') == 0){
					clutil.setFocus($('#ca_itgrpID'));
				}
				else{
					clutil.setFocus($('#ca_orgID'));
				}
			}
			else{
				clutil.setFocus($('#ca_unitID'));
			}
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(list){
			var retStat = true;

			var data = clutil.view2data($("#ca_search"));
			var today = clcom.getOpeDate();
			var stDate = data.fromDate;
			//var edDate = data.toDate;


			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				//最終来店日
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

			//値下期間が過去日
			if(today >= stDate){
				this.validator.setErrorMsg($("#ca_fromDate"), clmsg.EGM0047);
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				//this.validator.setErrorFocus();
				return false;
			}

			//グリッドエラーリセット
			this.dataGrid.clearAllCellMessage();
			//エラー関数作成
			var tailIsEmptyFunc = function(dto){
				var rt = null;
				var sel = $("#ca_disctypeID").val();

				if(sel == 2){
					//率指定
					rt = dto.discRt;
				}
				else if(sel == 3){
					//価格指定
					rt = dto.retailPriceDisc;
				}

				if(dto.maker && (dto.maker.id || dto.maker.name)){
					return false;
				}
				if(!_.isEmpty(dto.mfrItCode)){
					return false;
				}
				if(!_.isEmpty(rt)){
					return false;
				}
				if(!(_.isEmpty(dto.itemID) || dto.itemID == 0)){
					return false;
				}
				return true;	// 当該 dto は空であると判断。
		    };

		    var errors = this.dataGrid.validate(tailIsEmptyFunc);
		    if(!_.isEmpty(errors)){
		        this.dataGrid.setCellMessage(errors);
		        retStat = false;
		    }


			// コード重複チェック用
			var dupCodeChkMap = {
				// キー： itemCode
				// 値　： 999		// 文字列なら初出行の rowId。数値型なら出現回数。
			};
			var emptyCell = 0;
			var cellMessages = [];
			for(var i=0; i<list.length; i++){
				var rowDto = list[i];
				var rowId = rowDto[this.dataGrid.dataView.idProperty];		// 行ID, プロパティ名は "_cl_gridRowId"

				// コード重複チェック
				var code = rowDto.itemID;
				//-----------------
				// コード重複チェック
				if(code != 0 && code != null && code != ""){
					var dupCodeRowId = dupCodeChkMap[code];
					if(dupCodeRowId == null){
						// 初出コード
						dupCodeChkMap[code] = rowId;
					}else if(_.isString(dupCodeRowId)){
						// 出現２回目 - 値は初出時の行ID
						dupCodeChkMap[code] = 2;
						// 初出行のエラーメッセージをセット
						cellMessages.push({
							rowId: dupCodeRowId,
							colId: 'mfrItCode',
							level: 'error',
							message: clutil.fmtargs(clmsg.EMS0065, ["メーカー品番"])
						});
						// 重複行のエラーメッセージをセット
						cellMessages.push({
							rowId: rowId,
							colId: 'mfrItCode',
							level: 'error',
							message: clutil.fmtargs(clmsg.EMS0065, ["メーカー品番"])
						});
						retStat = false;
					}else{
						// 出現３回目以上
						dupCodeChkMap[code]++;
						// 重複行のエラーメッセージをセット
						cellMessages.push({
							rowId: rowId,
							colId: 'mfrItCode',
							level: 'error',
							message: clutil.fmtargs(clmsg.EMS0065, ["メーカー品番"])
						});
						retStat = false;
					}
				}
				else{
					emptyCell++;
				}
			}
			if(!_.isEmpty(cellMessages)){
				this.dataGrid.setCellMessage(cellMessages);
			}
			if(emptyCell == list.length){
				// 設定項目がなければヘッダにエラーメッセージを表示
				clutil.mediator.trigger('onTicker', clmsg.EMD0004);
				return false;
			}


			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				//this.validator.setErrorFocus();
				return false;
			}
		},

		/**
		 * this.storeListから送信用リスト作成
		 */
		getStoreList: function(){
			//店舗リストを作成
			var storeSel = [];
			for(var i=0; i<this.storeList.length; i++){
				var d = {
						storeID : Number(this.storeList[i].val),
						storeCode : this.storeList[i].code,
						storeName : this.storeList[i].name
				};
				storeSel.push(d);
			}

			return storeSel;
		},

		/**
		 * 送信用リストからthis.storeList作成
		 */
		setStoreList: function(list){
			//店舗リストを作成
			for(var i=0; i<list.length; i++){
				var d = {
						val : list[i].storeID,
						code : list[i].storeCode,
						name : list[i].storeName
				};
				this.storeList.push(d);
			}
			return this.storeList;
		},


		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			var _this = this;
			// editモードをかりとる
			this.dataGrid.stopEditing();

			//エラーリセット
			this.dataGrid.clearAllCellMessage();
			this.validator.clear();

			// 指示条件、テーブル内容取得
			var discSale = clutil.view2data($("#ca_search"));
			var discSaleItem = this.dataGrid.getData({ delflag: false });

			//エラーチェック
			if(this.isValid(discSaleItem) == false){
				return;
			}

			if(discSaleItem.length == 0 || discSaleItem == []){
				// 設定項目がなければヘッダにエラーメッセージを表示
				clutil.mediator.trigger('onTicker', clmsg.EMD0004);
				return;
			}
			else{
				//差し戻しが押された場合
				if(opeTypeId == OpeType.AMMDV0050_OPETYPE_RETURN){
					var reject = $("#ca_reject").val();

					if(reject.length == 0){
						//差し戻し理由の記入がなければエラー
						clutil.mediator.trigger('onTicker', clmsg.EMS0037);
						this.validator.setErrorMsg($("#ca_reject"), clmsg.cl_required);
						return;
					}
					else if(reject.length > 100){
						//文字数超過エラー
						clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
						this.validator.setErrorMsg($("#ca_reject"), clutil.fmtargs(clmsg.cl_maxlen, ["100"]));
						return;
					}
					else{
						//理由があれば配列に詰めてリクエストへ追加
						var len = this.rejectList.length;
						var sendData = {
								reject: reject
						};
						this.rejectList[len] = sendData;

						discSale.rejectList = this.rejectList;
					}
				}
				//エラーリセット
				_this.validator.clearErrorMsg($('#ca_reject'));

				//店舗リストを取得
				var storeSel = this.getStoreList();
				var sendList = [];

				//数値化
				discSale.unitID = Number(discSale.unitID);
				discSale.state = Number(discSale.state);
				discSale.instructID = Number(discSale.instructID);

				//承認状態設定(押下されたボタンの種類にリクエストを更新)
				if(this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					//削除時は一時保存のステータスを渡す
					discSale.stateID = OpeType.AMMDV0050_OPETYPE_SAVE;
				}
				else{
					discSale.stateID = opeTypeId;
				}

				//100ひいてリクエストの数値と合わせる
				//リクエストと違う数にしておかないとフッタ色や動作が削除等の動作にかぶるため
				discSale.stateID = discSale.stateID - OpeType.AMMDV0050_OPETYPE_NUM;


				for(var i=0; i<discSaleItem.length; i++){
					if(discSaleItem[i].itemID != 0
							&& discSaleItem[i].itemID != undefined && discSaleItem[i].itemID != null){
						discSaleItem[i].itemID = Number(discSaleItem[i].itemID);
						discSaleItem[i].discRt = Number(discSaleItem[i].discRt);
						discSaleItem[i].retailPriceDisc = Number(discSaleItem[i].retailPriceDisc);
						discSaleItem[i].mfrID = Number(discSaleItem[i].maker.id);

						//更新しない項目は消す
						delete discSaleItem[i].retailPriceOrg;
						delete discSaleItem[i].retailPriceDiscOrg;

						sendList.push(discSaleItem[i]);
					}
				}
			}

			//エラーリセット
			this.dataGrid.clearAllCellMessage();
			this.validator.clear();

			var updReq = {
					// 共通ヘッダ
					reqHead: {
						opeTypeId: this.opeTypeId,
						recno: this.state.recno,
						state: this.state.state
					},
					// 共通ページヘッダ
					reqPage: {
					},
					// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
					AMMDV0050GetReq: {
					},
					// 商品分類マスタ更新リクエスト
					AMMDV0050UpdReq: {
						discSale: discSale,
						discSaleItem: sendList,
						storeSel: storeSel
					},
			};
			this.savedUpdReq = updReq;	// 強制更新用に保存

			return {
				resId: clcom.pageId,
				data:  updReq,
			};

			// Null を渡すと、Ajax 呼び出しを Reject したものと FW 側では見なします。
			return null;
		},

		/**
		 * データグリッドの列編集可否フラグ
		 */
		gridEditCtrl: {
			discRateEditable: false,		// [値下率(%)] 列編集可否フラグ
			discPriceEditable: false		// [変更後上代(税抜)] 列編集可否フラグ
		},


		getColumns: function(){
			var _this = this;
			var percent = clutil.getclsysparam('PAR_AMCM_DEFAULT_PERCENT');

			var columns = [
			               { id: 'maker', name: "メーカー", field: "maker", width: 200,
			            	   cellType: {
			            		   type: 'clajaxac',
			            		   editorOptions: {
			            			   funcName: 'vendorcode',
			            			   dependAttrs: function(){
			            				   return {
			            					   vendor_typeid: 1
			            				   };
			            			   }
			            		   },
			            		   validator: 'required'
			            	   }
			               },
			               { id: 'mfrItCode', name: 'メーカー品番', field: 'mfrItCode', width: 130,
			            	   cellType: {
			            		   type: 'text',
			            		   validator: ['required', 'hankaku', 'len:0,10', function(){
			            			   // 商品が取得できなかったときに行データに
			            			   // mfrItCodeErrorを設定している(graphのid=mfrItCode)(★)
			            			   return this.item.mfrItCodeError;

			            			   //「存在しないメーカー品番コードです。」
			            			   //return clutil.fmtargs(clmsg.EGM0008, ["メーカー品番"]);
			            		   }],
			            		   //limit: 'hankaku len:10',
			            		   isEditable: function(item){
			            			   return !!(item && item.maker && item.maker.id);
			            		   }
			            	   }
			               },
			               { id: 'itemName', name: "商品名", field: "itemName",  width: 200 },
			               { id: 'subClass1Name', name: "サブ1", field: "subClass1Name", width: 100 },
			               { id: 'subClass2Name', name: "サブ2", field: "subClass2Name", width: 100 },
			               { id: 'retailPriceOrg', name: "元上代(税抜)", field: "retailPriceOrg", cssClass: 'txtalign-right', width: 140 },
			               { id: 'retailPriceDiscOrg', name: "変更前上代(税抜)", field: "retailPriceDiscOrg", cssClass: 'txtalign-right', width: 140 },

			               { id: 'discRt', name: "値下率(%)", field: "discRt", cssClass: 'txtalign-right', width: 100,
			            	   cellType: {
			            		   type: 'text',
			            		   validator: ['required', 'min:1', 'int:2'],
			            		   //limit: 'digit len:2',
			            		   formatFilter: 'comma',
			            		   editorOptions: {
			            			   attributes: {
			            				   placeholder: percent
			            			   }
			            		   },
			            		   beforeValid: function(item){
			            			   if((_this.gridEditCtrl.discPriceEditable)){
			            				   return false;
			            			   }
			            		   },
			            		   isEditable: function(item){
			            			   if(_this.gridEditCtrl.discRateEditable){
			            				   // TODO: 率から価格計算
			            				   if(!(_.isEmpty(item.discRt)) && !(_.isEmpty(item.retailPriceDiscOrg))){
			            					   var rt = Number(item.discRt);
			            					   var pdo = Number(item.retailPriceDiscOrg.replace(',', ""));

			            					   //どちらも数値なら計算
			            					   if(!isNaN(rt) && !isNaN(pdo)){
			            						   var down = Math.ceil(pdo * rt / 100);
			            						   item.retailPriceDisc = pdo - down;
			            					   }
			            				   }
			            			   }
			            			   return _this.gridEditCtrl.discRateEditable;
			            		   }
			            	   }
			               },
			               { id: 'retailPriceDisc', name: "変更後上代(税抜)", field: "retailPriceDisc", cssClass: 'txtalign-right', width: 140,
			            	   cellType: {
			            		   type: 'text',
			            		   validator: ['required', 'min:0', 'int:7'],
			            		   //limit: 'digit len:7',
			            		   formatFilter: 'comma',
			            		   beforeValid: function(item){
			            			   if((_this.gridEditCtrl.discRateEditable)){
			            				   return false;
			            			   }
			            		   },
			            		   isEditable: function(item){
			            			   if(_this.gridEditCtrl.discPriceEditable){
			            				   // TODO: 値クリア
			            				   item.discRt = "";
			            			   }
			            			   return _this.gridEditCtrl.discPriceEditable;
			            		   }
			            	   }
			               }
			               ];
			return columns;
		},

		renderGrid: function(data, delToggle){
			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,		// 高さに対して仮想化するため、インナースクロールを入れる。
					frozenRow: 1,			// 行固定：本来は自動的にヘッダ列数計算しているはずだが、効かない？？？
				},
				columns: this.getColumns(),
				data: data,
				rowDelToggle: delToggle,
				graph: this.graph
			});
		},

		/**
		 * ダウンロード条件をつくる
		 */
		buildReq: function(){
			//指示ID
			var discSale = clutil.view2data($("#ca_search"));
			var discSaleItem = this.dataGrid.getData({ delflag: false });
			//店舗リストを取得
			var storeSel = this.getStoreList();

			var sendList =[];
			var f_last = true;

			for(var i=discSaleItem.length-1; i>=0; i--){
				var data = discSaleItem[i];
				var f_send = false;
				if(f_last == false){
					f_send = true;
				}


				//メーカーID、商品ID、商品コード、下代、上代のいずれかがあれば送信リスト入り
				if((data.maker != "" && data.maker != null && data.maker != undefined)){
					if(data.maker.id != "" && data.maker.id != null
							&& data.maker.id != 0 && data.maker.id != undefined){
						data.mfrName = data.maker.name;
						data.mfrCode = data.maker.code;
						data.mfrID = data.maker.id;
						f_send = true;
					}
					else{
						delete data.mfrName;
						delete data.mfrCode;
						delete data.mfrID;
					}
				}
				if((data.mfrItCode != "" && data.mfrItCode != null && data.mfrItCode != undefined)
						|| (data.discRt != "" && data.discRt != null && data.discRt != undefined)
						|| (data.retailPriceDisc != "" && data.retailPriceDisc != null && data.retailPriceDisc != undefined)
						|| (data.itemID != "" && data.itemID != null && data.itemID != undefined)){
					f_send = true;
				}

				if(f_send == true){
					f_last = false;
					sendList.unshift(data);
				}
			}

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
				},
				// 共通ページヘッダ		・・・これ、必要なの？					【確認】
				reqPage: {
				},
				AMMDV0050GetReq: {
				},
				AMMDV0050UpdReq: {
					discSale: discSale,
					discSaleItem: sendList,
					storeSel: storeSel
				}
			};
			return req;
		},


		/**
		 * ダウンロードする
		 */
		_onCSVClick: function(){
			// editモードをかりとる
			this.dataGrid.stopEditing();

			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMMDV0050', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		_eof: 'AMMDV0050.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView(clcom.pageArgs).initUIElement().render();

		//パラメータで店舗選択input表示切替
		if(clutil.getclsysparam('PAR_AMMS_ORG_PRICE') == 0){
			$("#ca_storeSel").addClass("dispn");
		}
		mainView.setFocus();
	}).fail(function(data){
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
