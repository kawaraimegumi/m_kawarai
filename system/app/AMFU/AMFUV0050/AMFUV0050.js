// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){
	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var CsvOutView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"change #ca_srchUnitID" : "_onUnitChange",
			"click #ca_btn_org_select" : "_onOrgSelClick" // 組織選択ボタン押下
		},
		itemList : {}, //インセンティブ商品部データ
		listNum : 0,
		uri : "AMFUV0050",
		initialize: function(){
			_.bindAll(this);
			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: 'インセンティブ商品販売点数出力',
				btn_submit: false,
				btn_csv: false
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});
			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		initUIelement : function(){
			var _this = this;
			this.mdBaseView.initUIElement();
			// validatorエラー時の表示領域
			$(".cl_echoback").hide();

			// 組織選択画面
			this.AMPAV0020Selector = new  AMPAV0020SelectorView({
				el : this.$('#ca_AMPAV0020_dialog'),	// 配置場所
				$parentView		: this.$('#mainColumn'),
				isAnalyse_mode	: false,			// 分析ユースかどうかフラグ？？？
				select_mode		: clutil.cl_single_select,	// 複数選択モード
				anaProc			: this.anaProc
			});
			// 初期化
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

//			clutil.clmonthselector(this.$("#ca_srchYm"), 0, 1, 0, null, null, 1); //初期表示調整(長すぎ)
			clutil.clyearmonthcode({el:this.$("#ca_srchYm")}).setValue(clutil.monthFormat(clcom.getOpeDate(), "yyyymm"));
			clutil.clstaffcode2($("#ca_srchStaffID"));
			// 事業ユニット取得
			return clutil.clbusunitselector(this.$('#ca_srchUnitID'));
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();

			if (clcom.userInfo.unit_id) {
				this.$("#ca_srchUnitID").selectpicker('val', clcom.userInfo.unit_id);
				this._onUnitChange();
			}
			// need_org_filterなら
			if(clcom.userInfo.need_org_filter){
				// 組織選択をrequiredにする。
//				this._onUnitChange();
				this.$("#ca_srchOrgID").addClass("cl_required");
				this.$("#ca_srchOrgID").parent().parent().addClass("required");
				this.orgAutocomplete.setValue({
					id : clcom.userInfo.org_id,
					code : (clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_AREA_LEVELID')) ||
							clcom.userInfo.org_kind_typeid == Number(clcom.getSysparam('PAR_AMMS_ZONE_LEVELID')))
							? '' : clcom.userInfo.org_code,
					name : clcom.userInfo.org_name
				});
			}
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
				AMFUV0050GetReq: srchDto
			};

			return reqDto;
		},

		/**
		 * 出力ボタン押下処理
		 */
		doCSVDownload: function(rtyp) {
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}
			// 要求を送出
			var defer = clutil.postDLJSON('AMFUV0050', srchReq);
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
			this.AMPAV0020Selector.show(null, false, func_id, null, null, r_org_id);
		}
	});

	clutil.getIniJSON(null, null)
	.done(_.bind(function(data,dataType){
		var ca_csvOutView = new CsvOutView;
		ca_csvOutView.initUIelement().done(_.bind(function(){
			ca_csvOutView.render();
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.setFocus($('#ca_srchYm'));
			}
			else{
				clutil.setFocus($('#ca_srchUnitID'));
			}
		},this));
	},this)).fail(function(data){
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
