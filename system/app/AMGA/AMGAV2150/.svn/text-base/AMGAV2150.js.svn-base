$(function(){

	// 黒帯ヘッダの「＜」戻るボタン戻り先設定
	if(clcom.pageArgs && clcom.pageArgs.homeUrl){
		clcom.homeUrl = clcom.pageArgs.homeUrl;
	}
	if(clcom.pageData && clcom.pageData.homeUrl){
		clcom.homeUrl = clcom.pageData.homeUrl;
	}

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		// 要素
		el						: $('#ca_main'),

		validator: null,

		// Eventes
		events: {
			"change #ca_outputTarget"	:	"_changeOutputTarget",		// 「出力対象」変更
			"click #ca_out"				:	"_onOutClick",				// 「帳票出力」ボタン押下
		},

		initialize: function() {
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validatorWithTicker(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {

			// 出力対象
			this.outputTargetList = [
				{ id:amcm_type.AMCM_VAL_ANAKIND_SALEREPORT1, name:'売上配信自動化 ゾーン別実績', },
				{ id:amcm_type.AMCM_VAL_ANAKIND_SALEREPORT2, name:'売上配信自動化 週累計', },
				{ id:amcm_type.AMCM_VAL_ANAKIND_SALEREPORT3, name:'売上配信自動化(売上予測) 本日予測', },
				{ id:amcm_type.AMCM_VAL_ANAKIND_SALEREPORT4, name:'売上配信自動化(売上予測) 売上予測ダウンロード', },
				{ id:amcm_type.AMCM_VAL_ANAKIND_SALEREPORT5, name:'売上配信自動化 個店配信', },
			];
			clutil.initcltypeselector2(
				$('#ca_outputTarget'),
				this.outputTargetList,
				0,
				1,
				'id',
				'name',
				'',
				{id : "ca_outputTarget", name : "info"},
				"mbn wt280 flleft"
			);

			// 対象日
			clutil.datepicker($("#ca_ymd"), null, clcom.getOpeDate());

			// 対象時間
			this.to_HHMMList = [
				{ id:-1,  name:'&nbsp', },
				{ id:0,   name:'0:00', },
				{ id:100, name:'1:00', },
				{ id:200, name:'2:00', },
				{ id:300, name:'3:00', },
				{ id:400, name:'4:00', },
				{ id:500, name:'5:00', },
				{ id:600, name:'6:00', },
				{ id:700, name:'7:00', },
				{ id:800, name:'8:00', },
				{ id:900, name:'9:00', },
				{ id:1000, name:'10:00', },
				{ id:1100, name:'11:00', },
				{ id:1200, name:'12:00', },
				{ id:1300, name:'13:00', },
				{ id:1400, name:'14:00', },
				{ id:1500, name:'15:00', },
				{ id:1600, name:'16:00', },
				{ id:1700, name:'17:00', },
				{ id:1800, name:'18:00', },
				{ id:1900, name:'19:00', },
				{ id:2000, name:'20:00', },
				{ id:2100, name:'21:00', },
				{ id:2200, name:'22:00', },
				{ id:2300, name:'23:00', },
			];
			clutil.initcltypeselector2(
				$('#ca_to_HHMM'),
				this.to_HHMMList,
				0,					// 未選択有無(0:なし 1:あり)
				1,
				'id',
				'name',
				'',
				{id : "ca_to_HHMM", name : "info"},
				""
			);
		},

		/**
		 * 画面描写
		 */
		render: function() {
			return this;
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus($('#ca_outputTarget'));
		},

		/**
		 * 帳票出力ボタン click
		 */
		_onOutClick: function(e) {
			if(!this.validator.valid()){
				return;
			}

			var req = this._buildAnaReq();

			var uri =  'AMGAV2150';
			var deferd = clutil.postAnaJSON(uri, req, function(data){
				console.log(data);
			});
			deferd.done(_.bind(function(data){
				if(_.isEmpty(data.url)){
					console.warn('DL 先の url が無い！');
					this.validator.setErrorInfo({_eb_: clmsg.cl_no_data});
				}else{
					clutil.download(data.url);
				}
			}, this));
			deferd.fail(_.bind(function(data){
				// clutil.postAnaJSON の内部の作りから、data.head.status を見て
				// STATUS_OK 以外の場合のみ、fail が呼ばれる。
				if(_.isObject(data.head) && _.isNumber(data.head.status)
						&& data.head.status !== am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK){
					console.log("anaProc.doEXCELDL(), status[ " + data.head.status + '] failed[' + data.head.message + '] ###');
					this.validator.setErrorInfo({_eb_:clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}
			}, this));
		},

		/**
		 * リクエストを生成する。
		 */
		_buildAnaReq: function() {
			var cond = clutil.view2data($('#ca_searchArea'));

			var req = {

//				// リクエスト共通ヘッダ
//				head: {
//					opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_PDF,
//				},
//
//				// 処理区分
//				operation : amanp_AnaDefs.AMAN_DEFS_ANA_OPERATION_EXCELDL,

				// 分析系リクエスト
				anaHead: {
					anakind : Number(cond.outputTarget),
				},
				anaPeriod: [
					{
						type   : amanp_AnaPeriod.AMANP_ANA_PERIOD_TYPE_YMD,
						p_from : cond.ymd,
						p_to   : cond.ymd,
					},
				],
				anaFocus: [
					{
						kind : amanp_AnaDefs.AMAN_DEFS_KIND_TIMEPERIOD,
						val  : 0,
						val2 : Number(cond.to_HHMM),
					},
				],
			};
			return req;
		},

		/**
		 * 「出力対象」変更処理
		 * 　出力対象が以下の場合、対象時刻を15:00 に固定する
		 * 　　売上配信自動化(売上予測) 本日予測
		 * 　　売上配信自動化(売上予測) 売上予測ダウンロード
		 */
		_changeOutputTarget: function(e) {

			var obj = clutil.view2data($('#ca_outputTarget'));
			var outputTarget = Number(obj.outputTarget);

			if (outputTarget === amcm_type.AMCM_VAL_ANAKIND_SALEREPORT3 ||
					outputTarget === amcm_type.AMCM_VAL_ANAKIND_SALEREPORT4) {
				// 対象時間を15:00 にして固定する
				var time = { to_HHMM : 1500 };
				clutil.data2view($('#ca_to_HHMM'), time);
				clutil.viewReadonly($('#ca_to_HHMM'));

			} else {
				// それ以外は固定を解除
				clutil.viewRemoveReadonly($('#ca_to_HHMM'));
				// 時刻指定をクリア
				var time = { to_HHMM : -1 };
				clutil.data2view($('#ca_to_HHMM'), time);
			}
		},
	});

	mainView = new MainView();
	mainView.render();

	// 初期データを取る
	clutil.getIniJSON(null, null, _.bind(function(data, dataType) {
		//////////////////////////////////////////////
		// ヘッダー部品
		headerView = new HeaderView();
		headerView.render(function(){
			// 区分selectorを初期化する
			mainView.initUIelement();
			mainView.setFocus();
		});
		//////////////////////////////////////////////
	},this)).done(function(){
	});
});
