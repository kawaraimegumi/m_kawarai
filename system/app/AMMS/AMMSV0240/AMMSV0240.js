$(function(){

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	clutil.enterFocusMode($('body'));
	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_table .btn-delete" : "_onDeleteLineClick",
			"click #ca_table tbody tr span.btn-add" : "_onAddLineBeforeClick",
			"click #ca_table tfoot tr:last" : "_onAddLineClick"
		},

		/**
		 * opt : clcom.pageArgs
		 */
		initialize: function(opt){

			_.bindAll(this);

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '組織体系マスタ',
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

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// それ以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});
			this.validator1 = clutil.validator($("#ca_headInfoArea"), {
				echoback : $('.cl_echoback')
			});
			this.validator2 = clutil.validator($("#ca_table_tbody"), {
				echoback : $('.cl_echoback')
			});

			clutil.cltxtFieldLimit($("#ca_orgfuncCode"));
			clutil.cltxtFieldLimit($("#ca_orgfuncName"));

			return this;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			return this;
		},

		render : function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				this.$("input[type='radio'][name='ca_basicFlag'][value='0']").attr("checked",true).closest("label").addClass("checked");
				this.$("#ca_orgfuncCode").attr("readonly", false);
				this.makeDefaultTable();
				clutil.setFocus(this.$("#ca_orgfuncCode"));
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}
			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				document.location = '#';
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this._tableDisable();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this._tableDisable();
				break;
			case 'DELETED':		// 別のユーザによって削除された
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this._tableDisable();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'OK':
				var getRsp = data.AMMSV0240GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					// 照会モードは、Edit ブロッキングしておく。
					clutil.viewReadonly(this.$("#ca_headInfoArea"));
					this._tableDisable();
				}
				break;
			case 'DONE':		// 確定済
				var getRsp = data.AMMSV0240GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this._tableDisable();
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				var getRsp = data.AMMSV0240GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this._tableDisable();
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				var getRsp = data.AMMSV0240GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this._tableDisable();
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				this._tableDisable();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		/**
		 * dataを表示
		 */
		_allData2View : function(getRsp){
			var ope_date = clcom.getOpeDate();
			var isRsvcancel = this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL;
			var isDelete = this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL;
			var tableDisable = isRsvcancel || isDelete;
			var $tbody = this.$("#ca_table_tbody");
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				this.$("#ca_orgfuncName").attr("readonly", false);
			}
			clutil.data2view(this.$('#ca_headInfoArea'), getRsp.orgfunc);
			this.$('#ca_headInfoArea input[type="radio"]').each(function(){
				_id = (this.name).replace("ca_", "");
				if(getRsp.orgfunc[_id] == $(this).val()){
					// 同じ値であるものにチェックをつける
					$(this).closest("label").addClass("checked", "checked");
				} else {
					$(this).closest("label").removeClass("checked");
				}
			});
			this.clearTable();
			// 組織階層データの下準備

			$.each(getRsp.orglevelList, function(){
				if(!this.orglevelTypeID){
					this.orglevelTypeID = this.storeLevelFlag;
				}

				this.storeLevelFlag = this.orglevelTypeID == amcm_type.AMCM_VAL_ORG_LEVEL_BU ? 1: 0;
				if(getRsp.orgfunc.basicFlag == 1){
					// 基本組織体系
					this.disEdit = this.orglevelTypeID != amcm_type.AMCM_VAL_ORG_LEVEL_OTHER ? 1: 0;
					this.disChk = true;
				} else {
					// 任意組織体系
					this.disEdit = false;
					this.disChk = true;
				}
				this.editable = !this.disEdit;
				this.canAdd = getRsp.orgfunc.basicFlag != 1 && !tableDisable;
				if (tableDisable){
					this.disEdit = this.disChk = true;
					this.editable = false;
				}
			});
			this.$("#ca_tbody_template").tmpl(getRsp.orglevelList).appendTo($tbody);

			clutil.initUIelement(this.$el);

			// 組織体系依存実装
			if (getRsp.orgfunc.basicFlag == 1){
				// 基本組織体系
				// ベース部分常に編集不可
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					$tbody.find('[name="orglevelName"]').attr("readonly", false);
				}
			} else {
				// 任意組織体系
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				} else if (isDelete || isRsvcancel){
					// ベース部分常に編集不可
					clutil.viewReadonly(this.$("#ca_headInfoArea"));
				}
			}

			// 編集時は[＋]ボタン常に押せない
			this.$("#ca_table").find("tfoot").hide();
//			if (getRsp.orgfunc.basicFlag != 1 && !tableDisable){
//				this.$("#ca_table").find("tfoot").show();
//			} else {
//				this.$("#ca_table").find("tfoot").hide();
//			}
			clutil.cltxtFieldLimitReset($("#ca_orgfuncCode"));
			clutil.cltxtFieldLimitReset($("#ca_orgfuncName"));

			// フォーカス制御
			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				clutil.setFocus(this.$("#ca_orgfuncCode"));
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
//				TODO:どこにおいとく？
//				clutil.setFocus($("#cl_submit"));
				break;
			default:
				break;
			}
			return this;
		},

		_tableDisable : function(){
			var $table = this.$("#ca_table");
			$table.find('input[type="text"]').attr("readonly", true);
			$table.find('input[type="checkbox"]').attr("disabled", true).closest("label").addClass("disabled");
			$table.find('tbody span.btn-delete').hide();
			$table.find('tbody span.btn-add').hide();
			$table.find('tfoot').hide();
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
//			var _this = this;
			this.clearTable();
			var $tbody = this.$("#ca_table_tbody"),
			$tmpl = this.$("#ca_tbody_template"),
			defArray = new Array,
			i = 0;

			for (;i < 10;i++){
				var obj = {
						editable:true,
						canAdd:true,
						disChk:true,
						disEdit:false
				};
				defArray.push(obj);
			}
			defArray[i-1].storeLevelFlag = true;
			$tmpl.tmpl(defArray).appendTo($tbody);
			this._reNum();
			clutil.initUIelement(this.$el);
			return this;
		},

		/**
		 * 行追加処理(一行上)
		 */
		_onAddLineBeforeClick : function(e) {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tr = $(e.target).closest("tr");
			var $tmpl = $("#ca_tbody_template");
			var addObj = {editable:true,canAdd:true,disChk:true,disEdit:false};
//			if (Number(this.$("input[name='ca_basicFlag']:checked").val()) === 1){
//				addObj.disChk = true;
//			}
			$tr.before($tmpl.tmpl(addObj));
			this._reNum();
			clutil.initUIelement(this.$el);
			return this;
		},
		/**
		 * 階層レベル振り直し
		 */
		_reNum : function(){
			var $input = this.$("#ca_table_tbody").find('input[name="levelNo"]');
			$input.each(function(i){
				$(this).val(i + 1);
			});
			return this;
		},
		/**
		 * 行追加処理(tfoot)
		 * 任意体系新規登録時のみ動作
		 */
		_onAddLineClick : function(e) {
			// 新規登録時のみ機能する
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
					|| this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
					|| this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = $("#ca_tbody_template");
			// 店舗階層訂正
			$tbody.find("label").removeClass("checked");
			$tbody.find('input[name="storeLevelFlag"]').attr("checked", false);
			// 常にチェックボックス編集不可
			var addObj = {storeLevelFlag:true,editable:true,canAdd:true,disChk:true,disEdit:false};
//			if (Number(this.$("input[name='ca_basicFlag']:checked").val()) === 1){
//				addObj.disChk = true;
//			}
			$tmpl.tmpl(addObj).appendTo($tbody);

			this._reNum();
			clutil.initUIelement(this.$el);

			return this;
		},

		/**
		 * 行削除処理
		 */
		_onDeleteLineClick : function(e) {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
					|| this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			$(e.target).parent().parent().remove();
			var $tbody = this.$("#ca_table_tbody");
			$tbody.find("label").removeClass("checked");
			$tbody.find('input[name="storeLevelFlag"]').attr("checked", false);
			$tbody.find("tr:last").find("label").addClass("checked");
			$tbody.find("tr:last").find('input[name="storeLevelFlag"]').attr("checked", true);
			this._reNum();
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			var isBasic = this.$('input[name="ca_basicFlag"]:checked').val() == 1;
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
					&& isBasic){
				clutil.mediator.trigger("onTicker", "基本組織体系は削除できません。");
				return null;
			}
			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			var updReq = {};
			/*
			 * 無効化チェック
			 */
			if ($("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}
			/*
			 * 入力値チェック 予約取消時はチェックしない
			 */
			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				// validation
				var f_error = false;
				this.validator.clear();
				isBasic = this.$('input[name="ca_basicFlag"]:checked').val() == 1;

				if(!this.validator1.valid()) {
					f_error = true;
				}
				if(f_error){
					return null; // ちょっと適当すぎますが
				}
				// 空行チェック
				var items = clutil.tableview2ValidData({
					$tbody: this.$("#ca_table_tbody"),
					validator: this.validator2,
					tailEmptyCheckFunc: function(item) { // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように
						if (!_.isEmpty(item.orglevelName)) {
							return false;
						} else {
							return true;
						}
					}
				});

				if (_.isEmpty(items)) {
			        // 全部空欄行だったとか・・・
			        clutil.mediator.trigger('onTicker',clmsg.EGM0024);
			        f_valid = false;
				}
				if(f_error){
					return null;
				}
				if (!isBasic) {
					var item = items[items.length-1];
					item.storeLevelFlag = 1;
				}

//				if(!this.validator2.valid()) {
//					f_error = true;
//				}
//				if(f_error){
//					return null;
//				}

				// 組織階層必須チェック
				if (items.length < 2) {
					this.validator.setErrorInfo({_eb_:clmsg.EMS0108});
					f_error = true;
				}
//				if($("#ca_table_tbody").find("tr").length < 2){
//					this.validator.setErrorInfo({_eb_:clmsg.EMS0108});
//					f_error = true;
//				}
				// 組織階層名必須チェック
//				var line_error = false;
//				$("#ca_table_tbody").find(".orglevelName").each(function(){
//					if($(this).val() === ""){
//						this.validator2.setErrorMsg($(this), clmsg.cl_required);
//						line_error = true;
//					}
//				});
//				if (line_error){
//					f_error = true;
//				}


				if(f_error){
					return null;
				}

				var head = clutil.view2data(this.$('#ca_headInfoArea'));
				//var list = clutil.tableview2data(this.$('#ca_table_tbody').children());
				var list = items;
				head.fromDate = 19900101;
				head.toDate = clcom.max_date;

				// listへhead情報の適応
				if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
						|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					$.each(list, function(){
						this.fromDate = head.fromDate;
						this.toDate = head.toDate;
						this.orgfuncID = head.orgfuncID;
						if (isBasic){
							if (this.orglevelTypeID === ""){
								this.storeLevelFlag = amcm_type.AMCM_VAL_ORG_LEVEL_OTHER;
								this.orglevelTypeID = amcm_type.AMCM_VAL_ORG_LEVEL_OTHER;
							} else {
								this.storeLevelFlag = this.orglevelTypeID;
							}
						} else {
							if (this.orglevelTypeID == amcm_type.AMCM_VAL_ORG_LEVEL_BU){
								if (this.storeLevelFlag){
									this.storeLevelFlag = amcm_type.AMCM_VAL_ORG_LEVEL_BU;
								} else {
									this.storeLevelFlag = amcm_type.AMCM_VAL_ORG_LEVEL_OTHER;
									this.orglevelTypeID = amcm_type.AMCM_VAL_ORG_LEVEL_OTHER;
								}
							} else if (this.orglevelTypeID == amcm_type.AMCM_VAL_ORG_LEVEL_OTHER){
								if (this.storeLevelFlag){
									this.storeLevelFlag = amcm_type.AMCM_VAL_ORG_LEVEL_BU;
									this.orglevelTypeID = amcm_type.AMCM_VAL_ORG_LEVEL_BU;
								} else {
									this.storeLevelFlag = amcm_type.AMCM_VAL_ORG_LEVEL_OTHER;
								}
							} else /*if (this.orglevelTypeID === "") */{
								this.storeLevelFlag = this.storeLevelFlag ? amcm_type.AMCM_VAL_ORG_LEVEL_BU : amcm_type.AMCM_VAL_ORG_LEVEL_OTHER;
								this.orglevelTypeID = this.storeLevelFlag == amcm_type.AMCM_VAL_ORG_LEVEL_BU ? amcm_type.AMCM_VAL_ORG_LEVEL_BU : amcm_type.AMCM_VAL_ORG_LEVEL_OTHER;
							}
						}
					});
				}

				updReq = {
						orgfunc : head,
						orglevelList : list
				};
			} else {
				updReq = this.viewSeed;
			}
			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var reqObj = {
					reqHead : reqHead,
					AMMSV0240UpdReq  : updReq
			};
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 取引先マスタ検索リクエスト
				AMMSV0240GetReq: {
					srchID: this.options.chkData[pgIndex].id,			// 取引先ID
					srchDate: this.options.chkData[pgIndex].fromDate,	// 適用開始日
					delFlag : this.options.chkData[pgIndex].delFlag		// 削除(参照)フラグ
				},
			};

			return {
				resId: clcom.pageId,	//'AMMSV0320',
				data: getReq
			};
		},

		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
			var rec = data.AMMSV0240GetRsp;
			delete rec.orgfunc.recno;
			delete rec.orgfunc.state;
			delete rec.orgfunc.fromDate;
			delete rec.orgfunc.toDate;
			$.each(rec.orglevelList, function(){
				delete this.fromDate;
				delete this.toDate;
				delete this.orglevelCode;
			});
			return data;
		}
	});

	// 初期データを取る
	clutil.getIniJSON(null, null).done(function(data, dataType) {
		ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
	}).fail(function(data){
		// clcom のネタ取得に失敗。
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});
});
