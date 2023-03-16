$(function(){
	$.inputlimiter.noTrim = true;

	var RSRCH_RECORDTYPE_VALUE = {
			MEISAI		: 1,
			SYOUKEI		: 2,
			GOUKEI		: 3,
			AVE			: 4,
		};
	var RSRCHITEM_RECORDTYPE_VALUE = {
			TENSU		: 1,
			KOUSEIHI	: 2,
		};

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,
		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',
			'click .rowClose'				: '_onRowClose',
			'click .rowOpen'				: '_onRowOpen',
			'change .cl_decimalPoint'		: 'setDecimalPoint',
		},

		_onRowClose: function(e){
			var $tgt = $(e.currentTarget);
			var key = $tgt.data().key;

			$tgt.parent('th').toggle();
			$tgt.parent('th').next('th').toggle();

			$('th.' + key + '_toprow').attr('colspan', $tgt.data().span);
			$('td.' + key + '_bottomrow').attr('colspan', $tgt.data().span);
			$('th.' + key).toggle();
			$('td.' + key).toggle();
		},

		_onRowOpen: function(e){
			var $tgt = $(e.currentTarget);
			var key = $tgt.data().key;

			$tgt.parent('th').toggle();
			$tgt.parent('th').prev('th').toggle();

			$('th.' + key + '_toprow').attr('colspan', $tgt.data().span);
			$('td.' + key + '_bottomrow').attr('colspan', $tgt.data().span);
			$('th.' + key).toggle();
			$('td.' + key).toggle();
		},

		setDecimalPoint: function(e){
			var $tgt = $(e.currentTarget);
			var tgtVal = $tgt.val();

			if ($.isNumeric(tgtVal)){
				if (tgtVal.indexOf('.') == -1){
					tgtVal += '.0';
				}
				$tgt.val(tgtVal);
			}

		},

		initialize: function(opt){
			_.bindAll(this);

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				reportDate: clcom.getOpeDate(),
				chkData: []
			});

			this.options = fixopt;
			this.delayedCallParam = null;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: 'プライス別棚卸報告作成',
					subtitle: '',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					btn_csv: true,
					// 2016.06.09 プライス別棚卸報告書出力ボタンを削除　山口
					//btn_pdf: true,
					btn_cancel: (typeof clcom.srcId != 'undefined' && clcom.srcId == 'AMCPV0010') ? undefined : {action:this._doCancel},
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

		_doCancel: function(e){
			console.log("CANCEL");
			var pushPageOpt = {
				url		: this.options.retUrl,
				args	: this.options.saved,
				saved	: this.options.saved,
			};
			clcom.pushPage(pushPageOpt);
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				this.setReadOnlyAllItems();
				$("#mainColumnFooter").find(".dl_btn_group").find('P').removeClass('disable');
				$("#mainColumnFooter").find(".cl_download").attr('disabled', false);
				this.setSavedValues();
				break;

			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				this.setReadOnlyAllItems();
				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				break;
			}

			this.doClear = true;
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){

			// 他画面からの呼出はこのメソッドが使用される。
			// 自画面からの起動はdoSrchに行く。
			if (typeof this.initialized == 'undefined'){
				this.delayedCallParam = {args:args, e:e,};
				return;
			}

			var data = args.data;
			var getRsp = data.AMCPV0040GetRsp;

			var setReadOnly = false;

			switch(args.status){
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				this.doClear = true;
				setReadOnly = true;
				// FallThrough

			case 'OK':
				var rsrchHd = [];
				$.each(getRsp.rsrchHd, function(){
					var attr1tmp = [];
					var attr2tmp = [];
					var attr1Length = this.itemAttr1Name.length;
					var attr2Length = this.itemAttr2Name.length;
					for (var i = 0; i < attr1Length; i++){
						for (var j = 0; j < attr2Length; j++){
							attr1tmp.push(this.itemAttr1Name[i]);
							attr2tmp.push(this.itemAttr2Name[j]);
						}
					}

					var attr1 = ['合計','合計'];
					var attr2 = ['数量','構成比(%)'];
					rsrchHd.push({
						name			: this.name,
						itemAttr1Name	: attr1.concat(attr1tmp),//attr1.concat(this.itemAttr1Name),
						itemAttr2Name	: attr2.concat(attr2tmp),//attr2.concat(this.itemAttr2Name),
						colID			: this.colID,
						averagePrice	: this.averagePrice,
					});
				});
				getRsp.rsrchHd = rsrchHd;

				var unitID = clcom.userInfo.unit_id;
				if (!_.isUndefined(this.options.srchCond) && !_.isUndefined(this.options.srchCond.unitID)){
					unitID = this.options.srchCond.unitID;
				}

				clutil.data2view(
					this.$('#ca_base_form'),
					{
						recno			: getRsp.cntPrc.recno,
						state			: getRsp.cntPrc.state,
						cntPrcRprtID	: getRsp.cntPrc.seasonList,
						unitID			: unitID,
						storeName		: getRsp.cntPrc.storeName,
						reportName		: getRsp.cntPrc.reportName,
						reportDate		: getRsp.cntPrc.reportDate,
						stditgrpName	: getRsp.cntPrc.stditgrpName,
						seasonList		: getRsp.cntPrc.seasonList,
						attrsName		: getRsp.cntPrc.attrsName,
						cntPrcDate		: getRsp.cntPrc.cntPrcDate,
					}
				);
				clutil.data2view(
					this.$('#ca_fore'),
					{
						comment			: getRsp.cntPrc.comment,
					}
				);

				// 活性制御
				clutil.viewReadonly($("#ca_base_form"));

				// 表示用原本データ作成
				this.buildDataSource(getRsp);

				// チャート用データ作成
				this.buildChartSource();

				// チャート表示用データ作成
				this.buildChartLineItem();
				// チャート表示
				this.drawChart();

				// テーブル用データ作成
				var dispData = this.buildTableDispItem();

				// テーブル表示
				this.applyTableHeaderTemplate();
				this.applyTableTemplate(dispData);
				this.applyTableFooterTemplate();

				var isEditable = true;
				if ((clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE &&
					clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STORE_MAN &&
					clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS) ||
					this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
					isEditable = false;
					clutil.viewReadonly($("#div_ca_comment"));
				}

				// テーブル表示（他）
				this.createUnitPriceForeRefTable(getRsp);				//参考情報
				this.createDiscForeTable(getRsp, isEditable);			//割引予測
				this.createUnitPriceForeTable(getRsp, isEditable);		//単価予測

				$("#ca_table .rowClose").each(function(){
					mainView._onRowClose({currentTarget:this,});
				});

				this.savedRsp = getRsp;

				this.fixedLimit();

				clutil.setFocus($('#ca_discRatio'));

				if (setReadOnly){
					this.setReadOnlyAllItems();
				}

				this.setSavedValues();

				break;

			default:
			case 'NG':			// その他エラー。
				this.setReadOnlyAllItems();
				break;
			}
		},

		buildDataSource: function(getRsp){
			var headerData = [];
			var axisNameList = [];
			var axisDispNameList = [];
			var axisIndex = 0;
			var col2axis = {};

			$.each(getRsp.rsrchHd, function() {
				var itemMap = {name:{}};
				var axisName = 'unknown' + axisIndex;
				axisNameList.push(axisName);
				axisDispNameList.push(this.name);

				var attrLength = this.itemAttr1Name.length;
				for (var i = 0; i < attrLength; i++){
					var name = this.itemAttr1Name[i];

					if (itemMap.name[name] == null){
						itemMap.name[name] = new Array();
					} else {
						itemMap.name[name].push(i);
					}
				}

				for (var i = 0; i < attrLength; i++){
					var attr1 = this.itemAttr1Name[i];
					var attr2 = this.itemAttr2Name[i];
					var nop = 0;

					if (itemMap.name[attr1].length > 0){
						//2016.06.08 商品属性の選択数を、最大8つまでに変更につき、テーブルの出力条件を変更。　山口
						//if (!$.inArray(i, itemMap.name[attr1])){　から下記に変更
						if ($.inArray(i, itemMap.name[attr1]) != -1){
							nop = 1;
						}
					}

					var headerItem = {
						axis: 'ax' + axisIndex,
						index: i,
						name: axisName,
						dispName:this.name,
						attr1: attr1,
						attr2: attr2,
						nameSpan: attrLength,
						attr1Span: itemMap.name[attr1].length + 1,
						averagePrice: this.averagePrice,
						nop:nop,
					};

					headerData.push(headerItem);
				}

				var colIndex = 0;
				$.each(this.colID, function() {
					var colKey = '' + this;
					var isTotalCol = false;

					if (colIndex < 2){
						isTotalCol = true;
					}
					col2axis[colKey] = {
						isTotalCol	: isTotalCol,
						colID	: colIndex,
						axisID	: axisIndex,
					};

					colIndex++;
				});

				axisIndex++;
			});

			var bodyData = {priceLine:{}, total:{},};

			$.each(getRsp.rsrchList, function() {
				var target;
				var plKey = '' + this.priceLine;

				if (this.recordType == RSRCH_RECORDTYPE_VALUE.GOUKEI){
					target = bodyData.total;
				} else {
					target = bodyData.priceLine;
				}

				// プライスラインで束ねる（縦）
				if (target[plKey] == null){
					target[plKey] = {
						cntPrcAxisID: this.cntPrcAxisID,
						priceLine	: this.priceLine,
						length		: 0,
						price		: {},
						sum			: null,
					};
				}
				var plTarget = target[plKey];

				// プライスで束ねる（縦）
				var priceKey = '' + this.price;
				var priceData = {
					recordType	: this.recordType,
					price		: this.price,
					axis		: {},
				};
				var priceTarget;

				// 小計（縦）
				if (this.recordType == RSRCH_RECORDTYPE_VALUE.SYOUKEI){
					if (plTarget.sum == null){
						plTarget.sum = priceData;
					}
					priceTarget = plTarget.sum;
				// 明細（縦）
				} else {
					if (plTarget.price[priceKey] == null){
						plTarget.price[priceKey] = priceData;
						plTarget.length += 1;
					}
					priceTarget = plTarget.price[priceKey];
				}

				// カラムを並べる（横）
				$.each(this.item, function(){
					var colKey = '' + this.colID;
					var axisKey = '' + col2axis[colKey].axisID;
					var isTotalCol = col2axis[colKey].isTotalCol;

					if (priceTarget.axis[axisKey] == null){
						priceTarget.axis[axisKey] = {
							col			: {},
							length		: 0,
						};
					}
					var axisTarget = priceTarget.axis[axisKey];

					if (this.recordType != RSRCHITEM_RECORDTYPE_VALUE.TENSU &&
						this.recordType != RSRCHITEM_RECORDTYPE_VALUE.KOUSEIHI){
						this.recordType = RSRCHITEM_RECORDTYPE_VALUE.TENSU;
					}

					var colData = {
						rowType		: priceTarget.recordType,
						recordType	: this.recordType,
						colID		: this.colID,
						qy			: this.qy,
						compRatio	: this.compRatio,
						isTotalCol	: isTotalCol,
					};

					axisTarget.col[colKey] = colData;
				});
			});

			$.each([bodyData.total, bodyData.priceLine], function(){
				$.each(this, function(){
					$.each(this.price, function(){
						$.each(this.axis, function(){
							var size = 0;
							for (var prop in this.col) {
								if (this.col.hasOwnProperty(prop)) {
									size++;
								}
							}
							this.length = size;
						});
					});
				});
			});

			this.dataSource = {
				axis		: axisNameList,
				axisName	: axisDispNameList,
				header		: {th:headerData},
				body		: bodyData,
			};
		},

		buildTableDispItem: function(){
			var dispData = new Array();

			var getColList = function(rootNode){
				var ret = new Array();
				var axisIndex = 0;
				if (rootNode != null) {
					$.each(rootNode, function(){
						var parent = this;
						var colIndex = 0;
						$.each(this.col, function(){
							this.axis = 'ax' + axisIndex;
							this.axisColLength = parent.length;
							this.colIndex = colIndex;

							ret.push(this);
							colIndex++;
						});
						axisIndex++;
					});
				}
				return ret;
			};
			var getTemplate = function(){
				return {
					rowType			: 0,
					rowGroupIndex	: 0,
					rowSpan			: 1,
					colSpan			: 1,
					priceLine		: 0,
					price			: 0,
					col				: null,
				};
			};

			var body = this.dataSource.body;
			var total = getTemplate();
			var totalSrc = null;

			$.each(body.total, function(){
				$.each(this.price, function(){
					totalSrc = this;
					return false;
				});
				return false;
			});

			if (totalSrc == null){
				totalSrc = {
					recordType	: 3,
					axis		: null,
				};
			}

			total.rowType = totalSrc.recordType;
			total.colSpan = 2;
			total.priceLine = '合計';
			total.col = getColList(totalSrc.axis);
			dispData.push(total);

			$.each(body.priceLine, function(){
				var priceLine = this;
				var rowGroupIndex = 0;


				$.each(this.price, function(){
					var rowData = getTemplate();

					rowData.rowType = this.recordType;
					rowData.priceLine = priceLine.priceLine;
					rowData.rowSpan = priceLine.length + 1;
					rowData.rowGroupIndex = rowGroupIndex;
					rowData.price = this.price;
					rowData.col = getColList(this.axis);

					dispData.push(rowData);

					rowGroupIndex++;
				});

				var sumData = getTemplate();
				sumData.price = '小計';
				sumData.rowGroupIndex = rowGroupIndex;
				sumData.col = getColList((this.sum == null) ? null : this.sum.axis);
				dispData.push(sumData);
			});

			return dispData;
		},

		buildChartSource: function(){
			var graphData = {source:{}, min: 0, max: 0,};
			var numArray = new Array();

			$.each(this.dataSource.body.priceLine, function() {
				var key = '' + this.priceLine;

				graphData.source[key] = {
					priceLine: this.priceLine,
					item: new Array(),
				};

				if (this.sum != null){
					$.each(this.sum.axis, function() {
						$.each(this.col, function() {
							if (this.isTotalCol && this.recordType == RSRCHITEM_RECORDTYPE_VALUE.TENSU){
								var qy = this.qy;
								graphData.source[key].item.push(qy);
								numArray.push(qy);
							}
						});
					});
				}
			});

			graphData.min = Math.min.apply(null, numArray);
			graphData.max = Math.max.apply(null, numArray);

			this.chartSource = graphData;
		},

		buildChartLineItem: function(){
			var labels = new Array();
			var data = new Array();
			var max = 0;

			$.each(this.chartSource.source, function() {

				labels.push(clutil.comma(this.priceLine));
				var index = 0;

				$.each(this.item, function() {
					if (data.length==index){
						data.push(new Array());
					}
					var qy = this;
					data[index].push(qy);
					if (qy > max) { max = qy;}
					index++;
				});

			});

			this.chartSource.lineItem = {
				labels		: labels,
				data		: data,
				max			: max,
				stepWidth	: 10,
			};
		},

		drawChart: function(){

			var length = this.chartSource.lineItem.data.length;
			var datasets = new Array();

			for (var i = 0; i < length; i++){
				switch (i){
				case 0:
					datasets.push({
						strokeColor : "#1e9ce6",
						pointColor : "#fff",
						pointStrokeColor : "#1e9ce6",
						data : this.chartSource.lineItem.data[0],
					});
					break;
				case 1:
					datasets.push({
						strokeColor : "rgba(162,169,179,1)",
						pointColor : "#fff",
						pointStrokeColor : "rgba(162,169,179,1)",
						data : this.chartSource.lineItem.data[1],
					});
					break;
				case 2:
					datasets.push({
						strokeColor : "rgba(15,184,170,.3)",
						pointColor : "#fff",
						pointStrokeColor : "rgba(15,184,170,.3)",
						data : this.chartSource.lineItem.data[2],
					});
					break;
				case 3:
					datasets.push({
						strokeColor : "rgba(252,174,63,.3)",
						pointColor : "#fff",
						pointStrokeColor : "rgba(252,174,63,.3)",
						data : this.chartSource.lineItem.data[3],
					});
					break;
				case 4:
					datasets.push({
						strokeColor : "rgba(242,85,95,.3)",
						pointColor : "#fff",
						pointStrokeColor : "rgba(242,85,95,.3)",
						data : this.chartSource.lineItem.data[4],
					});
					break;
				}
			}

			var lineChartData = {
				labels : this.chartSource.lineItem.labels,
				datasets : datasets,
			};

			var multiple = 1;
			var loopMax = this.chartSource.lineItem.max.toString().length - 1;
			for (var i = 0; i < loopMax; i++){
				multiple *= 10;
			}
			var max = Math.floor(this.chartSource.lineItem.max / multiple + 0.9) * multiple;

			var widthList = [multiple / 10, multiple / 4, multiple / 2, multiple];
			var stepList = [];

			$.each(widthList, function(){
				stepList.push(max / this);
			});

			var scaleStepWidth = multiple;
			var scaleSteps = Math.floor(this.chartSource.lineItem.max / scaleStepWidth + 0.9);

			var listLen = widthList.length;
			for (var i = 0; i < listLen; i++){
				if (widthList[i] >= 1 &&
					widthList[i] - Math.floor(widthList[i]) == 0 &&
					stepList[i] <= 12){
					scaleSteps = stepList[i];
					scaleStepWidth = widthList[i];

					scaleSteps = stepList[i];
					scaleStepWidth = widthList[i];

					while((scaleSteps - 1) * scaleStepWidth > this.chartSource.lineItem.max){
						scaleSteps--;
					}

					break;
				}
			}

			new Chart($("#chart")[0].getContext("2d")).Line(lineChartData, {
				scaleOverlay : false,
				scaleOverride : true,
				scaleSteps : scaleSteps,
				scaleStepWidth : scaleStepWidth,
				scaleStartValue : null,
				scaleLineColor : "#d0d5d9",
				scaleLineWidth : 1,
				scaleShowLabels : true,
				scaleLabel : "<%=value%>",
				scaleFontFamily : "'Lato'",
				scaleFontSize : 11,
				scaleFontStyle : "normal",
				scaleFontColor : "#a2a9b3",
				scaleShowGridLines : true,
				scaleGridLineColor : "#e4e6eb",
				scaleGridLineWidth : 1,
				bezierCurve : false,
				pointDot : true,
				pointDotRadius : 3,
				pointDotStrokeWidth : 0,
				datasetStroke : true,
				datasetStrokeWidth : 2,
				datasetFill : false,
				animation : false,
				animationSteps : 60,
				animationEasing : "easeOutQuart",
				onAnimationComplete : null,
			});

			var index = 0;
			$.each(this.dataSource.axisName, function() {
				var lblID = '#ca_lbl_axis' + index;
				var lineID = '#ca_line_axis' + index;

				$(lblID).text(this);
				$(lblID).show();
				$(lineID).show();
				index++;
			});
		},

		getTableData: function(){
			var tableData = new Array();
			tableData.push(this.chartSource.total);

			var min = this.chartSource.min;
			var max = this.chartSource.max - 1;

			$.each(this.chartSource.source, function() {

				if (this.qy.length == 0){
					return true;
				}

				$.each(this.qy, function() {
					this.min = min;
					this.max = max;
					tableData.push(this);
				});
				tableData.push(this.sum);
			});

			return tableData;
		},

		applyTableHeaderTemplate: function(data){
			$('#ca_table_thead').empty();
			var $template = $('#ca_thead_template');
			$template.tmpl(this.dataSource.header).appendTo('#ca_table_thead');
		},

		applyTableTemplate: function(data){
			$('#ca_table_tbody').empty();
			var $template = $('#ca_tbody_template');
			$template.tmpl(data).appendTo('#ca_table_tbody');
		},

		applyTableFooterTemplate: function(data){
			$('#ca_table_tfoot').empty();
			var $template = $('#ca_tfoot_template');
			$template.tmpl(this.dataSource.header).appendTo('#ca_table_tfoot');
		},

		createUnitPriceForeRefTable: function(getRsp){
			var data = new Array();
			var typeNameList = clutil.gettypenamelist(amcm_type.AMCM_TYPE_FORE_TYPE);

			$.each(typeNameList, function() {
				var value = {
						unitPrcForeTypeName	: this.name,
						unitPrcForeValue	: 0,
					};

				if (value.unitPrcForeTypeName.indexOf('率') >= 0){
					value.unitPrcForeTypeName += ' (%)';
				}

				switch (this.type_id){
				case amcm_type.AMCM_VAL_FORE_TYPE_AVE_COST: 		// 平均下代
					value.unitPrcForeValue = getRsp.cntPrc.aveCost;
					data.push(value);
					break;

				case amcm_type.AMCM_VAL_FORE_TYPE_REL_2SUITS_RT:	// 関連率(01+01)
					value.unitPrcForeValue = getRsp.cntPrc.relRt.toFixed(1);
					data.push(value);
					break;

				case amcm_type.AMCM_VAL_FORE_TYPE_CUR_PRICE: 		// 旧価格決着上代
					value.unitPrcForeValue = getRsp.cntPrc.oldPrice;
					data.push(value);
					break;

				case amcm_type.AMCM_VAL_FORE_TYPE_CUR_PROFIT_RT:	// 旧決着経準率
					value.unitPrcForeValue = getRsp.cntPrc.oldProfitRt.toFixed(1);
					data.push(value);
					break;

				default:
					break;
				}
			});

			$('#ca_unitPriceForeRef_tbody').empty();
			var $template = $('#ca_unitPriceForeRef_template');
			$template.tmpl(data).appendTo('#ca_unitPriceForeRef_tbody');
		},

		createUnitPriceForeTable: function(getRsp, isEditable){
			var data = new Array();
			var typeNameList = clutil.gettypenamelist(amcm_type.AMCM_TYPE_FORE_TYPE);

			$.each(typeNameList, function() {
				var value = {
						type				: 0,
						unitPrcForeTypeID	: this.type_id,
						unitPrcForeTypeName	: this.name,
						unitPrcRatio		: 0,
						unitPrcRatioInput	: 0,
						unitPrcAm			: 0,
						unitPrcAmInput		: 0,
						isEditable			: isEditable,
					};

				if (value.unitPrcForeTypeName.indexOf('率') >= 0){
					value.unitPrcForeTypeName += ' (%)';
				}

				switch (this.type_id){
				case amcm_type.AMCM_VAL_FORE_TYPE_NEW_PRICE: 		// 新価格決着上代
					value.type = 1;
					value.unitPrcAm = getRsp.cntPrc.newPrice;
					value.unitPrcAmInput = clutil.comma(getRsp.cntPrc.newPrice);
					data.push(value);
					break;

				case amcm_type.AMCM_VAL_FORE_TYPE_NEW_PROFIT_RT: 	// 新決着経準率
					value.type = 2;
					value.unitPrcRatio = getRsp.cntPrc.newProfitRt;
					value.unitPrcRatioInput = clutil.comma(getRsp.cntPrc.newProfitRt.toFixed(1));
					data.push(value);
					break;

				case amcm_type.AMCM_VAL_FORE_TYPE_DOWN_RT:		// 税込修正へのダウン比率
					value.type = 2;
					value.unitPrcRatio = getRsp.cntPrc.downRt;
					value.unitPrcRatioInput = clutil.comma(getRsp.cntPrc.downRt.toFixed(1));
					data.push(value);
					break;

				default:
					break;
				}
			});

			$('#ca_unitPriceFore_tbody').empty();
			var $template = $('#ca_unitPriceFore_template');
			$template.tmpl(data).appendTo('#ca_unitPriceFore_tbody');
		},

		createDiscForeTable: function(getRsp, isEditable){
			var data = new Array();
			var typeNameList = clutil.gettypenamelist(amcm_type.AMCM_TYPE_FORE_TYPE);

			$.each(typeNameList, function() {
				var value = {
						discForeTypeID		: this.type_id,
						discForeTypeName	: this.name,
						discRatio			: 0,
						discComment			: '',
						isEditable			: isEditable,
					};

				switch (this.type_id){
				case amcm_type.AMCM_VAL_FORE_TYPE_DM_DISC: 		// DM割引
					value.discRatio = getRsp.cntPrc.dmRt.toFixed(1);
					value.discComment = getRsp.cntPrc.dmAm;
					data.push(value);
					break;

				case amcm_type.AMCM_VAL_FORE_TYPE_COUPON: 		// クーポン
					value.discRatio = getRsp.cntPrc.couponRt.toFixed(1);
					value.discComment = getRsp.cntPrc.couponAm;
					data.push(value);
					break;

				case amcm_type.AMCM_VAL_FORE_TYPE_POINT_CARD:	// ポイントカード
					value.discRatio = getRsp.cntPrc.pointRt.toFixed(1);
					value.discComment = getRsp.cntPrc.pointAm;
					data.push(value);
					break;

				default:
					break;
				}
			});

			$('#ca_discFore_tbody').empty();
			var $template = $('#ca_discFore_template');
			$template.tmpl(data).appendTo('#ca_discFore_tbody');
		},

		setReadOnlyAllItems: function(){
			clutil.viewReadonly($("#ca_base_form"));
			clutil.viewReadonly($("#ca_fore"));
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			var storeInitValue = null;
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {
				storeInitValue = {
					code : clcom.userInfo.org_code,
					id : clcom.userInfo.org_id,
					name : clcom.userInfo.org_name,
				};
			}

			var unitID = clcom.userInfo.unit_id;
			if (!_.isUndefined(this.options.srchCond) && !_.isUndefined(this.options.srchCond.unitID)){
				unitID = ~~this.options.srchCond.unitID;
			}

			// 店舗
			this.utl_store = clutil.clorgcode( {
				el : '#ca_storeName',
				dependAttrs : {
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id : Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					p_org_id	: unitID,
				},
				initValue : storeInitValue,
		    });

			// 作成日
			this.utl_date = clutil.datepicker(this.$("#ca_reportDate"));
			this.utl_date.datepicker('setIymd',clcom.getOpeDate());

			// シーズン
			this.utl_seasons = clutil.cltypeselector({
				el: '#ca_seasonList',
				kind: amcm_type.AMCM_TYPE_SEASON,
	    	});

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: '#ca_unitID',
					initValue: unitID,
				},
				// 品種
				clvarietycode: {
					el: '#ca_stditgrpName'
				},
			}, {
				dataSource: {
					ymd : clcom.getOpeDate,
				}
			});
			this.fieldRelation.done(function() {
				var tgtView = mainView;
				tgtView.utl_unit = this.fields.clbusunitselector;
				tgtView.initialized = true;
				tgtView.setInitializeValue();
				tgtView.setDefaultEnabledProp();
			});

			$("#div_ca_unitID").hide();

			this.initUIElement_AMPAV0010();

			this.fixedLimit();

			return this;
		},

		fixedLimit: function(){
			clutil.cltxtFieldLimit($("#ca_reportName"));

			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
				clutil.cltxtFieldLimit($("#ca_comment"));
			}
		},

		setInitializeValue: function(){
			if (this.delayedCallParam != null){
				this._onMDGetCompleted(this.delayedCallParam.args, this.delayedCallParam.e);
				this.delayedCallParam = null;
			}
		},

		setDefaultEnabledProp: function() {
			$(".cl_legend").hide();
			$("#ca_btn_store_select").hide();
		},

		initUIElement_AMPAV0010 : function(){
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el				: this.$("#ca_AMPAV0010_dialog"),	// 配置場所
				$parentView		: this.$("#mainColumn"),			// 親ビュー
				select_mode 	: clutil.cl_single_select,			// 単一選択
				isAnalyse_mode 	: false,							// 通常画面モード
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
				//$('#ca_toDate').datepicker('setIymd', clcom.max_date);
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
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMCPV0040GetReq: {
					cntPrcRprtID: this.options.chkData[pgIndex].cntPrcRprtID,
				},
				// 更新リクエスト
				AMCPV0040UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMCPV0040',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){

			if ($("#ca_table").find(".cl_error_field").length > 0){
				clutil.setFocus($($("#ca_table").find(".cl_error_field")[0]));
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return;
			}

			if(!this.validator.valid()) {
				return null;
			}

			// Recを構築する。
			var cntPrc = this.savedRsp.cntPrc;
			var discFore = clutil.tableview2data($('#ca_discFore_tbody').children());
			var unitPriceFore = clutil.tableview2data($('#ca_unitPriceFore_tbody').children());

			$.each(discFore, function() {
				switch (~~this.discForeTypeID){
				case amcm_type.AMCM_VAL_FORE_TYPE_DM_DISC: 		// DM割引
					cntPrc.dmRt = this.discRatio;
					cntPrc.dmAm = this.discComment;
					break;

				case amcm_type.AMCM_VAL_FORE_TYPE_COUPON: 		// クーポン
					cntPrc.couponRt = this.discRatio;
					cntPrc.couponAm = this.discComment;
					break;

				case amcm_type.AMCM_VAL_FORE_TYPE_POINT_CARD:	// ポイントカード
					cntPrc.pointRt = this.discRatio;
					cntPrc.pointAm = this.discComment;
					break;

				default:
					break;
				}
			});

			$.each(unitPriceFore, function() {
				switch (~~this.unitPrcForeTypeID){
				case amcm_type.AMCM_VAL_FORE_TYPE_NEW_PRICE: 		// 新価格決着上代
					cntPrc.newPrice = this.unitPrcAmInput;
					break;

				case amcm_type.AMCM_VAL_FORE_TYPE_NEW_PROFIT_RT: 	// 新決着経準率
					cntPrc.newProfitRt = this.unitPrcRatioInput;
					break;

				case amcm_type.AMCM_VAL_FORE_TYPE_DOWN_RT:			// 税込修正へのダウン比率
					cntPrc.downRt = this.unitPrcRatioInput;
					break;

				default:
					break;
				}
			});

			cntPrc.comment = $("#ca_comment").val();

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: this.options.opeTypeId,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// マスタ検索リクエスト
				AMCPV0040GetReq: {
				},
				// マスタ更新リクエスト
				AMCPV0040UpdReq: {
					cntPrc		: cntPrc,
				},
			};
//return null;
			return {
				resId: clcom.pageId,	//'AMCPV0040',
				data: updReq
			};
		},

		setSavedValues: function() {
			var discFore = clutil.tableview2data($('#ca_discFore_tbody').children());
			var unitPriceFore = clutil.tableview2data($('#ca_unitPriceFore_tbody').children());
			var comment = $("#ca_comment").val();

			this.savedValues = {
				discFore: discFore,
				unitPriceFore: unitPriceFore,
				comment:comment,
			};
		},

		hasChange: function() {
			var changed = false;

			var discFore = clutil.tableview2data($('#ca_discFore_tbody').children());
			var unitPriceFore = clutil.tableview2data($('#ca_unitPriceFore_tbody').children());
			var comment = $("#ca_comment").val();

			if (discFore.length != this.savedValues.discFore.length ||
				unitPriceFore.length != this.savedValues.unitPriceFore.length ||
				comment != this.savedValues.comment){
				changed = true;
			}else{
				var loopMax = 0;

				loopMax = discFore.length;
				for (var i = 0; i < loopMax; i++){
					if (discFore[i].discRatio != this.savedValues.discFore[i].discRatio ||
						discFore[i].discComment != this.savedValues.discFore[i].discComment ||
						discFore[i].discForeTypeID != this.savedValues.discFore[i].discForeTypeID){
						changed = true;
						break;
					}
				}

				loopMax = unitPriceFore.length;
				for (var i = 0; i < loopMax; i++){
					if (unitPriceFore[i].unitPrcAmInput != this.savedValues.unitPriceFore[i].unitPrcAmInput ||
						unitPriceFore[i].unitPrcRatioInput != this.savedValues.unitPriceFore[i].unitPrcRatioInput ||
						unitPriceFore[i].unitPrcForeTypeID != this.savedValues.unitPriceFore[i].unitPrcForeTypeID ||
						unitPriceFore[i].unitPrcRatio != this.savedValues.unitPriceFore[i].unitPrcRatio ||
						unitPriceFore[i].unitPrcAm != this.savedValues.unitPriceFore[i].unitPrcAm){
						changed = true;
						break;
					}
				}
			}

			return changed;
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onStoreSelClick: function(e) {
			var _this = this;
			_this.AMPAV0010Selector.show(null, null);
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			if (this.hasChange()){
				this.validator.setErrorHeader(clmsg.ECP0006);
				return;
			}

			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownloadCSV();
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:	// PDF 出力
				this.doDownloadPDF();
				break;

			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * CSVをダウンロードする
		 */
		doDownloadCSV: function(){
			if (typeof this.savedRsp == 'undefined'){
				return;
			}

			// リクエストをつくる
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMCPV0040GetReq: {
					cntPrcRprtID: this.savedRsp.cntPrc.cntPrcRprtID,
				},
				// 更新リクエスト
				AMCPV0040UpdReq: {
				}
			};

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMCPV0040', getReq);
			defer.fail(_.bind(function(data){
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * PDFをダウンロードする
		 */
		doDownloadPDF: function(){
			if (typeof this.savedRsp == 'undefined'){
				return;
			}

			// リクエストをつくる
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMCPV0040GetReq: {
					cntPrcRprtID: this.savedRsp.cntPrc.cntPrcRprtID,
				},
				// 更新リクエスト
				AMCPV0040UpdReq: {
				}
			};

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMCPV0040', getReq);
			defer.fail(_.bind(function(data){
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		_eof: 'AMCPV0040.MainView//'
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

		if (mainView.$(".cl_download").length > 1){
			$(mainView.$(".cl_download")[1]).text('プライス別棚卸報告出力');
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
