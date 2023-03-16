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

	var rankHdrFormatter = function(value, options){
//		console.log(options);
		var label = '&nbsp;';
		if (options.cell === 3){
			label = 'サイズ';
		}else if(options.grid.getColumns().length - 1 === options.cell){
			label = '<div class="viewAll">すべて表示</div>';
		}
		var template = Marionette.TemplateCache.get('#RankHdrCell');

		return template({
			label: label,
			value: value
		});
	};
	rankHdrFormatter.initialize = function(grid, dataView, vent){
		grid.onClick.subscribe(function(e, args){
			var $target = $(e.target);
			var ev;
			if($target.is(".deleteRow .viewAll")){
				if(args.grid.getColumns().length > 4){
					ev = ClGrid.Formatters.buildEvent(args, grid, dataView);
					vent.trigger("formatter:hideRankSize:click", ev);
				} else {
					// これ以上短くしない
				};
			} else if ($target.is(".viewAll")){
				ev = ClGrid.Formatters.buildEvent(args, grid, dataView);
				vent.trigger("formatter:showRankAll:click", ev);
			}
		});
	};
	ClGrid.Formatters.rankHdrFormatter = rankHdrFormatter;

	var storeHdrFormatter = function(value, options){
//		console.log(options);
		var label = '&nbsp;';
		if (options.cell === 3){
			label = 'サイズ';
		}else if(options.grid.getColumns().length - 2 === options.cell){
			label = '<div class="viewAll">すべて表示</div>';
		}
		var template = Marionette.TemplateCache.get('#StoreHdrCell');

		return template({
			label: label,
			value: value
		});
	};
	storeHdrFormatter.initialize = function(grid, dataView, vent){
		grid.onClick.subscribe(function(e, args){
			var $target = $(e.target);
			var ev;
			if($target.is(".deleteRow .viewAll")){
				if(args.grid.getColumns().length > 4){
					ev = ClGrid.Formatters.buildEvent(args, grid, dataView);
					vent.trigger("formatter:hideStoreSize:click", ev);
				} else {
					// これ以上短くしない
				};
			} else if ($target.is(".viewAll")){
				ev = ClGrid.Formatters.buildEvent(args, grid, dataView);
				vent.trigger("formatter:showStoreAll:click", ev);
			}
		});
	};
	ClGrid.Formatters.storeHdrFormatter = storeHdrFormatter;

	var RankSizeEditor = Marionette.ItemView.extend({
		template: '#RankSizeEditor',

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

	var StoreSizeEditor = Marionette.ItemView.extend({
		template: '#StoreSizeEditor',

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

	var rankSizeFormatter = function(value, options){
		// jshint unused: false
		var template = Marionette.TemplateCache.get('#RankSizeEditor'),
			data = options.dataContext[options.columnDef.id] || {};
		return template(data);
	};

	var storeSizeFormatter = function(value, options){
		// jshint unused: false
		var template = Marionette.TemplateCache.get('#StoreSizeEditor'),
			data = options.dataContext[options.columnDef.id] || {};
		return template(data);
	};

	var totalColFormatter = function(value, options){
		// jshint unused: false
		var template = Marionette.TemplateCache.get('#TotalColFormatter'),
			data = options.dataContext[options.columnDef.id] || {};
		return template(value);
	};

	var baseStockQyFormatter = function(data){
		// jshint unused: false
		var template = Marionette.TemplateCache.get('#BaseStockQyFormatter');
		return template(data);
	};

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		validator : null,

		events: {
			'keyup #ca_fromWeek'			: '_keyupFromWeek',
			'keyup #ca_toWeek'				: '_keyupToWeek',
			'click #ca_link_store'			:	'_onLinkStoreClick',	// 店舗別振分リンク押下時
			'change #ca_unitID'				:	'_onUnitChange',		// 事業ユニットが変更された
			'change input[name="ca_codeType"]:radio'	:	'_onCodeTypeChange',	// 品番ラジオボタン変更
			'blur #ca_itemCode'	 		:	'_onItemCodeChange',	// メーカー品番が変更された
			'change input[name="ca_autoType"]:radio'	:	'_onAutoTypeChange',		// 自動停止有無ラジオボタン変更
			'change #ca_rankBodyShapeID'		:	'_onRankBodyShapeChanged',	// 体型が変更された
			'click #ca_sample_download'		:	'_onSampleDLClick',		// ExcelサンプルDLボタン押下
			'click #ca_copy'				:	'_onCopyClick',			// 基準在庫パターンから複製
			'change input[name="ca_upLimitStockType"]:radio'	:	'_onupLimitStockTypeChange',	//上限在庫数設定有無が変更された ※MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 2018/12/25
//			'change .cl_autoStopQy'			:	'_onAutoStopQyChange',	// 「自動振分停止在庫数」変更
			'change #ca_storeBodyShapeID'	:	'_onStoreBodyShapeChanged',	// 体型が変更された(店別)
			'click .cl_download'			:	'_onCSVClick',			// Excelデータ出力押下
			"click .cl_errWrnRowClick"	: "_onErrWrnClick",			// MT-1493 エラー・警告行クリック yamaguchi
		},
        _keyupFromWeek: function(ev){
            var val = ev.currentTarget.value;
            if(val.length === 0){
                console.info('_keyupFromWeek: ', ev);
                this.fromYearWeek.setValue();
            }
        },
        _keyupToWeek: function(ev){
            var val = ev.currentTarget.value;
            if(val.length === 0){
                console.info('_keyupToWeek: ', ev);
                this.toYearWeek.setValue();
            }
        },

		// grid発のイベント
		rankGridEvents: {
			// cell 内容変更
			"cell:change" : function(args){
//				console.log('*** cell:change', args);
				if (args.item.isRankRow && args.cell >= 3){
					var rankDataGrid = args.dataGrid;
					rankDataGrid.dataView.beginUpdate();

					var item = args.item;
					var colIndex = args.cell - 3;
					var rowIndex = args.item.rowIndex;
					// 基準在庫数保存
					var baseStockQy = item["colIndex_" + colIndex + "_field"].baseStockQy;
					this.rankData.body[rowIndex].list[colIndex].baseStockQy = baseStockQy;

					var rowTotalBaseStock = 0;
					for (var i = 0; i < this.rankData.sizeNum; i++){
//						rowTotalBaseStock += item["colIndex_" + i + "_field"].baseStockQy; // 対象行合計
						rowTotalBaseStock += this.myNumber(item["colIndex_" + i + "_field"].baseStockQy); // 対象行合計
					}
					console.log(rowTotalBaseStock);
					var rankData = rankDataGrid.getData();
					var rowData = rankData[rowIndex];
					rowData.rowTotal.baseStockQy = rowTotalBaseStock;	// 行合計を反映
					rankDataGrid.dataView.updateItem(rowData);
					rankDataGrid.dataView.endUpdate();

					// 参照基準在庫数更新・表示
					var storeData = this.storeDataGrid.getData();
					var storeLen = storeData.length;
//					console.log('*** storeDataGrid:', storeData);
//					console.log('*** storeData:', this.storeData);
					if (storeLen > 1) {
						var cellLen = this.storeData.sizeNum;
						var storeRecords = [];
						var sizeRecords = [];
						var storeCellRecords = [];
						for (var i = 0; i < cellLen; i++){
							var tmp = item["colIndex_"+ i +"_field"];
							sizeRecords.push({
								sizeID		: tmp.sizeID,
								sizeCode	: tmp.sizeCode,
								sizeName	: tmp.sizeName,
								bodyShapeID	: tmp.bodyShapeID,
								autoStopQy	: tmp.autoStopQy,
							});
						}
						_.each(storeData, function(rowData){
							if(rowData.isStoreRow){
								storeRecords.push({
									_cl_gridRowId : rowData._cl_gridRowId,
									rankID		: rowData.rankID,
									rankCode	: rowData.rankCode,
									rankName	: rowData.rankName,
									storeID		: rowData.store.id,
									storeCode	: rowData.store.code,
									storeName	: rowData.store.name,
									isDeleted	: rowData.isDeleted,
								});
								for (var i = 0; i < cellLen; i++){
									var tmp = rowData["colIndex_"+ i +"_field"];
//									var refQy = tmp.refQy;
									var refQy = mainView.myNumber(tmp.refQy);
									if (rowData.rankID == item.rankID && i == colIndex) {
										// 店舗ランクの基準在庫数を参照基準在庫数に設定
//										refQy = baseStockQy;
										refQy = mainView.myNumber(baseStockQy);
									}
									storeCellRecords.push({
										storeID		: rowData.store.id,
										refQy		: refQy,
										baseStockQy	: tmp.baseStockQy,
										sizeID		: tmp.sizeID,
									});
								}
							}
						});
						// 店別基準在庫設定再表示
						var viewData = {
							storeRecords : storeRecords,
							sizeRecords : sizeRecords,
							storeCellRecords : storeCellRecords,
						};
//						console.log(viewData);
						this.setStoreData(viewData);
						this.renderStoreTable(true);
					}

					return;
				}
			},
			'formatter:hideRankSize:click': function(e){
				console.log(e);
				this.removeRankSizeList[e.column.sizeID] = true;
				this.rankDataGrid.setColumns(this.getRankColumns(Number(this.$("#ca_rankBodyShapeID").val())));
				return;
			},
			'formatter:showRankAll:click': function(e){
				this.removeRankSizeList = {};
				this.rankDataGrid.setColumns(this.getRankColumns(Number(this.$("#ca_rankBodyShapeID").val())));
				return;
			}
		},
		storeGridEvents: {
			// cell 内容変更
			"cell:change" : function(args){
//				console.log('*** cell:change', args);
				if (args.cell === 1){
					console.log('*** cell:change', args);
					this.storeDataGrid.isValidCell(args.item, 'store');
					return;
				} else if (args.item.isStoreRow && args.cell >= 3){
					// 基準在庫数更新・表示
//					console.log(args);
					var storeDataGrid = args.dataGrid;
					storeDataGrid.dataView.beginUpdate();

					var item = args.item;
					var rowTotalBaseStock = 0;
					for (var i = 0; i < this.storeData.sizeNum; i++){
//						rowTotalBaseStock += item["colIndex_" + i + "_field"].baseStockQy; // 対象行合計
						rowTotalBaseStock += this.myNumber(item["colIndex_" + i + "_field"].baseStockQy); // 対象行合計
					}
					var data = storeDataGrid.getData();
					var field = args.column.field;
					var changedRowIndex = args.item.rowIndex;
					var columnTotalBaseStock = 0;
					var totalRow = {};
					$.each(data, function(){
						if(this.rowIndex == changedRowIndex){
							this.rowTotal.baseStockQy = rowTotalBaseStock;	// 行合計を反映
							storeDataGrid.dataView.updateItem(this);
						}
						if(this.isStoreRow){
//							columnTotalBaseStock += this[field].baseStockQy; // 対象行合計
							columnTotalBaseStock += mainView.myNumber(this[field].baseStockQy); // 列合計
							return true;
						}
						if(this.totalRow){
							totalRow = this;						// 合計表示行を把握
						}
					});
					totalRow[field].baseStockQy = columnTotalBaseStock;
					// 総合計
					var allBaseStock = 0;
					for (i = 0; i < this.storeData.sizeNum; i++){
//						allBaseStock += totalRow["colIndex_" + i + "_field"].baseStockQy;
						allBaseStock += this.myNumber(totalRow["colIndex_" + i + "_field"].baseStockQy);
					}
					totalRow.rowTotal.baseStockQy = allBaseStock;
					storeDataGrid.dataView.updateItem(totalRow);
					storeDataGrid.dataView.endUpdate();

					return;
				}
			},
			'formatter:hideStoreSize:click': function(e){
//				console.log(e);
				this.removeStoreSizeList[e.column.sizeID] = true;
				this.storeDataGrid.setColumns(this.getStoreColumns(Number(this.$("#ca_storeBodyShapeID").val())));
				return;
			},
			'formatter:showStoreAll:click': function(e){
//				console.log(e);
				this.removeStoreSizeList = {};
				this.storeDataGrid.setColumns(this.getStoreColumns(Number(this.$("#ca_storeBodyShapeID").val())));
				return;
			},
			'footer:addNewRow': function(gridView){
				var data = this.storeDataGrid.getData();
				var rowIndex = data[data.length -1].rowIndex != null ? data[data.length -1].rowIndex + 1 : 0;
				// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
				var newItem = {
					isStoreRow :true,
					totalRow : false,
					rowIndex : rowIndex,
					rankID : 0,
					rankCode : '',
					rankName : '',
					rank : '',
					store : {
						id : 0,
						code : '',
						name : '',
					},
					rowTotal : {
						baseStockQy : 0,
					},
					body : true,
				};
				for (var i = 0; i < this.storeData.sizeNum; i++){
					var cell = this.storeData.header.cell[i];
					newItem["colIndex_"+ i + "_field"] = {
						sizeID : cell.sizeID,
						bodyShapeID : cell.bodyShapeID,
						refQy : 0,
						baseStockQy: 0,
						colIndex : i,
					};
				}
				gridView.addNewItem(newItem);
			},
			'row:delToggle' : function(args){
				var _this = this;
				console.log(args);
				var delItem = args.item;
				var storeDataGrid = args.dataGrid;
				console.log("deleted delItem:" + JSON.stringify(delItem));
				args.item.isDeleted = args.isDeleted;
				//総合計再計算
				// 各行計算
				var colTotalBaseStock = [];
				for (var i = 0; i < this.storeData.sizeNum; i++){
					colTotalBaseStock[i] = 0;
				}
				storeDataGrid.dataView.beginUpdate();
				var data = storeDataGrid.getData();
				var totalRow = {};
				$.each(data, function(){
					if(this.isStoreRow){
						for (var i = 0; i < _this.storeData.sizeNum; i++){
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
				for (i = 0; i < this.storeData.sizeNum; i++){
					totalRow["colIndex_" + i + "_field"].baseStockQy = colTotalBaseStock[i];
					allBaseStock += colTotalBaseStock[i];
				}
				totalRow.rowTotal.baseStockQy = allBaseStock;
				storeDataGrid.dataView.updateItem(totalRow);
				storeDataGrid.dataView.endUpdate();
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
					title: '品番別基準在庫',
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
//			clutil.mediator.on('onOperation', this._doOpeAction);	// CSV出力用

			// onOperation イベントを発火するかどうか
			this.onOperationSilent = (opt && opt.onOperationSilent);

			// Fieldlimit
			clutil.cltxtFieldLimit($("#ca_itemCode"));

			// ツールチップ
			$("#ca_tp_week").tooltip({html: true});
			$("#ca_tp_ptn").tooltip({html: true});
			//MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 ここから 2018/12/25
			$("#ca_tp_upLimitStockNum").tooltip({html: true});
			//ここまで

			//MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 ここから 2018/12/25
			//追加した要素の初期化をここでやる
			clutil.inputReadonly($('input[name="ca_upLimitStockType"]'));
			var radio = $("input:radio[name=ca_upLimitStockType]:checked");
			if(Number(radio.val())==1){
				$("#ca_upLimitStockNum_div").addClass('dispn');
			}
			//ここまで

			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLmakerItemCodeCompleted', this._onCLmakerItemCodeComplete);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			this.removeRankSizeList = {};
			this.removeStoreSizeList = {};

			// gridインスタンス
			this.rankDataGrid = new ClGrid.ClAppGridView({
				el: "#ca_rank_datagrid",
				delRowBtn :false,
				footerNewRowBtn : false
			});
			this.listenTo(this.rankDataGrid, this.rankGridEvents);

			this.storeDataGrid = new ClGrid.ClAppGridView({
				el: '#ca_store_datagrid',
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ。
			});
			this.storeDataGrid.getMetadata = this.getMetadata;
			this.listenTo(this.storeDataGrid, this.storeGridEvents);

			this.graph = new clutil.Relation.DependGraph()
			.add({
				id: 'store',
				depends: ['unit.id'],
				onDependChange: function(e){
					e.model.set('store', {id : 0, code:"", name:""});
				}
			})
			.add({
				id: 'rank',
				depends: ['store.id'],
				onDependChange: function(e){
					console.log(e.item.rowIndex);
					// 店舗・店舗ランク情報取得
					var store_id = e.model.get('store.id'),
					baseStockPtn = $('#ca_baseStockPtnID').autocomplete('clAutocompleteItem'),
					rankPtn = $('#ca_rankPtnID').autocomplete('clAutocompleteItem');
					if (!baseStockPtn && !rankPtn) {
						var msg = '基準在庫パターン、又は、店舗ランクパターンを指定して下さい。';
						mainView.validator.setErrorMsg($('#ca_baseStockPtnID'), msg);
						mainView.validator.setErrorMsg($('#ca_rankPtnID'), msg);
						return;
					}
					var baseStockPtnID = (baseStockPtn) ? baseStockPtn.id : 0;
					var rankPtnID = (rankPtn) ? rankPtn.id : 0;
					var req = mainView.buildReq(AMDSV0060Req.AMDSV0060_TYPE_STORE2RANK, store_id, baseStockPtnID, rankPtnID);

					var fail = function(error){
						e.model.set({
							rankID: 0,
							rankCode: '',
							rankName: '',
							MICodeError : error
						});
					};

					if (store_id && req){
						var done = e.async();

						// 店舗・店舗ランク情報取得
						mainView.doStoreInfo(req)
						.done(function(data){
							if (data.rspHead.status){
								fail(clmsg[data.rspHead.message]);
								return;
							}

							var rec  = data.AMDSV0060GetRsp.storeRecords;
							var tmp = {
								rankID: rec[0].rankID,
								rankCode: rec[0].rankCode,
								rankName: rec[0].rankName,
								rank : rec[0].rankCode + ':' + rec[0].rankName,
								MICodeError : null
							};
							// 参照基準在庫数取得
							var colTotalRef = [];
							for (var i = 0; i < mainView.storeData.sizeNum; i++){
								colTotalRef[i] = 0; // 対象行合計
							}
							var rankData = null;
							$.each(mainView.rankData.body, function(i){
								if (this.rankID == rec[0].rankID) {
									rankData = this.list;
									return false;
								}
							});
							if (!rankData) {
								return;
							}
							$.each(rankData, function(i){
								var cell = mainView.storeData.header.cell[i];
								tmp["colIndex_" + i + "_field"] = {
									refQy : this.baseStockQy,
									baseStockQy : 0,
									sizeID : cell.sizeID,
									bodyShapeID : cell.bodyShapeID,
									colIndex : i
								};
								colTotalRef[i] += this.baseStockQy;
							});
							e.model.set(tmp);

							// 各行計算
							var storeDataGrid = e.dataGrid;
							storeDataGrid.dataView.beginUpdate();
							var storeData = storeDataGrid.getData();
							var totalRow = {};
							$.each(storeData, function(){
								if(this.isStoreRow && this.store.id != store_id){
									for (var i = 0; i < mainView.storeData.sizeNum; i++){
										colTotalRef[i] += this["colIndex_" + i + "_field"].refQy; // 対象行合計
									}
								}
								if(this.totalRow){
									totalRow = this;						// 合計表示行を把握
								}
							});
							for (i = 0; i < mainView.storeData.sizeNum; i++){
								totalRow["colIndex_" + i + "_field"].refQy = colTotalRef[i];
							}
							storeDataGrid.dataView.updateItem(totalRow);
							storeDataGrid.dataView.endUpdate();
						})
						.fail(function(){fail('失敗');})
						.always(done);
					} else {
						fail();
					}
				}
			});
			return this;
		},

		getMetadata: function(rowIndex){
			if (rowIndex == 0) {
				return {
					rowDelProtect : true,
					cssClasses: 'reference'
				};
			}
		},

		getRankUpdReq: function(){
			var data = this.rankDataGrid.getData();
			return data;
		},

		getStoreUpdReq: function(){
			var data = this.storeDataGrid.getData();
			return data;
		},

		initUIElement: function(){
			var _this = this;
			this.mdBaseView.initUIElement();

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					var baseStockRecord = clutil.view2data(this.$("#ca_base_form"));
					if (baseStockRecord.baseStockID == "") {
						baseStockRecord.baseStockID = 0;
					}
					baseStockRecord.unitCodeName = {
						id: baseStockRecord.unitID,
						code: '',
						name: ''
					};
					var itgrp = _.pick(baseStockRecord._view2data_itgrpID_cn, 'id', 'code', 'name');
					if (baseStockRecord._view2data_makerID_cn) {
						var maker = _.pick(baseStockRecord._view2data_makerID_cn, 'id', 'code', 'name');
						baseStockRecord.makerCodeName = {
							id : maker.id,
							code : maker.code,
							name : maker.name,
						};
					}

					baseStockRecord.itgrpCodeName = {
						id: itgrp.id,
						code: itgrp.code,
						name: itgrp.name
					};
					baseStockRecord.itemCodeName = {
						id: baseStockRecord.itemID,
						code: baseStockRecord.itemCode,
						name: baseStockRecord.itemName
					};
					var rankRecord = clutil.view2data(this.$('#ca_rank_form'));
					if (rankRecord._view2data_baseStockPtnID_cn) {
						var baseStockPtn = _.pick(rankRecord._view2data_baseStockPtnID_cn, 'id', 'code', 'name');
						baseStockRecord.baseStockPtnCodeName = {
							id : baseStockPtn.id,
							code : baseStockPtn.code,
							name : baseStockPtn.name,
						};
					}
					if (rankRecord._view2data_rankPtnID_cn) {
						var rankPtn = _.pick(rankRecord._view2data_rankPtnID_cn, 'id', 'code', 'name');
						baseStockRecord.rankPtnCodeName = {
							id : rankPtn.id,
							code : rankPtn.code,
							name : rankPtn.name,
						};
					}
					delete baseStockRecord.unitID;
					delete baseStockRecord._view2data_itgrpID_cn;
					delete baseStockRecord._view2data_makerID_cn;
					delete baseStockRecord.itemID;
					delete baseStockRecord.itemCode;
					delete baseStockRecord.itemName;
					// リクエストデータ本体
					var request = {
						infoType: AMDSV0060Req.AMDSV0060_TYPE_ITEM,		// 取得情報フラグ(品番別)
						AMDSV0060UpdReq: {
							baseStockRecord: baseStockRecord
						}
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMDSV0060',
						data: request
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: this.beforeShowFileChooser //_.bind(this.validator.valid, this.validator)
				}
			});
			// 取込処理が失敗した。後処理が必要な場合は↓イベントを購読する。
			this.opeCSVInputCtrl.on('fail', function(data){
				if (data.rspHead.fieldMessages){
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					_this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}
				if (data.rspHead.uri){
					// CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				}
			});
			// 取込処理が成功した。返ってきたデータからテーブル作成。
			this.opeCSVInputCtrl.on('done', function(data){
				var recs = data.AMDSV0060GetRsp;
				// 上限在庫数が「0」の場合、空白にする
				if(data.AMDSV0060GetRsp.baseStockRecord.upLimitStockNum == 0){
					data.AMDSV0060GetRsp.baseStockRecord.upLimitStockNum = "";
					recs.baseStockRecord.upLimitStockNum = "";
				}
				var $d = $.Deferred();
				_this.invokeYmd2week(recs).then(function(ymMap){
					console.log(ymMap);
					// ココの arguments に、clutil.ymd2week の結果が入ってくるので、
					// recs の中に結果を放り込む。
					recs.baseStockRecord.fromWeek = ymMap[recs.baseStockRecord.fromWeek];
					recs.baseStockRecord.toWeek = ymMap[recs.baseStockRecord.toWeek];
					return $d.resolve(data);
				}).done(_.bind(function(){
					console.log(data);
					// args.data をアプリ個別 Veiw へセットする。
					_this.is_csvup = true;
					_this.data2view(data).always(_.bind(function(){
						clutil.setFocus($("#ca_rankBodyShapeID"));
						_this.is_csvup = false;
					}, this));
				}, this)).fail(_.bind(function(){
					console.log("fail!!");
				}, this));
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで

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
			}, {
				dataSource: {
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
				console.log("done in!!!!");
			});

			// メーカー
			this.makerField = clutil.clvendorcode($("#ca_makerID"), {
				dependAttrs: {
					unit_id: function() {
						return mainView.getValue('unitID', 0);
					},
					vendor_typeid: amdb_defs.MTTYPE_F_VENDOR_MAKER
				}
			});
			this.listenTo(this.makerField, "change", this._onMakerChange);

			$("input[name='ca_autoType'][value='1']").radio('check');

			// 店舗属性selector
			var html_source = '';
			html_source += '<option value="0">&nbsp;</option>';
			html_source += '<option value="1">店舗ランク上位から１ずつ</option>';
			html_source += '<option value="2">店舗ランク上位から振分数</option>';
			$("#ca_autoLogic").html('');
			$("#ca_autoLogic").html(html_source).selectpicker().selectpicker('refresh');

			// 週オートコンプリート
			this.fromYearWeek = clutil.clyearweekcode({
				el: '#ca_fromWeek',
				initValue: 0
			});
			this.toYearWeek = clutil.clyearweekcode({
				el: '#ca_toWeek',
				initValue: 0
			});

			// 基準在庫パターンオートコンプリート
			this.basestockptnField = clutil.clbasestockptncode(this.$('#ca_baseStockPtnID'), {
				dependAttrs: {
					unit_id: function() {
						return mainView.getValue('unitID', -1);
					}
				},
			});
			this.listenTo(this.basestockptnField, "change", this._onBaseStockPtnChange);

			// 店舗ランクパターンオートコンプリート
			this.storerankptnField = clutil.clstorerankptncode(this.$('#ca_rankPtnID'), {
				dependAttrs: {
					unit_id: function() {
						return mainView.getValue('unitID', -1);
					}
				},
			});
			this.listenTo(this.storerankptnField, "change", this._onStoreRankPtnChange);

			return this;
		},
		/**
		 * Excelデータ取込：ファイル選択前チェックメソッド。
		 * @param {object} e		&lt;input type="form"&gt; のクリックイベント
		 * @return {boolean} ret	true:ファイルアップロード処理続行、false:処理中断
		 */
		beforeShowFileChooser: function(e){
//			if (!this.validator.valid()) {
//				return false;
//			}

			if (this.hasInputError()) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return false;
			}

			return true;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

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


			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			argsMessage = args.data.rspHead.message;
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
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
				this.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});

//				var row_alert = [];
//				var row_error = ClGrid.getErrorRow(this.storeDataGrid.metadatas.body, this.storeDataGrid.getData(), 0);
//				ClGrid.showError(row_alert);
//				ClGrid.showError(row_error);

				if (argsMessage == 'WDS0007') {
					var updReq = this.savedUpdReq;
					var send = {
							resId:	"AMDSV0060",
							data: updReq,
							confirm: clmsg.WDS0007,
					};
					this.mdBaseView.forceSubmit(send);
				}
				if (argsMessage == 'WDS0008') {
					var updReq = this.savedUpdReq;
					var send = {
							resId:	"AMDSV0060",
							data: updReq,
							confirm: clmsg.WDS0008,
					};
					this.mdBaseView.forceSubmit(send);
				}
				if (argsMessage == 'WDS0009') {
					var updReq = this.savedUpdReq;
					var send = {
							resId:	"AMDSV0060",
							data: updReq,
							confirm: clmsg.WDS0009,
					};
					this.mdBaseView.forceSubmit(send);
				}
				if (argsMessage == 'WDS0010') {
					var updReq = this.savedUpdReq;
					var send = {
							resId:	"AMDSV0060",
							data: updReq,
							confirm: clmsg.WDS0010,
					};
					this.mdBaseView.forceSubmit(send);
				}

				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			var data = args.data;
			var recs = data.AMDSV0060GetRsp;

			switch(args.status){
			case 'OK':
				// 編集可の状態にする。
				clutil.viewRemoveReadonly(this.$el);
				$("form > a.cl-file-attach").attr("disabled",false);

				// 上限在庫数が「0」の場合、空白にする
				if(data.AMDSV0060GetRsp.baseStockRecord.upLimitStockNum == 0){
					data.AMDSV0060GetRsp.baseStockRecord.upLimitStockNum = "";
					recs.baseStockRecord.upLimitStockNum = "";
				}
				var $d = $.Deferred();
				this.invokeYmd2week(recs).then(function(ymMap){
					console.log(ymMap);
					// ココの arguments に、clutil.ymd2week の結果が入ってくるので、
					// recs の中に結果を放り込む。
					recs.baseStockRecord.fromWeek = ymMap[recs.baseStockRecord.fromWeek];
					recs.baseStockRecord.toWeek = ymMap[recs.baseStockRecord.toWeek];
					return $d.resolve(data);
				}).done(_.bind(function(){
					console.log(data);
					// args.data をアプリ個別 Veiw へセットする。
					this.data2view(data).always(_.bind(function(){
						// 編集・複製・削除・参照
						if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
							// args.data をアプリ個別 Veiw へセットする。
							clutil.viewReadonly(this.$('#div_ca_unitID'));
//							clutil.inputReadonly($('#ca_itgrpID, #ca_makerID, #ca_itemCode, #ca_colorID, #ca_baseStockPtnID, #ca_copy, #ca_rankPtnID'));
//							clutil.inputReadonly($('#ca_itgrpID, #ca_makerID, #ca_itemCode, #ca_baseStockPtnID, #ca_copy, #ca_rankPtnID'));
							// MD-4465 編集時に店舗ランクパターンは変更できるように修正
							clutil.inputReadonly($('#ca_itgrpID, #ca_makerID, #ca_itemCode, #ca_baseStockPtnID, #ca_copy'));
							// MD-4465 基準在庫が設定済みの場合は店舗ランクパターンは変更不可
							if(data.AMDSV0060GetRsp.baseStockRecord.baseStockPtnID.id != 0) {
								clutil.inputReadonly($('#ca_rankPtnID'));
							}
							clutil.inputReadonly($('input[name="ca_codeType"]'));
							clutil.setFocus(this.$("#ca_fromWeek"));
						} else if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
							// TODO:一部項目初期化
							$("#ca_baseStockID").val("");

							clutil.setFocus(this.$("#ca_unitID"));
						} else {
							this.setReadOnlyAllItems(true);
						}
						// 基準在庫パターン、店舗ランクパターンautocompleteの追加初期設定
						var base = $("#ca_baseStockPtnID").autocomplete('clAutocompleteItem');
						var rank = $("#ca_rankPtnID").autocomplete('clAutocompleteItem');
						if (base) {
							this.basestockptnField.onBeforeRenderResponse(base);
						}
						if (rank) {
							this.storerankptnField.onBeforeRenderResponse(rank);
						}
					}, this));
				}, this)).fail(_.bind(function(){
					console.log("fail!!");
				}, this));

				break;
			case 'DONE':		// 確定済
				var $d = $.Deferred();
				this.invokeYmd2week(recs).then(function(ymMap){
					console.log(ymMap);
					// ココの arguments に、clutil.ymd2week の結果が入ってくるので、
					// recs の中に結果を放り込む。
					recs.baseStockRecord.fromWeek = ymMap[recs.baseStockRecord.fromWeek];
					recs.baseStockRecord.toWeek = ymMap[recs.baseStockRecord.toWeek];
					return $d.resolve(data);
				}).done(_.bind(function(){
					// args.data をアプリ個別 Veiw へセットする。
					this.data2view(data).always(_.bind(function(){
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
					console.log(ymMap);
					// ココの arguments に、clutil.ymd2week の結果が入ってくるので、
					// recs の中に結果を放り込む。
					recs.baseStockRecord.fromWeek = ymMap[recs.baseStockRecord.fromWeek];
					recs.baseStockRecord.toWeek = ymMap[recs.baseStockRecord.toWeek];
					return $d.resolve(data);
				}).done(_.bind(function(){
					// args.data をアプリ個別 Veiw へセットする。
					this.data2view(data).always(_.bind(function(){
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

				var row_alert = [];
				var row_error = ClGrid.getErrorRow(this.storeDataGrid.metadatas.body, this.storeDataGrid.getData(), 0);
				ClGrid.showError(row_alert);
				ClGrid.showError(row_error);

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

		/**
		 * 店舗オートコンプ入れ替え
		 */
		getOrg: function($tgt, unitID){
			return clutil.clorgcode({
				el: $tgt,
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				},
			});
		},

		is_init: false,	// 初期化時フラグ

		/**
		 * データを表示
		 */
		data2view: function(data){
			this.saveData = data.AMDSV0060GetRsp;
			var baseStockRecord = data.AMDSV0060GetRsp.baseStockRecord;

			// 表示用に変換
			baseStockRecord.unitID = baseStockRecord.unitCodeName.id;
			baseStockRecord.itgrpID = baseStockRecord.itgrpCodeName;
			baseStockRecord.rankPtnID = baseStockRecord.rankPtnCodeName;
			baseStockRecord.makerID = {
				id: baseStockRecord.makerCodeName.id,
				code: baseStockRecord.makerCodeName.code,
				name: baseStockRecord.makerCodeName.name,
			};
			baseStockRecord.itemID = baseStockRecord.itemCodeName.id;
			baseStockRecord.itemCode = baseStockRecord.itemCodeName.code;
			baseStockRecord.baseStockPtnID = {
				id: baseStockRecord.baseStockPtnCodeName.id,
				code: baseStockRecord.baseStockPtnCodeName.code,
				name: baseStockRecord.baseStockPtnCodeName.name,
			};
			baseStockRecord.rankPtnID = {
				id: baseStockRecord.rankPtnCodeName.id,
				code: baseStockRecord.rankPtnCodeName.code,
				name: baseStockRecord.rankPtnCodeName.name,
			};
			if (baseStockRecord.packFlag == 1) {
				// 集約商品
				baseStockRecord.codeType = 2;
			} else {
				baseStockRecord.codeType = 1;
			}
			clutil.data2view(this.$('#ca_base_form'), baseStockRecord);

			this._onAutoTypeChange();
			this._onCodeTypeChange();

			// データセット
//			clutil.ymd2week(baseStockRecord.fromWeek, 0, true).done(_.bind(function(from){
//				baseStockRecord.fromWeek = from;
//				clutil.ymd2week(baseStockRecord.toWeek, 0, true).done(_.bind(function(to){
//					baseStockRecord.toWeek = to;
//					clutil.data2view(this.$('#ca_base_form'), baseStockRecord);
//					$("input[name='ca_autoType'][value=" + baseStockRecord.autoType + "]").radio('check');
//					this._onAutoTypeChange();
//				},this));
//			},this));
			// 基準在庫パターン、店舗ランクパターンセット
			clutil.data2view(this.$('#ca_rank_form'), baseStockRecord);
			// 商品マスタ取得
			var makeritemcode = {
				itgrp_id: baseStockRecord.itgrpCodeName.id,
				maker_id: baseStockRecord.makerCodeName.id,
				maker_code: baseStockRecord.itemCodeName.code,
				f_pack: baseStockRecord.packFlag,
			};
			var colorObj = {
				tgt : $('#ca_colorID'),
				colorID : baseStockRecord.colorID
			};
			var dfd = $.Deferred();
			this.is_init = true;
			clutil.clmakeritemcode2item(makeritemcode, colorObj).done(_.bind(function(isCorrect){
				// テーブルデータセット
				this.setDispData(this.saveData);
				this.renderTable();
				isCorrect ? dfd.resolve() : dfd.reject();
				this.is_init = false;
			},this));

			return dfd.promise();
		},

		invokeYmd2week: function(rsp) {
			console.log('clutil.ymd2week.done: ', rsp.baseStockRecord);
			if (_.isEmpty(rsp.baseStockRecord)) {
				return $.Deferred().resolve({});
			}
			var ymMap = {};
			if (rsp.baseStockRecord.fromWeek) {
				ymMap[rsp.baseStockRecord.fromWeek] = null;
			}
			if (rsp.baseStockRecord.toWeek) {
				ymMap[rsp.baseStockRecord.toWeek] = null;
			}
			var efers = _.reduce(ymMap, function(dfarray, val, ym){
				var d = clutil.ymd2week(ym, 0, true).done(function(data){
//					console.log('clutil.ymd2week.done: ', arguments);
					ymMap[data.id] = data;
				});
				dfarray.push(d);
				return dfarray;
			}, []);

			var dfd = $.Deferred();
			$.when.apply($, efers).then(function(){
//				console.log('$.when.apply: ', arguments);
				dfd.resolve(ymMap);
			});
			return dfd.promise();
		},

		/**
		 * MT-1493エラー行、警告行クリック時に該当の行までスクロールする処理 yamaguchi
		 */
		_onErrWrnClick: function(args) {
			this.rankDataGrid.grid.scrollRowIntoView($(args.currentTarget).data('rownum'),1);
		},

		// 初期データ取得後に呼ばれる関数
		setReadOnlyAllItems: function(isGrid){
			clutil.viewReadonly(this.$el);
			$("form > a.cl-file-attach").attr("disabled", true);
			if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
				clutil.viewRemoveReadonly(this.$('#ca_csvinput2'));
			}
			if (isGrid) {
				this.rankDataGrid.setEnable(false);
				this.storeDataGrid.setEnable(false);
			}
		},

		/**
		 * 基準在庫パターン在庫数取得
		 */
		getBaseStockPtn : function (infoType, id) {
			// 空の場合はサーバへいかない
			if (!id) {
				// テーブルをクリアする
				this.rankDataGrid.clear();
				return;
			}

			var baseStockPtnID = 0, rankPtnID = 0;

			switch (infoType) {
			case AMDSV0060Req.AMDSV0060_TYPE_BASESTOCKPTN:
				baseStockPtnID = id;
				var rankPtn = $('#ca_rankPtnID').autocomplete('clAutocompleteItem');
				rankPtnID = (rankPtn) ? rankPtn.id : 0;
				break;

			case AMDSV0060Req.AMDSV0060_TYPE_STORERANK:
				rankPtnID = id;
				var baseStockPtn = $('#ca_baseStockPtnID').autocomplete('clAutocompleteItem');
				baseStockPtnID = (baseStockPtn) ? baseStockPtn.id : 0;
				break;

			default:
				break;
			}

			var req = this.buildReq(infoType, 0, baseStockPtnID, rankPtnID);
			if (req) {
				// 基準在庫パターン在庫数レコード取得
				return this.doSrch(req);
			}
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 */
		doStoreInfo: function(srchReq){
			var defer = clutil.postJSON('AMDSV0060', srchReq).done(_.bind(function(data){
//				console.log(data);
//				this.setStoreInfo(data, $tgt, store);
			}, this)).fail(_.bind(function(data){
				console.log("fail!!");
				this.srchFailProc(data);
			}, this));

			return defer;
		},

		/**
		 * 検索条件を作る（サイズ取得用）
		 * @param infoType
		 * @param itemID 商品ID
		 * @param sizePtnID サイズパターンID
		 * @returns {___anonymous41177_41689}
		 */
		buildSizeReq: function(infoType, itemID, sizePtnID) {

			var getReq = {
					// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				infoType: infoType,		// 取得情報フラグ
				// 基準在庫登録・修正検索リクエスト
				AMDSV0060GetReq: {
					srchItemID: itemID,					// 商品ID
					srchSizePtnID: sizePtnID,			// サイズパターンID
				},
			};

			return getReq;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function (infoType, storeID, baseStockPtnID, rankPtnID) {
			var baseStockID = Number($('#ca_baseStockID').val());
			var itemID = Number($('#ca_itemID').val());
			var sizePtnID = Number($('#ca_sizePtnID').val());

			var itgrp = $('#ca_itgrpID').autocomplete('clAutocompleteItem');
			if (!itgrp) {
				return null;
			}
			if (itemID <= 0) {
				return null;
			}
			if (infoType == AMDSV0060Req.AMDSV0060_TYPE_STORERANK && sizePtnID <= 0) {
				return null;
			}

			var getReq = {
					// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				infoType: infoType,		// 取得情報フラグ
				// 基準在庫登録・修正検索リクエスト
				AMDSV0060GetReq: {
					srchBaseStockID: baseStockID,		// 基準在庫ID
					srchItgrpID: itgrp.id,				// 品種ID
					srchItemID: itemID,					// 商品ID
					srchStoreID: storeID,				// 店舗ID
					srchSizePtnID: sizePtnID,			// サイズパターンID
					srchBaseStockPtnID: baseStockPtnID,	// 基準在庫パターンID
					srchStoreRankPtnID: rankPtnID,		// 店舗ランクID
				},
			};

			return getReq;
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 */
		doSrch: function(srchReq){
			var defer = clutil.postJSON('AMDSV0060', srchReq).done(_.bind(function(data){
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

			if (srchReq.infoType == AMDSV0060Req.AMDSV0060_TYPE_BASESTOCKPTN) {
				$('#ca_rankPtnID').autocomplete('removeClAutocompleteItem');
				$('#ca_rankPtnID').val('');
			}
			if (srchReq.infoType == AMDSV0060Req.AMDSV0060_TYPE_STORERANK) {
				$('#ca_baseStockPtnID').autocomplete('removeClAutocompleteItem');
				$('#ca_baseStockPtnID').val('');
			}

			if (_.isEmpty(recs)) {
				// エラーメッセージ表示
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

//				// フォーカス設定
//				this.resetFocus(this.srchCondView.$tgtFocus);
			} else {
				// リクエストを保存。
				this.savedReq = srchReq;

				// データセット
				this.setDispData(recs);
				if (srchReq.infoType == AMDSV0060Req.AMDSV0060_TYPE_BASESTOCKPTN
						|| srchReq.infoType == AMDSV0060Req.AMDSV0060_TYPE_STORERANK) {
					// 基準在庫パターンor店舗ランクパターン変更時は店舗基準テーブルは再描画しない
					this.renderRankTable();
				} else {
					this.renderTable();
				}

				// フォーカスの設定
				var $focusElem = $("#ca_rank_datagrid").find("input[type='text']:first");
				clutil.setFocus($focusElem);

			}
		},

		srchFailProc: function(data){
			// エラーメッセージを通知。
			clutil.mediator.trigger('onTicker', data);

//			// フォーカスの設定
//			this.resetFocus();
		},

		setDispData: function(rsp){
			this.saveData = rsp;

			this.setRankData(rsp);
			this.setStoreData(rsp);
		},

		setRankData: function(rsp){
//			var _this = this;
			this.rankData = null;

			var tableData = {
				header:{
					head	: [],
					cell	: [],
				},
				body		: [],
				dispItem	: [],
				sizeNum : 0
			};

			var hd = tableData.header;
			var bd = tableData.body;

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

			// 取得・更新情報フラグよって表示データを分ける
			var cellRecords = [];
			if (this.savedReq && this.savedReq.infoType) {
				var infoType = this.savedReq.infoType;

				switch (infoType) {
				case AMDSV0060Req.AMDSV0060_TYPE_ITEM:
				case AMDSV0060Req.AMDSV0060_TYPE_STORERANK:
					cellRecords = rsp.rankCellRecords;
					break;

				case AMDSV0060Req.AMDSV0060_TYPE_BASESTOCKPTN:
					if (this.is_csvup) {
						cellRecords = rsp.rankCellRecords;
					} else {
						cellRecords = rsp.ptnCellRecords;
					}
					break;

				default:
					break;
				}
			}

			var cellRecordsMap = {};
			$.each(cellRecords, function(i, o){
				var id = o.rankID + ':' + o.sizeID;
				cellRecordsMap[id] = o;
			});

			// テーブルの縦軸部分のデータを生成する
			$.each(rsp.rankRecords, function(){
				var colIndex = 0;
				var list = [];
				var totalBaseStockQy = 0;

				// テーブルの横軸部分のデータを生成する
				for (var i = 0; i < cellLoopMax; i++){
					var sizeData = rsp.sizeRecords[i];
//					var cellData = _this.getCellRecord(cellRecords, this.rankID, sizeData.sizeID, 1);
					var id = this.rankID + ':' + sizeData.sizeID;
					var cellData = cellRecordsMap[id] || {
						baseStockQy	: 0,
						refQy	: 0,
					};
					list.push({
						baseStockQy	: cellData.baseStockQy,
						sizeID		: sizeData.sizeID,
						sizeCode	: sizeData.sizeCode,
						sizeName	: sizeData.sizeName,
						bodyShapeID	: sizeData.bodyShapeID,
						autoStopQy	: sizeData.autoStopQy,
						rowIndex	: rowIndex,
						colIndex	: colIndex,
					});
					totalBaseStockQy += cellData.baseStockQy;
					cellIndex++;
					colIndex++;
				}
				this.rowIndex = rowIndex;
				this.totalBaseStockQy = totalBaseStockQy;
				this.list = list;
				bd.push(this);

				rowIndex++;
			});

			this.rankData = tableData;
			this.rankData.dispItem = this.rankData.body;
		},

		setStoreData: function(rsp){
//			var _this = this;
			this.storeData = null;

			var tableData = {
				header:{
					head	: [],
					cell	: [],
				},
				totalData		: {
					allBaseStockQy : 0,
					allRefQy : 0,
					list:[]
				},
				body		: [],
				dispItem	: [],
				sizeNum : 0
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
			hd.head.push({colspan:index * 2});
			tableData.sizeNum = index;

			var cellLoopMax = index;
			var cellIndex = 0;
			var rowIndex = 0;
			var colTotalBaseStock = [];
			var colTotalRef = [];
			for (var i = 0; i < cellLoopMax; i++){
				colTotalBaseStock[i] = 0;
				colTotalRef[i] = 0;
			}

			var cellRecordsMap = {};
			$.each(rsp.storeCellRecords, function(i, o){
				var id = o.storeID + ':' + o.sizeID;
				cellRecordsMap[id] = o;
			});

			// テーブルの縦軸部分のデータを生成する
			$.each(rsp.storeRecords, function(){
				var colIndex = 0;
				var totalRefQy = 0;
				var totalBaseStockQy = 0;
				var list = [];

				// テーブルの横軸部分のデータを生成する
				for (var i = 0; i < cellLoopMax; i++) {
					var sizeData = rsp.sizeRecords[i];
//					var cellData = _this.getCellRecord(rsp.storeCellRecords, this.storeID, sizeData.sizeID, 2);
					var id = this.storeID + ':' + sizeData.sizeID;
					var cellData = cellRecordsMap[id] || {
						baseStockQy	: 0,
						refQy	: 0,
					};
					list.push({
						refQy		: cellData.refQy,
						baseStockQy	: cellData.baseStockQy,
						sizeID		: sizeData.sizeID,
						sizeCode	: sizeData.sizeCode,
						sizeName	: sizeData.sizeName,
						bodyShapeID	: sizeData.bodyShapeID,
						autoStopQy	: sizeData.autoStopQy,
						rowIndex	: rowIndex,
						colIndex	: colIndex,
					});
					totalRefQy += Number(cellData.refQy);
					totalBaseStockQy += Number(cellData.baseStockQy);
					colTotalRef[colIndex] += Number(cellData.refQy);
					colTotalBaseStock[colIndex] += Number(cellData.baseStockQy);
					cellIndex++;
					colIndex++;
				}
				this.rowIndex = rowIndex;
				this.totalRefQy = totalRefQy;
				this.totalBaseStockQy = totalBaseStockQy;
				this.list = list;
				bd.push(this);

				rowIndex++;
			});

			for (var i = 0; i < cellLoopMax; i++) {
				td.list.push({
					colIndex : i,
					refQy : colTotalRef[i],
					baseStockQy : colTotalBaseStock[i],
				});
				td.allRefQy += colTotalRef[i];
				td.allBaseStockQy += colTotalBaseStock[i];
			}

			this.storeData = tableData;
			this.storeData.dispItem = this.storeData.body;
			console.log(this.storeData);
		},

		getCellRecord: function (cellRecords, id, sizeID, type) {
			var cellRecord = {
				refQy	: 0,
				baseStockQy	: 0,
			};
			$.each(cellRecords, function(){
				var tgtID = (type == 1) ? this.rankID : this.storeID;
				if (tgtID == id && this.sizeID == sizeID) {
					cellRecord = clutil.dclone(this);
					return false;
				}
			});

			return cellRecord;
		},

		renderTable:function() {
			this.renderRankTable();
			this.renderStoreTable();
		},

		renderRankTable: function() {
			var dispData = this.rankData;
			var columns = this._makeColumsFromRankSizeData();
			var data = [];
			var tmp;
			if (columns == null || dispData.body == null || dispData.body.length == 0) {
				this.rankDataGrid.clear();
				return false;	// データなし。
			}

			$.each(dispData.body, function(){
				tmp = {
					isRankRow : true,
					totalRow : false,
					storeTypeRow : false,
					rowIndex : this.rowIndex,
					rankID : this.rankID,
					rankCode : this.rankCode,
					rankName : this.rankName,
					storeNum : this.storeNum,
					body: true,
					rowTotal : {
						baseStockQy : this.totalBaseStockQy,
					},
				};
				$.each(this.list, function(){
					tmp["colIndex_" + this.colIndex + "_field"] = {
						baseStockQy : this.baseStockQy,
						colIndex : this.colIndex,
						bodyShapeID : this.bodyShapeID,
						sizeID : this.sizeID,
						sizeCode : this.sizeCode,
						sizeName : this.sizeName,
					};
				});
				data.push(tmp);
			});
			this.rankDataGrid.render().setData({
				gridOptions: {
					frozenColumn : 2,
					frozenRow : 1,
					frozenRowHeight: [ 80, 40 ],
					rowHeight: 40,
					autoHeight: false,		// 高さに対して仮想化するため、インナースクロールを入れる。
				},
				columns : columns,
				data : data
			});
		},

		_makeColumsFromRankSizeData : function(){
			if(_.isEmpty(this.rankData.header.cell)){
				return null;
			}
			var columns = [
				{id : 'rankCode', name : '店舗ランク', field : 'rankCode', width: 100},
				{id : 'rankName', name : '店舗ランク名', field : 'rankName', width: 200},
				{
					id : 'rowTotal',
					name : '合計',
					field : 'rowTotal',
					width : 80,
					cellType: {
						formatter: function(value, options){
							return baseStockQyFormatter({
								col : clutil.comma(options.dataContext.rowTotal.baseStockQy)
							});
						}
					}
				}
			];

			var numSize = this.rankData.header.cell.length;
			$.each(this.rankData.header.cell, function(i){
				var fieldName = 'colIndex_' + this.colIndex + '_field';
				columns.push({
					id : 'colIndex_' + this.colIndex + '_field',
					name : this.sizeName,
					field : 'colIndex_' + this.colIndex + '_field',
					width: 80,
					sizeColumn: true,
					sizeID: this.sizeID,
					sizeCode: this.sizeCode,
					firstSizeCol: i === 0,
					lastSizeCol: i === numSize - 1,
					bodyShapeID: this.bodyShapeID,
					headCellType: {
						formatter: 'rankHdrFormatter'
					},
					cellType: {
						editorType: RankSizeEditor,
						isEditable: function(item){
							return true;//編集する
						},
						formatter: function(value, options){
//							return baseStockQyFormatter({
//								col: clutil.comma(value.baseStockQy)
//							});
							return rankSizeFormatter(value, options);
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
			this._rankColumns = columns;
			return columns;
		},

		renderStoreTable: function(f_render) {
			var dispData = this.storeData;
			var td = dispData.totalData;
			var columns = this._makeColumsFromStoreSizeData();
			var data = [];
			var tmp;
			if (columns == null){
				return false;	// データなし。
			}

			// 合計 行
			tmp = {
				isStoreRow : false,
				totalRow : true,
				rankID : 0,
				rankCode : '',
				rankName : '',
				rank : "合計",
				store :{
					id		: 1,
					code	: '',
					name	: '',
				},
				rowTotal : {
					baseStockQy : td.allBaseStockQy
				}
			};
			$.each(td.list, function(){
				tmp["colIndex_" + this.colIndex + "_field"] = this;
			});
			data.push(tmp);

			$.each(dispData.body, function(){
				tmp = {
					isStoreRow : true,
					isDeleted : this.isDeleted,
					totalRow : false,
					rowIndex : this.rowIndex,
					rankID : this.rankID,
					rankCode : this.rankCode,
					rankName : this.rankName,
					rank : this.rankCode + ':' + this.rankName,
					store :{
						id		: this.storeID,
						code	: this.storeCode,
						name	: this.storeName,
					},
					rowTotal : {
						baseStockQy : this.totalBaseStockQy,
					},
					body: true,
				};
				$.each(this.list, function(){
					tmp["colIndex_" + this.colIndex + "_field"] = {
						refQy : this.refQy,
						baseStockQy : this.baseStockQy,
						colIndex : this.colIndex,
						bodyShapeID : this.bodyShapeID,
						sizeID : this.sizeID,
						sizeCode : this.sizeCode,
						sizeName : this.sizeName,
					};
				});
				data.push(tmp);
			});
			this.storeDataGrid.render().setData({
				gridOptions: {
					frozenColumn : 2,
					frozenRow : 2,
					frozenRowHeight: [ 80, 40 ],
					rowHeight: 40,
					autoHeight: false,		// 高さに対して仮想化するため、インナースクロールを入れる。
				},
				columns : columns,
				data : data,
				rowDelToggle : true,
				graph : this.graph
			});
			if (f_render === true) {
				// メタデータを書き換えてgrid.invalidateAllRows(), grid.render()
				var isDeleted = false;
				for (var i = 0; i < data.length; i++) {
					var dto = data[i];
					if (dto.isDeleted === true) {
						meta = this.storeDataGrid._getStoredMetadata(i+1);
						meta.cssClasses="delflag";
						meta.cssClassesMap={delflag:true};

						isDeleted = true;
					}
				}
				if (isDeleted) {
					this.storeDataGrid.grid.invalidateAllRows();
					this.storeDataGrid.grid.render();
				}
			}
		},

		_makeColumsFromStoreSizeData : function(){
			if(_.isEmpty(this.storeData.header.cell)){
				return null;
			}
			var columns = [
				{
					id : 'rank',
					name : 'ランク',
					field : 'rank',
					width: 160
				},
				{
					id: 'store',
					name: '店舗名',
					field: 'store',
					cssClass: 'fntss',
					width: 180,
					cellType: {
						type: 'clajaxac',
						validator : "required",
						editorOptions: {
							funcName: 'orgcode',
							dependAttrs: function(item){
								var unit_id = $('#ca_unitID').val();
								return {
									p_org_id : unit_id,
									orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
									orglevel_id: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
								};
							}
						},
						isEditable: function(item){
							return !item.totalRow;
						},
//						validator: ['required']
					}
				},
				{
					id : 'rowTotal',
					name : '合計',
					field : 'rowTotal',
					width : 80,
					cellType: {
						formatter: function(value, options){
							return baseStockQyFormatter({
								col : clutil.comma(options.dataContext.rowTotal.baseStockQy)
							});
						}
					}
				}
			];

			var numSize = this.storeData.header.cell.length;
			$.each(this.storeData.header.cell, function(i){
				var fieldName = 'colIndex_' + this.colIndex + '_field';
				columns.push({
					id : 'colIndex_' + this.colIndex + '_field',
					name : this.sizeName,
					field : 'colIndex_' + this.colIndex + '_field',
					width: 140,
//					cssClass: 'fntss',
					sizeColumn: true,
					sizeID: this.sizeID,
					sizeCode: this.sizeCode,
					firstSizeCol: i === 0,
					lastSizeCol: i === numSize - 1,
					bodyShapeID: this.bodyShapeID,
					headCellType: {
						formatter: 'storeHdrFormatter'
					},
					cellType: {
						editorType: StoreSizeEditor,
						isEditable: function(item){
							return !item.totalRow;
						},
						formatter: function(value, options){
							if (options.dataContext.totalRow) {
								return totalColFormatter(value, options);
							} else {
								return storeSizeFormatter(value, options);
							}
						},
						validator: [function(){
//							console.log(arguments);
							if (this.item.isStoreRow === true) {
								var value = this.item[fieldName];
								return clutil.Validators.checkAll({
									validator: 'required uint:4',
									value: value && value.baseStockQy
								});
							}
						}]
					}
				});
			});
			this._storeColumns = columns;
			return columns;
		},

		getRankColumns: function(bodyShapeID){
			var removeSizeList = this.removeRankSizeList || {};
			var columns = _.filter(this._rankColumns, function(column){
				console.log(column);
				return !column.sizeColumn ||
				(!bodyShapeID || column.bodyShapeID === bodyShapeID) &&
				!_.has(removeSizeList, column.sizeID);
			});

			return columns;
		},

		getStoreColumns: function(bodyShapeID){
			var removeSizeList = this.removeStoreSizeList || {};
			var columns = _.filter(this._storeColumns, function(column){
				return !column.sizeColumn ||
				(!bodyShapeID || column.bodyShapeID === bodyShapeID) &&
				!_.has(removeSizeList, column.sizeID);
			});

			return columns;
		},

		/** テーブルクリア **/
		clearTable : function() {
			this.rankDataGrid.clear();
			this.storeDataGrid.clear();
		},

		dispRefTotal: function(colIndex){
			var ref;

			// 縦計計算
			var rowTotal = 0;
			$.each(this.storeData.body, function(){
				if (this.list[colIndex].rowIndex > 0) {
					rowTotal += this.list[colIndex].refQy;
				}
			});
			ref = this.storeData.body[0].list[colIndex];
			ref.refQy = rowTotal;

			/// 縦計
			var srchRowCls = "cl_" + colIndex + "_refQy";
			ref = this.storeData.body[0].list[colIndex];
			var srchRow = $('#ca_storeTable_tbody').find('.reference');
			srchRow.find('.' + srchRowCls).text(ref.refQy);
		},

		/**
		 * 店舗別振分リンク押下処理
		 */
		_onLinkStoreClick: function(e) {
			var url = clcom.appRoot + '/AMDS/AMDSV0061/AMDSV0061.html';
			var destData = {
				// 新規登録
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
			};
			clcom.pushPage(url, destData, null);
		},

		/**
		 * 事業ユニットが変更されたイベント
		 *  ⇒ メーカーコードオートコンプリートの内部設定値をクリアする。
		 */
		_onUnitChange: function(e){
			//console.log(e);
			if(this.deserializing){
				// データセット中
				return;
			}
			var radio = $("input:radio[name=ca_codeType]:checked");
			var val = Number(radio.val());

			this.$('#ca_makerID').autocomplete('removeClAutocompleteItem');
			this.makerField.trigger("change");
			var unitID = Number(this.$('#ca_unitID').val());
			if (val == 1) {
				this.$('#ca_makerID').attr('readonly', unitID == 0);
			} else {
				this.$('#ca_makerID').attr('readonly', true);
			}
			this.$('#ca_itemCode').attr('readonly', unitID == 0);
			if (unitID == 0) {
				clutil.viewReadonly(this.$('#div_ca_colorID'));
			}

			var _this = this;
			$('#ca_storeTable_tbody tr').each(function(i){
				if (i == 0) {
					return true;
				}
				var $store = $(this).find('input[name="ca_storeID"]');
				_this.getOrg($store, unitID);
			});
		},

		/**
		 * 品番選択ラジオボタン変更
		 * @param e
		 */
		_onCodeTypeChange: function(e) {
			var radio = $("input:radio[name=ca_codeType]:checked");
			var val = Number(radio.val());

			console.log(val);

			switch (val) {
			case 1:	// メーカー品番
				// ラベルを「メーカー品番」に変更する
				$("#p_itemCode").text('メーカー品番');
				// メーカーを入力可能にする
				clutil.unfixReadonly($("#ca_makerID"));
				clutil.inputRemoveReadonly($("#ca_makerID"));
				// メーカーを必須にする
				$("#div_makerID").addClass('required');
				$("#ca_makerID").addClass('cl_required');
				$("#ca_makerID").addClass('cl_valid');
				//MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 ここから 上限在庫数設定有無を非活性化 2018/12/25
				clutil.inputReadonly($('input[name="ca_upLimitStockType"]'));
				clutil.inputReadonly($("#ca_upLimitStockNum"));
				this._onupLimitStockTypeChange();	//上限在庫数設定有無ラジオボタン押下時の関数を呼び出し、活性・非活性の制御を行う
				//自動通知を活性化する 　※仕様確認中
				clutil.inputRemoveReadonly($('input[name="ca_autoType"]'));
				clutil.inputRemoveReadonly($('#ca_autoLogic'));
				//ここまで
				break;
			case 2:	// 集約品番
				// ラベルを「集約品番」に変更する
				$('#p_itemCode').text('集約品番');
				// メーカーを入力不可にする
				clutil.inputReadonly($("#ca_makerID"));
				clutil.fixReadonly($("#ca_makerID"));
				this.validator.clear($("#ca_makerID"));
				// メーカーの必須を外す
				$("#div_makerID").removeClass('required');
				$("#ca_makerID").removeClass('cl_required');
				$("#ca_makerID").removeClass('cl_valid');
				// メーカーをクリアする
				$("#ca_makerID").val('');
				//MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 ここから 上限在庫数設定有無を活性化 2018/12/25
				clutil.inputRemoveReadonly($('input[name="ca_upLimitStockType"]'));
				clutil.inputRemoveReadonly($("#ca_upLimitStockNum"));
				this._onupLimitStockTypeChange();
				//ここまで
				break;
			}

		},

		/**
		 * メーカー変更
		 */
		_onMakerChange : function(attrs, view, options){
			// メーカー品番クリアする
//			this.$("#ca_itemCode").val('').trigger("change");
			this.$("#ca_itemCode").val('');
			this.$("#ca_itemID").val('0');
			this.$("#ca_itemName").val('');

			// カラーをクリアする
			this.$("#ca_colorID").selectpicker('val', 0);
			clutil.inputRemoveReadonly($("#ca_colorID"));
			return;
		},

		/**
		 * メーカー品番
		 */
		_onItemCodeChange: function (e) {
			console.log(e);
//			var $tgt = $(e.target);
//			this.setItemCode($tgt, null);

			var maker_id = 0;
			var radio = $("input:radio[name=ca_codeType]:checked");
			var val = Number(radio.val());

			var data_itgrp = $('#ca_itgrpID').autocomplete('clAutocompleteItem');
			if (!data_itgrp) {
				return;
			}
			var data_maker = $('#ca_makerID').autocomplete('clAutocompleteItem');
			if (val == 1 && !data_maker) {
				return;
			} else if (data_maker != null) {
				maker_id = data_maker.id;
			}
			console.log(data_maker);

			var maker_code = $(e.target).val();
			if (maker_code == 0) {
				return;
			}

			var itgrp_id = data_itgrp.id;
			var f_pack = val == 2 ? 1 : 0;
			var makeritemcode = {
				itgrp_id: itgrp_id,
				maker_id: maker_id,
				maker_code: maker_code,
				f_pack: f_pack,
			};
			console.log(makeritemcode);

			clutil.clmakeritemcode2item(makeritemcode, e);
		},

		/**
		 * メーカー品番→商品取得完了イベント
		 * @param data
		 * @param e
		 */
		_onCLmakerItemCodeComplete: function(data, obj) {
			console.log(data.data);
			var rec = data.data.rec;
			// item保存(MtItem)
			this.itemID = rec.itemID;
			$('#ca_itemID').val(rec.itemID);
			$('#ca_itemName').val(rec.itemName);
			$('#ca_sizePtnID').val(rec.sizePtnID);

			//セレクター
			var $sel_color = $("#ca_colorID");
			var list = [];

			// コードに該当する商品IDがない場合
			if (rec.itemID == ""){
				this.validator.setErrorMsg($("#ca_itemCode"), clmsg.EGM0026);

				$('#ca_itemName').val(null);
				$('#ca_itemID').val(null);
				$('#ca_sizePtnID').val(null);
				if (this.colorSelector) {
					this.colorSelector.off();
				}

				clutil.cltypeselector2({
					  $select: $sel_color,
					  list: list
				});
				clutil.initUIelement($sel_color);
				clutil.mediator.trigger("_ca_onSetColorComplete", false);
				return;
			}

			if (!_.isEmpty(data.data.list)) {
				clutil.viewRemoveReadonly(this.$('#div_ca_colorID'));
				$('#div_ca_colorID').parent().addClass('required');
				$('#ca_colorID').addClass('cl_valid');
				$('#ca_colorID').addClass('cl_required');
			}else {
				clutil.viewReadonly(this.$('#div_ca_colorID'));
				$('#ca_colorID').removeClass('cl_valid');
				$('#ca_colorID').removeClass('cl_required');
				$('#div_ca_colorID').parent().removeClass('required');
			}
			// カラーセレクター
			this.colorSelector = clutil.clcolorselector({
				el: "#ca_colorID",
				dependAttrs: {
					// 期間開始日
					srchFromDate: function(){
						return clcom.getOpeDate();
					},
					// 期間終了日
					srchToDate: function(){
						return clcom.getOpeDate();
					},
					// 商品ID
					itemID: rec.itemID,
				}
			});
			if (obj != null) {
				this.colorSelector.setValue(obj.colorID);
			}

			// 体型セレクタ
			clutil.clsizerowselector({
				el: '#ca_rankBodyShapeID',
				dependAttrs: {
					sizePtnID: rec.sizePtnID
				}
			});
			clutil.clsizerowselector({
				el: '#ca_storeBodyShapeID',
				dependAttrs: {
					sizePtnID: rec.sizePtnID
				}
			});

			if (this.is_csvup != true &&
					this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					(!this.is_init && this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY)) {
				// サイズ取得
				this.getSizePtn(rec.itemID, rec.sizePtnID);
			}
		},

		/**
		 * 上限在庫数設定有無ラジオボタン押下
		 * MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 2018/12/25
		 * @param e
		 */
		_onupLimitStockTypeChange: function(e) {
			var radio = $("input:radio[name=ca_upLimitStockType]:checked");
			var val = Number(radio.val());

			console.log(val);

			switch (val) {
			case 1:	// 設定しない
				//上限在庫数入力欄を非表示かつ、必須入力を解除する
				$("#ca_upLimitStockNum_div").addClass('dispn');
				$("#ca_upLimitStockNum").removeClass('cl_required');
				//入力値をクリアする
				$("#ca_upLimitStockNum").val("");
				//自動通知を活性化する 　※仕様確認中
				clutil.inputRemoveReadonly($('input[name="ca_autoType"]'));
				clutil.inputRemoveReadonly($('#ca_autoLogic'));
				break;
			case 2:	// 設定する
				//上限在庫数入力欄を表示かつ、必須入力にする
				$("#ca_upLimitStockNum_div").removeClass('dispn');
				if( $("#ca_upLimitStockNum").attr('readonly') != 'readonly' ){
					$("#ca_upLimitStockNum").addClass('cl_required');
				} else {
					$("#ca_upLimitStockNum").val("");
					$("#ca_upLimitStockNum").removeClass('cl_required');
				}
				//「自動停止して通知する」に変更する
				$('input[name="ca_autoType"][value="1"').attr("checked",true);
				$('input[name="ca_autoType"][value="2"').attr("checked",false);
				$('input[name="ca_autoType"][value="1"').parent().parent().find('label').addClass('checked');
				$('input[name="ca_autoType"][value="2"').parent().parent().find('label').removeClass('checked');
				$('input[name="ca_autoType"][value="1"').trigger('change');
				//自動通知を非活性化する　※仕様確認中
				clutil.inputReadonly($('input[name="ca_autoType"]'));
				clutil.inputReadonly($('#ca_autoLogic'));
				break;
			}

		},

		/**
		 * サイズ取得
		 * @param itemID
		 * @param sizePtnId
		 */
		getSizePtn: function(itemID, sizePtnID) {
			var req = this.buildSizeReq(AMDSV0060Req.AMDSV0060_TYPE_SIZEPTN, itemID, sizePtnID);

			var uri = 'AMDSV0060';
			clutil.postJSON(uri, req, _.bind(function(data, dataType) {
				if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					var recs = data.AMDSV0060GetRsp;

					// 店舗基準
					this.setStoreData(recs);
					this.renderStoreTable();
					this.saveData = recs;

					// 店ランク別基準在庫設定の再描画
					var baseStockPtn = $('#ca_baseStockPtnID').autocomplete('clAutocompleteItem');
					var rankPtn = $('#ca_rankPtnID').autocomplete('clAutocompleteItem');
					if (rankPtn) {
						// 店舗ランク変更イベントをキック
						this.storerankptnField.trigger('change', rankPtn);
					} else if (baseStockPtn) {
						// 基準在庫パターン変更イベントをキック
						this.basestockptnField.trigger('change', baseStockPtn);
					}
				} else {
				}
			}, this));

		},

		/**
		 * 自動停止有無ラジオボタン変更
		 */
		_onAutoTypeChange: function(e){
			var radio = $("input:radio[name=ca_autoType]:checked");
			var val = Number(radio.val());
			console.log(val);

			switch (val) {
			case 1:	// 自動振分け
				$("#ca_autoLogic_div").addClass('dispn');
				$("#ca_autoLogic").removeClass('cl_required');
				break;

			case 2:	// 自動振分け
				$("#ca_autoLogic_div").removeClass('dispn');
				$("#ca_autoLogic").addClass('cl_required');
				break;

			default:
				break;
			}
		},

		/**
		 * 体型が変更されたイベント
		 *  ⇒ サイズの絞込を行う。
		 */
		_onRankBodyShapeChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}
			// サイズの絞込
			var rowID = Number($(e.target).val());
			console.log("rowID:" + rowID);
//			this.setRankTableByBodyShape(rowID);
			this.rankDataGrid.setColumns(this.getRankColumns(rowID));
		},

		/**
		 * サンプルファイルダウンロード
		 */
		_onSampleDLClick: function() {
			var sampleURL = "/public/sample/基準在庫サンプル.xlsx";
			clutil.download(sampleURL);
		},

		/**
		 * 基準在庫パターン変更
		 */
		_onBaseStockPtnChange : function(attrs, view, options){
			// 基準在庫パターン在庫数取得(基準在庫パターン指定)
			this.getBaseStockPtn(AMDSV0060Req.AMDSV0060_TYPE_BASESTOCKPTN, attrs.id);
		},

		/**
		 * 基準在庫パターンから複製して作成
		 */
		_onCopyClick: function(e) {
			var baseStockPtn = $('#ca_baseStockPtnID').autocomplete('clAutocompleteItem');
			if (baseStockPtn) {
				// 基準在庫パターン在庫数取得
				this.getBaseStockPtn(AMDSV0060Req.AMDSV0060_TYPE_BASESTOCKPTN, baseStockPtn.id);
			}
		},

		/**
		 * 店舗ランクパターン変更
		 */
		_onStoreRankPtnChange : function(attrs, view, options){
			// 基準在庫パターン在庫数取得(店舗ランク指定)
			this.getBaseStockPtn(AMDSV0060Req.AMDSV0060_TYPE_STORERANK, attrs.id);
		},

		/**
		 * 自動振分停止在庫数変更
		 */
		_onAutoStopQyChange : function(e) {
			var $tgt = $(e.currentTarget);
			var curValue = Number($tgt.val());
			$tgt.val(curValue);

			var rowIndex = Number($tgt.data().rowindex);
			var colIndex = Number($tgt.data().colindex);

			// データ更新
			var ref = this.rankData.body[rowIndex].list[colIndex];
			ref.autoStopQy = curValue;
		},

		/**
		 * 体型が変更されたイベント(店別)
		 *  ⇒ サイズの絞込を行う。
		 */
		_onStoreBodyShapeChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}
			// サイズの絞込
			var rowID = Number($(e.target).val());
//			this.setStoreTableByBodyShape(rowID);
			this.storeDataGrid.setColumns(this.getStoreColumns(rowID));
			// フォーカス
			var $focusElem = $("#ca_storeTable").find("td:not([style='display: none;'])").children("input[type='text']:first");
			clutil.setFocus($focusElem);
		},

		/**
		 * ダウンロードする
		 */
		_onCSVClick: function(){
			// editモードをかりとる
			this.rankDataGrid.stopEditing();
			this.storeDataGrid.stopEditing();

			// リクエストをつくる
			var srchReq = this.buildCSVReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMDSV0060', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * ダウンロード条件をつくる
		 */
		buildCSVReq: function(){
			// 表示から更新データ作成
			var updReq = this.view2UpdReq();

			// 検索条件
			var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
					},
					infoType: AMDSV0060Req.AMDSV0060_TYPE_ITEM,		// 取得情報フラグ(品番別)
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					AMDSV0060GetReq: {
					},
					AMDSV0060UpdReq: updReq
			};

			return req;
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// 新規登録時何もしない
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				return;
			}

			// リクエストをつくる
			var baseStockID = $("#ca_baseStockID").val();
//			var baseStockPtn = $('#ca_baseStockPtnID').autocomplete('clAutocompleteItem');
//			var rankPtn = $('#ca_rankPtnID').autocomplete('clAutocompleteItem');
			var getReq = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
				},
				reqPage: {
				},
				infoType: AMDSV0060Req.AMDSV0060_TYPE_ITEM,	// 取得情報フラグ
				// 基準在庫登録・修正検索リクエスト
				AMDSV0060GetReq: {
					srchBaseStockID: baseStockID,	// 基準在庫ID
					srchItgrpID: 0,					// 品種ID
					srchItemID: 0,					// 商品ID
					srchStoreID: 0,					// 店舗ID
					srchSizePtnID: 0,				// サイズパターンID
					srchBaseStockPtnID: 0,			// 基準在庫パターンID
					srchStoreRankPtnID: 0,			// 店舗ランクID
				},
				// 基準在庫登録・修正更新リクエスト -- 今は検索するので、空を設定
				AMDSV0060UpdReq: {
				},
			};

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMDSV0060', getReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * フッター押下
		 */
		_doOpeAction: function(rtyp, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV
				this.doDownload();
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			//console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var chkData = this.options.chkData[pgIndex];
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},
				infoType: AMDSV0060Req.AMDSV0060_TYPE_ITEM,	// 品番別
				// 基準在庫登録・修正検索リクエスト
				AMDSV0060GetReq: {
					srchBaseStockID: chkData.id,	// 基準在庫ID
					srchItgrpID: 0,					// 品種ID
					srchItemID: 0,					// 商品ID
					srchStoreID: 0,					// 店舗ID
					srchSizePtnID: 0,				// サイズパターンID
					srchBaseStockPtnID: 0,			// 基準在庫パターンID
					srchStoreRankPtnID: 0,			// 店舗ランクID
				},
				// 基準在庫登録・修正更新リクエスト -- 今は検索するので、空を設定
				AMDSV0060UpdReq: {
				}
			};
			this.savedReq = getReq;

			return {
				resId : clcom.pageId,	//'AMDSV0060',
				data: getReq
			};
		},

		hasInputError: function(){
			var hasError = false;

			if (!this.validator.valid()) {
				hasError = true;
			}

			var baseStockRecord = clutil.view2data(this.$('#ca_base_form'));

			// 期間反転チェック
			if (baseStockRecord.fromWeek > baseStockRecord.toWeek) {
				var msg = '開始週と終了週が反転しています';
				this.validator.setErrorMsg($('#ca_fromWeek'), msg);
				this.validator.setErrorMsg($('#ca_toWeek'), msg);
				hasError = true;
			}

			if (baseStockRecord.itemID == 0) {
				var msg = 'メーカー品番が間違っています。';
				this.validator.setErrorMsg($('#ca_itemCode'), msg);
				hasError = true;
			}

			//MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 ここから 2018/12/25
			if (baseStockRecord.upLimitStockType == "2" && baseStockRecord.upLimitStockNum == 0) {
				var msg = '上限在庫数に1以上を登録して下さい。';
				this.validator.setErrorMsg($('#ca_upLimitStockNum'), msg);
				hasError = true;
			}
			//ここまで
			/*
			// 基準在庫パターン、店舗ランクパターン未設定の場合が存在する #20170113
			var rankRecord = clutil.view2data(this.$('#ca_rank_form'));
			if (!rankRecord._view2data_baseStockPtnID_cn && !rankRecord._view2data_rankPtnID_cn) {
				var msg = '基準在庫パターン、又は、店舗ランクパターンを指定して下さい。';
				this.validator.setErrorMsg($('#ca_baseStockPtnID'), msg);
				this.validator.setErrorMsg($('#ca_rankPtnID'), msg);
				hasError = true;
			}
			*/

			return hasError;
		},

		/**
		 * 基準在庫が設定されているかチェック
		 */
		isSetBaseStockQy: function(list, cell){
			var _this = this;
			var isSet = true;
			var listLen = list.length;
			var cellLen = cell.length;
			if (listLen == 0){
				return true;
			} else {
				$.each(list, function(i,v){
					var storeID = this.storeID;
					if (storeID == 0) {
						_this.storeDataGrid.setCellMessage(this._cl_gridRowId, 'store', "error", clutil.fmtargs(clmsg.EDS0005));
						clutil.mediator.trigger("onTicker",  clutil.fmtargs(clmsg.EDS0005));
						isSet = false;
						return false;
					}
//					var baseStockQy = 0;
//					for(var j = 0; j < cellLen; j++){
//						if (cell[j].storeID == storeID){
//							baseStockQy += cell[j].baseStockQy;
//						}
//					}
//					if (baseStockQy == 0) {
//						_this.storeDataGrid.setCellMessage(this._cl_gridRowId, 'store', "error", clutil.fmtargs(clmsg.EDS0006));
//						clutil.mediator.trigger("onTicker",  clutil.fmtargs(clmsg.EDS0006));
//						isSet = false;
//						return false;
//					}
				});
			}
			return isSet;
		},

		/**
		 * 店舗重複がないかチェック
		 */
		isCorrectStore: function(list){
			var _this = this;
			var isCorrect = true;
			var listLen = list.length;
			if (listLen <= 1){
				return true;
			} else {
				$.each(list, function(i,v){
					var storeID = this.storeID;
					for(var j = i+1; j < listLen; j++){
						if (list[j].storeID == storeID){
							_this.storeDataGrid.setCellMessage(this._cl_gridRowId, 'store', "error", clutil.fmtargs(clmsg.EDS0007));
							_this.storeDataGrid.setCellMessage(list[j]._cl_gridRowId, 'store', "error", clutil.fmtargs(clmsg.EDS0007));
							clutil.mediator.trigger("onTicker",  clutil.fmtargs(clmsg.EDS0007));
							isCorrect = false;
							return false;
						}
					}
				});
			}
			return isCorrect;
		},

		/**
		 * 店舗ランクに所属する全店舗が店舗別設定されたかチェック
		 */
		isAllStore: function(rank, store){
//			var _this = this;
			var isAll = true;
			var rankLen = rank.length;
			var storeLen = store.length;
			var storeNum = [];
			for (var i = 0; i < rankLen; i++){
				storeNum[i] = 0;
			}
			if (storeLen == 0){
				return true;
			} else {
				$.each(store, function(i,v){
					var rankID = this.rankID;
					for(var j = 0; j < rankLen; j++){
						if (rank[j].rankID == rankID){
							storeNum[j] += 1;
						}
					}
				});
			}
			$.each(storeNum, function(i){
				if (storeNum[i] == 0) {
					return true;
				}
				var rankData = rank[i];
				if (storeNum[i] == rankData.storeNum) {
					isAll = false;
					return false;
				}
			});
			return isAll;
		},

		isSetRankCell: function(rankCellRecords) {
			var ret = true;	// 全て０でもOKとする。

			if (rankCellRecords != null && rankCellRecords.length != 0) {
				_.each(rankCellRecords, _.bind(function(cell) {
					if (cell.baseStockQy != 0) {
						ret = true;
						return false;
					}
				}, this));
			}
			return ret;
		},

		isSetStoreCell: function(storeCellRecords, storeRecords) {
			var ret = true;	// 全て０でもOKとする。
			var storeMap = {};

			if (storeRecords != null) {
				_.each(storeRecords, _.bind(function(store) {
					storeMap[store.storeID] = store.fDelete != 0;
				}, this));
			}

			if (storeCellRecords != null && storeCellRecords.length != 0) {
				_.each(storeCellRecords, _.bind(function(cell) {
					if (!storeMap[cell.storeID] && cell.baseStockQy != 0) {
						ret = true;
						return false;
					}
				}, this));
			}
			return ret;
		},

		isValidWeek: function(baseStockRec) {
			var from = baseStockRec.fromWeek;
			var to = baseStockRec.toWeek;

			if ((from > 0 && to > 0) || (from == null && to == null)) {
				return true;
			} else {
				this.validator.setErrorMsg($("#ca_fromWeek"), clmsg.EDS0050);
				this.validator.setErrorMsg($("#ca_toWeek"), clmsg.EDS0050);
			}
		},

		/**
		 * 表示から更新データ作成
		 */
		view2UpdReq : function(){
			var rankRecords = [];
			var storeRecords = [];
			var sizeRecords = [];
			var rankCellRecords = [];
			var storeCellRecords = [];

			// 画面入力値をかき集めて、Rec を構築する。
			var baseStockRecord = clutil.view2data(this.$('#ca_base_form'));
			baseStockRecord.unitCodeName = {
				id : baseStockRecord.unitID,
			};
			if (baseStockRecord._view2data_itgrpID_cn) {
				var itgrp = _.pick(baseStockRecord._view2data_itgrpID_cn, 'id', 'code', 'name');
				baseStockRecord.itgrpCodeName = {
					id : itgrp.id,
					code : itgrp.code,
					name : itgrp.name,
				};
			}
			if (baseStockRecord._view2data_makerID_cn) {
				var maker = _.pick(baseStockRecord._view2data_makerID_cn, 'id', 'code', 'name');
				baseStockRecord.makerCodeName = {
					id : maker.id,
					code : maker.code,
					name : maker.name,
				};
			}
			baseStockRecord.itemCodeName = {
				id : baseStockRecord.itemID,
				code : baseStockRecord.itemCode,
				name : baseStockRecord.itemName,
			};
			if (baseStockRecord.autoLogic == null) {
				baseStockRecord.autoLogic = 0;
			}
			if (baseStockRecord.autoType == 1) {
				baseStockRecord.autoLogic = 0;
			}
			var rankRecord = clutil.view2data(this.$('#ca_rank_form'));
			if (rankRecord._view2data_baseStockPtnID_cn) {
				var baseStockPtn = _.pick(rankRecord._view2data_baseStockPtnID_cn, 'id', 'code', 'name');
				baseStockRecord.baseStockPtnCodeName = {
					id : baseStockPtn.id,
					code : baseStockPtn.code,
					name : baseStockPtn.name,
				};
			}
			if (rankRecord._view2data_rankPtnID_cn) {
				var rankPtn = _.pick(rankRecord._view2data_rankPtnID_cn, 'id', 'code', 'name');
				baseStockRecord.rankPtnCodeName = {
					id : rankPtn.id,
					code : rankPtn.code,
					name : rankPtn.name,
				};
			}
			delete baseStockRecord.unitID;
			delete baseStockRecord._view2data_itgrpID_cn;
			delete baseStockRecord._view2data_makerID_cn;
			delete baseStockRecord.itemID;
			delete baseStockRecord.itemCode;
			delete baseStockRecord.itemName;

			// テーブルデータ取得
			var cellLen = 0;
			var tmp;

			if (this.rankData) {
				cellLen = this.rankData.sizeNum;
				var rankData = this.rankDataGrid.getData();
				_.each(rankData, function(rowData){
					if(rowData.isRankRow){
						rankRecords.push({
							_cl_gridRowId : rowData._cl_gridRowId,
							rankID		: rowData.rankID,
							rankCode	: rowData.rankCode,
							rankName	: rowData.rankName,
							storeNum	: rowData.storeNum,
						});
						for (var i = 0; i < cellLen; i++){
							tmp = rowData["colIndex_"+ i +"_field"];
							if (rowData.rowIndex == 0)  {
								sizeRecords.push({
									sizeID		: tmp.sizeID,
									sizeCode	: tmp.sizeCode,
									sizeName	: tmp.sizeName,
									bodyShapeID	: tmp.bodyShapeID,
									autoStopQy	: tmp.autoStopQy,
								});
							}
							rankCellRecords.push({
								rankID		: rowData.rankID,
								sizeID		: tmp.sizeID,
								baseStockQy	: tmp.baseStockQy,
							});
						}
					}
				});
			}
			// sizeRecordsは画面から生成する必要はないのでは？
			if (sizeRecords == null || sizeRecords.length == 0) {
				sizeRecords = this.saveData.sizeRecords;
			}

			if (this.storeData) {
				cellLen = this.storeData.sizeNum;
				var storeData = this.storeDataGrid.getData();
				_.each(storeData, function(rowData){
					if(rowData.isStoreRow /*&& !rowData.isDeleted*/){
						storeRecords.push({
							_cl_gridRowId : rowData._cl_gridRowId,
							rankID		: rowData.rankID,
							rankCode	: rowData.rankCode,
							rankName	: rowData.rankName,
							storeID		: rowData.store.id,
							storeCode	: rowData.store.code,
							storeName	: rowData.store.came,
							fDelete		: rowData.isDeleted ? 1 : 0,	// 削除フラグを追加
						});
						for (var i = 0; i < cellLen; i++){
							tmp = rowData["colIndex_"+ i +"_field"];
							storeCellRecords.push({
								storeID		: rowData.store.id,
								refQy		: tmp.refQy,
								baseStockQy	: tmp.baseStockQy,
								sizeID		: tmp.sizeID,
							});
						}
					}
				});
			}

			var updReq = {
				baseStockRecord : baseStockRecord,
				rankRecords : rankRecords,
				storeRecords : storeRecords,
				sizeRecords : sizeRecords,
				rankCellRecords : rankCellRecords,
				storeCellRecords : storeCellRecords,
			};

			return updReq;
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
//			var _this = this;
			var f_error = false;
			var confirmMsg = null;

			this.validator.clear();

//			if(!this.validator.valid()) {
//				return null;
//			}

			this.rankDataGrid.stopEditing();
			this.storeDataGrid.stopEditing();

			if(this.hasInputError()) {
				this.validator.setErrorHeader(clmsg.cl_echoback);

				var row_alert = [];
				var row_error = ClGrid.getErrorRow(this.storeDataGrid.metadatas.body, this.storeDataGrid.getData(), 0);
				ClGrid.showError(row_alert);
				ClGrid.showError(row_error);

				return null;
			}

			// gridの入力チェック
			this.rankDataGrid.clearCellMessage();
			this.storeDataGrid.clearCellMessage();
			if(!this.rankDataGrid.isValid()){
				f_error = true;
			}
			if(!this.storeDataGrid.isValid()){
				f_error = true;
			}
			if(f_error){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);

				var row_alert = [];
				var row_error = ClGrid.getErrorRow(this.rankDataGrid.metadatas.body, this.rankDataGrid.getData(), 0);
				ClGrid.showError(row_alert);
				ClGrid.showError(row_error);

				return null;
			}

			// 表示から更新データ作成
			var updReq = this.view2UpdReq();

			if (!this.isSetRankCell(updReq.rankCellRecords) && !this.isSetStoreCell(updReq.storeCellRecords, updReq.storeRecords)) {
				clutil.mediator.trigger('onTicker', clmsg.EDS0044);
				return null;
			}

			// 期間の確認
			if (!this.isValidWeek(updReq.baseStockRecord)) {
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return null;
			}

			if (this.storeData) {
				if(!this.isSetBaseStockQy(updReq.storeRecords, updReq.storeCellRecords)){
					return null;
				}

				if(!this.isCorrectStore(updReq.storeRecords)){
					return null;
				}

				if (!this.isAllStore(updReq.rankRecords, updReq.storeRecords)) {
					confirmMsg = clmsg.WDS0002;
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

			var reqObj = {
				reqHead : reqHead,
				infoType: AMDSV0060Req.AMDSV0060_TYPE_ITEM,		// 取得情報フラグ(品番別)
				AMDSV0060UpdReq  : updReq
			};
			console.log(reqObj);
//			return;

			this.savedUpdReq = reqObj;

			return {
				resId : clcom.pageId,	//'AMDSV0060',
				data: reqObj,
				confirm: confirmMsg
			};

//			// Null を渡すと、Ajax 呼び出しを Reject したものと FW 側では見なします。
//			return null;
		},

		_eof: 'AMDSV0060.MainView//'
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
