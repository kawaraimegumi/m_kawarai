function ch_width(){
	// 横スクロールが存在した場合もヘッダーは必ず右上に配置する様に修正 2014/04/02
	w = $(window).width();
	sl = $(window).scrollLeft();
	cs = w+sl;
	mw = $('#mainColumninBox').width();
	// ノーサインのサブ画面は左を計算しない
	lw = $(".cl_cu_submain").css('display') == 'block' ? 0 : $('#leftColumn').width();
//	cs = mw+lw;
	$('#header').css("width",cs+'px');
	// ノーサインのフッターは除く
	$('#mainColumnFooter').not(".cl_cu_mainColumnFooter").css("width",mw+'px');
	$('#mainColumnFooter p a').css("width",'100%');
	$('.conditionFooter').css("width",lw+'px');
}

function ch_height(first_flg){
	mh = $('#mainColumn').height();
	mbh = $('#mainColumninBox').height();
	leh = mh > mbh ? mh : mbh;
	leh = leh + 60;
	hh = $('#header').height();
	// Chrome対応、右ウィンドウをスクロールすると白くなってしまう対応
	wh = $(window).height() - hh;

	lh = $('#leftColumnInBox').height();

	$('body').css("height",wh+'px');

	// ノーサイン用
	$('#leftColumn').css("height",leh+'px');
	// 分析用 $(window).scrollTop()を追加
	// chromeで条件部分のフッターが隠れてしまう対応
	wh_an = wh + $(window).scrollTop();
	$('#leftColumn.analytics').css("height",wh_an+'px');

	$('#mainColumn').css("height",wh+'px');

	$('#container').css("height",wh+'px');
}

function setReSizeEvent(){
	$(window).resize(function(){
		ch_width();
	});
	$(document).scroll(function(){
		ch_width();
		sl = $(window).scrollLeft();
		// ノーサインのサブ画面は左を計算しない
		lw = $(".cl_cu_submain").css('display') == 'block' ? 0 : $('#leftColumn').width();
		// ノーサインのサブ画面フッターは除く
		$('#mainColumnFooter').not('.cl_cu_submainColumnFooter').css("left",lw-sl+'px');
		$('.conditionFooter').css("left",'-'+sl+'px');
	});
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
	$('.rightBox').css("margin-left",h_rightbox+'px');

	/* header footer 固定 : tori@20131210 */
	//conditionFooterがある場合適用
	if(0 < $(".conditionFooter").size()){
		setReSizeEvent();
	}
	/* header footer 固定 end */

	//画面サイズを#containerの高さに
	ch_height(true);

	$(window).resize(function(){
		//ヘッダー位置
		ch_height();

		// ヘッダーがずれてしまうため一度0pxにする
		$('.rightBox').css("margin-left",'0px');

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
		$('.rightBox').css("margin-left",h_rightbox+'px');
	});
	$(window).scroll(function(){
		ch_height();
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
			$('.rightBox').css("margin-left",h_rightbox+'px');
		}else{
			$('#header h1').css("padding-left",sl+'px');
			$('.rightBox').css("margin-left",h_rightbox+'px');
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
	$(function(){
		var overcells = $("table.hilight td"),
			hoverClass = "hover",
			current_r,
			current_c;
		overcells.hover(
			function(){
				var $this = $(this);
				(current_r = $this.parent().children("table td")).addClass(hoverClass);
				(current_c = overcells.filter(":nth-child("+ (current_r.index($this)+1) +")")).addClass(hoverClass);
			},
			function(){
			current_r.removeClass(hoverClass);
			current_c.removeClass(hoverClass);
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
				var $this = $(this);
				(current_r = $this.parent().children("table td")).addClass(hoverClass);
			},
			function(){
			current_r.removeClass(hoverClass);
			}
		);
	});

	//チェックされた行をハイライト
	$('table td .checkbox').click(function(){
		$(this).parent().parent().toggleClass('checked');
	});


	//ガイダンスの表示
	$('#guidanceBtn').click(function(){
		$('#guidanceBox').toggle();
	});

	/* tori@20131001 start */

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

});