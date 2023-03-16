useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'					: '_onSrchClick',			// 検索ボタン押下時
			"change #ca_srchPOTypeID" 			: "_PoTypeChange",			//
			'change #ca_srchUnitID'				: '_changeUnit',			//
//			'change #ca_srchDate'				: '_changeDate',			//
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
			clutil.inputlimiter(this.$el);

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'));
			
			// 付属名称
			clutil.cltypeselector(this.$("#ca_srchName"), amcm_type.AMCM_TYPE_PO_MAKERCODE, 1);

			// ＰＯ種別
			clutil.cltypeselector({$select: this.$("#ca_srchPOTypeID"),
				kind: amcm_type.AMCM_TYPE_PO_CLASS,
				ids:[
				     amcm_type.AMCM_VAL_PO_CLASS_MENS,
				     amcm_type.AMCM_VAL_PO_CLASS_LADYS
				     ],
				     unselectedflag: 1
			});

//			//最終更新者
			clutil.clusercode2($("#ca_srchUserID"));

//			// 検索日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchDate'));
			this.$("#ca_srchDate").datepicker('setIymd', clcom.getOpeDate());

			var $POTypeID = this.$("#ca_srchPOTypeID");
			var $UnitID = this.$("#ca_srchUnitID");
			var $srchDate = this.$("#ca_srchDate");
			clutil.clpobrandcode(this.$("#ca_srchBrandID"), {
				dependAttrs :{
					unit_id: function() {
						return $UnitID.val();
					},
					poTypeID: function() {
						return $POTypeID.val();
					}
				}
			});

			clutil.clpoclothcode(this.$("#ca_srchClothCodeID"), {
//				dependAttrs :{
//					srchFromDate: function() {
//						if( this.$("#ca_srchDate").val() == null || clutil.dateFormat(this.$("#ca_srchDate").val(), 'yyyymmdd')  <= 0){
//							return clcom.getOpeDate();
//						}else{
//							return  clutil.dateFormat(this.$("#ca_srchDate").val(), 'yyyymmdd');
//						}
//					},
//					srchToDate: function() {
//						if( this.$("#ca_srchDate").val() == null || clutil.dateFormat(this.$("#ca_srchDate").val(), 'yyyymmdd')  <= 0){
//							return clcom.getOpeDate();
//						}else{
//							return  clutil.dateFormat(this.$("#ca_srchDate").val(), 'yyyymmdd');
//						}
//					},
				dependAttrs :{
					srchFromDate: function() {
						if( $srchDate.val() == null || clutil.dateFormat($srchDate.val(), 'yyyymmdd')  <= 0){
							return clcom.getOpeDate();
						}else{
							return  clutil.dateFormat($srchDate.val(), 'yyyymmdd');
						}
					},
					srchToDate: function() {
						if( $srchDate.val() == null || clutil.dateFormat($srchDate.val(), 'yyyymmdd')  <= 0){
							return clcom.getOpeDate();
						}else{
							return  clutil.dateFormat($srchDate.val(), 'yyyymmdd');
						}
					},
					unit_id: function() {
						return $UnitID.val();
					},
					poTypeID: function() {
						return $POTypeID.val();
					}
				}
			});
			clutil.viewReadonly($("#ca_srchBrandID_div"));
			clutil.viewReadonly($("#ca_srchClothCodeID_div"));
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
				this._PoTypeChange(false);
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
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {

			var dto = this.serialize();

			clutil.mediator.trigger('ca_onSearch', dto);
		},
//		_changeDate:function(f_clear) {
//		var $POTypeID = this.$("#ca_srchPOTypeID");
//		var $UnitID = this.$("#ca_srchUnitID");
//		if($POTypeID.val() <= 0 || (($UnitID.val() != null)?($UnitID.val() <= 0):false)){
//		//指定なし
//		return;
//		}
//		clutil.clpoclothcode(this.$("#ca_srchClothCodeID"), {
//		dependAttrs :{
//		srchFromDate: function() {
//		if( this.$("#ca_srchDate").val() == null || clutil.dateFormat(this.$("#ca_srchDate").val(), 'yyyymmdd')  <= 0){
//		return clcom.getOpeDate();
//		}
//		return  clutil.dateFormat(this.$("#ca_srchDate").val(), 'yyyymmdd');
//		},
//		srchToDate: function() {
//		if( this.$("#ca_srchDate").val() == null || clutil.dateFormat(this.$("#ca_srchDate").val(), 'yyyymmdd')  <= 0){
//		return clcom.getOpeDate();
//		}
//		return  clutil.dateFormat(this.$("#ca_srchDate").val(), 'yyyymmdd');
//		},
//		unit_id: function() {
//		return $UnitID.val();
//		},
//		poTypeID: function() {
//		return $POTypeID.val();
//		}
//		}
//		});
//		},
		_changeUnit:function(f_clear) {
			if(f_clear){
				this.$("#ca_srchBrandID").val("");
				this.$("#ca_srchClothCodeID").val("");
			}
			var $UnitID = this.$("#ca_srchUnitID");
			var $POTypeID = this.$("#ca_srchPOTypeID");
			var $BrandTitle =  this.$("#fieldBrand");
//			var $BrandTitleTable =  mainView.$("#ca_headBrand");
			if($POTypeID.val() <= 0 || (($UnitID.val() != null)?($UnitID.val() <= 0):false)){
				//指定なし
				clutil.viewReadonly($("#ca_srchBrandID_div"));
				clutil.viewReadonly($("#ca_srchClothCodeID_div"));
			}else if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				clutil.viewRemoveReadonly($("#ca_srchBrandID_div"));
				clutil.viewRemoveReadonly($("#ca_srchClothCodeID_div"));
				//レディスの場合親ブランド
				$BrandTitle.text("親ブランド");
//				$BrandTitleTable.text("親ブランド");
				clutil.clpoparentbrand(this.$("#ca_srchBrandID"), {
					dependAttrs :{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return $POTypeID.val();
						}
					}
				});
			}else{
				clutil.viewRemoveReadonly($("#ca_srchBrandID_div"));
				clutil.viewRemoveReadonly($("#ca_srchClothCodeID_div"));
				//それ以外ブランド
				$BrandTitle.text("ブランド");
//				$BrandTitleTable.text("ブランド");
				clutil.clpobrandcode(this.$("#ca_srchBrandID"), {
					dependAttrs :{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return $POTypeID.val();
						}
					}
				});
			}
		},
		_PoTypeChange: function(f_clear) {
			if(f_clear){
				this.$("#ca_srchBrandID").val("");
				this.$("#ca_srchClothCodeID").val("");
			}
			var $POTypeID = this.$("#ca_srchPOTypeID");
			var $UnitID = this.$("#ca_srchUnitID");
			var $BrandTitle =  this.$("#fieldBrand");
//			var $BrandTitleTable =  mainView.$("#ca_headBrand");
			if($POTypeID.val() <= 0 || (($UnitID.val() != null)?($UnitID.val() <= 0):false)){
				//指定なし
				clutil.viewReadonly($("#ca_srchBrandID_div"));
				clutil.viewReadonly($("#ca_srchClothCodeID_div"));
			}else if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				clutil.viewRemoveReadonly($("#ca_srchBrandID_div"));
				clutil.viewRemoveReadonly($("#ca_srchClothCodeID_div"));
				//レディスの場合親ブランド
				$BrandTitle.text("親ブランド");
//				$BrandTitleTable.text("親ブランド");
				clutil.clpoparentbrand(this.$("#ca_srchBrandID"), {
					dependAttrs :{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return $POTypeID.val();
						}
					}
				});

			}else{
				clutil.viewRemoveReadonly($("#ca_srchBrandID_div"));
				clutil.viewRemoveReadonly($("#ca_srchClothCodeID_div"));
				//それ以外ブランド
				$BrandTitle.text("ブランド");
//				$BrandTitleTable.text("ブランド");
				clutil.clpobrandcode(this.$("#ca_srchBrandID"), {
					dependAttrs :{
						unit_id: function() {
							return $UnitID.val();
						},
						poTypeID: function() {
							return $POTypeID.val();
						}
					}
				});
			}
		},

		_eof: 'AMPOV0120.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'			: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
//			"click #ca_csv_uptake" 			: "_onCsvUpTakeClick", 		//TODO:取込実装
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '付属',
				subtitle: '一覧'
			});



			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMPOV0120 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMPOV0120';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			$(".txtInFieldUnit.help").tooltip({html: true});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			this.$("#ca_torikomi1").hide();

		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			this.recListView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					// リクエストデータ本体
					var request = {
							AMPOV0120GetReq: clutil.view2data(this.$("#ca_srchArea"))
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMPOV0120',
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
			// 取込処理成功
			this.opeCSVInputCtrl.on('done', function(data){
				// 取り込み結果を表示する
				clutil.MessageDialog2(clmsg.cl_rtype_upd_confirm);
			});

			// 取込処理失敗
			this.opeCSVInputCtrl.on('fail', function(data){
				// 取込処理が失敗した。
				if(data.rspHead.uri){
					//CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				}
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.$("#ca_srchUnitID").val(clcom.userInfo.unit_id);
			this.mdBaseView.render();
			this.srchCondView.render();
			this.recListView.render();
			for(var i = 0; i < this.pagerViews.length; i++){
				this.pagerViews[i].render();
			}
			//初期フォーカス
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.setFocus($('#ca_srchPOTypeID'));
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
			this.showSearchPane();
			return this;
		},
		// CSV取込
//		_onCsvUpTakeClick : function() {
//		if (this.isReadOnly()) {
//		return;
//		}

//		$("#file_csv_uptake").trigger('click'); // TODO:取込実装
//		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				srchReq = this.srchCondView.serialize();
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
					AMPOV0120GetReq: srchReq
			};
			return req;
		},
		/**
		 * 検索条件をつくる
		 */
		buildCSVReq: function(ope_mode){

			var srchReq  = clutil.view2data(this.$("#ca_srchArea"));

			// CSVダウンロード条件
			var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV,
						fileId: 0			// CSV取込などで使用する
					},
					reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMPOV0120GetReq: srchReq
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
			if(groupid !== 'AMPOV0120'){
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
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行データ（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMPOV0120', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				//TODO
				//ぽ種別によってテーブルヘッダを書き換え
//				var $POTypeID = this.srchCondView.$("#ca_srchPOTypeID");
				if(srchReq.AMPOV0120GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
					this.$("#ca_headBrand").text("親ブランド");
				}else{
					this.$("#ca_headBrand").text("ブランド");
				}

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMPOV0120GetRsp.makerCodeList;

				if(_.isEmpty(recs)){
					// 画面を一旦リセット
					mainView.srchAreaCtrl.reset();
					// 検索ペインを表示？
//					mainView.srchAreaCtrl.show_srch();
					this.showSearchPane();

					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					return;
				}

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.showResultPane();
//				this.srchAreaCtrl.show_result();

				// 内容物がある場合 --> 結果表示する。
				this.recListView.setRecs(recs);
				this.recListView.setDeletedRowUI(function(dto) {
					return dto.delFlag != 0;
				});

				// 初期選択の設定（オプション）
				if(!_.isEmpty(chkData)){
					this.recListView.setSelectRecs(chkData, true);
				}

				this.resetFocus($focusElem);
			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 検索ペインを表示
//				mainView.srchAreaCtrl.show_srch();
				this.showSearchPane();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				this.resetFocus($focusElem);

			}, this));

			return defer;
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFirstFocus($focusElem);
			}else{
				// TODO : 適当な場所を select してフォーカスを入れる。
//				if (this.$('#searchAgain').css('display') == 'none') {
//				// 検索ボタンにフォーカスする
//				this.$('#ca_AMRSV0120_search').focus();
//				} else {
//				// 条件を追加ボタンにフォーカスする
//				this.$('#ca_AMRSV0120_add').focus();
//				}
			}
		},

		/**
		 * 条件設定ペインを表示する。
		 */
		showSearchPane: function(){
			this.srchAreaCtrl.show_srch();
			this.mdBaseView.$('#mainColumnFooter').fadeOut();
		},

		/**
		 * 検索結果表示ペインを表示する。
		 */
		showResultPane: function(){
			this.srchAreaCtrl.show_result();
			this.mdBaseView.$('#mainColumnFooter').fadeIn();
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
//			this.srchAreaCtrl.show_srch();
			this.showSearchPane();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(ope_mode, pgIndex/*一覧画面では使用しない*/, e){

			var url = clcom.appRoot + '/AMPO/AMPOV0130/AMPOV0130.html';
			// 画面遷移引数
			var pushPageOpt = null;

			switch(ope_mode){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				pushPageOpt = {
					// 遷移先url
					url: url,
					// 画面引数 -- 遷移先画面に渡すネタ
					args: {
						opeTypeId: ope_mode
					},
					// 保存データ -- 戻ってきたときにリロードするネタ
					saved: {
						btnId: e.target.id,
						savedReq: null,
						savedCond: clutil.view2data($('#ca_searchArea')),
						chkData: this.recListView.getSelectedRecs()
					}
			};
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				var clickedRec = this.recListView.getLastClickedRec();
				if(_.isEmpty(clickedRec)){
					console.warn('照会：クリックした行が不明・・・Skip');
					return;
				}
				pushPageOpt = {
						url: url,
						args: {
							opeTypeId: ope_mode,
							srchDate: this.savedReq.srchDate,
							chkData: [ clickedRec ]
						},
						newWindow: true				// 別窓で照会画面を起動
				};
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				console.log('CSV 出力');
				this.doDownload(ope_mode);
				break;
			default:										// その他、編集、予約取消、削除
				var selectedRecs = this.recListView.getSelectedRecs();
			pushPageOpt = {
					url: url,
					args: {
						opeTypeId: ope_mode,
						srchDate: this.savedReq.srchDate,
						chkData: this.recListView.getSelectedRecs()
					},
					saved: {
						btnId: e.target.id,
						savedReq: this.savedReq,
						savedCond: this.savedReq.AMPOV0120GetReq,
						chkData: this.recListView.getSelectedRecs()
					}
			};
			}
			if(pushPageOpt){
				clcom.pushPage(pushPageOpt);
			}
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(ope_mode){
			var retStat = true; // input check var
			// check by validator
			if(!this.validator.valid()){
				retStat = false;
			}

			// if some input is not correct, return
			if (!retStat) {
				return;
			}
			// リクエストをつくる
			var srchReq = this.buildCSVReq(ope_mode);
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
//				this.srchAreaCtrl.show_srch();
				this.showSearchPane();
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMPOV0120', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
//				mainView.srchAreaCtrl.show_srch();
				this.showSearchPane();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
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
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}
		},

		_eof: 'AMPOV0120.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
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
