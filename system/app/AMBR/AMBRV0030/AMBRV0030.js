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

			// シーズン
			clutil.cltypeselector(this.$('#ca_srchSeasonSw'), amcm_type.AMCM_TYPE_SEASON, 1);
			// 商品属性1,2,3
			var html_source = '';
			html_source += '<option value="0">&nbsp;</option>';
			html_source += '<option value="' + amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SUBCLASS1 + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_ITEM_ATTR_TYPE, amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SUBCLASS1) + '</option>';
			html_source += '<option value="' + amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SUBCLASS2 + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_ITEM_ATTR_TYPE, amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SUBCLASS2) + '</option>';
			html_source += '<option value="' + amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SIZE + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_ITEM_ATTR_TYPE, amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_SIZE) + '</option>';
			html_source += '<option value="' + amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_ITEM_ATTR_TYPE, amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE) + '</option>';
			$("#ca_srchItemAttr1Sw").html('');
			$("#ca_srchItemAttr1Sw").html(html_source).selectpicker().selectpicker('refresh');
			$("#ca_srchItemAttr2Sw").html('');
			$("#ca_srchItemAttr2Sw").html(html_source).selectpicker().selectpicker('refresh');
			$("#ca_srchItemAttr3Sw").html('');
			$("#ca_srchItemAttr3Sw").html(html_source).selectpicker().selectpicker('refresh');
			clutil.inputReadonly($('#ca_srchItemAttr1Sw'));
			clutil.inputReadonly($('#ca_srchItemAttr2Sw'));
			clutil.inputReadonly($('#ca_srchItemAttr3Sw'));

			var date = clutil.ymd2date(clutil.addDate(clcom.getOpeDate(), -1));

			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchToDate'));

			// ラジオボタン初期化
			$("input[name='ca_srchCompMethod'][value='1']").radio('check');

			// 初期値を設定
			this.deserialize( {
				srchUnitID	: clcom.userInfo.unit_id,					// 事業ユニットID
				srchFromDate	: date,									// 対象期間開始日(前日)
				srchToDate	: date,										// 対象期間終了日(前日)
			});

			var option = {};
			if (clcom.userInfo && clcom.userInfo.unit_id) {
				option.unit_id = clcom.userInfo.unit_id;
			}

			// 組織オートコンプリート
			this.orgAutocomplete = this.getOrg(clcom.userInfo.unit_id);
			if (clcom.userInfo && clcom.userInfo.org_id && clcom.userInfo.org_kind_typeid) {
				var code = (clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID')) ||
						clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')))
						? '' : clcom.userInfo.org_code ;
//				this.orgAutocomplete.setValue({
//					id: clcom.userInfo.org_id,
//					code: code,
//					name: clcom.userInfo.org_name
//				});
				// 初期フォーカスオブジェクト設定
				this.$tgtFocus = $('#ca_srchUnitID');
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					// 店舗ユーザー
					this.orgAutocomplete.setValue({
						id: clcom.userInfo.org_id,
						code: code,
						name: clcom.userInfo.org_name
					});
					clutil.inputReadonly($("#ca_srchOrgID"));
					clutil.inputReadonly($("#ca_btn_org_select"));
					clutil.inputReadonly($("#ca_srchExistSw"));
					this.$tgtFocus = $('#ca_srchItgrpID');
				} else if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF) {
					// MD-3843 社員ユーザの場合は参照可能組織の値を見て制御を変更する
					if (clcom.userInfo.dataperm_typeid != amcm_type.AMCM_VAL_DATAPERM_FULL) {
						clutil.viewReadonly($('#ca_srchUnitID_div'));
					}
					this.$tgtFocus = $('#ca_srchOrgID');
				} else {
					this._onSrchUnitChanged(option);
				}
			}

			// 組織選択画面
			this.AMPAV0020Selector = new  AMPAV0020SelectorView({
				el				: $("#ca_AMPAV0020_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				//ymd				: null,			// 検索日
				select_mode		: clutil.cl_single_select,	// 単一選択モード
				//anaProc			: this.anaProc
				isAnalyse_mode 	: false,						// 通常画面モード
			});
			this.AMPAV0020Selector.render();

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
			var itemAttr3Sw = $('#ca_srchItemAttr3Sw').val();
			if (itemAttr2Sw > 0 && itemAttr1Sw == itemAttr2Sw) {
				this.validator.setErrorMsg($('#ca_srchItemAttr1Sw'), same_itemAttr);
				this.validator.setErrorMsg($('#ca_srchItemAttr2Sw'), same_itemAttr);
				retStat = false;
			}
			if (itemAttr3Sw > 0 && itemAttr1Sw == itemAttr3Sw) {
				this.validator.setErrorMsg($('#ca_srchItemAttr1Sw'), same_itemAttr);
				this.validator.setErrorMsg($('#ca_srchItemAttr3Sw'), same_itemAttr);
				retStat = false;
			}
			if (itemAttr2Sw > 0 && itemAttr3Sw > 0 && itemAttr2Sw == itemAttr3Sw) {
				this.validator.setErrorMsg($('#ca_srchItemAttr2Sw'), same_itemAttr);
				this.validator.setErrorMsg($('#ca_srchItemAttr3Sw'), same_itemAttr);
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
			var unitID = Number($('#ca_srchUnitID').val());
			if (unitID == 0) {
				if (e != null && e.unit_id != null) {
					unitID = e.unit_id;
				}
			}

			this.getOrg(unitID);
			this.orgAutocomplete.setValue();
			this.$("#ca_srchOrgID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_org_select").attr("disabled", (unitID == 0));
			if (unitID == 0) {
				$("#ca_srchExistSw").checkbox('uncheck');
				clutil.inputReadonly($("#ca_srchExistSw"));
			} else {
				clutil.inputRemoveReadonly($("#ca_srchExistSw"));
			}
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
				$('#ca_srchItemAttr3Sw').selectpicker('val', 0);
				clutil.inputReadonly($('#ca_srchItemAttr1Sw'));
				clutil.inputReadonly($('#ca_srchItemAttr2Sw'));
				clutil.inputReadonly($('#ca_srchItemAttr3Sw'));
			} else {
				clutil.inputRemoveReadonly($('#ca_srchItemAttr1Sw'));
				clutil.inputRemoveReadonly($('#ca_srchItemAttr2Sw'));
				clutil.inputRemoveReadonly($('#ca_srchItemAttr3Sw'));
			}
		},

		/**
		 * 組織オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: $('#ca_srchOrgID'),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				}
			});
		},

		/**
		 * 組織選択ボタン押下
		 */
		_onShowOrgSelClick: function(e) {
			var _this = this;

			// 選択された情報を初期値として検索する
			var func_id = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
			var r_org_id = this.$("#ca_srchUnitID").val() == 0 ? 3 : Number(this.$("#ca_srchUnitID").val());
			// 3 は　(株)AOKIのorg_id いつでも触れるようにするならパラメータ化が必要
			// ＋組織画面側で選択した事業ユニットの渡しが必要となる。
//			var initData = {};
//			initData.func_id = Number(clcom.getSysparam("PAR_AMMS_DEFAULT_ORG_FUNCID"));
			this.AMPAV0020Selector.show(null, false, func_id, null, null, r_org_id);

			//サブ画面復帰後処理
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
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			if(!this.isValid()){
				return;
			}

			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMBRV0030.SrchCondView//'
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
				title: '商品構成別売上分析',
				subtitle: '',
//				btn_csv: (clcom.userInfo && clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF),
				btn_submit: false
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMBRV0030 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMBRV0030';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

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
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}

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
			if (srchReq.srchItemAttr2Sw == null) {
				srchReq.srchItemAttr2Sw = 0;
			}
			if (srchReq.srchItemAttr3Sw == null) {
				srchReq.srchItemAttr3Sw = 0;
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
				reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMBRV0030SchReq: srchReq
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
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			if(groupid !== 'AMBRV0030'){
				return;
			}

			if(!this.savedReq){
				console.warn('検索条件が保存されていません。');
				return;
			}

			// 検索条件を複製してページリクエストを差し替える
			var req = _.extend({}, this.savedReq);
			req.reqPage = pageReq;

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

			var defer = clutil.postJSON('AMBRV0030', srchReq).done(_.bind(function(data){
				this.srchDoneProc(srchReq, data, $focusElem);

			}, this)).fail(_.bind(function(data){
				this.srchFailProc(data);

			}, this));

			return defer;
		},

		srchDoneProc: function(srchReq, data, $focusElem){
			// データ取得
			var recs = data.AMBRV0030SchRsp;
			console.log(recs);

			if (_.isEmpty(recs)) {
				// エラーメッセージ表示
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペイン／結果ペインを表示
				mainView.srchAreaCtrl.show_srch();

//				// フォーカス設定
//				this.resetFocus(this.srchCondView.$tgtFocus);
			} else {
				// リクエストを保存。
				this.savedReq = srchReq;

				// データセット
				mainView.setDispData(recs);

//				// リクエストを保存。
//				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// グリッド初期化
				this.initGrid();

				// グリッドデータ作成
				this.createGridData(this.dispData);

				// グリッド表示
				this.renderGrid(this.dispData);

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
			this.dispData = null;
			var f_price = false;

			// テーブルのヘッダ部分のデータを生成する
			var req = this.savedReq.AMBRV0030SchReq;
			if (req.srchItemAttr1Sw == amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE || req.srchItemAttr2Sw == amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE || req.srchItemAttr3Sw == amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE) {
				f_price = true;
			}
			var tableData = {
				header:{
					headIA1Name	: rsp.headIA1Name,
					headIA2Name	: rsp.headIA2Name,
					headIA3Name	: rsp.headIA3Name,
					f_price		: f_price,
				},
				body:new Array(),
			};

			var hd = tableData.header;
			var bd = tableData.body;
			var f_headIA2Name = false;
			var f_headIA3Name = false;
			if (hd.headIA2Name != "") {
				f_headIA2Name = true;
			}
			if (hd.headIA3Name != "") {
				f_headIA3Name = true;
			}

			console.log(rsp.rspList);
			// テーブルの縦軸部分のデータを生成する
			$.each(rsp.rspList, function(i){
				var cl_reference = '';
				var f_headIA1Price = false;
				var f_headIA2Price = false;
				var f_headIA3Price = false;

				if (_.isEmpty(this.itemAttr1Name) && _.isEmpty(this.itemAttr2Name) && _.isEmpty(this.itemAttr3Name)) {
					cl_reference = 'reference';
				} else {
					if (req.srchItemAttr1Sw == amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE) {
						f_headIA1Price = true;
					}
					if (req.srchItemAttr2Sw == amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE) {
						f_headIA2Price = true;
					}
					if (req.srchItemAttr3Sw == amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE) {
						f_headIA3Price = true;
					}
				}

				// テーブルの横軸部分のデータを生成する
				bd.push({
					cl_reference	: cl_reference,
					f_headIA2Name	: f_headIA2Name,
					f_headIA3Name	: f_headIA3Name,
					f_headIA1Price	: f_headIA1Price,
					f_headIA2Price	: f_headIA2Price,
					f_headIA3Price	: f_headIA3Price,
					f_price		: f_price,
					itemAttr1Name	: $.trim(this.itemAttr1Name),	// trimする
					itemAttr2Name	: $.trim(this.itemAttr2Name),
					itemAttr3Name	: $.trim(this.itemAttr3Name),
					saleQty	: this.saleQty,
					saleQtyPrev	: this.saleQtyPrev,
					saleQtyYTY	: this.saleQtyPrev == 0 ? '-' : this.saleQtyYTY.toFixed(1),
					saleQtyComp	: this.saleQty == 0 ? '-' : this.saleQtyComp.toFixed(1),
					saleQtyCompPrev	: this.saleQtyPrev == 0 ? '-' : this.saleQtyCompPrev.toFixed(1),
					saleAm	: this.saleAm,
					saleAmPrev	: this.saleAmPrev,
					saleAmYTY	: this.saleAmPrev == 0 ? '-' : this.saleAmYTY.toFixed(1),
					saleAmComp	: this.saleQty == 0 ? '-' : this.saleAmComp.toFixed(1),
					saleAmCompPrev	: this.saleAmPrev == 0 ? '-' : this.saleAmCompPrev.toFixed(1),
					priceMean	: this.priceMean,
					priceMeanPrev	: this.priceMeanPrev,
					margin	: this.margin,
					marginPrev	: this.marginPrev,
					marginYTY	: this.marginPrev == 0 ? '-' : this.marginYTY.toFixed(1),
					marginRatio	: this.margin == 0 ? '-' : this.marginRatio.toFixed(1),
					marginRatioPrev	: this.marginPrev == 0 ? '-' : this.marginRatioPrev.toFixed(1),
					stockAm	: this.stockAm,
					stockAmPrev	: this.stockAmPrev,
					stockQty	: this.stockQty,
					stockQtyPrev	: this.stockQtyPrev,
					stockComp	: this.stockQty == 0 ? '-' : this.stockComp.toFixed(1),
					stockCompPrev	: this.stockQtyPrev == 0 ? '-' : this.stockCompPrev.toFixed(1),
					stockNOD	: this.stockNOD,
					stockNODPrev	: this.stockNODPrev,
				});
			});

			var row_cnt = bd.length + 3;
			console.log(row_cnt);
			var max_height = row_cnt * 40;
			console.log(max_height);
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
			var defer = clutil.postDLJSON('AMBRV0030', srchReq);
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

//			// テーブルをクリア
//			this.recListView.clear();
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
			this.dataGrid.getMetadata = this.getMetadata;

			this.dataGrid.render();
		},

		getMetadata: function(rowIndex){
			if (rowIndex == 0 && this.savedReq.reqPage.start_record == 0) {
				return {
					cssClasses: 'reference'
				};
			}
		},

		createGridData: function(data){
			var hd = data.header;
			this.colhdMetadatas = [];
			this.columns = [];
			var hdCol = {};
			var bdCol = [];
			var req = this.savedReq.AMBRV0030SchReq;
			this.colHead = 0;

			if (!_.isEmpty(hd.headIA1Name)) {
				hdCol['itemAttr1Name'] = {
					name : '',
				};
				bdCol.push({
					id : 'itemAttr1Name',
					name : hd.headIA1Name,
					field : 'itemAttr1Name',
					cssClass: req.srchItemAttr1Sw == amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE ? 'txtalign-right' : '',
					width : 180,
					cellType: {
						formatFilter: req.srchItemAttr1Sw == amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE ? 'currency': ''
					}
				});
			}
			if (!_.isEmpty(hd.headIA2Name)) {
				hdCol['itemAttr2Name'] = {
					name : '',
				};
				bdCol.push({
					id : 'itemAttr2Name',
					name : hd.headIA2Name,
					field : 'itemAttr2Name',
					cssClass: req.srchItemAttr2Sw == amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE ? 'txtalign-right' : '',
					width : 180,
					cellType: {
						formatFilter: req.srchItemAttr2Sw == amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE ? 'currency': ''
					}
				});
				this.colHead += 1;
			}
			if (!_.isEmpty(hd.headIA3Name)) {
				hdCol['itemAttr3Name'] = {
					name : '',
				};
				bdCol.push({
					id : 'itemAttr3Name',
					name : hd.headIA3Name,
					field : 'itemAttr3Name',
					cssClass: req.srchItemAttr3Sw == amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE ? 'txtalign-right' : '',
					width : 180,
					cellType: {
						formatFilter: req.srchItemAttr3Sw == amcm_type.AMCM_VAL_ITEM_ATTR_TYPE_PRICE ? 'currency': ''
					}
				});
				this.colHead += 1;
			}
			// 売上数
			var id_saleQty = 'saleQty';
			hdCol[id_saleQty] = {
				colspan	: 3,
				name : '売上数',
			};
			bdCol.push({
				id: id_saleQty,
				name: '本年',
				field: id_saleQty,
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			});
			bdCol.push({
				id: 'saleQtyPrev',
				name: '前年',
				field: 'saleQtyPrev',
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			});
			bdCol.push({
				id: 'saleQtyYTY',
				name: '前年比',
				field: 'saleQtyYTY',
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			});
			// 売上数構成比
			var id_saleQtyComp = 'saleQtyComp';
			hdCol[id_saleQtyComp] = {
				colspan	: 2,
				name : '売上数構成比',
			};
			bdCol.push({
				id: id_saleQtyComp,
				name: '本年',
				field: id_saleQtyComp,
				cssClass: 'txtalign-right',
				width: 70,
				cellType: {
					formatFilter: 'comma'
				}
			});
			bdCol.push({
				id: 'saleQtyCompPrev',
				name: '前年',
				field: 'saleQtyCompPrev',
				cssClass: 'txtalign-right',
				width: 70,
				cellType: {
					formatFilter: 'comma'
				}
			});
			// 売上高（千円）
			var id_saleAm = 'saleAm';
			hdCol[id_saleAm] = {
				colspan	: 3,
				name : '売上高',
			};
			bdCol.push({
				id: id_saleAm,
				name: '本年',
				field: id_saleAm,
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			});
			bdCol.push({
				id: 'saleAmPrev',
				name: '前年',
				field: 'saleAmPrev',
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			});
			bdCol.push({
				id: 'saleAmYTY',
				name: '前年比',
				field: 'saleAmYTY',
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			});
			// 売上高（千円）
			var id_saleAmComp = 'saleAmComp';
			hdCol[id_saleAmComp] = {
				colspan	: 2,
				name : '売上高構成比',
			};
			bdCol.push({
				id: id_saleAmComp,
				name: '本年',
				field: id_saleAmComp,
				cssClass: 'txtalign-right',
				width: 70,
				cellType: {
					formatFilter: 'comma'
				}
			});
			bdCol.push({
				id: 'saleAmCompPrev',
				name: '前年',
				field: 'saleAmCompPrev',
				cssClass: 'txtalign-right',
				width: 70,
				cellType: {
					formatFilter: 'comma'
				}
			});
			// 平均上代
			var id_priceMean = 'priceMean';
			hdCol[id_priceMean] = {
				colspan	: 2,
				name : '平均上代',
			};
			bdCol.push({
				id: id_priceMean,
				name: '本年',
				field: id_priceMean,
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			});
			bdCol.push({
				id: 'priceMeanPrev',
				name: '前年',
				field: 'priceMeanPrev',
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			});
			// 経準高（千円）
			var id_margin = 'margin';
			hdCol[id_margin] = {
				colspan	: 3,
				name : '経準高',
			};
			bdCol.push({
				id: id_margin,
				name: '本年',
				field: id_margin,
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			});
			bdCol.push({
				id: 'marginPrev',
				name: '前年',
				field: 'marginPrev',
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			});
			bdCol.push({
				id: 'marginYTY',
				name: '前年比',
				field: 'marginYTY',
				cssClass: 'txtalign-right',
				width: 100,
				cellType: {
					formatFilter: 'comma'
				}
			});
			// 経準率
			var id_marginRatio = 'marginRatio';
			hdCol[id_marginRatio] = {
				colspan	: 2,
				name : '経準率',
			};
			bdCol.push({
				id: id_marginRatio,
				name: '本年',
				field: id_marginRatio,
				cssClass: 'txtalign-right',
				width: 70,
				cellType: {
					formatFilter: 'comma'
				}
			});
			bdCol.push({
				id: 'marginRatioPrev',
				name: '前年',
				field: 'marginRatioPrev',
				cssClass: 'txtalign-right',
				width: 70,
				cellType: {
					formatFilter: 'comma'
				}
			});
			if (!hd.f_price) {
				// 在庫高（千円）
				var id_stockAm = 'stockAm';
				hdCol[id_stockAm] = {
					colspan	: 2,
					name : '在庫高',
				};
				bdCol.push({
					id: id_stockAm,
					name: '本年',
					field: id_stockAm,
					cssClass: 'txtalign-right',
					width: 100,
					cellType: {
						formatFilter: 'comma'
					}
				});
				bdCol.push({
					id: 'stockAmPrev',
					name: '前年',
					field: 'stockAmPrev',
					cssClass: 'txtalign-right',
					width: 100,
					cellType: {
						formatFilter: 'comma'
					}
				});
				// 在庫数
				var id_stockQty = 'stockQty';
				hdCol[id_stockQty] = {
					colspan	: 2,
					name : '在庫数',
				};
				bdCol.push({
					id: id_stockQty,
					name: '本年',
					field: id_stockQty,
					cssClass: 'txtalign-right',
					width: 100,
					cellType: {
						formatFilter: 'comma'
					}
				});
				bdCol.push({
					id: 'stockQtyPrev',
					name: '前年',
					field: 'stockQtyPrev',
					cssClass: 'txtalign-right',
					width: 100,
					cellType: {
						formatFilter: 'comma'
					}
				});
				// 在庫数構成比
				var id_stockComp = 'stockComp';
				hdCol[id_stockComp] = {
					colspan	: 2,
					name : '在庫数構成比',
				};
				bdCol.push({
					id: id_stockComp,
					name: '本年',
					field: id_stockComp,
					cssClass: 'txtalign-right',
					width: 100,
					cellType: {
						formatFilter: 'comma'
					}
				});
				bdCol.push({
					id: 'stockCompPrev',
					name: '前年',
					field: 'stockCompPrev',
					cssClass: 'txtalign-right',
					width: 100,
					cellType: {
						formatFilter: 'comma'
					}
				});
				// 在庫日数
				var id_stockNOD = 'stockNOD';
				hdCol[id_stockNOD] = {
					colspan	: 2,
					name : '在庫日数',
				};
				bdCol.push({
					id: id_stockNOD,
					name: '本年',
					field: id_stockNOD,
					cssClass: 'txtalign-right',
					width: 100,
					cellType: {
						formatFilter: 'comma'
					}
				});
				bdCol.push({
					id: 'stockNODPrev',
					name: '前年',
					field: 'stockNODPrev',
					cssClass: 'txtalign-right',
					width: 100,
					cellType: {
						formatFilter: 'comma'
					}
				});
			}

			this.colhdMetadatas.push({columns: hdCol});
			this.columns = bdCol;
		},

		renderGrid: function(data){
			this.dataGrid.render().setData({
				gridOptions: {
//					rowHeight: 40,
					autoHeight: false,
//					frozenRow: 2,
					frozenColumn: this.colHead,
				},
				colhdMetadatas: this.colhdMetadatas,
				columns: this.columns,
				data: data.body,
			});
		},

		_eof: 'AMBRV0030.MainView//'
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
