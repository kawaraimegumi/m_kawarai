$(function(){

	// 黒帯ヘッダの「＜」戻るボタン戻り先設定
	if(clcom.pageArgs && clcom.pageArgs.homeUrl){
		clcom.homeUrl = clcom.pageArgs.homeUrl;
	}

	//////////////////////////////////////////////
	// View
	var ListView = Backbone.View.extend({
		// 要素
		el						: $('#ca_main'),

		validator: null,

		// Eventes
		events: {
			"change #ca_elem_func"		:	"_onElemFuncSelect",	// 組織種別変更
			"change #ca_elem_lvl"		:	"_onElemLvlSelect",		// 組織レベル変更

			"click #ca_addGen"			:	"_onAddGenClick",		// 組織追加ボタン押下
			"click #ca_sample"			:	"_onSampleClick",		// サンプルボタン押下
			"click #ca_del"				:	"_onDelClick",			// 削除ボタン押下

			"click #ca_up"				:	"_onUpClick",			// ↑ボタン押下
			"click #ca_down"			:	"_onDownClick",			// ↓ボタン押下

			"click #ca_cancel"			:	"_onCancelClick",		// キャンセルボタン押下
			"click #ca_commit"			:	"_onCommitClick"		// 確定ボタン押下
		},

		initialize: function() {
			_.bindAll(this);

			var _this = this;

			// validatorエラー時の表示領域
			$('#ca_errmsg').hide();
			this.validator = clutil.validatorWithTicker(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});

			//csv取り込みをする際のファイル設定
			var fileInput = clutil.fileInput({
				files: [],
				fileInput: '#ca_upld'
			});

			fileInput
			.on('success', function (file) {

				// 一時サーバーにアップロード成功したときに呼ばれる。
				console.log('成功', file);

				//////ページャー遷移用セーブリストリセット//////
				_this.savelist = null;


				// サーバーに送信するデータ
				// サーバーがアップロードしたファイルの処理に必要なfile.idを含める。
				_this.codechkrep = {
					file_id: file.id
				};

				// サーバーに送信
				// ページャーは1ページ目・1ページあたりの要素数10
				_this._onDataInClick(1, clcom.itemsOnPage, 0);
			});

			// 店舗リスト名カウンタ
			this.listNameCounter = new clutil.view.InputCounter({
				$input: this.$('#ca_name'),
				className: 'wt280',
				maxLength: clcom.domain.MtGenList.name.maxLen
			});
		},


		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			var _this = this;
			clutil.inputlimiter(this.$el);

			// 全選択チェックボックスを初期化
			this.chkall = clutil.checkallbox(this.$('#ca_chkall'),
					this.$('.ca_tbl'),
					this.$('#ca_tbody')
					);

			//公開区分と階層種別selector作成
			clutil.initcltypeselector(
					$('#ca_div_f_open'), amcm_type.AMCM_TYPE_OPEN, 0, null,
					{id : "ca_f_open",
					 name : "info"}, "mbn wt280 flleft");

			clutil.initcltypeselector2(
					$('#ca_div_elem_func'), this.funclist, 0, null,
					'func_id', 'func_name', 'func_code',
					{id : "ca_elem_func", name : "info"}, "mbn wt280 flleft");

			//階層レベルselector作成(階層種別によって内容変化)
			var func_id = $('#ca_elem_func').val();
			clutil.initcltypeselector2(
					$('#ca_div_elem_lvl'), this.levelList[func_id], 0, null,
					'lvl_id', 'lvl_name', 'lvl_code',
					{id : "ca_elem_lvl", name : "info"}, "mbn wt280 flleft");


			// 店舗選択画面配置
			this.CACMV0030Selector = new CACMV0030SelectorView({
				el			: $('#ca_CACMV0030_dialog'),	// 配置場所
				$parentView	: $('#ca_main'),
				isAnalyse_mode	: false,		// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select	// 複数選択モード
//				anaProc			: this.anaProc
			});
			this.CACMV0030Selector.render();

			// 組織選択画面
			this.CACMV0020Selector = new CACMV0020SelectorView({
				el : $('#ca_CACMV0020_dialog'),	// 配置場所
				$parentView		: $('#ca_main'),
				isAnalyse_mode	: false,		// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_multiple_select	// 複数選択モード
//				anaProc			: this.anaProc
			});
			this.CACMV0020Selector.render();

			// テーブルの残骸ライン消去
			$('#ca_report_table').hide();
		},

		/**
		 * 画面描写
		 */
		render: function() {
			this.listNameCounter.render();
			return this;
		},


		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			clutil.setFocus($('#ca_elem_func'));
		},

		/**
		 * 階層種別変更
		 */
		_onElemFuncSelect: function(e) {
			// validatorの初期化
			this.validator.clear();

			//選択されている階層種別番号取得
			var func_id = $(e.target).val();

			//リスト登録数取得
			var trlist = $('#ca_tbody > tr');

			//リスト登録数が0ならそのまま入れ替え
			if (trlist == null || trlist.length == 0) {
				$('#ca_chk_func').val(func_id);
				clutil.initcltypeselector2(
						$('#ca_div_elem_lvl'), this.levelList[func_id], 0, null,
						'lvl_id', 'lvl_name', 'lvl_code',
						{id : "ca_elem_lvl", name : "info"}, "mbn wt280 flleft");

				//種別変更に合わせてレベル確認boxも変更
				var lvl_id = $('#ca_elem_lvl').val();
				$('#ca_chk_lvl').val(lvl_id);
			}
			else if($('#ca_chk_func').val() != func_id){
				//異なる階層のリストなら確認
				clutil.ConfirmDialog(clmsg.del_gen_list,
						this.editOKcallback, this.editNGcallback, e);
			}
		},


		/**
		 * 階層レベル変更
		 */
		_onElemLvlSelect: function(e) {
			// validatorの初期化
			this.validator.clear();

			//選択されているレベル番号取得
			var lvl_id = $(e.target).val();

			//リスト登録数取得
			var trlist = $('#ca_tbody > tr');

			//リスト登録数が0ならそのまま入れ替え
			if (trlist == null || trlist.length == 0) {
				$('#ca_chk_lvl').val(lvl_id);
			}
			else if($('#ca_chk_lvl').val() != lvl_id){
				//異なる階層のリストなら確認
				clutil.ConfirmDialog(clmsg.del_gen_list,
						this.editOKcallback, this.editNGcallback, e);
			}

		},

		/**
		 * 階層データ削除OK
		 * (セットされていたもとのリストを削除)
		 */
		editOKcallback :function(e) {
			var elem_func_id = $('#ca_elem_func').val();

			//階層種別変更ならlvlの中身を詰めなおす
			if(elem_func_id != $('#ca_chk_func').val()) {
				clutil.initcltypeselector2(
						$('#ca_div_elem_lvl'), this.levelList[elem_func_id], 0, null,
						'lvl_id', 'lvl_name', 'lvl_code',
						{id : "ca_elem_lvl", name : "info"}, "mbn wt280 flleft");
			}

			var elem_lvl_id = $('#ca_elem_lvl').val();

			//確認box詰めなおし
			$('#ca_chk_func').val(elem_func_id);
			$('#ca_chk_lvl').val(elem_lvl_id);

			//リスト削除
			$('#ca_tbody').empty();
			$(e.target).focus();
		},

		/**
		 * 階層データ削除NG
		 * （セットされていたもとの階層に戻す）
		 */
		editNGcallback :function(e) {
			//確認boxから、変更前の組織IDを取得
			var chk_lvl_id = $('#ca_chk_lvl').val();
			var chk_func_id = $('#ca_chk_func').val();

			//階層種別変更ならlvlの中身を詰めなおす
			if(chk_func_id != $('#ca_elem_func').val()) {
				$('#ca_elem_func').selectpicker('val', chk_func_id);
			}

			//条件反映
			$('#ca_elem_func').selectpicker('val', chk_func_id);
			$('#ca_elem_lvl').selectpicker('val', chk_lvl_id);

			$(e.target).focus();
		},

		/**
		 * 結果クリア
		 */
		clearResult: function() {
			// エラーメッセージのクリア
			this.validator.clear();
			$('#ca_errmsg').hide();
			$('#ca_report_table').hide();

//			// ページャーをクリア
//			this.initPager(1, clcom.itemsOnPage, 0);
			$('#ca_pagerArea1').hide();
			$('#ca_pagerArea2').hide();

			// テーブルをクリア
			$('#ca_report_tbody_div').empty();

			// 全選択チェックボックスを初期化
			this.chkall.init();
		},

		/**
		 * ページャーの初期化
		 * @param itemsOnPage
		 * @param totalCount
		 */
		initPager: function(pageNumber, itemsOnPage, totalCount) {
			var _this = this;

			//上ページャーの設定
			this.$('#ca_pager1').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_pager_displaypanel1'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時関数
					_this._onDataInClick(pageNumber, itemsOnPage, true);
				},
				onSelectChange: function(itemsOnPage) {
					// 表示件数変更時
					_this._onDataInClick(1, itemsOnPage, true);
				}
			});

			//下ページャーの設定
			this.$('#ca_pager2').pagination({
				items : totalCount,
				itemsOnPage : itemsOnPage,
				currentPage: pageNumber,
				displaypanel : this.$('#ca_pager_displaypanel2'),
				onPageClick: function(pageNumber, itemsOnPage) {
					// ページ変更時関数
					_this._onDataInClick(pageNumber, itemsOnPage, true);
				},
				onSelectChange: function(itemsOnPage) {
					// 表示件数変更時
					_this._onDataInClick(1, itemsOnPage, true);
				}
			});
		},


		/**
		 * CSV取込ボタン
		 */
		_onDataInClick: function(pageNumber, itemsOnPage,isPager) {
			var _this = this;

			// 結果のクリア
			this.clearResult();

			//ページャー情報取得
			var index = itemsOnPage * (pageNumber - 1);
			var pagedata = {
					start_record : index,			// index番目のデータから(0～)
					page_size : itemsOnPage			// 1ページに表示する件数を要求
			};

			this.codechkrep.pagereq = pagedata;

			//取り込み先の組織条件とファイル条件取得
			var elem_func =$('#ca_elem_func').val();
			var elem_lvl =$('#ca_elem_lvl').val();
			var file_id = _this.codechkrep

			var cond = {
					f_genlist :am_proto_defs.AMDB_DEFS_F_GENLIST_STORE,
					elem_func :elem_func,
					elem_lvl :elem_lvl
			};

			this.codechkrep.pagereq = pagedata;
			this.codechkrep.cond = cond;

			//codechkresp内容まとめて代入
			var req = this.codechkrep;

			var uri = 'gsan_cm_genlist_codechk';

			// サーバーAPに送信する。ここのインターフェイスは各画面とサーバー間で決める
			clutil.postAnaJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					var chklist = data.chklist;
					var elemlist = data.elemlist;
					var pagersp = data.pagersp;

					//エラーデータがあった場合
					if (chklist != null && chklist.length > 0) {
						// 既存のエラーリストテーブル内容削除
						$('#ca_report_tbody_div').empty();

						// 取得したデータを表示する
						$('.pagination-wrapper').show();
						$('#ca_report_table').show();
						$('#ca_report_tbody_template').tmpl(chklist).appendTo('#ca_report_tbody_div');

						// 総レコード数
						var totalRec = data.pagersp.total_record;
						// ページャーの初期化
						_this.initPager(pageNumber, itemsOnPage, totalRec);
						//エラーリストのヘッダメッセージ表示
						_this.validator.setErrorInfo({_eb_: clmsg.ca_upld_err});

						clutil.initUIelement(_this.$('#ca_report_table'));
					}
					else{
						$('.pagination-wrapper').hide();
					}

					//////ページャー遷移用セーブリスト////////////////////////////////

					//セーブデータがあった場合、ページャー遷移後はセーブデータのリストを反映
					if(_this.savelist != null){
						_this.makeGenTemplList(_this.savelist);
					}
					else if (elemlist != null && elemlist.length > 0) {
						// CSV押下でデータ取得した場合は、CSVデータを表示する
						_this.makeGenTemplList(elemlist);

						// ページャー用リストを上書き
						_this.savelist = _this.getGenList();

					}
				}
				else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}

				// 取込ボタンにフォーカスする
				$('#ca_upld').find('input.hide-input').focus();

			}));
		},

		/**
		 * 追加ボタン押下
		 */
		_onAddGenClick: function(e) {
			// validatorの初期化
			this.validator.clear();

			var _this = this;

			//セレクターの選択番号取得
			var lvl_id = $('#ca_elem_lvl').val();
			var func_id = $('#ca_elem_func').val();

			//種別に対応したレベルのリスト代入
			var lvl_list = this.levelList[func_id];
			//リスト配列の最大要素番号(配列は0からはじまるため1を引く)
			var max_list = this.levelList[func_id].length - 1;
			//最大要素のID取得
			var lvl_max_id = lvl_list[max_list].lvl_id;

			// レベル番号の取得
			var lvlno;
			// 階層区分を取得する
			for (var i = 0; i < lvl_list.length; i++) {
				if (Number(lvl_id) == lvl_list[i].lvl_id) {
					lvlno = lvl_list[i].lvlno;
					break;
				}
			}

			// 選択レベルidが最大要素idと一致したら店舗選択へ
			if(lvl_id == lvl_max_id) {
				_this.CACMV0030Selector.show(_this.genList);

	    		//サブ画面復帰後処理
	           	_this.CACMV0030Selector.okProc = function(data) {
	    			if(data != null && data.length > 0) {
	    				_this.makeSelectData(data);
	   					// 全選択チェックボックスを初期化
	    				_this.chkall.init();


	    				//////ページャー遷移用セーブリスト上書き//////////
	    				_this.savelist = _this.getGenList();
	    			}
	    			// ボタンにフォーカスする
	    			$(e.target).focus();
	    			//チェックボックス出現
	    			clutil.initUIelement(_this.$('.ca_tbl'));
	   			}
			} //それ以外なら要素選択へ
			else {
				_this.CACMV0020Selector.show(_this.genList, null, func_id, {
					lvl_id : lvl_id, lvl_no : lvlno
				});

	    		//サブ画面復帰後処理
	           	_this.CACMV0020Selector.okProc = function(data) {
	    			if(data != null && data.length > 0) {
	    				_this.makeSelectData(data);
	    				// 全選択チェックボックスを初期化
	   					_this.chkall.init();


	   					///////ページャー遷移用セーブリスト上書き/////
	   					_this.savelist = _this.getGenList();
	    			}
	    			// ボタンにフォーカスする
	    			$(e.target).focus();
	    			//チェックボックス出現
	    			clutil.initUIelement(_this.$('.ca_tbl'));
	    		}
			}
		},

		/**
		 * サンプルボタン押下
		 */
		_onSampleClick: function(e) {
			var sampleURL = "/public/sample/店舗リストサンプル.csv";
			clutil.simpleSampleDownload(sampleURL);
		},

		/**
		 * 選択画面より返されたデータを既に登録されているデータを除いて登録する
		 */
		makeSelectData : function(selectlist) {
			// 既存のIDリストを取得する
			var chklist = {};
			var html_source = '';

			$.each($('#ca_tbody tr'), function() {
				chklist[this.id] = true;
			});

			// 現在のIDリスト数を取得
			var num = Object.keys(chklist).length;

			for (var i = 0; i < selectlist.length; i++) { var a = i;
				var select = selectlist[i];

				// 追加可能なIDリスト数を超えている場合はこれ以上追加しない
				if (num == gen_max) {
					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.number_overflow, [gen_max])});
					break;
				}

				// 重複チェック
				if (chklist[select.val]) {
					continue;
				}

				// 重複していない場合は追加
				var newdata = {};
				newdata.elem_id = select.val;
				newdata.elem_code = select.code;
				newdata.elem_name = select.name;

				html_source += this.makeGenTempl(newdata);
				num++;
			}
			$('#ca_tbody').append(html_source);
		},

		/**
		 * 削除ボタン click
		 */
		_onDelClick: function(e) {
			// validatorの初期化
			this.validator.clear();

			var _this = this;
			// 削除対象IDリストを取得する
			var chklist = [];
			var html_source = '';

			$.each($('#ca_tbody input[name=ca_chk]:checked'), function() {
				var tr = $(this).closest("tr");
				chklist.push(tr.get(0).id);
			});

			if (chklist == null || chklist.length == 0) {
//				// ヘッダーにメッセージを表示
//				this.validator.setErrorInfo({_eb_: clmsg.cl_select_required});
				return;
			}

			// IDリストを取得
			var genlist = this.getGenList();
			var num = 0;
			for (var i = 0; i < genlist.length; i++) {
				var gen = genlist[i];

				// チェックされているIDリストを削除する
				if(chklist.indexOf(gen.elem_id) != -1){
					continue;
				}
				html_source += this.makeGenTempl(gen);
				num++;
			}
			$('#ca_tbody').empty();
			$('#ca_tbody').html(html_source);

			//チェックボックス出現
			clutil.initUIelement(_this.$('.ca_tbl'));
			// 全選択チェックボックスを初期化
			this.chkall.init();

			/////ページャー遷移用セーブリスト上書き/////////
			//削除後のリスト記憶
			_this.savelist = [];
			_this.savelist =_this.getGenList();

			$(e.target).focus();
		},

		/**
		 * ↑ボタン押下
		 */
		_onUpClick: function(e) {
			var trlist = this.$('#ca_tbody').find('tr.checked');

			if (trlist == null || trlist.length == 0) {
				// なにも選択されていなければなにもしない
				return;
			}

			var $tr_up = null;
			var trlist_edit = this.$('#ca_tbody').find('tr');
			for (var i = 0; i < trlist_edit.length; i++) {
				var $tr = $(trlist_edit[i]);
				if ($tr.hasClass('checked')) {
					break;
				}
				$tr_up = $tr;
			}

			if ($tr_up == null) {
				for (var i = 0; i < trlist_edit.length; i++) {
					var $tr = $(trlist_edit[i]);
					if (!$tr.hasClass('checked')) {
						$tr_up = $tr;
						break;
					}
				}
			}

			if ($tr_up == null) {
				return;
			}

			for (var i = 0; i < trlist.length; i++) {
				var tr = trlist[i];
				$(tr).insertBefore($tr_up).show();
			}
		},


		/**
		 * ↓ボタン押下
		 */
		_onDownClick: function(e) {
			var trlist = this.$('#ca_tbody').find('tr.checked');

			if (trlist == null || trlist.length == 0) {
				// なにも選択されていなければなにもしない
				return;
			}

			var $tr_down = null;
			var trlist_edit = this.$('#ca_tbody').find('tr');
			for (var i = trlist_edit.length-1; i >= 0 ; i--) {
				var $tr = $(trlist_edit[i]);
				if ($tr.hasClass('checked')) {
					break;
				}
				$tr_down = $tr;
			}

			if ($tr_down == null) {
				for (var i = trlist_edit.length-1; i >= 0 ; i--) {
					var $tr = $(trlist_edit[i]);
					if (!$tr.hasClass('checked')) {
						$tr_down = $tr;
						break;
					}
				}
			}

			if ($tr_down == null) {
				return;
			}

			for (var i = trlist.length-1; i >= 0 ; i--) {
				var tr = trlist[i];
				$(tr).insertAfter($tr_down).show();
			}
		},

		/**
		 * キャンセルボタン押下
		 */
		_onCancelClick: function() {
				clcom.popPage(null);
		},

		/**
		 * サーバーからリスト要素を取得する
		 */
		showChkData: function(args) {
			var _this = this;

			var uri = 'gsan_cm_genlist_get';
			var req = {
					cond : {
						genlist_id : args.genlist_id,
						f_genlist : am_proto_defs.AMDB_DEFS_F_GENLIST_STORE
					}
			};

			// データを取得
			clutil.postAnaJSON(uri, req, _.bind(function(data, dataType) {

				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					var appdata = data.genlist;

/////////10万件再現用ダミーフラグ////////////////////
//					appdata.f_elemupd = 999;
///////////////////////////////

					if (appdata != null) {
						//階層表示用
						var func_id = appdata.elem_func;
						clutil.initcltypeselector2(
								$('#ca_div_elem_lvl'), this.levelList[func_id], 0, null,
								'lvl_id', 'lvl_name', 'lvl_code',
								{id : "ca_elem_lvl", name : "info"}, "mbn wt280 flleft");

						//複製モードの場合は、リストidを削除
						if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && this.genlist_id != null) {
							appdata.id = null;
						}

						//リスト条件反映
						//Shimizu追加
						$('#ca_div_elem_lvl').html('');
						clutil.data2view(this.$('#ca_searchArea'), appdata);
						this.listNameCounter.showCounter();
						clutil.data2view(this.$('#ca_div_elem_lvl'), appdata);

						//階層チェック用の隠しボックスに階層レベル代入
						$('#ca_chk_func').val(data.genlist.elem_func);
						$('#ca_chk_lvl').val(data.genlist.elem_lvl);

						//サーバーデータに編集不可フラグがあるならリスト表示なし(リストが10万件とかの場合)
						if(appdata.f_elemupd != 1) {
							// ヘッダーにメッセージを表示
							this.validator.setErrorInfo({_eb_: clmsg.gen_list_overflow});
							// ボタン非表示
							$('#ca_editBtn').hide();
							// リストテーブル非表示
							$('#ca_tbl_div').hide();
						}
						else {
							// 取得したデータを表示する
							var elemlist = appdata.elem;
							_this.makeGenTemplList(elemlist);

							if (args.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {

								if(args.is_upd == "1") {


									//更新権限がある場合
									// リスト階層変更不可
									clutil.viewRemoveReadonly($("#ca_main"));
									$("#ca_searchArea").find("button").find("#ca_f_open").removeClass("disabled");

									clutil.viewReadonly($("#ca_orgSel"));

									//セレクトボックスから作成したボタンデザインになっているため不可
//									 $("#ca_elem_func").attr('disabled', true);
//									 $("#ca_elem_lvl").attr('disabled', true);

								}
								else {
									//更新権限がない場合
									clutil.viewRemoveReadonly($("#ca_main"));
									// ボタン不可
									clutil.viewReadonly($("#ca_editBtn"));
									// 登録ボタンを削除し、キャンセルボタンの横幅を調整
									$('#ca_commit').closest('p').remove();
									$('#ca_cancel').closest('p').css('width', '100%');
								}
							}
						}
						// 複製モードの場合IDを削除する
						if (_this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
							$('#ca_id').val('');
						}
					}
					else {
						// ヘッダーにメッセージを表示
						_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
						// 登録ボタンを削除し、キャンセルボタンの横幅を調整
						$('#ca_commit').closest('p').remove();
						$('#ca_cancel').closest('p').css('width', '100%');
					}
				}
				else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					// 登録ボタンを削除し、キャンセルボタンの横幅を調整
					$('#ca_commit').closest('p').remove();
					$('#ca_cancel').closest('p').css('width', '100%');
				}

				// フォーカスの設定
				_this.setFocus();

			}, this));
		},

		/**
		 * リスト内容を表示する
		 */
		makeGenTemplList: function(elemlist) {
			var html_source = '';
			var _this = this;

			for (var i = 0; i < elemlist.length; i++) {
				if (i == gen_max) {
					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.number_overflow, [gen_max])});
					break;
				}
				var gen = elemlist[i];
				html_source += this.makeGenTempl(gen);
			}
			$('#ca_tbody').empty();
			$('#ca_tbody').append(html_source);

			//チェックボックス出現
			clutil.initUIelement(_this.$('.ca_tbl'));

			if (this.is_upd != 1) {
				// 更新権限がない場合は編集不可ヘッダ表示
				this.validator.setErrorInfo({_eb_: clmsg.is_upd_false});
			}
		},

		/**
		 * テーブルに表示されているIDリストを取得する
		 */
		getGenList : function() {
			var genlist = [];
			genlist = clutil.tableview2data($('#ca_tbody').children());
			return genlist;
		},


		/**
		 * 	リストテンプレート
		 */
		makeGenTempl: function(gen) {
			var html_source = '';
			var _this = this;

			html_source += '<tr id=' + gen.elem_id + '>';

			html_source += '<td width="40px"><label class="checkbox" for=""><input type="checkbox" data-toggle="checkbox" name="ca_chk"></label></td>';
			html_source += '<td width="150px">' + gen.elem_code + '<input type="hidden" name="elem_code" value="' + gen.elem_code + '"></td>';
			html_source += '<td>' + gen.elem_name  + '<input type="hidden" name="elem_name" value="' + gen.elem_name + '">';
			html_source += '<input type="hidden" name="elem_id" value="' + gen.elem_id + '"></td></tr>';

			return html_source;
		},



		/**
		 * 保存ボタン click
		 */
		_onCommitClick: function(e) {
			if (this.is_upd != 1) {
				// 更新権限がない場合は編集不可ヘッダ表示
				this.validator.setErrorInfo({_eb_: clmsg.is_upd_false});
				return this;
			}

			// validation
			if(!this.validator.valid()) {
				return this;
			}

			//リスト名の文字有無確認
			var listName = $("#ca_name").val();
			if(!clutil.chkStr(listName)) {
				//変更後のリスト名に文字がなかったらバリデーター
				this.validator.setErrorMsg($("#ca_name"), clmsg.cl_required);
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				return this;
			}

			// リストを取得する
			var trlist = $('#ca_tbody > tr');
			if (trlist == null || trlist.length == 0) {
				// リスト要素が登録されていない場合はエラー
				this.validator.setErrorInfo({_eb_: clmsg.no_gen_list});
				return this;
			}
			// 登録確認ダイアログを表示
			clutil.updConfirmDialog(this.updOkcallback, this.updCancelcallback, e);
		},

		/**
		 * 登録確認ダイアログよりCancelで戻る
		 */
		updCancelcallback: function(e) {
			$(e.target).focus();
			return;
		},

		/**
		 * 登録確認ダイアログよりOKで戻る
		 */
		updOkcallback: function(e) {
			var _this = this;
			// 画面の情報を取得する
			var resultdata = clutil.view2data($('#ca_searchArea'));

			//リスト種別設定
			resultdata.f_genlist = am_proto_defs.AMDB_DEFS_F_GENLIST_STORE;

			// リスト要素を追加する
			resultdata['elem'] = this.getGenList();

			var req = {
					head : {
						opeTypeId: this.ope_mode
					},
					rtype : this.ope_mode,
					genlist : resultdata
			};

			var uri = 'gsan_cm_genlist_upd';
			clutil.postAnaJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					// 更新完了ダイアログを出す
					clutil.updMessageDialog(_this.updConfirmcallback);

				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}
			}, this));
		},

		/**
		 * 更新完了ダイアログよりOKで戻る
		 */
		updConfirmcallback: function() {
			// 遷移元へ戻る
			clcom.popPage(null);
		}
	});

	// 表示可能な最大リスト要素
	var gen_max = 10000;

	listView = new ListView();
	listView.render();

	// 初期情報を取得する
	var req = {
			cond : {
				f_genlist : am_proto_defs.AMDB_DEFS_F_GENLIST_STORE,
				srch_iymd : clutil.getMstSrchDate(this.isAnalyse_mode, this.anaProc, 'org')
			}
	};

	var uri = 'gsan_cm_genlist_init';
	clutil.postIniJSON(uri, req, _.bind(function(data, dataType) {

		//////////////////////////////////////////////
		// ヘッダー部品
		headerView = new HeaderView();
		headerView.render(function(){
			var args = clcom.pageArgs;
			if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
				listView.funclist = data.func_list;
				listView.lvllist = data.lvl_list;

				listView.levelList = {
						0 : []
				};

				// 種別から階層リストを作成する
				for (var i = 0; i < listView.funclist.length; i++) {
					var func = listView.funclist[i];
					listView.levelList[func.func_id] = [];
				}
				for (var i = 0; i < listView.lvllist.length; i++) {
					var lvl = listView.lvllist[i];
					listView.levelList[lvl.lvl_func_id].push(lvl);
				}

				// 区分selectorを初期化する
				listView.initUIelement();

				//引数設定
				function isValidOpeMode(ope_mode){
					switch(ope_mode){
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
						return true;
					}
					return false;
				};

				//リスト照会画面から来た場合
				if(clcom.srcId == "CAMEV0010"){
					//////////////////////////////
					////////テスト用ダミー権限
					//
//						args.is_upd = 1;	//権限あり
//						args.is_upd = 22;	//権限なし
					//////////////


					// 画面起動モード
					listView.ope_mode = args.ope_mode;
					// 更新権限
					listView.is_upd = args.is_upd;
					//リストid
					listView.genlist_id = args.genlist_id;


					/////ページャー遷移用セーブリスト////////////////////////////
					listView.savelist = null;

					// 編集
					if (args.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
						// データを取得して画面に表示する
						listView.showChkData(args);

					}
					// 複製
					else if (args.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && args.genlist_id != null) {
						// 更新権限あり
						listView.is_upd = "1";

						// データを取得して画面に表示する
						listView.showChkData(args);
					}
					// 新規
					else {
						//更新権限あり
						listView.is_upd = "1";

						var elem_func = $('#ca_elem_func').val();
						var elem_lvl = $('#ca_elem_lvl').val();

						//階層チェック用の隠しボックスに階層レベル代入
						$('#ca_chk_func').val(elem_func);
						$('#ca_chk_lvl').val(elem_lvl);
					}
				}
				else if (clcom.srcId == "menu") {
					//メニューからきた場合？

					// 画面起動モードを新規作成にする
					listView.ope_mode = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;

					//更新権限あり
					listView.is_upd = "1";

					var elem_func = $('#ca_elem_func').val();
					var elem_lvl = $('#ca_elem_lvl').val();

					//階層チェック用の隠しボックスに階層レベル代入
					$('#ca_chk_func').val(elem_func);
					$('#ca_chk_lvl').val(elem_lvl);
				} else {
					if(args && isValidOpeMode(args.ope_mode)){
						//分析画面から来た場合

						// 更新権限あり
						listView.is_upd = "1";

						// 画面起動モード
						listView.ope_mode = args.ope_mode;

						if(args.genlist != null){
							// リストを表示する
							listView.makeGenTemplList(args.genlist);
						}
					} else {
						// デフォルト動作
						// 画面起動モードを新規作成にする
						listView.ope_mode = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;

						//更新権限あり
						listView.is_upd = "1";

						var elem_func = $('#ca_elem_func').val();
						var elem_lvl = $('#ca_elem_lvl').val();

						//階層チェック用の隠しボックスに階層レベル代入
						$('#ca_chk_func').val(elem_func);
						$('#ca_chk_lvl').val(elem_lvl);
					}
				}
			}
			else {
				// reqが正しく処理されなかった場合ヘッダーにメッセージを表示
				listView.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
			}
			if (args && args.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
				//編集遷移ならリスト名にフォーカス
				$("#ca_name").focus();
			}
			else{
				//その他なら種別にフォーカス
				listView.setFocus();
			}
		});
		//////////////////////////////////////////////

	}, this)).done(function(){
		// スクロール表示の微調整
		ch_height();
		var sc = $('html').css('overflow-y');
		if(sc == 'scroll'){
			$('html').css('overflow-y', 'auto');
			_.defer(function(sc){
				$('html').css('overflow-y', sc);
			}, sc);
		}
	});

});
