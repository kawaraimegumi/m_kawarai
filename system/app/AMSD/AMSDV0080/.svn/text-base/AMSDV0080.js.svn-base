useSelectpicker2();

$(function() {

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),

		events: {
			'click #ca_AMSDV0010':	'_onClickAMSDV0010',	// StoCSカラー商品マスタ検索
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

			// CSV取込完了処理
			var csv_uptake_done = function(data) {
				// 取り込み結果を表示する
				mainView.srchDoneProc(mainView.tempSrchReq, data);
			};
			// CSV取込失敗処理
			var csv_uptake_fail = function(data) {
				// 取込処理が失敗した。
				if(data.rspHead.uri){
					//CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				} else {
					clutil.mediator.trigger('onTicker', data);
				}
			};

			// 入出店舗推奨値算出ボタン
			this.opeCSVInputCtrl1 = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake1'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					var req = clutil.view2data(this.$('#ca_srchArea'));
					req.reqType = 1;

					// リクエストデータ本体
					var getReq = {
						AMSDV0080GetReq: req,
						AMSDV0080UpdReq: {},
					};

					mainView.tempSrchReq = getReq;

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMSDV0080',
						data: getReq
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
			this.opeCSVInputCtrl1.on('done', csv_uptake_done);

			// 取込処理失敗
			this.opeCSVInputCtrl1.on('fail', csv_uptake_fail);

			// 移動用基準在庫推奨値算出ボタン
			this.opeCSVInputCtrl2 = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake2'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					var req = clutil.view2data(this.$('#ca_srchArea'));
					req.reqType = 2;

					// リクエストデータ本体
					var getReq = {
						AMSDV0080GetReq: req,
						AMSDV0080UpdReq: {},
					};

					mainView.tempSrchReq = getReq;

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMSDV0080',
						data: getReq
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
			this.opeCSVInputCtrl2.on('done', csv_uptake_done);

			// 取込処理失敗
			this.opeCSVInputCtrl2.on('fail', csv_uptake_fail);

			// 在庫集約ロジック設定ファイル取込ボタン
			this.opeCSVInputCtrl3 = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake3'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					var req = clutil.view2data(this.$('#ca_srchArea'));
					req.reqType = 3;

					// リクエストデータ本体
					var getReq = {
						AMSDV0080GetReq: req,
						AMSDV0080UpdReq: {},
					};

					mainView.tempSrchReq = getReq;

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMSDV0080',
						data: getReq
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
			this.opeCSVInputCtrl3.on('done', csv_uptake_done);

			// 取込処理失敗
			this.opeCSVInputCtrl3.on('fail', csv_uptake_fail);

			// 移動設定入力ファイル取込ボタン
			this.opeCSVInputCtrl4 = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake4'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					var req = clutil.view2data(this.$('#ca_srchArea'));
					req.reqType = 4;

					// リクエストデータ本体
					var getReq = {
						AMSDV0080GetReq: req,
						AMSDV0080UpdReq: {},
					};

					mainView.tempSrchReq = getReq;

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMSDV0080',
						data: getReq
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
			this.opeCSVInputCtrl4.on('done', csv_uptake_done);

			// 取込処理失敗
			this.opeCSVInputCtrl4.on('fail', csv_uptake_fail);

			// 初期値を設定
			this.deserialize({});

			return this;
		},

		arrayStr2Num: function(array) {
			if (array == null || array.length == 0) {
				return;
			}
			for (var i = 0; i < array.length; i++) {
				if (typeof array[i] == 'string') {
					array[i] = Number(array[i]);
				}
			}
		},
		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			var dto = clutil.view2data(this.$el);

			return dto;
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
		 * 指定プロパティ名（ ⇔ 検索 Req 上のメンバ名）の UI 設定値を取得する。
		 * defaultVal は、設定値が無い場合に返す値。
		 */
		getValue: function(propName, defaultVal){
			if(_.isUndefined(defaultVal)){
				defaultVal = null;
			}
			if(!_.isString(propName) || _.isEmpty(propName)){
				return defaultVal;
			}
			var dto = this.serialize();
			var val = dto[propName];
			return (_.isUndefined(val) || _.isNull(val) || _.isEmpty(val)) ? defaultVal : val;
		},
		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			var f_valid = true;

			return f_valid;
		},

		/**
		 * StoCSカラー商品マスタ一覧へ遷移
		 */
		_onClickAMSDV0010: function(e) {
			var url = clcom.appRoot + '/AMSD/AMSDV0010/AMSDV0010.html';

			clcom.pushPage({
				url: url,
				args: {},
				newWindow: true,
			});
		},

		_eof: 'AMSDV0080.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #searchAgain':	'_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click #ca_AMTRV0040':	'_onClickAMTRV0040',	// 移動依頼一括取込遷移
		},

		resizeTimer: false,

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '移動',
				subtitle: '推奨値算出',
				btn_new: false,
				btns_dl: [
					{
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV,
						label: '推奨値ファイル出力'
					}
				],
				btn_csv: false,
				opebtn_auto_enable: false,
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMSDV0080 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMSDV0080';

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
			//clutil.mediator.on('onRowSelectChanged', this._setOpeButtonUI); TODO 多分いらない

			// OPE系イベント
//			'click div#title p.addNew>a'	: '_onNewClick',			// 新規押下
//			'click #ca_edit'				: '_onEditClick',			// 編集ボタン押下
//			'click #ca_delete'				: '_onDeleteClick',			// 削除ボタン押下
//			'click #ca_rsvcancel'			: '_onReserveCancelClick'	// 予約取消ボタン押下
			clutil.mediator.on('onOperation', this._doOpeAction);

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});

			// ウィンドウリサイズイベント
			window.addEventListener('resize', _.bind(function(e) {
				if (this.resizeTimer !== false) {
					clearTimeout(this.resizeTimer);
				}
				this.resizeTimer = setTimeout(_.bind(function() {
					this.tableResize();
				}, this));
			}, this));
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			this.recListView.initUIElement();

			$(".txtInFieldUnit.help").tooltip({html: true});

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
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

			this.tableResize();
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
					return;
				}
			}
			if (srchReq.srchItemApproveTypeID != null) {
				for (var i = 0; i < srchReq.srchItemApproveTypeID.length; i++) {
					srchReq.srchItemApproveTypeID[i] = Number(srchReq.srchItemApproveTypeID[i]);
				}
			} else {
				srchReq.srchItemApproveTypeID = [];
			}
			// 商品名条件の半角を全角に変換する
			if (srchReq.srchName != null) {
				srchReq.srchName = clutil.han2zen(srchReq.srchName);
			}

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
				//reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMSDV0080GetReq: srchReq
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var retStat = true; // input check var
			// check by validator
			if(!this.validator.valid()){
				retStat = false;
			}

			// if some input is not correct, return
			if (!retStat) {
				return;
			}

			var req = this.buildReq(srchReqDto);

			// 検索実行
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			console.log(arguments);
			if(groupid !== 'AMSDV0080'){
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
		doSrch: function(srchReq, selectedIds, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMSDV0080', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMSDV0080GetRsp.itemList;
				if(_.isEmpty(recs)){
					// 検索ペインを表示？
					mainView.srchAreaCtrl.reset();
					mainView.srchAreaCtrl.show_srch();

					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					return;
				}

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);

				// 初期選択の設定（オプション）
				if(!_.isEmpty(selectedIds)){
					this.recListView.setSelectById(selectedIds, true);
				}

				_.defer(_.bind(function() {
					// テーブルリサイズ
					this.tableResize();
					this.tableRowResize();
					this.tableHeaderResize();
				}, this));

				this.resetFocus($focusElem);
			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 検索ペインを表示
				mainView.srchAreaCtrl.reset();
				mainView.srchAreaCtrl.show_srch();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				this.resetFocus($focusElem);

			}, this));

			return defer;
		},

		/**
		 * Excel取込完了処理（検索結果表示処理）
		 */
		srchDoneProc: function(srchReq, data, chkData){
			// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
			var recs = data.AMSDV0080GetRsp.itemList;
			if(_.isEmpty(recs)){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.reset();
				mainView.srchAreaCtrl.show_srch();

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				return;
			}

			// リクエストを保存。
			this.savedReq = srchReq;

			// 結果ペインを表示
			this.srchAreaCtrl.show_result();

			// 内容物がある場合 --> 結果表示する。
			this.recListView.setRecs(recs);

			// 初期選択の設定（オプション）
			if(!_.isEmpty(selectedIds)){
				this.recListView.setSelectById(selectedIds, true);
			}

			_.defer(_.bind(function() {
				// テーブルリサイズ
				this.tableResize();
				this.tableRowResize();
				this.tableHeaderResize();
			}, this));

			this.resetFocus($focusElem);
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			}
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(downloadType){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}
			srchReq.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV;
			srchReq.AMSDV0080GetReq.downloadType = downloadType;
			srchReq.AMSDV0080GetReq.itemList = this.recListView.getSelectedRecs();

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMSDV0080', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 振分数入力ファイル出力
		 */
		_onDownloadAMSDC0150: function(e) {
			this.doDownload(1);
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.mdBaseView.options.btns_dl = null;
			this.mdBaseView.renderFooterNavi();

			this.srchAreaCtrl.show_srch();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, e){
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMSDV0080GetReq,
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
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:		// 推奨値ファイルダウンロード
				this.doDownload(2);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},


		/**
		 * テーブルリサイズ処理
		 */
		tableResize: function() {
//			var $p;
//			var display = $("#ca_srchArea").css('display');
//			if (display == 'none') {
//				$p = $("#result");
//			} else {
//				$p = $("#ca_srchArea").parent();
//			}
//			var width = $p.width() - 485;
//			$(".table_inner").css('width', width);
		},

		tableRowResize: function() {
//			var $tbody = $("#ca_table_tbody");
//
//			_.each($tbody.find('tr'), _.bind(function(t) {
//				var $tr = $(t);
//				var max_height = 0;
//				_.each($tr.find('td'), _.bind(function(d) {
//					// 各行の最大高さを取得する
//					var $td = $(d);
//					var height = $td.outerHeight();
//					if (max_height < height) {
//						max_height = height;
//					}
//				}, this));
//				$tr.find('td').css('height', max_height);
//			}, this));
		},

		tableHeaderResize: function() {
//			var $thead = $("#ca_table_thead");
//
//			_.each($thead.find('tr'), _.bind(function(t) {
//				var $tr = $(t);
//				var max_height = 0;
//				$ths = $tr.find('th');
//				_.each($ths, _.bind(function(d) {
//					// 各行の最大高さを取得する
//					var $th = $(d);
//					var height = $th.outerHeight();
//					if (max_height < height) {
//						max_height = height;
//					}
//				}, this));
//				$ths.css('height', max_height);
//			}, this));
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
				this.doSrch(model.savedReq, model.selectedIds, $('#' + model.btnId));
			}

		},

		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load2: function(model) {
			var userData = clcom.getUserData();
			// 条件部の復元
			if(!_.isEmpty(model.data)){
				var srchItemApproveTypeID;
				if (clcom.srcId == "AMCMV0110") {
					srchItemApproveTypeID = [amcm_type.AMCM_VAL_ITEM_APPROVE_TAGRET, amcm_type.AMCM_VAL_ITEM_APPROVE_RET];
				} else {
					srchItemApproveTypeID = [];
				}
				var data = {
					srchItgrpID: model.data.vpItgrpID,
					srchUpdUserID: userData.user_id,
					srchUpdDate: clcom.getOpeDate(),
					srchItemApproveTypeID: srchItemApproveTypeID,
				};
				this.srchCondView.deserialize(data);
				var req = this.buildReq(data);
				this.doSrch(req);

				// 品種検索
				this.doSrchStdItgrp(model.data.vpItgrpID);
			}
		},

		/**
		 * 移動依頼一括取込へ遷移
		 */
		_onClickAMTRV0040: function(e) {
			var url = clcom.appRoot + '/AMSD/AMTRV0040/AMTRV0040.html';

			clcom.pushPage({
				url: url,
				args: {},
				newWindow: true,
			});
		},

		_eof: 'AMSDV0080.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

		// selectpickerのフォーカスはスマートなやり方がないかな？
		var $tgt = null;
		if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
			$tgt = mainView.$("#ca_srchItgrpID");
		}
		else{
			$tgt = mainView.$("#ca_srchUnitID").next().children('input');
		}
		mainView.resetFocus($tgt);

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
		} else if (clcom.pageArgs) {
			mainView.load2(clcom.pageArgs);
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
