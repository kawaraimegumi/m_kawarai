useSelectpicker2();

$(function() {
	var AMMSV0090define = {
		ITEMATTRGRPFUNC_ID_SUBCLS1: 1,
		ITEMATTRGRPFUNC_ID_SUBCLS2: 2,
	};

	var MyOpeType = {
		AM_PROTO_COMMON_RTYPE_CSV_CODE: 201,
		AM_PROTO_COMMON_RTYPE_CSV_COLORSIZE: 202,
		AM_PROTO_COMMON_RTYPE_CSV_TAG: 203,
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

			// シーズン(未選択あり)
			clutil.cltypeselector($("#ca_srchSeasonID"), amcm_type.AMCM_TYPE_SEASON, 1);

			// タグ種別(未選択あり)
			clutil.cltypeselector($("#ca_srchTagTypeTypeID"), amcm_type.AMCM_TYPE_TAG, 1);


			// 検索日
			//clutil.datepicker($('#ca_srchDate'));

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

			// 商品展開年(過去10年、未来1年で表示, 未選択あり)）
			clutil.clyearselector($("#ca_srchYear"), 1, PAR_AMCM_YEAR_TO, PAR_AMCM_YEAR_FROM);

			// 承認状態
			this.utl_approve = clutil.cltypeselector({
				el		: '#ca_srchItemApproveTypeID',
				kind	: amcm_type.AMCM_TYPE_ITEM_APPROVE,
	    	});


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
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_srchItgrpID",
				},
				// メーカー
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
					},
				},
				// サブクラス２
				'clitemattrselector subclass2': {
					el: "#ca_srchSub2ID",
					dependSrc: {
						iagfunc_id: 'iagfunc_id2'
					},
				},
			}, {
				dataSource: {
					iagfunc_id1: AMMSV0090define.ITEMATTRGRPFUNC_ID_SUBCLS1,
					iagfunc_id2: AMMSV0090define.ITEMATTRGRPFUNC_ID_SUBCLS2,
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
				srchUnitID: unit,						// 事業ユニットID
				srchItgrpID: 0,						// 品種ID
				//srchMakerID: 0,						// メーカーID
				srchMakerItemCode: null,			// メーカー品番
				srchYear: 0,						// 商品展開年
				srchSeasonID: 0,					// シーズン
				srchSub1ID: 0,						// サブクラス１
				srchSub2ID: 0,						// サブクラス１
				srchName: null,						// 商品名称
				srchUpdUserID: 0,					// 更新者
				srchUpdFrom: 0,						// 更新日From
				srchUpdTo: 0,						// 更新日To
				srchDate: clcom.getOpeDate(),		// 検索日
				allHistFlag: 0,						// 全検索フラグ
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
				//最終来店日
				stval : 'ca_srchUpdFrom',
				edval : 'ca_srchUpdTo'
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

		_eof: 'AMSSV0090.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #searchAgain'	: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
		},

		resizeTimer: false,

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '商品マスタ',
				subtitle: '一覧',
//				btns_dl: [
//					{
//						opeTypeId: MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_CODE,
//						label: '品番別Ｅｘｃｅｌデータ出力'
//					},
//					{
//						opeTypeId: MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_COLORSIZE,
//						label: 'カラーサイズ別Ｅｘｃｅｌデータ出力'
//					}
//				],
				btn_csv: false,
				opebtn_auto_enable: false,
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMMSV0090 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMMSV0090';

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
				AMMSV0090GetReq: srchReq
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
			if(groupid !== 'AMMSV0090'){
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

		_setOpeButtonUI: function(groupid, arg, from) {
			var opeDate = clcom.getOpeDate();
			var selectedRecs = (arg && _.isArray(arg.selectedRecs)) ? arg.selectedRecs : [];

			var ope1SelectedRecs = selectedRecs;	// 編集可能フラグ
			var ope2SelectedRecs = selectedRecs;	// 削除不可リスト
			var ope3SelectedRecs = selectedRecs;	// 申請中リスト
			var ope4SelectedRecs = selectedRecs;	// タグ発行申請可能リスト
			var ope5SelectedRecs = selectedRecs;	// 最終申請可能リスト

			ope1SelectedRecs = _.filter(arg.selectedRecs, function(dto) {
				return dto.editableFlag == 0;
			});
			ope2SelectedRecs = _.filter(arg.selectedRecs, function(dto) {
				/*
				 * 削除可能なもの
				 * ・新規の一時保存
				 * ・タグ承認差戻し
				 * ・追加発注の一時保存
				 * ・追加発注の差戻し
				 * ・属性変更の一時保存
				 * ・属性変更の差戻し
				 * ・発注取消の一時保存
				 * ・発注取消の差戻し
				 */
				if (dto.reapproveTypeID == 0) {
					// 新規
					if (dto.itemApproveTypeID == amcm_type.AMCM_VAL_ITEM_APPROVE_TEMP
							|| dto.itemApproveTypeID == amcm_type.AMCM_VAL_ITEM_APPROVE_TAGRET) {
						// 一時保存かタグ承認差戻しの場合は削除可能
						return false;
					}
				}
				if (dto.reapproveTypeID == amcm_type.AMCM_VAL_ITEM_REAPPROVE_MST
						|| dto.reapproveTypeID == amcm_type.AMCM_VAL_ITEM_REAPPROVE_ODADD
						|| dto.reapproveTypeID == amcm_type.AMCM_VAL_ITEM_REAPPROVE_ODCANCEL) {
					// 属性変更,追加発注,発注取消
					if (dto.itemApproveTypeID == amcm_type.AMCM_VAL_ITEM_APPROVE_TEMP
							|| dto.itemApproveTypeID == amcm_type.AMCM_VAL_ITEM_APPROVE_RET) {
						// 一時保存か差戻しの場合は削除可能
						return false;
					}
				}
				return true;
			});
			ope3SelectedRecs = _.filter(arg.selectedRecs, function(dto) {
				if (dto.itemApproveTypeID == amcm_type.AMCM_VAL_ITEM_APPROVE_TAGAPPLY ||
						dto.itemApproveTypeID == amcm_type.AMCM_VAL_ITEM_APPROVE_TAG1ST ||
						dto.itemApproveTypeID == amcm_type.AMCM_VAL_ITEM_APPROVE_APPLY ||
						dto.itemApproveTypeID == amcm_type.AMCM_VAL_ITEM_APPROVE_1ST) {
					return true;
				} else {
					return false;
				}
			});
			ope4SelectedRecs = _.filter(arg.selectedRecs, function(dto) {
				/*
				 * タグ発行申請可能なもの
				 * ・新規の一時保存
				 * ・タグ発行差戻し
				 * ・最終承認差戻し
				 */
				if (dto.reapproveTypeID == 0) {
					// 新規
					if (dto.itemApproveTypeID == amcm_type.AMCM_VAL_ITEM_APPROVE_TEMP
							|| dto.itemApproveTypeID == amcm_type.AMCM_VAL_ITEM_APPROVE_TAGRET
							|| dto.itemApproveTypeID == amcm_type.AMCM_VAL_ITEM_APPROVE_RET
							) {
						// 一時保存かタグ承認差戻しか最終承認差戻しの場合は申請可能
						return false;
					}
				}
				return true;
			});
			ope5SelectedRecs = _.filter(arg.selectedRecs, function(dto) {
				/*
				 * 最終承認申請可能なもの
				 * ・新規の一時保存
				 * ・タグ発行承認済
				 * ・タグ発行差戻し
				 * ・最終承認差戻し
				 * ・追加発注の一時保存
				 * ・属性変更の一時保存
				 * ・発注取消の一時保存
				 */
				if (dto.reapproveTypeID == 0) {
					// 新規
					switch (dto.itemApproveTypeID) {
					case amcm_type.AMCM_VAL_ITEM_APPROVE_TEMP:			// 一時保存
					case amcm_type.AMCM_VAL_ITEM_APPROVE_TAGAPPROVE:	// タグ発行承認済
					case amcm_type.AMCM_VAL_ITEM_APPROVE_TAGRET:		// タグ発行差戻し
					case amcm_type.AMCM_VAL_ITEM_APPROVE_RET:			// 最終承認差戻し
						return false;
					}
				}
				if (dto.reapproveTypeID == amcm_type.AMCM_VAL_ITEM_REAPPROVE_MST
						|| dto.reapproveTypeID == amcm_type.AMCM_VAL_ITEM_REAPPROVE_ODADD
						|| dto.reapproveTypeID == amcm_type.AMCM_VAL_ITEM_REAPPROVE_ODCANCEL) {
					// 属性変更,追加発注,発注取消
					switch (dto.itemApproveTypeID) {
					case amcm_type.AMCM_VAL_ITEM_APPROVE_TEMP:			// 一時保存
					case amcm_type.AMCM_VAL_ITEM_APPROVE_TAGAPPROVE:	// タグ発行承認済
					case amcm_type.AMCM_VAL_ITEM_APPROVE_TAGRET:		// タグ発行差戻し
					case amcm_type.AMCM_VAL_ITEM_APPROVE_RET:			// 最終承認差戻し
						return false;
					}
				}
				return true;
			});

			// デフォルトの活性/非活性判定関数
			var defaultIsEnabled = function(args){
				if(args.selectedCount <= 0){
					// 選択されていない。
					return false;
				}else if(args.selectedCount == 1){
					switch(args.btnOpeTypeId){
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
						if (ope2SelectedRecs.length > 0) {
							// 一時保存かタグ発行承認差戻し以外は削除不可
							return false;
						}
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
						if(ope1SelectedRecs.length > 0){
							// 編集可能フラグが立っていないものが含まれている
							return false;
						}
						if (ope3SelectedRecs.length > 0) {
							// 承認申請中のものが含まれている
							return false;
						}
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK:	// 差し戻し(タグ発行申請で使用)
						if (ope4SelectedRecs.length > 0) {
							return false;
						}
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY:	// 申請（最終承認）
						if (ope5SelectedRecs.length > 0) {
							return false;
						}
						break;
//					case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
//						if(ope1SelectedRecs.length > 0){
//							// 編集可能フラグが立っていないものが含まれている
//							return false;
//						}
//						break;
					}
				}else{
					// 複数行選択
					if(args.selectionPolicy == 'single'){
						return false;
					} else {
						switch(args.btnOpeTypeId){
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
							if(ope1SelectedRecs.length > 0){
								// ＜履歴条件1種＞
								// 履歴適用外のものが含まれている
								return false;
							}
							if (ope3SelectedRecs.length > 0) {
								// 承認申請中のものが含まれている
								return false;
							}
							break;
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK:	// 差し戻しをタグ発行申請で使用
							if (ope4SelectedRecs.length > 0) {
								return false;
							}
							break;
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY:	// 申請（最終承認）
							if (ope5SelectedRecs.length > 0) {
								return false;
							}
							break;
						}
					}
				}
				return true;
			};
			var opeBtnIsEnabled = defaultIsEnabled;

			var pmctlSwitcher = clutil.permcntl.getReadonlySwitcher();

			$('.cl_opebtngroup').each(function(){
				var $pdiv = $(this);
				var gid = $pdiv.data('cl_groupid');

				if(_.isEmpty(gid) || gid == '*' || _.isEmpty(groupid) || groupid == '*' || gid == groupid){
					// ボタン個々に enabled(true/false) セットする、for-each() ループ
					$pdiv.find('.btn').each(function(){
						var $btn = $(this);
						var btnOpeTypeId = clutil.btnOpeTypeId($btn);
						var selectionPolicy = null;
						switch(btnOpeTypeId){
						case -1:	// 処理区分不定
							if($btn.hasClass('cl_selectui_multi')){
								selectionPolicy = 'multi';
							}else if($btn.hasClass('cl_selectui_single')){
								selectionPolicy = 'single';
							}else{
								// 不定 -- コントロール下にないボタンなので SKIP する。
								return;
							}
							break;
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY:	// 申請
						case am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK:	// 差し戻し（タグ発行申請として使用）
							selectionPolicy = 'multi';
							break;
						default:
							selectionPolicy = 'single';
						}
						var args = {
							$btn: $btn,
							selectedRows: selectedRecs,
							selectedCount: selectedRecs.length,
							btnOpeTypeId: btnOpeTypeId,
							selectionPolicy: selectionPolicy,
							hasHistory: true,
							opeDate: opeDate
						};

						if(!false/* FIXME 権限コントロール実装＝ＯＦＦ中 */){
							if(opeBtnIsEnabled(args)){
								// 活性化
								pmctlSwitcher.turnOff($btn);
							}else{
								// 非活性化
								pmctlSwitcher.turnOn($btn);
							}
						}else{
							if(opeBtnIsEnabled(args)){
								// 活性化
								$btn.removeAttr('disabled');
							}else{
								// 非活性化
								$btn.attr('disabled', true);
							}
						}
					});
				}
			});

		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedIds, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMMSV0090', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMMSV0090GetRsp.itemList;
				if(_.isEmpty(recs)){
					// 検索ペインを表示？
					mainView.srchAreaCtrl.reset();
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
				this.recListView.setRecs(recs);
				this.recListView.setDeletedRowUI(function(dto) {
					return dto.delFlag != 0;
				});

				// 初期選択の設定（オプション）
				if(!_.isEmpty(selectedIds)){
					this.recListView.setSelectById(selectedIds, true);
				}
				this.mdBaseView.options.btns_dl = [
							{
								opeTypeId: MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_CODE,
								label: '品番別Excelデータ出力'
							},
							{
								opeTypeId: MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_COLORSIZE,
								label: 'カラーサイズ別Excelデータ出力'
							},
							{
								opeTypeId: MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_TAG,
								label: 'タグ発行機用CSVデータ出力'
							}
						];
				this.mdBaseView.renderFooterNavi();

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
		doDownload: function(rtyp){
console.log("DEBUG: rtyp=" + rtyp);
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}
			switch(rtyp){
			 case MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_COLORSIZE:
				srchReq.AMMSV0090GetReq.outTypeID = amcm_type.AMCM_VAL_ITEMCSV_TGT_ALL;
				break;
			 case MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_TAG:
				// 本当は専用の区分を切りたいけど、取込画面のプルダウンに出てくるのは
				// よろしくないので、ここでは3(SMX)を使う
				srchReq.AMMSV0090GetReq.outTypeID = 3;
				break;
			 default:
				srchReq.AMMSV0090GetReq.outTypeID = amcm_type.AMCM_VAL_ITEMCSV_TGT_BASE;
				break;
			}
console.log("DEBUG: outTypeID=" + srchReq.AMMSV0090GetReq.outTypeID);

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMMSV0090', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
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
			var url = clcom.appRoot + '/AMMS/AMMSV0100/AMMSV0100.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				myData = {
					savedReq: this.savedReq,
					savedCond: this.savedReq.AMMSV0090GetReq,
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
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				// データが無くても可
				destData.chkData = [];
				clcom.pushPage(url, destData, myData);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
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
			case MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_CODE:		// CSV(品番別)
			case MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_COLORSIZE:	// CSV(カラーサイズ別)
			case MyOpeType.AM_PROTO_COMMON_RTYPE_CSV_TAG:		// CSV(タグ発行機用)
				this.doDownload(rtyp);
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
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_PASSBACK:	// 差戻し（タグ発行申請として使用）
				this.doTagApply(destData.chkData);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY:		// 申請（最終承認申請として使用）
				this.doApply(destData.chkData);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * タグ発行申請
		 */
		doTagApply: function(chkData) {
			var _this = this;
			var ret = true;
			var opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY;
			for (var i = 0; i < chkData.length; i++) {
				var rec = chkData[i];

				var ptnNo = 0;
				// 商品承認区分ID
				switch (rec.itemApproveTypeID) {
				case amcm_type.AMCM_VAL_ITEM_APPROVE_TEMP:		// 一時保存
				case amcm_type.AMCM_VAL_ITEM_APPROVE_TAGRET:	// タグ発行差戻し
				case amcm_type.AMCM_VAL_ITEM_APPROVE_TAG1ST:	// タグ発行1次承認
				case amcm_type.AMCM_VAL_ITEM_APPROVE_RET:		// 最終承認差戻し
					ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPLY;	// タグ発行承認申請
					break;
				default:
					ret = false;	// 基本的に来ないと思うけど…
				}
				if (!ret) {
					break;
				}
				rec.ptnNo = ptnNo;
			}
			var srchReq = _.deepClone(this.savedReq);
			var applyReq = _.deepClone(this.savedReq);
			var dialogClosedFunc = function() {
				_this.doSrch(srchReq);
			};
			applyReq.reqHead.opeTypeId = opeTypeId;
			applyReq.AMMSV0090GetReq.itemList = chkData;
			clutil.postJSON('AMMSV0090', applyReq).done(_.bind(function(data){
				var e = null;
				clutil.updMessageDialogShort({
					message: function(opeTypeId, e){
						var opeLabel = null;
						if(e && e.target && !_.isEmpty(e.target.text)){
							// ボタンラベル名
							opeLabel = e.target.text;
						}else{
							// 処理区分値からボタンラベル名を推測
							opeLabel = clutil.opeTypeIdtoString(opeTypeId, true);
						}
						return _.isEmpty(opeLabel)
							? clmsg.cl_rtype_upd_confirm	// デフォルト：「登録が完了しました。」
							: clutil.fmt(clmsg.cl_rtype_any_confirm, opeLabel);
					}(opeTypeId, e),
					okCallback: dialogClosedFunc
				});
			}, this)).fail(_.bind(function(data) {
				// エラー終了
				clutil.mediator.trigger('onTicker', data.rspHead);
			}, this));
		},

		/**
		 * タグ発行申請
		 */
		doApply: function(chkData) {
			var _this = this;
			var ret = true;
			var opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_APPLY;
			for (var i = 0; i < chkData.length; i++) {
				var rec = chkData[i];

				var ptnNo = 0;
				// 商品承認区分ID
				switch (rec.itemApproveTypeID) {
				case amcm_type.AMCM_VAL_ITEM_APPROVE_TEMP:			// 一時保存
				case amcm_type.AMCM_VAL_ITEM_APPROVE_TAGAPPROVE:	// タグ発行承認済
				case amcm_type.AMCM_VAL_ITEM_APPROVE_TAGRET:		// タグ発行差戻し
				case amcm_type.AMCM_VAL_ITEM_APPROVE_RET:			// 最終承認差戻し
					switch (rec.reapproveTypeID) {
					case 0:												// 初回
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_APPLY;	// 最終承認申請
						break;
					case amcm_type.AMCM_VAL_ITEM_REAPPROVE_MST:			// 再
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_MST_APPLY;	// 基本属性編集承認申請
						break;
					case amcm_type.AMCM_VAL_ITEM_REAPPROVE_ODADD:		// 追
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_APPLY;	// 追加発注承認申請
						break;
					case amcm_type.AMCM_VAL_ITEM_REAPPROVE_ODCANCEL:	// 消
						ptnNo = amcm_type.AMCM_VAL_ITEM_OPEPTN_ODCAN_APPLY;	// 発注取消承認申請
						break;
					}
					break;
				default:
					ret = false;	// 基本的に来ないと思うけど…
				}
				if (!ret) {
					break;
				}
				rec.ptnNo = ptnNo;
			}

			var srchReq = _.deepClone(this.savedReq);
			var applyReq = _.deepClone(this.savedReq);
			var dialogClosedFunc = function() {
				_this.doSrch(srchReq);
			};
			applyReq.reqHead.opeTypeId = opeTypeId;
			applyReq.AMMSV0090GetReq.itemList = chkData;
			clutil.postJSON('AMMSV0090', applyReq).done(_.bind(function(data){
				var e = null;
				clutil.updMessageDialogShort({
					message: function(opeTypeId, e){
						var opeLabel = null;
						if(e && e.target && !_.isEmpty(e.target.text)){
							// ボタンラベル名
							opeLabel = e.target.text;
						}else{
							// 処理区分値からボタンラベル名を推測
							opeLabel = clutil.opeTypeIdtoString(opeTypeId, true);
						}
						return _.isEmpty(opeLabel)
							? clmsg.cl_rtype_upd_confirm	// デフォルト：「登録が完了しました。」
							: clutil.fmt(clmsg.cl_rtype_any_confirm, opeLabel);
					}(opeTypeId, e),
					okCallback: dialogClosedFunc
				});
			}, this)).fail(_.bind(function(data) {
				// エラー終了
				clutil.mediator.trigger('onTicker', data.rspHead);
			}, this));
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
			var width = $p.width() - 485;
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
				$ths = $tr.find('th');
				_.each($ths, _.bind(function(d) {
					// 各行の最大高さを取得する
					var $th = $(d);
					var height = $th.outerHeight();
					if (max_height < height) {
						max_height = height;
					}
				}, this));
				$ths.css('height', max_height);
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

		_eof: 'AMSSV0090.MainView//'
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
