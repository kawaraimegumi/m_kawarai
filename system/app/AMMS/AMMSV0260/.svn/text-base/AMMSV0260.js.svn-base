useSelectpicker2();

$(function(){
	$.inputlimiter.stop();
	$.inputlimiter.Limiters.alnumat = function () {
		return $.inputlimiter.Limiters.regex(/[A-Za-z0-9@]+/);
	};
	$.inputlimiter.start();

	$.inputlimiter.noTrim = true;

	clutil.enterFocusMode($('body'));

	/****************
	 * 基本項目view
	 ****************/
	var BaseView = Backbone.View.extend({
		el : $("#ca_baseView"),
		validator : null,
		events : {
			"change #ca_orgfuncID" : "_onOrgFuncIDChange",
//			"change #ca_orglevelID" : "_onOrgLevelIDChange", // selector発のchangeを経由して監視
			"change #ca_orgTypeID" : "_onOrgTypeIDChange",
			"cl_change #ca_parentID" : "_onParentIDChange", // TODO:cl_changeイベントの変更対応
//			"autocompletechange #ca_parentID" : "_onParentIDChange", // TODO:cl_changeイベントの変更対応
//			"change #ca_parentID" : "_onParentIDChange", // TODO:cl_changeイベントの変更対応
			"change #ca_code" : "_onCodeChange",
			"change #ca_tmpCodeFlag" : "_onTmpCodeFlagChange"
		},

		basicFuncID: clcom.getSysparam(amcm_sysparams.PAR_AMMS_DEFAULT_ORG_FUNCID),

		initialize : function(){
			_.bindAll(this);
			clutil.datepicker(this.$("#ca_fromDate"));
			clutil.datepicker(this.$("#ca_toDate"));
			this.$("#ca_fromDate").datepicker("setIymd", clcom.getOpeDate() + 1);
			this.$("#ca_toDate").datepicker("setIymd", clcom.max_date);
			clutil.viewReadonly(this.$(".ca_toDate_div"));

			clutil.cltxtFieldLimit($("#ca_code"));
			clutil.cltxtFieldLimit($("#ca_name"));
			clutil.cltxtFieldLimit($("#ca_nameKana"));
			clutil.cltxtFieldLimit($("#ca_shortName"));
			clutil.cltxtFieldLimit($("#ca_shortNameKana"));
			clutil.cltxtFieldLimit($("#ca_scmName"));

			clutil.cltypeselector(this.$("#ca_orgTypeID"), amcm_type.AMCM_TYPE_ORG_KIND, 0, 1);
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});
		},

		initUIelement : function(ope_mode){
			clutil.initUIelement(this.$el);
			this.ope_mode = ope_mode;
			clutil.mediator.on('onClOrgLevelSelectorChanged', this._onOrgLevelIDChange);
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				clutil.mediator.on('onAccCodeStuffChanged', this._makeAccCode);
			}
			var _this = this;
			return clutil.clorgfuncselector(this.$("#ca_orgfuncID"),1).then(function(data, stat){
				if(!(data && data.head && data.head.status === am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK)){
					return this.reject();
				}
				_this.$("#ca_orgfuncID").val(clcom.getSysparam("PAR_AMMS_DEFAULT_ORG_FUNCID"));
				console.log('orgfunc init done');
				var orgfuncID = _this.$("#ca_orgfuncID").val();
				var f_ex_store = orgfuncID != _this.basicFuncID ? 1 : 0;
				return clutil.clorglevelselector(_this.$("#ca_orglevelID"), {
					dependAttrs: {
						orgfunc_id: orgfuncID,
						f_ex_store: f_ex_store
					}
				});
			}).then(function(data, stat){
				if(_this.$("#ca_orglevelID").data("p_id") == 0){
					_this.$("#ca_parentID").removeClass("cl_required").parent().parent().removeClass("required");
				}
				if(!(data && data.head && data.head.status === am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK)){
					return this.reject();
				}
				console.log("orglevel init done");
				clutil.clorgcode(_this.$("#ca_parentID"), {
					getOrgFuncId: function() {
						return _this.$("#ca_orgfuncID").val();
					},
					getOrgLevelId: function() {
						return _this.$("#ca_orglevelID").data("p_id");
					},
					dependAttrs : {
						srchFromDate : function(){
							return clutil.dateFormat(_this.$("#ca_fromDate").val(), "yyyymmdd");
						},
						srchToDate : function(){
							return clutil.dateFormat(_this.$("#ca_toDate").val(), "yyyymmdd");
						},
						ymd : clcom.getOpeDate()
					}
				});
				return this.promise();
			});
		},

		render : function(){
			// 削除モードの削除日対応
			if(this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				this.$("#ca_term").find("p.fieldName").text("削除日");
				this.$("#ca_term").find(".deldspn").hide();
//				'<p class=​"txtInFieldUnit flright help" id=​"ca_tp_del" data-original-title="削除日以降、当組織は無効扱いとなります">'
				this.$(".ca_fromDate_div").before("<p id=ca_tp_del><span>?</span></p>");
				this.$("#ca_term > div:first").removeClass("wt500").addClass("wt280");

				$("#ca_tp_del").addClass("txtInFieldUnit flright help").attr("data-original-title", "削除日以降、当組織は無効扱いとなります").tooltip({html: true});
			}
		},

		data2view : function(rspData, ope_mode){
			var dfd = $.Deferred();
			clutil.mediator.off('onAccCodeStuffChanged');
			this.rspData = rspData;
			this.ope_mode = ope_mode;
			var ope_date = clcom.getOpeDate();
			// viewへのデータ埋め込み
			var org = rspData.org, orgrel = rspData.orgrel;
			var data = {
					id				: org.id,
					fromDate		: org.fromDate,
					toDate			: org.toDate,
					orgfuncID		: orgrel.orgfuncID,
					orglevelID		: orgrel.orglevelID,
					parentID		: orgrel.parentID,
					parentCode		: orgrel.parentCode,
					parentName		: orgrel.parentName,
					parentData		: JSON.stringify({
						id		: orgrel.parentID,
						code	: orgrel.parentCode,
						name	: orgrel.parentName,
						value	: orgrel.parentCode + ":" + orgrel.parentName,
						label	: orgrel.parentCode + ":" + orgrel.parentName,
						parentList : [{
							orglevel_id : amcm_type.AMCM_VAL_ORG_LEVEL_UNIT,
							id : orgrel.unitID ? orgrel.unitID : null
						}]
					}),
					_view2data_parentID_cn : {
						id		: orgrel.parentID,
						code	: orgrel.parentCode,
						name	: orgrel.parentName,
						value	: orgrel.parentCode + ":" + orgrel.parentName,
						label	: orgrel.parentCode + ":" + orgrel.parentName,
						parentList : [{
							orglevel_id : amcm_type.AMCM_VAL_ORG_LEVEL_UNIT,
							id : orgrel.unitID ? orgrel.unitID : null
						}]
					},
					orgTypeID		: org.orgTypeID,
					tmpCodeFlag		: org.tmpCodeFlag,
					code			: org.code,
					accCode			: org.accCode,
					name			: org.name,
					nameKana		: org.nameKana,
					shortName		: org.shortName,
					shortNameKana	: org.shortNameKana,
					scmName			: org.scmName,
					stockMngFlag	: org.stockMngFlag,
					stockNotChangeFlag	: org.stockNotChangeFlag
			};
			if (ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
				data.fromDate = clutil.addDate(clcom.getOpeDate(), 1);
			}

			clutil.mediator.once("afterTypeIDChanged", _.bind(function(){
				var f_ex_store = data.orgfuncID != this.basicFuncID ? 1 : 0;

				clutil.clorglevelselector(this.$("#ca_orglevelID"), {
					dependAttrs: {
						orgfunc_id: data.orgfuncID,
						f_ex_store: f_ex_store
					}
				}).done(_.bind(function(){
					if(this.$("#ca_orglevelID").selectpicker("val") != 0){
						// changeが機能しないため一時的処置
						this.$("#ca_orglevelID").selectpicker("val", 0);
					}

					clutil.mediator.once("afterTypeIDChanged", _.bind(function(){
						clutil.initUIelement(this.$el);
						console.log("orglevel data done");
						var $ca_afterIn = this.$(".ca_afterIn");


						clutil.mediator.once("afterParentIDChanged", _.bind(function(){
							this._onTmpCodeFlagChange();
							console.log("other data done");
							switch(ope_mode){
							case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
								clutil.viewReadonly(this.$("#ca_term"));
								var isNotTmp = data.tmpCodeFlag === 0;
								if (data.toDate == clcom.max_date && isNotTmp){
									clutil.viewRemoveReadonly(this.$(".ca_fromDate_div"));
									if (data.fromDate <= ope_date) { // 開始日付を翌日に変更
										this.$("#ca_fromDate").datepicker("setIymd", clutil.addDate(ope_date, 1));
									}
								} else if (!isNotTmp){
									clutil.viewReadonly(this.$(".ca_fromDate_div"));
								}
								this.$("#ca_code").attr("readonly",isNotTmp);
								this.$("#ca_orgfuncID,#ca_orglevelID,#ca_orgTypeID").attr("disabled", true);
								this.$("#ca_parentID").attr("readonly", isNotTmp);
								this.$("#ca_tmpCodeFlag").attr("disabled", isNotTmp).closest("label").toggleClass("disabled", isNotTmp);
								// viewの変更
								this.$("#ca_orgTypeID").trigger("change");

								break;
							case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
								clutil.viewReadonly(this.$el);
								clutil.viewRemoveReadonly(this.$(".ca_fromDate_div"));
								// viewの変更
								clutil.mediator.trigger('onOrgTypeIDChanged');
								break;
							case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
							case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
								clutil.viewReadonly(this.$el);
								// viewの変更
								clutil.mediator.trigger('onOrgTypeIDChanged');
								break;
							default:
								break;
							}
							clutil.cltxtFieldLimitReset($("#ca_code"));
							clutil.cltxtFieldLimitReset($("#ca_name"));
							clutil.cltxtFieldLimitReset($("#ca_nameKana"));
							clutil.cltxtFieldLimitReset($("#ca_shortName"));
							clutil.cltxtFieldLimitReset($("#ca_shortNameKana"));
							clutil.cltxtFieldLimitReset($("#ca_scmName"));
							clutil.initUIelement(this.$el);
							// フォーカス制御
							switch(ope_mode){
							case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
							case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
								clutil.setFocus(this.$("#ca_fromDate"));
								break;
							case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
							case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
	//							TODO:どこにおいとく？
	//							clutil.setFocus($("#cl_submit"));
								break;
							default:
								break;
							}
							clutil.mediator.on('onAccCodeStuffChanged', this._makeAccCode);
							dfd.resolve();
						},this));
						clutil.data2view($ca_afterIn, data);
						clutil.mediator.trigger('onParentIDChanged');
					},this));
					this.$("#ca_orglevelID").selectpicker("val", data.orglevelID).selectpicker('refresh');//.trigger("change");
				}, this));
			},this));
			this.$("#ca_orgfuncID").selectpicker("val", data.orgfuncID).selectpicker('refresh').trigger("change");
			clutil.initUIelement(this.$el);
			console.log("orglevel data before");
			return dfd.promise();
		},

		view2data : function(){
			var data = clutil.view2data(this.$el);
			return data;
		},

		/**
		 * 会計用コード生成
		 */
		_makeAccCode : function(){

			var $accCode = this.$("#ca_accCode");
			var orgTypeID = Number(this.$("#ca_orgTypeID").val());
			var code = this.$("#ca_code").val();
			var $parentID = this.$("#ca_parentID");
			var parentID_Data = null;
			if($parentID.hasClass('cl_autocomplete')){
				parentID_Data = $parentID.autocomplete('clAutocompleteItem');
			}
			if (!parentID_Data){
				$accCode.val("");
				return;
			}
			if (code.length != 4){
				$accCode.val("");
				return;
			}
			var busUnit = this._getBusUnit(parentID_Data);
			if (!busUnit){
				$accCode.val("");
				return;
			}
			switch(orgTypeID){
			case amcm_type.AMCM_VAL_ORG_KIND_STORE:
			case amcm_type.AMCM_VAL_ORG_KIND_CENTER:
			case amcm_type.AMCM_VAL_ORG_KIND_HQ:	// MT-1285
				// シスパラ取得
				var __SYSPAR_AOKI__ = clcom.getSysparam('PAR_AMMS_UNITID_AOKI');
				var __SYSPAR_ORIHICA__ = clcom.getSysparam('PAR_AMMS_UNITID_ORI');
				var __SYSPAR_HD__ = clcom.getSysparam('PAR_AMMS_UNITID_HD');	// MT-1285
				if (busUnit == __SYSPAR_AOKI__){
					$accCode.val("20100" + code + "0");
				} else if (busUnit == __SYSPAR_ORIHICA__){
					$accCode.val("20700" + code + "0");
				} else if (busUnit == __SYSPAR_HD__){
					$accCode.val("10100" + code + "0");
				}
				break;
			//case amcm_type.AMCM_VAL_ORG_KIND_HQ:
			//	$accCode.val("10100" + code + "0");
			//	break;
			default:
				$accCode.val("");
				break;
			}
			return;
		},

		/**
		 * 組織情報から事業ユニットidを返す
		 * @param data オートコンプリート組織情報配列
		 */
		_getBusUnit : function(data){
			var busUnitInfo = {};
			if(data && data.parentList){
				$.each(data.parentList, function(){
					if (this.orglevel_id == amcm_type.AMCM_VAL_ORG_LEVEL_UNIT){
						busUnitInfo = this;
						return false;
					}
				});
			}
			if (busUnitInfo && busUnitInfo.id){
				return busUnitInfo.id;
			} else {
				return null;
			}
		},

		/**
		 * 組織体系項目select変更時
		 */
		_onOrgFuncIDChange : function(){
			console.log("orgfunc change");
			var $orglevelID = this.$("#ca_orglevelID");
			var orgfuncID = this.$("#ca_orgfuncID").val();
			var f_ex_store = orgfuncID != this.basicFuncID ? 1 : 0;
			clutil.clorglevelselector($orglevelID, {
				dependAttrs: {
					orgfunc_id: orgfuncID,
					f_ex_store: f_ex_store
				}
			}).done(_.bind(function(){
				clutil.initUIelement(this.$el);
				if (orgfuncID != 0) {
					var $div = this.$("#ca_orglevelID").parent();
					clutil.viewRemoveReadonly($div);
				}
				console.log("orgfunc change done");
			},this));
			return;
		},

		/**
		 * 組織階層項目select変更時
		 */
		_onOrgLevelIDChange : function(item, e){
			console.log("orglevel change");
			var $orglevelID = this.$("#ca_orglevelID");
			var $orgTypeID = this.$("#ca_orgTypeID");
			var $orgTypeID_div = this.$("#ca_orgTypeID_div");
			var $parentID = this.$("#ca_parentID");

			// 組織コード制限を変更
			var $code = this.$("#ca_code");

			$parentID.val("");
			$code.val(null);
			if (item && item.id){
				$parentID.attr("disabled", item.orglevel_level == 1 );
				if (item.orglevel_level == 1){
					$parentID.val("").removeAttr("cs_id").removeClass("cl_required").parent().parent().removeClass("required");
//					clutil.showRequiredMark({el:this.$el});
				} else {
					$parentID.addClass("cl_required").parent().parent().addClass("required");
				}
				// selectpickerのdisabled解除
				if (item.orglevel_typeid == amcm_type.AMCM_VAL_ORG_LEVEL_BU){
					clutil.viewRemoveReadonly($orgTypeID_div);
				}else {
					clutil.viewReadonly($orgTypeID_div);
				}
				// 上位組織IDと組織階層レベルを埋め込む
				// 組織コード制限を変更
				$orglevelID.data("p_id", item.p_id).data("orglevel_level", item.orglevel_level);
				var typeList = clutil.gettypenamelist(amcm_type.AMCM_TYPE_ORG_KIND);
				var numList = [];
				var makeList = [];
				var limitStr = "len:2 alnumat";
				var tflimitStr = "2";
				var validStr = "len:1,2"; // FIXME:alnumatに対応するvalidator
				$code.addClass("cl_regex").attr("data-pattern", "^[A-Za-z0-9@]*$").data('pattern', "^[A-Za-z0-9@]*$");
				switch(item.orglevel_typeid){
				case amcm_type.AMCM_VAL_ORG_LEVEL_HD:
					numList = [amcm_type.AMCM_VAL_ORG_KIND_HD];
					break;
				case amcm_type.AMCM_VAL_ORG_LEVEL_CORP:
					numList = [amcm_type.AMCM_VAL_ORG_KIND_CORP];
					break;
				case amcm_type.AMCM_VAL_ORG_LEVEL_UNIT:
					numList = [amcm_type.AMCM_VAL_ORG_KIND_UNIT];
					break;
				case amcm_type.AMCM_VAL_ORG_LEVEL_ZONE:
					numList = [amcm_type.AMCM_VAL_ORG_KIND_ZONE];
					limitStr = "len:2 alnumat";
					tflimitStr = "2";
					validStr = "len:2,2";
					break;
				case amcm_type.AMCM_VAL_ORG_LEVEL_AREA:
					numList = [amcm_type.AMCM_VAL_ORG_KIND_AREA];
					limitStr = "len:3 alnumat";
					tflimitStr = "3";
					validStr = "len:3,3";
					break;
				case amcm_type.AMCM_VAL_ORG_LEVEL_BU:
					numList = [amcm_type.AMCM_VAL_ORG_KIND_STORE,
					           amcm_type.AMCM_VAL_ORG_KIND_CENTER,
					           amcm_type.AMCM_VAL_ORG_KIND_HQ];
					limitStr = "len:4 digit";
					tflimitStr = "4";
					validStr = "len:4,4 numeric";
					$code.removeClass("cl_regex").removeAttr("data-pattern").removeData('pattern');
					break;
				case amcm_type.AMCM_VAL_ORG_LEVEL_OTHER:
					numList = [amcm_type.AMCM_VAL_ORG_KIND_OTHER];
					limitStr = "len:4 alnumat";
					tflimitStr = "4";
					validStr = "len:1,4";
					break;
				default :
					break;
				}
				$.each(numList, function(i){
					var num = this;
					$.each(typeList, function(){
						if (this.type_id == num){
							makeList.push(this);
						}
					});
				});
				$code.attr("data-validator", validStr).data('validator', validStr);
				//$code.attr("data-limit", limitStr).data('limit', limitStr);
				$code.attr('data-tflimit', tflimitStr).data('tflimit', tflimitStr);
				this.$(".code_limit_span").remove();
				$code.before('<span class="limit wt40 flright mrgl240 code_limit_span"></span>');
				clutil.cltxtFieldLimit($code);
				clutil.cltypeselector2($orgTypeID, makeList, 0, 0, "type_id", "name", "code");
			} else {
				$parentID.attr("disabled", true);
				$parentID.val("").removeAttr("cs_id").removeClass("cl_required").parent().parent().removeClass("required");
				clutil.cltypeselector2($orgTypeID, [], 0, 0, "type_id", "name", "code");
			}
			clutil.initUIelement(this.$el);
			$orgTypeID.trigger("change");
			console.log("orglevel change done");
			return;
		},

		/**
		 * 上位組織変更
		 */
		_onParentIDChange : function(e){
			clutil.mediator.trigger('onParentIDChanged', e);
			clutil.mediator.trigger('onAccCodeStuffChanged');
		},

		/**
		 * 組織区分変更
		 * @param e
		 */
		_onOrgTypeIDChange : function(e){
			console.log("orgTypeID change");
			// 上位組織の階層レベルに基づいた制御
			// 最上位階層の場合、上位組織はdisabled
			var $orgTypeID = this.$("#ca_orgTypeID");
			var $tmpCodeFlag = this.$("#ca_tmpCodeFlag");
			var $nameKana = this.$("#ca_nameKana");
			var $scmName = this.$("#ca_scmName");
			if (this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				var isStore = $orgTypeID.val() == amcm_type.AMCM_VAL_ORG_KIND_STORE;
				var isCenter = $orgTypeID.val() == amcm_type.AMCM_VAL_ORG_KIND_CENTER;
//				switch ($orgTypeID.val()) {
//				case amcm_type.AMCM_VAL_ORG_KIND_STORE:
					$tmpCodeFlag.attr("disabled", !isStore).closest("label").toggleClass("disabled", !isStore);
					$tmpCodeFlag.attr("checked", isStore).closest("label").toggleClass("checked", isStore);
					var isChecked = $tmpCodeFlag.attr("checked");
					$nameKana.toggleClass("cl_required", !isChecked).parent().parent().toggleClass("required", !isChecked);
					$scmName.attr("readonly", !(isStore || isCenter))
						.toggleClass("cl_required", ((!isChecked) && (isStore || isCenter)))
						.parent().parent().toggleClass("required", ((!isChecked) && (isStore || isCenter)));
					clutil.initUIelement(this.$el);
//					break;
//				default:
//					$tmpCodeFlag.attr({"disabled":true,"checked":false});
//					$scmName.attr("readonly", true);
//					break;
//				}
			}
			this.validator.valid({$el :this.$("#ca_orgTypeID_div")});
			clutil.initUIelement(this.$("#ca_orgTypeID_div"));
			clutil.mediator.trigger('onAccCodeStuffChanged');
			// mainViewへ変更を通知
			clutil.mediator.trigger('onOrgTypeIDChanged');
			// データ表示時に残りを表示するよう通知
			clutil.mediator.trigger("afterTypeIDChanged");
			console.log("orgTypeID change done");
		},

		/**
		 * 仮コードフラグ変更時
		 */
		_onTmpCodeFlagChange : function(e){
			console.log("tmpCodeFlagChange");
			var $tmpCodeFlag = this.$("#ca_tmpCodeFlag");
			var isChecked = $tmpCodeFlag.attr("checked");
			var $orgTypeID = this.$("#ca_orgTypeID");
			var isStore = $orgTypeID.val() == amcm_type.AMCM_VAL_ORG_KIND_STORE;
			var isCenter = $orgTypeID.val() == amcm_type.AMCM_VAL_ORG_KIND_CENTER;
			this.$("#ca_nameKana").toggleClass("cl_required", !isChecked).parent().parent().toggleClass("required", !isChecked);
			this.$("#ca_scmName").toggleClass("cl_required", ((!isChecked) && (isStore || isCenter)))
				.parent().parent().toggleClass("required", ((!isChecked) && (isStore || isCenter)));
			if(this.ope_mode == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
//				if(isChecked){
//					clutil.viewReadonly(this.$(".ca_fromDate_div"));
//					this.$("#ca_fromDate").datepicker("setIymd", this.rspData.org.fromDate); // 表示時の保持データで書き換える
//				} else {
//					clutil.viewRemoveReadonly(this.$(".ca_fromDate_div"));
//				};
			}
			console.log("tmpCodeFlagChange done");
		},

		 /**
		  * 組織コード変更時
		  */
		_onCodeChange : function(){
			clutil.mediator.trigger('onAccCodeStuffChanged');
		},

		initReadonly : function(){
			clutil.viewRemoveReadonly(this.$el);
			this.$("#ca_accCode").attr("readonly", true);
		}
	});

	/****************
	 * 住所項目view
	 ****************/
	var AddressView = Backbone.View.extend({
		el : $("#ca_addressView"),
		validator : null,
		events : {
			"click #expand_address" : "_addressViewToggle"
		},
		initialize : function(){
			_.bindAll(this);
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});
//			clutil.cltxtFieldLimit(this.$("#ca_postalno"));
			clutil.cltxtFieldLimit(this.$("#ca_addr1"));
			clutil.cltxtFieldLimit(this.$("#ca_addr2"));
			clutil.cltxtFieldLimit(this.$("#ca_addr3"));
//			clutil.cltxtFieldLimit(this.$("#ca_telno1"));
//			clutil.cltxtFieldLimit(this.$("#ca_telno2"));
//			clutil.cltxtFieldLimit(this.$("#ca_telno3"));
//			clutil.cltxtFieldLimit(this.$("#ca_faxno1"));
//			clutil.cltxtFieldLimit(this.$("#ca_faxno2"));
//			clutil.cltxtFieldLimit(this.$("#ca_faxno3"));
			this.prefselector = clutil.clprefcode({
				el : this.$("#ca_prefID"),
				dependAttrs : {
					srchFromDate : function(){
						return clutil.dateFormat($("#ca_fromDate").val(), "yyyymmdd");
					},
					srchToDate : function(){
						return clutil.dateFormat($("#ca_toDate").val(), "yyyymmdd");
					}
				}
			});
		},

		_addressViewToggle  : function(){
			this.$('.ca_address_field').slideToggle({complete:function(){
				$(this).css('overflow', 'inherit');
			}});
			this.$("#expand_address").find('span').fadeToggle();
		},

		initUIelement : function(rtyp){
			// 新規登録、編集時にプレースホルダ―住所表示
			if (rtyp == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| rtyp == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				this.$("#ca_postalno").attr("placeholder", clcom.getSysparam("PAR_AMCM_DEFAULT_POSTAL_NUMBER"));
				this.$("#ca_addr1").attr("placeholder", clcom.getSysparam("PAR_AMCM_DEFAULT_ADDR1"));
				this.$("#ca_addr2").attr("placeholder", clcom.getSysparam("PAR_AMCM_DEFAULT_ADDR2"));
				this.$("#ca_addr3").attr("placeholder", clcom.getSysparam("PAR_AMCM_DEFAULT_ADDR3"));
				this.$("#ca_openingTime").attr("placeholder", "09:00");
				this.$("#ca_closingTime").attr("placeholder", "21:00");
			}

			if (rtyp == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				//this.listenTo(this.prefselector, "change", this._onPrefChange);
			}

			clutil.initUIelement(this.$el);
//			clutil.cltypeselector(this.$("#ca_prefID"), "pref");
			// 初期表示は閉じておく
			this.$('.ca_address_field').slideToggle({complete:function(){
				$(this).css('overflow', 'inherit');
			}});
			return this;
		},


		render : function(){

		},

		// 都道府県変更時に住所１へ名称適用
		_onPrefChange : function(item, e, options){
			console.log(item, e, options);
			//if(!_.isEmpty(item) && item.id != null){
			//	this.$("#ca_addr1").val(item.name);
			//}
			return;
		},

		data2view : function(rspData, ope_mode){
			if(rspData.orgrel.orglevelID == clcom.getSysparam("PAR_AMMS_STORE_LEVELID")
					&& this.$('.unexpand').css("display") == "none"){
				this._addressViewToggle();
			}

			this.ope_mode = ope_mode;
			// viewへのデータ埋め込み
			var storeattr = rspData.storeattr;
			var telsplits = storeattr.telno.split("-");
			var faxsplits = storeattr.faxno.split("-");
			var o_time    = storeattr.openingTime == 0 ? '' : storeattr.openingTime;
			var c_time    = storeattr.closingTime == 0 ? '' : storeattr.closingTime;
			var bus_flag  = storeattr.businessHoursIrregularFlag == 0 ? '' : storeattr.businessHoursIrregularFlag;
			var data = {
					prefID			: storeattr.prefID,
					prefCode		: storeattr.prefCode,
					prefName		: storeattr.prefName,
					_view2data_prefID_cn : {
						id : storeattr.prefID,
						code : storeattr.prefCode,
						name : storeattr.prefName
					},
					postalno		: storeattr.postalno,
					addr1			: storeattr.addr1,
					addr2			: storeattr.addr2,
					addr3			: storeattr.addr3,
					telno1			: telsplits[0],
					telno2			: telsplits[1],
					telno3			: telsplits[2],
					faxno1			: faxsplits[0],
					faxno2			: faxsplits[1],
					faxno3			: faxsplits[2],
					openingTime     : o_time,	//20180403 MD-1777 MD-899
					closingTime     : c_time,
					businessHoursIrregularFlag : bus_flag
			};
			clutil.data2view(this.$el, data);
			switch(ope_mode){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
				clutil.viewReadonly(this.$el);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				clutil.viewReadonly(this.$el);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				clutil.viewReadonly(this.$el);
				break;
			default:
				break;
			}
//			clutil.cltxtFieldLimitReset(this.$("#ca_postalno"));
			clutil.cltxtFieldLimitReset(this.$("#ca_addr1"));
			clutil.cltxtFieldLimitReset(this.$("#ca_addr2"));
			clutil.cltxtFieldLimitReset(this.$("#ca_addr3"));
//			clutil.cltxtFieldLimitReset(this.$("#ca_telno1"));
//			clutil.cltxtFieldLimitReset(this.$("#ca_telno2"));
//			clutil.cltxtFieldLimitReset(this.$("#ca_telno3"));
//			clutil.cltxtFieldLimitReset(this.$("#ca_faxno1"));
//			clutil.cltxtFieldLimitReset(this.$("#ca_faxno2"));
//			clutil.cltxtFieldLimitReset(this.$("#ca_faxno3"));
			clutil.initUIelement(this.$el);

			return;
		},

		view2data : function(){
			var data = clutil.view2data(this.$el);
				data.telno = data.telno1 + "-" + data.telno2 + "-" + data.telno3;
				if (data.telno == "--"){data.telno = "";}
				data.faxno = data.faxno1 + "-" + data.faxno2 + "-" + data.faxno3;
				if (data.faxno == "--"){data.faxno = "";}
			return data;
		},

		initReadonly : function(){
			clutil.viewRemoveReadonly(this.$el);
		}

	});

	/****************
	 * 店舗項目view
	 ****************/
	var StoreView = Backbone.View.extend({
		el : $("#ca_storeView"),
		validator : null,
		events : {
			"click #expand_store" : "_storeViewToggle"
		},
		// 開店日設定措置
		MINYMD : 19700101,

		initialize : function(){
			_.bindAll(this);
			clutil.datepicker(this.$("#ca_openDate"),{min_date: this.MINYMD}).datepicker("setIymd");;
			clutil.datepicker(this.$("#ca_closeDate"),{min_date: this.MINYMD}).datepicker("setIymd");;
			clutil.datepicker(this.$("#ca_posSetupDate")).datepicker("setIymd");;
			clutil.datepicker(this.$("#ca_posStopDate")).datepicker("setIymd");;
			clutil.datepicker(this.$("#ca_smxStartDate")).datepicker("setIymd");;

//			this.$("#ca_openDate, #ca_closeDate, #ca_posSetupDate, #ca_posStopDate").val("");
			clutil.cltypeselector(this.$("#ca_storeTypeID"), amcm_type.AMCM_TYPE_STORE, 1, 1);
			clutil.cltypeselector(this.$("#ca_smxstoreTypeID"), amcm_type.AMCM_TYPE_ORG_STOREATTR_SMX, 1, 1);
			clutil.cltxtFieldLimit(this.$("#ca_competitor"));
			clutil.cltxtFieldLimit(this.$("#ca_floorNum"));
			clutil.cltxtFieldLimit(this.$("#ca_buildingInfo"));
			clutil.cltxtFieldLimit(this.$("#ca_floorArea"));
			clutil.cltxtFieldLimit(this.$("#ca_smxfloorArea"));
			clutil.cltxtFieldLimit(this.$("#ca_backArea"));
			clutil.cltxtFieldLimit(this.$("#ca_parkingNum"));

			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});
		},

		initUIelement : function(rtyp){
			// 新規登録、編集時にプレースホルダ―住所表示
			if (rtyp == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| rtyp == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
				this.$("#ca_competitor").attr("placeholder", "ＡＨＡ");
			}
			if (rtyp == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				this.$("#ca_vendor1ID, #ca_vendor2ID").attr("readonly", true);
			}
			clutil.initUIelement(this.$el);
			this.$('.ca_store_field').slideToggle({complete:function(){
				$(this).css('overflow', 'inherit');
			}});
			clutil.clvendorcode(this.$("#ca_vendor1ID"),{
				getVendorTypeId : function(){
					return amcm_type.AMCM_VAL_VENDOR_CORRECT;
				},
				getUnitId : function(){
					var unit_id = 0;
					var data = $("#ca_parentID").autocomplete("clAutocompleteItem");
					if(data && data.parentList){
						$.each(data.parentList, function(){
							if(this.orglevel_id == clcom.getSysparam('PAR_AMMS_UNIT_LEVELID')){
								unit_id = this.id;
								return false;
							}
						});

					}
					return unit_id;
				}
			});
			clutil.clvendorcode(this.$("#ca_vendor2ID"),{
				getVendorTypeId : function(){
					return amcm_type.AMCM_VAL_VENDOR_CORRECT;
				},
				getUnitId : function(){
					var unit_id = 0;
					var data = $("#ca_parentID").autocomplete("clAutocompleteItem");
					if(data && data.parentList){
						$.each(data.parentList, function(){
							if(this.orglevel_id == clcom.getSysparam('PAR_AMMS_UNIT_LEVELID')){
								unit_id = this.id;
								return false;
							}
						});

					}
					return unit_id;
				}
			});
			$("#ca_tp_competitor").tooltip({html: true});
			$("#ca_tp_sendstockFlag").tooltip({html: true});
			return this;
		},

		render : function(){
		},
		_storeViewToggle  : function(e){
			this.$('.ca_store_field').slideToggle({complete:function(){
				$(this).css('overflow', 'inherit');
			}});
			this.$("#expand_store").find('span').fadeToggle();
		},

		data2view : function(rspData, ope_mode){
			if(rspData.orgrel.orglevelID == clcom.getSysparam("PAR_AMMS_STORE_LEVELID")
					&& this.$('.unexpand').css("display") == "none"){
				this._storeViewToggle();
			}

			// viewへのデータ埋め込み
			var storeattr = rspData.storeattr;
			var storedate = rspData.storedate;
			var storevendorList = rspData.storevendorList;
			var data = {
					openDate			: storedate.openDate,
					closeDate			: storedate.closeDate,
					posSetupDate		: storedate.posSetupDate,
					posStopDate			: storedate.posStopDate,
					smxStartDate		: storedate.smxStartDate,

					competitor			: storeattr.competitor,
					smxFlag				: storeattr.smxFlag,
					storeTypeID			: storeattr.storeTypeID,
					smxstoreTypeID		: storeattr.smxstoreTypeID,
					flagshipFlag		: storeattr.flagshipFlag,
					floorNum			: storeattr.floorNum,
					buildingInfo		: storeattr.buildingInfo,
					floorArea			: storeattr.floorArea,
					smxfloorArea		: storeattr.smxfloorArea,
					backArea			: storeattr.backArea,
					parkingNum			: storeattr.parkingNum,
					sendstockFlag		: storeattr.sendstockFlag,
					openingTime         : storeattr.openingTime,	// 20180403 MD-1777 MD-899
					closingTime         : storeattr.closingTime,
					businessHoursIrregularFlag  : storeattr.businessHoursIrregularFlag,
			};
			$.each(storevendorList, function(i){
				data["vendor" + (i+1) + "ID"] = this.vendorID;
				data["vendor" + (i+1) + "Code"] = this.vendorCode;
				data["vendor" + (i+1) + "Name"] = this.vendorName;
				data["vendor" + (i+1) + "Data"] = JSON.stringify({
					id		: this.vendorID,
					code	: this.vendorCode,
					name	: this.vendorName,
					value	: this.vendorCode + ":" + this.vendorName,
					label	: this.vendorCode + ":" + this.vendorName
				});
				data["_view2data_vendor" + (i+1) + "ID_cn"] = {
						id		: this.vendorID,
						code	: this.vendorCode,
						name	: this.vendorName,
						value	: this.vendorCode + ":" + this.vendorName,
						label	: this.vendorCode + ":" + this.vendorName
				};
			});
			clutil.data2view(this.$el, data);
			switch(ope_mode){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:
				clutil.viewReadonly(this.$el);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				clutil.viewReadonly(this.$el);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				clutil.viewReadonly(this.$el);
				break;
			default:
				break;
			}
			clutil.cltxtFieldLimitReset(this.$("#ca_competitor"));
			clutil.cltxtFieldLimitReset(this.$("#ca_floorNum"));
			clutil.cltxtFieldLimitReset(this.$("#ca_buildingInfo"));
			clutil.cltxtFieldLimitReset(this.$("#ca_floorArea"));
			clutil.cltxtFieldLimitReset(this.$("#ca_smxfloorArea"));
			clutil.cltxtFieldLimitReset(this.$("#ca_backArea"));
			clutil.cltxtFieldLimitReset(this.$("#ca_parkingNum"));
			clutil.initUIelement(this.$el);

			return;
		},

		view2data : function(){
			var data = clutil.view2data(this.$el);
			return data;
		},

		initReadonly : function(){
			clutil.viewRemoveReadonly(this.$el);
		}
	});


	/****************
	 * main view
	 ****************/
	var EditMainView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
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
			this.nohistFlag = 0;
			// 上位組織-補正業者間リレーション
			this.oldUnitID = null;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title: '組織マスタ',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
					// リクエストビルダ関数を渡しておく。
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
					// リクエストのビルダ関数を opt で渡しておく。
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined
				};
				return mdOpt;
			},this)(fixopt);
			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			this.baseView = new BaseView({el: this.$('#ca_baseView')});
			this.addressView = new AddressView({el: this.$('#ca_addressView')});
			this.storeView = new StoreView({el: this.$('#ca_storeView')});


			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			}
			clutil.mediator.on('onOrgTypeIDChanged', this._onOrgTypeIDChanged);
			clutil.mediator.on('onParentIDChanged', this._onParentIDChanged);
			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			return this;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			return $.when(
				this.baseView.initUIelement(this.options.opeTypeId),
				this.addressView.initUIelement(this.options.opeTypeId),
				this.storeView.initUIelement(this.options.opeTypeId)
			);
		},

		render : function(){
			console.log("main render start");
			this.mdBaseView.render();
			this.baseView.render();
			this.addressView.render();
			this.storeView.render();
			clutil.inputlimiter(this.$el);
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				clutil.setFocus(this.$("#ca_fromDate"));
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}
			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				document.location = '#';
				if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){
					// 更新した日付をchkdataに反映
					this.options.chkData[args.index].fromDate = args.data.AMMSV0260GetRsp.org.fromDate;
				}
//				// 更新完了ダイアログ表示
//				clutil.updMessageDialog(_this.updConfirmcallback);
				clutil.viewReadonly(this.baseView.$el);
				clutil.viewReadonly(this.addressView.$el);
				clutil.viewReadonly(this.storeView.$el);
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.baseView.$el);
				clutil.viewReadonly(this.addressView.$el);
				clutil.viewReadonly(this.storeView.$el);
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.baseView.$el);
				clutil.viewReadonly(this.addressView.$el);
				clutil.viewReadonly(this.storeView.$el);
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
			// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			this.nohistFlag = 0;
			var data = args.data;
			this.initReadonly();
			switch(args.status){
			case 'OK':
				var getRsp = data.AMMSV0260GetRsp;
				if (getRsp.org.tmpCodeFlag == 1){
					this.nohistFlag = 1;
				}
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp);
				break;
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				var getRsp = data.AMMSV0260GetRsp;
				this.viewSeed = getRsp;
				console.log(JSON.stringify(getRsp));
				this._allData2View(getRsp).done(_.bind(function(){
					clutil.viewReadonly(this.baseView.$el);
					clutil.viewReadonly(this.addressView.$el);
					clutil.viewReadonly(this.storeView.$el);
				}, this));
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				clutil.viewReadonly(this.$("#ca_headInfoArea"));
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				// ヘッダーにメッセージを表示
				this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.rspHead.message], data.rspHead.args)});
				break;
			}
		},

		initReadonly : function(){
			this.baseView.initReadonly();
			this.addressView.initReadonly();
			this.storeView.initReadonly();
		},

		/**
		 * dataを表示
		 */
		_allData2View : function(getRsp){
			// view毎のデータ表示
			this.oldUnitID = getRsp.orgrel.unitID;
			return this.baseView.data2view(getRsp, this.options.opeTypeId).done(_.bind(function(){
				this.addressView.data2view(getRsp, this.options.opeTypeId);
				this.storeView.data2view(getRsp, this.options.opeTypeId);
			}, this));
		},

		/**
		 * viewから更新データ
		 */
		_allView2Data : function(){
			var baseData = this.baseView.view2data();
			var addressData = this.addressView.view2data();
			var storeData = this.storeView.view2data();

			var data = {
					org :{
						id				: baseData.id,
						fromDate		: baseData.fromDate,
						toDate			: baseData.toDate,
						orgTypeID		: baseData.orgTypeID,
						tmpCodeFlag		: baseData.tmpCodeFlag,
						code			: baseData.code,
						name			: baseData.name,
						accCode			: baseData.accCode,
						nameKana		: baseData.nameKana,
						shortName		: baseData.shortName,
						shortNameKana	: baseData.shortNameKana,
						scmName			: baseData.scmName,
						stockMngFlag	: baseData.stockMngFlag,
						stockNotChangeFlag	: baseData.stockNotChangeFlag,
					},
					orgrel : {
						fromDate		: baseData.fromDate,
						toDate			: baseData.toDate,
						id				: baseData.id,
						orgfuncID		: baseData.orgfuncID,
						orglevelID		: baseData.orglevelID,
						parentID		: baseData.parentID
					},
					storeattr : {
						fromDate		: baseData.fromDate,
						toDate			: baseData.toDate,
						id				: baseData.id,
						prefID			: addressData.prefID,
						postalno		: addressData.postalno,
						addr1			: addressData.addr1,
						addr2			: addressData.addr2,
						addr3			: addressData.addr3,
						telno			: addressData.telno,
						faxno			: addressData.faxno,
						openingTime     : addressData.openingTime,	// 20180403 MD-1777 MD-899
						closingTime     : addressData.closingTime,
						businessHoursIrregularFlag  : addressData.businessHoursIrregularFlag,
						competitor		: storeData.competitor,
						//smxFlag			: storeData.smxFlag,
						storeTypeID		: storeData.storeTypeID,
						flagshipFlag	: storeData.flagshipFlag,
						floorNum		: storeData.floorNum,
						buildingInfo	: storeData.buildingInfo,
						floorArea		: storeData.floorArea,
						backArea		: storeData.backArea,
						parkingNum		: storeData.parkingNum,
						sendstockFlag	: storeData.sendstockFlag,
						smxstoreTypeID	: storeData.smxstoreTypeID,
						smxfloorArea	: storeData.smxfloorArea,
					},
					storedate : {
						id				: baseData.id,
						openDate		: storeData.openDate,
						closeDate		: storeData.closeDate,
						posSetupDate	: storeData.posSetupDate,
						posStopDate		: storeData.posStopDate,
						smxStartDate	: storeData.smxStartDate,
					},
					storevendorList : []
			};
			if (storeData.vendor1ID){
				data.storevendorList.push({
					fromDate		: baseData.fromDate,
					toDate			: baseData.toDate,
					id				: baseData.id,
					vendorID		: baseData.orgTypeID == amcm_type.AMCM_VAL_ORG_KIND_STORE ? storeData.vendor1ID : 0
				});
			}
			if (storeData.vendor2ID){
				data.storevendorList.push({
					fromDate		: baseData.fromDate,
					toDate			: baseData.toDate,
					id				: baseData.id,
					vendorID		: baseData.orgTypeID == amcm_type.AMCM_VAL_ORG_KIND_STORE ? storeData.vendor2ID : 0
				});
			}
			return data;
		},

		/**
		 * 組織区分変更時view変更
		 */
		_onOrgTypeIDChanged : function(){
			console.log("main orgTypeID change start");
			var orgTypeID = this.$("#ca_orgTypeID").val();
			var addressNeed = (orgTypeID == amcm_type.AMCM_VAL_ORG_KIND_STORE
					|| orgTypeID == amcm_type.AMCM_VAL_ORG_KIND_CENTER
					|| orgTypeID == amcm_type.AMCM_VAL_ORG_KIND_HQ );
			var storeNeed = orgTypeID == amcm_type.AMCM_VAL_ORG_KIND_STORE;
			if (!addressNeed){
				this.addressView.$el.hide();
			} else {
				this.addressView.$el.show();
				if(this.addressView.$el.find('.unexpand').css("display") == "none"){
					this.addressView._addressViewToggle();
				}

			}
			if (!storeNeed){
				this.storeView.$el.hide();
			} else {
				this.storeView.$el.show();
				if(this.storeView.$el.find('.unexpand').css("display") == "none"){
					this.storeView._storeViewToggle();
				}
			}
			console.log("main orgTypeID change done");
			return;
		},

		// 上位組織-補正業者リレーション
		_onParentIDChanged : function(e){
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL
					|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
				this.$("#ca_vendor1ID, #ca_vendor2ID").attr("readonly", true);
				clutil.mediator.trigger("afterParentIDChanged");
				return;
			}
			var unitID = null;
			var parentID = this.$("#ca_parentID").autocomplete("clAutocompleteItem");
			if(!_.isEmpty(parentID) && parentID.id  != null){
				this.$("#ca_vendor1ID, #ca_vendor2ID").attr("readonly", false);
				$.each(parentID.parentList, function(){
					if(this.orglevel_id == clcom.getSysparam('PAR_AMMS_UNIT_LEVELID')){
						unitID = this.id;
						return false;
					}
				});
				if (unitID == null || unitID != this.oldUnitID){
					this.$("#ca_vendor1ID").autocomplete("removeClAutocompleteItem");
					this.$("#ca_vendor2ID").autocomplete("removeClAutocompleteItem");
				}
			} else {
				this.$("#ca_vendor1ID").autocomplete("removeClAutocompleteItem");
				this.$("#ca_vendor2ID").autocomplete("removeClAutocompleteItem");
				this.$("#ca_vendor1ID, #ca_vendor2ID").attr("readonly", true);
			}
			this.oldUnitID = unitID;
			clutil.mediator.trigger("afterParentIDChanged");
		},

		/**
		 * 登録ボタン押下時 入力チェック submitリクエスト生成
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
			var confirm = null;
			/*
			 * 入力値チェック 予約取消時はチェックしない
			 */
			if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				// validation
				var f_error = false;
				this.validator.clear();

				if (!this.$("#ca_tmpCodeFlag").attr("checked") || this.nohistFlag == 0){
					/*************
					 * chkstdate 日付のチェック
					 *************/
	//				var isBasic = this.$('input[name="ca_basicFlag"]:checked').val() == 1;
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
						if (fromDate <= ope_date){ // 開始日が明日以降でない
							this.validator.setErrorMsg($fromDate, clmsg.cl_st_date_min_opedate);
//							this.validator.setErrorHeader(clmsg.cl_st_date_min_opedate);
							clutil.mediator.trigger("onTicker", clmsg.cl_st_date_min_opedate);
							f_error = true;
						}
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
						var compfromDate = ope_date < recfromDate ? recfromDate : ope_date;
						var msg = ope_date > recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
						if (fromDate <= compfromDate && rectoDate == clcom.max_date && fromDate != recfromDate){ // 未来予約可能で修正でない状態で開始日が明日以降でない
							this.validator.setErrorMsg($fromDate, msg);
//							this.validator.setErrorHeader(msg);
							clutil.mediator.trigger("onTicker", msg);
							f_error = true;
						}
						break;
					case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
						if (fromDate <= ope_date || fromDate < recfromDate){ // 設定開始日が明日以降かつ編集前開始日以降でない
							var msg = ope_date >= recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
							this.validator.setErrorMsg($fromDate, msg);
//							this.validator.setErrorHeader(msg);
							clutil.mediator.trigger("onTicker", msg);
							f_error = true;
						}
						break;
					default:
						break;
					}
				}// else {
//					// 日付を変えていないかチェック…は再度disabled時に日付巻き戻しで打消し
//				}

				if(f_error){
					return null;
				}
				if(!this.baseView.validator.valid()) {
					f_error = true;
				}
				if(!this.addressView.validator.valid()) {
					f_error = true;
				}
				if(!this.storeView.validator.valid()) {
					f_error = true;
				}

				// 期間反転チェック
				var chkInfo = [];
				chkInfo.push({
					stval : 'ca_fromDate',
					edval : 'ca_toDate'
				});
				chkInfo.push({
					stval : 'ca_openDate',
					edval : 'ca_closeDate'
				});
				chkInfo.push({
					stval : 'ca_posSetupDate',
					edval : 'ca_posStopDate'
				});
				chkInfo.push({	// 20180403 MD-1777 MD-899
					stval : 'ca_openingTime',
					edval : 'ca_closingTime',
					orequalto : true
				});
				if(!this.validator.validFromTo(chkInfo)){
					f_error = true;
				}

				// SMX関連のチェック
				var $smxStartDate = this.$("#ca_smxStartDate");//$toDate = this.$("#ca_toDate");
				var smxStartDate = clutil.dateFormat($smxStartDate.val(), "yyyymmdd");
				var smxstoreTypeID = this.$("#ca_smxstoreTypeID").selectpicker('val');
				if (smxStartDate > 0 && (smxstoreTypeID == null || smxstoreTypeID <= 0)) {
					// SMX開始日が設定されている場合は、SMX店舗タイプは必須
					this.validator.setErrorMsg(this.$("#ca_smxstoreTypeID"), clmsg.EMS0157);
					f_error = true;
				} else if (smxstoreTypeID > 0 && smxStartDate == 0) {
					// SMX店舗タイプが設定されている場合は、SMX開始日は必須
					this.validator.setErrorMsg(this.$("#ca_smxStartDate"), clmsg.EMS0158);
					f_error = true;
				}
				// 業者重複チェック
				var vendor1 = this.$("#ca_vendor1ID").autocomplete("clAutocompleteItem");
				var vendor2 = this.$("#ca_vendor2ID").autocomplete("clAutocompleteItem");
				if((vendor1 != null && vendor2 != null)
						&& vendor1.id == vendor2.id ){
					this.validator.setErrorMsg(this.$("#ca_vendor1ID"), clutil.fmtargs(clmsg.EMS0065, ["補正業者"]));
					this.validator.setErrorMsg(this.$("#ca_vendor2ID"), clutil.fmtargs(clmsg.EMS0065, ["補正業者"]));
					f_error = true;
				}

				if(f_error){
					clutil.mediator.trigger("onTicker", clmsg.cl_echoback);
					return null;
				}
				// UpdReq 作成
				updReq = this._allView2Data();

				/*
				 * ダイアログチェック：予約取消と削除はチェックしない
				 */
				if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL &&
						this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL){
					var orgTypeID = this.$("#ca_orgTypeID").val();
					if ((orgTypeID ==amcm_type.AMCM_VAL_ORG_KIND_STORE ||orgTypeID == amcm_type.AMCM_VAL_ORG_KIND_CENTER)
							&& !this.$("#ca_stockMngFlag").attr("checked")){
						confirm = clmsg.WMS0109;
					}
				}
			} else {
				updReq = this.viewSeed;
			}
			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			updReq.nohistFlag  = this.nohistFlag;
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var reqObj = {
					reqHead : reqHead,
					AMMSV0260UpdReq  : updReq
			};
			return {
				confirm : confirm,
				resId : clcom.pageId,
				data: reqObj
			};
		},

		/**
		 * getリクエスト生成
		 * @param opeTypeId
		 * @param pgIndex
		 * @returns {___anonymous18796_18861}
		 */
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ		・・・これ、必要なの？					【確認】
				reqPage: {
				},
				// 取引先マスタ検索リクエスト
				AMMSV0260GetReq: {
					srchID: this.options.chkData[pgIndex].id,			// 取引先ID
					srchDate: this.options.chkData[pgIndex].toDate,		// 適用終了日 この画面では終了日を与える
					delFlag : this.options.chkData[pgIndex].delFlag		// 削除(参照)フラグ
				},
				// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
				AMMSV0260UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMMSV0260',
				data: getReq
			};
		},
		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
			var rec = data.AMMSV0260GetRsp;
			delete rec.org.fromDate;
			delete rec.org.toDate;
			delete rec.org.id;
			delete rec.orgrel.fromDate;
			delete rec.orgrel.toDate;
			delete rec.orgrel.id;
			delete rec.storeattr.fromDate;
			delete rec.storeattr.toDate;
			delete rec.storeattr.id;
			delete rec.storedate.fromDate;
			delete rec.storedate.toDate;
			delete rec.storedate.id;
			$.each(rec.storevendorList, function(){
				delete this.fromDate;
				delete this.toDate;
				delete this.id;
				delete this.vendorCode;
				delete this.vendorName;
			});
			return data;
		}
	});

	// 初期データを取る
	clutil.getIniJSON(null, null).then(function(data, dataType) {
		ca_editView = new EditMainView(clcom.pageArgs);
		return ca_editView.initUIelement();
	}).done(function(){
		console.log("main init done");
		ca_editView.render();
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
