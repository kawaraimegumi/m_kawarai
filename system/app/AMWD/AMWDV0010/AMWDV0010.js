//セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){
	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
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

				var today = clcom.getOpeDate();

				if(args.selectedCount == 1){
					// 1個選択
					switch(args.btnOpeTypeId){
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
						var exeDay = args.selectedRows[0].exeDay;
						if(exeDay <= today){
							return false;
						}
					}
				}
				else{
					// 複数行選択
					if(args.selectionPolicy == 'single'){
						return false;
					}
					if(args.btnOpeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
						// 複数行選択可なのは、編集。
						// insDate 境界チェックが NG のものが含まれれば、編集ボタンを押せないように。
						for(var i=0; i<args.selectedCount; i++){
							var exeDay = args.selectedRows[i].exeDay;
							if(exeDay <= today){
								return false;
							}
						}
					}
				}
				return true;
			}
	};

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'					: '_onSrchClick'			// 検索ボタン押下時
		},
		
		initialize: function(opt){
			_.bindAll(this);
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			clutil.inputlimiter(this.$el);
			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);
			// 担当者
			clutil.clusercode2($("#ca_srchUserID"));
			//clutil.clstaffcode($("#ca_srchUserID"));
			// 検索日
			clutil.datepicker(this.$('#ca_srchStartDay'));
			clutil.datepicker(this.$('#ca_srchEndDay'));
			// ツールチップ
			$("#ca_tp_code").tooltip({html: true});

			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrpID",
					dependSrc: {
						// 品種が事業ユニットでなく、部門に依存するように設定する
						unit_id: 'srchDivID'
					}
				},
				// 部門 品種と部門はどちらもitgrp_idを出力するのでフィー
				// ルドリレーションが壊れるからsrchDivIDとつけた
				'clitgrpcode srchDivID': {
					el: '#ca_srchDivID',
					// 事業ユニットに依存するために必要
					addDepends: ['parent_id'],
					dependSrc: {
						// 親商品分類IDにユニットIDを指定する
						parent_id: 'unit_id'
					}
				}
			}, {
				dataSource: {
					itgrpfunc_id: clcom.getItgrpFuncBasic() || 1,
					itgrplevel_id: clcom.getStdItgrpLevel() || 3
				}
			});
			this.fieldRelation.done(function() {
			});
			
			var unit = clcom.getUserData().unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				// 初期値を設定
				this.deserialize({
					srchUnitID: unit,	// 事業ユニット
					srchItgrpID: null,					// 品種
					srchStartDay: clcom.getOpeDate(),	// 検索日 yyyymmdd
					srchEndDay: null,					// 検索日 yyyymmdd
					srchUserID: null					// 担当者
				});
				//clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}
			else{
				// 初期値を設定
				this.deserialize({
					//srchUnitID: clcom.getUserData().unit_id,	// 事業ユニット
					srchItgrpID: null,					// 品種
					srchStartDay: clcom.getOpeDate(),	// 検索日 yyyymmdd
					srchEndDay: null,					// 検索日 yyyymmdd
					srchUserID: null					// 担当者
				});
			}
		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			return clutil.view2data(this.$el);
		},

		/**
		 * 検索リクエストパケットの設定値を UI へセットする。
		 */
		deserialize: function(obj){
			this.deserializing = true;
			try{
				var dto = _.extend({}, obj);
				clutil.data2view(this.$el, dto);
			}finally{
				this.deserializing = false;
			}
		},
		
		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				//最終来店日
				stval : 'ca_srchStartDay',
				edval : 'ca_srchEndDay'
			});

			var retStat = true;
			// 日付エラー確認
			if(!this.validator.valid()){
				retStat = false;
			}
			// 反転エラー確認
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}
			
			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				//this.validator.setErrorFocus();
				retStat = false;
			}
			return retStat;
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 取引先コード・オートコンプリート設定チェック
			if(this.isValid() == false){
				return;
			}
			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMWDV0010.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opebtn_auto_enable: util.opeBtnIsEnabled,
				title: '評価減',
				subtitle: '一覧'
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});
			// グループID -- AMWDV0010 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMWDV0010';
			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント
			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			this.recListView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#ca_result'),
					this.$('#searchAgain'));
			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.srchCondView.render();
			this.recListView.render();
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}
			$("#mainColumnFooter").hide();
			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				if(this.srchCondView.isValid()){
					srchReq = this.srchCondView.serialize();
				}else{
					// メッセージは、srchConcView 側で出力済。
					return null;
				}
			}


			// 検索条件
			var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
						fileId: 0			// CSV取込などで使用する
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMWDV0010GetReq: srchReq
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);
			// 検索実行
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			if(groupid !== 'AMWDV0010'){
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
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedIds){
			this.clearResult();
			
			var defer = clutil.postJSON('AMWDV0010', srchReq).done(_.bind(function(data){
				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMWDV0010GetRsp.monthPlans;
				if(_.isEmpty(recs)){
					// 検索ペインを表示？
					mainView.srchAreaCtrl.reset();
					this.srchAreaCtrl.show_srch();
					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					return;
				}

				// リクエストを保存。
				this.savedReq = srchReq;
				// 結果ペインを表示
				this.srchAreaCtrl.show_result();
				$("#mainColumnFooter").show();
				//数値にカンマ付与
				for(var i=0; i<recs.length; i++){
					recs[i].itemNum = clutil.comma(recs[i].itemNum);
					recs[i].exeAm = clutil.comma(recs[i].exeAm);
					if(recs[i].divideType == 2){
						recs[i].divideTypeName = "本部";
					}
					else{
						recs[i].divideTypeName = "店舗";
					}
				}
				
				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);
				// 初期選択の設定（オプション）
				if(!_.isEmpty(selectedIds)){
					this.recListView.setSelectById(selectedIds, true);
				}
			}, this)).fail(_.bind(function(data){
				// 検索ペインを表示
				mainView.srchAreaCtrl.reset();
				mainView.srchAreaCtrl.show_srch();
				$("#mainColumnFooter").hide();
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
			}, this));
			this.resetFocus();
			
			return defer;
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
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
			var defer = clutil.postDLJSON('AMWDV0010', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},
		
		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			var unit = clcom.getUserData().unit_id;
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				clutil.setFocus($('#ca_srchDivID'));
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function(){
			if (this.$('#searchAgain').css('display') == 'none') {
				// 検索ボタンにフォーカスする
				this.$('#ca_srch').focus();
			} else {
				//再検索にフォーカスする
				this.$('#searchAgain').focus();
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
			$("#mainColumnFooter").hide();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, e){
			var url = clcom.appRoot + '/AMWD/AMWDV0020/AMWDV0020.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
						savedReq: this.savedReq,
						savedCond: this.savedReq.AMWDV0010GetReq,
						selectedIds: this.recListView.getSelectedIdList()
				};
				destData = {
						opeTypeId: rtyp,
						srchDate: this.savedReq.srchDate,
						chkData: this.recListView.getSelectedRecs()
				};
			}else{
				// 検索結果が無い場合
				myData = {
						savedReq: null,
						savedCond: this.srchCondView.serialize(),
						selectedIds: []
				};
				destData = {
						opeTypeId: rtyp
				};
			}

			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				// データが無くても可
				clcom.pushPage(url, destData, myData);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
				// チェックされたデータが必要（１）
				// fall through
				if(destData.chkData && destData.chkData.length >= 2){
					// 複数行選択されている		-- そもそもボタンを押せなくしているのでありえない
					console.warn('rtyp[' + rtyp + ']: '
							+ selectedRows.length + ' items selected, but single select only.');
					return;
				}
				//実施日チェック
				if(!this.chkExeday(destData.chkData)){
					clutil.mediator.trigger('onTicker', clutil.fmtargs(clmsg.EGM0017, ["削除"]));
					return;
				}

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
				// チェックされたデータが必要（Ｎ）
				if(_.isEmpty(destData.chkData)){
					// 行選択がない				-- そもそもボタンを押せなくしている
					console.warn('rtyp[' + rtyp + ']: item not specified.');
					return;
				}
				//実施日チェック
				if(!this.chkExeday(destData.chkData)){
					//this.validator.setErrorInfo({_eb_: clmsg.EGM0017});
					clutil.mediator.trigger('onTicker', clutil.fmtargs(clmsg.EGM0017, ["編集"]));
					return;
				}

				clcom.pushPage(url, destData, myData);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:    // 照会
				var lastClickedRec = this.recListView.getLastClickedRec();
				if(_.isEmpty(lastClickedRec)){
					// 最後にクリックした行データがとれなかった
					console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
					return;
				}
				destData.chkData = [ lastClickedRec ];

				// 別窓で照会画面を起動
				clcom.pushPage({
					url: url,
					args: destData,
					newWindow: true
				});
				break;

			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
			return;
			}
		},


		/**
		 * 実施日超過確認
		 */
		chkExeday: function(chkData){
			var flag = true;
			var data = clcom.getOpeDate();
			
			for(var i=0; i<chkData.length; i++){
				if(chkData[i].exeDay < data){
					flag = false;
				}
			}
			return flag;
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
				this.srchCondView.deserialize(model.savedCond);
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.selectedIds);
			}
		},

		_eof: 'AMWDV0010.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
			mainView.resetFocus();
		}
		else{
			mainView.setFocus();
		}
	}).fail(function(data){
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
