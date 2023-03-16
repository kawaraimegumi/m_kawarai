$(function() {

	// リミッタによる刈り取りを停止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		validator : null,

		// Events
		events : {
			'click #ca_table_tbody td[name="add_button"]' : "_onTbodyAddClick",	// 行追加押下時
			'click #ca_table_tbody td[name="del_button"]': "_onTbodyDeleteClick",	// 行削除押下時
			"click #ca_table_tfoot tr.addRow td" : "_onTfootAddClick",	// 行追加押下時
		},

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
					title: '商品分類体系マスタ',
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

			this.validator = clutil.validator(this.$("#ca_form"), {
				echoback : $('.cl_echoback')
			});

			// アプリ個別の View や部品をインスタンス化するとか・・・

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}
			this.opeTypeId = fixopt.opeTypeId;	// 処理区分を保存
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table"));
				$("#ca_table").addClass('my_disabled');
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table"));
				$("#ca_table").addClass('my_disabled');
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				clutil.viewReadonly($("#ca_table"));
				$("#ca_table").addClass('my_disabled');
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.mdBaseView.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			var data = args.data;
			var func = _.extend({}, data.AMMSV0020GetRsp.func);
			var levelList = _.extend({}, data.AMMSV0020GetRsp.levelList);

			var name = clutil.gettypename(amcm_type.AMCM_TYPE_ITGRPFUNC, func.itgrpfuncTypeID, 1);
			func.itgrpfuncTypeName = name;

			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				clutil.data2view(this.$("#ca_form"), func);
				//clutil.data2view(this.$("#ca_form"), itgrpRel);
				this.renderTable(levelList);

				switch (this.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					// 体系コードは入力不可
					clutil.inputReadonly(this.$('#ca_code'));
					// 名称は入力可
					clutil.inputRemoveReadonly(this.$("#ca_name"));
					this.resetFocus($("#ca_name"));
					if (func.itgrpfuncTypeID == amcm_type.AMCM_VAL_ITGRPFUNC_BASIC ||
							func.itgrpfuncTypeID == amcm_type.AMCM_VAL_ITGRPFUNC_CROSS) {
						// 任意体系以外ではテーブルは操作不可
						//$("#ca_table_tbody input").attr('readonly', true);
					}
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					clutil.viewReadonly($("#ca_form"));
					$("#ca_table_tbody input").attr('readonly', true);
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
					clutil.viewReadonly($("#ca_form"));
					$("#ca_table_tbody input").attr('readonly', true);
					break;
				}
				$("#ca_table").removeClass('my_disabled');

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), func);
				//clutil.data2view(this.$("#ca_form"), itgrpRel);
				this.renderTable(levelList);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				$("#ca_table_tbody input").attr('readonly', true);
				$("#ca_table").addClass('my_disabled');
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				clutil.data2view(this.$("#ca_form"), func);
				//clutil.data2view(this.$("#ca_form"), itgrpRel);
				this.renderTable(levelList);

				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				$("#ca_table_tbody input").attr('readonly', true);
				$("#ca_table").addClass('my_disabled');
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly($("#ca_form"));
				break;
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			clutil.cltxtFieldLimit($("#ca_code"));
			clutil.cltxtFieldLimit($("#ca_name"));

			// 初期のアコーディオン展開状態をつくる。

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			this.mdBaseView.fetch();	// データを GET してくる。
			if (this.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				var name = clutil.gettypename(amcm_type.AMCM_TYPE_ITGRPFUNC, amcm_type.AMCM_VAL_ITGRPFUNC_ANY, 1);
				this.$("#ca_itgrpfuncTypeName").val(name);
				this.$("#itgrpfuncTypeID").val(amcm_type.AMCM_VAL_ITGRPFUNC_ANY);

				var $tbody = this.$("#ca_table_tbody");
				// 階層を2行表示
				for (var i = 0; i < 2; i++) {
					var data = {
						levelID: 0,
						no: (i+1),
						levelNo: i+1,
						levelName: "",
						levelCode: "",
						itgrplevelTypeID: 0,
					};
					var html = _.template(this.$("#ca_rec_template").html(), data);
					$tbody.append(html);	// tbodyの最後に追加
				}

				this.resetFocus($("#ca_code"));
			}
			return this;
		},

		/**
		 * テーブル描画
		 * @param levelList
		 */
		renderTable: function(levelList) {
			var $table = this.$("#ca_table");
			var $tbody = this.$("#ca_table_tbody");
			// クリア
			$tbody.empty();

			if (levelList == null || levelList.length == 0) {
				// 0件の場合（多分ない）は処理終了
				return;
			}
			var no = 0;
			$.each(levelList, function() {
				no++;
				var level = _.extend({no:no}, this);
				var html = _.template($("#ca_rec_template").html(), level);
				$tbody.append(html);
			});
			// テーブル表示を初期化
			clutil.initUIelement($table);
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			//console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var chkData = this.options.chkData[pgIndex];
			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ		・・・これ、必要なの？					【確認】
				reqPage: {
				},
				// 取引先マスタ検索リクエスト
				AMMSV0020GetReq: {
					srchID: chkData.id,		// 商品分類ID
					delFlag: chkData.delFlag,	// 削除フラグ
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMMSV0020UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMMSV0020',
				data: getReq
			};
		},

		isValid: function() {
			var f_valid = true;
			this.validator.clear();
			if (!this.validator.valid()) {
				f_valid = false;
			}
			// テーブル領域エラーチェック
			// テーブルデータを取りながら、行末空欄スキップと、入力チェックを行う。
		    var items = clutil.tableview2ValidData({
		        $tbody: this.$('#ca_table_tbody'),    // <tbody> の要素を指定する。
		        validator: this.validator,   // validator インスタンスを指定する。（どこのものでもかまわない）
		        tailEmptyCheckFunc: function(item){     // 行末空欄行を判定するための関数を指定。空判定はtrueを返すように。//ラジオボタン選択値をとる
		        	if (item.levelID != 0) {
		        		return false;
		        	} else {
			            return _.isEmpty(item.levelName);
		        	}
		        }
		    });
		    if(_.isEmpty(items)){
		        // 全部空欄行だったとか・・・
		        clutil.mediator.trigger('onTicker',clmsg.EGM0024);
		        f_valid = false;
		    }

			return f_valid;
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			var f_error = false;
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			// 入力チェック
			if (!this.isValid()) {
				return null;
			}
			// 画面入力値をかき集めて、Rec を構築する。
			var func = clutil.view2data($("#ca_form"));
			var levelListTmp = clutil.tableview2data($("#ca_table_tbody tr"));
			var levelList = _.filter(levelListTmp, function(dto) {
				return dto.levelID != 0 || !_.isEmpty(dto.levelName);
			});

			// 入力チェック
			if (levelList == null || levelList.length == 0) {
				// 階層が未入力の場合はエラー
				this.validator.setErrorHeader("商品分類階層が存在しません。");
				f_error = true;
			}
			if (f_error) {
				return null;
			}

			$.each(levelList, function() {
				delete this.relItgrpDivData;
				delete this.relItgrpData;

				this.id = func.id;
			});

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: opeTypeId,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 商品分類マスタ検索リクエスト -- 更新なので、空を設定
				AMMSV0020GetReq: {
				},
				// 商品分類マスタ更新リクエスト
				AMMSV0020UpdReq: {
					func: func,
					levelList: levelList,
				},
			};
			return {
				resId: clcom.pageId,
				data:  updReq,
			};
		},

		isAny: function() {
			var itgrpfuncTypeID = $("#ca_itgrpfuncTypeID").val();
			if (itgrpfuncTypeID == amcm_type.AMCM_VAL_ITGRPFUNC_BASIC ||
					itgrpfuncTypeID == amcm_type.AMCM_VAL_ITGRPFUNC_CROSS) {
				// 任意体系以外ではテーブルは操作不可
				return false;
			}
			return true;
		},

		_onTbodyDeleteClick: function(e) {
			if (this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					&& this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				return false;
			}
			if (!this.isAny()) {
				return false;
			}
			if ($("#ca_table").hasClass('my_disabled')) {
				return false;
			}

			var $tgt = $(e.target);
			var $tgt_tr = $tgt.parents('tr');
			$tgt_tr.remove();
			this.renumberLevel();
		},

		_onTbodyAddClick: function(e) {
			// 予約取消・削除時は何もしない
			if (this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					&& this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				return false;
			}
			if (!this.isAny()) {
				return false;
			}
			if ($("#ca_table").hasClass('my_disabled')) {
				return false;
			}

			var $tgt = $(e.target);
			// クリックされた行を取得
			var $tgt_tr = $tgt.parents('tr');
			var add_tmp = {
				levelID: 0,
				levelCode: "",
				levelName: "",
				levelNo: 0,
				itgrplevelTypeID: 0,
				no: 0,
			};
			var html = _.template($("#ca_rec_template").html(), add_tmp);
			$tgt_tr.before(html);	// 指定行の上に挿入

			this.renumberLevel();
		},

		/**
		 * 行追加(tfoot)
		 */
		_onTfootAddClick: function() {
			// 予約取消・削除時は何もしない
			if (this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					&& this.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				return false;
			}
			if (!this.isAny()) {
				return false;
			}
			if ($("#ca_table").hasClass('my_disabled')) {
				return false;
			}

			var add_tmp = {
				levelID: 0,
				levelCode: "",
				levelName: "",
				levelNo: 0,
				itgrplevelTypeID: 0,
				no: 0,
			};
			var $tbody = this.$("#ca_table_tbody");
			var html = _.template(this.$("#ca_rec_template").html(), add_tmp);
			$tbody.append(html);	// tbodyの最後に追加

			this.renumberLevel();
		},

		renumberLevel: function() {
			var level = 1;
			$("#ca_table_tbody tr").each(function() {
				$(this).attr('no', level);
				$(this).attr('name', level);
				$(this).find('td[name="ca_levelNo"]').text(level);
				$(this).find('input[name="ca_levelNo"]').val(level);
				level++;
			});
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if ($focusElem) {
				clutil.setFirstFocus($focusElem);
			}
		},

		_eof: 'AMSSV0020.MainView//'
	});

	////////////////////////////////////////////////

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		// ここで、clcom の内容が保証される /////////////////

		// 一覧画面からの引継データ pageArgs があれば渡す。
		//	pageArgs: {
		//		// 機能種別
		//		opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL,
		//		// 一覧画面で選択されたアイテム要素の配列
		//		chkData: [
		//			{id:1,code:'code-001',name:'item-001',},
		//			{id:2,code:'code-002',name:'item-002',},
		//			{id:3,code:'code-003',name:'item-003',}
		//		]
		//	};
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
