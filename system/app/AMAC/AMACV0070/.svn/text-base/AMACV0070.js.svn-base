/**
 * 会計・経理 売掛実績一覧出力
 */
// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			"change #ca_srchUnitID" : "_onUnitChange",
			"click #ca_btn_org_select" : "_onOrgSelClick"		// 組織選択ボタン押下
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '売掛実績一覧出力',
				btn_submit: false
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			var _this = this;
			this.mdBaseView.initUIElement();

			// 組織選択画面
			this.AMPAV0020Selector = new  AMPAV0020SelectorView({
				el : this.$('#ca_AMPAV0020_dialog'),	// 配置場所
				$parentView		: this.$('#mainColumn'),
				isAnalyse_mode	: false,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_single_select,	// 複数選択モード
				anaProc			: this.anaProc
			});
			this.AMPAV0020Selector.clear = function(){
				_this.orgAutocomplete.resetValue();
			};

			//サブ画面復帰後処理
			this.AMPAV0020Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					data[0].id = data[0].val;
					_this.orgAutocomplete.setValue(data[0]);
				} else {
					var org = _this.orgAutocomplete.getValue();
					if (org.id == 0) {
						_this.AMPAV0020Selector.clear();
					}
				}
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_org_select"));
				});
			};

			this.AMPAV0020Selector.render();
			// 組織コンプリート
			this.orgAutocomplete = this.getOrg(clcom.userInfo.unit_id);

//			clutil.clmonthselector(this.$("#ca_srchMonth"), 0,5,5,null,null,1,0);
			clutil.clyearmonthcode({el:this.$("#ca_srchMonth")});

			// 事業ユニット取得
			return clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);
//			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			// need_org_filterなら
			if(clcom.userInfo.need_org_filter){
				// 組織選択をrequiredにする。
				this._onUnitChange();
				this.$("#ca_srchOrgID").addClass("cl_required");
				this.$("#ca_srchOrgID").parent().parent().addClass("required");
				this.orgAutocomplete.setValue({
					id : clcom.userInfo.org_id,
					code : clcom.userInfo.org_code,
					name : clcom.userInfo.org_name
				});
			}
			clutil.setFocus(this.$("#ca_srchUnitID"));
			return this;
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				console.log('CSV 出力');
				this.doCSVDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		buildReq: function(rtyp){
			// validation
			if (!this.validator.valid()) {
				return null;
			}

			//リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMACV0070GetReq: srchDto
			};

			return reqDto;
		},

		doCSVDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			var defer = clutil.postDLJSON('AMACV0070', srchReq);
			defer.fail(_.bind(function(data){
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		// 事業ユニットと参照ボタンの連携
		_onUnitChange : function(e){
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
					p_org_id: unitID,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				}
			});
		},

		_onOrgSelClick: function(e) {
			if(this.$("#ca_srchUnitID").val() == 0){
				return;
			}
			var r_org_id = Number(this.$("#ca_srchUnitID").val());

			//体系セレクト
			func_id = Number(clutil.getclsysparam("PAR_AMMS_DEFAULT_ORG_FUNCID", 1));
			this.AMPAV0020Selector.show(null, false, null, null, null, r_org_id);
		}
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView();
		mainView.initUIElement().done(_.bind(function(){
			mainView.render();
		}, this));
	}).fail(function(data){
		console.error('iniJSON failed.');
		console.log(arguments);
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});


});