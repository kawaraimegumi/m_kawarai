// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
//			'change #ca_srchUnitID'			:	'_onSrchUnitChanged',	// 事業ユニットが変更された
//			'click #ca_btn_store_select'	:	'_onStoreSelClick',		// 店舗選択
			'change #ca_srchStatus'			:	'_onStatusChange',		// 状態変更時
			'click #ca_srch'				:	'_onSrchClick',			// 検索ボタン押下時

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

//			clutil.clbusunitselector(this.$('#ca_srchUnitID'));

			// 店舗部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});
			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					_this.$("#ca_srchStoreID").autocomplete("clAutocompleteItem", {id: id, code: code, name: name});
				} else {
					var chk = $("#ca_srchStoreID").autocomplete("clAutocompleteItem");
					if (chk == null || chk.id == 0)  {
						_this.AMPAV0010Selector.clear();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
			this.AMPAV0010Selector.render();
			this.AMPAV0010Selector.clear = function() {
				if (typeof mainView != "undefined") {
					_this.$("#ca_srchStoreID").autocomplete("removeClAutocompleteItem");
				}
			};

			// 店舗
			var userStore = {};
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				// 店舗階層ならユーザ店舗autocomplete初期値設定
				userStore = {
						id : clcom.userInfo.org_id,
						code : clcom.userInfo.org_code,
						name : clcom.userInfo.org_name,
				};
			}

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 検索日
				datepicker: {
					el: "#ca_srchFromDate",
				},
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID",
//					initValue: (clcom.userInfo) ? clcom.userInfo.unit_id : 0
				},
				// 店舗オートコンプリート
				clorgcode: {
					el: '#ca_srchStoreID',
					addDepends: ['p_org_id'],
					dependSrc: {
						p_org_id: 'unit_id'
					}
				},
				// 店舗参照ボタン
				AMPAV0010: {
					button: this.$('#ca_btn_store_select'),
					view: this.AMPAV0010Selector,
					showOptions: function(){
						return {
							org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
							               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
						};
					}
				},
			}, {
				dataSource: {
					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
//				console.log("done in!!!!");
			});

			// datepicker
//			clutil.datepicker(this.$("#ca_srchFromDate"));
			clutil.datepicker(this.$("#ca_srchToDate"));

//			this.storeAutocomplete = this.getOrg(clcom.userInfo.unit_id);

			// 状態selector
			var html_source = '';
			html_source += '<option value="0">&nbsp</option>';
			html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_TEMPORARY + '">一時保存</option>';
			html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_REGISTRIED + '">登録済</option>';
//			html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_PRINTED + '">印刷済</option>';
			$("#ca_srchStatus").html('');
			$("#ca_srchStatus").html(html_source).selectpicker().selectpicker('refresh');

			console.log(clcom.userInfo);
			// 初期値を設定
			this.deserialize({
				srchUnitID: (clcom.userInfo && clcom.userInfo.unit_id) ? clcom.userInfo.unit_id : 0,
				srchStoreID : (clcom.userInfo && (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN)) ? userStore : null,
				srchFromDate : 0,
				srchToDate : 0,
				srchStatus : amcm_type.AMCM_VAL_REGIST_STATE_TYPE_TEMPORARY,
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
//		/**
//		 * 指定プロパティ名（ ⇔ 検索 Req 上のメンバ名）の UI 設定値を取得する。
//		 * defaultVal は、設定値が無い場合に返す値。
//		 */
//		getValue: function(propName, defaultVal){
//			if(_.isUndefined(defaultVal)){
//				defaultVal = null;
//			}
//			if(!_.isString(propName) || _.isEmpty(propName)){
//				return defaultVal;
//			}
//			var dto = this.serialize();
//			var val = dto[propName];
//			return (_.isUndefined(val) || _.isNull(val) || _.isEmpty(val)) ? defaultVal : val;
//		},
		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			var retStat = true;

			if(!this.validator.valid()){
				retStat = false;
			}

			var dto = this.serialize();
			var status = Number(dto.srchStatus);
			if (status == amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_REGISTRIED) {
				if (dto.srchFromDate == '' && dto.srchToDate == '') {
					this.validator.setErrorMsg($('#ca_srchFromDate'), clmsg.EGM0031);
					this.validator.setErrorMsg($('#ca_srchToDate'), clmsg.EGM0031);
					retStat = false;
				}
			}

			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_srchFromDate',
				edval : 'ca_srchToDate'
			});
			if(!this.validator.validFromTo(chkInfo)){
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return false;
			}

			return true;
		},

		/**
		 * 事業ユニットが変更されたイベント
		 */
		_onSrchUnitChanged: function(e){
//			console.log($(e.target).val());
			if(this.deserializing){
				// データセット中
				return;
			}
			var unitID = Number($("#ca_srchUnitID").val());
			this.getOrg(unitID);
			this.storeAutocomplete.setValue();
			this.$("#ca_srchStoreID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_store_select").attr("disabled", (unitID == 0));
			this.AMPAV0010Selector.clear();
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){
			var unitID = Number($("#ca_srchUnitID").val());
			var options = {
				editList : null,
				isSubDialog : null,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id : (unitID == 0) ? 3 : unitID,
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE, am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
			};
			this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * 店舗オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: $("#ca_srchStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				}
			});
		},

		/**
		 * 状態変更処理
		 */
		_onStatusChange: function(e, load) {
//			var status = Number($(e.target).val());
			var status = Number($("#ca_srchStatus").selectpicker("val"));

			switch (status) {
			case amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_TEMPORARY:
//			case amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_REGISTRIED:
				clutil.viewReadonly($(".ca_srchFromDate_div"));
				clutil.viewReadonly($(".ca_srchToDate_div"));
				$("#ca_date_div").removeClass("required");
//				$("#ca_srchFromDate").removeClass("cl_required");
//				$("#ca_srchToDate").removeClass("cl_required");
				$("#ca_srchFromDate").datepicker("setIymd");
				$("#ca_srchToDate").datepicker("setIymd");
				break;

			case amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_REGISTRIED:
//			case amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_PRINTED:
				clutil.viewRemoveReadonly($(".ca_srchFromDate_div"));
				clutil.viewRemoveReadonly($(".ca_srchToDate_div"));
				$("#ca_date_div").addClass("required");
//				$("#ca_srchFromDate").addClass("cl_required");
//				$("#ca_srchToDate").addClass("cl_required");
				if (!load) {
					$("#ca_srchFromDate").datepicker("setIymd", clcom.getOpeDate());
					$("#ca_srchToDate").datepicker("setIymd", clcom.getOpeDate());
				}
				break;

			default:
				break;
			}
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

		_eof: 'AMIGV0010.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #searchAgain'			:	'_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click #ca_sample_download'		:	'_onSampleDLClick',		// ExcelサンプルDLボタン押下
		},

		initialize: function(){
			_.bindAll(this);
//			var _this = this;

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '不良品処理',
				subtitle: '一覧',
//				btn_csv: clcom.userInfo && clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ? false : true,
				btn_csv: false,
				opebtn_auto_enable: false		// false ⇒ 行選択のときに編集ボタンの活性化コントロールはアプリで制御する
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMIGV0010 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMIGV0010';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_table_tbody_template').html() )
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

			// 行選択イベント
			clutil.mediator.on('onRowSelectChanged', this._setOpeButtonUI);
		},

		/**
		 * テーブルのレコード選択の変更イベント
		 */
		_setOpeButtonUI: function(groupid, arg, from){
			var selectedRecs = arg.selectedRecs;
//			console.log(selectedRecs);
			console.log(clcom.userInfo);
			var edit = true;
			var del = true;
			if (selectedRecs.length == 0) {
				edit = false;
				del = false;
			}
			if (selectedRecs.length != 1) {
				del = false;
			}
			$.each(selectedRecs,function(){
				if (Number(this.status) > amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_TEMPORARY) {
					if (this.posSendStatus == amcm_type.AMCM_VAL_SEND_STATE_SENT) {	//送信済
						edit = false;
						del = false;
						return false;
					}
				}
			});
			this.setButtonEnable(edit, del);
		},

		/**
		 * ボタンの活性/非活性を設定する
		 */
		setButtonEnable: function(edit, del){
			if (edit) {
				this.$('#cl_edit').removeAttr('disabled');
			} else {
				this.$('#cl_edit').attr('disabled', 'disabled');
			}
			if (del) {
				this.$('#cl_delete').removeAttr('disabled');
			} else {
				this.$('#cl_delete').attr('disabled', 'disabled');
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var _this = this;
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			this.recListView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {
						AMIGV0010GetReq: clutil.view2data(this.$("#ca_srchArea"))
					};
					// ログインユーザー設定
					request.AMIGV0010GetReq.srchStaffID = clcom.userInfo.user_id;

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMIGV0010',
						data: request
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(this.srchCondView.validator.valid, this.srchCondView.validator)
				}
			});
			// 取込処理が失敗した。後処理が必要な場合は↓イベントを購読する。
			this.opeCSVInputCtrl.on('fail', function(data){
				if(data.rspHead.fieldMessages){
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					_this.srchCondView.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}
				if (data.rspHead.uri){
					// CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				}
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで

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
			// 初期値設定
			if (clcom.userInfo && (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) && clcom.userInfo.org_id){
				this.$(".ca_csv_uptake_div").addClass('dispn');
			} else {
				this.$(".ca_csv_uptake_div").removeClass('dispn');
			}
			clutil.viewReadonly($(".ca_srchFromDate_div"));
			clutil.viewReadonly($(".ca_srchToDate_div"));
			this.$("#ca_srchStatus").selectpicker('val', clutil.cStr(amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_TEMPORARY));

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
				AMIGV0010GetReq: srchReq
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
			if(groupid !== 'AMIGV0010'){
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
		 *
		 */
		_onToggleSelectAll: function(e) {
			console.log(e);
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMIGV0010', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMIGV0010GetRsp.defectiveList;
				if(_.isEmpty(recs)){
					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					// 画面を一旦リセット
					mainView.srchAreaCtrl.reset();
					// 検索ペインを表示
					mainView.srchAreaCtrl.show_srch();
					this.setButtonEnable(false, false);
					this.resetFocus(this.$('#ca_srchUnitID'));
					return;
				}

//				$.each(recs,function(){
//					this.statusDispName = clutil.gettypename(amcm_type.AMCM_TYPE_DEFECTIVE_STATE_TYPE, this.status, 1);
//					this.reasonTypeDispName = clutil.gettypename(amcm_type.AMCM_TYPE_DEFECT_REASON, this.reasonTypeID);
//				});

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);

				// 初期選択の設定（オプション）
				if(!_.isEmpty(chkData)){
					this.recListView.setSelectRecs(chkData, true, ['no',]);
				}

				if (clcom.userInfo && (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS)) {
					// Excelダウンロードボタンを表示する
					this.mdBaseView.options.btn_csv = true;
					this.mdBaseView.renderFooterNavi();
				}

				$("#ca_table .help").tooltip({html: true});

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
			var defer = clutil.postDLJSON('AMIGV0010', srchReq);
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
//			clutil.setFocus($('#ca_srchUnitID'));
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS) {
				clutil.setFocus($('#ca_srchUnitID'));
			} else if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF) {
				clutil.setFocus($('#ca_srchStoreID'));
			} else {
				clutil.setFocus($('#ca_srchStatus'));
			}
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			} else {
				// 適当な場所を select してフォーカスを入れる。
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
			this.mdBaseView.options.btn_csv = false;
			this.mdBaseView.renderFooterNavi();
		},

		/**
		 * サンプルファイルダウンロード
		 */
		_onSampleDLClick: function() {
			var sampleURL = "/public/sample/不良品処理一覧サンプル.xlsx";
			clutil.download(sampleURL);
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧画面では使用しない*/, e){
			var url = clcom.appRoot + '/AMIG/AMIGV0020/AMIGV0020.html';
			var myData, destData, selectedRecs;
			if(this.savedReq){
				// 検索結果がある場合
				selectedRecs = this.recListView.getSelectedRecs();
				myData = {
					btnId: e.target.id,
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMIGV0010GetReq,
					chkData: selectedRecs
				};
				var chkData;
				if (rtyp === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
					chkData = [ this.recListView.getLastClickedRec() ];
				} else if (rtyp === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
					chkData = [];
				} else {
					chkData = selectedRecs;
				}
				destData = {
					opeTypeId: rtyp,
					chkData: chkData
//					chkData: (rtyp === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL)
//					? [ this.recListView.getLastClickedRec() ] : selectedRecs
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
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
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
				destData.opeTypeId = rtyp;

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
				this.srchCondView._onStatusChange(null, true);
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}

		},

		_eof: 'AMIGV0010.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();
//		mainView.setFocus();
		
		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
		}
		
		mainView.srchCondView.fieldRelation.done(_.bind(function(){
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				clutil.inputReadonly($('#ca_srchStoreID'));
				clutil.inputReadonly($('#ca_btn_store_select'));
			}
			mainView.setFocus();
		}, this));
		
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
