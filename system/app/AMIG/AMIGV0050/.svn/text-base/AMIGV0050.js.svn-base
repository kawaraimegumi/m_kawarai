// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function() {

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var AMIGV0050View = Backbone.View.extend({
		// 要素
		el					:$("#ca_main"),

		validator : null,

		// Events
		events : {
			
		},

		initialize: function() {
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '店舗別不良品件数・金額出力',
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
			var _this = this;
			this.mdBaseView.initUIElement();

			this.$el.delegate(':radio[name=srchType]', 'toggle', function (ev) {
				_this.onRadioClick($(this).val());
			});
			
			
			//var initMonth = Math.floor(clcom.getOpeDate() / 100);
			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_srchUnitID'), 1);
			// 月オートコンプ
			this.fromYearMonth = clutil.clyearmonthcode({
				el:"#ca_srchMonth"
				//initValue: initMonth
			});
			// 週オートコンプリート
			this.fromYearWeek = clutil.clyearweekcode({
				el: '#ca_srchFromWeek',
				initValue: AMIGV0050View.yyyywwData
			});
			this.toYearWeek = clutil.clyearweekcode({
				el: '#ca_srchToWeek',
				initValue: AMIGV0050View.yyyywwData
			});

			// 初期値設定
			if (clcom.userInfo && clcom.userInfo.unit_id) {
				this.$("#ca_srchUnitID").selectpicker('val', clcom.userInfo.unit_id);
			}

			clutil.initUIelement(this.$el);

			this.onRadioClick(1);

			return this;
		},

		/**
		 * 検索リクエストパケットの設定値を UI へセットする。
		 */
		deserialize: function(obj){
			this.deserializing = true;
			try{
				var dto = _.extend({}, obj);
				clutil.data2view(this.$el, dto);
			}finally{
				this.deserializing = false;
			}
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			return this;
		},

		weekselector : function($select, year) {
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

			$select.html('');
			$select.html(html_source);
			$select.selectpicker('val', initVal);
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

		/**
		 * ラジオボタン click
		 */
		onRadioClick : function(type) {
			this.srchType = type;
			
			var initMonth = Math.floor(clcom.getOpeDate() / 100);
			var setMonth = {};
			var setWeekSt = {};
			var setWeekEd = {};
			
			if (type == 1) {
				// 週
				$("#ca_p_week").addClass("required");
				$("#ca_srchFromWeek").addClass("cl_required");
				$("#ca_srchToWeek").addClass("cl_required");
				$("#ca_p_month").removeClass("required");
				$("#ca_srchMonth").removeClass("cl_required");
				clutil.viewRemoveReadonly($("#from_week"));
				clutil.viewRemoveReadonly($("#to_week"));
				clutil.viewReadonly($("#month"));
				
				//ラジオボタンで初期値入れ替え
				setWeekSt = {
						srchFromWeek: AMIGV0050View.yyyywwData
				};
				setWeekEd = {
						srchToWeek: AMIGV0050View.yyyywwData
				};
				setMonth = {
						srchMonth: 0
				};
			} else {
				// 月
				$("#ca_p_week").removeClass("required");
				$("#ca_srchFromWeek").removeClass("cl_required");
				$("#ca_srchToWeek").removeClass("cl_required");
				$("#ca_p_month").addClass("required");
				$("#ca_srchMonth").addClass("cl_required");
				clutil.viewReadonly($("#from_week"));
				clutil.viewReadonly($("#to_week"));
				clutil.viewRemoveReadonly($("#month"));
				
				//ラジオボタンで初期値入れ替え
				setWeekSt = {
						srchFromWeek: 0
				};
				setWeekEd = {
						srchToWeek: 0
				};
				setMonth = {
						srchMonth: initMonth
				};
			}
			clutil.data2view(this.$("#ca_p_week"), setWeekSt);
			clutil.data2view(this.$("#ca_pEd_week"), setWeekEd);
			clutil.data2view(this.$("#ca_p_month"), setMonth);
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

		buildReq: function(rtyp){
			var f_error = false;
			// validation
			if (!this.validator.valid()) {
				f_error = true;
			}

			// リクエストの内容をセットする
			var srchDto = clutil.view2data(this.$("#ca_searchArea"));

			// エラーチェック
			if (this.srchType == 1) {
				var errInfo = {};
				//年度
				srchDto.srchFromYear = Number(srchDto.srchFromWeek.toString().substring(0, 4));
				srchDto.srchToYear = Number(srchDto.srchToWeek.toString().substring(0, 4));
				//週
				srchDto.srchFromWeek = Number(srchDto.srchFromWeek.toString().substring(4, 6));
				srchDto.srchToWeek = Number(srchDto.srchToWeek.toString().substring(4, 6));
				
				if (srchDto.srchFromYear != srchDto.srchToYear) {
					//年度チェック
					errInfo['ca_srchFromWeek'] = clutil.fmtargs(clmsg.cl_its_required, ["同じ年度内の週"]);
					errInfo['ca_srchToWeek'] = clutil.fmtargs(clmsg.cl_its_required, ["同じ年度内の週"]);
					this.validator.setErrorInfo(errInfo);
					f_error = true;
				}
				else if (srchDto.srchToWeek < srchDto.srchFromWeek) {
					// 反転チェック
					errInfo['ca_srchFromWeek'] = clmsg.cl_fromto_error;
					errInfo['ca_srchToWeek'] = clmsg.cl_fromto_error;
					this.validator.setErrorInfo(errInfo);
					f_error = true;
				}
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
				AMIGV0050GetReq: srchDto
			};

			return reqDto;
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
			var defer = clutil.postDLJSON('AMIGV0050', srchReq);
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
			AMIGV0050View.yyyywwData = data;
		});
	})
	.done(function(){
		var view = AMIGV0050View.view = new AMIGV0050View();
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
