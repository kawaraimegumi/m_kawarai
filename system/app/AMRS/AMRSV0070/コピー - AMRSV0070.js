$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var ARMSV0070View = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		validator : null,

		resultList : [],
		searchData : [],
		checkData: [],

		// Events
		events : {
			"click #header p.back"			:	"_onBackClick",			// 戻るボタン押下時
			"click #ca_srch"				:	"_onSrchClick",			// 検索ボタン押下時
			"click #searchAgain"			:	"_onSearchAgainClick",	// 検索条件を再指定ボタン押下

			"click #ca_btn_store_select"	: "_onStoreSelClick",		// 店舗選択補助画面起動

			"click #ca_table1_tbody>tr"		:	"_onTr1Click",			// 日付行クリック(館内以外)
			"click #ca_table2_tbody>tr"		:	"_onTr2Click",			// 日付行クリック(館内)
		},

		initialize: function() {
			_.bindAll(this);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback')
			});

		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

			// 検索条件を再指定ボタンを隠す
			this.srchArea = clutil.controlSrchArea(this.$('#ca_searchArea'),
					this.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));

			this.AMPAV0010Selector = new AMPAV0010SelectorView({
				el: this.$("#ca_AMPAV0010_dialog"),		// 配置場所
				$parentView	:	this.$("#mainColumn"),
				select_mode : clutil.cl_multiple_select,		// 単一選択
				isAnalyse_mode : false,	// 通常画面モード
			});
			this.AMPAV0010Selector.render();

			// 選択サブ画面復帰処理
			this.AMPAV0010Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					// 店舗を取出す
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					var store = code + ":" + name;
					$("#ca_storeID").val(store);
					$("#ca_storeID").attr("cs_id", id);
					$("#ca_storeID").attr("cs_code", code);
					$("#ca_storeID").attr("cs_name", name);
				} else {
					$("#ca_storeID").val("");
					$("#ca_storeID").attr("cs_id", "");
					$("#ca_storeID").attr("cs_code", "");
					$("#ca_storeID").attr("cs_name", "");
				}
			};

			// TODO 店舗オートコンプリート

			// 年月セレクタ
			clutil.clmonthselector($("#ca_targetYm"), 0, 1, null, null, null, 1);

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			return this;
		},

		/**
		 * 戻るボタン押下時
		 */
		_onBackClick: function() {
			clcom.gohome();
			return this;
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function() {
			// 入力チェック
			var retStat = true;
			if(!this.validator.valid()){
				retStat = false;
			}

			if (!retStat) {
				return;
			}

			// 画面の情報を取得する
			searchData = clutil.view2data(this.$('#ca_searchArea'));
			var reqHead = {
				opeTypeId:	am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
			};
			this.req = {
				reqHead: reqHead,
				cond : searchData
			};

			//結果表示(ページャー)
			this.onPageClick(1, clcom.itemsOnPageSC);

		},

		// ページャークリック
		onPageClick: function(pageNumber, itemsOnPage, isPager) {
			var _this = this;

			// 結果状態をクリアする
			this.clearResult();

			// データを取得
			var uri = 'AMRSV0070';
			clutil.postJSON(uri, this.req, _.bind(function(data, dataType) {
				if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					this.adjustVendorList = data.adjustVendorList;	// 補正業者レコード
					this.adjustList = data.adjustList;				// 補正情報レコード（館内以外）
					this.adjustKannaiList = data.adjustKannaiList;	// 補正情報レコード（館内）

					if (this.adjustVendorList == null || this.adjustVendorList.length == 0) {
						this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
						this.$('#result').show();
					} else {
						// 一旦テーブルを非表示にする
						this.$("#ca_table1").hide();
						this.$("#ca_table2").hide();

						// 取得したデータを表示する
						$.each(this.adjustVendorList, function() {
							// 館内か判定
							if (this.kannnaiFlag == 0) {
								/*
								 * 館内以外
								 */
								// テーブル表示
								_this.$("#ca_table1").show();
								// ヘッダ出力
								$header1_tmpl = _this.$("#ca_table1_thead_template");
								$header1_tmpl.tmpl(this).appendTo('#ca_table1_thead');
							} else {
								/*
								 * 館内
								 */
								// テーブル表示
								_this.$("#ca_table2").show();
								// ヘッダ出力
								$header2_tmpl = _this.$("#ca_table2_thead_template");
								$header2_tmpl.tmpl(this).appendTo('#ca_table2_thead');
							}
						});

						$.each(this.adjustList, function() {
							var datestr = clutil.dateFormat(this.targetDate, 'yyyy/mm/dd(w)');
							this.targetIDate = datestr;
						});
						$body1_tmpl = this.$("#ca_table1_tbody_template");
						$body1_tmpl.tmpl(this.adjustList).appendTo("#ca_table1_tbody");

						$.each(this.adjustKannaiList, function() {
							var monthstr = clutil.monthFormat(this.month) + '月度';
							this.monthstr = monthstr;
						});
						$body2_tmpl = this.$("#ca_table2_tbody_template");
						$body2_tmpl.tmpl(this.adjustKannaiList).appendTo("#ca_table1_tbody");

						clutil.initUIelement(this.$('#ca_table1'));
						clutil.initUIelement(this.$('#ca_table2'));

						// 検索ボタン押下時は検索条件エリアを閉じる
						if (!isPager) {
							this.srchArea.show_result();
							// エキスパンダ
							$('.fieldUnitsHidden').hide();
							$('.expand').show();
							$('.unexpand').hide();
						}
					}

				} else {
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					// ページャーの初期化
					this.initPager(1, itemsOnPage, 0);
				}

				if (this.$('#searchAgain').css('display') == 'none') {
					// 検索ボタンにフォーカスする
					this.$('#ca_search').focus();
				} else {
					// 条件を追加ボタンにフォーカスする
					this.$('#ca_add').focus();
				}
			}, this));
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// テーブルをクリア
			this.$('#ca_table1_head').empty();
			this.$('#ca_table2_head').empty();
			this.$('#ca_table1_tbody').empty();
			this.$('#ca_table2_tbody').empty();
			// validatorの初期化
			this.validator.clear();
			// 確定時用のデータを初期化
			this.adjustVendorList = [];
			this.adjustList = [];
			this.adjustKannaiList = [];
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function() {
			this.srchArea.show_srch();
		},
		_onStoreSelClick: function(e) {
			var _this = this;

			_this.AMPAV0010Selector.show(null, null);
		},

		/**
		 * 補正件数入力画面へ遷移
		 */
		_onTr1Click: function(e) {
			var target = $(e.target);
			if (target.is("tr")) {

			} else {
				target = target.parents("tr");
			}
			var date = target.id;

			var chkData = {
					data: this.adjustList,
					date: date,
			};
			var args = {
					ope_mode : ope_mode,
					chkData : chkData
			};
			var cond = clutil.view2data($('#ca_searchArea'));
			var saveData = {
					cond:	cond,
					req:	this.req,
			};

			clcom.pushPage(
				'../AMRSV0080/AMRSV0080.html',	// 遷移先url
				args,						// 画面引数
				saveData					// 保存データ
			);
		},

		/**
		 * 補正件数入力(館内)画面へ遷移
		 */
		_onTr2Click: function(e) {
			var target = $(e.target);
			if (target.is("tr")) {

			} else {
				target = target.parents("tr");
			}
			var month = target.id;

			var chkData = {
					data: this.adjustKannaiList,
					month: month,
			};
			var args = {
					ope_mode : ope_mode,
					chkData : chkData
			};
			var cond = clutil.view2data($('#ca_searchArea'));
			var saveData = {
					cond:	cond,
					req:	this.req,
			};

			clcom.pushPage(
				'../AMRSV0081/AMRSV0081.html',	// 遷移先url
				args,						// 画面引数
				saveData					// 保存データ
			);
		},

	});

	ca_listView = new ARMSV0070View();
	ca_listView.render();

	clutil.getIniJSON(null, null, _.bind(function(data, dataType) {
		// 画面の初期化を行う
		ca_listView.initUIelement();

		if (clcom.pageData != null) {
			ca_listView.req = clcom.pageData.req;
			var cond = clcom.pageData.cond;
			ca_listView.checkData = clcom.pageData.chkData;
			clutil.data2view(ca_listView.$('#ca_searchArea'), cond);

			if (ca_listView.req != null) {
				ca_listView.onPageClick(1, clcom.itemsOnPageSC);
			}
		}
	}, this));

});