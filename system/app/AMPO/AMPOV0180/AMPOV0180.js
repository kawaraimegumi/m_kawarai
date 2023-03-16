useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	clutil.enterFocusMode($('body'));

	// 店舗着日入力Viewクラス
	var InputView = Backbone.View.extend({
		el: $('#ca_table'),
		events: {
			'clDatepickerOnSelect tbody input.hasDatepicker'	: '_onChangeCalendarInput',
			'change tbody input.hasDatepicker'		: '_onChangeCalendarInput'	// XXX カレンダ部品の入力変更を捉える
		},
		// テーブルヘッダ部用テンプレート
		thead_template: _.template( $('#ca_rec_thead_template').html() ),

		// テーブルボディ部用テンプレート
		tbody_template: _.template( $('#ca_rec_tbody_template').html() ),

		initialize: function(opt){
			_.bindAll(this);
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		initUIElement: function(){
			return this;
		},

		render: function(){
			// ビューをクリア
			this.clear();

			var data = this.model;
			if(_.isEmpty(data)){
				return;
			}

			// thead 部展開 - テンプレートから展開
			this.$('thead').html(this.thead_template(data));

			// セル部のキージェネレータ
			var keyGen = function(od, cID){
				return 'od' + od + 'cID' + cID;
			};

			// セルデータ（AMPOV0180ArrivalDate）マップ化
			var dtlMap = {};
			for(var i = 0; i < data.dtlList.length; i++){
				var dtlDto = data.dtlList[i];
				var key = keyGen(dtlDto.orderDate, dtlDto.calenID);
				dtlMap[key] = dtlDto;
			}

			// 行テンプレ展開用 Rec
			var tbodyTmplDto = {
					orderDateDto: null,
					calenListCount: data.calenList.length
			};

			// tbody 部展開
			var $tbody = this.$('tbody');
			for(var rowIdx = 0; rowIdx < data.orderDateList.length; rowIdx++){
				// 縦軸
				var orderDateDto = data.orderDateList[rowIdx];
				tbodyTmplDto.orderDateDto = orderDateDto;

				// 行の <tr> を生成（各日付は空で）
				var $tr = $(this.tbody_template(tbodyTmplDto));

				// Datepicker 初期化
				$tr.find('input').each(function(index, elem){
					var calenDto = data.calenList[index];
					if(!calenDto){
						$(this).remove();
						return;
					}
					var key = keyGen(orderDateDto.orderDate, calenDto.calenID);
					var dtlDto = dtlMap[key];
					if(!dtlDto){
						$(this).remove();
						return;
					}
					var $dp = clutil.datepicker($(this));
					$dp.datepicker('setIymd', dtlDto.arrivalDate);
					$dp.data('ca_dtlDto', dtlDto);
					//運用日以前は使用不可
					if (dtlDto.orderDate <= clcom.getOpeDate()){
						clutil.viewReadonly($(this.parentNode));
					}
				});

				$tbody.append($tr);
			}

			return this;
		},

		/**
		 * カレンダの入力値が変更された
		 */
		_onChangeCalendarInput: function(e){
			var $input = $(e.target);
			var val = clutil.dateFormat($input.val(), 'yyyymmdd');

			var dtlDto = $input.data('ca_dtlDto');
			if(dtlDto){
				dtlDto.arrivalDate = val;
			}
		},

		/**
		 * 入力値のデータを AMPOV0180GetRsp 形式で返す
		 */
		serialize: function(){
			return this.model;
		},

		/**
		 * AMPOV0180GetRsp のデータを表示する
		 */
		deserialize: function(data){
			// TODO: 前半(1～15/16～末日)切り替えは後で考える

			// 元々のデータを保存
			this.savedAMPOV0180GetRsp = data;
			this.model = clutil.dclone(data);

			this.render();
		},

		/**
		 * 活性化/非活性化
		 */
		setEnable: function(enable){
			if(enable){
				clutil.viewRemoveReadonly(this.$el);
			}else{
				clutil.viewReadonly(this.$el);
			}
		},

		/**
		 * 空更新チェック
		 * true:変更あり、false:変更なし
		 */
		isDiff: function(){
			// FW の submit 機構に乗っているなら不要。
			var savedDtlList = (this.savedAMPOV0180GetRsp && this.savedAMPOV0180GetRsp.dtlList) ? this.savedAMPOV0180GetRsp.dtlList : null;
			var editDtlList = (this.model && this.model.dtlList) ? this.model.dtlList : null;
			if(savedDtlList === editDtlList){
				return true;
			}
			return !clutil.protoIsEqual(editDtlList, savedDtlList);
		},

		/**
		 * クリア
		 */
		clear: function(){
//			this.$('thead').empty();
			this.$('tbody').empty();
		},
		/**
		 * 入力状態が正しいかどうかチェック。
		 * OK=true
		 * NG=false
		 */
		isValid: function(){
			//必須チェック
			var f_error = true;
//			var f_error =  this.validator.valid();
			//日付前後杖会苦
			var data = this.model;
			var $tbody = this.$('tbody');
			for(var rowIdx = 0; rowIdx < data.orderDateList.length; rowIdx++){
				var orderDate = data.orderDateList[rowIdx].orderDate;
				var arrivalDate = data.dtlList[rowIdx].arrivalDate;
				if((arrivalDate == null) || (arrivalDate <= 0)){
					//到着日未入力は必須チェックで行うのでスキップ
					continue;
				}
				if(arrivalDate <= orderDate ){
					//到着日が発注日以前はアウト
					this.validator.setErrorMsg(this.$("#ca_table_tbody tr:nth-child(" + (rowIdx + 1) + ") input[type='text']"), clutil.fmtargs(clmsg.EPO0055, ["店舗着日", "商品発注日翌日"]));
					f_error = false;
				}

			}


			return f_error;
		},
	});

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'					: '_onSrchClick',			// 検索ボタン押下時
			'change #ca_poTypeID' 	: '_PoTypeChange',
			'change #ca_unitID' 	: '_UnitTypeChange',
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
			clutil.clbusunitselector(this.$('#ca_unitID'));

			// ＰＯ種別
			clutil.cltypeselector(this.$("#ca_poTypeID"), amcm_type.AMCM_TYPE_PO_CLASS);

			var $unitID		= this.$("#ca_unitID");
			var $poTypeID	= this.$("#ca_poTypeID");
			clutil.clpocalenselector(this.$("#ca_calenIDList"), {
				dependAttrs :{
					unit_id: function() {
						return ($unitID.val()==null || $unitID.val()==0)? -1:$unitID.val();
					},
					poTypeID: function() {
						return	($poTypeID.val() == null||$poTypeID.val() == 0)? -1:$poTypeID.val();
					},
				}
			});

			// 対象期間取得
			// 初期値：当月(運用日/100)
			var yearmonthcode = clutil.clyearmonthcode({
				el: '#ca_ym',
				initValue: parseInt(clcom.getOpeDate()/100)
			});

			clutil.initUIelement(this.$el);

			return this;
		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			return null;
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
			var dto = this.serialize();

			clutil.mediator.trigger('ca_onSearch', dto);
		},

		viewReadonly : function() {
			clutil.viewReadonly(this.$el);
		},

		_UnitTypeChange: function(e) {
			this.$("#ca_calenIDList").selectpicker('val', []);
			//部品では要素が0のとき使用不可になる、部品では制御を行っていないのでここで戻す
			clutil.viewRemoveReadonly(this.$(".ca_calenIDList_div"));
			clutil.initUIelement(this.$el);
			var $unitID		= this.$("#ca_unitID");
			var $poTypeID	= this.$("#ca_poTypeID");
			clutil.clpocalenselector(this.$("#ca_calenIDList"), {
				dependAttrs :{
					unit_id: function() {
						return ($unitID.val()==null || $unitID.val()==0)? -1:$unitID.val();
					},
					poTypeID: function() {
						//指定なしの場合0扱いになる。しかしDB上で0で検索は全部になるので
						return	($poTypeID.val() == null||$poTypeID.val() == 0)? -1:$poTypeID.val();
					},
				}
			});
		},

		_PoTypeChange: function(e) {
			this.$("#ca_calenIDList").selectpicker('val', []);
			//部品では要素が0のとき使用不可になる、部品では制御を行っていないのでここで戻す
			clutil.viewRemoveReadonly(this.$(".ca_calenIDList_div"));
			clutil.initUIelement(this.$el);
			var $unitID		= this.$("#ca_unitID");
			var $poTypeID	= this.$("#ca_poTypeID");
			clutil.clpocalenselector(this.$("#ca_calenIDList"), {
				dependAttrs :{
					unit_id: function() {
						return ($unitID.val()==null || $unitID.val()==0)? -1:$unitID.val();
					},
					poTypeID: function() {
						//指定なしの場合0扱いになる。しかしDB上で0で検索は全部になるので
						return	($poTypeID.val() == null||$poTypeID.val() == 0)? -1:$poTypeID.val();
					},
				}
			});
		},

		_eof: 'AMPOV0180.SrchCondView//'
	});
	var MainView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			'click #searchAgain'			: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
		},

		/**
		 * opt : clcom.pageArgs
		 */
		initialize: function(opt){

			_.bindAll(this);

			// 共通ビュー（共通ヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: 'ＰＯカレンダー',
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
				subtitle: "登録・修正",
//				btn_submit: true,
//				btn_new: false,
//				btn_cancel: {
//				label:"条件再設定",
//				action:this._doCancel
//				},
				buildSubmitReqFunction: this._buildSubmitReqFunction,
				buildGetReqFunction: this._buildGetReqFunction,
				confirmLeaving: true
			});
			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});
			// 店舗着日編集領域
			this.inputView = new InputView();

			// グループID -- AMPOV0120 なデータに関連することを表すためのマーキング文字列
			var groupid = 'AMPOV0180';

			this.validator1 = clutil.validator(this.$("#ca_result"), {
				echoback : $('.cl_echoback')
			});

			clutil.cltxtFieldLimit($("#ca_calenIDList3"));


			// 外部イベントの購読設定
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
			clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			return this;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			// 店舗着日編集領域
			this.inputView.initUIElement();
			this.srchCondView.initUIElement();
			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#ca_result'),
					this.$('#searchAgain'));

			return this;
		},

		// this.inputView 編集不可
		setReadOnlyAllItems: function(){
			this.inputView.setEnable(false);
		},


		/**
		 *  GET 応答のイベントを受ける
		 */
		_onMDGetCompleted: function(args, e){
			console.log('args.status: [' + args.status + ']');

			// this.inputView を空欄にする
			this.inputView.clear();
			this.savedGetData = null;

			switch(args.status){
			case 'OK':
				// リクエストを保存。
				// ここでは取れないので画面から取得する。
				this.savedSrchReq =  this.buildReq();
				// args.data をアプリ個別 View へセットする。
				this.srchAreaCtrl.show_result();
				var srchUnitID =  this.$("#ca_unitID").find("option:selected").text();
				var srchPOTypeID =  this.$("#ca_poTypeID").find("option:selected").text();
				var srchYM		= this.$("#ca_ym").val();
				var srchCalenIDList = this.$("#ca_calenIDList").find("option:selected").text();
				// 編集可の状態にする。
				var data = args.data;
				this.savedGetData = data;
				mainView.inputView.deserialize(data.AMPOV0180GetRsp);

				this.$("#ca_unitID2").val( srchUnitID);
				this.$("#ca_poTypeID2").val( srchPOTypeID);
//				this.$("#ca_calenIDList2").val( srchCalenIDList);
				this.$("#ca_calenIDList2").val(data.AMPOV0180GetRsp.calenList[0].calenCode);
				this.$("#ca_calenIDList3").val(data.AMPOV0180GetRsp.calenList[0].calenName);
				clutil.inputRemoveReadonly(this.$("#ca_calenIDList3"));
				clutil.cltxtFieldLimitReset($("#ca_calenIDList3"));
				this.$("#ca_ym2").val( srchYM);

				// 検索領域を入力不可に。
//				this.srchCondView.setEnable(false);
				var $focusElem = this.inputView.$el.find('input[type="text"]').first();
//				var $focusElem = this.$('#searchAgain');
				this.resetFocus($focusElem);
				this.srchCondView.setEnable(false);
				mainView._showFooter();
				mainView.mdBaseView.clear({setSubmitEnable: true});
				break;
			case 'DONE':		// 確定済
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				var data = args.data;
				mainView.inputView.deserialize(data.AMPOV0180GetRsp);
				this.srchCondView.setEnable(false);
				this.setReadOnlyAllItems();
				mainView._showFooter();
				mainView.mdBaseView.clear({setSubmitEnable: false});
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				this.setReadOnlyAllItems();
				mainView._showFooter();
				mainView.mdBaseView.clear({setSubmitEnable: false});
				break;
			default:
			case 'NG':			// その他エラー。
				this.setReadOnlyAllItems();
				break;
			}

		},
		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				clutil.inputReadonly(this.$("#ca_calenIDList3"));
				this.setReadOnlyAllItems();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				clutil.inputReadonly(this.$("#ca_calenIDList3"));
				this.setReadOnlyAllItems();
				break;
			case 'DELETED':		// 別のユーザによって削除された
				clutil.inputReadonly(this.$("#ca_calenIDList3"));
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				clutil.mediator.trigger("onTicker", data);
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				break;
			}
		},
		render : function(){
			this.$("#ca_unitID").val(clcom.userInfo.unit_id);
			this.mdBaseView.render().setSubmitEnable(false);
//			mainView.mdBaseView.clear({setSubmitEnable: false});
			this.srchCondView.render();
			this.inputView.render();
			clutil.inputlimiter(this.$el);
			//初期フォーカス
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				clutil.setFocus(this.$('#ca_poTypeID'));
			}
			else{
				clutil.setFocus(this.$('#ca_unitID'));
			}
			this._hideFooter();
			return this;
		},
		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			if(!this.srchCondView.isValid()){
				return null;
			}
			// 検索条件
			var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
						fileId: 0			// CSV取込などで使用する
					},
					reqPage: {},//特にいらないパラメータ
					AMPOV0180GetReq: this.buildSrchReq()
			};
			return req;
		},
		//検索と更新でパケットの形が微妙に違うので変換用
		buildSrchReq: function(){
			var baseReq = clutil.view2data(this.$("#ca_srchArea"));
			var calenIDList = new Array;
			var obj = {
					calenID:baseReq.calenIDList
			};
			calenIDList.push(obj);
			var srchReq = {
					srchType		:2,	//1/2：　カレンダー候補検索/カレンダー検索
					srchUnitID		:baseReq.unitID,
					srchPOTypeID	:baseReq.poTypeID,
					srchYM			:baseReq.ym,
					srchCalenIDList	:calenIDList,
			};
			return srchReq;
		},
		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			this.mdBaseView.fetch();
		},
		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFocus($focusElem);
			}else{
				// 適当な場所を select してフォーカスを入れる。
				if (this.$('#searchAgain').css('display') == 'none') {
					// 検索ボタンにフォーカスする
					clutil.setFocus(this.$('#ca_srch'));
				} else {
					// 条件を追加ボタンにフォーカスする
					clutil.setFocus(this.$('#searchAgain'));
				}
			}
		},

//		使用不可
//		/**
//		* 検索条件を再指定ボタン押下
//		*/
		_onSearchAgainClick: function(e){
			if (this.$('#ca_srchArea').css('display') == 'none') {
				this.srchAreaCtrl.show_srch();
				$("#searchAgain").text('検索条件を非表示');
				$("#searchAgain").fadeIn();
			} else {
				this.srchAreaCtrl.show_result();
				$("#searchAgain").text('検索条件を再表示');
			}
			this.srchAreaCtrl.show_srch();
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){
			// 編集データをクリア
			this.inputView.clear();
			this.savedGetData = null;

			// 検索条件を再指定
			this.srchCondView.setEnable(true);
			this.srchAreaCtrl.reset();
			var cal_val = this.$("#ca_calenIDList").val();
			if(!(this.$("#ca_calenIDList").val() > 0)){
				var $unitID		= this.$("#ca_unitID");
				var $poTypeID	= this.$("#ca_poTypeID");
				clutil.clpocalenselector(this.$("#ca_calenIDList"), {
					dependAttrs :{
						unit_id: function() {
							return ($unitID.val()==null || $unitID.val()==0)? -1:$unitID.val();
						},
						poTypeID: function() {
							return	($poTypeID.val() == null||$poTypeID.val() == 0)? -1:$poTypeID.val();
						},
					}
				});
			}else{
				var $unitID		= this.$("#ca_unitID");
				var $poTypeID	= this.$("#ca_poTypeID");
				clutil.clpocalenselector(this.$("#ca_calenIDList"), {
					dependAttrs :{
						unit_id: function() {
							return ($unitID.val()==null || $unitID.val()==0)? -1:$unitID.val();
						},
						poTypeID: function() {
							return	($poTypeID.val() == null||$poTypeID.val() == 0)? -1:$poTypeID.val();
						},
					}
				}).done(_.bind(function(){
					this.$("#ca_calenIDList").selectpicker('val',cal_val);
				},this));
			}
			// 登録ボタンを不活性、内部GETデータ破棄、リボンメッセージ非表示・・・など
			this.mdBaseView.clear({setSubmitEnable: false});
			this._hideFooter();
			clutil.setFocus($('#ca_unitID'));
		},


		buildUpdReq: function(){
			var baseReq = clutil.view2data(this.$("#ca_srchArea"));
			var calenIDList = new Array;
			var obj = {
					calenID:baseReq.calenIDList
			};
			calenIDList.push(obj);
			var updReq = {
					unitID		:baseReq.unitID,
					poTypeID	:baseReq.poTypeID,
					ym			:baseReq.ym,
					calenIDList	:calenIDList,
					orderDateList	:[],
					calenList	:[],
					dtlList		:[],

			};
			return updReq;
		},



		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
//			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			this.inputView.validator.clear();
			this.validator1.clear();
//			this.srchCondView.validator.clear();

			var updReq = {};
			/*
			 * 入力値チェック 予約取消時はチェックしない
			 */
			var f_error = false;
			var f_error0 = false;
			var _this = this;
			if(!this.validator1.valid()) {
				f_error = true;
			}
			if(!this.inputView.validator.valid()) {
				f_error = true;
			}
			if(!this.inputView.isValid()) {
				f_error0 = true;
			}
			if(this.savedSrchReq == null){
				f_error0 = true;
			}
			if(f_error){
				// valid() -- NG
				clutil.setFocus(this.$el.find('.cl_error_field').first());
				return null;
			}
			if(f_error0){
				// 独自チェック -- NG
				clutil.mediator.trigger('onTicker',clmsg.cl_echoback);
				clutil.setFocus(this.$el.find('.cl_error_field').first());
				return null;
			}
//			if(f_error){
//				return null;
//			}
//			if(f_error0){
//				return null;
//			}
			var srchReq = this.savedSrchReq;
			var tableData = mainView.inputView.serialize();

			tableData.calenList[0].calenName = this.$("#ca_calenIDList3").val().trim();

			updReq = {
					unitID			:srchReq.AMPOV0180GetReq.srchUnitID,
					poTypeID		:srchReq.AMPOV0180GetReq.srchPOTypeID,
					ym				:srchReq.AMPOV0180GetReq.srchYM,
					calenIDList		:srchReq.AMPOV0180GetReq.srchCalenIDList,
					orderDateList	:tableData.orderDateList,
					calenList		:tableData.calenList,
					dtlList			:tableData.dtlList,
			};

			var reqHead = {
					opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
			};

			var reqObj = {
					reqHead : reqHead,
					AMPOV0180UpdReq  : updReq
			};
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},
		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			if(!this.srchCondView.isValid()){
				return null;
			}
			var req = this.buildReq();
			return {
				resId : clcom.pageId,
				data: req
			};
		},

		_showFooter: function(){
			var opt = this.mdBaseView.options;
			opt.btn_cancel = {
					label: '条件再設定',
					action: this._doCancel
			};
			opt.btn_submit = true;
			opt.btn_new = false;
			this.mdBaseView.renderFooterNavi();
			clutil.initUIelement(this.$el);
		},
		_hideFooter: function(){
			var opt = this.mdBaseView.options;
			opt.btn_cancel = false;
			opt.btn_submit = false;
			opt.btn_new = false;
			this.mdBaseView.renderFooterNavi();
			clutil.initUIelement(this.$el);
		},
		/**
		 * 空更新比較用のデータ生成
		 */
//		_buildSubmitCheckFunction: function(arg){
//		var data = arg.data;		// GET応答データ

//		return data;
//		}
	});

	// 初期データを取る
	clutil.getIniJSON(null, null).done(function(data, dataType) {
		mainView = new MainView(clcom.pageArgs).initUIelement().render();
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
