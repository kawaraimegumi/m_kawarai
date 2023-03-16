$(function(){
	// body 部を隠す。
	$('body').hide();
		//////////////////////////////////////////////
		// View
		var ListView = Backbone.View.extend({
			// 要素
			el						: $('#ca_main'),

			validator: null,

			// Eventes
			events: {
				"click #ca_downld1"		:	"_onDownld1Click"
			},

			initialize: function() {
				_.bindAll(this);
				
				var _this = this;
				
				// validatorエラー時の表示領域
				$('.cl_echoback').hide();
				this.validator = clutil.validator(this.$el, {
					echoback		: $('.cl_echoback')
				});

				var fileInput = clutil.fileInput({
					files: [],
					fileInput: '#ca_upld',
					fileLabel: '#ca_label' 
				});
				
				fileInput
				.on('success', function (file) {
					// 一時サーバーにアップロード成功したときに呼ばれる。
					console.log('成功', file);
					// サーバーに送信するデータ
					// サーバーがアップロードしたファイルの処理に必要なfile.idを含める。
					// ※ あくまで例なので、データ形式は各APごとに定めてください。
					var request = {
						file_id: file.id
					};
					
					// バリデーターのクリア
					_this.validator.clear();
					
					// これをサーバーAPに送信する。ここのインターフェイスは各画面とサーバー間で決める
					clutil.postJSON('gsdi_bluetag', request, _.bind(function(data, dataType) {
						if (data.head.status == 0) {
							var chklist = data.chklist;
							
							// 取得したデータを表示する
							$('#ca_tbody_div').empty();
							$('#ca_tbody_template').tmpl(chklist).appendTo('#ca_tbody_div');
							
						} else {
							// ヘッダーにメッセージを表示
							_this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.head.message], data.head.args)});
						}
					}));
				});
			},

			// 初期データ取得後に呼ばれる関数
			initUIelement: function() {
				// 年月selectorの作成
				clutil.clmonthselector($('#ca_st_yyyynn'));
				clutil.clmonthselector($('#ca_ed_yyyynn'));
			},

			/**
			 * 画面描写
			 */
			render: function() {
					return this;
			},

			
			/**
			 * CSV出力ボタン click
			 */
			_onDownld1Click: function(){
				var resultdata = clutil.view2data($('#ca_search_form'));
				
				var request = {
					head : {
						dummy : 2
					},
					cond : resultdata,
					value: 3
				};
				
				// レスポンスにアクセス対象のURLを入れてもらう(data.urlは例です)。
				clutil.postJSON('gsdo_bluetag', request, function (data, dataType) {
					// clutil.download()を呼びだす。
					clutil.download(data.url);
				});
				
			}
		});
	ca_listView = new ListView();
	ca_listView.render();

	// 初期データを取る
//	clutil.getIniJSON(null, null, _.bind(function(data, dataType) {
		// 区分selectorを初期化する
		ca_listView.initUIelement();
		
		//ヘッダー,フッター部分は共通なのでhtmlに該当するidを振ること
//		headerView = new HeaderView();
//		footerView = new FooterView();
		
		$('body').show();
		
//	},this));

});
