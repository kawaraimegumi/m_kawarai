$(function(){
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'), {useTabindex:true,});

	var TEMP_KEY = '000';

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,
		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',
			'change .cl_qy'					: '_onQYChange',
			'change .cl_price'				: '_onPriceChange',
			'click .addRow'					: '_onAddLineClick',
			'click .btn-delete'				: '_onBtnDelClick',
		},

		initialize: function(opt){
			_.bindAll(this);

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				cntPrcDate: clcom.getOpeDate(),
				chkData: []
			});

			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: 'プライス別棚卸明細データ入力',
					//subtitle: '',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					btn_cancel: {label:'前画面に戻る'},
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
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				setTimeout(function(){
					mainView.mdBaseView._onCancelClick();
				}, 2000);
				break;

			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				this.setReadOnlyAllItems();
				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// TODO: 入力値エラー情報が入っていれば、個別 View へセットする。
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){

			var data = args.data;
			var getRsp = data.AMCPV0030GetRsp;

			if (getRsp.priceLineList == 0) {
				clutil.mediator.trigger('onTicker', '指定品種のプライスラインが登録されていませんので、プライス別棚卸はできません');
				args.status = 'NG';
//				this.mdBaseView.options.btn_submit = false;
//				this.mdBaseView.options.btn_cancel = true;
				this.mdBaseView.options.opeTypeId = -1;
				this.mdBaseView.renderFooterNavi();
			}

			switch(args.status){
			case 'OK':

				var unitID = clcom.userInfo.unit_id;
				if (!_.isUndefined(this.options.srchCond) && !_.isNull(this.options.srchCond) &&
					!_.isUndefined(this.options.srchCond.unitID) && !_.isNull(this.options.srchCond.unitID)){
					unitID = this.options.srchCond.unitID;
				}

				clutil.data2view(
					this.$('#ca_base_form'),
					{
						unitID			: unitID,
						storeName		: getRsp.storeName,
						stditgrpName	: getRsp.stditgrpName,
						seasonList		: getRsp.seasonList,
						attrsName		: getRsp.attrsName,
						cntPrcDate		: getRsp.cntPrcDate,
					}
				);
				clutil.viewReadonly($("#ca_base_form"));

				if (getRsp.avePrice) $("#ca_avePrice").text(clutil.comma(getRsp.avePrice));
				if (getRsp.aveCost) $("#ca_aveCost").text(clutil.comma(getRsp.aveCost));
				if (getRsp.profitRt) $("#ca_profitRt").text(getRsp.profitRt + '%');

				$("#ca_lbl_aimQy_nm").text('改善');
				$("#ca_lbl_target1Qy_nm").text(getRsp.rsrchHd.targetName1);
				$("#ca_lbl_target2Qy_nm").text(getRsp.rsrchHd.targetName2);
				$("#ca_lbl_target3Qy_nm").text(getRsp.rsrchHd.targetName3);

				$("#ca_th_aimName").text('改善');
				$("#ca_th_targetName1").text(getRsp.rsrchHd.targetName1);
				$("#ca_th_targetName2").text(getRsp.rsrchHd.targetName2);
				$("#ca_th_targetName3").text(getRsp.rsrchHd.targetName3);

				$("#ca_td_reportDate").text(clutil.dateFormat(getRsp.rsrchHd.reportDate, 'yyyy/mm/dd(w)'));

				var opeDate = clcom.getOpeDate();
				this.utl_targetDate1.datepicker('setIymd', (getRsp.rsrchHd.targetDate1 <= clcom.min_date) ? opeDate : getRsp.rsrchHd.targetDate1);
				this.utl_targetDate2.datepicker('setIymd', (getRsp.rsrchHd.targetDate2 <= clcom.min_date) ? opeDate : getRsp.rsrchHd.targetDate2);
				this.utl_targetDate3.datepicker('setIymd', (getRsp.rsrchHd.targetDate3 <= clcom.min_date) ? opeDate : getRsp.rsrchHd.targetDate3);

				// チャート用データ作成
				this.buildChartSource(getRsp);

				this.savedRsp = getRsp;

				// チャート表示用データ作成
				this.buildChartLineItem();

				// チャート表示
				this.drawChart();

				// テーブル表示
				this.applyTableTemplate(this.getTableData());

				if (getRsp.rsrchHd.targetName1 == ""){
					$(".cl_tgt1").hide();
				}
				if (getRsp.rsrchHd.targetName2 == ""){
					$(".cl_tgt2").hide();
				}
				if (getRsp.rsrchHd.targetName3 == ""){
					$(".cl_tgt3").hide();
				}

				clutil.setFocus($('#ca_table input').first());

				if (this.isReadOnly()){
					this.setReadOnlyAllItems();
				}

				break;

			case 'DONE':		// 確定済
				// TODO: args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$('#ca_base_form'), getRsp.equipVend);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				clutil.data2view(this.$('#ca_base_form'), getRsp.equipVend);

				// 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$('#ca_base_form'), getRsp.equipVend);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			}
		},

		buildChartSource: function(getRsp){
			var graphData = {source:{}, total: null, min: 0, max: 0,};
			var numArray = new Array();
			var readonly = 0;
			if (this.isReadOnly()){
				readonly = 1;
			}

			if (getRsp.priceLineList.length > 0){

				$.each(getRsp.priceLineList, function() {
					graphData.source['' + this.priceLine] = {
						priceLine: this,
						qy: new Array(),
						sum: null,
					};
					numArray.push(this.lowerLimit);
					numArray.push(this.upperLimit);
				});

				graphData.min = Math.min.apply(null, numArray);
				graphData.max = Math.max.apply(null, numArray);

				$.each(getRsp.rsrchList, function() {
					var key = '' + this.priceLine;
					this.readonly = readonly;

					if (typeof graphData.source[key] == 'undefined'){
						return true;
					}

					if (this.recordType == 0 || this.recordType == 1){
						this.recordType = 1;
						this.priceLineDisp = clutil.comma(graphData.source[key].priceLine.priceLine);
						this.priceDisp = clutil.comma(this.price);
						this.editable = 0;
						graphData.source[key].qy.push(this);

						var index = graphData.source[key].qy.length - 1;
						graphData.source[key].qy[index].index = index;

					} else if (this.recordType == 2){
						this.priceLineDisp = '';
						this.priceDisp = '';
						this.editable = 0;
						this.index = 0;
						graphData.source[key].sum = this;

					} else if (this.recordType == 3){
						this.priceLineDisp = '';
						this.priceDisp = '';
						this.editable = 0;
						this.index = 0;
						graphData.total = this;
					}
				});

				$.each(graphData.source, function() {
					if (this.sum == null){
						this.sum = mainView.getQY();
						this.sum.recordType = 2;
						this.sum.priceLine = this.priceLine.priceLine;
						this.sum.priceLineDisp = '';
						this.sum.priceDisp = '';
						this.sum.editable = 0;
						this.sum.index = 0;
					}
				});

				if (graphData.total == null){
					graphData.total = mainView.getQY();
					graphData.total.recordType = 3;
					graphData.total.priceLineDisp = '';
					graphData.total.priceDisp = '';
					graphData.total.editable = 0;
					graphData.total.index = 0;
				}
			}

			this.chartSource = graphData;
		},

		buildChartLineItem: function(){
			//ココ＞＞
			var chkData = {};
			var tableData = this.getTableData();
			$.each(tableData, function() {
				if (this.recordType == 2){
					chkData['' + this.priceLine] = this;
				}
			});
			//ココ＜＜

			var labels = new Array();
			var data = new Array();

			data.push(new Array());// UNIT
			data.push(new Array());// 改善

			// 競合店１
			if (this.savedRsp.rsrchHd.targetID1 != 0){
				data.push(new Array());
			}

			// 競合店２
			if (this.savedRsp.rsrchHd.targetID2 != 0){
				data.push(new Array());
			}

			// 競合店３
			if (this.savedRsp.rsrchHd.targetID3 != 0){
				data.push(new Array());
			}

			var max = 0;

			$.each(this.chartSource.source, function() {

				if (this.priceLine.priceLine == TEMP_KEY){
					return true;
				}

				//ココ＞＞
				if (!chkData['' + this.priceLine.priceLine]){
					return true;
				}
				//ココ＜＜

				labels.push(clutil.comma(this.priceLine.priceLine));

				if (this.sum == null){
					this.sum = mainView.getQY();
					this.sum.recordType = 2;
					this.sum.priceLine = this.priceLine.priceLine;
				}

				var index = 0;
				data[index++].push(this.sum.qy);
				data[index++].push(this.sum.aimQy);

				if (mainView.savedRsp.rsrchHd.targetID1 != 0){
					data[index++].push(this.sum.target1Qy);
				}
				if (mainView.savedRsp.rsrchHd.targetID2 != 0){
					data[index++].push(this.sum.target2Qy);
				}
				if (mainView.savedRsp.rsrchHd.targetID3 != 0){
					data[index++].push(this.sum.target3Qy);
				}

				if (this.sum.qy > max)			{ max = this.sum.qy;}
				if (this.sum.aimQy > max)		{ max = this.sum.aimQy;}
				if (this.sum.target1Qy > max)	{ max = this.sum.target1Qy;}
				if (this.sum.target2Qy > max)	{ max = this.sum.target2Qy;}
				if (this.sum.target3Qy > max)	{ max = this.sum.target3Qy;}
			});

			// 横要素が一つだとグラフにならないので、起点の0を入れておく
			if (labels.length == 1){
				labels.push(labels[0]);
				labels['1'] = '-';

				$.each(data, function() {
					this.push(this[0]);
					this[1] = undefined;
				});
			}

			this.chartSource.lineItem = {
				labels		: labels,
				data		: data,
				max			: max,
				stepWidth	: 10,
			};
		},

		updateChartSourceTotal: function(){
			var total = this.chartSource.total;

			total.aimQy = 0;
			total.target1Qy = 0;
			total.target2Qy = 0;
			total.target3Qy = 0;

			$.each(this.chartSource.source, function() {
				var sum = this.sum;
				sum.aimQy = 0;
				sum.target1Qy = 0;
				sum.target2Qy = 0;
				sum.target3Qy = 0;

				$.each(this.qy, function() {
					total.aimQy += this.aimQy;
					total.target1Qy += this.target1Qy;
					total.target2Qy += this.target2Qy;
					total.target3Qy += this.target3Qy;
					sum.aimQy += this.aimQy;
					sum.target1Qy += this.target1Qy;
					sum.target2Qy += this.target2Qy;
					sum.target3Qy += this.target3Qy;
				});

				if (total.aimQy > 0){
					total.aimCompRatio = 100;
				}
				if (total.target1Qy > 0){
					total.target1CompRatio = 100;
				}
				if (total.target2Qy > 0){
					total.target2CompRatio = 100;
				}
				if (total.target3Qy > 0){
					total.target3CompRatio = 100;
				}
			});
		},

		updateChartSourceCompRatio: function(){
			var funcRoundRate =  function(lhs, rhs){return (rhs) ? Math.round(lhs / rhs * 100 * 10) / 10 : 0;};
			var total = this.chartSource.total;

			$.each(this.chartSource.source, function() {
				$.each(this.qy, function() {
					this.aimCompRatio = funcRoundRate(this.aimQy, total.aimQy);
					this.target1CompRatio = funcRoundRate(this.target1Qy, total.target1Qy);
					this.target2CompRatio = funcRoundRate(this.target2Qy, total.target2Qy);
					this.target3CompRatio = funcRoundRate(this.target3Qy, total.target3Qy);
				});

				var sum = this.sum;
				sum.aimCompRatio = funcRoundRate(sum.aimQy, total.aimQy);
				sum.target1CompRatio = funcRoundRate(sum.target1Qy, total.target1Qy);
				sum.target2CompRatio = funcRoundRate(sum.target2Qy, total.target2Qy);
				sum.target3CompRatio = funcRoundRate(sum.target3Qy, total.target3Qy);
			});
		},

		roundRate: function(lhs, rhs) {
			return (rhs) ? Math.round(lhs / rhs * 100 * 10) / 10 : 0;
		},

		getTableData: function(){
			var rowIndex = 0;
			var tableData = new Array();

			this.chartSource.total.rowIndex = rowIndex++;
			tableData.push(this.chartSource.total);

			var min = this.chartSource.min;
			var max = this.chartSource.max;

			$.each(this.chartSource.source, function() {

				if (this.qy.length == 0){
					return true;
				}

				$.each(this.qy, function() {
					this.min = min;
					this.max = max;
					this.rowIndex = rowIndex++;
					tableData.push(this);
				});

				this.sum.rowIndex = rowIndex++;
				tableData.push(this.sum);
			});

			$.each(tableData, function() {
				this.rowCount = rowIndex;
			});

			return tableData;
		},

		drawChart: function(){
			var index = 5;
			var datasets = [];

			index--;
			if (this.savedRsp.rsrchHd.targetID3 != 0){
				datasets.push({
					strokeColor : "rgba(242,85,95,.3)",
					pointColor : "#fff",
					pointStrokeColor : "rgba(242,85,95,.3)",
					data : this.chartSource.lineItem.data[index],
				});
			}

			index--;
			if (this.savedRsp.rsrchHd.targetID2 != 0){
				datasets.push({
					strokeColor : "rgba(252,174,63,.3)",
					pointColor : "#fff",
					pointStrokeColor : "rgba(252,174,63,.3)",
					data : this.chartSource.lineItem.data[index],
				});
			}

			index--;
			if (this.savedRsp.rsrchHd.targetID1 != 0){
				datasets.push({
					strokeColor : "rgba(15,184,170,.3)",
					pointColor : "#fff",
					pointStrokeColor : "rgba(15,184,170,.3)",
					data : this.chartSource.lineItem.data[index],
				});
			}

			index--;
			datasets.push({
				strokeColor : "rgba(162,169,179,1)",
				pointColor : "#fff",
				pointStrokeColor : "rgba(162,169,179,1)",
				data : this.chartSource.lineItem.data[index],
			});

			index--;
			datasets.push({
				strokeColor : "#1e9ce6",
				pointColor : "#fff",
				pointStrokeColor : "#1e9ce6",
				data : this.chartSource.lineItem.data[index],
			});

			var lineChartData = {
				labels		: this.chartSource.lineItem.labels,
				datasets	: datasets,
			};

			var multiple = 1;

			// グラフ表示する最大の値から、表示桁算出用の倍率を求める
			// ※ maxが1～9ならmultipleは1（1桁）。
			// ※ maxが10～99ならmultipleは10（2桁）。
			// ※ maxが99～999ならmultipleは100（3桁）。…
			var loopMax = this.chartSource.lineItem.max.toString().length - 1;
			for (var i = 0; i < loopMax; i++){
				multiple *= 10;
			}

			// グラフの上限値(*1)を求める
			// ※ *1 > max になっていないと、折れ線が見切れてしまう。
			// ※ maxが56なら、*1は60、
			// ※ maxが999なら、*1は1000と、
			// ※ maxより大きく、かつ、なるべくmaxに近い数にする必要がある。
			var max = Math.floor(this.chartSource.lineItem.max / multiple + 0.9) * multiple;

			// 刻み幅設定　（1/10刻み、1/4刻み、1/2刻み、1/1刻み）
			var widthList = [multiple / 10, multiple / 4, multiple / 2, multiple];
			var stepList = [];

			$.each(widthList, function(){
				// それぞれの刻み幅で、上限に達するまでに必要な目盛り数を求める
				// ※ 上限500の場合、
				// ※ 1/10刻み(10ずつ) なら50本、
				// ※ 1/4刻み (25ずつ) なら20本、
				// ※ 1/2刻み (50ずつ) なら10本、
				// ※ 1/1刻み (100ずつ)なら 5本の横線が必要。
				stepList.push(max / this);
			});

			var scaleStepWidth = multiple;
			var scaleSteps = Math.floor(this.chartSource.lineItem.max / scaleStepWidth + 0.9);

			// 刻み幅単位を何回繰り返すかで、グラフの高さが決まる
			// ※ 50ずつ10回だと、一番上が500
			var listLen = widthList.length;
			for (var i = 0; i < listLen; i++){
				// 横線10本程度に収まる刻み幅を選択する
				// ※ 横線が多いと見難く、かつ、描画時間が延びる。
				if (widthList[i] >= 1 &&
					widthList[i] - Math.floor(widthList[i]) == 0 &&
					stepList[i] <= 12){
					scaleSteps = stepList[i];
					scaleStepWidth = widthList[i];

					// なるべく余白を少なくするために、刻み幅を反映して本数を調整する
					// ※ maxが32の場合、グラフ上限値が40になるが、
					// 　 刻み幅が2桁の1/2刻み(5づつ)になるので、上限値は35で足りる。
					while((scaleSteps - 1) * scaleStepWidth > this.chartSource.lineItem.max){
						scaleSteps--;
					}

					break;
				}
			}
			// ※ 描画領域のサイズは変わらないので、領域内を何等分すれば
			// ※ 全てが収まり、見やすい表示になるか？―と、考える。

			// MD-2383 プライス別棚卸_グラフ拡大現象_PGM開発
			// Chart.jsがcanvasの幅と高さを描画ごとに変更するため、描画前に毎回初期値に戻す。
			// 肩さ・幅はcssではなく、canvasタグのwidthとheightを変更する
			$("#chart").attr({
				width: '920',
				height: '400'
				});

			new Chart($("#chart")[0].getContext("2d")).Line(lineChartData, {
				scaleOverlay : false,
				scaleOverride : true,
				scaleSteps : scaleSteps,
				scaleStepWidth : scaleStepWidth,
				scaleStartValue : null,
				scaleLineColor : "#d0d5d9",
				scaleLineWidth : 1,
				scaleShowLabels : true,
				scaleLabel : "<%=clutil.comma(value)%>",
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
				onAnimationProgress: function(){},
				onAnimationComplete : function(){},
			});
		},

		applyTableTemplate: function(data){
			$('#ca_table_tbody').empty();
			var $template = $('#ca_tbody_template');
			$template.tmpl(data).appendTo('#ca_table_tbody');
		},

		drawTableTotal: function(){

			var id_key = '';

			$.each(this.chartSource.source, function() {

				$.each(this.qy, function() {
					id_key = this.priceLine + '_' + this.index + '_' + this.recordType;

					//$('#ca_td_aimQy_' + id_key).val(this.aimQy);
					$('#ca_td_aimCompRatio_' + id_key).text((this.aimCompRatio.toFixed(1)) + '%');
					$('#ca_td_target1CompRatio_' + id_key).text((this.target1CompRatio.toFixed(1)) + '%');
					$('#ca_td_target2CompRatio_' + id_key).text((this.target2CompRatio.toFixed(1)) + '%');
					$('#ca_td_target3CompRatio_' + id_key).text((this.target3CompRatio.toFixed(1)) + '%');
				});

				id_key = this.sum.priceLine + '_' + this.sum.index + '_' + this.sum.recordType;
				$('#ca_td_aimQy_' + id_key).text(clutil.comma(this.sum.aimQy));
				$('#ca_td_aimCompRatio_' + id_key).text((this.sum.aimCompRatio.toFixed(1)) + '%');
				$('#ca_td_target1Qy_' + id_key).text(clutil.comma(this.sum.target1Qy));
				$('#ca_td_target1CompRatio_' + id_key).text((this.sum.target1CompRatio.toFixed(1)) + '%');
				$('#ca_td_target2Qy_' + id_key).text(clutil.comma(this.sum.target2Qy));
				$('#ca_td_target2CompRatio_' + id_key).text((this.sum.target2CompRatio.toFixed(1)) + '%');
				$('#ca_td_target3Qy_' + id_key).text(clutil.comma(this.sum.target3Qy));
				$('#ca_td_target3CompRatio_' + id_key).text((this.sum.target3CompRatio.toFixed(1)) + '%');
			});

			var total = this.chartSource.total;
			id_key = total.priceLine + '_' + total.index + '_' + total.recordType;
			$('#ca_td_aimQy_' + id_key).text(clutil.comma(total.aimQy));
			$('#ca_td_aimCompRatio_' + id_key).text((total.aimCompRatio.toFixed(1)) + '%');
			$('#ca_td_target1Qy_' + id_key).text(clutil.comma(total.target1Qy));
			$('#ca_td_target1CompRatio_' + id_key).text((total.target1CompRatio.toFixed(1)) + '%');
			$('#ca_td_target2Qy_' + id_key).text(clutil.comma(total.target2Qy));
			$('#ca_td_target2CompRatio_' + id_key).text((total.target2CompRatio.toFixed(1)) + '%');
			$('#ca_td_target3Qy_' + id_key).text(clutil.comma(total.target3Qy));
			$('#ca_td_target3CompRatio_' + id_key).text((total.target3CompRatio.toFixed(1)) + '%');
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
			clutil.viewReadonly($("#div_ca_targetDate1"));
			clutil.viewReadonly($("#div_ca_targetDate2"));
			clutil.viewReadonly($("#div_ca_targetDate3"));
			$(".cl_btnDelete").hide();
			$(".addRow").hide();
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

			// 店舗
			this.utl_store = clutil.clorgcode( {
				el : '#ca_storeName',
				dependAttrs : {
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id : Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					p_org_id	: clcom.userInfo.unit_id,
				},
				initValue : storeInitValue,
		    });

			// 作成日
			this.utl_date = clutil.datepicker(this.$("#ca_cntPrcDate"));
			this.utl_date.datepicker('setIymd',clcom.getOpeDate());

			// シーズン
			this.utl_seasons = clutil.cltypeselector({
				el: '#ca_seasonList',
				kind: amcm_type.AMCM_TYPE_SEASON,
	    	});

			this.utl_targetDate1 = clutil.datepicker(this.$("#ca_targetDate1"));
			this.utl_targetDate2 = clutil.datepicker(this.$("#ca_targetDate2"));
			this.utl_targetDate3 = clutil.datepicker(this.$("#ca_targetDate3"));

			var opeDate = clcom.getOpeDate();
			this.utl_targetDate1.datepicker('setIymd',opeDate);
			this.utl_targetDate2.datepicker('setIymd',opeDate);
			this.utl_targetDate3.datepicker('setIymd',opeDate);

			var initUnitID = clcom.userInfo.unit_id;
			if (!_.isUndefined(this.options.srchCond) && !_.isNull(this.options.srchCond) &&
				!_.isUndefined(this.options.srchCond.unitID) && !_.isNull(this.options.srchCond.unitID)){
				initUnitID = this.options.srchCond.unitID;
			}

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: '#ca_unitID',
					initValue: initUnitID,
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
				$("#ca_lbl_qy_nm").text(this.fields.clbusunitselector.getAttrs('name').name);
				$("#ca_th_unitName").text(this.fields.clbusunitselector.getAttrs('name').name);
				tgtView.setInitializeValue();
				tgtView.setDefaultEnabledProp();
			});

			$("#div_ca_unitID").hide();

			this.initUIElement_AMPAV0010();

			return this;
		},

		setInitializeValue: function(){
		},

		setDefaultEnabledProp: function() {
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
//				$('#ca_toDate').datepicker('setIymd', clcom.max_date);
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMCPV0030GetReq: {
					cntPrcRprtID: this.options.chkData[pgIndex].cntPrcRprtID,
					cntPrcAxisID: this.options.chkData[pgIndex].cntPrcAxisID,
				},
				// 更新リクエスト
				AMCPV0030UpdReq: {
				}
			};

			$("#ca_cntPrcAxisID").val(getReq.AMCPV0030GetReq.cntPrcAxisID);

			this.savedGetReq = getReq;

			return {
				resId: clcom.pageId,	//'AMCPV0030',
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
			var rsrchList = new Array();
			var rsrchHd = this.savedRsp.rsrchHd;
			var foot = clutil.tableview2data($('#ca_table_tfoot').children());
			var axisID = ~~foot[1].cntPrcAxisID;

			rsrchHd.cntPrcRprtID = this.savedRsp.cntPrcRprtID;
			rsrchHd.cntPrcAxisID = axisID;
			rsrchHd.itemAttr1ID = this.savedRsp.itemAttr1ID;
			rsrchHd.itemAttr1ValueID = this.savedRsp.itemAttr1ValueID;
			rsrchHd.itemAttr2ID  = this.savedRsp.itemAttr2ID;
			rsrchHd.itemAttr2ValueID = this.savedRsp.itemAttr2ValueID;
			rsrchHd.reportDate = this.savedRsp.cntPrcDate;
			rsrchHd.targetDate1 = foot[1].targetDate1;
			rsrchHd.targetDate2 = foot[1].targetDate2;
			rsrchHd.targetDate3 = foot[1].targetDate3;

			if(this.chartSource.total != null){
				this.chartSource.total.cntPrcAxisID = axisID;
				rsrchList.push(this.chartSource.total);
			}
			$.each(this.chartSource.source, function() {
				if (this.qy.length == 0){
					return true;
				}

				$.each(this.qy, function() {
					this.cntPrcAxisID = axisID;
					rsrchList.push(this);
				});

				this.sum.cntPrcAxisID = axisID;
				rsrchList.push(this.sum);
			});

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// マスタ検索リクエスト
				AMCPV0030GetReq: this.savedGetReq.AMCPV0030GetReq,
				// マスタ更新リクエスト
				AMCPV0030UpdReq: {
					rsrchHd		: rsrchHd,
					rsrchList	: rsrchList,
				},
			};
//return null;
			return {
				resId: clcom.pageId,	//'AMCPV0030',
				data: updReq
			};
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onStoreSelClick: function(e) {
			var _this = this;
			_this.AMPAV0010Selector.show(null, null);
		},

		_onQYChange: function(e) {
			var $tgt = $(e.currentTarget);
			var $tr = $tgt.parent().parent();
			var priceLine = $tr.attr('id');
			var index = Number($tr.data('index'));
			var value = Number($tgt.val().replace(/[^0-9]/g, "").substring(0,4));

			if(value > 9999) {
				return null;
			}

			var opeDate = clcom.getOpeDate();
			$tgt.val(value);

			switch ($tgt.attr('name')){
			case 'aimQy':
				this.chartSource.source[priceLine].qy[index].aimQy = value;
				break;
			case 'target1Qy':
				this.chartSource.source[priceLine].qy[index].target1Qy = value;
				this.utl_targetDate1.datepicker('setIymd', opeDate);
				break;
			case 'target2Qy':
				this.chartSource.source[priceLine].qy[index].target2Qy = value;
				this.utl_targetDate2.datepicker('setIymd', opeDate);
				break;
			case 'target3Qy':
				this.chartSource.source[priceLine].qy[index].target3Qy = value;
				this.utl_targetDate3.datepicker('setIymd', opeDate);
				break;
			}

			this.updateChartSourceTotal();
			this.updateChartSourceCompRatio();

			this.buildChartLineItem();
			this.drawChart();

			this.drawTableTotal();

			this.setColumnVisible();
		},

		_onPriceChange: function(e) {
			var $tgt = $(e.currentTarget);
			var $tr = $tgt.parent().parent();
			var priceLine = $tr.attr('id');
			var index = Number($tr.data('index'));
			var value = Number($tgt.val().replace(/[^0-9]/g, "").substring(0,7));
			var srcArray = this.chartSource.source[priceLine].qy;
			var qy = srcArray[index];
			var doApply = false;

			var chkVal_Min = this.chartSource.min;
			var chkVal_Max = this.chartSource.max;
			if (value < chkVal_Min){
				$tgt.val(value);
				mainView.validator.setErrorMsg($tgt, clutil.fmtargs(clmsg.cl_min, [chkVal_Min]));
				return;
			}
			if (value > chkVal_Max){
				$tgt.val(value);
				mainView.validator.setErrorMsg($tgt, clutil.fmtargs(clmsg.cl_max, [chkVal_Max]));
				return;
			}
			// 同じプライスがないかチェックする
			var hasError = false;
			$.each(this.chartSource.source, function() {
				$.each(this.qy, function() {
					if ((this.priceLine != priceLine  ||
							this.priceLine == priceLine && this.index != index) &&
							this.price == value){
						mainView.validator.setErrorMsg($tgt, clmsg.EMS0052);
						hasError = true;
						return false;
					}
				});

				if (hasError){
					return false;
				}
			});
			if (hasError){
				return;
			}

			this.validator.clear();

			$tgt.val(value);
			qy.price = value;
			qy.priceDisp = clutil.comma(value);

			$.each(this.savedRsp.rsrchList, function() {
				if (this.price == value){
					qy.qy = this.qy;
					qy.compRatio = this.compRatio;
					if (priceLine == TEMP_KEY){
						qy.aimQy = this.aimQy;
						qy.aimCompRatio = this.aimCompRatio;
						qy.target1Qy = this.target1Qy;
						qy.target1CompRatio = this.target1CompRatio;
						qy.target2Qy = this.target2Qy;
						qy.target2CompRatio = this.target2CompRatio;
						qy.target3Qy = this.target3Qy;
						qy.target3CompRatio = this.target3CompRatio;
					}
					return false; //break
				}
			});

			$.each(this.chartSource.source, function() {
				// 入力値が該当するプライスラインかチェック
				if (value >= this.priceLine.lowerLimit && value < this.priceLine.upperLimit){
					// 元と違うプライスラインの場合
					if (qy.priceLine != this.priceLine.priceLine){
						// 行追加（先）
						qy.cntPrcAxisID = this.cntPrcAxisID;
						qy.priceLine = this.priceLine.priceLine;
						qy.priceLineDisp =  clutil.comma(this.priceLine.priceLine);
						qy.index = this.qy.length;
						this.qy.push(qy);

						// 行削除（元）
						srcArray.splice(index, 1);
						for (var i = 0; i < srcArray.length; i++) {
							srcArray[i].index = i;
						}

						doApply = true;
					}

					this.qy.sort(function(a,b){
						var x = a.price;
						var y = b.price;
				    	if( x > y ) return 1;
				        if( x < y ) return -1;
				        return 0;
				    });

					for (var i = 0; i < this.qy.length; i++) {
						this.qy[i].index = i;
					}

					return false; //break
				}
			});

			this.updateChartSourceTotal();
			this.updateChartSourceCompRatio();

			this.buildChartLineItem();
			this.drawChart();

			if (doApply){
				this.applyTableTemplate(this.getTableData());

				this.$focusTgt = $('#ca_td_aimQy_' + qy.priceLine + '_' + qy.index + '_' + qy.recordType).find('input');
				setTimeout(function(){
					clutil.setFocus(mainView.$focusTgt);
				}, 50);
			}

			this.setColumnVisible();
		},

		/**
		 * 行追加処理(tfoot)
		 */
		_onAddLineClick : function(e) {

			var qy = this.getQY();
			qy.recordType = 1;
			qy.priceLine = TEMP_KEY;
			qy.editable = 1;
			qy.readonly = 0;

			if (this.chartSource.source[TEMP_KEY] == null){

				var priceLine = {
					priceLine	: TEMP_KEY,
					upperLimit	: 0,
					lowerLimit	: 0,
				};

				var sum = this.getQY();
				sum.recordType = 2;
				sum.readonly = 1;

				this.chartSource.source[TEMP_KEY] = {
					priceLine	: priceLine,
					qy 			: [qy,],
					sum			: sum,
				};
			} else {
				qy.index = this.chartSource.source[TEMP_KEY].qy.length;
				qy.readonly = 0;
				this.chartSource.source[TEMP_KEY].qy.push(qy);
			}

			this.applyTableTemplate(this.getTableData());

			this.setColumnVisible();
		},

		setColumnVisible : function() {
			if (typeof this.savedRsp != 'undefined' && this.savedRsp != null){
				if (this.savedRsp.rsrchHd.targetName1 == ""){
					$(".cl_tgt1").hide();
				}
				if (this.savedRsp.rsrchHd.targetName2 == ""){
					$(".cl_tgt2").hide();
				}
				if (this.savedRsp.rsrchHd.targetName3 == ""){
					$(".cl_tgt3").hide();
				}
			}
		},


		_onBtnDelClick : function(e) {
			var $tgt = $(e.currentTarget);
			var $tr = $tgt.parent().parent();
			var priceLine = $tr.attr('id');
			var index = Number($tr.data('index'));
			this.chartSource.source[priceLine].qy.splice(index, 1);

			this.chartSource.source[priceLine].qy.sort(
				function(a,b){
					var x = a.price;
					var y = b.price;
			    	if( x > y ) return 1;
			        if( x < y ) return -1;
			        return 0;
			    }
			);

			// 行削除（元）
			var loopMax = this.chartSource.source[priceLine].qy.length;
			for (var i = 0; i < loopMax; i++) {
				this.chartSource.source[priceLine].qy[i].index = i;
			}

			this.updateChartSourceTotal();
			this.updateChartSourceCompRatio();

			this.buildChartLineItem();
			this.drawChart();

			this.applyTableTemplate(this.getTableData());

			this.setColumnVisible();
		},

		getQY: function(){
			return  {
				recordType 			: 0,
				cntPrcAxisID		: 0,
				priceLine			: 0,
				price				: 0,
				qy					: 0,
				compRatio			: 0,
				aimQy				: 0,
				aimCompRatio		: 0,
				target1Qy			: 0,
				target1CompRatio	: 0,
				target2Qy			: 0,
				target2CompRatio	: 0,
				target3Qy			: 0,
				target3CompRatio	: 0,
				index				: 0,	// 画面用
				priceLineDisp		: '',	// 画面用
				priceDisp			: '',	// 画面用
				editable			: 0,	// 画面用
			};
		},

		_eof: 'AMCPV0010.MainView//'
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
