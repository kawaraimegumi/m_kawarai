//セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

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
			'click #ca_AMTSV0020'	: '_onAMTSV0020Click',	// 移動依頼一覧(店別)(AMTSV0020)へ遷移
			'click #ca_AMTSV0050'	: '_onAMTSV0050Click',	// 移動依頼一覧(セットアップ)(AMTSV0050)へ遷移
			"blur .ca_limitInput"	: "_onLimitInpuBlur",					//フィールドカウンター再計算
			"click #ca_fileDel_btn" : "_onDelFileClick",					//ファイル削除押下
			"click #ca_fileName" : "_onFileDLClick",						//添付ファイル押下
			"click .cl_download" : "_onCSVClick",							//CSV出力押下

			'click #ca_sample_download'		: '_onSampleDLClick',		// ExcelサンプルDLボタン押下

			"clDatepickerOnSelect #ca_limitDate"	: "pickLimitDateBlur",	//移動日付からアラーム日付設定(デートピッカー)
			"change #ca_limitDate"	: "changeLimitDateBlur",					//移動日付からアラーム日付設定(手打ち)
			"click .cl_errWrnRowClick"	: "_onErrWrnClick",			// MT-1493 エラー・警告行クリック yamaguchi
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
						title: '移動依頼作成（一括）',
						//subtitle: '登録',
						opeTypeId: o.opeTypeId,
						pageCount: o.chkData.length,
						btn_csv: true,

						// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
						// リクエストビルダ関数を渡しておく。
						buildSubmitReqFunction: this._buildSubmitReqFunction,
						// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
						// リクエストのビルダ関数を opt で渡しておく。
						buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
						? this._buildGetReqFunction : undefined
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// アプリ個別の View や部品をインスタンス化するとか・・・
			// TODO: なんか

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
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
			//添付ファイルDL用
			this.fileURL = "";

			//clutil.cltxtFieldLimit($("#ca_itgrpID"));
			clutil.cltxtFieldLimit($("#ca_reason"));
			clutil.cltxtFieldLimit($("#ca_comment"));

			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid',
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ。
			});
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
						this.dataGrid.isValidCell(e.item, 'makerHinban');
					}

					// 行ID取得
					var rowId = e.item[this.dataGrid.dataView.idProperty];
					if (e.item.allFlagStore === 1){
				       // [出荷店：すべて]なら、出荷店・数量エラーリセット
       				   this.dataGrid.clearCellMessage(rowId, "outStore");
       				   this.dataGrid.clearCellMessage(rowId, "transQy");
				    }
					if (e.item.allFlag === 1){
						// [数量：すべて]なら、数量エラーリセット
     				   this.dataGrid.clearCellMessage(rowId, "transQy");
				    }
				}
			});
			this.graph = new clutil.Relation.DependGraph()
			.add({
				id: 'makerHinban',
				depends: ['maker.id'],
				onDependChange: function(e){
					e.model.set('makerHinban', '');
				}
			})
			.add({
				id: 'itemName',
				depends: ['maker.id', 'makerHinban'],
				onDependChange: function(e){
					var setData = clutil.view2data($("#ca_search"));

					var maker_code = e.model.get('makerHinban');
					var maker_id = e.model.get('maker.id');
					var itgrp_id = setData.itgrpID;

					var fail = function(makerHinbanError){
						e.model.set({
							//makerHinban: '',
							itemID: 0,
							itemCode: '',
							itemName: '',

							sub1ID: 0,
							sub1Code: '',
							sub1Name: '',

							sub2ID: 0,
							sub2Code: '',
							sub2Name: '',

							color:{
								colorID: 0,
								colorCode: '',
								colorName: ''
							},
							colorID: 0,
							colorCode: '',
							colorName: '',

							size:{
								sizeID: 0,
								sizeCode: '',
								sizeName: ''
							},
							sizeID: 0,
							sizeCode: '',
							sizeName: '',

							outStore:{
								outStoreID: 0,
								outStoreCode: '',
								outStoreName: ''
							},
							outStoreID: 0,
							outStoreCode: '',
							outStoreName: '',

							inStore:{
								inStoreID: 0,
								inStoreCode: '',
								inStoreName: ''
							},
							inStoreID: 0,
							inStoreCode: '',
							inStoreName: '',

							//allFlag: 0,
							//allFlagStore: 0,
							transQy: '',

							// 商品の取得に失敗した場合は呼び出し元でエラー文字列を設定する。(★)
							makerHinbanError: makerHinbanError
						});
					};

					if (maker_code && maker_id && itgrp_id){
						var done = e.async();

						clutil.clmakeritemcode2item({
							maker_code: maker_code,
							itgrp_id: itgrp_id,
							maker_id: maker_id
						})
						.done(function(data){
							if (data.head.status){
								// 何かエラーが発生した(1)(★)
								fail(clmsg[data.head.message]);
								return;
							}
							var rec  = data.rec;
							e.model.set({
								itemID: rec.itemID,
								itemCode: rec.itemCode,
								itemName: rec.itemName,

								sub1ID: rec.sub1ID,
								sub1Code: rec.sub1Code,
								sub1Name: rec.sub1Name,

								sub2ID: rec.sub2ID,
								sub2Code: rec.sub2Code,
								sub2Name: rec.sub2Name,

								// 商品が取得できたのでエラーをクリアする(★)
								makerHinbanError: null
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
			})
			.add({
				id: 'color.id',
				depends: ['itemID'],
				onDependChange: function(e){
					e.model.set({
						'color.id': 0,
						'color.name': '',
						'color.code': ''
					});
				}
			})
			.add({
				id: 'size.id',
				depends: ['itemID', 'color.id'],
				onDependChange: function(e){
					e.model.set({
						'size.id': 0,
						'size.code': '',
						'size.name': ''
					});
				}
			});
		},

		/**
		 * MT-1493エラー行、警告行クリック時に該当の行までスクロールする処理 yamaguchi
		 */
		_onErrWrnClick: function(args) {
			this.dataGrid.grid.scrollRowIntoView($(args.currentTarget).data('rownum'),1);
		},

		/**
		 * 移動出荷期限フォーカス外れ
		 */
		pickLimitDateBlur: function(){
			if($("#ca_alarmDate").val() == ""){
				var data = clutil.view2data($('#ca_limitDateArea'));
				data.alarmDate = data.limitDate;

				clutil.data2view($('#ca_alarmDateArea'), data);
			}
		},

		/**
		 * 移動出荷期限フォーカス外れ
		 */
		changeLimitDateBlur: function(){
			if($("#ca_alarmDate").val() == ""){
				var data = clutil.view2data($('#ca_limitDateArea'));
				data.alarmDate = data.limitDate;

				clutil.data2view($('#ca_alarmDateArea'), data);
			}
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			var _this = this;

			switch(args.status){
			case 'DONE':		// 確定済
				// TODO: args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.readOnly();
				var row_alert = [];
				var row_error = [];
				// MT-1493 エラー・警告行エリアクリア
				ClGrid.showAlert(row_alert);
				ClGrid.showError(row_error);
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// TODO: args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.readOnly();
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> を readonly 化するなどの処理。
				this.readOnly();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// TODO: 入力値エラー情報が入っていれば、個別 View へセットする。
				var row_alert = [];
				if(args.data.rspHead.message == "WTR0023"){
					var trans = clutil.view2data($("#ca_search"));
					var dtlList = this.dataGrid.getData({ delflag: false });

					trans.f_DePOs = this.f_DePOs;

					if(dtlList.length == 0 || dtlList == []){
						// 設定項目がなければヘッダにエラーメッセージを表示
						clutil.mediator.trigger('onTicker', clutil.fmtargs(clmsg.EMS0007, ["1"]));
						return;
					}
					else{
						var sendList = [];

						for(var i=0; i<dtlList.length; i++){
							if(dtlList[i].itemID != 0
									&& dtlList[i].itemID != undefined && dtlList[i].itemID != null){
								dtlList[i].makerID = Number(dtlList[i].maker.id);


								if((dtlList[i].color != undefined) && (dtlList[i].color != null)){
									dtlList[i].colorID = Number(dtlList[i].color.id);
								}
								else{
									dtlList[i].colorID = 0;
								}
								if((dtlList[i].size != undefined) && (dtlList[i].size != null)){
									dtlList[i].sizeID = Number(dtlList[i].size.id);
								}
								else{
									dtlList[i].sizeID = 0;
								}
								dtlList[i].itemID = Number(dtlList[i].itemID);
								if(dtlList[i].allFlagStore == 1){
									dtlList[i].outStoreID = 0;
								}
								else{
									dtlList[i].outStoreID = Number(dtlList[i].outStore.id);
								}
								dtlList[i].inStoreID = Number(dtlList[i].inStore.id);
								if(dtlList[i].allFlag == 1){
									dtlList[i].transQy = 0;
								}
								else{
									dtlList[i].transQy = Number(dtlList[i].transQy);
								}
								sendList.push(dtlList[i]);
							}
						}

						trans.state = Number(trans.state);
						trans.fileID = Number(trans.fileID);
						trans.transInstructID = Number(trans.transInstructID);
						trans.transTypeID = Number(trans.transTypeID);
						trans.unitID = Number(trans.unitID);
					}

					// TODO: 画面入力値をかき集めて、Rec を構築する。
					var updReq = {
							// 共通ヘッダ
							reqHead: {
								opeTypeId: _this.re_opeTypeId
							},
							// 共通ページヘッダ		・・・これ、必要なの？					【確認】
							reqPage: {
							},
							// 取引先マスタ検索リクエスト -- 更新なので、空を設定
							AMTRV0020GetReq: {
							},
							// 取引先マスタ更新リクエスト
							AMTRV0020UpdReq: {
								trans : trans,
								dtlList : sendList
							}
					};

					var callback = function(){
						var cellMessages = [];
						var list = _this.dataGrid.getData({ delflag: false });
						var error = args.data.rspHead.fieldMessages;

						for(var i=0; i<error.length; i++){
							var line = error[i].lineno;
							var rowDto = list[line-1];
							var rowId = rowDto[_this.dataGrid.dataView.idProperty];

							if(error[i].message == "WTR0015"){
								//警告
								cellMessages.push({
									rowId: rowId,
									colId: 'makerHinban',
									level: 'warn',
									message: clutil.fmtargs(clmsg.WTR0015, [error[i].args[0],error[i].args[1],error[i].args[2]])
								});
								cellMessages.push({
									rowId: rowId,
									colId: 'inStore',
									level: 'warn',
									message: clutil.fmtargs(clmsg.WTR0015, [error[i].args[0],error[i].args[1],error[i].args[2]])
								});


								var upList = updReq.AMTRV0020UpdReq.dtlList;

								if(upList[line-1].allFlagStore == 1){
									cellMessages.push({
										rowId: rowId,
										colId: 'allFlagStore',
										level: 'warn',
										message: clutil.fmtargs(clmsg.WTR0015, [error[i].args[0],error[i].args[1],error[i].args[2]])
									});
								}
								else{
									cellMessages.push({
										rowId: rowId,
										colId: 'outStore',
										level: 'warn',
										message: clutil.fmtargs(clmsg.WTR0015, [error[i].args[0],error[i].args[1],error[i].args[2]])
									});
								}
							}
							row_alert.push({
								num: line
							});
						}
						if(!_.isEmpty(cellMessages)){
							_this.dataGrid.setCellMessage(cellMessages);
							ClGrid.showAlert(row_alert);
						}
					};

					var send = {
							resId: clcom.pageId,
							data: updReq,
							confirm: clmsg.WTR0023,
							cancel: callback
					};
					this.mdBaseView.forceSubmit(send);
				}
				else{
					var cellMessages = [];
					var list = _this.dataGrid.getData({ delflag: false });
					var error = args.data.rspHead.fieldMessages;

					if(error != undefined || error != null){
						//他品種の商品が登録された場合
						for(var i=0; i<error.length; i++){

							var line = error[i].lineno;
							var rowDto = list[line-1];
							var rowId = rowDto[_this.dataGrid.dataView.idProperty];

							if(error[i].message == "ETR0011"){
								var code = error[i].args[0];
								//既に出荷店、入荷店、商品が同様の依頼がある場合
								cellMessages.push({
									rowId: rowId,
									colId: 'makerHinban',
									level: 'error',
									message: clutil.fmtargs(clmsg.ETR0011, [code])
								});
								cellMessages.push({
									rowId: rowId,
									colId: 'color',
									level: 'error',
									message: clutil.fmtargs(clmsg.ETR0011, [code])
								});
								cellMessages.push({
									rowId: rowId,
									colId: 'size',
									level: 'error',
									message: clutil.fmtargs(clmsg.ETR0011, [code])
								});
								cellMessages.push({
									rowId: rowId,
									colId: 'inStore',
									level: 'error',
									message: clutil.fmtargs(clmsg.ETR0011, [code])
								});
								cellMessages.push({
									rowId: rowId,
									colId: 'outStore',
									level: 'error',
									message: clutil.fmtargs(clmsg.ETR0011, [code])
								});
								cellMessages.push({
									rowId: rowId,
									colId: 'allFlagStore',
									level: 'error',
									message: clutil.fmtargs(clmsg.ETR0011, [code])
								});
							}
							else if(error[i].message == "ETR0020"){
								cellMessages.push({
									rowId: rowId,
									colId: 'makerHinban',
									level: 'error',
									message: clutil.fmtargs(clmsg.ETR0020, [line])
								});
							}
							else if(error[i].message == "ETR0018"){
								cellMessages.push({
									rowId: rowId,
									colId: 'outStore',
									level: 'error',
									message: clutil.fmtargs(clmsg.ETR0018, [line])
								});
							}
							else if(error[i].message == "ETR0019"){
								cellMessages.push({
									rowId: rowId,
									colId: 'inStore',
									level: 'error',
									message: clutil.fmtargs(clmsg.ETR0019, [line])
								});
							}
							else{
								clutil.mediator.trigger('onTicker', args.data);
							}
							//2016.06.13 入力エラーの行番号表示機能実装 山口　ここから
//							var pushAlert_flg = 0;
//							var __this = list;
//							$.each(row_alert, function(){
//								if (__this.rowIndex + 1 == this.num) {
//									pushAlert_flg = 1;
//								}
//							});
//							if (pushAlert_flg == 0){
								row_alert.push({
									num: line
								});
//							}
						}
						if(!_.isEmpty(cellMessages)){
							_this.dataGrid.setCellMessage(cellMessages);
						}
						this.cellMessages2 = cellMessages;
					}
				}

				var row_error = [];
				$.each(args.data.rspHead.fieldMessages, function(){
					row_error.push({
						num: this.lineno
					});
				});
				// MT-1493 エラー・警告行表示
				ClGrid.showAlert(row_alert);
				ClGrid.showError(row_error);

				break;

				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			var data = args.data;
			var getRsp = data.AMTRV0020GetRsp;
			var serchData = getRsp.trans;
			var tblData = getRsp.dtlList;

			// TODO: args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
			this.makeData(serchData);	//条件部作成
			this.makeTable(tblData);	//テーブル部作成

			var roCtrlFunc = null;
			switch(args.status){
			case 'OK':
				//起動モードで分岐
				switch (this.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					//編集禁止解除
					roCtrlFunc = this.removereadOnly;
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
				//編集禁止
				roCtrlFunc = this.readOnly;
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				//編集禁止
				roCtrlFunc = this.readOnly;
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				//編集禁止
				roCtrlFunc = this.readOnly;
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				clutil.mediator.trigger('onTicker', args.data);
				//編集禁止
				roCtrlFunc = this.readOnly;
				break;
			}


			clutil.cltxtFieldLimit($("#ca_reason"));
			clutil.cltxtFieldLimit($("#ca_comment"));



			if(_.isFunction(roCtrlFunc)){
				// 品種オートコンプリートの setter と、clutil.viewReadonly() との
				// 実行タイミング競合調整のため、_.defer 使用。
				// オートコンプリート値セットした後に、viewReadonly() 順で。
				_.defer(roCtrlFunc);
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var _this = this;
			this.mdBaseView.initUIElement();

			// カレンダー
			clutil.datepicker(this.$('#ca_releaseDate'));
			clutil.datepicker(this.$('#ca_limitDate'));
			clutil.datepicker(this.$('#ca_alarmDate'));

			//フィールドリレーション
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_itgrpID"
				}
			});
			this.fieldRelation.done(function() {
			});

			var unit = clcom.getUserData().unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				this.setUnit({
					unitID: unit	// 事業ユニット
				});
				//clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: _this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {
							AMTRV0020UpdReq: _this.makeCSVData()
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMTRV0020',
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
				// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
				if(data.rspHead.fieldMessages){
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
				var list = data.AMTRV0020GetRsp.dtlList;
				_this.makeTable(list);
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで


			// ---------------------------------------- [添付ファイルアップロード]
			var opeFileInputCtrl = clutil.View.buildFileUploadButtonView(this.$("#ca_fileUp_btn"));
			opeFileInputCtrl.on('success', _.bind(function(file){

				//ファイルID,名称反映
				var line = '<a id="ca_fileName" class="cl_filedownld" target="_blank">' + file.filename + '</a>';
				var id = file.id;
				$("#ca_label").html(line);
				$("#ca_fileID").val(id);
				this.fileURL = file.uri;
			}, this));
			// ---------------------------------------- [添付ファイルアップロード]：ここまで

			//ボタン位置調整
			this.$("form").addClass("flleft");
			return this;
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

		//CSV出力用のデータ作成
		makeCSVData: function(){
			var data = clutil.view2data(this.$("#ca_search"));

			data.fileID = Number(data.fileID);
			data.state = Number(data.state);
			data.transInstructID = Number(data.transInstructID);
			data.transTypeID = Number(data.transTypeID);
			data.unitID = Number(data.unitID);

			var obj = {
					trans : data
			};
			return obj;
		},

		/**
		 * フィールドカウンター再計算
		 */
		_onLimitInpuBlur: function(e){
			clutil.cltxtFieldLimit($(e.target));
		},

		/**
		 * 添付ファイル削除押下
		 */
		_onDelFileClick: function(){
			$("#ca_label").html("");
			$("#ca_fileID").val("");
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
			var sampleURL = "/public/sample/移動依頼サンプル.xlsx";


			clutil.download(sampleURL);
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			this.mdBaseView.fetch();	// データを GET してくる。
			this.makeDefaultTable();	//グリッドデフォ表示

//			this.dataGrid.render();		//データグリッド
//			var data = [];
//			this.renderGrid(data);

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

			//TODO:ラジオボタンのdisable方法見直し
			$(".ca_radio").addClass("disabled");
			$(".ca_radio").attr("disabled", true);

			//csv取込
			clutil.viewReadonly($("#ca_upld"));
			clutil.viewReadonly($("#ca_table_tbody"));

			//テーブル部編集不可
			this.dataGrid.setEnable(false);
		},

		/**
		 * 編集可化
		 */
		removereadOnly: function(){
			//画面上部
			clutil.viewRemoveReadonly($("#ca_search"));

			//TODO:ラジオボタンのdisable方法見直し
			$(".ca_radio").removeClass("disabled");
			$(".ca_radio").attr("disabled", false);

			//csv取込
			clutil.viewRemoveReadonly($("#ca_upld"));
			clutil.viewRemoveReadonly($("#ca_table_tbody"));

			//依頼番号欄のみreadOnly
			clutil.viewReadonly($("#ca_transInstructCodeArea"));

			this.setFocus();
			//テーブル部編集不可
			this.dataGrid.setEnable(true);
		},

		/**
		 * 検索条件描画
		 */
		makeData: function(serchData) {
			//テキストボックス系反映
			clutil.data2view($('#ca_search'), _.extend({}, serchData, {
				//itgrpID: {
				_view2data_itgrpID_cn: {
					id: serchData.itgrpID,
					name: serchData.itgrpName,
					code: serchData.itgrpCode
				}
			}));

			//添付ファイル作成
			if(serchData.fileName != ""){
				var line = '<a id="ca_fileName" class="cl_filedownld" target="_blank">' + serchData.fileName + '</a>';
				$("#ca_label").html(line);
				this.fileURL = serchData.fileURL;
			}

			//ラジオボタン反映
			$("input[name='ca_transTypeID'][value='"+ serchData.transTypeID +"']").radio('check');

			if (serchData.f_DePOs) {
				// 品種の必須条件を削除
				$("#ca_itgrpID").removeClass('cl_required');
				$("#div_itgrpID").removeClass('required');

				// 入力不可にする？→入力不可にはしない。更新チェックで入力されていたらエラーとする
			} else {
				// 品種の必須条件を追加
				$("#ca_itgrpID").addClass('cl_required');
				$("#div_itgrpID").addClass('required');
			}
			this.f_DePOs = serchData.f_DePOs;
		},

		/**
		 * テーブル描画
		 * @param list
		 */
		makeTable: function(list) {
			for(var i=0; i<list.length; i++){
				//メーカーオブジェクト作成
				list[i].maker = {
						name: list[i].makerName,
						code: list[i].makerCode,
						id: list[i].makerID
				};
				list[i].outStore = {
						name: list[i].outStoreName,
						code: list[i].outStoreCode,
						id: list[i].outStoreID
				};
				list[i].inStore = {
						name: list[i].inStoreName,
						code: list[i].inStoreCode,
						id: list[i].inStoreID
				};
				list[i].color = {
						name: list[i].colorName,
						code: list[i].colorCode,
						id: list[i].colorID
				};
				list[i].size = {
						name: list[i].sizeName,
						code: list[i].sizeCode,
						id: list[i].sizeID
				};

				if(list[i].outStoreID == 0){
					list[i].allFlagStore = 1;
				}
			}
			this.renderGrid(list, true);
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
					AMTRV0020GetReq: {
						chkFlag: 0,				// 0:起動参照、1:チェック
						srchID: chkData.id		// 依頼ID
						//checkCond: {}			// チェック条件
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMTRV0020UpdReq: {
					}
			};

			return {
				resId: clcom.pageId,	//'AMTRV0020',
				data: getReq
			};
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			var unit = clcom.getUserData().unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				clutil.setFocus($('#ca_itgrpID'));
				clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}
			else{
				clutil.setFocus($('#ca_unitID'));
			}
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(list, trans){
			var retStat = true;

			// 日付エラー確認
			if(!this.validator.valid()){
				retStat = false;
			}

			var $itgrp = $("#ca_itgrpID");

			if (!$itgrp.hasClass('cl_required')) {
				// 品種が必須でない場合は、入力されていたらエラーとする
				if (trans.itgrpID > 0) {
					this.validator.setErrorMsg($("#ca_itgrpID"), clmsg.ETR0030);
					retStat = false;
				}
			}

			//日付大小エラー
			var data = clutil.view2data($("#ca_search"));
			var release = data.releaseDate;
			var limit = data.limitDate;
			var alarm = data.alarmDate;
			var today = clcom.getOpeDate();

			if(today >= release){
				this.validator.setErrorMsg($("#ca_releaseDate"), clmsg.EGM0047);
				retStat = false;
			}
			if(release > limit){
				this.validator.setErrorMsg($("#ca_limitDate"), clmsg.ETR0012);
				retStat = false;
			}
			if(limit > alarm){
				this.validator.setErrorMsg($("#ca_alarmDate"), clmsg.ETR0013);
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				//this.validator.setErrorFocus();
				return false;
			}

			//グリッドエラーリセット
			this.dataGrid.clearAllCellMessage();


			var tailIsEmptyFunc = function(dto){
				if(dto.maker && (dto.maker.id || dto.maker.name)){
					return false;
				}
				if(!_.isEmpty(dto.inStore)){
					if(dto.inStore.inStoreID != 0){
						return false;
					}
				}
				if(!_.isEmpty(dto.makerHinban)){
					return false;
				}
				if(!_.isEmpty(dto.itemID)){

					return false;
				}

				if(dto.allFlagStore == 1){
					return false;
				}
				else if(dto.allFlag == 1){
					if(!_.isEmpty(dto.outStore)){
						if(dto.outStore.outStoreID != 0){
							return false;
						}
					}
					return false;
				}
				else{
					if(!_.isEmpty(dto.outStore)){
						if(dto.outStore.outStoreID != 0){
							return false;
						}
					}
					if(!_.isEmpty(dto.transQy)){
						return false;
					}
				}


				console.log('***************** 空行');
				return true;
			};

			var errors = this.dataGrid.validate(tailIsEmptyFunc);
			if(!_.isEmpty(errors)){
				this.dataGrid.setCellMessage(errors);
				retStat = false;
			}

			// MD-2993 移動依頼登録時の明細重複エラーについて_PGM開発
			// 明細行データのチェックロジック変更
			// チェック時の行キーが商品だけだったので1行ずつ他行と比較してチェックするよう修正
			var emptyCell = 0;
			var cellMessages = [];
			for (var i = 0; i < list.length; i++) {
				var rowDtoA = list[i];

				// 無効行はとばす
				var isValidRowA = false;
				if (rowDtoA.itemID != 0 && rowDtoA.itemID != null && rowDtoA.itemID != "") {
					isValidRowA = true;
				}
				if (isValidRowA == false) {
					emptyCell++;
					continue;
				}

				//var rowId = rowDto[this.dataGrid.dataView.idProperty];		// 行ID, プロパティ名は "_cl_gridRowId"
				//移動数量が「全て」でないのに1未満だった場合
				// => セル定義でmin値を1にしているので1未満は入力できないはず。このチェックは通らない気もするが一応残す。
				if((rowDtoA.transQy < 1) && rowDtoA.allFlag != 1){
					cellMessages.push({rowId: rowDtoA._cl_gridRowId, colId: 'transQy', level: 'error',
						message: clutil.fmtargs(clmsg.EGM0038, [1])});
					retStat = false;
				}

				for (var j = i + 1; j < list.length; j++) {
					var rowDtoB = list[j];

					// 無効行はとばす
					var isValidRowB = false;
					if (rowDtoA.itemID != 0 && rowDtoA.itemID != null && rowDtoA.itemID != "") {
						isValidRowB = true;
					}
					if (isValidRowB == false) continue;

					var colorID_A = (rowDtoA.color != null && rowDtoA.color.id != 0) ? rowDtoA.color.id : null;
					var colorID_B = (rowDtoB.color != null && rowDtoB.color.id != 0) ? rowDtoB.color.id : null;
					var sizeID_A = (rowDtoA.size != null && rowDtoA.size.id != 0) ? rowDtoA.size.id : null;
					var sizeID_B = (rowDtoB.size != null && rowDtoB.size.id != 0) ? rowDtoB.size.id : null;
					var outStoreID_A = (rowDtoA.outStore != null) ? rowDtoA.outStore.id : null;
					var outStoreID_B = (rowDtoB.outStore != null) ? rowDtoB.outStore.id : null;

					// 同一内容チェック（商品ID、カラーID、サイズID、出荷店すべてフラグ、出荷店ID、入荷店ID）
					if (rowDtoA.itemID === rowDtoB.itemID &&
							colorID_A === colorID_B &&
							sizeID_A === sizeID_B &&
							(rowDtoA.allFlagStore != 1 && rowDtoB.allFlagStore != 1) &&
							outStoreID_A === outStoreID_B &&
							rowDtoA.inStore.id === rowDtoB.inStore.id
						) {
						cellMessages.push({rowId: rowDtoA._cl_gridRowId, colId: 'makerHinban', level: 'error', message: clmsg.ETR0021});
						cellMessages.push({rowId: rowDtoA._cl_gridRowId, colId: 'color',       level: 'error', message: clmsg.ETR0021});
						cellMessages.push({rowId: rowDtoA._cl_gridRowId, colId: 'size',        level: 'error', message: clmsg.ETR0021});
						cellMessages.push({rowId: rowDtoA._cl_gridRowId, colId: 'outStore',    level: 'error', message: clmsg.ETR0021});
						cellMessages.push({rowId: rowDtoA._cl_gridRowId, colId: 'inStore',     level: 'error', message: clmsg.ETR0021});
						cellMessages.push({rowId: rowDtoA._cl_gridRowId, colId: 'allFlagStore',level: 'error', message: clmsg.ETR0021});

						cellMessages.push({rowId: rowDtoB._cl_gridRowId, colId: 'makerHinban', level: 'error', message: clmsg.ETR0021});
						cellMessages.push({rowId: rowDtoB._cl_gridRowId, colId: 'color',       level: 'error', message: clmsg.ETR0021});
						cellMessages.push({rowId: rowDtoB._cl_gridRowId, colId: 'size',        level: 'error', message: clmsg.ETR0021});
						cellMessages.push({rowId: rowDtoB._cl_gridRowId, colId: 'outStore',    level: 'error', message: clmsg.ETR0021});
						cellMessages.push({rowId: rowDtoB._cl_gridRowId, colId: 'inStore',     level: 'error', message: clmsg.ETR0021});
						cellMessages.push({rowId: rowDtoB._cl_gridRowId, colId: 'allFlagStore',level: 'error', message: clmsg.ETR0021});

						retStat = false;
					}

					// 同一品番商品チェック（カラー）
					else if ((rowDtoA.itemID === rowDtoB.itemID) &&
							  (colorID_A === null || colorID_B === null) &&
							  (outStoreID_A === outStoreID_B)) {
						cellMessages.push({rowId: rowDtoA._cl_gridRowId, colId: 'color', level: 'error', message:clmsg.ETR0026});
						cellMessages.push({rowId: rowDtoB._cl_gridRowId, colId: 'color', level: 'error', message:clmsg.ETR0026});

						retStat = false;
					}

					// 同一品番商品チェック（サイズ）
					else if ((rowDtoA.itemID === rowDtoB.itemID) &&
							  (colorID_A === colorID_B) &&
							  (sizeID_A === null || sizeID_B === null) &&
							  (outStoreID_A === outStoreID_B)) {
						cellMessages.push({rowId: rowDtoA._cl_gridRowId, colId: 'size', level: 'error', message:clmsg.ETR0027});
						cellMessages.push({rowId: rowDtoB._cl_gridRowId, colId: 'size', level: 'error', message:clmsg.ETR0027});

						retStat = false;
					}

					// 商品・カラー・サイズが同じ場合、店舗「すべて」指定のチェック
					else if ((rowDtoA.itemID === rowDtoB.itemID) &&
							  (colorID_A === colorID_B) &&
							  (sizeID_A === sizeID_B) &&
							  (rowDtoA.allFlagStore === 1 || rowDtoB.allFlagStore === 1) ){

						// 両方とも「すべて」指定
						if(rowDtoA.allFlagStore === 1 && rowDtoB.allFlagStore === 1){
							cellMessages.push({rowId: rowDtoA._cl_gridRowId, colId: 'allFlagStore', level: 'error', message: clmsg.ETR0024});
							cellMessages.push({rowId: rowDtoB._cl_gridRowId, colId: 'allFlagStore', level: 'error', message: clmsg.ETR0024});
						}

						// どちらか片方に「すべて」指定
						else if (rowDtoA.allFlagStore != 1) {
							cellMessages.push({rowId: rowDtoA._cl_gridRowId, colId: 'outStore', level: 'error',
								message: clutil.fmtargs(clmsg.ETR0004, [rowDtoA.outStore.code, rowDtoA.outStore.name])});
						}
						else if (rowDtoB.allFlagStore != 1) {
							cellMessages.push({rowId: rowDtoB._cl_gridRowId, colId: 'outStore', level: 'error',
								message: clutil.fmtargs(clmsg.ETR0004, [rowDtoB.outStore.code, rowDtoB.outStore.name])});
						}

						retStat = false;
					}

					// 商品・カラー・サイズ・出荷店が同じ場合、数量「すべて」指定のチェック
					else if ((rowDtoA.itemID === rowDtoB.itemID) &&
							  (colorID_A === colorID_B) &&
							  (sizeID_A === sizeID_B) &&
							  (outStoreID_A === outStoreID_B) &&
							  (rowDtoA.allFlag === 1 || rowDtoB.allFlag === 1) ){

						cellMessages.push({rowId: rowDtoA._cl_gridRowId, colId: 'outStore', level: 'error',
							message: clutil.fmtargs(clmsg.ETR0005, [rowDtoA.outStore.code, rowDtoA.outStore.name])});
						cellMessages.push({rowId: rowDtoA._cl_gridRowId, colId: 'allFlag', level: 'error',
							message: clutil.fmtargs(clmsg.ETR0005, [rowDtoA.outStore.code, rowDtoA.outStore.name])});

						cellMessages.push({rowId: rowDtoB._cl_gridRowId, colId: 'outStore', level: 'error',
							message: clutil.fmtargs(clmsg.ETR0005, [rowDtoB.outStore.code, rowDtoB.outStore.name])});
						cellMessages.push({rowId: rowDtoB._cl_gridRowId, colId: 'allFlag', level: 'error',
							message: clutil.fmtargs(clmsg.ETR0005, [rowDtoB.outStore.code, rowDtoB.outStore.name])});

						retStat = false;
					}
				}
			}

			if(!_.isEmpty(cellMessages)){
				this.dataGrid.setCellMessage(cellMessages);
				//ここに入れる
				var row_alert = [];
				var row_error = ClGrid.getErrorRow(this.dataGrid.metadatas.body, this.gridData, 0);
				ClGrid.showAlert(row_alert);
				ClGrid.showError(row_error);
			}
			if(emptyCell == list.length){
				// 設定項目がなければヘッダにエラーメッセージを表示
				clutil.mediator.trigger('onTicker', clutil.fmtargs(clmsg.EMS0007, ["1"]));

				return false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				//this.validator.setErrorFocus();
				retStat = false;
			}

			return retStat;
		},


		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			// editモードをかりとる
			this.dataGrid.stopEditing();

			this.validator.clear();

			//強制更新の際に必要
			this.re_opeTypeId = opeTypeId;
			// 依頼条件、テーブル内容取得
			var trans = clutil.view2data($("#ca_search"));
			var dtlList = this.dataGrid.getData({ delflag: false });

			trans.f_DePOs = this.f_DePOs;

			var num = 0;
			this.gridData = this.dataGrid.getData();
			$.each(this.gridData, function(){
				this.rowIndex = num;
				num++;
			});

			//エラーチェック
			if(this.isValid(dtlList, trans) == false){
				var row_error = ClGrid.getErrorRow(this.dataGrid.metadatas.body, this.dataGrid.getData(), 0);
				ClGrid.showError(row_error);
				return;
			}
			if(dtlList.length == 0 || dtlList == []){
				// 設定項目がなければヘッダにエラーメッセージを表示
				clutil.mediator.trigger('onTicker', clutil.fmtargs(clmsg.EMS0007, ["1"]));
				return;
			}
			else{
				var sendList = [];

				for(var i=0; i<dtlList.length; i++){
					if(dtlList[i].itemID != 0
							&& dtlList[i].itemID != undefined && dtlList[i].itemID != null){
						dtlList[i].makerID = Number(dtlList[i].maker.id);


						if((dtlList[i].color != undefined) && (dtlList[i].color != null)){
							dtlList[i].colorID = Number(dtlList[i].color.id);
						}
						else{
							dtlList[i].colorID = 0;
						}
						if((dtlList[i].size != undefined) && (dtlList[i].size != null)){
							dtlList[i].sizeID = Number(dtlList[i].size.id);
						}
						else{
							dtlList[i].sizeID = 0;
						}
						dtlList[i].itemID = Number(dtlList[i].itemID);
						if(dtlList[i].allFlagStore == 1){
							dtlList[i].outStoreID = 0;
						}
						else{
							dtlList[i].outStoreID = Number(dtlList[i].outStore.id);
						}
						dtlList[i].inStoreID = Number(dtlList[i].inStore.id);
						if(dtlList[i].allFlag == 1){
							dtlList[i].transQy = 0;
						}
						else{
							dtlList[i].transQy = Number(dtlList[i].transQy);
						}
						sendList.push(dtlList[i]);
					}
				}

				trans.state = Number(trans.state);
				trans.fileID = Number(trans.fileID);
				trans.transInstructID = Number(trans.transInstructID);
				trans.transTypeID = Number(trans.transTypeID);
				trans.unitID = Number(trans.unitID);
			}

			// TODO: 画面入力値をかき集めて、Rec を構築する。
			var updReq = {
					// 共通ヘッダ
					reqHead: {
						opeTypeId: opeTypeId
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					// 取引先マスタ検索リクエスト -- 更新なので、空を設定
					AMTRV0020GetReq: {
					},
					// 取引先マスタ更新リクエスト
					AMTRV0020UpdReq: {
						trans : trans,
						dtlList : sendList
					}
			};
			return {
				resId: clcom.pageId,	//'AMTRV0020',
				data: updReq
			};
		},

		/**
		 * ダウンロード条件をつくる
		 */
		buildReq: function(){
			this.validator.clear();

			// 依頼条件、テーブル内容取得
			var trans = clutil.view2data($("#ca_search"));
			var dtlList = this.dataGrid.getData({ delflag: false });

			var sendList =[];
			var f_last = true;

			for(var i=dtlList.length-1; i>=0; i--){
				var f_send = false;
				if(f_last == false){
					f_send = true;
				}

				if(dtlList[i].maker != "" && dtlList[i].maker != undefined){
					if(dtlList[i].maker.id != "" && dtlList[i].maker.id != null
							&& dtlList[i].maker.id != 0 && dtlList[i].maker.id != undefined){
						dtlList[i].makerID = Number(dtlList[i].maker.id);
						dtlList[i].makerCode = dtlList[i].maker.code;
						dtlList[i].makerName = dtlList[i].maker.name;
						f_send = true;
					}
					else{
						delete dtlList[i].makerID;
						delete dtlList[i].makerCode;
						delete dtlList[i].makerName;
					}
				}
				if(dtlList[i].color != "" && dtlList[i].color != undefined){
					if(dtlList[i].color.id != "" && dtlList[i].color.id != null
							&& dtlList[i].color.id != 0 && dtlList[i].color.id != undefined){
						f_send = true;
						dtlList[i].colorID = Number(dtlList[i].color.id);
						dtlList[i].colorCode = dtlList[i].color.code;
						dtlList[i].colorName = dtlList[i].color.name;
					}
					else{
						delete dtlList[i].colorID;
						delete dtlList[i].colorCode;
						delete dtlList[i].colorName;
					}
				}
				if(dtlList[i].size != "" && dtlList[i].size != undefined){
					if(dtlList[i].size.id != "" && dtlList[i].size.id != null
							&& dtlList[i].size.id != 0 && dtlList[i].size.id != undefined){
						f_send = true;
						dtlList[i].sizeID = Number(dtlList[i].size.id);
						dtlList[i].sizeCode = dtlList[i].size.code;
						dtlList[i].sizeName = dtlList[i].size.name;
					}
					else{
						delete dtlList[i].sizeID;
						delete dtlList[i].sizeCode;
						delete dtlList[i].sizeName;
					}
				}
				if(dtlList[i].itemID != "" && dtlList[i].itemID != undefined && dtlList[i].itemID != 0){
					f_send = true;
					dtlList[i].itemID = Number(dtlList[i].itemID);
				}

				if(dtlList[i].storeFlag == 1){
					f_send = true;
					dtlList[i].outStoreID = 0;
				}
				else{
					if(dtlList[i].outStore != "" && dtlList[i].outStore != undefined){
						if(dtlList[i].outStore.id != "" && dtlList[i].outStore.id != null
								&& dtlList[i].outStore.id != 0 && dtlList[i].outStore.id != undefined){
							f_send = true;
							dtlList[i].outStoreID = Number(dtlList[i].outStore.id);
							dtlList[i].outStoreCode = dtlList[i].outStore.code;
							dtlList[i].outStoreName = dtlList[i].outStore.name;
						}
						else{
							delete dtlList[i].outStoreID;
							delete dtlList[i].outStoreCode;
							delete dtlList[i].outStoreName;
						}
					}
				}
				if(dtlList[i].inStore != "" && dtlList[i].inStore != undefined){
					if(dtlList[i].inStore.id != "" && dtlList[i].inStore.id != null
							&& dtlList[i].inStore.id != 0 && dtlList[i].inStore.id != undefined){
						f_send = true;
						dtlList[i].inStoreID = Number(dtlList[i].inStore.id);
						dtlList[i].inStoreCode = dtlList[i].inStore.code;
						dtlList[i].inStoreName = dtlList[i].inStore.name;
					}
					else{
						delete dtlList[i].inStoreID;
						delete dtlList[i].inStoreCode;
						delete dtlList[i].inStoreName;
					}
				}
				if(dtlList[i].allFlag == 1){
					f_send = true;
					dtlList[i].transQy = 0;
				}
				else{
					if(dtlList[i].transQy != "" && dtlList[i].transQy != undefined){
						f_send = true;
						dtlList[i].transQy = Number(dtlList[i].transQy);
					}
				}

				if(f_send == true){
					f_last = false;
					sendList.unshift(dtlList[i]);
				}
			}

			trans.state = Number(trans.state);
			trans.fileID = Number(trans.fileID);
			trans.transInstructID = Number(trans.transInstructID);
			trans.transTypeID = Number(trans.transTypeID);
			trans.unitID = Number(trans.unitID);



			// TODO: 画面入力値をかき集めて、Rec を構築する。
			var updReq = {
					// 共通ヘッダ
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					// 取引先マスタ検索リクエスト -- 更新なので、空を設定
					AMTRV0020GetReq: {
					},
					// 取引先マスタ更新リクエスト
					AMTRV0020UpdReq: {
						trans : trans,
						dtlList : sendList
					}
			};

			return updReq;
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
			var defer = clutil.postDLJSON('AMTRV0020', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},


		getColumns: function(){
			var columns = [
			               {
			            	   id: 'maker',
			            	   //name: 'メーカー',
			            	   field: 'maker',
			            	   width: 200,
			            	   cssClass: 'bdrTpColor',
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
			            		   validator: 'required:id'
			            	   }
			               },
			               {
			            	   id: 'makerHinban',
			            	   //name: 'メーカー品番',
			            	   field: 'makerHinban',
			            	   width: 120,
			            	   cssClass: 'bdrTpColor',
			            	   cellType: {
			            		   type: 'text',
			            		   validator: ['required', 'hankaku', 'len:0,10', function(){
			            			   // 商品が取得できなかったときに行データに
			            			   // makerHinbanErrorを設定している(graphのid=makerHinban)(★)
			            			   return this.item.makerHinbanError;

			            			   //「存在しないメーカー品番コードです。」
			            			   //return clutil.fmtargs(clmsg.EGM0008, ["メーカー品番"]);
			            		   }],
			            		   //limit: 'hankaku len:10',
			            		   isEditable: function(item){
			            			   return !!(item && item.maker && item.maker.id);
			            		   }
			            	   }
			               },
			               {
			            	   id: 'itemName',
			            	   //name: '商品名',
			            	   field: 'itemName',
			            	   cssClass: 'bdrTpColor',
			            	   width: 200
			               },
			               {
			            	   id: 'sub1Name',
			            	   //name: 'サブ1',
			            	   field: 'sub1Name',
			            	   cssClass: 'bdrTpColor',
			            	   width: 120
			               },
			               {
			            	   id: 'sub2Name',
			            	   //name: 'サブ2',
			            	   field: 'sub2Name',
			            	   cssClass: 'bdrTpColor',
			            	   width: 120
			               },
			               {
			            	   id: 'color',
			            	   //name: 'カラー',
			            	   field: 'color',
			            	   cssClass: 'bdrTpColor',
			            	   width: 120,
			            	   cellType: {
			            		   type: 'clajaxselector',
			            		   //validator: 'required:select',
			            		   formatter: function(value, options){
			            			   if (!value || !value.id) {
			            				   return 'すべて';
			            			   } else {
			            				   return ClGrid.Formatters.codename(value, options);
			            			   }
			            		   },
			            		   editorOptions: function(item){
			            			   return {
			            				   funcName: 'color',
			            				   emptyLabel:"すべて",
			            				   dependAttrs: {
			            					   itemID: item.itemID
			            				   }
			            			   };
			            		   },
			            		   isEditable: function(item){
			            			   return Boolean(item.itemID);
			            		   }
			            	   }
			               },
			               {
			            	   id: 'size',
			            	   //name: 'サイズ',
			            	   field: 'size',
			            	   cssClass: 'bdrTpColor',
			            	   width: 120,
			            	   cellType: {
			            		   type: 'asynccodenameselector',
			            		   //validator: 'require:select',
			            		   formatter: function(value, options){
			            			   if (!value || !value.id) {
			            				   return 'すべて';
			            			   } else {
			            				   return ClGrid.Formatters.codename(value, options);
			            			   }
			            		   },
			            		   editorOptions: function(item){
			            			   var deferred = $.Deferred();
			            			   clutil.clcolor2size(item.itemID, item.color.id)
			            			   .done(function(data){
			            				   var items = _.map(data && data.list, function(item){
			            					   return {
			            						   id: item.sizeID,
			            						   code: item.sizeCode,
			            						   name: item.sizeName,
			            						   data: item
			            					   };
			            				   });
			            				   deferred.resolve(items);
			            			   });
			            			   return {
			            				   emptyLabel:"すべて",
			            				   nondisable: true,
			            				   items: deferred.promise()
			            			   };
			            		   },
			            		   isEditable: function(item){
			            			   var f = Boolean(item.itemID && item.color && item.color.id);
			            			   if (f == false) {
//			            				   console.log(item);
			            			   }
			            			   return f;
			            		   }
			            	   }
			               },
			               {
			            	   id: 'allFlagStore',
			            	   name: 'すべて',
			            	   field: 'allFlagStore',
			            	   cellType: {
			            		   type: 'checkbox'
			            	   }
			               },
			               {
			            	   name: '店舗指定',
			            	   id: 'outStore',
			            	   field: 'outStore',
			            	   cellType: {
			            		   type: 'clajaxac',
			            		   editorOptions: {
			            			   funcName: 'orgcode',
			            			   dependAttrs: function(){
			            				   return {
			            					   //p_org_id: unit,
			            					   orgfunc_id :1,
			            					   orglevel_id :6,
			            					   f_stockmng: 1
			            				   };
			            			   }
			            		   },
			            		   beforeValid: function(item){
			            			   if(item.allFlagStore === 1){
			            				   return false;
			            			   }
			            		   },
			            		   isEditable: function(item){
			            			   var isChecked = item.allFlagStore === 1;
			            			   if(isChecked){
			            				   // 行ID取得
//			            				   var rowId = item[_this.dataGrid.dataView.idProperty];
//			            				   _this.dataGrid.clearCellMessage(rowId, "outStore");
//			            				   _this.dataGrid.clearCellMessage(rowId, "transQy");

			            				   item.outStore = null;
			            				   item.transQy = "";
			            				   item.allFlag = 1;
			            			   }
			            			   return !isChecked;
			            		   },
			            		   validator: 'required:id'
			            	   }
			               },
			               {
			            	   //name: '入荷店',
			            	   id: 'inStore',
			            	   field: 'inStore',
			            	   cssClass: 'bdrTpColor',
			            	   cellType: {
			            		   type: 'clajaxac',
			            		   editorOptions: {
			            			   funcName: 'orgcode',
			            			   dependAttrs: function(){
			            				   return {
			            					   //p_org_id: unit,
			            					   orgfunc_id :1,
			            					   orglevel_id :6,
			            					   f_stockmng: 1
			            				   };
			            			   }
			            		   },
			            		   validator: 'required:id'
			            	   }
			               },
			               {
			            	   id: 'allFlag',
			            	   name: 'すべて',
			            	   field: 'allFlag',
			            	   cellType: {
			            		   isEditable: function(item){

			            			   return item.allFlagStore !== 1;
			            		   },
			            		   type: 'checkbox'
			            	   }
			               },
			               {
			            	   id: 'transQy',
			            	   name: '入力',
			            	   field: 'transQy',
			            	   width: 20,
			            	   cssClass: 'txtalign-right',
			            	   cellType: {
			            		   type: 'text',
			            		   isEditable: function(item){
			            			   var isChecked = (item.allFlag || item.allFlagStore) === 1;
			            			   if(isChecked){
			            				   // TODO: 値クリア
			            				   item.transQy = "";
			            			   }
			            			   return !isChecked;
			            		   },
			            		   beforeValid: function(item){
			            			   if(item.allFlagStore === 1 || item.allFlag === 1){
			            				   return false;
			            			   }
			            		   },
			            		   validator: ['required', 'int:7', 'min:1'],
			            		   //limit: 'len:6 digit',
			            		   formatFilter: 'comma'
			            	   }
			               }];
			return columns;
		},


		getHead: function(){
			/*
			 * カラムヘッダ部のメタデータ定義
			 * ★カラムグループを定義してみる。
			 */
			var colhdMetadatas = [
			                      { // 1段目
			                    	  columns: {
			                    		  maker: {
			                    			  colspan: 1,
			                    			  name: 'メーカー'
			                    		  },
			                    		  makerHinban: {
			                    			  colspan: 1,
			                    			  name: 'メーカー品番'
			                    		  },
			                    		  itemName: {
			                    			  colspan: 1,
			                    			  name: '商品名'
			                    		  },
			                    		  sub1Name: {
			                    			  colspan: 1,
			                    			  name: 'サブ1'
			                    		  },
			                    		  sub2Name: {
			                    			  colspan: 1,
			                    			  name: 'サブ2'
			                    		  },
			                    		  color: {
			                    			  colspan: 1,
			                    			  name: 'カラー'
			                    		  },
			                    		  size: {
			                    			  colspan: 1,
			                    			  name: 'サイズ'
			                    		  },
			                    		  allFlagStore: {
			                    			  colspan: 2,
			                    			  name: '出荷店'
			                    		  },
			                    		  inStore: {
			                    			  colspan: 1,
			                    			  name: '入荷店'
			                    		  },
			                    		  allFlag: {
			                    			  colspan: 2,
			                    			  name: '数量'
			                    		  }
			                    	  }
			                      }];
			return colhdMetadatas;
		},


		renderGrid: function(data, delToggle){
			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,		// 高さに対して仮想化するため、インナースクロールを入れる。
					frozenRow: 2			// 行固定：本来は自動的にヘッダ列数計算しているはずだが、効かない？？？
				},
				columns: this.getColumns(),
				colhdMetadatas: this.getHead(),
				data: data,
				rowDelToggle: delToggle,
				graph: this.graph
			});
		},

		/**
		 * 移動依頼一覧(店別)(AMTSV0020)へ遷移
		 * @param e
		 */
		_onAMTSV0020Click: function(e) {

			var url = clcom.appRoot + '/AMTS/AMTSV0020/AMTSV0020.html';

			clcom.pushPage({
				url: url,
				args: {}
			});
		},

		/**
		 * 移動依頼一覧(セットアップ)(AMTSV0050)へ遷移
		 * @param e
		 */
		_onAMTSV0050Click: function(e) {

			var url = clcom.appRoot + '/AMTS/AMTSV0050/AMTSV0050.html';

			clcom.pushPage({
				url: url,
				args: {}
			});
		},

		_eof: 'AMTRV0020.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		clutil.field.behaviors.ErrorBehavior = clutil.field.Behavior.extend({
			onClearError: function(){
				if(mainView.editable){
					clutil.inputRemoveReadonly(this.view.$el);
					this.view.trigger('readonly:change', this.view, false, {});
				}
			},
			onCheckError: function(){
				if(mainView.editable){
					clutil.inputReadonly(this.view.$el);
					this.view.trigger('readonly:change', this.view, true, {});
				}
			}
		});

		if(clcom.pageArgs) {
			// ページ遷移引数で、chkDataは存在しないが、vpIdListが設定されている場合
			// (通知一覧から遷移してきた場合)
			if(!clcom.pageArgs.chkData) {
				if(clcom.pageArgs.data) {
					var chkData = [];
					chkData[0] = {
						id : Number(clcom.pageArgs.data.vpIdList)
					};
					clcom.pageArgs.chkData = chkData;
				}
			}
		}

		mainView = new MainView(clcom.pageArgs).initUIElement().render();
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
