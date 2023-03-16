// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var AMIGV0040View = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

//		validator : null,

		// Events
		events : {
			"change #ca_srchYear"	:	"_onYearChange",
		},

		initialize: function() {
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '店舗別週別不良品金額推移出力',
				btn_submit: false
			});

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();

			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback')
			});

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function() {
			this.mdBaseView.initUIElement();
//			clutil.inputlimiter(this.$el);

			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);
			// 年selector
			clutil.clyearselector(this.$("#ca_srchYear"), 0, 10, 0, "年度");
			// 週オートコンプリート
			this.fromYearWeek = clutil.clyearweekcode({
				el: '#ca_srchFromWeek',
				initValue: AMIGV0040View.yyyywwData
			});
			this.toYearWeek = clutil.clyearweekcode({
				el: '#ca_srchToWeek',
				initValue: AMIGV0040View.yyyywwData
			});

			// 初期値設定
			if (clcom.userInfo && clcom.userInfo.unit_id) {
				this.$("#ca_srchUnitID").selectpicker('val', clcom.userInfo.unit_id);
			}
			var ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');
			this.$("#ca_srchYear").selectpicker('val', ope_year);

			clutil.initUIelement(this.$el);

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			return this;
		},

		weekselector : function($select1, $select2, year) {
			var html_source = '';
			var initVal = 0;
			var f_select = false;

			var cnt = 1;
			var maxdays = 365;
			if ((year+1 % 4 == 0 && year+1 % 100 != 0) || year+1 % 400 == 0) {
				maxdays = 366;
			}
			var date = this.getWhatDayOfWeek(year, 4, 1, 0);
			var month = date.getMonth() + 1;
			var day = date.getDate();
			html_source += '<option value=' + cnt + '>' +
			this.twodigit(cnt) + "週(" + date.getFullYear()  + "/" + this.twodigit(date.getMonth() + 1) + "/" + this.twodigit(date.getDate()) + ")" + '</option>';
			var ymd = Number(date.getFullYear() + this.twodigit(date.getMonth() + 1) + this.twodigit(date.getDate()));
			var today = clcom.getOpeDate();
			if (ymd == today) {
				initVal = cnt;
				f_select = true;
			}
			cnt++;
			var addDays = 7;
			for (; addDays + 1 < maxdays;) {
				date = this.computeDate(year, month, day, addDays);
				html_source += '<option value=' + cnt + '>' +
				this.twodigit(cnt) + "週(" + date.getFullYear()  + "/" + this.twodigit(date.getMonth() + 1) + "/" + this.twodigit(date.getDate()) + ")" + '</option>';
				addDays += 7;
				ymd = Number(date.getFullYear() + this.twodigit(date.getMonth() + 1) + this.twodigit(date.getDate()));
				if (!f_select && today <= ymd) {
					initVal = cnt-1;
					f_select = true;
				}
				cnt++;
			}

			$select1.html('');
			$select2.html('');
			$select1.html(html_source);
			$select2.html(html_source);
			$select1.selectpicker('val', initVal);
			$select2.selectpicker('val', initVal);
		},

		/**
		 * 任意の年月の第n曜日の日付を求める関数
		 * year 年
		 * month 月
		 * number 何番目の曜日か、第1曜日なら1。第3曜日なら3
		 * dayOfWeek 求めたい曜日。0〜6までの数字で曜日の日〜土を指定する
		 */
		getWhatDayOfWeek : function(year, month, number, dayOfWeek) {
			var firstDt = new Date(year, month - 1, 1);
			var firstDayOfWeek = firstDt.getDay();	// 指定した年月の1日の曜日を取得
			var day = dayOfWeek - firstDayOfWeek + 1;
			if (day <= 0) day += 7;	// 1週間を足す
			if (!this.checkDate(year, month, day)) {
				return "";
			}
			var dt = new Date(year, month - 1, day);
			var msTime = dt.getTime();
			msTime += (86400000 * 7 * (number - 1)); // n曜日まで1週間を足し込み
			dt.setTime(msTime);
			if (dt.getMonth() + 1 != month) {
				return "";
			}
			return dt;
		},

		computeDate : function (year, month, day, addDays) {
		    var dt = new Date(year, month - 1, day);
		    var baseSec = dt.getTime();
		    var addSec = addDays * 86400000;	// 日数 * 1日のミリ秒数
		    var targetSec = baseSec + addSec;
		    dt.setTime(targetSec);
		    return dt;
		},

		checkDate : function(year, month, day) {
		    var dt = new Date(year, month - 1, day);
		    if(dt.getFullYear() != year)
		        dt.setFullYear(year);//ここで設定し直している
		    if(dt == null || dt.getFullYear() != year || dt.getMonth() + 1 != month || dt.getDate() != day) {
		        return false;
		    }
		    return true;
		},

		buildReq: function(rtyp){
			var f_error = false;
			// validation
			if (!this.validator.valid()) {
				f_error = true;
			}

			// リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));

			// エラーチェック
			var errInfo = {};
			// 反転チェック
			
			srchDto.srchFromWeek = Number(srchDto.srchFromWeek.toString());
			srchDto.srchToWeek = Number(srchDto.srchToWeek.toString());
			if (srchDto.srchToWeek < srchDto.srchFromWeek) {
				errInfo['ca_srchFromWeek'] = clmsg.cl_fromto_error;
				errInfo['ca_srchToWeek'] = clmsg.cl_fromto_error;
				this.validator.setErrorInfo(errInfo);
				f_error = true;
			}
			if (f_error) {
				return null;
			}

			var reqDto = {
				reqHead: {
					opeTypeId: rtyp
				},
				reqPage: {
				},
				AMIGV0040GetReq: srchDto
			};

			return reqDto;
		},

		/**
		 * 数値を2桁文字列に変換
		 * @param obj
		 * @returns obj
		 */
		twodigit : function(obj) {
			if (obj < 10) {
			  obj = '0' + obj;
			}
			return obj;
		},

		/**
		 * 初期フォーカス
		 */
		setFocus: function(){
			// 初期フォーカスをセット
			var $tgt = null;
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				$tgt = $("#ca_srchYear");
			}
			else{
				$tgt = $("#ca_srchUnitID");
			}
			clutil.setFocus($tgt);
		},

		/**
		 * 年度selector変更時
		 */
		_onYearChange: function(e) {
			this.fromYearWeek.setValue("");
			this.toYearWeek.setValue("");
		},

		/**
		 * 出力ボタンのアクション
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				console.log('CSV 出力');
				this.doDownload(rtyp);
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		doDownload: function(rtyp){
			// リクエストをつくる
			var srchReq = this.buildReq(rtyp);
			if(_.isNull(srchReq)){
				return;
			}

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMIGV0040', srchReq);
			defer.fail(_.bind(function(data){
				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		}

	});

	// 初期データ取得
	clutil.getIniJSON()
	.then(function(){
		// 年週部品の初期値を運用日から取得する
		return clutil.ymd2week(clcom.getOpeDate())
		.done(function(data){
			// MainViewに年週部品の初期値を設定する
			AMIGV0040View.yyyywwData = data;
		});
	})
	.done(function(){
		var view = AMIGV0040View.view = new AMIGV0040View();
		view.initUIElement();
		view.render();
		view.setFocus();
	})
	.fail(function(data){
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});
