
$(function() {

	/**
	 * 売上（AMASV）ユーティリティ集
	 */
	AMASVUtil = {
		/**
		 * 事業ユニット区分セレクタ
		 * 未選択アイテムは、有効な選択肢の名前連結ラベルで表示する。
		 */
		clbusunitselector: function($select){

			req = {
				cond: {}
			};

			// データを取得

			var uri = 'am_pa_busunit_srch';

			return clutil.postJSON(uri, req).done(function(data, dataType) {

				console.log("AMASVUtil.clbusselector callback start");

				if (data.head.status == am_proto_defs.AM_PROTO_COMMON_RSP_STATUS_OK) {

					var busunitList = data.body.list;

					// XXX: 7/22 情シス指摘事項を修正
					if(busunitList.length > 1){
					// XXX: 修正ここまで

						var nameArray = _.reduce(busunitList, function(names, item){
							if(!_.isEmpty(item.busunit_name)){
								names.push(item.busunit_name);
							}
							return names;
						},[]);
						if(!_.isEmpty(busunitList)){
							busunitList.splice(0,0,{
								busunit_id: 0,
								busunit_name: nameArray.join('＋')
							});
						}
					}

					clutil.cltypeselector3({
						$select: $select,
						list: busunitList,
						unselectedflag: false,
						namedisp: false,
						idname: 'busunit_id',
						namename: 'busunit_name',
						codename: 'busunit_code'
					});

				}
				console.log("AMASVUtil.clbusselector callback done");
			});
		}
	};

});