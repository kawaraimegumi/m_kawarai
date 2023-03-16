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
			"blur .ca_limitInput"	: "_onLimitInpuBlur",					//フィールドカウンター再計算
			"click #ca_fileDel_btn" : "_onDelFileClick",					//ファイル削除押下

			'click #ca_sample_download'		: '_onSampleDLClick',		// ExcelサンプルDLボタン押下

			"click .cl_download" : "_onCSVClick",							//CSV出力押下
			"click #ca_attachedFile" : "_onFileDLClick"						//添付ファイル押下
		},

		sampleURL: "/public/sample/評価減サンプル.xlsx",



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
						title: '評価減',
						//subtitle: '登録・修正',
						opeTypeId: o.opeTypeId,
						pageCount: o.chkData.length,
						btn_csv: true,
						// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
						// リクエストビルダ関数を渡しておく。
						buildSubmitReqFunction: this._buildSubmitReqFunction,

						// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
						// リクエストのビルダ関数を opt で渡しておく。
						buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
						? this._buildGetReqFunction : undefined,

								// 空更新チェック用データを作る関数。
								// UIから集めてきた更新データが GET してきた直後の内容と同一かどうかをチェックするための
								// GET直後データを加工する関数。GET 直後に変更するプロパティは空更新チェックの比較対象外
								// にあたるため、比較対象外プロパティを除去するために使用する。
								buildSubmitCheckDataFunction: this._buildSubmitCheckDataFunction

				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);


			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
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
				// 新規登録以外は、Submit と、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			//clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
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

			//フィールドカウント
			clutil.cltxtFieldLimit($("#ca_storeComment"));

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
						this.dataGrid.isValidCell(e.item, 'itemCode');
					}
				}
			});

			//グリッドリレーション
			this.graph = new clutil.Relation.DependGraph()
			.add({
				id: 'itemCode',
				depends: ['maker.id'],
				onDependChange: function(e){
					e.model.set({
						itemID: 0,
						itemCode: '',
						itemName: '',
						stockQy: '',
						initialCost: '',
						presentCost: '',
						afterCost: '',
						presentPrice: '',
						afterPrice: '',
						ageMax: '',
						ageMin: ''
						//itemYear: ''
					});
				}
			})
			.add({
				id: 'itemName',
				depends: ['maker.id', 'itemCode'],
				onDependChange: function(e){
					var setData = clutil.view2data($("#ca_search"));
					var maker_code = e.model.get('itemCode');
					var maker_id = e.model.get('maker.id');
					var itgrp_id = setData.itgrpID;

					var fail = function(itemCodeError){
						e.model.set({
							itemID: 0,
							itemName: '',
							stockQy: '',
							initialCost: '',
							presentCost: '',
							afterCost: '',
							presentPrice: '',
							afterPrice: '',
							ageMax: '',
							ageMin: '',
							//itemYear: '',

							// 商品の取得に失敗した場合は呼び出し元でエラー文字列を設定する。(★)
							itemCodeError: itemCodeError
						});
					};

					if (maker_code && maker_id && itgrp_id){
						var done = e.async();
						var date = $("#ca_execDate").val();
						date = clutil.dateFormat(date, "yyyymmdd");
						//検索用オブジェクト
						var obj = {
								maker_code : maker_code,	//メーカー品番
								itgrp_id : itgrp_id,		//品種ID
								maker_id : maker_id,		//メーカーID
							    need_qy: 1,
							    srchFromDate: date,
							    srchToDate: date
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
								itemName: rec.itemName,						//商品名
								stockQy: clutil.comma(rec.qy),				//在庫数
								initialCost: clutil.comma(rec.cost),		//初期下代
								presentCost: clutil.comma(rec.cost),		//現状下代
								afterCost: rec.cost,
								presentPrice: clutil.comma(rec.price),		//変更前上代
								afterPrice: rec.price,
								ageMax: rec.ageMax,
								ageMin: rec.ageMin,
								//itemYear: rec.age,				//商品年令

								// 商品が取得できたのでエラーをクリアする(★)
								itemCodeError: null
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

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var _this = this;
			this.mdBaseView.initUIElement();
			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);

			// カレンダー
			clutil.datepicker(this.$('#ca_releaseDate'));
			clutil.datepicker(this.$('#ca_execDate'));

			//フィールドリレーション
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_itgrpID",
				},
			});
			this.fieldRelation.done(function() {
				//リレーション時の処理
			});

			var unit = clcom.getUserData().unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				this.setUnit({
					srchUnitID: unit	// 事業ユニット
				});
				//clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}


			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),
				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {
							AMWDV0020UpdReq : {
								recWriteDown :clutil.view2data(this.$("#ca_search"))
							}
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMWDV0020',
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
				var list = data.AMWDV0020GetRsp.recWriteDownItem;

				_this.makeTable(list);
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで


			// ---------------------------------------- [添付ファイルアップロード]
			var opeFileInputCtrl = clutil.View.buildFileUploadButtonView(this.$("#ca_fileUp_btn"));
			opeFileInputCtrl.on('success', _.bind(function(file){
				//ファイルID,名称反映
				var line = '<a id="ca_attachedFile" class="cl_filedownld" target="_blank">' + file.filename + '</a>';
				var id = file.id;
				$("#ca_label").html(line);
				$("#ca_label").attr("data-original-title", file.filename);
				$("#ca_fileDiv").find("span").tooltip({html: true});
				$("#ca_attachedFileID").val(id);
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

		/**
		 * 添付ファイル削除押下
		 */
		_onDelFileClick: function(){
			$("#ca_label").html("");
			$("#ca_attachedFileID").val("");
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
			clutil.download(this.sampleURL);
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

		getColumns: function(){
			var columns = [
			               // id: カラム識別 id。省略すると、setData() 時におけるカラムインデックス値が内部で設定されます。
			               // name: ラベル文字列
			               // field: 行データ上のプロパティ名とマッピング
			               // cssClass: スタイルを充てるためのクラスを記述
			               // width: カラム幅
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
			               { id: 'itemCode', name: 'メーカー品番', field: 'itemCode', width: 130,
			            	   cellType: {
			            		   type: 'text',
			            		   validator: ['required', 'hankaku', 'len:0,10', function(){
			            			   // 商品が取得できなかったときに行データに
			            			   // mfrItCodeErrorを設定している(graphのid=mfrItCode)(★)
			            			   return this.item.itemCodeError;

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
			               { id: 'stockQy', name: "在庫数", field: "stockQy", cssClass: 'txtalign-right', width: 100 },
			               { id: 'initialCost', name: "初期下代(税抜)", field: "initialCost", cssClass: 'txtalign-right', width: 140 },
			               { id: 'presentCost', name: "現状下代(税抜)", field: "presentCost", cssClass: 'txtalign-right', width: 140 },
			               { id: 'afterCost', name: "変更後下代(税抜)", field: "afterCost", cssClass: 'txtalign-right', width: 140,
			            	   cellType: {
			            		   type: 'text',
			            		   validator: ['required', 'min:0', 'int:7'],
			            		   formatFilter: 'comma'
			            	   }
			               },
			               { id: 'presentPrice', name: "変更前上代(税抜)", field: "presentPrice", cssClass: 'txtalign-right', width: 140 },
			               { id: 'afterPrice', name: "変更後上代(税抜)", field: "afterPrice", cssClass: 'txtalign-right', width: 140,
			            	   cellType: {
			            		   type: 'text',
			            		   //validator: ['required', 'min:1', 'int:7'],
			            		   validator: ['min:1', 'int:7'],	// 空白はOK 2017/6/27 MD-926
			            		   formatFilter: 'comma'
			            	   }
			               },
			               { id: 'ageMax', name: "最高商品年令", field: "ageMax", cssClass: 'txtalign-right', width: 120 },
			               { id: 'ageMin', name: "最低商品年令", field: "ageMin", cssClass: 'txtalign-right', width: 120 },
			               //{ id: 'itemYear', name: "商品年令", field: "itemYear", cssClass: 'txtalign-right', width: 80 }
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
		 * フィールドカウンター再計算
		 */
		_onLimitInpuBlur: function(e){
			clutil.cltxtFieldLimit($(e.target));
		},

		/**
		 * 編集不可化
		 */
		readOnly: function(){
			//画面上部
			clutil.viewReadonly($("#ca_search"));

			//csv取込
			clutil.viewReadonly($("#ca_upld"));
			clutil.viewReadonly($("#ca_csv_uptake"));
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

			//csv取込
			clutil.viewRemoveReadonly($("#ca_upld"));
			clutil.viewRemoveReadonly($("#ca_csv_uptake"));
			clutil.viewRemoveReadonly($("#ca_table_tbody"));

			this.setFocus();

			//テーブル部編集不可
			this.dataGrid.setEnable(true);
		},


		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				// TODO: args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.readOnly();
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


				var cellMessages = [];
				var list = this.dataGrid.getData({ delflag: false });
				var error = args.data.rspHead.fieldMessages;


				for(var i=0; i<error.length; i++){
					var line = error[i].lineno;
					var rowDto = list[line];
					var rowId = rowDto[this.dataGrid.dataView.idProperty];

					var msg = clutil.fmtargs(clutil.getclmsg(error[i].message), error[i].args);

					if (error[i].struct_name == "recWriteDownItem") {
						cellMessages.push({
							rowId: rowId,
							colId: error[i].field_name,
							level: 'error',
							message: msg//clutil.getclmsg(error[i].message)
						});
					}
//					if(error[i].message == "EWD0002"){
//						//品種違いエラー
//						cellMessages.push({
//							rowId: rowId,
//							colId: 'itemCode',
//							level: 'error',
//							message: clmsg.EWD0002
//						});
//					}
//					else if(error[i].message == "EWD0003"){
//						//同一日に同一商品が対象となっている
//						cellMessages.push({
//							rowId: rowId,
//							colId: 'itemCode',
//							level: 'error',
//							message: clmsg.EWD0003
//						});
//					}
//					else if(error[i].message == "EWD0007"){
//						//同一日に同一商品が対象となっている
//						cellMessages.push({
//							rowId: rowId,
//							colId: 'itemCode',
//							level: 'error',
//							message: clmsg.EWD0007
//						});
//					}
//					else{
//						clutil.mediator.trigger('onTicker', args.data);
//					}
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
			var getRsp = data.AMWDV0020GetRsp;
			var serchData = getRsp.recWriteDown;
			var tblData = getRsp.recWriteDownItem;
			var headData = data.rspHead;

			// TODO: args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
			this.makeData(serchData);	//条件部作成
			this.makeTable(tblData);	//テーブル部作成

			this.state.recno = headData.recno;
			this.state.state = headData.state;

			var roCtrlFunc = null;
			switch(args.status){
			case 'OK':

				//起動モードで分岐
				switch (this.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
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
				roCtrlFunc = this.readOnly;
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				roCtrlFunc = this.readOnly;
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				roCtrlFunc = this.readOnly;
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				roCtrlFunc = this.readOnly;
				break;
			}

			clutil.cltxtFieldLimit($("#ca_storeComment"));

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
					code: serchData.itgrpCode,
					wd_age: serchData.wd_age
				}
			}));

			//添付ファイル
			if(serchData.attachedFileName != ""){
				var line = '<a id="ca_attachedFile" class="cl_filedownld" target="_blank">' + serchData.attachedFileName + '</a>';
				$("#ca_label").html(line);
				$("#ca_label").attr("data-original-title", serchData.attachedFileName);
				$("#ca_fileDiv").find("span").tooltip({html: true});
				$("#ca_attachedFileID").val(serchData.attachedFileID);
				this.fileURL = serchData.attachedFileURL;
			}

			//ラジオボタン反映
			$("input[name='ca_divideType'][value='"+ serchData.divideType +"']").radio('check');
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
				//カンマが必要な項目
				list[i].stockQy = clutil.comma(list[i].stockQy);
				list[i].initialCost = clutil.comma(list[i].initialCost);
				list[i].presentCost = clutil.comma(list[i].presentCost);
				//list[i].afterCost = clutil.comma(list[i].afterCost);
				list[i].presentPrice = clutil.comma(list[i].presentPrice);
				//list[i].afterPrice = clutil.comma(list[i].afterPrice);
				if (list[i].afterPrice == 0) {
					list[i].afterPrice = "";
				}
			}
			this.renderGrid(list, true);

			return;
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
					// 検索リクエスト
					AMWDV0020GetReq: {
						srchID: chkData.id				// 指示ID
					},
					// 更新リクエスト -- 今は検索するので、空を設定
					AMWDV0020UpdReq: {
					}
			};

			return {
				resId: clcom.pageId,	//'AMWDV0020',
				data: getReq
			};
		},

		/**
		 * 更新系のリクエストを作る
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			// editモードをかりとる
			this.dataGrid.stopEditing();

			this.validator.clear();
			// 指示条件、テーブル内容取得
			var relitem = clutil.view2data($("#ca_search"));
			var itemList = this.dataGrid.getData({ delflag: false });
			var sendList = [];
			var confirm = null;
			var f_WWD0001 = false;
			var f_WWD0002 = false;
			var f_WWD0003 = false;
			var f_EWD0006 = false;

			// 品種
			var itgrpData = $("#ca_itgrpID").autocomplete('clAutocompleteItem');
			var wd_age = (itgrpData != null && itgrpData.wd_age != null) ? itgrpData.wd_age : 0; // 未設定はエラーなんだけど

			//エラーチェック
			if(this.isValid(itemList) == false){
				return;
			}

			if(itemList.length == 0 || itemList == []){
				// 設定項目がなければヘッダにエラーメッセージを表示
				clutil.mediator.trigger('onTicker', clutil.fmtargs(clmsg.EMS0007, ["1"]));
				return;
			}
			else{
				//数値化
				var cellMessages = [];
				for(var i=0; i<itemList.length; i++){
					var rowDto = itemList[i];
					var rowId = rowDto[this.dataGrid.dataView.idProperty];		// 行ID, プロパティ名は "_cl_gridRowId"

					if(itemList[i].itemID != 0 && itemList[i].itemID != undefined && itemList[i].itemID != null){
						if (itemList[i].stockQy == 0 && f_WWD0001 == false) {
							// 在庫数０
							if (confirm == null) {
								confirm = clmsg.WWD0001;
							} else {
								confirm += '<br>' + clmsg.WWD0001;
							}
							f_WWD0001 = true;
						}
						if (itemList[i].afterPrice === "") {
							// 空白の場合は確認ダイアログを出す
							if (f_WWD0003 == false) {
								if (confirm == null) {
									confirm = clmsg.WWD0003;
								} else {
									confirm += '<br>' + clmsg.WWD0003;
								}
								f_WWD0003 = true;
							}
							cellMessages.push({
								rowId: rowId,
								colId: 'afterPrice',
								level: 'warn',
								message: clutil.getclmsg('WWD0004')//clutil.getclmsg(error[i].message)
							});
						}
						var ageMin = itemList[i].ageMin != null ? itemList[i].ageMin : 0;
						var ageMax = rowDto.ageMax != null ? rowDto.ageMax : 0;
						if (wd_age > ageMin) {
							// 最低商品年令
							if (f_WWD0002 == false) {
								if (confirm == null) {
									confirm = clmsg.WWD0002;
								} else {
									confirm += '<br>' + clmsg.WWD0002;
								}
								f_WWD0002 = true;
							}
							cellMessages.push({
								rowId: rowId,
								colId: 'ageMin',
								level: 'warn',
								message: clutil.getclmsg('WWD0002')//clutil.getclmsg(error[i].message)
							});
						}
						if (ageMax < wd_age) {
							if (f_EWD0006 == false) {
								if (confirm == null) {
									confirm = clmsg.EWD0006;
								} else {
									confirm += '<br>' + clmsg.EWD0006;
								}
								f_EWD0006 = true;
							}
							cellMessages.push({
								rowId: rowId,
								colId: 'ageMax',
								level: 'warn',
								message: clutil.getclmsg('EWD0006')
							});
						}
						var obj = {
								afterPrice : Number(itemList[i].afterPrice),
								afterCost : Number(itemList[i].afterCost),
								makerID : itemList[i].maker.id,
								itemID : Number(itemList[i].itemID),
								itemCode : itemList[i].itemCode
						};
						sendList.push(obj);
					}
				}
				if(!_.isEmpty(cellMessages)){
					this.dataGrid.setCellMessage(cellMessages);
				}

			}
			relitem.attachedFileID = Number(relitem.attachedFileID);
			relitem.divideType = Number(relitem.divideType);
			relitem.instrcutID = Number(relitem.instrcutID);
			relitem.srchUnitID = Number(relitem.srchUnitID);
			relitem.wd_age = Number(relitem.wd_age);

			var updReq = {
					// 共通ヘッダ
					reqHead: {
						opeTypeId: opeTypeId,
						recno: this.state.recno,	//TODO:stateとrecnoの中身が入れ替わっている
						state: this.state.state
					},
					// 共通ページヘッダ
					reqPage: {
					},
					// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
					AMWDV0020GetReq: {
					},
					// 商品分類マスタ更新リクエスト
					AMWDV0020UpdReq: {
						recWriteDown: relitem,
						recWriteDownItem: sendList
					},
			};
			return {
				resId: clcom.pageId,
				data:  updReq,
				confirm: confirm
			};
			// Null を渡すと、Ajax 呼び出しを Reject したものと FW 側では見なします。
			return null;
		},


		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(list){
			var retStat = true;

			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				//最終来店日
				stval : 'ca_releaseDate',
				edval : 'ca_execDate'
			});

			// 未入力エラー確認
			if(!this.validator.valid()){
				retStat = false;
			}
			// 反転エラー確認
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			//日付大小エラー
			var data = clutil.view2data($("#ca_search"));
			var release = data.releaseDate;
			//var exec = data.exec;
			var today = clcom.getOpeDate();

			if(today >= release){
				this.validator.setErrorMsg($("#ca_releaseDate"), clmsg.EGM0047);
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
				//空行判定関数
				//メーカー、品番、上代、下代、商品IDのいずれかがあれば有効行とする
				//if(!(_.isEmpty(dto.maker) || dto.maker.id == 0) || _.isEmpty(dto.maker.name)){
				if(dto.maker && (dto.maker.id || dto.maker.name)){

					return false;
				}
				if(!_.isEmpty(dto.itemCode)){
					return false;
				}
				if(!_.isEmpty(dto.afterCost)){
					return false;
				}
				if(!_.isEmpty(dto.afterPrice)){
					return false;
				}
				if(!_.isEmpty(dto.itemID)){
					return false;
				}
				return true;	// 当該 dto は空であると判断。
			};

			//グリッドチェック作動
			var errors = this.dataGrid.validate(tailIsEmptyFunc);
			if(!_.isEmpty(errors)){
				//エラーが返ってきたらエラー表示
				this.dataGrid.setCellMessage(errors);
				retStat = false;
			}

			var itgrpData = $("#ca_itgrpID").autocomplete('clAutocompleteItem');
			var wd_age = (itgrpData != null && itgrpData.wd_age != null) ? itgrpData.wd_age : 0; // 未設定はエラーなんだけど

			// コード重複チェック用
			var dupCodeChkMap = {
					// キー： itemCode
					// 値　： 999		// 文字列なら初出行の rowId。数値型なら出現回数。
			};
			var cellMessages = [];
			var emptyCell = 0;
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
							colId: 'itemCode',
							level: 'error',
							message: clutil.fmtargs(clmsg.EMS0065, ["メーカー品番"])
						});
						// 重複行のエラーメッセージをセット
						cellMessages.push({
							rowId: rowId,
							colId: 'itemCode',
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
							colId: 'itemCode',
							level: 'error',
							message: clutil.fmtargs(clmsg.EMS0065, ["メーカー品番"])
						});
						retStat = false;
					}
				}
				else{
					emptyCell++;
				}

//				//-----------------
//				//上代<下代チェック
//				if(price < cost){
//					cellMessages.push({
//						rowId: rowId,
//						colId: 'afterPrice',
//						level: 'error',
//						message: clutil.getclmsg('WMS0100')
//					});
//					cellMessages.push({
//						rowId: rowId,
//						colId: 'afterCost',
//						level: 'error',
//						message: clutil.getclmsg('WMS0100')
//					});
//					retStat = false;
//				}


				var cost = Number(rowDto.afterCost);
				var price = Number(rowDto.afterPrice);
				var presentPrice = rowDto.presentPrice;
				if(presentPrice != null && presentPrice != undefined){
					presentPrice = presentPrice.replace(",", "");
					presentPrice = Number(presentPrice);

					//変更後下代が0円の場合
					if(cost == 0){
						//変更後 >= 変更前ならNG
						if(price >= presentPrice){
							cellMessages.push({
								rowId: rowId,
								colId: 'afterPrice',
								level: 'error',
								message: clutil.getclmsg('EWD0004')
							});
							retStat = false;
						}
					}
//					else{
//						if(cost != price){
//							cellMessages.push({
//								rowId: rowId,
//								colId: 'afterPrice',
//								level: 'error',
//								message: clutil.getclmsg('EWD0005')
//							});
//							cellMessages.push({
//								rowId: rowId,
//								colId: 'afterCost',
//								level: 'error',
//								message: clutil.getclmsg('EWD0005')
//							});
//							retStat = false;
//						}
//					}
				}

//				var ageMax = rowDto.ageMax;
//				if (ageMax < wd_age) {
//					cellMessages.push({
//						rowId: rowId,
//						colId: 'ageMax',
//						level: 'warn',
//						message: clutil.getclmsg('EWD0006')
//					});
//					retStat = false;
//				}
			}
			if(!_.isEmpty(cellMessages)){
				this.dataGrid.setCellMessage(cellMessages);
			}
			if(emptyCell == list.length){
				// 設定項目がなければヘッダにエラーメッセージを表示
				clutil.mediator.trigger('onTicker', clutil.fmtargs(clmsg.EMS0007, ["1"]));
				return false;
			}
			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return false;
			}
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			var unit = clcom.getUserData().unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				clutil.setFocus($('#ca_itgrpID'));
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
		},

		/**
		 * ダウンロード条件をつくる
		 */
		buildReq: function(){
			//指示ID
			var relitem = clutil.view2data($("#ca_search"));
			var itemList = this.dataGrid.getData({ delflag: false });

			var sendList =[];
			var f_last = true;

			for(var i=itemList.length-1; i>=0; i--){
				var f_send = false;
				if(f_last == false){
					f_send = true;
				}

				//メーカーID、商品ID、商品コード、下代、上代のいずれかがあれば送信リスト入り
				if((itemList[i].maker != "" && itemList[i].maker != null && itemList[i].maker != undefined)){
					if(itemList[i].maker.id != "" && itemList[i].maker.id != null
							&& itemList[i].maker.id != 0 && itemList[i].maker.id != undefined){
						itemList[i].makerName = itemList[i].maker.name;
						itemList[i].makerCode = itemList[i].maker.code;
						itemList[i].makerID = itemList[i].maker.id;
						f_send = true;
					}
					else{
						delete itemList[i].makerID;
						delete itemList[i].makerCode;
						delete itemList[i].makerName;
					}
				}
				if((itemList[i].itemCode != "" && itemList[i].itemCode != null && itemList[i].itemCode != undefined)
						|| (itemList[i].itemID != "" && itemList[i].itemID != null && itemList[i].itemID != undefined)
						|| (itemList[i].afterCost != "" && itemList[i].afterCost != null && itemList[i].afterCost != undefined)
						|| (itemList[i].afterPrice != "" && itemList[i].afterPrice != null && itemList[i].afterPrice != undefined)){
					f_send = true;
				}

				if(f_send == true){
					f_last = false;
					sendList.unshift(itemList[i]);
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
					AMWDV0020GetReq: {
					},
					AMWDV0020UpdReq: {
						recWriteDown: relitem,
						recWriteDownItem: sendList
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
			var defer = clutil.postDLJSON('AMWDV0020', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},


		/**
		 * 空更新チェックデータをつくる
		 */
		_buildSubmitCheckDataFunction: function(arg){
//			arg: {
//			index: toIndex,                // 複数レコード選択編集時におけるインデックス番号
//			resId: req.resId,            // リソースId -- "XXXXV0010" など
//			data: clutil.dclone(data)    // GETの応答データ（共通ヘッダも含む）
//			};

			var appRec = arg.data.AMWDV0020GetRsp;
			// TODO: 空更新チェック対象外のフィールドを削っていく。

			return appRec;
		},


		_eof: 'AMWDV0020.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////

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
