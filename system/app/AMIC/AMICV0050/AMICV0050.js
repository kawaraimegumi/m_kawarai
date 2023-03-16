/**
 * 棚卸売上修正
 */

useSelectpicker2();

/**
 * ブラウザのウィンドウサイズに合わせて、データグリッドの高さを調整する
 * @param options
 * @return
 */
var ResizeWatcher = function(options){
	this.options = options;
	_.defaults(options, {
		//minHeight: 250
		//minHeight: 150
		minHeight: 288
	});
	this.$el = options.$el;
	this.$container = $(window);
	this.setSize = _.debounce(this.setSize, 100);
	this.start();
};

_.extend(ResizeWatcher.prototype, Backbone.Events, {
	resize: function(){
		var windowHeight = window.innerHeight;
		var offset = this.$el.offset();
		var height = windowHeight - offset.top - 140;
		if (this.previousHeight != height){
			this.setSize({
				height: height
			});
		}
	},

	setSize: function(size){
		this.$el.height(Math.max(size.height, this.options.minHeight));
		this.trigger('resize');
		this.previousHeight = size.height;
	},

	start: function(){
		var that = this;
		this.tid = setInterval(function(){
			that.resize();
		}, 200);
	},

	stop: function(){
		if (this.tid){
			clearTimeout(this.tid);
		}
	}
});

$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// カラム定義
	var columns = [
	    {
	    	id: 'tagCode',
	    	name: 'タグコード',
	    	field: 'tagCode',
	    	width: 140
	    },
	    {
	    	id: 'invQy',
	    	name: '棚卸数',
	    	field: 'invQy',
	    	width: 100,
	    	cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
	    },
	    {
	    	id: 'salesQy',
	    	name: 'HT読取後売上数',
	    	field: 'salesQy',
	    	width: 130,
	    	cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
	    },
	    {
	    	id: 'fixInvQy',
	    	name: '修正後棚卸数',
	    	field: 'fixInvQy',
	    	width: 100,
	    	cssClass: 'txtalign-right',
			cellType: {
				// カンマ区切り
				formatFilter: 'comma'
			}
	    },
	    {
	    	id: 'stditgrpDispName',
	    	name: '品種',
	    	field: 'stditgrpDispName',
	    	width: 210
	    },
	    {
	    	id: 'makerCode',
	    	name: 'メーカー品番',
	    	field: 'makerCode',
	    	width: 120
	    },
	    {
	    	id: 'itemName',
	    	name: '商品',
	    	field: 'itemName',
	    	width: 430
	    }
    ];

	/**
	 * データグリッドのカラム作成
	 */
	function buildColumns() {
		var cols = _.deepClone(columns);
		return cols;
	}

	var _unitID = "";
	var _savedReq = null;

	//////////////////////////////////////////////
	// 条件入力部
	var SrchCondView = Backbone.View.extend({

		el: $('#ca_srchArea'),

		/**
		 * イベント
		 */
		events: {
			'click #ca_srch'					: '_onSrchClick'			// 検索ボタン押下時
		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		/**
		 *  初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			clutil.inputlimiter(this.$el);

			this.relation = clutil.FieldRelation.create("default", {
				// 店舗
				clorgcode: {
					el: '#ca_srchStoreID',
					branches: ['unit_id']
				},

				// 棚卸スケジュール用対象期取得部品
				clinventcntschselector: {
					el: this.$('#ca_srchYearMonth'),
					addDepends: ['org_id']
				}
			}, {
				dataSource: {
					// 上位組織を事業ユニットIDで選択されているものに設
					// 定する => たぶん指定してはだめ
					// p_org_id: unit,
					orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
					orglevel_id: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
					f_stockmng: 1
				}
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
			return this.validator.valid();
		},

		/**
		 * 検索条件の入力ブロッキング/解除
		 */
		setEnable: function(enable){
			if(enable){
				clutil.viewRemoveReadonly(this.$el);
			}else{
				clutil.viewReadonly(this.$el);
			}
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {

			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			this.trigger('ca_onSearch', dto);
		},

		_eof: 'AMICV0050.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({

		el:	$('#ca_main'),

		events: {
			'click #ca_btn_store_select'	: '_onStoreSelClick',	// 店舗選択
			'keydown #ca_tagCode'				: function(e){
				switch (e.which) {
				case 9:			// TAB
				case 108:		// NUMPAD ENTER
				case 13:		// ENTER
					this._onTagCodeInput();
					break;
				}
			},	// タグコード入力

			'click #searchAgain'			: '_onSearchAgainClick',// 検索条件を再指定ボタン押下

			'click #ca_btn_salesQy_Down'	: 'clickBtnSalesQyDown',// HT読取後売上数-ボタン
			'click #ca_btn_salesQy_Up'		: 'clickBtnSalesQyUp',	// HT読取後売上数+ボタン

			'click #btn_inventcount'		: 'clickBtnInventCount'	// 棚卸数取得
		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){

			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({

				opeTypeId:  am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,

				title: '棚卸売上修正',
				subtitle: '',
				btn_submit: true,
				btn_new: false,

				// キャンセルボタンのコールバック
				btn_cancel:{label:'条件再設定', action:this._doCancel},

				// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
				// リクエストビルダ関数を渡しておく。
				buildSubmitReqFunction: this._buildSubmitReqFunction

			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// グループID -- AMICV0050 なデータに関連することを表すためのマーキング文字列
			//var groupid = 'AMICV0050';

			//タグコードのフィールドカウント
			clutil.cltxtFieldLimit($("#ca_tagCode"));

			///////////////// 検索結果データグリッドの表示
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid',
				delRowBtn: true		// 行削除ボタンを使用するフラグ
				// footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ
			});

			var _this = this;

			this.dataGrid.on('grid:init:after', function() {
				// グリッドのtabindexを-1にする
				_this.dataGrid.$el.find('[tabindex]').each(function(){$(this).attr('tabindex', -1);});
			});

			this.resizeWatcher = new ResizeWatcher({
				$el: this.dataGrid.$el
			});

			// 行削除フラグを行データに設定する
			this.dataGrid.on('row:delToggle', function(args){
				args.item.isDeleted = args.isDeleted;
			});

			this.dataGrid.getMetadata = this.getMetadata;

			//var mainView = this;
			this.dupFlg = false;
			//var invItemList = [];

			// データグリッドのクリックイベントを実装する
			this.listenTo(this.dataGrid, {

				'cell:click': function(args){
					console.log('==== cell:click', args);

					if(args.row >= 2){

						// タグコードテキストボックスのエラー状態をクリア
						this.validator.clearErrorMsg(this.$('#ca_tagCode'));

						// 合計行以外をクリックしたら、クリック行の内容を商品情報表示エリアに
						// 表示する
						this.updateTagInfo(args.item);
					}

					// タグコードテキストボックスにフォーカス
					clutil.setFocus(this.$("#ca_tagCode"));
				}

			});

			// 店舗部品
			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: $("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	$("#mainColumn"),
				select_mode : clutil.cl_single_select,		// 単一選択
				isAnalyse_mode : false	// 通常画面モード
			});

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = _.bind(function(data) {
				if (data !== null && data.length == 1) {
					data[0].id = data[0].val;
					// 組織表示
					this.srchCondView.relation.fields.clorgcode.setValue(data[0]);
				};
				_.defer(function(){// setFocusを_.defer()で後回しにする
					// 参照ボタンにフォーカスする
					clutil.setFocus(this.$("#ca_btn_store_select"));
				});
			},this);

			// イベント
			this.srchCondView.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント

			// 外部イベントの購読設定
			// Submit結果のデータを購読する。
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			// ツールチップ
			$("#ca_tp_code1").tooltip({html: true});
		},

		/**
		 * 合計行の表示
		 */
		getMetadata: function(rowIndex){
			if (rowIndex === 0) {
				return {
					cssClasses: 'reference',
					rowDelProtect: true
				};
			}
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();

			this.AMPAV0010Selector.render();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));

			return this;
		},

		/**
		 * タグコードを入力
		 */
		_onTagCodeInput: function(){

			var options = this.dataGrid.grid.getOptions();
			if (options.editable == false) {
				return;
			}

			var $ca_stditgrpDispName = this.$("#ca_stditgrpDispName");
			var $ca_makerCode = this.$("#ca_makerCode");
			var $ca_itemName = this.$("#ca_itemName");
			var $ca_invQy = this.$("#ca_invQy");
			var $ca_salesQy = this.$("#ca_salesQy");
			var $ca_fixInvQy = this.$("#ca_fixInvQy");

			var existFlag = false;
			var resultInfo = clutil.view2data(this.$('#result'));

			if(!resultInfo.tagCode) {

				// タグ情報エリアをクリア
				// 品種
				$ca_stditgrpDispName.text('');

				// メーカー品番
				$ca_makerCode.text('');

				// 商品
				$ca_itemName.text('');

				// 棚卸数
				$ca_invQy.text('');

				// HT読取後売上数
				$ca_salesQy.text('');

				// 修正後棚卸数
				$ca_fixInvQy.text('');

			} else {

				// タグコード検索リクエスト
				var req0 = {
					code : resultInfo.tagCode,
					unitID : _unitID
				};

				// タグコード検索
				clutil.cltag2variety(req0);

				clutil.mediator.once('onCLtag2varietyCompleted', _.bind(function(args){

					if(args.status == 'OK'){

						if(args.data.head.message === "cl_nodata") {

							// マスタに存在しないタグコードを指定した場合はエラー
							var msg = clutil.fmt(clutil.getclmsg('EGM0016'),resultInfo.tagCode);
							this.validator.setErrorMsg($("#ca_tagCode"), msg);
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
						} else {

							// 品種をタグ情報エリアに表示する
							$ca_stditgrpDispName.text(args.data.rec.varietyCode + ':' + args.data.rec.varietyName);

							// メーカー品番をタグ情報エリアに表示する
							$ca_makerCode.text(args.data.rec.makerItemCode);

							// 商品をタグ情報エリアに表示する
							$ca_itemName.text(args.data.rec.itemName);

							// 棚卸数
							//$ca_invQy.text(myInvQy); /*0*/

							// HT読取後売上数
							$ca_salesQy.text(1);

							// 修正後棚卸数
							//this.$('#ca_fixInvQy').text(myInvQy - 1);

							// 入力されたタグコードが登録済みか調べる
							var invItemList = this.dataGrid.getData({filterFunc: function(item){
								return Boolean(item.totalRecFlag);
							}});

							if(!_.isEmpty(invItemList)) {

								for(var i=0; i < invItemList.length; i++) {
									if(invItemList[i].itemID === args.data.rec.colorSizeItemID) {
										// 商品IDが一致する→登録済みの商品である

										existFlag = true;

										// タグ情報エリアに表示する

										// 棚卸数
										$ca_invQy.text(invItemList[i].invQy);

										// HT読取後売上数
										var newSalesQy = invItemList[i].salesQy + 1;
										$ca_salesQy.text(newSalesQy);

										// 修正後棚卸数
										if (invItemList[i].f_inv === true) {
											var newFixInvQy = invItemList[i].invQy - newSalesQy;
											$ca_fixInvQy.text(newFixInvQy);
											invItemList[i].fixInvQy = newFixInvQy;
										}

										invItemList[i].salesQy = newSalesQy;

										break;
									}
								}
							}

							if (existFlag === true) {

								// 登録済みの商品の場合
								var data = [];

								// 合計を更新
								var sumDto = this.calcSummary(invItemList);
								data[0] = _.deepClone(sumDto);

								// 表の中身を更新
								for(var i=0; i < invItemList.length; i++) {
									data[i+1] = _.deepClone(invItemList[i]);
								}

								this.dataGrid.setData({
									gridOptions: {
										rowHeight: 24,
										autoHeight: false,
										frozenRow: 2
									},
									columns: buildColumns(),
									data: data,
									rowDelToggle: true,
									graph: this.graph
								});
							}

							if (existFlag === false) {
								// 新規商品を登録しようとしている場合

								// タグコードを表示する
								var newRec = {
									invItemID: 0,			// 未設定
									fixInvQy: "",			// 未設定
									invQy: "",				// 未設定
									itemName: args.data.rec.itemName,
									salesQy: 1,
									stditgrpDispName: args.data.rec.varietyCode + ':' + args.data.rec.varietyName,
									tagCode: resultInfo.tagCode,
									makerCode: args.data.rec.makerItemCode,
									itemID: args.data.rec.colorSizeItemID
								};
								var tmp_data = [];
								tmp_data[0] = _.deepClone(newRec);

								for(var i=1; i < invItemList.length + 1; i++) {
									tmp_data[i] = invItemList[i - 1];
								}
								var data = [];

								// 合計を更新
								var sumDto = this.calcSummary(tmp_data);
								data[0] = _.deepClone(sumDto);

								for(var i=0; i < tmp_data.length; i++) {
									data[i+1] = _.deepClone(tmp_data[i]);
								}

								this.dataGrid.setData({
									gridOptions: {
										rowHeight: 24,
										autoHeight: false,
										frozenRow: 2
									},
									columns: buildColumns(),
									data: data,
									rowDelToggle: true,
									graph: this.graph
								});

								this.$('#ca_btn_salesQy_Down').prop('disabled', true);
								this.$('#ca_btn_salesQy_Up').prop('disabled', true);


							}
							this.renderDeleteRow();
							clutil.setFocus(this.$("#ca_tagCode"));
						}
					} else {
						// タグコード検索に失敗したときはエラー

						var msg = clutil.fmt(clutil.getclmsg('EGM0016'),resultInfo.tagCode);
						this.validator.setErrorMsg($("#ca_tagCode"), msg);
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
					}
				},this));
			}
		},

		/**
		 * this.recListView にGET応答データをセットする。
		 */
		setDataToRecListView: function(data){

			// 店舗の属する事業ユニットを取得する
			var orgAttrs = this.srchCondView.relation.fields.clorgcode.getAttrs();
			_unitID = orgAttrs && orgAttrs.unit_id;

			// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」

			if(_.isEmpty(data.AMICV0050GetRsp)){

				// 画面を一旦リセット
				mainView.srchAreaCtrl.reset();
				// 検索ペインのみ表示する
				mainView.srchAreaCtrl.show_srch();

				// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

				// キャンセル・登録ボタンを非表示にする
				$("#mainColumnFooter").hide();
				$("#btn_inventcount").hide();

				return;
			}

			//var recInvState = data.AMICV0050GetRsp.invState;
			var recInvItemList = data.AMICV0050GetRsp.invItemList;

			if(_.isEmpty(recInvItemList) || recInvItemList.length === 0){
				//// AMICV0050画面の場合、InvItemListの空は許容する
				//
				// // 画面を一旦リセット
				// mainView.srchAreaCtrl.reset();
				// // 検索ペインのみ表示する
				// mainView.srchAreaCtrl.show_srch();
				//
				// // ヘッダにエラーメッセージを表示：「検索結果は0件です。」
				// clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
				//
				// // キャンセル・登録ボタンを非表示にする
				// $("#mainColumnFooter").hide();
				//
				// return;
			}

			// 結果ペインを表示
			this.srchAreaCtrl.show_result();

			// キャンセル・登録ボタンを表示する
			$("#mainColumnFooter").show();
			$("#btn_inventcount").show();

			// 内容物がある場合 --> 結果表示する。
			// (1) 合計
			var sumDto = this.calcSummary(recInvItemList);

			// (2) 表の中身
			var data = [];

			data[0] = _.deepClone(sumDto);

			for(var i=0; i < recInvItemList.length; i++) {

				data[i+1] = _.deepClone(recInvItemList[i]);
				data[i+1].f_inv = true;

			}

			// 検索結果をデータグリッドに表示する
			this.dataGrid.render().setData({
				gridOptions: {
					rowHeight: 24,
					autoHeight: false,
					frozenRow: 2
				},
				columns: buildColumns(),
				data: data,
				rowDelToggle: true,
				graph: this.graph
			});

		},

		/**
		 * Submit 応答のイベントを受ける
		 */
		_onMDSubmitCompleted: function(args, e){

			switch(args.status){

			case 'DONE':		// 確定済
				this.dataGrid.setEnable(false);
				clutil.viewReadonly($("#result"));

				break;

			case 'CONFLICT':	// 別のユーザによって DB が更新された
				clutil.viewReadonly($("#result"));
				break;
			case 'DELETED':		// 別のユーザによって削除された
				clutil.viewReadonly($("#result"));
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				//  入力値エラー情報が入っていれば、個別 View へセットする。

				// XXX どうなるか・・・・
				// this.recListViewValidator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				//var msg = clmsg[args.data.rspHead.message];
				//this.recListViewValidator.setErrorInfoFromSrv(args.data.rspHead.message, {prefix: 'ca_'});

				break;
			}
		},

		/**
		 * 画面描画
		 */
		render: function() {

			this.mdBaseView.render().setSubmitEnable(false);

			this.srchCondView.render();

			// グリッドにデータを設定する
			this.dataGrid.render().setData({
				gridOptions: {
					rowHeight: 24,
					autoHeight: false,
					frozenRow: 2
				},
				columns: buildColumns(),
				data: [],
				rowDelToggle: true,
				graph: this.graph
			});

			// キャンセルボタン・登録ボタンは非表示にする
			$("#mainColumnFooter").hide();
			$("#btn_inventcount").hide();

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE) {

				// ログインユーザが店舗ユーザの場合は初期フォーカスを対象期にセットする
				clutil.setFocus(this.$("#ca_srchYearMonth"));

			} else {

				// ログインユーザが店舗ユーザ以外の場合は初期フォーカスを店舗にセットする
				clutil.setFocus(this.$("#ca_srchStoreID"));
			};

			return this;
		},

		/**
		 * タグ情報エリアに表示する
		 */
		updateTagInfo: function(item){

			var getval = function(item, propname){
				var s = (item) ? item[propname] : null;
				if(_.isNumber(s)){
					s = clutil.comma(s);
				}
				return _.isEmpty(s) ? '' : s;
			};

			var options = this.dataGrid.grid.getOptions();
			if (options.editable == false) {
				return;
			}

			// タグコード
			this.$('#ca_tagCode').val(getval(item, 'tagCode'));

			// 品種
			this.$('#ca_stditgrpDispName').text(getval(item, 'stditgrpDispName'));

			// メーカー品番
			this.$('#ca_makerCode').text(getval(item, 'makerCode'));

			// 商品
			this.$('#ca_itemName').text(getval(item, 'itemName'));

			// 棚卸数
			this.$('#ca_invQy').text(clutil.comma(getval(item, 'invQy')));

			// HT読取後売上数
			this.$('#ca_salesQy').text(clutil.comma(getval(item, 'salesQy')));

			// 修正後棚卸数
			this.$('#ca_fixInvQy').text(clutil.comma(getval(item, 'fixInvQy')));

			if (item != null && item.f_inv === true) {
				this.$('#ca_btn_salesQy_Down').prop('disabled', false);
				this.$('#ca_btn_salesQy_Up').prop('disabled', false);
			} else {
				this.$('#ca_btn_salesQy_Down').prop('disabled', true);
				this.$('#ca_btn_salesQy_Up').prop('disabled', true);
			}
			// +,-ボタンの状態をリセットする TODO
//			if(item && item.salesQy >= 1) {
//				this.$('#ca_btn_salesQy_Down').prop('disabled', false);
//			} else {
//				this.$('#ca_btn_salesQy_Down').prop('disabled', true);
//			}
		},

		/**
		 * 店舗［参照］ボタンクリック
		 */
		_onStoreSelClick: function(e){

			// this.AMPAV0010Selector.show(null, null);

			var org_id = null;

			if (clcom.userInfo.unit_id === Number(clcom.getSysparam('PAR_AMMS_UNITID_HD'))){
				// ログインユーザが事業ユニット(AOKI-HD)に属するユーザの場合
				org_id = null;

			} else {
				// それ以外の場合
				org_id = clcom.userInfo.unit_id;
			}

			/*var options = {
				func_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
				org_id	: org_id
			};*/

			var options = {
				func_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),		//基本組織を対象
				org_kind_set :[am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
					           am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
					           am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ],
				org_id	: org_id,
				f_stockmng: 1 //在庫管理有無フラグ(1:在庫有り店舗のみ))
			};

			this.AMPAV0010Selector.show(null, null, options);
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				if(!this.srchCondView.isValid()){
					return null;
				}
				srchReq = this.srchCondView.serialize();
			}

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0			// CSV取込などで使用する
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMICV0050GetReq: srchReq
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
		 * @param chkData 初期選択行データ（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){

			this.updateTagInfo(null);

			this.savedGetData = null;

			//タグコードのフィールドカウント
			clutil.cltxtFieldLimit($("#ca_tagCode"));

			this.$('#ca_btn_salesQy_Up').prop('disabled', false);
			this.$('#ca_btn_salesQy_Down').prop('disabled', false);

			var defer = clutil.postJSON('AMICV0050', srchReq).done(_.bind(function(data){

				// リクエストを保存。
				this.savedReq = srchReq;
				_savedReq = srchReq;

				// 検索結果を保存
				this.savedGetData = data;

				// 内容物がある場合 --> 結果表示する。
				this.setDataToRecListView(data);

				// タグコードテキストボックスにフォーカス
				clutil.setFocus(this.$("#ca_tagCode"));

				if(data.AMICV0050GetRsp.invState.invStateID !== amcm_type.AMCM_VAL_INV_STATE_INV_NOT_REPORTED) {

					// XXX:報告状態が「未報告」でない場合、タグコードテキストボックスは入力不可
					clutil.inputReadonly($("#ca_tagCode"),true);

					// XXX:報告状態が「未報告」でない場合、「+/-」ボタンは押下不可
					clutil.inputReadonly($("#ca_btn_salesQy_Down"),true);
					clutil.inputReadonly($("#ca_btn_salesQy_Up"),true);

					// XXX:報告状態が「未報告」でない場合、「登録」ボタンは押下不可
					mainView.mdBaseView.setSubmitEnable(false);

				} else {

					// 報告状態は「未報告」である場合

					// 現在年月日を取得
					var opeDate = clcom.getOpeDate();

					if(opeDate < data.AMICV0050GetRsp.invState.noticeDate) {

						// XXX:現在年月日 < 店舗通知日の場合、タグコードテキストボックスは入力不可
						clutil.inputReadonly($("#ca_tagCode"),true);

						// XXX:現在年月日 < 店舗通知日の場合、「+/-」ボタンは押下不可
						clutil.inputReadonly($("#ca_btn_salesQy_Down"),true);
						clutil.inputReadonly($("#ca_btn_salesQy_Up"),true);

						// XXX:現在年月日 < 店舗通知日の場合、「登録」ボタンは押下不可
						mainView.mdBaseView.setSubmitEnable(false);

					} else {
						// XXX:現在年月日 >= 店舗通知日の場合

						// タグコードテキストボックスは入力可
						clutil.inputReadonly($("#ca_tagCode"),false);

						// 「+/-」ボタンは押下可能
						clutil.inputReadonly($("#ca_btn_salesQy_Down"),false);
						clutil.inputReadonly($("#ca_btn_salesQy_Up"),false);

						// 「登録」ボタンは押下可能
						mainView.mdBaseView.setSubmitEnable(true);

						// ログインユーザの所属店舗がRFID対象店舗の場合「登録」ボタンは押下不可
						var user_store = clcom.userInfo['org_id'];
						var json = localStorage.getItem('clcom.rfidstore');
						var rfid_list = JSON.parse(json);
						var rfid_flg = 0;
						if (clcom.userInfo.user_typeid === amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
							if (rfid_list.includes(user_store)) {
								rfid_flg = 1;
							}
						}
						if (rfid_flg == 1) {
							mainView.mdBaseView.setSubmitEnable(false);
						}
					}
				}

			}, this)).fail(_.bind(function(data){

				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// キャンセルボタン・登録ボタンは非表示にする
				$("#mainColumnFooter").hide();
				$("#btn_inventcount").hide();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

			}, this));

			return defer;
		},

		/**
		 * 合計値を計算する。
		 */
		calcSummary: function(collection){
			var sumIniDto = {
				tagCode: '合計',
				totalRecFlag: true,
				invQy: 0,
				salesQy: 0,
				fixInvQy: 0,
				stditgrpDispName: null,
				itemName: null
			};
			return _.reduce(collection, function(sumDto, dto){
				for(var key in dto){
					switch(key){

					case 'tagCode':	// タグコード -- 不要
						break;
					case 'stditgrpDispName':	// 品種 -- 不要
						break;
					case 'makerCode':			// メーカー品番 -- 不要
					case 'itemName':	// 商品 -- 不要
						break;
					default:
						if (_.isNumber(dto[key])) {
							sumDto[key] += dto[key];
						}
					}
				}
				return sumDto;
			}, sumIniDto);
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFirstFocus($focusElem);
			}else{
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){

			this.mdBaseView.clear();

			this.srchAreaCtrl.show_srch();

			// Excelボタンは非表示にする
			$("#mainColumnFooter").hide();
			$("#btn_inventcount").hide();
		},

		/**
		 * 棚卸数取得ボタン押下
		 * @param e
		 */
		clickBtnInventCount: function(e) {
			// 入力されたタグコードが登録済みか調べる
			var invItemList = this.dataGrid.getData({filterFunc: function(item){
				return Boolean(item.totalRecFlag);
			}});
			var itemList = [];
			for (var i = 0; i < invItemList.length; i++) {
				if (invItemList[i].f_inv !== true && invItemList[i].tagCode != "") {
					// 棚卸数未取得
					itemList.push(invItemList[i].tagCode);
				}
			}
			var qyReq = _.deepClone(_savedReq);

			qyReq.AMICV0050GetReq.itemList = itemList;

			clutil.postJSON('AMICV0050', qyReq).done(_.bind(function(data) {
				// 検索に成功したら棚卸数を出す
				if(data != null && data.AMICV0050GetRsp != null &&
						data.AMICV0050GetRsp.invItemList != null &&
						data.AMICV0050GetRsp.invItemList.length > 0){
					var dataRec = [];
					for (var i=0; i < invItemList.length; i++) {
						var inv = invItemList[i];
						if (inv.f_inv === true) {
							// 取得済みなのでスルー
							dataRec.push(inv);
							continue;
						}
						for (var j=0; j < data.AMICV0050GetRsp.invItemList.length; j++) {
							var ninv = data.AMICV0050GetRsp.invItemList[j];
							if (inv.itemID == ninv.itemID) {
								var newSalesQy = ninv.salesQy + inv.salesQy;
								var newFixInvQy = ninv.invQy - inv.salesQy;
								var newRec = {
									invItemID: ninv.invItemID,
									fixInvQy: newFixInvQy,
									invQy: ninv.invQy,
									itemName: ninv.itemName,
									salesQy: newSalesQy,
									stditgrpDispName: inv.stditgrpDispName,
									tagCode: ninv.tagCode,
									makerCode: ninv.makerCode,
									itemID: inv.itemID,
									f_inv: true
								};
								if (inv.isDeleted === true) {
									newRec.isDeleted = inv.isDeleted;
								}
								dataRec.push(newRec);
								break;
							}
						}
					}
					// 合計を更新
					var sumDto = this.calcSummary(dataRec);
					dataRec.unshift(sumDto);
					this.dataGrid.setData({
						gridOptions: {
							rowHeight: 24,
							autoHeight: false,
							frozenRow: 2
						},
						columns: buildColumns(),
						data: dataRec,
						rowDelToggle: true,
						graph: this.graph
					});
					// 削除した行の復旧
					this.renderDeleteRow();
				}
				// フォーカスをタグコードにセット
				clutil.setFocus(this.$("#ca_tagCode"));
			}, this)).fail(_.bind(function(data) {
				var msg = data.rspHead.message || 'cl_echoback';
				clutil.mediator.trigger('onTicker', clutil.getclmsg(msg));
			}, this));
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){

			// 編集データをクリア
			this.savedGetData = null;

			// 検索条件を再指定
			this.srchAreaCtrl.show_srch();

			/*this.srchCondView.setEnable(true);
			this.srchAreaCtrl.reset();*/

			// 登録ボタンを不活性、内部GETデータ破棄、リボンメッセージ非表示・・・など
			this.mdBaseView.clear();

			// 下部ボタン群は非表示にする
			$("#mainColumnFooter").hide();
			$("#btn_inventcount").hide();

		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId){

			// 入力項目のチェック
			if(!this.validator.valid()) {
				return null;
			}

			// 棚卸数＜ＨＴ読込後売上数の場合はエラー


			// 空チェック関数
			//var tailEmptyChecker = ClGrid.getEmptyCheckFunc(this.dataGrid);
			// 合計行以外

			// 店舗別設定データグリッドの入力エラーチェック
			/*if(this.dataGrid.isValid({tailEmptyCheckFunc: tailEmptyChecker, filter: function(item){
				return Boolean(item.totalRecFlag) || Boolean(item.isDeleted);
			}}) === false) {

				// 入力項目の最大桁数オーバー、入力必須項目が未入力の場合は
				// エラーとし、returnする

				clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

				return;
			}*/

			var invState = this.savedGetData.AMICV0050GetRsp.invState;

			var invItemList = this.dataGrid.getData({
				delflag: false,
				//tailEmptyCheckFunc:  tailEmptyChecker,
				filterFunc: function(item){
					return Boolean(item.totalRecFlag);
				}
			});

			if(!_.isEmpty(invItemList)) {

				var has_error = null;

				// 棚卸明細リストのループ
				_.each(invItemList, function(data){

					// 行のID
					var rowId = data[this.dataGrid.idProperty];

					if (data.invQy === "") {
						// 売上数が棚卸数より大きい場合は警告を表示する。
						var msg = clutil.fmt(clutil.getclmsg('WIC0002'));
						this.dataGrid.setCellMessage(rowId, 'invQy', 'warn', msg);
					} else if(data.salesQy > data.invQy) {
						// 売上数が棚卸数より大きい場合は警告を表示する。
						var msg = clutil.fmt(clutil.getclmsg('WIC0001'),data.salesQy,data.invQy);
						this.dataGrid.setCellMessage(rowId, 'salesQy', 'warn', msg);
					}

				}, this);
				_.each(invItemList, function(data){
					if (data.f_inv !== true) {
						// 棚卸数取得未実施
						if (has_error == null) {
							has_error = clmsg.EIC0025;
						}
						return false;
					}
					if (data.fixInvQy < 0) {
						// 修正後棚卸数が負の場合はエラーとする
						if (has_error == null) {
							has_error = clmsg.EIC0021;
						}
						return false;
					}
				}, this);
				if (has_error) {
					this.validator.setErrorHeader(has_error);
					return null;
				}
			}


			var reqObj = {
				reqHead: {
					opeTypeId: opeTypeId
				},
				AMICV0050UpdReq: {
					invState: invState,
					invItemList: invItemList
				}
			};
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {

			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

		},

		/**
		 * HT読取後売上数-ボタン押下
		 */
		clickBtnSalesQyDown: function() {
			clutil.setFocus(this.$("#ca_tagCode"));

			this.$('#ca_btn_salesQy_Up').prop('disabled', false);

			var resultInfo = clutil.view2data(this.$('#result'));

			if(resultInfo.tagCode) {

				// タグコード検索リクエスト
				var req0 = {
					code : resultInfo.tagCode,
					unitID : _unitID
				};

				// タグコード検索
				clutil.cltag2variety(req0);

				clutil.mediator.once('onCLtag2varietyCompleted', _.bind(function(args){

					if(args.status == 'OK'){

						if(args.data.head.message === "cl_nodata") {

							// マスタに存在しないタグコードを指定した場合はエラー
							var msg = clutil.fmt(clutil.getclmsg('EGM0016'),resultInfo.tagCode);
							this.validator.setErrorMsg($("#ca_tagCode"), msg);
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
						} else {

							// 入力されたタグコードが登録済みか調べる
							var invItemList = this.dataGrid.getData({filterFunc: function(item){
								return Boolean(item.totalRecFlag);
							}});

							if(!_.isEmpty(invItemList)) {

								for(var i=0; i < invItemList.length; i++) {

									if(invItemList[i].itemID === args.data.rec.colorSizeItemID) {
										// 商品IDが一致する→登録済みの商品である

										// タグ情報エリアに表示する

										// HT読取後売上数
										if(invItemList[i].salesQy === 0) {
											//this.$('#ca_btn_salesQy_Down').prop('disabled', true);
											this.validator.setErrorHeader(clmsg.EIC0024);
											break;
										}

										var newSalesQy = invItemList[i].salesQy - 1;
										this.$('#ca_salesQy').text(newSalesQy);

										// 修正後棚卸数
										var newFixInvQy = invItemList[i].invQy - newSalesQy;
										this.$('#ca_fixInvQy').text(newFixInvQy);

										invItemList[i].salesQy = newSalesQy;
										invItemList[i].fixInvQy = newFixInvQy;

										break;
									}
								}

								var data = [];

								// 合計を更新
								var sumDto = this.calcSummary(invItemList);
								data[0] = _.deepClone(sumDto);

								// 表の中身を更新
								for(var i=0; i < invItemList.length; i++) {

									data[i+1] = _.deepClone(invItemList[i]);

								}

								this.dataGrid.setData({
									gridOptions: {
										rowHeight: 24,
										autoHeight: false,
										frozenRow: 2
									},
									columns: buildColumns(),
									data: data,
									rowDelToggle: true,
									graph: this.graph
								});
								this.renderDeleteRow();
								clutil.setFocus(this.$("#ca_tagCode"));
							}
						}
					} else {
						// タグコード検索に失敗したときはエラー
						var msg = clutil.fmt(clutil.getclmsg('EGM0016'),resultInfo.tagCode);
						this.validator.setErrorMsg($("#ca_tagCode"), msg);
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
					}
				},this));
			}
		},

		/**
		 * HT読取後売上数+ボタン押下
		 */
		clickBtnSalesQyUp: function() {

			this.$('#ca_btn_salesQy_Down').prop('disabled', false);

			var resultInfo = clutil.view2data(this.$('#result'));

			if(resultInfo.tagCode) {

				// タグコード検索リクエスト
				var req0 = {
					code : resultInfo.tagCode,
					unitID : _unitID
				};

				// タグコード検索
				clutil.cltag2variety(req0);

				clutil.mediator.once('onCLtag2varietyCompleted', _.bind(function(args){

					if(args.status == 'OK'){

						if(args.data.head.message === "cl_nodata") {

							// マスタに存在しないタグコードを指定した場合はエラー
							var msg = clutil.fmt(clutil.getclmsg('EGM0016'),resultInfo.tagCode);
							this.validator.setErrorMsg($("#ca_tagCode"), msg);
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
						} else {

							// 入力されたタグコードが登録済みか調べる
							var invItemList = this.dataGrid.getData({filterFunc: function(item){
								return Boolean(item.totalRecFlag);
							}});

							if(!_.isEmpty(invItemList)) {

								for(var i=0; i < invItemList.length; i++) {
									if(invItemList[i].itemID === args.data.rec.colorSizeItemID) {
										// 商品IDが一致する→登録済みの商品である

										// タグ情報エリアに表示する
										if(invItemList[i].salesQy === 999998) {
											this.$('#ca_btn_salesQy_Up').prop('disabled', true);
										}

										if (invItemList[i].fixInvQy <= 0) {
											// 修正後棚卸数が0以下の場合はエラーメッセージを表示し、数値操作は行わない
											this.validator.setErrorHeader(clmsg.EIC0019);
											break;
										}

										// HT読取後売上数
										var newSalesQy = invItemList[i].salesQy + 1;
										this.$('#ca_salesQy').text(newSalesQy);

										// 修正後棚卸数
										var newFixInvQy = invItemList[i].invQy - newSalesQy;
										this.$('#ca_fixInvQy').text(newFixInvQy);

										invItemList[i].salesQy = newSalesQy;
										invItemList[i].fixInvQy = newFixInvQy;

										break;
									}
								}

								var data = [];

								// 合計を更新
								var sumDto = this.calcSummary(invItemList);
								data[0] = _.deepClone(sumDto);

								// 表の中身を更新
								for(var i=0; i < invItemList.length; i++) {

									data[i+1] = _.deepClone(invItemList[i]);

								}

								this.dataGrid.setData({
									gridOptions: {
										rowHeight: 24,
										autoHeight: false,
										frozenRow: 2
									},
									columns: buildColumns(),
									data: data,
									rowDelToggle: true,
									graph: this.graph
								});
								this.renderDeleteRow();
								clutil.setFocus(this.$("#ca_tagCode"));
							}
						}

					} else {
						// タグコード検索に失敗したときはエラー

						var msg = clutil.fmt(clutil.getclmsg('EGM0016'),resultInfo.tagCode);
						this.validator.setErrorMsg($("#ca_tagCode"), msg);
						clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
					}
				},this));
			}
		},

		/**
		 * 削除ボタンを押下した行の復元
		 */
		renderDeleteRow: function() {
			var itemList = this.dataGrid.getData();
			var del_btn = $('.btn-delete');
			if (itemList == null || itemList.length == 0) {
				return;
			}

			var event = {
				stopImmediatePropagation: function(){},
				target: null,
			};
			var ag = {
				grid: this.dataGrid.grid,
				row: 0
			};
			var index = null;
			for (var i=0; i < itemList.length; i++) {
				if (itemList[i].totalRecFlag != true) {
					index = index==null ? 0 : index+1;
				}
				if (itemList[i].isDeleted === true) {
					event.target = del_btn[index];
					ag.row = i+1;
					this.dataGrid._onGridClicked(event, ag);
				}
			}
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

		/**
		 * 店舗条件を初期表示する
		 */
		loadCond: function(model){
			if(_.isEmpty(model)){
				return;
			}

			if(model.condModel){
				this.srchCondView.deserialize(model.condModel);
			}
		},

		_eof: 'AMICV0050.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

		// 画面遷移引数がない→メニューから起動された場合
		if (clcom.userInfo && clcom.userInfo.org_id) {

			if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE
					|| clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {

				var condModel = {
					_view2data_srchStoreID_cn: {
						id: clcom.userInfo.org_id,
						code: clcom.userInfo.org_code,
						name: clcom.userInfo.org_name,
						unit_id: clcom.userInfo.unit_id
					},
					srchStoreID: clcom.userInfo.org_id
				};

				mainView.loadCond({
					condModel: condModel
				});

				clutil.inputReadonly($("#ca_srchStoreID"));
				clutil.inputReadonly($("#ca_btn_store_select"));
			}
		}

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
