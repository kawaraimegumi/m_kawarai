useSelectpicker2();

/**
 * サイズパターン編集
 */
$(function(){

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// Int 変換関数。int 型になりきれない場合は 0 を返す。
	// id 系な値のパースに使用することを想定。
	function myParseInt(val){
		return _.isFinite(val) ? parseInt(val) : 0;
	}

	/**
	 * 条件入力部
	 */
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'		: '_onSrchClick'			// 検索ボタン押下時
		},

		initialize: function(opt){
			_.bindAll(this);

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		initUIElement: function(){
			clutil.inputlimiter(this.$el);
			return clutil.clsizegrpselector({el:this.$("#ca_srchID")});
		},

		render : function(){
			return;
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

		viewReadonly : function() {
			clutil.viewReadonly(this.$el);
		},

		_eof: 'AMMSV0370.SrchCondView//'
	});


	/**
	 *
	 */
	var RecListView = Backbone.View.extend({
		el: $('#ca_result'),
		events: {
			"click #ca_table_ptn tbody span.btn-delete" : "onPtnRowDelClick",
			"click #ca_table_ptn tfoot tr" : "onPtnRowAddClick",
			"click #ca_table_itgrp tbody span.btn-delete" : "onItgrpRowDelClick",
			"click #ca_table_itgrp tfoot tr" : "onItgrpRowAddClick"
		},

		initialize: function(opt){
			_.bindAll(this);

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		initUIElement: function(){
			clutil.inputlimiter(this.$el);
			return;
		},

		render : function(){
			return;
		},

		/**
		 * 検索結果から画面表示
		 * @param data
		 */
		setRecs : function(data){
			var _this = this;
			var sizeGrp = data.sizeGrp;
			var ptnList = data.ptnList;
			var itgrpList = data.itgrpList;
			var $ptBody = this.$("#ca_tbody_ptn");
			var $itBody = this.$("#ca_tbody_itgrp");
			var	$tmpl_ptn = $("#ca_tmpl_ptn");
			var $tmpl_itgrp = $("#ca_tmpl_itgrp");

			clutil.data2view(this.$el, sizeGrp);
			$tmpl_ptn.tmpl(ptnList).appendTo($ptBody);
			$.each(itgrpList, function(){
				$tmpl_itgrp.tmpl({unitID : this.unitID}).appendTo($itBody);

				var $select = $itBody.find("tr:last select[name='unitID']");
				clutil.clbusunitselector($select).done(_.bind(function(){
					$select.val(this.unitID);
					clutil.initUIelement($select.closest("tr"));

					var $input = $select.closest("tr").find("input[name='itgrpID']");
					clutil.clvarietycode($input, {
						getParentId : function(){
							return Number($input.closest("tr").find("select[name='unitID']").val());
						}
					});

					this._view2data_itgrpID_cn = {
							id : this.itgrpID,
							code : this.itgrpCode,
							name : this.itgrpName,
							value : this.itgrpCode + ":" + this.itgrpName,
							label : this.itgrpCode + ":" + this.itgrpName
					};
					$input.autocomplete('clAutocompleteItem', this._view2data_itgrpID_cn);
					$select.on("change", _this.onUnitChange);

				},this));

			});
			return;
		},

		onUnitChange : function(e){
			$unit = $(e.target);
			$tr = $unit.closest("tr");
			$itgrp = $tr.find("input[name='itgrpID']");
			$itgrp.autocomplete('removeClAutocompleteItem');
			$itgrp.attr("readonly", Number($unit.val()) === 0);
			this.validator.clearErrorMsg($itgrp);
		},

		/**
		 * 入力チェックをして、画面からデータ取得。
		 * 入力チェックNGの場合は当該フィールドにエラー情報を設定する。（赤くする）
		 * @return {object} !=null の場合は正常、==null の場合は入力チェックNGになった。
		 */
		view2ValidData: function(){
			// clutil.tableview2ValidData() 関数で入力値データを収集する。
			// パターン
			var ptnList = clutil.tableview2ValidData({
				$tbody: this.$("#ca_tbody_ptn"),		// テーブルの tbody 要素を指定（必須）
				validator: this.validator,				// validator オブジェクトを指定。
				tailEmptyCheckFunc: function(ptnDto){	// 空欄データかどうかを判定するためのメソッドを指定。
					// サイズパターンの空欄入力判定		// @return true:空欄データ、false:値の入ったデータ
					return _.isEmpty(ptnDto.sizePtnCode) && _.isEmpty(ptnDto.sizePtnName);
				}
			});
			if(ptnList == null){						// null 応答の場合は入力不備を検出。
				return null;
			}

			// 品種
			var itgrpList = clutil.tableview2ValidData({
				$tbody: this.$("#ca_tbody_itgrp"),
				validator: this.validator,
				tailEmptyCheckFunc: function(itgrpDto){
					// 対象品種の空欄入力判定
					var itgrpID = myParseInt(itgrpDto.itgrpID);
					var unitID = myParseInt(itgrpDto.unitID);
					return itgrpID === 0 && unitID === 0;
				}
			});
			if(itgrpList == null){
				return null;
			}
			return {
				sizeGrp: clutil.view2data(this.$el),
				ptnList: ptnList,
				itgrpList: itgrpList
			};
		},

		/**
		 * テーブル表示領域のクリア
		 */
		clear : function(){
			var $ptBody = this.$("#ca_tbody_ptn");
			var $itBody = this.$("#ca_tbody_itgrp");
			$ptBody.find("tr").remove();
			$itBody.find("tr").remove();
			this.$("tfoot tr").show();
			this.$("#ca_ID,ca_name,#ca_code").val("");
		},

		// パターンテーブル行削除
		onPtnRowDelClick : function(e){
			$(e.target).parent().parent().remove();
			return;
		},

		// パターンテーブル行追加
		onPtnRowAddClick : function(){
			var $tbody = this.$("#ca_tbody_ptn");
			$("#ca_tmpl_ptn").tmpl({ikouFlag : 0}).appendTo($tbody);
			return;
		},

		// 品種テーブル行削除
		onItgrpRowDelClick : function(e){
			$(e.target).parent().parent().remove();
			return;
		},

		// 品種テーブル行追加
		onItgrpRowAddClick : function(){
			var $tbody = this.$("#ca_tbody_itgrp");
			$("#ca_tmpl_itgrp").tmpl({unitID : 0}).appendTo($tbody);
			var $select = $tbody.find("tr:last select[name='unitID']");
			var $input = $tbody.find("tr:last input[name='itgrpID']");
			clutil.clbusunitselector($select);
			clutil.clvarietycode($input,{
				getParentId : function(){
					return $input.parent().parent().find("select[name='unitID']").val();
				}
			});
			$select.on("change", this.onUnitChange);
			return;
		},

		viewReadonly: function(){
			clutil.viewReadonly(this.$el);
			this.$("span.btn-delete").hide();
			this.$("tfoot tr").hide();
		},
		_eof: 'AMMSV0370.RecListView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #searchAgain'	: '_onSearchAgainClick'
		},

		initialize: function(opt){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
				title: 'サイズグループ編集',
				subtitle: false,
				btn_submit: true,
				btn_new: false,
				btn_cancel: this._doCancel,
				buildSubmitReqFunction: this._buildSubmitReqFunction,
				buildGetReqFunction: this._buildGetReqFunction
			});
//			var groupid = 'AMMSV0370';
			// 検索(ヘッダ)パネルと検索結果(詳細)パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});
			this.recListView = new RecListView({el: this.$('#ca_result')});

			// イベント
			this.srchCondView.on('ca_onSearch', this._onSrch);		// 検索パネル srchCondView から検索ボタン押下イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
			clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.recListView.initUIElement();

			return 	this.srchCondView.initUIElement().done(_.bind(function(){
				// 検索条件を再指定ボタンを隠す
				this.srchAreaCtrl = clutil.controlSrchArea(
						this.srchCondView.$el,
						this.srchCondView.$('#ca_srch'),
						this.$('#ca_result'),
						this.$('#searchAgain'));
			}, this));
		},

		/**
		 * 検索結果表示
		 */
		setDataToRecListView: function(data){
			var sizeGrp = data.AMMSV0370GetRsp.sizeGrp;
			var ptnList = data.AMMSV0370GetRsp.sizePtnList;
			var itgrpList= data.AMMSV0370GetRsp.sizeGrpItgrpList;

			// 結果ペインを表示
			this.srchAreaCtrl.show_result();

			// 表の中身
			this.recListView.setRecs({sizeGrp:sizeGrp, ptnList:ptnList, itgrpList:itgrpList});
		},

		// this.recListView 編集不可
		setReadOnlyAllItems: function(){
			this.recListView.viewReadonly();
		},

		/**
		 *  GET 応答のイベントを受ける
		 */
		_onMDGetCompleted: function(args, e){
			console.log('args.status: [' + args.status + ']');

			// this.recListView を空欄にする
			this.recListView.clear();
			this.savedGetData = null;
			this.$("#searchAgain").text('検索条件を開く');

			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 View へセットする。

				// 編集可の状態にする。
				var data = args.data;
				this.savedGetData = data;
				this.setDataToRecListView(data);

				// 検索領域を入力不可に。
				this.srchCondView.setEnable(false);

				var $focusElem = this.recListView.$el.find('input[type="text"]').first();
				this.resetFocus($focusElem);

				break;
			case 'DONE':		// 確定済
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				var data = args.data;
				this.setDataToRecListView(data);
				this.srchCondView.setEnable(false);
				this.setReadOnlyAllItems();
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。
				this.setReadOnlyAllItems();
				break;
			}

		},

		/**
		 * Submit 応答のイベントを受ける
		 * @param args
		 * @param e
		 */
		_onMDSubmitCompleted: function(args, e){
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				this.setReadOnlyAllItems();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				this.setReadOnlyAllItems();
				break;
			case 'DELETED':		// 別のユーザによって削除された
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				clutil.mediator.trigger("onTicker", data);
				this.recListView.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				break;
			}
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render().setSubmitEnable(false);
			this.srchCondView.render();
			this.recListView.render();
			clutil.setFocus(this.$("#ca_srchID").next().children('input'));
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
				if(!this.srchCondView.isValid()){
					return null;
				}
				srchReq = this.srchCondView.serialize();
			}

			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				AMMSV0370GetReq: {
					srchID : srchReq.srchID ? srchReq.srchID : srchReq.ID // 保険
				}
			};
			return req;
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
					clutil.setFocus(this.$('#ca_srch').next().children('input'));
				} else {
					// 条件を開くボタンにフォーカスする
					clutil.setFocus(this.$('#searchAgain'));
				}
			}
		},


		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			if (this.$('#ca_srchArea').css('display') == 'none') {
				this.srchAreaCtrl.show_srch();
				this.$("#searchAgain").text('検索条件を閉じる');
				this.$("#searchAgain").fadeIn();
			} else {
				this.srchAreaCtrl.show_result();
				this.$("#searchAgain").text('検索条件を開く');
			}
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){
			// 編集データをクリア
			this.recListView.clear();
			this.savedGetData = null;

			// 検索条件を再指定
			this.srchCondView.setEnable(true);
			this.srchAreaCtrl.reset();

			// 登録ボタンを不活性、内部GETデータ破棄、リボンメッセージ非表示・・・など
			this.mdBaseView.clear({setSubmitEnable: false});
			clutil.setFocus(this.$("#ca_srchID").next().children('input'));
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId){
			var _this = this;
			var f_error = false;

			// view2ValidData() の内部で同時に valid チェックする。
			var data = this.recListView.view2ValidData();
			if(data == null){
				return null;
			}

			var sizeGrp = data.sizeGrp;
			var ptnList = data.ptnList;
			var itgrpList = data.itgrpList;

			var listLen = ptnList.length;
			$.each(ptnList, function(i,v){
				var compCode = this.sizePtnCode;
				for(var j = i+1; j < listLen; j++){
					if (ptnList[j].sizePtnCode == compCode){
						_this.recListView.validator.setErrorMsg(_this.$("#ca_table_ptn tr:nth-child(" + (i + 1) + ") input[name='sizePtnCode']"), clutil.fmtargs(clmsg.EMS0065, ["サイズパターンコード"]));
						_this.recListView.validator.setErrorMsg(_this.$("#ca_table_ptn tr:nth-child(" + (j + 1) + ") input[name='sizePtnCode']"), clutil.fmtargs(clmsg.EMS0065, ["サイズパターンコード"]));
						clutil.mediator.trigger("onTicker",  "データに重複があります"/*clutil.fmtargs(clmsg.EMS0065, ["サイズパターンコード"])*/);
						f_error = true;
					}
				}
			});

			listLen = itgrpList.length;
			$.each(itgrpList, function(i,v){
				var compUnitID = this.unitID;
				var compItgrpID = this.itgrpID;
				for(var j = i+1; j < listLen; j++){
					if (itgrpList[j].unitID == compUnitID && itgrpList[j].itgrpID == compItgrpID){
						_this.recListView.validator.setErrorMsg(_this.$("#ca_table_itgrp tr:nth-child(" + (i + 1) + ") input[name='itgrpID']"), clutil.fmtargs(clmsg.EMS0065, ["対象品種"]));
						_this.recListView.validator.setErrorMsg(_this.$("#ca_table_itgrp tr:nth-child(" + (j + 1) + ") input[name='itgrpID']"), clutil.fmtargs(clmsg.EMS0065, ["対象品種"]));
						clutil.mediator.trigger("onTicker", "データに重複があります");
						f_error = true;
					}
				}
			});

			if (f_error){
				return null;
			}

			$.each(ptnList,function(){
				this.sizeGrpID = sizeGrp.ID;
				this.ikouFlag = Number(this.ikouFlag);
			});
			$.each(itgrpList,function(){
				this.sizeGrpID = sizeGrp.ID;
			});

			var reqObj = {
				reqHead: {
					opeTypeId: opeTypeId
				},
				AMMSV0370UpdReq: {
					sizeGrp : sizeGrp,
					sizePtnList: ptnList,
					sizeGrpItgrpList : itgrpList
				}
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

		_eof: 'AMMSV0370.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView();
		mainView.initUIElement().done(_.bind(function(){
			mainView.render();
			// フッターボタン名補正
			mainView.$('#mainColumnFooter #cl_cancel').text('条件再設定');
		}, this));
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
