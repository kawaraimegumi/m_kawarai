$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var ARMSV0040View = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		validator : null,

		// Events
		events : {
			"click #header p.back"	:	"_onBackClick",			// 戻るボタン押下時

			"click #ca_previous"	:	"_onPreviousClick",		// 前へボタン
			"click #ca_next"		:	"_onNextClick",			// 次へボタン
			"click #ca_entry"		:	"_onEntryClick",		// 検索ボタン押下時
			"click #ca_cancel"		:	"_onCancelClick",		// キャンセルボタン押下時

			"blur .cl_required"		:	"_onRequiredBlur",		// 必須項目からフォーカスアウト
		},

		initialize: function() {
			_.bindAll(this);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback')
			});

			this.uri = 'AMRSV0040';
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'), 0);
			//this.getBusUnit();

			// 補正相殺区分
			clutil.cltypeselector(this.$("#ca_offsetTypeID"), amdb_defs.MTTYPETYPE_F_OFFSET_TYPE, 0);

			// 補正相殺区分
			clutil.cltypeselector(this.$("#ca_accTypeID"), amdb_defs.MTTYPETYPE_F_ACC_TYPE, 0);

			// カウンタ設置 #20140324
			clutil.cltxtFieldLimit($("#ca_offsetItemCode"));
			clutil.cltxtFieldLimit($("#ca_offsetItemName"));

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
			if(clcom.srcId == "AMRSV0030"){
				clcom.popPage(null);
			} else {
				clcom.gohome();
			}
			return this;
		},

		/**
		 * キャンセルボタン押下時
		 */
		_onCancelClick: function() {
			if(clcom.srcId == "AMRSV0030"){
				clcom.popPage(null);
			} else {
				clcom.gohome();
			}
			return this;
		},

		/**
		 * 登録ボタン押下処理
		 */
		_onEntryClick: function() {
			var _this = this;
			/*
			 * 無効化チェック
			 */
			if ($("#ca_entry").attr("disabled") === "disabled") {
				return false;
			}
			/*
			 * 入力値チェック
			 */
			// validation
			this.validator.clear();
			this.validator = clutil.validator($("#ca_base_form"), {
				echoback : $('.cl_echoback')
			});
			if(!this.validator.valid()) {
				return this;
			}

			/*
			 * パケット作成
			 */
			var reqHead = {
					opeTypeId : this.ope_mode,
			};
			var offsetItem = clutil.view2data(this.$('#ca_base_form'));

			var updReq = {
					offsetItem : offsetItem,
			};
			var req = {
					reqHead : reqHead,
					updReq  : updReq,
			};

			// データを登録する
			clutil.postJSON(this.uri, req, _.bind(function(data, dataType) {
				if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					//clutil.data2view(this.$('#ca_search_form'), this.cond);
					document.location = '#';
					// 更新完了ダイアログ表示
					clutil.updMessageDialog(_this.updConfirmcallback);

					// 開始日と登録ボタンを読み取り専用にする
					clutil.inputReadonly($('#ca_offsetItemCode'));
					$('#ca_entry').attr('disabled', 'disabled');
					$('#ca_confirmed').show();

					if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
						// 返信のレコード番号(data.getRsp.offsetItem.recno),レコード状態(data.getRsp.offsetItem.state)
						// を保存する
						var mydata = this.chkData[this.chkDataIndex];
						var savedata = {
								recno: data.getRsp.offsetItem.recno,
								state: data.getRsp.offsetItem.state,
						};
						mydata.savedata = savedata;
					}
				} else {
					// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
					this.validator.setErrorInfoFromSrv(data.head.fieldMessages, {
						prefix: 'ca_'
					});
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.head.message], data.head.args)});
				}
			}, this));

		},

		updConfirmcallback: function() {

		},

		/**
		 * 前へ
		 */
		_onPreviousClick: function() {
			this.validator.clear();
			//$('#ca_entry').removeAttr('disabled');
			// 編集データの配列インデックスをインクリメント
			this.chkDataIndex--;
			// データを取得する
			this.showChkData();
		},

		/**
		 * 次へ
		 */
		_onNextClick: function() {
			this.validator.clear();
			//$('#ca_entry').removeAttr('disabled');
			// 編集データの配列インデックスをインクリメント
			this.chkDataIndex++;
			// データを取得する
			this.showChkData();
		},
		/**
		 * 必須入力チェック
		 * @param e
		 */
		_onRequiredBlur: function(e) {
			var $tgt = $(e.target);
			if ($tgt.is('select') && $.tgt.val === '0') {
				this.validator.setErrorMsg($tgt, clmsg.cl_required);
			} else if ($tgt.is('span')) {
				if ($tgt.html().length === 0) {
					this.validator.setErrorMsg($tgt, clmsg.cl_required);
				}
			} else if ($tgt.is('td')) {
				if (!clutil.chkStr($tgt.text())) {
					this.validator.setErrorMsg($tgt, clmsg.cl_required);
				}
			} else if (!$tgt.is('button') && !$tgt.val()) {
				// selectpicker用にbuttonの場合は考えない
				this.validator.setErrorMsg($tgt, clmsg.cl_required);
			}
		},

		/**
		 * データを取得する
		 */
		showChkData : function() {
			// 取得するデータがなければなにもしない
			if (this.chkDataIndex > (this.chkData.length - 1) ||
				this.chkDataIndex < 0) {
				return;
			}
			// 取得するデータ
			var data = this.chkData[this.chkDataIndex];

			var reqHead = {
					opeTypeId :	am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
			};
			var getReq = {
					srchOffsetItemID : data.offsetItemID,
			};

			var req = {
					reqHead: reqHead,
					getReq : getReq
			};

			this.postJSON(req);
		},

		postJSON : function(req) {

			clutil.postJSON(this.uri, req, _.bind(function(data, dataType) {
				if (data.rspHead.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {
					var getRsp = data.getRsp;
					clutil.data2view(this.$('#ca_base_form'), getRsp.offsetItem);
					clutil.initUIelement(this.$('#ca_base_form'));
					$('#ca_entry').removeAttr('disabled');
					$('#ca_confirmed').hide();

					if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
						var mydata = this.chkData[this.chkDataIndex];
						var olddata = mydata.savedata;
						if (olddata != null) {
							var newdata = getRsp.offsetItem;
							if (olddata.recno !== newdata.recno || olddata.state !== newdata.state) {
								// 他者に更新されている
								this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg.cl_sys_db_other)});
							}
						}
					}
					if (this.chkDataIndex <= 0) {
						// 前へを消す
						$("#ca_previous").hide();
					} else {
						// 前へを表示
						$("#ca_previous").show();
					}
					if (this.chkDataIndex >= (this.chkData.length - 1)) {
						// 次へを消す
						$("#ca_next").hide();
					} else {
						// 次へを表示
						$("#ca_next").show();
					}
				} else {
					// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
					this.validator.setErrorInfoFromSrv(data.head.fieldMessages, {
						prefix: 'ca_'
					});
					// ヘッダーにメッセージを表示
					this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.head.message], data.head.args)});
				}
			}, this));
		},

		changeFooter: function() {
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DELL
					|| this.chkData.length == 1) {
				// フッターの下段を消去
				$("#mainColumnFooter").removeClass('x2');
				$("#mainColumnFooter p.right").hide();
				$("#mainColumnFooter p.left").hide();
			}
		}

	});

	clcom.getTypeList();

	ca_editView = new ARMSV0040View();
	ca_editView.render();

	////////////////////////////////////////////////

	// 初期データを取る
	clutil.getIniJSON(null, null, _.bind(function(data, dataType) {
		ca_editView.initUIelement();

		var args = {};
		if (clcom.pageArgs != null) {
			args = clcom.pageArgs;
		} else {
			args.ope_mode = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
		}

		// 画面起動モード
		ca_editView.ope_mode = args.ope_mode;

		if (args.ope_mode != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
			// 編集データの配列
			ca_editView.chkData = args.chkData;
			// 編集データの配列インデックス
			ca_editView.chkDataIndex = 0;
			// データを取得して画面に表示する
			ca_editView.showChkData();
		}

		$('body').show();

		var caption = '';
		switch (ca_editView.ope_mode) {
		case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			caption = '新規登録';
			$('#ca_unitID').focus();
			break;
		case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
			clutil.viewReadonly($("#div_ca_unitID"));
			clutil.inputReadonly($("#ca_offsetItemCode"));
			caption = '編集';
			$('#ca_offsetItemName').focus();
			break;
		case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
			clutil.viewReadonly($("#ca_base_form"));
			caption = '削除';
			$("#ca_entry").text('削除');
			break;
		default:
			break;
		}
		$("#ca_title_caption").text(caption);
		ca_editView.changeFooter();

	}, this));

});