$(function(){

	clutil.enterFocusMode($('body'));
	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click .ca_file_DL" : "_onfileDLClick",
			"click .ca_file_delete" : "_onfileDeleteClick"
		},

		// 開店日等表示対応
		MINYMD : 19700101,

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
					title: '店舗情報',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					buildGetReqFunction: this._buildGetReqFunction,
					buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			clutil.cltypeselector(this.$("#ca_storeTypeID"), amcm_type.AMCM_TYPE_STORE, 1, 1);

			return this;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();

			// minDateを1900年から可能とする
			clutil.datepicker(this.$("#ca_openDate"), {min_date : this.MINYMD}).datepicker("setIymd");
			clutil.datepicker(this.$("#ca_closeDate"), {min_date : this.MINYMD}).datepicker("setIymd");
			clutil.datepicker(this.$("#ca_posSetupDate")).datepicker("setIymd");
			clutil.datepicker(this.$("#ca_posStopDate")).datepicker("setIymd");
			clutil.inputReadonly(this.$(".cl_date"));

			var successChange = function(file, $div){
				var $btn = $div.find("a.cl-file-attach");
				var html = '<a href="javascript:void(0)" class="ca_file_DL" target="_blank">'+ file.filename +'</a>';
				//clutil.MessageDialog2('取込が完了しました。');
				clutil.MessageDialog2('取込完了しました。画面下部の登録ボタンを押下して確定してください。');
				$btn.attr("disabled", true);
				$div.find("span").data({"file":file}).html(html);
				$div.find("span").attr("data-original-title", file.filename);
				$div.find("span").tooltip({html: true});
//				$btn.parent().parent().find(".ca_file_DL").attr("disabled", false).end().find(".ca_file_delete").attr("disabled", false);
				$btn.parent().parent().find(".ca_file_delete").attr("disabled", false);
			};

			var fileUploadView1 = clutil.View.buildFileUploadButtonView(this.$("#ca_fileUp_btn1"));
			fileUploadView1.on('success', _.bind(function(file){
				var $div = this.$("#ca_view1").parent();
				successChange(file, $div);
			}, this));

			var fileUploadView2 = clutil.View.buildFileUploadButtonView(this.$("#ca_fileUp_btn2"));
			fileUploadView2.on('success', _.bind(function(file){
				var $div = this.$("#ca_view2").parent();
				successChange(file, $div);
			}, this));

			var fileUploadView3 = clutil.View.buildFileUploadButtonView(this.$("#ca_fileUp_btn3"));
			fileUploadView3.on('success', _.bind(function(file){
				var $div = this.$("#ca_view3").parent();
				successChange(file, $div);
			}, this));

			var fileUploadView4 = clutil.View.buildFileUploadButtonView(this.$("#ca_fileUp_btn4"));
			fileUploadView4.on('success', _.bind(function(file){
				var $div = this.$("#ca_view4").parent();
				successChange(file, $div);
			}, this));

			var fileUploadView5 = clutil.View.buildFileUploadButtonView(this.$("#ca_fileUp_btn5"));
			fileUploadView5.on('success', _.bind(function(file){
				var $div = this.$("#ca_view5").parent();
				successChange(file, $div);
			}, this));

			this.$("form").addClass("flleft");
			return this;
		},

		render : function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			this.mdBaseView.fetch();	// データを GET してくる。
			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				clutil.viewReadonly(this.$el);
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
				var getRsp = data.AMMSV0500GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				break;
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				var getRsp = data.AMMSV0500GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				clutil.viewReadonly(this.$el);
				break;
			default:
			case 'NG':			// その他エラー。
				clutil.viewReadonly(this.$el);
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		/**
		 * dataを表示
		 */
		_allData2View : function(getRsp){
			var _this = this;
			// 初期化
			this.$(".ca_torikomi_div").each(function(){
				var $this = $(this);
				$this.find("span").html("").removeData("file").removeAttr("data-original-title").next().removeData("fileState");
				$this.find("form > a.cl-file-attach").attr("disabled",false);
				$this.find(".ca_file_delete").attr("disabled",true);
			});

			if(getRsp.rec.vendorCode1){
				getRsp.rec.vendorDisp1 = getRsp.rec.vendorCode1 + ":" + getRsp.rec.vendorName1;
			} else {
				getRsp.rec.vendorDisp1 = "";
			}
			if(getRsp.rec.vendorCode2){
				getRsp.rec.vendorDisp2 = getRsp.rec.vendorCode2 + ":" + getRsp.rec.vendorName2;
			} else {
				getRsp.rec.vendorDisp2 = "";
			}
			if(getRsp.rec.openingTime == 0){
				getRsp.rec.openingTime = "";
			}
			if(getRsp.rec.closingTime == 0){
				getRsp.rec.closingTime = "";
			}
			if(getRsp.rec.businessHoursIrregularFlag == 0){
				getRsp.rec.businessHoursIrregularFlag = "";
			}
			clutil.data2view(this.$("#ca_storeInfo"), getRsp.rec);
			$.each(getRsp.fileList, function(i){
				var $span = _this.$("#ca_view" + (i+1));
				var $div = $span.parent();
				var html = '<a href="javascript:void(0)" class="ca_file_DL" target="_blank">' + this.layoutfileName + '</a>';
				$span.html(html).data("file",{id:this.layoutfileID, filename:this.layoutfileName, uri:this.layoutfileURL});
				$span.attr("data-original-title", this.layoutfileName);
				$div.find("span").tooltip({html: true});
				$span.next().data("fileState", {recno:this.recno, state:this.state});
				$div.find("form > a.cl-file-attach").attr("disabled", true).end().find(".ca_file_delete").attr("disabled", false);
			});
			// operation別制御
			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				clutil.setFocus(this.$("button.cl-file-attach:first"));
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				this.$("form > a.cl-file-attach").attr("disabled", true);
//				this.$(".ca_file_DL").attr("disabled", false);
				this.$(".ca_file_delete").attr("disabled", true);
//				TODO:どこにおいとく？
//				clutil.setFocus($("#cl_submit"));
				break;
			default:
				break;
			}
			return this;
		},


		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			var updReq = {};
			/*
			 * 無効化チェック
			 */
			if ($("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}
			/*
			 * 入力値チェック
			 */
			// validation
			var f_error = false;
			this.validator.clear();

//			if(!this.validator.valid()) {
//				f_error = true;
//			}
			if(f_error){
				return null; // TODO:なにかある？
			}


			var list = [];
			// TODO:添付リスト作る
			this.$(".ca_torikomi_div").each(function(){
				var $span = $(this).find("span.choose");
				if ($span.data("file")){
					var fileData = $span.data("file");
					var obj = {
							layoutfileName : fileData.filename,
							layoutfileURL : fileData.uri,
							layoutfileID : fileData.id,
							recno : "",
							state : 0
					};
					if($span.next().data("fileState")){
						var fileState = $span.next().data("fileState");
						obj.recno = fileState.recno;
						obj.state = fileState.state;
					}
					list.push(obj);
				}
			});
//			if(list.length === 0 && this.viewSeed.fileList.length === 0){
//				// エラー表示
//				clutil.mediator.trigger('onTicker', "変更がありません。");
//				return null;
//			}

//			if(clutil.protoIsEqual(list,this.viewSeed.fileList)){
//				return null;
//			}
			var id = this.viewSeed.rec.id;
			$.each(list,function(i){
				this.id = id;
				this.seq = i+1;
			});
			updReq = {
					id : id,
					fileList : list
			};
			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};

			var reqObj = {
					reqHead : reqHead,
					AMMSV0500UpdReq  : updReq
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
				// マスタ検索リクエスト
				AMMSV0500GetReq: {
					srchID: this.options.chkData[pgIndex].storeID			// ID
				},
			};

			return {
				resId: clcom.pageId,	//'AMMSV0500',
				data: getReq
			};
		},

		/**
		 * ダウンロードボタンクリック
		 * @param e
		 */
		_onfileDLClick : function(e){
			var $span = $(e.target).parent();
			var file = $span.data("file");
			if (file){
				clutil.download({url:file.uri});
			}
		},

		/**
		 * 削除ボタンクリック
		 * @param e
		 */
		_onfileDeleteClick : function(e){
			var $div = $(e.target).parent();
			var $span = $div.find("span");
			$span.html("").removeData("file");
			$span.removeAttr("data-original-title");
			$span.next().removeData("fileState");
			$div.find("form > a.cl-file-attach").attr("disabled", false);
			$(e.target).attr("disabled",true);
			clutil.MessageDialog2('削除完了しました。画面下部の登録ボタンを押下して確定してください。');
//			$div.find(".ca_file_DL").attr("disabled",true);
		},

		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			delete data.rspHead;
			delete data.rspPage;
			// 比較対象外のデータをdeleteして返す
			var rec = data.AMMSV0500GetRsp;
			data.AMMSV0500GetRsp.id = rec.rec.id;
			delete rec.rec;
			$.each(rec.fileList, function(){
				delete this.recno;
				delete this.state;
			});
			return data;
		}
	});

	// 初期データを取る
	clutil.getIniJSON(null, null).done(function(data, dataType) {
		var user_typeid = clcom.userInfo.user_typeid;
		if (user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
				user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
			if (clcom.srcId == 'AMSIV0010') {
				ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
			} else {
				ca_editView = new EditView({
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
					srchDate: clcom.getOpeDate(),
					chkData: [{
						storeID : clcom.userInfo.org_id
					}]
				}).initUIelement().render();
				ca_editView.$('#mainColumnFooter #cl_cancel').text('メニューに戻る');
			}
		} else {
			ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
		}
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
