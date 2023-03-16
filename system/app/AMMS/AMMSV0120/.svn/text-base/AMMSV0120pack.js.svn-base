/* global MyApp: true */

(function(MyApp){
	var PackView = Marionette.Layout.extend({
		template: '#PackView',

		ui: {
			pack1: '#pack1',
			pack2: '#pack2',
			approveDateWrap: '#ca_approveDateWrap',
			uptake: '#ca_csv_uptake'
		},

		events: {
			'click #ca_apply': 'applyPack1',
			'change #ca_tagIssueFlag': 'checkTagIssueFlag',
			'click .ca_sample_download': function(){
				if(MyApp.distrMode){
					clutil.download('/public/sample/店舗振分サンプル.xlsx');
				}else{
					clutil.download('/public/sample/発注兼振分書登録サンプル.xlsx');
				}
			}
		},

		checkTagIssueFlag: function(){
			var $el = this.$('#ca_tagIssueFlag'), checked = $el.is(':checked');
			this.toggleRequired(this.$('#ca_tagIssueTypeID'), checked);
			this.toggleRequired(this.$('#ca_tagTypeID'), checked);
			// this.toggleRequired(this.$('#ca_tagAddrNo'), checked);
		},

		applyPack1: function(){
			console.log('click:ca_apply');
			if (this.isPack1Valid()){
				clutil.viewReadonly(this.ui.pack1);
				this._applyPack1 = true;
				MyApp.trigger('applyPackAbove');
			}
		},

		isApply: function(){
			return !!this._applyPack1;
		},

		initialize: function(){
			_.bindAll(this, 'isValid');

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback: $('.cl_echoback').hide()
			});
		},


		isPack1Valid: function(){
			return this.validator.valid({filter: '#pack1 *'});
		},

		isValid: function(){
			if (!this.isApply()){
				clutil.mediator.trigger('onTicker', '決定されていません');
				return false;
			}

			var valid = this.validator.valid();
			return valid;
		},

		setLastApply: function(){
			var isLastApply = MyApp.reqres.request('isLastApply');
			if (isLastApply){
				clutil.viewReadonly(this.$el);
				if (MyApp.mode === 'mode_rel'){
					// 承認済データの参照時のみ表示
					this.$('#ca_orderDateWrap').show();
					// 承認済データの参照時以外で表示
					this.$('#ca_approveDateWrap').hide();
					clutil.Validators.removeValidation(
						this.$('#ca_approveDate'), 'required');
				}else if(!MyApp.commentOnly && !MyApp.isSaved && this.isApply()){
					clutil.inputRemoveReadonly('#ca_orderTgtTypeID');
					clutil.inputRemoveReadonly('#ca_approveDate');
					clutil.inputRemoveReadonly('#ca_tagAddrNo');
					clutil.inputRemoveReadonly(this.$('.ca_sample_download'));
					clutil.inputRemoveReadonly(this.$('.cl-file-attach'));
					clutil.inputRemoveReadonly('#ca_tagIssueFlag');
					//clutil.viewRemoveReadonly($('#ca_selloutYear').parent());
					//clutil.viewRemoveReadonly($('#ca_selloutSeasonID').parent());
				}
			}
		},

		setReadonly: function(){
			var view = this;

			this.checkTagIssueFlag();

			if (MyApp.isSaved){
				clutil.viewReadonly(view.$el);
			} else if (MyApp.commentOnly){
				clutil.viewReadonly(view.$el);
			} else if (MyApp.mode === 'mode_rel'){
				clutil.viewReadonly(view.$el);
			} else if (!this.isApply()){
				clutil.viewReadonly(this.ui.pack2);
			}
			this.setLastApply();
		},

		isValidYear: function(){
			var data = this.serialize();
			if (parseInt(data.selloutYear, 10) <
				parseInt(data.year, 10)){
				this.validator.setErrorMsg(
					this.$('#ca_selloutYear'), clutil.getclmsg('EMS0017'));
				clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_echoback'));

				return false;
			}
			return true;
		},

		deserialize: function(el){
			el || (el = this.$el);
			var data = this.model.toJSON();

			_.extend(data, {
				itgrp: {
					id: data.itgrpID,
					code: data.itgrpCode,
					name: data.itgrpName
				},
				maker: {
					id: data.makerID,
					name: data.makerName,
					code: data.makerCode
				},
				fixedFormTag1: {
					id: data.fixedFormTag1Code,
					code: data.fixedFormTag1Code,
					name: data.fixedFormTag1Name
				},
				fixedFormTag2: {
					id: data.fixedFormTag2Code,
					code: data.fixedFormTag2Code,
					name: data.fixedFormTag2Name
				}
			});

			if (MyApp.mode !== 'mode_new') {
				data.unitID = data.unitID;
			}
			if (MyApp.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				// 複製のときにサイズパターンが編集できなくなる
				if (data.sizePtnID === 0){
					delete data.sizePtnID;
				}
				if (data.subcls1ID === 0){
					delete data.subcls1ID;
				}
				if (data.subcls2ID === 0){
					delete data.subcls2ID;
				}
			}
			clutil.data2view(el, data, null, true);
		},

		serialize: function(){
			var data = clutil.view2data(this.$el);
			_.extend(data, this.getMaker());
			_.extend(data, this.getItgrp());
			var fixedFormTag1 = this.get1('fixedformtag1');
			data.fixedFormTag1Code = fixedFormTag1.code;
			data.fixedFormTag1Name = fixedFormTag1.name;
			var fixedFormTag2 = this.get1('fixedformtag2');
			data.fixedFormTag2Code = fixedFormTag2.code;
			data.fixedFormTag2Name = fixedFormTag2.name;

			return data;
		},

		get1: function(name){
			if (!this.relation) return {};
			return this.relation.get(name);
		},

		getUnitID: function(){
			return this.relation1.fields.clbusunitselector.getValue();
		},

		getMaker: function(){
			if (!this.relation) return {};
			var attrs = this.relation.fields.clvendorcode.getAttrs();
			return {
				makerID: attrs.id,
				makerCode: attrs.code,
				makerName: attrs.name
			};
		},

		getItgrp: function(){
			var attrs = this.relation1.fields.clvarietycode.getAttrs();
			return {
				itgrpID: attrs.id,
				itgrpCode: attrs.code,
				itgrpName: attrs.name
			};
		},

		getItgrpID: function(){
			return (this.relation1.fields.clvarietycode.getValue() || {}).id;
		},

		getSizePtnID: function(){
			var sizeptnID = this.relation.fields.sizePtnID.getValue();
			return parseInt(sizeptnID, 10);
		},

		onShow: function(){
			var view = this;

			clutil.initUIelement(this.$el);

			// CSV取込
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				btn: this.ui.uptake,

				buildCSVInputReqFunction: function(){
					return MyApp.reqres.request('buildCSVInputReq');
				},

				fileUploadViewOpts: {
					beforeShowFileChooser: view.isValid
				}
			});

			this.listenTo(this.opeCSVInputCtrl, {
				done: function(data){
					var isLastApply = MyApp.reqres.request('isLastApply');
					var model = MyApp.Utils.createGetRspModel(data.AMMSV0120CsvRsp, {parse:true});
					if (MyApp.distrMode){
						MyApp.model.updateDistrList(model);
						MyApp.Utils.showDistrView();
					}else{
						if (isLastApply){
							MyApp.model.mergeItemList(model);
						}else{
							MyApp.model.updateItemList(model);
						}
						MyApp.Utils.showItemView();
					}
					console.log(data, MyApp.model, model);
				},
				fail: function(data){
					if (data.rspHead.uri){
						//CSVダウンロード実行
						clutil.download(data.rspHead.uri);
					}
					this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
						by:' id', prefix: 'ca_'});
				}
			});

			// 商品展開年
			clutil.clyearselector({
				el: this.$('#ca_year'),
				future: 3,
				from: 1990,
				value: false
			});

			// 売り切り年
			clutil.clyearselector({
				el: this.$('#ca_selloutYear'),
				future: 5,
				from: 1990,
				value: false
			});

			// 承認期限日
			clutil.datepicker(this.$('#ca_approveDate'));

			// 発注日
			clutil.datepicker(this.$('#ca_orderDate'));

			this.relation1 = clutil.FieldRelation.create('PackViewSub1', {
				// 事業ユニット
				clbusunitselector: {
					el: '#ca_unitID'
				},

				// 品種
				clvarietycode: {
					el: '#ca_itgrp'
				}
			});
			this.listenTo(this.relation1, {
				'change:clbusunitselector': function() {
					console.log('change:unitID');
				},

			});

			this.deserialize(this.ui.pack1);
		},

		showPack2: function(){
			var view = this,
				unit_id =  this.relation1.get('clbusunitselector'),
				variety = this.relation1.get('clvarietycode'),
				itgrp_id = variety && variety.id;

			// 事業ユニットのIDをシスパラから取得
			var UNITID_AOKI = Number(clcom.getSysparam(amcm_sysparams.PAR_AMMS_UNITID_AOKI));
			var UNITID_ORI = Number(clcom.getSysparam(amcm_sysparams.PAR_AMMS_UNITID_ORI));
			var typeList = clcom.getTypeList(amcm_type.AMCM_TYPE_TAG);
			typeList = _.filter(typeList, _.bind(function(item) {
				var ret = false;	// 一旦全て非対象

				switch (unit_id) {
				case UNITID_AOKI:
					// AOKIの場合は1xxか999なら対象
					if (item.type_id <= amcm_type.AMCM_VAL_TAG_BOX || item.type_id == amcm_type.AMCM_VAL_TAG_OWN) {
						ret = true;
					}
					break;
				case UNITID_ORI:
					// ORIHICAの場合は8xxか999なら対象
					if (item.type_id >= amcm_type.AMCM_VAL_TAG_ORBUS1 || item.type_id == amcm_type.AMCM_VAL_TAG_OWN) {
						ret = true;
					}
					break;
				default:
					ret = true;
					break;
				}
				return ret;
			}, this));

			clutil.viewRemoveReadonly(this.ui.pack2);

			this.relation = clutil.FieldRelation.create('PackViewSub2', {
				// メーカー
				clvendorcode: {
					el: '#ca_maker',
                    dependAttrs: {
                        vendor_typeid: amcm_type.AMCM_VAL_VENDOR_MAKER,
                    },
                    rmDepends:['itgrp_id'],
                    addDepends:['unit_id'],
				},

				// サブクラス1
				'clitemattrselector sub1': {
					el: '#ca_subcls1ID',
					dependSrc: {
						iagfunc_id: 'iagfunc.sub1'
					}
				},

				// サブクラス2
				'clitemattrselector sub2': {
					el: '#ca_subcls2ID',
					dependSrc: {
						iagfunc_id: 'iagfunc.sub2'
					}
				},

				// 商品区分
				'cltypeselector itemTypeID': {
					el: '#ca_itemTypeID',
					kind: amcm_type.AMCM_TYPE_ITEM
				},

				// シーズン
				'cltypeselector seasonTypeID': {
					el: '#ca_seasonTypeID',
					kind: amcm_type.AMCM_TYPE_SEASON
				},

				'node <seasonTypeID': {
					depends: ['seasonTypeID', 'subSeasonTypeID'],
					onDependChange: function(attrs, options){
						var subSeason = options.relation.fields.subSeasonTypeID;
						view.toggleRequired(
							subSeason.$el,
							attrs.seasonTypeID === amcm_type.AMCM_VAL_SEASON_ALL,
							true);
					}
				},

				// サブシーズン
				'cltypeselector subSeasonTypeID': {
					el: '#ca_subSeasonTypeID',
					kind: amcm_type.AMCM_TYPE_SUBSEASON
				},

				// 売り切りシーズン
				'cltypeselector selloutSeasonID': {
					el: '#ca_selloutSeasonID',
					kind: amcm_type.AMCM_TYPE_SEASON
				},

				// 用途区分
				'clitemattrselector usetypeID': {
					el: '#ca_usetypeID',
					dependSrc: {
						iagfunc_id: 'iagfunc.usetype'
					}
				},

				// サイズパターン
				'clsizeptn_byitgrpselector sizePtnID': {
					el: '#ca_sizePtnID'
				},

				// タグ発行区分
				'cltypeselector tagIssueTypeID': {
					el: '#ca_tagIssueTypeID',
					kind: amcm_type.AMCM_TYPE_TAGISSUE
				},

				// MD-3529 商品マスタ「タグ送付先」の入力制御変更_PGM開発（タグ発行区分に「中国」が指定されたら「タグ送付先」を入力必須にする）
				'node <tagIssueTypeID': {
					depends: ['tagIssueTypeID', 'tagAddrNo'],
					onDependChange: function(attrs, options){
						var tagAddrNo = options.relation.fields.tagAddrNo;
						if (attrs.tagIssueTypeID === amcm_type.AMCM_VAL_TAGISSUE_CHINA) {
							view.addRequired(tagAddrNo.$el);
						} else {
							view.removeRequired(tagAddrNo.$el);
						}
					}
				},

				// タグ種別
//				'cltypeselector tagTypeID': {
//					el: '#ca_tagTypeID',
//					kind: amcm_type.AMCM_TYPE_TAG
//				},

				// 糸LOX
				'clitemattrselector itolox': {
					el: '#ca_itoloxID',
					dependSrc: {
						iagfunc_id: 'iagfunc.itolox'
					}
				},

				'clfixedformtagcode fixedformtag1': {
					el: '#ca_fixedFormTag1',
					dependAttrs: {
						fftagType: amcm_type.AMCM_VAL_FIXEDFORM_TAG_SECOND
					}
				},

				'clfixedformtagcode fixedformtag2': {
					el: '#ca_fixedFormTag2',
					dependAttrs: {
						fftagType: amcm_type.AMCM_VAL_FIXEDFORM_TAG_THIRD
					}
				},

				// KI区分
				'cltypeselector kiTypeID': {
					el: '#ca_kiTypeID',
					kind: amcm_type.AMCM_TYPE_KI
				},

				// 納品形態(初回)
				'cltypeselector dlvRoute1TypeID': {
					el: '#ca_dlvRoute1TypeID',
					kind: amcm_type.AMCM_TYPE_DLV_ROUTE,
					filter: function(item){
						return item.id < 7;
					}
				},

				// 納品形態(2回目以降)
				'cltypeselector dlvRoute2TypeID': {
					el: '#ca_dlvRoute2TypeID',
					kind: amcm_type.AMCM_TYPE_DLV_ROUTE,
					filter: function(item){
						return item.id < 7;
					}
				},

				'node depend:dlvRoute': {
					depends: ['dlvRoute1TypeID', 'dlvRoute2TypeID'],
					onDependChange: function(attrs, options){
						var center = options.relation.fields.centerID,
							sw = attrs.dlvRoute1TypeID ==
								amcm_type.AMCM_VAL_DLV_ROUTE_DIRECT &&
								attrs.dlvRoute2TypeID ==
								amcm_type.AMCM_VAL_DLV_ROUTE_DIRECT;

						view.toggleRequired(center.$el, !sw);
					}
				},

				// 振分先(センター)
				'clorgselector centerID': {
					el: '#ca_centerID',
					dependSrc: {
						p_org_id: 'unit_id'
					},
					dependAttrs: {
						org_typeid: amcm_type.AMCM_VAL_ORG_KIND_CENTER
					}
				},

				// 発注対象
				'cltypeselector orderTgtTypeID': {
					el: '#ca_orderTgtTypeID',
					kind: amcm_type.AMCM_TYPE_ORDERKIND
				},

				// タグ送付先
                'select tagAddrNo': {
                    el: "#ca_tagAddrNo",
                    depends: ['maker_id'],
                    getItems: function (attrs) {
						return clutil.postJSON('AMMSV0100', {
							reqHead: {
								opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
							},
							AMMSV0100TagAddrGetReq: {
								srchMakerID: attrs.maker_id,
								srchDate: clcom.getOpeDate()
							}
						}).then(function(data){
                            return _.map(data.AMMSV0100TagAddrGetRsp.tagAddrList, function(item) {
                                return {
                                    id: item.tagAddrNo,
                                    code: item.tagAddrNo,
                                    name: item.tagAddrName
                                };
                            });
						});
                    }
                }
			}, {
				dataSource: {
					unit_id: unit_id,
					itgrp_id: itgrp_id,
					orgfunc_id: MyApp.orgfunc_id,
					orglevel_id: MyApp.orglevel_id,
					vendor_typeid: amdb_defs.MTTYPE_F_VENDOR_MAKER,
					'iagfunc.sub1': clconst.ITEMATTRGRPFUNC_ID_SUBCLS1,
					'iagfunc.sub2': clconst.ITEMATTRGRPFUNC_ID_SUBCLS2,
					'iagfunc.itolox': clconst.ITEMATTRGRPFUNC_ID_ITOLOX,
					'iagfunc.usetype': clconst.ITEMATTRGRPFUNC_ID_USETYPE
				}
			});

			this.listenTo(this.relation, {
				'change:sizePtnID': function(){
					console.log('change:sizePtnID');
					MyApp.trigger('change:sizePtnID');
				},

				'change:unitID': function() {
					console.log('change:unitID');
				},

			});
			clutil.cltypeselector2(this.$('#ca_tagTypeID'), typeList, 0, null, "type_id");

			this.deserialize(this.ui.pack2);
		},

		wait: function(callback){
			$.when(this.relation1, this.relation).done(callback);
		},

		addRequired: function($el){
			$el.addClass('cl_required');
			$el.closest('.fieldUnit').addClass('required');
		},

		removeRequired: function($el){
			$el.removeClass('cl_required');
			$el.closest('.fieldUnit').removeClass('required');
			this.validator.clearErrorMsg($el);
		},

		toggleRequired: function($el, sw, disabled){
			if (sw){
				this.addRequired($el);
				if (disabled){
					clutil.inputRemoveReadonly($el);
				}
			}else{
				this.removeRequired($el);
				if (disabled){
					clutil.inputReadonly($el);
				}
			}
		},

		onClose: function(){
			if (this.relation){
				this.relation.remove();
			}
			if (this.relation1){
				this.relation1.remove();
			}
		}
	});

	_.extend(MyApp, {
		PackView: PackView
	});
}(MyApp));
