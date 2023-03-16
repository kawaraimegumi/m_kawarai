// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){
	var AMSDV0020define = {
			IAGFUNC_ID_SUBCLS1: 1,
			IAGFUNC_ID_SUBCLS2: 2,
			IAGFUNC_ID_COLOR: 4,
			IAGFUNC_ID_STYLE: 7,
		};

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate){
		return _.template(rawTemplate, null, {variable: 'it'});
	};

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		validator: null,

		events: {
			'change #ca_unitID'									: '_onUnitChange',				// 事業ユニットが変更された
			'change #ca_itgrpID'								: '_onChangeItgrpID',			// 品種選択イベント
			'change input[name="ca_codeType"]:radio'			: '_onCodeTypeChange',			// 品番ラジオボタン変更
			'blur #ca_itemCode'									: '_onItemCodeChange',			// メーカー品番が変更された
			'change input[name="ca_autoFlag"]:radio'			: '_onAutoTypeChange',			// 自動停止有無ラジオボタン変更
			'change input[name="ca_upLimitStockType"]:radio'	: '_onupLimitStockTypeChange',	//上限在庫数設定有無が変更された ※MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 2018/12/25
			'change .cl_autoStopQy'								: '_onAutoStopQyChange',		// 「自動振分停止在庫数」変更
			"click .cl_errWrnRowClick"							: '_onErrWrnClick',				// MT-1493 エラー・警告行クリック yamaguchi
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
					title: 'StoCSカラー商品マスタ',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
//					btn_csv: false,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// それ以外は、Submit と、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// onOperation イベントを発火するかどうか
			this.onOperationSilent = (opt && opt.onOperationSilent);

			// Fieldlimit
			clutil.cltxtFieldLimit($("#ca_itemCode"));

			// ツールチップ
			//MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 ここから 2018/12/25
			$("#ca_tp_upLimitStockNum").tooltip({html: true});
			//ここまで

			//MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 ここから 2018/12/25
			//追加した要素の初期化をここでやる
			clutil.inputReadonly($('input[name="ca_upLimitStockType"]'));
			var radio = $("input:radio[name=ca_upLimitStockType]:checked");
			if(Number(radio.val()) == 0){
				$("#ca_upLimitStockNum_div").addClass('dispn');
			}
			//ここまで

			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLmakerItemCodeCompleted', this._onCLmakerItemCodeComplete);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			return this;
		},

		initUIElement: function(){
			var _this = this;
			this.mdBaseView.initUIElement();

			// 日付入力欄
			this.srchDatePicker = clutil.datepicker(this.$('#ca_followStartDate'));
			this.srchDatePicker = clutil.datepicker(this.$('#ca_followEndDate'));

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create(
				'default',
				{
					// 事業ユニット
					clbusunitselector: {
						el: "#ca_unitID",
						initValue: clcom.userInfo.unit_id
					},
					// 品種オートコンプリート
					clvarietycode: {
						el: "#ca_itgrpID",
					},
					// サブクラス１
					'clitemattrselector subclass1': {
						el: "#ca_subcls1ID",
						dependSrc: {
							iagfunc_id: 'iagfunc_id1'
						},
					},
					// サブクラス２
					'clitemattrselector subclass2': {
						el: "#ca_subcls2ID",
						dependSrc: {
							iagfunc_id: 'iagfunc_id2'
						},
					},
					// スタイル
					'clitemattrselector style': {
						el: "#ca_styleID",
						dependSrc: {
							iagfunc_id: 'iagfunc_style_id'
						},
					},
				},
				{
					dataSource: {
						iagfunc_id1: AMSDV0020define.IAGFUNC_ID_SUBCLS1,
						iagfunc_id2: AMSDV0020define.IAGFUNC_ID_SUBCLS2,
						iagfunc_style_id: AMSDV0020define.IAGFUNC_ID_STYLE,
					}
				}
			);
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
				console.log("done in!!!!");
			});

			// メーカー
			this.makerField = clutil.clvendorcode($("#ca_makerID"), {
				dependAttrs: {
					unit_id: function() {
						return mainView.getValue('unitID', 0);
					},
					vendor_typeid: amdb_defs.MTTYPE_F_VENDOR_MAKER
				}
			});
			this.listenTo(this.makerField, "change", this._onMakerChange);

			$("input[name='ca_autoFlag'][value='0']").radio('check');

			// シーズン(未選択あり)
			clutil.cltypeselector($("#ca_seasonID"), amcm_type.AMCM_TYPE_SEASON, 1);

//			// サブクラス1
//			clutil.clitemattrselector($("#ca_subcls1ID"), AMSDV0020define.IAGFUNC_ID_SUBCLS1, null, 1);
//			// サブクラス2
//			clutil.clitemattrselector($("#ca_subcls2ID"), AMSDV0020define.IAGFUNC_ID_SUBCLS2, null, 1);
//
//			// スタイル
//			clutil.clitemattrselector($("#ca_styleID"), AMSDV0020define.IAGFUNC_ID_STYLE, 0, 1);

			// 店舗属性selector
			var html_source = '';
			html_source += '<option value="0">&nbsp;</option>';
			html_source += '<option value="1">店舗ランク上位から１ずつ</option>';
			html_source += '<option value="2">店舗ランク上位から振分数</option>';
			$("#ca_autoType").html('');
			$("#ca_autoType").html(html_source).selectpicker().selectpicker('refresh');

			// 商品名
			clutil.fixReadonly($("#ca_itemName"));
			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.setFocus($('#ca_itgrpID'));
				}
				else{
					clutil.setFocus(this.$("#ca_unitID"));
				}
				this._onCodeTypeChange();
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}


			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			argsMessage = args.data.rspHead.message;
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// args.data が null なら空欄表示化する。args.data に何かネタがあれば画面個別Viewへセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});

				if (argsMessage == 'WDS0007') {
					var updReq = this.savedUpdReq;
					var send = {
							resId:	"AMSDV0020",
							data: updReq,
							confirm: clmsg.WDS0007,
					};
					this.mdBaseView.forceSubmit(send);
				}
				if (argsMessage == 'WDS0008') {
					var updReq = this.savedUpdReq;
					var send = {
							resId:	"AMSDV0020",
							data: updReq,
							confirm: clmsg.WDS0008,
					};
					this.mdBaseView.forceSubmit(send);
				}
				if (argsMessage == 'WDS0009') {
					var updReq = this.savedUpdReq;
					var send = {
							resId:	"AMSDV0020",
							data: updReq,
							confirm: clmsg.WDS0009,
					};
					this.mdBaseView.forceSubmit(send);
				}
				if (argsMessage == 'WDS0010') {
					var updReq = this.savedUpdReq;
					var send = {
							resId:	"AMSDV0020",
							data: updReq,
							confirm: clmsg.WDS0010,
					};
					this.mdBaseView.forceSubmit(send);
				}

				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
//			args = {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data};
			var data = args.data;
			var recs = data.AMSDV0020GetRsp;

			switch(args.status){
			case 'OK':
				// 編集可の状態にする。
				clutil.viewRemoveReadonly(this.$el);

				// 上限在庫数が「0」の場合、空白にする
				if (data.AMSDV0020GetRsp.itemRecord.upLimitStockNum == 0) {
					data.AMSDV0020GetRsp.itemRecord.upLimitStockNum = "";
					recs.itemRecord.upLimitStockNum = "";
				}
				var $d = $.Deferred();

				this.data2view(data).always(_.bind(function(){
					// 編集・複製・削除・参照
					if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
						// args.data をアプリ個別 Veiw へセットする。
						clutil.viewReadonly(this.$('#div_ca_unitID'));
						clutil.inputReadonly($('#ca_itgrpID, #ca_makerID, #ca_itemCode'));
						clutil.inputReadonly($('input[name="ca_codeType"]'));
//						clutil.setFocus(this.$("#ca_fromWeek"));
					} else {
						this.setReadOnlyAllItems();
					}
				}, this));

				break;
			case 'DONE':		// 確定済
				var $d = $.Deferred();

				// args.data をアプリ個別 Veiw へセットする。
				this.data2view(data).always(_.bind(function(){
					this.setReadOnlyAllItems();
				}, this));

				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 確認 : 画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				var $d = $.Deferred();

				// args.data をアプリ個別 Veiw へセットする。
				this.data2view(data).always(_.bind(function(){
					this.setReadOnlyAllItems();
				}, this));

				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {prefix: 'ca_'});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});

				break;
			}
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
		 * 指定プロパティ名 ( ⇔ 検索 Req 上のメンバ名) の UI 設定値を取得する。
		 * defaultVal は、設定値が無い場合に返す値。
		 */
		getValue: function(propName, defaultVal){
//			console.log(defaultVal);
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
		 * 店舗オートコンプ入れ替え
		 */
		getOrg: function($tgt, unitID){
			return clutil.clorgcode({
				el: $tgt,
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				},
			});
		},

		is_init: false,	// 初期化時フラグ

		/**
		 * データを表示
		 */
		data2view: function(data){
			this.f_data2view_makeritemcode = true;

			this.saveData = data.AMSDV0020GetRsp;
			var sdItemRecord = data.AMSDV0020GetRsp.itemRecord;

			// 表示用に変換
			var itgrpID = sdItemRecord.itgrpID;
			sdItemRecord.itgrpID = {
				id: itgrpID,
				code: sdItemRecord.itgrpCode,
				name: sdItemRecord.itgrpName,
			};
//			sdItemRecord.makerID = {
//				id: sdItemRecord.makerCodeName.id,
//				code: sdItemRecord.makerCodeName.code,
//				name: sdItemRecord.makerCodeName.name,
//			};
			var makerID = sdItemRecord.makerID;
			sdItemRecord.makerID = {
				id: makerID,
				code: sdItemRecord.makerCode,
				name: sdItemRecord.makerName,
			};
//			var colorID = sdItemRecord.colorID;
//			sdItemRecord.colorID = {
//				id: colorID,
//				code: sdItemRecord.colorCode,
//				name: sdItemRecord.colorName,
//			};
			sdItemRecord.codeType = sdItemRecord.itemTypeID;

			if (sdItemRecord.distLimit == 0) {
				sdItemRecord.distLimit = "";
			}

//			sdItemRecord.fromDate = sdItemRecord.followStartDate;
//			sdItemRecord.toDate = sdItemRecord.followEndDate;

			clutil.data2view(this.$('#ca_form'), sdItemRecord);

			this._onCodeTypeChange();

			clutil.data2view(this.$('#ca_form'), sdItemRecord);
			clutil.data2view(this.$('#ca_base_form'), sdItemRecord);
			clutil.data2view(this.$('#ca_dist_form'), sdItemRecord);
			clutil.data2view(this.$('#ca_setup_form'), sdItemRecord);

			this._onAutoTypeChange();
			this._onupLimitStockTypeChange();

//			clutil.data2view(this.$('#ca_form'), sdItemRecord);
//			clutil.data2view(this.$('#ca_base_form'), sdItemRecord);
//			clutil.data2view(this.$('#ca_setup_form'), sdItemRecord);

			// サブクラス1,サブクラス2
//			clutil.clitemattrselector2($("#ca_subcls1ID"), AMSDV0020define.IAGFUNC_ID_SUBCLS1
//					, itgrpID, 1, sdItemRecord.subcls1ID);
//			clutil.clitemattrselector2($("#ca_subcls2ID"), AMSDV0020define.IAGFUNC_ID_SUBCLS2
//					, itgrpID, 1, sdItemRecord.subcls2ID);


			// 商品マスタ取得
			var makeritemcode = {
				itgrp_id: sdItemRecord.itgrpID.id,
				maker_id: sdItemRecord.makerID.id,
				maker_code: sdItemRecord.itemCode,
//				f_pack: sdItemRecord.packFlag,
				f_pack: sdItemRecord.codeType - 1,
			};
			var colorObj = {
				tgt : $('#ca_colorID'),
				colorID : sdItemRecord.colorID
			};
			var dfd = $.Deferred();
			this.is_init = true;
			clutil.clmakeritemcode2item(makeritemcode, colorObj).done(_.bind(function(isCorrect){
				isCorrect ? dfd.resolve() : dfd.reject();
				if (this.is_init) {
					switch (this.options.opeTypeId) {
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
						this.setReadOnlyAllItems();
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
						//clutil.viewReadonly(this.$('#ca_form'));
						clutil.viewReadonly(this.$('#div_ca_unitID'));
						clutil.inputReadonly($('#ca_itgrpID, #ca_makerID, #ca_itemCode'));
						clutil.inputReadonly($('input[name="ca_codeType"]'));
						clutil.inputReadonly($("#ca_colorID"));
						break;
					}
				}
				this.is_init = false;
			},this));

			dfd.resolve();
			return dfd.promise();
		},

		/**
		 * MT-1493エラー行、警告行クリック時に該当の行までスクロールする処理 yamaguchi
		 */
		_onErrWrnClick: function(args) {
			this.rankDataGrid.grid.scrollRowIntoView($(args.currentTarget).data('rownum'),1);
		},

		// 初期データ取得後に呼ばれる関数
		setReadOnlyAllItems: function(){
			clutil.viewReadonly(this.$el);
		},

		/**
		 * 事業ユニットが変更されたイベント
		 *  ⇒ メーカーコードオートコンプリートの内部設定値をクリアする。
		 */
		_onUnitChange: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}
			var radio = $("input:radio[name=ca_codeType]:checked");
			var val = Number(radio.val());

			this.$('#ca_makerID').autocomplete('removeClAutocompleteItem');
			this.makerField.trigger("change");
			var unitID = Number(this.$('#ca_unitID').val());
			if (val == 1) {
				this.$('#ca_makerID').attr('readonly', unitID == 0);
			} else {
				this.$('#ca_makerID').attr('readonly', true);
			}
			this.$('#ca_itemCode').attr('readonly', unitID == 0);
			if (unitID == 0) {
				clutil.viewReadonly(this.$('#div_ca_colorID'));
			}
		},

		/**
		 * 品種変更イベント
		 */
		_onChangeItgrpID: function(e) {
//			var $itgrpID = this.$("#ca_itgrpID");
//			var $subcls1ID = this.$("#ca_subcls1ID");
//			var $subcls2ID = this.$("#ca_subcls2ID");
//
//			var itgrp_data = $itgrpID.autocomplete('clAutocompleteItem');
//			var itgrp_id = 0;
//			if (itgrp_data != null) {
//				itgrp_id = itgrp_data.id;
//			}
//			// サブクラス1
//			clutil.clitemattrselector($("#ca_subcls1ID"), AMSDV0020define.IAGFUNC_ID_SUBCLS1, itgrp_id, 1);
//			// サブクラス2
//			clutil.clitemattrselector($("#ca_subcls2ID"), AMSDV0020define.IAGFUNC_ID_SUBCLS2, itgrp_id, 1);
		},

		/**
		 * 品番選択ラジオボタン変更
		 * @param e
		 */
		_onCodeTypeChange: function(e) {
			var radio = $("input:radio[name=ca_codeType]:checked");
			var val = Number(radio.val());

			console.log(val);
			var $subcls1ID = $("#ca_subcls1ID");
			var $distLimit = $("#ca_distLimit");

			switch (val) {
			case 1:	// メーカー品番
				// ラベルを「メーカー品番」に変更する
				$("#p_itemCode").text('メーカー品番');
				// ラベルを「商品名」に変更する
				$("#p_itemName").text('商品名');
//				// フォロー開始日, フォロー終了日を入力可能にする
//				clutil.unfixReadonly($("#ca_fromDate"));
//				clutil.unfixReadonly($("#ca_toDate"));
//				clutil.inputRemoveReadonly($("#ca_fromDate"));
//				clutil.inputRemoveReadonly($("#ca_toDate"));
				// メーカーを入力可能にする
				clutil.unfixReadonly($("#ca_makerID"));
				clutil.inputRemoveReadonly($("#ca_makerID"));
				// メーカーを必須にする
				$("#div_makerID").addClass('required');
				$("#ca_makerID").addClass('cl_required');
				$("#ca_makerID").addClass('cl_valid');
				// 商品カテゴリを入力不可にする
				clutil.inputReadonly($subcls1ID);
				clutil.inputReadonly($("#ca_subcls2ID"));
				clutil.inputReadonly($("#ca_styleID"));
				clutil.inputReadonly($("#ca_seasonID"));
				clutil.fixReadonly($subcls1ID);
				clutil.fixReadonly($("#ca_subcls2ID"));
				clutil.fixReadonly($("#ca_styleID"));
				clutil.fixReadonly($("#ca_seasonID"));

				// 同一JAN振分上限数を入力不可にする
				clutil.inputReadonly($distLimit);
				clutil.fixReadonly($distLimit);


				// 入力欄クリア
				$("#ca_makerID").val('');
				$("#ca_itemCode").val('');
				$("#ca_itemName").val('');
				$("#ca_setupID").val('');
				clutil.cltypeselector2({
					  $select: $("#ca_colorID"),
					  list: []
				});
				clutil.initUIelement($("#ca_colorID"));
				$("#ca_subcls1ID").selectpicker('val', "");
				$("#ca_subcls2ID").selectpicker('val', "");
				$("#ca_styleID").selectpicker('val', "");
				$("#ca_seasonID").selectpicker('val', "");
				$distLimit.val('');

				//MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 ここから 上限在庫数設定有無を非活性化 2018/12/25
				clutil.inputReadonly($('input[name="ca_upLimitStockType"]'));
				clutil.inputReadonly($("#ca_upLimitStockNum"));
				this._onupLimitStockTypeChange();	//上限在庫数設定有無ラジオボタン押下時の関数を呼び出し、活性・非活性の制御を行う
				//自動通知を活性化する 　※仕様確認中
				clutil.inputRemoveReadonly($('input[name="ca_autoFlag"]'));
				clutil.inputRemoveReadonly($('#ca_autoType'));
				// セットアップIDを入力可能にする
				clutil.unfixReadonly($("#ca_setupID"));
				clutil.inputRemoveReadonly($("#ca_setupID"));
				// バッチ対象フラグをチェック可能にする
				clutil.unfixReadonly($("#ca_batchFlag"));
				clutil.inputRemoveReadonly($("#ca_batchFlag"));
				//ここまで
				break;
			case 2:	// 集約品番
				// ラベルを「集約品番」に変更する
				$('#p_itemCode').text('集約品番');
				// ラベルを「集約商品名」に変更する
				$("#p_itemName").text('集約商品名');
//				// フォロー開始日, フォロー終了日を入力可能にする
//				clutil.unfixReadonly($("#ca_fromDate"));
//				clutil.unfixReadonly($("#ca_toDate"));
//				clutil.inputRemoveReadonly($("#ca_fromDate"));
//				clutil.inputRemoveReadonly($("#ca_toDate"));
				// メーカーを入力不可にする
				clutil.inputReadonly($("#ca_makerID"));
				clutil.fixReadonly($("#ca_makerID"));
				this.validator.clear($("#ca_makerID"));
				// メーカーの必須を外す
				$("#div_makerID").removeClass('required');
				$("#ca_makerID").removeClass('cl_required');
				$("#ca_makerID").removeClass('cl_valid');
//				// メーカーをクリアする
//				$("#ca_makerID").val('');
				// セットアップIDを入力不可にする
				clutil.inputReadonly($("#ca_setupID"));
				clutil.fixReadonly($("#ca_setupID"));
				this.validator.clear($("#ca_setupID"));
				// バッチ対象フラグをチェック可能にする
				clutil.unfixReadonly($("#ca_batchFlag"));
				clutil.inputRemoveReadonly($("#ca_batchFlag"));
				// 商品カテゴリを入力可にする
				clutil.unfixReadonly($subcls1ID);
				clutil.unfixReadonly($("#ca_subcls2ID"));
				clutil.unfixReadonly($("#ca_styleID"));
				clutil.unfixReadonly($("#ca_seasonID"));
				clutil.inputRemoveReadonly($subcls1ID);
				clutil.inputRemoveReadonly($("#ca_subcls2ID"));
				clutil.inputRemoveReadonly($("#ca_styleID"));
				clutil.inputRemoveReadonly($("#ca_seasonID"));

				// 同一JAN振分上限数を入力可にする
				clutil.unfixReadonly($distLimit);
				clutil.inputRemoveReadonly($distLimit);

				// 入力欄クリア
				$("#ca_makerID").val('');
				$("#ca_itemCode").val('');
				$("#ca_itemName").val('');
				$("#ca_setupID").val('');
				clutil.cltypeselector2({
					  $select: $("#ca_colorID"),
					  list: []
				});
				clutil.initUIelement($("#ca_colorID"));
				$("#ca_subcls1ID").selectpicker('val', "");
				$("#ca_subcls2ID").selectpicker('val', "");
				$("#ca_styleID").selectpicker('val', "");
				$("#ca_seasonID").selectpicker('val', "");
				$distLimit.val('');

				//MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 ここから 上限在庫数設定有無を活性化 2018/12/25
				clutil.inputRemoveReadonly($('input[name="ca_upLimitStockType"]'));
				clutil.inputRemoveReadonly($("#ca_upLimitStockNum"));
				this._onupLimitStockTypeChange();
				//ここまで
				break;
			case 3: // 振分用集約品番
				// ラベルを「振分用集約品番」に変更する
				$('#p_itemCode').text('振分用集約品番');
				// ラベルを「振分用集約商品名」に変更する
				$("#p_itemName").text('振分用集約商品名');
//				// フォロー開始日, フォロー終了日をクリアし入力不可にする
//				clutil.inputReadonly($("#ca_fromDate"));
//				clutil.inputReadonly($("#ca_toDate"));
//				clutil.fixReadonly($("#ca_fromDate"));
//				clutil.fixReadonly($("#ca_toDate"));
//				this.validator.clear($("#ca_fromDate"));
//				this.validator.clear($("#ca_toDate"));
//				$("#ca_fromDate").val('');
//				clutil.datepicker(this.$('#ca_fromDate'));
//				clutil.datepicker(this.$('#ca_toDate'));
				// メーカーを入力不可にする
				clutil.inputReadonly($("#ca_makerID"));
				clutil.fixReadonly($("#ca_makerID"));
				this.validator.clear($("#ca_makerID"));
				// メーカーの必須を外す
				$("#div_makerID").removeClass('required');
				$("#ca_makerID").removeClass('cl_required');
				$("#ca_makerID").removeClass('cl_valid');
				// 商品カテゴリを入力可にする
				clutil.unfixReadonly($subcls1ID);
				clutil.unfixReadonly($("#ca_subcls2ID"));
				clutil.unfixReadonly($("#ca_styleID"));
				clutil.unfixReadonly($("#ca_seasonID"));
				clutil.inputRemoveReadonly($subcls1ID);
				clutil.inputRemoveReadonly($("#ca_subcls2ID"));
				clutil.inputRemoveReadonly($("#ca_styleID"));
				clutil.inputRemoveReadonly($("#ca_seasonID"));
//				// メーカーをクリアする
//				$("#ca_makerID").val('');
				// セットアップIDを入力不可にする
				clutil.inputReadonly($("#ca_setupID"));
				clutil.fixReadonly($("#ca_setupID"));
				this.validator.clear($("#ca_setupID"));
				// バッチ対象フラグを入力不可にする
				clutil.inputReadonly($("#ca_batchFlag"));
				clutil.fixReadonly($("#ca_batchFlag"));
				$("#ca_batchFlag").parent().removeClass('checked');
				// 入力欄クリア
				$("#ca_makerID").val('');
				$("#ca_itemCode").val('');
				$("#ca_itemName").val('');
				$("#ca_setupID").val('');
				clutil.cltypeselector2({
					  $select: $("#ca_colorID"),
					  list: []
				});
				clutil.initUIelement($("#ca_colorID"));
				$("#ca_subcls1ID").selectpicker('val', "");
				$("#ca_subcls2ID").selectpicker('val', "");
				$("#ca_styleID").selectpicker('val', "");
				$("#ca_seasonID").selectpicker('val', "");
				break;
			}

		},

		/**
		 * メーカー変更
		 */
		_onMakerChange : function(attrs, view, options){
			// メーカー品番クリアする
//			this.$("#ca_itemCode").val('').trigger("change");
			this.$("#ca_itemCode").val('');
			this.$("#ca_itemID").val('0');
			this.$("#ca_itemName").val('');

			// カラーをクリアする
			this.$("#ca_colorID").selectpicker('val', 0);
			clutil.inputRemoveReadonly($("#ca_colorID"));
			return;
		},

		/**
		 * メーカー品番
		 */
		_onItemCodeChange: function (e) {
			if (this.options.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				return;
			}
			var maker_id = 0;
			var radio = $("input:radio[name=ca_codeType]:checked");
			var val = Number(radio.val());

			var data_itgrp = $('#ca_itgrpID').autocomplete('clAutocompleteItem');
			if (!data_itgrp) {
				return;
			}
			var data_maker = $('#ca_makerID').autocomplete('clAutocompleteItem');
			if (val == 1 && !data_maker) {
				return;
			} else if (data_maker != null) {
				maker_id = data_maker.id;
			}
			console.log(data_maker);

			var maker_code = $(e.target).val();
			if (maker_code == 0) {
				console.log("maker_code = 0");
				return;
			}

			var itgrp_id = data_itgrp.id;
			var f_pack = val - 1;

			var makeritemcode = {
				itgrp_id: itgrp_id,
				maker_id: maker_id,
				maker_code: maker_code,
				f_pack: f_pack,
			};
			console.log(makeritemcode);

			clutil.clmakeritemcode2item(makeritemcode, e);
		},

		/**
		 * メーカー品番→商品取得完了イベント
		 * @param data
		 * @param e
		 */
		_onCLmakerItemCodeComplete: function(data, obj) {
			console.log(data.data);
			var rec = data.data.rec;
			// item保存(MtItem)
			this.itemID = rec.itemID;
			$('#ca_itemID').val(rec.itemID);
			$('#ca_itemName').val(rec.itemName);
			$('#ca_sizePtnID').val(rec.sizePtnID);

			if (this.f_data2view_makeritemcode !== true) {
				$("#ca_subcls1ID").selectpicker('val', rec.sub1ID);
				$("#ca_subcls2ID").selectpicker('val', rec.sub2ID);
				$("#ca_styleID").selectpicker('val', rec.styleID);
				$("#ca_seasonID").selectpicker('val', rec.seasonID);
			} else {
				this.f_data2view_makeritemcode = false;
			}

			//セレクター
			var $sel_color = $("#ca_colorID");
			var list = [];

			// コードに該当する商品IDがない場合
			if (rec.itemID == ""){
				this.validator.setErrorMsg($("#ca_itemCode"), clmsg.EGM0026);

				$('#ca_itemName').val(null);
				$('#ca_itemID').val(null);
				$('#ca_sizePtnID').val(null);
				if (this.colorSelector) {
					this.colorSelector.off();
				}

				clutil.cltypeselector2({
					  $select: $sel_color,
					  list: list
				});
				clutil.initUIelement($sel_color);
				clutil.mediator.trigger("_ca_onSetColorComplete", false);
				return;
			}

			if (!_.isEmpty(data.data.list)) {
				clutil.viewRemoveReadonly(this.$('#div_ca_colorID'));
				$('#div_ca_colorID').parent().addClass('required');
				$('#ca_colorID').addClass('cl_valid');
				$('#ca_colorID').addClass('cl_required');
			} else {
				//clutil.viewReadonly(this.$('#div_ca_colorID'));
				//$('#ca_colorID').removeClass('cl_valid');
				clutil.viewRemoveReadonly(this.$('#div_ca_colorID'));
				$('#ca_colorID').addClass('cl_valid');

				$('#ca_colorID').removeClass('cl_required');
				$('#div_ca_colorID').parent().removeClass('required');
			}
			// カラーセレクター
			this.colorSelector = clutil.clcolorselector({
				el: "#ca_colorID",
				dependAttrs: {
					// 期間開始日
					srchFromDate: function(){
						return clcom.getOpeDate();
					},
					// 期間終了日
					srchToDate: function(){
						return clcom.getOpeDate();
					},
					// 商品ID
					itemID: rec.itemID,
				}
			});
			if (obj != null) {
				this.colorSelector.setValue(obj.colorID);
			}
		},

		/**
		 * 上限在庫数設定有無ラジオボタン押下
		 * MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 2018/12/25
		 * @param e
		 */
		_onupLimitStockTypeChange: function(e) {
			var radio = $("input:radio[name=ca_upLimitStockType]:checked");
			var val = Number(radio.val());

			console.log(val);

			switch (val) {
			case 0:	// 設定しない
				//上限在庫数入力欄を非表示かつ、必須入力を解除する
				$("#ca_upLimitStockNum_div").addClass('dispn');
				$("#ca_upLimitStockNum").removeClass('cl_required');
				//入力値をクリアする
				$("#ca_upLimitStockNum").val("");
				//自動通知を活性化する 　※仕様確認中
				clutil.inputRemoveReadonly($('input[name="ca_autoFlag"]'));
				clutil.inputRemoveReadonly($('#ca_autoType'));
				break;
			case 1:	// 設定する
				//上限在庫数入力欄を表示かつ、必須入力にする
				$("#ca_upLimitStockNum_div").removeClass('dispn');
				if( $("#ca_upLimitStockNum").attr('readonly') != 'readonly' ){
					$("#ca_upLimitStockNum").addClass('cl_required');
				} else {
					$("#ca_upLimitStockNum").val("");
					$("#ca_upLimitStockNum").removeClass('cl_required');
				}
				//「自動停止して通知する」に変更する
				$('input[name="ca_autoFlag"][value="0"]').attr("checked",true);
				$('input[name="ca_autoFlag"][value="1"]').attr("checked",false);
				$('input[name="ca_autoFlag"][value="0"]').parent().parent().find('label').addClass('checked');
				$('input[name="ca_autoFlag"][value="1"]').parent().parent().find('label').removeClass('checked');
				$('input[name="ca_autoFlag"][value="0"]').trigger('change');
				//自動通知を非活性化する　※仕様確認中
				clutil.inputReadonly($('input[name="ca_autoFlag"]'));
				clutil.inputReadonly($('#ca_autoType'));
				break;
			}

		},

		/**
		 * 自動停止有無ラジオボタン変更
		 */
		_onAutoTypeChange: function(e){
			var radio = $("input:radio[name=ca_autoFlag]:checked");
			var val = Number(radio.val());
			console.log(val);

			var codeType = Number($("input:radio[name=ca_codeType]:checked").val());

			switch (val) {
			case 0:	// 自動停止
				$("#ca_autoType_div").addClass('dispn');
				$("#ca_autoType").removeClass('cl_required');
				$("#ca_autoType").val("0").selectpicker('refresh');
				// 集約品番の１品番あたりの上限在庫数を活性化する
				if (codeType != 1) {
					clutil.inputRemoveReadonly($('input[name="ca_upLimitStockType"]'));
					clutil.inputRemoveReadonly($('#ca_upLimitStockType'));
				}
//				this._onupLimitStockTypeChange();
				break;

			case 1:	// 自動振分け
				$("#ca_autoType_div").removeClass('dispn');
				$("#ca_autoType").addClass('cl_required');
				clutil.inputRemoveReadonly($('input[name="ca_autoFlag"]'));
				clutil.inputRemoveReadonly($('#ca_autoType'));
				// 集約品番の１品番あたりの上限在庫数を「設定しない」に変更する
				$('input[name="ca_upLimitStockType"][value="0"]').attr("checked",true);
				$('input[name="ca_upLimitStockType"][value="1"]').attr("checked",false);
				$('input[name="ca_upLimitStockType"][value="0"]').parent().parent().find('label').addClass('checked');
				$('input[name="ca_upLimitStockType"][value="1"]').parent().parent().find('label').removeClass('checked');
				$('input[name="ca_upLimitStockType"][value="0"]').trigger('change');
				// 集約品番の１品番あたりの上限在庫数を非活性化する
				clutil.inputReadonly($('input[name="ca_upLimitStockType"]'));
				clutil.inputReadonly($('#ca_upLimitStockType'));
//				this._onupLimitStockTypeChange();
				break;

			default:
				break;
			}
		},

		/**
		 * 自動振分停止在庫数変更
		 */
		_onAutoStopQyChange : function(e) {
			var $tgt = $(e.currentTarget);
			var curValue = Number($tgt.val());
			$tgt.val(curValue);
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var chkData = this.options.chkData[pgIndex];
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},
				// StoCSカラー商品マスタ検索リクエスト
				AMSDV0020GetReq: {
					srchID: chkData.id	// カラー商品ID
				},
				// StoCSカラー商品マスタ更新リクエスト -- 今は検索するので、空を設定
				AMSDV0020UpdReq: {
				}
			};
			this.savedReq = getReq;

			return {
				resId : clcom.pageId,	//'AMSDV0020',
				data: getReq
			};
		},

		hasInputError: function(){
			var hasError = false;

			if (!this.validator.valid()) {
				hasError = true;
			}

			var sdItemRecord = clutil.view2data(this.$('#ca_form'));

			if (sdItemRecord.itemID == 0) {
				var msg = 'メーカー品番が間違っています。';
				this.validator.setErrorMsg($('#ca_itemCode'), msg);
				hasError = true;
			}

			//MD-2236 MD-1815 MD_自動振分ロジック追加(要件1)_PGM開発 ここから 2018/12/25
			if (sdItemRecord.upLimitStockType == "2" && sdItemRecord.upLimitStockNum == 0) {
				var msg = '上限在庫数に1以上を登録して下さい。';
				this.validator.setErrorMsg($('#ca_upLimitStockNum'), msg);
				hasError = true;
			}
			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				// 更新日
				stval : 'ca_followStartDate',
				edval : 'ca_followEndDate'
			});
			// 反転エラー確認
			if(!this.validator.validFromTo(chkInfo)){
				hasError = true;
			}

			var f_from = (sdItemRecord.followStartDate == "");
			var f_to = (sdItemRecord.followEndDate == "");
			if (f_from !== f_to) {
				var msg = clmsg.ESD0032
				this.validator.setErrorMsg($('#ca_followStartDate'), msg);
				this.validator.setErrorMsg($('#ca_tca_followEndDateoDate'), msg);
				hasError = true;
			}

			var baseStock = clutil.view2data(this.$('#ca_form'));

			var upLimitStockType = Number(baseStock.upLimitStockType);
			var autoFlag = Number(baseStock.autoFlag);
			if (upLimitStockType === 1 && autoFlag === 1) {
				var msg = '上限在庫と自動振分の同時設定はできません';
				this.validator.setErrorMsg($('#ca_upLimitStockType'), msg);
				this.validator.setErrorMsg($('#ca_autoFlag'), msg);
				hasError = true;
			}

			return hasError;
		},

		/**
		 * 表示から更新データ作成
		 */
		view2UpdReq : function(){
			// 画面入力値をかき集めて、Rec を構築する。
			var sdItem = clutil.view2data(this.$('#ca_form'));

			sdItem.state = sdItem.state ? Number(sdItem.state) : 0;

			sdItem.unitID = sdItem.unitID ? Number(sdItem.unitID) : 0;
			sdItem.unitCode = "";
			sdItem.unitName = "";

			sdItem.itgrpID = sdItem.itgrpID ? Number(sdItem.itgrpID) : 0;
			sdItem.itgrpCode = "";
			sdItem.itgrpName = "";

			sdItem.makerID = sdItem.makerID ? Number(sdItem.makerID) : 0;
			sdItem.makerCode = "";
			sdItem.makerName = "";

			sdItem.itemTypeID = Number(sdItem.codeType);
			delete sdItem.codeType;

			sdItem.itemID = sdItem.itemID ? Number(sdItem.itemID) : 0;
			sdItem.itemCode = "";
			sdItem.itemName = "";

			sdItem.colorID = sdItem.colorID ? Number(sdItem.colorID) : 0;
			sdItem.colorCode = "";
			sdItem.colorName = "";

			sdItem.followStartDate = sdItem.followStartDate ? Number(sdItem.followStartDate) : 0;
			sdItem.followEndDate = sdItem.followEndDate ? Number(sdItem.followEndDate) : 0;

			var baseStock = clutil.view2data(this.$('#ca_base_form'));

			sdItem.upLimitStockType = Number(baseStock.upLimitStockType);
			sdItem.upLimitStockNum = (sdItem.upLimitStockType == 1) ? Number(baseStock.upLimitStockNum) : 0;

			sdItem.autoFlag = Number(baseStock.autoFlag);
			sdItem.autoType = Number(baseStock.autoType);


			sdItem.batchFlag = Number(baseStock.batchFlag);

			var dist = clutil.view2data(this.$('#ca_dist_form'));
			sdItem.distLimit = dist && dist.distLimit ? Number(dist.distLimit) : 0;

			var setup = clutil.view2data(this.$('#ca_setup_form'));

			sdItem.setupID = setup.setupID ? setup.setupID : "";

			delete sdItem._view2data_itgrpID_cn;
			delete sdItem._view2data_makerID_cn;

			var updReq = {
				itemRecord : sdItem,
			};

			return updReq;
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
//			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			this.validator.clear();

			if(this.hasInputError()) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return null;
			}

			// 表示から更新データ作成
			var updReq = this.view2UpdReq();

			var reqHead = {
				opeTypeId : this.options.opeTypeId,
			};

			var reqObj = {
				reqHead			: reqHead,
				AMSDV0020UpdReq : updReq
			};

			this.savedUpdReq = reqObj;

			return {
				resId : clcom.pageId,	//'AMSDV0020',
				data: reqObj,
			};

//			// Null を渡すと, Ajax 呼び出しを Reject したものと FW 側では見なします.
//			return null;
		},

		_eof: 'AMSDV0020.MainView//'
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
