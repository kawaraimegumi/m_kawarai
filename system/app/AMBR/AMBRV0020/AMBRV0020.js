// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'change #ca_srchUnitID'							:	'_onSrchUnitChanged',		// 事業ユニットが変更された
			'cl_change #ca_srchItgrpID'						:	'_onSrchItgrpChanged',		// 品種が変更された
			"click #ca_btn_org_select"						:	'_onShowOrgSelClick',		// 組織選択ボタン押下
			"click #ca_btn_compare_select"					:	'_onShowCompOrgClick',		// 比較対象組織選択ボタン押下
			"change input[name='ca_srchCompMethod']:radio"	:	"_onCompMethodChange",		// 比較方法ラジオボタン変更
			'click #ca_srch'								:	'_onSrchClick',				// 検索ボタン押下時
		},

		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			clutil.inputlimiter(this.$el);

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 検索日
				datepicker: {
					el: "#ca_srchFromDate"
				},
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrpID"
				}
			}, {
				dataSource: {
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
			});

			// 客層セレクタ #20160219
			clutil.clmarkettypeselector(this. $('#ca_srchMarketTypeSw'), clcom.userInfo.unit_id, 1);
			// 年代セレクタ #20160219
			clutil.clagetypeselector(this. $('#ca_srchAgeTypeSw'), clcom.userInfo.unit_id, 1);

			// シーズン
			clutil.cltypeselector(this.$('#ca_srchSeasonSw'), amcm_type.AMCM_TYPE_SEASON, 1);
			// プライス集約単位
			clutil.cltypeselector(this.$('#ca_srchPriceUnit'), amcm_type.AMCM_TYPE_AGG_PRICE, 1);
			// 商品属性1,2
			var html_source = '';
			html_source += '<option value="0">&nbsp;</option>';
			html_source += '<option value="' + amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SUBCLASS1 + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_ITEM_ATTR_TYPE, amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SUBCLASS1) + '</option>';
			html_source += '<option value="' + amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SUBCLASS2 + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_ITEM_ATTR_TYPE, amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SUBCLASS2) + '</option>';
			html_source += '<option value="' + amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_COLOR + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_ITEM_ATTR_TYPE, amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_COLOR) + '</option>';
			html_source += '<option value="' + amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_METARIAL + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_ITEM_ATTR_TYPE, amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_METARIAL) + '</option>';
			html_source += '<option value="' + amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SIZE + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_ITEM_ATTR_TYPE, amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SIZE) + '</option>';
			$("#ca_srchItemAttr1Sw").html('');
			$("#ca_srchItemAttr1Sw").html(html_source).selectpicker().selectpicker('refresh');
			$("#ca_srchItemAttr2Sw").html('');
			$("#ca_srchItemAttr2Sw").html(html_source).selectpicker().selectpicker('refresh');
			clutil.inputReadonly($('#ca_srchItemAttr1Sw'));
			clutil.inputReadonly($('#ca_srchItemAttr2Sw'));

			var date = clutil.ymd2date(clcom.getOpeDate());

			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchToDate'));

			// ラジオボタン初期化
			$("input[name='ca_srchCompMethod'][value='1']").radio('check');

			console.log(clcom.userInfo);
			// 初期値を設定
			this.deserialize( {
				srchUnitID	: clcom.userInfo.unit_id,					// 事業ユニットID
				srchPriceUnit	: amcm_type.AMCM_VAL_AGG_PRICE_PRICE,	// プライス集約単位
				srchCompMethod	: 1,
				srchFromDate	: date,									// 対象期間開始日
				srchToDate	: date,										// 対象期間終了日
			});



			// 組織選択画面
			this.AMPAV0020Selector = new  AMPAV0020SelectorView({
				el				: $("#ca_AMPAV0020_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				select_mode		: clutil.cl_single_select,		// 単一選択モード
				isAnalyse_mode 	: false,						// 通常画面モード
			});
			this.AMPAV0020Selector.render();

			// 比較対象組織オートコンプリート
			this.compOrgAutocomplete = this.getOrg($("#ca_srchCompOrgID"), clcom.userInfo.unit_id);
			// 比較対象組織選択画面
			this.AMPAV0020Selector2 = new  AMPAV0020SelectorView({
				el				: $("#ca_AMPAV0020_2_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				select_mode		: clutil.cl_single_select,		// 単一選択モード
				isAnalyse_mode 	: false,						// 通常画面モード
			});
			this.AMPAV0020Selector2.render();


			// 組織オートコンプリート
			this.orgAutocomplete = this.getOrg($("#ca_srchOrgID"), clcom.userInfo.unit_id);
			if (clcom.userInfo && clcom.userInfo.org_id && clcom.userInfo.org_kind_typeid) {
				var code = (clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID')) ||
						clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')))
						? '' : clcom.userInfo.org_code ;
//				this.orgAutocomplete.setValue({
//					id: clcom.userInfo.org_id,
//					code: code,
//					name: clcom.userInfo.org_name
//				});
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					// 店舗ユーザー
					clutil.inputReadonly($("#ca_srchOrgID"));
					clutil.inputReadonly($("#ca_btn_org_select"));
					clutil.inputReadonly($("#ca_srchExistSw"));
//					clutil.inputReadonly($("#ca_srchCompOrgID"));
//					clutil.inputReadonly($("#ca_btn_compare_select"));
					this.orgAutocomplete.setValue({
						id: clcom.userInfo.org_id,
						code: code,
						name: clcom.userInfo.org_name
					});
				} else if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF) {
					// MD-3843 社員ユーザの場合は参照可能組織の値を見て制御を変更する
					if (clcom.userInfo.dataperm_typeid != amcm_type.AMCM_VAL_DATAPERM_FULL) {
						clutil.viewReadonly($('#ca_srchUnitID_div'));
					}
				} else {
//					this._onSrchUnitChanged();
					var unitID = Number($('#ca_srchUnitID').val());
					if (unitID == 0) {
						unitID = clcom.userInfo.unit_id;
					}

					this.getOrg($("#ca_srchOrgID"), unitID);
					this.$("#ca_srchOrgID").attr("readonly", (unitID == 0));
					this.$("#ca_btn_org_select").attr("disabled", (unitID == 0));
					this.getOrg($("#ca_srchCompOrgID"), unitID);
					this.$("#ca_srchCompOrgID").attr("readonly", (unitID == 0));
					this.$("#ca_btn_compare_select").attr("disabled", (unitID == 0));
				}
			}

			// ツールチップ
			$("#ca_tp_price").tooltip({html: true});
			$("#ca_tp_compare").tooltip({html: true});

			// 初期フォーカスオブジェクト設定
			this.$tgtFocus = null;

			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					this.$tgtFocus = $("#ca_srchItgrpID");
				}
				else{
					this.$tgtFocus = $("#ca_srchOrgID");
				}
			}
			else{
				this.$tgtFocus = $("#ca_srchUnitID");
			}
			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);

		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			return clutil.view2data(this.$el);
		},

		/**
		 * 検索リクエストパケットの設定値を UI へセットする。
		 */
		deserialize: function(obj){
			this.deserializing = true;
			try{
				var dto = _.extend({}, obj);
				clutil.data2view(this.$el, dto);
			}finally{
				this.deserializing = false;
			}
		},

		/**
		 * 指定プロパティ名（ ⇔ 検索 Req 上のメンバ名）の UI 設定値を取得する。
		 * defaultVal は、設定値が無い場合に返す値。
		 */
		getValue: function(propName, defaultVal){
			if(_.isUndefined(defaultVal)){
				defaultVal = null;
			}
			if(!_.isString(propName) || _.isEmpty(propName)){
				return defaultVal;
			}
			var dto = this.serialize();
			var val = dto[propName];
			return (_.isUndefined(val) || _.isNull(val) || _.isEmpty(val)) ? defaultVal : val;
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function() {
			var retStat = true;

			if(!this.validator.valid()){
				retStat = false;
			}
			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_srchFromDate',
				edval : 'ca_srchToDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}
			// 同一商品分類チェック
			var same_itemAttr = '同じ商品属性は指定できません。';
			var itemAttr1Sw = $('#ca_srchItemAttr1Sw').val();
			var itemAttr2Sw = $('#ca_srchItemAttr2Sw').val();
			if (itemAttr1Sw > 0 && itemAttr1Sw == itemAttr2Sw) {
				this.validator.setErrorMsg($('#ca_srchItemAttr1Sw'), same_itemAttr);
				this.validator.setErrorMsg($('#ca_srchItemAttr2Sw'), same_itemAttr);
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return false;
			}

			return true;
		},

		/**
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				return;
			}
			var unitID = Number($(e.target).val());
			this.getOrg($("#ca_srchOrgID"), unitID);
			this.orgAutocomplete.setValue();
			this.$("#ca_srchOrgID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_org_select").attr("disabled", (unitID == 0));
			this.getOrg($("#ca_srchCompOrgID"), unitID);
			this.compOrgAutocomplete.setValue();
			this.$("#ca_srchCompOrgID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_compare_select").attr("disabled", (unitID == 0));
			if (unitID == 0) {
				$("#ca_srchExistSw").checkbox('uncheck');
				$("#ca_srchCompExistSw").checkbox('uncheck');
				clutil.inputReadonly($("#ca_srchExistSw"));
				clutil.inputReadonly($("#ca_srchCompExistSw"));
				// #20160219 客層・年代対応
				$("#ca_srchMarketTypeSw").selectpicker('val', 0);
				$("#ca_srchAgeTypeSw").selectpicker('val', 0);
				clutil.inputReadonly($("#ca_srchMarketTypeSw"));
				clutil.inputReadonly($("#ca_srchAgeTypeSw"));
			} else {
				clutil.inputRemoveReadonly($("#ca_srchExistSw"));
				clutil.inputRemoveReadonly($("#ca_srchCompExistSw"));
				clutil.inputRemoveReadonly($("#ca_srchMarketTypeSw"));
				clutil.inputRemoveReadonly($("#ca_srchAgeTypeSw"));
				// #20160219 客層・年代対応
				clutil.clmarkettypeselector(this. $('#ca_srchMarketTypeSw'), unitID, 1);
				clutil.clagetypeselector(this. $('#ca_srchAgeTypeSw'), unitID, 1);
			}
		},

		/**
		 * 組織オートコンプ入れ替え
		 */
		getOrg: function($tgt, unitID){
			return clutil.clorgcode({
				el: $tgt,
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				}
			});
		},

		/**
		 * 品種が変更されたイベント
		 */
		_onSrchItgrpChanged: function(e){
			console.log(e);
			if(this.deserializing){
				// データセット中
				return;
			}
			if ($(e.target).val() == 0) {
				$('#ca_srchItemAttr1Sw').selectpicker('val', 0);
				$('#ca_srchItemAttr2Sw').selectpicker('val', 0);
				clutil.inputReadonly($('#ca_srchItemAttr1Sw'));
				clutil.inputReadonly($('#ca_srchItemAttr2Sw'));
			} else {
				clutil.inputRemoveReadonly($('#ca_srchItemAttr1Sw'));
				clutil.inputRemoveReadonly($('#ca_srchItemAttr2Sw'));
			}
		},

		/**
		 * 組織選択ボタン押下
		 */
		_onShowOrgSelClick: function(e) {
			var _this = this;

			var func_id = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
			var r_org_id = this.$("#ca_srchUnitID").val() == 0 ? 3 : Number(this.$("#ca_srchUnitID").val());
			// 3 は　(株)AOKIのorg_id いつでも触れるようにするならパラメータ化が必要
			// ＋組織画面側で選択した事業ユニットの渡しが必要となる。
//			var initData = {};
//			initData.func_id = Number(clcom.getSysparam("PAR_AMMS_DEFAULT_ORG_FUNCID"));
			this.AMPAV0020Selector.show(null, false, func_id, null, null, r_org_id);

			// サブ画面復帰後処理
			this.AMPAV0020Selector.okProc = function(data) {
				if(data != null && data.length > 0) {
					// 組織を取出す
					data[0].id = data[0].val;
					_this.orgAutocomplete.setValue(data[0]);
				} else {
					var org = _this.orgAutocomplete.getValue();
					if (org.id == 0) {
						_this.orgAutocomplete.resetValue();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_org_select"));
				});
			};
		},

		/**
		 * 比較対象組織選択ボタン押下
		 */
		_onShowCompOrgClick: function(e) {
			var _this = this;

			var func_id = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
			var r_org_id = this.$("#ca_srchUnitID").val() == 0 ? 3 : Number(this.$("#ca_srchUnitID").val());
			// 3 は　(株)AOKIのorg_id いつでも触れるようにするならパラメータ化が必要
			// ＋組織画面側で選択した事業ユニットの渡しが必要となる。
//			var initData = {};
//			initData.func_id = Number(clcom.getSysparam("PAR_AMMS_DEFAULT_ORG_FUNCID"));
			this.AMPAV0020Selector2.show(null, false, func_id, null, null, r_org_id, null, 1);
			//サブ画面復帰後処理
			this.AMPAV0020Selector2.okProc = function(data) {
				if(data != null && data.length > 0) {
					// 組織を取出す
					data[0].id = data[0].val;
					_this.compOrgAutocomplete.setValue(data[0]);
				} else {
					var org = _this.compOrgAutocomplete.getValue();
					if (org.id == 0) {
						_this.compOrgAutocomplete.resetValue();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_compare_select"));
				});
			};
		},

		/**
		 * 比較方法ラジオボタン変更
		 */
		_onCompMethodChange: function(e){
			var radio = $("input:radio[name=ca_srchCompMethod]:checked");
			var val = Number(radio.val());

			switch (val) {
			case 2:	// 先週比
				// 対象期間に前の週の開始日～終了日を自動設定し、編集不可にする
				var prevDay = clutil.addDate(clcom.getOpeDate(), -7);
				var prevDt = clutil.ymd2date(prevDay);
				var wday = prevDt.getDay() - 1;	// TODO:指定した日の曜日を取得
				var fromDate = clutil.addDate(prevDay, -wday);
				var toDate = clutil.addDate(fromDate, 6);
				$("#ca_srchFromDate").datepicker("setIymd", fromDate);
				$("#ca_srchToDate").datepicker("setIymd", toDate);
				clutil.viewReadonly($(".ca_srchFromDate_div"));
				clutil.viewReadonly($(".ca_srchToDate_div"));

				$("#ca_srchCompOrgID_div").removeClass("required");
				$("#ca_srchCompOrgID").removeClass("cl_required");
				break;

			case 3:	// 比較構成比
				clutil.viewRemoveReadonly($(".ca_srchFromDate_div"));
				clutil.viewRemoveReadonly($(".ca_srchToDate_div"));

				$("#ca_srchCompOrgID_div").addClass("required");
				$("#ca_srchCompOrgID").addClass("cl_required");
				break;

			default:
				clutil.viewRemoveReadonly($(".ca_srchFromDate_div"));
				clutil.viewRemoveReadonly($(".ca_srchToDate_div"));

				$("#ca_srchCompOrgID_div").removeClass("required");
				$("#ca_srchCompOrgID").removeClass("cl_required");
				break;
			}


		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			if(!this.isValid()){
				return;
			}

			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMBRV0020.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'		: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click #cl_close'			: '_onCloseClick',
		},

		initialize: function(opt){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId: -1,
				title: 'プライス別売上分析',
				subtitle: '',
//				btn_csv: (clcom.userInfo && clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF),
				btn_submit: false
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

//			// グループID -- AMBRV0020 なデータに関連することを表すためのマーキング文字列
//			var groupid = 'AMBRV0020';

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.srchCondView.render();

			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq) {
			var srchReq;
			if (arguments.length > 0) {
				srchReq = argSrchReq;
			} else {
				if (this.srchCondView.isValid()) {
					srchReq = this.srchCondView.serialize();
				} else {
					// メッセージは、srchConcView 側で出力済。
					return;
				}
			}
			if (srchReq.srchSeasonSw == null) {
				srchReq.srchSeasonSw = [];
			}
			if (srchReq.srchMarketTypeSw == null) {
				srchReq.srchMarketTypeSw = [];		// #20160219 客層・年代対応
			}
			if (srchReq.srchAgeTypeSw == null) {
				srchReq.srchAgeTypeSw = [];			// #20160219 客層・年代対応
			}

			// 検索条件
			var req = {
				reqHead: {
					//{ name = 'AM_PROTO_COMMON_RTYPE_NEW',        val = 1, description = '新規登録' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_UPD',        val = 2, description = '編集' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_DEL',        val = 3, description = '削除' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_REL',        val = 4, description = '参照' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_CSV',        val = 5, description = 'CSV出力' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_CSV_INPUT',  val = 6, description = 'CSV取込' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_COPY',       val = 7, description = '複製' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_PDF',        val = 8, description = 'PDF出力' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_DELCANCEL',  val = 9, description = '削除復活' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_RSVCANCEL',  val = 10, description = '予約取消' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_TMPSAVE',    val = 11, description = '一時保存' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_APPLY',      val = 12, description = '申請' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_APPROVAL',   val = 13, description = '承認' },
					//{ name = 'AM_PROTO_COMMON_RTYPE_PASSBACK',   val = 14, description = '差戻し' },
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
				AMBRV0020SchReq: srchReq
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);

			// 検索実行
			this.doSrch(req);
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMBRV0020', srchReq).done(_.bind(function(data){
				this.srchDoneProc(srchReq, data, $focusElem);

			}, this)).fail(_.bind(function(data){
				this.srchFailProc(data);

			}, this));

			return defer;
		},

		srchDoneProc: function(srchReq, data, $focusElem){
			// データ取得
			var recs = data.AMBRV0020SchRsp;
			console.log(recs);

			if (_.isEmpty(recs)) {
				// エラーメッセージ表示
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペイン／結果ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// フォーカス設定
				this.resetFocus(this.srchCondView.$tgtFocus);
			} else {
				// リクエストを保存。
				this.savedReq = srchReq;

				// データセット
				mainView.setDispData(recs);

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// グリッド初期化
				this.initGrid();

				// グリッドデータ作成
				this.createGridData(this.dispData);

				// グリッド表示
				this.renderGrid(this.dispData);

				// MD-4184 プライス別売上分析画面内のスクロールバー非活性について_PGM修正
				// 右下のキャンバスに幅がないとスクロールバーが表示されないようなので、width == 0px なら 1 にしておく
				var width = $(".grid-canvas-bottom.grid-canvas-right").css("width");
				if (width == "0px") {
				    $(".grid-canvas-bottom.grid-canvas-right").css("width", "1px");
				}

				if (clcom.userInfo && (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS)) {
					// Excelダウンロードボタンを表示する
					this.mdBaseView.options.btn_csv = true;
					this.mdBaseView.renderFooterNavi();
				}

				// フォーカスの設定
				if(typeof $focusElem != 'undefined') {
					this.resetFocus($focusElem);
				}

			}
		},

		srchFailProc: function(data){
			// 画面を一旦リセット
			mainView.srchAreaCtrl.reset();
			// 検索ペインを表示
			mainView.srchAreaCtrl.show_srch();

			// エラーメッセージを通知。
			clutil.mediator.trigger('onTicker', data);

			if (data.rspHead.fieldMessages) {
				// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				return;
			}

			// フォーカスの設定
			this.resetFocus();
		},

		setDispData: function(rsp){
			var _this = this;
			this.dispData = null;

			var tableData = {
				header:{
					itemAttr1	: new Array(),
					itemAttr2	: new Array(),
					caption		: new Array(),
				},
				body:new Array(),
			};

			var hd = tableData.header;
			var bd = tableData.body;
			var itemAttr1 = null;

			// テーブルのヘッダ部分のデータを生成する
			this.maxItem = 0;
			var cellIndex = 0;
			$.each(rsp.itemAttrList, function(){
				hd.itemAttr1.push({
					itemAttr1ID:this.itemAttr1ID,
					itemAttr1Name:this.itemAttr1Name,
					colspan:0,
				});
				itemAttr1 = hd.itemAttr1[hd.itemAttr1.length - 1];
				if (_.isEmpty(this.itemAttr2NameList)) {
					hd.itemAttr2.push({
						itemAttr2ID:0,
						itemAttr2Name:'',
					});
					itemAttr1.colspan = 3;
					_this.maxItem++;
					hd.caption.push({cellIndex:cellIndex,});
					cellIndex++;
				}
				$.each(this.itemAttr2NameList, function(){
					hd.itemAttr2.push({
						itemAttr2ID:this.itemAttr2ID,
						itemAttr2Name:this.itemAttr2Name,
					});
					itemAttr1.colspan += 3;
					_this.maxItem++;
					hd.caption.push({cellIndex:cellIndex,});
					cellIndex++;
				});
			});

//			console.log(rsp.priceList);
			// テーブルの縦軸部分のデータを生成する
			$.each(rsp.priceList, function(){

				// テーブルの横軸部分のデータを生成する
				var obj = {
					price: clutil.comma(this.price),
				};
				for (var i = 0; i < this.details.length; i++){
					var cell = this.details[i];
					var id_qty = '' + i + '_qty';
					var id_ratio = '' + i + '_ratio';
					var id_compQty = '' + i + '_compQty';
					var id_compRatio = '' + i + '_compRatio';
					obj[id_qty] = cell.qty;
					obj[id_ratio] = (cell.qty == 0) ? '-' :cell.ratio.toFixed(1);
					obj[id_compQty] = cell.compQty;
					obj[id_compRatio] = (cell.compQty == 0) ? '-' :cell.compRatio.toFixed(1);
				}
				bd.push(obj);
			});

			var row_cnt = bd.length + ((hd.itemAttr1.length == hd.itemAttr2.length) ? 5 : 6);
			var max_height = (row_cnt < 15) ? row_cnt * 40 : 600;
			$('#ca_datagrid').css('height', max_height + 'px');

			this.dispData = tableData;
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMBRV0020', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				if (data.rspHead.fieldMessages) {
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFocus($focusElem);
			}else{
				if (this.$('#searchAgain').css('display') == 'none') {
					clutil.setFocus($('#ca_srch'));
				} else {
					clutil.setFocus($('#searchAgain'));
				}
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
			this.mdBaseView.options.btn_csv = false;
			this.mdBaseView.renderFooterNavi();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex, e) {
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
				break;

			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;

			}
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

			// 確定時用のデータを初期化
			this.savedReq = null;
		},

		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(model) {
			// 条件部の復元
			if(!_.isEmpty(model.savedCond)){
				this.srchCondView.deserialize(model.savedCond);
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}

		},

		initGrid:function(){
			// データグリッド
			this.dataGrid  = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid',	// エレメント
				lineno			: false,			// 行番号表示する/しないフラグ。
				delRowBtn		: false,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: false,			// フッター部の新規行追加ボタンを使用するフラグ。
			});
//			this.dataGrid.getHeadMetadata = this.getHeadMetadata;
			this.dataGrid.getMetadata = this.getMetadata;

			this.dataGrid.render();
		},

		getHeadMetadata: function(rowIndex){
			return {
				columns: {
					price:
					{
						cssClasses: 'bdrTpColor',
					},
				}
			};
		},

		getMetadata: function(rowIndex){
			if (rowIndex == this.dispData.body.length - 1) {
				return {
					cssClasses: 'reference',
				};
			} else {
				return {
					columns: {
						price:{
							cssClasses: 'txtalign-right',
						},
					}
				};
			}
		},

		createGridData: function(data){
			var hd = data.header;
			var bd = data.body;
			this.colhdMetadatas = [];
			this.columns = [];
			var hdCol1 = {};
			var hdCol2 = {};
			var bdCol = [];
			var id_price = 'price';

			console.log(bd);
			var req = this.savedReq.AMBRV0020SchReq;
			var priceUnit = clutil.gettypename(amcm_type.AMCM_TYPE_AGG_PRICE, Number(req.srchPriceUnit), 1);
			var itemAttr2Sw = Number(req.srchItemAttr2Sw);
			var compMethod = Number(req.srchCompMethod);
			var compName = '';
			switch (compMethod) {
			case 1:
				compName = '前年比';
				break;

			case 2:
				compName = '先週比';
				break;

			case 3:
				compName = '比較構成比';
				break;

			default:
				break;
			}

			// プライス集約単位
			hdCol1[id_price] = {
//				rowspan : (itemAttr2Sw) ? 3 : 2,
				name : '',
			};
			if (itemAttr2Sw) {
				hdCol2[id_price] = {
					name : '',
				};
			}
			bdCol.push({
				id : id_price,
				name : priceUnit,
				field : id_price,
//				cssClass: 'txtalign-right',
				width : 100,
				cellType: {
					formatFilter: 'currency'
				}
			});

			console.log(hd);
			var cellIndex = 0;
			$.each(hd.itemAttr1, function(i){
				var id_qty = '' + cellIndex + '_qty';
				cellIndex += (this.colspan / 3);
				hdCol1[id_qty] = {
					colspan	: this.colspan,
					name : this.itemAttr1Name,
				};
			});
			$.each(hd.itemAttr2, function(i){
				var id_qty = '' + i + '_qty';
				hdCol2[id_qty] = {
					colspan	: 3,
					name : this.itemAttr2Name,
				};
			});

			$.each(hd.caption, function(){
				var id_qty = '' + this.cellIndex + '_qty';
				var id_ratio = '' + this.cellIndex + '_ratio';
				var id_compRatio = '' + this.cellIndex + '_compRatio';

				var qty = {
					id: id_qty,
					name: '売上数',
					field: id_qty,
					cssClass: 'txtalign-right',
					width: 90,
					cellType: {
						formatFilter: 'comma'
					}
				};
				var ratio = {
					id: id_ratio,
					name: '構成比',
					field: id_ratio,
					cssClass: 'txtalign-right',
					width: 90,
					cellType: {
						formatFilter: 'comma'
					}
				};
				var compRatio = {
					id: id_compRatio,
					name: compName,
					field: id_compRatio,
					cssClass: 'txtalign-right',
					width: 90,
					cellType: {
						formatFilter: 'comma'
					}
				};

				bdCol.push(qty);
				bdCol.push(ratio);
				bdCol.push(compRatio);
			});

			this.colhdMetadatas.push({columns: hdCol1});
			if (itemAttr2Sw) {
				this.colhdMetadatas.push({columns: hdCol2});
			}
			this.columns = bdCol;

		},

		renderGrid: function(data){
			this.dataGrid.setData({
				gridOptions: {
					autoHeight: false,
//					frozenRow: 1,
					frozenColumn: 3,
				},
				colhdMetadatas: this.colhdMetadatas,
				columns: this.columns,
				data: data.body,
			});
		},

		_eof: 'AMBRV0020.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView(clcom.pageArgs).initUIElement().render();

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
		}

	}).fail(function(data){
		console.error('iniJSON failed.');
		console.log(arguments);

		// clcom のネタ取得に失敗。
		// 動かしようがないので、Abort 扱いとしておく？？？
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});
