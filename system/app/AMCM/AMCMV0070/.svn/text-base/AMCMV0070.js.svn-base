// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,

		events: {
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
					title: '権限',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,

					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,

					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,

					buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// アプリ個別の View や部品をインスタンス化するとか・・・

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

			// Fieldlimit
			clutil.cltxtFieldLimit($("#ca_roleCode"));
			clutil.cltxtFieldLimit($("#ca_roleName"));

			return this;
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){
			var _this = this;

			this.mdBaseView.initUIElement();

			// 参照可能組織(データパーミッション区分)
			clutil.cltypeselector(this.$("#ca_permOrgID"), amcm_type.AMCM_TYPE_DATAPERM, 1);

			// MDB参照可能組織(データパーミッション区分)
			clutil.cltypeselector(this.$("#ca_mdbPermOrgID"), amcm_type.AMCM_TYPE_DATAPERM, 1);

			// メニュー
			this.menuField = clutil.clmenucode(this.$("#ca_menuID"));
			this.menuField.on('change', function(data) {
				if (data != null) {
					// GET:メニュー別権限設定
					return _this.getMenuNodeList(data.id);
				}
			});

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				clutil.setFocus(this.$("#ca_roleCode"));
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		/**
		 * Submit 応答のイベントを受ける
		 */
		_onMDSubmitCompleted: function(args, e){

			console.log("SubmitCompleted status:" + args.status);

			var data = args.data;

			switch(args.status){
			case 'DONE':		// 確定済
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				document.location = '#';
				clutil.viewReadonly(this.$el);
				clutil.viewReadonly(this.$('#ca_table_tbody'));
				break;

			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				clutil.viewReadonly(this.$('#ca_table_tbody'));
				break;

			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				clutil.viewReadonly(this.$('#ca_table_tbody'));
				break;

			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		/**
		 * GET 応答のイベントを受ける
		 */
		_onMDGetCompleted: function(args, e){
			console.log("GetCompleted status:" + args.status);

			var data = args.data;

			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 Veiw へセットし、編集可の状態にする。
				this.data2view(data);

				clutil.viewRemoveReadonly(this.$el);
				var $tbody = this.$('#ca_table_tbody');
				clutil.viewRemoveReadonly($tbody);

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
					// 照会モード・削除モードは、Edit ブロッキングしておく。
					clutil.viewReadonly(this.$el);
					clutil.viewReadonly($tbody);
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
					// TODO
					$("#ca_roleCode").val("");
					clutil.setFocus($("#ca_roleCode"));
					break;
				default:
					clutil.inputReadonly($("#ca_roleCode"));
					clutil.setFocus($("#ca_roleName"));
					break;
				}
				break;

			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				clutil.viewReadonly(this.$('#ca_table_tbody'));
				break;

			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				clutil.viewReadonly(this.$('#ca_table_tbody'));
				break;

			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				clutil.viewReadonly(this.$el);
				clutil.viewReadonly(this.$('#ca_table_tbody'));
				break;

			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化する
				clutil.viewReadonly(this.$el);
				clutil.viewReadonly(this.$('#ca_table_tbody'));
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		/**
		 * メニューノードリスト取得
		 */
		getMenuNodeList: function(menuID) {

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},

				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},

				// 権限検索リクエスト
				AMCMV0070GetReq: {
					srchRoleID: Number($('#ca_roleID').val()),	// 権限ID
					srchMenuID: menuID,	// メニューID
				},
				// 権限更新リクエスト -- 今は検索するので、空を設定
				AMCMV0070UpdReq: {
				}
			};

			var defer = clutil.postJSON('AMCMV0070', getReq).done(_.bind(function(data){

				// データ取得
				var recs = data.getRsp;

				if (_.isEmpty(recs)) {
					// エラーメッセージ表示
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					clutil.setFocus($("#ca_menuID"));

				} else {
					var menuNodeList = recs.menuNodeList;
					// メニュー別権限設定を表示
					this.makeTable(menuNodeList);
				}
			}, this)).fail(_.bind(function(data){

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
				clutil.setFocus($("#ca_menuID"));

			}, this));

			return defer;

		},

		/**
		 * データを表示
		 */
		data2view: function(data) {

			var roleRec = data.getRsp.roleRec;
			var menuNodeList = data.getRsp.menuNodeList;

			// テキストボックス系反映
			clutil.data2view(this.$('#ca_roleinfoArea'), roleRec);
			// メニューを表示
			this.menuField.setValue({id: roleRec.menuID, code: "", name: roleRec.menuName});
			// メニュー別権限設定を表示
			this.makeTable(menuNodeList);

		},

		/**
		 * メニュー別権限設定を表示
		 * @param list
		 */
		makeTable: function(list) {

			//テーブル初期化
			var $tbody = $("#ca_table_tbody");
			$tbody.empty();

			$.each(list, function() {

				var tr = _.template($("#ca_rec_template").html(), this);
				$tbody.append(tr);

				// ロール機能権限設定
				var $tr = $tbody.find('tr:last');	// 追加した行
				var isRead = (this.readFlag) ? 'check' : 'uncheck';
				var isWrite = (this.writeFlag) ? 'check' : 'uncheck';
				var isDel = (this.delFlag) ? 'check' : 'uncheck';
				var isEm = (this.emFlag) ? 'check' : 'uncheck';
				$tr.find("td.read_check input").checkbox(isRead);
				$tr.find("td.write_check input").checkbox(isWrite);
				$tr.find("td.del_check input").checkbox(isDel);
				$tr.find("td.em_check input").checkbox(isEm);

			});

		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){

			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			this.validator.clear();

			if(!this.validator.valid()) {
				return null;
			}

			var updReq = {};

			var role = clutil.view2data(this.$('#ca_roleinfoArea'));
			var list = clutil.tableview2data(this.$('#ca_table_tbody').children());

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				role.recno = "";
				role.state = 0;
				role.roleID = 0;
			}

			updReq = {
				roleRec : role,
				menuNodeList : list
			};

			var reqHead = {
				opeTypeId : this.options.opeTypeId,
				recno : role.recno,
				state : role.state
			};
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var reqObj = {
				reqHead : reqHead,
				AMCMV0070UpdReq  : updReq
			};
			console.log(reqObj);

			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		/**
		 * Get リクエストを作る
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var chkData = this.options.chkData[pgIndex];

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},

				// 共通ページヘッダ -- 使わないけど入っている。
				reqPage: {
				},

				// 権限検索リクエスト
				AMCMV0070GetReq: {
					srchRoleID: chkData.id,			// 権限ID
					srchMenuID: chkData.menu_id,	// メニューID
				},
				// 権限更新リクエスト -- 今は検索するので、空を設定
				AMCMV0070UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMCMV0070',
				data: getReq
			};
		},

		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){

		},

		_eof: 'AMCMV0070.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){

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
