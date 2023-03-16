useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var emptyRec = {
			storeID: null
		};
	/* 追加リードタイム対応 2015/10/28 */
	var addLeadTime = [];

	var getSysparam = function(paramName, defaultVal){
		var val = clcom.getSysparam(paramName);
		return (defaultVal === undefined) ? val : parseInt(_.isEmpty(val) ? defaultVal : val);
	};

	// テーブルのヘッダ
	var columns = [
	               {
	            	   id: 'storeID',
	            	   name: '店舗',
	            	   field: 'storeID',
	            	   width: 240,
	            	   cellType: {
	            	   		type: 'clajaxac',
	            	   		editorOptions: {
	            	   			funcName: 'orgcode',
	            	   			dependAttrs: function(item){
									var unit_id = $('#ca_unitID').val();
	            	   				return {
										p_org_id : unit_id,
	            						orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
	            						orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
	            	   				};
	               				}
	               			},
	               			validator: 'required'
	               		}
	               },
	               /* 追加リードタイム対応 2015/10/28 */
	               {
	            	   id: 'addLT',
	            	   name: '追加リードタイム',
	            	   field: 'addLT',
	            	   width: 130,
	            	   cssClass: 'txtalign-right',		// 右寄せ
	            	   cellType: {
	            		   type: "text",
	            		   editorOptions: {
	            		   },
	            		   validator: ["required", "digit",'maxlen:2']
	            	   }
	               }
	];

	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			'change #ca_unitID' 			: '_unitChange',
			"click #ca_btn_store"			: "_onStoreSelClick",			// 店舗選択補助画面起動
			"click .cl_download" : "_onCSVClick",							//CSV出力押下

			"click #ca_sample_download"		: "_onSampleDLClick"		// ExcelサンプルDLボタン押下
		},

		sampleURL: "/public/sample/店舗グループサンプル.xlsx",

		/**
		 * opt : clcom.pageArgs
		 */
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
						title: '店舗グループ',
						opeTypeId: o.opeTypeId,
						pageCount: o.chkData.length,
						btn_csv: ((o.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL)
								&& (o.chkData[0].delFlag >0))?false:	true,
//						btn_csv: true,
						// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
						// リクエストビルダ関数を渡しておく。
						buildSubmitReqFunction: this._buildSubmitReqFunction,
						// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
						// リクエストのビルダ関数を opt で渡しておく。
						buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
						? this._buildGetReqFunction : undefined,
						buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// データグリッドの表示
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ。
			});

			var dataGrid = this.dataGrid;

			this.graph = new clutil.Relation.DependGraph()
			.add({
				id: "storeID"
			})
			.on('all', function(name){
				console.log('graph ev:', name);
			});


			this.listenTo(this.dataGrid, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {};
					gridView.addNewItem(newItem);
				}
			});

			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1
				},
				columns: columns,
				data: [
					    clutil.dclone(emptyRec),
					],
				rowDelToggle: false,
				graph: this.graph
			});

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
				// それ以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});
			this.validator1 = clutil.validator($("#ca_base_form"), {
				echoback : $('.cl_echoback')
			});
//			this.validator2 = clutil.validator($("#ca_table_tbody"), {
//				echoback : $('.cl_echoback')
//			});

			return this;
		},

		initUIelement : function(){
			var _this = this;
			this.mdBaseView.initUIElement();
			// 初期データ取得後に呼ばれる関数

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'));

			// ＰＯ種別
			clutil.cltypeselector(this.$("#ca_poTypeID"), amcm_type.AMCM_TYPE_PO_CLASS);

			//サブ画面配置
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_multiple_select,		//
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector.render();

			// Fieldlimit
			clutil.cltxtFieldLimit($("#ca_code"));
			clutil.cltxtFieldLimit($("#ca_name"));
			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {};
					request.AMPOV0150UpdReq = {};
					request.AMPOV0150UpdReq.stgrp = clutil.view2data(this.$("#ca_base_form"));
					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMPOV0150',
						data: request
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(function(){
						var _flag = true;

						if(!this.validator1.valid()){
							_flag = false;
						}
						if(_flag == false){
							clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
						}

						return _flag;
					}, this)


				}
			});
			// 取込処理成功
			this.opeCSVInputCtrl.on('done', function(data){
				if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					//成功時処理
					//テーブルクリア
					_this.clearTable();
					//テーブル追加
					var getRsp = data.AMPOV0150GetRsp;
					_this._allData2View(getRsp);


				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
					_this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
					if (data.rspHead.uri){
						//エラーCSVのダウンロード実行
						clutil.download(data.rspHead.uri);
					}
				}
			});

			// 取込処理失敗
			this.opeCSVInputCtrl.on('fail', function(data){
//			clutil.mediator.trigger('onTicker', data);
				// ヘッダーにメッセージを表示
				_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				_this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				if (data.rspHead.uri){
					//エラーCSVのダウンロード実行
					clutil.download(data.rspHead.uri);
				}
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで

			return this;
		},

		//ユニット切り替え時店舗削除
		_unitChange: function(e) {
			//テーブル削除
			this.clearTable();
			if (this.$("#ca_unitID").val() == null ||  this.$("#ca_unitID").val() <= 0 ){
				this.setTableReadOnly(true);
			}else{
				this.setTableReadOnly(false);
			}
		},

		render : function(){
			this.$("#ca_unitID").val(clcom.userInfo.unit_id);
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS){
				//情シスの場合ユニットが固定されないのでテーブル周りは触れないようにしておく
				this.setTableReadOnly(true);
			}
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				// テーブル設定
				//初期フォーカス
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.setFocus(this.$('#ca_poTypeID'));
				}
				else{
					clutil.setFocus(this.$('#ca_unitID'));
				}
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}
			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var _this = this;
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				document.location = '#';
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					// 更新した日付をchkdataに反映
//					this.options.chkData[args.index].fromDate = args.data.AMPOV0150GetRsp.orgfunc.fromDate;
				}
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setTableReadOnly(true);
//				this._tableDisable();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setTableReadOnly(true);
//				this._tableDisable();
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setTableReadOnly(true);
//				this._tableDisable();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 強制更新だろうとなかろうと問題個所は表示する。
				var cellMessages = [];
				var list = this.dataGrid.getData({});
				var error = data.rspHead.fieldMessages;
				for (var i = 0; i < error.length; i++){
					if(error[i].struct_name == "storeList"){
					var line = error[i].lineno-1;
					var rowDto = list[line];
					var rowId = rowDto[this.dataGrid.dataView.idProperty];
						cellMessages.push({
							rowId: rowId,
							colId: 'storeID',
							level: 'error',
							message: clutil.fmtargs(clutil.getclmsg(error[i].message), error[i].args)
						});
					}
				}
				if(!_.isEmpty(cellMessages)){
					this.dataGrid.setCellMessage(cellMessages);
				}
				if(args.data.rspHead.message == "WPO0038"){
					var head = clutil.view2data(this.$('#ca_base_form'));
					var list = this.dataGrid.getData({});
					var storeList = new Array;


					for (var i = 0; i <  list.length; i++ ){
						if(_.isEmpty(list[i].storeID) || list[i].storeID.id <= 0) {
							;
						}else{
							var obj = {
									storeID		: list[i].storeID.id,
									storeName	: list[i].storeID.name,
									storeCode	: list[i].storeID.code,
									addLT		: list[i].addLT,
							};
							storeList.push(obj);
						}
					};

					// TODO: 画面入力値をかき集めて、Rec を構築する。
					var updReq = {
							// 共通ヘッダ
							reqHead: {
								opeTypeId: _this.re_opeTypeId,
								recno:		head.recno,
								state:		head.state,
							},
							// 共通ページヘッダ		・・・これ、必要なの？					【確認】
							reqPage: {
							},
							// 取引先マスタ検索リクエスト -- 更新なので、空を設定
							AMPOV0150GetReq: {
							},
							// 取引先マスタ更新リクエスト
							AMPOV0150UpdReq: {
								stgrp : head,
								storeList : storeList
							}
					};

					var send = {
							resId: clcom.pageId,
							data: updReq,
							confirm: clmsg.WPO0038
					};
					this.mdBaseView.forceSubmit(send);
				} else{
//					});
					// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
						prefix: 'ca_'
					});
					// ヘッダーにメッセージを表示
//					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
					break;
				}

			}

		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			this.setHeadReadOnly(false);
			this.setTableReadOnly(false);
			switch(args.status){
			case 'OK':
				var getRsp = data.AMPOV0150GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.stgrp);
				this.viewSeed = getRsp.stgrp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);


				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					this.setHeadReadOnly(true);
					this.setTableReadOnly(true);
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					//clutil.viewReadonly(this.$(".ca_fromDate_div"));
					this.setHeadReadOnly(true);
					this.setTableReadOnly(true);
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:		// 複製
					clutil.viewReadonly(this.$(".ca_unitID_div"));
					clutil.setFocus($('#ca_poTypeID'));
					break;


				default:
					//新規はここには来ないはず
					clutil.viewReadonly(this.$(".ca_unitID_div"));
				clutil.viewReadonly(this.$(".ca_poTypeID_div"));
				clutil.inputReadonly($("#ca_code"));
				clutil.setFocus($('#ca_name'));
				break;
				}

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
//				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.cl_sys_db_other)});
				var getRsp = data.AMPOV0150GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.stgrp);
				this.viewSeed = getRsp.stgrp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				this.setTableReadOnly(true);
				this.setHeadReadOnly(true);
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMPOV0150GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.stgrp);
				this.viewSeed = getRsp.stgrp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				this.setTableReadOnly(true);
				this.setHeadReadOnly(true);
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMPOV0150GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.stgrp);
				this.viewSeed = getRsp.stgrp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				this.setTableReadOnly(true);
				this.setHeadReadOnly(true);
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setHeadReadOnly(true);
				this.setTableReadOnly(true);
//				this._tableDisable();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		setHeadReadOnly: function(readOnly){
			if (readOnly == true){
				clutil.viewReadonly(this.$(".ca_base_form"));
				clutil.viewReadonly(this.$(".ca_table_form"));
				clutil.viewReadonly(this.$(".ca_unitID_div"));
				clutil.viewReadonly(this.$(".ca_poTypeID_div"));
				clutil.inputReadonly($("#ca_code"));
				clutil.inputReadonly($("#ca_name"));
			}else{
				clutil.viewRemoveReadonly(this.$(".ca_base_form"));
				clutil.viewRemoveReadonly(this.$(".ca_table_form"));
				clutil.viewRemoveReadonly(this.$(".ca_unitID_div"));
				clutil.viewRemoveReadonly(this.$(".ca_poTypeID_div"));
				clutil.inputRemoveReadonly($("#ca_code"));
				clutil.inputRemoveReadonly($("#ca_name"));
			}
		},
		setTableReadOnly: function(readOnly){
			if (readOnly == true){

				this.dataGrid.setEnable(false);

				var $csv_btn_div = this.$("#ca_csvinput1");
				$csv_btn_div.find('a').removeAttr('disabled');
				$csv_btn_div.find('a').removeAttr('Enable');
				$csv_btn_div.find('a').attr('disabled', true);
				$csv_btn_div.find('a').attr('Enable', false);

				var $csv_btn_div3 = this.$("#ca_csvinput3");
				$csv_btn_div3.find('a').removeAttr('disabled');
				$csv_btn_div3.find('a').removeAttr('Enable');
				$csv_btn_div3.find('a').attr('disabled', true);
				$csv_btn_div3.find('a').attr('Enable', false);

				var $csv_btn = this.$('#ca_csv_uptake');
				$csv_btn.removeAttr('disabled');
				$csv_btn.removeAttr('Enable');
				$csv_btn.attr('disabled', true);
				$csv_btn.attr('Enable', false);

				var $store_btn = this.$('#ca_btn_store');
				$store_btn.removeAttr('disabled');
				$store_btn.removeAttr('Enable');
				$store_btn.attr('disabled', true);
				$store_btn.attr('Enable', false);

				clutil.viewReadonly(this.$(".ca_csvinput1"));
				this.$(".ca_csvinput1").hide();
				clutil.viewReadonly(this.$(".ca_csvinput3"));
				this.$(".ca_csvinput3").hide();
			}else{
				this.dataGrid.setEnable(true);

				var $csv_btn_div = this.$("#ca_csvinput1");
				$csv_btn_div.find('a').removeAttr('disabled');
				$csv_btn_div.find('a').removeAttr('Enable');
				$csv_btn_div.find('a').attr('disabled', false);
				$csv_btn_div.find('a').attr('Enable', true);

				var $csv_btn_div3 = this.$("#ca_csvinput3");
				$csv_btn_div3.find('a').removeAttr('disabled');
				$csv_btn_div3.find('a').removeAttr('Enable');
				$csv_btn_div3.find('a').attr('disabled', false);
				$csv_btn_div3.find('a').attr('Enable', true);

				var $csv_btn = this.$('#ca_csv_uptake');
				$csv_btn.removeAttr('disabled');
				$csv_btn.removeAttr('Enable');
				$csv_btn.attr('disabled', false);
				$csv_btn.attr('Enable', true);

				var $store_btn = this.$('#ca_btn_store');
				$store_btn.removeAttr('disabled');
				$store_btn.removeAttr('Enable');
				$store_btn.attr('disabled', false);
				$store_btn.attr('Enable', true);

				clutil.viewReadonly(this.$(".ca_csvinput1"));
				this.$(".ca_csvinput1").show();
				clutil.viewReadonly(this.$(".ca_csvinput3"));
				this.$(".ca_csvinput3").show();
			}
		},

		/**
		 * dataを表示
		 */
		_allData2View : function(getRsp){
			var _this = this;

//			clutil.data2view(_this.$('#ca_headInfo'), schedule);

			var data = [];

			for(var i=0; i < getRsp.storeList.length; i++) {

				var storeID = {
						id : getRsp.storeList[i].storeID,
						code : getRsp.storeList[i].storeCode,
						name : getRsp.storeList[i].storeName
				};
				/* 追加リードタイム対応 2015/10/28 */
				data[i] = {
					storeID : storeID,
					addLT : getRsp.storeList[i].addLT,
				};
			};

			this.dataGrid.setData({
				rowDelToggle: false,
				data: data
			});
		},
		_setStoreList : function(storeList){
			var _this = this;
			var data = [];

			for(var i=0; i < storeList.length; i++) {
				/* 追加リードタイム対応 2015/10/28 */
				var addlt;
				if (addLeadTime[storeList[i].val] > 0){
					addlt = addLeadTime[storeList[i].val];
				} else {
					addlt = 0;
				}
				
				var storeID = {
						id : storeList[i].val,
						code : storeList[i].code,
						name : storeList[i].name
				};

				/* 追加リードタイム対応 2015/10/28 */
				data[i] = {
					storeID : storeID,
					addLT : addlt
				};
			};

			this.dataGrid.setData({
				rowDelToggle: false,
				data: data
			});
		},
		// テーブルのデータを店舗選択形式の配列にして返す。 リードタイムを一時保存する．//20151023 早川
		_getStoreList : function(){
			var storeItemList = this.dataGrid.getData({ delflag: false });
			var storeList  = new Array;
			chkMap = new Object();
			for(var i=0; i < storeItemList.length; i++) {
				if(storeItemList[i].storeID == null){
					//何もない、
					continue;
				}
				if(storeItemList[i].storeID.id <= 0){
					//不完全
					continue;
				}
				if(chkMap[storeItemList[i].storeID.id]){
					//重複データは送らない。
					continue;
				}
				chkMap[storeItemList[i].storeID.id] = true;
				var obj = {
						val		: storeItemList[i].storeID.id,
						name	: storeItemList[i].storeID.name,
						code	: storeItemList[i].storeID.code,
				};
				storeList.push(obj);
				addLeadTime[obj.val] = storeItemList[i].addLT; //追加リードタイム対応 2015/10/28 早川
			}
			storeList.sort(function(a, b) {
				return (Number(a.code) - Number(b.code));
			});
			return  storeList;
		},
		/*
		 * 店舗参照押下
		 */
		_onStoreSelClick: function(e) {
			var _this = this;
			var $UnitID = this.$("#ca_unitID");			//既存チェック復元用引数

			if ($UnitID.val() <= 0){
				_this.validator.setErrorMsg($UnitID, clmsg.EGM0001);
				return;
			}
			var initData = {
					func_id:	Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					org_id:		$UnitID.val()
			};

			//テーブルに表示されているデータを選択画面に渡す。
			var list = this._getStoreList();
			_this.AMPAV0010Selector.show(list, null, initData);
			// 選択サブ画面復帰処理
			_this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length != 0) {
					//テーブルをクリアし、結果を入れるソートの必要は？
					// ソート
					data.sort(function(a, b) {
						return (Number(a.code) - Number(b.code));
					});
					_this._setStoreList(data);
				}
				// ボタンにフォーカスする
				_.defer(function(){		//setFocusを_.defer()で後回しにする
					$(e.target).focus();
				});
			};
		},

		/**
		 * テーブルクリア
		 */
		clearTable : function() {
			this.dataGrid.setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1
				},
				rowDelToggle: false,
				data: [
					    clutil.dclone(emptyRec),
					]
			});
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			// editモードをかりとる
			this.dataGrid.stopEditing();

			this.validator.clear();

			//強制更新の際に必要
			this.re_opeTypeId = this.options.opeTypeId;

//			if(!this.validator.valid()) {
//				return null;
//			}

			var updReq = {};
			/*
			 * 入力値チェック 予約取消時はチェックしない
			 */
			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				// validation
				var f_error = false;
				var noStoreflag = true;
				this.validator.clear();

				if(!this.validator1.valid()) {
					f_error = true;
				}

				//グリッドエラーリセット
				this.dataGrid.clearAllCellMessage();
				var tailIsEmptyFunc = function(dto){
					// 行末空欄行を判定するための関数を指定。
					if(!_.isEmpty(dto.storeID) && !_.isEmpty(dto.storeID.name) && dto.storeID.name != ""){
						return false;
					}
					return true;	// 当該 dto は空であると判断。
				};

				if(!this.dataGrid.isValid({tailEmptyCheckFunc : tailIsEmptyFunc})){
					clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
					f_error = true;
				}

//				if (f_error) {
//					return null;
//				}
				var gridData = this.dataGrid.getData();
				var line_cnt;	//どこまで有効か確認用
				var _this = this;
				chkMap = new Object();
//				$tr.find('input[name="storeID"]');
				//まず対象店舗に有効なものがあるか確認
				line_cnt = 0;
				for (var i = 0; i <  gridData.length; i++ ){
					if(!_.isEmpty(gridData[i].storeID) && gridData[i].storeID.id > 0) {
						line_cnt = i;
						var key = gridData[i].storeID.code;
						if(chkMap[key]){
							//重複あり
							chkMap[key] += 1;
						}else{
							chkMap[key] = 1;
						}
						noStoreflag = false;
					}

				}
				if(noStoreflag){
					_this.validator.setErrorHeader(clmsg.EPO0043);
					return null;
				}
				var cellMessages = [];
//				//上記と同様のチェックを行い店舗コードエラーのチェック
				for (var i = 0; i <=  line_cnt; i++ ){
					var rowDto = gridData[i];
					var rowId = rowDto[this.dataGrid.dataView.idProperty];
					if(!_.isEmpty(rowDto.storeID) && rowDto.storeID.id > 0) {
						var key = rowDto.storeID.code;
						if(chkMap[key] > 1){
							// 重複あり
							// エラーメッセージを通知。
							cellMessages.push({
								rowId: rowId,
								colId: 'storeID',
								level: 'error',
								message: clutil.fmtargs(clmsg.EGM0009, ["店舗コード:"+key])
							});
							f_error = true;
						}
					}else{
						cellMessages.push({
							rowId: rowId,
							colId: 'storeID',
							level: 'error',
							message: clmsg.cl_autocomplete_mismatch
						});
						f_error = true;
					}
				}
				if(!_.isEmpty(cellMessages)){
					this.dataGrid.setCellMessage(cellMessages);
				}
				if(f_error){
					clutil.mediator.trigger('onTicker',clmsg.cl_echoback);
					return null;
				}

				var isBasic = this.$('input[name="ca_basicFlag"]:checked').val() == 1;
				var ope_date = clcom.getOpeDate();
				switch(this.options.opeTypeId){
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					break;
				default:
					break;
				}

				var head = clutil.view2data(this.$('#ca_base_form'));
				var storeList = new Array;


				// listへhead情報の適応
				if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
						|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				}
				for (var i = 0; i <=  line_cnt; i++ ){
					if(_.isEmpty(gridData[i].storeID) || gridData[i].storeID.id <= 0) {
						;
					}else{
						var obj = {
								storeID		: gridData[i].storeID.id,
								storeName	: gridData[i].storeID.name,
								storeCode	: gridData[i].storeID.code,
								addLT		: gridData[i].addLT // 追加リードタイム対応 2015/10/28 早川
						};
						storeList.push(obj);
					}
				};

				updReq = {
						stgrp : head,
						storeList : storeList
				};
			} else {
				if(!this.validator.valid()) {
					return null;
				}
				updReq = this.viewSeed;
			}
			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
				this.re_opeTypeId = reqHead.opeTypeId;
			}

			var reqObj = {
					reqHead : reqHead,
					AMPOV0150UpdReq  : updReq
			};
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var getReq = {
					// 共通ヘッダ

					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					// 取引先マスタ検索リクエスト
					AMPOV0150GetReq: {
						srchID: this.options.chkData[pgIndex].id,			// 取引先ID
						delFlag : this.options.chkData[pgIndex].delFlag
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMPOV0150UpdReq: {
					}
			};
			if(opeTypeId ==  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				getReq.reqHead.opeTypeId =  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY;
			}
			return {
				resId: clcom.pageId,	//'AMMSV0320',
				data: getReq
			};
		},

		/**
		 * サンプルファイルダウンロード
		 */
		_onSampleDLClick: function() {
			//this.doCSV(AMMPV0010Req.AMMPV0010_SAMPLE);
			//window.location = "/public/sample/品種別構成比登録サンプル.xlsx";
			clutil.download(this.sampleURL);
		},

		/**
		 * ダウンロード条件をつくる
		 */
		buildReq: function(){
			//指示ID
			var head = clutil.view2data(this.$('#ca_base_form'));
//			var list = clutil.tableview2data(this.$('#ca_table_tbody').children());
			var gridData = this.dataGrid.getData();
			var storeList = new Array;

			for (var i = 0; i <  gridData.length; i++ ){
				if(_.isEmpty(gridData[i].storeID) || gridData[i].storeID.id <= 0) {
					;
				}else{
					var obj = {
							storeID		: gridData[i].storeID.id,
							storeName	: gridData[i].storeID.name,
							storeCode	: gridData[i].storeID.code,
							addLT		: gridData[i].addLT //追加リードタイム対応 2015/10/28 早川
					};
					storeList.push(obj);
				}
			}
			// 検索条件
			var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					AMPOV0150GetReq: {
					},
					AMPOV0150UpdReq: {
						stgrp: head,
						storeList: storeList
					}
			};
			return req;
		},
		/**
		 * ダウンロードする
		 */
		_onCSVClick: function(){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
//				this.srchAreaCtrl.show_srch();
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMPOV0150', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},
		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
//			var rec = data.AMPOV0150GetRsp;
//			delete rec.orgfunc.fromDate;
//			delete rec.orgfunc.toDate;
//			$.each(rec.orglevelList, function(){
//			delete this.fromDate;
//			delete this.toDate;
//			delete this.orglevelCode;
//			});
			return data;
		}
	});

	// 初期データを取る
	clutil.getIniJSON(null, null).done(function(data, dataType) {
		ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
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
