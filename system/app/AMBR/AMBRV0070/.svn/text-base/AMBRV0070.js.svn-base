//セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			"change #ca_srchUnitID" 				: "_onSrchUnitChanged",
			"click #ca_btn_org_select"				: '_onShowOrgSelClick',	// 組織選択ボタン押下
			'click #ca_srch'						: '_onSrchClick',			// 検索ボタン押下時
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

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_srchUnitID"
				},
			}, {
				dataSource: {
					ymd: clcom.ope_date
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。
			});

			// 初期値を設定
			this.deserialize( {
//				srchUnitID	: clcom.userInfo.unit_id,					// 事業ユニットID
			});

			// 組織
			console.log(clcom.userInfo.unit_id);
			this.orgAutocomplete = this.getOrg(clcom.userInfo.unit_id);
			if (clcom.userInfo && clcom.userInfo.org_id && clcom.userInfo.org_kind_typeid) {
				var code = (clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID')) ||
						clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')))
						? '' : clcom.userInfo.org_code ;
//				this.orgAutocomplete.setValue({
//				id: clcom.userInfo.org_id,
//				code: code,
//				name: clcom.userInfo.org_name
//				});
				this.$tgtFocus = $('#ca_srchOrgID');
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					// 店舗ユーザー
					this.orgAutocomplete.setValue({
						id: clcom.userInfo.org_id,
						code: code,
						name: clcom.userInfo.org_name
					});
					clutil.inputReadonly($("#ca_srchOrgID"));
					clutil.inputReadonly($("#ca_btn_org_select"));
					this.$tgtFocus = $('#ca_srch');
				}
			}

			// 組織選択画面
			this.AMPAV0020Selector = new  AMPAV0020SelectorView({
				el				: $("#ca_AMPAV0020_dialog"),	// 配置場所
				$parentView		: $("#mainColumn"),				// 親ビュー
				//ymd				: null,			// 検索日
				select_mode		: clutil.cl_single_select,	// 単一選択モード
				//anaProc			: this.anaProc
				isAnalyse_mode 	: false,						// 通常画面モード
			});
			this.AMPAV0020Selector.render();

			// 対象月
			clutil.clyearselector(
					this.$("#ca_srchYear"),
					0,
					2,//clutil.getclsysparam('PAR_AMCM_YEAR_FROM'),
					2,//clutil.getclsysparam('PAR_AMCM_YEAR_TO'),
			"年度");

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);
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
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function() {
			return this.validator.valid();
		},

		/**
		 *  事業ユニットと参照ボタンの連携
		 */
		_onSrchUnitChanged : function(e){
			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
				return;
			}
			var unitID = Number($('#ca_srchUnitID').val());
			this.getOrg(unitID);
			this.orgAutocomplete.setValue();
			this.$("#ca_srchOrgID").attr("readonly", (unitID == 0));
			this.$("#ca_btn_org_select").attr("disabled", (unitID == 0));
		},

		/**
		 * 組織オートコンプ入れ替え
		 */
		getOrg: function(unitID){
			return clutil.clorgcode({
				el: $('#ca_srchOrgID'),
				dependAttrs: {
					// 上位組織を事業ユニットIDで選択されているものに設定する
					p_org_id: (unitID < clutil.getclsysparam('PAR_AMMS_UNITID_AOKI') ? 0 : unitID),
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				}
			});
		},

		/**
		 * 組織選択ボタン押下
		 */
		_onShowOrgSelClick: function(e) {
			var _this = this;

			// 選択された情報を初期値として検索する
			var func_id = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
			var r_org_id = clcom.userInfo.unit_id < clutil.getclsysparam('PAR_AMMS_UNITID_AOKI') ? 3 : clcom.userInfo.unit_id;
			
			// 2015/11/10 MT-873対応 藤岡
			var f_ignore_perm = 0;
			if(clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_KEISEN){
				// 経戦ユーザなら権限無視(親組織を本部とする)
				f_ignore_perm = 1;
				r_org_id = 3;
			}
			// 2015/11/10 MT-873対応 ここまで
			
			// 3 は　(株)AOKIのorg_id いつでも触れるようにするならパラメータ化が必要
			// ＋組織画面側で選択した事業ユニットの渡しが必要となる。
//			var initData = {};
//			initData.func_id = Number(clutil.getclsysparam("PAR_AMMS_DEFAULT_ORG_FUNCID", 1));
			this.AMPAV0020Selector.show(null, false, func_id, null, null, r_org_id, 0, f_ignore_perm);
			//サブ画面復帰後処理
			this.AMPAV0020Selector.okProc = function(data) {
				if (data != null && data.length > 0) {
					// 組織を取出す
					data[0].id = data[0].val;
					_this.orgAutocomplete.setValue(data[0]);
				} else {
					var org = _this.orgAutocomplete.getValue();
					if (org.id == 0) {
						_this.orgAutocomplete.resetValue();
					}
				}
				// inputにフォーカスする
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_org_select"));
				});
			};
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			if(!this.isValid()){
				return;
			}

			var dto = this.serialize();
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMBRV0070.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'		: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click #cl_close'			: '_onCloseClick',
		},

		initialize: function(opt){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId: -1,
				title: '店舗別予算書',
				subtitle: '',
				btn_csv: (clcom.userInfo && clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF),
				btn_submit: false
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMBRV0070 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMBRV0070';

			// ページャ
			//this.pagerViews = clutil.View.buildPaginationView(groupid, this.$el);

			// 検索結果リスト
//			this.recListView = new clutil.View.RowSelectListView({
//				el: this.$('#ca_table'),
//				groupid: groupid,
//				template: _.template( $('#ca_rec_template').html() ),
//				onOperationSilent	: true,
//			});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			//clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

//			// 外部イベントの購読設定
//			switch(fixopt.opeTypeId){
//			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
//			// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
//			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
//			// fall through
//			default:
//			// 新規登録以外は、GET結果のデータを購読する。
//			clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
//			}

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();
//			this.recListView.initUIElement();

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
			this.mdBaseView.render();
			this.srchCondView.render();

			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq) {
			var srchReq;
			if (arguments.length > 0) {
				srchReq = argSrchReq;
			} else {
				if (this.srchCondView.isValid()) {
					srchReq = this.srchCondView.serialize();
				} else {
					// メッセージは、srchConcView 側で出力済。
					return;
				}
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
					//reqPage: _.first(this.pagerViews).buildReqPage0(),
					AMBRV0070SchReq: srchReq
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);

			// 検索実行
			this.doSrch(req);
		},


		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMBRV0070', srchReq).done(_.bind(function(data){
				this.srchDoneProc(srchReq, data);

			}, this)).fail(_.bind(function(data){
				this.srchFailProc(data);
			}, this));

			return defer;
		},

		srchDoneProc: function(srchReq, data){
			// データ取得
			var recs = data.AMBRV0070SchRsp;

			if (_.isEmpty(recs)) {
				// エラーメッセージ表示
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペイン／結果ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// フォーカス設定
				this.resetFocus(this.srchCondView.$tgtFocus);
			} else {
				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();
				
				//テーブル部作成
				this.makeTable(recs);

				if (clcom.userInfo && (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STAFF_SYS)) {
					// Excelダウンロードボタンを表示する
					this.mdBaseView.options.btn_csv = true;
					this.mdBaseView.renderFooterNavi();
				}

				// フォーカスの設定
				if(typeof $focusElem != 'undefined') {
					this.resetFocus($focusElem);
				}

			}
		},


		makeTable: function(recs){
			this.initGrid();
			this.renderGrid(recs);
			
			// 店舗名表示
			var storeCode = recs.storeCodeName.code;
			var storeName = recs.storeCodeName.name;
			$("#disp_storeID").text(storeCode+':'+storeName);
		},

		initGrid:function(){
			// データグリッド
			this.dataGrid  = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid',	// エレメント
				lineno			: false,			// 行番号表示する/しないフラグ。
				delRowBtn		: false,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: false,			// フッター部の新規行追加ボタンを使用するフラグ。
			});
		},


		getColumns: function(data){
			var columns = [
			               // id: カラム識別 id。省略すると、setData() 時におけるカラムインデックス値が内部で設定されます。
			               // name: ラベル文字列
			               // field: 行データ上のプロパティ名とマッピング
			               // cssClass: スタイルを充てるためのクラスを記述
			               // width: カラム幅
			               { id: 'accTitleName', field: "accTitleName", cssClass: 'bdrTpColor', width: 200 },
			               { id: 'accTitleName2', field: "accTitleName2", cssClass: 'bdrTpColor', width: 100 },
			               { id: 'y_result', field: "y_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'y_compRatio', field: "y_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               { id: 'hy1_result', field: "hy1_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'hy1_compRatio', field: "hy1_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               
			               { id: 'm1_result', field: "m1_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'm1_compRatio', field: "m1_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               { id: 'm2_result', field: "m2_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'm2_compRatio', field: "m2_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               { id: 'm3_result', field: "m3_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'm3_compRatio', field: "m3_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               { id: 'm4_result', field: "m4_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'm4_compRatio', field: "m4_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               { id: 'm5_result', field: "m5_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'm5_compRatio', field: "m5_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               { id: 'm6_result', field: "m6_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'm6_compRatio', field: "m6_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               
			               
			               { id: 'hy2_result', field: "hy2_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'hy2_compRatio', field: "hy2_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               
			               { id: 'm7_result', field: "m7_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'm7_compRatio', field: "m7_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               { id: 'm8_result', field: "m8_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'm8_compRatio', field: "m8_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               { id: 'm9_result', field: "m9_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'm9_compRatio', field: "m9_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               { id: 'm10_result', field: "m10_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'm10_compRatio', field: "m10_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               { id: 'm11_result', field: "m11_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'm11_compRatio', field: "m11_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"},
			               { id: 'm12_result', field: "m12_result",  width: 150 ,cssClass: 'txtalign-right',name: "予算"},
			               { id: 'm12_compRatio', field: "m12_compRatio",  width: 100 ,cssClass: 'txtalign-right',name: "構成比"}
			               ];
			return columns;
		},
		
		getHead: function(data){
			var obj = data.accLists[0];
			var year_disp = obj.yRec.title + "年度";
			var hyear1_disp = obj.yRec.title + "年度上半期";
			var hyear2_disp = obj.yRec.title + "年度下半期";
			
			var colhdMetadatas = [
			                      { // 1段目
			                    	  columns: {
			                    		  accTitleName: { colspan: 2,name: '勘定項目'},
			                    		  y_result: { colspan: 2,name: year_disp},
			                    		  hy1_result: { colspan: 2,name: hyear1_disp},
			                    		  m1_result: { colspan: 2,name:  obj.mRec1.title},
			                    		  m2_result: { colspan: 2,name:  obj.mRec2.title},
			                    		  m3_result: { colspan: 2,name:  obj.mRec3.title},
			                    		  m4_result: { colspan: 2,name:  obj.mRec4.title},
			                    		  m5_result: { colspan: 2,name:  obj.mRec5.title},
			                    		  m6_result: { colspan: 2,name:  obj.mRec6.title},
			                    		  hy2_result: { colspan: 2,name: hyear2_disp},
			                    		  m7_result: { colspan: 2,name:  obj.mRec7.title},
			                    		  m8_result: { colspan: 2,name:  obj.mRec8.title},
			                    		  m9_result: { colspan: 2,name:  obj.mRec9.title},
			                    		  m10_result: { colspan: 2,name: obj.mRec10.title},
			                    		  m11_result: { colspan: 2,name: obj.mRec11.title},
			                    		  m12_result: { colspan: 2,name: obj.mRec12.title}
			                    	  }
			                      }];
			return colhdMetadatas;
		},
		
		setDate: function(data){
			var list = data.accLists;
			var sendList = [];
			for(var i=0; i<list.length; i++){
				var obj = {
						accTitleName:list[i].accTitleName,
						accTitleName2:"前年実績",
						y_result:clutil.comma(list[i].yRec.result),
						y_compRatio:list[i].yRec.compRatio.toFixed(1),
						hy1_result:clutil.comma(list[i].hyRec1.result),
						hy1_compRatio:list[i].hyRec1.compRatio.toFixed(1),
						hy2_result:clutil.comma(list[i].hyRec2.result),
						hy2_compRatio:list[i].hyRec2.compRatio.toFixed(1),
						m1_result:clutil.comma(list[i].mRec1.result),
						m1_compRatio:list[i].mRec1.compRatio.toFixed(1),
						m2_result:clutil.comma(list[i].mRec2.result),
						m2_compRatio:list[i].mRec2.compRatio.toFixed(1),
						m3_result:clutil.comma(list[i].mRec3.result),
						m3_compRatio:list[i].mRec3.compRatio.toFixed(1),
						m4_result:clutil.comma(list[i].mRec4.result),
						m4_compRatio:list[i].mRec4.compRatio.toFixed(1),
						m5_result:clutil.comma(list[i].mRec5.result),
						m5_compRatio:list[i].mRec5.compRatio.toFixed(1),
						m6_result:clutil.comma(list[i].mRec6.result),
						m6_compRatio:list[i].mRec6.compRatio.toFixed(1),
						m7_result:clutil.comma(list[i].mRec7.result),
						m7_compRatio:list[i].mRec7.compRatio.toFixed(1),
						m8_result:clutil.comma(list[i].mRec8.result),
						m8_compRatio:list[i].mRec8.compRatio.toFixed(1),
						m9_result:clutil.comma(list[i].mRec9.result),
						m9_compRatio:list[i].mRec9.compRatio.toFixed(1),
						m10_result:clutil.comma(list[i].mRec10.result),
						m10_compRatio:list[i].mRec10.compRatio.toFixed(1),
						m11_result:clutil.comma(list[i].mRec11.result),
						m11_compRatio:list[i].mRec11.compRatio.toFixed(1),
						m12_result:clutil.comma(list[i].mRec12.result),
						m12_compRatio:list[i].mRec12.compRatio.toFixed(1)
				};
				sendList.push(obj);
				
				var obj2 = {
						accTitleName:"",
						accTitleName2:"計画",
						y_result: clutil.comma(list[i].yRec.plan),
						y_compRatio:list[i].yRec.planCompRatio.toFixed(1),
						hy1_result: clutil.comma(list[i].hyRec1.plan),
						hy1_compRatio:list[i].hyRec1.planCompRatio.toFixed(1),
						hy2_result: clutil.comma(list[i].hyRec2.plan),
						hy2_compRatio:list[i].hyRec2.planCompRatio.toFixed(1),
						
						m1_result: clutil.comma(list[i].mRec1.plan),
						m1_compRatio:list[i].mRec1.planCompRatio.toFixed(1),
						m2_result: clutil.comma(list[i].mRec2.plan),
						m2_compRatio:list[i].mRec2.planCompRatio.toFixed(1),
						m3_result: clutil.comma(list[i].mRec3.plan),
						m3_compRatio:list[i].mRec3.planCompRatio.toFixed(1),
						m4_result: clutil.comma(list[i].mRec4.plan),
						m4_compRatio:list[i].mRec4.planCompRatio.toFixed(1),
						m5_result: clutil.comma(list[i].mRec5.plan),
						m5_compRatio:list[i].mRec5.planCompRatio.toFixed(1),
						m6_result: clutil.comma(list[i].mRec6.plan),
						m6_compRatio:list[i].mRec6.planCompRatio.toFixed(1),
						m7_result: clutil.comma(list[i].mRec7.plan),
						m7_compRatio:list[i].mRec7.planCompRatio.toFixed(1),
						m8_result: clutil.comma(list[i].mRec8.plan),
						m8_compRatio:list[i].mRec8.planCompRatio.toFixed(1),
						m9_result: clutil.comma(list[i].mRec9.plan),
						m9_compRatio:list[i].mRec9.planCompRatio.toFixed(1),
						m10_result: clutil.comma(list[i].mRec10.plan),
						m10_compRatio:list[i].mRec10.planCompRatio.toFixed(1),
						m11_result: clutil.comma(list[i].mRec11.plan),
						m11_compRatio:list[i].mRec11.planCompRatio.toFixed(1),
						m12_result: clutil.comma(list[i].mRec12.plan),
						m12_compRatio:list[i].mRec12.planCompRatio.toFixed(1)
				};
				sendList.push(obj2);
			}
			return sendList;
		},
		
		renderGrid: function(data){
			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenColumn: 1,
					frozenRow: 2
				},
				columns: this.getColumns(),
				colhdMetadatas: this.getHead(data),
				data: this.setDate(data),
			});
		},

		srchFailProc: function(data){
			// 画面を一旦リセット
			mainView.srchAreaCtrl.reset();
			// 検索ペインを表示
			mainView.srchAreaCtrl.show_srch();

			// エラーメッセージを通知。
			clutil.mediator.trigger('onTicker', data);

			if (data.rspHead.fieldMessages) {
				// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				return;
			}

			// フォーカスの設定
			this.resetFocus();
		},


		/**
		 * 数値を2桁文字列に変換
		 * @param obj
		 * @returns obj
		 */
		twodigit : function(obj) {
			if (obj < 10) {
				obj = '0' + obj;
			}
			return obj;
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
			var defer = clutil.postDLJSON('AMBRV0070', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				if (data.rspHead.fieldMessages) {
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFocus($focusElem);
			}else{
				if (this.$('#searchAgain').css('display') == 'none') {
					clutil.setFocus($('#ca_srch'));
				} else {
					clutil.setFocus($('#searchAgain'));
				}
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
			this.mdBaseView.options.btn_csv = false;
			this.mdBaseView.renderFooterNavi();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex, e) {
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
				break;

			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
			return;

			}
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

			// 確定時用のデータを初期化
			this.savedReq = null;
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

		_eof: 'AMBRV0070.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView(clcom.pageArgs).initUIElement().render();

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
