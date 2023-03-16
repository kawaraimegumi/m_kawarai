/* global MyApp: true, dummyData: false */
$.inputlimiter.noTrim = true;
useSelectpicker2();

$.fn.tooltip.defaults.html = true;

(function(MyApp){
	var PackView = MyApp.PackView,
		ItemListView = MyApp.ItemListView,
		DistrView = MyApp.DistrView,
		GetRspModel = MyApp.GetRspModel;

	var CommentView = Marionette.CompositeView.extend({
		template: '#CommentView',

		ui: {
			comment: '#ca_comment'
		},

		itemView: Marionette.ItemView.extend({
			tagName: 'tr',
			template: '#CommentItemView'
		}),

		itemViewContainer: 'tbody',

		onShow: function(){
			// if (!_.size(this.collection)){
			// 	this.$('table').hide();
			// }
			clutil.cltxtFieldLimit(this.$('#ca_comment'));
		},

		initialize: function(){
			this.validator = clutil.validator(this.$el, {
				echoback: $('.cl_echoback').hide()
			});
		},

		isValid: function(opeTypeId){
			if (Utils.isCommentRequire(opeTypeId) &&
				!this.ui.comment.val()){
				this.validator.setErrorMsg(this.ui.comment,
										  clutil.getclmsg('EMS0037'));
				clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
				return false;
			}else{
				this.clearError();
				return true;
			}
		},

		setReadonly: function(){
			clutil.viewReadonly(this.$el);
		},

		clearError: function(){
			this.validator.clear();
		},

		getComment: function(){
			return this.ui.comment.val() || '';
		}
	});

	var Controller = Marionette.Controller.extend({
		initialize: function(){
			_.bindAll(this, 'buildSubmitReq', 'buildGetReq');
		},

		// 振分レコードの商品ID
		generateDistrItemId: function(item){
			return item.makerItemCode + ':' +
				item.colorID + ':' +
				item.sizeID;
		},

		// 店舗レコードを取得
		fetchStoreList: function(){
			if (_.size(MyApp.model.storeList)) return;

			clutil.postJSON(clcom.pageId, {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				reqPage: {},
				AMMSV0120StoreReq: {
					srchUnitID: MyApp.reqres.request('unitID')
				}
			}).done(function(data){
				MyApp.model.storeList = data.AMMSV0120StoreRsp.storeList;
			});
		},

		// 追加発注時に発注項目をクリアする
		clearOrderField: function(attrs){
			console.log('clearOrderField');
			attrs || (attrs = {});
			var pack = attrs.pack || {};
			pack.orderTgtTypeID = 0;
			pack.tagAddrNo = 0;
			pack.approveDate = 0;
			pack.orderDate = 0;
			pack.orderNo = 0;

			_.each(attrs.itemList, function(item){
				item.dlvDate = 0;
                item.finishDate = 0;
                item.dlvTypeID = 0;
			});

			_.each(attrs.csItemList, function(item){
				item.orderQy = 0;
			});

			attrs.distrList = [];

			// 発注書番号をクリア
			pack.orderNo = null;
		},

		// モデルを作成する
		createGetRspModel: function(attrs){
			// attrs = dummyData.AMMSV0120GetRsp; //XXXX
			var model = new GetRspModel(attrs, {
				parse: true
			});
			return model;
		},

		// 更新用の商品一括登録IDを返す
		getItemPackRegId: function(){
			return Number(MyApp.model.pack.get('id')) || 0;
		},

		// 商品一括ビューを取得する
		getPackView: function(){
			return MyApp.packView.currentView;
		},

		// 商品レコードの検証を行う。
		checkItemRecords: function(){
			return Utils.getItemView().isValid();
		},

		checkTag: function() {
			var f_valid = true;
			if (!$("#ca_tagIssueFlag").prop('checked')) {
				f_valid = false;
			}
			return f_valid;
		},

		// 振分レコードの合計を計算
		calcDistrSumQy: function(){
			var model = MyApp.reqres.request("getModel"),
				distrRecords = model.distrRecords;

			var distrSumQy = {};

			distrRecords.each(function(model){
				var id = MyApp.reqres.request("generateDistrItemId", model.attributes);
				if (!distrSumQy[id])
					distrSumQy[id] = 0;
				distrSumQy[id] = Number(distrSumQy[id]) + Number(model.get('distrQy'));
			}, this);

			return distrSumQy;
		},

		// 振分レコードの検証
		validDistrRecords: function(){
			var errors = [],
				model = MyApp.reqres.request("getModel"),
				distrSumQy = Utils.calcDistrSumQy(),
				itemRecords = model.itemRecords;

			itemRecords.each(function(item){
				var total = distrSumQy[item.id] || 0,
					orderQy = Number(item.get('orderQy')) || 0;

				if (total > orderQy){
					errors.push({
						id: item.id,
						msg: clutil.fmt(clmsg.EMS0148, orderQy)
					});
				}
			});

			return errors;
		},

		fixDistrRecords: function(){
			var model = MyApp.reqres.request("getModel"),
				distrRecords = model.distrRecords,
				itemRecords = model.itemRecords;
			distrRecords.remove(distrRecords.filter(function(distr){
				var id = Utils.generateDistrItemId(distr.attributes);
				var item = itemRecords.get(id);
				return !item;
			}));
		},

		// 商品レコードビューを取得する
		getItemView: function(){
			return MyApp.itemView.currentView;
		},

		getDistrView: function(){
			return MyApp.distrView.currentView;
		},

		// 商品レコードをモデルに反映する
		saveItemRecords: function(){
			MyApp.model.itemRecords.reset(Utils.getItemView().getData());
		},

		// 更新用商品一括レコードを作成
		buildSubmitPackRec: function(){
			var data = MyApp.model.pack.toJSON();
			_.extend(data, Utils.getPackView().serialize());
			return data;
		},

		beforeValid: function(){
			var itemView = this.getItemView();
			if (itemView && itemView.dataGrid) {
				itemView.dataGrid.clearCellMessage();
			}
		},

		// 更新用アイテムレコードを作成
		buildSubmitItemRec: function(){
			var model = MyApp.model;
			var recs = model.itemRecords.invoke(
				'omit', 'fromDate', 'toDate');


			var itemList = new MyApp.ItemCollection(model.itemList);
			var cItemList = new MyApp.ItemColorCollection(model.cItemList);
			var csItemList = new MyApp.ItemColorSizeCollection(model.csItemList);

			var setOptions = {
				merge: true,
				add: true,
				remove: true
			};

			// マージする
			csItemList.set(_.map(recs, function(attrs){
				return new MyApp.ItemColorSizeCollection.prototype.model(attrs, {parse: true});
			}), setOptions);
			itemList.set(_.map(recs, function(attrs){
				return new MyApp.ItemCollection.prototype.model(attrs, {parse: true});
			}), setOptions);
			cItemList.set(_.map(recs, function(attrs){
				return new MyApp.ItemColorCollection.prototype.model(attrs, {parse: true});
			}), setOptions);

			// itemIDを当てる
			csItemList.each(function(csItem){
				var item = itemList.get(csItem.get('makerItemCode'));
				csItem.set('itemID', item && item.get('itemID') || 0);
			});
			cItemList.each(function(cItem){
				var item = itemList.get(cItem.get('makerItemCode'));
				cItem.set('itemID', item && item.get('itemID') || 0);
			});

			var distrList = model.distrRecords.toJSON();
			_.each(distrList, function(distr){
				// メーカー品番、カラー、サイズのいずれかに変更がある場
				// 合はcsitemIDをクリア
				var id = Utils.generateDistrItemId(distr);
				var csItem = csItemList.get(id);
				distr.csitemID = csItem && csItem.get('csitemID') || 0;
			});

			var resp = {
				itemList: itemList.toJSON(),
				cItemList: cItemList.toJSON(),
				csItemList: csItemList.toJSON(),
				distrList: distrList,
				storeList: model.storeList
			};

			console.log('buildSubmitItemRec', resp);

			return resp;
		},

		buildExportItemRec: function(){
			var i, l, dataGrid = Utils.getItemView().dataGrid,
				isEmpty = ClGrid.getEmptyCheckFunc(dataGrid),
				itemRecs = dataGrid.getData();
			if(itemRecs){
				for(i=itemRecs.length-1; i>=0; i-=1){
					if(!isEmpty(itemRecs[i]))
						break;
				}
				itemRecs.splice(i+1);
			}
			var getCode = function(item){
				return item && item.code || '';
			};
			var getName = function(item){
				return item && item.name || '';
			};
			var getType = function(kind, id){
				var list = clutil.gettypenamelist(kind);
				var type = _.where(list, {type_id: id});
				return type[0];
			};

			var exportItemRec = _.map(itemRecs, function(rec){
				var item = {};

				item = _.pick(rec,
					'cost',
					'price',
					'priceIntax',

					'orderQy',

					'finishDate',
					'dlvDate',
					'saleStartDate',
					'saleEndDate'
				);
				_.reduce([
					'itemName',
					'makerItemCode',
					'makerColor',
					'quality'
				], function(memo, key){
					var value = rec[key];
					memo[key] = value == null ? '' : value;
					return memo;
				}, item);



				_.extend(item, {
					colorCode: getCode(rec.color),
					colorName: getName(rec.color),
					designCode: getCode(rec.design),
					designName: getName(rec.design),
					materialCode: getCode(rec.material),
					materialName: getName(rec.material),

					styleCode: getCode(rec.style),
					styleName: getName(rec.style),
					brandCode: getCode(rec.brand),
					brandName: getName(rec.brand),
					sizeCode: getCode(rec.size),
					sizeName: getName(rec.size),
					importCode: getCode(rec['import']),
					importName: getName(rec['import'])
				});

				var dlvType = getType(amcm_type.AMCM_TYPE_DELIVERY, rec.dlvTypeID)||{};
				item.dlvTypeCode = dlvType.code || '';
				item.dlvTypeName = dlvType.name || '';

				return item;
			});

			return exportItemRec;
		},

		buildExportDistrRec: function(){
			var distrView = Utils.getDistrView(),
				itemRecords = distrView.itemRecords,
				distrRecords = MyApp.model.distrRecords,
				exportItemList = itemRecords.map(function(model){
					var item = model.attributes;
					return {
						makerItemCode: item.makerItemCode,
						colorCode: item.color.code,
						sizeCode: item.size.code,
					};
				}),
				exportDistrList = [];


			itemRecords.each(function(model){
				var item = model.attributes;
				_.each(MyApp.model.storeList, function(store){
					var rec = {
						makerItemCode: item.makerItemCode || '',
						colorID: item.color.id,
						colorCode: item.color.code,
						sizeID: item.size.id,
						sizeCode: item.size.code,
						storeID: store.storeID,
						storeCode: store.storeCode,
						storeName: store.storeName
					};
					var distrId = MyApp.reqres.request('generateDistrId', rec);
					var distr = distrRecords.get(distrId);
					rec.distrQy = distr && distr.get('distrQy') || 0;
					exportDistrList.push(rec);
				});
			});

			return {
				exportItemList: exportItemList,
				exportDistrList: exportDistrList,
				csvType: 2
			};
		},

		exportItemCsv: function(){
			var exportItemList = this.buildExportItemRec();
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
				},
				AMMSV0120UpdReq: {
					exportItemList: exportItemList,
					csvType: 1
				}
			};
			clutil.postJSON('AMMSV0120', req)
				.done(function(data){
					clutil.download(data.rspHead.uri);
				})
				.fail(function(data){
					clutil.mediator.trigger('onTicker', data);
				});
		},
		exportDistrCsv: function(){
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
				},
				AMMSV0120UpdReq: this.buildExportDistrRec()
			};
			clutil.postJSON('AMMSV0120', req)
				.done(function(data){
					clutil.download(data.rspHead.uri);
				})
				.fail(function(data){
					clutil.mediator.trigger('onTicker', data);
				});
		},

		// 振分画面で設定がおされた
		applyDistrRecords: function(){
			var packView = Utils.getPackView();

			// 検証
			if (!MyApp.distrView.currentView.isValid()){
				return;
			}
			MyApp.distrMode = false;
			// 商品一括レコードのリードオンリー状態を復元
			if (packView.readonlyState){
				clutil.viewRestoreState(packView.readonlyState);
				delete packView.readonlyState;
			}
			// 閉じる
			Utils.closeDistrView();
			// 開く
			Utils.showItemView();

			//MD-2072 商品発注兼振分_振分画面遷移時に登録ボタン有効化_調査依頼
			if( MyApp.submited == "1" ){
				$('div.submit_btn_group p').addClass('disable');	//submitグループボタン
				$('div.submit_btn_group a').attr('disabled','"disabled"');
				$('div.dl_btn_group p').addClass('disable');		//execl出力ボタン
				$('div.dl_btn_group a').attr('disabled','"disabled"');
			}
		},

		// 更新差戻し
		buildSubmitCommentRec: function(){
			var model = MyApp.model;
			var commentCollection = model.commentCollection.clone();
			var comment = MyApp.commentView.currentView.getComment();
			if (comment){
				commentCollection.add({
					id: Utils.getItemPackRegId(),
					comment: comment,
					orderSeq: MyApp.model.pack.get('orderSeq'),
					commentSeq: commentCollection.length + 1
				});
			}
			return commentCollection.toJSON();
		},

		// Submit 応答のイベントを受ける
		buildSubmitReq: function(opeTypeId, pgIndex){
			var confirm = null;

			if (opeTypeId === MyApp.OPETYPE_DISTR_APPLY){
				this.applyDistrRecords();
				return;
			}
			var ptnNo = Utils.getPtnNo(opeTypeId);
			console.log(opeTypeId, pgIndex, ptnNo);

			var packView = Utils.getPackView();
			////////////////////////////////////////////////////////////////
			Utils.beforeValid();
			// * 検証
			// 商品一括登録レコード
			if (!Utils.getPackView().isValid()){
				return;
			}
			// 商品レコードの検証
			if (!Utils.checkItemRecords()){
				return;
			}
			// タグ発行の検証
			if (ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPLY) {
				if (!Utils.checkTag()) {
					clutil.mediator.trigger('onTicker', 'タグ発行が選択されていません。');
					return;
				}
			} else if (ptnNo == amcm_type.AMCM_VAL_ITEM_OPEPTN_APPLY) {
				if (!Utils.checkTag()) {
					confirm = 'タグ発行が選択されていません。';
				}
			}

			// 商品レコードの保存
			Utils.saveItemRecords();

			// 振分の検証
			Utils.fixDistrRecords();
			if (_.size(Utils.validDistrRecords())){
				clutil.mediator.trigger('onTicker', '振分を設定してください');
				return;
			}
			// コメントの検証
			if (!MyApp.commentView.currentView.isValid(opeTypeId)){
				return;
			}

			// 上代 >= 下代チェック
			if (Utils.getItemView().hasWarning){
				clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
				// XXXX 警告ってどうやるの?
				return;
			}

			// 売り切り年 >= 商品展開年以降のチェック
			if (!Utils.getPackView().isValidYear()){
				return;
			}

			////////////////////////////////////////////////////////////////
			// リクエスト作成
			var model = MyApp.model;
			var updReq = _.extend({
				pack: Utils.buildSubmitPackRec(),
				status: model.status.toJSON(),
				commentList: Utils.buildSubmitCommentRec(),
				ptnNo: Utils.getPtnNo(opeTypeId)
			}, Utils.buildSubmitItemRec());

			var reqOpeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			if (MyApp.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
				MyApp.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				reqOpeTypeId = MyApp.opeTypeId;
			}
			var req = {
				resId: clcom.pageId,
				data: {
					reqHead: {
						opeTypeId: reqOpeTypeId,
						recno: MyApp.model.reqHead.recno
					},
					reqPage: {},
					AMMSV0120UpdReq: updReq
				},
				confirm: confirm,
			};

			console.log('buildSubmitReq', req);

			return req;
		},

		// GET 応答のイベントを受ける
		buildGetReq: function(opeTypeId, pgIndex){
			var target = MyApp.pageArgs.chkData[pgIndex],
				srchId = target.id || target.itemEntryID,
				editModeFlag = 0,
				delFlag = target.delFlag,	// 削除フラグ
				reqOpeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_REL;

			if (MyApp.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqOpeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY;
			}
			// 編集できた場合は編集モードフラグを設定する
			if (MyApp.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				editModeFlag = 1;
			}

			console.log(opeTypeId, pgIndex, srchId);
			return {
				resId: clcom.pageId,
				data: {
					reqHead: {
						opeTypeId: reqOpeTypeId
					},
					reqPage: {},
					AMMSV0120GetReq: {
						srchID: srchId,
						editModeFlag: editModeFlag,
						delFlag: delFlag	// 削除フラグ
					},
					AMMSV0120UpdReq: {},
					AMMSV0120CsvReq: {}
				}
			};
		},

		// 商品レコードを表示する
		showItemView: function(){
			// 振分モードを解除すう
			MyApp.distrMode = false;

			MyApp.model.itemRecords.each(function(model){
				// distrRecordsと対応が取れるように元のIDを保存
				model.set('oid', model.id);
			});
			MyApp.itemView.show(new ItemListView({
				itemRecords: MyApp.model.itemRecords,
				readOnlyMode: MyApp.mode === 'mode_rel' ||
					MyApp.isSaved ||
					MyApp.commentOnly
			}));

			this.showComment();

			// フッタボタンを設定する
			Utils.setFooterButtons();
		},

		// 商品レコードを閉じる
		closeItemView: function(){
			MyApp.itemView.close();
			this.hideComment();
		},

		// 振分レコードを1時保存する
		storeDistr: function(){
			MyApp.prevDistr = MyApp.model.distrRecords.toJSON();
		},

		// 振分レコードを1時保存から復元する
		restoreDistr: function(){
			MyApp.model.distrRecords.reset(MyApp.prevDistr);
		},

		// 差戻しを表示
		showComment: function(){
			if(MyApp.commentView.currentView){
				MyApp.commentView.currentView.$el.show();
				MyApp.commentView.currentView.clearError();
			}
		},

		// 差戻しを隠す
		hideComment: function(){
			// コメントを隠す
			if(MyApp.commentView.currentView){
				MyApp.commentView.currentView.$el.hide();
				MyApp.commentView.currentView.clearError();
			}
		},

		// 振分を表示する
		showDistrView: function(){
			// 振分モードフラグを設定する
			MyApp.distrMode = true;
			// distrRecordsのidを更新する
			var distrRecords = MyApp.model.distrRecords;
			MyApp.model.itemRecords.each(function(model){
				var oid = model.get('oid');
				if (oid != null && model.id !== oid){
					distrRecords.chain()
						.filter(function(model){
							return oid === Utils.generateDistrItemId(model.attributes);
						})
						.invoke('set', {
							makerItemCode: model.get('makerItemCode'),
							colorID: model.get('color').id,
							size: model.get('size').id
						})
						.value();
				}
			});
			// 振分を表示する
			MyApp.distrView.show(new DistrView({
				itemRecords: MyApp.model.itemRecords,
				editable: MyApp.mode !== 'mode_rel' && !MyApp.isSaved &&
					!MyApp.commentOnly
			}));

			// フッタボタンを設定する
			Utils.setFooterButtons();
		},

		// コメント
		showCommentView:function(){
			MyApp.commentView.show(new CommentView({
				collection: MyApp.model.commentCollection
			}));
			if (!Utils.isEditableComment()){
				MyApp.commentView.currentView.setReadonly();
			}
			if (MyApp.mode === 'mode_rel'){
				MyApp.commentView.currentView.setReadonly();
			}
		},

		getPtnNo: function(opeTypeId){
			var opeType = Utils.getFooterOpeType(MyApp.mode);
			var item = _.where(opeType, {opeTypeId: opeTypeId})[0];
			var ptn = item && item.ptn;
			if (!ptn && opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				ptn = amcm_type.AMCM_VAL_ITEM_OPEPTN_DEL;
			}
			return ptn ? ptn : 0;
		},

		isCommentRequire: function(opeTypeId){
			var opeType = Utils.getFooterOpeType(MyApp.mode);
			var items = _.where(opeType, {comment: true, opeTypeId: opeTypeId});
			return !_.isEmpty(items);
		},

		isEditableComment: function(){
			var opeType = Utils.getFooterOpeType(MyApp.mode);
			var items = _.where(opeType, {comment: true});
			return !_.isEmpty(items);
		},
		/**
		 * アプリのモードを設定する
		 * @method setMode
		 * @param opt
		 * @param opt.opeTypeId
		 * @param opt.approveTypeID
		 * @param opt.tagApproveTypeID
		 * @param opt.approveCount
		 * @return mode
		 */
		setMode: function(opt){
			var mode = "mode_rel", commentOnly = false;

			if (opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
				opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				mode = 'mode_new';
			} else if (opt.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
				mode = 'mode_rel';
			} else if (opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD &&
					   opt.approveCount === 0) {
				if(opt.tagApproveTypeID === amcm_type.AMCM_VAL_APPROVE_ENTRY ||
				   opt.tagApproveTypeID === 0){
					if (opt.approveTypeID === amcm_type.AMCM_VAL_APPROVE_APPLY ||
						opt.approveTypeID === amcm_type.AMCM_VAL_APPROVE_APPROVE1){
						if (clcom.srcId === "AMMSV0130"){
							//タグ発行申請後(承認一覧画面より)
							mode = 'mode_apply';
							commentOnly = true;
						}
						// else ふりわけ一覧からの場合は キャンセルのみ
					}else{
						mode = 'mode_edit';
					}
				}else if(opt.tagApproveTypeID === amcm_type.AMCM_VAL_APPROVE_APPLY ||
						  opt.tagApproveTypeID === amcm_type.AMCM_VAL_APPROVE_APPROVE1){
					if (opt.approveTypeID === amcm_type.AMCM_VAL_APPROVE_APPLY ||
						opt.approveTypeID === amcm_type.AMCM_VAL_APPROVE_APPROVE1){
						if (clcom.srcId === "AMMSV0130"){
							//タグ発行申請後(承認一覧画面より)
							mode = 'mode_apply';
							commentOnly = true;
						}
						// else ふりわけ一覧からの場合は キャンセルのみ
					}else{
						if (clcom.srcId === "AMMSV0130"){
							//タグ発行申請後(承認一覧画面より)
							mode = 'mode_tag_apply';
							commentOnly = true;
						}
						// else ふりわけ一覧からの場合は キャンセルのみ
					}
				}else if(opt.tagApproveTypeID === amcm_type.AMCM_VAL_APPROVE_RETURN){
					if (clcom.srcId === 'AMMSV0110'){
						// タグ発行申請差戻し後
						mode = 'mode_tag_return';
					}
					// else 承認画面からの場合は キャンセルのみ
				}else if(opt.tagApproveTypeID === amcm_type.AMCM_VAL_APPROVE_APPROVE){
					if (opt.approveTypeID === 0 ||
						opt.approveTypeID === amcm_type.AMCM_VAL_APPROVE_ENTRY){
						// タグ発行申請承認後
						mode = 'mode_tag_approve';
					}else if (opt.approveTypeID === amcm_type.AMCM_VAL_APPROVE_APPLY ||
							  opt.approveTypeID === amcm_type.AMCM_VAL_APPROVE_APPROVE1){
						if (clcom.srcId === 'AMMSV0130'){
							// 最終承認申請後(承認一覧画面より)
							mode = 'mode_apply';
							commentOnly = true;
						}
						// else ふりわけ一覧からの場合は キャンセルのみ
					}else if (opt.approveTypeID === amcm_type.AMCM_VAL_APPROVE_RETURN){
						if (clcom.srcId === 'AMMSV0110'){
							// 最終承認申請差し戻し後(タグ承認済)
							mode = 'mode_return_tag';
						}
						// else 承認画面からの場合は キャンセルのみ
					}
				}
			} else if (opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD &&
					   opt.approveCount > 0){
				if(opt.approveTypeID === 0 ||
				   opt.approveTypeID === amcm_type.AMCM_VAL_APPROVE_ENTRY ||
				   opt.approveTypeID === amcm_type.AMCM_VAL_APPROVE_APPROVE){
					// 承認済の場合 => 承認後の追加発注時
					mode = 'mode_approve';
				}else if(opt.approveTypeID === amcm_type.AMCM_VAL_APPROVE_APPLY ||
						 opt.approveTypeID === amcm_type.AMCM_VAL_APPROVE_APPROVE1){
					if (clcom.srcId === 'AMMSV0130'){
						// 承認一覧画面からの遷移の場合
						// 追加発注最終承認申請後
						mode = 'mode_oddadd_apply';
						commentOnly = true;
					}
					// else 承認画面からの場合は キャンセルのみ
				}else if(opt.approveTypeID === amcm_type.AMCM_VAL_APPROVE_RETURN){
					// 追加発注最終承認申請差戻し後
					if (clcom.srcId === 'AMMSV0130'){
						mode = 'mode_rel';
					}else{
						mode = 'mode_oddadd_return';
					}
				}
			}

			MyApp.mode = mode;
			MyApp.commentOnly = commentOnly;
			MyApp.mdBaseView.options.confirmLeaving = (mode != 'mode_rel');
			return mode;
		},

		/**
		 * モードからフッタのボタン配列を取得する
		 * @method getFooterOpeType
		 * @param mode
		 */
		getFooterOpeType: function(mode){
			var opeType = MyApp.footer_opetype_map[mode];
			if (opeType == null)
				opeType = -1;
			return opeType;
		},

		/**
		 * MyApp.modeからフッタのボタンを設定する
		 * @method setFooterButtons
		 */
		setFooterButtons: function() {
			if (MyApp.defaultBtnCancel == null){
				MyApp.defaultBtnCancel = MyApp.mdBaseView.options.btn_cancel;
			}
			if (MyApp.defaultBtnSubmit == null){
				MyApp.defaultBtnSubmit = MyApp.mdBaseView.options.btn_submit;
			}
			var btnCancel = MyApp.defaultBtnCancel;
			var btnSubmit = MyApp.defaultBtnSubmit;
			var opeTypeId = Utils.getFooterOpeType(MyApp.mode);
			if (MyApp.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL;
			} else if (MyApp.distrMode){
				btnCancel = {
					label: '戻る',
					action: function(){
						MyApp.trigger('goBackToItemClick');
					}
				};
				btnSubmit = true;
				if (MyApp.mode === 'mode_rel' ||
					MyApp.commentOnly || MyApp.isSave){
					opeTypeId = -1;
				}else{
					opeTypeId = [{
						opeTypeId: MyApp.OPETYPE_DISTR_APPLY,
						label: '設定'
					}];
				}
			}
			// ボタンの内容を設定して
			MyApp.mdBaseView.options.opeTypeId = opeTypeId;
			MyApp.mdBaseView.options.btn_submit = btnSubmit;
			MyApp.mdBaseView.options.btn_cancel = btnCancel;
			MyApp.mdBaseView.options.btn_csv = Utils.isPackApply();
			// 表示を変更
			MyApp.mdBaseView.renderFooterNavi();
		},

		// 振分を閉じる
		closeDistrView: function(){
			MyApp.distrView.close();
		},

		isPackApply: function(){
			var packView = this.getPackView();
			return packView && packView.isApply();
		}
	});

	var Utils = new Controller();

	MyApp.reqres.setHandlers({
		buildCSVInputReq: function(){
			var itemRec,
				pack = Utils.buildSubmitPackRec(),
				req = _.pick(pack, 'id', 'unitID', 'itgrpID',
							 'makerID', 'year', 'seasonTypeID',
							 'subSeasonTypeID', 'sizePtnID');
			// XXXX CSV種別って何?
			req.entryOrderSeq = pack.orderSeq;
			if (MyApp.distrMode){
				req.csvType = 2;
				itemRec = Utils.buildSubmitItemRec();
				req.csItemList = itemRec.csItemList;
			}else{
				req.csvType = 1;
				req.csItemList = [];
			}
			return {
				resId: clcom.pageId,
				data: {
					AMMSV0120CsvReq: req
				}
			};
		},

		getPackViewData: function(){
			var packView = Utils.getPackView();
			return packView.serialize();
		},

		// モデルを返す
		getModel: function(){
			return MyApp.model;
		},

		// 振分の列のID
		generateItemId: function(item){
			return item.makerItemCode + ':' +
				item.color.id + ':' +
				item.size.id;
		},

		// 振分レコードのID
		generateDistrId: function(item){
			return item.makerItemCode + ':' +
				item.colorID + ':' +
				item.sizeID + ':' +
				item.storeID;
		},

		// 振分レコードの商品ID
		generateDistrItemId: Utils.generateDistrItemId,

		// サイズパターンIDを返す
		sizeptnID: function(){
			var packView = Utils.getPackView();
			return packView.getSizePtnID();
		},

		// 品種IDを返す
		itgrpID: function(){
			return Utils.getPackView().getItgrpID();
		},

		// UnitIDを返す
		unitID: function(){
			var packView = Utils.getPackView(),
				unitID = packView.getUnitID();
			return unitID;
		},

		calcDistrSumQy: Utils.calcDistrSumQy,

		validDistrRecords: Utils.validDistrRecords,

		// 最終承認後かどうか
		isLastApply: function(){
			return MyApp.model.status.get('approveCount')>0;
		}
	});


	MyApp
		.listenTo(clutil.mediator, {
			// clutil.mediatorのイベント
			onOperation: function(opeType){
				if(opeType === am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV){
					if(MyApp.distrMode){
						Utils.exportDistrCsv();
					}else{
						Utils.exportItemCsv();
					}
				}
			},
			onMDSubmitCompleted: function(args){
				var itemView = Utils.getItemView(),
					packView = Utils.getPackView();
				if (args.status === 'DONE'){
					MyApp.isSaved = true;
					if (itemView){
						itemView.setReadonly();
					}
					if (packView){
						packView.setReadonly();
					}
					MyApp.submited = "1";	//MD-2072 商品発注兼振分_振分画面遷移時に登録ボタン有効化_調査依頼
				}else if (args.status === 'NG'){
					var fieldMessages = args.data.rspHead.fieldMessages;
					_.each(fieldMessages, function(fm){fm.lineno += 1});
					itemView.dataGrid.setSrvErrors(fieldMessages, 'itemList');
				}
			},

			onMDGetCompleted: function(args){
				var data = args.data,
					pageData = MyApp.pageArgs.chkData[args.index],
					getRsp = data.AMMSV0120GetRsp;

				MyApp.isSaved = false;

				if (args.status === 'NG'){
					// アボートしちゃう?
					// clutil.View.doAbort({
					// 	messages: [
					// 		// メッセージは?
					// 	],
					// 	rspHead: data.rspHead
					// });
					return;
				} else if (args.status !== 'OK') {
					MyApp.isSaved = true;
				}

				// 画面モードを決定する
				Utils.setMode(_.extend({
					opeTypeId: MyApp.opeTypeId,
					reapproveTypeID: pageData.reapproveTypeID
				}, getRsp.status));

				// フッタのボタンを決定する
				Utils.setFooterButtons();

				// 下部を閉じる
				MyApp.itemView.close();

				// 追加発注時は発注項目をクリアする
				if(MyApp.mode === 'mode_approve' &&
				   pageData.reapproveTypeID != amcm_type.AMCM_VAL_ITEM_REAPPROVE_ODADD){
					Utils.clearOrderField(getRsp);
				}
				MyApp.model = Utils.createGetRspModel(getRsp);
				MyApp.model.setReqHead(data.rspHead);

				// 上部
				MyApp.packView.show(new PackView({
					model: MyApp.model.pack
				}));
				// コメント
				Utils.showCommentView();

				Utils.getPackView().wait(function(){
					var packView = Utils.getPackView();
					// 決定状態にする
					packView.applyPack1();
					packView.wait(function(){
						clutil.focus({
							view: packView.$el,
							filter: function(el){
								return !$(el).is('a.file-input-wrapper');
							}
						});
					});
				});
			}
		})
		.listenTo(MyApp, {
			'change:sizePtnID': function(){
				// 商品レコードテーブルのサイズをクリアする
				console.log('change:sizePtnID');
				var itemView = Utils.getItemView();
				if (itemView){
					var data = itemView.dataGrid.getData();
					_.each(data, function(data){
						data.size.id = 0;
						data.size.name = '';
						data.size.code = '';
					});
					itemView.dataGrid.grid.invalidate();
				}
			},

			'initialize:before': function(){
				MyApp.addRegions({
					itemView: '#itemView',
					packView: '#packView',
					distrView: '#distrView',
					commentView: '#commentView'
				});
			},

			// 上部の決定ボタン押下
			applyPackAbove: function(){
				var packView = Utils.getPackView();
				packView.showPack2();
				packView.wait(function(){
					packView.setReadonly();

					// 店舗リストの取得
					Utils.fetchStoreList();
					// 商品レコードを表示
					Utils.showItemView();
					Utils.setFooterButtons();
				});
			},

			// 振分画面へ
			gotoDistr: function(){
				var packView = Utils.getPackView(),
					noCheck = MyApp.mode === 'mode_rel' ||
						MyApp.isSaved ||
						MyApp.commentOnly;

				if (!noCheck){
					Utils.beforeValid();
					// 商品一括レコードの検証
					if (!packView.isValid()){
						return;
					}
					// 商品レコードの検証
					if (!Utils.checkItemRecords()){
						return;
					}

					// 上代 >= 下代チェック
					if (Utils.getItemView().hasWarning){
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
						// XXXX 警告ってどうやるの?
						return;
					}

					// 売り切り年 >= 商品展開年以降のチェック
					if (!Utils.getPackView().isValidYear()){
						return;
					}
				}

				// 商品一括レコードをリードオンリーに設定
				packView.readonlyState = clutil.saveReadonlyState(packView.$el);
				clutil.viewReadonly(packView.$el, {
					filter: function(){
						var $this = $(this);
						if($this.hasClass('cl-file-attach') ||
						   $this.hasClass('ca_sample_download')){
							return false;
						}else{
							return true;
						}
					}
				});

				// 商品レコードの保存
				Utils.saveItemRecords();
				// 商品レコードを閉じる
				Utils.closeItemView();
				Utils.fixDistrRecords();
				// 復元できるように保存する
				Utils.storeDistr();
				// 振分テーブルを表示する
				Utils.showDistrView();
				// フッタボタンを設定する
				Utils.setFooterButtons();
			},

			// 商品レコード表示に戻る
			goBackToItem: function(){
				var packView = Utils.getPackView();

				// 閉じる
				Utils.closeDistrView();

				// 復元する
				Utils.restoreDistr();

				// 開く
				MyApp.distrMode = false;
				Utils.showItemView();

				// 商品一括レコードのリードオンリー状態を復元
				if (packView.readonlyState){
					clutil.viewRestoreState(packView.readonlyState);
					delete packView.readonlyState;
				}
				//MD-2072 商品発注兼振分_振分画面遷移時に登録ボタン有効化_調査依頼
				if( MyApp.submited == "1" ){
					$('div.submit_btn_group p').addClass('disable');	//submitボタングループ
					$('div.submit_btn_group a').attr('disabled','"disabled"');
					$('div.dl_btn_group p').addClass('disable');		//excel出力ボタングループ
					$('div.dl_btn_group a').attr('disabled','"disabled"');
				}
			}
		})
		.addInitializer(function(args){
			this.pageArgs = _.defaults(args.pageArgs||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				chkData: []
			});
			this.opeTypeId = this.pageArgs.opeTypeId;

			// 組織体系
			MyApp.orgfunc_id = Number(clcom.getSysparam(
				'PAR_AMMS_DEFAULT_ORG_FUNCID'));
			// 組織階層を取得
			MyApp.orglevel_id = Number(clcom.getSysparam(
				'PAR_AMMS_STORE_LEVELID'));
			// 事業ユニットID
			MyApp.unit_id = Number(clcom.userInfo.unit_id);

			if (!clcom.pushpop.popable){
				clcom._preventConfirm = true;
			}

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '商品発注兼振分',
				//subtitle: '登録・修正',
				pageCount: this.pageArgs.chkData.length,
				// とりあえず新規モード
				opeTypeId: this.opeTypeId,
				// btn_cancel: false,
				buildSubmitReqFunction: Utils.buildSubmitReq,
				buildGetReqFunction: function(opeTypeId, pageId){
					if (MyApp.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
						return;
					} else {
						return Utils.buildGetReq(opeTypeId, pageId);
					}
				},
				backBtnURL: clcom.pushpop.popable ? null : false,
				btn_cancel: clcom.pushpop.popable,
				btn_submit: clcom.pushpop.popable,
				confirmLeaving: true
			});
			this.mdBaseView.initUIElement();
			this.mdBaseView.render();

			if (this.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				// 新規以外
				this.mdBaseView.fetch();
			}else{
				// 新規モード
				MyApp.mode = 'mode_new';

				MyApp.model = Utils.createGetRspModel();
				// 上部
				var packView = new PackView({
					model: MyApp.model.pack
				});
				MyApp.packView.show(packView);
				packView.setReadonly();
				packView.wait(function(){
					clutil.focus({
						view: packView.$el,
						filter: function(el){
							return !$(el).is('a.file-input-wrapper');
						}
					});
				});
				Utils.showCommentView();
			}
		});

	MyApp.Utils = Utils;

	// ================
	// 開始
	$(function(){
		// Enterキーによるフォーカスをする。
		clutil.enterFocusMode();

		//--------------------------------------------------------------
		// 初期データ取得
		clutil.getIniJSON().done(function(){
			MyApp.start({
				pageArgs: clcom.pageArgs||{
					// chkData: [
					// 	{srchId:4},
					// 	{srchId:5},
					// 	{srchId:6},
					// 	{srchId:7},
					// 	{srchId:8},
					// 	{srchId:9}
					// ],
					// opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				}
			});
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

	MyApp.boo2 = function(){
		// var $el = $('#packView');
		// var v = clutil.validator($el, {echoback: $('.cl_echoback')});
		// console.log('*******', v.valid());
		MyApp.packView.currentView.isValid();
	};

	MyApp.boo1 = function(){
		clutil.postJSON('AMMSV0120', {
			reqHead: {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
			},
			reqPage: {},
			AMMSV0120GetReq: {
				srchID: 4
			},
			AMMSV0120UpdReq: {},
			AMMSV0120CsvReq: {}
		});
	};

	MyApp.boo3 = function(){
		MyApp.model.pack.set({
            "code": "",
            "dlvRoute1TypeID": "1",
            "itgrpID": 111,
			itgrpCode: '01',
			itgrpName: 'スーツ',
            "makerID": 1,
			makerCode: '0003',
			makerName: '（株）アイネックス東京店',
            "selloutSeasonID": "1",
            "unitID": "5",
            "seasonTypeID": "1",
            "year": "2014",
            "itemTypeID": "1",
            "orderNo": "",
            "usetypeID": "1",
            "subcls1ID": "1",
            "tagAddrNo": "0",
            "kiTypeID": "1",
            "tagIssueTypeID": "0",
            "selloutYear": "2014",
            "tagTypeID": "0",
            "approveDate": 20140628,
            "fixedFromTag2Code": "",
            "dlvRoute2TypeID": "2",
            "fixedFromTag1Code": "",
            "subSeasonTypeID": "0",
            "orderTgtTypeID": "1",
            "subcls2ID": "1",
            "maker": 1,
            "itoloxID": "0",
            "sizePtnID": "1",
            "tagIssueFlag": 0,
            "orderDate": ""
        });
		Utils.getPackView().deserialize();
	};
}(MyApp));
