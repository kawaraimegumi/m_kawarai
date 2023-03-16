// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var AMDSV0120Defs = {
		    AMDSV0120_RESULTTYPE_SUMMARY : 1,
		    AMDSV0120_RESULTTYPE_SALESTOCK : 2,
		    AMDSV0120_STOREINFO_FLOOR : 1,
		    AMDSV0120_STOREINFO_OPENYEAR : 2,
		    AMDSV0120_STOREINFO_DISPNUM : 3,
		    AMDSV0120_STOREINFO_SALE : 4,
		    AMDSV0120_STOREINFO_EXIST : 5
	};

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
			//this.focus();
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
			item[this.args.column.field].distQy = parseInt(state, 10) || 0;
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
			var parentItems = _.where(mainView.dispData.storeInfoRecords, {
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

			var childItems = _.where(mainView.dispData.storeInfoRecords, {
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
				items = _.where(mainView.dispData.storeInfoRecords, {
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
	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'			:	'_onSrchClick',			// 検索ボタン押下時
			'change #ca_srchItemCode'	:	'_onSrchItemCodeChange',	// メーカー品番が変更された
		},

		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
//			var _this = this;
			clutil.inputlimiter(this.$el);

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 検索日(発注開始日)
				datepicker: {
					el: "#ca_srchStOdrDate"
				},
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrpID",
				},
				// サイズパターン
				'clsizeptn_byitgrpselector' : {
					el: "#ca_srchSizePtnID",
					depends: ['itgrp_id'],
				},
				// ブランド
				'clitemattrselector brand': {
					el: "#ca_srchBrandID",
					dependSrc: {
						iagfunc_id: 'brand_id'
					}
				},
				// スタイル
				'clitemattrselector style': {
					el: "#ca_srchStyleID",
					dependSrc: {
						iagfunc_id: 'style_id'
					}
				},
				// 色
				'clitemattrselector color': {
					el: "#ca_srchColorID",
					dependSrc: {
						iagfunc_id: 'color_id'
					}
				},
				// 柄
				'clitemattrselector design': {
					el: "#ca_srchDesignID",
					dependSrc: {
						iagfunc_id: 'design_id'
					}
				},
				// サブクラス1
				'clitemattrselector subclass1': {
					el: "#ca_srchSubClass1ID",
					dependSrc: {
						iagfunc_id: 'subclass1_id'
					}
				},
				// サブクラス2
				'clitemattrselector subclass2': {
					el: "#ca_srchSubClass2ID",
					dependSrc: {
						iagfunc_id: 'subclass2_id'
					}
				},
				// プライスライン
				'select priceline': {
					el: "#ca_srchPriceLineID",
					depends: ['itgrp_id'],
					getItems: function (attrs) {
						var ret = clutil.clpriceline(attrs.itgrp_id);
						return ret.then(function (data) {
							return _.map(data.list, function(item) {
								return {
									id: item.pricelineID,
									code: item.pricelineCode,
									name: item.pricelineName
								};
							});
						});
					}
				},
				// 店舗オートコンプリート
				clorgcode: {
					el: '#ca_srchStoreID',
					// p_org_idに依存するために必要
					addDepends: ['p_org_id'],
					dependSrc: {
						// unit_idをp_org_idに設定するために必要
						p_org_id: 'unit_id'
					}
				},
				// 店舗参照ボタン
				AMPAV0010: {
					button: this.$('#ca_btn_store_select'),
					// this.AMPAV0010SelectorはAMPAV0010SelectorViewインスタンス、あらかじめ
					// 初期化しておく
					view: this.AMPAV0010Selector,
					// this.AMPAV0010Selector.show()へのオプション
					showOptions: function(){
						// 店舗階層のみ表示するようにorg_kind_setを指定する
						return {
							org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
						};
					}
				}

			}, {
				dataSource: {
					brand_id: clconst.ITEMATTRGRPFUNC_ID_BRAND,
					style_id: clconst.ITEMATTRGRPFUNC_ID_STYLE,
					color_id: clconst.ITEMATTRGRPFUNC_ID_COLOR,
					design_id: clconst.ITEMATTRGRPFUNC_ID_DESIGN,
					subclass1_id: clconst.ITEMATTRGRPFUNC_ID_SUBCLS1,
					subclass2_id: clconst.ITEMATTRGRPFUNC_ID_SUBCLS2,
					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
			});

			// 発注日
//			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchStOdrDate'));
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchEdOdrDate'));
			// 納品日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchStDlvDate'));
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchEdDlvDate'));

			// メーカー
			clutil.clvendorcode(this.$("#ca_srchMakerID"), {
				getVendorTypeId: function() {
					return amdb_defs.MTTYPE_F_VENDOR_MAKER;	// メーカー
				},
			});
			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLmakerItemCodeCompleted', this._onCLmakerItemCodeComplete);

			// メーカー品番
//			clutil.clmakeritemcode(this.$('#ca_srchItemCode'), {
//				getMakerId: _.bind(this.getValue, this, 'srchMakerID', 0)
//			});

			// 納品形態
			clutil.cltypeselector(this.$("#ca_srchDlvType"), amcm_type.AMCM_TYPE_DIST_DLV_ROUTE, 1);

//			// 伝票発行状態
//			clutil.cltypeselector(this.$("#ca_srchStatus"), amcm_type.AMCM_TYPE_SLIP_ISSUE, 1);

			// 初期値を設定
//			this.deserialize({
//				srchUnitID: $('#ca_srchUnitID').val(),	// 事業ユニット
//				srchItgrpID: 0,							// 品種
//				srchBrandID: 0,							// ブランド
//				srchStyleID: 0,							// スタイル
//				srchColorID: 0,							// 色
//				srchDesignID: 0,						// 柄
//				srchPriceLineID: 0,						// プライスライン
//				srchSizePtnID : 0,
//				srchSubClass1ID: 0,						// サブクラス1
//				srchSubClass2ID: 0,						// サブクラス2
//				srchMakerID: 0,							// メーカー
//				srchItemCode: null,						// メーカー品番
//				srchDlvType: 0,							// 納品形態
//				srchStoreID: 0,							// 店舗
//				srchStOdrDate: clcom.getOpeDate(),		// 発注日(開始日) yyyymmdd
//				srchEdOdrDate: 0,						// 発注日(終了日) yyyymmdd
//				srchStDlvDate: 0,						// 納品日(開始日) yyyymmdd
//				srchEdDlvDate: 0,						// 納品日(終了日) yyyymmdd
////				srchStatus: 0							// 伝票発行状態
//			});
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
			var retStat = true;

			if(!this.validator.valid()){
				retStat = false;
			}

			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_srchStOdrDate',
				edval : 'ca_srchEdOdrDate'
			});
			chkInfo.push({
				stval : 'ca_srchStDlvDate',
				edval : 'ca_srchEdDlvDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return false;
			}

			// 品種コード・オートコンプリート設定チェック
			if(!this.$('#ca_srchItgrpID').autocomplete('isValidClAutocompleteSelect')){
				// エラーメッセージを通知。
				var arg = {
					_eb_: '品種コードの選択が正しくありません。選択肢の中から指定してください。',
					srchItgrpID: '選択肢の中から指定してください。'
				};
				this.validator.setErrorInfo(arg, {prefix: 'ca_'});
				return false;
			}

			return true;
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 品種コード・オートコンプリート設定チェック
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			//this.trigger('ca_onSearch', dto);
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		/**
		 * メーカー品番
		 */
		_onSrchItemCodeChange: function (e) {
			var data_itgrp = $('#ca_srchItgrpID').autocomplete('clAutocompleteItem');
			if (!data_itgrp) {
				reutrn;
			}
			var data_maker = $('#ca_srchMakerID').autocomplete('clAutocompleteItem');
			var maker_id = data_maker.id;
			var itgrp_id = data_itgrp.id;
			console.log(data_maker);

			var maker_code = $(e.target).val();
			if (maker_code == 0) {
				return;
			}

			var makeritemcode = {
				itgrp_id: itgrp_id,
				maker_id: maker_id,
				maker_code: maker_code,
			};
			console.log(makeritemcode);

			clutil.clmakeritemcode2item(makeritemcode, e);
		},

		/**
		 * メーカー品番→商品取得完了イベント
		 * @param data
		 * @param e
		 */
		_onCLmakerItemCodeComplete: function(data, e) {
			console.log(data.data.rec);
			var msg = clutil.getclmsg(clmsg.EGM0023);
			var arg = "メーカー品番";
			var args = [];
			args.push(arg);

			if (data.status == 'OK') {
				// itemID保存(MtItem)
				this.itemID = data.data.rec.itemID;
				$("#ca_srchItemID").val(data.data.rec.itemID);
				if (data.data.rec.itemID == 0) {
					// エラー EGM0023

					this.validator.setErrorMsg($("#ca_srchItemCode"), clutil.fmtargs(msg, args));
				}
			} else {
				// 検索失敗
				this.itemID = 0;
				$("#ca_srchItemID").val('');
			}
		},

		_eof: 'AMDSV0120.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',	// 店舗選択
			'click #searchAgain'	:	'_onSearchAgainClick',	// 検索条件を再指定ボタン押下
//			'change #ca_table_select1'	: '_onTableSelect1Change',	// テーブル表示項目1変更
//			'change #ca_table_select2'	: '_onTableSelect2Change',	// テーブル表示項目2変更
//			'change #ca_srchSizePtnID'		: '_onSizePtnChange',		// サイズパターン変更
			'change #ca_storeParent'	: '_onStoreParentChange',	// 店舗属性(親)変更時
			'change #ca_storeChild'		: '_onStoreChildChange',	// 店舗属性(子)変更時
			'change #ca_bodyTypeID'		: '_onBodyTypeChange',		// 表示体型変更
			'click #ca_refStock'		: '_onRefStockClick',		// 実績参照ボタン押下
			'click #ca_filter_btn'		: '_onFilterBtnClick'		// 絞込ボタン
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
//				} else if(args.item.isStoreRow && args.cell >= 3){
//					console.log(args);
//					var dataGrid = args.dataGrid;
//					dataGrid.dataView.beginUpdate();
//
//					var item = args.item;
//					var rowTotalDist = 0;
//					for (var i = 0; i < this.dispData.sizeNum; i++){
//						rowTotalDist += item["colIndex_" + i + "_field"].distQy; // 対象行合計
//					}
//					var data = dataGrid.getData();
//					var field = args.column.field;
//					var changedRowIndex = args.item.rowIndex;
//					var columnTotalDist = 0;
//					var totalRow = {};
//					$.each(data, function(){
//						if(this.rowIndex == changedRowIndex){
//							this.rowTotal.distQy = rowTotalDist;	// 行合計を反映
//							dataGrid.dataView.updateItem(this);
//						}
//						if(this.isStoreRow){
//							columnTotalDist += this[field].distQy;	// 列合計
//							return true;
//						}
//						if(this.totalRow){
//							totalRow = this;						// 合計表示行を把握
//						}
//					});
//					totalRow[field].distQy = columnTotalDist;
//					// 総合計
//					var allDist = 0;
//					for (i = 0; i < this.dispData.sizeNum; i++){
//						allDist += totalRow["colIndex_"+ i + "_field"].distQy;
//					}
//					totalRow.rowTotal.distQy = allDist;
//					dataGrid.dataView.updateItem(totalRow);
//					dataGrid.dataView.endUpdate();
//					$("#ca_totalDistQy_div").find("p.num").text(allDist);
//					return;
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
				this.dataGrid.setColumns(this.getColumns(Number(this.$("#ca_bodyTypeID").val()) ));
				return;
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
		uri : "AMDSV0120",
		initialize: function(){
			_.bindAll(this, 'getMetadata');
			_.bindAll(this);
			var _this = this;

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId: -1,
				btn_new : false,
				title: '振分集計',
				subtitle: false,
//				btn_csv : true,
				btn_submit : false
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMDSV0120 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDSV0120';

			// ページャ
//			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

//			// 検索結果リスト
//			this.recListView = new clutil.View.RowSelectListView({
//				el: this.$('#ca_table'),
//				groupid: groupid,
//				template: _.template( $('#ca_rec_template').html() )
//			});

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
					var d = data[0];
					_this.$("#ca_srchStoreID")
					.autocomplete("clAutocompleteItem", {id:d.val, code:d.code, name:d.name});
				}
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
			this.AMPAV0010Selector.clear = function() {
				_this.$("#ca_srchStoreID").autocomplete("removeClAutocompleteItem");
			};
			clutil.datepicker(this.$("#ca_tranStDate"));
			clutil.datepicker(this.$("#ca_tranEdDate"));

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
//			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

//			// スクロールバー設定
//		    $('#innerScroll').perfectScrollbar();

			this.removeSizeList = {};
			// option設定
			clutil.cltypeselector2(this.$("#ca_filterSaleCompType"), this.compList, 1, 1);
			clutil.cltypeselector2(this.$("#ca_filterStockCompType"), this.compList, 1, 1);

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
		},

		getMetadata: function(rowIndex){
			if (rowIndex >= 0 && rowIndex < this.totalIndex) {
				return {
					cssClasses: 'reference'
				};
			}
//			var item = this.dataGrid.dataView.getBodyItem(rowIndex);
//			if(item.body && item.fWarn){
//				return {
//					cssClasses: 'warn-store'
//				};
//			}
		},

		getUpdReq: function(){
			var data = this.dataGrid.getData();
			return data;
		},


		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
//			this.recListView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#ca_tableInfoArea'),
					this.$('#searchAgain'));

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.srchCondView.render();
			this.dataGrid.render();
//			this.recListView.render();

			this.AMPAV0010Selector.render();
			this.AMPAV0010Selector.clear();

//			for(var i = 0; i < this.pagerViews.length; i++){
//				this.pagerViews[i].render();
//			}
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
			return this;
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){
			var options = {
					editList : null,
					isSubDialog : null,
					func_id : 1,
					org_id : Number($("#ca_srchUnitID").val()),
				};
				this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				if(this.srchCondView.isValid()){
					srchReq = this.srchCondView.serialize();
				}else{
					// メッセージは、srchConcView 側で出力済。
					return null;
				}
			}
			srchReq.infoType = AMDSV0120Defs.AMDSV0120_RESULTTYPE_SUMMARY;

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				AMDSV0120GetReq: srchReq
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);
			if(req == null){
				return;
			}
			// 検索実行
			this.doSrch(req);
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行データ（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			console.log(srchReq);
			this.clearResult();

			var defer = clutil.postJSON('AMDSV0120', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMDSV0120GetRsp.cellRecords;
				if(_.isEmpty(recs)){
					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					// 画面を一旦リセット
					mainView.srchAreaCtrl.reset();
					// 検索ペインを表示
//					mainView.srchAreaCtrl.show_both();
					this.srchAreaCtrl.show_srch();
					this.dataGrid.render();
					// フォーカス設定
					this.resetFocus();
					return;
				}
				// テーブルフィルター用オブジェクト
				this.storeFilterData = {
						parentID: 0,
						childID: 0,
						child : null,
						sizeFilter : null
				};
				// データセット
				console.log(data.AMDSV0120GetRsp);
				this.viewSeed = data.AMDSV0120GetRsp;
				this.setDispData(data.AMDSV0120GetRsp, "overWrite");
				// 結果ペインを表示
				this.srchAreaCtrl.show_result();
				// 体型プルダウン
				clutil.clsizerowselector({
					el: '#ca_bodyTypeID',
					dependAttrs: {
						sizePtnID : parseInt(this.$("#ca_srchSizePtnID").val(), 10)
					}
				});
				// 対象サイズプルダウン
				clutil.cltypeselector2(this.$("#ca_filterSizeID"), data.AMDSV0120GetRsp.sizeRecords, 1, 1, "sizeID", "sizeName", "sizeCode");

				this.renderTable();
//				this.setTableHeader();
//				// 内容物がある場合 --> 結果表示する。
//				this.recListView.setRecs(this.dispData.body);
//				this.setTotalRows();
//				this.setStoreInfo1Selector();

				// リクエストを保存。
				this.savedReq = srchReq;

//				// 結果ペインを表示
//				this.srchAreaCtrl.show_result();
//				$('#innerScroll').scrollTop('0');
//				$('#innerScroll').scrollLeft('0');

				console.log("Searched!: " + data);

				// Excelダウンロードボタンを表示する
				this.mdBaseView.options.btn_csv = true;
				this.mdBaseView.renderFooterNavi();

				this.resetFocus($focusElem);

				// 表示位置を調整
				clcom.targetJump('searchAgain', 100);
			}, this)).fail(_.bind(function(data){

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();
				this.clearTable();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				this.resetFocus();

			}, this));

			return defer;
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
					existData	: {name : "既存店", totalAbleQy : 0, list:[]},				// 既存店振分可能数情報
					newData		: {name : "新店", totalAbleQy : 0, list:[]},				// 新店振分可能数情報
					urbanData	: {name : "都心店", totalAbleQy : 0, list:[]},				// 都心店振分可能数情報
					totalData	: {allSaleQy : 0, allStockQy : 0, allDistQy : 0, list:[]},	// 合計行情報
					body				: [],								// テーブル描画情報
					dispItem			: [],								// bodyを参照している
					storeInfoRecords : getRsp.storeInfoRecords,
					selectorRecords : [],									// 店舗絞込セレクタ選択肢
					newStoreMap	:{}
				};
			var hd = tableData.header;
			var bd = tableData.body;
			var ed = tableData.existData;
			var nd = tableData.newData;
			var ud = tableData.urbanData;
			var td = tableData.totalData;
			var sr = tableData.selectorRecords;
			var nm = tableData.newStoreMap;

			if(mode == "marge"){
				viewData = clutil.dclone(this.dispData);
				//実績参照時のみの場合だけ許される技
				getRsp.storeRecords = clutil.dclone(this.viewSeed.storeRecords);
				getRsp.storeInfoRecords = clutil.dclone(this.viewSeed.storeInfoRecords);
				tableData.storeInfoRecords = getRsp.storeInfoRecords;
				getRsp.existCellRecords = clutil.dclone(this.viewSeed.existCellRecords);
				getRsp.newCellRecords = clutil.dclone(this.viewSeed.newCellRecords);
				getRsp.urbanCellRecords = clutil.dclone(this.viewSeed.urbanCellRecords);
//				tableData.hiddenColumnList = viewData.hiddenColumnList;
//				tableData.hiddenRowList = viewData.hiddenColumnList;
			} else if(mode == "overWrite"){
				f_init = true;
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
				rowIndex++;
			});

			var eRecs = getRsp.existCellRecords;
			var nRecs = getRsp.newCellRecords;
			var uRecs = getRsp.urbanCellRecords;
			for (var i = 0; i < cellLoopMax; i++){
				ed.list.push({
					colIndex : i,
					distAble : _.isEmpty(eRecs) ? 0 : eRecs[i].distAbleQy
				});
				ed.totalAbleQy += _.isEmpty(eRecs) ? 0 : eRecs[i].distAbleQy;
				nd.list.push({
					colIndex : i,
					distAble : _.isEmpty(nRecs) ? 0 : nRecs[i].distAbleQy
				});
				nd.totalAbleQy += _.isEmpty(nRecs) ? 0 : nRecs[i].distAbleQy;
				ud.list.push({
					colIndex : i,
					distAble : _.isEmpty(uRecs) ? 0 : uRecs[i].distAbleQy
				});
				ud.totalAbleQy += _.isEmpty(uRecs) ? 0 : uRecs[i].distAbleQy;

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
//				console.log(this.parentTypeID);
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
			clutil.cltypeselector2(this.$("#ca_storeChild"), [], 1);
//			this.$("#ca_storeChild").attr("disabled", true);
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
			var cellData = cellRecordsMap[id] || {
				saleQy	: 0,
				stockQy	: 0,
				distQy	: 0
			};
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
					width: 120,
					cellType: {
						formatter: function(value, options){
							if (options.dataContext.distAbleRow){
								return saleStockDistFormatter({
									col1: '',
									col2: value.distQy
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
				columns.push({
					id : 'colIndex_' + this.colIndex + '_field',
					name : this.sizeName,
					field : 'colIndex_' + this.colIndex + '_field',
					width: 120,
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
							return false;//編集しない
						},
						formatter: function(value, options){
							if (options.dataContext.distAbleRow) {
								return saleStockDistFormatter({
									col2: value.distQy
								});
							}else {
								return totalColFormatter(value, options);
							}
						}
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
							distQy : ed.totalAbleQy,
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
							distQy : ed.totalAbleQy,
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
			this.$("#ca_totalDistQy_div").find("p.num").text(td.allDistQy);
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


//////////////////
//		/** 指定列hide **/
//		hideColumns: function($selectedHeader){
//			var colIndex = $selectedHeader.data().colindex;
//			var findClass = 'cl_' + colIndex;
//
//			$("#ca_table").find('.' + findClass).each(function(){
//				$(this).hide();
//			});
//
//			var colspan = Number($("#ca_sizeRoof_th").attr('colspan')) - 2;
//			$("#ca_sizeRoof_th").attr('colspan', colspan);
//
//			this.resizeTable();
//		},
//
//		/** 再描写時の行リフレッシュ **/
//		refreshRows : function(){
//			var hiddenList = this.dispData.hiddenRowList;
//			var $trs = this.$("#ca_table_tbody").find("tr.ca_list_tr");
//			$trs.each(function(){
//				$(this).show();
//			});
//			$.each(hiddenList, function(){
//				var className = "cl_" + this.rowIndex + "_list_tr";
//				$trs.each(function(){
//					if ($(this).hasClass(className)){
//						$(this).hide();
//					}
//				});
//			});
//			$('#innerScroll').perfectScrollbar('update');
//		},

//		/**
//		 * テーブル表示
//		 */
//		setTableHeader : function(){
//			var $table = this.$("#ca_table");
//			this.clearTable();
//			this.$("#ca_head_tr2").find(".ca_sizecell").remove();
//
//			this.$("#ca_thCell_template").tmpl(this.dispData.header.cell).appendTo($table.find("#ca_head_tr2"));
//			this.$("#ca_sizeRoof_th").attr("colspan", this.dispData.header.head[0].colspan);
//			this.resizeTable();
//		},

//		/**
//		 * テーブルに合計行追加
//		 */
//		setTotalRows : function(){
//			var $table = this.$("#ca_table");
//			var $tbody = $table.find("tbody");
//			var $tr;
//			var ed = this.dispData.existData;
//			var nd = this.dispData.newData;
//			var ud = this.dispData.urbanData;
//			var td = this.dispData.totalData;
//			var $totaltmpl = _.template($("#ca_ref_total_template").html());
//			var $tmpl = _.template($("#ca_enable_total_template").html());
//
//			$tr = $($totaltmpl(td));
//			$tr.prependTo($tbody);
//
//			if (ud.totalAbleQy != 0){
//				$tr = $($tmpl(ud));
//				$tr.prependTo($tbody);
//			}
//			if (nd.totalAbleQy != 0){
//				$tr = $($tmpl(nd));
//				$tr.prependTo($tbody);
//			}
//			if (ed.totalAbleQy != 0){
//				$tr = $($tmpl(ed));
//				$tr.prependTo($tbody);
//			}
//		},
//
//		/** テーブルリサイズ **/
//		resizeTable: function(){
//			var storeSize = 410;
//			var cellSize = 120;
//			var tableSize = storeSize;
//			$("#ca_head_tr2 th.ca_sizecell").each(function(){
//				if ($(this).css('display') != 'none'){
//					tableSize += cellSize;
//				}
//			});
//			$("#div_table").css('width', tableSize + 'px');
//
//			$('#innerScroll').perfectScrollbar('update');
//		},
//		/**
//		 * テーブル表示項目変更
//		 */
//		_onTableSelect1Change : function(e){
//			var select = Number(this.$("#ca_table_select1").val());
//			var $trs = this.$("#ca_table_tbody").find("tr.ca_list_tr");
//			var view = "";
//			switch(select){
//			case 1:// 売場面積
//				view = "floorArea";
//				break;
//			case 2:// 開店年度
//				view = "openYear";
//				break;
//			case 3:// 品種別陳列可能数
//				view = "displayNum";
//				break;
//			case 4:// 年商(前年度)
//				view = "annualSales";
//				break;
//			case 5:// 新店２年目店
//				view = "newStoreType";
//				break;
//			default:
//				break;
//			}
//			if(view == ""){
//				$trs.each(function(){
//					$(this).find(".ca_list_storeData").text("");
//				});
//			} else {
//				$trs.each(function(){
//					$(this).find(".ca_list_storeData").text($(this).data("cl_rec")[view]);
//				});
//			}
//			// 店舗絞込初期化
//			this.setStoreInfo2Selector();
//			this.dispData.hiddenRowList = [];
//			this.refreshRows();
//		},
//
//		/**
//		 * テーブル表示絞込項目変更
//		 */
//		_onTableSelect2Change : function(e){
//			var _this = this;
//			var $sel1 = this.$("#ca_table_select1");
//			var $sel2 = $(e.target);
//			var sel2 = Number($sel2.val());
//			//select1で絞込リストもかわるのでは？
//			var select = Number($sel1.val());
//			var $trs = this.$("#ca_table_tbody").find("tr.ca_list_tr");
//			var view = [];
//			switch(select){
//			case 1:// 売場面積
//				view = "floorAreaID";
//				break;
//			case 2:// 開店年度
//				view = "openYearID";
//				break;
//			case 3:// 品種別陳列可能数
//				view = "displayNumID";
//				break;
//			case 4:// 年商(前年度)
//				view = "annualSalesID";
//				break;
//			case 5:// 新店２年目店
//				view = "newStoreTypeID";
//				break;
//			default:
//				break;
//			}
//			this.dispData.hiddenRowList = [];
//
//			if(_.isEmpty(view) || sel2 === 0){
//
//			} else {
//				$trs.each(function(){
//					if ($(this).data("cl_rec")[view] != sel2){
//						_this.dispData.hiddenRowList.push($(this).data("cl_rec"));
//					}
//				});
//			}
//			this.refreshRows();
//		},
//
//		/**
//		 * 「×」クリック
//		 */
//		_onHeaderClick : function(e){
//			var $tgt = $(e.target);
//			this.hideColumns($tgt);
//			this.dispData.hiddenColumnList.push($tgt);
//		},
//
//		/**
//		 * 「全てを表示」クリック
//		 */
//		_onViewAllClick : function(e){
//			this.dispData.hiddenColumnList = new Array();
//			this.setTableHeader();
//			this.recListView.setRecs(this.dispData.dispItem);
//			this.setTotalRows();
//			this.refreshRows();
//		},

//		/**
//		 * 店舗絞込セレクタset
//		 */
//		setStoreInfo1Selector : function(){
//			var $sel1 = this.$("#ca_table_select1");
//			var $sel2 = this.$("#ca_table_select2");
//			if (this.dispData == null || _.isEmpty(this.dispData.selectorRecords)){
//				$sel1.html(null).attr("disabled", true);
//				$sel2.html(null).attr("disabled", true);
//				clutil.initUIelement(this.$("#div_table"));
//				return;
//			} else {
//				$sel1.html(null).attr("disabled", false);
//				$sel2.html(null).attr("disabled", false);
//			}
//			var sRecs = this.dispData.selectorRecords;
//			clutil.cltypeselector3({
//				$select : $sel1,
//				list : sRecs,
//				unselectedflag : true,
//				namedisp : true
//			});
//			this.setStoreInfo2Selector();
//		},

//		setStoreInfo2Selector : function(){
//			var $sel1 = this.$("#ca_table_select1");
//			var $sel2 = this.$("#ca_table_select2");
//			if (this.dispData == null || _.isEmpty(this.dispData.selectorRecords)){
//				$sel1.html(null).attr("disabled", true);
//				$sel2.html(null).attr("disabled", true);
//				clutil.initUIelement(this.$("#div_table"));
//				return;
//			} else {
//				$sel1.attr("disabled", false);
//				$sel2.html(null).attr("disabled", false);
//			}
//			var sRecs = this.dispData.selectorRecords;
//			var parentID = Number($sel1.val());
//			$.each(sRecs, function(){
//				if(this.id === parentID){
//					clutil.cltypeselector3({
//						$select : $sel2,
//						list : this.childRecords,
//						unselectedflag : true,
//						namedisp : true
//					});
//					return false;
//				}
//			});
//			clutil.initUIelement(this.$("#div_table"));
//		},

///////////////////////
		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMDSV0120', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 初期フォーカス
		 */
		setFocus: function(){
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.setFocus($('#ca_srchItgrpID'));
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFirstFocus($focusElem);
			}else{
				if (this.$('#searchAgain').css('display') == 'none') {
					// 検索ボタンにフォーカスする
					clutil.setFocus(this.$('#ca_srch'));
				} else {
					// 条件を追加ボタンにフォーカスする
					clutil.setFocus(this.$('#searchAgain'));
				}
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
			this.mdBaseView.options.btn_csv = false;
			this.mdBaseView.renderFooterNavi();
		},

		/**
		 * 実績参照ボタンクリック
		 */
		_onRefStockClick : function(){
			// 日付チェック
			if(!this.srchCondView.validator.valid({el:this.$("#ca_ref_term")})){
				return;
			}
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_tranStDate',
				edval : 'ca_tranEdDate'
			});
			if(!this.srchCondView.validator.validFromTo(chkInfo)){
				return;
			}
			var term = clutil.view2data(this.$("#ca_ref_term"));
			if (term.tranEdDate > clcom.getOpeDate()){
				clutil.mediator.trigger("onTicker", "実績参照期間は過去日を指定してください。");
				return;
			}

			var req = {
				reqHead : {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				AMDSV0120GetReq : clutil.dclone(this.savedReq.AMDSV0120GetReq)
			};
			req.AMDSV0120GetReq.infoType = AMDSV0120Defs.AMDSV0120_RESULTTYPE_SALESTOCK;
			return clutil.postJSON(this.uri, req).done(_.bind(function(data){
				// 成功時
				this.setDispData(data.AMDSV0120GetRsp, "marge");
				// テーブルフィルター用オブジェクト初期化
				this.storeFilterData = {
						parentID: 0,
						childID: 0,
						child : null,
						sizeFilter : null
				};
				this.renderTable();

			},this)).fail(function(data){
				clutil.mediator.trigger("onTicker", data);
			});
		},


		// 絞込ボタンクリック
		_onFilterBtnClick : function(){
			this.srchCondView.validator.clear(this.$("#ca_filter_div"));
			$("#ca_filterSaleNum").removeClass('cl_error_field cl_alert_field')
			.removeAttr('data-cl-errmsg');
			$("#ca_filterStockNum").removeClass('cl_error_field cl_alert_field')
			.removeAttr('data-cl-errmsg');
			var fc = clutil.view2data(this.$("#ca_filter_div"));
			fc.filterSizeID = Number(fc.filterSizeID);
			fc.filterSaleCompType = Number(fc.filterSaleCompType);
			fc.filterStockCompType = Number(fc.filterStockCompType);
			var f_error = false;
			if(!fc.filterSizeID && (fc.filterSaleCompType || fc.filterStockCompType)){
				this.srchCondView.validator.setErrorMsg($("#ca_filterSizeID"), "絞込対象サイズを指定してください");
				f_error = true;
			}
			if(fc.filterSaleCompType && fc.filterSaleNum === ""){
				this.srchCondView.validator.setErrorMsg($("#ca_filterSaleNum"), "絞込条件を指定してください");
				f_error = true;
			}
			if(fc.filterStockCompType && fc.filterStockNum === ""){
				this.srchCondView.validator.setErrorMsg($("#ca_filterStockNum"), "絞込条件を指定してください");
				f_error = true;
			}
			if(f_error){
				return;
			} else {
				this.srchCondView.validator.clear(this.$("#ca_filter_div"));
				$("#ca_filterSaleNum").removeClass('cl_error_field cl_alert_field')
				.removeAttr('data-cl-errmsg');
				$("#ca_filterStockNum").removeClass('cl_error_field cl_alert_field')
				.removeAttr('data-cl-errmsg');
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

//		// サイズパターン変更時
//		_onSizePtnChange : function(e){
//			if(parseInt(this.$("#ca_srchSizePtnID").val(), 10)){
//				clutil.clsizerowselector({
//					el: '#ca_bodyTypeID',
//					dependAttrs: {
//						sizePtnID : parseInt(this.$("#ca_srchSizePtnID").val(), 10)
//					}
//				});
//			}
//		},

		// 体型変更時
		_onBodyTypeChange : function(e){
			var bodyTypeID = parseInt(this.$('#ca_bodyTypeID').val(), 10);
			this.dataGrid.setColumns(this.getColumns(bodyTypeID));
		},

		/**
		 * モード振分
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧画面では使用しない*/, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:	// 複製
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
//			this.mdBaseView.clear();
//			this.savedReq = null;
			this.clearTable();
//			this.recListView.clear(); //念のため
		},

		headClear : function(){
			this.$();
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
		 * 店舗属性(親)変更時
		 */
		_onStoreParentChange: function (e) {
			// 書き換える
			var parentID = Number($(e.target).val());
			console.log(parentID);
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
			var childItems = _.where(mainView.dispData.storeInfoRecords, {
				parentTypeID: parentID,
			});
			if (parentID == 5) {
				// TODO:新店・既存店区分の名称が空なので作成
				$.each(childItems, function(i){
					var data = mainView.dispData.newStoreMap[this.typeID];
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

		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(model) {
			// 条件部の復元
			if(!_.isEmpty(model.savedCond)){
				this.srchCondView.deserialize(model.savedCond);
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}

		},

		_eof: 'AMDSV0120.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		mainView = new MainView().initUIElement().render();
		mainView.setFocus();

		if(clcom.pageData){
			mainView.load(clcom.pageData);
		}
	}).fail(function(data){
		console.error('iniJSON failed.');
		console.log(arguments);

		clutil.View.doAbort({
			messages: [
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});
