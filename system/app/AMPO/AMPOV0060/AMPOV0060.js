useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	clutil.enterFocusMode($('body'));
	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"change #ca_poTypeID" 	: "_PoTypeChange",
			"change #ca_unitID" 	: "_unitChange"
		},

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
						title: 'ブランド',
						opeTypeId: o.opeTypeId,
						pageCount: o.chkData.length,
						// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
						// リクエストビルダ関数を渡しておく。
						buildSubmitReqFunction: this._buildSubmitReqFunction,
						// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
						// リクエストのビルダ関数を opt で渡しておく。
						buildGetReqFunction: this._buildGetReqFunction,
						buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
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

			/*
			 * データグリッド
			 */
			this.dataGrid1 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid1'
			});
			this.dataGrid2 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid2'
			});
			this.dataGrid3 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid3'
			});

			this.listenTo(this.dataGrid1,  'formatter:checkbox:change', function(args){
				console.log(args);
				//変更箇所の変更後の値
				var changed = args.item[args.cell==1?'select_col':(args.cell-1)];
				this.dataGrid1.stopEditing();
				var tableData = this.dataGrid1.getData();
				var tableColumns =	this.dataGrid1.getColumns();
				var row_count = 0;
				var col_count = 0;
				var all_chg = false;
				//行全体及び列全体変更(選択列は変更しない)
				if(args.cell==1 || args.row==1){
					if(args.cell==1 && args.row==1){
						all_chg = true;
						//全部
						for (row_count = 1; row_count < tableData.length; row_count++){
							for (col_count = 1; col_count <= this.column_length_1; col_count++){
								tableData[row_count][col_count] = changed;
							}
						}
					}else if(args.cell==1){
						//行
//						if(row_count != (args.row-1)){
//						continue;
//						}
						for (col_count = 1; col_count <= this.column_length_1; col_count++){
							tableData[args.row-1][col_count] = changed;
						}
					}else if(args.row==1){
						all_chg = true;
						//列
//						if(col_count != (args.cell-1)){
//						continue;
//						}
						for (row_count = 1; row_count < tableData.length; row_count++){
							tableData[row_count][args.cell-1] = changed;
						}
					}
//					for (row_count = 1; row_count < tableData.length; row_count++){
//						for (col_count = 1; col_count <= this.column_length_1; col_count++){
//							if(args.cell==1 && args.row==1){
//								//全部
//								tableData[row_count][col_count] = changed;
//							}else if(args.cell==1){
//								//行
//								if(row_count != (args.row-1)){
//									continue;
//								}
//								tableData[row_count][col_count] = changed;
//							}else if(args.row==1){
//								//列
//								if(col_count != (args.cell-1)){
//									continue;
//								}
//								tableData[row_count][col_count] = changed;
//							}
//
//						}
//					}
				}
				var allcheck =true;
				var rowcheck =true;
				var colcheck =true;
				for (row_count = 1; row_count < tableData.length; row_count++){
					rowcheck =true;
					for (col_count = 1; col_count <= this.column_length_1; col_count++){
						if(tableData[row_count][col_count] ==  null ||tableData[row_count][col_count] ==  false){
							allcheck = false;
							rowcheck = false;
						}
					}
					tableData[row_count]['select_col'] =  rowcheck;
				}
				for (col_count = 1; col_count <= this.column_length_1; col_count++){
					colcheck =true;
					for (row_count = 1; row_count < tableData.length; row_count++){
						if(tableData[row_count][col_count] ==  null ||tableData[row_count][col_count] ==  false){
							colcheck = false;
						}
					}
					tableData[0][col_count] =  colcheck;
				}
				tableData[0]['select_col'] =  allcheck;

//				this.dataGrid1.setData({columns: tableColumns, data: tableData});
//				this.dataGrid1.grid.resizeCanvas();
				if(all_chg){
					this.dataGrid1.grid.invalidate();
				}else{
					this.dataGrid1.grid.invalidateRows([1,args.row-1]);
					this.dataGrid1.grid.render();
				}
			});
			this.listenTo(this.dataGrid2,  'formatter:checkbox:change', function(args){
				console.log(args);
				//変更箇所の変更後の値
				var changed = args.item[args.cell==1?'select_col':(args.cell-1)];
				this.dataGrid2.stopEditing();
				var tableData = this.dataGrid2.getData();
				var tableColumns =	this.dataGrid2.getColumns();
				var row_count = 0;
				var col_count = 0;
				//行全体及び列全体変更(選択列は変更しない)
				if(args.cell==1 || args.row==1){
					for (row_count = 1; row_count < tableData.length; row_count++){
						for (col_count = 1; col_count <= this.column_length_2; col_count++){
							if(args.cell==1 && args.row==1){
								//全部
								tableData[row_count][col_count] = changed;
							}else if(args.cell==1){
								//行
								if(row_count != (args.row-1)){
									continue;
								}
								tableData[row_count][col_count] = changed;
							}else if(args.row==1){
								//列
								if(col_count != (args.cell-1)){
									continue;
								}
								tableData[row_count][col_count] = changed;
							}

						}
					}
				}
				var allcheck =true;
				var rowcheck =true;
				var colcheck =true;
				for (row_count = 1; row_count < tableData.length; row_count++){
					rowcheck =true;
					for (col_count = 1; col_count <= this.column_length_2; col_count++){
						if(tableData[row_count][col_count] ==  null ||tableData[row_count][col_count] ==  false){
							allcheck = false;
							rowcheck = false;
						}
					}
					tableData[row_count]['select_col'] =  rowcheck;
				}
				for (col_count = 1; col_count <= this.column_length_2; col_count++){
					colcheck =true;
					for (row_count = 1; row_count < tableData.length; row_count++){
						if(tableData[row_count][col_count] ==  null ||tableData[row_count][col_count] ==  false){
							colcheck = false;
						}
					}
					tableData[0][col_count] =  colcheck;
				}
				tableData[0]['select_col'] =  allcheck;
				this.dataGrid2.setData({columns: tableColumns, data: tableData});
				this.dataGrid2.grid.resizeCanvas();
			});
			this.listenTo(this.dataGrid3,  'formatter:checkbox:change', function(args){
				console.log(args);
				//変更箇所の変更後の値
				var changed = args.item[args.cell==1?'select_col':(args.cell-1)];
				this.dataGrid3.stopEditing();
				var tableData = this.dataGrid3.getData();
				var tableColumns =	this.dataGrid3.getColumns();
				var row_count = 0;
				var col_count = 0;
				//行全体及び列全体変更(選択列は変更しない)
				if(args.cell==1 || args.row==1){
					for (row_count = 1; row_count < tableData.length; row_count++){
						for (col_count = 1; col_count <= this.column_length_3; col_count++){
							if(args.cell==1 && args.row==1){
								//全部
								tableData[row_count][col_count] = changed;
							}else if(args.cell==1){
								//行
								if(row_count != (args.row-1)){
									continue;
								}
								tableData[row_count][col_count] = changed;
							}else if(args.row==1){
								//列
								if(col_count != (args.cell-1)){
									continue;
								}
								tableData[row_count][col_count] = changed;
							}

						}
					}
				}
				var allcheck =true;
				var rowcheck =true;
				var colcheck =true;
				for (row_count = 1; row_count < tableData.length; row_count++){
					rowcheck =true;
					for (col_count = 1; col_count <= this.column_length_3; col_count++){
						if(tableData[row_count][col_count] ==  null ||tableData[row_count][col_count] ==  false){
							allcheck = false;
							rowcheck = false;
						}
					}
					tableData[row_count]['select_col'] =  rowcheck;
				}
				for (col_count = 1; col_count <= this.column_length_3; col_count++){
					colcheck =true;
					for (row_count = 1; row_count < tableData.length; row_count++){
						if(tableData[row_count][col_count] ==  null ||tableData[row_count][col_count] ==  false){
							colcheck = false;
						}
					}
					tableData[0][col_count] =  colcheck;
				}
				tableData[0]['select_col'] =  allcheck;
				this.dataGrid3.setData({columns: tableColumns, data: tableData});
				this.dataGrid3.grid.resizeCanvas();
			});

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});
			this.validator1 = clutil.validator($("#ca_base_form"), {
				echoback : $('.cl_echoback')
			});
			this.validator2 = clutil.validator($("#ca_table_tbody"), {
				echoback : $('.cl_echoback')
			});
			
			// 基本オプショングループ
			this.showOptBlock();
			
			return this;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			// 初期データ取得後に呼ばれる関数

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'), 1);

			// ＰＯ種別
			clutil.cltypeselector(this.$("#ca_poTypeID"), amcm_type.AMCM_TYPE_PO_CLASS);

			clutil.datepicker(this.$("#ca_stDate"));
			this.$("#ca_stDate").datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
			clutil.datepicker(this.$("#ca_edDate"));
			this.$("#ca_edDate").datepicker('setIymd', clcom.max_date);
			clutil.datepicker(this.$("#ca_ordStopDate"));
			$("#ca_tp_code").tooltip({html: true});
			// Fieldlimit
			clutil.cltxtFieldLimit($("#ca_code"));
			clutil.cltxtFieldLimit($("#ca_name"));

			this._PoTypeChange();
			return this;
		},
		//TODO
		_unitChange:function(e){
			var $POTypeID = this.$("#ca_poTypeID");
			var $UnitID = this.$("#ca_unitID");
			this.$("#ca_parentBrandID").val("");
			this.$("#ca_modelID_div").val("");
			if($UnitID.val() <= 0){
				clutil.viewReadonly(this.$("#ca_parentBrandID_div"));
				clutil.viewReadonly(this.$("#ca_modelID_div"));
			}else{
				clutil.viewRemoveReadonly(this.$("#ca_parentBrandID_div"));
				clutil.viewRemoveReadonly(this.$("#ca_modelID_div"));
				clutil.clpoparentbrandselector(this.$("#ca_parentBrandID"), {
					dependAttrs :{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return amcm_type.AMCM_VAL_PO_CLASS_LADYS;
						}
					}
				});
				this.modelField = clutil.clpomodelselector({
					el:this.$("#ca_modelID"),
					dependAttrs :{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return amcm_type.AMCM_VAL_PO_CLASS_LADYS;
						}
					}
				});
			}
			// 基本オプショングループ
			this.showOptBlock();
		},
		_PoTypeChange: function(e) {
			this.$("#ca_parentBrandID").val("");
			this.$("#ca_modelID_div").val("");
			this.clearTable();
			var $POTypeID = this.$("#ca_poTypeID");
			if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				this.$("#ca_table_form").show();
				this.$("#ca_datagrid1").show();
				this.$("#ca_datagrid2").hide();
				this.$("#ca_datagrid3").hide();
				this.$("#ca_parentBrandID").removeClass("cl_required");
				this.$("#ca_modelID").removeClass("cl_required");
				this.$("#ca_modelID_div").hide();
				this.$("#ca_parentBrandID_div").hide();
				this.dataGrid1.grid.resizeCanvas();
			}else if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				this.$("#ca_table_form").show();
				this.$("#ca_datagrid1").hide();
				this.$("#ca_datagrid2").show();
				this.$("#ca_datagrid3").show();
				this.$("#ca_parentBrandID_div").show();
				this.$("#ca_modelID_div").show();
				this.$("#ca_parentBrandID").addClass("cl_required");
				this.$("#ca_modelID").addClass("cl_required");

				//レディスの場合親ブランドを表示
				var $POTypeID = this.$("#ca_poTypeID");
				var $UnitID = this.$("#ca_unitID");
				if($UnitID.val() <= 0){
					clutil.viewReadonly(this.$("#ca_parentBrandID_div"));
					clutil.viewReadonly(this.$("#ca_modelID_div"));
				}else{
					clutil.viewRemoveReadonly(this.$("#ca_parentBrandID_div"));
					clutil.viewRemoveReadonly(this.$("#ca_modelID_div"));
					clutil.clpoparentbrandselector(this.$("#ca_parentBrandID"), {
						dependAttrs :{
							unit_id: function() {
								return $UnitID.val();
							},
							poTypeID: function() {
								return amcm_type.AMCM_VAL_PO_CLASS_LADYS;
							}
						}
					});
					this.modelField = clutil.clpomodelselector({
						el:this.$("#ca_modelID"),
						dependAttrs :{
							unit_id: function() {
								return $UnitID.val();
							},
							poTypeID: function() {
								return amcm_type.AMCM_VAL_PO_CLASS_LADYS;
							}
						}
					});
				}

				this.dataGrid2.grid.resizeCanvas();
				this.dataGrid3.grid.resizeCanvas();
			}else if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				this.$("#ca_table_form").hide();
				this.$("#ca_datagrid1").hide();
				this.$("#ca_datagrid2").hide();
				this.$("#ca_datagrid3").hide();
				this.$("#ca_parentBrandID").removeClass("cl_required");
				this.$("#ca_modelID").removeClass("cl_required");
				this.$("#ca_modelID_div").hide();
				this.$("#ca_parentBrandID_div").hide();
			}else{
				this.$("#ca_table_form").hide();
				this.$("#ca_datagrid1").hide();
				this.$("#ca_datagrid2").hide();
				this.$("#ca_datagrid3").hide();
				this.$("#ca_parentBrandID").removeClass("cl_required");
				this.$("#ca_modelID").removeClass("cl_required");
				this.$("#ca_modelID_div").hide();
				this.$("#ca_parentBrandID_div").hide();
			}
			clutil.initUIelement(this.$el);
			
			// 基本オプショングループ
			this.showOptBlock();
		},
		
		// 2015/10/23 追加改善要望：基本オプションの追加
		showOptBlock:function(){
			var unit = $("#ca_unitID").val();
			var poType = $("#ca_poTypeID").val();
			
			// オプションエリアをすべて消す
			$("#ca_baseoptArea").hide();
			$(".ca_optArea").hide();
			
			// ユニットorPO種別が未選択ならなにもしない
			if((unit != clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					&& unit != clutil.getclsysparam('PAR_AMMS_UNITID_ORI'))
					||(poType != amcm_type.AMCM_VAL_PO_CLASS_MENS)){
				
			}
			else{
				// ブロック表示
				$("#ca_baseoptArea").show();
				if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					// AOKI
					if(poType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
						// メンズ
						$(".ca_AOKI_M_Area").show();
					}
				}
				else{
					// ORIHICA
					if(poType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
						// メンズ
						$("#ca_ORIHICA_M_Area").show();
					}
				}
			}
		},

		render : function(){
//			//新規の場合も検索が走るのでその描画の際に表示する
			this.$("#ca_unitID").val(clcom.userInfo.unit_id);

			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				// テーブル設定
				this.mdBaseView.fetch();	// データを GET してくる。
//				if(this.$("#ca_unitID").find("option").length <= 2){
//				clutil.setFocus($('#ca_poTypeID'));
//				}else{
//				clutil.setFocus($('#ca_unitID'));
//				}
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}
			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				document.location = '#';
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					// 更新した日付をchkdataに反映
//					this.options.chkData[args.index].fromDate = args.data.AMPOV0060GetRsp.orgfunc.fromDate;
				}
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setTableReadOnly(true);
				this.setTableReadOnly2(true);
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setTableReadOnly(true);
				this.setTableReadOnly2(true);
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_base_form"));
				this.setTableReadOnly(true);
				this.setTableReadOnly2(true);
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.validator.setErrorInfoToTable({
					$table: this.$('#ca_table'),
					fieldMessages: data.rspHead.fieldMessages,
					struct_name: 'clothCodeList',
					options: {
						by: 'name'
					}
				});
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
//				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
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
				var getRsp = data.AMPOV0060GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.brand);
				
				//2015/10/26 PO改善追加項目 藤岡
				this.optData2View(getRsp);
				//2015/10/26 PO改善追加項目 ここまで
				
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				this._ladysData2View(getRsp);

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					this.setHeadReadOnly(true);
					this.setTableReadOnly(true);
					this.setTableReadOnly2(true);
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					this.setHeadReadOnly(true);
					this.setTableReadOnly(true);
					this.setTableReadOnly2(true);
					break;

				default:
					this.setHeadReadOnly(false);
					if(this.options.opeTypeId ==  am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
						//新規
						//検索結果によって空データで上書きされてしまうのでもういちど登録
						this.$("#ca_unitID").selectpicker('val', clcom.userInfo.unit_id);
						if(this.$("#ca_unitID").find("option").length <= 2){
							clutil.viewReadonly(this.$(".ca_unitID_div"));
							clutil.setFocus($('#ca_poTypeID'));
						}else{
							clutil.setFocus($('#ca_unitID'));
						}
						this.$("#ca_stDate").datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
						this.$("#ca_edDate").datepicker('setIymd', clcom.max_date);
					}else{
						clutil.viewReadonly(this.$(".ca_unitID_div"));
						clutil.viewReadonly(this.$(".ca_poTypeID_div"));
						clutil.inputReadonly($("#ca_code"));
						clutil.setFocus($('#ca_name'));
					}
					break;
				}
				// Fieldlimit
				clutil.cltxtFieldLimitReset($("#ca_code"));
				clutil.cltxtFieldLimitReset($("#ca_name"));
				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
//				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.cl_sys_db_other)});
				var getRsp = data.AMPOV0060GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.brand);
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				this._ladysData2View(getRsp);
				this.setTableReadOnly(true);
				this.setTableReadOnly2(true);
				this.setHeadReadOnly(true);

				// Fieldlimit
				clutil.cltxtFieldLimitReset($("#ca_code"));
				clutil.cltxtFieldLimitReset($("#ca_name"));
//				this._tableDisable();
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMPOV0060GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.brand);
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				this._ladysData2View(getRsp);
				this.setHeadReadOnly(true);
				this.setTableReadOnly(true);
				this.setTableReadOnly2(true);
//				this._tableDisable();
				// Fieldlimit
				clutil.cltxtFieldLimitReset($("#ca_code"));
				clutil.cltxtFieldLimitReset($("#ca_name"));
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				var getRsp = data.AMPOV0060GetRsp;
				clutil.data2view(this.$('#ca_base_form'), getRsp.brand);
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				this._ladysData2View(getRsp);
				this.setHeadReadOnly(true);
				this.setTableReadOnly(true);
				this.setTableReadOnly2(true);
				// Fieldlimit
				clutil.cltxtFieldLimitReset($("#ca_code"));
				clutil.cltxtFieldLimitReset($("#ca_name"));
//				this._tableDisable();
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setHeadReadOnly(true);
				this.setTableReadOnly(true);
				this.setTableReadOnly2(true);
//				this._tableDisable();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
			clutil.initUIelement(this.$el);
		},
		
		//2015/10/26 PO改善追加項目 藤岡
		// オプション項目欄表示
		optData2View:function(getRsp){
			var opt = getRsp.baseOpt;
			var brand = getRsp.brand;
			var unit = brand.unitID;
			var poType = brand.poTypeID;
			
			// 基本オプショングループ枠表示
			this.showOptBlock();
			
			// 値反映
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				// AOKI
				if(poType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
					// メンズ
					clutil.data2view($('#ca_AOKI_M_Field'), opt, "ca_AOKI_M_");
				}
			}
			else{
				// ORIHICA
				if(poType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
					// メンズ
					clutil.data2view($('#ca_ORIHICA_M_Area'), opt, "ca_ORIHICA_M_");
				}
			}
			
		},
		//2015/10/26 PO改善追加項目 ここまで

		setHeadReadOnly: function(readOnly){
			if (readOnly == true){
				clutil.viewReadonly(this.$("#ca_base_form"));
			}else{
				clutil.viewRemoveReadonly(this.$("#ca_base_form"));
			}
		},
		setTableReadOnly: function(readOnly){
			if (readOnly == true){
				clutil.viewReadonly(this.$("#ca_table_form"));
				//テーブル部編集不可
			}else{
				clutil.viewRemoveReadonly(this.$("#ca_table_form"));
			}

		},
		setTableReadOnly2: function(readOnly){
			if (readOnly == true){
				this.dataGrid1.setEnable(false);
				this.dataGrid2.setEnable(false);
				this.dataGrid3.setEnable(false);
			}else{
				this.dataGrid1.setEnable(true);
				this.dataGrid2.setEnable(true);
				this.dataGrid3.setEnable(true);
			}

		},
		/**
		 * dataを表示
		 */
		_ladysData2View : function(getRsp){
			//レディースにのみ用がある
			if(getRsp.brand.poTypeID != amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				return;
			}
			//親ブランド条件作成
			clutil.clpoparentbrandselector({
				el:this.$("#ca_parentBrandID"),
				dependAttrs :{
					unit_id: function() {
						return getRsp.brand.unitID;
					},
					poTypeID: function() {
						return amcm_type.AMCM_VAL_PO_CLASS_LADYS;
					}
				}
			}).done(_.bind(function(){
				//モデル項目作成
				clutil.clpomodelselector({
					el:this.$("#ca_modelID"),
					dependAttrs :{
						unit_id: function() {
							return getRsp.brand.unitID;
						},
						poTypeID: function() {
							return amcm_type.AMCM_VAL_PO_CLASS_LADYS;
						}
					}
				}).done(_.bind(function(){
					this.$("#ca_parentBrandID").selectpicker('val', getRsp.brand.parentBrandID);
					this.$("#ca_modelID").selectpicker('val', getRsp.brand.modelID);
				},this));
			},this));
		},
		_allData2View : function(getRsp){
			var _this = this;
			var columns1 = [];
			var columns2 = [];
			var columns3 = [];
			var data1 = [];
			var data2 = [];
			var data3 = [];

			//基本部品 名称及び選択行列
			var title_obj	= { id: 'title', name: "", field: "title", width: 80 };
			var select_obj	= { id: 'select_col', name: '選択', field: 'select_col', width: 50,	cellType: {type: 'checkbox'}};
			columns1.push(title_obj);
			columns1.push(select_obj);
			columns2.push(title_obj);
			columns2.push(select_obj);
			columns3.push(title_obj);
			columns3.push(select_obj);
//			var row_obj = { id: 'select_row', title: "選択"};
			data1.push({ id: 'select_row', title: "選択"});
			data2.push({ id: 'select_row', title: "選択"});
			data3.push({ id: 'select_row', title: "選択"});
			_this.column_length_1 = 0;
			_this.column_length_2 = 0;
			_this.column_length_3 = 0;
			_this.row_length_1 = 0;
			_this.row_length_2 = 0;
			_this.row_length_3 = 0;

			$.each(getRsp.colList, function(){
				switch(this.poSizeTypeID){
				case amcm_type.AMCM_VAL_POSIZE_TYPE_MENS:
					// メンズ
					var obj	= {
						id:		this.colNo,
						name:	this.colName,
						field:	this.colNo,
						width:	20,
						cellType: {type: 'checkbox'}
				};
					columns1.push(obj);
					_this.column_length_1++;
					break;
				case amcm_type.AMCM_VAL_POSIZE_TYPE_LADYS_GO:
					// レディス（号）
					var obj	= {
						id:		this.colNo,
						name:	this.colName,
						field:	this.colNo,
						width:	20,
						cellType: {type: 'checkbox'}
				};
					columns2.push(obj);
					_this.column_length_2++;
					break;
				case amcm_type.AMCM_VAL_POSIZE_TYPE_LADYS_SML:
					// レディス（SML）
					var obj	= {
						id:		this.colNo,
						name:	this.colName,
						field:	this.colNo,
						width:	20,
						cellType: {type: 'checkbox'}
				};
					columns3.push(obj);
					_this.column_length_3++;
					break;
				default:
					// それ以外
					break;
				}
			});
			$.each(getRsp.rowList, function(){
				switch(this.poSizeTypeID){
				case amcm_type.AMCM_VAL_POSIZE_TYPE_MENS:
					// メンズ
					var obj	= {
						id:		this.rowNo,
						title:	this.rowName
				};
					data1.push(obj);
					_this.row_length_1++;
					break;
				case amcm_type.AMCM_VAL_POSIZE_TYPE_LADYS_GO:
					// レディス（号）
					var obj	= {
						id:		this.rowNo,
						title:	this.rowName
				};
					data2.push(obj);
					_this.row_length_2++;
					break;
				case amcm_type.AMCM_VAL_POSIZE_TYPE_LADYS_SML:
					// レディス（SML）
					var obj	= {
						id:		this.rowNo,
						title:	this.rowName
				};
					data3.push(obj);
					_this.row_length_3++;
					break;
				default:
					// それ以外
					break;
				}
			});
			// getRsp.sizeListのデータを確認しdataを更新する
			$.each(getRsp.sizeList, function(){
				if(this.chkFlag > 0){

					switch(this.poSizeTypeID){
					case amcm_type.AMCM_VAL_POSIZE_TYPE_MENS:
						// メンズ
						data1[this.rowNo][this.colNo] =true;
						break;
					case amcm_type.AMCM_VAL_POSIZE_TYPE_LADYS_GO:
						// レディス（号）
						data2[this.rowNo][this.colNo] =true;
						break;
					case amcm_type.AMCM_VAL_POSIZE_TYPE_LADYS_SML:
						// レディス（SML）
						data3[this.rowNo][this.colNo] =true;
						break;
					default:
						// それ以外
						break;
					}
				}
			});


			//選択項目チェック
			var allcheck =true;
			var rowcheck =true;
			var colcheck =true;
			var row_count = 0;
			var col_count = 0;
			//てブル１
			for (row_count = 1; row_count < data1.length; row_count++){
				rowcheck =true;
				for (col_count = 1; col_count <= this.column_length_1; col_count++){
					if(data1[row_count][col_count] == null || data1[row_count][col_count] ==  false){
						allcheck = false;
						rowcheck = false;
					}
				}
				data1[row_count]['select_col'] =  rowcheck;
			}
			for (col_count = 1; col_count <= this.column_length_1; col_count++){
				colcheck =true;
				for (row_count = 1; row_count < data1.length; row_count++){
					if(data1[row_count][col_count] == null || data1[row_count][col_count] ==  false){
						colcheck = false;
					}
				}
				data1[0][col_count] =  colcheck;
			}
			data1[0]['select_col'] =  allcheck;

			allcheck=true;
			//てブル2
			for (row_count = 1; row_count < data2.length; row_count++){
				rowcheck =true;
				for (col_count = 1; col_count <= this.column_length_2; col_count++){
					if(data2[row_count][col_count] == null || data2[row_count][col_count] ==  false){
						allcheck = false;
						rowcheck = false;
					}
				}
				data2[row_count]['select_col'] =  rowcheck;
			}
			for (col_count = 1; col_count <= this.column_length_2; col_count++){
				colcheck =true;
				for (row_count = 1; row_count < data2.length; row_count++){
					if(data2[row_count][col_count] == null || data2[row_count][col_count] ==  false){
						colcheck = false;
					}
				}
				data2[0][col_count] =  colcheck;
			}
			data2[0]['select_col'] =  allcheck;

			allcheck=true;
			//てブル3
			for (row_count = 1; row_count < data3.length; row_count++){
				rowcheck =true;
				for (col_count = 1; col_count <= this.column_length_3; col_count++){
					if(data3[row_count][col_count] == null || data3[row_count][col_count] ==  false){
						allcheck = false;
						rowcheck = false;
					}
				}
				data3[row_count]['select_col'] =  rowcheck;
			}
			for (col_count = 1; col_count <= this.column_length_3; col_count++){
				colcheck =true;
				for (row_count = 1; row_count < data3.length; row_count++){
					if(data3[row_count][col_count] == null || data3[row_count][col_count] ==  false){
						colcheck = false;
					}
				}
				data3[0][col_count] =  colcheck;
			}
			data3[0]['select_col'] =  allcheck;

			this.dataGrid1.render().setData({
				columns: columns1,	// カラム定義
				data: data1			// データ
			});
			this.dataGrid2.render().setData({
				columns: columns2,	// カラム定義
				data: data2			// データ
			});
			this.dataGrid3.render().setData({
				columns: columns3,	// カラム定義
				data: data3			// データ
			});
			this._PoTypeChange();
			clutil.initUIelement(this.$el);
		},


		/**
		 * テーブルクリア
		 */
		clearTable : function() {
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
//			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			this.validator.clear();



			var updReq = {};
			/*
			 * 入力値チェック 予約取消時はチェックしない
			 */
			// validation
			var f_error = false;
			this.validator.clear();
			var _this = this;

			if(!this.validator.valid()) {
				f_error = true;
			}

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

			if(!this.validator1.valid()) {
				f_error = true;
			}
			if(!this.validator2.valid()) {
				f_error = true;
			}
			var stDate = 0;
			var edDate = 0;
			var orgStopDate = 0;
			var $tgt = $(this);
			// 適用開始日 運用日翌日
			var $stDate = this.$el.find('input[name="stDate"]')
			.each(function(){
				stDate = clutil.dateFormat(this.value, "yyyymmdd");
			});

			// 適用終了日 最大日付
			var $edDate = this.$el.find('input[name="edDate"]')
			.each(function(){
				edDate = clutil.dateFormat(this.value, "yyyymmdd");
			});

			// 発注停止日 空白
			var $orgStopDate = this.$el.find('input[name="ordStopDate"]')
			.each(function(){
				orgStopDate = clutil.dateFormat(this.value, "yyyymmdd");
			});
			if (stDate > edDate){
				f_error = true;
				this.validator.setErrorMsg( $stDate, clmsg.EGM0013);
				this.validator.setErrorMsg( $edDate, clmsg.EGM0013);
			}
			if(orgStopDate > 0){
				if (orgStopDate > edDate){
					f_error = true;
					this.validator.setErrorMsg( $orgStopDate, clmsg.EPO0051);
				}
				//
				/*** 20151104 MT-0902 発注停止日と運用日のチェックはしない
				if (clutil.addDate(clcom.getOpeDate(), 1) > orgStopDate){
					f_error = true;
					this.validator.setErrorMsg( $orgStopDate, clmsg.EPO0050);
				}
				 ***/
				if (stDate > orgStopDate){
					f_error = true;
					this.validator.setErrorMsg( $orgStopDate, clmsg.EPO0053);
				}
			}
			if(f_error){
				_this.validator.setErrorHeader(clmsg.cl_echoback);
				return null;
			}
			this.dataGrid1.stopEditing();
			this.dataGrid2.stopEditing();
			this.dataGrid3.stopEditing();

			var data1 = this.dataGrid1.getData();
			var data2 = this.dataGrid2.getData();
			var data3 = this.dataGrid3.getData();
			if(f_error){
				_this.validator.setErrorHeader(clmsg.cl_echoback);
				return null;
			}
			var head = clutil.view2data(this.$('#ca_base_form'));
			var list = [];
			var row_count = 0;
			var col_count = 0;
			if (head.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				//メンズ
				for (row_count = 1; row_count < data1.length; row_count++){
					for (col_count = 1; col_count <= this.column_length_1; col_count++){
						if(data1[row_count][col_count] != null && data1[row_count][col_count] == true){
							var obj	= {
									poSizeID:		0,
									poSizeTypeID:	amcm_type.AMCM_VAL_POSIZE_TYPE_MENS,
									rowNo:			row_count,
									colNo:			col_count,
									chkFlag: 		1
							};
							list.push(obj);
						}
					}
				}
			}else if(head.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				//レディース
				for (row_count = 1; row_count < data2.length; row_count++){
					for (col_count = 1; col_count <= this.column_length_2; col_count++){
						if(data2[row_count][col_count] != null && data2[row_count][col_count] == true){
							var obj	= {
									poSizeID:		0,
									poSizeTypeID:	amcm_type.AMCM_VAL_POSIZE_TYPE_LADYS_GO,
									rowNo:			row_count,
									colNo:			col_count,
									chkFlag: 		1
							};
							list.push(obj);
						}
					}
				}
				for (row_count = 1; row_count < data3.length; row_count++){
					for (col_count = 1; col_count <= this.column_length_3; col_count++){
						if(data3[row_count][col_count] != null && data3[row_count][col_count] == true){
							var obj	= {
									poSizeID:		0,
									poSizeTypeID:	amcm_type.AMCM_VAL_POSIZE_TYPE_LADYS_SML,
									rowNo:			row_count,
									colNo:			col_count,
									chkFlag: 		1
							};
							list.push(obj);
						}
					}
				}
			}else{
				;	//何もしない
			}
			if(head.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_MENS
					|| head.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				if(list.length == 0){
					_this.validator.setErrorHeader(clmsg.EPO0040);
					return null;
				}
			}
			if(head.poTypeID != amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				// jsonエラー対策 レディース以外の場合変換時にエラーになるので
				head.parentBrandID = 0;
				head.modelID = 0;
			}
			
			// 2015/10/26 PO改善 藤岡
			var baseOpt = this.getBaseOpt();
			// 2015/10/26 PO改善 ここまで
			
			updReq = {
					brand : head,
					baseOpt: baseOpt,
					sizeList : list
			};
			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var reqObj = {
					reqHead : reqHead,
					AMPOV0060UpdReq  : updReq
			};
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},
		
		// 2015/10/26 PO改善 藤岡
		// 基本オプション値取得
		getBaseOpt:function(){
			var unit = $("#ca_unitID").val();
			var poType = $("#ca_poTypeID").val();
			var obj = {};
			
			// 基本オプショングループ枠表示
			this.showOptBlock();
			
			// 値反映
			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				// AOKI
				if(poType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
					// メンズ
					obj = clutil.view2data($('#ca_AOKI_M_Field'), "ca_AOKI_M_");
				}
			}
			else{
				// ORIHICA
				if(poType == amcm_type.AMCM_VAL_PO_CLASS_MENS){
					// メンズ
					obj = clutil.view2data($('#ca_ORIHICA_M_Area'), "ca_ORIHICA_M_");
				}
			}
			return obj;
		},
		// 2015/10/26 PO改善 ここまで

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
					AMPOV0060GetReq: {
						srchID: this.options.chkData[pgIndex].id,			// 取引先ID
						newFlag:0,
						delFlag : this.options.chkData[pgIndex].delFlag
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMPOV0060UpdReq: {
					}
			};
			if(opeTypeId ==  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				getReq.reqHead.opeTypeId =  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY;
			}
			//新規の場合は新規フラグとして1を立てる(1は定義しなくてもいいかな？)
			if(opeTypeId ==  am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				getReq.AMPOV0060GetReq.newFlag = 1;
			}
			return {
				resId: clcom.pageId,	//'AMMSV0320',
				data: getReq
			};
		},

		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
//			var rec = data.AMPOV0060GetRsp;
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
