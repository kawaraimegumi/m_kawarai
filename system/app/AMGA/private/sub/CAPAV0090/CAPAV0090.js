$(function() {
	//////////////////////////////////////////////
	// View
	CAPAV0090PanelView = Backbone.View.extend({
		// 押下イベント
		events: {
		},

		initialize: function(opt) {
			_.extend(this, opt);
			_.bindAll(this);

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback')
			});

			// すべて開く、すべて閉じる
			this.ExpandView = new AnaNaviItemView({
				el: '<span class="ca_expand expandAll dispn">すべて開く</span>' +
				'<span class="ca_expand unexpandAll">すべて閉じる</span><div class="clear"></div>'
			}).on('onNaviItemClick', this.expandViewClick);

			// ナビメニューのView
			this.navSaveCondItemView = new AnaNaviItemView({
				el: '<p class="save closeCondition"><a id="a_condsave" data-intro="分析条件を保存します。（分析カタログに登録されます。）" data-step="30" data-position="top" class="scroll_flg">条件を保存</a></p>'
			}).on('onNaviItemClick', this.navSaveCondItemClick);

			this.navUpdateCondItemView = new AnaNaviItemView({
				el: '<p class="save closeCondition"><a data-intro="分析条件を上書き保存します。（分析カタログに登録されます。）" data-step="30" data-position="top" class="scroll_flg">上書き保存</a></p>'
			}).on('onNaviItemClick', this.navUpdateCondItemClick);

			this.navResultItemView = new AnaNaviItemView({
				el: '<p class="apply closeCondition"><a data-intro="分析を開始し、画面右側へ結果を表示します。" data-step="40" data-position="top" class="scroll_flg">この条件で分析</a></p>',
				notificationOff: true
			}).on('onNaviItemClick', this.navResutltItemClick);

			this.navClearItemView = new AnaNaviItemView({
				el: '<p><button class="btn btn-default wt140 flright reset" id="ca_clear">条件をリセット</button></p>',
				notificationOff: true
			}).on('onNaviItemClick', this.navClearItemClick);
		},

		/**
		 * 画面描写
		 */
		render: function() {
			this.$expand_view
			.append(this.ExpandView.render().$el);

			if (this.anaProc.catalog_id != 0) {
				this.$result_view
				.append(this.navSaveCondItemView.render().$el)
				.append(this.navUpdateCondItemView.render().$el)
				.append(this.navResultItemView.render().$el);

				this.$result_view.children('p.save').css('width', '120px');
				this.$result_view.children('p.apply').css('width', '340px');
				this.$result_view.children('p.save').children("#a_condsave").text("別名保存");
			} else {
				this.$result_view
				.append(this.navSaveCondItemView.render().$el)
				.append(this.navResultItemView.render().$el);
			}

			this.$clear_view
			.append(this.navClearItemView.render().$el);

			this.initUIelement();

			// ガイダンスのテキスト設定
			if(this.anaProc && !_.isEmpty(this.anaProc.guide)){
				$('.guidance').text(this.anaProc.guide).show();
			}else{
				$('.guidance').hide();
			}

			return this;
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

			// カタログ登録画面
			this.CACTV0010Selector = new  CACTV0010SelectorView({
				el : $('#ca_CACTV0010_dialog'),	// 配置場所
				$parentView		: this.$parentView,
//				isAnalyse_mode	: true,			// 分析ユースかどうかフラグ？？？
//				ymd				: null,			// 検索日
//				select_mode		: clutil.cl_multiple_select,	// 複数選択モード
				anaProc			: this.anaProc,
				isMDAnalyze		: this.isMDAnalyze
			});
			this.CACTV0010Selector.render();

			var _this = this;

			// エクスパンダ押下
			$(".ca_expand").click(function(e){
				_this.expandViewClick(e);
			});

			//条件をリセットボタンのアクションを追加 5/1
			$('#leftColumn').find('button.reset').mousedown(function(){
				$(this).addClass('active');
			});
			$('#leftColumn').find('button.reset').mouseup(function(){
				$(this).removeClass('active');
			});

		},

		// 表示押下 - this.navResultItemView のクリックイベントに関連付けしている。
		navResutltItemClick: function(e) {
			if(!this.isValidCond(this.anaProc)){
				// アプリ層の条件チェック
				return;
			}
			this.navResultItemView.setActive();

			if(this.anaProc){
				var deferred = this.anaProc.doSearch();
				deferred.done(_.bind(function(data){
					if(_.isObject(data.head) && _.isNumber(data.head.status)
							&& data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK){
						// 結果画面を表示する。データは anaProc が仲介するので引数不要。
						console.log('### CAPAV0090: anaProc.doSearch(), OK ###');
						this.anaProc.trigger('onSearchCompleted', this.anaProc);
					}
				},this));
				deferred.fail(_.bind(function(data){
					// clutil.postAnaJSON の内部の作りから、data.head.status を見て
					// STATUS_OK 以外の場合のみ、fail が呼ばれる。
					if(_.isObject(data.head) && _.isNumber(data.head.status)
							&& data.head.status !== am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK){
						console.log('### CAPAV0090: anaProc.doSearch(), status[' + data.head.status + '] failed[' + data.head.message + '] ###');
						this.validator.setErrorInfo({_eb_:clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
					}
				}, this));
			}
		},

		// 条件登録押下
		navSaveCondItemClick: function(e) {
			var _this = this;
			this.navSaveCondItemView.setActive();

			this.CACTV0010Selector.show();

			//サブ画面復帰後処理
			this.CACTV0010Selector.okProc = _.bind(function(data) {
				// ボタンにフォーカスする
				$(e.target).focus();

				_this.navSaveCondItemView.unsetActive();
			},this);
		},

		// 条件登録押下
		navUpdateCondItemClick: function(e) {
			var _this = this;
			var user_id = clcom.getUserData().user_id;

			if (this.anaProc.catalog != null && this.anaProc.catalog.cre_staff_id == user_id) {
				var msg = "カタログ［" + this.anaProc.catalog.name + "］を上書きします。<br>よろしいですか？";
				clutil.ConfirmDialog(msg, this._onUpdateConfirm, this._onUpdateCancel);
			} else {
				this.navSaveCondItemView.setActive();

				this.CACTV0010Selector.show();

				//サブ画面復帰後処理
				this.CACTV0010Selector.okProc = _.bind(function(data) {
					// ボタンにフォーカスする
					$(e.target).focus();

					_this.navSaveCondItemView.unsetActive();
				},this);
			}
		},

		_onUpdateConfirm: function() {
			console.log("上書き実行");
			// 画面の情報を取得する
			var resultdata = clutil.view2data($('#ca_CACTV0010_base_form'), 'ca_CACTV0010_');

			resultdata['id'] = this.anaProc.catalog.id;
			resultdata['name'] = this.anaProc.catalog.name;
			resultdata['f_open'] = this.anaProc.catalog.f_open;
			resultdata['updcnt'] = this.anaProc.catalog.updcnt;
			resultdata['anamenunode_id'] = this.anaProc.catalog.anamenunode_id;
			resultdata['guide'] = this.anaProc.catalog.guide;
			resultdata['f_anacond'] = this.anaProc.catalog.f_anacond;

			// 条件を登録
			resultdata['condstr'] = JSON.stringify(this.anaProc.cond);
			// 機能ID
			resultdata['func_id'] = this.anaProc.func_id;
			// 分析種別ID
			resultdata['anakind'] = this.anaProc.f_anakind;

			resultdata['f_period_unit'] = this.anaProc.catalog.f_period_unit;
			// 絶対指定か相対指定か
			resultdata['f_period_type'] = this.anaProc.catalog.f_period_type;

			resultdata['period_val1'] = this.anaProc.catalog.period_val1;
			resultdata['period_val2'] = this.anaProc.catalog.period_val2;

			var _this = this;

			var req = {
					rtype : am_proto_defs.AM_PROTO_COMMON_RTYPE_TMPSAVE,
					catalog : resultdata
			};

			var uri = 'gsan_ct_catalog_upd';
			clutil.postAnaJSON(uri, req, _.bind(function(data, dataType) {
				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					var menustore = clcom.getMenuStore();
					if(menustore != null) {
						// カタログ更新フラグを立てる
						menustore.catalog_upd = true;
						clcom.setMenuStore(menustore);
					}

					// 更新完了ダイアログを出す
					clutil.updMessageDialog(_this.updConfirmcallback, null);

				} else {
					// ヘッダーにメッセージを表示
					_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clutil.getclmsg(data.head.message), data.head.args)});
				}
			}, this));
		},

		_onUpdateCancel: function() {
			console.log("キャンセル");
		},

		// 条件クリア押下
		navClearItemClick: function(e) {
			//this.navClearItemView.setActive();
			if(this.anaProc){
				this.anaProc.resetCond();
			}
		},

		// エクスパンダ押下
		expandViewClick: function(e) {
			var isExpand = $(e.target).hasClass('unexpandAll');
			var div = $(e.target).closest('div');
			var tablediv = $(div).closest('div.table');

			var table;
			// 全顧客にチェックが入っていたら会員パネルを除いたパネルを取得
			if ($("#ca_CAPAV0040_custall_chk").prop('checked')) {
				table = $(tablediv).find('table.tree').not('#ca_CAPAV0040_view');
			} else {
				table = $(tablediv).find('table.tree');
			}

			if (isExpand) {
				// すべて開くを表示してすべてのエクスパンダを閉じる
				$(div).find('span.expandAll').removeClass('dispn');
				$(div).find('span.unexpandAll').addClass('dispn');

				var span = $(table).find('span.treeClose');
				$(span).removeClass('treeClose');
				$(span).addClass('treeOpen');
				$(table).find('tr.ca_button').hide();
				$(table).find('tr.ca_condview').hide();
			} else {
				// すべて閉じるを表示してすべてのエクスパンダを開く
				$(div).find('span.expandAll').addClass('dispn');
				$(div).find('span.unexpandAll').removeClass('dispn');

				var span = $(table).find('span.treeOpen');
				$(span).removeClass('treeOpen');
				$(span).addClass('treeClose');
				$(table).find('tr.ca_button').show();
				$(table).find('tr.ca_condview').show();
			}
		},

		/**
		 * 分析エンジン呼出前に画面独自の必須条件チェックを行いたい場合は、
		 * この関数をオーバーライドする。
		 * @return true: 続行して分析エンジンを呼び出す。、false: 分析実行を抑止する。
		 */
		isValidCond: function(anaproc){
			return true;
		}
	});
});
