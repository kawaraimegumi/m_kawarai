useSelectpicker2();

$(function() {
	var AMMSV0090define = {
			ITEMATTRGRPFUNC_ID_SUBCLS1: 1,
			ITEMATTRGRPFUNC_ID_SUBCLS2: 2,
		};

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

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
			/*
			 * シスパラ
			 */
			var PAR_AMCM_YEAR_FROM = Number(clcom.getSysparam(amcm_sysparams.PAR_AMCM_YEAR_FROM));
			var PAR_AMCM_YEAR_TO = Number(clcom.getSysparam(amcm_sysparams.PAR_AMCM_YEAR_TO));

			clutil.inputlimiter(this.$el);

			// メーカーコードオートコンプリート
//			clutil.clvendorcode($("#ca_srchMakerID"), {
//				getVendorTypeId: function() {
//					// 取引先区分＝メーカー
//					return amcm_type.AMCM_VAL_VENDOR_MAKER;
//				},
//			});

			// シーズン(未選択あり)
			clutil.cltypeselector($("#ca_srchSeasonID"), amcm_type.AMCM_TYPE_SEASON, 1);

			// 更新日
			clutil.datepicker($("#ca_srchUpdFrom"));
			clutil.datepicker($("#ca_srchUpdTo"));

			// 商品展開年(1990年から未来3年で表示, 未選択あり)）
			clutil.clyearselector({
				el: "#ca_srchYear",
				from: 1990,
				future: 3
			});

			// 更新者
			clutil.clusercode2($("#ca_srchUpdUserID"));

			// 承認状態
			this.utl_approve = clutil.cltypeselector({
				el		: '#ca_srchItemApproveTypeID',
				kind	: amcm_type.AMCM_TYPE_ITEM_APPROVE
			});

			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrpID"
				},
				clvendorcode: {
					el: "#ca_srchMakerID",
					dependAttrs: {
						vendor_typeid: amcm_type.AMCM_VAL_VENDOR_MAKER,
					},
					rmDepends:['itgrp_id'],
					addDepends:['unit_id'],
				},
				// サブクラス１
				'clitemattrselector subclass1': {
					el: "#ca_srchSub1ID",
					dependSrc: {
						iagfunc_id: 'iagfunc_id1'
					}
				},
				// サブクラス２
				'clitemattrselector subclass2': {
					el: "#ca_srchSub2ID",
					dependSrc: {
						iagfunc_id: 'iagfunc_id2'
					}
				}
			}, {
				dataSource: {
					iagfunc_id1: AMMSV0090define.ITEMATTRGRPFUNC_ID_SUBCLS1,
					iagfunc_id2: AMMSV0090define.ITEMATTRGRPFUNC_ID_SUBCLS2
				}
			});
			this.fieldRelation.done(function() {

			});

			var unit = null;
			var unit_id = clcom.getUserData().unit_id;
			if(unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI') ||
			   unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				unit = unit_id;
				//clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}

			// 初期値を設定
			this.deserialize({
				srchUnitID: unit,					// 事業ユニットID
				srchItgrpID: 0,						// 品種ID
				srchMakerID: 0,						// メーカーID
				srchYear: 0,						// 商品展開年
				srchSeasonID: 0,					// シーズン
				srchSub1ID: 0,						// サブクラス１
				srchSub2ID: 0,						// サブクラス１
				srchCode: null,						// メーカー品番
				srchUpdUserID: 0,					// 更新者
				srchUpdFrom: 0,						// 更新日From
				srchUpdTo: 0,						// 更新日To
			});
		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			var data = clutil.view2data(this.$el);
			data.srchItemApproveTypeID = _.map(data.srchItemApproveTypeID, Number);
			return data;
		},

		/**
		 * 検索リクエストパケットの設定値を UI へセットする。
		 */
		deserialize: function(obj){
			this.deserializing = true;
			try{
				var dto = _.extend({}, obj);
				clutil.data2view(this.$el, dto, null, true);
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
			// 品種コード・オートコンプリート設定チェック
			if(!this.$('#ca_srchItgrpID').autocomplete('isValidClAutocompleteSelect')){
				// エラーメッセージを通知。
				var arg = {
					_eb_: '品種コードの選択が正しくありません。選択肢の中から指定してください。',
					srchItgrpID: '選択肢の中から指定してください。'
				};
				this.validator.setErrorInfo(arg, {prefix: 'ca_'});
				f_valid =  false;
			}
			if (!this.validator.validFromToObj([{
				$stval: $("#ca_srchUpdFrom"),
				$edval: $("#ca_srchUpdTo")
			}])) {
				f_valid = false;
			}
			return f_valid;
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 商品分類体系コード/商品分類階層/上位分類コード・オートコンプリート設定チェック
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			//this.trigger('ca_onSearch', dto);
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMSSV0090.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #searchAgain'		: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click a[name="pdf_output"]:not([disabled])': 'doDownload'
		},

		mediatorEvents: {
			onRowSelectChanged: function(){
				this.validButtons();
			}
		},

		isValidDelBtn: function(){
			var disabled = true,
				selectedRecs = this.recListView.getSelectedRecs(),
				item = _.first(selectedRecs);

			if (selectedRecs.length === 1 &&
				item.reapproveTypeID === 0 &&
				(item.approveTypeID === amcm_type.AMCM_VAL_ITEM_APPROVE_TEMP ||
				 item.approveTypeID === amcm_type.AMCM_VAL_ITEM_APPROVE_TAGRET)){
				disabled = false;
			}

			return !disabled;
		},

		validButtons: function(){
			var canEdit = true,
				canDup = true,
				canDel = true,
				canCopy = true,
				selectedRecs = this.recListView.getSelectedRecs();

			if (_.isEmpty(selectedRecs)) {
				canEdit = canDup = canDel = canCopy = false;
			}

			if (canDel) {
				canDel = this.isValidDelBtn();
			}
			if (canCopy) {
				if (selectedRecs.length !== 1) {
					canCopy = false;
				}
			}

			if (_.some(selectedRecs, function(item){
				return item.editableFlag === 0;
			})) {
				canEdit = false;
				canDel = false;
			}

			clutil.inputReadonly('#cl_delete', !canDel);
			clutil.inputReadonly('#cl_edit', !canEdit);
			clutil.inputReadonly('#cl_copy', !canDup);
			clutil.inputReadonly('#cl_copy', !canCopy);
		},

		initialize: function(){
			_.bindAll(this);

			if (!clcom.pushpop.popable){
				clcom._preventConfirm = true;
			}

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '商品発注兼振分',
				subtitle: '一覧',
				btn_csv: true,
				backBtnURL: clcom.pushpop.popable ? null : false
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMMSV0110 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMMSV0110';

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
//			'click div#title p.addNew>a'	: '_onNewClick',			// 新規押下
//			'click #ca_edit'				: '_onEditClick',			// 編集ボタン押下
//			'click #ca_delete'				: '_onDeleteClick',			// 削除ボタン押下
//			'click #ca_rsvcancel'			: '_onReserveCancelClick'	// 予約取消ボタン押下
			clutil.mediator.on('onOperation', this._doOpeAction);

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});

			this.listenTo(clutil.mediator, this.mediatorEvents);
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
				AMMSV0110GetReq: srchReq,
				AMMSV0110ReportReq: {},
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
			if(groupid !== 'AMMSV0110'){
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

			var defer = clutil.postJSON('AMMSV0110', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMMSV0110GetRsp.itemList;
				if(_.isEmpty(recs)){
					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					// 検索ペインを表示
					mainView.srchAreaCtrl.reset();
					mainView.srchAreaCtrl.show_srch();
					this.resetFocus($("#ca_srchUnitID"));
				} else {

					// リクエストを保存。
					this.savedReq = srchReq;

					// 結果ペインを表示
					this.srchAreaCtrl.show_result();

					// 内容物がある場合 --> 結果表示する。
					this.recListView.setRecs(recs);
					this.recListView.setDeletedRowUI(function(dto) {
						return dto.delFlag != 0;
					});
					// delFlagのある行はaタグをdisabledにする
					var $tbody = $("#ca_table_tbody");
					_.each(recs, _.bind(function(dto, i) {
						var $tr = $tbody.children('tr').eq(i);
						var $a = $tr.find('a');
						if (dto.delFlag != 0) {
							$a.attr('disabled', true);
							$a.addClass('dispn');
						}
					}, this));

					// PDF出力リンク処理を追加
					//this.addPDFOutput();

					// 初期選択の設定（オプション）
					if(!_.isEmpty(selectedIds)){
						this.recListView.setSelectById(selectedIds, true);
					}

					this.validButtons();

					this.resetFocus($focusElem);
				}
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
		 * PDF出力リクエスト
		 * @param id 商品一括登録ID
		 * @param reapproveTypeID 再承認
		 * @param approveTypeID 承認状態
		 */
		doDownload: function(e) {
			var $tgt = $(e.target);
			var $tr = $tgt.parent().parent();
			var id = $tr[0].id;

			var defer = clutil.postDLJSON('AMMSV0120', {
				AMMSV0120GetReq: {
					srchID: id
				},
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF
				}
			});
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

//		/**
//		 * PDF出力リンクにイベントを追加する
//		 */
//		addPDFOutput: function() {
//			var _this = this;
//
//			$.each($("#ca_table_tbody tr"), function() {
//				var $tr = $(this);
//				var $a = $tr.find('a[name="pdf_output"]');
//				var $td_reapproveTypeID = $tr.find('td[name="ca_reapproveTypeID"]');
//				var $td_approveTypeID = $tr.find('td[name="ca_approveTypeID"]');
//
//				var id = this.id;
//				var reapproveTypeID = $td_reapproveTypeID.attr("reapproveTypeID");
//				var approveTypeID = $td_approveTypeID.attr("approveTypeID");
//
//				$a.click(function() {
//					_this.doDownload(id, reapproveTypeID, approveTypeID);
//				});
//			});
//		},

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
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧では使用しない*/, e){
			if ($(e.target).is('a[name="pdf_output"]') || $(e.target).is('td[name="td_pdf_output"]')) {
				return;
			}

			var url = clcom.appRoot + '/AMMS/AMMSV0120/AMMSV0120.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMMSV0110GetReq,
					selectedIds: this.recListView.getSelectedIdList()
				};
				var chkData;
				if (rtyp == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
					chkData = [];
				} else {
					chkData = this.recListView.getSelectedRecs();
				}
				destData = {
					opeTypeId: rtyp,
					srchDate: this.savedReq.srchDate,
					chkData: chkData
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
				this.doSrch(model.savedReq, model.selectedIds, $('#' + model.btnId));
			} else {
				this.resetFocus($("#ca_srchUnitID"));
			}

		},

		_eof: 'AMSSV0110.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();
		
		//初期フォーカス
		var $tgt = null;
		if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
			$tgt = mainView.$("#ca_srchItgrpID");
		}
		else{
			$tgt = mainView.$("#ca_srchUnitID");
		}
		clutil.setFocus($tgt);

		if(clcom.pageArgs){
			clutil.postJSON('am_pa_variety_srch', {
				cond: {
					itgrp_id: clcom.pageArgs.data.vpItgrpID
				}
			}).done(function(data){
				var itgrp = data.itgrplist[0];
				if (itgrp){
					// とりあえず他画面から飛んできた場合は承認状態に差戻し系の
					// ものをセットする
					var cond = {
						srchItemApproveTypeID: [
							amcm_type.AMCM_VAL_ITEM_APPROVE_TAGRET,		// タグ発行差戻し
							amcm_type.AMCM_VAL_ITEM_APPROVE_RET		// 最終承認差戻し
						],
						srchUpdUserID: {
							id:clcom.userInfo.user_id,
							code: clcom.userInfo.user_code,
							name: clcom.userInfo.user_name
						},
						srchItgrpID: {
							id: itgrp.itgrp_id,
							code: itgrp.code,
							name: itgrp.name
						}
					};
					if (itgrp.unit_id) {
						cond.srchUnitID = itgrp.unit_id;
					}
					mainView.load({
						savedCond: cond
					});
					mainView.srchCondView.fieldRelation.done(function(){
						var req = mainView.buildReq();
						// 検索実行
						mainView.doSrch(req);
					});
				}
			}).fail(function(data){
				// TODO エラー処理
			});
		}
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
