useSelectpicker2();

$(function(){

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'					: '_onSrchClick'			// 表示ボタン押下時
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
//			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 0);
			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchStditgrpID",
				},
			});
			this.fieldRelation.done(function() {

			});

			var unit = null;
			var unit_id = clcom.userInfo.unit_id;
			if(clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS) {
				unit = unit_id;
			}
			if(unit == null){
				clutil.inputReadonly($('#ca_srchStditgrpID'));
			}

			// 品種取得
			/*
            clutil.clvarietycode(this.$('#ca_srchStditgrpID'), {
                getParentId: function() {
                    //事業ユニットを取得
                    var id = $("#ca_srchUnitID").val();

                    if (id != null) {
                        id = parseInt(id);
                    } else {
                        id = -1;    // 検索にミスるように
                    }
                    return id;
                },
            });
            */

			// 対象月取得
//			clutil.clmonthselector(this.$('#ca_srchYm'), 0, 1, null, null, null, 1); //TODO:初期表示調整(とりあえず1年)
//			clutil.clmonthselector(this.$('#ca_srchYm'), 0, 1, null, null, null, 1, 0, 'd'); //TODO:初期表示調整(とりあえず1年)
			clutil.clmonthselector(this.$('#ca_srchYm'), 1, 1, null, null, null, 1, null, 'd'); //TODO:初期表示調整(とりあえず1年)
			this.$('#ca_srchYm').val(clutil.dateFormat(clcom.getOpeDate(), 'yyyymm'));

			// 初期値を設定
			this.deserialize({
				srchUnitID: unit,		// 事業ユニットID
//				srchStditgrpID: 0,
				srchYm: clutil.dateFormat(clcom.getOpeDate(), 'yyyymm')
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
			// 品種設定チェック
			if(!this.$('#ca_srchStdItgrpID')){
				return false;
			}
			return true;
		},

		/**
		 * 表示ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 入力チェック
			var retStat = true;
			if(!this.validator.valid()){
				retStat = false;
			}

			if (!retStat) {
				return;
			}
			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMDLV0100.SrchCondView//'
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
				title: 'メーカー貢献度評価表出力',
				subtitle: '',
				btn_new: ''
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMDLV0100 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDLV0100';

			// ページャ
//			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
//			this.recListView = new clutil.View.RowSelectListView({
//				el: this.$('#ca_table'),
//				groupid: groupid,
//				template: _.template( $('#ca_rec_template').html() )
//			});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
//			'click div#title p.addNew>a'	: '_onNewClick',			// 新規押下
//			'click #ca_edit'				: '_onEditClick',			// 編集ボタン押下
//			'click #ca_delete'				: '_onDeleteClick',			// 削除ボタン押下
//			'click #ca_rsvcancel'			: '_onReserveCancelClick'	// 予約取消ボタン押下
			clutil.mediator.on('onOperation', this._jumpPage);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
//			this.recListView.initUIElement();

			// 検索条件を再指定ボタンを隠す
//			this.srchAreaCtrl = clutil.controlSrchArea(
//					this.srchCondView.$el,
//					this.srchCondView.$('#ca_srch'),
//					this.$('#result'),
//					this.$('#searchAgain'));

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.srchCondView.render();
//			this.recListView.render();
//			for(var i = 0; i < this.pagerViews.length; i++){
//				this.pagerViews[i].render();
//			}
			return this;
		},
		
		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.setFocus($('#ca_srchStditgrpID'));
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
		},

		changeYM: function(srchReq) {
			var srchYM = Number(srchReq.srchYm);
			var year = Math.floor(srchYM / 100);
			var month = srchYM % 100;
			if (month <= 3) {
				// １～３月の場合は年を調整する
				year += 1;
			}
			srchReq.orgSrchYm = srchReq.srchYm;
			srchReq.srchYm = year * 100 + month;
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

//			this.changeYM(srchReq);

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
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV,
					fileId: 0			// CSV取込などで使用する
				},
				reqPage: null,
				AMDLV0100GetReq: srchReq
			};
			return req;
		},

		/**
		 * 表示ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
//			var req = this.buildReq(srchReqDto);

			// 検索実行
			this.doDownload();
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// リクエストをつくる
			var srchReqdt;
			srchReqdt = clutil.view2data(this.$el);
			var srchReq = this.buildReq(srchReqdt);
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
//				this.srchAreaCtrl.show_srch();
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMDLV0100', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
//				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function(){
			// TODO
//			if (this.$('#searchAgain').css('display') == 'none') {
//				// 検索ボタンにフォーカスする
//				this.$('#ca_search').focus();
//			} else {
//				// 条件を追加ボタンにフォーカスする
//				this.$('#ca_add').focus();
//			}
		},

		/**
		 * 編集画面への遷移
		 */
		_jumpPage: function(rtyp, e){

			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
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
				this.srchCondView.deserialize(model.savedCond);
			}

		},

		_eof: 'AMDLV0100.MainView//'
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

});