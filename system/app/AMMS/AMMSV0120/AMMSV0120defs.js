var MyApp = new Marionette.Application();

(function(MyApp){
	MyApp.ITEMATTRGRPFUNC_ID_SUBCLS1            = 1;       // サブクラス1
	MyApp.ITEMATTRGRPFUNC_ID_SUBCLS2            = 2;       // サブクラス2
	MyApp.ITEMATTRGRPFUNC_ID_USETYPE            = 3;       // 用途区分
	MyApp.ITEMATTRGRPFUNC_ID_COLOR              = 4;       // カラー
	MyApp.ITEMATTRGRPFUNC_ID_SEASON             = 5;       // シーズン
	MyApp.ITEMATTRGRPFUNC_ID_BRAND              = 6;       // ブランド
	MyApp.ITEMATTRGRPFUNC_ID_STYLE              = 7;       // スタイル
	MyApp.ITEMATTRGRPFUNC_ID_DESIGN             = 8;       // 柄
	MyApp.ITEMATTRGRPFUNC_ID_MATERIAL           = 9;       // 素材
	MyApp.ITEMATTRGRPFUNC_ID_COUNTRY            = 10;      // 国
	MyApp.ITEMATTRGRPFUNC_ID_FACTORY            = 11;      // 縫製工場
	MyApp.ITEMATTRGRPFUNC_ID_PARTS              = 12;      // 部位
	MyApp.ITEMATTRGRPFUNC_ID_TAGMATERIAL		= 13;      // 素材(タグ用)
	MyApp.ITEMATTRGRPFUNC_ID_SUBDESIGN			= 14;      // サブ柄
	MyApp.ITEMATTRGRPFUNC_ID_DESIGNCOLOR		= 15;      // ベース色(柄色)
	MyApp.ITEMATTRGRPFUNC_ID_CURRENCY           = 16;      // 通貨
	MyApp.ITEMATTRGRPFUNC_ID_MODELNOPLACE		= 17;      // 部位(型番)
	MyApp.ITEMATTRGRPFUNC_ID_ITOLOX             = 18;      // 糸LOX

	_.extend(MyApp, {
		OPETYPE_SAVE:		101,	// 保存
		OPETYPE_RETURN:         200,    // 差戻し
		OPETYPE_TAG_APPLY:		102,	// タグ発行申請
		OPETYPE_TAG_RETURN:		103,	// タグ発行差戻し
		OPETYPE_TAG_APPROVE:	104,	// タグ発行承認
		OPETYPE_LAST_APPLY:		105,	// 最終承認申請
		OPETYPE_LAST_RETURN:	106,	// 最終承認差戻し
		OPETYPE_LAST_APPROVE:	107,	// 最終承認
		OPETYPE_DISTR_APPLY: 999,		// 振分の設定ボタン
		OPETYPE_OUTPUT:			201
	});

	/**
	 * 画面モード一覧
	 * 
	 * ### mode_new
	 * 新規登録
	 * 
	 * ### mode_rel
	 * 承認申請中(商品発注兼振分一覧画面より遷移)
	 * 追加発注承認申請中(商品発注兼振分一覧画面より遷移)
	 * 
	 * ### mode_tag_apply
	 * タグ発行申請後(承認一覧画面より)
	 * 
	 * ### mode_tag_return
	 * タグ発行申請差戻し後
	 * 
	 * ### mode_tag_approve
	 * タグ発行申請承認後
	 * 
	 * ### mode_apply
	 * 最終承認申請後(承認一覧画面より)
	 * 
	 * ### mode_return_tag
	 * 最終承認申請差し戻し後(タグ承認済)
	 * 
	 * ### mode_return
	 * 最終承認申請差し戻し後(タグ承認未)
	 * 
	 * ### mode_approve
	 * 承認後の追加発注時
	 * 
	 * ### mode_oddadd_apply
	 * 追加発注最終承認申請後(承認一覧画面より)
	 * 
	 * ### mode_oddadd_return
	 * 追加発注最終承認申請差戻し後
	 */

	MyApp.footer_opetype_map = {
		// 新規登録
		mode_new: [
			{
				opeTypeId: MyApp.OPETYPE_SAVE,
				label: '保存',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_NEW
			},
			{
				opeTypeId: MyApp.OPETYPE_TAG_APPLY,
				label: 'タグ発行申請',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPLY
			},
			{
				opeTypeId: MyApp.OPETYPE_LAST_APPLY,
				label: '最終承認申請',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_APPLY
			}
		],
		
		// 更新(一時保存中など)
		mode_edit: [
			{
				opeTypeId: MyApp.OPETYPE_SAVE,
				label: '保存',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_NEW_EDIT
			},
			{
				opeTypeId: MyApp.OPETYPE_TAG_APPLY,
				label: 'タグ発行申請',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPLY
			},
			{
				opeTypeId: MyApp.OPETYPE_LAST_APPLY,
				label: '最終承認申請',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_APPLY
			}
		],
		
		// 参照のみ
		mode_rel: -1,
		// タグ発行申請後(承認一覧画面より)
		mode_tag_apply: [
			{
				opeTypeId: MyApp.OPETYPE_RETURN,
				label: '差戻し',
				comment: true,
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_RETURN
			},
			{
				opeTypeId: MyApp.OPETYPE_TAG_APPROVE,
				label: 'タグ発行承認',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPROVE
			}
		],
		// タグ発行申請差戻し後
		mode_tag_return: [
			{
				opeTypeId: MyApp.OPETYPE_SAVE,
				label: '保存',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_NEW_EDIT
			},
			{
				opeTypeId: MyApp.OPETYPE_TAG_APPLY,
				label: 'タグ発行申請',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPLY
			},
			{
				opeTypeId: MyApp.OPETYPE_LAST_APPLY,
				label: '最終承認申請',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_APPLY
			}
		],
		// タグ発行申請承認後
		mode_tag_approve: [
			{
				opeTypeId: MyApp.OPETYPE_SAVE,
				label: '保存',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_NEW_EDIT
			},
			{
				opeTypeId: MyApp.OPETYPE_LAST_APPLY,
				label: '最終承認申請',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_APPLY
			}
		],
		// 最終承認申請後(承認一覧画面より)
		mode_apply: [
			{
				opeTypeId: MyApp.OPETYPE_RETURN,
				label: '差戻し',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_RETURN,
				comment: true
			},
			{
				opeTypeId: MyApp.OPETYPE_LAST_APPROVE,
				label: '最終承認',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_APPROVE
			}
		],
		// 最終承認申請差し戻し後(タグ承認未)
		mode_return: [
			{
				opeTypeId: MyApp.OPETYPE_SAVE,
				label: '保存',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_NEW_EDIT
			},
			{
				opeTypeId: MyApp.OPETYPE_TAG_APPLY,
				label: 'タグ発行申請',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_TAG_APPLY
			},
			{
				opeTypeId: MyApp.OPETYPE_LAST_APPLY,
				label: '最終承認申請',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_APPLY
			}
		],
		// 最終承認申請差し戻し後(タグ承認済)
		mode_return_tag: [
			{
				opeTypeId: MyApp.OPETYPE_SAVE,
				label: '保存',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_NEW_EDIT
			},
			{
				opeTypeId: MyApp.OPETYPE_LAST_APPLY,
				label: '最終承認申請',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_APPLY
			}
		],
		// 承認後の追加発注時
		mode_approve: [
			{
				opeTypeId: MyApp.OPETYPE_SAVE,
				label: '保存',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_EDIT
			},
			{
				opeTypeId: MyApp.OPETYPE_LAST_APPLY,
				label: '最終承認申請',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_APPLY
			}
		],
		// 追加発注最終承認申請後
		mode_oddadd_apply: [
			{
				opeTypeId: MyApp.OPETYPE_RETURN,
				label: '差戻し',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_RETURN,
				comment: true
			},
			{
				opeTypeId: MyApp.OPETYPE_LAST_APPROVE,
				label: '最終承認',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_APPROVE1
			}
		],
		
		// 追加発注最終承認申請差戻し後
		mode_oddadd_return: [
			{
				opeTypeId: MyApp.OPETYPE_RETURN,
				label: '差戻し',
				comment: true,
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_RETURN
			},
			{
				opeTypeId: MyApp.OPETYPE_LAST_APPLY,
				label: '最終承認申請',
				ptn: amcm_type.AMCM_VAL_ITEM_OPEPTN_ODADD_APPLY
			}
		]
	};
}(MyApp));
