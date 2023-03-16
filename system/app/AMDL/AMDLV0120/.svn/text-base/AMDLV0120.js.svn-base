useSelectpicker2();

var OpeType = {
		AMDLV0120_OPETYPE_SAVE:		101,	// 一時保存
		AMDLV0120_OPETYPE_APPLY:	102,	// 申請
		AMDLV0120_OPETYPE_RETURN:	103,	// 差戻し
		AMDLV0120_OPETYPE_APPROVE1: 104,		// 1次承認済
		AMDLV0120_OPETYPE_APPROVE: 105,		// 承認済

		AMDLV0120_OPETYPE_NUM: 100,			//TypeID調整係数
};

$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var MyApp = {};

	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		events: {
			'change #ca_srchUnitID'	: '_onUnitChange',				// ユニット変更
			"input #ca_vendor"		: "_onVendorChanged",			// 取引先変更
			'click #ca_btn_store'			: '_onStoreSelClick',					// 店舗選択補助画面起動
			"click #ca_table .btn-delete"	: "_onDeleteLineClick",					// テーブル行削除
			"click #ca_table tfoot tr.addRow"			: "_onAddLineClick",		//テーブル行追加
			'change #ca_table input[name="makerCode"]'	: '_onmakerCodeChanged',	//メーカー品番変更
			"click #ca_fileDel_btn"			: "_onDelFileClick",					//ファイル削除押下

			'click #ca_sample_download'		: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
			"click .cl_download"			: "_onCSVClick",			//CSV出力押下
			"click #ca_attachedFileName"	: "_onFileDLClick",			//添付ファイル押下
		},

//		sampleURL: "/public/sample/評価減サンプル.xlsx",
		sampleURL: "/public/sample/返品依頼サンプル.xlsx",

		initialize: function(opt){
			_.bindAll(this);
			var _this = this;

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '返品依頼',
//					subtitle: '登録',
					confirmLeaving: true,		//戻る押下時のダイアログ設定
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					btn_csv: true,
					// 処理区分（照会）以外では［エクセルデータ出力］ボタンを表示する
//					btn_csv: (o.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL),
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					//「戻る」等の押下時の警告ダイアログ
					isConfirmLeaving: this._isConfirmLeaving,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					 // リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) ?
						this._buildGetReqFunction : undefined,
					// 空更新チェック用データを作る関数。
					// UIから集めてきた更新データが GET してきた直後の内容と同一かどうかをチェックするための
					// GET直後データを加工する関数。GET 直後に変更するプロパティは空更新チェックの比較対象外
					// にあたるため、比較対象外プロパティを除去するために使用する。
					buildSubmitCheckDataFunction: this._buildSubmitCheckDataFunction
				};

				if(o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					// 参照モード以外は、下部 Ope ボタンをカスタマイズする。
					_.extend(mdOpt, {
						opeTypeId: [
							{
								opeTypeId: OpeType.AMDLV0120_OPETYPE_SAVE,
								label: '一時保存'
							},
							{
								opeTypeId: OpeType.AMDLV0120_OPETYPE_APPLY,
								label: '申請'
							},
						],
						btn_cancel: true,
						btn_submit: true,
						btn_csv: true
					});
				}

				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator($('#ca_srchArea'), {
				echoback : $('.cl_echoback')
			});

			// TODO: アプリ個別の View や部品をインスタンス化する
			var that = this;
			this.fieldRelation = clutil.FieldRelation.create('subclass', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},

				// 品種
				clvarietycode: {
					el: '#ca_stditgrp'
				},

				// 取引先
				clvendorcode: {
					el: '#ca_vendor',
					addDepends: ['unit_id', 'itgrp_id'],
					branches: ['list']
				},

				// 送り先
				'select retAddrTypeID': {
					el: '#ca_retAddrTypeID',
					addDepends: ['maker_id'],
					getItems: function(attrs){
						var vendor = that.fieldRelation.get('clvendorcode');
						var getList = function(list){
							list || (list = []);
							var retAddrTypes = [
								amcm_type.AMCM_VAL_RETURN_ADDR_TYPE_RET_ADDR_TYPE1,
								amcm_type.AMCM_VAL_RETURN_ADDR_TYPE_RET_ADDR_TYPE2,
								amcm_type.AMCM_VAL_RETURN_ADDR_TYPE_RET_ADDR_TYPE3
							].slice(0, list.length);
							var typeList1 = clutil.gettypenamelist(amcm_type.AMCM_TYPE_RETURN_ADDR_TYPE, retAddrTypes);
							_.each(typeList1, function(item, i){
								item.addr = list[i];
							});
							var typeList2 = clutil.gettypenamelist(amcm_type.AMCM_TYPE_RETURN_ADDR_TYPE, [
								amcm_type.AMCM_VAL_RETURN_ADDR_TYPE_CENTER,
								amcm_type.AMCM_VAL_RETURN_ADDR_TYPE_MANUAL
							]);
							var typeList = _.chain(typeList1).concat(typeList2).map(function(attrs){
								attrs.id = attrs.type_id;
								return attrs;
							});
							return typeList.value();
						};

						if(vendor && !vendor.list){
							var variety = that.fieldRelation.get('clvarietycode');
							var unitID = that.fieldRelation.get('clbusunitselector');
							return clutil.postJSON('am_pa_vendor_srch', {
								cond: {
									vendor_typeid:  amdb_defs.MTTYPE_F_VENDOR_MAKER,
									itgrp_id: variety && variety.id,
									unit_id: unitID,
									codename: vendor.code
								}
							}).then(function(data){
								var vendor = _.where(data.list, {vendor_id: attrs.maker_id})[0];
								var list = vendor && vendor.list;
								return getList(list);
							});
						}else{
							return getList(vendor.list);
						}
					}
				},

				'node addr': {
					depends: ['retAddrTypeID'],
					onDependChange: function(attrs, options){
						var relation = options.relation;
						var retAddrType = relation.attr('retAddrTypeID');
						if(MyApp.prevRetAddrType === amcm_type.AMCM_VAL_RETURN_ADDR_TYPE_MANUAL){
							MyApp.retAddrSave = {
								postalNo: $('#ca_postalNo').val(),
								addr: $('#ca_addr').val()
							};
						}

						if(!attrs.retAddrTypeID){
							//送り先が指定されていない場合
							$('#div_center').hide();
							$('#div_postal').hide();
							$('#div_address').hide();
						}
						else if(attrs.retAddrTypeID === amcm_type.AMCM_VAL_RETURN_ADDR_TYPE_CENTER){
							//送り先：倉庫の場合
							$('#div_center').show();
							$('#ca_center').addClass("cl_required");


							//住所のペインが隠れたら値をリセット(エラーの状態でhideするとそのまま引っかかるため)
							$('#ca_postalNo').val("");
							$('#ca_addr').val("");

							_this.validator.clearErrorMsg($('#ca_postalNo'));
							_this.validator.clearErrorMsg($('#ca_addr'));

							$('#div_postal').hide();
							$('#div_address').hide();
							$('#ca_postalNo').removeClass("cl_required");
							$('#ca_addr').removeClass("cl_required");
						}
						else{
							if(attrs.retAddrTypeID === amcm_type.AMCM_VAL_RETURN_ADDR_TYPE_MANUAL){
								//送り先：手入力の場合
								if(MyApp.retAddrSave){
									$('#ca_postalNo').val(MyApp.retAddrSave.postalNo);
									$('#ca_addr').val(MyApp.retAddrSave.addr);
								}

							}
							else{
								if(retAddrType.addr){
									$('#ca_postalNo').val(retAddrType.addr.postalno);
									$('#ca_addr').val(_.template('<%= it.addr1 %><%= it.addr2 %><%= it.addr3 %>', retAddrType.addr, {variable:'it'}));
								}
							}
							$('#div_center').hide();
							$('#ca_center').removeClass("cl_required");

							//倉庫のペインが隠れたら値をリセット(エラーの状態でhideするとそのまま引っかかるため)
							var resetData = {
									code: null,
									id: null,
									name: null
							};
							clutil.data2view($('#ca_centerArea'), _.extend({}, resetData, {
								_view2data_center_cn: {
									id: resetData.id,
									name: resetData.name,
									code: resetData.code
								}
							}));
							_this.validator.clearErrorMsg($('#ca_center'));


							$('#div_postal').show();
							$('#div_address').show();
							$('#ca_postalNo').addClass("cl_required");
							$('#ca_addr').addClass("cl_required");
						}
						console.log(attrs, options);
					}
				}
			}, {
				dataSource: {
					vendor_typeid: amdb_defs.MTTYPE_F_VENDOR_MAKER
				}
			});
			this.fieldRelation.done(function() {

			});

			var unit = null;
			var unit_id = clcom.userInfo.unit_id;
			if(clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS) {
				unit = unit_id;
			}

			// 倉庫 #ca_centerID
			this.storeAutocomplete = clutil.clorgcode( {
				el : '#ca_center',
				dependAttrs : {
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					org_typeid :amcm_type.AMCM_VAL_ORG_KIND_CENTER,
				    f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
				}
		    });

			// 発送方法	#ca_payTypeID
			clutil.cltypeselector(this.$("#ca_payTypeID"), amcm_type.AMCM_TYPE_SHIP_PAYMENT, 1);
//			this.$("#ca_payTypeID").val(amcm_type.AMCM_VAL_SHIP_PAYMENT_PAY_ON_DELIVERY);

			// datepicker
			// 店舗出力日
			clutil.datepicker(this.$('#ca_releaseDate')).datepicker("setIymd");
			// 返品期限
			clutil.datepicker(this.$('#ca_limitDate')).datepicker("setIymd");

			// 色
			clutil.clcolorcode(this.$('#ca_colorID'), {
				// TODO 分からない
			});

			//画面ヘルプのツールチップ表示
			$("#tp_code").tooltip();

            //添付ファイルDL用
            this.attachedFileURL = "";


			// グループID -- AMDLV0120 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMDLV0120';

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				this.f_confirm = false;
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// それ登録以外は、Submit と、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}
			this.listenTo(clutil.mediator, 'onOperation', function(rtyp, pgIdx, e){
				console.log(arguments);
				if(rtyp !== am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV){
					return;
				}
				// TODO: エクセルダウンロード処理を書く
			});
			this.opeTypeId = fixopt.opeTypeId;	// 処理区分を保存

			//フィールドカウント
			clutil.cltxtFieldLimit($("#ca_addr"));
			clutil.cltxtFieldLimit($("#ca_reason"));
			clutil.cltxtFieldLimit($("#ca_comment"));
			clutil.cltxtFieldLimit($("#ca_reject"));
		},

		wait: function(){
			var deferred = $.Deferred();
			var that = this;
			$.when(this.fieldRelation)
				.done(function(){
					deferred.resolveWith(that);
				})
				.fail(function(){
					deferred.rejectWith(that);
				});
			return deferred.promise();
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var _this = this;

			this.mdBaseView.initUIElement();

			// TODO: アプリ個別の View や部品を初期化（選択部品の選択肢を投入するなど）する
			// 新規登録、編集時にプレースホルダ―住所表示
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
				this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD ||
				this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				this.$("#ca_postalNo").attr("placeholder", clcom.getSysparam("PAR_AMCM_DEFAULT_POSTAL_NUMBER"));   //郵便番号
				this.$("#ca_addr").attr("placeholder", clcom.getSysparam("PAR_AMCM_DEFAULT_ADDR1")+clcom.getSysparam("PAR_AMCM_DEFAULT_ADDR2")+clcom.getSysparam("PAR_AMCM_DEFAULT_ADDR3"));	//住所
			}

			//承認状態によってフッタボタンを再描画
			this.chkState(null);

			// カレンダー
			this.releaseDatePicker = clutil.datepicker(this.$('#ca_releaseDate'));
			this.limitDatePicker = clutil.datepicker(this.$('#ca_limitDate'));

			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: this.$("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	this.$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector.render();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				var item;
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					item = data[0];
					item.id = item.val;
					_this.storeAutocomplete.setValue(item);
				}
				_.defer(function(){							// setFocusを_.defer()で後回しにする
					clutil.setFocus($("#ca_btn_store")); 	// 参照ボタンへあてなおす
				});
			};

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					var reqHead = {
							opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV_INPUT,
					};

					var head = clutil.view2data(this.$('#ca_srchArea'));
					head.unitID = head.srchUnitID;
					head.stditgrp = head._view2data_stditgrp_cn;
					head.vendor = head._view2data_vendor_cn;
					head.center = head._view2data_center_cn;
					head.attachedFileName = $("#ca_attachedFileName").text();
					head.attachedFilePath = $("#ca_attachedFilePath").text();
					var list = clutil.tableview2data(this.$('#ca_table_tbody').children());

					AMDLV0120UpdReq = {
						ret: head,
						retItemList : list
					};
					// リクエストデータ本体
					var request = {
						reqHead : reqHead,
						AMDLV0120UpdReq  : AMDLV0120UpdReq
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMDLV0120',
						data: request
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(this.validator.valid, this.validator)
				}
			});
			// 取込処理が失敗した。後処理が必要な場合は↓イベントを購読する。
			this.opeCSVInputCtrl.on('fail', function(data){
				data.rspHead.message = clmsg.EGM0030;
				if(data.rspHead.fieldMessages){
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					_this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}

				//リジェクトされたファイルがあればダウンロード
				if(!_.isEmpty(data.rspHead.uri)){
					var uri = data.rspHead.uri;
					var newWindow = false;
					clutil.download({url: uri, newWindow: newWindow});
				}
			});

			// 取込処理が成功した。返ってきたデータからテーブル作成。
			this.opeCSVInputCtrl.on('done', function(data){
				var list = data.AMDLV0120GetRsp;

				_this.clearTable();
				_this.tableSetRecs(list);
			});

			// ---------------------------------------- [CSV取込ボタン]: ここまで


			// ---------------------------------------- [添付ファイルアップロード]
			var opeFileInputCtrl = clutil.View.buildFileUploadButtonView(this.$("#ca_fileUp_btn"));
			opeFileInputCtrl.on('success', _.bind(function(file){

				//ファイルID,名称反映
				var line = '<a id="ca_attachedFileName" class="cl_filedownld" target="_blank">' + file.filename + '</a>';
				var id = file.id;
				$("#ca_label").html(line);
				$("#ca_attachedFileID").val(id);

				this.attachedFileURL = file.uri;

				//ダイアログ
				//clutil.MessageDialog2('取込が完了しました。');

			}, this));
			// ---------------------------------------- [添付ファイルアップロード]：ここまで
			// 初期のアコーディオン展開状態をつくる。
			return this;
		},

		/**
		 * 承認状況を設定する
		 * */
		chkState:function(ret){
			// 処理区分
			var ope_id = this.opeTypeId;
			// 承認状態ID
			var approveTypeID = 0;
			if(ret != null && ret.stateID != null){
				approveTypeID = ret.stateID;
			}
			// 遷移元画面
			var srcId = clcom.srcId;
			var releaseDate = null;
			if (ret != null && ret.releaseDate != null) {
				releaseDate = ret.releaseDate;
			}

			var opt = {
				opeTypeId: ope_id,
				approveTypeID: approveTypeID,
				srcId: srcId,
				releaseDate: releaseDate,
			};
			return this.setFooterButtons(opt);
		},

		/**
		 * 戻るなどの押下時に警告を出すかの判断
		 * @param isSubmitBlocking
		 * @param pgIndex
		 * @returns
		 */
		_isConfirmLeaving: function(isSubmitBlocking, pgIndex) {
			var flg = isSubmitBlocking;
			if (!flg && this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && !this.f_confirm) {
				flg = true;
			}
			if(this.f_force_confirm == false){
				flg = false;
			}
			return flg;
		},

		/**
		 * フッターボタンを各モード用に設定する
		 * @param opt
		 */
		setFooterButtons: function(opt) {
			//リードオンリーにするかどうかのフラグ
			var r_flag = false;
			//差し戻し理由欄は通常リードオンリー
			this.rej_flag = true;

			//通常のフッタ
			var opeTypeId = [
			 				{
			 					opeTypeId: OpeType.AMDLV0120_OPETYPE_SAVE,
			 					label: '一時保存'
			 				},
			 				{
			 					opeTypeId: OpeType.AMDLV0120_OPETYPE_APPLY,
			 					label: '申請'
			 				},
			 			];

			if (opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				// 新規作成・複製の場合はデフォルトのまま
				// 差戻し履歴ヘッダは隠す
				$("#ca_table_reject").hide();
				clutil.viewReadonly($("#ca_rejectArea"));
			}
			else if (opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				var today = clcom.getOpeDate();

				// 編集の場合
				if (opt.approveTypeID == amcm_type.AMCM_VAL_APPROVE_APPLY) {
					//一次承認申請の場合
					//リードオンリー化
					r_flag = true;
					if (opt.srcId == "AMDLV0110") {
						// 返品一覧からの遷移なら、キャンセルのみ
						opeTypeId = -1;
					}
					else{
						if (opt.releaseDate != null && today >= opt.releaseDate) {
							// 承認一覧からの遷移(差し戻しのみ)
							opeTypeId = [
								{
									opeTypeId: OpeType.AMDLV0120_OPETYPE_RETURN,
									label: '差戻し'
								},
							];
						} else {
							// 承認一覧からの遷移
							opeTypeId = [
								{
									opeTypeId: OpeType.AMDLV0120_OPETYPE_RETURN,
									label: '差戻し'
								},
								{
									opeTypeId: OpeType.AMDLV0120_OPETYPE_APPROVE1,
									label: '承認'
								},
							];
						}
						//差し戻し理由欄は編集可能
						this.rej_flag = false;
					}
				}
				else if (opt.approveTypeID == amcm_type.AMCM_VAL_APPROVE_APPROVE1) {
					//最終承認申請の場合
					//リードオンリー化
					r_flag = true;
					if (opt.srcId == "AMDLV0110") {
						// 返品一覧からの遷移なら、キャンセルのみ
						opeTypeId = -1;
					}
					else{
						// 承認一覧からの遷移
						opeTypeId = [
							{
								opeTypeId: OpeType.AMDLV0120_OPETYPE_RETURN,
								label: '差戻し'
							},
							{
								opeTypeId: OpeType.AMDLV0120_OPETYPE_APPROVE1,
								label: '承認'
							},
						];
						//差し戻し理由欄は編集可能
						this.rej_flag = false;
					}
				}
			}
			else if (opt.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL) {
				//参照モードの場合はフッタを出さない
				opeTypeId = opt.opeTypeId;
				this.mdBaseView.options.btn_cancel = false;
				this.mdBaseView.options.btn_submit = false;
			}
			else {
				// その他は通常画面と同じ
				opeTypeId = opt.opeTypeId;
			}
			// ボタンの内容を設定して表示を変更
			this.mdBaseView.options.opeTypeId = opeTypeId;
			this.mdBaseView.renderFooterNavi();

			return r_flag;
		},

		/**
		 * 添付ファイル削除押下
		 */
		_onDelFileClick: function(){
			$("#ca_label").html("");
			$("#ca_attachedFileID").val("");
			this.attachedFileURL = "";
		},

		/**
		 * 添付ファイルダウンロード
		 */
		_onFileDLClick: function(){

			//添付ファイルがあればダウンロード
			if(!_.isEmpty(this.attachedFileURL) && this.attachedFileURL != ""){
				var uri = this.attachedFileURL;
				var newWindow = false;
				clutil.download({url: uri, newWindow: newWindow});
			}
		},

		/**
		 * 行削除処理
		 */
		_onDeleteLineClick : function(e) {
			var ope_mode = this.options.opeTypeId;
			if (ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
				ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL ||
				ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			$(e.target).parent().parent().remove();
		},

		/**
		 * 行追加処理(tfoot)
		 */
		_onAddLineClick : function(e) {
			var ope_mode = this.options.opeTypeId;
			if (ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
				ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL ||
				ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = $("#ca_tbody_template");
			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
			$tmpl.tmpl(addObj).appendTo($tbody);
			clutil.initUIelement(this.$el);

			return this;
		},


		/**
		 * テーブルクリア
		 */
		clearTable : function() {
			$("#ca_table_tbody tr").remove();
		},

		/**
		 * 新規作成時にデフォルト空欄表示
		 */
		makeDefaultTable: function(){
			for(var i=0; i<5; i++){
				//5行分
				this._onAddLineClick();
			}
		},

		/**
		 * 明細リスト表示
		 */
		tableSetRecs: function(data){
			this.clearTable();
			var getRsp = data;
			var $tbody = this.$("#ca_table_tbody");
			$tmpl = this.$("#ca_tbody_template");

			// 明細リスト作成
			$.each(getRsp.retItemList, function(){
				$tmpl.tmpl(this).appendTo($tbody);
				var $tr = $tbody.find("tr:last");
				var $sel_color = $tr.find("select[name='colorID']");
				var data = this;
				var colorSelector = clutil.clcolorselector({
					emptyLabel: "すべて",

					el: $sel_color,
					dependAttrs: {
						// 期間開始日
						srchFromDate: function(){
							return clcom.getOpeDate();
						},
						// 期間終了日
						srchToDate: function(){
							return 0;
						},
						// 商品ID
						itemID: function(){
							// XXX:itemIDを返す様変更 gotan
							return data.itemID;
						}
					}
				});
				if (this.colorID){
					colorSelector.setValue(this.colorID);
				}
			});
			clutil.initUIelement(this.$el);

			return this;
		},



		/**
		 * 差し戻し理由テーブル描画
		 * @param list
		 */
		makeRejectTable: function(list) {
			//テーブル初期化
			var $tbody = $("#ca_table_reject_tbody");
			$tbody.empty();

			if(list.length == 0){
				$("#ca_table_reject").hide();
				$("#ca_reject").val("");
			}
			else{
				$("#ca_table_reject").show();
				for(var i=0; i<list.length; i++){
					var $tbody = $("#ca_table_reject_tbody");
					var $tmpl = $("#ca_reject_tbody_template");
					$tmpl.tmpl({}).appendTo($tbody);

					// 追加した行定義
					var $tr = $tbody.find('tr:last');

					$tr.find(".ca_rejectNum").html(i+1);			//理由番号
					$tr.find(".ca_reject").html(list[i].reject);	//理由
				}
				clutil.initUIelement($('#ca_table_reject'));
			}
		},

		/**
		 * メーカーコード変更イベント
		 */
		_onmakerCodeChanged: function(e) {
			var head = clutil.view2data(this.$('#ca_srchArea'));
			// makerCode 検索する。検索結果は、_onCLmakerCode_srchCompleted() 関数で設定。
			var makerCodeSrchReq = {
				maker_code: $(e.target).val(),
				maker_id: head.vendor,	// ここにmaker_idを設定してください。
				itgrp_id: head.stditgrp // ここにitgrp_idを設定してください
			};
			// clmakeritemcodeはmakeritemcodeのオートコンプリートです。
			// 品番でサーバへの問いあわせを行うには代わりに
			// clmakeritemcode2item()を使ってください。
			clutil.clmakeritemcode2item(makerCodeSrchReq, e)
				.done(this._onCLmakerCode_srchCompleted)
				.fail(function(){
					// エラーが発生した場合はここに落ちます。
					this.validator.setErrorMsg($tgt, clmsg.EGM0026);

					var $tr = $(e.target).closest('tr');
					// makerCode が見つからない ⇒ クリアする
					// 商品名
					$tr.find('#ca_productName').val('');
					// サブクラス１
					$tr.find('#ca_subClass1DispName').val('');
					// サブクラス２
					$tr.find('#ca_subClass2DispName').val('');
					// カラー
					$tr.find("#ca_colorID").val(0).attr("disabled",true);
				});
		},
		// メーカーコード入力時に関連情報表示
		_onCLmakerCode_srchCompleted: function(result, e){
			//セレクター用オブジェクト
			var obj = {
					tgt : $(e.target),
					colorID : colorID
			};
			var colorID = obj.colorID;
			var $tr = $(e.target).closest('tr');
			//セレクター // XXX:行中selectを取る様変更 gotan
			var $sel_color = $tr.find("select[name='colorID']");
			var list = [];

			// makerCode が見つかった ⇒ 値を表示
			var item = result.rec;
			if (!item.itemID){
				this.validator.setErrorMsg($(e.target), clmsg.EGM0026);
			}
			// 商品ID
			$tr.find('#ca_itemID').val(item.itemID);
			// 商品名
			$tr.find('#ca_productName').val(item.itemName);
			// サブクラス１
			$tr.find('#ca_subClass1DispName').val(item.sub1Name);
			// サブクラス２
			$tr.find('#ca_subClass2DispName').val(item.sub2Name);
			//カラーセレクター
			$sel_color.attr("disabled", false);
			clutil.initUIelement($sel_color);
			colorSelector = clutil.clcolorselector({
				emptyLabel: "すべて",

				el: $sel_color,
				dependAttrs: {
					// 期間開始日
					srchFromDate: function(){
						return clcom.getOpeDate();
					},
					// 期間終了日
					srchToDate: function(){
						return 0;
					},
					// 商品ID
					itemID: function(){
						// XXX:itemIDを返す様変更 gotan
						return Number($tr.find('#ca_itemID').val());
					}
				}
			});
			// XXX:品番から商品を取れなかった場合、カラーセレクタが残ってしまいます。 gotan

			clutil.viewRemoveReadonly($tr.find(".ca_colorIDArea"));

			if(colorID != null){
				colorSelector.setValue(colorID);
			}
			$tr.find('#ca_colorCode').val(list.colorCode);
			$tr.find('#ca_colorName').val(list.colorName);
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			//「戻る」押下時の確認ダイアログを出さない
			this.f_force_confirm = false;
			switch(args.status){
			case 'DONE':        // 確定済
				// TODO: args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				this.$(".btn-delete").hide();
				this.$("tfoot tr.addRow").hide();
				clutil.viewReadonly($("#ca_rejectArea"));
				break;
			case 'CONFLICT':    // 別のユーザによって DB が更新された
				// TODO: args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				this.$(".btn-delete").hide();
				this.$("tfoot tr.addRow").hide();
				clutil.viewReadonly($("#ca_rejectArea"));
				break;
			case 'DELETED':        // 別のユーザによって削除された
				// TODO: args.data が null なら空欄表示化する。args.data に何かネタがあれば画面個別Viewへセットする。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				this.$(".btn-delete").hide();
				this.$("tfoot tr.addRow").hide();
				clutil.viewReadonly($("#ca_rejectArea"));
				break;
			default:
			case 'NG':            // その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// TODO: 入力値エラー情報が入っていれば、個別 View へセットする。
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoToTable({
					$table: this.$('#ca_table'),
					fieldMessages: data.rspHead.fieldMessages,
					struct_name: 'retItemList',
					options: {
						by: 'name'
					}
				});
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			var getRsp, line;
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			clutil.viewRemoveReadonly(this.$el);
			this.$("tfoot tr.addRow").show();
			this.$('#ca_retCode').attr("readonly", true);
			var data = args.data;

			//承認状態ID
			var stateID = data.AMDLV0120GetRsp.ret.stateID;

			//差し戻し理由リスト
			this.rejectList = data.AMDLV0120GetRsp.ret.rejectList;

			//日付警告リセット
			this.validator.clearErrorMsg($("#ca_releaseDate"));
			this.validator.clearErrorMsg($("#ca_limitDate"));

			if(this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				//編集(承認)時のみ

				if(stateID == amcm_type.AMCM_VAL_APPROVE_APPLY
						|| stateID == amcm_type.AMCM_VAL_APPROVE_APPROVE1){
					//[申請][一時承認済]のステータスで、
					//[店舗出力日][対応期限][アラーム表示期限]が切れている場合は日付を修正
					var today = clcom.getOpeDate();
					var releaseDate = today;
					var limitDate = today;

					var serchData = data.AMDLV0120GetRsp.ret;

					//TODO:デートピッカーの日付(文字列)と、サーバー日付(数値)の比較方法検討
					if(today > serchData.releaseDate){
						//店舗出力日が過ぎていたら
//						this.releaseDatePicker.datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
//						releaseDate = $('#ca_releaseDate').val();
//						//日付を文字から数値型へ変換
//						releaseDate = clutil.dateFormat(releaseDate, 'yyyymmdd');
//
//						//ペインに反映
//						serchData.releaseDate = releaseDate;
//						this.validator.setErrorMsg($("#ca_releaseDate"), clmsg.WMD0002, 'alert');
//						if(releaseDate >= serchData.limitDate){
//							//店舗出力日 >= 対応期限となってしまったら
//							this.limitDatePicker.datepicker('setIymd', clutil.addDate(releaseDate, 3));
//							limitDate = $('#ca_limitDate').val();
//							limitDate = clutil.dateFormat(limitDate, 'yyyymmdd');
//							serchData.limitDate = limitDate;
//							this.validator.setErrorMsg($("#ca_limitDate"), clmsg.WMD0002, 'alert');
//						}
//
//						clutil.mediator.trigger('onTicker', clutil.getclmsg('WMD0002'));
					}
				}
			}


			//承認状態によってフッタボタンを再描画
			//返り値によってリードオンリーかどうか判定
			var r_flag = this.chkState(data.AMDLV0120GetRsp.ret);
			this.makeRejectTable(this.rejectList);		//差し戻しテーブル部作成

			switch(args.status){
			case 'OK':
				// TODO: args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				getRsp = args.data.AMDLV0120GetRsp;
				this.data2view(getRsp);
				this.wait().always(function(){
					//添付ファイル作成
					if(getRsp.ret.attachedFileName){
						line = '<a id="ca_attachedFileName" class="cl_filedownld" target="_blank">' + getRsp.ret.attachedFileName + '</a>';
						$("#ca_label").html(line);
						this.attachedFileURL = getRsp.ret.attachedFileURL;
					}

					// 内容物がある場合 --> 結果表示する。
					this.tableSetRecs(getRsp);
					if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL ||
					   this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
						clutil.viewReadonly(this.$el);
						this.$(".btn-delete").hide();
						this.$("tfoot tr.addRow").hide();
					}

					if(r_flag == true){
						//承認状態によるフラグがあればリードオンリーに
						clutil.viewReadonly(this.$el);
						this.$(".btn-delete").hide();
						this.$("tfoot tr.addRow").hide();
						clutil.inputRemoveReadonly($('#ca_sample_download'));
					}
					else{
						//編集遷移時の事業ユニットセレクター編集可不可
						var unit = clcom.getUserData().unit_id;
						if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
								|| unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
							clutil.viewReadonly($("#ca_srchUnitIDArea"));
							clutil.setFocus($('#ca_stditgrp'));

						}
					}

					//差し戻し理由の編集可能判定
					if(this.rej_flag == false){
						clutil.viewRemoveReadonly($("#ca_rejectArea"));
					}
					else{
						clutil.viewReadonly($("#ca_rejectArea"));
					}
					this.f_confirm = true;

					switch (this.options.opeTypeId) {
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
						clutil.viewReadonly(this.$el);
						clutil.inputRemoveReadonly($('#ca_sample_download'));
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
						clutil.viewReadonly(this.$el);
						break;
					}
				});
				break;
			case 'DONE':        // 確定済
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				getRsp = data.AMDLV0120GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp);
				this.wait().always(function(){
					//添付ファイル作成
					if(getRsp.ret.attachedFileName){
						line = '<a id="ca_attachedFileName" class="cl_filedownld" target="_blank">' + getRsp.ret.attachedFileName + '</a>';
						$("#ca_label").html(line);
						//					$("#ca_attachedFileID").val(getRsp.ret.attachedFileID);
						this.attachedFileURL = getRsp.ret.attachedFileURL;
					}
					// 内容物がある場合 --> 結果表示する。
					this.tableSetRecs(getRsp);
					clutil.viewReadonly(this.$el);
					this.$(".btn-delete").hide();
					this.$("tfoot tr.addRow").hide();
				});
				clutil.viewReadonly($("#ca_rejectArea"));
				//フッタを「一覧に戻る」とする
				this.backFooter();
				break;
			case 'DELETED':        // 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？                        【確認】
				// 全 <input> は readonly 化するなどの処理。
				getRsp = data.AMDLV0120GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp);
				this.wait().always(function(){
					clutil.viewReadonly(this.$el);
					this.$(".btn-delete").hide();
					this.$("tfoot tr.addRow").hide();
				});
				clutil.viewReadonly($("#ca_rejectArea"));
				//フッタを「一覧に戻る」とする
				this.backFooter();
				break;
			case 'CONFLICT':    // ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				getRsp = data.AMDLV0120GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp);
				this.wait().always(function(){
					clutil.viewReadonly(this.$el);
					this.$(".btn-delete").hide();
					this.$("tfoot tr.addRow").hide();
				});
				clutil.viewReadonly($("#ca_rejectArea"));
				//フッタを「一覧に戻る」とする
				this.backFooter();
				break;
			default:
			case 'NG':            // その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL ||
				   this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
				   this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
					// 照会モードは、Edit ブロッキングしておく。
					clutil.viewReadonly(this.$el);
					this.$(".btn-delete").hide();
					this.$("tfoot tr.addRow").hide();
				} else if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					clutil.viewReadonly(this.$(".ca_upd_dis"));
				}
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				clutil.viewReadonly($("#ca_rejectArea"));
				//フッタを「一覧に戻る」とする
				this.backFooter();
				break;
			}
		},

		/**
		 * フッタを「一覧へ戻る」へ書き換える
		 */
		backFooter:function(){
			opeTypeId = -1;

			// ボタンの内容を設定して表示を変更
			this.mdBaseView.options.opeTypeId = opeTypeId;
			this.mdBaseView.renderFooterNavi();
		},

		data2view: function(data){
			var rec = data.ret;
			rec.srchUnitID = rec.unitID;
			clutil.data2view(this.$('#ca_srchArea'), rec);
		},

		/**
		 * ダウンロード条件をつくる
		 */
		buildReq: function(){
			var reqHead = {
				opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV,
			};
			var head = clutil.view2data(this.$('#ca_srchArea'));
			head.unitID = head.srchUnitID;
			head.stditgrp = head._view2data_stditgrp_cn;
			head.vendor = head._view2data_vendor_cn;
			head.center = head._view2data_center_cn;
			head.attachedFileName = $("#ca_attachedFileName").text();
			head.attachedFilePath = $("#ca_attachedFilePath").text();
			var list = clutil.tableview2data(this.$('#ca_table_tbody').children());

			// 空白行は無視したリストを作成
			var dtlList = [];
			for(var i=0; i<list.length; i++){
				if(list[i].itemID != ""){
					dtlList.push(list[i]);
				}
			}

			AMDLV0120UpdReq = {
				ret: head,
//				retItemList : list
				retItemList : dtlList
			};
			// リクエストデータ本体
			var request = {
				reqHead : reqHead,
				AMDLV0120UpdReq  : AMDLV0120UpdReq
			};
			return request;
		},

		/**
		 * ダウンロードする
		 */
		_onCSVClick: function(){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMDLV0120', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * サンプルファイルダウンロード
		 */
		_onSampleDLClick: function() {
			clutil.download(this.sampleURL);
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				// TODO: アプリ個別の render をする。
				this.clearTable();
				//デフォルト5行分のテーブル作成
				this.makeDefaultTable();
			} else {
				// 一覧画面からの引継データ pageArgs があれば渡す。
				$('#ca_retID').val(this.options.chkData[0].returnID);

				this.mdBaseView.fetch();    // データを GET してくる。
			}
			return this;
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.setFocus($('#ca_stditgrp'));
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			var _this = this;

			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			// エラークリア
			this.validator.clear($("#ca_table").find('.cl_error_field'));


			/*
			 * 無効化チェック
			 */
			if ($("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}
			/*
			 * 入力値チェック 削除時はチェックしない
			 */
			if (this.options.ope_mode !== am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				//
				var sendSel = $("#ca_retAddrTypeID").val();
				if(sendSel != 4){
					$("#ca_center").removeClass("cl_required");
				}

				// validation
				var f_error = false;
				this.validator.clear();
				if(!this.validator.valid()) {
					f_error = true;
				}
				// 店舗出力日、返品期限チェック
				var opDate = clutil.dateFormat(clutil.addDate(clcom.getOpeDate(), 1),"yyyy/mm/dd");
				var $rDate = this.$('#ca_releaseDate');
				var $lDate = this.$('#ca_limitDate');
				var rdval = this.$('#ca_releaseDate').val();
				var ldval = this.$('#ca_limitDate').val();
				if (opeTypeId != OpeType.AMDLV0120_OPETYPE_RETURN){
					if(rdval < opDate){
						//「運用日翌日以降の日付を指定してください。」
						this.validator.setErrorMsg($rDate, clmsg.EGM0047);
						f_error = true;
					} else if(rdval > ldval){
						//「返品期限は、店舗出力日以降を設定します」
						this.validator.setErrorMsg($lDate, clmsg.EDL0017);
						f_error = true;
					}
				}
				if(f_error){
	                this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
					return null;
				}
			}

			//差し戻しが押された場合
			if(opeTypeId == OpeType.AMDLV0120_OPETYPE_RETURN){
				var reject = $("#ca_reject").val();

				if(reject.length == 0){
					//差し戻し理由の記入がなければエラー
					clutil.mediator.trigger('onTicker', clmsg.EMS0037);
					this.validator.setErrorMsg($("#ca_reject"), clmsg.cl_required);
					return;
				}
				else if(reject.length > 100){
					//文字数超過エラー
					clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
					this.validator.setErrorMsg($("#ca_reject"), clutil.fmtargs(clmsg.cl_maxlen, ["100"]));
					return;
				}
				else{
					//理由があれば配列に詰めてリクエストへ追加
					var len = this.rejectList.length;
					var sendData = {
							reject: reject
					};
					this.rejectList[len] = sendData;
				}
			}
			//エラーリセット
			_this.validator.clearErrorMsg($('#ca_reject'));


			var reqHead = {
					//opeTypeId : this.options.opeTypeId,
					opeTypeId : this.opeTypeId,
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				//複製の場合は新規作成扱いで登録
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var head = clutil.view2data(this.$('#ca_srchArea'));
			head.unitID = head.srchUnitID;
			head.stditgrp = head._view2data_stditgrp_cn;
			head.vendor = head._view2data_vendor_cn;
			head.center = head._view2data_center_cn;
//			head.attachedFileName = $("#ca_attachedFileName").text();
//			head.attachedFilePath = $("#ca_attachedFilePath").text();
			head.state = Number(head.state);
			head.attachedFileID = Number(head.attachedFileID);
//			head.comment = $("#ca_comment").val();
//			delete head.opeTypeID;
//			delete head.store;
			head.rejectList = this.rejectList;
			var list = clutil.tableview2data(this.$('#ca_table_tbody').children());


			//承認状態設定(押下されたボタンの種類にリクエストを更新)
			if(this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				//削除時は一時保存のステータスを渡す
				head.stateID = OpeType.AMMDV0020_OPETYPE_SAVE;
			}
			else{
				head.stateID = opeTypeId;
			}

			head.stateID = head.stateID - OpeType.AMDLV0120_OPETYPE_NUM;

			// 空白行は無視したリストを作成
			var dtlList = [];
			var errorlList = [];
			var flag = true;
			for(var i=0; i<list.length; i++){
				if(list[i].itemID != ""
					&& list[i].itemID != "0"){
					dtlList.push(list[i]);
				}
				else if(list[i].itemID == "0"){
					errorlList.push(list[i]);
					flag = false;
				}
			}

			if(dtlList.length == 0){
				//リストが空ならエラー
				clutil.mediator.trigger('onTicker', clutil.fmtargs(clmsg.EMS0007, ["1"]));
				//clutil.mediator.trigger('onTicker', clutil.fmtargs(clmsg.EGM0023, ["返品対象の商品"]));
				return null;
			}
			if(flag == false){
				//ヘッダエラー表示
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return null;
			}


			AMDLV0120UpdReq = {
				ret: head,
//				retItemList : list
				retItemList : dtlList
			};

			var reqObj = {
					reqHead : reqHead,
//					AMDLV0120UpdReq  : updReq
					AMDLV0120UpdReq  : AMDLV0120UpdReq
			};

			// データを登録する
//			clutil.postJSON(this.uri, reqObj, _.bind(function(data, dataType) {
//			}, this));

			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		/**
		 * ユニット変更処理
		 */
		_onUnitChange: function(e) {
			this.clearTable();
			this.$("#ca_retCode").val("");
			// 発送方法	#ca_payTypeID
			clutil.cltypeselector(this.$("#ca_payTypeID"), amcm_type.AMCM_TYPE_SHIP_PAYMENT, 1);
			// datepicker
			// 店舗出力日
			clutil.datepicker(this.$('#ca_releaseDate')).datepicker("setIymd");
			// 返品期限
			clutil.datepicker(this.$('#ca_limitDate')).datepicker("setIymd");
			this.$('#ca_reason').val("");
			this.$('#ca_comment').val("");
			this.$('#ca_makerStaffName').val("");
			this._onDelFileClick();

			this.makeDefaultTable();
		},

		/**
		 * 取引先変更イベント
		 */
		_onVendorChanged: function(e) {
			this.clearTable();
			this.makeDefaultTable();
		},

		/**
		 * 店舗参照ボタン押下処理
		 */
		_onStoreSelClick: function(e) {
			var _this = this;
			var options = {
				org_kind_set: [
					am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER
				],
			    f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ)
			};

			_this.AMPAV0010Selector.show(null, null, options);
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			//console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			if (_.isEmpty(pgIndex)){
				if(clcom.srcId == "AMMDV0060" || clcom.srcId == "AMMDV0070"){
					$('#ca_retID').val(this.options.chkData[pgIndex].id);
				}
				else{
					$('#ca_retID').val(this.options.chkData[pgIndex].returnID);
				}
			}
			var head = clutil.view2data(this.$('#ca_srchArea'));
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},
				// 明細検索リクエスト
				AMDLV0120GetReq: {
					returnID : head.retID
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMDLV0120UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,    //'AMDLV0120',
				data: getReq
			};
		},

		// 空更新チェックデータをつくる
		_buildSubmitCheckDataFunction: function(arg){
//			rg: {
//				index: toIndex,                // 複数レコード選択編集時におけるインデックス番号
//				resId: req.resId,            // リソースId -- "XXXXV0010" など
//				data: clutil.dclone(data)    // GETの応答データ（共通ヘッダも含む）
//			};

			var appRec = arg.data.AMDLV0120GetRsp;
			// TODO: 空更新チェック対象外のフィールドを削っていく。

			return appRec;
		},

		_eof: 'AMDLV0120.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView(clcom.pageArgs);
		mainView.fieldRelation.done(function(){
			mainView.initUIElement().render();
		});
		mainView.setFocus();
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
