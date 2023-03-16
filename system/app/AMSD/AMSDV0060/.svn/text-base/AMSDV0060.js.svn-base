useSelectpicker2();

$(function() {
	var AMSDV0060define = {
		IAGFUNC_ID_SUBCLS1: 1,
		IAGFUNC_ID_SUBCLS2: 2,
		IAGFUNC_ID_COLOR: 4,
		IAGFUNC_ID_STYLE: 7,
	};

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),

		events: {
			'click #ca_srch':			'_onSrchClick',			// 検索ボタン押下時
			'change #ca_srchUnitID':	'_onChangeSrchUnitID',	// 事業ユニット選択イベント
			'change #ca_srchItgrpID':	'_onChangeSrchItgrpID',	// 品種選択イベント
		},

		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		itgrpListAoki: [],
		itgrpListOrihica: [],

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			/*
			 * シスパラ
			 */
			var PAR_AMCM_YEAR_FROM = Number(clcom.getSysparam(amcm_sysparams.PAR_AMCM_YEAR_FROM));
			var PAR_AMCM_YEAR_TO = Number(clcom.getSysparam(amcm_sysparams.PAR_AMCM_YEAR_TO));

			clutil.inputlimiter(this.$el);

			// シーズン(未選択あり)
			clutil.cltypeselector($("#ca_srchSeasonID"), amcm_type.AMCM_TYPE_SEASON, 1);

			// タグ種別(未選択あり)
			clutil.cltypeselector($("#ca_srchTagTypeTypeID"), amcm_type.AMCM_TYPE_TAG, 1);


			// 検索日
			//clutil.datepicker($('#ca_srchDate'));

			// 日付
			clutil.datepicker($("#ca_srchStStLastFrom"));
			clutil.datepicker($("#ca_srchStStLastTo"));
			clutil.datepicker($("#ca_srchBaStLastFrom"));
			clutil.datepicker($("#ca_srchBaStLastTo"));

			// 更新日
			clutil.datepicker($("#ca_srchUpdFrom"));
			clutil.datepicker($("#ca_srchUpdTo"));

			// メーカーコードオートコンプリート
//			clutil.clvendorcode($("#ca_srchMakerID"), {
//				getVendorTypeId: function() {
//					// 取引先区分＝メーカー
//					return amcm_type.AMCM_VAL_VENDOR_MAKER;
//				},
//			});

			// 品種（複数）
			clutil.clvarietyselector($("#ca_srchItgrpID"));	// 初期値空白

			// サブクラス1
			clutil.clitemattrselector2($("#ca_srchSub1ID"), AMSDV0060define.IAGFUNC_ID_SUBCLS1, null, 1);
			// サブクラス2
			clutil.clitemattrselector2($("#ca_srchSub12D"), AMSDV0060define.IAGFUNC_ID_SUBCLS2, null, 1);

			// カラー
			clutil.clitemattrselector($("#ca_srchColorID"), AMSDV0060define.IAGFUNC_ID_COLOR, 0, 1);

			// スタイル
			clutil.clitemattrselector($("#ca_srchStyleID"), AMSDV0060define.IAGFUNC_ID_STYLE, 0, 1);

			// 商品展開年(過去10年、未来1年で表示, 未選択あり)）
			clutil.clyearselector($("#ca_srchYearFrom"), 1, PAR_AMCM_YEAR_TO, PAR_AMCM_YEAR_FROM);
			clutil.clyearselector($("#ca_srchYearTo"), 1, PAR_AMCM_YEAR_TO, PAR_AMCM_YEAR_FROM);


			// 更新者
			clutil.clusercode2($("#ca_srchUpdUserID"));

			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 検索日
				datepicker: {
					el: "#ca_srchDate",
				},
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
//				// 品種オートコンプリート
//				clvarietycode: {
//					el: "#ca_srchItgrpID",
//				},
				// メーカー
				clvendorcode: {
					el: "#ca_srchMakerID",
					dependAttrs: {
						vendor_typeid: amcm_type.AMCM_VAL_VENDOR_MAKER,
					},
					rmDepends:['itgrp_id'],
					addDepends:['unit_id'],
				},
//				// サブクラス１
//				'clitemattrselector subclass1': {
//					el: "#ca_srchSub1ID",
//					dependSrc: {
//						iagfunc_id: 'iagfunc_id1'
//					},
//				},
//				// サブクラス２
//				'clitemattrselector subclass2': {
//					el: "#ca_srchSub2ID",
//					dependSrc: {
//						iagfunc_id: 'iagfunc_id2'
//					},
//				},
			}, {
				dataSource: {
					iagfunc_id1: AMSDV0060define.IAGFUNC_ID_SUBCLS1,
					iagfunc_id2: AMSDV0060define.IAGFUNC_ID_SUBCLS2,
				}
			});
			this.fieldRelation.done(function() {
				console.log('relation done');
			});

			var unit = null;
			var unit_id = clcom.getUserData().unit_id;
			if(unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| unit_id == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				unit = unit_id;
				//clutil.viewReadonly($("#ca_srchUnitIDArea"));
			}

			// 初期値を設定
			this.deserialize({
				srchUnitID: unit,					// 事業ユニットID
				srchItgrpID: null,					// 品種ID
				tgtItemFlag: 1,						// 通常商品フラグ
				tgtPackItemFlag: 1,					// 集約商品フラグ
				tgtSortPackItemFlag: 0,				// 振分用集約商品フラグ
				srchMakerItemCode: null,			// メーカー品番
				srchName: null,						// 商品名称
				srchYearFrom: 0,					// 商品展開年From
				srchYearTo: 0,						// 商品展開年To
				srchSeasonID: 0,					// シーズン
				srchSub1ID: 0,						// サブクラス１
				srchSub2ID: 0,						// サブクラス１
				srchColorID: 0,						// カラー
				srchStyleID: 0,						// スタイル
				srchStStLastFrom: 0,				// 基準在庫推奨値最終算出日From
				srchStStLastTo: 0,					// 基準在庫推奨値最終算出日To
				srchBaStLastFrom: 0,				// 基準在庫最終更新日From
				srchBaStLastTo: 0,					// 基準在庫最終更新日To
				srchUpdUserID: 0,					// 更新者
				srchUpdFrom: 0,						// 更新日From
				srchUpdTo: 0,						// 更新日To
			});

		},

		arrayStr2Num: function(array) {
			if (array == null || array.length == 0) {
				array = [];
			} else {
				for (var i = 0; i < array.length; i++) {
					if (typeof array[i] == 'string') {
						array[i] = Number(array[i]);
					}
				}
			}
			return array;
		},
		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			var dto = clutil.view2data(this.$el);

			dto.srchItgrpID = this.arrayStr2Num(dto.srchItgrpID);
			dto.srchSeasonID = this.arrayStr2Num(dto.srchSeasonID);
			dto.srchSub1ID = this.arrayStr2Num(dto.srchSub1ID);
			dto.srchSub2ID = this.arrayStr2Num(dto.srchSub2ID);
			dto.srchColorID = this.arrayStr2Num(dto.srchColorID);
			dto.srchStyleID = this.arrayStr2Num(dto.srchStyleID);

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
			// 品種コード・オートコンプリート設定チェック
//			if(!this.$('#ca_srchItgrpID').autocomplete('isValidClAutocompleteSelect')){
//				// エラーメッセージを通知。
//				var arg = {
//					_eb_: '品種コードの選択が正しくありません。選択肢の中から指定してください。',
//					srchItgrpID: '選択肢の中から指定してください。'
//				};
//				this.validator.setErrorInfo(arg, {prefix: 'ca_'});
//				f_valid = false;
//			}

			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				// 更新日
				stval : 'ca_srchUpdFrom',
				edval : 'ca_srchUpdTo'
			});
			chkInfo.push({
				// 基準在庫推奨値最終算出日
				stval : 'ca_srchStStLastFrom',
				edval : 'ca_srchStStLastTo'
			});
			chkInfo.push({
				// 基準在庫最終算出日
				stval : 'ca_srchBaStLastFrom',
				edval : 'ca_srchBaStLastTo'
			});
			chkInfo.push({
				// 展開年度
				stval : 'ca_srchYearFrom',
				edval : 'ca_srchYearTo',
				nullIsZero: true
			});

			if (!this.validator.valid()) {
				f_valid = false;
			}

			// 反転エラー確認
			if(!this.validator.validFromTo(chkInfo)){
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

		/**
		 * 事業ユニット変更処理
		 */
		_onChangeSrchUnitID: function(e) {
			var unit_id = $("#ca_srchUnitID").selectpicker('val');
			var func_id = clcom.getSysparam("PAR_AMMS_DEFAULT_ITGRP_FUNCID");
			var $ca_srchItgrpID = $("#ca_srchItgrpID");
			var $div_itgrp = $ca_srchItgrpID.parent();
			if (!unit_id || unit_id == '0') {
				// 未選択の場合は品種を操作不可に
				clutil.inputReadonly($ca_srchItgrpID);
			} else {
				// 選択ありなら品種を操作可に
				clutil.inputRemoveReadonly($ca_srchItgrpID);
			}
			clutil.clvarietyselector($ca_srchItgrpID, func_id, unit_id, 1);
			$ca_srchItgrpID.trigger('change');	// Changeイベントをトリガー
		},

		/**
		 * 品種変更処理
		 */
		_onChangeSrchItgrpID: function(e) {
			var $ca_srchItgrpID = $("#ca_srchItgrpID");
			var itgrpIDs = $ca_srchItgrpID.selectpicker('val');
			var $ca_srchSub1ID = $("#ca_srchSub1ID");
			var $ca_srchSub2ID = $("#ca_srchSub2ID");
			var $div_srchSub1ID = $ca_srchSub1ID.parent();
			var $div_srchSub2ID = $ca_srchSub2ID.parent();

			if (itgrpIDs == null || itgrpIDs.length == 0) {
				// 未選択の場合はサブクラス1,2を操作不可に
				clutil.inputReadonly($ca_srchSub1ID, true);
				clutil.inputReadonly($ca_srchSub2ID, true);
			} else {
				// 選択ありの場合はサブクラス1,2を操作可に
				clutil.inputReadonly($ca_srchSub1ID, false);
				clutil.inputReadonly($ca_srchSub2ID, false);

				for (var i = 0; i < itgrpIDs.length; i++) {
					if (typeof itgrpIDs[i] == 'string') {
						itgrpIDs[i] = Number(itgrpIDs[i]);
					}
				}
			}
			clutil.clitemattrselector2($ca_srchSub1ID, AMSDV0060define.IAGFUNC_ID_SUBCLS1, itgrpIDs, 1);
			clutil.clitemattrselector2($ca_srchSub2ID, AMSDV0060define.IAGFUNC_ID_SUBCLS2, itgrpIDs, 1);
		},

		_eof: 'AMSSV0090.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #searchAgain':	'_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click #ca_AMDSV0150':	'_onClickAMDSV0150',	// 基準在庫一括取込遷移

			'click #cl_AMSDC0150':	'_onDownloadAMSDC0150',	// 最低在庫・サイズ構成比確認ファイル出力
		},

		resizeTimer: false,

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '基準在庫',
				subtitle: '推奨値算出',
				btn_new: false,
//				btns_dl: [
//					{
//						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV,
//						label: '推奨値ファイル出力'
//					}
//				],
				btn_csv: false,
				opebtn_auto_enable: false,
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMSDV0060 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMSDV0060';

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
			clutil.mediator.on('onRowSelectChanged', this._setOpeButtonUI);

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
				reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMSDV0060GetReq: srchReq
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
			if(groupid !== 'AMSDV0060'){
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
		 * 行選択時のイベント（行が選択されたらExcelダウンロードを活性化）
		 */
		_setOpeButtonUI: function(groupid, arg, from) {
			var opeDate = clcom.getOpeDate();
			var selectedRecs = (arg && _.isArray(arg.selectedRecs)) ? arg.selectedRecs : [];
			var $cl_AMSDC0150 = this.$("#cl_AMSDC0150");

			if (selectedRecs == null || selectedRecs.length == 0) {
				this.mdBaseView.options.btns_dl = null;
				$cl_AMSDC0150.attr("disabled", true);
			} else {
				this.mdBaseView.options.btns_dl = [
					{
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV,
						label: '推奨値ファイル出力'
					},
				];
				$cl_AMSDC0150.removeAttr("disabled");
			}
			this.mdBaseView.renderFooterNavi();
		},

		checkRecs: function(recs) {
			_.each(recs, function(r) {
				switch (r.autoType) {
				case 0:
					r.autoTypeStr = "自動停止して通知する";
					break;
				case amcm_type.AMCM_VAL_AUTODIST_LOGIC_ONE:
					r.autoTypeStr = "店舗ランク上位から1つずつ";
					break;
				case amcm_type.AMCM_VAL_AUTODIST_LOGIC_FULL:
					r.autoTypeStr = "店舗ランク上位から振分数";
					break;
				default:
					r.autoTypeStr = "";
					break;
				}
			});
			return recs;
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedIds, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMSDV0060', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMSDV0060GetRsp.itemList;
				if(_.isEmpty(recs)){
					// 検索ペインを表示？
					mainView.srchAreaCtrl.reset();
					mainView.srchAreaCtrl.show_srch();

					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					return;
				}

				recs = this.checkRecs(recs);

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
		 * 品種取得
		 * @param itgrpID
		 */
		doSrchStdItgrp: function(itgrpID) {
			var userData = clcom.getUserData();
			var srchDate = clcom.getOpeDate();
			var req = {
				cond: {
					srchFromDate: srchDate,
					itgrp_id: itgrpID,
				},
			};
			var url = "am_pa_variety_srch";
			clutil.postJSON(url, req).done(_.bind(function(data) {
				// 品種を表示
				var itgrplist = data.itgrplist;
				if (itgrplist != null && itgrplist.length > 0) {
					var srchItemApproveTypeID;
					if (clcom.srcId == "AMCMV0110") {
						srchItemApproveTypeID = [amcm_type.AMCM_VAL_ITEM_APPROVE_TAGRET, amcm_type.AMCM_VAL_ITEM_APPROVE_RET];
					} else {
						srchItemApproveTypeID = [];
					}
					// 2件以上はとりあえず無視
					var srchData = {
						srchUnitID: itgrplist[0].unit_id,
						srchItgrpID: {
							id: itgrplist[0].itgrp_id,
							code: itgrplist[0].code,
							name: itgrplist[0].name
						},
						srchUpdUserID: {
							id: userData.user_id,
							code: userData.user_code,
							name: userData.user_name,
						},
						srchDate: srchDate,
						srchItemApproveTypeID: srchItemApproveTypeID,
					};
					this.srchCondView.deserialize(srchData);
					//$("#ca_srchItgrpID").autocomplete('clAutocompleteItem', item);
				}
			}, this)).fail(_.bind(function(data) {
				// さてどうしよう？
			}));
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
			srchReq.AMSDV0060GetReq.downloadType = downloadType;
			srchReq.AMSDV0060GetReq.itemList = this.recListView.getSelectedRecs();

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMSDV0060', srchReq);
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
					savedCond: this.savedReq.AMSDV0060GetReq,
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

		codeNameStr: function(code, name) {
			var str = "";
			var xcode = code || "";
			var xname = name || "";
			if (xcode != "" && xname != "") {
				str = xcode + ":" + xname;
			} else if (xcode != "") {
				str = xcode;
			} else if (xname != "") {
				str = xname;
			}
			return str;
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
		 * 基準在庫一括取込へ遷移
		 */
		_onClickAMDSV0150: function(e) {
			var url = clcom.appRoot + '/AMDS/AMDSV0150/AMDSV0150.html';

			clcom.pushPage({
				url: url,
				args: {},
				newWindow: true,
			});
		},

		_eof: 'AMSDV0060.MainView//'
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
