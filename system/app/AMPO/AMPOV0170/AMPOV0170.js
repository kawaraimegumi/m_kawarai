useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	clutil.enterFocusMode($('body'));
	var EditView = Backbone.View.extend({
		el : $("#ca_main"),

		validator : null,

		events : {
			"click #ca_table_tfoot1 tr" : "_onAddRow1Click",
			"click #ca_table_tfoot2 tr" : "_onAddRow2Click",
			"click #ca_table_tfoot3 tr" : "_onAddRow3Click",
			"change #ca_poTypeID" 			: "_PoTypeChange",
			'change #ca_unitID'				: '_changeUnit'			//
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
						title: 'POメーカー',
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
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});
			this.validator1 = clutil.validator(this.$("#ca_base_form"), {
				echoback : $('.cl_echoback')
			});
			clutil.cltxtFieldLimit($("#ca_code"));
			clutil.cltxtFieldLimit($("#ca_name"));

			return this;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			// 初期データ取得後に呼ばれる関数

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'));

			// ＰＯ種別
			clutil.cltypeselector(this.$("#ca_poTypeID"), amcm_type.AMCM_TYPE_PO_CLASS);
			//送信区分
			clutil.cltypeselector(this.$("#ca_poSendTypeID"), amcm_type.AMCM_TYPE_SEND_METHOD);
			//FAXメーカー記入欄有無区分
			//clutil.cltypeselector(this.$("#ca_poMemoTypeID"), amcm_type.AMCM_TYPE_FAX_MAKER_WRITE_FIELD);

			// Fieldlimit
			clutil.cltxtFieldLimit($("#ca_code"));
			clutil.cltxtFieldLimit($("#ca_name"));

			this.$("#ca_table_form2").hide();

			return this;
		},

		_onAddRow1Click: function(e) {
			this.addRow1();
		},

		_onAddRow2Click: function(e) {
			this.addRow2();
		},

		_onAddRow3Click: function(e) {
			this.addRow3();
		},

		render : function(){
			this.$("#ca_unitID").val(clcom.userInfo.unit_id);
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				// テーブル設定
				this.clearTable(this.$("#ca_table_tbody tr"));
				this.makeDefaultTable(this.$("#ca_table_tbody"), this.$("#ca_tbody_template"));
				this._PoTypeChange();
				//初期フォーカス
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.setFocus(this.$('#ca_poTypeID'));
				}
				else{
					clutil.setFocus(this.$('#ca_unitID'));
				}
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}
			return this;
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
				this.validator.setErrorInfoToTable({
					$table: this.$('#ca_table1'),
					fieldMessages: data.rspHead.fieldMessages,
					struct_name: 'faxList',
					options: {
						by: 'name'
					}
				});
				this.validator.setErrorInfoToTable({
					$table: this.$('#ca_table2'),
					fieldMessages: data.rspHead.fieldMessages,
					struct_name: 'mailList',
					options: {
						by: 'name'
					}
				});
				this.validator.setErrorInfoToTable({
					$table: this.$('#ca_table3'),
					fieldMessages: data.rspHead.fieldMessages,
					struct_name: 'brandList',
					options: {
						by: 'name'
					}
				});
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
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					this.setReadOnlyAllItems(true);
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					this.setReadOnlyAllItems(true);
					break;
				default:
					//新規はここには来ないはず
					clutil.viewReadonly(this.$(".ca_unitID_div"));
				clutil.viewReadonly(this.$(".ca_poTypeID_div"));
				clutil.inputReadonly($("#ca_code"));
				clutil.setFocus($('#ca_name'));
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


		setReadOnlyAllItems: function(readOnly){
			if (readOnly == true){
				clutil.viewReadonly($("#ca_base_form"));
				var $table1 = this.$("#ca_table1");
				$table1.find('input[type="text"]').attr("readonly", true);
				$table1.find('tbody span.btn-delete').hide();
				$table1.find('tbody span.btn-add').hide();
				$table1.find('tfoot').hide();
				var $table2 = this.$("#ca_table2");
				$table2.find('input[type="text"]').attr("readonly", true);
				$table2.find('tbody span.btn-delete').hide();
				$table2.find('tbody span.btn-add').hide();
				$table2.find('tfoot').hide();
				var $table3 = this.$("#ca_table3");
				$table3.find('input[type="text"]').attr("readonly", true);
				$table3.find('tbody span.btn-delete').hide();
				$table3.find('tbody span.btn-add').hide();
				$table3.find('tfoot').hide();
			}else{
				clutil.viewRemoveReadonly($("#ca_base_form"));
				var $table1 = this.$("#ca_table1");
				$table1.find('input[type="text"]').removeAttr("readonly");
				$table1.find('tbody span.btn-delete').show();
				$table1.find('tbody span.btn-add').show();
				$table1.find('tfoot').show();
				var $table2 = this.$("#ca_table2");
				$table2.find('input[type="text"]').removeAttr("readonly");
				$table2.find('tbody span.btn-delete').show();
				$table2.find('tbody span.btn-add').show();
				$table2.find('tfoot').show();
				var $table3 = this.$("#ca_table3");
				$table3.find('input[type="text"]').removeAttr("readonly");
				$table3.find('tbody span.btn-delete').show();
				$table3.find('tbody span.btn-add').show();
				$table3.find('tfoot').show();
			}
		},

		/**
		 * dataを表示
		 */
		data2view : function(data){
			var _this = this;

			this.saveData = data.AMPOV0170GetRsp;
			var maker = data.AMPOV0170GetRsp.maker;
			var faxList = data.AMPOV0170GetRsp.faxList;
			var mailList = data.AMPOV0170GetRsp.mailList;
//			var brandList = data.AMPOV0170GetRsp.brandList;
			var brandList = [];
			clutil.data2view(this.$('#ca_base_form'), maker);

			var $tbody = $("#ca_table_tbody1");
			$tbody.empty();
			$.each(faxList, function() {
				var tr = _.template($("#ca_tbody_template1").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);
				var $tr = $tbody.find('tr:last');	// 追加した行
				var $faxNo = $tr.find('input[name="faxNo"]');
				$faxNo.val(this.faxNo);

				$tbody.find("tr:last span.btn-delete").click(function(e) {
					var $tgt_tr = $(this).parent().parent();
					$tgt_tr.remove();
				});
			});
			var $tbody = $("#ca_table_tbody2");
			$tbody.empty();
			$.each(mailList, function() {
				var tr = _.template($("#ca_tbody_template2").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);
				var $tr = $tbody.find('tr:last');	// 追加した行
				var $mailAddr = $tr.find('input[name="mailAddr"]');
				$mailAddr.val(this.mailAddr);

				$tbody.find("tr:last span.btn-delete").click(function(e) {
					var $tgt_tr = $(this).parent().parent();
					$tgt_tr.remove();
				});
			});
			var $tbody = $("#ca_table_tbody3");
			var $POTypeID = this.$("#ca_poTypeID");
			var $UnitID = this.$("#ca_unitID");
			$tbody.empty();
			$.each(brandList, function() {
				var brandRec = {
						id		: this.brandID,
						name	: this.brandName,
						code	: this.brandCode,
				};
				var tr = _.template($("#ca_tbody_template3").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);
				var $tr = $tbody.find('tr:last');	// 追加した行
				var $inputBrand = $tr.find('input[name="brandID"]');
				clutil.clpobrandcode($inputBrand, {
					dependAttrs :{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return $POTypeID.val();
						}
					}
				});
				$inputBrand.autocomplete('clAutocompleteItem', brandRec);
				$tbody.find("tr:last span.btn-delete").click(function(e) {
					var $tgt_tr = $(this).parent().parent();
					$tgt_tr.remove();
				});
			});
		},

		/**
		 * テーブルクリア
		 */
		clearTable : function() {
			$("#ca_table_tbody1 tr").remove();
			$("#ca_table_tbody2 tr").remove();
			$("#ca_table_tbody3 tr").remove();
		},


		_changeUnit: function(e) {
			$("#ca_table_tbody3 tr").remove();
			var $UnitID = this.$("#ca_unitID");
			var $POTypeID = this.$("#ca_poTypeID");
			var $table = this.$("#ca_table3");
			if ($POTypeID.val() <= 0 ||(($UnitID.val() != null)?($UnitID.val() <= 0):false)){
				$table.find('input[type="text"]').attr("readonly", true);
				$table.find('tbody span.btn-delete').hide();
				$table.find('tbody span.btn-add').hide();
				$table.find('tfoot').hide();
			}else{
				$table.find('input[type="text"]').attr("readonly", false);
				$table.find('tbody span.btn-delete').show();
				$table.find('tbody span.btn-add').show();
				$table.find('tfoot').show();
			}
			clutil.initUIelement(this.$el);
		},

		//PO種別に関連するテーブルは空にする。
		_PoTypeChange: function(e) {
			$("#ca_table_tbody3 tr").remove();
			var $UnitID = this.$("#ca_unitID");
			var $POTypeID = this.$("#ca_poTypeID");
			var $table = this.$("#ca_table3");
			if ($POTypeID.val() <= 0 || (($UnitID.val() != null)?($UnitID.val() <= 0):false)){
				$table.find('input[type="text"]').attr("readonly", true);
				$table.find('tbody span.btn-delete').hide();
				$table.find('tbody span.btn-add').hide();
				$table.find('tfoot').hide();
			}else{
				$table.find('input[type="text"]').attr("readonly", false);
				$table.find('tbody span.btn-delete').show();
				$table.find('tbody span.btn-add').show();
				$table.find('tfoot').show();
			}
			clutil.initUIelement(this.$el);
		},
		/**
		 * 新規作成時にデフォルト空欄表示(1行)
		 */
		makeDefaultTable: function($tbody, $tmpl){
//			var _this = this;
			this.clearTable();
			var $tbody = this.$("#ca_table_tbody1"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody2"),
			$tmpl = this.$("#ca_tbody_template2"),
			defArray = new Array;;

			$tmpl.tmpl(defArray).appendTo($tbody);
			clutil.initUIelement(this.$el);

			var $tbody = this.$("#ca_table_tbody3"),
			$tmpl = this.$("#ca_tbody_template3"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);
			clutil.initUIelement(this.$el);

			return this;
		},
		setCompletes : function($tr){
			var $POTypeID = this.$("#ca_poTypeID");
			var $UnitID = this.$("#ca_unitID");
			// ブランド
			$tr.find('input[name="brandID"]')
			.each(function(){
				clutil.clpobrandcode($(this), {
					dependAttrs:{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return $POTypeID.val();
						}
					}
				});
			});
			return $tr;
		},
		/**
		 * 行追加処理(tfoot)
		 */
		addRow1: function() {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tbody = this.$("#ca_table_tbody1");
			var $tmpl = $("#ca_tbody_template1");
			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
			var tr = _.template($("#ca_tbody_template1").html(), addObj);
			$tbody.append(tr);
			var $tr = $tbody.find('tr:last');	// 追加した行
			var $faxNo = $tr.find('input[name="faxNo"]');
			$faxNo.val("");
			/*
			 * 行削除
			 */
			$tbody.find("tr:last span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});

			clutil.initUIelement(this.$el);
		},
		addRow2: function() {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tbody = this.$("#ca_table_tbody2");
			var $tmpl = $("#ca_tbody_template2");
			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
			var tr = _.template($("#ca_tbody_template2").html(), addObj);
			$tbody.append(tr);
			var $tr = $tbody.find('tr:last');	// 追加した行
			var $mailAddr = $tr.find('input[name="mailAddr"]');
			$mailAddr.val("");
			/*
			 * 行削除
			 */
			$tbody.find("tr:last span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});

			clutil.initUIelement(this.$el);
		},
		addRow3: function() {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tbody = this.$("#ca_table_tbody3");
			var $tmpl = $("#ca_tbody_template3");
			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
//			var tr = _.template($("#ca_tbody_template3").html(), addObj);
//			$tbody.append(tr);
			$tmpl.tmpl(addObj).appendTo($tbody);
			var $tr = $tbody.find('tr:last');	// 追加した行
			this.setCompletes($tr);
			/*
			 * 行削除
			 */
			$tbody.find("tr:last span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});

			clutil.initUIelement(this.$el);
		},
		/**
		 * 行削除処理
		 */
		addEvent: function() {
			/*
			 * 行削除
			 */
			$("#ca_table_tbody1 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody2 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody3 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});

		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			this.validator.clear();
			var updReq = {};
			/*
			 * 入力値チェック 予約取消時はチェックしない
			 */
			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				//予約取消はないので基本全部こちらに来る
				// validation
				var noStoreflag = true;

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
				var f_error0 = !this.validator1.valid();
				var f_error = false;

				var _head = clutil.view2data(this.$('#ca_base_form'));
				var _faxList= clutil.tableview2data(this.$('#ca_table_tbody1').children("tr"));
				var _mailList = clutil.tableview2data(this.$('#ca_table_tbody2').children("tr"));
				var _faxList2=  new Array;
				var _mailList2 = new Array;
//				var _brandList = clutil.tableview2data(this.$('#ca_table_tbody3').children("tr"));
				var _brandList = [];
				// FAX番号：空欄/重複チェック
			    var result_fax  = clutil.tableview2ValidDataWithStat({
			        $tbody: this.$('#ca_table_tbody1'),    // <tbody> の要素を指定する。
			        validator: this.validator,   // validator インスタンスを指定する。（どこのものでもかまわない）
			        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。
			        	if (
			        			//オートコンプリートのゴミデータに反応できない
								(item.faxNo != null && item.faxNo.trim().length != 0 ) ) {
			        		return false;
			        	} else {
				            return true;
			        	}
			        }
			    });
			    var use_line_cnt = result_fax.items.length; //何行目まで有効かチェック
			    for (var i = 0; i < use_line_cnt; i ++){
			    	if(result_fax.stat[i] == "inval"){
			    		f_error = true;
			    	}
			    }
				var chkMap = new Object();
//				for(var i = 0; i < _faxList.length; i++){
				for(var i = 0; i < use_line_cnt; i++){
					var fax = _faxList[i];

					// 空欄チェック
					if(_.isEmpty(fax.faxNo)){
						this.validator.setErrorMsg(this.$("#ca_table_tbody1 tr:nth-child(" + (i + 1) + ") input[name='faxNo']"), clmsg.cl_required);
						f_error = true;
						continue;
					}

					// 重複チェック
					if(chkMap[fax.faxNo]){
						if(_.isNumber(chkMap[fax.faxNo])){
							this.validator.setErrorMsg(this.$("#ca_table_tbody1 tr:nth-child(" + chkMap[fax.faxNo] + ") input[name='faxNo']"), clutil.fmtargs(clmsg.EGM0009,[fax.faxNo]));
							chkMap[fax.faxNo] = true;
						}
						this.validator.setErrorMsg(this.$("#ca_table_tbody1 tr:nth-child(" + (i + 1) + ") input[name='faxNo']"), clutil.fmtargs(clmsg.EGM0009,[fax.faxNo]));
						f_error = true;
						continue;
					}
					chkMap[fax.faxNo] = (i+1);
//					this.validator.clearErrorMsg(this.$("#ca_table_tbody1 tr:nth-child(" + (i + 1) + ") input[name='faxNo']"));
					var obj = {faxNo: fax.faxNo};
					_faxList2.push(obj);
				}

				// E-mailアドレス：空欄/重複チェック
			    var result_mail  = clutil.tableview2ValidDataWithStat({
			        $tbody: this.$('#ca_table_tbody2'),    // <tbody> の要素を指定する。
			        validator: this.validator,   // validator インスタンスを指定する。（どこのものでもかまわない）
			        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。
			        	if (
			        			//オートコンプリートのゴミデータに反応できない
								(item.mailAddr != null && item.mailAddr.trim().length != 0 ) ) {
			        		return false;
			        	} else {
				            return true;
			        	}
			        }
			    });
			    use_line_cnt = result_mail.items.length; //何行目まで有効かチェック
			    for (var i = 0; i < use_line_cnt; i ++){
			    	if(result_mail.stat[i] == "inval"){
			    		f_error = true;
			    	}
			    }
				chkMap = new Object();
//				for(var i = 0; i < _mailList.length; i++){
				for(var i = 0; i < use_line_cnt; i++){
					var mail = _mailList[i];

					// 空欄チェック
					if(_.isEmpty(mail.mailAddr)){
						this.validator.setErrorMsg(this.$("#ca_table_tbody2 tr:nth-child(" + (i + 1) + ") input[name='mailAddr']"), clmsg.cl_required);
						f_error = true;
						continue;
					}

					// 重複チェック
					if(chkMap[mail.mailAddr]){
						if(_.isNumber(chkMap[mail.mailAddr])){
							this.validator.setErrorMsg(this.$("#ca_table_tbody2 tr:nth-child(" + chkMap[mail.mailAddr] + ") input[name='mailAddr']"), clutil.fmtargs(clmsg.EGM0009, [mail.mailAddr]));
							chkMap[mail.mailAddr] = true;
						}
						this.validator.setErrorMsg(this.$("#ca_table_tbody2 tr:nth-child(" + (i + 1) + ") input[name='mailAddr']"), clutil.fmtargs(clmsg.EGM0009, [mail.mailAddr]));
						f_error = true;
						continue;
					}
					chkMap[mail.mailAddr] = (i+1);
					var obj = {mailAddr:  mail.mailAddr};
					_mailList2.push(obj);
//					this.validator.clearErrorMsg(this.$("#ca_table_tbody2 tr:nth-child(" + (i + 1) + ") input[name='mailAddr']"));
				}

				// 対象ブランド  --- TODO: _brandList jQueryオブジェクトじゃないので、単なる for-loop で回した方が可読性がよくなる。
//				chkMap = new Object();
//				for(var i = 0; i < _brandList.length; i++){
//					var brand = _brandList[i];
//
//					// 空欄チェック
//					if(brand.brandID == null){
//						this.validator.setErrorMsg(this.$("#ca_table_tbody3 tr:nth-child(" + (i + 1) + ") input[name='brandID']"), clmsg.cl_required);
//						f_error = true;
//						continue;
//					}
//
//					// 重複チェック
//					if(chkMap[brand._view2data_brandID_cn.id]){
//						if(_.isNumber(chkMap[brand._view2data_brandID_cn.id])){
//							this.validator.setErrorMsg(this.$("#ca_table_tbody3 tr:nth-child(" + chkMap[brand._view2data_brandID_cn.id] + ") input[name='brandID']"), clutil.fmtargs(clmsg.EGM0009, [brand._view2data_brandID_cn.code]));
//							chkMap[brand._view2data_brandID_cn.id] = true;
//						}
//						this.validator.setErrorMsg(this.$("#ca_table_tbody3 tr:nth-child(" + (i + 1) + ") input[name='brandID']"), clutil.fmtargs(clmsg.EGM0009, [brand._view2data_brandID_cn.code]));
//						f_error = true;
//						continue;
//					}
//					chkMap[brand._view2data_brandID_cn.id] = (i+1);
////					this.validator.clearErrorMsg(this.$("#ca_table_tbody3 tr:nth-child(" + (i + 1) + ") input[name='brandID']"));
//				}

				try{
					this.mdBaseView.setAutoValidate(false);
					if(f_error0){
						// valid() -- NG
						clutil.setFocus(this.$el.find('.cl_error_field').first());
						return null;
					}
					if(f_error){
						// 独自チェック -- NG
						clutil.mediator.trigger('onTicker',clmsg.cl_echoback);
						clutil.setFocus(this.$el.find('.cl_error_field').first());
						return null;
					}
				}finally{
					this.mdBaseView.setAutoValidate(true);
				}


				// listへhead情報の適応
				if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
						|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
//					$.each(list, function(){


//					});
				}
				var brandList = new Array;
//				$.each(_brandList, function(i){
//					var obj = {
//							brandID		: this._view2data_brandID_cn.id,
//							brandName	: this._view2data_brandID_cn.name,
//							brandCode	: this._view2data_brandID_cn.code,
//					};
//					brandList.push(obj);
//				});

				updReq = {
						maker : _head,
						faxList : _faxList2,
						mailList : _mailList2,
						brandList : brandList
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
					AMPOV0170UpdReq  : updReq
			};
			return {
				resId : clcom.pageId,
				data: reqObj
			};
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
					AMPOV0170GetReq: {
						srchID: this.options.chkData[pgIndex].id,			// 取引先ID
						delFlag : this.options.chkData[pgIndex].delFlag
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMPOV0170UpdReq: {
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
//			var rec = data.AMPOV0170GetRsp;
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
