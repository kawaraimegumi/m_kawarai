// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'		: '_onSrchClick',			// 検索ボタン押下時
			'change #ca_srchUnitID'	: '_onSrchUnitChanged',		// 事業ユニットが変更された
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
			var _this = this;
			clutil.inputlimiter(this.$el);

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 検索日
				datepicker: {
					el: "#ca_srchStartDay"
				},
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrpID",
				},
				// サブクラス1
				'clitemattrselector subclass1': {
					el: "#ca_srchSub1ID",
					dependSrc: {
						iagfunc_id: 'subclass1_id'
					}
				},
				// サブクラス2
				'clitemattrselector subclass2': {
					el: "#ca_srchSub2ID",
					dependSrc: {
						iagfunc_id: 'subclass2_id'
					}
				},
				// ブランド
				'clitemattrselector brand': {
					el: "#ca_srchBrandID",
					dependSrc: {
						iagfunc_id: 'brand_id'
					}
				},
				// スタイル
				'clitemattrselector style': {
					el: "#ca_srchStyleID",
					dependSrc: {
						iagfunc_id: 'style_id'
					}
				},
				// 色
				'clitemattrselector color': {
					el: "#ca_srchColorID",
					dependSrc: {
						iagfunc_id: 'color_id'
					}
				},
				// 柄
				'clitemattrselector design': {
					el: "#ca_srchDesignID",
					dependSrc: {
						iagfunc_id: 'design_id'
					}
				},
				// プライスライン
				'select priceline': {
					el: "#ca_srchPriceLineID",
					depends: ['itgrp_id'],
					getItems: function (attrs) {
						var ret = clutil.clpriceline(attrs.itgrp_id);
						return ret.then(function (data) {
							return _.map(data.list, function(item) {
								return {
									id: item.pricelineID,
									code: item.pricelineCode,
									name: item.pricelineName
								};
							});
						});
					}
				}
			}, {
				dataSource: {
					subclass1_id: clconst.ITEMATTRGRPFUNC_ID_SUBCLS1,
					subclass2_id: clconst.ITEMATTRGRPFUNC_ID_SUBCLS2,
					brand_id: clconst.ITEMATTRGRPFUNC_ID_BRAND,
					style_id: clconst.ITEMATTRGRPFUNC_ID_STYLE,
					color_id: clconst.ITEMATTRGRPFUNC_ID_COLOR,
					design_id: clconst.ITEMATTRGRPFUNC_ID_DESIGN,
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
			});
			// TODO:初期値->ログインユーザの事業ユニット

			// 検索日
//			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchStartDay'));
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchEndDay'));


			// 店舗ランクパターンオートコンプリート
			clutil.clstorerankptncode(this.$('#ca_srchRankID'), {
				dependAttrs: {
					unit_id: function() {
						return _this.getValue('srchUnitID', -1);
					}
				},
			});

			// 最終更新者
			clutil.clusercode2($("#ca_srchUserID"));

			// 初期値を設定
			this.deserialize({
				srchUnitID: clcom.userInfo.unit_id,		// 事業ユニット
				srchItgrpID: 0,							// 品種
				srchRankID: 0,							// 店舗ランクパターン
				srchStockCode: null,					// 基準在庫パターンコード
				srchStockName: null,					// 基準在庫パターン名
				srchSub1ID: 0,							// サブクラス1
				srchSub2ID: 0,							// サブクラス2
				srchBrandID: 0,							// ブランド
				srchStyleID: 0,							// スタイル
				srchColorID: 0,							// 色
				srchDesignID: 0,						// 柄
				srchPriceLineID: 0,						// プライスライン
				srchUserID: 0,							// 最終更新者
				srchStartDay: 0,						// 最終更新日 yyyymmdd
				srchEndDay: 0							// 最終更新日 yyyymmdd
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
			console.log(defaultVal);
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
			var retStat = true;
			this.validator.clear();

			if(!this.validator.valid()){
				retStat = false;
			}
			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_srchStartDay',
				edval : 'ca_srchEndDay'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return false;
			}

			// 品種コード・オートコンプリート設定チェック
			if(!this.$('#ca_srchItgrpID').autocomplete('isValidClAutocompleteSelect')){
				// エラーメッセージを通知。
				var arg = {
					_eb_: '品種コードの選択が正しくありません。選択肢の中から指定してください。',
					srchItgrpID: '選択肢の中から指定してください。'
				};
				this.validator.setErrorInfo(arg, {prefix: 'ca_'});
				return false;
			}
			// 店舗ランクパターン・オートコンプリート設定チェック
			if(!this.$('#ca_srchRankID').autocomplete('isValidClAutocompleteSelect')){
				// エラーメッセージを通知。
				var arg = {
					_eb_: '店舗ランクパターンの選択が正しくありません。選択肢の中から指定してください。',
					srchRankID: '選択肢の中から指定してください。'
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
			// 取引先コード・オートコンプリート設定チェック
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			//this.trigger('ca_onSearch', dto);
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		/**
		 * 事業ユニットが変更されたイベント
		 *  ⇒ 品種コード・店舗ランクパターンオートコンプリートの内部設定値をクリアする。
		 */
		_onSrchUnitChanged: function(e){
			//console.log(e);
			if(this.deserializing){
				// データセット中
				return;
			}
			this.$('#ca_srchItgrpID').autocomplete('removeClAutocompleteItem');
			this.$('#ca_srchRankID').autocomplete('removeClAutocompleteItem');
		},

		_eof: 'AMDSV0030.SrchCondView//'
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
				title: '基準在庫パターン',
				subtitle: '一覧'
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMDSV0030 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDSV0030';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			// イベント
			//this.srchCondView.on('ca_onSearch', this._onSrch);
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
//			'click div#title p.addNew>a'	: '_onNewClick',			// 新規押下
//			'click #ca_edit'				: '_onEditClick',			// 編集ボタン押下
//			'click #ca_delete'				: '_onDeleteClick',			// 削除ボタン押下
//			'click #ca_rsvcancel'			: '_onReserveCancelClick'	// 予約取消ボタン押下
			clutil.mediator.on('onOperation', this._doOpeAction);

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
				reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMDSV0030GetReq: srchReq
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
			console.log(arguments);
			if(groupid !== 'AMDSV0030'){
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
		 * @param chkData 初期選択行データ（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			console.log(srchReq);
			this.clearResult();

			var defer = clutil.postJSON('AMDSV0030', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMDSV0030GetRsp.ptnRecords;
				if(_.isEmpty(recs)){
					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					// 画面を一旦リセット
					mainView.srchAreaCtrl.reset();
					// 検索ペインを表示
					mainView.srchAreaCtrl.show_srch();
					this.tableResize();
					this.tableHeaderResize();
					this.tableRowResize();
					return;
				}

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);

				// 初期選択の設定（オプション）
				if(!_.isEmpty(chkData)){
					this.recListView.setSelectRecs(chkData, true);
				}

				_.defer(_.bind(function() {
					// テーブルリサイズ
					this.tableResize();
					this.tableHeaderResize();
					this.tableRowResize();
				}, this));

				this.resetFocus($focusElem);
			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				this.resetFocus($focusElem);

			}, this));

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
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMDSV0030', srchReq);
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
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.setFocus($('#ca_srchItgrpID'));
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFirstFocus($focusElem);
			}else{
//			if (this.$('#searchAgain').css('display') == 'none') {
//				// 検索ボタンにフォーカスする
//				this.$('#ca_srch').focus();
//			} else {
//				// 条件を追加ボタンにフォーカスする
//				this.$('#ca_AMRSV0010_add').focus();
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			var url = clcom.appRoot + '/AMDS/AMDSV0040/AMDSV0040.html';
			var myData, destData, selectedRecs;
			if(this.savedReq){
				// 検索結果がある場合
				selectedRecs = this.recListView.getSelectedRecs();
				myData = {
					btnId: e.target.id,
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMDSV0030GetReq,
					chkData: selectedRecs
				};
				destData = {
					opeTypeId: rtyp,
//					srchDate: this.savedReq.srchDate,
					chkData: (rtyp === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL)
					? [ this.recListView.getLastClickedRec() ] : selectedRecs
				};
			}else{
				// 検索結果が無い場合
				myData = {
					btnId: e.target.id,
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
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:	// 複製
				// チェックされたデータが必要（１）
				// fall through
				if(destData.chkData && destData.chkData.length >= 2){
					// 複数行選択されている		-- そもそもボタンを押せなくしているのでありえない
					console.warn('rtyp[' + rtyp + ']: '
							+ selectedRows.length + ' items selected, but single select only.');
					return;
				}
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
				// チェックされたデータが必要（Ｎ）
				if(_.isEmpty(destData.chkData)){
					// 行選択がない				-- そもそもボタンを押せなくしている
					console.warn('rtyp[' + rtyp + ']: item not specified.');
					return;
				}

//				for (var i = 0; i < destData.chkData.length; i++) {
//					var data = destData.chkData[i];
//
//					if (data.toDate < clcom.max_date) {
//						this.srchCondView.validator.setErrorHeader(clmsg.cl_rtype_r_edit);
//						return;
//					}
//				}

				clcom.pushPage(url, destData, myData);
				break;
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
//				this.doDownload();
//				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
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
		 * テーブルリサイズ処理
		 */
		tableResize: function() {
			var $p;
			var display = $("#ca_srchArea").css('display');
			if (display == 'none') {
				$p = $("#result");
			} else {
				$p = $("#ca_srchArea").parent();
			}
			var width = $p.width() - 800;
			$(".table_inner").css('width', width);
		},

		tableRowResize: function() {
			var $tbody = $("#ca_table_tbody");

			_.each($tbody.find('tr'), _.bind(function(t) {
				var $tr = $(t);
				var max_height = 0;
				_.each($tr.find('td'), _.bind(function(d) {
					// 各行の最大高さを取得する
					var $td = $(d);
					var height = $td.outerHeight();
					if (max_height < height) {
						max_height = height;
					}
				}, this));
				$tr.find('td').css('height', max_height);
			}, this));
		},

		tableHeaderResize: function() {
			var $thead = $("#ca_table_thead");

			_.each($thead.find('tr'), _.bind(function(t) {
				var $tr = $(t);
				var max_height = 0;
				_.each($tr.find('th'), _.bind(function(d) {
					// 各行の最大高さを取得する
					var $th = $(d);
					var height = $th.outerHeight();
					if (max_height < height) {
						max_height = height;
					}
				}, this));
				$tr.find('th').css('height', max_height);
			}, this));
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
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}

		},

		_eof: 'AMDSV0030.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();
		mainView.setFocus();

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
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

	// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
	// テストデータ
	xxx = {
			rspHead: {
				status: 0
			},
			rspPage: {
				curr_record: 1,				// 開始レコードインデックス
				total_record: 5,			// 総レコード数
				page_record: 5,				// ページ内レコード数
				page_size: 25,				// ページ内マックスレコード数
				page_num: 1					// 総ページ数
			},
			AMDSV0030GetRsp: {
				ptnRecords: [
					{
						id: 1,
						code: 'code-001',
						name: 'vendor-001',
						fromDate: 20120101,
						toDate: 20121231,
						vendorTypeID: 1,
						unitCode: '001',
						unitName: '事業ユニット＃１'
					},
					{
						id: 2,
						code: 'code-002',
						name: 'vendor-002',
						fromDate: 20120101,
						toDate: 20121231,
						vendorTypeID: 1,
						unitCode: '002',
						unitName: '事業ユニット＃２'
					},
					{
						id: 3,
						code: 'code-003',
						name: 'vendor-003',
						fromDate: 20120101,
						toDate: 20121231,
						vendorTypeID: 1,
						unitCode: '003',
						unitName: '事業ユニット＃３'
					},
					{
						id: 4,
						code: 'code-004',
						name: 'vendor-004',
						fromDate: 20120101,
						toDate: 20121231,
						vendorTypeID: 1,
						unitCode: '004',
						unitName: '事業ユニット＃４'
					},
					{
						id: 5,
						code: 'code-005',
						name: 'vendor-005',
						fromDate: 20120101,
						toDate: 20121231,
						vendorTypeID: 5,
						unitCode: '005',
						unitName: '事業ユニット＃５'
					},
				]
			}
	};


});
