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
		if (options.cell === 3){
			label = 'サイズ';
		}else if(options.grid.getColumns().length - 1 === options.cell){
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
			this.$('input').val(item[this.args.column.field].baseStockQy);
		},

		applyValue: function(item, state){
			item[this.args.column.field].baseStockQy = parseInt(state, 10) || 0;
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
			'click #ca_srch'			:	'_onSrchClick',				// 検索ボタン押下時
//			'change #ca_srchUnitID'		:	'_onSrchUnitChanged',		// 事業ユニットが変更された
			//'change #ca_srchItgrpID'	:	'_onChangeSrchItgrpID',		// 品種が変更された
			'change #ca_srchItemCode'	:	'_onSrchItemCodeChange',	// メーカー品番が変更された
			'change #ca_srchItemCode2'	:	'_onSrchPackCodeChange',	// メーカー品番が変更された
			'change #ca_srchMakerID'	:	'_onsrchMakerIDChange',		// メーカーが変更された
			'change #ca_srchMakerID2'	:	'_onsrchMakerID2Change',		// メーカーが変更された
			'change input[name="ca_codeType"]:radio'	:	'_onCodeTypeChange',	// 品番ラジオボタン変更
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
			var _this = this;
			clutil.inputlimiter(this.$el);

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 検索日
				datepicker: {
					el: "#ca_srchDate"
				},
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrpID",
					clMediatorEvents: {
						change: 'AMDSV0070.ca_srchItgrpID.change'
					}
				},
				// サイズパターン
				'clsizeptn_byitgrpselector': {
					el: "#ca_srchSizePtnID",
					dependSrc: {
						itgrp_id: 'itgrp_id'
					}
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
					el: "#ca_srchSubCls1ID",
					dependSrc: {
						iagfunc_id: 'subclass1_id'
					}
				},
				// サブクラス2
				'clitemattrselector subclass2': {
					el: "#ca_srchSubCls2ID",
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
					ymd: clcom.getOpeDate,
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
				console.log('fieldRelation.done');
			});

			// メーカー
			clutil.clvendorcode($("#ca_srchMakerID"), {
				dependAttrs: {
					unit_id: function() {
						return _this.getValue('srchUnitID', 0);
					},
					vendor_typeid: amdb_defs.MTTYPE_F_VENDOR_MAKER
				}
			});

			// メーカー
			clutil.clvendorcode($("#ca_srchMakerID2"), {
				dependAttrs: {
					unit_id: function() {
						return _this.getValue('srchUnitID', 0);
					},
					vendor_typeid: amdb_defs.MTTYPE_F_VENDOR_MAKER
				}
			});

			if (clcom.userInfo && clcom.userInfo.org_id && clcom.userInfo.org_kind_typeid) {
				// 組織表示
				if (clcom.userInfo.user_typeid && (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN)) {
					// 店舗ユーザー
					clutil.inputReadonly($('#ca_srchStoreID'));
					clutil.inputReadonly($('#ca_btn_store_select'));
				}
			}
			clutil.mediator.on('AMDSV0070.ca_srchItgrpID.change', this._onChangeSrchItgrpID);
			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLmakerItemCodeCompleted', this._onCLmakerItemCodeComplete);
			this._onCodeTypeChange();
			this._onChangeSrchItgrpID();


			// 初期値を設定
			this.deserialize({
				srchUnitID: clcom.userInfo.unit_id,		// 事業ユニット
				srchItgrpID: 0,							// 品種
				srchBrandID: 0,							// ブランド
				srchStyleID: 0,							// スタイル
				srchColorID: 0,							// 色
				srchDesignID: 0,						// 柄
				srchPriceLineID: 0,						// プライスライン
				srchSubCls1ID: 0,						// サブクラス1
				srchSubCls2ID: 0,						// サブクラス2
				srchMakerID: 0,							// メーカー
				srchMakerCode: null,					// メーカー品番
				srchDate: clcom.getOpeDate(),			// 検索日 yyyymmdd
				codeType: "1",							// 商品: ラジオボタン
//				srchStoreID: 0							// 店舗
			});
		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			var dto = clutil.view2data(this.$el);
			var srchItemCond = null;
			var srchMakerCond = null;
			var srchPackCond = null;

			var val = Number(dto.codeType);
			switch (val) {
			case 1:		// 商品属性絞込
				srchItemCond = {
					srchBrandID: dto.srchBrandID,
					srchStyleID: dto.srchStyleID,
					srchColorID: dto.srchColorID,
					srchDesignID: dto.srchDesignID,
					srchPriceLineID: dto.srchPriceLineID,
					srchSubCls1ID: dto.srchSubCls1ID,
					srchSubCls2ID: dto.srchSubCls2ID,
					srchMakerID: dto.srchMakerID
				};
				break;
			case 2:		// メーカー品番絞込
				srchMakerCond = {
					srchMakerID: dto.srchMakerID2,
					srchItemCode: dto.srchItemCode,
					srchItemID: dto.srchItemID,
				};
				break;
			case 3:		// 集約品番絞込
				srchPackCond = {
					srchItemCode: dto.srchItemCode2,
					srchItemID: dto.srchItemID2,
				};
				break;
			}
			_.extend(dto, {
				srchSelect: val,
				srchItemCond: srchItemCond,
				srchMakerCond: srchMakerCond,
				srchPackCond: srchPackCond
			});
			return dto;
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
			var radio = $("input:radio[name=ca_codeType]:checked");
			var val = Number(radio.val());

			// 初期状態: 指定なし
			if (isNaN(val)) {
				return false;
			}
			if(!this.validator.valid()){
				retStat = false;
			}

			if (val == 2) {
				// メーカー品番絞り込の場合
				var $tgt = $("#ca_srchItemCode");
				var itemCode = $tgt.val();
				if (itemCode == null || itemCode == 0) {
					var msg = clutil.getclmsg(clmsg.EGM0023);
					var arg = "メーカー品番";
					var args = [];
					args.push(arg);
					this.validator.setErrorMsg($tgt, clutil.fmtargs(msg, args));

					retStat = false;
				}
				var srchItemID = $("#ca_srchItemID").val();
				if (srchItemID == null || srchItemID == 0) {
					var msg = clutil.getclmsg(clmsg.EGM0023);
					var arg = "メーカー品番";
					var args = [];
					args.push(arg);
					this.validator.setErrorMsg($tgt, clutil.fmtargs(msg, args));

					retStat = false;
				}
			} else if (val == 3) {
				var $tgt = $("#ca_srchItemCode2");
				var itemCode = $tgt.val();
				if (itemCode == null || itemCode == 0) {
					var msg = clutil.getclmsg(clmsg.EGM0023);
					var arg = "集約品番";
					var args = [];
					args.push(arg);
					this.validator.setErrorMsg($tgt, clutil.fmtargs(msg, args));

					retStat = false;
				}
				var srchItemID = $("#ca_srchItemID2").val();
				if (srchItemID == null || srchItemID == 0) {
					var msg = clutil.getclmsg(clmsg.EGM0023);
					var arg = "集約品番";
					var args = [];
					args.push(arg);
					this.validator.setErrorMsg($tgt, clutil.fmtargs(msg, args));

					retStat = false;
				}
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
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
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
			//console.log(e);
			if(this.deserializing){
				// データセット中
				return;
			}
			var unitID = Number($("#ca_srchUnitID").val());
			mainView.getOrg(unitID);
			mainView.storeAutocomplete.setValue();
			this.$("#ca_srchStoreID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_store_select").attr("disabled", (unitID == 0));
			mainView.AMPAV0010Selector.clear();
		},

		_onChangeSrchItgrpID: function(e) {
			if(this.deserializing){
				// データセット中
				return;
			}

			var $ca_srchItgrpID = $("#ca_srchItgrpID");
			var val = $ca_srchItgrpID.autocomplete('clAutocompleteItem');

			//var $radio = $("input[name='ca_codeType']");
			var $div_radio = $("div.div_radio");

			var $div_srchItemCond = this.$("#div_srchItemCond");
			var $div_srchMakerCond = this.$("#div_srchMakerCond");
			var $div_srchPackCond = this.$("#div_srchPackCond");

			if (val == null || val == "") {
				// 未選択なので、ラジオボタンをdisableにする
				//clutil.inputReadonly($radio);
				clutil.viewReadonly($div_radio);
				clutil.viewReadonly($div_srchItemCond);
				clutil.viewReadonly($div_srchMakerCond);
				clutil.viewReadonly($div_srchPackCond);
			} else {
				// 選択されたのでラジオボタンをenableにする
				//clutil.inputRemoveReadonly($radio);
				clutil.viewRemoveReadonly($div_radio);
				this._onCodeTypeChange();
			}
		},

		/**
		 * 商品属性絞込のメーカーが変更された
		 */
		_onsrchMakerIDChange: function (e) {
			// 特にすることはない
		},

		/**
		 * メーカー品番絞込のメーカーが変更された
		 */
		_onsrchMakerID2Change: function (e) {
			$('#ca_srchItemCode').trigger('change');
		},

		/**
		 * メーカー品番
		 */
		_onSrchItemCodeChange: function (e) {
			var maker_id = 0;
			var radio = $("input:radio[name=ca_codeType]:checked");
			var val = Number(radio.val());

			var data_itgrp = $('#ca_srchItgrpID').autocomplete('clAutocompleteItem');
			if (!data_itgrp) {
				reutrn;
			}
			var data_maker = $('#ca_srchMakerID2').autocomplete('clAutocompleteItem');
			if (val != 2 && !data_maker) {
				return;
			} else if (data_maker != null) {
				maker_id = data_maker.id;
			}
			var itgrp_id = data_itgrp.id;
			console.log(data_maker);

			var maker_code = $(e.target).val();
			if (maker_code == 0) {
				return;
			}

			var f_pack = val == 3 ? 1 : 0;

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
		 * 集約品番
		 */
		_onSrchPackCodeChange: function (e) {
			var maker_id = 0;
			var radio = $("input:radio[name=ca_codeType]:checked");
			var val = Number(radio.val());

			var data_itgrp = $('#ca_srchItgrpID').autocomplete('clAutocompleteItem');
			if (!data_itgrp) {
				reutrn;
			}
			var itgrp_id = data_itgrp.id;

			var maker_code = $(e.target).val();
			if (maker_code == 0) {
				return;
			}

			var f_pack = val == 3 ? 1 : 0;

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
		_onCLmakerItemCodeComplete: function(data, e) {
			console.log(data.data.rec);
			var radio = $("input:radio[name=ca_codeType]:checked");
			var val = Number(radio.val());
			var msg = clutil.getclmsg(clmsg.EGM0023);
			var arg = "";

			var $srchItemID = null,
				$srchItemCode = null;

			if (val == 2) {
				arg = "メーカー品番";
				$srchItemCode = $("#ca_srchItemCode");
				$srchItemID = $("#ca_srchItemID");
			} else if (val == 3) {
				arg = "集約品番";
				$srchItemCode = $("#ca_srchItemCode2");
				$srchItemID = $("#ca_srchItemID2");
			}
			var args = [];
			args.push(arg);

			if (data.status == 'OK') {
				// itemID保存(MtItem)
				this.itemID = data.data.rec.itemID;
				$srchItemID.val(data.data.rec.itemID);
				if (data.data.rec.itemID == 0) {
					// エラー EGM0023

					this.validator.setErrorMsg($srchItemCode, clutil.fmtargs(msg, args));
				}
			} else {
				// 検索失敗
				this.itemID = 0;
				$srchItemID.val('');
			}
		},

		/**
		 * 品番選択ラジオボタン変更
		 * @param e
		 */
		_onCodeTypeChange: function(e) {
			var $radio = this.$("input[name='ca_codeType']:checked");
			if ($radio.length == 0) {
				return false;
			}

			var $div_srchItemCond = this.$("#div_srchItemCond");
			var $div_srchMakerCond = this.$("#div_srchMakerCond");
			var $div_srchPackCond = this.$("#div_srchPackCond");

			var val = Number($radio.val());

			if (!$radio.prop('checked')) {
				return;
			}

			this.validator.clear();

			console.log(val);

			var $maker_cd2 = $("#maker_cd2");
			var $ca_srchMakerID2 = $("#ca_srchMakerID2");
			var $ca_srchMakerID = $("#ca_srchMakerID");
			var $ca_srchItemCode2 = $("#ca_srchItemCode2");
			var $ca_srchItemID2 = $("#ca_srchItemID2");
			var $ca_srchItemCode = $("#ca_srchItemCode");
			var $ca_srchItemID = $("#ca_srchItemID");

			var srchMakerID = $ca_srchMakerID.autocomplete('clAutocompleteItem');
			var srchMakerID2 = $ca_srchMakerID2.autocomplete('clAutocompleteItem');

			var item_id = $ca_srchItemID.val();
			var pack_id = $ca_srchItemID2.val();

			switch (val) {
			case 1:		// 商品属性絞込
				clutil.viewRemoveReadonly($div_srchItemCond);
				clutil.viewReadonly($div_srchMakerCond);
				clutil.viewReadonly($div_srchPackCond);

				$maker_cd2.removeClass('required');
				$ca_srchMakerID2.removeClass('cl_required');

				// メーカーをクリア
				if (srchMakerID2 == null) {
					$ca_srchMakerID2.val('');
					// メーカー品番をクリア
					$ca_srchItemCode.val('');
					$ca_srchItemID.val('');
				}
				// メーカー品番をクリア
				if (item_id == "" || item_id == 0) {
					$ca_srchItemCode.val('');
					$ca_srchItemID.val('');
				}
				// 集約品番をクリア
				if (pack_id == "" || pack_id == 0) {
					$ca_srchItemCode2.val('');
					$ca_srchItemID2.val('');
				}
				break;
			case 2:		// メーカー品番絞込
				clutil.viewReadonly($div_srchItemCond);
				clutil.viewRemoveReadonly($div_srchMakerCond);
				clutil.viewReadonly($div_srchPackCond);

				$maker_cd2.addClass('required');
				$ca_srchMakerID2.addClass('cl_required');

				// メーカーをクリア
				if (srchMakerID == null) {
					$ca_srchMakerID.val('');
				}
				// 集約品番をクリア
				if (pack_id == "" || pack_id == 0) {
					$ca_srchItemCode2.val('');
					$ca_srchItemID2.val('');
				}
				break;
			case 3:		// 集約品番絞込
				clutil.viewReadonly($div_srchItemCond);
				clutil.viewReadonly($div_srchMakerCond);
				clutil.viewRemoveReadonly($div_srchPackCond);

				$maker_cd2.removeClass('required');
				$ca_srchMakerID2.removeClass('cl_required');

				// メーカーをクリア
				if (srchMakerID == null) {
					$ca_srchMakerID.val('');
				}
				if (srchMakerID2 == null) {
					$ca_srchMakerID2.val('');
					// メーカー品番をクリア
					$ca_srchItemCode.val('');
					$ca_srchItemID.val('');
				}
				// メーカー品番をクリア
				if (item_id == "" || item_id == 0) {
					$ca_srchItemCode.val('');
					$ca_srchItemID.val('');
				}
				break;
			}
//			switch (val) {
//			case 0:	// 指定なし
//				// 品番を入力不可にする
//				clutil.inputReadonly('#ca_srchItemCode');
//				// 必須を外す
//				$("#div_itemCode").removeClass('required');
//				$("#ca_srchItemCode").removeClass('cl_required');
//				$("#ca_srchItemCode").removeClass('cl_valid');
//				$("#ca_srchMakerID").removeClass('cl_required');
//				$("#maker_cd").removeClass('required');
//				// 品番をクリアする
//				$("#ca_srchItemCode").val('');
//				$("#ca_srchItemID").val('');
//				break;
//			case 1:	// メーカー品番
//				// ラベルを「メーカー品番」に変更する
//				$("#p_itemCode").text('メーカー品番');
//				// 品番を入力可にする
//				clutil.inputRemoveReadonly('#ca_srchItemCode');
//				// 必須を外す
//				$("#maker_cd").addClass('required');
//				$("#div_itemCode").addClass('required');
//				$("#ca_srchItemCode").addClass('cl_required');
//				$("#ca_srchItemCode").addClass('cl_valid');
//				$("#ca_srchMakerID").addClass('cl_required');
//				if ($('#ca_srchItemCode').val()){
//					$('#ca_srchItemCode').trigger('change');
//				}
//				break;
//			case 2:	// 集約品番
//				// ラベルを「集約品番」に変更する
//				$('#p_itemCode').text('集約品番');
//				// 品番を入力可にする
//				clutil.inputRemoveReadonly('#ca_srchItemCode');
//				// 必須を外す
//				$("#maker_cd").removeClass('required');
//				$("#ca_srchMakerID").removeClass('cl_required');
//				$("#div_itemCode").addClass('required');
//				$("#ca_srchItemCode").addClass('cl_required');
//				$("#ca_srchItemCode").addClass('cl_valid');
//				if ($('#ca_srchItemCode').val()){
//					$('#ca_srchItemCode').trigger('change');
//				}
//				break;
//			}

		},

		_eof: 'AMDSV0070.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #ca_btn_store_select'	:	'_onStoreSelClick',		// 店舗選択
			'click #searchAgain'			:	'_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'change #ca_storeParent'		:	'_onStoreParentChange',	// 店舗属性(親)変更時
			'change #ca_storeChild'			:	'_onStoreChildChange',	// 店舗属性(子)変更時
			'click #ca_closeIcon'			:	'_onHeaderClick',		// 「×」押下
			'click #ca_viewAll'				:	'_onViewAllClick',		// 「全て表示」押下
		},

		// grid発のイベント
		gridEvents: {
			// cell 内容変更
//			"cell:change" : function(args){
//				var item = args.item;
//				if (args.cell === 1 && args.row === 0){
//					var fieldName = null;
//					switch (item.parentID) {
//					case 1:
//						fieldName = 'floorArea';
//						break;
//					case 2:
//						fieldName = 'openYear';
//						break;
//					case 3:
//						fieldName = 'displayNum';
//						break;
//					case 4:
//						fieldName = 'annualSales';
//						break;
//					case 5:
//						fieldName = 'newStoreType';
//						break;
//					default:
//					}
//					this.storeFilterData.fieldName = fieldName;
//					this.storeFilterData.parentID = item.parentID;
////					this.storeFilterData.childID = item.childID;
////					this.storeFilterData.child = item.child;
//					this.onStoreFilterChange();
//					return;
//				}
//			},

			'formatter:hideSize:click': function(e){
				console.log(e);
				this.removeSizeList[e.column.sizeID] = true;
				this.dataGrid.setColumns(this.getColumns(0));
				return;
			},
			'formatter:showAll:click': function(e){
				console.log(e);
				this.removeSizeList = {};
				this.dataGrid.setColumns(this.getColumns(0));
				return;
			}
		},

		// 店舗フィルターメソッド
		storeFilter: function(item, args){
			// item : 行データ, args:フィルタ条件オブジェクト
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

//			// 例外:非表示
//			console.warn("unexpected filter pattern : [item] " + JSON.stringify(item) + ", [args] " + JSON.stringify(args));
			return storeInfoFilter;
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

		initialize: function(){
			_.bindAll(this);
			var _this = this;

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId: -1,
				title: '基準在庫集計',
				subtitle: '',
				btn_csv: false,
				btn_submit: false
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

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
					$('#ca_srchStoreID').autocomplete('clAutocompleteItem', {id: id, code: code, name: name});
				} else {
					var chk = $('#ca_srchStoreID').autocomplete('clAutocompleteItem');
					if (chk === null || chk.length == 0) {
						_this.AMPAV0010Selector.clear();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
			this.AMPAV0010Selector.clear = function() {
				if (typeof mainView != "undefined") {
					$('#ca_srchStoreID').autocomplete('removeClAutocompleteItem');
				}
			};
			// 店舗オートコンプリート
			this.storeAutocomplete = this.getOrg(-1);

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			this.removeSizeList = {};

			// gridインスタンス
			this.dataGrid = new ClGrid.ClAppGridView({
				el: "#ca_datagrid",
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
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.srchCondView.render();

			this.AMPAV0010Selector.render();

			return this;
		},

		/**
		 * 店舗オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: $("#ca_srchStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				},
			});
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
				org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
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
					return;
				}
			}

			// 検索条件
			var req = {
				reqHead: {
					//{ name = 'AM_PROTO_COMMON_RTYPE_NEW',        val = 1, description = '新規登録' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_UPD',        val = 2, description = '編集' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_DEL',        val = 3, description = '削除' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_REL',        val = 4, description = '参照' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_CSV',        val = 5, description = 'CSV出力' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_CSV_INPUT',  val = 6, description = 'CSV取込' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_COPY',       val = 7, description = '複製' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_PDF',        val = 8, description = 'PDF出力' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_DELCANCEL',  val = 9, description = '削除復活' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_RSVCANCEL',  val = 10, description = '予約取消' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_TMPSAVE',    val = 11, description = '一時保存' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_APPLY',      val = 12, description = '申請' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_APPROVAL',   val = 13, description = '承認' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_PASSBACK',   val = 14, description = '差戻し' },
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMDSV0070GetReq: srchReq
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);

			// 検索実行
			this.doSrch(req);
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedIds, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMDSV0070', srchReq).done(_.bind(function(data){
				this.srchDoneProc(srchReq, data);

			}, this)).fail(_.bind(function(data){
				this.srchFailProc(data);

			}, this));

			return defer;
		},

		srchDoneProc: function(srchReq, data, $focusElem){
			// データ取得
			var recs = data.AMDSV0070GetRsp.cellRecords;

			if (_.isEmpty(recs)) {
				// エラーメッセージ表示
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペイン／結果ペインを表示
//				mainView.srchAreaCtrl.show_both();
				this.srchAreaCtrl.show_srch();
				this.dataGrid.render();

				// フォーカス設定
				this.resetFocus();
			} else {
				// テーブルフィルター用オブジェクト
				this.storeFilterData = {
						parentID: 0,
						childID: 0,
						child : null,
						sizeFilter : null
				};
				// データセット
				this.viewSeed = data.AMDSV0070GetRsp;
				this.setDispData(data.AMDSV0070GetRsp);
				// 結果ペインを表示
				this.srchAreaCtrl.show_result();
				this.renderTable();

				// リクエストを保存。
				this.savedReq = srchReq;

				// Excelダウンロードボタンを表示する
				this.mdBaseView.options.btn_csv = true;
				this.mdBaseView.renderFooterNavi();

				// フォーカスの設定
				var $focusElem = $("#ca_storeType");
				clutil.setFocus($focusElem);

				// 表示位置を調整
				clcom.targetJump('searchAgain', 100);
			}
		},

		srchFailProc: function(data){
			// 画面を一旦リセット
			mainView.srchAreaCtrl.reset();
			// 検索ペインを表示
			mainView.srchAreaCtrl.show_srch();
			this.clearTable();

			// エラーメッセージを通知。
			clutil.mediator.trigger('onTicker', data);

			// フォーカスの設定
			this.resetFocus();
		},

		/**
		 * 表示データ更新
		 */
		setDispData : function(getRsp){
			var _this = this;

			// 表示テーブルデータ
			var tableData = {
					header				: {
						head	: [], // colspanデータ
						cell	: [], // sizetdデータ
					},
					totalData	: {allBaseStockQy : 0, list:[]},	// 合計行情報
					body				: [],								// テーブル描画情報
					dispItem			: [],								// bodyを参照している
					storeInfoRecords : getRsp.storeInfoRecords,
					selectorRecords : [],									// 店舗絞込セレクタ選択肢
					newStoreMap	:{},
					sizeNum : 0
				};
			var hd = tableData.header;
			var bd = tableData.body;
			var td = tableData.totalData;
			var sr = tableData.selectorRecords;
			var nm = tableData.newStoreMap;

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
			hd.head.push({colspan:index});
			tableData.sizeNum = index;

			var cellLoopMax = index;
			var cellIndex = 0;
			var rowIndex = 0;
			var colTotal = [];
			for(var i = 0; i < cellLoopMax; i++){
				colTotal[i] = 0;
			}

			var cellRecordsMap = {};
			$.each(getRsp.cellRecords, function(i, o){
				var id = o.storeID + ':' + o.sizeID;
				cellRecordsMap[id] = o;
			});

			// テーブル店舗情報データを生成
			$.each(getRsp.storeRecords, function(){
				var list = [];
				var colIndex = 0;
				var totalBaseStockQy = 0;

				// 各店舗sizecellデータを生成する
				for (var i = 0; i < cellLoopMax; i++){
					var sizeData = getRsp.sizeRecords[i];
//					var baseStockQy = _this.getBaseStockQy(getRsp.cellRecords, this.storeID, sizeData.sizeID);
					var cellData = _this.getCellData(cellRecordsMap, this.storeID, sizeData.sizeID);
					list.push({
						storeID		: this.storeID,
						sizeID		: sizeData.sizeID,
						baseStockQy	: cellData.baseStockQy,
						rowIndex	: rowIndex,
						colIndex	: colIndex
					});
					totalBaseStockQy += cellData.baseStockQy;
					colTotal[colIndex] += cellData.baseStockQy;

					cellIndex++;
					colIndex++;
				}
				this.rowIndex = rowIndex;
				this.totalBaseStockQy = totalBaseStockQy;
				this.list = list;
				bd.push(this);
				rowIndex++;
			});

			for (var i = 0; i < cellLoopMax; i++){
				td.list.push({
					colIndex : i,
					baseStockQy : colTotal[i],
				});
				td.allBaseStockQy += colTotal[i];
			}

			// 店舗属性セレクタ作成
			$.each(getRsp.storeInfoRecords,function(){
				if (this.parentTypeID === 0) {
					var obj = {
						id : this.typeID,
						name : this.typeName,
						childRecords : []
					};
					$.each(getRsp.storeInfoRecords, function(){
						if (this.parentTypeID === obj.id) {
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
			clutil.cltypeselector2(this.$("#ca_storeParent"), sr, 1, 1, "id", "name");
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

		_makeColumsFromSizeData : function(){
			var _this = this;
			if(_.isEmpty(this.dispData.header.cell)){
				return null;
			}
			var columns = [
				{id : 'storeName', name : '店舗名', field : 'storeName', width: 200},
				{
					id: 'storeType',
					name: '',
					field: 'storeType',
					width: 120,
//					headCellType: {
//						editorType: StoreFilterEditor,
//						formatter: function(value, options){
//							var dc = options.dataContext,
//							parentID = dc.parentID,
//							parent = _.where(_this.dispData.storeInfoRecords, {
//								typeID: parentID
//							})[0] || {},
//							template = Marionette.TemplateCache.get('#StoreFilterView');
//							return template({
//								parent: ClGrid.Formatters.selectpicker(parent.typeName||''),
//							});
//						}
//					},
					cellType: {
						formatter: function(value, options) {
							var parentID = _this.storeFilterData.parentID;
							var item = options.dataContext;
							console.log(parentID);

							var col = '';
							if (item.storeTypeRow){
							} else if (item.totalRow ){
								col = '';
							} else {
								switch (parentID) {
								case 1:
									col = item.floorArea;
									break;
								case 2:
									col = item.openYear;
									break;
								case 3:
									col = clutil.comma(item.displayNum);
									break;
								case 4:
									col = clutil.comma(item.annualSales);
									break;
								case 5:
									col = clutil.gettypename(amcm_type.AMCM_TYPE_STORE_YEARTYPE, item.newStoreType, 1);
									break;
								default:
								}
							}
							console.log(col);

							return baseStockQyFormatter({
								col: col,
							});
						}
					}
				},
				{
					id : 'rowTotal',
					name : '合計',
					field : 'rowTotal',
					width: 80,
					cellType: {
						formatter: function(value, options){
							return baseStockQyFormatter({
								col: clutil.comma(value.baseStockQy)
							});
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
					width: 80,
					sizeColumn: true,
					sizeID: this.sizeID,
					firstSizeCol: i === 0,
					lastSizeCol: i === numSize - 1,
					bodyTypeID: this.bodyTypeID,
			 		cssClass: 'slimRow',
					headCellType: {
						formatter: 'myHdrFormatter'
					},
					cellType: {
						editorType: SizeEditor,
						isEditable: function(item){
							return false;//編集しない
						},
						formatter: function(value, options){
							return baseStockQyFormatter({
								col: clutil.comma(value.baseStockQy)
							});
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
					isStoreRow : false,
					totalRow : true,
					storeTypeRow : false,
					storeName : "合計",
					rowTotal : {
						baseStockQy : td.allBaseStockQy,
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
						storeTypeRow : false,
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
						body: true,
						rowTotal : {
							baseStockQy : this.totalBaseStockQy,
						}
				};
				$.each(this.list, function(){
					tmp["colIndex_" + this.colIndex + "_field"] = {
							baseStockQy : this.baseStockQy,
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
					frozenRowHeight: [ 60, 30 ],
					rowHeight: 30,
					autoHeight: false,		// 高さに対して仮想化するため、インナースクロールを入れる。
				},
				columns : columns,
				data : data
			});
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

		getBaseStockQy: function (cellRecords, storeID, sizeID) {
			var baseStockQy = 0;
			$.each(cellRecords, function(){
				if (this.storeID == storeID && this.sizeID == sizeID) {
					baseStockQy = this.baseStockQy;
					return false;
				}
			});

			return baseStockQy;
		},

		getCellData: function(cellRecordsMap, storeID, sizeID){
			var id = storeID + ':' + sizeID;
			var cellData = cellRecordsMap[id] || {
				baseStockQy	: 0,
			};
			return cellData;
		},

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
			var defer = clutil.postDLJSON('AMDSV0070', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
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
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, e){
			// ope_btn 系
			switch(rtyp){
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
//			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
//			this.mdBaseView.clear();
//
//			// 確定時用のデータを初期化
//			this.savedReq = null;

			this.clearTable();
		},

		/** テーブルクリア **/
		clearTable : function() {
			this.dataGrid.clear();
		},

		/**
		 * 店舗属性(親)変更時
		 */
		_onStoreParentChange: function (e) {
			// 書き換える
//			var parentID = Number($(e.target).val());
			var parentID = Number($("#ca_storeParent").val());
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
				this.doSrch(model.savedReq, model.selectedIds);
			}

		},

		_eof: 'AMDSV0070.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();
		mainView.setFocus();

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
		}
	}).fail(function(data){
		console.error('iniJSON failed.');
		console.log(arguments);

		// clcom のネタ取得に失敗。
		// 動かしようがないので、Abort 扱いとしておく？？？
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});
