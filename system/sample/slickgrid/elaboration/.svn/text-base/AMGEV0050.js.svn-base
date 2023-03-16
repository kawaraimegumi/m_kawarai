$(function(){

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'					: '_onSrchClick',			// 検索ボタン押下時
			'change #ca_srchTypeID'				: '_onSrchTypeChanged'		// 取引先区分が変更された
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

			// 検索日
			this.srchDatePicker = clutil.datepicker(this.$('#ca_srchDate'));

			// 取引先区分	#ca_srchTypeID
			clutil.cltypeselector({
				$select: this.$("#ca_srchTypeID"),
				kind: amcm_type.AMCM_TYPE_VENDOR,
				unselectedflag: 1
			});

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);

			// 取引先オートコンプリート
			clutil.clvendorcode(this.$('#ca_srchID'), {
				getVendorTypeId: _.bind(function(){
					return this.getValue('srchTypeID', 0);
				}, this)
			});

			// 初期値を設定
			this.deserialize({
				srchTypeID: 0,						// 取引先区分
				srchUnitID: 0,						// 事業ユニット
//				srchCode: null,					// 取引先コード
//				srchID: 0,						// 取引先ID
				srchName: null,						// 取引先名称
				srchKana: null,						// 取引先名称カナ
				srchDate: clcom.getOpeDate(),		// 検索日 yyyymmdd
				allHistFlag: 0						// 全出力フラグ
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
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 取引先コード・オートコンプリート設定チェック
			if(!this.isValid()){
				return;
			}
			var dto = this.serialize();
			this.trigger('ca_onSearch', dto);
		},
		// 取引先区分が変更されたイベント ⇒ 取引先コード・オートコンプリートの内部設定値をクリアする。
		_onSrchTypeChanged: function(e){
			//console.log(e);
			if(this.deserializing){
				// データセット中
				return;
			}
			//clutil.data2view(this.$el, {srchID: null}, null, 'skipundefined-on');
			this.$('#ca_srchID').autocomplete('removeClAutocompleteItem');
		},

		_eof: 'AMSSV0310.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click #ca_action1'			: '_onClickAppAction',	// XXX アプリボタンデモ
			'click #ca_action2'			: '_onClickAppAction',	// XXX アプリボタンデモ
			'click #searchAgain'			: '_onSearchAgainClick'	// 検索条件を再指定ボタン押下
		},

		// XXX アプリボタンデモ
		_onClickAppAction: function(e){
			alert('［' + e.target.textContent + '］がクリックされました。');
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				title: '推敲',
				subtitle: '行内フィールドリレーション（準備中）',
				opeTypeId: -1,
				btn_submit: false
			});

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			/*
			 * データグリッド【推敲】
			 */
			this.dataGrid = new ClGrid.ClAppGridView({
				el: '#ca_datagrid',
				lineno: true,			// 行番号表示する/しないフラグ。
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true	// フッター部の新規行追加ボタンを使用するフラグ。
			});
			this.listenTo(this.dataGrid, 'footer:addNewRow', function(gridView){
				// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
				var newItem = boodata(1)[0];
				gridView.addNewItem(newItem);
			});

			// イベント
			this.srchCondView.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント

			// OPE系イベント
//			'click div#title p.addNew>a'	: '_onNewClick',			// 新規押下
//			'click #ca_edit'				: '_onEditClick',			// 編集ボタン押下
//			'click #ca_delete'				: '_onDeleteClick',			// 削除ボタン押下
//			'click #ca_rsvcancel'			: '_onReserveCancelClick'	// 予約取消ボタン押下
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));

			/*
			 * データグリッド【推敲】
			 */
			//this.dataGrid.initUIElement();

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();

			this.srchAreaCtrl.show_both();

			/*
			 * データグリッドの render
			 * id: カラム識別 id。省略すると、setData() 時におけるカラムインデックス値が内部で設定されます。
			 * name: ラベル文字列
			 * field: 行データ上のプロパティ名称
			 * cssClass: ラベル文字列を表示する際のスタイル定義クラスを指定
			 * cellType: 当該列におけるセルの描画/エディタを指定。
			 */
			var columns = [
				{
					id: 'checked',
					name: 'x',
					field: 'checked',
					cellType: {
						type: 'checkbox'
					},
					headCellType: {
						type: 'checkbox'
					}
				},
				{
					id: "rank",
					name: "ランク",
					field: "rank",
					cellType: {
						type: "selector",
						editorOptions: function(item, dataView){
							// 行インデックス
							var row = dataView.getBodyRowById(item[dataView.idProperty]);
							return {
								items: [
									{id: 1, label: "良い"},
									{id: 2, label: "悪い"}
								]
							};
						},
						formatter: function(item){
							return item ? item.label : '';
						}
					}
				},
				{
					id: "slipID",
					name: "伝票区分",
					field: "slipID",
					cellType: {
						type: "cltypeselector",
						editorOptions: {
							kind: amcm_type.AMCM_TYPE_SLIP
						}
					}
				},
				{
					id: "date",
					name: "日付け",
					field: "date",
					cellType: {
						type: "date"
					}
				},
				{
					id: "price",
					name: "価格",
					field: "price",
					cssClass: 'txtalign-right',		// 右寄せ
					cellType: {
						type: "text",
						validator: "decimal min:0, max:1000",
						limit: "number:,2",
						formatFilter: "currency",//"comma",
						editorOptions: {
							addClass: 'txtar'		// エディタ：右寄せ
						}
					},
					headCellType: function(args){
						// 1行目は編集可能に
						if (args.row === 1){
							return {
								type: "text"
							};
						}
					}

				},
				{
					id: "count",
					name: " 数量",
					field: "count",
					cssClass: 'txtalign-right',		// 右寄せ,
					cellType: {
						type: "text",
						validator: "required int min:0",
						limit: "number:3,0",
						formatFilter: "comma",
						editorOptions: {
							addClass: 'txtar'		// エディタ：右寄せ
						}
					}
				},
				{
					id: "orgfuncID",
					name: "組織体系",
					field: "orgfuncID",
					cellType: {
						type: "clajaxselector",
						editorOptions: {
							funcName: "orgfunc"
						}
					},
					width: 180
				},
				{
					id: "orglevelID",
					name: "組織階層",
					field: "orglevelID",
					cellType:{
						type: "clajaxselector",
						editorOptions: {
							funcName: "orglevel",
							dependAttrs: function(item){
								return {
									orgfunc_id: item.orgfuncID.id
								};
							}
						},
						// エディタ作成前に呼ばれる. falseをリターンでエディタの作成を行わない
						isEditable: function(item, row, column, dataView){
							if (!item.orgfuncID.id){
								return false;
							}
						}
					},
					width: 180
				},
				{
					id: "orgID",
					name: "組織コード",
					field: "orgID",
					cellType:{
						type: "clajaxac",
						editorOptions: {
							funcName: "orgcode",
							dependAttrs: function(item){
								return {
									orgfunc_id: item.orgfuncID.id,
									orglevel_id: item.orglevelID.id
								};
							},
							isEditable: function(item, row, column, dataView){
								if (!item.orgfuncID.id || !item.orglevelID.id){
									return false;
								}
							}
						}
					},
					width: 120
				},
				{
					id: "total",
					name: " 合計",
					field: "total",
					cssClass: 'txtalign-right',		// 右寄せ,
					cellType: {
						formatFilter: 'comma'
					}
				}
			];

			/*
			 * グリッド部品を初期化して、表示内容をセットする。
			 */
			this.dataGrid.render().setData({
				gridopt: {},					// データグリッドのオプション
				columns: columns,				// カラム定義
				data: boodata(10),				// データ。
				rowDelToggle: true				// この回でセットするデータ data に対して、行削除をトグルモードにする場合は、このオプションを true にする。
			});
			// selectionmodelの設定なしだとcheckboxselectorをつかったときにエラーがでる
			this.dataGrid.grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
			this.dataGrid.grid.registerPlugin(new Slick.CheckboxSelectColumn({
				cssClass: "slick-cell-checkboxsel"
			}));

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
				if(this.srchCondView.isValid()){
					srchReq = this.srchCondView.serialize();
				}else{
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
//				reqPage: _.first(this.pagerViews).buildReqPage0(),
				AMMSV0310GetReq: srchReq
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
			this.clearResult();

			var defer = clutil.postJSON('AMMSV0310', srchReq).done(_.bind(function(data){
				//console.log(arguments);

				// 内容物が空の場合 --> ヘッダにエラーメッセージを出す。「検索結果は0件です。」
				var recs = data.AMMSV0310GetRsp.vendorList;
				if(_.isEmpty(recs)){
					// 検索ペインを表示？
					mainView.srchAreaCtrl.show_srch();

					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);
					return;
				}

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();

				// TODO: データグリッドへ初期のネタを入れる？？？？


				this.resetFocus($focusElem);
			}, this)).fail(_.bind(function(data){
				//console.log(arguments);
				//this.clearResult();

				// 検索ペインを表示
				mainView.srchAreaCtrl.show_srch();

				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);

				this.resetFocus($focusElem);

			}, this));

			return defer;
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
			var defer = clutil.postDLJSON('AMMSV0310', srchReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

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
				clutil.setFirstFocus($focusElem);
			}else{
				// TODO : 適当な場所を select してフォーカスを入れる。
//				if (this.$('#searchAgain').css('display') == 'none') {
//					// 検索ボタンにフォーカスする
//					this.$('#ca_AMRSV0010_search').focus();
//				} else {
//					// 条件を追加ボタンにフォーカスする
//					this.$('#ca_AMRSV0010_add').focus();
//				}
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			this.srchAreaCtrl.show_srch();
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧画面では使用しない*/, e){
			// XXX
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

			// 確定時用のデータを初期化
			this.savedReq = null;

//			// テーブルをクリア
//			this.recListView.clear();
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

		_eof: 'AMSSV0310.MainView//'
	});

	// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
	// テストデータ
	boodata = function(num){
		if(num === undefined){
			num = 10;
		}
		var data = _(num).chain()
		.range()
		.map(function(i){
			return {
				id: _.uniqueId('id'),
				checked: i % 2 === 0,
				date: clutil.addDate(20140401, i),
				slipID: 10,
				price: 100 + 50*i,
				count: 0,
				orgfuncID: {id: 1, code: "001", name: "* 基本組織"},
				orglevelID: {id: 6, code: "0006", name: "* 店舗・部"},
				orgID: {id:0011, code: '0011', name: '諏訪赤沼店'},
				total: 0
			};
		}).value();
		return data;
	};

	//--------------------------------------------------------------
	// 初期データ取得
	clutil._XXXDBGGetIniPermChk = false;
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

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

	// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
	// テストデータ
	boo = function(){
		/*
		 * データグリッド【推敲】
		 */
		mainView.srchAreaCtrl.show_both();
		mainView.dataGrid.setData({data: boodata(), delRowToggle: true});
	};
});
