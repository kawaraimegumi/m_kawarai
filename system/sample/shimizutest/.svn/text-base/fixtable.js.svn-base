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
				"click #ca_display1"		:	"onDisplay1Click",
				"click #ca_save"			:	"onSaveClick",
				"click #ca_read"			:	"onReadClick"
				
			},

			initialize: function() {
				_.bindAll(this);
			},

			// 初期データ取得後に呼ばれる関数
			initUIelement: function() {
				
			},
			
			onDisplay1Click: function() {
				$('#ca_table').empty();
				var html_source = '<colgroup>';
				
				// 列幅
				var colWidth = Number($('#ca_colWidth').val());
				colWidth = colWidth != 0 ? colWidth : 100;
				console.log("列幅=" + colWidth);
				// 縦軸
				var vfixedCol = Number($('#ca_vfixedCol').val());
				vfixedCol = vfixedCol != null ? vfixedCol : 0;
				console.log("縦軸=" + vfixedCol);
				// 横軸
				var hfixedCol = Number($('#ca_hfixedCol').val());
				hfixedCol = hfixedCol != null ? hfixedCol : 0;
				console.log("横軸=" + hfixedCol);
				// 表示項目
				var displayCol = Number($('#ca_displayCol').val());
				displayCol = displayCol != null ? displayCol : 0;
				console.log("表示項目=" + displayCol);
				
				// 縦軸
				for (var i = 0; i < vfixedCol; i++) {
					html_source += '<col width="' + colWidth + 'px">';
				}
				
				// 表示項目
				for (var j = 0; j < displayCol; j++) {
					html_source += '<col width="' + colWidth + 'px">';
				}
				
				html_source += '</colgroup>';
				html_source += '<thead>';
				html_source += '<tr>';
				
				// 縦軸
				for (var i = 0; i < vfixedCol; i++) {
					html_source += '<th>' + '縦軸' + i + '</th>';
				}
				// 表示項目
				for (var i = 0; i < displayCol; i++) {
					html_source += '<th>' + '表示項目' + i + '</th>';
				}

				html_source += '</tr>';
				html_source += '</thead>';
				
				html_source += '<tbody>';
				
				for (var i = 0; i < 20; i++) {
					html_source += '<tr>';
					
					for (var j = 0; j < vfixedCol+displayCol; j++) {
//						html_source += '<td name="' + i + j + '">' + 'body' + i + j + '</td>';
						html_source += '<td><input name="' + i + j + '" value=body' + i + j + '></td>';
					}

					html_source += '</tr>';
				}
				
				
				html_source += '</tbody>';
				

				$('#ca_table').html(html_source);
				
				
				
				// テーブルヘッダ固定(fixedheadertable)
				$('#ca_table').fixedHeaderTable('destroy');
				$('#ca_table').fixedHeaderTable({height: 300, fixedColumns: vfixedCol});
                
			},

			/**
			 * 条件保存
			 */
			onSaveClick: function() {
				var value = clutil.tableview2data($('#ca_table> tbody').children());
				console.log("value = " + value);
				
				download(new Blob([JSON.stringify(value)]), 'hello.txt');
				
			},
			
			download: function(blob, filename) {
				  var objectURL = (window.URL || window.webkitURL).createObjectURL(blob),
				      a = document.createElement('a');
				      e = document.createEvent('MouseEvent');

				  //a要素のdownload属性にファイル名を設定
				  a.download = filename;
				  a.href = objectURL;

				  //clickイベントを着火
				  e.initEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
				  a.dispatchEvent(e);
			},
			/**
			 * 条件読込
			 */
			onReadClick: function() {
			},
			
			/**
			 * 画面描写
			 */
			render: function() {
					return this;
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
