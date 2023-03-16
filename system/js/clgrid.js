/**
 * @module ClGrid
 * @main
 *
 */

/**
 * @class ClGrid
 * @static
 */
var ClGrid = {};

/**
 * テンプレートのコンパイルを行う
 *
 * @method buildTemplate
 * @static
 * @param {string} text
 */
ClGrid.buildTemplate = function(text){
	return _.template(text, null, {variable: 'it'});
};

ClGrid.fixSelector = function($el, dataGrid){
	var $cell = $el.closest('.slick-cell'),
		grid = dataGrid.grid ? dataGrid.grid : dataGrid,
		$win = $(window),
		fixCss = function(){
			// スクロールで位置修正する
			var scrollTop = $win.scrollTop(),
				scrollLeft = $win.scrollLeft(),
				offset = $cell.offset(),
				width,
				height;

			if ($.fn.bootstrapSelect){
				// useSelectpicker2()使用時
				width = $cell.outerWidth();
				height = $cell.outerHeight();
			}else{
				width = $cell.width();
				height = $cell.height();
			}
			$el.css({
				top: offset.top - scrollTop,
				left: offset.left - scrollLeft,
				width: width,
				height: height
			});
		},
		onDestroy = function(){
			$win.off('scroll', fixCss);
			grid.onScroll.unsubscribe(fixCss);
		};

	grid.onScroll.subscribe(fixCss);
	$win.on('scroll', fixCss);
	$el.css('position', 'fixed');
	fixCss();

	if ($.fn.bootstrapSelect){
		// useSelectpicker2()使用時
		$el.find('select').selectpicker('setWidth', $cell.outerWidth());
	}
	return onDestroy;
};

/**
 * エラー行を特定する　
 * metaDatasの最初のオブジェクトがundefinedの場合に利用
 * @method showErrorRow
 * @param {object} metaDatas メタデータ
 * @param {object} gridData グリッドデータ
 */
ClGrid.getErrorRow = function(metaDatas, gridData, num) {
	var error = metaDatas;
	var rowId_error = new Array;
	for (var i =num; i < error.length; i++) {
		if (!error[i] || !error[i].hasErrorInRow) {
		} else {
			var keys = _.keys(error[i].columns);
			var errorInColFlg = 0;
			$.each(_.keys(error[i].columns), function(){
				if (this.indexOf('colIndex_' != -1) && this.indexOf('_field' != -1)) {
					errorInColFlg = 1;
				}
			});
			if (errorInColFlg) {
				$.each(error[i].columns, function(){
					if (!_.isUndefined(this.cellMessage)) {
						rowId_error[i-num] = this.cellMessage.rowId
					}
				});
				// if (error[i].columns.colIndex_0_field.cellMessage){
				// 	rowId_error[i-num] = error[i].columns.colIndex_0_field.cellMessage.rowId;
				// }
			}
			if (error[i].columns.distType) {
				if (error[i].columns.distType.cellMessage){
					rowId_error[i-num] = error[i].columns.distType.cellMessage.rowId;
				}
			}
			if (error[i].columns.makerItgrpCode){
				if (error[i].columns.makerItgrpCode.cellMessage){
					rowId_error[i-num] = error[i].columns.makerItgrpCode.cellMessage.rowId;
				}
			}
			if (error[i].columns.maker){
				if (error[i].columns.maker.cellMessage){
					rowId_error[i-num] = error[i].columns.maker.cellMessage.rowId;

				}
			}
			if (error[i].columns.allFlagStore){
				if (error[i].columns.allFlagStore.cellMessage){
					rowId_error[i-num] = error[i].columns.allFlagStore.cellMessage.rowId;

				}
			}
			if (error[i].columns.color){
				if (error[i].columns.color.cellMessage){
					rowId_error[i-num] = error[i].columns.color.cellMessage.rowId;

				}
			}
			if (error[i].columns.makerHinban){
				if (error[i].columns.makerHinban.cellMessage){
					rowId_error[i-num] = error[i].columns.makerHinban.cellMessage.rowId;

				}
			}
			if (error[i].columns.outStore){
				if (error[i].columns.outStore.cellMessage){
					rowId_error[i-num] = error[i].columns.outStore.cellMessage.rowId;

				}
			}
			if (error[i].columns.transQy){
				if (error[i].columns.transQy.cellMessage){
					rowId_error[i-num] = error[i].columns.transQy.cellMessage.rowId;

				}
			}
			if (error[i].columns.inStore){
				if (error[i].columns.inStore.cellMessage){
					rowId_error[i-num] = error[i].columns.inStore.cellMessage.rowId;

				}
			}
		}
	}

	var GD = gridData;
	var row_error = [];
	//gridデータから対象セルを探す
	for (var i = 0; i < GD.length; i++) {
		if ($.inArray(GD[i]._cl_gridRowId, rowId_error) != -1) {
			//エラーの行番号を配列に格納
			row_error.push({
				num: GD[i].rowIndex + 1
			});
		}
	}

	return row_error;
};

/**
 * 特定したエラー行を表示する　//2016.06.13 入力エラーの行番号表示機能実装
 * @method showErrorRow
 * @param {array} row_error エラー・警告区分、行のデータ
 * @param {int}
 */
ClGrid.showError = function (row_error) {

	var num_error = 0;
	$('.show-error').empty();

	//エラー行出力
	if (row_error.length > 0) {
		for (var i = 0; i < row_error.length; i++) {
			if (num_error == 0) {
				$('.error-title').text('エラー行：');
			}
			if (num_error < clutil.getclsysparam('PAR_AMCM_FLOATING_ERR_DISP_NUM')) {
				$('.show-error').append('<a class="cl_errWrnRowClick" data-rownum="' + row_error[i].num +'">' + row_error[i].num + '行目<span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></a>');

				$.each($('.show-alert .cl_errWrnRowClick'), function(){
					if ($(this).data('rownum') == row_error[i].num) {
						$(this).remove();
					}
				});
			}
			num_error++;
		}
	}

	//1件以上あれば最後のカンマを削除
	if (num_error != 0) {
//		$('.show-error').html($('.show-error').html().substr(0, $('.show-error').html().length - 1));
		$('.show-error').append(' (全' + num_error + '件)');
	}

	var set_error = $('.show-error .cl_errWrnRowClick').length;
	var set_alert = $('.show-alert .cl_errWrnRowClick').length;

	//1件も追加されなかった場合は初期化
	if (num_error == 0) {
		$('.error-title').text('エラー行：');
		$('.show-error').empty();
		$('.error-count').empty();
	}
	if (set_alert == 0){
		$('.alert-title').text('警告行：');
		$('.show-alert').empty();
		$('.alert-count').empty();
	}

	if (set_error == 0 && set_alert == 0) {
		$('.al1').fadeOut();
		$('#header').css('margin-top', '0px');
		$('.cl_echoback').css('margin-top', '0px');
		return;
	}

	var alH = $('.al1').outerHeight();
	$('#header').css('margin-top', alH);
	$('.cl_echoback').css('margin-top', alH);
	$('.al1').fadeIn();

},

/**
 * 特定したエラー行を表示する　//2016.06.13 入力エラーの行番号表示機能実装
 * @method showErrorRow
 * @param {array} row_alert エラー・警告区分、行のデータ
 * @param {int}
 */
ClGrid.showAlert = function (row_alert) {

	var num_alert = 0;
	$('.show-alert').empty();

	//エラー行出力
	if (row_alert.length > 0) {
		for (var i = 0; i < row_alert.length; i++) {
			if (num_alert == 0) {
				$('.alert-title').text('警告行：');
			}
			if (num_alert < clutil.getclsysparam('PAR_AMCM_FLOATING_ERR_DISP_NUM')) {
				$('.show-alert').append('<a class="cl_errWrnRowClick" data-rownum="' + row_alert[i].num +'">' + row_alert[i].num + '行目 <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></a>');

				$.each($('.show-error .cl_errWrnRowClick'), function(){
					if ($(this).data('rownum') == row_alert[i].num) {
						$(this).remove();
					}
				});
			}
			num_alert++;
		}
	}

	//1件以上あれば最後のカンマを削除、総件数を表示
	if (num_alert !=0) {
//		$('.show-alert').html($('.show-alert').html().substr(0, $('.show-alert').html().length - 1));
		$('.show-alert').append(' (全' + num_alert + '件)');
	}

	var set_error = $('.show-error .cl_errWrnRowClick').length;
	var set_alert = $('.show-alert .cl_errWrnRowClick').length;

	//1件も追加されなかった場合は初期化
	if (num_alert == 0){
		$('.alert-title').text('警告行：');
		$('.show-alert').empty();
		$('.alert-count').empty();
	}
	if (set_error == 0) {
		$('.error-title').text('エラー行：');
		$('.show-error').empty();
		$('.error-count').empty();
	}

	if (set_error == 0 && set_alert == 0) {
		$('.al1').fadeOut();
		$('#header').css('margin-top', '0px');
		$('.cl_echoback').css('margin-top', '0px');
		return;
	}

	var alH = $('.al1').outerHeight();
	$('#header').css('margin-top', alH);
	$('.cl_echoback').css('margin-top', alH);

	$('.al1').fadeIn();

},

/**
 * 特定したエラー行を表示する　//2016.06.13 入力エラーの行番号表示機能実装
 * @method showErrorRow
 * @param {array} row_error エラー・警告区分、行のデータ
 * @param {int}
 */
ClGrid.showError2 = function (row_error) {

	var num_error = 0;
	$('.alert').remove()

	if (!row_error) {
		$('.alert').fadeOut();
		$('#header').css('margin-top', '0px');
		$('.cl_echoback').css('margin-top', '0px');
	}

	var num_AlWrnWrap = 1;
	var tmpl_AlWrn = $('.AlWrntemplate').prop('outerHTML');
	$.each(row_error, function(){

		var alH = 0 ;
		$('.alert').each(function(){
			alH = alH + $(this).outerHeight();
		});

		$('#container').before(tmpl_AlWrn.replace(/AlWrntemplate/g,'alert alert-danger al' + num_AlWrnWrap));
		var grid = this.grid;

		$('.al' + num_AlWrnWrap + ' .error-row').before('<div class="item-Code">'+ row_error[num_AlWrnWrap-1].maker + ' ' + row_error[num_AlWrnWrap-1].itemCode + ' ' + row_error[num_AlWrnWrap-1].color + '</div>');

		var num_error = 0;

		for (i = 0; i < grid.length; i++) {

			if (num_error == 0) {
				$('.al' + num_AlWrnWrap + ' .error-title').text('エラー行：');
//				$('.al' + num_AlWrnWrap + ' .alert-title').text('警告行：');
			}
			if (num_error < clutil.getclsysparam('PAR_AMCM_FLOATING_ERR_DISP_NUM')) {
				$('.al' + num_AlWrnWrap + ' .show-error').append('<a class="cl_errWrnRowClick" data-rownum="' + grid[i].num +'" data-grid="' + num_AlWrnWrap + '">' + this.grid[i].num + '行目 <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></a>');
			}

			num_error++;

		}
		if (num_AlWrnWrap > 1){
			$('.al' + num_AlWrnWrap).css('margin-top', alH);
		}

		if (num_error !=0) {
			$('.al' + num_AlWrnWrap + ' .show-error').append(' (全' + num_error + '件)');
		}

		num_AlWrnWrap++;
	});

	var alH = 0 ;
	$('.alert').each(function(){
		alH = alH + $(this).outerHeight();
	});

	$('#header').css('margin-top', alH);
	$('.cl_echoback').css('margin-top', alH);

	$('.alert').fadeIn();
},

/**
 * メタデータをマージする
 * @method mergeMetadata
 * @param {object} dst メタデータ
 * @param {object} src メタデータ
 * @return {object} メタデータ
 */
ClGrid.mergeMetadata = function(dst, src/*, replaceCssClasses */){
	if (!src) return dst;

	_.extend(dst, _.omit(src, 'columns', 'cssClasses'));
	if (_.has(src, 'cssClasses')) {
		if (dst.cssClasses/* && !replaceCssClasses*/) {
			dst.cssClasses += ' ' + src.cssClasses;
		} else {
			dst.cssClasses = src.cssClasses;
		}
	}

	if (!dst.columns)
		dst.columns = {};

	_.each(src.columns, function(column2, id){
		var column1 = dst.columns[id];
		if (column1) {
			_.extend(column1, column2);
		} else {
			dst.columns[id] = _.extend({}, column2);
		}
	});

	return dst;
};

/**
 * カラムから必須判定種別を返す
 * @method getRequiredTypeByColumn
 * @param column
 * @return {string} 必須判定種別
 */
ClGrid.getRequiredTypeByColumn = function(column){
	var CellTypeStorage = ClGrid.CellTypeStorage;
	var EditorTypes = ClGrid.EditorTypes;

	var cellTypeOptions = column.cellType;
	if (!cellTypeOptions) return;
	var editorType = CellTypeStorage.getEditorType(cellTypeOptions);
	var requiredType;
	if (editorType === EditorTypes.clajaxac) {
		requiredType = 'ac';
	} else if (editorType === EditorTypes.date) {
		requiredType = 'date';
	} else if (editorType === EditorTypes.clajaxselector ||
			   editorType === EditorTypes.asynccodenameselector ||
			   editorType === EditorTypes.asyncselector ||
			   editorType === EditorTypes.codenameselector ||
			   editorType === EditorTypes.selector) {
		requiredType = 'id';
	} else if (editorType === EditorTypes.cltypeselector ||
			   cellTypeOptions.type === 'checkbox') {
		requiredType = 'select';
	}
	return requiredType;
};

/**
 * getEmptyCheckFuncで使用する空値判定関数。空値判定はカラムのcellType
 * で判断するが、この実装が約にたたない場合はアプリで上書きする。
 *
 * @method checkEmptyValueByColumn
 * @param item  行データ
 * @param column カラム
 * @param {object} options
 * @return {boolean} 空かどうか
 */
ClGrid.checkEmptyValueByColumn = function(item, column){
	var requiredType = ClGrid.getRequiredTypeByColumn(column);
	var value = item[column.field];
	var isEmpty = clutil.Validators.required(value, requiredType);
	if (requiredType === 'ac' && isEmpty && value && value.name){
		// オートコンプリートの場合は空判定の場合でも空でない場合がある
		isEmpty = false;
	}
	return isEmpty;
};

/**
 * 空レコード判定関数を返す。ClAppGridView#isValidやgetDataで使用するた
 * めの補助関数。ClAppGridView#isValidの tailEmptyCheckFunc や getData
 * の filterFunc 等での空レコードチェックに使用することを想定。
 *
 * 空値判定には ClGrid.checkEmptyValueByColumn を使っている。空値判定を
 * 変更するにはこれを上書きする。
 *
 * @method getEmptyCheckFunc
 * @param {ClAppGridView} dataGrid
 * @param [options]
 * @param {function} [options.columnFilter]
 * @return {function} 空レコード判定関数
 *
 * @example
 * isValidで使用する
 * ```js
 * var emptyCheckFunc = ClGrid.getEmptyCheckFunc(this.datqGrid);
 * var isValid = this.dataGrid.isValid({
 *   tailEmptyCheckFunc: emptyCheckFunc
 * });
 * if (isValid) {
 *   ...
 * }
 * ```
 * @example
 * getDataで使用する
 * ```js
 * var emptyCheckFunc = ClGrid.getEmptyCheckFunc(this.datqGrid);
 * var data = this.dataGrid.getData({
 *   filterFunc: emptyCheckFunc
 * });
 * ```
 */
ClGrid.getEmptyCheckFunc = function(dataGrid, options){
	options || (options = {});
	_.defaults(options, {
		columnFilter: function(column, item){
			var row = dataGrid.dataView.getRowById(item[dataGrid.idProperty]);
			var isEditable = dataGrid.editorFactory.isEditable(column, row, dataGrid.dataView);
			return isEditable;
		}
	});
	var columnFilter = options.columnFilter || _.identity;

	return function(item){
		var isEmpty = _.all(dataGrid.grid.getColumns(), function(column){
			if (columnFilter(column, item) === false){
				return true;
			}
			var isEmpty = ClGrid.checkEmptyValueByColumn(item, column, options);
			return isEmpty;
		});
		return isEmpty;
	};
};

/**
 * text-ellipsisによって省略されているかチェックする
 * @method isEllipsisActive
 * @param {HTMLElement} el
 * @return {boolean} trueの場合省略されている
 */
ClGrid.isEllipsisActive = function(el) {
	return (el.offsetWidth < el.scrollWidth);
};

/**
 * @class ImgScaler
 * @namespace ClGrid
 * @static
 */
ClGrid.ImgScaler = {
	/**
	 * .slick-cell img.img-rounded.magnify な画像をマウスオーバーで拡大する。
	 *
	 * @method start
	 * @for ImgScaler
	 * @static
	 * @param [options]
	 * @param [options.duration=500]
	 * @param [options.maxWidth=200]
	 *
	 * @example
	 * ```js
	 * // 拡大開始
	 * ClGrid.ImgScaler.start();
	 * // 拡大停止
	 * ClGrid.ImgScaler.stop();
	 * ```
	 */
	start: function(options){
		options = _.defaults({}, options, {
			duration: 500,
			maxWidth: 200,
			target: 'img.magnify',
			wrapper: '.slick-cell'
		});

		_.defaults(options, {
			hoverTarget: options.wrapper + ' ' + options.target
		});

		var container, cell, img, origWidth, win = $(window);

		var removeContainer = function(){
			if(container){
				(function(c){
					img.stop().animate({
						width: origWidth || 40
					}, options.duration, null, function(){
						c.remove();
					});
					win.off('scroll', removeContainer);
					clutil.mediator.off('grid:scroll', fixContainer);
				}(container));
			}
			container = img = cell = null;
		};
		var fixContainer = function(){
			if(container){
				var scrollTop = win.scrollTop(),
					scrollLeft = win.scrollLeft(),
					offset = cell.offset(),
					top = offset.top - scrollTop,
					css = {
						top: top,
						left: offset.left - scrollLeft,
						width: cell.width(),
						height: cell.height(),
						zIndex: 99999
					};
				container.css(css);
			}
		};

		var magnify = function(){
			var cellImg = cell.find(options.target);
			var cellImgOffset = cellImg.offset();
			var cellOffset = cell.offset();

			var left = cellImgOffset.left - cellOffset.left;
			var bottom = container.height() - (cellImgOffset.top - cellOffset.top + cellImg.height());

			// save
			origWidth = cellImg.width();

			img.css({
				'position': 'absolute',
				bottom: bottom,
				left: left,
				width: origWidth,
				height: 'initial',
				maxHeight: 'initial',
				maxWidth: 'initial'
			});
			img.stop().animate({
				position: 'absolute',
				width: options.maxWidth
			}, options.duration);
		};

		$(document)
			.off('.gridImgMagnify')
			.on('mouseover.gridImgMagnify', options.hoverTarget, function(e){
				var $target = $(e.target);
				removeContainer(container);

				container = $('<div>').css('position', 'fixed').appendTo('body');
				img = $target.clone().appendTo(container);
				cell = $target.closest(options.wrapper);

				fixContainer();
				magnify();


				win.on('scroll', fixContainer);
				clutil.mediator.on('grid:scroll', fixContainer);

				img.on('mouseout', removeContainer);
				_.delay(function(){
					if(img && !img.is(':hover')){
						removeContainer();
					}
				}, 200);
			});
	},

	stop: function(){
		$(document)
			.off('.gridImgMagnify');
	}
};


/**
 * @module ClGrid
 * 
 */
(function(ClGrid){
	var SlickDataView = Slick.Data.DataView;

	/**
	 * ClGrid.DataViewの内部でのみ使用
	 * @private
	 */
	var DataViewSetter = function(dataView, eventName){
		this.dataView = dataView;
		this.eventName = eventName;
		_.bindAll(this, 'onRowCountChanged', 'onPagingInfoChanged', 'onRowsChanged');
	};

	_.extend(DataViewSetter.prototype, Backbone.Events, {
		invalidProperty: function(){
			this.rowCountChanged = false;
			this.rowsChanged = false;
			this.pagingInfoChanged = false;
		},

		bindEvents: function(){
			this.dataView.onRowCountChanged.subscribe(this.onRowCountChanged);
			this.dataView.onRowsChanged.subscribe(this.onRowsChanged);
			this.dataView.onPagingInfoChanged.subscribe(this.onPagingInfoChanged);
		},

		unbindEvents: function(){
			this.dataView.onRowCountChanged.unsubscribe(this.onRowCountChanged);
			this.dataView.onRowsChanged.unsubscribe(this.onRowsChanged);
			this.dataView.onPagingInfoChanged.unsubscribe(this.onPagingInfoChanged);
		},

		onRowCountChanged: function(e, args){
			// jshint unused: false
			this.rowCountChanged = args;
		},

		onRowsChanged: function(e, args){
			// jshint unused: false
			this.rowsChanged = args;
		},

		onPagingInfoChanged: function(e, args){
			// jshint unused: false
			this.pagingInfoChanged = args;
		}
	});

	var accessMethods = ["insertItem", "addItem", "setItems", "deleteItem",
						 "updateItem", "refresh", 'endUpdate', "setFilter"];
	_.each(accessMethods, function(method){
		DataViewSetter.prototype[method] = function(){
			this.invalidProperty();
			this.bindEvents();
			var args = _.toArray(arguments);
			var ret = this.dataView[method].apply(this, args);
			this.unbindEvents();
			if (this.eventName){
				this.trigger(this.eventName,
							 method,
							 this.rowCountChanged,
							 this.rowsChanged,
							 this.pagingInfoChanged);
			}
			return ret;
		};
	});

	/**
	 * # ヘッダ部とボディ部を持つデータビュー
	 *
	 * ### 操作の開始、終了
	 * #### beginUpdate()
	 * #### endUpdate()
	 * ### ヘッダ部への操作
	 * #### getHeadLength()
	 * #### setHeadItems(items)
	 * #### insertHeadItem(insertBefore, item)
	 * #### addHeadItem(item)
	 * #### deleteHeadItem(id)
	 * ### ボディ部への操作
	 * #### getBodyLength()
	 * #### setItems(items)
	 * #### insertItem(insertBefore, item)
	 * #### addItem(item)
	 * #### deleteItem(id)
	 * #### その他のボディに対する操作
	 *
	 * - getIdxById
	 * - getRowById
	 * - getItemById
	 * - getItemByIdx
	 * - mapRowsToIds
	 * - mapIdsToRwos
	 *
	 * ### dataProviderインターフェイス
	 * ヘッダ部、ボディ部を合わせた行に関するメソッド
	 * #### getItem(index)
	 * #### getLength()
	 * #### getItemMetadata(index)
	 *
	 * ### イベント
	 * ```js
	 * // Backbone.Eventsをmixinしています
	 * dataView.on("row:count:changed", function(args){
	 *    ...
	 * });
	 * ```
	 * #### "row:count:changed" (args)
	 * - args.previous
	 * 変更前の行数
	 * - args.current
	 * 変更後の行数
	 *
	 * #### "rows:changed" (args)
	 *
	 * - args.rows 変更された行のインデックスの配列
	 *
	 * # row と idx(index)
	 *
	 * rowは今グリッド内に見えているものをカウントする。すなわちフィルタリング
	 * やページングの有無で変わる。
	 *
	 * idxはグリッドにsetDataでセットしたデータのインデックス。フィルタ
	 * リング、ページングによらずに一定。
	 *
	 * フィルタリング
	 * @class ClGrid.DataView
	 * @constructor
	 * @param {object} [options]
	 * @param {String} [options.idProperty=id] 行データのidプロパティ名を指定する
	 */
	var DataView = function(options){
		options = (options || {});

		// optionsをオブジェクトのプロパティに設定する
		_.extend(this, _.pick(options, "idProperty"));

		/* jshint unused: false */
		this.headDataView = new SlickDataView();
		this.bodyDataView = new SlickDataView();
		// idPropertyをdataViewに伝えるためにsetItemsを実行する
		this.headDataView.setItems([], this.idProperty);
		this.bodyDataView.setItems([], this.idProperty);
		this.headSetter = new DataViewSetter(this.headDataView,
											 "after:headdataview:set");
		this.bodySetter = new DataViewSetter(this.bodyDataView,
											 'after:bodydataview:set');
		// ヘッダ部のid => metadataなマップ
		this.headItemMetadata = {};
		// ボディ部のid => metadataなマップ
		this.bodyItemMetadata = {};
		this.listenTo(this.headSetter, {
			'after:headdataview:set': function(method, countChanged,
											   rowsChanged, paging){
				if (this.refreshing) return;
				this._onRefresh(countChanged, false, rowsChanged, false);
			}
		});
		this.listenTo(this.bodySetter, {
			'after:bodydataview:set': function(method, countChanged,
											   rowsChanged, paging){
				if (this.refreshing) return;
				this._onRefresh(false, countChanged, false, rowsChanged);
			}
		});
	};

	DataView.extend = Backbone.Model.extend;

	_.extend(DataView.prototype, Backbone.Events, {
		/**
		 * 行データのIDプロパティ名
		 *
		 * @property idProperty
		 * @type String
		 * @default "id"
		 */
		idProperty: "id",

		/**
		 * 指定行がボディ部に属すかの判定を行う
		 *
		 * @method isHeadRow
		 * @param {integer} row 全体行インデックス
		 * @return {boolean}
		 */
		isHeadRow: function(row){
			return row < this.getHeadLength() && row >= 0;
		},

		/**
		 * 指定行がボディ部に属すかの判定を行う
		 *
		 * @method isBodyRow
		 * @param {integer} row 全体行インデックス
		 * @return {boolean}
		 */
		isBodyRow: function(row){
			return this.getHeadLength() <= row && row < this.getLength();
		},

		/**
		 * ボディ部行インデックスを全体のインデックスに変換する
		 * @method bodyIndexToIndex
		 * @param {integer} bodyIndex ボディ部行インデックス
		 * @return {integer} 全体行インデックス
		 */
		bodyIndexToIndex: function(bodyIndex) {
			return bodyIndex + this.getHeadLength();
		},

		/**
		 * ヘッダ部行インデックスを全体のインデックスに変換する
		 * @method headIndexToIndex
		 * @param {integer} headIndex ヘッダ部行インデックス
		 * @return {integer} 全体行インデックス
		 */
		headIndexToIndex: function(headIndex) {
			return headIndex;
		},

		/**
		 * インデックスをヘッダ部もしくはボディ部の行インデックスに変換する
		 * @method indexToLocal
		 * @param {integer} row 行インデックス(全体)
		 * @return {integer} 局所行インデックス
		 */
		indexToLocal: function(row) {
			if (this.isBodyRow(row)) {
				return row - this.getHeadLength();
			} else {
				return row;
			}
		},
		
		/**
		 * 行ID値に対するインデックス（全体のインデックス）を返す。
		 * ただし、head部-body部に跨って、rowId が重複する場合は最初に出現するインデックスを返す。
		 */
		getIdxById: function(rowId){
			// header 部検査
			var idx = this.headDataView.getIdxById(rowId);

			// body 部検査
			if(idx === undefined){
				idx = this.bodyDataView.getIdxById(rowId);
				if(idx !== undefined){
					idx += this.getHeadLength();
				}
			}

			return idx;
		},

		/*
		 * @method beginUpdate
		 */
		beginUpdate: function(){
			this.suspend = true;
			this.headDataView.beginUpdate();
			this.bodyDataView.beginUpdate();
		},

		/**
		 * @method endUpdate
		 */
		endUpdate: function(){
			this.suspend = false;
			this.refreshing = true;
			this.headSetter.endUpdate();
			this.bodySetter.endUpdate();
			this._onRefresh(this.headSetter.rowCountChanged,
							this.bodySetter.rowCountChanged,
							this.headSetter.rowsChanged,
							this.bodySetter.rowsChanged);
			this.refreshing = false;
		},

		/**
		 * @method refresh
		 */
		refresh: function(){
			if (this.suspend) return;

			this.refreshing = true;
			this.headSetter.refresh();
			this.bodySetter.refresh();
			this._onRefresh(this.headSetter.rowCountChanged,
							this.bodySetter.rowCountChanged,
							this.headSetter.rowsChanged,
							this.bodySetter.rowsChanged);
			this.refreshing = false;
		},

		_onRefresh: function(headRowCountChanged, bodyRowCountChanged,
							 headRowsChanged, bodyRowsChanged){
			var i, tmp, rows = [];
			var headLen = this.headDataView.getLength();

			// 1. 行数の変更の計算してイベントの発行
			if (headRowCountChanged || bodyRowCountChanged){
				var current = this.getLength();
				var previous = current;
				tmp = headRowCountChanged;
				if (tmp){
					previous = previous - tmp.current + tmp.previous;
				}
				tmp = bodyRowCountChanged;
				if (tmp){
					previous = previous - tmp.current + tmp.previous;
				}
				this.trigger("row:count:changed", {
					preivous: previous,
					current: current
				});
			}

			// 2. 行の変更の計算してイベントの発行
			if (headRowsChanged){
				rows = rows.concat(headRowsChanged.rows);
			}
			if (bodyRowsChanged){
				tmp = bodyRowsChanged.rows;
				for (i=0;i< tmp.length; i++){
					rows.push(tmp[i] + headLen);
				}
			}
			if (headRowCountChanged){
				for (i=0;i<this.bodyDataView.getLength(); i++){
					rows.push(i + headLen);
				}
			}

			if (rows.length > 0){
				// sort and unique rows
				rows.sort(function(a, b){return a-b;});
				rows = _.uniq(rows, true);
				this.trigger("rows:changed", {rows: rows});
			}
		},

		// ここからヘッダ部操作

		/**
		 * ヘッダ部の行データ配列を設定する。
		 *
		 * @method setHeadItems
		 * @param {Array} items - 行データ配列
		 */
		setHeadItems: function(items){
			return this.headSetter.setItems(items, this.idProperty);
		},

		/**
		 * ヘッダ部の行データ配列を設定する。
		 * @param {Integer} insertBefore インデックス
		 * @param {Object} item 行データ
		 */
		insertHeadItem: function(insertBefore, item){
			return this.headSetter.insertItem(insertBefore, item);
		},

		/**
		 * ヘッダ部の行データ配列を設定する。
		 * @param {Object} item 行データ
		 */
		addHeadItem: function(item){
			return this.headSetter.addItem(item);
		},

		/**
		 * ヘッダ部の行データ配列を設定する。
		 */
		deleteHeadItem: function(id){
			return this.headSetter.deleteItem(id);
		},

		/**
		 * ヘッダ部のデータを取得する。
		 *
		 * @method getHeadItems
		 */
		
		/**
		 * ヘッダ部のデータ長を取得する。
		 *
		 * @method getHeadLength
		 */
		getHeadLength: function(){
			return this.headDataView.getLength();
		},


		/**
		 * ボディ部のデータ長を取得する
		 * @method getBodyLength
		 */
		getBodyLength: function(){
			return this.bodyDataView.getLength();
		},

		// ここからdataProvider interface
		/**
		 * indexがヘッダ行数以下の場合はヘッダデータビューのitemを返す。
		 * そうでなければボディデータビューのitemを返す。
		 *
		 * @method getItem
		 * @param {Integer} index
		 */
		getItem: function(index){
			var headLength = this.getHeadLength();
			if (index < headLength){
				return this.headDataView.getItem(index);
			} else if (index<this.getLength()){
				return this.bodyDataView.getItem(index - headLength);
			}
		},

		/**
		 * ヘッダ部とデータ部の行数の合計を返す
		 * @method getLength
		 * @return {Integer} 合計行
		 */
		getLength: function(){
			return this.getHeadLength() + this.getBodyLength();
		},

		/**
		 * ヘッダ部アイテムメタデータ取得メソッド
		 * 必要に応じてoverrideすること
		 * @method getHeadItemMetadata
		 * @param index ヘッダ部行インデックス
		 * @return {アイテムメタデータ}
		 */
		getHeadItemMetadata: function(){},

		/**
		 * ボディ部アイテムメタデータ取得メソッド
		 * 必要に応じてoverrideすること
		 *
		 * @method getBodyItemMetadata
		 * @param index ボディ部行インデックス
		 * @return {アイテムメタデータ}
		 */
		getBodyItemMetadata: function(){},

		/**
		 * indexがヘッダ行数以下の場合はthis.getHeadItemMetadata()を
		 * そうでなければthis.getBodyItemMetadata()を返す。
		 *
		 * @method getItemMetadata
		 * @param {Integer} index 行インデックス
		 */
		getItemMetadata: function(index){
			var headLength = this.getHeadLength();
			if (index < headLength){
				return this.getHeadItemMetadata(index);
			} else if (index<this.getLength()) {
				return this.getBodyItemMetadata(index - headLength);
			}
		},

		// ここからヘッダ
		/**
		 * ヘッダ部のrowからヘッダ部のitemを取得する
		 *
		 * @method getHeadItem
		 * @param {integer} {row} ヘッダ部のrow
		 * @return {object} 行データ
		 */

		/**
		 * ヘッダ部に関するメソッド
		 * @method getHeadIdxById
		 */

		/**
		 * ヘッダ部に関するメソッド
		 * @method getHeadRowById
		 */

		/**
		 * ヘッダ部に関するメソッド
		 * @method getHeadIdxById
		 */

		/**
		 * ヘッダ部に関するメソッド
		 * @method getHeadRowById
		 */

		/**
		 * ヘッダ部に関するメソッド
		 * @method getHeadItemById
		 */

		/**
		 * ヘッダ部に関するメソッド
		 * @method getHeadItemByIdx
		 */

		/**
		 * ヘッダ部に関するメソッド
		 * @method headMapRowsToIds
		 */

		/**
		 * ヘッダ部に関するメソッド
		 * @method headMapIdsToRows
		 */
		
		// ここまでヘッダ
		
		// ここからボディ
		/**
		 * ボディ部にitemsを設定する
		 * @method setBodyItems
		 * @param {Array} items 行データ配列
		 */
		setBodyItems: function(items){
			return this.bodySetter.setItems(items, this.idProperty);
		},

		/**
		 * ボディ部にitemを挿入する
		 * @method insertBodyItem
		 * @param {Integer} insertBefore インデックス
		 * @param {Object} item 行データ
		 */

		/**
		 * ボディ部の最後にitemを追加する
		 * @method addBodyItem
		 * @param {Object} item 行データ
		 */

		/**
		 * ボディ部から行を追加する
		 * @method deleteBodyItem
		 * @param {Integer} id itemのID
		 */

		/**
		 * ボディ部のrowからボディ部のitemを取得する
		 *
		 * @method getBodyItem
		 * @param {integer} {row} ボディ部のrow
		 * @return {object} 行データ
		 */
		
		/**
		 * ボディ部のitemsを取得する
		 *
		 * @method getBodyItems
		 */

		/**
		 * ボディ部に関するメソッド
		 * @method getBodyIdxById
		 */

		/**
		 * ボディ部に関するメソッド
		 * @method getBodyRowById
		 */

		/**
		 * ボディ部に関するメソッド
		 * @method getBodyIdxById
		 */

		/**
		 * ボディ部に関するメソッド
		 * @method getBodyRowById
		 */

		/**
		 * ボディ部に関するメソッド
		 * @method getBodyItemById
		 */

		/**
		 * ボディ部に関するメソッド
		 * @method getBodyItemByIdx
		 */

		/**
		 * ボディ部に関するメソッド
		 * @method bodyMapRowsToIds
		 */

		/**
		 * ボディ部に関するメソッド
		 * @method bodyMapIdsToRows
		 */

		// ヘッドとボディ
		/**
		 * @method updateItem
		 * @param id
		 * @param item
		 */
		updateItem: function(id, item){
			if (arguments.length == 1 && _.isObject(id)){
				item = id;
				id = item[this.idProperty];
			}

			if (this.bodyDataView.getItemById(id)){
				this.bodySetter.updateItem(id, item);
			} else {
				this.headSetter.updateItem(id, item);
			}
		},

		/**
		 * idから全体に対する行インデックスを返却する
		 * @method getRowById
		 * @param id
		 * @return 行インデックス
		 */
		getRowById: function(id){
			var row = this.bodyDataView.getRowById(id);
			if (row !== undefined){
				return row  + this.getHeadLength();
			} else {
				return this.headDataView.getRowById(id);
			}
		},

		/**
		 * idから行データを返却する
		 * @method getItemById
		 * @param id
		 * @return 行データ
		 */
		getItemById: function(id){
			var item = this.getBodyItemById(id);
			if (!item) {
				item = this.getHeadItemById(id);
			}
			return item;
		},
		
		/**
		 * DataViewが持つリソースの開放を行う
		 *
		 * @method destroy
		 */
		destroy: function(){
			this.stopListening();
			delete this.headDataView;
			delete this.bodyDataView;
			delete this.headSetter;
			delete this.bodySetter;
		}
	});

	// ボディ部のセッターメソッド
	// 内部でrefresh()を呼ぶものはこちらに書く
	var bodySetters = {
        updateBodyItem: "updateItem",
        insertBodyItem: "insertItem",
        addBodyItem: "addItem",
        deleteBodyItem: "deleteItem",
        setBodyFilter: 'setFilter'
	};
	_.each(bodySetters, function(bodyMethod, method){
		DataView.prototype[method] = function(){
			var args = _.toArray(arguments);
			return this.bodySetter[bodyMethod].apply(this.bodySetter, args);
		};
	});

	// 以下のメソッドはヘッダ部にのみ適用される
	var headMethods = {
		getHeadItem: 'getItem',
        getHeadItems: 'getItems',
        getHeadIdxById: 'getIdxById',
        getHeadRowById: 'getRowById',
        getHeadItemById: 'getItemById',
        getHeadItemByIdx: 'getItemByIdx',
        headMapRowsToIds: 'mapRowsToIds',
        headMapIdsToRows: 'mapIdsToRows',
        setHeadFilterArgs: "setFilterArgs"
		// 以下は未サポートとする
        // "setPagingOptions",
        // "getPagingInfo",
        // "sort",
        // "fastSort",
        // "reSort",
        // "setGrouping",
        // "getGrouping",
        // "groupBy",
        // "setAggregators",
        // "collapseAllGroups",
        // "expandAllGroups",
        // "collapseGroup",
        // "expandGroup",
        // "getGroups",
        // "setRefreshHints",
        // "syncGridSelection",
        // "syncGridCellCssStyles"
	};
	_.each(headMethods, function(headMethod, method){
		DataView.prototype[method] = function(){
			var args = _.toArray(arguments);
			return this.headDataView[headMethod].apply(this.headDataView, args);
		};
	});

	// 以下のメソッドはボディ部にのみ適用される
	var bodyMethods = {
		getBodyItem: 'getItem',
        getBodyItems: 'getItems',
        getBodyIdxById: 'getIdxById',
        getBodyRowById: 'getRowById',
        getBodyItemById: 'getItemById',
        getBodyItemByIdx: 'getItemByIdx',
        bodyMapRowsToIds: 'mapRowsToIds',
        bodyMapIdsToRows: 'mapIdsToRows',
        setBodyFilterArgs: "setFilterArgs"
		// 以下は未サポートとする
        // "setPagingOptions",
        // "getPagingInfo",
        // "sort",
        // "fastSort",
        // "reSort",
        // "setGrouping",
        // "getGrouping",
        // "groupBy",
        // "setAggregators",
        // "collapseAllGroups",
        // "expandAllGroups",
        // "collapseGroup",
        // "expandGroup",
        // "getGroups",
        // "setRefreshHints",
        // "syncGridSelection",
        // "syncGridCellCssStyles"
	};
	_.each(bodyMethods, function(bodyMethod, method){
		DataView.prototype[method] = function(){
			var args = _.toArray(arguments);
			return this.bodyDataView[bodyMethod].apply(this.bodyDataView, args);
		};
	});
	
	// exports
	ClGrid.DataView = DataView;
}(ClGrid));

/**
 * @module ClGrid
 * 
 */
(function(ClGrid){
	var CellType = function(options){
		_.extend(this, options);
	};

	_.extend(CellType.prototype, {
		defaultsEditorOptions: function(cellTypeOptions, editorOptions){
			(function(){
				// placeholderの設定
				
				var inputAttributes;
				if (cellTypeOptions.placeholder) {
					inputAttributes = editorOptions.inputAttrubtes || {};
					_.defaults(inputAttributes, {
						placeholder: cellTypeOptions.placeholder
					});
					editorOptions.inputAttributes = inputAttributes;
				}
			}());
			return editorOptions;
		}
	});
	
	/**
	 * エディタタイプ(コンストラクタ)、フォーマッタ(関数)[, バリデータ]の
	 * 組のストレージ
	 * 
	 * @class ClGrid.CellTypeStorage
	 * @static
	 */
	ClGrid.CellTypeStorage = {
		/**
		 * @property cellTypeClass
		 * @type Object
		 * @default CellType
		 */
		cellTypeClass: CellType,
		
		cellTypes: {},
		/**
		 * セルタイプの登録
		 * 
		 * @method addCellType
		 * @param {Object} def
		 * @param {String} def.type セルタイプ名
		 * @param {constructor} def.editorType エディタタイプ
		 * @param {function} def.formmater フォーマッタ
		 */
		addCellType: function(def){
			this.cellTypes[def.type] = new this.cellTypeClass(def);
			return this;
		},
		/**
		 * セルタイプの取得
		 * 
		 * @method getCellType
		 * @param {String} type セルタイプ名
		 */
		getCellType: function(type){
			var cellType = this.cellTypes[type];
			if (!cellType && type){
				console.warn('セルタイプの指定が不正です', type);
			}
			return cellType;
		},

		/**
		 * エディタオプションの取得
		 * @param {String} type - セルタイプ名
		 * @param {Object} cellTypeOptions セルタイプオプション
		 * @param {Object} args
		 * @param {SlickGrid} args.grid
		 * @param {SlickGrid Column} args.column
		 * @param {Object} args.item 行データ
		 * @return {Object}
		 */
		getEditorOptions: function(cellTypeOptions, args){
			var cellType, editorOptions;

			cellTypeOptions || (cellTypeOptions = {});
			
			cellType = this.getCellType(cellTypeOptions.type);

			if (!cellType) return {};

			editorOptions = cellTypeOptions.editorOptions;
			
			// defaultsEditorOptionsの呼び出し前にeditorOptionsをオブジェ
			// クトに変換する
			if (_.isFunction(editorOptions)){
				editorOptions = editorOptions(
					args.item, args.grid.getData(), args.grid);
			}
			// cellTypeがdefaultsEditorOptionsを持つ場合は
			// editorOptionsのデフォルト値を設定してもらう
			if (_.isFunction(cellType.defaultsEditorOptions)){
				editorOptions = cellType.defaultsEditorOptions(
					cellTypeOptions, editorOptions || {}, cellType, args.column);
			}
			// 呼出もとではオブジェクトに返されることを保証する
			return editorOptions || {};
		},
		
		/**
		 * グリッドオプションのカラムオプションのセルタイプオプションを
		 * 取得する。
		 * 
		 * @method getColumnCellTypeOption
		 * @param column
		 * @param row
		 * @param dataView
		 * @return {カラムオプションのセルタイプオプション}
		 */
		getColumnCellTypeOption: function(column, row, dataView){
			var cellType;
			if (dataView.isHeadRow(row)) {
				cellType = column.headCellType;
			} else {
				cellType = column.cellType;
			}
			// ヘッダ部の行位置によってcellTypeを変化させることが考えら
			// れるためcellTypeは関数でもOK!
			if (_.isFunction(cellType)){
				cellType = cellType({
					column: column,
					row: row,
					dataView: dataView
				});
			}
			return cellType;
		},
		
		/**
		 * エディタタイプの取得
		 * 
		 * @method getEditorType
		 * @param {Object} args
		 * @param {String} args.type セルタイプ名
		 * @param {String|Function} [args.editorType] エディタタイプ
		 * @return {Function} エディタタイプ
		 */
		getEditorType: function(args){
			if (!args) return;
			var cellType = this.getCellType(args.type) || {};
			if (_.isEmpty(cellType) && args.type){
				return;
			}
			var editorTypeName = args.editorType || cellType.editorType;
			var editorType = editorTypeName;
			// エディタが不要な場合
			if (!editorType) return;

			if (_.isString(editorType)){
				editorType = ClGrid.EditorTypes[editorType];
			}
			if (!editorType){
				console.warn('エディタタイプの指定が不正です', editorTypeName);
				return;
			}

			return editorType;
		},

		/**
		 * フォーマッタの取得
		 * 
		 * @method getFormatter
		 * @param {Object} args
		 * @param {String} args.type セルタイプ名
		 * @param {String|Function} [args.formatter] フォーマッタ
		 * @return {Function} フォーマッタ
		 */
		getFormatter: function(args){
			if (!args) return;
			var cellType = this.getCellType(args.type) || {};
			if (_.isEmpty(cellType) && args.type){
				return;
			}
			var formatterName = args.formatter || cellType.formatter;
			var formatter = formatterName;
			// フォーマッタが不要!
			if (!formatter) return;
			
			if (_.isString(formatter)){
				formatter = ClGrid.Formatters[formatter];
			}
			if (!formatter){
				console.warn('フォーマッタの指定が不正です', formatterName);
			}
			return formatter;
		},

		/**
		 * decoratorの取得
		 * 
		 * @method getDecorator
		 * @param {Object} args
		 * @param {String} args.type セルタイプ名
		 * @param {String|Function} [args.decorator] デコレータ
		 * @return {Function} デコレータ
		 */
		getDecorator: function(args){
			if (!args) return;
			var cellType = this.getCellType(args.type) || {};
			if (_.isEmpty(cellType) && args.type){
				return;
			}
			var decoratorName = args.decorator || cellType.decorator;
			var decorator = decoratorName;
			// decoratorが不要!
			if (!decorator) return;
			
			if (_.isString(decorator)){
				decorator = ClGrid.Formatters[decorator];
			}
			if (!decorator){
				console.warn('フォーマッタの指定が不正です', decoratorName);
			}
			return decorator;
		}
	};
}(ClGrid));

/**
 * @module ClGrid
 * 
 */
(function(ClGrid, CellTypeStorage){
	/**
	 * SlickGridに与えるわれわれのエディタファクトリー
	 * @class ClGrid.EditorFactory
	 * @constructor
	 */
	var EditorFactory = function(){};

	_.extend(EditorFactory.prototype, {
		/**
		 * エディット可能かチェックする
		 * @method isEditable
		 * @param column
		 * @param row
		 * @param {ClGrid.DataView} dataView
		 */
		isEditable: function(column, row, dataView){
			var cellType = CellTypeStorage.getColumnCellTypeOption(
				column, row, dataView);
			
			var EditorType = CellTypeStorage.getEditorType(cellType);
			if (!EditorType){
				return false;
			}

			// 編集対象行データ
			var item = dataView.getItem(row);

			// エディタ有効無効の最終チェック
			var isEditable = true;
			if (_.isFunction(cellType.isEditable)){
				isEditable = cellType.isEditable(
					item, row, column, dataView);
			}

			return isEditable !== false;
		},
		
		/**
		 * @method getEditor
		 */
		getEditor: function(column, row, dataView){
			var cellType = CellTypeStorage.getColumnCellTypeOption(
				column, row, dataView);

			var EditorType = CellTypeStorage.getEditorType(cellType);
			if (!EditorType){
				return;
			}

			// 編集対象行データ
			var item = dataView.getItem(row);

			// エディタ有効無効の最終チェック
			var isEditable = true;
			if (_.isFunction(cellType.isEditable)){
				isEditable = cellType.isEditable(
					item, row, column, dataView);
			}
			if (isEditable === false){
				// 戻り値がfalseの場合はエディットしない
				return;
			}
			
			if (_.isFunction(cellType.onBeforeCreateEditor)){
				cellType.onBeforeCreateEditor(
					item, row, column, dataView
				);
			}

			return function(args){
				var dataView = args.grid.getData();
				// エディット開始イベントのトリガー
				dataView.trigger("grid:before:edit", item, dataView, args.grid);
				// エディタオプションの取得
				var editorOptions = CellTypeStorage.getEditorOptions(cellType, args);
				editorOptions.dataGridCid = args.grid.clDataGridCid;
				editorOptions.dataGridComponentsSelector = args.grid.clDataGridComponentsSelector;
				args.editorContext = args.grid.editorContext || {};
				args.grid.editorContext = null;
				// エディタの初期化
				var editor = new EditorType(args, editorOptions||{}, cellType);
				// 入力制限するエレメントの取得
				var $validateElement = editor.$validateElement;

				if ($validateElement){
					if (cellType.limit){
						$validateElement.attr("data-limit", cellType.limit);
					}
				}
				if(editor.$el){
					editor.$el.addClass('clgrid-editor');
				}
				return editor;
			};
		}
	});

	ClGrid.EditorFactory = EditorFactory;
}(ClGrid, ClGrid.CellTypeStorage));

/**
 * @module ClGrid
 * 
 */
(function(ClGrid, CellTypeStorage){
	var wrapFormatter = function(formatter, cellType, dataView, grid){
		return function(row, cell, value, columnDef, dataContext){
			var itemMetadata = dataView.getItemMetadata(row) || {},
				colMetadata = itemMetadata.columns || {},
				cellMetadata = _.extend({}, colMetadata[cell],
										colMetadata[columnDef.id]);

			var options = {
				row: row,
				bodyRow: row - dataView.getHeadLength(),	// 行番号 formatter で参照しているだけ。
				cell: cell,
				columnDef: columnDef,
				dataContext: dataContext,
				cellType: cellType,
				grid: grid,
				dataView: dataView,
				itemMetadata: itemMetadata,
				cellMetadata: cellMetadata
			};
			return formatter(value, options);
		};
	};

	var wrapFilter = function(formatter, filters){
		return function(value, options){
			value = formatter(value, options);
			value = $.inputlimiter.mask(value, {filter: filters});
			return value;
		};
	};

	var decorate = function(formatter, decorator){
		return function(value, options){
			var formatted = formatter(value, options);
			var decorated = decorator(formatted, options);
			return decorated;
		};
	};
	
	/**
	 * Gridで使用するフォーマッタのファクトリー
	 * @class ClGrid.FormatterFactory
	 * @constructor
	 */
	var FormatterFactory = function(dataGrid){
		_.bindAll(this, 'removeFormatters');
		this.dataGrid = dataGrid;
		this.formatters = {};
		this.userFormatters = {};
	};
	
	_.extend(FormatterFactory.prototype, {
		/**
		 * エディット可能かチェックする
		 * @method isEditable
		 * @param column
		 * @param row
		 * @param {ClGrid.DataView} dataView
		 */
		isEditable: function(column, row, dataView){
			var cellType = CellTypeStorage.getColumnCellTypeOption(
				column, row, dataView);
			
			var formatter = CellTypeStorage.getFormatter(cellType);
			if (!formatter || !formatter.editable){
				return;
			}

			// 編集対象行データ
			var item = dataView.getItem(row);

			// エディタ有効無効の最終チェック
			var isEditable = true;
			if (_.isFunction(cellType.isEditable)){
				isEditable = cellType.isEditable(
					item, row, column, dataView);
			}

			return isEditable !== false;
		},
		
		/**
		 * @method getFormatter
		 */
		getFormatter: function(column, row, dataView, grid){
			var cellType = CellTypeStorage.getColumnCellTypeOption(
				column, row, dataView) || {};

			var formatter = CellTypeStorage.getFormatter(cellType);
			if (!formatter){
				formatter = ClGrid.Formatters.defaultFormatter;
			}
			var original = formatter;

			if (cellType.formatFilter && original.decorable !== false){
				formatter = wrapFilter(formatter, cellType.formatFilter);
			}

			var decorator = CellTypeStorage.getDecorator(cellType);
			if (decorator && original.decorable !== false){
				formatter = decorate(formatter, decorator);
			}
			formatter = wrapFormatter(formatter, cellType, dataView, grid);
			
			return formatter;
		},

		/**
		 * グリッドに登録されている全てのフォーマッタの初期化を行う
		 *
		 * @method start
		 * @param grid
		 * @param dataView
		 */
		start: function(){
			if (!this.dataGrid.grid || !this.dataGrid.dataView){
				throw 'dataGrid.grid or dataGrid.dataView is not set';
			}

			this.removeFormatters();
			
			_.each(ClGrid.Formatters, function(formatter, name){
				this.initFormatter(name, formatter);
			}, this);
			
			_.each(this.userFormatters, function(formatter, name){
				this.initFormatter(name, formatter);
			}, this);

			this.dataGrid.grid.onBeforeDestroy.unsubscribe(this.removeFormatters);
			this.dataGrid.grid.onBeforeDestroy.subscribe(this.removeFormatters);
		},

		/**
		 * @method removeFormatters
		 */
		removeFormatters: function(){
			this.dataGrid.trigger('destroy:grid:before');
			_.each(this.formatters, function(formatter) {
				if (formatter && _.isFunction(formatter.destroy)) {
					formatter.destroy();
				}
			}, this);
			this.formatters = {};
		},

		/**
		 * @private
		 * @method initFormatter
		 * @param {string} name
		 * @param {function} formatter
		 */
		initFormatter: function(name, formatter){
			var grid = this.dataGrid.grid,
				dataView = this.dataGrid.dataView;
			
			if (!this.formatters[name] &&
				_.isFunction(formatter.initialize)){
				this.formatters[name] =
					formatter.initialize(grid, dataView, this.dataGrid);
			}
		},

		/**
		 * @method addUserFormatter
		 * @param {string} name
		 * @param {function} formatter
		 */
		addUserFormatter: function(name, formatter){
			this.userFormatters[name] = formatter;
		}

	});

	ClGrid.FormatterFactory = FormatterFactory;
}(ClGrid, ClGrid.CellTypeStorage));

(function(ClGrid){
	/* use strict; */
	/**
	 * @class Editors
	 * @namespace ClGrid
	 * @static
	 */
	var Editors = {};

	/**
	 * エディタベースクラス
	 * @class EditorBase
	 * @extend Backbone.View
	 * @constructor
	 * @namespace ClGrid.Editors
	 * @param args
	 * @param args.column
	 * @param editorOptions
	 * @param cellType
	 */
	var EditorBase = Backbone.View.extend({
		/**
		 * 
		 * @property args
		 * @type {object}
		 * @example
		 * ```js
		 * args = {
		 *   column: {
		 *     field: 'FIELDNAME'
		 *   }
		 * }
		 * ```
		 */
		
		/**
		 * 当該セルのエディタオプションズ
		 * @property editorOptions
		 * @type {object}
		 */
		
		/**
		 * 当該セルのセルタイプ
		 * @property cellType
		 */
		
		constructor: function(args, editorOptions, cellType){
			this.args = args;
			this.editorOptions = editorOptions;
			this.cellType = cellType;
			EditorBase.__super__.constructor.apply(this, arguments);
		},

		/**
		 * ビューの作成を行う
		 * @method initailize
		 */
		
		/**
		 * フォーカスする
		 * @method focus
		 */
		
		/**
		 * 行データをビューに反映させる
		 * @method loadValue
		 * @param {object} item 行データ
		 */
		
		/**
		 * ビューの値を返す
		 * @method serializeValue
		 * @return ビューの値
		 */

		/**
		 * 行データに値を設定する
		 * @method applyValue
		 * @param item 行データ
		 * @param state 値
		 */

		/**
		 * ビューの値に変更があったかどうか
		 * @method isValueChanged
		 * @return {boolean}
		 */


		/**
		 * ビューの値を検証する
		 * @method validate
		 * @return {object}
		 */
		validate: function(){
			this.trigger("validate", this.serializeValue());
			
			return {
				valid: true,
				msg: null
			};
		},

		/**
		 * ビューを破棄する
		 * @method destroy
		 */
		destroy: function(){
			this.remove();
		},

		/**
		 * イベントをトリガーする
		 * @method triggerMethod
		 */
		triggerMethod: Marionette.triggerMethod
	});

	EditorBase.buildTemplate = ClGrid.buildTemplate;
	
	Editors.EditorBase = EditorBase;
	ClGrid.Editors = Editors;
}(ClGrid));

(function(ClGrid){
	function ClText(args, editorOptions) {
		var $input;
		var defaultValue;
		var scope = this;

		editorOptions || (editorOptions = {});
		_.defaults(editorOptions, {
			className: 'editor-text',
			addClass: ''
		});
		
		this.init = function () {
			$input = $('<INPUT type=text class="' +
					   editorOptions.className +
					   " " +
					   editorOptions.addClass +  
					   '" />')
				.appendTo(args.container)
				.bind("keydown.nav", function (e) {
					if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
						e.stopImmediatePropagation();
					}
				})
				.focus()
				.select();
			this.$el = $input;
			if (editorOptions.inputAttributes) {
				this.$el.attr(editorOptions.inputAttributes);
			}
			if (editorOptions.attributes) {
				this.$el.attr(editorOptions.attributes);
			}
			
			this.$validateElement = $input;
			// load(), applyValue()をオーバーライド
			_.extend(this, _.pick(editorOptions, 'loadValueFromItem', 'applyValueToItem'));
		};

		this.destroy = function () {
			this.stopListening();
			$input.remove();
		};

		this.focus = function () {
			$input.focus();
		};

		this.getValue = function () {
			return $input.val();
		};

		this.setValue = function (val) {
			$input.val(val);
		};

		this.loadValueFromItem = function(item){
			var val = item[args.column.field];
			return val == null ? '' : String(val);
		},

		this.applyValueToItem = function(item, state){
			item[args.column.field] = state;
		},
		
		this.loadValue = function (item) {
			defaultValue = this.loadValueFromItem(item, args);
			$input.val(defaultValue);
			$input[0].defaultValue = defaultValue;
			$input.select();
		};

		this.serializeValue = function () {
			return $input.val();
		};

		this.applyValue = function (item, state) {
			this.applyValueToItem(item, state, args);
		};

		this.isValueChanged = function () {
			return $input.val() !== defaultValue;
		};

		this.validate = function () {
			this.trigger("validate", this.getValue());
			
			return {
				valid: true,
				msg: null
			};
		};

		this.init();
	}

	ClText.extend = Backbone.Model.extend;
	
	_.extend(ClText.prototype, Backbone.Events);
	
	_.extend(ClGrid.Editors, {
		ClText: ClText
	});
}(ClGrid));

(function(ClGrid){
	var ClDate = Backbone.View.extend({
		className: 'datepicker_wrap',

		initialize: function(options, args){
			this.args = args;
			this.$el.html("<input type=text>");
			this.$input = this.$('input');
			this.$input.addClass("cl_date");
			if (options.inputAttributes) {
				this.$input.attr(options.inputAttributes);
			}
		},

		render: function(){
			clutil.datepicker(this.$input);
			this.$input
				.data('datepicker')
				.dpDiv.on('click', function(e){
					// カレンダーのクリック操作でエディットが終了しない
					// ようにイベント伝搬を止める
					e.stopPropagation();
				});
		},

		destroy: function () {
			this.stopListening();
			this.$input.remove();
		},

		focus: function () {
			this.$input.focus();
		},

		open: function(){
			this.$input.datepicker('show');
		},
		
		getValue: function () {
			var val = clutil.dateFormat(this.$input.val(), 'yyyymmdd')||0;
			return val;
		},

		setValue: function (val) {
			this.$input.datepicker('setIymd', val);
		},

		loadValue: function (item) {
			this.defaultValue = item[this.args.column.field] || "";
			this.setValue(this.defaultValue);
			this.$input.select();
		},

		serializeValue: function () {
			return this.getValue();
		},

		applyValue: function (item, state) {
			item[this.args.column.field] = state;
		},

		isValueChanged: function () {
			var val = this.getValue();
			return val != this.defaultValue;
		},

		validate: function () {
			this.trigger("validate", this.getValue());

			return {
				valid: true,
				msg: null
			};
		}

	});

	ClDate.extend = Backbone.Model.extend;

	_.extend(ClDate.prototype, Backbone.Events);

	_.extend(ClGrid.Editors, {
		ClDate: ClDate
	});
}(ClGrid));

(function(ClGrid, documentElement){
	var isInDom = function(view){
		return documentElement.contains(view.el);
	};

	////////////////////////////////////////////////////////////////
	// Selector
	var selectorOptions = ['emptyFlag', 'emptyItemLabel', 'labelTemplate'];

	var Selector = Backbone.View.extend({
		tagName: "select",

		className: "form-control",

		labelTemplate: _.template("<%= it.label %>", null, {variable:"it"}),

		emptyItemLabel: "&nbsp;",

		triggerMethod: Marionette.triggerMethod,

		events: {
			change: function(){
				this.triggerChange(true);
			}
		},

		collectionEvents: {
			reset: function(){
				this.triggerMethod("reset");
				this.renderCollection();
			}
		},

		triggerChange: function(fromUI){
			var val = this.$el.val();
			if (this.previous !== val){
				if (fromUI){
					this.triggerMethod("change:ui");
				}
				this.triggerMethod("change");
				this.previous = val;
			}
		},

		constructor: function(options){
			options || (options = {});
			_.extend(this, _.pick(options, selectorOptions));
			this.ensureTempalte('labelTemplate');
			Backbone.View.prototype.constructor.call(this, options);
			this.listenTo(this.collection, this.collectionEvents);
		},

		initialize: function(){
			this.$select = this.$el;
		},

		ensureTempalte: function(name){
			if (_.isString(this[name])){
				this[name] = _.template(this[name], null, {variable: 'it'});
			}
		},

		setItems: function(items){
			this.collection.reset(items);
		},

		render: function(){
			this.triggerMethod('before:render');
			this.renderCollection();
		},

		renderCollection: function(){
			var markup = this.emptyItemMarkup();
			this.collection.each(function(model){
				markup += this.itemMarkup(model);
			}, this);
			this.$el.html(markup);
			this.triggerMethod('after:render:collection');
			this.triggerChange();
		},

		emptyItemMarkup: function(){
			if (this.emptyFlag){
				return '<option value=0>' + this.emptyItemLabel + '</option>';
			}
			return '';
		},

		itemMarkup: function(model){
			var label  = this.labelTemplate(model.toJSON());
			var markup = '<option value="' + model.id + '">' +
					label + '</option>';
			return markup;
		},

		set: function(value){
			this.$el.val(value);
			this.triggerChange();
		},

		get: function(){
			return this.$el.val();
		},

		getAttrs: function(){
			var model = this.collection.get(this.get());
			if (model){
				return model.toJSON();
			}
		},

		setDisabled: function(flag, options){
			options = _.clone(options) || {};
			flag = flag !== false;
			options.prevDisabled = this.isDisabled();
			this.$el.prop('disabled', flag);
			if (options.prevDisabled !== flag){
				this.triggerMethod("ui:state:change:disabled", flag, options);
				this.triggerMethod("ui:state:change", 'disabled', flag, options);
			}
		},

		isDisabled: function(){
			return this.$el.prop('disabled');
		}
	});

	var ClMultipleSectorize = {
		getAttrs: function(){
			return _.map(this.get(), this.collection.get);
		}
	};

	var ClSelector = Backbone.View.extend({
		triggerMethod: Marionette.triggerMethod,

		initialize: function(options){
			var selOpt = _.omit(options, 'tagName', 'className', 'id', 'attributes', 'selectpicker');
			_.extend(selOpt, options.selectorOptions);
			this.selector = new Selector(selOpt);
			this.$select = this.selector.$el;
			this.listenTo(this.selector, 'all', function(){
				this.trigger.apply(this, _.toArray(arguments));
			});
			this.$el.html(this.selector.el);
			// selectpickerの初期化
			this.selector.$el.selectpicker(_.extend({}, {
				appendTo: options.dataGridComponentsSelector
			}, options.selectpicker));
			// ビューの状態が変わったら
			this.listenTo(this, 'ui:state:change', function(){
				this.$select.selectpicker('refresh');
			});
		},

		render: function(){
			this.selector.render();
		},

		setItems: function(items){
			this.selector.setItems(items);
			this.$select.selectpicker('refresh');
		},

		getItems: function(){
			this.selector.getItems();
		},

		setValue: function(value){
			this.selector.$el.selectpicker('val', value);
			this.selector.set(value);
		},

		getValue: function(){
			return this.selector.get();
		},

		getAttrs: function(){
			return this.selector.getAttrs();
		},

		remove: function(){
			this.selector.remove();
			Backbone.View.prototype.remove.call(this);
		},

		setDisabled: function(flag, options){
			return this.selector.setDisabled(flag, options);
		},

		open: function(){
			this.$('.bootstrap-select').addClass('open');
		}
	}, {
		/**
		 * @param [options]
		 * @param [options.items]
		 * @param [options.collection]
		 * @param [options.initValue]
		 * @param [options.idAttribute='id']
		 * @param [options.CollectionType=Collection]
		 * @param [options.emptyFlag=true]
		 * @param [options.emptyItemLabel='']
		 * @param [options.labelTemplate="<%= it.label %>"]
		 * @param [options.keepOnReset=fasle]
		 * @param [options.disableOnOneOrZero=true]
		 * @param [options.multiple=false]
		 */
		createSelector: function(options){
			options || (options = {});

			_.defaults(options, {
				CollectionType: Backbone.Collection,
				idAttribute: 'id'
			});

			// collectionが設定されていない場合は設定する
			if (!options.collection){
				// モデルのidAttributeを設定する
				var modelType = options.CollectionType.prototype.model;
				modelType.prototype.idAttribute = options.idAttribute;
				// コレクションを初期化する
				options.collection = new options.CollectionType(options);
			}

			// 空項目を表示するかどうか
			options.emptyFlag = options.emptyFlag !== false;

			// ビューの作成
			var view = new ClSelector(options);

			// multipleを設定する
			if (options.multiple != null){
				view.$select.prop('multiple', !!options.multiple);
			}
			if (view.$select.prop('multiple')){
				// getAttrsが複数に対応できるようにする
				_.extend(view.selector, ClMultipleSectorize);
			}

			// コレクションを描画後の処理を登録する
			view.listenTo(view, 'after:render:collection', function(){
				// selectpickerの更新
				this.$select.selectpicker("refresh");

				if (options.keepOnReset){
					// resetしたときに可能であれば選択を保持する
					if (this.collection.get(this.previous)){
						this.setValue(this.previous);
					}
				}
			});

			if (options.disableOnOneOrZero !== false){
				view.listenTo(view, 'after:render:collection', function(){
					var required = true;      // XXXX
					var total = this.collection.length;
					if (options.emptyFlag) total += 1;
					if (this.collection.length === 1){
						this.setValue(this.collection.first().id);
					}
					// 以下の場合に無効化
					// 1. 無効化不要フラグがtrueでない
					// 2. 全項目数が1以下の場合
					// 3. もしくは未選択項目も含めた全項目数が2(=選択項目は1)かつ必須かつ複数選択でない場合
					if (options.nondisable !== true &&
							(total <= 1 ||
							 (this.emptyFlag && total === 2 && required && !options.multiple))){
						this.setDisabled(true, {_disabledByOneOrZero: true});
					} else if (this.disabledByOneOrZero){
						this.setDisabled(false, {_disabledByOneOrZero: true});
					}
				});

				// 必須なプルダウンで項目数が1か0のときに無効化された場合に適切に解
				// 除できるようにする
				view.listenTo(view, 'ui:state:change:disabled', function(sw, options){
					if (options._disabledByOneOrZero){
						if (sw && !options.prevDisabled){
							this.disabledByOneOrZero = true;
						}else if (!sw){
							this.disabledByOneOrZero = false;
						}
					} else if (!sw){
						this.disabledByOneOrZero = false;
					}
				});
			}

			// 一覧を設定する
			var items = options.items;
			if (_.isFunction(items)) {
				items = items(options);
			}
			if (items && items.done){
				// 非同期の場合
				var deferred = $.Deferred();
				deferred.promise(view);
				items.done(function(items){
					view.collection.reset(items);
					// 初期値を設定する
					if (_.has(options, 'initValue')){
						view.setValue(options.initValue);
					}
					deferred.resolve();
				}).fail(function(){deferred.reject()});
			} else {
				// 同期の場合
				view.collection.reset(items);
				// 初期値を設定する
				if (_.has(options, 'initValue')){
					view.setValue(options.initValue);
				}
			}

			return view;
		},

		/**
		 * @param [options]
		 * @param [options.nameAttribute='name']
		 * @param [options.codeAttribute='code']
		 */
		createCodeNameSelector: function(options){
			options || (options = {});

			_.defaults(options, {
				nameAttribute: 'name',
				codeAttribute: 'code'
			});

			if (options.nameOnly){
				options.labelTemplate = function(data){
					var name;
					if (data){
						name = clutil.nested.getNested(data, options.nameAttribute);
					}
					return _.escape(name);
				};
			} else if (!options.labelTemplate){
				options.labelTemplate = function(data){
					var code, name;
					if (data){
						code = clutil.nested.getNested(data, options.codeAttribute);
						name = clutil.nested.getNested(data, options.nameAttribute);
					}
					return _.escape(code) + ":" + _.escape(name);
				};
			}

			return ClSelector.createSelector(options);
		},

		createAsyncSelector: function(options){
			return ClSelector.createSelector(options);
		}
	});

	var ClSelectWrapper = function(selector, options){
		this.selector = selector;
		this.options = options;
		this.$el = selector.$el;
		this.$select = selector.$select || selector.$el;
		this.$validateElement = this.$select;
		this.$el.addClass('cl_valid_auto_off');
		this.listenTo(this.selector, {
			'change:ui': function(attrs, view, options){
				console.log('**** change:ui commitChanges', attrs, view, options);
				this.options.commitChanges();
			},
			'change': function(attrs, view, options){
				if (options && options.changedBy === 'ui'){
					console.log('**** change trigger');
					selector.trigger('change:ui', attrs, view, options);
				}
			}
		});
	};

	ClSelectWrapper.extend = Backbone.Model.extend;
	_.extend(ClSelectWrapper.prototype, Backbone.Events, {
		destroy: function(){
			this.stopListening();
			var that = this;
			_.defer(function(){
				// deferしないとui.menuのmouseHandled変数がただしく設定されない
				that.selector.remove(true);
				that.trigger('destroy');
			});
		},
		focus: function(){
			var $select = this.selector.$select || this.selector.$el,
				$input;
			if ($select.hasClass('_clcombobox')){
				$input = $select.next().find('.combobox-input');
				$input.focus();
				_.defer(function(){
					$input.select();
				});
			}else{
				$select.next().find('>button').focus();
			}
		},
		loadValue: function(item){
			console.log('#### loadValue');
			var data = item[this.options.column.field] || {};
			this.previous = parseInt(data.id, 10) || null;
			this.selector.setValue(data.id);
		},
		serializeValue: function(){
			return this.selector.getValue();
		},
		applyValue: function(item, state){
			item[this.options.column.field] = this.selector.getAttrs();
		},
		isValueChanged: function(){
			var val = this.selector.getValue();
			return val !== this.previous;
		},
		validate: function(){
			this.trigger("validate", this.selector.getAttrs());

			return {
				valid: true,
				msg: null
			};
		},
		open: function(){
			console.log('#### open');
			var $select = this.$select;
			if ($select.is('._clcombobox')){
				$select.selectpicker('open');
			}else{
				$select.next('.bootstrap-select').addClass('open');
			}
		}
	});

	var ClAsyncSelectWrapper = ClSelectWrapper.extend({
		loadValue: function(item){
			console.log('#### loadValue(a)');
			var data = item[this.options.column.field] || {};
			this.previous = parseInt(data.id, 10) || null;
			if (!this.selector.done){
				this.selector.setValue(data.id);
			} else {
				var that = this;
				this.selector.done(function(){
					console.log('#### loadValue(a) xxxx');
					that.selector.setValue(data.id);
				});
			}
		},

		serializeValue: function(){
			if (!this.selector.done){
				return ClSelectWrapper.prototype.serializeValue.call(this);
			} else {
				return this.previous;
			}
		}
	});

	var ClTypeSelectEditor = ClSelectWrapper.extend({
		loadValue: function(item){
			var value = item[this.options.column.field] || 0;
			this.previous = parseInt(value, 10) || null;
			this.selector.setValue(value);
		},
		applyValue: function(item, state){
			item[this.options.column.field] = this.selector.getValue();
		},
		validate: function(){
			this.trigger("validate", this.serializeValue());

			return {
				valid: true,
				msg: null
			};
		}
	});

	_.extend(ClGrid.Editors, {
		ClSelector: ClSelector,
		ClSelectWrapper: ClSelectWrapper,
		ClAsyncSelectWrapper: ClAsyncSelectWrapper,
		ClTypeSelectEditor: ClTypeSelectEditor
	});
}(ClGrid, document.documentElement));

(function(ClGrid){
	var ClAcWrapper = function(field, options){
		this.field = field;
		this.options = options;
		this.$validateElement = field.$el;
		this._loadCount = 0;
	};

	_.extend(ClAcWrapper.prototype, Backbone.Events, {
		destroy: function(){
			this.stopListening();
			this.field.remove(true);
		},
		focus: function(){
			var $el = this.field.$el.focus();
			
			_.defer(function(){
				$el.select();
			});
		},
		loadValue: function(item){
			var data = item[this.options.column.field] || {};
			this.previous = parseInt(data.id, 10) || null;
			if (!this._loadCount && data._mismatch){
				// 未確定状態、エディット開始時に入力を戻す
				var label = this.field.itemTemplate(data);
				this.field.$el.val(label);
				this.field.setValue(data);
				delete data._mismatch;
			}else{
				this.field.setValue(data);
			}
			this._loadCount++;
		},
		serializeValue: function(){
			var item = this.field.$el.autocomplete('clAutocompleteItem');
			var val = this.field.$el.val();
			var label = this.field.itemTemplate(item || {});
			if (item && item.id && label === val){
				delete item._mismatch;
			} else {
				// 未確定時のときに入力を保持するため
				item = {
					id: 0,
					name: this.field.$el.val(),
					_mismatch: true
				};
			}
			return item;
		},
		applyValue: function(item, state){
			item[this.options.column.field] = state;
		},
		isValueChanged: function(){
			return true;
		},
		validate: function(){
			this.trigger("validate", this.serializeValue());
			return {
				valid: true,
				msg: null
			};
		}
	});

	_.extend(ClGrid.Editors, {
		ClAcWrapper: ClAcWrapper
	});
}(ClGrid));

/**
 * # エディタインターフェイス
 * 
 * @module ClGrid
 * @namespace ClGrid
 */

(function(ClGrid, Editors, document){
	(function(){
		// とりあえずここでグリッド内セレクターのイベントハンドラを設定する。

		// 項目がクリックされたときにセルを選択されないようにする
		$(document)
			.on('click', '.clgrid-editor-select .bootstrap-select > .dropdown-menu li > a', function(e){
				$(e.target)
					.closest('.bootstrap-select')
					.removeClass('open');
				e.stopPropagation();
			});

		$(document)
			.on('keydown', '.clgrid-editor-select', function(e){
				if (e.which === 38){
					e.stopPropagation();
				} else if (e.which === 40) {
					e.stopPropagation();
				}
			});
	}());

	/**
	 * Gridで使用するエディタ達
	 *
	 * @class EditorTypes
	 * @static
	 */
	var EditorTypes = {};

	/**
	 * セル幅をargs.containerのwidthに設定する
	 */
	var setSelectorWidth = function(wrapper, $el, args) {
		// jshint unused: false
		ClGrid.fixSelector($el, args.grid);
	};

	var openPulldown = function(selector, wrapper, options){
		if (selector.done){
			selector.done(function(){
				wrapper.open();
			});
		} else if (options.done){
			options.done(function(){
				wrapper.open();
			});
		} else {
			wrapper.open();
		}
	};
	
	/**
	 * セレクター
	 *
	 * @method selector
	 * @param args
	 * @param editorOptions
	 * @param {Array} [editorOptions.items] 選択項目一覧
	 * @param {String} [editorOptions.idAttribute='id'] id属性のプロパティ名
	 * @param {boolean} [editorOptions.multiple=false] 複数選択するかどうか
	 * @param {boolean} [editorOptions.emptyFlag=true] 空項目を表示するかどうか
	 * @param {string} [editorOptions.emptyItemlabel=''] 空項目の表示ラベル
	 * @param {function|string} [editorOptions.labelTemplate] ラベルのフォーマッタ
	 * デフォルトは`'<%= it.label %>'`
	 */
	EditorTypes.selector = function(args, editorOptions){
		editorOptions = _.extend({}, editorOptions, {
			container: args.container,
			disableOnOneOrZero: false
		});
		_.defaults(editorOptions, {
			WrapperType: Editors.ClSelectWrapper
		});
		var selector = Editors.ClSelector.createSelector(editorOptions);
		var wrapper = new editorOptions.WrapperType(selector, args);
		selector.$el.addClass("clgrid-editor-select")
			.appendTo(args.container);
		
		// 幅を設定する
		setSelectorWidth(wrapper, selector.$el, args);
		// フォーカス
		wrapper.focus();

		// プルダウンを開く
		if (args.editorContext.type === 'click') {
			wrapper.loadValue(args.item);
			openPulldown(selector, wrapper, editorOptions);
		}
		
		return wrapper;
	};

	/**
	 * コードネームセレクター
	 */
	EditorTypes.codenameselector = function(args, editorOptions){
		editorOptions = _.extend({}, editorOptions, {
			container: args.container
		});
		var selector = Editors.ClSelector.createCodeNameSelector(editorOptions);
		var wrapper = new Editors.ClSelectWrapper(selector, args);
		selector.$el.addClass("clgrid-editor-select")
			.appendTo(args.container);

		// 幅を設定する
		setSelectorWidth(wrapper, selector.$el, args);
		// フォーカス
		wrapper.focus();
		return wrapper;
	};

	/**
	 * 選択項目が非同期になるセレクター
	 *
	 * 下記引数に記されてる以外の引数については{{#crossLink "ClGrid.EditorTypes/selector:method"}}{{/crossLink}}を参照のこと
	 *
	 * @method asyncselector
	 * @param args
	 * @param editorOptions
	 * @param {promise} [editorOptions.items] 選択項目一覧
	 */
	EditorTypes.asyncselector = function(args, editorOptions){
		editorOptions || (editorOptions = {});
		editorOptions.WrapperType = Editors.ClAsyncSelectWrapper;
		var wrapper = EditorTypes.selector(args, editorOptions);
		return wrapper;
	};

	/**
	 * 選択項目が非同期になるセレクター
	 */
	EditorTypes.asynccodenameselector = function(args, editorOptions){
		var wrapper = EditorTypes.codenameselector(args, editorOptions);
		return wrapper;
	};

	/**
	 * テキストフィールド
	 */
	EditorTypes.text = function(args, editorOptions){
		var editor = new Editors.ClText(args, editorOptions);
		editor.$el.addClass('cl_valid_auto_off');

		return editor;
	};

	/**
	 * チェックボックス
	 */
	EditorTypes.checkbox = function(args){
		var editor = new Slick.Editors.Checkbox(args);
		return editor;
	};

	/**
	 * ラジオボタン
	 */
	EditorTypes.radio = function(args){
		var editor = new Slick.Editors.Radio(args);
		return editor;
	};

	/**
	 * 区分セレクター
	 *
	 * clutil.cltypeselectorに相当するグリッドのエディタです。
	 *
	 * @method cltypeselector
	 * @param args
	 * @param editorOptions
	 * @param [editorOptions.kind] clutil.cltypeselectorのkind引数を指
	 * 定してください。
	 * @param {Boolean|0|1} [editorOptions.unselectedflag=true] 空項目
	 * を表示するかどうかです。デフォルトでは表示します。空項目を表示し
	 * たくない場合以外は指定しないでください。
	 * @param {Boolean|0|1} [editorOptions.nameOnly=false] ラベルの表記
	 * にて`名前`のみの表示にする場合は`true`に設定します。デフォルトで
	 * は`コード:名前`の形式になります。
	 */
	EditorTypes.cltypeselector = function(args, editorOptions){
		var options = {
			container: $('<div class="clgrid-editor-select"></div>')
		};
		_.extend(options, _.pick(
			editorOptions, "kind", "unselectedflag", "namedisp",
			'ids', 'emptyLabel', 'reverse', 'filter'));

		var selector = clutil.cltypeselector(options);
		
		var wrapper = new Editors.ClTypeSelectEditor(selector, args);
		options.container.appendTo(args.container);
		
		// 幅を設定する XXXX これだけうまくうごかない
		setSelectorWidth(wrapper, options.container, args);

		// フォーカス
		wrapper.focus();
		
		// プルダウンを開く
		if (args.editorContext.type === 'click') {
			wrapper.loadValue(args.item);
			wrapper.open();
		}
		
		return wrapper;
	};

	/**
	 * プルダウン
	 *
	 * @method clajaxselector
	 * @param args
	 * @param {object} editorOptions
	 * @param {string} editorOptions.funcName プルダウンの種類を決定しま
	 * す。必ず文字列で指定してください。候補一覧は、
	 * `clutil.fieldDefs.selector`から指定します。指定できる名前は、
	 * `_.keys(clutil.fieldDefs.selector)`で確認してください。
	 *
	 * @param {function|object} [editorOptions.dependAttrs] サーバ問い合
	 * わせに必要なパラメータです。`clutil['cl' +
	 * editorOPtions.funcName]`のドキュメントを参照してください。関数を
	 * 指定した場合は第1引数に行のモデルデータが渡されます。
	 * @param {Boolean|0|1} [editorOptions.unselectedflag=true] 空項目
	 * を表示するかどうかです。デフォルトでは表示します。空項目を表示し
	 * たくない場合以外は指定しないでください。
	 * @param {Boolean|0|1} [editorOptions.nameOnly=false] ラベルの表記
	 * にて`名前`のみの表示にする場合は`true`に設定します。デフォルトで
	 * は`コード:名前`の形式になります。
	 */
	EditorTypes.clajaxselector = function(args, editorOptions){
		var func = clutil["cl" + editorOptions.funcName + "selector"];
		if (!func){
			console.warn("Invalid funcName", editorOptions.funcName);
			return;
		}
		var container = $('<div class="clgrid-editor-select"></div>');
		var options = _.extend({
			container: container,
			dependAttrs: function(){
				var attrs = editorOptions.dependAttrs;
				if (_.isFunction(editorOptions.dependAttrs)){
					attrs = editorOptions.dependAttrs(args.item);
				}
				return attrs;
			},
			selectpicker: {
				appendTo: editorOptions.dataGridComponentsSelector
			}
		}, _.omit(editorOptions, 'container', 'dependAttrs'));
		var selector = func(options);
		var wrapper = new Editors.ClSelectWrapper(selector, args);
		container.appendTo(args.container);
		
		// 幅を設定する
		setSelectorWidth(wrapper, container, args);
		
		// フォーカス
		wrapper.focus();
		
		// プルダウンを開く
		if (args.editorContext.type === 'click') {
			wrapper.loadValue(args.item);
			openPulldown(selector, wrapper, editorOptions);
		}
		return wrapper;
	};

	/**
	 * オートコンプリート
	 *
	 * @method clajaxac
	 * @param args
	 * @param {object} editorOptions
	 * @param {object} editorOptions.funcName オートコンプリートの種類
	 * を決定します。必ず文字列で指定してください。候補一覧は、
	 * `clutil.fieldDefs.autocomplete`から指定します。指定できる名前は、
	 * `_.keys(clutil.fieldDefs.autocomplete)`で確認してください。
	 *
	 * @param {function|object} [editorOptions.dependAttrs] サーバ問い合
	 * わせに必要なパラメータです。`clutil['cl' +
	 * editorOPtions.funcName]`のドキュメントを参照してください。関数を
	 * 指定した場合は第1引数に行のモデルデータが渡されます。
	 *
	 */
	EditorTypes.clajaxac = function(args, editorOptions){
		var func = clutil["cl" + editorOptions.funcName];
		if (!func){
			console.warn("Invalid funcName", editorOptions.funcName);
		}
		var options = _.extend({
			dependAttrs: function(){
				var attrs = {};
				if (_.isFunction(editorOptions.dependAttrs)){
					attrs = editorOptions.dependAttrs(args.item);
				}
				return attrs;
			}
		}, _.omit(editorOptions, 'dependAttrs'));
		var autocomplete = func(options);
		var wrapper = new Editors.ClAcWrapper(autocomplete, args);
		autocomplete.$el
			.addClass('cl_valid_auto_off')
			.attr(options.inputAttributes || {})
			.parent()
			.appendTo(args.container);
		wrapper.focus();
		return wrapper;
	};

	/**
	 * 日付け
	 * @method date
	 */
	EditorTypes.date = function(args, editorOptions){
		var editor = new Editors.ClDate(editorOptions, args);
		editor.$el
			.addClass('cl_valid_auto_off')
			.appendTo(args.container);		
		editor.render();
		if (args.editorContext.type === 'click' &&
			$(args.editorContext.target).is('.cal')) {
			editor.open();
		}
		return editor;
//		return new Slick.Editors.Date(args);
	};

	ClGrid.EditorTypes = EditorTypes;
}(ClGrid, ClGrid.Editors, document));

/**
 * @module ClGrid
 *
 */
(function(ClGrid){
	/**
	 * Gridで使用するフォーマッタ群
	 * @class ClGrid.Formatters
	 * @static
	 */
	var Formatters = {};

	/**
	 * フォーマッタからイベントを発生させる場合に使用する
	 * @method buildEvent
	 * @param args
	 * @param args.row
	 * @param args.cell
	 * @param grid
	 * @param dataView
	 * @return {object}
	 * ```js {
	 *   // 行データ
	 *   item: item,
	 *   // 行番号(全体の)
	 *   row: args.row,
	 *   // 列番号；
	 *   cell: args.cell,
	 *   // カラムオブジェクト
	 *   column: column,
	 *   // slickグリッドオブジェクト
	 *   grid: grid,
	 *   // dataView
	 *   dataView: dataView
	 *  }
	 * ```
	 */
	Formatters.buildEvent = function(args, grid, dataView, vent){
		var item = dataView.getItem(args.row);
		var column = grid.getColumns()[args.cell];
		return {
			item: item,
			row: args.row,
			cell: args.cell,
			column: column,
			grid: grid,
			dataView: dataView,
			isBody: dataView.isBodyRow(args.row),
			dataGrid: vent
		};
	};

	/**
	 * デフォルトフォーマッタ
	 *
	 * @method defaultFormatter
	 */
	Formatters.defaultFormatter = function(value){
//		return '<span>' + _.escape(value) + '</span>';
		return _.escape(value);
	};

	/**
	 * `{id: ?, code: ?, name: ?}` な `value` に対して`コード:名称`形式で表示するフォーマッタ
	 *
	 * @method codename
	 * @param {Object} value
	 */
	var codename = ClGrid.buildTemplate("<%- it.code %>:<%- it.name %>");
	Formatters.codename = function(value){
		// jshint unused: false
		if (value == null) return '';
		var code = value.code || '';
		var name = value.name || '';
		var sep = (code && name) ? ":" : "";
		return code + sep + name;
	};

	/**
	 * `{id: ?, code: ?, name: ?}` な `value` に対して`name`のみを表示する
	 * フォーマッタ
	 *
	 * @method codename
	 * @param {Object} value
	 */
	Formatters.nameonly = function(value){
		if (value == null) return '';
		return value.name != null ? value.name : '';
	};

	Formatters.checkmark = function(value) {
	    //return value ? "<img src='../images/tick.png'>" : "";
	    return value ? "<img src='/SlickGrid-2.0/images/tick.png'>" : "";
	};

	/**
	 * チェックボックス
	 * @method checkbox
	 */
	Formatters.checkbox = (function(){
		var checkboxTemplate = ClGrid.buildTemplate(
			'<label class="checkbox ib <% it.checked && print("checked") %> ' +
				'<% !it.editable && print("disabled") %>">' +
				'<span class="icons clgr-cb">' +
				'<span class="first-icon fui-checkbox-unchecked">' +
				'</span>' +
				'<span class="second-icon fui-checkbox-checked">' +
				'</span>' +
				'</span>' +
				'</label>'
			// '<input class="<%- it.className %>" type="checkbox" ' +
			// 	'<% it.checked && print("checked=checked") %>>'
		);

		var checkbox = function(value, options){
			return checkboxTemplate({
				className: "clgr-cb ",
				checked: value,
				editable: options.cellMetadata.editablef
			});
		};

		checkbox.editable = true;

		checkbox.initialize = function(grid, dataView, vent){
			var ea = new clutil.EventAggregator();
			ea.listenTo(vent, {
				'click:cell': function(e, args){
					var $target = $(e.target).closest('.clgr-cb');
					var $label = $target.parent('.checkbox');
					if($target.length && $label.is(':not(.disabled')){
						var ev = Formatters.buildEvent(args, grid, dataView, vent);
						var item = ev.item;
						var column = ev.column;

						$target.parent().toggleClass('checked');
						var previous = item[column.field];
						var checked = $target.parent().hasClass('checked');
						var changed = false;
						if (previous !== checked){
							item[column.field] = checked ? 1 : 0;
							dataView.updateItem(item);
							vent.trigger("formatter:checkbox:change", ev);
							changed = true;
						}
						ev.dataGrid = vent;
						ev.changed = changed;
						Marionette.triggerMethod.call(vent, 'commit:edit', ev);
					}
				},

				'destroy:grid:before': function(){
					this.stopListening();
				}
			});
		};

		return checkbox;
	}());

	/**
	 * 区分セレクター用のフォーマッタ
	 *
	 * @method cltypeselector
	 * @param value
	 */
	Formatters.cltypeselector = function(value, options){
		if (!value) return '';
		var editorOptions = options.cellType.editorOptions;
		if (!editorOptions) return;
		var nameOnly = editorOptions.nameOnly;
		var kind = options.cellType.editorOptions.kind;
		var typenamelist = clutil.gettypenamelist(kind);
		if (!typenamelist) return;
		var item = _.find(typenamelist, function(item){
			return item.type_id === parseInt(value, 10);
		});
		if (!item) return;
		var label = '';
		if (nameOnly){
			label = _.escape(item.name);
		} else {
			label = _.escape(item.code) + ":" + _.escape(item.name);
		}
		return label;
	};

	/**
	 * 行番号フォーマッタ
	 * @method lineno
	 * @param value
	 * @param options.bodyRow
	 * @param options.columnDef
	 */
	Formatters.lineno = function(value, options){
//		if (value == null) return '';
//		return value.name != null ? value.name : '';
//		var options = {
//				row: row,
//				bodyRow: row - dataView.getHeadLength(),	// 行番号 formatter で参照しているだけ。
//				cell: cell,
//				columnDef: columnDef,
//				dataContext: dataContext,
//				cellType: cellType,
//				itemMetadata: dataView.getItemMetadata(row)	// 追加。
//				------------------------------------------------------
//				※何か足りないものがあれば、ココのオプションに追加する。・・・
//				clgrid.formatterfactory.js 4行目あたり
//			};
		var lineno = options.bodyRow;
		if(lineno >= 0 && options.columnDef._startNo){
			lineno += options.columnDef._startNo;
		}
		return '<span class="lineno">' + lineno + '</span>';
	};

	/**
	 *
	 * 行削除ボタンフォーマッタ
	 * @method dellrow
	 */
	Formatters.dellrow = (function(){
		var formatter = function(value, options){
			var gridOptions = options.grid.getOptions();
			var rowDelProtect = (options.itemMetadata.rowDelProtect == true);
			if (gridOptions.editable && !gridOptions.disableDelRow && !rowDelProtect){
				return '<span class="btn-delete"></span>';
			}else{
				return '';
			}
		};
		return formatter;
	}());

	/**
	 * [▼] OPEN、[＞] CLOSE  ボタンつきフォーマッタ（カラム専用）
	 *
	 * @method columnexpander
	 */
	Formatters.columnexpander = (function(){
		var expander = function(value, options){
			// value は text
			//開:  '<span class="expander"></span> + value';
			//閉: '<span class="expander close"></span> + value';
			var meta = options.itemMetadata;
			if(!meta || !meta.columns){
				return _.escape(value);
			}
			var colId = options.columnDef.id;
			var cellMeta = meta.columns[colId];
			if(!cellMeta || !cellMeta.expander){
				return _.escape(value);
			}
			var isOpen = cellMeta.expander.opened;
			return '<span class="expander' + (isOpen ? '' : ' closed') + '">' +  _.escape(value) + '</span>';
		};

		expander.initialize = function(grid, dataView, vent){
			var ea = new clutil.EventAggregator();
			ea.listenTo(vent, {
				'click:cell': function(e, args){
					var $target = $(e.target);
					if($target.hasClass("expander")){
						var ev = Formatters.buildEvent(args, grid, dataView, vent);
						var item = ev.item;
						var column = ev.column;

						var rowId = item[dataView.idProperty];
						var rowIdx = dataView.getIdxById(rowId);

						var meta = dataView.getItemMetadata(rowIdx);
						if(!meta){
							// メタデータがいない？
							console.warn('Formatters.columnexpander: lost metadata.');
							return;
						}
						var cellMeta = meta.columns ? meta.columns[column.id] : null;
						if(!cellMeta){
							// 当該セルに対するメタ情報がいない？
							console.warn('Formatters.columnexpander: lost metadata[' + column.id + ']');
							return;
						}
						var expander = cellMeta.expander;
						if(!_.has(expander, 'colgroups') ){
							// グループ要素を構成するカラムID配列を持っていない
							console.warn('Formatters.columnexpander: metadata[' + column.id + '] is not ready.');
							return;
						}

						// 展開/折り畳み処理
						var stColIdx = grid.getColumnIndex(column.id);
						var columns = grid.getColumns();
						var colGroupCount = expander.colgroups.length;
						if(expander.opened){
							// エクスパンダーを閉じる
							// Open -> Close
							columns.splice(stColIdx+1, (colGroupCount-1));
							cellMeta.colspan = 1;
							expander.opened = false;
						}else{
							// エクスパンダーを開く
							// Close -> Open
							for(var i = 1; i < colGroupCount; i++){
								var xColDef = expander.colgroups[i];
								columns.splice(stColIdx + i, 0, xColDef);
							}
							cellMeta.colspan = colGroupCount;
							expander.opened = true;
						}

						// メタデータが変わるだけ。updateItem(item) は必要か？
						//dataView.updateItem(item);
						grid.setColumns(columns);

						// 実際の畳み込み処理は、ClAppGridView へ委譲する。
						ev.cellMetadata = cellMeta;
						vent.trigger("formatter:columnexpander:change", ev);
					}
				},
				'destroy:grid:before': function(){
					this.stopListening();
				}
			});
		};

		return expander;
	}());

	/**
	 * 日付け用フォーマッタ
	 *
	 * @method date
	 * @param {yyyymmdd} value
	 */
	Formatters.date = (function() {
		var days = '日月火水木金土';
		var template = ClGrid.buildTemplate(
			'<%- it.ymd %>' +
				'<% if (it.wdayLabel) { %>' +
				'<span class="dayOfWeek<%- it.wday %>">（<%- it.wdayLabel %>）</span>' +
				'<% } %>' +
				'<img class="cal" src="/system/images/icn_s_calendar.png">'
		);
		return function(value){
			var ymd, date, wday;
			if (value && !clutil.Validators.date(value)) {
				ymd = clutil.dateFormat(value, 'yyyy/mm/dd');
				date = clutil.ymd2date(value);
				wday = date.getDay();
			}
			var markup = template({
				ymd: ymd,
				wday: wday,
				wdayLabel: days[wday]
			});

			return markup;
		};
	}());

	////////////////////////////////////////////////////////////////
	// デコレータ

	Formatters.selectpicker = (function(){
		var template = ClGrid.buildTemplate(
			'<div class="clgrspfe btn-group bootstrap-select">' +
				'<div class="btn selectpicker btn-input btn-info">' +
				'<span class="filter-option pull-left"><%= it.content %></span>&nbsp;' +
				'<span class="caret"></span>' +
				'</div>' +
				'</div>' +
				'<div class="clgrspfr"><%= it.content %></div>'
		);
		return function(value){
			return template({content: value});
		};
	}());

	ClGrid.Formatters = Formatters;
}(ClGrid));


/**
 * @module ClGrid
 * 
 */
(function(ClGrid){
	var CellTypeStorage = ClGrid.CellTypeStorage;

	/**
	 * # グリッドのcolumns[N].cellMetadataオプション
	 *
	 * セルにメタデータを設定する
	 * ```js
	 * {
	 *   name: '列1'
	 *   id: 'col1',
	 *   field: 'col1',
	 *   cellMetadata: function(args){
	 *     // args.row 全体に対するrow
	 *     // args.bodyRow ボディ部のrow
	 *     // args.item 対象行データ
	 *     var cellMetadata = {
	 *     };
	 *     if (args.item.col1HasError) {
	 *       cellMetadata.cssClasses = 'cellError';
	 *     }
	 *     return cellMetadata;
	 *   }
	 * }
	 * ```
	 * 
	 * # グリッドのcolumns[N].cellTypeオプション
	 *
	 * 注意このクラスはありません。
	 *
	 * # 共通cellTypeオプション
	 *
	 * ### `[cellType.type]` `{String}`
	 * 以下のcelltype一覧にあるタイプを指定してください。
	 *
	 * ### `[cellType.editorOptions]`
	 *
	 * 各エディタごとに指定できるオプションが異なります。各エディタの
	 * editorOptions引数を確認ください。
	 *
	 * ### `[cellType.isEditable]` `{Function}`
	 *
	 * セルがエディットに入る前に呼ばれます。編集可能状態が行データや状
	 * 態に基づいて決定される場合は関数を設定してください。関数の形式は
	 * 以下になります。
	 *
	 * ```js
	 * function(item, row, column, dataView){}
	 * ```
	 *
	 * 編集不可である場合は、`false`を返してください。`false`以外の値の
	 * 場合は編集可能であるとみなします。`null`や`undefined`なども編集
	 * 可能であるとみなすので注意してください。`Boolean`型を強制するた
	 * めに`Boolean`関数を利用するか`!!`を利用するなどしてください。
	 *
	 * ```js
	 * isEditable: function(item){
	 *   // fooが設定されている場合のみ編集可能
	 *   return !!item.foo;
	 * }
	 * ```
	 *
	 * ### `[cellType.beforeValid]` `{Function}`
	 *
	 * `cellType#validator` での入力チェックの前にコールされる。この関数でfalseを
	 * 返した場合は当該セルの`cellType.validator`による検証を行わない。
	 * 
	 * ### `[cellType.validator]` `{String}`
	 *
	 * グリッドのセルにてエディット完了時または、`ClGridView#isValid`の
	 * 呼び出しで使用されるバリデータを指定します。指定方法は
	 * data-validator属性に設定する方法とおなじです。
	 *
	 * 指定できるバリデータの種類は
	 * {{#crossLink "clutil.Validators"}}{{/crossLink}}
	 * を参照してください。
	 *
	 * 例
	 * ```js
	 * cellType: {
	 *   ...
	 *   validator: 'alnum len:10',
	 *   ...
	 * }
	 * ```
	 *
	 * #### 注意 必須バリデータの指定について
	 *
	 * `validator: 'required'`が設定された場合、エディタタイプを元に
	 * ClAppGridViewが以下のように引数を補間します。
	 * 
	 * - オートコンプリートの場合
	 * validator: 'required:id'
	 *
	 * - プルダウンの場合
	 * validator: 'required:select'
	 *
	 * - 日付けの場合
	 * validator: 'required:date'
	 *
	 * ### `[cellType.limit]`
	 *
	 * テキスト入力に{{#crossLink "jQuery.inputlimiter"}}{{/crossLink}}を利用して
	 * 制限を行います。設定方法は`data-limit`属性の指定方法と同様です。
	 *
	 * 例
	 * ```js
	 * cellType: {
	 *   ...
	 *   limit: 'alnum len:10',
	 *   ...
	 * }
	 * ```
	 *
	 * ### `[cellType.formatFilter]`
	 *
	 * テキストのフォーマットに{{#crossLink
	 * "jQuery.inputlimiter"}}{{/crossLink}}を利用してカンマなどを付けます。
	 * 設定方法は`data-filter`属性の指定方法と同様です。
	 *
	 * ### `[cellType.editorType]`
	 *
	 * セルタイプのデフォルトのエディタを変更する場合にコンストラクタ関
	 * 数を指定します。独自のエディタを作成する場合は{{#crossLink
	 * "ClGrid.EditorTypes"}}{{/crossLink}}を参考にしてください。
	 *
	 * ### `[cellType.formatter]`
	 *
	 * セルタイプのデフォルトの`formatter`を変更する場合にフォーマッタ
	 * 関数を指定します。独自のエディタを作成する場合は{{#crossLink
	 * "ClGrid.Formatters"}}{{/crossLink}}を参考にしてください。
	 *
	 * ### `[cellType.placeholder]`
	 *
	 * プレイスホルダーを指定します。
	 * 
	 * ###### サポート済タイプ
	 * 
	 * - `text`
	 * - `date`
	 * - `ajaxac`
	 *
	 * ###### 注意
	 *
	 * 現状はエディット状態のときで空のときのみプレイスホルダが表示され
	 * る。非エディット状態かつエディット可能な場合かつ空のときにもサポー
	 * トしなければならないかも。
	 *
	 * 
	 * # cellType一覧
	 *
	 * ### text
	 *
	 * `input[type=text]な入力を提供します。
	 *
	 * ```js
	 * cellType: {
	 *   type: "cltext",
	 *   validatorClass: "require",
	 *   dataValidator: "numeric",
	 *   limit: "decimal",
	 *   filter: "comma"
	 * }
	 * ```
	 *
	 * ###### `editorOption.className` `{String}`
	 *
	 * inputに対するクラス名を指定する
	 *
	 * ### `clajaxac`
	 *
	 * - エディタ {{#crossLink "ClGrid.EditorTypes/ajaxac:method"}}{{/crossLink}}
	 * - フォーマッタ {{#crossLink "ClGrid.Formatters/codename:method"}}{{/crossLink}}
	 *
	 * 注意 このセルタイプのフォーマッタはcode:nameですが、エディタのラ
	 * ベルの表記が異なる場合があります。そのときはエディタの表記と合う
	 * ようにフォーマッタを設定してください。
	 *
	 * ###### `editorOptions.funcName` `{String}`
	 *
	 * オートコンプリートの種類を決定します。必ず文字列で指定してくださ
	 * い。候補一覧は、 `clutil.fieldDefs.autocomplete`から指定します。
	 * 指定できる名前は、`_.keys(clutil.fieldDefs.autocomplete)`で確認
	 * してください。
	 *
	 * ###### `editorOptions.dependAttrs` `{Object|Function}`
	 *
	 * サーバ問い合わせに必要なパラメータです。`clutil['cl' +
	 * editorOPtions.funcName]`のドキュメントを参照してください。
	 *
	 * ###### `editorOptions`
	 *  {{#crossLink "ClGrid.EditorTypes/clajaxac:method"}}{{/crossLink}} の
	 * `editorOptions`を参照してください。
	 *
	 * ###### 例 組織階層のオートコンプリート
	 *
	 * ```js
	 * cellType: {
	 *   type: "clajaxac"
	 *   editorOptions: {
	 *     funcName: "orglevel",
	 *     dependAttrs: function(item){
	 *       // itemは行データオブジェクトです。
	 *       return {
	 *         orgfunc_id: item.duration.id
	 *       };
	 *     }
	 *   }
	 * }
	 * ```
	 * ### clajaxselector
	 *
	 * プルダウン。
	 *
	 * - エディタ {{#crossLink "ClGrid.EditorTypes/clajaxselector:method"}}{{/crossLink}}
	 * - フォーマッタ {{#crossLink "ClGrid.Formatters/codename:method"}}{{/crossLink}}
	 *
	 * グリッドで`clutil.fieldDefs.selector`で定義されているプルダウン
	 * 部品を利用可能にします。これらはサーバに選択項目の問い合わせを行
	 * い、それが一覧として表示されます。
	 *
	 * 注意 このセルタイプのフォーマッタはcode:nameですが、エディタのラ
	 * ベルの表記が異なる場合があります。そのときはエディタの表記と合う
	 * ようにフォーマッタを設定してください。
	 *
	 * ###### `editorOptions.funcName` `{String}`
	 *
	 * プルダウンの種類を決定します。必ず文字列で指定してください。候補
	 * 一覧は、 `clutil.fieldDefs.selector`から指定します。指定でき
	 * る名前は、`_.keys(clutil.fieldDefs.selector)`で確認してくだ
	 * さい。
	 *
	 * ###### `editorOptions.dependAttrs` `{Object|Function}`
	 *
	 * サーバ問い合わせに必要なパラメータです。`clutil['cl' +
	 * editorOPtions.funcName]`のドキュメントを参照してください。
	 *
	 * ###### `editorOptions`
	 *  {{#crossLink "ClGrid.EditorTypes/clajaxselector:method"}}{{/crossLink}} の
	 * `editorOptions`を参照してください。
	 *
	 * ###### 例 事業ユニットのプルダウン
	 *
	 * ```js
	 * cellType: {
	 *   type: "clajaxselector"
	 *   editorOptions: {
	 *     funcName: "busunit",
	 *   }
	 * }
	 * ```
	 *
	 * ### `cltypeselector` 区分セレクター
	 *
	 * - エディタ {{#crossLink "ClGrid.EditorTypes/cltypeselector:method"}}{{/crossLink}}
	 * - フォーマッタ {{#crossLink "ClGrid.Formatters/cltypeselector:method"}}{{/crossLink}}
	 *
	 * ###### `editorOptions`
	 *  {{#crossLink "ClGrid.EditorTypes/cltypeselector:method"}}{{/crossLink}} の
	 * `editorOptions`を参照してください。
	 *
	 * ###### 注意
	 *
	 * `editorOptions.nameOnly`を`true`にしてもフォーマッタは従ってくれ
	 * ないのでその場合は`formmatter`に`name`を指定してください(下の例
	 * 参照)。
	 *
	 * ###### 例 区分セレクター
	 * ```js
	 * cellType: {
	 *   type: "cltypeselector"
	 *   editorOptions: {
	 *     kind: amcm_type.AMCM_TYPE_SLIP
	 *     nameOnly: true
	 *   },
	 *   formmatter: 'name'
	 * }
	 * ```
	 *
	 * ### `selector`
	 *
	 * 選択項目一覧を指定するタイプのプルダウン。
	 *
	 * - エディタ {{#crossLink "ClGrid.EditorTypes/selector:method"}}{{/crossLink}}
	 * - フォーマッタ {{#crossLink "ClGrid.Formatters/codename:method"}}{{/crossLink}}
	 *
	 * ###### `editorOptions`
	 *  {{#crossLink "ClGrid.EditorTypes/selector:method"}}{{/crossLink}} の
	 * `editorOptions`を参照してください。
	 *
	 * ###### 例
	 *
	 * ```js
	 * cellType: {
	 *   type: "selector"
	 *   editorOptions: {
	 *     items: [{id: 1, label: "項目1"}, {id: 2, label: "項目2"}]
	 *   }
	 * }
	 * ```
	 *
	 * ### `asyncselector`
	 *
	 * 選択項目一覧を非同期で指定するタイプのプルダウン。
	 *
	 * - エディタ {{#crossLink "ClGrid.EditorTypes/asyncselector:method"}}{{/crossLink}}
	 * - フォーマッタ {{#crossLink "ClGrid.Formatters/codename:method"}}{{/crossLink}}
	 *
	 * ###### `editorOptions`
	 *  {{#crossLink "ClGrid.EditorTypes/asyncselector:method"}}{{/crossLink}} の
	 * `editorOptions`を参照してください。
	 *
	 * ### `date` 日付け
	 *
	 * 日付け入力と日付けのフォーマッタ
	 *
	 * - エディタ {{#crossLink "ClGrid.EditorTypes/date:method"}}{{/crossLink}}
	 * - フォーマッタ {{#crossLink "ClGrid.Formatters/date:method"}}{{/crossLink}}
	 *
	 * ### `checkbox` チェックボックス
	 *
	 * - エディタ なし
	 * - フォーマッタ {{#crossLink "ClGrid.Formatters/checkbox:method"}}{{/crossLink}}
	 *
	 * ### `lineno` 行番号
	 *
	 * 行番号のセルを提供します。
	 *
	 * - エディタ なし
	 * - フォーマッタ {{#crossLink "ClGrid.Formatters/lineno:method"}}{{/crossLink}}
	 *
	 * ### `dellrow` 削除ボタン
	 *
	 * 削除ボタンのセルを提供します。
	 *
	 * - エディタ なし
	 * - フォーマッタ {{#crossLink "ClGrid.Formatters/dellrow:method"}}{{/crossLink}}
	 *
	 * ### `columnexpander` エキスパンダー
	 *
	 * [▼] OPEN、[＞] CLOSE ボタンつきフォーマッタのセルを提供します。
	 * カラム(ヘッダ部)での使用が前提です。
	 *
	 * - エディタ なし
	 * - フォーマッタ {{#crossLink "ClGrid.Formatters/columnexpander:method"}}{{/crossLink}}
	 * # セルタイプ定義
	 *
	 * ## `type` `{String}`
	 * ## `[editorType]` `{String|Function}`
	 * ## `[formatter]` `{String|Function}`
	 * ## `columnDefaults` `{Object}`
	 * ## `[defaultsEditorOptions]` `{Object}`
	 * テキストのdefaultsEditorOptionsをみよ
	 *
	 * @class ClGrid.CellTypes
	 */

	// テキスト
	CellTypeStorage.addCellType({
		type: "text",
		editorType: "text",
		columnDefaults: {
			minWidth: 100
		}
	});

	// チェックボックス
	CellTypeStorage.addCellType({
		type: "checkbox",
		formatter: "checkbox",
		columnDefaults: {
			minWidth: 40
		}
	});

	// ラジオ
	CellTypeStorage.addCellType({
		type: "radio",
		editorType: "radio",
		columnDefaults: {
			minWidth: 40
		}
	});

	// オートコンプリート
	CellTypeStorage.addCellType({
		type: 'clajaxac',
		editorType: 'clajaxac',
		formatter: 'codename',
		columnDefaults: {
			minWidth: 180
		}
	});

	// プルダウン(AJAX)
	CellTypeStorage.addCellType({
		type: 'clajaxselector',
		editorType: 'clajaxselector',
		formatter: 'codename',
		decorator: 'selectpicker',
		columnDefaults: {
		}
	});

	// 区分プルダウン
	CellTypeStorage.addCellType({
		type: 'cltypeselector',
		editorType: 'cltypeselector',
		formatter: 'cltypeselector',
		decorator: 'selectpicker',
		columnDefaults: {
			minWidth: 180
		}
	});

	// プルダウン
	CellTypeStorage.addCellType({
		type: 'selector',
		editorType: 'selector',
		formatter: 'codename',
		decorator: 'selectpicker',
		columnDefaults: {
			minWidth: 100
		}
	});

	// プルダウン(非同期)
	CellTypeStorage.addCellType({
		type: 'asyncselector',
		editorType: 'asyncselector',
		formatter: 'codename',
		decorator: 'selectpicker',
		columnDefaults: {
			minWidth: 100
		}
	});

	// プルダウン(非同期)
	CellTypeStorage.addCellType({
		type: 'asynccodenameselector',
		editorType: 'asynccodenameselector',
		formatter: 'codename',
		decorator: 'selectpicker',
		columnDefaults: {
			minWidth: 100
		}
	});

	// プルダウン(コードネーム)
	CellTypeStorage.addCellType({
		type: 'codenameselector',
		editorType: 'codenameselector',
		formatter: 'codename',
		decorator: 'selectpicker',
		columnDefaults: {
			minWidth: 100
		}
	});

	// 日付け
	CellTypeStorage.addCellType({
		type: "date",
		editorType: 'date',
		formatter: "date",
		columnDefaults: {
			minWidth: 180
		}
	});

	// 行番号
	CellTypeStorage.addCellType({
		type: 'lineno',
		formatter: 'lineno',
		columnDefaults: {
			minWidth: 60
		}
	});

	// 行削除ボタン
	CellTypeStorage.addCellType({
		type: 'dellrow',
		formatter: 'dellrow',
		columnDefaults: {
			minWidth: 40
		}
	});

	// [▼] OPEN、[＞] CLOSE  ボタンつきフォーマッタ（カラム専用）
	CellTypeStorage.addCellType({
		type: 'columnexpander',
		formatter: 'columnexpander',
		columnDefaults: {
		}
	});

}(ClGrid));

/**
 * @module ClGrid
 * 
 */
(function(ClGrid, document){
	var gotoFirstCell = function(gridView) {
		var grid = gridView.grid, handled;
		if (!grid){
			return;
		}
		for (var i=0, l=grid.getDataLength(); i<l; i++) {
			for (var j=0, jl=grid.getColumns().length; j<jl; j++) {
				if (grid.canCellBeActive(i,j)) {
					grid.gotoCell(i, j);
					return;
				}
			}
		}
	};
	ClGrid.gotoFirstCell = gotoFirstCell;
	
	var navigate = function(gridView, dir) {
		var grid = gridView.grid, handled;
		if (!grid){
			return false;
		}
		
		if (dir === 'prev') {
			handled = grid.navigatePrev();
			if (!handled) {
				gridView.stopEditing();
				clutil.focus(gridView.$el.find('>div>[hidefocus]:eq(0)'), -1);
			}
		}else{
			handled = grid.navigateNext();
			if (!handled) {
				gridView.stopEditing();
				clutil.focus(gridView.$el.find('>div>[hidefocus]:eq(1)'), 1);
			}
		}
		console.log('#### navigate', dir, handled);
		return true;
	};

	/**
	 * エディタの完了を待つ
	 */
	var EditCompleteCommand = function(options) {
		this.options = options;
		this.gridView = options.gridView;
		_.bindAll(this, 'onComplete');
		this.onComplete = _.once(this.onComplete);
		this.setEvents();
	};

	_.extend(EditCompleteCommand.prototype, Backbone.Events, {
		onComplete: function(){
			console.log('#### EditCompleteCommand#onComplete');
			this.trigger('complete', this.options);
			this.unsetEvents();
		},
		
		setEvents: function(){
			this.gridView.grid.onValidationError.subscribe(this.onComplete);
			this.gridView.on('cell:change:after', this.onComplete);
		},

		cancel: function(){
			this.unsetEvents();
		},

		unsetEvents: function(){
			this.gridView.grid.onValidationError.unsubscribe(this.onComplete);
			this.gridView.off('cell:change:after', this.onComplete);
			this.off();
		}
	});

	/**
	 * Gridに関するDOMイベント監視
	 * 
	 * @class GridEvHandler
	 * @namespace ClGrid
	 * @static
	 * 
	 */
	var GridEvHandler = {
		/**
		 * DOMイベントの監視を開始する
		 * 
		 * @method start
		 */
		start: function(){
			_.bindAll(this, 'handleClick', '_handleKeyDown', 'handleKeyDown',
					  'stopEditing', 'onScroll', 'onCommitEdit',
					 'handleClickWorld', 'waitAndHandleClick');
			this.gridViews = {};
			$(document)
				.on(
					"click",
					"[data-grid-cid] .grid-canvas",
					this.waitAndHandleClick)
				.on(
					"keydown",
					"[data-grid-cid] .grid-canvas",
					this.handleKeyDown)
				.on('click', this.handleClickWorld);

			this.listenTo(clutil.mediator, {
				'enterfocusmode:focus:defer:before': function(e){
					var gridView = this.getGridViewByEl(e.el);
					if (gridView){
						e.gridView = gridView;
					}
					console.log("#### enterfocusmode:focus:defer:before", !!gridView);
				},
				// グリッドの編集中のセルから次のセルにフォーカス移動す
				// るためにenterfocusmode:focus:beforeイベントでイベン
				// ト発行元がグリッド内である場合にはe.stop()を呼んでエ
				// ンターフォーカスモードもしくはclutil.focus2()での
				// フォーカス移動を阻止する。代わりに
				// grid.navigateNext()を呼んで次のセルに移動する。
				'enterfocusmode:focus:before': function(e){
					e._target = e.el;
					var gridView = this.getGridViewByEl(e.el);
					var $el = $(e.el);
					if (!gridView &&
						this._lastCommitGrid &&
						($el.closest('.clgrid-editor-select').length ||
						 $el.closest('.clgrid-editor').length)){
						// グリッドのセレクターで変なところへのフォーカスをを防ぐ
						gridView = this.getGridViewByEl(this._lastCommitGrid.getViewportNode());
					}
					if (!gridView && !$el.closest('html').length) {
						// エレメントがhtmlにない場合は既にエディタが破
						// 棄されているとみなしてactiveCell
						gridView = e.gridView;
					}
					if (!gridView) {
						gridView = this.getGridViewByEl(e.nextTarget);
						if (gridView) {
							e.stop();
							gotoFirstCell(gridView);
							return;
						}
						e._target = e.nextTarget;
					}
					console.log("#### enterfocusmode:focus:before", e.originalEvent.which, !!gridView, e.el, e._target, e.nextTarget);
					if (gridView){
						e.stop();
						var orig = e.originalEvent;
						var events = _.pick(
							orig, 'which', 'shiftKey', 'altKey',
							'ctrlKey', 'stopPropagation', 'preventDefault');
						events.target = e._target;
						events.isImmediatePropagationStopped = function(){return false};
						events.isPropagationStopped = function(){return false};
						this._handleKeyDown(gridView, events);
					}
				}
			});
		},

		/**
		 * 全てのClGridViewインスタンス
		 * 
		 * @property gridViews
		 * @type Array
		 */
		
		/**
		 * ClGridViewインスタンスを監視対象に追加する
		 * @method addGrid
		 * @param {ClGridView} gridView
		 */
		addGrid: function(gridView){
			this.gridViews[gridView.cid] = gridView;
			gridView.grid.clDataGridCid = gridView.cid;
			var componentsId = 'cl_datagrid_components_' + gridView.cid;
			gridView.grid.clDataGridComponentsSelector = '#' + componentsId;
			gridView.$('.cl_datagrid_components').attr('id', componentsId);
			var that = this;
			gridView.grid.onBeforeDestroy.subscribe(function(){
				// destroy時にremoveする
				that.removeGridView(gridView);
			});
			gridView.grid.onScroll.subscribe(this.onScroll);
			gridView.grid.onCommitEdit.subscribe(this.onCommitEdit);
			this.setupGridEvents(gridView, gridView.grid);
			// gridViewのエレメントに属性を付ける
			gridView.$el.attr('data-grid-cid', gridView.cid);
			var grid = gridView.grid;
			// canvasに当てられてるキーダウンのハンドラを我々のものにする
			var canvas = grid.getCanvases();
			canvas.unbind("keydown").unbind('click');
			var autoToolTip = gridView.options.autoToolTip;
			if(autoToolTip){
				gridView.$el
					.tooltip('destroy')
					.tooltip({
						animation: false,
						selector: '.slick-cell',
						title: function(){
							var title, $el = $(this);
							// エラーメッセージを優先する
							title = $(this).attr('data-cl-errmsg');
							if(title){
								return title;
							}
							if(autoToolTip && _.isFunction(autoToolTip.title)){
								title = autoToolTip.title(this);
							}
							if(title){
								return title;
							}else if(title === false){
								return;
							}
								
							if($el.hasClass('input')) {
								return;
							}
							
							if(ClGrid.isEllipsisActive(this)){
								$el.addClass('hasEllipsis');
								return $el.text();
							}else{
								$el.removeClass('hasEllipsis');
							}
						},
						container: 'body'
					});
			}
		},

		setupGridEvents: function(gridView, grid){
			// エディット前
			// `before:edit:cell` (args)
			// args: dataGrid, item, cell, row
			gridView.grid.onBeforeEditCell.subscribe(function(e, args){
				gridView.trigger('before:edit:cell',
								 _.extend({dataGrid: gridView}, args));
			});
			// `active:cell:changed` (args)
			// args: dataGrid, item, cell, row
			gridView.grid.onActiveCellChanged.subscribe(function(e, args){
				var data = {
						item: null,
						dataGrid: gridView
					};
				if(args.row != null){
					data.item = grid.getDataItem(args.row);
				}
				_.extend(data, args);
				gridView.trigger('active:cell:changed', data);
			});
		},
		
		/**
		 * CLGridViewインスタンスを監視対象から外す
		 * @method removeGridView
		 * @param {ClGridView} gridView
		 */
		removeGridView: function(gridView){
			gridView.$el.removeAttr('data-grid-cid');
			delete this.gridViews[gridView.cid];
		},

		/**
		 * DOMイベントからClGridViewインスタンスを取得する
		 * @method getGridViewByEvent
		 * @param e DomEvent
		 * @return {ClGridView}
		 */
		getGridViewByEvent: function(e){
			return this.getGridViewByEl(e.target);
		},

		/**
		 * DomイベントからSlickGridインスタンスを取得する
		 * 
		 * @method getGridByEvent
		 * @param e DomEvent
		 * @return {SlickGrid}
		 */
		getGridByEvent: function(e){
			var gridView = this.getGridViewByEvent(e);
			return gridView && gridView.grid;
		},

		getGridViewByEl: function(el){
			var $el = $(el).closest('[data-grid-cid]'),
				cid = $el.attr('data-grid-cid'),
				gridView = this.gridViews[cid];
			return gridView;
		},
		
		/**
		 * クリックイベントをハンドルする
		 * @param e DomEvent
		 * @private
		 */
		handleClick: function(e){
			var $el = $(e.target);
			console.log('#### handleClick');
			if ($el.is('.slick-cell.input.editable.active *')) {
				return;
			}
			var grid = this.getGridByEvent(e);
			console.log("handleClick", grid);
			if (grid){
				grid.editorContext = {
					type: 'click',
					target: e.target
				};
				grid.handleClick(e);
				grid.editorContext = null;
				e.stopPropagation();
				e.stopImmediatePropagation();
			}
        },

		_handleClick: function(e, gridView, cell){
			var grid = gridView.grid,
				activeCell = grid.getActiveCell(),
				aRow = activeCell && activeCell.row,
				aCell = activeCell && activeCell.cell,
				currentEditor = grid.getCellEditor();

			console.log('#### _handleClick 0001');
			grid.editorContext = {
				type: 'click',
				target: e.target
			};

            this.triggerGrid(grid.onClick, {
				grid: grid,
                row: cell.row,
                cell: cell.cell
            }, e);

			gridView.trigger('click:cell', {
				target: e.target
			}, {
				grid: grid,
				row: cell.row,
				cell: cell.cell
			});
			
			gridView.trigger('cell:click', {
				target: e.target,
				grid: grid,
				row: cell.row,
				cell: cell.cell,
				item: grid.getDataItem(cell.row)
			});
			
            if ((currentEditor == null || aCell != cell.cell || aRow != cell.row) && grid.canCellBeActive(cell.row, cell.cell)) {
                if (!grid.getEditorLock().isActive() || grid.getEditorLock().commitCurrentEdit()) {
					// FrozenRowsが有効でない場合にもautoEditを有効にするため
					console.log('XXXX handleClick', cell.row, cell.cell);
					grid.scrollRowIntoView(cell.row, false);
                    grid.setActiveCellInternal(grid.getCellNode(cell.row, cell.cell));
                }
            } else if (grid.getEditorLock().isActive()) {
				// suri: canCellBeActiveでなくてもエディットを終了する
				console.log('XXXX handleClick a');
				grid.getEditorLock().commitCurrentEdit();
			}

			// grid.handleClick(e);
			grid.editorContext = null;
		},
		
		waitAndHandleClick: function(e){
			console.log('#### waitAndHandleClick',
						e.isDefaultPrevented(),
						e.isImmediatePropagationStopped(),
						e.isPropagationStopped());
			var $el = $(e.target);
			if ($el.is('.slick-cell.input.editable.active *')) {
				return;
			}
			
			var gridView = this.getGridViewByEvent(e),
				grid = gridView && gridView.grid;
			if (!grid) {
				return;
			}

			var cell = grid.getCellFromEvent(e),
				activeCell = grid.getActiveCell(),
				aRow = activeCell && activeCell.row,
				aCell = activeCell && activeCell.cell,
				currentEditor = grid.getCellEditor();
			
            if (!cell ||
				(currentEditor !== null &&
				 aRow == cell.row &&
				 aCell == cell.cell)) {
                return;
            }

			console.log('XXXX waitAndHandleClick 01');
			if (this.clickCommand){
				this.clickCommand.cancel();
			}
			e.alreadyHandled = true;
			if (currentEditor && currentEditor.isValueChanged()){
				console.log('XXXX', 0);
				this.clickCommand = new EditCompleteCommand({
					currentEditor: currentEditor,
					gridView: gridView
				});
				this.clickCommand.once('complete', function(){
					console.log('XXXX waitAndHandleClick 02');
					this._handleClick(e, gridView, cell);
					this.clickCommand = null;
				}, this);
				grid.getEditorLock().commitCurrentEdit();
			}else{
				console.log('XXXX waitAndHandleClick 03');
				
				this._handleClick(e, gridView, cell);
			}
			e.stopPropagation();
			e.stopImmediatePropagation();
		},
		
		/**
		 * SlicKGridインスタンスにイベントをトリガーする
		 * @method trigger
		 * @private
		 */
        triggerGrid: function(evt, args, e) {
            e = e || new Slick.EventData();
            args = args || {};
            return evt.notify(args, e, args.grid);
        },

		setEditCompleteCommand: function(options){
			if (options.gridView.grid && options.gridView.grid.getCellEditor()){
				this.editCompleteCommand = new EditCompleteCommand(options);
				this.editCompleteCommand.once('complete', function(){
					options.gridView.trigger('keydown:cell', {
						grid: options.grid,
						row: options.row,
						cell: options.cell
					}, options.e);
					navigate(options.gridView, options.dir);
					this.editCompleteCommand = null;
				}, this);
				options.gridView.grid.getEditorLock().commitCurrentEdit();
			}
			return true;
		},
		
		cancelEditCompleteCommand: function(){
			if (this.editCompleteCommand) {
				this.editCompleteCommand.cancel();
				this.editCompleteCommand = null;
			}
		},

		_handleKeyDown: function(gridView, e){
			var grid = gridView && gridView.grid;
			console.log("#### handleKeyDown", e.which, !!grid);
			
			if (!grid) return;
			
			var options = grid.getOptions(),
				currentEditor = grid.getCellEditor(),
				activeCell = grid.getActiveCell(),
				dir,
				activeRow = activeCell && activeCell.row,
				aCell = activeCell && activeCell.cell;

			this.cancelEditCompleteCommand();
			
            this.triggerGrid(grid.onKeyDown, {
				grid: grid,
                row: activeRow,
                cell: activeCell
            }, e);
			
            var handled = e.isImmediatePropagationStopped();

            if (!handled) {
                if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
					// ESC
                    if (e.which == 27) {
                        if (!grid.getEditorLock().isActive()) {
                            return; // no editing mode to cancel, allow bubbling and default processing (exit without cancelling the event)
                        }
                        this.cancelEditAndSetFocus();
                    } else if (e.which == 9) {
                        dir = 'next';
                    } else if (e.which == 13) {
                        dir = 'next';
                    }
                } else if ((e.which == 9 || e.which == 13)  && e.shiftKey && !e.ctrlKey && !e.altKey) {
                    dir = 'prev';
                }
            }

			console.log('#### handleKeydown handled', handled, 'dir', dir);
			if (dir) {
				if (currentEditor && currentEditor.isValueChanged()) {
					console.log('#### handleKeydown changed');
					handled = this.setEditCompleteCommand({
						dir: dir,
						currentEditor: currentEditor,
						gridView: gridView,
						grid: grid,
						row: activeRow,
						cell: aCell,
						e: e
					});
				} else {
					console.log('#### handleKeydown !changed');
					gridView.trigger('keydown:cell', {
						grid: grid,
						row: activeRow,
						cell: aCell
					}, e);
					handled = navigate(gridView, dir);
				}
			}
			
            if (handled) {
                // the event has been handled so don't let parent element (bubbling/propagation) or browser (default) handle it
                e.stopPropagation();
                e.preventDefault();
                try {
                    e.originalEvent.keyCode = 0; // prevent default behaviour for special keys in IE browsers (F3, F5, etc.)
                }
                // ignore exceptions - setting the original event's keycode throws
                // access denied exception for "Ctrl" (hitting control key only, nothing else), "Shift" (maybe others)
                catch (error) {
                }
            }
		},
		
		/**
		 * keydownイベントをハンドルする
		 * @method handleKeyDown
		 * @private
		 */
		handleKeyDown: function(e){
			var gridView = this.getGridViewByEvent(e);
			this._handleKeyDown(gridView, e);
		},

		/**
		 * クリックを処理する
		 * @method handleClickWorld
		 * @private
		 * @param e DomEvent
		 */
		handleClickWorld: function(e){
			console.log('#### handleClickWorld', e.isDefaultPrevented(),
						e.isImmediatePropagationStopped(),
						e.isPropagationStopped());
			if (e.alreadyHandled) return;

			var $target = $(e.target);
			if (!$target.closest('html').length ||
				$target.closest('.cl_datagrid_components').length){
				return;
			}
			var gridView = this.getGridViewByEvent(e);
			if (!gridView){
				this.stopEditing();
			}else if(!$(e.target).closest('.slick-row').length){
				this.stopEditing();
			}
		},
		
		/**
		 * インスタンスグリッド以外がクリックされた場合にエディットをコミットする
		 * @method stopEditing
		 */
		stopEditing: function(){
			_.each(this.gridViews, function(gridView){
				gridView.stopEditing();
			});
		},

		/**
		 * スクロール時にエディットをコミットする
		 */
		onScroll: function(){
			// ここには、TAB遷移時のfocusによるscrollも発生するので、以下は不可
			// this.stopEditing();
			clutil.mediator.trigger('grid:scroll');
		},

		onCommitEdit: function(e, args){
			this._lastCommitGrid = args.grid;
		}
	};

	_.extend(GridEvHandler, Backbone.Events);
	
	GridEvHandler.start();
	
	ClGrid.GridEvHandler = GridEvHandler;
}(ClGrid, window.document));

/**
 * @module ClGrid
 *
 */
// ------------------------------------------------------------------
// アプリ層で利用するデータグリッドViewクラス
// ページャ・・・・・・・・・・・・対応予定なし。
// ソート・・・・・・・・・・・・・対応予定なし。
// FrozenRows/Columns・・・・・・・やる。
// カラムヘッダのグループ化・・・・固定行の領域でやる。
// カラムヘッダグループ折り畳み・・やる。
// 行番号・・・・・・・・・・・・・オプションでサポートする。（アプリが行番プロパティを気にしないように）
// 行削除［×］・・・・・・・・・・オプションでサポートする。
// 行追加・・・・・・・・・・・・・オプションでサポートする。
// 行クリックイベントDelegate・・・サポートする。
(function(ClGrid){
	var CellTypeStorage = ClGrid.CellTypeStorage;
	var EditorTypes = ClGrid.EditorTypes;

	// ID プロパティ
	var altIdProperty = '_cl_gridRowId';
	function newIdPropertyValue(){
		var newRowId = _.uniqueId(altIdProperty);
		return newRowId;
	}
	var defaultRowHeight = 40;

	/**
	 * 初期構築内部関数：ヘッダ部の行データを生成する。
	 */
	function __buildHeaderRows(columns, colhdMetadatas, coldefIdMap, idProperty){
		var rows = [];

		// 行IDカウンタ
		var rowIdSeed = 0;

		// カラムグループ行のデータ化
		if(_.isArray(colhdMetadatas)){
			for(var i = 0; i < colhdMetadatas.length; i++){
				var meta = colhdMetadatas[i];
				if(!meta || _.isEmpty(meta.columns)){
					continue;
				}
				var row = {};
				for(var key in meta.columns){
					// key はカラムIDであることを想定。
					var colDef = coldefIdMap[key];
					if(!colDef){
						continue;
					}
					var labelText = meta.columns[key].name;
					row[colDef.field] = labelText;
				}
				if(!_.isEmpty(row)){
					row[idProperty] = 'rhd_' + (++rowIdSeed);
					rows.push(row);
				}
			}
		}

		// 最下段の行データ化
		var row = function(columns){
			var row = {};
			for(var i = 0; i < columns.length; i++){
				var col = columns[i];
				var labelName = (col._labelName == null) ? col.name : col._labelName;
				if(col._clspecial){
					// 行番号、削除ボタンの列
					if(_.has(col, 'field')){
						row[col.field] = labelName;
					}
				}else{
					row[col.field] = labelName;
				}

				// カラム幅調整ハンドラの設定（実体は本物カラム）
				col._labelName = labelName;
				col.resizable = (col.resizable === true);
				col.name = col.resizable ? '--' : '';
			}
			row[idProperty] = 'rhd_' + (++rowIdSeed);
			return row;
		}(columns);
		rows.push(row);

		return rows;
	}

	/**
	 * カラム定義で明示的に幅可変宣言しているものがあるか検査する。
	 * @return {boolean} true:幅可変なカラムが存在する、false:全列幅変更不可
	 */
	function __hasResizableColumn(columns){
		if(_.isArray(columns)){
			for(var i = 0; i < columns.length; i++){
				var col = columns[i];
				if(col == null){
					continue;
				}
				if(col.resizable === true){
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 初期構築内部関数：メタデータを作る。
	 * @return {
	 * 	head: [<ヘッダ部0行目のメタデータ>, <ヘッダ部1行目のメタデータ>, ...],
	 * 	body: [<ボディ部0行目のメタデータ>, <ボディ部1行目のメタデータ>, ...]
	 * }
	 */
	function __buildMetaDatas(colhdMetadatas, headerItems, colIds, coldefIdMap, bodyMetadatas, bodyRowCount, rowDelToggle){
		var m = {
			head: colhdMetadatas || [],
			body: bodyMetadatas || []
		};

		// カラムヘッダ行のメタデータ補完。 -- カラムヘッダ色定義な cssClasses を追加する。
		// (1) 既存メタデータに対して。
		for(var i = 0; i < Math.min(m.head.length, headerItems.length); i++){
			var meta = m.head[i];
			if(_.isEmpty(meta)){
				meta = {};
				m.head[i] = meta;
			}
			if(_.isEmpty(meta.cssClasses)){
				meta.cssClasses = 'cl-colhead';
			}else{
				var clzz = meta.cssClasses;
				if(!/cl-colhead\b/.test(clzz)){
					meta.cssClasses = 'cl-colhead ' + clzz;
				}
			}
		}
		// (2) カラムヘッダ定義が足りない場合の要素補充。
		while(m.head.length < headerItems.length){
			m.head.push({
				cssClasses: 'cl-colhead'
			});
		}
		// カラムグループ折り畳みオプション
		for(var rowIdx = 0; rowIdx < m.head.length; rowIdx++){
			var meta = m.head[rowIdx];
			if(_.isEmpty(meta.columns)){
				continue;
			}
			for(var colIdx = 0; colIdx < colIds.length; colIdx++){
				var colId = colIds[colIdx];
				var cellMeta = meta.columns[colId];
				if(!cellMeta){
					continue;
				}
				if(cellMeta.colspan > 1 && cellMeta.expander){
					// カラムグループ定義されている！
					var groupIds = colIds.slice(colIdx, (colIdx + cellMeta.colspan));
					if(_.isEmpty(groupIds) || groupIds.length <= 1){
						// colspan が2個以上指定されているが、折り畳みできるカラムが無い
						// 折り畳みＵＩを表示しないようにする。
						cellMeta.expander = false;
						continue;
					}else{
						cellMeta.expander = {
							opened: true,
							colgroups: _.map(groupIds, function(colId){ return coldefIdMap[colId]; })
						};
					}
					// フォーマッタ「Formatters.columnexpander」を関連付ける。
					// colDef.headCellType(column, row) 関数との紐づけは 12 行先の for ループでやる。
					var colDef = coldefIdMap[colId];
					var headCellTypeMap = colDef._headCellTypeMap;
					if(!headCellTypeMap){
						headCellTypeMap = {};
						colDef._headCellTypeMap = headCellTypeMap;
					}
					headCellTypeMap[rowIdx] = { type: "columnexpander" };
				}
			}

		}
		// coldefIdMap[key] に対する headCellType 関数を、headCellTypeMap から取れるように、
		// colDef.headCellType(column, row) 関数を入れ替える。
		for(var colId in coldefIdMap){
			var colDef = coldefIdMap[colId];
			if(colDef._headCellTypeMap){
				if(colDef.headCellType == null){
					colDef.headCellType = _.bind(function(column, row){
						return this._headCellTypeMap[row];
					}, colDef);
				}else if(_.isFunction(colDef.headCellType)){
					colDef._defaultHeadCellType = colDef.headCellType;
					colDef.headCellType = _.bind(function(column, row){
						var cellType = this._headCellTypeMap[row];
						if(!cellType){
							cellType = this._defaultHeadCellType(column, row);
						}
						return cellType;
					}, colDef);
				}else{
					var defaultHeadCellType = colDef.headCellType;
					colDef.headCellType = _.bind(function(column, row){
						var cellType = this._headCellTypeMap[row];
						if(!cellType){
							cellType = defaultHeadCellType;
						}
						return cellType;
					}, colDef);
				}
			}
		}

		// ボディ部のメタデータ補完。
		if(rowDelToggle){
			// 行削除はフラグトグルモードであることをメタデータ上に記述する。
			for(var i = 0; i < bodyRowCount; i++){
				var meta = m.body[i];
				if(_.isEmpty(meta)){
					meta = {
						rowDelToggle: true
					};
					m.body[i] = meta;
					continue;
				}
				// 呼び出し側でrowDelToggleを明示していなければ、デフォルト true にセット。
				if(!_.has(meta, 'rowDelToggle')){
					meta.rowDelToggle = true;
				}
			}
		}

//		// 配列に Getter メソッド拡張
//		m.head.get = _.bind(function(idx){
//			//console.log('head.get(' + idx + ')');
//			return this[idx];
//		},m.head);
//		m.body.get = _.bind(function(idx){
//			//console.log('body.get(' + idx + ')');
//			return this[idx];
//		},m.body);
		return m;
	}

	/**
	 * アプリ用のグリッドクラス
	 *
	 * # Events一覧
	 *
	 * ## "footer:addNewRow" (args)
	 * ［＋］ボタン押下イベントを通知する。
	 * ```js
	 * // Backbone.Eventsをmixinしています
	 * gridView.on("footer:addNewRow", function(args){
	 *    ...
	 * });
	 * ```
	 * - args.gridView ClGrid.ClAppGridView インスタンス
	 *
	 * ## "cell:change" (args)
	 * セルの設定値変更を通知する。
	 *
	 * ## 'cell:change:after' ()
	 *
	 * ## "grid:init:after" ()
	 * SlickGridインスタンス初期化後にトリガーされる。
	 * ※ SlickGridインスタンスはsetData()呼び出しで再作成されることがあるため、
	 * このイベントは複数回トリガーされる
	 *
	 * ## 'row:delToggle' (args)
	 *
	 * 行削除ボタンがトグルされたときに通知
	 *
	 * - args.isDeleted
	 * 削除対象かどうか
	 * - args.item
	 * 行データ
	 * - args.dataGrid
	 * データグリッドインスタンス
	 *
	 * ## 'rows:changed' (args)
	 *
	 * 内部SlickGridインスタンスのrows:changedイベントが通知されたときにトリガー
	 * する
	 *
	 * ## 'before:commit:edit'
	 * TODO
	 *
	 * ## 'after:commit:edit'
	 * TODO
	 *
	 * @class ClGrid.ClAppGridView
	 * @constructor
	 * @param {object} [options]
	 * @param {string} [options.el] グリッドViewを展開するところの div タグ要素
	 * @param {string} [options.idProperty]
	 * @param {boolean} [options.lineno]	行番号を表示する/しないフラグ。
	 * @param {boolean} [options.footerNewRowBtn]	テーブルフッター部の新規行追加ボタンを利用するかどうかフラグ。
	 * @param {boolean} [options.delRowBtn] 行削除ボタンを利用するかどうかフラグ。
	 * @param {boolean|object} [options.autoToolTip] trueの場合セルに納まらずに省略時にツールチップ表示
	 * @param {boolean} [options.suppressExtraMetadataUpdate=false] メタデータの計算を変更時のみに行う(experimental)
	 */
	ClGrid.ClAppGridView = Backbone.View.extend({
		template: _.template(''
			+ '<div class="cl_datagrid cl-no-header"></div>'
			+ '<div class="cl_datagrid_footer"><span class="btn-add"></span></div>'
			+ '<div class="cl_datagrid_components"></div>'
		),

		events: {
//			'click .cl_datagrid_footer .add:not(.disabled)'	: '_onAddNewRow'
			'click .cl_datagrid_footer'	: '_onAddNewRow'
		},
		_onAddNewRow: function(e){
			console.log('footer:addNewRow');
			this.trigger('footer:addNewRow', this);
		},

		idProperty: altIdProperty,

		/**
		 * 内部使用
		 */
		_currentCellErrors: [],

		initialize: function(opt){
			_.bindAll(this);
			opt || (opt = {});
			this.options = _.defaults(opt, {fitCanvasWidth: true});

			this.editorFactory = new ClGrid.EditorFactory();
			this.formatterFactory = new ClGrid.FormatterFactory(this);

			// ID属性名をユーザーが指定できるようにする
			if (opt.idProperty){
				this.idProperty = opt.idProperty;
			}

			// カラムグループの畳み込みイベント
			// 今のところ、イベントをアプリに挙げたりする予定はない。
			this.on('formatter:columnexpander:change', function(ev){
				var cellMeta = ev.cellMeta;
//				console.log('arguments: ', arguments);
//				console.log('cellMeta: ', cellMeta);
			});

			// Body部のスクロール調整がグリッド内部エディタから発したイベント
			// このイベント発信元が本インスタンス管理下のものである場合は、エディタを刈り取ってしまう。
			// なぜならば、ポップアップメニューを出すエディタは、ポップアップメニューの表示位置が大きく
			// ズレてしまうから。
			this.listenTo(clutil.mediator, 'mdbaseview:onscrolladjusting', _.bind(function($target){
				var $grid = $target.closest('.cl_datagrid');
				var targetCID = $grid.parent().attr('data-grid-cid');
				if(this.cid == targetCID){
					console.log('mdbaseview:onscrolladjusting: cid[' + this.cid + ']');
					_.defer(this.cancelEditing);
				}
			},this));

		},

		/**
		 * @method render
		 */
		render: function(){
			this.$el.html(this.template(this.options));

			this.$dataGrid = this.$('.cl_datagrid');//this.$el.children().first();
			this.$footer = this.$('.cl_datagrid_footer');

			if(!this.options.footerNewRowBtn){
				this.$footer.hide();
			}

//			if(_.isObject(arguments[0])){
//				this.setData(arguments[0]);
//			}

			// resize 監視 - コンテナサイズ変更で、グリッドサイズをコンテナにフィットさせるため。
			if(this.$el.data('exResize') == null){
				this.$el.exResize(_.debounce(_.bind(function(){
					if(this.options.fitCanvasWidth){
						this.fitCanvasWidth();
					}
				},this), 300));
			}

			return this;
		},
		// キャンバス幅をフィットさせる
		fitCanvasWidth: function(gridResizeCanvas){
			if(this.grid == null){
				return false;
			}
			// width fit やる。
			var dim = this.grid.getScrollbarDimensions({detail:true});
			var gridWidth = dim.canvas.width + dim.currentScrollbar.width;
			var thisWidth = this.$el.width();	// width: auto
			if(gridWidth > thisWidth){
				this.$dataGrid.css('width', 'auto');
				this.$footer.css('width', 'auto');
			}else{
				this.$dataGrid.width(gridWidth);
				this.$footer.width(gridWidth);
			}
			if(gridResizeCanvas !== false){
				this.grid.resizeCanvas();
			}
			return true;
		},

		/**
		 * メタデータ（ボディ部）
		 */
		getMetadata: function(rowIndex){
			// アプリが付加したい情報を返すようにオーバーラード。
		},

		/**
		 * メタデータ（ヘッダ部）
		 */
		getHeadMetadata: function(rowIndex){
			// アプリが付加したい情報を返すようにオーバーラード。
		},

		/**
		 * ボディ部メタデータを返す(内部)
		 *
		 * - 編集可能セルにのみフォーカス遷移するようにfocusableを設定する
		 */
		_getMetadata: function(bodyRow){
			var columns = this.grid.getColumns(),
				dataView = this.dataView,
				editorFactory = this.editorFactory,
				formatterFactory = this.formatterFactory,
				columnMetadata = {},
				metadata = {columns: columnMetadata},
				row = dataView.bodyIndexToIndex(bodyRow),
				gridEditable = this.grid.getOptions().editable,
				storedMetadata = this._getStoredMetadata(row, false);

			if (storedMetadata && storedMetadata.hasErrorInRow){
				metadata.cssClasses = 'errorFinderRow';
			}

			_.each(columns, function(column) {
				var editable = editorFactory.isEditable(column, row, dataView);
				var editablef = formatterFactory.isEditable(column, row, dataView);
				var cellMetadata = column.cellMetadata;
				if (_.isFunction(cellMetadata)){
					cellMetadata = cellMetadata({
						row: row,
						bodyRow: bodyRow,
						dataView: dataView,
						item: dataView.getBodyItem(bodyRow)
					});
				}
				columnMetadata[column.id] = _.extend({
					focusable: Boolean(editable),
					editable: editable && gridEditable,
					editablef: editablef && gridEditable
				}, cellMetadata);
			});
			return metadata;
		},

		_updateMetadata: function(rows){
			if(!this.options.suppressExtraMetadataUpdate){
				return;
			}
			var dataView = this.dataView;
			if(dataView){
				_.each(rows, function(row){
					var local = dataView.indexToLocal(row),
						curdata, newdata;
					if(dataView.isHeadRow(row)){
						// TODO
					}else{
						newdata = this._getMetadata(local);
					}

					curdata = this._getStoredMetadata(row, true);
					ClGrid.mergeMetadata(curdata, newdata);
				}, this);
			}
		},

		/**
		 * ボディ部メタデータを返す(内部)
		 *
		 * - 編集可能セルにのみフォーカス遷移するようにfocusableを設定する
		 */
		_getHeadMetadata: function(headIndex){
			var columns = this.grid.getColumns(),
				dataView = this.dataView,
				editorFactory = this.editorFactory,
				columnMetadata = {},
				metadata = {columns: columnMetadata},
				row = dataView.headIndexToIndex(headIndex);

			_.each(columns, function(column) {
				var editable = editorFactory.isEditable(column, row, dataView);
				columnMetadata[column.id] = {
					focusable: Boolean(editable)
				};
			});
			return metadata;
		},

		/**
		 * グリッドに表示するデータをセットする。
		 * @method setData
		 * @param args
		 * @param [args.columns]	カラム情報
		 * @param [args.colhdMetadatas]	カラムヘッダ部のメタデータ定義（カラムグループ定義など）・・・args.columns 指定時のみ有効
		 * @param [args.graph]			行内の依存関係グラフ・・・args.columns 指定時のみ有効
		 * @param [args.gridOptions]	SlickGrid オプション・・・gargs.columns 指定時のみ有効
		 * @param [args.data]			データ
//		 * @param [args.metadata]		メタデータ（ボディ部）
		 * @param [args.rowDelToggle]	行削除［×］クリックの振る舞いを指定。true:赤表示にして削除しない。false/未指定:行削除する。・・・args.data 指定時のみ有効
		 */
		setData: function(args){
			if(!args){
				throw 'Invalid arguments.';
			}

			if(_.isArray(args.columns)){
				// カラム構造が指定されてきた ⇒ カラム構造を再構築する。
				if(_.isEmpty(args.columns)){
					throw 'Invalid arguments, empty columns specified.';
				}
				// 全部破棄
				this.clear();

				// カラム構造を作り直す。
				// ↓ここで、this.grid, this.dataView のインスタンスを生成する。
				this._buildGrid(args.columns, args.colhdMetadatas, args.graph, args.gridOptions, args.data || [], args.rowDelToggle);
			}else{
				// カラム構造をキープしたままで、データを作る。
				this.clearData();

				// グリッドに表示するデータをセットする。
				if(_.isArray(args.data) && !_.isEmpty(args.data)){
					// この回にセットする行は削除フラグモード
					// メタデータを設定する。
					for(var i = 0; i < args.data.length; i++){
						// ボディ部メタデータ準備
						if(args.rowDelToggle){
							var meta = this.metadatas.body[i];
							if(meta == null){
								meta = {};
								this.metadatas.body[i] = meta;
							}
							meta.rowDelToggle = true;
						}

						// SlickGrid 管理の id を付与する。
						var aData = args.data[i];
						if (aData[this.idProperty] == null){
							aData[this.idProperty] = newIdPropertyValue();
						}
					}
					// dataView にデータをねじ込んで、レンダリングやる。
					this.dataView.beginUpdate();
					this.dataView.setBodyItems(args.data);
					this.dataView.endUpdate();
//					this.grid.invalidate();
					this.grid.render();
					if(this.options.fitCanvasWidth){
						this.fitCanvasWidth(false);
					}
					this.grid.resizeCanvas();
				}
			}
		},

		/**
		 * カラム定義を取得する。
		 */
		getColumns: function(){
			return this.grid ? this.grid.getColumns() : [];
		},

		/**
		 * カラムID に相当するカラム定義を取得する。
		 * @param {string|integer} columnId
		 */
		getColumnById: function(columnId){
			return (this.savedColumns) ? this.savedColumns.idMap[columnId] : undefined;
		},

		/**
		 * カラム定義を設定する。主に動的にカラムを増減する際に使用することを想定。
		 * @param {collection} columns カラム定義
		 * @param {collection} [colhdMetadatas] カラムヘッダ部のメタデータ定義
		 */
		setColumns: function(columns, colhdMetadatas){
			if(!this.grid){
				throw 'Invalid state: slick.grid instance is not ready.';
			}

			this._fixCellType(columns);
			// ---------------------------------------------
			// オプショナルな列を補完
			// 行番号列
			if(this.options.lineno){
				if(_.where(columns, {id: '_lineno'}).length === 0){
					columns.splice(0,0, {
						// 行番号列の定義
						id: '_lineno',
						name: 'No.',
						field: '_lineno',
						width: 60,
						cssClass: 'txtalign-center',
						cellType: {
							type: 'lineno'
						},
						// 以下、独自拡張フィールド
						_clspecial: true,
						_startNo: 1	// 行番号開始値
					});
				}

			}

			// 行削除ボタン列
			if(this.options.delRowBtn){
				if(_.where(columns, {id: '_dellrow'}).length === 0){
					columns.push({
						// 行削除ボタン列の定義
						id: '_dellrow',
						name: '',
						//field: '',
						width: 40,
						cellType: {
							type: 'dellrow'
						},
						cssClass: 'txtalign-right',
						// 以下、独自拡張フィールド
						_clspecial: true
					});
				}
			}

			// カラムID補完
			var colIds = [];
			var coldefIdMap = {};
			var fieldMap = {};
			for(var i = 0; i < columns.length; i++){
				var colDef = columns[i];
				var colId = null;
				if(_.has(colDef, 'id')){
					colId = colDef.id;
				}else{
					// アプリ側で予め ID 定義していない場合は、カラムインデックをカラムIDとでもしておくか・・・
					colId = i;
				}
				if(coldefIdMap[colId]){
					// すでに定義済 -- IDが重複している。
					throw 'カラムID重複';
				}
				colDef.id = colId;
				colIds.push(colId);
				coldefIdMap[colId] = colDef;
				if(!fieldMap[colDef.field]){
					fieldMap[colDef.field] = colDef;
				}

				// cellType からデフォルト適用
				if(colDef.cellType && !_.isFunction(colDef.cellType) && _.isString(colDef.cellType.type)){
					var cellTypeClass = ClGrid.CellTypeStorage.getCellType(colDef.cellType.type);
					if(cellTypeClass && cellTypeClass.columnDefaults){
						_.defaults(colDef, cellTypeClass.columnDefaults);
					}
				}
			}
			// 保存。（カラム折り畳みで、カラムを開くときに参照）
			this.savedColumns = {
				colIds: colIds,		// カラムIDキー（columnIndex 順序で整列）
				idMap: coldefIdMap,	// key:カラムID, value:columns[カラムID]値
				fieldMap: fieldMap	// key:field、value:columns[x]値。columns[x].fieldが重複する場合は最初に発見したもの。
			};

			// ---------------------------------------------
			// カラムヘッダ行となる固定行部分の行データを再構築。
			var newColhdMetadatas = this.metadatas.head;
			if(_.isArray(colhdMetadatas)){
				var x = 1;	// XXX TEST
				switch(x){
				case 1:
					newColhdMetadatas = _.deepExtend(this.metadatas.head, colhdMetadatas);
					break;
				default:
					newColhdMetadatas = colhdMetadatas;
				}
			}
			var headerItems = __buildHeaderRows(columns, newColhdMetadatas, coldefIdMap, this.idProperty);
			if(__hasResizableColumn(columns)){
				// カラム幅可変な列が存在する
				this.$dataGrid.removeClass('cl-no-header');
			}else{
				// 全カラム幅固定
				this.$dataGrid.addClass('cl-no-header');
			}

			// カラムセットを入れ替える。
			this.dataView.setHeadItems(headerItems);	// カラムヘッドデータ部のデータを入れ替える
			this.grid.setColumns(columns);				// カラム構成を再セットする。
		},

		// Slickgrid 独自拡張
		// - 現在描画しようとするセルを装飾するための css クラスを返す関数を仕込む。
		_cellCssDecorator: function(rowIndex, colIndex, colspan, colDef, rowData){
			var clzz = [];
			var attrs = null;

			// エディタブルなセルだったら、網掛け用の css クラスを返すように。
			if(this.grid.getOptions().editable &&
			   (this.editorFactory.isEditable(colDef, rowIndex, this.dataView) ||
				this.formatterFactory.isEditable(colDef, rowIndex, this.dataView))){
				clzz.push('input');
			}

			// セルメッセージ用 attrs をつくる。
			do{
				var meta = this.dataView.getItemMetadata(rowIndex);
				if(!meta || !meta.columns){
					// メタデータが無い
					break;
				}
				var cellMeta = meta.columns[colDef.id];
				if(!cellMeta){
					// セルのメタデータが無い
					break;
				}

				// アプリ個別指定のクラス
				if(cellMeta.cssClasses){
					clzz.push(cellMeta.cssClasses);
				}

				// セルメッセージ
				var msg = (cellMeta.srvMessage) ? cellMeta.srvMessage : cellMeta.cellMessage;
				if(!msg){
					// セルメッセージが無い
					break;
				}
				if(msg.level){
					switch(msg.level){
					case 'info':
						break;
					case 'alert':
					case 'warn':
						// スタイルのクラスを clzz に push する
						clzz.push('cl_warn_field');
						break;
					case 'error':
					default:
						// スタイルのクラスを clzz に push する
						clzz.push('cl_error_field');
					}
				}
				if(msg.message){
					attrs = {
						"data-cl-errmsg": msg.message
					};
				}
			}while(false);

			// 装飾指定のオブジェクトをつくって返す。
			var decorator = {};
			if(!_.isEmpty(clzz)){
				decorator.className = clzz.join(' ');
			}
			if(!_.isEmpty(attrs)){
				decorator.attributes = attrs;
			}
			return decorator;
		},

		// クリックイベント
		_onGridClicked: function(e, args){
//			console.log(arguments);

			var $target = $(e.target);
			var grid = args.grid;
			var dataView = grid.getData();

			var bodyRowIdx = args.row - dataView.getHeadLength();
			var isBodyAreaAction = (bodyRowIdx >= 0);

			var dataItem;

			// -----------------------------
			// 行削除ボタンのアクション処理
			if($target.hasClass('btn-delete')){
				if(!isBodyAreaAction){
					// ヘッダ部の［×］ボタンがクリック？
					e.stopImmediatePropagation();
					return;
				}

				dataItem = grid.getDataItem(args.row);
				var metaData = this._getStoredMetadata(args.row);
				if(metaData == null){
					metaData = {};
					this.metadatas.body[bodyRowIdx] = metaData;
				}

				if(metaData.rowDelToggle){
					// DB 応答から setData() で入れたデータを想定。
					// 行削除フラグをトグルして対象行を再描画する。
					if(metaData.cssClassesMap == null){
						metaData.cssClassesMap = {};
					}
					var delflag = (metaData.cssClassesMap.delflag === true);
					metaData.cssClassesMap.delflag = !delflag;
					metaData.cssClasses = _.reduce(metaData.cssClassesMap, function(keys, val, key, dto){
						if(val){
							keys.push(key);
						}
						return keys;
					}, []).join(' ');
//					console.log(metaData);

					e.stopImmediatePropagation();
					this.grid.invalidateRow(args.row);
					this.grid.render();
					this.trigger('row:delToggle', {
						isDeleted: metaData.cssClassesMap.delflag,
						item: dataItem,
						dataGrid: this
					});
				}else{
					// 新規追加のデータの場合→ 行削除する。
					// 行削除がフラグトグルモードの場合
					e.stopImmediatePropagation();
					if(this.deleteItemAt(bodyRowIdx)){
						// 更新対象行：削除した行移行全部が更新対象なので grid.invalidate() で一気に再描画。
//						this.grid.invalidate();
//						this.grid.updateRowCount();
						this.trigger('row:delToggle', {
							isDeleted: true,
							item: dataItem,
							dataGrid: this
						});
					}
				}
				return;
			}
		},

		/**
		 * グラフがリッスンするグリッドビューイベント
		 */
		graphGridViewEvents: {
			"grid:before:edit": function(item) {
				if (this.graph.syncing) {
					console.warn('#### graph is now syncing');
					return;
				}

				var flattened = clutil.nested.flatten(item);
				this.graph.clear();
				this.graph.set(flattened);
				this.graph.sync({
					silent : true
				});
			}
		},

		setupGraphEvents: function(){
			this.stopListening(this.dataView, this.graphGridViewEvents);
			this.listenTo(this.dataView, this.graphGridViewEvents);

			var graph = this.graph,
				dataView = this.dataView,
				view = this;
			this.grid.onCommitEdit.subscribe(function(e, args) {
				console.log('#### onCellChange(graph)');
				if (graph.syncing) {
					console.warn('#### graph is now syncing');
					return;
				}
				graph.syncing = true;
				var flattened = clutil.nested.flatten(args.item);
				graph.clear();
				graph.set(flattened);
				graph.sync({
					ev: {
						dataView: dataView,
						dataGrid: view,
						item: args.item,
						row: args.row,
						cell: args.cell
					}
				}).done(function(ev){
					var attrs = graph.model.toJSON();
					var item = clutil.nested.unflatten(attrs);
					console.log("graph.sync() done!", ev, item);
					// 行データをデータビューと同期する
					ev.dataView.updateItem(item);
					graph.syncing = false;
					ev.dataGrid.onCommitEdit(
						_.extend({}, args, {item: item}));
				}).fail(function() {
					console.warn("graph.sync() error!");
					graph.syncing = false;
				});
			});
		},

		onCommitEdit: function(args){
			this.trigger('before:commit:edit', args);

			// アプリがセルの変更を検知して何かするため
			// のイベントを投げる。このイベントの中では、
			// 行データがdataViewと同期されていることを
			// 保証する。
			if (args.changed) {
				try{
					this.trigger('cell:change', {
						item: args.item,
						row: args.row,
						cell: args.cell,
						// bodyであるか
						isBody: this.dataView.isBodyRow(args.row),
						column: this.grid.getColumns()[args.cell],
						dataGrid: this
					});
				}catch(e){
					console.error(e.stack);
				}
			}

			if(this.options.suppressExtraMetadataUpdate){
				this._updateMetadata([args.row]);
			}

			// 変更されたセルに対するバリデーションを行う
			this.isValidCell(args.item, this.getColumns()[args.cell].id);

			// このイベント発行時点で行データの変更が完了していることを
			// 想定する。フォーカス遷移など行データの変更に影響を受ける
			// 部品などがこのイベントを購読し制御を行っている。
			if (args.changed) {
				this.trigger('cell:change:after', {
//					metadatas: this.metadatas,
//					row: args.row
				});
			}

			this.trigger('after:commit:edit', args);
		},

		/*
		 * setData、setColumnsで渡されるcolumnsのcellType引数を修正する。
		 * 注意: setData, setColumnsに渡された引数そのものを書きかえる。
		 *
		 * ■修正項目(わるあがき)
		 * columns[*].cellType.validatorのrequiredにeditorTypeに応じて
		 * type引数({id|selected|date})を付ける
		 */
		_fixCellType: function(columns){
			if (!columns) return;

			_.each(columns, function(column){
				var cellTypeOptions = column.cellType;
				if (!cellTypeOptions) return;
				var validator = cellTypeOptions.validator;
				var editorType = CellTypeStorage.getEditorType(cellTypeOptions);
				if (validator){
					var requiredType = ClGrid.getRequiredTypeByColumn(column);
					if (requiredType) {
						// cellType#validatorのrequiredに必須引数をつける
						validator = clutil.Validators.replaceValidation(
							validator, 'required', requiredType);
					}
				}
				if (editorType === EditorTypes.clajaxac) {
					if (validator){
						if (_.isString(validator)) {
							validator = 'accheck ' + validator;
						}else if (_.isArray(validator)){
							validator.unshift('accheck');
						}
					}else{
						if (_.isString(validator)) {
							validator = 'accheck ' + validator;
						}else if (_.isArray(validator)){
							validator.unshift('accheck');
						}
					}
				}
				cellTypeOptions.validator = validator;
			}, this);
		},

		/**
		 * グリッドを構築する。
		 */
		_buildGrid: function(columns, colhdMetadatas, graph, gridOptions, data, rowDelToggle){
			var view = this;

			this._fixCellType(columns);
			// ---------------------------------------------
			// オプショナルな列を補完
			// 行番号列
			if(this.options.lineno){
				columns.splice(0,0, {
					// 行番号列の定義
					id: '_lineno',
					name: 'No.',
					field: '_lineno',
					width: 60,
					cssClass: 'txtalign-center',
					cellType: {
						type: 'lineno'
					},
					// 以下、独自拡張フィールド
					_clspecial: true,
					_startNo: 1	// 行番号開始値
				});
			}

			// 行削除ボタン列
			if(this.options.delRowBtn){
				columns.push({
					// 行削除ボタン列の定義
					id: '_dellrow',
					name: '',
					//field: '',
					width: 40,
					cellType: {
						type: 'dellrow'
					},
					cssClass: 'txtalign-right',
					// 以下、独自拡張フィールド
					_clspecial: true
				});
			}

			// カラムID補完
			var colIds = [];
			var coldefIdMap = {};
			var fieldMap = {};
			for(var i = 0; i < columns.length; i++){
				var colDef = columns[i];
				var colId = null;
				if(_.has(colDef, 'id')){
					colId = colDef.id;
				}else{
					// アプリ側で予め ID 定義していない場合は、カラムインデックをカラムIDとでもしておくか・・・
					colId = i;
				}
				if(coldefIdMap[colId]){
					// すでに定義済 -- IDが重複している。
					throw 'カラムID重複';
				}
				colDef.id = colId;
				colIds.push(colId);
				coldefIdMap[colId] = colDef;
				if(!_.isEmpty(colDef.field) && !fieldMap[colDef.field]){
					fieldMap[colDef.field] = colDef;
				}

				// cellType からデフォルト適用
				if(colDef.cellType && !_.isFunction(colDef.cellType) && _.isString(colDef.cellType.type)){
					var cellTypeClass = ClGrid.CellTypeStorage.getCellType(colDef.cellType.type);
					if(cellTypeClass && cellTypeClass.columnDefaults){
						_.defaults(colDef, cellTypeClass.columnDefaults);
					}
				}
			}
			// 保存。（カラム折り畳みで、カラムを開くときに参照）
			this.savedColumns = {
				colIds: colIds,		// カラムIDキー（columnIndex 順序で整列）
				idMap: coldefIdMap,	// key:カラムID, value:columns[カラムID]値
				fieldMap: fieldMap	// key:field、value:columns[x]値。columns[x].fieldが重複する場合は最初に発見したもの。
			};

			// ---------------------------------------------
			// カラムヘッダ行となる固定行部分の行データをつくる。
			var headerItems = __buildHeaderRows(columns, colhdMetadatas, coldefIdMap, this.idProperty);
			if(__hasResizableColumn(columns)){
				// カラム幅可変な列が存在する
				this.$dataGrid.removeClass('cl-no-header');
			}else{
				// 全カラム幅固定
				this.$dataGrid.addClass('cl-no-header');
			}

			// ---------------------------------------------
			// データビュー
			var dataView = new ClGrid.DataView({
//				inlineFilters: true		// サポートしてる？列グループの折り畳みにつかえないか？？？？
				idProperty: this.idProperty
			});
			this.dataView = dataView;

			// ---------------------------------------------
			// メタデータ仕込み
			var metadatas = __buildMetaDatas(colhdMetadatas, headerItems, colIds, coldefIdMap, [], data.length, rowDelToggle);
			dataView.getHeadItemMetadata = function(rowIndex) {
				var meta0 = view._getHeadMetadata(rowIndex);
				var meta1 = metadatas.head[rowIndex];	//.get(rowIndex);
				var meta2 = view.getHeadMetadata(rowIndex);
				var metadata;
				metadata = ClGrid.mergeMetadata(meta0, meta1);
				metadata = ClGrid.mergeMetadata(metadata, meta2);
				return metadata;
			};
			dataView.getBodyItemMetadata = function(rowIndex){
				var meta0;
				if(!view.options.suppressExtraMetadataUpdate){
					meta0 = view._getMetadata(rowIndex);
				}else{
					meta0 = {};
				}
				var meta1 = metadatas.body[rowIndex];	//.get(rowIndex);
				var meta2 = view.getMetadata(rowIndex);
				var metadata;
				// meta0, 1, 2の順にマージする。metadata.cssClassesは追
				// 加される。アプリがマージロジックを変更したい場合は
				// ClGrid.mergeMetadataを上書きすれば良い。がそんなこと
				// はないだろう。
				metadata = ClGrid.mergeMetadata(meta0, meta1);
				metadata = ClGrid.mergeMetadata(metadata, meta2);
				return metadata;
			};
			this.metadatas = metadatas;

			// ---------------------------------------------
			// グリッド
			// グリッドのオプション
			var fixedGridOpt = _.defaults(gridOptions || {}, {
				explicitInitialization: true,	// init() は自分で呼び出す。

				editorFactory: this.editorFactory,
				formatterFactory: this.formatterFactory,
				editable: true,
				enableAddRow: false,			// このオプションは、最後の行を空行にして新規行としてみせるやつ。OFFで。
				enableCellNavigation: true,		// XXX ???
				enableColumnReorder: false,		// カラム入れ替えは不可
				asyncEditorLoading: false,		// エディットが非同期になり、フォーカス制御が不能になったためOFFにする。
				forceFitColumns: false,
//				topPanelHeight: 34,				// 今回は関係ない
				rowHeight: defaultRowHeight,
		        autoHeight: true,

				// Slickgrid 独自拡張
				// - 現在描画しようとするセルを装飾するための css クラスを返す関数を仕込む。
				xCellCssDecorator: this._cellCssDecorator
			});
			if(!_.has(fixedGridOpt, 'frozenRow')){
				// 固定列をセット
				fixedGridOpt.frozenRow = headerItems.length;
			}
			if(this.options.autoHeightDataCount > 0){
				// autoHeight 有効データ件数が指定してある場合は、autoHeight = true へ強制オーバーライドする
				gridOptions.autoHeight = true;
			}
			var slickGrid = new Slick.Grid(this.$dataGrid, dataView, columns, fixedGridOpt);
			this.grid = slickGrid;

			// formatter.start() - this とのイベント関連付けを行う。
			fixedGridOpt.formatterFactory.start();

			// ---------------------------------------------
			// イベント仕込み
			// クリックイベント
			slickGrid.onClick.subscribe(this._onGridClicked);

			var initialized = false;
			dataView.beginUpdate();
			// Make the grid respond to DataView change events.
			dataView.on('row:count:changed', _.bind(function(args){
				if(!initialized){
					return;
				}
				console.log('row:count:changed', dataView.getLength(), args);
				this.grid.updateRowCount();
				this.grid.render();
//				_.defer(_.bind(function(){
//					this.adjustAutoSize();
//				},this));
				this.adjustAutoSize();
			},this));
			dataView.on('rows:changed', _.bind(function(args){
				this._updateMetadata(args.rows);
				if(!initialized){
					return;
				}
				console.log('rows:changed', dataView.getLength(), args);
				this.grid.invalidateRows(args.rows);
				this.grid.render();

				this.trigger('rows:changed', args);
			},this));
			dataView.setHeadItems(headerItems);
			if(_.isArray(data) && data.length > 0){
				for(var i = 0; i < data.length; i++){
					var aData = data[i];
					// SlickGrid 管理の id を付与する。
					if (aData[this.idProperty] == null){
						aData[this.idProperty] = newIdPropertyValue();
					}
				}
				dataView.setBodyItems(data);
			}

			// graphはインスタンスの属性として保存しておく
			if (this.options.graph){
				this.graph = this.options.graph;
			}
			if (graph){
				this.graph = graph;
			}
			// 行内部の依存関係定義
			if (this.graph) {
				graph = this.graph;
				this.setupGraphEvents();
			}else{
				/* グラフが設定されていない場合!
				 * セルの設定値が変更された・・・ */
				slickGrid.onCommitEdit.subscribe(_.bind(function(e, args){
					console.log('clappGridView: onCellChange fired, ', arguments);
					view.onCommitEdit(args);
				}, this));
			}

			dataView.endUpdate();

			// ---------------------------------------------
			// 初期化
			this.grid.init();
			// init()後に独自イベントハンドラを割りあてる
			ClGrid.GridEvHandler.addGrid(this);

			initialized = true;
			if(this.options.fitCanvasWidth){
				this.fitCanvasWidth();
			}
			console.log('grid.init() after: now do adjustAutoSize().');
			this.adjustAutoSize();

			// slickgrid初期化後にイベントをトリガー
			this.trigger('grid:init:after');
		},

		/**
		 * SlickGrid 要素のサイズを調整する。（内部用、アプリ使用は非推奨）
		 * @method adjustAutoSize
		 */
		adjustAutoSize: function(){
			if(!this.grid){
				return;
			}

			var gridOpt = this.grid.getOptions();
			var autoHeight = (gridOpt.autoHeight == true);

			// データ件数が autoHeightDataCount 数を境界に、autoHeight モードを切り替える
			var reRendered = this.autoHeightSwitch();
			if(reRendered){
				return;		// 再レンダリングされたので、resizeCanvas() は省略
			}

			if(autoHeight){
				this.grid.resizeCanvas();
			}
		},

		// データ件数が autoHeightDataCount 数を境界に、autoHeight モードを切り替える
		autoHeightSwitch: function(futureDataCount){
			if(!this.grid){
				return false;
			}

			var autoHeightDataCount = this.options.autoHeightDataCount;
			if(!(autoHeightDataCount > 0)){
				return false;
			}

			if(futureDataCount == null){
				futureDataCount = this.dataView.getBodyLength();
			}
			var autoHeight = this.grid.getOptions().autoHeight;
			var futureAutoHeightFlag = (futureDataCount <= autoHeightDataCount);
			if(autoHeight == futureAutoHeightFlag){
				// AutoHeight 変更ナシ
				return false;
			}

			// AutoHeight モードを切り替える。
			if(futureAutoHeightFlag == false){
				// AutoHeight を OFF へスイッチするときは、キャンバス固定高を算出してheightをセットする。
				var gridOpt = this.grid.getOptions();
				var frozenRowCount = Math.max(gridOpt.frozenRow || 0, 0);
				var scrollDim = this.grid.getScrollbarDimensions();
				var preferredH = this.grid.getRowHeights(frozenRowCount, autoHeightDataCount) + scrollDim.height;

				if(frozenRowCount > 0){
					this.$('.slick-pane-bottom.slick-pane-left').height(preferredH);
					this.$('.slick-pane-bottom.slick-pane-right').height(preferredH);
					this.$('.slick-viewport-bottom.slick-viewport-left').height(preferredH);
					this.$('.slick-viewport-bottom.slick-viewport-right').height(preferredH);
				}else{
					this.$('.slick-pane-top.slick-pane-left').height(preferredH);
					this.$('.slick-pane-top.slick-pane-right').height(preferredH);
					this.$('.slick-viewport-top.slick-viewport-left').height(preferredH);
					this.$('.slick-viewport-top.slick-viewport-right').height(preferredH);
				}
			}
			this.grid.setOptions({ 'autoHeight': futureAutoHeightFlag });

			if(this.options.fitCanvasWidth){
				this.fitCanvasWidth();
			}

			return true;
		},

		/**
		 * グリッドのデータ部分だけクリアする。
		 * カラムヘッダの構造は保つ。
		 * @method clearData
		 */
		clearData: function(){
			var isClear = false;
			if(this.dataView){
				// dataView のデータを空にする。
				var bodyLength = this.dataView.getBodyLength();
				if(bodyLength > 0){
					this.dataView.setBodyItems([]);
					isClear = true;
				};
				// body 部メタデータを破棄
				this.metadatas.body.splice(0);
			}
			if(isClear && this.dataView){
				this.grid.invalidate();
			}
		},

		/**
		 * カラムヘッダ部とデータをクリアする。
		 * @method clear
		 */
		clear: function(){
			ClGrid.GridEvHandler.removeGridView(this);
			if(this.grid){
				this.grid.destroy();
				this.grid = null;
			}
			if(this.dataView){
				this.dataView.destroy();
				this.dataView = null;
			}
			this.savedColumns = null;
			this.metadatas = null;
			//this.$footer.css({visibility: 'hidden'});
		},

		/**
		 * 新しい行を追加する
		 * @method addNewItem
		 */
		addNewItem: function(newDto){
			if(this.dataView){
				// データ件数が autoHeightDataCount 数を境界に、autoHeight モードを切り替える
				var dataCount = this.dataView.getBodyLength();
				this.autoHeightSwitch(dataCount + 1);

				if (newDto[this.idProperty] == null){
					newDto[this.idProperty] = newIdPropertyValue();
				}

				var newRowIndex = dataCount;
				this.dataView.addBodyItem(newDto);

				// メタデータ追加
				this.metadatas.body[newRowIndex] = {
					isNew: true
				};

				// 新規行が表示されるようにスクロール
				var toRow = this.dataView.getLength();
				this.grid.scrollRowIntoView(toRow);
			}
		},

		/**
		 * 行追加
		 *
		 * @method addItem
		 */
		addItem: function(rowDto) {
			if(this.dataView){
				// データ件数が autoHeightDataCount 数を境界に、autoHeight モードを切り替える
				var dataCount = this.dataView.getBodyLength();
				this.autoHeightSwitch(dataCount + 1);

				if (rowDto[this.idProperty] == null){
					rowDto[this.idProperty] = newIdPropertyValue();
				}
				this.dataView.append(rowDto);
			}
		},

		/**
		 * 行挿入
		 * @method insertItem
		 */
		insertItem: function(rowIndex, rowDto){
			if(this.dataView){
				// データ件数が autoHeightDataCount 数を境界に、autoHeight モードを切り替える
				var dataCount = this.dataView.getBodyLength();
				this.autoHeightSwitch(dataCount + 1);

				if (rowDto[this.idProperty] == null){
					rowDto[this.idProperty] = newIdPropertyValue();
				}
				this.dataView.insertBodyItem(rowDto);
			}
		},

		updateItem: function(item){
			if(this.dataView){
				this.dataView.updateItem(item[this.idProperty], item);
			}
		},

		/**
		 * 行削除する
		 * @method deleteItemAt
		 * @param {Number} rowIndex 削除対象とする行インデックス（ボディ部の行インデックス）
		 * @return {boolean} true:行削除された、false:行削除しなかった
		 *
		 * 呼び出し元で描画更新する必要あり。
		 * ```
		 * if(this.deleteItemAt(1234)){
		 *     this.grid.invalidate();
		 *     this.grid.updateRowCount();
		 * }
		 * ```
		 */
		deleteItemAt: function(rowIndex){
			var prevDataLen = this.grid.getDataLength();
			if(this.dataView){
				var item = this.dataView.getBodyItemByIdx(rowIndex);
				if(item != null){

					// データ件数が autoHeightDataCount 数を境界に、autoHeight モードを切り替える
					var dataCount = this.dataView.getBodyLength();
					this.autoHeightSwitch(dataCount - 1);

					// メタデータから削除
					var bodyMetadatas = this.metadatas.body;
					if(rowIndex < bodyMetadatas.length){
						bodyMetadatas.splice(rowIndex, 1);
					}
					// データ実体削除
					var rowId = item[this.dataView.idProperty];
					this.dataView.deleteBodyItem(rowId);
				}
			}
			var afterDataLen = this.grid.getDataLength();

			// RowCount に変化があるときは true を返す。
			return (prevDataLen !== afterDataLen);
		},

		/**
		 * ボディ部全体のcellType.validatorによる検証を行う。検出された
		 * エラーはsetCellMessage()に渡せる配列として返却する。エラーが
		 * 検出されない場合は何も返さない。
		 *
		 * @method validate
		 * @param {object} [options]
		 * @param {function} [options.tailEmptyCheckFunc] 空DTOチェックメソッド
		 * @param {function} [options.filter] 行データフィルタ
		 * @return {array} errors
		 */
		validate: function(options){
			var tailEmptyCheckFunc, filter;
			if(_.isFunction(options)){
				options = {
					tailEmptyCheckFunc: options
				};
			}
			options = (options || {});
			tailEmptyCheckFunc = options.tailEmptyCheckFunc;
			filter = options.filter || function(){return false};

			if(this.grid == null){
				// 物がない => OK => 何も返さない
				return;
			}

			// アクティブなEditorを刈り取る
			this.stopEditing();

			// idProperty属性名のキャッシュ
			var idProperty = this.grid.getData().idProperty;
			// columnsのキャッシュ
			var columns = this.grid.getColumns();
			// エラー
			var errors = [];

			var items = this.grid.getData().getBodyItems();
			for(var rowIndex = items.length-1; rowIndex >= 0; rowIndex--){
				var item = items[rowIndex];
				if(_.isFunction(tailEmptyCheckFunc) && tailEmptyCheckFunc(item)){
					continue;
				}
				tailEmptyCheckFunc = null;
				if(filter(item)){
					continue;
				}
				var i, column, cellType, value, err;
				for (i=0; i<columns.length; i++){
					column = columns[i];
					cellType = column.cellType || {};
					if (cellType.beforeValid &&
						cellType.beforeValid(item) === false){
						// beforeValidがfalseを戻すときはチェックを行わない
						continue;
					}
					if (cellType.validator){
						value = item[column.field];
						err = clutil.Validators.checkAll({
							validator: cellType.validator,
							value: value,
							item: item
						});
						if (err){
							errors.push({
								rowId: item[idProperty],
								colId: column.id,
								message: err,
								level: 'error'
							});
						}
					}
				}
			}

			// エラーなし => 何も返さない
			if (_.isEmpty(errors))
				return;

			return errors;
		},

		_setErrorInside: function(hasError){
			if (this.options.errorInside){
				this.$el.find('>.errorInside').remove();
				if (hasError) {
					this.$el.prepend('<span class="errorInside">テーブル内にエラー箇所があります</span>');
				}
			}
		},

		/**
		 * cellType で定義した validation による全体チェック
		 * setCellMessageで設定したメッセージは全てクリアされる。クリア
		 * されたくなければvalidateを使って自分でメッセージを設定するこ
		 * と
		 *
		 * @method isValid
		 * @param {object} [options]
		 * @param {function} [options.tailEmptyCheckFunc] 空行チェックメソッド
		 * @param {function} [options.filter] 行データフィルタ関数
		 * @return {Boolean} true OK、false: NG
		 */
		isValid: function(options){
			options || (options = {});

			// 全てクリアする
			this.clearAllCellMessage();

			var errors = this.validate(options);

			var isValid = this.setCellMessages(errors);

			if (options.errorInside !== false) {
				this._setErrorInside(!isValid);
			}

			return isValid;
		},

		isValidCell: function(rowId, colId, silent){
			if (_.isObject(rowId)){
				rowId = rowId[this.idProperty];
			}
			var item = this.dataView.getItemById(rowId);
			if (!item) {
				console.error('Invalid row id', rowId);
				return;
			}
			var columns = this.grid.getColumns();
			var column = _.where(columns, {id: colId})[0];
			if (!column) {
				console.error('Invalid column id', colId);
				return;
			}
			var cellType = column.cellType || {};
			if (cellType.beforeValid &&
				cellType.beforeValid(item) === false){
				// beforeValidがfalseを戻すときはチェックを行わない
				return;
			}
			var error = clutil.Validators.checkAll({
				validator: cellType.validator,
				value: item[column.field],
				item: item
			});
			if (!silent) {
				if (error) {
					this.setCellMessage(rowId, colId, 'error', error);
				} else {
					this.clearCellMessage(rowId, colId);
				}
			}

			return error;
		},

		isValidRow: function(){
			var that = this;
			var idProperty = this.idProperty;
			var errors = [];
			var columns = this.grid.getColumns();
			_.map(arguments, function(rowId){
				_.each(columns, function(column){
					if (_.isObject(rowId)){
						rowId = rowId[idProperty];
					}
					var error = that.isValidCell(rowId, column.id, true);
					errors.push({
						rowId: rowId,
						colId: column.id,
						message: error,
						level: error && 'error'
					});
				});
			});
			return this.setCellMessage(errors);
		},

		/**
		 * 内部保持しているメタデータを取得する。（内部関数）
		 * @method _getStoredMetadata
		 * @param {number} absoluteRowIdx 全体の行インデックス
		 * @param {boolean} forceCreate 無い場合はメタデータを生成する
		 * @return {object} メタデータ
		 */
		_getStoredMetadata: function(absoluteRowIdx, forceCreate){
			var meta;
			var hdLen = this.dataView.getHeadLength();
			if(absoluteRowIdx < hdLen){
				// ヘッダ部のメタデータ
				meta = this.metadatas.head[absoluteRowIdx];
				if(!meta && forceCreate){
					meta = {};
					this.metadatas.head[absoluteRowIdx] = meta;
				}
			}else{
				// ボディ部のメタデータ
				var bodyRowIdx = absoluteRowIdx - hdLen;
				meta = this.metadatas.body[bodyRowIdx];
				if(!meta && forceCreate){
					meta = {};
					this.metadatas.body[bodyRowIdx] = meta;
				}
			}
			return meta;
		},

		/**
		 * セルにエラーメッセージを設定する
		 *
		 * @method setCellMessages
		 * @param {object} errors validate()の戻り値の形式を想定
		 * @return {boolean} true: OK, false: NG
		 */
		setCellMessages: function(errors){
			if (_.isEmpty(errors)){
				return true;
			}

			this.setCellMessage(errors);

			return false;
		},

		_setRowErrors: function(updateRowIdMap){
			var columns = this.grid.getColumns();
			_.each(updateRowIdMap, function(rowIdx){
				// jshint unused: false
				var meta = this._getStoredMetadata(rowIdx, true);
				meta.hasErrorInRow = _.some(columns, function(column){
					var elevel = meta.columns;
					elevel = elevel && meta.columns[column.id];
					elevel = elevel && elevel.cellMessage;
					elevel = elevel && elevel.level;
					return elevel === 'error';
				});
			}, this);
			var hasError = _.some(this.metadatas.body, function(meta){
				return meta && meta.hasErrorInRow;
			});
			this._setErrorInside(hasError);
		},

		/**
		 * 指定セルにメッセージを付ける。
		 * @method setCellMessage
		 * @param {any} rowId 行ID
		 * @param {any} colId 列ID
		 * @param {string} message メッセージ
		 * @param [level] メッセージレベル、{'error', 'warn', 'info'??}、デフォルト 'error'
		 * または、
		 * @param {array} args
		 * @param {any} args[n].rowId 行ID
		 * @param {any} args[n].colId 列ID
		 * @param {string} args[n].message メッセージ
		 * @param {string} args[n].level メッセージレベル
		 */
		setCellMessage: function(rowId, colId, level, message){
			if(!this.grid){
				throw 'Invalid state: slick.grid instance is not ready.';
			}

			// 引数整理
			var messages;
			if(arguments.length == 1){
				if(_.isArray(arguments[0])){
					messages = arguments[0];
				}else{
					messages = [ arguments[0] ];
				}
			}else{
				messages = [{
					rowId: arguments[0],
					colId: arguments[1],
					level: arguments[2],
					message: arguments[3]//,		TODO: セル内にアイコンをとる
//					icon: {
//						level: 'info',
//						icn_text: '!',
//						message: 'ああああ'
//					}
				}];
			}

			// メタデータにメッセージをセット
			var updateRowIdMap = {};
//			this.dataView.beginUpdate();
			for(var i = 0; i < messages.length; i++){
				var msg = messages[i];
				var rowIdx = this.dataView.getIdxById(msg.rowId);
				if(rowIdx == null){
					console.warn('setCellMessage: rowId[' + msg.rowId + '] not found, ignore!');
					continue;
				}

				var meta = this._getStoredMetadata(rowIdx, true);
				if(!meta.columns){
					meta.columns = {};
				}
				var cellMeta = meta.columns[msg.colId];
				if(!cellMeta){
					cellMeta = {};
					meta.columns[msg.colId] = cellMeta;
				}
				if(_.has(msg, 'level') || _.has(msg, 'message')){
					cellMeta.cellMessage = msg;
				}else{
					// メッセージが無い、かつ、レベル指定が無い ⇒ クリア扱い。
					delete cellMeta.cellMessage;
				}
				updateRowIdMap[msg.rowId] = rowIdx;
			}
//			this.dataView.endUpdate();

			this._setRowErrors(updateRowIdMap);

			// SlickGrid 表示を更新
			var updateRowsIdx = _.map(updateRowIdMap, function(rowIdx, rowId){
				return rowIdx;
			});
			if(!_.isEmpty(updateRowsIdx)){
				this.grid.invalidateRows(updateRowsIdx);
				this.grid.render();
			}
		},

		/**
		 * 指定セルのメッセージ＆強調ボーダーを消す。
		 * 引数指定しない場合は、全てのセルメッセージを消す。
		 * @method clearCellMessage
		 * @param {any} rowId 行ID
		 * @param {any} colId 列ID
		 * または
		 * @param {array} args
		 * @param {any} args[n].rowId 行ID
		 * @param {any} args[n].colId 列ID
		 */
		clearCellMessage: function(rowId, colId){
			$('.tooltip').remove();
			if(arguments.length === 0){
				// 全クリア
				this.clearAllCellMessage();
				return;
			}

			/// 引数整理
			var cellMsgs = [];
			if(arguments.length === 1 && _.isArray(arguments[0])){
				cellMsgs = arguments[0];
			}else{
				cellMsgs = [{
					rowId: rowId,
					colId: colId
				}];
			}

			// set メソッド併用で目的のセルメッセージを削除する。
			this.setCellMessage(cellMsgs);
		},

		/**
		 * 全てのセルメッセージを消す。
		 */
		clearAllCellMessage: function(){
			$('.tooltip').remove();
			// セルメッセージ全クリア
			if(!this.grid){
				//throw 'Invalid state: slick.grid instance is not ready.';
				return;
			}
			var updateRowsIdx = [];
			for(var rowIdx = 0; rowIdx < this.grid.getDataLength(); rowIdx++){
				var meta = this._getStoredMetadata(rowIdx);
				if(!meta || !meta.columns){
					continue;
				}
				var hasCellMsg = _.reduce(meta.columns, function(hasCellMsg, cellMeta, colId){
					if(cellMeta.cellMessage){
						delete cellMeta.cellMessage;
						hasCellMsg = true;
					}
					return hasCellMsg;
				}, false);
				if(hasCellMsg){
					updateRowsIdx.push(rowIdx);
				}
			}
			this._setRowErrors(updateRowsIdx);
			if(!_.isEmpty(updateRowsIdx)){
				this.grid.invalidateRows(updateRowsIdx);
				this.grid.render();
			}
		},

		/**
		 * サーバ応答のエラーメッセージをセットする。
		 *
		 * @method setSrvErrors
		 * @param {array} fieldMessages am_proto_common_rsp_field_msg 構造体の配列
		 * @param {string} structName 本グリッドが受け持つデータ識別用の名前
		 * @param {string} [level] メッセージレベル。{ 'error', 'alert' } のいずれかを指定。省略時デフォルトは 'error'。
		 */
		setSrvErrors: function(fieldMessages, structName, level){
			$('.tooltip').remove();
			// srvErrs 要素の構造： am_proto_common_rsp_field_msg 参照。
//			srvErr = {
//				struct_name: 'foo',
//				field_name: 'プロパティ名',
//				lineno: 1234, // Body部オリジンの行番号
//				message: 'sys_error',	// エラーメッセージコード
//				args: ['arg1', 'arg2', 'arg3']
//			};

			if(!this.grid){
				return;
			}

			// level 引数を補完
			switch(level){
			case 'alert':
			case 'error':
				break;
			default:
				level = 'error';
			}

			var headerRowCount = this.dataView.getHeadLength();
			var wkDupCellCheckMap = {};
			var updateRowIdMap = {};
			var fldMsgs = _.where(fieldMessages, {struct_name: structName});
			for(var i = 0; i < fldMsgs.length; i++){
				var fldMsg = fldMsgs[i];
				if(!fldMsg.lineno || fldMsg.lineno <= 0 || _.isEmpty(fldMsg.field_name)){
					continue;
				}
				var fldIndex = fldMsg.lineno - 1;

				// メタデータへメッセージをセットする。
				// カラム定義
				var colDef = this.savedColumns.fieldMap[fldMsg.field_name];
				if(!colDef){
					// カラムが見つからない！
					console.warn('columns of field[' + fldMsg.field_name + '] not found, skip.');
					continue;
				}
				// 行データ
				var rowItem = this.dataView.getBodyItemByIdx(fldIndex);
				if(!rowItem){
					// 行データが見つからない！
					console.warn('rowItem[' + fldIndex + '] not found, skip.');
					continue;
				}
				// メタデータ（行）
				var meta = this._getStoredMetadata(this.dataView.bodyIndexToIndex(fldIndex), true);
				if(!meta.columns){
					meta.columns = {};
				}
				// メタデータ（セル）
				var cellMeta = meta.columns[colDef.id];
				if(!cellMeta){
					cellMeta = {};
					meta.columns[colDef.id] = cellMeta;
				}

				// 重複セットチェック
				var wkHashVal = rowItem[this.dataView.idProperty] + '&' + colDef.id;
				if(wkDupCellCheckMap[wkHashVal]){
					// 既に設定済。
					console.warn('duplicated at rowIndex[ ' + fldIndex + '], colId[' + colDef.id + '], message[' + message + '] skip.');
					continue;
				}
				wkDupCellCheckMap[wkHashVal] = true;

				// メタデータへメッセージをセット
				cellMeta.srvMessage = {
					message: clutil.fmtargs(clutil.getclmsg(fldMsg.message), fldMsg.args),
					level: level
				};

				updateRowIdMap[rowItem[this.dataView.idProperty]] = headerRowCount + fldIndex;
			}

			var updateRows = _.map(updateRowIdMap, function(rowIdx, rowId){
				return rowIdx;
			});
			if(!_.isEmpty(updateRows)){
				this.grid.invalidateRows(updateRows);
				this.grid.render();
			}
		},

		/**
		 * サーバ応答のエラーメッセージを削除する。
		 */
		clearSrvErrors: function(){
			// XXX 要望があれば実装する。
			console.warn('[PENDING] function "clearErrorInfos" is not implements yet.');
		},

		/**
		 * 全てのサーバ応答のエラーメッセージを削除する。
		 */
		clearAllSrvErrors: function(){
			// XXX 要望があれば実装する。
			console.warn('[PENDING] function "clearAllErrorInfos" is not implements yet.');
		},

		/**
		 * 全てのセルメッセージ/サーバ応答メッセージのエラー情報をクリアする。
		 * @method clearAnyCellMessage
		 */
		clearAnyCellMessage: function(){
			$('.tooltip').remove();
			// セルメッセージ/サーバ応答メッセージ全クリア
			if(!this.grid){
				//throw 'Invalid state: slick.grid instance is not ready.';
				return;
			}
			var updateRowsIdx = [];
			for(var rowIdx = 0; rowIdx < this.grid.getDataLength(); rowIdx++){
				var meta = this._getStoredMetadata(rowIdx);
				if(!meta || !meta.columns){
					continue;
				}
				var hasCellMsg = _.reduce(meta.columns, function(hasCellMsg, cellMeta, colId){
					if(cellMeta.cellMessage){
						delete cellMeta.cellMessage;
						hasCellMsg = true;
					}
					if(cellMeta.srvMessage){
						delete cellMeta.srvMessage;
						hasCellMsg = true;
					}
					return hasCellMsg;
				}, false);
				if(hasCellMsg){
					updateRowsIdx.push(rowIdx);
				}
			}
			this._setRowErrors(updateRowsIdx);
			if(!_.isEmpty(updateRowsIdx)){
				this.grid.invalidateRows(updateRowsIdx);
				this.grid.render();
			}
		},

		/**
		 * エラー情報の有無
		 * @method hasAnyCellMessage
		 */
		hasAnyCellMessage: function(){
			if(!this.grid){
				//throw 'Invalid state: slick.grid instance is not ready.';
				return ;
			}
			for(var rowIdx = 0; rowIdx < this.grid.getDataLength(); rowIdx++){
				var meta = this._getStoredMetadata(rowIdx);
				if(!meta || !meta.columns){
					continue;
				}
				for(var colId in meta.columns){
					var cellMeta = meta.columns[colId];
					if(cellMeta.cellMessage){
						return true;
					}
					if(cellMeta.srvMessage){
						return true;
					}
				}
			}
			return false;
		},

		/**
		 * 指定行の初めの Editoable にフォーカス（データ部用）
		 * @method setFocusRowAt
		 * @param [rowIndex] フォーカスの指定行。省略時は先頭の行。
		 */
		setFocusRowAt: function(rowIndex){
			var headLen = this.dataView.getHeadLength();
			this.grid.gotoCell(headLen + rowIndex, 0);
		},

		/**
		 * 編集可否状態をスイッチする。
		 * @method setEnable
		 */
		setEnable: function(enable){
			// Grid 部
			this.setEditable(enable, false);

			// 行削除の［×］ボタン、フッタの行追加ボタンの編集可否状態を設定する。
			this.setEnableForRowCtrl(enable);
		},

		/**
		 * 行追加/行削除コントローラの編集可否状態を設定する
		 * @method setEnableForRowCtrl
		 */
		setEnableForRowCtrl: function(enable){
			// 行削除の［×］ボタンを非活性化する。
			if (this.grid) {
				this.grid.setOptions({
					disableDelRow : !enable
				});
			}

			if (this.$footer) {
				// Footer 部
				if(enable){
					this.$footer.addClass('disabled').css('visibility', 'visible');
				}else{
					this.$footer.removeClass('disabled').css('visibility', 'hidden');
				}
			}

			if (this.grid) {
				this.grid.invalidate();
			}
		},

		/**
		 * 編集中状態のセルがあれば、編集を確定する。
		 *
		 * @method stopEditing
		 */
		stopEditing: function() {
			if(this.grid){
				this.grid.getEditorLock().commitCurrentEdit();
			}
		},

		/**
		 * 編集中状態のセルがあれば、編集をキャンセルする。
		 *
		 * @method cancelEditing
		 */
		cancelEditing: function(){
			if(this.grid){
				this.grid.getEditorLock().cancelCurrentEdit();
			}
		},

		/**
		 * テーブル全体の編集可否を設定する。
		 *
		 * @method setEditable
		 * @param {boolean} editable true:編集可に設定、false:編集不可に設定
		 * @param {boolean} [preventInvalidateCall]
		 */
		setEditable: function(editable, preventInvalidateCall) {
			if (this.grid) {
				this.grid.setOptions({
					editable : editable
				});
				// TODO: 行削除の列が指定されている場合は、当該列を非表示化してしまおう！

				if(preventInvalidateCall){
					this.grid.invalidate();
				}
			}
		},

		/**
		 * データを返す。（ボディ部）
		 * @method getData
		 * @param {object}	[args]			フィルタ条件。未指定の場合は全データを返す。フィルタを２種類以上指定するとAND条件として扱う。
		 * 									削除フラグONの行は除外して使用することが多いので、この場合は getData({ delflag: false }) と記述する。
		 * @param {boolean}	[args.delflag]	既存データ行で、true:削除フラグONのものを含める、false:削除フラグOFFのものを含める、未指定:どちらも含める。
		 * @param {boolean} [args.isNew]	新規追加行を true:含める、false:除外する、未指定:どちらでも含める。
		 * @param {function} [args.filterFunc]	フィルタオプション。filterFunc を指定した場合、true を返すものを除外する。
		 * @param {function} [args.tailEmptyCheckFunc] 空行チェックメソッド
		 * @return データ配列
		 */
		getData: function(args) {
			var rows = [];
			if (this.dataView) {
				var metaDatas = this.metadatas.body;
				var items = this.dataView.getBodyItems();
				var i, l, item;

				for(i=0, l=items.length; i<l; i+=1){
					item = items[i];
					var meta = metaDatas[i];

					// 削除フラグフィルタ。
					if(args && _.has(args, 'delflag')){
						var metaDelflag = ((meta && meta.cssClassesMap && meta.cssClassesMap.delflag) == true);
						if(args.delflag != metaDelflag){
							continue;
						}
					}

					// 新規追加行フィルタ
					if(args && _.has(args, 'isNew')){
						var metaIsNew = ((meta && meta.isNew) == true);
						if(args.isNew != metaIsNew){
							continue;
						}
					}

					// フィルタ関数
					if(args && _.isFunction(args.filterFunc)){
						if(args.filterFunc(item)){
							continue;
						}
					}

					rows.push(item);
				}
				// 末尾空行削除
				if(args && args.tailEmptyCheckFunc && rows.length){
					for(i=rows.length-1; i>=0; i-=1){
						if(!args.tailEmptyCheckFunc(rows[i])){
							break;
						}
					}
					rows.splice(i+1);
				}
			}

			return rows;
		},

		remove: function(){
			// ここに破棄処理 TODO
			if(this.grid){
				this.grid.destroy();
			}
			Backbone.View.prototype.remove.call(this);
		}

	});

}(ClGrid));

/*
 * 	exResize 0.1.0 - jQuery plugin
 *	written by Cyokodog	
 *
 *	Copyright (c) 2010 Cyokodog (http://d.hatena.ne.jp/cyokodog/)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
(function($){
	var API = function(api){
		var api = $(api),api0 = api[0];
		for(var name in api0)
			(function(name){
				if($.isFunction( api0[name] ))
					api[ name ] = (/^get[^a-z]/.test(name)) ?
						function(){
							return api0[name].apply(api0,arguments);
						} : 
						function(){
							var arg = arguments;
							api.each(function(idx){
								var apix = api[idx];
								apix[name].apply(apix,arg);
							})
							return api;
						}
			})(name);
		return api;
	}

	$.ex = $.ex || {};
	$.ex.resize = function(idx , targets , option){
		if ($.isFunction(option)) {
			option = {callback : option};
		}
		var o = this,
		c = o.config = $.extend({} , $.ex.resize.defaults , option);
		c.targets = targets;
		c.target = c.watchTarget = c.targets.eq(idx);
		c.index = idx;
		c.oldBrowser = $.browser.msie && ($.browser.version < 8.0 || !$.boxModel);
		c.key = { height : '', width : ''};
		if (c.contentsWatch) {
			o._createContentsWrapper();
		}
		c.currentSize = c.newSize = o.getSize();
		if (c.resizeWatch) o._resizeWatch();
	}
	$.extend($.ex.resize.prototype, {
		_createContentsWrapper : function(){
			var o = this, c = o.config;
			var style = c.oldBrowser ? 'zoom:1;display:inline' : 'display:inline-block';
			c.watchTarget = c.target.wrapInner('<div style="' + style + ';width:' + c.target.css('width') + '"/>').children();
			return o;
		},
		_resizeWatch : function(){
			var o = this, c = o.config;
			setTimeout(function(){
				if (c.contentsWatch) {
					if (c.watchTarget.prev().size() > 0 || c.watchTarget.next().size() > 0 || c.watchTarget.parent().get(0) != c.target.get(0)) {
						c.watchTarget.replaceWith(c.watchTarget.get(0).childNodes);
						o._createContentsWrapper();
					}
				}
				if (o._isResize()) {
					c.currentSize = c.newSize;
					c.callback.call(c.watchTarget.get(0),o);
				}
				o._resizeWatch();
			},c.resizeWatch);
		},
		_isResize : function () {
			var o = this, c = o.config;
			var ret = false;
			c.newSize = o.getSize();
			for (var i in c.key) {
				ret = ret || (c.newSize[i] != c.currentSize[i]);
			}
			return ret;
		},
		getTargets : function(){
			return this.config.targets;
		},
		getTarget : function(){
			return this.config.target;
		},
		getSize : function () {
			var o = this, c = o.config;
			if (c.contentsWatch) c.watchTarget.css('width','auto');
			var ret = {};
			for (var i in c.key) {
				ret[i] = c.watchTarget[i]();
			}
			if (c.contentsWatch) c.watchTarget.css('width',c.target.css('width'));
			return ret;
		}
	});
	$.ex.resize.defaults = {
		contentsWatch : false,
		resizeWatch : 100,
		callback : function(){}
	}
	$.fn.exResize = function(option){
		var targets = this,api = [];
		targets.each(function(idx) {
			var target = targets.eq(idx);
			var obj = target.data('ex-resize') || new $.ex.resize( idx , targets , option);
			api.push(obj);
			target.data('ex-resize',obj);
		});
		return option && option.api ? API(api) : targets;
	}
})(jQuery);
