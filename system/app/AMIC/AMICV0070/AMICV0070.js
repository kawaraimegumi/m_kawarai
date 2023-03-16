/**
 *  ロス追求(ページャー対応版)
 */

useSelectpicker2();

/**
 * ブラウザのウィンドウサイズに合わせて、データグリッドの高さを調整する
 * @param options
 * @return
 */
var ResizeWatcher = function(options){
	this.options = options;
	_.defaults(options, {
		minHeight: 290
		//minHeight: 150
	});
	this.$el = options.$el;
	this.$container = $(window);
	this.setSize = _.debounce(this.setSize, 100);
	this.start();
};

_.extend(ResizeWatcher.prototype, Backbone.Events, {
	resize: function(){
		var windowHeight = window.innerHeight;
		var offset = this.$el.offset();
		//var height = windowHeight - offset.top - 100;
		var height = windowHeight - offset.top - 200;
		if (this.previousHeight != height){
			this.setSize({
				height: height
			});
		}
	},

	setSize: function(size){
		this.$el.height(Math.max(size.height, this.options.minHeight));
		this.trigger('resize');
		this.previousHeight = size.height;
	},

	start: function(){
		var that = this;
		this.tid = setInterval(function(){
			that.resize();
		}, 200);
	},

	stop: function(){
		if (this.tid){
			clearTimeout(this.tid);
		}
	}
});

$(function(){

	//自動一時保存対応 #20151117
	var inAutoTmpSave = false;
	var inAutoTmpSaveCommit = null;

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var checkTagCodeError = function(){
		// サーバ問い合わせ(品種, 商品名の取得)に失敗し
		// たときこのセルにエラーを設定するバリデータ関数(★)

		// バリデータ関数からはthis.itemで行データにアクセスで
		// きる。サーバ問い合わせ失敗したときにtagCodeErrorに
		// エラーメッセージを設定している。バリデータ関数からエ
		// ラーメッセージを戻したときこのセルに対してエラーが設
		// 定される。
		return this.item.itemError;
	};

	// グリッドのデフォルトフォーマッタをエスケープ処理しないように上書きする。
	ClGrid.Formatters.defaultFormatter = function(value) {
		if (value == null) return '';
		return value;
	};

	/**
	 * MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
	 * システムパラメータを取得しておく
	 */
	var mySysparam = clcom.getSysparam('PAR_AMIC_AMICV0070_HOLD_SUBCLASS1');
	var mySysparamList = mySysparam != null ? mySysparam.split(',') : [];
	console.log('mySysparam[' + mySysparam + ']');
	console.log('mySysparamList[' + mySysparamList + ']');

	/**
	 * MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
	 * 「修正理由」のリスト（「８：在庫据え置き」を除いたもの）を取得しておく
	 * clcom.getTypeList(amcm_type.AMCM_TYPE_INV_FIX_REASON, [id1,id2,id3...])
	 */
	var myInvFixReasonList = clcom.getTypeList(amcm_type.AMCM_TYPE_INV_FIX_REASON);

	/**
	 * データグリッドのカラム定義
	 */
	var columns = [
		{ id: 'col_00', name: 'No.', field: 'seqNumber', width: 60, cssClass: 'txtalign-right' },	// 自前でナンバリングする #20150704
		{ id: 'col_01', name: '差異分類', field: 'diffID', width: 80 },
		{ id: 'tagCode', name: 'タグコード', field: 'tagCode', width: 150,
			cellType: {
				type: 'text',
				//limit: 'digit len:13',
				validator: [function(value){
					return clutil.Validators.checkAll('digit min:0 maxlen:13', value);
				}, checkTagCodeError],
				isEditable: function(item){
					return Boolean(item.isNew);
				}
			}
		},
		{ id: 'col_03', name: '商品名', field: 'itemName', width: 250 },

		{
			// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
			id: 'hold',
			name: "据え置き",
			field: "hold",
			width: 80,
			cellType: {
				// チェックボックス
				type: 'checkbox',

				isEditable: function(item){
					return Boolean(item.canChange);
				}
			}
		},
		{
			id: 'lossQy',
			name: "ロス数",
			field: "lossQy",
			width: 80,
			cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
		},
		{
			id: 'stockQy',
			//name: '帳簿<br>在庫数',
			name: '帳簿在庫数',
			field: 'stockQy',
			width: 100,
			cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
		},
		// MD-3591 EWS関連要望_②棚卸客注売上の返品・再売上不要化_PGM開発（客注数、EWS客注数の列を追加）
		{
			id: 'coQy',
			name: '客注数',
			field: 'coQy',
			width: 80,
			cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
		},
		{
			id: 'ewsCoQy',
			name: 'EWS客注数',
			field: 'ewsCoQy',
			width: 90,
			cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
		},
		{
			id: 'invQy',
//			name: '棚卸<br>在庫数',
			name: '棚卸在庫数',
			field: 'invQy',
			width: 100,
			cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
		},
		{
			id: 'reInvQy',
			name: "再棚卸数",
			field: "reInvQy",
			width: 80,
			cssClass: 'txtalign-right',
			cellType: {
				type: 'text',
				// カンマ区切り
				formatFilter: 'comma',
				//limit: 'digit len:6',

				// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
				isEditable: function(item){
					if(item.hold === 1) {
						return Boolean(false);
					} else {
						return Boolean(true);
					}
				},

				// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
				validator: [function(){
					if (this.item.hold === 1) {
						// 「据え置き」チェックON時はマイナス値入力OK
						return clutil.Validators.checkAll({
							validator: 'decimal:6,0 min:-999999 max:999999',
							value: this.item.reInvQy
						});
					} else {
						// 「据え置き」チェックOFF時はマイナス値入力NG
						return clutil.Validators.checkAll({
							validator: 'digit min:0 maxlen:6',
							value: this.item.reInvQy
						});
					}
				}]
			},
		},
		{
			id: 'reason',
			name: '修正理由',
			field: 'reason',
			width: 150,
			cellType: {
				type: "cltypeselector",

				// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
				// formatter 追加、editorOptionsで選択肢の切り替え、isEditable 追加

				formatter: function(value, options) {
					var label = "";

					var result = myInvFixReasonList.filter(function(val, index, array) {
						if (val.type_id === value) {
							label = val.code + ":" + val.name;
						}
					});
					return label;
				},

				editorOptions: function(item){
					if (item.hold === 1) {
						var options = {
								kind: amcm_type.AMCM_TYPE_INV_FIX_REASON,
								ids : [amcm_type.AMCM_VAL_INV_FIX_REASON_INV008]
						};
						return options;
					} else {
						var options = {
							kind: amcm_type.AMCM_TYPE_INV_FIX_REASON,
							ids : [
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV001,
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV002,
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV003,
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV004,
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV005,
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV006,
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV007
								]
						};
						return options;
					}
				},

				isEditable: function(item){
					if(item.hold === 1) {
						return Boolean(false);
					} else {
						return Boolean(true);
					}
				},
			}
		},
		{ id: 'col_09', name: '棚番', field: 'rackNo', width: 230},

		{ id: 'col_10', name: "品種", field: "stditgrpName", width: 150 },
		{ id: 'col_11', name: "サブクラス１", field: "subClass1Name", width: 150 },
		{ id: 'col_12', name: "サブクラス２", field: "subClass2Name", width: 150 },
		{ id: 'col_13', name: 'カラー', field: 'colorName', width: 100 },
		{ id: 'col_14', name: 'サイズ', field: 'sizeName', width: 100 },
		{ id: 'col_15', name: 'シーズン', field: 'seasonName', width: 100 },
		{ id: 'col_16', name: 'メーカー', field: 'makerName', width: 150 },
		{ id: 'col_17', name: 'メーカー品番', field: 'makerCode', width: 150 }
	];

	var columns2 = [
		{ id: 'col_00', name: 'No.', field: 'seqNumber', width: 60, cssClass: 'txtalign-right' },	// 自前でナンバリングする #20150704
		{ id: 'col_01', name: '差異分類', field: 'diffID', width: 80 },
		{ id: 'tagCode', name: 'タグコード', field: 'tagCode', width: 150,
			cellType: {
				type: 'text',
				//limit: 'digit len:13',
				validator: [function(value){
					return clutil.Validators.checkAll('digit min:0 maxlen:13', value);
				}, checkTagCodeError],
				isEditable: function(item){
					return Boolean(item.isNew);
				}
			}
		},
		{ id: 'col_03', name: '商品名', field: 'itemName', width: 250 },

		{
			// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
			id: 'hold',
			name: "据え置き",
			field: "hold",
			width: 80,
			cellType: {
				// チェックボックス
				type: 'checkbox',

				isEditable: function(item){
					return Boolean(item.canChange);
				}
			}
		},
		{
			id: 'lossQy',
			name: "ロス数",
			field: "lossQy",
			width: 80,
			cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
		},
		{
			id: 'stockQy',
			//name: '帳簿<br>在庫数',
			name: '帳簿在庫数',
			field: 'stockQy',
			width: 100,
			cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
		},
		// MD-3591 EWS関連要望_②棚卸客注売上の返品・再売上不要化_PGM開発（客注数、EWS客注数の列を追加）
		{
			id: 'coQy',
			name: '客注数',
			field: 'coQy',
			width: 80,
			cssClass: 'txtalign-right',
			cellType: {
				type: 'text',
				// カンマ区切り
				formatFilter: 'comma',
				validator: 'decimal:6,0 min:-999999 max:999999',
//				value: this.item.coQy
			}
		},
		{
			id: 'ewsCoQy',
			name: 'EWS客注数',
			field: 'ewsCoQy',
			width: 90,
			cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
		},
		{
			id: 'invQy',
//			name: '棚卸<br>在庫数',
			name: '棚卸在庫数',
			field: 'invQy',
			width: 100,
			cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
		},
		{
			id: 'reInvQy',
			name: "再棚卸数",
			field: "reInvQy",
			width: 80,
			cssClass: 'txtalign-right',
			cellType: {
//				type: 'text',
				// カンマ区切り
				formatFilter: 'comma',
				//limit: 'digit len:6',

//				// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
//				isEditable: function(item){
//					if(item.hold === 1) {
//						return Boolean(false);
//					} else {
//						return Boolean(true);
//					}
//				},
//
//				// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
//				validator: [function(){
//					if (this.item.hold === 1) {
//						// 「据え置き」チェックON時はマイナス値入力OK
//						return clutil.Validators.checkAll({
//							validator: 'decimal:6,0 min:-999999 max:999999',
//							value: this.item.reInvQy
//						});
//					} else {
//						// 「据え置き」チェックOFF時はマイナス値入力NG
//						return clutil.Validators.checkAll({
//							validator: 'digit min:0 maxlen:6',
//							value: this.item.reInvQy
//						});
//					}
//				}]
			},
		},
		{
			id: 'reason',
			name: '修正理由',
			field: 'reason',
			width: 150,
			cellType: {
				type: "cltypeselector",

				// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
				// formatter 追加、editorOptionsで選択肢の切り替え、isEditable 追加

				formatter: function(value, options) {
					var label = "";

					var result = myInvFixReasonList.filter(function(val, index, array) {
						if (val.type_id === value) {
							label = val.code + ":" + val.name;
						}
					});
					return label;
				},

				editorOptions: function(item){
					if (item.hold === 1) {
						var options = {
								kind: amcm_type.AMCM_TYPE_INV_FIX_REASON,
								ids : [amcm_type.AMCM_VAL_INV_FIX_REASON_INV008]
						};
						return options;
					} else {
						var options = {
							kind: amcm_type.AMCM_TYPE_INV_FIX_REASON,
							ids : [
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV001,
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV002,
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV003,
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV004,
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV005,
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV006,
								amcm_type.AMCM_VAL_INV_FIX_REASON_INV007
								]
						};
						return options;
					}
				},

				isEditable: function() {
					return Boolean(false);
				},
//
//				isEditable: function(item){
//					if(item.hold === 1) {
//						return Boolean(false);
//					} else {
//						return Boolean(true);
//					}
//				},
			}
		},
		{ id: 'col_09', name: '棚番', field: 'rackNo', width: 230},

		{ id: 'col_10', name: "品種", field: "stditgrpName", width: 150 },
		{ id: 'col_11', name: "サブクラス１", field: "subClass1Name", width: 150 },
		{ id: 'col_12', name: "サブクラス２", field: "subClass2Name", width: 150 },
		{ id: 'col_13', name: 'カラー', field: 'colorName', width: 100 },
		{ id: 'col_14', name: 'サイズ', field: 'sizeName', width: 100 },
		{ id: 'col_15', name: 'シーズン', field: 'seasonName', width: 100 },
		{ id: 'col_16', name: 'メーカー', field: 'makerName', width: 150 },
		{ id: 'col_17', name: 'メーカー品番', field: 'makerCode', width: 150 }
	];

	/**
	 * カラム作成
	 */
	function buildColumns() {
		var user_store = clcom.userInfo['org_id'];
		var json = localStorage.getItem('clcom.rfidstore');
		var rfid_list = JSON.parse(json);
		var rfid_flg = 0;
		if (clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
			if (rfid_list.includes(user_store)) {
				rfid_flg = 1;
			}
		}
		if (rfid_flg == 0) {
			var cols = _.deepClone(columns);
		} else {
			var cols = _.deepClone(columns2);
		}
//		var cols = _.deepClone(columns);
		return cols;
	}

	/**
	 * カラムヘッダ部のメタデータ定義
	 * ★カラムグループを定義してみる。
	 */
	var colhdMetadatas = [
		{
			columns: {
				_lineno: {// 行番号オプション lineno = true 指定の場合、ここは行番号列
				},
				hold: {// カラム[タイトル]
					colspan: 7,
					name: '在庫情報　※客注数とは、客注中で入荷予定となっている商品の数量です。',
					expander: true			// Expander トグルをつける。
				},
				col_10: {// カラム[Start]
					colspan: 8,
					name: '商品情報',
					expander: true			// Expander トグルをつける。
				}
			}
		}
	];

	/**
	 * カラムヘッダ部のメタデータ作成
	 */
	function buildColhdMetadatas() {
		var colhdm = _.deepClone(colhdMetadatas);
		return colhdm;
	}

	var _unitID = "";

	//////////////////////////
	// 条件入力部
	var SrchCondView = Backbone.View.extend({

		el: $('#ca_srchArea'),

		events: {
			'click #ca_srch'					: '_onSrchClick'			// 検索ボタン押下時
		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){

			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			this.relation = clutil.FieldRelation.create("default", {
				// 店舗
				clorgcode: {
					el: '#ca_srchStoreID',
					branches: ['unit_id']
				},

				// 品種
				clvarietycode: {
					el: '#ca_srchStditgpID',
					rmDepends: ['unit_id']
					/* 事業ユニット跨ぎ品種選択のサポート #201507020 */
					////, addDepends: ['org_id']
				},

				// 棚卸スケジュール用対象期取得部品
				clinventcntschselector: {
					el: this.$('#ca_srchYearMonth'),
					addDepends: ['org_id']
				}
			}, {
				dataSource: {
					// 上位組織を事業ユニットIDで選択されているものに設
					// 定する => たぶん指定してはだめ
					// p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ))
				}
			});
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
			return this.validator.valid();
		},

		/**
		 * 検索条件の入力ブロッキング/解除
		 */
		setEnable: function(enable){
			if(enable){
				clutil.viewRemoveReadonly(this.$el);
			}else{
				clutil.viewReadonly(this.$el);
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
			this.trigger('ca_onSearch', dto);
		},

		_eof: 'AMICV0070.SrchCondView//'
	});


	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({

		el:	$('#ca_main'),

		events: {

			'click #ca_btn_store_select'	: '_onStoreSelClick',	// 店舗選択
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		/**
		 * ページャー作成
		 */
		buildPaginationView: function(groupid, $elem){
			var pagerViews = [];
			$.each($elem.find('.pagination-wrapper'), function(arg){
				var opt = {
					el: this,
					groupid: groupid,
					pgOptions: {
						itemsOnPageSelection: [ 20 ]
					}
				};
				pagerViews.push(new clutil.View.PaginationView(opt));
			});
			return pagerViews;
		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){

			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			var opeTypeIdElem = [];

			if (clcom.userInfo) {
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {
					// ログインユーザが店舗ユーザの場合、一時保存とロス追求完了ボタンのみ表示
					opeTypeIdElem = [
/// 障害対応暫定 #20160121
///					                 	am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE,
					                 	{
											opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
											label: 'ロス追求完了'
										}
									];
				} else {
					// ログインユーザが店舗ユーザでない場合、差戻ボタンのみ表示
					opeTypeIdElem = [
						 				am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK
									];
				}
			}

			// 出力ボタン構成
			var dlButtons = function(isKansa){
				var btns = [
					{
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF,
						label: '棚卸ロス商品追求リスト出力',
						attr: 1
					}
				];
				if(isKansa){
					btns.push({
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV,
						label: '棚卸ロス商品追求リストExcelデータ出力',
						attr: 2
					});
				}
				return btns;

			}(clcom.userInfo.user_typeid !== amcm_type.AMCM_VAL_USER_STORE);

			// 共通ビュー(共通のヘッダなど内包）
			var mdBaseViewOpt = {

				opeTypeId: opeTypeIdElem,
				title: 'ロス追求',
				btn_submit: true,
				//btn_cancel: this._onCancel,
				btn_cancel:{label:'条件再設定', action:this._onCancel},
				btns_dl: dlButtons,

				// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
				// リクエストビルダ関数を渡しておく。
				buildSubmitReqFunction: this._buildSubmitReqFunction,

				// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
				// リクエストのビルダ関数を opt で渡しておく。
				buildGetReqFunction: this._buildGetReqFunction

			};

			if(opt && opt.representOpeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
				mdBaseViewOpt.backBtnURL = false;
			}

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMICV0070 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMICV0070';

			// メニュー戻るボタン(<)押下時のメッセージ表示を抑制する
			this.mdBaseView.options.confirmLeaving = false;

			// ページャ
			this.pagerViews = this.buildPaginationView(groupid, this.$el);

			///////////////// ロス追求一覧データグリッドの表示
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid',
				// PDFに合わせるため、行番号を自前で表示する #20150704
				////lineno: true,
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ。
			});

			this.dataGrid.getMetadata = this.getMetadata;

			this.resizeWatcher = new ResizeWatcher({
				$el: this.dataGrid.$el
			});

			var dataGrid = this.dataGrid;
			var mainView = this;

			// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
			// 「据え置き」チェックボックス ON/OFF 時の処理
			this.listenTo(this.dataGrid, 'formatter:checkbox:change', function(args){
				this.dataGrid.stopEditing();

				var rowId = args.item[this.dataGrid.dataView.idProperty];
				// 「修正理由」のエラーをクリア
				this.dataGrid.clearCellMessage(rowId, 'reason');
				// 「再棚卸数」のエラーをクリア
				this.dataGrid.clearCellMessage(rowId, 'reInvQy');

				if (args.item.hold === 1) {
					// 「据え置き」チェックボックスON

					// 「修正理由」に「８：在庫据え置き」をセット
					args.item.reason = amcm_type.AMCM_VAL_INV_FIX_REASON_INV008;

					// 「再棚卸数」に「帳簿在庫数」をセット
					args.item.reInvQy = args.item.stockQy;

				} else {
					// 「据え置き」チェックボックスOFF

					// 「修正理由」をクリア（「未設定」にする）
					args.item.reason = 0;

					// 「再棚卸数」に「０」をセット
					args.item.reInvQy = 0;
				}
			});

			// タグコードから商品名を取得する
			this.graph = new clutil.Relation.DependGraph()
			.add({
				id: 'colorSizeItemID',
				depends: ['tagCode'],
				onDependChange: function(e){

					// タグコードが変更された => 品種と商品名を取得

					var model = e.model;

					// タグコードを取得
					var tagCode = model.get('tagCode');

					// 商品名を空にする関数
					var setEmpty = function(itemError){
						model.set({
							seqNumber: '',
							diffID: '',
							//tagCode: '',
							itemName: '',
							lossQy: '',
							stockQy: '',
							coQy: '',
							ewsCoQy: '',
							invQy: '',
							reInvQy: '',
							reason: '',
							rackNo: '',
							stditgrpName: '',
							subClass1Name: '',
							subClass2Name: '',
							colorName: '',
							sizeName: '',
							seasonName: '',
							makerName: '',
							makerCode: '',
							colorSizeItemID: 0,
							// サーバ問い合わせ失敗でエラーメッセージを
							// 設定する(★)
							itemError: itemError
						});
					};

					if (!tagCode){
						// 何も設定されていなければ空にして終わり
						setEmpty();
						return;
					}

					var req = {
						code : tagCode,
						unitID : _unitID
					};

					// タグコード検索
					clutil.cltag2variety(req);

					var done = e.async();
					clutil.mediator.once('onCLtag2varietyCompleted', _.bind(function(args){

						if(args.status == 'OK'){

							model.set({
								itemName : args.data.rec.itemName,
								colorSizeItemID: args.data.rec.colorSizeItemID,
								itemError: false,

								colorCode: args.data.rec.colorCode,
								colorID: args.data.rec.colorID,
								colorName: args.data.rec.colorName,
								colorSizeItemCode: args.data.rec.colorSizeItemCode,
								cost: args.data.rec.cost,
								cost_intax: args.data.rec.cost_intax,
								itemCode: args.data.rec.itemCode,
								itemID: args.data.rec.itemID,
								makerCode: args.data.rec.makerItemCode,
								makerID: args.data.rec.makerID,
								makerCd: args.data.rec.makerCode,
								makerName: args.data.rec.makerName,
								oldCode: args.data.rec.oldCode,
								price: args.data.rec.price,
								price_intax: args.data.rec.price_intax,
								sizeCode: args.data.rec.sizeCode,
								sizeID: args.data.rec.sizeID,
								sizeName: args.data.rec.sizeName,
								varietyCode: args.data.rec.varietyCode,
								varietyID: args.data.rec.varietyID,
								//varietyName: args.data.rec.varietyName
								stditgrpName: args.data.rec.varietyName
							});
						} else {

							// 検索に失敗したときはエラー
							var msg = clutil.fmt(clutil.getclmsg('EGM0016'),tagCode);
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

							setEmpty(msg);

						}
						done();

					},this));

				}
			});

			/**
			 * 新規行追加
			 */
			this.listenTo(this.dataGrid, {

				// 新規行追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {isNew: true, canChange: false, hold: 0};
					gridView.addNewItem(newItem);
				}

			});

			/////////////////////////////////////////////////////////

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
					data[0].id = data[0].val;
					// 組織表示
					this.srchCondView.relation.fields.clorgcode.setValue(data[0]);
				};
				_.defer(function(){// setFocusを_.defer()で後回しにする
					// 参照ボタンにフォーカスする
					clutil.setFocus(this.$("#ca_btn_store_select"));
				});
			},this);

			// イベント
			this.srchCondView.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageClickBefore', this._onPageClickBefore);
			clutil.mediator.on('onSelectChangeBefore', this._onPageClickBefore);
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			// 外部イベントの購読設定
			// Submit と、GET結果のデータを購読する。
			//clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);

			//更新回数ステータス設定
			this.state = {
				recno: "",
				state: 0
			};

			// ツールチップ
			$("#ca_tp_code1").tooltip({html: true});
		},

		/**
		 * 検索結果行⇒削除不可
		 * 新規追加行⇒削除可能
		 */
		getMetadata: function(rowIndex){

			// 行データ
			var item = this.dataGrid.dataView.getBodyItem(rowIndex);

			if(item.resultFlag === true){
				// 行レコードが検索結果のときは行削除不可
                return {
                    rowDelProtect: true
                };
			}
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();

			this.AMPAV0010Selector.render();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srchArea'),
					this.$('#result'),
					this.$('#searchAgain'));

			// 社員コード→ユーザーID、名称取得
			clutil.clstaffcode2($("#ca_storeManID"));

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {

			this.mdBaseView.render().setSubmitEnable(true);

			this.srchCondView.render();

			// グリッドにデータを設定する
			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,
					//autoHeight: true,
					frozenRow: 2,
					frozenColumn: 3
				},
				columns: buildColumns(),
				colhdMetadatas: buildColhdMetadatas(),
				data: [],
				rowDelToggle: true,
				graph: this.graph
			});

			// ページャーの表示
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}

			// 下部ボタン群は非表示にする
			$("#mainColumnFooter").hide();

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {

				// ログインユーザが店舗ユーザの場合は初期フォーカスを品種にセットする
				clutil.setFocus(this.$("#ca_srchStditgpID"));

			} else {

				// ログインユーザが店舗ユーザ以外の場合は初期フォーカスを店舗にセットする
				clutil.setFocus(this.$("#ca_srchStoreID"));
			};

			return this;
		},

		/**
		 * キャンセルボタン押下
		 */
		_onCancel: function(e){

			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

			// 検索エリアを入力可能にする
			this.srchCondView.setEnable(true);
			this.srchAreaCtrl.reset();

			// メニュー戻るボタン(<)押下時のメッセージ表示を抑止する
			this.mdBaseView.options.confirmLeaving = false;

			// 下部ボタン群は非表示にする
			$("#mainColumnFooter").hide();
		},

		/**
		 * GET 応答のイベントを受ける
		 * XXX: 今回は使わない
		 */
		_onMDGetCompleted: function(args, e){

			console.log('args.status: [' + args.status + ']');

			this.currentData = null;

			switch(args.status){

			case 'OK':

				// args.data をアプリ個別 View へセットする。

				this.currentData = args.data;

				// ロス追求情報を表示する
				this.data2view(args.data);

				if(args.data.AMICV0070GetRsp.inv.invStateTypeID === amcm_type.AMCM_VAL_INV_STATE_INV_REPORTED) {

					// 報告状態が棚卸報告済の場合、店長承認は操作可能
					clutil.viewRemoveReadonly(this.$("#ca_infoArea"));

					// 報告状態は常に操作不可
					clutil.inputReadonly(this.$("#ca_invStateID"));

					// 一時保存が必要なページは常に操作不可
					clutil.inputReadonly(this.$("#ca_unsaveHoldRecPageListText"));
				}

				this.state.recno = args.data.rspHead.recno;
				this.state.state = args.data.rspHead.state;

				break;

			case 'DONE':		// 確定済

				// args.data をアプリ個別 View へセットする。

				// 検索結果を画面に表示する
				this.data2view(args.data);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_infoArea"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み

				// 全 <input> は readonly 化するなどの処理。

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_infoArea"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース

				// 検索結果を画面に表示する
				this.data2view(args.data);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_infoArea"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			default:
			case 'NG':			// その他エラー。

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// 下部ボタン群は非表示にする
				$("#mainColumnFooter").hide();

				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.mdBaseView.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});

				break;
			}
		},

		/**
		 * 検索結果を画面に表示する
		 */
		data2view: function(data){

			// 店舗の属する事業ユニットを取得する
			var orgAttrs = this.srchCondView.relation.fields.clorgcode.getAttrs();
			_unitID = orgAttrs && orgAttrs.unit_id;

			this.saveData = data.AMICV0070GetRsp;

			/*// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
			if(_.isEmpty(this.saveData)){

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// 下部ボタン群は非表示にする
				$("#mainColumnFooter").hide();

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				return;
			}*/

			// 結果ペインを表示
			this.srchAreaCtrl.show_result();

			// 下部ボタン群は表示する
			$("#mainColumnFooter").show();

			// メニュー戻るボタン(<)押下時のメッセージを表示する
			this.mdBaseView.options.confirmLeaving = true;

			//// 内容物がある場合 --> 結果表示する。

			//////// 報告状態を表示する
			// 報告状態IDを取得
			var val = (this.saveData.inv && this.saveData.inv['invStateTypeID'])
			? clutil.gettypename(amcm_type.AMCM_TYPE_INV_STATE, this.saveData.inv['invStateTypeID']) : '';

			// 報告状態
			//this.$('#ca_invStateID').val(val);

			// 店長承認
			//this.$('#ca_storeManID').val(this.saveData.inv.storeManID);

			var storeManID = {};

			if(this.saveData.inv.invStateTypeID === amcm_type.AMCM_VAL_INV_STATE_INV_NOT_REPORTED ||
					this.saveData.inv.invStateTypeID === amcm_type.AMCM_VAL_INV_STATE_INV_REPORTED) {

				// 報告状態が「棚卸未報告」または「棚卸報告済」の場合、店長承認欄をクリアする
				storeManID = {
					id: 0,
					code: "",
					name: ""
				};
			} else {

				storeManID = {
					id: this.saveData.inv.storeManID,
					code: this.saveData.inv.storeManCode,
					name: this.saveData.inv.storeManName
				};
			}
			/*
			 * 未保存ページリスト
			 */
			var unsavedList = data.unsaveHoldRecPageList;
			var unsaveHoldRecPageListText = "";
			if (unsavedList != null && unsavedList.length > 0) {
				unsaveHoldRecPageListText = unsavedList.join(",");
			}

			if (unsaveHoldRecPageListText === "") {
				this.$("#div_unsavedPage").hide();
			} else {
				this.$("#div_unsavedPage").show();
			}
			var invInfo = {
				invStateID : val,
				storeManID : storeManID,
				unsaveHoldRecPageListText: unsaveHoldRecPageListText
			};

			clutil.data2view(this.$('#ca_infoArea'), invInfo);



			//////// ロス追求一覧データグリッドの内容を表示する
			var data = [];

			for(var i=0; i < this.saveData.invItemList.length; i++) {

				if(this.saveData.invItemList[i].f_dummy === 0) {

					// ダミー行でなければデータグリッドに表示する

					// 差異分類
					var diffName = clutil.gettypename(amcm_type.AMCM_TYPE_INV_DIFF_CLASS, this.saveData.invItemList[i].diffID,1);

					// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
					//「据え置き」チェックボックスの操作可／不可決定
					//　　判定：商品のサブクラス１がシスパラで設定されているサブクラス１と合致する
					//　　　　　　　かつ
					//　　　　　帳簿在庫数＜０
					//　　　　の場合、操作可
					//
					//　　　　上記以外（商品のサブクラス１がシスパラで設定されているサブクラス１と合致しない
					//　　　　　　　　　　　または
					//　　　　　　　　　帳簿在庫数≧０）
					//　　　　の場合、操作不可
					var isFind = false;
					var sub1Cd = this.saveData.invItemList[i].subClass1Cd;
					_.each(mySysparamList, function(o) {
						if (o === sub1Cd) {
							isFind = true;
						}
					});
					var canChange = false;
					if (isFind === true && this.saveData.invItemList[i].stockQy < 0) {
						canChange = true;	// 操作可
					}
//					console.log('invItemList[' + i + '].canChange=[' + canChange
//									+ '] sub1Cd=' + this.saveData.invItemList[i].subClass1Cd
//									+ ' stockQy=' + this.saveData.invItemList[i].stockQy);

					// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
					// 据え置きチェックボックス、再棚卸数、修正理由の設定値を決める
					// ●据え置きチェックボックス操作可の場合
					// 【据え置きチェックボックス】
					//   DB未登録の場合
					//     「棚卸在庫数」が「０」の場合 ON、それ以外の場合 OFF
					//   DB登録済の場合は
					//     「修正理由」が「８：在庫据え置き」の場合 ON、それ以外の場合 OFF
					// 【再棚卸数】
					//  「据え置きチェックボックス」がONの場合
					//     DB未登録の場合
					//       「棚卸在庫数」が「０」の場合「帳簿在庫数」をセット
					//     DB登録済の場合、検索結果値をセット
					//  「据え置きチェックボックス」がOFFの場合
					//     検索結果値をセット
					// 【修正理由】
					//   DB未登録の場合
					//     「棚卸在庫数」が「０」の場合「８：在庫据え置き」をセット
					//   DB登録済の場合、検索結果値をセット
					//
					//
					// ●据え置きチェックボックス操作不可の場合
					// 【据え置きチェックボックス】
					//    OFF
					// 【再棚卸数】
					//   検索結果値をセット
					// 【修正理由】
					//   DB未登録の場合、「未選択」をセット
					//   DB登録済の場合、検索結果値をセット
					var invItem = this.saveData.invItemList[i];

					var holdVal = 0;
					var reInvQyVal = invItem.reInvQy;
					var reasonVal = invItem.reason;

					if (canChange === true) {
						// 操作可の場合

						// 【据え置きチェックボックス】
						if (invItem.reInvQyRecExists === 1) {
							if (invItem.reason === amcm_type.AMCM_VAL_INV_FIX_REASON_INV008) {
								holdVal = 1;
							}
						} else {
							// 既存DBなしの場合は、「棚卸在庫数」=0 の場合のみチェックボックスON
							if (invItem.invQy === 0) {
								holdVal = 1;
							}
						}

						// 【再棚卸数】
						if (holdVal === 1) {
							if (invItem.reInvQyRecExists === 0) {
								reInvQyVal = invItem.stockQy;
							}
						}

						// 【修正理由】
						if (invItem.reInvQyRecExists === 0) {
							if (invItem.invQy === 0) {
								reasonVal = amcm_type.AMCM_VAL_INV_FIX_REASON_INV008;
							}
						}
					} else {
						// 操作不可の場合
						if (!invItem.reInvQyRecExists) {
							reasonVal = 0;
						}
					}

					data[i] = {

							// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
							canChange : canChange,

							// 検索結果レコードフラグ
							resultFlag : true,
							// 通し番号 #20150704
							seqNumber : this.saveData.invItemList[i].seqNumber,
							// 差異分類
							diffID : diffName,
							// タグコード
							tagCode : this.saveData.invItemList[i].tagCode,
							// 商品名
							itemName : this.saveData.invItemList[i].itemName,

							// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
							hold :holdVal,

							// ロス数
							lossQy : this.saveData.invItemList[i].lossQy,
							// 帳簿在庫数
							stockQy : this.saveData.invItemList[i].stockQy,
							// 客注数
							coQy : this.saveData.invItemList[i].coQy,
							// EWS客注数
							ewsCoQy : this.saveData.invItemList[i].ewsCoQy,
							// 棚卸在庫数
							invQy : this.saveData.invItemList[i].invQy,
							// 再棚卸数
							// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
							reInvQy : reInvQyVal,
							// 修正理由
							// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
							reason : reasonVal,
							// 棚番
							rackNo : this.saveData.invItemList[i].rackNo,

							// 品種
							stditgrpName : this.saveData.invItemList[i].stditgrpName,
							// サブクラス１
							subClass1Name : this.saveData.invItemList[i].subClass1Name,
							// サブクラス２
							subClass2Name : this.saveData.invItemList[i].subClass2Name,
							// カラー
							colorName : this.saveData.invItemList[i].colorName,
							// サイズ
							sizeName : this.saveData.invItemList[i].sizeName,
							// シーズン
							seasonName : this.saveData.invItemList[i].seasonName,
							// メーカー
							makerName : this.saveData.invItemList[i].makerName,
							// メーカー品番
							makerCode : this.saveData.invItemList[i].makerCode

					};
				}
			};

			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,
					//autoHeight: true,
					// XXX
					//frozenRowHeight: [65],
					frozenRowHeight: [35],
					frozenRow: 2,
					frozenColumn: 3
				},
				columns: buildColumns(),
				colhdMetadatas: buildColhdMetadatas(),
				data: data,
				rowDelToggle: true,
				graph: this.graph
			});

			if (clcom.userInfo && clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE) {

				// ログインユーザが店舗ユーザの場合
				if(this.saveData.inv.invStateTypeID !== amcm_type.AMCM_VAL_INV_STATE_INV_REPORTED) {

					// 報告状態が棚卸報告済でない場合

					clutil.viewReadonly(this.$("#ca_infoArea"));

					// 報告状態が棚卸報告済でない場合データグリッドは操作不可とする
					this.dataGrid.setEnable(false);

					if(this.savedReq.AMICV0070GetReq.srchStditgpID) {

						// 検索条件で「品種」が指定されている場合
						// 一時保存ボタンのみ表示する
						this.applySubmitButtonPattern('storeWithStditgp');

					} else {

						// 検索条件で「品種」が指定されていない場合
						// 一時保存ボタン・ロス追求完了ボタンを表示する
						this.applySubmitButtonPattern('storeWithoutStditgp');

					}

					// 一時保存ボタン・ロス追求完了ボタンを操作不可にする
					this.mdBaseView.setFooterNaviEnable(false, "submit");

				} else {

					// 報告状態が棚卸報告済の場合

//					var input = document.getElementById('coQy');
//					input.disabled = true;

					if(this.savedReq.AMICV0070GetReq.srchStditgpID) {

						// 検索条件で「品種」が指定されている場合
						// 一時保存ボタンのみ表示する
						this.applySubmitButtonPattern('storeWithStditgp');

					} else {

						// 検索条件で「品種」が指定されていない場合
						// 一時保存ボタン・ロス追求完了ボタンを表示する
						this.applySubmitButtonPattern('storeWithoutStditgp');

					}
				}

				// ダウンロードボタンは操作可能とする
				this.mdBaseView.setFooterNaviEnable(true, "download");

			} else {
				// ログインユーザが本部ユーザの場合

				// 画面入力項目はすべて操作不可とする
				clutil.viewReadonly(this.$("#ca_infoArea"));

				// データグリッドは操作不可とする
				this.dataGrid.setEnable(false);

				if(this.saveData.inv.invStateTypeID !== amcm_type.AMCM_VAL_INV_STATE_INV_FIXED) {

					// 報告状態が棚卸確定済でない場合

					if(this.savedReq.AMICV0070GetReq.srchStditgpID) {

						// 検索条件で「品種」が指定されている場合
						// 差し戻しボタンを表示しない
						this.applySubmitButtonPattern('honbuWithStditgp');

					} else {

						// 検索条件で「品種」が指定されていない場合
						// 差し戻しボタンを表示する
						this.applySubmitButtonPattern('honbuWithoutStditgp');

						// ただし、差戻しボタンは操作不可にする
						this.mdBaseView.setFooterNaviEnable(false, "submit");

					}

				} else {

					// 報告状態が棚卸確定済の場合

					if(this.savedReq.AMICV0070GetReq.srchStditgpID) {

						// 検索条件で「品種」が指定されている場合
						// 差戻しボタンを非表示にする
						this.applySubmitButtonPattern('honbuWithStditgp');

					} else {

						// 検索条件で「品種」が指定されていない場合
						// 差戻しボタンを表示する
						this.applySubmitButtonPattern('honbuWithoutStditgp');

					}
				}

				// ダウンロードボタンは操作可能とする
				this.mdBaseView.setFooterNaviEnable(true, "download");
			}
		},

		/**
		 * ログインユーザ毎に登録ボタンの表示パターンを切り替える
		 *
		 * 使い方：
		 * this.applySubmitButtonPattern('storeWithoutStditgp')
		 * this.applySubmitButtonPattern('storeWithStditgp')
		 * this.applySubmitButtonPattern('honbu');
		 */
		applySubmitButtonPattern: function(pattern){
			var opeTypeIdElem = this.submitButtonPattern[pattern];
			if(opeTypeIdElem){
				this.mdBaseView.options.opeTypeId = opeTypeIdElem;
				this.mdBaseView.renderFooterNavi();
			}
		},

		/**
		 * ログインユーザによる登録ボタンの表示パターン
		 */
		submitButtonPattern: {

			// 店舗：品種指定なし
			// [一時保存][ロス追求完了]
			storeWithoutStditgp: [
/// 障害対応暫定 #20160121
///				am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE,
				// MT-1549対応で一時保存ボタンを復活 #20160715
				am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE,
				{
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
					label: 'ロス追求完了'
				}
			],

			// 店舗：品種指定あり
			// [一時保存]
			storeWithStditgp: [
/// 障害対応暫定 #20160121
///				am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE
				// MT-1549対応で一時保存ボタンを復活 #20160715
				am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE
			],

			// 本部
			// [差戻し]
			/*honbu: [
				am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK
			]*/

			// 本部：品種指定なし
			// [差戻し]
			honbuWithoutStditgp: [
			    am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK
			],

			// 本部：品種指定あり
			// 下部ボタンなし
			honbuWithStditgp: [
			]
		},

		setNG: function(args) {
			if (args.data.rspHead.message == 'EGM0021') {
				var cellMessages = [];
				var list = this.dataGrid.getData({ delflag: false });
				var error = args.data.rspHead.fieldMessages;


				for(var i=0; i<error.length; i++){
					var line = error[i].lineno;
					var rowDto = list[line];
					var rowId = rowDto[this.dataGrid.dataView.idProperty];

					var msg = clutil.fmtargs(clutil.getclmsg(error[i].message), error[i].args);

					if (error[i].struct_name == "AMICV0070InvItem") {
						cellMessages.push({
							rowId: rowId,
							colId: error[i].field_name,
							level: 'error',
							message: msg//clutil.getclmsg(error[i].message)
						});
					}
				}


				if(!_.isEmpty(cellMessages)){
					this.dataGrid.setCellMessage(cellMessages);
				}
			} else {
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_infoArea"));
				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);
			}
		},

		/**
		 * 保存後の再描画処理
		 */
		data2redraw: function(data) {
			// 再検索結果を画面に表示
			this.data2view(data);

			// submitボタンを非活性にする
			this.mdBaseView.setFooterNaviEnable(false, "submit");

			// 初期検索時に取得したデータグリッド内容を上書き
			this.previousData = [];
			var re_data = data.AMICV0070GetRsp.invItemList;
			for(var i=0; i < re_data.length; i++) {
				if(re_data[i].f_dummy === 0) {
					this.previousData.push(re_data[i]);
				}
			}
		},

		/**
		 * Submit 応答のイベントを受ける
		 */
		_onMDSubmitCompleted: function(args, e){

			// 自動一時保存対応 #20151117
			if( this.inAutoTmpSave === true ){
				console.log("DEBUG: this.useShortDialog=" + this.mdBaseView.options.useShortDialog);
				console.log("DEBUG: this.inAutoTmpSaveCommit=" + this.inAutoTmpSaveCommit);
				this.mdBaseView.options.useShortDialog = false;
				if( this.inAutoTmpSaveCommit != null ){

					switch(args.status){

					case 'DONE':		// 確定済
						this.inAutoTmpSaveCommit();
						break;
					case 'CONFLICT':	// 別のユーザによって DB が更新された
						// args.data を画面個別 View へセットする。
						// 全 <input> を readonly 化するなどの処理。
						// 確定済なので、 全 <input> は readonly 化するなどの処理。
						clutil.viewReadonly(this.$("#ca_infoArea"));
						// グリッドのEditを無効にする
						this.dataGrid.setEnable(false);
						break;
					case 'DELETED':		// 別のユーザによって削除された
						// args.data が null なら空欄表示化する。args.data に何かネタがあれば画面個別Viewへセットする。
						// 全 <input> を readonly 化するなどの処理。
						// 確定済なので、 全 <input> は readonly 化するなどの処理。
						clutil.viewReadonly(this.$("#ca_infoArea"));
						// グリッドのEditを無効にする
						this.dataGrid.setEnable(false);
						break;
					default:
					case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
						this.setNG(args);

						break;
					}
				}
				this.inAutoTmpSave = false;
				this.inAutoTmpSaveCommit = null;
				return;
			}

			var data = args.data;

			switch(args.status){

			case 'DONE':		// 確定済

				// 再検索結果を再描画
				this.data2redraw(data);

				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_infoArea"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				// 登録済みフラグを保存
				var stat = this.mdBaseView.pagesStat[this.mdBaseView.options.pageIndex];
				var block = stat.block;

				// ダウンロードボタンは操作可能とする
				this.mdBaseView.setFooterNaviEnable(true, "download");

				// 保存しておいた登録済みフラグを復元
				stat.block = block;

				if(args.req.reqHead.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {

					// ロス追求完了ボタンが押下された場合のみ、帳票をZIPで固めて出力する
					this.doDownload(am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF, 99);
				}

				break;

			case 'CONFLICT':	// 別のユーザによって DB が更新された

				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_infoArea"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			case 'DELETED':		// 別のユーザによって削除された

				// args.data が null なら空欄表示化する。args.data に何かネタがあれば画面個別Viewへセットする。
				// 全 <input> を readonly 化するなどの処理。

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_infoArea"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				this.setNG(args);

				break;
			}
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){

			// this.AMPAV0010Selector.show(null, null);

			var org_id = null;

			if (clcom.userInfo.unit_id === Number(clcom.getSysparam('PAR_AMMS_UNITID_HD'))){
				// ログインユーザが事業ユニット(AOKI-HD)に属するユーザの場合
				org_id = null;

			} else {
				// それ以外の場合
				org_id = clcom.userInfo.unit_id;
			}

			/*var options = {
				func_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id	: org_id
			};*/

			var options = {
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),		//基本組織を対象
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					           am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
					           am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
				org_id	: org_id,
				f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ))
			};

			this.AMPAV0010Selector.show(null, null, options);

		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {

			var req = this.buildReq(srchReqDto);

			// 検索実行
			//this.mdBaseView.fetch();
			this.doSrch(req);
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行データ（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){

			var defer = clutil.postJSON('AMICV0070', srchReq).done(_.bind(function(data){

				// 検索リクエストを保存。
				this.savedReq = srchReq;

				this.saveData = data.AMICV0070GetRsp;

				this.savePage = data.rspPage;

				// 検索結果が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				if(_.isEmpty(this.saveData)){

					// 画面を一旦リセット
					mainView.srchAreaCtrl.reset();
					// 検索ペインのみ表示する
					mainView.srchAreaCtrl.show_srch();

					// 下部ボタン群は非表示にする
					$("#mainColumnFooter").hide();

					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					return;
				}

				this.previousData = [];

				// 検索結果を保存
				for(var i=0; i < this.saveData.invItemList.length; i++) {

					if(this.saveData.invItemList[i].f_dummy === 0) {
						// ダミーレコードでないレコードのみを保存する
						this.previousData.push(this.saveData.invItemList[i]);
					}

				}

				// ロス追求情報を表示する
				this.data2view(data);

				if(data.AMICV0070GetRsp.inv.invStateTypeID === amcm_type.AMCM_VAL_INV_STATE_INV_REPORTED) {

					// 報告状態が棚卸報告済の場合、店長承認は操作可能
					clutil.viewRemoveReadonly(this.$("#ca_infoArea"));

					// 報告状態は常に操作不可
					clutil.inputReadonly(this.$("#ca_invStateID"));

					// 一時保存が必要なページは常に操作不可
					clutil.inputReadonly(this.$("#ca_unsaveHoldRecPageListText"));
				}

				this.state.recno = data.rspHead.recno;
				this.state.state = data.rspHead.state;

				// リボンを消す
				this.mdBaseView.hideRibbon();

			}, this)).fail(_.bind(function(data){

				// 検索に失敗、エラー！！

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// 下部ボタン群は非表示にする
				$("#mainColumnFooter").hide();

				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.mdBaseView.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {prefix: 'ca_'});

				// #20150720 ヘッダにエラーメッセージを表示
				if( data.rspHead.message != null && data.rspHead.message != "" ){
					clutil.mediator.trigger('onTicker', clutil.getclmsg(data.rspHead.message));
				}

			}, this));

			return defer;
		},

		/**
		 * ページ切り替え前処理
		 */
		_onPageClickBefore: function(groupid, ev){

			if(groupid !== 'AMICV0070'){
				return;
			}

			if(!this.savedReq){
				console.warn('検索条件が保存されていません。');
				return;
			}

			// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
			// 「運用日≦棚卸日」のときはデータ変更有無確認、及び一時保存処理は行わない
			if (clcom.getOpeDate() <= this.saveData.inv.countDate) {
				console.info('運用日[' + clcom.getOpeDate() + ']≦棚卸日[' + this.saveData.inv.countDate + '] -> 一時保存しない');
				ev.commit();
				return;
			}

			// データグリッドの内容が変更されていないか確認
			if(this.isModified() === true) {

				// ページ変更をキャンセル(延期)する
				var commit = ev.cancel();

				// 自動で一時保存を実行する #20151117
				this.mdBaseView.options.useShortDialog = true;
				var ret = this.mdBaseView.doSubmit(am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE, ev);
				console.log(ret);
				this.inAutoTmpSave = true;
				this.inAutoTmpSaveCommit = commit;
//				this.mdBaseView.options.useShortDialog = false;
//
//				// 変更がある場合はダイアログウィンドウを表示
//				// confirm メッセージを出す。[OK]ならば、ページ切替処理を続行する。
//				var confirmMsg = '一時保存が完了していません。このまま移動しますか？';
//
//				clutil.ConfirmDialog(confirmMsg, function(){
//					// ページ変更を実施する
//					commit();
//				});
//
//				// ページ変更を実施する
//				commit();
			}
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){

			console.log(arguments);

			if(groupid !== 'AMICV0070'){
				return;
			}

			if(!this.savedReq){
				console.warn('検索条件が保存されていません。');
				return;
			}

			this.toNextPage(pageReq);
		},

		/**
		 * ページ切替処理
		 */
		toNextPage: function(pageReq){

			// 検索条件を複製してページリクエストを差し替える
			var req = _.extend({}, this.savedReq);

			req.reqPage = pageReq;

			// 検索実行
			this.doSrch(req);

		},

		/**
		 * データグリッドの内容が変更されていないか確認する関数
		 */
		isModified: function(){

			// 検索直後のデータグリッド内容
			var prev = this.previousData;

			// 現在のデータグリッド内容
			this.dataGrid.stopEditing();
			var curr = this.dataGrid.getData();

			if (prev.length !== curr.length) {
				// 新規追加行がある⇒変更あり
				return true;
			}

			for(var i=0; i < prev.length; i++) {
				if((Number(prev[i].reInvQy) !== Number(curr[i].reInvQy)) ||
						(Number(prev[i].reason) !== Number(curr[i].reason)) ||
							(Number(prev[i].coQy) !== Number(curr[i].coQy))) {
					return true;
				}
			}

			return false;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){

			var srchReq;

			if(arguments.length > 0){

				srchReq = argSrchReq;

			}else{

				if(!this.srchCondView.isValid()){
					return null;
				}

				srchReq = this.srchCondView.serialize();
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
				// ページャー用のページリクエスト
				reqPage: _.first(this.pagerViews).buildReqPage0(),
				/*reqPage: {
					start_record: 0,
					page_size: 0
				},*/
				AMICV0070GetReq: srchReq
			};
			return req;
		},

		/**
		 * Get リクエストを作る
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			if(this.iniGetReq){
				// 初期データ取得時の GetReq

				var req = {
					resId : clcom.pageId,
					data: this.iniGetReq
				};

				this.savedReq = this.iniGetReq;

				this.iniGetReq = undefined;

				return req;
			}

			if(!this.srchCondView.isValid()){
				return null;
			}

			var req = this.buildReq();

			return {
				resId : clcom.pageId,
				data: req
			};
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){

			this.mdBaseView.clear();

			this.srchAreaCtrl.show_srch();

			// メニュー戻るボタン(<)押下時のメッセージ表示を抑制する
			this.mdBaseView.options.confirmLeaving = false;

			// 下部ボタン群は非表示にする
			$("#mainColumnFooter").hide();

		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧画面では使用しない*/, e){

			// ope_btn 系
			switch(rtyp){

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:	// PDF 出力

				var model = $(e.target).data('cl_model');
				/*if(confirm(clutil.opeTypeIdtoString(rtyp) + ': outputTarget[' + model.attr + ']') == false){
					return;
				}*/

				this.doDownload(rtyp, (model) ? model.attr : 0);

				break;

			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(opeTypeId, attr){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}

			srchReq.reqHead.opeTypeId = opeTypeId;
			srchReq.AMICV0070GetReq.outputTarget = attr;

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMICV0070', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(opeTypeId){

			var flag = true;

			var invInfo = clutil.view2data($('#ca_infoArea'));

			if(opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {

				// 「ロス追求完了」ボタンクリック時に店長承認が入力されていない場合はエラー
				// （※それ以外のボタンがクリックされた場合、店長承認は必須でない）

				if(!invInfo.storeManID) {

					clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

					var msg = clutil.getclmsg('EIC0007');
					this.validator.setErrorMsg($("#ca_storeManID"), msg);
					flag = false;
				}
			}

			// 棚卸明細リスト（データグリッドの内容）を取得
			var itemList = this.dataGrid.getData();

			if(!_.isEmpty(itemList)) {

				// 移動依頼指示商品のループ
				_.each(this.dataGrid.getData(), function(data){

					// 行のID
					var rowId = data[this.dataGrid.idProperty];

					if(Number(data.reInvQy) !== Number(data.invQy)) {
						// 棚卸数≠再棚卸数の場合、修正理由は必須項目となる
						if(!data.reason) {
							// 修正理由が選択されていない場合はエラー
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
							var msg = clutil.getclmsg('EIC0010');
							this.dataGrid.setCellMessage(rowId, 'reason', 'error', msg);
							flag = false;
						}
					} else {
						// 棚卸数＝再棚卸数の場合、修正理由のエラー表示はクリアする
						this.dataGrid.clearCellMessage(rowId, 'reason');
					}

					// MD-2847 棚卸_特定の品種サブクラス(オーダー)の帳簿在庫マイナス値据え置き対応について_PGM開発
					// 「据え置き」チェックボックス」が OFF の場合は「再棚卸数」は≧０であること
					if (data.hold === 0) {
						if (Number(data.reInvQy) < 0) {
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
							var msg = clutil.getclmsg('cl_numeric1');
							this.dataGrid.setCellMessage(rowId, 'reInvQy', 'error', msg);
							flag = false;
						}
					}

				},this);
			}

			return flag;
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId){
			this.dataGrid.stopEditing();			// 編集停止
			this.dataGrid.clearAllCellMessage();	// メッセージクリア

			// エラーチェック
			if(this.isValid(opeTypeId) == false){
				return;
			}

			var srchReq = this.srchCondView.serialize();

			//////// 棚卸ヘッダ情報の作成
			// 棚卸状態と店長承認を取得
			var invInfo = clutil.view2data($('#ca_infoArea'));

			var invStateTypeID = 0;

			// 報告状態の値をセット
			if (opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE) {
				//「一時保存」ボタンクリック時
				invStateTypeID = this.saveData.inv.invStateTypeID;

			} else if (opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				//「ロス追求完了」ボタンクリック時は、棚卸確定済
				invStateTypeID = amcm_type.AMCM_VAL_INV_STATE_INV_FIXED;

			} else if (opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK) {
				//「差戻し」ボタンクリック時は、棚卸報告済
				invStateTypeID = amcm_type.AMCM_VAL_INV_STATE_INV_REPORTED;

			}

			var inv = {
				invStateID : this.saveData.inv.invStateID,
				invID : this.saveData.inv.invID,
				orgID : this.saveData.inv.orgID,
				//invStateTypeID : this.saveData.inv.invStateTypeID,
				invStateTypeID : invStateTypeID,
				storeManID : invInfo.storeManID,
				maxItemID : this.saveData.inv.maxItemID
			};

			// ロス追求一覧テーブルの内容を取得
			var invItemInfo = this.dataGrid.getData({
				delflag: false
			});

			// 登録されているデータ
			var saveInvItem = {};
			// 更新リクエストデータ（差分）
			var invItemList = [];

			var j=0;

			for(var i=0; i < invItemInfo.length; i++) {

				saveInvItem = this.saveData.invItemList[i];

				if(invItemInfo[i].isNew === true) {

					// 新規追加行の場合

					if(invItemInfo[i].tagCode) {
						invItemList[j] = {
							seqNumber : "",
							lineNo : i,
							diffID : "",
							invStateID : "",
							tagCode : invItemInfo[i].tagCode,

							item_id : invItemInfo[i].itemID,
							itemName : invItemInfo[i].itemName,
							lossQy : "",
							stockQy : "",
							coQy : invItemInfo[i].coQy,
							ewsCoQy : "",
							invQy : "",

							reInvQy : invItemInfo[i].reInvQy,
							reason : invItemInfo[i].reason,

							rackNo : "",
							stditgrpName : invItemInfo[i].stditgrpName,
							stditgrpCd : invItemInfo[i].varietyCode,
							subClass1Name : "",
							subClass1Cd : "",
							subClass2Name : "",
							subClass2Cd : "",
							colorName : invItemInfo[i].colorName,
							colorCd : invItemInfo[i].colorCode,
							sizeName : invItemInfo[i].sizeName,
							sizeCd : invItemInfo[i].sizeCode,
							seasonName : "",
							seasonCd : "",
							makerName : invItemInfo[i].makerName,
							makerCd : invItemInfo[i].makerCd,
							makerCode : invItemInfo[i].makerCode
						};
					}

					j++;

				} else if(saveInvItem.reInvQy !== invItemInfo[i].reInvQy
						|| saveInvItem.reason !== invItemInfo[i].reason
						|| saveInvItem.coQy !== invItemInfo[i].coQy) {

					if(saveInvItem.coQy !== invItemInfo[i].coQy) {
						invItemInfo[i].coQy = Number(invItemInfo[i].coQy);
					}

					// 既存行の場合
					// 再棚卸数または修正理由に変更がある場合、更新リクエストにセット

					invItemList[j] = {
						seqNumber : this.saveData.invItemList[i].seqNumber,
						lineNo : i,
						diffID : this.saveData.invItemList[i].diffID,
						invStateID : this.saveData.invItemList[i].invStateID,

						tagCode : invItemInfo[i].tagCode,

						item_id : this.saveData.invItemList[i].item_id,
						itemName : this.saveData.invItemList[i].itemName,
						lossQy : this.saveData.invItemList[i].lossQy,
						stockQy : this.saveData.invItemList[i].stockQy,
						coQy : invItemInfo[i].coQy,
						ewsCoQy : this.saveData.invItemList[i].ewsCoQy,
						invQy : this.saveData.invItemList[i].invQy,

						reInvQy : invItemInfo[i].reInvQy,
						reason : invItemInfo[i].reason,

						rackNo : this.saveData.invItemList[i].rackNo,
						stditgrpName : this.saveData.invItemList[i].stditgrpName,
						stditgrpCd : this.saveData.invItemList[i].stditgrpCd,
						subClass1Name : this.saveData.invItemList[i].subClass1Name,
						subClass1Cd : this.saveData.invItemList[i].subClass1Cd,
						subClass2Name : this.saveData.invItemList[i].subClass2Name,
						subClass2Cd : this.saveData.invItemList[i].subClass2Cd,
						colorName : this.saveData.invItemList[i].colorName,
						colorCd : this.saveData.invItemList[i].colorCd,
						sizeName : this.saveData.invItemList[i].sizeName,
						sizeCd : this.saveData.invItemList[i].sizeCd,
						seasonName : this.saveData.invItemList[i].seasonName,
						seasonCd : this.saveData.invItemList[i].seasonCd,
						makerName : this.saveData.invItemList[i].makerName,
						makerCd : this.saveData.invItemList[i].makerCd,
						makerCode : this.saveData.invItemList[i].makerCode
					};

					j++;

				}
			};

			var updReq = {
				stditgrpID: srchReq.srchStditgpID,
				inv : inv,
				invItemList : invItemList,
				rspPage: this.savePage,
			};

			var reqHead = {
				opeTypeId : opeTypeId,
				recno: this.state.recno,
				state: this.state.state
			};

			// ページリクエスト #20151117
			var reqPage = _.first(this.pagerViews).serialize();

			var reqObj = {
				reqHead : reqHead,
				reqPage : reqPage,
				AMICV0070UpdReq  : updReq
			};

			// ロス追求完了confirmを出す #20150704
			// confirm文言変更 #20151117
			if (opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				return {
					resId : clcom.pageId,
					data: reqObj,
					confirm: '！ロス追求を完了します。以降、追加の入力が出来なくなります。<br><br>よろしいですか？',
					onRspPage: false
				};
			}
			else {
				return {
					resId : clcom.pageId,
					data: reqObj,
					onRspPage: false
				};
			}
		},

		/**
		 * 初期検索データでロードする
		 */
		load: function(model){
			if(_.isEmpty(model)){
				return;
			}

			if(model.condModel){
				this.srchCondView.deserialize(model.condModel);
			}

			if(model.srchReq){
				this.iniGetReq = this.buildReq(model.srchReq);
				this.mdBaseView.fetch();
			}
		},

		/**
		 * 店舗条件を初期表示する
		 */
		loadCond: function(model){
			if(_.isEmpty(model)){
				return;
			}

			if(model.condModel){
				this.srchCondView.deserialize(model.condModel);
			}
		},

		_eof: 'AMICV0070.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){

		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView(clcom.pageArgs).initUIElement().render();

		if(clcom.pageArgs){

			// 画面遷移引数がある
			if(_.isEmpty(clcom.pageArgs.chkData)) {

				// ログインユーザが店舗ユーザの場合、所属店舗を初期表示する
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {

					//_unitID = clcom.userInfo.unit_id;
					//_xxCode = clcom.userInfo.org_code;
					//_xxName = clcom.userInfo.org_name;

					var condModel = {
						_view2data_srchStoreID_cn: {
							id: clcom.userInfo.org_id,
							code: clcom.userInfo.org_code,
							name: clcom.userInfo.org_name,
							unit_id: clcom.userInfo.unit_id
						},
						srchStoreID: clcom.userInfo.org_id
					};

					mainView.loadCond({
						condModel: condModel
					});

					clutil.inputReadonly($("#ca_srchStoreID"));
					clutil.inputReadonly($("#ca_btn_store_select"));
				}

			} else {

				var chkdata = clcom.pageArgs.chkData[0];

				// stditgrpDispName → code, name へ分解
				var xxCode = "";
				var xxName = "";
				if(!_.isEmpty(chkdata.stditgrpDispName)){
					var xx = chkdata.stditgrpDispName.split(':');
					if(xx.length > 1){
						xxCode = xx.shift();
					}
					xxName = xx.join('');
				}

				// SrchCondView が扱えるデータ型に変換
				var condModel = {
					_view2data_srchStoreID_cn: {
						id: chkdata.orgID,
						code: chkdata.storeCode,
						name: chkdata.storeName,
						unit_id: chkdata.unitID
					},
					_view2data_srchStditgpID_cn: {
						id: chkdata.stditgrpID,
						code: xxCode,
						name: xxName
					},
					srchStoreID: chkdata.orgID,
					srchStditgpID: chkdata.stditgrpID,
					srchYearMonth: clcom.pageArgs.srchYearMonth
				};

				var srchReq = {
					srchStoreID: chkdata.orgID,
					srchStditgpID: chkdata.stditgrpID,
					srchYearMonth: clcom.pageArgs.srchYearMonth
				};

				mainView.load({
					condModel: condModel,
					srchReq: srchReq
				});
			}
		} else {

			// 画面遷移引数がない→メニューから起動された場合
			if (clcom.userInfo && clcom.userInfo.org_id) {

				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
						|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {

					var condModel = {
						_view2data_srchStoreID_cn: {
							id: clcom.userInfo.org_id,
							code: clcom.userInfo.org_code,
							name: clcom.userInfo.org_name,
							unit_id: clcom.userInfo.unit_id
						},
						srchStoreID: clcom.userInfo.org_id
					};

					mainView.loadCond({
						condModel: condModel
					});

					clutil.inputReadonly($("#ca_srchStoreID"));
					clutil.inputReadonly($("#ca_btn_store_select"));
				}
			}
		}

	}).fail(function(data){

		console.error('iniJSON failed.');
		console.log(arguments);

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
