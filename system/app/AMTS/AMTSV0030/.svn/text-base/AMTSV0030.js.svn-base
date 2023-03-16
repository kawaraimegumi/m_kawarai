/**
 * 移動依頼作成（サイズアソート）
 */

useSelectpicker2();

$(function() {

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	/*
	 * <div id="ca_instructArea">～</div> 範囲で、
	 * 入力データを取得する。
	 */
	function getInstructDto(){
		var $div = $('#ca_instructArea');
		return clutil.view2data($div);
	}

	var emptyRec = {
		outStore: '',
		outStockQy: null,
		outRate: null,
		outEfficiency: null,
		inStore: '',
		inStockQy: null,
		inRate: null,
		inEfficiency: null
	};

	//////////////////////////////////////////////
	// 移動依頼対象View
	var ItemCodeInputView = Backbone.View.extend({

		template: _.template($('#ca_rec_template_itemStore').html()),

		events: {
			'click .delFieldUnits > span'	: '_onClickDelBtn'			// ［×］削除ボタンアクション
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
					name: item.size_name,
					field: 'size_' + item.size_id,
					width: 100,
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

			//【総合MD単独系-0699】対応のため削除する
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

			/**
			 * サーバ問い合わせ(商品ID, サイズ等の取得)に失敗し
			 * たときこのセルにエラーを設定するバリデータ関数(★)
			 *
			 * バリデータ関数からはthis.itemで行データにアクセスで
			 * きる。サーバ問い合わせ失敗したときにoutStockErrorに
			 * エラーメッセージを設定している。バリデータ関数からエ
			 * ラーメッセージを戻したときこのセルに対してエラーが設
			 * 定される。
			 */
			var checkOutStockError = function(){

				//return this.item.itemError || this.item.outStockError;
				return this.item.outStockError;

			};

			// テーブルのヘッダ
			var columns = [
				{
					name: "出荷店舗",
					id: 'outStore',
					field: "outStore",
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
									orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
									orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
								};
							}
						},
						// サーバ問い合わせ失敗でこのセルにエラーを設定(★)
						validator: ['required', checkOutStockError]
					}
				},
				{
					name: '在庫数',
					field: 'outStockQy',
					width: 100,
					// 右寄せ
					cssClass: 'txtalign-right',
					cellType: {
						// カンマ区切り
						formatFilter: 'comma'
					}
				},
				{
					name: '支持率',
					field: 'outRate',
					width: 100,
					cssClass: 'txtalign-right',
					cellType: {
						// カンマ区切り, 小数部1桁
						formatFilter: 'comma fixed:1'
					}
				},
				{
					name: '効率',
					field: 'outEfficiency',
					width: 100,
					// 右寄せ
					cssClass: 'txtalign-right',
					cellType: {
						// カンマ区切り
						formatFilter: 'comma'
					}
				},
				{
					name: "入荷店舗",
					field: "inStore",
					id: 'inStore',
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
									orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
									orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
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
					}
				},
				{
					name: '支持率',
					field: 'inRate',
					width: 100,
					cssClass: 'txtalign-right',
					cellType: {
						// カンマ区切り, 小数部1桁
						formatFilter: 'comma fixed:1'
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
		 * 右上の［×］削除ボタンアクション
		 */
		_onClickDelBtn: function(e){

			this.trigger('ItemCodeInputView:destroy', this);

		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){

			_.bindAll(this);

			this.options = _.defaults(opt || {}, {
				btn_del: false
			});

			// メーカー、品番、カラー部品のautocompleteなどの初期化とか・・

			// 依頼名称のフィールドカウント
			// clutil.cltxtFieldLimit($("#ca_instructName"));

		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			// autocomplate 部品の初期化とか・・・

			return this;
		},

		/**
		 * メーカー・品番・カラー・データグリッドの描画
		 */
		render: function(){
			this.$el.html(this.template(this.options));

			var view = this;

			// データグリッドの表示
			this.dataGrid = new ClGrid.ClAppGridView({
				el: this.$('.cl_datagrid_container'),//'#ca_datagrid',
				errorInside: true,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ。
			});

			// 行削除フラグを行データに設定する
			this.dataGrid.on('row:delToggle', function(args){

				/////// 不要なサイズ列を削除する処理 //////////////////
				// columnsにサイズ列を追加したものを取得する
				view.validateSizeColumns(view.dataGrid);

				var newColumns = view.getColumns();

				// 新しいカラムをdataGridに設定する
				view.dataGrid.setColumns(newColumns);
				//////////////////////////////////////////////////////

				args.item.isDeleted = args.isDeleted;
			});

			this.listenTo(this.dataGrid, {
				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {};
					gridView.addNewItem(newItem);
				},

				// エディット完了後に行データとデータビューが同期された
				// ときに呼ばれる。カラムの追加処理などを行う。
				'cell:change': function(){
					console.log('cell:change');

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
						this.dataGrid.fitCanvasWidth();
					}
				}
			});

			this.dataGrid.render();

			this.relation = clutil.FieldRelation.create(this.cid, {
				clvendorcode: {
					el: this.$('#ca_maker'),
					behaviors: ['ErrorBehavior'],
					dependAttrs: {
						vendor_typeid: amdb_defs.MTTYPE_F_VENDOR_MAKER
					}
				},
				/*clcolorcode: {
					el: this.$('#ca_color'),
					behaviors: ['ErrorBehavior']
				},*/
				clcolorselector: {
					el: this.$('#ca_color'),
					behaviors: ['ErrorBehavior']
				},
				'node itemID': clutil.FieldRelation.Node.create({
					depends: ['maker_id', 'itemCode', 'itgrpID'],
					provide: 'itemID',
					itemID: 0,
					validator: clutil.validator(this.$('.makerCodeDiv'), {
						echoback: $('')
					}),
					setValue: function(id, options){
						this.itemID = id;
						console.log('==== setValue', id);
						this.triggerChange(options);
					},
					getValue: function(){
						console.log('==== getValue', this.itemID);
						return this.itemID;
					},
					onDependChange: function(attrs, options){
						console.log('==== itemID', attrs);
						var that = this;
						that.clearError();
						if(!attrs.maker_id ||
						   !attrs.itemCode ||
						   !attrs.itgrpID){
							this.itemID = 0;
							return;
						}
						clutil.clmakeritemcode2item({
							itgrp_id: attrs.itgrpID,
							maker_id: attrs.maker_id,
							maker_code: attrs.itemCode
						}).done(function(data){
							console.log('===== item', data);
							that.itemID = data.rec.itemID;
							if(!that.itemID){
								that.setError(data.head.message, data.head.args);
							}else{
								//clutil.setFocus(view.$('#ca_color'));
							}
						}).always(options.async());
					},
					setError: function(msg, args){
						this.validator.setErrorMsg(
							view.$('#ca_itemCode'), clmsg[msg]);
					},
					clearError: function(){
						this.validator.clear();
					}
				}),
				'text itemCode': {
					el: this.$('#ca_itemCode'),
					depends: ['maker_id', 'itgrpID'],
					provide: 'itemCode',
					behaviors: ['ErrorBehavior']
				},
				'node grid': clutil.FieldRelation.Node.create({
					depends: ['colorID', 'maker_id', 'itemID'],
					provide: 'grid',
					onDependChange: function(attrs){
						console.log('==== grid', attrs);
						var isValid = attrs.colorID && attrs.maker_id && attrs.itemID;

						if(!isValid){
							view.gridRender();
						}

						view.updateGridEditable(attrs);
					}
				})
			}, {
				dataSource: {
					unit_id: this.options.unitID,
					itgrpID: this.options.itgrpID
				}
			});

			this.relation.done(_.bind(function(){
				if(!this.isEditable()){
					clutil.viewReadonly(this.$el);
				}
			}, this));
			return this;
		},

		updateGridEditable: function(attrs){
			if(attrs){
				this._isGridEditable = attrs.colorID &&
					attrs.maker_id &&
					attrs.itemID;
			}
			this._isGridEditable = Boolean(this._isGridEditable && this.isEditable());
			if(this.dataGrid){
				this.dataGrid.setEnable(this._isGridEditable);
			}
		},

		/**
		 * データグリッドの描画
		 */
		gridRender: function(){

			if(!this.dataGrid){
				return;
			}

			var _myView = this;

			// graph.add
			this.graph = new clutil.Relation.DependGraph()
			.add({

				// 在庫数は出荷店舗が変わったときにサーバから取得する
				id: 'outStockQy',
				depends: ['outStore.id'],
				onDependChange: function(e){

					// 「出荷店舗」が変更された

					var model = e.model;

					var viewAttrs = _myView.relation.model.toJSON();

					// 品種IDを取得
					var itgrpID = _myView.options.itgrpID;
					// メーカーIDを取得
					var makerID = viewAttrs.maker_id;
					// 品番を取得
					var itemCode = viewAttrs.itemCode;
					// カラーIDを取得
					var colorID = viewAttrs.colorID;

					// 出荷店舗IDを取得
					var outStoreID = model.get('outStore.id');

					// 前のsizeRec
					var prevSizeRec = model.get('sizeRec');

					// 移動数量をクリアする
					var clearSize = function(){
						_.each(prevSizeRec, function(size) {
							model.unset('size_' + size.size_id);
						});

					};

					/*
					 * 在庫数、支持率、効率を空にする関数
					 */
					var setEmpty = function(outStockError){

						clearSize();

						model.set({

							outStockQy: outStockError ? 0 : '',
							outRate: outStockError ? 0 : '',
							outEfficiency: outStockError ? 0 : '',
							sizeRec: [],

							// 商品ID、ネームを空にする
							itemID: 0,
							itemName: '',

							// 出荷店舗を空にする
							outStoreID: 0,

							// 在庫数・支持率・効率の取得に失敗した場合
							// エラーメッセージを設定する(★)
							outStockError: outStockError
						});

						_myView.addSizeColumns([]);
					};

					if (!itgrpID || !makerID || !itemCode || !outStoreID){
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
					var promise = clutil.clmakeritemcode2item(obj)
							.then(function(data){

								console.log('clmakeritemcode2item', arguments);

								if(!data || !data.head || data.head.status !== 0){
									return $.Deferred().reject();
								}

								var req = {
									reqHead: {
									},
									cond: {
										item_id: data.rec.itemID,
										color_id: colorID,
										store_id: outStoreID
									}
								};

								// 商品ID、ネームを設定する。
								model.set({
									itemID: data.rec.itemID,
									itemName: data.rec.itemName
								});

								// 商品ID・出荷店舗IDから在庫数・支持率・効率を取得する
								return clutil.postJSON('am_pa_stock_rate', req);

							}).done(function(data){

								if (!data || !data.rspHead || data.rspHead.status !== 0){
									return $.Deferred().reject();
								}

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
								_myView.addSizeColumns(data.list[0].sizeRec);

							/*}).fail(setEmpty); // 失敗したときは空にする*/
							})
							.fail(function(data){
								var msg = clmsg[data.rspHead.message];
								// 失敗したときは空にする(★)
								setEmpty(msg);
							});


					// 非同期であることを知らせる。
					var done = e.async();
					// 非同期が完了したことを通知する
					promise.always(done);
				}
			})
			.add({

				// 在庫数は入荷店舗が変わったときにサーバから取得する
				id: 'inStockQy',
				depends: ['inStore.id'],
				onDependChange: function(e){
					// 「入荷店舗」が変更された

					var model = e.model;

					var viewAttrs = _myView.relation.model.toJSON();

					// 品種IDを取得
					var itgrpID = _myView.options.itgrpID;
					// メーカーIDを取得
					var makerID = viewAttrs.maker_id;
					// 品番を取得
					var itemCode = viewAttrs.itemCode;
					// カラーIDを取得
					var colorID = viewAttrs.colorID;

					// 入荷店舗IDを取得
					var inStoreID = model.get('inStore.id');

					/*
					 * 在庫数、支持率、効率を空にする関数
					 */
					var setEmpty = function(inStockError){

						model.set({

							inStockQy: inStockError ? 0 : '',
							inRate: inStockError ? 0 : '',
							inEfficiency: inStockError ? 0 : '',

							inStoreID: 0
						});
					};

					if (!itgrpID || !makerID || !itemCode || !inStoreID){
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
					var promise = clutil.clmakeritemcode2item(obj)
							.then(function(data){

								console.log('clmakeritemcode2item', arguments);

								if(!data || !data.head || data.head.status !== 0){
									return $.Deferred().reject();
								}

								var req = {
									reqHead: {
									},
									cond: {
										item_id: data.rec.itemID,
										color_id: colorID,
										store_id: inStoreID
									}
								};

								// 商品ID・入荷店舗IDから在庫数・支持率・効率を取得する
								return clutil.postJSON('am_pa_stock_rate', req);

							}).done(function(data){

								if (!data || !data.rspHead || data.rspHead.status !== 0){
									return $.Deferred().reject();
								}

								// am_pa_stock_rate の応答結果
								console.log('am_pa_stock_rate', data);

								// サーバから返ってきた値をセットします。
								model.set({
									inStockQy		: data.list[0].stock_qy,
									inRate			: data.list[0].loyalty_rt,
									inEfficiency	: data.list[0].efficiency
								});
							})
							//}).fail(setEmpty); // 失敗したときは空にする
							.fail(function(data){
								var msg = clmsg[data.rspHead.message];
									// 失敗したときは空にする(★)
								setEmpty(msg);
								}); // 失敗したときは空にする

					// 非同期であることを知らせる。
					var done = e.async();
					// 非同期が完了したことを通知する
					promise.always(done);
				}
			});

			/**
			 * データグリッド表示
			 */
			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1
				},
				//columns: clutil.dclone(columns),
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

			this.updateGridEditable();
		},

		setEnable: function(sw){

			this.options.editable = sw;

			//this.relation.done(_.bind(this, function(){
			this.relation.done(_.bind(function(){
				clutil.viewReadonly(this.$el, this.isEditable());
			}, this));

			this.updateGridEditable();
		},

		isEditable: function(){
			return this.options.editable && this.options.itgrpID &&
				this.options.unitID;
		},

		/**
		 * UI の設定値から、リクエストパケットを生成する。
		 */
		serialize: function(){

			// return {};

			return clutil.view2data(this.$el);

		},

		/**
		 * データグリッドの内容を取得
		 */
		getGridData: function() {

			return this.dataGrid.getData({
				delflag: false,
				tailEmptyCheckFunc: ClGrid.getEmptyCheckFunc(this.dataGrid)
			});
		},

		/**
		 * dto の内容を各部品に設定する
		 */
		deserialize: function(dto){
			this.relation
				.set('clvendorcode', {
					id: dto.makerID,
					code: dto.makerCode,
					name: dto.makerName
				})
				/*.set('clcolorcode', {
					id: dto.colorID,
					code: dto.colorCode,
					name: dto.colorName
				})*/
				.set('clcolorselector', dto.colorID)
				.set('itemID', dto.itemID)
				.set('itemCode', dto.itemCode)
				.reset({set: true});

			var that = this;
			this.relation.done(function(){
				that.deserializeGrid(dto);
			});
			return null;
		},

		deserializeGrid: function(dto){
			// データグリッドの内容を表示

			// 移動依頼サイズレコード
			var sizeRec = dto.sizeRec;

			if(_.isEmpty(sizeRec)) {

				var err_msg = "サイズ情報を取得できません";

				return err_msg;
			}

			// 移動依頼店舗レコード
			var storeRec = dto.storeRec;

			var data = [];

			for(var i=0; i < storeRec.length; i++) {

				// 出荷店舗
				var outStore = {
					id : storeRec[i].outStoreID,
					code : storeRec[i].outStoreCode,
					name : storeRec[i].outStoreName
				};

				// 入荷店舗
				var inStore = {
					id : storeRec[i].inStoreID,
					code : storeRec[i].inStoreCode,
					name : storeRec[i].inStoreName
				};

				data[i] = {
					outStore : outStore,
					outStockQy : storeRec[i].outStockQy,
					outRate : storeRec[i].outRate,
					outEfficiency : storeRec[i].outEfficiency,
					inStore : inStore,
					inStockQy : storeRec[i].inStockQy,
					inRate : storeRec[i].inRate,
					inEfficiency : storeRec[i].inEfficiency,
					sizeRec: _.map(sizeRec, function(item){
						return {
							size_id: item.sizeID,
							size_name: item.sizeName
						};
					})
				};

				/*var _myView = this;*/

				// サイズ列の表示
				var sizeQyRec = storeRec[i].sizeQyRec;

				for(var j=0; j < sizeQyRec.length; j++){
					var rec = sizeQyRec[j];
					data[i]['size_' + rec.sizeID] = rec.instructQy;
				}

				this.addSizeColumns(_.map(sizeRec, function(item){
					// addSizeColumns()の形式に合うように変換する
					return {
						size_id: item.sizeID,
						size_name: item.sizeName
					};
				}));

				// データグリッドに表示する
				this.dataGrid.setData({
					rowDelToggle: true,
					data: data
				});
				this.dataGrid.setColumns(this.getColumns());

				this.updateGridEditable();
			}
		},

		/**
		 *
		 */
		isValid: function(){
			// この ItemCodeInputView 単位で入力チェック？？？
			return true;
		},

		/**
		 * destroy関数
		 */
		destroy: function(){
			if(this.dataGrid){
				this.dataGrid.remove();
			}
			// !!!FieldRelationもリムーブしてください!!!
			this.relation.remove();
			this.remove();
		}
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({

		el: $('#ca_main'),

		validator : null,

		events: {
			'click #ca_AMTRV0010'	: '_onAMTRV0010Click',	// 移動依頼一覧(一括)(AMTRV0010)へ遷移
			'click #ca_AMTSV0050'	: '_onAMTSV0050Click',	// 移動依頼一覧(セットアップ)(AMTSV0050)へ遷移

			"clDatepickerOnSelect #ca_limitDate"	: "pickLimitDateBlur",	//移動日付からアラーム日付設定(デートピッカー)
			"change #ca_limitDate"	: "changeLimitDateBlur",	//移動日付からアラーム日付設定(手打ち)

			"click #ca_fileName" : "_onFileDLClick",		// 添付ファイル名をクリックしてダウンロード
			"click #ca_fileDel_btn" : "_onDelFileClick",	// 添付ファイル削除ボタンを押下

			'click #span_addItemCode': 'addItemCodeInputView',	// 品番を追加するボタン

			'click #ca_csv_itemCode': 'clickBtnItemCode',	// 移動後の品番別サイズバランスボタン
			'click #ca_csv_itemAttr': 'clickBtnItemAttr',	// 移動後の商品属性別サイズバランスボタン
			"click .cl_errWrnRowClick"	: "_onErrWrnClick",			// MT-1493 エラー・警告行クリック yamaguchi
		},

		itemCodeInputViews: [],

		mediatorEvents: {
			'itgrpID:change': function(itgrpID){
				console.log('==== itgrpID:change', itgrpID);
				if(!this.editable) {
					return;
				}
				_.each(this.itemCodeInputViews, function(view){
					view.destroy();
				});
				this.itemCodeInputViews = [];
				this.addItemCodeInputView();
			}
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
					title: '移動依頼作成（サイズアソート）',
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

				// 新規作成時、「移動後の品番別サイズバランスを見る」ボタンは操作不可とする
				this.$('#ca_csv_itemCode').prop('disabled', true);

				// 新規作成時、「移動後の商品属性別サイズバランスを見る」ボタンは操作不可とする
				this.$('#ca_csv_itemAttr').prop('disabled', true);

			}

			if(fixopt.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
			   fixopt.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
				this.editable = false;
			}else{
				this.editable = true;
			}

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
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

			//添付ファイルDL用
			this.fileURL = "";

			return this;

		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			// 事業ユニット
			this.busUnitSelectorView = clutil.clbusunitselector(this.$('#ca_unitID'));

			this.relation = clutil.FieldRelation.create("default", {
				// 事業ユニット取得
				clbusunitselector: {
					el: "#ca_unitID",
					behaviors: ['ErrorBehavior']
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_itgrpID",
					behaviors: ['ErrorBehavior']
				}
			});

			var relation = this.relation;
			this.listenTo(this.relation,{
				'reset': function(attrs, options){
					if(options.resetBy === 'ui'){
						clutil.mediator.trigger('itgrpID:change', attrs.itgrp_id);
					}
				}
			});

			this.listenTo(clutil.mediator, this.mediatorEvents);

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
			var dataGrid = this.itemCodeInputViews[$(args.currentTarget).data('grid') - 1].dataGrid;
			dataGrid.grid.scrollRowIntoView($(args.currentTarget).data('rownum'),1);
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
		 * 画面描画
		 */
		render: function(){

			this.mdBaseView.render();

			// 初期データ
			var iniData = {
				unitID: clcom.userInfo.unit_id
			};

			this.$itemStore_container = this.$('#ca_itemStore_container');

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {

				// 情シスでログイン
				if(clcom.userInfo.unit_id === amcm_type.AMCM_VAL_USER_STAFF_SYS) {
					clutil.setFocus(this.$("#ca_unitID"));
				}else {
					// 情シス以外の本部ユーザでログイン
					clutil.setFocus(this.$("#ca_itgrpID"));
				}

				// 品番Inputユニットを一つ表示する
				this.addItemCodeInputView();

			} else {

				this.mdBaseView.fetch();	// データを GET してくる。

			}

			return this;
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){

			var flag = true;
			var dgflag = true;

			// データグリッド以外の項目の未入力エラー確認
			if(!this.validator.valid()){
				flag = false;
			}

			// ===== 日付大小エラーチェック ===============================
			var data = clutil.view2data($("#ca_srchArea"));
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

			// 移動依頼対象Viewリストのループ
			for(var i = 0; i < this.itemCodeInputViews.length; i++) {

				var itemCodeInputView = this.itemCodeInputViews[i];

				if(_.isEmpty(itemCodeInputView.dataGrid.getData({
					filterFunc: ClGrid.getEmptyCheckFunc(itemCodeInputView.dataGrid)
				}))){
					if(flag === false) {
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

					} else {
						// データグリッドに何も入力されていない場合はエラー
						var msg = clutil.fmt(clutil.getclmsg('cl_its_required'),'出荷店舗、入荷店舗、サイズ別移動数');
						clutil.mediator.trigger('onTicker', msg);
						dgflag = false;
					}
				}

				/*if(!itemCodeInputView.dataGrid.isValid({
					tailEmptyCheckFunc: ClGrid.getEmptyCheckFunc(itemCodeInputView.dataGrid)
				})){
					clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
					dgflag = false;
				}*/

				if(itemCodeInputView.dataGrid.isValid({

					tailEmptyCheckFunc: ClGrid.getEmptyCheckFunc(itemCodeInputView.dataGrid),

					filter: function(item){

						return Boolean(item.isDeleted);

					}}) === false) {

						// 入力項目の最大桁数オーバー、入力必須項目が未入力の場合は
						// エラーとし、returnする
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

						dgflag = false;
				}
			}

			if(dgflag === false) {
				flag = false;
			}

			return flag;
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId){

			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + ']');

			// エラーチェック
			if(this.isValid() == false){

				// MT-1493 エラー・警告行表示 yamaguchi
				var mItemCode = [];

				$('.ca_makerItemCode').each(function(){
					var val = $(this).val();
					mItemCode.push({
						val: val
					});
				});

				var row_error = [];
				var colorName = [];
				for (var i = 0; i < this.itemCodeInputViews.length; i++) {

					var mkItemCodeColDto = this.itemCodeInputViews[i].serialize();
					$('._clcombobox').each(function(){
						if ($(this).attr('id') == 'ca_color') {
						    var obj = $(this).children();
						    for( var i=0; i<obj.length; i++ ){
						        if( obj.eq(i).val() == mkItemCodeColDto.color ) {
						        	colorName.push({
						        		color: obj.eq(i).text()
						        	});
						        	return false;
						        }
						    }
						}
					});


					var metadatas = this.itemCodeInputViews[i].dataGrid.metadatas.body;
					var gridData = this.itemCodeInputViews[i].dataGrid.getData();
					var num = 0;
					$.each(gridData, function(){
						this.rowIndex = num;
						num++;
					});

					var hasErrorRow = ClGrid.getErrorRow(metadatas, gridData, 0);
					for (var k = 0; k < hasErrorRow.length; k++) {
						console.log(hasErrorRow);
					}

					if (mkItemCodeColDto._view2data_maker_cn && hasErrorRow.length > 0) {
						row_error.push({
							grid: hasErrorRow,
							maker: mkItemCodeColDto._view2data_maker_cn.code + mkItemCodeColDto._view2data_maker_cn.name,
							itemCode : mItemCode[i].val,
							color: colorName[i].color,
						});
					}
				}

				// MT-1493 エラー・警告行表示 yamaguchi
				if (!_.isEmpty(row_error)){
					ClGrid.showError2(row_error);
				}

				return;
			}

			var statFlag = true;

			// 事業ユニット・品種・指示番号・指示名称を取得
			var instructInfo = clutil.view2data(this.$('#ca_instructArea'));

			// 事業ユニットID・コード・名称を取得
			var unitInfo = this.busUnitSelectorView.getAttrs();

			// 移動依頼指示レコード作成
			var recTempInstruct = {

				// 依頼名称
				instructName : instructInfo.instructName,
				// 事業ユニットID
				unitID : unitInfo.id,
				// 事業ユニットコード
				unitCode : unitInfo.code,
				// 事業ユニット名称
				unitName : unitInfo.name,
				// 品種ID
				itgrpID : instructInfo._view2data_itgrpID_cn.id,
				// 品種コード
				itgrpCode : instructInfo._view2data_itgrpID_cn.code,
				// 品種名称
				itgrpName : instructInfo._view2data_itgrpID_cn.name,
				// 店舗出力日
				releaseDate : instructInfo.releaseDate,
				// 移動出荷期限
				limitDate : instructInfo.limitDate,
				// アラーム表示期限
				alarmDate : instructInfo.alarmDate,
				// 移動理由
				reason : instructInfo.reason,
				// 店舗通知事項
				comment : instructInfo.comment,
				// 添付ファイルID
				fileID : Number(instructInfo.fileID)

			};

			if(this.saveData) {

				// 編集・削除の場合
				recTempInstruct.instructID = this.saveData.recTempInstruct.instructID;

				recTempInstruct.instructNo = instructInfo.instructNo;

				recTempInstruct.unitID = this.saveData.recTempInstruct.unitID;
				recTempInstruct.unitCode = this.saveData.recTempInstruct.unitCode;
				recTempInstruct.unitName = this.saveData.recTempInstruct.unitName;

			} else {

				// 新規作成の場合
				recTempInstruct.instructNo = "1";
			}

			// 仮移動指示明細レコードリスト
			var recTempItem = [];

			// 同一カラー商品重複チェック用連想配列
			var chkDupItemCol = {};

			// 移動依頼対象Viewリストのループ
			for(var i = 0; i < this.itemCodeInputViews.length; i++) {

				var itemCodeInputView = this.itemCodeInputViews[i];

				// Get応答結果の仮移動指示明細リストの要素
				if(this.saveData) {

					var _saveRecTempItem = this.saveData.recTempItem[i];

				}

				// 移動依頼対象Viewのメーカー・品番・カラーを取得する
				var mkItemCodeColDto = itemCodeInputView.serialize();

				// 仮移動指示明細レコードリストの各要素
				var tempItem = {

					// メーカーID
					makerID :mkItemCodeColDto._view2data_maker_cn.id,
					// メーカーコード
					makerCode :mkItemCodeColDto._view2data_maker_cn.code,
					// メーカー名称
					makerName :mkItemCodeColDto._view2data_maker_cn.name,
					// 品番
					itemCode :mkItemCodeColDto.itemCode,
					// カラーID
					// colorID :mkItemCodeColDto._view2data_color_cn.id
					colorID :Number(mkItemCodeColDto.color)

				};

				var key = String(tempItem.makerID) + ':' + String(tempItem.itemCode) + ':' +  String(tempItem.colorID);

				var ret = chkDupItemCol[key];

				if(!ret){
					// 初出
					// メーカーID・品番・カラーIDをキーとして連想配列にセット
					chkDupItemCol[key] = itemCodeInputView;
				}else {
					var setDupError = function(view, validator){
						// 同じカラーの商品が既に存在するのでエラー
						var msg = clutil.getclmsg('ETS0002');
						validator.setErrorMsg(view.$("#ca_maker"), msg);
						validator.setErrorMsg(view.$("#ca_itemCode"), msg);
						validator.setErrorMsg(view.$("#ca_color"), msg);
					};

					// 重複
					if(_.has(ret, 'cid')){
						// 重複1回目 - 初出 view にメッセージをセットする。
						setDupError(ret, this.validator);
						chkDupItemCol[key] = 1;
					}else{
						// 重複2回目以降
					}
					setDupError(itemCodeInputView, this.validator);
				}

				// 移動依頼対象Viewの移動依頼店舗情報(データグリッド)を取得する
				var storeRecList =itemCodeInputView.getGridData();

				// 移動依頼店舗レコード
				var storeRec = [];

				// 移動依頼サイズレコード
				var sizeRec = [];

				if(!_.isEmpty(storeRecList)) {

					// 仮移動指示明細レコード数のカウンタをリセット
					var j = 0;

					// 同一行チェック用連想配列
					var chkDupLine = {};

					// 移動依頼指示商品のループ
					//_.each(itemCodeInputView.getGridData(), function(data){
					_.each(storeRecList, function(data){

						// 行のID
						var rowId = data[itemCodeInputView.dataGrid.idProperty];

						if(!(data.outStore) || !(data.inStore)) {
							return true;
						}

						if((data.outStore.id === 0) || (data.inStore.id === 0)) {
							return true;
						}

						// 商品IDをセット
						if(data.itemID) {

							tempItem.itemID = data.itemID;

						} else {

							tempItem.itemID = _saveRecTempItem.itemID;
						}

						// 商品名をセット
						if(data.itemName) {

							tempItem.itemName = data.itemName;

						} else {

							tempItem.itemName = _saveRecTempItem.itemName;
						}

						// 移動依頼サイズレコード
						var sizeRec = [];

						// 移動依頼サイズ別数量レコード
						var sizeQyRec = [];

						if(data.outStore.id === data.inStore.id) {

							// 出荷店舗と入荷店舗が同じ場合はエラー
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

							var msg = clutil.getclmsg('ETS0001');
							itemCodeInputView.dataGrid.setCellMessage(rowId, 'outStore', 'error', msg);
							itemCodeInputView.dataGrid.setCellMessage(rowId, 'inStore', 'error', msg);

							statFlag = false;
						}

						var key = String(data.outStore.id + ':' + data.inStore.id);

						var ret = chkDupLine[key];

						if(ret === 1) {

							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

							// 同じ行が既に存在するのでエラー
							var msg = clutil.getclmsg('EMS0052');
							itemCodeInputView.dataGrid.setCellMessage(rowId, 'outStore', 'error', msg);
							itemCodeInputView.dataGrid.setCellMessage(rowId, 'inStore', 'error', msg);

							statFlag = false;

						} else {
							// 商品IDをキー、カラーIDを値として連想配列にセット
							chkDupLine[key] = 1;
						}

						// 移動依頼店舗レコード
						var tempStore = {

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

						if(!_.isEmpty(data.sizeRec)) {

							// サイズ別移動数量の入力フラグ
							var allEmptyFlag = true;

							// 移動依頼サイズレコードのループ
							for(var k = 0; k < data.sizeRec.length; k++) {

								var size_id = data.sizeRec[k].size_id;

								// 移動依頼サイズレコードの要素
								var tempSizeRec = {
									sizeID : size_id,
									sizeName : data.sizeRec[k].size_name
								};

								sizeRec.push(tempSizeRec);

								var stock_qy = 0;

								if(data.sizeRec[k].stock_qy) {

									stock_qy = data.sizeRec[k].stock_qy;

								} else {

									stock_qy = _saveRecTempItem.storeRec[j].sizeQyRec[k].stockQy;
								}


								var instructQy = data['size_' + size_id];

								if(instructQy && instructQy !== "0") {
									allEmptyFlag = false;
								}

								// サイズ別移動数量に何も入力されていない
								/*if(!instructQy) {
									clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
									var colName = 'size_' + size_id;
									itemCodeInputView.dataGrid.setCellMessage(rowId, colName, 'error', clutil.getclmsg('cl_required'));

									statFlag = false;
								}*/

								// サイズ別数量レコードの要素
								var tempSizeQyRec = {
									sizeID : data.sizeRec[k].size_id,
									stockQy : stock_qy,
									instructQy: data['size_' + size_id]
								};

								if(tempSizeQyRec.stockQy < tempSizeQyRec.instructQy) {

									clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

									var msg = clutil.getclmsg('ETS0003');
									var colName = 'size_' + size_id;
									itemCodeInputView.dataGrid.setCellMessage(rowId, colName, 'error', msg);

									statFlag = false;
								}

								sizeQyRec.push(tempSizeQyRec);

							}// 移動依頼サイズレコードのループ終了

							if(allEmptyFlag === true) {

								// サイズ別移動数量がすべて空またはゼロ
								clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

								for(var i=0; i < sizeQyRec.length; i++) {

									var colName = 'size_' + sizeQyRec[i].sizeID;

									itemCodeInputView.dataGrid.setCellMessage(rowId, colName, 'error', 'サイズ別移動数量のうち最低１件は１以上の値を入力してください。');
								}

								statFlag = false;
							}
						}

						tempStore.sizeQyRec = sizeQyRec;

						// 移動依頼商品レコードにシークエンス番号をセットする
						tempStore.seq = j;

						storeRec.push(tempStore);

						// 移動依頼サイズレコードを仮移動指示明細の要素にセットする
						tempItem.sizeRec = sizeRec;

						j = j + 1;

					},this);
				};

				// 移動依頼店舗レコードを仮移動指示明細の要素にセットする
				tempItem.storeRec = storeRec;

				// 移動依頼指示商品レコードにシーケンス番号をセットする
				tempItem.seq = i;

				recTempItem.push(tempItem);

			} // 移動依頼対象Viewリストのループ終了

			if(statFlag === false) {

				var mItemCode = [];
				// MT-1493 エラー・警告行表示 yamaguchi
				$('.ca_makerItemCode').each(function(){
					var val = $(this).val();
					mItemCode.push({
						val: val
					});
				});

				var row_error = [];
				var colorName = [];
				for (var i = 0; i < this.itemCodeInputViews.length; i++) {

					//
					var mkItemCodeColDto = this.itemCodeInputViews[i].serialize();
					$('._clcombobox').each(function(){
						if ($(this).attr('id') == 'ca_color') {
						    var obj = $(this).children();
						    for( var i=0; i<obj.length; i++ ){
						        if( obj.eq(i).val() == mkItemCodeColDto.color ) {
						        	colorName.push({
						        		color: obj.eq(i).text()
						        	});
						        	return false;
						        }
						    }
						}
					});


					var metadatas = this.itemCodeInputViews[i].dataGrid.metadatas.body;
					var gridData = this.itemCodeInputViews[i].dataGrid.getData();
					var num = 0;
					$.each(gridData, function(){
						this.rowIndex = num;
						num++;
					});

					var hasErrorRow = ClGrid.getErrorRow(metadatas, gridData, 0);
					for (var k = 0; k < hasErrorRow.length; k++) {
						console.log(hasErrorRow);
					}

					if (mkItemCodeColDto._view2data_maker_cn && hasErrorRow.length > 0) {
						row_error.push({
							grid: hasErrorRow,
							maker: mkItemCodeColDto._view2data_maker_cn.code + mkItemCodeColDto._view2data_maker_cn.name,
							itemCode : mItemCode[i].val,
							color: colorName[i].color,
						});
					}
				}

				if (!_.isEmpty(row_error)){
					ClGrid.showError2(row_error);
				}

				return;
			}

			var updReq = {
				recTempInstruct : recTempInstruct,
				recTempItem : recTempItem
			};

			var reqHead = {
				opeTypeId : opeTypeId
			};

			var reqObj = {
				reqHead : reqHead,
				AMTSV0030UpdReq  : updReq
			};

			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		/**
		 * 移動依頼対象グリッド群をリードオンリーにする
		 */
		_itemCodeInputViewReadonly: function(){
			_.each(this.itemCodeInputViews, function(view){

				view.setEnable(false);
			});
		},

		/**
		 * XXX: Submit 応答のイベントを受ける
		 */
		_onMDSubmitCompleted: function(args, e){

			switch(args.status){

			case 'DONE':		// 確定済

				// テーブル以外の画面項目を操作不可にする
				clutil.viewReadonly(this.$("#ca_srchArea"));

				// データグリッド領域を操作不可にする
				this._itemCodeInputViewReadonly();

				// 品番削除ボタンを非表示にする
				$('.delFieldUnits').hide();

				// 「＋品番を追加する」ボタンを非表示にする
				$("#ca_itemCodeBtn").addClass('dispn');

				if(!this.srchID) {
					// 新規に払い出した移動依頼IDをセットする
					this.srchID = args.data.AMTSV0030GetRsp.recTempInstruct.instructID;
				}

				// 「移動後の品番別サイズバランスを見る」ボタンは操作可とする
				this.$('#ca_csv_itemCode').prop('disabled', false);

				// 「移動後の商品属性別サイズバランスを見る」ボタンは操作可とする
				this.$('#ca_csv_itemAttr').prop('disabled', false);

				break;

			case 'CONFLICT':	// 別のユーザによって DB が更新された

				// テーブル以外の画面項目を操作不可にする
				clutil.viewReadonly(this.$("#ca_srchArea"));

				// データグリッド領域を操作不可にする
				this._itemCodeInputViewReadonly();

				// 品番削除ボタンを非表示にする
				$('.delFieldUnits').hide();

				// 「＋品番を追加する」ボタンを非表示にする
				$("#ca_itemCodeBtn").addClass('dispn');

				break;

			case 'DELETED':		// 別のユーザによって削除された

				// テーブル以外の画面項目を操作不可にする
				clutil.viewReadonly(this.$("#ca_srchArea"));

				// データグリッド領域を操作不可にする
				this._itemCodeInputViewReadonly();

				// 品番削除ボタンを非表示にする
				$('.delFieldUnits').hide();

				// 「＋品番を追加する」ボタンを非表示にする
				$("#ca_itemCodeBtn").addClass('dispn');

				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。

				// もう一回チャレンジできるようになにもしない!!!

				break;
			}
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
				AMTSV0030GetReq: {
					srchID: chkData.id,		// 指示ID
					opeType: 0				// 操作種別は0にしておく
				},

				// 移動依頼（セットアップ）更新リクエスト -- 今は検索するので、空を設定
				AMTSV0030UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMTSV0030',
				data: getReq
			};

		},

		/**
		 * XXX: GET 応答のイベントを受ける
		 */
		_onMDGetCompleted: function(args, e){

			console.log('args.status: [' + args.status + ']');

			this.clean();

			switch(args.status){

			case 'OK':

				// 移動依頼作成情報を表示する
				var err_msg = this.data2view(args.data, this.options.opeTypeId);

				if(err_msg !== null) {
					this.validator.setErrorHeader(err_msg);
					break;
				}

				// 編集可の状態にする。
				clutil.viewRemoveReadonly($("#ca_srchArea"));

				// 依頼番号は操作不可とする
				clutil.inputReadonly($("#ca_instructNo"));

				// 情シスでログイン
				if(clcom.userInfo.unit_id === amcm_type.AMCM_VAL_USER_STAFF_SYS) {
					clutil.setFocus(this.$("#ca_unitID"));
				}else {
					// 情シス以外の本部ユーザでログイン
					clutil.inputReadonly($("#ca_unitID"));
					clutil.setFocus(this.$("#ca_itgrpID"));
				}

				switch (this.options.opeTypeId) {

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:

					// 照会モード・削除モードは、Edit ブロッキングしておく。
					clutil.viewReadonly(this.$("#ca_srchArea"));
					break;

				}

				break;

			case 'DONE':		// 確定済

				// 移動依頼作成情報を表示する
				var err_msg = this.data2view(args.data, this.options.opeTypeId);

				if(err_msg !== null) {
					this.validator.setErrorHeader(err_msg);
					break;
				}

				_.defer(_.bind(function(){

					// テーブル以外の画面項目を操作不可にする
					clutil.viewReadonly(this.$("#ca_srchArea"));

					// データグリッド領域を操作不可にする
					this._itemCodeInputViewReadonly();

					// 品番削除ボタンを非表示にする
					$('.delFieldUnits').hide();

					// 「＋品番を追加する」ボタンを非表示にする
					$("#ca_itemCodeBtn").addClass('dispn');

				}, this));

				// MT-1493 エラー・警告行表示
				var row_alert = [];
				var row_error = [];
				ClGrid.showAlert(row_alert);
				ClGrid.showError(row_error);

				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み

				_.defer(_.bind(function(){

					// テーブル以外の画面項目を操作不可にする
					clutil.viewReadonly(this.$("#ca_srchArea"));

					// データグリッド領域を操作不可にする
					this._itemCodeInputViewReadonly();

					// 品番削除ボタンを非表示にする
					$('.delFieldUnits').hide();

					// 「＋品番を追加する」ボタンを非表示にする
					$("#ca_itemCodeBtn").addClass('dispn');

				}, this));

				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース

				// 移動依頼作成情報を表示する
				var err_msg = this.data2view(args.data, this.options.opeTypeId);

				if(err_msg !== null) {
					this.validator.setErrorHeader(err_msg);
					break;
				}

				_.defer(_.bind(function(){

					// テーブル以外の画面項目を操作不可にする
					clutil.viewReadonly(this.$("#ca_srchArea"));

					// データグリッド領域を操作不可にする
					this._itemCodeInputViewReadonly();

					// 品番削除ボタンを非表示にする
					$('.delFieldUnits').hide();

					// 「＋品番を追加する」ボタンを非表示にする
					$("#ca_itemCodeBtn").addClass('dispn');

				}, this));

				break;

			default:
			case 'NG':			// その他エラー。

				_.defer(_.bind(function(){

					// テーブル以外の画面項目を操作不可にする
					clutil.viewReadonly(this.$("#ca_srchArea"));

					// データグリッド領域を操作不可にする
					this._itemCodeInputViewReadonly();

					// 品番削除ボタンを非表示にする
					$('.delFieldUnits').hide();

					// 「＋品番を追加する」ボタンを非表示にする
					$("#ca_itemCodeBtn").addClass('dispn');

				}, this));

				break;

			};
		},

		/**
		 * 検索結果を画面に表示する
		 */
		data2view: function(data, opeType){

			var _this = this;

			this.saveData = data.AMTSV0030GetRsp;

			// 移動依頼指示レコードを取得
			var recTempInstruct = data.AMTSV0030GetRsp.recTempInstruct;

			// 移動依頼指示商品レコードを取得
			var recTempItem = data.AMTSV0030GetRsp.recTempItem;

			// 移動指示情報を画面に表示
			var viewData = _.extend({}, recTempInstruct, {
				itgrpID: {
					id: recTempInstruct.itgrpID,
					code: recTempInstruct.itgrpCode,
					name: recTempInstruct.itgrpName
				}
			});

			clutil.data2view(_this.$('#ca_instructArea'), viewData);

			//添付ファイル作成
			if(recTempInstruct.fileName != ""){
				var line = '<a id="ca_fileName" class="cl_filedownld" target="_blank">' + recTempInstruct.fileName + '</a>';
				$("#ca_label").html(line);
				this.fileURL = recTempInstruct.fileURL;
			}

			this.relation.done(_.bind(function(){
				// 移動依頼対象データグリッド内容を表示する
				for(var i=0; i < recTempItem.length; i++) {

					// 移動依頼対象Input領域を追加
					this.addItemCodeInputView(opeType);

					var err_msg = this.itemCodeInputViews[i].deserialize(recTempItem[i]);
					if(err_msg !== null) {

						return err_msg;
					}

				}
			}, this));
			return null;
		},

		/**
		 * 移動依頼対象Input領域を追加
		 */
		addItemCodeInputView: function() {
			var instDto = getInstructDto();
			var opeType = this.options.opeTypeId;
			if(opeType === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					opeType === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {

				// 削除または参照時は角の[×]ボタン無用
				var itemCodeInputView = new ItemCodeInputView({
					btn_del: false,
					editable: false,
					itgrpID: instDto.itgrpID,
					unitID: instDto.unitID
				}).initUIElement().render();

			} else {

				// 新規作成または編集時は「＋品番を追加する」ボタンを表示する
				$("#ca_itemCodeBtn").removeClass('dispn');

				// 新規追加分の品番Inputユニットで一番最初のものは、角の［×］ボタン無用。
				var hasCornerDelBtn = !(_.isEmpty(this.itemCodeInputViews));

				var itemCodeInputView = new ItemCodeInputView({
					btn_del: hasCornerDelBtn,
					editable: true,
					itgrpID: instDto.itgrpID,
					unitID: instDto.unitID
				}).initUIElement().render();
			}

			// 品番のフィールドカウント
			clutil.cltxtFieldLimit(itemCodeInputView.$("#ca_itemCode"));

			// 品番Inputユニットの［×］ボタンイベントを購読。
			this.listenTo(itemCodeInputView, 'ItemCodeInputView:destroy', this.removeItemCodeInputView);

			this.itemCodeInputViews.push(itemCodeInputView);

			this.$itemStore_container.append(itemCodeInputView.$el);
			itemCodeInputView.gridRender();
		},

		/**
		 * 移動依頼対象Input領域をを削除
		 * @param {ItemCodeInputView} view 移動依頼対象Input部品インスタンス
		 */
		removeItemCodeInputView: function(view){
			var idx = this.itemCodeInputViews.indexOf(view);
			if(idx < 0){
				return;
			}
			this.itemCodeInputViews.splice(idx, 1);
			view.destroy();
		},

		/**
		 * 移動後の品番別サイズバランスボタン押下
		 */
		clickBtnItemCode: function() {

			// CSV出力 opeType=1
			this.doCSVDownload(1);
		},

		/**
		 * 移動後の商品属性別サイズバランスボタン押下
		 */
		clickBtnItemAttr: function() {

			// CSV出力 opeType=2
			this.doCSVDownload(2);

		},

		/**
		 * CSVダウンロード
		 */
		doCSVDownload: function(opeType){

			// リクエストをつくる
			if(this.srchID) {

				var srchID = this.srchID;

				var srchReq = {

					// 共通ヘッダ
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
					},

					AMTSV0030GetReq: {
						srchID : srchID,		// 指示ID
						opeType : opeType		// 操作種別
					}
				};

				if(_.isNull(srchReq)){
					return;
				}

				// 要求を送出
				// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
				var defer = clutil.postDLJSON('AMTSV0030', srchReq);
				defer.fail(_.bind(function(data){
					// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
					// AJAX 呼び出しの共通処理で済ませるべきか・・・
					clutil.mediator.trigger('onTicker', data);
				}, this));
			}
		},

		/**
		 * 移動依頼対象Input領域の配列をクリア
		 */
		clean: function(){
			if(!_.isEmpty(this.itemCodeInputViews)){
				for(var i = 0; i < this.itemCodeInputViews.length; i++){
					var view = this.itemCodeInputViews[i];
					view.destroy();
				}
				this.itemCodeInputViews.length = 0;
			}
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

		_eof: 'AMTSV0030.MainView//'
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

		mainView = new MainView(clcom.pageArgs);
		mainView.initUIElement().render();

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
