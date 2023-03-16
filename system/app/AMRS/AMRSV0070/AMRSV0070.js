useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),

		events: {
			//'click #ca_btn_store_select'	: '_onStoreSelClick',		// 店舗選択補助画面起動
			'click #ca_srch'			: '_onSrchClick',			// 検索ボタン押下時
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

			var ope_date = clcom.getOpeDate();
			var ym = Math.floor(ope_date / 100);

			// 初期値を設定
			this.deserialize({
				targetYm: ym,						// 対象月（当月）
			});
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
		isValid: function(){
			return true;
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 商品分類体系コード/商品分類階層/上位分類コード・オートコンプリート設定チェック
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			//this.trigger('ca_onSearch', dto);
			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_eof: 'AMRSV0030.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		storeAutocomplete: null,

		events: {
			'click #searchAgain'	: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			'click #ca_btn_store_select': '_onStoreSelectClick',
			'click #ca_table1_tbody tr' : '_onTr1Click',
			'click #ca_table2_tbody tr' : '_onTr1Click',
			'click #ca_table3_tbody tr' : '_onTr3Click',
			// TODO 行クリックイベントがここに来る
		},

		_onStoreSelectClick: function() {
			var udata = clcom.getUserData();
			var func_id = Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID'));
			var r_org_id = udata.permit_top_org_id;
			this.AMPAV0010Selector.show(null, null, {
				org_kind_set: [am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
							   am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
							   am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
				func_id: func_id,
				org_id: r_org_id,
				f_stockmng: 1,
			});
		},

		initialize: function(opt) {
			_.bindAll(this);
			var _this = this;
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
					title: '補正件数',
					subtitle: '一覧',
					btn_csv: false,
					btn_new: false,
					//opeTypeId: o.opeTypeId,
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// 検索結果リスト（特殊な画面なので、検索結果リストは使わない）

			// 店舗部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});
			this.AMPAV0010Selector.render();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					var parentList = [];
					_.each(data[0].parentList, function(v) {
						parentList.push({
							id: v.store_id,
							code: v.code,
							name: v.name,
							orglevel_id: v.orglevel_id,
							orglevel_level: v.orglevel_level,
							orgfunc_id: v.orgfunc_id
						});
					});
					_this.storeAutocomplete.setValue({id: id, code: code, name: name, parentList: parentList});
				} else {
					var store = _this.storeAutocomplete.getValue();
					if (store.id == 0) {
						_this.AMPAV0010Selector.clear();
					}
				}
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
			this.AMPAV0010Selector.clear = function() {
				if (typeof mainView != "undefined") {
					_this.storeAutocomplete.resetValue();
				}
			};
			// 店舗オートコンプリート
			this.storeAutocomplete = clutil.clorgcode( {
				el : '#ca_storeID',
				dependAttrs : {
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					f_stockmng: 1,
				},
		    });

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
		},

		addMonth: function(ymd) {
			var y = Math.floor(ymd / 10000);
			var m = Math.floor((ymd / 100)) % 100;
			m += 1;
			if (m > 12) {
				m = 1;
				y += 1;
			}
			return y * 100 + m;
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function() {
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));

			// 年月セレクタ
			var fyyyymm = this.addMonth(clcom.getOpeDate());
			clutil.clmonthselector($("#ca_targetYm"), 1, 2, 0, null, fyyyymm, 1, 0, 'd');


//			if (clcom.userInfo && clcom.userInfo.org_id) {
//				// 組織表示
//				this.$('#ca_storeID').autocomplete('clAutocompleteItem', {
//					id: clcom.userInfo.org_id,
//					code: clcom.userInfo.org_code,
//					name: clcom.userInfo.org_name
//				});
//				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {
//					// 店舗ユーザー
//					clutil.inputReadonly($("#ca_storeID"));
//					clutil.inputReadonly($("#ca_btn_store_select"));
//				}
//			}

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

		changeYM: function(targetYm) {
			var ym = Number(targetYm);
			var year = Math.floor(ym / 100);
			var month = ym % 100;
			if (month <= 3) {
				// １～３月の場合は年を調整する
				year -= 1;
			}
			return (year * 100 + month).toString();
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				if(this.srchCondView.isValid()){
					srchReq = this.srchCondView.serialize();
				}else{
					// メッセージは、srchConcView 側で出力済。
					return;
				}
			}
//			this.changeYM(srchReq);

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
				reqPage: {},
				AMRSV0070ListReq: srchReq
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
			this.savedReq = req;

			// 検索実行
			this.doSrch(req, null, $('#ca_table'));
		},

		/**
		 *
		 * @param chkData
		 */
		pageArgsSrch: function(pageArgs) {
			var data = null;
			if (pageArgs.chkData.length > 0) {
				data = pageArgs.chkData[0];
				data.targetYM = pageArgs.targetYM;
			} else if (pageArgs.data != null) {
				data = {
					storeID: pageArgs.data.vpStoreID,
					storeCode: "",
					storeName: "",
					targetYM: pageArgs.data.vpTargetYm,
				};
			} else {
				return;
			}

			// 検索条件をセット
			if (data.storeCode != "" && data.storeName != "") {
				this.storeAutocomplete.setValue({id:data.storeID, code:data.storeCode, name:data.storeName});
			} else {
				this.storeAutocomplete.setValue(data.storeID);
			}
			//var targetYM = this.changeYM(data.targetYM);
			var targetYM = data.targetYM;
			$("#ca_targetYm").selectpicker('val', targetYM);

			var srchReq = {
				targetYm: targetYM,
				storeID: data.storeID,
				_view2data_storeID_cn: {
					id:data.storeID,
					code:data.storeCode,
					name:data.storeName
				},
			};
//			this.changeYM(srchReq);
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
				reqPage: {},
				AMRSV0070ListReq: srchReq
			};
			this.savedReq = req;

			// 検索実行
			this.doSrch(req, null, $('#ca_table'));
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param selectedIds 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, selectedIds, $focusElem){
			this.clearResult();

			var defer = clutil.postJSON('AMRSV0070', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var vendorList = data.AMRSV0070ListRsp.adjustVendorList;
				this.adjustList = data.AMRSV0070ListRsp.adjustList;
				this.adjustKannaiList = data.AMRSV0070ListRsp.adjustKannaiList;

				if(_.isEmpty(vendorList)){
					// 検索ペインを表示？
					mainView.srchAreaCtrl.reset();
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
				this.renderTable(data.AMRSV0070ListRsp);

				this.resetFocus($focusElem);
			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 検索ペインを表示
				mainView.srchAreaCtrl.reset();
				mainView.srchAreaCtrl.show_srch();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				this.resetFocus($focusElem);

			}, this));

			return defer;
		},

		getFromToDate: function(ym) {
			var year = Math.floor(ym / 100);
			var month = ym % 100;
			var from1, to1, from2, to2;
			var lm = month - 1;
			var ly;
			if (lm < 1) {
				lm = 12;
				ly = year - 1;
			} else {
				ly = year;
			}
			from1 = ly * 10000 + lm * 100 + 26;	// 前月26日から
			to1 = ym * 100 + 10;				// 当月10日まで
			from2 = ym * 100 + 11;				// 当月11日から
			to2 = ym * 100 + 25;				// 当月25日まで

			fromtoText1 = clutil.dateFormat(from1, 'yyyy/mm/dd(w)') + "～" + clutil.dateFormat(to1, 'yyyy/mm/dd(w)');
			fromtoText2 = clutil.dateFormat(from2, 'yyyy/mm/dd(w)') + "～" + clutil.dateFormat(to2, 'yyyy/mm/dd(w)');
			return {
				from1: from1,
				to1: to1,
				from2: from2,
				to2: to2,
				fromtoText1: fromtoText1,
				fromtoText2: fromtoText2,
			};
		},

		getMonthStr: function(ym) {
			var year = Math.floor(ym / 100);
			var month = ('00' + (ym % 100)).slice(-2);

			return year + "/" + month + "月度";
		},

		/**
		 * テーブル描画
		 * @param recs
		 */
		renderTable: function(listRsp) {
			var vendorList = listRsp.adjustVendorList;
			var adjustList = listRsp.adjustList;
			var adjustKannaiList = listRsp.adjustKannaiList;

			var opeDate = clcom.getOpeDate();

			// まずクリア
			$("#ca_table1_tbody").empty();
			$("#ca_table2_tbody").empty();
			$("#ca_table3_tbody").empty();

			var f_normal = false;
			var f_kannai = false;

			var fromtoObj = this.getFromToDate(this.savedReq.AMRSV0070ListReq.targetYm);
			// 補正業者でループ
			_.each(vendorList, _.bind(function(v) {
				if (v.kannaiFlag == 0) {
					// 通常

					// 期間を表示
					$("#ymd1").text(fromtoObj.fromtoText1);
					$("#ymd2").text(fromtoObj.fromtoText2);

					// ヘッダ描画
					$("#th_head1").text(v.vendorCode + ":" + v.vendorName);
					$("#th_head2").text(v.vendorCode + ":" + v.vendorName);

					// テーブルに表示
					_.each(adjustList, _.bind(function(adjust) {
						var $tbody;
						if (adjust.targetDate <= fromtoObj.to1) {
							$tbody = $("#ca_table1_tbody");
						} else {
							$tbody = $("#ca_table2_tbody");
						}
						var html = _.template($("#ca_tbody_template1").html(), adjust);
						$tbody.append(html);

						var $tr = $tbody.find('tr:last');
						if (adjust.targetDate < opeDate && adjust.dataFlag == 0) {
							$tr.addClass('alertCell');
						}
					}, this));

					f_normal = true;
				} else {
					// 館内業者

					// ヘッダ描画
					$("#th_head3").text(v.vendorCode + ":" + v.vendorName + "（館内）");

					// テーブルに描画
					_.each(adjustKannaiList, _.bind(function(kannai) {
						var obj = _.extend({
							monthstr: this.getMonthStr(kannai.month),
						}, kannai);

						var html = _.template($("#ca_tbody_template3").html(), obj);

						var $tbody = $("#ca_table3_tbody");
						$tbody.append(html);

						var $tr = $tbody.find('tr:last');
						if (fromtoObj.to2 < opeDate && kannai.dataFlag == 0) {
							$tr.addClass('alertCell');
						}
					}, this));

					f_kannai = true;
				}
			}, this));

			if (f_normal == false) {
				// 通常業者のテーブルを非表示
				$("#div_table1").hide();
				$("#div_table2").hide();
			} else {
				// 通常業者のテーブルを表示
				$("#div_table1").show();
				$("#div_table2").show();
			}
			if (f_kannai == false) {
				// 館内業者のテーブルを非表示
				$("#div_table3").hide();
			} else {
				// 館内業者のテーブルを表示
				$("#div_table3").show();
			}
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
		},

		/**
		 * 補正件数入力画面へ遷移
		 */
		_onTr1Click: function(e) {
			var url = clcom.appRoot + '/AMRS/AMRSV0080/AMRSV0080.html';
			var myData, destData;
			var aoki_unitID = clcom.getSysparam('PAR_AMMS_UNITID_AOKI');
			var storeVal = this.storeAutocomplete.getValue();
			var parentList = storeVal.parentList;
			var user_unit_id = clcom.getUserData().unit_id;
			var f_aoki = false;
			if (parentList != null) {
				_.each(parentList, _.bind(function(v) {
					if (v.id == aoki_unitID) {
						f_aoki = true;
						return false;
					}
				}, this));
			} else {
				if (user_unit_id == aoki_unitID) {
					f_aoki = true;
				}
			}

			var target = $(e.target);
			if (target.is("tr")) {

			} else {
				target = target.parents("tr");
			}
			var date = target.attr('id');
			var pindex = 0;
			var chkData = [];

			_.each(this.adjustList, _.bind(function(data, i) {
				var tmp = _.extend({
					storeID: this.savedReq.AMRSV0070ListReq.storeID,
					f_aoki: f_aoki
				}, data);
				chkData.push(tmp);
				if (data.targetDate == date) {
					pindex = i;
				}
			}, this));

			// 検索結果が無い場合
			myData = {
				savedReq: this.savedReq,
				savedCond: this.savedReq.AMRSV0070ListReq,
				selectedIds: chkData,
			};
			destData = {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
				srchDate: date,
				chkData: chkData,
				pageIndex: pindex
			};

			clcom.pushPage(url, destData, myData);
		},

		/**
		 * 補正件数入力(館内)画面へ遷移
		 */
		_onTr3Click: function(e) {
			var url = clcom.appRoot + '/AMRS/AMRSV0081/AMRSV0081.html';
			var myData, destData;

			var target = $(e.target);
			if (target.is("tr")) {

			} else {
				target = target.parents("tr");
			}
			var month = target.attr('id');
			var chkData = [];

			_.each(this.adjustKannaiList, _.bind(function(data, i) {
				var tmp = _.extend({
					storeID: this.savedReq.AMRSV0070ListReq.storeID,
				}, data);
				chkData.push(tmp);
			}, this));

			// 検索結果が無い場合
			myData = {
				savedReq: this.savedReq,
				savedCond: this.savedReq.AMRSV0070ListReq,
				selectedIds: chkData,
			};
			destData = {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
				srchDate: month + '01',
				chkData: chkData,
			};

			clcom.pushPage(url, destData, myData);
		},

		clearTable: function() {

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
			this.clearTable();
		},

		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(model) {
			// 条件部の復元
			if(!_.isEmpty(model.savedCond)){
				this.srchCondView.deserialize(model.savedCond);
				//$("#ca_targetYm").selectpicker('val', model.savedCond.orgTargetYm.toString());
				$("#ca_targetYm").selectpicker('val', model.savedCond.targetYm);
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}
		},

		_eof: 'AMSSV0030.MainView//'

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
		} else if(clcom.pageArgs) {
			// 補正件数確認から遷移してきた
			mainView.pageArgsSrch(clcom.pageArgs);
		} else {
			mainView.resetFocus($("#ca_storeID"));
		}
		var storeAutocomplete = mainView.storeAutocomplete;
		var utypeID = clcom.userInfo.user_typeid;
		if (utypeID === amcm_type.AMCM_VAL_USER_STORE ||
				utypeID === amcm_type.AMCM_VAL_USER_STORE_MAN) {
			// 店舗ユーザー
			storeAutocomplete.setValue({
				id: clcom.userInfo.org_id,
				name: clcom.userInfo.org_name,
				code: clcom.userInfo.org_code
			});
			clutil.inputReadonly('#ca_storeID');
			clutil.inputReadonly('#ca_btn_store_select');

			// 検索実行
			$("#ca_srch").trigger('click');
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