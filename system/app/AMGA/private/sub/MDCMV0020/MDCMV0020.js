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
	MDCMV0020SelectorView = Backbone.View.extend({

		screenId : "MDCMV0020",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_MDCMV0020_commit"			:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_MDCMV0020_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_MDCMV0020_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_MDCMV0020_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
		},

		typeRadioViews: [
			{
				options: {
					typeTypeName: '閉店店舗',
					typeList: clcom.getTypeList(amcm_type.AMCM_TYPE_ANA_STOREATTR_CLOSED),
					defaultSelectedTypeVal: amcm_type.AMCM_VAL_ANA_STOREATTR_CLOSED_EXCLUDE,
					anaFocusKind: amanp_AnaDefs.AMAN_DEFS_KIND_STOREATTR_CLOSED
				},
				view: null
			},
			{
				options: {
					typeTypeName: '店舗並び順',
					typeList: clcom.getTypeList(amcm_type.AMCM_TYPE_ANA_STORE_SORT),
					defaultSelectedTypeVal: amcm_type.AMCM_VAL_ANA_STORE_SORT_CODE,
					anaFocusKind: amanp_AnaDefs.AMAN_DEFS_KIND_STORE_SORT
				},
				view: null
			},
			{
				options: {
					typeTypeName: '新店ロジック',
					typeList: clcom.getTypeList(amcm_type.AMCM_TYPE_ANA_NEWSTORE_LOGIC),
					defaultSelectedTypeVal: amcm_type.AMCM_VAL_ANA_NEWSTORE_LOGIC_BAISOKU,
					anaFocusKind: amanp_AnaDefs.AMAN_DEFS_KIND_NEWSTORE_LOGIC
				},
				view: null
			},
			{
				options: {
					typeTypeName: '新店/既存店条件',
					typeList: clcom.getTypeList(amcm_type.AMCM_TYPE_ANA_NEWSTORE_COND),
					defaultSelectedTypeVal: amcm_type.AMCM_VAL_ANA_NEWSTORE_COND_NOP,
					anaFocusKind: amanp_AnaDefs.AMAN_DEFS_KIND_NEWSTORE_COND
				},
				view: null
			},
			{
				options: {
					typeTypeName: 'SMX店舗',
					typeList: clcom.getTypeList(amcm_type.AMCM_TYPE_ANA_STOREATTR_SMX),
					defaultSelectedTypeVal: amcm_type.AMCM_VAL_ANA_STOREATTR_SMX_NOP,
					anaFocusKind: amanp_AnaDefs.AMAN_DEFS_KIND_STOREATTR_SMX
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
			}, this.$('#ca_MDCMV0020_searchArea'));

			clutil.datepicker(this.$('#exist_iymd'));
			clutil.datepicker(this.$('#close_iymd'));

			var cond = this.anaProc.cond.dispopt;
			clutil.data2view($('#ca_MDCMV0020_main'), {
				exist_iymd: cond.exist_iymd,
				close_iymd: cond.close_iymd,
			});

			if (this.anaProc.func_code == "AMGAV2120" || this.anaProc.func_code == "AMGAV2110" || this.anaProc.func_code == "AMGAV2130") {
				$("#ca_MDCMV0020_dateArea").show();
			} else {
				$("#ca_MDCMV0020_dateArea").hide();
			}

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
			this.validator = clutil.validator(this.$('#ca_MDCMV0020_main'), {
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
			var viewData = clutil.view2data($('#ca_MDCMV0020_main'));
			var editList = _.reduce(this.typeRadioViews, function(list, typeRadioView){
				var view = typeRadioView.view;
				var anaFocus = (view != null) ? view.getAnaFocus() : null;
				if(anaFocus){
					list.push(anaFocus);
				}
				return list;
			}, []);
			return {
				anaFocus: editList,
				cond: {
					exist_iymd: viewData.exist_iymd || 0,
					close_iymd: viewData.close_iymd || 0
				}
			};
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
