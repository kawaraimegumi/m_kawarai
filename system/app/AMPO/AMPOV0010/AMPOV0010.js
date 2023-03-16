useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));
	
	/* シーズンセレクタの内容を保存しておく変数2015/10/29 早川 */
	var seasonSelectorList = [];
	
	var initUIElementBlockVar; // initUIElementが完了するまでブロッキングするためのdeferredを格納する2015/10/29 早川
	

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
			clutil.clbusunitselector(this.$('#ca_srchUnitID'));

			// ＰＯ種別
			clutil.cltypeselector(this.$("#ca_srchPOTypeID"), amcm_type.AMCM_TYPE_PO_CLASS);

			// シーズン
			//clutil.cltypeselector(this.$("#ca_srchSeasonTypeID"),  amcm_type.AMCM_TYPE_SEASON);
			this.makeSeasonSel(this.$("#ca_srchSeasonTypeID"));//シーズンセレクタの内容をam_pa_poseason_srchから受け取るよう変更 2015/10/29 早川
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
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {

			var dto = this.serialize();

			clutil.mediator.trigger('ca_onSearch', dto);
		},
		
		/**
		 * セレクタ内容を詰める 20151029 早川 AMPOV0270よりコピペ
		 */
		setSelList:function($el, list){
			var opt = {
					$select	:$el,
					list:list,
					unselectedflag:true,
					selectpicker: {
						noButton: false
					}
			};
			clutil.cltypeselector3(opt);
		},
		
		/**
		 * シーズンセレクター作成 20151029 早川 AMPOV0270よりコピペ
		 */
		makeSeasonSel:function($el){
			var _this = this;
			var srchReq = {
					// 20150808 藤岡 cond:シーズンはHist型でないので意味のないリクエスト
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					},
					cond :{
						srchFromDate: 0,
						srchToDate: 0,
					}
			};
			var promise = clutil.postJSON('am_pa_poseason_srch', srchReq).done(_.bind(function(data){
				var recs = data.list;
				var list = [];
				if(_.isEmpty(recs)){
					_this.setSelList($el, list);
				}else{
					$.each(recs, function() {
						var cn = {
								id: this.id,
								code: this.code,
								name: this.name
						};
						list.push(cn);
					});
					// 内容物がある場合 --> シーズン選択にセットする。
					_this.setSelList($el, list);
				}
				this.seasonList = list;
				seasonSelectorList = list;
				initUIElementBlockVar.resolve();
			}, this)).fail(_.bind(function(data){

			}, this));
			return promise;
		},

		_eof: 'AMPOV0010.SrchCondView//'
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
				title: '生地ID',
				subtitle: '一覧'
			});

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMPOV0010 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMPOV0010';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			$(".txtInFieldUnit.help").tooltip({html: true});

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
					this.$('#result'),
					this.$('#searchAgain'));
//			$('#ca_srchCode').inputlimiter('addlimiter', 'ca_code_limiter', function(value){
//				  return $.inputlimiter.Limiters.regex(/[-0-9A-Za-z]+/)(value);
//			});
			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.$("#ca_srchUnitID").val(clcom.userInfo.unit_id);
			this.mdBaseView.render();
			this.srchCondView.render();
			this.recListView.render();
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}
			//初期フォーカス
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.setFocus($('#ca_srchPOTypeID'));
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
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
				srchReq = this.srchCondView.serialize();
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
				AMPOV0010GetReq: srchReq
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
			if(groupid !== 'AMPOV0010'){
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
			this.clearResult();

			var defer = clutil.postJSON('AMPOV0010', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMPOV0010GetRsp.clothIDList;

				if(_.isEmpty(recs)){
					// 画面を一旦リセット
					mainView.srchAreaCtrl.reset();
					// 検索ペインを表示？
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
				window.AMPOV0010EmptyPriceLine = (srchReq.AMPOV0010GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS);
				
				
				/* シーズンidに対応するシーズン名をシーズンセレクタ内容から取得
				   2015/10/29 早川
				 */
				_.each(recs, function(e){
					//console.log(e.seasonTypeID);
					var season_name_obj = _.find(seasonSelectorList, function(f){
						return f.id == e.seasonTypeID;
					});
					if (season_name_obj == undefined){
						e.seasonTypeName = "";
					} else {
						e.seasonTypeName = season_name_obj.name;
					}
				});
				
				this.recListView.setRecs(recs);
				this.recListView.setDeletedRowUI(function(dto) {
					return dto.delFlag != 0;
				});

				// 初期選択の設定（オプション）
				if(!_.isEmpty(chkData)){
					this.recListView.setSelectRecs(chkData, true);
				}

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
			if($focusElem){
				clutil.setFirstFocus($focusElem);
			}else{
				// TODO : 適当な場所を select してフォーカスを入れる。
//				if (this.$('#searchAgain').css('display') == 'none') {
//					// 検索ボタンにフォーカスする
//					this.$('#ca_AMRSV0010_search').focus();
//				} else {
//					// 条件を追加ボタンにフォーカスする
//					this.$('#ca_AMRSV0010_add').focus();
//				}
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
		_doOpeAction: function(rtyp, pgIndex/*一覧画面では使用しない*/, e){

			var url = clcom.appRoot + '/AMPO/AMPOV0020/AMPOV0020.html';

			var myData, destData;



			if(this.savedReq){
				// 検索結果がある場合
				var selectedRecs = this.recListView.getSelectedRecs();
				myData = {
					btnId: e.target.id,
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMPOV0010GetReq,
					chkData: selectedRecs
				};
				destData = {
					opeTypeId: rtyp,
					chkData: selectedRecs
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

				// チェックされたデータが必要（Ｎ）
				if(_.isEmpty(destData.chkData)){
					// 行選択がない				-- そもそもボタンを押せなくしている
					console.warn('rtyp[' + rtyp + ']: item not specified.');
					return;
				}
				clcom.pushPage(url, destData, myData);

				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:	// 複製
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
				// チェックされたデータが必要（Ｎ）
				if(_.isEmpty(destData.chkData)){
					// 行選択がない				-- そもそもボタンを押せなくしている
					console.warn('rtyp[' + rtyp + ']: item not specified.');
					return;
				}
				clcom.pushPage(url, destData, myData);
				break;

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

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
				break;

			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
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
			var defer = clutil.postDLJSON('AMPOV0010', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
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

		_eof: 'AMPOV0010.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		initUIElementBlockVar = $.Deferred();
		mainView = new MainView().initUIElement().render();

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			/* initUIElement内でinitUIElementBlockVarがresolveされてから実行 */
			$.when(initUIElementBlockVar).done(function(e){
				mainView.load(clcom.pageData);		
			});
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
