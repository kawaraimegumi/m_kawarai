$(function(){
	$.inputlimiter.stop();
	$.inputlimiter.Limiters.alnumat = function () {
		return $.inputlimiter.Limiters.regex(/[A-Za-z0-9@]+/);
	};
	$.inputlimiter.start();

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	clutil.enterFocusMode($('body'));

	var ListView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_srch" : "_onSrch",
			"click #searchAgain" : "onResearchClick"
		},
		resultList : [],
		fundList : {}, //検索リスト

		initialize : function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '組織マスタ',
				subtitle: '一覧',
				btn_csv: false,
			});

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
			var groupid = 'AMMSV0250';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_tbody_template').html() )
			});
			$(".txtInFieldUnit.help").tooltip({html: true});

			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント
			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
			// 行選択イベント
			clutil.mediator.on('onRowSelectChanged', this._setOpeButtonUI);

		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			this.recListView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.$("#ca_searchArea"),
					this.$('#ca_srch'),
					this.$('#ca_result'),
					this.$('#searchAgain'));

			clutil.inputlimiter(this.$el);

			// 部品間の連携を行う
			this.relation = clutil.FieldRelation.create('default', {
				// 組織体系、(検索日)
				clorgfunccode: {
					el: '#ca_srchOrgFuncID'
 				},
				// 組織階層: 組織体系、(検索日)に依存する。
				clorglevel: {
					el: '#ca_srchOrgLevelID',
					// 組織コード(clorgcode)部品はデフォルトで
					// clorglevel_idに依存する。
					//
					// ここでは上位組織のidが必要なので、branches:で
					// p_id もエクスポートし、他の部品(ここでは
					// clorgcode)がこのパラメータを参照できるようにす
					// る。
					branches: ['p_id']
 				},
				// 上位組織: 組織体系、組織階層、(検索日)に依存する
				clorgcode: {
					el: '#ca_srchParentID',
					// clorglevelのbranchesで指定したp_idに依存するよ
					// うにdependSrcを設定する。
					dependSrc: {
						orglevel_id: 'p_id'
					}
				},
				// 検索日
				datepicker: {
					el: '#ca_srchDate'
				}
			});
			this.relation.set('clorgfunccode', clcom.cmDefaults.defaultOrgFunc);
			this.relation.reset();

			return this;
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
		_onSrch : function(){
			var retStat = true; // input check var
			// check by validator
			if(!this.validator.valid()){
				retStat = false;
			}

			if (!retStat) {
				return;
			}

			// get input data from condition's view
			var req = this.buildReq();

			this.doSrch(req);
		},


		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				srchReq = clutil.view2data(this.$('#ca_searchArea'), 'ca_');
				// if Date is not definited
				if(srchReq.srchDate == ""){
					srchReq.srchDate = 0;
				}
			}

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
				reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMMSV0250GetReq: srchReq
			};
			return req;
		},


		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMMSV0250'){
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
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				console.log('CSV 出力');
				this.doDownload(rtyp);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				this._showAMMSV0260page(rtyp, e);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * 検索条件を再指定 押下
		 */
		onResearchClick : function(){
			// Excelダウンロードボタンを表示する
			this.mdBaseView.options.btn_csv = false;
			this.mdBaseView.renderFooterNavi();

			this.srchAreaCtrl.show_srch();
		},


		_setOpeButtonUI: function(groupid, arg, from) {
			var opeDate = clcom.getOpeDate();
			var selectedRecs = (arg && _.isArray(arg.selectedRecs)) ? arg.selectedRecs : [];

			var hasHistory = false;
			if(from && _.isFunction(from.hasHistory)){
				hasHistory = from.hasHistory();
			}

			var basicFuncID = clcom.getSysparam(amcm_sysparams.PAR_AMMS_DEFAULT_ORG_FUNCID);
			var funcIDData = $("#ca_srchOrgFuncID").autocomplete('clAutocompleteItem');
			var funcID = funcIDData != null ? funcIDData.id : null;

			// 履歴条件への考慮
			var ope1SelectedRecs = selectedRecs;	// 1種：編集、削除ができる要素
			var ope2SelectedRecs = selectedRecs;	// 2種：予約取消ができる要素
			if(hasHistory){
				ope1SelectedRecs = _.filter(arg.selectedRecs, function(dto){
					return dto.toDate >= clcom.max_date && (funcID == basicFuncID || dto.levelTypeID == amcm_type.AMCM_VAL_ORG_LEVEL_OTHER);
				});
				ope2SelectedRecs = _.filter(arg.selectedRecs, function(dto){
					return dto.fromDate > opeDate && dto.toDate >= clcom.max_date && (funcID == basicFuncID || dto.levelTypeID == amcm_type.AMCM_VAL_ORG_LEVEL_OTHER);
				});
			}

			// デフォルトの活性/非活性判定関数
			var defaultIsEnabled = function(args){
				if(args.selectedCount <= 0){
					// 選択されていない。
					return false;
				}else if(args.selectedCount == 1){
					// 1個選択
					if(args.hasHistory){
						switch(args.btnOpeTypeId){
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
							if(args.selectedCount - ope1SelectedRecs.length > 0){
								// ＜履歴条件1種＞
								// 履歴適用外のものが含まれている
								return false;
							}
							break;
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約削除
							if(args.selectedCount - ope2SelectedRecs.length > 0){
								// ＜履歴条件2種＞
								// 履歴適用外のものが含まれている
								return false;
							}
							break;
						}
					}
				}else{
					// 複数行選択
					if(args.selectionPolicy == 'single'){
						return false;
					}
					if(args.hasHistory
								&& args.btnOpeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
								&& (args.selectedCount - ope1SelectedRecs.length) > 0){
						// 履歴適用外のものが含まれている
						return false;
					}
				}
				return true;
			};
			var opeBtnIsEnabled = defaultIsEnabled;

			var pmctlSwitcher = clutil.permcntl.getReadonlySwitcher();

			$('.cl_opebtngroup').each(function(){
				var $pdiv = $(this);
				var gid = $pdiv.data('cl_groupid');

				if(_.isEmpty(gid) || gid == '*' || _.isEmpty(groupid) || groupid == '*' || gid == groupid){
					// ボタン個々に enabled(true/false) セットする、for-each() ループ
					$pdiv.find('.btn').each(function(){
						var $btn = $(this);
						var btnOpeTypeId = clutil.btnOpeTypeId($btn);
						var selectionPolicy = null;
						switch(btnOpeTypeId){
						case -1:	// 処理区分不定
							if($btn.hasClass('cl_selectui_multi')){
								selectionPolicy = 'multi';
							}else if($btn.hasClass('cl_selectui_single')){
								selectionPolicy = 'single';
							}else{
								// 不定 -- コントロール下にないボタンなので SKIP する。
								return;
							}
							break;
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
							selectionPolicy = 'multi';
							break;
						default:
							selectionPolicy = 'single';
						}
						var args = {
							$btn: $btn,
							selectedRows: selectedRecs,
							selectedCount: selectedRecs.length,
							btnOpeTypeId: btnOpeTypeId,
							selectionPolicy: selectionPolicy,
							hasHistory: hasHistory,
							opeDate: opeDate
						};

						if(!false/* FIXME 権限コントロール実装＝ＯＦＦ中 */){
							if(opeBtnIsEnabled(args)){
								// 活性化
								pmctlSwitcher.turnOff($btn);
							}else{
								// 非活性化
								pmctlSwitcher.turnOn($btn);
							}
						}else{
							if(opeBtnIsEnabled(args)){
								// 活性化
								$btn.removeAttr('disabled');
							}else{
								// 非活性化
								$btn.attr('disabled', true);
							}
						}
					});
				}
			});
		},

		// ページャークリック
		doSrch: function(srchReq, chkData, $focusElem) {

			// 結果状態をクリアする
			this.clearResult();

			// データを取得
			var uri = 'AMMSV0250';
			return clutil.postJSON(uri, srchReq).done(_.bind(function(data, dataType) {

					this.resultList = data.AMMSV0250GetRsp.orgList;

					if (_.isEmpty(this.resultList)) {
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_no_data'));
						this.srchAreaCtrl.reset();
						this.srchAreaCtrl.show_srch();
						this.resetFocus(this.$("#ca_srchOrgFuncID"));
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
						// Excelダウンロードボタンを表示する
						this.mdBaseView.options.btn_csv = true;
						this.mdBaseView.renderFooterNavi();

						// 初期選択の設定（オプション）
						if(!_.isEmpty(chkData)){
							this.recListView.setSelectRecs(chkData, true);
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
			}, this));
		},

		/**
		 * 登録・修正画面遷移
		 * @param ope_mode
		 */
		_showAMMSV0260page : function(ope_mode, e){
			var url = clcom.appRoot + '/AMMS/AMMSV0260/AMMSV0260.html';

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
//				var chkData = util.chkmode(ope_mode, selectedRecs, this.validator, "fromDate", "toDate");
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
						savedCond: this.savedReq.AMMSV0250GetReq,
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
			}else{
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
		 * 出力ボタン押下処理
		 */
		doDownload: function(rtyp) {
			var retStat = true; // input check var
			// check by validator
			if(!this.validator.valid()){
				retStat = false;
			}

			// if some input is not correct, return
			if (!retStat) {
				return;
			}
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				return;
			}

			srchReq.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV;
			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMMSV0250', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
			return false;
		}

	});

	// 画面初期表示
	clutil.getIniJSON(null, null).done(function(data){
		console.log("iniJSON.done start");
		ca_listView = new ListView();
		ca_listView.initUIelement().render();
		clutil.setFocus($("#ca_srchOrgFuncID"));
		if (clcom.pageData != null) {
			ca_listView.savedReq = clcom.pageData.savedReq;
			var cond = clcom.pageData.savedCond;
			clutil.data2view(ca_listView.$('#ca_searchArea'), cond);

			if (ca_listView.savedReq != null) {
				ca_listView.doSrch(clcom.pageData.savedReq, clcom.pageData.chkData, $('#' + clcom.pageData.btnId));
			}
		}
		console.log("iniJSON.done done");
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
