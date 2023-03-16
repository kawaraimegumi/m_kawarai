/**
 * ノベルティ棚卸（発注）登録
 */
useSelectpicker2();

$(function(){
	$.inputlimiter.noTrim = true;

	ClGrid.ImgScaler.start({duration: 200});

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,
		events: {
			'click #ca_btn_store_select'		: '_onStoreSelClick',
			'clDatepickerOnSelect #ca_ordDate'	: '_onDateChange',
			'change #ca_unitID'					: '_onUnitChanged'		// 事業ユニット変更
		},

		initialize: function(opt){
			_.bindAll(this);

			var isChild = false;
			if (opt != null && opt.opeTypeId){
				isChild = true;
			}

			var subTitle;
			var orgOpeTypeId;

			if (opt.opeTypeId == undefined) {
				subTitle = '新規登録';
				orgOpeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			} else {
				subTitle = undefined;
				orgOpeTypeId = opt.opeTypeId;
			}

			// デフォルト設定
			var fixopt = _.defaults(opt||{}, {
				opeTypeId	: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
				chkData		: new Array(),
				srchCond	: {srchUnitID: clcom.userInfo.unit_id},
				orgOpeTypeId: orgOpeTypeId
			});

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				fixopt.chkData.push({
					insDate: clcom.getOpeDate(),
					storeID: clcom.userInfo.org_id,
					storeDispName: clcom.userInfo.org_code + ':' + clcom.userInfo.org_name
				});
			}

			if (fixopt.orgOpeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && fixopt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				fixopt.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
				subTitle = '新規登録';
			}

			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: 'ノベルティ棚卸（発注）',
					subtitle: subTitle,
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					btn_cancel: (o.orgOpeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && !isChild)
							? this._doCancel : true
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);


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
			this.grid.getMetadata = this.getMetadata;

			// セル変更
			this.listenTo(this.grid, 'cell:change', this.gridCellChange);

			this.grid.render();
		},

		getHeadMetadata: function(rowIndex){
			return {
				columns: {
					equipType_disp:
					{
						cssClasses		: 'bdrTpColor'
					},
					equipCode:
					{
						cssClasses		: 'bdrTpColor'
					},
					equipName:
					{
						cssClasses		: 'bdrTpColor'
					},
					imageURI:
					{
						cssClasses		: 'bdrTpColor'
					},
					numOfLot:
					{
						cssClasses		: 'bdrTpColor'
					},
					unitPrice:
					{
						cssClasses		: 'bdrTpColor'
					},
					storeNoticeMemo:
					{
						cssClasses		: 'bdrTpColor'
					},
					distFromDate_disp:
					{
						cssClasses		: 'bdrTpColor'
					},
					distToDate_disp:
					{
						cssClasses		: 'bdrTpColor'
					},
					staffName:
					{
						cssClasses		: 'bdrTpColor'
					}
				}
			};
		},

		getMetadata: function(rowIndex){
			///if(rowIndex == this.gridData.length - 1){
			if(rowIndex == 0){
				return {
					cssClasses: 'reference',
					columns:
					{
						equipType_disp:
						{
					 		colspan	: 8
						},
						distFromDate_disp:
						{
					 		colspan	: 3
						}
					}
				};
			}else{
				return {
					columns:
					{
						equipType_disp		: {cssClasses: 'vmiddle'},
						equipCode			: {cssClasses: 'vmiddle'},
						equipName			: {cssClasses: 'vmiddle'},
				 		imageURI			: {cssClasses: 'pad2'},
						numOfLot			: {cssClasses: 'vmiddle'},
						unitPrice			: {cssClasses: 'vmiddle'},
						invLotQy			: {cssClasses: 'vmiddle'},
						invOutLotQy			: {cssClasses: 'vmiddle'},
						invQy				: {cssClasses: 'vmiddle'},
						invAm				: {cssClasses: 'vmiddle'},
						ordQy				: {cssClasses: 'vmiddle'},
						ordAm				: {cssClasses: 'vmiddle'},
						storeNoticeMemo		: {cssClasses: 'vmiddle'},
						distFromDate_disp	: {cssClasses: 'vmiddle'},
						distToDate_disp		: {cssClasses: 'vmiddle'},
						staffName			: {cssClasses: 'vmiddle'}

					}
				};
			}
		},

		createGridData: function(){
			this.colhdMetadatas =
			[
				{
					columns:
					{
						equipType_disp:
						{
					 		name	: 'ノベルティ商品区分'
						},
						equipCode:
						{
							name	: '備品コード'
						},
						equipName:
						{
							name	: 'ノベルティ商品名称'
						},
						imageURI:
						{
							name	: 'デザイン'
						},
//						numOfLot:
//						{
//							name	: '箱入数'
//						},
						unitPrice:
						{
							name	: '単価'
						},
						invOutLotQy:
						{
							colspan	: '3',
							name	: '棚卸'
						},
						ordQy:
						{
							colspan	: '2',
							name	: '発注'
						},
						storeNoticeMemo:
						{
							name	: '店舗通知事項'
						},
						distFromDate_disp:
						{
							name	: '配付期間開始日'
						},
						distToDate_disp:
						{
							name	: '配付期間終了日'
						},
						staffName:
						{
							name	: '登録社員名'
						}
					}
				},
			 ];

			this.columns =
			[
			 	{
			 		id		: 'equipType_disp',
			 		//name	: '備品区分',
			 		field	: 'equipType_disp',
			 		//width	: 140
			 		width : 135,
			 		minWidth:135
			 	},
			 	{
			 		id		: 'equipCode',
			 		//name	: '備品コード',
			 		field	: 'equipCode',
			 		//width	: 90,
			 		width : 85,
			 		//minWidth: 90
			 		minWidth:85
			 	},
			 	{
			 		id		: 'equipName',
			 		//name	: '備品名称',
			 		field	: 'equipName',
			 		//width	: 200,
			 		width	: 270,
			 		//minWidth: 200
			 		minWidth: 270
			 	},
			 	{
			 		id		: 'imageURI',
			 		//name	: 'デザイン',
			 		field	: 'imageURI',
			 		//width	: 132,
			 		width	: 75,
			 		minWidth	: 75,
					cellType:
					{
						formatter: function(value, options)
						{
 							var disp = '';
 							if (options.dataContext.imageURI != ''){
								disp = '<img class="img-rounded magnify"  style="max-width:60px; max-height: 60px;" src="' + clcom.urlRoot + options.dataContext.imageURI + '">';
 							}
 							return disp;
						}
					}
			 	},
//			 	{
//			 		id		: 'numOfLot',
//			 		//name	: '箱入数',
//			 		field	: 'numOfLot',
//			 		width	: 70,
//			 		minWidth: 70,
//					cssClass: 'txtalign-right',
//					cellType:
//					{
//						formatFilter	: "comma"
//					}
//			 	},
			 	{
			 		id		: 'unitPrice',
			 		//name	: '単価',
			 		field	: 'unitPrice',
			 		width	: 80,
					cssClass: 'txtalign-right',
					cellType:
					{
						formatFilter	: "comma fixed:1"
					}

				},
//				{
//					id		: 'invLotQy',
//					name	: '箱数',
//					field	: 'invLotQy',
//					width	: 64,
//					minWidth: 64,
//					cssClass: 'txtalign-right',
//					cellType 		:
//					{
//						//type			: 'text',
//						//limit			: "number:2",
//						//validator		: "required",
//						formatFilter	: "comma",
//						//editorOptions	:
//						//{
//						//	addClass: 'txtar'
//						//},
//						//isEditable		: function(item, row, column, dataView){
//						//	return (item.readOnly == '');
//						//}
//					}
//				},
				{
					id		: 'invOutLotQy',
					name	: 'バラ数',
					field	: 'invOutLotQy',
					width	: 70,
					minWidth: 70,
					cssClass: 'txtalign-right',
					cellType 		:
					{
						type			: 'text',
						limit			: "number:5",
						validator		: "required",
						formatFilter	: "comma",
						editorOptions	:
						{
							addClass: 'txtar'
						},
						isEditable		: function(item, row, column, dataView){
							return (item.readOnly == '');
						}
					}
			 	},
			 	{
			 		id		: 'invQy',
			 		name	: '数量',
			 		field	: 'invQy',
			 		//width	: 100,
			 		width	: 80,
			 		//minWidth	: 100,
			 		minWidth: 80,
					cssClass: 'txtalign-right',
					cellType:
					{
						formatFilter	: "comma"
					}
			 	},
			 	{
			 		id		: 'invAm',
			 		name	: '経費',
			 		field	: 'invAm',
			 		width	: 100,
			 		minWidth: 100,
					cssClass: 'txtalign-right',
					cellType:
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
			 		id		: 'ordQy',
			 		name	: 'バラ数',
			 		field	: 'ordQy',
			 		width	: 70,
			 		minWidth: 70,
					cssClass: 'txtalign-right',
					cellType 		:
					{
						type			: 'text',
						limit			: "number:5",
						validator		: "required",
						formatFilter	: "comma",
						editorOptions	:
						{
							addClass: 'txtar'
						},
						isEditable		: function(item, row, column, dataView){
							var ret = (item.readOnly == '');

							if (item.opeDate < item.distFromDate ||  item.opeDate > item.distToDate){
								ret = false;
							}

							return ret;
						}
					}
			 	},
			 	{
			 		id		: 'ordAm',
			 		name	: '経費',
			 		field	: 'ordAm',
			 		//width	: 100,
			 		width	: 90,
			 		//minWidth: 100,
			 		minWidth: 90,
					cssClass: 'txtalign-right',
					cellType:
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
			 		id		: 'storeNoticeMemo',
			 		//name	: '店舗通知欄',
			 		field	: 'storeNoticeMemo',
			 		width	: 540
			 	},
			 	{
			 		id		: 'distFromDate_disp',
			 		//name	: '配付時期開始日',
			 		field	: 'distFromDate_disp',
			 		width	: 140
			 	},
			 	{
			 		id		: 'distToDate_disp',
			 		//name	: '配付時期終了日',
			 		field	: 'distToDate_disp',
			 		width	: 140
			 	},
			 	{
					id			: 'staffName',
//					name		: '登録社員名',
					field		: 'staffName',
					width		: 160
			 	}
			];
		},

		gridCellChange: function(args){
			var id = args.column.id;

			if (id == 'invLotQy'){
				// 箱数
				var curValue = Number(args.item[id].replace(/[^0-9]/g, "").substring(0,2));
				args.item[id] = curValue;
			}else if (id == 'invOutLotQy'){
				// バラ数（棚卸し）
				var curValue = Number(args.item[id].replace(/[^0-9]/g, "").substring(0,5));
				args.item[id] = curValue;
			}else if (id == 'ordQy'){
				// バラ数（発注）
				var curValue = Number(args.item[id].replace(/[^0-9]/g, "").substring(0,5));
				args.item[id] = curValue;
			}

			if (id == 'invLotQy' || id == 'invOutLotQy'){
				var numOfLot = args.item['numOfLot'];
				var unitPrice = args.item['unitPrice'];
				var invLotQy = args.item['invLotQy'];
				var invOutLotQy = ~~args.item['invOutLotQy'];

				var invQy = numOfLot * invLotQy + invOutLotQy;
				var invAm = Math.round(invQy * unitPrice);

				args.item['invQy'] = invQy;
				args.item['invAm'] = invAm;

			}else if (id == 'ordQy'){
				var unitPrice = args.item['unitPrice'];
				var ordQy = ~~args.item['ordQy'];

				var ordAm = Math.round(ordQy * unitPrice);

				args.item['ordAm'] = ordAm;
			}

			this.setTotalData();
			this.grid.grid.invalidate();
		},

		setTotalData : function(){
			var sumInvQy = 0;
			var sumInvAm = 0;
			var sumOrdQy = 0;
			var sumOrdAm = 0;

			//for (var i = 0; i < this.gridData.length - 1; i++){
			for (var i = 1; i < this.gridData.length; i++){
				sumInvQy += ~~this.gridData[i].invQy;
				sumInvAm += ~~this.gridData[i].invAm;
				sumOrdQy += ~~this.gridData[i].ordQy;
				sumOrdAm += ~~this.gridData[i].ordAm;
			}

			//var ref = this.gridData[this.gridData.length - 1];
			var ref = this.gridData[0];
			ref.invQy = sumInvQy;
			ref.invAm = sumInvAm;
			ref.ordQy = sumOrdQy;
			ref.ordAm = sumOrdAm;
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
				if (args.data.rspHead.fieldMessages){

					// 【UAT-0094】対応のためコメントアウト
					/*var srchBuff = new Array();

					$.each(this.gridData, function() {
						srchBuff.push(this);
					});

					$.each(args.data.rspHead.fieldMessages, function() {
						var msg = clutil.fmtargs(clmsg[this.message], this.args);
						mainView.grid.setCellMessage(srchBuff[this.lineno]._cl_gridRowId, this.field_name, 'error', msg);
					});*/

					// データグリッドのデータを取得
					var srchBuff2 = this.grid.getData();
					// 合計行をとばす
					srchBuff2.shift();

					// チェック処理No.3 発注バラ数が最大発注数を超えた場合のエラー表示を行う
					$.each(args.data.rspHead.fieldMessages, function() {
						var msg = clutil.fmtargs(clmsg[this.message], this.args);
						mainView.grid.setCellMessage(srchBuff2[this.lineno]._cl_gridRowId, this.field_name, 'error', msg);
					});
				}
				break;
			}

			this.doClear = true;
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			var data = args.data;
			var getRsp = data.AMEQV0140GetRsp;

			var setReadOnly = false;

			if (_.isEmpty(getRsp.premOrdList)){
				// エラーメッセージ表示
				clutil.mediator.trigger('onTicker', clmsg.cl_ini_nodata);
			}else{
				this.mdBaseView.setSubmitEnable(true);

				switch(args.status){
				case 'DONE':		// 確定済
				case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
					this.doClear = true;
					setReadOnly = true;
					// FallThrough

				case 'OK':
					this.data2Table(getRsp.premOrdList, data.rspHead.ope_iymd);

					this.createGridData();
					this.initGrid();

					var grigParam = {
						gridOptions		: {						// データグリッドのオプション
							frozenRowHeight	: 36,
							rowHeight		: 64,
							frozenRow		: 3,
							autoHeight		: false
						},
						columns			: this.columns,			// カラム定義
						colhdMetadatas	: this.colhdMetadatas,	// メタデータ
						data			: this.gridData 		// データ
					};

					this.grid.setData(grigParam);



					//this.mouseOverTest();

					var isReadOnly = false;
					switch (this.options.opeTypeId) {
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
						isReadOnly = true;
						break;
					default:
						break;
					}

					this.fieldRelation.done(function() {
						if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
							$("#div_ca_unitID").hide();
							$("#ca_btn_store_select").hide();
							clutil.viewReadonly($("#div_ca_storeID"));
						}

						if (isReadOnly || this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
							clutil.viewReadonly($("#ca_base_form"));
							// 社員IDは入力可にする
							clutil.inputRemoveReadonly($("#ca_staffIDForInput"));
						}

						if (setReadOnly) {
							mainView.setReadOnlyAllItems();
						}

						if (!_.isEmpty(mainView.options.chkData)) {
							if (mainView.options.chkData.length > 0) {
								var chkData = mainView.options.chkData[0];
					    		var storeVal = chkData.storeDispName;
					    		var codename = storeVal.split(':');

								storeInit = {
									id: chkData.storeID,
									code:  codename[0],
									name:  codename[1]
								};
								if (!_.isUndefined(mainView.utl_store)){
									mainView.utl_store.setValue(storeInit);
								}
							}
						}
					});

					break;

				default:
				case 'NG':			// その他エラー。
					// 全 <input> を readonly 化するなどの処理。
					this.setReadOnlyAllItems();
					break;
				}
			}
		},

		data2Table: function(premOrdList, opeDate) {
			var readOnly = this.isReadOnly() ? 'readonly' : '';
			var no = 1;
			var sumInvQy = 0;
			var sumInvAm = 0;
			var sumOrdQy = 0;
			var sumOrdAm = 0;

			tableData = new Array;
			$.each(premOrdList, function() {
				sumInvQy += Number(this.invQy);
				sumInvAm += Number(this.invAm);
				sumOrdQy += Number(this.ordQy);
				sumOrdAm += Number(this.ordAm);

				var obj = {
					no				: no,
					recno			: this.recno,
					state			: this.state,
					equipTypeID		: this.equipTypeID,
					equipID			: this.equipID,
					equipCode		: this.equipCode,
					equipName		: this.equipName,
					imageURI		: this.imageURI,
					numOfLot		: this.numOfLot,
					unitPrice		: this.unitPrice,
					invLotQy		: this.invLotQy,
					invOutLotQy		: this.invOutLotQy,
					invQy			: this.invQy,
					invAm			: this.invAm,
					ordQy			: this.ordQy,
					ordAm			: this.ordAm,
					distFromDate	: this.distFromDate,
					distToDate		: this.distToDate,
					staffName		: this.staffName,
					storeNoticeMemo	: this.storeNoticeMemo,
					countStatus		: this.countStatus,

					equipType_disp		: clutil.gettypename(amcm_type.AMCM_TYPE_PREM_TYPE, this.equipTypeID),
					numOfLot_disp		: clutil.comma(this.numOfLot),
					unitPrice_disp		: clutil.comma(this.unitPrice),
					invQy_disp			: clutil.comma(this.invQy),
					invAm_disp			: clutil.comma(this.invAm),
					ordAm_disp			: clutil.comma(this.ordAm),
					distFromDate_disp	: clutil.dateFormat(this.distFromDate,"yyyy/mm/dd(w)"),
					distToDate_disp		: clutil.dateFormat(this.distToDate,"yyyy/mm/dd(w)"),

					readOnly			: (this.countStatus == amcm_type.AMCM_VAL_EQUIP_ORDER_CLOSE_STATE_BEFORE_ORDER_CLOSE) ? readOnly : 'readonly',
					opeDate				: opeDate
				};
				tableData.push(obj);

				no++;
			});

			this.gridData = [];
			this.gridData.push({
				no				: 0,
				recno			: 0,
				state			: 0,
				equipTypeID		: 0,
				equipID			: 0,
				equipCode		: '',
				equipName		: '',
				imageURI		: '',
				numOfLot		: '',
				unitPrice		: '',
				invLotQy		: 0,
				invOutLotQy		: 0,
				invQy			: sumInvQy,
				invAm			: sumInvAm,
				ordQy			: sumOrdQy,
				ordAm			: sumOrdAm,
				distFromDate	: '',
				distToDate		: '',
				staffName		: '',
				storeNoticeMemo	: '',
				countStatus		: 0,

				equipType_disp		: '合計',
				numOfLot_disp		: '',
				unitPrice_disp		: '',
				invQy_disp			: '',
				invAm_disp			: '',
				ordAm_disp			: '',
				distFromDate_disp	: '',
				distToDate_disp		: '',

				readOnly			: 'readonly',
				opeDate				: opeDate
			});
			this.gridData = this.gridData.concat(tableData);
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

			var unitID = clcom.userInfo.unit_id;
			var ordDate = null;
			var storeID = 0;
			var storeCode = '';
			var storeName = '';
			var storeVal = '';

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				storeID = clcom.userInfo.org_id;
				storeCode = clcom.userInfo.org_code;
				storeName = clcom.userInfo.org_name;
				storeVal = clcom.userInfo.org_code + ':' + clcom.userInfo.org_name;
			}

		    if (!_.isEmpty(this.options.chkData)) {
		    	if (this.options.chkData.length > 0) {
		    		var chkData = this.options.chkData[0];
		    		var srchCond = this.options.srchCond;

		    		unitID = srchCond.srchUnitID;
		    		ordDate = chkData.insDate;
		    		storeID = chkData.storeID;
		    		storeVal = chkData.storeDispName;
		    		var codename = storeVal.split(':');
		    		storeCode = codename[0];
		    		storeName = codename[1];
		    	}
		    }

		    var view = this;

			// フィールドリレーションの設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				clbusunitselector: {
					el			: '#ca_unitID',
					initValue	: unitID
				},
				clorgcode: {
					el			: '#ca_storeID',
					dependSrc	:
					{
						p_org_id	: 'unit_id'
					},
					initValue :
					{
						code	: storeCode,
						id		: storeID,
						name	: storeName
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
				tgtView.setInitializeValue({store:{id:storeID,code:storeCode,name:storeName}});
				tgtView.setDefaultEnabledProp();
				tgtView.listenTo(this.fields.clbusunitselector, "change", tgtView._onBUChange);
				tgtView.listenTo(this.fields.clorgcode, "change", tgtView._onOrgChange);
				tgtView._onUnitChanged();

				// 初期フォーカス設定
				clutil.setFocus(tgtView.$tgtFocus);
			});

			// 登録日
			this.utl_ordDate = clutil.datepicker(this.$('#ca_ordDate'));
			if (ordDate != null) {
				// 初期データを画面に反映
				$('#ca_ordDate').datepicker('setIymd', ordDate);
			}else{
				$('#ca_ordDate').datepicker('setIymd', clcom.getOpeDate());
			}

			this.utl_staffIDForInput = clutil.clstaffcode2($("#ca_staffIDForInput"));

			this.listenTo(this.utl_ordDate, "change", this._onDateChange);

			this.initUIElement_AMPAV0010();

			// 初期フォーカスオブジェクト設定
			this.$tgtFocus = $('#ca_unitID');

			return this;
		},

		_onBUChange: function(org){
//			console.log('_onBUChange');
//			this.fieldRelation.done(function() {
//				mainView.doSrch();
//			});
		},

		_onOrgChange: function(org){
			console.log('_onOrgChange');
			this.doSrch();
		},

		_onDateChange: function(org){
			console.log('_onDateChange');
			this.doSrch();
		},

		doSrch : function(){
			var buildReq = this._buildGetReqFunction(0,0);
			var srchReq = buildReq.data;
			var chk = srchReq.AMEQV0140GetReq;

			if (typeof chk.srchUnitID == 'undefined' || chk.srchUnitID == 0 ||
				typeof chk.srchStoreID == 'undefined' || chk.srchStoreID == 0 ||
				typeof chk.srchInsDate == 'undefined' || chk.srchInsDate == ''){

				return;
			}

			var defer = clutil.postJSON('AMEQV0140', srchReq).done(_.bind(function(data){
				var args = {
					data:data,
					status:'OK'
				};
				this._onMDGetCompleted(args);

			}, this)).fail(_.bind(function(data){
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
			}, this));

			return defer;
		},

		setInitializeValue: function(opt){
			if (!_.isUndefined(this.utl_store)){
				this.utl_store.setValue({id: opt.store.id, code: opt.store.code, name: opt.store.name});
			}
		},

		setDefaultEnabledProp: function(){
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
				clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				clutil.viewReadonly($("#div_ca_storeID"));
				$("#div_ca_unitID").hide();
				this.$tgtFocus = $('#ca_ordDate');
			}else{
				this.$tgtFocus = $('#ca_storeID');
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
				isAnalyse_mode 	: false 							// 通常画面モード
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
					mainView.doSrch();
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
//				$("#div_ca_staff").hide();
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

			var srchUnitID = 0;
			var srchStoreID = 0;

			if (typeof this.utl_unit != 'undefined'){
				srchUnitID = this.utl_unit.getValue();
			}
			if (typeof this.utl_store != 'undefined'){
				srchStoreID = this.utl_store.getValue().id;
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
				AMEQV0140GetReq: {
					srchUnitID	: srchUnitID,
					srchStoreID	: srchStoreID,
					srchInsDate	:  clutil.dateFormat($('#ca_ordDate').val(), "yyyymmdd")
				},
				// 更新リクエスト
				AMEQV0140UpdReq: {
				}
			};

		    if (!_.isEmpty(this.options.chkData)) {
		    	if (this.options.chkData.length > 0) {
		    		var chkData = this.options.chkData[pgIndex];
		    		var srchCond = this.options.srchCond;

		    		if (typeof chkData.storeID != 'undefined'){
		    			getReq.AMEQV0140GetReq.srchEquipID = chkData.equipID;
		    		}

		    		getReq.AMEQV0140GetReq.srchUnitID = srchCond.srchUnitID;
		    		getReq.AMEQV0140GetReq.srchStoreID = chkData.storeID;
		    		getReq.AMEQV0140GetReq.srchInsDate = chkData.insDate;

		    		$('#ca_ordDate').datepicker('setIymd', chkData.insDate);
		    	}
		    }

			return {
				resId: clcom.pageId,	//'AMEQV0140',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			var hasError = false;

			if(!this.validator.valid()) {
				hasError = true;
			}

			if (typeof this.grid != 'undefined'){
				this.grid.stopEditing();

				if(!this.grid.isValid()) {
					hasError = true;
					this.validator.setErrorHeader(clmsg.cl_echoback);
				}
			}else{
				hasError = true;
			}

			if(hasError) {
				return null;
			}

			var srchCond = clutil.view2data(this.$('#ca_base_form'));
			var staffID = srchCond.staffIDForInput;
			var staffName = srchCond._view2data_staffIDForInput_cn.name;
			var premOrdList = this.grid.getData();
			premOrdList.shift();

			var msg = clutil.fmtargs(clmsg.EEQ0017);
			if (msg.length == 0){
				msg = '金額が9桁以下になるように入力して下さい';
			}

			$.each(premOrdList, function() {
				if (this.invAm > 999999999){
					//mainView.grid.setCellMessage(this._cl_gridRowId, 'invLotQy', 'error', msg);
					mainView.grid.setCellMessage(this._cl_gridRowId, 'invOutLotQy', 'error', msg);
					hasError = true;
				}
				if (this.ordAm > 999999999){
					mainView.grid.setCellMessage(this._cl_gridRowId, 'ordQy', 'error', msg);
					hasError = true;
				}
				this.staffName = staffName;		// 社員名
			});

			if(hasError) {
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
				// 検索リクエスト
				AMEQV0140GetReq: {
				},
				// 更新リクエスト
				AMEQV0140UpdReq: {
					UnitID		: srchCond.unitID,
					StoreID		: srchCond.storeID,
					InsDate		: srchCond.ordDate,
					staffIDForInput	: staffID,
					premOrdList	: premOrdList
				}
			};

//return null;
			return {
				resId: clcom.pageId,	//'AMEQV0140',
				data: updReq
			};
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onStoreSelClick: function(e) {
//			var _this = this;
//			_this.AMPAV0010Selector.show(null, null);
			var options = {
				func_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id	: this.utl_unit.getValue(),
				org_kind_set: [
								am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,		//店舗
								am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,		//倉庫
					            am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ			//本部
							]
			};
			this.AMPAV0010Selector.show(null, null, options);
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

		_eof: 'AMEQV0140.MainView//'
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
		mainView.mdBaseView.setSubmitEnable(false);

		if (clcom.pageArgs != null && clcom.pageArgs.chkData != null && clcom.pageArgs.chkData.length <= 1){
			$("#mainColumnFooter").removeClass('x2');
			$("#mainColumnFooter p.right").hide();
			$("#mainColumnFooter p.left").hide();
		}

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
