function ch_width(){
	mw = $('#mainColumninBox').width();
	lw = $('#leftColumn').width();
	cs = mw+lw;
	$('#header').css("width",cs+'px');
	$('#mainColumnFooter').css("width",mw+'px');
	$('#mainColumnFooter p a').css("width",'100%');
	$('.conditionFooter').css("width",lw+'px');
}

function ch_height(first_flg){
	hh = $('#header').height();
		wh = $(window).height() - hh;

	lh = $('#leftColumnInBox').height();

	$('body').css("height",wh+'px');
	$('#leftColumn').css("height",wh+'px');
	$('#mainColumn').css("height",wh+'px');

	$('#container').css("height",wh+'px');
}

$(function(){



	sl = $(window).scrollLeft();
	ww = $(window).width();
	rbw = $(".rightBox").width()*1.25;
	hw = $("#header h1").width();
	if(0 < $("#header p").size()){
		pw = $("#header p").width();
		h_rightbox = ww-rbw-hw-pw;
		$('#header p').css("margin-left",sl+'px');
	}else{
		h_rightbox = ww-rbw-hw;
		$('#header h1').css("padding-left",sl+'px');
	}
/* header .rightBox の margin-left  の設定をやめておく: kaeri@suri 20140612 */
//rightBox コンテンツを圧迫するので margin-left の設定を外した
//	$('.rightBox').css("margin-left",h_rightbox+'px');

	/* header footer 固定 : tori@20131210 */
	//conditionFooterがある場合適用
	if(0 < $(".conditionFooter").size()){
		$(window).resize(function(){
			ch_width();
		});
		$(document).scroll(function(){
			ch_width();
			sl = $(window).scrollLeft();
			lw = $('#leftColumn').width();
			$('#mainColumnFooter').css("left",lw-sl+'px');
			$('.conditionFooter').css("left",'-'+sl+'px');
		});
	}
	/* header footer 固定 end */

	//画面サイズを#containerの高さに
	ch_height(true);

	$(window).resize(function(){
		//ヘッダー位置
		ch_height();

		sl = $(window).scrollLeft();
		ww = $(window).width();
		rbw = $(".rightBox").width()*1.25;
		hw = $("#header h1").width();
		if(0 < $("#header p").size()){
			pw = $("#header p").width();
			h_rightbox = ww-rbw-hw-pw;
			$('#header p').css("margin-left",sl+'px');
		}else{
			h_rightbox = ww-rbw-hw;
			$('#header h1').css("padding-left",sl+'px');
		}
/* header .rightBox の margin-left  の設定をやめておく: kaeri@suri 20140612 */
//rightBox コンテンツを圧迫するので margin-left の設定を外した
//		$('.rightBox').css("margin-left",h_rightbox+'px');

	});
	var offset = $( "#scrlelm" ).offset();
	$(window).scroll(function(){
		/* header出したり @tori 2013/3/26 */
		if(offset){
			st = $(window).scrollTop();
			if(offset.top > st){
				$("#masterHeaditem").hide();
			}else{
				$("#masterHeaditem").fadeIn();
			}
		}

		//ヘッダー位置
		sl = $(window).scrollLeft();
		ww = $(window).width();
		rbw = $(".rightBox").width()*1.25;
		hw = $("#header h1").width();
		if(0 < $("#header p").size()){
			pw = $("#header p").width();
			h_rightbox = ww-rbw-hw-pw;
		}else{
			h_rightbox = ww-rbw-hw;
		}
		mw = $('div#content').width();
		lw = $('#leftColumn').width();
		cs = mw+lw;
		wc = cs - ww + 40;//誤差修正
		if(wc < 0){
			wc = 0;
		}
		//ブラウザビヨーン対策
		if(wc < sl && sl > 0){
			h_rightbox = h_rightbox - sl + wc;
		}
		if(0 < $("#header p").size()){
			$('#header p').css("margin-left",sl+'px');
/* header .rightBox の margin-left  の設定をやめておく: kaeri@suri 20140612 */
//rightBox コンテンツを圧迫するので margin-left の設定を外した
//			$('.rightBox').css("margin-left",h_rightbox+'px');
		}else{
			$('#header h1').css("padding-left",sl+'px');
/* header .rightBox の margin-left  の設定をやめておく: kaeri@suri 20140612 */
//rightBox コンテンツを圧迫するので margin-left の設定を外した
//			$('.rightBox').css("margin-left",h_rightbox+'px');
		}

	});
	//inputにfocus時、疑似要素を削除
	$('.required input[type=text]').focusin(function(){
		$(this).parent('.fieldBox').removeClass('required');
	});
	$('.required input[type=text]').focusout(function(){
		$(this).parent('.fieldBox').addClass('required');
	});

	//セルの位置をハイライト 行、列、セル
	var mdss_flg = 0;

	$(function(){
		var overcells = $("table.hilight td"),
				hoverClass = "hover",
				current_r,
				current_c;
		overcells.hover(
			function(){
				if(mdss_flg != 1){
					var $this = $(this);
					(current_r = $this.parent().children("table td")).addClass(hoverClass);
					(current_c = overcells.filter(":nth-child("+ (current_r.index($this)+1) +")")).addClass(hoverClass);
				}
			},
			function(){
				if(mdss_flg != 1){
					current_r.removeClass(hoverClass);
					current_c.removeClass(hoverClass);
				}
			}
		);
	});

	//セルの位置をハイライト 行のみ
	$(function(){
		var overcells = $("table.hilightRow td"),
				hoverClass = "hover",
				current_r,
				current_c;
		overcells.hover(
			function(){
				if(mdss_flg != 1){
					var $this = $(this);
					(current_r = $this.parent().children("table td").not(".indent")).addClass(hoverClass);
				}
			},
			function(){
				if(mdss_flg != 1){
					current_r.removeClass(hoverClass);
				}
			}
		);
	});

	//SELECTBOX borer 追加 ： tori@20131008
	$('.fieldBox').click(function(){
		var drop_disp = $(this).find('.ms-drop').css('display');
		if(drop_disp == "none"){
			$(this).find('.ms-choice').removeClass( "forcus", 300, "easeOutSine" );
		}else if(drop_disp == "block"){
			$(this).find('.ms-choice').addClass( "forcus", 300, "easeOutSine" );
		}
	});
	$('.fieldBox').skOuterClick(function(){
		var drop_disp = $(this).find('.ms-drop').css('display');
		if(drop_disp == "none"){
			$(this).find('.ms-choice').removeClass( "forcus", 300, "easeOutSine" );
		}else if(drop_disp == "block"){
			$(this).find('.ms-choice').addClass( "forcus", 300, "easeOutSine" );
		}
	});

	//売上・数量で絞込 初回 ： tori@20131008
	$('button#mdss').click(function(){
		if(mdss_flg == 0){
			$('body,html').animate({scrollTop: $("#inmodejump").offset().top},
			{complete: function(){mdss_flg = 1;},duration:600});

			$(this).removeClass('btn-default');
			$('table').find('.bdrt').removeClass('deleteRow');
			$(this).addClass('btn-primary');
			$(this).addClass('inmode');
			$(this).text("終了して戻る");
			$('table').parents('#content').next().addClass('dispn');

			$('table').find('th').addClass('disable');
			$('table').find('td').addClass('disable');
			$('table').parents('#disable_field').find('.mbn').attr("disabled", "disabled");
			$('table').parents('#disable_field').find('.dropdown-toggle').attr("disabled", "disabled");
			cnt=0;
			th_currentNum = 2;
			$('table tr').each(function(i){
				if(i!=1){
					$('th',this).eq(2).removeClass('disable');
					$('td',this).eq(2).removeClass('disable');
					$('td',this).eq(3).removeClass('disable');
					if(cnt == 0){
						$('th',this).eq(th_currentNum).addClass('inmodeCell');
					}else{
						$('td',this).eq(2).addClass('inmodeCell');
						$('td',this).eq(3).addClass('inmodeCell');
					}
					if(cnt == 1){
						$('td',this).eq(2).children('.inmodeFieldBox').show();
					}
					cnt++;
				}
			});
		}else{
			//解除
			mdss_flg = 0;
			$(this).removeClass('btn-primary');
			$(this).addClass('btn-default');
			$(this).removeClass('inmode');
			$(this).text("売上数・在庫数で絞込");
			$('table').find('.bdrt').addClass('deleteRow');

			$('table').parents('#content').next().removeClass('dispn');

			$('table').find('th').removeClass('disable');
			$('table').find('td').removeClass('disable');
			$('table').removeClass('disable');
			$('table').find('.inmodeCell').removeClass('inmodeCell');
			$('table').find('.inmodeFieldBox').hide();
			$('table').parents('#disable_field').find('.mbn').removeAttr("disabled");
			$('table').parents('#disable_field').find('.dropdown-toggle').removeAttr("disabled");
		}
	});

	//売上・数量で絞込 hover ：tori@20131008
	$('table td , table .bdrt , table .total').hover(
		function(){
			if(mdss_flg == 1){
				//初期化
				$('table').find('th').addClass('disable');
				$('table').find('td').addClass('disable');
				$('table').find('.inmodeCell').removeClass('inmodeCell');
				$('table').find('.inmodeFieldBox').hide();

				var currentNum = $(this).index();
				if($(this).hasClass("bdrt")){
					currentNum = currentNum * 2 + 2;
				}
				if(currentNum > 1){
					//2カラムの場所用に計算
					if(currentNum % 2 == 1){
						currentNum1 = currentNum - 1;
						currentNum2 = currentNum;
					}else{
						currentNum1 = currentNum;
						currentNum2 = currentNum + 1;
					}
					if(currentNum1 == 2){
						th_currentNum = 2;
					}else{
						th_currentNum = currentNum1 / 2 - 1;
					}
					cnt=0;

					$('tr',$('table')).each(function(i){
						if(currentNum1 == 2){
							//一番左（合計）用
							if(i!=1){
								$('th',this).eq(th_currentNum).removeClass('disable');
								$('td',this).eq(currentNum1).removeClass('disable');
								$('td',this).eq(currentNum2).removeClass('disable');

								if(cnt == 0){
									$('th',this).eq(th_currentNum).addClass('inmodeCell');
								}else{
									$('td',this).eq(currentNum1).addClass('inmodeCell');
									$('td',this).eq(currentNum2).addClass('inmodeCell');
								}
								if(cnt == 1){
									$('td',this).eq(currentNum1).children('.inmodeFieldBox').show();
								}
								cnt++;
							}
						}else{
							if(i>0){
								$('th',this).eq(th_currentNum).removeClass('disable');
								$('td',this).eq(currentNum1).removeClass('disable');
								$('td',this).eq(currentNum2).removeClass('disable');
								if(cnt == 0){
									$('th',this).eq(th_currentNum).addClass('inmodeCell');
								}else{
									$('td',this).eq(currentNum1).addClass('inmodeCell');
									$('td',this).eq(currentNum2).addClass('inmodeCell');
								}
								if(cnt == 1){
									$('td',this).eq(currentNum1).children('.inmodeFieldBox').show();
								}
								cnt++;
							}
						}
					});
				}
			}
		}
	);


	//チェックされた行をハイライト
	$('table td .checkbox').click(function(){
		$(this).parent().parent().toggleClass('checked');
	});


	//ガイダンスの表示
	$('#guidanceBtn').click(function(){
		$('#guidanceBox').toggle();
	});

	/* tori@20131001 start */

	//階層カウント用変数
	var lv_cnt = 1;
	//次の階層へ
	//クリックされたaタグのid名を読み取る ← next_id
	//これを #sideNavi + next_id とすることで目的のsidenaviを呼び出せる
	$(".next_lv").click(function(){
		lv_cnt++;
		var leftColumn_ul_width = lv_cnt*140;
		//aタグid取得
		var next_id = $(this).attr("id");
		//ul幅変更
		$('#leftColumn_ul').css("width",leftColumn_ul_width+'px');
		//取得したIDを用いて次の階層を表示する
		$( '#sideNavi'+next_id ).toggleClass("dispn");
		//移動アニメーション（右方向）
		$('#leftColumn_ul').animate({'left': '-=140px'},{complete: function(){lv_height('#sideNavi'+next_id);},duration:300});


	});
	//前の階層へ
	//クリックされたaタグのid名を読み取る ← prev_id
	//これを #sideNavi + prev_id とすることで目的のsidenaviを呼び出せる
	$(".prev_lv").click(function(){
		lv_cnt--;
		var leftColumn_ul_width = lv_cnt*140;
		//aタグid取得
		var prev_id = $(this).attr("id");
		//移動アニメーション（左方向）
		$('#leftColumn_ul').animate({'left': '+=140px'},
			{duration: 300,
				complete: function(){
					//ul幅変更
					$('#leftColumn_ul').css("width",leftColumn_ul_width+'px');
					//取得したIDを用いて現在の階層を非表示にする
					$( '#sideNavi'+prev_id ).toggleClass("dispn");

					//ディスプレイ表示されている兄弟要素のIDを取得
					$( '#sideNavi'+prev_id ).prevAll("li").each(function(){
						if(!$(this).hasClass("dispn")){
							prev_id = $(this).attr("id");
						}
					});

					lv_height('#'+prev_id);
				}
			}
		);


	});
	//サイドナビ高さ取得
	function lv_height(id){
		var all_height = 0
		$( id ).find("li").each(function(){
			all_height += $(this).height();
		});
		var win_h = $(window).height();

		if(win_h > all_height){
			$( id ).parents("#leftColumnInBox").css("height",'100%');
		}else{
			$( id ).parents("#leftColumnInBox").css("height",all_height+'px');
		}
	}

	//レベル初期指定用
	 Lv = {
			lv_fixed : function (lv_cnt_fixed , next_id){
				lv_cnt = lv_cnt_fixed;
				var leftColumn_ul_width = lv_cnt*140;
				var leftColumn_ul_left = lv_cnt*140 - 140;

				//ul幅変更
				$('#leftColumn_ul').css("width",leftColumn_ul_width+'px');

				var prev_id = '#sideNavi'+next_id;
				for(i=lv_cnt_fixed;i>1;i--){
					if(i != 2 && i != lv_cnt_fixed){
						//この要素より前にこの要素をしている要素はないか検索
						prev_replace = prev_id.replace("#sideNavi", "");
						prev_id_find = $( prev_id ).prevAll().find('#'+prev_replace).parents(".sideNavi_ul").find('.prev_lv').attr("id");
						prev_id = "#sideNavi"+prev_id_find;

						$( prev_id ).toggleClass("dispn");
					}else if(i == lv_cnt_fixed){
						//取得したIDを用いて次の階層を表示する
						$( prev_id ).toggleClass("dispn");

						//この要素より前にこの要素をしている要素はないか検索
						prev_replace = prev_id.replace("#sideNavi", "");
						prev_id_find = $( prev_id ).prevAll().find('#'+prev_replace).parents(".sideNavi_ul").find('.prev_lv').attr("id");
						prev_id = "#sideNavi"+prev_id_find;

						$( prev_id ).toggleClass("dispn");
					}

				}
				lv_height('#sideNavi'+next_id);
				//移動アニメーション（右方向）
				$('#leftColumn_ul').css({'left': '-='+leftColumn_ul_left},300);
			}
		};
	/* tori@20131001 end */


	var before_href = [];
	//sideNaviチェックボックス
	$('.sideNavi .group .checkbox').click(function(){
		//.groupのID取得
		var parent_id = $(this).parent('.group').attr('id');
		//check判定
		if(!$(this).hasClass('checked')){
			for(var i = 0; i < $("."+parent_id).length; i++){
				before_href[parent_id+i] = $("."+parent_id).eq(i).children("a").attr("href");
				$("."+parent_id).eq(i).children("a").attr("href","#");
				$("."+parent_id).eq(i).children("a").toggleClass("disable");
			}
		}else{
			for(var i = 0; i < $("."+parent_id).length; i++){
				$("."+parent_id).eq(i).children("a").attr("href",before_href[parent_id+i]);
				$("."+parent_id).eq(i).children("a").toggleClass("disable");
			}
		}
	});


	//選択した内容の削除ボタン
	$('.btn-delete').mouseover(function(){
		$(this).parent('li').toggleClass('ovr');
	});
	$('.btn-delete').mouseout(function(){
		$(this).parent('li').toggleClass('ovr');
	});
	$('.btn-delete').mousedown(function(){
		$(this).parent('li').addClass('active');
	});
	$('.btn-delete').click(function(){
		$(this).parent('li').fadeOut(300);
	});
	$('.btn-delete').mouseover(function(){
		$(this).parent().parent('tr').toggleClass('ovr');
	});
	$('.btn-delete').mouseout(function(){
		$(this).parent().parent('tr').toggleClass('ovr');
	});
	$('.btn-delete').mousedown(function(){
		$(this).parent().parent('tr').not('.pending').addClass('active');
	});
	$('.btn-delete').click(function(){
		$(this).parent().parent('tr').not('.pending').fadeOut(300);
	});
	$('.btn-delete').click(function(){
		$(this).parent().parent('tr.pending').toggleClass('grayout');
		$(this).parent().parent('tr.pending').toggleClass('active');
	});



	/* tori@20131004 start */
	//追加ボタン押下時の処理 初回:firstshow 2回目以降:show
	//class"second"で初回かを判断
	var right_side_flg = true;
	$('#addtoSelected').click(function(){
		if($('#selected').hasClass("dispn")){
			if(!$('#selected').hasClass("second")){
				right_side.firstshow();
				$('#selected').toggleClass( "second");
			}else{
				right_side.show();
			}
		}
	});
	//追加ボタン押下時の処理 初回:firstshow 2回目以降:show
	$('#selected').skOuterClick(function() {
		if(right_side_flg){
			if(!$('#selected').hasClass("dispn")){
				right_side.hide();
			}
		}
	},$('#mainColumnFooter'));
	//右ウィンドウ出し入れ関数化
	right_side = {
		//初回右ウインドウ表示
		firstshow : function (){
			$("#addtoSelected").die("click");
			$('#selected').animate({'right': '-=240px'},
				{complete: function(){
						$( '#selected' ).toggleClass( "dispn");
						$('#selected').animate({'right': '+=240px'},{duration:200});
				},duration:1});
		},
		//2回目以降右ウインドウ表示
		//右ウインドウ範囲外と追加ボタン同時に押下された時対策として時差を持たせるために一旦10pxバックしている。
		show : function (){
			$("#addtoSelected").die("click");
			$('#selected').animate({'right': '-=10px'},
			{complete: function(){
				$( '#selected' ).toggleClass( "dispn");
				$('#selected').animate({'right': '+=250px'},{duration:200});
			},duration:1});
		},
		//右ウインドウ非表示
		hide : function (){
			$('#selected').animate({'right': '-=240px'},
			{complete: function(){
				$("#addtoSelected").live("click");
				if(!$('#selected').hasClass("second")){
					$( '#selected' ).toggleClass( "second");
				}
				$( '#selected' ).toggleClass( "dispn");
			},duration:200});
		},
		//右ウインドウ非表示
		flg_switch : function (flg){
			right_side_flg = flg;
		}
	};
	/* tori@20131004 end */

	/* tori@20140401 */
	$(".combobox")
		.focusin(function(){ $(".btn-group .btn.btn-input.dropdown-toggle").css("border","2px solid #1e9ce6"); })
		.focusout(function(){ $(".btn-group .btn.btn-input.dropdown-toggle").css("border",""); });

});

// マウスオーバーで画像拡大
$(function(){

		var thumbSize = 40;
		var magnifySize = 200;

		$(".magnify").each(function(){
			$(this).css({width:(thumbSize)});
		});

		var objWidth = $('.magnify').width();
		var objHeight = $('.magnify').height();

		$(".magnify").each(function(){
			$(this).wrapAll('<span class="magnify_cover"></span>');
			$(this).parent('.magnify_cover').css({
				width: (objWidth),
				height: (objHeight),
				float: 'left',
				position: 'relative'
			});
		});

		$(".magnify").hover(function(){
			$(this).css({bottom:'0',left:'0',position: 'absolute'});
			$(this).stop().animate({width:(magnifySize)},100);
		}, function(){
			$(this).stop().animate({width:(thumbSize)},300,function(){
				$(this).css({top:'',left:'',position: 'relative'});
				$(this).removeClass('shadow');
			});
		});

});
