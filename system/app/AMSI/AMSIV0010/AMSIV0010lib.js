(function(exports, store){
	Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate){
		return _.template(rawTemplate, null, {variable: 'it'});
	};

	var MyApp = new Marionette.Application();
	MyApp.templateHelpers = function(){
		return {
			model: this.model,
			collection: this.collection
		};
	};

	var isEllipsisActive = function(el) {
     return (el.offsetWidth < el.scrollWidth);
	};

	////////////////////////////////////////////////////////////////
	// カラーサイズ選択
	MyApp.ColorSizeEditView = Marionette.ItemView.extend({
		template: '#ColorSizeEditView',

		ui: {
			color: '.colorSelect',
			size: '.sizeSelect'
		},

		initialize: function(){
			this.tagNo = this.model.get('tagCode');
		},

		onShow: function(){
			this.relation = clutil.FieldRelation.create(this.cid, {
				clcolorselector: {
					el: this.ui.color,
					initValue: this.model.get('colorID')
				},

				clsizeselector: {
					el: this.ui.size,
					initValue: this.model.get('sizeID')
				}
			}, {
				dataSource: {
					itemID: this.model.get('mtItemID'),
					ymd: clcom.getOpeDate()
				}
			});
		},

		onBeforeClose: function(){
			this.relation.remove();
		}
	});

	////////////////////////////////////////////////////////////////
	// Models
	var OrgStockModel = Backbone.Model.extend({
		initialize: function(){
			this.storeList = new Backbone.Collection(this.get('storeList'));
			this.unset('storeList');
		}
	});

	var ResultItemModel = Backbone.Model.extend({
		defaults: {
			tagCode: '',
			itemName: '',
			colorName: '',
			size: ''
		},

		initialize: function(){
			this.sizeList = new Backbone.Collection(this.get('sizeList'));
			this.areaList = new OrgStockModel(this.get('areaList'));
			this.prefList = new OrgStockModel(this.get('prefList'));
			this.zoneList = new OrgStockModel(this.get('zoneList'));
			this.otherList = new OrgStockModel( this.get('otherList'));
			this.unset('sizeList');
			this.unset('areaList');
			this.unset('prefList');
			this.unset('zoneList');
			this.unset('otherList');
		}
	});

	var ResultItemCollection = Backbone.Collection.extend({
		model: ResultItemModel
	});

	// 候補リスト
	var SelectListModel = Backbone.Model.extend({
		initialize: function(){
			this.detailList = new Backbone.Collection(this.get('detailList'));
			this.unset('detailList');
		}
	});

	// 候補リスト(コレクション)
	var SelectListCollection = Backbone.Collection.extend({
		model: SelectListModel
	});

	// 検索結果
	var ResultModel = Backbone.Model.extend({
		initialize: function(){
			this.itemList = new ResultItemCollection(this.get('itemList'));
			this.helpList = new Backbone.Collection(this.get('helpList'));
			this.selectList = new SelectListCollection(this.get('selectList'));
			this.storeItemStockList = new Backbone.Collection(this.get('storeItemStockList'));

			this.unset('itemList');
			this.unset('helpList');
			this.unset('selectList');
			this.unset('storeItemStockList');
		},

		serializeData: function(){
			return {model: this.model, collection: this.collection};
		}
	});

	////////////////////////////////////////////////////////////////
	// Views

	// 店商品在庫数リスト
	/**
	 * @class OrgItemStockView
	 * @constructor
	 * @param options
	 * @param {ResultModel} options.model
	 */
	var OrgItemStockView = Marionette.ItemView.extend({
		template: '#OrgItemStockView',

		templateHelpers: MyApp.templateHelpers
	});

	// 各在庫リスト
	var StockTableView = Marionette.ItemView.extend({
		template: '#StockTableView',
		tagName: 'ul',
		className: "stockCount",
		ui: {
			title: '.title'
		},
		events: {
			"click li[id]": function(e){
				// 2016/4/1 iPadの際は遷移しない
				// 2016/11/25 iPod touchも同様
				if(clcom.is_iPad() || clcom.is_iPhone()){
					return;
				}
				var attrs,
					cid = $(e.currentTarget).closest('li').attr('id'),
					item = this.model.storeList.get(cid);
				if (item){
					MyApp.trigger('store:click', item);
					attrs = item.toJSON();
					clcom.pushPage({
						url: '../../AMMS/AMMSV0500/AMMSV0500.html',
						args: {
							opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
							srchDate: clcom.getOpeDate(),
							chkData: [{
								storeID: attrs.storeID
							}]
						},
						newWindow: true
					});
				}
			}
		}
	});

	// 自エリア
	/**
	 * @class AreaListView
	 * @constructor
	 * @param options
	 * @param {OrgStockModel} options.model
	 */
	var AreaListView = StockTableView.extend({
		templateHelpers: function(){
			return {
				title: '自ゾーン',
				model: this.model
			};
		}
	});
	// 自ゾーン
	/**
	 * @class ZoneListView
	 * @constructor
	 * @param options
	 * @param {OrgStockModel} options.model
	 */
	var ZoneListView = StockTableView.extend({
		templateHelpers: function(){
			return {
				title: '自地区',
				model: this.model
			};
		}
	});
	// 県内
	/**
	 * @class PrefListView
	 * @constructor
	 * @param options
	 * @param {OrgStockModel} options.model
	 */
	var PrefListView = StockTableView.extend({
		className: 'stockCount others dispn',
		templateHelpers: function(){
			return {
				title: this.model.get('orgName'),
				model: this.model,
				showOrgCodeName: false
			};
		}
	});
	// その他
	/**
	 * @class SizeView
	 * @constructor
	 * @param options
	 * @param {OrgStockModel} options.model
	 */
	var OtherListView = StockTableView.extend({
		className: 'stockCount others dispn',
		templateHelpers: function(){
			return {
				title: 'その他',
				model: this.model,
				showOrgCodeName: false
			};
		}
	});

	// 展開サイズ別レコード
	/**
	 * @class SizeView
	 * @constructor
	 * @param options
	 * @param {ResultItemModel} options.model
	 */
	var SizeView = Marionette.ItemView.extend({
		template: '#SizeView',

		ui: {
			// サイズ
			size: ".itemSize",
			// 自店在庫数
			stockQy: '.itemStockQy',
			// 全店在庫数
			allStockQy: '.itemAllStockQy',
			// 倉庫在庫数
			scStockQy: '.itemScStockQy',
			// テーブル
			sizeTable: '.sizeTable'
		},

		events: {
			"click @ui.sizeTable thead th[id]": function(e){
				var cid = $(e.currentTarget).closest('th').attr('id'),
					item = this.model.sizeList.get(cid);
					// index;
				if (item){
					MyApp.trigger('size:click', {
						itemID: item.get('colorSizeItemID')
					});
				}
			}
		},

		templateHelpers: function(){
			var target = this.model.sizeList.findWhere({
				size: this.model.get('size')
			});
			var index = this.model.sizeList.indexOf(target);
			this.model.sizeList.each(function(size, i){
				var className = 'middle';
				if (index >= 0) {
					if (i < index - 1){
						className = "leftend";
					}else if (i > index + 1){
						className = 'rightend';
					}
				}
				size.set('className', className);
			});

			return {
				model: this.model
			};
		}
	});

	var ItemView = Marionette.ItemView.extend({
		template: '#ItemView',

		events: {
			// セットアップ
			'click #ca_link_setup'	: function(e){
				e.stopPropagation();
				e.preventDefault();

				if (!this.model.get('setupFlag')){
					alert('XXXX セットアップはありません');
					return;
				}
				MyApp.trigger('showSelectList', {
					srchFlag: 1,
					item: this.model
				});
			},

			// 集約品番
			'click #ca_link_itemNum'	: function(e){
				e.stopPropagation();
				e.preventDefault();

				if (!this.model.get('packItemFlag')){
					alert('XXXX 集約品番はありません');
					return;
				}
				MyApp.trigger('showSelectList', {
					srchFlag: 2,
					item: this.model
				});
			},

			// 関連商品
			'click #ca_link_related'	: function(e){
				e.stopPropagation();
				e.preventDefault();

				if (!this.model.get('relItemFlag')){
					alert('XXXX 関連商品はありません');
					return;
				}
				MyApp.trigger('showSelectList', {
					srchFlag: 3,
					item: this.model
				});
			},

			// 入荷予定明細
			'click #ca_link_meisai': function(e){
				e.stopPropagation();
				e.preventDefault();
				// 入荷予定照会画面を別タブで開きます。
				MyApp.trigger('show:AMPAV0030', this.model);
			},

			// 商品管理履歴照会
			'click #ca_link_rireki': function(e){
				e.stopPropagation();
				e.preventDefault();

				// 商品管理履歴照会画面を別タブで開きます。
				MyApp.trigger('show:AMPAV0040', this.model);
			},

			// 商品マスタ画面(参照用)に遷移
			'click .gotoAMMSV0100': function(e){
				e.stopPropagation();
				e.preventDefault();
				var getRsp = MyApp.model.savedReq.AMSIV0010GetReq ||
						MyApp.model.savedReq.AMSIV0020GetReq ||
						MyApp.model.savedReq.AMSIV0030GetReq ||
						MyApp.model.savedReq.AMSIV0040GetReq;

				clcom.pushPage({
					url: '../../AMMS/AMMSV0140/AMMSV0140.html',
					args: {
						srchDate: clcom.getOpeDate(),
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
						chkData: [{
							id: this.model.get('mtItemID'),
							orgID: getRsp.srchOrgID
						}],
						savedCond: {
						},
						savedReq: {
						}
					},
					newWindow: true
				});
				// MyApp.trigger('show:AMMSV0100', this.model);
			}
		},

		templateHelpers: function(){
			return {
				model: this.model,
				gettypename: clutil.gettypename,
				amcm_type: amcm_type,
				clutil: clutil,
				mask: $.inputlimiter.mask
			};
		},

		onShow: function(){
			this.$el.tooltip({
				animation: false,
				selector: '.txt-ellipsis',
				title: function(){
					var $el = $(this);
					if(isEllipsisActive(this)){
						$el.css('cursor', 'pointer');
						return $el.text();
					}else{
						$el.css('cursor', 'auto');
					}
				},
				container: 'body'
			});

			if (clcom.is_iPad() || clcom.is_iPhone()) {
				this.iPad_view();
			}
		},

		// 2016/4/1 iPad用対応
		iPad_view:function(){
			$(".ca_iPad_dispn").addClass("dispn");
			$(".gotoAMMSV0100").removeClass("gotoAMMSV0100");
		},
	});

	/**
	 * @class ResultItemView
	 * @constructor
	 * @param options
	 * @param {ResultItemModel} options.model
	 */
	// 商品情報
	var ResultItemView = Marionette.Layout.extend({
		template: '#ResultItemView',

		events: {
			// 全て表示(在庫)
			'click .showmore': function (e) {
				e.stopPropagation();
				e.preventDefault();

				this.$('.stockCount.others').fadeToggle();
				var str = this.$('.showmore').html();
				if(str == "自ゾーン・自地区のみ表示") {
					this.$('.showmore').html("すべて表示");
				}else {
					this.$('.showmore').html("自ゾーン・自地区のみ表示");
				}
			}
		},

		regions: {
			itemView: '.itemView',
			sizeList: '.sizeList',
			areaList: '.areaList',
			zoneList: '.zoneList',
			prefList: '.prefList',
			otherList: '.otherList'
		},

		templateHelpers: MyApp.templateHelpers,

		onShow: function(){
			this.itemView.show(new ItemView({
				model: this.model
			}));
			this.sizeList.show(new SizeView({
				model: this.model
			}));
			this.areaList.show(new AreaListView({
				model: this.model.areaList
			}));
			this.zoneList.show(new ZoneListView({
				model: this.model.zoneList
			}));
			this.prefList.show(new PrefListView({
				model: this.model.prefList
			}));
			this.otherList.show(new OtherListView({
				model: this.model.otherList
			}));
			// 自エリア自ゾーンに在庫がゼロの場合、県内と他県を最初から開い
			// た状態で表示します。
			if (!this.model.areaList.storeList.length &&
				!this.model.zoneList.storeList.length){
				this.$('.showmore').hide();
				this.$('.stockCount.others').show();
			}
		}
	});

	/**
	 * @class ResultItemCollectionView
	 * @constructor
	 * @param options
	 * @param options.model {ResultItemCollection}
	 */
	// 商品情報リスト
	var ResultItemCollectionView = Marionette.CollectionView.extend({
		itemView: ResultItemView,

		templateHelpers: MyApp.templateHelpers
	});

	// 検索結果ビュー
	/**
	 * @class ResultLayout
	 * @extend Marionette.Layout
	 * @constructor
	 * @param {object} options
	 * @param {ResultModel} options.model 検索結果モデル
	 */
	var ResultLayout = Marionette.Layout.extend({
		template: '#ResultLayout',

		regions: {
			orgItemStockView: '#orgItemStockView',
			resultItemCollectionView: '#resultItemCollectionView'
		},

		onShow: function(){
			if(MyApp.srchFuncType === 2){
				// 店商品在庫数リスト
				this.orgItemStockView.show(new OrgItemStockView({
					model: this.model
				}));
			}else{
				this.$('.tagCodeList').hide();
			}
			// 商品情報リスト
			this.resultItemCollectionView.show(new ResultItemCollectionView({
				collection: this.model.itemList
			}));
		},

		templateHelpers: MyApp.templateHelpers
	});

	/**
	 * @class ResultItemCollectionView
	 * @constructor
	 * @param options
	 * @param options.model {SelectListModel}
	 */
	// 候補リストアイテム
	var SelectListItem = Marionette.ItemView.extend({
		events: {
			// 候補リストの行がクリックされた
			"click tbody>tr.contextmenu[id]": function(e){
				e.preventDefault();
				e.stopPropagation();
				var id = $(e.target).closest('tr').attr('id');
				var item = this.model.detailList.get(id);
				if (item){
					MyApp.trigger("selectList:click", {
						item: item
					});
				}
			}
		},

		template: '#SelectListItem',

		templateHelpers: function(){
			return {
				collection: this.model.detailList,
				srchFlag: this.options.srchFlag
			};
		}
	});

	/**
	 * @class SelectListView
	 * @constructor
	 * @param options
	 * @param options.collection {SelectListCollection}
	 */
	// 候補リストダイアログ
	var SelectListView = Marionette.CollectionView.extend({
		itemView: SelectListItem,

		attributes: {
			style: '/*max-height: 500px; */overflow-y: auto;'
		},

		itemViewOptions: function(){
			return {
				srchFlag: this.options.srchFlag
			};
		}
	});

	/**
	 * @class HelpListView
	 * @constructor
	 * @param options
	 * @param options.collection {ResultModel}
	 */
	// 詳細条件補助リスト
	var HelpListView = Marionette.ItemView.extend({
		template: '#HelpListView',

		events: {
			"click tbody > tr": function(e){
				var cid = $(e.currentTarget).closest('tr').attr('id');
				var item = this.model.helpList.get(cid);
				if (item){
					MyApp.trigger("helpList:row:click", {
						item: item
					});
				}
			}
		},

		templateHelpers: function(){
			return {model: this.model};
		}
	});

	var TagHistory = {
		storageKey: 'AMSIV0010.tagHist',

		refresh: function(){
			var ymd = clutil.addDate(clcom.getOpeDate(), -1);
			var storage = store.get(this.storageKey) || [];
			store.set(this.storageKey, _.filter(storage, function(data){
				return data.ymd > ymd;
			}));
		},

		start: function(){
			this.refresh();

			var ymd = clutil.addDate(clcom.getOpeDate(), -1),
				storage = store.get(this.storageKey) || [],
				userData = _.where(storage, {user_id: clcom.userInfo.user_id})[0],
				tagHist = userData && userData.tagHist;

			this.tagHist = _(tagHist).chain()
				.filter(function(tag){
					return (tag.ymd > ymd &&
							tag.tagCode != null&&
							tag.itemName != null &&
							tag.size != null &&
							tag.colorName != null);
				})
				.sortBy(function(tag){
					return tag.label;
				})
				.uniq(true, function(tag){
					return tag.label;
				})
				.value();
			return this;
		},

		/**
		 * @param item
		 * @param item.tagCode
		 * @param item.itemID
		 * @param item.itemName
		 * @param item.colorID
		 * @param item.colorName
		 * @param item.size
		 */
		add: function(item){
			if (!item.tagCode || !item.itemID || !item.colorID || !item.size){
				console.warn('TagHistory#add Illegal arguments', item);
				return;
			}

			console.log('TagHistory#add', item);

			var cond = _.pick(item, 'tagCode', 'itemID', 'colorID', 'size'),
				found = _.where(this.tagHist, cond);
			if (_.isEmpty(found)){
				var date = new Date();
				var data = _.extend({
					ts: +date,
					ymd: clcom.getOpeDate(),
					label: (item.tagCode + " " +
							item.itemName + " " +
							item.colorName + "/" +
							item.size)
				}, item);
				this.tagHist.push(data);
			}else{
				var ts = new Date().getTime();
				_.each(found, function(item){
					item.ts = ts;
					item.ymd = clcom.getOpeDate();
				});
			}
		},

		getTags: function(){
			return this.tagHist.sort(function(a, b){
				return a.ts < b.ts;
			});
		},

		save: function(){
			var storage = store.get(this.storageKey) || [],
				userData = _.where(storage, {user_id: clcom.userInfo.user_id})[0];
			if (!userData){
				userData = {user_id: clcom.userInfo.user_id};
				storage.push(userData);
			}
			userData.ymd = new Date().getTime();
			userData.tagHist = this.tagHist;

			store.set(this.storageKey, storage);
		}
	};

	MyApp.addInitializer(function(){
		MyApp.tagHistory = TagHistory.start();
		// 組織体系
		MyApp.ORG_FUNC_ID = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
		// 組織階層を取得
		MyApp.ORG_LEVEL_ID = Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'));
		// 事業ユニットID
		MyApp.UNIT_ID = clcom.userInfo.unit_id;
		if (clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE ||
			clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
			MyApp.isStoreUser = true;
		}
	});

	var TagCode = Backbone.View.extend({
		initialize: function(options){
			var view = this;
			if (options){
				this.tagNo = options.tagNo;
			}
			this.$el
				.autocomplete({
					getLabel: function(item){
						return item != null ? item.value : '';
					},

					source: function(request, response){
						var term = request.term;
						var list = _.chain(MyApp.tagHistory.getTags())
								.filter(function(tag){
									return (tag.tagCode.indexOf(term) === 0 ||
											tag.itemName.indexOf(term) === 0 ||
											tag.size.indexOf(term) === 0 ||
											tag.colorName.indexOf(term) === 0);
								})
								.map(function(tag, i){
									return {
										id: (i+1),
										tagCode: tag.tagCode,
										label: (tag.tagCode + " " +
												tag.itemName + " (" +
												tag.colorName + "/" +
												tag.size + ")"),
										value: tag.tagCode
									};
								})
								.value();
						response(list);
					},
					clchange: function(e, ui){
						// // jshint unused: false
						// var val = ui && ui.item && ui.item.label;
						// if (!val){
						// 	val = view.$el.val();
						// 	if (val && val.length >= 13){
						// 		MyApp.tagHistory.add(val);
						// 	}
						// }
						view.trigger('change', ui && ui.item);
						var item = ui && ui.item;
						_.defer(function(){
							var tagCode = view.$el.val();
							console.log('tagCode:change', item, tagCode);
							MyApp.trigger('tagCode:change',
										  item, view.tagNo, tagCode);
						});
						clutil.mediator.trigger('validation:require', view.$el);
					}
				})
				// .addClass('cl_valid_auto_off')
				.addClass('cl_no_autocomplete_check');
		}
	});

	MyApp.on('AMSIV0010:addTag', function(model){
		if(model.itemList){
			model.itemList.each(function(item){
				TagHistory.add(
					item.pick('tagCode', 'itemID', 'itemName', 'colorID',
							  'colorName', 'size'));
			});
		}else{
			TagHistory.add(
				model.pick('tagCode', 'itemID', 'itemName', 'colorID',
						   'colorName', 'size'));
		}
		TagHistory.save();
	}).on('resetFocus', function(view){
		clutil.focus(null, 0, {view: view || $('#ca_srchArea')});
	});

	MyApp.showDialog = function(view) {
		view.render();
		clutil.ConfirmDialog(view.el, function(){
			view.remove();
		});
		var $modalBody = view.$el.closest('.modalBody');
		$modalBody.find('>.msg').removeClass('msg').removeClass('txtPrimary');
		var btnBox = $modalBody.find('.btnBox');
		var height = view.$el.height() + btnBox.outerHeight();
		var maxHeight = $(window).height() - btnBox.outerHeight() - 80;
		height = Math.min(maxHeight, height);
		view.$el.css('max-height', height);

		var bodyHeight = _.reduce($modalBody.find('>*'), function(h, e){
			return $(e).outerHeight() + h;
		}, 0);
		$modalBody.css('margin-top', -bodyHeight / 2);
		$modalBody.height(bodyHeight);
		$('.cl_dialog .cl_cancel').remove();
		$('.cl_dialog .cl_ok').text('閉じる');
	};

	_.extend(MyApp, {
		SelectListView: SelectListView,
		ResultModel: ResultModel,
		ResultLayout: ResultLayout,
		HelpListView: HelpListView,
		ItemView: ItemView,
		_TagHistory: TagHistory,
		TagCode: TagCode
	});

	exports.MyApp = MyApp;
}(window, window.store));

$(function(){
	var tdRovercells = 'table.hilightRow td',
		tdOvercells = "table.hilight td",
		hoverClass = "hover",
		current_c, current_r;

	$(document)
		.on('mouseenter', tdOvercells, function(){
			var $this = $(this);
			(current_r = $this.parent().children("table td")).addClass(hoverClass);
			(current_c = $this.closest('table').find('td').filter(":nth-child("+ (current_r.index($this)+1) +")")).addClass(hoverClass);
		})
		.on('mouseleave', tdOvercells, function(){
			if (current_r) current_r.removeClass(hoverClass);
			if (current_c) current_c.removeClass(hoverClass);
		})
		.on('mouseenter', tdRovercells, function(){
			var $this = $(this);
			(current_r = $this.parent().children("table td")).addClass(hoverClass);
		})
		.on('mouseleave', tdRovercells, function(){
			if (current_r) current_r.removeClass(hoverClass);
		});
});

$(function(){
	var prevOuterWidth, prevInnerWidth;

	setInterval(function(){
		var $outer = $('.sizeTableOuter');
		var $inner = $outer.find('>.table_inner');
		if ($outer.length) {
			var outerWidth = $outer.width();
			var innerWidth = $inner.width();
			if (outerWidth !== prevOuterWidth ||
				outerWidth - 60 !== innerWidth) {
				$inner.width(outerWidth - 60);
				prevOuterWidth = outerWidth;
			}
		}
	}, 200);
});
