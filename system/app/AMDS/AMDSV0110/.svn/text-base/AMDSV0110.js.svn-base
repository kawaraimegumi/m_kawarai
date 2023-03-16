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
		if (options.cell === 3){
			label = 'サイズ';
		}else if(options.grid.getColumns().length - 1 === options.cell){
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
				if(args.grid.getColumns().length > 5){
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
			// TODO:表示切替
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

	/**
	 * mainView
	 */
	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			'cl_change #ca_itgrpID'		: '_onUpperSeedChange',
			'cl_change #ca_makerID'		: '_onUpperSeedChange',

			'click #ca_link_store'		: '_onLinkStoreClick',		// 店舗別振分リンク押下時
			"focus #ca_makerItgrpCode"	: "_onmakerItgrpCodeFocus",	// メーカー品種⇒商品検索
			"blur #ca_makerItgrpCode"	: "_onmakerItgrpCodeBlur",	// メーカー品種⇒商品検索
			"click .ca_link_div > a"	: "_onItemLinkClick",		// 商品マスタ参照クリック
			'change #ca_dlvType'		: '_onDlvTypeChange',		// 納品形態変更
			'change #ca_distType'		: '_onDistTypeChange',		// 振分方法変更
			'change #ca_bodyTypeID'		: '_onBodyTypeChange',		// 表示体型変更
			'click #ca_refStock'		: '_onRefStockClick',		// 実績参照ボタン押下
			'click #ca_filter_btn'		: '_onFilterBtnClick',		// 絞込ボタン
			'click #ca_sample_download'	: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
			'click .cl_download'		: '_onCSVClick',			// Excelデータ出力押下
			'change #ca_storeParent'	: '_onStoreParentChange',	// 店舗属性(親)変更時
			'change #ca_storeChild'		: '_onStoreChildChange',	// 店舗属性(子)変更時
			"click .cl_errWrnRowClick"	: "_onErrWrnClick",			// エラー・警告行クリック　2016.06.14山口 追加　エラー行にスクロールできるようにする対応
		},

		//grid発のイベント
		gridEvents: {
			// cell 内容変更
			"cell:change" : function(args){
				var item = args.item;
				if (args.cell === 1 && args.row === 0){
					var fieldName = null;
					switch (item.parentID) {
					case 1:
						fieldName = 'floorArea';
						break;
					case 2:
						fieldName = 'openYear';
						break;
					case 3:
						fieldName = 'displayNum';
						break;
					case 4:
						fieldName = 'annualSales';
						break;
					case 5:
						fieldName = 'newStoreType';
						break;
					default:
					}
					this.storeFilterData.fieldName = fieldName;
					this.storeFilterData.parentID = item.parentID;
					this.storeFilterData.childID = item.childID;
					this.storeFilterData.child = item.child;
					this.onStoreFilterChange();
					return;
				} else if(args.item.isStoreRow && args.cell >= 3){
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
						if(this.isStoreRow){
//							columnTotalDist += this[field].distQy;	// 列合計
							columnTotalDist += ca_editView.myNumber(this[field].distQy); // 列合計
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

//			//2016.06.13 入力エラーの行番号表示機能実装 山口 ここから
//			"cell:change:after" : function(args){
//				var row_error = ClGrid.getErrorRow(args.metadatas.body, this.dataGrid.getData());
//				ClGrid.showErrorAlert(row_error, args.row);
//			},
//			//2016.06.13 入力エラーの行番号表示機能実装 山口 ここまで

			'formatter:hideSize:click': function(e){
				console.log(e);
				this.removeSizeList[e.column.sizeID] = true;
				this.dataGrid.setColumns(this.getColumns( Number(this.$("#ca_bodyTypeID").val()) ));
				return;
			},
			'formatter:showAll:click': function(e){
				console.log(e);
				this.removeSizeList = {};
				this.dataGrid.setColumns(this.getColumns(Number(this.$("#ca_bodyTypeID").val()) ));
				return;
			}
		},

//		// mediator経由のイベント
//		clMediatorEvents: {
//			'storeFilter:change': function(which, storeFilterView){
//				this.storeFilterData.parentID = storeFilterView.parentID;
//				this.storeFilterData.childID = storeFilterView.childID;
//				console.log("which:" + which + ", storeFilterView:" + storeFilterView);
//				if (which === 'child'){
//					// filterを絞り込んで再設定
//				} else {
//					// filter初期化
//					// 情報表示変更
//
//				}
//			}
//		},

		myNumber: function(val) {
			var valStr = val.toString();
			if (!$.isNumeric(val) || valStr.substr(0, 1) == "0" || valStr.length > 4) {
				return 0;
			} else {
				return parseInt(val, 0);
			}
		},

		// 店舗フィルターメソッド
		storeFilter: function(item, args){
			// item : 行データ, args:フィルタ条件オブジェクト
//			var value = item[args.fieldName],
//				typeName = args.child && args.child.typeName;
			var value = item[args.fieldName + "ID"],
				typeID = args.child && args.child.typeID;
			// 店舗情報フィルタ
			var storeInfoFilter = false;
			if(args.fieldName == null
					|| !args.childID
					|| !item.body
					|| value == typeID){
				 storeInfoFilter = true;
			}

			// 実績絞込フィルターが設定されていたらフィルタ
			if(item.body && storeInfoFilter
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
			} else { //
				return storeInfoFilter;
			}
			// 例外:非表示
			console.warn("unexpected filter pattern : [item] " + JSON.stringify(item) + ", [args] " + JSON.stringify(args));
			return false;
		},


		// 店舗フィルター変更時
		onStoreFilterChange: function(){
			// フィルタ引数更新
			this.dataGrid.dataView.setBodyFilterArgs({
				fieldName: this.storeFilterData.fieldName,
				childID: this.storeFilterData.childID,
				child: this.storeFilterData.child,
				sizeFilter : clutil.dclone(this.storeFilterData.sizeFilter)
			});
			this.dataGrid.dataView.setBodyFilter(this.storeFilter);
			this.dataGrid.grid.invalidate();
		},

		//フィルタ用定数
		compList : [{id:1, name:"等しい"},{id:2, name:"以上"},{id:3, name:"以下"}],
		uri : "AMDSV0110",
		initialize: function(opt){
			_.bindAll(this, 'getMetadata');
			_.bindAll(this);
			// カラー単色に自動検索してほしくないときに立てる
			this.NotNeedFlag = false;

			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '品番別振分',
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

			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLmakerItemCodeCompleted', this._onCLmakerItgrpCodeComplete);
			$('.cl_echoback').hide();
			this.validator = clutil.validator($("#ca_headInfoArea"), {
				echoback : $('.cl_echoback')
			});

			clutil.datepicker(this.$("#ca_odrDate"));
			clutil.datepicker(this.$("#ca_dlvDate"));
			clutil.datepicker(this.$("#ca_centerDlvDate"));
			clutil.datepicker(this.$("#ca_tranStDate"));
			clutil.datepicker(this.$("#ca_tranEdDate"));

			// Fieldlimit
			clutil.cltxtFieldLimit($("#ca_makerItgrpCode"));

			// 納品形態
			clutil.cltypeselector(this.$("#ca_dlvType"), amcm_type.AMCM_TYPE_DIST_DLV_ROUTE, 1);
			//振分方法 AMCM_TYPE_FACESTOCK
			clutil.cltypeselector(this.$("#ca_distType"), amcm_type.AMCM_TYPE_FACESTOCK);
//			//センター AMCM_TYPE_DELIV_CENTER
//			clutil.cltypeselector(this.$("#ca_centerID"), amcm_type.AMCM_TYPE_DELIV_CENTER);

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
				// センター
				clorgselector: {
					el: '#ca_centerID',
					dependSrc: {
						p_org_id: 'unit_id',
					},
					dependAttrs: {
						orgfunc_id: orgfunc_id,
						orglevel_id: orglevel_id,
						org_typeid: amcm_type.AMCM_VAL_ORG_KIND_CENTER,
					}
				}
			});

			this.removeSizeList = {};

			// テーブルフィルター用オブジェクト
			this.storeFilterData = {
					parentID: 0,
					childID: 0,
					child : null,
					sizeFilter : null
			};
			// gridインスタンス
			this.dataGrid = new ClGrid.ClAppGridView({
				el: "#div_table",
				delRowBtn :false,
				footerNewRowBtn : false
			});
			this.dataGrid.getMetadata = this.getMetadata;
			this.listenTo(this.dataGrid, this.gridEvents);

			//window resizeイベント
			$(window).on("resize", this.controlHeaderHeight);

			var deff = $.when(
				this.fieldRelation,
				clutil.clvendorcode(this.$("#ca_makerID"), {
					getVendorTypeId : function(){
						return amcm_type.AMCM_VAL_VENDOR_MAKER;
					}
				})
			);

			return deff;
		},

		controlHeaderHeight: function() {
			if ($('.al1').css('display') == 'none'){
			} else {
				var alH = $('.al1').outerHeight();
				console.log("al1"+alH);

				$('#header').css('margin-top', alH);
				$('.cl_echoback').css('margin-top', alH);
			}
		},

		getMetadata: function(rowIndex){
			if (rowIndex >= 0 && rowIndex < this.totalIndex) {
				return {
					cssClasses: 'reference'
				};
			}
			var item = this.dataGrid.dataView.getBodyItem(rowIndex);
			if(item.body && item.fWarn){
				return {
					cssClasses: 'warn-store'
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
					var sizeRecs = [];
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
					var request = {
						AMDSV0110UpdReq: {
							headRecord : clutil.view2data(this.$("#ca_headInfoArea")),
							sizeRecords : sizeRecs
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
				_this.setDispData(_this.viewSeed, "overWrite");
				clutil.cltypeselector2(_this.$("#ca_filterSizeID"), getRsp.sizeRecords, 1, 1, "sizeID", "sizeName", "sizeCode");
				_this.renderTable();
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで
			$("#ca_tp_custType").tooltip({html: true});
			$("#ca_tp_emergencyType").tooltip({html: true});

			return this;
		},

		// 備え
//		beforeChk : function(){
//			return this.validator.valid({$el: this.$(".csv_checked")});
//		},

		render : function(){
			this.mdBaseView.render();
			this.dataGrid.render();
			clutil.inputlimiter(this.$el);
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
			this.defaultTranStDate = stYmd;
			this.defaultTranEdDate = edYmd;
			this.$("#ca_tranStDate").datepicker("setIymd", stYmd);
			this.$("#ca_tranEdDate").datepicker("setIymd", edYmd);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				console.log('tableToggle(false) by render()');
				this.$("#ca_tgtlink_div").show();
				this.tableToggle(false);
			} else {
				this.$("#ca_tgtlink_div").hide();
				this.mdBaseView.fetch();
			}
			return this;
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

			var distIDList = [];
			$.each(this.options.chkData, function(){
				distIDList.push(this.distID);
			});

			var getReq = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				AMDSV0110GetReq: {
					infoType : AMDSV0110Defs.AMDSV0110_RESULTTYPE_ITEM,
					srchUnitID : this.options.unitID,
					srchColorItemID : this.options.chkData[pgIndex].colorItemID,
					srchBaseStockID: this.options.chkData[pgIndex].distID,
					srchTranStDate: this.defaultTranStDate,
					srchTranEdDate: this.defaultTranEdDate,
					distIDList: distIDList
				},
			};

			return {
				resId: "AMDSV0110",
				data: getReq
			};
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
			switch(args.status){
			case 'OK':
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp).always(_.bind(function(){
					// 編集・複製・削除・参照
					if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
						this.$("#ca_unitID," +
								"#ca_itgrpID, " +
								"#ca_makerID, " +
								"#ca_makerItgrpCode, " +
								"#ca_  ID").attr("disabled", true);
						this.$("#ca_unitID").selectpicker("refresh");
						this.$("#ca_colorID").selectpicker("refresh");
//						this.$("form > a.cl-file-attach").attr("disabled",true);
						clutil.setFocus(this.$("#ca_odrDate"));
					}
					if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
						// TODO:一部項目初期化
//						this.$("form > a.cl-file-attach").attr("disabled",true);
						if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
							$tgt = $("#ca_itgrpID");
						}
						else{
							$tgt = $("#ca_unitID");
						}
						clutil.setFocus($tgt);
					}
					if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
							|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
						this.allViewReadonly();
						this.$("#ca_bodyTypeID").attr("disabled", false);
						clutil.initUIelement(this.$("#ca_bodyTypeID").parent());
					}
//					clutil.setFocus(this.$("#ca_odrDate"));
					this._onDlvTypeChange();
					this._onDistTypeChange();
				}, this));
				break;
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp).always(_.bind(function(){
					this.allViewReadonly();
				}, this));
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

		/**
		 * 画面初期化
		 */
		initView : function(){
			clutil.viewRemoveReadonly(this.$("#ca_headInfoArea"));
			var unit = clcom.getUserData().unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				clutil.viewReadonly($("#div_unitID"));
			}
			this.$("#ca_itemName").attr("readonly", true);
			// テーブルフィルター用オブジェクト
			this.storeFilterData = {
					parentID: 0,
					childID: 0,
					child : null,
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
		 * エラー行、警告行クリック時に該当の行までスクロールする処理 2016.06.14 山口 追加
		 */
		_onErrWrnClick: function(args) {
			this.dataGrid.grid.scrollRowIntoView($(args.currentTarget).data('rownum')+1,1);
		},

		/**
		 * 店舗別振分リンク押下処理
		 */
		_onLinkStoreClick: function(e) {
			var url = clcom.appRoot + '/AMDS/AMDSV0111/AMDSV0111.html';
			var destData = {
				// 新規登録
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
			};
			clcom.pushPage(url, destData, null);
		},

		/**
		 * _onmakerItgrpCodeBlur
		 * メーカー品番から商品名等を検索
		 * @param e
		 */
		_onmakerItgrpCodeFocus: function(e) {
			var $tgt = $(e.target);

			this.prevMakerCode = $tgt.val();
		},

		/**
		 * _onmakerItgrpCodeBlur
		 * メーカー品番から商品名等を検索
		 * @param e
		 */
		_onmakerItgrpCodeBlur: function(e) {
			var $tgt = $(e.target);

			var curCode = $tgt.val();

			if (!_.isEqual(this.prevMakerCode, curCode) || !this.isSetMakerCode()) {
				this.setmakerItgrpCode($tgt, null);
			}
		},

		/**
		 * isSetMakerCode
		 * メーカー品番に正しいコードが設定されていたか判定
		 * true:設定されていた
		 * false:設定されていなかった
		 */
				isSetMakerCode : function() {
					var ret = true;
					if (this.makerCodeObj == null
							|| this.makerCodeObj.id == null
							|| this.makerCodeObj.id == ""
							|| this.makerCodeObj.id == 0) {
						ret = false;
					}
					return ret;
				},

		/**
		 * setmakerItgrpCode
		 * メーカー品番設定
		 * カラーが決定済みならカラーも指定
		 * @param $makerItgrpCode
		 * @param colorID
		 */
		setmakerItgrpCode: function($makerItgrpCode, colorID) {
			console.log('2');
			var $tgt = $makerItgrpCode;
			var $headInfo = this.$("#ca_headInfoArea");
			if($tgt.attr('readonly') == "readonly"){
				return;
			}

			var flag = true;

			//品種指定、メーカー指定されていなければリターン
			var inputData = clutil.view2data($headInfo);
			if(!inputData.itgrpID || inputData.itgrpID == null){
				if (colorID === null){ // 入力して検索した場合
					this.validator.setErrorMsg(this.$("#ca_itgrpID"), "品種を指定してください。");
				}
				flag = false;
			}
			if(!inputData.makerID || inputData.makerID == null){
				if (colorID === null){
					this.validator.setErrorMsg(this.$("#ca_makerID"), "メーカーを指定してください。");
				}
				flag = false;
			}

			//メーカー品番指定されていなければ商品、カラーを初期化して戻る
			var code = $tgt.val();
			if(code.length == 0 || flag == false){
				$headInfo.find("#ca_itemName").val(null);
				$headInfo.find("#ca_itemID").val(null);
				$headInfo.find("#ca_sizePtnID").val(null);
				clutil.data2view($headInfo.find("#ca_colorID").parent(), {'colorID' : 0});
				$headInfo.find("#ca_colorID").attr("disabled", true);
				if(this.colorSelector){
					this.colorSelector.off();
				}
				flag = false;
				this.makerCodeObj = null;
			}

			if(flag == false){
				//編集モード終了
				return;
			} else {
				//セレクター用オブジェクト
				var sel_obj = {
						tgt : $tgt,
						colorID : colorID
				};

				//検索用オブジェクト
				var srch_obj = {
					maker_code : code,					// メーカー品番
					itgrp_id : inputData.itgrpID,		// 品種ID
					maker_id : inputData.makerID		// メーカーID
				};

				//検索用関数に品番を渡す
				clutil.clmakeritemcode2item(srch_obj, sel_obj);
			}
		},

		/**
		 * _onCLmakerItgrpCodeComplete
		 * メーカー品番→商品取得完了イベント(clutil.mediator経由)
		 * @param data
		 * @param e
		 */
		_onCLmakerItgrpCodeComplete: function(data, obj) {
			console.log('3');
			var _this = this;
			var $tgt = obj.tgt;
			var $headInfo = this.$("#ca_headInfoArea");
			var colorID = obj.colorID;
			var rec = data.data.rec;
			var itemData = {
					id :rec.itemID,
					name: rec.itemName,
					code: rec.itemCode
			};
			this.makerCodeObj = itemData;

			//セレクター
			var $sel_color = $headInfo.find("#ca_colorID");
			var list = [];

			//コードに該当する商品IDがない場合
			if(itemData.id == ""){
				this.validator.setErrorMsg($tgt, clmsg.EGM0026);

				$headInfo.find("#ca_itemName").val(null);
				$headInfo.find("#ca_itemID").val(null);
				clutil.data2view($sel_color.parent(), {'colorID' : 0});
				$sel_color.attr("disabled", true);
//				$headInfo.find("#ca_colorID").val(0).attr("disabled", true);
				$headInfo.find("#ca_sizePtnID").val(null);

				clutil.cltypeselector2({
					  $select: $sel_color,
					  list: list
				});
				clutil.initUIelement($sel_color);
				console.log('tableToggle(false) by _onCLmakerItgrpCodeComplete()');
				this.tableToggle(false);
				clutil.mediator.trigger("_ca_onSetColorComplete", false);
				return;
			}

			//商品情報表示
			$headInfo.find("#ca_itemName").val(itemData.name);
			$headInfo.find("#ca_itemID").val(itemData.id);

			list = data.data.list;
			$.each(list, function(){
				this.name = this.colorName;
				this.code = this.colorCode;
				this.id = this.colorID;
			});
			//カラーセレクター
			$sel_color.attr("disabled", false);
			clutil.initUIelement($sel_color);
			this.colorSelector = clutil.clcolorselector({
//				emptyLabel: "すべて",

				el: "#ca_colorID",
				dependAttrs: {
					// 期間開始日
					srchFromDate: function(){
						return clutil.dateFormat(_this.$("#ca_odrDate").val(), "yyyymmdd");
					},
					// 期間終了日
					srchToDate: function(){
						return 0;
					},
					// 商品ID
					itemID: function(){
						return _this.$("#ca_itemID").val();
					}
				}
			});

			if(colorID != null){
				clutil.data2view(this.$("#ca_colorID").parent(), {'colorID' : colorID});
//				this.colorSelector.setValue(colorID);
			}

			this.colorSelector.on("change", function(attrs, view, options){
				if(options.changedBy !== 'data2view'){
					console.log("color changed (at least Not by data2view)");
					// 照会・削除時はまず不要
					if ((_this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
							&& _this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL)){
						console.log("NotNeedFlag:" + _this.NotNeedFlag);
						if (_this.NotNeedFlag){
							// 何もしないでほしい
						}else {
							var $colorItemID = _this.$("#ca_colorItemID");
							var $colorItemCode = _this.$("#ca_colorItemCode");
							if (attrs.id != 0){
								$colorItemID.val(attrs.colorItem.id);
								$colorItemCode.val(attrs.colorItem.code);
								_this._onTableSeedChange(this);
							} else {
								$colorItemID.val(0);
								$colorItemCode.val("");
								console.log('tableToggle(false) by _onCLmakerCodeComplete() その２');
								_this.tableToggle(false);
							}
						}
					}
				}
			});

			// 体型セレクタ
			clutil.clsizerowselector({
				el: '#ca_bodyTypeID',
				dependAttrs: {
					sizePtnID: rec.sizePtnID
				}
			});
			this.$("#ca_sizePtnID").val(rec.sizePtnID);
			$.when(this.colorSelector).done(_.bind(function(){
				console.log('4');
				clutil.mediator.trigger("_ca_onSetColorComplete", true);
			}, this));

			// ツールチップ
			$("#ca_tp_cellColor").tooltip({html: true});
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

				//アラート・警告があれば非表示に戻す
				if ($('.al1').css('display') == 'none'){
				} else {
					$('.al1').hide();
					$('#header').css('margin-top', '0px');
					$('.cl_echoback').css('margin-top', '0px');
				}

				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				this.allViewReadonly();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				var cellMessages = [];
				var gridErrors = [];
				_.each(data.rspHead.fieldMessages, function(fm){
					if(fm.field_name == "distQy"){
						gridErrors.push(fm);
					}
				});
				if (gridErrors.length > 0){
					var _this = this;
					var GD = this.dataGrid.getData();
					var row_alert = []; //2016.06.13 入力エラーの行番号表示機能実装 山口
					// フィールドメッセージ毎に対象セルを確認
					_.each(gridErrors, function(fm){
						//gridデータから対象セルを探す
						$.each(GD, function(){
							if(this.isStoreRow && this.storeID == fm.args[0]){
								//2016.06.13 入力エラーの行番号表示機能実装 山口　ここから
								var pushAlert_flg = 0;
								var __this = this;
								$.each(row_alert, function(){
									if (__this.rowIndex + 1 == this.num) {
										pushAlert_flg = 1;
									}
								});
								if (pushAlert_flg == 0){
									row_alert.push({
										num: this.rowIndex + 1
									});
								}
								//2016.06.13 入力エラーの行番号表示機能実装 山口　ここまで
								for (var i = 0; i < _this.dispData.sizeNum; i++){
									if (this["colIndex_" + i + "_field"].sizeID == fm.args[1]){
										if (data.rspHead.message != "EDS0052") {
											cellMessages.push({
												rowId: this._cl_gridRowId,
												colId: "colIndex_" + i + "_field",
												level: 'warn',
												message: clmsg[fm.message]
											});
										} else {
											cellMessages.push({
												rowId: this._cl_gridRowId,
												colId: "colIndex_" + i + "_field",
												level: 'error',
												message: clmsg[data.rspHead.message]
											});
										}
										break;
									}
								}
							}
						});
					});
					//2016.06.13 入力エラーの行番号表示機能実装 山口 ここから
					var row_error = ClGrid.getErrorRow(_this.dataGrid.metadatas.body, _this.dataGrid.getData(), 1);
					ClGrid.showAlert(row_alert);
					if (data.rspHead.message != "EDS0052") {
						ClGrid.showError(row_error);
					} else {
						ClGrid.showError(row_alert);
					}
					//2016.06.13 入力エラーの行番号表示機能実装 山口 ここまで
				}
				if(!_.isEmpty(cellMessages)){
					this.dataGrid.setCellMessage(cellMessages);
				}
				if (data.rspHead.message == "WDS0005"
					|| data.rspHead.message == "WDS0006") {
					var updReq = this.savedUpdReq;
					var send = {
							resId:	"AMDSV0110",
							data: updReq,
							confirm: clmsg[data.rspHead.message]
					};
					this.mdBaseView.forceSubmit(send);
				} else if (data.rspHead.message == "EDS0052") {
					console.log(clmsg[data.rspHead.message]);
					clutil.mediator.trigger("onTicker", clmsg[data.rspHead.message]);
				} else {
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {prefix: 'ca_'});
					clutil.mediator.trigger("onTicker", data);
				}
				break;
			}
		},

		/**
		 * data2view
		 * 振分IDで検索したデータGetRspからの生成
		 * @param getRsp
		 */
		data2view : function(getRsp){
			if(this.colorSelector){
				this.colorSelector.off();
			}
			getRsp.headRecord.unitID = this.options.unitID;
			getRsp.headRecord._view2data_makerID_cn = getRsp.headRecord.makerCodeName;
			getRsp.headRecord._view2data_itgrpID_cn = getRsp.headRecord.itgrpCodeName;
			var headRecord = clutil.dclone(getRsp.headRecord);
			delete headRecord.colorID;
			delete headRecord.colorCodeName;
			clutil.data2view($("#ca_headInfoArea"), headRecord);
			var dfd = $.Deferred();
			this.NotNeedFlag = true;
			clutil.mediator.once("_ca_onSetColorComplete", _.bind(function(isCorrect){
				console.log('100');
				this.setDispData(getRsp, "overWrite");
				clutil.cltypeselector2(this.$("#ca_filterSizeID"), getRsp.sizeRecords, 1, 1, "sizeID", "sizeName", "sizeCode");
				this.tableToggle(true);
				this.dataGrid.render();
				this.renderTable();

				this.NotNeedFlag = false;

				isCorrect ? dfd.resolve() : dfd.reject();
			},this));
			console.log('1');
			this.setmakerItgrpCode(this.$("#ca_makerItgrpCode"), getRsp.headRecord.colorID);
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
					existData : {
						name : "既存店",
						totalAbleQy : 0,
						list:[]
					},
					newData : {
						name : "新店",
						totalAbleQy : 0,
						list:[]
					},
					urbanData : {
						name : "都心店",
						totalAbleQy : 0,
						list:[]
					},
					totalData		: {
						allSaleQy : 0,
						allStockQy : 0,
						allDistQy : 0,
						list:[]
					},
					body				: [],
					dispItem			: [],
					makerItgrpCode	: getRsp.headRecord.makerItgrpCode,
					storeInfoRecords : getRsp.storeInfoRecords,
					sizeNum : 0,
					limitData : [],//各サイズの振分数上限(合計値)
					selectorRecords : [],	// 店舗絞込セレクタ選択肢
					newStoreMap	:{}
				};
			var hd = tableData.header;
			var bd = tableData.body;
			var ed = tableData.existData;
			var nd = tableData.newData;
			var ud = tableData.urbanData;
			var td = tableData.totalData;
			var ld = tableData.limitData;
			var sr = tableData.selectorRecords;
			var nm = tableData.newStoreMap;

			if(mode == "marge"){
				f_init = false;
				viewData = clutil.dclone(this.dataGrid.getData());
				//実績参照時のみの場合だけ許される技
				getRsp.storeRecords = clutil.dclone(this.viewSeed.storeRecords);
				getRsp.storeInfoRecords = clutil.dclone(this.viewSeed.storeInfoRecords);
				tableData.storeInfoRecords = getRsp.storeInfoRecords;
				getRsp.existCellRecords = clutil.dclone(this.viewSeed.existCellRecords);
				getRsp.newCellRecords = clutil.dclone(this.viewSeed.newCellRecords);
				getRsp.urbanCellRecords = clutil.dclone(this.viewSeed.urbanCellRecords);
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
			var colTotalSale = [];
			var colTotalStock = [];
			var colTotalDist = [];
			for(var i = 0; i < cellLoopMax; i++){
				colTotalSale[i] = 0;
				colTotalStock[i] = 0;
				colTotalDist[i] = 0;
			}

			var cellRecordsMap = {};
			$.each(getRsp.cellRecords, function(i, o){
				var id = o.storeID + ':' + o.bodyTypeID + ':' + o.sizeID;
				cellRecordsMap[id] = o;
			});

			// テーブル店舗情報データを生成
			$.each(getRsp.storeRecords, function(){
				var list = [];
				var colIndex = 0;

				var totalSaleQy = 0;
				var totalStockQy = 0;
				var totalDistQy = 0;
				// 各店舗sizecellデータを生成する
				for (var i = 0; i < cellLoopMax; i++){
					var sizeData = getRsp.sizeRecords[i];
					var cellData = _this._getCellData2(cellRecordsMap, this.storeID, sizeData.bodyTypeID, sizeData.sizeID, f_init ? null : _this._getField(viewData, this.storeID, colIndex));
					list.push({
						storeID		: this.storeID,
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
					colTotalSale[colIndex] += cellData.saleQy;
					colTotalStock[colIndex] += cellData.stockQy;
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
//				bd.push({
//					storeCode		: this.storeCode,
//					storeName		: this.storeName,
//					storeID			: this.storeID,
//					floorArea		: this.floorArea,
//					openYear		: this.openYear,
//					displayNum		: this.displayNum,
//					annualSales		: this.annualSales,
//					newStoreType	: this.newStoreType,
//					list			: list
//				});
				rowIndex++;
			});

			var eRecs = getRsp.existCellRecords;
			var nRecs = getRsp.newCellRecords;
			var uRecs = getRsp.urbanCellRecords;
			for (var i = 0; i < cellLoopMax; i++){
				//ed,nd,udについてcellIndex,colIndexを追加
				ed.list.push({
					colIndex : i,
					distAbleQy : _.isEmpty(eRecs) ? 0 : eRecs[i].distAbleQy
				});
				ed.totalAbleQy += _.isEmpty(eRecs) ? 0 : eRecs[i].distAbleQy;
				nd.list.push({
					colIndex : i,
					distAbleQy : _.isEmpty(nRecs) ? 0 : nRecs[i].distAbleQy
				});
				nd.totalAbleQy += _.isEmpty(nRecs) ? 0 : nRecs[i].distAbleQy;
				ud.list.push({
					colIndex : i,
					distAbleQy : _.isEmpty(uRecs) ? 0 : uRecs[i].distAbleQy
				});
				ud.totalAbleQy += _.isEmpty(uRecs) ? 0 : uRecs[i].distAbleQy;

				ld.push({// 合計値比較用
					colIndex : i,
					distAbleQy : ed.list[i].distAbleQy + nd.list[i].distAbleQy + ud.list[i].distAbleQy
				});

				td.list.push({
					colIndex : i,
					saleQy : colTotalSale[i],
					stockQy : colTotalStock[i],
					distQy : colTotalDist[i]
				});
				td.allSaleQy += colTotalSale[i];
				td.allStockQy += colTotalStock[i];
				td.allDistQy += colTotalDist[i];

			}

			// 店舗属性セレクタ作成
			$.each(getRsp.storeInfoRecords,function(){
				if(this.parentTypeID === 0){
					var obj = {
							id : this.typeID,
							name : this.typeName,
							childRecords : []
					};
					$.each(getRsp.storeInfoRecords, function(){
						if(this.parentTypeID === obj.id){
							var cObj = {
									id : this.typeID,
									name : this.typeName
							};
							obj.childRecords.push(cObj);
						}
					});
					sr.push(obj);
				}
			});
			clutil.cltypeselector2(this.$("#ca_storeParent"), sr, 1, 1);
			this.$("#ca_storeChild").attr("disabled", true);
			clutil.initUIelement(this.$("#ca_storeChild").parent());

			// TODO:新店・既存店区分レコード作成
			$.each(bd, function(i, o){
				var id = o.newStoreTypeID;
				nm[id] = o;
			});

			this.dispData = tableData;
			this.dispData.dispItem = this.dispData.body;

		},

		_getField : function(viewData, storeID, colIndex){
			var field = null;
			$.each(viewData, function(){
				if(this.isStoreRow && this.storeID == storeID){
					field = this["colIndex_" + colIndex + "_field"];
					return false;
				}
			});
			return field;
		},

		/** sizeに対応するセルデータ取得 **/
		_getCellData : function(cellList, storeID, bodyTypeID, sizeID, viewData){
			var cellData = {
					saleQy	: 0,
					stockQy	: 0,
					distQy	: 0
			};
			$.each(cellList, function(){
				if (this.storeID == storeID && this.bodyTypeID == bodyTypeID && this.sizeID == sizeID) {
					cellData = clutil.dclone(this);
					return false;
				}
			});
			if(viewData != null){
				cellData.distQy = viewData.distQy;
			}
			return cellData;
		},

		_getCellData2: function(cellRecordsMap, storeID, bodyTypeID, sizeID, viewData){
			var id = storeID + ':' + bodyTypeID + ':' + sizeID;
			var cellData = clutil.dclone(cellRecordsMap[id] || {
				saleQy	: 0,
				stockQy	: 0,
				distQy	: 0
			});
			if(viewData != null){
				cellData.distQy = viewData.distQy;
			}
			return cellData;
		},

		_makeColumsFromSizeData : function(){
			var _this = this;
			if(_.isEmpty(this.dispData.header.cell)){
				return null;
			}
			var columns = [
				{id : 'storeName', name : '店舗名', field : 'storeName', width: 200},
				{
					id: 'saleStockDist',
					name: '',
					field: 'saleStockDist',
					width: 180,
//					headCellType: {
//						editorType: StoreFilterEditor,
//						formatter: function(value, options){
//							var dc = options.dataContext,
//							parentID = dc.parentID,
//							childID = dc.childID,
//							parent = _.where(_this.dispData.storeInfoRecords, {
//								typeID: parentID
//							})[0] || {},
//							child = _.where(_this.dispData.storeInfoRecords, {
//								typeID: childID
//							})[0] || {},
//							template = Marionette.TemplateCache.get('#StoreFilterView');
//							return template({
//								parent: ClGrid.Formatters.selectpicker(parent.typeName||''),
//								child: ClGrid.Formatters.selectpicker(child.typeName||'')
//							});
//						}
//					},
					cellType: {
						formatter: function(value, options) {
							var parentID = _this.storeFilterData.parentID;
							var item = options.dataContext;

							var col1 = '', col2 = '';
							if (item.distAbleRow){
							}else if(item.totalRow){
								col1 = '売上数</br>在庫数', col2 = '振分数';
							}else {
								switch (parentID) {
								case 1:
									col2 = item.floorArea;
									break;
								case 2:
									col2 = item.openYear;
									break;
								case 3:
									col2 = clutil.comma(item.displayNum);
									break;
								case 4:
									col2 = clutil.comma(item.annualSales);
									break;
								case 5:
									col2 = clutil.gettypename(amcm_type.AMCM_TYPE_STORE_YEARTYPE, item.newStoreType, 1);
									break;
								default:
								}
							}

							return saleStockDistFormatter({
								col1: col1,
								col2: col2
							});
						}
					}
				},
				{
					id : 'rowTotal',
					name : '合計',
					field : 'rowTotal',
					width : 130,
					cellType: {
						formatter: function(value, options){
							if (options.dataContext.distAbleRow){
								return saleStockDistFormatter({
									col1: '',
									col2: clutil.comma(value.distQy)
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
					width : 130,
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
									col2: clutil.comma(value.distQy)
								});
							}else if (options.dataContext.totalRow) {
								return totalColFormatter(value, options);
							} else {
								return sizeFormatter(value, options);
							}
						},
						validator: [function(){
							if (!this.item["distAbleRow"] && !this.item["totalRow"]) {
								var value = this.item[fieldName];
								return clutil.Validators.checkAll({
									validator: 'required uint:4',
									value: value && value.distQy
								});
							} else {
								return null;
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
			var ed = dispData.existData;
			var nd = dispData.newData;
			var ud = dispData.urbanData;
			var td = dispData.totalData;
			var columns = this._makeColumsFromSizeData();
			var data = [];
			var tmp;
			if (columns == null){
				return false;	// データなし。
			}
			this.totalIndex = 1;
			// 振分可能数 行
			if (ed.totalAbleQy != 0){
				this.totalIndex++;
				tmp = {
						isStoreRow : false,
						totalRow : false,
						distAbleRow : true,
						rowIndex : this.rowIndex,
						storeName : "既存店振分可能数",
						rowTotal : {
							distQy : ed.totalAbleQy,
							saleQy : "",
							stockQy : ""
						}
				},
				$.each(ed.list, function(){
					tmp["colIndex_" + this.colIndex + "_field"] = {
							colIndex : this.colIndex,
							distQy : this.distAbleQy,
							saleQy : "",
							stockQy : ""
					};
				});
				data.push(tmp);
			}
			if (nd.totalAbleQy != 0){
				this.totalIndex++;
				tmp = {
						isStoreRow : false,
						totalRow : false,
						distAbleRow : true,
						rowIndex : this.rowIndex,
						storeName : "新店振分可能数",
						rowTotal : {
							distQy : nd.totalAbleQy,
							saleQy : "",
							stockQy : ""
						}
				},
				$.each(nd.list, function(){
					tmp["colIndex_" + this.colIndex + "_field"] = {
							colIndex : this.colIndex,
							distQy : this.distAbleQy,
							saleQy : "",
							stockQy : ""
					};
				});
				data.push(tmp);
			}
			if (ud.totalAbleQy != 0){
				this.totalIndex++;
				tmp = {
						isStoreRow : false,
						totalRow : false,
						distAbleRow : true,
						rowIndex : this.rowIndex,
						storeName : "都心店振分可能数",
						rowTotal : {
							distQy : ud.totalAbleQy,
							saleQy : "",
							stockQy : ""
						}
				},
				$.each(ud.list, function(){
					tmp["colIndex_" + this.colIndex + "_field"] = {
							colIndex : this.colIndex,
							distQy : this.distAbleQy,
							saleQy : "",
							stockQy : ""
					};
				});
				data.push(tmp);
			}

			// 合計 行
			tmp = {
					isStoreRow : false,
					totalRow : true,
					distAbleRow : false,
					storeName : "合計",
					rowTotal : {
						distQy : td.allDistQy,
						saleQy : td.allSaleQy,
						stockQy : td.allStockQy
					}
			};
			$.each(td.list, function(){
				tmp["colIndex_" + this.colIndex + "_field"] = this;
			});
			data.push(tmp);

			// 店舗 行
			$.each(dispData.body, function(){
				tmp = {
						isStoreRow : true,
						totalRow : false,
						distAbleRow : false,
						rowIndex : this.rowIndex,
						storeID : this.storeID,
						storeName : "" + this.storeCode + ":" + this.storeName,
						noDataColumn : "",
						// storeInfo
						floorArea		: this.floorArea,
						openYear		: this.openYear,
						displayNum		: this.displayNum,
						annualSales		: this.annualSales,
						newStoreType	: this.newStoreType,
						floorAreaID		: this.floorAreaID,
						openYearID		: this.openYearID,
						displayNumID	: this.displayNumID,
						annualSalesID	: this.annualSalesID,
						newStoreTypeID	: this.newStoreTypeID,
						fWarn			: this.fWarn,
						body: true,
						rowTotal : {
							distQy : this.totalDistQy,
							saleQy : this.totalSaleQy,
							stockQy : this.totalStockQy
						}
				};
				$.each(this.list, function(){
					tmp["colIndex_" + this.colIndex + "_field"] = {
							distQy : this.distQy,
							saleQy : this.saleQy,
							stockQy : this.stockQy,
							colIndex : this.colIndex,
							bodyTypeID : this.bodyTypeID,
							sizeID : this.sizeID
					};
				});
				data.push(tmp);
			});
			this.dataGrid.render().setData({
				gridOptions: {
					frozenColumn : 2,
					frozenRow : this.totalIndex + 1,
					rowHeight: 60,
					autoHeight: false,		// 高さに対して仮想化するため、インナースクロールを入れる。
				},
				columns : columns,
				data : data
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

		/**
		 * テーブル表示
		 */
		setTableHeader : function(){
			var $table = this.$("#ca_table");
			this.clearTable();

			this.$("#ca_thCell_template").tmpl(this.dispData.header.cell).appendTo($table.find("#ca_head_tr2"));
			this.$("#ca_sizeRoof_th").attr("colspan", this.dispData.header.head[0].colspan);
			this.resizeTable();
		},


		_initView : function(){
			this.clearTable();
			clutil.viewRemoveReadonly(this.$("#ca_headInfoArea"));
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
			/*
			 * 無効化チェック
			 */
			if (this.$("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}
			var confirm = null;
			/*
			 * 入力値チェック 削除時はチェックしない
			 */
			if (this.options.opeTypeId  !== am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				// TODO:テーブルフィルター解除

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
					clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
					return null;
				}

				this.dataGrid.clearCellMessage();
				if(!this.dataGrid.isValid()){
					f_error = true;
				}
				if(f_error){
					clutil.mediator.trigger('onTicker', clmsg.cl_echoback);

//					2016.06.13 入力エラーの行番号表示機能実装 山口　ここから
					var row_error = ClGrid.getErrorRow(this.dataGrid.metadatas.body, this.dataGrid.getData(), 1);
					var row_alert = [];
					ClGrid.showAlert(row_alert);
					ClGrid.showError(row_error);
//					2016.06.13 入力エラーの行番号表示機能実装 山口　ここまで

					return null;
				}

				if(!this.isNotOverLimit()){ //振分可能数オーバチェック
					confirm = clmsg.WDS0004;
				}
			}

			var reqHead = {
					opeTypeId : this.options.opeTypeId
			};
			if(this.options.opeTypeId  === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var updReq = this.view2UpdReq();
			if (this.options.opeTypeId  == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				updReq = this.viewSeed;
			}
			var reqObj = {
					reqHead : reqHead,
					AMDSV0110UpdReq  : updReq,
			};

			this.savedUpdReq = reqObj;

			return {
				resId : clcom.pageId,
				data: reqObj,
				confirm : confirm
			};
		},

		/**
		 * 表示から更新データ作成
		 */
		view2UpdReq : function(){
			var _this = this;

			var headRec = clutil.view2data(this.$("#ca_headInfoArea"));
			var storeRecs = [];
			var sizeRecs = [];
			var storeCellRecs = [];
			var cellLen = this.dispData ? this.dispData.sizeNum : 0;
			var gridData = this.dataGrid.getData();
			var tmp;
//			console.log(this.dispData);
			_.each(gridData, function(rowData){
				if(rowData.isStoreRow){
					var store = rowData.storeName.split(':');
					storeRecs.push({
						storeID : rowData.storeID,
						storeCode : store[0],
						storeName : store[1]
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
						tmp.storeID = rowData.storeID;
						storeCellRecs.push(tmp);
					}
				}
			});
			// this.dataGridから更新データ抽出
			var updReq = {
					headRecord : headRec,
					storeRecords : storeRecs,
					sizeRecords : sizeRecs,
					storeCellRecords : storeCellRecs
			};
			return updReq;
		},

		isCorrectDate : function(){
			var isCorrect = true;
			$headInfo = this.$("#ca_headInfoArea");

			var odrDate = clutil.dateFormat($headInfo.find("#ca_odrDate").val(), "yyyymmdd");
			var dlvDate = clutil.dateFormat($headInfo.find("#ca_dlvDate").val(), "yyyymmdd");
			var centerDlvDate = clutil.dateFormat($headInfo.find("#ca_centerDlvDate").val(), "yyyymmdd");

			// 運用日<発注日
			if(odrDate < clcom.getOpeDate()){
				var msg = "発注日は運用日以降の日付を指定してください。";
				this.validator.setErrorMsg($headInfo.find("#ca_odrDate"), msg);
				isCorrect = false;
			}
			// 発注日<納品日
			if(odrDate >= dlvDate){
				this.validator.setErrorMsg($headInfo.find("#ca_odrDate"), clmsg.EDS0008);
				this.validator.setErrorMsg($headInfo.find("#ca_dlvDate"), clmsg.EDS0008);
				isCorrect = false;
			}
			// 発注日<センター納品日
			if(centerDlvDate != ""){
				if(odrDate >= centerDlvDate){
					this.validator.setErrorMsg($headInfo.find("#ca_odrDate"), clmsg.EDS0009);
					this.validator.setErrorMsg($headInfo.find("#ca_centerDlvDate"), clmsg.EDS0009);
					isCorrect = false;
				}
				// センター納品日<=納品日
				if(centerDlvDate > dlvDate){
					this.validator.setErrorMsg($headInfo.find("#ca_centerDlvDate"), clmsg.EDS0010);
					this.validator.setErrorMsg($headInfo.find("#ca_dlvDate"), clmsg.EDS0010);
					isCorrect = false;
				}
				// 納品形態がTCで、振分方法が設定されてた場合、センター納品日==納品日であればエラー
				else if (Number($headInfo.find("#ca_dlvType").val()) == amcm_type.AMCM_VAL_DIST_DLV_ROUTE_TC) {
					if(centerDlvDate == dlvDate){
						var msg = "納品日とセンター納品日は違う日を設定して下さい。";
						this.validator.setErrorMsg($headInfo.find("#ca_centerDlvDate"), msg);
						this.validator.setErrorMsg($headInfo.find("#ca_dlvDate"), msg);
						isCorrect = false;
					}
				}
			}
			return isCorrect;
		},

		// 振分可能数(各値合計)上限>=振分数チェック
		isNotOverLimit: function(){
			var isNotOver = true;
			var data = this.dataGrid.getData();
			var ld = this.dispData.limitData;
			var totalRow = {};
			// 合計行を探す
			$.each(data, function(){
				if(this.totalRow == true){
					totalRow = this;
					return false;
				}
			});
			if(_.isEmpty(totalRow)){
				console.warn("totalRow not found.");
				return false;
			};

			// 合計行と振分可能数データを比較
			for(var i = 0; i < this.dispData.sizeNum; i++){
				if(totalRow["colIndex_" + i + "_field"].distQy > ld[i].distAbleQy){ // 各サイズで振分数合計が振分可能数(新店+既存店+都心店)を超えた場合、エラー
					console.log("limit Over (colIndex:" + i + ", total:" + totalRow["colIndex_" + i + "_field"].distQy + ", distAble:" + ld[i].distAbleQy + ")");
					isNotOver = false;
				}
			}
			return isNotOver;
		},

		/**
		 * ヘッダ部上位リレーション変更時
		 */
		_onUpperSeedChange : function(e){
			console.log(e);
			if(this.NotNeedFlag){
				return;
			}
			if(this.dataGrid){
				this.dataGrid.render();
			}
			this.makerCodeObj = null;
			console.log('tableToggle(false) by _onUpperSeedChange()');
			this.tableToggle(false);
		},


		/**
		 * テーブル元ネタ検索項目の変化により項目を判定し、テーブルネタを検索
		 * @param e
		 */
		_onTableSeedChange : function(e){
			var headInfo = clutil.view2data(this.$("#ca_headInfoArea"));
			if (headInfo.unitID == 0 || headInfo.itgrpID == 0|| headInfo.itemID == 0 || headInfo.colorItemID == 0){
				console.log('tableToggle(false) by _onTableSeedChange()');
				this.tableToggle(false);
				return;
			};

			var req = {
				reqHead : {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL //取得用ID
				},
				AMDSV0110GetReq : {
					infoType : AMDSV0110Defs.AMDSV0110_RESULTTYPE_SIZEITEM,
					srchUnitID : headInfo.unitID,
					srchItgrpID : headInfo.itgrpID,
					srchItemID : headInfo.itemID,
					srchSizePtnID : headInfo.sizePtnID,
					srchColorItemID : headInfo.colorItemID,
					srchTranStDate : this.defaultTranStDate,
					srchTranEdDate : this.defaultTranEdDate
				}
			};
			return clutil.postJSON(this.uri, req).done(_.bind(function(data){
				// 成功時
				this.dispData = null; // 初期化
				if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
					this.viewSeed = {};
					this.viewSeed.storeRecords = data.AMDSV0110GetRsp.storeRecords;
					this.viewSeed.storeInfoRecords = data.AMDSV0110GetRsp.storeInfoRecords;
					this.viewSeed.existCellRecords = data.AMDSV0110GetRsp.existCellRecords;
					this.viewSeed.newCellRecords = data.AMDSV0110GetRsp.newCellRecords;
					this.viewSeed.urbanCellRecords = data.AMDSV0110GetRsp.urbanCellRecords;
				}
				this.setDispData(data.AMDSV0110GetRsp, "overWrite");
				clutil.cltypeselector2(this.$("#ca_filterSizeID"), data.AMDSV0110GetRsp.sizeRecords, 1, 1, "sizeID", "sizeName", "sizeCode");
				this.tableToggle(true);
				this.renderTable();
				this.$("#ca_totalDistQy_div").find("p.num").text(clutil.comma(this.dispData.totalData.allDistQy));
			},this)).fail(function(data){
				clutil.mediator.trigger("onTicker", data);
			});
		},

		/**
		 * 商品参照リンククリック
		 */
		_onItemLinkClick : function(e){
			var url = clcom.appRoot + '/AMMS/AMMSV0100/AMMSV0100.html';
			if(this.$("#ca_itemID").val() == 0){
				return;
			}
			if(!this.validator.valid({$el: this.$("#ca_odrDate").parent()})){
				return;
			}
			var odrDate = clutil.dateFormat(this.$("#ca_odrDate").val(), "yyyymmdd") || clcom.getOpeDate();
			var itemID = this.$("#ca_itemID").val();
			if(itemID != 0){
				var destData = {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
						chkData: [{
							id: Number(this.$("#ca_itemID").val()),						// 商品分類ID
							fromDate : odrDate,											// 適用開始日
							reapproveTypeID: 0,
							itemApproveTypeID: amcm_type.AMCM_VAL_ITEM_APPROVE_APPROVE	// とりあえず承認
						}]
					};
				clcom.pushPage({
					url: url,
					args: destData,
					newWindow: true
				});
			}
			return;
		},


		/**
		 * 納品形態セレクタ変更
		 */
		_onDlvTypeChange : function(e){
			var dlvType = parseInt(this.$('#ca_dlvType').val(), 10);
			if (dlvType == amcm_type.AMCM_VAL_DIST_DLV_ROUTE_TC ||
					dlvType == amcm_type.AMCM_VAL_DIST_DLV_ROUTE_DC) {
				// TC/DCの場合はセンター、センター納品日は必須
				$("#ca_p_centerID").addClass("required");
				$("#ca_centerID").addClass("cl_required");
//				$("#ca_p_centerDlvDate").addClass("required");
//				$("#ca_centerDlvDate").addClass("cl_required");
			} else {
				$("#ca_p_centerID").removeClass("required");
				$("#ca_centerID").removeClass("cl_required");
//				$("#ca_p_centerDlvDate").removeClass("required");
//				$("#ca_centerDlvDate").removeClass("cl_required");
			}
			this._onDistTypeChange();
		},

		/**
		 * 振分方法セレクタ変更
		 */
		_onDistTypeChange : function(e){
			var distType = parseInt(this.$('#ca_distType').val(), 10);
			if (distType == 0) {
				$("#ca_p_centerDlvDate").removeClass("required");
				$("#ca_centerDlvDate").removeClass("cl_required");
			} else {
				var dlvType = parseInt(this.$('#ca_dlvType').val(), 10);
				if (dlvType == amcm_type.AMCM_VAL_DIST_DLV_ROUTE_TC ||
						dlvType == amcm_type.AMCM_VAL_DIST_DLV_ROUTE_DC) {
					// 振分方法が設定されていれば、センター納品日は必須
					$("#ca_p_centerDlvDate").addClass("required");
					$("#ca_centerDlvDate").addClass("cl_required");
				} else {
					$("#ca_p_centerDlvDate").removeClass("required");
					$("#ca_centerDlvDate").removeClass("cl_required");
				}
			}
		},

		/**
		 * 体型セレクタ変更
		 */
		_onBodyTypeChange : function(attrs, view, options){
//			if(options.changedBy !== 'data2view'){
//				var bodyTypeID = parseInt(this.$('#ca_bodyTypeID').val(), 10);
//				this.dataGrid.setColumns(this.getColumns(bodyTypeID));
//			}
			var bodyTypeID = parseInt(this.$('#ca_bodyTypeID').val(), 10);
			this.dataGrid.setColumns(this.getColumns(bodyTypeID));
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
//			delete rec.fundRec.fromDate;
//			delete rec.fundRec.toDate;
//			$.each(rec.fundItemList, function(){
//				delete this.itemFrom;
//				delete this.itemTo;
//			});
			return data;
		},

		/**
		 * 実績参照ボタンクリック
		 */
		_onRefStockClick : function(){
			// 日付チェック
			if(!this.validator.valid({el:this.$("#ca_ref_term")})){
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
			if (headInfo.unitID == 0 || headInfo.itgrpID == 0|| headInfo.itemID == 0 || headInfo.colorItemID == 0){
				return;
			};

			var req = {
				reqHead : {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				AMDSV0110GetReq : {
					infoType		: AMDSV0110Defs.AMDSV0110_RESULTTYPE_SALESTOCK || 6,
					srchUnitID		: headInfo.unitID,
					srchItgrpID		: headInfo.itgrpID,
					srchItemID		: headInfo.itemID,
					srchSizePtnID	: headInfo.sizePtnID,
					srchColorItemID	: headInfo.colorItemID,
					srchTranStDate	: term.tranStDate,
					srchTranEdDate	: term.tranEdDate,
					storeInfoRecords : this.viewSeed.storeInfoRecords
				}
			};
			return clutil.postJSON(this.uri, req).done(_.bind(function(data){
				// 成功時
				this.setDispData(data.AMDSV0110GetRsp, "marge");
				// テーブルフィルター用オブジェクト初期化
				this.storeFilterData = {
						parentID: 0,
						childID: 0,
						child : null,
						sizeFilter : null
				};
				this.renderTable();

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
			//TODO:データ読み込みのタイミングでフィルタ初期化
			this.storeFilterData.sizeFilter = {
					sizeID : fc.filterSizeID,
					saleNum : fc.filterSaleNum,
					stockNum : fc.filterStockNum,
					saleCompType : fc.filterSaleCompType,
					stockCompType : fc.filterStockCompType
			};
			if(!fc.filterSaleCompType && !fc.filterStockCompType){
				this.storeFilterData.sizeFilter = null;
			}
			this.onStoreFilterChange();
		},

		/** テーブル表示トグル **/
		tableToggle : function(flag){
			console.log('tableToggle:' + flag);
			if(flag){
				this.$("#ca_tableInfoArea").show();
			} else {
				this.$("#ca_tableInfoArea").hide();
			}
		},

		/**
		 * サンプルファイルダウンロード
		 */
		_onSampleDLClick: function() {
			var sampleURL = "/public/sample/品番別振分サンプル.xlsx";
			clutil.download(sampleURL);
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

		/**
		 * 店舗属性(親)変更時
		 */
		_onStoreParentChange: function (e) {
			// 書き換える
			var parentID = Number($(e.target).val());
			this.fieldName = null;
			switch (parentID) {
			case 1:
				this.fieldName = 'floorArea';
				break;
			case 2:
				this.fieldName = 'openYear';
				break;
			case 3:
				this.fieldName = 'displayNum';
				break;
			case 4:
				this.fieldName = 'annualSales';
				break;
			case 5:
				this.fieldName = 'newStoreType';
				break;
			default:
				parentID = -1;
			}
			this.storeFilterData.fieldName = this.fieldName;
			this.storeFilterData.parentID = parentID;
			this.storeFilterData.childID = 0;
			this.storeFilterData.child = null;
			this.onStoreFilterChange();
			var childItems = _.where(ca_editView.dispData.storeInfoRecords, {
				parentTypeID: parentID,
			});
			if (parentID == 5) {
				// TODO:新店・既存店区分の名称が空なので作成
				$.each(childItems, function(i){
					var data = ca_editView.dispData.newStoreMap[this.typeID];
					this.typeName = clutil.gettypename(amcm_type.AMCM_TYPE_STORE_YEARTYPE, data.newStoreType, 1);
				});
			}
			clutil.cltypeselector2(this.$("#ca_storeChild"), childItems, 1, 1, "typeID", "typeName");
			if (childItems.length == 0) {
				this.$("#ca_storeChild").attr("disabled", true);
			} else {
				this.$("#ca_storeChild").attr("disabled", false);
				clutil.initUIelement(this.$("#ca_storeChild").parent());
			}
		},

		/**
		 * 店舗属性(子)変更時
		 */
		_onStoreChildChange: function (e) {
			// 書き換える
			var parentID = Number($("#ca_storeParent").val());
			var childID = Number($(e.target).val());
			var child = {
				parentTypeID : parentID,
				typeID : childID,
				typeName : $(e.target).text(),
			};
			this.storeFilterData.fieldName = this.fieldName;
			this.storeFilterData.parentID = parentID;
			this.storeFilterData.childID = childID;
			this.storeFilterData.child = child;
			this.onStoreFilterChange();
		},

		_eof : "end of mainView"
	});



	// 初期データを取る
	clutil.getIniJSON(null, null).done(_.bind(function(data, dataType){
		ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
		//初期フォーカス
		var $tgt = null;
		console.log("opeTypeId="+ ca_editView.options.opeTypeId);
		if (ca_editView.options.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				&& ca_editView.options.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$tgt = $("#ca_itgrpID");
			}
			else{
				$tgt = $("#ca_unitID");
			}
			clutil.setFocus($tgt);
		}
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
