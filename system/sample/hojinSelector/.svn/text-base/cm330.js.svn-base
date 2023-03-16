$(function(){

	
	var sampledata = [{
		hojin_id : "1",
		hojin_cd : '0001',
		hojin_name : '法人１',
		hojin : ''
	},{
		hojin_id : "2",
		hojin_cd : '0002',
		hojin_name : '法人２',
		hojin : ''
	},{
		hojin_id : "3",
		hojin_cd : '0003',
		hojin_name : '法人３',
		hojin : ''
	}];
	
        //////////////////////////////////////////////
        // View
        HojinSelectorView = Backbone.View.extend({
                // 要素
                el                      : $('body'),

                validator: null,

                screenId : "cm330",
                
                // Eventes
                events: {
                	"click #ca_cm330_search"		:	"_onSearchClick",	// 検索ボタン押下時
                	"click #ca_cm330_cancel"		:	"_onCancelClick",	// キャンセルボタン押下時
                	"click #ca_cm330_commit"		:	"_onCommitClick",	// 確定ボタン押下時
                },

                initialize: function() {
                        _.bindAll(this);
                },
                
                
                initscreen: function() {
                    _.bindAll(this);
                    
                    // datepickerの初期化
                    this.ca_cm330_search_ymd = clutil.datepicker($('#ca_cm330_search_ymd'));
                    // 区分selectorの作成
                    clutil.cltypeselector($('#ca_cm330_houjin_type'), "gs_typename_FLAG");
                    clutil.cltypeselector($('#ca_cm330_gyotai_type'), "gs_typename_FLAG");

                    // validatorエラー時の表示領域
                    $('.cl_selector_echoback').hide();
                    this.validator = clutil.validator($('#ca_cm330_search_form'), {
            			echoback        : $('.cl_selector_echoback')
            		});
                    
                    // 検索条件を初期化しておく
                    this.searchCond = {};
                    
                    //ヘッダー,フッター部分は共通なのでhtmlに該当するidを振ること
    		        headerView = new HeaderView();
    		        footerView = new FooterView();
    		        
    		        // urlを更新しておく
    		        document.location = "#" + this.screenId;

                },
                
                show: function($area, $parentView) {
            		var url = "";
        			url = clcom.urlRoot + "/system/sample/hojinSelector/" + this.screenId + ".html";
        			console.log(url);
        			
        			var _this = this;
    				this.$area = $area;
    				this.$parentView = $parentView;
    			
    				$area.load(url, function(){
    					$parentView.hide();
        				$area.show();
        				
        				// 画面の初期化
        				_this.initscreen();
    				});
    				
        			return this;
            		
            	},

                render: function() {
                        return this;
                },
                
                // ページャーの初期化
                initPager: function(itemsOnPage, totalCount) {
                        var me = this;
                        $('#ca_cm330_pager').pagination({
                                items : totalCount,
                                itemsOnPage : itemsOnPage,
                                displaypanel : 'ca_cm330_pager_displaypanel',
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
            		// 画面の情報を取得する
                	var resultdata = clutil.view2data($('#ca_cm330_search_form'), "ca_cm330_");
                	this.searchcond = resultdata;
                	
                	this.onPageClick(1, pageCount, true, true);

                },
                
                // キャンセルボタン押下時
                _onCancelClick: function(e) {
                	this.$area.hide();
                	this.$parentView.show();
    				document.location = "#";
                },
                
                // 確定ボタン押下時
                _onCommitClick : function(e) {
                	var chkRec = $("input[name=ca_cm330_check]:checked");
                	var chkId = [];
                	for (var i = 0; i < chkRec.length; i++) {
            			// チェックされた項目idを追加していく
                		chkId.push(chkRec[i].parentElement.parentElement.id);
            		}
                	if (chkId.length > 0) {
                		this.$area.hide();
                		this.$parentView.show();
						this.okProc(this.getData(chkId));
        				document.location = "#";

                	} else {
                		
                	}
                },
                
                // 選択時処理  呼び出し側で override する
    			okProc : function(){
    				// 上位で上書きする。
    			},
    			
    			// Idより選択されたデータを取得 
    			getData : function(chkId){
    				var selectData = [];
    				for (var i = 0; i < this.appData.length; i++) {
    					var data = this.appData[i];
    					for (var j = 0; j < chkId.length; j++) {
    						var selectId = chkId[j];
        					if (data.hojin_id == selectId) {
        						selectData.push(data);
        						break;
        					}
        				}
    				}
    				return selectData;	
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
                        
//                        // データを取得
//                        var uri = 'sample_list';
//                        clutil.postJSON(uri, this.searchcond, _.bind(function(data, dataType) {
//                                if (dataType == 'success') {
//                                        var appData = data.result;

                        				// 確定時用にデータは保存しておく
                                        this.appData = sampledata;
                                        
                                        var no = 1;
				                        // 取得したデータを表示する
				                        $('#ca_cm330_tbody_div').empty();
				                        $.each(this.appData, function() {
				                        	this['no'] = no++;
				                        	$('#ca_cm330_tbody_template').tmpl(this).appendTo('#ca_cm330_tbody_div');
				                        });
				                        
                                        if (onSelect || onSearch) {
                                        	// テスト用
                                    		var totalCount = 200;
                                            // ページャーの初期化
                                            me.initPager(itemsOnPage, totalCount);
                                        }
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
        /** 1ページに表示する件数 */
        var pageCount = 10;
});
