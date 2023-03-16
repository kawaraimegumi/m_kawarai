$(function() {
	//////////////////////////////////////////////
	// View
	MDPAV1030PanelView = Backbone.View.extend({
		id: 'ca_MDPAV1030_view',
		tagName: 'table',
		className: 'tree mrgb10',
		template: _.template(''
				+ '<tr id="ca_MDPAV1030_showbuttons">'
				+ '<th colspan="2"><span class="treeClose"></span><%- navTitleLabel %></th>'
				+ '</tr>'),

		// 押下イベント
		events: {
		},

		filter_ITGRP : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITGRP
		},
		filter_ITEM : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEM
		},
		filter_PACKITEM : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_PACKITEM
		},
		filter_COLORITEM : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORITEM
		},
		filter_SKUCS : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORSIZEITEM
		},
//		filter_ITEMATTR : [{					// 顧客版
//			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SUBCLASS1
//		},{
//			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SUBCLASS2
//		},{
//			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_BRAND
//		},{
//			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_STYLE
//		},{
//			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_DESIGN
//		},{
//			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_MATERIAL
//		},{
//			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_COLOR
//		},{
//			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_T_COLOR
//		},{
//			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_K_SIZE
//		},{
//			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SEASON
//		},{
//			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_USE
//		}],
		filter_ITEMATTR : _.map([				// MD版
			//{ name='AMAN_DEFS_KIND_ITEMATTR_MIN',       val=210, description='商品属性(開始)', },
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SUBCLASS1,	// 211: サブクラス１
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SUBCLASS2,	// 212: サブクラス２
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SEASON,		// 213: シーズン
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_AGGSEASON,	// 214: 集約シーズン
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_BRAND,		// 215: ブランド
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_STYLE,		// 216: スタイル
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SUBSTYLE,		// 217: サブスタイル
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_MATERIAL,		// 218: 素材
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_DESIGN,		// 219: 柄
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SUBDESIGN,	// 220: サブ柄
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_USE,			// 221: 用途区分
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_COLOR,		// 222: 色
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_BASECOLOR,	// 223: ベース色
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SIZE,			// 224: サイズ
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ITEMTYPE,		// 225: 商品区分
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_KITYPE,		// 226: KI区分
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_IMPORT,		// 227: 生産区分
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_FACTORY,		// 228: 縫製工場
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_DISPTYPE,		// 232: 陳列方法
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ITEMTASTE,	// 233: 商品テイスト
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY,			// 229: 任意属性
			//{ name='AMAN_DEFS_KIND_ITEMATTR_MAX',       val=230, description='商品属性(終了)', },
			// どうかと思うが ... MD二次対応（商品汎用属性用） #20170216
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1001,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1002,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1003,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1004,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1005,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1006,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1007,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1008,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1009,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1010,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1011,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1012,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1013,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1014,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1015,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1016,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1017,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1018,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1019,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1020,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1021,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1022,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1023,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1024,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1025,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1026,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1027,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1028,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1029,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1030,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1031,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1032,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1033,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1034,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1035,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1036,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1037,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1038,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1039,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1040,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1041,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1042,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1043,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1044,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1045,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1046,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1047,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1048,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE + 1049
		], function(anaKind){ return { kind: anaKind }; }),

		filter_ITEMSPEC : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMSPEC
		},
		filter_ITEMPRICE : _.map([				// MD版
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMPRICE_INIT,	// 211: 当初指定上代
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMPRICE_CURR,	// 211: 現指定上代
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMPRICE_ORGPOS,	// 211: POS元上代
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMPRICE_POS,		// 211: 実上代
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMPRICE_LINE_M,	// 211: プライスライン
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMPRICE_LINE,	// 211: プライスライン(POS元上代)
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMPRICE_LINE_SL_M, // 211: プライスライン[営業部]
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMPRICE_LINE_SL,	  // 211: プライスライン(POS元上代)[営業部]
		], function(anaKind){ return { kind: anaKind }; }),
		filter_ITEMDATE : _.map([				// MD版
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMDATE_YEAR,		// 211: 商品展開年
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMDATE_AGE,		// 211: 商品年齢
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMDATE_FIRST,	// 211: 初回投入年
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SALE_ST_DATE, // 販売開始日
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SALE_ED_DATE, // 販売終了日
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_FIRST_DLVDATE, // 初回仕入日
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_LAST_DLVDATE, // 最終仕入日
		], function(anaKind){ return { kind: anaKind }; }),
		filter_ITEMLIST : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMLIST
		},
		filter_MAKER : {
			kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_MAKER
		},
		filter_ITEMATTRs : _.map([
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SMXKT,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ALLSTORE,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_WDSTORE,
			amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_WDPERIOD			
		], function(anaKind){ return { kind: anaKind }; }),

		navTitleLabel: '商品・商品分類',
		panelId : 'MDPAV1030',

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			this.filter_ALL = _.reduce([
					this.filter_ITEMATTRs,
					this.filter_ITGRP, this.filter_ITEM, this.filter_PACKITEM, this.filter_COLORITEM,
                    this.filter_SKUCS, this.filter_ITEMATTR, this.filter_ITEMSPEC,
					this.filter_ITEMLIST, this.filter_MAKER
			], function(all, val){
				console.log(arguments);
				if(_.isArray(val)){
					for(var i = 0; i < val.length; i++){
						all.push(val[i]);
					}
				}else{
					all.push(val);
				}
				return all;
			}, []);

			// -----------------------------
			// ナビゲーションメニュー

if(this.anaProc.func_code == 'AMGAV0100'
	|| this.anaProc.func_code == 'AMGAV2100'
	|| this.anaProc.func_code == 'AMGAV2110'
	|| this.anaProc.func_code == 'AMGAV2120'){

			// Lv2: 商品指定のメニュータイトル - 自由分析のみ有効
			// 20210803 add 併売分析(併売点数分析)・併売分析(品種別分析)
			this.navMDCMV1360View = new AnaNaviItemView({
				title: '商品指定',
				tr : {id: 'ca_navItemMDCMV1360'}
			}).on('onNaviItemClick', this.navMDCMV1360Click);
}

			// Lv2: 商品分類階層のメニュータイトル
			this.navMDCMV1050View = new AnaNaviItemView({
				title: '商品分類階層',
				tr : {id: 'ca_navItemMDCMV1050'}
			}).on('onNaviItemClick', this.navItemMDCMV1050Click);

			// Lv2: 商品のメニュータイトル
			this.navMDCMV1060View = new AnaNaviItemView({
				title: '商品',
				tr : {id: 'ca_navItemMDCMV1060'}
			}).on('onNaviItemClick', this.navMDCMV1060Click);

if(this.anaProc.func_code == 'AMGAV0100'
	|| this.anaProc.func_code == 'AMGAV2100'
	|| this.anaProc.func_code == 'AMGAV2110'
	|| this.anaProc.func_code == 'AMGAV2120'){
			// Lv2: カラー商品のメニュータイトル - 自由分析のみ有効
			// 20210803 add 併売分析(併売点数分析)・併売分析(品種別分析)
			this.navMDCMV1350View = new AnaNaviItemView({
				title: 'カラー商品',
				tr : {id: 'ca_navItemMDCMV1350'}
			}).on('onNaviItemClick', this.navMDCMV1350Click);
}

			// Lv2: カラーサイズＳＫＵのメニュータイトル
			this.navMDCMV1240View = new AnaNaviItemView({
				title: function(defaultTitle){
					var title = defaultTitle;
					if(Ana.Config.cond.MDCMV1240 && !_.isEmpty(Ana.Config.cond.MDCMV1240.navMenuTitle)){
						title = Ana.Config.cond.MDCMV1240.navMenuTitle;
					}
					return title;
				}('カラーサイズＳＫＵ'),
				tr : {id: 'ca_navItemMDCMV1240'}
			}).on('onNaviItemClick', this.navMDCMV1240Click);

if(this.anaProc.func_code == 'AMGAV0100'
	|| this.anaProc.func_code == 'AMGAV2100'
	|| this.anaProc.func_code == 'AMGAV2110'
	|| this.anaProc.func_code == 'AMGAV2120'){
			// Lv2: 集約商品のメニュータイトル - 自由分析のみ有効
			// 20210803 add 併売分析(併売点数分析)・併売分析(品種別分析)
			this.navMDCMV1340View = new AnaNaviItemView({
				title: '集約商品',
				tr : {id: 'ca_navItemMDCMV1340'}
			}).on('onNaviItemClick', this.navMDCMV1340Click);
}

			// Lv2: 商品属性のメニュータイトル
			this.navMDCMV1070View = new AnaNaviItemView({
				title: '商品属性',
				tr : {id: 'ca_navItemMDCMV1070'}
			}).on('onNaviItemClick', this.navMDCMV1070Click);

			// Lv2: 商品仕様のメニュータイトル
			this.navMDCMV1310View = new AnaNaviItemView({
				title: '商品仕様',
				tr : {id: 'ca_navItemMDCMV1310'}
			}).on('onNaviItemClick', this.navMDCMV1310Click);

			// Lv2: 商品価格のメニュータイトル
			this.navMDCMV1320View = new AnaNaviItemView({
				title: '商品価格',
				tr : {id: 'ca_navItemMDCMV1320'}
			}).on('onNaviItemClick', this.navMDCMV1320Click);

			// Lv2: 商品年のメニュータイトル
			this.navMDCMV1330View = new AnaNaviItemView({
				title: '商品年',
				tr : {id: 'ca_navItemMDCMV1330'}
			}).on('onNaviItemClick', this.navMDCMV1330Click);

			// Lv2: 商品リストのメニュータイトル
			this.navMDCMV1080View = new AnaNaviItemView({
				title: '商品リスト',
				tr : {id: 'ca_navItemMDCMV1080'}
			}).on('onNaviItemClick', this.navMDCMV1080Click);

//			// Lv2: メーカーのメニュータイトル
//			this.navCACMV0090View = new AnaNaviItemView({
//				title: 'メーカー'
//			}).on('onNaviItemClick', this.navCACMV0090Click);

			// -----------------------------
			// 各セレクタView

			var sideLabel = _.isEmpty(this.side) ? '' : this.side;

if(this.anaProc.func_code == 'AMGAV0100'
	|| this.anaProc.func_code == 'AMGAV2100'
	|| this.anaProc.func_code == 'AMGAV2110'
	|| this.anaProc.func_code == 'AMGAV2120'){
			// 商品指定選択画面 - 自由分析[AMGAV0100]でのみ有効
			// 20210803 add
			// 併売分析(併売点数分析)[AMGAV2110]
			// 併売分析(品種別分析)[AMGAV2120]
			this.MDCMV1360Selector = new  MDCMV1360SelectorView({
				el : $('#ca_MDCMV1360' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});
}

			// 商品分類選択画面
			this.MDCMV1050Selector = new  MDCMV1050SelectorView({
				el : $('#ca_MDCMV1050' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 商品選択画面
			this.MDCMV1060Selector = new  MDCMV1060SelectorView({
				el : $('#ca_MDCMV1060' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

if(this.anaProc.func_code == 'AMGAV0100'
	|| this.anaProc.func_code == 'AMGAV2100'
	|| this.anaProc.func_code == 'AMGAV2110'
	|| this.anaProc.func_code == 'AMGAV2120'){
			// カラー商品選択画面 - 自由分析[AMGAV0100]でのみ有効
			// 20210803 add
			// 併売分析(併売点数分析)[AMGAV2110]
			// 併売分析(品種別分析)[AMGAV2120]
			this.MDCMV1350Selector = new  MDCMV1350SelectorView({
				el : $('#ca_MDCMV1350' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});
}

			// カラーサイズＳＫＵ選択画面
			this.MDCMV1240Selector = new  MDCMV1240SelectorView({
				el : $('#ca_MDCMV1240' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

if(this.anaProc.func_code == 'AMGAV0100'
	|| this.anaProc.func_code == 'AMGAV2100'
	|| this.anaProc.func_code == 'AMGAV2110'
	|| this.anaProc.func_code == 'AMGAV2120'){
			// 集約商品選択画面 - 自由分析[AMGAV0100]でのみ有効
			// 20210803 add
			// 併売分析(併売点数分析)[AMGAV2110]
			// 併売分析(品種別分析)[AMGAV2120]
			this.MDCMV1340Selector = new  MDCMV1340SelectorView({
				el : $('#ca_MDCMV1340' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});
}

			// 商品属性選択画面
			this.MDCMV1070Selector = new  MDCMV1070SelectorView({
				el : $('#ca_MDCMV1070' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 商品仕様選択画面
			this.MDCMV1310Selector = new  MDCMV1310SelectorView({
				el : $('#ca_MDCMV1310' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 商品価格選択画面
			this.MDCMV1320Selector = new  MDCMV1320SelectorView({
				el : $('#ca_MDCMV1320' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 商品年選択画面
			this.MDCMV1330Selector = new  MDCMV1330SelectorView({
				el : $('#ca_MDCMV1330' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 商品リスト選択画面
			this.MDCMV1080Selector = new  MDCMV1080SelectorView({
				el : $('#ca_MDCMV1080' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

//			// メーカー選択画面
//			this.CACMV0090Selector = new  CACMV0090SelectorView({
//				el : $('#ca_CACMV0090_dialog'),	// 配置場所
//				$parentView		: this.$parentView,
////				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
////				ymd				: null,			// 検索日
//				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
//				anaProc			: this.anaProc
//			});

			// -----------------------------
			// イベントハンドリング
			if(this.anaProc){
				this.anaProc.on('onCondReset', this.onCondReset);		// 「条件をクリア」イベントを捕捉する
				this.anaProc.on('onCondUpdated', this.onCondUpdated);	// 「確定」イベントを捕捉する
			}
		},

		/**
		 * 画面描写
		 */
		render: function(noItemSpec) {
			this.$el.html(this.template(this));
			this.$view.append(this.$el);

			// 商品ボタン群
//			$('#ca_MDPAV1030_view')
			if( noItemSpec != null && noItemSpec == 1 ){
if(this.navMDCMV1360View){
				this.$el.append(this.navMDCMV1360View.render().$el);
}
				this.$el.append(this.navMDCMV1050View.render().$el);
				this.$el.append(this.navMDCMV1060View.render().$el);
if(this.navMDCMV1350View){
				this.$el.append(this.navMDCMV1350View.render().$el);
}
				this.$el.append(this.navMDCMV1240View.render().$el);
if(this.navMDCMV1340View){
				this.$el.append(this.navMDCMV1340View.render().$el);
}
				this.$el.append(this.navMDCMV1070View.render().$el);
//// 商品仕様を出さない #20151018
////			this.$el.append(this.navMDCMV1310View.render().$el);
				this.$el.append(this.navMDCMV1320View.render().$el);
				this.$el.append(this.navMDCMV1330View.render().$el);
				this.$el.append(this.navMDCMV1080View.render().$el);
//				this.$el.append(this.navCACMV0090View.render().$el);

if(this.MDCMV1360Selector){
				this.MDCMV1360Selector.render();
}
				this.MDCMV1050Selector.render();
				this.MDCMV1060Selector.render();
if(this.MDCMV1350Selector){
				this.MDCMV1350Selector.render();
}
				this.MDCMV1240Selector.render();
if(this.MDCMV1340Selector){
				this.MDCMV1340Selector.render();
}
				this.MDCMV1070Selector.render();
//// 商品仕様を出さない #20151018
////			this.MDCMV1310Selector.render();
				this.MDCMV1320Selector.render();
				this.MDCMV1330Selector.render();
				this.MDCMV1080Selector.render();
//				this.CACMV0090Selector.render();
			}
			else {
if(this.navMDCMV1360View){
				this.$el.append(this.navMDCMV1360View.render().$el);
}
				this.$el.append(this.navMDCMV1050View.render().$el);
				this.$el.append(this.navMDCMV1060View.render().$el);
if(this.navMDCMV1350View){
				this.$el.append(this.navMDCMV1350View.render().$el);
}
				this.$el.append(this.navMDCMV1240View.render().$el);
if(this.navMDCMV1340View){
				this.$el.append(this.navMDCMV1340View.render().$el);
}
				this.$el.append(this.navMDCMV1070View.render().$el);
				this.$el.append(this.navMDCMV1310View.render().$el);
				this.$el.append(this.navMDCMV1320View.render().$el);
				this.$el.append(this.navMDCMV1330View.render().$el);
				this.$el.append(this.navMDCMV1080View.render().$el);
//				this.$el.append(this.navCACMV0090View.render().$el);

if(this.MDCMV1360Selector){
				this.MDCMV1360Selector.render();
}
				this.MDCMV1050Selector.render();
				this.MDCMV1060Selector.render();
if(this.MDCMV1350Selector){
				this.MDCMV1350Selector.render();
}
				this.MDCMV1240Selector.render();
if(this.MDCMV1340Selector){
				this.MDCMV1340Selector.render();
}
				this.MDCMV1070Selector.render();
				this.MDCMV1310Selector.render();
				this.MDCMV1320Selector.render();
				this.MDCMV1330Selector.render();
				this.MDCMV1080Selector.render();
//				this.CACMV0090Selector.render();
			}

			this.initUIelement();

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);
			clutil.initUIelement(this.$el);

			var _this = this;

			// 商品・商品分類押下
			this.$("#ca_MDPAV1030_showbuttons").click(function(e){
				var tr_button = $(e.target).closest('tr');
				var span = $(tr_button).find('span');

				if ($(span).hasClass('treeClose')) {
					$(span).removeClass('treeClose');
					$(span).addClass('treeOpen');
					_this.$el.find('tr.ca_button').hide();
					_this.$el.find('tr.ca_condview').hide();
				} else {
					$(span).removeClass('treeOpen');
					$(span).addClass('treeClose');
					_this.$el.find('tr.ca_button').show();
					_this.$el.find('tr.ca_condview').show();
				}
			});

			//////////////////////////
			// 設定済条件の表示
			this.condUpdateAll();
			// カタログの場合制限フラグによって編集可・不可を設定する
			if (this.anaProc.catalog != null) {
				var f_anacond = this.anaProc.catalog.f_anacond;
				if ((f_anacond & amcm_type.AMCM_VAL_ANACOND_ITEM) == amcm_type.AMCM_VAL_ANACOND_ITEM) {
					var th = this.$el.find('th.ca_th_edit');
					$(th).removeClass('ca_th_edit');
					var span = this.$el.find('span.edit');
					$(span).remove();
					var span = this.$el.find('span.ca_title');
					$(th).removeClass('category');
					$(th).addClass('ca_th_disabled');
					$(span).addClass('ca_span_disabled');
				}
			}
		},

		// 商品指定
		navMDCMV1360Click: function(e){
			var _this = this;
			e.srcBackboneView.setActive();

			var rmFocusFunc, pushFocusFunc, getFocusFunc;
			if(this.side == 'alt'){
				rmFocusFunc = _.bind(this.anaProc.removeFocus2, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus2, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus2, this.anaProc);
			}else{
				rmFocusFunc = _.bind(this.anaProc.removeFocus1, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus1, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus1, this.anaProc);
			}

			var list = getFocusFunc(this.filter_ITEMATTRs);
			this.MDCMV1360Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1360Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEMATTRs);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1360',
						anafocus : getFocusFunc(_this.filter_ITEMATTRs),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品分類階層
		navItemMDCMV1050Click: function(e){
			var _this = this;
			e.srcBackboneView.setActive();

			var rmFocusFunc, pushFocusFunc, getFocusFunc;
			if(this.side == 'alt'){
				rmFocusFunc = _.bind(this.anaProc.removeFocus2, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus2, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus2, this.anaProc);
			}else{
				rmFocusFunc = _.bind(this.anaProc.removeFocus1, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus1, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus1, this.anaProc);
			}

			var list = getFocusFunc(this.filter_ITGRP);
			this.MDCMV1050Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1050Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITGRP);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1050',
						anafocus : getFocusFunc(_this.filter_ITGRP),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品
		navMDCMV1060Click: function(e){
			var _this = this;
			e.srcBackboneView.setActive();

			var rmFocusFunc, pushFocusFunc, getFocusFunc;
			if(this.side == 'alt'){
				rmFocusFunc = _.bind(this.anaProc.removeFocus2, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus2, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus2, this.anaProc);
			}else{
				rmFocusFunc = _.bind(this.anaProc.removeFocus1, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus1, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus1, this.anaProc);
			}

			var list = getFocusFunc(this.filter_ITEM);
			this.MDCMV1060Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1060Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEM);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1060',
						anafocus : getFocusFunc(_this.filter_ITEM),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// カラー商品
		navMDCMV1350Click: function(e){
			var _this = this;
			e.srcBackboneView.setActive();

			var rmFocusFunc, pushFocusFunc, getFocusFunc;
			if(this.side == 'alt'){
				rmFocusFunc = _.bind(this.anaProc.removeFocus2, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus2, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus2, this.anaProc);
			}else{
				rmFocusFunc = _.bind(this.anaProc.removeFocus1, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus1, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus1, this.anaProc);
			}

			var list = getFocusFunc(this.filter_COLORITEM);
			this.MDCMV1350Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1350Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_COLORITEM);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1350',
						anafocus : getFocusFunc(_this.filter_COLORITEM),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// カラーサイズＳＫＵ
		navMDCMV1240Click: function(e){
			var _this = this;
			e.srcBackboneView.setActive();

			var rmFocusFunc, pushFocusFunc, getFocusFunc;
			if(this.side == 'alt'){
				rmFocusFunc = _.bind(this.anaProc.removeFocus2, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus2, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus2, this.anaProc);
			}else{
				rmFocusFunc = _.bind(this.anaProc.removeFocus1, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus1, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus1, this.anaProc);
			}

			var list = getFocusFunc(this.filter_SKUCS);
			this.MDCMV1240Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1240Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_SKUCS);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1240',
						anafocus : getFocusFunc(_this.filter_SKUCS),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 集約商品
		navMDCMV1340Click: function(e){
			var _this = this;
			e.srcBackboneView.setActive();

			var rmFocusFunc, pushFocusFunc, getFocusFunc;
			if(this.side == 'alt'){
				rmFocusFunc = _.bind(this.anaProc.removeFocus2, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus2, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus2, this.anaProc);
			}else{
				rmFocusFunc = _.bind(this.anaProc.removeFocus1, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus1, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus1, this.anaProc);
			}

			var list = getFocusFunc(this.filter_PACKITEM);
			this.MDCMV1340Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1340Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_PACKITEM);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1340',
						anafocus : getFocusFunc(_this.filter_PACKITEM),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品属性
		navMDCMV1070Click: function(e){
			var _this = this;
			e.srcBackboneView.setActive();

			var rmFocusFunc, pushFocusFunc, getFocusFunc;
			if(this.side == 'alt'){
				rmFocusFunc = _.bind(this.anaProc.removeFocus2, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus2, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus2, this.anaProc);
			}else{
				rmFocusFunc = _.bind(this.anaProc.removeFocus1, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus1, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus1, this.anaProc);
			}

			var list = getFocusFunc(this.filter_ITEMATTR);
			this.MDCMV1070Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1070Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEMATTR);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1070',
						anafocus : getFocusFunc(_this.filter_ITEMATTR),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品仕様
		navMDCMV1310Click: function(e){
			var _this = this;
			e.srcBackboneView.setActive();

			var rmFocusFunc, pushFocusFunc, getFocusFunc;
			if(this.side == 'alt'){
				rmFocusFunc = _.bind(this.anaProc.removeFocus2, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus2, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus2, this.anaProc);
			}else{
				rmFocusFunc = _.bind(this.anaProc.removeFocus1, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus1, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus1, this.anaProc);
			}

			var list = getFocusFunc(this.filter_ITEMSPEC);
			this.MDCMV1310Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1310Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEMSPEC);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1310',
						anafocus : getFocusFunc(_this.filter_ITEMSPEC),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品価格
		navMDCMV1320Click: function(e){
			var _this = this;
			e.srcBackboneView.setActive();

			var rmFocusFunc, pushFocusFunc, getFocusFunc;
			if(this.side == 'alt'){
				rmFocusFunc = _.bind(this.anaProc.removeFocus2, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus2, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus2, this.anaProc);
			}else{
				rmFocusFunc = _.bind(this.anaProc.removeFocus1, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus1, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus1, this.anaProc);
			}

			var list = getFocusFunc(this.filter_ITEMPRICE);
			this.MDCMV1320Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1320Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEMPRICE);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1320',
						anafocus : getFocusFunc(_this.filter_ITEMPRICE),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品年
		navMDCMV1330Click: function(e){
			var _this = this;
			e.srcBackboneView.setActive();

			var rmFocusFunc, pushFocusFunc, getFocusFunc;
			if(this.side == 'alt'){
				rmFocusFunc = _.bind(this.anaProc.removeFocus2, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus2, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus2, this.anaProc);
			}else{
				rmFocusFunc = _.bind(this.anaProc.removeFocus1, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus1, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus1, this.anaProc);
			}

			var list = getFocusFunc(this.filter_ITEMDATE);
			this.MDCMV1330Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1330Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEMDATE);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1330',
						anafocus : getFocusFunc(_this.filter_ITEMDATE),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品リスト
		navMDCMV1080Click: function(e) {
			var _this = this;
			e.srcBackboneView.setActive();

			var rmFocusFunc, pushFocusFunc, getFocusFunc;
			if(this.side == 'alt'){
				rmFocusFunc = _.bind(this.anaProc.removeFocus2, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus2, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus2, this.anaProc);
			}else{
				rmFocusFunc = _.bind(this.anaProc.removeFocus1, this.anaProc);
				pushFocusFunc = _.bind(this.anaProc.pushFocus1, this.anaProc);
				getFocusFunc = _.bind(this.anaProc.getFocus1, this.anaProc);
			}

			var list = getFocusFunc(this.filter_ITEMLIST);
			this.MDCMV1080Selector.show(list);

			//サブ画面復帰後処理
			this.MDCMV1080Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEMLIST);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemMDCMV1080',
						anafocus : getFocusFunc(_this.filter_ITEMLIST),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

//		// メーカー
//		navCACMV0090Click: function(e){
//			var _this = this;
//			e.srcBackboneView.setActive();
//
//			var list = this.anaProc.getFocus1(this.filter_MAKER);
//			this.CACMV0090Selector.show(list);
//
//			//サブ画面復帰後処理
//			this.CACMV0090Selector.okProc = function(data) {
//				if(data != null) {
//					_this.anaProc.removeFocus1(_this.filter_MAKER);
//					_this.anaProc.pushFocus1(data);
//					_this.anaProc.fireAnaCondUpdated(_this/* XXX 何を渡すかはおまかせ。*/);
//				}
//				e.srcBackboneView.unsetActive();
//			}
//		}

		// すべての条件を更新する
		condUpdateAll: function() {
			var getFocusFunc = (this.side == 'alt')
					? _.bind(this.anaProc.getFocus2, this.anaProc)
					: _.bind(this.anaProc.getFocus1, this.anaProc);

			// 商品指定
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1360',
				anafocus : getFocusFunc(this.filter_ITEMATTRs),
				panelId : this.panelId
			});
			// 商品分類階層
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1050',
				anafocus : getFocusFunc(this.filter_ITGRP),
				panelId : this.panelId
			});
			// 商品
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1060',
				anafocus : getFocusFunc(this.filter_ITEM),
				panelId : this.panelId
			});
			// カラー商品
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1350',
				anafocus : getFocusFunc(this.filter_COLORITEM),
				panelId : this.panelId
			});
			// カラーサイズＳＫＵ
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1240',
				anafocus : getFocusFunc(this.filter_SKUCS),
				panelId : this.panelId
			});
			// 集約商品
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1340',
				anafocus : getFocusFunc(this.filter_PACKITEM),
				panelId : this.panelId
			});
			// 商品属性
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1070',
				anafocus : getFocusFunc(this.filter_ITEMATTR),
				panelId : this.panelId
			});
			// 商品仕様
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1310',
				anafocus : getFocusFunc(this.filter_ITEMSPEC),
				panelId : this.panelId
			});
			// 商品価格
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1320',
				anafocus : getFocusFunc(this.filter_ITEMPRICE),
				panelId : this.panelId
			});
			// 商品年
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1330',
				anafocus : getFocusFunc(this.filter_ITEMDATE),
				panelId : this.panelId
			});
			// 商品リスト
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemMDCMV1080',
				anafocus : getFocusFunc(this.filter_ITEMLIST),
				panelId : this.panelId
			});
		},

		// 「条件をクリア」⇒ エコーバックViewを更新
		onCondReset: function(anaproc, from){
			// 条件がクリアされたので、エコーバック View を更新する。
			// anaProc.cond または、anaProc.getFocus12() から分析条件を参照して、
			// エコーバック View の表示内容を更新すること。
			this.condUpdateAll();
		},

		// 「確定」⇒ エコーバックViewを更新
		onCondUpdated: function(anaproc, from){
			// 条件が確定したので、エコーバック View を更新する。
			// anaProc.cond または、anaProc.getFocus12() から分析条件を参照して、
			// エコーバック View の表示内容を更新すること。
			if (!from) {
				return;
			}
			if (this.panelId != from.panelId) {
				return;
			}
			var tr_id = from.id;
			var anafocus = from.anafocus;

			// 条件表示部分を削除
			this.$('tr.ca_condview[tgt-id=' + tr_id + ']').remove();

			// 条件が空の場合はなにも表示しない
			if (!anafocus || anafocus.length == 0) {
				return;
			}

			var html_source = '';
			switch(tr_id){
			case 'ca_navItemMDCMV1070':
				// 商品属性
				// 属性でソートする
				anafocus.sort(function(a, b){
					if (a.kind > b.kind) return 1;
					if (a.kind < b.kind) return -1;
					return 0;
				});
				for (var i = 0; i < anafocus.length; i++) {
					// 属性毎に<td>を作成する
					var focus_kind = anafocus[i];
					html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
					html_source += focus_kind.name2;
					html_source += '</td>';
					html_source += '<td>';
					var focus_source = '';
					for (var j = i; j < anafocus.length; j++) {
						var focus = anafocus[j];
						if (clutil.chkStr(focus.code)) {
							focus_source += focus.code + ':';
						}
						focus_source += focus.name;

						// 文字数制限
						if (focus_source.length > clcom.focusStr_max) {
							focus_source = focus_source.slice(0, clcom.focusStr_max);
							focus_source += '...';
							for (; j < anafocus.length; j++) {
								if (j != anafocus.length-1 && anafocus[j+1].kind == focus_kind.kind) {
									// 次の異なる属性までjをインクリメントする
									continue;
								}
								break;
							}
							i = j;
							break;
						}
						// 次の属性が異なる場合はbreak;
						if (j != anafocus.length-1 && anafocus[j+1].kind == focus_kind.kind) {
							focus_source += ', ';
						} else {
							i = j;
							break;
						}
					}
					html_source += focus_source;
					html_source += '</td></tr>';
				}
				break;
			case 'ca_navItemMDCMV1310':
			case 'ca_navItemMDCMV1320':
			case 'ca_navItemMDCMV1330':
				if (tr_id == 'ca_navItemMDCMV1310') {
					// 商品仕様
					// name2でソートする
					anafocus.sort(function(a, b){
						if (a.name2 > b.name2) return 1;
						if (a.name2 < b.name2) return -1;
						return 0;
					});
				}
				for (var i = 0; i < anafocus.length; i++) {
					// 属性毎に<td>を作成する
					var focus_kind = anafocus[i];
					html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
					html_source += focus_kind.name2;
					html_source += '</td>';
					html_source += '<td>';
					var focus_source = '';
					for (var j = i; j < anafocus.length; j++) {
						var focus = anafocus[j];
						if (clutil.chkStr(focus.code)) {
							focus_source += focus.code + ':';
						}
						focus_source += focus.name;

						// 文字数制限
						if (focus_source.length > clcom.focusStr_max) {
							focus_source = focus_source.slice(0, clcom.focusStr_max);
							focus_source += '...';
							for (; j < anafocus.length; j++) {
								if (j != anafocus.length-1 && anafocus[j+1].name2 == focus_kind.name2) {
									// 次の異なる属性までjをインクリメントする
									continue;
								}
								break;
							}
							i = j;
							break;
						}
						// 次の属性が異なる場合はbreak;
						if (j != anafocus.length-1 && anafocus[j+1].name2 == focus_kind.name2) {
							focus_source += ', ';
						} else {
							i = j;
							break;
						}
					}
					html_source += focus_source;
					html_source += '</td></tr>';
				}
				break;
            case 'ca_navItemMDCMV1360':	// 商品指定
                for (var i = 0; i < anafocus.length; i++) {
                    // 属性毎に<td>を作成する
                    var focus_kind = anafocus[i];
                    html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td width="200px">';
                    html_source += focus_kind.name2;
                    html_source += '</td>';
                    html_source += '<td>';
                    var focus_source = '';
                    for (var j = i; j < anafocus.length; j++) {
                        var focus = anafocus[j];
                        if (clutil.chkStr(focus.code)) {
                            focus_source += focus.code + ':';
                        }
                        focus_source += focus.name;

                        // 文字数制限
                        if (focus_source.length > clcom.focusStr_max) {
                            focus_source = focus_source.slice(0, clcom.focusStr_max);
                            focus_source += '...';
                            for (; j < anafocus.length; j++) {
                                if (j != anafocus.length-1 && anafocus[j+1].kind == focus_kind.kind) {
                                    // 次の異なる属性までjをインクリメントする
                                    continue;
                                }
                                break;
                            }
                            i = j;
                            break;
                        }
                        // 次の属性が異なる場合はbreak;
                        if (j != anafocus.length-1 && anafocus[j+1].kind == focus_kind.kind) {
                            focus_source += ', ';
                        } else {
                            i = j;
                            break;
                        }
                    }
                    html_source += focus_source;
                    html_source += '</td></tr>';
                }
                break;
			default:
				html_source += '<tr class="ca_condview" tgt-id="' + tr_id + '"><td colspan="2">';
				var focus_source = '';

				for (var i = 0; i < anafocus.length; i++) {
					var focus = anafocus[i];

					if (clutil.chkStr(focus.code)) {
						focus_source += focus.code + ':';
					}
					focus_source += focus.name;

					// 文字数制限
					if (focus_source.length > clcom.focusStr_max) {
						focus_source = focus_source.slice(0, clcom.focusStr_max);
						focus_source += '...';
						break;
					}
					if (i != anafocus.length-1) {
						focus_source += ', ';
					}
				}
				html_source += focus_source;
				html_source += '</td></tr>';
				break;
			}

			// 条件を表示
			$(html_source).insertAfter(this.$('#' + tr_id));
		}
	});
});
