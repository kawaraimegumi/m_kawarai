$(function(){

	// ポータル画面固有の保存データをストレージから取り出す。
	var myStoredKey = clcom.storagePrefix + 'AMCMV0030';
	var savedPageData = store.get(myStoredKey);

	// ポータル画面アクセス毎にストレージのキャッシュデータを
	// 更新しておきたいので、はじめにクリアしておく。
	// ※ ストレージキーが clcom.storagePrefix 系のものもここで消し飛ぶ。
	clcom.clearStorage();

	clutil.enterFocusMode($('body'));

	// 共通ヘッダの「＜」戻るボタンの行先ＵＲＬ。
	var BackBtnURL = false;//	'/index.html';

	/**
	 * ポータル画面データを取得するための Ajax 呼び出しメソッド。
	 */
	var postAMCMV0030JSON = function(){
		if(clcom.AMCMV0030data){
			// getIniJSON()で取得済みの場合はそれを利用する
			return $.Deferred().resolve(clcom.AMCMV0030data).promise();
		}
		var resId = 'AMCMV0030';
		// 2016/4/20 iPadフラグを設定(メニュー構築用)
		// 2016/11/26 iPod touchにも対応
		var isTablet = 0;
		if(clcom.is_iPad() || clcom.is_iPhone()){
			isTablet = 1;
		}
		var req = {
			reqHead: {
				opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_REL
			},
			AMCMV0030GetReq: {
				userID : clcom.userInfo.user_id,
				isTablet : isTablet
			}
		};
		return clutil.postJSON(resId, req);
	};

	/**
	 * 画面コードから当該画面URLを生成する
	 * @param code 画面コード
	 * @return 画面コードに対するURL
	 */
	var toPageURL = function(code){
		var url = clcom.appRoot;
		url += '/';
		url += code.substring(0,4);
		url += '/';
		url += code.substring(0,9);
		url += '/';
		url += code.substring(0,9);
		url += '.html';
		return url;
	};

	/**
	 * アラームview
	 */
	var AlarmView = Backbone.View.extend({
		el : $("#ca_alarmArea"),
		validator : null,
		events : {
//			"click p.sttl:first" : "_onTitleClick",
			"click p.viewall" : "_onTitleClick"
//			"click span.subject" : "_onTitleClick"// 内容クリックからも遷移
		},

		initialize : function(){
			var _this = this;
			_.bindAll(this);

			this.ALARM_LIMIT = clutil.getclsysparam("PAR_AMCM_PORTAL_ALARMS", 5);
			var now = clcom.getOpeDate();
			this.today = now;
			this.UNTIL_LIMIT = clutil.getclsysparam('PAR_AMCM_DAYS_UNTIL_LIMIT', 3);
			this.alartday = function(){
				var dt = new Date(Number(String(now).substring(0,4)), Number(String(now).substring(4,6)) - 1, Number(String(now).substring(6,8)));
				var baseSec = dt.getTime();
				var addSec = _this.UNTIL_LIMIT * 86400000;//日数 * 1日のミリ秒数
				var targetSec = baseSec + addSec;
				dt.setTime(targetSec);
				var y = dt.getFullYear();
				var m = ("0" + (dt.getMonth() + 1)).slice(-2);
				var d = ("0" + dt.getDate()).slice(-2);
				return Number("" + y + m + d);
			}();

			return this;
		},

		initUIelement : function(){
			// 2016/4/1 iPad用対応
			// 2016/11/25 iPod touch用対応
			if (clcom.is_iPad() || clcom.is_iPhone()) {
				this.iPad_view();
			}
			return this;
		},

		// 2016/4/1 iPad用対応
		iPad_view:function(){
			$(".ca_iPad_dispn").addClass("dispn");
		},

		/**
		 * 画面描画
		 */
		render: function(){
			return this;
		},

		data2view : function(data){
			var _this = this;
			var $tmpl = this.$("#ca_tmpl_alarm");
			var $ul = this.$("ul");
			var list = data.alarm;
			var renderList = [];
			if(list.length > this.ALARM_LIMIT){
				for (var i = 0; i < this.ALARM_LIMIT ; i++){
					renderList.push(list[i]);
				}
			} else {
				renderList = list;
			}
			$.each(renderList, function(){
				this.date_disp = clutil.dateFormat(this.limitDate, "yyyy/mm/dd");
				this.warning = this.limitDate < _this.alartday;
				this.danger = this.limitDate < _this.today;
				if(this.warning && this.danger){
					this.warning == false;
				}
				this.fNew = this.noticeDate >= _this.today;
			});
			$tmpl.tmpl(renderList).appendTo($ul);

			var html = "";
			if(data.numOfAlarm > 0){
				html += "<p class='sttl second num'>";
				html += data.numOfAlarm;
				html += "</p>";
				html += "<p class='sttl second tail'>";
				html += " 件あります。";
				html += "</p>";
			} else {
				html += "<p class='sttl second'>";
				html += " ";
				html += "</p>";
			};
			this.$(".sttl").after(html);
		},

		_onTitleClick : function(e){
			// 画面遷移引数
			var pushPageOpt = {
				url: toPageURL('AMCMV0110'),
				args: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
				},
				newWindow: true
			};
			clutil.mediator.trigger("onAMCMV0030MovePage", pushPageOpt);//, this.$el.attr('target'));
		},

		viewClear : function(){
			this.$("li").remove();
			this.$(".sttl.second").remove();
		}
	});

	/**
	 * 通知view
	 */
	var HHTNoticeView = Backbone.View.extend({
		el : $("#ca_hhtNoticeArea"),
		validator : null,
		events : {
//			"click p.sttl:first" : "_onTitleClick",
			"click p.viewall" : "_onTitleClick"
//			"click span.subject" : "_onTitleClick" // 内容クリックからも遷移
		},

		initialize : function(){
			_.bindAll(this);
			// シスパラ
			var now = clcom.getOpeDate();
			this.today = now;
			this.NOTICE_LIMIT = clutil.getclsysparam("PAR_AMCM_PORTAL_NOTICES", 5);
			return this;
		},

		initUIelement : function(){
			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			return this;
		},

		data2view : function(data){
			var _this = this;
			var $tmpl = this.$("#ca_tmpl_hhtnotice");
			var $ul = this.$("ul");
			var list = data.httNotice;
			var renderList = [];
			if (list == null) {
				list = [];
			}
			if(list.length > this.NOTICE_LIMIT){
				for (var i = 0; i < this.NOTICE_LIMIT ; i++){
					renderList.push(list[i]);
				}
			} else {
				renderList = list;
			}
			$.each(renderList, function(){
				this.date_disp = clutil.dateFormat(this.noticeDate, "yyyy/mm/dd");
				this.fNew = this.noticeDate >= _this.today;
			});
			$tmpl.tmpl(renderList).appendTo($ul);

			var html = "";
			if(data.numOfNewHttNotice > 0){
				html += "<p class='sttl txtar'>";
				html += " 新着";
				html += "</p>";
				html += "<p class='sttl second num'>";
				html += data.numOfNewHttNotice;
				html += "</p>";
				html += "<p class='sttl second tail'>";
				html += " 件あります。";
				html += "</p>";
			} else {
				html += "<p class='sttl second'>";
				html += " ";
				html += "</p>";
			};
			this.$(".sttl").after(html);
		},

		_onTitleClick : function(){
			// 画面遷移引数
			var pushPageOpt = {
				url: toPageURL('AMCMV0120'),
				args: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					clearFromNoticeDate: false,
					noticeKind: amcm_type.AMCM_VAL_NOTICE_KIND_HHT_NOTICE,
				},
				newWindow: true
			};
			clutil.mediator.trigger("onAMCMV0030MovePage", pushPageOpt);//, this.$el.attr('target'));
		},

		viewClear : function(){
			this.$("li").remove();
			this.$(".sttl.second").remove();
		},

		show: function() {
			this.$el.show();
		},

		hide: function() {
			this.$el.hide();
		}

	});

	/**
	 * 通知view
	 */
	var NoticeView = Backbone.View.extend({
		el : $("#ca_noticeArea"),
		validator : null,
		events : {
//			"click p.sttl:first" : "_onTitleClick",
			"click p.viewall" : "_onTitleClick"
//			"click span.subject" : "_onTitleClick" // 内容クリックからも遷移
		},

		initialize : function(){
			_.bindAll(this);
			// シスパラ
			var now = clcom.getOpeDate();
			this.today = now;
			this.NOTICE_LIMIT = clutil.getclsysparam("PAR_AMCM_PORTAL_NOTICES", 5);
			return this;
		},

		initUIelement : function(){
			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			return this;
		},

		data2view : function(data){
			var _this = this;
			var $tmpl = this.$("#ca_tmpl_notice");
			var $ul = this.$("ul");
			var list = data.notice;
			var renderList = [];
			if(list.length > this.NOTICE_LIMIT){
				for (var i = 0; i < this.NOTICE_LIMIT ; i++){
					renderList.push(list[i]);
				}
			} else {
				renderList = list;
			}
			$.each(renderList, function(){
				this.date_disp = clutil.dateFormat(this.noticeDate, "yyyy/mm/dd");
				this.fNew = this.noticeDate >= _this.today;
			});
			$tmpl.tmpl(renderList).appendTo($ul);

			var html = "";
			if(data.numOfNewNotice > 0){
				html += "<p class='sttl txtar'>";
				html += " 新着";
				html += "</p>";
				html += "<p class='sttl second num'>";
				html += data.numOfNewNotice;
				html += "</p>";
				html += "<p class='sttl second tail'>";
				html += " 件あります。";
				html += "</p>";
			} else {
				html += "<p class='sttl second'>";
				html += " ";
				html += "</p>";
			};
			this.$(".sttl").after(html);
		},

		_onTitleClick : function(){
			// 画面遷移引数
			var pushPageOpt = {
				url: toPageURL('AMCMV0120'),
				args: {
					opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
					clearFromNoticeDate: false,
					noticeKind: amcm_type.AMCM_VAL_NOTICE_KIND_NOT_HHT_NOTICE,
				},
				newWindow: true
			};
			clutil.mediator.trigger("onAMCMV0030MovePage", pushPageOpt);//, this.$el.attr('target'));
		},

		viewClear : function(){
			this.$("li").remove();
			this.$(".sttl.second").remove();
		}

	});

	/**
	 * クイックメニューview
	 */
	var QuickView = Backbone.View.extend({
		el : $("#ca_quickArea"),
		validator : null,
		events : {
//			"mouseover li" : "_onListOver",
//			"mouseout li" : "_onListOut",
			"click span.delQm" : "_onDelQmClick",
			"click a" : "_onMovePage"
		},

		initialize : function(){
			_.bindAll(this);
		},

		initUIelement : function(){
			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			return this;
		},

		data2view : function(data){
			var $tmpl = this.$("#ca_tmpl_quick");
			var $ul = this.$("ul");
			var renderList = data.quickMenuList;
			// quickmenuに対応するデータをサルベージ ややこしい
			$.each(renderList, function(){
				var menuNodeID = this.menuNodeID;
				var funcID = this.funcID;
				var func = {};
				$.each(data.viewList, function(){
					if(this.menuNodeID == menuNodeID
							|| this.viewID == funcID){
						func = this;
						func.funcID = func.viewID;
					};
					return _.isEmpty(func);
				});
				this.func = func;
				if (this.func != null && this.func.viewName != null) {
					$tmpl.tmpl(this).appendTo($ul);
					$ul.find("li:last").data("cl-rec", this.func);
				}
			});

			$ul.find("li").each(function(){
				$(this).tooltip({html: true});
//				$(this).hover(function(){
//					$(this).find(".delQm").removeClass("dispn");
//				},function(){
//					$(this).find(".delQm").addClass("dispn");
//				});
			});
		},

		addQm: function(data){
			var $tmpl = this.$("#ca_tmpl_quick");
			var $ul = this.$("ul");
			$tmpl.tmpl(data).appendTo($ul);
			$ul.find("li:last").data("cl-rec",data.func);
			$ul.find("li:last").tooltip({html: true});

//			$ul.find("li:last").hover(function(){
//				$(this).find(".delQm").removeClass("dispn");
//			},function(){
//				$(this).find(".delQm").addClass("dispn");
//			});
		},

		// 「削除」押下
		_onDelQmClick : function(e){
			var $span = $(e.target);
			var $li = $span.closest("li");
			var quickMenu = {
					userID : clcom.userInfo.user_id,
					funcID : $li.data("cl-rec").viewID
			};
			var req = {
					reqHead: {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
					},
					AMCMV0030UpdReq : {
						quickMenu : quickMenu
					}
			};
			var uri = "AMCMV0030";
			clutil.postJSON(uri, req).done(_.bind(function(data, dataType) {
				$li.remove();
			}, this)).fail(_.bind(function(data){
				console.log(data.rspHead);
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
				this.resetFocus();
			}, this));
		},

		_onMovePage : function(e){
			var $li = $(e.target).closest("li");
			var menuObj = $li.data("cl-rec");
			if(menuObj && menuObj.viewCode){
				var pushPageOpt = {
					url: toPageURL(menuObj.viewCode)
				};
				clutil.mediator.trigger("onAMCMV0030MovePage", pushPageOpt);//, this.$el.attr('target'));
			}
			return;
		},

		viewClear : function(){
			this.$("li").remove();
		}
	});

	/**
	 * メニュー(カテゴリー)view
	 */
	var MenuView = Backbone.View.extend({
		el : $("#ca_menuArea"),
		validator : null,
		events : {
			"click li.nodeLevel > p" : "_onNodeLevelClick",
//			"mouseover li.endLevel" : "_onEndLevelOver",
//			"mouseout li.endLevel" : "_onEndLevelOut",
			"click span.addQm" : "_onAddQmClick",
			"click a" : "_onMovePage"
		},

		initialize : function(){
			_.bindAll(this);
		},

		initUIelement : function(){
			return this;
		},

		/**
		 * 画面描画
		 */
		render: function(){
			return this;
		},

		/**
		 * サーバ応答データからViewが扱いやすいデータを構築
		 */
		buildModel: function(largeMenuGrpList, middleMenuGrpList, viewList, openedNodeIDSet){
			// 開いている menuNodeID マップ
			var openedSet = _.defaults(openedNodeIDSet || {}, {"0": true});

			var nodeIDMap = {};			// key:menuNodeID, val:menuNodeObj
			var childrenListMap = {};	// key:parentNodeID, val:[ menuNodeObj0,...]

			//childrenListMap[0] = [];
			for(var i = 0; i < Math.min(arguments.length, 3); i++){
				var list = arguments[i];
				for(var j = 0; j < list.length; j++){
					var item = list[j];

					// 装飾要素
					if(!this.isLeafNode(item)){
						item._isOpened = (openedSet[item.menuNodeID] === true);
					}

					// nodeIDMap へ追加
					if(nodeIDMap[item.menuNodeID]){
						console.warn('DupNode: ', nodeIDMap[item.menuNodeID], item);
					}else{
						nodeIDMap[item.menuNodeID] = item;
					}

					// childrenListMap へ追加
					var brothers = childrenListMap[item.parentMenuNodeID];
					if(brothers == null){
						brothers = [];
						childrenListMap[item.parentMenuNodeID] = brothers;
					}
					brothers.push(item);
				}
			}

			// childrenListMap 子リストを seqNo 順ソートする
			for(var nodeID in childrenListMap){
				var array = childrenListMap[nodeID];
				array.sort(function(a0, a1){
					var seq0 = _.isFinite(a0.seqNo) && a0.seqNo >= 0 ? a0.seqNo : 2147483647;	// INT_MAX
					var seq1 = _.isFinite(a1.seqNo) && a1.seqNo >= 0 ? a1.seqNo : 2147483647;	// INT_MAX
					return seq0 - seq1;

				});
			}

			return {
				largeMenuGrpList: largeMenuGrpList,		// Lv1: メニューノード
				middleMenuGrpList: middleMenuGrpList,	// Lv2: メニューノード
				viewList: viewList,						// メニューアイテム
				nodeIDMap: nodeIDMap,					// key:menuNodeID, val:menuNodeObj
				childrenListMap: childrenListMap,		// key:parentNodeID, val:[ menuNOdeObj0, menuNodeObj1, ...]
				openedMenuNodeIDSet: openedSet			// key:menuNodeID, val: true or false
			};
		},

		/**
		 * 指定ノードが可視ノードかどうか判定
		 */
		isVisibleNode: function(node){
			return node.seqNo >= 0;
		},

		/**
		 * 指定ノードがリーフノードかどうか判定
		 */
		isLeafNode: function(node){
			return !_.isEmpty(node.viewCode);
		},

		data2view : function(data, openedNodeMap){
			this.model = this.buildModel(data.largeMenuGrpList, data.middleMenuGrpList, data.viewList, openedNodeMap);
			var $top = this.$("ul.top");
			var nodeTmpl = _.template(''
					+ '<li id="<%= menuNodeID %>" target="<%= menuNodeID %>" class="nodeLevel <%= (_isOpened === true) ? "opened" : "closed" %> <%= (parentMenuNodeID > 0) ? "second" : "" %>">'
					+ '<p><span class="icnExpander"></span><%- menuNodeName %></div></p>'
					+ '<ul></ul>'
					+ '</li>');
			// クイックメニューアイコン
			var addQm = "";
			if(!clcom.is_iPad() && !clcom.is_iPhone()){
				addQm = "addQm";
			}
			var leafTmpl = _.template(''
					+ '<li id="<%= menuNodeID %>" target="<%= menuNodeID %>" class="endLevel">'
					+ '<p><a href="javascript:void(0)"><%- viewName %></a></p>'
					+ '<span class="' + addQm + '" title="クイックメニューに追加"></span>'
					+ '<div class="clear"></div>'
					+ '</li>');

			var buildChildren;
			buildChildren = function($pUL, pNodeObj, view){
				var children = view.model.childrenListMap[pNodeObj.menuNodeID];
				if(_.isEmpty(children)){
					return;
				}
				for(var i = 0; i < children.length; i++){
					var child = children[i];
					if(view.isLeafNode(child)){
						var $li = $(leafTmpl(child)).data('cl-rec', child);
						$pUL.append($li);
					}else{
						var $ul;
						if(view.isVisibleNode(child)){
							var $li = $(nodeTmpl(child));
							$ul = $li.find('ul');
							$pUL.append($li);
						}else{
							$ul = $pUL;
						}
						buildChildren($ul, child, view);
					}
				}
			}
			buildChildren($top, {menuNodeID: 0, _isOpened: true}, this);

			// Lv2以降で closed ノードを非表示にしておく
			$top.find('li.closed.nodeLevel > ul').hide();
		},

		_onNodeLevelClick : function(e){
			var $li = $(e.currentTarget).closest('li.nodeLevel');
			var isOpened;
			if($li.hasClass("closed")){
				$li.removeClass("closed").addClass("opened");
				$li.children("ul").slideDown("fast");
				isOpened = true;
			} else {
				$li.removeClass("opened").addClass("closed");
				$li.children("ul").slideUp("fast");
				isOpened = false;
			}
			var menuNodeID = $li.prop('id');
			var nodeObj = this.model.nodeIDMap[menuNodeID];
			nodeObj._isOpened = isOpened;
			this.model.openedMenuNodeIDSet[menuNodeID] = isOpened;
			return false;
		},

		_onAddQmClick : function(e){
			clutil.mediator.trigger("onAMCMV0030AddQmClick",e);
			return false;
		},

		_onMovePage : function(e){
			var $li = $(e.target).closest("li");
			var menuNodeID = $li.prop('id');
			var nodeObj = this.model.nodeIDMap[menuNodeID];
			if(this.isLeafNode(nodeObj)){
				var pushPageOpt = {
					url: toPageURL(nodeObj.viewCode)
				};
				clutil.mediator.trigger("onAMCMV0030MovePage", pushPageOpt, nodeObj.parentMenuNodeID);
			}
			return;
		},

		viewClear : function(){
			this.$("li").remove();
		},

		/**
		 * 開いているメニューノードIDセットを返す。
		 */
		getOpenedMenuNodeIDSet: function(){
			return this.model.openedMenuNodeIDSet;
		}
	});

	var MainView = Backbone.View.extend({
		el : $("#ca_main"),
		validator : null,
		events : {
		},

		initialize : function(){
			_.bindAll(this);

			// 共通ヘッダ
			this.commonHeader = new clutil.View.CommonHeaderView({
				backBtnURL: BackBtnURL
			});

			// パネル
			this.alarmView = new AlarmView({el: this.$('#ca_alarmArea')});
			this.noticeView = new NoticeView({el: this.$('#ca_noticeArea')});
			this.hhtnoticeView = new HHTNoticeView({el: this.$('#ca_hhtNoticeArea')});
			this.quickView = new QuickView({el: this.$('#ca_quickArea')});
			this.menuView = new MenuView({el: this.$('#ca_menuArea')});

//			// グループID -- AMCMV0030 なデータに関連することを表すためのマーキング文字列
//			var groupid = 'AMCMV0030';

			// イベント
//			clutil.mediator.on('onPageChanged', this._onPageChanged);	// ページャから、ページ切り替え等イベント
			clutil.mediator.on("onAMCMV0030MovePage", this._onAMCMV0030MovePage);
			clutil.mediator.on("onAMCMV0030AddQmClick", this._onAMCMV0030AddQmClick);

			this.validator = clutil.validator(this.$el, {
				echoback : $(".cl_echoback")
			});
			// MDBaseView を使用していないから、メッセージサービスも独自実装。
			clutil.mediator.on('onTicker', _.bind(function(anyArg){
				// エラーメッセージをセット
				var msg = null;
				if(_.isEmpty(anyArg)){
					;
				}else if(_.isString(anyArg)){
					// 文字列型の場合
					msg = anyArg;
				}else if(anyArg._eb_){
					// validator.setErrorInfo の引数の場合
					msg = anyArg._eb_;
				}else if(anyArg.status && anyArg.message){
					// 共通ヘッダそのものの場合
					msg = clutil.fmtargs(clutil.getclmsg(anyArg.message), anyArg.message.args);
				}else if(anyArg.rspHead && anyArg.rspHead.message){
					// 共通ヘッダを包括したオブジェクトの場合
					msg = clutil.fmtargs(clutil.getclmsg(anyArg.rspHead.message), anyArg.rspHead.message.args);
				}else{
					msg = '???';
				}
				if(_.isEmpty(anyArg)){
					this.clearErrorHeader();
				}else{
					this.setErrorHeader(msg);
				}
			}, this.validator));
		},

		initUIelement : function(){
			this.commonHeader.initUIElement();

			this.alarmView.initUIelement();
			this.noticeView.initUIelement();
			this.hhtnoticeView.initUIelement();
			this.quickView.initUIelement();
			this.menuView.initUIelement();

			var now = clcom.getOpeDate();
			console.log(now);

			return this;
		},

		/**
		 * 画面描画
		 */
		render: function() {
			this.$el.prepend(this.commonHeader.render().$el);

			this.alarmView.render();
			this.noticeView.render();
			this.hhtnoticeView.render();
			this.quickView.render();
			this.menuView.render();

			// 自所属表示
			this.$("#mainContainerInbox .userinfo .org1").text(clcom.userInfo.org_name);

//			this._doGetReq().done(_.bind(function(data){
//				$('body').show().css({visibility: 'visible'}).removeClass('cl_body_hidden');
//			},this));

			// body 部を表示
			$('body').show().css({visibility: 'visible'}).removeClass('cl_body_hidden');

			// アプリデータがあれば、データを view へ表示。
			if(this.model){
				this.data2view(this.model);
				this.resetFocus();
			}

			// 店舗ユーザー以外の場合はHHT通知領域を非表示
			if (clcom.getUserData().user_typeid != amcm_type.AMCM_VAL_USER_STORE) {
				this.hhtnoticeView.hide();
			} else {
				this.hhtnoticeView.show();
			}
			return this;
		},

		/**
		 * ポータル画面データを再取得する
		 */
		refresh: function() {
			// 結果状態をクリアする
			this.clearResult();

			// データを取得
			return postAMCMV0030JSON()
			.done(_.bind(function(data, dataType) {
				var appData = data.AMCMV0030GetRsp;
				if (_.isEmpty(appData)) {
					clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_nodata'));
				} else {
					this.setModel(appData);
				}
			}, this))
			.fail(_.bind(function(data){
				console.log(data.rspHead);
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
				this.resetFocus();
			}, this));
		},

		setModel: function(data){
			this.model = data;
			this.data2view(data);
			this.resetFocus();
		},

		data2view : function(data){
			if(_.isEmpty(data)){
				this.viewClear();
			}else{
				this.alarmView.data2view(data);
				this.noticeView.data2view(data);
				this.hhtnoticeView.data2view(data);
				this.quickView.data2view(data);
				var opendMenuNodeIDSet, target;
				if(savedPageData
						&& savedPageData.user_code == clcom.userInfo.user_code
						&& savedPageData.opeDate == clcom.getOpeDate()){
					opendMenuNodeIDSet = savedPageData.opendMenuNodeIDSet;
					target = savedPageData.target;
				}
				this.menuView.data2view(data, opendMenuNodeIDSet);
				if(target){
					clcom.targetJump(target, 500);
				}
			}
		},

		/**
		 * 適切な場所へフォーカスを置く
		 */
		resetFocus: function($focusElem){
			if($focusElem){
				clutil.setFocus($focusElem);
			} else {
//				clutil.setFocus(this.$("#ca_menuArea"));
			}
		},

		/**
		 * 結果のクリア
		 */
		clearResult: function() {
			// 確定時用のデータを初期化
//			this.savedReq = null;
			this.model = null;
			this.viewClear();
		},

		/**
		 * viewのクリア
		 */
		viewClear: function(){
			this.alarmView.viewClear();
			this.noticeView.viewClear();
			this.hhtnoticeView.viewClear();
			this.quickView.viewClear();
			this.menuView.viewClear();
			return;
		},

		/**
		 * ページ遷移
		 * @param {object} pushPageOpt clcom.pushPage() に指定するオプション
		 * @param {string} [target] 復帰後の target ジャンプ位置
		 */
		_onAMCMV0030MovePage : function(pushPageOpt, target){
			// メニュー開いているノード情報を pageDate に保存する。
			if(!pushPageOpt.newWindow){
				// ポータル画面固有の保存データをストレージへ保存。
				// pageData としての保存はしない。
				//∵）戻る操作が、pushPage(ポータル画面URL) なので、clcom.popPage() 関数戻りに限定されてしまうから。
				var savedData = {
					opeDate: clcom.getOpeDate(),
					user_code: clcom.userInfo.user_code,
					opendMenuNodeIDSet: this.menuView.getOpenedMenuNodeIDSet(),
					target: target
				};
				store.set(myStoredKey, savedData);
			}
			clcom.pushPage(pushPageOpt);
		},

		_onAMCMV0030AddQmClick : function(e){
			var $span = $(e.target);
			var $li = $span.closest("li");
			var menuNodeID = $li.attr("id");
			var f_error = false;
			$.each(this.$("#ca_quickArea").find("li"), function(){
				var qMenuNodeID = $(this).attr("id");
				if(menuNodeID == qMenuNodeID){
					f_error = true;
				}
				return !f_error;
			});

			if(f_error){
				clutil.mediator.trigger("onTicker", "既に登録されています");
				return;
			}

			var quickMenu = {
					userID : clcom.userInfo.user_id,
					funcID : $li.data("cl-rec").viewID
			};
			var req = {
					reqHead: {
						opeTypeId : am_proto_defs.AM_PROTO_COMMON_RTYPE_UPD,
					},
					AMCMV0030UpdReq : {
						quickMenu : quickMenu
					}
			};
			var uri = "AMCMV0030";
			clutil.postJSON(uri, req).done(_.bind(function(data, dataType) {
				var liData = {
						menuNodeID : $li.attr("id"),
						func : $li.data("cl-rec")
				};
				this.quickView.addQm(liData);
			}, this)).fail(_.bind(function(data){
				console.log(data.rspHead);
				// エラーメッセージを通知。
				clutil.mediator.trigger('onTicker', data);
				this.resetFocus();
			}, this));
		},

	});

	// 画面初期表示
	clutil.getIniJSON()
	.then(function(data){
		console.log('getIniJSON.then: ', arguments);
		// getIniJSON 処理が失敗した場合は、then には入らず、fail する。
		// ここは、必ず getIniJSON が成功している。
		// メニュー情報等、ポータルの初期表示データを取得する。
		return postAMCMV0030JSON();
	})
	.done(_.bind(function(data, dataType){				// 画面の初期化を行う
		// data は、AMCMV0030 の応答。
		var appData = data.AMCMV0030GetRsp;

		// 初期表示内容が空っぽの場合、強制ログアウト。
		if(_.isEmpty(appData)){
			clutil.View.doAbort({
				messages: [
					// 初期表示データがありません。
					clutil.getclmsg('cl_ini_nodata')
				],
				rspHead: data.rspHead,
				logout: true
			});
			return;
		}

		mainView = new MainView().initUIelement().render();
		mainView.setModel(appData);
//		if(_.isEmpty(appData)){
//			// 初期表示データがありません。
//			clutil.mediator.trigger('onTicker', clutil.getclmsg('cl_ini_nodata'));
//		}
	}, this))
	.fail(_.bind(function(data){
		console.error('iniJSON failed.', arguments);

		// clcom のネタ取得に失敗。
		// 動かしようがないので、Abort 扱いとしておく？？？
		clutil.View.doAbort({
			messages: [
				//'初期データ取得に失敗しました。'
				clutil.getclmsg('cl_ini_failed')
			],
			rspHead: data.rspHead,
			logout: true
		});
	}, this));
});
