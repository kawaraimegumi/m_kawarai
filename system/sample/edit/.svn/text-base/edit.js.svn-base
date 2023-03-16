$(function(){

	
	var sampledata1 = {
			appendedInputButton : "(株)エスビジョンエンタープライズ",
			store_name : 'お好み焼き屋本店　大阪梅田店',
			store_name_short : 'お好み　大阪梅田店',
		name : '（株）エスビジョンエンタープライズ',
		business_conditions : 'dummy1',
		fax : '0532-63-8003',
		optionsRadios : 'optionsRadios2'
	};
	
        //////////////////////////////////////////////
        // View
        var EditView = Backbone.View.extend({
                // 要素
                el                      : $('body'),

                validator: null,

                // Eventes
                events: {
                	"click #ca_back"		:	"_onBackClick",
                	"click #ca_update"		:	"_onUpdateClick",
                },

                initialize: function() {
                        _.bindAll(this);
                        
                        // validatorエラー時の表示領域
                        $('.cl_echoback').hide();
                        this.validator = clutil.validator(this.$el, {
                			echoback        : $('.cl_echoback')
                		});
                        

                },

                render: function() {
                        return this;
                },
                
                _onBackClick: function() {
                	document.location = '../list/list.html';
                    return this;
                },
            
	            _onUpdateClick: function() {
	            	// validation
            		if(!this.validator.valid()) {
            			return this;
            		}
            		// 画面の情報を取得する
                	var resultdata = clutil.view2data($('#ca_base_form'));
                	
//                  // データを更新する
//                  var uri = 'partner/link/search';
//                  clutil.postJSON(uri, resultdata, _.bind(function(data, dataType) {
//                          if (data.head.status == 'success') {
//                                  var appData = data.body;

                					document.location = '../list/list.html';
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
	                return this;
	            },


        });
        ca_editView = new EditView();
        ca_editView.render();

        // body 部を隠す。
        $('body').hide();

        ////////////////////////////////////////////////

        // 初期データを取る

     // pageArgs が空の場合は元の画面へ移動
//        if (clcom.pageArgs == null) {
//                document.location = '../list/list.html';
//        }

        // 初期データrequestの設定
//        var data = {
//        		id : clcom.pageArgs.id
//        };
        
//        appCallback = function(data, dataType) {
//                if (data.head.status == 'success') {
//                        var appData = data.body;

                        // 取得したデータを表示する
//                        ca_editView.onPageClick(1, pageCount, true); // 初期化なのでtrueを渡す

//                        // 完了 - この時点で、kitcom データは取得されてきている。
//                        headerView.render();
//                        // 初期データが準備できたらbody部を表示
        
        				clutil.data2view($('#ca_base_form'), sampledata1);
        				// 表示の場合は読み取り専用
//        				if (clcom.pageArgs.update_type == 'detail') {
//            				clutil.viewReadonly($('#ca_base_form'));
//        				}
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
