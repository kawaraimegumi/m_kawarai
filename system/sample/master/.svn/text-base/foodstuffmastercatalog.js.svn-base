$(function(){

	
//	var sampledata = [{
//		id : "1",
//		no : '1',
//		code : '0001',
//		name : '（株）エスビジョンエンタープライズ',
//		tel : '0532-63-8002',
//		fax : '0532-63-8003'
//	},{
//		id : "2",
//		no : '2',
//		code : '0002',
//		name : '（株）エスビジョンエンタープライズ',
//		tel : '0532-63-8002',
//		fax : '0532-63-8003'
//	},{
//		id : "3",
//		no : '3',
//		code : '0003',
//		name : '（株）エスビジョンエンタープライズ',
//		tel : '0532-63-8002',
//		fax : '0532-63-8003'
//	}];
	
        //////////////////////////////////////////////
        // View
        var ListView = Backbone.View.extend({
                // 要素
                el                      : $('body'),

                validator: null,

                // Eventes
                events: {
                	"click #ca_search"		:	"_onSearchClick",	// 検索ボタン押下時
                    "click #ca_delete"		:	"_onDeleteClick",	// 削除ボタン押下時
                    "click .ca_detail"		:	"_onDetailClick",	// 表示ボタン押下時
                    "click .ca_edit"		:	"_onEditClick"		// 更新ボタン押下時
                        
                },

                initialize: function() {
                        _.bindAll(this);
                        
                        // datepickerの初期化
                        this.ca_st_iymd = clutil.datepicker($('#ca_st_iymd'));
                        this.ca_ed_iymd = clutil.datepicker($('#ca_ed_iymd'));
                        
                        // validatorエラー時の表示領域
                        $('.cl_echoback').hide();
                        this.validator = clutil.validator(this.$el, {
                			echoback        : $('.cl_echoback')
                		});
                        
                        // 検索条件を初期化しておく
                        this.searchCond = {};

                },

                render: function() {
                        return this;
                },
                
                // ページャーの初期化
                // TODO:ページャーを隠蔽できない？？
                initPager: function(itemsOnPage, totalCount) {
                        var me = this;
                        $('#ca_pager').pagination({
                                items : totalCount,
                                itemsOnPage : itemsOnPage,
                                displaypanel : 'ca_pager_displaypanel',
                                onPageClick: function(pageNumber, itemsOnPage) {
                                	// ページ変更時
                                    me.onPageClick(pageNumber, itemsOnPage, false, false);
                                },
                                onSelectChange: function(itemsOnPage) {
                                	// 表示件数変更時
                                    me.onPageClick(1, itemsOnPage, true, false);
                                },
                        });

                },
                
                // 検索ボタン押下時
                _onSearchClick: function() {
                	// validation
            		if(!this.validator.valid()) {
            			return this;
            		}
            		// 期間反転チェック
            		if(!this.validator.validDate('ca_st_iymd', 'ca_ed_iymd')) {
            			return this;
            		}
            		// 画面の情報を取得する
                	var resultdata = clutil.view2data($('#ca_search_form'));
                	this.searchcond = resultdata;
                	
                	this.onPageClick(1, pageCount, true, true);

                },
                
                // 削除ボタン押下時
                _onDeleteClick: function() {
                	var chkRec = $("input[name=ca_del_chk]:checked");
                	var chkId = [];
                	for (var i = 0; i < chkRec.length; i++) {
            			// チェックされた項目idを追加していく
                		chkId.push(chkRec[i].parentElement.parentElement.id);
            		}
                	if (chkId.length > 0) {
                		// サーバーに接続して削除処理を行う
//                  clutil.postJSON(uri, pagedata, _.bind(function(data, dataType) {
//                          if (data.head.status == 'success') {
//                                  var appData = data.body;
//                          } else {
//                                  // TODO:エラー
//                                  switch (data.head.message) {
//                                  case 'com_sys_error': // その他のエラー
//                                  default:
//                                          // システムエラーページへ
//                                          kitcom.transferTo('syserror', null, null);
//                                          break;
//                                  }
//                          }
//                  }, this));

                	}
                },
                
                // 表示ボタン押下時
                _onDetailClick: function(e) {
                	// クリックされた行のIDを取得しておく
                    var tr = $(e.target).parent().parent();
                    var corp_id = tr[0].id;
                    
                    clcom.transfer('../edit/edit.html', {
                    	id : corp_id,
                    	update_type : 'detail'
                    });
                },
                
                // 編集ボタン押下時
                _onEditClick : function(e) {
                	// クリックされた行のIDを取得しておく
                    var tr = $(e.target).parent().parent();
                    var corp_id = tr[0].id;
                    
                    clcom.transfer('../edit/edit.html', {
                    	id : corp_id,
                    	update_type : 'edit'
                    });
                },
                
                // ページャークリック
                onPageClick: function(pageNumber, itemsOnPage, onSelect, onSearch) {
                        var me = this;
                        var index = itemsOnPage * (pageNumber - 1);
                        var pagedata = {
                                index : index,          // index番目のデータから
                                count : itemsOnPage,      // 1ページに表示する件数を要求
                        };
                        if (onSearch) {
                        	// 検索条件を設定する
                        }
                        
                        // データを取得
//                        var uri = 'sample_list';
//                        clutil.postJSON(uri, this.searchcond, _.bind(function(data, dataType) {
//                                if (dataType == 'success') {
//                                        var appData = data.result;
//
//                                        var no = 1;
//				                        // 取得したデータを表示する
//				                        $('#ca_tbody_div').empty();
//				                        $.each(appData, function() {
//				                        	this['no'] = no++;
//				                        	$('#ca_tbody_template').tmpl(this).appendTo('#ca_tbody_div');
//				                        });
//				                        
//                                        if (onSelect || onSearch) {
//                                        	// テスト用
//                                    		var totalCount = 200;
//                                            // ページャーの初期化
//                                            me.initPager(itemsOnPage, totalCount);
//                                        }
//                                } else {
//                                        // TODO:エラー
//                                        switch (data.messageArg) {
//                                        case 'com_sys_error': // その他のエラー
//                                        default:
//                                                // システムエラーページへ
//                                                break;
//                                        }
//                                }
//                        }, this));
                },


        });
        ca_listView = new ListView();
        ca_listView.render();

        // body 部を隠す。
        $('body').hide();

        ////////////////////////////////////////////////

        // 初期データを取る
        /** 1ページに表示する件数 */
        var pageCount = 10;

//        appCallback = function(data, dataType) {
//                if (data.head.status == 'success') {
//                        var appData = data.body;

                        // 取得したデータを表示する
//                        ca_listView.onPageClick(1, pageCount, true); // 初期化なのでtrueを渡す

//                        // 完了 - この時点で、kitcom データは取得されてきている。
//                        headerView.render();
//                        // 初期データが準備できたらbody部を表示
                        $('body').show();
//                } else {
//                        // TODO:エラー
//                        switch (data.head.message) {
//                        case 'com_sys_error': // その他のエラー
//                        default:
//                                // システムエラーページへ
//                                kitcom.transferTo('syserror', null, null);
//                                break;
//                        }
//                }
//        };
//
//        var uri = 'home';
//        // 初期データを取る
//        clutil.getIniJSON(uri, appCallback, function(data, dataType) {
//        });



        //////////////////////////////////////////////
        //ヘッダー,フッター部分は共通なのでhtmlに該当するidを振ること
        headerView = new HeaderView();
        footerView = new FooterView();

});
