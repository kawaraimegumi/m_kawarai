$(function(){

	//////////////////////////////////////////////
	// View
	MDCMV1011SelectorView = Backbone.View.extend({

		screenId : "MDCMV1011",
		validator: null,

		lylogiclist: [
			{
				id: amgbp_AnaHead.AMGBP_ANA_REQ_DISP_LY_SAMEDAY,
				code: "",
				name: "前年同日"
			},
			{
				id: amgbp_AnaHead.AMGBP_ANA_REQ_DISP_LY_SAMEWEEK,
				code: "",
				name: "前年同曜日"
			},
		],

		// Eventes
		events: {
//			"change #ca_MDCMV1011_time select"	:	"_onTimeSelect",		// 時刻単位変更
//			"keyup #ca_MDCMV1020_func_id"		:	"_onFuncSelect",		// 種別変更
//			"keydown #ca_MDCMV1020_func_id"		:	"_onFuncSelect",		// 種別変更

			"click #ca_MDCMV1011_cancel"		:	"_onCancelClick",	// キャンセルボタン押下
			"click #ca_MDCMV1011_commit"		:	"_onCommitClick"	// 確定ボタン押下
		},

		initialize: function() {
			_.bindAll(this);
			this.fcond = {};
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function(periodFolder) {
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), true);

			clutil.inputlimiter(this.$el);

			// datepickerの作成
			clutil.datepicker(this.$("#ca_MDCMV1011_srchiymd"));
			clutil.datepicker(this.$("#ca_MDCMV1011_org_srchiymd"));
			clutil.datepicker(this.$("#ca_MDCMV1011_itgrp_srchiymd"));
			clutil.datepicker(this.$("#ca_MDCMV1011_memb_srchiymd"));

			// 曜日・特定日のすべて選択checkboxを初期化
			this.wday_chkall = clutil.checkall(this.$('#ca_MDCMV1011_wday_chkall'), this.$('#ca_MDCMV1011_wday'));
			this.sday_chkall = clutil.checkall(this.$('#ca_MDCMV1011_sday_chkall'), this.$('#ca_MDCMV1011_sday'));

			// 時間帯
			if (!this.fcond.time) {
				this.$('#ca_MDCMV1011_time').remove();
			}

			// 前年度ロジック
			clutil.cltypeselector2(this.$('#ca_MDCMV1011_lyLogic'), this.lylogiclist, 0, 1);

			// 保存用
			// this.s_time = clutil.s_time;
			this.s_time = 0;
			this.e_time = clutil.e_time;
			clutil.cltimeselector(
					this.$('#ca_MDCMV1011_time_val_hh'),
					this.$('#ca_MDCMV1011_time_val_mm'),
					1,
					this.s_time,
					this.e_time);
			clutil.cltimeselector(
					this.$('#ca_MDCMV1011_time_val2_hh'),
					this.$('#ca_MDCMV1011_time_val2_mm'),
					1,
					this.s_time,
					this.e_time);

//			// 時間帯スライダー
//			this.$("#ca_MDCMV1011_slider_range").slider({
//				range: true,
//				step: 50,
//				min: clutil.s_time,
//				max: clutil.e_time,
//				values: [clutil.s_time, clutil.e_time],
//				slide: function(event, ui) {
//					var s_time = ui.values[0];
//					var e_time = ui.values[1];
//					if (Math.floor(s_time%100) == 50) {
//						s_time = s_time - 50 + 30;
//					}
//					if (Math.floor(e_time%100) == 50) {
//						e_time = e_time - 50 + 30;
//					}
//					_this.$("#ca_MDCMV1011_time_val").selectpicker('val', s_time);
//					_this.$("#ca_MDCMV1011_time_val2").selectpicker('val', e_time);
//				}
//			});
//			// 初期値未選択
//			this.$("#ca_MDCMV1011_time_val").selectpicker('val', 0);
//			this.$("#ca_MDCMV1011_time_val2").selectpicker('val', 0);

			clutil.initUIelement(this.$el);

			var _this = this;

			// 検索日指定クリック
			this.$el.delegate(':radio[name=ca_MDCMV1011_f_srchiymd_type]', 'toggle', function (ev) {
				_this.onRadioClick($(this).val());
			});

			// 終日クリック
			this.$('#ca_MDCMV1011_time').delegate(':checkbox', 'toggle', this.allDayToggled);

			// モデルデータをViewへセット
			if(periodFolder){
				this.setData(periodFolder);
			}

			this.$('div.datepicker_wrap img').click(function (e) {
				console.log('click');
				$('#ui-datepicker-div').css('z-index', '500');
			});
		},

		// 時間帯：終日チェックボックスのトグル処理
		allDayToggled: function(e){
			if ($(e.target).prop('checked')) {
//				this.$("#ca_MDCMV1011_slider_range").slider({
//					disabled: true,
//					values: [clutil.s_time, clutil.e_time]
//				});
				// this.$("#ca_MDCMV1011_time_val_hh").selectpicker('val', Math.floor(clutil.s_time/100));
				// this.$("#ca_MDCMV1011_time_val_mm").selectpicker('val', Math.floor(clutil.s_time%100));
				this.$("#ca_MDCMV1011_time_val_hh").selectpicker('val', 0);
				this.$("#ca_MDCMV1011_time_val_mm").selectpicker('val', 0);
				this.$("#ca_MDCMV1011_time_val2_hh").selectpicker('val', Math.floor(clutil.e_time/100));
				this.$("#ca_MDCMV1011_time_val2_mm").selectpicker('val', Math.floor(clutil.e_time%100));
				clutil.viewReadonly(this.$('#ca_MDCMV1011_time'));
				// チェックボックスのみ使用可
				this.$("#ca_MDCMV1011_allDay").removeAttr("disabled");
				this.$("label[for=ca_MDCMV1011_allDay]").removeClass("disabled");
			} else {
//				this.$("#ca_MDCMV1011_slider_range").slider({
//					disabled: false
//				});
				clutil.viewRemoveReadonly(this.$('#ca_MDCMV1011_time'));
			}
		},

		/**
		 * 選択画面の初期化処理
		 *
		 * 引数
		 * ・$parentView		: 親画面のjQueryオブジェクト (例：$('#ca_main'))
		 * ・anadata			: 分析情報
		 */
		render: function(
				$parentView,
				anadata) {
			var _this = this;

			this.$parentView = $parentView;
			this.anadata = anadata;

			if (this.anadata != null) {
				var fCondItemList = this.anadata.f_cond_item_list;

				// 絞込条件の設定
				if (fCondItemList != null && fCondItemList.length > 0) {
					for (var i = 0; i < fCondItemList.length-1; i++) {
						var conditem = fCondItemList[i];
						switch (conditem.cond_kind) {
						// 曜日条件
						case amgbp_AnaDefs.AMGBA_DEFS_KIND_WDAY:
							this.fcond.wday = true;
							break;
						// 時間帯条件
						case amgbp_AnaDefs.AMGBA_DEFS_KIND_TIMEZONE:
							this.fcond.time = true;
							break;
						default:
							break;
						}
					}
				}
			}

//			var url = "";
//			url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
			var url = clcom.getAnaSubPaneURI(this.screenId);

			// HTMLソースを読み込む
			clutil.loadHtml(url, function(data) {
				_this.html_source = data;
			});
		},

		show: function(periodFolder, isSubDialog) {
			var _this = this;

			// 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
			if (isSubDialog == null) {
				$('.cl_dialog').empty();
			}
			this.$parentView.hide();

			// htmlソースからダイアログを作成する
			this.$el.html('');
			this.$el.html(this.html_source);

			$('.cl_echoback').hide();
			// マスタ検索日：validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_MDCMV1011_main'), {
				echoback		: $('.cl_echoback')
			});
			// validatorエラー時の表示領域
			this.time_validator = clutil.validator(this.$('#ca_MDCMV1011_time'), {
				echoback		: $('.cl_echoback')
			});

			// 特定日系コンフィギュレーション
			if(Ana.Config.cond.MDCMV1011.sdayGroupDisplay === false){
				this.$('#ca_MDCMV1011_sdaygroup').hide();
			}

			// マスタ検索日コンフィギュレーション
			if(Ana.Config.cond.MDCMV1011.mstsrchdate){
				var config = Ana.Config.cond.MDCMV1011.mstsrchdate;

				// 個別に設定：ラベル名変更
				if(!_.isEmpty(config.eachSelectLabel)){
					var $select = this.$('[name="ca_MDCMV1011_f_srchiymd_type"][value="2"]');
					var $label = $select.closest('label');
					var $labelChildren = $label.children();
					$label.text(config.eachSelectLabel).prepend($labelChildren);
				}

				var hiddenCount = 0;
				if(config.org === false){
					//店舗検索日 - 非表示
					this.$('#ca_MDCMV1011_org_srchiymd').closest('.fieldUnit').hide();
					hiddenCount++;
				}
				if(config.itgrp === false){
					//商品検索日 - 非表示
					this.$('#ca_MDCMV1011_itgrp_srchiymd').closest('.fieldUnit').hide();
					hiddenCount++;
				}
				if(config.memb === false){
					//会員検索日 - 非表示
					this.$('#ca_MDCMV1011_memb_srchiymd').closest('.fieldUnit').hide();
					hiddenCount++;
				}

				if(hiddenCount === 3){
					// マスタ検索日個別設定は全部いらない
					var $select = this.$('[name="ca_MDCMV1011_f_srchiymd_type"][value="1"]');
					$select.closest('.fieldUnit').hide();
				}
			}

			// 画面の初期化
			this.initUIelement(periodFolder);

			// フォーカスの設定
			this.setFocus();
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			if (this.fcond.time) {
				clutil.setFocus(this.$('#ca_MDCMV1011_time_val_hh'));
			} else {
				if (this.$(':radio[name=ca_MDCMV1011_f_srchiymd_type]:checked').val() == amgbp_AnaHead.AMGBP_ANA_REQ_F_SRCHIYMD_TYPE_COM) {
					clutil.setFocus(this.$('#ca_MDCMV1011_srchiymd'));
				} else {
					clutil.setFocus(this.$('#ca_MDCMV1011_org_srchiymd'));
				}
			}
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// validatorの初期化
			this.validator.clear();
		},

		/**
		 * ラジオボタン click
		 */
		onRadioClick: function(type) {
			this.$('.ca_MDCMV1011_type_sp').removeClass('dispn');
			this.$('.ca_MDCMV1011_type_com').removeClass('dispn');
			if (type == amgbp_AnaHead.AMGBP_ANA_REQ_F_SRCHIYMD_TYPE_COM) {
				// 共通指定
				this.$('.ca_MDCMV1011_type_sp').addClass('dispn');
			} else {
				// 個別指定
				this.$('.ca_MDCMV1011_type_com').addClass('dispn');
			}
		},

		/**
		 * 時刻単位変更
		 */
		_onTimeSelect : function(e) {
			// validatorクリア
			this.time_validator.clear();

			var isS_time = $(e.target).get(0).id == 'ca_MDCMV1011_time_val' ? true : false;

			// クラスに合わせて表示する内容を変更
			var s_time = Number(this.$('#ca_MDCMV1011_time_val').val());
			var e_time = Number(this.$('#ca_MDCMV1011_time_val2').val());
			if (Math.floor(s_time%100) == 50) {
				s_time = s_time - 50 + 30;
			}
			if (Math.floor(e_time%100) == 50) {
				e_time = e_time - 50 + 30;
			}

			// 開始時刻>終了時刻の場合は強制的に戻す
			if (s_time != 0 && e_time != 0 && s_time > e_time) {
				if (isS_time) {
					s_time = this.s_time;
					$("#ca_MDCMV1011_time_val").selectpicker('val', s_time);
				} else {
					e_time = this.e_time;
					$("#ca_MDCMV1011_time_val2").selectpicker('val', e_time);
				}
			}

			// スライダー
			if (s_time != 0 && e_time != 0) {
				this.$("#ca_MDCMV1011_slider_range").slider({
					values: [s_time, e_time]
				});
			}

			this.s_time = s_time;
			this.e_time = e_time;
		},

		// データをセット
		setData: function(dto) {
			// 曜日
			if(_.isArray(dto.wdayFocuses)){
				for(var i = 0; i < dto.wdayFocuses.length; i++){
					var f = dto.wdayFocuses[i];
					this.$('#ca_MDCMV1011_wday_' + f.val).checkbox('check');
				}
			}

			// 特定日
			if(_.isArray(dto.spymdFocuses)){
				for(var i = 0; i < dto.spymdFocuses.length; i++){
					var f = dto.spymdFocuses[i];
					this.$('#ca_MDCMV1011_sday_' + f.val).checkbox('check');
				}
			}

			// 祝日
			if(dto.holidayFocus){
				var f = dto.holidayFocus;
				this.$(':radio[name=ca_MDCMV1011_holiday][value=' + f.val + ']').radio('check');
			}

			// 時間帯
			if(dto.tzFocus){
				var f = dto.tzFocus;
				f.val_hh = Math.floor(f.val/100);
				f.val_mm = Math.floor(f.val%100);
				f.val2_hh = Math.floor(f.val2/100);
				f.val2_mm = Math.floor(f.val2%100);
				clutil.data2view(this.$('#ca_MDCMV1011_time'), f, 'ca_MDCMV1011_time_');
				// 終日チェック: enable == true ならば、終日チェックを外す
				this.$('#ca_MDCMV1011_allDay').checkbox(f.enable ? 'uncheck' : 'check');
				this.allDayToggled({target: document.getElementById('ca_MDCMV1011_allDay')});
			}

			// マスタ検索日
			if(dto.anaDate){
				clutil.data2view(this.$('#ca_MDCMV1011_searchArea'), dto.anaDate, 'ca_MDCMV1011_');
				this.onRadioClick(dto.anaDate.f_srchiymd_type);
			}else{
				// デフォルトは共通指定
				this.onRadioClick(amgbp_AnaHead.AMGBP_ANA_REQ_F_SRCHIYMD_TYPE_COM);
			}

			// 前年度ロジック
			if (dto.disp_ly) {
				this.$('#ca_MDCMV1011_lyLogic').selectpicker('val', dto.disp_ly);
			}
		},

		getData: function(){
			// 曜日
			var wdayFocuses = [];
			this.$('#ca_MDCMV1011_wday').find('input:checked').each(function(){
				var val = (this.id).replace("ca_MDCMV1011_wday_", "");
				var focus = {
					kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_WDAY,
					val : val
				};
				wdayFocuses.push(focus);
			});

			// 特定日
			var spymdFocuses = [];
			this.$('#ca_MDCMV1011_sday').find('input:checked').each(function(){
				var val = (this.id).replace("ca_MDCMV1011_sday_", "");
				var focus = {
					kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_SPYMD,
					attr: 1,		// 1:対象日、2:除外日・・・本システムでは「除外日」の指定はナシ。
					val : val
				};
				spymdFocuses.push(focus);
			});

			// 祝日
			var holidayFocus = {
				kind : amgbp_AnaDefs.AMGBA_DEFS_KIND_HOLIDAY,
				val : this.$(':radio[name=ca_MDCMV1011_holiday]:checked').val()
			};


			// 時間帯
			var tzFocus = function(v){
				var tzFocusDto = null;
				do{
					var $tzel = v.$('#ca_MDCMV1011_time');
					if($tzel.length === 0){
						// 時間帯設定パネル自体が無い。-- anadata のコンフィギュレーションにより削除された
						break;
					}
					var v2d = clutil.view2data($tzel, 'ca_MDCMV1011_time_');
					if(!_.has(v2d, 'val_hh') || !_.has(v2d, 'val_mm') ||
							!_.has(v2d, 'val2_hh' || !_.has(v2d, 'val2_mm'))){
						// 要素が不完全なので無視（１）
						break;
					}
					if (v2d.val_hh == "" || v2d.val_mm == "" ||
							v2d.val2_hh == "" || v2d.val2_mm == "") {
						// 要素が不完全なので無視（２）
						break;
					}
					tzFocusDto = {
						kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_TIMEPERIOD,
						val:  parseInt(v2d.val_hh*100) + parseInt(v2d.val_mm),
						val2: parseInt(v2d.val2_hh*100) + parseInt(v2d.val2_mm),
						enable: (v2d.ca_MDCMV1011_allDay === 0)		// 逆の意味になってわかりずらいか・・・
					};
				}while(false);
				return tzFocusDto;
			}(this);

			// マスタ検索日
			var anaDate = clutil.view2data(this.$('#ca_MDCMV1011_searchArea'), 'ca_MDCMV1011_');

			// 前年度ロジック
			var lyLogic_val = clutil.view2data(this.$('#ca_MDCMV1011_lyLogicArea'), 'ca_MDCMV1011_');
			var disp_ly = Number(lyLogic_val.lyLogic);

			return {
				wdayFocuses: wdayFocuses,
				spymdFocuses: spymdFocuses,
				holidayFocus: holidayFocus,
				tzFocus: tzFocus,
				anaDate: anaDate,
				disp_ly: disp_ly
			};
		},

		/**
		 * 確定ボタン click
		 */
		_onCommitClick: function() {
			// validatorエラー時の表示領域
			this.validator.clear();

			var dto = this.getData();

			var type = dto.anaDate.f_srchiymd_type ==
				amgbp_AnaHead.AMGBP_ANA_REQ_F_SRCHIYMD_TYPE_COM ?
						'ca_MDCMV1011_type_com' :	'ca_MDCMV1011_type_sp';

			var retStat = true;
			// 時刻：validatorエラー時の表示領域
			// validation
			if(!this.time_validator.valid()) {
				retStat = false;
			}
			if (dto.tzFocus != null) {
				var chkInfo = [];
				chkInfo.push({
					stval : 'ca_MDCMV1011_time_val_hh',
					edval : 'ca_MDCMV1011_time_val2_hh'
				});
				if(!this.time_validator.validFromTo(chkInfo)){
					retStat = false;
				}
				if (Math.floor(dto.tzFocus.val/100) == Math.floor(dto.tzFocus.val2/100)) {
					var chkInfo = [];
					chkInfo.push({
						stval : 'ca_MDCMV1011_time_val_mm',
						edval : 'ca_MDCMV1011_time_val2_mm'
					});
					if(!this.time_validator.validFromTo(chkInfo)){
						retStat = false;
					}
				}
			}

			// マスタ検索日：validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('.' + type), {
				echoback		: $('.cl_echoback')
			});
			// validation
			if(!this.validator.valid()) {
				retStat = false;
			}
			if(!retStat) {
				this.validator.setErrorInfo({_eb_: clmsg.cl_echoback});
				this.validator.setErrorFocus();
				return this;
			}

			this.$parentView.show();
			this.okProc(dto);
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
		},

		// 選択時処理  呼び出し側で override する
		okProc : function(){
			// 上位で上書きする。
		},

		/**
		 * キャンセルボタン click
		 */
		_onCancelClick: function() {
			this.$parentView.show();
			this.okProc(null);
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
		}
	});

});
