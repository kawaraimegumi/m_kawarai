/**
 * 返品／移動削除登録
 */
useSelectpicker2();

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
			'click #ca_btn_store'	: '_onInStoreSelClick',		// 店舗選択補助画面起動
			"click #ca_table .btn-delete" : "_onDeleteLineClick",
			//"click #ca_table tfoot tr:first span:first" : "_onAddLineClick",
			"click #ca_addLine" : "_onAddLineClick",
			"change #ca_dlvTypeID"		: "_onDlvTypeChanged",
//			"input #ca_janCode"		: "_onJanCodeChanged",
			'change #ca_table input[name="janCode"]'	: '_onJanCodeChanged',
			'click #ca_btn_store_select'	: '_onStoreSelClick',	// 店舗選択
			'input #ca_store'	: '_onStoreChange',	// 店舗変更
			"change #ca_qy" :   "_onQyChange"
		},

		/**
		 * initialize関数
		 */
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
					title: '返品／移動出荷',
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
					buildSubmitCheckDataFunction: this._buildSubmitCheckDataFunction,
					// 「一覧へ戻る」ボタンアクション
					btn_cancel: this.btnCancelAction
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// validatorエラー時の表示領域
			var $eb = $('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $eb
			});
			this.srchAreaValidator = clutil.validator(this.$('#ca_srchArea2'), {
				echoback : $eb
			});
			this.ca_commentAreaValidator = clutil.validator(this.$('#ca_commentArea'), {
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
			var store = code + ":" + name;
			if(clcom.userInfo.org_kind_typeid != Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID'))) {
				$("#ca_store").val(store);
				$("#ca_store").data('cl_store_item', {
					id: id,
					code: code,
					name: name
				});
			}
*/
			// 担当者
			clutil.clstaffcode2($("#ca_staff"));
/*
			if(fixopt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
				clutil.clstaffcode($("#ca_staff"));
			} else {
				clutil.clstaffcode2($("#ca_staff"));
			}
*/

			var isNew = this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;

			// 伝票区分	#ca_dlvTypeID
			clutil.cltypeselector({
				el: this.$("#ca_dlvTypeID"),
				kind: amcm_type.AMCM_TYPE_RET_TRANS_SPLIP_TYPE,
				filter: function(item){
					// 新規のときは依頼あり返品は選択不可
					return !isNew || item.id !== amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_REQ;
				}
			});

			// 返品依頼番号
//			this.$('#ca_retCode').val('87654321');

			// メーカー
			clutil.clvendorcode(this.$('#ca_maker'), {
				getVendorTypeId: _.bind(function(){
					return amdb_defs.MTTYPE_F_VENDOR_MAKER;   // メーカー
				}, this)
			});

			// datepicker
			// 出荷日
//			clutil.datepicker(this.$('#ca_recInspectDate'));
			this.$('#ca_shipDate').val(clutil.dateFormat(clcom.getOpeDate(),"yyyy/mm/dd(w)"));

			// グループID -- AMDLV0150 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDLV0150';

			// 店舗部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = _.bind(function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var storeCodeName = {
						id: data[0].val,
						code: data[0].code,
						name: data[0].name
					};
					// 組織表示
					this.$('#ca_store').autocomplete('clAutocompleteItem', storeCodeName);
					mainView.setFocus();
					this._onStoreChange();
				}
				_.defer(function(){										// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store_select")); 	// 参照ボタンへあてなおす
				});
			},this);

			// Fieldlimit
			clutil.cltxtFieldLimit(this.$('#ca_deliverNo'));

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

			this._onDlvTypeChanged();

			//フィールドカウント
			clutil.cltxtFieldLimit($("#ca_comment"));
		},

		// 「一覧へ戻る」ボタンアクション
		btnCancelAction: function(e){
			// 更新済データの新しいキー値を呼び出し元の一覧画面へ戻す。
			var retVal = {
				// FIXME: 新しいキー値情報のデータ形式
//				updated: '呼び出し元へ処理結果を返す'
				updated: this.options.chkData
			};
			if(this.mdBaseView.options.confirmLeaving){
				this.mdBaseView._ConfirmLeaving(clcom.popPage);
			}else{
				clcom.popPage(retVal);
			}
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		//
		initUIElement: function(){

			this.mdBaseView.initUIElement();

			this.AMPAV0010Selector.render();

			//店舗オートコンプリート
			this.srcStoreIdField = clutil.clorgcode({
				el: $("#ca_store"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
//					p_org_id: clcom.userInfo.unit_id,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					org_typeid: amcm_type.AMCM_VAL_ORG_KIND_STORE,
				    f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
				}
			});

			if (clcom.userInfo && clcom.userInfo.org_id && clcom.userInfo.org_kind_typeid != Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID'))) {
				// 組織表示
//				this.$('#ca_store').autocomplete('clAutocompleteItem', {
//					id: clcom.userInfo.org_id,
//					code: clcom.userInfo.org_code,
//					name: clcom.userInfo.org_name
//				});
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
			}

			/*this.AMPAV0010Selector.render();*/

			this.AMPAV0010Selector1 = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog1"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});

			this.AMPAV0010Selector1.render();
			// 選択サブ画面復帰処理
			this.AMPAV0010Selector1.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					var store = code + ":" + name;
					$("#ca_inStore").val(store);
					$("#ca_inStore").data('cl_store_item', {
                        id: id,
                        code: code,
                        name: name
                    });
					mainView.setFocus();
				} else {
					var chk = $("#ca_inStore").data("cl_store_item");
					if (chk === null || chk.length == 0) {
						$("#ca_inStore").val("");
						$("#ca_inStore").data('cl_store_item', "");
					}
				}
				_.defer(function(){							// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store")); 	// 参照ボタンへあてなおす
				});
			};
			var unit = null;
			// 店舗オートコンプリート
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				this.storeAutocomplete = clutil.clorgcode( {
					el : '#ca_inStore',
					dependAttrs : {
						p_org_id: clcom.userInfo.unit_id,
						orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
//						org_typeid: amcm_type.AMCM_VAL_ORG_KIND_CENTER,
//						org_typeids: [amcm_type.AMCM_VAL_ORG_KIND_STORE,amcm_type.AMCM_VAL_ORG_KIND_CENTER],
						org_typeid_list: [amcm_type.AMCM_VAL_ORG_KIND_STORE,amcm_type.AMCM_VAL_ORG_KIND_CENTER,amcm_type.AMCM_VAL_ORG_KIND_HQ],
						f_stockmng: 1, //在庫管理有無フラグ(1:在庫有り店舗のみ)
						f_ignore_perm: 1
					}
				});
			} else {
				this.storeAutocomplete = clutil.clorgcode( {
					el : '#ca_inStore',
					dependAttrs : {
						// 上位組織を事業ユニットIDで選択されているものに設定する
						p_org_id: unit,
						orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
						orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
//						org_typeid: amcm_type.AMCM_VAL_ORG_KIND_CENTER,
//						org_typeids: [amcm_type.AMCM_VAL_ORG_KIND_STORE,amcm_type.AMCM_VAL_ORG_KIND_CENTER],
						org_typeid_list: [amcm_type.AMCM_VAL_ORG_KIND_STORE,amcm_type.AMCM_VAL_ORG_KIND_CENTER],
						f_stockmng: 1, //在庫管理有無フラグ(1:在庫有り店舗のみ)
						f_ignore_perm: 1
					}
				});
			}

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

		/**
		 * 明細リスト表示
		 */
		tableSetRecs: function(data){
/**/
			var _this = this;
			this.clearTable();
			var getRsp = data;
			var $tbody = this.$("#ca_table_tbody");
			$tmpl = this.$("#ca_tbody_template");

			this.orgQy = {};

			if(getRsp.slipItemList.length > 9){
				getRsp.slipItemList.length = 9;
			}
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
			var orglen = dtlList.length;
			for (var i = orglen; i < 9; i++) {
				var obj = {
						editable:true,
						canAdd:true,
						disChk:false,
						disEdit:false,
						no: i+1,
				};
				dtlList.push(obj);
			}
			$.each(dtlList, function(){
				_this.orgQy[this.itemID] = this.qy;
			});
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
//			this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
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
			var $tr = $(e.target).parents('tr');
			$tr.find("#ca_janCode").val('');
			// 品種
			$tr.find('#ca_stditgrpName').val('');
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

//			$(e.target).parent().parent().remove();
////			var $tbody = this.$("#ca_table_tbody");
////			var $tmpl = $("#ca_tbody_template");
////			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
////			$tmpl.tmpl(addObj).appendTo($tbody);
////			this._reNum();
			this.calc_qty_amt_total();
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
		 * 伝票区分変更イベント
		 */
		_onDlvTypeChanged: function(e) {
			var dlvType = parseInt(this.$("#ca_dlvTypeID").val(), 10);
			if(!dlvType){
				this.$("#ca_maker").val("");
				this.$("#ca_maker").data('cl_store_item', "");
				this.$("#ca_inStore").val("");
				this.$("#ca_inStore").data('cl_store_item', "");
				this.$("#ca_btn_store").attr("disabled", true);
				this.requireController.toggleRequired(
					this.$("#ca_maker"), false, true)
					.show(this.$("#ca_maker"));
				this.requireController.toggleRequired(
					this.$("#ca_inStore"), false, true);
			}else if(dlvType == amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_TRANS){
				this.$("#ca_maker").val("");
				this.$("#ca_maker").data('cl_store_item', "");
				this.$("#ca_btn_store").attr("disabled", false);
				this.requireController.toggleRequired(this.$("#ca_maker"), false, true);
				this.requireController.toggleRequired(this.$("#ca_inStore"), true, true);
			}else{
				this.$("#ca_inStore").val("");
				this.$("#ca_inStore").data('cl_store_item', "");
				this.$("#ca_btn_store").attr("disabled", true);
				this.requireController.toggleRequired(this.$("#ca_maker"), true, true);
				this.requireController.toggleRequired(this.$("#ca_inStore"), false, true);
			}
		},

		/**
		 * JANコード変更イベント
		 */
		_onJanCodeChanged: function(e) {
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
				// JanCode が見つかった ⇒ 値を表示
				var item = result.data.rec;
				// 品種
				$tr.find('#ca_stditgrpName').val(item.variety.name);
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
				// JanCode が見つからない ⇒ クリアする
				// 品種
				$tr.find('#ca_stditgrpName').val('');
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

			this.$("#ca_table_tbody").find('input[name="qy"]').each(function(){
				qty_t += Number((this.value).replace(/,/g,''));
			});
//			$("#ca_sumQy").text(clutil.comma(qty_t));
			var qty_flg = 0;
			qty_flg = Number(qty_t) || "a";
			if (qty_flg == "a") {
				$("#ca_sumQy").text("　");
			} else {
				$("#ca_sumQy").text(clutil.comma(qty_t));
			}
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':        // 確定済
				// TODO: args.data を画面個別 Viwe へセットする。
				this.mdBaseView.options.confirmLeaving = false;
				if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					this.options.chkData[args.index].deliverID = data.AMDLV0150UpdRsp.deliverID;
					this.options.chkData[args.index].tranOutID = data.AMDLV0150UpdRsp.transID;
				}
				if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					this.options.chkData[args.index].deliverID = 0;
					this.options.chkData[args.index].tranOutID = 0;
				}
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				document.location = '#';
				clutil.viewReadonly(this.$el);
				$("#ca_table .btn-delete").hide();
				$("#ca_addLine").hide();
				var slipCode = args.data.AMDLV0150UpdRsp.slipCode;
				if (slipCode != null && !_.isEmpty(slipCode)) {
					$("#ca_deliverNo").val(slipCode);
				}
				this.savedData = args.data;
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
			var data = args.data;
			switch(args.status){
			case 'OK':
				// TODO: args.data をアプリ個別 Veiw へセットし、編集可の状態にする
				var getRsp = data.AMDLV0150GetRsp;
//				clutil.data2view(this.$el, getRsp);
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

				this.$('#ca_recno').val(getRsp.slip.recno);
				this.$('#ca_state').val(getRsp.slip.state);
				this.$('#ca_deliverID').val(getRsp.slip.deliverID);
				this.$('#ca_firstDeliverID').val(getRsp.slip.firstDeliverID);
				this.$('#ca_transID').val(getRsp.slip.transID);
				this.$('#ca_FirstTransID').val(getRsp.slip.FirstTransID);
				this.setAutocompleteData($("#ca_store"), getRsp.slip.store.id, getRsp.slip.store.code, getRsp.slip.store.name);
//				this.setAutocompleteData($("#ca_staff"), getRsp.slip.staff.id, getRsp.slip.staff.code, getRsp.slip.staff.name);
				this.$('#ca_retCode').val(getRsp.slip.retCode);
				this.$('#ca_dlvTypeID').val(getRsp.slip.dlvTypeID);
				this.$('#ca_deliverNo').val(getRsp.slip.deliverNo);
				this.setAutocompleteData($("#ca_maker"), getRsp.slip.maker.id, getRsp.slip.maker.code, getRsp.slip.maker.name);
				this.setAutocompleteData($("#ca_inStore"), getRsp.slip.inStore.id, getRsp.slip.inStore.code, getRsp.slip.inStore.name);
				if (getRsp.slip.retConfirm == 0) {
					this.$('#ca_shipDate').val(clutil.dateFormat(getRsp.slip.shipDate,"yyyy/mm/dd(w)"));
				} else {
					this.$('#ca_shipDate').val("");
				}
				this.savedShipDate = getRsp.slip.shipDate;	// 出荷日を保存

//				this.$('#ca_comment').val(getRsp.slip.comment);
				this.$('#ca_sumQy').val(getRsp.slip.sumQy);

				this._onDlvTypeChanged();

				if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
					clutil.viewReadonly(this.$('#ca_srchArea'));
				}

				// 店舗が0699(IN通販)、0799(OR通販)の返品伝票の場合、返品依頼番号を変更可能にする
				var store_codes = clutil.getclsysparam('PAR_AMCM_ECV_TARGET_STORE_CODE').split(',');
				if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
						&& (getRsp.slip.dlvTypeID === amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_REQ
							|| getRsp.slip.dlvTypeID === amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_NOT_REQ)
						&& store_codes.includes(getRsp.slip.store.code)) {
					this.$('#ca_retCode').prop("disabled", false);
					this.$('#ca_retCode').prop("readonly", false);
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
				if (getRsp.slip.dlvTypeID == amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_REQ) {
					_.each(this.$("#ca_table_tbody").find('tr'), _.bind(function(tr) {
						var $tr = $(tr);
						var $janCode = $tr.find('input[name="janCode"]');
						clutil.inputReadonly($janCode);
						var code = $janCode.val();
						if (code === "") {
							// 商品コードがないので、数量も入力不可
							var $qy = $tr.find('input[name="qy"]');
							clutil.inputReadonly($qy);
						}
						// 削除ボタン使用不可
						var $span = $tr.find('span.btn-delete');
						$span.hide();

					}, this));
					var $input_janCode = this.$("#ca_table_tbody").find('input[name="janCode"]');
					clutil.inputReadonly($input_janCode);
				}
				mainView.setFocus();
				mainView.validator.clearErrorMsg($('#ca_staff'));
				switch (this.options.opeTypeId) {
/*
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					clutil.inputRemoveReadonly('#ca_staff');
					break;
*/
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
				var getRsp = data.AMDLV0150GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
//				clutil.data2view(this.$el, getRsp);
/*
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					var rec = getRsp.slip;
					rec.staff = {
						id: 0,
						code: rec.staff.code,
						name: ""
					};
				}
*/
				this.data2view(getRsp);

				this.$('#ca_recno').val(getRsp.slip.recno);
				this.$('#ca_state').val(getRsp.slip.state);
				this.$('#ca_deliverID').val(getRsp.slip.deliverID);
				this.$('#ca_firstDeliverID').val(getRsp.slip.firstDeliverID);
				this.$('#ca_transID').val(getRsp.slip.transID);
				this.$('#ca_FirstTransID').val(getRsp.slip.FirstTransID);
				this.setAutocompleteData($("#ca_store"), getRsp.slip.store.id, getRsp.slip.store.code, getRsp.slip.store.name);
//				this.setAutocompleteData($("#ca_staff"), getRsp.slip.staff.id, getRsp.slip.staff.code, getRsp.slip.staff.name);
				this.$('#ca_retCode').val(getRsp.slip.retCode);
				this.$('#ca_dlvTypeID').val(getRsp.slip.dlvTypeID);
				this.$('#ca_deliverNo').val(getRsp.slip.deliverNo);
				this.setAutocompleteData($("#ca_maker"), getRsp.slip.maker.id, getRsp.slip.maker.code, getRsp.slip.maker.name);
				this.setAutocompleteData($("#ca_inStore"), getRsp.slip.inStore.id, getRsp.slip.inStore.code, getRsp.slip.inStore.name);
				if (getRsp.slip.retConfirm == 0) {
					this.$('#ca_shipDate').val(clutil.dateFormat(getRsp.slip.shipDate,"yyyy/mm/dd(w)"));
				} else {
					this.$('#ca_shipDate').val("");
				}
//				this.$('#ca_comment').val(getRsp.slip.comment);
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
				mainView.validator.clearErrorMsg($('#ca_staff'));
				clutil.viewReadonly(this.$el);
				$("#ca_table .btn-delete").hide();
				$("#ca_addLine").hide();
				break;
			case 'DELETED':        // 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？                        【確認】
				// 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMDLV0150GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
//				clutil.data2view(this.$el, getRsp);
				this._onDlvTypeChanged();
				this.data2view(getRsp);
				clutil.viewReadonly(this.$el);
				break;
			case 'CONFLICT':    // ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMDLV0150GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
//				clutil.data2view(this.$el, getRsp);
				this._onDlvTypeChanged();
				this.data2view(getRsp);
				clutil.viewReadonly(this.$el);
				break;
			default:
			case 'NG':            // その他エラー。
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
				name: rec.store.name
			};
			rec.staff = {
				id: rec.staff.id,
				code: rec.staff.code,
				name: rec.staff.name
			};
			rec.maker = {
				id: rec.maker.id,
				code: rec.maker.code,
				name: rec.maker.name
			};
			rec.inStore = {
				id: rec.inStore.id,
				code: rec.inStore.code,
				name: rec.inStore.name
			};
			clutil.data2view(this.$('#ca_srchArea'), rec);
			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				clutil.data2view(this.$('#ca_srchArea2'), rec);
			}
			clutil.data2view(this.$('#ca_commentArea'), rec);
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
			} else {
				 if(!_.isEmpty(this.options.data)){
					var cond = {
						deliverID : 0,
						tranOutID : 0
					};
					this.options.chkData[0] = cond;
					if (!_.isEmpty(clcom.pageArgs.data.vpDeliverID)) {
						this.options.chkData[0].deliverID = Number(clcom.pageArgs.data.vpDeliverID);
					}
					if (!_.isEmpty(clcom.pageArgs.data.vpTransOutID)) {
						this.options.chkData[0].tranOutID = Number(clcom.pageArgs.data.vpTransOutID);
					}
					this.mdBaseView.__getInternal(0, 0, 1, null);
					return this;
				}
				// 一覧画面からの引継データ pageArgs があれば渡す。
				$('#ca_deliverID').val(this.options.chkData[0].deliverID);
				$('#ca_transID').val(this.options.chkData[0].tranOutID);

				this.mdBaseView.fetch();    // データを GET してくる。
			}
			return this;
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){

			//clutil.setFocus($('#ca_staff'));
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD || this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){

				// 編集の場合は初期フォーカスを担当者にセットする
				if ($('#ca_staff').val() == ""){
					clutil.setFocus(this.$("#ca_staff"));
				}

			} else if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				clutil.setFocus(this.$("#ca_dlvTypeID"));
			} else {

				// ログインユーザが店舗ユーザ以外の場合は初期フォーカスを店舗にセットする
				clutil.setFocus(this.$("#ca_store"));
			};
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var updReq = {};
			var f_error = false;
			var isNew = this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			var f_dialog = null;
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
				this.validator.clear();
//				if(!this.validator.valid()) {
				if(!this.srchAreaValidator.valid()) {
					f_error = true;
				}
				if(!this.ca_commentAreaValidator.valid()) {
					f_error = true;
				}
				// 伝票区分によるチェック
				var $store = this.$("#ca_store");
				var $deliverNo = this.$("#ca_deliverNo");
				var $inStore = this.$("#ca_inStore");
				var $maker = this.$("#ca_maker");
				var dlvType = this.$("#ca_dlvTypeID").val();
				var deliverNoLen = $deliverNo.val().length;
				var inStoreLen = this.$('#ca_inStore').val().length;
				var makerLen = this.$('#ca_maker').val().length;
				var $retCode = this.$("#ca_retCode");
				if(dlvType == amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_TRANS){
					if(inStoreLen == 0){
						this.validator.setErrorMsg($inStore, '店舗・倉庫は必ず入力してください。');
						f_error = true;
					}
					var storeObj = $store.autocomplete('clAutocompleteItem');
					var inStoreObj = $inStore.autocomplete('clAutocompleteItem');
					if (storeObj != null && inStoreObj != null) {
						if (storeObj.id == inStoreObj.id) {
							// 出庫・入庫が同じの場合はエラー
							this.validator.setErrorMsg($store, '店舗と相手先店舗・倉庫が同一です。');
							this.validator.setErrorMsg($inStore, '店舗と相手先店舗・倉庫が同一です。');
							f_error = true;
						}
					}
				}else{
					var retCodeVal = $retCode.val();
					if (dlvType == amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_REQ) {
						if (retCodeVal.length != 8 || !retCodeVal.match(/^-?[0-9]+$/)) {
							this.validator.setErrorMsg($retCode, '8桁の整数を入力してください');
							f_error = true;
						}
					}
					if (retCodeVal.length != 0 && dlvType == amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_NOT_REQ) {
						if(retCodeVal.length != 8 || !retCodeVal.match(/^-?[0-9]+$/)) {
							this.validator.setErrorMsg($retCode, '空欄または8桁の整数を入力してください');
							f_error = true;
						}
					}
					if(makerLen == 0){
						this.validator.setErrorMsg($maker, 'メーカーは必ず入力してください。');
						f_error = true;
					}
				}
				if(f_error){
	                this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
					return null;
				}
/*
				// テーブル領域エラーチェック
				// テーブルデータを取りながら、行末空欄スキップと、入力チェックを行う。
			    var items = clutil.tableview2ValidData({
			        $tbody: this.$('#ca_table > tbody'),    // <tbody> の要素を指定する。
			        validator: this.validator,   			// validator インスタンスを指定する。（どこのものでもかまわない）
			        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。//ラジオボタン選択値をとる
						var qy = item.qy;
			            return _.isEmpty(item.itemID || qy);
			        }
			    });
			    if(_.isEmpty(items)){
			        // 全部空欄行だったとか・・・
			        clutil.mediator.trigger('onTicker',clutil.fmtargs(clmsg.EMS0007, ["1"]));
					f_error = true;
					return;
			    }
*/
			}
			/*
			 * 入力値チェック(削除時)
			 */
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				// validation
				this.validator.clear();
				f_error = false;
				if(!this.srchAreaValidator.valid()) {
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
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var head = clutil.view2data(this.$('#ca_srchArea'));
			var head2 = clutil.view2data(this.$('#ca_srchArea2'));
			head.store = head._view2data_store_cn;
			head.maker = head._view2data_maker_cn;
			head.inStore = head._view2data_inStore_cn;
			head.sumQy = $("#ca_sumQy").text();
			head.sumAmInTax = $("#ca_sumAmInTax").text();
			head.comment = $("#ca_comment").val();
			head.staff = head2._view2data_staff_cn;
			head.shipDate = this.savedShipDate;
//			head.staffID = $("#ca_staffID").val();
			delete head.opeTypeID;
			var list = clutil.tableview2data(this.$('#ca_table_tbody').children());
/*
			for(var dlength=list.length; dlength > 0; dlength--){
				if(list[dlength-1].itemID != "" || list[dlength-1].qy != ""){
					break;
				}
			}
*/
			var dlength = list.length;
			var dtcnt = 0;
			// 空白行は無視したリストを作成
	        var $tbody = this.$('#ca_table > tbody');   // <tbody> の要素を指定する。
			var trElems = $tbody.find('tr');

			var sumQy = 0;

			for(var i=dlength-1; i>=0; i--){
				var $tr = $(trElems.get(i));
				var inItemID = $tr.find('input[name="itemID"]');
				var inQy = $tr.find('input[name="qy"]');
				var inJanCode = $tr.find('input[name="janCode"]');
/*
				if(inItemID.val() != ""){
					if(inQy.val() == ""){
						this.validator.setErrorMsg(inQy, '点数は必ず入力してください。');
						f_error = true;
//						return null;
					}
				}
				else {
					if(inQy.val() != ""){
						this.validator.setErrorMsg(inJanCode, 'JANコードは必ず入力してください。');
						f_error = true;
//						return null;
					}
				}
*/
				if(dtcnt == 0 && inJanCode.val() == "" && inQy.val() == ""){
					continue;
				}
				dtcnt++;
				if(inItemID.val() == ""){
					this.validator.setErrorMsg(inJanCode, '正しいJANコードを入力してください。');
					f_error = true;
				}
				if(inJanCode.val() == ""){
					this.validator.setErrorMsg(inJanCode, 'JANコードは必ず入力してください。');
					f_error = true;
				}
//				if(!jQuery.isNumeric(inQy.val()) || inQy.val() < 0){
				var chkQy = inQy.val().replace(",","").replace(",","");
				if(!chkQy.match(/^-?[0-9]+$/) || chkQy < 0 || chkQy > 9999999){
					this.validator.setErrorMsg(inQy, '整数で入力してください(7桁以内)');
					f_error = true;
				}
				if(inQy.val() == ""){
					this.validator.setErrorMsg(inQy, '点数は必ず入力してください。');
					f_error = true;
				}
				var qy = Number(inQy.val());
				if (!_.isNaN(qy)) {
					sumQy += qy;
				}
//				if(inQy.val() == "0"){
//					this.validator.setErrorMsg(inQy, clmsg.EDL0039);
//					f_error = true;
//					if (isNew) {
//						f_dialog = clmsg.EDL0039;
//					} else {
//						f_dialog = clmsg.EDL0041;
//					}
//				}
			}
			// 依頼なし返品で返品依頼番号が設定されているとき、依頼あり返品へ変更してから更新リクエストを投げる?
//			if (head.dlvTypeID == amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_NOT_REQ && head.retCode.length != 0) {
//				head.dlvTypeID = amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_REQ;
//			}
			if (head.dlvTypeID == amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_TRANS && sumQy == 0) {
				/*
				 * 伝票区分==3:移動 && 出荷点数の合計が0の場合は、エラーダイアログを表示する
				 */
				f_error = true;

				if (isNew) {
					f_dialog = clmsg.EDL0039;
				} else {
					f_dialog = clmsg.EDL0041;
				}
				clutil.ErrorDialog(f_dialog);
			}
			if(!dtcnt){
				//$('#ca_tablewrap').prepend('<span class="errorInside">テーブル内にデータがありません(1件以上のデータを設定して下さい)</span>');
                this.validator.setErrorInfo({_eb_: "テーブル内にデータがありません(1件以上のデータを設定して下さい)"});
				return null;
			}
			if(f_error){
				//$('#ca_tablewrap').prepend('<span class="errorInside">テーブル内にエラー箇所があります</span>');
                this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
    			//$('.errorInside').show();
				return null;
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
				}
			}

			var AMDLV0150UpdReq = {
				slip:head,
//				slipItemList:list
				slipItemList:dtlList
			};

			var reqObj = {
					reqHead : reqHead,
					AMDLV0150UpdReq  : AMDLV0150UpdReq
			};

			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		/**
		 * 店舗変更処理
		 */
		_onStoreChange: function(e) {
			this.makeDefaultTable();
			this.$("#ca_dlvTypeID").val("");
			this.$('#ca_deliverNo').val("");
			this._onDlvTypeChanged();
			var isNew = this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			clutil.cltypeselector({
				el: this.$("#ca_dlvTypeID"),
				kind: amcm_type.AMCM_TYPE_RET_TRANS_SPLIP_TYPE,
				filter: function(item){
					// 新規のときは依頼あり返品は選択不可
					return !isNew || item.id !== amcm_type.AMCM_VAL_RET_TRANS_SPLIP_TYPE_RET_BY_REQ;
				}
			});
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onStoreSelClick: function(e) {

			var _this = this;

			var options = {
				org_kind_set: [
					am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
				],
				f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
			};

			_this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onInStoreSelClick: function(e) {

			var unit = clcom.getUserData().unit_id;
			var _this = this;

			var options = {
				org_id: unit,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_kind_set: [
					am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
					am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ
				],
			    f_ignore_perm: 1,
			    f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
			};

			_this.AMPAV0010Selector1.show(null, null, options);
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			//console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

//			if (pgIndex){
			if (_.isEmpty(pgIndex)){
				$('#ca_deliverID').val(this.options.chkData[pgIndex].deliverID);
				$('#ca_transID').val(this.options.chkData[pgIndex].tranOutID);
			}
			var storeID = this.options.chkData[pgIndex].storeID;
			var InStoreID = this.options.chkData[pgIndex].InStoreID;

			var head = clutil.view2data(this.$('#ca_srchArea'));
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},
				// 明細検索リクエスト
				AMDLV0150GetReq: {
					srchDeliverID: head.deliverID,
					srchTransOutID: head.transID,
					storeID: storeID,
					InStoreID: InStoreID
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMDLV0150UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,    //'AMDLV0150',
				data: getReq
			};
		},

		// 空更新チェックデータをつくる
		_buildSubmitCheckDataFunction: function(arg){
//			rg: {
//				index: toIndex,                // 複数レコード選択編集時におけるインデックス番号
//				resId: req.resId,            // リソースId -- "XXXXV0010" など
//				data: clutil.dclone(data)    // GETの応答データ（共通ヘッダも含む）
//			};

			// TODO: 空更新チェック対象外のフィールドを削っていく。
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
			var rec = data.AMDLV0150GetRsp;
//			delete rec.slip.fromDate;
//			delete rec.slip.toDate;
			return data;
		},

		_eof: 'AMDLV0150.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////

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
