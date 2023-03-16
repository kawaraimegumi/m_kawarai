$(function() {

	/**
	 * １区分あたりのラジオボタンセレクタビュークラス
	 */
	CmTypeRadioSelectView = Backbone.View.extend({
		className: 'fieldgroupInBox',
		contTemplate: _.template(''
			+ '<div class="fieldUnit">'
			+	'<p class="fieldName"><%- typeTypeName %></p>'
			+	'<div class="fieldBox">'
			+		'<ul></ul>'
			+	'</div>'
			+ '</div>'),
		itemTemplate: _.template(''
			+ '<li>'
			+	'<label class="radio">'
			+		'<input type="radio" name="<%= typetype %>" value="<%= type_id %>" data-toggle="radio">'
			+		'<%- name %>'
			+	'</label>'
			+ '</li>'),

		/**
		 * @param {object}	opt					必須
		 * @param {String}	opt.typeTypeName	区分名
		 * @param [object]	opt.typeList		区分選択肢
		 * @param {integer}	opt.anaFocusKind	絞込条件種別値
		 */
		initialize: function(opt){
			_.bindAll(this);
			this.options = opt;
		},
		render: function(){
			var $ul = this.$el.html(this.contTemplate(this.options)).find('ul');
			_.each(this.options.typeList, function(item){
				var $item = $(this.itemTemplate(item));
				$item.find('input').data('clTypeValue', item);
				$ul.append($item);
			}, this);
			if(_.has(this.options, 'defaultSelectedTypeVal')){
				// 初期選択の設定
				this.setSelectedValue(this.options.defaultSelectedTypeVal);
			}
			if(this.options.withInitBootstrap){
				clutil.initUIelement(this.$el);
			}
			return this;
		},
		/** 選択する区分値をセットする */
		setSelectedValue: function(val){
			var $radio = this.$('input[value=' + val + ']');
			if($radio.data('radio')){
				// initUIElement 後
				$radio.radio('check');
			}else{
				// initUIElement 前の plain な input[type="radio"]
				$radio.attr("checked", true );
			}
		},
		/** 選択された区分値を AnaFocus 形式で返す。 */
		getAnaFocus: function(){
			var item = this.getSelectedItem();
			if(_.isEmpty(item)){
				return null;
			}
			var f = {
				kind: this.options.anaFocusKind,
				val: item.type_id,
				name2: this.options.typeTypeName,
				name: item.name
			};
			return f;
		},
		/** 選択された区分値オブジェクトを返す */
		getSelectedItem: function(){
			var $selected = this.$('input:checked');
			var item = $selected.data('clTypeValue');
			return item;
		}
	});

	//////////////////////////////////////////////
	// View
	MDCMV1360SelectorView = Backbone.View.extend({

		screenId : "MDCMV1360",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_MDCMV1360_commit"			:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_MDCMV1360_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_MDCMV1360_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_MDCMV1360_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
		},

		typeRadioViews: [
			{
				options: {
					typeTypeName: 'サイズMAX部門 または KTサイズ',
					typeList: clcom.getTypeList(amcm_type.AMCM_TYPE_ANA_ITEMATTR_SMXKT),
					defaultSelectedTypeVal: amcm_type.AMCM_VAL_ANA_ITEMATTR_SMXKT_NOP,
					anaFocusKind: amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_SMXKT
				},
				view: null
			},
			{
				options: {
					typeTypeName: '全店評価減対象',
					typeList: [
						{
							name: "設定なし",
							type_id: 0,
							typetype: amcm_type.AMCM_TYPE_ALLWRITEDOWN
						},
						{
							name: "全店評価減対象外",
							type_id: amcm_type.AMCM_VAL_ALLWRITEDOWN_NONE,
							typetype: amcm_type.AMCM_TYPE_ALLWRITEDOWN
						},
						{
							name: "全店評価減対象",
							type_id: amcm_type.AMCM_VAL_ALLWRITEDOWN_ALL,
							typetype: amcm_type.AMCM_TYPE_ALLWRITEDOWN
						}
					],
					defaultSelectedTypeVal: 0,
					anaFocusKind: amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ALLSTORE
				},
				view: null
			},
			{
				options: {
					typeTypeName: '店別評価減対象',
					typeList: [
						{
							name: "設定なし",
							type_id: 0,
							typetype: amcm_type.AMCM_TYPE_STOREWRITEDOWN
						},
						{
							name: "店別評価減対象外",
							type_id: amcm_type.AMCM_VAL_STOREWRITEDOWN_OFF,
							typetype: amcm_type.AMCM_TYPE_STOREWRITEDOWN
						},
						{
							name: "店別評価減対象",
							type_id: amcm_type.AMCM_VAL_STOREWRITEDOWN_ON,
							typetype: amcm_type.AMCM_TYPE_STOREWRITEDOWN
						}
					],
					defaultSelectedTypeVal: 0,
					anaFocusKind: amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_WDSTORE
				},
				view: null
			}
		],

		initialize: function(opt) {
			var defaults = {
				isAnalyse_mode: true					// 分析画面で利用
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function(editList) {
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), this.isAnalyse_mode);
			clutil.inputlimiter(this.$el);

			_.each(this.typeRadioViews, function(item){
				item.view = new CmTypeRadioSelectView(item.options).render();
				this.append(item.view.$el);

				// editList の中から anaFocus を探し、値をセットする。
				var anaFocus = _.find(editList, function(anaFocus){ return (anaFocus.kind == item.options.anaFocusKind); });
				if(anaFocus){
					item.view.setSelectedValue(anaFocus.val);
				}
			}, this.$('#ca_MDCMV1360_searchArea'));

			clutil.datepicker(this.$('#wdperiodFrom'));
			clutil.datepicker(this.$('#wdperiodTo'));

			var wdperiodFocus = _.find(this.anaProc.cond.focuslist, function(focus) {return focus.kind == amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_WDPERIOD});
			var opeDate = clcom.getOpeDate();
			clutil.data2view($('#ca_MDCMV1360_main'), {
				wdperiodFrom: wdperiodFocus ? wdperiodFocus.val : opeDate,
				wdperiodTo: wdperiodFocus ? wdperiodFocus.val2 : opeDate,
			});

			clutil.initUIelement(this.$el);
		},

		/**
		 * 選択画面の初期化処理
		 */
		render: function() {
			var _this = this;

//			var url = "";
//			url = clcom.urlRoot + "/system/app/" + this.screenId + "/" + this.screenId + ".html";
			var url = clcom.getAnaSubPaneURI(this.screenId);

			// HTMLソースを読み込む
			clutil.loadHtml(url, function(data) {
				_this.html_source = data;
			});
		},

		show: function(editList, isSubDialog) {
			var _this = this;

			// MD-4437 評価減対象期間は1990/01/01から設定可能にする
			clcom.min_date = 19900101;

			// 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
			if (isSubDialog == null) {
				$('.cl_dialog').empty();
			}

			this.$parentView.hide();

			// htmlソースからダイアログを作成する
//			this.$el.html('');
			this.$el.html(this.html_source);

			// 画面の初期化
			this.initUIelement(editList);

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_MDCMV1360_main'), {
				echoback		: $('.cl_echoback')
			});
			// フォーカスの設定
			this.setFocus();

			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode({
				view : this.$el
			});
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			// 当てる箇所なし
		},

		// Idより選択されたデータを取得
		getData : function(){
			var viewData = clutil.view2data($('#ca_MDCMV1360_main'));
			return _.union(
				_.reduce(this.typeRadioViews, function(list, typeRadioView){
					var view = typeRadioView.view;
					var anaFocus = (view != null) ? view.getAnaFocus() : null;
					if(anaFocus){
						if (typeRadioView.options.anaFocusKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_ALLSTORE ||
							typeRadioView.options.anaFocusKind == amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_WDSTORE) {
							if (anaFocus.val) {
								list.push(anaFocus);
							}
						} else {
							list.push(anaFocus);
						}
					}
					return list;
				}, []),
				_.filter([
					{
						kind: amgbp_AnaDefs.AMGBA_DEFS_KIND_ITEMATTR_WDPERIOD,
						val: Number(viewData.wdperiodFrom),
						val2: Number(viewData.wdperiodTo),
						name: clutil.dateFormat(viewData.wdperiodFrom, 'yyyy/mm/dd') + '～' + clutil.dateFormat(viewData.wdperiodTo, 'yyyy/mm/dd'),
						name2: '評価減対象期間'
					},
				], function(anaFocus) {return anaFocus.val || anaFocus.val2})
			);
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			if(!this.validator.valid()){
				return;
			}

			this.$parentView.show();
			this.okProc(this.getData());
			this.clear();
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
			// MD-4437 画面を閉じる際に最小日付を戻す
			clcom.min_date = 19900102;
		},

		// 選択時処理  呼び出し側で override する
		okProc : function(){
			// 上位で上書きする。
		},

		/**
		 * キャンセル
		 */
		_onCancelClick: function() {
			this.$parentView.show();
			this.okProc(null);
			this.clear();
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();
			// MD-4437 画面を閉じる際に最小日付を戻す
			clcom.min_date = 19900102;
		},

		clear: function(){
			for(var i = 0; i < this.typeRadioViews.length; i++){
				var x = this.typeRadioViews[i];
				if(x.view){
					x.view.remove();
					x.view = null;
				}
			}
			this.$el.empty();
		}
	});

});
