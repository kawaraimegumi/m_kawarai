// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	clutil.enterFocusMode($('body'));
	/****************/
	var AMDSV0110Defs = {
			AMDSV0110_RESULTTYPE_ITEM		: 1,	// 品番別
			AMDSV0110_RESULTTYPE_STORE		: 2,	// 店舗別
			AMDSV0110_RESULTTYPE_NEWOLD		: 3,	// 新旧チェック
			AMDSV0110_RESULTTYPE_SIZEITEM	: 4,	// サイズ(品番別)
			AMDSV0110_RESULTTYPE_SIZESTORE	: 5,	// サイズ(店舗別)
			AMDSV0110_RESULTTYPE_SALESTOCK	: 6,	// 実績参照(品番別)
			AMDSV0110_RESULTTYPE_SALESTOCKST: 7,	// 実績参照(店舗別)
			AMDSV0110_STOREINFO_FLOOR		: 1,	// 売場面積
			AMDSV0110_STOREINFO_OPENYEAR	: 2,	// 開店年度
			AMDSV0110_STOREINFO_DISPNUM 	: 3,	// 品種別陳列可能数
			AMDSV0110_STOREINFO_SALE 		: 4,	// 年商（前年度）
			AMDSV0110_STOREINFO_EXIST		: 5		// 新店２年目店
	};
	/****************/

	Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate){
		return _.template(rawTemplate, null, {variable: 'it'});
	};

	var myHdrFormatter = function(value, options){
		console.log(options);
		var label = '&nbsp;';
		if (options.cell === 5){
			label = 'サイズ';
		}else if(options.grid.getColumns().length - 2 === options.cell){
			label = '<div class="viewAll">全て表示</div>';
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
			this.$('input').val(item[this.args.column.field].distQy);
		},

		applyValue: function(item, state){
//			item[this.args.column.field].distQy = parseInt(state, 10) || 0;
			item[this.args.column.field].distQy = state;
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

	var saleStockDistFormatter = function(data){
		// jshint unused: false
		var template = Marionette.TemplateCache.get('#SaleStockDistFormatter');
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
				labelTemplate: function(item){return item.typeName;},
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

	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
//			'change #ca_unitID'			: '_onUpperSeedChange',
//			'cl_change #ca_itgrpID'		: '_onUpperSeedChange',
//			'cl_change #ca_storeID'		: '_onTableSeedChange',
//			'change #ca_sizePtnID'		: '_onTableSeedChange',
			'click #ca_link_itemcode'	: '_onLinkItemcodeClick',	// 品番別振分リンク押下時
			'click #ca_refStock'		: '_onRefStockClick',		// 実績参照ボタン押下
			'click ca_btn_store_select'	: '_onStoreBtnClick',		// 店舗選択ボタンクリック
			'change #ca_dlvType'		: '_onDlvTypeChange',		// 納品形態変更
			'change #ca_bodyTypeID'		: '_onBodyTypeChange',		// 表示体型変更
			'click #ca_filter_btn'		: '_onFilterBtnClick',		// 絞込ボタン(未実装)
			'click #ca_sample_download'	: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
			'click .cl_download'		: '_onCSVClick',			// Excelデータ出力押下
			"click .cl_errWrnRowClick"	: "_onErrWrnClick",			// MT-1493 エラー・警告行クリック yamaguchi

		},

		//grid発のイベント
		gridEvents: {
			// cell 内容変更
			"cell:change" : function(args){
//				var item = args.item;
				if (args.cell === 1){
					console.log('*** cell:change', args);
					this.dataGrid.isValidCell(args.item, 'makerItgrpCode');
					return;
				} else if(args.item.isItemRow && args.cell >= 5){
					console.log(args);
					var dataGrid = args.dataGrid;
					dataGrid.dataView.beginUpdate();

					var item = args.item;
					var rowTotalDist = 0;
					for (var i = 0; i < this.dispData.sizeNum; i++){
//						rowTotalDist += item["colIndex_" + i + "_field"].distQy; // 対象行合計
						rowTotalDist += this.myNumber(item["colIndex_" + i + "_field"].distQy); // 対象行合計
					}
					var data = dataGrid.getData();
					var field = args.column.field;
					var changedRowIndex = args.item.rowIndex;
					var columnTotalDist = 0;
					var totalRow = {};
					$.each(data, function(){
						if(this.rowIndex == changedRowIndex){
							this.rowTotal.distQy = rowTotalDist;	// 行合計を反映
							dataGrid.dataView.updateItem(this);
						}
						if(this.isItemRow){
//							columnTotalDist += this[field].distQy;	// 列合計
							columnTotalDist += ca_editView.myNumber(this[field].distQy); // 列合計
							return true;
						}
						if(this.totalRow){
							totalRow = this;						// 合計表示行を把握
						}
					});
					totalRow[field].distQy = columnTotalDist;
					// 総合計
					var allDist = 0;
					for (i = 0; i < this.dispData.sizeNum; i++){
//						allDist += totalRow["colIndex_"+ i + "_field"].distQy;
						allDist += this.myNumber(totalRow["colIndex_" + i + "_field"].distQy);
					}
					totalRow.rowTotal.distQy = allDist;
					dataGrid.dataView.updateItem(totalRow);
					dataGrid.dataView.endUpdate();
					$("#ca_totalDistQy_div").find("p.num").text(clutil.comma(allDist));
					return;
				}
			},

			'formatter:hideSize:click': function(e){
				console.log(e);
				this.removeSizeList[e.column.sizeID] = true;
				this.dataGrid.setColumns(this.getColumns( Number(this.$("#ca_bodyTypeID").val()) ));
				return;
			},
			'formatter:showAll:click': function(e){
				console.log(e);
				this.removeSizeList = {};
				this.dataGrid.setColumns(this.getColumns( Number(this.$("#ca_bodyTypeID").val()) ));
				return;
			},
			'footer:addNewRow': function(gridView){
				var data = this.dataGrid.getData();
				var rowIndex = data[data.length -1].rowIndex != null ? data[data.length -1].rowIndex + 1 : 0;
				// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
				var newItem = {
						isItemRow :true,
						rowIndex : rowIndex,
						body : true,
						rowTotal : {
							distQy : 0,
							saleQy : 0,
							stockQy : 0,
						}
				};
				for (var i = 0; i < this.dispData.sizeNum; i++){
					var cell = this.dispData.header.cell[i];
					newItem["colIndex_"+ i + "_field"] = {
							sizeID : cell.sizeID,
							bodyTypeID : cell.bodyTypeID,
							distQy : 0,
							saleQy : 0,
							stockQy: 0,
							colIndex : i,
							rowIndex : rowIndex
					};
				}
				gridView.addNewItem(newItem);
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
				var colTotalDist = [];
				for (var i = 0; i < this.dispData.sizeNum; i++){
					colTotalDist[i] = 0;
				}
				dataGrid.dataView.beginUpdate();
				var data = dataGrid.getData();
				var totalRow = {};
				$.each(data, function(){
					if(this.isItemRow){
						for (var i = 0; i < _this.dispData.sizeNum; i++){
//							colTotalDist[i] += this["colIndex_" + i + "_field"].distQy; // 対象行合計
							colTotalDist[i] += ca_editView.myNumber(this["colIndex_" + i + "_field"].distQy); // 対象行合計
						}
					}
					if(this.totalRow){
						totalRow = this;						// 合計表示行を把握
					}
				});
				// 総合計
				var allDist = 0;
				for (i = 0; i < this.dispData.sizeNum; i++){
					totalRow["colIndex_" + i + "_field"].distQy = colTotalDist[i];
					allDist += colTotalDist[i];
				}
				totalRow.rowTotal.distQy = allDist;
				dataGrid.dataView.updateItem(totalRow);
				dataGrid.dataView.endUpdate();
				$("#ca_totalDistQy_div").find("p.num").text(clutil.comma(allDist));
				return;

				// 各列合計
				// 総合計
				// this.dispDataに適用(必要？)
				// setData()
			}
		},

		myNumber: function(val) {
			var valStr = val.toString();
			if (!$.isNumeric(val) || valStr.substr(0, 1) == "0") {
				return 0;
			} else {
				return parseInt(val, 0);
			}
		},

		// 商品フィルターメソッド
		itemFilter: function(item, args){
			/*カラー商品IDまで確定していたら表示候補とする*/
			// 実績絞込フィルターが設定されていたらフィルタ
			itemInfofilter = false;
			if(!item.body){
				itemInfofilter = true;
			} else if (args.sizeFilter == null){
				itemInfofilter = true;
			}

			if(item.body
					&& args.sizeFilter
					&& args.sizeFilter.sizeID){
				var saleFilter = false,
					stockFilter = false;
				for (var i = 0; i <= this.dispData.sizeNum; i++){
					if(item["colIndex_" + i + "_field"].sizeID == args.sizeFilter.sizeID){
						var targetCell = item["colIndex_" + i + "_field"];
						// 売上数フィルタを判定。
						switch(args.sizeFilter.saleCompType){
						case 0:
							saleFilter = true;
							break;
						case 1:// =
							if (targetCell.saleQy == args.sizeFilter.saleNum){
								saleFilter = true;
							}
							break;
						case 2:// 以上
							if (targetCell.saleQy >= args.sizeFilter.saleNum){
								saleFilter = true;
							}
							break;
						case 3:// 以下
							if (targetCell.saleQy <= args.sizeFilter.saleNum){
								saleFilter = true;
							}
							break;
						}
						// 在庫フィルタ判定
						switch(args.sizeFilter.stockCompType){
						case 0:
							stockFilter = true;
							break;
						case 1:// =
							if (targetCell.stockQy == args.sizeFilter.stockNum){
								stockFilter = true;
							}
							break;
						case 2:// 以上
							if (targetCell.stockQy >= args.sizeFilter.stockNum){
								stockFilter = true;
							}
							break;
						case 3:// 以下
							if (targetCell.stockQy <= args.sizeFilter.stockNum){
								stockFilter = true;
							}
							break;
						}
						return saleFilter && stockFilter;
						break;
					}
				}
			} else {
				return itemInfofilter;
			}
			// 例外:非表示
			console.warn("unexpected filter pattern : [item] " + JSON.stringify(item) + ", [args] " + JSON.stringify(args));
			return false;
		},


		// 商品フィルター変更時
		onItemFilterChange: function(){
			// フィルタ引数更新
			this.dataGrid.dataView.setBodyFilterArgs({
				sizeFilter : clutil.dclone(this.itemFilterData.sizeFilter)
			});
			this.dataGrid.dataView.setBodyFilter(this.itemFilter);
			this.dataGrid.grid.invalidate();
		},

		//フィルタ用定数
		compList : [{id:1, name:"等しい"},{id:2, name:"以上"},{id:3, name:"以下"}],
		uri : "AMDSV0110",
		initialize: function(opt){
			_.bindAll(this, 'getMetadata');
			_.bindAll(this);
			var _this = this;

			// ネタ自動検索してほしくないときに立てる
			this.NotNeedFlag = false;
			this.viewSeed = {}; // 初期化

			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '店舗別振分',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					btn_csv: true,
					buildSubmitReqFunction: this._buildSubmitReqFunction,
						buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$("#ca_headInfoArea"), {
				echoback : $('.cl_echoback')
			});

			clutil.datepicker(this.$("#ca_odrDate"));
			clutil.datepicker(this.$("#ca_dlvDate"));
			clutil.datepicker(this.$("#ca_centerDlvDate"));
			clutil.datepicker(this.$("#ca_tranStDate"));
			clutil.datepicker(this.$("#ca_tranEdDate"));

			// 納品形態
			clutil.cltypeselector(this.$("#ca_dlvType"), amcm_type.AMCM_TYPE_DIST_DLV_ROUTE, 1);

			// 店舗部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
				f_stockmng: true		// 在庫管理フラグ
			});
			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					var d = data[0];
//					_this.$("#ca_storeID")
//					.autocomplete("clAutocompleteItem", {id:d.val, code:d.code, name:d.name});
					_this.fieldRelation.set('clorgcode', {id: d.val, code: d.code, name: d.name, org_typeid: d.org_typeid});
					_this.fieldRelation.reset();

					ca_editView._onStoreChange({id: d.val, code: d.code, name: d.name, org_typeid: d.org_typeid}, null, null);
				}
				_.defer(function(){
					var $tgt = _this.$("#ca_storeID");
					var store = $tgt.autocomplete('clAutocompleteItem');
					if (store != null) {
						_this.validator.clearErrorMsg(_this.$("#ca_storeID"));
					}
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
			this.AMPAV0010Selector.clear = function() {
//				_this.$("#ca_storeID").autocomplete("removeClAutocompleteItem");
				_this.fieldRelation.set('clorgcode', {id: 0, code: "", name: ""});
				_this.fieldRelation.reset();
			};

			// 納品形態
			clutil.cltypeselector(this.$("#ca_dlvType"), amcm_type.AMCM_TYPE_DIST_DLV_ROUTE, 1);

			// option設定
			clutil.cltypeselector2(this.$("#ca_filterSaleCompType"), this.compList, 1, 1);
			clutil.cltypeselector2(this.$("#ca_filterStockCompType"), this.compList, 1, 1);

			// 組織体系
			var orgfunc_id = clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID');
			// 組織改装
			var orglevel_id = clcom.getSysparam(amcm_sysparams.PAR_AMMS_STORE_LEVELID);

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 検索日
				datepicker: {
					el: "#ca_odrDate"
				},
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_itgrpID",
				},
				// サイズパターン選択
				'clsizeptn_byitgrpselector' : {
					el: "#ca_sizePtnID",
					depends: ['itgrp_id'],
				},
				// 店舗オートコンプリート
				clorgcode: {
					el: '#ca_storeID',
					addDepends: ['p_org_id'],
					dependSrc: {
						p_org_id: 'unit_id',
					},
					dependAttrs: {
						f_stockmng: 1
					}
				},
				// 店舗参照ボタン
				AMPAV0010: {
					button: this.$('#ca_btn_store_select'),
					view: this.AMPAV0010Selector,
					showOptions: function(){
						return {
							f_stockmng: 1,
							org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
						};
					}
				},
				// センター
				clorgselector: {
					el: '#ca_centerID',
					provide: 'center_id',
					dependSrc: {
						p_org_id: 'unit_id',
					},
					addDepends: ['p_org_id'],
					dependAttrs: {
						orgfunc_id: orgfunc_id,
						orglevel_id: orglevel_id,
						org_typeid: amcm_type.AMCM_VAL_ORG_KIND_CENTER,
					}
				}
			},{
				dataSource: {
					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			}).done(_.bind(function(){
				this.fieldRelation.fields.clbusunitselector.on("change", function(attr, view, options){
					ca_editView._onUpperSeedChange(attr, view, options);
				});
				this.fieldRelation.fields.clsizeptn_byitgrpselector.on("change", function(attr, view, options){
					ca_editView._onTableSeedChange(attr, view, options);
				});
				this.fieldRelation.fields.clorgcode.on("change", function(attr, view, options) {
					ca_editView._onStoreChange(attr, view, options);
				})
			}, this));

			this.removeSizeList = {};

			// テーブルフィルター用オブジェクト
			this.itemFilterData = {
					sizeFilter : null
			};

			// gridインスタンス
			this.dataGrid = new ClGrid.ClAppGridView({
				el: "#div_table",
				autoHeightDataCount: 7,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ。
			});
			this.dataGrid.getMetadata = this.getMetadata;
			this.listenTo(this.dataGrid, this.gridEvents);

			this.graph = new clutil.Relation.DependGraph()
//			.add({
//				id: 'itgrp',
//				depends: ['unit.id'],
//				onDependChange: function(e){
//					e.model.set('itgrp', {id : 0, code:"", name:""});
//				}
//			})
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
						itgrp_id = itgrp != null ? itgrp.id : 0,
						maker_id = e.model.get('maker.id');

					var fail = function(error){
						e.model.set({
							itemID: 0,
							itemCode: '',
							itemName: '',
							MICodeError : error
						});
					};

					if (makerItgrp_code && maker_id){
						var done = e.async();

						clutil.clmakeritemcode2item({
							maker_code: makerItgrp_code,
							itgrp_id: itgrp_id,
							maker_id: maker_id
						})
							.done(function(data){
								if (data.head.status){
									fail(clmsg[data.head.message]);
									return;
								}

								var rec  = data.rec;
								e.model.set({
									itemID: rec.itemID,
									itemCode: rec.itemCode,
									itemName: rec.itemName,
									MICodeError : null
								});
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

			var deff = $.when(this.fieldRelation);
			return deff.done(_.bind(function(){
				console.log(this.fieldRelation);
//				this.listenTo(this.fieldRelation.fields.clvarietycode, "change", this.onVarietyChange);
			}, this));
		},

		getMetadata: function(rowIndex){
			if (rowIndex >= 0 && rowIndex < this.totalIndex) {
				return {
					rowDelProtect : true,
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
		},

		getUpdReq: function(){
			var data = this.dataGrid.getData();
			return data;
		},

		initUIelement : function(){
			var _this = this;
			clutil.inputlimiter(this.$el);
			this.mdBaseView.initUIElement();
			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				btn: this.$('#ca_csv_uptake'),
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					var sizeRecs = new Array();
					var cellLen = this.dispData ? this.dispData.sizeNum : 0;
					for (var i = 0; i < cellLen; i++){
						var cell= this.dispData.header.cell[i];
						sizeRecs.push({
							bodyTypeID	: cell.bodyTypeID,
							sizeCode	: cell.sizeCode,
							sizeName	: cell.sizeName,
							sizeID		: cell.sizeID,
						});
					}
					// itemRecordsも更新パケットに含める
					//
					var itemRecs = new Array();
					var itemCellRecs = new Array();
					var gridData = this.dataGrid.getData();
					_.each(gridData, function(rowData){
						if(rowData.isItemRow && rowData.color && rowData.color.colorItem && rowData.color.colorItem.id > 0){
							console.log(rowData);
							itemRecs.push({
								_cl_gridRowId : rowData._cl_gridRowId,
								itemID		: rowData.itemID,
								distID		: rowData.distID,
								colorItemID	: rowData.color && rowData.color.colorItem ? rowData.color.colorItem.id : 0,
								colorID		: rowData.color ? rowData.color.id : 0,
								colorCode   : rowData.color ? rowData.color.code : "",
								colorName   : rowData.color ? rowData.color.name : "",
								makerID		: rowData.maker ? rowData.maker.id : 0,
								makerCode   : rowData.maker ? rowData.maker.code : "",
								makerName   : rowData.maker ? rowData.maker.name : "",
								itemCode	: rowData.makerItgrpCode,
								distType	: rowData.distType,
								fDelete		: rowData.isDeleted ? 1 : 0,
							});
							for (var i = 0; i < cellLen; i++){
								var tmp = rowData["colIndex_"+ i +"_field"];
								tmp.colorItemID = rowData.color && rowData.color.colorItem ? rowData.color.colorItem.id : 0;
								// 行削除されていたら更新データから除外
								if (rowData.isDeleted === true) {
									;
								} else {
									itemCellRecs.push(tmp);
								}
							}
						}
					});
					var request = {
						AMDSV0110UpdReq: {
							headRecord: clutil.view2data(this.$("#ca_headInfoArea")),
							sizeRecords: sizeRecs,
							itemRecords: itemRecs,
							itemCellRecords : itemCellRecs
						}
					};

					return {
						resId: 'AMDSV0110',
						data: request
					};
				}, this),

				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(this.validator.valid, this.validator)
				}
			});
			this.opeCSVInputCtrl.on('fail', _.bind(function(data){
				if(data.rspHead.fieldMessages){
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}
				if (data.rspHead.uri){
					clutil.download(data.rspHead.uri);	//CSVダウンロード実行
				}
			}, this));
			this.opeCSVInputCtrl.on('done', function(data){
				var getRsp = data.AMDSV0110GetRsp;
				_this.viewSeed = getRsp;
				clutil.cltypeselector2(_this.$("#ca_filterSizeID"), getRsp.sizeRecords, 1, 1, "sizeID", "sizeName", "sizeCode");
				_this.setDispData(getRsp, "overWrite");
				_this.tableToggle(true);
				_this.renderTable();
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで
			$("#ca_tp_custType").tooltip({html: true});
			$("#ca_tp_emergencyType").tooltip({html: true});
			return this;
		},

		render : function(){
//			this.$("#ca_filter_btn").attr("disabled", true);
			this.mdBaseView.render();
			this.dataGrid.render();
			clutil.inputlimiter(this.$el);
			this.AMPAV0010Selector.render();
//			this.AMPAV0010Selector.clear();

			var now = clcom.getOpeDate();
			var deffYmd = function(ymd, day){
				var yyyy = ymd / 10000;
				var mm = (ymd % 10000) / 100;
				var dd = ymd %100;
				var EdDate = new Date(yyyy, mm -1, dd + day);
				yyyy = EdDate.getFullYear();
				mm = ("0" + (EdDate.getMonth() + 1)).slice(-2);
				dd = ("0" + (EdDate.getDate())).slice(-2);
				return "" + yyyy + mm + dd;
			};
			var stYmd = deffYmd(now, -7);
			var edYmd = deffYmd(now, -1);
			this.$("#ca_tranStDate").datepicker("setIymd", stYmd);
			this.$("#ca_tranEdDate").datepicker("setIymd", edYmd);
			this.defaultTranStDate = stYmd;
			this.defaultTranEdDate = edYmd;
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				this.$("#ca_tgtlink_div").show();
				this.tableToggle(false);
			} else {
				this.$("#ca_tgtlink_div").hide();
				this.mdBaseView.fetch();
			}
			return this;
		},

		/**
		 * 品番別振分リンク押下処理
		 */
		_onLinkItemcodeClick: function(e) {
			var url = clcom.appRoot + '/AMDS/AMDSV0110/AMDSV0110.html';
			var destData;
			destData = {
				// 新規登録
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
			};
			clcom.pushPage(url, destData, null);
		},

		/**
		 * 納品形態セレクタ変更
		 */
		_onDlvTypeChange : function(e){
			var dlvType = parseInt(this.$('#ca_dlvType').val(), 10);
			if (dlvType == amcm_type.AMCM_VAL_DIST_DLV_ROUTE_TC) {
				// TCの場合はセンター、センター納品日は必須
				$("#ca_p_centerID").addClass("required");
				$("#ca_centerID").addClass("cl_required");
				$("#ca_p_centerDlvDate").addClass("required");
				$("#ca_centerDlvDate").addClass("cl_required");
			} else if (dlvType == amcm_type.AMCM_VAL_DIST_DLV_ROUTE_DC) {
				// DCの場合はセンターは必須
				$("#ca_p_centerID").addClass("required");
				$("#ca_centerID").addClass("cl_required");
				$("#ca_p_centerDlvDate").removeClass("required");
				$("#ca_centerDlvDate").removeClass("cl_required");
			} else {
				$("#ca_p_centerID").removeClass("required");
				$("#ca_centerID").removeClass("cl_required");
				$("#ca_p_centerDlvDate").removeClass("required");
				$("#ca_centerDlvDate").removeClass("cl_required");
			}
		},

		/**
		 * サンプルファイルダウンロード
		 */
		_onSampleDLClick: function() {
			var sampleURL = "/public/sample/店舗別振分サンプル.xlsx";
			clutil.download(sampleURL);
		},

		/**
		 * 体型セレクタ変更
		 */
		_onBodyTypeChange : function(){
			var bodyTypeID = parseInt(this.$('#ca_bodyTypeID').val(), 10);
			this.dataGrid.setColumns(this.getColumns(bodyTypeID));
		},

		/**
		 * buildGetReq
		 * 振分データリクエスト作成
		 * @param opeTypeId
		 * @param pgIndex
		 * @returns {___anonymous4997_5047}
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var getReq = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				AMDSV0110GetReq: {
					infoType : AMDSV0110Defs.AMDSV0110_RESULTTYPE_STORE,
					//TODO:店舗とサイズパターン
					srchUnitID : this.options.unitID,
					srchStoreID : this.options.chkData[pgIndex].id,
					srchSizePtnID : this.options.sizePtnID,
					srchOdrDate : this.options.chkData[pgIndex].odrDate,
					srchDlvDate : this.options.chkData[pgIndex].dlvDate,
//					srchBaseStockID: this.options.chkData[pgIndex].distID,
					srchTranStDate: this.defaultTranStDate,
					srchTranEdDate: this.defaultTranEdDate,
					srchItgrpID: this.options.chkData[pgIndex].itgrp_id,
					srchDlvType: this.options.chkData[pgIndex].dlvType,
					srchCenterID : this.options.chkData[pgIndex].centerID,
					srchCenterDlvDate: this.options.chkData[pgIndex].centerDlvDate,
					srchEmergencyType: this.options.chkData[pgIndex].emergencyType,
					srchCustType: this.options.chkData[pgIndex].custType,
					srchStatus: this.options.chkData[pgIndex].status,
				},
			};

			return {
				resId: "AMDSV0110",
				data: getReq
			};
		},

		/**
		 * MT-1493エラー行、警告行クリック時に該当の行までスクロールする処理 yamaguchi
		 */
		_onErrWrnClick: function(args) {
			this.dataGrid.grid.scrollRowIntoView($(args.currentTarget).data('rownum')+1,1);
		},

		/**
		 * GetCompleted
		 * 振分データ取得後
		 * @param args
		 * @param e
		 */
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			this.initView();
			var data = args.data;
			var getRsp = data.AMDSV0110GetRsp;
			this.savedCurRsp = data.AMDSV0110CurGetRsp;		// カレント情報を保存

			switch(args.status){
			case 'OK':
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
					// 複製の場合は、distIDをクリア
					for (var i = 0; i < getRsp.itemRecords.length; i++) {
						var itemobj = getRsp.itemRecords[i];
						itemobj.distID = 0;
					}
					for (var i = 0; i < getRsp.cellRecords.length; i++) {
						var cellobj = getRsp.cellRecords[i];
						cellobj.distID = 0;
					}
				}
				this.data2view(getRsp).always(_.bind(function(){
					// 編集・複製・削除・参照
					if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
						this.$("#ca_unitID," +
								"#ca_itgrpID, " +
								"#ca_sizePtnID, " +
								"#ca_storeID," +
								"#ca_btn_store_select").attr("disabled", true);
						this.$("#ca_unitID").selectpicker("refresh");
						this.$("#ca_sizePtnID").selectpicker("refresh");
						//clutil.viewReadonly($(".ca_odrDate_div"));
						//clutil.viewReadonly($(".ca_dlvDate_div"));
						//clutil.viewReadonly($("#div_dlvType"));
						//clutil.viewReadonly($("#div_centerID"));
						//clutil.viewReadonly($(".ca_centerDlvDate_div"));
						//clutil.viewReadonly($("#div_custType"));
						//clutil.viewReadonly($("#div_emergencyType"));
//						this.$("form > a.cl-file-attach").attr("disabled", true);
						clutil.setFocus(this.$("#ca_odrDate"));
					}
					if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
						// TODO:一部項目初期化
						this.$("#ca_unitID," +
								"#ca_itgrpID, " +
								"#ca_sizePtnID").attr("disabled", true);
						this.$("#ca_unitID").selectpicker("refresh");
						this.$("#ca_sizePtnID").selectpicker("refresh");
						clutil.setFocus(this.$("#ca_storeID"));
//						this.$("form > a.cl-file-attach").attr("disabled", true);
					}
					if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
							||this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
						this.allViewReadonly();
					}
//					clutil.setFocus(this.$("#ca_odrDate"));
					this._onDlvTypeChange();
				}, this));
				break;
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp).always(_.bind(function(){
					this.allViewReadonly();
				},this));
				break;
			default:
			case 'NG':			// その他エラー。
					this.allViewReadonly();
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
						prefix: 'ca_'
					});
					clutil.mediator.trigger("onTicker", data);
				break;
			}
		},

		initView : function(){
			clutil.viewRemoveReadonly(this.$("#ca_headInfoArea"));
			this.itemFilterData = {
					sizeFilter : null
			};
		},

		/**
		 * allViewReadonly
		 * 画面を全て編集不可にする
		 */
		allViewReadonly : function(){
			clutil.viewReadonly(this.$("#ca_headInfoArea"));
			this.$("form > a.cl-file-attach").attr("disabled",true);
			this._tableDisable();
		},

		/**
		 * _onMDSubmitCompleted
		 * 更新終了後
		 * @param args
		 * @param e
		 */
		_onMDSubmitCompleted: function(args, e){
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				document.location = '#';
				this.allViewReadonly();
				// MT-1493 エラー・警告行表示
				var row_alert = [];
				var row_error = [];
				ClGrid.showAlert(row_alert);
				ClGrid.showError(row_error);
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				this.allViewReadonly();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
//				var _this = this;
				var cellMessages = [];
				var gridErrors = [];
				var gridErrors2 = [];
				var gridErrors3 = [];
				_.each(data.rspHead.fieldMessages, function(fm){
					if(fm.field_name == "distQy"){
						gridErrors.push(fm);
					}
					if(fm.field_name == "colorItemID"){
						gridErrors2.push(fm);
					}
					if(fm.field_name == "colorID"
						|| fm.field_name == "itemID"
						|| fm.field_name == "makerID"
						|| fm.field_name == "distType"){
						gridErrors3.push(fm);
					}
				});
				var row_alert = []; //MT-1493 入力エラーの行番号表示機能実装 yamaguchi
				var row_error = [];
				if (gridErrors.length > 0){
					var _this = this;
					var GD = this.dataGrid.getData();
					// フィールドメッセージ毎に対象セルを確認
					_.each(gridErrors, function(fm){
						var num = 1;
						//gridデータから対象セルを探す
						$.each(GD, function(){
							if(this.isItemRow && this.color && this.color.colorItem && this.color.colorItem.id == fm.args[0]){
								//MT-1493 入力エラーの行番号表示機能実装 yamaguchi
								row_error.push({
									num: num
								});

								for (var i = 0; i < _this.dispData.sizeNum; i++){
									if (this["colIndex_" + i + "_field"].sizeID == fm.args[1]){
										cellMessages.push({
											rowId: this._cl_gridRowId,
											colId: "colIndex_" + i + "_field",
											level: 'warn',
//											level: 'error',
											message: clmsg[fm.message]
										});
										break;
									}
								}
							}
							num++;
						});
					});
				}
				if (gridErrors2.length > 0) {
					var GD = this.dataGrid.getData();
					_.each(gridErrors2, function(fm){
						//gridデータから対象セルを探す
						var num = 1;
						$.each(GD, function(){
							if(this.isItemRow && this.color && this.color.colorItem && this.color.colorItem.id == fm.args[0]){
								//MT-1493 入力エラーの行番号表示機能実装 yamaguchi
								row_alert.push({
									num: num
								});

								cellMessages.push({
									rowId: this._cl_gridRowId,
									colId: "makerItgrpCode",
									level: 'warn',
									message: clmsg[fm.message]
								});
							}
							num++;
						});
					});
				}
				if (gridErrors3.length > 0) {
					var GD = this.dataGrid.getData();
					_.each(gridErrors3, function(fm){
						//gridデータから対象セルを探す
						var num = 1;
						for (var i = 0; i < GD.length; i++) {
							var gitem = GD[i];
							if(gitem.isItemRow && gitem.rowIndex == fm.lineno){
								var colId;
								switch (fm.field_name) {
								case "colorID":
									colId = "color";
									break;
								case "itemID":
									colId = "makerItgrpCode";
									break;
								case "makerID":
									colId = "maker";
									break;
								case "distType":
									colId = "distType";
									break;
								default:
									colId = "";
								}
								row_alert.push({
									num: num
								});

								cellMessages.push({
									rowId: gitem._cl_gridRowId,
									colId: colId,
									level: 'warn',
									message: clmsg[fm.message]
								});
							}
							num++;
						}
					});
				}
				ClGrid.showAlert(row_alert);
				ClGrid.showError(row_error);
				//MT-1493 入力エラーの行番号表示機能実装 yamaguchi
				if(!_.isEmpty(cellMessages)){
					this.dataGrid.setCellMessage(cellMessages);
				}
				if(data.rspHead.message == "WDS0004" ||
				   data.rspHead.message == "WDS0005" ||
				   data.rspHead.message == "WDS0006"){
					// 警告を表示
					var updReq = this.view2UpdReq();
					var curUpdReq = this.savedCurRsp;
					var reqHead = {
							opeTypeId : this.options.opeTypeId
					};
					if(this.options.opeTypeId  === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
						reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
					}

					if (this.options.opeTypeId  == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
						updReq = this.viewSeed;
						updReq.itemCellRecords = updReq.cellRecords;
					}
					var reqObj = {
							reqHead : reqHead,
							AMDSV0110UpdReq  : updReq,
							AMDSV0110CurUpdReq: curUpdReq,
					};

					var send = {
							resId : "AMDSV0110",
							data: reqObj,
							confirm: clmsg[data.rspHead.message]
					};

					this.mdBaseView.forceSubmit(send);
				} else {
					var normalFms = [];
					var gridErrors = [];
					_.each(data.rspHead.fieldMessages, function(fm){
						if(fm.field_name == "distQy"){
							gridErrors.push(fm);
						} else {
							normalFms.push(fm);
						}
					});
					if (gridErrors.length > 0){
						this.setGridErrors(gridErrors);
					}
					if (normalFms.length > 0){
						this.validator.setErrorInfoFromSrv(normalFms, {prefix: 'ca_'});
					}
	//				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {prefix: 'ca_'});
					clutil.mediator.trigger("onTicker", data);
				}
				break;
			}
		},

		// フィールドメッセージをセットする
		setGridErrors : function(fms){
			var _this = this;
			var GD = this.dataGrid.getData();
			// フィールドメッセージ毎に対象セルを確認
			_.each(fms, function(fm){
				//gridデータから対象セルを探す
				$.each(GD, function(){
					if(this.isItemRow && this.color && this.color.colorItem && this.color.colorItem.id == fm.args[0]){
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
		 * data2view
		 * 振分IDで検索したデータGetRspからの生成
		 * @param getRsp
		 */
		data2view : function(getRsp){
			var _this = this;
			getRsp.headRecord.unitID = this.options.unitID;
			getRsp.headRecord.sizePtnID = this.options.sizePtnID;
			getRsp.headRecord._view2data_storeID_cn = {
					id : getRsp.headRecord.storeCodeName.id,
					code : getRsp.headRecord.storeCodeName.code,
					name : getRsp.headRecord.storeCodeName.name
			};
			getRsp.headRecord._view2data_itgrpID_cn = {
					id : getRsp.headRecord.itgrpCodeName.id,
					code : getRsp.headRecord.itgrpCodeName.code,
					name : getRsp.headRecord.itgrpCodeName.name
			};
			var headRecord = clutil.dclone(getRsp.headRecord);
//			delete headRecord.centerDlvDate;
//			delete headRecord.centerID;
			delete headRecord.colorCodeName;
			delete headRecord.colorID;
			delete headRecord.colorItemID;
//			delete headRecord.custType;
			delete headRecord.distType;
//			delete headRecord.emergencyType;
			delete headRecord.itemCode;
			delete headRecord.itemID;
			delete headRecord.itemName;
			delete headRecord.itgrpCodeName;
			delete headRecord.makerCodeName;
			delete headRecord.makerID;
			delete headRecord.makerItgrpCode;
			delete headRecord.sizePtnCodeName;
			delete headRecord.storeCodeName;


			// 体型セレクタ
			var dfd = $.Deferred();
			this.NotNeedFlag = true;
			clutil.mediator.once("data2view:done", function(){
				_this.setDispData(getRsp, "overWrite");
				_this.tableToggle(true);
				clutil.cltypeselector2(_this.$("#ca_filterSizeID"), getRsp.sizeRecords, 1, 1, "sizeID", "sizeName", "sizeCode");
				_this.renderTable();
				_this.NotNeedFlag = false;
				dfd.resolve();
			});
			clutil.data2view(this.$("#ca_headInfoArea"), headRecord);
			clutil.clsizerowselector({
				el: '#ca_bodyTypeID',
				dependAttrs: {
					sizePtnID: getRsp.headRecord.sizePtnID
				}
			});
//			isCorrect ? dfd.resolve() : dfd.reject();
			return dfd.promise();
		},

		/**
		 * 表示データ更新
		 */
		setDispData : function(getRsp, mode){
			var _this = this;
			var f_init = false;
			var viewData = null;

			// 表示テーブルデータ
			var tableData = {
					header				: {
						head	: [], // colspanデータ
						cell	: [], // sizetdデータ
					},
					totalData	: {allDistQy : 0, list:[]},	// 合計行情報
					body				: [],								// テーブル描画情報
					dispItem			: [],								// bodyを参照している
					sizePtnID		: getRsp.headRecord.sizePtnID,			// サイズパターンID(表示ネタ確認用)
					storeID			: getRsp.headRecord.storeID,			// 店舗ID(表示ネタ確認用)
					sizeNum : 0
				};
			var hd = tableData.header;
			var bd = tableData.body;
			var td = tableData.totalData;

//			// 初回もしくはメーカー品番が違った場合、マージしない
//			if(this.dispData == null || getRsp.headRecord.sizePtnID != this.dispData.sizePtnID || getRsp.headRecord.storeID != this.dispData.storeID){
//				f_init = true;
//			} else {
//				viewData = this.dataGrid.getData();
//			}
			if(mode == "marge"){
				f_init = false;
				viewData = clutil.dclone(this.dataGrid.getData());
				//実績参照時のみの場合だけ許される技
				getRsp.itemRecords = clutil.dclone(this.viewSeed.itemRecords);
			} else if(mode == "overWrite"){
				f_init = true;
				viewData = null;
			}

			this.dispData = null;


			// テーブルヘッダ情報
			this.maxItem = 0;
			var index = 0; // colIndex
			$.each(getRsp.sizeRecords, function(){
				hd.cell.push({
					sizeName	: this.sizeName,
					sizeCode	: this.sizeCode,
					sizeID		: this.sizeID,
					bodyTypeID	: this.bodyTypeID,
					colIndex	: index,
				});
				index++;
			});
			hd.head.push({colspan:index * 2});
			tableData.sizeNum = index;

			var cellLoopMax = index;
			var cellIndex = 0;
			var rowIndex = 0;
			var colTotalDist = [];
			for(var i = 0; i < cellLoopMax; i++){
				colTotalDist[i] = 0;
			}

			// テーブル商品行データを生成
			$.each(getRsp.itemRecords, function(){
				var list = [];
				var colIndex = 0;

				var totalSaleQy = 0;
				var totalStockQy = 0;
				var totalDistQy = 0;
				// 各店舗sizecellデータを生成する
				for (var i = 0; i < cellLoopMax; i++){
					var sizeData = getRsp.sizeRecords[i];
					var cellData = _this._getCellData(getRsp.cellRecords
							, this.colorItemID
							, this.distID
							, sizeData.bodyTypeID
							, sizeData.sizeID
							, f_init ? null : _this._getField(viewData, this.colorItemID, colIndex)
							);
					list.push({
						itemID		: this.itemID,
						itemCode    : this.itemCode,
						itemName    : this.itemName,
						colorItemID	: this.colorItemID,
						colorID		: this.colorID,
						distID		: this.distID,
						bodyTypeID	: sizeData.bodyTypeID,
						sizeID		: sizeData.sizeID,
						saleQy		: cellData.saleQy,
						stockQy		: cellData.stockQy,
						distQy		: cellData.distQy,
						rowIndex	: rowIndex,
						colIndex	: colIndex
					});
					totalSaleQy += cellData.saleQy;
					totalStockQy += cellData.stockQy;
					totalDistQy += cellData.distQy;
					colTotalDist[colIndex] += cellData.distQy;

					cellIndex++;
					colIndex++;
				}
				this.rowIndex = rowIndex;
				this.totalSaleQy = totalSaleQy;
				this.totalStockQy = totalStockQy;
				this.totalDistQy = totalDistQy;
				this.list = list;
				bd.push(this);
				rowIndex++;
			});

			for (var i = 0; i < cellLoopMax; i++){
				td.list.push({
					colIndex : i,
					distQy : colTotalDist[i]
				});
				td.allDistQy += colTotalDist[i];
			}

			this.dispData = tableData;
			this.dispData.dispItem = this.dispData.body;

		},

		_getField : function(viewData, colorItemID, colIndex){
			var field = null;
			$.each(viewData, function(){
				if(this.isItemRow && this.colorItemID == colorItemID){
					field = this["colIndex_" + colIndex + "_field"];
					return false;
				}
			});
			return field;
		},

		/** sizeに対応するセルデータ取得 **/
		_getCellData : function(cellList, colorItemID, distID, bodyTypeID, sizeID, viewData){
			var cellData = {
					saleQy	: 0,
					stockQy	: 0,
					distQy	: 0
			};
			$.each(cellList, function(){
				if (this.colorItemID == colorItemID && this.distID == distID &&  this.bodyTypeID == bodyTypeID && this.sizeID == sizeID) {
					cellData = this;
					return false;
				}
			});
			if(viewData != null){
				cellData.distQy = viewData.distQy;
			}
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
					cssClass: 'fntss',
//					width: 120,
					minWidth: 150,
					cellType  : {
						type: 'clajaxac',
						validator : "required",
						editorOptions: {
							funcName: 'vendorcode',
							dependAttrs: function(){
								return {
									vendor_typeid: amcm_type.AMCM_VAL_VENDOR_MAKER
								};
							}
						},
						isEditable: function(item){
							return !item.distAbleRow && !item.totalRow;
						}
					}
				},
				{
					id : 'makerItgrpCode',
					name : 'メーカー品番',
					field : 'makerItgrpCode',
					cssClass: 'fnt',
					minWidth: 100,
					cellType  : {
						type: 'text',
						validator: ['required', 'hankaku', 'len:0,10', function(){return this.item.MICodeError;}],
						limit: 'hankaku len:10',
						isEditable: function(item){
							return !item.distAbleRow && !item.totalRow
								&& !!((item && item.maker && item.maker.id)
									&& !_.isEmpty($("#ca_itgrpID").autocomplete("clAutocompleteItem")) && !!Number($("#ca_itgrpID").autocomplete("clAutocompleteItem").id));
						}
					}
				},
				{
					id : 'itemName',
					name : '商品名',
					field : 'itemName',
					cssClass: 'fntss',
					width: 150
				},
				{
					id : 'color',
					name: 'カラー',
					field: 'color',
					width: 125,
					cellType: {
						type: 'clajaxselector',
//						validator	: "selected", TODO:total行回避策
						formatter: function(value, options){
							if (options.dataContext.distAbleRow || options.dataContext.totalRow){
								return "";
							}
							return ClGrid.Formatters.codename(value, options);
						},
						editorOptions: function(item){
							return {
								funcName: 'color',
								dependAttrs: {
									itemID: item.itemID
								}
							};
						},
						isEditable: function(item){
							return !item.distAbleRow && !item.totalRow && !!item.itemID;
						}
					}
				},
				{
					id : 'distType',
					name: '振分方法',
					field		: 'distType',
					minWidth: 120,
					cellType	: {
						type			: 'cltypeselector',
						validator		: "selected",
						editorOptions	: {
							kind			: amcm_type.AMCM_TYPE_FACESTOCK
						},
						isEditable: function(item){
							return !item.distAbleRow && !item.totalRow;
						}
					}
				},
				{
					id : 'rowTotal',
					name : '合計',
					field : 'rowTotal',
					width		: 130,
					cellType: {
						formatter: function(value, options){
							if (options.dataContext.distAbleRow){
								return saleStockDistFormatter({
									col1 : '',
									col2 : clutil.comma(options.dataContext.total)
								});
							}else{
								return totalColFormatter(value, options);
							}
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
					width		: 130,
					sizeColumn: true,
					sizeID: this.sizeID,
					firstSizeCol: i === 0,
					lastSizeCol: i === numSize - 1,
					bodyTypeID: this.bodyTypeID,
					headCellType: {
						formatter: 'myHdrFormatter'
					},
					cellType: {
						editorType: SizeEditor,
						isEditable: function(item){
							return !item.distAbleRow && !item.totalRow;
						},
						formatter: function(value, options){
							if (options.dataContext.distAbleRow) {
								return saleStockDistFormatter({
									col2 : clutil.comma(options.dataContext.total)
								});
							}else if (options.dataContext.totalRow) {
								return totalColFormatter(value, options);
							} else {
								return sizeFormatter(value, options);
							}
						},
						validator: [function(){
							var value = this.item[fieldName];
							if (this.item.isItemRow) {
								return clutil.Validators.checkAll({
									validator: 'required uint:4',
									value: value && value.distQy
								});
							} else {
								return false;
							}
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
			this.totalIndex = 1;

			// 合計 行
			tmp = {
					isItemRow		: false,
					totalRow		: true,
					maker			:  {
						id				: 1,
						name			: "",
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
					distType		: 3,
					rowTotal		: {
						distQy			: td.allDistQy
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
						rowIndex	: this.rowIndex,
						// itemInfo
						maker :{
							name	: this.makerName,
							code	: this.makerCode,
							id		: this.makerID
						},
						itemName	: this.itemName,
						itemID		: this.itemID,
						distID		: this.distID,
						color 			: {
							id				: this.colorID,
							name			: this.colorName,
							code			: this.colorCode,
							colorItem : {
								id : this.colorItemID
							}
						},
						makerItgrpCode : this.itemCode,
						distType	: this.distType,
						body		: true,
						rowTotal 	: {
							distQy		: this.totalDistQy,
							saleQy		: this.totalSaleQy,
							stockQy		: this.totalStockQy
						}
				};
				$.each(this.list, function(){
					tmp["colIndex_" + this.colIndex + "_field"] = {
							distID		: this.distID,
							distQy		: this.distQy,
							saleQy		: this.saleQy,
							stockQy		: this.stockQy,
							colIndex	: this.colIndex,
							bodyTypeID	: this.bodyTypeID,
							sizeID		: this.sizeID
					};
				});
				data.push(tmp);
			});
			if(dispData.body.length == 0
					&& this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				tmp = {
						isItemRow	: true,
						rowIndex	: 0,
						// itemInfo
						maker : {
							name	: "",
							code	: "",
							id		: 0
						},
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
						makerItgrpCode : "",
						distType	: 0,
						body		: true,
						rowTotal 	: {
							distQy		: 0,
							saleQy		: 0,
							stockQy		: 0
						}
				};
				$.each(dispData.header.cell, function(){
					tmp["colIndex_" + this.colIndex + "_field"] = {
							distQy		: 0,
							saleQy		: 0,
							stockQy		: 0,
							colIndex	: this.colIndex,
							bodyTypeID	: this.bodyTypeID,
							sizeID		: this.sizeID
					};
				});
				data.push(tmp);
			}
			this.dataGrid.render().setData({
				gridOptions		: {
					frozenColumn : 5,
					frozenRow : this.totalIndex + 1,
					rowHeight		: 60,
					autoHeight: false		// 高さに対して仮想化するため、インナースクロールを入れる。
				},
				columns			: columns,
				data			: data,
				rowDelToggle	: true,
				graph			: this.graph
			});
			this.$("#ca_totalDistQy_div").find("p.num").text(clutil.comma(td.allDistQy));
		},

		getColumns: function(bodyTypeID){
			var removeSizeList = this.removeSizeList || {};
			var columns = _.filter(this._columns, function(column){
				return !column.sizeColumn ||
				(!bodyTypeID || column.bodyTypeID === bodyTypeID) &&
				!_.has(removeSizeList, column.sizeID);
			});

			return columns;
		},

		/** テーブルクリア **/
		clearTable : function() {
			this.dataGrid.clear();
		},

		/** テーブル編集不可 **/
		_tableDisable : function(){
			this.dataGrid.setEnable(false);
		},

		/**
		 * 登録データ作成
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex) {
			var updReq = {};
			this.validator.clear();
			/*
			 * 無効化チェック
			 */
			if (this.$("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}
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

				/*************
				 * chkstdate 日付のチェック
				 *************/
				if(!this.isCorrectDate()){
					f_error = true;
					return null;
				}

				// gridの入力チェック
				this.dataGrid.clearCellMessage();
				if(!this.dataGrid.isValid()){
					f_error = true;
				}
				if(f_error){
					clutil.mediator.trigger('onTicker', clmsg.cl_echoback);

					//MT-1493 入力エラーの行番号表示機能実装 yamaguchi

					var GridData = this.dataGrid.getData();
					var count = 0;
					for (var i = 1; i < GridData.length; i++) {
//					$.each(GridData, function(){
						GridData[i].rowIndex = i-1;
					}

					var row_error = ClGrid.getErrorRow(this.dataGrid.metadatas.body, GridData, 0);
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
					var row_error = ClGrid.getErrorRow(this.dataGrid.metadatas.body, this.dataGrid.getData(), 0);
					ClGrid.showError(row_error);
					return null;
				}
				if(!this.isCorrectItem(updReq.itemRecords)){
					var row_error = ClGrid.getErrorRow(this.dataGrid.metadatas.body, this.dataGrid.getData(), 0);
					ClGrid.showError(row_error);
					return null;
				}
			}

			var reqHead = {
					opeTypeId : this.options.opeTypeId
			};
			if(this.options.opeTypeId  === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			if (this.options.opeTypeId  == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				updReq = this.viewSeed;
				updReq.itemCellRecords = updReq.cellRecords;
			}
			var curUpdReq = this.savedCurRsp;
			if (curUpdReq != null){
				curUpdReq.itemCellRecords = curUpdReq.cellRecords;
			}
			var reqObj = {
					reqHead: reqHead,
					AMDSV0110UpdReq: updReq,
					AMDSV0110CurUpdReq: curUpdReq	// 検索時のデータ
			};

			return {
				resId : "AMDSV0110",
				data: reqObj
			};
		},


		/**
		 * 表示から更新データ作成
		 */
		view2UpdReq : function(){
			var _this = this;

			var headRec = clutil.view2data(this.$("#ca_headInfoArea"));
			var itemRecs = [];
			var sizeRecs = [];
			var itemCellRecs = [];
			var cellLen = this.dispData ? this.dispData.sizeNum : 0;
			var gridData = this.dataGrid.getData();
			var tmp;
			_.each(gridData, function(rowData){
				if(rowData.isItemRow){
					console.log(rowData);
					itemRecs.push({
						_cl_gridRowId : rowData._cl_gridRowId,
						itemID		: rowData.itemID,
						distID		: rowData.distID,
						colorItemID	: rowData.color && rowData.color.colorItem ? rowData.color.colorItem.id : 0,
						colorID		: rowData.color ? rowData.color.id : 0,
						colorCode   : rowData.color ? rowData.color.code : "",
						colorName   : rowData.color ? rowData.color.name : "",
						makerID		: rowData.maker ? rowData.maker.id : 0,
						makerCode   : rowData.maker ? rowData.maker.code : "",
						makerName   : rowData.maker ? rowData.maker.name : "",
						itemCode	: rowData.makerItgrpCode,
						distType	: rowData.distType,
						fDelete		: rowData.isDeleted ? 1 : 0,
					});
					for (var i = 0; i < cellLen; i++){
						tmp = rowData["colIndex_"+ i +"_field"];
						if (rowData.rowIndex == 0)  {
							var cell= _this.dispData.header.cell[i];
							sizeRecs.push({
								bodyTypeID	: tmp.bodyTypeID,
								sizeCode	: cell.sizeCode,
								sizeName	: cell.sizeName,
								sizeID		: tmp.sizeID,
							});
						}
						tmp.colorItemID = rowData.color && rowData.color.colorItem ? rowData.color.colorItem.id : 0;
						// 行削除されていたら更新データから除外
						if (rowData.isDeleted === true) {
							;
						} else {
							itemCellRecs.push(tmp);
						}
					}
				}
			});
			// this.dataGridから更新データ抽出
			var updReq = {
					headRecord : headRec,
					itemRecords : itemRecs,
					sizeRecords : sizeRecs,
					itemCellRecords : itemCellRecs
			};
			return updReq;
		},

		isCorrectDate : function(){
			var isCorrect = true;
			$headInfo = this.$("#ca_headInfoArea");
			// 運用日<発注日
			if(clutil.dateFormat($headInfo.find("#ca_odrDate").val(), "yyyymmdd") < clcom.getOpeDate()){
				var msg = "発注日は運用日以降の日付を指定してください。";
				this.validator.setErrorMsg($headInfo.find("#ca_odrDate"), msg);
				isCorrect = false;
			}
			// 発注日<納品日
			if(clutil.dateFormat($headInfo.find("#ca_odrDate").val(), "yyyymmdd") >= clutil.dateFormat($headInfo.find("#ca_dlvDate").val(), "yyyymmdd")){
				this.validator.setErrorMsg($headInfo.find("#ca_odrDate"), clmsg.EDS0008);
				this.validator.setErrorMsg($headInfo.find("#ca_dlvDate"), clmsg.EDS0008);
				isCorrect = false;
			}
			// 発注日<センター納品日
			if(clutil.dateFormat($headInfo.find("#ca_centerDlvDate").val(), "yyyymmdd") != ""){
				if(clutil.dateFormat($headInfo.find("#ca_odrDate").val(), "yyyymmdd") >= clutil.dateFormat($headInfo.find("#ca_centerDlvDate").val(), "yyyymmdd")){
					this.validator.setErrorMsg($headInfo.find("#ca_odrDate"), clmsg.EDS0009);
					this.validator.setErrorMsg($headInfo.find("#ca_centerDlvDate"), clmsg.EDS0009);
					isCorrect = false;
				}
				// センター納品日<=納品日
				if(clutil.dateFormat($headInfo.find("#ca_centerDlvDate").val(), "yyyymmdd") > clutil.dateFormat($headInfo.find("#ca_dlvDate").val(), "yyyymmdd")){
					this.validator.setErrorMsg($headInfo.find("#ca_centerDlvDate"), clmsg.EDS0010);
					this.validator.setErrorMsg($headInfo.find("#ca_dlvDate"), clmsg.EDS0010);
					isCorrect = false;
				}
				// 納品形態がTCの場合、センター納品日==納品日であればエラー
				else if (Number($headInfo.find("#ca_dlvType").val()) == amcm_type.AMCM_VAL_DIST_DLV_ROUTE_TC) {
					if(clutil.dateFormat($headInfo.find("#ca_centerDlvDate").val(), "yyyymmdd") == clutil.dateFormat($headInfo.find("#ca_dlvDate").val(), "yyyymmdd")){
						var msg = "納品日とセンター納品日は違う日を設定して下さい。";
						this.validator.setErrorMsg($headInfo.find("#ca_centerDlvDate"), msg);
						this.validator.setErrorMsg($headInfo.find("#ca_dlvDate"), msg);
						isCorrect = false;
					}
				}
			}
			return isCorrect;
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
					if (this.makerID == 0){
						_this.dataGrid.setCellMessage(this._cl_gridRowId, 'maker', "error", "メーカーを指定してください。");
						isDesided = false;
						// return false;
					}
					if (this.itemCode == ""){ // makerItgrpCode check
						_this.dataGrid.setCellMessage(this._cl_gridRowId, 'makerItgrpCode', "error", "メーカー品番を入力してください。");
						isDesided = false;
						// return false;
					}
					if (this.itemID == 0){
						_this.dataGrid.setCellMessage(this._cl_gridRowId, 'makerItgrpCode', "error", "入力された条件に該当する商品がありません。");
						isDesided = false;
						// return false;
					}
					if (this.colorItemID == 0){
						_this.dataGrid.setCellMessage(this._cl_gridRowId, 'color', "error", "カラーを指定してください。");
						isDesided = false;
						// return false;
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
					var makerID = v.makerID;
					var itemCode = v.itemCode;
					var colorItemID = v.colorItemID;
					if (v.fDelete) {
						return;	// 削除フラグが立っているものはチェック対象外
					}
					for(var j = i+1; j < listLen; j++){
						if (list[j].fDelete) {
							continue;	// 削除フラグが立っているものはチェック対象外
						}
						if (list[j].makerID == makerID && list[j].itemCode == itemCode){
							if (list[j].colorItemID == colorItemID){
								_this.dataGrid.setCellMessage(v._cl_gridRowId, 'color', "error", clutil.fmtargs(clmsg.EMS0065, ["対象商品"]));
								_this.dataGrid.setCellMessage(list[j]._cl_gridRowId, 'color', "error", clutil.fmtargs(clmsg.EMS0065, ["対象商品"]));
								clutil.mediator.trigger("onTicker",  "データに重複があります");
								isCorrect = false;
							}
						}
					}
				});
			}
			return isCorrect;
		},

		/**
		 * ヘッダ部上位リレーション変更時
		 */
		_onUpperSeedChange : function(){
			if(this.NotNeedFlag){
				return;
			}
			if(this.dataGrid){
				this.dataGrid.render();
			}
			this.tableToggle(false);
		},

		/**
		 * 店舗変更イベント
		 * @param attr
		 * @param view
		 * @param options
		 */
		_onStoreChange: function(attr, view, options) {
			// 納品タイプ
			console.log(attr);
			var $ca_dlvType = this.$("#ca_dlvType");
			var dlvType = $ca_dlvType.selectpicker('val');

			if (attr != null && attr.org_typeid == amcm_type.AMCM_VAL_ORG_KIND_HQ) {
				var ids = [ amcm_type.AMCM_VAL_DIST_DLV_ROUTE_DC ];
				var typeList = clcom.getTypeList(amcm_type.AMCM_TYPE_DIST_DLV_ROUTE, ids);
				clutil.cltypeselector2($ca_dlvType, typeList, 1, null, 'type_id');
				dlvType = null;
			} else {
				clutil.cltypeselector($ca_dlvType, amcm_type.AMCM_TYPE_DIST_DLV_ROUTE, 1);
				clutil.inputRemoveReadonly($ca_dlvType);
			}
			this._onDlvTypeChange();
			if (dlvType) {
				$ca_dlvType.selectpicker('val', dlvType);
			}
		},

		/**
		 * テーブル元ネタ検索項目の変化により項目を判定し、テーブルネタを検索
		 * @param e
		 */
		_onTableSeedChange : function(attr, view, options){
			if((options && options.changedBy == 'data2view') || this.NotNeedFlag){
				return;
			};

			var headInfo = clutil.view2data(this.$("#ca_headInfoArea"));
			if (headInfo.unitID == 0 || headInfo.itgrpID == 0 || (headInfo.sizePtnID == 0 && !attr.id) || headInfo.sizePtnID == null /*|| !headInfo.storeID || headInfo.storeID == 0*/){
				this.tableToggle(false);
				return;
			};
			if (headInfo.sizePtnID == 0 && attr.id){
				headInfo.sizePtnID = attr.id;
			}
			if(headInfo.sizePtnID){
				this.$("#ca_bodyTypeID").attr("disabled",false);
				clutil.clsizerowselector({
					el: '#ca_bodyTypeID',
					dependAttrs: {
						sizePtnID: headInfo.sizePtnID
					},
				});
			}

			var req = {
				reqHead : {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL //取得用ID
				},
				AMDSV0110GetReq : {
					infoType : AMDSV0110Defs.AMDSV0110_RESULTTYPE_SIZESTORE,
					srchUnitID : headInfo.unitID,
					srchItgrpID : headInfo.itgrpID,
					srchSizePtnID : headInfo.sizePtnID,
					srchStoreID : headInfo.storeID,
					srchTranStDate : this.defaultTranStDate,
					srchTranEdDate : this.defaultTranEdDate
				}
			};

			return clutil.postJSON(this.uri, req).done(_.bind(function(data){
				// 成功時
				this.setDispData(data.AMDSV0110GetRsp, "overWrite");
				this.tableToggle(true);
				clutil.cltypeselector2(this.$("#ca_filterSizeID"), data.AMDSV0110GetRsp.sizeRecords, 1, 1, "sizeID", "sizeName", "sizeCode");
				this.renderTable();
				this.$("#ca_totalDistQy_div").find("p.num").text(clutil.comma(this.dispData.totalData.allDistQy));
			},this)).fail(function(data){
				clutil.mediator.trigger("onTicker", data);
			});

		},

		// TODO:データ整理
		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
//			var rec = data.AMDSV0110GetRsp;
//			delete rec.sizeRecords;
//			delete rec.storeInfoRecords;
//			delete rec.itemRecords;
//			delete rec.rankCellRecords;
//			delete rec.storeCellRecords;
//			delete rec.itemCellRecords;
//			delete rec.existCellRecords;
//			delete rec.newCellRecords;
//			delete rec.urbanCellRecords;
			return data;
		},

		/**
		 * 実績参照ボタンクリック
		 */
		_onRefStockClick : function(){
			var _this = this;
			// 日付チェック
			if(!this.validator.valid({$el:this.$("#ca_ref_term")})){
				return;
			}
			if(!this.validator.valid()){
				return;
			}
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_tranStDate',
				edval : 'ca_tranEdDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				return;
			}
			var term = clutil.view2data(this.$("#ca_ref_term"));
			if (term.tranEdDate > clcom.getOpeDate()){
				clutil.mediator.trigger("onTicker", "実績参照期間は過去日を指定してください。");
				return;
			}
			var headInfo = clutil.view2data(this.$("#ca_headInfoArea"));

			// 行にある商品リストも投げる
			var gridData = this.dataGrid.getData();
			var tmp = {};
			var itemRecs = [];
			var itemCellRecs = [];
			var cellLen = this.dispData.sizeNum;
			_.each(gridData, function(rowData){
				if(rowData.isItemRow){
					itemRecs.push({
						_cl_gridRowId : rowData._cl_gridRowId,
						itemID		: rowData.itemID,
						itemName	: rowData.itemName,
						colorItemID	: rowData.color && rowData.color.colorItem ? rowData.color.colorItem.id : 0,
						colorID		: rowData.color ? rowData.color.id : 0,
						colorCode	: rowData.color ? rowData.color.code : "",
						colorName	: rowData.color ? rowData.color.name : "",
						makerID		: rowData.maker ? rowData.maker.id : 0,
						makerName   : rowData.maker ? rowData.maker.name : "",
						itemCode	: rowData.makerItgrpCode,
						distType	: rowData.distType
					});
					for (var i = 0; i < cellLen; i++){
						tmp = rowData["colIndex_"+ i +"_field"];
						tmp.colorItemID = rowData.color && rowData.color.colorItem ? rowData.color.colorItem.id : 0;
						itemCellRecs.push(tmp);
					}
				}
			});
			if (itemRecs.length == 0){
				clutil.mediator.trigger("onTicker", "参照対象の商品を少なくとも一つはカラーまで指定してください。");
				return;
			}
			var targetItemRecs = _.filter(itemRecs, function(data){return !!data.colorID;});
			var targetItemCellRecs = _.filter(itemCellRecs, function(data){return !!data.colorItemID;});
			if (targetItemRecs.length == 0){
				clutil.mediator.trigger("onTicker", "参照対象の商品を少なくとも一つはカラーまで指定してください。");
				return;
			}
			if (targetItemRecs.length > 1){
				var isCorrect = true;
				$.each(targetItemRecs, function(i,v){
					var colorItemID = this.colorItemID;
					for(var j = i+1; j < targetItemRecs.length; j++){
						if(targetItemRecs[j].colorItemID == colorItemID){
							_this.dataGrid.setCellMessage(this._cl_gridRowId, 'color', "error", clutil.fmtargs(clmsg.EMS0065, ["対象商品"]));
							_this.dataGrid.setCellMessage(targetItemRecs[j]._cl_gridRowId, 'color', "error", clutil.fmtargs(clmsg.EMS0065, ["対象商品"]));
							clutil.mediator.trigger("onTicker",  "データに重複があります");
							isCorrect = false;
						}
					}
				});
				if(!isCorrect){
					return;
				}
			}
			var req = {
				reqHead : {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				AMDSV0110GetReq : {
					infoType		: AMDSV0110Defs.AMDSV0110_RESULTTYPE_SALESTOCKST,
					srchUnitID		: headInfo.unitID,
					srchItgrpID		: headInfo.itgrpID,
					srchSizePtnID	: headInfo.sizePtnID,
					srchStoreID		: headInfo.storeID,
					srchTranStDate	: term.tranStDate,
					srchTranEdDate	: term.tranEdDate
				},
				AMDSV0110UpdReq : {
					itemRecords : targetItemRecs,
					itemCellRecords : targetItemCellRecs // FIXME:いらんかも
				}
			};
			return clutil.postJSON(this.uri, req).done(_.bind(function(data){
				// 成功時
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
						|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					this.viewSeed.itemRecords = itemRecs; // 現在テーブル上にあるitemについて再構成する
				}
				this.setDispData(data.AMDSV0110GetRsp, "marge");
				// テーブルフィルター用オブジェクト初期化
				this.itemFilterData = {
						sizeFilter : null
				};
				this.renderTable();
				this.$("#ca_totalDistQy_div").find("p.num").text(clutil.comma(this.dispData.totalData.allDistQy));
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					this.allViewReadonly();
				}
			},this)).fail(function(data){
				clutil.mediator.trigger("onTicker", data);
			});
		},

		// 絞込ボタンクリック
		_onFilterBtnClick : function(){
			this.validator.clear(this.$("#ca_filter_div"));
			var fc = clutil.view2data(this.$("#ca_filter_div"));
			fc.filterSizeID = Number(fc.filterSizeID);
			fc.filterSaleCompType = Number(fc.filterSaleCompType);
			fc.filterStockCompType = Number(fc.filterStockCompType);
			var f_error = false;
			if(!fc.filterSizeID && (fc.filterSaleCompType || fc.filterStockCompType)){
				this.validator.setErrorMsg($("#ca_filterSizeID"), "絞込対象サイズを指定してください");
				f_error = true;
			}
			if(fc.filterSaleCompType && fc.filterSaleNum === ""){
				this.validator.setErrorMsg($("#ca_filterSaleNum"), "絞込条件を指定してください");
				f_error = true;
			}
			if(fc.filterStockCompType && fc.filterStockNum === ""){
				this.validator.setErrorMsg($("#ca_filterStockNum"), "絞込条件を指定してください");
				f_error = true;
			}
			if(f_error){
				return;
			} else {
				this.validator.clear(this.$("#ca_filter_div"));
			}
			/** sizeFilter: {sizeID, saleNum, saleCompType, stockCompType, stockNum} **/
			/* isStoreRow:trueな行について対象のsizeID列のsaleQy, stockQyと比較し、絞込 */
			/* 以下,同等,以上プルダウンが選択されていたら絞込比較する */
			/* ↑その際、絞込数未入力ならエラー */
			// データ読み込みのタイミングでフィルタ初期化
			this.itemFilterData.sizeFilter = {
					sizeID : fc.filterSizeID,
					saleNum : fc.filterSaleNum,
					stockNum : fc.filterStockNum,
					saleCompType : fc.filterSaleCompType,
					stockCompType : fc.filterStockCompType
			};
			if(!fc.filterSaleCompType && !fc.filterStockCompType){
				this.itemFilterData.sizeFilter = null;
			}
			this.onItemFilterChange();
		},

		/** テーブル表示トグル **/
		tableToggle : function(flag){
			if(flag){
				this.$("#ca_tableInfoArea").show();
			} else {
				this.$("#ca_tableInfoArea").hide();
//				$("#ca_sizePtnID").html('');
//				$("#ca_sizePtnID").html('').selectpicker().selectpicker('refresh');
				$('#ca_sizePtnID').selectpicker('val', 0);
				this.$("#ca_sizePtnID").selectpicker("refresh");
				this.clearTable();
			}
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
			var defer = clutil.postDLJSON('AMDSV0110', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * ダウンロード条件をつくる
		 */
		buildReq: function(){
			var updReq = this.view2UpdReq();

			// 検索条件
			var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					AMDSV0110GetReq: {
					},
					AMDSV0110UpdReq: updReq
			};
			return req;
		},

		_eof : "end of mainView"
	});



	// 初期データを取る
	clutil.getIniJSON(null, null).done(_.bind(function(data, dataType){
		ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
		//初期フォーカス
		var $tgt = null;
		if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
			$tgt = $("#ca_itgrpID");
		}
		else{
			$tgt = $("#ca_unitID");
		}
		clutil.setFocus($tgt);
	}, this)).fail(_.bind(function(data){
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHeader: data.rspHeader
		});
	}, this));
});
