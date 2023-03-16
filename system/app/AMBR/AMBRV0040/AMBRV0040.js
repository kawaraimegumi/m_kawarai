// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			"change #ca_srchUnitID" 				: "_onSrchUnitChanged",
			"click #ca_btn_org_select"				: '_onShowOrgSelClick',	// 組織選択ボタン押下
			'click #ca_srch'						: '_onSrchClick',			// 検索ボタン押下時
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

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
			}, {
				dataSource: {
					ymd: clcom.ope_date
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
			});

			// 初期値を設定
			this.deserialize( {
//				srchUnitID	: clcom.userInfo.unit_id,					// 事業ユニットID
			});

			// 組織
			console.log(clcom.userInfo.unit_id);
			this.orgAutocomplete = this.getOrg(clcom.userInfo.unit_id);
			if (clcom.userInfo && clcom.userInfo.org_id && clcom.userInfo.org_kind_typeid) {
				var code = (clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID')) ||
						clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')))
						? '' : clcom.userInfo.org_code ;
//				this.orgAutocomplete.setValue({
//					id: clcom.userInfo.org_id,
//					code: code,
//					name: clcom.userInfo.org_name
//				});
				this.$tgtFocus = $('#ca_srchOrgID');
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					// 店舗ユーザー
					this.orgAutocomplete.setValue({
						id: clcom.userInfo.org_id,
						code: code,
						name: clcom.userInfo.org_name
					});
					clutil.inputReadonly($("#ca_srchOrgID"));
					clutil.inputReadonly($("#ca_btn_org_select"));
					this.$tgtFocus = $('#ca_srch');
				}
			}

			// 組織選択画面
			this.AMPAV0020Selector = new  AMPAV0020SelectorView({
				el				: $("#ca_AMPAV0020_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				//ymd				: null,			// 検索日
				select_mode		: clutil.cl_single_select,	// 単一選択モード
				//anaProc			: this.anaProc
				isAnalyse_mode 	: false,						// 通常画面モード
			});
			this.AMPAV0020Selector.render();

			// 対象月
			var base_yyyymm = clcom.getSysparam(amcm_sysparams.PAR_AMBR_STOREPLSHEET_ST_YYYYMM);
			if (base_yyyymm == null) {
				base_yyyymm = 201501;
			}
			var yyyymm = Math.floor(clcom.getOpeDate() / 100);
			var future = yyyymm - 1;

			if(yyyymm % 100 < 2){
				// 運用日が1月なら、去年の12月とする
				var yyyy = Math.floor(yyyymm / 100);
				yyyy = yyyy - 1;
				future = yyyy * 100 + 12;
			}
			clutil.clmonthselector(this.$('#ca_srchMonth'), 1, null, null, base_yyyymm, future, 1, null, 'd');

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);
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
		isValid: function() {
			return this.validator.valid();
		},

		/**
		 *  事業ユニットと参照ボタンの連携
		 */
		_onSrchUnitChanged : function(e){
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				return;
			}
			var unitID = Number($('#ca_srchUnitID').val());
			this.getOrg(unitID);
			this.orgAutocomplete.setValue();
			this.$("#ca_srchOrgID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_org_select").attr("disabled", (unitID == 0));
		},

		/**
		 * 組織オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: $('#ca_srchOrgID'),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: (unitID < clutil.getclsysparam('PAR_AMMS_UNITID_AOKI') ? 0 : unitID),
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				}
			});
		},

		/**
		 * 組織選択ボタン押下
		 */
		_onShowOrgSelClick: function(e) {
			var _this = this;

			// 選択された情報を初期値として検索する
			var func_id = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
			var r_org_id = clcom.userInfo.unit_id < clutil.getclsysparam('PAR_AMMS_UNITID_AOKI') ? 3 : clcom.userInfo.unit_id;

			// 2015/11/10 MT-873対応 藤岡
			var f_ignore_perm = 0;
			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_KEISEN){
				// 経戦ユーザなら権限無視(親組織を本部とする)
				f_ignore_perm = 1;
				r_org_id = 3;
			}
			// 2015/11/10 MT-873対応 ここまで

			// 3 は　(株)AOKIのorg_id いつでも触れるようにするならパラメータ化が必要
			// ＋組織画面側で選択した事業ユニットの渡しが必要となる。
//			var initData = {};
//			initData.func_id = Number(clutil.getclsysparam("PAR_AMMS_DEFAULT_ORG_FUNCID", 1));
			this.AMPAV0020Selector.show(null, false, func_id, null, null, r_org_id, 0, f_ignore_perm);
			//サブ画面復帰後処理
			this.AMPAV0020Selector.okProc = function(data) {
				if (data != null && data.length > 0) {
					// 組織を取出す
					data[0].id = data[0].val;
					_this.orgAutocomplete.setValue(data[0]);
				} else {
					var org = _this.orgAutocomplete.getValue();
					if (org.id == 0) {
						_this.orgAutocomplete.resetValue();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_org_select"));
				});
			};
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			if(!this.isValid()){
				return;
			}

			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMBRV0040.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'		: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click #cl_close'			: '_onCloseClick',
		},

		initialize: function(opt){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId: -1,
				title: '店舗別損益管理照会',
				subtitle: '',
				btn_csv: (clcom.userInfo && clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF),
				btn_submit: false
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMBRV0040 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMBRV0040';

			// ページャ
			//this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() ),
				onOperationSilent	: true,
			});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			//clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

//			// 外部イベントの購読設定
//			switch(fixopt.opeTypeId){
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
//				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
//				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
//				// fall through
//			default:
//				// 新規登録以外は、GET結果のデータを購読する。
//				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
//			}

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
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
			//for(var i = 0; i < this.pagerViews.length; i++){
				//this.pagerViews[i].render();
			//}

			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq) {
			var srchReq;
			if (arguments.length > 0) {
				srchReq = argSrchReq;
			} else {
				if (this.srchCondView.isValid()) {
					srchReq = this.srchCondView.serialize();
				} else {
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
				//reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMBRV0040SchReq: srchReq
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

//		/**
//		 * ページ切り替え/表示件数変更からの再検索
//		 */
//		_onPageChanged: function(groupid, pageReq, from){
//			if(groupid !== 'AMBRV0040'){
//				return;
//			}
//
//			if(!this.savedReq){
//				console.warn('検索条件が保存されていません。');
//				return;
//			}
//
//			// 検索条件を複製してページリクエストを差し替える
//			var req = _.extend({}, this.savedReq);
//			req.reqPage = pageReq;
//
//			// 検索実行
//			this.doSrch(req);
//		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMBRV0040', srchReq).done(_.bind(function(data){
				this.srchDoneProc(srchReq, data);

			}, this)).fail(_.bind(function(data){
				this.srchFailProc(data);

			}, this));

			return defer;
		},

		srchDoneProc: function(srchReq, data){
			// データ取得
			var recs = data.AMBRV0040SchRsp;

			if (_.isEmpty(recs)) {
				// エラーメッセージ表示
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペイン／結果ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// フォーカス設定
				this.resetFocus(this.srchCondView.$tgtFocus);
			} else {
				mainView.setDispData(data);
				mainView.setAccTable();
				console.log(this.dispData);

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(this.dispData.body);

				if (clcom.userInfo
						&& (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF
								|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS
								|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_KEISEN)) {
					// Excelダウンロードボタンを表示する
					this.mdBaseView.options.btn_csv = true;
					this.mdBaseView.renderFooterNavi();
				}

				// フォーカスの設定
				if(typeof $focusElem != 'undefined') {
					this.resetFocus($focusElem);
				}

			}
		},

		srchFailProc: function(data){
			// 画面を一旦リセット
			mainView.srchAreaCtrl.reset();
			// 検索ペインを表示
			mainView.srchAreaCtrl.show_srch();

			// エラーメッセージを通知。
			clutil.mediator.trigger('onTicker', data);

			if (data.rspHead.fieldMessages) {
				// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				return;
			}

			// フォーカスの設定
			this.resetFocus();
		},

		setDispData: function(data){
			this.dispData = null;

			// テーブルのヘッダ部分のデータを生成する
			var month = data.AMBRV0040SchRsp.targetMonth;
			console.log(month);
			var tableData = {
				header:{
					month	: month,
				},
				body:new Array(),
			};

			var bd = tableData.body;

			var accLists = data.AMBRV0040SchRsp.accLists;
//			console.log(accLists);
			// テーブルの縦軸部分のデータを生成する
			$.each(accLists, function(){

				// テーブルの横軸部分のデータを生成する
				bd.push({
					m_accTitleName	: this.accTitleName,
					m_result	: this.mRec.result,
					m_compRatio	: this.mRec.compRatio.toFixed(1),
					m_plan	: this.mRec.plan,
					m_planCompRatio	: this.mRec.planCompRatio.toFixed(1),
					m_planRatio	: this.mRec.planRatio.toFixed(1),
					m_planDiff	: this.mRec.planDiff,
					m_resultPrev	: this.mRec.resultPrev,
					m_compRatioPrev	: this.mRec.compRatioPrev.toFixed(1),
					m_YTY	: this.mRec.YTY.toFixed(1),
					m_diff	: this.mRec.diff,
					t_accTitleName	: this.accTitleName,
					hy_result	: this.hyRec.result,
					hy_compRatio	: this.hyRec.compRatio.toFixed(1),
					hy_plan	: this.hyRec.plan,
					hy_planCompRatio	: this.hyRec.planCompRatio.toFixed(1),
					hy_planRatio	: this.hyRec.planRatio.toFixed(1),
					hy_planDiff	: this.hyRec.planDiff,
					hy_resultPrev	: this.hyRec.resultPrev,
					hy_compRatioPrev	: this.hyRec.compRatioPrev.toFixed(1),
					hy_YTY	: this.hyRec.YTY.toFixed(1),
					hy_diff	: this.hyRec.diff,
					y_result	: this.yRec.result,
					y_compRatio	: this.yRec.compRatio.toFixed(1),
					y_plan	: this.yRec.plan,
					y_planCompRatio	: this.yRec.planCompRatio.toFixed(1),
					y_planRatio	: this.yRec.planRatio.toFixed(1),
					y_planDiff	: this.yRec.planDiff,
					y_resultPrev	: this.yRec.resultPrev,
					y_compRatioPrev	: this.yRec.compRatioPrev.toFixed(1),
					y_YTY	: this.yRec.YTY.toFixed(1),
					y_diff	: this.yRec.diff,
				});
			});

			this.dispData = tableData;
		},

		setAccTable: function() {
			this.$("#ca_table_thead").find('th[name="tmpl"]').remove();

			$("#ca_thHead_template").tmpl(this.dispData.header).appendTo("#ca_thHead");
			$("#ca_thItem_template").tmpl(this.dispData.header).appendTo("#ca_thItem");

			/**
			 * 月計の開閉
			 */
			$('.rowClose.month').click(function() {
				// 累計が閉まっている場合は何もしない
				if ($('.rowClose.total').parent('th').css('display') == 'none') {
					return;
				}

				$(this).parent('th').toggle();
				$(this).parent('th').next('th').toggle();

				// tbody用
				var tbody = $("#ca_table tbody");
				$(tbody).find('tr').each(function() {
					if ($(this).children('td:eq(0)').text() == '年間') {

					} else {
						// 各項目
						$(this).find('td:nth-child(1)').toggle();
						$(this).find('td:nth-child(2)').toggle();
						$(this).find('td:nth-child(3)').toggle();
						$(this).find('td:nth-child(4)').toggle();
						$(this).find('td:nth-child(5)').toggle();
						$(this).find('td:nth-child(6)').toggle();
						$(this).find('td:nth-child(7)').toggle();
						$(this).find('td:nth-child(8)').toggle();
						$(this).find('td:nth-child(9)').toggle();
						$(this).find('td:nth-child(10)').toggle();
						$(this).find('td:nth-child(11)').toggle();
						$(this).find('td:nth-child(12)').toggle();

						// ヘッダ
						$(this).find('th:nth-child(1)').toggle();
						$(this).find('th:nth-child(2)').toggle();
						$(this).find('th:nth-child(3)').toggle();
						$(this).find('th:nth-child(4)').toggle();
						$(this).find('th:nth-child(5)').toggle();
						$(this).find('th:nth-child(6)').toggle();
						$(this).find('th:nth-child(7)').toggle();
						$(this).find('th:nth-child(8)').toggle();
						$(this).find('th:nth-child(9)').toggle();
						$(this).find('th:nth-child(10)').toggle();
						$(this).find('th:nth-child(11)').toggle();
						$(this).find('th:nth-child(12)').toggle();
					}
				});

				// thead２行目用
				$('th.month').toggle();
			});

			$('.rowOpen.month').click(function() {
				$(this).parent('th').toggle();
				$(this).parent('th').prev('th').toggle();

				// tbody用
				var tbody = $("#ca_table tbody");
				$(tbody).find('tr').each(function() {
					if ($(this).children('td:eq(0)').text() == '年間') {

					} else {
						$(this).find('td:nth-child(1)').toggle();
						$(this).find('td:nth-child(2)').toggle();
						$(this).find('td:nth-child(3)').toggle();
						$(this).find('td:nth-child(4)').toggle();
						$(this).find('td:nth-child(5)').toggle();
						$(this).find('td:nth-child(6)').toggle();
						$(this).find('td:nth-child(7)').toggle();
						$(this).find('td:nth-child(8)').toggle();
						$(this).find('td:nth-child(9)').toggle();
						$(this).find('td:nth-child(10)').toggle();
						$(this).find('td:nth-child(11)').toggle();
						$(this).find('td:nth-child(12)').toggle();

						// ヘッダ
						$(this).find('th:nth-child(1)').toggle();
						$(this).find('th:nth-child(2)').toggle();
						$(this).find('th:nth-child(3)').toggle();
						$(this).find('th:nth-child(4)').toggle();
						$(this).find('th:nth-child(5)').toggle();
						$(this).find('th:nth-child(6)').toggle();
						$(this).find('th:nth-child(7)').toggle();
						$(this).find('th:nth-child(8)').toggle();
						$(this).find('th:nth-child(9)').toggle();
						$(this).find('th:nth-child(10)').toggle();
						$(this).find('th:nth-child(11)').toggle();
						$(this).find('th:nth-child(12)').toggle();
					}
				});

				// thead２行目用
				$('th.month').toggle();
			});

			/**
			 * 累計の開閉
			 */
			$('.rowClose.total').click(function() {

				// 月計が閉まっている場合は何もしない
				if ($('.rowClose.month').parent('th').css('display') == 'none') {
					return;
				}

				$(this).parent('th').toggle();
				$(this).parent('th').next('th').toggle();

				// tbody用
				var tbody = $("#ca_table tbody");
				$(tbody).find('tr').each(function() {
					if ($(this).children('td:eq(0)').text() == '年間') {
						// 各項目
						$(this).find('td:nth-child(1)').toggle();
						$(this).find('td:nth-child(2)').toggle();
						$(this).find('td:nth-child(3)').toggle();
						$(this).find('td:nth-child(4)').toggle();
						$(this).find('td:nth-child(5)').toggle();
						$(this).find('td:nth-child(6)').toggle();
						$(this).find('td:nth-child(7)').toggle();
						$(this).find('td:nth-child(8)').toggle();
						$(this).find('td:nth-child(9)').toggle();
						$(this).find('td:nth-child(10)').toggle();
						$(this).find('td:nth-child(11)').toggle();
					} else {
						// 各項目
						$(this).find('td:nth-child(13)').toggle();
						$(this).find('td:nth-child(14)').toggle();
						$(this).find('td:nth-child(15)').toggle();
						$(this).find('td:nth-child(16)').toggle();
						$(this).find('td:nth-child(17)').toggle();
						$(this).find('td:nth-child(18)').toggle();
						$(this).find('td:nth-child(19)').toggle();
						$(this).find('td:nth-child(20)').toggle();
						$(this).find('td:nth-child(21)').toggle();
						$(this).find('td:nth-child(22)').toggle();
						$(this).find('td:nth-child(23)').toggle();
						$(this).find('td:nth-child(24)').toggle();
						$(this).find('td:nth-child(25)').toggle();

						// ヘッダ
						$(this).find('th:nth-child(13)').toggle();
						$(this).find('th:nth-child(14)').toggle();
						$(this).find('th:nth-child(15)').toggle();
						$(this).find('th:nth-child(16)').toggle();
						$(this).find('th:nth-child(17)').toggle();
						$(this).find('th:nth-child(18)').toggle();
						$(this).find('th:nth-child(19)').toggle();
						$(this).find('th:nth-child(20)').toggle();
						$(this).find('th:nth-child(21)').toggle();
						$(this).find('th:nth-child(22)').toggle();
						$(this).find('th:nth-child(23)').toggle();
						$(this).find('th:nth-child(24)').toggle();
					}
				});

				// thead２行目用
				$('th.total').toggle();
			});

			$('.rowOpen.total').click(function() {
				$(this).parent('th').toggle();
				$(this).parent('th').prev('th').toggle();

				// tbody用
				var tbody = $("#ca_table tbody");
				$(tbody).find('tr').each(function() {
					if ($(this).children('td:eq(0)').text() == '年間') {
						// 各項目
						$(this).find('td:nth-child(1)').toggle();
						$(this).find('td:nth-child(2)').toggle();
						$(this).find('td:nth-child(3)').toggle();
						$(this).find('td:nth-child(4)').toggle();
						$(this).find('td:nth-child(5)').toggle();
						$(this).find('td:nth-child(6)').toggle();
						$(this).find('td:nth-child(7)').toggle();
						$(this).find('td:nth-child(8)').toggle();
						$(this).find('td:nth-child(9)').toggle();
						$(this).find('td:nth-child(10)').toggle();
						$(this).find('td:nth-child(11)').toggle();
					} else {
						// 各項目
						$(this).find('td:nth-child(13)').toggle();
						$(this).find('td:nth-child(14)').toggle();
						$(this).find('td:nth-child(15)').toggle();
						$(this).find('td:nth-child(16)').toggle();
						$(this).find('td:nth-child(17)').toggle();
						$(this).find('td:nth-child(18)').toggle();
						$(this).find('td:nth-child(19)').toggle();
						$(this).find('td:nth-child(20)').toggle();
						$(this).find('td:nth-child(21)').toggle();
						$(this).find('td:nth-child(22)').toggle();
						$(this).find('td:nth-child(23)').toggle();
						$(this).find('td:nth-child(24)').toggle();
						$(this).find('td:nth-child(25)').toggle();

						// ヘッダ
						$(this).find('th:nth-child(13)').toggle();
						$(this).find('th:nth-child(14)').toggle();
						$(this).find('th:nth-child(15)').toggle();
						$(this).find('th:nth-child(16)').toggle();
						$(this).find('th:nth-child(17)').toggle();
						$(this).find('th:nth-child(18)').toggle();
						$(this).find('th:nth-child(19)').toggle();
						$(this).find('th:nth-child(20)').toggle();
						$(this).find('th:nth-child(21)').toggle();
						$(this).find('th:nth-child(22)').toggle();
						$(this).find('th:nth-child(23)').toggle();
						$(this).find('th:nth-child(24)').toggle();
					}
				});

				// thead２行目用
				$('th.total').toggle();
			});

		},

		/**
		 * 数値を2桁文字列に変換
		 * @param obj
		 * @returns obj
		 */
		twodigit : function(obj) {
			if (obj < 10) {
			  obj = '0' + obj;
			}
			return obj;
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
			var defer = clutil.postDLJSON('AMBRV0040', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				if (data.rspHead.fieldMessages) {
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}

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
				if (this.$('#searchAgain').css('display') == 'none') {
					clutil.setFocus($('#ca_srch'));
				} else {
					clutil.setFocus($('#searchAgain'));
				}
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
			this.mdBaseView.options.btn_csv = false;
			this.mdBaseView.renderFooterNavi();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex, e) {
			// ope_btn 系
			switch(rtyp){
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
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}

		},

		_eof: 'AMBRV0040.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView(clcom.pageArgs).initUIElement().render();

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
