$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var ARMSV0080View = Backbone.View.extend({
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
			"click #ca_tbody_footer span.btn-add"	: "_onBtnAddClick",	// 行追加押下時

			"blur .cl_required"		:	"_onRequiredBlur",		// 必須項目からフォーカスアウト
		},

		initialize: function() {
			_.bindAll(this);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback')
			});

			this.uri = 'AMRSV0080';
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

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
			if(clcom.srcId == "AMRSV0070"){
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
			if(clcom.srcId == "AMRSV0070"){
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
			var adjustDataList = _this.resultList;
			var noAdjustChk = _this.$("#ca_noAdjustChk").prop('checked') ? 1 : 0;

			var updReq = {
					noAdjustChk		:	noAdjustChk,
					adjustDataList	:	adjustDataList,
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

					/*
					 * 更新完了ダイアログを表示する？
					 * するなら、updConfirmcallback()で_onNextClick()を実行
					 * しないなら、ここで_onNextClick()を実行
					 *
					 * とりあえず、表示するでコーディング
					 */
					// 更新完了ダイアログ表示
					clutil.updMessageDialog(_this.updConfirmcallback);

					//
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
			_onNextClick();
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
		 * 行追加クリック
		 */
		_onBtnAddClick: function() {
			// 空データを作成
			var newdata = {
				adjustItemID:	0,
				adjustItemCode:	"",
				adjustItemName:	"",
				nAdjust:		0,
				price:			0,
				adjustAm:		0,
			};
			_this.resultList.push(newdata);
			$tbody_tmpl = this.$("#ca_table_tbody_template");
			$tbody_tmpl.tmpl(newdata).appendTo("#ca_table_body");

			for (var i = 0; i < _this.resultList.length; i++) {
				_this.resultList[i].no = i+1;
			}

			// noの再割当て
			$("#ca_table_tbody tr").each(function(i) {
				$(this).attr("name", i+1);
			});

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
					targetDate	:	data.targetDate,
					storeID		:	data.storeID,
					storeCode	:	data.storeCode,
					storeName	:	data.storeName,
					vendorID 	:	data.vendorID,
					vendorCode	:	data.vendorCode,
					vendorName	:	data.vendorName,
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
					var getReq = req.getReq;
					/*
					 * 店舗などを表示
					 */
					// 対象期間
					$("#ca_ymd").text(clutil.formatDate(getReq.targetDate, "yyyy/mm/dd(w)"));
					// 店舗
					$("#ca_store").text(getReq.storeCode + ":" + getReq.storeName);
					// 補正業者
					$("#ca_vendor").text(getReq.vendorCode + ":" + getReq.vendorName);

					_this.resultList = getRsp.adjustDataList;
					// 補正なしチェック
					if (getRsp.adjustDataList.length == 1 && getRsp.adjustDataList[0].adjustItemID < 0) {
						$("#ca_noAdjustChk").checkbox('check');
					} else {
						$("#ca_noAdjustChk").checkbox('uncheck');
					}

					// 補正項目リスト
					_this.adjustItemList = getRsp.adjustItemList;	// 補正項目リスト(autocompleteで使用)
					_this.adjustItemList2 = [];
					$.each(_this.adjustItemList, function() {
						var adustItem = {
								label:	this.adjustItemCode + ":" + this.adjustItemName,
								value:	this.adjustItemCode + ":" + this.adjustItemName,
								id:		this.adjustItemID,
								code:	this.adjustItemCode,
								name:	this.adjustItemName,
								price:	this.price,
						};
						_this.adjustItemList2.push(adustItem);
					});

					$.each(_this.resultList, function(index) {
						this.no = index+1;
						for (var i = 0; i < _this.adjustItemList; i++) {
							var item = _this.adjustItemList[i];
							if (this.adjustItemID == item.adjustItemID) {
								this.adjustItemCode = item.adjustItemCode;
								this.adjustItemName = item.adjustItemName;
								break;
							}
						}
					});

					// 明細部
					if (_this.resultList.length > 1) {
						$tbody_tmpl = this.$("#ca_table_tbody_template");
						$tbody_tmpl.tmpl(_this.resultList).appendTo("#ca_table_body");

						// オートコンプリート設定
						$("#ca_table_body").find('input.ca_adjust_item_info').autocomplete({
							source:_this.adjustItemList2,
							change: function(event, ui) {
								var tr = $(event.target).parents('tr');
								$(event.target).attr('cs_id', ui.item.id);
								$(event.target).attr('cs_price', ui.item.price);
								_this.changeAdjustAm($(tr), event);

								// 選択したものが「その他」の場合は件数を入力不可にする TODO
							},
						});


					}

					$('#ca_entry').removeAttr('disabled');
					$('#ca_confirmed').hide();

					if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD) {
						var mydata = this.chkData[this.chkDataIndex];
						var olddata = mydata.savedata;
						if (olddata != null) {
							var newdata = getRsp.adjustItem;
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

					// イベントを追加
					_this.addEvents();
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

		_addEvents: function() {
			var _this = this;
			// nAdjustのキー押下イベントを監視する
			$(".ca_nadjust_info").on('keyup keydown', _.debounce(function(e) {
				var tr = $(e.target).parents('tr');
				_this.changeAdjustAm($(tr), e);
			}, 300));
			$(".ca_nadjust_info").change(function(e) {
				var tr = $(e.target).parents('tr');
				_this.changeAdjustAm($(tr), e);
			});
			// 行削除クリックイベント
			("#.btn-delete").click(function(e) {
				var tr = $(e.target).parents('tr');
				_this.deleteRow($(tr), e);
			});
		},

		/**
		 * 行削除
		 * @param $tr
		 * @param e
		 */
		deleteRow: function($tr, e) {
			console.log($tr);

			var no = Number($tr.attr('name'));
			_this.resultList.splice(no-1, 1);	// 配列から削除

			$tr.remove();						// 行を削除

			// noの再割当て
			for (var i = 0; i < _this.resultList.length; i++) {
				_this.resultList[i].no = i+1;
			}
			$("#ca_table_tbody tr").each(function(i) {
				$(this).attr("name", i+1);
			});
		},

	    /**
	     * 数値取得
	     */
	    getNum : function(value) {
	      if (isNaN(value)) {
	        return 0.00;
	      } else {
	        return value;
	      }
	    },

		/**
		 * 補正、数量変更イベント
		 */
		changeAdjustAm: function($tr, e) {
			var _this = this;
			// 補正
			var target = $tr.find("input.ca_adjust_item_info");
			console.log($tr);
			console.log($(target));

			var no = Number($tr.attr('name'));

			// 単価
			var price = _this.getNum(Number($(target).attr("price")));
			console.log("no:" + no);
			_this.resultList[no-1].price = price;

			// 数量
			target = $tr.find("input.ca_nadjust_info");
			console.log($(target));
			var nAdjust = _this.getNum(Number($(target).val()));
			_this.resultList[no-1].nAdjust = nAdjust;
			// 金額（税抜）
			var adjustAm = price * nAdjust;
			_this.resultList[no-1].adjustAm = adjustAm;
			$tr.find("td[name:adjustAm]").text(clutil.comma(adjustAm));
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

	ca_editView = new ARMSV0080View();
	ca_editView.render();

	////////////////////////////////////////////////

	// 初期データを取る
	clutil.getIniJSON(null, null, _.bind(function(data, dataType) {
		// 画面初期化
		ca_editView.initUIelement();

		// 一覧からの引数を取得
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
			ca_editView.chkDataIndex = args.chkDataIndex == null ? 0 : args.chkDataIndex;
			// データを取得して画面に表示する
			ca_editView.showChkData();
		}

		$('body').show();

		var caption = '';
		switch (ca_editView.ope_mode) {
		case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			caption = '新規登録';
			break;
		case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
			caption = '編集';
			break;
		case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
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