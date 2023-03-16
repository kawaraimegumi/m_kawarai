useSelectpicker2();

$(function(){
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	var timer = false;
	$(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			if (!_.isUndefined(mainView) && !_.isUndefined(mainView.grid) && !_.isUndefined(mainView.grid.grid)){
				mainView.grid.grid.resizeCanvas();
			}
		}, 100);
	});

	Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate){
		return _.template(rawTemplate, null, {variable: 'it'});
	};

	var myHdrFormatter = function(value, options){
		var label = '&nbsp;';
		var spanSize = 0;
		var templateType = 0;
		var template = Marionette.TemplateCache.get('#HdrCell');

		if(options.row == 0){
			templateType = 0;
			label = '<div class="viewAll">全て表示</div>';
		}else if(options.row == 1 && options.cell >= 3){
			templateType = 1;
			label = value;

			if (options.itemMetadata.columns[options.columnDef.id].colspan == '1'){
				spanSize = 120;
			}else{
				spanSize = 240;
			}
		}else if (options.cell < 3){
			templateType = 0;
			label = value;
		}else{
			templateType = 1;
		}

		return template({
			label		: label,
			spanSize	: spanSize,
			templateType: templateType,
			value		: value,
		});
	};

	myHdrFormatter.initialize = function(grid, dataView, vent){
		grid.onClick.subscribe(function(e, args){
			var $target = $(e.target);
			var ev;
			if($target.is(".deleteRow .viewAll")){
				if(args.grid.getColumns().length > 3){
					ev = ClGrid.Formatters.buildEvent(args, grid, dataView);
					vent.trigger("formatter:hidePeriod:click", ev);
				} else {
					// これ以上短くしない
				};
			} else if ($target.is(".viewAll")){
				ev = ClGrid.Formatters.buildEvent(args, grid, dataView);
				vent.trigger("formatter:showAll:click", ev);
			}
		});
	};

	ClGrid.Formatters.myHdrFormatter = myHdrFormatter;


	// 条件入力部
	var SrchCondView = Backbone.View.extend({
		el: $('#ca_srchArea'),
		events: {
			'click #ca_srch'			: '_onSrchClick',			// 検索ボタン押下時
			'change #ca_srchUnitID'		: '_onSrchParamChanged',	// 事業ユニット変更
			'change #ca_srchPlanType'	: '_onSrchParamChanged',	// 計画変更
			'change #ca_srchPeriod'		: '_onSrchParamChanged',	// 年度変更
			'change #ca_srchBranch'		: '_onSrchParamChanged',	// ブランチ変更
		},

		initialize: function(opt){
			_.bindAll(this);

			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$el, {
				echoback		: $('.cl_echoback').hide()
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			clutil.inputlimiter(this.$el);

			// 事業ユニット取得
			this.utl_unit = clutil.clbusunitselector({
				el: '#ca_srchUnitID',
				initValue: clcom.userInfo.unit_id,
			});

			// 計画
			this.utl_equipType = clutil.cltypeselector({
				el		: '#ca_srchPlanType',
				kind	: amcm_type.AMCM_TYPE_OPERPLANTYPE,
				ids		: [
					 amcm_type.AMCM_VAL_OPERPLANTYPE_YEAR,
					 amcm_type.AMCM_VAL_OPERPLANTYPE_MONTH,
				],
	    	});

			// 対象期間 FIXME 暫定
			this.utl_period = clutil.clyearselector(
				this.$("#ca_srchPeriod"),
				0,
				2,//clutil.getclsysparam('PAR_AMCM_YEAR_FROM'),
				2,
				"年度");
			this.init_ope_year = clutil.dateFormat(clcom.getOpeDate(), 'yyyy');

			// ブランチ
			this.utl_branch = clutil.cltypeselector({
				el: '#ca_srchBranch',
				kind: amcm_type.AMCM_TYPE_PLAN_BRANCH_TYPE,
	    	});

			var verList = new Array();
			clutil.cltypeselector2($('#ca_srchVersion'), verList, 0, 1, 'id', 'name', 'code');

			// 初期値を設定
			this.deserialize({
				srchUnitID: clcom.userInfo.unit_id,
			});

			// 初期フォーカスオブジェクト設定
			this.$tgtFocus = $('#ca_srchUnitID');

			// 初期活性制御
			this.setDefaultEnabledProp();

			// ツールチップ
			$("#ca_tp_srchBranch").tooltip({html: true});

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);
		},

		/**
		 * UI の設定値から、検索リクエストパケットを生成する。
		 */
		serialize: function(){
			return clutil.view2data(this.$el);
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

		setDefaultEnabledProp: function() {
			clutil.viewReadonly($("#div_ca_srchVersion"));

			if (clcom.userInfo.user_typeid != amcm_type.AMCM_VAL_USER_STAFF_SYS){
				if (clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE ||
					clcom.userInfo.user_typeid == amcm_type.AMCM_VAL_USER_STORE_MAN) {
					$("#div_ca_unit").hide();
				}else{
					if (clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
						clutil.viewReadonly($("#div_ca_unit"));
						this.$tgtFocus = $('#ca_srchPlanType');
					}
				}
			}
		},

		/**
		 * 指定プロパティ名（ ⇔ 検索 Req 上のメンバ名）の UI 設定値を取得する。
		 * defaultVal は、設定値が無い場合に返す値。
		 */
		getValue: function(propName, defaultVal){
			if(_.isUndefined(defaultVal)){
				defaultVal = null;
			}
			if(!_.isString(propName) || _.isEmpty(propName)){
				return defaultVal;
			}
			var dto = this.serialize();
			var val = dto[propName];
			return (_.isUndefined(val) || _.isNull(val) || _.isEmpty(val)) ? defaultVal : val;
		},

		/**
		 * 入力状態が正しいかどうかチェック。
		 */
		isValid: function(){
			var hasError = !this.validator.valid();

			if (typeof this.versionList != 'undefined' &&
					this.versionList != null &&
					this.versionList.length > 0 &&
					$('#ca_srchVersion').val() == 0){

				this.validator.setErrorMsg($('#ca_srchVersion'), clmsg.cl_required);

				hasError = true;
			} else {
				if (!hasError){
					this.validator.clearErrorMsg($('#div_ca_srchVersion').find('.cl_error_field'));
				}
			}

			return !hasError;
		},

		/**
		 * 検索ボタン押下処理
		 */
		_onSrchClick: function(e) {
			// 取引先コード・オートコンプリート設定チェック
			if(!this.isValid()){
				return;
			}

			if ($("#ca_srchArea").find('.cl_error_field').length > 0){
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return;
			}

			mainView.mdBaseView.setSubmitEnable(false);
			$("#mainColumnFooter").find(".cl_download").attr('disabled', false);

			var dto = this.serialize();

			if ((typeof this.versionList == 'undefined') ||
				(this.versionList != 'undefined' && this.versionList == null) ||
				(this.versionList != 'undefined' && this.versionList != null && this.versionList.length == 0))
			{
				dto.srchVersion = -1;
			}

			clutil.mediator.trigger('ca_onSearch', dto);
		},

		_onSrchParamChanged: function(e) {
			var unitID = Number($("#ca_srchUnitID").val());
			var plan = Number($("#ca_srchPlanType").val());
			var period = Number($("#ca_srchPeriod").val());
			var branch = this.utl_branch.getValue();

			if (unitID > 0 && plan > 0 && period > 0 && branch > 0){
				var dto = this.serialize();
				dto.srchVersion = 0;
				clutil.mediator.trigger('ca_onSearch', dto);
			}
		},

		_eof: 'AMBPV0010.SrchCondView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),
		validator : null,
		events: {
			'click #searchAgain'		: '_onSearchAgainClick',	// 検索条件を再指定ボタン押下
			//'click #ca_csv_download'	: '_onSampleDLClick',		// ExcelサンプルDLボタン押下
		},

		sampleURL: "/public/sample/営業計画策定サンプル.xlsx",

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
					title		: '営業計画',
					subtitle	: '策定',
					opeTypeId: o.opeTypeId,
					pageCount: o.chkData.length,
					buildSubmitReqFunction: this._buildSubmitReqFunction,
					buildGetReqFunction: (o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
							? this._buildGetReqFunction : undefined,
					btn_csv		: true,
					btn_cancel: {label:'条件再設定', action:this._doCancel},
				};
				return mdOpt;
			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 検索パネル
			this.srchCondView = new SrchCondView({el: this.$('#ca_srchArea')});

			// イベント
			clutil.mediator.on('ca_onSearch', this._onSrch);			// 検索パネル srchCondView から検索ボタン押下イベント

			// OPE系イベント
			clutil.mediator.on('onOperation', this._doOpeAction);

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				// fall through
			default:
				// 新規登録以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			}
		},

		initGrid:function(){
			this.grid = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid',	// エレメント
				lineno			: false,			// 行番号表示する/しないフラグ。
				delRowBtn		: false,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: false,			// フッター部の新規行追加ボタンを使用するフラグ。
			});

			this.grid.getHeadMetadata = this.getHeadMetadata;
			this.grid.getMetadata = this.getMetadata;

			// イベント設定
			this.listenTo(this.grid, this.gridEvents);

			this.grid.render();
		},

		getHeadMetadata: function(rowIndex){
			return {
				columns: {
					storename:
					{
						cssClasses		: 'bdrTpColor',
					},
				}
			};
		},

		getMetadata: function(rowIndex){
			if (rowIndex == 0) {
				return {
					cssClasses: 'reference',
					columns: {
						storename:
						{
							cssClasses		: 'align-left',
						},
					}
				};
			}
		},

		createGridData: function(){
			var hdColL1 = {};
			var hdColL2 = {};
			var bdCol = [];
			var id_store = 'storename';

			hdColL1[id_store] = {
				name	: '',
			};
			hdColL2[id_store] = {
					name	: '店舗名',
				};

			bdCol.push({
				id		: id_store,
				//name	: '店舗名',
				field	: id_store,
				width	: 200,
			});

			var id = '0_sale';
			hdColL1[id] = {
				colspan	: '*',
				name	: '',
			};

			$.each(this.dispData.header.col, function(){
				var period = (this.colIndex == 0) ? '0' : this.period;
				var id = '';
				var colspan = '2';

				if (!this.hiddenSale && this.hiddenRate){
					id = '' + period + '_sale';
					colspan = '1';
				} else if (this.hiddenSale && !this.hiddenRate){
					id = '' + period + '_rate';
					colspan = '1';
				}else{
					id = '' + period + '_sale';
					colspan = '2';
				}

				if (!this.hiddenSale || !this.hiddenRate){
					var column = {
						colspan	: colspan,
						name	: this.periodDisp,
					};

					hdColL2[id] = column;
				}
			});

			$.each(this.dispData.header.cell, function(){
				var period = (this.colIndex == 0) ? '0' : this.period;
				var id_s = '' + period + '_sale';
				var id_r = '' + period + '_rate';

				var sale = {
					id				: id_s,
					name			: '売上高',
					field			: id_s,
					cssClass		: 'txtalign-right',
					width			: 120,

					headCellType: {
						formatter: 'myHdrFormatter'
					},

					cellType 		:
					{
						type			: 'text',
						limit			: "number:12",
						validator		: "min:0",
						formatFilter	: "comma",
						editorOptions	:
						{
							addClass: 'txtar',
						},
						isEditable		: function(item, row, column, dataView){
							return (row == 3 || (column.id == '0_sale' || column.id == '0_rate')) ? false : true;
						},
					},
				};

				var phRate = clutil.getclsysparam('PAR_AMCM_DEFAULT_PERCENT_DECIMAL');
				var rate = {
					id				: id_r,
					name			: '荒利率(%)',
					field			: id_r,
					cssClass		: 'txtalign-right',
					width			: 120,

					headCellType: {
						formatter: 'myHdrFormatter'
					},

					cellType 		:
					{
						type			: 'text',
						limit			: "number:2,1",
						validator		: "min:0",
						formatFilter	: "comma fixed:1",
						editorOptions	:
						{
							addClass	: 'txtar',
							attributes	:
							{
								placeholder	: phRate,
							}
						},
						isEditable		: function(item, row, column, dataView){
							return (row == 3 || (column.id == '0_sale' || column.id == '0_rate')) ? false : true;
						},
					},
				};

				if (!this.hiddenSale){
					bdCol.push(sale);
				}
				if (!this.hiddenRate){
					bdCol.push(rate);
				}
			});

			this.gridData = new Array();
			$.each(this.dispData.body, function(){
				var obj = {};
				if (this.type > 1){
					obj[id_store] = this.orgCode + ':' + this.orgName;
				}else{
					obj[id_store] = '全店合計';
				}

				$.each(this.list, function(){
					var id_s = '' + this.period + '_sale';
					var id_r = '' + this.period + '_rate';

					obj[id_s] = this.storeSaleDisp;
					obj[id_r] = this.storeProfitRate;
				});

				mainView.gridData.push(obj);
			});

			this.colhdMetadatas =
			[
				{ columns: hdColL1 },
				{ columns: hdColL2 },
			 ];

			this.columns = bdCol;
		},

		gridEvents:{
			'cell:change':  function(args){
				var id = args.column.id;
				var period = ~~(id.replace('_sale','').replace('_rate',''));
				var colIndex = 0;

				$.each(this.dispData.header.col, function(){
					if (this.period == period){
						colIndex = this.colIndex;
						return false;
					}
				});

				var rowIndex = Number(args.row - 3);
				var ref = this.dispData.body[rowIndex].list[colIndex];

				if (id.indexOf('sale') >= 0){
					var curValue = Number(args.item[id].replace(/[^0-9]/g, "").substring(0,12));
					args.item[id] = curValue;

					// データ更新
					ref.storeSaleDisp = curValue;
					ref.storeSale = curValue * 1000;
					ref.cost =  ref.storeProfitRate * 10 / 1000 * ref.storeSale;

				} if (id.indexOf('rate') >= 0){
					var tgtVal = args.item[id].replace(/[^0-9.]/g, "");

					if (tgtVal == '.') {
						tgtVal = '';
					}
					var arrTmp = tgtVal.split('.');
					var valTmp = arrTmp.shift();
					if (arrTmp.length > 0){
						valTmp = valTmp.substring(valTmp.length - 2, valTmp.length);
					}else{
						valTmp = valTmp.substring(0,2);
					}

					if (arrTmp.length > 0 && arrTmp[0] != ''){
						arrTmp[0] = arrTmp[0].substring(0,1);
						valTmp += ('.' + arrTmp.join(''));
					}
					var curValue = Number(valTmp);
					args.item[id] = curValue;

					// データ更新
					ref.storeProfitRate = curValue;
					ref.cost = curValue * 10 / 1000 * ref.storeSale;
				}

				// 合計更新
				this.calcTotal(rowIndex, colIndex);
				this.setGridData();

				this.grid.grid.invalidate();
			},

			'formatter:hidePeriod:click': function(e){
				var id = '' + e.column.id;
				var period = ~~(id.replace('_sale','').replace('_rate',''));
				var hiddenSale = false;
				var hiddenRate = false;
				var applySale = false;
				var applyRate = false;

				if (e.row == 1){
					hiddenSale = true;
					hiddenRate = true;
					applySale = true;
					applyRate = true;
				} else if (e.row == 2){
					hiddenSale = (e.column.id.indexOf('_sale') >= 0);
					hiddenRate = (e.column.id.indexOf('_rate') >= 0);
					applySale = hiddenSale;
					applyRate = hiddenRate;
				}

				$.each([this.dispData.header.col, this.dispData.header.cell], function(){
					$.each(this, function(){
						if (this.period == period){
							this.hiddenSale = (applySale) ? hiddenSale : this.hiddenSale;
							this.hiddenRate = (applyRate) ? hiddenRate : this.hiddenRate;
						}
					});
				});

				this.createGridData();
				this.grid.setColumns(this.columns, this.colhdMetadatas);

				return;
			},

			'formatter:showAll:click': function(e){
				$.each([this.dispData.header.col, this.dispData.header.cell], function(){
					$.each(this, function(){
						this.hiddenSale = false;
						this.hiddenRate = false;
					});
				});

				this.createGridData();
				this.grid.setColumns(this.columns, this.colhdMetadatas);

				return;
			},
		},

		setGridData: function(){
			var data = this.grid.getData();
			var index = 0;

			$.each(this.dispData.body, function(){
				$.each(this.list, function(){
					var id_s = '' + this.period + '_sale';
					var id_r = '' + this.period + '_rate';

					data[index][id_s] = this.storeSaleDisp;
					data[index][id_r] = this.storeProfitRate;
				});
				index++;
			});
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){
			this.srchAreaCtrl.show_srch();
			$("#searchAgain").fadeOut();

			// 検索条件部を活性化する
			clutil.viewRemoveReadonly($("#ca_srchArea"));

			// 検索条件初期化
			this.srchCondView.deserialize({
				srchUnitID: clcom.userInfo.unit_id,
				//srchPeriod: this.srchCondView.init_ope_year,
			});
			this.setInitializeValue();
			this.srchCondView.setDefaultEnabledProp();
			clutil.setFocus(this.srchCondView.$tgtFocus);

			this.srchCondView.versionList = null;

			// 検索結果クリア
			this.srchAreaCtrl.reset();

			// フッターボタン活性制御
			this.mdBaseView.setSubmitEnable(false);
			$("#mainColumnFooter").find(".cl_download").attr('disabled', false);
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){

			switch(args.status){
			case 'DONE':		// 確定済
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				this.srchCondView._onSrchParamChanged(e);
				this.grid.setEnable(false);
				$("#mainColumnFooter").find(".cl_download").attr('disabled', false);
				break;
			case 'OK':
				this.grid.setEnable(false);
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				break;
			}
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			this.srchCondView.initUIElement();

			// 検索条件を再指定ボタンを隠す
			this.srchAreaCtrl = clutil.controlSrchArea(
					this.srchCondView.$el,
					this.srchCondView.$('#ca_srch'),
					this.$('#result'),
					this.$('#searchAgain'));

		    // CSV取込
			this.opeCSVInputCtrl = clutil.View.OpeCSVInputController({
				// CSV取込のボタン要素
				btn: this.$('#ca_csv_uptake'),

				// CSV取込実行のときのリクエストを作る関数
				buildCSVInputReqFunction: _.bind(function(uploadedFile){
					var req = clutil.view2data(this.$('#ca_srchArea'));

					// リクエストデータ本体
					var getReq = {
						AMBPV0010GetReq: req,
						AMBPV0010UpdReq: {},
					};

					mainView.tempSrchReq = getReq;

					// 戻り値は呼び出し先リソースIDを付加して返す。
					return {
						resId: 'AMBPV0010',
						data: getReq
					};
				}, this),

				// ファイルアップロード部品へ渡すオプション
				// ここでは、ファイル選択直前の入力チェック関数だけ渡している。
				fileUploadViewOpts: {
					// ファイル選択直前の入力チェック関数
					beforeShowFileChooser: _.bind(this.validator.valid, this.validator)
				}
			});

			// 取込処理成功
			this.opeCSVInputCtrl.on('done', function(data){
				// 取り込み結果を表示する
				mainView.srchDoneProc(mainView.tempSrchReq, data);
			});

			// 取込処理失敗
			this.opeCSVInputCtrl.on('fail', function(data){
				// 取込処理が失敗した。
				if(data.rspHead.uri){
					//CSVダウンロード実行
					clutil.download(data.rspHead.uri);
				} else {
					clutil.mediator.trigger('onTicker', data);
				}
			});

			this.setInitializeValue();

			return this;
		},

		setInitializeValue: function(){
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			this.srchCondView.render();
			return this;
		},

		/**
		 * 検索条件をつくる
		 */
		buildReq: function(argSrchReq){
			var srchReq;
			if(arguments.length > 0){
				srchReq = argSrchReq;
			}else{
				if(this.srchCondView.isValid()){
					srchReq = this.srchCondView.serialize();
				}else{
					// メッセージは、srchConcView 側で出力済。
					return;
				}
			}

			// 検索条件
			var req = {
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					fileId: 0,
				},
				AMBPV0010GetReq: srchReq
			};
			return req;
		},

		/**
		 * 検索ボタンクリックからの検索
		 */
		_onSrch: function(srchReqDto) {
			var req = this.buildReq(srchReqDto);

			// 検索実行
			this.doSrch(req);
		},

		/**
		 * ページ切り替え/表示件数変更からの再検索
		 */
		_onPageChanged: function(groupid, pageReq, from){
			if(groupid !== 'AMBPV0010'){
				return;
			}

			if(!this.savedReq){
				console.warn('検索条件が保存されていません。');
				return;
			}

			// 検索条件を複製してページリクエストを差し替える
			var req = _.extend({}, this.savedReq);
			req.reqPage = pageReq;
		},

		/**
		 * 検索実行して結果を表示する
		 * @param srchReq 検索要求パケット
		 * @param chkData 初期選択行（オプション） -- 他画面から戻ってきたときに以前選択していた行選択の復元に使用。
		 */
		doSrch: function(srchReq, chkData, $focusElem){
			var defer = clutil.postJSON('AMBPV0010', srchReq).done(_.bind(function(data){
				this.srchDoneProc(srchReq, data, chkData);

			}, this)).fail(_.bind(function(data){
				this.srchFailProc(data);

			}, this));

			return defer;
		},

		srchDoneProc: function(srchReq, data, chkData){
			this.savedData = data;
			this.savedSrchReq = srchReq;
			// データ取得
			var recs = data.AMBPV0010GetRsp.rawRecs;

			if (_.isEmpty(recs)) {
				if (srchReq.AMBPV0010GetReq.srchVersion == 0) {
					this.validator.clearErrorMsg($('#div_ca_srchVersion').find('.cl_error_field'));

					var verList = new Array();

					for (var i = 0; i < data.AMBPV0010GetRsp.verRecs.length; i++){
						var name = data.AMBPV0010GetRsp.verRecs[i].version + ': ' + clutil.dateFormat(data.AMBPV0010GetRsp.verRecs[i].date, 'yyyy/mm/dd') + ' ' + clutil.timeFormat(data.AMBPV0010GetRsp.verRecs[i].hhmm) + ' ' + data.AMBPV0010GetRsp.verRecs[i].fileName;
						verList.push({id:data.AMBPV0010GetRsp.verRecs[i].version + '', name:name + '', code:data.AMBPV0010GetRsp.verRecs[i].version + '',});
					}

					clutil.cltypeselector2($('#ca_srchVersion'), verList, 0, 1, 'id', 'name', 'code');

					if (verList.length > 0) {
						if (_.isUndefined($("#ca_srchPlanType").attr('disabled'))){
							clutil.viewRemoveReadonly($("#div_ca_srchVersion"));
						}else{
							clutil.viewReadonly($("#div_ca_srchVersion"));
						}

					} else {
						clutil.viewReadonly($("#div_ca_srchVersion"));
					}

					this.srchCondView.versionList = verList;

				} else {
					this.clearResult();

					// エラーメッセージ表示
					clutil.mediator.trigger('onTicker', clmsg.cl_no_data);

					// 検索ペイン／結果ペインを表示
					mainView.srchAreaCtrl.show_both();

					// フォーカス設定
					this.resetFocus(this.srchCondView.$tgtFocus);
				}

			} else {
				clutil.viewReadonly($("#ca_srchArea"));
				$("#searchAgain").text('検索条件を開く');

				this.clearResult();

				mainView.setDispData(data);

				// リクエストを保存。
				this.savedReq = srchReq;

				// 結果ペインを表示
				this.srchAreaCtrl.show_result();


				// フォーカスの設定
				if(typeof $focusElem != 'undefined') {
					this.resetFocus($focusElem);
				}

				// 登録ボタン活性制御
				if (srchReq.AMBPV0010GetReq.srchPlanType == amcm_type.AMCM_VAL_OPERPLANTYPE_MONTH){
					this.mdBaseView.setSubmitEnable(true);
					$("#div_ca_csvinput").show();
					clutil.viewRemoveReadonly($("#ca_csvinput1"));
					//clutil.viewRemoveReadonly($("#ca_csvinput2"));
				} else {
					$("#div_ca_csvinput").hide();
					clutil.viewReadonly($("#ca_csvinput1"));
					//clutil.viewReadonly($("#ca_csvinput2"));
				}
				$("#mainColumnFooter").find(".cl_download").attr('disabled', false);

				this.createGridData();
				this.initGrid();

				var grigParam = {
					gridOptions		: {
						autoHeight		: false,
						frozenColumn	: 0,
						frozenRow		: 4,
					},										// データグリッドのオプション
					columns			: this.columns,			// カラム定義
					colhdMetadatas	: this.colhdMetadatas,	//
					data			: this.gridData,		// データ
				};

				this.grid.setData(grigParam);

				$.when($('#searchAgain')).done(function () {
					var $window = $(window);
					var offset = $('#searchAgain').offset();
					var location = {
						left	: offset.left - $window.scrollLeft(),
						top		: offset.top  - $window.scrollTop(),
					};

				    if (location.top < 0){
				    	clcom.targetJump('searchAgain', 50);
				    }
				});
			}
		},

		srchFailProc: function(data){
			this.clearResult();

			// 検索ペインを表示
			mainView.srchAreaCtrl.show_srch();

			// バージョンリスト0件でリセット
			if (!data.AMBPV0010GetRsp.verRecs.length) {
				var verList = new Array();
				clutil.cltypeselector2($('#ca_srchVersion'), verList, 0, 1, 'id', 'name', 'code');
				clutil.viewReadonly($("#div_ca_srchVersion"));
				this.validator.clearErrorMsg($('#div_ca_srchVersion').find('.cl_error_field'));
				this.srchCondView.versionList = null;
			}

			// エラーメッセージを通知。
			clutil.mediator.trigger('onTicker', data);

			// フォーカスの設定
			this.resetFocus();
		},

		setDispData: function(data){
			var rsp = data.AMBPV0010GetRsp;
			this.dispData = null;

			var tableData = {
				header:{
					head	: new Array(),
					col		: new Array(),
					cell	: new Array(),
				},
				body		: new Array(),
			};

			var hd = tableData.header;
			var bd = tableData.body;

			// テーブルのヘッダ部分のデータを生成する
			var index = 0;

			$.each(rsp.colRecs, function(){
				var periodDisp = '';
				var strPeriod = this.period.toString();
				var yearBuff = strPeriod.substring(0,4);
				var monthBuff = '' + Number(strPeriod.substring(4,6));
				var dayBuff = '' + Number(strPeriod.substring(6,8));

				if (index == 0){
					if (this.planType == 4){
						periodDisp = yearBuff + '年' + monthBuff + '月';
					} else {
						periodDisp = yearBuff + '年';
					}
				} else {
					switch (this.planType){
					case 1:
					case 2:
						periodDisp = yearBuff + '年' + monthBuff + '月';
						break;
					case 3:
						periodDisp = yearBuff + '年' + monthBuff + '週';
						break;
					case 4:
						periodDisp = yearBuff + '年' + monthBuff + '月'+ dayBuff + '日';
						break;
					}
				}

				hd.col.push({
					planType	: this.planType,
					period		: this.period,
					periodDisp	: periodDisp,
					colIndex	: index,
					hiddenSale	: false,
					hiddenRate	: false,
				});

				hd.cell.push({
					period		: this.period,
					colIndex	: index,
					hiddenSale	: false,
					hiddenRate	: false,
				});

				index++;
			});
			hd.head.push({colspan:index * 2,});

			var cellLoopMax = index;
			var cellIndex = 0;
			var rowIndex = 0;

			// テーブルの縦軸部分のデータを生成する
			$.each(rsp.rawRecs, function(){
				var list = new Array();
				var colIndex = 0;

				// テーブルの横軸部分のデータを生成する
				for (var i = 0; i < cellLoopMax; i++){
					var cell = rsp.cellRecs[cellIndex];
					list.push({
						type			: cell.type,
						planType		: cell.planType,
						period			: cell.period,
						storeSale		: cell.storeSale,
						storeSaleDisp	: Math.round(cell.storeSale / 1000),
						storeProfitRate	: cell.storeProfitRate,
						cost 			: Math.round(cell.storeProfitRate * 10 / 1000 * cell.storeSale),
						rowIndex		: rowIndex,
						colIndex		: colIndex,
					});
					cellIndex++;
					colIndex++;
				}

				bd.push({
					type		: this.type,
					orgID		: this.orgID,
					orgLevel	: this.orgLevel,
					orgCode		: this.orgCode,
					orgName		: this.orgName,
					list		: list,
				});

				rowIndex++;
			});

			this.dispData = tableData;

			this.savedRspPage = data.rspPage;
		},

		_onSampleDLClick: function() {
			//this.doCSV(AMMPV0010Req.AMMPV0010_SAMPLE);
			//window.location = "/public/sample/品種別構成比登録サンプル.xlsx";
			clutil.download(this.sampleURL);
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			if (_.isUndefined(this.grid) || _.isUndefined($("#ca_srchPlanType").attr('disabled'))){
				return;
			}

			// リクエストをつくる
			var srchReq = this.buildReq();
			var updReq = this._buildSubmitReqFunction();

			if(_.isNull(srchReq) || _.isNull(updReq)){
				// 入力エラーがある：条件設定ペインを開いてあげる
				this.srchAreaCtrl.show_srch();
				return;
			}


			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMBPV0010', updReq.data).done(_.bind(function(data){
				this.validator.clearErrorMsg($('#div_ca_srchVersion').find('.cl_error_field'));

			}, this)).fail(_.bind(function(data){
				// 検索ペインを表示？
				mainView.srchAreaCtrl.show_srch();

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));

			return defer;
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFocus($focusElem);
			}else{
				if (this.$('#searchAgain').css('display') == 'none') {
					clutil.setFocus($('#ca_srch'));
				} else {
					clutil.setFocus($('#searchAgain'));
				}
			}
		},

		/**
		 * 検索条件を再指定ボタン押下
		 */
		_onSearchAgainClick: function(e){
			if (this.$('#ca_srchArea').css('display') == 'none') {
				this.srchAreaCtrl.show_srch();
				$("#searchAgain").text('検索条件を閉じる');
				$("#searchAgain").fadeIn();
			} else {
				this.srchAreaCtrl.show_result();
				$("#searchAgain").text('検索条件を開く');
			}
		},

		/**
		 * 編集画面への遷移
		 */
		_doOpeAction: function(rtyp, pgIndex, e){
			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:	// 新規
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:	// 照会
				// fall through
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:	// 削除
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
				// fall through
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:	// 編集
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			var data = args.data;

			// 他画面からの呼出はこのメソッドが使用される。
			// 自画面からの起動はdoSrchに行く。

			switch(args.status){
			case 'OK':
				break;
			case 'DONE':		// 確定済
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				break;
			default:
			case 'NG':			// その他エラー。
				this.srchFailProc(data);
				break;
			}
		},

		calcTotal: function(rowIndex, colIndex){
			var funcRoundRate = this.roundRate;
			var ref;

			// 縦計計算
			var rowSaleTotal = 0;
			var rowCostTotal = 0;
			$.each(this.dispData.body, function(){
				if (this.list[colIndex].rowIndex > 0){
					rowSaleTotal += this.list[colIndex].storeSale;
					rowCostTotal += this.list[colIndex].cost;
				}
			});
			ref = this.dispData.body[0].list[colIndex];
			ref.storeSaleDisp = rowSaleTotal / 1000;
			ref.storeSale = rowSaleTotal;
			ref.cost = rowCostTotal;
			ref.storeProfitRate = funcRoundRate(rowCostTotal, ref.storeSale);

			// 横計計算
			var colSaleTotal = 0;
			var colCostTotal = 0;
			$.each(this.dispData.body[rowIndex].list, function(){
				if (this.colIndex > 0){
					colSaleTotal += this.storeSale;
					colCostTotal += this.cost;
				} else {
					yearSaleTotal += this.storeSale;
					yearCostTotal += this.cost;
				}
			});
			ref = this.dispData.body[rowIndex].list[0];
			ref.storeSaleDisp = colSaleTotal / 1000;
			ref.storeSale = colSaleTotal;
			ref.cost = colCostTotal;
			ref.storeProfitRate = funcRoundRate(ref.cost, ref.storeSale);

			// 縦横計
			var yearSaleTotal = 0;
			var yearCostTotal = 0;
			$.each(this.dispData.body[0].list, function(){
				if (this.colIndex > 0){
					yearSaleTotal += this.storeSale;
					yearCostTotal += this.cost;
				}
			});
			ref = this.dispData.body[0].list[0];
			ref.storeSaleDisp = yearSaleTotal / 1000;
			ref.storeSale = yearSaleTotal;
			ref.cost = yearCostTotal;
			ref.storeProfitRate = funcRoundRate(ref.cost, ref.storeSale);
		},

		roundRate: function(lhs, rhs) {
			return (rhs) ? Math.round(lhs / rhs * 100 * 10) / 10 : 0;
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex) {

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMBPV0010GetReq: {},
				// 更新リクエスト
				AMBPV0010UpdReq: {},
			};

			this.tempSrchReq = getReq;

			return {
				resId: clcom.pageId,	//'AMEQV0010',
				data: getReq
			};
		},

		hasInputError: function(){
			var hasError = false;
			var chkKeyList = new Array();
			var chkDataMap = {};
			var branch = this.srchCondView.utl_branch.getValue();

			$('#ca_thCol th').find('#ca_closeIcon').each(function(){
				var $tgt = $(this);
				chkKeyList.push($tgt.data().colindex);
			});

			$.each(chkKeyList, function(){
				var srchCls = 'cl_' + this;

				$('#ca_table_tbody').find('.' + srchCls).find('input').each(function(){
					var $tgt = $(this);
					var rowIndex = $tgt.data().rowindex;
					var colIndex = $tgt.data().colindex;
					var mapKey = rowIndex + '_' + colIndex;

					if (chkDataMap[mapKey] == null){
						chkDataMap[mapKey] = {
							sale:null,
							rate:null,
							key:mapKey,
						};
					}

					if ($tgt.hasClass('cl_storeSale')){
						chkDataMap[mapKey].sale = $tgt;
					} else if ($tgt.hasClass('cl_profitRate')){
						chkDataMap[mapKey].rate = $tgt;
					}
				});
			});

			// ページャ >>
			var errList = {};
			$.each(this.dispData.body, function(){
				$.each(this.list, function(){
					var rowIndex = this.rowIndex;
					var colIndex = this.colIndex;

					if (rowIndex == 0 || colIndex == 0){
						return true;
					}

					var sale = this.storeSaleDisp;
					var rate = this.storeProfitRate;
					var strSale = sale.toString();
					var chkNum = strSale.substr(strSale.length - 1, strSale.length);
					var mapKey = rowIndex + '_' + colIndex;

					var chkBuff = {target: null, message: null,};

					if (chkNum != '0' && branch == amcm_type.AMCM_VAL_PLAN_BRANCH_TYPE_SIGN){
						chkBuff.target = 'cl_storeSale';
						chkBuff.message = clmsg.EBP0001;
					} else if (sale != 0 && rate == 0){
						chkBuff.target = 'cl_profitRate';
						chkBuff.message = clmsg.EBP0002;
					} else if (sale == 0 && rate != 0){
						chkBuff.target = 'cl_storeSale';
						chkBuff.message = clmsg.EBP0003;
					}

					if (chkBuff.target != null){
						if (errList[mapKey] == null){
							errList[mapKey] = {
								errInfo: new Array(),
							};
						}

						errList[mapKey].errInfo.push(chkBuff);
						hasError = true;
					}
				});
			});

			$.each(chkDataMap, function(){
				if (errList[this.key] != null){
					var $sale = this.sale;
					var $rate = this.rate;

					$.each(errList[this.key].errInfo, function(){
						var $tgt = null;
						if (this.target == 'cl_storeSale'){
							$tgt = $sale;
						} else if (this.target == 'cl_profitRate'){
							$tgt = $rate;
						}

						mainView.validator.setErrorMsg($tgt, this.message);
					});
				} else {
					if (this.sale.hasClass('cl_error_field')){
						mainView.validator.clearErrorMsg(this.sale);
					}
					if (this.rate.hasClass('cl_error_field')){
						mainView.validator.clearErrorMsg(this.rate);
					}
				}
			});
			// ページャ <<

//			$.each(chkDataMap, function(){
//				var sale = Number(this.sale.val());
//				var rate = Number(this.rate.val());
//				var strSale = this.sale.val().toString();
//				var chkNum = strSale.substr(strSale.length - 1, strSale.length);
//
//				if (chkNum != '0'){
//					mainView.validator.setErrorMsg(this.sale, clmsg.EBP0001);
//					hasError = true;
//				} else if (sale != 0 && rate == 0){
//					mainView.validator.setErrorMsg(this.rate, clmsg.EBP0002);
//					hasError = true;
//				} else if (sale == 0 && rate != 0){
//					mainView.validator.setErrorMsg(this.sale, clmsg.EBP0003);
//					hasError = true;
//				} else {
//					if (this.sale.hasClass('cl_error_field')){
//						mainView.validator.clearErrorMsg(this.sale);
//					}
//					if (this.rate.hasClass('cl_error_field')){
//						mainView.validator.clearErrorMsg(this.rate);
//					}
//				}
//			});

			return hasError;
		},


		hasGridError: function(){
			var hasError = false;
			var branch = this.srchCondView.utl_branch.getValue();

			var tableData = this.grid.getData();
			var rowIds = [];

			$.each(tableData, function(){
				rowIds.push(this._cl_gridRowId);
			});

			var errList = {};
			$.each(this.dispData.body, function(){
				$.each(this.list, function(){
					var rowIndex = this.rowIndex;
					var colIndex = this.colIndex;

					if (rowIndex == 0 || colIndex == 0){
						return true;
					}

					var sale = this.storeSaleDisp;
					var rate = this.storeProfitRate;
					var strSale = sale.toString();
					var chkNum = strSale.substr(strSale.length - 1, strSale.length);
					var mapKey = rowIndex + '_' + colIndex;

					var chkBuff = {row: rowIndex, target: null, message: null,};

					if (chkNum != '0' && branch == amcm_type.AMCM_VAL_PLAN_BRANCH_TYPE_SIGN){
						chkBuff.target = '' + this.period + '_sale';
						chkBuff.message = clmsg.EBP0001;
					} else if (sale != 0 && rate == 0){
						chkBuff.target = '' + this.period + '_rate';
						chkBuff.message = clmsg.EBP0002;
					} else if (sale == 0 && rate != 0){
						chkBuff.target = '' + this.period + '_sale';
						chkBuff.message = clmsg.EBP0003;
					}

					if (chkBuff.target != null){
						if (errList[mapKey] == null){
							errList[mapKey] = {
								errInfo: new Array(),
							};
						}

						errList[mapKey].errInfo.push(chkBuff);
						hasError = true;
					}
				});
			});

			$.each(errList, function(){
				$.each(this.errInfo, function(){
					mainView.grid.setCellMessage(rowIds[this.row], this.target, 'error', this.message);
				});
			});

			return hasError;
		},

		// 更新系のリクエストを作る
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			var hasError = false;
			var gridAvailable = false;

			if (!_.isUndefined(this.grid)){
				this.grid.stopEditing();
				gridAvailable = true;
			}
			if (_.isUndefined($("#ca_srchPlanType").attr('disabled'))){
				gridAvailable = false;
			}

			if(!this.validator.valid()) {
				hasError = true;
			}

			if (gridAvailable && !_.isUndefined(opeTypeId)){
				if(this.hasInputError()) {
					this.validator.setErrorHeader(clmsg.cl_echoback);
					hasError = true;
				}

				if(this.hasGridError()) {
					this.validator.setErrorHeader(clmsg.cl_echoback);
					hasError = true;
				}
			}

			if (hasError) {
				return null;
			}

			var data = clutil.view2data($("#div_fUpdThis"));
			var confirm = null;

			if (data.fUpdThis) {
				confirm = "当月（翌日以降）の日別荒利率計画を月別の荒利率計画で上書きします。<br />&nbsp; <br />よろしいですか？";
			}

			// Recを構築する。

			var monthRawRecs = new Array();
			var monthColRecs = new Array();
			var monthCellRecs = new Array();

			if (gridAvailable){
				$.each(this.dispData.header.col, function(){
					monthColRecs.push(this);
				});

				$.each(this.dispData.body, function(){
					$.each(this.list, function(){
						monthCellRecs.push(this);
					});

					monthRawRecs.push({
						type		: this.type,
						orgID		: this.orgID,
						orgLevel	: this.orgLevel,
						orgCode		: this.orgCode,
						orgName		: this.orgName,
					});
				});
			}

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMBPV0010GetReq: (!_.isUndefined(this.savedReq)) ? this.savedReq.AMBPV0010GetReq : this.buildReq().AMBPV0010GetReq,
				// 更新リクエスト
				AMBPV0010UpdReq: {
					monthRawRecs	: monthRawRecs,
					monthColRecs	: monthColRecs,
					monthCellRecs	: monthCellRecs,
					fUpdThis: data.fUpdThis,
					srchUnitID				:	(!_.isUndefined(this.savedSrchReq)) ? this.savedSrchReq.AMBPV0010GetReq.srchUnitID : '',
					srchPlanType			:	(!_.isUndefined(this.savedSrchReq)) ? this.savedSrchReq.AMBPV0010GetReq.srchPlanType : '',
					srchPeriod				:	(!_.isUndefined(this.savedSrchReq)) ? this.savedSrchReq.AMBPV0010GetReq.srchPeriod : '',
					srchBranch				:	(!_.isUndefined(this.savedSrchReq)) ? this.savedSrchReq.AMBPV0010GetReq.srchBranch : '',
					fileID				:	(!_.isUndefined(this.savedData)) ? this.savedData.AMBPV0010GetRsp.fileID : '',
				}
			};

//return null;
			return {
				resId: clcom.pageId,	//'AMBPV0010',
				data: updReq,
				confirm: confirm,
			};
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// MDBaseView へのクリア：ヘッダメッセージとリボンクリアする
			this.mdBaseView.clear();

			// 確定時用のデータを初期化
			this.savedReq = null;

			// テーブルをクリア
			//this.recListView.clear();
		},

		/**
		 * 他ページから復帰し、初期検索など行って、遷移前の状態を復元する。
		 */
		load: function(model) {
			// 条件部の復元
			if(!_.isEmpty(model.savedCond)){
				this.srchCondView.deserialize(model.savedCond);
			}
			// 再検索
			if(!_.isEmpty(model.savedReq)){
				this.doSrch(model.savedReq, model.chkData, $('#' + model.btnId));
			}
		},

		_eof: 'AMBPV0010.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

		// フッターボタン活性状態制御
		mainView.mdBaseView.setSubmitEnable(false);
		$("#mainColumnFooter").find(".cl_download").attr('disabled', false);

		if(clcom.pageData){
			// 保存パラメタがある場合
			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
			mainView.load(clcom.pageData);
		}
	}).fail(function(data){
		console.error('iniJSON failed.');
		console.log(arguments);

		// clcom のネタ取得に失敗。
		// 動かしようがないので、Abort 扱いとしておく？？？
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});
