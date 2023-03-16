/**
 * 棚卸スケジュール登録
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
		minHeight: 150
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
		var height = windowHeight - offset.top - 100;
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

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var yearRange = {
		stYear: NaN,
		edYear: NaN,

		isValid: function(){

			if(_.isNaN(this.stYear) || !(this.stYear >= 2000 && this.stYear <= 2030)){
				return false;
			}
			if(_.isNaN(this.edYear) || !(this.edYear >= 2000 && this.edYear <= 2030)){
				return false;
			}
			if(this.stYear > this.edYear){
				return false;
			}
			return true;
		}
	};

	var emptyRec = {
			storeID: null,
			noticeDate: '',
			countDate: '',
			limitDateStore: ''
		};

	var getSysparam = function(paramName, defaultVal){
		var val = clcom.getSysparam(paramName);
		return (defaultVal === undefined) ? val : parseInt(_.isEmpty(val) ? defaultVal : val);
	};

	// テーブルのヘッダ
	var columns = [
	               {
	            	   id: 'storeID',
	            	   name: '店舗',
	            	   field: 'storeID',
	            	   width: 180,
	            	   cellType: {
	            	   		type: 'clajaxac',
	            	   		validator: '',
	            	   		editorOptions: {
	            	   			funcName: 'orgcode',
	            	   			dependAttrs: function(item){
									var unit_id = $('#ca_unitID').val();
	            	   				return {
										p_org_id : unit_id,
	            						orgfunc_id : Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
	            						orglevel_id :Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID'))
	            	   				};
	               				}
	               			}
	               		}
	               },
	               {
					    id: 'noticeDate',
	           			name: "店舗通知日",
	           			field: "noticeDate",
	           			width: 120,
	           			cellType: {
	           				type: "date"
	           			}
	           		},
	           		{
						id: 'countDate',
	           			name: "棚卸日",
	           			field: "countDate",
	           			width: 120,
	           			cellType: {
	           				type: "date"
	           			}
	           		},
	           		{
						id: 'limitDateStore',
	           			name: "店舗確定期限日",
	           			field: "limitDateStore",
	           			width: 120,
	           			cellType: {
	           				type: "date"
	           			}
	           		}
	];

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		validator : null,

		events: {

		},

		/**
		 * initialize関数
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
					title: '棚卸スケジュール登録',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,

					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,

					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined
				};

				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// データグリッドの表示
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid',
				lineno: true,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ。
			});

			this.resizeWatcher = new ResizeWatcher({
				$el: this.dataGrid.$el
			});

			var dataGrid = this.dataGrid;
			var mainView = this;

			this.graph = new clutil.Relation.DependGraph()
				.add({
					id: "storeID"
				})
				.add({
					id: "noticeDate"
				})
				.add({
					id: "countDate"
				})
				.add({
					id: "limitDateStore"
				})
				.on('all', function(name){
					console.log('graph ev:', name);
				});

			this.listenTo(this.dataGrid, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {};
					gridView.addNewItem(newItem);
				}
			});

			this.dataGrid.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1
				},
				columns: columns,
				data: [
					    clutil.dclone(emptyRec),
					    clutil.dclone(emptyRec),
					    clutil.dclone(emptyRec),
					    clutil.dclone(emptyRec),
					    clutil.dclone(emptyRec)
					],
				rowDelToggle: true,
				graph: this.graph
			});

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;

			default:
				// それ以外は、Submit と、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			// 事業ユニット取得
			this.busunitselector = clutil.clbusunitselector(this.$('#ca_unitID'));

			this.listenTo(this.busunitselector, {

				// 事業ユニットが変更されたときはグリッドを空にする
				change: function(attrs){

					this.dataGrid.setData({
						gridOptions: {
							autoHeight: false,
							frozenRow: 1
						},
						rowDelToggle: true,
						data: [
							    clutil.dclone(emptyRec),
							    clutil.dclone(emptyRec),
							    clutil.dclone(emptyRec),
							    clutil.dclone(emptyRec),
							    clutil.dclone(emptyRec)
							]
					});
				}
			});

			// 事業ユニットの初期値に所属する事業ユニットをセットする
			/*var unitID = clcom.userInfo.unit_id;

			this.deserialize({
				unitID: unitID
			});*/
			// 事業ユニットの初期値をセットする
			var unitID = clcom.getSysparam(amcm_sysparams.PAR_AMMS_UNITID_AOKI);
			this.deserialize({
				unitID: unitID
			});

			// 現在年月日を取得
			var opeDate = String(clcom.getOpeDate());
			// 現在月の翌月を取得
			var opeMonth = opeDate.substr(4,2);
			var opeMonth_int = Number(opeMonth);

			var nextMonth = 0;

			if (opeMonth === 12) {
				// 現在月が「１２月」の場合は、翌月を「１月」にする
				nextMonth = '1';
			}else {
				nextMonth = String(opeMonth_int+1);
			}

			// 対象月の初期値をセット
			$('#ca_month option').filter(function(index){
				return $(this).val() === nextMonth;
			}).prop('selected', true);

			// 店舗通知日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_noticeDate'));

			// 棚卸日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_countDate'));

			// 店舗確定期限日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_limitDateStore'));

			// 本部確定期限日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_limitDateSc'));

			// ツールチップ
			$("#ca_tp_code1").tooltip({html: true});
			$("#ca_tp_code2").tooltip({html: true});
			$("#ca_tp_code3").tooltip({html: true});
			$("#ca_tp_code4").tooltip({html: true});

			return this;
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			this.mdBaseView.initUIElement();

			// 現在年月日を取得
			var opeDate = String(clcom.getOpeDate());
			// 現在年を取得
			var opeYear = opeDate.substr(0,4);

			// 対象期の選択肢
			clutil.clyearselector(this.$('#ca_year'), 1, 5, 5, "年");

			/*var yearItemHtml = '';
			for(var y = yearRange.stYear; y <= yearRange.edYear; ++y){

				if(y === Number(opeYear)) {
					// 現在年を選択状態にする
					yearItemHtml += '<option value="' + y + '" selected>' + y + '年</option>';
				} else {
					yearItemHtml += '<option value="' + y + '">' + y + '年</option>';
				}
			}
			this.$('#ca_year').html(yearItemHtml).selectpicker().selectpicker('refresh');*/

			this.$('#ca_month').selectpicker().selectpicker('refresh');

			return this;

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
		 * 画面描画
		 */
		render: function(){

			this.mdBaseView.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// clutil.viewReadonly(this.$(".ca_toDate_div"));
				clutil.setFocus(this.$("#ca_unitID"));
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		/**
		 * Submit 応答のイベントを受ける
		 */
		_onMDSubmitCompleted: function(args, e){

			switch(args.status){

			case 'DONE':		// 確定済

				// テーブル以外の画面項目を操作不可にする
				clutil.viewReadonly(this.$("#ca_headInfo"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			case 'CONFLICT':	// 別のユーザによって DB が更新された

				// テーブル以外の画面項目を操作不可にする
				clutil.viewReadonly(this.$("#ca_headInfo"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			case 'DELETED':		// 別のユーザによって削除された

				// テーブル以外の画面項目を操作不可にする
				clutil.viewReadonly(this.$("#ca_headInfo"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。

				// もう一回チャレンジできるようになにもしない!!!

				break;
			}
		},

		/**
		 * GET 応答のイベントを受ける
		 */
		_onMDGetCompleted: function(args, e){

			console.log('args.status: [' + args.status + ']');

			switch(args.status){

			case 'OK':

				this.currentData = args.data;

				// 棚卸スケジュール情報を表示する
				this.data2view(args.data);

				// 編集可の状態にする。
				clutil.viewRemoveReadonly($("#ca_headInfo"));
				this.dataGrid.setEnable(true);

				switch (this.options.opeTypeId) {

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:

					// 照会モード・削除モードは、Edit ブロッキングしておく。
					clutil.viewReadonly(this.$("#ca_headInfo"));

					// グリッドのEditを無効にする
					this.dataGrid.setEnable(false);

					break;
				}

				break;

			case 'DONE':		// 確定済

				// 検索結果を画面に表示する
				this.data2view(args.data);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_headInfo"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_headInfo"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース

				// 棚卸スケジュール情報を表示する
				this.data2view(args.data);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_headInfo"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;

			default:
			case 'NG':			// その他エラー。

				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_headInfo"));

				// グリッドのEditを無効にする
				this.dataGrid.setEnable(false);

				break;
			}
		},

		/**
		 * 検索結果を画面に表示する
		 */
		data2view: function(data){

			var _this = this;

			this.saveData = data.AMICV0020GetRsp;
			var schedule = data.AMICV0020GetRsp.schedule;
			var tgt = data.AMICV0020GetRsp.tgt;

			clutil.data2view(_this.$('#ca_headInfo'), schedule);

			var data = [];

			for(var i=0; i < tgt.length; i++) {

				var storeID = {
						id : tgt[i].storeID,
						code : tgt[i].storeCode,
						name : tgt[i].storeName
				};

				data[i] = {
					storeID : storeID,
					noticeDate: tgt[i].noticeDate,
					countDate: tgt[i].countDate,
					limitDateStore:tgt[i].limitDateStore
				};
			};

			this.dataGrid.setData({
				rowDelToggle: true,
				data: data
			});

		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){

			var flag = true;

			// 店舗別設定データグリッド以外の未入力エラー確認
			if(!this.validator.valid()) {
				flag = false;
			};

			// 店舗別設定データグリッドの入力エラーを確認
			if(!this.dataGrid.isValid()) {
				flag = false;
			};

			var targetInfo = clutil.view2data(this.$("#ca_targetInfo"));

			// 対象期の年を取得
			var targetYear = targetInfo.year;

			// 対象期の月を取得
			var targetMonth = targetInfo.month;

			// 店舗通知日、棚卸日、店舗確定期限日、本部確定期限日の整合性チェック
			var dateInfo = clutil.view2data(this.$("#ca_dateInfo"));

			// 店舗通知日
			var noticeDate = dateInfo.noticeDate;
			// 棚卸日
			var countDate = dateInfo.countDate;
			// 店舗確定期限日
			var limitDateStore = dateInfo.limitDateStore;
			// 本部確定期限日
			var limitDateSc = dateInfo.limitDateSc;

			/////////// 店舗別設定データグリッドの日付整合性チェック
			var errors = {};

			//var storeItemList = this.dataGrid.getData();
			var storeItemList = this.dataGrid.getData({ delflag: false });

			if(!_.isEmpty(storeItemList)) {

				// 行ごとにチェックする
				_.each(this.dataGrid.getData({ delflag: false }), function(data){

					// 行のID
					var rowId = data[this.dataGrid.idProperty];

					var dg_noticeDate = data.noticeDate;
					var dg_countDate = data.countDate;
					var dg_limitDateStore = data.limitDateStore;

					if(!data.storeID || !data.storeID.id) {

						// 店舗が入力されていない
						if(dg_noticeDate || dg_countDate || dg_limitDateStore) {
							// 店舗通知日が入力されている
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
							this.dataGrid.setCellMessage(rowId, 'storeID', 'error', clutil.getclmsg('cl_required'));

							if(!dg_noticeDate){
								this.dataGrid.setCellMessage(rowId, 'noticeDate', 'error', clutil.getclmsg('cl_required'));
							};
							if(!dg_countDate) {
								this.dataGrid.setCellMessage(rowId, 'countDate', 'error', clutil.getclmsg('cl_required'));
							};
							if(!dg_limitDateStore){
								this.dataGrid.setCellMessage(rowId, 'limitDateStore', 'error', clutil.getclmsg('cl_required'));
							};

							flag = false;
						}

					} else {
						// 店舗が入力されている場合
						if(!dg_noticeDate) {
							// 店舗通知日が入力されていない場合はエラー
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
							this.dataGrid.setCellMessage(rowId, 'noticeDate', 'error', clutil.getclmsg('cl_required'));
							flag = false;
						}
						if(!dg_countDate) {
							// 棚卸日が入力されていない場合はエラー
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
							this.dataGrid.setCellMessage(rowId, 'countDate', 'error', clutil.getclmsg('cl_required'));
							flag = false;
						}
						if(!dg_limitDateStore) {
							// 店舗確定期限日が入力されていない場合はエラー
							clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));
							this.dataGrid.setCellMessage(rowId, 'limitDateStore', 'error', clutil.getclmsg('cl_required'));
							flag = false;
						}
					}

					if(dg_noticeDate) {

						// チェック処理No.10 店舗別設定の店舗通知日が過去の場合はエラー
						if(dg_noticeDate < clcom.getOpeDate()){
							var yyyyMMdd = clutil.dateFormat(dg_noticeDate, 'yyyy/mm/dd(w)');
							var msg = clutil.fmt(clutil.getclmsg('EIC0008'), yyyyMMdd);
							this.dataGrid.setCellMessage(rowId, 'noticeDate', 'error', msg);
							flag = false;
						}

						// チェック処理No.12 店舗別設定の店舗通知日の年／月が対象期の２ヶ月前まででない場合はエラー
						var dg_noticeYear = String(dg_noticeDate).substring(0,4);
						var dg_noticeMonth = String(dg_noticeDate).substring(4,6);

						if(Number(dg_noticeYear) > Number(targetYear)) {

							// 店舗通知日の年が対象年より未来の場合はエラー
							var yyyyMMdd = clutil.dateFormat(dg_noticeDate, 'yyyy/mm/dd(w)');

							var targetYYMM = targetYear + '年' + targetMonth + '月期';
							var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
							this.dataGrid.setCellMessage(rowId, 'noticeDate', 'error', msg);
							flag = false;

						}else if(Number(dg_noticeYear) === Number(targetYear) && Number(dg_noticeMonth) > Number(targetMonth)) {

							// 店舗通知日が対象期より未来の場合はエラー
							var yyyyMMdd = clutil.dateFormat(dg_noticeDate, 'yyyy/mm/dd(w)');

							var targetYYMM = targetYear + '年' + targetMonth + '月期';
							var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
							this.dataGrid.setCellMessage(rowId, 'noticeDate', 'error', msg);
							flag = false;

						}else if(Number(targetMonth) === 1) {

							// 対象月が１月の場合
							if(Number(dg_noticeYear) < Number(targetYear) - 1) {

								// 店舗通知日の年が対象年の前年より過去の場合はエラー
								var yyyyMMdd = clutil.dateFormat(dg_noticeDate, 'yyyy/mm/dd(w)');

								var targetYYMM = targetYear + '年' + targetMonth + '月期';
								var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
								this.dataGrid.setCellMessage(rowId, 'noticeDate', 'error', msg);
								flag = false;

							} else if((Number(dg_noticeYear) === Number(targetYear) - 1) && (Number(dg_noticeMonth) < 11)) {

								// 店舗通知日の月が対象年の前年11月より前の場合はエラー
								var yyyyMMdd = clutil.dateFormat(dg_noticeDate, 'yyyy/mm/dd(w)');

								var targetYYMM = targetYear + '年' + targetMonth + '月期';
								var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
								this.dataGrid.setCellMessage(rowId, 'noticeDate', 'error', msg);
								flag = false;

							}

						}else if(Number(targetMonth) === 2) {

							// 対象月が２月の場合
							if(Number(dg_noticeYear) < Number(targetYear) - 1) {

								// 店舗通知日の年が対象年の前年より過去の場合はエラー
								var yyyyMMdd = clutil.dateFormat(dg_noticeDate, 'yyyy/mm/dd(w)');

								var targetYYMM = targetYear + '年' + targetMonth + '月期';
								var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
								this.dataGrid.setCellMessage(rowId, 'noticeDate', 'error', msg);
								flag = false;

							} else if((Number(dg_noticeYear) === Number(targetYear) - 1) && (Number(dg_noticeMonth) < 12)) {

								// 店舗通知日の月が対象年の前年12月より前の場合はエラー
								var yyyyMMdd = clutil.dateFormat(dg_noticeDate, 'yyyy/mm/dd(w)');

								var targetYYMM = targetYear + '年' + targetMonth + '月期';
								var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
								this.dataGrid.setCellMessage(rowId, 'noticeDate', 'error', msg);
								flag = false;

							}

						}else {

							if(Number(dg_noticeYear) < Number(targetYear)) {

								// 店舗通知日の年が対象年より過去の場合はエラー
								var yyyyMMdd = clutil.dateFormat(dg_noticeDate, 'yyyy/mm/dd(w)');

								var targetYYMM = targetYear + '年' + targetMonth + '月期';
								var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
								this.dataGrid.setCellMessage(rowId, 'noticeDate', 'error', msg);
								flag = false;

							} else if((Number(dg_noticeYear) === Number(targetYear)) && (Number(dg_noticeMonth) < Number(targetMonth) - 2)) {

								// 店舗通知日の月が対象月の２ヶ月前より過去の場合はエラー
								var yyyyMMdd = clutil.dateFormat(dg_noticeDate, 'yyyy/mm/dd(w)');

								var targetYYMM = targetYear + '年' + targetMonth + '月期';
								var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
								this.dataGrid.setCellMessage(rowId, 'noticeDate', 'error', msg);
								flag = false;

							}
						}

						if(dg_countDate) {

							// チェック処理No.6 店舗別設定の店舗通知日が店舗別設定の棚卸日よりあとの場合はエラー
							if(dg_noticeDate > dg_countDate) {
								var noticeYYYYMMdd = clutil.dateFormat(dg_noticeDate, 'yyyy/mm/dd(w)');
								var countYYYYMMdd = clutil.dateFormat(dg_countDate, 'yyyy/mm/dd(w)');
								var msg = clutil.fmt(clutil.getclmsg('EIC0001'),noticeYYYYMMdd,countYYYYMMdd);
								this.dataGrid.setCellMessage(rowId, 'noticeDate', 'error', msg);
								flag = false;
							}

							if(dg_limitDateStore) {

								// チェック処理No.7 店舗別設定の棚卸日が店舗別設定の店舗確定期限日よりあとの場合はエラー
								if(dg_countDate > dg_limitDateStore) {
									var countYYYYMMdd = clutil.dateFormat(dg_countDate, 'yyyy/mm/dd(w)');
									var limitDateYYYYMMdd = clutil.dateFormat(dg_limitDateStore, 'yyyy/mm/dd(w)');
									var msg = clutil.fmt(clutil.getclmsg('EIC0002'),countYYYYMMdd,limitDateYYYYMMdd);
									this.dataGrid.setCellMessage(rowId, 'countDate', 'error', msg);
									flag = false;
								}

								if(limitDateSc) {

									// チェック処理No.8 店舗別設定の店舗確定期限日が本部確定期限日よりあとの場合はエラー
									if(dg_limitDateStore > limitDateSc) {
										var dg_limitDateStoreYYYYMMdd = clutil.dateFormat(dg_limitDateStore, 'yyyy/mm/dd(w)');
										var limitDateScYYYYMMdd = clutil.dateFormat(limitDateSc, 'yyyy/mm/dd(w)');
										var msg = clutil.fmt(clutil.getclmsg('EIC0003'),dg_limitDateStoreYYYYMMdd,limitDateScYYYYMMdd);
										this.dataGrid.setCellMessage(rowId, 'limitDateStore', 'error', msg);
										flag = false;
									}

								}
							}
						}
					}
				},this);
			}

			////////////データグリッド以外の日付整合性チェック

			if(!noticeDate) {

				flag = false;

			}else{
				// チェック処理No.9 店舗通知日が過去の場合はエラー
				if(noticeDate < clcom.getOpeDate()){
					var yyyyMMdd = clutil.dateFormat(noticeDate, 'yyyy/mm/dd(w)');
					var msg = clutil.fmt(clutil.getclmsg('EIC0008'), yyyyMMdd);
					this.validator.setErrorMsg($("#ca_noticeDate"), msg);
					flag = false;
				}

				// チェック処理No.11 店舗通知日の年／月が対象期の２ヶ月前まででない場合はエラー
				var noticeYear = String(noticeDate).substring(0,4);
				var noticeMonth = String(noticeDate).substring(4,6);

				if(Number(noticeYear) > Number(targetYear)) {

					// 店舗通知日の年が対象年より未来の場合はエラー
					var yyyyMMdd = clutil.dateFormat(noticeDate, 'yyyy/mm/dd(w)');

					var targetYYMM = targetYear + '年' + targetMonth + '月期';
					var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
					this.validator.setErrorMsg($("#ca_noticeDate"), msg);
					flag = false;

				}else if(Number(noticeYear) === Number(targetYear) && Number(noticeMonth) > Number(targetMonth)) {

					// 店舗通知日が対象期より未来の場合はエラー
					var yyyyMMdd = clutil.dateFormat(noticeDate, 'yyyy/mm/dd(w)');

					var targetYYMM = targetYear + '年' + targetMonth + '月期';
					var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
					this.validator.setErrorMsg($("#ca_noticeDate"), msg);
					flag = false;

				}else if(Number(targetMonth) === 1) {

					// 対象月が１月の場合
					if(Number(noticeYear) < Number(targetYear) - 1) {

						// 店舗通知日の年が対象年の前年より過去の場合はエラー
						var yyyyMMdd = clutil.dateFormat(noticeDate, 'yyyy/mm/dd(w)');

						var targetYYMM = targetYear + '年' + targetMonth + '月期';
						var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
						this.validator.setErrorMsg($("#ca_noticeDate"), msg);
						flag = false;

					} else if((Number(noticeYear) === Number(targetYear) - 1) && (Number(noticeMonth) < 11)) {

						// 店舗通知日の月が対象年の前年11月より前の場合はエラー
						var yyyyMMdd = clutil.dateFormat(noticeDate, 'yyyy/mm/dd(w)');

						var targetYYMM = targetYear + '年' + targetMonth + '月期';
						var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
						this.validator.setErrorMsg($("#ca_noticeDate"), msg);
						flag = false;

					}

				}else if(Number(targetMonth) === 2) {

					// 対象月が２月の場合
					if(Number(noticeYear) < Number(targetYear) - 1) {

						// 店舗通知日の年が対象年の前年より過去の場合はエラー
						var yyyyMMdd = clutil.dateFormat(noticeDate, 'yyyy/mm/dd(w)');

						var targetYYMM = targetYear + '年' + targetMonth + '月期';
						var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
						this.validator.setErrorMsg($("#ca_noticeDate"), msg);
						flag = false;

					} else if((Number(noticeYear) === Number(targetYear) - 1) && (Number(noticeMonth) < 12)) {

						// 店舗通知日の月が対象年の前年12月より前の場合はエラー
						var yyyyMMdd = clutil.dateFormat(noticeDate, 'yyyy/mm/dd(w)');

						var targetYYMM = targetYear + '年' + targetMonth + '月期';
						var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
						this.validator.setErrorMsg($("#ca_noticeDate"), msg);
						flag = false;

					}
				}else {

					if(Number(noticeYear) < Number(targetYear)) {

						// 店舗通知日の年が対象年より過去の場合はエラー
						var yyyyMMdd = clutil.dateFormat(noticeDate, 'yyyy/mm/dd(w)');

						var targetYYMM = targetYear + '年' + targetMonth + '月期';
						var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
						this.validator.setErrorMsg($("#ca_noticeDate"), msg);
						flag = false;

					} else if((Number(noticeYear) === Number(targetYear)) && (Number(noticeMonth) < Number(targetMonth) - 2)) {

						// 店舗通知日の月が対象月の２ヶ月前より過去の場合はエラー
						var yyyyMMdd = clutil.dateFormat(noticeDate, 'yyyy/mm/dd(w)');

						var targetYYMM = targetYear + '年' + targetMonth + '月期';
						var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
						this.validator.setErrorMsg($("#ca_noticeDate"), msg);
						flag = false;

					}
				}

				// チェック処理No.3 店舗通知日が棚卸日よりあとの場合はエラー
				if(countDate) {
					if(noticeDate > countDate) {
						var noticeYYYYMMdd = clutil.dateFormat(noticeDate, 'yyyy/mm/dd(w)');
						var countYYYYMMdd = clutil.dateFormat(countDate, 'yyyy/mm/dd(w)');
						var msg = clutil.fmt(clutil.getclmsg('EIC0001'),noticeYYYYMMdd,countYYYYMMdd);
						this.validator.setErrorMsg($("#ca_noticeDate"), msg);
						flag = false;
					}
				}
			}

			if(!limitDateSc) {
				flag = false;
			}else{

				// チェック処理No.13 本部確定期限日の年／月が対象期の翌々月まででない場合はエラー
				var limitDateScYear = String(limitDateSc).substring(0,4);
				var limitDateScMonth = String(limitDateSc).substring(4,6);

				if(Number(limitDateScYear) < Number(targetYear)) {
					// 本部確定期限日の年が対象年より過去の場合はエラー
					var yyyyMMdd = clutil.dateFormat(limitDateSc, 'yyyy/mm/dd(w)');

					var targetYYMM = targetYear + '年' + targetMonth + '月期';
					var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
					this.validator.setErrorMsg($("#ca_limitDateSc"), msg);
					flag = false;

				}else if(Number(limitDateScYear) === Number(targetYear) && Number(limitDateScMonth) < Number(targetMonth)) {
					// 本部確定期限日の月が対象月より過去の場合はエラー
					var yyyyMMdd = clutil.dateFormat(limitDateSc, 'yyyy/mm/dd(w)');

					var targetYYMM = targetYear + '年' + targetMonth + '月期';
					var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
					this.validator.setErrorMsg($("#ca_limitDateSc"), msg);
					flag = false;

				} else if(Number(targetMonth) === 11) {

					// 対象月が11月の場合
					if(Number(limitDateScYear) > Number(targetYear) + 1) {

						// 本部確定期限日の年が対象年の翌年より未来の場合はエラー
						var yyyyMMdd = clutil.dateFormat(limitDateSc, 'yyyy/mm/dd(w)');

						var targetYYMM = targetYear + '年' + targetMonth + '月期';
						var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
						this.validator.setErrorMsg($("#ca_limitDateSc"), msg);
						flag = false;

					} else if((Number(limitDateScYear) === Number(targetYear) + 1) && (Number(limitDateScMonth) > 1)) {

						// 本部確定期限日の月が対象年の翌年１月より未来の場合はエラー
						var yyyyMMdd = clutil.dateFormat(limitDateSc, 'yyyy/mm/dd(w)');

						var targetYYMM = targetYear + '年' + targetMonth + '月期';
						var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
						this.validator.setErrorMsg($("#ca_limitDateSc"), msg);
						flag = false;

					}
				} else if(Number(targetMonth) === 12) {

					// 対象月が12月の場合
					if(Number(limitDateScYear) > Number(targetYear) + 1) {

						// 本部確定期限日の年が対象年の翌年より未来の場合はエラー
						var yyyyMMdd = clutil.dateFormat(limitDateSc, 'yyyy/mm/dd(w)');

						var targetYYMM = targetYear + '年' + targetMonth + '月期';
						var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
						this.validator.setErrorMsg($("#ca_limitDateSc"), msg);
						flag = false;

					} else if((Number(limitDateScYear) === Number(targetYear) + 1) && (Number(limitDateScMonth) > 2)) {

						// 本部確定期限日の月が対象年の翌年2月より未来の場合はエラー
						var yyyyMMdd = clutil.dateFormat(limitDateSc, 'yyyy/mm/dd(w)');

						var targetYYMM = targetYear + '年' + targetMonth + '月期';
						var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
						this.validator.setErrorMsg($("#ca_limitDateSc"), msg);
						flag = false;

					}

				}else {

					if(Number(limitDateScYear) > Number(targetYear)) {

						// 本部確定期限日の年が対象年より未来の場合はエラー
						var yyyyMMdd = clutil.dateFormat(limitDateSc, 'yyyy/mm/dd(w)');

						var targetYYMM = targetYear + '年' + targetMonth + '月期';
						var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
						this.validator.setErrorMsg($("#ca_limitDateSc"), msg);
						flag = false;

					} else if((Number(limitDateScYear) === Number(targetYear)) && (Number(limitDateScMonth) > Number(targetMonth) + 2)) {

						// 本部確定期限日の月が対象月の２ヶ月後より未来の場合はエラー
						var yyyyMMdd = clutil.dateFormat(limitDateSc, 'yyyy/mm/dd(w)');

						var targetYYMM = targetYear + '年' + targetMonth + '月期';
						var msg = clutil.fmt(clutil.getclmsg('EIC0009'), yyyyMMdd, targetYYMM);
						this.validator.setErrorMsg($("#ca_limitDateSc"), msg);
						flag = false;

					}
				}
			}

			if(!countDate) {
				flag = false;
			}else{

				// チェック処理No.4 棚卸日が店舗確定期限日よりあとの場合はエラー
				if(limitDateStore) {
					if(countDate > limitDateStore) {
						var countYYYYMMdd = clutil.dateFormat(countDate, 'yyyy/mm/dd(w)');
						var limitDateYYYYMMdd = clutil.dateFormat(limitDateStore, 'yyyy/mm/dd(w)');
						var msg = clutil.fmt(clutil.getclmsg('EIC0002'),countYYYYMMdd,limitDateYYYYMMdd);
						this.validator.setErrorMsg($("#ca_countDate"), msg);
						flag = false;
					}
				}
			}

			if(!limitDateStore) {
				flag = false;
			}else{

				// チェック処理No.5 店舗確定期限日が本部確定期限日よりあとの場合はエラー
				if(limitDateSc) {
					if(limitDateStore > limitDateSc) {
						var limitDateStoreYYYYMMdd = clutil.dateFormat(limitDateStore, 'yyyy/mm/dd(w)');
						var limitDateScYYYYMMdd = clutil.dateFormat(limitDateSc, 'yyyy/mm/dd(w)');
						var msg = clutil.fmt(clutil.getclmsg('EIC0003'),limitDateStoreYYYYMMdd,limitDateScYYYYMMdd);
						this.validator.setErrorMsg($("#ca_limitDateStore"), msg);
						flag = false;
					}
				}
			}

			//////////////////////////////////

			return flag;
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId){

			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + ']');

			// エラーチェック
			if(this.isValid() == false){

				clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

				return;
			}

			// 棚卸スケジュールレコード

			// 事業ユニットと対象期、日付シリーズを取得
			var schedule = clutil.view2data($('#ca_headInfo'));

			if (opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				// 棚卸IDに０をセットする
				schedule.invID= 0;

			}else if(this.currentData){
				schedule.invID = this.currentData.AMICV0020GetRsp.schedule.invID;
			}

			// 店舗別設定テーブルの内容を取得
			var list = this.dataGrid.getData({
				delflag: false
			});

			var storeSchedule = [];

			// 店舗設定レコード
			for(var i=0; i < list.length; i++) {

				if(!_.isEmpty(list[i].storeID) && list[i].storeID.id > 0) {

					storeSchedule[i] = {
						storeID : list[i].storeID.id,
						storeCode : list[i].storeID.code,
						storeName : list[i].storeID.name,
						noticeDate : list[i].noticeDate,
						countDate : list[i].countDate,
						limitDateStore : list[i].limitDateStore
					};
				}
			};

			var updReq = {
				schedule : schedule,
				storeSchedule : storeSchedule
			};

			var reqHead = {
				opeTypeId : opeTypeId
			};

			var reqObj = {
				reqHead : reqHead,
				AMICV0020UpdReq  : updReq
			};

			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		/**
		 * Get リクエストを作る
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			var chkData = this.options.chkData[pgIndex];

			var getReq = {

				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},

				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},

				// 棚卸スケジュール検索リクエスト
				AMICV0020GetReq: {
					srchUnitID: chkData.unitID,			// 事業ユニット
					srcCountDate: chkData.countDate		// 棚卸日
				},

				// 棚卸スケジュール更新リクエスト -- 今は検索するので、空を設定
				AMICV0020UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMICV0020',
				data: getReq
			};
		},

		_eof: 'AMICV0020.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){

		var curYear = Math.floor(clcom.getOpeDate() / 10000);
		yearRange.stYear = curYear - getSysparam(amcm_sysparams.PAR_AMCM_YEAR_FROM, 5);
		yearRange.edYear = curYear + getSysparam(amcm_sysparams.PAR_AMCM_YEAR_TO, 5);

		if(!yearRange.isValid()){
			clutil.View.doAbort({
				messages: [
					//'初期データ取得に失敗しました。'
					clutil.getclmsg('期間に誤りがあります。')
				],
				rspHead: data.rspHead
			});
			return;
		}

		mainView = new MainView(clcom.pageArgs).initUIElement().render();

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
