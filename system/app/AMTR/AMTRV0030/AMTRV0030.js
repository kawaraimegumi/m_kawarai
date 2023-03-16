
$(function() {



	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			"click .cl_download" : "_onCSVClick"							//CSV出力押下
		},


		/**
		 * ダウンロードする
		 */
		_onCSVClick: function(){
			// リクエストをつくる
			var srchReq = this.buildReq();
			if(_.isNull(srchReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMTRV0030', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '移動依頼対応',
				subtitle: '状況確認',
				btn_new: false,
				btn_submit: true,
				btn_csv: true
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			
			// カレンダー
			clutil.datepicker($('#ca_releaseDate'));
			clutil.datepicker($('#ca_limitDate'));
			clutil.datepicker($('#ca_alarmDate'));
			
			clutil.viewReadonly($('#ca_srchArea'));

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			return this;
		},

		/**
		 * 初期表示通信
		 */
		getTree: function(args){
			//依頼ID
			var id = args[0].id;

			var getReq = {
					// 共通ヘッダ
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					pageReq: {
					},
					// 取引先マスタ検索リクエスト
					AMTRV0030GetReq: {
						srchTransferID: id				// 依頼ID
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMTRV0030UpdReq: {
					}
			};

			var defer = clutil.postJSON('AMTRV0030', getReq).done(_.bind(function(data){
				//移動依頼レコードリスト
				var recs = data.AMTRV0030GetRsp.transferList;
				//input内項目設定
				var setData = data.AMTRV0030GetRsp.transferInfo;
				setData.srchTransferID = id;

				clutil.data2view($("#ca_srchArea"),setData);

				//品種
				var itgrp = setData.itgrpCode + ":" + setData.itgrpName;
				$("#ca_itgrp").val(itgrp);

				//商品部依頼
				if(setData.transTypeID == amcm_type.AMCM_VAL_TRANS_INSTRUCT_TYPE_ITEM_DEP){
					$("#ca_transTypeID").val("商品部依頼");
				}
				else{
					$("#ca_transTypeID").val("要望対応");
				}
				
				var toDay = clcom.getOpeDate();
				var releaseDay = setData.releaseDate;
				
				if(toDay < releaseDay){
					//店舗出力日より前ならエラー
					clutil.mediator.trigger('onTicker', clmsg.EGM0049);
					return;
				}
				

				if(_.isEmpty(recs)){
					// ヘッダにエラーメッセージを表示：「検索結果は0件です。」
					clutil.mediator.trigger('onTicker', clmsg.EGM0049);
					return;
				}
				else {
					var source = this.maketree(recs);

					//ソースを読み込む
					this.$('#ca_tree').html('');
					this.$('#ca_tree').html(source);

					clutil.initUIelement(this.$('.ca_tbl'));
				}

			}, this)).fail(_.bind(function(data){
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
			}, this));
			return defer;
		},

		/**
		 * ツリーのソース生成
		 */
		maketree: function(recs){
			//行配列の長さをとる
			var rec_num = recs.length;
			var i = 0;
			var source = "";

			for(i = 0; i < rec_num; i++){
				var line = this.makeLine(recs[i]);
				source = source + line;
			}

			return source;
		},

		/**
		 * 各行作成
		 */
		makeLine: function(data){
			var source = "";

			source += "<tr><td>" + data.outStoreCode + ":" + data.outStoreName + "</td>";
			source += "<td>" + data.inStoreCode + ":" + data.inStoreName + "</td>";
			source += "<td class='txtar'>" + data.transQy + "</td>";
			source += "<td class='txtar'>" + data.resultQy + "</td>";

			if(data.transStatusTypeID == amcm_type.AMCM_VAL_TRANS_RESPONSE_NOT_SHIP){
				source += "<td class='errorCell'>未出荷</td></th>";
			}
			else if(data.transStatusTypeID == amcm_type.AMCM_VAL_TRANS_RESPONSE_SHIPPED){
				source += "<td class='alertCell'>出荷済</td></th>";
			}
			else {
				source += "<td>入荷済</td></th>";
			}

			return source;
		},




		buildReq: function(rtyp){
			//リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_srchArea"));
			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
					start_record: 0,
					page_size: 0
				},
				AMTRV0030GetReq: srchDto
			};
			return reqDto;
		}

	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

		if(clcom.pageArgs != null && args != ""){
			var args = clcom.pageArgs.chkData;
			//ツリーテーブル作成
			mainView.getTree(args);
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


});