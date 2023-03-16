$(function() {

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		validator : null,

		codeOther: "0099",	// その他コード（シスパラ）

		// Events
		events : {
			// 補正なしチェックボックス
			'change #ca_noAdjustChk': '_onNoAdjustOKChange',
			// 件数入力
			'change input[name="ca_nAdjust"]': '_onNAdjustChange',
			// 金額入力
			'change input[name="ca_adjustAm"]': '_onAdjustAmChange',
			// 行削除
			'click td[name="btn_delete"]': '_onRowDeleteClick',
			// 行追加
			'click td[name="btn_add"]': '_onRowAddClick',
			// 補正項目選択
			'autocompletechange input[name="ca_adjustItemID"]': '_onAdjustItemChange',
		},

		userTypeID: null,

		initialize: function(opt) {
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
					title: '補正件数登録・修正',
					subtitle: false,
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					pageIndex: o.pageIndex,
					updMessageDialog: false,	// 完了ダイアログはこちらで行う

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

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			// アプリ個別の View や部品をインスタンス化するとか・・・

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}
			this.opeTypeId = fixopt.opeTypeId;	// 処理区分を保存

			this.codeOther = clcom.getSysparam(amcm_sysparams.PAR_AMRS_ADJUSTITEM_SONOTA_CODE);

			this.userTypeID = clcom.getUserData().user_typeid;	// ユーザ区分
		},

		/**
		 * SC担当者(STAFF)か判定
		 * @returns {Boolean}
		 */
		isStaffUser: function() {
			var f_store = false;

			switch (this.userTypeID) {
			case amcm_type.AMCM_VAL_USER_STAFF:
				f_store = true;
				break;
			}

			return f_store;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				var toIndex = this.pageIndex +1;
				var pgCount = this.options.chkData.length;
				var message = "登録完了しました。";
				if(pgCount <= 0 /*新規作成はデータが無い*/ || toIndex < 0 || toIndex >= Math.max(pgCount,1)){
				} else {
					message = "登録完了しました<br />次の日の入力に移ります。";
				}
				// 確定したので、次の日に移動する
				clutil.updMessageDialog({
					message: message,
					okCallback: null
				});

				this.mdBaseView._onNextClick();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.mdBaseView.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				break;
			}
		},

		/**
		 * 店舗所属者で対象日が先月以前の場合は、操作不可。それ以外は操作可
		 * @returns {Boolean}
		 */
		isEditable: function() {
			var f_editable = true;

			/*
			 * 店舗ユーザーだけでなく情シスユーザーも1日以降は
			 * 前月分の修正は不可とする
			 * →修正不可にするのはユーザー区分≠STAFFのみ
			 */
			if (!this.isStaffUser()) {
				var targetDate = this.saveReq.getReq.targetDate;
				var y, m, d;
				y = Math.floor(targetDate / 10000);
				m = Math.floor((targetDate / 100) % 100);
				d = Math.floor(targetDate % 100);
				var opeDate = clcom.getOpeDate();
				var targetMonth;
				var nowMonth = Math.floor(opeDate / 100);

				if (d >= 26) {
					m++;
				}
				if (m > 12) {
					y++;
					m = 1;
				}
				targetMonth = y * 100 + m;

				if (targetMonth < nowMonth) {
					f_editable = false;
				}
			}
			return f_editable;
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			var data = args.data;
			var getRsp = data.getRsp;
			var adjustItemList = getRsp == null ? [] : getRsp.adjustItemList;
			var adjustDataList = getRsp == null ? [] : getRsp.adjustDataList;
			if (adjustDataList.length == 1 && adjustDataList[0].adjustItemID < 0) {
				this.adjustDataList = adjustDataList;
				$("#ca_noAdjustChk").attr('checked', true).closest('label').addClass('checked');
			} else {
				this.adjustDataList = null;
				$("#ca_noAdjustChk").attr('checked', false).closest('label').removeClass('checked');
			}

			this.adjustItemList = [];
			this.adjustItemMap = {};
			_.each(adjustItemList, _.bind(function(item) {
				var data = {
					label: item.adjustItemCode + ":" + item.adjustItemName,
					value: item.adjustItemCode + ":" + item.adjustItemName,
					id: item.adjustItemID,
					code: item.adjustItemCode,
					name: item.adjustItemName,
					price: item.price,
				};
				this.adjustItemList.push(data);
				this.adjustItemMap[data.code] = data;
			}, this));

			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				this.data2view(data);
				this.renderTable(adjustItemList, adjustDataList);

				switch (this.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					if (!this.isEditable()) {
						// 編集不可モード
						clutil.viewReadonly($("#ca_form"));
						this.mdBaseView.setSubmitEnable(false);
					}
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					clutil.viewReadonly($("#ca_form"));
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
					clutil.viewReadonly($("#ca_form"));
					break;
				}
				$("#ca_noAdjustChk").trigger("change");
				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);
				this.renderTable(adjustItemList, adjustDataList);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				$("#ca_noAdjustChk").trigger("change");
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);
				this.renderTable(adjustItemList, adjustDataList);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				$("#ca_noAdjustChk").trigger("change");
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function() {
			this.mdBaseView.initUIElement();

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.mdBaseView.fetch();	// データを GET してくる。

			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// 新規の場合は、何もすることないかな？
			}
			return this;
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			//console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			this.pageIndex = pgIndex;

			var chkData = this.options.chkData[pgIndex];
			this.f_aoki = chkData.f_aoki;
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ		・・・これ、必要なの？					【確認】
				reqPage: {
				},
				// 取引先マスタ検索リクエスト
				getReq: {
					targetDate: chkData.targetDate,
					month: chkData.month,
					storeID: chkData.storeID,		// 店舗ID（AMRSV0070で付加する）
					vendorID: chkData.vendorID,		// 補正業者ID
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				updReq: {
				}
			};

			this.saveReq = getReq;

			return {
				resId: clcom.pageId,	//'AMRSV0080',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var f_error = false;
			var headErr = clmsg.cl_echoback;

			if (!this.validator.valid()) {
				f_error = true;
			}

			// 画面入力値をかき集めて、Rec を構築する。
			var noAdjustChk = $("#ca_noAdjustChk").prop('checked') ? 1 : 0;
			var retObj = this.tableview2data($("#ca_table_body tr"), noAdjustChk);

			if (retObj.total_nAdjust == 0 && noAdjustChk == 0) {
				headErr = clmsg.ERS0009;
				f_error = true;
			}
			if (f_error || retObj.f_error) {
				this.validator.setErrorHeader(headErr);
				return null;
			}
			var adjustDataList;
			if (noAdjustChk == 1) {
				if (this.adjustDataList != null) {
					adjustDataList = this.adjustDataList;
				} else {
					adjustDataList = [{
						recno: "",
						state: 0,
						adjustItemID: -1,
						nAdjust: 0,
						adjustAm: 0,
						adjustAmInTax: 0,
					}];
				}
			} else {
				adjustDataList = retObj.adjustDataList;
			}

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: opeTypeId,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
				getReq: this.saveReq.getReq,

				// 商品分類マスタ更新リクエスト
				updReq: {
					noAdjustChk: noAdjustChk,
					adjustDataList: adjustDataList,
				},
			};
			return {
				resId: clcom.pageId,
				data:  updReq,
			};
		},

		tableview2data: function($trobj, noAdjustChk) {
			var f_error = false;
			var adjustDataList = [];

			var total_nAdjust = 0;
			var idmap = {};

			_.each($trobj, _.bind(function(v) {
				var f_e = false;
				var $tr = $(v);
				var $ca_adjustItemID = $tr.find('input[name="ca_adjustItemID"]');
				var $ca_nAdjust = $tr.find('input[name="ca_nAdjust"]');
				var $ca_adjustAm = $tr.find('input[name="ca_adjustAm"]');
				var $ca_recno = $tr.find('input[name="ca_recno"]');
				var $ca_state = $tr.find('input[name="ca_state"]');

				var recno = $ca_recno.val();
				var state = $ca_state.val();
				var adjustItemIDObj = $ca_adjustItemID.autocomplete('clAutocompleteItem');
				var adjustItemIDVal = $ca_adjustItemID.val();
				var nAdjust = $ca_nAdjust.val().split(',').join('');
				var adjustAm = $ca_adjustAm.val().split(',').join('');

				if (adjustItemIDObj == null && adjustItemIDVal != null && adjustItemIDVal != "") {
					// 入力されているのに確定していない
					var vals = adjustItemIDVal.split(":");
					var code = null;
					if (vals != null && vals.length > 0) {
						code = vals[0];
						adjustItemIDObj = this.adjustItemMap[code];
					}
					if (adjustItemIDObj != null) {
						$ca_adjustItemID.autocomplete('clAutocompleteItem', adjustItemIDObj);
					}
				}

				if (adjustItemIDObj != null && adjustItemIDObj.code == this.codeOther) {
					nAdjust = "1";
				}

				if (!_.isEmpty(nAdjust) && (adjustItemIDObj == null || adjustItemIDObj.id == null || adjustItemIDObj.id == 0)) {
					// 数量があるのに補正項目がない
					this.validator.setErrorMsg($ca_adjustItemID, '補正項目を入力して下さい。');
					f_error = true;
					f_e = true;
				}
				if ((adjustItemIDObj != null && adjustItemIDObj.id > 0 && adjustItemIDObj.code != this.codeOther) && _.isEmpty(nAdjust) && noAdjustChk == 0) {
					// 補正項目があるのに数量が入力されていない
					this.validator.setErrorMsg($ca_nAdjust, '件数を入力して下さい。');
					f_error = true;
					f_e = true;
				}
				if (!_.isEmpty(nAdjust)) {
					nAdjust = Number(nAdjust);
					nAdjust = _.isNaN(nAdjust) ? 0 : nAdjust;
				}
				var id = (adjustItemIDObj != null) ? adjustItemIDObj.id : null;
				if (id != null) {
					if (idmap[id] == true) {
						this.validator.setErrorMsg($ca_adjustItemID, clmsg.ERS0010);
						f_error = true;
					} else {
						idmap[id] = true;
					}
				}
				if (f_e) {
					// エラーなので更新対象外
					return;
				}
				if (id == null && _.isEmpty(nAdjust)) {
					// 空行なので更新対象外
					return;
				}

				var rec = {
					recno: recno,
					state: state,
					adjustItemID: id,
					nAdjust: nAdjust,
					adjustAm: adjustAm,
				};
				adjustDataList.push(rec);
				if (adjustItemIDObj.code != this.codeOther) {
					total_nAdjust += nAdjust;
				} else {
					total_nAdjust += 1;
				}
			}, this));
			return {
				f_error: f_error,
				adjustDataList: adjustDataList,
				total_nAdjust: total_nAdjust,
			};
		},

		data2view: function(data) {
			// 対象日
			$("#ca_ymd").text(clutil.dateFormat(this.saveReq.getReq.targetDate, 'yyyy/mm/dd(w)'));
			// 店舗
			$("#ca_store").text(data.getRsp.storeCode + ":" + data.getRsp.storeName);
			// 補正業者
			$("#ca_vendor").text(data.getRsp.vendorCode + ":" + data.getRsp.vendorName);
		},

		/**
		 * テーブル描画
		 * @param adjustDataList 補正実績レコード
		 */
		renderTable: function(adjustItemList, adjustDataList) {
			var $tbody = $("#ca_table_body");
			var adjustDataMap = {};

			$tbody.empty();

			// 補正実績レコードをIDをキーにハッシュ化
			_.each(adjustDataList, _.bind(function(data) {
				var id = data.adjustItemID;
				adjustDataMap[id] = data;
			}, this));

			_.each(adjustItemList, _.bind(function(item) {
				var id = item.adjustItemID;
				var data = adjustDataMap[id];
				if (item.initDispFlag == 0 && data == null) {
					return;	// 初期表示項目でない
				}

				var d = data == null ? {
					recno: "",
					state: 0,
					adjustItemID: id,
					nAdjust: 0,
					adjustAm: 0,
					adjustAmInTax: 0,
				} : data;
				d.price = item.price;

				var html = _.template($("#ca_table_tbody_template").html(), d);
				$tbody.append(html);

				var $tr = $tbody.find('tr:last');
				// 補正項目オートコンプリート
				var $ca_adjustItemID = $tr.find('input[name="ca_adjustItemID"]');
				$ca_adjustItemID.autocomplete({
					source: this.adjustItemList,
				});
				if (d.adjustItemID != 0) {
					var tmp = {
						id: item.adjustItemID,
						code: item.adjustItemCode,
						name: item.adjustItemName,
					};
					$ca_adjustItemID.autocomplete('clAutocompleteItem', tmp);

					var $ca_nAdjust = $tr.find('input[name="ca_nAdjust"]');
					var $ca_adjustAm = $tr.find('input[name="ca_adjustAm"]');

					if (item.initDispFlag != 0) {
						// 初期表示項目はコード変更不可
						var $ca_adjustItemID = $tr.find('input[name="ca_adjustItemID"]');
						clutil.inputReadonly($ca_adjustItemID);
					}
					if (item.adjustItemCode == this.codeOther) {
						// その他
						clutil.inputReadonly($ca_nAdjust);
						clutil.inputRemoveReadonly($ca_adjustAm);

						$ca_nAdjust.val('');
					} else {
						// その他以外
						clutil.inputRemoveReadonly($ca_nAdjust);
						clutil.inputReadonly($ca_adjustAm);
					}
				}
			}, this));

			if (this.isEditable()) {
				var addrow = this.f_aoki ? 15 : 5;
				// 初期表示として5行追加
				for (var i = 0; i < addrow; i++) {
					var d = {
						recno: "",
						state: 0,
						adjustItemID: 0,
						nAdjust: '',
						adjustAm: '',
						adjustAmInTax: '',
						price: '',
					};

					var html = _.template($("#ca_table_tbody_template").html(), d);
					$tbody.append(html);

					var $tr = $tbody.find('tr:last');
					// 補正項目オートコンプリート
					var $ca_adjustItemID = $tr.find('input[name="ca_adjustItemID"]');
					$ca_adjustItemID.autocomplete({
						source: this.adjustItemList,
					});
					var $ca_adjustAm = $tr.find('input[name="ca_adjustAm"]');
					clutil.inputReadonly($ca_adjustAm);
				}
			} else {
				//$tbody.find('span.btn-delete').addClass('btn-delete-hidden');
				$tbody.find('span.btn-delete').css('visibility', 'hidden');
				$("#ca_table_footer").hide();
			}

			// テーブル初期化
			clutil.initUIelement($tbody);

			this._onTotalChange();
		},

		/**
		 * 行追加クリック
		 */
		_onRowAddClick: function(e) {
			if (!this.isEditable()) {
				return;
			}
			var $tbody = $("#ca_table_body");
			// 空データを作成
			var newdata = {
				recno: "",
				state: 0,
				adjustItemID: 0,
				nAdjust: 0,
				adjustAm: 0,
				adjustAmInTax: 0,
				price: 0,
			};

			var html = _.template($("#ca_table_tbody_template").html(), newdata);
			$tbody.append(html);

			var $tr = $tbody.find('tr:last');
			// 補正項目オートコンプリート
			var $ca_adjustItemID = $tr.find('input[name="ca_adjustItemID"]');
			var $ca_nAdjust = $tr.find('input[name="ca_nAdjust"]');
			var $ca_adjustAm = $tr.find('input[name="ca_adjustAm"]');
			$ca_adjustItemID.autocomplete({
				source: this.adjustItemList,
			});
			clutil.inputRemoveReadonly($ca_nAdjust);
			clutil.inputReadonly($ca_adjustAm);
			// 件数変更イベントを発行する
			$ca_nAdjust.trigger('change');

		},

		/**
		 * 行削除クリック
		 * @param e
		 */
		_onRowDeleteClick: function(e) {
			if (!this.isEditable()) {
				return;
			}
			var $tgt = $(e.target);
			var $tr = $tgt.parents('tr');

			$tr.remove();

			this._onTotalChange();
		},

		_onTotalChange: function() {
			var $tbody = $("#ca_table_body");
			var total_qy = 0,
				total_am = 0;

			_.each($tbody.children('tr'), _.bind(function(tr) {
				var $tr = $(tr);
				var $ca_adjustItemID = $tr.find('input[name="ca_adjustItemID"]');
				var $ca_nAdjust = $tr.find('input[name="ca_nAdjust"]');
				var $ca_adjustAm = $tr.find('input[name="ca_adjustAm"]');

				var adjustItemIDObj = $ca_adjustItemID.autocomplete('clAutocompleteItem');
				var nAdjust = $ca_nAdjust.val();
				var adjustAm = $ca_adjustAm.val();

				// 金額
				if (!_.isEmpty(adjustAm)) {
					adjustAm = Number(adjustAm.split(',').join(''));
					adjustAm = _.isNaN(adjustAm) ? 0 : adjustAm;
				} else {
					adjustAm = 0;
				}

				if (!_.isEmpty(nAdjust)) {
					nAdjust = Number(nAdjust.split(',').join(''));
					nAdjust = _.isNaN(nAdjust) ? 0 : nAdjust;
				} else {
					if (adjustItemIDObj != null && adjustItemIDObj.code == this.codeOther && adjustAm != 0) {
						// 「その他」の場合は数量１とする
						nAdjust = 1;
					} else {
						nAdjust = 0;
					}
				}
				total_qy += nAdjust;
				total_am += adjustAm;
			}, this));

			$("#total_nAdjust").text(clutil.comma(total_qy));
			$("#total_adjustAm").text(clutil.comma(total_am));
		},

		/**
		 * 件数変更イベント
		 * @param e
		 */
		_onNAdjustChange: function(e) {
			var $input = $(e.target);
			var $tr = $input.parents('tr');
			var $ca_price = $tr.find('input[name="ca_price"]');
			var $ca_adjustAm = $tr.find('input[name="ca_adjustAm"]');

			var price = $ca_price.val();
			if (!_.isEmpty(price)) {
				price = Number(price);
				price = _.isNaN(price) ? 0 : price;	// 変換失敗
			} else {
				price = 0;
			}

			var nAdjust = $input.val();
			if (!_.isEmpty(nAdjust)) {
				nAdjust = Number(nAdjust);
				nAdjust = _.isNaN(nAdjust) ? 0 : nAdjust;
			} else {
				nAdjust = 0;
			}
			var adjustAm = price * nAdjust;

			$ca_adjustAm.val(clutil.comma(adjustAm));

			this._onTotalChange();
		},

		_onAdjustAmChange: function(e) {
			// 特にすることはないので合計金額表示のみ行う
			this._onTotalChange();
		},

		_onAdjustItemChange: function(e, data) {
			var $input = $(e.target);
			var $tr = $input.parents('tr');
			var $ca_price = $tr.find('input[name="ca_price"]');
			var $ca_nAdjust = $tr.find('input[name="ca_nAdjust"]');
			var $ca_adjustAm = $tr.find('input[name="ca_adjustAm"]');
			var item = null;

			if (data == null || data.item == null) {
				item = $input.autocomplete('clAutocompleteItem');
			} else {
				item = data.item;
			}
			if (item == null) {
				var val = $input.val();
				if (val == null || val == "") {
					return;
				}
				var vals = val.split(":");
				var code = null;
				if (vals != null && vals.length > 0) {
					code = vals[0];
					item = this.adjustItemMap[code];
				}
				if (item == null) {
					return;
				}
				$input.autocomplete('clAutocompleteItem', item);
			}

			$ca_price.val(item.price);

			if (item.code == this.codeOther) {
				// その他
				clutil.inputReadonly($ca_nAdjust);
				clutil.inputRemoveReadonly($ca_adjustAm);
			} else {
				// その他以外
				clutil.inputRemoveReadonly($ca_nAdjust);
				clutil.inputReadonly($ca_adjustAm);
				// 件数変更イベントを発行する
				$ca_nAdjust.trigger('change');
			}
//			var e = {
//				target: ,
//			};
//			this._onNAdjustChange(e);
		},

		_onNoAdjustOKChange: function(e) {
			if (!this.isEditable()) {
				return;
			}
			var $tgt = $(e.target);
			var $table = $("#ca_table");

			if ($tgt.prop('checked')) {
				// チェックONなので、補正テーブルを非表示にする
				$table.hide();
			} else {
				// チェックOFFなので、補正テーブルを表示する
				$table.show();
			}
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			}
		},

		_eof: 'AMSSV0040.MainView//'
	});

	////////////////////////////////////////////////

	// 初期データを取る
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