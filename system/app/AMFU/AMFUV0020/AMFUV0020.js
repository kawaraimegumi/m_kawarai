// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	clutil.enterFocusMode($('body'));

	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
//			"click #ca_table .btn-delete" : "_onDeleteLineClick",
//			"click #ca_table tfoot tr:last" : "_onAddLineClick",
//			"blur input[name='makerItgrpCode']"	: "_onmakerItgrpCodeLineBlur"	//メーカー品種から商品名等を検索
			'click #ca_sample_download'		:	'_onSampleDLClick',		// ExcelサンプルDLボタン押下
			'click .cl_download'			:	'_onCSVClick',			// Excelデータ出力押下
		},

		// grid内イベント
		clGridEvents : {
			'footer:addNewRow': function(gridView){
				// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
				var newItem = {
						itgrp :  {
							id : 0,
							name : "",
							code : ""
						},
						maker :  {
							id : 0,
							name : "",
							code : ""
						},
						makerItgrpCode : "",
						itemID : 0,
						itemCode : "",
						itemName : "",
						itemState : null,
						color : {
							id : 0,
							name : "",
							code : "",
							colorItem : {
								id : 0,
								name : "",
								code : ""
							},
						},
//						colorItemID : 0,
//						colorItemCode : "",
//						colorItemName : "",
						subcls1ID : 0,
						subcls1Code : "",
						subcls1Name : "",
						subcls1Disp : "",
						subcls2ID : 0,
						subcls2Code : "",
						subcls2Name : "",
						subcls2Disp : "",
						itemFrom : 0,
						itemTo : 0,
						am : "",

						editChk : {
							baseEditable : true,
							itemFromIsEditable : true,
							itemToIsEditable : true,
							amIsEditable : true
						}
				};
				gridView.addNewItem(newItem);
			},
			'cell:change': function(e){
				console.log('*** cell:change', e);

				// 商品取得エラーチェック(★)
				if (e.cell === 2){
					this.dataGrid.isValidCell(e.item, 'makerItgrpCode');
				}
			}
		},

		itemList : {}, //インセンティブ商品部データ
		listNum : 0,
		uri : "AMFUV0020",
		initialize: function(opt){
			_.bindAll(this);
			var _this = this;
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid',
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ。
			});
			this.listenTo(this.dataGrid, this.clGridEvents);

			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			// カラーセレクタ表示用のstatus保持
			this.viewStatus = "OK";
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: 'インセンティブ',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					btn_csv: true,
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}
//			clutil.mediator.on('onOperation', this._doOpeAction);	// CSV出力用

			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLmakerItemCodeCompleted', this._onCLmakerItgrpCodeComplete);

			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$("#ca_headInfoArea"), {
				echoback : $('.cl_echoback')
			});

			clutil.datepicker(this.$("#ca_fromDate"));
			clutil.datepicker(this.$("#ca_toDate"));

			clutil.cltxtFieldLimit($("#ca_fundName"));

			this.graph = new clutil.Relation.DependGraph()
			.add({
				id: 'itgrp',
				depends: ['unit.id'],
				onDependChange: function(e){
					e.model.set('itgrp', {id : 0, code:"", name:""});
				}
			})
			.add({
				id: 'maker',
//				depends: ['unit.id'],
				onDependChange: function(e){
					e.model.set('maker', {id : 0, code:"", name:""});
				}
			})
			.add({
				id: 'makerItgrpCode',
				depends: ['maker.id', 'itgrp.id'],
				onDependChange: function(e){
					e.model.set('makerItgrpCode', '');
				}
			})
			.add({
				id: 'itemName',
				depends: ['maker.id', 'itgrp.id', 'makerItgrpCode'],
				onDependChange: function(e){
					var makerItgrp_code = e.model.get('makerItgrpCode'),
						itgrp_id = e.model.get('itgrp.id'),
						maker_id = e.model.get('maker.id');

					var fail = function(error){
						e.model.set({
							itemID: 0,
							itemCode: '',
							itemName: '',

							subcls1ID: 0,
							subcls1Code: '',
							subcls1Name: '',
							subcls1Disp: '',

							subcls2ID: 0,
							subcls2Code: '',
							subcls2Name: '',
							subcls2Disp: '',
							MICodeError : error
						});
					};

					if (makerItgrp_code && maker_id){
						var done = e.async();

						clutil.clmakeritemcode2item({
							maker_code: makerItgrp_code,
							itgrp_id: itgrp_id,
							maker_id: maker_id
						})
							.done(function(data){
								if (data.head.status){
									fail(clmsg[data.head.message]);
									return;
								}

								var rec  = data.rec;
								e.model.set({
									itemID: rec.itemID,
									itemCode: rec.itemCode,
									itemName: rec.itemName,

									subcls1ID: rec.sub1ID,
									subcls1Code: rec.sub1Code,
									subcls1Name: rec.sub1Name,
									subcls1Disp: rec.sub1Code.substr(-2) + ":" + rec.sub1Name,

									subcls2ID: rec.sub2ID,
									subcls2Code: rec.sub2Code,
									subcls2Name: rec.sub2Name,
									subcls2Disp: rec.sub2Code.substr(-2) + ":" + rec.sub2Name,
									MICodeError : null
								});
							})
							.fail(function(){fail('失敗');})
							.always(done);
					}else{
						fail();
					}
				}
			})
			.add({
				id: 'color.id',
				depends: ['itemID'],
				onDependChange: function(e){
					e.model.set({
						'color.id' : 0,
						'color.name' : '',
						'color.code' : '',
//						'colorItemID' : 0,
//						'colorItemCode' : ''
						'color.colorItem.id' : 0,
						'color.colorItem.code' : '',
					});
				}
			});

			this.opeDate = clcom.getOpeDate();
			// 境界チェックの日付（年月）を求める。
			this.cmpDate = function(ymd){
				var year = Math.floor(ymd / 10000);
				var month = Math.floor(ymd / 100) % 100;
				var day = ymd % 100;
				if(day < 16){
					// 前月に倒す
					if((--month) <= 0){
						// 12-1月 跨ぎ
						month = 12;
						--year;
					}
				}
				return (year * 100) + month;
			}(this.opeDate);

			// 事業ユニット取得
			return clutil.clbusunitselector(this.$('#ca_unitID')).on("change", function(attrs, value, options){
				if(!options.changedByUI){
					return;
				}
				var data =_this.dataGrid.getData();
				if(data.length > 0){
					$.each(data, function(){
						this.itgrp = {id : 0, code:"", name:""};
						this.makerItgrpCode = "";
						this.itemID = 0;
						this.itemCode = '';
						this.itemName = '';

						this.subcls1ID = 0;
						this.subcls1Code = '';
						this.subcls1Name = '';
						this.subcls1Disp = '';

						this.subcls2ID = 0;
						this.subcls2Code = '';
						this.subcls2Name = '';
						this.subcls2Disp = '';
//						this.color = {id : 0, code:"", name:""};
						this.color = {
							id : 0,
							code:"",
							name:"",
							colorItem : {
								id : 0,
								code:"",
							}
						};
//						this.colorItemID = 0;
//						this.colorItemCode = "";
						this.MICodeError = 0;
					});
				}
				_this.dataGrid.setData({data:data});
			});
		},

		initUIelement : function(){
			var _this = this;
			clutil.inputlimiter(this.$el);
			this.mdBaseView.initUIElement();
			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				btn: this.$('#ca_csv_uptake'),
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					var request = {
						AMFUV0020UpdReq: {
							fundRec : clutil.view2data(this.$("#ca_headInfoArea"))
						}
					};

					return {
						resId: 'AMFUV0020',
						data: request
					};
				}, this),

				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(this.validator.valid, this.validator)
				}
			});
			this.opeCSVInputCtrl.on('fail', _.bind(function(data){
				if(data.rspHead.fieldMessages){
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}
				if (data.rspHead.uri){
					clutil.download(data.rspHead.uri);	//CSVダウンロード実行
				}
			}, this));
			this.opeCSVInputCtrl.on('done', function(data){
				var getRsp = data.AMFUV0020GetRsp;
				_this.viewSeed = getRsp;
				var data = _this.buildGridData(getRsp, true);
				_this.renderTable(data);
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで
			$("#ca_tp_code").tooltip({html: true});
			return this;
		},

		render : function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				this.$("#ca_fromDate").datepicker("setIymd", clcom.getOpeDate());
				this.$("#ca_toDate").datepicker("setIymd", clcom.getOpeDate());
				this.makeDefaultTable();
				clutil.setFocus(this.$("#ca_fromDate"));
			} else {
				this.mdBaseView.fetch();
			}
			return this;
		},

		/**
		 * 指定日の翌月締日を取得
		 * @param ymd 年月日
		 */
		getNextMonthCloseDay: function(ymd) {
			var y = Math.floor(ymd / 10000);
			var m = Math.floor(ymd / 100) % 100;

			m++;
			if (m > 12) {
				m = 1;
				y++;
			}
			var d = 15;
			return y * 10000 + m * 100 + d;
		},

		/**
		 * getreq作成
		 * @param opeTypeId
		 * @param pgIndex
		 * @returns {___anonymous5050_5115}
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var getReq = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				AMFUV0020GetReq: {
					srchFundID: this.options.chkData[pgIndex].fundID,
				},
			};

			return {
				resId: "AMFUV0020",//clcom.pageId,
				data: getReq
			};
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			this.viewStatus = args.status;
			switch(args.status){
			case 'OK':
				var getRsp = data.AMFUV0020GetRsp;
				this.viewSeed = getRsp;
				this.$("form > a.cl-file-attach").attr("disabled",false);
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					this._editableCtrl(getRsp);
				}
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
					this.$("#ca_fundId").val("");
					this.$("#ca_fundCode").val("");
					this.$("#ca_state").val("");
					this.dataGrid.setEditable(true);
				}
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL || this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					clutil.viewReadonly(this.$("#ca_headInfoArea"));
					this.$("form > a.cl-file-attach").attr("disabled", true);
					this._tableDisable();
				}
				clutil.setFocus(this.$("#ca_fromDate"));
				break;
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMFUV0020GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this.$("form > a.cl-file-attach").attr("disabled",true);
				this._tableDisable();
				break;
			default:
			case 'NG':			// その他エラー。
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this.$("form > a.cl-file-attach").attr("disabled",true);
				this._tableDisable();
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				clutil.mediator.trigger("onTicker", data);
//				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
//			clutil.cltxtFieldLimitReset(this.$("#ca_fundName"));
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				document.location = '#';
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					this.options.chkData[args.index].fundID = args.data.AMFUV0020GetRsp.fundRec.fundId;
				}
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this.$("form > a.cl-file-attach").attr("disabled",true);
				this._tableDisable();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this.$("form > a.cl-file-attach").attr("disabled",true);
				this._tableDisable();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {prefix: 'ca_'});
				clutil.mediator.trigger("onTicker", data);
				break;
			}
		},

		_allData2View : function(getRsp){
//			var _this = this;
			var rec = getRsp.fundRec;
			this._initView(); // こっそり初期化
			clutil.data2view(this.$("#ca_headInfoArea"), rec);

			//grid化
			var data = this.buildGridData(getRsp);
			this.renderTable(data);
		},

		// fundItemList⇒gridのdata変換
		buildGridData : function(getRsp, fromCSV){
			var _this = this;
			var rec = getRsp.fundRec;
			var list = getRsp.fundItemList;
			var gridData = [];
			var tmplist = clutil.dclone(list);
			var buildChkFlag = true;

			if(fromCSV){
				buildChkFlag = false;
			}

			$.each(tmplist, function(){
				var obj = {
						itgrp :  {
							id : this.itgrpID,
							name : this.itgrpName,
							code : this.itgrpCode
						},
						maker :  {
							id : this.makerID,
							name : this.makerName,
							code : this.makerCode
						},
						makerItgrpCode : this.makerItgrpCode,
						MICodeError : 0,
						itemID : this.itemID,
						itemCode : this.itemCode,
						itemName : this.itemName,
						itemState : this.itemState,
						color : {
							id : this.colorID,
							name : this.colorName,
							code : this.colorCode,
							colorItem : {
								id : this.colorItemID,
								code : this.colorItemCode,
								name : ""
							}
						},
//						colorItemID : this.colorItemID,
//						colorItemCode : this.colorItemCode,
//						colorItemName : this.colorItemName,
						subcls1ID : this.subcls1ID,
						subcls1Code : this.subcls1Code.substr(-2),
						subcls1Name : this.subcls1Name,
						subcls1Disp : this.subcls1Code.substr(-2) + ":" + this.subcls1Name,
						subcls2ID : this.subcls2ID,
						subcls2Code : this.subcls2Code.substr(-2),
						subcls2Name : this.subcls2Name,
						subcls2Disp : this.subcls2Code.substr(-2) + ":" + this.subcls2Name,
						itemFrom : this.itemFrom,
						itemTo : this.itemTo,
						am : this.am,
						editChk : buildChkFlag ? _this.buildEditChk(rec, this) : {
							baseEditable : true,
							itemFromIsEditable : true,
							itemToIsEditable : true,
							amIsEditable : true
						}
				};
				gridData.push(obj);
			});
			return gridData;
		},
		// gridのdata⇒fundItemList変換
		buildFundItemList: function(data){
			var list = [];
			var tmpdata = clutil.dclone(data);
			$.each(tmpdata, function(){
				var obj = {
						_cl_gridRowId : this._cl_gridRowId,
						itgrpID		: this.itgrp ? this.itgrp.id : 0,
						itgrpName	: this.itgrp ? this.itgrp.name : "",
						itgrpCode	: this.itgrp ? this.itgrp.code : "",
						makerID		: this.maker ? this.maker.id : 0,
						makerName	: this.maker ? this.maker.name : "",
						makerCode	: this.maker ? this.maker.code : "",
						makerItgrpCode	: this.makerItgrpCode,
						itemID		: this.itemID,
						itemCode	: this.itemCode,
						itemName	: this.itemName,
						itemState	: this.itemState,
						colorID		: this.color ? this.color.id : 0,
						colorCode	: this.color ? this.color.code : "",
						colorName	: this.color ? this.color.name : "",
//						colorItemID		: this.colorItemID,
//						colorItemCode	: this.colorItemCode,
//						colorItemName	: this.colorItemName,
						colorItemID		: this.color.colorItem ? this.color.colorItem.id : 0,
						colorItemCode	: this.color.colorItem ? this.color.colorItem.code : "",
						subcls1ID	: this.subcls1ID,
						subcls1Code	: this.subcls1Code,
						subcls1Name	: this.subcls1Name,
						subcls2ID	: this.subcls2ID,
						subcls2Code	: this.subcls2Code,
						subcls2Name	: this.subcls2Name,
						itemFrom	: this.itemFrom,
						itemTo		: this.itemTo,
						am			: this.am,
						editChk 	: this.editChk
				};
				if (!(obj.itgrpID == 0
						&& obj.makerID == 0
						&& obj.makerItgrpCode == ""
						&& obj.itemID == 0
						&& obj.colorItemID == 0
						&& obj.itemFrom == 0
						&& obj.itemTo == 0
						&& obj.am == "")){
					list.push(obj);
				};
			});
			return list;
		},

		_initView : function(){
			this.clearTable();
//			this.$("#ca_table").find('tfoot').show();
			clutil.viewRemoveReadonly(this.$("#ca_headInfoArea"));
			this.$("#ca_fundCode").attr("readonly", true);
		},

		buildEditChk : function(head, rec){
			var chk =  {
					baseEditable : true,
					itemFromIsEditable : true,
					itemToIsEditable : true,
					amIsEditable : true
				};
			if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				return  chk;
			}

			var thisDay = this.opeDate;
			var insDate = head.insDate;
			var toDate = head.toDate;
			var thisMonth = clutil.monthFormat(thisDay, "yyyymm");
			var insMonth = clutil.monthFormat(insDate, "yyyymm");
			var toMonth = clutil.monthFormat(toDate, "yyyymm");
			var cmpDate = this.cmpDate;

//			// 登録月が前月以降
//			if (insMonth < thisMonth){
//				chk.baseEditable = false;
//				chk.itemFromIsEditable = false;
//				// 明細部
//				if (cmpDate != insMonth){// 修正期間中の先月登録データでない
//					chk.amIsEditable = false;
//				}
//				var iToDate = rec.itemTo;
//				var iToMonth = clutil.monthFormat(iToDate, "yyyymm");
//				if(iToMonth < thisMonth){
//					chk.itemToIsEditable = false;
//				};
//			} else {
//				// 自由
//			};
			if(insMonth >= thisMonth){
				// 編集可
			} else if (insMonth >= cmpDate){
				// 編集可
			} else if (toMonth >= cmpDate){
				// 編集可（期間のみ）
				chk.baseEditable = false;
				chk.itemFromIsEditable = false;
				chk.amIsEditable = false;
			} else {
				// 締済
				chk.baseEditable = false;
				chk.itemFromIsEditable = false;
				chk.itemToIsEditable = false;
				chk.amIsEditable = false;
			}
			return chk;

		},

		// 編集可能エリアの制御
		_editableCtrl: function(getRsp){
			var rec = getRsp.fundRec;
//			var list = getRsp.fundItemList;
//			var $tbody = this.$("#ca_table_tbody");
//			var $fromDate = this.$("#ca_fromDate");
//			var fromDate = rec.fromDate;
//			var fromDateMonth = clutil.monthFormat(fromDate, "yyyymm");
			var $toDate = this.$("#ca_toDate");
			var toDate = rec.toDate;
			var toDateMonth = clutil.monthFormat(toDate, "yyyymm");
			var thisMonth = clutil.monthFormat(this.opeDate, "yyyymm");
			var insDate = rec.insDate;
			var insMonth = clutil.monthFormat(insDate, "yyyymm");
			var cmpDate = this.cmpDate;

			this.$("#ca_fAfter").attr("disabled", true).closest("label").addClass("disabled");
			clutil.initUIelement(this.$("#ca_headInfoArea"));

//			if (insMonth < thisMonth){
//				// ヘッダ部
//				clutil.viewReadonly(this.$("#ca_headInfoArea"));
//				this.$("form > a.cl-file-attach").attr("disabled",true);
//				if(toDateMonth >= thisMonth){// 先月登録データで終了日今月以降なら期間編集可能
//					clutil.viewRemoveReadonly($toDate.closest("div"));
//				};
//				// 明細部
//				this.dataGrid.setEnableForRowCtrl(false);
//			} else {
//				this.$("form > a.cl-file-attach").attr("disabled", false);
//				this.dataGrid.setEnableForRowCtrl(true);
//				// 自由
//			};
			if(insMonth >= thisMonth){
				// 編集可
				this.$("form > a.cl-file-attach").attr("disabled", false);
				this.dataGrid.setEnableForRowCtrl(true);
			} else if (insMonth >= cmpDate){
				// 編集可
				this.$("form > a.cl-file-attach").attr("disabled", false);
				this.dataGrid.setEnableForRowCtrl(true);
			} else if (toDateMonth >= cmpDate){
				// 編集可（期間のみ）
				// ヘッダ部
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this.$("form > a.cl-file-attach").attr("disabled",true);
				clutil.viewRemoveReadonly($toDate.closest("div"));
				// 明細部
				this.dataGrid.setEnableForRowCtrl(false);
			} else {
				// 締済
				// ヘッダ部
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this.$("form > a.cl-file-attach").attr("disabled",true);
				// 明細部
				this.dataGrid.setEnableForRowCtrl(false);
			}

		},

		/**
		 * テーブルクリア
		 */
		clearTable : function() {
			$("#ca_table_tbody tr").remove();
		},

		/**
		 * 新規作成時にデフォルト空欄表示
		 */
		makeDefaultTable: function(){
			this.clearTable();
			var list = [];
			var i = 0;
			for (;i < 10; i++){
				list.push({
					itgrp :  {
						id : 0,
						name : "",
						code : ""
					},
					maker :  {
						id : 0,
						name : "",
						code : ""
					},
					makerItgrpCode : "",
					MICodeError : 0,
					itemID : 0,
					itemCode : "",
					itemName : "",
					itemState : null,
					color : {
						id : 0,
						name : "",
						code : "",
						colorItem : {
							id : 0,
							name : "",
							code : "",
						},
					},
//					colorItemID : 0,
//					colorItemCode : "",
//					colorItemName : "",
					subcls1ID : 0,
					subcls1Code : "",
					subcls1Name : "",
					subcls1Disp : "",
					subcls2ID : 0,
					subcls2Code : "",
					subcls2Name : "",
					subcls2Disp : "",
					itemFrom : 0,
					itemTo : 0,
					am : "",

					editChk : {
						baseEditable : true,
						itemFromIsEditable : true,
						itemToIsEditable : true,
						amIsEditable : true
					}
				});
			}
			this.renderTable(list);
			return this;
		},

		renderTable: function(data){
			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,		// 高さに対して仮想化するため、インナースクロールを入れる。
					frozenRow: 1,			// 行固定：本来は自動的にヘッダ列数計算しているはずだが、効かない？？？
					frozenColumn : 2,
				},
				columns: this.getColumns(),
				data: data,
				rowDelToggle: false,
				graph: this.graph
			});
		},

		_tableDisable : function(){
			this.dataGrid.grid.getEditorLock().cancelCurrentEdit();
			this.dataGrid.setEditable(false);
			this.dataGrid.setEnableForRowCtrl(false);
		},

		/**
		 * サンプルファイルダウンロード
		 */
		_onSampleDLClick: function() {
			var sampleURL = "/public/sample/インセンティブ対象商品サンプル.xlsx";
			clutil.download(sampleURL);
		},

		/**
		 * フッター押下
		 */
		_doOpeAction: function(rtyp, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV
				this.doDownload();
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// 新規登録時何もしない
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				return;
			}

			// リクエストをつくる
			var fundId = $("#ca_fundId").val();
			var getReq = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
				},
				reqPage: {
				},
				// インセンティブ登録・修正検索リクエスト
				AMFUV0020GetReq: {
					srchFundID: fundId,	// インセンティブID
				},
				// インセンティブ登録・修正更新リクエスト -- 今は検索するので、空を設定
				AMFUV0020UpdReq: {
				},
			};

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMFUV0020', getReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * ダウンロードする
		 */
		_onCSVClick: function(){
			// editモードをかりとる
			this.dataGrid.stopEditing();

			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMFUV0020', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * ダウンロード条件をつくる
		 */
		buildReq: function(){
			var head = clutil.view2data($("#ca_headInfoArea"));
			var fundItemList = this.dataGrid.getData({ delflag: false });

			var sendList =[];
			var f_last = true;

			for(var i=fundItemList.length-1; i>=0; i--){
				var data = fundItemList[i];
				var f_send = false;
				if(f_last == false){
					f_send = true;
				}

				// 品種ID、メーカーID、商品ID、商品コード、カラーID、期間、金額のいずれかがあれば送信リスト入り
				if(data.itgrp != "" && data.itgrp != null && data.itgrp != undefined){
					if(data.itgrp.id != "" && data.itgrp.id != null
							&& data.itgrp.id != 0 && data.itgrp.id != undefined){
						f_send = true;
					}
				}
				if(data.maker != "" && data.maker != null && data.maker != undefined){
					if(data.maker.id != "" && data.maker.id != null
							&& data.maker.id != 0 && data.maker.id != undefined){
						f_send = true;
					}
				}
				if(data.itemFrom != "" && data.itemFrom != null && data.itemFrom != 0 && data.itemFrom != undefined){
					f_send = true;
				}
				if(data.itemTo != "" && data.itemTo != null && data.itemTo != 0 && data.itemTo != undefined){
					f_send = true;
				}
				if(data.am != "" && data.am != null && data.am != undefined){
					f_send = true;
				}

				if(f_send == true){
					f_last = false;
					var obj = {
							itgrpID		: data.itgrp ? data.itgrp.id : 0,
							itgrpName	: data.itgrp ? data.itgrp.name : "",
							itgrpCode	: data.itgrp ? data.itgrp.code : "",
							makerID		: data.maker ? data.maker.id : 0,
							makerName	: data.maker ? data.maker.name : "",
							makerCode	: data.maker ? data.maker.code : "",
							makerItgrpCode	: data.makerItgrpCode,
							itemID		: data.itemID,
							itemCode	: data.itemCode,
							itemName	: data.itemName,
							itemState	: data.itemState,
							colorID		: data.color ? data.color.id : 0,
							colorCode	: data.color ? data.color.code : "",
							colorName	: data.color ? data.color.name : "",
							colorItemID		: data.color.colorItem ? data.color.colorItem.id : 0,
							colorItemCode	: data.color.colorItem ? data.color.colorItem.code : "",
							subcls1ID	: data.subcls1ID,
							subcls1Code	: data.subcls1Code,
							subcls1Name	: data.subcls1Name,
							subcls2ID	: data.subcls2ID,
							subcls2Code	: data.subcls2Code,
							subcls2Name	: data.subcls2Name,
							itemFrom	: data.itemFrom,
							itemTo		: data.itemTo,
							am			: data.am,
					};
					sendList.unshift(obj);
				}
			}
			console.log(sendList);

			// 検索条件
			var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					AMFUV0020GetReq: {
					},
					AMFUV0020UpdReq: {
						fundRec : head,
						fundItemList : sendList
					}
			};
			return req;
		},

		/**
		 * 登録データ作成
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex) {
			var updReq = {};
			/*
			 * 無効化チェック
			 */
			if (this.$("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}
			this.validator.clear();
			this.dataGrid.stopEditing();
			/*
			 * 入力値チェック 削除時はチェックしない
			 */
			if (this.options.opeTypeId  !== am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				// validation
				var f_error = false;
				if(!this.validator.valid()) {
					f_error = true;
				}
				this.dataGrid.clearCellMessage();
			    var tailIsEmptyFunc = function(dto){
			    	return ((_.isEmpty(dto.itgrp) || dto.itgrp.id === 0)
			        		&& ( !dto.maker || _.isEmpty(dto.maker) || dto.maker.id === 0)
			        		&& dto.makerItgrpCode == ""
			        		&& dto.itemID == 0
//			        		&& dto.colorItemID == 0
			        		&& dto.color.colorItem.id == 0
			        		&& dto.itemFrom == 0
			        		&& dto.itemTo == 0
			        		&& dto.am == "");
			    };

				if(!this.dataGrid.isValid({tailEmptyCheckFunc : tailIsEmptyFunc})){
					clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
					f_error = true;
				}
				// 期間反転チェック
				var chkInfo = [];
				chkInfo.push({
					stval : 'ca_fromDate',
					edval : 'ca_toDate'
				});
				if(!this.validator.validFromTo(chkInfo)){
					f_error = true;
				}
				if(f_error){
					return null;
				}

				/*
				 * パケット作成
				 */
				var head = clutil.view2data(this.$('#ca_headInfoArea'));
				var gridData = this.dataGrid.getData();
				var list = this.buildFundItemList(gridData);

				if(list == null || list.length == 0){
					clutil.mediator.trigger('onTicker', "対象商品を一つは設定してください");
					return null;
				}
				if(list.length > 1000){
					clutil.mediator.trigger('onTicker', "登録行数上限(1000件)を超えています。");
					return null;
				}
				var _this = this;
				$.each(list, function(i){
					if(this.itemID == 0 && this.colorItemID == 0){
						_this.dataGrid.setCellMessage(this._cl_gridRowId, 'makerItgrpCode', "error", "入力されたメーカー品番に対応する商品が存在しません。");
//						_this.validator.setErrorMsg(_this.$("#ca_table_tbody tr:nth-child(" + (i + 1) + ") input[name='makerItgrpCode']"), "入力されたメーカー品番に対応する商品が存在しません。");
						clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
						f_error = true;
					}
				});
				if (f_error){
					return null;
				}

				// item重複チェック
				if(!this.isCorrectItem(list)){
					return null;
				}

				/*************
				 * chkstdate 日付のチェック
				 *************/
				if(!this.isCorrectDate(list)){
					return null;
				}


				$.each(list, function(){
					delete this.editChk;
				});

				updReq = {
						fundRec : head,
						fundItemList : list
				};
			} else {
				updReq = this.viewSeed;
			}

			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			if(this.options.opeTypeId  === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}
			var reqObj = {
					reqHead : reqHead,
					AMFUV0020UpdReq  : updReq,
			};

			return {
//				resId : clcom.pageId,
				resId : "AMFUV0020",
				data: reqObj
			};
		},

		/**
		 * item重複がないかチェック
		 */
		isCorrectItem: function(list){
			var _this = this;
			var isCorrect = true;
			var listLen = list.length;
			if (listLen == 0){
				return false;
			} else if (listLen == 1){
				return true;
			} else {
				$.each(list, function(i,v){
					var itgrpID = this.itgrpID;
					var makerID = this.makerID;
					var makerItgrpCode = this.makerItgrpCode;
					var colorID = this.colorID;
					for(var j = i+1; j < listLen; j++){
						if (list[j].itgrpID == itgrpID && list[j].makerID == makerID && list[j].makerItgrpCode == makerItgrpCode){
							if ((list[j].colorID == 0 || colorID == 0) || list[j].colorID == colorID){
								_this.dataGrid.setCellMessage(this._cl_gridRowId, 'color', "error", clutil.fmtargs(clmsg.EMS0065, ["対象商品"]));
								_this.dataGrid.setCellMessage(list[j]._cl_gridRowId, 'color', "error", clutil.fmtargs(clmsg.EMS0065, ["対象商品"]));
								clutil.mediator.trigger("onTicker",  "データに重複があります");
								isCorrect = false;
							}
						}
					}
				});
			}
			return isCorrect;
		},

		/**
		 * 日付設定が正しいかチェック
		 */
		isCorrectDate: function(list){
			var _this = this;
			var f_error = false;
			var $fromDate = this.$("#ca_fromDate");
			var fromDate = clutil.dateFormat($fromDate.val(), "yyyymmdd");
			var fromDateMonth = clutil.monthFormat(fromDate, "yyyymm");
			var $toDate = this.$("#ca_toDate");
			var toDate = clutil.dateFormat($toDate.val(), "yyyymmdd");
			var toDateMonth = clutil.monthFormat(toDate, "yyyymm");
			var thisDay = clcom.getOpeDate();
			var thisMonth = clutil.monthFormat(thisDay, "yyyymm");
			var insDate = clcom.getOpeDate();
			var insMonth = clutil.monthFormat(insDate, "yyyymm");
//			var $trs = this.$("#ca_table tbody").find("tr");
			// ヘッダ期間チェック
			if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){

				// 新規登録時(含コピーモード)
				var isAfter = this.$("#ca_fAfter").attr("checked");
				if(isAfter){
					// 遡及登録時はtoDateは前月以前である
					if (toDateMonth >= thisMonth){
						this.validator.setErrorMsg($toDate, "遡及登録時は前月以前を設定してください");
						clutil.mediator.trigger('onTicker', "遡及登録時、インセンティブ期間終了日は前月以前のみ設定可能です");
						f_error = true;
					}
				} else {
					// 通常時はfromDateは当月かそれ以降である
					if (fromDateMonth < thisMonth){
						this.validator.setErrorMsg($fromDate, "当月以降を設定してください");
						clutil.mediator.trigger('onTicker', "インセンティブ期間開始日は当月以降のみ設定可能です");
						f_error = true;
					}
				}
			} else {
				// 編集時
				insDate = this.viewSeed.fundRec.insDate;
				insMonth = clutil.monthFormat(insDate, "yyyymm");
				var isAfter = this.$("#ca_fAfter").attr("checked");
				if(isAfter){
					// 遡及登録時はtoDateは登録月の前月以前である
					if (toDateMonth >= insMonth){
						this.validator.setErrorMsg($toDate, "遡及登録時は登録月の前月以前を設定してください");
						clutil.mediator.trigger('onTicker', "遡及登録時、インセンティブ期間終了日は登録月の前月以前のみ設定可能です");
						f_error = true;
					}
				} else {
					// fromDateが編集可能な時、fromDateが最初に登録を行った月以降である
					if (fromDateMonth < insMonth){
						this.validator.setErrorMsg($fromDate, "最初に登録を行った月以降を設定してください");
						clutil.mediator.trigger('onTicker', "インセンティブ期間開始日は最初に登録を行った月以降のみ設定可能です");
						f_error = true;
					}
					// toDateが編集可な時、toDateが当月かそれ以降である
					if (insMonth < thisMonth
							&& !($toDate.attr("disabled") || $toDate.attr("disabled")) && (toDateMonth < thisMonth)){
						this.validator.setErrorMsg($toDate, "当月以降を設定してください");
						clutil.mediator.trigger('onTicker', "インセンティブ期間終了日は当月以降のみ設定可能です");
						f_error = true;
					}
				}
			}
			if (f_error){
				return false;
			}

			// 明細部各期間チェック
			$.each(list, function(i){
//				var trVal = clutil.tableview2data($tr)[0];
//				var $iFromDate = $(this).find('input[name="itemFrom"]');
//				var iFromDate = trVal.itemFrom;
//				var $iToDate = $(this).find('input[name="itemTo"]');
//				var iToDate = trVal.itemTo;
				if (_.isEmpty(this.itgrpID)
						&& _.isEmpty(this.makerID)
						&& this.makerItgrpCode == ""
						&& this.itemID == null
						&& this.colorItemID == null
						&& this.colorID == null
						&& this.itemFrom == null
						&& this.itemTo == null
						&& this.am == ""){
					return true;
				}
				if (this.itemFrom > this.itemTo){
					_this.dataGrid.setCellMessage(this._cl_gridRowId, 'itemFrom', "error", clmsg.cl_date_error);
					_this.dataGrid.setCellMessage(this._cl_gridRowId, 'itemTo', "error", clmsg.cl_date_error);
					f_error = true;
				};
				if (this.itemFrom < fromDate){
					_this.dataGrid.setCellMessage(this._cl_gridRowId, 'itemFrom', "error", "ヘッダ情報のインセンティブ期間内に設定してください");
					f_error = true;
				};
				if (toDate < this.itemTo){
					_this.dataGrid.setCellMessage(this._cl_gridRowId, 'itemTo', "error", "ヘッダ情報のインセンティブ期間内に設定してください");
					f_error = true;
				};

				// 以下 if(){}中は明細データの延長をチェック
				if (_this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
						&& insMonth < thisMonth
						&& this.editChk.itemToIsEditable){
					var recitemTo = (function(list, obj){
						var rec ={};
						$.each(list, function(){
							if(this.itemID == obj.itemID && this.colorItemID == obj.colorItemID){
								rec = this;
								return false;
							}
						});
						return rec.itemTo;
					})(_this.viewSeed.fundItemList, {
						itemID : this.itemID, 			//$tr.find('input[name="itemID"]').val(),
						colorItemID : this.colorItemID	//$tr.find('input[name="colorItemID"]').val()
					});
					if ((recitemTo != this.itemTo) && clutil.monthFormat(this.itemTo, "yyyymm") < thisMonth){
						_this.dataGrid.setCellMessage(this._cl_gridRowId, 'itemTo', "error", "変更する場合は当月以降を設定してください");
//						_this.validator.setErrorMsg($iToDate, "変更する場合は当月以降を設定してください");
						f_error = true;
					}
				}
			});
			if (f_error){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return false;
			}
			return true;
		},

		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
			delete data.AMFUV0020UpdRsp;
			delete data.rspHead;
			delete data.rspPage;
			var rec = data.AMFUV0020GetRsp;
			delete rec.fundRec.fromDate;
			delete rec.fundRec.toDate;
			$.each(rec.fundItemList, function(){
				delete this.itemState;
				delete this.colorCode;
				delete this.colorName;
				delete this.itgrpCode;
				delete this.itgrpName;
				delete this.makerCode;
				delete this.makerName;
				delete this.subcls1Code;
				delete this.subcls1Name;
				delete this.subcls2Code;
				delete this.subcls2Name;
			});
			return data;
		},

		// grid行設定
		getColumns: function(){
//			var _this = this;
			var columns = [
				{
					id : 'itgrp',
					name: '品種',
					field: 'itgrp',
					width: 150,
					cellType: {
						type: 'clajaxac',
						validator : "required",
						editorOptions: {
							funcName: 'varietycode',
							dependAttrs: function(){
								return {
									unit_id : Number($("#ca_unitID").val())
								};
							}
						},
						validator: 'required',
						isEditable: function(item){
							if (item && item.editChk && item.editChk.baseEditable){
								return !!Number($("#ca_unitID").val());
							}
							return false;
						}
					}
				},
				{
					id : 'maker',
					name: 'メーカー',
					field: 'maker',
					width: 180,
					cellType: {
						type: 'clajaxac',
						validator : "required",
						editorOptions: {
							funcName: 'vendorcode',
							dependAttrs: function(){
								return {
									vendor_typeid: amcm_type.AMCM_VAL_VENDOR_MAKER
								};
							}
						},
						isEditable: function(item){
							return (item && item.editChk && item.editChk.baseEditable);
						}
					}
				},
				{
					id : 'makerItgrpCode',
					name: 'メーカー品番',
					field: 'makerItgrpCode',
					width: 130,
					cellType: {
						type: 'text',
						validator: ['required', 'hankaku', 'len:1,10', function(){return this.item.MICodeError;}],
						limit: 'hankaku len:10',
						isEditable: function(item){
							if (item && item.editChk && item.editChk.baseEditable){
								return !!((item && item.maker && item.maker.id)
										&& (item && item.itgrp && item.itgrp.id));
							}
							return false;
						}
					}
				},
				{
					id : 'subcls1',
					name: 'サブクラス1',
					field: 'subcls1Disp',
					cssClass: 'fntss',
					width: 180
				},
				{
					id : 'subcls2',
					name: 'サブクラス2',
					field: 'subcls2Disp',
					cssClass: 'fntss',
					width: 180
				},
				{
					id : 'item',
					name: '商品名',
					field: 'itemName',
					cssClass: 'fntss',
					width: 180
				},
				{
					id : 'color',
					name: 'カラー',
					field: 'color',
					width: 160,
					cellType: {
						type: 'clajaxselector',
						formatter: function(value, options){
							if (options.dataContext && !options.dataContext.itemID){
								return "";
							}
							if (!value || !value.id) {
								return 'すべて';
							} else {
								return ClGrid.Formatters.codename(value, options);
							}
						},
						editorOptions: function(item){
							return {
								funcName: 'color',
								emptyLabel:"すべて",
								dependAttrs: {
									itemID: item.itemID
								}
							};
						},
						isEditable: function(item){
							if (item && item.editChk && item.editChk.baseEditable){
								return Boolean(item && item.itemID);
							}
							return false;
						}
					}
				},
				{
					id : 'itemFrom',
					name: 'インセンティブ期間(開始)',
					field: 'itemFrom',
					width: 170,
					cellType: {
						type: 'date',
						validator : "required",
						validatorClass: "require",
						isEditable: function(item){
							return !!(item && item.editChk && item.editChk.itemFromIsEditable);
						}
					}
				},
				{
					id : 'itemTo',
					name: 'インセンティブ期間(終了)',
					field: 'itemTo',
					width: 170,
					cellType: {
						type: 'date',
						validator : "required",
						validatorClass: "require",
						isEditable: function(item){
							return !!(item && item.editChk && item.editChk.itemToIsEditable);
						}

					}
				},
				{
					id : 'am',
					name: '金額',
					field: 'am',
					cssClass : 'txtalign-right',
					width: 120,
					cellType: {
						type: 'text',
//						validator : 'required',
//						limit: 'int2 len:9',
						validator: ['required', 'len:1,9', 'uint'],
//						limit: 'uint len:9',
						formatFilter: 'comma',
						validatorClass: "require",
						isEditable: function(item){
							return !!(item && item.editChk && item.editChk.amIsEditable);
						}
					}
				}
			];
			return columns;
		},

		_eof : ""
	});



	// 初期データを取る
	clutil.getIniJSON(null, null).done(_.bind(function(data, dataType){
		ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
	}, this)).fail(_.bind(function(data){
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	}, this));
});
