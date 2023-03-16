/*
 * clcom.js が事前に読み込まれていること！
 */
$(function() {

	console.log('[ana.js] Loading ...');

	// --------------------------------------------------------
	// ログインチェック
	if (!clcom.hasAuthCookies()) {
		// ログインしていない場合
		console.error('Invalid session status, abort!');
		clutil.gohome(clcom.urlRoot + '/err/nosession.html');
		return;
	}

	Ana = {
		// コンフィギュレーション
		Config: {
			cond: {
				CACMV0190: {
					// 表示項目設定
					display: true	//false
				},
				CACMV0210: {
					// 表示設定
					disp_way: 'enabled',		// 表示項目並びの{活性,非活性化} - default='enabled'
					f_subtotal: 'enabled',		// 小計表示の{活性,非活性化} - default='enabled'
					existsum: 'unused'			// 既存店集計UIの{要,不要} - default='unused'
				},
				CACMV0011: {
					// 期間詳細
					sdayGroupDisplay: false,		// 特定日系の表示/非表示
					mstsrchdate: {
//						allSelectLabel: '',
						eachSelectLabel: '店舗・商品別に指定',
//						org: true,
//						itgrp: true,
						memb: false		// マスタ検索日: 顧客マスタのますた検索日は隠す
					},
				},
				CACMV0160: false,	// 社員属性メニューアイテム有無
				CACMV0240: {
					navMenuTitle: 'ＪＡＮコード',
					inputJanCode: true,
					tblCodeLabel: 'ＪＡＮコード'
				},
				CACMV0070: {
					// 商品属性サーチ URI リソース名
					itemattr_srch_resId: 'aman_se_itemattr_srch'
				},
				CACMV0180: {
					// 軸設定パネル
					isMDABCAxis: false,		// MD 版 ABC 基準の選択UIを表示 true:する、false:しない
					attentionText: null		// 分析軸注意喚起テキスト
				},
				CACMV0310: {
					// 商品仕様サーチ URI リソース名
					itemspec_srch_resId: 'aman_se_itemspec_srch'
				},
				MDCMV0200: {
					// 表示項目設定
					display: true	//false
				},
				MDCMV0210: {
					// 表示設定
					disp_way: 'enabled',		// 表示項目並びの{活性,非活性化} - default='enabled'
					f_subtotal: 'enabled',		// 小計表示の{活性,非活性化} - default='enabled'
					existsum: 'unused'			// 既存店集計UIの{要,不要} - default='unused'
				},
				MDCMV1011: {
					// 期間詳細
					sdayGroupDisplay: false,		// 特定日系の表示/非表示
					mstsrchdate: {
//						allSelectLabel: '',
						eachSelectLabel: '店舗・商品別に指定',
//						org: true,
//						itgrp: true,
//						memb: true
					},
				},
				MDCMV1160: false,	// 社員属性メニューアイテム有無
				MDCMV1240: {
					navMenuTitle: 'ＪＡＮコード',
					inputJanCode: true,
					tblCodeLabel: 'ＪＡＮコード'
				},
				MDCMV1070: {
					// 商品属性サーチ URI リソース名
					itemattr_srch_resId: 'aman_se_itemattr_srch'
				},
				MDCMV1310: {
					// 商品仕様サーチ URI リソース名
					itemspec_srch_resId: 'aman_se_itemspec_srch'
				},
			},
			catalog: {
				applyMstSrchDate: false		// カタログ適用時にマスタ検索日を復元、true:する、false:しない
			},
			nav: {
				supportSaveList: false		// リストに登録 - サポートしない
			}
		},
		// define 値とラベル名称の関係を定義
		Const: {
			// ---------------------------------------------------------------
			// amanp_AnaFocus のプロパティ名リスト
			naFocusPropertyKeys: [
				'kind', 'attr', 'func_id', 'val', 'val2', 'str', 'code', 'name', 'name2',
				'axis_only', 'select_status', 'is_drill_down'
			],

			// ---------------------------------------------------------------
			// amgbp_AnaSortKey ソート順定義
			sortOrder: {
				'asc': {
					name: '昇順',
					className: 'sortAsc',
					value: amgbp_AnaSortKey.AMGBP_ANA_SORTKEY_ORDER_ASCENDING
				},
				'dsc': {
					name: '降順',
					className: 'sortDsc',
					value: amgbp_AnaSortKey.AMGBP_ANA_SORTKEY_ORDER_DESCENDING
				}
			},

			// --- amgbp_AnaDefs#define --------------------------------------
			// 階層構造になれる軸種別
			HierarchicalAxisKindMap: function(){
				var map = new Object();
				map[amgbp_AnaDefs.AMGBA_DEFS_KIND_ORG]				 = '組織';			// 101
				map[amgbp_AnaDefs.AMGBA_DEFS_KIND_ITGRP]				 = '商品分類';		// 201
				// 商品属性系はカット #20150104 OTK
				//map[amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SUBCLASS1] = 'サブクラス１';	// 211
				//map[amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SUBCLASS2] = 'サブクラス２';	// 212
				//map[amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_BRAND]	 = 'ブランド';		// 213
				//map[amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_STYLE]	 = 'スタイル';		// 214
				//map[amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_DESIGN]	 = 'デザイン';		// 215
				//map[amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_MATERIAL]	 = '素材';			// 216
				//map[amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_COLOR]	 = 'カラー';		// 217
				//map[amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_T_COLOR]	 = '色系';			// 218
				//map[amanp_AnaDefs.AMAN_DEFS_KIND_ITEMATTR_K_SIZE]	 = '体型・サイズ';	// 219
				//map[amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SEASON]	 = 'シーズン';		// 220
				//map[amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_USE]		 = '用途区分';		// 321
				//map[amgbp_AnaDefs.AMGBA_DEFS_KIND_MAKER]				 = 'メーカー';		// 301
				// シーズンは復活させる #20150324 OTK
				map[amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SEASON]	 = 'シーズン';		// 220
				map[amgbp_AnaDefs.AMGBA_DEFS_KIND_ADDR]				 = '住所';			// 804
				map[amgbp_AnaDefs.AMGBA_DEFS_KIND_YMD]				 = '日付';
				return map;
			}(),
			_eof: 'Const//'
		},
		TypeCode: {
			// TODO: gscm_type_get で区分を取得？？？
			_eof: 'TypeCode//'
		},
		Util: {
			/**
			 * 0オリジン行インデックス ⇒ エクセル行インデックスへ変換
			 */
			toXlsRowIndex: function(index){
				return index+1;
			},
			/** エクセル列インデックス変換マップ */
			XlsColIndexMap: [
				'A','B','C','D','E','F','G','H','I','J',
				'K','L','M','N','O','P','Q','R','S','T',
				'U','V','W','X','Y','Z'
			],
			/**
			 * 0オリジン列インデックス ⇒ エクセル列インデックス（ABC)へ変換
			 */
			toXlsColIndex: function(index){
				var abc = '';
				var q = index, a;
				do{
					a = q % 26;
					abc = Ana.Util.XlsColIndexMap[a] + abc;
					q = Math.floor(q / 26);
				}while(q-- > 0);
				return abc;
			},
			/**
			 * obj から絞り込み条件の要素を取り出す。
			 */
			toAnaFocus: function(obj){
				return _.pick(obj, Ana.Const.naFocusPropertyKeys);
			},
			/**
			 * 数値化する。数値化できない場合は 0 を返す。
			 */
			valueToNumber: function(x) {
				var fixedVal;
				if(_.isBoolean(x)){
					// boolean は true[1], false[0] とでもしておく。
					fixedVal = x ? 1 : 0;
				}else if(_.isArray(x)){
					fixedVal = 0;
				}else{
					fixedVal = parseInt(x);
				}
				return _.isNaN(fixedVal) ? 0 : fixedVal;
			},
			/**
			 * obj がプリミティブ型の場合、可能な限り Number 型に変換する。
			 * obj が配列型の場合、内部要素に対して Number 型に変換する。コピー配列を返す。
			 * obj がオブジェクト型の場合、内部プロパティに対して Number 型にする。コピーオブジェクトを返す。
			 */
			valuesToNumber: function(obj) {
				if(_.isNullOrUndefined(obj)){
					return obj;
				}
				if(_.isNumber(obj)){
					return obj;
				}
				if(_.isEmpty(obj)){
					return obj;
				}
				// 配列
				if(_.isArray(obj)){
					var xdst = new Array();
					for(var k in obj){
						var v = obj[k];
						xdst[k] = this.valuesToNumber(v);
					}
					return xdst;
				}
				// オブジェクト
				if(_.isObject(obj)){
					var xdst = new Object();
					for(var k in obj){
						var v = obj[k];
						xdst[k] = this.valuesToNumber(v);
					}
					return xdst;
				}
				// プリミティブ型
				var num = Number(obj);
				return _.isNaN(num) ? obj : num;
			},
			/**
			 * Int32 サイズの Number 値を返す。最大、最小値を超える場合は切り詰める。
			 * MIN(-2147483648) - MAX(2147483647)
			 */
			valueToInt32: function(val){
				var fixedval = Ana.Util.valuesToNumber(val);
				if(fixedval > 2147483647/*INT32_MAX*/){
					fixedval = 2147483647;
				}else if(fixedval < -2147483648/*INT32_MIN*/){
					fixedval = -2147483648;
				}
				return fixedval;
			},
			/**
			 * ディープコピー版 clone 関数。
			 */
			dclone: function(obj) {
				var xdst = null;
				if(_.isArray(obj)){
					xdst = new Array();
				} else if(_.isObject(obj)){
					xdst = new Object();
				}
				if(xdst){
					for(var k in obj){
						var v = obj[k];
						xdst[k] = this.dclone(v);
					}
					return xdst;
				}
				return obj;
			},
			/**
			 * 指定日付(Date型) から dmonth ヶ月加算した日付を生成する
			 */
			addMonth: function(dt, dmonth){
				if(dmonth === 0){
					return dt;
				}
				var xdt = new Date(dt);
				xdt.setMonth(dt.getMonth() + dmonth);
				return xdt;
			},
			/**
			 * 指定日付(Date型) から dday 日加算した日付を生成する
			 */
			addDay: function(dt, dday){
				if(dday === 0){
					return dt;
				}
				var xdt = new Date(dt);
				xdt.setDate(dt.getDate() + dday);
				return xdt;
			},
			/**
			 * Date -> yyyyMM 年月フォーマットの Number へ変換
			 */
			date2YYYYMM: function(dt){
				return (dt.getFullYear() * 100) + (dt.getMonth() + 1);
			},
			/**
			 * Date -> yyyyMMdd 年月日フォーマットの Number へ変換
			 */
			date2YYYYMMDD: function(adate){
				var dt = _.isDate(adate) ? adate : new Date();
				return (dt.getFullYear() * 10000) + (dt.getMonth()+1)*100 + (dt.getDate());
			},
			/**
			 * yyyyMMdd -> Date
			 */
			yyyyMMdd2Date: function(yyyymmdd){
				var year = Math.floor(yyyymmdd / 10000);
				var month = (Math.floor(yyyymmdd / 100) % 100);
				var day = yyyymmdd % 100;
				return new Date(year, month-1, day);
			},
			/**
			 * 四半期マップ：
			 * キー：yyyyNN 数値
			 */
			QuarterOfYearMap: {
				keys: []
			},	// this._initialize() 関数で map の中身をセットする
			/**
			 * 半期マップ：
			 * キー：yyyyNN 数値
			 */
			HalfOfYearMap: {
				keys: []
			},		// this._initialize() 関数で map の中身をセットする
			/**
			 * 年週マップ：
			 * キー: yyyyWW 数値
			 */
			WeekOfYearMap: {
				keys: []
			},		// this._initialize() 関数で map の中身をセットする
			/**
			 * yyyymmdd に相当する期間定義情報を検索する。
			 */
			findPeriod: function(unit, yyyymmdd){
				var map = null;
				switch(unit){
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YW:	// [ 9] 年周: YYYYWW
					map = this.WeekOfYearMap;
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y2:	// [10] 半期: YYYYNN
					map = this.HalfOfYearMap;
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y4:	// [11] 四半期 YYYYNN
					map = this.QuarterOfYearMap;
					break;
				default:
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YM:	// [ 2] 年月：YYYYMM
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YMD:	// [ 3] 年月日: YYYYMMDD
					return null;
				}
				// 期間は降順ソートされている。
				for(var i = 0; i < map.keys.length; i++){
					var k = map.keys[i];
					var p = map[k];
					if(yyyymmdd > p.ed_iymd){
						// 早めに切り上げ
						break;
					}
					if(p.st_iymd <= yyyymmdd && yyyymmdd <= p.ed_iymd){
						return p;
					}
				}
				return null;
			},
			/**
			 * ナンバーフォーマット
			 * 1234567.123 → "1,234,567.123"
			 */
			numberFormat: function(num){
				return num.toString().replace(/^[+-]?\d+[^\.]/, function(t){return t.replace(/([\d]+?)(?=(?:\d{3})+$)/g, function(t){ return t + ','; });});
			},
			/**
			 * ユニークIDを持つ配列から、IDマップを生成する。
			 */
			idMap: function(array, idPropName, optwrapfunc){
				var map = new Object();
				if(!_.isArray(array) || _.isEmpty(array)){
					return map;
				}
				var key = idPropName;
				if(!_.isString(key) || _.isEmpty(key)){
					key = 'id';
				}
				var wrapfunc;
				if(_.isFunction(optwrapfunc)){
					wrapfunc = optwrapfunc;
				}else{
					wrapfunc = function(val){return val;};
				}
				for(var i = 0; i < array.length; i++){
					var v = array[i];
					var mapKey = v[key];
					if(!mapKey){
						console.warn('[' + key + '] not found in [' + JSON.stringify(v) + ']');
						continue;
					}
					if(map[mapKey]){
						// キーダブり - ダブリはサーバレスポンスの異常、後出しルール適用。
						console.warn('[' + mapKey + '] duplicated Id, v1[' + JSON.stringify(map[mapKey]) + '], v2[' + JSON.stringify(v) + '], use v2.');
					}
					map[mapKey] = wrapfunc(v, i);
				}
				return map;
			},
			/**
			 * idMap 派生関数。
			 */
			idTreeNodeMap: function(array, idPropName){
				return this.idMap(array, idPropName, function(v, index){
					return new Ana.Util.TreeNode({data:v, seqno: index});
				});
			},
			/**
			 * セルデータの表示テキストを返す。
			 */
			cellToString: function(cell, disp_amunit/*円,千円,万円*/){
				var text = '';
				var val = cell.value;
				switch(cell.kind){
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_UNKNOWN:
					text = '-';
					break;
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_STRING:
					text = cell.str;
					break;
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_AMOUNT:		// 金額（１倍値）
					// 円単位/千円単位/万円単位対応
					switch(disp_amunit){
					case amgbp_AnaHead.AMGBP_ANA_REQ_DISP_AMUNIT_1000:
						val = (val / 1000).toFixed(0);
						break;
					case amgbp_AnaHead.AMGBP_ANA_REQ_DISP_AMUNIT_10000:
						val = (val / 10000).toFixed(0);
						break;
					}
					// fall through
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_DECIMAL:		// 整数
					text = val.toString();
					text = this.numberFormat(text);
					break;
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_AMREAL:
					// 円単位/千円単位/万円単位対応
					switch(disp_amunit){
					case amgbp_AnaHead.AMGBP_ANA_REQ_DISP_AMUNIT_1000:
						val /= 1000;
						break;
					case amgbp_AnaHead.AMGBP_ANA_REQ_DISP_AMUNIT_10000:
						val /= 10000;
						break;
					}
					// fall through
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_RATIO:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_TIME:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_REAL:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_REAL0:
				// case amanp_AnaCellData.AMANP_ANA_CELLDATA_KIND_REAL2:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_QYREAL:
					if(cell.denominator === 0){
						// 比較相手がいないので、とりあえず空欄で返す。
						text = '';
					}else{
						text = (val / cell.denominator).toFixed(cell.decpoint);
						text = this.numberFormat(text);
					}
					break;
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_DOUBLE:		// 実数
					text = cell.dvalue.toFixed(cell.decpoint);
					text = this.numberFormat(text);
					break;
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_IYMD:		// yyyymmdd --> 'yyyy/mm/dd'
					text = (val / 10000).toFixed(0)
						+ '/' + (val % 10000 / 100).toFixed(0)
						+ '/' + (val % 100).toFixed(0);
					break;
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_YMD:			// 内部日付
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_WEATHER:		// ???
					text = val.toString();
					break;
				}
				return text;
			},
			/**
			 * 当該セルデータのテキスト揃えを返す。｛'left', 'right', 'center'｝
			 */
			cellTextAlignment: function(cell){
				var alignment;
				switch(cell.kind){
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_DECIMAL:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_AMOUNT:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_DOUBLE:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_RATIO:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_TIME:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_REAL:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_REAL0:
				// case amanp_AnaCellData.AMANP_ANA_CELLDATA_KIND_REAL2:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_QYREAL:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_AMREAL:
					//alignment = 'right';
					alignment = null;	// デフォルトの text-align スタイルを右寄せに定義しておく。
					break;
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_YMD:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_IYMD:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_WEATHER:
					alignment = 'center';
					break;
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_UNKNOWN:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_STRING:
					alignment = 'left';
					break;
				default:
					// n/a とかになる？
					alignment = 'center';
					break;
				}
				return alignment;
			},
    		/**
     		 * 当該セルデータの色設定
     		 * @praram cell セルデータ
    		 * @param colorList
    		 * @return colorName 色サンプル名
    		 */
			 cellColor: function(cell, colorList){
				if(_.isEmpty(colorList)){
				  return null;
				}
				var val, colorName = null;

				var denom;             // 分母
				switch(cell.kind){
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_DECIMAL:   // 1:整数
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_AMOUNT:    // 2:金額1倍値
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_DOUBLE:    // 4:実数
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_AMREAL:    // 13:金額実数
				// case amanp_AnaCellData.AMANP_ANA_CELLDATA_KIND_ABC:       // 15:ABC
				  denom = 1;
				  break;
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_RATIO:     // 5:比率
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_REAL:      // 8:実数
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_QYREAL:    // 12:数量実数
				  denom = cell.denominator;
				  break;
				// case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_DECIMAL100:        // 20:整数100倍
				// case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_AMOUNT100:         // 21:金額100倍
				//   denom = 100;
				//   break;
				// case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_AMOUNT10000:       // 22:金額10000倍
				//   denom = 10000;
				//   break;
				default:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_UNKNOWN:   // 0:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_STRING:    // 3:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_WEATHER:   // 6:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_TIME:      // 7:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_YMD:       // 10:
				case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_IYMD:      // 11:
				// case amgbp_AnaCellData.AMGBP_ANA_CELLDATA_KIND_YM:        // 14:
				  return null;
				}

				val = cell.value / denom;

				// 閾値判定
				var color = null;
				for(var i=0; i<colorList.length; i++){
				  var c = colorList[i];
				  var from = (c.from_val == null) ? -1 * Math.pow(2,52) : c.from_val;
				  var to   = (c.to_val   == null) ? Math.pow(2,52) : c.to_val;
				  if(from <= val && val < to){
					colorName = c.color;
					break;
				  }
				}

				return colorName;
			  },
			/**
			 * 軸要素のラベル名文字列を返す。
			 */
			axisElemToString: function(axElem){
				if(_.isNullOrUndefined(axElem)){
					return '';
				}
				var title = null;
				if(_.isString(axElem.code) && axElem.code.length > 0){
					title = axElem.code;
				}
				if(_.isString(axElem.name) && axElem.name.length > 0){
					if(title){
						title += ': ' + axElem.name;
					}else{
						title = axElem.name;
					}
				}
				return title;
			},
			/**
			 * 軸要素のラベル名文字列を返す。親要素が type[DATA] の場合は、
			 * 親要素のラベル名を連結する。
			 */
			axisNodeAndDataToString: function(axNode){
				var title = Ana.Util.axisElemToString(axNode.data);
				var node = axNode.parent;
				while(!node.isRoot()){
					var dt = node.data;
					if(_.isNullOrUndefined(dt) || dt.type !== amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_DATA){
						break;
					}
					// FIXME: 区切り文字とりあえず '/' としておくけど、全角スペースとかがいい？
					title = Ana.Util.axisElemToString(node.data) + ' / ' + title;
					node = node.parent;
				}
				return title;
			},

			// 初期化：内部プロパティの値を取得＆整理などする
			_initialize: function(){
				var periodlist = clcom.getPeriodList() || [];
				periodlist.sort(function(a, b){
					// 降順にソート。
					// type > year > period > st_iymd > ed_iymd
					var diff = a.type - b.type;
					if(diff !== 0){
						return -diff;
					}
					diff = a.year - b.year;
					if(diff !== 0){
						return -diff;
					}
					diff = a.period - b.period;
					if(diff !== 0){
						return -diff;
					}
					diff = a.st_iymd - b.st_iymd;
					if(diff !== 0){
						return -diff;
					}
					diff = a.ed_iymd - b.ed_iymd;
					return -diff;
				});
				if(_.isArray(periodlist)){
					for(var i = 0; i < periodlist.length; i++) {
						var p = periodlist[i];
						var dstmap = null;
						switch(p.type){
						case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y4:	// 四半期: key = {201301, 201302}
							dstmap = this.QuarterOfYearMap;
							break;
						case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y2:	// 半期: key = { 201301, 201302, 201303, 201304 }
							dstmap = this.HalfOfYearMap;
							break;
						case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YW:	// 年週: key = { 201301, 201302, ... 201353 }
							dstmap = this.WeekOfYearMap;
							break;
						}
						if(dstmap){
							var key = p.year * 100 + p.period;
							dstmap.keys.push(key);
							dstmap[key] = p;
						}
					}
				}
				return this;
			},
			/**
			 * 区分値由来の絞り込み条件にラベル名を補完する。
			 */
			fixTypeValsAnaFocus: function(f){
				var ff = (_.isArray(f)) ? f : [f];
				for(var i = 0; i < ff.length; i++){
					var anaFocus = ff[i];
					var typeVals = null;
					var typeTypeName;
					switch(anaFocus.kind){
					case amgbp_AnaDefs.AMGBA_DEFS_KIND_NEWSTORE_LOGIC:	// 新店ロジック
						typeVals = clcom.getTypeList(amcm_type.AMCM_TYPE_ANA_NEWSTORE_LOGIC, anaFocus.val);
						typeTypeName = '新店ロジック';
						break;
					case amgbp_AnaDefs.AMGBA_DEFS_KIND_STOREATTR_SMX:	// SMX店舗
						typeVals = clcom.getTypeList(amcm_type.AMCM_TYPE_ANA_STOREATTR_SMX, anaFocus.val);
						typeTypeName = 'SMX店舗';
						break;
					case amgbp_AnaDefs.AMGBA_DEFS_KIND_STORE_SORT:		// 店舗並び順
						typeVals = clcom.getTypeList(amcm_type.AMCM_TYPE_ANA_STORE_SORT, anaFocus.val);
						typeTypeName = '店舗並び順';
						break;
					case amgbp_AnaDefs.AMGBA_DEFS_KIND_NEWSTORE_COND:	// 新店既存店
						typeVals = clcom.getTypeList(amcm_type.AMCM_TYPE_ANA_NEWSTORE_COND, anaFocus.val);
						typeTypeName = '新店/既存店条件';
						break;
					case amgbp_AnaDefs.AMGBA_DEFS_KIND_STOREATTR_CLOSED:	// 閉店店舗
						typeVals = clcom.getTypeList(amcm_type.AMCM_TYPE_ANA_STOREATTR_CLOSED, anaFocus.val);
						typeTypeName = '閉店店舗';
						break;
					case amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SMXKT:	// SMX・KT商品
						typeVals = clcom.getTypeList(amcm_type.AMCM_TYPE_ANA_ITEMATTR_SMXKT, anaFocus.val);
						typeTypeName = 'サイズMAX部門 または KTサイズ';
						break;
					// case amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ALLSTORE:	// 評価減対象
					// 	typeVals = clcom.getTypeList(amcm_type.AMCM_TYPE_ALLWRITEDOWN, anaFocus.val);
					// 	typeTypeName = '評価減対象';
					// 	break;
					}
					if(!_.isEmpty(typeVals)){
						anaFocus.name = typeVals[0].name;
						anaFocus.name2 = typeTypeName;
					}
				}
				return f;
			},
			/**
			 * 複合表示項目idから、AMGBA_DI_I_MASK, AMGBA_DI_G_MASK 成分でハッシュキーを生成する。
			 */
			dispItemIGKey: function(dispitem_id){
				var grpId  = dispitem_id & amgbp_AnaDispItemDefs.AMGBA_DI_G_MASK;
				var itemId = dispitem_id & amgbp_AnaDispItemDefs.AMGBA_DI_I_MASK;
				return 'Gx' + grpId.toString(16) + '_Ix' + itemId.toString(16);
			},
			_eof: 'end of Util//'
		},
		_eof: 'end of Ana//'
	};

	//-- Ana.Util.TreeNode: コンストラクタ --------------------------------
	Ana.Util.TreeNode = function(options){
		_.extend(this, {
			parent: null,
			children: new Array()
		}, options);
	};
	_.extend(Ana.Util.TreeNode.prototype, /*Backbone.Events,*/ {
		// ルートノードかどうか判定
		isRoot: function(){
			return _.isNull(this.parent);
		},
		// リーフノードかどうか判定
		isLeaf: function(){
			return _.isEmpty(this.children);
		},
		// リーフノードかどうか判定（軸要素用）
		isAxLeaf: function(){
			var dt = this.data;
			if(dt && dt.type) {
				switch(dt.type) {
				case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_TOTAL:
				case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_SUBTOTAL:
				case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_NORMAL:
					// 軸種別が合計、小計、ノーマルは Leaf に入れる。
					return true;
				case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_DATA:
					return false;
				default:
				}
			}
			return this.isLeaf();
		},
		// 子の個数
		childCount: function(){
			return _.isArray(this.children) ? this.children.length : 0;
		},
		// 自身を起点と見なしたときの最下層リーフノード数を返す。
		// 引数 opt は指定不要。再帰コールの時に内部使用している変数。
		leafCount: function(opt){
			var lfCount = 0;
			if(_.isNullOrUndefined(opt)){
				opt = {};
			}
			if(!_.isFunction(opt.isLeaf)){
				opt.isLeaf = function(node){
					return node.isLeaf();
				};
			}
			if(opt.isLeaf(this)) {
				++lfCount;
			}
			var nChild = this.childCount();
			for(var i = 0; i < nChild; i++){
				lfCount += this.children[i].leafCount(opt);
			}
			return lfCount;
		},
		// 自身を起点と見なしたときの最下層リーフノード数を返す。（軸要素用）
		axLeafCount: function(){
			var opt = {
				isLeaf: function(node){
					return node.isAxLeaf();
				}
			};
			return this.leafCount(opt);
		},
		// 子要素を追加する
		appendChild: function(child){
			this.children.push(child);
			child.parent = this;
		},
		// 子要素を先頭に追加する
		prependChild: function(child){
			this.children.unshift(child);
			child.parent = this;
		},
		// 親を root まで辿ったノード配列を返す。
		// propname を指定すると、ノード内のプロパティ要素の配列でパスリストを作る。
		toPathArray: function(containRoot, propname){
			var path = new Array();
			var anode = this;
			while(!_.isNullOrUndefined(anode)){
				if(propname){
					path.unshift(anode[propname]);
				}else{
					path.unshift(anode);
				}
				anode = anode.parent;
			}
			if(containRoot!=true) {
				path.shift();
			}
			return path;
		},
		// 自身を起点と見なしたときの最下層リーフノード配列を返す。
		// また、各ノードにおける木構造の深さを level プロパティに設定する。
		buildLeafNodeArray: function(opt, iniLevel){
			if(!_.isObject(opt)){
				opt = new Object();
			}
			if(!_.isArray(opt.array)){
				opt.array = new Array();	// リーフノード集約用配列領域
			}
			if(!_.isFunction(opt.isLeafFunc)){
				opt.isLeafFunc = function(aNode){
					return aNode.isLeaf();
				};
			}
			var array = opt.array;
			if(opt.isLeafFunc(this)){
				if(_.isFunction(opt.decorateFunc)){
					// 選出されたリーフノードオブジェクトに対して装飾する
					if(opt.decorateFunc(this)){
						array.push(this);
					}
				}else{
					array.push(this);
				}
			}

			// ツリー構造の深さ
			this.level = _.isNumber(iniLevel) ? iniLevel : 0;

			// 再帰コール
			var nChild = this.childCount();
			for(var i = 0; i < nChild; i++){
				this.children[i].buildLeafNodeArray(opt, this.level+1);
			}

			return opt.array;
		},
		// 自身を起点と見なしたときの最下層リーフノード配列を返す。（軸専用）
		buildAxLeafNodeArray: function(opt){
			if(!_.isObject(opt)){
				opt = new Object();
			}
			opt.isLeafFunc = function(aNode){
				return aNode.isAxLeaf();
			};
			return this.buildLeafNodeArray(opt);
		},

		// ルートノードを返す
		getRoot: function(){
			var node = this;
			while(!node.isRoot()){
				node = node.parent;
			}
			return node;
		},
		// Level値（深さ）を返す：ROOT から Lv0 と勘定する。
		// この getter() 関数は毎回 parent を辿って、木構造の負荷さを計算する。
		getLevel: function(){
			var lv = 0;
			var node = this;
			while(!node.isRoot()){
				lv++;
				node = node.parent;
			}
			return lv;
		},
		// 親要素中で指定 lv の要素を返す。見つからない場合は null を返す。
		findParentByLevel: function(lv){
			var node = this;
			while(!node.isRoot()){
				if(node.level === lv){
					return node;
				}
				node = node.parent;
			}
			return null;
		},
		// 当該ノードから親要素を辿り、一番近い初期Leafノードを探す。
		findIniLeaf: function(){
			var node = this;
			while(node){
				if(node.iniLeaf){
					break;
				}
				node = node.parent;
			}
			return node;
		},
		_eof: 'end of Ana.Util.TreeNode.prototype//'
	});

	//-- Ana.Util.cellMap: コンストラクタ --------------------------------
	// vid(縦軸), hid(横軸), did(表示項目) で pointing されるセルデータを探すためのデータ構造化
	Ana.Util.CellMap = function(/*cellDataArray*/){
		this.size = 0;	// 要素の個数
		this.map = {};	// マップ実体
		for(var i = 0; i < arguments.length; i++){
			this.push(arguments[i]);
		}
	};
	_.extend(Ana.Util.CellMap.prototype, /*Backbone.Events,*/ {
		// vid(縦軸), hid(横軸), did(表示項目) で pointing されるセルデータを返す。
		find: function(vid,hid,did){
			var key = this.hash(vid,hid,did);
			return this.map[key];
		},
		// vid/hid/did ハッシュ値算出
		hash: function(vid,hid,did){
			return 'v'+Ana.Util.valueToNumber(vid)
					+'h'+Ana.Util.valueToNumber(hid)
					+'d'+Ana.Util.valueToNumber(did);
		},
		// CellDataを追加する
		push: function(cellData){
			if(_.isArray(cellData)){
				for(var i = 0; i < cellData.length; i++){
					this.push(cellData[i]);
				}
			}else if(_.isObject(cellData)){
				var key = this.hash(cellData.vid,cellData.hid,cellData.did);
				if(_.has(this.map, key)){
					// 重複 ⇒ 上書き
					console.warn(
							'duplicated cell: (vid,hid,did)=('
							+ cellData.vid + ',' + cellData.hid + ',' + cellData.did +'), '
							+ 'old[' + JSON.stringify(this.map[key]) + ']'
							+ 'new[' + JSON.stringify(cellData) + ']'
							+ ' ...overriden.');
				}else{
					this.size++;
				}
				this.map[key] = cellData;
			}
			return this;
		},
		// キーを追加する。
		pushKey: function(vid,hid,did){
			var key = this.hash(vid,hid,did);
			if(_.has(this.map, key)){
				return false;
			}else{
				this.map[key] = {vid:vid, hid:hid, did:did};
				this.size++;
				return true;
			}
		},
		// CellData を削除する
		removeKey: function(vid,hid,did){
			var key = this.hash(vid,hid,did);
			if(_.has(this.map, key)){
				this.size--;
				delete this.map[key];
			}
		},
		// CellData を削除する
		remove: function(cellData){
			this.removeKey(cellData.vid, cellData.hid, cellData.did);
		},
		// 指定 hid と合致するセルを削除する（列単位で削除）
		// 削除数を返す。
		removeByHid: function(hid){
			var beforeSize = this.size;
			for(var key in this){
				var val = this.map[key];
				if(val && val.hid === hid){
					// 削除対象
					this.size--;
					delete this.map[key];
				}
			}
			return beforeSize - this.size;
		},
		// 指定 vid と合致するセルを削除する（行単位で削除）
		// 削除数を返す。
		removeByVid: function(vid){
			var beforeSize = this.size;
			for(var key in this){
				var val = this.map[key];
				if(val && val.vid === vid){
					// 削除対象
					this.size--;
					delete this.map[key];
				}
			}
			return beforeSize - this.size;
		},
		// 指定キーを含むかどうか検査
		containsKey: function(vid,hid,did){
			var key = this.hash(vid,hid,did);
			return _.has(this.map, key);
		},
		// キー配列を返す
		keys: function(){
			return _.map(this.map, function(val, key){
				return key;
			});
		},
		// 値配列を返す
		values: function(){
			return _.map(this.map, function(val, key){
				return val;
			});
		},
		_eof: 'end of Ana.Util.CellMap.prototype//'
	});

	//-- Ana.Util.xxxx: 拡張プロパティ追加など内部メンバを初期化する ------
	//Ana.Util._initialize();		XXX Ana.Proc.iniGet で中で初期化するか・・・

	//-- Ana.Proc: コンストラクタ -----------------------------------------
	/**
	 * options はメニューから渡される起動引数を想定。
	 */
	Ana.Proc = function(options) {
		// コンテキスト - 分析アプリ情報を格納。
		// メニュー画面から渡されるであろう起動引数や、
		// URI などの情報を保持する。
		// 予め、デフォルト値を与えておく。
		// AnaProc のコンストラクタで上書きする。
		var defaults = {
			anamenuitem_name: '顧客マトリックス分析',
			func_id: 40,
			func_code: "CAANV0010",
			f_anakind: 40,
			catalog_id: 0,
			catalog_name: null,
			catalog: null,
			guide: '',
			pageSize: 1000,							// 分析結果１ページ当たりの表示件数
			getIniURI: 'gsan_ap_anaproc_init',		// 分析初期データ取得URI
			searchURI: 'gsan_ap_anaproc_matrix',	// 分析実行URI - 顧客マトリックス

			// ----------------------------------------------------------------------
			cond: {
				//A) 分析期間：[0]対象期間、[1]比較期間	-- プロトコルの型そのまま持つ。
				anaPeriods: function(){
					/*
					 * プログラムデフォルトを［年月指定、先々月～先月］とでもしておく。
					 */
					var now = Ana.Util.yyyyMMdd2Date(clcom.getOpeDate());
					var yyyymm0 = Ana.Util.date2YYYYMM(Ana.Util.addMonth(now, -1));
					var yyyymm1 = Ana.Util.date2YYYYMM(Ana.Util.addMonth(now, -2));
					return [
						{	// [0] 対象期間
							q_type: 0,	// 指定なし
							type:   amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YM,	// 年月指定
							p_from: yyyymm0,
							p_to:   yyyymm0,
							name : Math.floor(yyyymm0/100) + '年' + Math.floor(yyyymm0%100) + '月～' +
								Math.floor(yyyymm0/100) + '年' + Math.floor(yyyymm0%100) + '月'	// shimizu 追加
						},
						{	// [1] 比較期間
							q_type: 0,	// 指定なし
							type:   amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YM,	// 年月指定
							p_from: yyyymm1,
							p_to:   yyyymm1,
							name : Math.floor(yyyymm1/100) + '年' + Math.floor(yyyymm1%100) + '月～' +
								Math.floor(yyyymm1/100) + '年' + Math.floor(yyyymm1%100) + '月',	// shimizu 追加
							select:	false	// ！！拡張！！ 比較期は選択していないつもりのフラグ。
						}
					];
				}(),

				//B) 軸設定情報					AnaAxisFolder
				vAxisList: [
					{
						attr: 3,
						cond_attr: 3,
						cond_grp: '日付',
						cond_kind: 603,
						f_anakind: 13,
						f_axis: 1,
						f_basket: 0,
						f_cond: 1,
						func_id: 0,
						kind: 603,
						name: '日',
						name2: '日付',
					},
				],
				hAxisList: [],
				vfzerosuppress: 1,			// 縦軸
				hfzerosuppress: 1,			// 横軸
				disp_ly: amgbp_AnaHead.AMGBP_ANA_REQ_DISP_LY_SAMEWEEK,		// 昨年：昨年同日、昨年同曜
				fromtoList: {},				// 閾値条件

				//C) 表示項目					AnaDispItemFolder
				dispitemlist: [
					{
						dispitem_id: amgbp_AnaDispItemDefs.AMGBA_DI_G_CUSTOMER | amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL | amgbp_AnaDispItemDefs.AMGBA_DI_I_CUSTOMER_QY,
						name: '客数実績',
					},
					{
						dispitem_id: amgbp_AnaDispItemDefs.AMGBA_DI_G_SALE | amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL | amgbp_AnaDispItemDefs.AMGBA_DI_I_QY,
						name: '売上数実績',
					},
					{
						dispitem_id: amgbp_AnaDispItemDefs.AMGBA_DI_G_SALE | amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL | amgbp_AnaDispItemDefs.AMGBA_DI_I_AM,
						name: '売上高実績',
					},
					{
						dispitem_id: amgbp_AnaDispItemDefs.AMGBA_DI_G_PROF | amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL | amgbp_AnaDispItemDefs.AMGBA_DI_I_AM,
						name: '経準高実績',
					},
				],		// 表示項目
				dispcolorlist: [],		// 色分け条件
				disprangelist: [],		// 値範囲の制約
				dispvsortkeylist: [],	// ソート条件

				//D) 表示項目オプション			Map<optType, EACIdCodeName> --- もっと素直に？
				dispopt: {
					disp_way: 1,	// 表示項目並び：縦並び(1)/横並び(2)
					f_total: 1,		// 合計表示：あり(1)/なし(2)
					f_subtotal: 1,	// 小計表示：あり(1)/なし(2)
					existsum: function(){
						return (Ana.Config.cond.CACMV0210.existsum == 'unused') ? undefined : 2;
					}(),			// 既存店集計：する(1)/しない(2)
					disp_amunit: 1,	// 表示単位：円単位/千単位/万単位
					sizesum: 1,		// サイズ名集約：あり(1)/なし(2)
				},

				//E) 絞込み条件					List<LocalAnaFocusDto>
				focuslist: [
					{kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_HOLIDAY, val : 1},	// 祝日：含む
					{kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_STORE_SORT, val : amcm_type.AMCM_VAL_ANA_STORE_SORT_CODE},		// 店舗並び順: コード
					{kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_NEWSTORE_LOGIC, val : amcm_type.AMCM_VAL_ANA_NEWSTORE_LOGIC_BAISOKU},	// 新店ロジック：売速
					{kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_NEWSTORE_COND, val : amcm_type.AMCM_VAL_ANA_NEWSTORE_COND_NOP},		// 新店既存店: 絞込なし
					{kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_STOREATTR_SMX, val : amcm_type.AMCM_VAL_ANA_STOREATTR_SMX_NOP},		// SMX店舗：SMX店舗絞込なし
					{kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_STOREATTR_CLOSED, val : amcm_type.AMCM_VAL_ANA_STOREATTR_CLOSED_EXCLUDE},		// 閉店店舗：閉店店舗を含めない
					{kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SMXKT, val : amcm_type.AMCM_VAL_ANA_ITEMATTR_SMXKT_NOP},		// SMX・KT商品：SMX・KT商品絞込なし
					// {kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ALLSTORE, val : amcm_type.AMCM_VAL_ALLWRITEDOWN_NONE}		// 評価減対象：設定なし
				],					// 対象
				focuslist2: [],		// 比較

				//F) マスタ検索日
				mstsrchdate: function(){
					var opedt = clcom.getOpeDate();
					if(!_.isNumber(opedt) || opedt <= 1990){
						opedt = Ana.Util.date2YYYYMMDD(new Date());	// clcom.ope_date がヘンなので現在に補正
						console.warn('bad ope_date[' + clcom.ope_date + '] -> fixed[' + opedt + ']');
					}
					return {
						f_srchiymd_type: amgbp_AnaHead.AMGBP_ANA_REQ_F_SRCHIYMD_TYPE_COM,	// 検索日タイプ
						srchiymd: opedt,		// マスタ検索日
						org_srchiymd: opedt,	// 組織マスタ検索日
						itgrp_srchiymd: opedt,	// 商品分類マスタ検索日
						memb_srchiymd: opedt	// 会員マスタ検索日
					};
				}(),

				//G) 比較タイプ					EACIdCodeName -- せいぜい、期間対比しかない。
				//H) 分析アプリ構成情報			AnaAplFolder --- gsan_ap_anaproc_init の戻り値を参照するだけ。
				//I) 分析カタログ分析条件パート	AnaCatalogCondPartFolder --- TODO: カタログ登録時の条件セット -- 関数にしておくか。

				//J) 購買条件
				anabuyingcond: null,

				//K) 既存店基準日、閉店基準日
				exist_iymd: 0,
				close_iymd: 0,

				//Z) その他の付加情報
				extra: {
					membcond: amgbp_AnaHead.AMGBP_ANA_REQ_MEMBCOND_ALL,	// 顧客条件
					mdabc_type: 0,										// MD商品分析 - ABC分析基準
				}
			}
		};
		var fixedopt = _.isNullOrUndefined(options) ? defaults : _.defaults(options,defaults);
		if(_.isNullOrUndefined(options)){
			fixedopt = defaults;
		}else{
			var fixedcnd;
			if(options.cond){
				fixedcnd = _.defaults(options.cond, defaults.cond);
			}
			fixedopt = _.defaults(options, defaults);
			if(fixedcnd){
				fixedopt.cond = fixedcnd;
			}
		}
		_.extend(this, fixedopt);

		// 初期条件
		this.iniCond = Ana.Util.dclone(this.cond);

		// カタログデータ補正
		if(this.catalog_id){
			this.catalog_id = Ana.Util.valueToNumber(this.catalog_id);
		}
		// カタログ名設定
		if(!_.isEmpty(this.catalog_name)){
			clcom.pageTitle = this.catalog_name;
		}
		// カタログ条件の取得・設定は iniGet で行う。
	};
	_.extend(Ana.Proc.prototype, Backbone.Events, {
		/**
		 * shimizu 追加
		 * マスタ検索日をタイプに合わせて返却する
		 * 店舗検索日:org
		 * 商品検索日:itgrp
		 * 会員検索日:memb
		 */
		getMstSrchDate: function(s_type) {
			var mstsrchdate = this.cond.mstsrchdate;

			if (mstsrchdate.f_srchiymd_type == amgbp_AnaHead.AMGBP_ANA_REQ_F_SRCHIYMD_TYPE_COM) {
				// 共通指定
				return mstsrchdate.srchiymd;
			} else {
				return mstsrchdate[s_type + '_srchiymd'] == null ? mstsrchdate.srchiymd : mstsrchdate[s_type + '_srchiymd'];
			}
		},

		/**
		 * shimizu 追加
		 * マスタ検索日をタイプに合わせて返却する
		 * 店舗検索日:org
		 * 商品検索日:itgrp
		 * 会員検索日:memb
		 */
		getMstSrchDate: function(s_type) {
			var mstsrchdate = this.cond.mstsrchdate;

			if (mstsrchdate.f_srchiymd_type == amgbp_AnaHead.AMGBP_ANA_REQ_F_SRCHIYMD_TYPE_COM) {
				// 共通指定
				return mstsrchdate.srchiymd;
			} else {
				return mstsrchdate[s_type + '_srchiymd'] == null ? mstsrchdate.srchiymd : mstsrchdate[s_type + '_srchiymd'];
			}
		},

		/**
		 * 上がってきた通知メッセージをリスナに発信する。
		 */
		onNotify: function(msg){
			this.trigger('onBroadcast', msg);
		},

		/**
		 * 初期化: 初期化データを取得する。-- 共通のログイン情報もここで取得してくる。
		 */
		iniGet: function() {
			// --------------------------------------------------------
			// (1) 区分値を取得 - uri = 'gscm_type_get'
			var defer01 = clutil.getAnaIniJSON();

			// --------------------------------------------------------
			// (2) 当該分析情報を取得 - uri = 'gsan_ap_anaproc_init'
			var func02 = _.bind(function(prevdata){
				// prevdata は defer02 の応答パケット。特にいらん？？？
				var uri = this.getIniURI;	// 'gsan_ap_anaproc_init';
				var req = {
					cond: { f_anakind: this.f_anakind }
				};
				console.log('(2) 当該分析情報を取得 - before "' + uri + '" call...');
				return clutil.postAnaJSON(uri, req).then(_.bind(function(data){
					console.log('^^^^^^^gsan_ap_anaproc_init: returned.', arguments);

					// anaProc にも応答値をインポート
					this.gsan_ap_anaproc = data;
					this.condItemHash = clutil.makeCondHash(data.ana_cond_item_list);
					this.anadata = {
						axis_num		: data.ana_axis_num,
						cond_item_list	: data.ana_cond_item_list,
						f_cond_item_list: clutil.getfconditemlist(data.ana_cond_item_list),
						disp_item_list	: data.ana_disp_item_list,
						f_memblist		: data.f_memblist
					};
					// ドリルダウンできる最大Lvを予め算出しておく。
					this.drilldownMaxlvMap = _.reduce(data.ana_cond_item_list, function(map, elem){
						if(elem.f_axis && Ana.Const.HierarchicalAxisKindMap[elem.cond_kind]){
							// YMDの"週"は除外しておく #20150104 OTK
							if( elem.cond_kind == amgbp_AnaDefs.AMGBA_DEFS_KIND_YMD &&
								elem.cond_attr == 9 ){
								;
							} else {
								var kindFuncIdKey = 'k' + elem.cond_kind + '_f' + elem.func_id;
								var elv = elem.cond_attr;
								var xLv = map[kindFuncIdKey];
								if(!_.isNumber(xLv)/*未登録*/ || xLv < elv /*Lv値比較*/){
									map[kindFuncIdKey] = elv;
									//console.log('key[' + kindFuncIdKey + ']: maxlv[' + elv + ']');
								}
							}
						}
						return map;
					}, new Object());
					// バスケット用マップ
					this.basketItemMap = _.reduce(data.ana_cond_item_list, function(map, elem){
						if (elem.f_basket) {
							var kindFuncIdKey = 'k' + elem.cond_kind + '_f' + elem.func_id;
							map[kindFuncIdKey] = elem;
						}
						return map;
					}, new Object());
					// 表示項目マップ（１）：キーは ANA_DI_I_MASK でとる。
					this.dispItemIdMap = _.reduce(data.ana_disp_item_list, function(map, elem){
						var dispItemId = elem.dispitem_id & amgbp_AnaDispItemDefs.AMGBA_DI_I_MASK;
						if(dispItemId === 0){
							// フォルダ。グループ名を定義するエントリ。
						}else{
							if(!_.isUndefined(map[dispItemId])){
								console.warn('dispItemIdMap: dispItemId[0x' + dispItemId.toString(16) + '] dup.');
							}
							map[dispItemId] = elem;
						}
						return map;
					}, new Object());
					// 表示項目マップ（２）：キーは ANA_DI_I/G_MASK でとる。
					this.dispItemIGMap = _.reduce(data.ana_disp_item_list, function(map, elem){
						var key = Ana.Util.dispItemIGKey(elem.dispitem_id);
						if(elem.dispitem_id === 0){
							// グループフォルダ。グループ名を定義するエントリ。
							key = Ana.Util.dispItemIGKey(elem.dispgroup);
						}else{
							// 表示項目を定義するエントリ
							key = Ana.Util.dispItemIGKey(elem.dispitem_id);
						}
						if(!_.isUndefined(map[key])){
							console.warn('dispItemIGMap: key[' + key + '] dup.', elem);
						}
						map[key] = elem;
						return map;
					}, new Object());
				}, this));
			},this);
			var defer02 = defer01.then(func02);

			// --------------------------------------------------------
			// (3) カタログ条件を取得 - uri = 'gsan_ct_catalog_get'
			var defer03;
			if(!_.isNumber(this.catalog_id) || this.catalog_id == 0){
				defer03 = defer02;
			}else{
				defer03 = defer02.then(_.bind(function(prevdata){
					// カタログ情報を取得
					var uri = 'gsan_ct_catalog_get';
					var req = {
						cond: {
							catalog_id: this.catalog_id
						}
					};
					return clutil.postAnaJSON(uri, req).then(_.bind(function(data){
						// カタログ情報をセット
						if(data.catalog){
							this.savedCatalogRsp = data.catalog;
						}
					}, this)).fail(_.bind(function(data){
						// カタログ呼び出し失敗: エラーページを表示してメニュー画面に戻る
						var abortMessageView = new Ana.AbortMessageView({
							messages: [
								'カタログ［' + this.catalog_name + '］の適用に失敗しました。',
								clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)]
						});
						$('body').html(abortMessageView.render().el).show();
						abortMessageView.startTimer();
					}, this));
					return defer03;
				}, this));
			}

			return defer03;
		},

		/**
		 * 指定 kind, funcId における分析軸の最大Lvを取得する。
		 * 見つからない場合は 0 を返す。
		 * iniGet 内 'gsan_ap_anaproc_init' の応答データ取得後に有効。
		 */
		getDrilldownMaxlv: function(kind, funcId){
			if(!this.drilldownMaxlvMap){
				return 0;
			}
			var kindFuncIdKey = 'k' + kind + '_f' + funcId;
			var x = this.drilldownMaxlvMap[kindFuncIdKey];
			return _.isNumber(x) ? x : 0;
		},

		/**
		 * 指定 dispItemId, sbit(表示項目属性ビット）から、
		 * 表示項目要素を生成する。
		 */
		buildDispItem: function(gbit, dispItemId, sbit){
			if(!this.dispItemIdMap || !this.dispItemIGMap){
				console.warn('buildDispItem: dispItemIdMap or dispItemIGMap is not ready.');
				return null;
			}
			var elem = null;
			if(gbit){
				var key = Ana.Util.dispItemIGKey(gbit | dispItemId);
				elem = this.dispItemIGMap[key];
			}else{
				elem = this.dispItemIdMap[dispItemId];
			}
			if(!elem){
				console.warn('buildDispItem: itemID[0x' + dispItemId.toString(16) + '] not found. gbit is ' + gbit);
				return null;
			}

			var label2 = null;
			switch(sbit){
			case amgbp_AnaDispItemDefs.AMGBA_DI_S_PLANRT:
				label2 = "計画比";
				break;
			case amgbp_AnaDispItemDefs.AMGBA_DI_S_PLANDF:
				label2 = "計画差";
				break;
			//case amgbp_AnaDispItemDefs.AMGBA_DI_S_LYRT:	label2 = "前年比";		break;
			case amgbp_AnaDispItemDefs.AMGBA_DI_S_LYRT:
				label2 = "前年比";
				break;
			case amgbp_AnaDispItemDefs.AMGBA_DI_S_LYDF:
				label2 = "前年差";
				break;
			//case amgbp_AnaDispItemDefs.AMGBA_DI_S_LYVAL:	label2 = "前年実績";	break;
			case amgbp_AnaDispItemDefs.AMGBA_DI_S_LYVAL:
				label2 = "前年";
				break;
			//case amgbp_AnaDispItemDefs.AMGBA_DI_S_VSUMRT:label2 = "縦軸構成比";	break;
			case amgbp_AnaDispItemDefs.AMGBA_DI_S_VSUMRT:
				label2 = "構成比";
				break;
			case amgbp_AnaDispItemDefs.AMGBA_DI_S_HSUMRT:
				label2 = "横軸構成比";
				break;
			case amgbp_AnaDispItemDefs.AMGBA_DI_S_SUMRT:
				label2 = "全体構成比";
				break;
			//case amgbp_AnaDispItemDefs.AMGBA_DI_S_VACMRT:label2 = "縦軸累計比";	break;
			case amgbp_AnaDispItemDefs.AMGBA_DI_S_VACMRT:
				label2 = "累計構成比";
				break;
			case amgbp_AnaDispItemDefs.AMGBA_DI_S_HACMRT:
				label2 = "横軸累計比";
				break;
			case amgbp_AnaDispItemDefs.AMGBA_DI_S_YVAL:
				label2 = "年累計";
				break;
			//case amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL:	label2 = "実績";		break;
			case amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL:
				label2 = "実績";
				break;
			default:
				console.error('unknown sbit[' + sbit + '], ignore!');
				return null;
			}

			return {
				dispitem_id: (elem.dispitem_id & ~amgbp_AnaDispItemDefs.AMGBA_DI_S_MASK) | sbit,
				name: elem.name + label2
			};
		},

		/**
		 * 指定 dispItemId, sbit(表示項目属性ビット）から、
		 * 表示項目要素のリストを生成する。
		 */
		buildDispItems: function(dispItems){
			if(!this.dispItemIdMap){
				console.warn('buildDispItem: dispItemIdMap is not ready.');
				return null;
			}
			var items = _.reduce(dispItems, function(array, x){
				var dispItem = this.buildDispItem(x.gbit, x.dispItemId, x.sbit);
				if(dispItem){
					array.push(dispItem);
				}
				return array;
			}, [], this);
			return items;
		},

		/**
		 * 指定 dispItemId, sbit(表示横目属性ビット), ソートオーダーから、
		 * 表示項目のソート条件リストを生成する。
		 * @param {array} dispItems
		 * @param {number} dispItems[N].dispItemId
		 * @param {number} dispItems[N].sbit
		 * @param {number} dispItems[N].order
		 * @param {number} dispItems[N].idx
		 */
		buildSortkeyList: function(dispItems){
			if(!this.dispItemIdMap){
				console.warn('buildDispItem: dispItemIdMap is not ready.');
				return null;
			}
			var items = _.reduce(dispItems, function(array, x){
				var elem = this.dispItemIdMap[x.dispItemId];
				if(elem){
					var sortDto = {
						dispitem_id: (elem.dispitem_id & ~amgbp_AnaDispItemDefs.AMGBA_DI_S_MASK) | x.sbit,
						order: (x.order < 0) ? amgbp_AnaSortKey.AMGBP_ANA_SORTKEY_ORDER_DESCENDING : amgbp_AnaSortKey.AMGBP_ANA_SORTKEY_ORDER_ASCENDING,
						idx: (x.idx > 0) ? x.idx : 0
					};
					array.push(sortDto);
				}
				return array;
			}, [], this);
			return items;
		},

		/**
		 * 条件セットを初期化 -- カタログ条件をセットしたり、前分析引継条件をセットしたり、履歴条件をセットする。
		 * iniGet の後にやる。
		 */
		initCondition: function(){
			// カタログ条件を適用（あれば）
			if(this.savedCatalogRsp){
				console.info('カタログ条件を適用: ', this.savedCatalogRsp);
				this.setCatalog(this.savedCatalogRsp, { setDefaultCond: false });
				delete this.savedCatalogRsp;
			}

			// 前分析の引き継ぎ条件を適用（あれば）
			if(this.prevAnaCond){
				console.info('前分析引継条件を適用：', this.prevAnaCond);
				this.setPrevAnaCond(this.prevAnaCond, { setDefaultCond: false });
				delete this.prevAnaCond;
			}

			// 区分系絞り込み条件のラベル名補完
			Ana.Util.fixTypeValsAnaFocus(this.cond.focuslist);
			Ana.Util.fixTypeValsAnaFocus(this.cond.focuslist2);

			// リセット時の条件をココで固める。
			this.setCurrentCondToDefault();

			// 履歴条件があれば適用（あれば）
			if(this.lru_cond){
				Ana.Util.fixTypeValsAnaFocus(this.lru_cond.focuslist);
				Ana.Util.fixTypeValsAnaFocus(this.lru_cond.focuslist2);
				console.info('履歴条件を適用: ', this.lru_cond);
				this.cond = this.lru_cond;
				delete this.lru_cond;
				delete this.lru_tm;
			}
		},

		/**
		 * 前分析の引き継ぎ条件を anaProc の cond へセットする
		 */
		setPrevAnaCond: function(prevCond, opt){
			// 4-1) 分析期間を引き継ぐ
			if(prevCond.anaPeriods){
				this.cond.anaPeriods = prevCond.anaPeriods;
			}

			var rmopt = { kind: -1 };

			// 4-2) 絞込条件を引き継ぐ。
			if(_.isArray(prevCond.focusList1)){
				// 重複キーを潰す
				for(var i = 0; i < prevCond.focusList1.length; i++){
					rmopt.kind = prevCond.focusList1[i].kind;
					this.removeFocus1(rmopt);
				}

				// 条件をアペンドする
				this.pushFocus1(prevCond.focusList1);
			}
			if(_.isArray(prevCond.focusList2)){
				// 重複キーを潰す
				for(var i = 0; i < prevCond.focusList2.length; i++){
					rmopt.kind = prevCond.focusList2[i].kind;
					this.removeFocus2(rmopt);
				}

				// 条件をアペンドする
				this.pushFocus1(prevCond.focusList2);
			}

			// 4-3) 会員リストをたす。
			if(prevCond.memblistFocusDto){
				// 重複キーを潰す
				rmopt.kind = prevCond.memblistFocusDto.kind;
				this.removeFocus1(rmopt);

				// 条件をアペンド
				this.pushFocus1(prevCond.memblistFocusDto);

				// オプション
				this.cond.extra.membcond = amgbp_AnaHead.AMGBP_ANA_REQ_MEMBCOND_MEMB;
			}

			// 4-4) マスタ検索日を引き継ぐ
			if(prevCond.mstsrchdate){
				this.cond.mstsrchdate = prevCond.mstsrchdate;
			}

			// 4-5) 特殊条件：顧客購買抽出
			if(clcom.pageId == 'CAANV0050' && prevCond.anabuyingcond){
				this.cond.anabuyingcond = prevCond.anabuyingcond;
			}

			if(opt.setDefaultCond){
				// 初期条件セットやりなおし
				this.setCurrentCondToDefault();
			}
		},

		/**
		 * カタログデータを anaProc の cond へセットする
		 */
		setCatalog: function(catalogRsp, opt) {
			this.catalog = catalogRsp;
			this.guide = catalogRsp.guide;

			// カタログ条件を解凍
			var condstr = catalogRsp.condstr;
			if(_.isString(condstr) && !_.isEmpty(condstr)){
				try{
					var cond = JSON.parse(catalogRsp.condstr);
					if(!Ana.Config.catalog.applyMstSrchDate){
						// カタログからマスタ検索日を外しておく
						delete cond.mstsrchdate;
					}
					// MDB
					if (catalogRsp.mdb_store_set) {
						var userInfo = clcom.userInfo;
						if (userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {
							cond.focuslist.push({
								kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_STORE,
								val: userInfo.org_id,
								code: userInfo.org_code,
								name: userInfo.org_name,
							});
						}
					}
					_.extend(this.cond, cond);
				}catch(e){
					// XXX: エラー表示すべきか？
					console.error(e);
				}
			}

			// 期間（対象）をカタログ定義にセットする。////////////////////
			var isDirect = (catalogRsp.f_period_type) ? false : true;	// 0:直接指定、1:相対指定
			var baseymd = clcom.getOpeDate(), basefix = 0;	// basefix: 基準日付補正項
			var fixedUnit;
			switch(catalogRsp.f_period_unit){
			case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YM:	// [ 2] 年月：YYYYMM
			case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YMD:	// [ 3] 年月日: YYYYMMDD
			case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YW:	// [ 9] 年周: YYYYWW
			case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y2:	// [10] 半期: YYYYNN
			case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y4:	// [11] 四半期 YYYYNN
				fixedUnit = catalogRsp.f_period_unit;
				break;
			default:
				// 期間タイプが不明
				console.warn('カタログ[' + catalogRsp.name
						+ ']: 期間タイプ値[' + catalogRsp.f_period_unit
						+ ']が不明です。カタログの期間条件は適用されませんでした。');
				return;
			}

			// 期間指定を整理する。
			// returns {
			//	isBad: true or false,
			//	unit:  amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_***,
			//	date:  findDt,
			//	val:   fixedVal,
			//	period: period,
			//	label: label
			// }
			var ff = {
				yyyyMMddLabel: function(yyyymmdd){
					var y = Math.floor(yyyymmdd / 10000);
					var m = Math.floor(yyyymmdd / 100) % 100;
					var d = yyyymmdd % 100;
					return y + '年' + ("0" + m).slice(-2) + '月' + ("0" + d).slice(-2) + '日';
				},
				direct_typeYM: function(val){
					var unit = amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YM;
					var findDt = null;		// Date オブジェクト
					var fixedVal = val;
					if(val === 0){
						// カタログ登録時、空欄を指定されたので、ope_date を適用する。
						var ymd = clcom.getOpeDate();
						findDt = Ana.Util.yyyyMMdd2Date(ymd);
					}else{
						var ymd = (val * 100) + 1;		// yyyymm01
						findDt = Ana.Util.yyyyMMdd2Date(ymd);
					}
					fixedVal = Ana.Util.date2YYYYMM(findDt);
					return {
						isBad: false,
						unit: unit,
						date: findDt,
						val: fixedVal,
						period: null,
						label: findDt.getFullYear() + '年' +(findDt.getMonth()+1) + '月'
					};
				},
				relative_typeYM: function(baseymd, fixerval){
					var unit = amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YM;
					var baseDt = Ana.Util.yyyyMMdd2Date(baseymd);
					var findDt = baseDt;
					if(fixerval !== 0){
						findDt = Ana.Util.addMonth(findDt, fixerval);
					}
					var fixedVal = Ana.Util.date2YYYYMM(findDt);
					return {
						isBad: false,
						unit: unit,
						date: findDt,
						val: fixedVal,
						period: null,
						label: findDt.getFullYear() + '年' + (findDt.getMonth()+1) + '月'
					};
				},
				direct_typeYMD: function(val){
					var unit = amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YMD;
					var findDt = null;		// Date オブジェクト
					var fixedVal = val;
					if(val === 0){
						// カタログ登録時、空欄を指定されたので、ope_date を適用する。
						var ymd = clcom.getOpeDate();
						findDt = Ana.Util.yyyyMMdd2Date(ymd);
					}else{
						findDt = Ana.Util.yyyyMMdd2Date(val);
					}
					fixedVal = Ana.Util.date2YYYYMMDD(findDt);
					return {
						isBad: false,
						unit: unit,
						date: findDt,
						val: fixedVal,
						label: this.yyyyMMddLabel(fixedVal)
					};
				},
				relative_typeYMD: function(baseymd, fixerval){
					var unit = amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YMD;
					var findDt = Ana.Util.yyyyMMdd2Date(baseymd);
					if(fixerval !== 0){
						findDt = Ana.Util.addDay(findDt, fixerval);
					}
					var fixedVal = Ana.Util.date2YYYYMMDD(findDt);
					var label = this.yyyyMMddLabel(fixedVal);
					return {
						isBad: false,
						unit: unit,
						date: findDt,
						val: fixedVal,
						label: label
					};
				},
				direct_typeYW: function(val, side){
					var unit = amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YW;
					var findDt = null;		// Date オブジェクト
					var period = null;		// 期間定義
					var label = null;
					if(val === 0){
						// カタログ登録時、空欄を指定されたので、ope_date を適用する。
						var ymd = clcom.getOpeDate();
						findDt = Ana.Util.yyyyMMdd2Date(ymd);
						period = Ana.Util.findPeriod(unit, ymd);
					}else{
						period = Ana.Util.WeekOfYearMap[val];
						if(period){
							var ymd = period.st_iymd;
							findDt = Ana.Util.yyyyMMdd2Date(ymd);
						}
					}
					if(period){
						var ymd, head = '', tail = '';
						if(side == 'from'){
							ymd = period.st_iymd;
							tail = '～';
						}else{
							ymd = period.ed_iymd;
							head = '～';
						}
						label = period.year + '年' + period.period + '週'
							+ '(' + head + this.yyyyMMddLabel(ymd) + tail + ')';
					}
					return (_.isNull(period)) ? {
						isBad: true
					} : {
						isBad: false,
						unit: unit,
						date: findDt,
						val: period.year * 100 + period.period,
						label: label
					};
				},
				relative_typeYW: function(baseymd, fixerval, side){
					var unit = amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YW;

					var findDt = Ana.Util.yyyyMMdd2Date(baseymd);
					if(fixerval !== 0){
						findDt = Ana.Util.addDay(findDt, (fixerval * 7));
					}

					var ymd = Ana.Util.date2YYYYMMDD(findDt);
					var period = Ana.Util.findPeriod(unit, ymd);		// 期間定義

					var label = null;
					if(period){
						var ymd, head = '', tail = '';
						if(side == 'from'){
							ymd = period.st_iymd;
							tail = '～';
						}else{
							ymd = period.ed_iymd;
							head = '～';
						}
						label = period.year + '年' + period.period + '週'
							+ '(' + head + this.yyyyMMddLabel(ymd) + tail + ')';
					}
					return (_.isNull(period)) ? {
						isBad: true
					} : {
						isBad: false,
						unit: unit,
						date: findDt,
						val: period.year * 100 + period.period,
						label: label
					};
				},
				direct_typeY2: function(val, side){
					var unit = amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y2;
					var findDt = null;		// Date オブジェクト
					var period = null;		// 期間定義
					var label = null;
					if(val === 0){
						// カタログ登録時、空欄を指定されたので、ope_date を適用する。
						var ymd = clcom.getOpeDate();
						findDt = Ana.Util.yyyyMMdd2Date(ymd);
						period = Ana.Util.findPeriod(unit, ymd);
					}else{
						period = Ana.Util.HalfOfYearMap[val];
						if(period){
							var ymd = period.st_iymd;
							findDt = Ana.Util.yyyyMMdd2Date(ymd);
						}
					}
					if(period){
						var ymd, head = '', tail = '';
						if(side == 'from'){
							ymd = period.st_iymd;
							tail = '～';
						}else{
							ymd = period.ed_iymd;
							head = '～';
						}
						var termstr = (period.period <= 1) ? '上期' : '下期';
						// from: 2014年第1期(2014年04月01日～)
						//   to: 2014年第4期(～2015年03月31日)
						label = period.year + '年' + termstr
							+ '(' + head + this.yyyyMMddLabel(ymd) + tail + ')';
					}
					return (_.isNull(period)) ? {
						isBad: true
					} : {
						isBad: false,
						unit: unit,
						date: findDt,
						val: period.year * 100 + period.period,
						label: label
					};
				},
				relative_typeY2: function(baseymd, fixerval, side){
					var unit = amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y2;

					var findDt = Ana.Util.yyyyMMdd2Date(baseymd);
					if(fixerval !== 0){
						findDt = Ana.Util.addMonth(findDt, (fixerval * 6));
					}

					var ymd = Ana.Util.date2YYYYMMDD(findDt);
					var period = Ana.Util.findPeriod(unit, ymd);		// 期間定義

					var label = null;
					if(period){
						var ymd, head = '', tail = '';
						if(side == 'from'){
							ymd = period.st_iymd;
							tail = '～';
						}else{
							ymd = period.ed_iymd;
							head = '～';
						}
						var termstr = (period.period <= 1) ? '上期' : '下期';
						// from: 2014年上期(2014年04月01日～)
						//   to: 2014年下期(～2015年03月31日)
						label = period.year + '年' + termstr
							+ '(' + head + this.yyyyMMddLabel(ymd) + tail + ')';
					}
					return (_.isNull(period)) ? {
						isBad: true
					} : {
						isBad: false,
						unit: unit,
						date: findDt,
						val: period.year * 100 + period.period,
						label: label
					};
				},
				direct_typeY4: function(val, side){
					var unit = amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y4;
					var findDt = null;		// Date オブジェクト
					var period = null;		// 期間定義
					var label = null;
					if(val === 0){
						// カタログ登録時、空欄を指定されたので、ope_date を適用する。
						var ymd = clcom.getOpeDate();
						findDt = Ana.Util.yyyyMMdd2Date(ymd);
						period = Ana.Util.findPeriod(unit, ymd);
					}else{
						period = Ana.Util.QuarterOfYearMap[val];
						if(period){
							var ymd = period.st_iymd;
							findDt = Ana.Util.yyyyMMdd2Date(ymd);
						}
					}
					if(period){
						var ymd, head = '', tail = '';
						if(side == 'from'){
							ymd = period.st_iymd;
							tail = '～';
						}else{
							ymd = period.ed_iymd;
							head = '～';
						}
						// from: 2014年第1期(2014年04月01日～)
						//   to: 2014年第4期(～2015年03月31日)
						label = period.year + '年第' + period.period + '期'
							+ '(' + head + this.yyyyMMddLabel(ymd) + tail + ')';
					}
					return (_.isNull(period)) ? {
						isBad: true
					} : {
						isBad: false,
						unit: unit,
						date: findDt,
						val: period.year * 100 + period.period,
						label: label
					};
				},
				relative_typeY4: function(baseymd, fixerval, side){
					var unit = amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y4;

					var findDt = Ana.Util.yyyyMMdd2Date(baseymd);
					if(fixerval !== 0){
						findDt = Ana.Util.addMonth(findDt, (fixerval * 6));
					}

					var ymd = Ana.Util.date2YYYYMMDD(findDt);
					var period = Ana.Util.findPeriod(unit, ymd);		// 期間定義

					var label = null;
					if(period){
						var ymd, head = '', tail = '';
						if(side == 'from'){
							ymd = period.st_iymd;
							tail = '～';
						}else{
							ymd = period.ed_iymd;
							head = '～';
						}
						// from: 2014年第1期(2014年04月01日～)
						//   to: 2014年第4期(～2015年03月31日)
						label = period.year + '年第' + period.period + '期'
							+ '(' + head + this.yyyyMMddLabel(ymd) + tail + ')';
					}
					return (_.isNull(period)) ? {
						isBad: true
					} : {
						isBad: false,
						unit: unit,
						date: findDt,
						val: period.year * 100 + period.period,
						label: label
					};
				}
			};

			var from, to;
			if(isDirect){
				// catalogRsp.period_val1, _val2 は直接日付指定
				switch(fixedUnit){
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YM:	// [ 2] 年月：YYYYMM
					from = ff.direct_typeYM(catalogRsp.period_val1, 'from');
					to = ff.direct_typeYM(catalogRsp.period_val2, 'to');
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YMD:	// [ 3] 年月日: YYYYMMDD
					from = ff.direct_typeYMD(catalogRsp.period_val1, 'from');
					to = ff.direct_typeYMD(catalogRsp.period_val2, 'to');
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YW:	// [ 9] 年周: YYYYWW
					from = ff.direct_typeYW(catalogRsp.period_val1, 'from');
					to = ff.direct_typeYW(catalogRsp.period_val2, 'to');
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y2:	// [10] 半期: YYYYNN
					from = ff.direct_typeY2(catalogRsp.period_val1, 'from');
					to = ff.direct_typeY2(catalogRsp.period_val2, 'to');
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y4:	// [11] 四半期 YYYYNN
					from = ff.direct_typeY4(catalogRsp.period_val1, 'from');
					to = ff.direct_typeY4(catalogRsp.period_val2, 'to');
					break;
				}
			}else{
				// catalogRsp.period_val1, _val2 は相対日付指定
				switch(fixedUnit){
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YM:	// [ 2] 年月：YYYYMM
					from = ff.relative_typeYM(baseymd, (basefix - catalogRsp.period_val1), 'from');
					to = ff.relative_typeYM(baseymd, (basefix - catalogRsp.period_val2), 'to');
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YMD:	// [ 3] 年月日: YYYYMMDD
					from = ff.relative_typeYMD(baseymd, (basefix -catalogRsp.period_val1), 'from');
					to = ff.relative_typeYMD(baseymd, (basefix - catalogRsp.period_val2), 'to');
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_YW:	// [ 9] 年周: YYYYWW
					from = ff.relative_typeYW(baseymd, (basefix - catalogRsp.period_val1), 'from');
					to = ff.relative_typeYW(baseymd, (basefix - catalogRsp.period_val2), 'to');
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y2:	// [10] 半期: YYYYNN
					from = ff.relative_typeY2(baseymd, (basefix -catalogRsp.period_val1), 'from');
					to = ff.relative_typeY2(baseymd, (basefix -catalogRsp.period_val2), 'to');
					break;
				case amgbp_AnaPeriod.AMGBP_ANA_PERIOD_TYPE_Y4:	// [11] 四半期 YYYYNN
					from = ff.relative_typeY4(baseymd, (basefix - catalogRsp.period_val1), 'from');
					to = ff.relative_typeY4(baseymd, (basefix - catalogRsp.period_val2), 'to');
					break;
				}
			}

			if(from.isBad){
				console.warn('カタログの期間条件は適用されませんでした：開始期間定義が見つかりません。');
				return;
			}
			if(to.isBad){
				console.warn('カタログの期間条件は適用されませんでした：終了期間定義が見つかりません。');
				return;
			}
			if(from.val > to.val){
				console.warn('カタログの期間定義のform-to期間が逆転しています。補正して適用します。');
				var __x = from;
				from = to;
				to = __x;
			}

			// 対象期にカタログ期間定義を適用する
			var anap0 = this.cond.anaPeriods[0];
			anap0.q_type = 0;		// 指定なし
			anap0.type = fixedUnit;
			anap0.p_from = from.val;
			anap0.p_to = to.val;
			anap0.name = from.label + '～' + to.label;

			if(opt.setDefaultCond){
				// カタログの条件を初期条件としてセットする
				this.setCurrentCondToDefault();
			}
		},

		/**
		 * 現在設定している条件をデフォルト条件として設定する。
		 * ここで設定したデフォルト条件は、リセット動作時に適用する条件になる。
		 */
		setCurrentCondToDefault: function(){
			// カタログの条件を初期条件としてセットする
			this.iniCond = Ana.Util.dclone(this.cond);
		},

		/**
		 * 分析実行結果データの有無を返す。
		 * true:結果データあり、false:結果データなし。
		 */
		hasResultData: function(){
			return !_.isNullOrUndefined(this.savedResult);
		},

		/**
		 * 分析実行する。
		 */
		// 分析実行：CAPAV0090.js の navItemView のクリックイベントから呼び出される。
		doSearch: function(){
			var req = this.buildAnaReq();
			var uri = this.searchURI;	//'gsan_ap_anaproc_matrix';	// 分析実行URI - 顧客マトリックス
			var _mAnaProc = this;
			var deferd = clutil.postAnaJSON(uri, req).then(function(data){
				if (_mAnaProc.cond._tmpdispitemlist) {
					_mAnaProc.cond.dispitemlist = _mAnaProc.cond._tmpdispitemlist;
				}
				if(_.isObject(data.head) && _.isNumber(data.head.status)
						&& data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK){

					// この回の検索条件を保存しておく。
					var savedCond = Ana.Util.dclone(_mAnaProc.cond);
					savedCond.dispopt.disp_way = req.anaHead.disp_way;	// 1軸表示項目並びは補正を受けるので
					// 最近実行した条件履歴保存
					_mAnaProc.saveHistory(savedCond);
					// savedCond.axKidnVAxisMap: ドリルダウンの作業用データ（履歴データに残さない）
					savedCond.axKindVAxisMap = _.reduce(savedCond.vAxisList, function(map, elem){
						var x = map[elem.kind];
						if(!x){
							map[elem.kind] = elem;
						}
						return map;
					}, {});
					_mAnaProc.savedCond = savedCond;
					_mAnaProc.savedReq  = req;
					_mAnaProc.savedResult = data;

					// 画面描画は、Defered.done() の先で行うことを想定！
					console.log('### anaProc.doSearch ###');
					console.log(data);
				}else{
					// エラー処理は、Defered.done() の先で行うことを想定！！
				}
				return this;
			});

			return deferd;
		},
		/**
		 * ソート指定の分析を実行する
		 */
		doSearchWithSortReq: function(sortReq){
			if(_.isNullOrUndefined(this.savedReq)){
				throw new Exception('anaProc.doSearchWithSortReq: 前回分析条件がありません');
			}

			// Ｎページめの表示の場合は、１ページめからの検索にリセットする。
			// ただし、前回検索時と同一のソート条件の場合は、再読み込み相当とするのか？
			var req = Ana.Util.dclone(this.savedReq);
			var sameSortReq = true;
			if(req.anaVSortkey && !_.isEmpty(req.anaVSortkey)){
				var preSortReq = req.anaVSortkey[0];
				for(var key in sortReq){
					if(sortReq[key] === preSortReq[key]){
						sameSortReq = false;
						break;
					}
				}
			}else{
				sameSortReq = false;
			}
			if(!sameSortReq){
				req.pageReq.startRecord = 0;
				req.anaVSortkey = [ sortReq ];
			}

			var uri = this.searchURI;
			var deferd = clutil.postAnaJSON(uri, req, _.bind(function(data){
				if(_.isObject(data.head) && _.isNumber(data.head.status)
						&& data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK){

					// この回の検索条件を保存しておく。
					this.savedReq  = req;
					//this.savedCond = Ana.Util.dclone(_mAnaProc.cond);
					this.savedResult = data;

					// 画面描画は、Defered.done() の先で行うことを想定！
					console.log('### anaProc.doSearchWithSortReq ###');
					console.log(data);
				}else{
					// エラー処理は、Defered.done() の先で行うことを想定！！
				}
			}, this));

			return deferd;
		},
		/**
		 * ページ指定の分析を実行する。
		 */
		doSearchByPage: function(pageNum, pageSize){
			if(_.isNullOrUndefined(this.savedReq)){
//				return doSearch();
				throw new Exception('anaProc.doPageSearch: 前回分析条件がありません。');
			}
			var req = Ana.Util.dclone(this.savedReq);
			req.pageReq = {
				startRecord: (pageNum - 1) * pageSize,
				pageSize: pageSize
			};
			var uri = this.searchURI;

			var deferd = clutil.postAnaJSON(uri, req, _.bind(function(data){
				if(_.isObject(data.head) && _.isNumber(data.head.status)
						&& data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK){

					// この回の検索条件を保存しておく。
					this.savedReq  = req;
					//this.savedCond = Ana.Util.dclone(_mAnaProc.cond);
					this.savedResult = data;

					// 画面描画は、Defered.done() の先で行うことを想定！
					console.log('### anaProc.doSearchByPage ###');
					console.log(data);
				}else{
					// エラー処理は、Defered.done() の先で行うことを想定！！
				}
			}, this));

			return deferd;
		},
		/**
		 * ドリルダウンの分析を実行する
		 */
		doDrillDown: function(vLeaf){
			if(_.isNullOrUndefined(this.savedReq)){
				throw new Exception('anaProc.doDrillDown: 前回分析条件がありません。');
			}
			var req = Ana.Util.dclone(this.savedReq);

			// 1. 縦軸を選択軸にする。（Attr + 1）
			_.last(req.anaVAxis).attr = vLeaf.data.attr+1;

			// 2. 選択軸要素を絞込み条件へ入れる
			var vNode = vLeaf;
			var wkVAxisKindSet = new Object();
			while(!vNode.isRoot()){
				var axElem = vNode.data;
				if(!axElem || wkVAxisKindSet[axElem.kind]){
					vNode = vNode.parent;
					continue;
				}

				wkVAxisKindSet[axElem.kind] = true;

				// AnaFocus を作る
				var focus = Ana.Util.toAnaFocus(axElem);
				focus.is_drill_down = 1;

				// AnaFocus に func_id をセットする
				var condAxElem = this.savedCond.axKindVAxisMap[axElem.kind];
				if(condAxElem && condAxElem.func_id){
					focus.func_id = condAxElem.func_id;
				}

				req.anaFocus.push(focus);
				vnode = vNode.parent;
			}

			// 3. 表示オプション：合計、小計、既存店計、←これらを外す
			req.f_total = 0;
			req.f_subtotal &= ~amgbp_AnaHead.AMGBP_ANA_REQ_F_SUBTOTAL_V;
			//req.existsum = amgbp_AnaHead.AMGBP_ANA_REQ_EXISTSUM_OFF;

			// 4. ページャ無効化
			req.pageReq = {
				startRecord: 0,
				pageSize: 2147483647	// INT_MAX
			}

			// 5. 処理区分：ドリルダウンをセット
			req.operation = amgbp_AnaDefs.AMGBA_DEFS_ANA_OPERATION_DRILLDOWN;

			// 6. 初回分析時における分析結果の横軸要素設定  FIXED: 2015-07-31
			req.anaHAxisElem = this.savedResult.anaHAxisElem;

			// ★サービス呼び出し。★
			var uri = this.searchURI;
			var deferd = clutil.postAnaJSON(uri, req, _.bind(function(data){
				// deferd を渡すので、
				// 呼び出し元側で、deferd.done(function(data){...}) でハンドリングする。
				// エラーは、deferd.fail(function(data){...}) でハンドリングする。
			},this));

			return deferd;
		},
		/**
		 * 会員リストを登録する。
		 */
		doSaveCustList: function(name, f_open, f_listuse){
			if(_.isNullOrUndefined(this.savedReq)){
				throw new Exception('anaProc.doSaveCustList: 前回分析条件がありません。');
			}

			var req = Ana.Util.dclone(this.savedReq);
			req.operation = amgbp_AnaDefs.AMGBA_DEFS_ANA_OPERATION_MEMBLIST;
			req.memblist_name = name;
			req.memblist_f_open = f_open;
			req.memblist_f_listuse = f_listuse;
			if(this.cellSelectReq && !_.isEmpty(this.cellSelectReq)){
				// セル選択条件を入れる
				// このメソッドは、会員リスト登録サブ画面から呼ばれるので、
				// セル選択条件は一時的に anaProc 内部で預かっている。
				req.anaCellSelect = this.cellSelectReq;
			}

			// ★サービス呼び出し。★
			var uri = this.searchURI;
			var deferd = clutil.postAnaJSON(uri, req, _.bind(function(data){
				// deferd を渡すので、
				// 呼び出し元側で、deferd.done(function(data){...}) でハンドリングする。
				// エラーは、deferd.fail(function(data){...}) でハンドリングする。
			},this));

			return deferd;
		},
		/**
		 * 匿名の会員リストを作成する。
		 */
		doCreateAnonymousCustList: function(cellSelectReq){
			if(_.isNullOrUndefined(this.savedReq)){
				throw new Exception('anaProc.doCreateAnonymousCustList: 前回分析条件がありません。');
			}

			var req = Ana.Util.dclone(this.savedReq);
			req.operation = amgbp_AnaDefs.AMGBA_DEFS_ANA_OPERATION_NEXT;
			req.anaCellSelect = cellSelectReq;

			// ★サービス呼び出し。★
			var uri = this.searchURI;
			var deferd = clutil.postAnaJSON(uri, req);

			return deferd;
		},
		// Map連携ファイルダウンロードURIを取得する
		getMAPDATURI: function(cellSelectReq){
			if(_.isNullOrUndefined(this.savedReq)){
				throw new Exception('anaProc.doCreateAnonymousCustList: 前回分析条件がありません。');
			}

			var req = Ana.Util.dclone(this.savedReq);
			req.operation = amanp_AnaDefs.AMAN_DEFS_ANA_OPERATION_TERAMAP;
			// 合計/小計は含ませない
			req.anaHead.f_total = 0;
			req.anaHead.f_subtotal &= ~(amgbp_AnaHead.AMGBP_ANA_REQ_F_SUBTOTAL_V);

			// 行選択はサポートしないよ！
			//req.anaCellSelect = cellSelectReq;

			// ★サービス呼び出し。★
			var uri = this.searchURI;
			var deferd = clutil.postAnaJSON(uri, req);

			return deferd;
		},
		// CSVダウンロードURIを取得する
		getCSVDLURI: function(){
			return this._getDLURLI(amgbp_AnaDefs.AMGBA_DEFS_ANA_OPERATION_CSVDL, 'CSV');
		},
		// EXCELダウンロードURIを取得する
		doEXCELDURI: function(){
			return this._getDLURLI(amgbp_AnaDefs.AMGBA_DEFS_ANA_OPERATION_EXCELDL, 'EXCEL');
		},
		_getDLURLI: function(ope, dbglabel){
			if(!this.savedReq){
				// #20150616 いきなりXLS/CSVを押せても良いだろう -> 無ければreqデータをここで作成
				////throw '分析実行結果がありません。';
				var req = this.buildAnaReq();
				this.savedReq = req;
			}
			var req = Ana.Util.dclone(this.savedReq);
			req.operation = ope;
			var uri = this.searchURI;
			var deferd = clutil.postAnaJSON(uri, req, function(data){
				console.log('### anaProc._do' + dbglabel + 'DL] ###');
				console.log(data);
			});
			return deferd;
		},
		/**
		 * マスタ表示項目が設定されているか
		 * @param mstitem_list
		 * @returns {Boolean}
		 */
		has_mstitem: function(mstitem_list) {
			var num = 0;
			_.each(mstitem_list, function(item) {
				num += item.length;
			});
			return num != 0;
		},

		/**
		 * ABC分析の表示項目にランク実績を追加
		 * @param list
		 */
		abc_add_ABC: function(list) {
			// ランク実績チェック
			var disp_id = (amgbp_AnaDispItemDefs.AMGBA_DI_G_SALE|amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL|amgbp_AnaDispItemDefs.AMGBA_DI_I_ABC);
			var is_rank = _.find(list, function(o) {
				return o.dispitem_id === disp_id;
			});
			if (is_rank == null) {
				// 最初に挿入
				var rank = {
					dispitem_id: disp_id,
					name: 'ランク実績',
				};
				list.splice(0, 0, rank);
			}
		},

		abc_add_RANK: function(list, disp_id, rank_name) {
			//var disp_id = (amgbp_AnaDispItemDefs.AMGBA_DI_G_SALE|amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL|rank_id);
			var is_rank = _.find(list, function(o) {
				return o.dispitem_id === disp_id;
			});
			if (is_rank == null) {
				// ランク実績の後に挿入
				var disp_id2 = (amgbp_AnaDispItemDefs.AMGBA_DI_G_SALE|amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL|amgbp_AnaDispItemDefs.AMGBA_DI_I_ABC);
				var rank = {
					dispitem_id: disp_id,
					name: rank_name,
				};
				var start = -1;
				_.each(list, function(o, k) {
					if (o.dispitem_id == disp_id2) {
						start = k;
						return false;
					}
				});
				if (start >= 0) {
					list.splice(start+1, 0, rank);
				}
			}

		},

		abc_add_VAL: function(list, disp_id, rank_name) {
			//var disp_id = (amgbp_AnaDispItemDefs.AMGBA_DI_G_SALE|amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL|rank_id);
			var is_rank = _.find(list, function(o) {
				return o.dispitem_id === disp_id;
			});
			if (is_rank == null) {
				// 商品名実績、カラー実績・・・の最後に見つかったものの直後に入れる
				var rank = {
					dispitem_id: disp_id,
					name: rank_name,
				};
				var start = -1;
				_.each(list, function(o, k) {
					var id = o.dispitem_id & amgbp_AnaDispItemDefs.AMGBA_DI_I_MASK;
					switch (id) {
					case amgbp_AnaDispItemDefs.AMGBA_DI_I_ITEMATTR_ITEM_NAME:	// 商品名
					case amgbp_AnaDispItemDefs.AMGBA_DI_I_ITEMATTR_COLOR_NAME:	// カラー
					case amgbp_AnaDispItemDefs.AMGBA_DI_I_ITEMATTR_MAKER_CODE:	// メーカー品番
					case amgbp_AnaDispItemDefs.AMGBA_DI_I_ITEMATTR_MAKER_NAME:	// メーカー名
					case amgbp_AnaDispItemDefs.AMGBA_DI_I_SUPPORT_RT_RANK:		// 支持率（選択期間内）
					case amgbp_AnaDispItemDefs.AMGBA_DI_I_SUPPORT_RT_CM_RANK:	// 支持率（累計）
					case amgbp_AnaDispItemDefs.AMGBA_DI_I_AM_RANK:				// 金額ランク
					case amgbp_AnaDispItemDefs.AMGBA_DI_I_QY_RANK:				// 点数ランク
						if (start < k) {
							start = k;
						}
						break;
					}
				});
				if (start >= 0) {
					list.splice(start+1, 0, rank);
				}
			}
		},

		/**
		 * 分析リクエストを生成する。
		 */
		buildAnaReq: function() {
			var c = this.cond;

			// 表示項目とマスタ表示項目をマージ
			var displist = []
				, displist2 = [];

			// マスタ表示項目配列をワーク用配列にコピー
			_.each(c.mstitem_list, _.bind(function(dto, k) {
				if (dto) {
					if (_.isArray(dto)) {
						_.each(dto, function(v) {
							displist.push(v);
						});
					} else {
						displist.push(dto);
					}
				}
			}, this));

			// 表示項目配列をワーク用配列２にコピー
			c._tmpdispitemlist = [];
			_.each(c.dispitemlist, _.bind(function(dto, k) {
				if (dto) {
					c._tmpdispitemlist.push(dto);	// 現状をバックアップ
					displist2.push(dto);
				}
			}, this));

			/*
			 * ABC分析必須項目の追加
			 */
			if(this.f_anakind == amcm_type.AMCM_VAL_ANAKIND_ABC){
				if (c.extra.mdabc_type == amanp_AnaHead.AMANP_ANA_REQ_ABC_TYPE_QY) {
					// 売上数基準の場合

					// ランク実績チェック
					this.abc_add_ABC(displist2);
					// 売上数順位実績
					this.abc_add_RANK(displist2, amgbp_AnaDispItemDefs.AMGBA_DI_G_SALE|amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL|amgbp_AnaDispItemDefs.AMGBA_DI_I_QY_RANK, '売上数順位実績');
					// 売上数実績
					this.abc_add_VAL(displist2, amgbp_AnaDispItemDefs.AMGBA_DI_G_SALE|amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL|amgbp_AnaDispItemDefs.AMGBA_DI_I_QY, '売上数実績');
				} else if (c.extra.mdabc_type == amanp_AnaHead.AMANP_ANA_REQ_ABC_TYPE_AM) {
					// 売上高基準の場合

					// ランク実績チェック
					this.abc_add_ABC(displist2);
					// 売上高(税抜)順位実績
					this.abc_add_RANK(displist2, amgbp_AnaDispItemDefs.AMGBA_DI_G_SALE|amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL|amgbp_AnaDispItemDefs.AMGBA_DI_I_AM_RANK, '売上高(税抜)順位実績');
					// 売上高(税抜)実績
					this.abc_add_VAL(displist2, amgbp_AnaDispItemDefs.AMGBA_DI_G_SALE|amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL|amgbp_AnaDispItemDefs.AMGBA_DI_I_AM, '売上高(税抜)実績');
				} else if (c.extra.mdabc_type == amanp_AnaHead.AMANP_ANA_REQ_ABC_TYPE_SUPPORT_RT) {
					// 支持率（選択期間内）

					// ランク実績チェック
					this.abc_add_ABC(displist2);
					// 支持率(選択期間内)順位実績
					this.abc_add_RANK(displist2, amgbp_AnaDispItemDefs.AMGBA_DI_G_SUPPORT|amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL|amgbp_AnaDispItemDefs.AMGBA_DI_I_SUPPORT_RT_RANK, '支持率(選択期間内)順位実績');
					// 支持率(選択期間内)実績
					this.abc_add_VAL(displist2, amgbp_AnaDispItemDefs.AMGBA_DI_G_SUPPORT|amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL|amgbp_AnaDispItemDefs.AMGBA_DI_I_SUPPORT_RT, '支持率(選択期間内)実績');
				} else if (c.extra.mdabc_type == amanp_AnaHead.AMANP_ANA_REQ_ABC_TYPE_SUPPORT_RT_CM) {
					// 支持率（累計）

					// ランク実績チェック
					this.abc_add_ABC(displist2);
					// 支持率(累計)順位実績
					this.abc_add_RANK(displist2, amgbp_AnaDispItemDefs.AMGBA_DI_G_SUPPORT|amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL|amgbp_AnaDispItemDefs.AMGBA_DI_I_SUPPORT_RT_CM_RANK, '支持率(累計)順位実績');
					// 支持率(累計)実績
					this.abc_add_VAL(displist2, amgbp_AnaDispItemDefs.AMGBA_DI_G_SUPPORT|amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL|amgbp_AnaDispItemDefs.AMGBA_DI_I_SUPPORT_RT_CM, '支持率(累計)実績');
				}
			}
			_.each(displist2, _.bind(function(dto, k) {
				if (dto) {
					displist.push(dto);
				}
			}, this));
			c.dispitemlist = displist;

			// 分析軸構築ヘルパー関数
			var buildAxisReq = function(axisList, fromtoMap){
				var fixedAxList = [];
				if(!fromtoMap){
					fromtoMap = {};	// nullpo 防止用
				}
				if(_.isArray(axisList) && !_.isEmpty(axisList)){
					for(var i = 0; i < axisList.length; i++){
						var ax = axisList[i];
						var dispname = ax.name2;
						if(_.isString(ax.name) && !_.isEmpty(ax.name)){
							dispname += ':' + ax.name;
						}
						if(fromtoMap[ax.kind] && fromtoMap[ax.kind][ax.attr]){
							var rangeDtoList = fromtoMap[ax.kind][ax.attr];
							var rangeLabels = [];
							for(var dtoIdx = 0; dtoIdx < rangeDtoList.length; dtoIdx++){
								var rangeDto = rangeDtoList[dtoIdx];
								// 数値フォーマットでカンマ区切ると区切り文字が混乱するので
								// 数値フォーマットしない。
								//var rangeLabel = Ana.Util.numberFormat(rangeDto.val) + '～' + Ana.Util.numberFormat(rangeDto.val2);
								var rangeLabel = rangeDto.val + '～' + rangeDto.val2;
								rangeLabels.push(rangeLabel);
							}
							if(!_.isEmpty(rangeLabels)){
								dispname += ' [' + rangeLabels.join(',') + ']';
							}
						}
						fixedAxList.push({
							kind: ax.kind,
							attr: ax.attr,
							func_id: ax.func_id,
							dispattr: ax.dispattr,
							dispname: dispname
						});
					}
				}
				return fixedAxList;
			};

			// 絞り込み条件 バスケット分析（拡張）対応
			var _tmpfocusList = [];
			var _tmpfocusList2 = [];
			_.each(c.focuslist, function(focus) {
				_tmpfocusList.push(focus);
			});
			_.each(c.focuslist2, function(focus) {
				_tmpfocusList2.push(focus);
			});
			if (this.f_anakind == amcm_type.AMCM_VAL_ANAKIND_BASKET_EX) {
				_tmpfocusList.push(c.basket_list[0]);
				_tmpfocusList2.push(c.basket_list[1]);
			}
			// 軸情報 バスケット分析（拡張）対応
			var _tmpVAxisList = [];
			if (this.f_anakind == amcm_type.AMCM_VAL_ANAKIND_BASKET_EX) {
				_tmpVAxisList[0] = c.vAxisListEx[0];
				_tmpVAxisList[1] = c.vAxisListEx[1];
				_tmpVAxisList[2] = c.vAxisList[0];
			// 流入・流出分析で分析帳票商品分類選択時の対応
			} else if (this.f_anakind == amcm_type.AMCM_VAL_ANAKIND_FLOW) {
				var new_axisList = [];
				for (var i = 0; i < c.vAxisList.length; i++) {
					axis = c.vAxisList[i];
					if (axis.kind == amgbp_AnaDefs.AMGBA_DEFS_KIND_ITGRP) {
						if (axis.dispattr == 3) {
							var axis1 = {
									attr: 1,
									dispname: "分析帳票商品分類 : 部門",
									func_id: axis.func_id,
									kind: axis.kind,
							}
							var axis2 = {
									attr: 2,
									dispname: "分析帳票商品分類 : 品種",
									func_id: axis.func_id,
									kind: axis.kind,
							}
							new_axisList.push(axis1);
							new_axisList.push(axis2);
						} else {
							new_axisList.push(axis);
						}
					} else {
						new_axisList.push(axis);
					}
				}
				_tmpVAxisList = new_axisList;
			} else {
				_tmpVAxisList = c.vAxisList;
			}

			var dispitemlist = c.dispitemlist;

			// if (clcom.pageId == 'AMGAV2100') {
			// 	if (!(c.vfzerosuppress && c.hfzerosuppress)) {
			// 		dispitemlist = _.unique(
			// 			_.union(dispitemlist, [
			// 			  {
			// 				dispitem_id:
			// 				  amgbp_AnaDispItemDefs.AMGBA_DI_G_OTHER |
			// 				  amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL |
			// 				  amgbp_AnaDispItemDefs.AMGBA_DI_I_DAYS,
			// 				name: '日数実績',
			// 			  },
			// 			  {
			// 				dispitem_id:
			// 				  amgbp_AnaDispItemDefs.AMGBA_DI_G_OTHER |
			// 				  amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL |
			// 				  amgbp_AnaDispItemDefs.AMGBA_DI_I_STORENUM,
			// 				name: '店舗数実績',
			// 			  },
			// 			  {
			// 				dispitem_id:
			// 				  amgbp_AnaDispItemDefs.AMGBA_DI_G_OTHER |
			// 				  amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL |
			// 				  amgbp_AnaDispItemDefs.AMGBA_DI_I_JANNUM,
			// 				name: 'JAN数実績',
			// 			  },
			// 			]),
			// 			function (dispitem) {
			// 			  return dispitem.dispitem_id;
			// 			}
			// 		  )
			// 	}
			// }

			var req = {
				// リクエスト共通ヘッダ
				head: {
					dummy: 0
				},
				// 処理区分
				// GSAN_DEFS_ANA_OPERATION_REG : 1,
				// GSAN_DEFS_ANA_OPERATION_CSVDL : 2,
				// GSAN_DEFS_ANA_OPERATION_EXCELDL : 3,
				// GSAN_DEFS_ANA_OPERATION_MEMBLIST : 4,
				// GSAN_DEFS_ANA_OPERATION_NEXT : 5,
				// GSAN_DEFS_ANA_OPERATION_DRILLDOWN : 6,
				operation: amgbp_AnaDefs.AMGBA_DEFS_ANA_OPERATION_REG,
				// ページ要求
				pageReq: {
					startRecord: 0,
					pageSize: this.pageSize
				},
				// 分析条件ヘッダー
				anaHead: {
					f_comp: 0,							// 対比タイプ
					f_zerosuppress: function(v0, h0){	// ゼロサプレス
						var v0supp = (v0) ? amgbp_AnaHead.AMGBP_ANA_REQ_F_ZEROSUPPRESS_V : 0;
						var h0supp = (h0) ? amgbp_AnaHead.AMGBP_ANA_REQ_F_ZEROSUPPRESS_H : 0;
						return (v0supp | h0supp);
					}(c.vfzerosuppress, c.hfzerosuppress),
					f_total: c.dispopt.f_total,			// 合計
					f_subtotal: function(vs, hs){		// 小計有無
						var vstotal = (vs === 1) ? amgbp_AnaHead.AMGBP_ANA_REQ_F_SUBTOTAL_V : 0;
						var hstotal = (hs === 1) ? amgbp_AnaHead.AMGBP_ANA_REQ_F_SUBTOTAL_H : 0;
						return (vstotal | hstotal);
					}(c.dispopt.f_subtotal, c.dispopt.f_subtotal),
					f_vcode_disp: 0,					// 縦軸コード表示有無
					f_hcode_disp: 0,					// 横軸コード表示有無
					f_term_detail: 0,					// 期間条件詳細or簡易
					f_item_detail: 0,					// 商品条件詳細or簡易
					f_comp_item_detail: 0,				// 購入商品条件詳細or簡易
					f_axis_detail: 0,					// 軸条件詳細or簡易

					// マスタ検索日
					f_srchiymd_type: c.mstsrchdate.f_srchiymd_type,	// 検索日タイプ
					srchiymd: c.mstsrchdate.srchiymd,				// マスタ検索日
					org_srchiymd: c.mstsrchdate.org_srchiymd,		// 組織マスタ検索日
					itgrp_srchiymd: c.mstsrchdate.itgrp_srchiymd,	// 商品分類マスタ検索日
					memb_srchiymd: c.mstsrchdate.memb_srchiymd,		// 会員マスタ検索日
					anakind: this.f_anakind,			// 分析種別
					disp_way: function(cond){			// 表示項目並び
						var disp_way = cond.dispopt.disp_way;
						// 表示項目並びを補正する。
						if(_.isNullOrUndefined(cond.hAxisList) || cond.hAxisList.length === 0){
							// 軸数が１の場合、表示項目並びで「たて」はありえない。⇒ 補正
							disp_way = amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_H;
						}
						return disp_way;
					}(c),
					disp_amunit: c.dispopt.disp_amunit,	// 表示単位
					disp_ly: c.disp_ly,					// 前年
					existsum: c.dispopt.existsum,		// 既存店集計
					sizesum: c.dispopt.sizesum,		// サイズ名集約
					anacatalog_id: this.catalog_id,		// 利用カタログID

					exist_iymd: c.exist_iymd,	// 既存店基準日
					close_iymd: c.close_iymd,	// 閉店基準日

					membcond: c.extra.membcond,			// 顧客条件:全顧客 or 会員

					abc_type: c.extra.mdabc_type		// MD商品分析: ABC分析基準
				},
				// 期間：[0]対象期間、[1]比較期間	-- プロトコルの型そのまま持つ。
				anaPeriod: function(anaProc){
					var xx = new Array();
					var fixDto = function(_dto){
						var name = _dto.name;
						var dto = _.extend({dispname: name}, _dto);
						delete(dto.name);	// 余分なプロパティを削除１
						delete(dto.select);	// 余分なプロパティを削除２
						return dto;
					};
					xx.push(fixDto(c.anaPeriods[0]));
					if(c.anaPeriods.length > 1 && !_.isNullOrUndefined(c.anaPeriods[1]) && c.anaPeriods[1].select == true){
						xx.push(fixDto(c.anaPeriods[1]));
					}
					return xx;
				}(this),
				// 絞込み条件
				anaFocus: function(vAxList, hAxList, fromtoMap, focusList){
					// 選択中の軸に合致する閾値条件を絞り込み条件として収集する。
					// 閾値条件が無ければ、単なる絞り込み条件を返す。
					var buildFromtoFocus = function(axList, fromtoMap, outArray){
						if(!_.isArray(outArray)){
							outArray = new Array();
						}
						for(var i = 0; i < axList.length; i++) {
							var ax = axList[i];
							if(_.has(fromtoMap, ax.kind) && _.has(fromtoMap[ax.kind], ax.attr)){
								var rangeDtoList = fromtoMap[ax.kind][ax.attr];
								for(var dtoIdx = 0; dtoIdx < rangeDtoList.length; dtoIdx++){
									var rangeDto = rangeDtoList[dtoIdx];
									outArray.push({
										kind: ax.kind,
										attr: ax.attr,
										func_id: ax.func_id,
										val: Ana.Util.valueToInt32(rangeDto.val),
										val2: Ana.Util.valueToInt32(rangeDto.val2),
										axis_only: 1
									});
								}
							}
						}
						return outArray;
					};
					// 軸の閾値条件をくみ取る
					var axFocusList = buildFromtoFocus(vAxList, fromtoMap);
					buildFromtoFocus(hAxList, fromtoMap, axFocusList);

					// 明示的に enable=false としている focusList 要素は無効扱いとする。
					// プロパティ enable が無い場合は有効と見なす。
					var reqFocusList = _.reduce(focusList, function(array, e){
						if(e.enable !== false){
							array.push(e);
						}
						return array;
					}, []);

					return reqFocusList.concat(axFocusList);
				}(_tmpVAxisList, c.hAxisList, c.fromtoList, _tmpfocusList),
				// 比較絞込み条件
				anaFocus2: _tmpfocusList2,
				// 表示項目
				anaDispItem: _.reduce(dispitemlist, function(array, dto){
					if(_.isNumber(dto.dispitem_id)){
						array.push(_.extend({
							dispname: dto.name
						}, dto));
						return array;
					}
				}, new Array()),
				// 表示項目範囲条件
				anaDispRange: c.disprangelist,
				// 表示色設定
				anaDispRangeColor: [],
				// 縦軸条件
				anaVAxis: buildAxisReq(_tmpVAxisList, c.fromtoList),
				// 横軸条件
				anaHAxis: buildAxisReq(c.hAxisList, c.fromtoList),
				// 縦軸ソート条件
				anaVSortkey: c.dispvsortkeylist,
				// グラフ条件（１件）
				anaChart:[],
				// 横軸情報（ドリルダウン用）
				anaHAxisElem: [],
				// セル選択
				anaCellSelect: [],

				// 購買条件
				anaBuyingReq: function(dto){
					return (!dto || _.isEmpty(dto)) ? undefined : dto;
				}(c.anabuyingcond),

				//-- 会員リスト登録時 --------------
				// 会員リスト名
				memblist_name: '',
				memblist_f_open: 0,
				memblist_f_listuse: 0
			};

			// 仕上げの補正
			if(req.anaPeriod.length >= 2){
				// 比較あり。
				req.anaHead.f_comp = 1;
			}

			// 仕上げの補正 for ABC分析
			if(req.anaHead.anakind == amcm_type.AMCM_VAL_ANAKIND_ABC){
				console.log('req.andHead.abc_type ' + req.anaHead.abc_type);
				switch(req.anaHead.abc_type){
				 case amanp_AnaHead.AMANP_ANA_REQ_ABC_TYPE_QY:	// 売上数
					 req.anaVSortkey = this.buildSortkeyList([
						{
							dispItemId: amgbp_AnaDispItemDefs.AMGBA_DI_I_QY,
							sbit: amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL,
							order: amgbp_AnaSortKey.AMGBP_ANA_SORTKEY_ORDER_DESCENDING,
							idx: 0
						}
					]);
					break;
				 case amanp_AnaHead.AMANP_ANA_REQ_ABC_TYPE_SUPPORT_RT:	// 支持率(選択期間内)
					 req.anaVSortkey = this.buildSortkeyList([
						{
							dispItemId: amgbp_AnaDispItemDefs.AMGBA_DI_I_SUPPORT_RT,
							sbit: amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL,
							order: amgbp_AnaSortKey.AMGBP_ANA_SORTKEY_ORDER_DESCENDING,
							idx: 0
						}
					]);
					break;
				 case amanp_AnaHead.AMANP_ANA_REQ_ABC_TYPE_SUPPORT_RT_CM:	// 支持率(累計)
					 req.anaVSortkey = this.buildSortkeyList([
						{
							dispItemId: amgbp_AnaDispItemDefs.AMGBA_DI_I_SUPPORT_RT_CM,
							sbit: amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL,
							order: amgbp_AnaSortKey.AMGBP_ANA_SORTKEY_ORDER_DESCENDING,
							idx: 0
						}
					]);
					break;
				 case amanp_AnaHead.AMANP_ANA_REQ_ABC_TYPE_AM:	// 売上高
				 default:
					req.anaVSortkey = this.buildSortkeyList([
						{
							//// #20150518 売上は税抜に統一
							////dispItemId: amgbp_AnaDispItemDefs.AMGBA_DI_I_AM_TAX,
							dispItemId: amgbp_AnaDispItemDefs.AMGBA_DI_I_AM,
							sbit: amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL,
							order: amgbp_AnaSortKey.AMGBP_ANA_SORTKEY_ORDER_DESCENDING,
							idx: 0
						}
					]);
					break;
				}
			}
			// 仕上げの補正 for バスケット分析（拡張）
			if (req.anaHead.anakind == amcm_type.AMCM_VAL_ANAKIND_BASKET_EX
					|| req.anaHead.anakind == amcm_type.AMCM_VAL_ANAKIND_BASKET) {
				var dispitem_id1 = amgbp_AnaDispItemDefs.AMGBA_DI_G_BASKET | amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL | amgbp_AnaDispItemDefs.AMGBA_DI_I_BASKET_ITEM1;
				var dispitem_id2 = amgbp_AnaDispItemDefs.AMGBA_DI_G_BASKET | amgbp_AnaDispItemDefs.AMGBA_DI_S_VAL | amgbp_AnaDispItemDefs.AMGBA_DI_I_BASKET_ITEM2;
				if (_.where(req.anaDispItem, {dispitem_id:dispitem_id2}).length == 0) {
					req.anaDispItem.unshift({
						dispitem_id: dispitem_id2,
						name: '比較商品・商品分類',
					});
				}
				if (_.where(req.anaDispItem, {dispitem_id:dispitem_id1}).length == 0) {
					req.anaDispItem.unshift({
						dispitem_id: dispitem_id1,
						name: '基準商品・商品分類',
					});
				}

				console.log(req.anaDispItem);
			}
			c.dispitemlist = c._tmpdispitemlist;

			return req;
		},

		/**
		 * [対象]絞込条件のgetter関数。
		 *
		 * filteropt: {
		 *   kind: <kind値>,
		 *   attr: <attr値>,
		 *   funcId: <funcId値>
		 * }
		 * filteropt を指定しない場合は全部。
		 * filteropt.kind を指定した場合は、kind 値マッチするもの。
		 * filteropt.attr を指定した場合は、attr 値マッチするもの。
		 * filteropt.func_id を指定した場合は、funcId 値マッチするもの。
		 *
		 * kind, attr 同時に指定した場合は kind AND attr 値マッチするものを返す。
		 * 数値の 0 は未指定（なんでもマッチする）扱いとする。
		 */
		getFocus1: function(fltopt) {
			return this._getFocus(fltopt, this.cond.focuslist);
		},

		/**
		 * [比較]絞込条件のgetter関数。
		 */
		getFocus2: function(fltopt) {
			return this._getFocus(fltopt, this.cond.focuslist2);
		},

		// getFocus12 内部関数
		_getFocus: function(fltopt, srcArray){
			if(_.isNullOrUndefined(fltopt)){
				return Ana.Util.dclone(srcArray);
			}

			// フィルタ条件と絞り込み条件のマッチング関数
			// flt の 0 値はワイルドカードとして扱う
			var isMatch = function(flt, focus) {
				if(flt.kind !== 0 && flt.kind !== Ana.Util.valueToNumber(focus.kind)){
					return false;
				}
				if(flt.attr !== 0 && flt.attr !== Ana.Util.valueToNumber(focus.attr)){
					return false;
				}
				if(flt.func_id !== 0 && flt.func_id !== Ana.Util.valueToNumber(focus.func_id)){
					return false;
				}
				return true;
			};

			var dstarray = new Array();
			if(_.isArray(fltopt)){

				// 絞り込み条件種別 { kind, attr, func_id } マッチング用文字列を生成する関数
				var toFocusKindHashKey = function(focusobj) {
					var _kind = Ana.Util.valueToNumber(focusobj.kind);
					var _attr = Ana.Util.valueToNumber(focusobj.attr);
					var _func_id = Ana.Util.valueToNumber(focusobj.func_id);
					return 'k' + _kind + '_a' + _attr + '_f' + _func_id;
				};

				// 与えられたフィルタ条件配列を補完する
				// {kind, attr, func_id} 値が null, undefined 値なら 0 を設定する。
				var fixFltopts = _.reduce(fltopt, function(mapobj, aFltopt){
					var key = toFocusKindHashKey(aFltopt);
					if(!mapobj[key]){
						mapobj[key] = {
							kind	: Ana.Util.valueToNumber(aFltopt.kind),
							attr	: Ana.Util.valueToNumber(aFltopt.attr),
							func_id	: Ana.Util.valueToNumber(aFltopt.func_id)
						};
					}
					return mapobj;
				}, new Object());

				// フィルタ条件にヒットしたものを dstarray へ入れる
				for(var i = 0; i < srcArray.length; i++){
					var f = srcArray[i];
					for(var key in fixFltopts){
						var aFltopt = fixFltopts[key];
						if(isMatch(aFltopt, f)){
							// マッチした：要素を追加
							dstarray.push(Ana.Util.dclone(f));
							break;
						}
					}
				}
			}else{
				var fixFltopt = {
					kind	: Ana.Util.valueToNumber(fltopt.kind),
					attr	: Ana.Util.valueToNumber(fltopt.attr),
					func_id	: Ana.Util.valueToNumber(fltopt.func_id)
				};

				for(var i = 0; i < srcArray.length; i++){
					var f = srcArray[i];
					if(isMatch(fixFltopt, f)){
						// マッチした：要素を追加
						dstarray.push(Ana.Util.dclone(f));
					}
				}
			}
			return dstarray;
		},

		/**
		 * [対象]絞込条件の push 関数。
		 * (kind, attr, funcId) 重複チェックは行わない。
		 * ユニーク性はサブパネル側でコントロールすること。
		 * 【ヒント】
		 * 当該パネルが担当する絞り込み条件種別をセットするときは、
		 * いったん anaProc.removeFocus1(rmopt) を行ってから、
		 * anaProc.pushFocus1([focus1, ...]) する。
		 */
		pushFocus1: function(focuslist) {
			this._pushFocus(focuslist, this.cond.focuslist);
			return this;	// カスケード用に。
		},

		/**
		 * [比較]絞込条件の put 関数。
		 */
		pushFocus2: function(focuslist) {
			this._pushFocus(focuslist, this.cond.focuslist2);
			return this;	// カスケード用に。
		},

		// pushFocus12 内部関数
		_pushFocus: function(src, dst){
			if(_.isArray(src)){
				// array.concat を使うと別インスタンスになるので愚直に追加するしかないの？
				for(var i = 0; i < src.length; i++) {
					dst.push(Ana.Util.dclone(src[i]));
				}
			}else if(_.isObject(src)){
				dst.push(Ana.Util.dclone(src));
			}else if(!_.isNullOrUndefined(src)){
				// プリミティブ型かな？
				dst.push(src);
			}
		},

		/**
		 * [対象]絞込条件の remove 関数。
		 * rmopt: {
		 *   kind: <kind値>,
		 *   attr: <attr値>,
		 *   funcId: <funcId値>
		 * }
		 *
		 * ＜引数＞
		 * rmopt を指定しない場合は、全部。
		 * rmopt.kind を指定した場合は、kind 値マッチするもの。
		 * rmopt.attr を指定した場合は、attr 値マッチするもの。
		 * rmopt.func_id を指定した場合は、funcId 値マッチするもの。
		 *
		 * kind, attr 同時に指定した場合は kind AND attr 値マッチするものが削除される。
		 * 数値の 0 は未指定（なんでもマッチする）扱いとする。
		 */
		removeFocus1: function(rmopt) {
			this.cond.focuslist = this._removeFocus(rmopt, this.cond.focuslist);
			return this;	// カスケード用に。
		},

		/**
		 * [比較]絞込条件の remove 関数。
		 */
		removeFocus2: function(rmopt) {
			this.cond.focuslist2 = this._removeFocus(rmopt, this.cond.focuslist2);
			return this;	// カスケード用に。
		},

		// removeFocus12 内部関数
		_removeFocus: function(rmopt, srcArray){
			if(_.isNullOrUndefined(rmopt) || !_.isArray(srcArray)){
				return new Array();
			}

			if(_.isArray(rmopt)) {
				for(var i = 0; i < rmopt.length; i++){
					this._removeFocus(rmopt[i], srcArray);
				}
			}else{
				var _kind = Ana.Util.valueToNumber(rmopt.kind);
				var _attr = Ana.Util.valueToNumber(rmopt.attr);
				var _func_id = Ana.Util.valueToNumber(rmopt.func_id);

				for(var i = srcArray.length-1; i >= 0; i--){
					var f = srcArray[i];
					if(_kind !== 0 && _kind !== Ana.Util.valueToNumber(f.kind)){
						continue;
					}
					if(_attr !== 0 && _attr !== Ana.Util.valueToNumber(f.attr)){
						continue;
					}
					if(_func_id !== 0 && _func_id !== Ana.Util.valueToNumber(f.func_id)){
						continue;
					}
					// マッチした：farray から[i]番目の要素を削除
					srcArray.splice(i,1)
				}
			}
			return srcArray;
		},

		/**
		 * 分析条件を初期条件にリセットする。
		 */
		resetCond: function(e) {
			var jsonCond = JSON.stringify(this.cond);
			var jsonIniCond = JSON.stringify(this.iniCond);
			if(jsonCond == jsonIniCond){
				// 条件変更ナシ
			}else{
				// 条件変更アリ → 分析条件を初期状態へ戻す
				this.cond = Ana.Util.dclone(this.iniCond);
				this.publish('onCondReset', e);
			}
		},

		/**
		 * 分析条件の編集完了通知イベントを打ち上げる。
		 */
		fireAnaCondUpdated: function(e) {
			this.publish('onCondUpdated', e);
		},

		/**
		 * 条件設定Viewへイベントを通知する。
		 * イベント登録は、AnaUtil.Proc を介入して↓こうする。
		 * anyCondView.listenTo(anaProc, 'foo', anyCondView.func);
		 */
		publish: function(evName, from){
			// this は AnaUtil.Proc, from は発行人
			this.trigger(evName, this, from);
			return this;
		},

		/**
		 * 分析条件を履歴に保存する。（内部関数扱い）
		 */
		saveHistory: function(cond){
			// キャッシュデータ保存形式にフォーマットする
			var histCondData = {
				func_id: this.func_id,
				f_anakind: this.f_anakind,
				anamenuitem_name: this.anamenuitem_name,
				lru_cond: cond,
				lru_tm: Date.now()
			};
			if(this.catalog_id){
				histCondData.catalog_id = this.catalog_id;
				histCondData.catalog_name = this.catalog_name;
			}
			// ストレージに保存。
			clcom.amanHistory.prependCond(histCondData);
		},

		// 表示項目の設定値確認（デバグ用）
		xxxDispItemList: function(){
			return _.each(mainView.anaProc.cond.dispitemlist, function(elem, idx, array){
//				console.log('itemId[0x' + (elem.dispitem_id & 0xfff).toString(16) + '] name[' + elem.name + ']' );
				console.log(''
						+ 'dispitem_id[0x' + elem.dispitem_id.toString(16) + '] '
						+ 'itemId[0x' + (elem.dispitem_id & 0xfff).toString(16) + '] '
						+ 'name[' + elem.name + ']' );
			});
		},

		_eof: 'end of Ana.Proc.prototype//'
	});

	/**
	 * コンテキストメニューのビュー
	 * ・・・これは、<body> のすぐそばに <div> をつくる
	 */
	Ana.ContextMenuView = Backbone.View.extend({
		id: 'contextmenu',
		events: {
			'click a'	: '_onClickMenuItem'
		},
		initialize: function(opt){
			_.bindAll();
			this.options = opt;
		},
		menuItemTmpl: '<a><%= name %></a>',
		dscriptionTmpl: '<div class="description"><% for(var key in dscs){ %><p><%= dscs[key] %></p><% } %></div>',
		render: function(){
			this.$('#' + this.id).remove();
			this.$el.hide();
			if(_.isArray(this.options.menuItems)){
				var menuItems = this.options.menuItems;
				for(var i = 0; i < menuItems.length; i++){
					var menuItem = menuItems[i];
					$menuItem = $(_.template(this.menuItemTmpl, menuItem)).data(menuItem);
					this.$el.append($menuItem);
				}
			}
			return this;
		},
		_onClickMenuItem: function(e){
			var $target = $(e.target);
			var data = $target.data();
			if(_.isFunction(this.options.onMenuItemSelected)){
				this.options.onMenuItemSelected(data, this.attr, this);
			}
			this.hide();
		},
		show: function(descriptions, x, y, attr){
			this.attr = attr;

			// 解説パートを入れる
			var fixdscs = null;
			if(_.isString(descriptions)){
				fixdscs = { dscs: [descriptions] };
			}else if(_.isArray(descriptions)){
				fixdscs = { dscs: descriptions };
			}
			this.$('.description').remove();
			if(fixdscs){
				this.$el.prepend($(_.template(this.dscriptionTmpl, fixdscs)));
			}

			// 任意の body 内のクリックで閉じるように仕込む
			$('body').one('click', _.bind(function(e){
				this.hide();
			}, this));

			// 座標を設定して表示
			this.$el.css({
				position: 'absolute',
				'z-index': 99999,
				top: y,
				left: x
			});
			this.$el.show();
		},
		hide: function(){
			this.$el.hide();
		},
		isShowing: function(){
			return this.$el.css('display') === 'block';
		},
		_eof: 'end of Ana.ContextView//'
	});

	/**
	 * ページネーションをコントロールするビュー
	 */
	Ana.PaginationView = Backbone.View.extend({
		// el は、<div class="pagination-wrapper"></div> 要素。コンストラクタから渡す。

		initialize: function(opt){
			_.extend(this, opt);
			_.bindAll(this);

			this.$ul = this.$('.pagination > ul');

			var pgDefaults = {
				items: 0,
				itemsOnPage: 100,
				currentPage: 1,
				isselect: false,
				displaypanel: this.$('.count'),
				onPageClick: this.onPageClick
			};
			if(_.isObject(opt.pgOptions)){
				// パラメタ補完
				this.pgOptions = _.defaults(opt.pgOptions, pgDefaults);
			}else{
				this.pgOptions = pgDefaults;
			}
		},

		render: function(){
			this.setPage();
			return this;
		},

		setPage: function(pgOptions){
			var fixedPgOptions = this.pgOptions;
			if(_.isObject(pgOptions)){
				fixedPgOptions = _.defaults(pgOptions, this.pgOptions);
			}
			this.savedPgOptions = fixedPgOptions;
			this.pagination = this.$ul.pagination(fixedPgOptions);
			console.log(fixedPgOptions);
			return this;
		},

		onPageClick: function(pageNumber, itemsOnPage){
			this.trigger('onPageClick', pageNumber, itemsOnPage, this);
		},

		_eof: 'end of Ana.PaginationView//'
	});

	// 「他分析へ」の View クラス
	// model: {
	//    title: 'タイトル',
	//    collection: コレクション配列 ・・・gsan_ap_anaproc_init の応答 ana_func_list を渡す,
	//    template: <LI>タグを生成するためのコレクション要素のテンプレート
	// }
	Ana.DropupNaviView = Backbone.View.extend({
		tagName: 'p',
		className: 'flleft btn-group dropup',
		templateBTN: _.template('<a class="btn select dropdown-toggle clearfix scroll_flg" data-toggle="dropdown" data-intro="分析条件や、選択した会員を引き継ぎ、他の分析画面を起動します。" data-step="1030" data-position="top"><%- title %><span class="caret"></span></a>'),
		templateUL: _.template('<ul class="dropdown-menu"></ul>'),
		//templateLI: _.template('<li><a><%- func_name %></a></li>'),
		events: {
			'click ul li a'		: 'onClickMenuItem'
		},
		initialize: function(opt){
			_.bindAll();

			// model.collection 各要素におけ通知る <li> タグ生成用テンプレート
			this.templateLI = _.template(this.model.template);
		},
		render: function(){
			// タイトルボタン部を生成
			this.$el.html(this.templateBTN(this.model));

			// リスト部を生成
			var $ul = $(this.templateUL());
			for(var i = 0; i < this.model.collection.length; i++){
				var item = this.model.collection[i];
				var $li = $(this.templateLI(item)).data(item);
				$ul.append($li);
			}
			this.$el.append($ul);
			if(_.isEmpty(this.model.collection)){
				// メニューアイテムが無いので隠す。
				this.$el.hide();
			}

			return this;
		},
		onClickMenuItem: function(e){
			var $li = $(e.target).parent();
			var dto = $li.data();

			// イベント発火
			this.trigger('onItemSelected', dto);
		}
	});
	// ナビメニュー
	Ana.FooterNaviItemView = Backbone.View.extend({
		tagName: 'p',
		className: 'flright', //'flleft',
		template: _.template('<a style="width: 100%;"><%- title %></a>'),
		events: {
			'click a'		: 'onClickNaviItem'
		},
		initialize: function(opt){
			_.bindAll();
			if(opt && opt.className){
				this.className = opt.className;
			}
		},
		render: function(){
			this.$el.html(this.template(this.model));
			return this;
		},
		onClickNaviItem: function(e){
			// イベント発火
			this.trigger('onNaviItemClicked', e, this);
		},
		show: function(){
			this.$el.show();
		},
		hide: function(){
			this.$el.hide();
		},
		setVisible: function(visible){
			if(visible){
				this.show();
			}else{
				this.hide();
			}
		}
	});

	/**
	 * 分析結果ビューコンテナビュー
	 * ※内部要素 $el 内に特定の #id 値を割り振らないといけないことに注意。
	 * $el は $('#ca_result') に相当することを想定。
	 */
	Ana.ResultContainerView = Backbone.View.extend({
//		el: $('#ca_result'),

		events: {
			// コピーモード on/off
			'click .copymodeControl button'		: 'onCopymodeCtrlClick',
//			'click #ca_btn_savelist'			: 'onSaveListClick',
			'click #ca_btn_dummylist'			: 'onCustListDetailClick',
			'click #ca_btn_csv'					: 'onCSVClick',
			'click #ca_btn_xls'					: 'onEXCELClick'
		},

		initialize: function(opt){
			if(!opt.anaProc){
				throw new Exception('anaProc がありません。');
			}
			_.extend(this, opt);
			_.bindAll(this);

			// エラーメッセージ
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback')
			});

			// リストに登録ナビメニューアイテム
			this.navSaveListItemView = new AnaNaviItemView({
				// <p class="flleft"><a id="ca_btn_savelist">リストに登録</a></p>
				el: this.$('#ca_btn_savelist').parent().get(0)
			}).on('onNaviItemClick', this.onSaveListClick);
			// if(!Ana.Config.nav.supportSaveList){
			// 	// 「リストに登録」サポート外
			// 	this.navSaveListItemView.$el.hide();
			// }

			// 結果表示データグリッド
			var opt2 = _.omit(opt, 'el', '$el');
			var $rgvEl = this.$('#ca_resultView > #ca_anagridview');
			this.anaResultDataGridView = new Ana.ResultDataGridView(_.extend({el: $rgvEl}, opt2));

			// コピー用データグリッド
			var $cpyEl = this.$('#ca_copyView > #ca_copygridview');
			this.anaResultCopyGridView = new Ana.ResultCopyGridView(_.extend({el: $cpyEl}, opt2));

			// 顧客リスト登録
			this.MDCMV1300Selector = new MDCMV1300SelectorView({
				el				: $('#ca_MDCMV1300_dialog'),	// 配置場所
				$parentView		: this.$el,
				isAnalyse_mode	: true,		// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
//				select_mode		: clutil.cl_single_select	// 複数選択モード
			});

			// ページャ
			var pgOptions = _.isNumber(opt.anaProc.pageSize) ? { itemsOnPage: opt.anaProc.pageSize } : null;
			this.pgView = new Ana.PaginationView({
				$el: this.$('#ca_result_pager1'),
				pgOptions: pgOptions
			}).on('onPageClick', this.onPageClick);

			// 他分析へ
			this.nextAnaDropupNaviView = new Ana.DropupNaviView({
				model: {
					title: '他分析へ',
					collection: opt.anaProc.gsan_ap_anaproc.ana_func_list,
					template: '<li><a><%- func_name %></a></li>'
				}
			}).on('onItemSelected', this.onNextAnalizeSelected);

			// 地図連携
			this.mapNaviItemView = new Ana.FooterNaviItemView({
				model: {title: '地図連携'},
				className: 'flright'
			}).on('onNaviItemClicked', this.mapNaviItemClicked);

			// 分析正常終了時のコールバック設定。ページャのナンバリングを振り直すため。
			opt.anaProc.on('onSearchCompleted', this.onSearchCompleted);

			// エラーメッセージの通知の仕組みを設定
			opt.anaProc.on('onBroadcast', this.onReceiveNotify);

			// タイトルの設定
			if(_.isString(opt.anaProc.anamenuitem_name) && !_.isEmpty(opt.anaProc.anamenuitem_name)){
				this.$('#title > h2').text(opt.anaProc.anamenuitem_name);
			}


//			// リストに登録
//			var $ca_MDCMV1300_dialog = $('#ca_MDCMV1300_dialog.cl_dialog');
//			if(!$('#ca_MDCMV1300_dialog.cl_dialog')[0]){
//				// 要素を足す。
//				$ca_MDCMV1300_dialog = $('.cl_dialog:last').after('<div id="ca_MDCMV1300_dialog" class="cl_dialog"></div>').next();
//			}

//			this.$('#content').exResize({
//				contentsWatch: true,
//				callback: this.onContentResize
//			});

			// ウィンドウサイズ変化を監視する
			var timer = false;
			$(window).resize(_.bind(function(){
				if(this.isCondPainActive){
					// 条件ペインが Active の場合は無視。
					return;
				}
				if(timer !== false){
					clearTimeout(timer);
				}
				timer = setTimeout(_.bind(function(){
					//console.log('リサイズ発火する');
					if(this.isCopymode()){
						this.anaResultCopyGridView.setPreferredSize();	// コピーViewリサイズ
					}else{
						this.anaResultDataGridView.setPreferredSize();	// 結果Viewリサイズ
					}
				}, this), 200);
			}, this));

			// 条件ナビが開いたイベントを捕捉
			clutil.AnaNaviItemNotifier.on('onNaviPaneOpened', _.bind(function(notifier, ev){
				if(notifier.isNaviContentActive()){
					// 他の条件設定 Pane が Active で、分析結果 Pane は hide な状態。
					return;
				}
				//console.log('onNaviPaneOpened: リサイズ発火する');
				if(this.isCopymode()){
					this.anaResultCopyGridView.setPreferredSize();	// コピーViewリサイズ
				}else{
					this.anaResultDataGridView.setPreferredSize();	// 結果Viewリサイズ
				}
			}, this));
			// 条件ナビが閉じたイベントを捕捉
			clutil.AnaNaviItemNotifier.on('onNaviPaneClosed', _.bind(function(notifier, ev){
				if(notifier.isNaviContentActive()){
					// 他の条件設定 Pane が Active で、分析結果 Pane は hide な状態。
					return;
				}
				// console.log('onNaviPaneClosed: リサイズ発火する');
				if(this.isCopymode()){
					this.anaResultCopyGridView.setPreferredSize();	// コピーViewリサイズ
				}else{
					this.anaResultDataGridView.setPreferredSize();	// 結果Viewリサイズ
				}
			}, this));
			// 個別条件ペインが右側に展開したイベントを捕捉
			clutil.AnaNaviItemNotifier.on('onNaviItemActived', _.bind(function(){
				console.log('onNaviItemActived');
				console.log(arguments);
				this.isCondPainActive = true;
				if(this.isCopymode()){
					this.anaResultCopyGridView.onPause();	// コピーView休止
				}else{
					this.anaResultDataGridView.onPause();	// 結果View休止
				}
			}, this));
			// 個別条件ペインが閉じて、結果ペインが表示される契機を捕捉
			clutil.AnaNaviItemNotifier.on('onNaviItemUnActived', _.bind(function(){
				console.log('onNaviItemUnActived');
				console.log(arguments);
				this.isCondPainActive = false;
				if(this.isCopymode()){
					this.anaResultCopyGridView.onResume();	// コピーView再開
				}else{
					this.anaResultDataGridView.onResume();	// 結果View再開
				}
			}, this));
		},

		render: function(){
			this.anaResultCopyGridView.render();
			this.anaResultDataGridView.render();
			this.pgView.render();
			// 会員情報紹介ボタン -- 権限制御
			if(!this.anaProc.anadata.f_memblist){
				this.$('#ca_btn_dummylist').parent().remove();
			}
			// 次分析
			this.$('#ca_btn_nextanalize_wrap')
				.after(this.nextAnaDropupNaviView.render().$el)
				.hide();
			// マップ連携
			//this.nextAnaDropupNaviView.$el.after(this.mapNaviItemView.render().$el.hide());
			this.$('#mainColumnFooter')
				.append(this.mapNaviItemView.render().$el.hide());
			this.MDCMV1300Selector.render();
			return this;
		},

//		// div#content 要素のサイズ変更を検出する
//		onContentResize: function(){
//			console.log('onContentResize called.');
//		},

		// コピーモードボタンクリック
		onCopymodeCtrlClick: function(e){
			var $target = $(e.target);
			var resumeView;
			if($target.data('toggle')){
				// コピーモード中 → 結果表示へ
				$target.data('toggle', false).text('コピーモードを開始');
				this.anaResultCopyGridView.onPause();	// コピーViewは休止
				resumeView = this.anaResultDataGridView;
			}else{
				// 結果表示中 → コピーモードへ
				$target.data('toggle', true).text('コピーモードを終了');
				this.anaResultDataGridView.onPause();	// 結果Viewは休止
				resumeView = this.anaResultCopyGridView;
				resumeView.setData(this.anaResultDataGridView.ctx);
			}
			this.$('#mainColumnFooter').toggle();
			this.$('#ca_resultView').toggle();
			this.$('#ca_copyView').toggle();
			resumeView.onResume();						// 結果View or コピーView → 再開
		},

		// リストに登録ボタンクリック
		onSaveListClick: function(e){
			if(!this.anaProc){
				return;
			}
			if(!this.anaProc.hasResultData()){
				this.validator.setErrorInfo({_eb_: '分析データがありません。分析実行後にリストに登録をしてください。'});
				return;
			}

			e.srcBackboneView.setActive();

			// リストの種類
			// 1. 会員リスト		★ひとまず会員リストだけ
			// 2. 店舗リスト
			// 3. 商品リスト
			// 4. 住所リスト

			// リスト名とか公開範囲の入力フォーム画面（MDCMV1300）を開いて処理を引き渡す。
			// リスト登録画面を表示
			this.anaProc.cellSelectReq = this.anaResultDataGridView.buildCellSelectReq();
			this.MDCMV1300Selector.show(null, this.anaProc);
    		// サブ画面復帰後処理
           	this.MDCMV1300Selector.okProc = function(data) {
    			// ボタンにフォーカスする
    			$(e.target).focus();
				e.srcBackboneView.unsetActive();
    		}
		},

		// 対象会員明細照会ボタンクリック
		onCustListDetailClick: function(e){
			if(!this.anaProc){
				return;
			}
			if(!this.anaProc.hasResultData()){
				this.validator.setErrorInfo({_eb_: '分析データがありません。分析実行後に対象会員明細照会をしてください。'});
				return;
			}

			// セル選択条件
			var cellSelectReq = this.anaResultDataGridView.buildCellSelectReq();

			// 匿名顧客リストの作成を依頼する。
			var deferd = this.anaProc.doCreateAnonymousCustList(cellSelectReq);
			deferd.done(_.bind(function(data){
				// 顧客リスト作成が成功。data.body の中に生成した顧客リスト情報が入っている。
				console.log(data);

				var memblist = (data && data.memblist) ? data.memblist : null;
				if(memblist && memblist.elem_num > 0){
					// 会員リストの絞込条件を入れるよ！
					var nextArgs = {
						name: this.anaProc.anamenuitem_name + ': 対象人数[' + memblist.elem_num + ']',
						id: memblist.id
					};

					// 別窓で照会画面を起動
					clcom.pushPage({
						url: clcom.appRoot + '/' + 'CAINV0030/CAINV0030.html',
						args: nextArgs,
						newWindow: '_blank'
					});
				}else{
					this.validator.setErrorInfo({_eb_: '対象会員が０人です。'});
				}
			}, this));
			deferd.fail(_.bind(function(data){
				// clutil.postAnaJSON の内部の作りから、data.head.status を見て
				// STATUS_OK 以外の場合のみ、fail が呼ばれる。
				if(_.isObject(data.head) && _.isNumber(data.head.status)
						&& data.head.status !== am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK){
					console.log('anaProc.doCreateAnonymousCustList(), status[' + data.head.status + '] failed[' + data.head.message + '] ###');
					this.validator.setErrorInfo({_eb_:clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}
			}, this));
		},

		// ページャ番号クリック
		onPageClick: function(pageNumber, itemsOnPage, pgView){
			console.log('ページャ番号クリック: pageNumber[' + pageNumber + '] itemsOnPage[' + itemsOnPage + ']');
			if(!this.anaProc){
				return;
			}
			if(!this.anaProc.hasResultData()){
				this.validator.setErrorInfo({_eb_: '出力データがありません。'});
				return;
			}

			// ページ指定のリクエストを投げる。
			var deferred = this.anaProc.doSearchByPage(pageNumber, itemsOnPage);
			deferred.done(_.bind(function(data){
				// 分析正常終了を通知しないと、結果表示DataGridViewへ結果データが注入されない。
				this.anaProc.trigger('onSearchCompleted', this.anaProc);
			}, this));
			deferred.fail(_.bind(function(data){
//				this.onSearchCompleted(this.anaProc);
				this.validator.setErrorInfo({_eb_:clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
			}, this));
		},

		// 他分析のアイテムが選択された
		onNextAnalizeSelected: function(nextAnaDto){
			console.log('次分析（' + nextAnaDto.func_name + '）が選択されました');

			if(!this.anaProc){
				return;
			}
			if(!this.anaProc.hasResultData()){
				this.validator.setErrorInfo({_eb_: '分析データがありません。分析実行後に他分析を選択してください。'});
				return;
			}

			// 画面遷移パラメタ
			var nextPageURL =  clcom.appRoot
					+ '/' + nextAnaDto.func_cd.substring(0,4)
					+ '/' + nextAnaDto.func_cd
					+ '/' + nextAnaDto.func_cd + '.html';
			// 顧客ABC分析に遷移する場合はURLの設定を上書き
			if (nextAnaDto.func_cd == 'CAANV0020') {
				var $cust_url = clcom.getSysparam('PAR_AMGA_CUST_ANA_URL').split("/");
				var $cust_url2 = $cust_url[$cust_url.length - 2];
				nextPageURL = 'http://' + $cust_url2
						+ '/' + 'system/app'
						+ '/' + nextAnaDto.func_cd
						+ '/' + nextAnaDto.func_cd + '.html';
			}
			var nextPageArgs = {
				func_id			: nextAnaDto.func_id,
				func_code		: nextAnaDto.func_cd,
				f_anakind		: nextAnaDto.f_anakind,
				anamenuitem_name: nextAnaDto.func_name
			};
			var isSamePage = (clcom.pageId == nextAnaDto.func_cd);

			// セル選択条件
			var cellSelectReq = this.anaResultDataGridView.buildCellSelectReq();

			// 匿名顧客リストの作成を依頼する。
			var deferd = this.anaProc.doCreateAnonymousCustList(cellSelectReq);
			deferd.done(_.bind(function(data){
				// 顧客リスト作成が成功。data.body の中に生成した顧客リスト情報が入っている。
				//data.memblist = {
				//	id: 会員リストid,
				//	elem_num: 構成会員数
				//}
				console.log(data);

				var memblistFocusDto = undefined;
				var memblist = (data && data.memblist) ? data.memblist : null;
				if(memblist && memblist.elem_num > 0){
					// 会員リストの絞込条件を入れるよ！
					memblistFocusDto = {
						kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_MEMBLIST,	// 803
						name: this.anaProc.anamenuitem_name + ': 対象人数[' + memblist.elem_num + ']',
						val: memblist.id
					};
//				}else{
//					this.validator.setErrorInfo({_eb_: '対象会員が０人のため、' + nextPageArgs.anamenuitem_name + 'の起動を中断しました。'});
//					return;
				}

				// 画面遷移
				// 引継条件は、期間、絞り込み条件、会員リスト
				nextPageArgs.prevAnaCond = {
					memblistFocusDto	: memblistFocusDto,
					focusList1			: this.anaProc.getFocus1(),
					focusList2			: this.anaProc.getFocus2(),
					anaPeriods			: this.anaProc.cond.anaPeriods,
					mstsrchdate			: this.anaProc.cond.mstsrchdate,
					anabuyingcond		: this.anaProc.cond.anabuyingcond
				};
//				clcom.pushPage(nextPageURL, nextPageArgs, null, null, true);
//				if(isSamePage){
//					// 遷移先が同一なら、強制リロードさせる。
//					window.location.reload();
//				}
				// 別窓で起動
				if (nextAnaDto.func_cd == 'CAANV0020') {
					// 顧客ABCに遷移時はURLのパラメータに条件を載せる
					var nextPageURL2 = nextPageURL + '?' + $.param(nextPageArgs.prevAnaCond);
					clcom.pushPage({
						url: nextPageURL2,
						newWindow: '_blank'
					});

				} else {
					clcom.pushPage({
						url: nextPageURL,
						args: nextPageArgs,
						newWindow: '_blank'
					});
				}
			}, this));
			deferd.fail(_.bind(function(data){
				// clutil.postAnaJSON の内部の作りから、data.head.status を見て
				// STATUS_OK 以外の場合のみ、fail が呼ばれる。
				if(_.isObject(data.head) && _.isNumber(data.head.status)
						&& data.head.status !== am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK){
					console.log('anaProc.doCreateAnonymousCustList(), status[' + data.head.status + '] failed[' + data.head.message + '] ###');
					this.validator.setErrorInfo({_eb_:clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}
			}, this));
		},
		// 地図連携ボタンがクリックされた
		mapNaviItemClicked: function(e, view){
			console.log('地図連携がクリックされました');

			if(!this.anaProc){
				return;
			}
			if(!this.anaProc.hasResultData()){
				this.validator.setErrorInfo({_eb_: '分析データがありません。縦軸＝住所を選び、分析実行後に地図連携を実行してください。'});
				return;
			}

			// セル選択条件
			var cellSelectReq = this.anaResultDataGridView.buildCellSelectReq();

			var deferd = this.anaProc.getMAPDATURI(cellSelectReq);
			deferd.done(_.bind(function(data){
				if(_.isEmpty(data.url)){
					console.warn('DL 先の url が無い！');
					this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
				}else{
					clutil.download(data.url);
				}
			}, this));
			deferd.fail(_.bind(function(data){
				// clutil.postAnaJSON の内部の作りから、data.head.status を見て
				// STATUS_OK 以外の場合のみ、fail が呼ばれる。
				if(_.isObject(data.head) && _.isNumber(data.head.status)
						&& data.head.status !== am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK){
					console.log('anaProc.doCSVDL(), status[' + data.head.status + '] failed[' + data.head.message + '] ###');
					this.validator.setErrorInfo({_eb_:clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}
			}, this));
		},

		// 左側「この条件で分析」ボタンからの分析が正常終了したら呼び出される。
		onSearchCompleted: function(anaProc){
			if(anaProc && anaProc.savedReq && anaProc.savedResult){
				// ページャ部品の更新
				if(anaProc.savedResult.pageRsp){
					var pgrsp = anaProc.savedResult.pageRsp;
					var pgopt = {
						items: pgrsp.totalRecord,
						itemsOnPage: pgrsp.pageSize,
						currentPage: Math.floor((pgrsp.currentRecord + pgrsp.pageSize) / pgrsp.pageSize)
					};
//					items: 0,
//					itemsOnPage: 100,
//					currentPage: 1,
					this.pgView.setPage(pgopt);
				}

				// 地図連携
				// １軸かつ縦軸リーフの軸種別が地図系の場合に、［地図連携］ボタンを涌かす。
				var isMapServiceAvailable = function(anaProc){
					if(!anaProc.savedReq){
						// 保存している分析条件が無い
						return false;
					}
					var req = anaProc.savedReq;
					if(_.isArray(req.anaHAxis) && !_.isEmpty(req.anaHAxis)){
						// 横軸付き
						return false;
					}
					var lastVAxis = _.last(req.anaVAxis);
					return (lastVAxis && lastVAxis.kind === amgbp_AnaDefs.AMGBA_DEFS_KIND_ADDR);
				}(anaProc);
				this.mapNaviItemView.setVisible(isMapServiceAvailable);
			}
		},

		// エラーメッセージ通知を受信した。
		onReceiveNotify: function(msg){
			var textMsg = msg;
			if(_.isObject(msg) && _.isObject(msg.head) && msg.head.message){
				textMsg = clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args);
			}else if(!_.isString(msg)){
				textMsg = msg.toString();
			}
			this.validator.setErrorInfo({_eb_:textMsg});
		},

		// CSV ボタンクリック
		onCSVClick: function(e){
			if(!this.anaProc){
				return;
			}
			// #20150516 いきなりCSVボタンを押せても良いだろう
			//if(!this.anaProc.hasResultData()){
			//	this.validator.setErrorInfo({_eb_: '出力データがありません。分析を実行をしてからCSV出力を行ってください。'});
			//	return;
			//}
			var deferd = this.anaProc.getCSVDLURI();
			deferd.done(_.bind(function(data){
				if(_.isEmpty(data.url)){
					console.warn('DL 先の url が無い！');
					this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
				}else{
					clutil.download(data.url);
				}
			}, this));
			deferd.fail(_.bind(function(data){
				// clutil.postAnaJSON の内部の作りから、data.head.status を見て
				// STATUS_OK 以外の場合のみ、fail が呼ばれる。
				if(_.isObject(data.head) && _.isNumber(data.head.status)
						&& data.head.status !== am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK){
					console.log('anaProc.doCSVDL(), status[' + data.head.status + '] failed[' + data.head.message + '] ###');
					this.validator.setErrorInfo({_eb_:clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}
			}, this));
		},

		// EXCEL ボタンクリック
		onEXCELClick: function(e){
			if(!this.anaProc){
				return;
			}
			// #20150516 いきなりXLS出力を押せても良いだろう
			//if(!this.anaProc.hasResultData()){
			//	this.validator.setErrorInfo({_eb_: '出力データがありません。分析を実行をしてからXLS出力を行ってください。'});
			//	return;
			//}
			var deferd = this.anaProc.doEXCELDURI();
			deferd.done(_.bind(function(data){
				if(_.isEmpty(data.url)){
					console.warn('DL 先の url が無い！');
					this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
				}else{
					clutil.download(data.url);
				}
			}, this));
			deferd.fail(_.bind(function(data){
				// clutil.postAnaJSON の内部の作りから、data.head.status を見て
				// STATUS_OK 以外の場合のみ、fail が呼ばれる。
				if(_.isObject(data.head) && _.isNumber(data.head.status)
						&& data.head.status !== am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK){
					console.log("anaProc.doEXCELDL(), status[ " + data.head.status + '] failed[' + data.head.message + '] ###');
					this.validator.setErrorInfo({_eb_:clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}
			}, this));
		},

		/**
		 * コピーモード or 結果表示モードを検査する。
		 * true:コピー、false:結果表示
		 */
		isCopymode: function(){
			return this.$('.copymodeControl button').data('toggle');
		},
		/**
		 * コピー表示に切り替える --> コピーモードトグルにクリックイベントを発信する
		 */
		showCopyView: function(){
			if(this.isCopymode()){
				return;
			}
			this.$('.copymodeControl button').click();		// 処理をクリックイベントのハンドリングへ投げる
		},
		/**
		 * 結果表示に切り替える --> コピーモードトグルにクリックイベントを発信する
		 */
		showResultView: function(){
			if(this.isCopymode()){
				this.$('.copymodeControl button').click();	// 処理をクリックイベントのハンドリングへ投げる
				return;
			}
		},

		_eof: 'end of Ana.ResultContainerView //'
	});

	/**
	 * 分析結果グリッドビュー
	 */
	Ana.ResultDataGridView = Backbone.View.extend({
		anaProc: null,	// コンストラクタの opt={anaProc: anaProc} 引数で設定されることを想定。

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			// <body> の直下に <div> エレメントを作ってしまおう。
			this.contextMenuView = new Ana.ContextMenuView({
				id: 'contextmenu',
				className: 'anagridview-contextmenu',
				onMenuItemSelected: this._onContextMenuItemSelected,
				menuItems: [
					Ana.Const.sortOrder.asc,
					Ana.Const.sortOrder.dsc
				]
			});
			$('body').prepend(this.contextMenuView.render().$el);

			if(!this.anaProc){
				throw "コンストラクタ使用誤り：Ana.Proc が設定されていない！";
			}
		},

		/**
		 * 分析条件の縦軸最後の要素を取る。
		 */
		getVLastAxis: function(){
			var vAxList = this.anaProc.savedCond.vAxisList;
			var vAxLast = _.last(vAxLast);
			return vAxLast;
		},

		// カラムヘッダ用のセルフォーマッター（セルレンダラみたいなもの）
		// 縦軸がツリー構造の場合、ドリルダウンボタン[+] or [-]を載せるための関数。
		RowHeadCellFormatter: function(rowIndex, cell, value, columnDef, aRow){
			// 0) テキスト value 値をエスケープする。例えば & → &amp;, < → &lt;, > → &gt;
//			value = value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
			value = _.escape(value);

			// 1) ドリルダウンに関係しないものをふるい落とす。
			// 1-1) 表示項目ラベル列の場合は階層記述不要
			//      このフィルタによって、表示項目たての場合の表示項目ラベルセルが弾かれる。
			//      すなわち、columnIndex === 0 以外はふるい落とす。
			if(columnDef.isHierarchical != true){
				return value;
			}

			// 1-2) 行データが無い ⇔ 縦軸要素じゃない ⇔ 固定行の場合は、装飾の必要なし。
			var vLeaf = aRow.vLeaf;
			if(rowIndex < this.ctx.frozenRowCount /* || _.isNullOrUndefined(vLeaf) */){
				// 縦軸要素のものじゃない。
				return value;
			}
			// 1-3) 表示項目が縦軸についている場合に、軸要素内の初めての表示項目行に相当するかどうか？
			//   +----------------------------
			// 0 | frozenRow ・・・・・・
			//   +----------------------------
			// 1 | vAxis-0         | Item-1		★
			//   +                 ------------
			// 2 |                 | Item-2		//ドリルダウンボタン不要
			//   +----------------------------
			// 3 | vAxis-1         | Item-1		★
			//   +                 ------------
			// 4 |                 | Item-2		//ドリルダウンボタン不要
			//   +----------------------------
			if(aRow.dLeaf){
				// 表示項目並び ＝ たて
				var x = (rowIndex - this.ctx.frozenRowCount) % this.ctx.dispLeafArray.length;
				if(x !== 0){
					return value;			// ★位置にない ⇒ ドリルダウンボタン不要
				}
			}

			// 1-3) ソート条件を持っている場合はドリルダウン操作をさせない。
			//      なぜならば、ツリー構成に無いから。
			if(this.ctx.sortCond){
				return value;
			}

			// 2) セル内部コンテントをつくる。
			// 2-1) 階層記述のためにインデント用空白幅を算出する。階層Lvが１段ずつ深くなるほど1段下げる
			//    ただし、直近の親ノードが TYPE_DATA の場合はインデントを切り詰める。
			var indentNode = vLeaf;
			while(!indentNode.parent.isRoot()){
				var pnode = indentNode.parent;
				var pdata = pnode.data;
				if(pdata.type !== amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_DATA){
					break;
				}
				indentNode = pnode;
			}
			var indent = indentNode.getLevel() - 1;
			var spacer = "<span style='display:inline-block;height:1px;width:" + (15 * indent) + "px'></span>";

			var cellContent;
			if(_.isUndefined(vLeaf._collapsed)){
				// 最下層ノードでこれ以上ドリルダウンしない ⇒ インデントだけ揃える。
				//// class名"toggle"で判断しているようなので使わないようにする #20150104 OTK
				////cellContent = spacer + " <span class='toggle'></span>&nbsp;" + value;
				cellContent = spacer + " <span>&nbsp;&nbsp;</span>&nbsp;" + value;
			}else{
				// ドリルダウンボタンを配置する
				if(vLeaf._collapsed){
					// [+] : 閉じている状態
					cellContent = spacer + " <span class='toggle expand'></span>&nbsp;" + value;
				}else{
					// [-] ：開いている状態
					cellContent = spacer + " <span class='toggle collapse'></span>&nbsp;" + value;
				}
			}
			return cellContent;
		},
		// セルデータ用のセルフォーマッター（セルレンダラみたいなもの）
		CellRenderFormatter: function(rowIndex, cell, value, columnDef, aRow){
			// 0) テキスト value 値をエスケープする。
			value = _.escape(value);

			// 表頭において、ソート条件がある場合は▲▼マーキングのクラスをつける。
			if(rowIndex < this.ctx.frozenRowCount && cell >= this.ctx.frozenColCount && this.ctx.sortCond){
				// □■ 右上：表頭 /////////////////////////////////////////////////
				// □□ かつ、ソート条件をもっている場合
				var dLeaf = columnDef.dLeaf;
				var hLeaf = columnDef.hLeaf;
				var isSortMarkingCell = false;
				if(dLeaf && _.isNullOrUndefined(hLeaf) && rowIndex === this.ctx.frozenRowCount-1){
					// １軸
					isSortMarkingCell = (dLeaf === this.ctx.sortCond.dLeaf);
				} else if(hLeaf){
					if(dLeaf){
						// ２軸で表示項目並び＝よこ
						isSortMarkingCell = (rowIndex === this.ctx.frozenRowCount-1
								&& hLeaf === this.ctx.sortCond.hLeaf
								&& dLeaf === this.ctx.sortCond.dLeaf);
					}else{
						// ２軸で表示項目並び＝たて
						isSortMarkingCell = (rowIndex === hLeaf.level-1
								&& hLeaf === this.ctx.sortCond.hLeaf);
					}
				}
				if(isSortMarkingCell){
					// ソート対象になった表示項目 -- 後ろに▲▼マーキングのための <span> タグを付加する
					return value + '<span></span>';
				}
			}

			return value;
		},
		// Slickgrid 独自拡張 - 現在描画しようとするセルを装飾するための css クラスを返す。
		// rowspan 機能が無いので、下部ボーダーを無くした css のクラスをあてがうのが本メソッドの目的。
		// slick-anagridview-theme.css にて、クラス glue で下部ボーダー none を定義。
		CellCssDecorator: function(rowIndex, colIndex, colspan, colDef, rowData){
			if(rowIndex < this.ctx.frozenRowCount){
				if(colIndex < this.ctx.frozenColCount){
					// ■□ 左上：コーナー /////////////////////////////////////////////
					// □□
					return (rowIndex < this.ctx.frozenRowCount -1) ? 'cell-title glue' : 'cell-title';
				}else{
					// □■ 右上：表頭 /////////////////////////////////////////////////
					// □□
					// 合計 or 小計のときに下線ボーダーを消す。
					var vAxAttr = colDef.attr;
					var hNode = colDef.hLeaf;
					var dNode = colDef.dLeaf;
					if(vAxAttr != null){
						// 縦軸属性(マスタ)のタイトル表示部
						return (rowIndex < this.ctx.frozenRowCount -1) ? 'cell-title glue' : 'cell-title displf';
					}
					if(_.isNullOrUndefined(hNode)){
						// １軸
						if(rowIndex === this.ctx.frozenRowCount-1
								&& this.ctx.sortCond && this.ctx.sortCond.dLeaf === dNode){
							// ソート条件つきの▲▼マーキングのためのクラスを付加する。
							return 'cell-title ' + this.ctx.sortCond.sortOrder.className;
						}
						return 'cell-title';
					}

					// ２軸
					var sortClass = null;
					if(this.ctx.sortCond){
						if(dNode){
							// 表示項目並び＝よこ
							if(hNode === this.ctx.sortCond.hLeaf && dNode === this.ctx.sortCond.dLeaf && rowIndex === this.ctx.frozenRowCount-1){
								sortClass = ' ' + this.ctx.sortCond.sortOrder.className;
							}
						}else{
							if(hNode === this.ctx.sortCond.hLeaf && rowIndex === hNode.level-1){
								sortClass = ' ' + this.ctx.sortCond.sortOrder.className;
							}
						}
					}
					var cellClass = 'cell-title';
					switch(hNode.data.type){
					case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_SUBTOTAL:
						if (this.ctx.dispopt.disp_way != amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_H_DIAGG) {
							if(rowIndex > hNode.level-1 && rowIndex < this.ctx.hAxisMaxLevel-1){
								// 条件 (rowIndex > hNode.level-1) は、１段下から「小計」ラベルだから。
								cellClass = 'cell-title glue';
							}
						} else {
							if(rowIndex > hNode.level && rowIndex < this.ctx.hAxisMaxLevel){
								// 条件 (rowIndex > hNode.level-1) は、１段下から「小計」ラベルだから。
								cellClass = 'cell-title glue';
							}
						}
						break;
					case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_TOTAL:
						if (this.ctx.dispopt.disp_way != amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_H_DIAGG) {
							if(rowIndex >= hNode.level-1 && rowIndex < this.ctx.hAxisMaxLevel-1){
								// 条件 (rowIndex >= hNode.level-1) は、自身が「合計」ラベルだから。
								cellClass = 'cell-title glue';
							}
						} else {
							if(rowIndex >= hNode.level && rowIndex < this.ctx.hAxisMaxLevel){
								// 条件 (rowIndex >= hNode.level-1) は、自身が「合計」ラベルだから。
								cellClass = 'cell-title glue';
							}
						}
						break;
					}
					return (sortClass) ? cellClass + sortClass : cellClass;
				}
			}else{
				if(colIndex < this.ctx.frozenColCount){
					// □□
					// ■□ 左下：表側 /////////////////////////////////////////////////
					var nextRowData = this.slickDataView.getItem(rowIndex+1);
					if(_.isUndefined(nextRowData)){
						// 現在の行 Last 要素なので、下ボーダーはそのまま。
						return null;
					}

					/*
					 * TODO colIndexの判定を0,1ではなくやらないと駄目
					 */
					if (colIndex == 0) {
						// 縦軸ツリー部
						var vNode = rowData.vLeaf;
						var nextVNode = nextRowData.vLeaf;
						if(vNode === nextVNode){
							// ひとつ下が同一ノードなら、下ボーダーを消す。
							return 'glue';
						}
					} else if ((colIndex+1) == this.ctx.frozenColCount) {
						// 表示項目
						if(this.ctx.dispMaxLevel >= 2){
							// 表示項目＝(縦並び) で、対比項目がある場合の表示項目列
							var dNode = rowData.dLeaf;
							var nextDNode = nextRowData.dLeaf;
							if(dNode.findParentByLevel(1) === nextDNode.findParentByLevel(1)){
								// ひとつ下が同一ノードなら、下ボーダーを消す。
								return 'glue';
							}
						}
					} else {
						// 軸属性表示項目
						var vNode = rowData.vLeaf;
						var nextVNode = nextRowData.vLeaf;
						if(vNode === nextVNode){
							// ひとつ下が同一ノードなら、下ボーダーを消す。
							return 'glue';
						}
					}
//					switch(colIndex){
//					case 0:		// 縦軸ツリー部
//						var vNode = rowData.vLeaf;
//						var nextVNode = nextRowData.vLeaf;
//						if(vNode === nextVNode){
//							// ひとつ下が同一ノードなら、下ボーダーを消す。
//							return 'glue';
//						}
//						break;
//					case 1:		// 表示項目
//						if(this.ctx.dispMaxLevel >= 2){
//							// 表示項目＝(縦並び) で、対比項目がある場合の表示項目列
//							var dNode = rowData.dLeaf;
//							var nextDNode = nextRowData.dLeaf;
//							if(dNode.findParentByLevel(1) === nextDNode.findParentByLevel(1)){
//								// ひとつ下が同一ノードなら、下ボーダーを消す。
//								return 'glue';
//							}
//						}
//						break;
//					}
					return null;
				}else{
					// □□
					// □■ 右下:セル //////////////////////////////////////////////////
					// セル選択用の CSS を設定するところ
					// ドリルダウン要素のセルは、初期リーフノードの選択状態を受け継ぐものとするので、
					// vLeaf, hLeaf は findIniLeaf() 関数で親ノードを遡っている。
					var vLeaf = rowData.vLeaf;
					var vIniLeaf = vLeaf.findIniLeaf();
					var vid = vIniLeaf.data.id;

					// 縦軸属性(マスタ項目)
					if(colDef.attr){
						var align = Ana.Util.cellTextAlignment(colDef.attr);
						var css = (align == 'left' /* css: default align */) ? 'left' : 'align-' + align;

						var nextRowData = this.slickDataView.getItem(rowIndex+1);
						if (nextRowData != null) {
							var vNode = rowData.vLeaf;
							var nextVNode = nextRowData.vLeaf;
							if(vNode === nextVNode){
								// ひとつ下が同一ノードなら、下ボーダーを消す。
								css = css + ' glue';
							}
						} else {
							console.log('nextRowData is NULL!');
						}
						return css;
					}

					var hLeaf = colDef.hLeaf;
					var hid = (hLeaf && hLeaf.data) ? hLeaf.data.id : 0;

					var dLeaf = (colDef.dLeaf != null) ? colDef.dLeaf : rowData.dLeaf;
					var did = (dLeaf && dLeaf.data) ? dLeaf.data.id : 0;

					var clzzs = [];

					// セルの text-align
					var cell = this.ctx.cellMap.find(vid, hid, did);
					if(cell){
						var align = Ana.Util.cellTextAlignment(cell);
						if(!_.isEmpty(align)){
							clzzs.push(align);
						}
					}

					// セル選択マップを照会
					if(this.ctx.selectedCellSet.containsKey(vid,hid,0)){
						// セル選択中
						clzzs.push('cell-selected');
					}

        			// セル色
					if(rowData.color){
						var color = rowData.color[colDef.field];
						if(color != null){
							clzzs.push('cell-' + color);
						}
					  }

					return _.isEmpty(clzzs) ? null : clzzs.join(' ');
				}
			}
			return null;
		},

		// ツリー構築の補助関数群
		treeBuilder: {
			// id-TreeNode マップを作る関数。
			buildIdTreeNodeMap: function(rootNode, elemArray){
				var idmap = Ana.Util.idTreeNodeMap(elemArray);
				if(rootNode){
					idmap[rootNode.id] = rootNode;
				}
				return idmap;
			},
			// idMapからツリーデータ構造を作る
			buildTree: function(idmap){
				for(var k in idmap){
					var aNode = idmap[k];
					if(aNode.id == 0){
						// root
						continue;
					}
					var pNode = idmap[aNode.data.pid];
					if(pNode){
						pNode.appendChild(aNode);
					}else{
						console.warn('みなしごノード: ' + aNode);
					}
				}
			},
			// リーフノード配列の中から、最大Level(深さ)のノードを求める。
			// 兄弟ノードが複数ある場合は、最初に見つかる最大Levelノードオブジェクトを返す。
			findMaxLv: function(leafNodeArray){
				if(!_.isArray(leafNodeArray)){
					return 0;
				}
				var maxLvNode = null;
				var nArray = leafNodeArray.length;
				for(var i = 0; i < nArray; i++){
					var aNode = leafNodeArray[i];
					if(_.isNull(maxLvNode)){
						maxLvNode = aNode;
						continue;
					}
					if(maxLvNode.parent == aNode.parent){
						continue;
					}
					if(maxLvNode.level < aNode.level){
						maxLvNode = aNode;
					}
				}
				var maxlv = 0;
				if(!_.isNull(maxLvNode) && _.isNumber(maxLvNode.level)){
					maxlv = maxLvNode.level;
				}
				return maxlv;
			},
			// AnaAxisElem 配列の中から Id の最大値を求める
			findMaxId: function(axElems){
				if(!_.isArray(axElems) || _.isEmpty(axElems)){
					return 0;
				}
				// サーバから id 昇順で貰うので、最後の要素だけ。
				return _.last(axElems).id;
			},
			// 縦軸ツリーのドリルダウンボタン用に、折り畳みフラグを付ける。※[縦軸専用]
			// これは、一旦、リーフノード配列を作り切った後でないとできない処理。
			addCollapseFlag: function(anaProc, vAxLeafNodeArray){
				if(!_.isArray(vAxLeafNodeArray)){
					return vAxLeafNodeArray;
				}
				for(var i = 0; i < vAxLeafNodeArray.length; i++){
					var lfNode = vAxLeafNodeArray[i];
					var axElem = lfNode.data;
					if(axElem && axElem.kind > 0){
						// 条件から縦軸要素を取得・・・これは当該軸要素kind に対する func_id 値を取るために利用。
						// condAxElem が取れない場合は、木構造を成さない分析軸である。
						var condAxElem = anaProc.savedCond.axKindVAxisMap[axElem.kind];
						if(condAxElem){
							switch(axElem.type){
							case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_SUBTOTAL:
							//case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_TOTAL:
								// TOTAL は子要素持たないことが自明なのでコメントアウト。
							case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_NORMAL:
								var maxAttr = anaProc.getDrilldownMaxlv(condAxElem.kind, condAxElem.func_id);
								if(axElem.attr < maxAttr){
									// attr は軸種別(kind) におけるツリーの深さ値。
									// maxAttr 値未満場合は子要素を持つことが可能。
									// 子要素がまだ無い場合は折り畳み状態[+]としておく。
									// 子要素が既に付いている場合は開いた状態[-]としておく。
									lfNode._collapsed = lfNode.isLeaf();
								}
								break;
							}
						}
					}
				}
				return vAxLeafNodeArray;
			},
			// SlickDataView 用の行データを作る。
			// drillNode を指定すると、当該ノード直下の子要素をリーフノード配列とした部分行配列を作る。
			// ただし、drillNode は、ctx.vAxisLeafNodeArray 中の１要素であること。
			buildSlickDataRows: function(columns, ctx, drillNode){
				var rows = new Array();
				var frozenRowCount = ctx.frozenRowCount;
				var frozenColCount = ctx.frozenColCount;

				var leafNodeArray = (drillNode) ? drillNode.children : ctx.vAxisLeafNodeArray;

				for(var rowIdx = 0; rowIdx < leafNodeArray.length; rowIdx++){
					var vLeaf = leafNodeArray[rowIdx];
					if(_.isNullOrUndefined(ctx.hAxisRoot)){
						// １軸
						var aRow = new Object();

						// 表側部
						aRow.vLeaf = vLeaf;
						aRow.rowHeadName = Ana.Util.axisNodeAndDataToString(vLeaf);
						aRow.id = vLeaf.data.id;	// [slick] Slick.Data.DataView

						// セル部
						for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
							var aCol = columns[colIdx];
							var field = aCol.field;
							var vid = vLeaf.data.id;

							// 縦軸属性(マスタ)
							if(aCol.attr){
								var key = 'v' + vid + field;
								var cell = ctx.vAxAttr.cellMap[key];
								var cellStr = null;
								if(cell != null){
									cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit, aCol.attr);
								}
								aRow[field] = cellStr || '';
								continue;
							}

							// セルデータ表示用文字列をとる。
							var hid = 0, did = aCol.dLeaf.data.id;
							var cell = ctx.cellMap.find(vid, hid, did);
							var cellStr;
							if(_.isNullOrUndefined(cell)){
								console.warn('みなしご: vid[' + vid + '] hid[' + hid + ']' + ' did[' + did + ']');
								// cellStr = 'n/a';
								cellStr = '';
							}else{
								cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit);
							}
							aRow[field] = cellStr;

              				// セル色: 期間対比の場合は実績値で判定する。
							  var rCell = null
							  , dispitem_id = aCol.dLeaf.data.dispitem_id
							  , c_di = dispitem_id & amgbp_AnaDispItemDefs.AMGBA_DI_C_MASK;
							if(c_di === 0 || c_di === amgbp_AnaDispItemDefs.AMGBA_DI_C_VALUE1){
							  // 期間対比なし or 実績項目である。
							  rCell = cell;
							}else{
							  // 期間対比項目である。-- 実績データをとる。
							  if(aCol.dLeaf.level === 2){
								var rdid = aCol.dLeaf.parent.children[0].data.id;
								rCell = ctx.cellMap.find(vid, hid, rdid);
							  }
							}
							if(rCell){
							  var x_di = dispitem_id & ~amgbp_AnaDispItemDefs.AMGBA_DI_C_MASK
								, cellColor = Ana.Util.cellColor(rCell, ctx.cellColorMap[x_di]);
							  if(cellColor){
								if(aRow.color == null) aRow.color = {};
								aRow.color[field] = cellColor;
							  }
							}
						}
						rows.push(aRow);
					}else{
						// ２軸
						if(ctx.dispopt.disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_V){
							// 表示項目並び＝たて
							// fieldName: rowHeadName, dspItemName, [dspCmpName,] h1, h2, h3, ....
							var subRows = new Array();

							// 表示部（縦軸） -- 表示項目名のラベルをつくる。最大２階層であることが前提なコード
							if(ctx.dispMaxLevel >= 2){
								// 比較項目あり
								var wkMap = new Object();
								for(var i = 0; i < ctx.dispLeafArray.length; i++){
									var dLeaf = ctx.dispLeafArray[i];
									var dParent = dLeaf.parent;
									var subRow = {
										id: 'v' + vLeaf.data.id + 'd' + dLeaf.data.id,
										vLeaf: vLeaf,
										dLeaf: dLeaf,
										dspCmpName: dLeaf.data.name				// 表示項目ラベル：比較項目名
									};

									if(wkMap[dParent.data.id]){
										// 表示項目名セット済
									}else{
										wkMap[dParent.data.id] = true;
										subRow.dspItemName = dParent.data.name;	// 表示項目ラベル
									}
									subRows.push(subRow);
								}
							}else{
								// 対象項目のみ
								for(var i = 0; i < ctx.dispLeafArray.length; i++){
									var dLeaf = ctx.dispLeafArray[i];
									subRows.push({
										id: 'v' + vLeaf.data.id + 'd' + dLeaf.data.id,
										vLeaf: vLeaf,
										dLeaf: dLeaf,
										dspItemName: dLeaf.data.name
									});
								}
							}

							// 表側部（縦軸） -- 縦軸ツリーのラベルをつくる。subRows 先頭行だけに縦軸リーフノードの名前をセットする
							if (subRows != null && subRows.length > 0) {
								subRows[0].rowHeadName = Ana.Util.axisNodeAndDataToString(vLeaf);
							}
							for(var colIdx = 0; colIdx < frozenColCount; colIdx++){
								var aCol = columns[colIdx];
								var field = aCol.field;

								// 縦軸属性(マスタ)
								if(aCol.attr){
									var aRow = subRows[0];
									var vid = aRow.vLeaf.data.id;
									var key = 'v' + vid + field;
									var cell = ctx.vAxAttr.cellMap[key];
									var cellStr = null;
									if(cell != null){
										cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit, aCol.attr);
									}
									aRow[field] = cellStr || '';
								}
							}
							// セル部
							for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
								var aCol = columns[colIdx];
								var field = aCol.field;

								// 縦軸属性(マスタ)
								if(aCol.attr){
									var aRow = subRows[0];
									var vid = aRow.vLeaf.data.id;
									var key = 'v' + vid + field;
									var cell = ctx.vAxAttr.cellMap[key];
									var cellStr = null;
									if(cell != null){
										cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit, aCol.attr);
									}
									aRow[field] = cellStr || '';
									continue;
									//throw '縦軸属性(マスタ): 「表示項目並び＝たて」に縦軸属性(マスタ)表示は不可。';
								}

                                var hid = (aCol.hLeaf != null ? aCol.hLeaf.data.id : 0);
								for(var i = 0; i < subRows.length; i++){
									var aRow = subRows[i];
									var vid = aRow.vLeaf.data.id;
									var did = aRow.dLeaf.data.id;
									var cell = ctx.cellMap.find(vid, hid, did);
									var cellStr;
									if(_.isNullOrUndefined(cell)){
										console.warn('みなしご: vid[' + vid + '] hid[' + hid + ']' + ' did[' + did + ']');
										// cellStr = 'n/a';
										cellStr = '';
									}else{
										cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit);
									}
									aRow[field] = cellStr;

									// セル色: 期間対比の場合は実績値で判定する。
									var rCell = null
									, dispitem_id = aRow.dLeaf.data.dispitem_id
									, c_di = dispitem_id & amgbp_AnaDispItemDefs.AMGBA_DI_C_MASK;
									if(c_di === 0 || c_di === amgbp_AnaDispItemDefs.AMGBA_DI_C_VALUE1){
										// 期間対比なし or 実績項目である。
										rCell = cell;
									}else{
										// 期間対比項目である。-- 実績データをとる。
										if(aRow.dLeaf.level === 2){
											var rdid = aRow.dLeaf.parent.children[0].data.id;
											rCell = ctx.cellMap.find(vid, hid, rdid);
										}
									}
									if(rCell){
										var x_di = dispitem_id & ~amgbp_AnaDispItemDefs.AMGBA_DI_C_MASK
											, cellColor = Ana.Util.cellColor(rCell, ctx.cellColorMap[x_di]);
										if(cellColor){
											if(aRow.color == null) aRow.color = {};
											aRow.color[field] = cellColor;
										}
									}
								}
							}

							// 部分行の行オブジェクトを rows へ追加する。
							for(var i = 0; i < subRows.length; i++){
								rows.push(subRows[i]);
							}
						} else if (ctx.dispopt.disp_way === amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_H_DIAGG){
							// 表示項目並び＝表示項目集約
							// fieldName: rowHeadName, d1h1, d1h2, d2h1, d2h2, d3h1, h3d2,...
							var aRow = new Object();

							// 表側部
							aRow.vLeaf = vLeaf;
							aRow.rowHeadName = Ana.Util.axisNodeAndDataToString(vLeaf);
							aRow.id = vLeaf.data.id;		// [slick] Slick.Data.DataView

							// セル部
							for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
								var aCol = columns[colIdx];
								var field = aCol.field;
								var vid = vLeaf.data.id;

								// 縦軸属性(マスタ)
								if(aCol.attr){
									var key = 'v' + vid + field;
									var cell = ctx.vAxAttr.cellMap[key];
									var cellStr = null;
									if(cell != null){
										cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit, aCol.attr);
									}
									aRow[field] = cellStr || '';
									continue;
								}

								var hid = aCol.hLeaf.data.id, did = aCol.dLeaf.data.id;
								var cell = ctx.cellMap.find(vid, hid, did);
								var cellStr;
								if(_.isNullOrUndefined(cell)){
									console.warn('みなしご: vid[' + vid + '] hid[' + hid + ']' + ' did[' + did + ']');
									// cellStr = 'n/a';
									cellStr = '';
								}else{
									cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit);
								}
								aRow[field] = cellStr;

								// セル色: 期間対比の場合は実績値で判定する。
								var rCell = null
								, dispitem_id = aCol.dLeaf.data.dispitem_id
								, c_di = dispitem_id & amgbp_AnaDispItemDefs.AMGBA_DI_C_MASK;
								if(c_di === 0 || c_di === amgbp_AnaDispItemDefs.AMGBA_DI_C_VALUE1){
									// 期間対比なし or 実績項目である。
									rCell = cell;
								}else{
									// 期間対比項目である。-- 実績データをとる。
									if(aCol.dLeaf.level === 2){
										var rdid = aCol.dLeaf.parent.children[0].data.id;
										rCell = ctx.cellMap.find(vid, hid, rdid);
									}
								}
								if(rCell){
									var x_di = dispitem_id & ~amgbp_AnaDispItemDefs.AMGBA_DI_C_MASK
										, cellColor = Ana.Util.cellColor(rCell, ctx.cellColorMap[x_di]);
									if(cellColor){
										if(aRow.color == null) aRow.color = {};
										aRow.color[field] = cellColor;
									}
								}
							}
							rows.push(aRow);
						} else {
							// 表示項目並び＝よこ
							// fieldName: rowHeadName, h1d1, h1d2, h1d3,... h2d1, h2d2, h2d3,...
							var aRow = new Object();

							// 表側部
							aRow.vLeaf = vLeaf;
							aRow.rowHeadName = Ana.Util.axisNodeAndDataToString(vLeaf);
							aRow.id = vLeaf.data.id;		// [slick] Slick.Data.DataView

							// セル部
							for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
								var aCol = columns[colIdx];
								var field = aCol.field;
								var vid = vLeaf.data.id;

								// 縦軸属性(マスタ)
								if(aCol.attr){
									var key = 'v' + vid + field;
									var cell = ctx.vAxAttr.cellMap[key];
									var cellStr = null;
									if(cell != null){
										cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit, aCol.attr);
									}
									aRow[field] = cellStr || '';
									continue;
								}

								var hid = aCol.hLeaf.data.id, did = aCol.dLeaf.data.id;
								var cell = ctx.cellMap.find(vid, hid, did);
								var cellStr;
								if(_.isNullOrUndefined(cell)){
									console.warn('みなしご: vid[' + vid + '] hid[' + hid + ']' + ' did[' + did + ']');
									// cellStr = 'n/a';
									cellStr = '';
								}else{
									cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit);
								}
								aRow[field] = cellStr;

								// セル色: 期間対比の場合は実績値で判定する。
								var rCell = null
								, dispitem_id = aCol.dLeaf.data.dispitem_id
								, c_di = dispitem_id & amgbp_AnaDispItemDefs.AMGBA_DI_C_MASK;
								if(c_di === 0 || c_di === amgbp_AnaDispItemDefs.AMGBA_DI_C_VALUE1){
									// 期間対比なし or 実績項目である。
									rCell = cell;
								}else{
									// 期間対比項目である。-- 実績データをとる。
									if(aCol.dLeaf.level === 2){
										var rdid = aCol.dLeaf.parent.children[0].data.id;
										rCell = ctx.cellMap.find(vid, hid, rdid);
									}
								}
								if(rCell){
									var x_di = dispitem_id & ~amgbp_AnaDispItemDefs.AMGBA_DI_C_MASK
										, cellColor = Ana.Util.cellColor(rCell, ctx.cellColorMap[x_di]);
									if(cellColor){
										if(aRow.color == null) aRow.color = {};
										aRow.color[field] = cellColor;
									}
								}
							}
							rows.push(aRow);
						}
					}
				}
				return rows;
			},
			_eof: 'end of treeBuilder//'
		},

		render: function(){
			if(this.slickGrid){
				this.slickGrid.destroy();
			}
			this.$el.empty();
			this.setPreferredSize();

			if(!this.anaProc.hasResultData()){
				this.$el.append('<h1 style="padding: 5px;">←左側の項目より条件を指定してください。</h1>');
			}else{
				var cond = this.anaProc.savedCond;
				var resp = this.anaProc.savedResult;

				// ツリー構築 util 群
				var trutil = this.treeBuilder;

				// 軸のリーフノード装飾関数。
				// 初期（ドリルダウン子が着いていない）のリーフノードマーキングをする。
				var axLfNodeDecoratorFunc = function(axLfNode){
					axLfNode.iniLeaf = true;
					return axLfNode;
				};

				// 縦軸 - 必須
				var vAxisRoot = new Ana.Util.TreeNode({id:0, name:'vAxisRoot'});
				var vAxisIdMap = trutil.buildIdTreeNodeMap(vAxisRoot, resp.anaVAxisElem);
				trutil.buildTree(vAxisIdMap);

				// 横軸 - 多軸分析時のみ
				var hAxisRoot = null;
				var hAxisIdMap = null;
				if(!_.isEmpty(cond.hAxisList)){
					hAxisRoot = new Ana.Util.TreeNode({id:0, name:'hAxisRoot'});
					hAxisIdMap = trutil.buildIdTreeNodeMap(hAxisRoot, resp.anaHAxisElem);
					trutil.buildTree(hAxisIdMap);
				}

				// 表示項目 - 必須
				var dispRoot = new Ana.Util.TreeNode({id:0, name:'dispRoot'});
				var dispIdMap = trutil.buildIdTreeNodeMap(dispRoot, resp.anaAxisDisp);
				trutil.buildTree(dispIdMap);

				// セルデータ
				// key: (vid,hid,did) = 'v1234h1234d1234'
				// value: {...}
				var cellMap = new Ana.Util.CellMap(resp.anaCellData);

				// 縦軸属性 - 表示項目(マスタ)
				// ※ 実装制約：表示項目並び＝横のときに限る。∵) SlickGrid にて、rowspan 行結合未サポートのため。
				var vAxAttr = null;
				if((cond.dispopt.disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_H
						|| cond.dispopt.disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_V
						|| cond.dispopt.disp_way === amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_H_DIAGG)
						&& !_.isEmpty(resp.anaVAxisAttrDisp)
						/* && !_.isEmpty(resp.anaVAxisAttr) */){        // セルが無くても列タイトルを用意する。
					vAxAttr = {
						//pos: cond.mstDispitem.pos || 'post',    // 表示位置: 前 or 後
						pos: 'pre',
						dspList: resp.anaVAxisAttrDisp,         // 項目リスト
						dspIdMap: _.reduce(resp.anaVAxisAttrDisp, function(map, mstDisp){
							var key = 'a' + mstDisp.id;
							map[key] = mstDisp;
							return map;
						}, {}),                 // 項目Map<key,anaVAxisAttrDisp[n]> -- key: "a1", "a2", ...
						cellMap: _.reduce(resp.anaVAxisAttr, function(map, attrDto){
							var key = 'v' + attrDto.id + 'a' + attrDto.did;
							if(_.has(map, key)){
								// 重複 ⇒ 上書き
								console.warn(
										'duplicated vAxAttrCell: (vid,id)=(' + attrDto.id + ',' + attrDto.did + '), '
										+ 'old[' + JSON.stringify(map[key]) + ']'
										+ 'new[' + JSON.stringify(attrDto)  + '] ...overriden.');
							}
							map[key] = attrDto;
							return map;
						}, {})                  // セルデータ(縦軸属性:マスタ項目)、key:(vid,did) = 'v1234a1234'
					};
				}

				// 結果データ集約
				var vAxisLeafNodeArray = null;
				if(vAxisRoot.childCount() > 0){
					var _leafnodearray = vAxisRoot.buildAxLeafNodeArray({
						decorateFunc: axLfNodeDecoratorFunc
					});
					// ドリルダウンの閉じるマーキング colapse を入れておく
					vAxisLeafNodeArray = trutil.addCollapseFlag(this.anaProc, _leafnodearray);
				}else{
					vAxisLeafNodeArray = [];
				}
				var vAxisSortkey = null;
				if(this.anaProc.savedReq.anaVSortkey && this.anaProc.savedReq.anaVSortkey[0]){
					vAxisSortkey = this.anaProc.savedReq.anaVSortkey[0];
					// vAxisLeafNodeArrayをソート条件付き -- AnaAxisElem 返却順に整列させる。
					vAxisLeafNodeArray.sort(function(a, b){
						return a.seqno - b.seqno;
					});
				}
				var vAxisMaxLevel = trutil.findMaxLv(vAxisLeafNodeArray);
				var vAxisMaxId = trutil.findMaxId(resp.anaVAxisElem);
				var hAxisLeafNodeArray = null;
				var hAxisMaxLevel = 0;
				if(!_.isNullOrUndefined(hAxisRoot)){
					// 1軸
					if((hAxisRoot.childCount() > 0)){
						hAxisLeafNodeArray = hAxisRoot.buildAxLeafNodeArray({
							decorateFunc: axLfNodeDecoratorFunc
						});
					}else{
						hAxisLeafNodeArray = [];
					}
					hAxisMaxLevel = trutil.findMaxLv(hAxisLeafNodeArray);
				}
				var dispLeafArray = (dispRoot.childCount() > 0) ? dispRoot.buildLeafNodeArray() : [];
				var dispMaxLevel = Math.min(2, trutil.findMaxLv(dispLeafArray));		// 表示項目はせいぜい２層
				this.ctx = {
					// 左端上の表示定義
					cornerLeftTop       : this.anaProc.cornerLeftTop || [],

					// 縦軸
					vAxisRoot			: vAxisRoot,
					vAxisIdMap			: vAxisIdMap,
					vAxisLeafNodeArray	: vAxisLeafNodeArray,	//vAxisRoot.leafNodeArray(),
					vAxisMaxLevel		: vAxisMaxLevel,
					vAxisMaxId			: vAxisMaxId,			//ドリルダウンサブ要素をマージする際にサブ要素 vid の洗い替えが必要になるから最大値を足し込む。
					// 横軸
					hAxisRoot			: hAxisRoot,
					hAxisIdMap			: hAxisIdMap,
					hAxisLeafNodeArray	: hAxisLeafNodeArray,	//_.isNullOrUndefined(hAxisRoot) ? null : hAxisRoot.leafNodeArray(),
					hAxisMaxLevel		: hAxisMaxLevel,
					// 表示項目
					dispRoot			: dispRoot,
					dispIdMap			: dispIdMap,
					dispLeafArray		: dispLeafArray,		//dispRoot.leafNodeArray(),
					dispMaxLevel		: dispMaxLevel,
					dispopt				: cond.dispopt,			//表示項目オプション
					// セル
					cellMap				: cellMap,

					// 縦軸属性(マスタ項目)
					vAxAttr             : vAxAttr,

        			// セル色設定情報  Map<dispitem_id, List<範囲-色情報>>
					cellColorMap    : _.chain(cond.dispcolorlist).filter(function(c){
						if(c.color == 'default'){
						  return false;
						}
						if(c.fgcolor == null && c.bgcolor == null){
						  return false;
						}
						return true;
					  }).groupBy('dispitem_id').value(),

					// 固定行数
					frozenRowCount		: function(axMaxLv, dspMaxLv, disp_way){
						var fzc = axMaxLv;
						if(disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_V){
						}else{
							// 表示項目：横並び
							fzc += dspMaxLv;
						}
						return fzc;
					}(hAxisMaxLevel, dispMaxLevel, cond.dispopt.disp_way),

					// 固定列数
					frozenColCount		: function(axMaxLv, dspMaxLv, axAttr, disp_way){
						var fzc = 1; //axMaxLv;		// 縦軸階層は１列内で展開しているので初期は１列。
						if(disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_V){
							// 表示項目：縦並び
							fzc += Math.min(dspMaxLv, 2);	// XXX 補正 -- 表示項目の高さは最大２段まで。
						}
						return fzc;
					}(vAxisMaxLevel, dispMaxLevel, vAxAttr, cond.dispopt.disp_way),

					// セル選択
					selectedCellSet		: new Ana.Util.CellMap(),

					// 縦軸リーフノード vid に対応する、SlickGrid 上の行データ id を求める。
					// １軸および表示項目並びがよこの場合は、引数 did は省略する。
					vid2SlickRowId		: function(vid, did){
						if(!_.isNullOrUndefined(this.hAxisRoot)
								|| this.dispopt.disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_V){
							// ２軸で表示項目並び＝たて
							return 'v' + vid + 'd' + did;
						}
						return vid;
					},

					// ソート条件 - セルレンダリング等で判定しやすい情報をまとめておく。
					sortCond			: function(reqSortkey, dispLeafArray, hAxisLeafNodeArray){
						if(!reqSortkey){
							return null;
						}
						var sortOrder = Ana.Const.sortOrder.dsc;
						if(sortOrder.value !== reqSortkey.order){
							sortOrder = Ana.Const.sortOrder.asc;
						}
						var dispitem_id = Ana.Util.valuesToNumber(reqSortkey.dispitem_id);
						if(!_.isNumber(dispitem_id)){
							console.warn('vSortkey exists but dispitem_id[' + reqSortkey.dispitem_id + '] not number.');
							return null;
						}
						var dLeaf = null;
						for(var i = 0; i < dispLeafArray.length; i++){
							if(dispLeafArray[i].data.dispitem_id === dispitem_id){
								dLeaf = dispLeafArray[i];
								break;
							}
						}
						if(dLeaf === null){
							console.warn('vSortkey exists but dispitem_id[' + reqSortkey.dispitem_id + '] not found.');
							return null;
						}

						var hLeaf = null;
						if(hAxisLeafNodeArray){
							hLeaf = hAxisLeafNodeArray[reqSortkey.idx];
						}
						// ソート情報をまとめておく。
						return {
							reqSortkey: reqSortkey,	// 検索条件上のソート条件
							sortOrder: sortOrder,	// ソート順: Ana.Const.sortOrder.***
							dLeaf: dLeaf,			// ソート対象の表示項目（reqSortkey.dispitem_id に相当する表示項目リーフノード要素）
							hLeaf: hLeaf			// ソート対象の横軸要素（reqSortkey.idx に相当する横軸リーフノード要素）
						};
					}(vAxisSortkey, dispLeafArray, hAxisLeafNodeArray),

					_eof: 'end of Ana.ResultDataGridView.ctx//'
				};

				// --- ↑ここまで、データ整理、↓ここからグリッドビュー生成 ------------------------- //

				// カラム部
				var columns = function(ctx, rhdCellFmt, cellFmt){
					var columns = new Array();
					var aColumns = null;
					var fieldId, width;

					// 表側部：とりあえず、１列固定で。<====== 表側部は一列固定でいけるはず。
					fieldId = 'rowHeadName';
					columns.push({
						name: '',		// [slick] ラベルテキスト
						field: fieldId,	// [slick] 行要素のプロパティ名
						id: fieldId,	// [slick] 列ID
						width: 220,
						cssClass: 'cell-title',
						formatter: rhdCellFmt,
						isHierarchical: true
					});

					if (_.isNullOrUndefined(ctx.hAxisRoot) || ctx.dispopt.disp_way !== amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_V) {
						// 軸属性情報(マスタ項目)
						if(ctx.vAxAttr){
							aColumns = new Array();
							var cssClass = 'cell--master';
							for(var i=0; i<ctx.vAxAttr.dspList.length; i++){
								var vAttrDsp = ctx.vAxAttr.dspList[i];
								fieldId = 'a' +  vAttrDsp.id;
								width = (vAttrDsp.width == null || vAttrDsp.width <= 0) ? 100 : vAttrDsp.width;
								aColumns.push({
									attr: vAttrDsp,         // 軸属性情報(マスタ)
									name: '--',             // [slick] カラムハンドルなので '--' で表示しておく。
									field: fieldId,         // [slick] 行要素のプロパティ名
									id: fieldId,            // [slick] 列ID
									width: width,
									cssClass: cssClass,
									formatter: rhdCellFmt
								});
							}
							// 軸属性情報(マスタ項目) - 前置き
							if(ctx.vAxAttr.pos == 'pre'){
								columns = columns.concat(aColumns);
								aColumns = null;
							}
						}
					}

					// データ部
					if(_.isNullOrUndefined(ctx.hAxisRoot)){
						// １軸 - 表示項目で展開
						for(var i = 0; i < ctx.dispLeafArray.length; i++){
							var dspNode = ctx.dispLeafArray[i];
							var dto = dspNode.data;
							fieldId = 'd' + dto.id;	// [slick] 行要素のプロパティ名
							columns.push({
								hLeaf: null,		// 横軸リーフ要素 --- １軸なのでnull。
								dLeaf: dspNode,		// 表示項目リーフ要素
								name: '--',			// [slick] ラベルテキスト
								field: fieldId,		// [slick] 行要素のプロパティ名
								id: fieldId,		// [slick] 列ID
								width: (ctx.dispMaxLevel <= 1) ? 120 : 80,
								//cssClass: xxxx,	// データ部の CSS クラス付けは、formatter の中でやる！！
								formatter: cellFmt
							});
						}
					}else{
						// ２軸
						if(ctx.dispopt.disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_V){
							// ２軸-表示項目並び＝縦

							// 表示項目の厚さ -- せいぜい２段
							fieldId = 'dspItemName';
							columns.push({
								dLevel: 1,					// 表示項目ツリーの Lv[1]
								name: '--',					// [slick]'表示項目',
								field: fieldId,				// [slick] 行要素のプロパティ名
								id: fieldId,				// [slick] 列ID
								width: 80,
								cssClass: 'cell-title',		// [slick] ヘッダ部のスタイルのクラス
								formatter: rhdCellFmt
							});
							if(ctx.dispMaxLevel > 1){
								fieldId = 'dspCmpName';
								columns.push({
									dLevel: 2,					// 表示項目ツリーの Lv[2]
									name: '--',					// [slick] '対比項目',
									field: fieldId,				// [slick] 行要素のプロパティ名
									id: fieldId,				// [slick] 列ID
									width: 80,
									cssClass: 'cell-title',		// [slick] ヘッダ部のスタイルのクラス
									formatter: rhdCellFmt
								});
							}
							// 軸属性情報(マスタ項目)
							if(ctx.vAxAttr){
								aColumns = new Array();
								var cssClass = 'cell--master';
								for(var i=0; i<ctx.vAxAttr.dspList.length; i++){
									var vAttrDsp = ctx.vAxAttr.dspList[i];
									fieldId = 'a' +  vAttrDsp.id;
									width = (vAttrDsp.width == null || vAttrDsp.width <= 0) ? 100 : vAttrDsp.width;
									aColumns.push({
										attr: vAttrDsp,         // 軸属性情報(マスタ)
										name: '--',             // [slick] カラムハンドルなので '--' で表示しておく。
										field: fieldId,         // [slick] 行要素のプロパティ名
										id: fieldId,            // [slick] 列ID
										width: width,
										cssClass: cssClass,
										formatter: rhdCellFmt
									});
								}
								// 軸属性情報(マスタ項目) - 前置き
								if(ctx.vAxAttr.pos == 'pre'){
									columns = columns.concat(aColumns);
									aColumns = null;
								}
							}

							// よこ軸要素
							for(var hIndex = 0; hIndex < ctx.hAxisLeafNodeArray.length; hIndex++){
								var hLfNode = ctx.hAxisLeafNodeArray[hIndex];
								fieldId = 'h' + hLfNode.data.id;
								columns.push({
									hLeaf: hLfNode,				// 横軸リーフ要素
									name: '--',					// [slick] カラムハンドルなので '--' で表示しておく。
									field: fieldId,				// [slick] 行要素プロパティ名: "h1234"
									id: fieldId,				// [slick] 列ID
									width: 120,
									//cssClass: xxxx,	// データ部の CSS クラス付けは、formatter の中でやる！！
									formatter: cellFmt
								});
							}
						} else if(ctx.dispopt.disp_way === amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_H_DIAGG){
							// ２軸-表示項目並び＝表示項目集約
							for(var dIndex = 0; dIndex < ctx.dispLeafArray.length; dIndex++){
								var dspLfNode = ctx.dispLeafArray[dIndex];
								for(var hIndex = 0; hIndex < ctx.hAxisLeafNodeArray.length; hIndex++){
									var hLfNode = ctx.hAxisLeafNodeArray[hIndex];
									fieldId = 'd' + dspLfNode.data.id + 'h' + hLfNode.data.id;
									columns.push({
										hLeaf: hLfNode,		// 横軸リーフ要素
										dLeaf: dspLfNode,	// 縦軸リーフ要素
										name: '--',			// [slick] カラムハンドルなので '--' で表示しておく。
										field: fieldId,		// [slick] 行要素プロパティ名 "h1234d99"
										id: fieldId,		// [slick] 列ID
										width: (ctx.dispMaxLevel <= 1) ? 120 : 80,
										//cssClass: xxxx,	// データ部の CSS クラス付けは、formatter の中でやる！！
										formatter: cellFmt
									});
								}
							}
						}else{
							// ２軸-表示項目並び＝横

							// よこ軸要素＋表示項目
							for(var hIndex = 0; hIndex < ctx.hAxisLeafNodeArray.length; hIndex++){
								var hLfNode = ctx.hAxisLeafNodeArray[hIndex];
								for(var dIndex = 0; dIndex < ctx.dispLeafArray.length; dIndex++){
									var dspLfNode = ctx.dispLeafArray[dIndex];
									fieldId = 'h' + hLfNode.data.id + 'd' + dspLfNode.data.id;
									columns.push({
										hLeaf: hLfNode,		// 横軸リーフ要素
										dLeaf: dspLfNode,	// 縦軸リーフ要素
										name: '--',			// [slick] カラムハンドルなので '--' で表示しておく。
										field: fieldId,		// [slick] 行要素プロパティ名 "h1234d99"
										id: fieldId,		// [slick] 列ID
										width: (ctx.dispMaxLevel <= 1) ? 120 : 80,
										//cssClass: xxxx,	// データ部の CSS クラス付けは、formatter の中でやる！！
										formatter: cellFmt
									});
								}
							}
						}
					}

					// 軸属性情報(マスタ項目) - 後置き
					if(aColumns){
						columns = columns.concat(aColumns);
					}
					return columns;
				}(this.ctx, this.RowHeadCellFormatter, this.CellRenderFormatter);

				// データ部（固定行）-- frozenRows 部位のデータ行を生成する。
				var frozenRows = function(ctx, columns){
					var rows = new Array();
					var frozenRowCount = ctx.frozenRowCount;
					var frozenColCount = ctx.frozenColCount;

					// 階層数分の行オブジェクトを確保
					for(var i = 0; i < frozenRowCount; i++){
						rows.push({
							id: 'frozenRow' + (i+1)
						});
					}

					if(_.isNullOrUndefined(ctx.hAxisRoot)){
						// 1軸
						// fieldName: rowHeadName, d1, d2, d3, ...

						var wkMap = new Object();	// 処理済ノードを憶えるマップ

						// Leaf->parent->... 方向へ、表示項目階層を積み上げる
						for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
							var aCol = columns[colIdx];
							if(aCol.attr){
								// 縦軸属性(マスタ)
								var aRow = _.last(rows);
								aRow[aCol.field] = aCol.attr.name;
								continue;
							}

							// 表示項目
							var dLfNode = aCol.dLeaf;
							var dNode = dLfNode;
							while(!dNode.isRoot()){
								var did = dNode.data.id;
								if(wkMap[did]){
									// 処理済
								}else{
									wkMap[did] = true;

									// 行データの構造はこんな風 ///////////////////
									//aRow = {
									//	'フィールド名' : 'ラベルテキスト',
									//	itemMetadata: {		//★ これは slickdataview.getItemMetadata(rowIndex) 関数で返すメタ情報
									//		columns: {
									//			'フィールド名': {
									//				colspan: 1234
									//			}
									//		}
									//	}
									//}

									// ラベルテキスト
									var aRow = rows[dNode.level-1];
									aRow[aCol.field] = dNode.data.name;

									// セル結合用 ColSpan 定義のネタを仕込む。
									if(dNode.childCount() > 0){
										var meta = aRow.itemMetadata;
										if(_.isNullOrUndefined(meta)){
											meta = { columns:{} };
											aRow.itemMetadata = meta;
										}
										var lfCount = dNode.leafCount();
										meta.columns[aCol.field] = {
											colspan: lfCount
										};
									}
								}
								dNode = dNode.parent;
							}
						}
					}else{
						// 2軸
						if(ctx.dispopt.disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_V){
							// 表示項目並び＝たて
							// fieldName: rowHeadName, dspItemName, [dspCmpName,] h1, h2, h3, ....

							// 表示項目のカラムは軸＋軸属性表示項目数
							var disp_n = 1;
							if (ctx.vAxAttr && ctx.vAxAttr.dspList) {
								disp_n += ctx.vAxAttr.dspList.length;
							}
							// ラベル
							lastRow = _.last(rows);
							lastRow[columns[disp_n].field] = '表示項目';
							if(ctx.dispMaxLevel >= 2){
								lastRow[columns[disp_n+1].field] = '対比項目';
							}

							// 左上のコーナー部分の ColSpan 定義を仕込む
							if(ctx.hAxisMaxLevel > 1){
								var colDef = { colspan: ctx.dispMaxLevel + 1 };
								for(var rowIdx = 0; rowIdx < ctx.hAxisMaxLevel-1; rowIdx++){
									var aRow = rows[rowIdx];
									var meta = aRow.itemMetadata;
									if(_.isNullOrUndefined(meta)){
										meta = { columns:{} };
										aRow.itemMetadata = meta;
									}
									meta.columns.rowHeadName = colDef;
								}
							}

							var wkMap = new Object();	// 処理済ノードを憶えるマップ

							// 横軸ツリー
							for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
								var aCol = columns[colIdx];

								// 縦軸属性(マスタ)
								if(aCol.attr){
									var aRow = _.last(rows);
									aRow[aCol.field] = aCol.attr.name;
									continue;
								}

								var hAxLfNode = aCol.hLeaf;
								var aNode = hAxLfNode;
								while(aNode != null && !aNode.isRoot()){
									if(wkMap[aNode.data.id/*hid*/]){
										// 処理済
									}else{
										wkMap[aNode.data.id] = true;
										switch(aNode.data.type){
										case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_SUBTOTAL:
											// １段下に「小計」ラベルをつくる
											rows[aNode.level][aCol.field] = '小計';
											// ↓fall through
										case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_TOTAL:
										case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_NORMAL:
										case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_DATA:
											var aRow = rows[aNode.level-1];
											// ラベルテキスト★
											aRow[aCol.field] = Ana.Util.axisElemToString(aNode.data);

											// セル結合用 ColSpan 定義のネタを仕込む。
											if(aNode.childCount() > 0){
												var meta = aRow.itemMetadata;
												if(_.isNullOrUndefined(meta)){
													meta = { columns:{} };
													aRow.itemMetadata = meta;
												}
												var lfCount = aNode.axLeafCount();
												meta.columns[aCol.field] = {
													colspan: lfCount
												};
											}
											break;
										default:
											// 不明な軸項目種別 type
											console.warn('[横軸] 不明な軸項目種別: ' + aCol);
										}
									}

									aNode = aNode.parent;
								}
							}
						} else if(ctx.dispopt.disp_way === amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_H_DIAGG){
							// 表示項目並び＝表示項目集約
							// fieldName: rowHeadName, d1h1, d1h2, d1h3,... d2h1, d2h2, d2h3,...

							var wkMap = new Object(), dspWkMap = new Object();	// 処理済ノードを憶えるマップ
							var baseLv = ctx.dispMaxLevel;			// 軸ツリーの最大深さ --> 表示項目表頭の行数のベース値
							var nDisp = ctx.hAxisLeafNodeArray.length;	// 横軸項目数

							// リーフノードにおけるセル結合定義。--- １つあれば十分。
							var lfColspanDef = (nDisp <= 1) ? null : { colspan: nDisp };
							var dspColspanDefMap = function(ctx){
								/*
								 * 1.ctx.hAxisRootの子供を数える
								 * 2.ctx.hAxisRoot.children[]でループ
								 * 2-1. lv1=ctx.hAxisRoot.children[i]
								 * 2-2. n_lv1=lv1.childCount()
								 * 2-2-1. if (n_lv1 <= 1)
								 * 			lvNのcolspan=1 (or未設定)
								 *			lv(N-1).colspan += n
								 * 2-2-2. if (n_lv1 > 1)
								 *
								 */

								var map = {};
								if(ctx.hAxisMaxLevel <= 1){
									// 表示項目最大階層が１段の場合
									return map;
								}
								var func = function(curHAxis, parentHAxis) {
									var nCurHAxis = parentHAxis.childCount();
									for (var i = 0; i < nCurHAxis; i++) {
										var curNode = curHAxis[i];
										var nChildNode = curNode.childCount();
										if (nChildNode > 0) {
											func(curNode.children, curNode);
											if (parentHAxis && parentHAxis.data) {
												if (map[parentHAxis.data.id] == null) {
													map[parentHAxis.data.id] = { colspan: 0 };
													if (ctx.dispopt.f_subtotal) {
														map[parentHAxis.data.id].colspan += 1;
													}
												}
												map[parentHAxis.data.id].colspan += map[curNode.data.id].colspan;
											}
										} else {
											if (parentHAxis && parentHAxis.data) {
												if (map[parentHAxis.data.id] == null) {
													map[parentHAxis.data.id] = { colspan: 0 };
													if (ctx.dispopt.f_subtotal) {
														map[parentHAxis.data.id].colspan += 1;
													}
												}
												map[parentHAxis.data.id].colspan += 1;
											}
										}
									}
								};
								func(ctx.hAxisRoot.children, ctx.hAxisRoot);

								return map;
							}(ctx);

							// 横軸ツリー
							for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
								var aCol = columns[colIdx];

								// 縦軸属性(マスタ)
								if(aCol.attr){
									var aRow = _.last(rows);
									aRow[aCol.field] = aCol.attr.name;
									continue;
								}

								// 表示項目ラベル
								var dLeaf = aCol.dLeaf;
								var dNode = dLeaf;
								while(!dNode.isRoot()){
									if(dspWkMap[dNode.data.id/*did*/]){
										// 処理済
									}else{
										dspWkMap[dNode.data.id] = true;
										wkMap = {};
										aRow = rows[dNode.level-1];
										//aRow = rows[baseLv + dNode.level-1];
										// ラベルテキスト★
										aRow[aCol.field] = dNode.data.name;

										if(true){
											var lfCount = dNode.axLeafCount();
											if(lfCount === 1 && nDisp === 1){
												// ColSpan 必要ナシ
											}else{
												var meta = aRow.itemMetadata;
												if(_.isNullOrUndefined(meta)){
													meta = { columns:{} };
													aRow.itemMetadata = meta;
												}
												meta.columns[aCol.field] = (lfCount === 1) ? lfColspanDef : { colspan: (lfCount * nDisp) };
											}
										}
									}
									dNode = dNode.parent;
								}

								// 横軸ラベル
								var hAxLfNode = aCol.hLeaf;
								var aNode = hAxLfNode;
								var aRow;
								while(!aNode.isRoot()){
									if(wkMap[aNode.data.id/*hid*/]){
										// 処理済
									}else{
										wkMap[aNode.data.id] = true;
										//dspWkMap = {};				// 表示項目ツリーのラベルテキスト処置済idを憶えるマップ
										switch(aNode.data.type){
										case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_SUBTOTAL:
											// １段下に「小計」ラベルをつくる
											rows[aNode.level+1][aCol.field] = '小計';
											// ↓fall through
										case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_TOTAL:
											// ↓fall through
										case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_NORMAL:
										case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_DATA:
											// ラベルテキスト★
											aRow = rows[baseLv + aNode.level-1];
											//aRow = rows[aNode.level-1];
											aRow[aCol.field] = Ana.Util.axisElemToString(aNode.data);

											var colDef = dspColspanDefMap[aNode.data.id];
											if(colDef){
												var meta = aRow.itemMetadata;
												if(_.isNullOrUndefined(meta)){
													meta = { columns:{} };
													aRow.itemMetadata = meta;
												}
												meta.columns[aCol.field] = colDef;	// TODO 小計の分が足りない
											}
											break;
										default:
											// 不明な軸項目種別 type
											console.warn('[横軸] 不明な軸項目種別: ' + aCol);
										}
									}
									aNode = aNode.parent;
								}
							}
						}else{
							// 表示項目並び＝よこ
							// fieldName: rowHeadName, h1d1, h1d2, h1d3,... h2d1, h2d2, h2d3,...

							var wkMap = new Object(), dspWkMMap;	// 処理済ノードを憶えるマップ
							var baseLv = ctx.hAxisMaxLevel;			// 軸ツリーの最大深さ --> 表示項目表頭の行数のベース値
							var nDisp = ctx.dispLeafArray.length;	// 表示項目数

							// リーフノードにおけるセル結合定義。--- １つあれば十分。
							var lfColspanDef = (nDisp <= 1) ? null : { colspan: nDisp };
							var dspColspanDefMap = function(ctx){
								var map = {};
								if(ctx.dispMaxLevel <= 1){
									// 表示項目最大階層が１段の場合
									return map;
								}
								// 表示項目階層が２段の場合・・・２段以上は考えない。
								var nLv1Disp = ctx.dispRoot.childCount();
								for(var i = 0; i < nLv1Disp; i++){
									var lv1DspNode = ctx.dispRoot.children[i];
									var n = lv1DspNode.childCount();
									if(n > 1){
										map[lv1DspNode.data.id] = { colspan: n };
									}
								}

								return map;
							}(ctx);

							// 横軸ツリー
							for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
								var aCol = columns[colIdx];

								// 縦軸属性(マスタ)
								if(aCol.attr){
									var aRow = _.last(rows);
									aRow[aCol.field] = aCol.attr.name;
									continue;
								}

								// 横軸ラベル
								var hAxLfNode = aCol.hLeaf;
								var aNode = hAxLfNode;
								var aRow;
								while(!aNode.isRoot()){
									if(wkMap[aNode.data.id/*hid*/]){
										// 処理済
									}else{
										wkMap[aNode.data.id] = true;
										dspWkMap = {};				// 表示項目ツリーのラベルテキスト処置済idを憶えるマップ
										switch(aNode.data.type){
										case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_SUBTOTAL:
											// １段下に「小計」ラベルをつくる
											rows[aNode.level][aCol.field] = '小計';
											// ↓fall through
										case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_TOTAL:
											// 小計列/合計列に Colspan 定義を仕込む
											if(lfColspanDef){
												for(var rowIdx = aNode.level; rowIdx < ctx.hAxisMaxLevel; rowIdx++){
													aRow = rows[rowIdx];
													var meta = aRow.itemMetadata;
													if(_.isNullOrUndefined(meta)){
														meta = { columns:{} };
														aRow.itemMetadata = meta;
													}
													meta.columns[aCol.field] = lfColspanDef;
												}
											}
											// ↓fall through
										case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_NORMAL:
										case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_DATA:
											// ラベルテキスト★
											aRow = rows[aNode.level-1];
											aRow[aCol.field] = Ana.Util.axisElemToString(aNode.data);

											// セル結合用 ColSpan 定義のネタを仕込む。
											if(true){
												var lfCount = aNode.axLeafCount();
												if(lfCount === 1 && nDisp === 1){
													// ColSpan 必要ナシ
												}else{
													var meta = aRow.itemMetadata;
													if(_.isNullOrUndefined(meta)){
														meta = { columns:{} };
														aRow.itemMetadata = meta;
													}
													meta.columns[aCol.field] = (lfCount === 1) ? lfColspanDef : { colspan: (lfCount * nDisp) };
												}
											}
											break;
										default:
											// 不明な軸項目種別 type
											console.warn('[横軸] 不明な軸項目種別: ' + aCol);
										}
									}
									aNode = aNode.parent;
								}

								// 表示項目ラベル
								var dLeaf = aCol.dLeaf;
								var dNode = dLeaf;
								while(!dNode.isRoot()){
									if(dspWkMap[dNode.data.id/*did*/]){
										// 処理済
									}else{
										dspWkMap[dNode.data.id] = true;
										aRow = rows[baseLv + dNode.level-1];
										// ラベルテキスト★
										aRow[aCol.field] = dNode.data.name;

										// セル結合用 ColSpan 定義のネタを仕込む。
										var colDef = dspColspanDefMap[dNode.data.id];
										if(colDef){
											var meta = aRow.itemMetadata;
											if(_.isNullOrUndefined(meta)){
												meta = { columns:{} };
												aRow.itemMetadata = meta;
											}
											meta.columns[aCol.field] = colDef;
										}
									}
									dNode = dNode.parent;
								}
							}
						}
					}
					return rows;
				}(this.ctx, columns);

				// データ部（セル）
				var rows = trutil.buildSlickDataRows(columns, this.ctx);

				// frozenRows -> rows へ統合、この結果 frozenRows は空っぽになります。
				var joinedRows = function(hdrows, bodyrows){
					// hdrows の中身を bodyrows の先頭に追加する。
					while(hdrows.length > 0){
						bodyrows.splice(0,0,hdrows.pop());
					}
					return rows;
				}(frozenRows, rows);

				// データView
				var dataView = new Slick.Data.DataView({
					inlineFilters: true
				});
				this.slickDataView = dataView;
				dataView.beginUpdate();
				dataView.setItems(joinedRows);
				// ツリー畳み込んだ行要素をフィルタ対象にする関数
				dataView.setFilter(function(aRow){
					// 行ヘッダ畳み込みフィルタ関数
					// 親要素を辿って、_collapsed が立っていたらフィルタする。
					//	★ただし自身が_collapsed は表示対象
					//console.log(aRow);
					if(aRow.vLeaf){
						var lfNode = aRow.vLeaf;
						var curNode = lfNode.parent;	// いっこ親から検査スタート
						var collapsedNode = null;
						while(curNode){
							if(curNode._collapsed){
								collapsedNode = curNode;
								break;
							}
							curNode = curNode.parent;
						}
						return _.isNull(collapsedNode);
					}
					return true;
				});
				// ColSpan のネタ仕込み
				dataView.getItemMetadata = _.bind(function(rowIndex){
					// 各行オブジェクトに itemMetadata オブジェクトとして仕込んでいる。
					var slickRowItem = this.slickDataView.getItem(rowIndex);
					var itemMetadata = null;
					if(slickRowItem.itemMetadata){
						itemMetadata = slickRowItem.itemMetadata;
					}
					return itemMetadata;
				}, this);
				dataView.endUpdate();

				// --------------------------
				// コンストラクタ
				// var slickgrid = new Slick.Grid(container, rows, columns, options);
				// container: <div></div> -- 空の<div>タグを指定する。
				// rows: データコレクションを指定する。
				//	データ更新が起きたら、更新通知のつもりで再描画契機を与えないといけない。
				//	その１つに、SlickGrid.invalidate() メソッドを呼ぶ。
				//	これは、見えている範囲の全部を捨てて描画しなおす。
				//	次のは、行指定で変更通知を上げる例。4行目と7行目が更新される。
				//		slickgrid.invalidateRows([4,7]);
				//		slickgrid.updateRowCount();
				//		slickgrid.render();
				// columns: カラム定義オブジェクト。
				//	・name
				//	・field
				//	・id
				//	・resizable
				//	・sortable
				//	・selectable
				//	・focusable
				//	・width
				//	・minWidth
				//	・maxWidth
				//	・renderOnResize
				//	・headerCssClass
				//	・formatter
				//	・editor
				//	・～ etc.～

				// var grid = new Slick.Grid('#myGrid', rows, columns, options);
				//
				// イベントハンドリングとか・・・
				// @see -> https://github.com/mleibman/SlickGrid/wiki/Grid-Events
				//	grid.onDblClick.subscribe(function(e, args){
				//		console.log(e);		// jQuery.Event
				//		console.log(args);	// {row: 4, cell: 2, grid: SlickGrid}
				//	});
				var slickOPT = {
					explicitInitialization: true,			// init() は自分で呼び出す。
					frozenRow: this.ctx.frozenRowCount,			// 固定行数
					frozenColumn: this.ctx.frozenColCount-1,	// 固定列数 -- なぜか 0 オリジン
					showTopPanel: false,			// トップパネル表示可否
					topPanelHeight: 25,				// トップパネル高さ
					enableAddRow: false,
					enableCellNavigation: true,
					enableColumnReorder: false,		// カラム入れ替えは不可！
					syncColumnCellResize: false,	//true

					// Slickgrid 独自拡張
					// - 現在描画しようとするセルを装飾するための css クラスを返す関数を仕込む。
					xCellCssDecorator: this.CellCssDecorator
				};
				var slickGrid = new Slick.Grid(this.$el, dataView, columns, slickOPT);
				this.slickGrid = slickGrid;

//				// 固定行部分の CSS スタイル改変
//				this.slickGrid.addCellCssStyles('frozenRows', function(frozenRowCount, frozenColumn, columns){
//					var colIdCssClassMap = {};
//					for(var i = 0; i < columns.length; i++) {
//						var aCol = columns[i];
//						colIdCssClassMap[aCol.id] = 'cell-title';	// 行ヘッダスタイルを適用するクラス名
//					}
//					var hash = {};
//					for(var i = 0; i < frozenRowCount; i++) {
//						hash[i] = colIdCssClassMap;					// 固定行の範囲すべて行ヘッダスタイルを適用。
//					}
//					return hash;
//				}(slickOPT.frozenRow, slickOPT.frozenColumn, columns));

				// ドラッグ開始イベント
				slickGrid.onDragInit.subscribe(_.bind(function(e, args){
					if(this.contextMenuView.isShowing()){
						this.contextMenuView.hide();
					}
				}, this));

				// クリックイベント
				slickGrid.onClick.subscribe(this.onSlickGridClick);

				// コンテキストメニュー
				slickGrid.onContextMenu.subscribe(this.onContextMenu);

				// スクロールイベント
				slickGrid.onScroll.subscribe(_.bind(function(e,args){
					if(this.contextMenuView.isShowing()){
						this.contextMenuView.hide();
					}
				}, this));

				// ★★★ セレクションモデル
				var cellSelectionModel = new Slick.CellSelectionModel({selectActiveCell:false}/*アクティブCellはナシで。*/);
				cellSelectionModel.onSelectedRangesChanged.subscribe(this.onSlickGridSelectedRangesChanged);
				this.slickCellSelectionModel = cellSelectionModel;
				slickGrid.setSelectionModel(cellSelectionModel);

				// wire up model events to drive the grid
				dataView.onRowCountChanged.subscribe(function(e, args){
					//console.log('dataView.onRowCountChanged()');
					slickGrid.updateRowCount();
					slickGrid.render();
				});
				dataView.onRowsChanged.subscribe(function(e, args){
					//console.log('dataView.onRowsChanged()');
					slickGrid.invalidateRows(args.rows);
					slickGrid.render();
				});

				// 初期化実行
				slickGrid.init();

			}

			return this;
		},

		// SlickGrid 上セルのクリックイベント
		onSlickGridClick: function(e, args){

			// コンテキストメニューは強制排除
			if(this.contextMenuView.isShowing()){
				this.contextMenuView.hide();
				e.stopImmediatePropagation();
				return;
			}

			var $target = $(e.target);
			// ドリルダウンボタンのクリック
			if($target.hasClass('toggle')){
				var aRow = this.slickDataView.getItem(args.row);
				if(aRow){
					var vLeaf = aRow.vLeaf;
					var updateItemImmediatly = true;
					if(!vLeaf._collapsed){
						// 閉じる
						vLeaf._collapsed = true;
					}else{
						// 開く
						if(vLeaf.isLeaf()){
							// 子要素が未取得なら、子要素ＧＥＴして行挿入する。
							var succeededArgs = _.extend({
								//↓継承したプロパティはこの３つ。
								//row: rowIndex,		// 行インデックス
								//cell: colIndex,		// 列インデックス
								//grid: slickgrid,		// SlickGrid インスタンス
								item: aRow,				// イベント発火元の木構造ノード
								vAxLeaf: aRow.vLeaf		// イベント発火元の軸要素
							}, args);
							var deferd = this.anaProc.doDrillDown(vLeaf);
							deferd.done(_.bind(function(data){
								// 子要素取得成功！
								this.insertDrilldownData(succeededArgs, data);
							}, this));
							deferd.fail(_.bind(function(data){
								// エラーハンドリング ... エコーバックエリアにメッセージ表示する。
								console.error(data);
								clutil.mediator.trigger('onTicker', data);
							}, this));
							updateItemImmediatly = false;
						}else{
							vLeaf._collapsed = false;
						}
					}
					if(updateItemImmediatly){
						// 子要素取しなくてよいのでただちに更新。
						// この契機で、Formatter が呼び出される
						this.slickDataView.updateItem(aRow.id, aRow);
					}
				}
				// イベントの伝播を止める
				e.stopImmediatePropagation();
			}else{
				// e
				// args: {
				//    row: 行数
				//    cell: 列数
				//    grid: SlickGrid
				// }

				// 1軸 or (2軸かつ表示項目並び＝よこ）の場合、かつ、表頭表示項目Leafでのクリックは、
				// ソートイベントとして扱う。
				// 表側（コーナーを除く）とセル部分のクリックはセル選択イベントとして扱う。
				if(args.row === this.ctx.frozenRowCount-1
							&& args.cell >= this.ctx.frozenColCount
							&& (_.isNullOrUndefined(this.ctx.hAxisRoot) || this.ctx.dispopt.disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_H)){
					// 固定列の最下層のクリック（表示項目Leaf層を見込んで）、かつ、右上部分のクリック、
					//		かつ、（１軸 OR (２軸かつ表示項目並び＝よこ))

					var aColumn = args.grid.getColumns()[args.cell];
					var hLeaf = aColumn.hLeaf;
					var dLeaf = aColumn.dLeaf;
					var sortOrder = function($target){
						var sortOrder = Ana.Const.sortOrder.asc;
						if($target.hasClass(Ana.Const.sortOrder.asc.className)){
							sortOrder = Ana.Const.sortOrder.dsc;
						}
						return sortOrder;
					}($target);

					var sortReq;
					if(hLeaf){
						// ２軸＆表示項目並び＝横
						var hAxIndex = _.indexOf(this.anaProc.savedResult.anaHAxisElem, hLeaf.data);
						sortReq = {
							idx: hAxIndex,
							dispitem_id: dLeaf.data.dispitem_id,
							order: sortOrder.value
						};
					}else{
						// １軸
						sortReq = {
							idx: 0,
							dispitem_id: dLeaf.data.dispitem_id,
							order: sortOrder.value
						};
					}
					this._onContextMenuItemSelected(sortOrder, sortReq);
				}else{
					// １セル選択の伝播
					var selectedArgs = {
						fromRow: args.row,
						fromCell: args.cell,
						toRow: args.row,
						toCell: args.cell,
						contains: function(r,c){
							return (r === args.row) && (c === args.cell);
						},
						isSingleCell: function(){
							return true;
						},
						isSingleRow: function(){
							return true;
						},
						toString: function(){
							return '('+ args.row + ':' + args.cell +')';
						}
					};
					this.onSlickGridSelectedRangesChanged(e, [selectedArgs]);
				}
				// イベントの伝播を止める
				e.stopImmediatePropagation();
			}
		},

		/**
		 * ドリルダウン結果データを挿入する。
		 * 内部データを更新するだけ。
		 */
		insertDrilldownData: function(drilledinfo, resp){
			//drilledinfo = {
			//	//row: rowIndex,		// 行インデックス
			//	//cell: colIndex,		// 列インデックス
			//	//grid: slickgrid,		// SlickGrid インスタンス
			//	//item: aRow,				// イベント発火元の木構造ノード
			//	//vAxLeaf: aRow.vLeaf,		// イベント発火元の軸要素
			//	//slickDataView: slickdataview
			//}

			//rsp = {
			//	anaAxisDisp: Array[2]			X 見ない -- 現在設定中のものと同一のはずだから。
			//	anaCellData: Array[32]		★
			//	anaHAxisAttr: Array[0]			X 見ない
			//	anaHAxisAttrDisp: Array[0]		X 見ない
			//	anaHAxisElem: Array[8]			X 見ない -- 現在設定中のものと同一のはずだから。
			//	anaVAxisAttr: Array[0]			X 見ない
			//	anaVAxisAttrDisp: Array[0]		X 見ない
			//	anaVAxisElem: Array[4]		★
			//	head: Object					X 見ない
			//	memblist: Object				X 見ない
			//	pageRsp: Object					X 見ない
			//}

			// 1. vid を底上げする。
			var basevid = this.ctx.vAxisMaxId;
			for(var i = 0; i < resp.anaVAxisElem.length; i++){
				var vAxElem = resp.anaVAxisElem[i];
				vAxElem.id += basevid;
				if(vAxElem.pid > 0){
					vAxElem.pid += basevid;
				}
				if(this.ctx.vAxisMaxId < vAxElem.id){
					// 最大の縦軸IDも更新しておく。
					this.ctx.vAxisMaxId = vAxElem.id;
				}
			}
			for(var i = 0; i < resp.anaCellData.length; i++){
				var cellData = resp.anaCellData[i];
				if(_.isNumber(cellData.vid)){
					cellData.vid += basevid;
				}
			}

			var trutil = this.treeBuilder;
			var drillNode = drilledinfo.vAxLeaf;

			// 2. 縦軸の部分ツリーを作り、イベント発火元ノード下の子要素に置く。
			var tmpAxisRoot = new Ana.Util.TreeNode({id:0,name:'tmpAxisRoot'});		// 仮のROOTノード
			var vAxisIdMap = trutil.buildIdTreeNodeMap(tmpAxisRoot, resp.anaVAxisElem);
			trutil.buildTree(vAxisIdMap);

			// 3. 部分リーフノード配列を取る。
			var subVAxisLeafNodeSArray = tmpAxisRoot.buildAxLeafNodeArray();

			// 4. 部分リーフノード配列の各要素に、
			var maxAttr = function(anaProc, kind){
				var condAxElem = anaProc.savedCond.axKindVAxisMap[kind];
				if(condAxElem){
					return anaProc.getDrilldownMaxlv(condAxElem.kind, condAxElem.func_id);
				}
				return 0;
			}(this.anaProc, drillNode.data.kind);
			var trigedIndex = _.indexOf(this.ctx.vAxisLeafNodeArray, drillNode);
			for(var i = 0; i < subVAxisLeafNodeSArray.length; i++){
				var lfNode = subVAxisLeafNodeSArray[i];
				// 4-1) ドリルダウン発火元ノード vLeaf の子に部分リーフノードを付け加える。
				drillNode.appendChild(lfNode);
				// 4-2) 部分リーフノードの親 pid を発火元ノードの id 値に付替える。＆ 挿入ノードの level 値を補正。
				lfNode.data.pid = drillNode.data.id;
				lfNode.level = drillNode.level+1;
				// 4-3) 折り畳みフラグ _collapsed を足す。
				if(lfNode.data.attr < maxAttr){
					lfNode._collapsed = true;					// [+] 折り畳みフラグ
				}

				// 4-4) 本隊リーフノード配列にドリルダウン子要素を追加する
				this.ctx.vAxisLeafNodeArray.splice(trigedIndex+1+i, 0, lfNode);
			}

			// 5. ドリルダウン発火元の折り畳みフラグを設定する。
			drillNode._collapsed = drillNode.isLeaf();

			// 6. セルデータ追加分を本隊へマージする。
			this.ctx.cellMap.push(resp.anaCellData);

			// --- ↑ここまで、データ整理、↓ここからグリッドビュー更新 ------------------------- //

			// 7. slickdataview 型の挿入レコード配列をつくる。
			var insRows = trutil.buildSlickDataRows(this.slickGrid.getColumns(), this.ctx, drillNode);

			// 8. slickdataview へドリルダウンデータを挿入してviewの更新を掛ける
			var insRowIndex = this.slickDataView.getIdxById(drilledinfo.item.id);
			if(drilledinfo.item.dLeaf){
				// 表示項目並び[たて] ⇒ 挿入位置を補正。表示項目リーフ数ずらす。
				insRowIndex += this.ctx.dispLeafArray.length;
			}else{
				insRowIndex += 1;
			}
			this.slickDataView.beginUpdate();
			for(var i = 0; i < insRows.length; i++){
				var rowData = insRows[i];
				this.slickDataView.insertItem(insRowIndex+i, rowData);
			}
			this.slickDataView.updateItem(drilledinfo.item.id, drilledinfo.item);
			this.slickDataView.endUpdate();
		},

		// コンテキストメニューハンドリング
		// ソートのコンテキストメニューを表示する。
		// コンテキストメニュー表示条件は、
		// 1) ２軸あること
		// 2) 表示項目が縦軸についていること
		// 3) セル領域でイベントが発生したこと
		onContextMenu: function(e, args){
			e.preventDefault();

			// 1) ２軸あること
			if(_.isNullOrUndefined(this.ctx.hAxisRoot)){
				// １軸
				return;
			}

			// 2) 表示項目が縦軸についていること
			if(this.ctx.dispopt.disp_way !== amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_V){
				// 表示項目が横軸にある
				return;
			}

			// 3) セル領域でイベントが発生したこと
			// cell: {row: 行インデックス, cell: カラムインデックス}
			var cell = args.grid.getCellFromEvent(e);
			if(cell.row < this.ctx.frozenRowCount || cell.cell < this.ctx.frozenColCount ){
				return;
			}

			// 4) ドリルダウンの挿入行中にはソートのコンテキストメニューを表示しない。
			var aRow = this.slickDataView.getItems()[cell.row];
			var vLeaf = aRow.vLeaf;
			var dLeaf = aRow.dLeaf;

			// ドリルダウン行ではソートコンテキストメニューは選べない！
			if(vLeaf.level > this.ctx.vAxisMaxLevel){
				return;
			}

			// 列リーフ要素のインデックス
			var colDef = args.grid.getColumns()[cell.cell];
			var hLeaf = colDef.hLeaf;
			var hAxIndex = _.indexOf(this.anaProc.savedResult.anaHAxisElem, hLeaf.data);
			var sortReq = {
				idx: hAxIndex,
				dispitem_id: dLeaf.data.dispitem_id,
				// 並び順はデフォルトを（昇順）として設定しておく。
				// コンテキストメニューからのユーザの選択で変更される。
				order: Ana.Const.sortOrder.asc.value
			};

			// コンテキストメニューを表示
			var dsc1 = Ana.Util.axisElemToString(vLeaf.data);
			var dsc2 = function(dLeaf){
				var xx = [];
				var node = dLeaf;
				while(!node.isRoot()){
					xx.push(node.data.name);
					node = node.parent;
				}
				if(xx.length === 1){
					return xx[0];
				}else{
					return xx.reverse().join(' / ');
				}
				return (xx.length > 1) ? xx[0] : xx.reverse().join(' / ');
			}(dLeaf);
			this.contextMenuView.show([dsc1, dsc2], e.pageX, e.pageY, sortReq);
		},

		/**
		 * ソート：コンテキストメニュー｛｝のどちらかが選択された
		 */
		_onContextMenuItemSelected: function(sortOrder, sortReq, view){
			var deferd = this.anaProc.doSearchWithSortReq(sortReq);
			deferd.done(_.bind(function(data){
				// 分析正常終了を通知しないと、結果表示DataGridViewへ結果データが注入されない。
				this.anaProc.trigger('onSearchCompleted', this.anaProc);
			}, this));
			deferd.fail(_.bind(function(data){
				// エコーバックエリアにメッセージ表示
				console.error(data);
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		// 選択範囲変更イベントを受け、セル選択処理を行う。
		onSlickGridSelectedRangesChanged: function(e, args){
			// セル選択変更通知はココで察知する！

			// コンテキストメニューは強制排除
			if(this.contextMenuView.isShowing()){
				this.contextMenuView.hide();
			}

			var argRange = args[0];
			if(argRange){
				// 始点の選択状態をとる。始点選択値のトグルを、選択範囲のセル全部に適用する。
				var stPoint = this.slickCellSelectionModel.xFrom;
				if(argRange.isSingleCell() || !stPoint){
					stPoint = {row: argRange.fromRow, cell: argRange.fromCell};
				}

				if(argRange.fromRow < this.ctx.frozenRowCount && argRange.fromCell < this.ctx.frozenColCount){
					// 左上コーナーの選択イベント。無視しておく。（OR 全選択トグルにするか？）
					return;
				}else if(argRange.fromRow >= this.ctx.frozenRowCount && argRange.fromCell >= this.ctx.frozenColCount){
					// ---------------------------------------------
					// セル領域の選択イベント
					// ---------------------------------------------
					if(_.isNullOrUndefined(this.ctx.hAxisRoot)){
						// １軸
						var wkMap = {};
						for(var realRowIndex = argRange.fromRow; realRowIndex <= argRange.toRow; realRowIndex++){
							var slickRow = this.slickDataView.getItem(realRowIndex);
							if(slickRow && slickRow.vLeaf){
								var vIniLeaf = slickRow.vLeaf.findIniLeaf();
								var axNode = vIniLeaf.data;
								wkMap[axNode.id] = axNode.id;
							}
						}

						// 始点行で選択セルが存在するかどうかを確認。
						// 選択セルが存在する場合は、選択行の selected フラグを落とす。
						// 選択セルが存在しない場合は、選択行の selected フラグを上げる。
						var selectFlag = function(slickDataView, realRowIndex, ctx){
							var selected = false;
							var slickRow = slickDataView.getItem(realRowIndex);
							if(slickRow.vLeaf && slickRow.vLeaf.data){
								var vLeaf = slickRow.vLeaf;
								var iniVLeaf = vLeaf.findIniLeaf();
								var vid = iniVLeaf.data.id;
								selected = ctx.selectedCellSet.containsKey(vid, 0, 0);
							}
							return selected;
						}(this.slickDataView, stPoint.row, this.ctx);

						for(var key in wkMap){
							var vid = wkMap[key];
							if(!selectFlag){
								this.ctx.selectedCellSet.pushKey(vid,0,0);
							}else{
								this.ctx.selectedCellSet.removeKey(vid,0,0);
							}
						}
					}else{
						// ２軸
						var wkMap = new Ana.Util.CellMap();
						var wkVIdMap = {};
						for(var realRowIndex = argRange.fromRow; realRowIndex <= argRange.toRow; realRowIndex++){
							var slickRow = this.slickDataView.getItem(realRowIndex);
							var vIniLeaf = (slickRow && slickRow.vLeaf) ? slickRow.vLeaf.findIniLeaf() : null;
							var vid = (vIniLeaf && vIniLeaf.data) ? vIniLeaf.data.id : 0;

							for(var realColIndex = argRange.fromCell; realColIndex <= argRange.toCell; realColIndex++){
								var colDef = this.slickGrid.getColumns()[realColIndex];
								var hid = (colDef && colDef.hLeaf && colDef.hLeaf.data) ? colDef.hLeaf.data.id : 0;
								wkMap.pushKey(vid,hid,0);
								wkVIdMap[vid] = vid;
							}
						}

						// 始点セルでのセル選択状態
						var selectFlag = function(slickGrid, slickDataView, stPoint, ctx){
							var selected = false;
							var vid = 0, hid = 0;

							var slickRow = slickDataView.getItem(stPoint.row);
							if(slickRow && slickRow.vLeaf && slickRow.vLeaf.data){
								var vLeaf = slickRow.vLeaf;
								var vIniLeaf = vLeaf.findIniLeaf();
								vid = vIniLeaf.data.id;
							}

							var colDef = slickGrid.getColumns()[stPoint.cell];
							if(colDef && colDef.hLeaf && colDef.hLeaf.data){
								var hLeaf = colDef.hLeaf;
								hid = (hLeaf && hLeaf.data) ? hLeaf.data.id : 0;
							}

							selected = ctx.selectedCellSet.containsKey(vid,hid,0);
							return selected;
						}(this.slickGrid, this.slickDataView, stPoint, this.ctx);

						// セル選択/選択解除を記録：ctx.selectedCellSet
						var cells = wkMap.values();
						for(var i = 0; i < cells.length; i++){
							var cell = cells[i];
							if(!selectFlag){
								// 選択
								this.ctx.selectedCellSet.push(cell);
							}else{
								// 解除
								this.ctx.selectedCellSet.removeKey(cell.vid,cell.hid,0);
							}
						}
					}
				}else if(argRange.fromRow >= this.ctx.frozenRowCount){
					// ---------------------------------------------
					// 表側の選択イベント - 行選択のように振る舞わせる。
					// ---------------------------------------------
					var wkMap = {};		// 選択範囲の vid を溜める。
					for(var realRowIndex = argRange.fromRow; realRowIndex <= argRange.toRow; realRowIndex++){
						var slickRow = this.slickDataView.getItem(realRowIndex);
						if(slickRow && slickRow.vLeaf){
							// ドリルダウンで追加されたノードは、初期 Leaf まで親を辿る
							var vIniLeaf = slickRow.vLeaf.findIniLeaf();
							var axNode = vIniLeaf.data;
							wkMap[axNode.id] = axNode.id;
						}
					}

					// 始点行で選択セルが存在するかどうかを確認。
					// 選択セルが存在する場合は、選択行の selected フラグを落とす。
					// 選択セルが存在しない場合は、選択行の selected フラグを上げる。
					var selectFlag = function(slickDataView, realRowIndex, ctx){
						var selected = false;
						var slickRow = slickDataView.getItem(realRowIndex);
						if(slickRow.vLeaf && slickRow.vLeaf.data){
							var vLeaf = slickRow.vLeaf;
							var iniVLeaf = vLeaf.findIniLeaf();
							var vid = iniVLeaf.data.id;
							if(_.isNullOrUndefined(ctx.hAxisRoot)){
								// １軸
								selected = ctx.selectedCellSet.containsKey(vid, 0, 0);
							}else{
								// ２軸
								for(var hLeafIndex = 0; hLeafIndex < ctx.hAxisLeafNodeArray.length; hLeafIndex++){
									var hLeaf = ctx.hAxisLeafNodeArray[hLeafIndex];
									var hid = hLeaf.data.id;
									if(ctx.selectedCellSet.containsKey(vid,hid,0)){
										selected = true;
										break;
									}
								}
							}
						}
						return selected;
					}(this.slickDataView, stPoint.row, this.ctx);

					// セル選択/選択解除を記録：ctx.selectedCellSet
					if(_.isNullOrUndefined(this.ctx.hAxisRoot)){
						// １軸
						// 選択縦軸ループ - vid を回す
						for(var key in wkMap){
							// 選択フラグを記録する。
							var vid = wkMap[key];
							if(!selectFlag){
								this.ctx.selectedCellSet.pushKey(vid,0,0);
							}else{
								this.ctx.selectedCellSet.removeKey(vid,0,0);
							}
						}
					}else{
						// ２軸
						// 選択縦軸ループ - vid を回す
						for(var key in wkMap){
							// 横軸ループ - hid を回す
							var vid = wkMap[key];
							for(var hAxIndex = 0; hAxIndex < this.ctx.hAxisLeafNodeArray.length; hAxIndex++){
								var hLeaf = this.ctx.hAxisLeafNodeArray[hAxIndex];
								var hid = hLeaf.data.id;
								// 選択フラグを記録する。
								if(!selectFlag){
									this.ctx.selectedCellSet.pushKey(vid,hid,0);
								}else{
									this.ctx.selectedCellSet.removeKey(vid,hid,0);
								}
							}
						}
					}
				}else{
					// ---------------------------------------------
					// 表頭の選択イベント - 列選択のように振る舞わせるか？？？
					// ---------------------------------------------
					if(_.isNullOrUndefined(this.ctx.hAxisRoot)){
						// 1軸：１軸での表頭クリックはセル選択ナシで。
						return;
					}

					var wkMap = {};		// 選択範囲の vid を集める。
					if(argRange.fromRow < this.ctx.hAxisMaxLevel){
						var wkMap2 = {};	// 選択範囲の vid（リーフじゃないノードのvid）を集める

						// 表頭、横軸の領域でセル選択した
						var selectedTopLevel = argRange.fromRow + 1;
						for(var realColIndex = argRange.fromCell; realColIndex <= argRange.toCell; realColIndex++){
							var colDef = this.slickGrid.getColumns()[realColIndex];
							var hLeaf = colDef.hLeaf;
							if(!hLeaf || !hLeaf.data){
								continue;
							}
							if(selectedTopLevel >= hLeaf.level){
								// 表示項目の階層にある場合。
								// リーフをそのまま利用
								wkMap[hLeaf.data.id] = hLeaf.data.id;
							}else{
								// 選択開始行の階層のノードをとってきて、配下の横軸リーフノードを集める。
								// selectedTopLevel < hLeaf.level
								var hSelectedTopNode = hLeaf.findParentByLevel(selectedTopLevel);
								if(hSelectedTopNode){
									if(hSelectedTopNode.isAxLeaf()){
										// リーフをそのまま利用。
										wkMap[hSelectedTopNode.data.id] = hSelectedTopNode.data.id;
									}else{
										// 配下のリーフノードをかき集める
										wkMap2[hSelectedTopNode.data.id] = hSelectedTopNode.data.id;
									}
								}
							}
						}
						// wkMap2 → wkMap マージ
						for(var key in wkMap2){
							var nVid = wkMap2[key];
							// 当該ノード配下のリーフを集めてくる。
							var hAxNode = this.ctx.hAxisIdMap[nVid];
							if(hAxNode){
								// hAxNode 下で部分リーフノード配列をつくる
								var subLeafArray = hAxNode.buildAxLeafNodeArray();
								for(var i = 0; i < subLeafArray.length; i++){
									var leaf = subLeafArray[i];
									wkMap[leaf.data.id] = leaf.data.id;
								}
							}
						}
					}else{
						// 表示項目（横）の領域でセル選択した
						// 直近のリーフノード階層を選択範囲とする。
						for(var realColIndex = argRange.fromCell; realColIndex <= argRange.toCell; realColIndex++){
							var colDef = this.slickGrid.getColumns()[realColIndex];
							var hLeaf = colDef.hLeaf;
							if(hLeaf && hLeaf.data){
								wkMap[hLeaf.data.id] = hLeaf.data.id;
							}
						}
					}

					// 始点のセル選択状況
					var selectFlag = function(slickGrid, slickDataView, stPoint, ctx){
						var realColIndex = stPoint.cell;
						var selectedTopLevel = stPoint.row + 1;
						var colDef = slickGrid.getColumns()[realColIndex];
						if(colDef || colDef.hLeaf){
							var hLeaf = colDef.hLeaf;
							var hSubLeafArray;
							if(hLeaf.level < selectedTopLevel){
								// 子ノード
								hSubLeafArray = [ hLeaf ];
							}else{
								var hSelectedTopNode = hLeaf.findParentByLevel(selectedTopLevel);
								if(hSelectedTopNode){
									hSubLeafArray = hSelectedTopNode.buildAxLeafNodeArray();
								}else{
									hSubLeafArray = [];
								}
							}

							for(var i = 0; i < ctx.vAxisLeafNodeArray.length; i++){
								var vLfNode = ctx.vAxisLeafNodeArray[i];
								if(!vLfNode.iniLeaf){
									// ドリルダウン要素のリーフノードはスキップ
									continue;
								}
								if(!vLfNode.data){
									continue;	// データが無い
								}
								var vid = vLfNode.data.id;

								for(var j = 0; j < hSubLeafArray.length; j++){
									var hLfNode = hSubLeafArray[j];
									if(!hLfNode.data){
										continue;
									}
									var hid = hLfNode.data.id;

									if(ctx.selectedCellSet.containsKey(vid,hid,0)){
										return true;
									}
								}
							}
						}
						return false;
					}(this.slickGrid, this.slickDataView, stPoint, this.ctx);

					// セル選択/選択解除を記録：ctx.selectedCellSet
					for(var i = 0; i < this.ctx.vAxisLeafNodeArray.length; i++){
						var vLfNode = this.ctx.vAxisLeafNodeArray[i];
						if(!vLfNode.iniLeaf){
							// ドリルダウン要素のリーフノードはスキップ
							continue;
						}
						if(!vLfNode.data){
							continue;		// データが無い？
						}
						var vid = vLfNode.data.id;

						for(var key in wkMap){
							var hid = wkMap[key];
							// 選択フラグを記録する。
							if(!selectFlag){
								this.ctx.selectedCellSet.pushKey(vid,hid,0);
							}else{
								this.ctx.selectedCellSet.removeKey(vid,hid,0);
							}
						}
					}
				}

				// 再描画を強制する。
				this.slickGrid.invalidate(true);
			}
		},

		/**
		 * セル選択条件を生成する。
		 */
		buildCellSelectReq: function(){
			if(!this.anaProc || !this.ctx){
				return;
			}
			// var vpwkmap = {}, hpwkmap = {};	// 親ノードを辿るときに、既に辿ったマーキングするためのマップ
			var reqArray = new Array();
			var selectedCells = this.ctx.selectedCellSet.values();
			for(var i = 0; i < selectedCells.length; i++){
				var cell = selectedCells[i];
				var req = {
					v_key: {
						n: 0,
						val: _.map(_.range(20), function() {return 0;})
					},
					h_key: {
						n: 0,
						val: _.map(_.range(20), function() {return 0;})
					}
				}

				// 縦軸 --------------------------------------------------------
				var vLeaf = this.ctx.vAxisIdMap[cell.vid];
				var vAxLeaf = (vLeaf && vLeaf.data) ? vLeaf.data : null;
				if(_.isNull(vAxLeaf)){
					console.warn('bad vid: vid[' + cell.vid + '], hid[' + cell.hid + '], skip.');
					continue;
				}

				req.v_key = vAxLeaf.key;

				// var leafReq = {
				// 	is_leaf		: 1,
				// 	v_axis_kind	: vAxLeaf.kind,
				// 	v_axis_attr	: vAxLeaf.attr,
				// 	v_axis_val	: vAxLeaf.val,
				// 	vid			: vAxLeaf.id,
				// 	vpid		: vAxLeaf.pid
				// };
				// // 親を辿る：たて
				// var abort = false;
				// var vNode = vLeaf.parent;
				// while(!vNode.isRoot()){
				// 	var vAxNode = vNode.data;
				// 	if(vAxNode){
				// 		if(vpwkmap[vAxNode.id]){
				// 			// 処理済み
				// 		}else{
				// 			// vpwkmap にプールしておく。
				// 			vpwkmap[vAxNode.id] = {
				// 				v_axis_kind	: vAxNode.kind,
				// 				v_axis_attr	: vAxNode.attr,
				// 				v_axis_val	: vAxNode.val,
				// 				vid			: vAxNode.id,
				// 				vpid		: vAxNode.pid
				// 			};
				// 		}
				// 	}else{
				// 		abort = true;
				// 		console.warn('lost vAxis parent: vid[' + cell.vid + '], hid[' + cell.hid + '], skip');
				// 		break;
				// 	}
				// 	vNode = vNode.parent;
				// }
				// if(abort){
				// 	continue;
				// }

				// 横軸 --------------------------------------------------------
				if(cell.hid !== 0){
					var hLeaf = this.ctx.hAxisIdMap[cell.hid];
					var hAxLeaf = (hLeaf && hLeaf.data) ? hLeaf.data : null;
					if(_.isNull(hAxLeaf)){
						console.warn('bad hid: vid[' + cell.vid + '], hid[' + cell.hid + '], skip.');
						continue;
					}

					req.h_key = hAxLeaf.key;

					// _.extend(leafReq, {
					// 	h_axis_kind	: hAxLeaf.kind,
					// 	h_axis_attr	: hAxLeaf.attr,
					// 	h_axis_val	: hAxLeaf.val,
					// 	hid			: hAxLeaf.id,
					// 	hpid		: hAxLeaf.pid
					// });

					// // 親を辿る：よこ
					// var hNode = hLeaf.parent;
					// while(!hNode.isRoot()){
					// 	var hAxNode = hNode.data;
					// 	if(hAxNode){
					// 		if(hpwkmap[hAxNode.id]){
					// 			// 処理済
					// 		}else{
					// 			// hpwkmap にプールしておく。
					// 			hpwkmap[hAxNode.id] = {
					// 				h_axis_kind	: hAxNode.kind,
					// 				h_axis_attr	: hAxNode.attr,
					// 				h_axis_val	: hAxNode.val,
					// 				hid			: hAxNode.id,
					// 				hpid		: hAxNode.pid
					// 			};
					// 		}
					// 	}else{
					// 		abort = true;
					// 		console.warn('lost hAxis parent: vid[' + cell.vid + '], hid[' + cell.hid + '], skip');
					// 		break;
					// 	}
					// }
					// if(abort){
					// 	continue;
					// }
				}

				// reqArray.push(leafReq);
				reqArray.push(req);
			}

			// // 親ノードをマージする
			// if(!_.isEmpty(vpwkmap)){
			// 	for(var k in vpwkmap){
			// 		reqArray.push(vpwkmap[k]);
			// 	}
			// }
			// if(!_.isEmpty(hpwkmap)){
			// 	for(var k in hpwkmap){
			// 		reqArray.push(hpwkmap[k]);
			// 	}
			// }

			return reqArray;
		},

		status: 'active',	// デフォルトは表示中（初期表示で結果Viewが表示されているので）
		size: {				// サイズパラメタ
			minHeight:	370,
			dh: (210+20)	// window 高さから(SlickGrid適切height)の差分
		},

		// 休止する
		onPause: function(){
			// コピーモードにスイッチした
			var stat = 'pause';
			if(this.status != stat){
				this.status = stat;
				var $w = $(window);
				this.size.win_width = $w.innerWidth();
				this.size.win_height = $w.innerHeight();
				this.size.el_height = this.$el.height();
				this.size.el_width = this.$el.width();
			}
			return this;
		},

		// 再開する
		onResume: function(){
			// 結果表示モードに復帰してきた
			var stat = 'active';
			if(this.status != stat){
				this.status = stat;
				this.setPreferredSize();
			}
			return this;
		},
		// リサイズする
		setPreferredSize: function(){
			var $w = $(window);
			var win_h = $w.innerHeight();
			var win_w = $w.innerWidth();
			var el_h = this.$el.height();
			var el_w = this.$el.width();

			var preferredHeight = Math.max((win_h - this.size.dh), this.size.minHeight);

			// ↓高さ算出が甘いみたいで、毎回 ±2 くらいの誤差でリサイズコースに入ってしまう。
			//   とりあえず、毎回リサイズで様子をみてみる。
			if(el_h != preferredHeight || el_w != this.size.el_width){
				// サイズ変更された → リサイズ
				//console.log('ResuleView: resize: (h,w)=(' + h + ',' + el_w + ')');

				// 高さ調整（幅は auto で伸びるため何もしない）
				this.$el.height(preferredHeight);

				// サイズパラメタ保存
				this.size.win_height = win_h;
				this.size.win_width = win_w;
				this.size.el_height = el_h;
				this.size.el_width = el_w;

				// SlickGrid リサイズ
				if(this.slickGrid){
					this.slickGrid.resizeCanvas();
				}
			}
			return this;
		},
		_eof: 'end of Ana.ResultDataGridView//'
	});


	/**
	 * 分析結果コピー用グリッドビュー
	 */
	Ana.ResultCopyGridView = Backbone.View.extend({
		initialize: function(opt) {
			_.bindAll(this);
		},

		setData: function(ctx){
			if(_.isNullOrUndefined(ctx)){
				this.ctx = null;
				return;
			}

			// シャローコピー
			var ctx = _.clone(ctx);

			// ctx.vAxLeafNodeArray を再精査する。
			// ドリルダウン子要素を持っていて閉じているリーフノードは、ドリルダウン子ノードを省く。
			var vAxLeafNodeArray = _.reduce(ctx.vAxisLeafNodeArray, function(array, axLeaf){
				if(array._drillcount && array._drillcount > 0){
					array._drillcount--;
				}else{
					if(axLeaf._collapsed){
						// 閉じている - 配下の子/孫リーフノード数回スキップする
						// 係数 -1 は、自分自身なので、差引いておく。
						array._drillcount = axLeaf.axLeafCount() -1;
					}
					if(!array._maxLvLeaf || array._maxLvLeaf.level < axLeaf.level ||
						// コードがあるものを優先する #20150916
						array._maxLvLeaf.data == null ||
						array._maxLvLeaf.data.code == null ||
						array._maxLvLeaf.data.code.length == 0 ){
						// どうかと思うが、"合計"はコードを持たないので除外する #20150513
						if(axLeaf.data != null && axLeaf.data.name != null &&
						   axLeaf.data.name != "合計"){
							array._maxLvLeaf = axLeaf;
						}
					}
					array.push(axLeaf);
				}
				return array;
			}, []);

			// 新しい MaxLv をセット -- 開いているドリルダウンリーフノードの考慮
			if(vAxLeafNodeArray._maxLvLeaf){
				var leafNode = vAxLeafNodeArray._maxLvLeaf;
				ctx.vAxisMaxLvLeaf = leafNode;
				ctx.vAxisMaxLevel = leafNode.level;
			}else{
				// データがひとつもない
				ctx.vAxisMaxLvLeaf = null;
				ctx.vAxisMaxLevel = 0;
			}
			// テンポラリ作業領域を削除
			delete vAxLeafNodeArray._maxLvLeaf;
			delete vAxLeafNodeArray._drillcount;

			// コード付き縦軸ノード数を数える
			var hasCodeMap = [];
			var codeCount = 0;
			var node = ctx.vAxisMaxLvLeaf;
			if(node != null){
				while(!node.isRoot()){
					var axElem = node.data;
					if(axElem && _.isString(axElem.code) && !_.isEmpty(axElem.code)){
						hasCodeMap[node.level] = true;
						codeCount++;
					}else{
						hasCodeMap[node.level] = false;
					}
					node = node.parent;
				}
			}
			ctx.vAxisHasCodeMap = hasCodeMap;
			ctx.vAxisHasCodeMap_n = codeCount;

			// 行数ｘ列数 -- frozenRowCount, frozenColCount は実際の固定行×列には用いない。
			ctx.frozenColCount = (1 + codeCount + ctx.vAxisMaxLevel);	// +1(行番号列) + codeCount(縦軸要素コード列) + 縦軸最大Lv
			if(ctx.hAxisRoot && ctx.dispopt.disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_V){
				// ２軸：表示並び＝たて
				ctx.frozenColCount += ctx.dispMaxLevel;
			}
			if (ctx.vAxAttr && ctx.vAxAttr.dspList) {
				ctx.frozenColCount += ctx.vAxAttr.dspList.length;
			}

			// 縦軸リーフノード配列を挿げ替える
			ctx.vAxisLeafNodeArray = vAxLeafNodeArray;

			// 横軸にもコード表示対応 ---------------------------------
			hasCodeMap = [];
			codeCount = 0;
			if(_.isNullOrUndefined(ctx.hAxisRoot)){
				// １軸 - 表示項目展開なのでコード持ちノードは絶対に出てこない
				;//ctx.frozenRowCount += ctx.dispMaxLevel;
			} else {
				// ２軸 - コード行増し分再計算
				// コード付き横軸ノード数を数える
				ctx.hAxisMaxLvLeaf = _.find(ctx.hAxisLeafNodeArray, function(lfNode){
					return lfNode.level == ctx.hAxisMaxLevel
						&& (lfNode.data && lfNode.data.type == amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_NORMAL);
				});
				node = ctx.hAxisMaxLvLeaf;
				if (node != null) {
					while(!node.isRoot()){
						var axElem = node.data;
						if (axElem && _.isString(axElem.code) && !_.isEmpty(axElem.code)) {
							hasCodeMap[node.level] = true;
							codeCount++;
						}else{
							hasCodeMap[node.level] = false;
						}
						node = node.parent;
					}
				}
				ctx.hAxisHasCodeMap = hasCodeMap;
				ctx.hAxisHasCodeMap_n = codeCount;
				ctx.frozenRowCount = codeCount + ctx.hAxisMaxLevel;
				if (ctx.hAxisRoot
						&& (ctx.dispopt.disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_H
								|| ctx.dispopt.disp_way === amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_H_DIAGG)) {
					// ２軸：表示項目並び＝よこor表示項目集約
					ctx.frozenRowCount += ctx.dispMaxLevel;
				}
			}

			// ctx インスタンス保持
			this.ctx = ctx;
		},
		// 行番号用のフォーマッター
		LinenoCellFormatter: function(rowIndex, cell, value, columnDef, aRow){
			return Ana.Util.toXlsRowIndex(rowIndex);
		},
		// 通常セル用のセルフォーマッター
		CellRenderFormatter: function(rowIndex, cell, value, columnDef, aRow){
			value = _.escape(value);
			return value;
		},
		// Slickgrid 独自拡張 - 現在描画しようとするセルを装飾するための css クラスを返す。
		CellCssDecorator: function(rowIndex, colIndex, colspan, colDef, rowData){
			if(rowIndex < this.ctx.frozenRowCount && colIndex > 0){
				return 'cell-title';
			}
			// 縦軸属性(マスタ) - セル部
			if(colDef.attr){
				var align = Ana.Util.cellTextAlignment(colDef.attr);
				return (align == 'left' /* css: default align */) ? null : 'align-' + align;
			}

			// セルテキスト揃え個別設定
			if(rowIndex >= this.ctx.frozenRowCount){
				var cssClasses = [];
				if(colDef.cellCssClass){
					cssClasses.push(colDef.cellCssClass);
				}

				// 右下
				var dLeaf = null;
				if(colDef.dLeaf){
					// １軸 or ２軸(表示項目並び＝よこ)
					dLeaf = colDef.dLeaf;
				}else{
					// ２軸(表示項目並び＝たて)
					dLeaf = rowData.dLeaf;
				}
				if(dLeaf != null){
					var align = Ana.Util.cellTextAlignment(dLeaf.data);
					if(align == 'right' /* css: default align */){
						;
					}else{
						cssClasses.push('align-' + align);
					}
				}

				return _.isEmpty(cssClasses) ? null : cssClasses.join(' ');
			}
			return null;
		},
		// セル全選択
		selectAll: function(){
			if(!this.slickCellSelectionModel){
				return;
			}

			// セル全選択範囲をつくる
			var toRow = this.slickGrid.getDataLength() -1;
			var toCell = this.slickGrid.getColumns().length -1;
			var range = new Slick.Range(0, 1, toRow, toCell);

			// 全選択
			this.slickCellSelectionModel.setSelectedRanges([ range ]);
		},
		render: function(){
			if(this.slickGrid){
				this.slickGrid.destroy();
			}
			this.$el.empty();
			this.setPreferredSize();

			if(!this.ctx){
				this.$el.append('<h1 style="padding: 5px;">←左側の項目より条件を指定してください。</h1>');
			}else{
				// SlickGrid ヘッダ構造をつくる。
				// [A]列めは固定、行番号列
				var columns = function(ctx, rhdCellLineno, cellFmt){
					var columns = new Array();
					var fieldId;

					// |<---------- ここまで共通 ------------------------>|
					// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | ・・・

					// 行番号列
					fieldId = 'lineNo';
					columns.push({
						name: '',		// [slick] ラベルテキスト
						field: fieldId,	// [slick] のプロパティ名
						id: fieldId,	// [slick] 列ID
						cssClass: 'cell-lineno',	// 行番号列スタイルを定義したクラス。
						headerCssClass: 'selectall-handle',
						formatter: rhdCellLineno,
						width: 40,
						selectable: false
					});

					function getVAxAttrColumns(kind) {
						var dispList = new Array();
						if (ctx.vAxAttr == null || ctx.vAxAttr.dspList == null) {
							return dispList;
						}
						switch (kind) {
						case amgbp_AnaDefs.AMGBA_DEFS_KIND_ITGRP:	// 商品分類（これで返ってくるみたい）
						case amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEM:		// 品番（念のためこれも入れておく）
							for(var i=0; i<ctx.vAxAttr.dspList.length; i++){
								var vAttrDsp = ctx.vAxAttr.dspList[i];
								var base = vAttrDsp.dispitem_id & 0x2000FFFF;
								if (base != 0 && (base & 0x1000) && !(base & 0x2000)) {
									dispList.push(vAttrDsp);
								}
							}

							break;
						case amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORITEM:	// カラー商品
							for(var i=0; i<ctx.vAxAttr.dspList.length; i++){
								var vAttrDsp = ctx.vAxAttr.dspList[i];
								var base = vAttrDsp.dispitem_id & 0x2000FFFF;
								if (base != 0 && !(base & 0x1000) && (base & 0x2000)) {
									dispList.push(vAttrDsp);
								}
							}
							break;
						case amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORSIZEITEM:	// JANコード
							for(var i=0; i<ctx.vAxAttr.dspList.length; i++){
								var vAttrDsp = ctx.vAxAttr.dspList[i];
								var base = vAttrDsp.dispitem_id & 0x2000FFFF;
								if (base != 0 && (base & 0x3000)) {
									dispList.push(vAttrDsp);
								}
							}
							break;
						}
						return dispList;
					}
					// 縦軸のカラムヘッダ
					var colIndex = 0;
					var vLfNode = ctx.vAxisMaxLvLeaf;
					for(var lv = 1; lv <= ctx.vAxisMaxLevel; lv++){
						var node = vLfNode.findParentByLevel(lv);
						if(node){
							// 縦軸 コード 列
							if(ctx.vAxisHasCodeMap[lv]){
								fieldId = 'vLv' + node.level + 'Code';
								columns.push({
									name: Ana.Util.toXlsColIndex(colIndex++),
									field: fieldId,
									id: fieldId,
									cssClass: 'cell-title',
									formatter: cellFmt,
									selectable: true
								});
							}
							// 縦軸 Name 列
							fieldId = 'vLv' + node.level + 'Name';
							columns.push({
								name: Ana.Util.toXlsColIndex(colIndex++),
								field: fieldId,
								id: fieldId,
								cssClass: 'cell-title',
								formatter: cellFmt,
								selectable: true
							});

							// このnodeに関係するマスタ項目があればcolumnsに追加する
							if (node.data) {
								var dispList = getVAxAttrColumns(node.data.req_kind);
								for (var i = 0; i < dispList.length; i++) {
									var vAttrDsp = dispList[i];
									var fieldId = 'a' + vAttrDsp.id;
									var width = (vAttrDsp.width == null || vAttrDsp.width <= 0) ? 100 : vAttrDsp.width;
									columns.push({
										attr: vAttrDsp,
										name: Ana.Util.toXlsColIndex(colIndex++),
										field: fieldId,
										id: fieldId,
										cssClass: 'cell-title',
										formatter: cellFmt,
										width: width,
										selectable: true
									});
								}
							}
						}
					}

					// マスタ項目を各軸の右に移動する
					// 軸属性(マスタ項目)
					function buildVAxAttrColumns(){
						for(var i=0; i<ctx.vAxAttr.dspList.length; i++){
							var vAttrDsp = ctx.vAxAttr.dspList[i];
							var fieldId = 'a' + vAttrDsp.id;
							var width = (vAttrDsp.width == null || vAttrDsp.width <= 0) ? 100 : vAttrDsp.width;
							columns.push({
								attr: vAttrDsp,
								name: Ana.Util.toXlsColIndex(colIndex++),
								field: fieldId,
								id: fieldId,
								cssClass: 'cell-title',
								formatter: cellFmt,
								width: width,
								selectable: true
							});
						}
					}
					// 軸属性情報(マスタ項目) - 前置き
//					if(ctx.vAxAttr && ctx.vAxAttr.pos == 'pre'){
//						buildVAxAttrColumns();
//					}

					if(_.isNullOrUndefined(ctx.hAxisRoot)){
						// １軸                                               |<----ココ ・・・
						// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | d1 | d2 | ・・・
						// 表示項目展開
						for(var dIndex = 0; dIndex < ctx.dispLeafArray.length; dIndex++){
							var dspLfNode = ctx.dispLeafArray[dIndex];
							var dto = dspLfNode.data;
							fieldId = 'd' + dto.id;
							columns.push({
								hLeaf: null,
								dLeaf: dspLfNode,
								name: Ana.Util.toXlsColIndex(colIndex++),
								field: fieldId,
								id: fieldId,
								//cssClass: xxxx,
								formatter: cellFmt,
								selectable: true
							});
							/*
							 * TODO
							var col = {
									hLeaf: null,
									dLeaf: dspLfNode,
									name: Ana.Util.toXlsColIndex(colIndex++),
									field: fieldId,
									id: fieldId,
									formatter: cellFmt,
									selectable: true
							};
							if(dto.width && dto.width > 0){
								col.width = dto.width;
							}
							columns.push(col);
							 */
						}
					}else{
						if(ctx.dispopt.disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_V){
							// ２軸：表示項目並び＝たて                           |<-------- ココ ---------->|
							// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | dspItemName | dspCmpName | h1 | h2 | ・・・
							fieldId = 'dspItemName';
							columns.push({
								dLevel: 1,
								name: Ana.Util.toXlsColIndex(colIndex++),
								field: fieldId,
								id: fieldId,
								width: 80,
								cssClass: 'cell-title',
								formatter: cellFmt,
								selectable: true
							});
							if(ctx.dispMaxLevel > 1){
								fieldId = 'dspCmpName';
								columns.push({
									dLevel: 2,
									name: Ana.Util.toXlsColIndex(colIndex++),
									field: fieldId,
									id: fieldId,
									width: 80,
									cssClass: 'cell-title',
									formatter: cellFmt,
									selectable: true
								});
							}

							// 横軸                                                                          |<----ココ ・・・
							// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | dspItemName | dspCmpName | h1 | h2 | ・・・
							for(var hIndex = 0; hIndex < ctx.hAxisLeafNodeArray.length; hIndex++){
								var hLfNode = ctx.hAxisLeafNodeArray[hIndex];
								fieldId = 'h' + hLfNode.data.id;
								columns.push({
									hLeaf: hLfNode,
									name: Ana.Util.toXlsColIndex(colIndex++),
									field: fieldId,
									id: fieldId,
									//cssClass: xxxx,
									formatter: cellFmt,
									selectable: true
								});
							}
						} else if(ctx.dispopt.disp_way === amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_H_DIAGG){
							// ２軸：表示項目並び＝表示項目集約                          |<----ココ ・・・
							// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | h1d1 | h1d2 | ・・・
							for(var dIndex = 0; dIndex < ctx.dispLeafArray.length; dIndex++){
								var dspLfNode = ctx.dispLeafArray[dIndex];
								for(var hIndex = 0; hIndex < ctx.hAxisLeafNodeArray.length; hIndex++){
									var hLfNode = ctx.hAxisLeafNodeArray[hIndex];
									fieldId = 'd' + dspLfNode.data.id + 'h' + hLfNode.data.id;
									columns.push({
										hLeaf: hLfNode,
										dLeaf: dspLfNode,
										name: Ana.Util.toXlsColIndex(colIndex++),
										field: fieldId,
										id: fieldId,
										//cssClass: xxxx,	// データ部の CSS クラス付けは、formatter の中でやる！！
										formatter: cellFmt,
										selectable: true
									});
								}
							}
						}else{
							// ２軸：表示項目並び＝よこ                           |<----ココ ・・・
							// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | h1d1 | h1d2 | ・・・
							for(var hIndex = 0; hIndex < ctx.hAxisLeafNodeArray.length; hIndex++){
								var hLfNode = ctx.hAxisLeafNodeArray[hIndex];
								for(var dIndex = 0; dIndex < ctx.dispLeafArray.length; dIndex++){
									var dspLfNode = ctx.dispLeafArray[dIndex];
									fieldId = 'h' + hLfNode.data.id + 'd' + dspLfNode.data.id;
									columns.push({
										hLeaf: hLfNode,
										dLeaf: dspLfNode,
										name: Ana.Util.toXlsColIndex(colIndex++),
										field: fieldId,
										id: fieldId,
										//cssClass: xxxx,	// データ部の CSS クラス付けは、formatter の中でやる！！
										formatter: cellFmt,
										selectable: true
									});
									/* TODO
									var col = {
											hLeaf: hLfNode,
											dLeaf: dspLfNode,
											name: Ana.Util.toXlsColIndex(colIndex++),
											field: fieldId,
											id: fieldId,
											//cssClass: xxxx,   // データ部の CSS クラス付けは、formatter の中でやる！！
											formatter: cellFmt,
											selectable: true
									};
									if(dspLfNode.data.width && dspLfNode.data.width > 0){
										col.width = dspLfNode.data.width;
									}
									columns.push(col);
									 */
								}
							}
						}
					}

					// 軸属性情報(マスタ項目) - 後置き
					if(ctx.vAxAttr && ctx.vAxAttr.pos == 'post'){
						buildVAxAttrColumns();
					}

					// [cornerLeftTop]: 左上角からの width 定義を反映
					for(var i=0; i<ctx.cornerLeftTop.length; i++){
						if(i > ctx.frozenColCount){
							break;
						}
						var x = ctx.cornerLeftTop[i];
						if(x.width != null && x.width > 0){
							columns[i+1].width = x.width;
						}
						if(!_.isEmpty(x.cellCssClass)){
							columns[i+1].cellCssClass = x.cellCssClass;
						}
					}
					return columns;
				}(this.ctx, this.LinenoCellFormatter, this.CellRenderFormatter);

				// データ部 - SlickGrid ボディ構造をつくる。
				// 表頭部位
				var rows0 = function(ctx, columns){
					var rows = new Array();
					var frozenRowCount = ctx.frozenRowCount;
					var frozenColCount = ctx.frozenColCount;

					// 表頭部位分のオブジェクトを確保
					for(var i = 0; i < frozenRowCount; i++){
						rows.push({
							id: Ana.Util.toXlsRowIndex(i)
						});
					}

					// bitArray の true 個数を数える。
					function countBits(bitArray, from, dir) {
						if (bitArray == null || bitArray.length <= 0) {
							return 0;
						}
						var i, count = 0, len = bitArray.length;
						if (dir >= 0) {
							for (i = from; i < len; i++) {
								if (bitArray[i]) {
									count++;
								}
							}
						} else {
							for (i = from-1; i >= 0; i--) {
								if (bitArray[i]) {
									count++;
								}
							}
						}
						return count;
					};

					if(_.isNullOrUndefined(ctx.hAxisRoot)){
						// 1軸                               frozenColCount ->|
						// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | d1 | d2 | ・・・
						for (var colIdx = 1; colIdx < frozenColCount; colIdx++) {
							var aCol = columns[colIdx];
							if(aCol.attr){
								// 縦軸属性(マスタ)
								var aRow = _.last(rows);
								aRow[aCol.field] = aCol.attr.name;
								continue;
							}
						}
						for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
							var aCol = columns[colIdx];
							if(aCol.attr){
								// 縦軸属性(マスタ)
								var aRow = _.last(rows);
								aRow[aCol.field] = aCol.attr.name;
								continue;
							}
							var dLfNode = aCol.dLeaf;
							var dNode = dLfNode;
							while(!dNode.isRoot()){
								// ラベルテキスト
								var aRow = rows[dNode.level-1];
								aRow[aCol.field] = dNode.data.name;
								dNode = dNode.parent;
							}
						}
					}else{
						// 2軸
						if(ctx.dispopt.disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_V){
							// 表示項目並び＝たて
							// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | dspItemName | dspCmpName | h1 | h2 | ・・・

							// 表示項目ラベル
							lastRow = _.last(rows);
							lastRow.dspItemName = '表示項目';
							if(ctx.dispMaxLevel >= 2){
								lastRow.dspCmpName = '対比項目';
							}

							for(var colIdx = 1; colIdx < frozenColCount; colIdx++){
								var aCol = columns[colIdx];

								// 縦軸属性(マスタ)
								if(aCol.attr){
									var aRow = rows[0];	// 集約の場合は1行目に項目名を出す
									aRow[aCol.field] = aCol.attr.name;
								}
							}

							// 横軸ツリー
							for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
								var aCol = columns[colIdx];
								if(aCol.attr){
									// FIXME ここ対応
									throw '縦軸属性(マスタ): 「表示項目並び＝たて」に縦軸属性(マスタ)表示は不可。';
								}
								var hAxLfNode = aCol.hLeaf;
								var aNode = hAxLfNode;

								while(!aNode.isRoot()){
									var codeRowIndex = -1;
									var rowIndex = aNode.level-1;
									var nextRowIndex = rowIndex + 1;
									if (ctx.hAxisHasCodeMap[aNode.level]) {
										// 横軸コードあり
										codeRowIndex = rowIndex + countBits(ctx.hAxisHasCodeMap, aNode.level, -1);
										rowIndex = codeRowIndex + 1;
										nextRowIndex = rowIndex + 1;
										if (ctx.hAxisHasCodeMap[aNode.level+1]) {
											nextRowIndex += 1;
										}
									}
									switch(aNode.data.type){
									case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_SUBTOTAL:
										// １段下に「小計」ラベルをつくる
										if(_.isEmpty(rows[nextRowIndex][aCol.field])){
											rows[nextRowIndex][aCol.field] = '小計';
										}
										// ↓fall through
									case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_TOTAL:
									case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_NORMAL:
									case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_DATA:
										// コードラベル
										if (codeRowIndex >= 0 && (aNode.data && aNode.data.code)) {
											rows[codeRowIndex][aCol.field] = aNode.data.code;
										}
										// ラベルテキスト★
										//rows[aNode.level-1][aCol.field] = Ana.Util.axisElemToString(aNode.data);
										if (aNode.data && aNode.data.name) {
											rows[rowIndex][aCol.field] = aNode.data.name;
										}
										break;
									default:
										// 不明な軸項目種別 type
										console.warn('[横軸] 不明な軸項目種別: ' + aCol);
									}
									aNode = aNode.parent;
								}
							}
						} else if(ctx.dispopt.disp_way === amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_H_DIAGG){
							// 表示項目並び＝よこ(表示項目集約)
							// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | d1h1 | d1h2 | ・・・
							//var baseLv = ctx.hAxisMaxLevel + ctx.hAxisHasCodeMap_n;
							var baseLv = ctx.dispMaxLevel;
							//var nDisp = ctx.dispLeafArray.length;
							for(var colIdx = 1; colIdx < frozenColCount; colIdx++){
								var aCol = columns[colIdx];

								// 縦軸属性(マスタ)
								if(aCol.attr){
									var aRow = rows[0];	// 集約の場合は1行目に項目名を出す
									aRow[aCol.field] = aCol.attr.name;
								}
							}

							// 横軸ツリー
							for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
								var aCol = columns[colIdx];

								// 縦軸属性(マスタ) TODO ここ対応が必要かも
								if(aCol.attr){
									var aRow = rows[0];
									aRow[aCol.field] = aCol.attr.name;
									continue;
								}

								// 表示項目ラベル
								var dLeaf = aCol.dLeaf;
								var dNode = dLeaf;
								while(!dNode.isRoot()){
									// ラベルテキスト★
									//var aRow = rows[baseLv + dNode.level-1];
									var aRow = rows[dNode.level-1];
									aRow[aCol.field] = dNode.data.name;
									dNode = dNode.parent;
								}

								// 横軸ラベル
								var hAxLfNode = aCol.hLeaf;
								var aNode = hAxLfNode;
								while(!aNode.isRoot()){
									var codeRowIndex = -1;
									//var rowIndex = aNode.level-1;
									var rowIndex = aNode.level;
									var nextRowIndex = rowIndex + 1;
									//var aRow = rows[baseLv + rowIndex - 1];
									if (ctx.hAxisHasCodeMap[aNode.level]) {
										// 横軸コードあり
										codeRowIndex = rowIndex + countBits(ctx.hAxisHasCodeMap, aNode.level, -1);
										rowIndex = codeRowIndex + 1;
										nextRowIndex = rowIndex + 1;
										if (ctx.hAxisHasCodeMap[aNode.level+1]) {
											nextRowIndex += 1;
										}
									}
									switch(aNode.data.type){
									case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_SUBTOTAL:
										// １段下に「小計」ラベルをつくる
										if(_.isEmpty(rows[nextRowIndex][aCol.field])){
											rows[nextRowIndex][aCol.field] = '小計';
										}
										// ↓fall through
									case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_TOTAL:
									case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_NORMAL:
									case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_DATA:
										// コードラベル
										if (codeRowIndex >= 0 && (aNode.data && aNode.data.code)) {
											rows[codeRowIndex][aCol.field] = aNode.data.code;
										}
										// ラベルテキスト★
										//rows[aNode.level-1][aCol.field] = Ana.Util.axisElemToString(aNode.data);
										if (aNode.data && aNode.data.name) {
											rows[baseLv + rowIndex - 1][aCol.field] = aNode.data.name;
										}
										break;
									default:
										// 不明な軸項目種別 type
										console.warn('[横軸] 不明な軸項目種別: ' + aCol);
									}
									aNode = aNode.parent;
								}
							}

						}else{
							// 表示項目並び＝よこ
							// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | h1d1 | h1d2 | ・・・
							var baseLv = ctx.hAxisMaxLevel + ctx.hAxisHasCodeMap_n;
							//var nDisp = ctx.dispLeafArray.length;
							for(var colIdx = 1; colIdx < frozenColCount; colIdx++){
								var aCol = columns[colIdx];

								// 縦軸属性(マスタ)
								if(aCol.attr){
									var aRow = _.last(rows);
									aRow[aCol.field] = aCol.attr.name;
								}
							}
							// 横軸ツリー
							for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
								var aCol = columns[colIdx];

								// 縦軸属性(マスタ)
								if(aCol.attr){
									var aRow = _.last(rows);
									aRow[aCol.field] = aCol.attr.name;
									continue;
								}

								// 横軸ラベル
								var hAxLfNode = aCol.hLeaf;
								var aNode = hAxLfNode;
								while(!aNode.isRoot()){
									var codeRowIndex = -1;
									var rowIndex = aNode.level-1;
									var nextRowIndex = rowIndex + 1;
									if (ctx.hAxisHasCodeMap[aNode.level]) {
										// 横軸コードあり
										codeRowIndex = rowIndex + countBits(ctx.hAxisHasCodeMap, aNode.level, -1);
										rowIndex = codeRowIndex + 1;
										nextRowIndex = rowIndex + 1;
										if (ctx.hAxisHasCodeMap[aNode.level+1]) {
											nextRowIndex += 1;
										}
									}
									switch(aNode.data.type){
									case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_SUBTOTAL:
										// １段下に「小計」ラベルをつくる
										if(_.isEmpty(rows[nextRowIndex][aCol.field])){
											rows[nextRowIndex][aCol.field] = '小計';
										}
										// ↓fall through
									case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_TOTAL:
									case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_NORMAL:
									case amgbp_AnaAxisElem.AMGBP_ANA_AXISELEM_TYPE_DATA:
										// コードラベル
										if (codeRowIndex >= 0 && (aNode.data && aNode.data.code)) {
											rows[codeRowIndex][aCol.field] = aNode.data.code;
										}
										// ラベルテキスト★
										//rows[aNode.level-1][aCol.field] = Ana.Util.axisElemToString(aNode.data);
										if (aNode.data && aNode.data.name) {
											rows[rowIndex][aCol.field] = aNode.data.name;
										}
										break;
									default:
										// 不明な軸項目種別 type
										console.warn('[横軸] 不明な軸項目種別: ' + aCol);
									}
									aNode = aNode.parent;
								}

								// 表示項目ラベル
								var dLeaf = aCol.dLeaf;
								var dNode = dLeaf;
								while(!dNode.isRoot()){
									// ラベルテキスト★
									var aRow = rows[baseLv + dNode.level-1];
									aRow[aCol.field] = dNode.data.name;
									dNode = dNode.parent;
								}
							}
						}
					}
					return rows;
				}(this.ctx, columns);

				// セル部位
				var rows = function(ctx, columns, rows){
					if(!rows){
						rows = new Array();
					}

					var frozenRowCount = ctx.frozenRowCount;
					var frozenColCount = ctx.frozenColCount;

					var createAttrColumn = function(aRow, node) {
						switch (node.data.req_kind) {
						case amgbp_AnaDefs.AMGBA_DEFS_KIND_ITGRP:	// 商品分類（これで返ってくるみたい）
						case amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEM:		// 品番（念のためこれも入れておく）
							for(var colIdx = 1; colIdx < frozenColCount; colIdx++){
								var aCol = columns[colIdx];
								var field = aCol.field;
								var vid = node.data.id;
								if (aCol.attr) {
									var base = aCol.attr.dispitem_id & 0x2000FFFF;
									if (base != 0 && (base & 0x1000) && !(base & 0x2000)) {
										var key = 'v' + vid + field;
										var cell = ctx.vAxAttr.cellMap[key];
										var cellStr = null;
										if(cell != null){
											cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit, aCol.attr);
										}
										aRow[field] = cellStr || '';
									}
								}
							}

							break;
						case amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORITEM:	// カラー商品
							for(var colIdx = 1; colIdx < frozenColCount; colIdx++){
								var aCol = columns[colIdx];
								var field = aCol.field;
								var vid = node.data.id;
								if (aCol.attr) {
									var base = aCol.attr.dispitem_id & 0x2000FFFF;
									if (base != 0 && !(base & 0x1000) && (base & 0x2000)) {
										var key = 'v' + vid + field;
										var cell = ctx.vAxAttr.cellMap[key];
										var cellStr = null;
										if(cell != null){
											cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit, aCol.attr);
										}
										aRow[field] = cellStr || '';
									}
								}
							}
							break;
						case amgbp_AnaDefs.AMGBA_DEFS_KIND_COLORSIZEITEM:	// JANコード
							for(var colIdx = 1; colIdx < frozenColCount; colIdx++){
								var aCol = columns[colIdx];
								var field = aCol.field;
								var vid = node.data.id;
								if (aCol.attr) {
									var base = aCol.attr.dispitem_id & 0x2000FFFF;
									if (base != 0 && (base & 0x3000)) {
										var key = 'v' + vid + field;
										var cell = ctx.vAxAttr.cellMap[key];
										var cellStr = null;
										if(cell != null){
											cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit, aCol.attr);
										}
										aRow[field] = cellStr || '';
									}
								}
							}
							break;
						}
					};

					// 縦軸要素をつくる。
					//        |<--- ここから・・・       ・・・ここまで ->|
					// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | d1 | d2 | ・・・
					var createRowByVLeaf = function(aRow, vLeaf, hasCodeMap){
						if(_.isNullOrUndefined(aRow)){
							aRow = new Object();
						}
						aRow.vLeaf = vLeaf;
						var node = vLeaf;
						while(!node.isRoot()){
							if(hasCodeMap[node.level]){
								aRow['vLv' + node.level + 'Code'] = node.data.code;
							}
							aRow['vLv' + node.level + 'Name'] = node.data.name;
							// TODO このnodeに属性表示項目があれば追加する
							createAttrColumn(aRow, node);

							node = node.parent;
						}
						return aRow;
					};

					for(var vlfIdx = 0; vlfIdx < ctx.vAxisLeafNodeArray.length; vlfIdx++){
						var vLeaf = ctx.vAxisLeafNodeArray[vlfIdx];

						if(_.isNullOrUndefined(ctx.hAxisRoot)){
							// 1軸
							// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | d1 | d2 | ・・・
							var aRow = createRowByVLeaf(null, vLeaf, ctx.vAxisHasCodeMap);
							aRow.id = Ana.Util.toXlsRowIndex(frozenRowCount + vlfIdx);
//							for(var colIdx = 1; colIdx < frozenColCount; colIdx++){
//								var aCol = columns[colIdx];
//								var field = aCol.field;
//								var vid = vLeaf.data.id;
//
//								// 縦軸属性(マスタ) TODO 多分いらない（固定カラムに移動）
//								if(aCol.attr){
//									var key = 'v' + vid + field;
//									var cell = ctx.vAxAttr.cellMap[key];
//									var cellStr = null;
//									if(cell != null){
//										cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit, aCol.attr);
//									}
//									aRow[field] = cellStr || '';
//									continue;
//								}
//							}

							// セル部
							for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
								var aCol = columns[colIdx];
								var field = aCol.field;
								var vid = vLeaf.data.id;

								// 縦軸属性(マスタ) TODO 多分いらない（固定カラムに移動）
								if(aCol.attr){
									var key = 'v' + vid + field;
									var cell = ctx.vAxAttr.cellMap[key];
									var cellStr = null;
									if(cell != null){
										cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit, aCol.attr);
									}
									aRow[field] = cellStr || '';
									continue;
								}

								var hid = 0, did = aCol.dLeaf.data.id;
								var cell = ctx.cellMap.find(vid, hid, did);
								var cellStr;
								if(_.isNullOrUndefined(cell)){
									console.warn('みなしご: vid[' + vid + '] hid[' + hid + ']' + ' did[' + did + ']');
									// cellStr = 'n/a';
									cellStr = '';
								}else{
									cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit);
								}
								aRow[field] = cellStr;
							}
							rows.push(aRow);
						}else{
							// ２軸
							if(ctx.dispopt.disp_way === amgbp_AnaHead.AMGBP_ANA_REQ_DISP_WAY_V){
								// 表示項目並び＝たて
								// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | dspItemName | dspCmpName | h1 | h2 | ・・・
								var subRows = new Array();
								var dispLeafCount = ctx.dispLeafArray.length;

								// 表示部（縦軸）
								if(ctx.dispMaxLevel >= 2){
									// 比較項目あり
									for(var i = 0; i < dispLeafCount; i++){
										var dLeaf = ctx.dispLeafArray[i];
										var dParent = dLeaf.parent;
										var rowIndex = (dispLeafCount * vlfIdx) + i;
										var aRow = createRowByVLeaf(null, vLeaf, ctx.vAxisHasCodeMap);
										aRow.id = Ana.Util.toXlsRowIndex(frozenRowCount + rowIndex);
										aRow.dLeaf = dLeaf;
										aRow.dspCmpName = dLeaf.data.name;		// 表示項目ラベル：比較項目名
										aRow.dspItemName = dParent.data.name;	// 表示項目ラベル
										subRows.push(aRow);
									}

								}else{
									// 対象項目のみ
									for(var i = 0; i < dispLeafCount; i++){
										var dLeaf = ctx.dispLeafArray[i];
										var rowIndex = (dispLeafCount * vlfIdx) + i;
										var aRow = createRowByVLeaf(null, vLeaf, ctx.vAxisHasCodeMap);
										aRow.id = Ana.Util.toXlsRowIndex(frozenRowCount + rowIndex);
										aRow.dLeaf = dLeaf;
										aRow.dspItemName = dLeaf.data.name;
										subRows.push(aRow);
									}
								}

								// セル部
								for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
									var aCol = columns[colIdx];
									var field = aCol.field;

									// 縦軸属性(マスタ) TODO 修正必要（多分削除）
									if(aCol.attr){
										throw '縦軸属性(マスタ): 「表示項目並び＝たて」に縦軸属性(マスタ)表示は不可。';
									}

									var hid = aCol.hLeaf.data.id;
									for(var i = 0; i < subRows.length; i++){
										var aRow = subRows[i];
										var vid = aRow.vLeaf.data.id;
										var did = aRow.dLeaf.data.id;
										var cell = ctx.cellMap.find(vid, hid, did);
										var cellStr;
										if(_.isNullOrUndefined(cell)){
											console.warn('みなしご: vid[' + vid + '] hid[' + hid + ']' + ' did[' + did + ']');
											// cellStr = 'n/a';
											cellStr = '';
										}else{
											cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit);
										}
										aRow[field] = cellStr;
									}
								}

								// 部分行の行オブジェクトを rows へ追加する。
								for(var i = 0; i < subRows.length; i++){
									rows.push(subRows[i]);
								}
							} else if(ctx.dispopt.disp_way === amanp_AnaHead.AMANP_ANA_REQ_DISP_WAY_H_DIAGG) {
								// 表示項目並び＝表示項目集約
								// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | d1h1 | d1h2 | ・・・
								var aRow = createRowByVLeaf(null, vLeaf, ctx.vAxisHasCodeMap);
								aRow.id = Ana.Util.toXlsRowIndex(frozenRowCount + vlfIdx);

								// セル部
								for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
									var aCol = columns[colIdx];
									var field = aCol.field;
									var vid = vLeaf.data.id;

									// 縦軸属性(マスタ) TODO 多分固定カラム部に移動
									if(aCol.attr){
										var key = 'v' + vid + field;
										var cell = ctx.vAxAttr.cellMap[key];
										var cellStr = null;
										if(cell != null){
											cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit, aCol.attr);
										}
										aRow[field] = cellStr || '';
										continue;
									}

									var hid = aCol.hLeaf.data.id, did = aCol.dLeaf.data.id;
									var cell = ctx.cellMap.find(vid, hid, did);
									var cellStr;
									if(_.isNullOrUndefined(cell)){
										console.warn('みなしご: vid[' + vid + '] hid[' + hid + ']' + ' did[' + did + ']');
										// cellStr = 'n/a';
										cellStr = '';
									}else{
										cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit);
									}
									aRow[field] = cellStr;
								}
								rows.push(aRow);
							}else{
								// 表示項目並び＝よこ
								// lineNo | vLv1Code | vLv1Name | vLv2Code | vLv2Name | h1d1 | h1d2 | ・・・
								var aRow = createRowByVLeaf(null, vLeaf, ctx.vAxisHasCodeMap);
								aRow.id = Ana.Util.toXlsRowIndex(frozenRowCount + vlfIdx);

								// セル部
								for(var colIdx = frozenColCount; colIdx < columns.length; colIdx++){
									var aCol = columns[colIdx];
									var field = aCol.field;
									var vid = vLeaf.data.id;

									// 縦軸属性(マスタ) TODO 多分固定カラム部に移動
									if(aCol.attr){
										var key = 'v' + vid + field;
										var cell = ctx.vAxAttr.cellMap[key];
										var cellStr = null;
										if(cell != null){
											cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit, aCol.attr);
										}
										aRow[field] = cellStr || '';
										continue;
									}

									var hid = aCol.hLeaf.data.id, did = aCol.dLeaf.data.id;
									var cell = ctx.cellMap.find(vid, hid, did);
									var cellStr;
									if(_.isNullOrUndefined(cell)){
										console.warn('みなしご: vid[' + vid + '] hid[' + hid + ']' + ' did[' + did + ']');
										// cellStr = 'n/a';
										cellStr = '';
									}else{
										cellStr = Ana.Util.cellToString(cell, ctx.dispopt.disp_amunit);
									}
									aRow[field] = cellStr;
								}
								rows.push(aRow);
							}
						}
					}
					return rows;
				}(this.ctx, columns, rows0);

				// データView
				var dataView = new Slick.Data.DataView();
				this.slickDataView = dataView;
				dataView.beginUpdate();
				dataView.setItems(rows);
				dataView.endUpdate();

				// SlickGrid をつくる。
				var slickOPT = {
					explicitInitialization: true,		// init() は自分で呼び出す。
					frozenRow: 0,						// 固定行数は 0 を明示しておかないとセル選択できなかった。
					frozenColumn: 0,					// 行番号列を固定化する -- なぜか 0 オリジン
					enableAddRow: false,
					enableCellNavigation: true,
					enableColumnReorder: false,			// カラム入れ替え不可
					syncColumnCellResize: false,		// true

					// Slickgrid 独自拡張
					// - 現在描画しようとするセルを装飾するための css クラスを返す関数を仕込む。
					xCellCssDecorator: this.CellCssDecorator
				};
				var slickGrid = new Slick.Grid(this.$el, dataView, columns, slickOPT);
				this.slickGrid = slickGrid;

				// セレクションモデル
				var cellSelectionModel = new Slick.CellSelectionModel();
				this.slickCellSelectionModel = cellSelectionModel;
				slickGrid.setSelectionModel(cellSelectionModel);

				// コピーモード
				// Slick.CellExternalCopyManager を見つけてきた。これを使えばクリップボードとやりとりできる。
				slickGrid.registerPlugin(new Slick.CellExternalCopyManager({
					dataItemColumnValueExtractor: function(item, columnDef){
						return _.unescape(item[columnDef.field]);
					},
					includeHeaderWhenCopying: false
				}));

				// カラムヘッダクリック
				slickGrid.onHeaderClick.subscribe(_.bind(function(e, args){
					console.log('>> onHeaderClick.');
					console.log(arguments);
					var $target = $(e.target);
					if($target.hasClass('selectall-handle')){
						this.selectAll();
						e.stopImmediatePropagation();
					}
				}, this));

				// 初期化実行
				slickGrid.init();
			}

			return this;
		},

		status: 'pause',	// デフォルトは待機中
		size: {				// サイズパラメタ
			minHeight:	370,
			dh: (155+20)	// window 高さから(SlickGrid適切height)の差分
		},
		// 休止する
		onPause: function(){
			// 結果モードにスイッチした
			var stat = 'pause';
			if(this.status != stat){
				this.status = stat;
				var $w = $(window);
				this.size.win_width = $w.innerWidth();
				this.size.win_height = $w.innerHeight();
				this.size.el_height = this.$el.height();
				this.size.el_width = this.$el.width();
			}
			return this;
		},
		// 再開する
		onResume: function(){
			// コピーモードに復帰してきた
			// 結果表示モードに復帰してきた
			var stat = 'active';
			if(this.status != stat){
				this.status = stat;
				this.setPreferredSize();
			}
			// コピーモードは、再開の度に render して slickgrid を新しくしておく。（いろいろな判定がめんどいから）
			return this.render();
		},
		// リサイズする
		setPreferredSize: function(){
			var $w = $(window);
			var win_h = $w.innerHeight();
			var win_w = $w.innerWidth();
			var el_h = this.$el.height();
			var el_w = this.$el.width();

			var preferredHeight = Math.max((win_h - this.size.dh), this.size.minHeight);

			// ↓高さ算出が甘いみたいで、毎回 ±2 くらいの誤差でリサイズコースに入ってしまう。
			//   とりあえず、毎回リサイズで様子をみてみる。
			if(el_h != preferredHeight || el_w != this.size.el_width){
				// サイズ変更された → リサイズ
				//console.log('ResuleView: resize: (h,w)=(' + h + ',' + el_w + ')');

				// 高さ調整（幅は auto で伸びるため何もしない）
				this.$el.height(preferredHeight);

				// サイズパラメタ保存
				this.size.win_height = win_h;
				this.size.win_width = win_w;
				this.size.el_height = el_h;
				this.size.el_width = el_w;

				// SlickGrid リサイズ
				if(this.slickGrid){
					this.slickGrid.resizeCanvas();
				}
			}
			return this;
		},

		_eof: 'end of Ana.ResultCopyGridView//'
	});

	/**
	 * AbortMessage ビュー
	 */
	Ana.AbortMessageView = Backbone.View.extend({
		className: 'msgBox general',
		template: '<% _.each(messages, function(msg){ %><p><%- msg %></p><% }) %>',
		initialize: function(opt) {
			this.options = opt;
		},
		render: function(){
			var dto = this.options;
			if(_.isString(dto.messages)){
				// 文字列
				dto = {messages: [dto.messages]};
			}
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(dto));
			return this;
		},
		startTimer: function(){
			setTimeout(function(){
				//window.location.href = clcom.appRoot + '/menu/menu.html';
				//clcom.pushPage(clcom.appRoot + '/menu/menu.html',null, null, null, true);
				clcom.popPage(null);
			}, 5000);
			return this;
		},
		_eof: 'end of Ana.AbortView//'
	});

	console.log('[ana.js] Loading ... done');

});
