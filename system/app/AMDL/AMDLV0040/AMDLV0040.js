useSelectpicker2();

clutil.Validators.checkJan = function(){
	if (this.$el.val() && this.$el.hasClass('janNG')){
		return clmsg.ECM0030;
	}
};
$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
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
			'click #ca_btn_store'			: '_onOutStoreSelClick',	// 店舗選択補助画面起動
			"click #ca_srch"		: "_onSrch",			// 明細表示ボタンが押下された
			"click #ca_table .btn-delete"	: "_onDeleteLineClick",
			//"click #ca_table tfoot tr:first span:first" : "_onAddLineClick",
			"click #ca_addLine" : "_onAddLineClick",
//			"input #ca_janCode"		: "_onJanCodeChanged",
			'change #ca_deliverNo'	: '_onDeliverNoChanged',
			'change #ca_table input[name="janCode"]'	: '_onJanCodeChanged',
			"change #ca_qy"			: "_onQyChange",
//			'change #ca_slipTypeID': 'dispSlipType'
			'change #ca_slipTypeID': '_onSlipTypeChange'
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
					title: '仕入／移動検収',
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
			this.ca_commentAreaValidator = clutil.validator(this.$('#ca_commentArea'), {
				echoback : $eb
			});

			this.requireController = new RequireController(this);

			// TODO: アプリ個別の View や部品をインスタンス化する

			// ヘッダパネル
/*
			var type = clcom.userInfo.user_typeid;
			if (type == amcm_type.AMCM_VAL_USER_STORE){
				// 店舗
				var id = clcom.userInfo.org_id;
				var code = clcom.userInfo.org_code;
				var name = clcom.userInfo.org_name;
				var store = code + ":" + name;
				$("#ca_store").val(store);
				$("#ca_store").data('cl_store_item', {
					id: id,
					code: code,
					name: name
				});
				srchStoreID = {
					id: id,
					code: code,
					name: name
				};
				this.$("#ca_store").attr("readonly", true);
				this.$("#ca_btn_store_select").attr("disabled", true);
			} else {
				$("#ca_store").val("");
				srchStoreID = {
					id: 0,
					code: null,
					name: null
				};
			}
*/
			//店舗オートコンプリート
			var unit = null;
			this.srcStoreIdField = clutil.clorgcode({
				el: $("#ca_store"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
				}
			});

			// 担当者取得
			clutil.clstaffcode2($("#ca_staff"));
/*
			if(fixopt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
				clutil.clstaffcode($("#ca_staff"));
			} else {
				clutil.clstaffcode2($("#ca_staff"));
			}
*/

			// 伝票区分
			clutil.cltypeselector(this.$("#ca_slipTypeID"), amcm_type.AMCM_TYPE_SLIP_FORMAT);

			// メーカー取得
			clutil.clvendorcode(this.$('#ca_vendor'), {
				getStoreId: function() {
					var item = $("#ca_store").autocomplete('clAutocompleteItem');
					if (item != null) {
						return item.id;
					} else {
						return 0;
					}
				},
				getVendorTypeId: _.bind(function(){
					return amdb_defs.MTTYPE_F_VENDOR_MAKER;   // メーカー
				}, this),
			});

			// datepicker
			// 検収日
//			clutil.datepicker(this.$('#ca_recInspectDate'));
			this.$('#ca_recInspectDate').val(clutil.dateFormat(clcom.getOpeDate(),"yyyy/mm/dd(w)"));

			// グループID -- AMDLV0040 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDLV0040';

			// Fieldlimit
//			clutil.cltxtFieldLimit(this.$('#ca_deliverNo'));

			this.dispSlipType();

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
				// 新規登録以外は、Submit と、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			//フィールドカウント
//			clutil.cltxtFieldLimit($("#ca_deliverNo"));
			clutil.cltxtFieldLimit($("#ca_comment"));
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var mainView = this;
			this.mdBaseView.initUIElement();

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				// 組織表示
				this.$('#ca_store').autocomplete('clAutocompleteItem', {
					id: clcom.userInfo.org_id,
					code: clcom.userInfo.org_code,
					name: clcom.userInfo.org_name
				});
				// 店舗ユーザー
				clutil.inputReadonly($("#ca_store"));
				clutil.inputReadonly($("#ca_btn_store_select"));
			}

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
					mainView.srcStoreIdField.setValue(data[0]);
					mainView.setFocus();
				}
				_.defer(function(){									// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store_select")); 	// 参照ボタンへあてなおす
				});
			};
			this.AMPAV0010Selector1.clear = function() {
			};

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
					mainView.storeAutocomplete.setValue(data[0]);
					mainView.setFocus();
				}
				_.defer(function(){							// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store")); 	// 参照ボタンへあてなおす
				});
			};
			// 店舗オートコンプリート
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				this.storeAutocomplete = clutil.clorgcode( {
					el : '#ca_outStore',
					dependAttrs : {
						p_org_id: clcom.userInfo.unit_id,
						orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
						org_typeid_list: [
								amcm_type.AMCM_VAL_ORG_KIND_STORE,
								amcm_type.AMCM_VAL_ORG_KIND_CENTER,
								amcm_type.AMCM_VAL_ORG_KIND_HQ
						],
						f_stockmng: 1, //在庫管理有無フラグ(1:在庫有り店舗のみ)
						f_ignore_perm: 1
					}
				});
			} else {
				this.storeAutocomplete = clutil.clorgcode( {
					el : '#ca_outStore',
					dependAttrs : {
//						p_org_id: clcom.userInfo.unit_id,
						orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
						org_typeid_list: [
											amcm_type.AMCM_VAL_ORG_KIND_STORE,
											amcm_type.AMCM_VAL_ORG_KIND_CENTER,
											amcm_type.AMCM_VAL_ORG_KIND_HQ
									],
					    f_stockmng: 1, //在庫管理有無フラグ(1:在庫有り店舗のみ)
					    f_ignore_perm: 1
					}
			    });
				}
			$("#pa_deliverNo").hide();

			// TODO: アプリ個別の View や部品を初期化（選択部品の選択肢を投入するなど）する
			// 初期のアコーディオン展開状態をつくるなど？？。
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

//		/**
//		 * JANコード入力時に関連情報表示
//		 */
//		changeJanCodeTable: function(e){
//			var $target = $(e.target);
//			var $tbody = this.$("#ca_table_tbody");
//			$tmpl = this.$("#ca_tbody_template");
//
//			for (var i = 0; i < 9; i++){
//				var obj = {
//					editable:true,
//					canAdd:true,
//					disChk:false,
//					disEdit:false
//				};
//				var $tr = $tmpl.tmpl(obj);
//				var jancdInputView = clutil.cljancode($tr.find('#ca_janCode'));
//				jancdInputView.on('_onJanCodeChanged', function(item, from, e){
//					var $tr = $(e.target).closest('tr');
//					// 品種
//					$tr.find('#ca_stdItgrpName').text(item.variety.name);
//					// メーカーコード
//					$tr.find('#ca_makerCode').text(item.maker.code);
//					// メーカー品番
//					// 商品名
//					$tr.find('#ca_itemName').text(item.item.name);
//					// カラー
//					// サイズ
//					// 単価（円）
//					// 商品ID
////					$tr.find('#ca_itemID').text(item.item.id);
//				});
//			}
//			clutil.initUIelement(this.$el);
//			return this;
//		},

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

//			$.each(getRsp.slipItemList, function(){
//			});
//			$tmpl.tmpl(getRsp.slipItemList).appendTo($tbody);

			var list = getRsp.slipItemList;
			list.sort(function(obj1, obj2){
				var no1 = (obj1.no == null) ? -2147483648 : obj1.no;
				var no2 = (obj2.no == null) ? -2147483648 : obj2.no;
				return no1 - no2;
			});

			// 空白行を考慮したリストを作成
			var dtlList = [];
			var cn = 1;
			for(var i=0; i<list.length; cn++){
				if(list[i].no < cn){
					break;
				}
				if(list[i].no == cn){
					dtlList.push(list[i]);
					i++;
				} else {
					var obj = {
						no: cn
					};
					dtlList.push(obj);
					continue;
				}
			}
			$.each(dtlList, function(){
			});
			var slipTypeID = $("#ca_slipTypeID").val();
			if (slipTypeID == amcm_type.AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT6) {
				var len = dtlList.length;
				for (var i = len; i < 9; i++) {
					var obj = {
							editable:true,
							canAdd:true,
							disChk:false,
							disEdit:false,
							no: i+1,
					};
					dtlList.push(obj);
				}
			}
			$tmpl.tmpl(dtlList).appendTo($tbody);
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
*/
			this._reNum();
			this.calc_qty_amt_total();
			clutil.initUIelement(this.$el);
/**/
			return this;
		},

		/**
		 * 階層レベル振り直し
		 */
		_reNum : function(){
			var $input = this.$("#ca_table_tbody").find('input[name="no"]');
			$input.each(function(i){
				$(this).val(i + 1);
			});
// ダミーデータ設定
/*
			this.$("#ca_table_tbody tr").find('#ca_stdItgrpName').each(function(i){
				$(this).val('品種'+i);
			});
			this.$("#ca_table_tbody tr").find('#ca_vendorCode').each(function(i){
				$(this).val('V_CODE'+i);
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
			this.$("#ca_table_tbody tr").find('#ca_unitPrice').each(function(i){
				$(this).val(i * 10 + 1);
			});
*/
// ダミーデータ設定
			this.calc_qty_amt_total();
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
			// 伝票番号が6桁以外の場合は行の追加削除は不可
			var deliverNoLen = this.$('#ca_deliverNo').val().length;
			if (deliverNoLen != 6) {
				return;
			}
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');
			$tr.find("#ca_janCode").val('');
			// 品種
			$tr.find('#ca_stditgrpName').val('');
			// メーカーコード
			$tr.find('#ca_vendorCode').val('');
			// メーカー品番
			$tr.find('#ca_makerCode').val('');
			// 商品名
			$tr.find('#ca_itemName').val('');
			// カラー
			$tr.find('#ca_colorName').val('');
			// サイズ
			$tr.find('#ca_sizeName').val('');
//			// 単価（円）
//			$tr.find('#ca_unitPrice').val('');
			// 商品ID
			$tr.find('#ca_itemID').val('');
			$tr.find('#ca_qy').val('');

			//$tr.remove();

//			$(e.target).parent().parent().remove();
//			var $tbody = this.$("#ca_table_tbody");
//			var $tmpl = $("#ca_tbody_template");
//			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
//			$tmpl.tmpl(addObj).appendTo($tbody);
//			this._reNum();
			this.calc_qty_amt_total();
		},

		/**
		 * 行追加処理(tfoot)
		 */
		_onAddLineClick : function() {
			var ope_mode = this.options.opeTypeId;
			if (ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
					|| ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					|| ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			// 伝票番号が6桁以外の場合は行の追加削除は不可
			var deliverNoLen = this.$('#ca_deliverNo').val().length;
			if (deliverNoLen != 6) {
				return;
			}

			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = $("#ca_tbody_template");
			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
			$tmpl.tmpl(addObj).appendTo($tbody);
//			this._reNum();
			var sno = 1;
			var $input = this.$("#ca_table_tbody").find('input[name="no"]');
			$input.each(function(i){
				if($(this).val() == "") {
					$(this).val(sno);
				} else {
					sno = $(this).val();
					sno++;
				}
			});
			clutil.initUIelement(this.$el);

			return this;
		},

		/**
		 * 伝票番号変更イベント
		 */
		_onDeliverNoChanged: function(e) {
			var deliverNoLen = this.$('#ca_deliverNo').val().length;
/*
			switch(deliverNoLen){
			case 6:
				this.$("#ca_slipType").val(clutil.gettypename(amcm_type.AMCM_TYPE_SLIP_FORMAT, amcm_type.AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT6));
				this.$("#ca_slipTypeID").val(amcm_type.AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT6);
				break;
			case 7:
				this.$("#ca_slipType").val(clutil.gettypename(amcm_type.AMCM_TYPE_SLIP_FORMAT, amcm_type.AMCM_VAL_SLIP_FORMAT_TRANS));
				this.$("#ca_slipTypeID").val(amcm_type.AMCM_VAL_SLIP_FORMAT_TRANS);
				break;
			case 8:
				this.$("#ca_slipType").val(clutil.gettypename(amcm_type.AMCM_TYPE_SLIP_FORMAT, amcm_type.AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT8));
				this.$("#ca_slipTypeID").val(amcm_type.AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT8);
				break;
			default:
				this.$("#ca_slipTypeID").val(0);
				break;
			}
*/
			this.dispSlipType(deliverNoLen);
		},

		/**
		 * JANコード変更イベント
		 */
		_onJanCodeChanged: function(e) {
			$(e.target).removeClass('janNG');
			// JanCode 検索する。検索結果は、_onCLjancode_srchCompleted() 関数で設定。
			var janCodeSrchReq = {
				janCode: $(e.target).val(),
				srchYmd: clcom.getOpeDate(),
				completed: this._onCLjancode_srchCompleted
			};
			clutil.cljancode(janCodeSrchReq, e);
		},
		// JANコード入力時に関連情報表示
		_onCLjancode_srchCompleted: function(result, e){
			var $tr = $(e.target).closest('tr');
			if(result.status == 'OK'){
				$tr.find('#ca_janCode').removeClass('janNG');
				// JanCode が見つかった ⇒ 値を表示
				var item = result.data.rec;
				// 品種
				$tr.find('#ca_stditgrpName').val(item.variety.name);
				// メーカーコード
				$tr.find('#ca_vendorCode').val(item.maker.code);
				// メーカー品番
				$tr.find('#ca_makerCode').val(item.makerItemCode);
				// 商品名
				$tr.find('#ca_itemName').val(item.item.name);
				// カラー
				$tr.find('#ca_colorName').val(item.color.name);
				// サイズ
				$tr.find('#ca_sizeName').val(item.size.name);
//				// 単価（円）
//				$tr.find('#ca_unitPrice').val(item.cost);
				// 商品ID
				$tr.find('#ca_itemID').val(item.colorSizeItemID);
				$('.errorInside').hide();
			}else{
				$tr.find('#ca_janCode').addClass('janNG');
				_.defer(_.bind(function(){
					this.validator.setErrorMsg($tr.find('#ca_janCode'),
											   clmsg.ECM0030);
				}, this));
				// JanCode が見つからない ⇒ クリアする
				// 品種
				$tr.find('#ca_stditgrpName').val('');
				// メーカーコード
				$tr.find('#ca_vendorCode').val('');
				// メーカー品番
				$tr.find('#ca_makerCode').val('');
				// 商品名
				$tr.find('#ca_itemName').val('');
				// カラー
				$tr.find('#ca_colorName').val('');
				// サイズ
				$tr.find('#ca_sizeName').val('');
//				// 単価（円）
//				$tr.find('#ca_unitPrice').val('');
				// 商品ID
				$tr.find('#ca_itemID').val('');
				this.validator.setErrorMsg($(e.target), 'メーカーに対応するＪＡＮコードを入力して下さい。');
			}
		},

		/**
		 * 伝票区分変更イベント
		 */
		_onSlipTypeChange: function() {

			this.$("#ca_deliverNo").val('');
			this.dispSlipType(0);
		},

		/**
		 * 点数変更イベント
		 */
		_onQyChange: function(event, ui) {
			var $target = $(event.target);
			$('.errorInside').hide();

			this.calc_qty_amt_total();
		},

		/**
		 * 合計再計算
		 */
		calc_qty_amt_total : function() {
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
		 * 伝票番号チェック
		 */
		isValidDeliverNo: function() {
			var no = this.$("#ca_deliverNo").val();
			if (no == "000000" || no == "0000000" || no == "00000000") {
				this.srchAreaValidator.setErrorMsg($("#ca_deliverNo"), "入力された伝票番号は不正です。");
				return false;
			} else {
				return true;
			}
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			// validation
			this.validator.clear();
			if(!this.srchAreaValidator.valid()) {
				return;
			}
			if (!this.isValidDeliverNo()) {
				this.srchAreaValidator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return;
			}
			var req = this._buildGetReqFunction();

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
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				document.location = '#';
				clutil.viewReadonly(this.$el);
				$("#ca_table .btn-delete").hide();
				$("#ca_addLine").hide();
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

				if(args.data.rspHead.message == "WDL0001" || args.data.rspHead.message == "WDL0002"){

					var confmsg = clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args);
//					if(args.data.rspHead.message == "WDL0001"){
//						conf = clmsg.WDL0001;
//					} else {
//						conf = clmsg.WDL0002;
//					}

					var rec = clutil.view2data(this.$el);
					var reqHead = {
							opeTypeId : this.options.opeTypeId,
					};

					var head = clutil.view2data(this.$('#ca_srchArea'));
					var staff = clutil.view2data(this.$('#ca_srchArea2'));
					head.store = head._view2data_store_cn;
					head.staff = staff._view2data_staff_cn;
					head.vendor = head._view2data_vendor_cn;
					head.outStore = head._view2data_outStore_cn;
					head.slipTypeID = $("#ca_slipTypeID").val();
					head.sumQy = $("#ca_sumQy").text();
					head.comment = $("#ca_comment").val();
					delete head.opeTypeID;
					var list = clutil.tableview2data(this.$('#ca_table_tbody').children());

					var AMDLV0040UpdReq = {
						slip: head,
						slipItemList : list
					};

					var reqObj = {
							reqHead : reqHead,
							AMDLV0040UpdReq  : AMDLV0040UpdReq
					};

					var send = {
						    resId: clcom.pageId,
						    data: reqObj,
						    confirm: confmsg
					};
					this.mdBaseView.forceSubmit(send);
				} else {
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
						prefix: 'ca_'
					});
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				}
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			this.showResultArea();
			switch(args.status){
			case 'OK':
				// TODO: args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				var getRsp = data.AMDLV0040GetRsp;
				this.viewSeed = getRsp;
				_.each(getRsp.slipItemList, function(data){
					data.rowId = _.uniqueId('r');
				});
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					var rec = getRsp.slip;
					rec.staff = {
						id: 0,
						code: "",
						name: ""
					};
				}
				this.data2view(getRsp);
				clutil.viewRemoveReadonly(this.$el);
				$("#ca_table .btn-delete").show();
				$("#ca_addLine").show();

				if (getRsp.slip.deliverID == 0 && getRsp.slip.transID == 0) {
					$("#ca_recInspectDate").val("");
				}

				var deliverNoLen = this.$('#ca_deliverNo').val().length;
				this.dispSlipType(deliverNoLen);

				if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
					clutil.viewReadonly(this.$('#ca_srchArea'));
				}

				// 内容物がある場合 --> 結果表示する。
				this.tableSetRecs(getRsp);
				var $input = this.$("#ca_table_tbody").find('input[name="qy"]');
				$input.each(function(i){
					var dt = $(this).val();
					if(!_.isEmpty(dt)){
						clutil.setFocus($(this));
					}
				});

				var slipTypeID = $("#ca_slipTypeID").val();
				if (slipTypeID != amcm_type.AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT6) {
					var tgts = $('#ca_table_tbody input[name="janCode"]');
					_.each(tgts, _.bind(function(t) {
						var $tgt = $(t);
						clutil.inputReadonly($tgt);
					}, this));
					$("#ca_table .btn-delete").hide();
					$("#ca_addLine").hide();
				}

				mainView.setFocus();
				mainView.validator.clearErrorMsg($('#ca_staff'));

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
				var getRsp = args.data.AMDLV0040GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp);
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
				mainView.validator.clearErrorMsg($('#ca_staff'));
				clutil.viewReadonly(this.$el);
				$("#ca_table .btn-delete").hide();
				$("#ca_addLine").hide();
				break;
			case 'DELETED':        // 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？                        【確認】
				// 全 <input> は readonly 化するなどの処理。
				var getRsp = args.data.AMDLV0040GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
//				clutil.data2view(this.$el, getRsp);
				this.data2view(getRsp);
				clutil.viewReadonly(this.$el);
				break;
			case 'CONFLICT':    // ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				var getRsp = args.data.AMDLV0040GetRsp;
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
			rec.store = {
				id: rec.store.id,
				code: rec.store.code,
				name: rec.store.name,
			};
			rec.vendor = {
				id: rec.vendor.id,
				code: rec.vendor.code,
				name: rec.vendor.name,
			};
			rec.outStore = {
				id: rec.outStore.id,
				code: rec.outStore.code,
				name: rec.outStore.name,
			};
			rec.staff = {
					id: rec.staff.id,
					code: rec.staff.code,
					name: rec.staff.name,
				};
			clutil.data2view(this.$('#ca_srchArea'), rec);
			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				clutil.data2view(this.$('#ca_srchArea2'), rec);
			}
			clutil.data2view(this.$('#ca_commentArea'), rec);
		},

		/**
		 * 伝票区分表示
		 */
		dispSlipType: function() {
			$("#pa_deliverNo").hide();
			var dlvType = parseInt(this.$("#ca_slipTypeID").val(), 10);
			var dlvNo = this.$("#ca_deliverNo").val();
			var maxLen = 0;
			if(dlvType === amcm_type.AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT6 ||
					 dlvType === amcm_type.AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT8){
				this.$("#ca_outStore").val("");
				this.$("#ca_outStore").data('cl_store_item', "");
				this.$("#ca_btn_store").attr("disabled", true);
				this.$("#ca_deliverNo").attr("disabled", false);

				this.requireController.toggleRequired(
					this.$("#ca_vendor"), true, true);
				this.requireController.toggleRequired(
					this.$("#ca_outStore"), false, true);
				$("#pa_deliverNo").show();
				maxLen = (dlvType === amcm_type.AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT6) ? 6 : 8;
			}else if(dlvType === amcm_type.AMCM_VAL_SLIP_FORMAT_TRANS) {
				this.$("#ca_vendor").val("");
				this.$("#ca_vendor").data('cl_store_item', "");
				this.$("#ca_btn_store").attr("disabled", false);
				this.$("#ca_deliverNo").attr("disabled", false);

				this.requireController.toggleRequired(
					this.$("#ca_vendor"), false, true);
				this.requireController.toggleRequired(
					this.$("#ca_outStore"), true, true);

				$("#pa_deliverNo").show();
				maxLen = 7;
			}else{
				this.$("#ca_vendor").val("");
				this.$("#ca_vendor").data('cl_store_item', "");
				this.$("#ca_btn_store").attr("disabled", true);
				this.$("#ca_deliverNo").attr("disabled", true);

				this.requireController.toggleRequired(
					this.$("#ca_vendor"), false, true)
					.show(this.$("#ca_vendor"));
				this.requireController.toggleRequired(
					this.$("#ca_outStore"), false, true);
				$("#pa_deliverNo").hide();
			}
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				if(maxLen > 0){
					this.$("#ca_deliverNo")
						.attr('data-tflimit', clutil.fmt('{0}', maxLen))
						.attr('data-validator', clutil.fmt('len:{0},{0} numeric', maxLen));
				}
				clutil.cltxtFieldLimit(this.$("#ca_deliverNo"), null, maxLen);
			}
		},

		setAutocompleteData : function ($input, id, code, name) {
			var data = {
				id: id,
				code: code,
				name: name
			};
			var view = (code == "") ? name : code + ":" + name;
			$input.val(view);
			$input.attr("cs_id", id);
			$input.attr("cs_code", code);
			$input.attr("cs_name", name);
			$input.data("cl_codeinput_item", data);
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				// TODO: アプリ個別の render をする。
				this.makeDefaultTable();
				this._reNum();
				this.mdBaseView.setSubmitEnable(false);
			} else {
				// アラームからの引継データによる遷移
				 if(!_.isEmpty(this.options.data)){
					var cond = {
						deliverID : 0,
						tranInID : 0
//						firdtDeliverID : 0,
//						firstTranInID : 0
					};
					this.options.chkData[0] = cond;
					if (!_.isEmpty(clcom.pageArgs.data.vpDeliverID)) {
						this.options.chkData[0].deliverID = Number(clcom.pageArgs.data.vpDeliverID);
//						this.options.chkData[0].firdtDeliverID = Number(clcom.pageArgs.data.vpFirstDeliverID);
					}
					if (!_.isEmpty(clcom.pageArgs.data.vpTransInID)) {
						this.options.chkData[0].tranInID = Number(clcom.pageArgs.data.vpTransInID);
//						this.options.chkData[0].firstTranInID = Number(clcom.pageArgs.data.vpFirstTransInID);
					}
					this.mdBaseView.__getInternal(0, 0, 1, null);
					this.mdBaseView.setSubmitEnable(true);
					return this;
				}
				// 一覧画面からの引継データ pageArgs があれば渡す。
				var data = this.options.chkData[0];
//				var rec = data;
//				rec.vendor = {
//					id: rec.vendor.id,
//					code: rec.vendor.code,
//					name: rec.vendor.name,
//				};
//				rec.outStore = {
//					id: rec.outStore.id,
//					code: rec.outStore.code,
//					name: rec.outStore.name,
//				};
				$('#ca_deliverID').val(data.deliverID);
				$('#ca_transID').val(data.tranInID);
				$('#ca_firstDeliverID').val(data.firstDeliverID);
				$('#ca_firstTransID').val(data.firstTranInID);
				$('#ca_deliverNo').val(data.dlvNo);
				$('#ca_vendorOutID').val(data.vendorOutID);
				$('#ca_transOutID').val(data.tranOutID);
//				this.setAutocompleteData($("#ca_vendor"), data.vendor.id, data.vendor.code, data.vendor.name);
//				this.setAutocompleteData($("#ca_outStore"), data.outStore.id, data.outStore.code, data.outStore.name);

				this.mdBaseView.fetch();    // データを GET してくる。
				this.mdBaseView.setSubmitEnable(true);
			}
			return this;
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
//			clutil.focus({view: this.$('#ca_srchArea')});
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				//clutil.setFocus($('#ca_store'));
				//初期フォーカス
				var $tgt = null;
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					$tgt = $("#ca_slipTypeID");
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
			var f_warn = false;
			var chkData = this.options.chkData && this.options.chkData[pgIndex];

			var f_error = false;
			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			var updReq = {};
			$('#ca_tablewrap').find('.errorInside').remove();
			/*
			 * 無効化チェック
			 */
			if ($("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}
			/*
			 * 入力値チェック(削除時以外)
			 */
			if (this.options.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				// validation
				f_error = false;
				this.validator.clear();
				if(!this.srchAreaValidator.valid()) {
					f_error = true;
				}
				if(!this.srchArea2Validator.valid()) {
					f_error = true;
				}
				if(!this.ca_commentAreaValidator.valid()) {
					f_error = true;
				}

				if(f_error){
	                this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
					return null;
				}
			}
			/*
			 * 入力値チェック(削除時)
			 */
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				// validation
				f_error = false;
				this.validator.clear();
				if(!this.srchArea2Validator.valid()) {
					f_error = true;
				}

				if(f_error){
	                this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
					return null;
				}
			}
			var reqHead = {
					opeTypeId : this.options.opeTypeId
			};

			if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD &&
				chkData && chkData.dlvStateName === '入荷予定未検収'){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var head = clutil.view2data(this.$('#ca_srchArea'));
			var staff = clutil.view2data(this.$('#ca_srchArea2'));
			head.store = head._view2data_store_cn;
			head.staff = staff._view2data_staff_cn;
			head.vendor = head._view2data_vendor_cn;
			head.outStore = head._view2data_outStore_cn;
			head.slipTypeID = $("#ca_slipTypeID").val();
			head.sumQy = $("#ca_sumQy").text();
			head.comment = $("#ca_comment").val();
			if (this.viewSeed != null && this.viewSeed.slip != null) {
				head.orderDate = this.viewSeed.slip.orderDate;
			}
			if (head.slipTypeID == amcm_type.AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT6) {
				head.dlvwapTypeID = amcm_type.AMCM_VAL_DLV_ROUTE_DIRECT;
			}
			delete head.opeTypeID;

//			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY ||
//			   head.dlvTypeID == amcm_type.AMCM_VAL_DLV_STAT_DELIVERING){
//				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
//			}

			var list = clutil.tableview2data(this.$('#ca_table_tbody').children());

			var dlength = list.length;
			// 空白行は無視したリストを作成
	        var $tbody = this.$('#ca_table > tbody');   // <tbody> の要素を指定する。
			var trElems = $tbody.find('tr');

			for(var i=0; i<dlength; i++){
				var $tr = $(trElems.get(i));
				var inNo = $tr.find('input[name="no"]');
				var inItemID = $tr.find('input[name="itemID"]');
				var inQy = $tr.find('input[name="qy"]');
				var inJanCode = $tr.find('input[name="janCode"]');

				if(inJanCode.val() == "" && inQy.val() == ""){
					continue;
				}
				if(inItemID.val() == ""){
					this.validator.setErrorMsg(inJanCode, '正しいJANコードを入力してください。');
					f_error = true;
				}
				if(inJanCode.val() == ""){
					this.validator.setErrorMsg(inJanCode, 'JANコードは必ず入力してください。');
					f_error = true;
				}
				var chkQy = inQy.val().replace(",","").replace(",","");
				if(!chkQy.match(/^-?[0-9]+$/) || chkQy < 0 || chkQy > 9999999){
					this.validator.setErrorMsg(inQy, '整数で入力してください(7桁以内)');
					f_error = true;
				}
				if(inQy.val() == ""){
					this.validator.setErrorMsg(inQy, '点数は必ず入力してください。');
					f_error = true;
				}
/*
				for(var j=0; j<i; j++){
					var $tr = $(trElems.get(j));
					var bfNo = $tr.find('input[name="no"]');
					if(inNo.val() == bfNo.val()){
						this.validator.setErrorMsg(inNo, '重複しない行番号を入力してください。');
						f_error = true;
						break;
					}
				}
*/
			}
			if(f_error){
				$('#ca_tablewrap').prepend('<span class="errorInside">テーブル内にエラー箇所があります</span>');
                this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
    			$('.errorInside').show();
				return null;
			}

			if(this.options.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				var errorRows = [];
				_.each(list, function(data){
					var qy = Number(data.qy);
					var chkQy = 0;

					// 比較対象はどの場合でも出荷伝票とする #20150325 UAT-0280
					chkQy = Number(data.out_qy);

					//if(Number(head.slipTypeID) == amcm_type.AMCM_VAL_SLIP_FORMAT_TRANS){
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

				});

				_.each(errorRows, function(row){
					if (row.level !== 'alert') return;
					f_warn = true;
					var $input = this.$('#' + row.no + ' ' + row.selector);
					this.validator.setErrorMsg($input, row.msg, row.level);
				}, this);

				_.each(errorRows, function(row){
					if (row.level !== 'error') return;
					f_error = true;
					var $input = this.$('#' + row.no + ' ' + row.selector);
					this.validator.setErrorMsg($input, row.msg, row.level);
				}, this);
			}

			if (f_error) {
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return;
			}

			// 空白行は無視したリストを作成
			var dtlList = [];
			for(var i=0; i<list.length; i++){
				if(list[i].itemID != ""){
					dtlList.push(list[i]);
				}
			}
			if (this.options.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				// 伝票は9行以内
				if (dtlList.length > 9) {
					this.validator.setErrorInfo({_eb_: "伝票は9行以内で入力してください。"});
					return null;
				} else if(dtlList.length == 0){
					clutil.mediator.trigger('onTicker', clmsg.EDL0042);
					return null;
				}
			}

			var AMDLV0040UpdReq = {
				slip: head,
//				slipItemList : list
				slipItemList : dtlList
			};

			var reqObj = {
				reqHead : reqHead,
				AMDLV0040UpdReq  : AMDLV0040UpdReq
			};

			var req = {
				resId : clcom.pageId,
				data: reqObj
			};

			if (f_warn) {
				req.confirm = clutil.opeTypeIdtoString(this.options.opeTypeId) + 'を強制実行します。よろしいですか？';
			}

			if (chkData && chkData.shipNo &&
				this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				req.confirm = clmsg.WDL0003;
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
				f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
			};

			_this.AMPAV0010Selector1.show(null, null, options);
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onOutStoreSelClick: function(e) {
			var _this = this;
			var options = {
				org_kind_set: [
					am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
		            am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ
				],
			    f_ignore_perm: 1,
			    f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
			};

			_this.AMPAV0010Selector.show(null, null, options);
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			//console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
//			if (pgIndex){

			var head = clutil.view2data(this.$('#ca_srchArea'));
			if (pgIndex == null){
			} else {
				var data = this.options.chkData[pgIndex];
				$('#ca_deliverID').val(data.deliverID);
				$('#ca_transID').val(data.tranInID);
				$('#ca_firstDeliverID').val(data.firstDeliverID);
				$('#ca_firstTransID').val(data.firstTranInID);
				$('#ca_deliverNo').val(data.dlvNo);
				$('#ca_vendorOutID').val(data.vendorOutID);
				$('#ca_transOutID').val(data.tranOutID);
				this.setAutocompleteData($("#ca_vendor"), data.vendorID, '', '');
				this.setAutocompleteData($("#ca_outStore"), data.outStoreID, '', '');
				var rec = clutil.view2data(this.$('#ca_srchArea'));
				rec.vendor = data.vendorID;
				rec.outStore = data.outStoreID;
				rec.store = data.storeID;
				head = rec;
			}
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},
				// 明細検索リクエスト
				AMDLV0040GetReq: {
					srchDeliverID : head.deliverID,
					srchTransInID : head.transID,
					srchFirstDeliverID : head.firstDeliverID,
					srchFirstTransInID : head.firstTransID,
					srchVendorOutID : head.vendorOutID,
					srchTransOutID : head.transOutID,
					deliverNo : head.deliverNo,
					vendorID : head.vendor && head.vendor,
					outStoreID : head.outStore && head.outStore,
					storeID : head.store && head.store
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMDLV0040UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,    //'AMDLV0040',
				data: getReq
			};
		},

		//明細表示
		onSrchSuccess: function(data, srchReq){
			// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
			var recs = data.AMDLV0040GetRsp.slipItemList;
			if(_.isEmpty(recs)){
				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				this.hideResultArea();
				return;
			}
			var getRsp = data.AMDLV0040GetRsp;
			var srchStore = clutil.view2data($('#ca_storeArea'));

			//入荷店が違ったら
			if(getRsp.slip.store.id != srchStore.store){
				clutil.mediator.trigger('onTicker', clmsg.EDL0026);
				this.hideResultArea();
				return;
			}

			_.each(getRsp.slipItemList, function(data){
				data.rowId = _.uniqueId('r');
			});
			this.data2view(getRsp);
			this.showResultArea();
			this.dispSlipType();

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
			var slipTypeID = $("#ca_slipTypeID").val();

			//				this.resetFocus();
			if (data.AMDLV0040GetRsp.slip.shipNo.length > 0 &&
					slipTypeID == amcm_type.AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT6){
				this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;
				clutil.viewReadonly(this.$el);
				// 行削除[×]ボタン、行追加[＋]ボタンを削除する
//				this.$('#ca_table')
//					.find('.delrow').remove().end()
//					.find('tfoot').remove();
			} else {
				if (slipTypeID != amcm_type.AMCM_VAL_SLIP_FORMAT_DLV_CDDIGIT6) {
					var tgts = $('#ca_table_tbody input[name="janCode"]');
					_.each(tgts, _.bind(function(t) {
						var $tgt = $(t);
						clutil.inputReadonly($tgt);
					}, this));
					$("#ca_table .btn-delete").hide();
					$("#ca_addLine").hide();
				}
				clutil.viewReadonly(this.$('#ca_srchArea'));
				this.mdBaseView.setSubmitEnable(true);
			}

		},

		onSrchSuccess2: function(data, srchReq){
			var getRsp = data.AMDLV0040GetRsp;
			var recs = getRsp && getRsp.slipItemList;

			// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
			if(_.isEmpty(recs) &&
			   srchReq.data.AMDLV0040GetReq.deliverNo.length !== 6){
				// 検索ペインを表示？
				//					mainView.srchAreaCtrl.show_srch();

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				if (data.rspHead.status) {
					clutil.mediator.trigger('onTicker', data);
				} else {
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				}

				this.hideResultArea();
				return;
			}

			// this.data2view(getRsp);
			this.showResultArea();
			this.dispSlipType();
			clutil.viewReadonly(this.$('#ca_srchArea'));
			this.mdBaseView.setSubmitEnable(true);

			// リクエストを保存。
			this.savedReq = srchReq;

			//デフォルト空行5行分表示
			this.$("#ca_table_tbody").empty();
			for(var i=0; i<9; i++){
				this._onAddLineClick();
			}
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedIds){

			var defer = clutil.postJSON('AMDLV0040', srchReq.data)
					.done(_.bind(function(data){
						//成功
						this.onSrchSuccess(data, srchReq);
					}, this))
					.fail(_.bind(function(data){
						//失敗
						this.onSrchSuccess2(data, srchReq);
					}, this));

			return defer;
		},

		// 空更新チェックデータをつくる
		_buildSubmitCheckDataFunction: function(arg){
			var appRec = arg.data.AMDLV0040GetRsp;
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
			this.setFocus();
		},

		_eof: 'AMDLV0040.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////
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
