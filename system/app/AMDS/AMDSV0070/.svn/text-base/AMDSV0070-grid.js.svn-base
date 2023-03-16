$(function(){

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'			:	'_onSrchClick',				// 検索ボタン押下時
			'change #ca_srchUnitID'		:	'_onSrchUnitChanged',		// 事業ユニットが変更された
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
			var _this = this;
			clutil.inputlimiter(this.$el);

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrpID",
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
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
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

//			var orgID = null;
			if (clcom.userInfo && clcom.userInfo.org_id && clcom.userInfo.org_kind_typeid) {
				// 組織表示
//				var code = (clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID')) ||
//						clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')))
//						? '' : clcom.userInfo.org_code ;
//				orgID = {
//					id: clcom.userInfo.org_id,
//					code: code,
//					name: clcom.userInfo.org_name
//				};
				if (clcom.userInfo.user_typeid && clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {
					// 店舗ユーザー
					clutil.inputReadonly($('#ca_srchStoreID'));
					clutil.inputReadonly($('#ca_btn_store_select'));
				}
			}

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
				srchStoreID: 0							// 店舗
			});
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

		/**
		 * メーカー品番
		 */
		_onSrchItemCodeChange: function (e) {
			var data_itgrp = $('#ca_srchItgrpID').autocomplete('clAutocompleteItem');
			var itgrp_id = data_itgrp.id;
			var data_maker = $('#ca_srchMakerID').autocomplete('clAutocompleteItem');
			var maker_id = data_maker.id;
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
			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLmakerItemCodeCompleted', this._onCLmakerItemCodeComplete);
		},

		/**
		 * メーカー品番→商品取得完了イベント
		 * @param data
		 * @param e
		 */
		_onCLmakerItemCodeComplete: function(data, e) {
			console.log(data.data.rec);
			// itemID保存(MtItem)
			this.itemID = data.data.rec.itemID;
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
//			'change #ca_storeAttr'			:	'_onStoreAttrChange',	//
			'click #ca_closeIcon'			:	'_onHeaderClick',		// 「×」押下
			'click #ca_viewAll'				:	'_onViewAllClick',		// 「全て表示」押下
		},

		initialize: function(){
			_.bindAll(this);
			var _this = this;

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId: -1,
				title: '基準在庫集計',
				subtitle: '',
				btn_csv: true,
				btn_submit: false
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

//			// グループID -- AMDSV0070 なデータに関連することを表すためのマーキング文字列
//			var groupid = 'AMDSV0070';
//
//			// ページャ
//			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);
//
//			// 検索結果リスト
//			this.recListView = new clutil.View.RowSelectListView({
//				el: this.$('#ca_table'),
//				groupid: groupid,
//				template: _.template( $('#ca_rec_template').html() ),
//				onOperationSilent	: true,
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
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					_this.storeAutocomplete.setValue({id: id, code: code, name: name});
				} else {
					var store = _this.storeAutocomplete.getValue();
					if (store.id == 0) {
						_this.AMPAV0010Selector.clear();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_srchStoreID"));
				});
			};
			this.AMPAV0010Selector.clear = function() {
				if (typeof mainView != "undefined") {
					_this.storeAutocomplete.resetValue();
				}
			};
			// 店舗オートコンプリート
			this.storeAutocomplete = this.getOrg(-1);

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
//			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

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

//			for(var i = 0; i < this.pagerViews.length; i++){
//				this.pagerViews[i].render();
//			}

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

//		/**
//		 * ページ切り替え/表示件数変更からの再検索
//		 */
//		_onPageChanged: function(groupid, pageReq, from){
//			console.log(arguments);
//			if(groupid !== 'AMDSV0070'){
//				return;
//			}
//
//			if(!this.savedReq){
//				console.warn('検索条件が保存されていません。');
//				return;
//			}
//
//			// 検索条件を複製してページリクエストを差し替える
//			var req = _.extend({}, this.savedReq);
//			req.reqPage = pageReq;
//
//			// 検索実行
//			this.doSrch(req);
//		},

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

		srchDoneProc: function(srchReq, data){
			// TODO:データ取得
			var recs = data.AMDSV0070GetRsp;

			if (_.isEmpty(recs)) {
				// エラーメッセージ表示
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// 検索ペイン／結果ペインを表示
				mainView.srchAreaCtrl.show_both();

				// フォーカス設定
				this.resetFocus(this.srchCondView.$tgtFocus);
			} else {
				// データセット
				this.setDispData(recs);
//				console.log(this.dispData);

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// グリッド初期化
				this.initGrid();

				// グリッドデータ作成
				this.createGridData(this.dispData);

				// グリッド表示
				this.renderGrid(this.dispData);

				// フォーカスの設定
				var $focusElem = $("#ca_storeAttr");
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
			var _this = this;
			this.dispData = null;
			this.saveData = rsp;
			this.storeRecords = rsp.storeRecords;
			this.sizeRecords = rsp.sizeRecords;
			this.cellRecords = rsp.cellRecords;

//			// 店舗属性selector
//			var html_source = '';
//			html_source += '<option value="0">&nbsp;</option>';
//			html_source += '<option value="1">売場面積</option>';
//			html_source += '<option value="2">開店年度</option>';
//			html_source += '<option value="3">品種別陳列可能数</option>';
//			html_source += '<option value="4">年商(前年度)</option>';
//			html_source += '<option value="5">新店２年目店</option>';
//			rsp.storeInfoRecords.sort(function(a, b) {
//				return (Number(a.typeID) - Number(b.typeID));
//			});
//			$.each(rsp.storeInfoRecords, function(){
//				if (this.parentTypeID != 0) {
//					return true;
//				}
//				html_source += '<option value="' + this.typeID + '">' + this.typeName + '</option>';
//			});
//			$("#ca_storeAttr").html('');
//			$("#ca_storeAttr").html(html_source).selectpicker().selectpicker('refresh');

			var tableData = {
				header		: {
					head	: new Array(),
					cell	: new Array(),
					storeInfo	: new Array(),
				},
				body		: new Array(),
				totalData	: {
					total	: 0,
					list	: new Array()
				},
				dispItem	: new Array(),
				hiddenList	: new Array(),
			};

			var hd = tableData.header;
			var bd = tableData.body;
			var td = tableData.totalData;

			rsp.storeInfoRecords.sort(function(a, b) {
				return (Number(a.typeID) - Number(b.typeID));
			});
			$.each(rsp.storeInfoRecords, function(){
				if (this.parentTypeID != 0) {
					return true;
				}
				hd.storeInfo.push({
					typeID: this.typeID,
					typeName: this.typeName,
				});
			});

			// テーブルのヘッダ部分のデータを生成する
			this.maxItem = 0;
			var index = 0;
			$.each(rsp.sizeRecords, function(){
				hd.cell.push({
					sizeName	: this.sizeName,
					sizeID		: this.sizeID,
					colIndex	: index,
				});
				index++;
			});
			hd.head.push({colspan:index});

			var cellLoopMax = index;
			var cellIndex = 0;
			var rowIndex = 0;
			var colQy = new Array();
			var colTotal = new Array();
			for (var i = 0; i < cellLoopMax; i++){
				colQy[i] = 0;
				colTotal[i] = 0;
			}

			var cellRecordsMap = {};
			$.each(rsp.cellRecords, function(i, o){
				var id = o.storeID + ':' + o.sizeID;
				cellRecordsMap[id] = o;
			});

			// テーブルの縦軸部分のデータを生成する
			$.each(rsp.storeRecords, function(){
				var list = new Array();
				var total = 0;
				var colIndex = 0;

				// テーブルの横軸部分のデータを生成する
//				var obj = {};
				for (var i = 0; i < cellLoopMax; i++){
					var cell = rsp.sizeRecords[i];
//					var baseStockQy = _this.getBaseStockQy(rsp.cellRecords, this.storeID, cell.sizeID);
					var baseStockQy = _this.getCellData(cellRecordsMap, this.storeID, cell.sizeID).baseStockQy;
					list.push({
						baseStockQy	: clutil.comma(baseStockQy),
						sizeID		: cell.sizeID,
						sizeName	: cell.sizeName,
						rowIndex	: rowIndex,
						colIndex	: colIndex,
					});
					colQy[colIndex] = baseStockQy;
					colTotal[colIndex] += baseStockQy;
					total += baseStockQy;
					cellIndex++;
					colIndex++;
				}
				td.total += total;

//				bd.push({
//					cl_reference	: '',
//					storeDispName	: this.storeCode + ":" + this.storeName,
//					storeID			: this.storeID,
//					storeAttr		: '',
//					floorArea		: this.floorArea,
//					openYear		: this.openYear,
//					displayNum		: clutil.comma(this.displayNum),
//					annualSales		: clutil.comma(this.annualSales),
//					newStoreType	: this.newStoreType,
//					total			: clutil.comma(total),
//					list			: list,
//				});
				var obj = {
					cl_reference	: '',
					storeDispName	: this.storeCode + ":" + this.storeName,
					storeID			: this.storeID,
					storeAttr		: '',
					floorArea		: this.floorArea,
					openYear		: this.openYear,
					displayNum		: clutil.comma(this.displayNum),
					annualSales		: clutil.comma(this.annualSales),
					newStoreType	: this.newStoreType,
					total			: clutil.comma(total),
				};
				for (var i = 0; i < cellLoopMax; i++){
					var id_qy = '' + i + '_baseStockQy';
					var id_sizeID = '' + i + '_sizeID';
					var id_sizeName = '' + i + '_sizeName';
//					obj[id_qy] = clutil.comma(colQy[i]);
					obj[id_qy] = clutil.comma(list[i].baseStockQy);
					obj[id_sizeID] = list[i].sizeID;
					obj[id_sizeName] = list[i].sizeName;
				}
				bd.push(obj);

				rowIndex++;
			});

//			for (var i = 0; i < cellLoopMax; i++){
//				td.list.push({
//					baseStockQy	: clutil.comma(colTotal[i]),
//					colIndex	: i,
//				});
//			}
			var totalData = {
				cl_reference	: 'reference',
				storeDispName	: '合計',
				storeAttr		: '',
				floorArea		: 0,
				openYear		: 0,
				displayNum		: 0,
				annualSales		: 0,
				newStoreType	: 0,
				total			: clutil.comma(td.total),
			};
			for (var i = 0; i < cellLoopMax; i++){
				var id_qy = '' + i + '_baseStockQy';
				totalData[id_qy] = clutil.comma(colTotal[i]);
			}
			bd.splice(0, 0, totalData);

			var row_cnt = bd.length + 3;
			var max_height = (row_cnt < 15) ? row_cnt * 40 : 600;
			$('#ca_datagrid').css('height', max_height + 'px');

			this.dispData = tableData;
			this.dispData.dispItem = this.dispData.body;
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

		resizeTable: function(){
			var storeSize = 400;
			var cellSize = 80;
			var tableSize = storeSize;
			$("#ca_thCell th[name='tmpl']").each(function(){
				if ($(this).css('display') != 'none'){
					tableSize += cellSize;
				}
			});
			$("#div_ca_table").css('width', tableSize + 'px');

			$('#innerScroll').perfectScrollbar('update');
		},

		hideColumns: function($selectedHeader, changeHeaderSpan){
			var colIndex = $selectedHeader.data().colindex;
			var findClass = 'cl_' + colIndex;

			$("#ca_table").find('.' + findClass).each(function(){
				$(this).hide();
			});

			var colspan = Number($("#ca_th_viewAll").attr('colspan')) - 1;
			$("#ca_th_viewAll").attr('colspan', colspan);

			this.resizeTable();
		},

		/**
		 * 店舗属性変更時
		 */
		_onStoreAttrChange: function (typeID) {
//			console.log($(e.target).val());
//			var _this = this;

			// 書き換える
			$.each(this.dispData.dispItem, function(i){
				this.storeAttr = "";
				if (i == 0) {
					return true;
				}
				switch (typeID) {
				case 1:
					this.storeAttr = this.floorArea;
					break;

				case 2:
					this.storeAttr = this.openYear;
					break;

				case 3:
					this.storeAttr = this.displayNum;
					break;

				case 4:
					this.storeAttr = this.annualSales;
					break;

				case 5:
					// 新店・既存店区分
					this.storeAttr = clutil.gettypename(amcm_type.AMCM_TYPE_STORE_YEARTYPE, this.newStoreType, 1);
					break;

				default:
					this.storeAttr = "";
					break;
				}
			});

			this.dataGrid.grid.invalidate();
		},

		/**
		 * ヘッダー部クリック
		 */
		_onHeaderClick: function(e){
			var $tgt = $(e.target);
//			console.log($tgt);
			// カラムを非表示にする
			this.hideColumns($tgt);

			this.dispData.hiddenList.push($tgt);
		},

		/**
		 * すべて表示クリック
		 */
		_onViewAllClick: function(e){
			this.dispData.hiddenList = new Array();

			this.setStoreSizeTable();
//			this.recListView.setRecs(this.dispData.dispItem);
		},

		setTableByBodyShape: function (rowID) {
			this.dispData.hiddenList = new Array();

			this.setStoreSizeTable();
//			this.recListView.setRecs(this.dispData.dispItem);

			if (rowID <= 0) {
				var $focusElem = $("#ca_table").find("input[type='text']:first");
				clutil.setFocus($focusElem);
				return;
			}

			$('#ca_thCell th').find('#ca_closeIcon').each(function(){
				var $tgt = $(this);
				if (rowID != Number($tgt.data().bodyshape)) {
					mainView.dispData.hiddenList.push($tgt);
				}
			});

			$.each(this.dispData.hiddenList, function(){
				mainView.hideColumns(this);
			});

			// TODO;フォーカス
//			var $focusElem = $("#ca_table").find("td:not([style='display: none;'])").children("input[type='text']:first");
//			clutil.setFocus($focusElem);
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
			clutil.setFocus($('#ca_srchUnitID'));
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function(){
			// TODO
			if (this.$('#searchAgain').css('display') == 'none') {
				// 検索ボタンにフォーカスする
				this.$('#ca_srch').focus();
//			} else {
//				// 条件を追加ボタンにフォーカスする
//				this.$('#ca_AMRSV0010_add').focus();
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
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
			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

			// 確定時用のデータを初期化
			this.savedReq = null;

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

		initGrid:function(){
			// データグリッド
			this.dataGrid  = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid',	// エレメント
				lineno			: false,			// 行番号表示する/しないフラグ。
				delRowBtn		: false,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: false,			// フッター部の新規行追加ボタンを使用するフラグ。
			});
//			this.dataGrid.getHeadMetadata = this.getHeadMetadata;
			this.dataGrid.getMetadata = this.getMetadata;
			this.listenTo(this.dataGrid, this.gridEvents);

			this.dataGrid.render();
		},

		getHeadMetadata: function(rowIndex){
			return {
				columns: {
					price:
					{
						cssClasses: 'bdrTpColor',
					},
				}
			};
		},

		getMetadata: function(rowIndex){
			if (rowIndex == 0) {
				return {
					cssClasses: 'reference',
				};
			}
		},

		gridEvents: {
			// TODO:cell 内容変更
			'cell:change': function(args){
				console.log('change', args);
				if (args.row === 0){
					// ヘッダ部絞込み用の Selector 値が Change した。
					if(args.item && args.item.storeAttr){
						var storeAttr = args.item.storeAttr;
						this._onStoreAttrChange(storeAttr.typeID);
					}
				}
			},
			'click:cell': function(target, args){
				console.log('click:cell', target, args);
			}
//			'formatter:hideSize:click': function(e){
//				console.log(e);
//				this.removeSizeList[e.column.sizeID] = true;
//				this.dataGrid.setColumns(this.getColumns( Number(this.$("#ca_bodyTypeID").val()) ));
//				return;
//			},
//			'formatter:showAll:click': function(e){
//				console.log(e);
//				this.removeSizeList = {};
//				this.dataGrid.setColumns(this.getColumns(Number(this.$("#ca_bodyTypeID").val()) ));
//				return;
//			}
		},
		createGridData: function(data){
			var hd = data.header;
//			var bd = data.body;
			this.colhdMetadatas = [];
			this.columns = [];
			var hdCol1 = {};
			var bdCol = [];

			// 店舗名
			var id_store = 'storeDispName';
			hdCol1[id_store] = {
				name : '',
			};
			bdCol.push({
				id : id_store,
				name : '店舗名',
				field : id_store,
				width : 160,
			});

			var id_storeAttr = 'storeAttr';
			hdCol1[id_storeAttr] = {
				name : '',
			};
			bdCol.push({
				id : id_storeAttr,
				name : '',
				field : id_storeAttr,
				width : 160,
				headCellType: function(args) {
					if (args.row === 0) {
						return {
							type: 'selector',
							formatter: function(v){
								return v && v.typeName;
							},
							editorOptions: {
								items: hd.storeInfo,	// TODO: ココにサーバ応答のデータを仕込む
								idAttribute: 'typeID',
								emptyFlag: true,
								emptyItemlabel: '全て',
								labelTemplate: '<%- it.typeName %>'
							},
						};
					}
				},
			});

			// 合計
			var id_total = 'total';
			hdCol1[id_total] = {
				name : '',
			};
			bdCol.push({
				id : id_total,
				name : '合計',
				field : id_total,
				cssClass: 'txtalign-right',
				width : 80,
				cellType: {
					formatFilter: 'comma'
				}
			});

//			var cellIndex = 0;
			$.each(hd.head, function(i){
				var id_qy = '' + i + '_baseStockQy';
				hdCol1[id_qy] = {
					colspan	: this.colspan,
					name : 'サイズ',
					expander: true			// Expander トグルをつける。
				};
			});

			$.each(hd.cell, function(){
				var id_qy = '' + this.colIndex + '_baseStockQy';

				var qy = {
					id: id_qy,
					name: this.sizeName,
					field: id_qy,
					cssClass: 'txtalign-right',
					width: 80,
					cellType: {
						formatFilter: 'comma'
					}
				};
				bdCol.push(qy);
			});

			this.colhdMetadatas.push({columns: hdCol1});
			this.columns = bdCol;

		},

		renderGrid: function(data){
			this.dataGrid.setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 3,
					frozenColumn: 2,
				},
				colhdMetadatas: this.colhdMetadatas,
				columns: this.columns,
				data: data.body,
			});
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
