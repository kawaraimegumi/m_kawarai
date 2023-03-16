useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));
	//遷移先指定
	var Dialog = Marionette.ItemView.extend({
		template: '#NewDialog',
		events: {

		},

		getPoType: function(){
			var radio = this.$("input:radio[name=ca_chgPage]:checked");
			return radio.val();
		},

		onShow: function(){
			clutil.initUIelement(this.$el);
		}
	});


	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'					: '_onSrchClick',			// 検索ボタン押下時
			'change #ca_srchPOTypeID' 			: '_PoTypeChange'
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

			// ＰＯ種別
			clutil.cltypeselector(this.$("#ca_srchPOTypeID"), amcm_type.AMCM_TYPE_PO_CLASS);

//			//最終更新者
			clutil.clusercode2($("#ca_srchUserID"));

//			// 検索日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchDate'));
			this.$("#ca_srchDate").datepicker('setIymd', clcom.getOpeDate());

			//ブランド 初期表示は使用不可
			var $POTypeID = this.$("#ca_srchPOTypeID");
			var $UnitID = this.$("#ca_srchUnitID");
			clutil.clpoparentbrand(this.$("#ca_srchParentBrandID"), {
				dependAttrs :{
					unit_id: function() {
						return $UnitID.val();
					},
					poTypeID: function() {
						return $POTypeID.val();
					}
				}
			});
			clutil.inputReadonly($("#ca_srchParentBrandID"));
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
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {

			var dto = this.serialize();

			clutil.mediator.trigger('ca_onSearch', dto);
		},
		_PoTypeChange: function(e) {
			var $POTypeID = this.$("#ca_srchPOTypeID");
			if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
			//レディスの場合使用可能
				this.$("#ca_srchParentBrandID").val("");
				clutil.inputRemoveReadonly($("#ca_srchParentBrandID"));

			}else{
			//それ以外使用不可
				this.$("#ca_srchParentBrandID").val("");
				clutil.inputReadonly($("#ca_srchParentBrandID"));
			}
		},
		_eof: 'AMPOV0050.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'		: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click #cl_option'			: '_onOptionClick',			// オプションクリック
			'click #cl_option_del'		: '_onOptionDelClick'		// オプションクリック
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: 'ブランド',
				subtitle: '一覧'
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMPOV0050 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMPOV0050';

			// ページャ
			this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
			this.recListView = new clutil.View.RowSelectListView({
				el: this.$('#ca_table'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template').html() )
			});

			this.recListView2 = new clutil.View.RowSelectListView({
				el: this.$('#ca_table2'),
				groupid: groupid,
				template: _.template( $('#ca_rec_template2').html() )
			});

			$(".txtInFieldUnit.help").tooltip({html: true});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			// 行選択の変更イベントを受け取る
			clutil.mediator.on('onRowSelectChanged', this._onRowSelectChanged);

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
			this.recListView.initUIElement();
			this.recListView2.initUIElement();

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
			this.$("#ca_srchUnitID").val(clcom.userInfo.unit_id);
			this.mdBaseView.render();
			this.srchCondView.render();
			this.recListView.render();
			this.recListView2.render();
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
				AMPOV0050GetReq: srchReq
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
			if(groupid !== 'AMPOV0050'){
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

			var defer = clutil.postJSON('AMPOV0050', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMPOV0050GetRsp.brandList;

				if(_.isEmpty(recs)){
					// 画面を一旦リセット
					mainView.srchAreaCtrl.reset();
					// 検索ペインを表示？
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
				if (srchReq.AMPOV0050GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
					this.$('#ca_table').hide();
					this.recListView2.setRecs(recs);
					this.recListView2.setDeletedRowUI(function(dto) {
						return dto.delFlag != 0;
					});
					this.$('#ca_table2').show();
				}else{
					this.$('#ca_table2').hide();
					this.recListView.setRecs(recs);
					this.recListView.setDeletedRowUI(function(dto) {
						return dto.delFlag != 0;
					});
					this.$('#ca_table').show();
				}

				// 初期選択の設定（オプション）
				if(!_.isEmpty(chkData)){
					if (srchReq.AMPOV0050GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
						this.recListView2.setSelectRecs(chkData, true);
					}else{
						this.recListView.setSelectRecs(chkData, true);
					}
				}

				this.resetFocus($focusElem);
			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();

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
//					// 検索ボタンにフォーカスする
//					this.$('#ca_AMRSV0050_search').focus();
//				} else {
//					// 条件を追加ボタンにフォーカスする
//					this.$('#ca_AMRSV0050_add').focus();
//				}
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
		},
		/**
		 * オプション変更押下
		 */
		_onOptionClick:function() {
			var url = clcom.appRoot + '/AMPO/AMPOV0070/AMPOV0070.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				var selectedRecs;
				if (this.savedReq.AMPOV0050GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
					selectedRecs = this.recListView2.getSelectedRecs();
				}else{
					selectedRecs = this.recListView.getSelectedRecs();
				}
				$.each(selectedRecs, function(){
					this.mode = 1;
				});
				myData = {
						btnId: "cl_option",
						savedReq: this.savedReq,
						savedCond: this.savedReq.AMPOV0050GetReq,
						chkData: selectedRecs
				};
				destData = {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
						chkData: selectedRecs
				};
			}else{
				// 検索結果が無い場合
				myData = {
						btnId: e.target.id,
						savedReq: null,
						savedCond: this.srchCondView.serialize(),
						selectedIds: []
				};
				destData = {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
				};
			}
			// チェックされたデータが必要（Ｎ）
			if(_.isEmpty(destData.chkData)){
				// 行選択がない				-- そもそもボタンを押せなくしている
				console.warn('rtyp[' + am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD + ']: item not specified.');
				return;
			}
			//納期変更画面に移動
			clcom.pushPage(url, destData, myData);
		},
		_onOptionDelClick:function() {
			var url = clcom.appRoot + '/AMPO/AMPOV0070/AMPOV0070.html';
			var myData, destData;
			if(this.savedReq){
				// 検索結果がある場合
				var selectedRecs;
				if (this.savedReq.AMPOV0050GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
					selectedRecs = this.recListView2.getSelectedRecs();
				}else{
					selectedRecs = this.recListView.getSelectedRecs();
				}
				$.each(selectedRecs, function(){
					this.mode = 1;
				});
				myData = {
						btnId: "cl_option",
						savedReq: this.savedReq,
						savedCond: this.savedReq.AMPOV0050GetReq,
						chkData: selectedRecs
				};
				destData = {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL,
						chkData: selectedRecs
				};
			}else{
				// 検索結果が無い場合
				myData = {
						btnId: e.target.id,
						savedReq: null,
						savedCond: this.srchCondView.serialize(),
						selectedIds: []
				};
				destData = {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
				};
			}
			// チェックされたデータが必要（Ｎ）
			if(_.isEmpty(destData.chkData)){
				// 行選択がない				-- そもそもボタンを押せなくしている
				console.warn('rtyp[' + am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL + ']: item not specified.');
				return;
			}
			//納期変更画面に移動
			clcom.pushPage(url, destData, myData);
		},
		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(ope_mode, pgIndex/*一覧画面では使用しない*/, e){

			var url = clcom.appRoot + '/AMPO/AMPOV0060/AMPOV0060.html';
			// 画面遷移引数
			var pushPageOpt = null;
			var _this = this;
			switch(ope_mode){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				var chkData;
				if (_this.savedReq != null ){
					if (_this.savedReq.AMPOV0050GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
						chkData = this.recListView2.getSelectedRecs();
					}else{
						chkData = this.recListView.getSelectedRecs();
					}
				}
				var defArray = new Array();
				// ID=0 で検索するのでデータ無理やり作って渡す。
				obj = {
						id: 0,
						stDate: 19900102
				};
				defArray.push(obj);
				pushPageOpt = {
					// 遷移先url
					url: url,
					// 画面引数 -- 遷移先画面に渡すネタ
					args: {
						opeTypeId: ope_mode,
						chkData:defArray
					},
					// 保存データ -- 戻ってきたときにリロードするネタ
					saved: {
						btnId: e.target.id,
						savedReq: null,
						savedCond: clutil.view2data($('#ca_searchArea')),
						chkData: chkData
					}
				};
				if(pushPageOpt){
					clcom.pushPage(pushPageOpt);
				}
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				var clickedRec;
				if (_this.savedReq.AMPOV0050GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
					clickedRec = _this.recListView2.getLastClickedRec();
				}else{
					clickedRec = _this.recListView.getLastClickedRec();
				}
				if(_.isEmpty(clickedRec)){
					console.warn('照会：クリックした行が不明・・・Skip');
					return;
				}
				if(clickedRec.styleOptionDelFlag > 0){
//					var pushPageOpt = null;
					var dialog = new Dialog();
					dialog.render();
					clutil.initUIelement(dialog.$el);
					clutil.ConfirmDialog(dialog.el, function(dialog){
						console.log('OK', arguments);
						try{
							if(dialog.getPoType() == 1){
								//スタイルオプション
								url = clcom.appRoot + '/AMPO/AMPOV0060/AMPOV0060.html';
							}else if(dialog.getPoType() == 2){
								//スタイルオプション
								url = clcom.appRoot + '/AMPO/AMPOV0070/AMPOV0070.html';
							}else{
								return;
							}
							pushPageOpt = {
									url: url,
									args: {
										opeTypeId: ope_mode,
										srchDate: _this.savedReq.srchDate,
										chkData: [ clickedRec ]
									},
									newWindow: true				// 別窓で照会画面を起動
							};
							clcom.pushPage(pushPageOpt);
						}finally{
							dialog.remove();
//							clcom.pushPage(pushPageOpt);
						}
					}, function(dialog){
						console.log('CANCEL', arguments);
						try{
							;
						}finally{
							dialog.remove();
						}
					}, dialog);
				}else{
					pushPageOpt = {
							url: url,
							args: {
								opeTypeId: ope_mode,
								srchDate: _this.savedReq.srchDate,
								chkData: [ clickedRec ]
							},
							newWindow: true				// 別窓で照会画面を起動
					};
//					if(pushPageOpt){
//						clcom.pushPage(pushPageOpt);
//					}
					clcom.pushPage(pushPageOpt);
				}


//				pushPageOpt = {
//						url: url,
//						args: {
//							opeTypeId: ope_mode,
//							srchDate: _this.savedReq.srchDate,
//							chkData: [ clickedRec ]
//						},
//						newWindow: true				// 別窓で照会画面を起動
//				};
//				if(pushPageOpt){
//					clcom.pushPage(pushPageOpt);
//				}

				break;
			default:										// その他、編集、予約取消、削除
				var selectedRecs;
				if (_this.savedReq.AMPOV0050GetReq.srchPOTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
					selectedRecs = _this.recListView2.getSelectedRecs();
				}else{
					selectedRecs = _this.recListView.getSelectedRecs();
				}
				pushPageOpt = {
					url: url,
					args: {
						opeTypeId: ope_mode,
						srchDate: _this.savedReq.srchDate,
						chkData: selectedRecs
					},
					saved: {
						btnId: e.target.id,
						savedReq: _this.savedReq,
						savedCond: _this.savedReq.AMPOV0050GetReq,
						chkData: selectedRecs
					}
				};
				if(pushPageOpt){
					clcom.pushPage(pushPageOpt);
				}
			}
		},

		/**
		 * recListView の選択 chage イベントを購読する。
		 */
		_onRowSelectChanged: function(groupid, arg, from){
			console.log(arguments);

			if(groupid != 'AMPOV0050'){
				return;
			}
			//スタイルオプション削除は複数選択不可・フラグなし不可
			if(arg.selectedRecs.length != 1){
				this.$("#cl_option_del").removeAttr('disabled');
				this.$("#cl_option_del").removeAttr('Enable');
				this.$("#cl_option_del").attr('disabled', true);
				this.$("#cl_option_del").attr('Enable', false);
				return;
			}
			var selectedRec = arg.selectedRecs[0];
			if(selectedRec.styleOptionDelFlag){
				this.$("#cl_option_del").removeAttr('disabled');
				this.$("#cl_option_del").removeAttr('Enable');
				this.$("#cl_option_del").attr('disabled', false);
				this.$("#cl_option_del").attr('Enable', true);
			}else {
				this.$("#cl_option_del").removeAttr('disabled');
				this.$("#cl_option_del").removeAttr('Enable');
				this.$("#cl_option_del").attr('disabled', true);
				this.$("#cl_option_del").attr('Enable', false);
			}
			return;
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMPOV0050', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

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
			this.recListView2.clear();
		},

		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(model) {
			// 条件部の復元
			if(!_.isEmpty(model.savedCond)){
				this.srchCondView.deserialize(model.savedCond);
				this.srchCondView._PoTypeChange();
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}
		},

		_eof: 'AMPOV0050.MainView//'
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
