useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	clutil.enterFocusMode($('body'));

	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_sample_download"		: "_onSampleDLClick"		// ExcelサンプルDLボタン押下
		},

		sampleURL: "/public/sample/ＰＯカレンダーサンプル.xlsx",


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
						title: 'ＰＯカレンダー',
						subtitle: '取込',
						opeTypeId:-1,
						pageCount: o.chkData.length,
						// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
						// リクエストビルダ関数を渡しておく。
						buildSubmitReqFunction: undefined,
						// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
						// リクエストのビルダ関数を opt で渡しておく。
						buildGetReqFunction:undefined,
						buildSubmitCheckDataFunction : undefined,
						btn_submit: false,
						btn_csv: true
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});
			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
			return this;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			// 初期データ取得後に呼ばれる関数

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'));

			// ＰＯ種別
			clutil.cltypeselector(this.$("#ca_poTypeID"), amcm_type.AMCM_TYPE_PO_CLASS);


			// 対象期間取得
			// 初期値：当月(運用日/100)
			var yearmonthcode = clutil.clyearmonthcode({
				el: '#ca_ym',
				initValue: parseInt(clcom.getOpeDate()/100)
			});

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {
							AMPOV0180UpdReq: this.buildUpdReq()
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMPOV0180',
						data: request
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(this.validator.valid, this.validator)
				}
			});
			// 取込処理成功
			this.opeCSVInputCtrl.on('done', function(data){
				// 取り込み結果を表示する

			});

			// 取込処理失敗
			this.opeCSVInputCtrl.on('fail', function(data){
				// 取込処理が失敗した。
				if(data.rspHead.uri){
					//CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				}
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで
			clutil.initUIelement(this.$el);

			return this;
		},

		render : function(){
			this.$("#ca_unitID").val(clcom.userInfo.unit_id);
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			//初期フォーカス
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.setFocus(this.$('#ca_poTypeID'));
			}
			else{
				clutil.setFocus(this.$('#ca_unitID'));
			}
			return this;
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				console.log('CSV 出力');
				this.doCSVDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},
		buildReq: function(argSrchReq){
			// 検索条件
			var req = {
					reqHead: {
						//{ name = 'AM_PROTO_COMMON_RTYPE_NEW',        val = 1, description = '新規登録' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_UPD',        val = 2, description = '編集' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_DEL',        val = 3, description = '削除' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_REL',        val = 4, description = '参照' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_CSV',        val = 5, description = 'CSV出力' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_CSV_INPUT',  val = 6, description = 'CSV取込' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_COPY',       val = 7, description = '複製' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_PDF',        val = 8, description = 'PDF出力' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_DELCANCEL',  val = 9, description = '削除復活' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_RSVCANCEL',  val = 10, description = '予約取消' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_TMPSAVE',    val = 11, description = '一時保存' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_APPLY',      val = 12, description = '申請' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_APPROVAL',   val = 13, description = '承認' },
						//{ name = 'AM_PROTO_COMMON_RTYPE_PASSBACK',   val = 14, description = '差戻し' },
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
						fileId: 0			// CSV取込などで使用する
					},
					reqPage: {},//特にいらないパラメータ
					AMPOV0180GetReq: this.buildSrchReq()
			};
			return req;
		},

		//検索と更新でパケットの形が微妙に違うので変換用
		buildSrchReq: function(){
			var baseReq = clutil.view2data(this.$("#ca_base_form"));
			var calenIDList = new Array;
			if(baseReq.calenIDList != null &&  baseReq.calenIDList.length > 0){
				for(var i = 0; i <  baseReq.calenIDList.length;i++){
					var obj = {
							calenID:baseReq.calenIDList[i]
					};
					calenIDList.push(obj);
				}
			}
			var srchReq = {
					srchType		:2,	//1/2：　カレンダー候補検索/カレンダー検索
					srchUnitID		:baseReq.unitID,
					srchPOTypeID	:baseReq.poTypeID,
					srchYM			:baseReq.ym,
					srchCalenIDList	:calenIDList,
			};
			return srchReq;
		},
		buildUpdReq: function(){
			var baseReq = clutil.view2data(this.$("#ca_base_form"));
			var calenIDList = new Array;
			if(baseReq.calenIDList != null &&  baseReq.calenIDList.length > 0){
				for(var i = 0; i <  baseReq.calenIDList.length;i++){
					var obj = {
							calenID:baseReq.calenIDList[i]
					};
					calenIDList.push(obj);
				}
			}
			var updReq = {
					unitID		:baseReq.unitID,
					poTypeID	:baseReq.poTypeID,
					ym			:baseReq.ym,
					calenIDList	:calenIDList,
					orderDateList	:[],
					calenList	:[],
					dtlList		:[],

			};
			return updReq;
		},

		/**
		 * サンプルファイルダウンロード
		 */
		_onSampleDLClick: function() {
			//this.doCSV(AMMPV0010Req.AMMPV0010_SAMPLE);
			//window.location = "/public/sample/品種別構成比登録サンプル.xlsx";
			clutil.download(this.sampleURL);
		},

		/**
		 * 出力ボタン押下処理
		 */
		doCSVDownload: function(rtyp) {
			// validation
			if (!this.validator.valid()) {
				return null;
			}
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMPOV0180', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
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
