useSelectpicker2();

$(function(){

	// Enterキーによるフォーカスをする。
	clutil.enterFocusMode($('body'));

	//////////////////////////////////////////////
	// View
	var MainView = Backbone.View.extend({
		el:	$('#ca_main'),

		events: {
			'click .expandAll'			: '_onExpandAllClick',	// すべて開く押下
			'click .unexpandAll'		: '_onUnExpandAllClick',	// すべて閉じる押下
			'click tr'					: '_onTrClick'			// 行押下時の開閉
		},

		_onTrClick: function(e){
			// クリックされた行のIDを取得する
			var _tr = $(e.target).closest("tr");

			//押下行の組織idを取得
			var org_id = _tr.get(0).id;
			//押下行の組織階層を取得
			var org_lvl = $("#" + org_id).attr('org_lvl');

			var sel_org = "";	//開閉したいクラス名初期化
			var disp_name = "";	//非表示にするためのクラス名初期化

			if(org_lvl == "0"){
//			if(org_lvl == clutil.getclsysparam('PAR_AMMS_ZONE_LEVELID')){
				//ゾーンの場合
				sel_org = ".ca_zone_" + org_id;
				disp_name = "dispn_zone";
			}
			else if(org_lvl == "1"){
//			else if(org_lvl == clutil.getclsysparam('PAR_AMMS_AREA_LEVELID')){
				//エリアの場合
				sel_org = ".ca_area_" + org_id;
				disp_name = "dispn_area";
			}

			if($(("#" + org_id)).hasClass('ca_open')){
				if($(_tr).find("td span").hasClass('treeClose')){
					//閉じる
					$("#" + org_id).removeClass('ca_open');
					$(sel_org).addClass(disp_name);
					//エキスパンダマークの表示切替
					$(_tr).find("td span").toggleClass('treeOpen');
					$(_tr).find("td span").toggleClass('treeClose');
				} else {
					//エキスパンダマークの表示切替
					$(_tr).find("td span").toggleClass('treeOpen');
					$(_tr).find("td span").toggleClass('treeClose');
				}
			}
			else {
				if($(_tr).find("td span").hasClass('treeOpen')){
					//開く
					$("#" + org_id).addClass('ca_open');
					$(sel_org).removeClass(disp_name);
					//エキスパンダマークの表示切替
					$(_tr).find("td span").toggleClass('treeOpen');
					$(_tr).find("td span").toggleClass('treeClose');
				} else {
					//エキスパンダマークの表示切替
					$(_tr).find("td span").toggleClass('treeOpen');
					$(_tr).find("td span").toggleClass('treeClose');
				}
			}

			//エキスパンダマークの表示切替
//			$(_tr).find("td span").toggleClass('treeOpen');
//			$(_tr).find("td span").toggleClass('treeClose');
		},

		/**
		 * すべて開く押下
		 */
		_onExpandAllClick: function(){
			//全部開く

			//[すべて閉じる]->[すべて開く]へ変更
			$(".expandAll").addClass('dispn');
			$(".unexpandAll").removeClass('dispn');

			//すべての非表示をはずす
			$('.ca_area').removeClass('dispn_zone');
			$('.ca_store').removeClass('dispn_zone');
			$('.ca_store').removeClass('dispn_area');

			//開いてるクラスを入れ替え
			$(".ca_zone").addClass('ca_open');
			$(".ca_area").addClass('ca_open');

			//エキスパンダ修正
			$(".ca_expand").addClass('treeClose');
			$(".ca_expand").removeClass('treeOpen');
		},

		/**
		 * すべて閉じる押下
		 */
		_onUnExpandAllClick: function(){
			//全部閉じる

			//[すべて開く]->[すべて閉じる]へ変更
			$(".unexpandAll").addClass('dispn');
			$(".expandAll").removeClass('dispn');

			//すべての非表示を付与
			$('.ca_area').addClass('dispn_zone');
			$('.ca_store').addClass('dispn_zone');
			$('.ca_store').addClass('dispn_area');

			//開いてるクラスを入れ替え
			$(".ca_zone").removeClass('ca_open');
			$(".ca_area").removeClass('ca_open');

			//エキスパンダ修正
			$(".ca_expand").addClass('treeOpen');
			$(".ca_expand").removeClass('treeClose');
		},

		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: '返品依頼',
				subtitle: '状況確認',
				btn_new: false,
				btn_submit: true,
				btn_csv: true
			});

			this.validator = clutil.validator($("#ca_srchArea"), {
				echoback : $('.cl_echoback')
			});

			// OPE系イベント
//			'click div#title p.addNew>a'	: '_onNewClick',			// 新規押下
//			'click #ca_edit'				: '_onEditClick',			// 編集ボタン押下
//			'click #ca_delete'				: '_onDeleteClick',			// 削除ボタン押下
//			'click #ca_rsvcancel'			: '_onReserveCancelClick'	// 予約取消ボタン押下
			clutil.mediator.on('onOperation', this._jumpPage);
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			return this;
		},
		/**
		 * 画面描画
		 */
		render: function(){
			this.mdBaseView.render();
			return this;
		},
		/**
		 * 初期表示通信
		 */
		getTree: function(args){;
			var id = args[0].returnID;
			var getReq = {
					// 共通ヘッダ
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					// 取引先マスタ検索リクエスト
					AMDLV0130GetReq: {
						srchReturnID: id,				// 返品依頼ID
						srchUnitID: (clcom.userInfo && clcom.userInfo.unit_id) ? clcom.userInfo.unit_id : 0, // 事業ユニットID
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMDLV0130UpdReq: {
					}
			};

			var defer = clutil.postJSON('AMDLV0130', getReq).done(_.bind(function(data){
				//この辺確認したほうがよさげ
				var getRsp = data.AMDLV0130GetRsp;
				var recsList = data.AMDLV0130GetRsp.slipList;
				//input内項目設定
				this.$('#ca_retCode').val(getRsp.retCode);
				this.$('#ca_releaseDate').val(clutil.dateFormat(getRsp.releaseDate,"yyyy/mm/dd(w)"));
				this.$('#ca_limitDate').val(clutil.dateFormat(getRsp.limitDate,"yyyy/mm/dd(w)"));
				
				
				var toDay = clcom.getOpeDate();
				var releaseDay = getRsp.releaseDate;
				
				if(toDay < releaseDay){
					//店舗出力日より前ならエラー
					clutil.mediator.trigger('onTicker', clmsg.EGM0049);
					return;
				}
				

				if(_.isEmpty(recsList)){
					// ヘッダにエラーメッセージを表示
					clutil.mediator.trigger('onTicker', clmsg.EGM0049);
					return;
				}
				else {
					var source = this.maketree(recsList);

					//ソース読ませる
					this.$('#ca_tree').html('');
					this.$('#ca_tree').html(source);
					clutil.initUIelement(this.$('.ca_tbl'));
				}
			}, this)).fail(_.bind(function(data){
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
			}, this));

			return defer;
		},


		/**
		 * ツリーのソース生成
		 */
		maketree: function(recs){
			//行配列の長さをとる
			var rec_num = recs.length;
			var i = 0;
			
			var z_flag = false;		//ゾーンのしましまフラグ
			var a_flag = false;		//エリアのしましまフラグ
			var s_flag = false;		//店舗のしましまフラグ
			
			var a_head = true;		//エリア1行目フラグ
			var s_head = true;		//店舗1行目フラグ

			var source = "";

			for(i = 0; i < rec_num; i++){
//				var line = this.makeLine(recs[i]);
//				source = source + line;
				
				if(recs[i].orglvl == 0){
					//ゾーンの場合
					a_head = true;
					if(z_flag == false){
						z_flag = true;		//白
						recs[i].c_flag = "ca_white";
					}
					else{
						z_flag = false;		//灰
						recs[i].c_flag = "ca_gray";
					}
				}
				else if(recs[i].orglvl == 1){
					//エリアの場合
					s_head = true;
					if(a_head == true){
						//先頭行の場合
						a_head = false;
						if(z_flag == false){
							a_flag = true;
							recs[i].c_flag = "ca_white";	//所属ゾーン行が灰なら白
						}
						else{
							a_flag = false;
							recs[i].c_flag = "ca_gray";		//所属ゾーン行が白なら灰
						}
					}
					else{
						if(a_flag == false){
							a_flag = true;
							recs[i].c_flag = "ca_white";
						}
						else{
							a_flag = false;
							recs[i].c_flag = "ca_gray";
						}
					}
					
					//インデント設定
					if(z_flag == false){
						recs[i].c_z_indent = "ca_indent_gray"; //所属ゾーン行が灰なら灰
					}
					else{
						recs[i].c_z_indent = "ca_indent_white"; //所属ゾーン行が灰なら灰
					}
				}
				else{
					//店舗の場合
					if(s_head == true){
						//先頭行の場合
						s_head = false;
						if(a_flag == false){
							s_flag = true;
							recs[i].c_flag = "ca_white";	//所属エリア行が灰なら白
						}
						else{
							s_flag = false;
							recs[i].c_flag = "ca_gray";		//所属エリア行が白なら灰
						}
					}
					else{
						if(s_flag == false){
							s_flag = true;
							recs[i].c_flag = "ca_white";
						}
						else{
							s_flag = false;
							recs[i].c_flag = "ca_gray";
						}
					}
					
					
					//ゾーン部インデント設定
					if(z_flag == false){
						recs[i].c_z_indent = "ca_indent_gray"; //所属ゾーン行が灰なら灰
					}
					else{
						recs[i].c_z_indent = "ca_indent_white"; //所属ゾーン行が灰なら灰
					}
					
					//エリア部インデント設定
					if(a_flag == false){
						recs[i].c_a_indent = "ca_indent_gray"; //所属エリア行が灰なら灰
					}
					else{
						recs[i].c_a_indent = "ca_indent_white"; //所属エリア行が灰なら灰
					}
				}
				var line = this.makeLine(recs[i]);
				source = source + line;
			}

			return source;
		},

		/**
		 * 各行作成
		 */
		makeLine: function(data){
			var source = "";

//			source += "<tr id=" + "'" + data.orgID + "'" + "org_lvl=" + "'" + data.orglvl + "'";

			if(data.orglvl == 0){
				//ゾーンの場合
				source += "<tr id=" + "'" + data.zoneID + "'" + "org_lvl=" + "'" + data.orglvl + "'";
				source += "class='ca_zone" + " " + data.c_flag + "'>";
				source += "<td colspan='3'><span class='treeOpen ca_expand'></span>" + data.zonecode + ":" + data.zonename + "</td>";
			}
			else if(data.orglvl == 1){
				//エリアの場合
				source += "<tr id=" + "'" + data.areaID + "'" + "org_lvl=" + "'" + data.orglvl + "'";
				source += "class='dispn_zone ca_area ca_zone_"+ data.zoneID + " " + data.c_flag + "'>";
				source += "<td width='140px' class='" + data.c_z_indent + "'></td>";
				source += "<td colspan='2'><span class='treeOpen ca_expand'></span>" + data.areacode + ":" + data.areaname + "</td>";
			}
			else{
				//店舗の場合
				source += "<tr id=" + "'" + data.orgID + "'" + "org_lvl=" + "'" + data.orglvl + "'";
				source += "class='dispn_area ca_store ca_zone_" + data.zoneID + " ca_area_" + data.areaID + " " + data.c_flag + "'>";
				source += "<td width='140px' class='" + data.c_z_indent + "'></td>";
				source += "<td width='140px' class='" + data.c_a_indent + "'></td>";
				source += "<td>" + data.orgcode + ":" + data.orgname + "</td>";
			}

			//状況フラグ区分
			if(data.operStatus == 2){
				//未実施の場合は文字色を赤くする
				source += "<td class='errorCell'>未実施</td>";
			}
			else{
				source += "<td>実施済</td>";
			}


			if(data.orglvl != 2 && data.orglvl != null){
				//ゾーン、エリアの場合は実施数を表示
				source += "<td class='txtar'>" + data.doneStore + "/" + data.setStore + "</td>";
				source += "<td></td>";
				source += "<td></td>";
			}
			else{
				source += "<td></td>";
				//ゾーン、エリアの場合は実施数を表示
				source += "<td class='txtar'>" + data.reqeustQy + "</td>";
				//ゾーン、エリアの場合は実施数を表示
				source += "<td class='txtar'>" + data.returnQy + "</td>";
			}

			source += "</tr>";

			return source;
		},

		/**
		 * ダウンロードする
		 */
		doDownload: function(){
			// リクエストをつくる
			var id = clcom.pageArgs.chkData[0].returnID;
			var getReq = {
					// 共通ヘッダ
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					// 取引先マスタ検索リクエスト
					AMDLV0130GetReq: {
						srchReturnID: id,				// 返品依頼ID
						srchUnitID: (clcom.userInfo && clcom.userInfo.unit_id) ? clcom.userInfo.unit_id : 0, // 事業ユニットID
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMDLV0130UpdReq: {
					}
			};

			// 要求を送出
			// clutil.postDLJSON() を使うと共通ヘッダを補完してくれる。
			var defer = clutil.postDLJSON('AMDLV0130', getReq);
			defer.fail(_.bind(function(data){

				// ヘッダーにメッセージを clutil.View.MDBaseView へ通知
				// AJAX 呼び出しの共通処理で済ませるべきか・・・
				clutil.mediator.trigger('onTicker', data);
			}, this));
		},

		/**
		 * 編集画面への遷移
		 */
		_jumpPage: function(rtyp, args, e){
//			var myData, destData;
//			if(this.savedReq){
//				// 検索結果がある場合
//				myData = {
//					savedReq: this.savedReq,
//					savedCond: this.savedReq.AMDLV0130GetReq,
//					selectedIds: this.recListView.getSelectedIdList()
//				};
//				destData = {
//					opeTypeId: rtyp,
//					chkData: this.recListView.getSelectedRecs()
//				};
//			}else{
//				// 検索結果が無い場合
//				myData = {
//					savedReq: null,
//					savedCond: this.srchCondView.serialize(),
//					selectedIds: []
//				};
//				destData = {
//					opeTypeId: rtyp
//				};
//			}

			// ope_btn 系
			switch(rtyp){
			case am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV:	// CSV 出力
				this.doDownload();
				break;
			default:
				console.warn('unsupported rtyp[' + rtyp + '] received.');
				return;
			}
		},

		_eof: 'AMDLV0130.MainView//'
	});

	//--------------------------------------------------------------
	// 初期データ取得
	clutil.getIniJSON(null).done(function(data){
		// ここで、clcom の内容が保証される /////////////////
		mainView = new MainView().initUIElement().render();

		if(clcom.pageArgs != null && args != ""){
			var args = clcom.pageArgs.chkData;
			//ツリーテーブル作成
			mainView.getTree(args);
		}


//		if(clcom.pageData){
//			// 保存パラメタがある場合
//			// ・新規、編集、削除画面から戻ってきて、再検索するときのケース
//			mainView.load(clcom.pageData);
//		}
	}).fail(function(data){
		console.error('iniJSON failed.');
		console.log(arguments);

		// clcom のネタ取得に失敗。
		// 動かしようがないので、Abort 扱いとしておく？？？
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead
		});
	});

});