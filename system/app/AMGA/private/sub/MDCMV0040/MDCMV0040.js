$(function() {

	/**
	 * １条件あたりのセレクタビュークラス
	 */
	MDCMV0040SelectorViewClass = Backbone.View.extend({
		///className: 'fieldgroup',
		contTemplate: _.template(''
			+ '<div class="fieldgroup">'
			+ '<p class="gtitle"><%- typeTypeName %></p>'
			+ '<div class="fieldgroupInBox">'
			+   '<div class="fieldUnit">'
			+	 '<div class="fieldBox">'
			+		'<ul></ul>'
			+	 '</div>'
			+  '</div>'
			+ '</div>'
			+ '</div>'),
			/*
		itemTemplate: _.template(''
			+	'<li>'
			+	'<label class="checkbox ib wt100">'
			+		'<input type="checkbox" id="my_checkbox" />指定する'
			+	'</label>'
			+	'</li>'
			+	'<li>'
			+		'<input type="text" placeholder="" class="form-control wt200 txtar pdgr10 ime-disabled cl_valid" id="my_value1" data-limit="len:4" value="<%- value1 %>" />'
			+	'</li>'
			+	'<li class="pdgt10">'
			+	'<span class="txtInFieldUnit mrgl10 mrgr10">～</span>'
			+	'</li>'
			+	'<li>'
			+		'<input type="text" placeholder="" class="form-control wt200 txtar pdgr10 ime-disabled cl_valid" id="my_value2" data-limit="len:4" value="<%- value2 %>" />'
			+	'</li>'
			),\
		*/
		ctgTemplate: _.template(''
			+ '<div class="fieldUnit required">'
			+ '<p class="fieldName">品種</p>'
			+ '<div class="fieldBox div_ca_MDCMV0040" data-seq=<%- seq %>>'
			+ '	<input type="hidden" class="ca_MDCMV0040_itgrpfunc_id" value="<%- itgrpfunc_id %>" />'
			+ '	<input type="hidden" class="ca_MDCMV0040_itgrplvl_id" value="<%- itgrplvl_id %>" />'
			+ '	<input type="hidden" class="ca_MDCMV0040_itgrp_id" value="<%- itgrp_id %>" />'
			+ '	<input type="hidden" class="ca_MDCMV0040_itgrp_code" value="<%- code %>" />'
			+ '	<input type="hidden" class="ca_MDCMV0040_itgrp_name" value="<%- name %>" />'
			+ '	<input class="form-control wt280 flleft ca_MDCMV0040_itgrpname" type="text" placeholder="" value="<%- codename %>" disabled/>'
			+ '	<button class="btn btn-default wt160 flleft mrgl10 ca_MDCMV0040_show_CACMV0050" id="ca_MDCMV0040_show_CACMV0050">参照...</button>'
			+ '</div>'
			+ '<div class="clear"></div>'
			+ '</div>'
			),

		/**
		 * @param {object}	opt
		 * @param {integer}	opt.anaFocusKind	絞込条件種別値
		 * @param {string}	opt.typeTypeName	絞込条件種別名
		 * @param {integer}	opt.value1			値１
		 * @param {integer}	opt.value2			値２
		 */
		initialize: function(opt){
			_.bindAll(this);
			this.options = opt;
		},
		render: function(){
			var val = {
				seq: 1,
				itgrpfunc_id: "",
				itgrplvl_id: "",
				itgrp_id: "",
				code: "",
				name: "",
				codename: ""
			};
			_.extend(val, this.options.edit);
			if (val.code) {
				val.codename = val.code + ":";
			}
			val.codename += val.name || "";
			var $ul = this.$el.html(this.contTemplate(this.options)).find('ul');
			var $item = $(this.ctgTemplate(val));
			$ul.append($item);

			// 初期選択の設定
			this.setValue(0, 0, 0);

			if(this.options.withInitBootstrap){
				clutil.initUIelement(this.$el);
			}
			return this;
		},
		/** 範囲条件をセットする */
		setValue: function(checked, value1, value2){
			if(checked)
				this.$('#my_checkbox').checkbox('check');
			else
				this.$('#my_checkbox').checkbox('uncheck');
			this.$('#my_value1').val(value1);
			this.$('#my_value2').val(value2);
		},
		/** 範囲条件を AnaFocus 形式で返す。 */
		getAnaFocus: function(){
			var $sel = this.getCheckBox();
console.log("getAnaFocus: $sel="+$sel);
			if( $sel ){
				var $v1 = this.getItem();
				var $v2 = this.getItem2();
				if( this.options.anaFocusKind == amanp_AnaDefs.AMAN_DEFS_KIND_ITEMDATE_AGE ){
					// 商品年齢の場合、0は有効値
					var f = {
						kind: this.options.anaFocusKind,
						val: $v1,
						val2: $v2,
						name2: this.options.typeTypeName,
						name: '' + $v1 + ' ～ ' + $v2
					};
					return f;
				}
				else {
					var f = {
						kind: this.options.anaFocusKind,
						val: $v1,
						val2: $v2,
						name2: this.options.typeTypeName,
						name: '' + $v1 + ' ～ ' + ($v2 != 0 ? $v2 : '')
					};
					return f;
				}
			}
			return null;
		},
		/** 設定された値を返す */
		getItem: function(){
            return Number(this.$('#my_value1').val());
		},
		getItem2: function(){
            return Number(this.$('#my_value2').val());
		},
		getCheckBox: function(){
			return this.$('#my_checkbox').prop('checked');
		}
	});

	//////////////////////////////////////////////
	// View
	MDCMV0040SelectorView = Backbone.View.extend({

		screenId : "MDCMV0040",
		validator: null,

		// 押下イベント
		events: {
			"click .ca_MDCMV0040_show_CACMV0050"	:	"_onShowCACMV0050Click",		// 商品分類選択ボタン押下

			"click #ca_MDCMV0040_commit"			:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_MDCMV0040_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_MDCMV0040_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_MDCMV0040_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
		},

		typeRadioViews: [
			{
				options: {
					typeTypeName: '商品展開年',
					anaFocusKind: amanp_AnaDefs.AMAN_DEFS_KIND_ITEMDATE_YEAR,
					value1: null,
					value2: null
				},
				view: null
			},
			{
				options: {
					typeTypeName: '商品年齢',
					anaFocusKind: amanp_AnaDefs.AMAN_DEFS_KIND_ITEMDATE_AGE,
					value1: null,
					value2: null
				},
				view: null
			},
			{
				options: {
					typeTypeName: '初回投入年',
					anaFocusKind: amanp_AnaDefs.AMAN_DEFS_KIND_ITEMDATE_FIRST,
					value1: null,
					value2: null
				},
				view: null
			}
		],

		initialize: function(opt) {
			var defaults = {
				isAnalyse_mode: true,					// 分析画面で利用
				ctg_num: 1
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function(editList, option) {
			clutil.setMainColumnScrollbar(this.$('#mainColumn'), this.isAnalyse_mode);
			clutil.inputlimiter(this.$el);

			var i;
			var ctg_num = this.ctg_num;
			if (option != null && option.length > 0) {
				for (i = 0; i < option.length; i++) {
					if (option[i].kind == amanp_AnaDefs.AMAN_DEFS_KIND_RCPT_QY) {
						ctg_num = parseInt(option[i].val);
						break;
					}
				}
			}
			/*
			 * 1. optの品種数でループ
			 * 2. それぞれでViewを作ってappend
			 */
			var $searchArea = this.$('#ca_MDCMV0040_searchArea');
			for (i = 0; i < ctg_num; i++) {
				var edit = editList[i];
				var opt = {
					typeTypeName: "品種" + (i+1),
					seq: i,
					edit: {
						kind: amanp_AnaDefs.AMAN_DEFS_KIND_RCPT_ITGRP,
						itgrpfunc_id: null,
						itgrplvl_id: null,
						itgrp_id: null,
						code: "",
						name: "",
						seq: i
					}
				};
				if (edit != null) {
					_.extend(opt.edit, edit);
				}
				var view = new MDCMV0040SelectorViewClass(opt);
				view.render();
				$searchArea.append(view.$el);
			}

			// 商品分類選択画面
			this.MDCMV0040_CACMV0050Selector = new  CACMV0050SelectorView({
				el : this.$('#ca_MDCMV0040_CACMV0050_dialog'),	// 配置場所
				$parentView		: this.$('#ca_MDCMV0040_main'),
				isAnalyse_mode	: this.isAnalyse_mode,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
				select_mode		: clutil.cl_single_select,	// 単一選択モード
				max_level		: amcm_type.AMCM_VAL_ITGRP_LEVEL_CTG,	// 品種
				anaProc			: this.anaProc
			});
			this.MDCMV0040_CACMV0050Selector.render();

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

		show: function(editList, isSubDialog, option) {
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
			this.initUIelement(editList, option);

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_MDCMV0040_main'), {
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
			var editList = [];
			_.each(this.$el.find('.div_ca_MDCMV0040'), _.bind(function(tgt) {
				var $div = $(tgt);
				var $func_id = $div.find('input.ca_MDCMV0040_itgrpfunc_id');
				var $lvl_id = $div.find('input.ca_MDCMV0040_itgrplvl_id');
				var $itgrp_id = $div.find('input.ca_MDCMV0040_itgrp_id');
				var $itgrp_code = $div.find('input.ca_MDCMV0040_itgrp_code');
				var $itgrp_name = $div.find('input.ca_MDCMV0040_itgrp_name');
				var f_id = $func_id.val();
				var l_id = $lvl_id.val();
				var i_id = $itgrp_id.val();
				var code = $itgrp_code.val();
				var name = $itgrp_name.val();
				var seq = $div.data('seq');
				var obj = {
					kind: amanp_AnaDefs.AMAN_DEFS_KIND_RCPT_ITGRP,
					itgrpfunc_id: f_id,
					itgrplvl_id:  l_id,
					itgrp_id:     i_id,
					val:          i_id,
					id:           i_id,
					code:         code,
					name:         name,
					seq:          seq
				};
				editList.push(obj);
			}, this));
			var obj = {};
			return editList;
		},

        // 画面入力値をチェック
        checkData : function(){
            var haserror = 0;
            var data = this.getData();
            if (data == null || data.length == 0) {
            	return 1;
            }
            for (var i = 0; i < data.length; i++) {
            	if (!data[i].id) {
            		haserror++;
            	}
            }
            return haserror;
        },


		/**
		 * 商品分類選択ボタン押下
		 */
		_onShowCACMV0050Click: function(e) {
			var _this = this;
			var $button = $(e.target);
			var $pdiv = $button.parent();
			var $name = $pdiv.find("input.ca_MDCMV0040_itgrpname");
			var $func_id = $pdiv.find("input.ca_MDCMV0040_itgrpfunc_id");
			var $lvl_id = $pdiv.find("input.ca_MDCMV0040_itgrplvl_id");
			var $itgrp_id = $pdiv.find("input.ca_MDCMV0040_itgrp_id");
			var $itgrp_code = $pdiv.find("input.ca_MDCMV0040_itgrp_code");
			var $itgrp_name = $pdiv.find("input.ca_MDCMV0040_itgrp_name");

			// 選択された情報を初期値として検索する
			var initData = {};
			initData.func_id = $func_id.val();
			initData.itgrp_id = $itgrp_id.val();

			if (this.isAnalyse_mode) {
				// 分析条件部分を閉じる
				clutil.closeCondition();
			}

			lvl = {
				lvl_id: amcm_type.AMCM_VAL_ITGRP_LEVEL_CTG,
			};
			this.MDCMV0040_CACMV0050Selector.show(null, true, null, lvl, initData);
			//サブ画面復帰後処理
			this.MDCMV0040_CACMV0050Selector.okProc = function(data) {
				if(data != null && data.length > 0) {
					$name.val(data[0].code + ":" + data[0].name);
					$itgrp_id.val(data[0].val);
					$func_id.val(data[0].func_id);
					$lvl_id.val(data[0].lvl_id);
					$itgrp_code.val(data[0].code);
					$itgrp_name.val(data[0].name);
				}
				// ボタンにフォーカスする
				$button.focus();
			}
		},

		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			if(!this.validator.valid()){
				return;
			}
			if( this.checkData() > 0 ){
				this.validator.setErrorHeader('品種が未選択です。');
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
