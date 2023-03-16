// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	clutil.enterFocusMode($('body'));

	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			'change #ca_unitID'		: '_onUpperSeedChange',
			'change #ca_cntlType'	: '_onCntlTypeChange',
			"click #ca_table .btn-delete" : "_onDeleteClick",
			"click #ca_table tfoot tr:last" : "_onAddClick"
		},

		uri : "AMDSV0140",
		initialize: function(opt){
			_.bindAll(this);
			var _this = this;

			// ネタ自動検索してほしくないときに立てる
			this.NotNeedFlag = false;
			this.viewSeed = {}; // 初期化
			this.DefOrgFuncId = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
			this.StoreLevelId = Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'));

			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '自動振分制御マスタ',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
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

			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$("#ca_headInfoArea"), {
				echoback : $('.cl_echoback')
			});
//			/*
//			 * 自動振分制御区分
//			 */
//			AMCM_TYPE_AUTODISTCNTL: 276,
//			AMCM_VAL_AUTODISTCNTL_NORMAL: 1,	// 通常
//			AMCM_VAL_AUTODISTCNTL_TERM: 2,		// 期間別
			// TODO:自動制御区分:選択肢設定
			clutil.cltypeselector(this.$("#ca_cntlType"), amcm_type.AMCM_TYPE_AUTODISTCNTL, 1, 1);
			clutil.datepicker(this.$("#ca_stDate"));
			clutil.datepicker(this.$("#ca_edDate"));

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_itgrpID",
				}
			},{
				dataSource: {
					orgfunc_id: this.DefOrgFuncId,
				}
			});




			var deff = $.when(this.fieldRelation);
			return deff.done(_.bind(function(){
				console.log(this.fieldRelation);
			}, this));
		},

		initUIelement : function(){
			clutil.initUIelement(this.$el);
			this.mdBaseView.initUIElement();
			return this;
		},

		render : function(){
			this.mdBaseView.render();
			this._onCntlTypeChange();
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
			} else {
				this.mdBaseView.fetch();
			}
			return this;
		},

		/**
		 * buildGetReq
		 * 振分データリクエスト作成
		 * @param opeTypeId
		 * @param pgIndex
		 * @returns {___anonymous4997_5047}
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var getReq = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				AMDSV0140GetReq: {
					srchID : this.options.chkData[pgIndex].controlID
				},
			};

			return {
				resId: "AMDSV0140",
				data: getReq
			};
		},

		/**
		 * GetCompleted
		 * 振分データ取得後
		 * @param args
		 * @param e
		 */
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			this.initView();
			var data = args.data;
			var getRsp = data.AMDSV0140GetRsp;
			switch(args.status){
			case 'OK':
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp).always(_.bind(function(){
					// 編集・複製・削除・参照
					if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
						this.$("#ca_unitID, #ca_itgrpID").attr("disabled", true);
						this.$("#ca_unitID").selectpicker("refresh");
						clutil.setFocus(this.$("#ca_cntlType"));
					}
					if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
						this.$("#ca_unitID").attr("disabled", true);
						this.$("#ca_unitID").selectpicker("refresh");
						this.$("#ca_cntlID").val(null);
						clutil.setFocus(this.$("#ca_itgrpID"));
					}
					if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
							||this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
						this.allViewReadonly();
					}
				}, this));
				break;
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp).always(_.bind(function(){
					this.allViewReadonly();
				},this));
				break;
			default:
			case 'NG':			// その他エラー。
				this.allViewReadonly();
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				clutil.mediator.trigger("onTicker", data);
				break;
			}
		},

		initView : function(){
			clutil.viewRemoveReadonly(this.$("#ca_headInfoArea"));
			this.$("#ca_table_tbody").find("tr").remove();
			this.$("#ca_table_tfoot").show();
		},

		/**
		 * allViewReadonly
		 * 画面を全て編集不可にする
		 */
		allViewReadonly : function(){
			clutil.viewReadonly(this.$("#ca_headInfoArea"));
			this._tableDisable();
		},

		/**
		 * _onMDSubmitCompleted
		 * 更新終了後
		 * @param args
		 * @param e
		 */
		_onMDSubmitCompleted: function(args, e){
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				document.location = '#';
				this.allViewReadonly();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				this.allViewReadonly();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {prefix: 'ca_'});
				clutil.mediator.trigger("onTicker", data);
				break;
			}
		},

		/**
		 * data2view
		 * 振分IDで検索したデータGetRspからの生成
		 * @param getRsp
		 */
		data2view : function(getRsp){
			var _this = this;
//			getRsp.record.unitID = this.options.unitID;
//			getRsp.record.itgrpID = this.options.itgrpID;
			getRsp.record._view2data_itgrpID_cn = {
					id : getRsp.record.itgrpID,
					code : getRsp.record.itgrpCode,
					name : getRsp.record.itgrpName
			};
			$.each(getRsp.record.wkDateList, function(i,v){
				getRsp.record["wkDate" + (i+1)] = v;
			});
//			$.each(getRsp.wkDateStList, function(i,v){
//				getRsp["wkDateSt" + i] = this;
//			});
			// TODO:テーブル処理
			var dfd = $.Deferred();
			var tRecs = this.makeTableRecords(getRsp);
			this.NotNeedFlag = true;
			clutil.mediator.once("data2view:done", function(){
				// TODO:テーブルを表示
				_this.NotNeedFlag = false;
				_this.setTable(tRecs);
				_this._onCntlTypeChange();
				dfd.resolve();
			});
			clutil.data2view(this.$("#ca_headInfoArea"), getRsp.record);
			return dfd.promise();
		},

		makeTableRecords : function(getRsp){
			var sRecs = getRsp.storeRecord;
			var tRecs = [];
			$.each(sRecs, function(){
				var obj = {
						storeID : this.storeID,
						_view2data_storeID_cn : {
							id : this.storeID,
							code : this.storeCode,
							name : this.storeName
						},
//						fTarget : this.fTarget,
						wkDate1 : this.wkDateList[0],
						wkDate2 : this.wkDateList[1],
						wkDate3 : this.wkDateList[2],
						wkDate4 : this.wkDateList[3],
						wkDate5 : this.wkDateList[4],
						wkDate6 : this.wkDateList[5],
						wkDate7 : this.wkDateList[6]
				};
				tRecs.push(obj);
			});
			return tRecs;
		},

		setTable : function(tRecs){
			_this = this;
			// 店舗検索用パラメータ

			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = this.$("#ca_table_tmpl");
			$tbody.find("tr").remove(); // 初期化
			$.each(tRecs, function(){
				$tmpl.tmpl().appendTo($tbody);
				var $tr = $tbody.find("tr:last");
				_this._setLine($tr, this);
			});
			clutil.initUIelement(this.$("#ca_table"));
		},

		addTable : function(e){
			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = this.$("#ca_table_tmpl");
			var newRec = {
					storeID : 0,
					_view2data_storeID_cn : {
						id : 0,
						code : "",
						name : ""
					},
//					fTarget : 0,
					wkDate1 : 0,
					wkDate2 : 0,
					wkDate3 : 0,
					wkDate4 : 0,
					wkDate5 : 0,
					wkDate6 : 0,
					wkDate7 : 0
			};
			$tmpl.tmpl().appendTo($tbody);
			var $tr = $tbody.find("tr:last");
			this._setLine($tr, newRec);
			clutil.initUIelement(this.$("#ca_table"));
		},

		_setLine : function($tr, data){
			var _this = this;
			var P_ORG = Number(_this.$("#ca_unitID").val());
			var $storeID = $tr.find('input[name="storeID"]');
			clutil.clorgcode({
				el:$storeID,
				dependAttrs :{
					orgfunc_id : _this.DefOrgFuncId,
					orglevel_id : _this.StoreLevelId,
					p_org_id : P_ORG
				},
				getOrgFuncId: function(){return _this.DefOrgFuncId;},
				getOrgLevelId: function(){return _this.StoreLevelId;}
			});//.done(_.bind(function(){
				$tr.find('input[name="storeID"]').autocomplete("clAutocompleteItem", data._view2data_storeID_cn);
//				$tr.find('input[name="fTarget"]').attr("checked", data.fTarget === 1);
				$tr.find('input[name="wkDate1"]').attr("checked", data.wkDate1 === 1);
				$tr.find('input[name="wkDate2"]').attr("checked", data.wkDate2 === 1);
				$tr.find('input[name="wkDate3"]').attr("checked", data.wkDate3 === 1);
				$tr.find('input[name="wkDate4"]').attr("checked", data.wkDate4 === 1);
				$tr.find('input[name="wkDate5"]').attr("checked", data.wkDate5 === 1);
				$tr.find('input[name="wkDate6"]').attr("checked", data.wkDate6 === 1);
				$tr.find('input[name="wkDate7"]').attr("checked", data.wkDate7 === 1);
//			}));
		},

//		AMCM_TYPE_DAY_OF_WEEK: 68,
//		AMCM_VAL_DAY_OF_WEEK_MON: 1,		// 月曜日
//		AMCM_VAL_DAY_OF_WEEK_TUE: 2,		// 火曜日
//		AMCM_VAL_DAY_OF_WEEK_WED: 3,		// 水曜日
//		AMCM_VAL_DAY_OF_WEEK_THU: 4,		// 木曜日
//		AMCM_VAL_DAY_OF_WEEK_FRI: 5,		// 金曜日
//		AMCM_VAL_DAY_OF_WEEK_SAT: 6,		// 土曜日
//		AMCM_VAL_DAY_OF_WEEK_SUN: 7,		// 日曜日

		/** テーブルクリア **/
		tableClear : function() {
			this.$("#ca_table_tbody").find("tr").remove();
		},

		/** テーブル編集不可 **/
		_tableDisable : function(){
			this.$("#ca_table_tbody").find('input[type="text"]').attr("readonly", true);
			this.$("#ca_table_tbody").find('input[type="checkbox"]').attr("disabled", true).parent().addClass("disabled");
			this.$("#ca_table_tbody").find(".btn-delete").hide();
			this.$("#ca_table_tfoot").hide();
		},

		/**
		 * 登録データ作成
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex) {
			var updReq = {};
			this.validator.clear();
			/*
			 * 無効化チェック
			 */
			if (this.$("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}
			/*
			 * 入力値チェック 削除時はチェックしない
			 */
			if (this.options.opeTypeId  !== am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				// validation
				var f_error = false;
				this.validator.clear();

				if(!this.validator.valid()) {
					f_error = true;
				}

				if(f_error){
					return null;
				}

				/*************
				 * chkstdate 日付のチェック
				 *************/
				// 本日以前の登録不可
				if(this.$("#ca_cntlType").val() == amcm_type.AMCM_VAL_AUTODISTCNTL_TERM){
					var ope_date = clcom.getOpeDate();
					var $stDate = this.$("#ca_stDate");
					var stDate = clutil.dateFormat($stDate.val(), "yyyymmdd");
					var recstDate = null;

//					if (this.options.chkData !== undefined && this.options.chkData.length > 0){
//						recstDate = this.viewSeed.record.stDate;
//					}
					if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
						recstDate = this.viewSeed.record.stDate;
					}
					console.log(recstDate);

					switch(this.options.opeTypeId){
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
						if (stDate <= ope_date) {
							// 開始日が運用日以前の場合はエラー
							this.validator.setErrorHeader(clmsg.EGM0047);
							this.validator.setErrorMsg($stDate, clmsg.EGM0047);
							f_error = true;
						}
						break;

					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
						if (stDate <= ope_date && stDate != recstDate){ // // 設定開始日が明日以降かつ編集前開始日以降でない
							this.validator.setErrorHeader(clmsg.EGM0047);
							this.validator.setErrorMsg($stDate, clmsg.EGM0047);
							f_error = true;
						}
						break;

					default:
						break;
					}
					if(f_error){
						return null;
					}
				}
				// 期間反転チェック
				var chkInfo = [];
				chkInfo.push({
					stval : 'ca_stDate',
					edval : 'ca_edDate'
				});
				if(!this.validator.validFromTo(chkInfo)){
					f_error = true;
				}

				if(f_error){
					clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
					return null;
				}

				updReq = this.view2UpdReq();

				if (updReq == null){
					return null;
				}
				// 店舗重複チェック
				if(!this.isCorrectItem(updReq.storeRecord)){
					return null;
				}
			}

			var reqHead = {
					opeTypeId : this.options.opeTypeId
			};
			if(this.options.opeTypeId  === am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			if (this.options.opeTypeId  == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				updReq = this.viewSeed;
			}
			var reqObj = {
					reqHead : reqHead,
					AMDSV0140UpdReq  : updReq
			};

			return {
				resId : "AMDSV0140",
				data: reqObj
			};
		},


		/**
		 * 表示から更新データ作成
		 */
		view2UpdReq : function(){
			var headRec = clutil.view2data(this.$("#ca_headInfoArea"));
			var wkDateList = [0,0,0,0,0,0,0];
			var i = 1;
			for (;i < 8;i++){
				wkDateList[i-1] = headRec["wkDate"+ i];
				delete headRec["wkDate"+ i];
			}
			headRec.wkDateList = wkDateList;
//			var sRecs = clutil.tableview2data(this.$("#ca_table_tbody").children());
			var sRecs = clutil.tableview2ValidData({
				$tbody : this.$('#ca_table_tbody'),
				validator : this.validator,
				tailEmptyCheckFunc : function(data){
					return data.storeID == null
						&& data.wkDate1 == 0
						&& data.wkDate2 == 0
						&& data.wkDate3 == 0
						&& data.wkDate4 == 0
						&& data.wkDate5 == 0
						&& data.wkDate6 == 0
						&& data.wkDate7 == 0;
				}
			});
			if(sRecs == null){
				return null;
			}

			var storeRecord = [];
			var wkDateStList = [0,0,0,0,0,0,0];
			$.each(sRecs, function(){
				var list = [Number(this.wkDate1),
				              Number(this.wkDate2),
				              Number(this.wkDate3),
				              Number(this.wkDate4),
				              Number(this.wkDate5),
				              Number(this.wkDate6),
				              Number(this.wkDate7)];
				$.each(list, function(i,v){
					if(v === 1){
						wkDateStList[i] = 1;
					}
				});
				storeRecord.push({
					wkDateList : [Number(this.wkDate1),
					              Number(this.wkDate2),
					              Number(this.wkDate3),
					              Number(this.wkDate4),
					              Number(this.wkDate5),
					              Number(this.wkDate6),
					              Number(this.wkDate7)],
					storeID : this.storeID,
//					fTarget : this.fTarget
				});
//				var i = 1;
//				for(i; i < 8;i++){
//					if(this["wkDate" + i] === 1){
//						wkDateStList[i-1] = 1;
//						storeRecord.push({
//							wkDate : i,
//							storeID : this.storeID,
//							fTarget : this.fTarget
//						});
//					}
//				}
			});
			headRec.wkDateStList = wkDateStList;
			var updReq = {
					record : headRec,
					storeRecord : storeRecord
			};
			return updReq;
		},

		/**
		 * item重複がないかチェック
		 */
		isCorrectItem: function(list){
			var _this = this;
			var isCorrect = true;
			var listLen = list.length;
			if (listLen == 0
					|| listLen == 1){
				return true;
			} else {
				$.each(list, function(i,v){
					var storeID = this.storeID;
					for(var j = i+1; j < listLen; j++){
						if (list[j].storeID == storeID){
							_this.validator.setErrorMsg(_this.$("#ca_table_tbody tr:nth-child(" + (i + 1) + ") input[name='storeID']"), clutil.fmtargs(clmsg.EMS0065, ["対象店舗"]));
							_this.validator.setErrorMsg(_this.$("#ca_table_tbody tr:nth-child(" + (j + 1) + ") input[name='storeID']"), clutil.fmtargs(clmsg.EMS0065, ["対象店舗"]));
							clutil.mediator.trigger("onTicker",  "データに重複があります");
							isCorrect = false;
						}
					}
				});
			}
			return isCorrect;
		},

		/**
		 * ヘッダ部上位リレーション変更時
		 */
		_onUpperSeedChange : function(){
			if(this.NotNeedFlag){
				return;
			}
			this.tableClear();
		},

		_onDeleteClick : function(e){
			$tr = $(e.target).closest("tr");
			$tr.remove();
		},

		_onAddClick : function(e){
			this.addTable(e);
		},

//		/*
//		 * 自動振分制御区分
//		 */
//		AMCM_TYPE_AUTODISTCNTL: 276,
//		AMCM_VAL_AUTODISTCNTL_NORMAL: 1,		// 通常
//		AMCM_VAL_AUTODISTCNTL_TERM: 2,		// 期間別
		_onCntlTypeChange : function(){
			if(this.$("#ca_cntlType").val() == amcm_type.AMCM_VAL_AUTODISTCNTL_TERM){
				this.$("#ca_stDate").addClass("cl_required").parent(".fieldUnit").addClass("required");
				this.$("#ca_edDate").addClass("cl_required").parent(".fieldUnit").addClass("required");
				this.$(".ca_term_div").show();
			} else {
				this.$("#ca_stDate").removeClass("cl_required").parent(".fieldUnit").removeClass("required");
				this.$("#ca_edDate").removeClass("cl_required").parent(".fieldUnit").removeClass("required");
				this.$("#ca_stDate").datepicker("setIymd");
				this.$("#ca_edDate").datepicker("setIymd");
				this.$(".ca_term_div").hide();
			}
		},

		// TODO:データ整理
		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
//			var rec = data.AMDSV0140GetRsp;
//			delete rec.sizeRecords;
//			delete rec.storeInfoRecords;
			return data;
		},

		_eof : "end of mainView"
	});



	// 初期データを取る
	clutil.getIniJSON(null, null).done(_.bind(function(data, dataType){
		ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
		clutil.setFocus(ca_editView.$("#ca_unitID"));
	}, this)).fail(_.bind(function(data){
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHeader: data.rspHeader
		});
	}, this));
});
