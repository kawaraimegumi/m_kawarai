//////////////////////////////////////////////////////////////////
// store.js プラグイン拡張 - セットしているキーがどんなかを管理
(function(store){
	if(!store){
		throw 'store.js がロードされておりません。';
	}

	var origSetFunc = store.set;
	var origRemoveFunc = store.remove;
	var _keys = '_keys';

	/**
	 *
	 */
	store.set = function(k,v){
		if(k != null){
			var keyMap = store.get(_keys) || {};
			keyMap[k] = true;
			origSetFunc(_keys, keyMap);
		}
		origSetFunc(k,v);
	};

	/**
	 *
	 */
	store.remove = function(k){
		var keyMap = store.get(_keys);
		var kk = _.isArray(k) ? k : [ k ];
		for(var i = 0; i < kk.length; i++){
			var k = kk[i];
			origRemoveFunc(k);
			if(k != null){
				if(keyMap && _.has(keyMap, k)){
					delete keyMap[k];
				}
			}
		}
		if(keyMap){
			origSetFunc(_keys, keyMap);
		}
	};

	/**
	 *
	 */
	store.keys = function(){
		var keyMap = store.get(_keys);
		return keyMap || {};
	};

}(store));

//////////////////////////////////////////////////////////////////
//inputlimiter を改竄
(function($){
	var inputlimiter = $.inputlimiter;
	if(!inputlimiter || inputlimiter._started !== true){
		throw 'inputlimiter が初期化されておりません。';
	}

	// focusout - blur を改竄。
	// 文字列カットするのを止めさせる！
	var devLv = 1;//0;	// TODO: devLv == 1 のルートを実装する
	if(devLv === 1){
		var focused = false;
		var selector = '[data-limit]:not(.bindInputlimiter),[data-filter]:not(.bindInputlimiter)';
		$(document)
			.off('focusout.inputlimiter')
			.on('focusout.inputlimiter', selector, function(e){
				console.log('ana-fix: focusout.inputlimiter', arguments);
				var input = e.currentTarget, $input = $(input);
				if(!$input.is('input,textarea')){
					return;
				}
				//clutil.mediator.trigger('validation:require', e);
			})
			.off('keyup.inputlimiter')
			.on('keyup.inputlimiter', selector, function(e){
				var isEnter = e.which === 13;
				if (!isEnter) {
					return;
				}

				var input = e.currentTarget,
				$input = $(input);

				if (!$input.is('input,textarea'))
					return;

				// IMEでENTERキーで確定時の処理
				//var converter = _converter ||getConverterByElement($input),
				var converter = function($input){
					var limitExpr = $input.attr('data-limit') || '';
					var filterExpr = $input.attr('data-filter') || '';

					// 簡易実装で。
					return {
						filter: function(msk, val){
							return val;
						},
						limitValue: function(val){
							// XXX: 最大文字数だけサポートしておくか・・・
							if(_.isEmpty(limitExpr)){
								return val;
							}
							var maxlen = limitExpr.replace(/^len:[ ]*/, '');
							if(_.isFinite(maxlen) && maxlen > 0){
								val = val.substr(0,maxlen);
							}
							return val;
						}
					};
				}($input),
				pos,
				curVal = converter.filter('unmask', $(e.currentTarget).val()),
				newVal = converter.limitValue(curVal),
				modifierKeyPressed = e.ctrlKey || e.altKey || e.metaKey;

//				if (curVal !== newVal) {
//					pos = getCursorPosition(e.currentTarget);
//					$input.val(newVal);
//					setCursorPosition($input, pos);
//				}
			})
			.off('focusin.inputlimiter')
			.on('focusin.inputlimiter', selector, function(e){
				console.log('ana-fix: focusin.inputlimiter', arguments, e.currentTarget.value);
				var input = e.currentTarget,
				$input = $(input);

				if (!$input.is('input,textarea'))
					return;

				// 元々のコードでは入力値をフィルタカットして再セットしている
				// MD 仕様に合わせ、フィルタカットしないメソッドでオーバーライド

//				var value = $input.val();
//				$input.val(value).select();
				focused = true;
				$input.select();
			})
			.off('mouseup.inputlimiter')
			.on('mouseup.inputlimiter', selector, function(e){
				console.log('ana-fix: mouseup.inputlimiter', arguments);
				if (focused) {
					$(e.currentTarget).select();
					e.preventDefault();
					focused = false;
				}
			});

	}else{
		// 改竄しない
	}
}($));

//////////////////////////////////////////////////////////////////
// jQuery コンフィギュレーション
// Ajax タイムアウトを設定 - 300 秒。
jQuery.ajaxSetup({
	timeout: 300 * 000
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * clcom-ana.js が事前に読み込まれていること！
 * 顧客分析用 clcom を MD分析用に組み替える。
 */
$(function() {

	console.log('... load clcom-ana-fix.');

	if(clcom == null){
		throw 'clcom インスタンスが見つかりません。';
	}
	if(clutil == null){
		throw 'clutil インスタンスが見つかりません。';
	}

	/**
	 * clcom（顧客分析からポーティング） を MD 分析用に拡張
	 */
	_.extend(clcom, {

		/** HOME とするページの URL */
		homeUrl: clcom.urlRoot + "/system/app/AMCM/AMCMV0030/AMCMV0030.html",

		/** ログアウトURI */
		logoutDestUri: clcom.urlRoot + '/api/logout',

		/** アップロード先URI */
		uploadDestUri: clcom.urlRoot + '/system/api/fileupload',

		/**
		 * サブ画面ペインの HTML リソースURIを絶対パスで取得する。
		 */
		getAnaSubPaneURI: function(screenId){
			console.log('getAnaSubPaneURI: ' + screenId );
			return clcom.appRoot + '/AMGA/private/sub/' + screenId + '/' + screenId + '.html';
		},

		/**
		 * ページタイプ「分析」のみを返すようにオーバーライド。
		 */
		getPageType: function(){
//			alert('!!!');
//			throw 'getPageType: !!!';
			return 'an';
		},

		/**
		 * AOKI
		 * 区分テーブルをローカルストレージから取得する。--- オーバーライド
		 * ・kind：区分値名（省略可）
		 * ・ids：kind 下の特定 id または id 配列（省略可）
		 * 引数を指定しない場合は全区分の mix を返す。
		 */
		getTypeList: function(kind, ids){
			// 区分リスト
			var key = clcom.storagePrefix + 'typelist';
			var allList = store.get(key);

			// kind が指定されている場合は kind で絞る。
			var list = allList;
			if(_.isNumber(kind)){
				list = _.where(allList, {typetype: kind});
			}

			// 区分個々の ids が指定されている場合は絞り込む
			var fixIds = null;
			if(_.isArray(ids)){
				fixIds = ids;
			}else if(ids !== null && ids !== undefined){
				fixIds = [ ids ];
			}
			if(fixIds){
				list = _.filter(list, function(kbn){
					return _.contains(fixIds, kbn.type_id);
				});
			}

			return list;
		},
		/**
		 * 区分テーブルをローカルストレージに保存する
		 */
		setTypeList: function(typelist){
			var store = window.store;
			var key = clcom.storagePrefix + 'typelist';
			store.set(key, typelist);
		},
		getCdNameList: function() {
			// コード名称リスト
			//var key = clcom.storagePrefix + clcom.getPageType() + 'cdnamelist';
			//return store.get(key);
			return [];
		},
		getStaffCdNameList: function() {
			// 社員コード名称リスト
			//var key = clcom.storagePrefix + clcom.getPageType() + 'staffcdnamelist';
			//return store.get(key);
			return [];
		},

		/**
		 * 区分(顧客)テーブルをローカルストレージに保存する
		 */
		setTypeCustList: function(typelist) {
			var store = window.store;
			var key = clcom.storagePrefix + 'typecustlist';
			store.set(key, typelist);
		},
		/**
		 * AOKI
		 * 区分(顧客)テーブルをローカルストレージから取得する。--- オーバーライド
		 * ・kind：区分値名（省略可）
		 * ・ids：kind 下の特定 id または id 配列（省略可）
		 * 引数を指定しない場合は全区分の mix を返す。
		 */
		getTypeCustList: function(kind, ids){
			// 区分リスト
			var key = clcom.storagePrefix + 'typecustlist';
			var allList = store.get(key);

			// kind が指定されている場合は kind で絞る。
			var list = allList;
			if(_.isNumber(kind)){
				list = _.where(allList, {typetype: kind});
			}

			// 区分個々の ids が指定されている場合は絞り込む
			var fixIds = null;
			if(_.isArray(ids)){
				fixIds = ids;
			}else if(ids !== null && ids !== undefined){
				fixIds = [ ids ];
			}
			if(fixIds){
				list = _.filter(list, function(kbn){
					return _.contains(fixIds, kbn.type_id);
				});
			}

			return list;
		},

		/**
		 * ログインユーザ情報を取得する。
		 */
		getUserData: function(){
			var key = clcom.storagePrefix + 'userdata';
			return store.get(key);
		},

		/**
		 *
		 */
		gohome: function(url, logout, gohome){
			if(_.isEmpty(url)){
				url = clcom.homeUrl;
			}

			// ストレージをクリア
			clcom.clearStorage();

			clcom.location(url);
		},

		/**
		 * ログアウト
		 */
		logout: function(url/*省略可*/, keepPage/*省略可、true:ログアウト処理後、現在のページを維持*/){
			var o = {
				url: clcom.urlRoot,
				keepPage: false
			};
			if(arguments.length === 1 && _.isObject(arguments[0])){
				_.extend(o, arguments[0]);
			}else{
				o = _.defaults({
					url: arguments[0],
					keepPage: arguments[1]
				}, o);
			}

			// ストレージをクリア
			clcom.clearStorage({removeAll: true});

			// ログアウト処理
			return $.ajax(clcom.logoutDestUri, {
				type: 'GET',
				dateType: 'json',
				contentType: 'application/jason',
				cache: false,
				timeout: 5000,
				success: function(){
					console.log('logout success: ', arguments);
				},
				error: function(xhr, status, exp){
					console.warn('[' + status + '] logout failed.');
				},
				complete: function(xhr, status){
					if(!o.keepPage){
						clcom.location(o.url);
					}
				}
			});
		},

		/**
		 * ストレージ保持のキャッシュデータを破棄する。
		 */
		clearStorage: function(args){
			// クリア除外キー
			var savingKeys = {};
			if(!(args && (args.removeUserData === true || args.removeAll === true))){
				// ログイン情報をストレージ - 引数 args.removeUserData で true 明示しない場合は保護対象。
				savingKeys[clcom.storagePrefix + 'userdata'] = true;
			}
			if(!(args && (args.removePushpop === true || args.removeAll === true))){
				// pushpopストレージ - 引数 args.pushpop で true 明示しない場合は保護対象
				savingKeys[clcom.storagePrefix + 'pushpop'] = true;
			}
			if(!(args && (args.removePushpop === true || args.removeAll === true))){
				// pushpopストレージ - 引数 args.menustore で true 明示しない場合は保護対象
				savingKeys[clcom.storagePrefix + 'menustore'] = true;
			}
			if(!(args && (args.AMCMV0030 === true || args.removeAll === true))){
				// MDポータルストレージ - 引数 args.AMCMV0030 で true 明示しない場合は保護対象
				savingKeys[clcom.storagePrefix + 'AMCMV0030'] = true;
			}

			// キー一覧からストレージをクリアしていく。
			var storeKeyMap = store.keys();
			var regEx = new RegExp('^' + clcom.storagePrefix);
			var delKeys = _.reduce(storeKeyMap, function(delkeys, v, k){
				do{
					if(!regEx.test(k)){
						break;
					}
					if(savingKeys[k]){
						break;
					}
					delkeys.push(k);
				}while(false);
				return delkeys;
			}, []);
			if(!_.isEmpty(delKeys)){
				store.remove(delKeys);
			}

//			// 共通（顧客からポーティング）
//			// 運用日をストレージから消去
//			clcom.removeOpeDate();
//			// 区分リストをストレージから消去
//			clcom.removeTypeList();
//			// 権限リストをストレージから消去
//			clcom.removeFuncList();
//			// ログイン情報をストレージから消去
//			if(args && (args.removeUserData === true || args.removeAll === true)){
//				// ログイン情報をストレージから消去
//				clcom.removeUserData();
//			}
//			// pushpopをストレージから消去
//			if(args && (args.removePushpop === true || args.removeAll === true)){
//				store.remove('clcom.pushpop');
//			}
//
//			// 共通（MDからポーティング）
//			// 権限
//			clcom.removePermfuncMap();
//			// システムパラメタをストレージから消去
//			clcom.removeSysparamList();
//
//			// メニュー情報をストレージから消去
//			clcom.removeMenuStore();
//			// 分析情報をストレージから消去
//			clcom.removeAnaprocInit();
//			clcom.removeBuinfo();
		},

		/**
		 * 権限テーブルをローカルストレージに保存する。
		 * @param {Array} permfunc 権限テーブル(loginレスポンス の permfunc)
		 */
		setPermfuncMap: function (permfuncList) {
			var key = clcom.storagePrefix + 'permfunc';
			var map = _.reduce(permfuncList, function (map, item) {
				map[item.func_code] = item;
				return map;
			}, {});
			store.set(key, map);
		},
		/**
		 * 権限テーブルをローカルストレージから削除する。
		 */
		removePermfuncMap: function() {
			var key = clcom.storagePrefix + 'permfunc';
			return store.remove(key);
		},

		/**
		 * 権限テーブルを取得する
		 */
		getPermfuncByCode: function(code){
			var key = clcom.storagePrefix + 'permfunc';
			var map = store.get(key);
			code || (code = clcom.pageId);
			return map ? map[code] : undefined;
		},

		/**
		 * ログインユーザーが指定処理が実行可能かどうか判定する。
		 *
		 * 第2引数の機能コード省略時には関数呼び出し画面に対して判定す
		 * るので通常第2引数は指定しないこと。
		 *
		 * @method checkPermfunc
		 * @for clcom
		 * @param {String} ope 処理種別。"read", "write", "del", "em"のいずれか
		 * @param {String} [code=呼び出しを行った画面の機能コード]機能
		 *  コードを指定する。指定されない場合は、関数呼び出し画面の機
		 *  能コードを使用する。
		 * @return {Boolean} 処理が可能かどうか
		 *
		 * @example
		 * <pre><code>
		 * if (clcom.checkPermfunc("em")) {
		 *   // 緊急メンテ可能
		 * }
		 * </code></pre>
		 */
		checkPermfunc: function(ope, code, permfunc){
			code || (code = clcom.pageId);
			permfunc || (permfunc = clcom.getPermfuncByCode(code));
			if (_.indexOf(["read", "write", "del", "em"], ope) < 0){
				throw "処理引数が不正です[" + ope + "]";
			}
			if (permfunc){
				return !!permfunc["f_allow_" + ope];
			}
		},

		/**
		 * システムパラメタをローカルストレージに保存する。
		 */
		setSysparamList: function(sysparalist){
			var key = clcom.storagePrefix + 'sysparam';
			store.set(key, sysparalist);
		},

		/**
		 * システムパラメタをローカルストレージから削除する。
		 */
		removeSysparamList: function(){
			var key = clcom.storagePrefix + 'sysparam';
			// 区分リスト
			store.remove(key);
		},

		/**
		 * システムパラメタをローカルストレージから取得する。
		 */
		getSysparamList: function(){
			var key = clcom.storagePrefix + 'sysparam';
			return store.get(key);
		},

		/**
		 * システムパラメタを取得する
		 */
		getSysparam: function(paramname){
			var list = clcom.getSysparamList();
			var sysparams = _.where(list, {param: paramname});
			return (sysparams.length > 0) ? sysparams[0].value : null;
		},

		/**
		 * ローカルストレージからデータを取得する。
		 */
		getStoredValue: function(key){
			var key = clcom.storagePrefix + key;
			return store.get(key);
		},

		/**
		 * 分析のキャッシュデータに保存するキー表
		 */
		anaProcStoredKeys: function(){
			var addkey = function(key, obj){
				obj[key] = clcom.storagePrefix + key;
				return obj;
			};
			var obj = {};
			addkey('item_attr_list', obj);		// 商品属性条件リスト
			addkey('memb_attr_list', obj);		// 顧客属性条件リスト
			addkey('staff_attr_list', obj);		// 社員属性条件リスト
			addkey('fromto_list', obj);			// 分析範囲条件リスト
			addkey('period_list', obj);			// 分析期間リスト
			addkey('tran_attr_list', obj);		// 売上属性条件リスト
			addkey('dm_attr_list', obj);		// DM属性条件リスト
			addkey('market_list', obj);			// 年代属性条件リスト	[MD商品分析]
			addkey('sexage_list', obj);			// 売上属性条件リスト	[MD商品分析]
			addkey('item_spec_list', obj);		// 商品仕様条件リスト
			addkey('priceline_list', obj);		// プライスラインリスト(POS元上代)
			addkey('priceline_m_list', obj);	// プライスラインリスト
			addkey('priceline_sl_list', obj);	// プライスラインリスト(POS元上代)[営業部]
			addkey('priceline_sl_m_list', obj);	// プライスラインリスト[営業部]
			addkey('mstitem_list', obj);		// マスタ項目リスト
			addkey('mstitem_list_gba', obj);	// マスタ項目リスト（新自由分析用）
			return obj;
		}(),

		/** AOKI - MD 用にオーバーラード
		 * 分析初期情報を保存する。
		 * @param {object} args
		 * @param {Array} args.item_attr_list 商品属性条件リスト
		 * @param {Array} args.memb_attr_list 顧客属性条件リスト
		 * @param {Array} args.staff_attr_list 社員属性条件リスト
		 * @param {Array} args.fromto_list 分析範囲条件リスト
		 * @param {Array} args.period_list 分析期間リスト
		 * @param {Array} args.tran_attr_list 売上属性条件リスト
		 * @param {Array} args.dm_attr_list DM属性条件リスト
		 * @param {Array} args.sexage_list 年代属性条件リスト	[MD商品分析]
		 * @param {Array} args.market_list 売上属性条件リスト	[MD商品分析]
		 * @param {Array} args.item_spec_list 商品仕様条件リスト
		 * @param {Array} args.priceline_list プライスラインリスト(POS元上代)
		 * @param {Array} args.priceline_m_list プライスラインリスト
		 * @param {Array} args.mstitem_list マスタ項目リスト
		 */
		setAnaprocInit: function(args){
			clcom.removeAnaprocInit();
			_.each(args, function(anaprocVal, key){
				var storedKey = clcom.anaProcStoredKeys[key];
				if(_.isEmpty(storedKey)){
					return;
				}
				var store = window.store;
				if(key == 'fromto_list'){
					// 種別でハッシュを作成
					var kindhash = {};
					for (var i = 0; i < anaprocVal.length; i++) {
						var fromto = anaprocVal[i];
						if (kindhash[fromto.kind] == null) {
							kindhash[fromto.kind] = [];
						}
						kindhash[fromto.kind].push(fromto);
					}
					var fromtohash = {};
					$.each(kindhash, function(key, value) {
						// 各種別毎に属性でハッシュを作成
						var kindlist = kindhash[key];
						var attrhash = {};
						for (var i = 0; i < kindlist.length; i++) {
							var kind = kindlist[i];
							if (attrhash[kind.attr] == null) {
								attrhash[kind.attr] = [];
							}
							attrhash[kind.attr].push(kind);
						}
						fromtohash[key] = attrhash;
					});
					anaprocVal = fromtohash;
				}
				store.set(storedKey, anaprocVal);
			});
		},

		/**
		 * AOKI - MD 用にオーバーラード
		 * 分析初期情報をローカルストレージから削除する。
		 */
		removeAnaprocInit: function() {
		var store = window.store;
		_.each(clcom.anaProcStoredKeys, function(storedKey, key){
			store.remove(storedKey);
		});
		},

		/**
		 * 分析 - 最近実行したものLRUキャッシュＡＰＩ
		 */
		amanHistory: {
			/**
			 * １分析種別当りの保存件数
			 */
			maxCount: 10,
			/**
			 * 最近実行した分析LRUキャッシュ -- 「clcom.***」とは別のネームスペースとする。
			 */
			prefix: 'aman.history',
			/**
			 * カレントユーザの最近実行した分析LRUキャッシュキーを取得する。
			 */
			getMyStoredKey: function(){
				if(!clcom.userInfo || !clcom.userInfo.user_code){
					console.warn('amanHistory is not ready.');
					return null;
				}
				return clcom.amanHistory.prefix + '.' + clcom.userInfo.user_code;
			},
			/**
			 * カレントユーザ＆全分析分のLRUキャッシュを取得する。
			 */
			getAllConds: function(){
				var key = clcom.amanHistory.getMyStoredKey();
				var val = store.get(key);
				return val;
			},
			/**
			 * カレントユーザ＆全分析分のLRUキャッシュを保存する。
			 */
			setAllConds: function(allConds){
				var key = clcom.amanHistory.getMyStoredKey();
				if(key){
					store.set(key, allConds);
				}
			},
			/**
			 * カレントユーザ＆指定分析コードのLRUキャッシュを保存する。
			 * @param {string} [func_code] 分析種別コード、省略時は現在の分析ページ（clcom.pageId)の結果を返す。
			 */
			getConds: function(func_code){
				if(!func_code){
					func_code = clcom.pageId;
				}
				var val = clcom.amanHistory.getAllConds();
				var myLruConds = (val && val[func_code]) ? val[func_code] : [];

				// 対象 func_code のものを、更新時刻降順リストで返す。
				return myLruConds.sort(function(cnd1, cnd2){
					var tm1 = cnd1.lru_tm, tm2 = cnd2.lru_tm;
					return -(tm1 - tm2);
				});
			},
			/**
			 * 現在の分析ページ（clcom.pageId）におけるLRUキャッシュを取得する
			 */
			prependCond: function(cond){
				var myHistoryKey = clcom.amanHistory.getMyStoredKey();
				if(!myHistoryKey){
					return;
				}

				// 全体
				var allConds = clcom.amanHistory.getAllConds();
				if(!allConds){
					allConds = {};
				}

				// 全体の中からカレントの分析画面分を引き出す
				var func_code = clcom.pageId;
				var conds = allConds[func_code];
				if(!_.isArray(conds)){
					conds = [];
					allConds[func_code] = conds;
				}

				// conds 中に挿入condと同じ内容の条件があれば古い方を削除。
				for(var i = 0; i < conds.length; i++){
					var c = conds[i];
					if(_.isEqual(cond.lru_cond, c.lru_cond)){
						conds.splice(i,1);
						break;
					}
				}

				// カレント分析分中の先頭へ分析条件をプッシュする。
				conds.splice(0,0,cond);
				if(conds.length > clcom.amanHistory.maxCount){
					conds.length = clcom.amanHistory.maxCount;
				}

				// 全体ごと保存
				clcom.amanHistory.setAllConds(allConds);
			},
			/**
			 * カレントユーザのカレントページにおける分析履歴をクリアする。
			 */
			clear: function(func_code){
				if(!func_code){
					func_code = clcom.pageId;
				}
				var myHistoryKey = clcom.amanHistory.getMyStoredKey();
				if(!myHistoryKey){
					return;
				}

				// 全体
				var allConds = clcom.amanHistory.getAllConds();
				if(!allConds){
					return;
				}

				// 全体の中からカレントの分析画面分を引き出す
				var conds = allConds[func_code];
				if(!conds){
					return;
				}

				// 削除
				delete allConds[func_code];
				if(_.isEmpty(allConds)){
					store.remove(myHistoryKey);
				}else{
					clcom.amanHistory.setAllConds(allConds);
				}
			},
			/**
			 * カレントユーザの分析履歴を全てクリアする。
			 */
			clearAll: function(func_code){
				if(!func_code){
					func_code = clcom.pageId;
				}
				var myHistoryKey = clcom.amanHistory.getMyStoredKey();
				if(myHistoryKey){
					store.remove(myHistoryKey);
				}
			}
		},

		_eof: '--'
	});

	/**
	 * clcom.domain ネームスペース - プロパティ項目のメタ情報定義
	 */
	if(clcom.domain == null){
		clcom.domain = {};
	}
	_.extend(clcom.domain, {
		// 分析メニューのノード情報
		MtAnaMenuNode: {
			name: {
				type: 'text',
				maxLen: 32		// DB定義上の最大値は ⇒ (128-1)/3 =  42 文字
			}
		},
		// 分析カタログ
		MtAnaCatalog: {
			name: {
				type: 'text',
				maxLen: 32		// DB定義上の最大値は ⇒  (128-1)/3 =  42 文字
			},
			guide: {
				type: 'text',
				maxLen: 150		// DB定義上の最大値は ⇒  (512-1)/3 = 170 文字
			}
		},
		// 汎用リスト
		MtGenList: {
			name: {
				type: 'text',
				maxLen: 32		// DB定義上の最大値は ⇒  (128-1)/3 =  42 文字
			}
		},
		// 社員マスタ -- 分析カタログ作成者
		MtStaff: {
			name: {
				type: 'text',
				maxLen: 32		// DB定義上の最大値は ⇒ (96-1)/3 = 31 文字
			}
		}
	});

	if (!clutil.text) {
        clutil.text = {};
      }
      _.extend(clutil.text, {
        /**
         * ゼロ埋め（64桁まで対応）
         * @param str		ゼロ埋め文字列または数値
         * @param n		桁数
         */
        zeroPadding: function (str, n) {
          var s = _.isString(str)
            ? str.replace(/^0*/, '')
            : (str || '').toString();
          if (s.length > n) {
            return str;
          }
          return (
            '0000000000000000000000000000000000000000000000000000000000000000' +
            s
          ).slice(-n);
        },
      });

      // Namespace: clutil.color -- 色定義に関するユーティリティ
      var colorsamples = [
        { name: 'default', fg: null, bg: null },
        { name: 'blue', fg: 0x0283cc, bg: 0xd7effd },
        { name: 'bluegreen', fg: 0x088aa7, bg: 0xd8f1f7 },
        { name: 'green', fg: 0x0e9286, bg: 0xd9f3f1 },
        { name: 'greenyellow', fg: 0x4cb244, bg: 0xe6f5e5 },
        { name: 'yellow', fg: 0x97a510, bg: 0xf4f7d9 },
        { name: 'yelloworange', fg: 0xb99b1d, bg: 0xf9f4dc },
        { name: 'orange', fg: 0xff9308, bg: 0xfff1de },
        { name: 'orangered', fg: 0xf95f21, bg: 0xfeeae2 },
        { name: 'red', fg: 0xf32c3e, bg: 0xfde3e6 },
        { name: 'redpurple', fg: 0xab4786, bg: 0xf4e5ef },
        { name: 'purple', fg: 0x674cca, bg: 0xebe7f8 },
        { name: 'purpleblue', fg: 0x206dde, bg: 0xe1ebfb },
      ];
      if (!clutil.color) {
        clutil.color = {};
      }
      _.extend(clutil.color, {
        /**
         * 色定義サンプル（Number 型）
         */
        samples: colorsamples,
        /**
         * 色定義サンプルマップ(プロトコル準拠) - Map<colorName, 色定義情報>
         */
        sampleMap: _.reduce(
          colorsamples,
          function (map, obj) {
            map[obj.name] = {
              fgcolor: obj.fg,
              bgcolor: obj.bg,
            };
            return map;
          },
          {}
        ),
        /**
         * 色定義サンプルマップ（CSS 用）- Map<colorName, 色定義情報>
         */
        cssSampleMap: _.reduce(
          colorsamples,
          function (map, obj) {
            map[obj.name] = {
              color:
                obj.fg == null
                  ? ''
                  : '#' + clutil.text.zeroPadding(obj.fg.toString(16), 6),
              'background-color':
                obj.bg == null
                  ? ''
                  : '#' + clutil.text.zeroPadding(obj.bg.toString(16), 6),
            };
            return map;
          },
          {}
        ),
        /**
         * 色設定用 css クラス名リストを生成する。
         * 色設定クラスを削除する際の利用想定。
         *
         * 使用例：
         *      $cell.removeClass(clutil.color.cssClasses('cell-').join(' ));
         *
         * @param prefix
         * @param suffix
         * @return カラー名配列 - 例: [ 'blue', 'bluegreen', ... 'purpleblue']
         */
        cssClasses: function (prefix, suffix) {
          return _.reduce(
            colorsamples,
            function (ss, c) {
              if (c.fg != null && c.bg != null) {
                var cname = c.name;
                if (prefix != null) cname = prefix + cname;
                if (suffix != null) cname += suffix;
                ss.push(cname);
              }
              return ss;
            },
            []
          );
        },
        /**
         * 指定 jQuery 要素に対して、カラー名で背景色、前景色を設定する。
         * @param colorName カラー名
         * @param $elem 適用対象の jQuery オブジェクト
         */
        applyColor: function (colorName, $elem) {
          var c = clutil.color.cssSampleMap[colorName];
          if (c == null) {
            c = clutil.color.cssSampleMap['default'];
          }
          for (var i = 1; i < arguments.length; i++) {
            var $x = arguments[i];
            $x.css(c);
          }
        },
        /**
         * 指定カラー名を適用するための style 属性を文字列で出力する。
         * @param colorName カラー名
         * @return スタイル属性 - 例: 「style="color: #eeeeee; background-color: #ffffff;"」
         */
        styleAttr: function (colorName) {
          var c = clutil.color.cssSampleMap[colorName];
          if (c == null) {
            return '';
          }
          var ss = [];
          for (var k in c) {
            var v = c[k];
            if (v != null) {
              ss.push(k + ': ' + v + ';');
            }
          }
          return _.isEmpty(ss) ? '' : 'style="' + ss.join(' ') + '"';
        },
        /**
         * $elem.css('color') で取得できる色定義 "rgb(255, 255, 255)" 文字列を Number 型へ変換する。
         * @param rgb -- 例: "rgb(255, 255, 255)" 文字列
         * @return Number 変換した値
         */
        rgb2Number: function (rgb) {
          var rgbValues = rgb
            .replace(/^rgb\(/, '')
            .replace(/\)$/, '')
            .split(',');
          var hexStr =
            '0x' +
            _.chain(rgbValues)
              .map(function (c) {
                return parseInt(c, 10).toString(16);
              })
              .value()
              .join('');
          return parseInt(hexStr, 16);
        },
        /**
         * スタイル適用するための色指定値へ変換する。
         * @param anyValue 色値、数値ならhex指定と見做す。
         * @return 色指定値
         */
        toCssColor: function (anyValue) {
          if (_.isFinite(anyValue)) {
            var ival = parseInt(anyValue, 10);
            var hexStr = clutil.text.zeroPadding(ival.toString(16), 6);
            return '#' + hexStr;
          }
          return anyValue;
        },
      });

	/**
	 * clutil（顧客分析からポーティング） を MD 分析用に拡張する。
	 */
	_.extend(clutil, {
		/**
		 * サンプルダウンロード簡易実装
		 */
		simpleSampleDownload: function(url) {
			var uri = encodeURI(url);
			clcom._preventConfirmOnce = true;
			location.href = uri;
		},

		/**
		 * 廃止
		 */
		gohome: function(url, logout){
			if(logout){
				clcom.logout(url);
			}else{
				clcom.gohome();
			}
		},

		/**
		 * 廃止
		 */
		clearStorage: function(){
			var msg = 'clcom.clearStorage() を使用してください。';
			alert(msg);
			//throw msg;
			console.error(msg);
		},

		/**
		 * @method clutil.postAnaJSON
		 *
		 * Ajax リクエストを発信するラッパ関数。
		 * アクセス先 resId が未完成なので、モックデータを返す実装をするために、
		 * clutil.postJSON() 関数を一皮かぶせる。
		 */
		postAnaJSON: function(resId, data, appcallback, completed){
			if(XXXTestData && _.has(XXXTestData, resId)){
				var d = $.Deferred();
				return d.resolve(XXXTestData[resId](data));
			}
			return clutil.postJSON(resId, data, appcallback, completed);
		},

		/**
		 * @method getIniJSON
		 * 分析族-非分析アプリ（カタログ照会、リスト照会など）用の初期データ取得 GET メソッド。
		 * オリジナル clcom-ana.js をオーバーライド実装したもの。
		 */
		getIniJSON: function(res, appcallback, completed){
			if (!clcom.hasAuthCookies()) {
				// ログインしていない場合
				clutil.gohome(clcom.urlRoot + '/err/nosession.html');
				return;
			}

			// 直リン禁止のチェック
			if (clutil.cStr(clcom.srcId) == ""){
				clutil.gohome(null, true);
			}

			// ログインユーザ情報を clom に保存。
			clcom.userInfo = clcom.getUserData();

			if (res != null) {
				return clutil.getJSON(res, appcallback, completed);
			} else {
				completed();
			}

			return $.Deferred().resolve();
		},

		/**
		 * @method postIniJSON
		 * 分析族-非分析アプリ（カタログ照会、リスト照会など）用の初期データ取得 POST メソッド。
		 * オリジナル clcom-ana.js をオーバーライド実装したもの。
		 */
		postIniJSON: function(res, appcallback, completed){
			if (!clcom.hasAuthCookies()) {
				// ログインしていない場合
				clutil.gohome(clcom.urlRoot + '/err/nosession.html');
				return;
			}

			// 直リン禁止のチェック
			if (clutil.cStr(clcom.srcId) == ""){
				clutil.gohome(null, true);
			}

			// ログインユーザ情報を clom に保存。
			clcom.userInfo = clcom.getUserData();

			if (res != null) {
				return clutil.postJSON(res, appcallback, completed);
			} else {
				completed();
			}

			return $.Deferred().resolve();
		},

		/**
		 * @method getAnaIniJSON
		 *
		 * MD分析専用の初期データ取得用 GET メソッド。
		 * キャッシュデータを取得し、ストレージへキャッシュする。
		 * ・gscm_type_get -- 区分取得
		 * ・gsan_ap_anaproc_preinit -- 分析共通のキャッシュデータ
		 * ・gsan_cm_buinfo -- 事業ユニット
		 *
		 * @return promise オブジェクト
		 */
		getAnaIniJSON: function(main_menu_id){
			// ユーザ情報を設定する
			clcom.userInfo = clcom.getUserData();

			// クッキーによるログインチェック
			if (!clcom.hasAuthCookies() || _.isEmpty(clcom.userInfo)) {
				// ログインしていない場合
				//clutil.gohome(clcom.urlRoot + '/err/nosession.html');
				var errHd = {
					status: 'error',
					message: 'cl_http_status_unauthorized',
					httpStatus: 401
				};

				var d = $.Deferred();
				return d.reject({ head: errHd, rspHead: errHd });
			}

			if (_.isEmpty(clutil.cStr(clcom.srcId))){
				// ここは、直リンらしい。
				// 直リンされたら、強制ログアウト？
				//clcom.logout();
			}

			var dd = [];

			// 1. 区分 まはた、システムパラメタが未取得だったら・・・
			if(!clcom.hasStorageKey('typelist') || !clcom.hasStorageKey('sysparam') || !clcom.hasStorageKey('typecustlist')){
				var d = clutil.postAnaJSON('am_pa_type_get', {}).done(function(data){
					// 区分をキャッシュに保存
					clcom.setTypeList(data.type);
					//clcom.setTypeList(data.type, []/*cdname*/, []/*staffcdname*/);

					// シスパラをキャッシュに保存
					clcom.setSysparamList(data.sysparam);

					// 顧客区分をキャッシュに保存
					clcom.setTypeCustList(data.typeCust);
				});
				dd.push(d);
			}

			// 2. 権限リストが未取得だったら
			if(!clcom.hasStorageKey('permfunc')){
				var req = {
					user_id: clcom.userInfo.user_id
				};
				var d = clutil.postAnaJSON('am_pa_perm_get', req).done(function(data){
					// 権限情報をキャッシュに保存
					clcom.setPermfuncMap(data.perm_func);
				});
				dd.push(d);
			}

			// 3. 分析初期情報を取得 - gsan_ap_anaproc_preinit
			if(!clcom.hasStorageKey('memb_attr_list')){
				var req = {
					// #20151018 ゾーンAJA向け分析対応
					cond: { main_menu_id: main_menu_id }
				};
				var d = clutil.postAnaJSON('gsan_ap_anaproc_preinit', req).done(function(data){
					// 分析初期情報をストレージに格納
					clcom.setAnaprocInit(data);
				});
				dd.push(d);
			}

			// 4. 事業ユニットを取得
			if(!clcom.hasStorageKey('buinfo')){
				var req = {
					cond: {
						ymd: clcom.getOpeDate()
					}
				};
				var d = clutil.postAnaJSON('am_pa_busunit_srch', req).done(function(data){
					var buInfos = _.map(data.body.list, function(dto, index){
						dto.id = dto.busunit_id;
						dto.code = dto.busunit_code;
						dto.name = dto.busunit_name;
						return dto;
					});
					// 事業ユニット情報をストレージに格納
					clcom.setBuinfo(buInfos);
				});
				dd.push(d);
			}

			if(_.isEmpty(dd)){
				var okHd = {
					status: 0
				};
				var d = $.Deferred();
				return d.resolve({ head: okHd, rspHead: okHd });
			}else{
				return $.when.apply(null/*==thisに入れるもの==*/, dd).promise();
			}
		},

		/**
		 * HTMLファイルの読み込み - 非キャッシュフラグ
		 */
		loadHtmlNoCache: false,
		loadHtmlSerialNumber: 1426857087340,	// HTMLリソースに変更あったら値を変えておくこと！

		/**
		 * AOKI
		 * HTMLファイルの読み込み（オーバーライド）
		 * @param url	// HTMLファイルのURL
		 * @param appcallback
		 */
		loadHtml: function(url, appcallback) {
			if(clutil.loadHtmlNoCache){
				url = url + '?tm=' + Date.now();
				console.info('clutil.loadHtml - no cache mode, url[' + url + ']');
			}else{
				url = url + '?tm=' + clutil.loadHtmlSerialNumber
				console.info('clutil.loadHtml: url[' + url + ']');
			}
			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'html',
				success: function(data) {
					appcallback(data);
				},
				error:function() {
					clutil.ErrorDialog('HTMLファイルの読み込みに失敗しました');
				}
			});
		},

		/**
		 * ファイルアップロード（オーバーライド）
		 */
		fileInput: function(options){
			if (typeof options === 'undefined') {
				options = {};
			}

			var selectMode;
			if (options.selectMode) {
				selectMode = options.selectMode;
			} else {
				selectMode = options.fileTable ? 'multiple' : 'single';
			}

			_.defaults(options, {
				showDialogOnError: true,
				filename: 'filename',
				'id': 'id',
				'uri': 'uri'
			});

			var vent = _.extend({}, Backbone.Events);

			var normalizeFiles = function (files) {
				return _.map(files, function (file) {
					return {
						id: file[options['id']],
						filename: file[options.filename],
						uri: file[options.uri]
					};
				});
			};

			var Collection = Backbone.Collection.extend({});
			var collection = new Collection(normalizeFiles(options.files));

			var FileInputView = Backbone.View.extend({
				// AOKIのURLはmonoと違う
				url: clcom.apiRoot + '/cm_fileupload',

				events: {
					'change input[type=file]': 'inputChanged',
					'click .cl-file-delete': 'deleteClicked',
					'mousemouve .file-input-wrapper': 'adjustPosition'
				},

				adjustPosition: function (cursor) {
				},

				initialize: function (options) {
					this.options = options || {};
					if (this.options.url)
						this.url = this.options.url;
					_.bindAll(this);
					this.$fileInput = this.$('input[type=file]');
					this.$fileInput.attr('name', 'file');

					// input type='file'をaタグでwrapする
					var x = function($elem, $button) {
						var input = $('<div>').append($elem.eq(0).clone()).html();
						// $button.before(
						//   '<a class="file-input-wrapper ' + $button.attr('class') + '"></a>'
						// ).hide();
						$button.before(
								'<a class="file-input-wrapper ' + $button.attr('class') + '">' +
								$button.text() + input + '</a>'
						).hide();
						$elem.remove();
					}(this.$fileInput, this.$('.cl-file-attach'));

					this.$fileInput = this.$('input[type=file]');
					this.$('.file-input-wrapper').mousemove(function(cursor){
						var input, wrapper,
						wrapperX, wrapperY,
						inputWidth, inputHeight,
						cursorX, cursorY,
						moveInputX, moveInputY;

						// This wrapper element (the button surround this file input)
						wrapper = $(this);
						// The invisible file input element
						input = wrapper.find("input[type=file]");
						// The left-most position of the wrapper
						wrapperX = wrapper.offset().left;
						// The top-most position of the wrapper
						wrapperY = wrapper.offset().top;
						// The with of the browsers input field
						inputWidth= input.width();
						// The height of the browsers input field
						inputHeight= input.height();
						//The position of the cursor in the wrapper
						cursorX = cursor.pageX;
						cursorY = cursor.pageY;

						//The positions we are to move the invisible file input
						// The 20 at the end is an arbitrary number of pixels that we can shift the input such that cursor is not pointing at the end of the Browse button but somewhere nearer the middle
						moveInputX = cursorX - wrapperX - inputWidth + 20;
						// Slides the invisible input Browse button to be positioned middle under the cursor
						moveInputY = cursorY- wrapperY - (inputHeight/2);

						// Apply the positioning styles to actually move the invisible file input
						input.css({
							left:moveInputX,
							top:moveInputY
						});
					});
					this.vent = this.options.vent;
				},

				// Windows形式のパス表現文字列からファイル名のみをぬきだす。
				// input type=file のvalueの値からファイル名取得するために使用
				getFileName: function (path) {
					var filename = _.last(path.split('\\'));
					return filename;
				},

				onUploadSuccess: function (data, dataType) {
					var filename = this.getFileName(this.$fileInput.val()),
					file = {
						id: data.id,            // ファイル識別子
						filename: filename,
						uri: data.uri           // ファイル取得用URI
					};
					if (this.options.selectMode === 'single') {
						this.collection.reset([file]);
					} else {
						this.collection.add(file);
					}
					this.vent.trigger('success', file, data, dataType);
				},

				onUploadError: function (jqXHR, textStatus, errorThrown) {
					console.error(textStatus, errorThrown);
					if (this.options.showDialogOnError) {
						// AOKI
						new clutil.ErrorDialog('ファイルアップロードに失敗しました。');
					}

					this.vent.trigger('error', jqXHR, textStatus, errorThrown);
				},

				onUploadComplete: function (jqXHR, textStatus) {
					var $form = this.$fileInput.closest('form'),
					form = $form.get(0);
					$form.find('.cl-file-attr').remove();

					if (form) {
						form.reset();
						this.$fileInput.unwrap();
					}
					clutil.unblockUI(this.url);

					this.vent.trigger('complete', jqXHR, textStatus);
				},

				inputChanged: function (event) {
					var filename = this.getFileName(this.$fileInput.val()),
					$form = this.$fileInput.wrap('<form>').parent(),
					$hidden = $('<input class="cl-file-attr" name="attr" type="hidden">').appendTo($form);

					$hidden.val(JSON.stringify({
						filename: filename
					}));

					clutil.blockUI(this.url);
					$form.ajaxSubmit({
						type: 'POST',
						dataType: 'json',
						contentType: 'multipart/form-data',
						url: this.url,
						success: this.onUploadSuccess,
						error: this.onUploadError,
						complete: this.onUploadComplete
					});
				},

				deleteClicked: function (event) {
					var items = this.collection.filter(function (model) {
						return model.get('checked');
					});
					console.log(items);
					this.collection.remove(items);
				}
			});
			var fileInputView = new FileInputView({
				el: options.fileInput,
				selectMode: selectMode,
				collection: collection,
				showDialogOnError: options.showDialogOnError,
				vent: vent,
				url: clcom.uploadDestUri
			});

			var fileAttachTable;
			var fileLabel;

			if (options.fileTable) {
				fileAttachTable = new FileAttachTable(_.defaults({
					collection: collection,
					headerFileName: options.headerFileName
				}, options.tableOptions));

				$(options.fileTable).html(fileAttachTable.el);
			}

			if (options.fileLabel) {
				fileLabel = new FileLabel(_.defaults({
					el: options.fileLabel,
					collection: collection
				}));
			}

			/**
			 * クリーンアップ処理を行なう
			 */
			function close() {
				if (fileLabel)
					fileLabel.remove();
				if (fileAttachTable)
					fileAttachTable.remove();
				if (fileInputView)
					fileInputView.remove();
			}

			/**
			 * getFilesの返り値から添付一覧を復元する
			 *
			 * @param {Array} files
			 */
			function setFiles(files) {
				collection.reset(normalizeFiles(files));
			}

			/**
			 * サーバー送信用もしくは、のちに復元できるように添付一覧を返却する
			 *
			 * @return {Array}
			 */
			function getFiles() {
				return _.map(collection.toJSON(), function (file) {
					var o = {};
					o[options.filename] = file.filename;
					o[options['id']] = file['id'];
					o[options.uri] = file.uri;
					return o;
				});
			}

			return _.extend(vent, {
				close: close,
				setFiles: setFiles,
				getFiles: getFiles
			});
		},

		/**
		 * datepickerの作成 -- 開始曜日が月曜からなるようにオーバーライド
		 * 引数
		 * ・$view : 表示エリアのjQueryオブジェクト (例：$('#viewarea'))
		 * 戻り値
		 * ・datepickerオブジェクト
		 */
		datepicker: function($view, min_date, max_date) {
		  var date = clutil.ymd2date(clcom.getOpeDate());
		  var min_date = min_date == null ? clutil.ymd2date(clcom.min_date) :  clutil.ymd2date(min_date);
	      var max_date = max_date == null ? clutil.ymd2date(clcom.max_date) :  clutil.ymd2date(max_date);;
		  date.setFullYear(date.getFullYear() + 20);
		  $view.attr('maxlength', 10);
		  $view.val(clutil.dateFormat(clcom.getOpeDate(), 'yyyy/mm/dd'));
		  return $view.datepicker({
			dateFormat: 'yy/mm/dd',
			changeMonth: true,
			changeYear: true,
			firstDay: 1,
			yearRange: min_date.getFullYear() + ':' + max_date.getFullYear(),
	        minDate: min_date,
	        maxDate: max_date,
			autoSize: true,
			showOn: 'button',
			buttonImage: clcom.appRoot + '/../images/icn_s_calendar.png',
			buttonText: clmsg.cl_datepicker_button_text,
			buttonImageOnly: true
//			numberOfMonths: 3, // 表示月数
//			showCurrentAtPos: 1 // 先月から表示する
//			defaultDate: clutil.ymd2date(clcom.getOpeDate())
		  });
		},

		/**
		 * clutil.validator インスタンスを返す。
		 */
		validatorWithTicker: function($scope, opt){
			var validator = clutil.validator($scope, opt);

			// validator.valid() 関数を上書き
			// '.cl_valid' は広範囲すぎるマーカークラスなのに、「",」混入不可なチェックが行われる。
			// このチェックを外したいがために、valid() 関数をオーバーライドした。
			// 何で別のクラスで定義しなかった？
			// 同等チェックを '.cl_xcommadquot' で再定義した
			var origValidFunc = _.bind(validator.valid, validator);
			validator.valid = function(options) {
				if(options == null || options.useMDFixedValidFunc !== true){
					return origValidFunc(options);
				}
				options = options || {};
				_.defaults(options, {filter: function() {return true}});
				var me = this,
				hasError = false,
				ebmsgs = [],		  // エコーバック表示用メッセージ
				msgcd2msg = function(msgcd){
					var fmtargs = _.toArray(arguments);
					fmtargs[0] = clmsg['cl_'+msgcd];
					var msg = clutil.fmt.apply(this, fmtargs);			   // 項目名ラベルなし
					return msg;
				},
				setError = function (input, msgcd) {
					validator.setErrorMsg($(input), msgcd2msg.apply(this, Array.prototype.slice.call(arguments, 1)));
					hasError = true;
				};

				// 手抜き日本語のみ対応
				var dateToYmd = function(date) {
					try {
						return date.toLocaleString().split(' ')[0];
					} catch (e) {
						return date.toLocaleString();
					}
				};
				// エラー情報クリア - '.cl_valid' クラス一覧が返る。
				// '.cl_valid' クラスの入力を確認して、エラー情報を埋め込む
				//									  $('.cl_valid', this.form)
				this.clear()
				.removeClass('cl_error_field')
				.filter(options.filter)
				.filter('.cl_cm_code_input')
				.each(function () {
					var $this = $(this),
					val = $this.val(),
					data = $this.data('cm_code'),
					id = data && data.id;
					if (val && !id) {
						// 共通部品コードセレクターでコードは入力済みだがidが設定されていない
						setError(this, 'cmcodeerror');
					} else if ($this.hasClass('cl_required') && !id) {
						setError(this, 'required');
					}
				})
				.end()
				// cl_required: 入力必須 //////////////////////
				.filter('.cl_required:not(.cl_cm_code_input)')
				.each(function(){
					var $this = $(this);
					if ($this.is('select') && $this.val() === '0') {
						setError(this, 'required');
						// AOKI
					} else if ($this.is('span')) {
						if ($this.html().length === 0) {
							setError(this, 'required');
						}
					} else if ($this.is('td')) {
						if (!clutil.chkStr($this.text())) {
							setError(this, 'required');
						}
					} else if (!$this.is('div') && !$(this).val()) {
						// selectpicker用にdivの場合は考えない
						setError(this, 'required');
					}
				})
				.end()
				// cl_length: 入力長制限 /////////////////////
				.filter('.cl_length')
				.each(function(){
					var len = $(this).val().length;
					var max = $(this).data('max');
					var min = $(this).data('min');
					var hasMax = _.isNumber(max);
					var hasMin = _.isNumber(min);
					if (hasMax && hasMin) {
						if (len < min) {
							// {0}が短すぎます。{1}～{2}文字で入力してください。
							setError(this, 'length_short2', min, max);
						} else if (len > max) {
							// {0}が長すぎます。{1}～{2}文字で入力してください。
							setError(this, 'length_long2', min, max);
						}
					} else if (hasMax) {
						if (len > max) {
							// {0}が長すぎます。{1}文字以下で入力してください。
							setError(this, 'length_long1', max);
						}
					} else if (hasMin) {
						// len == 0 は、cl_required (必須）でチェックすることとする！
						if (len > 0 && len < min) {
							// {0}が短すぎます。{1}文字以上で入力してください。
							setError(this, 'length_short1', min);
						}
					}
				})
				.end()
				.filter('[data-validator]')
				.each(function (i, el) {
					var $el = $(el),
					value = $el.val(),
					validators = _.compact(
							$el.attr('data-validator').split(/ +/)
					),
					errors = _.chain(validators).map(function (validator) {
						return callValidator(validator, value);
					}).compact().value();

					if (errors.length) {
						setErrorMsg($el, errors[0]);
						hasError = true;
					}
				})
				.end()
				// cl_email: メールアドレス形式 /////////////
				.filter('.cl_email')
				.each(function(){
					var value = $(this).val();
					if (value === '') {
						return;
					}
					if (value.length > 256) {
						setError(this, 'email_long');
						return;
					}
					var reg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
					if (!reg.test(value)) {
						setError(this, 'email');
					}
				})
				.end()
				// cl_url: URL形式 //////////////////////////
				.filter('.cl_url')
				.each(function(){
					var value = $(this).val();
					if (value === '') {
						return;
					}
					var reg = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
					if (!reg.test(value)) {
						setError(this, 'url');
					}
				})
				.end()
				// cl_date: 日付 - datepicker によるもの ////
				.filter('.cl_date')
				.each(function(){
					var value = $(this).val();
					if (value === '') {
						return;
					}
					var date = new Date(value);
					if (!_.isDate(date) || isNaN(date.getTime())) {
						setError(this, 'date_inval');
						return;
					}
					var srcymd = value.split('/');
					var chkymd = [date.getFullYear(), date.getMonth()+1, date.getDate()];
					if (srcymd.length != chkymd.length) {
						setError(this, 'date_inval');
						return;
					} else {
						for (var i=0; i<chkymd.length; i++) {
							if (parseInt(srcymd[i], 10) != chkymd[i]) {
								setError(this, 'date_inval');
								return;
							}
						}
					}
					var maxDate = $(this).datepicker("option", "maxDate");
					var minDate = $(this).datepicker("option", "minDate");
					if (maxDate != null && date.getTime() > maxDate.getTime()) {
						// 大きすぎ
						if (minDate != null) {
							setError(this, 'date_max', dateToYmd(maxDate));
						} else {
							setError(this, 'date_range', dateToYmd(minDate), dateToYmd(maxDate));
						}
					}
					if (minDate != null && date.getTime() < minDate.getTime()) {
						// 小さすぎ
						if (date.getTime() < minDate.getTime()) {
							setError(this, 'date_min', dateToYmd(minDate));
						} else {
							setError(this, 'date_range', dateToYmd(minDate), dateToYmd(maxDate));
						}
					}
				})
				.end()
				// cl_date: YYYY/mm 形式のチェック
				.filter('.cl_ym')
				.each(function(){
					var value = $(this).val();
					if (value === '') {
						// 空欄はOKとする。必須とするなら、cl_required と併用すること
						return;
					}
					var match = value.match(/^([0-9]{4,4})\/([0-9]{2,2})$/);
					if (!match) {
						setError(this, 'month_inval');
						return;
					}
					console.log(match);
					var year = match[1],
					month = match[2];
					if (month < 1 || month > 12) {
						setError(this, 'month_inval');
					}
				})
				.end()
				.filter('.cl_month') // 月
				.each(function(){
					var value = $(this).val();
					if (value === '') {
						// 空欄はOKとする。必須とするなら、cl_required と併用すること
						return;
					}

					var date = value.split('/');
					if (date.length !== 2 || !/^[0-9]+$/.test(date[0]) ||
							!/^[0-9]+$/.test(date[1])) {
						setError(this, 'month_inval');
						return;
					}
					if (date[1] < 1 || date[1] > 12) {
						setError(this, 'month_inval');
						return;
					}
				})
				.end()

				.filter('.cl_zenkaku') // 全角（半角入力を許可してからのチェック）
				.each(function(){
					var val = $(this).val();
					if (!val.length) { // 空はOK!
						return;
					}
					var len = _.reject(val.split(''), clutil.isHalf).length;
					if (len !== val.length) {
						return setError(this, 'zenkaku');
					}
				})
				.end()

				.filter('.cl_hankaku') // 半角（全角入力を許可してからのチェック）
				.each(function(){
					var val = $(this).val();
					var han = clutil.zen2han(val);
					$(this).val(han);
					var han_retStat = clutil.chkzen2han(han);
					if (han_retStat == 0) {
						setError(this, 'hankaku');
						return;
					} else if (han_retStat == -1) {
						setError(this, 'input');
						return;
					}
				})
				.end()
// このチェックをやらせたくないだけ。'.cl_valid' は広範囲すぎるマーカークラスなのに、何で別のクラスで定義しなかった？
//				.filter('.cl_valid') // ,"のチェック
				.filter('.cl_xcommadquot')
				.each(function(){
					var val = $(this).val();
					if ($(this).attr('data-filter') != 'comma') {
						var han_retStat = clutil.chkzen2han(val);
						if (han_retStat == -1) {
							setError(this, 'input');
							return;
						}
					}
				})
				.end()

				.filter('.cl_time') // 時刻指定
				.each(function(){
					var value = $(this).val();
					if (value === '') {
						return;
					}

					var date = value.split(':');
					if (date.length !== 2 || !/^[0-9]+$/.test(date[0]) ||
							!/^[0-9]+$/.test(date[1])) {
						setError(this, 'time_inval');
						return;
					}
					if (date[0] < 0 || date[0] > 23) {
						setError(this, 'time_inval');
						return;
					}
					if (date[1] < 0 || date[1] > 59) {
						setError(this, 'time_inval');
						return;
					}
				})
				.end()

				// cl_regex: 正規表現 ///////////////////////
				.filter('.cl_regex')
				.each(function(){
					var pat = $(this).data('pattern');
					var reg = new RegExp(pat);
					if (!reg.test($(this).val())) {
						setError(this, 'regex');
					}
				});

				_($('[data-required2]', this.form)).chain()
				.reduce(function (memo, element) {
					var attr = $(element).attr('data-required2');
					memo[attr] = (memo[attr] || []);
					memo[attr].push(element);
					return memo;
				}, {})
				.some(function (elements, key) {
					if (_.all(elements, function (element, id) {
						return $(element).val() === '';
					})) {
						_.each(elements, function (element) {
							setError(element, 'required2');
						});
					}
				})
				.value();

				// どちらかに入力があった場合、入力必須とする
				_($('[data-required3]', this.form)).chain()
				.reduce(function (memo, element) {
					var attr = $(element).attr('data-required3');
					memo[attr] = (memo[attr] || []);
					memo[attr].push(element);
					return memo;
				}, {})
				.some(function (elements, key) {
					if (_.some(elements, function (element, id) {
						return  $(element).val() !== '';
					})) {
						_.each(elements, function (element) {
							if ($(element).val() === '') {
								setError(element, 'required');
							}
						});
					}
				})
				.value();

				// どちらかに入力があった場合、入力必須とする
				_($('[data-required03]', this.form)).chain()
				.reduce(function (memo, element) {
					var attr = $(element).attr('data-required3');
					memo[attr] = (memo[attr] || []);
					memo[attr].push(element);
					return memo;
				}, {})
				.some(function (elements, key) {
					if (_.some(elements, function (element, id) {
						return  $(element).val() !== '' && $(element).val() !== 0 && $(element).val() !== '0';
					})) {
						_.each(elements, function (element) {
							if ($(element).val() === '' || $(element).val() === 0 || $(element).val() === '0') {
								setError(element, 'required');
							}
						});
					}
				})
				.value();

				if (hasError) {
					if (this.echoback != null) {
						this.setErrorHeader(clmsg.cl_echoback);
					}
					clutil.setFocus($('.cl_error_field', this.form).first());
				}
				return !hasError;
			};

			return validator;
		},

		han_txt : "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｬｭｮｯ､｡ｰ｢｣0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZﾞﾟ ",
		zen_txt : "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォャュョッ、。ー「」０１２３４５６７８９ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ" +
				  "　　　　　ガギグゲゴザジズゼゾダヂヅデド　　　　　バビブベボ　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　" +
				  "　　　　　　　　　　　　　　　　　　　　　　　　　パピプペポ　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　",

		zen2han: function(txt) {
			var retStr = "";
			for (var i = 0; i < txt.length; i++) {
				var c = txt.charAt(i);
				var n = clutil.zen_txt.indexOf(c, 0);

				if (n == 122) {
					// 空白対応
					c = clutil.han_txt.charAt(124);
				} else if (n >= 182) {
					c = clutil.han_txt.charAt(n-182);
					c += clutil.han_txt.charAt(123);
				} else if (n >= 122) {
					c = clutil.han_txt.charAt(n-122);
					c += clutil.han_txt.charAt(122);
				} else if (n >= 0) {
					c = clutil.han_txt.charAt(n);
				}

				retStr += c;
			}
			return retStr;
		},

		han2zen: function(txt) {
			var retStr = "";
			for (var i = 0; i < txt.length; i++) {
				var c = txt.charAt(i);
				var cnext = txt.charAt(i+1);
				var n = clutil.han_txt.indexOf(c, 0);
				var nnext = clutil.han_txt.indexOf(cnext,0);
				if (n >= 0) {
					if (nnext == 122) {
						c = clutil.zen_txt.charAt(n+122);
						i++;
					} else if (nnext == 123) {
						c = clutil.zen_txt.charAt(n+182);
						i++;
					} else {
						c = clutil.zen_txt.charAt(n);
					}
				}
				if ((n != 122) && (n != 123)) {
					retStr += c;
				}
			}
			return retStr;
		},

		/**
		 * イベント中継用の Backbone.Event インスタンス ⇒ clutil.mediator
		 */
		 mediator: _.extend({}, Backbone.Events),

		/**
		 * 処理区分値に対するラベル名を返します。
		 */
		 opeTypeIdtoString: function(opeTypeId, _btnlabel){
			var s = '';
			switch(opeTypeId){
			//case -1:											s = '';			break;
			//case 0:												s = '一覧';		break;	// SPECIAL
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				s = (_btnlabel <= 1) ? '登録' : '新規登録';
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				s = (_btnlabel == 1) ? '登録' : '編集';
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		s = '削除';		break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		s = '照会';		break; //'参照'; break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:		s = 'Excelデータ出力';	break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT:	s = 'Excelデータ取込';	break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
				s = (_btnlabel == 1) ? '登録' : '複製';
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:		s = '帳票出力';	break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DELCANCEL:	s = '削除復活'; break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	s = '予約取消';	break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE:	s = '一時保存';	break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY:		s = '申請';		break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL:	s = '承認';		break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK:	s = '差戻し';	break;
			default:
			}
			return s;
		},

		/**
		 * 処理区分値に対する権限分類
		 */
		opeTypeIdPerm: function(opeTypeId){
			switch(opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:		return 'write';	// 新規登録
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:		return 'write';	// 編集
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		return 'del';	// 削除
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		return 'read';	// 参照
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:		return 'read';	// CSV出力
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT:	return 'write';	// CSV取込
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:		return 'write';	// 複製
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF:		return 'read';	// PDF出力
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DELCANCEL:	return 'write';	// 削除復活
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	return 'del';	// 予約取消
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE:	return 'write';	// 一時保存
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY:		return 'write';	// 申請
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL:	return 'write';	// 承認
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK:	return 'del';	// 差し戻し

			case 101:	// 保存
			case 102:	// タグ発行申請
			case 103:	// タグ発行差戻し
			case 104:	// タグ発行承認
			case 105:	// 最終承認申請
			case 106:	// 最終承認差戻し
			case 107:	// 最終承認
				return 'write';
			}
			return '';
		},

		/**
		 * ボタンタグ id に対する処理区分値を返します。定型の id 名を用いていない場合は -1 を返します。
		 */
		btnOpeTypeId: function(btn){
			var btnId = null;
			if(btn instanceof jQuery && btn.length > 0){
				btnId = btn[0].id;
			}else if(_.isElement(btn)){
				btnId = btn.id;
			}else if(_.isString(btn)){
				btnId = $.trim(btn);
			}
			if(!_.isEmpty(btnId)){
				switch(btnId){
				case 'cl_new':		return am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;			// 新規登録
				case 'cl_edit':		return am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;			// 編集
				case 'cl_delete':	return am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL;			// 削除
				case 'cl_rel':		return am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;			// 参照
				case 'cl_csv':		return am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV;			// CSV出力
				case 'cl_csvinput':	return am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT;	// CSV取込
				case 'cl_copy':		return am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY;		// 複製
				case 'cl_pdf':		return am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF;			// PDF出力
				case 'cl_delcancel':return am_proto_defs.AM_PROTO_COMMON_RTYPE_DELCANCEL;	// 削除復活
				case 'cl_rsvcancel':return am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL;	// 予約取消
				case 'cl_tmpsave':	return am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE;		// 一時保存
				case 'cl_apply':	return am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY;		// 申請
				case 'cl_approval':	return am_proto_defs.AM_PROTO_COMMON_RTYPE_APPROVAL;	// 承認
				case 'cl_passback':	return am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK;	// 差し戻し
				default:
				}
			}
			return -1;
		},

		_eof: '--'
	});

	// バリデータの代表インスタンスと mediator イベント
	clutil.validator0 = function(){
		var validator = clutil.validator($('body'), {echoback: $('.cl_echoback')});
		clutil.mediator.on('onTicker', function(anyArg){
			// エラーメッセージをセット
			var msg = null;
			if(_.isEmpty(anyArg)){
				;
			}else if(_.isString(anyArg)){
				// 文字列型の場合
				msg = anyArg;
			}else if(anyArg._eb_){
				// validator.setErrorInfo の引数の場合
				msg = anyArg._eb_;
			}else if(anyArg.status && anyArg.message){
				// 共通ヘッダそのものの場合
				msg = clutil.fmtargs(clutil.getclmsg(anyArg.message), anyArg.args);
			}else if((anyArg.head && anyArg.head.message)){
				// 共通ヘッダを包括したオブジェクトの場合
				msg = clutil.fmtargs(clutil.getclmsg(anyArg.head.message), anyArg.head.args);
			}else if((anyArg.rspHead && anyArg.rspHead.message)){
				// 共通ヘッダを包括したオブジェクトの場合
				msg = clutil.fmtargs(clutil.getclmsg(anyArg.rspHead.message), anyArg.rspHead.args);
			}else{
				msg = '???';
			}
			if(_.isEmpty(anyArg)){
				validator.clearErrorHeader();
			}else{
				validator.setErrorHeader(msg);
			}
		});
		clutil.mediator.on('onFieldTicker', function($el, msgCode, msgArgArray){
			if(_.isEmpty(msgCode)){
				// ツールチップ表示エリアを刈り取る。
				// $el に hover したまま、ツールチップ表示のための属性等を刈り取ると、
				// ツールチップが残存したまま刈り取れなくなるため。
				$('.tooltip.fade.top.in').remove();
				// エラーコードなし ⇒ フィールドエラーをクリア
				validator.clearErrorMsg($el);
			}else{
				// エラーコード
				var fmtFuncArgs = [ clutil.getclmsg(msgCode) ];
				if(_.isArray(msgArgArray)){
					fmtFuncArgs = fmtFuncArgs.concat(msgArgArray);
				}
				var msgWithArg = clutil.fmt.apply($el, fmtFuncArgs);
				validator.setErrorMsg($el, msgWithArg);
			}
		});
		return validator;
	}();

	/**
	 * clutil.view ネームスペース
	 */
	if(clutil.view == null){
		clutil.view = {};
	}
	_.extend(clutil.view, {
		/**
		 * clutil.view.InputCounter
		 * テキスト入力エリアに入力長残数カウンタを置く。
		 * 入力文字列長制限は、data-limit="len:<n>" の機構で制御することを前提とする。
		 *
		 * options:
		 * 	$input				必須	入力フィールドの jQuery オブジェクト
		 * 	maxLength			必須	入力最大長
		 * 	warnCount			1		警告表示する文字数境界値
		 * 	noCounter			false	カウンタ有無
		 * 	className			--		$el 要素にスタイル定義のためのクラスを指定する。
		 * 	checkImmediately	true	true:文字列制限を長超過したら、ただちに即座に行いフィールドメッセージを表示する
		 * fix_data_limit_attr	--		属性「data-limit="len:<n>"」を補完する。
		 */
		InputCounter: Backbone.View.extend({
			events: {
				'input .cl-form-control': function(e){
					// 入力長制限は、data-limit="len:32" の機構で制御することを前提。
					this.setCount();
				}
			},
			initialize: function(opt){
				if(opt == null){
					throw 'clutil.view.InputCounter: options must speifiy!';
				}
				if(opt.$input == null){
					throw 'clutil.view.InputCounter: Invalid arguments exception. $input is NULL.';
				}
				if(!_.isFinite(opt.maxLength) || opt.maxLength <= 0){
					throw 'clutil.view.InputCounter: Invalid arguments exception. maxLength [' + opt.maxLength + '] is bad.';
				}
				this.className = opt.className;
				this.$input = opt.$input;
				this.$input
					.addClass('cl-form-control cl_valid cl_length')
					.data('max', opt.maxLength);
				if(opt.fix_data_limit_attr){
					// 属性「data-limit="len:<n>"」を補完するオプション
					this.$input.attr('data-limit', 'len:' + opt.maxLength);
				}

				this.$counter = $('<span class="limit">0</span>');

				this.options = _.defaults(opt, {
					warnCount: 1,
					noCounter: false,
					checkImmediately: true
				});
			},
			render: function(){
				this.$el.addClass('cltxtFieldLimitWrapper').css('position', 'relative');
				this.$input.wrap(this.$el);
				if(this.options.noCounter == false){
					this.$input.after(this.$counter);
				}
				this.setCount();
				return this;
			},
			getCounterState: function(remainCount){
				var remain = remainCount || this.getCount();
				return (remain > this.options.warnCount) ? 'normal' : 'alert';
			},
			getCount: function(){
				var remain = this.options.maxLength - this.$input.val().length;
				return remain;
			},
			setCount: function(remainCount){
				var remain = remainCount || this.getCount();
				this.$counter.text(remain);
				if(this.getCounterState(remain) == 'alert'){
					this.$counter.addClass('alert');
				}else{
					this.$counter.removeClass('alert');
				}
				if(remain < 0 && this.options.checkImmediately){
					// 入力長を超えている！！！
					// 入力フィールドにエラーメッセージを付加する
					clutil.mediator.trigger('onFieldTicker', this.$input, 'cl_length_long1', [this.options.maxLength]);
				}else{
					// 入力長制限以内にある。
					// 入力フィールドのエラーメッセージを取り払う
					clutil.mediator.trigger('onFieldTicker', this.$input, null/*メッセージクリアする*/);
				}
			},
			showCounter: function(){
				this.setCount();
				this.$counter.show();
			},
			hideCounter: function(){
				this.$counter.hide();
			},
			destroy: function(){
				this.$counter.remove();
				this.$input.removeClass('cl-form-control').unwrap(this.$el);
				this.remove();
			}
		}),

		/**
		 * アップロードチェック用のファイルタイプ定義
		 */
		 FileTypes: {
			image: {
				description:'画像ファイル',
				matcher:[/^image\//]
			},
			excel: {
				description:'エクセルファイル',
				matcher:[
//					'application/vnd.ms-excel',
//					'application/vnd.ms-excel.sheet.macroEnabled.12',
					/^application\/vnd.ms-excel/,
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'	// *.xlsx
				],
				extension: [/\.xls$/i, /\.xlsx$/i]
			},
			csv: {
				description: 'ＣＳＶファイル',
				matcher: ['text/csv', 'application/vnd.ms-excel'],
				extension: [ /\.csv$/i ]
			},
			xml: {
				description: 'ＸＭＬファイル',
				matcher: ['text/xml']
			},
			text: {
				description: 'テキストファイル',
				matcher: ['text/plain']
			},
			pdf: {
				description: 'ＰＤＦファイル',
				extension: [ /\.pdf$/i ]
			},
			zip: {
				description: 'ＺＩＰファイル',
				extension: [ /\.zip$/i ]
			}
		},

		/**
		 * ファイルアップロード用のボタンView
		 * 複数ファイル選択は未対応。
		 */
		 FileUploadButtonView: Backbone.View.extend({
			tagName: 'form',
			//className: 'fieldBox noName',

			template: _.template(''
				+ '<a href="javascript:void(0);" class="file-input-wrapper <%= btnCssClassName %> cl-file-attach">'
				+ '<%- label %>'
				+ '	<input type="file" class="hide-input" name="file">'
				+ '	<input class="cl-file-attr" name="attr" type="hidden">'
				+ '</a>'),

			events: {
				'mousemove a'				: '_adjustPosition',
				'click input[type=file]'	: function(e){
					return this._beforeShowFileChooser();
				},
				'keydown a:not([disabled])'	: function (e) {
					// Enter キーでクリック発火
					if (e.keyCode === 13 && this._beforeShowFileChooser()) {
						this.$inputFile.trigger('click');
					}
				},
				'change input[type=file]'	: '_inputFileChanged'
			},

			/**
			 */
			initialize: function(opt){
				_.bindAll(this);

				var defaultOpts = {
					label: 'ファイルアップロード',
					//width: 280,
					btnCssClassName: '',
					doUploadImmediately: true,		// ファイル選択後すぐにアップロードを実行
					url: clcom.uploadDestUri		// アップロードサービスURI: '/system/api/am_cm_fileupload',
				};
				this.options = _.isObject(opt) ? _.extend(defaultOpts, opt) : defaultOpts;
			},

//			// お約束の内部部品初期化
//			initUIElement: function(){
//				return this;
//			},

			render: function(){
				this.$el.html(this.template(this.options));
				this.$btn = this.$el.find('a');
				if(this.options.width){
					this.$btn.css('width', this.options.width + 'px');
				}
				this.$inputFile = this.$el.find('input[name="file"]');
				this.$inputAttr = this.$el.find('input[name="attr"]');

				return this;
			},

			// <a> タグ内のmousemove で、内部の input[type=file] がストーキングするおまじない。
			_adjustPosition: function(cursor) {
				var input, wrapper,
				wrapperX, wrapperY,
				inputWidth, inputHeight,
				cursorX, cursorY,
				moveInputX, moveInputY;

				// This wrapper element (the button surround this file input)
				wrapper = this.$btn;//$(this);
				// The invisible file input element
				input = this.$inputFile;//wrapper.find("input[type=file]");
				// The left-most position of the wrapper
				wrapperX = wrapper.offset().left;
				// The top-most position of the wrapper
				wrapperY = wrapper.offset().top;
				// The with of the browsers input field
				inputWidth= input.width();
				// The height of the browsers input field
				inputHeight= input.height();
				//The position of the cursor in the wrapper
				cursorX = cursor.pageX;
				cursorY = cursor.pageY;

				//The positions we are to move the invisible file input
				// The 20 at the end is an arbitrary number of pixels that we can shift the input such that cursor is not pointing at the end of the Browse button but somewhere nearer the middle
				moveInputX = cursorX - wrapperX - inputWidth + 20;
				// Slides the invisible input Browse button to be positioned middle under the cursor
				moveInputY = cursorY- wrapperY - (inputHeight/2);

				// Apply the positioning styles to actually move the invisible file input
				input.css({
					left:moveInputX,
					top:moveInputY
				});
			},
			// ファイル選択直前のアプリチェック割り込み
			_beforeShowFileChooser: function(){

				// 権限チェック内部関数
				var isBadPermFunc = function(opeTypeId){
					if(clutil._XXXDBGGetIniPermChk === false){
						// 権限チェックをスキップする
						return;
					}
					var pageId = clcom.pageId;
					if(_.isEmpty(pageId) || !/^AM[A-Z]{2}V[0-9]{4}$/.test(pageId)){
						// MDの画面コード体系にマッチしていないので、権限制限外（制限を受けない）と判断する。
						return;	// OK
					}

					var pm = clcom.getPermfuncByCode(pageId);
					var permtype = clutil.opeTypeIdPerm(opeTypeId);

					if (permtype == 'write') {
						if(!_.isEmpty(pm) && (pm.f_allow_write)){
							return;	// OK
						}
					} else if (permtype == 'del') {
						if(!_.isEmpty(pm) && (pm.f_allow_del)){
							return;	// OK
						}
					}
					return permtype;
				};

				// 更新権限チェック追加
				var permChk = isBadPermFunc(am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT);	// CSV取込
				if (permChk == 'write') {
					clutil.mediator.trigger('onTicker', clmsg.is_upd_false);
					return false;
				} else if (permChk == 'del') {
					clutil.mediator.trigger('onTicker', clmsg.is_del_false);
					return false;
				}


				if(!_.isFunction(this.options.beforeShowFileChooser)){
					return true;
				}
				// 明示的に false を返さないと、キャンセル扱いにしない。
				return this.options.beforeShowFileChooser() !== false;
			},
			// ファイル選択が変更された
			_inputFileChanged: function(e){
				var files = e.target.files;
				if(files.length <= 0){
					// キャンセル？
					this.clear();
					return;
				}

				var selectedFile = files[0];

				// ファイルタイプチェック
				var chkFileType = this.options.fileType;
				if(chkFileType){
					var isMatch = function(str, matcher){
						if(_.isRegExp(matcher)){
							return str.match(matcher);
						}else{
							return str == matcher;
						}
						return false;
					};
					var ftypeNG_Abort = _.bind(function(){
						// ファイルタイプがNG
						var msg = chkFileType.description + 'を選択してください。';
						clutil.mediator.trigger('onTicker', msg);
						this.clear();
					}, this);

					// ファイルタイプチェック
					var isValidFileType = true;
					if(_.isArray(chkFileType.matcher) && chkFileType.matcher.length > 0){
						isValidFileType = false;
						for(var i = 0; i < chkFileType.matcher.length; i++){
							var matcher = chkFileType.matcher[i];
							if(isMatch(selectedFile.type, matcher)){
								isValidFileType = true;
								break;
							}
						}
					}
					if(!isValidFileType){
						// ファイルタイプがNG
						ftypeNG_Abort();
						return;
					}

					// ファイル拡張子チェック
					var isValidExtension = true;
					var fname = e.target.value;
					if(_.isArray(chkFileType.extension) && chkFileType.extension.length > 0){
						isValidExtension = false;
						for(var i = 0; i < chkFileType.extension.length; i++){
							var ext = chkFileType.extension[i];
							if(isMatch(fname, ext)){
								isValidExtension = true;
								break;
							}
						}
					}
					if(!isValidExtension){
						// ファイル拡張子がNG
						ftypeNG_Abort();
						return;
					}
				}

				// ファイルサイズのチェック
				if(this.options.maxFileSize > 0 && selectedFile.size > this.options.maxFileSize){
					var msg = 'ファイルサイズが大きすぎます。{0} 以下のファイルを選択してください。';
					var arg = (this.options.maxFileSize / 1024) + '[KB]';
					clutil.mediator.trigger('onTicker', clutil.fmt(msg, arg));
					this.clear();
					return;
				}

				// 即時アップロード
				if(this.options.doUploadImmediately){
					this.doUpload(selectedFile);
				}
			},
			// Windows形式のパス表現文字列からファイル名のみをぬきだす。
			// input type=file のvalueの値からファイル名取得するために使用
			_baseName: function(path) {
				var filename = _.last(path.split('\\'));
				return filename;
			},

			/**
			 * アップロードする。
			 */
			doUpload: function(selectedFile){
				if(!selectedFile){
					var files = this.$inputFile[0].files;
					if(files.length === 0){
						clutil.mediator.trigger('onTicker', 'ファイルを選択してください。');
						return;
					}
					selectedFile = files[0];
				}

				// ファイル名を Attr にセット
				var filename = (selectedFile.name)
					? selectedFile.name : this._baseName(this.$inputFile.val());
				this.$inputAttr.val(JSON.stringify({
					filename: filename
				}));

				// ファイルアップロード
				var url = this.options.url;
				clutil.blockUI(url);
				return this.$el.ajaxSubmit({
					type: 'POST',
					dataType: 'json',
					contentType: 'multipart/form-data',
					url: url,
					success: this._onUploadSuccess,
					error: this._onUploadError,
					complete: this._onUploadComplete
				});
			},
			_onUploadSuccess: function (data, dataType) {
				var attr = JSON.parse(this.$inputAttr.val());
				var file = {
					id: data.id,
					filename: attr.filename,
					uri: data.uri
				};
				this.clear();
				this.trigger('success', file, data, dataType);
			},
			_onUploadError: function (jqXHR, textStatus, errorThrown) {
				console.error(textStatus, errorThrown);
//				if (this.options.showDialogOnError) {
//					new clutil.ErrorDialog('ファイルアップロードに失敗しました。');
//				}
				clutil.mediator.trigger('onTicker', 'ファイルアップロードに失敗しました。');

				this.trigger('error', jqXHR, textStatus, errorThrown);
			},
			_onUploadComplete: function (jqXHR, textStatus) {
				clutil.unblockUI(this.options.url);
				this.trigger('complete', jqXHR, textStatus);
			},

			/**
			 * クリアする。
			 */
			clear: function(){
				// ファイル選択解除
				this.$el.resetForm();

				// Attr 用 input クリア
				this.$inputAttr.val(null);
			},

			/**
			 * ボタンの活性化/非活性化を設定する。
			 */
			setEnable: function(enable){
				if(enable){
					this.$btn.removeAttr('disabled');
				}else{
					this.$btn.attr('disabled', true);
				}
			},

			/**
			 * ボタンの活性/非活性状態を取得する。
			 */
			isEnabled: function(){
				//return this.$btn.prop('disabled');
				return !this.$btn.attr('disabled');
			},

			_eof: 'clutil.view.FileUploadButtonView//'

		}),

		/**
		 * ファイルアップロード用ボタンビューをつくる。
		 * 引数 btn のボタン要素は、FileUploadButtonView.$el に置き換えられます。
		 */
		buildFileUploadButtonView: function(btn, opts){
			var $btn = (btn instanceof jQuery) ? btn : $(btn);

			var defaulOpts = {
				label: function($btn){
					var label;
					if($btn.is('input')){
						label = $btn.val();
					}else {
						label = $btn.text();
					}
					if(_.isEmpty(label)){
						var id = $btn.attr('id');
						var opeTypeId = clutil.btnOpeTypeId(id);
						label = clutil.opeTypeIdtoString(opeTypeId);
					}
					return label;
				}($btn),
				btnCssClassName: $btn.attr('class')		// ボタンクラス名複写用
			};
			if(_.isObject(opts)){
				opts = _.extend(defaulOpts, opts);
			}else{
				opts = defaulOpts;
			}
			var fileUploadView = new clutil.view.FileUploadButtonView(opts);

			// ボタンを差し替える
			$btn.hide().after(fileUploadView.render().$el).remove();

			return fileUploadView;
		},

		/**
		 * CSV取込処理専用のボタンビュークラスを作る。
		 * opt.btn - アップロード用のボタン要素
		 * opt.fileUploadViewOpts - FileUploadButtonView へ渡す引数
		 * opt.buildCSVInputReqFunction - CSV取込用のリクエストビルダ関数
		 * opt.noDialogOnDone - ファイルアップロード成功時にダイアログを表示しない
		 */
		OpeCSVInputController: function(opt/*btn, buildCSVInputReqFunction, fileUploadViewOpts*/){
			var fixFileUploadOpts = _.extend({
				maxFileSize: 1024 * 1024,					// ファイルサイズ上限：1MB
				fileType: clutil.view.FileTypes.excel		// エクセル
			}, (opt && opt.fileUploadViewOpts) || {});

			var fileUploadView = clutil.view.buildFileUploadButtonView(opt.btn, fixFileUploadOpts);
			fileUploadView.on('success', function(file){
				// サーバスプールへのアップロードまで成功。
				// file: { id: <ファイルID>, filename: <ファイル名>, uri: <ファイルアクセス用のURI> }
				if(!_.isFunction(opt.buildCSVInputReqFunction)){
					// 取込用の要求パケットの作り方がわからないので、すぐ return する。
					return;
				}

				var req = opt.buildCSVInputReqFunction(file);
				if(req == null){
					// アプリ側の事情でキャンセルした。
					console.log('buildCSVInputReqFunction: req is null, canceled.');
					return;
				}
				// 応答構造のチェック
				if(!_.isObject(req) || !_.isString(req.resId) || _.isEmpty(req.resId)){
					// I/F が正しくない
					var m = 'buildCSVInputReqFunction: 引数に誤りがあります。コードを見直してください。';
					console.error(m);
					alert(m);
					return;
				}

				// 共通Reqヘッダ補完サポート
				if(true){
					var defaultReqHead = {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT,
						fileId: file.id
					};
					if(req.data.reqHead){
						req.data.reqHead = _.defaults(req.data.reqHead, defaultReqHead);
					}else{
						req.data.reqHead = defaultReqHead;
					}
					if(!_.isObject(req.data.reqPage)){
						req.data.reqPage = {};
					}
				}

				// 応答時、ページャ部品のページ変更通知を起こさないオプションを指定する。
				req.onRspPage = false;

				// 要求
				clutil.postJSON(req).then(function(data){
					var hd = data.head;
					if(!_.isEmpty(hd.message)){
						clutil.mediator.trigger('onTicker', hd);
						//data.head.message = null;	// fail で再表示しないように、null にしておく。
					}
					if(hd.uri){
						// DLファイルが指定された ⇒ DLメソッドを呼び出す。
						// PDF ファイルを指定されるなど、別窓でDLをやらせるケースってあるの？
						clutil.download(hd.uri);
					}else{
						return this;
					}
				}).done(function(data){
					if (!opt.noDialogOnDone) {
						clutil.MessageDialog2('取込が完了しました。');				// FIXME: height を抑えたダイアログで
					}
					fileUploadView.trigger('done', data);
				}).fail(function(data){
					clutil.saveFileUploadView = fileUploadView;
					clutil.saveFileUploadView.saveOpt = opt;
					console.warn(req.resId + ': failed.', data);
					clutil.mediator.trigger('onTicker', data);
					fileUploadView.trigger('fail', data);
				});
			});

			return fileUploadView;
		},
	});

	/**
	 * HeaderView 書き替え
	 * オリジナルの I/F 互換。
	 */
	HeaderView = Backbone.View.extend({
		// 要素
		el: $('#cl_header'),

		events: {
			'click #cl_menu'					: '_onClickClMenu',
			'click .logout.cl_analyze_logout'	: '_onClickLogout',
			'click .logout.cl_analyze_chgpswd'	: '_onClickChgpswd',
			'click #demo_introjs'				: '_onClickGuide'
		},

		tmpl: _.template(''
			+ '<div id="header">'
			+ '	<p class="back" id="cl_menu"></p>'
			+ '	<h1>分析</h1>'
			+ '	<div class="rightBox">'
			+ '		<span class="logo"></span>'
			+ '<% if(supportGuide){ %>'
			+ '		<a id="demo_introjs"><span class="guide">操作ガイド</span></a>'
			+ '<% } %>'
			+ '		<span class="logout cl_analyze_logout"><a>ログアウト</a></span>'
			+ '		<span class="logout cl_analyze_chgpswd" style="display: none;"><a>パスワード変更</a></span>'
			+ '		<span class="user" id="ca_userInfo"><%- user_code %>:<%- user_name %></span>'
			+ '		<span class="date" id="ca_opeDate"><%- opeDateLabel %></span>'
			+ '	</div>'
			+ '</div>'
		),

		initialize: function(opt){
			this.options = _.defaults(opt || {}, {
				supportGuide: false,
				user_code: clcom.userInfo.user_code,
				user_name: clcom.userInfo.user_name,
				opeDateLabel: function(iymd){
					var n_year = Math.floor(iymd/10000);
					var n_month = Math.floor((iymd%10000)/100);
					var n_day = Math.floor(iymd%100);
					var wdayIdx = new Date(n_year, n_month-1, n_day).getDay();
					var wday = '日月火水木金土'.charAt(wdayIdx);
					return clutil.fmt('{0}/{1}/{2}（{3}）'
							, n_year
							, ('0' + n_month).slice(-2)
							, ('0' + n_day).slice(-2)
							, wday);
				}(clcom.getOpeDate())
			});
		},

		// 戻るボタンクリックアクション
		_onClickClMenu: function(e){
			// メニュー画面へ -- MDポータル画面へ遷移
			clcom.gohome();
		},

		// ログアウトボタンクリックアクション
		_onClickLogout: function(e){
			e.stopImmediatePropagation();
			clcom.logout();
		},

		// パスワード変更ボタンクリックアクション
		_onClickChgpswd: function(e){
			console.log('HeaderView: _onClickChgpswd');
			e.stopImmediatePropagation();
			// XXX stub.
		},

		// ガイドボタンクリックアクション
		_onClickGuide: function(e){
			console.log('HeaderView: _onClickGuide');
			this.trigger('headerview:click:guide', e);
		},

		render: function(appCallback){
			this.$el.html(this.tmpl(this.options));

			// bodyを表示
			$('#ca_body').show();

			//ヘッダー位置
			mh = $('#mainColumn').height();
			wh = $('body').height();
			if(wh <= mh){
				ch = mh;
			}else{
				ch = wh - 50;
			}
			$('#container').css("height",ch+'px');
			$('#leftColumn').css("height",ch+'px');

			sl = $(window).scrollLeft();
			ww = $(window).width();
			rbw = $(".rightBox").width()*1.25;
			hw = $("#header h1").width();
			if(0 < $("#header p").size()){
				pw = $("#header p").width();
				h_rightbox = ww-rbw-hw-pw;
				$('#header p').css("margin-left",sl+'px');
			}else{
				h_rightbox = ww-rbw-hw;
				$('#header h1').css("padding-left",sl+'px');
			}

			$('.rightBox').css("margin-left",h_rightbox+'px');

			//conditionFooterがある場合適用
			if(0 < $(".conditionFooter").size()){
				ch_width();
			}

			// コールバック関数を呼ぶ
			if(_.isFunction(appCallback)){
				appCallback();
			}
		},

		setFunc: function(_this){
			// 権限データを取得
			var funcgrp = clcom.getFuncGrp();
			var agent = clcom.getAgent();
			$.each(clutil.funcgrpname, function() {
				// 権限に応じてタブを隠す
				if (!funcgrp[this.toString()]) {
					$(_this).find('li.' + this.toString()).remove();
				}
			});
			// iPad時は権限設定、データ登録は操作不可
			if (agent == clcom.onMobile) {
				$(_this).find('li.permission').remove();
				$(_this).find('li.upload').remove();
			}
			clutil.setFuncObj($('body'));
		}
	});

	// ------------------------------------------------------------------------
	// テスト用スタイルの設定
	TestStyleCtrl = {
		testHosts: [
			'172.23.35.30',		// AWS検証環境#1
			'mds.mdsd.e-aoki.com',	// AWS検証環境#1
			'172.23.35.28',		// AWS検証環境#2
			'172.23.35.29',		// AWS検証環境#3
			'172.23.35.12',		// AWS検証環境#4
			'172.30.214.97',	// 情シス環境#1
			'172.30.214.101',	// 情シス環境#2
			'127.0.0.1',		// 個人開発環境
			'10.1.9.61',		// aoki-md.suri.co.jp
			'10.1.3.171', 		// aokmd.suri.co.jp
			'10.1.3.175',		// aokmd01.suri.co.jp
			'10.1.3.176',		// aokmd98.suri.co.jp
			'10.1.3.177'		// aokmd99.suri.co.jp
		],
		isTestHost: function(hostname){
			return _.find(this.testHosts, function(hostname){ return hostname == location.hostname;});
		},
		doApply: function(){
			var testCSS = '<link media="screen" rel="stylesheet" type="text/css" href="/css/test.css">';
			$('head > link[rel="stylesheet"][href$="\/css\/style.css"]').after(testCSS);
		}
	};
	if(TestStyleCtrl.isTestHost(location.hostname)){
		TestStyleCtrl.doApply();
	}
	// ------------------------------------------------------------------------
});
