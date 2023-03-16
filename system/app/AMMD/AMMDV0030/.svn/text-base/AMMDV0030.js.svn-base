$(function() {

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
		
		
		initialize: function(){
			_.bindAll(this);

			// 共通ビュー(共通のヘッダなど内包）
			this.mdBaseView = new clutil.View.MDBaseView({
				opeTypeId:		-1,
				title: 'マークダウン依頼',
				subtitle: '状況確認',
				btn_new: false,
				btn_submit: true
			});

			this.validator = clutil.validator($("#ca_searchArea"), {
				echoback : $('.cl_echoback')
			});
		},

		// 初期データ取得後に呼ばれる関数
		initUIElement: function(){
			this.mdBaseView.initUIElement();
			
			// カレンダー
			clutil.datepicker(this.$('#ca_releaseDate'));
			clutil.datepicker(this.$('#ca_limitDate'));
			clutil.datepicker(this.$('#ca_alarmDate'));
			
			clutil.viewReadonly($('#ca_srchArea'));
			
			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.mdBaseView.render();
			return this;
		},
		
		
		/**
		 * 行押下
		 */
		_onTrClick: function(e){
			// クリックされた行のIDを取得する
			var _tr = $(e.target).closest("tr");

			//押下行の組織idを取得
			var org_id = _tr.get(0).id;
			//押下行の組織階層を取得
			var org_lvl = $("#" + org_id).attr('org_lvl');
			
			var sel_org = "";	//開閉したいクラス名初期化
			var disp_name = "";	//非表示にするためのクラス名初期化
			
			if(org_lvl == clutil.getclsysparam('PAR_AMMS_ZONE_LEVELID')){
				//ゾーンの場合
				sel_org = ".ca_zone_" + org_id;
				disp_name = "dispn_zone";
			}
			else if(org_lvl == clutil.getclsysparam('PAR_AMMS_AREA_LEVELID')){
				//エリアの場合
				sel_org = ".ca_area_" + org_id;
				disp_name = "dispn_area";
			}
			
			if($(("#" + org_id)).hasClass('ca_open')){
				//閉じる
				$("#" + org_id).removeClass('ca_open');
				$(sel_org).addClass(disp_name);
			}
			else {
				//開く
				$("#" + org_id).addClass('ca_open');
				$(sel_org).removeClass(disp_name);
			}
			
			//エキスパンダマークの表示切替
			$(_tr).find("td span").toggleClass('treeOpen');
			$(_tr).find("td span").toggleClass('treeClose');
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
		


		/**
		 * 初期表示通信
		 */
		getTree: function(args){
			var id = args[0].id;
			var getReq = {
					// 共通ヘッダ
					reqHead: {
						opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
					},
					// 共通ページヘッダ		・・・これ、必要なの？					【確認】
					reqPage: {
					},
					// 取引先マスタ検索リクエスト
					AMMDV0030GetReq: {
						srchID: id				// 指示ID
					},
					// 取引先マスタ更新リクエスト -- 今は検索するので、空を設定
					AMMDV0030UpdReq: {
					}
			};

			var defer = clutil.postJSON('AMMDV0030', getReq).done(_.bind(function(data){
				var recsList = data.AMMDV0030GetRsp.instructOrgList;
				//input内項目設定
				var recsData = data.AMMDV0030GetRsp.instructInfo;
				clutil.data2view($("#ca_srchArea"),recsData);
				
				
				var toDay = clcom.getOpeDate();
				var releaseDay = recsData.releaseDate;
				
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
				if(recs[i].orglvl == clutil.getclsysparam('PAR_AMMS_ZONE_LEVELID')){
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
				else if(recs[i].orglvl == clutil.getclsysparam('PAR_AMMS_AREA_LEVELID')){
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

			source += "<tr id=" + "'" + data.orgID + "'" + "org_lvl=" + "'" + data.orglvl + "'";

			if(data.orglvl == clutil.getclsysparam('PAR_AMMS_ZONE_LEVELID')){
				//ゾーンの場合
				source += "class='csptr ca_zone" + " " + data.c_flag + "'>";
				source += "<td colspan='3'><span class='treeOpen ca_expand'></span>" + data.orgcode + ":" + data.orgname + "</td>";
			}
			else if(data.orglvl == clutil.getclsysparam('PAR_AMMS_AREA_LEVELID')){
				//エリアの場合
				source += "class='csptr dispn_zone ca_area ca_zone_"+ data.zoneID + " " + data.c_flag + "'>";
				source += "<td width='140px' class='" + data.c_z_indent + "'></td>";
				source += "<td colspan='2'><span class='treeOpen ca_expand'></span>" + data.orgcode + ":" + data.orgname + "</td>";
			}
			else{
				//店舗の場合
				source += "class='dispn_area ca_store ca_zone_" + data.zoneID + " ca_area_" + data.areaID + " " + data.c_flag + "'>";
				source += "<td width='140px' class='" + data.c_z_indent + "'></td>";
				source += "<td width='140px' class='" + data.c_a_indent + "'></td>";
				source += "<td>" + data.orgcode + ":" + data.orgname + "</td>";
			}

			//状況フラグ区分
			if(data.f_set == 2){
				//未実施の場合は文字色を赤くする
				source += "<td class='errorCell'>未実施</td>";
			}
			else{
				source += "<td>実施済</td>";
			}

			if(data.orglvl != clutil.getclsysparam('PAR_AMMS_STORE_LEVELID') && data.orglvl != null){
				//ゾーン、エリアの場合は実施数を表示
				source += "<td class='txtar'>" + data.done_store + "/" + data.set_store + "</td>";
			}
			else{
				source += "<td></td>";
			}
			
			if((data.done_day != 0) && (data.done_time != 0)){
				//実施日時表示
				source += "<td>" + clutil.dateFormat(data.done_date, 'yyyy/mm/dd(w)');
				source += "　" + clutil.timeFormat(data.done_time, 'hh:mm') + "</td></tr>";
			}
			else{
				source += "<td></td></tr>";
			}
			

			return source;
		},
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