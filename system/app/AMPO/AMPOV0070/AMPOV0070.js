useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;

	var _delete_Flag = 0;

	clutil.enterFocusMode($('body'));
	var EditView = Backbone.View.extend({
		el : $("#ca_main"),

		validator : null,

		events : {
			"click #ca_table_tfoot0 tr" : "_onAddRow0Click",
			"click #ca_table_tfoot1 tr" : "_onAddRow1Click",
			"click #ca_table_tfoot2 tr" : "_onAddRow2Click",
			"click #ca_table_tfoot3 tr" : "_onAddRow3Click",
			"click #ca_table_tfoot4 tr" : "_onAddRow4Click",
			"click #ca_table_tfoot5 tr" : "_onAddRow5Click",
			"click #ca_table_tfoot6 tr" : "_onAddRow6Click",
			"click #ca_table_tfoot7 tr" : "_onAddRow7Click",
			"click #ca_table_tfoot8 tr" : "_onAddRow8Click",
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
						title: 'ブランド別スタイル・オプション',
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

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			return this;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			// 初期データ取得後に呼ばれる関数
			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'));
			// ＰＯ種別
			clutil.cltypeselector(this.$("#ca_poTypeID"), amcm_type.AMCM_TYPE_PO_CLASS);



			var $POTypeID = this.$("#ca_poTypeID");
			var $UnitID = this.$("#ca_unitID");
//			clutil.clpoclothid(this.$("#ca_clothIDID"), {
			this.brandIdField = clutil.clpobrandcode(this.$("#ca_brandID"), {
				dependAttrs :{
					unit_id: function() {
						return $UnitID.val();
					},
					poTypeID: function() {
						return $POTypeID.val();
					}
				}
			});

			clutil.clpooptgrpcode(this.$("#ca_optGrp"), {
				dependAttrs :{
					unit_id: function() {
						return $UnitID.val();
					},
					poTypeID: function() {
						return $POTypeID.val();
					}
				}
			});
			return this;
		},

		_onAddRow0Click: function(e) {
			this.addRowStyleMens(this.$("#ca_table0"), 0);
		},
		_onAddRow1Click: function(e) {
			this.addRowStyleMens(this.$("#ca_table1"), 0);
		},
		_onAddRow2Click: function(e) {
			this.addRowStyleMens(this.$("#ca_table2"), 0);
		},
		_onAddRow3Click: function(e) {
			this.addRowStyleMens(this.$("#ca_table3"), 0);
		},
		_onAddRow4Click: function(e) {
			this.addRowStyleLady(this.$("#ca_table4"), amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET);
		},
		_onAddRow5Click: function(e) {
			this.addRowStyleLady(this.$("#ca_table5"), amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT);
		},
		_onAddRow6Click: function(e) {
			this.addRowStyleLady(this.$("#ca_table6"), amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS);
		},
		_onAddRow7Click: function(e) {
			this.addRowStyleLady(this.$("#ca_table7"), amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST);
		},
		_onAddRow8Click: function(e) {
			this.addRowMaker(this.$("#ca_table8"));
		},

		render : function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			this.mdBaseView.fetch();	// 新規だろうとなんだろうとデータを GET してくる。
//			}
			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			var _this = this;
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
//				clutil.viewReadonly(this.$("#ca_base_form"));
//				this._tableDisable();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
//				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
//				prefix: 'ca_'
//				});
				//スタイルテーブルのエラーだけは自前で実装
				//TODO
				var stileTrTagList = new Array;
				$("#ca_table_tbody0").find('tr').each(function(e){
					var $styleCode	= $(this).find('input[name="styleCode"]');
					var $styleName	= $(this).find('input[name="styleName"]');
					var $price		= $(this).find('input[name="price"]');
					var $stDate		= $(this).find('input[name="stDate"]');
					var $edDate		= $(this).find('input[name="edDate"]');
					var $ordStopDate		= $(this).find('input[name="ordStopDate"]');
					if(
							($styleName.val() == null ||  _.isEmpty($styleName.val().trim())) &&
							($styleCode.val() == null ||  _.isEmpty($styleCode.val().trim())) &&
							($price.val() == null ||  _.isEmpty($price.val().trim())) &&
							($stDate.val() == null ||  $stDate.val() == "") &&
							($edDate.val() == null ||  $edDate.val() == "") &&
							($ordStopDate.val() == null || $ordStopDate.val() == "")

					){
						//空白行は無視(登録時点で途中の空白はチェックしているので後半部分のみ)
						return;
					}
					stileTrTagList.push(this);
				});
				$("#ca_table_tbody1").find('tr').each(function(e){
					var $styleCode	= $(this).find('input[name="styleCode"]');
					var $styleName	= $(this).find('input[name="styleName"]');
					var $price		= $(this).find('input[name="price"]');
					var $stDate		= $(this).find('input[name="stDate"]');
					var $edDate		= $(this).find('input[name="edDate"]');
					var $ordStopDate		= $(this).find('input[name="ordStopDate"]');
					if(
							($styleName.val() == null ||  _.isEmpty($styleName.val().trim())) &&
							($styleCode.val() == null ||  _.isEmpty($styleCode.val().trim())) &&
							($price.val() == null ||  _.isEmpty($price.val().trim())) &&
							($stDate.val() == null ||  $stDate.val() == "") &&
							($edDate.val() == null ||  $edDate.val() == "") &&
							($ordStopDate.val() == null || $ordStopDate.val() == "")

					){
						//空白行は無視(登録時点で途中の空白はチェックしているので後半部分のみ)
						return;
					}
					stileTrTagList.push(this);
				});
				$("#ca_table_tbody2").find('tr').each(function(e){
					var $styleCode	= $(this).find('input[name="styleCode"]');
					var $styleName	= $(this).find('input[name="styleName"]');
					var $price		= $(this).find('input[name="price"]');
					var $stDate		= $(this).find('input[name="stDate"]');
					var $edDate		= $(this).find('input[name="edDate"]');
					var $ordStopDate		= $(this).find('input[name="ordStopDate"]');
					if(
							($styleName.val() == null ||  _.isEmpty($styleName.val().trim())) &&
							($styleCode.val() == null ||  _.isEmpty($styleCode.val().trim())) &&
							($price.val() == null ||  _.isEmpty($price.val().trim())) &&
							($stDate.val() == null ||  $stDate.val() == "") &&
							($edDate.val() == null ||  $edDate.val() == "") &&
							($ordStopDate.val() == null || $ordStopDate.val() == "")

					){
						//空白行は無視(登録時点で途中の空白はチェックしているので後半部分のみ)
						return;
					}
					stileTrTagList.push(this);
				});
				$("#ca_table_tbody3").find('tr').each(function(e){
					var $styleCode	= $(this).find('input[name="styleCode"]');
					var $styleName	= $(this).find('input[name="styleName"]');
					var $price		= $(this).find('input[name="price"]');
					var $stDate		= $(this).find('input[name="stDate"]');
					var $edDate		= $(this).find('input[name="edDate"]');
					var $ordStopDate		= $(this).find('input[name="ordStopDate"]');
					if(
							($styleName.val() == null ||  _.isEmpty($styleName.val().trim())) &&
							($styleCode.val() == null ||  _.isEmpty($styleCode.val().trim())) &&
							($price.val() == null ||  _.isEmpty($price.val().trim())) &&
							($stDate.val() == null ||  $stDate.val() == "") &&
							($edDate.val() == null ||  $edDate.val() == "") &&
							($ordStopDate.val() == null || $ordStopDate.val() == "")

					){
						//空白行は無視(登録時点で途中の空白はチェックしているので後半部分のみ)
						return;
					}
					stileTrTagList.push(this);
				});
				$("#ca_table_tbody4").find('tr').each(function(e){
					var $styleCode	= $(this).find('input[name="styleCode"]');
					var $styleName	= $(this).find('input[name="styleName"]');
					var $price		= $(this).find('input[name="price"]');
					var $stDate		= $(this).find('input[name="stDate"]');
					var $edDate		= $(this).find('input[name="edDate"]');
					var $ordStopDate		= $(this).find('input[name="ordStopDate"]');
					if(
							($styleName.val() == null ||  _.isEmpty($styleName.val().trim())) &&
							($styleCode.val() == null ||  _.isEmpty($styleCode.val().trim())) &&
							($price.val() == null ||  _.isEmpty($price.val().trim())) &&
							($stDate.val() == null ||  $stDate.val() == "") &&
							($edDate.val() == null ||  $edDate.val() == "") &&
							($ordStopDate.val() == null || $ordStopDate.val() == "")

					){
						//空白行は無視(登録時点で途中の空白はチェックしているので後半部分のみ)
						return;
					}
					stileTrTagList.push(this);
				});
				$("#ca_table_tbody5").find('tr').each(function(e){
					var $styleCode	= $(this).find('input[name="styleCode"]');
					var $styleName	= $(this).find('input[name="styleName"]');
					var $price		= $(this).find('input[name="price"]');
					var $stDate		= $(this).find('input[name="stDate"]');
					var $edDate		= $(this).find('input[name="edDate"]');
					var $ordStopDate		= $(this).find('input[name="ordStopDate"]');
					if(
							($styleName.val() == null ||  _.isEmpty($styleName.val().trim())) &&
							($styleCode.val() == null ||  _.isEmpty($styleCode.val().trim())) &&
							($price.val() == null ||  _.isEmpty($price.val().trim())) &&
							($stDate.val() == null ||  $stDate.val() == "") &&
							($edDate.val() == null ||  $edDate.val() == "") &&
							($ordStopDate.val() == null || $ordStopDate.val() == "")
					){
						//空白行は無視(登録時点で途中の空白はチェックしているので後半部分のみ)
						return;
					}
					stileTrTagList.push(this);
				});
				$("#ca_table_tbody6").find('tr').each(function(e){
					var $styleCode	= $(this).find('input[name="styleCode"]');
					var $styleName	= $(this).find('input[name="styleName"]');
					var $price		= $(this).find('input[name="price"]');
					var $stDate		= $(this).find('input[name="stDate"]');
					var $edDate		= $(this).find('input[name="edDate"]');
					var $ordStopDate		= $(this).find('input[name="ordStopDate"]');
					if(
							($styleName.val() == null ||  _.isEmpty($styleName.val().trim())) &&
							($styleCode.val() == null ||  _.isEmpty($styleCode.val().trim())) &&
							($price.val() == null ||  _.isEmpty($price.val().trim())) &&
							($stDate.val() == null ||  $stDate.val() == "") &&
							($edDate.val() == null ||  $edDate.val() == "") &&
							($ordStopDate.val() == null || $ordStopDate.val() == "")

					){
						//空白行は無視(登録時点で途中の空白はチェックしているので後半部分のみ)
						return;
					}
					stileTrTagList.push(this);
				});
				$("#ca_table_tbody7").find('tr').each(function(e){
					var $styleCode	= $(this).find('input[name="styleCode"]');
					var $styleName	= $(this).find('input[name="styleName"]');
					var $price		= $(this).find('input[name="price"]');
					var $stDate		= $(this).find('input[name="stDate"]');
					var $edDate		= $(this).find('input[name="edDate"]');
					var $ordStopDate		= $(this).find('input[name="ordStopDate"]');
					if(
							($styleName.val() == null ||  _.isEmpty($styleName.val().trim())) &&
							($styleCode.val() == null ||  _.isEmpty($styleCode.val().trim())) &&
							($price.val() == null ||  _.isEmpty($price.val().trim())) &&
							($stDate.val() == null ||  $stDate.val() == "") &&
							($edDate.val() == null ||  $edDate.val() == "") &&
							($ordStopDate.val() == null || $ordStopDate.val() == "")

					){
						//空白行は無視(登録時点で途中の空白はチェックしているので後半部分のみ)
						return;
					}
					stileTrTagList.push(this);
				});
				for(var i = 0; i < data.rspHead.fieldMessages.length; i++){
					var fldMsg = data.rspHead.fieldMessages[i];
					if(fldMsg.struct_name == "brandStyleList"){
						if(!fldMsg.lineno || fldMsg.lineno > stileTrTagList.length || _.isEmpty(fldMsg.field_name)){
							//て-ブルの列より多くなることないはず
							continue;
						}
						$(stileTrTagList[fldMsg.lineno-1]).find("input").each(function(){
							if(this.name == fldMsg.field_name){
								_this.validator.setErrorMsg($(this), clutil.getclmsg(fldMsg.message));
							}
						});
					}
				}

				this.validator.setErrorInfoToTable({
					$table: this.$('#ca_table8'),
					fieldMessages: data.rspHead.fieldMessages,
					struct_name: 'makerCodeList',
					options: {
						by: 'name'
					}
				});
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			this.setReadOnlyAllItems(false);
			switch(args.status){
			case 'OK':
				// イベント追加
				this.addEvent();
				this.data2view(data);

				switch (this.options.opeTypeId) {
				//この画面に来る場合は編集or削除のみ
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					this.setReadOnlyAllItems(true);
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					this.setReadOnlyAllItems(true);
					break;
				default:
					if (data.AMPOV0070GetRsp.brandOption.optGrpID <= 0){
						this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
					}else{
						this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
					}

				clutil.viewReadonly($("#ca_base_form"));
				clutil.setFocus($('#ca_optGrp'));
				break;
				}

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.data2view(data);
				this.setReadOnlyAllItems(true);
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				this.data2view(data);
				this.setReadOnlyAllItems(true);
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.data2view(data);
				this.setReadOnlyAllItems(true);
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
//				this._tableDisable();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示


				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				break;
			}
		},
		//全体入力制御
		setReadOnlyAllItems: function(readOnly){
			if (readOnly == true){
				clutil.viewReadonly($("#ca_base_form"));
				clutil.viewReadonly($("#ca_opt_form"));
				this.setReadOnlyTable(this.$("#ca_table0"), true);
				this.setReadOnlyTable(this.$("#ca_table1"), true);
				this.setReadOnlyTable(this.$("#ca_table2"), true);
				this.setReadOnlyTable(this.$("#ca_table3"), true);
				this.setReadOnlyTable(this.$("#ca_table4"), true);
				this.setReadOnlyTable(this.$("#ca_table5"), true);
				this.setReadOnlyTable(this.$("#ca_table6"), true);
				this.setReadOnlyTable(this.$("#ca_table7"), true);
				this.setReadOnlyTable(this.$("#ca_table8"), true);
			}else{
				clutil.viewRemoveReadonly($("#ca_base_form"));
				clutil.viewRemoveReadonly($("#ca_opt_form"));
				this.setReadOnlyTable(this.$("#ca_table0"), false);
				this.setReadOnlyTable(this.$("#ca_table1"), false);
				this.setReadOnlyTable(this.$("#ca_table2"), false);
				this.setReadOnlyTable(this.$("#ca_table3"), false);
				this.setReadOnlyTable(this.$("#ca_table4"), false);
				this.setReadOnlyTable(this.$("#ca_table5"), false);
				this.setReadOnlyTable(this.$("#ca_table6"), false);
				this.setReadOnlyTable(this.$("#ca_table7"), false);
				this.setReadOnlyTable(this.$("#ca_table8"), false);
			}
		},
		//テーブル入力制御
		setReadOnlyTable: function($table, readOnly){
			if (readOnly == true){
				clutil.viewReadonly($table.find('td.ca_sizeID_div'));
				$table.find('input[type="text"]').attr("readonly", true);
				$table.find('.ca_washableFlagCell').each(function(){
					var $this = $(this);
					clutil.viewReadonly($this);
				});
				$table.find('tbody span.btn-delete').hide();
				$table.find('tbody span.btn-add').hide();
				$table.find('tfoot').hide();
			}else{
				clutil.viewRemoveReadonly($table.find('td.ca_sizeID_div'));
				$table.find('.ca_washableFlagCell').each(function(){
					var $this = $(this);
					clutil.viewRemoveReadonly($this);
				});
				$table.find('input[type="text"]').removeAttr("readonly");
				$table.find('tbody span.btn-delete').show();
				$table.find('tbody span.btn-add').show();
				$table.find('tfoot').show();
			}
		},

		/**
		 * dataを表示
		 * PO種別により表示パネルを選択しそれぞれの区分ごとにデータを分けて表示
		 * PO種別
		 * メンズ：ca_table_form1,ca_table1,ca_table2,ca_table3
		 * レディース：ca_table_form2,ca_table4,ca_table5,ca_table6,ca_table7
		 * シャツ：ca_table_form3,ca_table8,
		 *
		 */
		data2view : function(data){
			var _this = this;

			this.saveData = data.AMPOV0070GetRsp;
			var brand = data.AMPOV0070GetRsp.brand;
			var brandOption = data.AMPOV0070GetRsp.brandOption;
			var styleList = data.AMPOV0070GetRsp.brandStyleList;
			var makerList = data.AMPOV0070GetRsp.makerCodeList;

			//返却パケットのbrandStyleListを以下の配列に分配する。
			var styleList_SUIT		= new Array;	//スーツメンズ（入ることはないはず）
			var styleList_JACKET_M	= new Array;	//ジャケットメンズ
			var styleList_SLACKS	= new Array;	//スラックスメンズ
			var styleList_VEST_M	= new Array;	//ベストメンズ
			var styleList_JACKET_W	= new Array;	//ジャケットレディース
			var styleList_SKIRT		= new Array;	//スカートレディース
			var styleList_PANTS		= new Array;	//パンツレディース
			var styleList_VEST_W	= new Array;	//ペストレディース

			//基本PO種別が異なるものは来ないはず。
			$.each(styleList, function() {
				switch(this.styleOptTypeID){
				case amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT:
					// スーツメンズ（こないはず）
					styleList_SUIT.push(this);
					break;
				case amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET:
					//ジャケットメンズ
					styleList_JACKET_M.push(this);
					break;
				case amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS:
					//スラックスメンズ
					styleList_SLACKS.push(this);
					break;
				case amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST:
					//ベストメンズ
					styleList_VEST_M.push(this);
					break;
				case amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET:
					// ジャケットレディース
					styleList_JACKET_W.push(this);
					break;
				case amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT:
					// スカートレディース
					styleList_SKIRT.push(this);
					break;
				case amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS:
					// パンツレディース
					styleList_PANTS.push(this);
					break;
				case amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST:
					// ペストレディース
					styleList_VEST_W.push(this);
					break;
				}
			});
			//ヘッダ部分
			clutil.data2view(this.$('#ca_base_form'), brand);
			var brandRec = {
					id		: brand.brandID,
					name	: brand.brandName,
					code	: brand.brandCode,
			};
			this.$("#ca_brandID").autocomplete('clAutocompleteItem', brandRec);

			//オプションスタイル部分
			clutil.data2view(this.$('#ca_opt_form'), brandOption);
			var optRec = {
					id		: brandOption.optGrpID,
					name	: brandOption.optGrpName,
					code	: brandOption.optGrpCode,
			};
			this.$("#ca_optGrp").autocomplete('clAutocompleteItem', optRec);
			//PO種別ごとに表示テーブル変更
			if(brand.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				this.$("#ca_table_form0").show();
				this.$("#ca_table_form1").show();
				this.$("#ca_table_form2").hide();
				this.$("#ca_table_form3").hide();
				this._setData2StyleTableMens(this.$("#ca_table0"), styleList_SUIT, 0);
				this._setData2StyleTableMens(this.$("#ca_table1"), styleList_JACKET_M, 0);
				this._setData2StyleTableMens(this.$("#ca_table2"), styleList_SLACKS, 0);
				this._setData2StyleTableMens(this.$("#ca_table3"), styleList_VEST_M, 0);
			}else if(brand.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				this.$("#ca_table_form2").show();
				this.$("#ca_table_form0").hide();
				this.$("#ca_table_form1").hide();
				this.$("#ca_table_form3").hide();
				this._setData2StyleTableLadys(this.$("#ca_table4"), styleList_JACKET_W, amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET);
//				this.$("#ca_table5_div").hide();
				this._setData2StyleTableLadys(this.$("#ca_table5"), styleList_SKIRT, amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT);
//				this.$("#ca_table6_div").hide();
				this._setData2StyleTableLadys(this.$("#ca_table6"), styleList_PANTS, amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS);
				this._setData2StyleTableLadys(this.$("#ca_table7"), styleList_VEST_W, amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST);
			}else if(brand.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				this.$("#ca_table_form3").show();
				this.$("#ca_table_form0").hide();
				this.$("#ca_table_form1").hide();
				this.$("#ca_table_form2").hide();
				this._setData2MakerTable(this.$("#ca_table8"),makerList);
//				clutil.data2view(this.$('#ca_table_form3'), makerList);
			}else{
				//来ないけどどうするか？
			}
		},
		/**
		 * テーブルにデータを表示
		 */
		//TODO
		_setData2StyleTableMens:function($table, data, optClass){
			var $BrandID = this.$("#ca_brandID");
			var $tbody = $table.find("tbody");
			// 行削除
			$tbody.empty();
			$.each(data, function() {
				var tr = _.template($("#ca_tbody_template1").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);
				var $tr = $tbody.find('tr:last');	// 追加した行
				var $inputCode = $tr.find('input[name="styleCode"]');
				$inputCode.val(this.styleCode);
				var $inputName = $tr.find('input[name="styleName"]');
				$inputName.val(this.styleName);
				var $inputPrice = $tr.find('input[name="price"]');
				$inputPrice.val(clutil.comma(this.price));
				var $brandStyleID = $tr.find('input[name="brandStyleID"]');
				$brandStyleID.val(this.brandStyleID);
				var $selectSize = $tr.find('select[name="sizeID"]');
				clutil.clposizeselector({
					el:$selectSize,
					dependAttrs :{
						poBrandID: function() {
							return	$BrandID.autocomplete('clAutocompleteItem').id;
						},
						poBrandStyleID: function() {
							return 0;
						},
						delFlag : _delete_Flag,
						ladysStyleOptClassTypeID: optClass
					},
					nameOnly:true
				}).done(_.bind(function(){
					if(this.sizeList != null && this.sizeList.length > 0){
						var list = new Array;
						for(var i = 0; i < this.sizeList.length; i++){
							list.push(this.sizeList[i].sizeID);
						}
						$selectSize.selectpicker('val', list);
					}
				},this));

				var $inputSt = $tr.find('input[name="stDate"]');
				clutil.datepicker($inputSt);
				$inputSt.datepicker('setIymd', this.stDate);
				var $inputEd = $tr.find('input[name="edDate"]');
				clutil.datepicker($inputEd);
				$inputEd.datepicker('setIymd', this.edDate);
				var $inputOrdStop = $tr.find('input[name="ordStopDate"]');
				clutil.datepicker($inputOrdStop);
				$inputOrdStop.datepicker('setIymd', this.ordStopDate);

				if(this.washableFlag != 0){
					$tr.find(".ca_washableFlag").attr("checked", true).closest("label").addClass("checked");
				}
				if (this.brandStyleID > 0){
					//IDがあるものはコード変更不可にする
					$inputCode.removeAttr('disabled');
					$inputCode.removeAttr('Enable');
					$inputCode.attr('disabled', true);
					$inputCode.attr('Enable', false);
				}
				/*
				 * 行削除
				 */
				$tbody.find("tr:last span.btn-delete").click(function(e) {
					var $tgt_tr = $(this).parent().parent();
					$tgt_tr.remove();
				});
			});
			clutil.initUIelement(this.$el);
			this._reNum($tbody);
		},
		//TODO
		_setData2StyleTableLadys:function($table, data, optClass){
			var $BrandID = this.$("#ca_brandID");
			var $tbody = $table.find("tbody");
			// 行削除
			$tbody.empty();
			$.each(data, function() {
				var tr = _.template($("#ca_tbody_template2").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);
				var $tr = $tbody.find('tr:last');	// 追加した行
				var $inputCode = $tr.find('input[name="styleCode"]');
				$inputCode.val(this.styleCode);
				var $inputName = $tr.find('input[name="styleName"]');
				$inputName.val(this.styleName);
				var $inputPrice = $tr.find('input[name="price"]');
				$inputPrice.val(clutil.comma(this.price));
				var $brandStyleID = $tr.find('input[name="brandStyleID"]');
				$brandStyleID.val(this.brandStyleID);
				var $selectSize = $tr.find('select[name="sizeID"]');
				clutil.clposizeselector({
					el:$selectSize,
					dependAttrs :{
						poBrandID: function() {
							return	$BrandID.autocomplete('clAutocompleteItem').id;
						},
						poBrandStyleID: function() {
							return 0;
						},
						delFlag : _delete_Flag,
						ladysStyleOptClassTypeID: optClass
					},
					nameOnly:true
				}).done(_.bind(function(){
					if(this.sizeList != null && this.sizeList.length > 0){
						var list = new Array;
						for(var i = 0; i < this.sizeList.length; i++){
							list.push(this.sizeList[i].sizeID);
						}
						$selectSize.selectpicker('val', list);
					}
				},this));
				if (this.brandStyleID > 0){
					//IDがあるものはコード変更不可にする
					$inputCode.removeAttr('disabled');
					$inputCode.removeAttr('Enable');
					$inputCode.attr('disabled', true);
					$inputCode.attr('Enable', false);
				}

				var $inputSt = $tr.find('input[name="stDate"]');
				clutil.datepicker($inputSt);
				$inputSt.datepicker('setIymd', this.stDate);
				var $inputEd = $tr.find('input[name="edDate"]');
				clutil.datepicker($inputEd);
				$inputEd.datepicker('setIymd', this.edDate);
				var $inputOrdStop = $tr.find('input[name="ordStopDate"]');
				clutil.datepicker($inputOrdStop);
				$inputOrdStop.datepicker('setIymd', this.ordStopDate);

				/*
				 * 行削除
				 */
				$tbody.find("tr:last span.btn-delete").click(function(e) {
					var $tgt_tr = $(this).parent().parent();
					$tgt_tr.remove();
				});
			});
			clutil.initUIelement(this.$el);
			this._reNum($tbody);
		},
		_setData2MakerTable:function($table, data){
			var $tbody = $table.find("tbody");
			// 行削除
			$tbody.empty();
			$.each(data, function() {
				var tr = _.template($("#ca_tbody_template3").html(), this);
				// 一旦行を追加する
				$tbody.append(tr);
				var $tr = $tbody.find('tr:last');	// 追加した行
				var $inputBaseAm = $tr.find('input[name="baseAm"]');
				$inputBaseAm.val(clutil.comma(this.baseAm));
				var $inputHinbanID = $tr.find('input[name="hinbanID"]');
				$inputHinbanID.val(this.hinbanID);
				var $inputTagCode = $tr.find('input[name="tagCode"]');
				$inputTagCode.val(this.tagCode);
				var $makerHinban = $tr.find('input[name="makerHinban"]');
				$makerHinban.val(this.makerHinban);

				if (this.hinbanID > 0){
					//IDがあるものはコード変更不可にする
					$makerHinban.removeAttr('disabled');
					$makerHinban.removeAttr('Enable');
					$makerHinban.attr('disabled', true);
					$makerHinban.attr('Enable', false);
				}
				/*
				 * 行削除
				 */
				$tbody.find("tr:last span.btn-delete").click(function(e) {
					var $tgt_tr = $(this).parent().parent();
					$tgt_tr.remove();
				});
			});
			clutil.initUIelement(this.$el);
			this._reNum($tbody);
		},
		/**
		 * テーブルクリア
		 */
		clearTable : function() {
			$("#ca_table_tbody0 tr").remove();
			$("#ca_table_tbody1 tr").remove();
			$("#ca_table_tbody2 tr").remove();
			$("#ca_table_tbody3 tr").remove();
			$("#ca_table_tbody4 tr").remove();
			$("#ca_table_tbody5 tr").remove();
			$("#ca_table_tbody6 tr").remove();
			$("#ca_table_tbody7 tr").remove();
			$("#ca_table_tbody8 tr").remove();
		},

		/**
		 * 新規作成時にデフォルト空欄表示(1行)
		 */
		makeDefaultTable: function(){
			this.clearTable();
			var $tbody = this.$("#ca_table_tbody0"),
			$tmpl = this.$("#ca_tbody_template0"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody1"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody2"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody3"),
			$tmpl = this.$("#ca_tbody_template1"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody4"),
			$tmpl = this.$("#ca_tbody_template2"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody5"),
			$tmpl = this.$("#ca_tbody_template2"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody6"),
			$tmpl = this.$("#ca_tbody_template2"),
			defArray = new Array;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody7"),
			$tmpl = this.$("#ca_tbody_template2"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			var $tbody = this.$("#ca_table_tbody8"),
			$tmpl = this.$("#ca_tbody_template3"),
			defArray = new Array;;
			$tmpl.tmpl(defArray).appendTo($tbody);

			clutil.initUIelement(this.$el);
			return this;
		},
		/**
		 * 行追加処理(tfoot)
		 */
		addRowStyleMens: function($table, optClass) {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $BrandID = this.$("#ca_brandID");
			var $tbody = $table.find("tbody");
			var $tmpl = $("#ca_tbody_template1");
			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
			var tr = _.template($("#ca_tbody_template1").html(), addObj);
			$tbody.append(tr);
			var $tr = $tbody.find('tr:last');	// 追加した行
			var $styleCode = $tr.find('input[name="styleCode"]');
			var $styleName = $tr.find('input[name="styleName"]');
			var $price = $tr.find('input[name="price"]');
			var $sizeID = $tr.find('select[name="sizeID"]');
			var $brandStyleID = $tr.find('input[name="brandStyleID"]');

			var $tr_last = $tbody.find('tr:last');
			//$tr内部にカレンダー部品をセットする。（この時点ですべて運用日）
			$tr_last.find('.cl_date').each(function(){
				var $this = $(this);
				clutil.datepicker($this);
			});
			// 適用開始日 運用日翌日
			$tr_last
			.find('input[name="stDate"]')
			.each(function(){
				var $this = $(this);
				$this.datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
			}).end();

			// 適用終了日 最大日付
			$tr_last.find('input[name="edDate"]')
			.each(function(){
				var $this = $(this);
				$this.datepicker('setIymd', clcom.max_date);
			}).end();

			// 発注停止日 空白
			$tr_last.find('input[name="ordStopDate"]')
			.each(function(){
				var $this = $(this);
				$this.datepicker('setIymd', -1);
			}).end();

			$styleCode.val("");
			$styleName.val("");
			$price.val("");
			$brandStyleID.val(0);
			clutil.clposizeselector({
				el:$sizeID,
				dependAttrs :{
					poBrandID: function() {
						return	$BrandID.autocomplete('clAutocompleteItem').id;
					},
					poBrandStyleID: function() {
						return 0;
					},
					ladysStyleOptClassTypeID: optClass
				},
				nameOnly:true
			});
			/*
			 * 行削除
			 */
			$tbody.find("tr:last span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			this._reNum($tbody);
			clutil.initUIelement(this.$el);
		},
		addRowStyleLady: function($table, optClass) {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $BrandID = this.$("#ca_brandID");
			var $tbody = $table.find("tbody");
			var $tmpl = $("#ca_tbody_template2");
			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
			var tr = _.template($("#ca_tbody_template2").html(), addObj);
			$tbody.append(tr);
			var $tr = $tbody.find('tr:last');	// 追加した行
			var $styleCode = $tr.find('input[name="styleCode"]');
			var $styleName = $tr.find('input[name="styleName"]');
			var $price = $tr.find('input[name="price"]');
			var $sizeID = $tr.find('select[name="sizeID"]');
			var $brandStyleID = $tr.find('input[name="brandStyleID"]');

			var $tr_last = $tbody.find('tr:last');
			//$tr内部にカレンダー部品をセットする。（この時点ですべて運用日）
			$tr_last.find('.cl_date').each(function(){
				var $this = $(this);
				clutil.datepicker($this);
			});
			// 適用開始日 運用日翌日
			$tr_last
			.find('input[name="stDate"]')
			.each(function(){
				var $this = $(this);
				$this.datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
			}).end();

			// 適用終了日 最大日付
			$tr_last.find('input[name="edDate"]')
			.each(function(){
				var $this = $(this);
				$this.datepicker('setIymd', clcom.max_date);
			}).end();

			// 発注停止日 空白
			$tr_last.find('input[name="ordStopDate"]')
			.each(function(){
				var $this = $(this);
				$this.datepicker('setIymd', -1);
			}).end();

			$styleCode.val("");
			$styleName.val("");
			$price.val("");
			$brandStyleID.val(0);
			clutil.clposizeselector({
				el:$sizeID,
				dependAttrs :{
					poBrandID: function() {
						return	$BrandID.autocomplete('clAutocompleteItem').id;
					},
					poBrandStyleID: function() {
						return 0;
					},
					ladysStyleOptClassTypeID: optClass
				},
				nameOnly:true
			});
			/*
			 * 行削除
			 */
			$tbody.find("tr:last span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			this._reNum($tbody);
			clutil.initUIelement(this.$el);
		},
		addRowMaker: function($table) {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
					this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				return;
			}
			var $tbody = $table.find("tbody");
			var $tmpl = $("#ca_tbody_template3");
			var addObj = {editable:true,canAdd:true,disChk:false,disEdit:false};
			var tr = _.template($("#ca_tbody_template3").html(), addObj);
			$tbody.append(tr);
			var $tr = $tbody.find('tr:last');	// 追加した行
			var $baseAm = $tr.find('input[name="baseAm"]');
			var $tagCode = $tr.find('input[name="tagCode"]');
			var $makerHinban = $tr.find('input[name="makerHinban"]');
			var $hinbanID = $tr.find('input[name="hinbanID"]');
			$baseAm.val("");
			$tagCode.val("");
			$makerHinban.val("");
			$hinbanID.val(0);
			/*
			 * 行削除
			 */
			$tbody.find("tr:last span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});

			clutil.initUIelement(this.$el);
		},
		/**
		 * 階層レベル振り直し
		 */
		_reNum : function($tbody){
			var $input = $tbody.find('input[name="seq"]');
			$input.each(function(i){
				$(this).val(i + 1);
			});
			return this;
		},
		/**
		 * 行削除処理
		 */
		addEvent: function() {
			/*
			 * 行削除
			 */
			$("#ca_table_tbody0 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody1 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody2 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody3 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody4 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody5 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody6 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody7 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
			$("#ca_table_tbody8 span.btn-delete").click(function(e) {
				var $tgt_tr = $(this).parent().parent();
				$tgt_tr.remove();
			});
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			this.validator.clear();

			//予約取消はないので基本全部こちらに来る
			// validation
			var noStyleDataflag = true;

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
//			var f_error0 = !this.validator.valid();
			var f_error0 = false;
			var f_error = false;

			var brand = clutil.view2data(this.$('#ca_base_form'));
			var option  = clutil.view2data(this.$('#ca_opt_form'));

			var styleList_SUIT	= clutil.tableview2data(this.$('#ca_table_tbody0').children("tr"));	//ジャケットメンズ
			var styleList_JACKET_M	= clutil.tableview2data(this.$('#ca_table_tbody1').children("tr"));	//ジャケットメンズ
			var styleList_SLACKS	= clutil.tableview2data(this.$('#ca_table_tbody2').children("tr"));	//スラックスメンズ
			var styleList_VEST_M	= clutil.tableview2data(this.$('#ca_table_tbody3').children("tr"));	//ベストメンズ
			var styleList_JACKET_W	= clutil.tableview2data(this.$('#ca_table_tbody4').children("tr"));	//ジャケットレディース
			var styleList_SKIRT		= clutil.tableview2data(this.$('#ca_table_tbody5').children("tr"));	//スカートレディース
			var styleList_PANTS		= clutil.tableview2data(this.$('#ca_table_tbody6').children("tr"));	//パンツレディース
			var styleList_VEST_W	= clutil.tableview2data(this.$('#ca_table_tbody7').children("tr"));	//ペストレディース
			var styleList_SHIRT		= clutil.tableview2data(this.$('#ca_table_tbody8').children("tr"));	//シャツ

			var styleList = new Array;
			var makerList = new Array;
			if(brand.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				//メンズスタイル
				this._tdata2packet(styleList, styleList_SUIT,		amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT);
				this._tdata2packet(styleList, styleList_JACKET_M,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET);
				this._tdata2packet(styleList, styleList_SLACKS,		amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS);
				this._tdata2packet(styleList, styleList_VEST_M,		amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST);
			}else if(brand.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				//レディーススタイル
				this._tdata2packet(styleList, styleList_JACKET_W,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET);
				this._tdata2packet(styleList, styleList_SKIRT,		amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT);
				this._tdata2packet(styleList, styleList_PANTS,		amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS);
				this._tdata2packet(styleList, styleList_VEST_W,		amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST);
			}else if(brand.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				//シャツはテーブルの構成が異なる点に注意
				$.each(styleList_SHIRT, function(i){
					var obj = {
							hinbanID	: this.hinbanID,
							makerHinban	: this.makerHinban,
							baseAm		: this.baseAm,
							tagCode		: this.tagCode,
					};
					makerList.push(obj);
				});
				noStyleDataflag = false;
			}else{
				//来ないけどどうするか？
			}

			//styleListの重複ちぇく
			chkMap = new Object();
			for(var i = 0; i < styleList.length; i++){
				var style =  styleList[i];
				if (style.sizeList == null || style.sizeList.length == 0){

				}else{
					noStyleDataflag = false;
				}
				if (style.washableFlag == null || style.washableFlag== 0){

				}else{
					noStyleDataflag = false;
				}
				if (style.styleCode == null || _.isEmpty(style.styleCode.trim())){
//					noStyleDataflag = false;
					//空白の場合は除く
					continue;
				}else{
					noStyleDataflag = false;
				}
				if(style.styleName == null || _.isEmpty(style.styleName.trim())){
					continue;
				}else{
					noStyleDataflag = false;
				}
				var key = style.styleCode.trim() + "_" + style.styleName.trim();
				if(chkMap[key]){
					//どこのテーブルかわからないが重複あり
					chkMap[key] += 1;
				}else{
					chkMap[key] = 1;
					noStyleDataflag = false;
				}
			}

			if(noStyleDataflag){
				f_error = true;
			}

			//テーブルまわりのの入力チェック
			if(brand.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				//空白、重複チェック
				if(this._styleTableCheck(this.$("#ca_table0"), chkMap) < 0){
					f_error = true;
				}
				if(this._styleTableCheck(this.$("#ca_table1"), chkMap) < 0){
					f_error = true;
				}
				if(this._styleTableCheck(this.$("#ca_table2"), chkMap) < 0){
					f_error = true;
				}
				if(this._styleTableCheck(this.$("#ca_table3"), chkMap) < 0){
					f_error = true;
				}

			}else if(brand.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				if(this._styleTableCheck(this.$("#ca_table4"), chkMap) < 0){
					f_error = true;
				}
				if(this._styleTableCheck(this.$("#ca_table5"), chkMap) < 0){
					f_error = true;
				}
				if(this._styleTableCheck(this.$("#ca_table6"), chkMap) < 0){
					f_error = true;
				}
				if(this._styleTableCheck(this.$("#ca_table7"), chkMap) < 0){
					f_error = true;
				}
			}else if(brand.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
			    var result  = clutil.tableview2ValidDataWithStat({
			        $tbody:  this.$("#ca_table8").find("tbody"),    // <tbody> の要素を指定する。
			        validator: this.validator,   // validator インスタンスを指定する。（どこのものでもかまわない）
			        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。
			        	if (
			        			//オートコンプリートのゴミデータに反応できない
								(item.makerHinban != null && item.makerHinban.trim().length != 0) ||
								(item.tagCode != null && item.tagCode.trim().length != 0) ||
								(item.baseAm != null && item.baseAm.trim().length != 0)
			        	) {
			        		return false;
			        	} else {
				            return true;
			        	}
			        }

			    });
				var use_line_cnt = result.items.length; //何行目まで有効かチェック
				var line_cnt = 0;
			    for (var i = 0; i < use_line_cnt; i++){
			    	if(result.stat[i] == "inval"){
			    		f_error = true;
			    	}
			    }
				var chkMapMaker = new Object();
//				for(var i = 0; i < styleList_SHIRT.length; i++){
				for(var i = 0; i < use_line_cnt; i++){
					var maker = styleList_SHIRT[i];
					// 空欄チェック
					if(_.isEmpty(maker.makerHinban)){
						this.validator.setErrorMsg(this.$("#ca_table_tbody8 tr:nth-child(" + (i + 1) + ") input[name='makerHinban']"), clmsg.cl_required);
						f_error = true;
						continue;
					}
					// 重複チェック
					if(chkMapMaker[maker.makerHinban]){
						if(_.isNumber(chkMapMaker[maker.makerHinban])){
							this.validator.setErrorMsg(this.$("#ca_table_tbody8 tr:nth-child(" + chkMapMaker[maker.makerHinban] + ") input[name='makerHinban']"), clutil.fmtargs(clmsg.EGM0009,[maker.makerHinban]));
							chkMapMaker[maker.makerHinban] = true;
						}
						this.validator.setErrorMsg(this.$("#ca_table_tbody8 tr:nth-child(" + (i + 1) + ") input[name='makerHinban']"), clutil.fmtargs(clmsg.EGM0009,[maker.makerHinban]));
						f_error = true;
						continue;
					}
					chkMapMaker[maker.makerHinban] = (i+1);
//					this.validator.clearErrorMsg(this.$("#ca_table_tbody8 tr:nth-child(" + (i + 1) + ") input[name='makerHinban']"));
				}
//				if(use_line_cnt == 0){
//					noStyleDataflag = true;;
//					f_error = true;
//				}
			}else{
			}
			try{
				this.mdBaseView.setAutoValidate(false);
				if(f_error0){
					// valid() -- NG
					clutil.setFocus(this.$el.find('.cl_error_field').first());
					return null;
				}
				if(f_error){
					// 独自チェック -- NG
					if(noStyleDataflag){
						clutil.mediator.trigger('onTicker',clmsg.EPO0013);
					}else{
						clutil.mediator.trigger('onTicker',clmsg.cl_echoback);
						clutil.setFocus(this.$el.find('.cl_error_field').first());
					}
					return null;
				}
			}finally{
				this.mdBaseView.setAutoValidate(true);
			}


			// listへhead情報の適応
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){

			}
			var styleList2 = new Array;
			var makerList2 = new Array;

			if(brand.poTypeID == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				for(var i = 0; i < styleList_SHIRT.length; i++){
					var maker = styleList_SHIRT[i];
		        	if (
		        			(maker.makerHinban == null || maker.makerHinban.trim().length == 0) &&
		        			(maker.tagCode == null || maker.tagCode.trim().length == 0) &&
							(maker.baseAm == null || maker.baseAm.trim().length == 0)
		        	) {
		        		continue;
		        	}
					var obj = {
							hinbanID	: maker.hinbanID,
							makerHinban	: maker.makerHinban,
							baseAm		: maker.baseAm,
							tagCode		: maker.tagCode,
					};
					makerList2.push(obj);
				}
			}else{
				for(var i = 0; i < styleList.length; i++){
					var style =  styleList[i];
		        	if (
		        			(style.styleCode == null || style.styleCode.trim().length == 0) &&
		        			(style.styleName == null || style.styleName.trim().length == 0) &&
							(style.price == null || style.price.trim().length == 0) &&
							($stDate.val() == null ||  $stDate.val() == "") &&
							($edDate.val() == null ||  $edDate.val() == "") &&
							($ordStopDate.val() == null || $ordStopDate.val() == "")
		        	) {
		        		continue;
		        	}

					var obj = {
							styleOptTypeID	: style.styleOptTypeID,
							brandStyleID	: style.brandStyleID,
							styleCode		: style.styleCode,
							styleName		: style.styleName,
							price			: style.price,
							stDate			: style.stDate,
							edDate			: style.edDate,
							ordStopDate		: style.ordStopDate,
							sizeList		: style.sizeList,
							washableFlag	: style.washableFlag
					};
					styleList2.push(obj);
				}
			}





			var brandOpt = {
					recno		: option.recno,
					state		: option.state,
					optGrpID	: option._view2data_optGrp_cn.id,
					optGrpCode	: option._view2data_optGrp_cn.code,
					optGrpName	: option._view2data_optGrp_cn.name,
			};
			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			var updReq = {
					brand  : brand,
					brandOption  : brandOpt,
					brandStyleList  : styleList2,
					makerCodeList  : makerList2
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}
			var reqObj = {
					reqHead : reqHead,
					AMPOV0070UpdReq  : updReq
			};
//			return;
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},
		//スタイルのテーブルは複数あるが同一パケットのため、まとめるための関数
		//packetgList パケットの配列
		//tdata それぞれのテーブルをtableview2data処理したデータ。
		//type	区分値(テーブルごとの値)
		_tdata2packet: function(packetgList, tdata, type){
			$.each(tdata, function(i){
				var list = new Array;
				if(this.sizeID != null && this.sizeID.length > 0){
					for(var i = 0; i < this.sizeID.length; i++){
						var id = this.sizeID[i];
						var obj = {
								sizeID		: id,
								sizeCode	: "",
								sizeName	: "",
						};
						list.push(obj);
					}
				}
				var obj = {
						styleOptTypeID	: type,
						brandStyleID	: this.brandStyleID,
						styleCode		: this.styleCode,
						styleName		: this.styleName,
						price			: this.price,
						stDate			: this.stDate,
						edDate			: this.edDate,
						ordStopDate		: this.ordStopDate,
						sizeList		: list,
						washableFlag	: ((this.washableFlag == undefined || this.washableFlag == null)? 0:this.washableFlag),
				};
				packetgList.push(obj);
			});
		},


		// 有効行チェック
		_styleTableCheck: function($table, chkMap){
			var f_error = 0;
			var _this = this;

		    var result  = clutil.tableview2ValidDataWithStat({
		        $tbody:  $table.find("tbody"),    // <tbody> の要素を指定する。
		        validator: this.validator,   // validator インスタンスを指定する。（どこのものでもかまわない）
		        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。
		        	if (
		        			//オートコンプリートのゴミデータに反応できない
							(item.styleCode != null && item.styleCode.trim().length != 0) ||
							(item.styleName != null && item.styleName.trim().length != 0) ||
							(item.price != null && item.price.trim().length != 0) ||
							(item.stDate != null &&  item.stDate != "") ||
							(item.edDate != null &&  item.edDate != "") ||
							(item.ordStopDate != null &&  item.ordStopDate != "") ||
							(item.sizeID != null && item.sizeID.length > 0) ||
							(item.washableFlag != null && item.washableFlag >= 1)
		        	) {
		        		return false;
		        	} else {
			            return true;
		        	}
		        }

		    });
			var use_line_cnt = result.items.length; //何行目まで有効かチェック
			var line_cnt = 0;
		    for (var i = 0; i < use_line_cnt; i++){
		    	if(result.stat[i] == "inval"){
		    		f_error = -1;
		    	}
		    }
			var $tbody = $table.find("tbody");
			$tbody.find('tr').each(function(e){
				if(use_line_cnt == 0){
					;
				}else if(line_cnt >= use_line_cnt){
					;
				}else{
					line_cnt++;
					var $styleCode	= $(this).find('input[name="styleCode"]');
					var $styleName	= $(this).find('input[name="styleName"]');
					var $price		= $(this).find('input[name="price"]');
					var $stDate		= $(this).find('input[name="stDate"]');
					var $edDate		= $(this).find('input[name="edDate"]');
					var $ordStopDate = $(this).find('input[name="ordStopDate"]');
//					_this.validator.clearErrorMsg($styleCode);
//					_this.validator.clearErrorMsg($styleName);
//					_this.validator.clearErrorMsg($price);
					if($styleCode.val() == null ||  _.isEmpty($styleCode.val().trim())){
						// スタイル品番が空白
						_this.validator.setErrorMsg($styleCode, clutil.fmtargs(clmsg.cl_its_required, ["スタイル品番"]));
						f_error = -1;
						if($styleName.val() == null ||  _.isEmpty($styleName.val().trim())){
							_this.validator.setErrorMsg($styleName, clmsg.EPO0006);
							f_error = -1;
						}
						if($price.val() == null ||  _.isEmpty($price.val().trim())){
							_this.validator.setErrorMsg($price, clmsg.EPO0007);
							f_error = -1;
						}
						if($stDate.val() == null ||  $stDate.val() == ""){
							_this.validator.setErrorMsg($stDate, clmsg.cl_required);
							f_error = -1;
						}
						if($edDate.val() == null ||  $edDate.val() == ""){
							_this.validator.setErrorMsg($edDate, clmsg.cl_required);
							f_error = -1;
						}
					}else{
						if($styleName.val() == null ||  _.isEmpty($styleName.val().trim())){
							_this.validator.setErrorMsg($styleName, clmsg.EPO0006);
							f_error = -1;
						}else{
							var key = $styleCode.val().trim() + "_" + $styleName.val().trim();
							if(chkMap[key] > 1){
								// chkMapには全リスト情報が入っているので2以上の場合重複とみなせる。1は自分自身なのでスルー
								_this.validator.setErrorMsg($styleCode, clutil.fmtargs(clmsg.EMS0065, ["スタイル名[" + $styleName.val().trim() +  "],スタイル品番[" + $styleCode.val().trim() + "]"]));
								_this.validator.setErrorMsg($styleName, clutil.fmtargs(clmsg.EMS0065, ["スタイル名[" + $styleName.val().trim() +  "],スタイル品番[" + $styleCode.val().trim() + "]"]));
								f_error = -1;
							}
						}
						if($price.val() == null ||  _.isEmpty($price.val().trim())){
							_this.validator.setErrorMsg($price, clmsg.EPO0007);
							f_error = -1;
						}
						if($stDate.val() == null ||  $stDate.val() == ""){
							_this.validator.setErrorMsg($stDate, clmsg.cl_required);
							f_error = -1;
						}
						if($edDate.val() == null ||  $edDate.val() == ""){
							_this.validator.setErrorMsg($edDate, clmsg.cl_required);
							f_error = -1;
						}
					}

					stDate = clutil.dateFormat($stDate.val(), "yyyymmdd");
					edDate = clutil.dateFormat($edDate.val(), "yyyymmdd");
					orgStopDate = clutil.dateFormat($ordStopDate.val(), "yyyymmdd");


					if (stDate > edDate){
						f_error = -1;
						_this.validator.setErrorMsg( $stDate, clmsg.cl_date_error);
						_this.validator.setErrorMsg( $edDate, clmsg.cl_date_error);
					}
					if(orgStopDate > 0){
						if (orgStopDate > edDate){
							f_error = -1;
							_this.validator.setErrorMsg( $ordStopDate, clmsg.EPO0051);
						}
						//登録時のみ発注停止日と運用日をチェック
						if (_this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
								|| _this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
						   /*** 20151104 MT-0902 発注停止日と運用日のチェックはしない
							if (clutil.addDate(clcom.getOpeDate(), 1) > orgStopDate){
								f_error = -1;
								_this.validator.setErrorMsg( $ordStopDate, clmsg.EPO0050);
							}
						   ***/
						}
						if (stDate > orgStopDate){
							f_error = -1;
							_this.validator.setErrorMsg( $ordStopDate, clmsg.EPO0053);
						}
					}
				}
			});
			return f_error;

		},
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			_delete_Flag = this.options.chkData[pgIndex].delFlag;
			var getReq = {
					// 共通ヘッダ

					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					// 取引先マスタ検索リクエスト
					AMPOV0070GetReq: {
						srchBrandID: this.options.chkData[pgIndex].id,			// 取引先ID
						delFlag : this.options.chkData[pgIndex].delFlag
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMPOV0070UpdReq: {
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
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
//			var rec = data.AMPOV0070GetRsp;
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
