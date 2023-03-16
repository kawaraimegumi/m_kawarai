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
				if(args.selectedCount == 1){
					// 1個選択
					if(args.btnOpeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
						//承認状態制御
						//一時保存・差戻し以外は編集不可
						var state = args.selectedRows[0].stateID;
						if((state != amcm_type.AMCM_VAL_APPROVE_ENTRY)
								&& (state != amcm_type.AMCM_VAL_APPROVE_RETURN)){
							return false;
						}
					}
					else if(args.btnOpeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
						//承認状態制御
						//一時保存以外は編集不可
						var state = args.selectedRows[0].stateID;
						if(state != amcm_type.AMCM_VAL_APPROVE_ENTRY){
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
							//承認状態制御
							//一時保存・差戻し以外は編集不可
							var state = args.selectedRows[i].stateID;
							if((state != amcm_type.AMCM_VAL_APPROVE_ENTRY)
									&& (state != amcm_type.AMCM_VAL_APPROVE_RETURN)){
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
//			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 0);
			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchStdItgrpID",
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
				clutil.inputReadonly($('#ca_srchStdItgrpID'));
			}

			// 品種取得
			/*
			clutil.clvarietycode(this.$('#ca_srchStdItgrpID'), {
				getParentId: function() {
					//事業ユニットを取得
					var id = $("#ca_srchUnitID").val();
					if (id != null) {
						id = parseInt(id);
					} else {
                      id = "-1";  // 検索にミスるように
					}
                    return id;
				}
            })
            */;

			// 依頼日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_fromDate'));
			this.srchDatePicker = clutil.datepicker(this.$('#ca_toDate'));

			// 初期値を設定
			this.deserialize({
				srchUnitID: unit,		// 事業ユニットID
//				srchStdItgrpID: 1,		// 品種
				srchRetCode: null,		// 返品依頼番号
				fromDate: clcom.getOpeDate()			// 期間開始日 yyyymmdd
				//toDate: clcom.getOpeDate()				// 期間終了日 yyyymmdd
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
            var retStat = true;

            if(!this.validator.valid()){
                retStat = false;
            }
            // 期間反転チェック
            var chkInfo = [];
            chkInfo.push({
                stval : 'ca_fromDate',
                edval : 'ca_toDate'
            });
            if(!this.validator.validFromTo(chkInfo)){
                retStat = false;
            }

         // 日付が1つも入力されていなければエラー
			var fromDate = $("#ca_fromDate").val().length;
			var toDate = $("#ca_toDate").val().length;

			if(fromDate + toDate == 0){
				this.validator.setErrorMsg($(".cl_date"), clmsg.EGM0031);
				retStat = false;
			}


            if (!retStat) {
                this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
                return false;
            }
			return true;
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 入力チェック
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			this.trigger('ca_onSearch', dto);
		},

		_eof: 'AMDLV0110.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #ca_check'				: '_onCheckClick',				// 状況確認押下
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			var user_store = clcom.userInfo['org_id'];
			var json = localStorage.getItem('clcom.rfidstore');
			var rfid_list = JSON.parse(json);
			var rfid_flg = 0;
			if (clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				if (rfid_list.includes(user_store)) {
					rfid_flg = 1;
				}
			}
			if (rfid_flg == 0) {
				this.mdBaseView = new clutil.View.MDBaseView({
					opebtn_auto_enable: util.opeBtnIsEnabled,
					title: '返品依頼',
					subtitle: '一覧'
				});
			} else {
				this.mdBaseView = new clutil.View.MDBaseView({
					opebtn_auto_enable: util.opeBtnIsEnabled,
					title: '返品依頼',
					subtitle: '一覧',
					btn_new: false,
				});
			}
//			this.mdBaseView = new clutil.View.MDBaseView({
//				opebtn_auto_enable: util.opeBtnIsEnabled,
//				title: '返品依頼',
//				subtitle: '一覧'
//			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMDLV0110 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDLV0110';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			// イベント
			this.srchCondView.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
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
			return this;
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.setFocus($('#ca_srchStdItgrpID'));
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
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
				reqPage: _.first(mainView.pagerViews).buildReqPage0(),
				AMDLV0110GetReq: srchReq
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
			if(groupid !== 'AMDLV0110'){
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
		 * @param selectedRecs 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedRecs){
			this.clearResult();
			//$("#result").show();

			var defer = clutil.postJSON('AMDLV0110', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMDLV0110GetRsp.slipList;
				if(_.isEmpty(recs)){
					// 検索ペインを表示？
					mainView.srchAreaCtrl.show_srch();

					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					//$("#result").hide();
					return;
				}

				// IDをつける
				_.each(recs, function(rec, i){
					rec.id = i;
				});

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();


				// 内容物がある場合 --> 結果表示する。
				//$("#result").show();
				this.recListView.setRecs(recs);

				var user_store = clcom.userInfo['org_id'];
				var json = localStorage.getItem('clcom.rfidstore');
				var rfid_list = JSON.parse(json);
				var rfid_flg = 0;
				if (clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					if (rfid_list.includes(user_store)) {
						rfid_flg = 1;
					}
				}

				this.recListView.setRowState({
					isMatch: function(item){
						return (
								 (rfid_flg === 1)
						);
					},
					enable: false
				});

//				this.recListView.setEnableRecs(_.filter(recs, function(rec){
//					// 店舗ユーザーは過去データの編集不可
//					return rec.releaseDate <= clcom.getOpeDate();
//				}), false);

				// 初期選択の設定（オプション）
				this.recListView.setSelectRecs(selectedRecs, true, ['retCode']);

				this.resetFocus();
			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				this.resetFocus();

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
			var defer = clutil.postDLJSON('AMDLV0110', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

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
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
		},

		/**
		 * 状況確認押下
		 */
		_onCheckClick:function() {
			var url = clcom.appRoot + '/AMDL/AMDLV0130/AMDLV0130.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMDLV0110GetReq,
					selectedIds: this.recListView.getSelectedIdList(),
					selectedRecs: this.recListView.getSelectedRecs()
				};
				destData = {
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



			// 状況確認画面へ遷移
			clcom.pushPage(url, destData, myData);
		},

		/**
		 * 編集画面への遷移
		 */
		_jumpPage: function(rtyp, pgIndex, e){
			var url = clcom.appRoot + '/AMDL/AMDLV0120/AMDLV0120.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMDLV0110GetReq,
					selectedIds: this.recListView.getSelectedIdList(),
					selectedRecs: this.recListView.getSelectedRecs()
				};
				destData = {
					opeTypeId: rtyp,
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
				clcom.pushPage(url, destData, myData);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:	// 複製
				// チェックされたデータが必要（Ｎ）
				if(_.isEmpty(destData.chkData)){
					// 行選択がない				-- そもそもボタンを押せなくしている
					console.warn('rtyp[' + rtyp + ']: item not specified.');
					return;
				}
				clcom.pushPage(url, destData, myData);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				var lastClickedRec = this.recListView.getLastClickedRec();
				if(_.isEmpty(lastClickedRec)){
					// 最後にクリックした行データがとれなかった
					console.warn('rtyp[' + rtyp + ']: last clicked item not found.');
					return;
				}

				destData.chkData = [ lastClickedRec ];

				// どの列がクリックされたか？
				var $target = $(e.target);
				if($target.is('a.ca_attachedFileName')){
					return;
				}else{
					// 別窓で照会画面を起動
					clcom.pushPage({
						url: url,
						args: destData,
						newWindow: true
					});
				}
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
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.selectedRecs);
			}

		},


		load2: function(args){
			// 条件部の復元
			if(!_.isEmpty(args)){
				//引数の検索日
				var date = Number(args.data.vpFromDate);

				var unit = null;
				if(clcom.getUserData().unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
						|| clcom.getUserData().unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
					unit = clcom.getUserData().unit_id;
				}
				var obj ={};

				if(unit == null){
					// 初期値を設定
					obj = {
						srchUnitID: unit,		// 事業ユニットID
						srchRetCode: "",		// 返品依頼番号
						fromDate: date,			// 期間開始日 yyyymmdd
						toDate: ""				// 期間終了日 yyyymmdd
					};
				}
				else{
					// 初期値を設定
					obj = {
						srchUnitID: String(unit),		// 事業ユニットID
						//srchStdItgrpID: "",		// 品種
						srchRetCode: "",		// 返品依頼番号
						fromDate: date,			// 期間開始日 yyyymmdd
						toDate: ""				// 期間終了日 yyyymmdd
					};
				}

				// 再検索
				this.srchCondView.deserialize(obj);
				var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
						fileId: 0			// CSV取込などで使用する
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMDLV0110GetReq: obj
				};

				this.doSrch(req);
			}
		},

		_eof: 'AMDLV0110.MainView//'
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
		else if(clcom.pageArgs){
			// アラーム一覧から遷移した場合
			if(clcom.srcId == "AMCMV0110"){
				mainView.load2(clcom.pageArgs);
			}
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
