useSelectpicker2();

var _fixed1 = $.inputlimiter.Filters.fixed(1);
function fixed1(value) {
	return _fixed1.set(value);
}

$(function(){
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,
		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',
			'change #ca_unitID'				: '_onUnitChanged'	// 事業ユニット変更
		},

		initialize: function(opt){
			_.bindAll(this);

			var isChild = false;
			if (opt != null && opt.opeTypeId){
				isChild = true;
			}

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
					title: '備品発注',
					subtitle: (o.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) ? '登録' : undefined,
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					btn_cancel: (o.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && !isChild)
							? this._doCancel : true
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// TODO:アプリ個別の View や部品をインスタンス化するとか・・・

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			}

			this.prevUnitId = clcom.userInfo.unit_id;
		},

		initGrid:function(){
			this.grid = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid',	// エレメント
				lineno			: false,			// 行番号表示する/しないフラグ。
				delRowBtn		: false,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: false			// フッター部の新規行追加ボタンを使用するフラグ。
			});

			this.grid.getHeadMetadata = this.getHeadMetadata;

			// 行追加
			this.listenTo(this.grid, 'cell:change', function(args){
				var curValue = Number(args.item.orderLotQy.replace(/[^0-9]/g, "").substring(0,3));
				args.item.orderLotQy = curValue;

				var orderLotQyTotal = 0;
				var orderQyTotal = 0;
				var orderAmTotal = 0;

				var data = this.grid.getData();
				var totalLine;
				$.each(data, function(){
					if (this.status == -1){
						totalLine = this;
						return true;
					}

					var orderLotQy = Number(this.orderLotQy);
					var numOfLot = Number(this.numOfLot);
					var orderUnitPrice = Number(this.orderUnitPrice);
					var orderQy = numOfLot * orderLotQy;
					var orderAm = orderQy * orderUnitPrice;

					this.orderQy_disp = clutil.comma(orderQy);
					this.orderQy = orderQy;
					this.orderAm_disp = clutil.comma(orderAm);
					this.orderAm = orderAm;

					orderLotQyTotal += orderLotQy;
					orderQyTotal += orderQy;
					orderAmTotal += orderAm;
				});

				totalLine.orderLotQy_disp = clutil.comma(orderLotQyTotal);
				totalLine.orderLotQy = orderLotQyTotal;
				totalLine.orderQy_disp = clutil.comma(orderQyTotal);
				totalLine.orderQy = orderQyTotal;
				totalLine.orderAm_disp = clutil.comma(orderAmTotal);
				totalLine.orderAm = orderAmTotal;

				this.grid.grid.invalidate();
				$('.replaceTarget').each(function(){var $tgt = $(this); $tgt.html($tgt.text().replace('|','<br/>')); });
				this.setReferenceRow();
			});

			this.columns =
			[
			 	{
					id			: 'equipTypeDispName',
					name		: '備品区分',
					field		: 'equipTypeDispName',
					width		: 180
			 	},
			 	{
					id			: 'equipName',
					name		: '備品名称',
					field		: 'equipName',
					width		: 380
			 	},
			 	{
					id			: 'numOfLot_disp',
					name		: '箱入数',
					field		: 'numOfLot_disp',
					cssClass	: 'txtalign-right',
					width		: 80,
					minWidth	: 80,
					cellType 	:
					{
						formatFilter	: "comma"
					}
			 	},
			 	{
					id			: 'maxOrderLotQy_disp',
					name		: '最大発注|箱数',
					field		: 'maxOrderLotQy_disp',
					cssClass	: 'txtalign-right',
					width		: 80,
					minWidth	: 80,
					cellType 	:
					{
						formatFilter	: "comma"
					}
			 	},
				{
					id			: 'orderLotQy',
					name		: '発注箱数',
					field		: 'orderLotQy',
					cssClass	: 'txtalign-right',
					width		: 80,
					minWidth	: 80,
					cellType 		:
					{
						type			: 'text',
						validator		: "min:1 int:3",
						tflimit			: "3",
						formatFilter	: "comma",
						editorOptions	:
						{
							addClass: 'txtar'
						},
						isEditable		: function(item, row, column, dataView) {return (item.disable == 1) ? false : true;}
					}
				},
			 	{
					id			: 'orderQy',
					name		: '数量',
					field		: 'orderQy',
					cssClass	: 'txtalign-right',
					width		: 80,
					minWidth	: 80,
					cellType 	:
					{
						formatFilter	: "comma"
					}
			 	},
//			 	{
//					id			: 'orderUnitPrice_disp',
//					name		: '単価',
//					field		: 'orderUnitPrice_disp',
//					cssClass	: 'txtalign-right',
//					width		: 100,
//					cellType 	:
//					{
//						formatter: function(value, options)
//						{
//							var disp = '' + value;
//							if (disp.length > 0){
//								disp = '&yen;' + clutil.comma(value);
//							}
//
//							return disp;
//						},
//					},
//			 	},
			 	{
					id			: 'orderUnitPrice',
					name		: '単価',
					field		: 'orderUnitPrice',
					cssClass	: 'txtalign-right',
					width		: 100,
					cellType 	:
					{
						formatter: function(value, options) {
							if (value == null) return '';
							var disp = fixed1(value);
							return '&yen; ' + clutil.comma(disp);
						}
					}
			 	},
			 	{
					id			: 'orderAm',
					name		: '金額',
					field		: 'orderAm',
					cssClass	: 'txtalign-right',
					width		: 140,
					cellType 	:
					{
						formatter: function(value, options)
						{
							var disp = '' + value;
							if (disp.length > 0){
								disp = '&yen;' + clutil.comma(value);
							}

							return disp;
						}
					}
			 	},
			 	{
					id			: 'closeTypeDispName',
					name		: '締め区分',
					field		: 'closeTypeDispName',
					width		: 120
			 	},
			 	{
					id			: 'orderDateDisp',
					name		: '発注締日',
					field		: 'orderDateDisp',
					width		: 128
			 	},
			 	{
					id			: 'dlvDateDisp',
					name		: '納品予定日※1',
					field		: 'dlvDateDisp',
					width		: 128
			 	},
			 	{
					id			: 'staffName',
					name		: '登録社員名',
					field		: 'staffName',
					width		: 160
			 	},
			 	{
					id			: 'equipOrderTypeDispName',
					name		: '発注区分',
					field		: 'equipOrderTypeDispName',
					width		: 120
			 	},
			 	{
					id			: 'senderTypeDispName',
					name		: '発送元',
					field		: 'senderTypeDispName',
					width		: 280
			 	},
			 	{
					id			: 'storeNoticeMemo',
					name		: '店舗通達欄',
					field		: 'storeNoticeMemo',
					width		: 640
			 	},
			];

			this.grid.render();
		},

		getHeadMetadata: function(rowIndex){
			return {
				columns: {
					maxOrderLotQy_disp:
					{
						cssClasses		: 'replaceTarget'
					}
				}
			};
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){
			this.mdBaseView.commonHeader._onBackClick(e);
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				this.setReadOnlyAllItems();
				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				break;
			}

			this.doClear = true;
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			var data = args.data;
			var getRsp = data.AMEQV0060GetRsp;

			var setReadOnly = false;

			switch(args.status){
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				this.doClear = true;
				setReadOnly = true;
				// FallThrough

			case 'OK':

				var gridData = new Array();

				var no = 1;
				var orderLotQyTotal = 0;
				var orderQyTotal = 0;
				var orderAmTotal = 0;
				var readonly = this.isReadOnly();
				var obj;

				$.each(getRsp.equipList, function() {
					orderLotQyTotal += Number(this.equipOrder.orderLotQy);
					orderQyTotal += Number(this.equipOrder.orderQy);
					orderAmTotal += Number(this.equipOrder.orderAm);

					var disable = 0;

					if (this.equipOrder.orderDate < clcom.getOpeDate()) {
						disable = 1;
					}
					if (this.equipOrder.equipOrderTypeID === amcm_type.AMCM_VAL_EQUIP_ORDER_ORG_TYPE_SC_ORDER) {
						disable = 1;
					}
					if (this.equipOrder.countStatus === amcm_type.AMCM_VAL_EQUIP_ORDER_CLOSE_STATE_AFTER_ORDER_CLOSE) {
						disable = 1;
					}
					if (readonly) {
						disable = 1;
					}

					obj = mainView.getObject(this.equipOrder, this.equipMast, no, disable);
					gridData.push(obj);

					no++;
				});

				if (getRsp.equipList.length > 0){
					obj = mainView.getObject(getRsp.equipList[0].equipOrder, getRsp.equipList[0].equipMast, no, 1);
					obj.status = -1;
					obj.equipTypeDispName = '合計';
					obj.equipName = '';
					obj.numOfLot_disp = '';
					obj.maxOrderLotQy_disp = '';
					obj.orderUnitPrice_disp = '';
					obj.orderDateDisp = '';
					obj.dlvDateDisp = '';
					obj.closeTypeDispName = '';
					obj.equipOrderTypeDispName = '';
					obj.staffName = '';
					obj.senderTypeDispName = '';
					obj.storeNoticeMemo = '';
					obj.orderLotQy = orderLotQyTotal;
					obj.orderQy = orderQyTotal;
					obj.orderQy_disp = orderQyTotal;
					obj.orderAm = orderAmTotal;
					obj.orderAm_disp = orderAmTotal;
					gridData.push(obj);
				}

				this.initGrid();
				var grigParam = {
					gridOptions	: {},			// データグリッドのオプション
					columns	: this.columns,		// カラム定義
					colhdMetadatas:this.colhdMetadatas,
					data	: gridData			// データ
				};
				this.grid.setData(grigParam);
				this.setReferenceRow();

				if (this.isReadOnly() || setReadOnly) {
					this.setReadOnlyAllItems();

					if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
						clutil.viewRemoveReadonly($("#div_ca_staffIDForInput"));
					}
				}

				this.fieldRelation.done(function(){
					clutil.viewReadonly($("#div_ca_unitID"));
					clutil.viewReadonly($("#div_ca_store"));

					if (!_.isEmpty(mainView.options.chkData)) {
						if (mainView.options.chkData.length > 0) {
							var srchCond = mainView.options.srchCond;
							var storeInit = {
								id: srchCond.store.id,
								code: srchCond.store.code,
								name: srchCond.store.name
							};

							if (!_.isUndefined(mainView.utl_store)){
								mainView.utl_store.setValue(storeInit);
							}
						}
					}
				});

				// 編集状態を設定する。
				this.$tgtFocus = $('#ca_staffIDForInput');
				clutil.setFocus(this.$tgtFocus);

				var gridData = mainView.grid.getData();

				if (data.rspHead.fieldMessages){
					$.each(data.rspHead.fieldMessages, function(){
						var msg = clutil.fmtargs(clmsg.WEQ0002, this.args);

						var rowid = gridData[~~this.lineno]._cl_gridRowId;
						mainView.grid.setCellMessage(rowid, this.field_name, 'warn', msg);
						mainView.grid.setCellMessage(rowid, this.field_name + 'Disp', 'warn', msg);
					});
				}

				$.each(gridData, function(){
					if (this.disable == 0 && this.status != -1 && this.isExist == 1){
						console.log("exist");
						var rowid = this._cl_gridRowId;
						mainView.grid.setCellMessage(rowid, 'orderLotQy', 'warn', '発注登録済です');
					}
				});

				$('.replaceTarget').each(function(){var $tgt = $(this); $tgt.html($tgt.text().replace('|','<br/>')); });

				break;

			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			}
		},

		getObject : function(equipOrder, equipMast, no, disable){
			var obj = {
					no				: no,
					srchKey			: no,
					recno			: equipOrder.recno,
					state			: equipOrder.state,
					equipID_order	: equipOrder.equipID,
					equipID_mast	: equipMast.equipID,
					storeID			: equipOrder.storeID,
					unitID			: equipMast.unitID,
					equipTypeID		: equipMast.equipTypeID,
					equipCode		: equipMast.equipCode,
					equipName		: equipMast.equipName,
					numOfLot		: equipMast.numOfLot,
					maxOrderLotQy	: equipMast.maxOrderLotQy,
					orderLotQy		: equipOrder.orderLotQy,
					orderQy			: equipOrder.orderQy,
					orderUnitPrice	: equipMast.orderUnitPrice,
					orderAm			: equipOrder.orderAm,
					closeTypeID		: equipMast.closeTypeID,
					staffID			: 0,
					staffName		: equipOrder.staffName,
					orderDate		: equipOrder.orderDate,
					dlvDate			: equipOrder.dlvDate,
					equipOrderTypeID: equipOrder.equipOrderTypeID,
					senderTypeID	: equipMast.senderTypeID,
					storeNoticeMemo	: equipMast.storeNoticeMemo,
					countStatus		: equipOrder.countStatus,
					isExist			: equipOrder.isExist,

					numOfLot_disp			: clutil.comma(equipMast.numOfLot),
					maxOrderLotQy_disp		: clutil.comma(equipMast.maxOrderLotQy),
					orderQy_disp			: clutil.comma(equipOrder.orderQy),
					orderUnitPrice_disp		: clutil.comma(equipMast.orderUnitPrice),
					orderAm_disp			: clutil.comma(equipOrder.orderAm),

					orderDateDisp			: clutil.dateFormat(equipOrder.orderDate,"yyyy/mm/dd(w)"),
					dlvDateDisp				: clutil.dateFormat(equipOrder.dlvDate,"yyyy/mm/dd(w)"),
					equipTypeDispName		: clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_TYPE, equipMast.equipTypeID),
					closeTypeDispName		: clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_ORDER_CLOSE_TYPE, equipMast.closeTypeID),
					equipOrderTypeDispName	: clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_ORDER_ORG_TYPE, equipOrder.equipOrderTypeID),
					senderTypeDispName		: clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_SENDER_TYPE, equipMast.senderTypeID),

					disable					: disable
				};

			return obj;
		},

		setReferenceRow: function(){
			var max = 0;
			var tgtRow = null;
			var srchRows = $(".ui-widget-content.slick-row");
			$.each(srchRows, function(){
				var top = ~~$(this).css('top').split('px')[0];
				if (top > max){
					tgtRow = this;
				}
			});

			if (tgtRow != null){
				$(tgtRow.children).addClass('reference');
			}
		},

		isReadOnly: function() {
			var opeMode = this.options.opeTypeId;
			var readonly = false;
			if (opeMode == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL ||
				opeMode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
				opeMode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				readonly = true;
			}
			return readonly;
		},

		setReadOnlyAllItems: function(){
			clutil.viewReadonly($("#ca_base_form"));
			if (typeof this.grid != 'undefined'){
				this.grid.setEnable(false);
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			// 初期値取得
			var initUnit = clcom.userInfo.unit_id;
			var storeInit = null;
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
				clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				storeInit = {id: clcom.userInfo.org_id, code: clcom.userInfo.org_code, name: clcom.userInfo.org_name};
			} else {
				storeInit = {id: 0, code: '', name: ''};
			}

			if (!_.isEmpty(this.options.chkData)) {
				if (this.options.chkData.length > 0) {
					var srchCond = this.options.srchCond;
					storeInit = {id: srchCond.store.id, code: srchCond.store.code, name: srchCond.store.name};

					initUnit = this.options.srchCond.srchUnitID;
				}
			}
			this.init_store_id = storeInit.id;

			var view = this;

			// フィールドリレーションの設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				clbusunitselector: {
					el: '#ca_unitID',
					initValue: initUnit
				},
				clorgcode: {
					el : '#ca_storeID',
					dependSrc: {
						p_org_id: 'unit_id'
					},
					initValue : {
						code	: storeInit.code,
						id		: storeInit.id,
						name	: storeInit.name
					}
				}
			}, {
				dataSource: {
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});

			this.fieldRelation.done(function() {
				var tgtView = view;
				tgtView.utl_unit = this.fields.clbusunitselector;
				tgtView.utl_store = this.fields.clorgcode;
				tgtView.setInitializeValue({store:storeInit});
				tgtView.setDefaultEnabledProp();
				tgtView._onUnitChanged();
			});

			this.initUIElement_AMPAV0010();

			clutil.clstaffcode2($("#ca_staffIDForInput"));

			// 初期フォーカス設定
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				this.$tgtFocus = $('#ca_staffIDForInput');
			}else{
				this.$tgtFocus = $('#ca_storeID');
			}
			clutil.setFocus(this.$tgtFocus);

			return this;
		},

		setInitializeValue: function(opt){
			if (typeof this.utl_store != 'undefined'){
				this.utl_store.setValue({id: opt.store.id, code: opt.store.code, name: opt.store.name});
			}
		},

		setDefaultEnabledProp: function() {
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				clutil.viewReadonly($("#div_ca_store"));
				$("#div_ca_unitID").hide();
			}

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
				$("#ca_btn_store_select").hide();
				$("#div_ca_staff").hide();
			}
		},

		initUIElement_AMPAV0010 : function(){
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el				: this.$("#ca_AMPAV0010_dialog"),	// 配置場所
				$parentView		: this.$("#mainColumn"),			// 親ビュー
				select_mode 	: clutil.cl_single_select,			// 単一選択
				isAnalyse_mode 	: false							// 通常画面モード
			});

			this.AMPAV0010Selector.clear = function() {
				if (typeof mainView != "undefined") {
					var autocomplete = mainView.utl_store;
					autocomplete.resetValue();
				}
			};

			this.AMPAV0010Selector.render();
			this.AMPAV0010Selector.clear();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				var autocomplete = mainView.utl_store;
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					autocomplete.setValue({id: id, code: code, name: name});
					mainView.validator.clearErrorMsg($('#ca_storeID'));
				} else {
					var item = autocomplete.getValue();
					if (item.id == 0) {
						this.clear();
					}
				}

				_.defer(function(){
					clutil.setFocus($('#ca_btn_store_select'));
				});
			};
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {

			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex) {

			if (typeof this.doClear != 'undefined'){
				clutil.viewRemoveReadonly($('#container'));
				this.setDefaultEnabledProp();
			}

			var srchEquipIDList = [];
			if (typeof this.options.chkData[pgIndex].srchEquipIDList == 'undefined') {
				for (var i = 0; i < this.options.chkData.length; i++){
					srchEquipIDList.push(this.options.chkData[i].equipID);
				}
			} else {
				srchEquipIDList = this.options.chkData[pgIndex].srchEquipIDList;
			}

			var storeId = clcom.userInfo.org_id;
			if (this.utl_store == null && this.init_store_id != null){
				storeId = this.init_store_id;
			}

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMEQV0060GetReq: {
					srchStoreID: storeId,
					srchEquipIDList: srchEquipIDList
				},
				// 更新リクエスト
				AMEQV0060UpdReq: {
				}
			};

		    if (!_.isEmpty(this.options.chkData)) {
		    	if (this.options.chkData.length > 0) {
		    		var srchCond = this.options.srchCond;
		    		getReq.AMEQV0060GetReq.srchStoreID = srchCond.store.id;

		    		if (this.options.chkData[pgIndex].orderDate) {
		    			getReq.AMEQV0060GetReq.srchOrderDate = this.options.chkData[pgIndex].orderDate;
		    		}
		    	}
		    }

			return {
				resId: clcom.pageId,	//'AMEQV0060',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){

			this.grid.stopEditing();

			if(!this.validator.valid()) {
				return null;
			}

			var equipList = new Array;
			var cond = clutil.view2data(this.$('#ca_base_form'));
			var storeID = cond.storeID;
			var staffID = cond.staffIDForInput;
			var staffName = cond._view2data_staffIDForInput_cn.name;

			var tableData = this.grid.getData();

			$.each(tableData, function() {
				if (this.status == -1){
					return true;
				}

				var mast = {
					equipID				: this.equipID_mast,		// 備品ID
					equipTypeID			: this.equipTypeID,			// 備品区分
					equipCode			: this.equipCode,			// 備品コード
					equipName			: this.equipName,			// 備品名称
					numOfLot			: this.numOfLot,			// 箱入数
					maxOrderLotQy		: this.maxOrderLotQy,		// 最大発注箱数
					orderUnitPrice		: this.orderUnitPrice,		// 発注単価
					closeTypeID			: this.closeTypeID,			// 締め区分
					senderTypeID		: this.senderTypeID,		// 発送元
					storeNoticeMemo		: this.storeNoticeMemo,		// 店舗通達欄
					unitID				: this.unitID				// 事業ユニット
				};
				var order = {
					recno				: this.recno,				// レコード番号
					state				: this.state,				// レコード状態
					equipID				: this.equipID_order,		// 備品ID
					storeID				: storeID,					// 店舗ID
					orderLotQy			: this.orderLotQy,			// 発注箱数
					orderQy				: this.orderQy,				// 個数
					orderAm				: this.orderAm,				// 金額
					staffID				: staffID,					// 社員ID
					staffName			: staffName,				// 社員名
					orderDate			: this.orderDate,			// 発注締日
					dlvDate				: this.dlvDate,				// 納品予定日
					equipOrderTypeID	: this.equipOrderTypeID		// 備品発注区分
				};
				var equip = {
					equipMast	: mast,
					equipOrder	: order,
					rowId		: this._cl_gridRowId,
					disable		: this.disable
				};

				equipList.push(equip);
			});

			var hasError = false;
			$.each(equipList, function() {
				var orderLotQy = Number(this.equipOrder.orderLotQy);
				var maxOrderLotQy = Number(this.equipMast.maxOrderLotQy);
				var orderAm = Number(this.equipOrder.orderAm);
				var setErr = 0;

				if (this.disable == 0) {
					if (orderLotQy === 0) {
						msg = clutil.fmtargs(clmsg.EEQ0007, [orderLotQy]);
						hasError = true;
						setErr = 1;
					} else if (orderLotQy > maxOrderLotQy) {
						msg = clutil.fmtargs(clmsg.EEQ0009, [orderLotQy, maxOrderLotQy]);
						hasError = true;
						setErr = 1;
					}

					if (orderAm > 999999999) {
						msg = clutil.fmtargs(clmsg.EEQ0017);

						if (msg.length == 0){
							msg = '金額が9桁以下になるように入力して下さい';
						}

						hasError = true;
						setErr = 1;
					}
				}

				if (setErr && hasError) {
					mainView.grid.setCellMessage(this.rowId, 'orderLotQy', 'error', msg);
				}
			});

			if(hasError){
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return null;
			}
			if(equipList.length == 0){
				return null;
			}

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: this.options.opeTypeId
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// マスタ検索リクエスト
				AMEQV0060GetReq: {
				},
				// マスタ更新リクエスト
				AMEQV0060UpdReq: {
					storeID			: storeID,
					staffIDForInput	: staffID,
					equipList		: equipList
				}
			};
//return null;
			return {
				resId: clcom.pageId,	//'AMEQV0060',
				data: updReq
			};
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onStoreSelClick: function(e) {
			var _this = this;
			var options = {
				func_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id	: this.utl_unit.getValue()
			};
			_this.AMPAV0010Selector.show(null, null, options);
		},

		_onUnitChanged: function(e){
			var unitID = ~~$('#ca_unitID').val();

			if (unitID == '0'){
				clutil.inputReadonly("#ca_storeID");
				clutil.inputReadonly("#ca_btn_store_select");
			}else{
				if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE &&
					clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN){
					clutil.inputRemoveReadonly("#ca_storeID");
					clutil.inputRemoveReadonly("#ca_btn_store_select");
				}
			}

			if (unitID == '0' || unitID != this.prevUnitId){
				this.utl_store.resetValue();
			}

			this.prevUnitId = unitID;
		},

		_eof: 'AMEQV0060.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){

		mainView = new MainView(clcom.pageArgs).initUIElement().render();

		if (typeof clcom.srcId != 'undefined' && clcom.srcId != 'AMEQV0070'){
			$("#mainColumnFooter").removeClass('x2');
			$("#mainColumnFooter p.right").hide();
			$("#mainColumnFooter p.left").hide();
		}

	}).fail(function(data){
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});
