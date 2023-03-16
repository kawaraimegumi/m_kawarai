// セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)
useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	clutil.enterFocusMode($('body'));

	var EditView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
			"click #ca_btn_org_select" : "_onOrgSelClick",
			"click #ca_btn_store_select" : "_onStoreSelClick",			/* 担当組織 */
			"click [name='ca_btn_org_delete']" : "_onOrgDelClick",
			"click [name='ca_btn_store_delete']" : "_onStoreDelClick",	/* 担当組織 */
			"click #ca_table_role tbody span.btn-delete" : "onRoleRowDelClick",
			"click #ca_table_role tfoot tr" : "onRoleRowAddClick",
			"change #ca_userTypeID" : "onUserTypeStateChange",
		},

		/**
		 * opt : clcom.pageArgs
		 */
		initialize: function(opt){

			_.bindAll(this);

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: 'ユーザ',
					opeTypeId: o.opeTypeId == -1 ? am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD : o.opeTypeId, // 初期化:-1でくる
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// *アプリ個別の View や部品をインスタンス化するとか・・・*

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// 店舗ユーザも扱うので表示制限外す
//			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
//					|| this.options.opeTypeId == -1){
//				this.$("#ca_userCode").removeAttr("data-limit").removeAttr("data-validator");
//			}
			if(this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				this.$("#ca_userCode").removeAttr("data-tflimit").removeAttr("data-validator");
			}
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			clutil.datepicker(this.$("#ca_fromDate")).datepicker("setIymd", clcom.getOpeDate() /*+ 1*/);
			clutil.datepicker(this.$("#ca_toDate")).datepicker("setIymd", clcom.max_date);

			// Fieldlimit
			clutil.cltxtFieldLimit(this.$("#ca_userCode"));
			clutil.cltxtFieldLimit(this.$("#ca_userName"));
			clutil.cltxtFieldLimit(this.$("#ca_userNameKana"));
			clutil.cltxtFieldLimit(this.$("#ca_passwd"));
			clutil.cltxtFieldLimit(this.$("#ca_userMailAddr"));

			this.ORG_MAX = clutil.getclsysparam("PAR_AMCM_ORG_MAX",10);
			this.ROLE_MAX = clutil.getclsysparam("PAR_AMCM_ROLE_MAX", 10);

			//ユーザコード検索操作設定
			var vent = clutil.clstaffcode(this.$("#ca_userCode"),{keepCode:true});
			this.$("#ca_userCode").removeClass("cl_codeinput");
			vent.on("change",_.bind(function(item){
				var isStaff = this.$("#ca_userTypeID").val() == amcm_type.AMCM_VAL_USER_STAFF;
				var $userCode = this.$("#ca_userCode");
				var $staffID = this.$("#ca_staffID");
				var $staffOrgID = this.$("#ca_staffOrgID");
				$userCode.removeAttr("cs_id").removeData("cl_inputcode_item");//cl_store_item系としてview2dataされる狙い
				console.log("item:" + JSON.stringify(item));
				if(_.isEmpty(item)){
					$staffID.val("");
					$staffOrgID.val("").removeData("cl_store_item");
					//
            		var $store = this.$(".ca_store_select_field");
	                $store.addClass("required"); // 担当組織を必須に
					//
					return false;
				} else {
					//if(isStaff){
						$staffID.val(item.id);
					//}
				}
				if(_.isEmpty(item.org)){
					$staffOrgID.val("").removeData("cl_store_item");
					//
            		var $store = this.$(".ca_store_select_field");
	                $store.addClass("required"); // 担当組織を必須に
					//
				} else {
					$staffOrgID.val(item.org.code + ":" + item.org.name).data("cl_store_item",{
						id: item.org.id,
						name: item.org.name,
						code: item.org.code
					});
					//
					var $store = this.$(".ca_store_select_field");
					var state = Number(this.$("#ca_userTypeID").val());
					// 店長ユーザでなければ必須解除
					if( state != amcm_type.AMCM_VAL_USER_STORE_MAN){ // 店長ユーザ以外
                    	$store.removeClass("required");
                    	this.validator.clear();
                	}
					//
				}
				return false;
			}, this));
			// ユーザ区分取得
			clutil.cltypeselector(this.$("#ca_userTypeID"), amcm_type.AMCM_TYPE_USER);

			// ツールチップ
			$("#ca_tp_code1").tooltip({html: true});
			$("#ca_tp_code2").tooltip({html: true});

			return this;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			// 組織選択画面
			this.AMPAV0020Selector = new  AMPAV0020SelectorView({
				el : this.$('#ca_AMPAV0020_dialog'),		// 配置場所
				$parentView		: this.$('#mainColumn'),
				isAnalyse_mode	: false,					// 分析ユースかどうかフラグ？？？
//				ymd				: null,						// 検索日
				select_mode		: clutil.cl_single_select,	// 複数選択モード
				anaProc			: this.anaProc
			});
			this.AMPAV0020Selector.render();
			return this;
		},

		render : function(){
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			this.mdBaseView.fetch();	// データを GET してくる。
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				this.$("#ca_toDate").datepicker("setIymd", clcom.max_date);
				clutil.viewReadonly(this.$(".ca_toDate_div"));
				this.viewClear();
				this.$("#ca_fromDate").datepicker("setIymd", clcom.getOpeDate() /*+ 1*/);
				this.$("#ca_toDate").datepicker("setIymd", clcom.max_date);
				this.$("#ca_userTypeID").val(amcm_type.AMCM_VAL_USER_STAFF).attr("disabled", false); // 選択可能にする
				// TODO:店舗ユーザ消す
				this.$("#ca_userTypeID").find("option").each(function(){
					var value = Number($(this).attr("value"));
					if (value == amcm_type.AMCM_VAL_USER_STORE){
						$(this).remove();
					}
				});
				clutil.initUIelement(this.$el);
				clutil.setFocus(this.$("#ca_fromDate"));
			} else if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
				// 「適用期間」を「削除日」にする
				this.$("#ca_term_form").find('p.fieldName').text('削除日');
				this.$("#ca_term_form").find('.deldspn').hide();
				clutil.setFocus(this.$("#ca_fromDate"));

				this.$(".ca_fromDate_div").before('<p id="ca_tp_del"><span>?</span></p>');

				$("#ca_tp_del").addClass("txtInFieldUnit flright help").attr("data-original-title", "削除日以降、当ユーザーは無効扱いとなります").tooltip({html: true});
//			} else {
//				this.mdBaseView.fetch();	// データを GET してくる。
			}
			return this;
		},

		// エラー表示フィールドの訂正
		_chkfieldMessages : function(data){
			if(data && data.rspHead && data.rspHead.fieldMessages){
				var fm = data.rspHead.fieldMessages;
				$.each(fm, function(){
					switch(this.field_name){
					case "user.fromDate":
						this.field_name = "fromDate";
						break;
					case "user.toDate":
						this.field_name = "toDate";
						break;
					case "user.userCode":
						this.field_name = "userCode";
						break;
					case "user.userName":
						this.field_name = "userName";
						break;
					case "user.userTypeID":
						this.field_name = "userTypeID";
						break;
					case "user.userMailAddr":
						this.field_name = "userMailAddr";
						break;
					case "passwd.passwd":
						this.field_name = "passwd";
						break;
					case "staff.staffOrgID":
						this.field_name = "staffOrgID";
						break;
					default:
						break;
					}
				});
			}
			return;
		},
		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log(args);
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				document.location = '#';
//				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
//					// 更新した日付をchkdataに反映
//					this.options.chkData[args.index].fromDate = args.data.AMCMV0050GetRsp.user.fromDate;
//				}
				this.viewReadonly();
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				this.viewReadonly();
				break;
			case 'DELETED':		// 別のユーザによって削除された
				this.viewReadonly();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				this._chkfieldMessages(data);
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				clutil.mediator.trigger("onTicker",data);
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'OK':
				var getRsp = data.AMCMV0050GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp);
				var ope_date = clcom.getOpeDate();

				if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					this.$(".ca_passwd_field").remove();
					clutil.viewReadonly(this.$(".ca_toDate_div"));
//					this.$("#ca_userCode").attr("readonly", true);
					clutil.inputReadonly(this.$("#ca_userCode"));
					clutil.inputRemoveReadonly(this.$("#ca_userMailAddr"));
					if (getRsp.user.toDate == clcom.max_date){
						clutil.viewRemoveReadonly(this.$(".ca_fromDate_div"));
						if (getRsp.user.fromDate /*<=*/ < ope_date) {
							this.$("#ca_fromDate").datepicker("setIymd", ope_date /*+ 1*/);
						}
					} else {
						clutil.viewReadonly(this.$(".ca_fromDate_div"));
					}
					// 2016/3/30 ユーザ区分選択修正
					var userType = this.$("#ca_userTypeID").val();
					if(userType!=amcm_type.AMCM_VAL_USER_STORE && userType!=amcm_type.AMCM_VAL_USER_STORE_MAN){
						// 社員区分変更可能
						clutil.viewRemoveReadonly(this.$("#ca_userTypeIDArea"));
						// 店舗・店長ユーザ削除
						this.$("#ca_userTypeID").find("option").each(function(){
							var value = Number($(this).attr("value"));
							if (value == amcm_type.AMCM_VAL_USER_STORE || value == amcm_type.AMCM_VAL_USER_STORE_MAN){
								$(this).remove();
							}
						});
					}
					// 2016/3/30 ユーザ区分選択修正 ここまで
					clutil.setFocus(this.$("#ca_fromDate"));
				} else if (this.options.opeTypeId === -1){
					this.viewReadonly();
					var $pwInput = this.$("#ca_passwd");
					$pwInput.removeAttr("readonly");
					clutil.setFocus($pwInput);
				} else if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
					this.$(".ca_passwd_field").remove();
					this.viewReadonly();
				} else if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					this.$(".ca_passwd_field").remove();
					this.viewReadonly();
					clutil.viewRemoveReadonly(this.$(".ca_fromDate_div"));
					if (getRsp.user.fromDate /*<=*/ < ope_date) {
						this.$("#ca_fromDate").datepicker("setIymd", ope_date /*+ 1*/);
					}
				}
				break;
			case 'DONE':		// 確定済
				var getRsp = data.AMCMV0050GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp);
				this.viewReadonly();
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				var getRsp = data.AMCMV0050GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp);
				this.viewReadonly();
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				var getRsp = data.AMCMV0050GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this.data2view(getRsp);
				this.viewReadonly();
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				if(this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
						|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL
						|| this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
					// 照会モードは、Edit ブロッキングしておく。
					this.viewReadonly();
				} else if (this.options.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					this.viewReadonly();
				} else if (this.options.opeTypeId === -1){
					this.viewReadonly();
				}
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this._chkfieldMessages(data);
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				clutil.mediator.trigger("onTicker",data);
				break;
			}
//			clutil.cltxtFieldLimitReset(this.$("#ca_userCode"));
//			clutil.cltxtFieldLimitReset(this.$("#ca_userName"));
//			if(this.$("#ca_passwd").length > 0){
//				clutil.cltxtFieldLimitReset(this.$("#ca_passwd"));
//			}
//			clutil.cltxtFieldLimitReset(this.$("#ca_userMailAddr"));
		},

		/**
		 * view 初期化
		 * 項目全て初期化
		 * ・ユーザ区分は社員に設定
		 * ・権限の初期表示処理も追加
		 */
		viewClear : function(){
			clutil.viewClear(this.$(".ca_user_field, .termBox, .ca_staff_field, .ca_passwd_field"));
			this.$("#ca_userTypeID").val(amcm_type.AMCM_VAL_USER_STAFF).attr("disabled", true);
			this.$(".ca_org_selected_div").each(function(){
				if($(this).next().hasClass("next")){
					$(this).next().remove();
				}
			}).remove();
			this.$("#ca_tbody_role").find("tr").remove();
			this.$("#ca_staffOrgID").attr("readonly", true);
			this.$("#ca_role_template").tmpl({}).appendTo(this.$("#ca_tbody_role"));
			clutil.clrolecode({el:this.$("#ca_tbody_role").find("tr :last input")});
			this.$("#ca_table_role").find("tr").show();
			this._orgAddCtrl();
			this._roleAddCtrl();
			clutil.initUIelement(this.$el);
		},

		/**
		 * view Readonly
		 */
		viewReadonly : function(){
			clutil.viewReadonly(this.$(".ca_user_field, .termBox, .ca_staff_field, .ca_passwd_field"));
			clutil.inputReadonly(this.$("#ca_btn_store_select, #ca_btn_store_delete"));
			this.$(".ca_org_select_field, .ca_org_select_comment, .ca_org_select_spacer").hide();
			this.$("button[name='ca_btn_org_delete']").attr("disabled", true);
//			this.$("#ca_table_role").find("tbody input").attr("readonly",true)
//				.end().find("tbody .btn-delete").hide()
//				.end().find("tfoot tr").hide();
			var $table_role = this.$("#ca_table_role");
			$table_role.find('td:last-child').hide();	// 行削除[×]ボタンを隠す
			$table_role.find('tfoot tr').hide();		// 行追加[＋]ボタンを隠す
			clutil.viewReadonly($table_role);			// input を readonly モードに設定
		},

		/**
		 * データ表示
		 * ・表示後に入力数制御
		 */
		data2view : function(getRsp){

			this.viewClear();// 初期化
			var _this = this;
			var userRec = getRsp.user;
//			var passwd = getRsp.passwd;
			var staffRec = getRsp.staff;
			var orgList = getRsp.userOrgList;
			var roleList = getRsp.userRoleList;
			var orgTmpl = _this.$("#ca_org_template").html();
			var $roleTmpl = _this.$("#ca_role_template");
			var $tbody = _this.$("#ca_tbody_role");
			if(userRec){
				clutil.data2view(this.$(".ca_user_field, .termBox"), userRec);
				/* 担当組織 */
				var $field = _this.$(".ca_store_select_field");
				var $input= $field.find("input");
				if( userRec.storeID == 0 )
					$input.val(null);
				else
					$input.val(userRec.storeCode + ":" + userRec.storeName);
				$input.data('cl_store_item', { //★IdCodeName を cl_store_item 名で data に保存
					id: userRec.storeID,
					code: userRec.storeCode,
					name: userRec.storeName
				});
			}
			if(staffRec){
				staffRec._view2data_staffOrgID_cn = {
						id : staffRec.staffOrgID,
						name : staffRec.staffOrgName,
						code : staffRec.staffOrgCode,
						value : staffRec.staffOrgCode + ":" + staffRec.staffOrgName,
						label : staffRec.staffOrgCode + ":" + staffRec.staffOrgName
				};
				clutil.data2view(this.$(".ca_staff_field"), staffRec);
			}
			if(orgList && orgList.length > 0){
				$.each(orgList, function(){
					_this.$(".ca_org_select_field").before(orgTmpl);
					var $field = _this.$(".ca_org_field:last");
					var $input= $field.find("input");
					$input.val(this.orgCode + ":" + this.orgName);
					$input.data('cl_store_item', { //★IdCodeName を cl_store_item 名で data に保存
						id: this.orgID,
						code: this.orgCode,
						name: this.orgName
					});
				});
			}
			if(roleList && roleList.length > 0){
				$tbody.find("tr").remove();
				$.each(roleList,function(){
					$roleTmpl.tmpl({}).appendTo($tbody);
					var $input = $tbody.find("tr:last input");
					clutil.clrolecode({el:$input});
					this._view2data_roleID_cn = {
							id : this.roleID,
							name : this.roleName,
							code : this.roleCode,
							value : this.roleCode + ":" + this.roleName,
							label : this.roleCode + ":" + this.roleName
					};
					$input.autocomplete('clAutocompleteItem', this._view2data_roleID_cn);
				});
			}

			/* 担当組織の必須マーク調整 */
            var $store = this.$(".ca_store_select_field");
			if( (userRec != null && userRec.userTypeID == amcm_type.AMCM_VAL_USER_STORE_MAN) ||
				(staffRec == null || (staffRec != null && staffRec.staffOrgID == 0)) ){
                $store.addClass("required");
			} else {
				$store.removeClass("required");
				this.validator.clear();
			}
					
			this._orgAddCtrl();
			this._roleAddCtrl();
		},

		/**
		 * データ取得
		 */
		view2data : function(){
			var userRec = clutil.view2data(this.$(".ca_user_field, .termBox"));
			/* 担当組織 */
			var storedata = this.$(".ca_store_select_field").find("input").data("cl_store_item");
console.log("DEBUG3: storedata=[" + storedata + "]");
			if( storedata != null ){
console.log("DEBUG4: storedata.id=[" + storedata.id + "]");
				userRec.storeID = storedata.id;
			}
			var staffRec = clutil.view2data(this.$(".ca_staff_field"));
			var orgList = [];
			this.$(".ca_org_field").each(function(){
				var data = $(this).find("input").data("cl_store_item");
				var obj = {
						orgID : data.id
				};
				orgList.push(obj);
			});
//			var roleList = clutil.tableview2data(this.$("#ca_tbody_role").children());
			this.updList = clutil.tableview2data(this.$("#ca_tbody_role").children());

			// ユーザID,適用期間
			var ID = userRec.userID;
			var fDate = userRec.fromDate;
			var tDate = userRec.toDate;
			staffRec.staffID = userRec.staffID;
			staffRec.fromDate = fDate;
			staffRec.toDate = tDate;
			$.each(orgList,function(){
				this.userID = ID;
				this.fromDate = fDate;
				this.toDate = tDate;
			});
			var sendList = [];
			$.each(this.updList, function(){
				if (!_.isEmpty(this) && this != undefined) {
					if(this.roleID != '' && this.roleID != null
							&& this.roleID != 0 && this.roleID != undefined){
						this.userID = ID;
						this.fromDate = fDate;
						this.toDate = tDate;
						sendList.push(this);
					}
				}
//				this.userID = ID;
//				this.fromDate = fDate;
//				this.toDate = tDate;
			});

			var data = {
					user : userRec,
					passwd : {
						initPassFlag : 0
					},
					staff : staffRec,
					userOrgList : orgList,
//					userRoleList : roleList
					userRoleList : sendList
			};
			// 新規作成or初期化モード時のみpasswd フラグ1にして返す
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW|| this.options.opeTypeId == -1){
				var passwdRec = clutil.view2data(this.$(".ca_passwd_field"));
				passwdRec.userID = ID;
				passwdRec.initPassFlag = 1;
				data.passwd = passwdRec;
			};
			return data;
		},

		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildSubmitReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');
			var updReq = {};
			/*
			 * 無効化チェック
			 */
			if ($("#ca_entry").attr("disabled") === "disabled") {
				return null;
			}
			/*
			 * 入力値チェック 予約取消時はチェックしない
			 */
			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				// validation
				var f_error = false;
				this.validator.clear();
				this.validator.clear($(".ca_store_select_field").find("input"));

				/*************
				 * chkstdate 日付のチェック
				 *************/
				var ope_date = clcom.getOpeDate();
				var $fromDate = this.$("#ca_fromDate");//$toDate = this.$("#ca_toDate");
				var fromDate = clutil.dateFormat($fromDate.val(), "yyyymmdd");
//				var toDate = clutil.dateFormat($toDate.val(), "yyyymmdd");
				var recfromDate = null;
				var rectoDate = null;
				if (this.options.chkData !== undefined && this.options.chkData.length > 0){
					recfromDate = this.options.chkData[pgIndex].fromDate;
					rectoDate = this.options.chkData[pgIndex].toDate;
				}
				switch(this.options.opeTypeId){
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
					if (fromDate /*<=*/ < ope_date){ // 開始日が/*明日*/本日以降でない
						this.validator.setErrorMsg($fromDate, clmsg.cl_st_date_min_opedate);
						clutil.mediator.trigger("onTicker", clmsg.cl_st_date_min_opedate);
						f_error = true;
					}
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					var compfromDate = ope_date < recfromDate ? recfromDate : ope_date;
					var msg = ope_date > recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
					if (fromDate < compfromDate && rectoDate == clcom.max_date && fromDate != recfromDate){ // 未来予約可能で修正でない状態で開始日が本日以降でない
						this.validator.setErrorMsg($fromDate, msg);
						clutil.mediator.trigger("onTicker", msg);
						f_error = true;
					}
					break;
				case -1:
					// 日付関係ない
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
					if (fromDate < ope_date || fromDate < recfromDate){ // 設定開始日が本日以降かつ編集前開始日以降でない
						var msg = ope_date > recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
						this.validator.setErrorMsg($fromDate, msg);
						clutil.mediator.trigger("onTicker", msg);
						f_error = true;
					}
					break;
				default:
					break;
				}
				if(f_error){ // エラーチェック毎にメッセージが決まっている⇒複数ある場合、一気に表示できていない。
					return null;
				}

				if(!this.validator.valid()) {
					f_error = true;
				}
				if(f_error){
					return null;
				}

				// 期間反転チェック
				var chkInfo = [];
				chkInfo.push({
					stval : 'ca_fromDate',
					edval : 'ca_toDate'
				});
				if(!this.validator.validFromTo(chkInfo)){
					f_error = true;
				}

				if(f_error){
					return null;
				}

				// 更新データ集約
				updReq = this.view2data();

				if(updReq.userRoleList.length === 0){
//					clutil.mediator.trigger("onTicker", "権限を１つは選択してください");
					var msg = "権限を１つは選択してください";
					clutil.mediator.trigger("onTicker", msg);
					this.validator.setErrorMsg($("#ca_tbody_role tr:nth-child(1) input[name='roleID']"), msg);
					//return null;
					f_error = true;
				}

				// 非社員ユーザチェック
				if( (updReq.user.staffID == null || updReq.user.staffID == 0) &&
					(updReq.user.storeID == null || updReq.user.storeID == 0) ){
					// 担当組織が未設定ならエラーにする
					clutil.mediator.trigger("onTicker", clutil.getclmsg(clmsg.ECM0042));
					this.validator.setErrorMsg($(".ca_store_select_field").find("input"), clutil.getclmsg(clmsg.ECM0042));
					f_error = true;
				}
				// 店長ユーザチェック
				else if( (updReq.user.userTypeID == amcm_type.AMCM_VAL_USER_STORE_MAN) &&
						(updReq.user.storeID == null || updReq.user.storeID == 0) ){
					// 担当組織が未設定ならエラーにする
					clutil.mediator.trigger("onTicker", clutil.getclmsg(clmsg.ECM0043));
					this.validator.setErrorMsg($(".ca_store_select_field").find("input"), clutil.getclmsg(clmsg.ECM0043));
					f_error = true;
				}

				// パスワードチェック
				switch(this.options.opeTypeId){
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				case -1:
					if(!this.mixCheck(updReq.passwd.passwd)){
						this.validator.setErrorMsg(this.$('#ca_passwd'), clutil.getclmsg(clmsg.ECM0012));
						clutil.mediator.trigger("onTicker", clutil.getclmsg(clmsg.ECM0012));
						f_error = true;
					}
					break;
				default:
					break;
				}

				if(f_error){
					return null;
				}

				// 重複チェック
				switch(this.options.opeTypeId){
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					if(this.isDuplicate(updReq)){
						f_error = true;
					}
					break;
				default:
					break;
				}
				if(f_error){
					return null;
				}

				if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
					// 適用開始日を設定
					this.options.chkData[pgIndex].fromDate = fromDate;
				}

			} else {
				updReq = this.viewSeed;
				// passwd.initPassFlag == 0にしておく
				if(updReq && updReq.passwd){
					updReq.passwd.initPassFlag = 0;
				} else if (updReq){
					updReq.passwd = {
							initPassFlag : 0
					};
				}
			}
			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			if(this.options.opeTypeId == -1){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD;
			}

			var reqObj = {
					reqHead : reqHead,
					AMCMV0050UpdReq  : updReq
			};
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},

		// 文字ミックスチェック
		mixCheck : function(val){
			var regex_alpha = /[a-zA-Z]/;
			var regex_num = /[0-9]/;
			return (regex_alpha.test(val) && regex_num.test(val));
		},

		// 重複チェック
		isDuplicate : function(data){
			var _this = this;
			var isdup = false;
			var staffRec = data.staff;
			var orgList = data.userOrgList;
			var roleList = data.userRoleList;

			var listLen = orgList.length;
			$.each(orgList, function(i,v){
				var compID = this.orgID;
				for(var j = i+1; j < listLen; j++){
					if (orgList[j].orgID == compID){
						_this.validator.setErrorMsg(_this.$(".ca_org_field input:eq(" + i + ")"), clutil.fmtargs(clmsg.EMS0065, ["所属組織"]));
						_this.validator.setErrorMsg(_this.$(".ca_org_field input:eq(" + j + ")"), clutil.fmtargs(clmsg.EMS0065, ["所属組織"]));
						clutil.mediator.trigger("onTicker",  "データに重複があります");
						isdup = true;
					}
				}
				if(staffRec.staffOrgID && compID == staffRec.staffOrgID){
					_this.validator.setErrorMsg(_this.$("#ca_staffOrgID"), clutil.fmtargs(clmsg.EMS0065, ["所属組織"]));
					_this.validator.setErrorMsg(_this.$(".ca_org_field input:eq(" + i + ")"), clutil.fmtargs(clmsg.EMS0065, ["所属組織"]));
					clutil.mediator.trigger("onTicker",  "データに重複があります");
					isdup = true;
				}
			});

			listLen = roleList.length;
			$.each(roleList, function(i,v){
				var compID = this.roleID;
				for(var j = i+1; j < listLen; j++){
					if (roleList[j].roleID == compID){
						_this.validator.setErrorMsg(_this.$("#ca_tbody_role tr:nth-child(" + (i + 1) + ") input[name='roleID']"), clutil.fmtargs(clmsg.EMS0065, ["選択権限"]));
						_this.validator.setErrorMsg(_this.$("#ca_tbody_role tr:nth-child(" + (j + 1) + ") input[name='roleID']"), clutil.fmtargs(clmsg.EMS0065, ["選択権限"]));
						clutil.mediator.trigger("onTicker",  "データに重複があります");
						isdup = true;
					}
				}
			});
			return isdup;
		},

		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// ユーザ検索リクエスト
				AMCMV0050GetReq: {
					srchID: this.options.chkData[pgIndex].id,			// ユーザID
					// 20151111 MT-0924
					// srchDate はサーバでのマスタ検索日になるが
					// MtStaff 等で履歴ができていた場合に前歴のレコードに
					// マッチしてしまうので適用開始日でなく適用終了日を指定する
					srchDate: this.options.chkData[pgIndex].toDate,		// 適用終了日
					delFlag:  this.options.chkData[pgIndex].delFlag,	// 削除フラグ
				},
//				// ユーザ更新リクエスト -- 今は検索するので、空を設定
//				AMCMV0050UpdReq: {
//				}
			};

			return {
				resId: clcom.pageId,	//'AMCM0050',
				data: getReq
			};
		},

		_onOrgSelClick: function(e) {
			var _this = this;

//			// 選択された情報を初期値として検索する
			var initData = {};

			this.AMPAV0020Selector.show(null, true, null, null, initData);
			//サブ画面復帰後処理
			this.AMPAV0020Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					var orgDivTmpl = _this.$("#ca_org_template").html();
					_this.$(".ca_org_select_field").before(orgDivTmpl);
					var $input = _this.$(".ca_org_field:last").find("input");
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
					$input.val(code + ":" + name);
					$input.data('cl_store_item', { //★IdCodeName を cl_store_item 名で data に保存
						id: id,
						code: code,
						name: name
					});
				}
				_this._orgAddCtrl();
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_org_select"));
				});
			};
		},

		_onStoreSelClick: function(e) {
			var _this = this;

//			// 選択された情報を初期値として検索する
			var initData = {};

			this.AMPAV0020Selector.show(null, true, null, null, initData);
			//サブ画面復帰後処理
			this.AMPAV0020Selector.okProc = function(data) {
				if (data !== null && data.length == 1) {
					///var orgDivTmpl = _this.$("#ca_org_template").html();
					///_this.$(".ca_org_select_field").before(orgDivTmpl);
console.log("DEBUG1\n");
					//var $input = _this.$(".ca_store_field:last").find("input");
					var $input = _this.$(".ca_store_select_field").find("input");
					var id = data[0].val;
					var code = data[0].code;
					var name = data[0].name;
console.log("DEBUG2: code[" + code + "] name[" + name + "]");
					$input.val(code + ":" + name);
					$input.data('cl_store_item', { //★IdCodeName を cl_store_item 名で data に保存
						id: id,
						code: code,
						name: name
					});
				}
				//_this._orgAddCtrl();
				_.defer(function(){
					clutil.setFocus(_this.$("#ca_btn_store_select"));
				});
			};
		},

		/**
		 * 担当組織削除
		 */
		_onStoreDelClick : function(e){
			var $input = $(".ca_store_select_field").find("input");
			$input.val(null);
			$input.data('cl_store_item', { //★IdCodeName を cl_store_item 名で data に保存
				id: 0,
				code: "",
				name: ""
			});
		},

		/**
		 * 追加組織削除
		 */
		_onOrgDelClick : function(e){
			var $div = $(e.target).closest(".ca_org_selected_div");
			var $nextDiv = $div.next();
			$div.remove();
			$nextDiv.remove();
			this._orgAddCtrl();
		},

		/**
		 * 追加組織選択制限コントロール
		 */
		_orgAddCtrl : function(){
			var count = this.$(".ca_org_field").length;
			if (count >= this.ORG_MAX){
				this.$(".ca_org_select_field, .ca_org_select_comment, .ca_org_select_spacer").hide();
			} else {
				this.$(".ca_org_select_field, .ca_org_select_comment, .ca_org_select_spacer").show();
			}
		},

		/**
		 * 権限テーブル行削除
		 * @param e
		 */
		onRoleRowDelClick : function(e){
			$(e.target).parent().parent().remove();
			this._roleAddCtrl();
			return;
		},

		/**
		 * 権限テーブル行追加
		 */
		onRoleRowAddClick : function(){
			var $tbody = this.$("#ca_tbody_role");
			$("#ca_role_template").tmpl({}).appendTo($tbody);
			var $input = $tbody.find("tr:last input");
			clutil.clrolecode({el:$input});
			this._roleAddCtrl();
			return;
		},

        /**
		 * ユーザ区分変更イベント
		 */
        onUserTypeStateChange : function(e){
            var $store = this.$(".ca_store_select_field");
            var $stafforg = this.$("#ca_staffOrgID");
            var state = Number(this.$("#ca_userTypeID").val());
            if (state == amcm_type.AMCM_VAL_USER_STORE_MAN){ // 店長
				// 担当組織を必須に
                $store.addClass("required");
			}
			else {
                // 社員ユーザであれば必須解除
				if( $stafforg.val() != null && $stafforg.val() != "" ){
	                $store.removeClass("required");
					this.validator.clear();
				}
            }
        },

		/**
		 * 権限選択制限コントロール
		 */
		_roleAddCtrl : function(){
			var count = this.$("#ca_tbody_role").find("tr").length;
			if (count >= this.ROLE_MAX){
				this.$("#ca_table_role tfoot tr").hide();
				this.$("#ca_tbody_role").find(".btn-delete").show();
			} else if(count === 1){
				this.$("#ca_table_role tfoot tr").show();
				this.$("#ca_tbody_role").find(".btn-delete").hide();
			} else {
				this.$("#ca_table_role tfoot tr").show();
				this.$("#ca_tbody_role").find(".btn-delete").show();
			}
		},


		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
			var rec = data.AMCMV0050GetRsp;
			delete rec.user.recno;
			delete rec.user.state;
			delete rec.user.fromDate;
			delete rec.user.toDate;
			delete rec.staff;
			if (rec.passwd && this.options.opeTypeId != -1){
				delete rec.passwd;
			}
			$.each(rec.userRoleList,function(){
				delete this.fromDate;
				delete this.toDate;
			});
			if (rec.userOrgList){
				$.each(rec.userOrgList,function(){
					delete this.fromDate;
					delete this.toDate;
				});
			}
			return data;
		}
	});

	// 初期データを取る
	clutil.getIniJSON(null, null).done(function(data, dataType) {
		if(clcom.pageArgs && clcom.pageArgs.opeTypeId){
			console.log("opeTypeId:" + clcom.pageArgs.opeTypeId);
		}
		ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
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
