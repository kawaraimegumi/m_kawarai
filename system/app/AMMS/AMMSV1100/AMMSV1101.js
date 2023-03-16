$(function() {

	var contentHiddenAttrHTML = '<input class="cl-file-attr" name="attr" type="hidden">';

	var $photoFieldGroup = null;

	AMMSV1101PhotoAddView = Backbone.View.extend({

		events: {
			'click #btn_photo_select': "_onPhotoSelectClick",
			'click #div_add': "_onDivAddClick",
			'change #ca_img_up': '_onImageUpChange',
		},

		initialize: function(opt) {
			var defaults = {
				search_date: clcom.ope_date,			// 運用日
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			this.options = {
				maxFileSize: 512 * 1024,	// ファイルサイズ制限（暫定）
				immediately: true,
			};
//			clutil.inputlimiter(this.$el);
//			clutil.initUIelement(this.$el);
			clutil.cltxtFieldLimit($("#ca_photoTag"));
			clutil.cltxtFieldLimit($("#ca_photoComment"));
		},

		render: function(readonly) {
			this.readonly = readonly;
			var $canvas = this.$('.picPreview');
			this.dimension = {
				width: $canvas.width(),		//.innerWidth(),
				height: $canvas.height()	//.innerHeight()
			};

			// Img loading 関数セット
			var $img = this.$('img');
			$img.load(this._onImgLoaded);
			$img.error(this._onImgError);

			if (readonly) {
				clutil.viewReadonly(this.$el);
				var $div = this.$el.find('#div_add');
				$div.removeClass('add');
				$div.addClass('addnothover');
			}
		},

		/**
		 * 画像追加処理
		 * @param e
		 */
		_onDivAddClick: function(e) {
			if (this.readonly) {
				return;
			}
			if (this.uploadedData == null || this.uploadedData.id == 0) {
				return;
			}
			var validator = clutil.validator($('#div_photo_add'), {
				echoback		: $('.cl_echoback')
			});
			if (!validator.valid()) {
				return;
			}
			var photoTag = this.$("#ca_photoTag").val();
			var photoComment = this.$("#ca_photoComment").val();
			var mainFlag = this.$("#ca_mainFlag").prop('checked') ? 1 : 0;
			var clothFlag = this.$("#ca_clothFlag").prop('checked');
			var args = _.extend({
				photoTag: photoTag,
				photoComment: photoComment,
				mainFlag: mainFlag,
				clothFlag: clothFlag,
			}, this.uploadedData);

			clutil.mediator.trigger('onAddPhoto', args);
		},

		_onPhotoSelectClick: function(e) {
			this.$('#ca_img_up').trigger('click');
		},

		_onImageUpChange: function(e) {
			var $input = $(e.target);
			var file = e.target.files[0];
			var convert_pdf = 0;

			console.log(file);
			if (file == null) {
				// ファイルチューザーでキャンセル
				return;
			}
			// ファイルのコンテントタイプチェック
			if (!file.type.match(/^image\//) && !file.type.match(/\/pdf/)) {
				clutil.mediator.trigger('onTicker', '画像ファイルを選択してください。');
				return;
			}
			// ファイルサイズのチェック
			if (this.options.maxFileSize > 0 && file.size > this.options.maxFileSize) {
				var msg = 'ファイルサイズが大きすぎます。{0} 以下のファイルを選択してください。';
				var arg = (this.options.maxFileSize / 1024) + '[KB]';
				clutil.mediator.trigger('onTicker', clutil.fmt(msg, arg));
				return;
			}

			if (file.type.match(/\/pdf/)) {
				convert_pdf = 1;
			}

			// 即時アップロード
			if (this.options.immediately) {
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
			var $hidden = $(contentHiddenAttrHTML).appendTo($form);

			$hidden.val(JSON.stringify({
				filename: this.workingData.basename,
				convert_pdf: convert_pdf,
			}));

			clutil.blockUI(clcom.uploadDestUri);
			$form.ajaxSubmit({
				type: 'POST',
				dataType: 'json',
				contentType: 'multipart/form-data',
				url: clcom.uploadDestUri,
				success: this._onUploadSuccess,
				error: this._onUploadError,
				complete: this._onUploadComplete,
			});

			return true;
		},
		// アップロード成功
		_onUploadSuccess: function(data){
			var file = {
				id: data.id,
				uri: data.uri,
				photoURL: data.uri,
				filename: this.workingData.basename,
				localpath: this.workingData.localpath,
				photoFileID: data.id,
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
			this.$("#ca_photoTag").val('');
			this.$("#ca_photoComment").val('');
			this.$("#ca_mainFlag").attr('checked', false).closest('label').removeClass('checked');
			this.$("#ca_clothFlag").attr('checked', false).closest('label').removeClass('checked');

			clutil.cltxtFieldLimitReset($("#ca_photoTag"));
			clutil.cltxtFieldLimitReset($("#ca_photoComment"));
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

	});

	AMMSV1101PhotoView = Backbone.View.extend({
		events: {
			'click .btn.btn_img_up': "_onPhotoSelectClick",
			'click .picContainer.view .hover': '_onClickViewEdit',
			'change input[type=file]'		: '_onChangeFileSelection',
			'click .save': '_onSaveClick',
			'click .delete': '_onDeleteClick',
		},

		readonly: false,

		initialize: function(opt) {
			var defaults = {
				search_date: clcom.ope_date,			// 運用日
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);
		},

		initUIelement: function() {
			this.options = {
				maxFileSize: 512 * 1024,	// ファイルサイズ制限（暫定）
				immediately: true,
			};
		},

		render: function(photoRec, readonly) {
			this.readonly = readonly;
			// HTMLを追加
			var defaults = {
				photoID: 0,
				photoSeq: 0,
				photoFileID: 0,
				photoTag: "",
				photoComment: "",
				photoURL: "",
				mainFlag: 0,
				clothFlag: 0,
			};
			var rec = _.isUndefined(photoRec) ? defaults : _.defaults(photoRec, defaults);
			var html = _.template($("#ca_template_photo_view").html(), rec);
			//$photoFieldGroup.append(html);
			this.$el.html(html);

			clutil.initUIelement(this.$el);

			var $ul = this.$('ul.tag');
			// タグ
			var tags = null;
			if (rec.photoTag != null) {
				tags = rec.photoTag.split(',');
				for (var i = 0; i < tags.length; i++) {
					var tagHtml = '<li>' + tags[i] + '</li>';
					$ul.append(tagHtml);
				}
			}
			// メイン
			if (rec.mainFlag) {
				this.$('input[name="ca_mainFlag"]').attr('checked', true).closest('label').addClass('checked');
			} else {
				this.$('input[name="ca_mainFlag"]').attr('checked', false).closest('label').removeClass('checked');
			}
			// 生地
			if (rec.clothFlag) {
				this.$('input[name="ca_clothFlag"]').attr('checked', true).closest('label').addClass('checked');
			} else {
				this.$('input[name="ca_clothFlag"]').attr('checked', false).closest('label').removeClass('checked');
			}

			// リードオンリーの場合
			if (readonly) {
				var $hover = this.$el.find('div.hover');
				$hover.removeClass('hover');
			}


			// 表示部
			var $canvas = this.$('.picBox');
			this.dimension = {
				width: $canvas.width(),		//.innerWidth(),
				height: $canvas.height()	//.innerHeight()
			};

			// Img loading 関数セット
			var $img = this.$('img');
			$img.load(this._onImgLoaded);
			$img.error(this._onImgError);
		},

		/**
		 * メイン画像フラグのON/OFF
		 * @param flag
		 */
		setMainFlag: function(flag) {
			if (flag) {
				this.$('input[name="ca_mainFlag"]').attr('checked', true).closest('label').addClass('checked');
			} else {
				this.$('input[name="ca_mainFlag"]').attr('checked', false).closest('label').removeClass('checked');
			}
		},

		/**
		 * 生地フラグのON/OFF
		 * @param flag
		 */
		setClothFlag: function(flag) {
			if (flag) {
				this.$('input[name="ca_clothFlag"]').attr('checked', true).closest('label').addClass('checked');
			} else {
				this.$('input[name="ca_clothFlag"]').attr('checked', false).closest('label').removeClass('checked');
			}
		},

		/**
		 * 画像データを返す
		 */
		getPhotoRec: function() {
			var photoID = this.$('input[name="ca_photoID"]').val();
			var photoSeq = this.$('input[name="ca_photoSeq"]').val();
			var photoFileID = this.$('input[name="ca_photoFileID"]').val();
			var photoTag = this.$('input[name="ca_photoTag"]').val();
			var photoURL = this.$('input[name="ca_photoURL"]').val();
			var photoComment = this.$('textarea[name="ca_photoComment"]').val();
			var mainFlag = this.$('input[name="ca_mainFlag"]').prop('checked') ? 1 : 0;
			var clothFlag = this.$('input[name="ca_clothFlag"]').prop('checked') ? 1 : 0;
			var photoRec = {
				photoID: photoID,
				photoSeq: photoSeq,
				photoFileID: photoFileID,
				photoTag: photoTag,
				photoURL: photoURL,
				photoComment: photoComment,
				mainFlag: mainFlag,
				clothFlag: clothFlag,
			};
			return photoRec;
		},

		getPhotoSeq: function() {
			return this.$('input[name="ca_photoSeq"]').val();
		},

		/**
		 * 保存
		 * @param e
		 */
		_onSaveClick: function(e) {
			var $tgt = $(e.target);
			$tgt.parent().toggle();
			$tgt.parent().prev('.picContainer').css('display','inline-block');

			// タグの反映
			var $ul = this.$('ul.tag');
			$ul.empty();	// 一旦クリア
			var tag = this.$('input[name="ca_photoTag"]').val();
			var tags = tag.split(',');
			for (var i = 0; i < tags.length; i++) {
				var tagHtml = '<li>' + tags[i] + '</li>';
				$ul.append(tagHtml);
			}

			// コメントの反映
			var $comment = this.$('div.comment');
			var photoComment = this.$('textarea[name="ca_photoComment"]').val();
			$comment.text(photoComment);

			var photoSeq = this.$('input[name="ca_photoSeq"]').val();
			var mainFlag = this.$('input[name="ca_mainFlag"]').prop('checked') ? 1 : 0;
			var clothFlag = this.$('input[name="ca_clothFlag"]').prop('checked') ? 1 : 0;
			var args = {
				photoSeq: photoSeq,
				mainFlag: mainFlag,
				clothFlag: clothFlag,
			};
			if (mainFlag || clothFag) {
				clutil.mediator.trigger('onChangeFlag', args);
			}
		},

		/**
		 * 削除
		 * @param e
		 */
		_onDeleteClick: function(e) {
			var seqno = this.$('input[name="ca_photoSeq"]').val();
			var data = {
				photoSeq: seqno,
			};
			clutil.mediator.trigger('onDeletePhotoView', data, e); // 投げる

			// 自分を削除
			this.$el.remove();
		},

		_onClickViewEdit: function(e) {
			var $tgt = $(e.target);
			$tgt.parent().toggle();
			$tgt.parent().next('.picContainer.edit').css('display','inline-block');
		},

		_onPhotoSelectClick: function(e) {
			this.$('input[type=file]').trigger('click');
		},

		_onChangeFileSelection: function(e) {
			var $input = $(e.target);
			var file = e.target.files[0];
			console.log(file);
			var convert_pdf = 0;

			if (file == null) {
				// ファイルチューザーでキャンセル
				return;
			}
			// ファイルのコンテントタイプチェック
			if (!file.type.match(/^image\//) && !file.type.match(/\/pdf/)) {
				clutil.mediator.trigger('onTicker', '画像ファイルを選択してください。');
				return;
			}
			// ファイルサイズのチェック
			if (this.options.maxFileSize > 0 && file.size > this.options.maxFileSize) {
				var msg = 'ファイルサイズが大きすぎます。{0} 以下のファイルを選択してください。';
				var arg = (this.options.maxFileSize / 1024) + '[KB]';
				clutil.mediator.trigger('onTicker', clutil.fmt(msg, arg));
				return;
			}

			if (file.type.match(/\/pdf/)) {
				convert_pdf = 1;
			}

			// 即時アップロード
			if (this.options.immediately) {
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
			var $hidden = $(contentHiddenAttrHTML).appendTo($form);

			$hidden.val(JSON.stringify({
				filename: this.workingData.basename,
				convert_pdf: convert_pdf,
			}));

			clutil.blockUI(clcom.uploadDestUri);
			$form.ajaxSubmit({
				type: 'POST',
				dataType: 'json',
				contentType: 'multipart/form-data',
				url: clcom.uploadDestUri,
				success: this._onUploadSuccess,
				error: this._onUploadError,
				complete: this._onUploadComplete,
			});

			return true;
		},
		// アップロード成功
		_onUploadSuccess: function(data){
			var file = {
				id: data.id,
				uri: data.uri,
				filename: this.workingData.basename,
				localpath: this.workingData.localpath,
			};

			// アップロードデータ保存
			this.uploadedData = file;

			this.$('input[name="ca_photoFileID"]').val(data.id);
			this.$('input[name="ca_photoURL"]').val(data.uri);
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
				this.$('div.picPreview').css('background', '');
			}else{
				this.$('img').attr('src', url);
				this.$('div.picPreview').css('background', 'url(' + url + ')  no-repeat center center');
				this.$('div.picPreview').css('background-size', '50px');
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
	});

	AMMSV1101SelectorView = Backbone.View.extend({

		screenId : "AMMSV1100",
		dialogId : "AMMSV1101",
		categoryId : "AMMS",
		validator: null,

		curPhotoSeq: 0,

		events: {
			"click #ca_AMMSV1101_commit": "_onCommitClick",
		},

		initialize: function(opt) {
			var defaults = {
				search_date: clcom.ope_date,			// 運用日
			};
			var fixedOpt = _.isUndefined(opt) ? defaults : _.defaults(opt,defaults);
			_.extend(this, fixedOpt);
			_.bindAll(this);

			clutil.mediator.on('onAddPhoto', this._onAddPhoto);
			clutil.mediator.on('onDeletePhotoView', this._onDeletePhotoView);
			clutil.mediator.on('onChangeFlag', this._onChangeFlag);
		},

		// 初期データ取得後に呼ばれる関数
		initUIelement: function() {
			clutil.inputlimiter(this.$el);

			this.$('#mainColumninBox').addClass('noLeftColumn');
			this.$('#mainColumnFooter').addClass('noLeftColumn');

			clutil.initUIelement(this.$el);
		},

		/**
		 * 選択画面の初期化処理
		 *
		 * 初期化後にshow()の呼び出し前に必ず呼び出すこと
		 *
		 * @method render
		 * @for AMPAV0010SelectorView
		 */
		render: function() {
			var url = clcom.urlRoot + "/system/app/" + this.categoryId + "/" + this.screenId + "/" + this.dialogId + ".html";

			// HTMLソースを読み込む
			clutil.loadHtml(url, _.bind(function(data) {
				this.html_source = data;
			}, this));

			return this;
		},

		show: function(photoList, isSubDialog, options) {
			if (arguments.length === 1 && _.isObject(histList) && !_.isArray(histList)){
				options = photoList;
				photoList = options.photoList;
				isSubDialog = options.isSubDialog;
			}

			options || (options = {});

			this.options = _.extend({
				maxFileSize: 512 * 1024,	// ファイルサイズ制限（暫定）
				immediatry: true,
				readonly: false,
			}, options);

			// 最初のダイアログとして表示されている場合は他に開いているダイアログを空にする
			if (isSubDialog == null) {
				$('.cl_dialog').empty();
			}

			this.$parentView.hide();

			// htmlソースからダイアログを作成する
			this.$el.html('');
			this.$el.html(this.html_source);

			// 画面の初期化
			this.initUIelement();

			$('.cl_echoback').hide();
			// validatorエラー時の表示領域
			this.validator = clutil.validator(this.$('#ca_AMMSV1101_main'), {
				echoback		: $('.cl_echoback')
			});

			$photoFieldGroup = $("#photoFieldGroup");
			var _this = this;
			// 選択済み画像描画
			if (photoList != null) {
				$.each(photoList, function() {
					if (_this.curPhotoSeq < this.photoSeq) {
						_this.curPhotoSeq = this.photoSeq;
					}
					var name = 'photoViewArea' + this.photoSeq;
					var html = '<div class="flleft" name="' + name + '"></div>';
					$photoFieldGroup.append(html);

					var el = 'div[name="' + name + '"]';
					var newPhotoView = new AMMSV1101PhotoView({el: el});
					newPhotoView.initUIelement();
					newPhotoView.render(this, _this.options.readonly);
					newPhotoView.photoSeq = this.photoSeq;

					_this.AMMSV1101PhotoViewList.push(newPhotoView);
					newPhotoView.setImageURL(this.photoURL);
				});
			}

			this.AMMSV1101PhotoAdd = new AMMSV1101PhotoAddView({el: $("#div_photo_add")});
			this.AMMSV1101PhotoAdd.initUIelement();
			this.AMMSV1101PhotoAdd.render(this.options.readonly);
		},

		AMMSV1101PhotoViewList: [],

		/**
		 * 画像追加処理
		 * @param args
		 */
		_onAddPhoto: function(args) {
			/*
			 * メイン、生地フラグがオンの場合は既存画像のフラグを落とす
			 */
			_.each(this.AMMSV1101PhotoViewList, _.bind(function(v) {
				if (args.mainFlag) {
					// メイン画像フラグを落とす
					v.setMainFlag(0);
				}
				if (args.clothFlag) {
					// 生地画像フラグを落とす
					v.setClothFlag(0);
				}
			}, this));

			if (args.photoSeq == null || args.photoSeq == 0) {
				this.curPhotoSeq++;
				args.photoSeq = this.curPhotoSeq;
			} else {
				this.curPhotoSeq = args.photoSeq;
			}

			var name = 'photoViewArea' + this.curPhotoSeq;
			var html = '<div class="flleft" name="' + name + '"></div>';
			$photoFieldGroup.append(html);

			var el = 'div[name="' + name + '"]';
			var newPhotoView = new AMMSV1101PhotoView({el: el});
			newPhotoView.initUIelement();
			newPhotoView.render(args);
			newPhotoView.photoSeq = args.photoSeq;

			this.AMMSV1101PhotoViewList.push(newPhotoView);
			newPhotoView.setImageURL(args.photoURL);

			this.AMMSV1101PhotoAdd.clear();
		},

		_onDeletePhotoView: function(args, e) {
			var photoSeq = args.photoSeq;
			for (var i = 0; i < this.AMMSV1101PhotoViewList.length; i++) {
				if (this.AMMSV1101PhotoViewList[i].photoSeq == photoSeq) {
					this.AMMSV1101PhotoViewList.splice(i, 1);
					break;
				}
			}
		},

		/**
		 * フラグ更新イベント
		 * @param args
		 * @param e
		 */
		_onChangeFlag: function(args, e) {
			_.each(this.AMMSV1101PhotoViewList, _.bind(function(v) {
				var seq = v.getPhotoSeq();
				if (seq != args.photoSeq) {
					if (args.mainFlag) {
						// メイン画像フラグを落とす
						v.setMainFlag(0);
					}
					if (args.clothFlag) {
						// 生地画像フラグを落とす
						v.setClothFlag(0);
					}
				}
			}, this));
		},

		/**
		 * フォーカスの設定
		 */
		setFocus: function() {
			// フォーカスの設定
			clutil.setFocus(this.$('#ca_AMMSV1101_commit'));
		},

		/**
		 * 戻る
		 */
		_onCommitClick: function() {
			// データを収集
			var photoRecList = [];
			$.each(this.AMMSV1101PhotoViewList, function() {
				var photoRec = this.getPhotoRec();
				photoRecList.push(photoRec);
			});
			this.okProc(photoRecList);

			this.$parentView.show();
			this.$el.html('');
			clutil.leaveEnterFocusMode();
			clutil.enterFocusMode();

			// VIEWの刈り取り
			this.AMMSV1101PhotoAdd.remove();
			$.each(this.AMMSV1101PhotoViewList, function() {
				this.remove();
			});
			this.AMMSV1101PhotoViewList.length = 0;
		},

		/**
		 * 戻る処理コールバック
		 */
		okProc: function() {
			// 上位で上書きする
		},

	});
});