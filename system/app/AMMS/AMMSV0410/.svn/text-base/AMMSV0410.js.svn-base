useSelectpicker2();

$(function(){

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	clutil.enterFocusMode($('body'));
	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		validator2 : null,
		events : {
			"change #ca_unitID" : "_onUnitIDChange", // 品種項目クリア
			'change input[name="upperLimit"]' : "_onUpperLimitchange",
			"click #ca_table .btn-delete" : "_onDeleteLineClick",
			"click #ca_table tbody tr span.btn-add" : "_onAddLineBeforeClick",
			"click #ca_table tfoot tr:last" : "_onAddLineClick"
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
					title: 'プライスライン',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// *アプリ個別の View や部品をインスタンス化するとか・・・*

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
				// それ以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$("#ca_headInfoArea"), {
				echoback : $('.cl_echoback')
			});
			this.validator2 = clutil.validator(this.$("#ca_tableArea"), {
				echoback : $('.cl_echoback')
			});

			// datepicker
			clutil.datepicker(this.$("#ca_fromDate"));
			this.$("#ca_fromDate").datepicker("setIymd", clcom.getOpeDate() + 1);
			clutil.datepicker(this.$("#ca_toDate"));
			this.$("#ca_toDate").datepicker("setIymd", clcom.max_date);

			clutil.cltypeselector(this.$('#ca_pricelineTypeID'), amcm_type.AMCM_TYPE_PRICELINE);
			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_itgrpID",
				},
			});

//			clutil.clvarietycode(this.$("#ca_itgrpID"), {
//				getParentId: function() {
//					// 親ID（事業ユニットID）取得メソッドを実装する
//					return $("#ca_unitID").val();
//				}
//			});
			return this;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
//			// 事業ユニット取得
//			return clutil.clbusunitselector(this.$('#ca_unitID'));
			return this.fieldRelation;
		},

		render : function(){
			this.mdBaseView.render();
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				this.$("#ca_toDate").datepicker("setIymd", clcom.max_date);
				clutil.viewReadonly(this.$(".ca_toDate_div"));
				this.$('#ca_pricelineTypeID').val(amcm_type.AMCM_VAL_PRICELINE_MD);
				this.makeDefaultTable();
				clutil.setFocus(this.$("#ca_fromDate"));
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。

				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
					// 「適用期間」を「削除日」にする
					this.$("#ca_term").find('p.fieldName').text('削除日');
					this.$("#ca_term").find('.deldspn').hide();

					this.$(".ca_fromDate_div").before('<p id="ca_tp_del"><span>?</span></p>');

					$("#ca_tp_del").addClass("txtInFieldUnit flright help").attr("data-original-title", "削除日以降、当商品分類は無効扱いとなります").tooltip({html: true});
				}
			}
			return this;
		},

		_onUnitIDChange : function(e){
			this.$("#ca_itgrpID").val("").removeAttr("cs_id");
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				document.location = '#';
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				// 更新した日付をchkdataに反映
					this.options.chkData[args.index].fromDate = args.data.AMMSV0410GetRsp.priceLineHead.fromDate;
				}
				clutil.viewReadonly(this.$el);
				this._tableDisable();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				this._tableDisable();
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				this._tableDisable();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
//				clutil.viewReadonly(this.$("#ca_headInfoArea"));
//				this._tableDisable();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'OK':
				var getRsp = data.AMMSV0410GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				var ope_date = clcom.getOpeDate();
				 this._allData2View(getRsp);
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
					// 照会モードは、Edit ブロッキングしておく。
					clutil.viewReadonly(this.$el);
					this._tableDisable();
				} else if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					clutil.viewReadonly(this.$(".ca_upd_dis"));
					clutil.viewReadonly(this.$(".ca_toDate_div"));
					if (getRsp.priceLineHead.toDate == clcom.max_date){
						clutil.viewRemoveReadonly(this.$(".ca_fromDate_div"));
						if (getRsp.priceLineHead.fromDate <= ope_date) {
							this.$("#ca_fromDate").datepicker("setIymd", ope_date + 1);
						}
					} else {
						clutil.viewReadonly(this.$(".ca_fromDate_div"));
					}
					clutil.setFocus(this.$("#ca_fromDate"));
				} else if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					clutil.viewReadonly(this.$el);
					clutil.viewRemoveReadonly(this.$(".ca_fromDate_div"));
					if (getRsp.priceLineHead.fromDate <= ope_date) {
						this.$("#ca_fromDate").datepicker("setIymd", ope_date + 1);
					}
				}
				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
//				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.cl_sys_db_other)});
				var getRsp = data.AMMSV0410GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				clutil.viewReadonly(this.$el);
				this._tableDisable();
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMMSV0410GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				clutil.viewReadonly(this.$el);
				this._tableDisable();
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMMSV0410GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				clutil.viewReadonly(this.$el);
				this._tableDisable();
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
					// 照会モードは、Edit ブロッキングしておく。
					clutil.viewReadonly(this.$el);
					this._tableDisable();
				} else if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					clutil.viewReadonly(this.$(".ca_upd_dis"));
				}
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		/**
		 * dataを表示
		 */
		_allData2View : function(getRsp){
			var ope_date = clcom.getOpeDate();
			var isRsvcancel = this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL;
			var isDelete = this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL;
			var isRef = this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
			var tableDisable = isRsvcancel || isDelete || isRef;
			var $tbody = this.$("#ca_table_tbody");

			// 品種データの修正
			getRsp.priceLineHead._view2data_itgrpID_cn = {
							id: getRsp.priceLineHead.itgrpID,
							code: getRsp.priceLineHead.itgrpCode,
							name: getRsp.priceLineHead.itgrpName
						};

			clutil.data2view(this.$('#ca_headInfoArea'), getRsp.priceLineHead);
			// 諸事象あり、結局同じ判定に…
			var codeEditable = (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW || this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
			var editable = (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW || this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
			var canAdd = (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW || this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
			var deletable = (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW || this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
			$.each(getRsp.priceLineList, function(){
				this.code_disp = clutil.comma(this.code);
				this.lowerLimit_disp = clutil.comma(this.lowerLimit);
				this.upperLimit_disp = clutil.comma(this.upperLimit);

				this.codeEditable = codeEditable;
				this.editable = editable;
				this.canAdd = canAdd;
				this.deletable = deletable;
			});
			this.clearTable();
			this.$("#ca_tbody_template").tmpl(getRsp.priceLineList).appendTo($tbody);
			clutil.initUIelement(this.$el);

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				if (getRsp.priceLineHead.toDate == clcom.max_date){
					clutil.viewRemoveReadonly(this.$(".ca_fromDate_div"));
					if (getRsp.priceLineHead.fromDate <= ope_date) {
						this.$("#ca_fromDate").datepicker("setIymd", ope_date + 1);
					}
				} else {
					clutil.viewReadonly(this.$(".ca_fromDate_div"));
				}
			} else if (isDelete){
				// ベース部分常に編集不可
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				clutil.viewRemoveReadonly(this.$(".ca_fromDate_div"));
			} else if (isRsvcancel) {
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
			}

			if (tableDisable){
				this.$("#ca_table").find("tfoot").hide();
			} else {
				this.$("#ca_table").find("tfoot").show();
			}
//			clutil.cltxtFieldLimitReset($("#ca_orgfuncCode"));
//			clutil.cltxtFieldLimitReset($("#ca_orgfuncName"));
			// TODO:やるべきか検証
			this._reCalcLowerLimit();
			// フォーカス制御
			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				clutil.setFocus(this.$("#ca_fromDate"));
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
//				TODO:どこにおいとく？
//				clutil.setFocus($("#cl_submit"));
				break;
			default:
				break;
			}
			return this;
		},

		_tableDisable : function(){
			var $table = this.$("#ca_table");
			$table.find('input[type="text"]').attr("readonly", true);
			$table.find('input[type="checkbox"]').attr("disabled", true).closest("label").addClass("disabled");
			$table.find('tbody span.btn-delete').hide();
			$table.find('tbody span.btn-add').hide();
			$table.find('tfoot').hide();
		},

		/**
		 * テーブルクリア
		 */
		clearTable : function() {
			$("#ca_table_tbody tr").remove();
		},

		/**
		 * 新規作成時にデフォルト空欄表示
		 */
		makeDefaultTable: function(){
//			var _this = this;
			this.clearTable();
			var $tbody = this.$("#ca_table_tbody"),
			$tmpl = this.$("#ca_tbody_template"),
			defArray = new Array,
			i = 0;

			for (;i < 5;i++){
				var obj = {
						editable:true,
						canAdd:true,
						disChk:false,
						disEdit:false
				};
				defArray.push(obj);
			}
			$tmpl.tmpl(defArray).appendTo($tbody);
			clutil.initUIelement(this.$el);
			return this;
		},
		/**
		 * 新規作成時にデフォルト空欄表示
		 */
		makeDefaultTable: function(){
//			var _this = this;
			this.clearTable();
			var $tbody = this.$("#ca_table_tbody"),
			$tmpl = this.$("#ca_tbody_template"),
			defArray = new Array,
			i = 0;

			for (;i < 5;i++){
				var obj = {
						codeEditable:true,
						editable:true,
						canAdd:true,
						deletable:true
				};
				defArray.push(obj);
			}
			$tmpl.tmpl(defArray).appendTo($tbody);
			this._reCalcLowerLimit();
			clutil.initUIelement(this.$el);
			return this;
		},

		/**
		 * 行追加処理(一行上)
		 */
		_onAddLineBeforeClick : function(e) {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tr = $(e.target).closest("tr");
			var $tmpl = $("#ca_tbody_template");
			var codeEditable = (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW || this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
			var editable = (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW || this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
			var canAdd = (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW || this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
			var deletable = (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW || this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
			var addObj = {
					codeEditable:codeEditable,
					editable:editable,
					canAdd:canAdd,
					deletable:deletable
					};
			$tr.before($tmpl.tmpl(addObj));
			this._reCalcLowerLimit();
			clutil.initUIelement(this.$el);
			return this;
		},

		/**
		 * 下限金額再計算
		 */
		_reCalcLowerLimit : function(){
			var $tbody = this.$("#ca_table_tbody");
			$.each($tbody.children("tr"), function(){
				var $this = $(this);
				if($this.index($tbody) == 0){
					$this.find('input[name="lowerLimit"]').val(1);
				} else {
					var $prevUpper = $this.prev("tr").find('input[name="upperLimit"]');
					var prevUpper = $.inputlimiter.unmask($prevUpper.val(), {
						  limit: $prevUpper.attr('data-limit'),
						  filter: $prevUpper.attr('data-filter')
						});
					var val = _.isNaN(Number(prevUpper)) ? "" : clutil.comma(Number(prevUpper) + 1);
					$this.find('input[name="lowerLimit"]').val(val);
				}
			});
			return;
		},

		/**
		 * 行追加処理(tfoot)
		 */
		_onAddLineClick : function(e) {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = $("#ca_tbody_template");
			var codeEditable = (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW || this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
			var editable = (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW || this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
			var canAdd = (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW || this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
			var deletable = (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW || this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD);
			var addObj = {
					codeEditable:codeEditable,
					editable:editable,
					canAdd:canAdd,
					deletable:deletable
					};
			$tmpl.tmpl(addObj).appendTo($tbody);
			this._reCalcLowerLimit();
			clutil.initUIelement(this.$el);

			return this;
		},

		/**
		 * 行削除処理
		 */
		_onDeleteLineClick : function(e) {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
					|| this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			$(e.target).parent().parent().remove();
			this._reCalcLowerLimit();
		},

		/**
		 * テーブルの入力チェック
		 * @returns {Boolean}
		 */
		isTableValid: function() {
			var f_valid = true;

			var items = clutil.tableview2ValidData({
				$tbody: this.$("#ca_table_tbody"),
				validator: this.validator2,
				tailEmptyCheckFunc: function(item) { // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように
					if (!_.isEmpty(item.code) || !_.isEmpty(item.upperLimit)) {
						return false;
					} else {
						return true;
					}
				}
			});

			if (_.isEmpty(items)) {
		        // 全部空欄行だったとか・・・
		        clutil.mediator.trigger('onTicker',clmsg.EGM0024);
		        f_valid = false;
			}

			return f_valid;
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			var _this = this;
			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			var updReq = {};
			/*
			 * 無効化チェック
			 */
			if ($("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}
			/*
			 * 入力値チェック 予約取消時はチェックしない
			 */
			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				// validation
				var f_error = false;
				this.validator.clear();

				/*************
				 * chkstdate 日付のチェック
				 *************/
				var ope_date = clcom.getOpeDate();
				var $fromDate = this.$("#ca_fromDate");
				var fromDate = clutil.dateFormat($fromDate.val(), "yyyymmdd");
				var recfromDate = null;
				var rectoDate = null;
				if (this.options.chkData !== undefined && this.options.chkData.length > 0){
					recfromDate = this.options.chkData[pgIndex].fromDate;
					rectoDate = this.options.chkData[pgIndex].toDate;
				}
				switch(this.options.opeTypeId){
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
					if (fromDate <= ope_date){ // 開始日が明日以降でない
						this.validator.setErrorHeader(clmsg.cl_st_date_min_opedate);
						this.validator.setErrorMsg($fromDate, clmsg.cl_st_date_min_opedate);
						f_error = true;
					}
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					var compfromDate = ope_date < recfromDate ? recfromDate : ope_date;
					var msg = ope_date > recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
					if (fromDate <= compfromDate && rectoDate == clcom.max_date && fromDate != recfromDate){ // 未来予約可能で修正でない状態で開始日が明日以降でない
						this.validator.setErrorHeader(msg);
						this.validator.setErrorMsg($fromDate, msg);
						f_error = true;
					}
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					if (fromDate <= ope_date || fromDate < recfromDate){ // 設定開始日が明日以降かつ編集前開始日以降でない
						var msg = ope_date >= recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
						this.validator.setErrorHeader(msg);
						this.validator.setErrorMsg($fromDate, msg);
						f_error = true;
					}
					break;
				default:
					break;
				}
				if(f_error){ // エラーチェック毎にメッセージが決まっている⇒複数ある場合、一気に表示できていない。
					return null;
				}

				if(!this.validator.valid()) {
					f_error = true;
				}

				if(f_error){
					return null;
				}

				// 期間反転チェック
				var chkInfo = [];
				chkInfo.push({
					stval : 'ca_fromDate',
					edval : 'ca_toDate'
				});
				if(!this.validator.validFromTo(chkInfo)){
					f_error = true;
				}

				if(f_error){
					return null;
				}

				if (this.$("#ca_table_tbody").find("tr").length === 0){
					this.validator.setErrorHeader(clmsg.EMS0073);
					return null;
				}
				var items = clutil.tableview2ValidData({
					$tbody: this.$("#ca_table_tbody"),
					validator: this.validator2,
					tailEmptyCheckFunc: function(item) { // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように
						if (!_.isEmpty(item.code) || !_.isEmpty(item.upperLimit)) {
							return false;
						} else {
							return true;
						}
					}
				});

				if (_.isEmpty(items)) {
			        // 全部空欄行だったとか・・・
			        clutil.mediator.trigger('onTicker',clmsg.EGM0024);
			        f_valid = false;
				}
				if(f_error){
					return null;
				}

				var rec = clutil.view2data(this.$("#ca_headInfoArea"));
//				var list = clutil.tableview2data(this.$("#ca_table_tbody").children("tr"));
				var list = items;

				// コード重複チェック
				var listLen = list.length;
				$.each(list, function(i,v){
					var code = this.code;
					for(var j = i+1; j < listLen; j++){
						if (list[j].code == code){
							clutil.mediator.trigger("onTicker", clutil.fmtargs(clmsg.EMS0065, ["プライスライン"]));
							_this.validator.setErrorMsg(_this.$("#ca_table_tbody tr:nth-child(" + (i + 1) + ") input[name='code']"), clutil.fmtargs(clmsg.EMS0065, ["プライスライン"]));
							_this.validator.setErrorMsg(_this.$("#ca_table_tbody tr:nth-child(" + (j + 1) + ") input[name='code']"), clutil.fmtargs(clmsg.EMS0065, ["プライスライン"]));
							f_error = true;
						}
					}
					// ついでに名称生成
					this.name = clutil.comma(this.code);
				});
				if(f_error){
					return null;
				}

				// 金額チェック
				if(!this._chkRange(this.$("#ca_table_tbody").children("tr"))){
					return null;
				}

				// 適応期間を付加/更新
				$.each(list, function(){
					this.fromDate = rec.fromDate;
					this.toDate = rec.toDate;
				});

				updReq = {
						priceLineHead : rec,
						priceLineList : list
				};
			} else {
				updReq = this.viewSeed;
			}
			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var reqObj = {
					reqHead : reqHead,
					AMMSV0410UpdReq  : updReq
			};
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		_chkRange : function($trs){
			_this = this;
			var isCorrect = true;
			$.each($trs, function(){
				$this = $(this);
				var code = $this.find('input[name="code"]').val();
				var upperLimitVal = Number($this.find('input[name="upperLimit"]').val().split(",").join(""));
				if (_.isEmpty(code) && _.isEmpty(upperLimitVal)) {
					// 空行なのでチェック不要（他でチェック済み）
					return;
				}
				var lowerLimitVal = Number($this.find('input[name="lowerLimit"]').val().split(",").join(""));
				if ( upperLimitVal <= lowerLimitVal){
					_this.validator.setErrorHeader(clmsg.EMS0075);
					_this.validator.setErrorMsg($this.find('input[name="upperLimit"]'), clmsg.EMS0075);

					isCorrect = false;
				}
			});
			return isCorrect;
		},

		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			clutil.viewRemoveReadonly(this.$el);

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// プライスライン検索リクエスト
				AMMSV0410GetReq: {
					srchPriceLineTypeID: this.options.chkData[pgIndex].pricelineTypeID,	// プライスライン区分ID
					unitID: this.options.chkData[pgIndex].unitID,						// 事業ユニットID
					srchItgrpID: this.options.chkData[pgIndex].itgrpID,					// 品種ID
					srchDate: this.options.chkData[pgIndex].fromDate,					// 適用開始日
					delFlag : this.options.chkData[pgIndex].delFlag		// 削除(参照)フラグ
				},
			};

			return {
				resId: clcom.pageId,	//'AMMSV0410',
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
			var rec = data.AMMSV0410GetRsp;
			delete rec.priceLineHead.fromDate;
			delete rec.priceLineHead.toDate;
			$.each(rec.priceLineList, function(){
				delete this.fromDate;
				delete this.toDate;
			});
			return data;
		},

		_onUnitIDChange : function(){
			this.$("#ca_itgrpID").autocomplete('clAutocompleteItem', null);
			return;
		},

		_onUpperLimitchange :function(){
			this._reCalcLowerLimit();
		}
	});

	// 初期データを取る
	clutil.getIniJSON(null, null).done(_.bind(function(data, dataType) {
		ca_editView = new EditView(clcom.pageArgs);
		ca_editView.initUIelement()
		.done(_.bind(function(){
			ca_editView.render();
		}, this));
	},this)).fail(_.bind(function(data){
		// clcom のネタ取得に失敗。
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	}, this));
});