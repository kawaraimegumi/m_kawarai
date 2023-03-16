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
		console.log(options);
		var label = '&nbsp;';
		if (options.cell === 2){
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
				if(args.grid.getColumns().length > 4){
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
			this.$('input').val(item[this.args.column.field].stockQy);
		},

		applyValue: function(item, state){
			item[this.args.column.field].stockQy = state;
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

	var stockQyFormatter = function(data){
		// jshint unused: false
		var template = Marionette.TemplateCache.get('#StockQyFormatter');
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

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		validator : null,

		events: {
			// アコーディオンのアクション制御はここでするかなー？
			'change #ca_unitID'				:	'_onUnitChanged',		// 事業ユニットが変更された
			'click #ca_sample_download'		:	'_onSampleDLClick',		// ExcelサンプルDLボタン押下
			'change #ca_sizePtnID'			:	'_onSizePtnChanged',	// サイズパターンが変更された
			'change #ca_bodyShapeID'		:	'_onBodyShapeChanged',	// 体型が変更された
			'click .cl_download'			:	'_onCSVClick',			// Excelデータ出力押下
		},

		// grid発のイベント
		gridEvents: {
			// cell 内容変更
			"cell:change" : function(args){
				console.log('*** cell:change', args);
				if (args.item.isRankRow && args.cell >= 2){
					//
//					var dataGrid = args.dataGrid;
//					dataGrid.dataView.beginUpdate();
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
					title: '基準在庫パターン',
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
			clutil.cltxtFieldLimit($("#ca_stockPtnName"));

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			this.removeSizeList = {};

			// gridインスタンス
			this.dataGrid = new ClGrid.ClAppGridView({
				el: "#ca_datagrid",
				delRowBtn :false,
				footerNewRowBtn : false
			});
			this.listenTo(this.dataGrid, this.gridEvents);

			return this;
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
					var ptnRecord = clutil.view2data(this.$("#ca_base_form"));
					if (ptnRecord.ptnID == "") {
						ptnRecord.ptnID = 0;
					}
					var itgrp = _.pick(ptnRecord._view2data_itgrpID_cn, 'id', 'code', 'name');
					var rankPtn = _.pick(ptnRecord._view2data_rankPtnID_cn, 'id', 'code', 'name');
					ptnRecord.itgrpCodeName = {
						id: itgrp.id,
						code: itgrp.code,
						name: itgrp.name
					};
					ptnRecord.rankPtnCodeName = {
						id: rankPtn.id,
						code: rankPtn.code,
						name: rankPtn.name
					};
					delete ptnRecord._view2data_itgrpID_cn;
					delete ptnRecord._view2data_rankPtnID_cn;
					// リクエストデータ本体
					var request = {
						AMDSV0040UpdReq: {
							ptnRecord: ptnRecord
						}
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMDSV0040',
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
				_this.data2view(data);
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
				// サブクラス1
				'clitemattrselector subclass1': {
					el: "#ca_sub1ID",
					dependSrc: {
						iagfunc_id: 'subclass1_id'
					}
				},
				// サブクラス2
				'clitemattrselector subclass2': {
					el: "#ca_sub2ID",
					dependSrc: {
						iagfunc_id: 'subclass2_id'
					}
				},
				// ブランド
				'clitemattrselector brand': {
					el: "#ca_brandID",
					dependSrc: {
						iagfunc_id: 'brand_id'
					}
				},
				// スタイル
				'clitemattrselector style': {
					el: "#ca_styleID",
					dependSrc: {
						iagfunc_id: 'style_id'
					}
				},
				// 色
				'clitemattrselector color': {
					el: "#ca_colorID",
					dependSrc: {
						iagfunc_id: 'color_id'
					}
				},
				// 柄
				'clitemattrselector design': {
					el: "#ca_designID",
					dependSrc: {
						iagfunc_id: 'design_id'
					}
				},
				// プライスライン
				'select priceline': {
					el: "#ca_priceLineID",
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
				// サイズパターン
				'clsizeptn_byitgrpselector': {
					el: "#ca_sizePtnID",
					dependSrc: {
						itgrp_id: 'itgrp_id'
					}
				},
			}, {
				dataSource: {
					ymd: clcom.getOpeDate,
					subclass1_id: clconst.ITEMATTRGRPFUNC_ID_SUBCLS1,
					subclass2_id: clconst.ITEMATTRGRPFUNC_ID_SUBCLS2,
					brand_id: clconst.ITEMATTRGRPFUNC_ID_BRAND,
					style_id: clconst.ITEMATTRGRPFUNC_ID_STYLE,
					color_id: clconst.ITEMATTRGRPFUNC_ID_COLOR,
					design_id: clconst.ITEMATTRGRPFUNC_ID_DESIGN,
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
				console.log("done in!!!!");
			});

			// 店舗ランクパターンオートコンプリート
			this.storerankptnField = clutil.clstorerankptncode(this.$('#ca_rankPtnID'), {
				dependAttrs: {
					unit_id: function() {
						return mainView.getValue('unitID', -1);
					}
				},
			});
			this.storerankptnField.on('change', function(item) {
			    console.log(item);
				// 店舗ランク・サイズ・パターンレコード取得
				return _this.getBaseStockPtn(item.id);
			});
			// 初期のアコーディオン展開状態をつくる。

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.setFocus(this.$('#ca_itgrpID'));
				}
				else{
					clutil.setFocus(this.$('#ca_unitID'));
				}
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。}
			}

			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
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
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			var data = args.data;

//			console.log(args.status);
			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 Veiw へセットする。
				this.data2view(data);
				// 編集可の状態にする。
				clutil.viewRemoveReadonly(this.$el);

				console.log(this.options.opeTypeId);
				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
					// コードは空
					this.$('#ca_stockPtnCode').val("");
					this.fieldRelation.done(_.bind(function(){
						clutil.inputReadonly(this.$('#ca_stockPtnCode'));
					}, this));
					if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
						clutil.viewReadonly(this.$('#ca_ptnID'));
						clutil.setFocus(this.$("#ca_itgrpID"));
					}
					else{
						clutil.setFocus(this.$("#ca_unitID"));
					}
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					// 事業ユニット、品種、店舗ランクパターン、コード、サイズパターンは入力不可
					this.fieldRelation.done(_.bind(function(){
						clutil.viewReadonly(this.$('#div_ca_unitID'));
						clutil.inputReadonly(this.$('#ca_itgrpID'));
						clutil.inputReadonly(this.$('#ca_rankPtnID'));
						clutil.inputReadonly(this.$('#ca_stockPtnCode'));
						clutil.viewReadonly(this.$('#div_ca_sizePtnID'));
					}, this));
					clutil.setFocus(this.$("#ca_stockPtnName"));
					break;
				default:
					this.fieldRelation.done(_.bind(function(){
						this.setReadOnlyAllItems(true);
					}, this));
					break;
				}

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
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
		 * データを表示
		 */
		data2view: function(data){
			this.saveData = data.AMDSV0040GetRsp;
			var ptnRecord = data.AMDSV0040GetRsp.ptnRecord;
			ptnRecord.unitID = ptnRecord.unitCodeName.id;
			ptnRecord.itgrpID = ptnRecord.itgrpCodeName;
			ptnRecord.rankPtnID = ptnRecord.rankPtnCodeName;
//			this.itemRecords = data.AMDSV0040GetRsp.itemRecords;
//			this.rankRecords = data.AMDSV0040GetRsp.rankRecords;
//			this.sizeRecords = data.AMDSV0040GetRsp.sizeRecords;

			// データセット
			clutil.data2view(this.$('#ca_base_form'), ptnRecord);
			clutil.clsizerowselector({
				el: '#ca_bodyShapeID',
				dependAttrs: {
					sizePtnID: ptnRecord.sizePtnID
				}
			});
			this.setDispData(this.saveData);
			this.renderTable();

		},

		// 初期データ取得後に呼ばれる関数
		setReadOnlyAllItems: function(isGrid){
			clutil.viewReadonly($("#ca_base_form"));
			$("form > a.cl-file-attach").attr("disabled", true);
			clutil.inputReadonly($("#ca_bodyShapeID"));
			if (isGrid) {
				this.dataGrid.setEnable(false);
			}
		},

		getBaseStockPtn : function (rankPtnID) {
			var sizePtnID = Number($('#ca_sizePtnID').selectpicker('val'));
			var req = this.buildReq(rankPtnID, sizePtnID);
			if (req) {
				// 店舗ランク・サイズ・パターンレコード取得
				return this.doSrch(req);
			}
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function (rankPtnID, sizePtnID) {
			var itgrpData = $('#ca_itgrpID').autocomplete('clAutocompleteItem');
			if (!itgrpData) {
				return null;
			}
			if (rankPtnID <= 0) {
				return null;
			}
			if (sizePtnID <= 0) {
				return null;
			}
			var itgrp = _.pick(itgrpData, 'id');

			var getReq = {
					// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 店舗ランクパターン検索リクエスト
				AMDSV0040GetReq: {
					infoType: AMDSV0040Req.AMDSV0040_GET_STORERANKPTN,	// 取得情報フラグ
					srchRankPtnID: rankPtnID,	// 店舗ランクパターンID
					srchItgrpID: itgrp.id,		// 品種ID
					srchSizePtnID: sizePtnID,	// サイズパターンID
					srchBaseStockID: 0,			// 基準在庫パターンID
				},
			};

			return getReq;
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 */
		doSrch: function(srchReq){
			var defer = clutil.postJSON('AMDSV0040', srchReq).done(_.bind(function(data){
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
			var recs = data.AMDSV0040GetRsp;
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
				console.log(this.dispData);

				// リクエストを保存。
				this.savedReq = srchReq;

				// フォーカスの設定
				var $focusElem = $("#ca_datagrid").find("input[type='text']:first");
				clutil.setFocus($focusElem);

			}
		},

		srchFailProc: function(data){
			// エラーメッセージを通知。
			clutil.mediator.trigger('onTicker', data);

//			// フォーカスの設定
//			this.resetFocus();
		},

		/**
		 * 表示データ更新
		 */
		setDispData : function(getRsp){
			var _this = this;

			// データ保存
			this.itemRecords = getRsp.itemRecords;
			this.rankRecords = getRsp.rankRecords;
			this.sizeRecords = getRsp.sizeRecords;

			// 表示テーブルデータ
			var tableData = {
					header				: {
						head	: [], // colspanデータ
						cell	: [], // sizetdデータ
					},
					body				: [],								// テーブル描画情報
					dispItem			: [],								// bodyを参照している
					sizeNum : 0
				};
			var hd = tableData.header;
			var bd = tableData.body;

			this.dispData = null;

			// テーブルヘッダ情報
			this.maxItem = 0;
			var index = 0; // colIndex
			$.each(getRsp.sizeRecords, function(){
				hd.cell.push({
					sizeName	: this.sizeName,
					sizeCode	: this.sizeCode,
					sizeID		: this.sizeID,
					bodyShapeID	: this.bodyShapeID,
					colIndex	: index,
				});
				index++;
			});
			hd.head.push({colspan:index});
			tableData.sizeNum = index;

			var cellLoopMax = index;
			var cellIndex = 0;
			var rowIndex = 0;

			var cellRecordsMap = {};
			$.each(getRsp.itemRecords, function(i, o){
				var id = o.rankID + ':' + o.sizeID;
				cellRecordsMap[id] = o;
			});

			// テーブル店舗情報データを生成
			$.each(getRsp.rankRecords, function(){
				var list = [];
				var colIndex = 0;

				// 各店舗ランクsizecellデータを生成する
				for (var i = 0; i < cellLoopMax; i++){
					var sizeData = getRsp.sizeRecords[i];
//					var stockQy = _this.getStockQy(getRsp.itemRecords, this.rankID, sizeData.sizeID);
					var stockQy = _this.getCellData(cellRecordsMap, this.rankID, sizeData.sizeID).stockQy;
					list.push({
						sizeID		: sizeData.sizeID,
						sizeCode	: sizeData.sizeCode,
						sizeName	: sizeData.sizeName,
						bodyShapeID	: sizeData.bodyShapeID,
						stockFlag	: sizeData.stockFlag,
						stockQy		: stockQy,
						rowIndex	: rowIndex,
						colIndex	: colIndex
					});

					cellIndex++;
					colIndex++;
				}
				this.rowIndex = rowIndex;
				this.list = list;
				bd.push(this);
				rowIndex++;
			});

			this.dispData = tableData;
			this.dispData.dispItem = this.dispData.body;

		},

		getStockQy: function (itemRecords, rankID, sizeID) {
			var stockQy = 0;
			$.each(itemRecords, function(){
				if (this.rankID == rankID && this.sizeID == sizeID) {
					stockQy = this.stockQy;
					return false;
				}
			});

			return stockQy;
		},

		getCellData: function(cellRecordsMap, rankID, sizeID){
			var id = rankID + ':' + sizeID;
			var cellData = cellRecordsMap[id] || {
				stockQy	: 0,
			};
			return cellData;
		},

		_makeColumsFromSizeData : function(){
			if(_.isEmpty(this.dispData.header.cell)){
				return null;
			}
			var columns = [
				{id : 'rankCode', name : '店舗ランク', field : 'rankCode', width: 100},
				{id : 'rankName', name : '店舗ランク名', field : 'rankName', width: 200},
			];

			var numSize = this.dispData.header.cell.length;
			$.each(this.dispData.header.cell, function(i){
				var fieldName = 'colIndex_' + this.colIndex + '_field';
				columns.push({
					id : 'colIndex_' + this.colIndex + '_field',
					name : this.sizeName,
					field : 'colIndex_' + this.colIndex + '_field',
					width: 80,
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
							return true;//編集する
						},
						formatter: function(value, options){
							console.log(value.stockQy);
							return stockQyFormatter({
								col: clutil.comma(value.stockQy)
							});
						},
						validator: [function(){
							var value = this.item[fieldName];
							return clutil.Validators.checkAll({
								validator: 'required uint:4',
								value: value && value.stockQy
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
			var columns = this._makeColumsFromSizeData();
			var data = [];
			var tmp;
			if (columns == null){
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
					noDataColumn : "",
					body: true,
				};
				$.each(this.list, function(){
					tmp["colIndex_" + this.colIndex + "_field"] = {
						stockQy : this.stockQy,
						colIndex : this.colIndex,
						bodyShapeID : this.bodyShapeID,
						sizeID : this.sizeID
					};
				});
				data.push(tmp);
			});
			this.dataGrid.render().setData({
				gridOptions: {
					frozenColumn : 1,
					frozenRow : 1,
					rowHeight: 60,
					autoHeight: false,		// 高さに対して仮想化するため、インナースクロールを入れる。
				},
				columns : columns,
				data : data
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

		/** テーブル表示トグル **/
		tableToggle : function(flag){
			if(flag){
				this.$("#ca_tableInfoArea").show();
			} else {
				this.$("#ca_tableInfoArea").hide();
				this.clearTable();
			}
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
			this.$('#ca_itgrpID').autocomplete('removeClAutocompleteItem');
		},

		/**
		 * サンプルファイルダウンロード
		 */
		_onSampleDLClick: function() {
			var sampleURL = "/public/sample/基準在庫パターンサンプル.xlsx";
			clutil.download(sampleURL);
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

			var rankPtnID = 0;
			var rankPtnData = $('#ca_rankPtnID').autocomplete('clAutocompleteItem');
			if (rankPtnData) {
				var rankPtn = _.pick(rankPtnData, 'id');
				rankPtnID = rankPtn.id;
			}
			var sizePtnID = Number($(e.target).val());
			var req = this.buildReq(rankPtnID, sizePtnID);
			if (req) {
				// 店舗ランク・サイズ・パターンレコード取得
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

		/**
		 * ダウンロードする
		 */
		_onCSVClick: function(){
			// editモードをかりとる
			this.dataGrid.stopEditing();

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
			var defer = clutil.postDLJSON('AMDSV0040', srchReq);
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
			var ptnRecord = clutil.view2data($("#ca_base_form"));
			var itemList = this.dataGrid.getData({ delflag: false });
			console.log(itemList);

			var sendList =[];
//			var f_last = true;
			var cellLen = this.dispData ? this.dispData.sizeNum : 0;

			for(var i=0; i < itemList.length; i++){
				var data = itemList[i];
				if (data.isRankRow) {
					for (var j = 0; j < cellLen; j++){
						var tmp = data["colIndex_"+ j +"_field"];
						tmp.rankID = data.rankID;
						sendList.push(tmp);
					}
				}
			}
			console.log(sendList);

			// 検索条件
			var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					AMDSV0040GetReq: {
					},
					AMDSV0040UpdReq: {
						ptnRecord : ptnRecord,
						itemRecords : sendList,
						rankRecords : this.rankRecords,
						sizeRecords : this.sizeRecords,
					}
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
			var ptnID = $("#ca_ptnID").val();
			var getReq = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
				},
				reqPage: {
				},
				// 店舗ランクパターン検索リクエスト
				AMDSV0040GetReq: {
					infoType: AMDSV0040Req.AMDSV0040_GET_BASESTOCKPTN,	// 取得情報フラグ
					srchRankPtnID: 0,		// 店舗ランクパターンID
					srchItgrpID: 0,			// 品種ID
					srchSizePtnID: 0,		// サイズパターンID
					srchBaseStockID: ptnID	// 基準在庫パターンID
				},
				// 店舗ランクパターン更新リクエスト -- 今は検索するので、空を設定
				AMDSV0040UpdReq: {
				},
			};

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMDSV0040', getReq);
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
				// 店舗ランクパターン検索リクエスト
				AMDSV0040GetReq: {
					infoType: AMDSV0040Req.AMDSV0040_GET_BASESTOCKPTN,	// 取得情報フラグ
					srchRankPtnID: 0,				// 店舗ランクパターンID
					srchItgrpID: 0,					// 品種ID
					srchSizePtnID: 0,				// サイズパターンID
					srchBaseStockID: chkData.id,	// 基準在庫パターンID
				},
				// 店舗ランクパターン更新リクエスト -- 今は検索するので、空を設定
				AMDSV0040UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMDSV0040',
				data: getReq
			};
		},

		hasInputError: function(){
			var hasError = false;

			return hasError;
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var f_error = false;
			this.validator.clear();
			this.dataGrid.stopEditing();

			if(!this.validator.valid()) {
				return null;
			}

			if(this.hasInputError()) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return null;
			}

			// gridの入力チェック
			this.dataGrid.clearCellMessage();
			if(!this.dataGrid.isValid()){
				f_error = true;
			}
			if(f_error){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return null;
			}

			var updReq = {};
			var itemRecords = new Array();
			var cellLen = this.dispData.sizeNum;
			var gridData = this.dataGrid.getData();
			var tmp;

			// 画面入力値をかき集めて、Rec を構築する。
			var ptnRecord = clutil.view2data(this.$('#ca_base_form'));
			_.each(gridData, function(rowData){
				if (rowData.isRankRow) {
					for (var i = 0; i < cellLen; i++){
						tmp = rowData["colIndex_"+ i +"_field"];
						tmp.rankID = rowData.rankID;
						itemRecords.push(tmp);
					}
				}
			});

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				ptnRecord.ptnID = 0;
			}

			updReq = {
				ptnRecord : ptnRecord,
				itemRecords : itemRecords,
				rankRecords : this.rankRecords,
				sizeRecords : this.sizeRecords,
			};

			var reqHead = {
				opeTypeId : this.options.opeTypeId,
			};
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var reqObj = {
				reqHead : reqHead,
				AMDSV0040UpdReq  : updReq
			};
			console.log(reqObj);

			return {
				resId : 'AMDSV0040',	//clcom.pageId,
				data: reqObj
			};

//			// Null を渡すと、Ajax 呼び出しを Reject したものと FW 側では見なします。
//			return null;
		},

		_eof: 'AMDSV0040.MainView//'
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
