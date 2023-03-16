$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({

		el: $('#ca_srchArea'),

		events: {
			'click #ca_srch'			: '_onSrchClick',			// 検索ボタン押下時
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

			// 年度
			clutil.clyearselector(this.$("#ca_srchYear"), 0, 4, 2, "年度");

			// 事業ユニット
			clutil.clbusunitselector(this.$("#ca_srchUnitID"));

			var ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');

			// 初期値を設定
			this.deserialize({
				srchUnitID: 0,						// 事業ユニットID
				srchYear: ope_year,						// 年度
			});
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
			var val = this.$("#ca_srchUnitID").selectpicker("val");
			// 商品分類体系コード・オートコンプリート設定チェック
			if(val == null || val <= 0){
				// エラーメッセージを通知。
				var arg = {
					_eb_: '事業ユニットの選択が正しくありません。選択肢の中から指定してください。',
					srchUnitID: '選択肢の中から指定してください。'
				};
				this.validator.setErrorInfo(arg, {prefix: 'ca_'});
				return false;
			}
			val = this.$("#ca_srchYear").selectpicker("val");
			if(val == null || val <= 0){
				// エラーメッセージを通知。
				var arg = {
					_eb_: '年度の選択が正しくありません。選択肢の中から指定してください。',
					srchYear: '選択肢の中から指定してください。'
				};
				this.validator.setErrorInfo(arg, {prefix: 'ca_'});
				return false;
			}
			return true;
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 事業ユニット、年度設定チェック
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			//this.trigger('ca_onSearch', dto);
			clutil.mediator.trigger('ca_onSearch', dto);
		},


		_eof: 'AMMPV0010.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #searchAgain'			: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下

			'click #expand_comp_rt'			: '_onExpandCompRtClick',	// 「品種別構成比を登録・参照する」押下
			'click #expand_year'			: '_onExpandYearClick',		// 「品種別年商計画を登録・参照する」押下
			'click #expand_month'			: '_onExpandMonthClick',	// 「品種別月商計画を登録・参照する」押下
			'click #expand_week'			: '_onExpandWeekClick',		// 「品種別週商計画を登録・参照する」押下

			'click #ca_csv_download'		: '_onSampleDLClick',		// ExcelサンプルDLボタン押下

			'click #ca_dlBasicPlanYear'		: '_onBasicPlanYearClick',	// 基準計画(年)DLボタン押下
			'click #ca_dlNewPlanYear'		: '_onNewPlanYearClick',	// 最新計画(年)DLボタン押下

			'click #ca_dlBasicPlanMonth'	: '_onBasicPlanMonthClick',	// 基準計画(月)DLボタン押下
			'click #ca_dlNewPlanMonth'		: '_onNewPlanMonthClick',	// 最新計画(月)DLボタン押下

			'click #ca_dlBasicPlanWeek'		: '_onBasicPlanWeekClick',	// 基準計画(週)DLボタン押下
			'click #ca_dlNewPlanWeek'		: '_onNewPlanWeekClick',	// 最新計画(週)DLボタン押下
		},

		sampleURL: "/public/sample/品種別構成比登録サンプル.xlsx",

		initialize: function(){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '品種別計画策定',
				subtitle: '',
				btn_new: false,
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// CSV取込
			this.fileInput = clutil.fileInput({
				files: [],
				fileInput: "#ca_csvinput1",
				showDialogOnSuccess : false,
				showDialogOnError : false
			});

			this.fileInput.on('success', _.bind(function(file){
				this.validator.clear();
				console.log('成功', file);
				var req = this.buildReq();
				req.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT;
				req.reqHead.fileId = file.id;

				var url = "AMMPV0010";
				clutil.postJSON(url, req).done(_.bind(function(data,dataType){
					if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
						//成功時処理
						var view = new clutil.MessageDialog2('取込が完了しました。');

						// 内容物がある場合 --> 結果表示する。
						this.renderTable(data.AMMPV0010GetRsp.paramRecord);

					} else {
						// ヘッダーにメッセージを表示
						this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args),});
						this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_",});
						if (data.rspHead.uri){
							clutil.download(data.rspHead.uri);	//CSVダウンロード実行
						}
					}
				},this)).fail(_.bind(function(data){
					clutil.mediator.trigger('onTicker', data);

					// エラーファイルがあればダウンロードする
					if (data.rspHead.uri){
						clutil.download(data.rspHead.uri);	//CSVダウンロード実行
					}
				}, this));
			}, this));

			// グループID -- AMMPV0010 なデータに関連することを表すためのマーキング文字列
			//var groupid = 'AMMPV0010';

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント

			// OPE系イベント
//			'click div#title p.addNew>a'	: '_onNewClick',			// 新規押下
//			'click #ca_edit'				: '_onEditClick',			// 編集ボタン押下
//			'click #ca_delete'				: '_onDeleteClick',			// 削除ボタン押下
//			'click #ca_rsvcancel'			: '_onReserveCancelClick'	// 予約取消ボタン押下
//			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();

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
				reqPage: {},
				AMMPV0010GetReq: srchReq,
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
		 * 検索結果をテーブルに表示する
		 * @param paramRecord
		 */
		renderTable: function(list) {
			$("#ca_table_tbody").empty();
			$.each(list, function() {
				var tr = _.template($("#ca_rec_template").html(), this);
				$("#ca_table_tbody").append(tr);
			});
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedIds, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMMPV0010', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> 問題なし？

				//var recs = data.AMMPV0010GetRsp.itgrpList;
				//if(_.isEmpty(recs)){
				//	// 検索ペインを表示？
				//	mainView.srchAreaCtrl.show_srch();

				//	// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				//	clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				//	return;
				//}

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// 内容物がある場合 --> 結果表示する。
				this.renderTable(data.AMMPV0010GetRsp.paramRecord);

				this.resetFocus($focusElem);
			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				this.resetFocus($focusElem);

			}, this));

			return defer;
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
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
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
			this.renderTable([]);
		},

		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(model) {

		},

		_onCSVUptake: function() {

		},

		/**
		 * 品種別構成比を登録・参照するを開閉する
		 */
		_onExpandCompRtClick: function(e) {
			var $p = $('#comp_rt_info');
			var $tgt = $("#expand_comp_rt");
			var $span = $tgt.find('span');

			this._expandToggle($p, $span);
		},

		/**
		 * 品種別年商計画を参照するを開閉する
		 */
		_onExpandYearClick: function(e) {
			var $p = $('#year_info');
			var $tgt = $('#expand_year');
			var $span = $tgt.find('span');

			this._expandToggle($p, $span);
		},

		/**
		 * 品種別月別計画を参照するを開閉する
		 */
		_onExpandMonthClick: function(e) {
			var $p = $('#month_info');
			var $tgt = $('#expand_month');
			var $span = $tgt.find('span');

			this._expandToggle($p, $span);
		},

		/**
		 * 品種別週別計画を参照するを開閉する
		 */
		_onExpandWeekClick: function(e) {
			var $p = $('#week_info');
			var $tgt = $('#expand_week');
			var $span = $tgt.find('span');

			this._expandToggle($p, $span);
		},

		_expandToggle: function($p, $span) {
			$p.slideToggle();
			$span.fadeToggle();

			$p.css('overflow', 'inherit');
		},

		_onSampleDLClick: function() {
			//this.doCSV(AMMPV0010Req.AMMPV0010_SAMPLE);
			//window.location = "/public/sample/品種別構成比登録サンプル.xlsx";
			clutil.download(this.sampleURL);
		},

		/**
		 * 基準計画(年)DLボタン押下
		 */
		_onBasicPlanYearClick: function() {
			this.doCSV(AMMPV0010Req.AMMPV0010_BASE_YEAR);
		},

		/**
		 * 最新計画(年)DLボタン押下
		 */
		_onNewPlanYearClick: function() {
			this.doCSV(AMMPV0010Req.AMMPV0010_LAST_YEAR);
		},

		/**
		 * 基準計画(月)DLボタン押下
		 */
		_onBasicPlanMonthClick: function() {
			this.doCSV(AMMPV0010Req.AMMPV0010_BASE_MONTH);
		},

		/**
		 * 最新計画(月)DLボタン押下
		 */
		_onNewPlanMonthClick: function() {
			this.doCSV(AMMPV0010Req.AMMPV0010_LAST_MONTH);
		},

		/**
		 * 基準計画(週)DLボタン押下
		 */
		_onBasicPlanWeekClick: function() {
			this.doCSV(AMMPV0010Req.AMMPV0010_BASE_WEEK);
		},

		/**
		 * 最新計画(週)DLボタン押下
		 */
		_onNewPlanWeekClick: function() {
			this.doCSV(AMMPV0010Req.AMMPV0010_LAST_WEEK);
		},

		doCSV: function(csvtype) {
			var req = this.buildReq();
			if (_.isNull(req)) {
				return;
			}
			req.AMMPV0010GetReq.getCSVType = csvtype;
			req.reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV;

			var defer = clutil.postDLJSON('AMMPV0010', req);
			defer.fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},
		_eof: 'AMMPV0010.MainView//'
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
		} else {
			// selectpickerのフォーカスはスマートなやり方がないかな？
			var $tgt = $("#ca_srchUnitID").next().children('button');
			mainView.resetFocus($tgt);
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