useSelectpicker2();

$.inputlimiter.noTrim = true;

$(function(){

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var RequireController = function(view){
		this.view = view;
		this.validator = view.validator;
	};

	_.extend(RequireController.prototype, {
		addRequired: function($el){
			$el.addClass('cl_required');
			$el.closest('.fieldUnit').addClass('required');
		},

		removeRequired: function($el){
			$el.removeClass('cl_required');
			$el.closest('.fieldUnit').removeClass('required');
			this.validator.clearErrorMsg($el);
		},

		show: function($el){
			$el.closest('.fieldUnit').show();
		},

		hide: function($el){
			$el.closest('.fieldUnit').hide();
		},

		toggleRequired: function($el, sw, disabled, hide){
			if (sw){
				this.addRequired($el);
				if (disabled){
					clutil.inputRemoveReadonly($el);
				}
				if (hide !== false){
					this.show($el);
				}
			}else{
				this.removeRequired($el);
				if (disabled){
					clutil.inputReadonly($el);
				}
				if (hide !== false){
					this.hide($el);
				}
			}
			return this;
		}
	});

	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		events: {
			// XXX アコーディオンのアクション制御はここでするかなー？
			'click #ca_btn_store_select'	: '_onStoreSelClick',		// 店舗選択補助画面起動
			'click #ca_btn_center'	: '_onCenterSelClick',		// 倉庫選択補助画面起動
			"click #ca_srch"		: "_onSrch",			// 明細表示ボタンが押下された
			"click #ca_table .btn-delete" : "_onDeleteLineClick",
			"click #ca_table tfoot tr:first span:first" : "_onAddLineClick",
			"change #ca_dlvwapDispTypeID"		: "_onDlvTypeChanged",
			"change #ca_qy" :   "_onQyChange"
		},

		initialize: function(opt){
			_.bindAll(this);

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: 'SCM入荷データ',
//					subtitle: '登録・修正',
					new_btn: '',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					 // リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
						? this._buildGetReqFunction : undefined,
					// 空更新チェック用データを作る関数。
					// UIから集めてきた更新データが GET してきた直後の内容と同一かどうかをチェックするための
					// GET直後データを加工する関数。GET 直後に変更するプロパティは空更新チェックの比較対象外
					// にあたるため、比較対象外プロパティを除去するために使用する。
					buildSubmitCheckDataFunction: this._buildSubmitCheckDataFunction
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// validatorエラー時の表示領域
			var $eb = $('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $eb
			});
			this.srchAreaValidator = clutil.validator(this.$('#ca_srchArea'), {
				echoback : $eb
			});
			this.srchArea2Validator = clutil.validator(this.$('#ca_srchArea2'), {
				echoback : $eb
			});

			this.requireController = new RequireController(this);

			// TODO: アプリ個別の View や部品をインスタンス化する

			// ヘッダパネル
/*
			// 店舗
			var id = clcom.userInfo.org_id;
			var code = clcom.userInfo.org_code;
			var name = clcom.userInfo.org_name;
			var type = clcom.userInfo.user_typeid;
			var store = code + ":" + name;
			$("#ca_store").val(store);
			$("#ca_store").data('cl_store_item', {
				id: id,
				code: code,
				name: name
			});
*/
			var unit = null;
			//店舗オートコンプリート
			this.srcStoreIdField = clutil.clorgcode({
				el: $("#ca_store"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});

			// 納品形態表示区分取得
			clutil.cltypeselector(this.$("#ca_dlvwapDispTypeID"), amcm_type.AMCM_TYPE_SCM_SRC, 1);

			// メーカー
			this.vendorField = clutil.clvendorcode(this.$('#ca_vendor'), {
				getVendorTypeId: _.bind(function(){
					return amdb_defs.MTTYPE_F_VENDOR_MAKER;   // メーカー
				}, this),
				getUnitId: _.bind(function() {
					var unitId = 0;
					var storeObj = $("#ca_store").autocomplete('clAutocompleteItem');
					if (storeObj!= null && storeObj.unit_id != null) {
						unitId = storeObj.unit_id;
					} else {
						unitId = clcom.getUserData().unit_id;
					}
					return unitId;
				}, this)
			});

			// 入荷状態区分取得
			this.$("#ca_dlvStateID").val(amcm_type.AMCM_VAL_DLV_STAT_DELIVERING);
			this.$("#ca_dlvState").val(clutil.gettypename(amcm_type.AMCM_TYPE_DLV_STAT, amcm_type.AMCM_VAL_DLV_STAT_DELIVERING));

			// datepicker
			// 検収日
//			clutil.datepicker(this.$('#ca_recInspectDate'));
			this.$('#ca_recInspectDate').val(clutil.dateFormat(clcom.getOpeDate(),"yyyy/mm/dd(w)"));

			// 担当者
			clutil.clstaffcode2($("#ca_staff"));
/*
			if(fixopt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
				clutil.clstaffcode($("#ca_staff"));
			} else {
				clutil.clstaffcode2($("#ca_staff"));
			}
*/

			// グループID -- AMDLV0060 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDLV0060';

			// Fieldlimit
			clutil.cltxtFieldLimit(this.$('#ca_shipNo'))

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				break;
			default:
				// 新規登録以外は、Submit と、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			//フィールドカウント
			clutil.cltxtFieldLimit($("#ca_shipNo"));

		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var mainView = this;

			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: this.$("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	this.$("#mainColumn"),
				select_mode : clutil.cl_single_select		// 単一選択
			});
			this.AMPAV0010Selector.render();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					data[0].id = data[0].val;
//					mainView.srchCondView.srcStoreIdField.setValue(data[0]);
					mainView.srcStoreIdField.setValue(data[0]);
					mainView.setFocus();
				}
				_.defer(function(){									// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store_select")); 	// 参照ボタンへあてなおす
				});
			};
			this.AMPAV0010Selector.clear = function() {
				$("#ca_store").val("");
				$("#ca_store").data('cl_store_item', "");
			};

			this.AMPAV0010Selector1 = new AMPAV0010SelectorView({
				el: this.$("#ca_AMPAV0010_dialog1"),		// 配置場所
				$parentView	:	this.$("#mainColumn"),
				select_mode : clutil.cl_single_select		// 単一選択
			});
			this.AMPAV0010Selector1.render();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector1.okProc = function(data) {
				if (data !== null && data.length == 1) {
					data[0].id = data[0].val;
					mainView.centerField.setValue(data[0]);
				}
				_.defer(function(){							// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_center")); 	// 参照ボタンへあてなおす
				});
			};
			// 店舗オートコンプリート
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				this.centerField = clutil.clorgselector( {
					el : '#ca_centerID',
					dependAttrs : {
						p_org_id: clcom.userInfo.unit_id,
						orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
						org_typeid: amcm_type.AMCM_VAL_ORG_KIND_CENTER,
						f_ignore_perm: 1
					}
				});
			} else {
				this.centerField = clutil.clorgselector( {
					el : '#ca_centerID',
					dependAttrs : {
//						p_org_id: clcom.userInfo.unit_id,
						orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
						org_typeid: amcm_type.AMCM_VAL_ORG_KIND_CENTER,
						f_ignore_perm: 1
					}
				});
			}

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				// 組織表示
				this.srcStoreIdField.setValue({
					id: clcom.userInfo.org_id,
					code: clcom.userInfo.org_code,
					name: clcom.userInfo.org_name
				});
				// 店舗ユーザー
				clutil.inputReadonly($("#ca_store"));
				clutil.inputReadonly($("#ca_btn_store_select"));
			}

			var type = clcom.userInfo.user_typeid;
			if (type == amcm_type.AMCM_VAL_USER_STORE || type == amcm_type.AMCM_VAL_USER_STORE_MAN){
				clutil.viewReadonly(this.$('#div_store'));
			}

			this._onDlvTypeChanged();

			// TODO: アプリ個別の View や部品を初期化（選択部品の選択肢を投入するなど）する
			// 初期のアコーディオン展開状態をつくるなど？？。

			this.mdBaseView.initUIElement();

			return this;
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

			for (;i < 9;i++){
				var obj = {
						editable:true,
						canAdd:true,
						disChk:false,
						disEdit:false
				};
				defArray.push(obj);
			}
			$tmpl.tmpl(defArray).appendTo($tbody);
			this._reNum();
			clutil.initUIelement(this.$el);
			return this;
		},

		/**
		 * 明細リスト表示
		 */
		tableSetRecs: function(data){
/**/
			this.clearTable();
			var getRsp = data;
			var $tbody = this.$("#ca_table_tbody");
			$tmpl = this.$("#ca_tbody_template");

//			if(getRsp.slipItemList.length > 9){
//				getRsp.slipItemList.length = 9;
//			}

			// 明細リスト作成

			$.each(getRsp.slipItemList, function(){
				$tmpl.tmpl(this).appendTo($tbody);
				var $tr = $tbody.find("tr:last");
			});
//			$tmpl.tmpl(getRsp.slipItemList).appendTo($tbody);
/*
			defArray = new Array;
			i = getRsp.slipItemList.length;

			for (;i < 9;i++){
				var obj = {
						editable:true,
						canAdd:true,
						disChk:false,
						disEdit:false
				};
				defArray.push(obj);
			}
			$tmpl.tmpl(defArray).appendTo($tbody);
			this._reNum();
*/
//			this.calc_qty_total();
			this._reNum();
			clutil.initUIelement(this.$el);
/**/
			return this;
		},

		/**
		 * 階層レベル振り直し
		 */
		_reNum : function(){
			var $input = this.$("#ca_table_tbody").find('input[name="noDisp"]');
			$input.each(function(i){
				$(this).val(i + 1);
			});
// ダミーデータ設定
/*
			this.$("#ca_table_tbody tr").find('#ca_janCode').each(function(i){
				$(this).val('111111111111'+i);
			});
			this.$("#ca_table_tbody tr").find('#ca_stdItgrpName').each(function(i){
				$(this).val('品種'+i);
			});
			this.$("#ca_table_tbody tr").find('#ca_makerCode').each(function(i){
				$(this).val('M_CODE'+i);
			});
			this.$("#ca_table_tbody tr").find('#ca_itemName').each(function(i){
				$(this).val('商品名'+i);
			});
			this.$("#ca_table_tbody tr").find('#ca_colorName').each(function(i){
				$(this).val('カラー'+i);
			});
			this.$("#ca_table_tbody tr").find('#ca_sizeName').each(function(i){
				$(this).val('サイズ'+i);
			});
*/
// ダミーデータ設定
			this.calc_qty_total();
			return this;
		},

		/**
		 * 行削除処理
		 */
		_onDeleteLineClick : function(e) {
			var ope_mode = this.options.opeTypeId;
			if (ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
					|| ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					|| ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			$(e.target).parent().parent().remove();
//			var $tbody = this.$("#ca_table_tbody");
//			var $tmpl = $("#ca_tbody_template");
//			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
//			$tmpl.tmpl(addObj).appendTo($tbody);
			this._reNum();
		},

		/**
		 * 行追加処理(tfoot)
		 */
		_onAddLineClick : function(e) {
			var ope_mode = this.options.opeTypeId;
			if (ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
					|| ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					|| ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = $("#ca_tbody_template");
			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
			$tmpl.tmpl(addObj).appendTo($tbody);
			this._reNum();
			clutil.initUIelement(this.$el);

			return this;
		},

		/**
		 * 納品形態区分変更イベント
		 */
		_onDlvTypeChanged: function() {
			var dlvType = parseInt(this.$("#ca_dlvwapDispTypeID").val(), 10);
			if(!dlvType){
				this.centerField.setValue();
				this.vendorField.setValue();
				this.requireController.toggleRequired(this.$("#ca_vendor"), false, true).show(this.$("#ca_vendor"));
				this.requireController.toggleRequired(this.$("#ca_centerID"), false, true);
			}else if(dlvType === amcm_type.AMCM_VAL_SCM_SRC_VENDOR){
				this.centerField.setValue();
				this.$("#ca_btn_center").attr("disabled", true);
				this.requireController.toggleRequired(this.$("#ca_vendor"), true, true);
				this.requireController.toggleRequired(this.$("#ca_centerID"), false, true);
			}else{
				this.vendorField.setValue();
				this.$("#ca_btn_center").attr("disabled", false);
				this.requireController.toggleRequired(this.$("#ca_vendor"), false, true);
				this.requireController.toggleRequired(this.$("#ca_centerID"), true, true);
			}
		},

		/**
		 * 点数変更イベント
		 */
		_onQyChange: function(event, ui) {
//			var qy = $(event.target).val();
//			var price = this.$("#ca_table_tbody").find('input[name="unitPrice"]');
//			var $amintax = this.$("#ca_table_tbody").find('input[name="amInTax"]');
//			var am = qy * price;
//			$amintax.val(clutil.comma(am));
			this.calc_qty_total();
		},

		/**
		 * 合計再計算
		 */
		calc_qty_total : function() {
			var qty_t = 0;
			var qty_flg = 0;
/*
			var $input = this.$("#ca_table_tbody").find('input[name="qy"]');
			$input.each(function(i){
				var dt = $(this).val();
				if(!_.isEmpty(dt)){
					clutil.setFocus($(this));
				}
			});
*/
			this.$("#ca_table_tbody").find('input[name="qy"]').each(function(){
				qty_t += Number((this.value).replace(/,/g,''));
			});
			qty_flg = Number(qty_t) || "a";
			if (qty_flg == "a") {
				$("#ca_sumQy").text("　");
			} else {
				$("#ca_sumQy").text(clutil.comma(qty_t));
			}
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
/*
			// 入力チェック
			if(!this.isValid()){
				return;
			}
*/
			// validation
			var f_error = false;
			this.validator.clear();
//			if(!this.validator.valid()) {
			if(!this.srchAreaValidator.valid()) {
				f_error = true;
				return;
			}
			var req = this._buildGetReqFunction();
			req.data.AMDLV0060GetReq.f_new = 1;	// 新規作成時に新規フラグを立てる

			// 検索実行
			this.doSrch(req);
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':        // 確定済
				// TODO: args.data を画面個別 Viwe へセットする。
				if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					this.options.chkData[args.index].dlvStateID = amcm_type.AMCM_VAL_DLV_STAT_DELIVERED;
				}
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				break;
			case 'CONFLICT':    // 別のユーザによって DB が更新された
				// TODO: args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				break;
			case 'DELETED':        // 別のユーザによって削除された
				// TODO: args.data が null なら空欄表示化する。args.data に何かネタがあれば画面個別Viewへセットする。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				break;
			default:
			case 'NG':            // その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// TODO: 入力値エラー情報が入っていれば、個別 View へセットする。
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
			this.showResultArea();
			var data = args.data;
			switch(args.status){
			case 'OK':
				// TODO: args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				var getRsp = data.AMDLV0060GetRsp;
				this.viewSeed = getRsp;
				_.each(getRsp.slipItemList, function(data){
					data.rowId = _.uniqueId('r');
				});
/**/
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					var rec = getRsp.slip;
					rec.staff = {
						id: 0,
						code: "",
						name: ""
					};
					clutil.inputRemoveReadonly('#ca_staff');
					clutil.data2view(this.$('#ca_srchArea2'), rec);
				}
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					var rec = getRsp.slip;
					if (rec.dlvStateID === amcm_type.AMCM_VAL_DLV_STAT_DELIVERING) {
						rec.recInspectDate = 0;
					}
//					this.$('#ca_staff').val(rec.staff.code);
					clutil.inputRemoveReadonly('#ca_staff');
					clutil.data2view(this.$('#ca_srchArea2'), rec);
				}
/**/
				this.data2view(getRsp);
				this._onDlvTypeChanged();
				if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
					clutil.viewReadonly(this.$('#div_store'));
					clutil.viewReadonly(this.$('#div_dlvwapDispTypeID'));
					clutil.viewReadonly(this.$('#div_vendor'));
					clutil.viewReadonly(this.$('#div_center'));
					clutil.viewReadonly(this.$('#div_shipNo'));
					clutil.viewReadonly(this.$('#div_srch'));
				}
				this.$('#ca_sumQy').val(getRsp.slip.sumQy);

				// 内容物がある場合 --> 結果表示する。
				this.tableSetRecs(getRsp);
				var $input = this.$("#ca_table_tbody").find('input[name="qy"]');
				$input.each(function(i){
					var dt = $(this).val();
					if(!_.isEmpty(dt)){
						clutil.setFocus($(this));
					}
				});
				mainView.setFocus();
				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					clutil.viewReadonly(this.$el);
					clutil.inputRemoveReadonly('#ca_staff');
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
					clutil.viewReadonly(this.$el);
					break;
				}

				break;
			case 'DONE':        // 確定済
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				getRsp = data.AMDLV0060GetRsp;
				this.viewSeed = getRsp;
				this.data2view(getRsp);
//				this.$('#ca_staff').val(getRsp.slip.staff.code);
				// 内容物がある場合 --> 結果表示する。
				this.tableSetRecs(getRsp);
				var $input = this.$("#ca_table_tbody").find('input[name="qy"]');
				$input.each(function(i){
					var dt = $(this).val();
					if(!_.isEmpty(dt)){
						clutil.setFocus($(this));
					}
				});
				mainView.setFocus();
				clutil.viewReadonly(this.$el);
				break;
			case 'DELETED':        // 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？                        【確認】
				// 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMDLV0060GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
//				clutil.data2view(this.$el, getRsp);
				this.data2view(getRsp);
				clutil.viewReadonly(this.$el);
				break;
			case 'CONFLICT':    // ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMDLV0060GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
//				clutil.data2view(this.$el, getRsp);
				this.data2view(getRsp);
				clutil.viewReadonly(this.$el);
				break;
			default:
			case 'NG':            // その他エラー。
				this.hideResultArea();
				// 全 <input> を readonly 化するなどの処理。
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
					// 照会モードは、Edit ブロッキングしておく。
					clutil.viewReadonly(this.$el);
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

		data2view: function(data){
			var rec = data.slip;
			this.data2views(rec);
			rec.staff = {
				id: rec.staff.id,
				code: rec.staff.code,
				name: rec.staff.name,
			};
			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				clutil.data2view(this.$('#ca_srchArea2'), rec);
			}
		},

		data2views: function(data){
			var rec = data;
			_.defaults(rec, {
				dlvStateID: amcm_type.AMCM_VAL_DLV_STAT_DELIVERING
			});
			rec.centerID = rec.center.id;
			rec.dlvState = clutil.gettypename(amcm_type.AMCM_TYPE_DLV_STAT, rec.dlvStateID);
			clutil.data2view(this.$('#ca_srchArea'), rec);
		},

		changeDlvwapDisp: function(data) {
			var dlvwapDispTypeID = data.dlvwapDispTypeID;
			if (dlvwapDispTypeID == amcm_type.AMCM_VAL_DLV_ROUTE_DIRECT ||
					dlvwapDispTypeID == amcm_type.AMCM_VAL_DLV_ROUTE_TC1) {
				return amcm_type.AMCM_VAL_SCM_SRC_VENDOR;
			} else {
				return amcm_type.AMCM_VAL_SCM_SRC_CENTER;
			}
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				// TODO: アプリ個別の render をする。
//				this.makeDefaultTable();
				this._reNum();
				this.mdBaseView.setSubmitEnable(false);
			} else {

				// 一覧画面からの引継データ pageArgs があれば渡す。
				var data = _.deepClone(this.options.chkData[0]);
				data.dlvState = clutil.gettypename(amcm_type.AMCM_TYPE_DLV_STAT, data.dlvStateID);
				var org_dlvwapDispTypeID = data.dlvwapDispTypeID;
				data.dlvwapDispTypeID = this.changeDlvwapDisp(data);
				this.data2views(data);
				data.dlvwapDispTypeID = org_dlvwapDispTypeID;
				if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					// スタッフは検索時のみセットする
					// $("#ca_staff").val(data.staffName);
				}

				this.mdBaseView.fetch();    // データを GET してくる。
				this.mdBaseView.setSubmitEnable(true);
			}
			return this;
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				//初期フォーカス
				var $tgt = null;
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					$tgt = $("#ca_dlvwapDispTypeID");
				}
				else{
					$tgt = $("#ca_store");
				}
				clutil.setFocus($tgt);
			} else if ($('#ca_staff').val() == ""){
				clutil.setFocus($('#ca_staff'));
			}
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			var updReq = {};
			var f_error = false, f_warn = false;

			/*
			 * 無効化チェック
			 */
			if ($("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}
			/*
			 * 入力値チェック 削除時はチェックしない
			 */
			if (this.options.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				// validation
				if(!this.validator.valid()) {
//				if(!this.srchArea2Validator.valid()) {
					f_error = true;
					return;
				}
				// テーブル領域エラーチェック
				// テーブルデータを取りながら、行末空欄スキップと、入力チェックを行う。
			    var items = clutil.tableview2ValidData({
			        $tbody: this.$('#ca_table > tbody'),    // <tbody> の要素を指定する。
			        validator: this.validator,   			// validator インスタンスを指定する。（どこのものでもかまわない）
			        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。//ラジオボタン選択値をとる
			            return _.isEmpty(item.itemID);
			        }
			    });
			    if(_.isEmpty(items)){
			        // 全部空欄行だったとか・・・
			        clutil.mediator.trigger('onTicker',clutil.fmtargs(clmsg.EMS0007, ["1"]));
					f_error = true;
					return;
			    }
			}
			var reqHead = {
				opeTypeId : this.options.opeTypeId
			};

			var head = clutil.view2data(this.$('#ca_srchArea'));
			var staff = clutil.view2data(this.$('#ca_srchArea2'));
			head.store = head._view2data_store_cn;
			head.staff = staff._view2data_staff_cn;
			head.vendor = head._view2data_vendor_cn;
			head.center = this.centerField.getAttrs();
			if (this.viewSeed != null && this.viewSeed.slip != null) {
				head.orderDate = this.viewSeed.slip.orderDate;
			}
			delete head.senderTypeID;
			delete head.opeTypeID;

			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY ||
			   (this.options.opeTypeId ==am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD &&
				head.dlvStateID == amcm_type.AMCM_VAL_DLV_STAT_DELIVERING)){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}
			var list = clutil.tableview2data(this.$('#ca_table_tbody').children());

			// 空白行は無視したリストを作成
			var dtlList = [];
			for(var i=0; i<list.length; i++){
				if(list[i].itemID != ""){
					dtlList.push(list[i]);
				}
			}

			var errorRows = [];

				_.each(list, function(data){
					var qy = Number(data.qy);
					var chkQy = 0;

					// 比較対象はどの場合でも出荷伝票とする #20150325 UAT-0280
					chkQy = Number(data.out_qy);
					//if(Number(head.dlvwapDispTypeID) == amcm_type.AMCM_VAL_DISP_DLV_ROUTE_TRANSFER
					//		|| Number(head.dlvwapDispTypeID) == amcm_type.AMCM_VAL_DISP_DLV_ROUTE_DC){
					//	//移動伝票なら出荷伝票と比較
					//	chkQy = Number(data.out_qy);
					//}
					//else{
					//	//仕入伝票ならもとの点数と比較
					//	chkQy = Number(data.origQy);
					//}


					if (qy != "" && chkQy != "") {
						if (qy > chkQy) {
							//増納
							errorRows.push({
								no: data.rowId,
								column: 'qy',
								selector: '#ca_qy',
								level: 'error',
								msg: clutil.fmt(clmsg.EDL0012, data.janCode, chkQy, data.qy)
							});
						} else if (qy < chkQy) {
							//欠品
							errorRows.push({
								no: data.rowId,
								column: 'qy',
								selector: '#ca_qy',
								level: 'alert',
								msg: clutil.fmt(clmsg.WDL0002, data.janCode, chkQy, data.qy)
							});
						}

					}
					else if (qy == 0 && chkQy != 0) {
						//欠品
						errorRows.push({
							no: data.rowId,
							column: 'qy',
							selector: '#ca_qy',
							level: 'alert',
							msg: clutil.fmt(clmsg.WDL0002, data.janCode, chkQy, data.qy)
						});
					}



//
//
//					if (data.qy > data.origQy) {
//						errorRows.push({
//							no: data.rowId,
//							column: 'qy',
//							selector: '#ca_qy',
//							level: 'error',
//							msg: clutil.fmt(clmsg.EDL0012, data.janCode, data.origQy, data.qy)
//						});
//					} else if (data.qy < data.origQy) {
//						errorRows.push({
//							no: data.rowId,
//							column: 'qy',
//							selector: '#ca_qy',
//							level: 'alert',
//							msg: clutil.fmt(clmsg.WDL0002, data.janCode, data.origQy, data.qy)
//						});
//					}
				});
//			}

//			if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				_.each(errorRows, function(row){
					if (row.level !== 'alert') return;
					f_warn = true;
					var $input = this.$('#' + row.no + ' ' + row.selector);
					this.validator.setErrorMsg($input, row.msg, row.level);
				}, this);
//			}

//			if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				_.each(errorRows, function(row){
					if (row.level !== 'error') return;
					f_error = true;
					var $input = this.$('#' + row.no + ' ' + row.selector);
					this.validator.setErrorMsg($input, row.msg, row.level);
				}, this);
//			}

			if (f_error) {
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return;
			}

			var AMDLV0060UpdReq = {
				slip: head,
//				slipItemList : list
				slipItemList : dtlList
			};

			var reqObj = {
					reqHead : reqHead,
					AMDLV0060UpdReq  : AMDLV0060UpdReq
			};

			var req = {
				resId : clcom.pageId,
				data: reqObj
			};

			if (f_warn) {
				req.confirm = clutil.opeTypeIdtoString(this.options.opeTypeId) + 'を強制実行します。よろしいですか？';
			}

			return req;
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onStoreSelClick: function(e) {
			var unit = null;
			var _this = this;
			var options = {
				org_id: unit,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_kind_set: [
					am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
		            am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ
				],
			};

			_this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onCenterSelClick: function(e) {
			var _this = this;
			var options = {
				org_kind_set: [
					am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER
				],
				f_ignore_perm: 1
			};

			_this.AMPAV0010Selector1.show(null, null, options);
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			//console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

//			if (pgIndex){
			if (pgIndex == null){
			} else {
				this.validator.clear();

				var data = _.deepClone(this.options.chkData[pgIndex]);
				data.dlvState = clutil.gettypename(amcm_type.AMCM_TYPE_DLV_STAT, data.dlvStateID);
				data.dlvwapDispTypeID = this.changeDlvwapDisp(data);
				this.data2views(data);
			}
			var head = clutil.view2data(this.$('#ca_srchArea'));
			head.store = head._view2data_store_cn;
			head.vendor = head._view2data_vendor_cn;
			head.center = this.centerField.getAttrs();
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},
				// 明細検索リクエスト
				AMDLV0060GetReq: {
					srchDlvwapDispTypeID : head.dlvwapDispTypeID,
//					srchRecInspectDate : head.recInspectDate,
					srchRecInspectDate : 0,
					srchShipNo : head.shipNo,
					srchStoreID : head.store,
					srchDlvStateID : head.dlvStateID,
//					srchSenderTypeID : head.senderTypeID,
					srchVendor : head.vendor,
					srchOrg : head.center
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMDLV0060UpdReq: {
				}
			};

			var chkData = this.options.chkData[pgIndex];
			if (chkData){
				if (chkData.dlvStateID === amcm_type.AMCM_VAL_DLV_STAT_DELIVERED){
					getReq.AMDLV0060GetReq.srchRecInspectDate = chkData.recInspectDate;
					getReq.AMDLV0060GetReq.srchShipDate = 0;
				} else {
					getReq.AMDLV0060GetReq.srchRecInspectDate = 0;
					getReq.AMDLV0060GetReq.srchShipDate = chkData.shipDate;
				}
			}

			return {
				resId: clcom.pageId,    //'AMDLV0060',
				data: getReq
			};
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedIds){
//			this.clearTable();
//			this.makeDefaultTable();

			// validation
//			this.validator.clear();
//			var deliverNo = this.$('#ca_deliverNo').val();
//			if(deliverNo.length < 6){
//				this.validator.setErrorHeader(clmsg.cl_deliverNo_length_min);
//				this.validator.setErrorMsg(deliverNo, clmsg.cl_deliverNo_length_min);
//				return null;
//			}

			var defer = clutil.postJSON('AMDLV0060', srchReq.data).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMDLV0060GetRsp.slipItemList;
				if(_.isEmpty(recs)){
					// 検索ペインを表示？
//					mainView.srchAreaCtrl.show_srch();

					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

					this.hideResultArea();
					return;
				}
				var getRsp = data.AMDLV0060GetRsp;
				this.data2view(getRsp);
				_.each(getRsp.slipItemList, function(data){
					data.rowId = _.uniqueId('r');
				});

				this.showResultArea();

				clutil.viewReadonly(this.$('#div_store'));
				clutil.viewReadonly(this.$('#div_dlvwapDispTypeID'));
				clutil.viewReadonly(this.$('#div_vendor'));
				clutil.viewReadonly(this.$('#div_center'));
				clutil.viewReadonly(this.$('#div_shipNo'));
				clutil.viewReadonly(this.$('#div_srch'));
				this.mdBaseView.setSubmitEnable(true);

				// リクエストを保存。
				this.savedReq = srchReq;

				this.viewSeed = getRsp;

				// 結果ペインを表示
//				this.srchAreaCtrl.show_result();

				// 内容物がある場合 --> 結果表示する。
//				this.recListView.setRecs(recs);
				this.tableSetRecs(getRsp);
				var $input = this.$("#ca_table_tbody").find('input[name="qy"]');
				$input.each(function(i){
					var dt = $(this).val();
					if(!_.isEmpty(dt)){
						clutil.setFocus($(this));
					}
				});
				mainView.setFocus();

				this._onDlvTypeChanged();

				// 初期選択の設定（オプション）
//				if(!_.isEmpty(selectedIds)){
//					this.recListView.setSelectById(selectedIds, true);
//				}

//				this.resetFocus();
			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 検索ペインを表示
//				mainView.srchAreaCtrl.show_srch();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

//				this.resetFocus();

			}, this));

			return defer;
		},

		// 空更新チェックデータをつくる
		_buildSubmitCheckDataFunction: function(arg){
//			rg: {
//				index: toIndex,                // 複数レコード選択編集時におけるインデックス番号
//				resId: req.resId,            // リソースId -- "XXXXV0010" など
//				data: clutil.dclone(data)    // GETの応答データ（共通ヘッダも含む）
//			};

			var appRec = arg.data.AMDLV0060GetRsp;
			// TODO: 空更新チェック対象外のフィールドを削っていく。

			return appRec;
		},

		showResultArea: function(){
			$('#ca_srchArea2').show();
			$('#result').show();
		},

		hideResultArea: function(){
			$('#ca_srchArea2').hide();
			$('#result').hide();
		},

		_eof: 'AMDLV0060.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////

		if(clcom.pageArgs){
			_.each(clcom.pageArgs.chkData, function(data){
				data.center = data.srchOrg;
				data.vendor = data.srchVendor;
			});
		}

		// 一覧画面からの引継データ pageArgs があれば渡す。
		//	pageArgs: {
		//		// 処理区分
		//		opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL,
		//		// 一覧画面で選択されたアイテム要素の配列
		//		chkData: [
		//			{id:1,code:'code-001',name:'item-001',},
		//			{id:2,code:'code-002',name:'item-002',},
		//			{id:3,code:'code-003',name:'item-003',}
		//		]
		//	};
		mainView = new MainView(clcom.pageArgs).initUIElement().render();
		mainView.setFocus();
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
