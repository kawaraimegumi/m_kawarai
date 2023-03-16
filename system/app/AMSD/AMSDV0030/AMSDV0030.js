useSelectpicker2();

$(function() {

	clutil.enterFocusMode($('body'));

	var CsvOutView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			'change #ca_unitID'			: '_onChangeUnit',		// マスタ変更
			'change #ca_master'			: '_onChangeMaster',	// マスタ変更
			'change #ca_tgtItgrpIDs'	: '_onChangeTgtItgrpID',	// 品種変更
			'click #ca_csv_download'	: '_onSampleDLClick',	// ExcelサンプルDLボタン押下
		},

		uri : "AMSDV0030",
		initialize: function() {
			_.bindAll(this);
			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId	: -1,
				title		: 'StoCSマスタ取込・出力',
				btn_csv		: true,
				btn_submit	: false,
			});

			this.validator = clutil.validator($("#ca_tgtArea"), {
				echoback : $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		initUIelement : function() {
			var _this = this;

			//MD-1953 振分一括取込_長時間実行時の挙動改善_作業依頼　タイムアウト変更
			$.ajaxSetup({
				  timeout: 15 * 60 * 1000		// タイムアウト15分(個別設定)
			});

			clutil.inputlimiter(this.$el);
			this.mdBaseView.initUIElement();

			// [CSV取込ボタン]: ここから ----------------------------------------
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile) {
					var srchDto = clutil.view2data(this.$("#ca_tgtArea"));
					srchDto.tgtItgrpIDs = this.arrayStr2Num(srchDto.tgtItgrpIDs);
					var sizePtnID = Number(srchDto.sizePtnID) || Number(srchDto.sizePtnID2);
					var req = {
						tgtUnitID		: srchDto.unitID,
						tgtMstID		: srchDto.master,
						tgtItgrpID		: srchDto.itgrpID,
						tgtItgrpIDs		: srchDto.tgtItgrpIDs,
						tgtSizePtnID	: sizePtnID,
						tgtInputTypeID	: srchDto.inputType,
						tgtYear			: srchDto.year,
					};

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMSDV0030',
						data: {
							AMSDV0030UpdReq : req,
						},
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
			this.opeCSVInputCtrl.on('fail', function(data) {
				if (data.rspHead.fieldMessages) {
					// 項目ごとのエラーメッセージがあれば当該箇所へエラー情報表示する。
					_this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {by : "id", prefix : "ca_"});
				}
				if (data.rspHead.uri) {
					// CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				}
			});
			// ---------------------------------------- [CSV取込ボタン]: ここまで

			var now = clcom.getOpeDate();
			console.log(now);

			// 品種（複数）
			clutil.clvarietyselector($("#ca_srchItgrpID"));	// 初期値空白
			// サイズパターン
			clutil.clsizeptnMselector($("#ca_sizePtnID2"));	// 初期値空白

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
				// サイズパターン
				'clsizeptn_byitgrpselector': {
					el: "#ca_sizePtnID",
					dependSrc: {
						itgrp_id: 'itgrp_id'
					}
				},
			}, {
				dataSource: {
					ymd: clcom.getOpeDate,
				}
			});

			this.fieldRelation.done(function() {
				// ここでviewへの反映が保証される。(空の店舗ランク取得)
			});
			this.fieldRelation.bind("reset", _.bind(function() {
				this._onChangeUnit();
			}, this));

			// 取込対象マスタselector
			var html_source = '';
			html_source += '<option value=0>&nbsp;</option>';
			html_source += '<option value=1>StoCSカラー商品マスタ</option>';
			//html_source += '<option value=2>StoCS振分用集約商品マスタ</option>';
			html_source += '<option value=3>StoCS最低在庫・サイズ構成比マスタ</option>';
			//html_source += '<option value=4>StoCS休日マスタ</option>';
			//html_source += '<option value=5>StoCS店舗マスタ</option>';
			html_source += '<option value=6>StoCS品種マスタ</option>';
			//html_source += '<option value=7>StoCSシャツグループマスタ</option>';
			//html_source += '<option value=8>StoCS分納商品在庫数マスタ</option>';
			html_source += '<option value=9>StoCS業務設定マスタ</option>';
			html_source += '<option value=10>StoCS店舗属性マスタ</option>';
			$("#ca_master").html('');
			$("#ca_master").html(html_source).selectpicker().selectpicker('refresh');

			// 入力単位selector
			html_source = '';
			html_source += '<option value="0">&nbsp;</option>';
			html_source += '<option value="1">品種単位</option>';
			html_source += '<option value="2">商品カテゴリ単位</option>';
			html_source += '<option value="3">カラー商品単位</option>';
			html_source += '<option value="4">店舗×カラー商品単位</option>';
			$("#ca_inputType").html('');
			$("#ca_inputType").html(html_source).selectpicker().selectpicker('refresh');

			this._onChangeMaster();
			this._onChangeUnit();

			return this;
		},

		render : function() {
			this.mdBaseView.render();
			return this;
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e) {
			// ope_btn 系
			switch (rtyp) {
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV(Excelデータ出力)
				console.log('Excelデータ出力');
				this.doDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		arrayStr2Num: function(array) {
			if (array == null || array.length == 0) {
				array = [];
			} else {
				for (var i = 0; i < array.length; i++) {
					if (typeof array[i] == 'string') {
						array[i] = Number(array[i]);
					}
				}
			}
			return array;
		},

		buildReq: function(rtyp) {
			if (!this.validator.valid()) {
				return null;
			}

			//リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_tgtArea"));
			srchDto.tgtItgrpIDs = this.arrayStr2Num(srchDto.tgtItgrpIDs);
			var sizePtnID = Number(srchDto.sizePtnID) || Number(srchDto.sizePtnID2);
			var req = {
				tgtUnitID		: srchDto.unitID,
				tgtMstID		: srchDto.master,
				tgtItgrpID		: srchDto.itgrpID,
				tgtItgrpIDs		: srchDto.tgtItgrpIDs,
				tgtSizePtnID	: sizePtnID,
				tgtInputTypeID	: srchDto.inputType,
				tgtYear			: srchDto.year,
			};
			if (req.tgtItgrpIDs == null) {
				req.tgtItgrpIDs = [];
			}
			for (var i = 0; i < req.tgtItgrpIDs.length; i++) {
				if (typeof req.tgtItgrpIDs[i] == 'string') {
					req.tgtItgrpIDs[i] = Number(req.tgtItgrpIDs[i]);
				}
			}
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp,
				},
				reqPage: {
				},
				AMSDV0030GetReq: req,
				AMSDV0030UpdReq: req,
			};
			console.log(reqDto);
			return reqDto;
		},

		_onChangeUnit: function(e) {
			var val = Number($("#ca_unitID").selectpicker('val'));
			if (val == 0) {
				// マスタ 一旦オフ
				clutil.inputReadonly($("#ca_master"));
				clutil.fixReadonly($("#ca_master"));
				this.validator.clear($("#ca_master"));
				$("#div_master").removeClass('required');
				$("#ca_master").removeClass('cl_required');
				$("#ca_master").removeClass('cl_valid');
				$("#ca_master").val(0).selectpicker('refresh');

				// 品種 なし
				clutil.inputReadonly($("#ca_itgrpID"));
				clutil.fixReadonly($("#ca_itgrpID"));
				this.validator.clear($("#ca_itgrpID"));
				$("#div_itgrpID").removeClass('required');
				$("#ca_itgrpID").removeClass('cl_required');
				$("#ca_itgrpID").removeClass('cl_valid');
				$("#ca_itgrpID").val('');

				// 品種(複数) なし
				clutil.inputReadonly($("#ca_tgtItgrpIDs"));
				clutil.fixReadonly($("#ca_tgtItgrpIDs"));
				this.validator.clear($("#ca_tgtItgrpIDs"));
				$("#div_tgtItgrpIDs").removeClass('required');
				$("#ca_tgtItgrpIDs").removeClass('cl_required');
				$("#ca_tgtItgrpIDs").removeClass('cl_valid');
				$("#ca_tgtItgrpIDs").val('');

				// サイズパターン なし
				clutil.inputReadonly($("#ca_sizePtnID"));
				clutil.fixReadonly($("#ca_sizePtnID"));
				this.validator.clear($("#ca_sizePtnID"));
				$("#div_sizePtnID").removeClass('required');
				$("#ca_sizePtnID").removeClass('cl_required');
				$("#ca_sizePtnID").removeClass('cl_valid');
				$("#ca_sizePtnID").val(0).selectpicker('refresh');

				// サイズパターン2 なし
				clutil.inputReadonly($("#ca_sizePtnID2"));
				clutil.fixReadonly($("#ca_sizePtnID2"));
				this.validator.clear($("#ca_sizePtnID2"));
				$("#div_sizePtnID2").removeClass('required');
				$("#ca_sizePtnID2").removeClass('cl_required');
				$("#ca_sizePtnID2").removeClass('cl_valid');
				$("#ca_sizePtnID2").val(0).selectpicker('refresh');

				// 入力単位 なし
				clutil.inputReadonly($("#ca_inputType"));
				clutil.fixReadonly($("#ca_inputType"));
				this.validator.clear($("#ca_inputType"));
				$("#div_inputType").removeClass('required');
				$("#ca_inputType").removeClass('cl_required');
				$("#ca_inputType").removeClass('cl_valid');
				$("#ca_inputType").val(0).selectpicker('refresh');

				// 年 なし
				clutil.inputReadonly($("#ca_year"));
				clutil.fixReadonly($("#ca_year"));
				this.validator.clear($("#ca_year"));
				$("#div_year").removeClass('required');
				$("#ca_year").removeClass('cl_required');
				$("#ca_year").removeClass('cl_valid');
				$("#ca_year").val('');

				clutil.inputReadonly($("#div_excelBtns").find('a'));

				this.mdBaseView.options.btn_csv = false;
				this.mdBaseView.renderFooterNavi();
			} else {
				// マスタ オン
				clutil.unfixReadonly($("#ca_master"));
				clutil.inputRemoveReadonly($("#ca_master"));
				$("#div_master").addClass('required');
				$("#ca_master").addClass('cl_required');
				$("#ca_master").addClass('cl_valid');

				this._onChangeMaster();
			}
		},

		_onChangeMaster: function(e) {
			var val = Number($("#ca_master").selectpicker('val'));

			switch (val) {
				case 0: // 空欄
					// 品種 なし
					clutil.inputReadonly($("#ca_itgrpID"));
					clutil.fixReadonly($("#ca_itgrpID"));
					this.validator.clear($("#ca_itgrpID"));
					$("#div_itgrpID").removeClass('required');
					$("#ca_itgrpID").removeClass('cl_required');
					$("#ca_itgrpID").removeClass('cl_valid');
					$("#ca_itgrpID").val('');

					// 品種(複数) なし
					clutil.inputReadonly($("#ca_tgtItgrpIDs"));
					clutil.fixReadonly($("#ca_tgtItgrpIDs"));
					this.validator.clear($("#ca_tgtItgrpIDs"));
					$("#div_tgtItgrpIDs").removeClass('required');
					$("#ca_tgtItgrpIDs").removeClass('cl_required');
					$("#ca_tgtItgrpIDs").removeClass('cl_valid');
					$("#ca_tgtItgrpIDs").val(0).selectpicker('refresh');

					// サイズパターン なし
					clutil.inputReadonly($("#ca_sizePtnID"));
					clutil.fixReadonly($("#ca_sizePtnID"));
					this.validator.clear($("#ca_sizePtnID"));
					$("#div_sizePtnID").removeClass('required');
					$("#ca_sizePtnID").removeClass('cl_required');
					$("#ca_sizePtnID").removeClass('cl_valid');
					$("#ca_sizePtnID").val(0).selectpicker('refresh');

					// サイズパターン2 なし
					clutil.inputReadonly($("#ca_sizePtnID2"));
					clutil.fixReadonly($("#ca_sizePtnID2"));
					this.validator.clear($("#ca_sizePtnID2"));
					$("#div_sizePtnID2").removeClass('required');
					$("#ca_sizePtnID2").removeClass('cl_required');
					$("#ca_sizePtnID2").removeClass('cl_valid');
					$("#ca_sizePtnID2").val(0).selectpicker('refresh');

					// 入力単位 なし
					clutil.inputReadonly($("#ca_inputType"));
					clutil.fixReadonly($("#ca_inputType"));
					this.validator.clear($("#ca_inputType"));
					$("#div_inputType").removeClass('required');
					$("#ca_inputType").removeClass('cl_required');
					$("#ca_inputType").removeClass('cl_valid');
					$("#ca_inputType").val(0).selectpicker('refresh');

					// 年 なし
					clutil.inputReadonly($("#ca_year"));
					clutil.fixReadonly($("#ca_year"));
					this.validator.clear($("#ca_year"));
					$("#div_year").removeClass('required');
					$("#ca_year").removeClass('cl_required');
					$("#ca_year").removeClass('cl_valid');
					$("#ca_year").val('');

					clutil.inputReadonly($("#div_excelBtns").find('a'));
					clutil.inputReadonly($("#ca_csv_download"));

					this.mdBaseView.options.btn_csv = false;
					this.mdBaseView.renderFooterNavi();
					break;
				case 1: // StoCSカラー商品マスタ
					// 品種 なし（非表示)
					clutil.inputReadonly($("#ca_itgrpID"));
					clutil.fixReadonly($("#ca_itgrpID"));
					this.validator.clear($("#ca_itgrpID"));
					$("#div_itgrpID").removeClass('required');
					$("#ca_itgrpID").removeClass('cl_required');
					$("#ca_itgrpID").removeClass('cl_valid');
					$("#ca_itgrpID").val('');
					$("#div_itgrpID").hide();

					// 品種(複数) 必須
					var unit_id = $("#ca_unitID").selectpicker('val');
					var func_id = clcom.getSysparam("PAR_AMMS_DEFAULT_ITGRP_FUNCID");
					clutil.unfixReadonly($("#ca_tgtItgrpIDs"));
					clutil.inputRemoveReadonly($("#ca_tgtItgrpIDs"));
					$("#div_tgtItgrpIDs").addClass('required');
					$("#ca_tgtItgrpIDs").addClass('cl_required');
					$("#ca_tgtItgrpIDs").addClass('cl_valid');
					$("#div_tgtItgrpIDs").show();
					clutil.clvarietyselector($("#ca_tgtItgrpIDs"), func_id, unit_id, 1, null, true);

					// サイズパターン なし
					clutil.inputReadonly($("#ca_sizePtnID"));
					clutil.fixReadonly($("#ca_sizePtnID"));
					this.validator.clear($("#ca_sizePtnID"));
					$("#div_sizePtnID").removeClass('required');
					$("#ca_sizePtnID").removeClass('cl_required');
					$("#ca_sizePtnID").removeClass('cl_valid');
					$("#ca_sizePtnID").val(0).selectpicker('refresh');

					// サイズパターン2 なし
					clutil.inputReadonly($("#ca_sizePtnID2"));
					clutil.fixReadonly($("#ca_sizePtnID2"));
					this.validator.clear($("#ca_sizePtnID2"));
					$("#div_sizePtnID2").removeClass('required');
					$("#ca_sizePtnID2").removeClass('cl_required');
					$("#ca_sizePtnID2").removeClass('cl_valid');
					$("#ca_sizePtnID2").val(0).selectpicker('refresh');

					// 入力単位 なし
					clutil.inputReadonly($("#ca_inputType"));
					clutil.fixReadonly($("#ca_inputType"));
					this.validator.clear($("#ca_inputType"));
					$("#div_inputType").removeClass('required');
					$("#ca_inputType").removeClass('cl_required');
					$("#ca_inputType").removeClass('cl_valid');
					$("#ca_inputType").val(0).selectpicker('refresh');

					// 年 なし
					clutil.inputReadonly($("#ca_year"));
					clutil.fixReadonly($("#ca_year"));
					this.validator.clear($("#ca_year"));
					$("#div_year").removeClass('required');
					$("#ca_year").removeClass('cl_required');
					$("#ca_year").removeClass('cl_valid');
					$("#ca_year").val('');

					clutil.inputRemoveReadonly($("#div_excelBtns").find('a'));
					clutil.inputRemoveReadonly($("#ca_csv_download"));

					this.mdBaseView.options.btn_csv = true;
					this.mdBaseView.renderFooterNavi();
					break;
				case 3: // StoCS最低在庫・サイズ構成比マスタ
					// 品種 なし（非表示)
					clutil.inputReadonly($("#ca_itgrpID"));
					clutil.fixReadonly($("#ca_itgrpID"));
					this.validator.clear($("#ca_itgrpID"));
					$("#div_itgrpID").removeClass('required');
					$("#ca_itgrpID").removeClass('cl_required');
					$("#ca_itgrpID").removeClass('cl_valid');
					$("#ca_itgrpID").val('');
					$("#div_itgrpID").hide();

					// 品種(複数) 必須
					var unit_id = $("#ca_unitID").selectpicker('val');
					var func_id = clcom.getSysparam("PAR_AMMS_DEFAULT_ITGRP_FUNCID");
					clutil.unfixReadonly($("#ca_tgtItgrpIDs"));
					clutil.inputRemoveReadonly($("#ca_tgtItgrpIDs"));
					$("#div_tgtItgrpIDs").addClass('required');
					$("#ca_tgtItgrpIDs").addClass('cl_required');
					$("#ca_tgtItgrpIDs").addClass('cl_valid');
					$("#div_tgtItgrpIDs").show();
					clutil.clvarietyselector($("#ca_tgtItgrpIDs"), func_id, unit_id, 1, null, true);

					// サイズパターン なし(非表示)
					clutil.inputReadonly($("#ca_sizePtnID"));
					clutil.fixReadonly($("#ca_sizePtnID"));
					this.validator.clear($("#ca_sizePtnID"));
					$("#div_sizePtnID").removeClass('required');
					$("#ca_sizePtnID").removeClass('cl_required');
					$("#ca_sizePtnID").removeClass('cl_valid');
					$("#ca_sizePtnID").val(0).selectpicker('refresh');
					$("#div_sizePtnID").hide();

					// サイズパターン 必須(まだ入力不可)
					clutil.inputReadonly($("#ca_sizePtnID2"));
					clutil.fixReadonly($("#ca_sizePtnID2"));
					$("#div_sizePtnID2").addClass('required');
					$("#ca_sizePtnID2").addClass('cl_required');
					$("#ca_sizePtnID2").addClass('cl_valid');
					$("#div_sizePtnID2").show();

					// 入力単位 必須
					clutil.unfixReadonly($("#ca_inputType"));
					clutil.inputRemoveReadonly($("#ca_inputType"));
					$("#div_inputType").addClass('required');
					$("#ca_inputType").addClass('cl_required');
					$("#ca_inputType").addClass('cl_valid');

					// 年 なし
					clutil.inputReadonly($("#ca_year"));
					clutil.fixReadonly($("#ca_year"));
					this.validator.clear($("#ca_year"));
					$("#div_year").removeClass('required');
					$("#ca_year").removeClass('cl_required');
					$("#ca_year").removeClass('cl_valid');
					$("#ca_year").val('');

					clutil.inputRemoveReadonly($("#div_excelBtns").find('a'));
					clutil.inputRemoveReadonly($("#ca_csv_download"));

					this.mdBaseView.options.btn_csv = true;
					this.mdBaseView.renderFooterNavi();

					break;
				case 5: // StoCS店舗マスタ
					// 品種 なし
					clutil.inputReadonly($("#ca_itgrpID"));
					clutil.fixReadonly($("#ca_itgrpID"));
					this.validator.clear($("#ca_itgrpID"));
					$("#div_itgrpID").removeClass('required');
					$("#ca_itgrpID").removeClass('cl_required');
					$("#ca_itgrpID").removeClass('cl_valid');
					$("#ca_itgrpID").val('');

					// 品種(複数) なし
					clutil.inputReadonly($("#ca_tgtItgrpIDs"));
					clutil.fixReadonly($("#ca_tgtItgrpIDs"));
					this.validator.clear($("#ca_tgtItgrpIDs"));
					$("#div_tgtItgrpIDs").removeClass('required');
					$("#ca_tgtItgrpIDs").removeClass('cl_required');
					$("#ca_tgtItgrpIDs").removeClass('cl_valid');
					$("#ca_tgtItgrpIDs").val(0).selectpicker('refresh');

					// サイズパターン なし
					clutil.inputReadonly($("#ca_sizePtnID"));
					clutil.fixReadonly($("#ca_sizePtnID"));
					this.validator.clear($("#ca_sizePtnID"));
					$("#div_sizePtnID").removeClass('required');
					$("#ca_sizePtnID").removeClass('cl_required');
					$("#ca_sizePtnID").removeClass('cl_valid');
					$("#ca_sizePtnID").val(0).selectpicker('refresh');

					// 入力単位 なし
					clutil.inputReadonly($("#ca_inputType"));
					clutil.fixReadonly($("#ca_inputType"));
					this.validator.clear($("#ca_inputType"));
					$("#div_inputType").removeClass('required');
					$("#ca_inputType").removeClass('cl_required');
					$("#ca_inputType").removeClass('cl_valid');
					$("#ca_inputType").val(0).selectpicker('refresh');

					// 年 なし
					clutil.inputReadonly($("#ca_year"));
					clutil.fixReadonly($("#ca_year"));
					this.validator.clear($("#ca_year"));
					$("#div_year").removeClass('required');
					$("#ca_year").removeClass('cl_required');
					$("#ca_year").removeClass('cl_valid');
					$("#ca_year").val('');

					clutil.inputRemoveReadonly($("#div_excelBtns").find('a'));
					clutil.inputRemoveReadonly($("#ca_csv_download"));

					this.mdBaseView.options.btn_csv = true;
					this.mdBaseView.renderFooterNavi();
					break;
				case 6: // StoCS品種マスタ
					// 品種 任意(表示)
					clutil.unfixReadonly($("#ca_itgrpID"));
					clutil.inputRemoveReadonly($("#ca_itgrpID"));
					$("#div_itgrpID").removeClass('required');
					$("#ca_itgrpID").removeClass('cl_required');
					$("#ca_itgrpID").addClass('cl_valid');
					$("#div_itgrpID").show();

					// 品種(複数) なし(非表示)
					clutil.inputReadonly($("#ca_tgtItgrpIDs"));
					clutil.fixReadonly($("#ca_tgtItgrpIDs"));
					this.validator.clear($("#ca_tgtItgrpIDs"));
					$("#div_tgtItgrpIDs").removeClass('required');
					$("#ca_tgtItgrpIDs").removeClass('cl_required');
					$("#ca_tgtItgrpIDs").removeClass('cl_valid');
					$("#ca_tgtItgrpIDs").val(0).selectpicker('refresh');
					$("#div_tgtItgrpIDs").hide();

					// サイズパターン なし
					clutil.inputReadonly($("#ca_sizePtnID"));
					clutil.fixReadonly($("#ca_sizePtnID"));
					this.validator.clear($("#ca_sizePtnID"));
					$("#div_sizePtnID").removeClass('required');
					$("#ca_sizePtnID").removeClass('cl_required');
					$("#ca_sizePtnID").removeClass('cl_valid');
					$("#ca_sizePtnID").val(0).selectpicker('refresh');

					// サイズパターン2 なし
					clutil.inputReadonly($("#ca_sizePtnID2"));
					clutil.fixReadonly($("#ca_sizePtnID2"));
					this.validator.clear($("#ca_sizePtnID2"));
					$("#div_sizePtnID2").removeClass('required');
					$("#ca_sizePtnID2").removeClass('cl_required');
					$("#ca_sizePtnID2").removeClass('cl_valid');
					$("#ca_sizePtnID2").val(0).selectpicker('refresh');

					// 入力単位 なし
					clutil.inputReadonly($("#ca_inputType"));
					clutil.fixReadonly($("#ca_inputType"));
					this.validator.clear($("#ca_inputType"));
					$("#div_inputType").removeClass('required');
					$("#ca_inputType").removeClass('cl_required');
					$("#ca_inputType").removeClass('cl_valid');
					$("#ca_inputType").val(0).selectpicker('refresh');

					// 年 なし
					clutil.inputReadonly($("#ca_year"));
					clutil.fixReadonly($("#ca_year"));
					this.validator.clear($("#ca_year"));
					$("#div_year").removeClass('required');
					$("#ca_year").removeClass('cl_required');
					$("#ca_year").removeClass('cl_valid');
					$("#ca_year").val('');

					clutil.inputRemoveReadonly($("#div_excelBtns").find('a'));
					clutil.inputRemoveReadonly($("#ca_csv_download"));

					this.mdBaseView.options.btn_csv = true;
					this.mdBaseView.renderFooterNavi();
					break;
				case 9: // StoCS業務設定マスタ
					// 品種 なし（非表示)
					clutil.inputReadonly($("#ca_itgrpID"));
					clutil.fixReadonly($("#ca_itgrpID"));
					this.validator.clear($("#ca_itgrpID"));
					$("#div_itgrpID").removeClass('required');
					$("#ca_itgrpID").removeClass('cl_required');
					$("#ca_itgrpID").removeClass('cl_valid');
					$("#ca_itgrpID").val('');
					$("#div_itgrpID").hide();

					// 品種(複数) 必須
					var unit_id = $("#ca_unitID").selectpicker('val');
					var func_id = clcom.getSysparam("PAR_AMMS_DEFAULT_ITGRP_FUNCID");
					clutil.unfixReadonly($("#ca_tgtItgrpIDs"));
					clutil.inputRemoveReadonly($("#ca_tgtItgrpIDs"));
					$("#div_tgtItgrpIDs").addClass('required');
					$("#ca_tgtItgrpIDs").addClass('cl_required');
					$("#ca_tgtItgrpIDs").addClass('cl_valid');
					$("#div_tgtItgrpIDs").show();
					clutil.clvarietyselector($("#ca_tgtItgrpIDs"), func_id, unit_id, 1, null, true);

					// サイズパターン なし
					clutil.inputReadonly($("#ca_sizePtnID"));
					clutil.fixReadonly($("#ca_sizePtnID"));
					this.validator.clear($("#ca_sizePtnID"));
					$("#div_sizePtnID").removeClass('required');
					$("#ca_sizePtnID").removeClass('cl_required');
					$("#ca_sizePtnID").removeClass('cl_valid');
					$("#ca_sizePtnID").val(0).selectpicker('refresh');

					// サイズパターン なし
					clutil.inputReadonly($("#ca_sizePtnID2"));
					clutil.fixReadonly($("#ca_sizePtnID2"));
					this.validator.clear($("#ca_sizePtnID2"));
					$("#div_sizePtnID2").removeClass('required');
					$("#ca_sizePtnID2").removeClass('cl_required');
					$("#ca_sizePtnID2").removeClass('cl_valid');
					$("#ca_sizePtnID2").val(0).selectpicker('refresh');

					// 入力単位 なし
					clutil.inputReadonly($("#ca_inputType"));
					clutil.fixReadonly($("#ca_inputType"));
					this.validator.clear($("#ca_inputType"));
					$("#div_inputType").removeClass('required');
					$("#ca_inputType").removeClass('cl_required');
					$("#ca_inputType").removeClass('cl_valid');
					$("#ca_inputType").val(0).selectpicker('refresh');

					// 年 なし
					clutil.inputReadonly($("#ca_year"));
					clutil.fixReadonly($("#ca_year"));
					this.validator.clear($("#ca_year"));
					$("#div_year").removeClass('required');
					$("#ca_year").removeClass('cl_required');
					$("#ca_year").removeClass('cl_valid');
					$("#ca_year").val('');

					clutil.inputRemoveReadonly($("#div_excelBtns").find('a'));
					clutil.inputRemoveReadonly($("#ca_csv_download"));

					this.mdBaseView.options.btn_csv = true;
					this.mdBaseView.renderFooterNavi();
					break;
				case 10: // StoCS店舗属性マスタ
					// 品種 必須(表示)
					clutil.unfixReadonly($("#ca_itgrpID"));
					clutil.inputRemoveReadonly($("#ca_itgrpID"));
					$("#div_itgrpID").addClass('required');
					$("#ca_itgrpID").addClass('cl_required');
					$("#ca_itgrpID").addClass('cl_valid');
					$("#div_itgrpID").show();

					// 品種(複数) なし(非表示)
					clutil.inputReadonly($("#ca_tgtItgrpIDs"));
					clutil.fixReadonly($("#ca_tgtItgrpIDs"));
					this.validator.clear($("#ca_tgtItgrpIDs"));
					$("#div_tgtItgrpIDs").removeClass('required');
					$("#ca_tgtItgrpIDs").removeClass('cl_required');
					$("#ca_tgtItgrpIDs").removeClass('cl_valid');
					$("#ca_tgtItgrpIDs").val(0).selectpicker('refresh');
					$("#div_tgtItgrpIDs").hide();

					// サイズパターン なし
					clutil.inputReadonly($("#ca_sizePtnID"));
					clutil.fixReadonly($("#ca_sizePtnID"));
					this.validator.clear($("#ca_sizePtnID"));
					$("#div_sizePtnID").removeClass('required');
					$("#ca_sizePtnID").removeClass('cl_required');
					$("#ca_sizePtnID").removeClass('cl_valid');
					$("#ca_sizePtnID").val(0).selectpicker('refresh');

					// サイズパターン2 なし
					clutil.inputReadonly($("#ca_sizePtnID2"));
					clutil.fixReadonly($("#ca_sizePtnID2"));
					this.validator.clear($("#ca_sizePtnID2"));
					$("#div_sizePtnID2").removeClass('required');
					$("#ca_sizePtnID2").removeClass('cl_required');
					$("#ca_sizePtnID2").removeClass('cl_valid');
					$("#ca_sizePtnID2").val(0).selectpicker('refresh');

					// 入力単位 なし
					clutil.inputReadonly($("#ca_inputType"));
					clutil.fixReadonly($("#ca_inputType"));
					this.validator.clear($("#ca_inputType"));
					$("#div_inputType").removeClass('required');
					$("#ca_inputType").removeClass('cl_required');
					$("#ca_inputType").removeClass('cl_valid');
					$("#ca_inputType").val(0).selectpicker('refresh');

					// 年 なし
					clutil.inputReadonly($("#ca_year"));
					clutil.fixReadonly($("#ca_year"));
					this.validator.clear($("#ca_year"));
					$("#div_year").removeClass('required');
					$("#ca_year").removeClass('cl_required');
					$("#ca_year").removeClass('cl_valid');
					$("#ca_year").val('');

					clutil.inputRemoveReadonly($("#div_excelBtns").find('a'));
					clutil.inputRemoveReadonly($("#ca_csv_download"));

					this.mdBaseView.options.btn_csv = true;
					this.mdBaseView.renderFooterNavi();
					break;
			}
		},

		/**
		 * 品種変更処理
		 */
		_onChangeTgtItgrpID: function(e) {
			var $ca_srchItgrpID = $("#ca_tgtItgrpIDs");
			var itgrpIDs = $ca_srchItgrpID.selectpicker('val');
			var $ca_sizePtnID2 = $("#ca_sizePtnID2");
			var $div_sizePtnID2 = $ca_sizePtnID2.parent();
			var master_val = Number($("#ca_master").selectpicker('val'));

			if (master_val == 3) {
				if (itgrpIDs == null || itgrpIDs.length == 0) {
					// 未選択の場合はサブクラス1,2を操作不可に
					clutil.inputReadonly($ca_sizePtnID2);
					clutil.fixReadonly($ca_sizePtnID2);
				} else if (master_val) {
					// 選択ありの場合はサブクラス1,2を操作可に
					clutil.unfixReadonly($ca_sizePtnID2);
					clutil.inputRemoveReadonly($ca_sizePtnID2);

					for (var i = 0; i < itgrpIDs.length; i++) {
						if (typeof itgrpIDs[i] == 'string') {
							itgrpIDs[i] = Number(itgrpIDs[i]);
						}
					}
				}
				clutil.clsizeptnMselector($ca_sizePtnID2, itgrpIDs, 1);
			}
		},

		_onSampleDLClick: function() {
			var url_array = [
				null,
				"StoCSカラー商品マスタ_サンプル.xlsx",
				null,
				"StoCS最低在庫・サイズ構成比マスタ_サンプル.xlsx",
				null,
				"StoCS店舗マスタ_サンプル.xlsx",
				"StoCS品種マスタ_サンプル.xlsx",
				null,
				null,
				"StoCS業務設定マスタ_サンプル.xlsx",
				"StoCS店舗属性マスタ_サンプル.xlsx"
			];
			var url = "";

			var master = Number($("#ca_master").selectpicker('val'));
			if 	(_.isNaN(master) || url_array[master] == null) {
				// 無いと思うけど対象外
				return;
			} else {
				url = "/public/sample/" + url_array[master];
			}

			clutil.download(url);
		},

		/**
		 * 出力ボタン押下処理
		 */
		doDownload: function(rtyp) {
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if (_.isNull(srchReq)) {
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
//			var defer = clutil.postDLJSON('AMDSV0150', srchReq);
			var defer = clutil.postDLJSON('AMSDV0030', srchReq);
			defer.fail(_.bind(function(data) {
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
			return;
		}
	});


	clutil.getIniJSON(null, null).done(_.bind(function(data,dataType) {
		ca_csvOutView = new CsvOutView;
		ca_csvOutView.initUIelement().render();
	}, this)).fail(function(data) {
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
