$.inputlimiter.noTrim = true;
useSelectpicker2();

(function(){
	var sum = function(arr){
		return _.reduce(arr, function(total, n){
			return total + (Number(n) || 0);
		}, 0);
	};

	var Behaviors = {};

	Marionette.Behaviors.behaviorsLookup = function(){
		return Behaviors;
	};

	_.extend(Behaviors, MyApp._Behaviors);

	Behaviors.Uptake = Behaviors.Uptake.extend({
		buildCSVInputReqFunction: function(){
			var getReq = _.clone(MyApp.srchData.AMMPV0020GetReq);

			getReq.csvType = this.options.csvType;

			return {
				resId: 'AMMPV0020',

				data: {
					AMMPV0020GetReq: getReq
				}
			};
		}
	});

	MyApp.download = function(options){
		var getReq = _.extend(MyApp.srchData.AMMPV0020GetReq);

		getReq.planType = options.planType;
		getReq.csvType = options.csvType;
		getReq.version = options.version();

		clutil.postDLJSON({
			resId: 'AMMPV0020',
			data: {
				AMMPV0020GetReq: getReq
			}
		}).fail(function(data){
			MyApp.trigger('dlFail', data);
		});
	};


	// シーズン別・商品属性別計画を登録・参照する
	var ParamView = Marionette.ItemView.extend({
		template: '#DlUpView1',

		serializeData: function(){
			var getRsp = MyApp.data.AMMPV0020GetRsp;

			return {
				planAuto: MyApp.getLastVersionRec(
					getRsp.attrAutoVersionRec) || {},
				planInput: MyApp.getLastVersionRec(
					getRsp.attrInputVersionRec) || {}
			};
		},

		getVersionRecs: function(plan){
			var getRsp = MyApp.data.AMMPV0020GetRsp;
			if (plan === 'auto') {
				return getRsp.attrAutoVersionRec;
			} else {
				return getRsp.attrInputVersionRec;
			}
		},

		behaviors: {
			DlBasicPlan: {
				csvType: AMMPV0020Req.AMMPV0020_CSV_ATTR,
				version: function(){
					return MyApp.getLastVersion(MyApp.data.AMMPV0020GetRsp.attrAutoVersionRec);
				}
			},
			DlNewPlan: {
				csvType: AMMPV0020Req.AMMPV0020_CSV_ATTR,
				version: function(){
					return MyApp.getLastVersion(MyApp.data.AMMPV0020GetRsp.attrInputVersionRec);
				}
			},
			Uptake: {
				csvType: AMMPV0020Req.AMMPV0020_CSV_ATTR
			}
		},

		events: {
			'click .ca_sample_download': function(){
				clutil.download('/public/sample/シーズン別商品属性別計画サンプル.xlsx');
			}
		},

		onUptakeDone: function(){
			$.when(Controller.research()).done(function(){
				clutil.MessageDialog2('取込が完了しました。');
			});
		}
	});

	// 商品属性別・サイズ別計画を登録・参照する
	var PlanView = Marionette.ItemView.extend({
		template: '#DlUpView1',

		serializeData: function(){
			var getRsp = MyApp.data.AMMPV0020GetRsp;

			return {
				planAuto: MyApp.getLastVersionRec(
					getRsp.sizeAutoVersionRec) || {},
				planInput: MyApp.getLastVersionRec(
					getRsp.sizeInputVersionRec) || {}
			};
		},

		getVersionRecs: function(plan){
			var getRsp = MyApp.data.AMMPV0020GetRsp;
			if (plan === 'auto') {
				return getRsp.sizeAutoVersionRec;
			} else {
				return getRsp.sizeInputVersionRec;
			}
		},

		behaviors: {
			DlBasicPlan: {
				csvType: AMMPV0020Req.AMMPV0020_CSV_SIZE,
				version: function(){
					return MyApp.getLastVersion(MyApp.data.AMMPV0020GetRsp.sizeAutoVersionRec);
				}
			},
			DlNewPlan: {
				csvType: AMMPV0020Req.AMMPV0020_CSV_SIZE,
				version: function(){
					return MyApp.getLastVersion(MyApp.data.AMMPV0020GetRsp.sizeInputVersionRec);
				}
			},
			Uptake: {
				csvType: AMMPV0020Req.AMMPV0020_CSV_SIZE
			}
		},

		events: {
			'click .ca_sample_download': function(){
				clutil.download('/public/sample/商品属性別サイズ別計画サンプル.xlsx');
			}
		},

		onUptakeDone: function(){
			$.when(Controller.research()).done(function(){
				clutil.MessageDialog2('取込が完了しました。');
			});
		}
	});

	// シーズン別・商品属性別計画のチェック
	var DiffView = Marionette.ItemView.extend({
		ui: {
			diffCheck: '.ca_diffCheck'
		},

		template: '#DiffView'
	});

	// シーズン別・商品属性別構成比を登録・参照する
	var AttrRecView = Marionette.ItemView.extend({
		template: '#AttrRecView',

		ui: {
			edit: '.ca_edit'
		},

		behaviors: {
			Update: {
				getData: function(){
					var getReq = _.clone(MyApp.srchData.AMMPV0020GetReq);
					var updReq = this.view.getUpdReq();
					getReq.csvType = AMMPV0020Req.AMMPV0020_PARAM_CSV_ATTR;
					return {
						resId: 'AMMPV0020',
						data: {
							reqHead: {
								opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
							},
							AMMPV0020GetReq: getReq,
							AMMPV0020UpdReq: updReq
						}
					};
				}
			},
			Grid: {
				gridOptions: function(columns){
					var frozenColumn = -1, i, l;
					if(columns){
						for(i=0,l=columns.length; i<l; i++){
							if(!columns[i].head) break;
						}
						frozenColumn = i-1;
					}
					return {
						autoHeight: false,
						frozenColumn: frozenColumn
					};
				},
				gridViewOptions: {
					autoToolTip: {
						title: function(el){
							var $el = $(el);
							if($el.hasClass('input') ||
							   $el.parent().hasClass('hdrow')){
								return false;
							}
							if(ClGrid.isEllipsisActive(el)){
								$el.addClass('hasEllipsis');
								return $el.text();
							}else{
								$el.removeClass('hasEllipsis');
							}
							return false;
						}
					}
				},
				frozenRow: 1
			},
			Uptake: {
				csvType: AMMPV0020Req.AMMPV0020_PARAM_CSV_ATTR
			},
			CheckModified: {
				name: 'AttrRecView',
				numberFields: [
					'compoRate', 'turnOver', 'avePrice', 'mrgnRate', 'aveCost'
				]
			}
		},

		gridEvents: {
			'cell:change': function(e){
				if (e.isBody){
					this.triggerMethod('require:modified:check');
				}
			}
		},

		myEvents: {
			'modified:change': function(isModified){
				clutil.inputReadonly(this.ui.edit, !isModified);
				MyApp.setModifiedMarkTab(
					Controller.getResultView().$('li[target=s01]'),
					isModified);
			}
		},

		events: {
			'click .ca_sample_download': function(){
				clutil.download('/public/sample/シーズン別商品属性別構成比登録サンプル.xlsx');
			}
		},

		initialize: function(){
			this.listenTo(this, this.myEvents);
		},

		getGetReq: function(){
			return MyApp.srchData.AMMPV0020GetReq;
		},

		// 取込完了
		onUptakeDone: function(data){
			MyApp.data.AMMPV0020GetRsp.attrRec = data.AMMPV0020GetRsp.attrRec;
			this.triggerMethod('update:data');
			this.triggerMethod('require:modified:check');
		},

		// 更新完了
		onUpdateSuccess: function(){
			this.triggerMethod('require:save:previous:data');
			$.when(Controller.research()).done(function(){
				clutil.updMessageDialog();
			});
		},

		isValid: function() {
			if (!this.dataGrid.getData().length){
				// 空のとき
			}
			if (!this.dataGrid.isValid()){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return false;
			}
			var gridData = this.dataGrid.getData();
			var d = _.reduce(gridData, function(memo, item){
				memo.total += Number(item.compoRate);
				return memo;
			}, {total: 0});
			if (d.total.toFixed(2) !== '100.00'){
				clutil.mediator.trigger('onTicker', '構成比の合計が100%になりません。');
				return false;
			}

			return true;
		},

		getUpdReq: function(){
			return {
				attrRec: this.dataGrid.getData()
			};
		},

		loadGridData: function(){
			return MyApp.data.AMMPV0020GetRsp.attrRec;
		},

		getColumns: function(){
			var columns = [],
				headRec = MyApp.data.AMMPV0020GetRsp.attrHeadRec;

			if (headRec.attrFunc1ID){
				columns.push({
					width: 150,
					head: true,
					name: headRec.attrFunc1Name,
					field: 'itemAttr1Name',
					cellType: {
						formatter: function(value, options){
							var dc = options.dataContext;
							return ClGrid.Formatters.codename({
								code: dc.itemAttr1Code,
								name: dc.itemAttr1Name
							}, options);
						}
					}
				});
			}
			if (headRec.attrFunc2ID){
				columns.push({
					width: 150,
					head: true,
					name: headRec.attrFunc2Name,
					field: 'itemAttr2Name',
					cellType: {
						formatter: function(value, options){
							var dc = options.dataContext;
							return ClGrid.Formatters.codename({
								code: dc.itemAttr2Code,
								name: dc.itemAttr2Name
							}, options);
						}
					}
				});
			}
			if (headRec.attrFunc3ID){
				columns.push({
					width: 150,
					head: true,
					name: headRec.attrFunc3Name,
					field: 'itemAttr3Name',
					cellType: {
						formatter: function(value, options){
							var dc = options.dataContext;
							return ClGrid.Formatters.codename({
								code: dc.itemAttr3Code,
								name: dc.itemAttr3Name
							});
						}
					}
				});
			}
			// 空のときは作成しない
			if (!columns.length) return;

			columns = columns.concat(
				[
					{
						width: 95,
						minWidth: 95,
						name: '前年構成比(%)',
						field: 'compoRatePrev',
						cssClass: 'txtalign-right',
						cellType: {
							formatFilter: 'comma fixed:2'
						}
					},
					{
						name: '構成比(%)',
						width: 75,
						minWidth: 75,
						field: 'compoRate',
						cssClass: 'txtalign-right',
						cellType: {
							type: 'text',
							formatFilter: 'comma fixed:2',
							// limit: 'number:3,2',
							validator: 'required decimal:3,2 min:0',
							placeholder: clcom.getSysparam(
								'PAR_AMCM_DEFAULT_PERCENT_DECIMAL')
						}
					},
					{
						width: 100,
						name: '前年回転率(%)',
						field: 'turnOverPrev',
						cssClass: 'txtalign-right',
						cellType: {
							formatFilter: 'comma fixed:2'
						}
					},
					{
						name: '回転率(%)',
						width: 75,
						minWidth: 75,
						field: 'turnOver',
						cssClass: 'txtalign-right',
						cellType: {
							type: 'text',
							formatFilter: 'comma fixed:2',
							// limit: 'number:4,2',
							validator: 'required decimal:4,2 min:0',
							placeholder: clcom.getSysparam(
								'PAR_AMCM_DEFAULT_PERCENT_DECIMAL2')
						}
					},
					{
						width: 125,
						name: '前年平均売価(税抜)',
						field: 'avePricePrev',
						cssClass: 'txtalign-right',
						cellType: {
							formatFilter: 'comma'
						}
					},
					{
						name: '平均売価(税抜)',
						width: 100,
						minWidth: 100,
						field: 'avePrice',
						cssClass: 'txtalign-right',
						cellType: {
							type: 'text',
							formatFilter: 'comma',
							// limit: 'uint len:5',
							validator: 'required decimal:5,0 min:0'
						}
					},
					{
						width: 100,
						minWidth: 100,
						name: '前年経準率(%)',
						field: 'mrgnRatePrev',
						cssClass: 'txtalign-right',
						cellType: {
							formatFilter: 'comma fixed:1'
						}
					},
					{
						name: '経準率(%)',
						width: 75,
						minWidth: 75,
						field: 'mrgnRate',
						cssClass: 'txtalign-right',
						cellType: {
							type: 'text',
							formatFilter: 'comma fixed:1',
							// limit: 'number:3,1',
							validator: 'required decimal:3,1',
							placeholder: clcom.getSysparam(
								'PAR_AMCM_DEFAULT_PERCENT_DECIMAL')
						}
					},
					{
						width: 105,
						name: '前年平均コスト',
						field: 'aveCostPrev',
						cssClass: 'txtalign-right',
						cellType: {
							formatFilter: 'comma'
						}
					},
					{
						name: '平均コスト',
						field: 'aveCost',
						width: 80,
						minWidth: 80,
						cssClass: 'txtalign-right',
						cellType: {
							type: 'text',
							formatFilter: 'comma',
							// limit: 'uint len:7',
							validator: 'required decimal:7 min:0'
						}
					}
				]);
			return columns;
		},

		getHeadMetadata: function(row){
			return {
				cssClasses: 'hdrow row' + row
			};
		}
	});

	// 商品属性別・サイズ別計画を登録・参照する
	var SizeRecView = Marionette.ItemView.extend({
		template: '#SizeRecView',

		ui: {
			edit: '.ca_edit'
		},

		behaviors: {
			Update: {
				getData: function(){
					var getReq = _.clone(MyApp.srchData.AMMPV0020GetReq);
					var updReq = this.view.getUpdReq();
					getReq.csvType = AMMPV0020Req.AMMPV0020_PARAM_CSV_SIZE;
					return {
						resId: 'AMMPV0020',
						data: {
							reqHead: {
								opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
							},
							AMMPV0020GetReq: getReq,
							AMMPV0020UpdReq: updReq
						}
					};
				}
			},
			Grid: {
				gridOptions: function(columns){
					var frozenColumn = -1, i, l;
					if(columns){
						for(i=0,l=columns.length; i<l; i++){
							if(!columns[i].head) break;
						}
						frozenColumn = i-1;
					}
					return {
						autoHeight: false,
						frozenColumn: frozenColumn
					};
				},
				gridViewOptions: {
					autoToolTip: {
						title: function(el){
							var $el = $(el);
							if($el.hasClass('input') ||
							   $el.parent().hasClass('hdrow')){
								return false;
							}
							if(ClGrid.isEllipsisActive(el)){
								$el.addClass('hasEllipsis');
								return $el.text();
							}else{
								$el.removeClass('hasEllipsis');
							}
							return false;
						}
					}
				},
				frozenRow: 2
			},
			Uptake: {
				csvType: AMMPV0020Req.AMMPV0020_PARAM_CSV_SIZE
			},
			CheckModified: {
				name: 'SizeRecView',
				numberFields: function(){
					return _.map(MyApp.data.AMMPV0020GetRsp.sizeHeadRec.sizeName, function(r, i){
						// jshint unused: false
						return i;
					});
				}
			}
		},

		gridEvents: {
			'cell:change': function(ev){
				console.log(ev);
				var item = ev.item;
				var sizeNames = MyApp.data.AMMPV0020GetRsp.sizeHeadRec.sizeName;
				item.total = _.reduce(sizeNames, function(total, rec, i){
					// jshint unused: false
					return total + Number(item[i]||0);
				}, 0);
				ev.dataGrid.updateItem(item);
				if (ev.isBody){
					this.triggerMethod('require:modified:check');
				}
			}
		},

		myEvents: {
			'modified:change': function(isModified){
				clutil.inputReadonly(this.ui.edit, !isModified);
				MyApp.setModifiedMarkTab(
					Controller.getResultView().$('li[target=s04]'),
					isModified);
			}
		},

		events: {
			'click .ca_sample_download': function(){
				clutil.download('/public/sample/商品属性別サイズ別構成比登録サンプル.xlsx');
			}
		},

		initialize: function(){
			this.listenTo(this, this.myEvents);
		},

		// 取込完了
		onUptakeDone: function(data){
			MyApp.data.AMMPV0020GetRsp.sizeRec = data.AMMPV0020GetRsp.sizeRec;
			this.triggerMethod('update:data');
			this.triggerMethod('require:modified:check');
		},

		// 更新完了
		onUpdateSuccess: function(){
			this.triggerMethod('require:save:previous:data');
			$.when(Controller.research()).done(function(){
				clutil.updMessageDialog();
			});
		},

		isValid: function() {
			if (!this.dataGrid.isValid()){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return false;
			}
			var gridData = this.dataGrid.getData();
			if (!_.all(gridData, function(item, i){
				return i % 2 === 0 || Number(item.total).toFixed(2) === '100.00';
			})){
				clutil.mediator.trigger('onTicker', '構成比の合計が100%になりません。');
				return false;
			}
			return true;
		},

		getUpdReq: function(){
			var sizeHeadRec = MyApp.data.AMMPV0020GetRsp.sizeHeadRec,
				sizeNames = sizeHeadRec.sizeName;

			var data = this.dataGrid.getData();
			var recs = _.reduce(data, function(memo, rec, i){
				var prevRec, sizeRate;
				if (i % 2 === 1){
					prevRec = memo.prevRec;
					sizeRate = memo.prev.sizeRate;

					_.each(sizeNames, function(name, i){
						sizeRate.push({
							compoRatePrev: prevRec[i],
							compoRate: rec[i]
						});
					});
					memo.recs.push(memo.prev);
					memo.prev = {};
				}else{
					memo.prev = _.pick(
						rec,
						'itemAttr1ID',
						'itemAttr1Code',
						'itemAttr1Name',
						'itemAttr2ID',
						'itemAttr2Code',
						'itemAttr2Name',
						'itemAttr3ID',
						'itemAttr3Code',
						'itemAttr3Name');
					memo.prev.sizeRate = [];
					memo.prevRec = rec;
				}
				return memo;
			}, {recs: []}).recs;

			return {
				sizeHeadRec: sizeHeadRec,
				sizeRec: recs
			};
		},

		getHeadMetadata: function(row){
			return {
				cssClasses: 'hdrow row' + row
			};
		},

		colhdMetadatas: function(columns){
			var i, l, columns1 = {}, groups, totalIndex = 0,
				headRec = MyApp.data.AMMPV0020GetRsp.sizeHeadRec;
			for (i = 0, l = columns.length; i < l; i++){
				var c = columns[i];
				// columns1[c.id] = {
				// 	name: c.xname
				// };
				if (c.field === 'total'){
					break;
				}
			}
			totalIndex = i;

			columns1 = {
				0: {
					colspan: totalIndex + 1
				}
			};

			groups = _.groupBy(headRec.sizeName, 'sizePtnID');
			_.each(headRec.sizeName, function(size, i){
				var group = groups[size.sizePtnID];
				if (group) {
					columns1['s' + i] = {
						name: size.sizePtnName,
						colspan: group.length
					};
					groups[size.sizePtnID] = null;
				}
			});

			return [
				{
					columns: columns1
				}
			];
		},

		getColumns: function(){
			var view = this, columns = [],
				headRec = MyApp.data.AMMPV0020GetRsp.sizeHeadRec;

			if (headRec.attrFunc1ID){
				columns.push({
					name: headRec.attrFunc1Name,
					id: 0,
					field: 'itemAttr1',
					width: 150,
					cellType: {
						formatter: 'codename'
					},
					head: true
				});
			}
			if (headRec.attrFunc2ID){
				columns.push({
					name: headRec.attrFunc2Name,
					field: 'itemAttr2',
					id: 1,
					width: 150,
					cellType: {
						formatter: 'codename'
					},
					head: true
				});
			}
			if (headRec.attrFunc3ID){
				columns.push({
					name: headRec.attrFunc3Name,
					id: 2,
					field: 'itemAttr3',
					width: 150,
					cellType: {
						formatter: 'codename'
					},
					head: true
				});
			}

			columns.push({
				name: '',
				id: 3,
				width: 90,
				field: 'compoLabel',
				head: true
			});

			// 合計
			columns.push({
				name: 'サイズ合計',
				id: 4,
				width: 100,
				field: 'total',
				cssClass: 'txtalign-right',
				cellType: {
					formatFilter: 'fixed:2'
				},
				head: true
			});

			_.each(headRec.sizeName, function(size, n){
				if(!view.sizePtnID || view.sizePtnID === size.sizePtnID){
					columns.push({
						name: size.sizeName,
						isSizeColumn: true,
						id: 's' + n,
						field: n,
						width: 80,
						minWidth: 80,
						cssClass: 'txtalign-right',
						cellType: {
							type: 'text',
							formatFilter: 'fixed:2',
							validator: 'required decimal:3,2 max:100 min:0',
							// limit: 'number:3,2',
							isEditable: function(item){
								return !item.prevCompo;
							},
							placeholder: clcom.getSysparam(
								'PAR_AMCM_DEFAULT_PERCENT_DECIMAL')
						}
					});
				}
			});
			return columns;
		},

		loadGridData: function(){
			var records = [];
			_.each(MyApp.data.AMMPV0020GetRsp.sizeRec, function(rec){
				var item1 = _.clone(rec);
				var compoRatePrevList = _.pluck(rec.sizeRate, 'compoRatePrev');
				_.extend(item1, compoRatePrevList);
				item1.itemAttr1 = {
					id: item1.itemAttr1ID,
					name: item1.itemAttr1Name,
					code: item1.itemAttr1Code
				};
				item1.itemAttr2 = {
					id: item1.itemAttr2ID,
					name: item1.itemAttr2Name,
					code: item1.itemAttr2Code
				};
				item1.itemAttr3 = {
					id: item1.itemAttr3ID,
					name: item1.itemAttr3Name,
					code: item1.itemAttr3Code
				};
				item1.compoLabel = '前年(%)';
				item1.total = sum(compoRatePrevList);
				item1.sizeRate = null;
				item1.prevCompo = true;
				records.push(item1);

				var item2 = _.clone(rec);
				var compoRateList = _.pluck(rec.sizeRate, 'compoRate');
				_.extend(item2, compoRateList);
				item2.compoLabel = '構成比(%)';
				item2.total = sum(compoRateList);
				item2.sizeRate = null;
				records.push(item2);
			});
			return records;
		},

		buildSizePtnFilter: function(){
			var getRsp = MyApp.data.AMMPV0020GetRsp,
				sizePtnList = {},
				items;

			_.each(getRsp.sizeHeadRec.sizeName, function(attrs){
				if(!sizePtnList[attrs.sizePtnID]){
					sizePtnList[attrs.sizePtnID] = {
						id: attrs.sizePtnID,
						label: attrs.sizePtnName
					};
				}
			});

			items = _.chain(sizePtnList).values().sortBy('id').value();

			this.sizePtnFilter = ClGrid.Editors.ClSelector.createSelector({
				items: items,
				selectpicker: {
					width: 280
				}
			});
			this.sizePtnFilter.render();
			this.$('.sizePtnFilterWrap').html(this.sizePtnFilter.el);
			this.listenTo(this.sizePtnFilter, 'change', this.changeSizePtn);
		},

		changeSizePtn: function(){
			this.sizePtnID = parseInt(this.sizePtnFilter.getValue(), 10);
			this.dataGrid.setColumns(this.getColumns());
		},

		onShow: function(){
			this.buildSizePtnFilter();
		},

		onClose: function(){
			if(this.sizePtnFilter){
				this.sizePtnFilter.remove();
			}
		}
	});

	var ResultView = Marionette.Layout.extend({
		template: '#ResultView',

		regions: {
			attrRecView: '#attrRecView',
			paramView: '#paramView',
			diffView: '#diffView',
			sizeRecView: '#sizeRecView',
			planView: '#planView'
		},

		events: {
			/**
			 * タブ切替
			 */
			"click .tabNavi li": function(e) {
				var tab_num = this.$(".tabNavi li").index(e.target);
				this.setActiveTab(tab_num);
			}
		},

		setActiveTab: function(no){
			this.$(".sht").hide();
			this.$(".sht").eq(no).fadeIn({
				complete: function(){
					MyApp.trigger('tabSwitch:' + no);
				}
			});
			this.$(".tabNavi li")
				.removeClass('on')
				.eq(no).addClass('on');
		},

		getActiveTab: function(){
			return this.$(".tabNavi li").index(this.$('.tabNavi li.on'));
		},

		onShow: function(){
			var that = this;
			this.attrRecView.show(new AttrRecView());
			this.paramView.show(new ParamView());
			this.diffView.show(new DiffView());
			this.sizeRecView.show(new SizeRecView());
			this.planView.show(new PlanView());
			that.setActiveTab(Controller.lastTab || 0);
		}
	});

	var SrchCondView = Marionette.Layout.extend({
		template: '#SrchCondView',

		events: {
			'click #search': function(){
				this.search();
			},
			// 検索条件を再指定ボタン押下
			'click #searchAgain': function(){
				if ($('#searchArea').css('display') == 'none') {
					MyApp.srchAreaCtrl.show_srch();
					$("#searchAgain").text('検索条件を非表示');
					$("#searchAgain").fadeIn();
				} else {
					MyApp.srchAreaCtrl.show_result();
					$("#searchAgain").text('検索条件を再表示');
				}
			}
		},

		ui: {
			searchArea: '#searchArea',
			srchYear: '#ca_srchYear'
		},

		initialize: function(){
			_.bindAll(this);

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		onShow: function(){
			clutil.initUIelement(this.$el);

			var ope_date = clcom.getOpeDate();
			var year = Math.floor(ope_date / 10000);
			var month = Math.floor((ope_date/100)%100);
			if (month < 4) {
				year--;
			}

			clutil.clyearselector({
				el: this.ui.srchYear,
				past: clutil.getclsysparam('PAR_AMCM_YEAR_FROM'),
				future: clutil.getclsysparam('PAR_AMCM_YEAR_TO'),
				value: year,
				argtext: '年度'
			});

			this.relation = clutil.FieldRelation.create('default', {
				clbusunitselector: {
					el: '#ca_srchUnitID'
				},

				clvarietycode: {
					el: '#ca_srchItgrpID'
				},

				cltypeselector: {
					el: '#ca_srchSeasonID',
					kind: amcm_type.AMCM_TYPE_PLAN_SEASON
				}
			});

			var that = this;
			this.relation.done(function(){
				that.resetFocus();
			});
		},

		isValid: function(){
			var valid = this.validator.valid();
			return valid;
		},

		search: function(){
			if (!this.isValid()){
				return;
			}
			var getReq = clutil.view2data(this.ui.searchArea);
			_.extend(getReq, {
				reqType: AMMPV0020Req.AMMPV0020_REQTYPE_ATTR
			});
			var data = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},

				AMMPV0020GetReq: getReq
			};

			this.srchData = data;
			this._search();
		},

		_search: function(){
			if (this.srchData){
				return clutil.postJSON({
					resId: 'AMMPV0020',
					data: this.srchData
				})
					.done(this.onSearchSuccess)
					.fail(this.onSearchFail);
			}
		},

		research: function(){
			return this._search();
		},

		changeSearchAreaState: function(enable){
			if (enable) {
				clutil.viewRemoveReadonly(this.$('#searchArea'));
			} else {
				clutil.viewReadonly(this.$('#searchArea'));
			}
		},

		onSearchSuccess: function(data){
			MyApp.srchData = this.srchData;
			MyApp.data = data;
			MyApp.srchAreaCtrl.show_result();
			this.changeSearchAreaState(false);
			Controller.showFooter();
			Controller.showResultView();
		},

		onSearchFail: function(data){
			Controller.closeResultView();
			MyApp.srchAreaCtrl.show_srch();
			clutil.mediator.trigger('onTicker', data);	// エラーメッセージを通知。
			this.resetFocus();
		},

		resetFocus: function(){
			clutil.focus(null, 0, {view: this.$el});
		}
	});


	var Controller = {
		start: function(){
			MyApp.addRegions({
				srchCondView: '#srchCondView',
				resultView: '#resultView'
			});

			if (!clcom.pushpop.popable){
				clcom._preventConfirm = true;
			}

			MyApp.unit_id = Number(clcom.userInfo.unit_id);
			// 共通ビュー(共通のヘッダなど内包）
			MyApp.mdBaseView = new clutil.View.MDBaseView({
				title: '商品属性別計画策定',
				opeTypeId: -1,
				btn_submit: false,
				backBtnURL: clcom.pushpop.popable ? null : false
			});
			MyApp.mdBaseView.initUIElement();
			MyApp.mdBaseView.render();

			MyApp.srchCondView.show(new SrchCondView());

			if (clcom.pageArgs){
				this.load();
			}
			// 検索条件を再指定ボタンを隠す
			MyApp.srchAreaCtrl = clutil.controlSrchArea(
				$('#searchArea'),
				$('#ca_srch'),	// 検索条件領域
				$('#resultView'),				// 検索結果表示領域
				$('#searchAgain'));			// 検索条件を開く部品
		},

		load: function(){
			var srchCondView = this.getSrchCondView();
			clutil.data2view(srchCondView.$el, clcom.pageArgs);
			srchCondView.relation.done(function(){
				// 必須項目がないのでサーチできない
				// srchCondView.search();
			});
		},

		getSrchCondView: function(){
			return MyApp.srchCondView.currentView;
		},

		getResultView: function(){
			return MyApp.resultView.currentView;
		},

		getAttrRecView: function(){
			var resultView = this.getResultView();
			return resultView && resultView.attrRecView.currentView;
		},

		showAttrRecView: function(){
			var resultView = this.getResultView();
			if (resultView){
				resultView.attrRecView.show(new AttrRecView());
			}
		},

		getSizeRecView: function(){
			var resultView = this.getResultView();
			return resultView && resultView.sizeRecView.currentView;
		},

		showSizeRecView: function(){
			var resultView = this.getResultView();
			if (resultView){
				resultView.sizeRecView.show(new SizeRecView());
			}
		},

		showResultView: function(){
			MyApp.resultView.show(new ResultView());
		},

		closeResultView: function(){
			MyApp.resultView.close();
		},

		cancelEdit: function(){
			MyApp.confirmWhenModified(function(){
				this.closeResultView();
				MyApp.srchAreaCtrl.reset();
				this.hideFooter();
				this.getSrchCondView().changeSearchAreaState(true);
				this.getSrchCondView().resetFocus();
				MyApp.resetModified();
			}, this);
		},

		showFooter: function(){
			_.extend(MyApp.mdBaseView.options, {
				btn_cancel: {
					label: '条件再設定',
					action: this.cancelEdit
				},
				btn_submit: true
			});
			MyApp.mdBaseView.renderFooterNavi();
		},

		hideFooter: function(){
			_.extend(MyApp.mdBaseView.options, {
				btn_cancel: false,
				btn_submit: false
			});
			MyApp.mdBaseView.renderFooterNavi();
		},

		research: function(){
			var resultView = this.getResultView();
			Controller.lastTab = resultView.getActiveTab();
			return this.getSrchCondView().research();
		}
	};
	_.bindAll(Controller);

	MyApp.addInitializer(Controller.start);

	$(function(){
		// Enterキーによるフォーカスをする。
		clutil.enterFocusMode();

		//--------------------------------------------------------------
		// 初期データ取得
		clutil.getIniJSON().done(function(){
			MyApp.start();
		}).fail(function(data){
			console.error('iniJSON failed.');
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

	MyApp.boo = function(){
		clutil.data2view(Controller.getSrchCondView().$el, {
			srchYear: '2014',
			srchUnitID: 5,
			srchItgrpID: {
				id: 165,
				code: '08',
				name: 'コート'
			},
			srchSeasonID: 1
		});
		Controller.getSrchCondView().relation.done(function(){
			Controller.getSrchCondView().search();
		});
	};

	MyApp.on('dlFail', function(data){
		clutil.mediator.trigger('onTicker', data);
	});

	MyApp.on('tabSwitch:0', function(){
		var attrRecView = Controller.getAttrRecView();
		if (attrRecView){
			attrRecView.triggerMethod('dom:refresh');
		}
	});
	MyApp.on('tabSwitch:2', function(){
		var sizeRecView = Controller.getSizeRecView();
		if (sizeRecView){
			sizeRecView.triggerMethod('dom:refresh');
		}
	});

}());
