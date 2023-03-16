$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));



	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		events: {
			"click .ca_btn_store"	: "_onStoreSelClick",			// 店舗選択補助画面起動
//			"blur .ca_tagChk"	: "_onTagChkBlur",					//タグコードから商品名等を検索
			'change input[name="tagCode"]'	: "_onTagChkChange",					//タグコードが変更された場合
			"change input[name='ca_transInOutTypeID']:radio" : "_onSlipTypeChange",		//伝票種別変更

//			"_onTagChkChangeclick #ca_table .btn-delete" : "_onDeleteLineClick",	//×押下
			"click #ca_table .btn-delete" : "_onDeleteLineClick",	//×押下
			"click #ca_addRow" : "_onAddLineClick"					//＋押下
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
			this.f_readOnly = false;	//閲覧モード判定


			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '移動伝票',
					//subtitle: '登録・修正',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,

					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,

					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,

					// 空更新チェック用データを作る関数。
					// UIから集めてきた更新データが GET してきた直後の内容と同一かどうかをチェックするための
					// GET直後データを加工する関数。GET 直後に変更するプロパティは空更新チェックの比較対象外
					// にあたるため、比較対象外プロパティを除去するために使用する。
					 buildSubmitCheckDataFunction: this._buildSubmitCheckDataFunction

				};
				return mdOpt;
			},this)(fixopt);
			this.opeTypeId = fixopt.opeTypeId;
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			this.validator = clutil.validator($('#ca_search'), {
				echoback		: $('.cl_echoback').hide()
			});

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				//必須設定
				$(".ca_outStoreCell").addClass("cl_required");
				$(".ca_inStoreCell").addClass("cl_required");

				//入荷伝票入力禁止処理
				clutil.inputReadonly($(".ca_inRadio"));

				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);

				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				//必須設定
				$(".ca_outStoreCell").addClass("cl_required");
				$(".ca_inStoreCell").addClass("cl_required");

				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// 新規登録以外は、Submit と、GET結果のデータを購読する。
                clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
                clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}
			this.opeTypeId = fixopt.opeTypeId;	// 処理区分を保存
			this.copy_flag = false;				// 入荷数を出荷数にコピーしたか判定

			//var unit = clcom.getUserData().unit_id;
			var unit = null;

			//店舗オートコンプ
			this.srcOutStoreIdField = clutil.clorgcode({
				el: $("#ca_outStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					f_stockmng: 1	//在庫有無フラグ(1:在庫有り店舗のみ)
				}
			});
			this.srcInStoreIdField = clutil.clorgcode({
				el: $("#ca_inStoreID"),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					f_stockmng: 1	//在庫有無フラグ(1:在庫有り店舗のみ)
				}
			});

			//フィールドカウント
			clutil.cltxtFieldLimit($("#ca_comment"));
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			//サブ画面配置
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector.render();

			// カレンダー
			clutil.datepicker(this.$('#ca_outDate'));
			clutil.datepicker(this.$('#ca_inDate'));

			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				// 入荷日は入れない
				$("#ca_inStoreDayArea").removeClass("required");
				$("#ca_inDate").removeClass("cl_required");
				clutil.viewReadonly($("#ca_inStoreDayArea"));
			}
			return this;
		},


		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				//新規で遷移した場合
				for(var i=0; i<5; i++){
					this._onAddLineClick();
				}
			}
			else{
				//新規以外の場合
				this.mdBaseView.fetch();	// データを GET してくる。
				this._reNum();
			}
			return this;
		},


		/**
		 * 出荷/入荷切り替え
		 */
		_onSlipTypeChange: function(new_flag){
			if(this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				return;
			}
			if (this.noRadioEvent) {
				this.noRadioEvent = false;
				return;
			}

			//閲覧モードの場合はリードオンリー切替なし
			var view_flag = false;
			var inDataID = this.inSerchData.transID;
			var outDataID = this.outSerchData.transID;


			if(this.f_readOnly == true){
				if(inDataID == 0 || outDataID == 0){
					//入荷・出荷一方のデータしかなかった場合はもどる
					return;
				}
				view_flag = true;
			}

			//ラジオボタン選択値を取る
			var radio = $("input:radio[name=ca_transInOutTypeID]:checked");
			var selBtn = radio.val();


			if(selBtn == '1'){
				$("input[name='ca_transInOutTypeID'][value='1']").radio('check');
				var serchData = this.outSerchData;
				var tblData = this.outTblData;
				serchData.transInOutTypeID = 1;

				if(new_flag != true){
//					for(var i=0; i<tblData.length; i++){
//						for(var j=0; j<this.inTblData.length; j++){
//							if(tblData[i].itemID == this.inTblData[j].itemID){
//								tblData[i].inQy = this.inTblData[j].inQy;
//							}
//						}
//					}
					this.makeData(serchData);
					this.makeTable(tblData, this.copy_flag);
				}

				if(view_flag != true){
					clutil.viewReadonly($(".ca_inStoreArea"));
					clutil.viewRemoveReadonly($(".ca_outStoreArea"));

					$(".ca_outStoreCell").addClass("cl_required");
					$(".ca_inStoreCell").removeClass("cl_required");

					$(".ca_outStoreArea").addClass("required");
					$(".ca_inStoreArea").removeClass("required");

					$(".ca_outQy").addClass("cl_required");
					$(".ca_inQy").removeClass("cl_required");
				}
				else{
					//画面下部
					clutil.viewReadonly($("#ca_tblArea"));
					//テーブル削除、追加ボタン非表示
					$("#ca_addRow").hide();
					$(".ca_delBtn").hide();
				}
			}
			else{
				$("input[name='ca_transInOutTypeID'][value='2']").radio('check');
				var serchData = this.inSerchData;
				var tblData = this.inTblData;

				serchData.transInOutTypeID = '2';

				if(new_flag != true){
					for(var i=0; i<tblData.length; i++){
						if(this.inID_flag == true){
							//入荷伝票がある場合は入荷伝票を出す
							for(var j=0; j<this.outTblData.length; j++){
								if(tblData[i].itemID == this.outTblData[j].itemID){
									tblData[i].outQy = this.outTblData[j].outQy;
								}
							}
						}
						else{
							//入荷伝票がない場合は出荷数コピー
							tblData[i].inQy = tblData[i].outQy;
							this.copy_flag = true;
						}
					}
					//出荷数切替をさせないためにフラグリセット
					//this.inID_flag = true;

					this.makeData(serchData);
					this.makeTable(tblData, this.copy_flag);
				}

				if(view_flag != true){
					clutil.viewRemoveReadonly($(".ca_inStoreArea"));
					clutil.viewReadonly($(".ca_outStoreArea"));

					$(".ca_outStoreCell").removeClass("cl_required");
					$(".ca_inStoreCell").addClass("cl_required");

					$(".ca_outStoreArea").removeClass("required");
					$(".ca_inStoreArea").addClass("required");

					$(".ca_outQy").removeClass("cl_required");
					$(".ca_inQy").addClass("cl_required");
				}
				else{
					//画面下部
					clutil.viewReadonly($("#ca_tblArea"));
					//テーブル削除、追加ボタン非表示
					$("#ca_addRow").hide();
					$(".ca_delBtn").hide();
				}
			}
			this.validator.clear();

			this._reNum();
		},

		/**
		 * タグコードから商品名等を検索
		 */
		_onTagChkBlur: function(e){
			//リードオンリーなら戻る
			if($(e.target).attr('readonly') == "readonly" || $(e.target).val() == ""){
				return;
			}

			// クリックされた行を編集モード化
			var tr = $(e.target).closest("tr");
			$(tr).addClass("ca_edit");

			//押下行の情報からタグコード取得
			var inputData = clutil.tableview2data($(".ca_edit"));
			var tag = inputData[0].tagCode;

			//検索用関数に品番を渡す
			clutil.cltag2variety(tag, e);
			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLtag2varietyCompleted', this._onCLtag2varietyCompleted);
		},

		_onTagChkChange: function(e){
			//リードオンリーなら戻る
			if($(e.target).attr('readonly') == "readonly" || $(e.target).val() == ""){
				return;
			}
			// クリックされた行を編集モード化
			var tr = $(e.target).closest("tr");
			$(tr).addClass("ca_edit");

			//押下行の情報からタグコード取得
			var inputData = clutil.tableview2data($(".ca_edit"));
			var tag = inputData[0].tagCode;

			//検索用関数に品番を渡す
			clutil.cltag2variety(tag, e);
			// メーカー品番変更完了イベント
			clutil.mediator.on('onCLtag2varietyCompleted', this._onCLtag2varietyCompleted);
		},


		/**
		 * タグコード→商品取得完了イベント
		 * @param data
		 * @param e
		 */
		_onCLtag2varietyCompleted: function(data, e) {
			if(data.status == "NG"){
				//タグコードがなければ戻る
				this.validator.setErrorMsg($(e.target), clmsg.EGM0026);
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});

				$(".ca_edit").find(".ca_itgrpCodeCell").html("");							//品種
				$(".ca_edit").find(".ca_itemNameCell").html("");			//商品名
				$(".ca_edit").find("input:last").val("");	//カラーサイズ商品ID
			}
			else{
				var variety = data.data.rec.varietyCode + ":" + data.data.rec.varietyName;

				$(".ca_edit").find(".ca_itgrpCodeCell").html(variety);							//品種
				$(".ca_edit").find(".ca_itemNameCell").html(data.data.rec.itemName);			//商品名
				$(".ca_edit").find("input[name='ca_itemID']").val(data.data.rec.colorSizeItemID);	//カラーサイズ商品ID
			}

			//行の編集モード終了
			$(".ca_edit").removeClass("ca_edit");
		},


		/**
		 * 編集不可化
		 */
		readOnly: function(){
			//画面上部
			clutil.viewReadonly($("#ca_unCngArea"));

			//画面下部
			clutil.viewReadonly($("#ca_tblArea"));
			//テーブル削除、追加ボタン非表示
			$("#ca_addRow").hide();
			$(".ca_delBtn").hide();

			//TODO:伝票番号検討(回避策)
			clutil.setFocus($('#ca_slipNo'));
			$('#ca_slipNo').blur();

			//ラジオボタン出し直し
			clutil.initUIelement($('#ca_search'));
		},

		/**
		 * 編集可化
		 */
		removereadOnly: function(){
			//画面上部
			clutil.viewRemoveReadonly($("#ca_unCngArea"));


			//画面下部
			clutil.viewRemoveReadonly($("#ca_tblArea"));
			//テーブル削除、追加ボタン非表示
			$("#ca_addRow").show();
			$(".ca_delBtn").show();

			//伝票番号欄・テーブルnoのみreadOnly
			clutil.viewReadonly($("#ca_slipNoArea"));
			clutil.viewReadonly($(".ca_noArea"));
			clutil.setFocus($('#ca_outStoreID'));

			//ラジオボタン出し直し
			clutil.initUIelement($('#ca_search'));
		},



		/**
		 * 店舗参照押下
		 */
		_onStoreSelClick: function(e) {
			var _this = this;
			var unit = null;

			_this.AMPAV0010Selector.show(null, null,{
				org_id: unit,
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),		//基本組織を対象
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
				               am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
				f_stockmng: 1	//在庫有無フラグ(1:在庫有り店舗のみ)
			});

			var store_type = $(e.target).attr('store_type');

			// 選択サブ画面復帰処理
			_this.AMPAV0010Selector.okProc = function(data) {

				if (data !== null && data.length == 1) {
					var d = {
							id: data[0].val,
							code: data[0].code,
							name: data[0].name
						};
					if(store_type == "out"){
						_this.srcOutStoreIdField.setValue(d);
					}
					else{
						_this.srcInStoreIdField.setValue(d);
					}
				}
				_.defer(function(){// setFocusを_.defer()で後回しにする
					$(e.target).focus();
				});
			};
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			//ラジオボタン操作禁止
			clutil.inputReadonly($(".ca_inRadio"));
			clutil.inputReadonly($(".ca_outRadio"));

			switch(args.status){
			case 'DONE':		// 確定済
				// TODO: args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.f_readOnly = true;
				this.readOnly();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// TODO: args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.f_readOnly = true;
				this.readOnly();
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> を readonly 化するなどの処理。
				this.f_readOnly = true;
				this.readOnly();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				var rspHead = args.data.rspHead;
				if (rspHead.message == "ETR0031") {
					clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
					// エラーダイアログを表示
					var msg = clutil.fmtargs(clutil.getclmsg(rspHead.message), rspHead.args);
					clutil.ErrorDialog(msg);
				}
				if (rspHead.message == "ETR0032") {
					var msg = clutil.fmtargs(clutil.getclmsg(rspHead.message), rspHead.args);
				}
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			var data = args.data;
			var getRsp = data.AMTRV0050GetRsp;

			//ラジオボタン操作禁止解除
			clutil.inputRemoveReadonly($(".ca_inRadio"));
			clutil.inputRemoveReadonly($(".ca_outRadio"));

			//出荷、入荷データを設定
			this.outSerchData = getRsp.transOut;
			this.outTblData = getRsp.outDtlList;
			this.inSerchData = getRsp.transIn;
			this.inTblData = getRsp.inDtlList;

			if(this.inSerchData.transID == 0){
				//入荷伝票IDがなければ、出荷伝票情報コピー
				this.inSerchData.comment = this.outSerchData.comment;
				this.inSerchData.inDate = this.outSerchData.inDate;
				this.inSerchData.inStoreCode = this.outSerchData.inStoreCode;
				this.inSerchData.inStoreID = this.outSerchData.inStoreID;
				this.inSerchData.inStoreName = this.outSerchData.inStoreName;
				this.inSerchData.outDate = this.outSerchData.outDate;
				this.inSerchData.outStoreCode = this.outSerchData.outStoreCode;
				this.inSerchData.outStoreID = this.outSerchData.outStoreID;
				this.inSerchData.outStoreName = this.outSerchData.outStoreName;
				this.inSerchData.slipNo = this.outSerchData.slipNo;

				//ID等は初期化リセット
				this.inSerchData.firstID = 0;
				this.inSerchData.recno = "";
				this.inSerchData.state = 0;
				this.inSerchData.transID = 0;

				this.inTblData = getRsp.outDtlList;

				if(this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						|| this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL){
					clutil.inputReadonly($(".ca_inRadio"));
				}
			}

			this.outSerchData.transInOutTypeID = "1";
			this.inSerchData.transInOutTypeID = "2";

			if(this.outSerchData.transID == 0){
				//出荷伝票IDがなければ入荷を表示
				serchData = this.inSerchData;
				tblData = this.inTblData;
				this.noRadioEvent = true;
				$("input[name='ca_transInOutTypeID'][value='2']").radio('check');
				clutil.inputReadonly($(".ca_outRadio"));
			}
			else{
				serchData = this.outSerchData;
				tblData = this.outTblData;


				if(this.inSerchData.transID == 0){
					serchData.inDate = 0;
				}
				else{
					serchData.inDate = this.inSerchData.inDate;
				}
			}

			if(this.inSerchData.transID == 0){
				//入荷伝票がない場合
				this.inID_flag = false;
			}
			else{
				this.inID_flag = true;
			}

			// 入出荷のアイテム数が違う場合の切替対応
//			if(this.outSerchData.transID != 0){
//				for(var i=0; i<tblData.length; i++){
//					for(var j=0; j<this.inTblData.length; j++){
//						if(tblData[i].itemID == this.inTblData[j].itemID){
//							tblData[i].inQy = this.inTblData[j].inQy;
//						}
//					}
//				}
//			}



			this.makeData(serchData);
			this.makeTable(tblData);

			switch(args.status){
			case 'OK':

				//起動モードで分岐
				switch (this.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					this.f_readOnly = false;
					//this._onSlipTypeChange(true);
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
					//編集禁止
					this.f_readOnly = true;
					break;
				default:
					//なんか
					break;
				}
				break;
			case 'DONE':		// 確定済
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.f_readOnly = true;
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// XXX 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				this.f_readOnly = true;
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// TODO: args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.f_readOnly = true;
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.f_readOnly = true;
				break;
			}

			clutil.cltxtFieldLimit($("#ca_comment"));

			if(this.f_readOnly == true){
				this.readOnly();
			}
			else{
				this.removereadOnly();
				this._onSlipTypeChange(true);
			}


			this._reNum();
		},


		/**
		 * 検索条件描画
		 */
		makeData: function(serchData) {
			//テキストボックス系反映
			clutil.data2view($('#ca_search'), serchData);

			//摘要反映
			clutil.data2view($('#ca_commentArea'), serchData);
			clutil.initUIelement($('#ca_tblArea'));

			//店舗対応
			var outData = {
					id: serchData.outStoreID,
					code: serchData.outStoreCode,
					name: serchData.outStoreName,
			};
			var inData = {
					id: serchData.inStoreID,
					code: serchData.inStoreCode,
					name: serchData.inStoreName,
			};

			this.srcOutStoreIdField.setValue(outData);
			this.srcInStoreIdField.setValue(inData);
		},

		/**
		 * テーブル描画
		 * @param list
		 */
		makeTable: function(list, flag) {
			//テーブル初期化
			var $tbody = $("#ca_table_tbody");
			$tbody.empty();
			var _this = this;

			$.each(list, function() {
				// 一旦行を追加する
				var $tbody = $("#ca_table_tbody");
				var $tmpl = $("#ca_tbody_template");
				$tmpl.tmpl({}).appendTo($tbody);

				// 追加した行定義
				var $tr = $tbody.find('tr:last');

				$tr.find(".ca_tagCodeCell").val(this.tagCode);				//タグコード
				if((this.itgrpCode.length != 0) && (this.itgrpName.length != 0)){
					var itgrp = this.itgrpCode + ":" + this.itgrpName;
					$tr.find(".ca_itgrpCodeCell").html(itgrp);		//品種
				}

				$tr.find(".ca_itemNameCell").html(this.itemName);			//商品名

				//出荷数
				var $outQy = $tr.find(".ca_outQy");
				if((_this.outSerchData.transID == 0) && (flag != true)){
					$outQy.val("");
				}
				else{
//					if (_this.isDelete()) {
//						$outQy.data('validator', null);
//					}
					if (this.outQy < 0) {
						$outQy.val(0);
					} else {
						$outQy.val(this.outQy);
					}
				}

				//入荷数
				var $inQy = $tr.find(".ca_inQy");
				if((_this.inSerchData.transID == 0) && (flag != true)){
					$inQy.val("");
				}
				else{
//					if (_this.isDelete()) {
//						$inQy.data('validator', null);
//					}
					if (this.inQy < 0) {
						$inQy.val(0);
					} else {
						$inQy.val(this.inQy);
					}
				}
				$tr.find(".ca_itemIDCell").val(this.itemID);				//商品ID
				$tr.find(".ca_scmLineNoCell").val(this.scmLineNo);			// 梱包行番号
			});
			clutil.initUIelement(this.$('#ca_table'));
		},

		/**
		 * 行追加処理
		 */
		_onAddLineClick : function(e) {
			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				return;
			}
			var $tbody = this.$("#ca_table_tbody");
			var $tmpl = $("#ca_tbody_template");
			$tmpl.tmpl({}).appendTo($tbody);

			if(this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				clutil.viewReadonly($(".ca_inQyCell"));
			}
			else{
				this._onSlipTypeChange(true);
			}
			this._reNum();
		},


		/**
		 * 行削除処理
		 */
		_onDeleteLineClick : function(e) {
			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				return;
			}
			$(e.target).parent().parent().remove();
			this._reNum();
		},

		/**
		 * 階層レベル振り直し
		 */
		_reNum : function(){
			var $input = this.$("#ca_table_tbody").find('input[name="no"]');
			$input.each(function(i){
				$(this).val(i + 1);
			});
			return this;
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			var chkData = this.options.chkData[pgIndex];

			var in_id = 0, out_id = 0;
			var out_store_id = 0, in_store_id = 0;

			if(chkData.id != 0){
				out_id = chkData.id;
				in_id = chkData.transInID;
				out_store_id = chkData.outStoreID;
				in_store_id = chkData.inStoreID;
				type = amcm_type.AMCM_VAL_TRANS_TYPE_SHIP;
			}
			else{
				in_id = chkData.transInID;
				out_store_id = chkData.outStoreID;
				in_store_id = chkData.inStoreID;
				type = amcm_type.AMCM_VAL_TRANS_TYPE_TMP_RCV;
			}
			this.statRegistration = chkData.statRegistration;	// 状態を保存

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ		・・・これ、必要なの？					【確認】
				reqPage: {
				},
				// 検索リクエスト
				AMTRV0050GetReq: {
					transInID: in_id,		// 移動入荷伝票ID
					transOutID: out_id,		// 移動出荷伝票ID
					transInStoreID: in_store_id,	// 移動入荷店舗ID
					transOutStoreID: out_store_id,	// 移動出荷店舗ID
					transInOutTypeID: type	// 移動入出荷区分
				},
				// 更新リクエスト -- 今は検索するので、空を設定
				AMTRV0050UpdReq: {

				}
			};

			return {
				resId: clcom.pageId,	//'AMTRV0050',
				data: getReq
			};
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(opeTypeId){
			var retStat = true;
			// 日付エラー確認
			if(!this.validator.valid()){
				retStat = false;
			}

			var comment = $("#ca_comment").val();
			if(comment.length > 100){
				//コメント文字数が制限を超えていた場合
				this.validator.setErrorMsg($("#ca_comment"), clutil.fmtargs(clmsg.cl_maxlen, ["100"]));
				retStat = false;
			}

			var inDate = $("#ca_inDate").val();
			var outDate = $("#ca_outDate").val();

			// 反転エラー確認
			if((inDate != "") && (outDate > inDate)){
				this.validator.setErrorMsg($("#ca_inDate"), clmsg.ETR0008);
				this.validator.setErrorMsg($("#ca_outDate"), clmsg.ETR0008);
				retStat = false;
			}
			if (opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				if (!this.checkDate(clutil.dateFormat(outDate, 'yyyymmdd'))) {
					this.validator.setErrorMsg($("#ca_outDate"), "前月以前の出荷日は入力できません。");
					retStat = false;
				}
				if (inDate != "" && !this.checkDate(clutil.dateFormat(inDate, 'yyyymmdd'))) {
					this.validator.setErrorMsg($("#ca_inDate"), "前月以前の入荷日は入力できません。");
					retStat = false;
				}
			}

			// 入出荷店舗が同じ
			if($("#ca_inStoreID").val() == $("#ca_outStoreID").val()){
				if($("#ca_inStoreID").val() != ""){
					this.validator.setErrorMsg($("#ca_inStoreID"), clmsg.ETR0007);
					this.validator.setErrorMsg($("#ca_outStoreID"), clmsg.ETR0007);
				}
				retStat = false;
			}

			if (!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return retStat;
			}

			// テーブル領域エラーチェック
			// テーブルデータを取りながら、行末空欄スキップと、入力チェックを行う。
		    var items = clutil.tableview2ValidData({
		        $tbody: this.$('#ca_table > tbody'),    // <tbody> の要素を指定する。
		        validator: this.validator,   // validator インスタンスを指定する。（どこのものでもかまわない）
		        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。//ラジオボタン選択値をとる
					var radio = $("input:radio[name=ca_transInOutTypeID]:checked");
					var selBtn = radio.val();
					var qy = null;

					if(selBtn == '1'){
						qy = item.outQy;
					}
					else{
						qy = item.inQy;
					}
		            return _.isEmpty(item.tagCode || item.itemID || qy);
		        }
		    });
		    if(_.isEmpty(items)){
		        // 全部空欄行だったとか・・・
		        clutil.mediator.trigger('onTicker',clutil.fmtargs(clmsg.EMS0007, ["1"]));
		        retStat = false;
		    }

		    var selList = clutil.tableview2data($("#ca_table_tbody tr"));
			for(var i=0; i<selList.length; i++){
				selList[i].lineNo = i+1;
				if(selList[i].tagCode != ""){
					if(selList[i].itemID == ""){
						//不正なタグコードの場合
						row = selList[i].lineNo;
						$tgt = $("tr").eq(row).find(".ca_tagCodeCell");
						this.validator.setErrorMsg($tgt, clmsg.EGM0026);

						//ヘッダエラー表示
						this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
						retStat = false;
					}
					if(selList[i].inQy != ""){
						var num = Number(selList[i].inQy.replace(",",""));

						if((num >= 0) && (num < 1000000) && selList[i].inQy.match(/^[0-9]+$/)){
							//0以上の整数ならOK
						}
						else{
							this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
							retStat = false;
						}
					}
					if(selList[i].outQy != ""){
						var num = Number(selList[i].outQy.replace(",",""));

						if((num >= 0) && (num < 1000000) && selList[i].outQy.match(/^[0-9]+$/)){
							//0以上の整数ならOK
						}
						else{
							this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
							retStat = false;
						}
					}
				}
			}

			return retStat;
		},

		/**
		 * 初期フォーカス
		 */
		setFocus:function(){
			clutil.setFocus($('#ca_outStoreID'));
		},

		checkDate: function(tgtYmd) {
			var minYm = Math.floor(clcom.getOpeDate() / 100);
			var tgtYm = Math.floor(tgtYmd / 100);

			return tgtYm >= minYm;
		},

		/**
		 * 更新系のリクエストを作る
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			var _this = this;
			var f_error = false;

			//エラーチェック
			if(this.isValid(opeTypeId) == false){
				return;
			}

			if (f_error) {
				return;
			}

			//エラーリセット
			_this.validator.clearErrorMsg($('#ca_comment'));

			// 依頼条件、テーブル内容取得
			var trans = clutil.view2data($("#ca_search"));
			trans.comment = $("#ca_comment").val();

			var selList = clutil.tableview2data($("#ca_table_tbody tr"));
			var dtlList = [];

			for(var i=0; i<selList.length; i++){
				selList[i].lineNo = i+1;
				if(selList[i].tagCode != ""){
					dtlList.push(selList[i]);
				}
			}

			//ラジオボタン選択値をとる
			var radio = $("input:radio[name=ca_transInOutTypeID]:checked");
			var selBtn = radio.val();
			var outData, outTbl, inData, inTbl = {};

			if(selBtn == '1'){
				trans.inDate = Number(trans.outDate);
				outData = trans;
				outTbl = dtlList;
				inData = this.inSerchData;
				inTbl = this.inTblData;
			}
			else{
				outData = this.outSerchData;
				outTbl = this.outTblData;
				inData = trans;
				inTbl = dtlList;
			}


			var updReq = {
					// 共通ヘッダ
					reqHead: {
						opeTypeId: opeTypeId
					},
					// 共通ページヘッダ
					reqPage: {
					},
					// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
					AMTRV0050GetReq: {
					},
					// 商品分類マスタ更新リクエスト
					AMTRV0050UpdReq: {
						transOut: outData,
						outDtlList: outTbl,
						transIn: inData,
						inDtlList: inTbl,
						transInOutTypeID : trans.transInOutTypeID
					},
				};
				return {
					resId: clcom.pageId,
					data:  updReq,
				};

	            // Null を渡すと、Ajax 呼び出しを Reject したものと FW 側では見なします。
	            return null;
		},


		/**
		 * 空更新チェックデータをつくる
		 */
		_buildSubmitCheckDataFunction: function(arg){
			var appRec = arg.data.AMTRV0050GetRsp;
			// TODO: 空更新チェック対象外のフィールドを削っていく。

			return appRec;
		},

		/**
		 * 削除データか判定
		 * @returns {Boolean}
		 */
		isDelete: function() {
			return this.statRegistration == 2;
		},

		_eof: 'AMTRV0050.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView(clcom.pageArgs).initUIElement().render();
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
