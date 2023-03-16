// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){
	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	clutil.enterFocusMode($('body'));
	var util = {
			/**
			 * 行選択 - Ope系ボタンの活性化/非活性化コントロール
			 *	var args = {
			 *		$btn: $btn,							// ボタン要素の jQuery オブジェクト
			 *		selectedRows: selectedRecs,			// 選択した行データ配列
			 *		selectedCount: selectedRecs.length,	// 選択行数
			 *		btnOpeTypeId: btnOpeTypeId,			// $btn に因んだ処理区分 opeTypeID 値。不定の場合は -1。
			 *		selectionPolicy: selectionPolicy,	// $btn の操作が複数行選択できるかどうか。値は 'single' or 'multi' をとる。
			 *		hasHistory: hasHistory,				// 行データが履歴を持つかどうか。行データに formDate, toDate プロパティを持つものを履歴ありと判定。
			 *		opeDate: opeDate					// 運用日（いま）。呼出元で clcom.getOpeDate() で取得した値。
			 *	};
			 */
			opeBtnIsEnabled: function(args){
				// 行選択が無い。⇒ 全部非活性化
				if(args.selectedCount <= 0){
					// 選択されていない。
					return false;
				}

				// 境界チェックの日付（年月）を求める。
				var cmpDate_ym = function(ymd){
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
				}(args.opeDate);

				if(args.selectedCount == 1){
					// 1個選択
					var recDto = args.selectedRows[0];
					var insDate = recDto.insDate;	// yyyyMMdd
					var insDate_ym = Math.floor(insDate / 100);
					switch(args.btnOpeTypeId){
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
						var toDate = recDto.toDate;	// yyyyMMdd
						var toDate_ym = Math.floor(toDate / 100);
//						if(insDate_ym < cmpDate_ym
//								&& Math.floor(args.opeDate /100) > toDate_ym){ //期間終了月が運用月以前
						if(insDate_ym < cmpDate_ym
								&& cmpDate_ym > toDate_ym){ //期間終了月が運用月以前
							return false;
						}
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
						if(insDate_ym < cmpDate_ym){
							return false;
						}
						break;
					}
				}else{
					// 複数行選択
					if(args.selectionPolicy == 'single'){
						return false;
					}
					if(args.btnOpeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
						// 複数行選択可なのは、編集。
						// insDate 境界チェックが NG のものが含まれれば、編集ボタンを押せないように。
						for(var i = 0; i < args.selectedRows.length; i++){
							var recDto = args.selectedRows[i];
							var insDate = recDto.insDate;	// yyyyMMdd
							var insDate_ym = Math.floor(insDate / 100);
							var toDate = recDto.toDate;	// yyyyMMdd
							var toDate_ym = Math.floor(toDate / 100);
//							if(insDate_ym < cmpDate_ym
//									&& Math.floor(args.opeDate /100) > toDate_ym){
							if(insDate_ym < cmpDate_ym
									&& cmpDate_ym > toDate_ym){ //期間終了月が運用月以前
								// 複数選択中に編集処理不可のものが含まれているので、
								// 編集ボタンは非活性にセットする。
								return false;
							}
						}
					}
				}
				return true;
			}
	};

	var ListView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_srch" : "onSearchClick",
			"click #searchAgain" : "onResearchClick",
		},
		resultList : [],
		fundList : {}, //検索リスト

		initialize : function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opebtn_auto_enable: util.opeBtnIsEnabled,	// 行選択 - Opeボタン活性/非活性コントロールの独自実装
				title: 'インセンティブ',
				subtitle: '一覧'
			});

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
			var groupid = 'AMFUV0010';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_tbody_template').html() )
			});

			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント
			// OPE系イベント
			clutil.mediator.on('onOperation', this._showAMFUV0020page);
			this.opeDate = clcom.getOpeDate();
			this.opeMonth = clutil.monthFormat(this.opeDate, "yyyymm");
			this.cmpMonth = function(ymd){
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
		},

		initUIelement : function(){
			clutil.inputlimiter(this.$el);
			this.mdBaseView.initUIElement();
			this.recListView.initUIElement();

			var now = clcom.getOpeDate();
			console.log(now);
			// datepicker
			clutil.datepicker(this.$("#ca_srchFromDate")).datepicker("setIymd",now);
			clutil.datepicker(this.$("#ca_srchToDate")).datepicker("setIymd");


			// hide searchAgain button & click event
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.$('#searchArea'),
					this.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));

			// get pulldown & combo box selector
			clutil.clusercode2($("#ca_srchLupdPerson"));
			// get busunit's menu
			return clutil.clbusunitselector(this.$('#ca_srchUnitID'));
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.$("#ca_srchUnitID").val(clcom.userInfo.unit_id);
			clutil.initUIelement(this.$el);
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

			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_srchFromDate',
				edval : 'ca_srchToDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			if (!retStat) {
				return;
			}

			var searchData = clutil.view2data(this.$('#searchArea'), 'ca_');
			searchData.srchLupdPerson = searchData._view2data_srchLupdPerson_cn ? searchData._view2data_srchLupdPerson_cn.code : "";
			var req = {
					reqHead: {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMFUV0010GetReq : searchData
			};
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMFUV0010'){
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
			this.srchAreaCtrl.show_srch();
		},

		// ページャークリック
		doSrch: function(srchReq, chkData) {
			var _this = this;

			// 結果状態をクリアする
			this.clearResult();

			// データを取得
			var uri = 'AMFUV0010';
			clutil.postJSON(uri, srchReq).done(_.bind(function(data, dataType) {

				// state文字列を追加
				$.each(data.rspList, function(){
					var insMonth = clutil.monthFormat(this.insDate, "yyyymm");
					var toMonth = clutil.monthFormat(this.toDate, "yyyymm");
					if(insMonth >= _this.opeMonth){
						this.state = "編集可";
					} else if (insMonth >= _this.cmpMonth){
						this.state = "編集可";
//						if (toMonth >= _this.opeMonth){
//							this.state = "修正可（金額・期間延長）";
//						} else {
//							this.state = "修正可（金額）";
//						}
					} else if (toMonth >= _this.cmpMonth){
//						this.state = "一部締め済（期間延長可）";
						this.state = "編集可（期間のみ）";
					} else {
						this.state = "締済";
					}

				});
				this.resultList = data.rspList;

				if (_.isEmpty(this.resultList)) {
					clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_no_data'));
					// 画面を一旦リセット
					this.srchAreaCtrl.reset();
					this.srchAreaCtrl.show_srch();
					this.resetFocus(this.$('#ca_srchUnitID'));
				} else {

					// 取得したデータを表示する
					// リクエストを保存。
					this.savedReq = srchReq;

					// 結果ペインを表示
					this.srchAreaCtrl.show_result();

					// 内容物がある場合 --> 結果表示する。
					this.recListView.setRecs(this.resultList);

					// 初期選択の設定（オプション）
					if(!_.isEmpty(chkData)){
						this.recListView.setSelectRecs(chkData, true, ["fundID"]);
					}
					this.resetFocus();
				}
			}, this)).fail(_.bind(function(data){
				console.log(data.rspHead);
				this.srchAreaCtrl.reset();
				this.srchAreaCtrl.show_srch();
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
				this.resetFocus();
			},this));
		},

		/**
		 * 登録・修正画面遷移
		 * @param ope_mode
		 */
		_showAMFUV0020page : function(ope_mode,pageId,e){
			var url = clcom.appRoot + '/AMFU/AMFUV0020/AMFUV0020.html';

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
//						savedReq: null,
						savedReq: this.savedReq ? this.savedReq : null,
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
						btnId: e.target.id,
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
						savedCond: this.savedReq.AMFUV0010GetReq,
						chkData: this.recListView.getSelectedRecs()
					}
				};
			}
			if(pushPageOpt){
				clcom.pushPage(pushPageOpt);
			}
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFocus($focusElem);
			} else {
				if(this.$("#searchAgain").css("display")=="none"){
					clutil.setFocus(this.$("#ca_srch"));
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
		},
		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(model) {
			// 条件部の復元
			if(!_.isEmpty(model.savedCond)){
				clutil.data2view(this.$("#searchArea"), model.savedCond);
				clutil.initUIelement(this.$("#searchArea"));
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}
		}
	});

	// 画面初期表示
	clutil.getIniJSON(null, null).done(function(data,dataType){
			ca_listView = new ListView();
			ca_listView.initUIelement().done(_.bind(function() {
				ca_listView.render();
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.setFocus($('#ca_srchFundCode'));
				}
				else{
					clutil.setFocus($('#ca_srchUnitID'));
				}
				if (clcom.pageData != null) {
					ca_listView.load(clcom.pageData);
				}
			},this));
	}).fail(function(data){
		console.error('iniJSON failed.');
		console.log(arguments);
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});
