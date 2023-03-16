// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

// UAT-0333(描画崩れ対応)
function ch_height(){}
function ch_width(){}

$(function() {

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		events: {
			'change #ca_unitID'					:	'_onUnitChanged',	// 事業ユニットが変更された
			'click #ca_btn_store_select'		:	'_onStoreSelClick',	// 店舗選択
			'change #ca_tagCode' 				:	'_onTagCodeChange',
//			'autocompletechange #ca_makerID'	:	'_onMakerChange',
			'change #ca_makerItemNum' 			:	'_onMakerItemCodeChange',
			'cl_change #ca_sizeID'				:	'_onSizeChange',
			'change #ca_qy'						:	'_onQyChange',
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
				var subTitle = clutil.opeTypeIdtoString(o.opeTypeId);
				var btnLabel = clutil.opeTypeIdtoString(o.opeTypeId, 1);
//				var fixOpeTypeId = (o.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL)
//					? am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
//					: [ am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE, { opeTypeId: o.opeTypeId, label: btnLabel} ];
				var fixOpeTypeId = null;
				if (o.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL || o.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
					fixOpeTypeId = o.opeTypeId;
				} else {
					var status = (o.chkData[0]) ? o.chkData[0].status : "0";
					if (status === amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_REGISTRIED) {
						// 登録済は一時保存を表示しない
						fixOpeTypeId = o.opeTypeId;
					} else {
						fixOpeTypeId = [ am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE, { opeTypeId: o.opeTypeId, label: btnLabel} ];
					}
				}
				var mdOpt = {
					title: '不良品処理',
					subtitle: subTitle,//'登録・修正',
					opeTypeId: fixOpeTypeId,
					pageCount: o.chkData.length,
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

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback').hide()
			});

			// Fieldlimit
//			clutil.cltxtFieldLimit($("#ca_staffID"));
			clutil.cltxtFieldLimit($("#ca_tagCode"));
			clutil.cltxtFieldLimit($("#ca_makerItemNum"));
			clutil.cltxtFieldLimit($("#ca_place"));

			// ツールチップ
			$("#ca_tp_date").tooltip({html: true});

			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// 処理区分によって分ける?

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
				// 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				if(args.data.rspHead && args.data.rspHead.fieldMessages){
					this.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				}
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}

			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 View へセットする。
				this.data2view(args.data);

				// 編集可の状態にする。
				clutil.viewRemoveReadonly($("#ca_base_form"));

				switch(this.options.opeTypeId){
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					var staffID = args.data.AMIGV0020GetRsp.defective.staffID;
					if (staffID == 0) {
						// GVで取り込んだ不良品処理結果(staffID=0)は参照のみ
						this.setReadOnlyAllItems();
					} else {
						var date = args.data.AMIGV0020GetRsp.defective.date;
						//MD-2518 #20190702 変更 START
						//// 情シス以外は過去データを編集不可
						//if (date < clcom.getOpeDate()) {
						//	this.setReadOnlyAllItems();
						var statusID = args.data.AMIGV0020GetRsp.defective.statusTypeID;
						var sendID = args.data.AMIGV0020GetRsp.defective.posSendTypeID;
						var flg = 1;
						if (date < clcom.getOpeDate()) {
							//「不良品データの状態が登録済みでない、または、POS未送信でない場合」は編集不可
							if (statusID != amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_REGISTRIED ||
								sendID != amcm_type.AMCM_VAL_SEND_STATE_NOTYET) {
								flg = 0
							}
						}
						if (flg == 0) {
							this.setReadOnlyAllItems();
						//MD-2518 #20190702 変更 END
						} else {
							this.fieldRelation.done(_.bind(function(){
								clutil.viewReadonly($("#ca_unitID_div"));
								$("#ca_btn_store_select").attr('disabled', true);
								clutil.inputReadonly($("#ca_storeID,#ca_btn_store_select,#ca_staffID,#ca_tagCode,#ca_itgrpID,#ca_makerID,#ca_makerItemNum,#ca_colorID,#ca_sizeID"));
								clutil.viewReadonly($(".ca_date_div"));
							}, this));
							clutil.setFocus(this.$("#ca_qy"));
						}
					}
					break;
				default:
					this.setReadOnlyAllItems();
					break;
				}

				break;

			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				this.data2view(args.data);
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 確認：画面は何を表示するのか？？？						【確認】
				this.data2view(args.data);
				// 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				//  args.data をアプリ個別 View へセットする。
				this.data2view(args.data);
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;

			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			}
		},

		data2view: function(data){
			var rec = data.AMIGV0020GetRsp.defective;
			var statusTypeID = rec.statusTypeID;
			// 一時保存は登録日を運用日にする
			if (statusTypeID < amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_REGISTRIED) {
				rec.date = clcom.getOpeDate();
			} else {
				// 情シス以外は過去データを編集可
				//rec.date = clcom.getOpeDate();
			}
//			if (rec.date < clcom.getOpeDate()) {
//				rec.date = clutil.addDate(clcom.getOpeDate(), 1);
//			}
			rec.storeID = {
				id: rec.storeID,
				code: rec.storeCode,
				name: rec.storeName,
			};
			rec.itgrpID = {
				id: rec.itgrpID,
				code: rec.itgrpCode,
				name: rec.itgrpName,
			};
			rec.makerID = {
				id: rec.makerID,
				code: rec.makerCode,
				name: rec.makerName,
			};
			rec.colorID = {
				id: rec.colorID,
				code: "",
				name: rec.colorName,
			};
			rec.sizeID = {
				id: rec.sizeID,
				code: "",
				name: rec.sizeName,
			};
			clutil.data2view(this.$('#ca_base_form'), rec);

			this.setAutocompleteData($("#ca_staffID"), rec.staffID, rec.staffCode, "");
			this.$("#ca_cost").val(clutil.comma(rec.cost));
			this.$("#ca_am").val(clutil.comma(rec.am));
			this.$('#ca_statusType').val(clutil.gettypename(amcm_type.AMCM_TYPE_DEFECTIVE_STATE_TYPE, rec.statusTypeID, 1));
			this.statusTypeID = rec.statusTypeID;
			if (rec.posSendTypeID == 0) {
				rec.posSendTypeID = amcm_type.AMCM_VAL_SEND_STATE_NOTYET;
			}
			this.$('#ca_posSendTypeID').val(clutil.gettypename(amcm_type.AMCM_TYPE_SEND_STATE, rec.posSendTypeID, 1));
			this.posSendTypeID = rec.posSendTypeID;
		},

		setReadOnlyAllItems: function(){
			this.fieldRelation.done(function(){
				clutil.viewReadonly($('#ca_base_form'));
			});
		},

		setAutocompleteData : function ($input, id, code, name) {
			var data = {
				id: id,
				code: code,
				name: name
			};
//			$input.autocomplete('clAutocompleteItem', data);
            var view = (name == "") ? code : code + ":" + name;
            $input.val(view);
            $input.attr("cs_id", id);
            $input.attr("cs_code", code);
            $input.attr("cs_name", name);
            $input.data("cl_codeinput_item", data);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var _this = this;
			this.mdBaseView.initUIElement();

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
//					_this.$("#ca_storeID").autocomplete("clAutocompleteItem", {id: id, code: code, name: name});
					_this.storeAutocomplete.setValue({id: id, code: code, name: name});
				} else {
//					var chk = $("#ca_storeID").autocomplete("clAutocompleteItem");
//					if (chk == null || chk.id == 0)  {
//						_this.AMPAV0010Selector.clear();
//					}
					var store = _this.storeAutocomplete.getValue();
					if (store.id == 0) {
						_this.AMPAV0010Selector.clear();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
			this.AMPAV0010Selector.clear = function() {
				if (typeof mainView != "undefined") {
//					_this.$("#ca_storeID").autocomplete("removeClAutocompleteItem");
					_this.storeAutocomplete.resetValue();
				}
			};
			// 店舗オートコンプリート
			var unit_id = clcom.userInfo.unit_id;
			this.storeAutocomplete = this.getOrg(unit_id);

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 検索日
				datepicker: {
					el: "#ca_date",
					initValue: clcom.getOpeDate()
				},
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID",
					initValue: (clcom.userInfo) ? clcom.userInfo.unit_id : 0
				},
//				// 店舗オートコンプリート
//				clorgcode: {
//					el: '#ca_storeID',
//					addDepends: ['p_org_id'],
//					dependSrc: {
//						p_org_id: 'unit_id'
//					}
//				},
//				// 店舗参照ボタン
//				AMPAV0010: {
//					button: this.$('#ca_btn_store_select'),
//					view: this.AMPAV0010Selector,
//					showOptions: function(){
//						return {
//							org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
//							               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
//							               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ]
//						};
//					}
//				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_itgrpID",
				},
				// メーカー
				clvendorcode: {
					el: "#ca_makerID",
					dependSrc: {
//						itgrp_id: 'itgrp_id'
						addDepends: ['unit_id', 'itgrp_id'],
					}
				},
//				clcolorcode: {
//					el: '#ca_colorID',
//					itemTemplate: '<%- it.name %>',
//					dependAttrs: {
//						iagfunc_id: 'iagfunc.color'
//					},
//				},
//				// サイズ
//				clsizecode: {
//					el: "#ca_sizeID",
//					itemTemplate: '<%- it.name %>',
//					dependSrc: {
//						itemID: mainView.saveItemID,
//						colorID: 'colorID',
//					}
//				},
			}, {
				dataSource: {
					orgfunc_id: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					vendor_typeid: amdb_defs.MTTYPE_F_VENDOR_MAKER,
				}
			});

			var promise = $.Deferred();
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
				console.log("done in!!!!");
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					var storeID = {
						id : clcom.userInfo.org_id,
						code : clcom.userInfo.org_code,
						name : clcom.userInfo.org_name,
					};
//					$('#ca_storeID').autocomplete("clAutocompleteItem", storeID);
					_this.storeAutocomplete.setValue(storeID);
					clutil.inputReadonly($('#ca_storeID'));
					clutil.inputReadonly($('#ca_btn_store_select'));
				} else {
					_this._onUnitChanged();
				}
				// タグコード初期状態
				var unitID = Number($("#ca_unitID").val());
				$('#ca_tagCode').attr("readonly", (unitID == 0));

				promise.resolve();
			});

			// 作業担当者
			clutil.clstaffcode2($("#ca_staffID"));

//			// メーカー
//			this.makeAutocomplete = clutil.clvendorcode($("#ca_makerID"), {
//				dependAttrs: {
//					unit_id: function() {
//						return mainView.getValue('unitID', 0);
//					},
//					vendor_typeid: amdb_defs.MTTYPE_F_VENDOR_MAKER
//				}
//			});

			// カラー
			this.colorAutocomplete = this.getColor(this.saveItemID);

			// サイズ
			this.sizeAutocomplete = clutil.clsizecode({
				el: $('#ca_sizeID'),
				itemTemplate: '<%- it.name %>',
				dependAttrs: {
					itemID: function() {
						return mainView.saveItemID;
					},
					colorID: function() {
						var color_data = $('#ca_colorID').autocomplete('clAutocompleteItem');
						return color_data.id;
					}
				},
			});

			// 不良理由分類区分
			if ((clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN)
					&& clcom.userInfo.org_kind_typeid != amcm_type.AMCM_VAL_ORG_KIND_HQ) {
				// 店舗ユーザーか店長ユーザーで、本部組織で無い場合
				var html_source = '';
				html_source += '<option value="0">&nbsp;</option>';
				html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECT_REASON_BURN + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_DEFECT_REASON, amcm_type.AMCM_VAL_DEFECT_REASON_BURN) + '</option>';
				html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECT_REASON_MISSED_MESURE + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_DEFECT_REASON, amcm_type.AMCM_VAL_DEFECT_REASON_MISSED_MESURE) + '</option>';
				html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECT_REASON_BLOT + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_DEFECT_REASON, amcm_type.AMCM_VAL_DEFECT_REASON_BLOT) + '</option>';
				html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECT_REASON_DIFF_SETUP + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_DEFECT_REASON, amcm_type.AMCM_VAL_DEFECT_REASON_DIFF_SETUP) + '</option>';
				html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECT_REASON_CUST_RESPONSE_RETURN + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_DEFECT_REASON, amcm_type.AMCM_VAL_DEFECT_REASON_CUST_RESPONSE_RETURN) + '</option>';
				html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECT_REASON_INSECT_DAMAGE + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_DEFECT_REASON, amcm_type.AMCM_VAL_DEFECT_REASON_INSECT_DAMAGE) + '</option>';
				html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECT_REASON_DEFECT_FABRIC + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_DEFECT_REASON, amcm_type.AMCM_VAL_DEFECT_REASON_DEFECT_FABRIC) + '</option>';
				html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECT_REASON_TRIAL_FITTING + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_DEFECT_REASON, amcm_type.AMCM_VAL_DEFECT_REASON_TRIAL_FITTING) + '</option>';
				html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECT_REASON_PROPERTY_LOSS + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_DEFECT_REASON, amcm_type.AMCM_VAL_DEFECT_REASON_PROPERTY_LOSS) + '</option>';
				html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECT_REASON_ACC_RECEIVABLE_RETURN + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_DEFECT_REASON, amcm_type.AMCM_VAL_DEFECT_REASON_ACC_RECEIVABLE_RETURN) + '</option>';
				html_source += '<option value="' + amcm_type.AMCM_VAL_DEFECT_REASON_OTHERS + '">' + clutil.gettypename(amcm_type.AMCM_TYPE_DEFECT_REASON, amcm_type.AMCM_VAL_DEFECT_REASON_OTHERS) + '</option>';
				$("#ca_reasonTypeID").html('');
				$("#ca_reasonTypeID").html(html_source).selectpicker().selectpicker('refresh');
			} else {
				clutil.cltypeselector($("#ca_reasonTypeID"), amcm_type.AMCM_TYPE_DEFECT_REASON, 1);
			}

			// タグコード変更完了イベント
			clutil.mediator.on('onCLtag2varietyCompleted', this._onCLtag2varietyCompleted);
			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLmakerItemCodeCompleted', this._onCLmakerItemCodeComplete);

			return promise.promise();
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			this.AMPAV0010Selector.render();
			//this.AMPAV0010Selector.clear();

			var opeType = this.options.opeTypeId;
			if (opeType == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				clutil.viewReadonly($(".ca_date_div"));
				$('#ca_statusType').val(clutil.gettypename(amcm_type.AMCM_TYPE_DEFECTIVE_STATE_TYPE, amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_NOT_REGISTRIED, 1));
//				$('#ca_printStatusType').val(clutil.gettypename(amcm_type.AMCM_TYPE_PRINT_STATE, amcm_type.AMCM_VAL_PRINT_STATE_NOT_PIRNT, 1));
				// TODO
				$('#ca_posSendTypeID').val(clutil.gettypename(amcm_type.AMCM_TYPE_SEND_STATE, amcm_type.AMCM_VAL_SEND_STATE_NOTYET, 1));

				// 初期フォーカスをセット
				var $tgt = null;
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
							|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
						$tgt = $("#ca_staffID");
					}
					else{
						$tgt = $("#ca_storeID");
					}
				}
				else{
					$tgt = $("#ca_unitID");
				}
				clutil.setFocus($tgt);
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

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
		 * 商品情報をクリア
		 */
		itemDataClear: function() {
			$('#ca_itemID').val('');
			$('#ca_itgrpID').autocomplete('removeClAutocompleteItem');
			$('#ca_makerID').autocomplete('removeClAutocompleteItem');
			$('#ca_makerItemNum').val('');
			clutil.cltxtFieldLimitReset($("#ca_makerItemNum"));
			$('#ca_colorID').autocomplete('removeClAutocompleteItem');
			$('#ca_sizeID').autocomplete('removeClAutocompleteItem');
			this.saveItemID = 0;
			$('#ca_cost').val(0);
			$('#ca_am').val(0);
		},

		/**
		 * カラーオートコンプリート取得
		 */
		getColor: function(itemID) {
			return clutil.clcolorcode({
				el: $('#ca_colorID'),
				itemTemplate: '<%- it.name %>',
				dependAttrs: {
					itemID: itemID
				},
			});
		},

		/**
		 * 事業ユニットが変更されたイベント
		 */
		_onUnitChanged: function(e){
//			console.log($(e.target).val());
			if(this.deserializing){
				// データセット中
				return;
			}
			var unitID = Number($("#ca_unitID").val());
			this.getOrg(unitID);
			this.storeAutocomplete.setValue();
			this.$("#ca_storeID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_store_select").attr("disabled", (unitID == 0));
			this.AMPAV0010Selector.clear();
			this.$("#ca_tagCode").val("");
			clutil.cltxtFieldLimitReset($("#ca_tagCode"));
			// 商品情報クリア
			this.$("#ca_tagCode").attr("readonly", (unitID == 0));
			this.itemDataClear();
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){
			var unitID = Number($("#ca_unitID").val());
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
				el: $("#ca_storeID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
				},
//				initValue : {
//					code : clcom.userInfo.org_code,
//					id : clcom.userInfo.org_id,
//					name : clcom.userInfo.org_name,
//				}
			});
		},

		/**
		 * タグコード
		 */
		_onTagCodeChange: function(e) {
			var $tgt = $(e.target);
			var unitID = Number($("#ca_unitID").val());
			if (unitID == 0) {
				return;
			}
			var code = $tgt.val();
			if (_.isUndefined(code) || _.isNull(code) || _.isEmpty(code)) {
				return;
			}
			// 商品情報取得(unitID指定)
			clutil.cltag2variety({code: code, unitID: unitID});
		},

		/**
		 * タグコード→商品、品種、メーカー名、メーカー品番、カラー、サイズ、下代を取得完了イベント
		 * @param data
		 * @param e
		 */
		_onCLtag2varietyCompleted: function(data, e) {
			console.log(data.data.rec);
			// 商品情報クリア
			this.itemDataClear();
			if (data.status == "NG") {
				this.validator.setErrorMsg($('#ca_tagCode'), clutil.getclmsg(clmsg.cl_staffcode_mismatch));
				return;
			}

			// 設定
			var rec = data.data.rec;
			rec.itgrpID = {
				id: rec.varietyID,
				code: rec.varietyCode,
				name: rec.varietyName,
			};
			rec.makerID = {
				id: rec.makerID,
				code: rec.makerCode,
				name: rec.makerName,
			};
			rec.colorID = {
				id: rec.colorID,
				code: "",
				name: rec.colorName,
			};
			rec.sizeID = {
				id: rec.sizeID,
				code: "",
				name: rec.sizeName,
			};
			this.saveItemID = rec.itemID;	// itemID保存(MtItem)
			rec.itemID = rec.colorSizeItemID;
			clutil.data2view($('#ca_item_form'), rec);
			$("#ca_makerItemNum").val(rec.makerItemCode);
			// Fieldlimitリセット
			clutil.cltxtFieldLimitReset($("#ca_makerItemNum"));
			$("#ca_cost").val(clutil.comma(rec.cost));
			// 金額計算
			var qy = $("#ca_qy").val().split(",").join("");
			var am = qy * rec.cost;
			$("#ca_am").val(clutil.comma(am));
		},

//		/**
//		 * メーカー
//		 */
//		_onMakerChange: function(event, ui) {
//			$(event.target).attr('cs_id', ui.item.id);
//		},

		/**
		 * メーカー品番
		 */
		_onMakerItemCodeChange: function (e) {
			var data_itgrp = $('#ca_itgrpID').autocomplete('clAutocompleteItem');
			var itgrp_id = data_itgrp.id;
			var data_maker = $('#ca_makerID').autocomplete('clAutocompleteItem');
			var maker_id = data_maker.id;
			console.log(data_maker);

			var maker_code = $(e.target).val();
			if (maker_code == 0) {
				return;
			}

			var makeritemcode = {
				itgrp_id: itgrp_id,
				maker_id: maker_id,
				maker_code: maker_code,
			};
			console.log(makeritemcode);

			clutil.clmakeritemcode2item(makeritemcode, e);
		},

		/**
		 * メーカー品番→商品取得完了イベント
		 * @param data
		 * @param e
		 */
		_onCLmakerItemCodeComplete: function(data, e) {
			console.log(data.data.rec);
			var rec = data.data.rec;
			// itemID保存(MtItem),下代設定
			this.saveItemID = rec.itemID;
			// コードに該当する商品IDがない場合
			if (rec.itemID == ""){
				this.validator.setErrorMsg($("#ca_makerItemNum"), clmsg.EGM0026);

				$('#ca_itemID').val(null);

				return;
			}
			console.log(this.saveItemID);

			// カラー
			this.colorAutocomplete = this.getColor(rec.itemID);

			$("#ca_cost").val(clutil.comma(rec.cost));
			// 金額計算
			var qy = $("#ca_qy").val().split(",").join("");
			var am = qy * rec.cost;
			$("#ca_am").val(clutil.comma(am));
		},

		/**
		 * サイズ
		 */
		_onSizeChange: function(e) {
			var item = $('#ca_sizeID').autocomplete('clAutocompleteItem');
			console.log(item);
			if (item == null) {
				return;
			}
			// 商品ID、タグコード設定
			$('#ca_itemID').val(item.colorSizeItemID);
			$('#ca_tagCode').val(item.colorSizeItemCode);
		},

		/**
		 * 数量
		 */
		_onQyChange: function(event, ui) {
			var qy = $(event.target).val();
			if (!$.isNumeric(qy) || qy.charAt(0) == "0" ||qy.length > 3) {
				$("#ca_am").val("");
			} else {
				var cost = $("#ca_cost").val().split(",").join("");
				var am = qy * cost;
				$("#ca_am").val(clutil.comma(am));
			}
//			var cost = $("#ca_cost").val().split(",").join("");
//			var am = qy * cost;
//			$("#ca_am").val(clutil.comma(am));
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 不良品処理検索リクエスト
				AMIGV0020GetReq: {
					srchID: this.options.chkData[pgIndex].id,			// 不良品処理ID
				},
				// 不良品処理更新リクエスト
				AMIGV0020UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMIGV0020',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			this.validator.clear();

			if(!this.validator.valid()) {
				return null;
			}

			var f_error = false;
			var ope_date = clcom.getOpeDate();
			var $date = this.$("#ca_date");
			var date = clutil.dateFormat($date.val(), "yyyymmdd");

			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			//case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:		MD-2518 #20190702 削除
				if (date < ope_date) {
					// 処理日が運用日以前の場合はエラー
					this.validator.setErrorMsg($date, clutil.getclmsg(clmsg.EIG0001));
					clutil.mediator.trigger("onTicker", clutil.getclmsg(clmsg.EIG0001));
					f_error = true;
				}
				break;

			default:
				break;
			}
			if(f_error){
				return null;
			}

			// 画面入力値をかき集めて、Rec を構築する。
			var defective = clutil.view2data(this.$('#ca_base_form'));
			console.log(defective);

			// エラーチェック
			var errInfo = {};
			var f_err = false;
			// 入力チェック
			var defective_error = "タグコードか品種～サイズを入力してください。";
			var itemID = defective.tagCode == "" ? 0 : Number(defective.itemID);
			var itgrpID = Number(defective.itgrpID);
			if (itemID <= 0 && (!defective.itgrpID || itgrpID <= 0)) {
				errInfo['ca_tagCode'] = defective_error;
				errInfo['ca_itgrpID'] = defective_error;
				f_err = true;
			}
			var makerID = Number(defective.makerID);
			if (itemID <= 0 && (!defective.makerID || makerID <= 0)) {
				errInfo['ca_tagCode'] = defective_error;
				errInfo['ca_makerID'] = defective_error;
				f_err = true;
			}
			if (itemID <= 0 && defective.makerItemNum == "") {
				errInfo['ca_tagCode'] = defective_error;
				errInfo['ca_makerItemNum'] = defective_error;
				f_err = true;
			}
			var colorID = Number(defective.colorID);
			if (itemID <= 0 && (!defective.colorID || colorID <= 0)) {
				errInfo['ca_tagCode'] = defective_error;
				errInfo['ca_colorID'] = defective_error;
				f_err = true;
			}
			var sizeID = Number(defective.sizeID);
			if (itemID <= 0 && (!defective.sizeID || sizeID <= 0)) {
				errInfo['ca_tagCode'] = defective_error;
				errInfo['ca_sizeID'] = defective_error;
				f_err = true;
			}
			if (f_err) {
				this.validator.setErrorInfo(errInfo);
				return null;
			}

			var opeType = this.options.opeTypeId;
			if (opeType == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				defective.recno = "";
				defective.state = 0;
				defective.id = 0;
				// TODO:一時保存設定
				defective.statusTypeID = amcm_type.AMCM_VAL_DEFECTIVE_STATE_TYPE_TEMPORARY;
//				defective.printStatusTypeID = amcm_type.AMCM_VAL_PRINT_STATE_NOT_PIRNT;
				defective.posSendTypeID = amcm_type.AMCM_VAL_SEND_STATE_NOTYET;
			} else {
				defective.statusTypeID = this.statusTypeID;
//				defective.printStatusTypeID = this.printStatusTypeID;
				defective.posSendTypeID = this.posSendTypeID;
			}

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: opeTypeId,
					recno: defective.recno,
					state: defective.state
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 不良品処理検索リクエスト
				AMIGV0020GetReq: {
				},
				// 不良品処理更新リクエスト
				AMIGV0020UpdReq: {
					defective: defective
				}
			};

			return {
				resId: clcom.pageId,	//'AMIGV0020',
				data: updReq
			};
		},

		_eof: 'AMIGV0020.MainView//'
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
		mainView = new MainView(clcom.pageArgs);
		mainView.initUIElement().always(function(){
			mainView.render();
		});
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
