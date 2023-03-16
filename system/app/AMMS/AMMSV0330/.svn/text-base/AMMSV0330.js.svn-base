useSelectpicker2();

$(function(){

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	clutil.enterFocusMode($('body'));

	var ListView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_srch" : "onSearchClick",
			"click #searchAgain" : "onResearchClick"
		},
		resultList : [],
		fundList : {}, //検索リスト

		initialize : function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '客層',
				subtitle: '一覧',
				btn_csv: false
			});


			// グループID -- AMMSV0330 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMMSV0330';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_tbody_template').html() )
			});

			// イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);


			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			this.recListView.initUIElement();

			clutil.inputlimiter(this.$el);

			var now = clcom.getOpeDate();
			console.log(now);
			// datepicker
			clutil.datepicker(this.$("#ca_srchDate"));
			this.$("#ca_srchDate").datepicker("setIymd", now);

			$(".txtInFieldUnit.help").tooltip({html: true});

			// hide searchAgain button & click event
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.$('#ca_searchArea'),
					this.$('#ca_srch'),
					this.$('#ca_result'),
					this.$('#searchAgain'));

			return clutil.clbusunitselector(this.$('#ca_srchUnitID'));
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.recListView.render();
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}
			return this;
		},


		/**
		 * 検索ボタン押下
		 */
		onSearchClick : function(){
			var retStat = true; // input check var
			// check by validator
			if(!this.validator.valid()){
				retStat = false;
			}

			// if some input is not correct, return
			if (!retStat) {
				return;
			}

			// get input data from condition's view
			var searchData = clutil.view2data(this.$('#ca_searchArea'), 'ca_');

			// if Date is not definited
			if(searchData.srchDate == ""){
				searchData.srchDate = 0;
			}

			//show results
			var req = {
					reqHead: {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMMSV0330GetReq : searchData
			};
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMMSV0330'){
				return;
			}

			if(!this.savedReq){
				console.warn('検索条件が保存されていません。');
				return;
			}

			// 検索条件を複製してページリクエストを差し替える
			var req = _.extend({}, this.savedReq);
			req.reqPage = pageReq;

			// 検索実行
			this.doSrch(req);
		},

		/**
		 * 検索条件を再指定 押下
		 */
		onResearchClick : function(){
			this.mdBaseView.options.btn_csv = false;
			this.mdBaseView.renderFooterNavi();

			this.srchAreaCtrl.show_srch();
		},

		// ページャークリック
		doSrch: function(srchReq, chkData, $focusElem) {

			// 結果状態をクリアする
			this.clearResult();

			// データを取得
			var uri = 'AMMSV0330';
			clutil.postJSON(uri, srchReq).done(_.bind(function(data, dataType) {

					this.resultList = data.AMMSV0330GetRsp.marketTypeList;

					if (_.isEmpty(this.resultList)) {
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_no_data'));
						this.srchAreaCtrl.reset();
						this.srchAreaCtrl.show_srch();
						this.resetFocus(this.$('#ca_srchUnitID').next().children('input'));
					} else {

						// 取得したデータを表示する
						// リクエストを保存。
						this.savedReq = srchReq;

						// 結果ペインを表示
						this.srchAreaCtrl.show_result();

						// 内容物がある場合 --> 結果表示する。
						this.recListView.setRecs(this.resultList);
						this.recListView.setDeletedRowUI(function(dto) {
							return dto.delFlag != 0;
						});

						// 初期選択の設定（オプション）
						if(!_.isEmpty(chkData)){
//							this.recListView.setSelectById(selectedIds, true);
							this.recListView.setSelectRecs(chkData, true);
						}
						// Excelダウンロードボタンを表示する
						this.mdBaseView.options.btn_csv = true;
						this.mdBaseView.renderFooterNavi();

						this.resetFocus();
					}

				}, this)).fail(_.bind(function(data){
					console.log(data.rspHead);
					this.srchAreaCtrl.reset();
					this.srchAreaCtrl.show_srch();
					// エラーメッセージを通知。
					clutil.mediator.trigger('onTicker', data);
					this.resetFocus();
			}, this));
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規作成
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 参照
				this.showAMMSV0340page(rtyp, pgIndex, e);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				console.log('CSV 出力');
				this.doCSVDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * 登録・修正画面遷移
		 * @param ope_mode
		 */
		showAMMSV0340page: function(ope_mode, pgIndex/*一覧画面では利用しない*/, e){
			var url = clcom.appRoot + '/AMMS/AMMSV0340/AMMSV0340.html';

			// 画面遷移引数
			var pushPageOpt = null;

			switch(ope_mode){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				pushPageOpt = {
					// 遷移先url
					url: url,
					// 画面引数 -- 遷移先画面に渡すネタ
					args: {
						opeTypeId: ope_mode
					},
					// 保存データ -- 戻ってきたときにリロードするネタ
					saved: {
						btnId: e.target.id,
						savedReq: null,
						savedCond: clutil.view2data($('#ca_searchArea')),
						chkData: this.recListView.getSelectedRecs()
					}
				};
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				var clickedRec = this.recListView.getLastClickedRec();
				if(_.isEmpty(clickedRec)){
					console.warn('照会：クリックした行が不明・・・Skip');
					return;
				}
				pushPageOpt = {
					url: url,
					args: {
						opeTypeId: ope_mode,
						srchDate: this.savedReq.srchDate,
						chkData: [ clickedRec ]
					},
					newWindow: true				// 別窓で照会画面を起動
				};
				break;
			default:										// その他、編集、予約取消、削除
				var selectedRecs = this.recListView.getSelectedRecs();
				if(_.isEmpty(selectedRecs)){
					console.warn(clutil.opeTypeIdtoString(ope_mode) + ': なにもチェックされていない・・・Skip');
					return;
				}
				pushPageOpt = {
					url: url,
					args: {
						opeTypeId: ope_mode,
						srchDate: this.savedReq.srchDate,
						chkData: this.recListView.getSelectedRecs()
					},
					saved: {
						btnId: e.target.id,
						savedReq: this.savedReq,
						savedCond: this.savedReq.AMMSV0330GetReq,
						chkData: this.recListView.getSelectedRecs()
					}
				};
			}
			if(pushPageOpt){
				clcom.pushPage(pushPageOpt);
			}
		},

		buildReq: function(rtyp){
			// validation
			if (!this.validator.valid()) {
				return null;
			}

			//リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMMSV0330GetReq: srchDto
//				cond : srchDto
			};

			return reqDto;
		},

		/**
		 * 出力ボタン押下処理
		 */
		doCSVDownload: function(rtyp) {
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMMSV0330', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFocus($focusElem);
			}else{
				if(this.$("#searchAgain").css("display")=="none"){
					clutil.setFocus(this.$("#ca_srch").next().children('input'));
				} else {
					clutil.setFocus(this.$("#searchAgain"));
				}
			}
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();
			// 確定時用のデータを初期化
			this.savedReq = null;
			// テーブルをクリア
			this.recListView.clear();
		}
	});


	// 画面初期表示
	clutil.getIniJSON(null, null, function(){
		console.log("completed()"); 			//コールバックtest表示
	})											//
	.done(function(data,dataType){				// 画面の初期化を行う
		ca_listView = new ListView();
		ca_listView.initUIelement().done(_.bind(function(){
			ca_listView.render();
			console.log("_.bind start");
			if (clcom.pageData != null) {
				// メインviewにメソッド追加してもよい
				ca_listView.savedReq = clcom.pageData.savedReq;
				var cond = clcom.pageData.savedCond;
				clutil.data2view(ca_listView.$('#ca_searchArea'), cond);
				if (cond.allHistFlag == 1) {
					$("#ca_allHistFlag").closest("label").addClass("checked");
				}

				if (ca_listView.savedReq != null) {
					ca_listView.doSrch(clcom.pageData.savedReq, clcom.pageData.chkData, $('#' + clcom.pageData.btnId));
				}
			}
			console.log("_.bind done");
			clutil.setFocus($("#ca_srchUnitID").next().children('input'));
		},this));
	})
	.fail(function(data){
		console.error('iniJSON failed.');
		console.log(arguments);

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
