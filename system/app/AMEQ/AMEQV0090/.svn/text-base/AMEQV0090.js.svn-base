useSelectpicker2();

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
			'change #ca_equipTypeID'	: '_onEquipTypeIDChanged',
			'click #ca_csv_download'	: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
		},

		sampleURL: "/public/sample/本部一括備品発注サンプル.xlsx",

		onChange: function (attr) {

			var id = 0;

			if (attr != null){
				id = attr.id;
			}

			if(_.isUndefined(id)) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return;
			}

			var param = {
				srchUnitID 	: this.utl_unit.getValue(),
				srchEquipID	: id,
			};

			if (id == 0){
				this.prevParam = param;
				return;
			}

			if (this.prevParam == null ||
				(this.prevParam != null &&
				(this.prevParam.srchUnitID != this.utl_unit.getValue() ||
				this.prevParam.srchEquipID != attr.id)) ){

				this.prevParam = param;
				this._onSrchClick();
			}
		},

		buildReq: function(e) {
			var getReq = {
					// 共通ヘッダ
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					// 共通ページヘッダ
					reqPage: {
					},
					// 検索リクエスト
					AMEQV0090GetReq: {
						srchUnitID	: this.utl_unit.getValue(),
						srchEquipID	: this.utl_equipCode.getValue().id,
						orderDate	: $("#ca_orderDate").val(),
					},
					// 更新リクエスト
					AMEQV0090UpdReq: {
					},
				};
			return getReq;
		},


		_onSrchClick: function(e) {
			var getReq = this.buildReq();

			var defer = clutil.postJSON('AMEQV0090', getReq).done(_.bind(function(data){
				var args={
					data	: data,
					status	:'OK',
				};

				this.savedReq = getReq;
				this._onMDGetCompleted(args);

			}, this)).fail(_.bind(function(data){
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
			}, this));

			return defer;
		},

		_onSampleDLClick: function() {
			clutil.download(this.sampleURL);
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			if (_.isUndefined(this.savedReq) || !_.isUndefined($("#ca_equipID").attr('disabled'))){
				return;
			}

			var updReq = this._buildSubmitReqFunction(mainView.options.opeTypeId);

			if(_.isUndefined(updReq) || _.isNull(updReq)){
				return;
			}

			updReq.data.AMEQV0090GetReq.orderDate = $("#ca_orderDate").val();

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMEQV0090', updReq.data).done(_.bind(function(data){
				this.validator.clearErrorMsg($('#div_ca_srchVersion').find('.cl_error_field'));

			}, this)).fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));

			return defer;
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
					title					: '本部一括備品発注',
					opeTypeId				: o.opeTypeId,
					pageCount				: o.chkData.length,
					buildSubmitReqFunction	: this._buildSubmitReqFunction,
					buildGetReqFunction		:
						(o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) ? this._buildGetReqFunction : undefined,
					btn_cancel				:
						!(o.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && !isChild),
					btn_csv					: true,
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

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
		},

		initGrid:function(){
			this.grid = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid',		// エレメント
				lineno			: true,					// 行番号表示する/しないフラグ。
				delRowBtn		: !this.isReadOnly(),	// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: !this.isReadOnly(),	// フッター部の新規行追加ボタンを使用するフラグ。
			});

			this.grid.getMetadata = this.getMetadata;

			this.listenTo(this.grid, this.gridEvents);

			this.grid.render();
		},

		gridEvents:{
			'footer:addNewRow' : function(gridView){
				var items = this.grid.getData();
				var totalRow = items[items.length - 1];
				gridView.deleteItemAt(this.grid.getData().length - 1);

				var maxOrderLotQy = 0;
				var chk = (this.savedRsp != null);

				if (chk && typeof this.savedRsp.equipMast.maxOrderLotQy != 'undefined'){
					maxOrderLotQy = this.savedRsp.equipMast.maxOrderLotQy;
				}

				var addObj = {
					no					: items.length - 1,
					recno				: 0,
					state				: 0,
					equipID				: (chk) ? this.savedRsp.equipMast.equipID : 0,
					store				: {id:0, code:'', name:''},
					storeID				: 0,
					storeCode			: '',
					storeName			: '',
					storeDispName		: '',
					orderLotQy			: '',
					orderQy				: 0,
					orderUnitPrice		: (chk) ? this.savedRsp.equipMast.orderUnitPrice : 0,
					orderAm				: 0,
					maxOrderLotQy		: (maxOrderLotQy == 0) ? '' : maxOrderLotQy,
					numOfLot			: (chk) ? this.savedRsp.equipMast.numOfLot : 0,
					storeReadonly		: '',
					readonly			: '',
				};

				gridView.addNewItem(addObj);
				gridView.addNewItem(totalRow);

				this.grid.grid.invalidate();
			},
			'click:cell' : function(target, args){
				if (args.row < this.gridData.length && args.cell == 6){
					this.setTotalData();
					this.grid.grid.invalidate();
				}
			},
			'cell:change':  function(args){
				this.gridCellChange(args);
			},
		},

		getMetadata: function(rowIndex){
			if(rowIndex == this.gridData.length - 1){
				return {
					cssClasses: 'reference',
					rowDelProtect: true,	// 当該行は削除ボタンつけない
				};
			}
		},

		createGridData: function(){

			this.columns =
			[
			 	{
			 		id		: 'store',
			 		name	: '店舗',
			 		field	: 'store',
			 		width	: 240,
					cellType : {
						type			: 'clajaxac',
			 			limit			: "len:15",
			 			validator		: "maxlen:15",
						editorOptions	: {
							funcName : 'orgcode',
							dependAttrs : function(item) {
				 				var unit_id = $('#ca_unitID').val();
								return {
									orgfunc_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
									orglevel_id	: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
									p_org_id	: unit_id,
								};
							}
						},
						isEditable: function(item){
							return (item.storeReadonly == '');
						},
					}
			 	},
			 	{
			 		id		: 'maxOrderLotQy',
			 		name	: '最大発注箱数',
			 		field	: 'maxOrderLotQy',
			 		width	: 160,
					cssClass: 'txtalign-right',
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = '';
							if ((options.dataContext.store && options.dataContext.store.id > 0 && options.dataContext.store.name.length > 0) ||
								(options.dataContext.orderQy != 0 || options.dataContext.orderAm != 0)){
								disp = value;
							}
							return disp;
						},
						formatFilter	: "comma",
					},
			 	},
			 	{
			 		id		: 'orderLotQy',
			 		name	: '発注箱数',
			 		field	: 'orderLotQy',
			 		width	: 160,
					cssClass: 'txtalign-right',
					cellType 		: {
						type			: 'text',
						limit			: "number:2",
						formatFilter	: "comma",
						editorOptions	: {
							addClass: 'txtar',
						},
						formatter: function(value, options)
						{
							var disp = '';
							if (options.dataContext.orderLotQy != 0){
								disp = value;
							}
							return disp;
						},
						isEditable: function(item){
							return (item.readonly == '');
						},
					},
			 	},
			 	{
			 		id		: 'orderQy',
			 		name	: '数量',
			 		field	: 'orderQy',
			 		width	: 160,
					cssClass: 'txtalign-right',
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = '';
							if (options.dataContext.orderQy != 0 || options.dataContext.orderAm != 0){
								disp = value;
							}
							return disp;
						},
						formatFilter	: "comma",
					},
			 	},
			 	{
			 		id		: 'orderAm',
			 		name	: '金額（円）',
			 		field	: 'orderAm',
			 		width	: 160,
					cssClass: 'txtalign-right',
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = '';
							if (options.dataContext.orderQy != 0 || options.dataContext.orderAm != 0){
								disp = value;
							}
							return disp;
						},
						formatFilter	: "comma",
					},
			 	},
			];
		},

		gridCellChange: function(args){
			var id = args.column.id;

			//var isStore = (id.indexOf('store') >= 0);
			var isOrder = (id.indexOf('orderLotQy') >= 0);
			var curValue = 0;

			if (isOrder){
				curValue = Number(args.item[id].replace(/[^0-9]/g, "").substring(0,2));
				args.item[id] = curValue;
			}else{
				curValue = Number(args.item['orderLotQy'].replace(/[^0-9]/g, "").substring(0,2));
			}

			var storeID = args.item['store'].id;
			var checkKey = '' + storeID;

			if (this.savedRsp.qyCheckHash[checkKey] != null){
				var maxOrderLotQy = this.savedRsp.qyCheckHash[checkKey].maxOrderLotQy;
				args.item['maxOrderLotQy'] = maxOrderLotQy;
			} else {
				var checkValue = args.item['maxOrderLotQy'];
				var maxOrderLotQy = (typeof this.savedRsp.equipMast.maxOrderLotQy == 'undefined')
					? checkValue : this.savedRsp.equipMast.maxOrderLotQy;

				if (maxOrderLotQy != checkValue){
					args.item['maxOrderLotQy'] = maxOrderLotQy;
				}
			}

			this.setTotalData();
			this.grid.grid.invalidate();

		},

		setTotalData : function(){
			var orderLotQyTotal = 0;
			var orderQyTotal = 0;
			var orderAmTotal = 0;

			var orderUnitPrice = Number($('#ca_orderUnitPrice').val().replace(/[^0-9]/g, ""));
			if (isNaN(orderUnitPrice)){
				orderUnitPrice = 0;
			}

			for (var i = 0; i < this.gridData.length - 1; i++){
				var numOfLot = ~~this.gridData[i].numOfLot;
				var orderLotQy = ~~this.gridData[i].orderLotQy;
				var orderQy = numOfLot * orderLotQy;
				var orderAm = orderQy * orderUnitPrice;

				this.gridData[i].orderQy = orderQy;
				this.gridData[i].orderAm = orderAm;

				orderLotQyTotal += ~~orderLotQy;
				orderQyTotal += orderQy;
				orderAmTotal += orderAm;
			}

			var ref = this.gridData[this.gridData.length - 1];
			ref.orderLotQy = orderLotQyTotal;
			ref.orderQy = orderQyTotal;
			ref.orderAm = orderAmTotal;
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
				$("#mainColumnFooter").find(".cl_download").attr('disabled', false);
				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				if (args.data.rspHead.fieldMessages){

					var srchBuff = new Array();
					$.each(this.gridData, function() {
						if (typeof this.store != 'undefined' && this.store.id != 0){
							srchBuff.push(this);
						}
					});

					$.each(args.data.rspHead.fieldMessages, function() {
						var msg = clutil.fmtargs(clmsg[this.message], this.args);
						mainView.grid.setCellMessage(srchBuff[this.lineno]._cl_gridRowId, this.field_name, 'error', msg);
					});
				}
				break;
			}

			this.doClear = true;
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				// fall through
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
				// fall through
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			var data = args.data;
			var getRsp = data.AMEQV0090GetRsp;
			var equipMast = getRsp.equipMast;

			this.setDispData(equipMast);

			var setReadOnly = false;

			switch(args.status){
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				this.doClear = true;
				setReadOnly = true;
				// FallThrough

			case 'OK':
				this.savedRsp = getRsp;

				// 検索条件部設定
				clutil.data2view(this.$('#ca_base_form'), getRsp.equipMast);

				this.data2Table(getRsp);

				this.createGridData();
				this.initGrid();

				var grigParam = {
					gridOptions		: {autoHeight: false,},	// データグリッドのオプション
					columns			: this.columns,			// カラム定義
					data			: this.gridData,		// データ
				};

				this.grid.setData(grigParam);

				this.grid.getColumns()[0].cellType.formatter =
					function(value, options){
						var disp = options.row;
						if (options.dataContext.recno == -1){
							disp = '合計';
						}
						return disp;
					};
				this.grid.grid.invalidate();

				var tgtView = this;
				this.fieldRelation.done(function() {
					// 編集状態を設定する
					if (tgtView.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
						clutil.viewReadonly($("#div_ca_unitID"));
						clutil.viewReadonly($("#div_ca_equipID"));
						clutil.viewReadonly($("#div_ca_equipTypeID"));
					}

					switch (tgtView.options.opeTypeId) {
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
						setReadOnly = true;
						break;
					default:
						break;
					}

					if (setReadOnly){
						tgtView.setReadOnlyAllItems();

						if (tgtView.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
							clutil.viewRemoveReadonly($("#ca_csvinput2"));
						}
					}
				});

				break;

			default:
				this.setReadOnlyAllItems();
				break;
			}
		},

		setDispData: function(equipMast) {
			var codename = equipMast.equipDispName.split(':');

			equipMast._view2data_equipID_cn = {
				id		: equipMast.equipID,
				code	: codename[0],
				name	: codename[1],
			};
			equipMast.euqipType_disp = clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_TYPE, equipMast.equipTypeID);
			equipMast.orderAN_disp = clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_ORDER_CLOSE_TYPE, equipMast.orderAN);
			equipMast.orderCycle_disp = clutil.gettypename(amcm_type.AMCM_TYPE_ORD_CYCLE, equipMast.orderCycleTypeID);

			var dispList = [];
			$.each(equipMast.orderCountTimingTypeID,function(){
				dispList.push(clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_ODER_CLOSE_TIMING, ~~this));
			});

			equipMast.orderCountTiming_disp = dispList;
			equipMast.orderDate_disp = clutil.dateFormat(equipMast.orderDate,"yyyy/mm/dd(w)");
			equipMast.dlvDate_disp = clutil.dateFormat(equipMast.dlvDate,"yyyy/mm/dd(w)");
		},

		data2Table: function(getRsp) {
			var no = 1;
			var orderLotQyTotal = 0;
			var orderQyTotal = 0;
			var orderAmTotal = 0;
			var numOfLot = getRsp.equipMast.numOfLot;
			var tableData = new Array;
			var readonly = this.isReadOnly() ? 'readonly' : '';

			var qyCheckHash = {};
			if (typeof getRsp.storeEquip != 'undefined'){
				$.each(getRsp.storeEquip, function() {
					var key = '' + this.storeID;
					qyCheckHash[key] = this;
				});
			}
			this.savedRsp.qyCheckHash = qyCheckHash;

			$.each(getRsp.equipOrderList, function() {
				orderLotQyTotal += Number(this.orderLotQy);
				orderQyTotal += Number(this.orderQy);
				orderAmTotal += Number(this.orderAm);

				var codename = this.storeDispName.split(':');

				var equipID = (this.equipID != null) ? this.equipID : getRsp.equipMast.equipID;
				var maxOrderLotQy = (this.maxOrderLotQy != null) ? this.maxOrderLotQy : getRsp.equipMast.maxOrderLotQy;

//				var checkKey = '' + this.storeID;
//				if (qyCheckHash[checkKey] != null){
//					maxOrderLotQy = qyCheckHash[checkKey].maxOrderLotQy;
//				}

				var obj = {
					no					: no,
					recno				: this.recno,
					state				: this.state,
					equipID				: equipID,
					store				: {id:this.storeID, code:codename[0], name:codename[1]},
					storeID				: this.storeID,
					storeCode			: codename[0],
					storeName			: codename[1],
					storeDispName		: this.storeDispName,
					orderLotQy			: this.orderLotQy,
					orderQy				: this.orderQy,
					orderUnitPrice		: this.orderUnitPrice,
					orderAm				: this.orderAm,
					maxOrderLotQy		: maxOrderLotQy,
					numOfLot			: numOfLot,
					storeReadonly		: 'readonly',
					readonly			: readonly,
				};

				tableData.push(obj);

				no++;
			});

			for (var i = no; i <= 10; i++){
				var obj = {
					no					: no,
					recno				: '',
					state				: '',
					equipID				: getRsp.equipMast.equipID,
					store				: {id:0, code:'', name:''},
					storeID				: '',
					storeCode			: '',
					storeName			: '',
					storeDispName		: '',
					orderLotQy			: '',
					orderQy				: '',
					orderUnitPrice		: getRsp.equipMast.orderUnitPrice,
					orderAm				: '',
					maxOrderLotQy		: getRsp.equipMast.maxOrderLotQy,
					numOfLot			: numOfLot,
					storeReadonly		: readonly,
					readonly			: readonly,
				};

				tableData.push(obj);
				no++;
			}

			this.gridData = tableData;
			this.gridData.push({
				no					: no,
				recno				: -1,
				state				: 0,
				equipID				: 0,
				//store				: {id:0, code:'', name:'合計'},
				storeID				: 0,
				storeCode			: '',
				storeName			: '',
				storeDispName		: '',
				orderLotQy			: orderLotQyTotal,
				orderQy				: orderQyTotal,
				orderUnitPrice		: 0,
				orderAm				: orderAmTotal,
				maxOrderLotQy		: '',
				numOfLot			: 0,
				storeReadonly		: 'readonly',
				readonly			: 'readonly',
			});
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
			clutil.viewReadonly($("#ca_table_form"));
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

			var unitID = clcom.userInfo.unit_id;
			var equipID = null;
			var equipCode = null;
			var equipName = null;
			var equipVal = null;

		    if (!_.isEmpty(this.options.chkData)) {
		    	if (this.options.chkData.length > 0 && this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
		    		var chkData = this.options.chkData[0];
		    		var srchCond = this.options.srchCond;

		    		unitID = srchCond.srchUnitID;
		    		equipID = chkData.equipID;
		    		equipVal = chkData.equipDispName;

		    		var codename = equipVal.split(':');
		    		equipCode = codename[0];
		    		equipName = codename[1];
		    	}
		    }

			var tgtView = this;

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: '#ca_unitID',
					initValue: unitID,
				},
				// 備品
				clequipcode: {
					el: '#ca_equipID',
					addDepends: ['equip_typeid'],
				},
				// 備品区分
				'select equip_typeid': {
					el: '#ca_equipTypeID',
					addDepends: ['unit_id'],
					getItems: function (attrs) {
						var unit = attrs.unit_id;
						var ids;
						if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
							ids = [
								amcm_type.AMCM_VAL_EQUIP_TYPE_PACKING,		// 10:包装	
								amcm_type.AMCM_VAL_EQUIP_TYPE_PACKAGE,		// 11:パッケージ
								amcm_type.AMCM_VAL_EQUIP_TYPE_SYSTEM,		// 13:システム
								amcm_type.AMCM_VAL_EQUIP_TYPE_RESIZE,		// 21:補正
								amcm_type.AMCM_VAL_EQUIP_TYPE_BALOON,		// 30:風船関連備品
								amcm_type.AMCM_VAL_EQUIP_TYPE_DISCOUNT,		// 31:商品割引券
								amcm_type.AMCM_VAL_EQUIP_TYPE_MAIL,			// 32:メール会員登録他
								amcm_type.AMCM_VAL_EQUIP_TYPE_POP,			// 33:POP
								amcm_type.AMCM_VAL_EQUIP_TYPE_SLTAG,		// 39:SL下げ札
								amcm_type.AMCM_VAL_EQUIP_TYPE_SHTAG,		// 40:肩タグ・肩タグ用シール
								amcm_type.AMCM_VAL_EQUIP_TYPE_SHTAGSL,		// 41:肩タグ用シール
								amcm_type.AMCM_VAL_EQUIP_TYPE_CCLTAG,		// 42:円タグ
								amcm_type.AMCM_VAL_EQUIP_TYPE_SLVCOVER_ETC,	// 43:袖かぶせその他
								amcm_type.AMCM_VAL_EQUIP_TYPE_LEAF,			// 44:リーフレット・ビラ
								amcm_type.AMCM_VAL_EQUIP_TYPE_SLVTAG,		// 45:袖タグ
								amcm_type.AMCM_VAL_EQUIP_TYPE_PETSL,		// 46:PETシール
								amcm_type.AMCM_VAL_EQUIP_TYPE_PLC,			// 47:プライスカード
								amcm_type.AMCM_VAL_EQUIP_TYPE_MDSLVCOVER,	// 48:マークダウン袖かぶせ
								amcm_type.AMCM_VAL_EQUIP_TYPE_HALF_MDSLVCOVER,	// 49:半額マークダウン袖かぶせ
								amcm_type.AMCM_VAL_EQUIP_TYPE_MDSL,			// 50:マークダウンシール
								amcm_type.AMCM_VAL_EQUIP_TYPE_SIZESL,		// 51:サイズシール
								amcm_type.AMCM_VAL_EQUIP_TYPE_SIZESLBY,		// 52:サイズシールBY用
								amcm_type.AMCM_VAL_EQUIP_TYPE_TSSIZESLTS,	// 53:TSサイズシールTS用
								amcm_type.AMCM_VAL_EQUIP_TYPE_SLETC,		// 54:シールその他
								amcm_type.AMCM_VAL_EQUIP_TYPE_RACK,			// 55:棚挿し
								amcm_type.AMCM_VAL_EQUIP_TYPE_COLLECTSL,	// 56:タグ訂正シール
								amcm_type.AMCM_VAL_EQUIP_TYPE_SIZECHIP,		// 57:サイズチップスーツ・礼服・コート・JK・CY
								amcm_type.AMCM_VAL_EQUIP_TYPE_SIZECHIPSL,	// 58:サイズチップＳＬ
								amcm_type.AMCM_VAL_EQUIP_TYPE_SIZECHIPL,	// 59:サイズチップレディス
								amcm_type.AMCM_VAL_EQUIP_TYPE_CCLCHIP,		// 60:円チップ
								amcm_type.AMCM_VAL_EQUIP_TYPE_HANGERNECKTAG,// 61:ハンガーネックタグ
								amcm_type.AMCM_VAL_EQUIP_TYPE_SCHIP_SMX,	// 62:サイズチップSMX専用
								amcm_type.AMCM_VAL_EQUIP_TYPE_BLAND_COVER,	// 63:ブランドかぶせ
								amcm_type.AMCM_VAL_EQUIP_TYPE_HANGER,		// 65:ハンガー
								amcm_type.AMCM_VAL_EQUIP_TYPE_STORE_EQUIP,	// 68:店内備品
								amcm_type.AMCM_VAL_EQUIP_TYPE_ENVELOPE,		// 70:事務・封筒
								amcm_type.AMCM_VAL_EQUIP_TYPE_FAX,			// 72:FAX
								amcm_type.AMCM_VAL_EQUIP_TYPE_BOOK,			// 80:伝票・冊子
								amcm_type.AMCM_VAL_EQUIP_TYPE_SWEEP_OUT_OF_STORE,	// 90:除草剤・噴霧器

							 ];
						}
						else if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
							ids = [
								amcm_type.AMCM_VAL_EQUIP_TYPE_PACKAGE_EQ,	// 0:パッケージ備品
								amcm_type.AMCM_VAL_EQUIP_TYPE_8H,			// 1:エイトハート
								amcm_type.AMCM_VAL_EQUIP_TYPE_ORG,			// 2:オリジナル
								amcm_type.AMCM_VAL_EQUIP_TYPE_SIZECHIP_OR,	// 3:サイズチップ
								amcm_type.AMCM_VAL_EQUIP_TYPE_ATTACH,		// 4:商品付属品
								amcm_type.AMCM_VAL_EQUIP_TYPE_SYSTEM_EQ,	// 5:システム備品
								amcm_type.AMCM_VAL_EQUIP_TYPE_STATIONARY,	// 6:事務用品
								amcm_type.AMCM_VAL_EQUIP_TYPE_PLSL,			// 7:プライスシール
								amcm_type.AMCM_VAL_EQUIP_TYPE_SLIP,			// 8:伝票類
								amcm_type.AMCM_VAL_EQUIP_TYPE_OTHER,		// 9:その他
								amcm_type.AMCM_VAL_EQUIP_TYPE_STNBAR,		// 66:スタンバー
							];
						}
						var list = clutil.gettypenamelist(
							amcm_type.AMCM_TYPE_EQUIP_TYPE, ids);
						_.each(list, function(item){
							item.id = item.type_id;
						});
						return list;
					}
				}
			}, {
				dataSource: {
					equip_man_typeid	: Number(amcm_type.AMCM_VAL_EQUIP_ADMIN_TYPE_EQUIP),
					ymd					: clcom.getOpeDate
				}
			});

			this.fieldRelation.done(function() {
				tgtView.utl_unit = this.fields.clbusunitselector;
				tgtView.utl_equipCode = this.fields.clequipcode;
				tgtView.setInitializeValue();
				tgtView.setDefaultEnabledProp();
				tgtView.listenTo(
					this.fields.clequipcode,
					'change',
					tgtView.onChange
				);
			});

			// 備品
			if (equipID != null) {
				// 初期データを画面に反映
				this.fieldRelation.set('clequipcode', {code: equipCode, id: equipID, name: equipName});
				this.fieldRelation.reset();
			}

		    // CSV取込
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					var equipMast = clutil.view2data(this.$('#ca_base_form'));

					// リクエストデータ本体
					var request = {
							AMEQV0090GetReq: {
							srchUnitID	: equipMast.unitID,
							srchEquipID	: equipMast.equipID,
							orderDate	: equipMast.orderDate,
						},
						AMEQV0090UpdReq: {},
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMEQV0090',
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

			// 取込処理成功
			this.opeCSVInputCtrl.on('done', function(data){

				// 応答データ取得
				var equipMast = data.AMEQV0090GetRsp.equipMast;
				var equipOrderList = data.AMEQV0090GetRsp.equipOrderList;

				if (!_.isEmpty(equipMast) && !_.isEmpty(equipOrderList)) {
					$.each(equipOrderList, function() {
						this.orderAm = this.orderLotQy * equipMast.orderUnitPrice * equipMast.numOfLot;
					});
				}

				mainView.setDispData(equipMast);

				// 取得データ表示
				clutil.data2view(mainView.$('#ca_base_form'), equipMast);
				mainView.data2Table(data.AMEQV0090GetRsp);

				mainView.createGridData();
				mainView.initGrid();
				var grigParam = {
					gridOptions		: {autoHeight: false,},
					columns			: mainView.columns,
					data			: mainView.gridData,
				};

				mainView.grid.setData(grigParam);
			});

			// 取込処理失敗
			this.opeCSVInputCtrl.on('fail', function(data){
				// 取込処理が失敗した。
				if(data.rspHead.uri){
					//CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				} else {
					clutil.mediator.trigger('onTicker', data);
				}
			});

			// 初期フォーカスオブジェクト設定
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				this.$tgtFocus = $("#ca_equipTypeID");
			}
			else{
				this.$tgtFocus = $('#ca_unitID');
			}

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);

			return this;
		},

		getEquipTypeID: function(){
			return $('#ca_equipTypeID').val();
		},

		setInitializeValue: function(){
		},

		setDefaultEnabledProp: function() {
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				clutil.viewReadonly($("#div_ca_unitID"));
			}
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
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			if (typeof this.doClear != 'undefined'){
				clutil.viewRemoveReadonly($('#container'));
				this.setDefaultEnabledProp();
			}

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMEQV0090GetReq: {
					srchUnitID: this.options.srchCond.srchUnitID,
					srchEquipID: this.options.chkData[pgIndex].equipID,
					orderDate: this.options.chkData[pgIndex].orderDate,
				},
				// 更新リクエスト
				AMEQV0090UpdReq: {
				},
			};

			this.savedReq = null;

			return {
				resId: clcom.pageId,	//'AMEQV0090',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){

			var equipOrderListTemp = new Array();
			var hasError = false;

//			if (!_.isUndefined(opeTypeId) && $("#content").find('.cl_error_field').length > 0){
//				this.validator.setErrorHeader(clmsg.cl_echoback);
//				hasError = true;
//			}

			if(!this.validator.valid()) {
				hasError = true;
			}

			if (!_.isUndefined(opeTypeId)){
				if (!_.isUndefined(this.grid)){
					this.grid.stopEditing();
					this.grid.clearCellMessage();

					var gridValid = this.grid.validate();
					if (gridValid){
						this.validator.setErrorHeader(clmsg.cl_echoback);
						this.grid.setCellMessages(gridValid);
						hasError = true;
					}

					equipOrderListTemp = this.grid.getData();

				}else{
					return null;
				}
			}

//			if (hasError){
//				return;
//			}

			// Recを構築する。
			var equipMast = clutil.view2data(this.$('#ca_base_form'));
			var equipOrderList = new Array();
			var cnt = 0;
			var storeCheckBuff = {};

			var arrTmp = equipMast.orderCountTimingTypeID.split(',');
			var orderCTTIDs = new Array();
			$.each(arrTmp, function() {
				orderCTTIDs.push(~~this);
			});
			equipMast.orderCountTimingTypeID = orderCTTIDs;

			equipOrderListTemp.pop();

			if (_.isUndefined(opeTypeId)){
				$.each(equipOrderListTemp, function() {
					this.storeDispName = this.store.code + ':' + this.store.name;
					equipOrderList.push(this);
				});
			}else{
				$.each(equipOrderListTemp, function() {
					var orderLotQy = Number(this.orderLotQy);
					var maxOrderLotQy = (typeof this.maxOrderLotQy == 'undefined') ? 0 : this.maxOrderLotQy;

					var rowid = this._cl_gridRowId;
					var tgt;
					var msg = "";
					var setErr = 0;

					if (typeof this.store != 'undefined' && this.store.id != 0){

						var storeID = this.store.id;
						var checkKey = '' + storeID;

						if (mainView.savedRsp.qyCheckHash[checkKey] != null){
							maxOrderLotQy = mainView.savedRsp.qyCheckHash[checkKey].maxOrderLotQy;
							this.maxOrderLotQy = maxOrderLotQy;

						} else {
							var checkValue = mainView.savedRsp.equipMast.maxOrderLotQy;

							if (typeof checkValue == 'undefined'){
								checkValue = maxOrderLotQy;
							}

							if (maxOrderLotQy != checkValue){
								maxOrderLotQy = checkValue;
								this.maxOrderLotQy = maxOrderLotQy;
							}
						}

						tgt = 'orderLotQy';
						if (orderLotQy === 0) {
							msg = clutil.fmtargs(clmsg.EEQ0007, [orderLotQy]);
							hasError = true;
							setErr = 1;
						} else if (mainView.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
								&& orderLotQy > maxOrderLotQy) {
							if (this.recno != "" && maxOrderLotQy > 0){
								msg = clutil.fmtargs(clmsg.EEQ0009, [orderLotQy, maxOrderLotQy]);
								hasError = true;
								setErr = 1;
							}
						} else if (this.orderAm > 999999999) {
							msg = clutil.fmtargs(clmsg.EEQ0017);
							if (msg.length == 0){
								msg = '金額が9桁以下になるように入力して下さい';
							}

							hasError = true;
							setErr = 1;
						}

						if (setErr == 0) {
							this.storeID = this.store.id;
							equipOrderList.push(this);
						}

						// 重複チェック
						var storeVal = '' + this.store.id;
						if (storeCheckBuff[storeVal] == null){
							storeCheckBuff[storeVal] = new Array();
						}
						storeCheckBuff[storeVal].push(rowid);

						if (storeCheckBuff[storeVal].length > 1){
							hasError = true;
						}

					} else {
						tgt = 'store';
						if (orderLotQy > 0) {
							msg = clutil.fmtargs(clmsg.cl_required);
							hasError = true;
							setErr = 1;
						}
					}

					if (setErr && !_.isUndefined(opeTypeId)) {
						mainView.grid.setCellMessage(rowid, tgt, 'error', msg);
						setErr = 0;
					}

					cnt++;
				});

				if(hasError){
					$.each(storeCheckBuff, function() {
						if (this.length > 1){
							$.each(this, function() {
								mainView.grid.setCellMessage(this, 'store', 'error', clmsg.cl_repetition);
							});
						}
					});

					this.validator.setErrorHeader(clmsg.cl_echoback);
					return null;
				}
			}

			if (hasError){
				return;
			}

			if (equipOrderList.length == 0){
				this.validator.setErrorHeader(clmsg.EPO0043);
				return null;
			}

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// マスタ検索リクエスト
				AMEQV0090GetReq: (!_.isUndefined(this.savedReq) && !_.isNull(this.savedReq)) ? this.savedReq.AMEQV0090GetReq : this.buildReq().AMEQV0090GetReq,
				// マスタ更新リクエスト
				AMEQV0090UpdReq: {
					equipMast		: equipMast,
					equipOrderList	: equipOrderList,
				}
			};
			updReq.AMEQV0090GetReq.orderDate = equipMast.orderDate;
//return null;
			return {
				resId: clcom.pageId,	//'AMEQV0090',
				data: updReq
			};
		},

		_onEquipTypeIDChanged: function(e){
			if(this.deserializing){
				return;
			}
			if (typeof this.fieldRelation == 'undefined') {
				return;
			}

			this.utl_equipCode.setValue(0);
		},


		_eof: 'AMEQV0030.MainView//'
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
