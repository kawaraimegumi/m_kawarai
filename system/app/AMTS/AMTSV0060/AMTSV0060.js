/**
 * 移動依頼作成（セットアップ）
 */

useSelectpicker2();

$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var emptyRec = {
			itgrpName: null,
			maker: null,
			itemCode: '',
			color: null,
			outStore: null,
			outStockQy: '',
			outRate: '',
			outEfficiency: '',
			inStore: null,
			inStockQy: '',
			inRate: '',
			inEfficiency: ''
		};

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		validator : null,

		events: {
			'click #ca_AMTRV0010'	: '_onAMTRV0010Click',	// 移動依頼一覧(一括)(AMTRV0010)へ遷移
			'click #ca_AMTSV0020'	: '_onAMTSV0020Click',	// 移動依頼一覧(店別)(AMTSV0020)へ遷移

			'change #ca_unitID'		: '_onUnitIDSelect',	// 事業ユニット変更

			"click #ca_fileName" : "_onFileDLClick",		// 添付ファイル名をクリックしてダウンロード
			"click #ca_fileDel_btn" : "_onDelFileClick",	// 添付ファイル削除ボタンを押下

			"clDatepickerOnSelect #ca_limitDate"	: "pickLimitDateBlur",	//移動日付からアラーム日付設定(デートピッカー)
			"change #ca_limitDate"	: "changeLimitDateBlur",					//移動日付からアラーム日付設定(手打ち)

			"click .cl_errWrnRowClick"	: "_onErrWrnClick"	// MT-1493 エラー・警告行クリック yamaguchi
		},

		// サイズカラム
		sizeColumns: [],

		/**
		 * サイズカラム追加関数
		 */
		addSizeColumns: function(sizeList){
			var addColumn = _.map(sizeList, function(item){
				// ここに新しいサイズ列のカラム定義を書く
				return {
					id: 'size_' + item.size_id,
					size_id: item.size_id,
					name: item.size_name,
					field: 'size_' + item.size_id,
					width: 100,
					// 右寄せ
					cssClass: 'txtalign-right',
					cellType: {
						type: 'text',
						validator: 'int min:0 maxlen:6',
						//limit: 'uint:6',
						formatFilter: 'comma',
						isEditable: function(item, row, column){
							// 店舗にないサイズを操作不可にする。
							if (!item.sizeRec || !item.sizeRec.length)
								return false;
							return _.some(item.sizeRec, function(size){
								return column.id === 'size_' + size.size_id;
							});
						}
					}
				};
			});

			// 現在のサイズ列に追加する。
			var sizeColumns = this.sizeColumns.concat(addColumn);

			// 重複を取り除く
			sizeColumns = _.uniq(sizeColumns, false, function(item){
				return item.id;
			});

			//【総合MD単独系-0699】対応のため削除
			// とりあえず名前で(name=size_name)順にソートする
			// sizeColumns = _.sortBy(sizeColumns, function(item){
			//	return item.name;
			//});

			// this.sizeColumnsを更新する
			this.sizeColumns = sizeColumns;

			this.columnUpdateFlag = true;
		},

		validateSizeColumns: function(dataGrid) {
			var bag = {};
			var sizeList = [];
			var data = dataGrid.getData();
			_.each(data, function(rec){
				_.each(rec.sizeRec, function(size){
					if (!bag[size.size_id]) {
						bag[size.size_id] = 0;
						sizeList.push(_.clone(size));
					}
					bag[size.size_id] += 1;
				});
			});
			this.clearSizeColumns();
			this.addSizeColumns(sizeList);
		},

		/**
		 * サイズ列のクリア
		 */
		clearSizeColumns: function(){
			this.sizeColumns = [];
		},

		/**
		 * テーブルヘッダ定義
		 */
		getOrigColumns: function(){

			var checkOutStockError = function(){
				// サーバ問い合わせ(商品ID, サイズ等の取得)に失敗し
				// たときこのセルにエラーを設定するバリデータ関数(★)

				// バリデータ関数からはthis.itemで行データにアクセスで
				// きる。サーバ問い合わせ失敗したときにoutStockErrorに
				// エラーメッセージを設定している。バリデータ関数からエ
				// ラーメッセージを戻したときこのセルに対してエラーが設
				// 定される。
				return this.item.itemError || this.item.outStockError;
			};

			/*var checkInStockError = function(){
				// 同入荷店舗版
				return this.item.inStockError;
			};*/

			// テーブルのヘッダ
			var columns = [
				{
					id: 'itgrpName',
					name: '品種',
					field: 'itgrpName',
					width: 180,
					cellType: {
						type: 'clajaxac',
						editorOptions: {
							funcName: 'varietycode',
							dependAttrs: function(item){
								return {
									unit_id: $('#ca_unitID').val()
								};
							}
						},
						validator: 'required'
					}
				},
				{
					id: 'maker',
					name: 'メーカー',
					field: 'maker',
					width: 180,
					cellType: {
						type: 'clajaxac',
						editorOptions: {
							funcName: 'vendorcode',
							dependAttrs: function(item){
								return {
									vendor_typeid: amdb_defs.MTTYPE_F_VENDOR_MAKER
								};
							}
						},
						validator: 'required'
					}
				},
				{
					id: 'itemCode',
					name: '品番',
					field: 'itemCode',
					width: 180,
					cellType: {
						type: 'text',
						//limit: 'hankaku len:10',
						isEditable: function(item){
							return Boolean(item.itgrpName && item.itgrpName.id);
						},
						//validator: 'required'
						validator: 'required hankaku min:0 maxlen:10'
					}
				},
				{
					id: 'color',
					name: 'カラー',
					field: 'color',
					width: 180,
					cellType: {
						type: 'clajaxselector',
						editorOptions: {
							funcName: 'color',
							dependAttrs: function(item){
								return {
									itemID: item.itemID
								};
							}
						},
						isEditable: function(item){
							return Boolean(item.itemID);
						},
						validator: 'required'
					}
				},
				/*{
					id: 'color',
					name: 'カラー',
					field: 'color',
					width: 180,
					cellType: {
						type: 'clajaxac',
						editorOptions: {
							funcName: 'colorcode',
							dependAttrs: function(item){
								return {
									itemID: item.itemID
								};
							}
						},
						isEditable: function(item){
							return Boolean(item.itemID);
						},
						validator: 'required'
					}
				},*/
				{
					id: 'outStore',
					name: '出荷店舗',
					field: 'outStore',
					width: 180,
					cellType: {
						type: 'clajaxac',
						editorOptions: {
							funcName: 'orgcode',
							dependAttrs: function(item){
								var unit_id = $('#ca_unitID').val();
								return {
									f_stockmng: 1,
									p_org_id : unit_id,
									orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
									orglevel_id: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
								};
							}
						},
						validator: ['required', checkOutStockError]
					}
				},
				{
					name: '在庫数',
					id: 'outStockQy',
					field: 'outStockQy',
					width: 100,
					// 右寄せ
					cssClass: 'txtalign-right',
					cellType: {
						// カンマ区切り
						formatFilter: 'comma'
						// // サーバ問い合わせ失敗でこのセルにエラーを設定(★)
						// validator: [checkOutStockError]
					}
				},
				{
					name: '支持率',
					id: 'outRate',
					field: 'outRate',
					width: 100,
					cssClass: 'txtalign-right',
					cellType: {
						// カンマ区切り, 小数部1桁
						formatFilter: 'comma fixed:1'// ,
						// // サーバ問い合わせ失敗でこのセルにエラーを設定(★)
						// validator: [checkOutStockError]
					}
				},
				{
					name: '効率',
					id: 'outEfficiency',
					field: 'outEfficiency',
					width: 100,
					cssClass: 'txtalign-right',
					cellType: {
						// カンマ区切り
						formatFilter: 'comma'// ,
						// // サーバ問い合わせ失敗でこのセルにエラーを設定(★)
						// validator: [checkOutStockError]
					}
				},
				{
					id: 'inStore',
					name: '入荷店舗',
					field: 'inStore',
					width: 180,
					cellType: {
						type: 'clajaxac',
						editorOptions: {
							funcName: 'orgcode',
							dependAttrs: function(item){
								var unit_id = $('#ca_unitID').val();
								return {
									f_stockmng: 1,
									p_org_id : unit_id,
									orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
									orglevel_id: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
								};
							}
						},
						validator: 'required'
					}
				},
				{
					name: '在庫数',
					field: 'inStockQy',
					width: 100,
					// 右寄せ
					cssClass: 'txtalign-right',
					cellType: {
						// カンマ区切り
						formatFilter: 'comma'
						//validator: [checkInStockError]
					}
				},
				{
					name: '支持率',
					field: 'inRate',
					width: 100,
					// 右寄せ
					cssClass: 'txtalign-right',
					cellType: {
						// カンマ区切り, 小数部1桁
						formatFilter: 'comma fixed:1'
						//validator: [checkInStockError]
					}
				},
				{
					name: '効率',
					field: 'inEfficiency',
					width: 100,
					// 右寄せ
					cssClass: 'txtalign-right',
					cellType: {
						// カンマ区切り
						formatFilter: 'comma'
						//validator: [checkInStockError]
					}
				}
			];
			return columns;
		},

		/**
		 * getColumns関数
		 */
		getColumns: function(){
			return _.union(this.getOrigColumns(), this.sizeColumns);
		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){

			_.bindAll(this);

			// 依頼名称のフィールドカウント
			clutil.cltxtFieldLimit($("#ca_instructName"));

			// 移動理由のフィールドカウント
			clutil.cltxtFieldLimit($("#ca_reason"));

			// 店舗通知事項のフィールドカウント
			clutil.cltxtFieldLimit($("#ca_comment"));

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
					title: '移動依頼作成（セットアップ）',
					subtitle: clutil.opeTypeIdtoString(fixopt.opeTypeId),
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,

					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,

					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined
				};

				// 新規、編集：下部ナビボタンは［一時保存］［移動依頼作成］の２つを配置
				switch(fixopt.opeTypeId){
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					_.extend(mdOpt, {
						opeTypeId: [
							am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE,	// 一時保存
							{
								opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
								label: '移動依頼作成'
							}
						]
					});
				}

				return mdOpt;

			},this)(fixopt);

			if(fixopt.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {

				// 新規作成時、「移動後のセットアップバランスを見る」ボタンは操作不可とする
				this.$('#cl_csv').prop('disabled', true);

			}

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			///////////////// 検索結果データグリッドの表示
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid',
				errorInside: true,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ。
			});

			var mainView = this;

			// 行削除フラグを行データに設定する
			this.dataGrid.on('row:delToggle', function(args){

				/////// 不要なサイズ列を削除する処理 //////////////////
				// columnsにサイズ列を追加したものを取得する
				mainView.validateSizeColumns(mainView.dataGrid);

				var newColumns = mainView.getColumns();

				// 新しいカラムをdataGridに設定する
				mainView.dataGrid.setColumns(newColumns);
				//////////////////////////////////////////////////////

				args.item.isDeleted = args.isDeleted;
			});

			var dataGrid = this.dataGrid;

			this.graph = new clutil.Relation.DependGraph()
			.add({
				// 品番 => 品種に依存
				id: 'itemCode',
				depends: ['itgrpName.id'],
				onDependChange: function(e){
					e.model.set('itemCode', '');
				}
			})
			.add({

				id: 'color.id',
				depends: ['itgrpName.id', 'maker.id', 'itemCode'],
				onDependChange: function(e){
					// 品種、メーカー、品番が変更された => 商品IDを取得

					var model = e.model;

					// 品種IDを取得
					var itgrpID = model.get('itgrpName.id');
					// メーカーIDを取得
					var makerID = model.get('maker.id');
					// 品番を取得
					var itemCode = model.get('itemCode');

					// 商品ID、ネームを空にする関数
					var setEmpty = function(itemError){
						model.set({
							itemID: 0,
							itemName: '',
							'color.id': 0,
							'color.name': '',
							'color.code': '',
							// サーバ問い合わせ失敗でエラーメッセージを
							// 設定する(★)
							itemError: itemError
						});
					};

					if (!itgrpID || !makerID || !itemCode){
						// 何も設定されていなければ空にして終わり
						setEmpty();
						return;
					}

					// 品種・メーカー・品番から商品名等を検索用オブジェクト
					var obj = {
						itgrp_id : itgrpID,		//品種ID
						maker_id : makerID,		//メーカーID
						maker_code : itemCode	//メーカー品番
					};

					// 品種・メーカー・品番から商品名等を検索する関数を呼ぶ
					clutil.clmakeritemcode2item(obj)
						.done(function(data){
							if (data.head.status){
								var msg = clmsg[data.head.message];
								// 失敗したときは空にする(★)
								setEmpty(msg);
								return;
							}
							// 商品ID、ネーム、出荷店舗情報を設定する。
							model.set({
								itemID: data.rec.itemID,
								itemName: data.rec.itemName,
								itemError: ''
							});
						})
						.fail(function(data){
							var msg = clmsg[data.rspHead.message];
							// 失敗したときは空にする(★)
							setEmpty(msg);
						})
						.always(e.async()); // 非同期が完了したことを通知する
				}
			})
			.add({
				// 在庫数は出荷店舗が変わったときにサーバから取得する
				id: 'outStockQy',
				depends: ['itemID', 'color.id', 'outStore.id'],
				onDependChange: function(e){
					// 商品IDまたは「出荷店舗」が変更された

					var model = e.model;

					// 商品IDを取得
					var itemID = model.get('itemID');

					// 出荷店舗IDを取得
					var outStoreID = model.get('outStore.id');

					// カラーIDを取得
					var colorID = model.get('color.id');

					// 前のsizeRec
					var prevSizeRec = model.get('sizeRec');

					// 移動数量をクリアする
					var clearSize = function(){
						_.each(prevSizeRec, function(size) {
							model.unset('size_' + size.size_id);
						});

					};

					// 在庫数、支持率、効率、サイズを空にする関数
					var setEmpty = function(outStockError){

						clearSize();

						model.set({

							/*outStockQy: '',
							outRate: '',
							outEfficiency: '',
							sizeRec: [],*/

							outStockQy: outStockError ? 0 : '',
							outRate: outStockError ? 0 : '',
							outEfficiency: outStockError ? 0 : '',
							sizeRec: [],

							// 在庫数・支持率・効率の取得に失敗した場合
							// エラーメッセージを設定する(★)
							outStockError: outStockError
						});

						mainView.addSizeColumns([]);
					};

					if (!itemID|| !outStoreID || !colorID){
						// 何も設定されていなければ空にして終わり
						setEmpty();
						return;
					}

					// 商品ID・出荷店舗ID・カラーIDから在庫数・支持率・効率を取得する
					clutil.postJSON('am_pa_stock_rate', {
						reqHead: {
						},
						cond: {
							item_id: itemID,
							color_id: colorID,
							store_id: outStoreID
						}
					})
						.done(function(data){
							// am_pa_stock_rate の応答結果
							console.log('am_pa_stock_rate', data);

							// 移動数量をクリア
							clearSize();

							// 前のサイズをクリアする
							_.each(model.get('sizeRec'), function(size) {
								model.unset('size_' + size.size_id);
							});

							// サーバから返ってきた値をセットします。
							model.set({
								outStockQy		: data.list[0].stock_qy,
								outRate			: data.list[0].loyalty_rt,
								outEfficiency	: data.list[0].efficiency,
								sizeRec			: data.list[0].sizeRec,
								outStockError: ''
							});

							// 【総合MD単独系-0703】帳簿在庫数のデフォルト表示は不要
							// サイズを初期設定する
							//_.each(data.list[0].sizeRec, function(size){
							//	model.set('size_' + size.size_id, size.stock_qy);
							//});

							// サイズ列が渡ってくるので現在のカ
							// ラムに追加する。
							mainView.addSizeColumns(data.list[0].sizeRec);
						})
						.fail(function(data){
							var msg = clmsg[data.rspHead.message];
							// 失敗したときは空にする(★)
							setEmpty(msg);
						})
						.always(e.async()); // 非同期が完了したことを通知する
				}
			})
			.add({

				// 在庫数は入荷店舗が変わったときにサーバから取得する

				id: 'inStockQy',
				depends: ['itemID', 'color.id', 'inStore.id'],
				onDependChange: function(e){
					// 商品IDまたは「入荷店舗」が変更された

					var model = e.model;

					// 商品IDを取得
					var itemID = model.get('itemID');

					// カラーIDを取得
					var colorID = model.get('color.id');

					// 入荷店舗IDを取得
					var inStoreID = model.get('inStore.id');

					// 在庫数、支持率、効率を空にする関数
					var setEmpty = function(inStockError){
						model.set({
							/*inStockQy: '',
							inRate: '',
							inEfficiency: '',
							inStockError: inStockError*/

							inStockQy: inStockError ? 0 : '',
							inRate: inStockError ? 0 : '',
							inEfficiency: inStockError ? 0 : '',
							inStockError: inStockError
						});
					};

					if (!itemID|| !inStoreID || !colorID){
						// 何も設定されていなければ空にして終わり
						setEmpty();
						return;
					}

					// 商品ID・入荷店舗IDから在庫数・支持率・効率を取得する
					clutil.postJSON('am_pa_stock_rate', {
						reqHead: {
						},
						cond: {
							item_id: itemID,
							color_id: colorID,
							store_id: inStoreID
						}
					})
						.done(function(data){
							// am_pa_stock_rate の応答結果
							console.log('am_pa_stock_rate', data);

							// サーバから返ってきた値をセットします。
							model.set({
								inStockQy		: data.list[0].stock_qy,
								inRate			: data.list[0].loyalty_rt,
								inEfficiency	: data.list[0].efficiency
							});
						})
						.fail(function(data){
							var msg = clmsg[data.rspHead.message];
							// 失敗したときは空にする(★)
							setEmpty(msg);
						}) // 失敗したときは空にする
						.always(e.async()); // 非同期が完了したことを通知する
				}
			});

			/**
			 * 新規行追加・サイズ列カラム追加処理
			 */
			this.listenTo(this.dataGrid, {

				// 新規行追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {};
					gridView.addNewItem(newItem);
				},

				// エディット完了後に行データとデータビューが同期された
				// ときに呼ばれる。カラムの追加処理などを行う。
				'cell:change': function(e){
					console.log('cell:change');

					// サーバ問い合わせ失敗チェック(★)
					// this.dataGrid.isValidRow(e.item);

					if (this.columnUpdateFlag){
						// どのセルが変更されてもここが呼ばれるので毎回
						// カラムを設定することになるため、
						// columnUpdateFlagがtrueのときのみ更新する。

						// columnsにサイズ列を追加したものを取得する
						this.validateSizeColumns(this.dataGrid);
						var newColumns = this.getColumns();
						// 新しいカラムをdataGridに設定する
						this.dataGrid.setColumns(newColumns);
						this.columnUpdateFlag = false;
					}
				}
			});

			/**
			 * データグリッド表示
			 */
			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColumn: 3
				},
				columns: this.getColumns(),
				data: [
					    clutil.dclone(emptyRec),
					    clutil.dclone(emptyRec),
					    clutil.dclone(emptyRec),
					    clutil.dclone(emptyRec),
					    clutil.dclone(emptyRec)
					],
				rowDelToggle: true,
				graph: this.graph
			});

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				this.dataGrid.setEnable(false);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;

			default:
				// それ以外は、Submit と、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			//更新回数ステータス設定
			this.state = {
				recno: "",
				state: 0
			};

			// ツールチップ
			$("#ca_tp_code1").tooltip({html: true});

			return this;
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			this.mdBaseView.initUIElement();

			// セットアップオートコンプリート
			this.relation = clutil.FieldRelation.create("default", {
				// 事業ユニット取得
				clbusunitselector: {
					el: "#ca_unitID"
				},
				// セットアップオートコンプリート
				clsetupcode: {
					el: "#ca_setupID"
				}
			});

			if(clcom.userInfo.unit_id !== amcm_type.AMCM_VAL_USER_STAFF_SYS) {
				// 事業ユニットにログインユーザの所属ユニットを表示する
				this.relation.fields.clbusunitselector.setValue(clcom.userInfo.unit_id);

				// 事業ユニットを操作不可にする
				clutil.inputReadonly(this.relation.fields.clbusunitselector.$el);

				this.dataGrid.setEnable(true);
			}

			// 店舗出力日の初期化
			this.releaseDatePicker = clutil.datepicker(this.$('#ca_releaseDate'));

			// 移動出荷期限の初期化
			this.limitDatePicker = clutil.datepicker(this.$('#ca_limitDate'));

			// アラーム表示期限の初期化
			this.alarmDatePicker = clutil.datepicker(this.$('#ca_alarmDate'));

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
		 * MT-1493エラー行、警告行クリック時に該当の行までスクロールする処理 yamaguchi
		 */
		_onErrWrnClick: function(args) {
			this.dataGrid.grid.scrollRowIntoView($(args.currentTarget).data('rownum'),1);
		},

		/**
		 * 移動日付に設定された日付をアラーム日付に設定する
		 * （カレンダーから日付を選択した場合）
		 */
		pickLimitDateBlur: function(){
			if($("#ca_alarmDate").val() == ""){
				var data = clutil.view2data($('#ca_limitDateArea'));
				data.alarmDate = data.limitDate;

				clutil.data2view($('#ca_alarmDateArea'), data);
			}
		},

		/**
		 * 移動日付に設定された日付をアラーム日付に設定する
		 * （日付を直接入力した場合）
		 */
		changeLimitDateBlur: function(){
			if($("#ca_alarmDate").val() == ""){
				var data = clutil.view2data($('#ca_limitDateArea'));
				data.alarmDate = data.limitDate;

				clutil.data2view($('#ca_alarmDateArea'), data);
			}
		},

		/**
		 * 添付ファイル名をクリックしてダウンロード
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
		 * 添付ファイル削除押下
		 */
		_onDelFileClick: function(){
			$("#ca_label").html("");
			$("#ca_fileID").val("");
			this.fileURL = "";
		},

		/**
		 * XXX: 画面描画
		 */
		render: function(){

			this.mdBaseView.render();

			// 情シスでログイン
			if(clcom.userInfo.unit_id === amcm_type.AMCM_VAL_USER_STAFF_SYS) {
				clutil.setFocus(this.$("#ca_unitID"));
			}else {
				// 情シス以外の本部ユーザでログイン
				clutil.setFocus(this.$("#ca_instructName"));
			}

			if (this.options.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {

				this.mdBaseView.fetch();	// データを GET してくる。

			}

			return this;
		},

		/**
		 * Submit 応答のイベントを受ける
		 */
		_onMDSubmitCompleted: function(args, e){

			switch(args.status){

			case 'DONE':		// 確定済

				// テーブル以外の画面項目を操作不可にする
				// clutil.viewReadonly(this.$("#ca_searchArea"));
				clutil.viewReadonly(this.$("#ca_instructArea"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				if(!this.srchID) {
					// 新規に払い出した移動依頼IDをセットする
					this.srchID = args.data.AMTSV0060GetRsp.recTempInstruct.instructID;
				}

				// 「移動後のセットアップバランスを見る」ボタンは操作可とする
				this.$('#cl_csv').prop('disabled', false);

				// MT-1493 エラー・警告行表示
				var row_alert = [];
				var row_error = [];
				ClGrid.showAlert(row_alert);
				ClGrid.showError(row_error);

				break;

			case 'CONFLICT':	// 別のユーザによって DB が更新された

				// テーブル以外の画面項目を操作不可にする
				clutil.viewReadonly(this.$("#ca_searchArea"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			case 'DELETED':		// 別のユーザによって削除された

				// テーブル以外の画面項目を操作不可にする
				clutil.viewReadonly(this.$("#ca_searchArea"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。

				// もう一回チャレンジできるようになにもしない!!!
				this.mdBaseView.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				var msg = args.data.rspHead;
				break;
			}
		},

		/**
		 * XXX: GET 応答のイベントを受ける
		 */
		_onMDGetCompleted: function(args, e){

			console.log('args.status: [' + args.status + ']');

			// XXX
			this.state.recno = args.data.rspHead.recno;
			this.state.state = args.data.rspHead.state;

			switch(args.status){

			case 'OK':

				// 移動依頼作成（セットアップ）情報を表示する
				this.data2view(args.data);

				// 編集可の状態にする。
				clutil.viewRemoveReadonly($("#ca_searchArea"));

				// 依頼番号は操作不可とする
				clutil.inputReadonly($("#ca_instructNo"));

				this.dataGrid.setEnable(true);

				// 情シスでログイン
				if(clcom.userInfo.unit_id === amcm_type.AMCM_VAL_USER_STAFF_SYS) {
					clutil.setFocus(this.$("#ca_unitID"));
				}else {
					// 情シス以外の本部ユーザでログイン
					clutil.inputReadonly($("#ca_unitID"));
					clutil.setFocus(this.$("#ca_instructName"));
				}

				switch (this.options.opeTypeId) {

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:

					// 照会モード・削除モードは、Edit ブロッキングしておく。
					clutil.viewReadonly(this.$("#ca_searchArea"));

					// グリッドのEditを無効にする
					this.dataGrid.setEnable(false);

					break;
				}

				break;

			case 'DONE':		// 確定済

				// 移動依頼作成（セットアップ）情報を表示する
				this.data2view(args.data);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_searchArea"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_searchArea"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース

				// 検索結果を画面に表示する
				this.data2view(args.data);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_searchArea"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			default:
			case 'NG':			// その他エラー。

				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_searchArea"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;
			}
		},

		/**
		 * 検索結果を画面に表示する
		 */
		data2view: function(data){

			var _this = this;

			this.saveData = data.AMTSV0060GetRsp;

			// 移動依頼指示レコードを取得
			var recTempInstruct = data.AMTSV0060GetRsp.recTempInstruct;

			// 移動依頼指示商品レコードを取得
			var recTempItem = data.AMTSV0060GetRsp.recTempItem;

			// ===== 移動依頼指示レコードの表示 ========

			// セットアップ内容を画面に表示する
			recTempInstruct.setupID = {
				id: recTempInstruct.setup.id,
				code: recTempInstruct.setup.code,
				name: recTempInstruct.setup.name
			};

			// 事業ユニット・依頼番号・依頼名称を画面に表示
			clutil.data2view(_this.$('#ca_instructArea'), recTempInstruct);

			//添付ファイル情報の取得と画面への表示
			if(recTempInstruct.fileName != ""){
				var line = '<a id="ca_fileName" class="cl_filedownld" target="_blank">' + recTempInstruct.fileName + '</a>';
				$("#ca_label").html(line);
				this.fileURL = recTempInstruct.fileURL;
			}

			var data = [];
			this.clearSizeColumns();

			for(var i=0; i < recTempItem.length; i++) {

				var maker = {
					id : recTempItem[i].makerID,
					code : recTempItem[i].makerCode,
					name : recTempItem[i].makerName
				};

				var color = {
					id : recTempItem[i].colorID,
					code : recTempItem[i].colorCode,
					name : recTempItem[i].colorName
				};

				var outStore = {
					id : recTempItem[i].storeRec.outStoreID,
					code : recTempItem[i].storeRec.outStoreCode,
					name : recTempItem[i].storeRec.outStoreName
				};

				var inStore = {
					id : recTempItem[i].storeRec.inStoreID,
					code : recTempItem[i].storeRec.inStoreCode,
					name : recTempItem[i].storeRec.inStoreName
				};

				data[i] = {
					itgrpName : recTempItem[i].stditgrp,
					maker : maker,
					color : color,
					itemCode : recTempItem[i].itemCode,
					itemID: recTempItem[i].itemID,
					outStore : outStore,
					outStockQy : recTempItem[i].storeRec.outStockQy,
					outRate : recTempItem[i].storeRec.outRate,
					outEfficiency : recTempItem[i].storeRec.outEfficiency,
					inStore : inStore,
					inStockQy : recTempItem[i].storeRec.inStockQy,
					inRate : recTempItem[i].storeRec.inRate,
					inEfficiency : recTempItem[i].storeRec.inEfficiency,
					sizeRec: _.map(recTempItem[i].storeRec.sizeQyRec, function(item){
						var size = _.where(recTempItem[i].sizeRec, {
							sizeID: item.sizeID
						})[0];

						return {
							size_id: item.sizeID,
							size_name: size && size.sizeName || ''
						};
					})
				};
				var sizeQyRec = recTempItem[i].storeRec.sizeQyRec;
				for(var j=0; j<sizeQyRec.length; j++){
					var rec = sizeQyRec[j];
					data[i]['size_' + rec.sizeID] = rec.instructQy;
				}
				this.addSizeColumns(_.map(recTempItem[i].sizeRec, function(item){
					// addSizeColumns()の形式に合うように変換する
					return {
						size_id: item.sizeID,
						size_name: item.sizeName
					};
				}));
			}

			this.dataGrid.setData({
				rowDelToggle: true,
				data: data
			});
			this.dataGrid.setColumns(this.getColumns());
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){

			var flag = true;

			// データグリッド以外の項目の未入力エラー確認
			if(!this.validator.valid()){
				flag = false;
			}

			// ===== 日付大小エラーチェック ===============================
			var data = clutil.view2data($("#ca_searchArea"));
			// 店舗出力日
			var release = data.releaseDate;
			// 移動出荷期限
			var limit = data.limitDate;
			// アラーム表示期限
			var alarm = data.alarmDate;
			// 運用日
			var today = clcom.getOpeDate();

			// 「運用日≦店舗出力日」でない場合、エラーを出力する
			if((release != "") && (today >= release)){
				clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
				this.validator.setErrorMsg($("#ca_releaseDate"), clutil.getclmsg('EGM0047'));
				flag = false;
			}

			// 「店舗出力日≦移動出荷期限」でない場合、エラーを出力する
			if((release != "") && (limit != "") && (release > limit)){
				clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
				this.validator.setErrorMsg($("#ca_limitDate"), clutil.getclmsg('ETR0012'));
				flag = false;
			}

			// 「移動出荷期限≦アラーム表示期限」でない場合、エラーを出力する
			if((limit != "") && (alarm != "") && (limit > alarm)){
				clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
				this.validator.setErrorMsg($("#ca_alarmDate"), clutil.getclmsg('ETR0013'));
				flag = false;
			}

			// ============================================================
			if(_.isEmpty(this.dataGrid.getData({
				filterFunc: ClGrid.getEmptyCheckFunc(this.dataGrid)
			}))){
				if(flag === false) {
					clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
				} else {
					// データグリッドに何も入力されていない場合はエラー
					var msg = clutil.fmt(clutil.getclmsg('cl_its_required'),'品種、メーカー、品番、カラー、出荷店舗、入荷店舗、サイズ別移動数');
					clutil.mediator.trigger('onTicker', msg);
					flag = false;
				}
			}

			if(this.dataGrid.isValid({

				tailEmptyCheckFunc: ClGrid.getEmptyCheckFunc(this.dataGrid),

				filter: function(item){

					return Boolean(item.isDeleted);

				}}) === false) {

					// 入力項目の最大桁数オーバー、入力必須項目が未入力の場合は
					// エラーとし、returnする
					clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

					flag = false;
			}
			this.gridData = this.dataGrid;

			return flag;
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId){

			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + ']');

			// エラーチェック
			if(this.isValid() == false){
				var data = this.gridData.getData();
				var num = 0;
				$.each(data, function(){
					data[num].rowIndex = num;
					num++;
				});

//				var row_alert = [];
				var row_error = ClGrid.getErrorRow(this.gridData.metadatas.body, data, 0);
//				ClGrid.showAlert(row_alert);
				ClGrid.showError(row_error);
				return;
			}

			var statFlag = true;

			// 事業ユニット・品種・指示番号・指示名称を取得
			var instructInfo = clutil.view2data(this.$('#ca_instructArea'));

			// 事業ユニットID・コード・名称を取得
			var unitInfo = this.relation.fields.clbusunitselector.getAttrs();

			var setupInfo = this.relation.fields.clsetupcode.getAttrs();

			// 移動依頼指示レコード
			var recTempInstruct = {

				instructNo : instructInfo.instructNo,
				instructName : instructInfo.instructName,
				unitID : unitInfo.id,
				unitCode : unitInfo.code,
				unitName : unitInfo.name,
				setup : setupInfo,
				releaseDate : instructInfo.releaseDate,
				limitDate : instructInfo.limitDate,
				alarmDate : instructInfo.alarmDate,
				reason : instructInfo.reason,
				comment : instructInfo.comment,
				fileID : Number(instructInfo.fileID)

			};

			if(this.saveData){

				// 編集・削除の場合
				recTempInstruct.instructID = this.saveData.recTempInstruct.instructID;

				// Get応答結果の仮移動指示明細リストの要素
				var _saveRecTempItem = this.saveData.recTempItem;

			}

			// データグリッドの設定内容を取得
			var itemStoreList = this.dataGrid.getData({

				delflag: false,
				tailEmptyCheckFunc: ClGrid.getEmptyCheckFunc(this.dataGrid)

			});

			// 仮移動指示明細レコードリスト
			var recTempItem = [];

			// 同一カラー商品重複チェック用連想配列
			var chkDupItemCol = {};

			if(!_.isEmpty(itemStoreList)) {

				// 移動依頼指示商品数のカウンタをリセット
				var i = 0;

				// 移動依頼指示商品のループ
				_.each(itemStoreList, function(data){

					// 行のID
					var rowId = data[this.dataGrid.idProperty];

					if(data.itgrpName && data.maker && data.color && data.itemCode
							&& data.outStore && data.inStore) {

						// 移動依頼指示商品レコード
						recTempItem[i] = {
							stditgrp : data.itgrpName,
							makerID : data.maker.id,
							makerCode : data.maker.code,
							makerName : data.maker.name,
							colorID : data.color.id,
							colorCode : data.color.code,
							colorName : data.color.name,
							itemCode : data.itemCode
						};

						// 商品IDをセット
						if(data.itemID) {

							recTempItem[i].itemID = data.itemID;

						} else {

							recTempItem[i].itemID = _saveRecTempItem[i].itemID;
						}

						var key = String(recTempItem[i].itemID) + ':' + String(data.color.id)
									+ ':' + String(data.outStore.id) + ':' + String(data.inStore.id);

						var ret = chkDupItemCol[key];

						if(ret === 1) {

							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

							// 同一の商品・入荷店舗・出荷店舗の組み合わせが既に存在するのでエラー
							var msg = clutil.getclmsg('EMS0052');
							this.dataGrid.setCellMessage(rowId, 'outStore', 'error', msg);
							this.dataGrid.setCellMessage(rowId, 'inStore', 'error', msg);

							statFlag = false;

						} else {
							// 商品IDをキー、カラーIDを値として連想配列にセット
							chkDupItemCol[key] = 1;
						}

						// 商品名をセット
						if(data.itemName) {

							recTempItem[i].itemName = data.itemName;

						} else {

							recTempItem[i].itemName = _saveRecTempItem[i].itemName;
						}

						if(data.outStore.id === data.inStore.id) {

							// 出荷店舗と入荷店舗が同じ場合はエラー
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

							var msg = clutil.getclmsg('ETS0001');
							this.dataGrid.setCellMessage(rowId, 'outStore', 'error', msg);
							this.dataGrid.setCellMessage(rowId, 'inStore', 'error', msg);

							statFlag = false;
						}

						// 移動依頼店舗レコード
						var storeRec = {
							outStoreID : data.outStore.id,	// 出荷店舗ID
							outStoreCode : data.outStore.code,	// 出荷店舗コード
							outStoreName : data.outStore.name,	// 出荷店舗名称
							outStockQy : data.outStockQy,	// 出荷店在庫数
							outRate : data.outRate,	// 出荷店支持率
							outEfficiency : data.outEfficiency,	// 出荷店効率

							inStoreID : data.inStore.id,	// 入荷店舗ID
							inStoreCode : data.inStore.code,	// 入荷店舗コード
							inStoreName : data.inStore.name,	// 入荷店舗名称
							inStockQy : data.inStockQy,	// 入荷店在庫数
							inRate : data.inRate,	// 入荷店支持率
							inEfficiency : data.inEfficiency	// 入荷店効率
						};

						// 移動依頼サイズレコード
						var sizeRec = [];

						// 移動依頼サイズ別数量レコード
						var sizeQyRec = [];

						if(this.saveData) {
							// Get応答結果の移動依頼サイズレコードリスト
							if(!_.isEmpty(this.saveData.recTempItem[i])) {
								var _saveSizeRecList = this.saveData.recTempItem[i].sizeRec;
							}
						}

						if(_.isEmpty(data.sizeRec) || data.sizeRec.length ===0) {
							// 移動依頼サイズレコードが取得できない場合はエラー
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

							statFlag = false;
						}

						// 移動依頼サイズレコードのループ
						for(var j = 0; j < data.sizeRec.length; j++) {

							var size_id = data.sizeRec[j].size_id;
							var size_name;

							if(data.sizeRec[j].size_name) {

								size_name = data.sizeRec[j].size_name;
							} else {
								size_name = _saveSizeRecList[j].sizeName;
							}

							// 移動依頼サイズレコードの要素
							var tempSizeRec = {
								sizeID : size_id,
								sizeName :  size_name
							};

							sizeRec.push(tempSizeRec);

							var stock_qy = 0;

							if(data.sizeRec[j].stock_qy) {

								stock_qy = data.sizeRec[j].stock_qy;

							} else {
								if(!_.isEmpty(_saveRecTempItem)) {

									stock_qy = _saveRecTempItem[i].storeRec.sizeQyRec[j].stockQy;
								}
							}

							// サイズ別移動数量に何も入力されていない
							// var instructQy = data['size_' + size_id];

							/*if(!instructQy) {
								clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
								var colName = 'size_' + size_id;
								this.dataGrid.setCellMessage(rowId, colName, 'error', clutil.getclmsg('cl_required'));

								statFlag = false;
							}*/

							// サイズ別数量レコードの要素
							var tmp_sizeQyRec = {
								sizeID : data.sizeRec[j].size_id,
								stockQy : stock_qy,
								instructQy: data['size_' + size_id]
							};

							if(tmp_sizeQyRec.stockQy < tmp_sizeQyRec.instructQy) {

								clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

								var msg = clutil.getclmsg('ETS0003');
								var colName = 'size_' + size_id;
								this.dataGrid.setCellMessage(rowId, colName, 'error', msg);

								statFlag = false;
							}

							sizeQyRec.push(tmp_sizeQyRec);

						}// 移動依頼サイズレコードのループ終了

						storeRec.sizeQyRec = sizeQyRec;

						// 移動依頼店舗レコードにシーケンス番号を追加
						storeRec.seq = i;

						recTempItem[i].storeRec = storeRec;

						recTempItem[i].sizeRec = sizeRec;

						// 移動依頼指示商品数のカウンタを１増やす
						i = i + 1;
					}

				},this);
			}

			if(statFlag === false) {
				return;
			}

			var updReq = {
				recTempInstruct : recTempInstruct,
				recTempItem : recTempItem
			};

			// XXX
			var reqHead = {
				opeTypeId : opeTypeId,
				recno: this.state.recno,
				state: this.state.state
			};

			var reqObj = {
				reqHead : reqHead,
				AMTSV0060UpdReq  : updReq
			};

			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		/**
		 * Get リクエストを作る
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			var chkData = this.options.chkData[pgIndex];

			this.srchID = chkData.id;

			var getReq = {

				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},

				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},

				// 移動依頼（セットアップ）検索リクエスト
				AMTSV0060GetReq: {
					srchID: chkData.id // 指示ID
				},

				// 移動依頼（セットアップ）更新リクエスト -- 今は検索するので、空を設定
				AMTSV0060UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMTSV0060',
				data: getReq
			};
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

				this.doCSVDownload(rtyp);

				break;

			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * CSVダウンロード
		 */
		doCSVDownload: function(rtyp){
			// リクエストをつくる
			// var srchReq = this.buildReq(rtyp);

			if(this.srchID) {
				var srchID = this.srchID;

				var srchReq = {

					// 共通ヘッダ
					reqHead: {
						opeTypeId: rtyp
					},

					AMTSV0060GetReq: {
						srchID: srchID		// 指示ID
					}
				};

				if(_.isNull(srchReq)){
					return;
				}

				// 要求を送出
				// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
				var defer = clutil.postDLJSON('AMTSV0060', srchReq);
				defer.fail(_.bind(function(data){
					// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
					// AJAX 呼び出しの共通処理で済ませるべきか・・・
					clutil.mediator.trigger('onTicker', data);
				}, this));
			}
		},

		/**
		 * 事業ユニット変更
		 */
		_onUnitIDSelect: function(e){

			// 事業ユニットが変更されたときはグリッドを空にする
			this.clearSizeColumns();
			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColumn: 3
				},
				columns: this.getColumns(),
				data: [
					    clutil.dclone(emptyRec),
					    clutil.dclone(emptyRec),
					    clutil.dclone(emptyRec),
					    clutil.dclone(emptyRec),
					    clutil.dclone(emptyRec)
					],
				rowDelToggle: true,
				graph: this.graph
			});

			var value = this.relation.fields.clbusunitselector.getValue();
			this.dataGrid.setEnable(Boolean(value));
		},

		/**
		 * 移動依頼一覧(一括)(AMTRV0010)へ遷移
		 * @param e
		 */
		_onAMTRV0010Click: function(e) {

			var url = clcom.appRoot + '/AMTR/AMTRV0010/AMTRV0010.html';

			clcom.pushPage({
				url: url,
				args: {}
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

		_eof: 'AMTSV0060.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){

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
