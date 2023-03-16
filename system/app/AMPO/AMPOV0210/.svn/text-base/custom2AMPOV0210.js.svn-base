useSelectpicker2();

$(function(){

	// 字数制限エラー等の刈取り防止
	$.inputlimiter.noTrim = true;
	clutil.enterFocusMode($('body'));

	var emptyRec = {
			styleOptTypeID: null,
			poOptTypeID:null,
			optionID:null,
			seq: null,
			comment: null,
			optHinban: null,
			costTypeID: null,
			cost:null,
			optStDate: null,
			optEdDate: null,
			optOrdStopDate: null

	};
	// テーブルのヘッダ
	var columns1 = [
	                {
	                	id: "seq",
	                	name: " No",
	                	field: "seq",
	                	width: 70,
	                	minWidth: 70,
	                	cssClass: 'txtalign-right',		// 右寄せ,
	                	cellType: {
	                		type: "text",
	                		editorOptions: {
	                			addClass: 'txtar'		// エディタ：右寄せ
	                		},
	                		// エディタ作成前に呼ばれる. falseをリターンでエディタの作成を行わない
	                		isEditable: function(item, row, column, dataView){
	                			if (item.optionID && item.optionID>0){
	                				return false;
	                			}
	                		},
	                		validator: ['required', 'digit', 'maxlen:4']
	                	}
	                },
	                {
	                	id: "comment",
	                	name: " 内容",
	                	field: "comment",
	                	width: 400,
	                	cellType: {
	                		type: "text",
	                		editorOptions: {
	                		},
	                		validator: ['required',  'maxlen:30']
	                	}
	                },
	                {
	                	id: "optHinban",
	                	name: " オプション品番",
	                	field: "optHinban",
	                	width: 110,
	                	cssClass: 'txtalign-right',		// 右寄せ,
	                	cellType: {
	                		type: "text",
	                		editorOptions: {
	                			addClass: 'txtar'		// エディタ：右寄せ
	                		},
	                		// エディタ作成前に呼ばれる. falseをリターンでエディタの作成を行わない
	                		isEditable: function(item, row, column, dataView){
	                			if (item.optionID && item.optionID>0){
	                				return false;
	                			}
	                		},
	                		validator: ['required',  "alnum",'maxlen:8']
	                	}
	                },
	                {
	                	id: "costTypeID",
	                	name: "費用区分",
	                	field: "costTypeID",
	                	width: 140,
	                	minWidth: 140,
	                	cellType: {
	                		type: "cltypeselector",
	                		editorOptions: {
	                			kind: amcm_type.AMCM_TYPE_COST_TYPE
	                		},
	                		validator: 'required'
	                	}
	                },
	                {
	                	id: "optStDate",
	                	name: "適用開始日",
	                	field: "optStDate",
	                	width: 160,
	                	minWidth: 160,
	                	cellType: {
	                		type: "date",
	                		validator: 'required'
	                	},

	                },
	                {
	                	id: "optEdDate",
	                	name: "適用終了日",
	                	field: "optEdDate",
	                	width: 160,
	                	minWidth: 160,
	                	cellType: {
	                		type: "date",
	                		validator: 'required'
	                	},

	                },
	                {
	                	id: "optOrdStopDate",
	                	name: "発注停止日",
	                	field: "optOrdStopDate",
	                	width: 160,
	                	minWidth: 160,
	                	cellType: {
	                		type: "date"
	                	}
	                }
	                ];

	// テーブルのヘッダ
	var columns2 = [
	                {
	                	id: "seq",
	                	name: " No",
	                	field: "seq",
	                	width: 70,
	                	minWidth: 70,
	                	cssClass: 'txtalign-right',		// 右寄せ,
	                	cellType: {
	                		type: "text",
	                		editorOptions: {
	                			addClass: 'txtar'		// エディタ：右寄せ
	                		},
	                		// エディタ作成前に呼ばれる. falseをリターンでエディタの作成を行わない
	                		isEditable: function(item, row, column, dataView){
	                			if (item.optionID && item.optionID>0){
	                				return false;
	                			}
	                		},
	                		validator: ['required', 'digit', 'maxlen:4']
	                	}
	                },
	                {
	                	id: "comment",
	                	name: " 内容",
	                	field: "comment",
	                	width: 400,
	                	cellType: {
	                		type: "text",
	                		editorOptions: {
	                		},
	                		validator: ['required',  'maxlen:30']
	                	}
	                },
	                {
	                	id: "optHinban",
	                	name: " オプション品番",
	                	field: "optHinban",
	                	width: 110,
	                	limit: "number:8",
	                	cssClass: 'txtalign-right',		// 右寄せ,
	                	cellType: {
	                		type: "text",
	                		editorOptions: {
	                			addClass: 'txtar'		// エディタ：右寄せ
	                		},
	                		// エディタ作成前に呼ばれる. falseをリターンでエディタの作成を行わない
	                		isEditable: function(item, row, column, dataView){
	                			if (item.optionID && item.optionID>0){
	                				return false;
	                			}
	                		},
	                		validator: ['required',  "alnum",'maxlen:8']
	                	}
	                },
	                {
	                	id: "cost",
	                	name: "料金（税込）(円)",
	                	field: "cost",
	                	width: 140,
	                	minWidth: 140,
	                	cssClass		: 'txtalign-right',
	                	limit			: "number:9",
	                	cellType: {
	                		type: "text",
	                		formatFilter	: "comma",
	                		editorOptions: {
	                			addClass: 'txtar'		// エディタ：右寄せ
	                		},
	                		validator: ['required',  "int",'maxlen:9']
	                	}
	                },
	                {
	                	id: "optStDate",
	                	name: "適用開始日",
	                	field: "optStDate",
	                	width: 160,
	                	minWidth: 160,
	                	cellType: {
	                		type: "date"
	                	},
                		validator: 'required'
	                },
	                {
	                	id: "optEdDate",
	                	name: "適用終了日",
	                	field: "optEdDate",
	                	width: 160,
	                	minWidth: 160,
	                	cellType: {
	                		type: "date",
	                		validator: 'required'
	                	},
	                },
	                {
	                	id: "optOrdStopDate",
	                	name: "発注停止日",
	                	field: "optOrdStopDate",
	                	width: 160,
	                	minWidth: 160,
	                	cellType: {
	                		type: "date"
	                	},
	                }
	                ];
	// テーブルのヘッダ
	var columns3 = [
	                {
	                	id: "seq",
	                	name: " No",
	                	field: "seq",
	                	width: 70,
	                	minWidth: 70,
	                	cssClass: 'txtalign-right',		// 右寄せ,
	                	cellType: {
	                		type: "text",
	                		formatFilter: "comma",
	                		editorOptions: {
	                			addClass: 'txtar'		// エディタ：右寄せ
	                		},
	                		// エディタ作成前に呼ばれる. falseをリターンでエディタの作成を行わない
	                		isEditable: function(item, row, column, dataView){
	                			if (item.optionID && item.optionID>0){
	                				return false;
	                			}
	                		},
	                		validator: ['required', 'digit', 'maxlen:4']
	                	}
	                },
	                {
	                	id: "comment",
	                	name: " 内容",
	                	field: "comment",
	                	width: 400,
	                	cellType: {
	                		type: "text",
	                		editorOptions: {
	                		},
	                		validator: ['required ', 'zenkaku', 'maxlen:30']
	                	}
	                },
	                {
	                	id: "optHinban",
	                	name: " オプション品番",
	                	field: "optHinban",
	                	width: 110,
	                	limit: "number:8",

	                	cssClass: 'txtalign-right',		// 右寄せ,
	                	cellType: {
	                		type: "text",
	                		editorOptions: {
	                			addClass: 'txtar'		// エディタ：右寄せ
	                		},
	                		// エディタ作成前に呼ばれる. falseをリターンでエディタの作成を行わない
	                		isEditable: function(item, row, column, dataView){
	                			if (item.optionID && item.optionID>0){
	                				return false;
	                			}
	                		},
	                		validator: ['required',  "alnum",'maxlen:8']
	                	}
	                },
	                {
	                	id: "cost",
	                	name: "料金（税込）(円)",
	                	field: "cost",
	                	width: 140,
	                	minWidth: 140,
	                	cssClass		: 'txtalign-right',
	                	limit			: "number:9",
	                	cellType: {
	                		type: "text",
	                		formatFilter	: "comma",
	                		editorOptions: {
	                			addClass: 'txtar'		// エディタ：右寄せ
	                		},
	                		validator: ['required',  "int",'maxlen:9']
	                	}
	                },
	                {
	                	id: "optStDate",
	                	name: "適用開始日",
	                	field: "optStDate",
	                	width: 160,
	                	minWidth: 160,
	                	cellType: {
	                		type: "date",
	                		validator: 'required'
	                	},

	                },
	                {
	                	id: "optEdDate",
	                	name: "適用終了日",
	                	field: "optEdDate",
	                	width: 160,
	                	minWidth: 160,
	                	cellType: {
	                		type: "date",
	                			validator: 'required'
	                	},

	                },
	                {
	                	id: "optOrdStopDate",
	                	name: "発注停止日",
	                	field: "optOrdStopDate",
	                	width: 160,
	                	minWidth: 160,
	                	cellType: {
	                		type: "date"
	                	},
	                }
	                ];
	var EditView = Backbone.View.extend({
		el : $("#ca_main"),

		validator : null,

		events : {

			'change #ca_poTypeID' 			: '_PoTypeChange',
		},


		table_row_data:{},
		/**
		 * opt : clcom.pageArgs
		 */
		initialize: function(opt){

			_.bindAll(this);

			// デフォルトは「新規」で
			var fixopt = _.defaults(opt||{}, {
				opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW,
				srchDate: clcom.getOpeDate(),
				chkData: []
			});
			this.options = fixopt;

			// 共通ビュー（共通ヘッダなど内包）
			var mdBaseViewOpt = _.bind(function(o){
				var mdOpt = {
						title: 'オプショングループ',
						opeTypeId: o.opeTypeId,
						pageCount: o.chkData.length,
						// Submit リクエストを作る関数 - Submit 実行は MDBaseView に委譲するので、
						// リクエストビルダ関数を渡しておく。
						buildSubmitReqFunction: this._buildSubmitReqFunction,
						// 新規作成以外では、Get の Ajax 呼び出し処理を MDBaseView へ委譲するので、
						// リクエストのビルダ関数を opt で渡しておく。
						buildGetReqFunction: this._buildGetReqFunction,
						buildSubmitCheckDataFunction : this._buildSubmitCheckFunction
				};
				return mdOpt;

			},this)(fixopt);

			// データグリッドの表示、ここで全部作成すると負荷が大きいのでPO種別変更かデータ取得のタイミングで変更する

			this.mdBaseView = new clutil.View.MDBaseView(mdBaseViewOpt);

			// 外部イベントの購読設定
			switch(fixopt.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
				// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
				clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:
				// 照会モードは、GET だけ。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
				break;
			default:
				// それ以外は、GET結果のデータを購読する。
				clutil.mediator.on('onMDGetCompleted', this._onMDGetCompleted);
			// Submit ボタンの実行処理を MDBaseView へ委譲しているので、実行結果を購読する。
			clutil.mediator.on('onMDSubmitCompleted', this._onMDSubmitCompleted);
			}

			// validatorエラー時の表示領域
			$('.cl_echoback').hide();
			this.validator = clutil.validator(this.$el, {
				echoback : $('.cl_echoback')
			});
			this.validator1 = clutil.validator($("#ca_base_form"), {
				echoback : $('.cl_echoback')
			});
			return this;
		},

		initUIelement : function(){
			this.mdBaseView.initUIElement();
			// 初期データ取得後に呼ばれる関数
			// 事業ユニット取得
			clutil.clbusunitselector(this.$('#ca_unitID'));
			// ＰＯ種別
			clutil.cltypeselector(this.$("#ca_poTypeID"), amcm_type.AMCM_TYPE_PO_CLASS);
			// 適用期間
			clutil.datepicker(this.$("#ca_stDate"));
			this.$("#ca_stDate").datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
			clutil.datepicker(this.$("#ca_edDate"));
			this.$("#ca_edDate").datepicker('setIymd', clcom.max_date);
			clutil.datepicker(this.$("#ca_ordStopDate"));
			$("#ca_tp_code").tooltip({html: true});
			$("#tp_slAdjuster").tooltip({html: true});
			$("#tp_form").tooltip({html: true});

			clutil.cltxtFieldLimit($("#ca_code"));
			clutil.cltxtFieldLimit($("#ca_name"));
			this._PoTypeChange();

			return this;
		},
		_PoTypeMakeGrid: function(POTypeID ) {
			//必要なデータグリッドだけ作成する(それぞれ初回のみ)
			//初期表示の際は空データで作成できないので呼出後にデータのクリアが必要
			if(POTypeID == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				if(this.dataGrid001==undefined){this.makeGrid0();}
				if(this.dataGrid101==undefined){this.makeGrid1();}
				if(this.dataGrid201==undefined){this.makeGrid2();}
				if(this.dataGrid401==undefined){this.makeGrid4();}
			}else if(POTypeID == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				if(this.dataGrid001==undefined){this.makeGrid0();}
				if(this.dataGrid101==undefined){this.makeGrid1();}
				if(this.dataGrid201==undefined){this.makeGrid2();}
				if(this.dataGrid301==undefined){this.makeGrid3();}
				if(this.dataGrid401==undefined){this.makeGrid4();}
			}else if(POTypeID == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				if(this.dataGrid501==undefined){this.makeGrid5();}
			}
		},
		_PoTypeChange: function(e) {
			var $POTypeID = this.$("#ca_poTypeID");
			this._PoTypeMakeGrid($POTypeID.val());
			this.clearTable();
			if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				//メンズ
				this.$("#ca_table_form0").show();
				this.$("#ca_table_div001").show();
				this.$("#gtitle_0").html("スーツ");
				this.$("#label001").html("ウォッシャブル");

				this.$("#ca_table_form1").show();
				this.$("#ca_table_div102").show();
				this.$("#ca_table_div108").show();
				this.$("#gtitle_1").html("ジャケット");
				this.$("#label101").html("袖4つボタン");
				this.$("#label102").html("サマー仕様");
				this.$("#label103").html("チェンジポケット");
				this.$("#label104").html("ボタン変更");
				this.$("#label105").html("本切羽");
				this.$("#label106").html("AMFステッチ");
				this.$("#label107").html("裏地変更");
				this.$("#label108").html("お台場");

				this.$("#ca_table_form2").show();
				this.$("#ca_table_div203").show();
				this.$("#ca_table_div204").show();
				this.$("#ca_table_div205").show();
				this.$("#gtitle_2").html("スラックス");
				this.$("#label201").html("サマー仕様");
				this.$("#label202").html("ボタン変更");
				this.$("#label203").html("アジャスター");
				this.$("#label204").html("スペア用アジャスター");
				this.$("#label205").html("スペアスラックス品番");

				this.$("#ca_table_div201").hide();	//サマー仕様　不必要項目
				this.$("#ca_table_div204").hide();	//スペア用アジャスター　不必要項目
				this.$("#ca_table_div205").hide();	//スペアスラックス品番　不必要項目
				this.$("#tp_slAdjuster").tooltip({html: true});

				this.$("#ca_table_form3").hide();

				this.$("#ca_table_form4").show();
				this.$("#gtitle_4").html("ベスト");
				this.$("#label401").html("AMFステッチ");
				this.$("#label402").html("裏地変更");
				this.$("#label403").html("ボタン変更");
				this.$("#ca_table_div404").hide();

				this.$("#ca_table_form5").hide();

			}else if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				// レディス
				this.$("#ca_table_form0").hide();

				this.$("#ca_table_form1").show();
				this.$("#ca_table_div108").hide();
				this.$("#gtitle_1").html("ジャケット");
				this.$("#label101").html("AMFステッチ");
				this.$("#label102").html("有料胸ポケット");
				this.$("#label103").html("袖デザイン");
				this.$("#label104").html("内ポケット");
				this.$("#label105").html("センターベント");
				this.$("#label106").html("ボタン変更");
				this.$("#label107").html("裏地変更");

				this.$("#ca_table_div102").hide();	//有料胸ポケット　不必要項目

				this.$("#ca_table_form2").hide();	//スカート　不必要項目
				this.$("#ca_table_div203").hide();
				this.$("#ca_table_div204").hide();
				this.$("#ca_table_div205").hide();
				this.$("#gtitle_2").html("スカート");
				this.$("#label201").html("スペアスカート品番");
				this.$("#label202").html("ボタン変更");

				this.$("#ca_table_div201").hide();	//todo


				this.$("#ca_table_form3").hide();	//パンツ　不必要項目
				this.$("#gtitle_3").html("パンツ");
				this.$("#label301").html("スペアパンツ品番");
				this.$("#label302").html("ボタン変更");

				this.$("#ca_table_div301").hide();	//todo


				this.$("#ca_table_form4").show();
				this.$("#ca_table_div404").show();
				this.$("#gtitle_4").html("ベスト");
				this.$("#label401").html("尾錠");
				this.$("#label402").html("ボタン変更");
				this.$("#label403").html("裏地変更");
				this.$("#label404").html("AMFステッチ");

				this.$("#ca_table_form5").hide();

			}else if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				// シャツ
				this.$("#ca_table_form0").hide();

				this.$("#ca_table_form1").hide();

				this.$("#ca_table_form2").hide();

				this.$("#ca_table_form3").hide();

				this.$("#ca_table_form4").hide();

				this.$("#ca_table_form5").show();
				this.$("#gtitle_5").html("オプション");
				this.$("#label501").html("衿型（標準オプション1）");
				this.$("#label502").html("衿型（オプション2）");
				this.$("#label503").html("カフス");
				this.$("#label504").html("クレリック");
				this.$("#label505").html("衿芯加工");
				this.$("#label506").html("前身頃");
				this.$("#label507").html("ポケット");
				this.$("#label508").html("後身頃");
				this.$("#label509").html("ボタン");
				this.$("#label510").html("ボタンホールオプション");
				this.$("#label511").html("ボタン付糸オプション");
				this.$("#label512").html("ハンドステッチオプション");
				this.$("#label513").html("イニシャルオプション");
				this.$("#label514").html("イニシャル場所");
				this.$("#label515").html("イニシャル色");
				this.$("#label516").html("イニシャル字体");
				this.$("#label517").html("縫製オプション1");
				this.$("#label518").html("首回り");
				this.$("#label519").html("裄丈（左）");
				this.$("#label520").html("裄丈（右）");
				this.$("#label521").html("ボディ型");
				this.$("#label522").html("肩幅");
				this.$("#label523").html("胸回り");
				this.$("#label524").html("胴回り");
				this.$("#label525").html("裾回り");
				this.$("#label526").html("身丈");
				this.$("#label527").html("カフス回り（左）");
				this.$("#label528").html("カフス回り（右）");
			}else{
				this.$("#ca_table_form0").hide();
				this.$("#ca_table_form1").hide();
				this.$("#ca_table_form2").hide();
				this.$("#ca_table_form3").hide();
				this.$("#ca_table_form4").hide();
				this.$("#ca_table_form5").hide();
			}
		},

		render : function(){
			this.$("#ca_unitID").val(clcom.userInfo.unit_id);
			this.mdBaseView.render();
			clutil.inputlimiter(this.$el);
			this.clearTable();
			if (this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW){
				clutil.setFocus($('#ca_unitID'));
			} else {
				this.mdBaseView.fetch();	// データを GET してくる。
			}
			return this;
		},

		// Submit 応答のイベントを受ける
		_onMDSubmitCompleted: function(args, e){
			var _this = this;
			// args: {status: stat.status, index: pgIndex, resId: req.resId, data: data}
			console.log("SubmitCompleted status:" + args.status);
			var data = args.data;
			switch(args.status){
			case 'DONE':		// 確定済
				// args.data を画面個別 Viwe へセットする。
				// 確定済なので、 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			case 'CONFLICT':	// 別のユーザによって DB が更新された
				// args.data を画面個別 View へセットする。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
				break;
			case 'DELETED':		// 別のユーザによって削除された
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
			default:
			case 'NG':			// その他エラー。入力値サーバチェックでエラーも含む。
				// TODO
				// 応答ネタは、args.data で取得。
				// 入力値エラー情報が入っていれば、個別 View へセットする。
				var total_row=0;

				if(this.dataGrid001!=undefined)(total_row = this.makeGridALL(this.dataGrid001, total_row));
				if(this.dataGrid101!=undefined)(total_row = this.makeGridALL(this.dataGrid101, total_row));
				if(this.dataGrid102!=undefined)(total_row = this.makeGridALL(this.dataGrid102, total_row));
				if(this.dataGrid103!=undefined)(total_row = this.makeGridALL(this.dataGrid103, total_row));
				if(this.dataGrid104!=undefined)(total_row = this.makeGridALL(this.dataGrid104, total_row));
				if(this.dataGrid105!=undefined)(total_row = this.makeGridALL(this.dataGrid105, total_row));
				if(this.dataGrid106!=undefined)(total_row = this.makeGridALL(this.dataGrid106, total_row));
				if(this.dataGrid107!=undefined)(total_row = this.makeGridALL(this.dataGrid107, total_row));
				if(this.dataGrid108!=undefined)(total_row = this.makeGridALL(this.dataGrid108, total_row));
				if(this.dataGrid201!=undefined)(total_row = this.makeGridALL(this.dataGrid201, total_row));
				if(this.dataGrid202!=undefined)(total_row = this.makeGridALL(this.dataGrid202, total_row));
				if(this.dataGrid203!=undefined)(total_row = this.makeGridALL(this.dataGrid203, total_row));
				if(this.dataGrid204!=undefined)(total_row = this.makeGridALL(this.dataGrid204, total_row));
				if(this.dataGrid205!=undefined)(total_row = this.makeGridALL(this.dataGrid205, total_row));
				if(this.dataGrid301!=undefined)(total_row = this.makeGridALL(this.dataGrid301, total_row));
				if(this.dataGrid302!=undefined)(total_row = this.makeGridALL(this.dataGrid302, total_row));
				if(this.dataGrid401!=undefined)(total_row = this.makeGridALL(this.dataGrid401, total_row));
				if(this.dataGrid402!=undefined)(total_row = this.makeGridALL(this.dataGrid402, total_row));
				if(this.dataGrid403!=undefined)(total_row = this.makeGridALL(this.dataGrid403, total_row));
				if(this.dataGrid404!=undefined)(total_row = this.makeGridALL(this.dataGrid404, total_row));
				if(this.dataGrid501!=undefined)(total_row = this.makeGridALL(this.dataGrid501, total_row));
				if(this.dataGrid502!=undefined)(total_row = this.makeGridALL(this.dataGrid502, total_row));
				if(this.dataGrid503!=undefined)(total_row = this.makeGridALL(this.dataGrid503, total_row));
				if(this.dataGrid504!=undefined)(total_row = this.makeGridALL(this.dataGrid504, total_row));
				if(this.dataGrid505!=undefined)(total_row = this.makeGridALL(this.dataGrid505, total_row));
				if(this.dataGrid506!=undefined)(total_row = this.makeGridALL(this.dataGrid506, total_row));
				if(this.dataGrid507!=undefined)(total_row = this.makeGridALL(this.dataGrid507, total_row));
				if(this.dataGrid508!=undefined)(total_row = this.makeGridALL(this.dataGrid508, total_row));
				if(this.dataGrid509!=undefined)(total_row = this.makeGridALL(this.dataGrid509, total_row));
				if(this.dataGrid510!=undefined)(total_row = this.makeGridALL(this.dataGrid510, total_row));
				if(this.dataGrid511!=undefined)(total_row = this.makeGridALL(this.dataGrid511, total_row));
				if(this.dataGrid512!=undefined)(total_row = this.makeGridALL(this.dataGrid512, total_row));
				if(this.dataGrid513!=undefined)(total_row = this.makeGridALL(this.dataGrid513, total_row));
				if(this.dataGrid514!=undefined)(total_row = this.makeGridALL(this.dataGrid514, total_row));
				if(this.dataGrid515!=undefined)(total_row = this.makeGridALL(this.dataGrid515, total_row));
				if(this.dataGrid516!=undefined)(total_row = this.makeGridALL(this.dataGrid516, total_row));
				if(this.dataGrid517!=undefined)(total_row = this.makeGridALL(this.dataGrid517, total_row));
				if(this.dataGrid518!=undefined)(total_row = this.makeGridALL(this.dataGrid518, total_row));
				if(this.dataGrid519!=undefined)(total_row = this.makeGridALL(this.dataGrid519, total_row));
				if(this.dataGrid520!=undefined)(total_row = this.makeGridALL(this.dataGrid520, total_row));
				if(this.dataGrid521!=undefined)(total_row = this.makeGridALL(this.dataGrid521, total_row));
				if(this.dataGrid522!=undefined)(total_row = this.makeGridALL(this.dataGrid522, total_row));
				if(this.dataGrid523!=undefined)(total_row = this.makeGridALL(this.dataGrid523, total_row));
				if(this.dataGrid524!=undefined)(total_row = this.makeGridALL(this.dataGrid524, total_row));
				if(this.dataGrid525!=undefined)(total_row = this.makeGridALL(this.dataGrid525, total_row));
				if(this.dataGrid526!=undefined)(total_row = this.makeGridALL(this.dataGrid526, total_row));
				if(this.dataGrid527!=undefined)(total_row = this.makeGridALL(this.dataGrid527, total_row));
				if(this.dataGrid528!=undefined)(total_row = this.makeGridALL(this.dataGrid528, total_row));

				for(var i = 0; i < data.rspHead.fieldMessages.length; i++){
					var fldMsg = data.rspHead.fieldMessages[i];
					if(fldMsg.struct_name == "optList"){
						rowId = _this.table_row_data[fldMsg.lineno-1].id;
						grid = _this.table_row_data[fldMsg.lineno-1].grid;
						cellMessages = [];
						cellMessages.push({
							rowId: rowId,
							colId: fldMsg.field_name,
							level: 'error',
							message: clutil.getclmsg(fldMsg.message)
						});
						grid.setCellMessage(cellMessages);
					}
				}

//				for(var i = 0; i < data.rspHead.fieldMessages.length; i++){
//					var fldMsg = data.rspHead.fieldMessages[i];
//					if(fldMsg.struct_name == "optList"){
//						if(!fldMsg.lineno || fldMsg.lineno > optTrTagList.length || _.isEmpty(fldMsg.field_name)){
//							//て-ブルの列より多くなることないはず
//							continue;
//						}
//						$(optTrTagList[fldMsg.lineno-1]).find("input").each(function(){
//							if(this.name == fldMsg.field_name){
//								_this.validator.setErrorMsg($(this), clutil.getclmsg(fldMsg.message));
//							}
//						});
//					}
//				}
				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
			}
		},
		//有効行の情報だけを持つグリッド作成,
		makeGridALL: function($grid, count){
			var _this = this;
			var gridData = $grid.getData({ delflag: false,  tailEmptyCheckFunc: _this.costtypeTailIsEmptyFunc});
			for(i=0; i <  gridData.length; i++){
				var rowDto = gridData[i];
				var rowId = rowDto[$grid.dataView.idProperty];
				var opt = {
						id :rowId,
						grid : $grid
				}
				_this.table_row_data[count]=opt;
				count++;
			}

			return count;
		},
		//TODO
		//新規グリッド作成
		makeGrid0:function(){
			this.dataGrid001 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid001',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 1
			});
			this.listenTo(this.dataGrid001, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
					if (gridView.grid.getDataLength() >=2){
						gridView.$footer.removeClass('disabled').css('visibility', 'hidden');
					}
				},
				'row:delToggle': function(e){
					if(e.dataGrid.grid.getDataLength() < 2){
						e.dataGrid.$footer.addClass('disabled').css('visibility', 'visible');
					}
				}
			});
			this.dataGrid001.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
		},
		makeGrid1:function(){
/////////////////////101
			this.dataGrid101 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid101',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid101, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid101.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////102
			this.dataGrid102 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid102',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid102, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid102.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////103
			this.dataGrid103 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid103',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid103, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid103.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////104
			this.dataGrid104 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid104',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid104, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid104.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1
					,frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////105
			this.dataGrid105 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid105',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid105, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid105.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////106
			this.dataGrid106 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid106',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid106, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid106.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////107
			this.dataGrid107 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid107',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid107, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid107.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////108
			this.dataGrid108 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid108',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid108, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid108.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
		},
		makeGrid2:function(){
			/////////////////////201
			this.dataGrid201 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid201',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid201, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid201.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////202
			this.dataGrid202 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid202',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid202, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid202.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////203
			this.dataGrid203 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid203',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid203, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid203.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////204
			this.dataGrid204 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid204',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid204, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid204.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////205
			this.dataGrid205 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid205',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid205, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid205.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});




		},
		makeGrid3:function(){
			/////////////////////301
			this.dataGrid301 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid301',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid301, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid301.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////302
			this.dataGrid302 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid302',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid302, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid302.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});




		},
		makeGrid4:function(){
			/////////////////////401
			this.dataGrid401 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid401',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid401, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid401.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////402
			this.dataGrid402 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid402',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid402, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid402.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////403
			this.dataGrid403 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid403',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid403, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid403.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////404
			this.dataGrid404 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid404',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid404, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid404.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns1),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});




		},
		makeGrid5:function(){
			/////////////////////501
			this.dataGrid501 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid501',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid501, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid501.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////502
			this.dataGrid502 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid502',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid502, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid502.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////503
			this.dataGrid503 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid503',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid503, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid503.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////504
			this.dataGrid504 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid504',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid504, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid504.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////505
			this.dataGrid505 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid505',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid505, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid505.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////506
			this.dataGrid506 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid506',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid506, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid506.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////507
			this.dataGrid507 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid507',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid507, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid507.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////508
			this.dataGrid508 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid508',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid508, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid508.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////509
			this.dataGrid509 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid509',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid509, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid509.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////510
			this.dataGrid510 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid510',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid510, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid510.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////511
			this.dataGrid511 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid511',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid511, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid511.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////512
			this.dataGrid512 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid512',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid512, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid512.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////513
			this.dataGrid513 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid513',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid513, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid513.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////514
			this.dataGrid514 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid514',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid514, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid514.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////515
			this.dataGrid515 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid515',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid515, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid515.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////516
			this.dataGrid516 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid516',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid516, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid516.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns3),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////517
			this.dataGrid517 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid517',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid517, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid517.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////518
			this.dataGrid518 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid518',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid518, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid518.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////519
			this.dataGrid519 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid519',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid519, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid519.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////520
			this.dataGrid520 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid520',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid520, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid520.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////521
			this.dataGrid521 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid521',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid521, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid521.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////522
			this.dataGrid522 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid522',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid522, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid522.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////523
			this.dataGrid523 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid523',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid523, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid523.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)

				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////524
			this.dataGrid524 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid524',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid524, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid524.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////525
			this.dataGrid525 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid525',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid525, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid525.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////526
			this.dataGrid526 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid526',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid526, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid526.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////527
			this.dataGrid527 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid527',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid527, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid527.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});
			/////////////////////528
			this.dataGrid528 = new ClGrid.ClAppGridView({
				el: '#ca_datagrid528',
				lineno: false,
				delRowBtn: true,		// 行削除ボタンを使用するフラグ。
				footerNewRowBtn: true,	// フッター部の新規行追加ボタンを使用するフラグ。
				autoHeightDataCount: 100
			});
			this.listenTo(this.dataGrid528, {

				// 新規行の追加
				'footer:addNewRow': function(gridView){
					// 新規行データをつくって、gridView.addNewItem(dto) でアペンドする。
					var newItem = {
							optionID:0,
							optStDate:clutil.addDate(clcom.getOpeDate(), 1),
							optEdDate:clcom.max_date
					};
					gridView.addNewItem(newItem);
				},
			});
			this.dataGrid528.render().setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,
					frozenColmun: 0
				},
				columns: _.deepClone(columns2),
				data: [
				       clutil.dclone(emptyRec)
				       ],
				       rowDelToggle: false,
				       graph: null
			});




		},
		// GET 応答のイベントを受ける
		_onMDGetCompleted: function(args, e){
			// args: {status: code, fromIndex: fromIndex, index: toIndex, resId: req.resId, data: data}
			console.log("GetCompleted status:" + args.status);
			var data = args.data;
			this.setReadOnlyAllItems(false);
			switch(args.status){
			case 'OK':
				// イベント追加
				this.getData2view(data);

				switch (this.options.opeTypeId) {
				//この画面に来る場合は編集or削除のみ
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_REL:		// 照会
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_RSVCANCEL:	// 予約取消
					this.setReadOnlyAllItems(true);
					break;

				case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:		// 削除
					this.setReadOnlyAllItems(true);
					break;
				case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:		// 新規
					this.$("#ca_stDate").datepicker('setIymd', clutil.addDate(clcom.getOpeDate(), 1));
					this.$("#ca_edDate").datepicker('setIymd', clcom.max_date);
					//新規作成の場合、data2viewで組織が空白で上書きされてしまい、
					//初期表示がおかしくなるのでここでもう一度表示する
					this.$("#ca_unitID").val(clcom.userInfo.unit_id);
					clutil.initUIelement(this.$el);
					break;
				default:
					clutil.viewReadonly(this.$(".ca_unitID_div"));
				clutil.viewReadonly(this.$(".ca_poTypeID_div"));
				clutil.inputReadonly($("#ca_code"));
				clutil.setFocus($('#ca_name'));
//				clutil.viewReadonly($("#ca_base_form"));
				break;
				}

				break;
			case 'DONE':		// 確定済
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.getData2view(data);
				this.setReadOnlyAllItems(true);
				break;
			case 'DELETED':		// 自分で削除した or 別のユーザが削除済み
				// 全 <input> は readonly 化するなどの処理。
				this.getData2view(data);
				this.setReadOnlyAllItems(true);
				break;
			case 'CONFLICT':	// ＜前へ｜次へ＞ 移動で戻ってきた。最新データを再取得したら、誰かに更新されていたケース
				// args.data をアプリ個別 View へセットする。
				// 確定済なので、 全 <input> は readonly 化するなどの処理。
				this.getData2view(data);
				this.setReadOnlyAllItems(true);
				break;
			default:
			case 'NG':			// その他エラー。
				// 全 <input> を readonly 化するなどの処理。
				this.setReadOnlyAllItems(true);
//				this._tableDisable();
				// サーバーからのエラーがある場合、フィールドに取り込みエラーをバルーン表示


				this.validator.setErrorInfoFromSrv(data.rspHead.fieldMessages, {
					prefix: 'ca_'
				});
				break;
			}
		},
		//全体入力制御
		setReadOnlyAllItems: function(readOnly){
			if (readOnly == true){
				clutil.viewReadonly($("#ca_base_form"));
			}else{
				clutil.viewRemoveReadonly($("#ca_base_form"));
			}
			if(this.dataGrid001!=undefined){this.dataGrid001.setEnable(!readOnly);}
			if(this.dataGrid101!=undefined){this.dataGrid101.setEnable(!readOnly);}
			if(this.dataGrid102!=undefined){this.dataGrid102.setEnable(!readOnly);}
			if(this.dataGrid103!=undefined){this.dataGrid103.setEnable(!readOnly);}
			if(this.dataGrid104!=undefined){this.dataGrid104.setEnable(!readOnly);}
			if(this.dataGrid105!=undefined){this.dataGrid105.setEnable(!readOnly);}
			if(this.dataGrid106!=undefined){this.dataGrid106.setEnable(!readOnly);}
			if(this.dataGrid107!=undefined){this.dataGrid107.setEnable(!readOnly);}
			if(this.dataGrid108!=undefined){this.dataGrid108.setEnable(!readOnly);}
			if(this.dataGrid201!=undefined){this.dataGrid201.setEnable(!readOnly);}
			if(this.dataGrid202!=undefined){this.dataGrid202.setEnable(!readOnly);}
			if(this.dataGrid203!=undefined){this.dataGrid203.setEnable(!readOnly);}
			if(this.dataGrid204!=undefined){this.dataGrid204.setEnable(!readOnly);}
			if(this.dataGrid205!=undefined){this.dataGrid205.setEnable(!readOnly);}
			if(this.dataGrid301!=undefined){this.dataGrid301.setEnable(!readOnly);}
			if(this.dataGrid302!=undefined){this.dataGrid302.setEnable(!readOnly);}
			if(this.dataGrid401!=undefined){this.dataGrid401.setEnable(!readOnly);}
			if(this.dataGrid402!=undefined){this.dataGrid402.setEnable(!readOnly);}
			if(this.dataGrid403!=undefined){this.dataGrid403.setEnable(!readOnly);}
			if(this.dataGrid404!=undefined){this.dataGrid404.setEnable(!readOnly);}

			if(this.dataGrid501!=undefined){this.dataGrid501.setEnable(!readOnly);}
			if(this.dataGrid502!=undefined){this.dataGrid502.setEnable(!readOnly);}
			if(this.dataGrid503!=undefined){this.dataGrid503.setEnable(!readOnly);}
			if(this.dataGrid504!=undefined){this.dataGrid504.setEnable(!readOnly);}
			if(this.dataGrid505!=undefined){this.dataGrid505.setEnable(!readOnly);}
			if(this.dataGrid506!=undefined){this.dataGrid506.setEnable(!readOnly);}
			if(this.dataGrid507!=undefined){this.dataGrid507.setEnable(!readOnly);}
			if(this.dataGrid508!=undefined){this.dataGrid508.setEnable(!readOnly);}
			if(this.dataGrid509!=undefined){this.dataGrid509.setEnable(!readOnly);}
			if(this.dataGrid510!=undefined){this.dataGrid510.setEnable(!readOnly);}
			if(this.dataGrid511!=undefined){this.dataGrid511.setEnable(!readOnly);}
			if(this.dataGrid512!=undefined){this.dataGrid512.setEnable(!readOnly);}
			if(this.dataGrid513!=undefined){this.dataGrid513.setEnable(!readOnly);}
			if(this.dataGrid514!=undefined){this.dataGrid514.setEnable(!readOnly);}
			if(this.dataGrid515!=undefined){this.dataGrid515.setEnable(!readOnly);}
			if(this.dataGrid516!=undefined){this.dataGrid516.setEnable(!readOnly);}
			if(this.dataGrid517!=undefined){this.dataGrid517.setEnable(!readOnly);}
			if(this.dataGrid518!=undefined){this.dataGrid518.setEnable(!readOnly);}
			if(this.dataGrid519!=undefined){this.dataGrid519.setEnable(!readOnly);}
			if(this.dataGrid520!=undefined){this.dataGrid520.setEnable(!readOnly);}
			if(this.dataGrid521!=undefined){this.dataGrid521.setEnable(!readOnly);}
			if(this.dataGrid522!=undefined){this.dataGrid522.setEnable(!readOnly);}
			if(this.dataGrid523!=undefined){this.dataGrid523.setEnable(!readOnly);}
			if(this.dataGrid524!=undefined){this.dataGrid524.setEnable(!readOnly);}
			if(this.dataGrid525!=undefined){this.dataGrid525.setEnable(!readOnly);}
			if(this.dataGrid526!=undefined){this.dataGrid526.setEnable(!readOnly);}
			if(this.dataGrid527!=undefined){this.dataGrid527.setEnable(!readOnly);}
			if(this.dataGrid528!=undefined){this.dataGrid528.setEnable(!readOnly);}
		},

		/**
		 * dataを表示
		 * PO種別により表示パネルを選択しそれぞれの区分ごとにデータを分けて表示
		 * PO種別
		 * メンズ：ca_table_form1,ca_table1,ca_table2,ca_table3
		 * レディース：ca_table_form2,ca_table4,ca_table5,ca_table6,ca_table7
		 * シャツ：ca_table_form3,ca_table8,
		 *
		 */
		getData2view : function(data){
			var _this = this;
			this.saveData	= data.AMPOV0210GetRsp;
			var optGrp		= data.AMPOV0210GetRsp.optGrp;
			var optList		= data.AMPOV0210GetRsp.optList;

			this._PoTypeMakeGrid(optGrp.poTypeID);

			//返却パケットのoptListを以下の配列に分配する。
			var optList_001				= new Array;	//001
			var optList_101				= new Array;	//101
			var optList_102				= new Array;	//102
			var optList_103				= new Array;	//103
			var optList_104				= new Array;	//104
			var optList_105				= new Array;	//105
			var optList_106				= new Array;	//106
			var optList_107				= new Array;	//107
			var optList_108				= new Array;	//108
			var optList_201				= new Array;	//201
			var optList_202				= new Array;	//202
			var optList_203				= new Array;	//203
			var optList_204				= new Array;	//204
			var optList_205				= new Array;	//205
			var optList_301				= new Array;	//301
			var optList_302				= new Array;	//302
			var optList_401				= new Array;	//401
			var optList_402				= new Array;	//402
			var optList_403				= new Array;	//403
			var optList_404				= new Array;	//404
			var optList_501				= new Array;	//501
			var optList_502				= new Array;	//502
			var optList_503				= new Array;	//503
			var optList_504				= new Array;	//504
			var optList_505				= new Array;	//505
			var optList_506				= new Array;	//506
			var optList_507				= new Array;	//507
			var optList_508				= new Array;	//508
			var optList_509				= new Array;	//509
			var optList_510				= new Array;	//510
			var optList_511				= new Array;	//511
			var optList_512				= new Array;	//512
			var optList_513				= new Array;	//513
			var optList_514				= new Array;	//514
			var optList_515				= new Array;	//515
			var optList_516				= new Array;	//516
			var optList_517				= new Array;	//517
			var optList_518				= new Array;	//518
			var optList_519				= new Array;	//519
			var optList_520				= new Array;	//520
			var optList_521				= new Array;	//521
			var optList_522				= new Array;	//522
			var optList_523				= new Array;	//523
			var optList_524				= new Array;	//524
			var optList_525				= new Array;	//525
			var optList_526				= new Array;	//526
			var optList_527				= new Array;	//527
			var optList_528				= new Array;	//528

			//1レコードごと確認しそれぞれのテーブルに分割する
			$.each(optList, function() {
				switch(this.poOptTypeID){
				case amcm_type.AMCM_TYPE_WASHABLE_TYPE:
					// ウォッシャブル
					optList_001.push(this);
					//一個以上は存在しないはず

					break;
				case amcm_type.AMCM_TYPE_FOUR_ARM_BUTTON_TYPE:
					// 袖ボタン４つ区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						optList_101.push(this);
					}
					break;
				case amcm_type.AMCM_TYPE_SUMMAR_SPEC_TYPE:
					//サマー仕様
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						optList_102.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
//						optList_201.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
						;
					}
					break;
				case amcm_type.AMCM_TYPE_CHANGE_POCKET_TYPE:
					//チェンジポケット区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						optList_103.push(this);
					}
					break;
				case amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE:
					//ボタン変更区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						optList_104.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
						optList_202.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
						optList_403.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						optList_106.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT){
						optList_202.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS){
						optList_302.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						optList_402.push(this);
					}else{
					}
					break;
				case amcm_type.AMCM_TYPE_REAL_BUTTON_HOLE_TYPE:
					// 本切羽区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						optList_105.push(this);
					}
					break;
				case amcm_type.AMCM_TYPE_AMF_STITCH_OPTION_TYPE:
					// AMF区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT){

					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						optList_106.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
						;
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
						optList_401.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						optList_101.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT){
						;
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS){
						;
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						optList_404.push(this);;
					}else{
						optList_512.push(this);//シャツの場合
					}
					break;
				case amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE:
					// 裏地変更区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						optList_107.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
						;
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST){
						optList_402.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						optList_107.push(this);
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT){
						;
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS){
						;
					}else if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						optList_403.push(this);
					}else{
					}
					break;
				case amcm_type.AMCM_TYPE_ODAIBA_TYPE:
					// お台場区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET){
						optList_108.push(this);
					}
					break;
				case amcm_type.AMCM_TYPE_ADJUSTER_TYPE:
					// アジャスター区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
						optList_203.push(this);
					}
					break;
				case amcm_type.AMCM_TYPE_SP_ADJUSTER_TYPE:
					// スペアアジャスター区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS){
//						optList_204.push(this);
					}
					break;
				case amcm_type.AMCM_TYPE_FREE_BREAST_POCKET:
					// 無料胸ポケット区分
//					optList_102.push(this);
					break;
				case amcm_type.AMCM_TYPE_ARM_DESIGN_TYPE:
					// 袖デザイン区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						optList_103.push(this);
					}
					break;
				case amcm_type.AMCM_TYPE_INNER_POCKET_TYPE:
					// 内ポケット区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						optList_104.push(this);
					}
					break;
				case amcm_type.AMCM_TYPE_CENTER_VENT_TYPE:
					// センターベント区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET){
						optList_105.push(this);
					}
					break;
				case amcm_type.AMCM_TYPE_PIN_BUCKLE_TYPE:
					// 尾錠区分
					if(this.styleOptTypeID == amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST){
						optList_401.push(this);
					}
					break;
				case amcm_type.AMCM_TYPE_COLLAR_OP1_TYPE:
					// 衿型（標準・オプション１）
					optList_501.push(this);
					break;
				case amcm_type.AMCM_TYPE_COLLAR_OP2_TYPE:
					// 衿型（標準・オプション１）
					optList_502.push(this);
					break;
				case amcm_type.AMCM_TYPE_CUFF_TYPE:
					// カフス型区分
					optList_503.push(this);
					break;
				case amcm_type.AMCM_TYPE_CLERIC_TYPE:
					// クレリック区分
					optList_504.push(this);
					break;
				case amcm_type.AMCM_TYPE_COLLAR_CORE_TYPE:
					// 衿芯加工区分
					optList_505.push(this);
					break;
				case amcm_type.AMCM_TYPE_FRONTBODY_TYPE:
					// 前身頃区分
					optList_506.push(this);
					break;
				case amcm_type.AMCM_TYPE_POCKET_TYPE:
					// ポケット区分
					optList_507.push(this);
					break;
				case amcm_type.AMCM_TYPE_BACKBODY_TYPE:
					// 後身頃区分
					optList_508.push(this);
					break;
				case amcm_type.AMCM_TYPE_BUTTON_TYPE:
					// ボタン区分
					optList_509.push(this);
					break;
				case amcm_type.AMCM_TYPE_BUTTON_HOLE_OPTION_TYPE:
					// ボタンホールオプション区分
					optList_510.push(this);
					break;
				case amcm_type.AMCM_TYPE_BUTTON_SUTURE_TYPE:
					// ボタン付糸オプション区分
					optList_511.push(this);
					break;
				case amcm_type.AMCM_TYPE_INITIAL_OPTION_TYPE:
					// イニシャルオプション区分
					optList_513.push(this);
					break;
				case amcm_type.AMCM_TYPE_INITIAL_AREA_TYPE:
					//場所区分
					optList_514.push(this);
					break;
				case amcm_type.AMCM_TYPE_COLOR_TYPE:
					// 色区分
					optList_515.push(this);
					break;
				case amcm_type.AMCM_TYPE_FORM_TYPE:
					// 字体区分
					optList_516.push(this);
					break;
				case amcm_type.AMCM_TYPE_POCKET_SQUARE_TYPE:
					// 縫製区分
					optList_517.push(this);
					break;
				case amcm_type.AMCM_TYPE_NECK_SIZE_TYPE:
					// 首回り
					optList_518.push(this);
					break;
				case amcm_type.AMCM_TYPE_DEGREE_LEFT_TYPE:
					// 裄丈（左）
					optList_519.push(this);
					break;
				case amcm_type.AMCM_TYPE_DEGREE_RIGHT_TYPE:
					// 裄丈(右）
					optList_520.push(this);
					break;
				case amcm_type.AMCM_TYPE_BODY_FORM_TYPE:
					// ボディ型区分
					optList_521.push(this);
					break;
				case amcm_type.AMCM_TYPE_ACROSS_SHOULDERS_TYPE:
					// 肩幅
					optList_522.push(this);
					break;
				case amcm_type.AMCM_TYPE_CHEST_MEASUREMENT_TYPE:
					// 胸回り
					optList_523.push(this);
					break;
				case amcm_type.AMCM_TYPE_WAIST_MEASUREMENT_TYPE:
					// 胴回り
					optList_524.push(this);
					break;
				case amcm_type.AMCM_TYPE_AROUND_BOTTOM_TYPE:
					// 裾回り
					optList_525.push(this);
					break;
				case amcm_type.AMCM_TYPE_BODY_LEN_TYPE:
					// 身丈
					optList_526.push(this);
					break;
				case amcm_type.AMCM_TYPE_CUFF_LEN_LEFT_TYPE:
					// カフス丈（左）
					optList_527.push(this);
					break;
				case amcm_type.AMCM_TYPE_CUFF_LEN_RIGHT_TYPE:
					// カフス丈（右）
					optList_528.push(this);
					break;
				default:
					break;


				}
			});
			//ヘッダ部分
			clutil.data2view(this.$('#ca_base_form'), optGrp);

			this._PoTypeChange();

//			//PO種別ごとに表示テーブル変更dataGrid525
			if(this.dataGrid001){this._setData2OptCostTable(this.dataGrid001, optList_001);}
			if(optList_001.length > 0){
				//1個以上有ったら追加の足を消す
				this.dataGrid001.$footer.removeClass('disabled').css('visibility', 'hidden');
			}
			if(this.dataGrid101){this._setData2OptCostTable(this.dataGrid101, optList_101);}
			if(this.dataGrid102){this._setData2OptCostTable(this.dataGrid102, optList_102);}
			if(this.dataGrid103){this._setData2OptCostTable(this.dataGrid103, optList_103);}
			if(this.dataGrid104){this._setData2OptCostTable(this.dataGrid104, optList_104);}
			if(this.dataGrid105){this._setData2OptCostTable(this.dataGrid105, optList_105);}
			if(this.dataGrid106){this._setData2OptCostTable(this.dataGrid106, optList_106);}
			if(this.dataGrid107){this._setData2OptCostTable(this.dataGrid107, optList_107);}
			if(this.dataGrid108){this._setData2OptCostTable(this.dataGrid108, optList_108);}
			if(this.dataGrid201){this._setData2OptCostTable(this.dataGrid201, optList_201);}
			if(this.dataGrid202){this._setData2OptCostTable(this.dataGrid202, optList_202);}
			if(this.dataGrid203){this._setData2OptCostTable(this.dataGrid203, optList_203);}
			if(this.dataGrid204){this._setData2OptCostTable(this.dataGrid204, optList_204);}
			if(this.dataGrid205){this._setData2OptCostTable(this.dataGrid205, optList_205);}
			if(this.dataGrid301){this._setData2OptCostTable(this.dataGrid301, optList_301);}
			if(this.dataGrid302){this._setData2OptCostTable(this.dataGrid302, optList_302);}
			if(this.dataGrid401){this._setData2OptCostTable(this.dataGrid401, optList_401);}
			if(this.dataGrid402){this._setData2OptCostTable(this.dataGrid402, optList_402);}
			if(this.dataGrid403){this._setData2OptCostTable(this.dataGrid403, optList_403);}
			if(this.dataGrid404){this._setData2OptCostTable(this.dataGrid404, optList_404);}

			if(this.dataGrid501){this._setData2OptCostTable(this.dataGrid501, optList_501);}
			if(this.dataGrid502){this._setData2OptCostTable(this.dataGrid502, optList_502);}
			if(this.dataGrid503){this._setData2OptCostTable(this.dataGrid503, optList_503);}
			if(this.dataGrid504){this._setData2OptCostTable(this.dataGrid504, optList_504);}
			if(this.dataGrid505){this._setData2OptCostTable(this.dataGrid505, optList_505);}
			if(this.dataGrid506){this._setData2OptCostTable(this.dataGrid506, optList_506);}
			if(this.dataGrid507){this._setData2OptCostTable(this.dataGrid507, optList_507);}
			if(this.dataGrid508){this._setData2OptCostTable(this.dataGrid508, optList_508);}
			if(this.dataGrid509){this._setData2OptCostTable(this.dataGrid509, optList_509);}
			if(this.dataGrid510){this._setData2OptCostTable(this.dataGrid510, optList_510);}
			if(this.dataGrid511){this._setData2OptCostTable(this.dataGrid511, optList_511);}
			if(this.dataGrid512){this._setData2OptCostTable(this.dataGrid512, optList_512);}
			if(this.dataGrid513){this._setData2OptCostTable(this.dataGrid513, optList_513);}
			if(this.dataGrid514){this._setData2OptCostTable(this.dataGrid514, optList_514);}
			if(this.dataGrid515){this._setData2OptCostTable(this.dataGrid515, optList_515);}
			//TODO
			if(this.dataGrid516){this._setData2OptCostTable(this.dataGrid516, optList_516);}
			if(this.dataGrid517){this._setData2OptCostTable(this.dataGrid517, optList_517);}
			if(this.dataGrid518){this._setData2OptCostTable(this.dataGrid518, optList_518);}
			if(this.dataGrid519){this._setData2OptCostTable(this.dataGrid519, optList_519);}
			if(this.dataGrid520){this._setData2OptCostTable(this.dataGrid520, optList_520);}
			if(this.dataGrid521){this._setData2OptCostTable(this.dataGrid521, optList_521);}
			if(this.dataGrid522){this._setData2OptCostTable(this.dataGrid522, optList_522);}
			if(this.dataGrid523){this._setData2OptCostTable(this.dataGrid523, optList_523);}
			if(this.dataGrid524){this._setData2OptCostTable(this.dataGrid524, optList_524);}
			if(this.dataGrid525){this._setData2OptCostTable(this.dataGrid525, optList_525);}
			if(this.dataGrid526){this._setData2OptCostTable(this.dataGrid526, optList_526);}
			if(this.dataGrid527){this._setData2OptCostTable(this.dataGrid527, optList_527);}
			if(this.dataGrid528){this._setData2OptCostTable(this.dataGrid528, optList_528);}

			clutil.initUIelement(this.$el);
		},
		/**
		 * テーブルにデータを表示
		 */
		_setData2OptCostTable:function($table, data){
			var rec = [];
			for(var i=0; i < data.length; i++) {
				rec[i] = {
						styleOptTypeID: data[i].styleOptTypeID,
						poOptTypeID:data[i].poOptTypeID,
						optionID:data[i].optionID,
						seq: data[i].seq,
						comment: data[i].comment,
						optHinban: data[i].optHinban,
						costTypeID: data[i].costTypeID,
						cost:data[i].cost,
						optStDate: data[i].optStDate,
						optEdDate: data[i].optEdDate,
						optOrdStopDate: data[i].optOrdStopDate,
				};
			}
			$table.setData({
				rowDelToggle: false,
				data: rec
			});
		},
		/**
		 * テーブルクリア
		 */
		clearTable : function() {
			//存在するものだけクリアする
			if(this.dataGrid001!=undefined){this._clearGrid(this.dataGrid001);}
			if(this.dataGrid101!=undefined){this._clearGrid(this.dataGrid101);}
			if(this.dataGrid102!=undefined){this._clearGrid(this.dataGrid102);}
			if(this.dataGrid103!=undefined){this._clearGrid(this.dataGrid103);}
			if(this.dataGrid104!=undefined){this._clearGrid(this.dataGrid104);}
			if(this.dataGrid105!=undefined){this._clearGrid(this.dataGrid105);}
			if(this.dataGrid106!=undefined){this._clearGrid(this.dataGrid106);}
			if(this.dataGrid107!=undefined){this._clearGrid(this.dataGrid107);}
			if(this.dataGrid108!=undefined){this._clearGrid(this.dataGrid108);}
			if(this.dataGrid201!=undefined){this._clearGrid(this.dataGrid201);}
			if(this.dataGrid202!=undefined){this._clearGrid(this.dataGrid202);}
			if(this.dataGrid203!=undefined){this._clearGrid(this.dataGrid203);}
			if(this.dataGrid204!=undefined){this._clearGrid(this.dataGrid204);}
			if(this.dataGrid205!=undefined){this._clearGrid(this.dataGrid205);}
			if(this.dataGrid301!=undefined){this._clearGrid(this.dataGrid301);}
			if(this.dataGrid302!=undefined){this._clearGrid(this.dataGrid302);}
			if(this.dataGrid401!=undefined){this._clearGrid(this.dataGrid401);}
			if(this.dataGrid402!=undefined){this._clearGrid(this.dataGrid402);}
			if(this.dataGrid403!=undefined){this._clearGrid(this.dataGrid403);}
			if(this.dataGrid404!=undefined){this._clearGrid(this.dataGrid404);}

			if(this.dataGrid501!=undefined){this._clearGrid(this.dataGrid501);}
			if(this.dataGrid502!=undefined){this._clearGrid(this.dataGrid502);}
			if(this.dataGrid503!=undefined){this._clearGrid(this.dataGrid503);}
			if(this.dataGrid504!=undefined){this._clearGrid(this.dataGrid504);}
			if(this.dataGrid505!=undefined){this._clearGrid(this.dataGrid505);}
			if(this.dataGrid506!=undefined){this._clearGrid(this.dataGrid506);}
			if(this.dataGrid507!=undefined){this._clearGrid(this.dataGrid507);}
			if(this.dataGrid508!=undefined){this._clearGrid(this.dataGrid508);}
			if(this.dataGrid509!=undefined){this._clearGrid(this.dataGrid509);}
			if(this.dataGrid510!=undefined){this._clearGrid(this.dataGrid510);}
			if(this.dataGrid511!=undefined){this._clearGrid(this.dataGrid511);}
			if(this.dataGrid512!=undefined){this._clearGrid(this.dataGrid512);}
			if(this.dataGrid513!=undefined){this._clearGrid(this.dataGrid513);}
			if(this.dataGrid514!=undefined){this._clearGrid(this.dataGrid514);}
			if(this.dataGrid515!=undefined){this._clearGrid(this.dataGrid515);}
			//TODO
			if(this.dataGrid516!=undefined){this._clearGrid(this.dataGrid516);}
			if(this.dataGrid517!=undefined){this._clearGrid(this.dataGrid517);}
			if(this.dataGrid518!=undefined){this._clearGrid(this.dataGrid518);}
			if(this.dataGrid519!=undefined){this._clearGrid(this.dataGrid519);}
			if(this.dataGrid520!=undefined){this._clearGrid(this.dataGrid520);}
			if(this.dataGrid521!=undefined){this._clearGrid(this.dataGrid521);}
			if(this.dataGrid522!=undefined){this._clearGrid(this.dataGrid522);}
			if(this.dataGrid523!=undefined){this._clearGrid(this.dataGrid523);}
			if(this.dataGrid524!=undefined){this._clearGrid(this.dataGrid524);}
			if(this.dataGrid525!=undefined){this._clearGrid(this.dataGrid525);}
			if(this.dataGrid526!=undefined){this._clearGrid(this.dataGrid526);}
			if(this.dataGrid527!=undefined){this._clearGrid(this.dataGrid527);}
			if(this.dataGrid528!=undefined){this._clearGrid(this.dataGrid528);}
		},
		_clearGrid: function($grid){
			$grid.setData({
				gridOptions: {
					autoHeight: false,
					frozenRow: 1,frozenColmun: 0
				},
				rowDelToggle: false,
				data: [
				       ]
			});
		},
		costTailIsEmptyFunc: function(item){
			if(
					//オートコンプリートのゴミデータに反応できない
					(item.seq != null && _.isEmpty(item.seq)) ||
					(item.comment != null && _.isEmpty(item.comment)) ||
					(item.optHinban != null && _.isEmpty(item.optHinban)) ||
					(item.cost != null &&  _.isEmpty(item.cost)) ||
					(item.optStDate != null && _.isEmpty(item.optStDate)) ||
					(item.optEdDate != null && _.isEmpty(item.optEdDate)) ||
					(item.optOrdStopDate != null && _.isEmpty(item.optOrdStopDate))
			){
				return false;
			}
			return true;	// 当該 dto は空であると判断。
		},
		costtypeTailIsEmptyFunc: function(item){
			if(
					//オートコンプリートのゴミデータに反応できない
					(item.seq != null && _.isEmpty(item.seq)) ||
					(item.comment != null && _.isEmpty(item.comment)) ||
					(item.optHinban != null && _.isEmpty(item.optHinban)) ||
					(item.costTypeID != null && _.isEmpty(item.costTypeID)) ||
					(item.optStDate != null && _.isEmpty(item.optStDate)) ||
					(item.optEdDate != null && _.isEmpty(item.optEdDate)) ||
					(item.optOrdStopDate != null && _.isEmpty(item.optOrdStopDate))
			){
				return false;
			}
			return true;	// 当該 dto は空であると判断。
		},
		/**
		 * 登録ボタン押下処理
		 */
		_buildSubmitReqFunction: function(opeTypeId, pgIndex){
			this.validator.clear();

			//予約取消はないので基本全部こちらに来る
			// validation
			var noOptDataflag = true;

			var isBasic = this.$('input[name="ca_basicFlag"]:checked').val() == 1;
			var ope_date = clcom.getOpeDate();

			var f_error0 = !this.validator1.valid();
			var f_error = false;

			var upd_flag = 0;

			var stDate = 0;
			var edDate = 0;
			var orgStopDate = 0;
			var $tgt = $(this);
			// 適用開始日 運用日翌日
			var $stDate = this.$el.find('input[name="stDate"]')
			.each(function(){
				stDate = clutil.dateFormat(this.value, "yyyymmdd");
			});

			// 適用終了日 最大日付
			var $edDate = this.$el.find('input[name="edDate"]')
			.each(function(){
				edDate = clutil.dateFormat(this.value, "yyyymmdd");
			});

			// 発注停止日 空白
			var $orgStopDate = this.$el.find('input[name="ordStopDate"]')
			.each(function(){
				orgStopDate = clutil.dateFormat(this.value, "yyyymmdd");
			});
			if (stDate > edDate){
				f_error = true;
				this.validator.setErrorMsg( $stDate, clmsg.EGM0013);
				this.validator.setErrorMsg( $edDate, clmsg.EGM0013);
			}
			if(orgStopDate > 0){
				if (orgStopDate > edDate){
					f_error = true;
					this.validator.setErrorMsg( $orgStopDate, clmsg.EPO0051);
				}
				if (stDate > orgStopDate){
					f_error = true;
					this.validator.setErrorMsg( $orgStopDate, clmsg.EPO0053);
				}
			}
			switch(this.options.opeTypeId){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW:
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD:
				// 登録時のみ発注停止日と運用日をチェック
				if(orgStopDate > 0){
					if (clutil.addDate(clcom.getOpeDate(), 1) > orgStopDate){
						f_error = true;
						this.validator.setErrorMsg( $orgStopDate, clmsg.EPO0050);
					}
				}
				upd_flag = 1;
				break;
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_DEL:
				break;
			default:
				break;
			}
			var optGrp = clutil.view2data(this.$('#ca_base_form'));
			//帰ってきたエラーの際どの行がエラーか判断するためにテーブルを上から順に並べる
			//下手にソートを入れると正しい箇所にエラーが出るので注意
			var optList_Table001	= (this.dataGrid001!=undefined)?this.dataGrid001.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc}):null;	//テーブル001

			var optList_Table101	= (this.dataGrid101!=undefined)?this.dataGrid101.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル101
			var optList_Table102	= (this.dataGrid102!=undefined)?this.dataGrid102.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル102
			var optList_Table103	= (this.dataGrid103!=undefined)?this.dataGrid103.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル103
			var optList_Table104	= (this.dataGrid104!=undefined)?this.dataGrid104.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル104
			var optList_Table105	= (this.dataGrid105!=undefined)?this.dataGrid105.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル105
			var optList_Table106	= (this.dataGrid106!=undefined)?this.dataGrid106.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル106
			var optList_Table107	= (this.dataGrid107!=undefined)?this.dataGrid107.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル107
			var optList_Table108	= (this.dataGrid108!=undefined)?this.dataGrid108.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル108

			var optList_Table201	= (this.dataGrid201!=undefined)?this.dataGrid201.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル201
			var optList_Table202	= (this.dataGrid202!=undefined)?this.dataGrid202.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル202
			var optList_Table203	= (this.dataGrid203!=undefined)?this.dataGrid203.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル203
			var optList_Table204	= (this.dataGrid204!=undefined)?this.dataGrid204.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル204
			var optList_Table205	= (this.dataGrid205!=undefined)?this.dataGrid205.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル205

			var optList_Table301	= (this.dataGrid301!=undefined)?this.dataGrid301.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル301
			var optList_Table302	= (this.dataGrid302!=undefined)?this.dataGrid302.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル302

			var optList_Table401	= (this.dataGrid401!=undefined)?this.dataGrid401.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル401
			var optList_Table402	= (this.dataGrid402!=undefined)?this.dataGrid402.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル402
			var optList_Table403	= (this.dataGrid403!=undefined)?this.dataGrid403.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル403
			var optList_Table404	= (this.dataGrid404!=undefined)?this.dataGrid404.getData({ delflag: false,  tailEmptyCheckFunc: this.costtypeTailIsEmptyFunc }):null;	//テーブル404

			var optList_Table501	= (this.dataGrid501!=undefined)?this.dataGrid501.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル501
			var optList_Table502	= (this.dataGrid502!=undefined)?this.dataGrid502.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル502
			var optList_Table503	= (this.dataGrid503!=undefined)?this.dataGrid503.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル503
			var optList_Table504	= (this.dataGrid504!=undefined)?this.dataGrid504.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル504
			var optList_Table505	= (this.dataGrid505!=undefined)?this.dataGrid505.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テー
			var optList_Table506	= (this.dataGrid506!=undefined)?this.dataGrid506.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル506
			var optList_Table507	= (this.dataGrid507!=undefined)?this.dataGrid507.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル507
			var optList_Table508	= (this.dataGrid508!=undefined)?this.dataGrid508.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル508
			var optList_Table509	= (this.dataGrid509!=undefined)?this.dataGrid509.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル509
			var optList_Table510	= (this.dataGrid510!=undefined)?this.dataGrid510.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル510
			var optList_Table511	= (this.dataGrid511!=undefined)?this.dataGrid511.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル511
			var optList_Table512	= (this.dataGrid512!=undefined)?this.dataGrid512.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル512
			var optList_Table513	= (this.dataGrid513!=undefined)?this.dataGrid513.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル513
			var optList_Table514	= (this.dataGrid514!=undefined)?this.dataGrid514.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル514
			var optList_Table515	= (this.dataGrid515!=undefined)?this.dataGrid515.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル515
			var optList_Table516	= (this.dataGrid516!=undefined)?this.dataGrid516.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル516
			var optList_Table517	= (this.dataGrid517!=undefined)?this.dataGrid517.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル517
			var optList_Table518	= (this.dataGrid518!=undefined)?this.dataGrid518.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル518
			var optList_Table519	= (this.dataGrid519!=undefined)?this.dataGrid519.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル519
			var optList_Table520	= (this.dataGrid520!=undefined)?this.dataGrid520.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル520
			var optList_Table521	= (this.dataGrid521!=undefined)?this.dataGrid521.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル521
			var optList_Table522	= (this.dataGrid522!=undefined)?this.dataGrid522.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル522
			var optList_Table523	= (this.dataGrid523!=undefined)?this.dataGrid523.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル523
			var optList_Table524	= (this.dataGrid524!=undefined)?this.dataGrid524.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル524
			var optList_Table525	= (this.dataGrid525!=undefined)?this.dataGrid525.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル525
			var optList_Table526	= (this.dataGrid526!=undefined)?this.dataGrid526.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル526
			var optList_Table527	= (this.dataGrid527!=undefined)?this.dataGrid527.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル527
			var optList_Table528	= (this.dataGrid528!=undefined)?this.dataGrid528.getData({ delflag: false,  tailEmptyCheckFunc: this.costTailIsEmptyFunc }):null;	//テーブル528

			var optList = new Array;	//メンズレディース
//			var optList2 = new Array;	//シャツ

			var $POTypeID = this.$("#ca_poTypeID");
			//注意styleOptTypeIDが不明なのはあとで設定一応マイナスを入れておく
			if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_MENS){
				//メンズ
				if(optList_Table001!=null && optList_Table001.length != 0){this._tdata2packet(optList, optList_Table001,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SUIT, amcm_type.AMCM_TYPE_WASHABLE_TYPE);}
				if(optList_Table101!=null &&optList_Table101.length != 0){this._tdata2packet(optList, optList_Table101,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_FOUR_ARM_BUTTON_TYPE);}
				if(optList_Table102!=null &&optList_Table102.length != 0){this._tdata2packet(optList, optList_Table102,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_SUMMAR_SPEC_TYPE);}
				if(optList_Table103!=null && optList_Table103.length != 0){this._tdata2packet(optList, optList_Table103,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_CHANGE_POCKET_TYPE);}
				if(optList_Table104!=null && optList_Table104.length != 0){this._tdata2packet(optList, optList_Table104,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);}
				if(optList_Table105!=null && optList_Table105.length != 0){this._tdata2packet(optList, optList_Table105,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_REAL_BUTTON_HOLE_TYPE);}
				if(optList_Table106!=null && optList_Table106.length != 0){this._tdata2packet(optList, optList_Table106,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_AMF_STITCH_OPTION_TYPE);}
				if(optList_Table107!=null && optList_Table107.length != 0){this._tdata2packet(optList, optList_Table107,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE);}
				if(optList_Table108!=null && optList_Table108.length != 0){this._tdata2packet(optList, optList_Table108,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_ODAIBA_TYPE);}
				if(optList_Table202!=null && optList_Table202.length != 0){this._tdata2packet(optList, optList_Table202,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);}
				if(optList_Table203!=null && optList_Table203.length != 0){this._tdata2packet(optList, optList_Table203,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_SLACKS, amcm_type.AMCM_TYPE_ADJUSTER_TYPE);}
				if(optList_Table401!=null && optList_Table401.length != 0){this._tdata2packet(optList, optList_Table401,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST, amcm_type.AMCM_TYPE_AMF_STITCH_OPTION_TYPE);}
				if(optList_Table402!=null && optList_Table402.length != 0){this._tdata2packet(optList, optList_Table402,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST, amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE);}
				if(optList_Table403!=null && optList_Table403.length != 0){this._tdata2packet(optList, optList_Table403,	amcm_type.AMCM_VAL_MENS_STYLE_OPT_CLASS_VEST, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);}
			}else if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_LADYS){
				// レディス
				if(optList_Table101!=null && optList_Table101.length != 0){this._tdata2packet(optList, optList_Table101,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_AMF_STITCH_OPTION_TYPE);}
				if(optList_Table102!=null && optList_Table102.length != 0){this._tdata2packet(optList, optList_Table102,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_FREE_BREAST_POCKET);}
				if(optList_Table103!=null && optList_Table103.length != 0){this._tdata2packet(optList, optList_Table103,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_ARM_DESIGN_TYPE);}
				if(optList_Table104!=null && optList_Table104.length != 0){this._tdata2packet(optList, optList_Table104,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_INNER_POCKET_TYPE);}
				if(optList_Table105!=null && optList_Table105.length != 0){this._tdata2packet(optList, optList_Table105,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_CENTER_VENT_TYPE);}
				if(optList_Table106!=null && optList_Table106.length != 0){this._tdata2packet(optList, optList_Table106,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);}
				if(optList_Table107!=null && optList_Table107.length != 0){this._tdata2packet(optList, optList_Table107,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_JACKET, amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE);}
				if(optList_Table202!=null && optList_Table202.length != 0){this._tdata2packet(optList, optList_Table202,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_SKIRT, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);}
				if(optList_Table302!=null && optList_Table302.length != 0){this._tdata2packet(optList, optList_Table302,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_PANTS, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);}
				if(optList_Table401!=null && optList_Table401.length != 0){this._tdata2packet(optList, optList_Table401,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST, amcm_type.AMCM_TYPE_PIN_BUCKLE_TYPE);}
				if(optList_Table402!=null && optList_Table402.length != 0){this._tdata2packet(optList, optList_Table402,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST, amcm_type.AMCM_TYPE_CHANGE_BUTTON_TYPE);}
				if(optList_Table403!=null && optList_Table403.length != 0){this._tdata2packet(optList, optList_Table403,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST, amcm_type.AMCM_TYPE_CHANGE_BACK_FABRIC_TYPE);}
				if(optList_Table404!=null && optList_Table404.length != 0){this._tdata2packet(optList, optList_Table404,	amcm_type.AMCM_VAL_LADYS_STYLE_OPT_CLASS_VEST, amcm_type.AMCM_TYPE_AMF_STITCH_OPTION_TYPE);}
			}else if($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				// シャツ
				if(optList_Table501!=null && optList_Table501.length != 0){this._tdata2packet2(optList, optList_Table501,	amcm_type.AMCM_TYPE_COLLAR_OP1_TYPE );}
				if(optList_Table502!=null && optList_Table502.length != 0){this._tdata2packet2(optList, optList_Table502,	amcm_type.AMCM_TYPE_COLLAR_OP2_TYPE );}
				if(optList_Table503!=null && optList_Table503.length != 0){this._tdata2packet2(optList, optList_Table503,	amcm_type.AMCM_TYPE_CUFF_TYPE );}
				if(optList_Table504!=null && optList_Table504.length != 0){this._tdata2packet2(optList, optList_Table504,	amcm_type.AMCM_TYPE_CLERIC_TYPE );}
				if(optList_Table505!=null && optList_Table505.length != 0){this._tdata2packet2(optList, optList_Table505,	amcm_type.AMCM_TYPE_COLLAR_CORE_TYPE );}
				if(optList_Table506!=null && optList_Table506.length != 0){this._tdata2packet2(optList, optList_Table506,	amcm_type.AMCM_TYPE_FRONTBODY_TYPE );}
				if(optList_Table507!=null && optList_Table507.length != 0){this._tdata2packet2(optList, optList_Table507,	amcm_type.AMCM_TYPE_POCKET_TYPE );}
				if(optList_Table508!=null && optList_Table508.length != 0){this._tdata2packet2(optList, optList_Table508,	amcm_type.AMCM_TYPE_BACKBODY_TYPE );}
				if(optList_Table509!=null && optList_Table509.length != 0){this._tdata2packet2(optList, optList_Table509,	amcm_type.AMCM_TYPE_BUTTON_TYPE );}
				if(optList_Table510!=null && optList_Table510.length != 0){this._tdata2packet2(optList, optList_Table510,	amcm_type.AMCM_TYPE_BUTTON_HOLE_OPTION_TYPE );}
				if(optList_Table511!=null && optList_Table511.length != 0){this._tdata2packet2(optList, optList_Table511,	amcm_type.AMCM_TYPE_BUTTON_SUTURE_TYPE );}
				if(optList_Table512!=null && optList_Table512.length != 0){this._tdata2packet2(optList, optList_Table512,	amcm_type.AMCM_TYPE_AMF_STITCH_OPTION_TYPE );}
				if(optList_Table513!=null && optList_Table513.length != 0){this._tdata2packet2(optList, optList_Table513,	amcm_type.AMCM_TYPE_INITIAL_OPTION_TYPE );}
				if(optList_Table514!=null && optList_Table514.length != 0){this._tdata2packet2(optList, optList_Table514,	amcm_type.AMCM_TYPE_INITIAL_AREA_TYPE );}
				if(optList_Table515!=null && optList_Table515.length != 0){this._tdata2packet2(optList, optList_Table515,	amcm_type.AMCM_TYPE_COLOR_TYPE );}
				if(optList_Table516!=null && optList_Table516.length != 0){this._tdata2packet2(optList, optList_Table516,	amcm_type.AMCM_TYPE_FORM_TYPE );}
				if(optList_Table517!=null && optList_Table517.length != 0){this._tdata2packet2(optList, optList_Table517,	amcm_type.AMCM_TYPE_POCKET_SQUARE_TYPE );}
				if(optList_Table518!=null && optList_Table518.length != 0){this._tdata2packet2(optList, optList_Table518,	amcm_type.AMCM_TYPE_NECK_SIZE_TYPE );}
				if(optList_Table519!=null && optList_Table519.length != 0){this._tdata2packet2(optList, optList_Table519,	amcm_type.AMCM_TYPE_DEGREE_LEFT_TYPE );}
				if(optList_Table520!=null && optList_Table520.length != 0){this._tdata2packet2(optList, optList_Table520,	amcm_type.AMCM_TYPE_DEGREE_RIGHT_TYPE );}
				if(optList_Table521!=null && optList_Table521.length != 0){this._tdata2packet2(optList, optList_Table521,	amcm_type.AMCM_TYPE_BODY_FORM_TYPE );}
				if(optList_Table522!=null && optList_Table522.length != 0){this._tdata2packet2(optList, optList_Table522,	amcm_type.AMCM_TYPE_ACROSS_SHOULDERS_TYPE );}
				if(optList_Table523!=null && optList_Table523.length != 0){this._tdata2packet2(optList, optList_Table523,	amcm_type.AMCM_TYPE_CHEST_MEASUREMENT_TYPE );}
				if(optList_Table524!=null && optList_Table524.length != 0){this._tdata2packet2(optList, optList_Table524,	amcm_type.AMCM_TYPE_WAIST_MEASUREMENT_TYPE );}
				if(optList_Table525!=null && optList_Table525.length != 0){this._tdata2packet2(optList, optList_Table525,	amcm_type.AMCM_TYPE_AROUND_BOTTOM_TYPE );}
				if(optList_Table526!=null && optList_Table526.length != 0){this._tdata2packet2(optList, optList_Table526,	amcm_type.AMCM_TYPE_BODY_LEN_TYPE );}
				if(optList_Table527!=null && optList_Table527.length != 0){this._tdata2packet2(optList, optList_Table527,	amcm_type.AMCM_TYPE_CUFF_LEN_LEFT_TYPE );}
				if(optList_Table528!=null && optList_Table528.length != 0){this._tdata2packet2(optList, optList_Table528,	amcm_type.AMCM_TYPE_CUFF_LEN_RIGHT_TYPE );}
			}else{
				;
			}

			//optListの重複ちぇく
			chkMap = new Object();
			for(var i = 0; i < optList.length; i++){
				var opt =  optList[i];
				if (opt.optHinban == null || _.isEmpty(opt.optHinban.trim())){
					//空白の場合は除く
					continue;
				}else{
					noOptDataflag = false;
				}
				if(chkMap[opt.optHinban]){
					//どこのテーブルかわからないが重複あり
					chkMap[opt.optHinban] += 1;
				}else{
					chkMap[opt.optHinban] = 1;
					noOptDataflag = false;
				}
			}

			if(noOptDataflag){
				f_error = true;
			}
			//テーブルまわりのの入力チェック
			//空白、重複チェック
			if ($POTypeID.val() == amcm_type.AMCM_VAL_PO_CLASS_SHIRT){
				if(optList_Table501!=null && optList_Table501.length != 0){
					if(this._OptTableCheck2(this.dataGrid501, optList_Table501, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table502!=null && optList_Table502.length != 0){
					if(this._OptTableCheck2(this.dataGrid502, optList_Table502, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table503!=null && optList_Table503.length != 0){
					if(this._OptTableCheck2(this.dataGrid503, optList_Table503, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table504!=null && optList_Table504.length != 0){
					if(this._OptTableCheck2(this.dataGrid504, optList_Table504, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table505!=null && optList_Table505.length != 0){
					if(this._OptTableCheck2(this.dataGrid505, optList_Table505, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table506!=null && optList_Table506.length != 0){
					if(this._OptTableCheck2(this.dataGrid506, optList_Table506, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table507!=null && optList_Table507.length != 0){
					if(this._OptTableCheck2(this.dataGrid507, optList_Table507, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table508!=null && optList_Table508.length != 0){
					if(this._OptTableCheck2(this.dataGrid508, optList_Table508, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table509!=null && optList_Table509.length != 0){
					if(this._OptTableCheck2(this.dataGrid509, optList_Table509, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table510!=null && optList_Table510.length != 0){
					if(this._OptTableCheck2(this.dataGrid510, optList_Table510, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table511!=null && optList_Table511.length != 0){
					if(this._OptTableCheck2(this.dataGrid511, optList_Table511, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table512!=null && optList_Table512.length != 0){
					if(this._OptTableCheck2(this.dataGrid512, optList_Table512, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table513!=null && optList_Table513.length != 0){
					if(this._OptTableCheck2(this.dataGrid513, optList_Table513, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table514!=null && optList_Table514.length != 0){
					if(this._OptTableCheck2(this.dataGrid514, optList_Table514, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table515!=null && optList_Table515.length != 0){
					if(this._OptTableCheck2(this.dataGrid515, optList_Table515, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table516!=null && optList_Table516.length != 0){
					if(this._OptTableCheck2(this.dataGrid516, optList_Table516, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table517!=null && optList_Table517.length != 0){
					if(this._OptTableCheck2(this.dataGrid517, optList_Table517, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table518!=null && optList_Table518.length != 0){
					if(this._OptTableCheck2(this.dataGrid518, optList_Table518, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table519!=null && optList_Table519.length != 0){
					if(this._OptTableCheck2(this.dataGrid519, optList_Table519, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table520!=null && optList_Table520.length != 0){
					if(this._OptTableCheck2(this.dataGrid520, optList_Table520, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table521!=null && optList_Table521.length != 0){
					if(this._OptTableCheck2(this.dataGrid521, optList_Table521, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table522!=null && optList_Table522.length != 0){
					if(this._OptTableCheck2(this.dataGrid522, optList_Table522, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table523!=null && optList_Table523.length != 0){
					if(this._OptTableCheck2(this.dataGrid523, optList_Table523, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table524!=null && optList_Table524.length != 0){
					if(this._OptTableCheck2(this.dataGrid524, optList_Table524, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table525!=null && optList_Table525.length != 0){
					if(this._OptTableCheck2(this.dataGrid525, optList_Table525, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table526!=null && optList_Table526.length != 0){
					if(this._OptTableCheck2(this.dataGrid526, optList_Table526, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table527!=null && optList_Table527.length != 0){
					if(this._OptTableCheck2(this.dataGrid527, optList_Table527, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table528!=null && optList_Table528.length != 0){
					if(this._OptTableCheck2(this.dataGrid528, optList_Table528, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
			}else{
				if(optList_Table001!=null && optList_Table001.length != 0){
					if(this._OptTableCheck(this.dataGrid001, optList_Table001, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table101!=null && optList_Table101.length != 0){
					if(this._OptTableCheck(this.dataGrid101, optList_Table101, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table102!=null && optList_Table102.length != 0){
					if(this._OptTableCheck(this.dataGrid102, optList_Table102, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table103!=null && optList_Table103.length != 0){
					if(this._OptTableCheck(this.dataGrid103, optList_Table103, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table104!=null && optList_Table104.length != 0){
					if(this._OptTableCheck(this.dataGrid104, optList_Table104, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table105!=null && optList_Table105.length != 0){
					if(this._OptTableCheck(this.dataGrid105, optList_Table105, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table106!=null && optList_Table106.length != 0){
					if(this._OptTableCheck(this.dataGrid106, optList_Table106, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table107!=null && optList_Table107.length != 0){
					if(this._OptTableCheck(this.dataGrid107, optList_Table107, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table108!=null && optList_Table108.length != 0){
					if(this._OptTableCheck(this.dataGrid108, optList_Table108, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table201!=null && optList_Table201.length != 0){
					if(this._OptTableCheck(this.dataGrid201, optList_Table201, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table202!=null && optList_Table202.length != 0){
					if(this._OptTableCheck(this.dataGrid202, optList_Table202, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table203!=null && optList_Table203.length != 0){
					if(this._OptTableCheck(this.dataGrid203, optList_Table203, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table204!=null && optList_Table204.length != 0){
					if(this._OptTableCheck(this.dataGrid204, optList_Table204, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table205!=null && optList_Table205.length != 0){
					if(this._OptTableCheck(this.dataGrid205, optList_Table205, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table301!=null && optList_Table301.length != 0){
					if(this._OptTableCheck(this.dataGrid301, optList_Table301, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table302!=null && optList_Table302.length != 0){
					if(this._OptTableCheck(this.dataGrid302, optList_Table302, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table401!=null && optList_Table401.length != 0){
					if(this._OptTableCheck(this.dataGrid401, optList_Table401, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table402!=null && optList_Table402.length != 0){
					if(this._OptTableCheck(this.dataGrid402, optList_Table402, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
				if(optList_Table403!=null && optList_Table403.length != 0){
					if(this._OptTableCheck(this.dataGrid403, optList_Table403, stDate, edDate, upd_flag) == true){
						f_error = true;
					}
				}
			}

			try{
				this.mdBaseView.setAutoValidate(false);
				if(f_error0){
					// valid() -- NG
					clutil.mediator.trigger('onTicker',clmsg.cl_echoback);
					clutil.setFocus(this.$el.find('.cl_error_field').first());
					return null;
				}
				if(f_error){
					// 独自チェック -- NG
					if(noOptDataflag){
						clutil.mediator.trigger('onTicker',clmsg.EPO0064);
					}else{
						clutil.mediator.trigger('onTicker',clmsg.cl_echoback);
						clutil.setFocus(this.$el.find('.cl_error_field').first());
					}
					return null;
				}
			}finally{
				this.mdBaseView.setAutoValidate(true);
			}

			// listへhead情報の適応
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW
					|| this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD){

			}
			var optList2 = new Array;
			for(var i = 0; i < optList.length; i++){
				var opt = optList[i];
				if (
						(opt.optHinban == null || opt.optHinban.trim().length == 0)
				) {
					continue;
				}
				var obj = {
						styleOptTypeID	: opt.styleOptTypeID,
						poOptTypeID	: opt.poOptTypeID,
						optionID	: opt.optionID,
						comment		: opt.comment,
						optHinban	: opt.optHinban,
						costTypeID	: opt.costTypeID,
						cost		: opt.cost,
						seq			: opt.seq,
						optStDate		: opt.optStDate,
						optEdDate		: opt.optEdDate,
						optOrdStopDate		: opt.optOrdStopDate
				};
				optList2.push(obj);
			}
			var reqHead = {
					opeTypeId : this.options.opeTypeId,
			};
			var updReq = {
					optGrp  : optGrp,
					optList  : optList2,
			};
			if(this.options.opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				reqHead.opeTypeId = am_proto_defs.AM_PROTO_COMMON_RTYPE_NEW;
			}
			var reqObj = {
					reqHead : reqHead,
					AMPOV0210UpdReq  : updReq
			};
			return {
				resId : clcom.pageId,
				data: reqObj
			};
		},
		//スタイルのテーブルは複数あるが同一パケットのため、まとめるための関数
		//packetgList パケットの配列
		//tdata それぞれのテーブルをtableview2data処理したデータ。
		//type1	ジャケット・スラックス・ベスト等
		//type2 袖ボタン４つ区分等
		//シャツの場合は行ごとにpoOptTypeIDを持つのでtype2不要、type1も0固定だが将来的に持つ可能性があるので残しておく
		_tdata2packet: function(packetgList, tdata, type1,type2){
			$.each(tdata, function(i){
				var obj = {
						styleOptTypeID	: type1,
						poOptTypeID	: type2,
						optionID	: (this.optionID!=null)?this.optionID:0,
						comment		: (this.comment!=null)?this.comment:"",
						optHinban	: (this.optHinban!=null)?this.optHinban:"",
						costTypeID	: (this.costTypeID!=null)?this.costTypeID:0,
						cost		: 0,
						seq			: (this.seq!=null)?this.seq:"",
						optStDate		: (this.optStDate!=null)?this.optStDate:"",
						optEdDate		: (this.optEdDate!=null)?this.optEdDate:"",
						optOrdStopDate		: (this.optOrdStopDate!=null)?this.optOrdStopDate:"",
				};
				packetgList.push(obj);
			});
		},
		_tdata2packet2: function(packetgList, tdata, type1){
			$.each(tdata, function(i){
				var obj = {
						styleOptTypeID	: 0,
						poOptTypeID	: type1,
						optionID	: (this.optionID!=null)?this.optionID:0,
						comment		: (this.comment!=null)?this.comment:"",
						optHinban	: (this.optHinban!=null)?this.optHinban:"",
						costTypeID	: 0,
						cost		: (this.cost!=null)?this.cost:"",
						seq			: (this.seq!=null)?this.seq:"",
						optStDate		: (this.optStDate!=null)?this.optStDate:"",
						optEdDate		: (this.optEdDate!=null)?this.optEdDate:"",
						optOrdStopDate		: (this.optOrdStopDate!=null)?this.optOrdStopDate:"",
				};
				packetgList.push(obj);
			});
		},
		//メンズレディース用
		_OptTableCheck: function($grid, list, stDate, edDate, upflag){
			var f_error = false;
			var _this = this;

			//グリッドエラーリセット
			$grid.clearAllCellMessage();
			if(!$grid.isValid({tailEmptyCheckFunc : _this.costtypeTailIsEmptyFunc})){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				f_error = true;
			}


			var gridData = $grid.getData({ delflag: false,  tailEmptyCheckFunc: _this.costtypeTailIsEmptyFunc});
			var use_line_cnt = gridData.length; //何行目まで有効かチェック
			var line_cnt = 0;
			chkMap = new Object();
			for(var i = 0; i < use_line_cnt; i++){
				var opt =  gridData[i];
				if ((opt.seq == null || opt.seq =="")
						||(opt.comment == null || _.isEmpty(opt.comment))
						||(opt.optHinban == null || _.isEmpty(opt.optHinban))
				){
					continue;
				}
				var key = opt.seq + "_" + opt.comment.trim() + "_" + opt.optHinban.trim();
				if(chkMap[key]){
					//重複あり
					chkMap[key] += 1;
				}else{
					chkMap[key] = 1;
				}
			}
			var cellMessages = [];
			for (var i = 0; i <  use_line_cnt; i++ ){
				var rowDto = gridData[i];
				var rowId = rowDto[$grid.dataView.idProperty];

				// コスト
				if(rowDto.costTypeID == null ||  rowDto.costTypeID <= 0){
					f_error = true;
				}
				if((rowDto.seq == null ||  rowDto.seq =="")
						|| (rowDto.optHinban == null ||  _.isEmpty(rowDto.optHinban.trim()))){
					f_error = true;
				}else if(rowDto.comment == null ||  _.isEmpty(rowDto.comment.trim())){
					//内容に関してはスペースのみというバカげた指定をされることがあるので
					// エラーメッセージを通知。
					cellMessages.push({
						rowId: rowId,
						colId: 'optHinban',
						level: 'error',
						message: clutil.fmtargs(clmsg.cl_required)
					});
					f_error = true;
				}else{
					var key = rowDto.seq + "_" + rowDto.comment.trim() + "_" + rowDto.optHinban.trim();
					if(chkMap[key] > 1){
						// chkMapには全リスト情報が入っているので2以上の場合重複とみなせる。1は自分自身なのでスルー
						cellMessages.push({
							rowId: rowId,
							colId: 'seq',
							level: 'error',
							message: clutil.fmtargs(clmsg.EGM0009, [rowDto.seq+","+rowDto.comment.trim()+","+rowDto.optHinban.trim()])
						});
						cellMessages.push({
							rowId: rowId,
							colId: 'comment',
							level: 'error',
							message: clutil.fmtargs(clmsg.EGM0009, [rowDto.seq+","+rowDto.comment.trim()+","+rowDto.optHinban.trim()])
						});
						cellMessages.push({
							rowId: rowId,
							colId: 'optHinban',
							level: 'error',
							message: clutil.fmtargs(clmsg.EGM0009, [rowDto.seq+","+rowDto.comment.trim()+","+rowDto.optHinban.trim()])
						});
						f_error = true;
					}
				}
				if(rowDto.optStDate > rowDto.optEdDate){
					cellMessages.push({
						rowId: rowId,
						colId: 'optStDate',
						level: 'error',
						message: clutil.fmtargs(clmsg.EGM0013)
					});
					cellMessages.push({
						rowId: rowId,
						colId: 'optEdDate',
						level: 'error',
						message: clutil.fmtargs(clmsg.EGM0013)
					});
					f_error = true;
				}else{
					if(rowDto.optStDate < stDate){
						f_error = true;
						cellMessages.push({
							rowId: rowId,
							colId: 'optStDate',
							level: 'error',
							message: clutil.fmtargs(clmsg.EPO0059)
						});
					}
					if(rowDto.optEdDate > edDate){
						f_error = true;
						cellMessages.push({
							rowId: rowId,
							colId: 'optEdDate',
							level: 'error',
							message: clutil.fmtargs(clmsg.EPO0059)
						});
					}

				}
				if(rowDto.optOrdStopDate != null && rowDto.optOrdStopDate > 0){
					if (rowDto.optOrdStopDate > rowDto.optEdDate){
						f_error = true;
						cellMessages.push({
							rowId: rowId,
							colId: 'optOrdStopDate',
							level: 'error',
							message: clutil.fmtargs(clmsg.EPO0051)
						});
					}
					if (rowDto.optStDate > rowDto.optOrdStopDate){
						f_error = true;
						cellMessages.push({
							rowId: rowId,
							colId: 'optOrdStopDate',
							level: 'error',
							message: clutil.fmtargs(clmsg.EPO0053)
						});

					}
					if(upflag != 0){
						if (clutil.addDate(clcom.getOpeDate(), 1) > rowDto.optOrdStopDate){
							f_error = true;
							cellMessages.push({
								rowId: rowId,
								colId: 'optOrdStopDate',
								level: 'error',
								message: clutil.fmtargs(clmsg.EPO0050)
							});
						}
					}
				}

			}
			if(!_.isEmpty(cellMessages)){
				$grid.setCellMessage(cellMessages);
			}
			return f_error;

		},
		//シャツ用
		_OptTableCheck2: function($grid, list, stDate, edDate , upflag){
			var f_error = false;
			var _this = this;
			//グリッドエラーリセット
			$grid.clearAllCellMessage();
			if(!$grid.isValid({tailEmptyCheckFunc : _this.costTailIsEmptyFunc})){
				clutil.mediator.trigger('onTicker', clmsg.cl_echoback);
				f_error = true;
			}
			var gridData = $grid.getData({ delflag: false,  tailEmptyCheckFunc: _this.costTailIsEmptyFunc});
			var use_line_cnt = gridData.length; //何行目まで有効かチェック
			var line_cnt = 0;
			chkMap = new Object();
			for(var i = 0; i < use_line_cnt; i++){
				var opt =  gridData[i];
				if ((opt.seq == null || opt.seq =="")
						||(opt.comment == null || _.isEmpty(opt.comment.trim()))
						||(opt.optHinban == null || _.isEmpty(opt.optHinban.trim()))
				){
					continue;
				}
				var key = opt.seq + "_" + opt.comment.trim() + "_" + opt.optHinban.trim();
				if(chkMap[key]){
					//重複あり
					chkMap[key] += 1;
				}else{
					chkMap[key] = 1;
				}
			}
			var cellMessages = [];
			for (var i = 0; i <  use_line_cnt; i++ ){
				var rowDto = gridData[i];
				var rowId = rowDto[$grid.dataView.idProperty];

				// コスト
				if(rowDto.cost == null ||  rowDto.cost==""){
					f_error = true;
				}
				if((rowDto.seq == null ||  rowDto.seq =="")
						|| (rowDto.optHinban == null ||  _.isEmpty(rowDto.optHinban.trim()))){
					f_error = true;
				}else if(rowDto.comment == null ||  _.isEmpty(rowDto.comment.trim())){
					//内容に関してはスペースのみというバカげた指定をされることがあるので
					// エラーメッセージを通知。
					cellMessages.push({
						rowId: rowId,
						colId: 'optHinban',
						level: 'error',
						message: clutil.fmtargs(clmsg.cl_required)
					});
					f_error = true;
				}else{
					var key = rowDto.seq + "_" + rowDto.comment.trim() + "_" + rowDto.optHinban.trim();
					if(chkMap[key] > 1){
						// chkMapには全リスト情報が入っているので2以上の場合重複とみなせる。1は自分自身なのでスルー
						cellMessages.push({
							rowId: rowId,
							colId: 'seq',
							level: 'error',
							message: clutil.fmtargs(clmsg.EGM0009, [rowDto.seq+","+rowDto.comment.trim()+","+rowDto.optHinban.trim()])
						});
						cellMessages.push({
							rowId: rowId,
							colId: 'comment',
							level: 'error',
							message: clutil.fmtargs(clmsg.EGM0009, [rowDto.seq+","+rowDto.comment.trim()+","+rowDto.optHinban.trim()])
						});
						cellMessages.push({
							rowId: rowId,
							colId: 'optHinban',
							level: 'error',
							message: clutil.fmtargs(clmsg.EGM0009, [rowDto.seq+","+rowDto.comment.trim()+","+rowDto.optHinban.trim()])
						});
						f_error = true;
					}
				}
				if(rowDto.optStDate > rowDto.optEdDate){
					cellMessages.push({
						rowId: rowId,
						colId: 'optStDate',
						level: 'error',
						message: clutil.fmtargs(clmsg.EGM0013)
					});
					cellMessages.push({
						rowId: rowId,
						colId: 'optEdDate',
						level: 'error',
						message: clutil.fmtargs(clmsg.EGM0013)
					});
					f_error = true;
				}else{
					if(rowDto.optStDate < stDate){
						f_error = true;
						cellMessages.push({
							rowId: rowId,
							colId: 'optStDate',
							level: 'error',
							message: clutil.fmtargs(clmsg.EPO0059)
						});
					}
					if(rowDto.optEdDate > edDate){
						f_error = true;
						cellMessages.push({
							rowId: rowId,
							colId: 'optEdDate',
							level: 'error',
							message: clutil.fmtargs(clmsg.EPO0059)
						});
					}

				}
				if(rowDto.optOrdStopDate != null && rowDto.optOrdStopDate > 0){
					if (rowDto.optOrdStopDate > rowDto.optEdDate){
						f_error = true;
						cellMessages.push({
							rowId: rowId,
							colId: 'optOrdStopDate',
							level: 'error',
							message: clutil.fmtargs(clmsg.EPO0051)
						});
					}
					if (rowDto.optStDate > rowDto.optOrdStopDate){
						f_error = true;
						cellMessages.push({
							rowId: rowId,
							colId: 'optOrdStopDate',
							level: 'error',
							message: clutil.fmtargs(clmsg.EPO0053)
						});

					}
					if(upflag != 0){
						if (clutil.addDate(clcom.getOpeDate(), 1) > rowDto.optOrdStopDate){
							f_error = true;
							cellMessages.push({
								rowId: rowId,
								colId: 'optOrdStopDate',
								level: 'error',
								message: clutil.fmtargs(clmsg.EPO0050)
							});
						}
					}
				}

			}
			if(!_.isEmpty(cellMessages)){
				$grid.setCellMessage(cellMessages);
			}
			return f_error;

		},
		_buildGetReqFunction: function(opeTypeId, pgIndex){
			console.log('_buildGetReqFunction: opeTypeId[' + opeTypeId + '] pgIndex[' + pgIndex + ']');

			var getReq = {
					// 共通ヘッダ

					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					// 取引先マスタ検索リクエスト
					AMPOV0210GetReq: {
						srchDate: this.options.chkData[pgIndex].stDate,			// 適用開始日
						srchID: this.options.chkData[pgIndex].id,			// 取引先ID
						delFlag : this.options.chkData[pgIndex].delFlag
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMPOV0210UpdReq: {
					}
			};
			if(opeTypeId ==  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY){
				getReq.reqHead.opeTypeId =  am_proto_defs.AM_PROTO_COMMON_RTYPE_COPY;
			}
			return {
				resId: clcom.pageId,	//'AMMSV0320',
				data: getReq
			};
		},

		/**
		 * 空更新比較用のデータ生成
		 */
		_buildSubmitCheckFunction: function(arg){
//			var curIndex = arg.index;	// 複数レコード選択編集時におけるINDEX
//			var resId = arg.resId;		// リソースId - "XXXXV0010"などの文字列
			var data = arg.data;		// GET応答データ

			// 比較対象外のデータをdeleteして返す
//			var rec = data.AMPOV0210GetRsp;
//			delete rec.orgfunc.stDate;
//			delete rec.orgfunc.edDate;
//			$.each(rec.orglevelList, function(){
//			delete this.stDate;
//			delete this.edDate;
//			delete this.orglevelCode;
//			});
			return data;
		}
	});

	// 初期データを取る
	clutil.getIniJSON(null, null).done(function(data, dataType) {
		ca_editView = new EditView(clcom.pageArgs).initUIelement().render();
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
