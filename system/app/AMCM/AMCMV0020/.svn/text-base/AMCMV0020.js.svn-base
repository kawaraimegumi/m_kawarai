/**
 * パスワード変更
 */
$(function(){

	//字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),

		events: {
		},

		/**
		 * initialize関数
		 */
		initialize: function(opt){

			_.bindAll(this);

			// 現パスワードのフィールドカウント
			clutil.cltxtFieldLimit($("#ca_password"));

			// 新パスワードのフィールドカウント
			clutil.cltxtFieldLimit($("#ca_newPassword"));

			// 新パスワード(再入力)のフィールドカウント
			clutil.cltxtFieldLimit($("#ca_retypePassword"));

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({

				opeTypeId: [
					{
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
						label: '決定'
					}
				],

				title: 'パスワード変更',
				subtitle: '',
				btn_submit: true,
				btn_cancel:{label:'キャンセル'},
				btn_new: false,
				btn_csv: false

			});

			// 外部イベントの購読設定
			clutil.mediator.on('onOperation', this._doOpeAction);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback').hide()
			});

			// ツールチップ表示
			$("#ca_tp_code1").tooltip({html: true});
			$("#ca_tp_code2").tooltip({html: true});
			$("#ca_tp_code3").tooltip({html: true});
		},

		/**
		 * 初期データ取得後に呼ばれる関数
		 */
		initUIElement: function(){

			this.mdBaseView.initUIElement();

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			this.$('input').first().focus();
			return this;
		},

		/**
		 * _doOpeAction関数
		 */
		_doOpeAction: function(rtyp, pgIndex/*一覧画面では使用しない*/, e){

			var req = this._buildSubmitReqFunction(rtyp);
			if(req == null){
				return;
			}

			clutil.postJSON(req.resId, req.data).done(_.bind(function(data){

				if(data.head.status !== 0) {

					// 更新結果のステータス＝１（パスワード不正）の場合
					// ECM0003: 入力した現パスワードがDBに登録されているパスワードと一致しない
					this.validator.setErrorMsg(this.$('#ca_password'), clutil.getclmsg(clmsg.ECM0003));
					clutil.mediator.trigger('onTicker', clutil.getclmsg(clmsg.cl_echoback));

				}else {

					// パスワード更新成功
					this.mdBaseView.showRibbon('決定済');
					this.mdBaseView.setSubmitEnable(false);		// 更新ボタン非活性化

					// View の入力を不可にする。
					clutil.viewReadonly(this.$('#ca_passwdInfoArea'));
				}

			},this)).fail(_.bind(function(data){

				// パスワード更新失敗
				var hd = data.head;
				clutil.mediator.trigger('onTicker', hd);
				if(!_.isEmpty(hd.fieldMessages)){
					this.validator.setErrorInfoFromSrv(hd.fieldMessages, {prefix: 'ca_'});
				}
			},this));
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(inputDto){

			var flag = true;

			// 必須項目の未入力エラー確認
			if(!this.validator.valid()){
				flag = false;
			}

			// ミックスチェック関数
			var mixCheck = function(val){
				var regex_alpha = /[a-zA-Z]/;
				var regex_num = /[0-9]/;
				return (regex_alpha.test(val) && regex_num.test(val));
			};

			if(!this.$('#ca_newPassword').hasClass('cl_error_field')){

				if(inputDto.password == inputDto.newPassword){

					// 現パスワードと新パスワードに同じ値が入力されている
					// ECM0004: "旧パスワードと異なるパスワードを入力してください。"
					this.validator.setErrorMsg(this.$('#ca_newPassword'), clutil.getclmsg(clmsg.ECM0004));
					flag = false;
				}
				if(!mixCheck(inputDto.newPassword)){

					// ECM0012: "英字のみ・数字のみのパスワードは不可です。英数字が混在したパスワードを入力してください。"
					this.validator.setErrorMsg(this.$('#ca_newPassword'), clutil.getclmsg(clmsg.ECM0012));
					flag = false;
				}
				if(!mixCheck(inputDto.retypePassword)){

					// ECM0012: "英字のみ・数字のみのパスワードは不可です。英数字が混在したパスワードを入力してください。"
					this.validator.setErrorMsg(this.$('#ca_retypePassword'), clutil.getclmsg(clmsg.ECM0012));
					flag = false;

				} else if(inputDto.newPassword != inputDto.retypePassword) {
					// 新パスワードと新パスワード（再入力）に異なる値が入力されている
					// ECM0005: "新パスワードを再度入力してください。",
					this.validator.setErrorMsg(this.$('#ca_retypePassword'), clutil.getclmsg(clmsg.ECM0005));
					flag = false;
				}
			}

			return flag;
		},

		/**
		 * 決定ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId){

			var isValid = true;

			// 必須項目の未入力エラー確認
			if(!this.validator.valid()){

				isValid = false;

			} else {

				var inputDto = clutil.view2data(this.$('#ca_passwdInfoArea'));

				isValid = this.isValid(inputDto);
			}

			// エラーチェック
			if(isValid == false){

				clutil.mediator.trigger('onTicker', clutil.getclmsg(clmsg.cl_echoback));
				this.$('#ca_passwdInfoArea').find('.cl_error_field').first().focus();	// 最初のエラーフィールドへフォーカス

				return null;
			}

			/*var reqObj = _.extend({
				head: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
				},
				user_id: clcom.userInfo.user_id
			}, inputDto);*/

			var reqObj = {
				head: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD
				},
				user_id: clcom.userInfo.user_id,
				oldpassword: inputDto.password,
				newpassword: inputDto.newPassword
			};

			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		_eof: 'AMCMV0020.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON().done(function(data){
		mainView = new MainView(clcom.pageArgs).initUIElement().render();

	}).fail(function(data){
		// clcom のネタ取得に失敗。
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});
