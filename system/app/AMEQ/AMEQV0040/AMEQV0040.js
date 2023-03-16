/**
 * 備品・ノベルティ商品マスタ登録
 */

useSelectpicker2();

$(function(){
	$.inputlimiter.noTrim = true;

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var ImageSelectView = Backbone.View.extend({
		//	<div class="fieldBox mainPic">	<== ここが el
		//		contentHTML
		//	</div>
		contentHTML: ''
			+ '<div class="premium hover dispn"><p>画像をアップロード</p></div>'
			+ '<div class="flleft">'
			+ '	<div class="mainPicBox flleft">'
			+ '		<input class="hide-input" type="file" name="file">'
			+ '		<img src="" style="display: none;" class="cl-file-attach" alt="">'
			+ '		<div class="noimg" style="cursor: not-allowed;"><span></span></div>'
			+ '	</div>'
			+ '</div>',

		contentHiddenAttrHTML: '<input class="cl-file-attr" name="attr" type="hidden">',

		className: 'fieldBox mainPic',

		events: {
			'click .premium.hover.dispn'	: '_onClickPremiumHoverDispn',
			'change input[type=file]'		: '_onChangeFileSelection'
		},

		initialize: function(opt){
			_.bindAll(this);
			this.options = _.extend({
				maxFileSize: 512 * 1024,	// ファイルサイズ制限（暫定）
				immediatry: true			// テスト用：ファイル選択後すぐにアップロードする場合は true
			}, opt);
		},

		render: function(){
			this.$el.html(this.contentHTML);

			// 大きさを支配するのは、div.mainPicBox
			var $canvas = this.$('.mainPicBox');
			this.dimension = {
				width: $canvas.width(),		//.innerWidth(),
				height: $canvas.height()	//.innerHeight()
			};

			// Img loading 関数セット
			var $img = this.$('img');
			$img.load(this._onImgLoaded);
			$img.error(this._onImgError);

			return this;
		},

		// 「画像をアップロード」幕のクリック → input[type="file"] を立ち上げる
		_onClickPremiumHoverDispn: function(e){
			this.$('input[type=file]').trigger("click");
		},

		// 画像ロードイベント
		_onImgLoaded: function(e){
			console.log('_onImgLoaded');
			console.log(arguments);

			// 高さｘ幅 調整
			var dim = clutil.getActualDimension(e.target);
			var cssArg = {
				width: this.dimension.width + 'px',
				height: this.dimension.height + 'px'
			};
			if(dim.width === 0 || dim.height === 0 || !_.isNumber(dim.width) || !_.isNumber(dim.height)){
				// サイズとれない
			}else{
				var tangent = this.dimension.height / this.dimension.width;
				var tan = dim.height / dim.width;
				if(tan > tangent){
					// 横長
					cssArg.width = 'auto';
				}else{
					// 縦長
					cssArg.height = 'auto';
				}
			}

			this.$('.noimg').hide();
			this.$('img').css(cssArg).show();
		},

		// 画像ロードエラーイベント
		_onImgError: function(e){
			console.log('_onImgError');
			console.log(arguments);

			this.$('img').hide();
			this.$('.noimg').show();
		},

		// ファイル選択が完了
		_onChangeFileSelection: function(e){
			var $input = $(e.target);
			var file = e.target.files[0];
			var convert_pdf = 0;

			console.log(file);
			if(file == null){
				// ファイルチューザ―でキャンセル
				return;
			}
			// ファイルのコンテントタイプチェック
			if (!file.type.match(/^image\//) && !file.type.match(/\/pdf/)) {
				clutil.mediator.trigger('onTicker', '画像ファイルを選択してください。');
				return;
			}
			// ファイルサイズのチェック
			if(this.options.maxFileSize > 0 && file.size > this.options.maxFileSize){
				var msg = 'ファイルサイズが大きすぎます。{0} 以下のファイルを選択してください。';
				var arg = (this.options.maxFileSize / 1024) + '[KB]';
				clutil.mediator.trigger('onTicker', clutil.fmt(msg, arg));
				return;
			}

			if (file.type.match(/\/pdf/)) {
				convert_pdf = 1;
			}

			// 即時アップロード
			if(this.options.immediatry){
				this._doUpload($input, convert_pdf);
			}
		},

		/**
		 * 画像アップロードする
		 */
		_doUpload: function($inputFile, convert_pdf){
			var localpath = $inputFile.val();
			if (localpath.length == 0) {
				// ファイルが選択されていない
				return false;
			}

			convert_pdf = convert_pdf == null ? 0 : convert_pdf;

			// 現在処理中データを保存。
			this.workingData = {
				localpath: localpath,
				basename: this._basename(localpath)
			};

			// アップロード直前で、this.$el を <form> でラップする
			var $form = $inputFile.wrap('<form>').parent().css({ margin: 0, padding: 0});
			var $hidden = $(this.contentHiddenAttrHTML).appendTo($form);

			$hidden.val(JSON.stringify({
				filename: this.workingData.basename,
				convert_pdf: convert_pdf
			}));

			clutil.blockUI(clcom.uploadDestUri);
			$form.ajaxSubmit({
				type: 'POST',
				dataType: 'json',
				contentType: 'multipart/form-data',
				url: clcom.uploadDestUri,
				success: this._onUploadSuccess,
				error: this._onUploadError,
				complete: this._onUploadComplete
			});

			return true;
		},
		// アップロード成功
		_onUploadSuccess: function(data){
			var file = {
				id: data.id,
				uri: data.uri,
				filename: this.workingData.basename,
				localpath: this.workingData.localpath
			};

			// アップロードデータ保存
			this.uploadedData = file;

			this.setImageURL(data.uri);
		},
		// アップロード失敗
		_onUploadError: function(jqXHR, textStatus, errorThrown){
	        new clutil.ErrorDialog('ファイルアップロードに失敗しました。');
		},
		// アップロード後処理
		_onUploadComplete: function(){
			var $inputFile = this.$('input[type="file"]');
			var $form = $inputFile.closest('form');
			var form = $form.get(0);
			$form.find('.cl-file-attr').remove();

			if (form) {
				form.reset();
				$inputFile.unwrap();
			}
			clutil.unblockUI(clcom.uploadDestUri);
		},
		/**
		 * ファイルパスから basename を取り出す。
		 * 注意：Windows のみ対応。
		 * @returns
		 */
		_basename: function(path) {
		    return _.last(path.split('\\'));
		},

		/**
		 * <Img> タグに画像リソースをセットする。
		 */
		setImageURL: function(url){
			if(_.isEmpty(url)){
				this.$('img').attr('src', url);
			}else{
				this.$('img').attr('src', url);
			}
		},

		/**
		 * <Img> タグにセットしている src 属性値を返す。
		 * 見つからないリソースをセットしている場合でも src 属性に設定している値を返す。
		 */
		getImageURL: function(){
			var $img = this.$('img');
			if($img.css('display') == 'none'){
				return null;
			}else{
				return $img.attr('src');
			}
		},

		/**
		 * {id: 134, uri: '/system/foo/bar/image.jpg' } のデータ形式で内部設定値を返す。
		 */
		serialize: function(){
			return this.uploadedData;
		},

		/**
		 * {id: 134, uri: '/system/foo/bar/image.jpg' } のデータ形式で内部設定値をセットし、画像を表示する。
		 */
		deserialize: function(dto){
			if(_.isEmpty(dto)){
				this.clear();
			}else{
				this.uploadedData = _.pick(dto, 'id', 'uri', 'filename', 'localpath');
				this.setImageURL(dto.uri);
			}
		},

		/**
		 * 画像を再読み込みする
		 */
		reload: function() {
			var curSrc = this.$('img').attr('src');
			if (!_.isEmpty(curSrc)) {
				// 一旦 src 属性を削除してから再設定
				this.$('img').removeAttr('src').attr('src', curSrc);
			}
		},

		// 画像リソースをヌルに・・・
		clear: function(){
			this.setImageURL(null);
			this.uploadedData = null;
		},

		/**
		 * false をセットすると画像 Upload できないようにする。
		 */
		setEnable: function(enable){
			if(enable){
				this.$('.premium.hover.dispn').css('display', '');
			}else{
				this.$('.premium.hover.dispn').hide();
			}
		},

		_eof: 'AMEQV0040.ImageSelectView//'
	});

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el: $('#ca_main'),
		validator : null,
		events: {
			'change #ca_unitID'									: '_onUnitChanged',				// 事業ユニット変更
			"change input[name='equipManTypeID']:radio"			: "_onEquipManTypeChanged",		// ラジオボタン変更
			"change #ca_flagOdrStore"							: "_onFlagOdrStoreChanged",		// XXX: 発注可能な店舗のみ入力
			"change #ca_flagAuto"								: "_onFlagAutoChanged",			//
			"change #ca_orderFuncTypeID"						: "_onOrderFuncTypeIDChanged",
			"change #ca_orderCycle"								: "_onOrderCycleChanged",		//
			"change #ca_orderCountTiming"						: "_onOrderCountTimingChanged",	//
			'click #ca_del_img1'								: '_onClickDelImg1',			//全体画像削除
			'click #ca_del_img2'								: '_onClickDelImg2'				//拡大画像削除
		},


		_onClickDelImg1: function(){
			mainView.imageSelectView1.clear();
			$("#wholeImageFileID").val("");
			$("#wholeImageFileName").val("");
			$("#wholeImageURI").val("");
		},
		_onClickDelImg2: function(){
			mainView.imageSelectView2.clear();
			$("#closeupImageFileID").val("");
			$("#closeupImageFileName").val("");
			$("#closeupImageURI").val("");
		},


		initialize: function(opt){
			_.bindAll(this);

			var isChild = false;
			if (opt != null && opt.opeTypeId){
				isChild = true;
			}

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});

			this.options = fixopt;
			this.delayedCallParam = null;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
					title					: '備品・ノベルティ商品マスタ',
					opeTypeId				: o.opeTypeId,
					pageCount				: o.chkData.length,
					buildSubmitReqFunction	: this._buildSubmitReqFunction,
					buildGetReqFunction		:
						(o.opeTypeId !== am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW)
						? this._buildGetReqFunction : undefined,
					btn_cancel				:
						(o.opeTypeId === am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW && !isChild)
						? this._doCancel : true
				};
				return mdOpt;

			},this)(fixopt);

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// デザイン（全体）
			this.imageSelectView1 = new ImageSelectView({el: '#ca_img1'});

			// デザイン（拡大）
			this.imageSelectView2 = new ImageSelectView({el: '#ca_img2'});

			// 外部イベントの購読設定
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);

			this._onUnitChanged();
			this._onEquipManTypeChanged(null);

			// ツールチップ
			if(clcom.userInfo.unit_id === clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				// 事業ユニットがAOKIの場合はツールチップを表示する
				$("#ca_tp_equip_code1").removeClass('dispn');
				$("#ca_tp_equip_code1").tooltip({html: true});

				$("#ca_tp_prem_code1").removeClass('dispn');
				$("#ca_tp_prem_code1").tooltip({html: true});

			} else {
				// 事業ユニットがAOKI以外の場合はツールチップを表示しない
				$("#ca_tp_equip_code1").addClass('dispn');
				$("#ca_tp_prem_code1").addClass('dispn');
			}
		},

		initGrid:function(){
			var delRowBtn = false;
			var footerNewRowBtn = false;

			switch (this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				delRowBtn = true;
				footerNewRowBtn = true;
				break;
			}

			this.grid_order = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid_order',	// エレメント
				lineno			: false,				// 行番号表示する/しないフラグ。
				delRowBtn		: delRowBtn,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: footerNewRowBtn		// フッター部の新規行追加ボタンを使用するフラグ。
			});

			// 行追加
			this.listenTo(this.grid_order, 'footer:addNewRow', function(gridView){
				gridView.addNewItem({});	// 空行を追加
			});

			this.grid_vend = new ClGrid.ClAppGridView({
				el				: '#ca_datagrid_vend',	// エレメント
				lineno			: false,				// 行番号表示する/しないフラグ。
				delRowBtn		: delRowBtn,			// 行削除ボタンを使用するフラグ。
				footerNewRowBtn	: footerNewRowBtn		// フッター部の新規行追加ボタンを使用するフラグ。
			});

			// 行追加
			this.listenTo(this.grid_vend, 'footer:addNewRow', function(gridView){
				gridView.addNewItem({});	// 空行を追加
			});

			var colmunItem_store = {
				id			: 'store',
				name		: '店舗',
				field		: 'store',
				width		: 180,
				cellType : {
					type			: 'clajaxac',
		 			tflimit			: "15",
					editorOptions	: {
						funcName : 'orgcode',
						dependAttrs : function(item) {
			 				var unit_id = $('#ca_unitID').val();
							return {
								orgfunc_id	: Number(clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')),
								orglevel_id	: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
								p_org_id	: unit_id
							};
						}
					}
				}
			};

			this.columns_order =
			[
			 	colmunItem_store,
				{
					id				: 'maxOrderLotQy',
					name			: '最大発注箱数',
					field			: 'maxOrderLotQy',
					cssClass		: 'txtalign-right',		// 右寄せ,
					width			: 180,
					cellType 		: {
						type			: 'text',
						validator		: "min:1 int:3",
						tflimit			: "2",
						formatFilter	: "comma",
						editorOptions	: {
							addClass: 'txtar'		// エディタ：右寄せ
						}
					}
				},
			];
			this.grid_order.render();

			this.columns_vend =
			[
			 	colmunItem_store,
				{
					id			: 'vend',
					name		: '取引先',
					field		: 'vend',
					width		: 180,
					cellType : {
						type			: 'clajaxac',
						tflimit			: "24",
						editorOptions	: {
							funcName	: 'equipvendcode',
							dependAttrs : function(item) {
								var unit_id = Number($("#ca_unitID").val());
								var ymd = clutil.dateFormat($("#ca_fromDate").val(), "yyyymmdd");
								return {
									unit_id	: unit_id,
									ymd: ymd
								};
							}
						}
					}
				},
			];
			this.grid_vend.render();
		},

		/**
		 * キャンセルボタン押下
		 */
		_doCancel: function(e){
			this.mdBaseView.commonHeader._onBackClick(e);
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			switch(args.status){
			case 'DONE':		// 確定済
			case 'CONFLICT':	// 別のユーザによって DB が更新された
			case 'DELETED':		// 別のユーザによって削除された
				clutil.viewReadonly(this.$("#div_ca_unitID"));
				clutil.viewReadonly(this.$(".ca_fromDate_div"));
				this.setReadOnlyAllItems();
				break;
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				if (args.data.rspHead.fieldMessages){
					$.each(args.data.rspHead.fieldMessages, function() {
						var fieldName = '#ca_' + this.field_name;

						if (this.field_name == 'equipCode'){
							var radio = $("input:radio[name=equipManTypeID]:checked");
							var val = radio.val();

							if (val == amcm_type.AMCM_VAL_EQUIP_ADMIN_TYPE_PREMIUM) {
								fieldName = '#ca_premCode';
							}
						}

						mainView.validator.setErrorMsg($(fieldName), clmsg[this.message]);
					});
				}
				break;
			}

			this.doClear = true;
		},

		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			if (typeof this.initialized == 'undefined'){
				console.log('!CHECK! wait');
				this.delayedCallParam = {args:args, e:e};
				return;
			}

			var data = args.data;
			var getRsp = data.AMEQV0040GetRsp;
			var orderList = new Array();
			var vendList = new Array();


			getRsp.equip.orderFuncTypeID_p = amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_PREMIUM;

			if (getRsp.equip.leadTime == 0){
				getRsp.equip.leadTime = null;
			}



			//this.setEquipTypeSel();
			if (getRsp.equip.unitID == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				getRsp.equip.equipTypeID = getRsp.equip.equipTypeID + 1;
			}

			$.each(getRsp.storeEquipForOrder, function() {
				orderList.push({
					store: {
						id : this.storeCodeName.id,
						code :this.storeCodeName.code,name:
						this.storeCodeName.name
					},
					maxOrderLotQy: this.maxOrderLotQy
				});
			});

			$.each(getRsp.storeEquipForVend, function() {
				vendList.push({
					store: {
						id: this.storeCodeName.id,
						code: this.storeCodeName.code,
						name: this.storeCodeName.name
					},
					vend: {
						id: this.vendCodeName.id,
						code: this.vendCodeName.code,
						name: this.vendCodeName.name
					}
				});
			});

			if (getRsp.equip.wholeImageURI != null) {
				mainView.imageSelectView1.setImageURL(clcom.urlRoot + getRsp.equip.wholeImageURI);
			}
			if (getRsp.equip.closeupImageURI != null) {
				mainView.imageSelectView2.setImageURL(clcom.urlRoot + getRsp.equip.closeupImageURI);
			}
			if (getRsp.equip.orderCountTiming.length > 0) {
				getRsp.equip.flagAuto = 1;
			}

			var setReadOnly = false;

			switch(args.status){
			case 'DONE':		// 確定済
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				this.doClear = true;
				setReadOnly = true;
				// FallThrough

			case 'OK':
				getRsp.equip.premCode = getRsp.equip.equipCode;

				this.initGrid();

				var orderGridData = {
					gridOptions	: {autoHeight: false},	// データグリッドのオプション
					columns	: this.columns_order,		// カラム定義
					data	: orderList 				// データ
				};
				this.grid_order.render().setData(orderGridData);

				var vendGridData = {
					gridOptions	: {autoHeight: false},	// データグリッドのオプション
					columns	: this.columns_vend,		// カラム定義
					data	: vendList					// データ
				};
				this.grid_vend.render().setData(vendGridData);

				var ope_date = clcom.getOpeDate();
				var apply_date = clutil.addDate(ope_date, 1);
				var doChangeReadOnly = false;

				// 編集状態を設定する
				clutil.viewReadonly($("#div_ca_equipManTypeID"));
				clutil.inputReadonly($("#ca_equipCode"));

				switch (this.options.opeTypeId) {
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
					if (getRsp.equip.fromDate < apply_date){
						getRsp.equip.fromDate = apply_date;
					}
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					doChangeReadOnly = true;
					clutil.viewReadonly(this.$(".ca_fromDate_div"));
					$(".hideRel").hide();
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					doChangeReadOnly = true;
					if (getRsp.equip.fromDate < apply_date){
						getRsp.equip.fromDate = apply_date;
					} else {
						getRsp.equip.fromDate = clutil.addDate(getRsp.equip.fromDate, 1);
					}
					this.$tgtFocus = $("#ca_fromDate");
					clutil.setFocus(this.$tgtFocus);
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
					getRsp.equip.fromDate = apply_date;
					getRsp.equip.toDate = clcom.max_date;
					getRsp.equip.equipCode = '';
					getRsp.equip.premCode = '';
					clutil.inputRemoveReadonly($("#ca_equipCode"));
					break;

				default:
					break;
				}

				console.log("******************************data2viewの前にコンボ作成？");
				this.setEquipTypeSel(getRsp.equip.unitID);


				// データ反映 [*1]
				console.log("******************************data2view");
				clutil.data2view(this.$('#content'), getRsp.equip);

				this.fieldRelation.done(function(){
					console.log("******************************フィールドリレーションdone");
					if (doChangeReadOnly || setReadOnly) {
						//全体のリードオンリーを最後に行う(でないとセレクターが活性化する)
						_.defer(mainView.setReadOnlyAllItems);
						if (setReadOnly){
							clutil.viewReadonly($("#div_ca_unitID"));
							clutil.viewReadonly($(".ca_fromDate_div"));
						}
					}

					var replaced = false;
					if (clcom.userInfo.user_typeid== amcm_type.AMCM_VAL_USER_STORE ||
						clcom.userInfo.user_typeid== amcm_type.AMCM_VAL_USER_STORE_MAN) {
						$("#div_ca_grid_order").hide();
						$("#div_ca_grid_vend").hide();

						$.each(orderList, function() {
							if (this.store.id == clcom.userInfo.org_id){
								$('#ca_maxOrderLotQy').val(this.maxOrderLotQy);
								return false;
							}
						});

						$.each(vendList, function() {
							if (this.store.id == clcom.userInfo.org_id){
								mainView.utl_equipVend.setValue({
									id		: this.vend.id,
									code	: this.vend.code,
									name	: this.vend.name
								});
								replaced = true;
								return false;
							}
						});
					}

					if (!replaced){
						// 発注先オートコンプリートに結果を反映
						// ※ [*1]のAC反映を待つ
						this.fields.clequipvendcode.setValue({
							id		: getRsp.equip.equipVendID,
							code	: getRsp.equip.vendCodeName.code,
							name	: getRsp.equip.vendCodeName.name
						});
					}

					mainView.utl_unit.prevValue = Number(mainView.fieldRelation.get('clbusunitselector'));
					mainView._onUnitChanged();

					$('#ca_equipTypeID').selectpicker('val', getRsp.equip.equipTypeID);
				});

				// マルチセレクトに結果を反映
				this.utl_orderCountTiming.setValue(getRsp.equip.orderCountTiming);
				this.utl_orderCountTiming.selectedValues = getRsp.equip.orderCountTiming;

				// Radioは自力で処理しなければならないの？
				this.applyCheckBox(getRsp.equip.equipManTypeID);

				this._onEquipManTypeChanged(null);

				this.fixedLimit();


				break;

			default:
			case 'NG':			// その他エラー。
				this.setReadOnlyAllItems();
				break;
			}

			this._onFlagAutoChanged();
		},

		applyCheckBox: function(value){
			//
			this.$('#ca_base_form input[type="radio"]').each(function(){
				if(value == $(this).val()){
					$(this).closest("label").addClass("checked", "checked");
				} else {
					$(this).closest("label").removeClass("checked");
				}
			});
		},

		isReadOnly: function() {
			var opeMode = this.options.opeTypeId;
			var readonly = false;
			if (opeMode == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL ||
				opeMode == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL ||
				opeMode == am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
				readonly = true;
			}
			return readonly;
		},

		setReadOnlyAllItems: function(){
			clutil.viewReadonly($("#div_ca_equipManTypeID"));
			clutil.inputReadonly($("#ca_equipManTypeID"));

			clutil.viewReadonly($("#ca_base_form"));
			clutil.viewReadonly($("#ca_premInfo_form"));
			clutil.viewReadonly($("#ca_order_form"));
			clutil.viewReadonly($("#ca_orderDate_form"));
			clutil.viewReadonly($("#ca_leadTime_form"));
			clutil.viewReadonly($("#ca_vendor_form"));
			clutil.viewReadonly($("#ca_notice_form"));
			mainView.imageSelectView1.setEnable(false);
			mainView.imageSelectView2.setEnable(false);

			$(".cmdRow").hide();
			$(".cmdCol").hide();

			$("#ca_equipManTypeID").attr('disabled', true);

			if (typeof this.grid_order != 'undefined'){
				this.grid_order.setEditable(false);
			}

			if (typeof this.grid_vend != 'undefined'){
				this.grid_vend.setEditable(false);
			}
		},

		_onOrderFuncTypeIDChanged : function(e) {

			var orderFunc;
			if ($("input:radio[name=equipManTypeID]:checked").val() == amcm_type.AMCM_VAL_EQUIP_ADMIN_TYPE_PREMIUM) {
				orderFunc = this.utl_orderFuncType_p.getValue();
			}else{
				orderFunc = this.utl_orderFuncType.getValue();
			}

			var cycle = this.utl_orderCycle.getValue();

			// 発注方法が「備品発注」「ノベルティ発注」の場合
			if (orderFunc == amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_EQUIP ||
				orderFunc == amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_PREMIUM){
				// 発注サイクルが「月末」「非定期」の場合
				if (cycle == amcm_type.AMCM_VAL_ORD_CYCLE_END_OF_MONTH ||
					cycle == amcm_type.AMCM_VAL_ORD_CYCLE_NOT_PERIODIC){

					 this.utl_orderCycle.resetValue();
					 this.utl_orderCountTiming.resetValue();
				}
			}

			if (this.validator){
				this.validator.clearErrorMsg($('#ca_orderCycle'));
			}
		},

		_onOrderCycleChanged : function(e) {
			var cycle = this.utl_orderCycle.getValue();

			var errors = $(e.currentTarget).parent().find('.cl_error_field');
			if (errors.length > 0){
				this.validator.clearErrorMsg(errors);
			}

			var orderCountTimingUpdated = false;

			if (cycle == amcm_type.AMCM_VAL_ORD_CYCLE_END_OF_MONTH){
				// 発注サイクルが「月末」の場合

				// 発注締めタイミングを「月末」にする
				this.utl_orderCountTiming.setValue([amcm_type.AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_MONTH_END]);
				orderCountTimingUpdated = true;

			} else if (cycle == amcm_type.AMCM_VAL_ORD_CYCLE_NOT_PERIODIC){
				// 発注サイクルが「非定期」の場合

				// 発注締めタイミングを「実施日の２週間前」にする
				this.utl_orderCountTiming.setValue([amcm_type.AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_TWO_WEEK_BEFORE_EXECUTE]);
				orderCountTimingUpdated = true;

			} else {
				// 発注サイクルが「月末」「非定期」以外の場合

				// 発注締めタイミングに「月末」「実施日の２週間前」が選択されていたら外す
				var values = this.utl_orderCountTiming.getValue();
				var monthEndIndex = values.indexOf(amcm_type.AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_MONTH_END);
				var weekBeforeIndex = values.indexOf(amcm_type.AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_TWO_WEEK_BEFORE_EXECUTE);

				if (monthEndIndex > -1){
					values.splice(values.indexOf(monthEndIndex), 1);
				}
				if (weekBeforeIndex > -1){
					values.splice(values.indexOf(weekBeforeIndex), 1);
				}

				this.utl_orderCountTiming.setValue(values);
				orderCountTimingUpdated = true;
			}

			if (orderCountTimingUpdated){
				var errors = $(this.utl_orderCountTiming.el).parent().find('.cl_error_field');
				if (errors.length > 0){
					this.validator.clearErrorMsg(errors);
				}
			}

			// チェック用に選択値を保存する
			this.utl_orderCountTiming.selectedValues = this.utl_orderCountTiming.getValue();
		},

		_onOrderCountTimingChanged : function(e) {
			var values = this.utl_orderCountTiming.getValue();

			var errors = $(e.currentTarget).parent().find('.cl_error_field');
			if (errors.length > 0){
				this.validator.clearErrorMsg(errors);
			}

			if (this.utl_orderCountTiming.selectedValues != null){
				var prevValues = this.utl_orderCountTiming.selectedValues;
				var chkVal;
				var chkSrc;

				if (values.length > prevValues.length){
					chkVal = values;
					chkSrc = prevValues;
				} else {
					chkVal = prevValues;
					chkSrc = values;
				}

				// 何が選択されたかを探す
				var selectedValue = -1;
				for (var i = 0; i < chkVal.length; i++) {
					var num = chkVal[i];
					if ($.inArray(num, chkSrc) == -1){
						selectedValue = num;
						break;
					}
				};

				var cycle = this.utl_orderCycle.getValue();

				if (selectedValue == amcm_type.AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_MONTH_END ||
					selectedValue == amcm_type.AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_TWO_WEEK_BEFORE_EXECUTE) {
					// 「月末」、「実施日の２週間前」が選択された場合

					if ($.inArray(selectedValue, values) > -1){
						// 選択が未チェック->チェックの場合

						if ((selectedValue == amcm_type.AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_MONTH_END && cycle == amcm_type.AMCM_VAL_ORD_CYCLE_END_OF_MONTH) ||
							(selectedValue == amcm_type.AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_TWO_WEEK_BEFORE_EXECUTE && cycle == amcm_type.AMCM_VAL_ORD_CYCLE_NOT_PERIODIC)){

							// 他の選択を全て外す
							this.utl_orderCountTiming.setValue([selectedValue]);
							values = this.utl_orderCountTiming.getValue();
						} else {
							values.splice(values.indexOf(selectedValue), 1);
							this.utl_orderCountTiming.setValue(values);
						}
					}
				} else {
					// 「月末」、「実施日の２週間前」以外が選択された場合

					if (cycle == amcm_type.AMCM_VAL_ORD_CYCLE_END_OF_MONTH){
						this.utl_orderCountTiming.setValue([amcm_type.AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_MONTH_END]);
					} else if (cycle == amcm_type.AMCM_VAL_ORD_CYCLE_NOT_PERIODIC){
						this.utl_orderCountTiming.setValue([amcm_type.AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_TWO_WEEK_BEFORE_EXECUTE]);
					} else if ($.inArray(amcm_type.AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_MONTH_END, values) > -1 ||
						$.inArray(amcm_type.AMCM_VAL_EQUIP_ODER_CLOSE_TIMING_TWO_WEEK_BEFORE_EXECUTE, values) > -1){
						// 既に「月末」、「実施日の２週間前」が選択されている場合

						// 選択をやめる
						this.utl_orderCountTiming.setValue(prevValues);
					}

					values = this.utl_orderCountTiming.getValue();
				}
			}

			this.utl_orderCountTiming.selectedValues = values;
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});

			var view = this;


			// リレーション設定
			this.fieldRelation = clutil.FieldRelation.create('default', {
					// 事業ユニット
					clbusunitselector: {
						el: '#ca_unitID',
						initValue: clcom.userInfo.unit_id
					},
					// 備品取引先
					clequipvendcode: {
						el: '#ca_equipVend'
					},
					// 適用期間（開始）
					datepicker: {
						el: '#ca_fromDate'
					}
				},{
			});
			this.fieldRelation.done(function() {
				console.log('!CHECK! DONE-------------------------------------------');
				var tgtView = view;
				tgtView.utl_unit = this.fields.clbusunitselector;
				tgtView.utl_equipVend = this.fields.clequipvendcode;
				tgtView.initialized = true;
				tgtView.setInitializeValue();
				tgtView.setDefaultEnabledProp();
			});

			// 適用期間（終了）
			this.utl_toDate = clutil.datepicker(this.$("#ca_toDate"));
			$('#ca_toDate').datepicker('setIymd', clcom.max_date);


			// 備品担当部署区分
			this.utl_department = clutil.cltypeselector({
				el: '#ca_departmentID',
				kind: amcm_type.AMCM_TYPE_EQUIP_DEPART_TYPE
				/*ids: [
						amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_SOMU,			// 営業支援部
						amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_HANSOKU,		// 販促部
						amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_SHOUHIN_KANRI,	// 商品管理部
						amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_TENPO_KIKAKU,	// 店舗企画建築部
						amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_EIGYOU_KANRI	// 営業管理
					]*/
	    	});
			// 備品担当部署区分
			this.utl_department2 = clutil.cltypeselector({
				el: '#ca_departmentID_ori',
				kind: amcm_type.AMCM_TYPE_EQUIP_DEPART_TYPE,
				ids: [
						amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_EIGYOU_KANRI,
					]
	    	});
			$("#div_ca_departmentID").show();
			$("#div_ca_departmentID_ori").hide();

			// ノベルティ商品区分
			this.utl_premType = clutil.cltypeselector({
				el: '#ca_premTypeID',
				kind: amcm_type.AMCM_TYPE_PREM_TYPE
	    	});

			// 配付時期
			this.utl_distFromDate = clutil.datepicker(this.$("#ca_distFromDate"));
			this.utl_distToDate = clutil.datepicker(this.$("#ca_distToDate"));

			// 発注方法
			this.utl_orderFuncType = clutil.cltypeselector({
				el: '#ca_orderFuncTypeID',
				kind: amcm_type.AMCM_TYPE_EQUIP_ORDER_TYPE,
				ids:
				[
				 	// 備品発注
					amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_EQUIP,
					// たのめーる
					amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_TANOMERU,
					// ワークフロー
					amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_WORKFLOW,
					// メール
					amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_MAIL,
					// 店舗119
					amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_STORE119,
					// メッセージ
					amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_MESSAGE
				]
	    	});

			// 発注方法
			this.utl_orderFuncType_p = clutil.cltypeselector({
				el: '#ca_orderFuncTypeID_p',
				kind: amcm_type.AMCM_TYPE_EQUIP_ORDER_TYPE,
				ids:
				[
				 	// ノベルティ発注
					amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_PREMIUM,
				]
	    	});

			// 発注サイクル
			this.utl_orderCycle = clutil.cltypeselector({
				el: '#ca_orderCycle',
				kind: amcm_type.AMCM_TYPE_ORD_CYCLE
	    	});

		    // 発注締めタイミング
			this.utl_orderCountTiming = clutil.cltypeselector({
				el: '#ca_orderCountTiming',
				kind: amcm_type.AMCM_TYPE_EQUIP_ODER_CLOSE_TIMING
	    	});

			// 発送元
			this.utl_senderType = clutil.cltypeselector({
				el: '#ca_senderTypeID',
				kind: amcm_type.AMCM_TYPE_EQUIP_SENDER_TYPE
	    	});

			// XXX: 初期表示では「店舗別例外設定」を表示し、「発注可能店舗」は表示しない
			this.$("#ldlStoreExtraConfig").show();
			this.$("#ldlStoreOdrAble").hide();

			// 最大発注箱数に必須マーク表示
			this.$("#div_ca_maxOrderLotQy").addClass('required');
			// 最大発注箱数を必須項目にする
			this.$("#ca_maxOrderLotQy").addClass('cl_required');

			// 初期フォーカスオブジェクト設定
			if(clcom.userInfo.unit_id >= clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				this.$tgtFocus = $("#ca_fromDate");
			}
			else{
				this.$tgtFocus = $('#ca_unitID');
			}

			// 初期フォーカス設定
			clutil.setFocus(this.$tgtFocus);

			this.fixedLimit();

			return this;
		},

		fixedLimit: function(){
			clutil.cltxtFieldLimit($("#ca_equipCode"));
			clutil.cltxtFieldLimit($("#ca_premCode"));
			clutil.cltxtFieldLimit($("#ca_equipName"));
			clutil.cltxtFieldLimit($("#ca_storeNoticeMemo"));
		},

		setInitializeValue: function(){
			if (this.delayedCallParam != null){
				console.log('!CHECK! DelayedCall');
				this._onMDGetCompleted(this.delayedCallParam.args, this.delayedCallParam.e);
				this.delayedCallParam = null;
			}
		},

		setDefaultEnabledProp: function() {
			// 初期活性制御
			if ((clcom.userInfo.user_typeid== amcm_type.AMCM_VAL_USER_STORE || clcom.userInfo.user_typeid== amcm_type.AMCM_VAL_USER_STORE_MAN) || this.isReadOnly()) {
				clutil.viewReadonly($("#div_ca_unitID"));
			}

			clutil.viewReadonly(this.$(".ca_toDate_div"));
			this._onUnitChanged();

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL) {
				$('#div_ca_toDate').hide();
				$('#pFromTo').text('削除日');

				// ツールチップ
				$("#ca_tp_del").tooltip({html: true});

			}else{
				// ツールチップ
				$('#ca_tp_del').hide();
			}
		},

		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();

			// 画像セレクタ
			this.imageSelectView1.render();		// デザイン（全体）
			this.imageSelectView2.render();		// デザイン（拡大）

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW) {
				this.fieldRelation.fields.datepicker.setValue(clutil.addDate(clcom.getOpeDate(), 1));
				//this.fieldRelation.reset();

				this.utl_toDate.datepicker('setIymd', clcom.max_date);

				this.initGrid();
				var ordInitData = _.chain(10).range().map(function(){return {};}).value();
				var orddata = {
					gridOptions	: {autoHeight: false},	// データグリッドのオプション
					columns	: this.columns_order,		// カラム定義
					data	: ordInitData				// データ
				};
				this.grid_order.setData(orddata);

				var vendInitData = _.chain(10).range().map(function(){return {};}).value();
				var vendData = {
					gridOptions	: {autoHeight: false},	// データグリッドのオプション
					columns	: this.columns_vend,		// カラム定義
					data	: vendInitData				// データ
					};
				this.grid_vend.setData(vendData);

//$(".cl_datagrid_container div").prop('tabindex',-1);

			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}

			return this;
		},

		// Get リクエストを作る
		_buildGetReqFunction: function(opeTypeId, pgIndex){

			if (typeof this.doClear != 'undefined'){
				clutil.viewRemoveReadonly($('#container'));
				mainView.imageSelectView1.setEnable(true);
				mainView.imageSelectView2.setEnable(true);
				this.setDefaultEnabledProp();
			}

			this.chkDataIndex = pgIndex;

			var getReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// 検索リクエスト
				AMEQV0040GetReq: {
					srchEquipID: this.options.chkData[pgIndex].equipID,			// 事業ユニットID
					srchDate: this.options.chkData[pgIndex].fromDate			// 適用開始日
				},
				// 更新リクエスト
				AMEQV0040UpdReq: {
				}
			};

			return {
				resId: clcom.pageId,	//'AMEQV0040',
				data: getReq
			};
		},

		// XXX
		setValidateOption : function(){
			var $OCycle = $('#ca_orderCycle');
			var $OCountTiming = $('#ca_orderCountTiming');

			// 「発注可能な店舗のみ入力する」がチェックされている場合
			if ($('#ca_flagOdrStore').attr('checked')) {

				// 最大発注箱数の必須を外す
				$('#ca_maxOrderLotQy').removeClass('cl_valid');
				$('#ca_maxOrderLotQy').removeClass('cl_required');

			} else {

				// 最大発注箱数を必須にする
				$('#ca_maxOrderLotQy').addClass('cl_valid');
				$('#ca_maxOrderLotQy').addClass('cl_required');
			}

			// 「定時締め」がチェックされている場合
			if ($('#ca_flagAuto').attr('checked')) {
				// 「発注サイクル」「発注締めタイミング」を必須にする
				$OCycle.addClass('cl_valid');
				$OCycle.addClass('cl_required');
				$OCountTiming.addClass('cl_valid');
				$OCountTiming.addClass('cl_required');
			} else {
				// 「発注サイクル」「発注締めタイミング」の必須を外す
				$OCycle.removeClass('cl_valid');
				$OCycle.removeClass('cl_required');
				$OCountTiming.removeClass('cl_valid');
				$OCountTiming.removeClass('cl_required');
			}

			var radio = $("input:radio[name=equipManTypeID]:checked");
			var val = radio.val();

			var $equipTypeID = $("#ca_equipTypeID");
			var $equipCode = $("#ca_equipCode");

			var $premTypeID = $("#ca_premTypeID");
			var $premCode = $("#ca_premCode");

			var $distFromDate = $('#ca_distFromDate');
			var $distToDate = $('#ca_distToDate');
			var $equipVend = $('#ca_equipVend');

			var $orderFuncTypeE = $('#ca_orderFuncTypeID');
			var $orderFuncTypeP = $('#ca_orderFuncTypeID_p');

			// ノベルティ
			if (val == amcm_type.AMCM_VAL_EQUIP_ADMIN_TYPE_PREMIUM) {
				this.setValidateTarget(false, [$equipTypeID, $equipCode, $equipVend, $orderFuncTypeE]);
				//2015/1/28 UAT0101対応(配布期間の必須チェック削除)
				//this.setValidateTarget(true, [$premTypeID, $premCode, $distFromDate, $distToDate, $orderFuncTypeP]);
				this.setValidateTarget(true, [$premTypeID, $premCode, $orderFuncTypeP]);

				this.validator.clearErrorMsg($equipTypeID.parent().find('.cl_error_field'));
				this.validator.clearErrorMsg($equipCode);
				this.validator.clearErrorMsg($orderFuncTypeE);
			// 備品
			} else {
				this.setValidateTarget(true, [$equipTypeID, $equipCode, $equipVend, $orderFuncTypeE]);
				//2015/1/28 UAT0101対応(配布期間の必須チェック削除)
				//this.setValidateTarget(false, [$premTypeID, $premCode, $distFromDate, $distToDate, $orderFuncTypeP]);
				this.setValidateTarget(false, [$premTypeID, $premCode, $orderFuncTypeP]);

				this.validator.clearErrorMsg($premTypeID.parent().find('.cl_error_field'));
				this.validator.clearErrorMsg($premCode);
				this.validator.clearErrorMsg($distFromDate);
				this.validator.clearErrorMsg($distToDate);
				this.validator.clearErrorMsg($orderFuncTypeP);
			}

			var val = Number(this.utl_unit.getValue());
			if (val === clutil.getclsysparam('PAR_AMMS_UNITID_ORI')) {
				$('#ca_departmentID_ori').addClass('cl_valid');
				$('#ca_departmentID_ori').addClass('cl_required');
				$('#ca_departmentID').removeClass('cl_valid');
				$('#ca_departmentID').removeClass('cl_required');
			}else{
				$('#ca_departmentID').addClass('cl_valid');
				$('#ca_departmentID').addClass('cl_required');
				$('#ca_departmentID_ori').removeClass('cl_valid');
				$('#ca_departmentID_ori').removeClass('cl_required');
			}
		},

		setValidateTarget: function(isValid, tgtList){
			$.each(tgtList, function(){
				if (isValid){
					this.addClass('cl_valid');
					this.addClass('cl_required');
				} else {
					this.removeClass('cl_valid');
					this.removeClass('cl_required');
				}
			});
		},

		hasHeaderError: function(){
			var hasError = false;
			var ope_date = clcom.getOpeDate();
			var $fromDate = this.$("#ca_fromDate");
			var fromDate = clutil.dateFormat($fromDate.val(), "yyyymmdd");
			var recfromDate = null;
			var rectoDate = null;

			var chkData = this.options.chkData;
			if (chkData !== undefined && chkData.length > 0 &&
					typeof this.chkDataIndex != 'undefined'){
				recfromDate = chkData[this.chkDataIndex].fromDate;
				rectoDate = chkData[this.chkDataIndex].toDate;
			}

			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY:
				if (fromDate <= ope_date) {
					// 開始日が運用日以前の場合はエラー
					this.validator.setErrorHeader(clmsg.cl_echoback);
					this.validator.setErrorMsg($fromDate, clmsg.cl_st_date_min_opedate);
					hasError = true;
				}
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				var compfromDate = ope_date < recfromDate ? recfromDate : ope_date;
				var msg = ope_date > recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;

				if (fromDate <= compfromDate && rectoDate == clcom.max_date && fromDate != recfromDate){ // 未来予約可能で修正でない状態で開始日が明日以降でない
					this.validator.setErrorHeader(clmsg.cl_echoback);
					this.validator.setErrorMsg($fromDate, msg);
					hasError = true;
				}
				break;

			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				if (fromDate <= ope_date || fromDate <= recfromDate){ // 設定開始日が明日以降かつ編集前開始日以降でない
					var msg = ope_date >= recfromDate ? clmsg.cl_st_date_min_opedate : clmsg.cl_st_date_min_eddate;
					this.validator.setErrorHeader(clmsg.cl_echoback);
					this.validator.setErrorMsg($fromDate, msg);
					hasError = true;
				}
				break;

			default:
				break;
			}

			if(hasError){
				return hasError;
			}

			// 期間反転チェック
			var chkInfo = [];
			chkInfo.push({
				stval : 'ca_fromDate',
				edval : 'ca_toDate'
			});

			if(!this.validator.validFromTo(chkInfo)){
				hasError = true;
				return hasError;
			}

			if ($("input:radio[name=equipManTypeID]:checked").val() == amcm_type.AMCM_VAL_EQUIP_ADMIN_TYPE_PREMIUM) {
				// 期間反転チェック
				chkInfo = [];
				chkInfo.push({
					stval : 'ca_distFromDate',
					edval : 'ca_distToDate'
				});

				if(!this.validator.validFromTo(chkInfo)){
					hasError = true;
					return hasError;
				}
			}

			return hasError;
		},

		hasBaseError: function(){
			var hasError = false;
			var chkInfo = [];

			var orderFunc;
			if ($("input:radio[name=equipManTypeID]:checked").val() == amcm_type.AMCM_VAL_EQUIP_ADMIN_TYPE_PREMIUM) {
				orderFunc = this.utl_orderFuncType_p.getValue();
			}else{
				orderFunc = this.utl_orderFuncType.getValue();
			}

			var typeName = clutil.gettypename(amcm_type.AMCM_TYPE_EQUIP_ORDER_TYPE, orderFunc, 1);
			var cycleEOM = clutil.gettypename(amcm_type.AMCM_TYPE_ORD_CYCLE, amcm_type.AMCM_VAL_ORD_CYCLE_END_OF_MONTH, 1);
			var cycleNP = clutil.gettypename(amcm_type.AMCM_TYPE_ORD_CYCLE, amcm_type.AMCM_VAL_ORD_CYCLE_NOT_PERIODIC, 1);
			var cycle = this.utl_orderCycle.getValue();

			// 発注方法が「備品発注」「ノベルティ発注」の場合
			if (orderFunc == amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_EQUIP ||
				orderFunc == amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_PREMIUM){
				// 発注サイクルが「月末」「非定期」の場合
				if (cycle == amcm_type.AMCM_VAL_ORD_CYCLE_END_OF_MONTH ||
					cycle == amcm_type.AMCM_VAL_ORD_CYCLE_NOT_PERIODIC){

					this.validator.setErrorHeader(clmsg.cl_echoback);
					this.validator.setErrorMsg($('#ca_orderCycle'), '発注方法が「' + typeName + '」の場合、"' + cycleEOM + '"、"' + cycleNP + '"は選択できません。');
					hasError = true;
				}
			}

			// ノベルティ
			if ($("input:radio[name=equipManTypeID]:checked").val() == amcm_type.AMCM_VAL_EQUIP_ADMIN_TYPE_PREMIUM) {
				// 期間反転チェック
				chkInfo = [];
				chkInfo.push({
					stval : 'ca_distFromDate',
					edval : 'ca_distToDate'
				});

				if(!this.validator.validFromTo(chkInfo)){
					hasError = true;
				}
			// 備品
			} else {
				if (!$('#ca_flagAuto').attr('checked')) {
					this.validator.setErrorHeader('備品の場合、定時のチェックが必須です。');
					hasError = true;
				}
			}

			// 発注日未設定チェック
			if (!hasError){
				if (!$('#ca_flagAuto').attr('checked') && !$('#ca_flagAN').attr('checked')) {
					this.validator.setErrorHeader('定時、随時のどちらかはチェックが必要です。');
					hasError = true;
				}
			}

			return hasError;
		},

		hasGridError: function(){
			var hasError = false;

			this.grid_order.stopEditing();
			this.grid_vend.stopEditing();

			if(!this.grid_order.isValid()) {
				hasError = true;
			}
			if(!this.grid_vend.isValid()) {
				hasError = true;
			}

			if (hasError){
				return hasError;
			}

			var unitid = this.utl_unit.getValue();
			var ordData = this.grid_order.getData();
			var vendData = this.grid_vend.getData();
			var orderStore = {};
			var vendStore = {};
			var vendor = {};

			$.each(ordData, function(){
				var storeid = (this.store && (this.store.id || this.store.name)) ? this.store.id : 0;
				var storeName = (this.store && (this.store.name)) ? this.store.name : "";
				var maxOrderLotQy = (this.maxOrderLotQy) ? this.maxOrderLotQy : 0;
				var rowid = this._cl_gridRowId;

				// 片側のみの入力をチェック
				if (storeid != 0 && maxOrderLotQy == 0){
					hasError = true;
					mainView.grid_order.setCellMessage(rowid, 'maxOrderLotQy', 'error', clmsg.cl_required);
				} else if ((storeid == '' && maxOrderLotQy != 0)||(storeid == 0 && storeName != "")){
					hasError = true;
					mainView.grid_order.setCellMessage(rowid, 'store', 'error', clmsg.cl_required);
				}

				if (storeid == 0 && maxOrderLotQy == 0){
					return true;
				}

				if (typeof this.store != 'undefined' && typeof this.store.parentList != 'undefined'){
					$.each(this.store.parentList, function(){
						if (this.orglevel_id == Number(clcom.getSysparam('PAR_AMMS_UNIT_LEVELID'))){
							if (this.id != unitid){
								hasError = true;
								mainView.grid_order.setCellMessage(rowid, 'store', 'error', clmsg.EGM0046);
							}
						}
					});
				}

				var storeKey = '' + storeid;
				if (orderStore[storeKey] == null){
					orderStore[storeKey] = new Array();
				}
				orderStore[storeKey].push(rowid);

				if (orderStore[storeKey].length > 1){
					hasError = true;
				}
			});


			$.each(vendData, function(){
				var storeid = (this.store && (this.store.id || this.store.name)) ? this.store.id : 0;
				var storeName = (this.store && (this.store.name)) ? this.store.name : "";
				var vendid = (this.vend && (this.vend.id || this.vend.name)) ? this.vend.id : 0;
				var vendName = (this.vend && (this.vend.name)) ? this.vend.name : "";
				var rowid = this._cl_gridRowId;

				// 片側のみの入力をチェック
				if ((storeid != 0 && vendid == 0) || (vendid == 0 && vendName != "")){
					hasError = true;
					mainView.grid_vend.setCellMessage(rowid, 'vend', 'error', clmsg.cl_required);
				} else if ((storeid == '' && vendid != 0) || (storeid == 0 && storeName != "")){
					hasError = true;
					mainView.grid_vend.setCellMessage(rowid, 'store', 'error', clmsg.cl_required);
				}

				if (storeid == 0 && vendid == 0){
					return true;
				}

				if (typeof this.store != 'undefined' && typeof this.store.parentList != 'undefined'){
					$.each(this.store.parentList, function(){
						if (this.orglevel_id == Number(clcom.getSysparam('PAR_AMMS_UNIT_LEVELID'))){
							if (this.id != unitid){
								hasError = true;
								mainView.grid_vend.setCellMessage(rowid, 'store', 'error', clmsg.EGM0046);
							}
						}
					});
				}

				if (storeid != 0){
					var storeKey = '' + storeid;
					if (vendStore[storeKey] == null){
						vendStore[storeKey] = new Array();
					}
					vendStore[storeKey].push(rowid);

					if (vendStore[storeKey].length > 1){
						hasError = true;
					}
				}

				if (vendid != 0){
					var vendKey = '' + vendid;
					if (vendor[vendKey] == null){
						vendor[vendKey] = new Array();
					}
					vendor[vendKey].push(rowid);

					if (vendor[vendKey].length > 1){
						//hasError = true;
					}
				}
			});

			if(hasError){
				$.each(orderStore, function() {
					if (this.length > 1){
						$.each(this, function() {
							mainView.grid_order.setCellMessage(this, 'store', 'error', clmsg.cl_repetition);
						});
					}
				});
				$.each(vendStore, function() {
					if (this.length > 1){
						$.each(this, function() {
							mainView.grid_vend.setCellMessage(this, 'store', 'error', clmsg.cl_repetition);
						});
					}
				});
				$.each(vendor, function() {
					if (this.length > 1){
						$.each(this, function() {
							mainView.grid_vend.setCellMessage(this, 'vend', 'error', clmsg.cl_repetition);
						});
					}
				});

				this.validator.setErrorHeader(clmsg.cl_echoback);
				return hasError;
			}
		},

		/**
		 * XXX: 更新系のリクエストを作る
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			var hasError = false;

			this.grid_order.clearCellMessage();
			this.grid_vend.clearCellMessage();

			this.setValidateOption();

			if ($("#content").find('.cl_error_field').length > 0){
				this.validator.setErrorHeader(clmsg.cl_echoback);
				return null;
			}

			if(!this.validator.valid()) {
				hasError = true;
			}

			if(this.hasHeaderError()) {
				hasError = true;
			}

			if (!this.grid_order.isValid()) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				hasError = true;
			}

			if (!this.grid_vend.isValid()) {
				this.validator.setErrorHeader(clmsg.cl_echoback);
				hasError = true;
			}

			if (hasError){
				return null;
			}

			if (!this.isReadOnly()) {
				if(this.hasBaseError()) {
					hasError = true;
				}
				if(this.hasGridError()) {
					hasError = true;
				}
			}

			if (hasError){
				return null;
			}

			// XXX
			if ($('#ca_flagOdrStore').attr('checked')) {

				var statFlag = true;

				// 「発注可能な店舗のみ入力する」チェックボックスがチェック済みの場合
				// 発注の「発注可能店舗」に設定されていない店舗が、取引先の「店舗別例外設定」に
				// 設定されている場合はエラーとする

				// 発注の「発注可能店舗」リスト
				var ordStoreData = this.grid_order.getData({
					delflag: false,
					tailEmptyCheckFunc: ClGrid.getEmptyCheckFunc(this.grid_order)
				});

				// 取引先の「店舗別例外設定」リスト
				var vendorData = this.grid_vend.getData({
					delflag: false,
					tailEmptyCheckFunc: ClGrid.getEmptyCheckFunc(this.grid_vend)
				});

				// 取引先の「店舗別例外設定」リストでループを回す
				_.each(vendorData, function(data){

					// 行のID
					var rowId = data[this.grid_vend.idProperty];

					// 取引先の例外設定店舗ID
					var extraStoreID = data.store.id;

					var existFlag = 0;

					// 発注の「発注可能店舗」リストでループを回す
					_.each(ordStoreData, function(dataOdrStore){

						// 発注可能店舗ID
						var odrStoreID = dataOdrStore.store.id;

						if(extraStoreID === odrStoreID) {
							// 取引先の例外設定店舗IDが発注の「発注可能店舗」と一致する
							existFlag = 1;
						}
					},this);

					if(existFlag === 0) {
						var msg = clutil.fmt(clutil.getclmsg('EGM0023'), "発注可能店舗リストに店舗");
						this.grid_vend.setCellMessage(rowId, 'store', 'error', msg);
						statFlag = false;
					}

				},this);

				if(statFlag === false) {
					this.validator.setErrorHeader(clmsg.cl_echoback);
					return;
				}
			}

			// Rec を構築する。
			var ordData = this.grid_order.getData();
			var vendData = this.grid_vend.getData();
			var storeEquipForOrder = [];
			var storeEquipForVend = [];

			$.each(ordData, function(){
				var storeid = (this.store && this.store.id) ? this.store.id : 0;
				var maxOrderLotQy = (this.maxOrderLotQy) ? this.maxOrderLotQy : 0;

				if (storeid != 0 && maxOrderLotQy != 0){
					storeEquipForOrder.push({
						storeID			: storeid,
						maxOrderLotQy	: maxOrderLotQy
					});
				}
			});
			$.each(vendData, function(){
				var storeid = (this.store && this.store.id) ? this.store.id : 0;
				var vendid = (this.vend && this.vend.id) ? this.vend.id : 0;

				if (storeid != 0 && vendid != 0){
					storeEquipForVend.push({
						storeID			: storeid,
						equipVendID		: vendid
					});
				}
			});

			var equip = clutil.view2data(this.$('#content'));

			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW ||
				this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY) {
				equip.recno = "";
				equip.state = 0;
				equip.equipVendID = 0;
				this.options.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}

			var wholeImage = mainView.imageSelectView1.serialize();
			var closeupImage = mainView.imageSelectView2.serialize();

			if (wholeImage != null) {
				equip.wholeImageFileID = wholeImage.id;
				equip.wholeImageFileName = wholeImage.filename;
				equip.wholeImageURI = wholeImage.uri;
			}

			if (closeupImage != null) {
				equip.closeupImageFileID = closeupImage.id;
				equip.closeupImageFileName = closeupImage.filename;
				equip.closeupImageURI = closeupImage.uri;
			}

			equip.orderCountTiming = this.utl_orderCountTiming.getValue();
			equip.equipVendID = equip.equipVend;

			if (equip.equipManTypeID == amcm_type.AMCM_VAL_EQUIP_ADMIN_TYPE_PREMIUM){
				equip.equipTypeID = 0;
				equip.equipCode = equip.premCode;
				equip.orderFuncTypeID = equip.orderFuncTypeID_p;
			} else {
				equip.premTypeID = 0;
			}

			if (~~equip.unitID == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				equip.departmentID = equip.departmentID_ori;
				equip.equipTypeID = equip.equipTypeID - 1;	//備品区分idを+させたので調整
			}

			var updReq = {
				// 共通ヘッダ
				reqHead: {
					opeTypeId: this.options.opeTypeId,
					recno: equip.recno,
					state: equip.state
				},
				// 共通ページヘッダ
				reqPage: {
				},
				// マスタ検索リクエスト
				AMEQV0040GetReq: {
				},
				// マスタ更新リクエスト
				AMEQV0040UpdReq: {
					equip: equip,
					storeEquipForOrder: storeEquipForOrder,
					storeEquipForVend: storeEquipForVend
				}
			};

//return null;
			return {
				resId: clcom.pageId,	//'AMEQV0040',
				data: updReq
			};
		},

		_onUnitChanged: function(e){
			if(this.deserializing){
				return;
			}
			if (typeof this.fieldRelation == 'undefined') {
				return;
			}

			var val = Number(this.fieldRelation.get('clbusunitselector'));

			//事業ユニットがORIHICAの場合は、担当部署に「営業管理部」を表示し操作不可能とする
			if (val === clutil.getclsysparam('PAR_AMMS_UNITID_ORI')) {

				// 備品コードのツールチップは表示しない
				$("#ca_tp_equip_code1").addClass('dispn');
				$("#ca_tp_prem_code1").addClass('dispn');

				$("#div_ca_departmentID").hide();
				$("#div_ca_departmentID_ori").show();

				this.utl_department2.setValue(amcm_type.AMCM_VAL_EQUIP_DEPART_TYPE_EIGYOU_KANRI);
				clutil.viewReadonly($("#div_ca_departmentID"));
				clutil.viewReadonly($("#div_ca_departmentID_ori"));
				this.validator.clearErrorMsg($('#ca_departmentID'));
				this.validator.clearErrorMsg($('#ca_departmentID_ori'));
			} else {
				$("#div_ca_departmentID").show();
				$("#div_ca_departmentID_ori").hide();

				if (this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_REL &&
					this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL &&
					this.options.opeTypeId != am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL){
					clutil.viewRemoveReadonly($("#div_ca_departmentID"));
					clutil.viewRemoveReadonly($("#div_ca_departmentID_ori"));
				}

				// 事業ユニットがAOKIの場合のみ、備品コードにヘルプを表示
				if (val === clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')) {
					$("#ca_tp_equip_code1").removeClass('dispn');
					$("#ca_tp_equip_code1").tooltip({html: true});
					$("#ca_tp_prem_code1").removeClass('dispn');
					$("#ca_tp_prem_code1").tooltip({html: true});

				} else {
					// 備品コードのツールチップは表示しない
					$("#ca_tp_equip_code1").addClass('dispn');
					$("#ca_tp_prem_code1").addClass('dispn');
				}
			}

			//備品区分入れ替え
			this.setEquipTypeSel(val);
			if(val == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')
					|| val == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				clutil.inputRemoveReadonly("#ca_equipTypeID");
			}
			else{
				clutil.inputReadonly("#ca_equipTypeID");
			}

			this.utl_unit.prevValue = val;
		},

		/**
		 * 備品区分入れ替え
		 */
		setEquipTypeSel: function(unit){
			console.log("****************************************備品セレクター作成");


			if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_AOKI')){
				// 備品区分(AOKI用)
				this.utl_equipType = clutil.cltypeselector({
					el: '#ca_equipTypeID',
					kind: amcm_type.AMCM_TYPE_EQUIP_TYPE,
					ids: [
							amcm_type.AMCM_VAL_EQUIP_TYPE_PACKING,		// 10:包装	
							amcm_type.AMCM_VAL_EQUIP_TYPE_PACKAGE,		// 11:パッケージ
							amcm_type.AMCM_VAL_EQUIP_TYPE_SYSTEM,		// 13:システム
							amcm_type.AMCM_VAL_EQUIP_TYPE_RESIZE,		// 21:補正
							amcm_type.AMCM_VAL_EQUIP_TYPE_BALOON,		// 30:風船関連備品
							amcm_type.AMCM_VAL_EQUIP_TYPE_DISCOUNT,		// 31:商品割引券
							amcm_type.AMCM_VAL_EQUIP_TYPE_MAIL,			// 32:メール会員登録他
							amcm_type.AMCM_VAL_EQUIP_TYPE_POP,			// 33:POP
							amcm_type.AMCM_VAL_EQUIP_TYPE_SLTAG,		// 39:SL下げ札
							amcm_type.AMCM_VAL_EQUIP_TYPE_SHTAG,		// 40:肩タグ・肩タグ用シール
							amcm_type.AMCM_VAL_EQUIP_TYPE_SHTAGSL,		// 41:肩タグ用シール
							amcm_type.AMCM_VAL_EQUIP_TYPE_CCLTAG,		// 42:円タグ
							amcm_type.AMCM_VAL_EQUIP_TYPE_SLVCOVER_ETC,	// 43:袖かぶせその他
							amcm_type.AMCM_VAL_EQUIP_TYPE_LEAF,			// 44:リーフレット・ビラ
							amcm_type.AMCM_VAL_EQUIP_TYPE_SLVTAG,		// 45:袖タグ
							amcm_type.AMCM_VAL_EQUIP_TYPE_PETSL,		// 46:PETシール
							amcm_type.AMCM_VAL_EQUIP_TYPE_PLC,			// 47:プライスカード
							amcm_type.AMCM_VAL_EQUIP_TYPE_MDSLVCOVER,	// 48:マークダウン袖かぶせ
							amcm_type.AMCM_VAL_EQUIP_TYPE_HALF_MDSLVCOVER,	// 49:半額マークダウン袖かぶせ
							amcm_type.AMCM_VAL_EQUIP_TYPE_MDSL,			// 50:マークダウンシール
							amcm_type.AMCM_VAL_EQUIP_TYPE_SIZESL,		// 51:サイズシール
							amcm_type.AMCM_VAL_EQUIP_TYPE_SIZESLBY,		// 52:サイズシールBY用
							amcm_type.AMCM_VAL_EQUIP_TYPE_TSSIZESLTS,	// 53:TSサイズシールTS用
							amcm_type.AMCM_VAL_EQUIP_TYPE_SLETC,		// 54:シールその他
							amcm_type.AMCM_VAL_EQUIP_TYPE_RACK,			// 55:棚挿し
							amcm_type.AMCM_VAL_EQUIP_TYPE_COLLECTSL,	// 56:タグ訂正シール
							amcm_type.AMCM_VAL_EQUIP_TYPE_SIZECHIP,		// 57:サイズチップスーツ・礼服・コート・JK・CY
							amcm_type.AMCM_VAL_EQUIP_TYPE_SIZECHIPSL,	// 58:サイズチップＳＬ
							amcm_type.AMCM_VAL_EQUIP_TYPE_SIZECHIPL,	// 59:サイズチップレディス
							amcm_type.AMCM_VAL_EQUIP_TYPE_CCLCHIP,		// 60:円チップ
							amcm_type.AMCM_VAL_EQUIP_TYPE_HANGERNECKTAG,// 61:ハンガーネックタグ
							amcm_type.AMCM_VAL_EQUIP_TYPE_SCHIP_SMX,	// 62:サイズチップSMX専用
							amcm_type.AMCM_VAL_EQUIP_TYPE_BLAND_COVER,	// 63:ブランドかぶせ
							amcm_type.AMCM_VAL_EQUIP_TYPE_HANGER,		// 65:ハンガー
							amcm_type.AMCM_VAL_EQUIP_TYPE_STORE_EQUIP,	// 68:店内備品
							amcm_type.AMCM_VAL_EQUIP_TYPE_ENVELOPE,		// 70:事務・封筒
							amcm_type.AMCM_VAL_EQUIP_TYPE_FAX,			// 72:FAX
							amcm_type.AMCM_VAL_EQUIP_TYPE_BOOK,			// 80:伝票・冊子
							amcm_type.AMCM_VAL_EQUIP_TYPE_SWEEP_OUT_OF_STORE,	// 90:除草剤・噴霧器

						],
						unselectedflag: 1
		    	});
			}
			else if(unit == clutil.getclsysparam('PAR_AMMS_UNITID_ORI')){
				var ids = [
							amcm_type.AMCM_VAL_EQUIP_TYPE_PACKAGE_EQ,	// 0:パッケージ備品
							amcm_type.AMCM_VAL_EQUIP_TYPE_8H,			// 1:エイトハート
							amcm_type.AMCM_VAL_EQUIP_TYPE_ORG,			// 2:オリジナル
							amcm_type.AMCM_VAL_EQUIP_TYPE_SIZECHIP_OR,	// 3:サイズチップ
							amcm_type.AMCM_VAL_EQUIP_TYPE_ATTACH,		// 4:商品付属品
							amcm_type.AMCM_VAL_EQUIP_TYPE_SYSTEM_EQ,	// 5:システム備品
							amcm_type.AMCM_VAL_EQUIP_TYPE_STATIONARY,	// 6:事務用品
							amcm_type.AMCM_VAL_EQUIP_TYPE_PLSL,			// 7:プライスシール
							amcm_type.AMCM_VAL_EQUIP_TYPE_SLIP,			// 8:伝票類
							amcm_type.AMCM_VAL_EQUIP_TYPE_OTHER,		// 9:その他
							amcm_type.AMCM_VAL_EQUIP_TYPE_STNBAR,		// 66:スタンバー
						];

				var typenamelist = clutil.gettypenamelist(amcm_type.AMCM_TYPE_EQUIP_TYPE, ids);
				if (typenamelist == null) {
					return;
				}
				for (var i = 0; i < typenamelist.length; i++) {
					//0:パッケージ備品の表記がおかしくなるのでidに+1(登録時には-1必須)
					typenamelist[i].type_id += 1;
				}
				this.utl_equipType = clutil.cltypeselector2(
						$('#ca_equipTypeID'),
						typenamelist,1,null,
						"type_id","name","code"
						);
			}
			else{
				//備品区分(空っぽ)
				this.utl_equipType = clutil.cltypeselector({
					el: '#ca_equipTypeID',
					kind: amcm_type.AMCM_TYPE_EQUIP_TYPE,
					ids: [],
						unselectedflag: 1
		    	});
			}
		},

		_onEquipManTypeChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}

			var radio = $("input:radio[name=equipManTypeID]:checked");
			var val = radio.val();

			var $divEQType = $("#div_ca_equipTypeID");
			var $divEQCode = $("#div_ca_equipCode");
			var $divPremType = $("#div_ca_premTypeID");
			var $divPremCode = $("#div_ca_premCode");
			var $divPInfo2 = $("#ca_premInfo_form");
			var $divEquipVend = $('#div_ca_equipVend');

			var $orderFuncType = $("#ca_orderFuncTypeID");
			var $divOrdFunc = $("#div_ca_orderFuncTypeID");

			var $equipNameE = $("#lblSrchEquipNameE");
			var $equipNameP = $("#lblSrchEquipNameP");

			var $funcTypeIDE = $("#div_orderFuncType_e");
			var $funcTypeIDP = $("#div_orderFuncType_p");

			// ノベルティ
			if (val == amcm_type.AMCM_VAL_EQUIP_ADMIN_TYPE_PREMIUM) {

				$divEQType.hide();
				$divEQCode.hide();
				$divPremType.show();
				$divPremCode.show();
				$divPInfo2.show();
				$divEquipVend.removeClass('required');

				$equipNameE.hide();
				$equipNameP.show();

				$funcTypeIDE.hide();
				$funcTypeIDP.show();

				// 発送元設定
				this.validator.clearErrorMsg($orderFuncType.parent().find('.cl_error_field'));
				this.utl_orderFuncType_p.setValue(amcm_type.AMCM_VAL_EQUIP_ORDER_TYPE_PREMIUM);
				clutil.viewReadonly($divOrdFunc);
			// 備品
			} else {

				$divEQType.show();
				$divEQCode.show();
				$divPremType.hide();
				$divPremCode.hide();
				$divPInfo2.hide();
				$divEquipVend.addClass('required');

				$equipNameE.show();
				$equipNameP.hide();

				$funcTypeIDE.show();
				$funcTypeIDP.hide();

				// 発送元設定
				if (!this.isReadOnly()){
					clutil.viewRemoveReadonly($divOrdFunc);
				}
			}

			if (this.validator){
				this.validator.clearErrorMsg($('#ca_orderCycle'));
			}
		},

		/**
		 * XXX: 「発注可能な店舗のみ入力する」チェックボックスをチェック
		 */
		_onFlagOdrStoreChanged: function(e){

			if(this.deserializing){
				// データセット中
				return;
			}

			if ($('#ca_flagOdrStore').attr('checked')) {

				// チェックボックスがチェックされた場合、最大発注箱数を入力不可にする
				clutil.viewReadonly($("#div_ca_maxOrderLotQy"));
				// 必須項目でなくす
				$('#div_ca_maxOrderLotQy').removeClass('required');
				$('#ca_maxOrderLotQy').removeClass('cl_valid');
				$('#ca_maxOrderLotQy').removeClass('cl_required');
				this.validator.clearErrorMsg($('#ca_maxOrderLotQy'));

				// 最大発注箱数の内容をクリア
				$("#ca_maxOrderLotQy").val('');

				//「店舗別例外設定」は隠し、「発注可能店舗」を表示する
				this.$("#ldlStoreExtraConfig").hide();
				this.$("#ldlStoreOdrAble").show();

			} else {

				// チェックボックスのチェックが外された場合、最大発注箱数を入力可能にする
				clutil.viewRemoveReadonly($("#div_ca_maxOrderLotQy"));
				// 必須項目にする
				$('#div_ca_maxOrderLotQy').addClass('required');
				$('#ca_maxOrderLotQy').addClass('cl_valid');
				$('#ca_maxOrderLotQy').addClass('cl_required');

				//「店舗別例外設定」は表示し、「発注可能店舗」を隠す
				this.$("#ldlStoreExtraConfig").show();
				this.$("#ldlStoreOdrAble").hide();

			}
		},

		/**
		 * XXX:「発注サイクルを指定して自動で締めを行う（定時）」チェックボックスをチェック
		 */
		_onFlagAutoChanged: function(e){
			if(this.deserializing){
				// データセット中
				return;
			}

			var $OCycle = $('#div_ca_orderCycle');
			var $OCountTiming = $('#div_ca_orderCountTimingID');

			if ($('#ca_flagAuto').attr('checked')) {
				$OCycle.addClass('required');
				$OCountTiming.addClass('required');
			} else {
				$OCycle.removeClass('required');
				$OCountTiming.removeClass('required');
			}
		},

		_eof: 'AMEQV0040.MainView//'
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
