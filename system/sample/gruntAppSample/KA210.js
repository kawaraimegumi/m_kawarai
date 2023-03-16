$(function(){

  //////////////////////////////////////////////
  // View
  var ListView = Backbone.View.extend({
    // 要素
    el                      : $('#ca_main'),

    validator: null,
    
    //XXX:ヘッダ下のボタンどうする？
    // Eventes
    events: {
      "click #ca_search"		:	"_onSearchClick",		// 検索ボタン
      
      "click #ca_edit"		:	"_onEditClick",			// 編集ボタン
      "click #ca_delete"		:	"_onDeleteClick",		// 削除ボタン
      "click #ca_ref"			:	"_onRefClick",			// 参照ボタン
      
      "click #ca_back"		:	"_onBackClick",			// 戻るボタン
      "click #ca_entry"		:	"_onEntryClick",		// 新規登録ボタン
      "click #ca_csvout"		:	"_onCsvOutClick"		// CSV出力ボタン
    },

    initialize: function() {
      _.bindAll(this);
      
      // datepickerの初期化
      this.ca_st_ymd = clutil.datepicker($('#ca_st_ymd'));
      this.ca_ed_ymd = clutil.datepicker($('#ca_ed_ymd'));
      
      // validatorエラー時の表示領域
      $('.cl_echoback').hide();
      this.validator = clutil.validator(this.$el, {
        echoback        : $('.cl_echoback')
      });
      
      // 検索条件を初期化しておく
      this.searchCond = {};
      // 検索で返されるデータ置き場
      this.searchData = {};
      
    },

    // 初期データ取得後に呼ばれる関数
    initUIelement: function() {
      // 区分selectorの作成 FIXME:業態区分、レシピ単位に差し替える
      clutil.cltypeselector($('#ca_business_id'), "gs_typename_FLAG");
      clutil.cltypeselector($('#ca_uom_id'), "gs_typename_FLAG");
    },

    /**
     * 画面描写
     */
    render: function() {
      return this;
    },

    /**
     * ページャーの初期化
     * @param itemsOnPage 
     * @param totalCount
     */
    initPager: function(itemsOnPage, totalCount) {
      var _this = this;
      $('#ca_pager').pagination({
        items : totalCount,
        itemsOnPage : itemsOnPage,
        displaypanel : 'ca_pager_displaypanel',
        onPageClick: function(pageNumber, itemsOnPage) {
          // ページ変更時
          _this.onPageClick(pageNumber, itemsOnPage, false);
        },
        onSelectChange: function(itemsOnPage) {
          // 表示件数変更時
          _this.onPageClick(1, itemsOnPage, true);
        }
      });
    },
    
    /**
     * 検索ボタン click
     */ 
    _onSearchClick: function() {
      // validation
      if(!this.validator.valid()) {
        return this;
      }
      // 期間反転チェック
      var chkInfo = [];
      chkInfo.push({
        stval : 'ca_st_ymd', 
        edval : 'ca_ed_ymd'
      });
      if(!this.validator.validFromTo(chkInfo)){
        return this;
      }
      
      // 画面の情報を取得する
      var resultdata = clutil.view2data($('#ca_search_form'));
      this.req = {
        rtype : gs_ka_material_if.GS_MATERIAL_RTYPE_LIST,
        cond : resultdata
      };
      this.searchCond = resultdata;
      
      this.onPageClick(1, pageCount, true);

    },
    
    /**
     * 予約編集ボタン click
     */
    _onEditClick : function(e) {
      // クリックされた行のIDを取得する
      var chkId = this.getdata();
      //if (chkId.length > 0) {
      var material_id = this.getdata();
      var args = {
	ope_mode : gs_ka_material_if.GS_MATERIAL_RTYPE_UPD,
	material_id : material_id
      }
      // 画面の情報を取得する
      var resultdata = clutil.view2data($('#ca_search_form'));
      var data = {
	cond : resultdata
      }
      
      clcom.pushPage(
	'../KA220/KA220.html', 	// 遷移先url
	args,					// 画面引数
	data					// 保存データ
      );
      // }
    },

    /**
     * 予約削除ボタン click
     */
    _onDeleteClick: function() {
      // クリックされた行のIDを取得する
      var chkId = this.getdata();
      if (chkId.length > 0) {
	var material_id = this.getdata();
	var args = {
	  ope_mode : gs_ka_material_if.GS_MATERIAL_RTYPE_DEL,
	  material_id : material_id
	}
	// 画面の情報を取得する
	var resultdata = clutil.view2data($('#ca_search_form'));
	var data = {
	  cond : resultdata
	}
	
	clcom.pushPage(
	  '../KA220/KA220.html', 	// 遷移先url
	  args,					// 画面引数
	  data					// 保存データ
	);
      }
    },
    
    /**
     * 参照ボタン click
     */
    _onRefClick : function(){
      // クリックされた行のIDを取得する
      var chkId = this.getdata();
      if (chkId.length > 0) {
	var material_id = this.getdata();
	var args = {
	  ope_mode : gs_ka_material_if.GS_MATERIAL_RTYPE_SEARCH,
	  chkId : chkId
	}
	// 画面の情報を取得する
	var resultdata = clutil.view2data($('#ca_search_form'));
	var data = {
	  cond : resultdata
	}
	
	clcom.pushPage(
	  '../KA220/KA220.html', 	// 遷移先url
	  args,					// 画面引数
	  data					// 保存データ
	);
      }
    },
    
    /**
     * 選択された行のIDを取得する
     */
    getdata : function(){
      var chkRec = $("#ca_tbody_div input[name=ca_del_chk]:checked");
      var chkId = [];
      for (var i = 0; i < chkRec.length; i++) {
        // チェックされた項目idを追加していく
        chkId.push(chkRec[i].parentElement.parentElement.id);
      }
      return chkId;
    },
    
    /**
     * 戻るボタンclick
     */
    _onBackClick: function(){
      //TODO
    },

    /**
     * 新規登録ボタン click
     */
    _onEntryClick: function(){
      var args = {
        ope_mode : gs_ka_material_if.GS_MATERIAL_RTYPE_ADD
      }
      // 画面の情報を取得する
      var resultdata = clutil.view2data($('#ca_search_form'));
      var data = {
        cond : resultdata
      }
      
      clcom.pushPage(
        '../KA220/KA220.html', 	// 遷移先url
        args,					// 画面引数
        data					// 保存データ
      );
    },

    /**
     * TODO:CSV出力ボタン click
     */
    _onCsvOutClick: function(){
      //出力方法
      return this;
    },

    // ページャークリック
    onPageClick: function(pageNumber, itemsOnPage, onSelectOrSearch) {
      var _this = this;
      var index = (itemsOnPage * (pageNumber - 1)) + 1;
      var pagedata = {
        currentPage : index,          // index番目のデータから
        pageRec : itemsOnPage,      // 1ページに表示する件数を要求
      };

      this.req.page = pagedata;

      // データを取得
      var uri = 'ka_material';
      clutil.postJSON(uri, this.req, _.bind(function(data, dataType) {
        if (data.head.status == data.head._.GS_PROTO_RES_COMMON_STATUS_OK) {
          var appdata = data.body;
          _this.searchData = appdata.rsp_data;

          var no = 1;
	  // 取得したデータを表示する
	  $('#ca_tbody_div').empty();
	  $.each(_this.searchData, function() {
	    this['no'] = no++;
	    // TODO:区分名の取得
	    this['material_sw_disp'] = clutil.gettypename("gs_typename_MENU_SW", this.material_sw);
	    this['uom_id_disp'] = clutil.gettypename("gs_typename_MENU_SW", this.uom_id);
	  });
	  $('#ca_tbody_template').tmpl(_this.searchData).appendTo('#ca_tbody_div');
          if (onSelectOrSearch) {
            // 総レコード数
            var totalRec = appdata.page.totalRec;
            
            // ページャーの初期化
            _this.initPager(itemsOnPage, totalRec);
          }
        } else {
          // ヘッダーにメッセージを表示
          this.validator.setErrorInfo({_eb_: clutil.fmtargs(clmsg[data.head.message], data.head.args)});
        }
      }, this));
    },


  });
  ca_listView = new ListView();
  ca_listView.render();

  var cond = {};

  // body 部を隠す。
  $('body').hide();

  ////////////////////////////////////////////////

  // 初期データを取る
  /** 1ページに表示する件数 */
  var pageCount = 10;

  //////////////いらなくなったら消す/////////
  //        appCallback = function(data, dataType) {
  //                if (data.head.status == 'success') {
  //                        var appData = data.body;
  //                         //取得したデータを表示する
  //                        ca_listView.onPageClick(1, pageCount, true); // 初期化なのでtrueを渡す
  //
  //                        // 完了 - この時点で、kitcom データは取得されてきている。
  //                        headerView.render();
  //                        // 初期データが準備できたらbody部を表示
  //
  //						// 区分selectorを初期化する
  //
  //						$('body').show();
  //                } else {
  //                        switch (data.head.message) {
  //                        case 'com_sys_error': // その他のエラー
  //                        default:
  //                                // システムエラーページへ
  //                                kitcom.transferTo('syserror', null, null);
  //                                break;
  //                        }
  //                }
  //        };
  //////////////ここまで///////////////////////

  //        //初期uri
  //        var uri = '';
  // 初期データを取る
  clutil.getIniJSON(null, null, _.bind(function(data, dataType) {
    // 区分selectorを初期化する
    ca_listView.initUIelement();
    //とりあえず登録から戻ってきた場合
    if(clcom.pageData != null){//FIXME:値がとれていない？(popで戻ってきたとき)
      ca_listView.searchCond = clcom.pageData.cond;
      var cond = ca_listView.searchCond;
      clutil.data2view(ca_listView.$('#ca_search_form'), ca_listView.searchCond);
      ca_listView.req = {
        rtype : gs_ka_material_if.GS_MATERIAL_RTYPE_SEARCH,
        cond : ca_listView.searchCond
      };
      ca_listView.onPageClick(1, pageCount, true);
    };
    $('body').show();
  },this));
  //////////////////////////////////////////////
  //ヘッダー,フッター部分は共通なのでhtmlに該当するidを振ること
  headerView = new HeaderView();
  footerView = new FooterView();
});
