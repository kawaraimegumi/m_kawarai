$(function() {
	//////////////////////////////////////////////
	// View
	CAPAV0030PanelView = Backbone.View.extend({
		id: 'ca_CAPAV0030_view',
		tagName: 'table',
		className: 'tree mrgb10',
		template: _.template(''
				+ '<tr id="ca_CAPAV0030_showbuttons">'
				+ '<th colspan="2"><span class="treeClose"></span><%- navTitleLabel %></th>'
				+ '</tr>'),

		// 押下イベント
		events: {
		},

		filter_ITGRP : {
			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITGRP
		},
		filter_ITEM : {
			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEM
		},
		filter_PACKITEM : {
			kind : amanp_AnaDefs.AMAN_DEFS_KIND_PACKITEM
		},
		filter_COLORITEM : {
			kind : amanp_AnaDefs.AMAN_DEFS_KIND_COLORITEM
		},
		filter_SKUCS : {
			kind : amanp_AnaDefs.AMAN_DEFS_KIND_COLORSIZEITEM
		},
//		filter_ITEMATTR : [{					// 顧客版
//			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS1
//		},{
//			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS2
//		},{
//			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_BRAND
//		},{
//			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_STYLE
//		},{
//			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_DESIGN
//		},{
//			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_MATERIAL
//		},{
//			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_COLOR
//		},{
//			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_T_COLOR
//		},{
//			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_K_SIZE
//		},{
//			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SEASON
//		},{
//			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_USE
//		}],
		filter_ITEMATTR : _.map([				// MD版
			//{ name='AMAN_DEFS_KIND_ITEMATTR_MIN',       val=210, description='商品属性(開始)', },
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS1,	// 211: サブクラス１
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBCLASS2,	// 212: サブクラス２
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SEASON,		// 213: シーズン
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_AGGSEASON,	// 214: 集約シーズン
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_BRAND,		// 215: ブランド
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_STYLE,		// 216: スタイル
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBSTYLE,		// 217: サブスタイル
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_MATERIAL,		// 218: 素材
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_DESIGN,		// 219: 柄
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SUBDESIGN,	// 220: サブ柄
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_USE,			// 221: 用途区分
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_COLOR,		// 222: 色
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_BASECOLOR,	// 223: ベース色
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SIZE,			// 224: サイズ
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ITEMTYPE,		// 225: 商品区分
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_KITYPE,		// 226: KI区分
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_IMPORT,		// 227: 生産区分
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_FACTORY,		// 228: 縫製工場
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_DISPTYPE,		// 232: 陳列方法
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ITEMTASTE,	// 233: 商品テイスト
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY,			// 229: 任意属性
			//{ name='AMAN_DEFS_KIND_ITEMATTR_MAX',       val=230, description='商品属性(終了)', },
			// どうかと思うが ... MD二次対応（商品汎用属性用） #20170216
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1001,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1002,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1003,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1004,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1005,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1006,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1007,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1008,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1009,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1010,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1011,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1012,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1013,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1014,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1015,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1016,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1017,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1018,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1019,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1020,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1021,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1022,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1023,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1024,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1025,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1026,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1027,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1028,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1029,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1030,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1031,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1032,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1033,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1034,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1035,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1036,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1037,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1038,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1039,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1040,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1041,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1042,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1043,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1044,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1045,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1046,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1047,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1048,
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_ANY_BASE + 1049
		], function(anaKind){ return { kind: anaKind }; }),

		filter_ITEMSPEC : {
			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEMSPEC
		},
		filter_ITEMPRICE : _.map([				// MD版
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMPRICE_INIT,	// 211: 当初指定上代
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMPRICE_CURR,	// 211: 現指定上代
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMPRICE_ORGPOS,	// 211: POS元上代
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMPRICE_POS,		// 211: 実上代
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMPRICE_LINE_M,	// 211: プライスライン
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMPRICE_LINE,	// 211: プライスライン(POS元上代)
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMPRICE_LINE_SL_M, // 211: プライスライン[営業部]
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMPRICE_LINE_SL,	  // 211: プライスライン(POS元上代)[営業部]
		], function(anaKind){ return { kind: anaKind }; }),
		filter_ITEMDATE : _.map([				// MD版
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMDATE_YEAR,		// 211: 商品展開年
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMDATE_AGE,		// 211: 商品年齢
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMDATE_FIRST,	// 211: 初回投入年
		], function(anaKind){ return { kind: anaKind }; }),
		filter_ITEMLIST : {
			kind : amanp_AnaDefs.AMAN_DEFS_KIND_ITEMLIST
		},
		filter_MAKER : {
			kind : amanp_AnaDefs.AMAN_DEFS_KIND_MAKER
		},
		filter_ITEMATTRs : _.map([
			amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_SMXKT
		], function(anaKind){ return { kind: anaKind }; }),

		navTitleLabel: '商品・商品分類',
		panelId : 'CAPAV0030',

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
	|| this.anaProc.func_code == 'AMGAV2110'
	|| this.anaProc.func_code == 'AMGAV2120'){

			// Lv2: 商品指定のメニュータイトル - 自由分析のみ有効
			// 20210803 add 併売分析(併売点数分析)・併売分析(品種別分析)
			this.navCACMV0360View = new AnaNaviItemView({
				title: '商品指定',
				tr : {id: 'ca_navItemCACMV0360'}
			}).on('onNaviItemClick', this.navCACMV0360Click);
}

			// Lv2: 商品分類階層のメニュータイトル
			this.navCACMV0050View = new AnaNaviItemView({
				title: '商品分類階層',
				tr : {id: 'ca_navItemCACMV0050'}
			}).on('onNaviItemClick', this.navItemCACMV0050Click);

			// Lv2: 商品のメニュータイトル
			this.navCACMV0060View = new AnaNaviItemView({
				title: '商品',
				tr : {id: 'ca_navItemCACMV0060'}
			}).on('onNaviItemClick', this.navCACMV0060Click);

if(this.anaProc.func_code == 'AMGAV0100'
	|| this.anaProc.func_code == 'AMGAV2110'
	|| this.anaProc.func_code == 'AMGAV2120'){
			// Lv2: カラー商品のメニュータイトル - 自由分析のみ有効
			// 20210803 add 併売分析(併売点数分析)・併売分析(品種別分析)
			this.navCACMV0350View = new AnaNaviItemView({
				title: 'カラー商品',
				tr : {id: 'ca_navItemCACMV0350'}
			}).on('onNaviItemClick', this.navCACMV0350Click);
}

			// Lv2: カラーサイズＳＫＵのメニュータイトル
			this.navCACMV0240View = new AnaNaviItemView({
				title: function(defaultTitle){
					var title = defaultTitle;
					if(Ana.Config.cond.CACMV0240 && !_.isEmpty(Ana.Config.cond.CACMV0240.navMenuTitle)){
						title = Ana.Config.cond.CACMV0240.navMenuTitle;
					}
					return title;
				}('カラーサイズＳＫＵ'),
				tr : {id: 'ca_navItemCACMV0240'}
			}).on('onNaviItemClick', this.navCACMV0240Click);

if(this.anaProc.func_code == 'AMGAV0100'
	|| this.anaProc.func_code == 'AMGAV2110'
	|| this.anaProc.func_code == 'AMGAV2120'){
			// Lv2: 集約商品のメニュータイトル - 自由分析のみ有効
			// 20210803 add 併売分析(併売点数分析)・併売分析(品種別分析)
			this.navCACMV0340View = new AnaNaviItemView({
				title: '集約商品',
				tr : {id: 'ca_navItemCACMV0340'}
			}).on('onNaviItemClick', this.navCACMV0340Click);
}

			// Lv2: 商品属性のメニュータイトル
			this.navCACMV0070View = new AnaNaviItemView({
				title: '商品属性',
				tr : {id: 'ca_navItemCACMV0070'}
			}).on('onNaviItemClick', this.navCACMV0070Click);

			// Lv2: 商品仕様のメニュータイトル
			this.navCACMV0310View = new AnaNaviItemView({
				title: '商品仕様',
				tr : {id: 'ca_navItemCACMV0310'}
			}).on('onNaviItemClick', this.navCACMV0310Click);

			// Lv2: 商品価格のメニュータイトル
			this.navCACMV0320View = new AnaNaviItemView({
				title: '商品価格',
				tr : {id: 'ca_navItemCACMV0320'}
			}).on('onNaviItemClick', this.navCACMV0320Click);

			// Lv2: 商品年のメニュータイトル
			this.navCACMV0330View = new AnaNaviItemView({
				title: '商品年',
				tr : {id: 'ca_navItemCACMV0330'}
			}).on('onNaviItemClick', this.navCACMV0330Click);

			// Lv2: 商品リストのメニュータイトル
			this.navCACMV0080View = new AnaNaviItemView({
				title: '商品リスト',
				tr : {id: 'ca_navItemCACMV0080'}
			}).on('onNaviItemClick', this.navCACMV0080Click);

//			// Lv2: メーカーのメニュータイトル
//			this.navCACMV0090View = new AnaNaviItemView({
//				title: 'メーカー'
//			}).on('onNaviItemClick', this.navCACMV0090Click);

			// -----------------------------
			// 各セレクタView

			var sideLabel = _.isEmpty(this.side) ? '' : this.side;

if(this.anaProc.func_code == 'AMGAV0100'
	|| this.anaProc.func_code == 'AMGAV2110'
	|| this.anaProc.func_code == 'AMGAV2120'){
			// 商品指定選択画面 - 自由分析[AMGAV0100]でのみ有効
			// 20210803 add
			// 併売分析(併売点数分析)[AMGAV2110]
			// 併売分析(品種別分析)[AMGAV2120]
			this.CACMV0360Selector = new  CACMV0360SelectorView({
				el : $('#ca_CACMV0360' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});
}

			// 商品分類選択画面
			this.CACMV0050Selector = new  CACMV0050SelectorView({
				el : $('#ca_CACMV0050' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 商品選択画面
			this.CACMV0060Selector = new  CACMV0060SelectorView({
				el : $('#ca_CACMV0060' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

if(this.anaProc.func_code == 'AMGAV0100'
	|| this.anaProc.func_code == 'AMGAV2110'
	|| this.anaProc.func_code == 'AMGAV2120'){
			// カラー商品選択画面 - 自由分析[AMGAV0100]でのみ有効
			// 20210803 add
			// 併売分析(併売点数分析)[AMGAV2110]
			// 併売分析(品種別分析)[AMGAV2120]
			this.CACMV0350Selector = new  CACMV0350SelectorView({
				el : $('#ca_CACMV0350' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});
}

			// カラーサイズＳＫＵ選択画面
			this.CACMV0240Selector = new  CACMV0240SelectorView({
				el : $('#ca_CACMV0240' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

if(this.anaProc.func_code == 'AMGAV0100'
	|| this.anaProc.func_code == 'AMGAV2110'
	|| this.anaProc.func_code == 'AMGAV2120'){
			// 集約商品選択画面 - 自由分析[AMGAV0100]でのみ有効
			// 20210803 add
			// 併売分析(併売点数分析)[AMGAV2110]
			// 併売分析(品種別分析)[AMGAV2120]
			this.CACMV0340Selector = new  CACMV0340SelectorView({
				el : $('#ca_CACMV0340' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});
}

			// 商品属性選択画面
			this.CACMV0070Selector = new  CACMV0070SelectorView({
				el : $('#ca_CACMV0070' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 商品仕様選択画面
			this.CACMV0310Selector = new  CACMV0310SelectorView({
				el : $('#ca_CACMV0310' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 商品価格選択画面
			this.CACMV0320Selector = new  CACMV0320SelectorView({
				el : $('#ca_CACMV0320' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 商品年選択画面
			this.CACMV0330Selector = new  CACMV0330SelectorView({
				el : $('#ca_CACMV0330' + sideLabel + '_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc
			});

			// 商品リスト選択画面
			this.CACMV0080Selector = new  CACMV0080SelectorView({
				el : $('#ca_CACMV0080' + sideLabel + '_dialog'),	// 配置場所
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
//			$('#ca_CAPAV0030_view')
			if( noItemSpec != null && noItemSpec == 1 ){
if(this.navCACMV0360View){
				this.$el.append(this.navCACMV0360View.render().$el);
}
				this.$el.append(this.navCACMV0050View.render().$el);
				this.$el.append(this.navCACMV0060View.render().$el);
if(this.navCACMV0350View){
				this.$el.append(this.navCACMV0350View.render().$el);
}
				this.$el.append(this.navCACMV0240View.render().$el);
if(this.navCACMV0340View){
				this.$el.append(this.navCACMV0340View.render().$el);
}
				this.$el.append(this.navCACMV0070View.render().$el);
//// 商品仕様を出さない #20151018
////			this.$el.append(this.navCACMV0310View.render().$el);
				this.$el.append(this.navCACMV0320View.render().$el);
				this.$el.append(this.navCACMV0330View.render().$el);
				this.$el.append(this.navCACMV0080View.render().$el);
//				this.$el.append(this.navCACMV0090View.render().$el);

if(this.CACMV0360Selector){
				this.CACMV0360Selector.render();
}
				this.CACMV0050Selector.render();
				this.CACMV0060Selector.render();
if(this.CACMV0350Selector){
				this.CACMV0350Selector.render();
}
				this.CACMV0240Selector.render();
if(this.CACMV0340Selector){
				this.CACMV0340Selector.render();
}
				this.CACMV0070Selector.render();
//// 商品仕様を出さない #20151018
////			this.CACMV0310Selector.render();
				this.CACMV0320Selector.render();
				this.CACMV0330Selector.render();
				this.CACMV0080Selector.render();
//				this.CACMV0090Selector.render();
			}
			else {
if(this.navCACMV0360View){
				this.$el.append(this.navCACMV0360View.render().$el);
}
				this.$el.append(this.navCACMV0050View.render().$el);
				this.$el.append(this.navCACMV0060View.render().$el);
if(this.navCACMV0350View){
				this.$el.append(this.navCACMV0350View.render().$el);
}
				this.$el.append(this.navCACMV0240View.render().$el);
if(this.navCACMV0340View){
				this.$el.append(this.navCACMV0340View.render().$el);
}
				this.$el.append(this.navCACMV0070View.render().$el);
				this.$el.append(this.navCACMV0310View.render().$el);
				this.$el.append(this.navCACMV0320View.render().$el);
				this.$el.append(this.navCACMV0330View.render().$el);
				this.$el.append(this.navCACMV0080View.render().$el);
//				this.$el.append(this.navCACMV0090View.render().$el);

if(this.CACMV0360Selector){
				this.CACMV0360Selector.render();
}
				this.CACMV0050Selector.render();
				this.CACMV0060Selector.render();
if(this.CACMV0350Selector){
				this.CACMV0350Selector.render();
}
				this.CACMV0240Selector.render();
if(this.CACMV0340Selector){
				this.CACMV0340Selector.render();
}
				this.CACMV0070Selector.render();
				this.CACMV0310Selector.render();
				this.CACMV0320Selector.render();
				this.CACMV0330Selector.render();
				this.CACMV0080Selector.render();
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
			this.$("#ca_CAPAV0030_showbuttons").click(function(e){
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
		navCACMV0360Click: function(e){
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
			this.CACMV0360Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0360Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEMATTRs);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0360',
						anafocus : getFocusFunc(_this.filter_ITEMATTRs),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品分類階層
		navItemCACMV0050Click: function(e){
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
			this.CACMV0050Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0050Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITGRP);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0050',
						anafocus : getFocusFunc(_this.filter_ITGRP),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品
		navCACMV0060Click: function(e){
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
			this.CACMV0060Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0060Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEM);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0060',
						anafocus : getFocusFunc(_this.filter_ITEM),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// カラー商品
		navCACMV0350Click: function(e){
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
			this.CACMV0350Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0350Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_COLORITEM);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0350',
						anafocus : getFocusFunc(_this.filter_COLORITEM),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// カラーサイズＳＫＵ
		navCACMV0240Click: function(e){
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
			this.CACMV0240Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0240Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_SKUCS);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0240',
						anafocus : getFocusFunc(_this.filter_SKUCS),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 集約商品
		navCACMV0340Click: function(e){
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
			this.CACMV0340Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0340Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_PACKITEM);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0340',
						anafocus : getFocusFunc(_this.filter_PACKITEM),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品属性
		navCACMV0070Click: function(e){
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
			this.CACMV0070Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0070Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEMATTR);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0070',
						anafocus : getFocusFunc(_this.filter_ITEMATTR),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品仕様
		navCACMV0310Click: function(e){
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
			this.CACMV0310Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0310Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEMSPEC);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0310',
						anafocus : getFocusFunc(_this.filter_ITEMSPEC),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品価格
		navCACMV0320Click: function(e){
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
			this.CACMV0320Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0320Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEMPRICE);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0320',
						anafocus : getFocusFunc(_this.filter_ITEMPRICE),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品年
		navCACMV0330Click: function(e){
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
			this.CACMV0330Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0330Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEMDATE);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0330',
						anafocus : getFocusFunc(_this.filter_ITEMDATE),
						panelId : _this.panelId
					});
				}
				e.srcBackboneView.unsetActive();
			}
		},

		// 商品リスト
		navCACMV0080Click: function(e) {
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
			this.CACMV0080Selector.show(list);

			//サブ画面復帰後処理
			this.CACMV0080Selector.okProc = function(data) {
				if(data != null) {
					rmFocusFunc(_this.filter_ITEMLIST);
					pushFocusFunc(data);
					_this.anaProc.fireAnaCondUpdated({
						id : 'ca_navItemCACMV0080',
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
				id : 'ca_navItemCACMV0360',
				anafocus : getFocusFunc(this.filter_ITEMATTRs),
				panelId : this.panelId
			});
			// 商品分類階層
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0050',
				anafocus : getFocusFunc(this.filter_ITGRP),
				panelId : this.panelId
			});
			// 商品
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0060',
				anafocus : getFocusFunc(this.filter_ITEM),
				panelId : this.panelId
			});
			// カラー商品
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0350',
				anafocus : getFocusFunc(this.filter_COLORITEM),
				panelId : this.panelId
			});
			// カラーサイズＳＫＵ
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0240',
				anafocus : getFocusFunc(this.filter_SKUCS),
				panelId : this.panelId
			});
			// 集約商品
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0340',
				anafocus : getFocusFunc(this.filter_PACKITEM),
				panelId : this.panelId
			});
			// 商品属性
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0070',
				anafocus : getFocusFunc(this.filter_ITEMATTR),
				panelId : this.panelId
			});
			// 商品仕様
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0310',
				anafocus : getFocusFunc(this.filter_ITEMSPEC),
				panelId : this.panelId
			});
			// 商品価格
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0320',
				anafocus : getFocusFunc(this.filter_ITEMPRICE),
				panelId : this.panelId
			});
			// 商品年
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0330',
				anafocus : getFocusFunc(this.filter_ITEMDATE),
				panelId : this.panelId
			});
			// 商品リスト
			this.onCondUpdated(this.anaProc, {
				id : 'ca_navItemCACMV0080',
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
			case 'ca_navItemCACMV0070':
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
			case 'ca_navItemCACMV0310':
			case 'ca_navItemCACMV0320':
			case 'ca_navItemCACMV0330':
				// 商品仕様
				// name2でソートする
				anafocus.sort(function(a, b){
					if (a.name2 > b.name2) return 1;
					if (a.name2 < b.name2) return -1;
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
            case 'ca_navItemCACMV0360':	// 商品指定
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
