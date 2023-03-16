$(function(){
	var CATALOG_PERIOD_BEFORE = 1
	var CATALOG_PERIOD_UNIT_YMD = 0;

	// 黒帯ヘッダの「＜」戻るボタン戻り先設定
	if(clcom.pageArgs && clcom.pageArgs.homeUrl){
		clcom.homeUrl = clcom.pageArgs.homeUrl;
	}
	if(clcom.pageData && clcom.pageData.homeUrl){
		clcom.homeUrl = clcom.pageData.homeUrl;
	}

	//////////////////////////////////////////////
	// View
	var EditView = Backbone.View.extend({
		// 要素
		el						: $('#ca_main'),

		validator: null,

		// Eventes
		events: {
			"change [name='ca_cycle_typeid']"	:	"_onYmdSelect",				// 日付単位変更

			"click #ca_CACTV0040_show"	:	"_onCACTV0040ShowClick",	// メニュー登録場所ボタン押下
			"click #ca_menutree_clear"	:	"_onMenuTreeClearClick",	// メニュー登録場所クリアボタン押下

			"click #ca_btn_add"			:	"_onAddClick",				// 追加ボタン押下
			"click [name='del_row_sch']":	"_onDelClick",				// 削除ボタン押下
			"click #ca_commit"			:	"_onCommitClick",			// 登録ボタン押下
			"click #ca_cancel"			:	"_onCancelClick"			// キャンセルボタン押下
		},

		initialize: function() {
			_.bindAll(this);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validatorWithTicker(this.$('.ca_base_form'), {
				echoback		: $('.cl_echoback')
			});
			// validatorエラー時の表示領域
			this.type_before_validator = clutil.validator(this.$('.ca_type_before_div'), {
				echoback		: $('.cl_echoback')
			});
			// validatorエラー時の表示領域
			this.unit_ymd_validator = clutil.validator(this.$('.ca_unit_ymd_div'), {
				echoback		: $('.cl_echoback')
			});

			// 分析期間リストを取得
			this.period_list = clcom.getPeriodList();
			this.past_years = clcom.getPastYears();
			this.future_years = clcom.getFutureYears();

			// 分析カタログ名カウンタ
			this.catalogNameCounter = new clutil.view.InputCounter({
				$input: this.$('#ca_name'),
				className: 'wt280',
				maxLength: clcom.domain.MtAnaCatalog.name.maxLen
			});

			// ガイダンスカウンタ
			this.guideInputCounter = new clutil.view.InputCounter({
				$input: this.$('#ca_guide'),
				maxLength: clcom.domain.MtAnaCatalog.guide.maxLen
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

			$('select').selectpicker();
			clutil.datepicker($('input.cl_date'));
			$('input.cl_date').val('2016/12/28');
		},

		/**
		 * 画面描写
		 */
		render: function() {
			this.catalogNameCounter.render();
			this.guideInputCounter.render();
			return this;
		},

		/**
		 * 保存されたスケジュールを表示
		 * @param appdata
		 */
		showData: function(appdata) {
			// 分析カタログ名
			$("#ca_anacatlog_name").text(appdata.anacatlog_name);

			// スケジュールリスト
			this.schList = new Array();	// 初期化
			_.each(appdata.scheduleList, _.bind(function(data) {
				// 行追加
				var newitem = _.template($("#ca_template_addcontrol").html(), data);
				$("#div_addcontrol").append(newitem);
				var $row = $("#div_addcontrol").find('div.row:last');
				var $cycle_typeid = $row.find('select[name="ca_cycle_typeid"]');
				var $tgtdiv = $row.find('div[name="div_tgtymd"]');
				var $ca_tgtymd_2 = $tgtdiv.find('select[name="ca_tgtymd_2"]');
				var $ca_tgtymd_3 = $tgtdiv.find('select[name="ca_tgtymd_3"]');
				var $ca_tgtymd_4 = $tgtdiv.find('input[name="ca_tgtymd_4"]');
				var $ca_output_typeid_excel = $row.find('input[namex="ca_output_typeid"][value="1"]');
				var $ca_output_typeid_csv = $row.find('input[namex="ca_output_typeid"][value="2"]');

				clutil.datepicker($ca_tgtymd_4);
				$ca_tgtymd_2.selectpicker({noneSelectedText: ''});
				$ca_tgtymd_3.selectpicker({noneSelectedText: ''});
				clutil.initUIelement($row);
				//$('select').selectpicker('refresh');

				/* データ */
				// スケジュールサイクル区分
				$cycle_typeid.selectpicker('val', data.cycle_typeid);
				this.changeTgtDiv($row, data.cycle_typeid);

				switch(data.cycle_typeid) {
				case 2:	// 毎週
					// 出力曜日
					$ca_tgtymd_2.selectpicker('val', data.tg_wdays);
					break;
				case 3:	// 毎月
					// 出力日
					$ca_tgtymd_3.selectpicker('val', data.tg_doms);
					break;
				case 4:	// 特定日付
					$ca_tgtymd_4.val(clutil.dateFormat(data.tg_date, 'yyyy/mm/dd'));
					break;
				}

				// 出力ファイル区分
				if (data.output_typeid == 1) {
					// Excel
					$ca_output_typeid_excel.attr('checked', 'checked');
					$ca_output_typeid_excel.radio('checked');
					$ca_output_typeid_csv.removeAttr('checked');
				} else {
					// CSV
					$ca_output_typeid_csv.attr('checked', 'checked');
					$ca_output_typeid_csv.radio('checked');
					$ca_output_typeid_excel.removeAttr('checked');
				}

				this.schList.push(data);
			}, this));
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			var $tgt = null;
			if (this.schList != null && this.schList.length > 0) {
				$tgt = $('select[name="ca_cycle_typeid"]:first');
			} else {
				$tgt = $("#ca_btn_add");
			}
			clutil.setFocus($tgt);
		},

		changeTgtDiv: function($row, cycle_typeid) {
			var $tgtdiv = $row.find('div[name="div_tgtymd"]');

			var $tgt_1 = $tgtdiv.find('div[name="div_tgtymd_1"]');
			var $tgt_2 = $tgtdiv.find('div[name="div_tgtymd_2"]');
			var $tgt_3 = $tgtdiv.find('div[name="div_tgtymd_3"]');
			var $tgt_4 = $tgtdiv.find('div[name="div_tgtymd_4"]');

			switch(cycle_typeid) {
			case 1:	// 毎日
				$tgt_1.show();
				$tgt_2.hide();
				$tgt_3.hide();
				$tgt_4.hide();
				break;
			case 2:	// 毎週
				$tgt_1.hide();
				$tgt_2.show();
				$tgt_3.hide();
				$tgt_4.hide();
				break;
			case 3:	// 毎月
				$tgt_1.hide();
				$tgt_2.hide();
				$tgt_3.show();
				$tgt_4.hide();
				break;
			case 4:	// 特定日
				$tgt_1.hide();
				$tgt_2.hide();
				$tgt_3.hide();
				$tgt_4.show();
				break;
			}
		},

		/**
		 * 日付単位変更
		 */
		_onYmdSelect : function(e) {
			var $select = $(e.target);
			var $parents = $select.parents('div.row');
			var val = $select.selectpicker('val');

			this.changeTgtDiv($parents, Number(val));
		},

		_onAddClick: function(e) {
			/*
			 * 0. this.schListを作成
			 */
			if (this.schList == null) {
				this.schList = new Array();
			}
			var len_list = this.schList.length;
			var num = len_list+1;
			var obj = {
				id: 0,
				updcnt: 0,
				seqno: num,
				last_exec_date: 0,
				next_exec_date: 0,
			};
			var newitem = _.template($("#ca_template_addcontrol").html(), obj);
			$("#div_addcontrol").append(newitem);
			var $row = $("#div_addcontrol").find('div.row:last');
			var $ca_output_typeid_excel = $row.find('input[namex="ca_output_typeid"][value="1"]');
			var $ca_tgtymd_2 = $row.find('select[name="ca_tgtymd_2"]');
			var $ca_tgtymd_3 = $row.find('select[name="ca_tgtymd_3"]');
			var last_tgtymd_4 = $row.find('input[name="ca_tgtymd_4"]');
			clutil.datepicker($(last_tgtymd_4));

			$ca_tgtymd_2.selectpicker({noneSelectedText: ''});
			$ca_tgtymd_3.selectpicker({noneSelectedText: ''});

			clutil.initUIelement($row);

			$ca_output_typeid_excel.attr('checked', 'checked');
			$ca_output_typeid_excel.radio('checked');

			$ca_tgtymd_2.selectpicker('val', []);
			$ca_tgtymd_3.selectpicker('val', []);

			this.schList.push(obj);
		},

		_onDelClick: function(e) {
			var tgt = e.target;
			console.log(tgt);

			var row = $(tgt).parents('div.row');
			if ($(row).hasClass('js--addcontrol1--1')) {
				return;
			}
			$(row).remove();
		},

		isValid: function() {
			var ret = true;

			var cntl = $(".row.js--addcontrol1");
			for (var i = 0; i < cntl.length; i++) {
				var $row1 = $(cntl[i]);
				var $ca_cycle_typeid1 = $row1.find('select[name="ca_cycle_typeid"]');
				var $tgtdiv1 = $row1.find('div[name="div_tgtymd"]');
				var $ca_tgtymd_2 = $tgtdiv1.find('select[name="ca_tgtymd_2"]');
				var $ca_tgtymd_3 = $tgtdiv1.find('select[name="ca_tgtymd_3"]');
				var $ca_tgtymd_4 = $tgtdiv1.find('input[name="ca_tgtymd_4"]');
				var $ca_output_typeid_excel1 = $row1.find('input[namex="ca_output_typeid"][value="1"]');
				var cycle_typeid1 = $ca_cycle_typeid1.selectpicker('val');
				var output_typeid1;
				var v = $ca_output_typeid_excel1.attr('checked');
				if (v != null) {
					output_typeid1 = 1;
				} else {
					output_typeid1 = 2;
				}

				var valarray = null;
				var ymdstr1 = "";

				switch(cycle_typeid1) {
				case "2":
					valarray = $ca_tgtymd_2.selectpicker('val');
					if (valarray == null || !(valarray instanceof Array) || valarray.length == 0) {
						this.validator.setErrorMsg($ca_tgtymd_2, "出力曜日が選択されていません。");
						ret = false;
					}
					break;
				case "3":
					valarray = $ca_tgtymd_3.selectpicker('val');
					if (valarray == null || !(valarray instanceof Array) || valarray.length == 0) {
						this.validator.setErrorMsg($ca_tgtymd_3, "出力月内日付が選択されていません。");
						ret = false;
					}
					break;
				case "4":
					ymdstr1 = clutil.dateFormat($ca_tgtymd_4.val(), 'yyyymmdd');
					if (ymdstr1 == "") {
						this.validator.setErrorMsg($ca_tgtymd_4, "出力日付が入力されていません。");
						ret = false;
					} else if (_.isNaN(ymdstr1)) {
						this.validator.setErrorMsg($ca_tgtymd_4, "出力日付が正しくありません。");
						ret = false;
					}
					break;
				}

				for (var j = i+1; j < cntl.length; j++) {
					var $row2 = $(cntl[j]);
					var $ca_cycle_typeid2 = $row2.find('select[name="ca_cycle_typeid"]');
					var $ca_output_typeid_excel2 = $row2.find('input[namex="ca_output_typeid"][value="1"]');
					var $tgtdiv2 = $row2.find('div[name="div_tgtymd"]');
					var $ca_tgtymd_4_2 = $tgtdiv2.find('input[name="ca_tgtymd_4"]');
					var ymdstr2 = "";

					var cycle_typeid2 = $ca_cycle_typeid2.selectpicker('val');
					var output_typeid2;
					v = $ca_output_typeid_excel2.attr('checked');
					if (v != null) {
						output_typeid2 = 1;
					} else {
						output_typeid2 = 2;
					}

					if (cycle_typeid2 == 4) {
						ymdstr2 = clutil.dateFormat($ca_tgtymd_4_2.val(), 'yyyymmdd');
					}

					if (cycle_typeid1 == cycle_typeid2 && output_typeid1 == output_typeid2) {
						if (cycle_typeid1 != 4 && ymdstr1 === ymdstr2) {
							// 行重複
							this.validator.setErrorMsg($ca_cycle_typeid1, "スケジュールの条件が重複しています。");
							this.validator.setErrorMsg($ca_cycle_typeid2, "スケジュールの条件が重複しています。");
							ret = false;
						}
					}
				}
			}

			return ret;
		},

		/**
		 * 登録ボタン
		 */
		_onCommitClick: function(e) {
			var ret = true;

			/* バリデータクリア */
			this.validator.clear();

			/* 入力チェック */
//			if ($(".row.js--addcontrol1").length <= 0) {
//				this.validator.setErrorHeader("スケジュールを1件以上追加して下さい。");
//				return;
//			}
			if (!this.validator.valid()) {
				ret = false;
			}
			if (!this.isValid()) {
				ret = false;
			}
			if (!ret) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return;
			}

			// 登録確認ダイアログを表示
			clutil.updConfirmDialog(this.updOkcallback, this.updCancelcallback);
		},

		/**
		 * 登録確認ダイアログよりCancelで戻る
		 */
		updCancelcallback: function(obj) {
			return;
		},

		/**
		 * 登録確認ダイアログよりOKで戻る
		 */
		updOkcallback: function(obj) {
			/* TODO 画面→data */
			var line = $(".row.js--addcontrol1");
			var line_data = [];

			_.each(line, function(tgt, seqno) {
				var $tgt = $(tgt);
				// スケジュールID
				var id = $tgt.find('input[name="ca_id"]').val();
				var updcnt = $tgt.find('input[name="ca_updcnt"]').val();
				// サイクル
				var cycle = $tgt.find('select[name="ca_cycle_typeid"]').selectpicker('val');
				var tg_wdays = [0, 0, 0, 0, 0, 0, 0];
				var tg_doms = [
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				];
				var tg_date = 0;


				switch (cycle) {
				case "1":	// 毎日
					break;
				case "2":	// 毎週
					var tg_wdays_tmp = $tgt.find('select[name="ca_tgtymd_2"]').selectpicker('val');
					for (var i = 0; i < tg_wdays_tmp.length; i++) {
						tg_wdays[i] = Number(tg_wdays_tmp[i]);
					}
					break;
				case "3":	// 毎月
					var tg_doms_tmp = $tgt.find('select[name="ca_tgtymd_3"]').selectpicker('val');
					for (var i = 0; i < tg_doms_tmp.length; i++) {
						tg_doms[i] = Number(tg_doms_tmp[i]);
					}
					break;
				case "4":	// 特定日付
					tg_date = clutil.dateFormat($tgt.find('input[name="ca_tgtymd_4"]').val(), 'yyyymmdd');
					break;
				}
				var $ca_output_typeid_excel = $tgt.find('input[namex="ca_output_typeid"][value="1"]');
				var output_typeid = 0;
				if ($ca_output_typeid_excel.attr('checked')) {
					output_typeid = 1;
				} else {
					output_typeid = 2;
				}

				line_data.push({
					id: id,
					updcnt: updcnt,
					seqno: seqno+1,
					cycle_typeid: cycle,
					tg_wdays: tg_wdays,
					tg_doms: tg_doms,
					tg_date: tg_date,
					output_typeid: output_typeid,
				});
			});
			/* DB更新 */
			var req = {
				rtype : this.ope_mode,
				catalog : {
					catalog_id: this.savedData.catalog_id,
					scheduleList: line_data
				},
			};

			var uri = 'aman_sc_schedule_upd';
			clutil.postAnaJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					// 更新完了ダイアログを出す
					clutil.updMessageDialog(this.updConfirmcallback);
				} else {
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}
			}, this));
		},

		/**
		 * 更新完了ダイアログよりOKで戻る
		 */
		updConfirmcallback: function() {
			// 遷移元へ戻る
			clcom.popPage(null);
		},

		/**
		 * キャンセルボタン
		 */
		_onCancelClick: function() {
			clcom.popPage(null);
		},

		/**
		 * データを取得する
		 */
		showChkData: function(catalog_id) {
			var req = {
				cond : {
					catalog_id : catalog_id
				}
			};

			// データを取得
			clutil.postAnaJSON('aman_sc_schedule_get', req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					var appdata = data.schedule;
					if (appdata != null) {
						// 画面描画
						this.showData(appdata);

						if (this.is_upd != 1) {
							// 登録ボタンを削除し、キャンセルボタンの横幅を調整
							$('#ca_commit').closest('p').remove();
							$('#ca_cancel').closest('p').css('width', '100%');
							// 編集不可
							clutil.viewReadonly(this.$el);
							this.validator.setErrorInfo({_eb_: clmsg.is_upd_false});
						}
						this.savedData = appdata;
					} else {
						// ヘッダーにメッセージを表示
						this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
						// 登録ボタンを削除し、キャンセルボタンの横幅を調整
						$('#ca_commit').closest('p').remove();
						$('#ca_cancel').closest('p').css('width', '100%');
					}
				} else {
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});

					// 登録ボタンを削除し、キャンセルボタンの横幅を調整
					$('#ca_commit').closest('p').remove();
					$('#ca_cancel').closest('p').css('width', '100%');
				}
				// フォーカスの設定
				this.setFocus();
			}, this));
		}
	});

	editView = new EditView();
	editView.render();

	// 初期データを取る
	clutil.getIniJSON(null, null, _.bind(function(data, dataType) {
		//////////////////////////////////////////////
		// ヘッダー部品
		headerview = new HeaderView();
		headerview.render(function() {
			// 部品の初期化
			editView.initUIelement();

			var catalog_id = 0;

			// #20151018 ゾーンAJA向け分析対応でsrcId拡張
			if(clcom.srcId == "CACTV0020" ||
			   clcom.srcId == "CACTV0040"){

				var args = clcom.pageArgs;
				// 画面起動モード
				editView.ope_mode = args.ope_mode;
				// 更新権限
				editView.is_upd = args.is_upd;

				catalog_id = args.catalog_id;
			} else if (clcom.srcId == "AMGAV0110") {
				var args = clcom.pageArgs;
				// 画面起動モード
				editView.ope_mode = args.ope_mode;
				// 更新権限
				editView.is_upd = args.is_upd;

				catalog_id = args.catalog_id;
			} else {
				// 画面起動モードを新規作成にする
				editView.ope_mode = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
				// 更新権限
				editView.is_upd = 1;
			}
			// データを取得して画面に表示する
			// 新規の場合はID=0で検索する
			editView.showChkData(catalog_id);
		});
	},this)).done(function(){
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
