useSelectpicker2();
var View = Backbone.View.extend({
	el: 'body',

	events: {
		'change #a': function(){
			console.log('###### change a');
		},
		
		'click #save': function(){
			this.$('#jsonout').text(JSON.stringify(
				this.dataGrid.getData(), null, 4));
		},
		'click #valid': function(){
			var errors = this.dataGrid.validate();
			var isValid = this.dataGrid.isValid();
			if (!isValid){
				window.alert('NGです。\n\n' + JSON.stringify(errors, null, 4));
			}else{
				window.alert('OKです。\n\n');
			}
		},
		'click #addColumn': '_addColumn',

		focusout: function(e){
			// e.preventDefault();
		}
	},

	_addColumn: function(){
		this.dataGrid.grid.getEditorLock().cancelCurrentEdit();
		var col = _.uniqueId('col');
		this.addColumn({
			name: col,
			field:  col
		});
		var data = this.dataGrid.getData();
		var columns = this.getColumns();
		console.log('***', columns, data);
		this.dataGrid.setColumns(columns);
	},

	updateFilter: function(args){
		this.dataGrid.dataView.setBodyFilterArgs(args);
		this.dataGrid.dataView.setBodyFilter(this.gridFilter);
		this.dataGrid.grid.invalidate();
	},

	gridFilter: function(item, args){
		return !args.saleStart || item.saleStart >= args.saleStart;
	},
	
	initialize: function(){
		
		this.dataGrid = new ClGrid.ClAppGridView({
			el: '#ca_datagrid',
			// テーブル左上にエラー通知を配置する
			errorInside: true,
			delRowBtn: true,		// 行削除ボタンを使用するフラグ。
			footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ。
		});

		this.dataGrid.getMetadata = _.bind(function(rowIdx){
			//var data = this.dataGrid.dataView.getBodyItem(rowIdx);
			//console.log('(row, data)=', rowIdx, data);
			if (rowIdx % 2 === 0) {
				// メーカー品番列の行ごとのアライン指定
				return {
					cssClasses: 'odd-row',
					columns: {
						makerHinban: {
							cssClasses: 'txtalign-right'
						}
					}
				};
			}
		}, this);

		this.dataGrid.getHeadMetadata = function(rowIdx){
			if (rowIdx % 2 === 0) {
				// メーカー品番列の行ごとのアライン指定
				return {
					cssClasses: 'head-odd-row'
				};
			}
		};
		
		this.listenTo(this.dataGrid, {
			'footer:addNewRow': function(gridView){
				// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
				var newItem = {};
				gridView.addNewItem(newItem);
			},
			'cell:change': function(e){
				console.log('*** cell:change', e);

				if (!e.isBody) {
					if (e.cell === 0) {
						this.updateFilter({saleStart: e.item.saleStart});
					}
				}else{
					if (!e.item.allFlag2){
						this.dataGrid.clearCellMessage(
							e.item[this.dataGrid.idProperty], 'qty2');
					}
				}

				// セルチェンジでカラムを追加するには以下のコメントを外す
				/* this._addColumn(); */
				
				// invalidateしたときにフォーカスはずれる?
				// this.dataGrid.grid.invalidate();
			},
			'click:cell': function(a,b){
				console.log('click:cell', a,b);
			}
		});
		this.graph = new clutil.Relation.DependGraph()
			.add({
				id: 'makerHinban',
				depends: ['maker.id'],
				onDependChange: function(e){
					e.model.set('makerHinban', '');
				}
			})
			.add({
				id: 'itemName',
				depends: ['maker.id', 'makerHinban'],
				onDependChange: function(e){
					var maker_code = e.model.get('makerHinban'),
						maker_id = e.model.get('maker.id');
					
					var fail = function(makerHinbanError){
						e.model.set({
							itemID: 0,
							itemCode: '',
							itemName: '',

							sub1ID: 0,
							sub1Code: '',
							sub1Name: '',

							sub2ID: 0,
							sub2Code: '',
							sub2Name: '',

							// 商品の取得に失敗した場合は呼び出し元でエ
							// ラー文字列を設定する。(★)
							makerHinbanError: makerHinbanError
						});
					};

					if (maker_code && maker_id){
						var done = e.async();

						clutil.clmakeritemcode2item({
							maker_code: maker_code,
							itgrp_id: 116,
							maker_id: maker_id
						})
							.done(function(data){
								if (data.head.status){
									// 何かエラーが発生した(1)(★)
									fail(clmsg[data.head.message]);
									return;
								}

								var rec  = data.rec;
								e.model.set({
									itemID: rec.itemID,
									itemCode: rec.itemCode,
									itemName: rec.itemName,

									sub1ID: rec.sub1ID,
									sub1Code: rec.sub1Code,
									sub1Name: rec.sub1Name,

									sub2ID: rec.sub2ID,
									sub2Code: rec.sub2Code,
									sub2Name: rec.sub2Name,

									// 商品が取得できたのでエラーをクリアする(★)
									makerHinbanError: null
								});
							})
							.fail(function(){
								// 何かエラーが発生した(2)(★)
								fail('失敗');
							})
							.always(done);
					}else{
						// 依存パラメータが未設定のとき
						// エラーではないのでエラー文字列は渡さない(★)
						fail();
					}
				}
			})
			.add({
				id: 'color.id',
				depends: ['itemID'],
				onDependChange: function(e){
					e.model.set({
						'color.id': 0,
						'color.name': '',
						'color.code': ''
					});
				}
			})
			.add({
				id: 'size.id',
				depends: ['itemID', 'color.id'],
				onDependChange: function(e){
					e.model.set({
						'size.id': 0,
						'size.code': '',
						'size.name': ''
					});
				}
			});
	},

	columns2: [],

	addColumn: function(col){
		this.columns2.push(col);
	},

	getColumns: function(){
		var columns = [
			{
				name: '',
				field: 'saleStart',
				id: 'saleStart',
				cellType: {
					type: 'date'
				},
				headCellType: function(args) {
					if (args.row === 1) {
						return {
							type: 'date',
							placeholder: '販売開始日で絞り込み'
						};
					}
				}
			},
			{
				name: 'メーカー',
				field: 'maker',
				width: 180,
				cellType: {
					type: 'clajaxac',
					placeholder: 'メーカー',
					editorOptions: {
						funcName: 'vendorcode',
						dependAttrs: function(){
							return {
								vendor_typeid: 1
							};
						},
					},
					validator: 'required'
				}
			},
			{
				name: 'メーカー品番',
				id: 'makerHinban',
				field: 'makerHinban',
				width: 120,
				cellType: {
					type: 'text',
					validator: ['required', 'alnum', 'len:0,10', function(){
						// 商品が取得できなかったときに行データに
						// makerHinbanErrorを設定している(graphのid=makerHinban)(★)
						return this.item.makerHinbanError;
					}],
					limit: 'alnum len:10',
					isEditable: function(item){
						return !!(item && item.maker && item.maker.id);
					},
					placeholder: 'メーカー品番'
				}
			},
			{
				name: '店舗タイプ',
				id: 'storeType',
				field: 'storeType',
				cellType: {
					type: 'cltypeselector',
					validator: ['required'],
					editorOptions: function(data){
						var options = {
							kind: amcm_type.AMCM_TYPE_STORE,
							filter: function(item, i){
								if (data.allFlag1) {
									return true;
								} else {
									return i % 2 === 0;
								}
							},
							emptyLabel: '空',
							reverse: true
						};
						if (!data.allFlag2) {
							options.ids = [1,2,3];
						}
						return options;
					}
				}
			},
			{
				name: '番号',
				field: 'num',
				cellType: {
					type: 'asyncselector',
					validator: ['required'],
					formatter: function(v){
						return v && v.label;
					},
					editorOptions: {
						items: function(){
							return _.chain(10).range().map(function(i){
								return {id: (i+1), label: '0' + (i+1)};
							}).value();
						}
					}
				}
			},			
			{
				name: '非同期番号',
				field: 'asyncnum',
				cellType: {
					type: 'asyncselector',
					validator: ['required'],
					formatter: function(v){
						return v && v.label;
					},
					editorOptions: {
						items: function(){
							var d = $.Deferred();
							setTimeout(function(){
								d.resolve(_.chain(10).range().map(function(i){
									return {id: (i+1), label: '0' + (i+1)};
								}).value());
							}, 200);
							return d.promise();
						}
					}
				}
			},
			{
				name: '商品名',
				field: 'itemName'
			},
			{
				name: 'サブ1',
				field: 'sub1Name'
			},
			{
				name: 'サブ2',
				field: 'sub2Name'
			},
			{
				name: 'カラー',
				field: 'color',
				cellType: {
					type: 'clajaxselector',
					validator: 'required',
					formatter: function(value, options){
						if (!value || !value.id) {
							return '全て';
						} else {
							return ClGrid.Formatters.codename(value, options);
						}
					},
					editorOptions: function(item){
						return {
							funcName: 'color',
							dependAttrs: {
								itemID: item.itemID
							},
							emptyLabel: '全て'
						};
					},
					isEditable: function(item){
						return Boolean(item.itemID);
					}
				}
			},
			{
				name: 'サイズ',
				field: 'size',
				cellType: {
					type: 'asynccodenameselector',
					validator: 'required',
					editorOptions: function(item){
						var deferred = $.Deferred();
						clutil.clcolor2size(item.itemID, item.color.id)
							.done(function(data){
								var items = _.map(data && data.list, function(item){
									return {
										id: item.sizeID,
										code: item.sizeCode,
										name: item.sizeName,
										data: item
									};
								});
								deferred.resolve(items);
							});
						return {
							items: deferred.promise()
						};
					},
					isEditable: function(item){
						return Boolean(item.itemID && item.color && item.color.id);
					}
				}
			},
			{
				name: 'すべて',
				field: 'allFlag1',
				cellType: {
					type: 'checkbox'
				}
			},
			{
				name: '入力1',
				id: 'qty1',
				field: 'qty1',
				cssClass: 'txtalign-right',		// 右寄せ,
				cellType: {
					type: 'text',
					// editorOptions: {
					// 	addClass: 'txtar'
					// },
					validator: 'required numeric min:100 max:300',
					limit: 'int2',
					formatFilter: 'comma'
				}
			},
			{
				name: 'すべて',
				field: 'allFlag2',
				cellType: {
					type: 'checkbox',
					isEditable: function(item){
						return Boolean(item.allFlag1);
					}
				}
			},
			{
				name: '入力2',
				field: 'qty2',
				id: 'qty2',
				cellType: {
					type: 'text',
					validator: ' required numeric',
					limit: 'int2',
					formatFilter: 'comma',
					isEditable: function(item){
						return Boolean(item.allFlag2);
					}
				}
			},
			{
				name: 'コメント',
				field: 'comment',
				width: 480,
				cellType: {
					type: 'text'
				}
			}
		];

		return _.union(columns, clutil.dclone(this.columns2));
	},

	getData: function(){
		return _.chain(30).range().map(function(i){
			return {
				"seq" : 0,
				maker: {
					id: 379,
					code: '0710',
					name: "山本洋品雑貨（株）"
				},
				"makerHinban" : "12S00099",
				"itemID" : 25639,
				"itemName" : "１２ＳＳＣ／Ｓ黒ビジカジベルト",
				"sub2ID" : 86,
				"sub1Code" : "1102",
				"sub1Name" : "ＣＹベルト",
				"sub2ID" : 95,
				"sub2Code" : "1109",
				"sub2Name" : "その他",
				color: {
					id: 0,
					code: '',
					name: ''
				},
				size: {
					id: 0,
					code: '',
					name: ''
				},
				allFlag1: 1,
				qty1: 0,
				allFlag2: 1,
				qty2: 0,
				saleStart: clutil.addDate(20140701, i)
			};
		}).value();
	},

	renderGrid: function(data){
		this.dataGrid.render().setData({
			gridOptions: {
				autoHeight: false,
				frozenRow: 2,
				frozenColumn: 1
			},
			columns: this.getColumns(),
			data: data,
			rowDelToggle: true,
			graph: this.graph,
			colhdMetadatas: [
				{
					columns: {
						saleStart: {
							name: '販売開始日'
						},
						storeType: {
							colspan: '3',
							name: 'colspan=3'
						}
					}
				}
			]
		});
	}
}, {
	startApp: function (){
		var view = this.view = new View();
		var  data = view.getData();
		view.renderGrid(data);
	}
});

$(function(){
	clutil.enterFocusMode();
	clutil._XXXDBGGetIniPermChk = false;
	clutil.getIniJSON().done(_.bind(View.startApp, View));
});

// var focus = $.fn.focus;
// $.fn.focus = function(){
// 	var $el = $(this);
// 	console.trace('focus', $el.attr('class'));
// 	return focus.apply(this, arguments);
// };
