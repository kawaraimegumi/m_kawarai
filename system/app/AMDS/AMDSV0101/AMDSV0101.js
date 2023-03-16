// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'			:	'_onSrchClick',			// 検索ボタン押下時
			'click #ca_link_itemCode'	:	'_onLinkItemCodeClick',	// 品番別振分一覧リンク押下時
			'change #ca_srchUnitID'		:	'_onSrchUnitChanged',	// 事業ユニットが変更された
			'click #ca_btn_org_select'	:	'_onOrgSelClick',		// 組織選択
			'change #ca_srchItemCode'	:	'_onSrchItemCodeChange',	// メーカー品番が変更された
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
			var _this = this;
			clutil.inputlimiter(this.$el);

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 検索日(発注開始日)
				datepicker: {
					el: "#ca_srchStOdrDate"
				},
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrpID",
				},
				// サイズパターン
				'clsizeptn_byitgrpselector': {
					el: "#ca_srchSizePtnID",
					dependSrc: {
						itgrp_id: 'itgrp_id'
					}
				},
//				// ブランド
//				'clitemattrselector brand': {
//					el: "#ca_srchBrandID",
//					dependSrc: {
//						iagfunc_id: 'brand_id'
//					}
//				},
//				// スタイル
//				'clitemattrselector style': {
//					el: "#ca_srchStyleID",
//					dependSrc: {
//						iagfunc_id: 'style_id'
//					}
//				},
				// 色
				'clitemattrselector color': {
					el: "#ca_srchColorID",
					dependSrc: {
						iagfunc_id: 'color_id'
					}
				},
//				// 柄
//				'clitemattrselector design': {
//					el: "#ca_srchDesignID",
//					dependSrc: {
//						iagfunc_id: 'design_id'
//					}
//				},
//				// サブクラス1
//				'clitemattrselector subclass1': {
//					el: "#ca_srchSubCls1ID",
//					dependSrc: {
//						iagfunc_id: 'subclass1_id'
//					}
//				},
//				// サブクラス2
//				'clitemattrselector subclass2': {
//					el: "#ca_srchSubCls2ID",
//					dependSrc: {
//						iagfunc_id: 'subclass2_id'
//					}
//				},
//				// プライスライン
//				'select priceline': {
//					el: "#ca_srchPriceLineID",
//					depends: ['itgrp_id'],
//					getItems: function (attrs) {
//						var ret = clutil.clpriceline(attrs.itgrp_id);
//						return ret.then(function (data) {
//							return _.map(data.list, function(item) {
//								return {
//									id: item.pricelineID,
//									code: item.pricelineCode,
//									name: item.pricelineName
//								};
//							});
//						});
//					}
//				}
				// 組織オートコンプリート
				clorgcode: {
					el: '#ca_srchOrgID',
					// p_org_idに依存するために必要
					addDepends: ['p_org_id'],
					dependSrc: {
						// unit_idをp_org_idに設定するために必要
						p_org_id: 'unit_id'
					}
				},
			}, {
				dataSource: {
//					brand_id: clconst.ITEMATTRGRPFUNC_ID_BRAND,
//					style_id: clconst.ITEMATTRGRPFUNC_ID_STYLE,
					color_id: clconst.ITEMATTRGRPFUNC_ID_COLOR,
//					design_id: clconst.ITEMATTRGRPFUNC_ID_DESIGN,
//					subclass1_id: clconst.ITEMATTRGRPFUNC_ID_SUBCLS1,
//					subclass2_id: clconst.ITEMATTRGRPFUNC_ID_SUBCLS2,
					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_ORG_LEVELID'))
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
				_this.listenTo(this.fields.clbusunitselector, "change", _this._onSrchUnitChanged);
				_this.listenTo(this.fields.clorgcode, "change", _this._onSrchOrgChanged);
				_this._onSrchUnitChanged();
			});

			// 発注日
//			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchStOdrDate'));
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchEdOdrDate'));
			// 納品日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchStDlvDate'));
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchEdDlvDate'));

			// メーカー
			clutil.clvendorcode(this.$("#ca_srchMakerID"), {
				getVendorTypeId: function() {
					return amdb_defs.MTTYPE_F_VENDOR_MAKER;	// メーカー
				},
			});

			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLmakerItemCodeCompleted', this._onCLmakerItemCodeComplete);

			// 納品形態
			clutil.cltypeselector(this.$("#ca_srchDlvType"), amcm_type.AMCM_TYPE_DIST_DLV_ROUTE, 1);

			// 伝票発行状態
			clutil.cltypeselector(this.$("#ca_srchStatus"), amcm_type.AMCM_TYPE_SLIP_ISSUE, 1);

			// 組織部品
			this.AMPAV0020Selector = new AMPAV0020SelectorView({
				el: $("#ca_AMPAV0020_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});
			// 選択サブ画面復帰処理
			this.AMPAV0020Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 組織を取出す
					data[0].id = data[0].val;
//					_this.orgAutocomplete.setValue(data[0]);
					$('#ca_srchOrgID').autocomplete('clAutocompleteItem', data[0]);
					mainView.attr = data[0].attr;
				} else {
//					var org = _this.orgAutocomplete.getValue();
//					if (org.id == 0) {
//						_this.AMPAV0020Selector.clear();
//					}
					var chk = $('#ca_srchOrgID').autocomplete('clAutocompleteItem');
					if (chk === null || chk.length == 0) {
						_this.AMPAV0020Selector.clear();
					}
				}
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_org_select"));
				});
			};
			this.AMPAV0020Selector.render();
			this.AMPAV0020Selector.clear = function() {
//				_this.orgAutocomplete.resetValue();
				if (typeof mainView != "undefined") {
					$('#ca_srchOrgID').autocomplete('removeClAutocompleteItem');
				}
				mainView.attr = 0;
			};
			// 組織コンプリート
//			this.orgAutocomplete = this.getOrg(clcom.userInfo.unit_id);

////			var orgID = null;
//			if (clcom.userInfo && clcom.userInfo.org_id && clcom.userInfo.org_kind_typeid) {
//				// 組織表示
////				var code = (clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID')) ||
////						clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')))
////						? '' : clcom.userInfo.org_code ;
////				orgID = {
////					id: clcom.userInfo.org_id,
////					code: code,
////					name: clcom.userInfo.org_name
////				};
//				if (clcom.userInfo.user_typeid && (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN)) {
//					// 店舗ユーザー
//					clutil.inputReadonly($("#ca_srchOrgID"));
//					clutil.inputReadonly($("#ca_btn_org_select"));
//				}
//			}

			// 初期値を設定
			this.deserialize({
				// 初期値->ログインユーザの事業ユニット
				srchUnitID: clcom.userInfo.unit_id,		// 事業ユニット
				srchItgrpID: 0,							// 品種
//				srchBrandID: 0,							// ブランド
//				srchStyleID: 0,							// スタイル
				srchColorID: 0,							// 色
//				srchDesignID: 0,						// 柄
//				srchPriceLineID: 0,						// プライスライン
//				srchSubCls1ID: 0,						// サブクラス1
//				srchSubCls2ID: 0,						// サブクラス2
				srchMakerID: 0,							// メーカー
				srchItemCode: null,						// メーカー品番
				srchDlvType: 0,							// 納品形態
				srchOrgID: null,						// 組織
				srchStOdrDate: clcom.getOpeDate(),		// 発注日(開始日) yyyymmdd
				srchEdOdrDate: 0,						// 発注日(終了日) yyyymmdd
				srchStDlvDate: 0,						// 納品日(開始日) yyyymmdd
				srchEdDlvDate: 0,						// 納品日(終了日) yyyymmdd
				srchStatus: 0							// 伝票発行状態
			});

//			// イベント
//			this.orgAutocomplete.on('change', function(item) {
//				mainView.attr = item.orglevel_level;
//			});
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
		isValid: function(){
			var retStat = true;

			if(!this.validator.valid()){
				retStat = false;
			}

			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_srchStOdrDate',
				edval : 'ca_srchEdOdrDate'
			});
			chkInfo.push({
				stval : 'ca_srchStDlvDate',
				edval : 'ca_srchEdDlvDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return false;
			}

			// 品種コード・オートコンプリート設定チェック
			if(!this.$('#ca_srchItgrpID').autocomplete('isValidClAutocompleteSelect')){
				// エラーメッセージを通知。
				var arg = {
					_eb_: '品種コードの選択が正しくありません。選択肢の中から指定してください。',
					srchItgrpID: '選択肢の中から指定してください。'
				};
				this.validator.setErrorInfo(arg, {prefix: 'ca_'});
				return false;
			}

			return true;
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 品種コード・オートコンプリート設定チェック
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			//this.trigger('ca_onSearch', dto);
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		/**
		 * 品番別振分一覧リンク押下処理
		 */
		_onLinkItemCodeClick: function(e) {
			var url = clcom.appRoot + '/AMDS/AMDSV0100/AMDSV0100.html';
			var myData, destData;
			myData = {
				savedReq: null,
				savedCond: this.serialize(),
				selectedIds: []
			};
			destData = {
				// TODO;参照でいいのか？
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
			};
			clcom.pushPage(url, destData, myData);
		},

		/**
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
			//console.log(e);
			if(this.deserializing){
				// データセット中
				return;
			}
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				return;
			}
//			var unitID = Number($(e.target).val());
//			this.getOrg(unitID);
//			this.orgAutocomplete.setValue();
			var unitID = Number($('#ca_srchUnitID').val());
			this.$("#ca_srchOrgID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_org_select").attr("disabled", (unitID == 0));
			mainView.attr = 0;
		},

		/**
		 * 組織が変更されたイベント
		 */
		_onSrchOrgChanged: function(item){
			console.log(arguments);
			mainView.attr = item.orglevel_level;
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
		 * 組織［参照］ボタンクリック
		 */
		_onOrgSelClick: function(e){
			var func_id = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
			var r_org_id = this.$("#ca_srchUnitID").val() == 0 ? 3 : Number(this.$("#ca_srchUnitID").val());
			// 3 は　(株)AOKIのorg_id いつでも触れるようにするならパラメータ化が必要
			// ＋組織画面側で選択した事業ユニットの渡しが必要となる。
//			var initData = {};
//			initData.func_id = Number(clutil.getclsysparam("PAR_AMMS_DEFAULT_ORG_FUNCID", 1));
			this.AMPAV0020Selector.show(null, false, func_id, null, null, r_org_id);
		},

		/**
		 * メーカー品番
		 */
		_onSrchItemCodeChange: function (e) {
			console.log(e);
			var data_itgrp = $('#ca_srchItgrpID').autocomplete('clAutocompleteItem');
			if (!data_itgrp) {
				return;
			}
			var data_maker = $('#ca_srchMakerID').autocomplete('clAutocompleteItem');
			if (!data_maker) {
				return;
			}
			console.log(data_maker);

			var maker_code = $(e.target).val();
			if (maker_code == 0) {
				return;
			}

			var itgrp_id = data_itgrp.id;
			var maker_id = data_maker.id;
			var makeritemcode = {
				itgrp_id: itgrp_id,
				maker_id: maker_id,
				maker_code: maker_code,
			};
			console.log(makeritemcode);

			clutil.clmakeritemcode2item(makeritemcode, e);
		},

		/**
		 * メーカー品番→商品取得完了イベント
		 * @param data
		 * @param e
		 */
		_onCLmakerItemCodeComplete: function(data, obj) {
			var rec = data.data.rec;
			// item保存(MtItem)
			this.itemID = rec.itemID;
		},

		_eof: 'AMDSV0101.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		initialize: function(){
			_.bindAll(this);
//			var _this = this;

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '店舗別振分',
				subtitle: '一覧',
				opebtn_auto_enable: false		// false ⇒ 行選択のときに編集ボタンの活性化コントロールはアプリで制御する
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMDSV0100 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDSV0100'; //'AMDSV0101';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			// イベント
			//this.srchCondView.on('ca_onSearch', this._onSrch);
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
//			'click div#title p.addNew>a'	: '_onNewClick',			// 新規押下
//			'click #ca_edit'				: '_onEditClick',			// 編集ボタン押下
//			'click #ca_delete'				: '_onDeleteClick',			// 削除ボタン押下
//			'click #ca_rsvcancel'			: '_onReserveCancelClick'	// 予約取消ボタン押下
			clutil.mediator.on('onOperation', this._doOpeAction);

			// 行選択イベント
			clutil.mediator.on('onRowSelectChanged', this._setOpeButtonUI);
		},

		/**
		 * テーブルのレコード選択の変更イベント
		 */
		_setOpeButtonUI: function(groupid, arg, from){
			var selectedRecs = arg.selectedRecs;
			console.log(selectedRecs);
			var edit = true;
			var copy = true;
			var del = true;
			if (selectedRecs.length == 0) {
				edit = false;
				copy = false;
				del = false;
			}
			if (selectedRecs.length != 1) {
				copy = false;
				del = false;
			}
			$.each(selectedRecs,function(){
				if (this.status == amcm_type.AMCM_VAL_SLIP_ISSUE_NOT_YET) {
					edit = false;
					del = false;
					return false;
				}
				if (this.odrDate < clcom.getOpeDate()) {
					edit = false;
					del = false;
					return false;
				}
			});
			this.setButtonEnable(edit, copy, del);
		},

		/**
		 * ボタンの活性/非活性を設定する
		 */
		setButtonEnable: function(edit, copy, del){
			if (edit) {
				this.$('#cl_edit').removeAttr('disabled');
			} else {
				this.$('#cl_edit').attr('disabled', 'disabled');
			}
			if (copy) {
				this.$('#cl_copy').removeAttr('disabled');
			} else {
				this.$('#cl_copy').attr('disabled', 'disabled');
			}
			if (del) {
				this.$('#cl_delete').removeAttr('disabled');
			} else {
				this.$('#cl_delete').attr('disabled', 'disabled');
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			this.recListView.initUIElement();

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
			this.recListView.render();

			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}

			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				if(this.srchCondView.isValid()){
					srchReq = this.srchCondView.serialize();
				}else{
					// メッセージは、srchConcView 側で出力済。
					return;
				}
			}
			// 結果表示種別
			srchReq.srchResultType = AMDSV0100Req.AMDSV0100_RESULTTYPE_STORE;	// 店舗別
			// ゾーン、エリア、店舗設定
			var zoneID = Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID'));
			var areaID = Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID'));
			var storeID = Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'));
			switch (this.attr) {
			case zoneID:
				srchReq.srchZoneID = srchReq.srchOrgID;
				break;
			case areaID:
				srchReq.srchAreaID = srchReq.srchOrgID;
				break;
			case storeID:
				srchReq.srchStoreID = srchReq.srchOrgID;
				break;
			default:
				break;
			}
			delete srchReq.srchOrgID;
			srchReq.srchOrgID = srchReq._view2data_srchOrgID_cn;

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
				AMDSV0100GetReq: srchReq
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
			console.log(arguments);
			if(groupid !== 'AMDSV0100'){ //'AMDSV0101'){
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
		 * @param chkData 初期選択行データ（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			console.log(srchReq);
			this.clearResult();

			var defer = clutil.postJSON('AMDSV0100', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMDSV0100GetRsp.storeRecords;
				if(_.isEmpty(recs)){
					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					// 画面を一旦リセット
					mainView.srchAreaCtrl.reset();
					// 検索ペインを表示
					mainView.srchAreaCtrl.show_srch();
					this.setButtonEnable(false, false, false);
					return;
				}

				var no = 1;
				$.each(recs,function(){
					this.no = no++;
					this.statusDispName = clutil.gettypename(amcm_type.AMCM_TYPE_SLIP_ISSUE, this.status, 1);
					this.dlvTypeDispName = clutil.gettypename(amcm_type.AMCM_TYPE_DIST_DLV_ROUTE, this.dlvType, 1);
				});

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);

				// 初期選択の設定（オプション）
				if(!_.isEmpty(chkData)){
					this.recListView.setSelectRecs(chkData, true, ['id', 'odrDate', 'dlvDate', 'dlvType', 'centerID', 'centerDlvDate', 'custType', 'emergencyType', 'status']);
				}

				this.resetFocus($focusElem);
			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				this.resetFocus($focusElem);

			}, this));

			return defer;
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
			var defer = clutil.postDLJSON('AMDSV0100', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 初期フォーカス
		 */
		setFocus: function(){
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.setFocus($('#ca_srchItgrpID'));
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFirstFocus($focusElem);
			}else{
//			if (this.$('#searchAgain').css('display') == 'none') {
//				// 検索ボタンにフォーカスする
//				this.$('#ca_srch').focus();
//			} else {
//				// 条件を追加ボタンにフォーカスする
//				this.$('#ca_AMRSV0010_add').focus();
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧画面では使用しない*/, e){
			var url = clcom.appRoot + '/AMDS/AMDSV0111/AMDSV0111.html';
			var myData, destData, selectedRecs;
			var itgrp = $("#ca_srchItgrpID").autocomplete('clAutocompleteItem');
			var itgrp_id = itgrp != null ? itgrp.id : 0;

			if(this.savedReq){
				// 検索結果がある場合
				selectedRecs = this.recListView.getSelectedRecs();
				_.each(selectedRecs, function(v) {
					v.itgrp_id = itgrp_id;
				});
				myData = {
					btnId: e.target.id,
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMDSV0100GetReq,
					chkData: selectedRecs
				};
				destData = {
					opeTypeId: rtyp,
					unitID: this.savedReq.AMDSV0100GetReq.srchUnitID,
					sizePtnID: this.savedReq.AMDSV0100GetReq.srchSizePtnID,
					chkData: (rtyp === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL)
					? [ this.recListView.getLastClickedRec() ] : selectedRecs
				};
			}else{
				// 検索結果が無い場合
				myData = {
					btnId: e.target.id,
					savedReq: null,
					savedCond: this.srchCondView.serialize(),
					selectedIds: []
				};
				destData = {
					opeTypeId: rtyp
				};
			}

			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				// データが無くても可
				clcom.pushPage(url, destData, myData);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:	// 複製
				// チェックされたデータが必要（１）
				// fall through
				if(destData.chkData && destData.chkData.length >= 2){
					// 複数行選択されている		-- そもそもボタンを押せなくしているのでありえない
					console.warn('rtyp[' + rtyp + ']: '
							+ selectedRows.length + ' items selected, but single select only.');
					return;
				}
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
				// チェックされたデータが必要（Ｎ）
				if(_.isEmpty(destData.chkData)){
					// 行選択がない				-- そもそもボタンを押せなくしている
					console.warn('rtyp[' + rtyp + ']: item not specified.');
					return;
				}
				clcom.pushPage(url, destData, myData);
				break;
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
//				this.doDownload();
//				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				var lastClickedRec = this.recListView.getLastClickedRec();
				if(_.isEmpty(lastClickedRec)){
					// 最後にクリックした行データがとれなかった
					console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
					return;
				}
				lastClickedRec.itgrp_id = itgrp_id;
				destData.chkData = [ lastClickedRec ];

				// 別窓で照会画面を起動
				clcom.pushPage({
					url: url,
					args: destData,
					newWindow: true
				});
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

			// テーブルをクリア
			this.recListView.clear();
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

		_eof: 'AMDSV0101.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();
		mainView.setFocus();

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
