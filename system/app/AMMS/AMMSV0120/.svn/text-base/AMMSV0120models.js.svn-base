/* global MyApp: false */

(function(MyApp){
	// C = Backbone.Collection.extend({
	// 	model: Backbone.Model.extend({
	// 		generateId: function(attrs){
	// 			return attrs.aa;
	// 		},
	// 		parse: function(r){
	// 			return {
	// 				b: r.a
	// 			};
	// 		}
	// 	})
	// });
	// cc = new C([{aa: 1, a:1, c: 1}, {aa: 2, a:2, c: 2}, {aa: 3, c: 3}]);
	// console.log(JSON.stringify(cc, null ,2));
	// cc.set([{aa:2, a: 22}, {aa:3, a: 3}], {parse: true, merge: true, remove:false, add: true});
	// console.log(JSON.stringify(cc, null ,2));
	
	var PackModel = Backbone.Model.extend({
		defaults: {
			tagIssueFlag: 0,
			approveDate: clutil.addDate(clcom.getOpeDate(), 1)
		}
	});

	var ItemModel = Backbone.Model.extend({
		generateId: function(attrs){
			// IDの払いだし
			return MyApp.reqres.request("generateItemId", attrs);
		},

		defaults: function(){
			return {
				makerItemCode: '',
				quality: '',
				size: {id: 0},
				brand: {id: 0},
				style: {id: 0},
				design: {id: 0},
				material: {id: 0},
				import: {id: 0},
				color: {id: 0}
			};
		}
	});

	var ItemCollection = Backbone.Collection.extend({
		model: Backbone.Model.extend({
			idAttribute: 'makerItemCode',
			parse: function(resp){
				var attrs = _.pick(
					resp, 'makerItemCode', 'itemName', 'quality', 'price',
					'priceIntax', 'cost', 'costIntax', 'saleStartDate',
					'saleEndDate', 'dlvDate', 'finishDate', 'dlvTypeID');
				_.extend(attrs, {
					brandID: resp.brand.id,
					styleID: resp.style.id,
					designID: resp.design.id,
					materialID: resp.material.id,
					importID: resp.import.id
				});
				return attrs;
			}
		})
	});

	var ItemColorCollection = Backbone.Collection.extend({
		model: Backbone.Model.extend({
			parse: function(resp){
				return {
					id: resp.makerItemCode + ':' + resp.color.id,
					makerItemCode: resp.makerItemCode,
					colorID: resp.color.id,
					makerColor: resp.makerColor
				};
			}
		})		
	});

	var ItemColorSizeCollection = Backbone.Collection.extend({
		model: Backbone.Model.extend({
			parse: function(resp){
				return {
					id: resp.makerItemCode + ':' +
						resp.color.id + ':' + resp.size.id,
					colorID: resp.color.id,
					colorCode: resp.color.code,
					colorName: resp.color.name,
					sizeID: resp.size.id,
					sizeName: resp.size.name,
					sizeCode: resp.size.code,
					makerItemCode: resp.makerItemCode,
					orderQy: resp.orderQy
				};
			}
		})
	});
	
	var ItemRecords = Backbone.Collection.extend({
		model: ItemModel
	});

	var DistrModel = Backbone.Model.extend({
		generateId: function(attrs){
			// IDの払いだし
			return MyApp.reqres.request("generateDistrId", attrs);
		}
	});
	
	var DistrRecords = Backbone.Collection.extend({
		model: DistrModel
	});

	var CommentCollection = Backbone.Collection.extend({
		model: Backbone.Model.extend({
			idAttribute: 'dummy',
			defaults: {
				id: 0,
				commentSeq: 0,
				orderSeq: 0,
				comment: ''
			}
		})
	});
	
	var GetRspModel = Backbone.Model.extend({

		setReqHead: function(reqHead){
			this.reqHead = reqHead;
		},

		updateItemList: function(model){
			this.itemList = model.itemList;
			this.cItemList = model.cItemList;
			this.csItemList = model.csItemList;
			this.itemRecords = model.itemRecords;
		},

		mergeItemList: function(model){
			var map = {};
			_.each(this.itemList, function(item){
				map[item.id] = item;
			});
			_.each(model.itemList, function(item){
				_.extend(map[item.id], _.pick(
					item, 'dlvDate', 'finishDate', 'dlvTypeID'));
			});
			
			map = {};
			_.each(this.csItemList, function(item){
				map[item.id] = item;
			});
			_.each(model.csItemList, function(item){
				_.extend(map[item.id], _.pick(
					item, 'orderQy'));
			});

			var newItemRecords = model.itemRecords.invoke(
				'pick', 'makerItemCode', 'color', 'size', 'finishDate',
				'dlvDate', 'dlvTypeID', 'orderQy');
			this.itemRecords.set(newItemRecords, {
				merge: true,
				remove: false,
				add: false
			});
		},
		
		updateDistrList: function(model){
			this.distrList = model.distrList;
			this.distrRecords = model.distrRecords;
		},
		
		parse: function(data){
			this.reqHead = {};
			this.status = new Backbone.Model(data.status);
			this.pack = new PackModel(data.pack);
			this.itemList = data.itemList;
			this.cItemList = data.cItemList;
			this.csItemList = data.csItemList;
			_.each(this.itemList, function(item){
				item.id = item.makerItemCode;
			});
			_.each(this.cItemList, function(item){
				item.id = item.makerItemCode + ':' + item.colorID;
			});
			_.each(this.csItemList, function(item){
				item.id = item.makerItemCode + ':' +
					item.colorID + ':' + item.sizeID;
			});
			
			this.distrList = data.distrList;
			this.distrRecords = new DistrRecords(data.distrList, {parse: true});
			this.storeList = data.storeList;
			this.commentCollection = new CommentCollection(data.commentList);
			this.itemRecords = new ItemRecords(
				_(this.csItemList).chain()
					.map(function(attr){
						// カラー商品レコード
						var cItem = _(this.cItemList).chain().where({
							makerItemCode: attr.makerItemCode,
							colorID: attr.colorID
						})
								.first()
								.value();
						// 商品レコード
						var item = _(this.itemList).chain()
								.where({
									makerItemCode: attr.makerItemCode
								})
								.first()
								.value();
						
						// 関係が壊れている
						if (!cItem || !item) return;
						
						var record = _.extend(
							_.omit(item, 'brandID', 'styleID', 'designID',
								   'materialID', 'importID'),
							{
								csitemID: attr.csitemID,
								
								brand: {
									id: item.brandID,
									code: item.brandCode,
									name: item.brandName
								},
								style: {
									id: item.styleID,
									code: item.styleCode,
									name: item.styleName
								},
								design: {
									id: item.designID,
									code: item.designCode,
									name: item.designName
								},
								material: {
									id: item.materialID,
									code: item.materialCode,
									name: item.materialName
								},
								import: {
									id: item.importID,
									code: item.importCode,
									name: item.importName
								},
								
								// カラー商品レコード
								makerColor: cItem.makerColor,
								
								// カラーサイズレコード
								color: {
									id: attr.colorID,
									code: attr.colorCode,
									name: attr.colorName
								},
								size: {
									id: attr.sizeID,
									code: attr.sizeCode,
									name: attr.sizeName
								},
								orderQy: attr.orderQy
							}
						);
						return record;
					}, this)
					.compact()
					.value());
			console.log('itemRecords', this.itemRecords);
		}
	});
	
	// var CsvRspModel = Backbone.Model.extend();
	
	// var Model = Backbone.Model.extend({
	// 	constructor: function(attrs, options){
	// 		options = _.extend({}, options, {parse: true});
	// 		Backbone.Model.prototype.constructor.call(this, attrs, options);
	// 	},

	// 	parse: function(data){
	// 		this.getRsp = new GetRspModel(data.AMMSV0120GetRsp, {parse: true});
	// 		this.csvRsp = new CsvRspModel(data.AMMSV0120CsvRsp, {parse: true});
	// 		return {};
	// 	}
	// });
	
	_.extend(MyApp, {
		GetRspModel: GetRspModel,
		ItemRecords: ItemRecords,

		ItemCollection: ItemCollection,
		ItemColorCollection: ItemColorCollection,
		ItemColorSizeCollection: ItemColorSizeCollection
	});
}(MyApp));
