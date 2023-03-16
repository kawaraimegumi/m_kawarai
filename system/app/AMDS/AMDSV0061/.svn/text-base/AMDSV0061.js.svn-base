// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate){
		return _.template(rawTemplate, null, {variable: 'it'});
	};

	var myHdrFormatter = function(value, options){
//		console.log(options);
		var label = '&nbsp;';
		if (options.cell === 7){
			label = 'サイズ';
		}else if(options.grid.getColumns().length - 2 === options.cell){
			label = '<div class="viewAll">すべて表示</div>';
		}
		var template = Marionette.TemplateCache.get('#HdrCell');

		return template({
			label: label,
			value: value
		});
	};
	myHdrFormatter.initialize = function(grid, dataView, vent){
		grid.onClick.subscribe(function(e, args){
			var $target = $(e.target);
			var ev;
			if($target.is(".deleteRow .viewAll")){
				if(args.grid.getColumns().length > 9){
					ev = ClGrid.Formatters.buildEvent(args, grid, dataView);
					vent.trigger("formatter:hideSize:click", ev);
				} else {
					// これ以上短くしない
				};
			} else if ($target.is(".viewAll")){
				ev = ClGrid.Formatters.buildEvent(args, grid, dataView);
				vent.trigger("formatter:showAll:click", ev);
			}
		});
	};

	ClGrid.Formatters.myHdrFormatter = myHdrFormatter;

	var SizeEditor = Marionette.ItemView.extend({
		template: '#SizeEditor',

		events: {
			click: function(e){
				e.stopPropagation();
			}
		},

		constructor: function(args, editorOptions, cellType){
			this.args = args;
			this.cellType = cellType;
			Marionette.ItemView.prototype.constructor.call(this, editorOptions);
		},

		initialize: function(){
			this.render();
			this.$el.appendTo(this.args.container);
			this.focus();
		},

		focus: function(){
			var $el = this.$('[type=text]');
			$el.focus();
			_.defer(function(){
				$el.select();
			});
		},

		serializeData: function(){
			return _.clone(this.args.item[this.args.column.field]);
		},

		templateHelpers: function(){
			return {
				editMode: true
			};
		},

		loadValue: function(item){
			this.$('input').val(item[this.args.column.field].baseStockQy);
		},

		applyValue: function(item, state){
//			item[this.args.column.field].baseStockQy = parseInt(state, 10) || 0;
			item[this.args.column.field].baseStockQy = state;
		},

		serializeValue: function(){
			return this.$('input').val();
		},

		isValueChanged: function(){
			return true;
		},

		destroy: function(){
			this.remove();
		},

		validate: function(){
			this.trigger('validate', this.serializeValue());

			return {
				valid: true,
				msg: null
			};
		}
	});

	var sizeFormatter = function(value, options){
		// jshint unused: false
		var template = Marionette.TemplateCache.get('#SizeEditor'),
			data = options.dataContext[options.columnDef.id] || {};
		return template(data);
	};

	var totalColFormatter = function(value, options){
		// jshint unused: false
		var template = Marionette.TemplateCache.get('#TotalColFormatter'),
			data = options.dataContext[options.columnDef.id] || {};
		return template(data);
	};

	var baseStockQyFormatter = function(data){
		// jshint unused: false
		var template = Marionette.TemplateCache.get('#BaseStockQyFormatter');
		return template(data);
	};

	var StoreFilterView = Marionette.ItemView.extend({
		template: '#StoreFilterView',

		className: 'clgrid-editor-select',

		ui: {
			parent: '.parentSelect',
			child: '.childSelect'
		},

		onRender: function(){
			var parentItems = _.where(ca_editView.dispData.storeInfoRecords, {
				parentTypeID: 0
			});
			this.parent = new ClGrid.Editors.ClSelector.createSelector({
				labelTemplate: function(item){return item.typeName;},
				idAttribute: 'typeID',
				items: parentItems
			});

			this.child = new ClGrid.Editors.ClSelector.createSelector({
				itemTemplate: function(item){return item.typeName;},
				idAttribute: 'typeID'
			});

			this.ui.parent.html(this.parent.el);
			this.ui.child.html(this.child.el);

			this.listenTo(this.child, 'change:ui', this.triggerChange);
			this.listenTo(this.parent, 'change:ui', this.updateChild);
		},

		getChildItems: function(){
			if (!this.parentID) return;

			var childItems = _.where(ca_editView.dispData.storeInfoRecords, {
				parentTypeID: this.parentID
			});
			return childItems;
		},

		triggerChange: function(){
			this.trigger('change');
			console.log('XXXXXXXXXXXXXXX');
		},

		updateChild: function(trigger){
			var items, parentID = parseInt(this.parent.getValue(), 10);

			if (parentID){
				items = _.where(ca_editView.dispData.storeInfoRecords, {
					parentTypeID: parentID
				});
			}
			this.child.setItems(items);
			if (trigger !== false){
				this.triggerChange();
			}
		},

		templateHelpers: function(){
			return {
				editMode: true
			};
		}
	});

	var StoreFilterEditor = function(args, editorOptions){
		this.args = args;
		this.options = editorOptions;
		var view = this.view = new StoreFilterView();
		view.render();
		view.$el.appendTo(args.container);
		ClGrid.fixSelector(view.$el, args.grid);
		this.listenTo(this.view, 'change', function(){
			this.args.commitChanges();
		});
	};

	_.extend(StoreFilterEditor.prototype, Backbone.Events, {
		////////////////////////////////////////////////////////////////
		// Editor Interfaces
		loadValue: function(item){
			this.view.parent.setValue(item.parentID);
			this.view.updateChild(false);
			this.view.child.setValue(item.childID);
		},

		applyValue: function(item){
			item.parentID = parseInt(this.view.parent.getValue(),10)||0;
			item.parent = this.view.parent.getAttrs();
			item.childID = parseInt(this.view.child.getValue(), 10) || 0;
			item.child = this.view.child.getAttrs();
		},

		serializeValue: function(){},

		isValueChanged: function(){
			return true;
		},

		destroy: function(){
			this.stopListening();
			this.view.remove();
		},

		validate: function(){
			return {
				valid: true,
				msg: null
			};
		}
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		validator : null,

		events: {
//			'change #ca_unitID'				:	'_onUnitChanged',		// 事業ユニットが変更された
//			'click #ca_btn_store_select'	:	'_onStoreSelClick',		// 店舗選択
			'click #ca_link_itemcode'		:	'_onLinkItemcodeClick',	// 品番別振分リンク押下時
			'change #ca_sizePtnID'			:	'_onSizePtnChanged',	// サイズパターンが変更された
			'change #ca_bodyShapeID'		:	'_onBodyShapeChanged',	// 体型が変更された
			"click .cl_errWrnRowClick"	: "_onErrWrnClick",			// エラー・警告行クリック　2016.06.14山口 追加　エラー行にスクロールできるようにする対応
		},

		newBaseStockID: -1,

		// grid発のイベント
		gridEvents: {
			// cell 内容変更
			"cell:change" : function(args){
				if (args.cell === 1){
					console.log('*** cell:change', args);
					this.dataGrid.isValidCell(args.item, 'makerItgrpCode');
					return;
				} else if(args.item.isItemRow && args.cell >= 6){
//					console.log(args);
					var dataGrid = args.dataGrid;
					dataGrid.dataView.beginUpdate();

					var item = args.item;
					var rowTotalQy = 0;
					for (var i = 0; i < this.dispData.sizeNum; i++){
//						rowTotalQy += item["colIndex_" + i + "_field"].baseStockQy; // 対象行合計
						rowTotalQy += this.myNumber(item["colIndex_" + i + "_field"].baseStockQy); // 対象行合計
					}
					var data = dataGrid.getData();
					var field = args.column.field;
					var changedRowIndex = args.item.rowIndex;
					var columnTotalQy = 0;
					var totalRow = {};
					$.each(data, function(){
						if(this.rowIndex == changedRowIndex){
							this.rowTotal.baseStockQy = rowTotalQy;	// 行合計を反映
							dataGrid.dataView.updateItem(this);
						}
						if(this.isItemRow){
//							columnTotalQy += this[field].baseStockQy;	// 列合計
							columnTotalQy += mainView.myNumber(this[field].baseStockQy); // 列合計
							return true;
						}
						if(this.totalRow){
							totalRow = this;						// 合計表示行を把握
						}
					});
					totalRow[field].baseStockQy = columnTotalQy;
					// 総合計
					var allQy = 0;
					for (i = 0; i < this.dispData.sizeNum; i++){
//						allQy += totalRow["colIndex_"+ i + "_field"].baseStockQy;
						allQy += this.myNumber(totalRow["colIndex_" + i + "_field"].baseStockQy);
					}
					totalRow.rowTotal.baseStockQy = allQy;
					dataGrid.dataView.updateItem(totalRow);
					dataGrid.dataView.endUpdate();
					return;
				}
			},

			'formatter:hideSize:click': function(e){
				console.log(e);
				this.removeSizeList[e.column.sizeID] = true;
				this.dataGrid.setColumns(this.getColumns( Number(this.$("#ca_bodyShapeID").val()) ));
				return;
			},
			'formatter:showAll:click': function(e){
				console.log(e);
				this.removeSizeList = {};
				this.dataGrid.setColumns(this.getColumns( Number(this.$("#ca_bodyShapeID").val()) ));
				return;
			},
			'footer:addNewRow': function(gridView){
				var data = this.dataGrid.getData();
				//var rowIndex = data[data.length  -1 ].rowIndex ? data[data.length  -1 ].rowIndex + 1 : 0;
				var rowIndex;
				if (data.length == 0) {
					rowIndex = 0;
				} else {
					rowIndex = data[data.length  -1 ].rowIndex + 1;
				}
				// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
				var newItem = {
					isItemRow : true,
					isAddRow : true,
					rowIndex : rowIndex,
					body : true,
					baseStockID : this.newBaseStockID,
					rowTotal : {
						baseStockQy : 0,
					}
				};
				for (var i = 0; i < this.dispData.sizeNum; i++){
					var cell = this.dispData.header.cell[i];
					newItem["colIndex_"+ i + "_field"] = {
						sizeID : cell.sizeID,
						bodyShapeID : cell.bodyShapeID,
						baseStockQy: 0,
						colIndex : i,
						rowIndex : rowIndex
					};
				}
				gridView.addNewItem(newItem);
				this.newBaseStockID -= 1;
			},
			'row:delToggle' : function(args){
				var _this = this;
				console.log(args);
				var delItem = args.item;
				var dataGrid = args.dataGrid;
				console.log("deleted delItem:" + JSON.stringify(delItem));
				args.item.isDeleted = args.isDeleted;
				//総合計再計算
				// 各行計算
				var colTotalBaseStock = [];
				for (var i = 0; i < this.dispData.sizeNum; i++){
					colTotalBaseStock[i] = 0;
				}
				dataGrid.dataView.beginUpdate();
				var data = dataGrid.getData();
				var totalRow = {};
				$.each(data, function(){
					if(this.isItemRow){
						for (var i = 0; i < _this.dispData.sizeNum; i++){
//							colTotalBaseStock[i] += this["colIndex_" + i + "_field"].baseStockQy; // 対象行合計
							colTotalBaseStock[i] += mainView.myNumber(this["colIndex_" + i + "_field"].baseStockQy); // 対象行合計
						}
					}
					if(this.totalRow){
						totalRow = this;						// 合計表示行を把握
					}
				});
				// 総合計
				var allBaseStock = 0;
				for (i = 0; i < this.dispData.sizeNum; i++){
					totalRow["colIndex_" + i + "_field"].baseStockQy = colTotalBaseStock[i];
					allBaseStock += colTotalBaseStock[i];
				}
				totalRow.rowTotal.baseStockQy = allBaseStock;
				dataGrid.dataView.updateItem(totalRow);
				dataGrid.dataView.endUpdate();
				return;

				// 各列合計
				// 総合計
				// this.dispDataに適用(必要？)
				// setData()
			}
		},

		myNumber: function(val) {
			var valStr = val.toString();
			if (!$.isNumeric(val) || valStr.substr(0, 1) == "0" || valStr.length > 4) {
				return 0;
			} else {
				return parseInt(val, 0);
			}
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
					title: '店舗別基準在庫',
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
				return mdOpt;
			},this)(fixopt);
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

			// onOperation イベントを発火するかどうか
			this.onOperationSilent = (opt && opt.onOperationSilent);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			this.removeSizeList = {};

			// グリッド
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid',
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ。
			});
			this.dataGrid.getMetadata = this.getMetadata;
			this.listenTo(this.dataGrid, this.gridEvents);

			// グリッドリレーション
			this.graph = new clutil.Relation.DependGraph()
			.add({
				id: 'maker',
				onDependChange: function(e){
					e.model.set('maker', {id : 0, code:"", name:""});
				}
			})
			.add({
				id: 'makerItgrpCode',
				depends: ['maker.id', 'itgrp.id'],
				onDependChange: function(e){
					e.model.set('makerItgrpCode', '');
				}
			})
			.add({
				id: 'itemName',
				depends: ['maker.id', 'itgrp.id', 'makerItgrpCode'],
				onDependChange: function(e){
					var itgrp = $("#ca_itgrpID").autocomplete('clAutocompleteItem');
					var makerItgrp_code = e.model.get('makerItgrpCode'),
						itgrp_id = itgrp ? itgrp.id : 0,
						maker_id = e.model.get('maker.id');
					maker_id = maker_id == null ? 0 : maker_id;

					var fail = function(error){
						e.model.set({
							itemID: 0,
							itemCode: '',
							itemName: '',
							MICodeError : error
						});
					};

					if (makerItgrp_code)
					//if (makerItgrp_code && maker_id)
					{
						var done = e.async();

						var f_pack = maker_id > 0 ? 0 : 1;	// メーカー未入力の場合は集約商品として検索
						clutil.clmakeritemcode2item({
							maker_code: makerItgrp_code,
							itgrp_id: itgrp_id,
							maker_id: maker_id,
							f_pack: f_pack
						})
							.done(function(data){
								if (data.head.status){
									fail(clmsg[data.head.message]);
									return;
								}

								var rec  = data.rec;
								if (f_pack) {
									e.model.set({
										maker: {id:1, code:"",name:"集約品番"},
										itemID: rec.itemID,
										itemCode: rec.itemCode,
										itemName: rec.itemName,
										MICodeError : null,
										f_pack: f_pack		// TODO
									});
								} else {
									e.model.set({
										itemID: rec.itemID,
										itemCode: rec.itemCode,
										itemName: rec.itemName,
										MICodeError : null,
										f_pack: f_pack		// TODO
									});
								}
							})
							.fail(function(){fail('失敗');})
							.always(done);
					}else{
						fail();
					}
				}
			})
			.add({
				id: 'color.id',
				depends: ['itemID'],
				onDependChange: function(e){
					e.model.set({
						'color.id' : 0,
						'color.name' : '',
						'color.code' : '',
						'colorItemID' : 0,
						'colorItemCode' : ''
					});
				}
			});

		},

		/**
		 * エラー行、警告行クリック時に該当の行までスクロールする処理 2016.06.14 山口 追加
		 */
		_onErrWrnClick: function(args) {
			this.dataGrid.grid.scrollRowIntoView($(args.currentTarget).data('rownum')+1,1);
		},

		getMetadata: function(rowIndex){
//			console.log(arguments);
			if (rowIndex == 0) {
				return {
					cssClasses: 'reference'
				};
			} else {
				return {
					columns: {
						distType: {
							cssClasses: 'pulldown'
						}
					}
				};
			}
			if (rowIndex <= this.updIndex) {
				return {
					rowDelProtect : true,
				};
			}
		},

		getUpdReq: function(){
			var data = this.dataGrid.getData();
			return data;
		},

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
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					_this.$("#ca_storeID").autocomplete("clAutocompleteItem", {id: id, code: code, name: name});
					var req = _this.buildReq(AMDSV0060Req.AMDSV0060_TYPE_STORE);
					if (req) {
						// 店舗別基準在庫取得
						_this.doSrch(req);
					}
				} else {
					var chk = $("#ca_storeID").autocomplete("clAutocompleteItem");
					if (chk == null || chk.id == 0)  {
						_this.AMPAV0010Selector.clear();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
			this.AMPAV0010Selector.clear = function() {
				_this.$("#ca_storeID").autocomplete("removeClAutocompleteItem");
			};

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID",
					initValue: clcom.userInfo.unit_id
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_itgrpID",
				},
				// 店舗オートコンプリート
				clorgcode: {
					el: '#ca_storeID',
					addDepends: ['p_org_id'],
					dependSrc: {
						p_org_id: 'unit_id'
					}
				},
				// 店舗参照ボタン
				AMPAV0010: {
					button: this.$('#ca_btn_store_select'),
					view: this.AMPAV0010Selector,
					showOptions: function(){
						return {
							org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
						};
					}
				},
				// サイズパターン
				'clsizeptn_byitgrpselector': {
					el: "#ca_sizePtnID",
					dependSrc: {
						itgrp_id: 'itgrp_id'
					}
				},
			}, {
				dataSource: {
					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});
			this.fieldRelation.done(_.bind(function() {
				// ここでviewへの反映が保証される。
				this.fieldRelation.fields.clorgcode.on("change", function(attr, view, options) {
					mainView._onStoreChanged(attr, view, options);
				});
			}, this));

//			// 店舗部品
//			this.AMPAV0010Selector = new AMPAV0010SelectorView({
//				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
//				$parentView	:	$("#mainColumn"),
//				select_mode : clutil.cl_single_select,		// 単一選択
//				isAnalyse_mode : false	// 通常画面モード
//			});
//			// 選択サブ画面復帰処理
//			this.AMPAV0010Selector.okProc = function(data) {
//				if (data !== null && data.length == 1) {
//					// 店舗を取出す
//					var id = data[0].val;
//					var code = data[0].code;
//					var name = data[0].name;
//					_this.storeAutocomplete.setValue({id: id, code: code, name: name});
//					var req = _this.buildReq(AMDSV0060Req.AMDSV0060_TYPE_STORE);
//					if (req) {
//						// 店舗別基準在庫取得
//						_this.doSrch(req);
//					}
//				} else {
//					var store = _this.storeAutocomplete.getValue();
//					if (store.id == 0) {
//						_this.AMPAV0010Selector.clear();
//					}
//				}
//				// inputにフォーカスする
//				_.defer(function(){
//					clutil.setFocus(_this.$("#ca_storeID"));
//				});
//			};
//			this.AMPAV0010Selector.clear = function() {
//				if (typeof mainView != "undefined") {
//					_this.storeAutocomplete.resetValue();
//				}
//			};
//
//			// 店舗オートコンプリート
//			this.storeAutocomplete = this.getOrg(clcom.userInfo.unit_id);
//
//			this.storeAutocomplete.on('change', function(item) {
////			    console.log(item);
//				// 店舗別基準在庫取得
//				return _this.getStoreBaseStock();
//			});

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			this.AMPAV0010Selector.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				this.$("#ca_tgtlink_div").show();
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.setFocus($('#ca_itgrpID'));
				}
				else{
					clutil.setFocus(this.$("#ca_unitID"));
				}
			} else {
				this.$("#ca_tgtlink_div").hide();
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			this.dataGrid.render();		// データグリッド

			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				var row_alert = [];
				var row_error = [];
				// MT-1493 エラー・警告行エリアクリア
				ClGrid.showAlert(row_alert);
				ClGrid.showError(row_error);
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// args.data が null なら空欄表示化する。args.data に何かネタがあれば画面個別Viewへセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
//				this.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				var normalFms = [];
				var gridErrors = [];
				_.each(args.data.rspHead.fieldMessages, function(fm){
					if(fm.field_name == "baseStockQy"){
						gridErrors.push(fm);
					} else {
						normalFms.push(fm);
					}
				});
				if (gridErrors.length > 0){
					this.setGridErrors(gridErrors);
					var row_error = ClGrid.getErrorRow(this.dataGrid.metadatas.body, this.dataGrid.getData(), 1)
					ClGrid.showError(row_error);
				}
				if (normalFms.length > 0){
					this.validator.setErrorInfoFromSrv(normalFms, {prefix: 'ca_'});
				}
				clutil.mediator.trigger("onTicker", args.data);
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			console.log('_onMDGetCompleted: opeTypeId[' + args.status + ']');
			var data = args.data;
			var recs = data.AMDSV0060GetRsp;

			switch(args.status){
			case 'OK':
				// 編集可の状態にする。
				clutil.viewRemoveReadonly(this.$el);

				var $d = $.Deferred();
				this.invokeYmd2week(recs).then(function(ymMap){
					// ココの arguments に、clutil.ymd2week の結果が入ってくるので、
					// recs の中に結果を放り込む。
					for(var i = 0; i < recs.itemRecords.length; i++) {
						var item = recs.itemRecords[i];
						item.stDate = ymMap[item.stDate];
						item.edDate = ymMap[item.edDate];
					}
					return $d.resolve(data);
				}).done(_.bind(function(){
					console.log(data);
					// args.data をアプリ個別 Veiw へセットする。
					this.data2view(data).always(_.bind(function(){
						// 編集・複製・削除・参照
						if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
							// 事業ユニット、品種、店舗、サイズパターンは入力不可
							clutil.viewReadonly(this.$('#div_ca_unitID'));
							clutil.inputReadonly(this.$('#ca_itgrpID'));
							clutil.inputReadonly(this.$('#ca_storeID'));
							clutil.inputReadonly(this.$('#ca_btn_store_select'));
							clutil.viewReadonly(this.$('#div_ca_sizePtnID'));
							clutil.setFocus(this.$('#ca_bodyShapeID'));
						}
						if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
							// TODO:コードは空
							this.AMPAV0010Selector.clear();
							clutil.setFocus($('#ca_unitID'));
						}
						if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
								||this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
							this.setReadOnlyAllItems(true);
						}
						//clutil.setFocus(this.$('#ca_bodyShapeID'));
					}, this));
				}, this)).fail(_.bind(function(){
					console.log("fail!!");
				}, this));
				console.log(data);

				break;
			case 'DONE':		// 確定済
				var $d = $.Deferred();
				this.invokeYmd2week(recs).then(function(ymMap){
					// ココの arguments に、clutil.ymd2week の結果が入ってくるので、
					// recs の中に結果を放り込む。
					for(var i = 0; i < recs.itemRecords.length; i++) {
						var item = recs.itemRecords[i];
						item.stDate = ymMap[item.stDate];
						item.edDate = ymMap[item.edDate];
					}
					return $d.resolve(data);
				}).done(_.bind(function(){
					// args.data をアプリ個別 View へセットする。
					this.data2view(data).always(_.bind(function(){
						// 確定済なので、 全 <input> は readonly 化するなどの処理。
						this.setReadOnlyAllItems(true);
					}, this));
				}, this)).fail(_.bind(function(){
					console.log("fail!!");
				}, this));
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				var $d = $.Deferred();
				this.invokeYmd2week(recs).then(function(ymMap){
					// ココの arguments に、clutil.ymd2week の結果が入ってくるので、
					// recs の中に結果を放り込む。
					for(var i = 0; i < recs.itemRecords.length; i++) {
						var item = recs.itemRecords[i];
						item.stDate = ymMap[item.stDate];
						item.edDate = ymMap[item.edDate];
					}
					return $d.resolve(data);
				}).done(_.bind(function(){
					// args.data をアプリ個別 View へセットする。
					this.data2view(data).always(_.bind(function(){
						// 確定済なので、 全 <input> は readonly 化するなどの処理。
						this.setReadOnlyAllItems(true);
					}, this));
				}, this)).fail(_.bind(function(){
					console.log("fail!!");
				}, this));
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {prefix: 'ca_'});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
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
//			console.log(defaultVal);
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

		// フィールドメッセージをセットする
		setGridErrors : function(fms){
			var _this = this;
			var GD = this.dataGrid.getData();
			// フィールドメッセージ毎に対象セルを確認
			_.each(fms, function(fm){
				//gridデータから対象セルを探す
				$.each(GD, function(){
					if(this.isItemRow && this.baseStockID == fm.args[0]){
						for (var i = 0; i < _this.dispData.sizeNum; i++){
							if(this["colIndex_" + i + "_field"].sizeID == fm.args[1]){
								_this.dataGrid.setCellMessage(
									this._cl_gridRowId,
									"colIndex_" + i + "_field",
									'error',
									clmsg[fm.message]
								);
								break;
							}
						}
					}
				});
			});
		},

		/**
		 * データを表示
		 */
		data2view: function(data){
			var _this = this;

			this.saveData = data.AMDSV0060GetRsp;
			var baseStockRecord = {};
			baseStockRecord.unitID = this.savedCond.srchUnitID;
			baseStockRecord.itgrpID = this.savedCond._view2data_srchItgrpID_cn;
			baseStockRecord.storeID = {
				id: this.chkData.id,
				code: this.chkData.storeCode,
				name: this.chkData.storeName,
			};
			baseStockRecord.sizePtnID = this.savedCond.srchSizePtnID;

			var dfd = $.Deferred();
			console.log(this.saveData);
			// データセット
			clutil.mediator.once("data2view:done", function(){
				// テーブルデータセット
				_this.setDispData(_this.saveData);
				console.log(_this.dispData);
				_this.renderTable();
				dfd.resolve();
			});
			clutil.data2view(this.$('#ca_base_form'), baseStockRecord);
			// テーブルデータセット
			// 体型セレクター
			clutil.clsizerowselector({
				el: '#ca_bodyShapeID',
				dependAttrs: {
					sizePtnID: baseStockRecord.sizePtnID
				}
			});

			return dfd.promise();
		},

		invokeYmd2week: function(rsp) {
			if (_.isEmpty(rsp.itemRecords)) {
				return $.Deferred().resolve({});
			}

			var ymMap = _.reduce(rsp.itemRecords, function(map, item){
				map[item.stDate] = null;
				map[item.edDate] = null;
				return map;
			}, {});
			var efers = _.reduce(ymMap, function(dfarray, val, ym){
				if (ym != 0) {
					var d = clutil.ymd2week(ym, 0, true).done(function(data){
						//console.log('clutil.ymd2week.done: ', arguments);
						ymMap[data.id] = data;
					});
					dfarray.push(d);
				}
				return dfarray;
			}, []);

			var dfd = $.Deferred();
			$.when.apply($, efers).then(function(){
				//console.log('$.when.apply: ', arguments);
				dfd.resolve(ymMap);
			});
			return dfd.promise();
		},

		// 初期データ取得後に呼ばれる関数
		setReadOnlyAllItems: function(isGrid){
			clutil.viewReadonly(this.$el);
			if (isGrid) {
				this.dataGrid.setEnable(false);
			}
		},

		/** テーブルクリア **/
		clearTable : function() {
			this.dataGrid.clear();
		},

		/**
		 * 店舗別基準在庫取得
		 */
		getStoreBaseStock: function() {
			var req = this.buildReq(AMDSV0060Req.AMDSV0060_TYPE_STORE);
			if (req) {
				// 店舗別基準在庫取得
				this.doSrch(req);
			}
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function (infoType) {
			var itgrpData = $('#ca_itgrpID').autocomplete('clAutocompleteItem');
			if (!itgrpData) {
				return null;
			}
			var storeData = $('#ca_storeID').autocomplete('clAutocompleteItem');
			if (!storeData) {
				return null;
			}
			var sizePtnID = Number($('#ca_sizePtnID').val());
			if (sizePtnID == 0) {
				return null;
			}

			var getReq = {
					// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				infoType: infoType,	// 取得情報フラグ
				// 基準在庫登録・修正検索リクエスト
				AMDSV0060GetReq: {
					srchBaseStockID: 0,			// 基準在庫ID
					srchItgrpID: itgrpData.id,	// 品種ID
					srchStoreID: storeData.id,	// 店舗ID
					srchSizePtnID: sizePtnID,	// サイズパターンID
					srchBaseStockPtnID : 0,		// 基準在庫パターンID
					srchStoreRankID: 0,			// 店舗ランクID
					srchDate: clcom.getOpeDate(),// 検索日
				},
			};

			return getReq;
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 */
		doSrch: function(srchReq){
			var defer = clutil.postJSON('AMDSV0060', srchReq)
			.then(_.bind(function(data){
				var recs = data.AMDSV0060GetRsp;
				var $d = $.Deferred();
				this.invokeYmd2week(recs).done(function(ymMap){
					// ココの arguments に、clutil.ymd2week の結果が入ってくるので、
					// recs の中に結果を放り込む。
					for(var i = 0; i < recs.itemRecords.length; i++) {
						var item = recs.itemRecords[i];
						item.stDate = ymMap[item.stDate];
						item.edDate = ymMap[item.edDate];
					}
					return $d.resolve(data);
				});
				return $d.promise();
			}, this)).done(_.bind(function(data){
				console.log(data);
				this.srchDoneProc(srchReq, data);
			}, this)).fail(_.bind(function(data){
				console.log("fail!!");
				this.srchFailProc(data);
			}, this));

			return defer;
		},

		srchDoneProc: function(srchReq, data){
			// データ取得
			var recs = data.AMDSV0060GetRsp;
			console.log(recs);

			if (_.isEmpty(recs)) {
				// エラーメッセージ表示
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

//				// フォーカス設定
//				this.resetFocus(this.srchCondView.$tgtFocus);
			} else {
				// データセット
				this.setDispData(recs);
				this.renderTable();
				// リクエストを保存。
				this.savedReq = srchReq;
			}
		},

		srchFailProc: function(data){
			// エラーメッセージを通知。
			clutil.mediator.trigger('onTicker', data);

//			// フォーカスの設定
//			this.resetFocus();
		},

		setDispData: function(rsp){
			var _this = this;
			this.dispData = null;
			this.saveData = rsp;

			var tableData = {
				header	: {
					head	: [], // colspanデータ
					cell	: [], // sizetdデータ
				},
				totalData	: {allBaseStockQy : 0, list:[]},			// 合計行情報
				body		: [],								// テーブル描画情報
				dispItem	: [],								// bodyを参照している
//				sizePtnID	: rsp.baseStockRecord.sizePtnCodeName.id,	// サイズパターンID(表示ネタ確認用)
//				storeID		: rsp.baseStockRecord.storeCodeName.id,		// 店舗ID(表示ネタ確認用)
				sizeNum		: 0
			};

			var hd = tableData.header;
			var bd = tableData.body;
			var td = tableData.totalData;

			// テーブルのヘッダ部分のデータを生成する
			this.maxItem = 0;
			var index = 0;
			$.each(rsp.sizeRecords, function(){
				hd.cell.push({
					sizeName	: this.sizeName,
					sizeCode	: this.sizeCode,
					sizeID		: this.sizeID,
					bodyShapeID	: this.bodyShapeID,
					autoStopQy	: this.autoStopQy,
					colIndex	: index,
				});
				index++;
			});
			hd.head.push({colspan:index});
			tableData.sizeNum = index;

			var cellLoopMax = index;
			var cellIndex = 0;
			var rowIndex = 0;
			var colTotalBaseStock = [];
			for (var i = 0; i < cellLoopMax; i++){
				colTotalBaseStock[i] = 0;
			}

			var cellRecordsMap = {};
			$.each(rsp.itemCellRecords, function(i, o){
				var id = o.baseStockID + ':' + o.sizeID;
				cellRecordsMap[id] = o;
			});

			// テーブルの縦軸部分のデータを生成する
			$.each(rsp.itemRecords, function(){
				var colIndex = 0;
				var list = [];

				var totalBaseStockQy = 0;
				// テーブルの横軸部分のデータを生成する
				for (var i = 0; i < cellLoopMax; i++){
					var sizeData = rsp.sizeRecords[i];
					var baseStockQy = _this.getCellData(cellRecordsMap, this.baseStockID, sizeData.sizeID).baseStockQy;
					list.push({
						baseStockID : this.baseStockID,
						itemID		: this.itemCodeName.id,
						itemCode    : this.itemCodeName.code,
						itemName	: this.itemCodeName.name,
						colorID		: this.colorID,
						sizeID		: sizeData.sizeID,
						sizeCode	: sizeData.sizeCode,
						sizeName	: sizeData.sizeName,
						baseStockQy	: baseStockQy,
						bodyShapeID	: sizeData.bodyShapeID,
						autoStopQy	: sizeData.autoStopQy,
						rowIndex	: rowIndex,
						colIndex	: colIndex,
					});
					totalBaseStockQy += baseStockQy;
					colTotalBaseStock[colIndex] += baseStockQy;

					cellIndex++;
					colIndex++;
				}

				this.isAddRow = false;
				this.rowIndex = rowIndex;
				this.totalBaseStockQy = totalBaseStockQy;
				this.itemID = this.itemCodeName.id;
				this.itemCode = this.itemCodeName.code;
				this.itemName = this.itemCodeName.name;
				this.f_pack = this.fPack;
				this.list = list;
				bd.push(this);

				rowIndex++;
			});

			for (var i = 0; i < cellLoopMax; i++){
				td.list.push({
					colIndex : i,
					baseStockQy : colTotalBaseStock[i]
				});
				td.allBaseStockQy += colTotalBaseStock[i];
			}

			this.dispData = tableData;
			this.dispData.dispItem = this.dispData.body;
		},

		getBaseStockQy: function (itemCellRecords, itemID, sizeID) {
			var baseStockQy = 0;
			$.each(itemCellRecords, function(){
				if (this.itemID == itemID && this.sizeID == sizeID) {
					baseStockQy = this.baseStockQy;
					return false;
				}
			});

			return baseStockQy;
		},

		getCellData: function(cellRecordsMap, baseStockID, sizeID){
			var id = baseStockID + ':' + sizeID;
			var cellData = cellRecordsMap[id] || {
				baseStockQy	: 0,
			};
			return cellData;
		},

		_makeColumsFromSizeData : function(){
//			var _this = this;
			if(_.isEmpty(this.dispData.header.cell)){
				return null;
			}
			var columns = [
				{
					id : 'maker',
					name : 'メーカー',
					field : 'maker',
					cssClass: 'fntss edit',
					width: 120,
					cellType  : {
						type: 'clajaxac',
						validator: 'required',
						formatter: 'nameonly',
						editorOptions: {
							funcName: 'vendorcode',
							itemTemplate: '<%- it.name %>',
							dependAttrs: function(){
								return {
									vendor_typeid: amcm_type.AMCM_VAL_VENDOR_MAKER
								};
							},
						},
						isEditable: function(item){
							return item.isAddRow && !item.totalRow;
						}
					}
				},
				{
					id : 'makerItgrpCode',
					name : 'メーカー品番',
					field : 'makerItgrpCode',
					cssClass: 'fnt edit',
					width: 120,
					cellType  : {
						type: 'text',
						validator: ['required', 'hankaku', 'len:0,10', function(){return this.item.MICodeError;}],
						limit: 'hankaku len:10',
						isEditable: function(item){
							var itgrpObj = $("#ca_itgrpID").autocomplete("clAutocompleteItem");
							return item.isAddRow && !item.totalRow
								&& !!((item /*&& item.maker && item.maker.id*/)
									&& !_.isEmpty(itgrpObj) && !!Number(itgrpObj.id));
						}
					}
				},
				{
					id : 'itemName',
					name : '商品名',
					field : 'itemName',
					cssClass: 'fntss',
					width: 200
				},
				{
					id : 'color',
					name: 'カラー',
					field: 'color',
					cssClass: 'edit',
					width: 140,
					cellType: {
						type: 'clajaxselector',
//						validator	: "selected", TODO:total行回避策
						formatter: function(value, options){
							console.log(value);
//							if (options.dataContext.totalRow){
//								return "";
//							}
							return ClGrid.Formatters.nameonly(value, options);
						},
						editorOptions: function(item){
							return {
								funcName: 'color',
								dependAttrs: {
									itemID: item.itemID
								},
								nameOnly: true
							};
						},
						isEditable: function(item){
							return item.isAddRow && !item.totalRow && !!item.itemID;
						}
					}
				},
				{
					id : 'stDate',
					name: '開始週',
					field		: 'stDate',
					cssClass: 'edit',
					width		: 160,
					headCellType: {
						formatter: function(value, options){
							var helpText = '例えば「201430」と入力すると2014年30週が表示されます';
							return '<div class="clgridhd-icon-help">'
								+ _.escape(value)
								+ '<p class="txtInFieldUnit flright help" data-cl-errmsg="' + _.escape(helpText) + '"><span>?</span></p>'
								+ '</div>';
						}
					},
					cellType  : {
						type: 'clajaxac',
//						validator : "required",
						editorOptions: {
							funcName: 'yearweekcode',
						},
						isEditable: function(item){
							return !item.totalRow;
						}
					}
				},
				{
					id : 'edDate',
					name: '終了週',
					field		: 'edDate',
					cssClass: 'edit',
					width		: 160,
					headCellType: {
						formatter: function(value, options){
							var helpText = '例えば「201430」と入力すると2014年30週が表示されます';
							return '<div class="clgridhd-icon-help">'
								+ _.escape(value)
								+ '<p class="txtInFieldUnit flright help" data-cl-errmsg="' + _.escape(helpText) + '"><span>?</span></p>'
								+ '</div>';
						}
					},
					cellType  : {
						type: 'clajaxac',
//						validator : "required",
						editorOptions: {
							funcName: 'yearweekcode',
						},
						isEditable: function(item){
							return !item.totalRow;
						}
					}
				},
				{
					id : 'rowTotal',
					name : '合計',
					field : 'rowTotal',
					width		: 80,
					cellType: {
						formatter: function(value, options){
							return baseStockQyFormatter({
								col : clutil.comma(options.dataContext.rowTotal.baseStockQy)
							});
						}
					}
				}
			];

			var numSize = this.dispData.header.cell.length;
			$.each(this.dispData.header.cell, function(i){
				var fieldName = 'colIndex_' + this.colIndex + '_field';
				columns.push({
					id : 'colIndex_' + this.colIndex + '_field',
					name : this.sizeName,
					field : 'colIndex_' + this.colIndex + '_field',
					width		: 80,
					sizeColumn: true,
					sizeID: this.sizeID,
					firstSizeCol: i === 0,
					lastSizeCol: i === numSize - 1,
					bodyShapeID: this.bodyShapeID,
					headCellType: {
						formatter: 'myHdrFormatter'
					},
					cellType: {
						editorType: SizeEditor,
						isEditable: function(item){
							return !item.totalRow;
						},
						formatter: function(value, options){
							if (options.dataContext.totalRow) {
								return totalColFormatter(value, options);
							} else {
								return sizeFormatter(value, options);
//								return baseStockQyFormatter({
//									col: clutil.comma(value.baseStockQy)
//								});
							}
						},
						validator: [function(){
							var value = this.item[fieldName];
							return clutil.Validators.checkAll({
								validator: 'required uint:4',
								value: value && value.baseStockQy
							});
						}]
					}
				});
			});
			this._columns = columns;
			return columns;
		},

		// this.dataGridの描写データ作成し、setDataする
		renderTable : function(){
			var dispData = this.dispData;
			var td = dispData.totalData;
			var columns = this._makeColumsFromSizeData();
			var data = [];
			var tmp;
			if (columns == null){
				return false;	// データなし。
			}
			this.updIndex = dispData.body.length;

			// 合計 行
			tmp = {
					isItemRow		: false,
					isAddRow		: false,
					totalRow		: true,
					maker			:  {
						id				: 1,
						name			: "合計",
						code			: ""
					},
					makerItgrpCode	: " ",
					itemName		: "",
					itemCode		: "",
					itemID			: 1,
					color 			: {
						id				: 1,
						name			: "",
						code			: ""
					},
					colorItemID		: this.colorItemID,
					colorItemCode	: this.colorItemCode,
					colorItemName	: this.colorItemName,
					stDate			: '',
					edDate			: '',
					rowTotal		: {
						baseStockQy	: td.allBaseStockQy
					}
			};
			$.each(td.list, function(){
				tmp["colIndex_" + this.colIndex + "_field"] = this;
			});
			data.push(tmp);

			// item 行
			$.each(dispData.body, function(){
				tmp = {
						isItemRow	: true,
						isAddRow	: this.isAddRow,
						rowIndex	: this.rowIndex,
						// itemInfo
						maker :{
							name	: this.makerName,
							code	: '',
							id		: this.rowIndex + 2
						},
						makerItgrpCode : this.itemCode,
						itemName	: this.itemName,
						itemID		: this.itemID,
						color 			: {
							id				: this.colorID,
							name			: this.colorName,
							code			: '',
							colorItem : {
								id : this.colorItemID
							}
						},
						stDate		: this.stDate,
						edDate		: this.edDate,
						body		: true,
						baseStockID		: this.baseStockID,
						rowTotal 	: {
							baseStockQy	: this.totalBaseStockQy
						}
				};
				$.each(this.list, function(){
					tmp["colIndex_" + this.colIndex + "_field"] = {
							baseStockQy		: this.baseStockQy,
							colIndex		: this.colIndex,
							bodyShapeID		: this.bodyShapeID,
							sizeID			: this.sizeID
					};
				});
				data.push(tmp);
			});
			if(dispData.body.length == 0
					&& this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				tmp = {
						isItemRow	: true,
						isAddRow	: true,
						rowIndex	: 0,
						// itemInfo
						maker : {
							name	: "",
							code	: "",
							id		: 0
						},
						makerItgrpCode : "",
						itemName	: "",
						itemID		: 0,
						color 			: {
							id				: 0,
							name			: "",
							code			: "",
							colorItem : {
								id : this.colorItemID
							}
						},
						body		: true,
						baseStockID		: this.newBaseStockID,
						rowTotal 	: {
							baseStockQy	: 0,
						}
				};
				$.each(dispData.header.cell, function(){
					tmp["colIndex_" + this.colIndex + "_field"] = {
							baseStockQy	: 0,
							colIndex	: this.colIndex,
							bodyShapeID	: this.bodyShapeID,
							sizeID		: this.sizeID
					};
				});
				data.push(tmp);
				this.newBaseStockID -= 1;
			}
			this.dataGrid.render().setData({
				gridOptions		: {
					frozenColumn : 6,
					frozenRow : 2,
					frozenRowHeight: [ 80, 40 ],
					rowHeight : 40,
					autoHeight: false		// 高さに対して仮想化するため、インナースクロールを入れる。
				},
				columns			: columns,
				data			: data,
				rowDelToggle	: true,
				graph			: this.graph
			});
		},

		getColumns: function(bodyShapeID){
			var removeSizeList = this.removeSizeList || {};
			var columns = _.filter(this._columns, function(column){
				return !column.sizeColumn ||
				(!bodyShapeID || column.bodyShapeID === bodyShapeID) &&
				!_.has(removeSizeList, column.sizeID);
			});

			return columns;
		},

		/** テーブルクリア **/
		clearTable : function() {
			this.dataGrid.clear();
		},

		/**
		 * 品番別振分リンク押下処理
		 */
		_onLinkItemcodeClick: function(e) {
			var url = clcom.appRoot + '/AMDS/AMDSV0060/AMDSV0060.html';
			var destData;
			destData = {
				// 新規登録
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
			};
			clcom.pushPage(url, destData, null);
		},

		/**
		 * 事業ユニットが変更されたイベント
		 *  ⇒ 品種コードオートコンプリートの内部設定値をクリアする。
		 */
		_onUnitChanged: function(e){
			//console.log(e);
			if(this.deserializing){
				// データセット中
				return;
			}
			var unitID = Number($("#ca_unitID").val());
			this.getOrg(unitID);
			this.storeAutocomplete.setValue();
			this.$("#ca_storeID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_store_select").attr("disabled", (unitID == 0));
			this.AMPAV0010Selector.clear();
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){
			var unitID = Number($("#ca_unitID").val());
			var options = {
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id : (unitID == 0) ? 3 : unitID,
			};
			this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * 店舗オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: $("#ca_storeID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				},
				initValue : {
					code : clcom.userInfo.org_code,
					id : clcom.userInfo.org_id,
					name : clcom.userInfo.org_name,
				}
			});
		},

		_onStoreChanged: function(attr, view, options) {
			if(this.deserializing){
				// データセット中
				return;
			}

			var req = this.buildReq(AMDSV0060Req.AMDSV0060_TYPE_STORE);
			if (req) {
				// 店舗別基準在庫取得
				this.doSrch(req);
			}
		},

		/**
		 * サイズパターンが変更されたイベント
		 *  ⇒ 体型セレクターの中身を取得する。
		 */
		_onSizePtnChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}

			var sizePtnID = Number($(e.target).val());
			var req = this.buildReq(AMDSV0060Req.AMDSV0060_TYPE_STORE);
			if (req) {
				// 店舗別基準在庫取得
				this.doSrch(req);
			}

			// 体型セレクター取得
//			console.log("sizePtnID:" + sizePtnID);
			return clutil.clsizerowselector({
				el: '#ca_bodyShapeID',
				dependAttrs: {
					sizePtnID: sizePtnID
				}
			});
		},

		/**
		 * 体型が変更されたイベント
		 *  ⇒ サイズの絞込を行う。
		 */
		_onBodyShapeChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}
			// サイズの絞込
			var rowID = Number($(e.target).val());
			console.log("rowID:" + rowID);
			this.dataGrid.setColumns(this.getColumns(rowID));
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			console.log(this.options);

			this.chkData = this.options.chkData[pgIndex];
			this.savedCond = this.options.savedCond;
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},
				infoType: AMDSV0060Req.AMDSV0060_TYPE_STORE,	// 取得情報フラグ(店舗別取得)
				// 基準在庫登録・修正検索リクエスト
				AMDSV0060GetReq: {
					srchBaseStockID: 0,						// 基準在庫ID
					srchItgrpID: this.options.itgrpID,		// 品種ID
					srchStoreID: this.chkData.id,			// 店舗ID
					srchSizePtnID: this.options.sizePtnID,	// サイズパターンID
					srchBaseStockPtnID: 0,					// 基準在庫パターンID
					srchStoreRankID: 0,						// 店舗ランクID
					srchDate: this.options.srchDate,		// 検索日
				},
				// 基準在庫更新リクエスト -- 今は検索するので、空を設定
				AMDSV0060UpdReq: {
				}
			};

			return {
				resId: 'AMDSV0060',
				data: getReq
			};
		},

		hasInputError: function(){
			var hasError = false;

			if(!this.validator.valid()) {
				hasError = true;
			}

			return hasError;
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

//			var updReq = this.view2UpdReq();
			var updReq = {};

			/*
			 * 入力値チェック 削除時はチェックしない
			 */
			if (this.options.opeTypeId  !== am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				// validation
				var f_error = false;
				this.validator.clear();
				this.dataGrid.stopEditing();

				if(!this.validator.valid()) {
					f_error = true;
				}

				if(f_error){
					return null;
				}

				// gridの入力チェック
				this.dataGrid.clearCellMessage();
				if(!this.dataGrid.isValid()){
					f_error = true;
				}
				if(f_error){
					clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
					var gridData = this.dataGrid.getData();
					if (!gridData[0].rowIndex) {
						gridData = _.last(gridData, gridData.length - 1);
					}
					var row_error = ClGrid.getErrorRow(this.dataGrid.metadatas.body, gridData, 0);
					ClGrid.showError(row_error);
					return null;
				}

				updReq = this.view2UpdReq();

				if(updReq.itemRecords == null || updReq.itemRecords.length == 0){
					clutil.mediator.trigger('onTicker', "対象商品を一つは設定してください");
					return null;
				}

				if(!this.isDesidedItem(updReq.itemRecords)){
					clutil.mediator.trigger('onTicker', clmsg.cl_echoback);

					var row_error = [];
					for (var i = 0; i < updReq.itemRecords.length; i++) {
						if (updReq.itemRecords[i].colorID == 0) {
							row_error.push({num: i + 1});
						}
					}
					ClGrid.showError(row_error);
					return null;
				}
				if(!this.isCorrectItem(updReq.itemRecords)){
					var row_error = ClGrid.getErrorRow(this.dataGrid.metadatas.body, this.dataGrid.getData(), 0);
					ClGrid.showError(row_error);
					return null;
				}
			}

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				updReq.baseStockRecord.baseStockID = 0;
			}

			var reqHead = {
				opeTypeId : this.options.opeTypeId,
			};
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			if (this.options.opeTypeId  == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				updReq = this.saveData;
			}

			var reqObj = {
				reqHead : reqHead,
				infoType: AMDSV0060Req.AMDSV0060_TYPE_STORE,		// 取得情報フラグ(店舗別)
				AMDSV0060UpdReq  : updReq
			};
//			console.log(updReq);
//			return;

			return {
				resId: 'AMDSV0060',
				data: reqObj,
//				confirm: clmsg.WDS0003
			};

//			// Null を渡すと、Ajax 呼び出しを Reject したものと FW 側では見なします。
//			return null;
		},

		/**
		 * 表示から更新データ作成
		 */
		view2UpdReq : function(){
			var baseStockRec = clutil.view2data(this.$('#ca_base_form'));
			var itemRecs = [];
			var itemCellRecs = [];
			var cellLen = (this.dispData && this.dispData.sizeNum) ? this.dispData.sizeNum : 0;
			var gridData = this.dataGrid.getData();
			var tmp;

			baseStockRec.unitCodeName = {
				id : baseStockRec.unitID,
			};
			var itgrp = _.pick(baseStockRec._view2data_itgrpID_cn, 'id', 'code', 'name');
			baseStockRec.itgrpCodeName = {
				id : itgrp.id,
				code : itgrp.code,
				name : itgrp.name,
			};
			var store = _.pick(baseStockRec._view2data_storeID_cn, 'id', 'code', 'name');
			baseStockRec.storeCodeName = {
				id : store.id,
				code : store.code,
				name : store.name,
			};
			baseStockRec.sizePtnCodeName = {
				id : baseStockRec.sizePtnID,
			};
			delete baseStockRec.unitID;
			delete baseStockRec._view2data_itgrpID_cn;
			delete baseStockRec._view2data_storeID_cn;
			delete baseStockRec.sizePtnID;

			_.each(gridData, function(rowData){
				if(rowData.isItemRow /*&& !rowData.isDeleted*/){
					itemRecs.push({
						_cl_gridRowId : rowData._cl_gridRowId,
						baseStockID	: rowData.baseStockID,
						itemCodeName : {
							id		: rowData.itemID,
							code	: rowData.makerItgrpCode,
							name	: rowData.itemName,
						},
						colorID		: rowData.color ? rowData.color.id : 0,
						colorName	: rowData.color ? rowData.color.name : "",
						makerName   : rowData.maker ? rowData.maker.name : "",
						stDate		: rowData.stDate ? rowData.stDate.id : 0,
						edDate		: rowData.edDate ? rowData.edDate.id : 0,
						fDelete		: rowData.isDeleted ? 1 : 0,
					});
					for (var i = 0; i < cellLen; i++){
						tmp = rowData["colIndex_"+ i +"_field"];
						tmp.itemID = rowData.itemID,
						tmp.baseStockID = rowData.baseStockID;
						itemCellRecs.push(tmp);
					}
				}
			});
			// this.dataGridから更新データ抽出
			var updReq = {
				baseStockRecord : baseStockRec,
				sizeRecords : this.saveData ? this.saveData.sizeRecords : null,
				itemRecords : itemRecs,
				itemCellRecords : itemCellRecs
			};
			return updReq;
		},

		/**
		 * itemがカラーまで決定されているかチェック
		 */
		isDesidedItem : function(list){
			var _this = this;
			var isDesided = true;
			var listLen = list.length;
			if (listLen == 0){
				return false;
			} else {
				$.each(list, function(i,v){
					if (this.f_pack == 0 && this.makerID == 0){	// TODO
						_this.dataGrid.setCellMessage(this._cl_gridRowId, 'maker', "error", "メーカーを指定してください。");
						isDesided = false;
						return false;
					}
					if (this.itemCodeName.code == ""){ // makerItgrpCode check
						_this.dataGrid.setCellMessage(this._cl_gridRowId, 'makerItgrpCode', "error", "メーカー品番を入力してください。");
						isDesided = false;
						return false;
					}
					if (this.itemCodeName.id == 0){
						_this.dataGrid.setCellMessage(this._cl_gridRowId, 'makerItgrpCode', "error", "入力された条件に該当する商品がありません。");
						isDesided = false;
						return false;
					}
					if (this.f_pack == 0 && this.colorID == 0){	// TODO
						_this.dataGrid.setCellMessage(this._cl_gridRowId, 'color', "error", "カラーを指定してください。");
						isDesided = false;
						return false;
					}
				});
			}
			return isDesided;

		},

		/**
		 * item重複がないかチェック
		 */
		isCorrectItem: function(list){
			var _this = this;
			var isCorrect = true;
			var listLen = list.length;
			if (listLen == 0){
				return false;
			} else if (listLen == 1){
				return true;
			} else {
				$.each(list, function(i,v){
					var makerID = this.makerID;
					var itemCode = this.itemCodeName.code;
					var colorID = this.colorID;
					var stDate = this.stDate;
					var edDate = this.edDate;
					for(var j = i+1; j < listLen; j++){
						if (list[j].makerID == makerID && list[j].itemCodeName.code == itemCode){
							if (list[j].colorID == colorID){
								if ((list[j].stDate <= stDate && stDate <= list[j].edDate)
										|| (stDate <= list[j].stDate && list[j].stDate <= edDate)) {
									_this.dataGrid.setCellMessage(this._cl_gridRowId, 'color', "error", clutil.fmtargs(clmsg.EMS0065, ["対象商品"]));
									_this.dataGrid.setCellMessage(list[j]._cl_gridRowId, 'color', "error", clutil.fmtargs(clmsg.EMS0065, ["対象商品"]));
									clutil.mediator.trigger("onTicker",  "データに重複があります");
									isCorrect = false;
								}
							}
						}
					}
				});
			}
			return isCorrect;
		},

		_eof: 'AMDSV0061.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////

		// 一覧画面からの引継データ pageArgs があれば渡す。
		//	pageArgs: {
		//		// 機能種別
		//		opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL,
		//		// 一覧画面で選択されたアイテム要素の配列
		//		chkData: [
		//			{id:1,code:'code-001',name:'item-001',},
		//			{id:2,code:'code-002',name:'item-002',},
		//			{id:3,code:'code-003',name:'item-003',}
		//		]
		//	};
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
