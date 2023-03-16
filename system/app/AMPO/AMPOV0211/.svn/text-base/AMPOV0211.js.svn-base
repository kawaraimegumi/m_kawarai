$(function(){

	clutil.enterFocusMode($('body'));
	var EditView = Backbone.View.extend({
		el : $("#ca_main"),

		validator : null,

		events : {

			'change #ca_poTypeID' 			: '_PoTypeChange',

			"click #ca_table_tfoot101 tr" : "_onAddRow101Click",
			"click #ca_table_tfoot102 tr" : "_onAddRow102Click",
			"click #ca_table_tfoot103 tr" : "_onAddRow103Click",
			"click #ca_table_tfoot104 tr" : "_onAddRow104Click",
			"click #ca_table_tfoot105 tr" : "_onAddRow105Click",
			"click #ca_table_tfoot106 tr" : "_onAddRow106Click",
			"click #ca_table_tfoot107 tr" : "_onAddRow107Click",
			"click #ca_table_tfoot108 tr" : "_onAddRow108Click",
			"click #ca_table_tfoot201 tr" : "_onAddRow201Click",
			"click #ca_table_tfoot202 tr" : "_onAddRow202Click",
			"click #ca_table_tfoot203 tr" : "_onAddRow203Click",
			"click #ca_table_tfoot204 tr" : "_onAddRow204Click",
			"click #ca_table_tfoot205 tr" : "_onAddRow205Click",
			"click #ca_table_tfoot301 tr" : "_onAddRow301Click",
			"click #ca_table_tfoot302 tr" : "_onAddRow302Click",
			"click #ca_table_tfoot401 tr" : "_onAddRow401Click",
			"click #ca_table_tfoot402 tr" : "_onAddRow402Click",
			"click #ca_table_tfoot403 tr" : "_onAddRow403Click",

		},

		/**
		 * opt : clcom.pageArgs
		 */
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
						title: 'オプショングループ',
						opeTypeId: o.opeTypeId,
						pageCount: o.chkData.length,
						// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
						// リクエストビルダ関数を渡しておく。
						buildSubmitReqFunction: this._buildSubmitReqFunction,
						// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
						// リクエストのビルダ関数を opt で渡しておく。
						buildGetReqFunction: this._buildGetReqFunction,
						buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
//			// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
//			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
//			break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// それ以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			return this;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			// 初期データ取得後に呼ばれる関数
			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'));
			// ＰＯ種別
			clutil.cltypeselector(this.$("#ca_poTypeID"), amcm_type.AMCM_TYPE_PO_CLASS);
			// 適用期間
			clutil.datepicker(this.$("#ca_fromDate"));
			this.$("#ca_fromDate").datepicker('setIymd', clcom.getOpeDate() + 1);
			clutil.datepicker(this.$("#ca_toDate"));
			this.$("#ca_toDate").datepicker('setIymd', clcom.max_date);
			clutil.viewReadonly(this.$(".ca_toDate_div"));
			this._PoTypeChange();
			return this;
		},

		_PoTypeChange: function(e) {
			this.clearTable();
			var $POTypeID = this.$("#ca_poTypeID");
			if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				//メンズ
				this.$("#ca_table_form1").show();
				this.$("#ca_table_div108").show();
				this.$("#gtitle_1").html("ジャケット");
				this.$("#label101").html("袖4つボタン");
				this.$("#label102").html("サマー仕様");
				this.$("#label103").html("チェンジポケット");
				this.$("#label104").html("ボタン変更");
				this.$("#label105").html("本切羽");
				this.$("#label106").html("AMFステッチ");
				this.$("#label107").html("裏地変更");
				this.$("#label108").html("お台場");

				this.$("#ca_table_form2").show();
				this.$("#ca_table_div203").show();
				this.$("#ca_table_div204").show();
				this.$("#ca_table_div205").show();
				this.$("#gtitle_2").html("スラックス");
				this.$("#label201").html("サマー仕様");
				this.$("#label202").html("ボタン変更");
				this.$("#label203").html("アジャスター");
				this.$("#label204").html("スペア用<br>アジャスター");
				this.$("#label205").html("スペア<br>スラックス品番");


				this.$("#ca_table_form3").hide();

				this.$("#ca_table_form4").show();
				this.$("#gtitle_4").html("ベスト");
				this.$("#label401").html("AMFステッチ");
				this.$("#label402").html("裏地変更");
				this.$("#label403").html("ボタン変更");


				this.$("#ca_table_form5").hide();

			}else if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				// レディス
				this.$("#ca_table_form1").show();
				this.$("#ca_table_div108").hide();
				this.$("#gtitle_1").html("ジャケット");
				this.$("#label101").html("AMFステッチ");
				this.$("#label102").html("有料胸ポケット");
				this.$("#label103").html("袖デザイン");
				this.$("#label104").html("内ポケット");
				this.$("#label105").html("センターベント");
				this.$("#label106").html("ボタン変更");
				this.$("#label107").html("裏地変更");

				this.$("#ca_table_form2").show();
				this.$("#ca_table_div203").hide();
				this.$("#ca_table_div204").hide();
				this.$("#ca_table_div205").hide();
				this.$("#gtitle_2").html("スカート");
				this.$("#label201").html("スペアスカート<br>品番");
				this.$("#label202").html("ボタン変更");


				this.$("#ca_table_form3").show();
				this.$("#gtitle_3").html("パンツ");
				this.$("#label301").html("スペアパンツ<br>品番");
				this.$("#label302").html("ボタン変更");

				this.$("#ca_table_form4").show();
				this.$("#gtitle_4").html("ベスト");
				this.$("#label401").html("尾錠");
				this.$("#label402").html("ボタン変更");
				this.$("#label403").html("裏地変更");

				this.$("#ca_table_form5").hide();

			}else if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				// シャツ
				this.$("#ca_table_form1").hide();

				this.$("#ca_table_form2").hide();

				this.$("#ca_table_form3").hide();

				this.$("#ca_table_form4").hide();

				this.$("#ca_table_form5").show();
				this.$("#gtitle_5").html("オプション");
				this.$("#label501").html("衿型");
				this.$("#label502").html("前立");
				this.$("#label503").html("ポケット");
				this.$("#label504").html("袖・カフス");
				this.$("#label505").html("縫製");
				this.$("#label506").html("仕上り寸法");
				this.$("#label507").html("身頃");
				this.$("#label508").html("ボタン");
				this.$("#label509").html("イニシャル");
				this.$("#label510").html("クレリック");
				this.$("#label511").html("衿芯加工");
				this.$("#label512").html("後身頃");
				this.$("#label513").html("ボタンホール<br>オプション");
				this.$("#label514").html("ボタン付糸<br>オプション");
				this.$("#label515").html("ハンドステッチ<br>オプション");
				this.$("#label516").html("補正オプション");
			}else{
				this.$("#ca_table_form1").hide();
				this.$("#ca_table_form2").hide();
				this.$("#ca_table_form3").hide();
				this.$("#ca_table_form4").hide();
				this.$("#ca_table_form5").hide();
			}
		},

		_onAddRow101Click: function(e) {
			this.addRow(this.$("#ca_table101"));
		},
		_onAddRow102Click: function(e) {
			this.addRow(this.$("#ca_table102"));
		},
		_onAddRow103Click: function(e) {
			this.addRow(this.$("#ca_table103"));
		},
		_onAddRow104Click: function(e) {
			this.addRow(this.$("#ca_table104"));
		},
		_onAddRow105Click: function(e) {
			this.addRow(this.$("#ca_table105"));
		},
		_onAddRow106Click: function(e) {
			this.addRow(this.$("#ca_table106"));
		},
		_onAddRow107Click: function(e) {
			this.addRow(this.$("#ca_table107"));
		},
		_onAddRow108Click: function(e) {
			this.addRow(this.$("#ca_table108"));
		},
		_onAddRow201Click: function(e) {
			this.addRow(this.$("#ca_table201"));
		},
		_onAddRow202Click: function(e) {
			this.addRow(this.$("#ca_table202"));
		},
		_onAddRow203Click: function(e) {
			this.addRow(this.$("#ca_table203"));
		},
		_onAddRow204Click: function(e) {
			this.addRow(this.$("#ca_table204"));
		},
		_onAddRow205Click: function(e) {
			this.addRow(this.$("#ca_table205"));
		},
		_onAddRow301Click: function(e) {
			this.addRow(this.$("#ca_table301"));
		},
		_onAddRow302Click: function(e) {
			this.addRow(this.$("#ca_table302"));
		},
		_onAddRow401Click: function(e) {
			this.addRow(this.$("#ca_table401"));
		},
		_onAddRow402Click: function(e) {
			this.addRow(this.$("#ca_table402"));
		},
		_onAddRow403Click: function(e) {
			this.addRow(this.$("#ca_table403"));
		},


		render : function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			this.clearTable();
			this.mdBaseView.fetch();	// 新規だろうとなんだろうとデータを GET してくる。

			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			var _this = this;
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
//				clutil.viewReadonly(this.$("#ca_base_form"));
//				this._tableDisable();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
//				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
//				prefix: 'ca_'
//				});
				//スタイルテーブルのエラーだけは自前で実装
				var optTrTagList = new Array;
				$("#ca_table_tbody101").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody102").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody103").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody104").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody105").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody106").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody107").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody108").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody201").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody202").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody203").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody204").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody205").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody301").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody302").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody401").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody402").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody403").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody501").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody502").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody503").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody504").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody505").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody506").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody507").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody508").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody509").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody510").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody511").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody512").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody513").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody514").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody515").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				$("#ca_table_tbody516").find('tr').each(function(e){
					optTrTagList.push(this);
				});
				for(var i = 0; i < data.rspHead.fieldMessages.length; i++){
					var fldMsg = data.rspHead.fieldMessages[i];
					if(fldMsg.struct_name == "optList"){
						if(!fldMsg.lineno || fldMsg.lineno > optTrTagList.length || _.isEmpty(fldMsg.field_name)){
							//て-ブルの列より多くなることないはず
							continue;
						}
						$(optTrTagList[fldMsg.lineno-1]).find("input").each(function(){
							if(this.name == fldMsg.field_name){
								_this.validator.setErrorMsg($(this), clutil.getclmsg(fldMsg.message));
							}
						});
					}
				}
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			this.setReadOnlyAllItems(false);
			switch(args.status){
			case 'OK':
				// イベント追加
				this.addEvent();
				this.data2view(data);

				switch (this.options.opeTypeId) {
				//この画面に来る場合は編集or削除のみ
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					this.setReadOnlyAllItems(true);
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					this.setReadOnlyAllItems(true);
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:		// 新規

					;
					break;
				default:
					clutil.viewReadonly(this.$(".ca_unitID_div"));
				clutil.viewReadonly(this.$(".ca_poTypeID_div"));
				clutil.inputReadonly($("#ca_code"));
				clutil.setFocus($('#ca_name'));
//				clutil.viewReadonly($("#ca_base_form"));
				break;
				}

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.data2view(data);
				this.setReadOnlyAllItems(true);
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				this.data2view(data);
				this.setReadOnlyAllItems(true);
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.data2view(data);
				this.setReadOnlyAllItems(true);
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
//				this._tableDisable();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示


				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				break;
			}
		},
		//全体入力制御
		setReadOnlyAllItems: function(readOnly){
			if (readOnly == true){
				clutil.viewReadonly($("#ca_base_form"));
				this.setReadOnlyTable(this.$("#ca_table101"), true);
				this.setReadOnlyTable(this.$("#ca_table102"), true);
				this.setReadOnlyTable(this.$("#ca_table103"), true);
				this.setReadOnlyTable(this.$("#ca_table104"), true);
				this.setReadOnlyTable(this.$("#ca_table105"), true);
				this.setReadOnlyTable(this.$("#ca_table106"), true);
				this.setReadOnlyTable(this.$("#ca_table107"), true);
				this.setReadOnlyTable(this.$("#ca_table108"), true);
				this.setReadOnlyTable(this.$("#ca_table201"), true);
				this.setReadOnlyTable(this.$("#ca_table202"), true);
				this.setReadOnlyTable(this.$("#ca_table203"), true);
				this.setReadOnlyTable(this.$("#ca_table204"), true);
				this.setReadOnlyTable(this.$("#ca_table205"), true);
				this.setReadOnlyTable(this.$("#ca_table301"), true);
				this.setReadOnlyTable(this.$("#ca_table302"), true);
				this.setReadOnlyTable(this.$("#ca_table401"), true);
				this.setReadOnlyTable(this.$("#ca_table402"), true);
				this.setReadOnlyTable(this.$("#ca_table403"), true);
				this.setReadOnlyTable(this.$("#ca_table501"), true);
				this.setReadOnlyTable(this.$("#ca_table502"), true);
				this.setReadOnlyTable(this.$("#ca_table503"), true);
				this.setReadOnlyTable(this.$("#ca_table504"), true);
				this.setReadOnlyTable(this.$("#ca_table505"), true);
				this.setReadOnlyTable(this.$("#ca_table506"), true);
				this.setReadOnlyTable(this.$("#ca_table507"), true);
				this.setReadOnlyTable(this.$("#ca_table508"), true);
				this.setReadOnlyTable(this.$("#ca_table509"), true);
				this.setReadOnlyTable(this.$("#ca_table510"), true);
				this.setReadOnlyTable(this.$("#ca_table511"), true);
				this.setReadOnlyTable(this.$("#ca_table512"), true);
				this.setReadOnlyTable(this.$("#ca_table513"), true);
				this.setReadOnlyTable(this.$("#ca_table514"), true);
				this.setReadOnlyTable(this.$("#ca_table515"), true);
				this.setReadOnlyTable(this.$("#ca_table516"), true);
			}else{
				clutil.viewRemoveReadonly($("#ca_base_form"));
				this.setReadOnlyTable(this.$("#ca_table101"), false);
				this.setReadOnlyTable(this.$("#ca_table102"), false);
				this.setReadOnlyTable(this.$("#ca_table103"), false);
				this.setReadOnlyTable(this.$("#ca_table104"), false);
				this.setReadOnlyTable(this.$("#ca_table105"), false);
				this.setReadOnlyTable(this.$("#ca_table106"), false);
				this.setReadOnlyTable(this.$("#ca_table107"), false);
				this.setReadOnlyTable(this.$("#ca_table108"), false);
				this.setReadOnlyTable(this.$("#ca_table201"), false);
				this.setReadOnlyTable(this.$("#ca_table202"), false);
				this.setReadOnlyTable(this.$("#ca_table203"), false);
				this.setReadOnlyTable(this.$("#ca_table204"), false);
				this.setReadOnlyTable(this.$("#ca_table205"), false);
				this.setReadOnlyTable(this.$("#ca_table301"), false);
				this.setReadOnlyTable(this.$("#ca_table302"), false);
				this.setReadOnlyTable(this.$("#ca_table401"), false);
				this.setReadOnlyTable(this.$("#ca_table402"), false);
				this.setReadOnlyTable(this.$("#ca_table403"), false);
				this.setReadOnlyTable(this.$("#ca_table501"), false);
				this.setReadOnlyTable(this.$("#ca_table502"), false);
				this.setReadOnlyTable(this.$("#ca_table503"), false);
				this.setReadOnlyTable(this.$("#ca_table504"), false);
				this.setReadOnlyTable(this.$("#ca_table505"), false);
				this.setReadOnlyTable(this.$("#ca_table506"), false);
				this.setReadOnlyTable(this.$("#ca_table507"), false);
				this.setReadOnlyTable(this.$("#ca_table508"), false);
				this.setReadOnlyTable(this.$("#ca_table509"), false);
				this.setReadOnlyTable(this.$("#ca_table510"), false);
				this.setReadOnlyTable(this.$("#ca_table511"), false);
				this.setReadOnlyTable(this.$("#ca_table512"), false);
				this.setReadOnlyTable(this.$("#ca_table513"), false);
				this.setReadOnlyTable(this.$("#ca_table514"), false);
				this.setReadOnlyTable(this.$("#ca_table515"), false);
				this.setReadOnlyTable(this.$("#ca_table516"), false);

			}
			clutil.viewReadonly(this.$(".ca_toDate_div"));
		},
		//テーブル入力制御
		setReadOnlyTable: function($table, readOnly){
			if (readOnly == true){
				clutil.viewReadonly($table.find('td.ca_costTypeID_div'));
				$table.find('input[type="text"]').attr("readonly", true);
				$table.find('tbody span.btn-delete').hide();
				$table.find('tbody span.btn-add').hide();
				$table.find('tfoot').hide();
			}else{
				clutil.viewRemoveReadonly($table.find('td.ca_costTypeID_div'));
				$table.find('input[type="text"]').removeAttr("readonly");
				$table.find('tbody span.btn-delete').show();
				$table.find('tbody span.btn-add').show();
				$table.find('tfoot').show();
			}
		},

		/**
		 * dataを表示
		 * PO種別により表示パネルを選択しそれぞれの区分ごとにデータを分けて表示
		 * PO種別
		 * メンズ：ca_table_form1,ca_table1,ca_table2,ca_table3
		 * レディース：ca_table_form2,ca_table4,ca_table5,ca_table6,ca_table7
		 * シャツ：ca_table_form3,ca_table8,
		 *
		 */
		data2view : function(data){
			var _this = this;

			this.saveData	= data.AMPOV0211GetRsp;
			var optGrp		= data.AMPOV0211GetRsp.optGrp;
			var optList		= data.AMPOV0211GetRsp.optList;

			//返却パケットのoptListを以下の配列に分配する。
			var optList_101				= new Array;	//101
			var optList_102				= new Array;	//102
			var optList_103				= new Array;	//103
			var optList_104				= new Array;	//104
			var optList_105				= new Array;	//105
			var optList_106				= new Array;	//106
			var optList_107				= new Array;	//107
			var optList_108				= new Array;	//108
			var optList_201				= new Array;	//201
			var optList_202				= new Array;	//202
			var optList_203				= new Array;	//203
			var optList_204				= new Array;	//204
			var optList_205				= new Array;	//205
			var optList_301				= new Array;	//301
			var optList_302				= new Array;	//302
			var optList_401				= new Array;	//401
			var optList_402				= new Array;	//402
			var optList_403				= new Array;	//403
			var optList_501				= new Array;	//501
			var optList_502				= new Array;	//502
			var optList_503				= new Array;	//503
			var optList_504				= new Array;	//504
			var optList_505				= new Array;	//505
			var optList_506				= new Array;	//506
			var optList_507				= new Array;	//507
			var optList_508				= new Array;	//508
			var optList_509				= new Array;	//509
			var optList_510				= new Array;	//510
			var optList_511				= new Array;	//511
			var optList_512				= new Array;	//512
			var optList_513				= new Array;	//513
			var optList_514				= new Array;	//514
			var optList_515				= new Array;	//515
			var optList_516				= new Array;	//516

			//1レコードごと確認しそれぞれのテーブルに分割する
			$.each(optList, function() {
				switch(this.poOptTypeID){
				case amcm_type.AMCM_TYPE_FOUR_ARM_BUTTON_TYPE:
					// 袖ボタン４つ区分
					optList_101.push(this);
					break;
				case amcm_type.AMCM_TYPE_SUMMAR_SPEC_TYPE:
					//サマー仕様
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						optList_102.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
						optList_201.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
						;
					}
					break;
				case amcm_type.AMCM_TYPE_CHANGE_POCKET_TYPE:
					//チェンジポケット区分
					optList_103.push(this);
					break;
				case amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE:
					//ボタン変更区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						optList_104.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
						optList_202.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
						optList_403.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						optList_106.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT){
						optList_202.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS){
						optList_302.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						optList_402.push(this);
					}else{
					}
					break;
				case amcm_type.AMCM_TYPE_REAL_BUTTON_HOLE_TYPE:
					// 本切羽区分
					optList_105.push(this);
					break;
				case amcm_type.AMCM_TYPE_AMF_TYPE:
					// AMF区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						optList_106.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
						;
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
						optList_401.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						optList_101.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT){
						;
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS){
						;
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						;
					}else{
					}
					break;
				case amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE:
					// 裏地変更区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						optList_107.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
						;
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
						optList_402.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						optList_107.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT){
						;
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS){
						;
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						optList_403.push(this);
					}else{
					}
					break;
				case amcm_type.AMCM_TYPE_ODAIBA_TYPE:
					// お台場区分
					optList_108.push(this);
					break;
				case amcm_type.AMCM_TYPE_ADJUSTER_TYPE:
					// アジャスター区分
					optList_203.push(this);
					break;
				case amcm_type.AMCM_TYPE_FREE_BREAST_POCKET:
					// 無料胸ポケット区分
					optList_102.push(this);
					break;
				case amcm_type.AMCM_TYPE_ARM_DESIGN_TYPE:
					// 袖デザイン区分
					optList_103.push(this);
					break;
				case amcm_type.AMCM_TYPE_INNER_POCKET_TYPE:
					// 内ポケット区分
					optList_104.push(this);
					break;
				case amcm_type.AMCM_TYPE_CENTER_VENT_TYPE:
					// センターベント区分
					optList_105.push(this);
					break;
				case amcm_type.AMCM_TYPE_PIN_BUCKLE_TYPE:
					// 尾錠区分
					optList_401.push(this);
					break;
				case amcm_type.COLLAR_OPTION_TYPE:
					// 衿型区分
					optList_501.push(this);
					break;
//					case amcm_type.:
//					// 前立区分
//					optList_502.push(this);
//					break;
				case amcm_type.AMCM_TYPE_POCKET_TYPE:
					// ポケット区分
					optList_503.push(this);
					break;
				case amcm_type.AMCM_TYPE_ARM_TYPE:
					// 袖区分
					optList_504.push(this);
					break;
//					case amcm_type.:
//					// 縫製区分
//					optList_505.push(this);
//					break;
//					case amcm_type.:
//					// 仕上り寸法区分
//					optList_506.push(this);
//					break;
				case amcm_type.AMCM_TYPE_FRONTBODY_TYPE:
					// 身頃区分
					optList_507.push(this);
					break;
				case amcm_type.AMCM_TYPE_BUTTON_TYPE:
					// ボタン区分
					optList_508.push(this);
					break;
				case amcm_type.AMCM_TYPE_INITIAL_OPTION_TYPE:
					// イニシャルオプション区分
					optList_509.push(this);
					break;
				case amcm_type.AMCM_TYPE_CLERIC_TYPE:
					// クレリック区分
					optList_510.push(this);
					break;
//					case amcm_type.:
//					// 衿芯加工区分
//					optList_511.push(this);
//					break;
				case amcm_type.AMCM_TYPE_BACKBODY_TYPE:
					// 後身頃区分
					optList_512.push(this);
					break;
				case amcm_type.AMCM_TYPE_BUTTON_HOLE_OPTION_TYPE:
					// ボタンホールオプション区分
					optList_513.push(this);
					break;
				case amcm_type.AMCM_TYPE_BUTTON_SUTURE_TYPE:
					// ボタン付糸オプション区分
					optList_514.push(this);
					break;
//					case amcm_type.:
//					// ハンドステッチオプション区分
//					optList_515.push(this);
//					break;
//					case amcm_type.:
//					// 補正オプション区分
//					optList_516.push(this);
//					break;

				default:
					break;
//				以下の区部の判定方法は不明である
//				スペア用アジャスター
//				スペアスラックス品番
//				スペアスカート品番
//				スペアパンツ品番
//				前立
//				縫製
//				仕上り寸法
//				衿芯加工
//				ハンドステッチオプション
//				補正オプション

				}
			});
			//ヘッダ部分
			clutil.data2view(this.$('#ca_base_form'), optGrp);

			//PO種別ごとに表示テーブル変更
			this._setData2OptCostIDTable(this.$("#ca_table101"), optList_101);
			this._setData2OptCostIDTable(this.$("#ca_table102"), optList_102);
			this._setData2OptCostIDTable(this.$("#ca_table103"), optList_103);
			this._setData2OptCostIDTable(this.$("#ca_table104"), optList_104);
			this._setData2OptCostIDTable(this.$("#ca_table105"), optList_105);
			this._setData2OptCostIDTable(this.$("#ca_table106"), optList_106);
			this._setData2OptCostIDTable(this.$("#ca_table107"), optList_107);
			this._setData2OptCostIDTable(this.$("#ca_table108"), optList_108);
			this._setData2OptCostIDTable(this.$("#ca_table201"), optList_201);
			this._setData2OptCostIDTable(this.$("#ca_table202"), optList_202);
			this._setData2OptCostIDTable(this.$("#ca_table203"), optList_203);
			this._setData2OptCostIDTable(this.$("#ca_table204"), optList_204);
			this._setData2OptCostIDTable(this.$("#ca_table205"), optList_205);
			this._setData2OptCostIDTable(this.$("#ca_table301"), optList_301);
			this._setData2OptCostIDTable(this.$("#ca_table302"), optList_302);
			this._setData2OptCostIDTable(this.$("#ca_table401"), optList_401);
			this._setData2OptCostIDTable(this.$("#ca_table402"), optList_402);
			this._setData2OptCostIDTable(this.$("#ca_table403"), optList_403);

			this._setData2OptCostTable(this.$("#ca_table501"), optList_501);
			this._setData2OptCostTable(this.$("#ca_table502"), optList_502);
			this._setData2OptCostTable(this.$("#ca_table503"), optList_503);
			this._setData2OptCostTable(this.$("#ca_table504"), optList_504);
			this._setData2OptCostTable(this.$("#ca_table505"), optList_505);
			this._setData2OptCostTable(this.$("#ca_table506"), optList_506);
			this._setData2OptCostTable(this.$("#ca_table507"), optList_507);
			this._setData2OptCostTable(this.$("#ca_table508"), optList_508);
			this._setData2OptCostTable(this.$("#ca_table509"), optList_509);
			this._setData2OptCostTable(this.$("#ca_table510"), optList_510);
			this._setData2OptCostTable(this.$("#ca_table511"), optList_511);
			this._setData2OptCostTable(this.$("#ca_table512"), optList_512);
			this._setData2OptCostTable(this.$("#ca_table513"), optList_513);
			this._setData2OptCostTable(this.$("#ca_table514"), optList_514);
			this._setData2OptCostTable(this.$("#ca_table515"), optList_515);
			this._setData2OptCostTable(this.$("#ca_table516"), optList_516);

		},
		/**
		 * テーブルにデータを表示
		 */
		_setData2OptCostIDTable:function($table, data){
			var $tbody = $table.find("tbody");
			// 行削除
			$tbody.empty();
			$.each(data, function() {
				var tr = _.template($("#ca_tbody_template1").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);
				var $tr = $tbody.find('tr:last');	// 追加した行
				var $comment = $tr.find('input[name="comment"]');
				$comment.val(this.comment);
				var $optHinban = $tr.find('input[name="optHinban"]');
				$optHinban.val(this.optHinban);
				var $poOptTypeID = $tr.find('input[name="poOptTypeID"]');
				$poOptTypeID.val(this.poOptTypeID);
				var $selectCostTypeID = $tr.find('select[name="costTypeID"]');
				clutil.cltypeselector(
						$selectCostTypeID,
						amcm_type.AMCM_TYPE_COST_TYPE
				).done(_.bind(function(){
					$selectCostTypeID.selectpicker('val', this.costTypeID);
				},this));
				/*
				 * 行削除
				 */
				$tbody.find("tr:last span.btn-delete").click(function(e) {
					var $tgt_tr = $(this).parent().parent();
					$tgt_tr.remove();
				});
			});
			clutil.initUIelement(this.$el);
			this._reNum($tbody);
		},
		_setData2OptCostTable:function($table, data){
			var $tbody = $table.find("tbody");
			// 行削除
			$tbody.empty();
			$.each(data, function() {
				var tr = _.template($("#ca_tbody_template2").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);
				var $tr = $tbody.find('tr:last');	// 追加した行
				var $comment = $tr.find('input[name="comment"]');
				$comment.val(this.comment);
				var $optHinban = $tr.find('input[name="optHinban"]');
				$optHinban.val(this.optHinban);
				var $poOptTypeID = $tr.find('input[name="poOptTypeID"]');
				$poOptTypeID.val(this.poOptTypeID);
				var $cost = $tr.find('input[name="cost"]');
				$cost.val(clutil.comma(this.cost));

			});
			clutil.initUIelement(this.$el);
			this._reNum($tbody);
		},
		/**
		 * テーブルクリア
		 */
		clearTable : function() {
			$("#ca_table_tbody101 tr").remove();
			$("#ca_table_tbody102 tr").remove();
			$("#ca_table_tbody103 tr").remove();
			$("#ca_table_tbody104 tr").remove();
			$("#ca_table_tbody105 tr").remove();
			$("#ca_table_tbody106 tr").remove();
			$("#ca_table_tbody107 tr").remove();
			$("#ca_table_tbody108 tr").remove();
			$("#ca_table_tbody201 tr").remove();
			$("#ca_table_tbody202 tr").remove();
			$("#ca_table_tbody203 tr").remove();
			$("#ca_table_tbody204 tr").remove();
			$("#ca_table_tbody205 tr").remove();
			$("#ca_table_tbody301 tr").remove();
			$("#ca_table_tbody302 tr").remove();
			$("#ca_table_tbody401 tr").remove();
			$("#ca_table_tbody402 tr").remove();
			$("#ca_table_tbody403 tr").remove();
			//フィールド5のテーブルは行が固定されているので中身(品番・料金)のみ削除する
			//
			this.clearCostTable(this.$("#ca_table501"));
			this.clearCostTable(this.$("#ca_table502"));
			this.clearCostTable(this.$("#ca_table503"));
			this.clearCostTable(this.$("#ca_table504"));
			this.clearCostTable(this.$("#ca_table505"));
			this.clearCostTable(this.$("#ca_table506"));
			this.clearCostTable(this.$("#ca_table507"));
			this.clearCostTable(this.$("#ca_table508"));
			this.clearCostTable(this.$("#ca_table509"));
			this.clearCostTable(this.$("#ca_table510"));
			this.clearCostTable(this.$("#ca_table511"));
			this.clearCostTable(this.$("#ca_table512"));
			this.clearCostTable(this.$("#ca_table513"));
			this.clearCostTable(this.$("#ca_table514"));
			this.clearCostTable(this.$("#ca_table515"));
			this.clearCostTable(this.$("#ca_table516"));


		},
		clearCostTable: function($table) {
			var $tbody = $table.find("tbody");
			$tbody.find('tr').each(function(e){
				var $comment	= $(this).find('input[name="comment"]');
				var $optHinban	= $(this).find('input[name="optHinban"]');
				var $poOptTypeID	= $(this).find('input[name="poOptTypeID"]');
				var $cost 		= $(this).find('input[name="cost"]');

				//$comment.val("");		// コメントは変更しない
				$optHinban.val("");
				$poOptTypeID.val("");
				$cost.val("");
			});
			this._reNum($tbody);
			clutil.initUIelement(this.$el);
		},
		/**
		 * 新規作成時にデフォルト空欄表示(1行)
		 */
		makeDefaultTable: function(){
			this.addEvent();
			this.clearTable();
			var $tbody = this.$("#ca_table_tbody101"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody102"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody103"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody104"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody105"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody106"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody107"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody108"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody201"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody202"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody203"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody204"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody205"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody301"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody302"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody401"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody402"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody403"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody501"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody502"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody503"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody504"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody505"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody506"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody507"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody508"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody509"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody510"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody511"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody512"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody513"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody514"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody515"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody516"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			clutil.initUIelement(this.$el);
			return this;
		},
		/**
		 * 行追加処理(tfoot)
		 */
		addRow: function($table) {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tbody = $table.find("tbody");
			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
			var tr = _.template($("#ca_tbody_template1").html(), addObj);
			$tbody.append(tr);
			var $tr = $tbody.find('tr:last');	// 追加した行
			var $comment = $tr.find('input[name="comment"]');
			var $optHinban = $tr.find('input[name="optHinban"]');
			var $poOptTypeID = $tr.find('input[name="poOptTypeID"]');
			var $selectCostTypeID = $tr.find('select[name="costTypeID"]');

			$comment.val("");
			$optHinban.val("");
			$poOptTypeID.val(0);
			clutil.cltypeselector(
					$selectCostTypeID,
					amcm_type.AMCM_TYPE_COST_TYPE
			);
			/*
			 * 行削除
			 */
			$tbody.find("tr:last span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			this._reNum($tbody);
			clutil.initUIelement(this.$el);
		},
		/**
		 * 階層レベル振り直し
		 */
		_reNum : function($tbody){
			var $input = $tbody.find('input[name="seq"]');
			$input.each(function(i){
				$(this).val(i + 1);
			});
			return this;
		},
		/**
		 * 行削除処理
		 */
		addEvent: function() {
			/*
			 * 行削除
			 */
			$("#ca_table_tbody101 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody102 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody103 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody104 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody105 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody106 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody107 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody108 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody201 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody202 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody203 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody204 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody205 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody301 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody302 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody401 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody402 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody403 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			this.validator.clear();

			//予約取消はないので基本全部こちらに来る
			// validation
			var noOptDataflag = true;

			var isBasic = this.$('input[name="ca_basicFlag"]:checked').val() == 1;
			var ope_date = clcom.getOpeDate();
			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				break;
			default:
				break;
			}
			var f_error0 = !this.validator.valid();
			var f_error = false;

			var optGrp = clutil.view2data(this.$('#ca_base_form'));

			//帰ってきたエラーの際どの行がエラーか判断するためにテーブルを上から順に並べる
			//下手にソートを入れると正しい箇所にエラーが出るので注意
			var optList_Table101	= clutil.tableview2data(this.$('#ca_table_tbody101').children("tr"));	//テーブル101
			var optList_Table102	= clutil.tableview2data(this.$('#ca_table_tbody102').children("tr"));	//テーブル102
			var optList_Table103	= clutil.tableview2data(this.$('#ca_table_tbody103').children("tr"));	//テーブル103
			var optList_Table104	= clutil.tableview2data(this.$('#ca_table_tbody104').children("tr"));	//テーブル104
			var optList_Table105	= clutil.tableview2data(this.$('#ca_table_tbody105').children("tr"));	//テーブル105
			var optList_Table106	= clutil.tableview2data(this.$('#ca_table_tbody106').children("tr"));	//テーブル106
			var optList_Table107	= clutil.tableview2data(this.$('#ca_table_tbody107').children("tr"));	//テーブル107
			var optList_Table108	= clutil.tableview2data(this.$('#ca_table_tbody108').children("tr"));	//テーブル108
			var optList_Table201	= clutil.tableview2data(this.$('#ca_table_tbody201').children("tr"));	//テーブル201
			var optList_Table202	= clutil.tableview2data(this.$('#ca_table_tbody202').children("tr"));	//テーブル202
			var optList_Table203	= clutil.tableview2data(this.$('#ca_table_tbody203').children("tr"));	//テーブル203
			var optList_Table204	= clutil.tableview2data(this.$('#ca_table_tbody204').children("tr"));	//テーブル204
			var optList_Table205	= clutil.tableview2data(this.$('#ca_table_tbody205').children("tr"));	//テーブル205
			var optList_Table301	= clutil.tableview2data(this.$('#ca_table_tbody301').children("tr"));	//テーブル301
			var optList_Table302	= clutil.tableview2data(this.$('#ca_table_tbody302').children("tr"));	//テーブル302
			var optList_Table401	= clutil.tableview2data(this.$('#ca_table_tbody401').children("tr"));	//テーブル401
			var optList_Table402	= clutil.tableview2data(this.$('#ca_table_tbody402').children("tr"));	//テーブル402
			var optList_Table403	= clutil.tableview2data(this.$('#ca_table_tbody403').children("tr"));	//テーブル403
			var optList_Table501	= clutil.tableview2data(this.$('#ca_table_tbody501').children("tr"));	//テーブル501
			var optList_Table502	= clutil.tableview2data(this.$('#ca_table_tbody502').children("tr"));	//テーブル502
			var optList_Table503	= clutil.tableview2data(this.$('#ca_table_tbody503').children("tr"));	//テーブル503
			var optList_Table504	= clutil.tableview2data(this.$('#ca_table_tbody504').children("tr"));	//テーブル504
			var optList_Table505	= clutil.tableview2data(this.$('#ca_table_tbody505').children("tr"));	//テーブル505
			var optList_Table506	= clutil.tableview2data(this.$('#ca_table_tbody506').children("tr"));	//テーブル506
			var optList_Table507	= clutil.tableview2data(this.$('#ca_table_tbody507').children("tr"));	//テーブル507
			var optList_Table508	= clutil.tableview2data(this.$('#ca_table_tbody508').children("tr"));	//テーブル508
			var optList_Table509	= clutil.tableview2data(this.$('#ca_table_tbody509').children("tr"));	//テーブル509
			var optList_Table510	= clutil.tableview2data(this.$('#ca_table_tbody510').children("tr"));	//テーブル510
			var optList_Table511	= clutil.tableview2data(this.$('#ca_table_tbody511').children("tr"));	//テーブル511
			var optList_Table512	= clutil.tableview2data(this.$('#ca_table_tbody512').children("tr"));	//テーブル512
			var optList_Table513	= clutil.tableview2data(this.$('#ca_table_tbody513').children("tr"));	//テーブル513
			var optList_Table514	= clutil.tableview2data(this.$('#ca_table_tbody514').children("tr"));	//テーブル514
			var optList_Table515	= clutil.tableview2data(this.$('#ca_table_tbody515').children("tr"));	//テーブル515
			var optList_Table516	= clutil.tableview2data(this.$('#ca_table_tbody516').children("tr"));	//テーブル516

			var optList = new Array;	//メンズレディース
			var optList2 = new Array;	//シャツ

			var $POTypeID = this.$("#ca_poTypeID");
			//注意styleOptTypeIDが不明なのはあとで設定一応マイナスを入れておく
			if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				//メンズ
				this._tdata2packet(optList, optList_Table101,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_FOUR_ARM_BUTTON_TYPE);
				this._tdata2packet(optList, optList_Table102,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_SUMMAR_SPEC_TYPE);
				this._tdata2packet(optList, optList_Table103,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_CHANGE_POCKET_TYPE);
				this._tdata2packet(optList, optList_Table104,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);
				this._tdata2packet(optList, optList_Table105,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_REAL_BUTTON_HOLE_TYPE);
				this._tdata2packet(optList, optList_Table106,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_AMF_TYPE);
				this._tdata2packet(optList, optList_Table107,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE);
				this._tdata2packet(optList, optList_Table108,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_ODAIBA_TYPE);
				this._tdata2packet(optList, optList_Table201,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS, amcm_type.AMCM_TYPE_SUMMAR_SPEC_TYPE);
				this._tdata2packet(optList, optList_Table202,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);
				this._tdata2packet(optList, optList_Table203,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS, amcm_type.AMCM_TYPE_ADJUSTER_TYPE);
				this._tdata2packet(optList, optList_Table204,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS, -1);
				this._tdata2packet(optList, optList_Table205,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS, -2);
				this._tdata2packet(optList, optList_Table401,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST, amcm_type.AMCM_TYPE_AMF_TYPE);
				this._tdata2packet(optList, optList_Table402,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST, amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE);
				this._tdata2packet(optList, optList_Table403,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);
			}else if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				// レディス
				this._tdata2packet(optList, optList_Table101,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_AMF_TYPE);
				this._tdata2packet(optList, optList_Table102,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_FREE_BREAST_POCKET);
				this._tdata2packet(optList, optList_Table103,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_ARM_DESIGN_TYPE);
				this._tdata2packet(optList, optList_Table104,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_INNER_POCKET_TYPE);
				this._tdata2packet(optList, optList_Table105,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_CENTER_VENT_TYPE);
				this._tdata2packet(optList, optList_Table106,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);
				this._tdata2packet(optList, optList_Table107,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE);
				this._tdata2packet(optList, optList_Table201,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT, -3);
				this._tdata2packet(optList, optList_Table202,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);
				this._tdata2packet(optList, optList_Table301,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS, -4);
				this._tdata2packet(optList, optList_Table302,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);
				this._tdata2packet(optList, optList_Table401,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST, amcm_type.AMCM_TYPE_PIN_BUCKLE_TYPE);
				this._tdata2packet(optList, optList_Table402,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);
				this._tdata2packet(optList, optList_Table403,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST, amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE);
			}else if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				// シャツ
				this._tdata2packet2(optList2, optList_Table501,	0, amcm_type.COLLAR_OPTION_TYPE);
				this._tdata2packet2(optList2, optList_Table502,	0, -5);
				this._tdata2packet2(optList2, optList_Table503,	0, amcm_type.AMCM_TYPE_POCKET_TYPE);
				this._tdata2packet2(optList2, optList_Table504,	0, amcm_type.AMCM_TYPE_ARM_TYPE);
				this._tdata2packet2(optList2, optList_Table505,	0, -6);
				this._tdata2packet2(optList2, optList_Table506,	0, -7);
				this._tdata2packet2(optList2, optList_Table507,	0, amcm_type.AMCM_TYPE_FRONTBODY_TYPE);
				this._tdata2packet2(optList2, optList_Table508,	0, amcm_type.AMCM_TYPE_BUTTON_TYPE);
				this._tdata2packet2(optList2, optList_Table509,	0, amcm_type.AMCM_TYPE_INITIAL_OPTION_TYPE);
				this._tdata2packet2(optList2, optList_Table510,	0, amcm_type.AMCM_TYPE_CLERIC_TYPE);
				this._tdata2packet2(optList2, optList_Table511,	0, -8);
				this._tdata2packet2(optList2, optList_Table512,	0, amcm_type.AMCM_TYPE_BACKBODY_TYPE);
				this._tdata2packet2(optList2, optList_Table513,	0, amcm_type.AMCM_TYPE_BUTTON_HOLE_OPTION_TYPE);
				this._tdata2packet2(optList2, optList_Table514,	0, amcm_type.AMCM_TYPE_BUTTON_SUTURE_TYPE);
				this._tdata2packet2(optList2, optList_Table515,	0, -9);
				this._tdata2packet2(optList2, optList_Table516,	0, -10);

			}else{
				;
			}

			//optListの重複ちぇく
			chkMap = new Object();
			if ($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				for(var i = 0; i < optList2.length; i++){
					var opt =  optLis2t[i];
					if (opt.optHinban == null || _.isEmpty(opt.optHinban.trim())){
						noOptDataflag = false;
						//空白の場合は除く
						continue;
					}
					if(chkMap[opt.optHinban]){
						//どこのテーブルかわからないが重複あり
						chkMap[opt.optHinban] += 1;
					}else{
						chkMap[opt.optHinban] = 1;
						noOptDataflag = false;
					}
				}
			}else{
				for(var i = 0; i < optList.length; i++){
					var opt =  optList[i];
					if (opt.optHinban == null || _.isEmpty(opt.optHinban.trim())){
						noOptDataflag = false;
						//空白の場合は除く
						continue;
					}
					if(chkMap[opt.optHinban]){
						//どこのテーブルかわからないが重複あり
						chkMap[opt.optHinban] += 1;
					}else{
						chkMap[opt.optHinban] = 1;
						noOptDataflag = false;
					}
				}
			}

			if(noOptDataflag){
				f_error = true;
			}
			//テーブルまわりのの入力チェック
			//空白、重複チェック
			if ($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				if(this._OptTableCheck2(this.$("#ca_table501"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table502"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table503"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table504"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table505"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table506"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table507"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table508"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table509"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table510"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table511"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table512"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table513"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table514"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table515"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck2(this.$("#ca_table516"), chkMap) < 0){
					f_error = true;
				}
			}else{
				if(this._OptTableCheck(this.$("#ca_table101"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table102"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table103"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table104"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table105"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table106"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table107"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table108"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table201"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table202"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table203"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table204"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table205"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table301"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table302"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table401"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table402"), chkMap) < 0){
					f_error = true;
				}
				if(this._OptTableCheck(this.$("#ca_table403"), chkMap) < 0){
					f_error = true;
				}
			}


			try{
				this.mdBaseView.setAutoValidate(false);
				if(f_error0){
					// valid() -- NG
					clutil.setFocus(this.$el.find('.cl_error_field').first());
					return null;
				}
				if(f_error){
					// 独自チェック -- NG
					if(noOptDataflag){
						clutil.mediator.trigger('onTicker',clmsg.EPO0013);
					}else{
						clutil.mediator.trigger('onTicker',clmsg.cl_echoback);
						clutil.setFocus(this.$el.find('.cl_error_field').first());
					}
					return null;
				}
			}finally{
				this.mdBaseView.setAutoValidate(true);
			}

			// listへhead情報の適応
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){

			}
			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			var updReq = {
					optGrp  : optGrp,
					optList  : optList,
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}
			var reqObj = {
					reqHead : reqHead,
					AMPOV0211UpdReq  : updReq
			};
//			return;
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},
		//スタイルのテーブルは複数あるが同一パケットのため、まとめるための関数
		//packetgList パケットの配列
		//tdata それぞれのテーブルをtableview2data処理したデータ。
		//type1	ジャケット・スラックス・ベスト等
		//type2 袖ボタン４つ区分等
		_tdata2packet: function(packetgList, tdata, type1,type2){
			$.each(tdata, function(i){
				var obj = {
						styleOptTypeID	: type1,
						poOptTypeID	: type2,
						comment		: this.comment,
						optHinban	: this.optHinban,
						costTypeID	: this.costTypeID,
						cost		: 0,
						seq			: this.seq,
				};
				packetgList.push(obj);
			});
		},
		_tdata2packet2: function(packetgList, tdata, type1,type2){
			$.each(tdata, function(i){
				var obj = {
						styleOptTypeID	: type1,
						poOptTypeID	: type2,
						comment		: this.comment,
						optHinban	: this.optHinban,
						costTypeID	: 0,
						cost		: this.cost,
						seq			: this.seq,
				};
				packetgList.push(obj);
			});
		},
		//メンズレディース用
		_OptTableCheck: function($table, chkMap){
			var f_error = 0;
			var _this = this;
			var $tbody = $table.find("tbody");
			$tbody.find('tr').each(function(e){
				var $comment	= $(this).find('input[name="comment"]');
				var $optHinban	= $(this).find('input[name="optHinban"]');
				var $costTypeID		= $(this).find('select[name="costTypeID"]');
				_this.validator.clearErrorMsg($comment);
				_this.validator.clearErrorMsg($optHinban);
				_this.validator.clearErrorMsg($costTypeID);
				if($optHinban.val() == null ||  _.isEmpty($optHinban.val().trim())){
					// 品番が空白
					_this.validator.setErrorMsg($optHinban, clutil.fmtargs(clmsg.cl_its_required, ["オプション品番"]));
					f_error = -1;
				}else{
					if(chkMap[$optHinban.val()] > 1){
						// chkMapには全リスト情報が入っているので2以上の場合重複とみなせる。1は自分自身なのでスルー
						_this.validator.setErrorMsg($optHinban, clutil.fmtargs(clmsg.EMS0065, [$optHinban.val()]));
						f_error = -1;
					}
					if($comment.val() == null ||  _.isEmpty($comment.val().trim())){
						_this.validator.setErrorMsg($comment, clmsg.EPO0006);
						f_error = -1;
					}
					if($costTypeID.val() == null ||  $costTypeID.val() == 0){
						_this.validator.setErrorMsg($costTypeID, clmsg.EPO0007);
						f_error = -1;
					}
				}
			});
			return f_error;

		},
		//シャツ用
		_OptTableCheck: function($table, chkMap){
			var f_error = 0;
			var _this = this;
			var $tbody = $table.find("tbody");
			$tbody.find('tr').each(function(e){
				var $comment	= $(this).find('input[name="comment"]');
				var $optHinban	= $(this).find('input[name="optHinban"]');
				var $cost		= $(this).find('input[name="cost"]');
				_this.validator.clearErrorMsg($comment);
				_this.validator.clearErrorMsg($optHinban);
				_this.validator.clearErrorMsg($cost);
				if($optHinban.val() == null ||  _.isEmpty($optHinban.val().trim())){
					// 品番が空白は…
					if($cost.val() == null ||  _.isEmpty($cost.val().trim())){
						//コストも空白はセーフ
						;
					}else{
						//コスト有はエラー
						_this.validator.setErrorMsg($optHinban, clmsg.EPO0045);
						_this.validator.setErrorMsg($cost, clmsg.EPO0045);
						f_error = -1;
					}
				}else{
					if(chkMap[$optHinban.val()] > 1){
						// chkMapには全リスト情報が入っているので2以上の場合重複とみなせる。1は自分自身なのでスルー
						_this.validator.setErrorMsg($optHinban, clutil.fmtargs(clmsg.EMS0065, [$optHinban.val()]));
						f_error = -1;
					}else if($cost.val() == null ||  _.isEmpty($cost.val().trim())){
						//品番ありコストなし
						_this.validator.setErrorMsg($optHinban, clmsg.EPO0045);
						_this.validator.setErrorMsg($cost, clmsg.EPO0045);
						f_error = -1;
					}
				}
			});
			return f_error;

		},
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var getReq = {
					// 共通ヘッダ

					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					// 取引先マスタ検索リクエスト
					AMPOV0211GetReq: {
						srchDate: this.options.chkData[pgIndex].fromDate,			// 適用開始日
						srchID: this.options.chkData[pgIndex].id,			// 取引先ID
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMPOV0211UpdReq: {
					}
			};
			if(opeTypeId ==  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				getReq.reqHead.opeTypeId =  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY;
			}
			return {
				resId: clcom.pageId,	//'AMMSV0320',
				data: getReq
			};
		},

		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
//			var rec = data.AMPOV0211GetRsp;
//			delete rec.orgfunc.fromDate;
//			delete rec.orgfunc.toDate;
//			$.each(rec.orglevelList, function(){
//			delete this.fromDate;
//			delete this.toDate;
//			delete this.orglevelCode;
//			});
			return data;
		}
	});

	// 初期データを取る
	clutil.getIniJSON(null, null).done(function(data, dataType) {
		ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
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
