$(function() {

	/**
	 * １条件あたりのセレクタビュークラス
	 */
	CACMV0330SelectorViewClass = Backbone.View.extend({
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
			var $ul = this.$el.html(this.contTemplate(this.options)).find('ul');
			var $item = $(this.itemTemplate(this.options));
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
	CACMV0330SelectorView = Backbone.View.extend({

		screenId : "CACMV0330",
		validator: null,

		// 押下イベント
		events: {
			"click #ca_CACMV0330_commit"			:	"_onCommitClick",		// 確定ボタン押下

			"click #ca_CACMV0330_main .close"		:	"_onCancelClick",	// 閉じるボタン押下時
			"click #ca_CACMV0330_cancel"			:	"_onCancelClick",	// キャンセルボタン押下時
			"click #ca_CACMV0330_main .modalBK"		:	"_onCancelClick"	// 枠外押下時
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
				item.view = new CACMV0330SelectorViewClass(item.options).render();
				this.append(item.view.$el);

				// editList の中から anaFocus を探し、値をセットする。
				var anaFocus = _.find(editList, function(anaFocus){ return (anaFocus.kind == item.options.anaFocusKind); });
				if(anaFocus){
					var $checked = 0;
					if( anaFocus.kind == amanp_AnaDefs.AMAN_DEFS_KIND_ITEMDATE_AGE ){
						$checked = 1;	// 0は有効値
					}
					else {
						if( (anaFocus.val != null && anaFocus.val != 0) ||
						    (anaFocus.val2 != null && anaFocus.val2 != 0) ){
							$checked = 1;
						}
					}
					item.view.setValue($checked, anaFocus.val, anaFocus.val2);
				}
			}, this.$('#ca_CACMV0330_searchArea'));

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
			this.validator = clutil.validator(this.$('#ca_CACMV0330_main'), {
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
			//var editList = clutil.view2data(this.$('#ca_CACMV0330_searchArea'), 'ca_CACMV0330_');
			var editList = _.reduce(this.typeRadioViews, function(list, typeRadioView){
				var view = typeRadioView.view;
				var anaFocus = (view != null) ? view.getAnaFocus() : null;
				if(anaFocus){
					if(anaFocus.kind == amanp_AnaDefs.AMAN_DEFS_KIND_ITEMDATE_AGE){
						// 0は有効値
						list.push(anaFocus);
					}
					else {
				   		if((anaFocus.val != null && anaFocus.val != 0) ||
						   (anaFocus.val2 != null && anaFocus.val2 != 0)){
							list.push(anaFocus);
						}
					}
				}
				return list;
			}, []);
			return editList;
		},

        // 画面入力値をチェック
        checkData : function(){
            var haserror = 0;
            var ii;
            for( ii=0; ii < this.typeRadioViews.length; ii++ ){
                var view = this.typeRadioViews[ii].view;
                var anaFocus = (view != null) ? view.getAnaFocus() : null;
                if(anaFocus){
                    this.validator.clearErrorMsg(view.$('#my_value1'));
                    this.validator.clearErrorMsg(view.$('#my_value2'));
					if(anaFocus.kind == amanp_AnaDefs.AMAN_DEFS_KIND_ITEMDATE_AGE){
						// ゼロは有効値
						var v1 = (anaFocus.val == null ? 0 : anaFocus.val);
						var v2 = (anaFocus.val2 == null ? 0 : anaFocus.val2);
						if( v1 > v2 ){
							this.validator.setErrorMsg(view.$('#my_value1'), '年齢の範囲指定が不正です（空白は０歳指定となります）');
							this.validator.setErrorMsg(view.$('#my_value2'), '年齢の範囲指定が不正です（空白は０歳指定となります）');
							haserror++;
						}
					}
					else {
						if((anaFocus.val != null && anaFocus.val != 0) ||
						   (anaFocus.val2 != null && anaFocus.val2 != 0)){
							// 大小比較
							var v1 = (anaFocus.val == null ? 0 : anaFocus.val);
							var v2 = (anaFocus.val2 == null ? 0 : anaFocus.val2);
							if( v1 > 0 && v2 > 0 && v1 > v2 ){
								this.validator.setErrorMsg(view.$('#my_value1'), '年の範囲指定が不正です');
								this.validator.setErrorMsg(view.$('#my_value2'), '年の範囲指定が不正です');
								haserror++;
							}
						}
					}
				}
            }
            return haserror;
        },


		/**
		 * 確定ボタン押下
		 */
		_onCommitClick: function() {
			if(!this.validator.valid()){
				return;
			}
			if( this.checkData() > 0 ){
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
