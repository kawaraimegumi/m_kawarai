$(function(){
	
        //////////////////////////////////////////////
        // View
        var SelectorView = Backbone.View.extend({
                // 要素
                el                      : $('#ca_main'),

                validator: null,

                // Eventes
                events: {

                },

                initialize: function() {
                        _.bindAll(this);
                },
                
                // 初期データ取得後に呼ばれる関数
                initUIelement: function() {
                    // 法人選択サブ画面配置
                    this.cm330Selector = new cm330SelectorView({
                    	el : $('#ca_cm330selectorarea'), 	// 配置場所
                    });
                    this.cm330Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm330_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm330_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm330_name'),			// 名前inputのオブジェクト
                    		1									// 区分指定をする場合（指定なしでもOK）
                    	);
                    // 選択サブ画面復帰処理
                	this.cm330Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// 店舗選択サブ画面配置
                    this.cm340Selector = new cm340SelectorView({
                    	el : $('#ca_cm340selectorarea'), 	// 配置場所
                    });
                    this.cm340Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm340_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm340_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm340_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm340Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// 部署選択サブ画面配置
                    this.cm350Selector = new cm350SelectorView({
                    	el : $('#ca_cm350selectorarea'), 	// 配置場所
                    });
                    this.cm350Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm350_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm350_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm350_name'),			// 名前inputのオブジェクト
                    		1									// 区分指定をする場合（指定なしでもOK）
                    		);
                    // 選択サブ画面復帰処理
                	this.cm350Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// FC店舗契約選択サブ画面配置
                    this.cm360Selector = new cm360SelectorView({
                    	el : $('#ca_cm360selectorarea'), 	// 配置場所
                    });
                    this.cm360Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm360_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm360_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm360_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm360Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
    				

                	// メニュー選択サブ画面配置
                    this.cm370Selector = new cm370SelectorView({
                    	el : $('#ca_cm370selectorarea'), 	// 配置場所
                    });
                    this.cm370Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm370_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm370_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm370_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm370Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// レシピ選択サブ画面配置
                    this.cm380Selector = new cm380SelectorView({
                    	el : $('#ca_cm380selectorarea'), 	// 配置場所
                    });
                    this.cm380Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm380_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm380_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm380_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm380Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                    
                	// 食材選択サブ画面配置
                    this.cm390Selector = new cm390SelectorView({
                    	el : $('#ca_cm390selectorarea'), 	// 配置場所
                    });
                    this.cm390Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm390_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm390_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm390_name'),			// 名前inputのオブジェクト
                    		1		// 区分指定をする場合（指定なしでもOK）
                    );
                    // 選択サブ画面復帰処理
                	this.cm390Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// 品目選択サブ画面配置
                    this.cm400Selector = new cm400SelectorView({
                    	el : $('#ca_cm400selectorarea'), 	// 配置場所
                    });
                    this.cm400Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm400_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm400_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm400_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm400Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// 社員選択サブ画面配置
                    this.cm410Selector = new cm410SelectorView({
                    	el : $('#ca_cm410selectorarea'), 	// 配置場所
                    });
                    this.cm410Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm410_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm410_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm410_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm410Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// 企画選択サブ画面配置
                    this.cm420Selector = new cm420SelectorView({
                    	el : $('#ca_cm420selectorarea'), 	// 配置場所
                    });
                    this.cm420Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm420_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm420_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm420_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm420Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// 業務アプリ選択サブ画面配置
                    this.cm430Selector = new cm430SelectorView({
                    	el : $('#ca_cm430selectorarea'), 	// 配置場所
                    });
                    this.cm430Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm430_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm430_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm430_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm430Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// 銀行選択サブ画面配置
                    this.cm440Selector = new cm440SelectorView({
                    	el : $('#ca_cm440selectorarea'), 	// 配置場所
                    });
                    this.cm440Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm440_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm440_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm440_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm440Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// メーカー選択サブ画面配置
                    this.cm450Selector = new cm450SelectorView({
                    	el : $('#ca_cm450selectorarea'), 	// 配置場所
                    });
                    this.cm450Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm450_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm450_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm450_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm450Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// 棚選択サブ画面配置
                    this.cm460Selector = new cm460SelectorView({
                    	el : $('#ca_cm460selectorarea'), 	// 配置場所
                    });
                    this.cm460Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm460_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm460_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm460_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm460Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// 工場選択サブ画面配置
                    this.cm470Selector = new cm470SelectorView({
                    	el : $('#ca_cm470selectorarea'), 	// 配置場所
                    });
                    this.cm470Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm470_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm470_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm470_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm470Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// 経理用分類選択サブ画面配置
                    this.cm480Selector = new cm480SelectorView({
                    	el : $('#ca_cm480selectorarea'), 	// 配置場所
                    });
                    this.cm480Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm480_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm480_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm480_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm480Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
    				
    				// 科目選択サブ画面配置
                    this.cm490Selector = new cm490SelectorView({
                    	el : $('#ca_cm490selectorarea'), 	// 配置場所
                    });
                    this.cm490Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_cm490_code'),			// コードinputのオブジェクト
                    		this.$('#ca_cm490_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_cm490_name')			// 名前inputのオブジェクト
                    		);
                    // 選択サブ画面復帰処理
                	this.cm490Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                	
                	// 材料選択サブ画面配置
                    this.KA241Selector = new KA241SelectorView({
                    	el : $('#ca_KA241selectorarea'), 	// 配置場所
                    });
                    this.KA241Selector.render(
                    		$('#ca_main'),				// 親view
                    		clutil.cl_single_select,	// 複数選択モード
                    		null,						// 検索日
                    		this.$('#ca_KA241_code'),			// コードinputのオブジェクト
                    		this.$('#ca_KA241_select'),			// ボタンbuttonのオブジェクト
                    		this.$('#ca_KA241_name')			// 名前inputのオブジェクト
                    		// 食材区分を指定する場合は最後の引数に区分を指定		
                    );
                    // 選択サブ画面復帰処理
                	this.KA241Selector.okProc = function(data){
    					if (data != null && data.length == 1) {
    						// idなどｗ保存しておきたい場合はここで処理を行う
    					}
    					document.location = "#";
    				};
                },
                render: function() {
                        return this;
                },
        });
        ca_selectorView = new SelectorView();
        ca_selectorView.render();

        // body 部を隠す。
        $('body').hide();

        clutil.getIniJSON(null, null, function(data, dataType) {
            $('body').show();
            // 区分値を取得
            ca_selectorView.initUIelement();
        });
        //////////////////////////////////////////////
        //ヘッダー,フッター部分は共通なのでhtmlに該当するidを振ること
        headerView = new HeaderView();
        footerView = new FooterView();

//        {
//        	var excel = new ActiveXObject("Excel.Application");
//        	 var excel_file = excel.Workbooks.Open("C:\\tmp\\Table.xlsx");
//        	 var excel_sheet = excel.Worksheets("Sheet1");
//        	 var data = excel_sheet.Cells(3,3).Value;
//        	 var data11 = excel_sheet.Cells(1,1).Value;
//        	console.log("excel:"+data11);
//        }
        
        
});
