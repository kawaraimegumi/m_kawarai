useSelectpicker2();

$(function(){

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

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
					title: '客層',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// *アプリ個別の View や部品をインスタンス化するとか・・・*

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

			// datepicker
			clutil.datepicker(this.$("#ca_fromDate"));
			this.$("#ca_fromDate").datepicker("setIymd", clcom.getOpeDate() + 1);
			clutil.datepicker(this.$("#ca_toDate"));
			this.$("#ca_toDate").datepicker("setIymd", clcom.max_date);

			// Fieldlimit
			clutil.cltxtFieldLimit(this.$("#ca_code"));
			clutil.cltxtFieldLimit(this.$("#ca_name"));
			clutil.cltxtFieldLimit(this.$("#ca_nameKana"));
			clutil.cltxtFieldLimit(this.$("#ca_shortName"));
			clutil.cltxtFieldLimit(this.$("#ca_shortNameKana"));

//			// 事業ユニット取得
			return clutil.clbusunitselector(this.$('#ca_unitID'));
//			return this;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			return this;
		},

		render : function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				this.$("#ca_toDate").datepicker("setIymd", clcom.max_date);
				clutil.viewReadonly(this.$(".ca_toDate_div"));
				clutil.setFocus(this.$("#ca_fromDate"));
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。

				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
					// 「適用期間」を「削除日」にする
					this.$("#ca_term").find('p.fieldName').text('削除日');
					this.$("#ca_term").find('.deldspn').hide();
					clutil.setFocus(this.$("#ca_fromDate"));

					this.$(".ca_fromDate_div").before('<p id="ca_tp_del"><span>?</span></p>');

					$("#ca_tp_del").addClass("txtInFieldUnit flright help").attr("data-original-title", "削除日以降、当商品分類は無効扱いとなります").tooltip({html: true});
				}
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
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				document.location = '#';
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				// 更新した日付をchkdataに反映
					this.options.chkData[args.index].fromDate = args.data.AMMSV0340GetRsp.marketType.fromDate;
				}
				clutil.viewReadonly(this.$el);
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
//				clutil.viewReadonly(this.$("#ca_headInfoArea"));
//				this._tableDisable();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				clutil.mediator.trigger("onTicker", data);
//				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
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
				var getRsp = data.AMMSV0340GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				clutil.data2view(this.$el, getRsp.marketType);
				clutil.viewRemoveReadonly(this.$el);
				var ope_date = clcom.getOpeDate();
				// this._allData2View(getRsp);
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
					// 照会モードは、Edit ブロッキングしておく。
					clutil.viewReadonly(this.$el);
				} else if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					clutil.viewReadonly(this.$(".ca_upd_dis"));
					clutil.viewReadonly(this.$(".ca_toDate_div"));
					if (getRsp.marketType.toDate == clcom.max_date){
						clutil.viewRemoveReadonly(this.$(".ca_fromDate_div"));
						if (getRsp.marketType.fromDate <= ope_date) {
							this.$("#ca_fromDate").datepicker("setIymd", ope_date + 1);
						}
					} else {
						clutil.viewReadonly(this.$(".ca_fromDate_div"));
					}
					clutil.setFocus(this.$("#ca_fromDate"));
				} else if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					clutil.viewReadonly(this.$el);
					clutil.viewRemoveReadonly(this.$(".ca_fromDate_div"));
					if (getRsp.marketType.fromDate <= ope_date) {
						this.$("#ca_fromDate").datepicker("setIymd", ope_date + 1);
					}
				}
				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
//				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.cl_sys_db_other)});
				var getRsp = data.AMMSV0340GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				clutil.data2view(this.$el, getRsp.marketType);
				clutil.viewReadonly(this.$el);
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMMSV0340GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				clutil.data2view(this.$el, getRsp);
				clutil.viewReadonly(this.$el);
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMMSV0340GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				clutil.data2view(this.$el, getRsp);
				clutil.viewReadonly(this.$el);
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
					// 照会モードは、Edit ブロッキングしておく。
					clutil.viewReadonly(this.$el);
				} else if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					clutil.viewReadonly(this.$(".ca_upd_dis"));
				}
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				clutil.mediator.trigger("onTicker", data);
//				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
			clutil.cltxtFieldLimitReset(this.$("#ca_code"));
			clutil.cltxtFieldLimitReset(this.$("#ca_name"));
			clutil.cltxtFieldLimitReset(this.$("#ca_nameKana"));
			clutil.cltxtFieldLimitReset(this.$("#ca_shortName"));
			clutil.cltxtFieldLimitReset(this.$("#ca_shortNameKana"));
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
			 * 入力値チェック 予約取消時はチェックしない
			 */
			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				// validation
				var f_error = false;
				this.validator.clear();

				/*************
				 * chkstdate 日付のチェック
				 *************/
//				var isBasic = this.$('input[name="ca_basicFlag"]:checked').val() == 1;
				var ope_date = clcom.getOpeDate();
				var $fromDate = this.$("#ca_fromDate");//$toDate = this.$("#ca_toDate");
				var fromDate = clutil.dateFormat($fromDate.val(), "yyyymmdd");
//				var toDate = clutil.dateFormat($toDate.val(), "yyyymmdd");
				var recfromDate = null;
				var rectoDate = null;
				if (this.options.chkData !== undefined && this.options.chkData.length > 0){
					recfromDate = this.options.chkData[pgIndex].fromDate;
					rectoDate = this.options.chkData[pgIndex].toDate;
				}
				switch(this.options.opeTypeId){
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
					if (fromDate <= ope_date){ // 開始日が明日以降でない
						this.validator.setErrorHeader(clmsg.cl_st_date_min_opedate);
						this.validator.setErrorMsg($fromDate, clmsg.cl_st_date_min_opedate);
						f_error = true;
					}
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					var compfromDate = ope_date < recfromDate ? recfromDate : ope_date;
					var msg = ope_date > recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
					if (fromDate <= compfromDate && rectoDate == clcom.max_date && fromDate != recfromDate){ // 未来予約可能で修正でない状態で開始日が明日以降でない
						this.validator.setErrorHeader(msg);
						this.validator.setErrorMsg($fromDate, msg);
						f_error = true;
					}
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					if (fromDate <= ope_date || fromDate < recfromDate){ // 設定開始日が明日以降かつ編集前開始日以降でない
						var msg = ope_date >= recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
						this.validator.setErrorHeader(msg);
						this.validator.setErrorMsg($fromDate, msg);
						f_error = true;
					}
					break;
				default:
					break;
				}
				if(f_error){ // エラーチェック毎にメッセージが決まっている⇒複数ある場合、一気に表示できていない。
					return null;
				}

				if(!this.validator.valid()) {
					f_error = true;
				}
				if(f_error){
					return null;
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

				var rec = clutil.view2data(this.$el);

				updReq = {
						marketType:rec
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
					AMMSV0340UpdReq  : updReq
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
				// 共通ページヘッダ		・・・これ、必要なの？					【確認】
				reqPage: {
				},
				// 取引先マスタ検索リクエスト
				AMMSV0340GetReq: {
					srchID: this.options.chkData[pgIndex].id,			// 取引先ID
					srchDate: this.options.chkData[pgIndex].toDate,		// 適用終了日
					delFlag : this.options.chkData[pgIndex].delFlag		// 削除(参照)フラグ
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMMSV0340UpdReq: {
				}
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
			var rec = data.AMMSV0340GetRsp;
			delete rec.marketType.fromDate;
			delete rec.marketType.toDate;
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