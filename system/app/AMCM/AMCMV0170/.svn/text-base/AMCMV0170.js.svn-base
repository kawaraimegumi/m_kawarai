$(function(){

	clutil.enterFocusMode($('body'));

	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
		},

		/**
		 * opt : clcom.pageArgs
		 */
		initialize: function(opt){

			_.bindAll(this);

			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '外部IF取り込みログ',
					subtitle:'明細',
					opeTypeId: -1,
					pageCount: o.chkData.length,
					buildSubmitReqFunction: undefined,
					buildGetReqFunction: this._buildGetReqFunction,
					buildSubmitCheckDataFunction : undefined,
					btn_submit: true,
					btn_cancel: true
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// *アプリ個別の View や部品をインスタンス化するとか・・・*

			clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);

			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});
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
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}
			return this;
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'OK':
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				var getRsp = data.AMCMV0170GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp);
				this.viewReadonly();
				break;
			default:
			case 'NG':			// その他エラー。
				this.viewReadonly();
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				clutil.mediator.trigger("onTicker",data);
				break;
			}
		},

		/**
		 * view Readonly
		 */
		viewReadonly : function(){
			clutil.viewReadonly(this.$el);
		},

		/**
		 * データ表示
		 * ・表示後に入力数制御
		 */
		data2view : function(getRsp){
			var rec = getRsp.detail[0];
			//6/14 藤岡
			//rec.timestampの文字化処理追加
			rec.timestamp_disp = String(rec.timestamp).substring(0,4);
			rec.timestamp_disp += "/" + String(rec.timestamp).substring(4,6);
			rec.timestamp_disp += "/" + String(rec.timestamp).substring(6,8);
			rec.timestamp_disp += " " + String(rec.timestamp).substring(8,10);
			rec.timestamp_disp += ":" + String(rec.timestamp).substring(10,12);
			rec.timestamp_disp += ":" + String(rec.timestamp).substring(12,14);

			//disp化されていない要素追加
			rec.ifId_disp = rec.ifId;

			//gettypenameの第一引数と第二引数入れ替え(引数違い修正)
			rec.impDataType_disp = clutil.gettypename(amcm_type.AMCM_TYPE_IMPORT_DATA_TYPE, rec.impDataType, null);
			rec.destType_disp = clutil.gettypename(amcm_type.AMCM_TYPE_OTHER_SYSTEM, rec.destType, null);
			rec.resultType_disp = clutil.gettypename(amcm_type.AMCM_TYPE_OSYSIF_RESULT, rec.resultType, null);
			//6/14 藤岡ここまで

			rec.okCount_disp = clutil.comma(rec.okCount);
			rec.ngCount_disp = clutil.comma(rec.ngCount);

//			rec.destType_disp = rec.destType;
//			rec.resultType_disp = rec.resultType;

			clutil.data2view(this.$el, rec);
		},

		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 取引先マスタ検索リクエスト
				AMCMV0170GetReq: {
					logID: this.options.chkData[pgIndex].id, // ログID
					srchDate: String(this.options.chkData[pgIndex].timestamp).substring(0,8) // 検索日
				},
			};

			return {
				resId: clcom.pageId,	//'AMCM0170',
				data: getReq
			};
		}
	});

	// 初期データを取る
	clutil.getIniJSON(null, null).done(function(data, dataType) {
		if(clcom.pageArgs && clcom.pageArgs.opeTypeId){
			console.log("opeTypeId:" + clcom.pageArgs.opeTypeId);
		}
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