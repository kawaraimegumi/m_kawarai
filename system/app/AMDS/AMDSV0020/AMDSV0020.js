// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	var AMDSV0020Const = {
		NO_SET : "未設定",
	};

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
			'change #ca_unitID'				:	'_onUnitChanged',		// 事業ユニットが変更された
			'click #ca_sample_download'		:	'_onSampleDLClick',		// ExcelサンプルDLボタン押下
			'click #ca_tableRank_tbody tr'	:	'_onRankRowClick',
//			"click #ca_tableRank_tfoot tr"	:	"_onAddRankRowClick",
			"click span.btn-add"			:	"_onAddRankRowClick",
			'click #ca_tableRank_tbody span.btn-delete'	:	'_onRankDeleteClick',
//			'change #ca_tableRank_tbody input[name="ca_rankCode"]'	:	'_onRankCodeChanged',
			'blur #ca_tableStore_tbody input[name="ca_rankCode"]'	:	'_onRankCodeStoreBlur',
			'click .cl_download'			:	'_onCSVClick',			// Excelデータ出力押下
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
					title: '店舗ランクパターン',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					btn_csv: true,
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
//			clutil.mediator.on('onOperation', this._doOpeAction);	// CSV出力用

			// onOperation イベントを発火するかどうか
			this.onOperationSilent = (opt && opt.onOperationSilent);

			// Fieldlimit
			clutil.cltxtFieldLimit($("#ca_rankPtnName"));

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$("#ca_base_form"), {
				echoback : $('.cl_echoback')
			});

			// 保存用データ
			this.rankRecords = [];
			this.storeRankRecords = [];

			return this;
		},

		initUIElement: function(){
			var _this = this;
			this.mdBaseView.initUIElement();

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					var ptnRecord = clutil.view2data(this.$("#ca_base_form"));
					var itgrp = _.pick(ptnRecord._view2data_itgrpID_cn, 'id', 'code', 'name');
					ptnRecord.itgrpCodeName = {
						id: itgrp.id,
						code: itgrp.code,
						name: itgrp.name
					};
					delete ptnRecord._view2data_itgrpID_cn;
					// リクエストデータ本体
					var request = {
						AMDSV0020UpdReq: {
							ptnRecord: ptnRecord
						}
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMDSV0020',
						data: request
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(this.validator.valid, this.validator)
				}
			});
			// 取込処理が失敗した。後処理が必要な場合は↓イベントを購読する。
			this.opeCSVInputCtrl.on('fail', function(data){
				if (data.rspHead.fieldMessages){
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					_this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}
				if (data.rspHead.uri){
					// CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				}
			});
			// 取込処理が成功した。返ってきたデータからテーブル作成。
			this.opeCSVInputCtrl.on('done', function(data){
				var unitID = Number($('#ca_unitID').val());
				_this.data2view(data, unitID);
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで

			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
				// 事業ユニット
				clbusunitselector: {
					el: "#ca_unitID",
					initValue: clcom.userInfo.unit_id
				},
				// 品種オートコンプリート
				clvarietycode: {
					el: "#ca_itgrpID",
				},
				// サブクラス1
				'clitemattrselector subclass1': {
					el: "#ca_sub1ID",
					dependSrc: {
						iagfunc_id: 'subclass1_id'
					}
				},
				// サブクラス2
				'clitemattrselector subclass2': {
					el: "#ca_sub2ID",
					dependSrc: {
						iagfunc_id: 'subclass2_id'
					}
				},
				// ブランド
				'clitemattrselector brand': {
					el: "#ca_brandID",
					dependSrc: {
						iagfunc_id: 'brand_id'
					}
				},
				// スタイル
				'clitemattrselector style': {
					el: "#ca_styleID",
					dependSrc: {
						iagfunc_id: 'style_id'
					}
				},
				// 色
				'clitemattrselector color': {
					el: "#ca_colorID",
					dependSrc: {
						iagfunc_id: 'color_id'
					}
				},
				// 柄
				'clitemattrselector design': {
					el: "#ca_designID",
					dependSrc: {
						iagfunc_id: 'design_id'
					}
				},
				// プライスライン
				'select priceline': {
					el: "#ca_priceLineID",
					depends: ['itgrp_id'],
					getItems: function (attrs) {
						var ret = clutil.clpriceline(attrs.itgrp_id);
						return ret.then(function (data) {
							return _.map(data.list, function(item) {
								return {
									id: item.pricelineID,
									code: item.pricelineCode,
									name: item.pricelineName
								};
							});
						});
					}
				}
			}, {
				dataSource: {
					ymd: clcom.getOpeDate,
					subclass1_id: clconst.ITEMATTRGRPFUNC_ID_SUBCLS1,
					subclass2_id: clconst.ITEMATTRGRPFUNC_ID_SUBCLS2,
					brand_id: clconst.ITEMATTRGRPFUNC_ID_BRAND,
					style_id: clconst.ITEMATTRGRPFUNC_ID_STYLE,
					color_id: clconst.ITEMATTRGRPFUNC_ID_COLOR,
					design_id: clconst.ITEMATTRGRPFUNC_ID_DESIGN,
				}
			});
			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。(空の店舗ランク取得)
			});

			// 初期のアコーディオン展開状態をつくる。

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				this.fieldRelation.done(_.bind(function(){
					// 空の店舗ランク取得
					var unitID = Number($('#ca_unitID').val());
					var req = this.buildReq(unitID);
					if (req) {
						return this.doSrch(req, unitID);
					}
				}, this));
				if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
					clutil.setFocus(this.$("#ca_itgrpID"));
				}
				else{
					clutil.setFocus(this.$("#ca_unitID"));
				}
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// args.data が null なら空欄表示化する。args.data に何かネタがあれば画面個別Viewへセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				this.validator.setErrorInfoFromSrv(args.data.rspHead.fieldMessages, {prefix: 'ca_'});
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			var data = args.data;

			switch(args.status){
			case 'OK':
				// args.data をアプリ個別 Veiw へセットする。
				this.data2view(data);
				// 編集可の状態にする。
				clutil.viewRemoveReadonly($("#ca_base_form"));
				$("form > a.cl-file-attach").attr("disabled",false);
				$('.cl_datagrid_footer').show();
				// 編集可にする
				$('#ca_tableStore').find('input[type="text"]').hide();
				mainView.f_edit = 0;

				this.addEvent();

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					this.fieldRelation.done(_.bind(function(){
						// 事業ユニットは入力不可
						clutil.viewReadonly($('#ca_unitID_div'));
						// 品種は入力不可
						clutil.inputReadonly($('#ca_itgrpID'));
						// コード,名称は入力不可
						clutil.inputReadonly($('#ca_rankPtnCode'));
					}, this));
					clutil.setFocus($('#ca_rankPtnName'));
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
					// コードは空で入力不可
					$('#ca_rankPtnCode').val("");
					this.fieldRelation.done(_.bind(function(){
						clutil.inputReadonly($('#ca_rankPtnCode'));
					}, this));
					if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
						clutil.viewReadonly($('#ca_unitID_div'));
						clutil.setFocus(this.$("#ca_itgrpID"));
					}
					else{
						clutil.setFocus(this.$("#ca_unitID"));
					}
					break;
				default:
					this.setReadOnlyAllItems();
					break;
				}

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 確認：画面は何を表示するのか？？？						【確認】
				// 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				this.data2view(data);
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems();
				break;
			}
		},

		/**
		 * データを表示
		 */
		data2view: function(data, unitID){
			this.saveData = data.AMDSV0020GetRsp;
			var ptnRecord = data.AMDSV0020GetRsp.ptnRecord;
			ptnRecord.unitID = ptnRecord.unitCodeName.id;
			ptnRecord.itgrpID = ptnRecord.itgrpCodeName;
			this.rankRecords = data.AMDSV0020GetRsp.rankRecords;
			this.storeRankRecords = data.AMDSV0020GetRsp.storeRankRecords;
			$.each(this.storeRankRecords, function() {
				this.oldRankCode = '';
			});


			// 店舗テーブルクリア
			$("#ca_tableStore_tbody").empty();

			if (!unitID) {
				clutil.data2view(this.$('#ca_base_form'), ptnRecord);
			}

			this.renderTable(this.rankRecords, $("#ca_tableRank_tbody"), $("#ca_rank_template"));
		},

		// 初期データ取得後に呼ばれる関数
		setReadOnlyAllItems: function(){
			this.fieldRelation.done(_.bind(function(){
				clutil.viewReadonly($('#ca_base_form'));
				$("form > a.cl-file-attach").attr("disabled", true);
				var $table1 = this.$("#ca_tableRank");
				$table1.find('input[type="text"]').attr("readonly", true);
				$table1.find('tbody span.edit').hide();	// 編集ボタンを隠す
				$table1.find('tbody span.btn-delete').hide();
//				$table1.find('tbody span.btn-add').hide();
				$table1.find('tfoot').hide();
				var $table2 = this.$("#ca_tableStore");
				$table2.find('input[type="text"]').attr("readonly", true);
				$table2.find('tbody span.edit').hide();	// 編集ボタンを隠す
				mainView.f_edit = 1;
				$('.cl_datagrid_footer').hide();
			}, this));
		},

		/**
		 * テーブル描画
		 * @param list
		 */
		renderTable: function(list, $tbody, $tmplate) {
//			var _this = this;
			$tbody.empty();
			$.each(list, function(i) {
				// 削除フラグ設定
				this.f_del = 0;
				this.rowIndex = i;
				var tr = _.template($tmplate.html(), this);
				$tbody.append(tr);
				if (this.rankName && this.rankName == "未設定") {
					// 未設定は編集不可
					$tbody.find('tr:last span.btn-delete').hide();
					$tbody.find("tr:last td:eq(2)").removeClass("editable");
					$tbody.find("tr:last input[name='ca_rankCode']").removeClass("cl_required");
					var $code = $tbody.find("tr:last input[name='ca_rankCode']");
					clutil.inputReadonly($code);
					var $tgt = $tbody.find("tr:last span.edit");
					$tgt.text("");
					$tgt.removeClass("edit");
				}
				if (this.storeNum > 0) {
					// ×ボタン押下不可
					$tbody.find('tr:last span.btn-delete').hide();
				}
			});
		},

		/**
		 * テーブル描画
		 * @param list
		 */
		renderStoreTable: function(list, $tbody, $tmplate) {
//			var _this = this;
			$tbody.empty();
			$.each(list, function() {
				this.oldRankCode = this.rankCode;
				var tr = _.template($tmplate.html(), this);
				$tbody.append(tr);
			});
			/*
			 * 編集
			 */
			$tbody.find("tr span.edit").click(function(e) {
				var data = $(this).parent().find('.data').text();
				$(this).parent().find('input').val(data);
				$(this).parent().find('span').hide();
				$(this).parent().addClass('pdg0');
				$(this).parent().find('input').show();
				$(this).parent().find('input').focus();
			});
		},

		/**
		 * 店舗ランク保存
		 */
		saveStoreRankRec: function (storeID, rankCode) {
			var _this = this;
//			console.log("saveStoreRankRec!!");
			$.each(this.storeRankRecords, function() {
				if (this.storeID == storeID) {
					var oldRankCode = this.rankCode;
					if (rankCode == oldRankCode) {
						return false;
					}
					var rankID = _this.getRankID(oldRankCode, rankCode);
					if (rankID < 0) {
						return false;
					}
					// 店舗ランク書き換え
					this.oldRankCode = oldRankCode;
					this.rankCode = rankCode;
					this.rankID = rankID;
					return false;
				}
			});
		},

		getRankID: function(oldRankCode, rankCode) {
			var rankID = -1;

			// 店舗ランク更新
			$.each(this.rankRecords, function() {
				if (this.rankCode == rankCode) {
					rankID = this.rankID;
//					this.storeNum = Number(this.storeNum) + 1;
					found = true;
					return false;
				}
			});

			return rankID;
		},

		/**
		 * ランクレコード保存
		 */
		saveRankRecords: function(updated) {
			var _this = this;
			this.rankRecords = [];
			var records = clutil.tableview2data(this.$('#ca_tableRank_tbody').children());

			// 店舗ランク更新
			$.each(records, function(i) {
				if (updated) {
					// 削除フラグが立っているレコードは更新しない
					if (Number(this.f_del) == 1) {
						return true;
					}
					delete this.f_del;
				}
				this.rowIndex = i;
				_this.rankRecords.push(this);
			});
		},

		/**
		 * btn-deleteクリック時
		 */
		btnDeleteClick: function ($tgt_tr) {
			var f_del = Number($tgt_tr.children("td:eq(4)").children("span[name='ca_f_del']").text());
			if (f_del == 0) {
				f_del = 1;
			} else {
				f_del = 0;
			}
			if (f_del == 1) {
				// 編集不可にする
				$tgt_tr.children("td:eq(2)").removeClass("editable");
				var $code = $tgt_tr.children("td:eq(1)").children("input[name='ca_rankCode']");
				clutil.inputReadonly($code);
				var $edit = $tgt_tr.children("td:eq(2)").children("span.edit");
				$edit.text("");
				$edit.removeClass("edit");
			} else {
				// 編集可にする
				$tgt_tr.children("td:eq(2)").addClass("editable");
				var $code = $tgt_tr.children("td:eq(1)").children("input[name='ca_rankCode']");
				clutil.inputRemoveReadonly($code);
				var $edit = $tgt_tr.children("td:eq(2)").children("span:eq(1)");
				$edit.text("編集");
				$edit.addClass("edit");
			}
			$tgt_tr.children("td:eq(4)").children("span[name='ca_f_del']").text(f_del);
		},

		/**
		 * 行追加・削除イベント追加
		 */
		addEvent: function() {
			var _this = this;

			/*
			 * 編集
			 */
			$("#ca_tableRank_tbody span.edit").click(function(e) {
				var data = $(this).parent().find('.data').text();
				$(this).parent().find('input').val(data);
				$(this).parent().find('span').hide();
				$(this).parent().addClass('pdg0');
				$(this).parent().find('input').show();
				$(this).parent().find('input').focus();
				console.log('edit');
			});
			/*
			 * 店舗ランクコード変更
			 */
			$("#ca_tableRank_tbody").find("input[type='text']").change(function(e) {
				// 店舗ランク保存
				_this.saveRankRecords();
			});

		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function (unitID) {
			if (unitID == 0) {
				return null;
			}

			var getReq = {
					// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 店舗ランクパターン検索リクエスト
				AMDSV0020GetReq: {
					srchID: 0,				// パターンID
					srchUnitID: unitID,		// ユニットID
				},
			};

			return getReq;
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 */
		doSrch: function(srchReq, unitID){
			var defer = clutil.postJSON('AMDSV0020', srchReq).done(_.bind(function(data){
				this.data2view(data, unitID);
			}, this)).fail(_.bind(function(data){
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
			}, this));

			return defer;
		},

		/**
		 * 事業ユニットが変更されたイベント
		 *  ⇒ サーバへ検索にいく。
		 */
		_onUnitChanged: function(e){
//			console.log(e);
			if (this.deserializing) {
				// データセット中
				return;
			}
			// 空の店舗ランク取得
			var unitID = Number($(e.target).val());
			var req = this.buildReq(unitID);
			if (req) {
				return this.doSrch(req, unitID);
			}
		},

		/**
		 * サンプルファイルダウンロード
		 */
		_onSampleDLClick: function() {
			var sampleURL = "/public/sample/店舗ランクパターンサンプル.xlsx";
			clutil.download(sampleURL);
		},

		/**
		 * テーブルクリック時
		 */
		_onRankRowClick: function(e){
			var _this = this;

			if(this.onOperationSilent){
				return;
			}
//			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
//				return;
//			}
//			var rowNum = $(e.target).index();
//			console.log("index:" + rowNum);
//			if (rowNum != 0) {
//				return;
//			}

			// 表示されている店舗レコード
			var storeRecords = clutil.tableview2data(this.$('#ca_tableStore_tbody').children());
			$.each(storeRecords, function() {
				// 店舗リスト保存
//				console.log(this);
				_this.saveStoreRankRec(this.storeID, this.rankCode);
			});
//			console.log(_this.storeRankRecords);

			var $tr_tgt = $(e.target).closest('tr');
			var rankCode = $tr_tgt.children("td:eq(1)").children("input").val();
			var rankName = $tr_tgt.children("td:eq(2)").children("input").val();
			var rowIndex = $tr_tgt.data().rowindex;
//			console.log("rankCode:" + rankCode);
//			console.log("rankName:" + rankName);
			var isSame = false;
			$.each(this.rankRecords, function(i) {
				if (this.rowIndex == rowIndex) {
					return true;
				}
				// コードが同じ場合は上を優先
				if (this.rankCode == rankCode && this.rowIndex < rowIndex) {
					isSame = true;
					return false;
				}
			});

			// 店舗リスト表示
			var storeList = [];
			$.each(this.storeRankRecords, function() {
				if (isSame) {
					return false;
				}
				// コードの設定がないレコードは無視
				if (rankCode == "" && rankName != AMDSV0020Const.NO_SET) {
					return true;
				}
				// コードが同じレコードリスト
				if (this.rankCode == rankCode) {
					storeList.push(this);
				}
			});
//			console.log("storeNum:" + storeList.length);

			// 店舗表示
			this.renderStoreTable(storeList, $("#ca_tableStore_tbody"), $("#ca_store_template"));

			if (mainView.f_edit) {
				console.log('f_edit');
				var $storeTable = this.$("#ca_tableStore");
				$storeTable.find('tbody span.edit').hide();	// ランク変更ボタンを隠す
			}
		},

		/**
		 * btn-deleteクリック時
		 */
		_onRankDeleteClick: function (e) {
			// 編集可・不可を設定する→削除
			var $tgt_tr = $(e.target).closest('tr');
			$tgt_tr.remove();
		},

		/**
		 * ＋押下時
		 */
		_onAddRankRowClick: function(e) {
			var _this = this;
			// 空データ挿入
			var add_tmp = {
				rankID: 0,
				rankCode: "",
				rankName: "",
				storeNum: 0,
				f_del: 0,
				rowIndex: this.rankRecords.length,
			};
			var tr = _.template($("#ca_rank_template").html(), add_tmp);
			$("#ca_tableRank_tbody").append(tr);
			this.rankRecords.push(add_tmp);
//			console.log(this.rankRecords);

			/*
			 * 編集
			 */
			$("#ca_tableRank_tbody").find("tr:last span.edit").click(function(e) {
				var data = $(this).parent().find('.data').text();
				$(this).parent().find('input').val(data);
				$(this).parent().find('span').hide();
				$(this).parent().addClass('pdg0');
				$(this).parent().find('input').show();
				$(this).parent().find('input').focus();
			});

			/*
			 * 店舗ランク名変更
			 */
			$("#ca_tableRank_tbody").find("tr:last input[type='text']").change(function(e) {
				_this.saveRankRecords();
			});

			clutil.initUIelement($("#ca_tableRank"));

			var $baseRow = $("#ca_tableRank_tbody").find("tr:first input[type='text']");
			var $focusElem = $("#ca_tableRank_tbody").find("tr:last input[type='text']");
		    var baseRowPosition   = $baseRow.position();
		    var targetRowPosition = $focusElem.position();
		    $("#ca_tblfixhdr-viewport").animate(
		    	{scrollTop : targetRowPosition.top - baseRowPosition.top}
		    );
		},

		/**
		 * ランクテーブルのランクが変更されたイベント
		 */
		_onRankCodeChanged: function(e){
			var f_error = false;

			var rankCode = $(e.target).val();
			if (_.isEmpty(rankCode)) {
				return;
			}
			// コード重複チェック
			for (var i = 0; i < this.rankRecords.length; i++) {
				var rank = this.rankRecords[i];
				if (_.isEmpty(rank.rankCode)) {
					continue;
				}
				if (rankCode == rank.rankCode) {
					console.log($(e.target));
					this.validator.setErrorMsg($(this), clmsg.EDS0001);
					f_error = true;
					break;
				}
			}
			if (f_error) {
				clutil.mediator.trigger("onTicker", clmsg.EDS0001);
				return;
			}
		},

		/**
		 * 店舗テーブルのランクが変更されたイベント
		 */
		_onRankCodeStoreBlur: function(e){
			if (this.deserializing) {
				// データセット中
				return;
			}

			// validatorでチェック
			var $code = $(e.target);
			if(!this.validator.valid({ $el: $code })){
				return;
			}

//			var $code = $(e.target);
			var $tgt_tr = $code.closest('tr');
			var $old = $tgt_tr.find('span[name="ca_oldRankCode"]');
			var rankCode = $code.val();
			var oldRankCode = $old.text();
			var find = false;
			$.each(this.rankRecords, function() {
				// コードが同じレコードリスト
				if (this.rankCode == rankCode) {
					find = true;
					return false;
				}
			});
			if (!find) {
				$code.val(rankCode);
				var msg = '存在しない店舗ランクコードです。';
				this.validator.setErrorMsg($code, msg);
				return;
			}

			// 店舗数書き換え
			$old.text(rankCode);
			var isAdd = false;
			var isRemove = false;
			$('#ca_tableRank_tbody tr').each(function() {
				var code = $(this).find('input[name="ca_rankCode"]').val();
				var name = $(this).find('input[name="ca_rankName"]').val();
				if (_.isEmpty(code) && _.isEmpty(name)) {
					return true;
				}
				if (code == rankCode) {
					var $tgt = $(this).find('span[name="ca_storeNum"]');
					var storeNum = Number($tgt.text());
					$tgt.text(storeNum + 1);
					if (storeNum == 0) {
						// ×ボタン隠す
						var $rank_tr = $tgt.closest('tr');
						$rank_tr.find("span.btn-delete").hide();
					}
					isAdd = true;
				}
				if (code == oldRankCode) {
					if (_.isEmpty(code)) {
						if (name == AMDSV0020Const.NO_SET) {
							var $tgt = $(this).find('span[name="ca_storeNum"]');
							var storeNum = Number($tgt.text());
							$tgt.text(storeNum - 1);
						}
					} else {
						var $tgt = $(this).find('span[name="ca_storeNum"]');
						var storeNum = Number($tgt.text());
						$tgt.text(storeNum - 1);
						if (storeNum == 1) {
							// ×ボタン表示
							var $rank_tr = $tgt.closest('tr');
							$rank_tr.find("span.btn-delete").show();
						}
					}
					isRemove = true;
				}
				if (isAdd && isRemove) {
					return false;
				}
			});

		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// 新規登録時何もしない
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				return;
			}

			// リクエストをつくる
			var ptnID = $("#ca_ptnID").val();
			var getReq = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
				},
				reqPage: {
				},
				// 店舗ランクパターン検索リクエスト
				AMDSV0020GetReq: {
					srchID: ptnID,		// パターンID
				},
				// 店舗ランクパターン更新リクエスト -- 今は検索するので、空を設定
				AMDSV0020UpdReq: {
				},
			};

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMDSV0020', getReq);
			defer.fail(_.bind(function(data){
				// 検索ペインを表示？

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * フッター押下
		 */
		_doOpeAction: function(rtyp, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV
				this.doDownload();
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		/**
		 * ダウンロードする
		 */
		_onCSVClick: function(){

			// リクエストをつくる
			var srchReq = this.buildCSVReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMDSV0020', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * ダウンロード条件をつくる
		 */
		buildCSVReq: function(){
			var _this = this;

			var ptnRecord = clutil.view2data($("#ca_base_form"));
			var rankRes = clutil.tableview2data(this.$('#ca_tableRank_tbody').children());
			var storeRes = clutil.tableview2data(this.$('#ca_tableStore_tbody').children());
			$.each(storeRes, function() {
				_this.saveStoreRankRec(this.storeID, this.rankCode);
			});

			var sendList =[];
			var f_last = true;

			for(var i=rankRes.length-1; i>=0; i--){
				var data = rankRes[i];
				var f_send = false;
				if(f_last == false){
					f_send = true;
				}

				// 店舗ランクコード、店舗ランク名のいずれかがあれば送信リスト入り
				if((data.rankCode != "" && data.rankCode != null && data.rankCode != undefined)
						|| (data.rankName != "" && data.rankName != null && data.rankName != undefined)){
					f_send = true;
				}

				if(f_send == true){
					f_last = false;
					sendList.unshift(data);
				}
			}

			// 検索条件
			var req = {
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					AMDSV0020GetReq: {
						srchID: ptnRecord.ptnID ? ptnRecord.ptnID : 0,		// パターンID
					},
					AMDSV0020UpdReq: {
						ptnRecord : ptnRecord,
						rankRecords : sendList,	//rankRes,
						storeRankRecords : this.storeRankRecords,
					}
			};
			return req;
		},

		// Get リクエストを作る
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
				// 店舗ランクパターン検索リクエスト
				AMDSV0020GetReq: {
					srchID: chkData.id,			// パターンID
				},
				// 店舗ランクパターン更新リクエスト -- 今は検索するので、空を設定
				AMDSV0020UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMDSV0020',
				data: getReq
			};
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			var _this = this;
			var f_error = false;
			var line_error = false;
			var confirmMsg = null;

			this.validator.clear();

			if(!this.validator.valid()) {
				return null;
			}

			var updReq = {};

			// 画面入力値をかき集めて、Rec を構築する。
			var ptnRecord = clutil.view2data(this.$('#ca_base_form'));
			// 店舗ランク保存
//			this.saveRankRecords(true);
//			console.log(this.rankRecords);
			var rankRes = clutil.tableview2ValidData({
				$tbody : this.$('#ca_tableRank_tbody'),
				validator : this.validator,
				tailEmptyCheckFunc : function(data){
					var error = _.isEmpty(data.rankName);
					console.log(error);
					return _.isEmpty(data.rankCode)
						&& _.isEmpty(data.rankName);
				}
			});
			if(rankRes == null){
				// エラーでinputが隠れている場合に出現させる
				$("#ca_tableRank_tbody").find("input[name='ca_rankName']").each(function() {
					if ($(this).hasClass("cl_error_field")) {
						$(this).parent().find('span').hide();
						$(this).parent().addClass('pdg0');
						$(this).parent().find('input').show();
						$(this).parent().find('input').focus();
					}
				});
				clutil.mediator.trigger("onTicker", clmsg.EGM0021);
				return null;
			}
			console.log(rankRes);
			// 店舗リスト保存
			var storeRes = clutil.tableview2data(this.$('#ca_tableStore_tbody').children());
			$.each(storeRes, function() {
				_this.saveStoreRankRec(this.storeID, this.rankCode);
			});
//			console.log(this.rankRecords);

			// コード0埋めチェック（0埋めはエラー）
			for (var i = 0; i < rankRes.length; i++) {
				var rank = rankRes[i];
				if (rank.rankCode != "0" && rank.rankCode.match(/^0/) != null) {
					// 0埋めされているのでエラー
					_this.validator.setErrorMsg($("#ca_tableRank_tbody tr:nth-child(" + (i + 1) + ") input[name='ca_rankCode']"), clutil.fmtargs(clmsg.EDS0051));
					f_error = true;
				}
			}
			if (f_error) {
				clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
				return null;
			}

			// コード重複チェック
			$.each(rankRes, function(i) {
				for (var j = i + 1; j < rankRes.length; j++) {
					var rank = rankRes[j];
					if (this.rankCode == rank.rankCode) {
						_this.validator.setErrorMsg($("#ca_tableRank_tbody tr:nth-child(" + (i + 1) + ") input[name='ca_rankCode']"), clutil.fmtargs(clmsg.EDS0001));
						_this.validator.setErrorMsg($("#ca_tableRank_tbody tr:nth-child(" + (j + 1) + ") input[name='ca_rankCode']"), clutil.fmtargs(clmsg.EDS0001));
						line_error = true;
						break;
					}
				}
				if (line_error) {
					f_error = true;
					return false;
				}
			});
			if (f_error) {
				clutil.mediator.trigger("onTicker", clmsg.EDS0001);
				return null;
			}

//			var find = false;
			$.each(storeRes, function(i) {
				var $code = $("#ca_tableStore_tbody tr:nth-child(" + (i + 1) + ") input[name='ca_rankCode']");
				if(!_this.validator.valid({ $el: $code })){
					f_error = true;
					return false;
				}
				if (_.isEmpty(this.rankCode)) {
					return true;
				}
				var find = false;
				for (var j = 0; j < rankRes.length; j++) {
					var rank = rankRes[j];
					if (_.isEmpty(rank.rankCode)) {
						continue;
					}
					if (this.rankCode == rank.rankCode) {
						find = true;
						break;
					}
				}
				if (!find) {
					var msg = '存在しない店舗ランクコードです。';
					_this.validator.setErrorMsg($("#ca_tableStore_tbody tr:nth-child(" + (i + 1) + ") input[name='ca_rankCode']"), msg);
					f_error = true;
					return false;
				}
			});
			if (f_error) {
				clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
				return null;
			}

			$.each(rankRes, function() {
				// 所属店舗数が0の場合警告
				if (Number(this.storeNum) == 0) {
					confirmMsg = clmsg.WDS0001;
					return true;
				}
			});

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
					this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				ptnRecord.ptnID = 0;
			}

			updReq = {
				ptnRecord : ptnRecord,
//				rankRecords : this.rankRecords,
				rankRecords : rankRes,
				storeRankRecords : this.storeRankRecords,
			};

			var reqHead = {
				opeTypeId : this.options.opeTypeId,
			};
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var reqObj = {
				reqHead : reqHead,
				AMDSV0020UpdReq  : updReq
			};
			console.log(reqObj);
//			return;

			return {
				resId : clcom.pageId,
				data: reqObj,
				confirm : confirmMsg
			};

//			// Null を渡すと、Ajax 呼び出しを Reject したものと FW 側では見なします。
//			return null;
		},

		_eof: 'AMDSV0020.MainView//'
	});

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
