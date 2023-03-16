useSelectpicker2();

$(function(){
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'				: '_onSrchClick'			// 検索ボタン押下時
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

			// 事業ユニット
			this.utl_unit = clutil.clbusunitselector({
				el: '#ca_srchUnitID',
				initValue: clcom.userInfo.unit_id
			});

			// 対象月 FIXME:暫定
			this.utl_month = clutil.clmonthselector(this.$('#ca_srchMonth'), 1, 1, 1, null, null, 1, null, 'd'); //TODO:初期表示調整(とりあえず前後1年)

			var date = clutil.ymd2date(clcom.getOpeDate());
			this.init_ope_month = '' + date.getFullYear() + ('0' + (date.getMonth() + 2)).slice(-2);	// FIXME 年月初期値

			// 初期値セット
			this.deserialize({
				srchUnitID	: clcom.userInfo.unit_id,	// 事業ユニットID
				srchMonth	: this.init_ope_month		// 対象月
			});

			// 初期フォーカスオブジェクト設定
			this.$tgtFocus = $('#ca_srchUnitID');

			// 初期活性制御
			this.setDefaultEnabledProp();

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);
		},

		render: function(){
			return this;
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

		setDefaultEnabledProp: function() {
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
				clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN){
				$("#div_ca_unitID").hide();
			}

			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS){
				if (clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.viewReadonly($("#div_ca_unitID"));
					this.$tgtFocus = $('#ca_srchMonth');
				}
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
			return this.validator.valid();
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 取引先コード・オートコンプリート設定チェック
			if(!this.isValid()){
				return;
			}
			if ($("#ca_srchArea").find('.cl_error_field').length > 0){
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return;
			}

			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMBPV0060.SrchCondView//'
	});


	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'		: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click #ca_fileDel_btn' 	: '_onDelFileClick',		// ファイル削除押下
			'click #ca_attachedFile'	: '_onFileDLClick'		    // 添付ファイル押下
		},

		initialize: function(opt){
			_.bindAll(this);

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});

			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '店舗日別計画通知入力',
					subtitle: '',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					btn_cancel: {label:'条件再設定', action:this._doCancel}
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// TODO:アプリ個別の View や部品をインスタンス化するとか・・・
			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// ファイルアップロード
			this.uploadResult = null;
			var fileUploadView = clutil.View.buildFileUploadButtonView(this.$("#ca_fileUp_btn"));
			fileUploadView.on('success', _.bind(function(file){
				//ファイルID,名称反映
				var line = '<a id="ca_attachedFile" class="cl_filedownld" target="_blank">' + file.filename + '</a>';
				var id = file.id;
				$("#ca_label").html(line);
				$("#ca_attachedFileID").val(id);

				this.uploadResult = file;
			}, this));

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);		// 検索ボタン押下イベント
			clutil.mediator.on('onOperation', this._doOpeAction);	// OPE系イベント

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			}
		},

		initGrid:function(){
			this.grid = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid',	// エレメント
				lineno			: false,			// 行番号表示する/しないフラグ。
				delRowBtn		: false,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: false 			// フッター部の新規行追加ボタンを使用するフラグ。
			});

			this.grid.getHeadMetadata = this.getHeadMetadata;
			this.grid.getMetadata = this.getMetadata;

			this.grid.render();
		},

		getHeadMetadata: function(rowIndex){
			return {
				columns: {
					prevDayDisp:
					{
						colspan	: '2'
					},
					dayDisp:
					{
						colspan	: '2'
					}
				}
			};
		},

		getMetadata: function(rowIndex){
			var warn = '';
			var checkData = this.gridData[rowIndex];

			if (checkData.warning == 1){
				warn = ' alertTip';
			}

			return {
				columns: {
					prevWDay_disp: {
						cssClasses: checkData.cl_pw_fDay + warn
					},
					wDay_disp: {
						cssClasses: checkData.cl_w_fDay + warn
					}
				}
			};
		},

		createGridData: function(){
			this.columns =
			[
			 	{
			 		id		: 'prevDayDisp',
			 		name	: '前年',
			 		field	: 'prevDayDisp',
			 		width	: 80
			 	},
			 	{
			 		id		: 'prevWDay_disp',
			 		//name	: '曜日',
			 		field	: 'prevWDay_disp',
			 		width	: 80,
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = value;
							if (options.dataContext.warning == 1){
								disp = value + '&nbsp;<span title="">&nbsp;&nbsp;!&nbsp;&nbsp;</span>';
							}
							return disp;
						}
					}
			 	},
			 	{
			 		id		: 'dayDisp',
			 		name	: '本年',
			 		field	: 'dayDisp',
			 		width	: 72
			 	},
			 	{
			 		id		: 'wDay_disp',
			 		//name	: '曜日',
			 		field	: 'wDay_disp',
			 		width	: 72,
					cellType:
					{
						formatter: function(value, options)
						{
							var disp = value;
							if (options.dataContext.warning == 1){
								disp = value + '&nbsp;<span title="">&nbsp;&nbsp;!&nbsp;&nbsp;</span>';
							}
							return disp;
						}
					}
			 	},
			 	{
			 		id		: 'storeComment',
			 		name	: '店舗通知事項',
			 		field	: 'storeComment',
			 		width	: 500,
					cellType 		: {
						type			: 'text',
						tflimit			: "len:50 zenkaku",
						validator		: "maxlen:50 zenkaku",
						isEditable: function(item){
							return (item.readonly.length == 0);
						}
					}
			 	},
			];
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){

			// 検索条件部を活性化する
			clutil.viewRemoveReadonly($("#ca_srchArea"));

			// 検索条件初期化
			this.srchCondView.deserialize({
				srchUnitID: clcom.userInfo.unit_id,
				srchMonth: this.srchCondView.init_ope_month
			});
			this.setInitializeValue();
			this.srchCondView.setDefaultEnabledProp();
			clutil.setFocus(this.srchCondView.$tgtFocus);

			// 検索結果クリア
			this.srchAreaCtrl.reset();

			// ヘッダメッセージをクリア
			this.mdBaseView.clear();

			// フッターボタン活性制御
			this.mdBaseView.setSubmitEnable(false);
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// TODO: 入力値エラー情報が入っていれば、個別 View へセットする。
				break;
			}
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

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			this.setInitializeValue();

			return this;
		},

		setInitializeValue: function(){
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			this.srchCondView.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {

			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
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
				//reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMBPV0060GetReq: srchReq
			};
			return req;
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行データ（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			this.clearResult();
			mainView.setSubmitEnable(false);
			mainView.canUpdate = false;

			var defer = clutil.postJSON('AMBPV0060', srchReq).done(_.bind(function(data){

				// データ取得
				var recs = data.AMBPV0060GetRsp.dayRecs;

				if (_.isEmpty(recs)) {
					mainView.srchAreaCtrl.reset();

					// エラーメッセージ表示
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

					// フォーカス設定
					this.resetFocus(this.srchCondView.$tgtFocus);

				} else {
					this._onDelFileClick();

					clutil.viewReadonly($("#ca_srchArea"));
					$("#searchAgain").text('検索条件を開く');

					var opeDate = clcom.getOpeDate();
					var w = ["","月","火","水","木","金","土","日"];
					$.each(recs,function(){
						var strPrevDay = this.prevDay.toString();
						var strDay = this.day.toString();

						this.prevDayDisp = Number(strPrevDay.substring(4,6)) + '/' + Number(strPrevDay.substring(6,8));
						this.dayDisp = Number(strDay.substring(4,6)) + '/' + Number(strDay.substring(6,8));

						this.prevWDay_disp = w[this.prevWDay];
						this.wDay_disp = w[this.wDay];

						if (this.prevWDay == this.wDay) {
							this.warning = 0;
						} else {
							this.warning = 1;
						}

						if (this.prevWDay == 7) {
							this.cl_pw_fDay = 'txtDanger';
						} else if (this.prevWDay == 6) {
							this.cl_pw_fDay = 'txtPrimary';
						} else {
							this.cl_pw_fDay = '';
						}

						if (this.f_holiday == 1) {
							this.cl_w_fDay = 'txtDanger';
						} else {
							if (this.wDay == 7) {
								this.cl_w_fDay = 'txtDanger';
							} else if (this.wDay == 6) {
								this.cl_w_fDay = 'txtPrimary';
							} else {
								this.cl_w_fDay = '';
							}
						}

						if (this.day <= opeDate) {
							this.readonly='readonly';
						}else{
							this.readonly = '';
							mainView.canUpdate = true;
						}
					});

					//添付ファイル
					if(data.AMBPV0060GetRsp.fileName != ""){
						var line = '<a id="ca_attachedFile" class="cl_filedownld" target="_blank">' + data.AMBPV0060GetRsp.fileName + '</a>';
						$("#ca_label").html(line);

						this.uploadResult = {
							id			: data.AMBPV0060GetRsp.fileId,
							uri			: data.AMBPV0060GetRsp.uri,
							filename	: data.AMBPV0060GetRsp.fileName
						};
					}

					this.getRsp = data.AMBPV0060GetRsp;

					// リクエストを保存。
					this.savedReq = srchReq;

					// 結果ペインを表示
					this.srchAreaCtrl.show_result();

					// フォーカスの設定
					if(typeof $focusElem != 'undefined') {
						this.resetFocus($focusElem);
					}

					// 登録ボタン活性制御
					mainView.setSubmitEnable(mainView.canUpdate);

					this.createGridData();
					this.initGrid();

					this.gridData = recs;

					var grigParam = {
						gridOptions		: {},				// データグリッドのオプション
						columns			: this.columns,		// カラム定義
						data			: this.gridData		// データ
					};

					this.grid.setData(grigParam);

					var dataRef = this.grid.getData();
					$.each(dataRef, function(){
						if (this.warning == 1){
							mainView.grid.setCellMessage(this._cl_gridRowId, 'prevWDay_disp', 'warn', '昨年と曜日が違っています');
							mainView.grid.setCellMessage(this._cl_gridRowId, 'wDay_disp', 'warn', '昨年と曜日が違っています');
						}
					});

					$.when($('#searchAgain')).done(function () {
						var $window = $(window);
						var offset = $('#searchAgain').offset();
						var location = {
							left	: offset.left - $window.scrollLeft(),
							top		: offset.top  - $window.scrollTop()
						};

					    if (location.top < 0){
					    	clcom.targetJump('searchAgain', 50);
					    }
					});
				}
			}, this)).fail(_.bind(function(data){

				this.srchAreaCtrl.reset();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				// フォーカスの設定
				this.resetFocus($focusElem);

			}, this));

			return defer;
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
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);

			// 検索実行
			this.doSrch(req);
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){

			if (this.$('#ca_srchArea').css('display') == 'none') {
				this.srchAreaCtrl.show_srch();
				$("#searchAgain").text('検索条件を閉じる');
				$("#searchAgain").fadeIn();
			} else {
				this.srchAreaCtrl.show_result();
				$("#searchAgain").text('検索条件を開く');
			}
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			console.warn('unsupported rtyp[' + rtyp + '] received.');
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			var data = args.data;

			switch(args.status){
			case 'OK':
				// TODO: args.data をアプリ個別 View へセットする。

				// TODO: 編集状態を設定する。

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					break;
				default:
					break;
				}
				break;

			case 'DONE':		// 確定済
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				break;

			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				break;
			}
		},

		isReadOnly: function() {
			var opeMode = this.options.opeTypeId;
			var readonly = false;
			if (opeMode == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL ||
				opeMode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
				opeMode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				readonly = true;
			}
			return readonly;
		},

		setReadOnlyAllItems: function(){
			if (typeof this.grid != 'undefined'){
				this.grid.setEditable(false);
			}
		},


		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex) {
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){

			// Reqを構築する。
			this.grid.stopEditing();

			var gridValid = this.grid.validate();
			if (gridValid){
				this.validator.setErrorHeader(clmsg.cl_echoback);
				this.grid.setCellMessages(gridValid);
				return null;
			}


			var dayRecs = this.grid.getData();

			if(dayRecs.length == 0) {
				return null;
			}

			$.each(dayRecs,function(){
				this.ymd = this.day;
				var dateObj = clutil.ymd2date(this.day);
				this.day = dateObj.getDate();
			});

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMBPV0060GetReq: this.savedReq.AMBPV0060GetReq,
				// 更新リクエスト
				AMBPV0060UpdReq: {
					recno 		: this.getRsp.recno,
					state 		: this.getRsp.state,
					fileId 		: this.getRsp.fileId,
					dayRecs		: dayRecs
				}
			};

			if (this.uploadResult != null) {
				updReq.AMBPV0060UpdReq.fileId = this.uploadResult.id;
			}

//return null;
			return {
				resId: clcom.pageId,	//'AMBPV0060',
				data: updReq
			};
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

			// 確定時用のデータを初期化
			this.savedReq = null;

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

		/**
		 * 添付ファイル削除押下
		 */
		_onDelFileClick: function(){
			$("#ca_label").html("");
			$("#ca_attachedFileID").val("");
			this.uploadResult = "";
		},

		/**
		 * 添付ファイルダウンロード
		 */
		_onFileDLClick: function(){

			//添付ファイルがあればダウンロード
			if(!_.isEmpty(this.uploadResult) && this.uploadResult.uri != ""){
				var uri = this.uploadResult.uri;
				var newWindow = false;
				clutil.download({url: uri, newWindow: newWindow});
			}
		},

		/**
		 * 「登録」/「削除」ボタンの活性/非活性を設定する
		 */
		setSubmitEnable: function(enable){
			if(enable){
				this.$('#mainColumnFooter .cl_submit').removeAttr('disabled').parent().removeClass('disable');
			}else{
				this.$('#mainColumnFooter .cl_submit').attr('disabled','disabled').parent().addClass('disable');
			}
		},

		_eof: 'AMBPV0060.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////

		// 一覧画面からの引継データ pageArgs があれば渡す。
		//	pageArgs: {
		//		// 機能種別
		//		opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL,
		//		// 一覧画面で選択されたアイテム要素の配列
		//		chkData: [
		//			{id:1,code:'code-001',name:'item-001',},
		//			{id:2,code:'code-002',name:'item-002',},
		//			{id:3,code:'code-003',name:'item-003',}
		//		]
		//	};
		mainView = new MainView(clcom.pageArgs).initUIElement().render();

		$("#mainColumnFooter").removeClass('x2');
		$("#mainColumnFooter p.right").hide();
		$("#mainColumnFooter p.left").hide();

		// 登録ボタン活性制御
		mainView.setSubmitEnable(false);

	}).fail(function(data){
		// clcom のネタ取得に失敗。
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});
