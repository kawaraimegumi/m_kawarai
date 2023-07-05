useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const MainView = Backbone.View.extend({
    el: $('#container'),

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({
        title: '入力部品',
        subtitle: '',
      })
        .initUIElement()
        .render();

      clutil.datepicker(this.$('#カレンダー任意'));

      clutil.datepicker(this.$('#カレンダー必須'));

      clutil.datepicker(this.$('#カレンダーfrom'));
      clutil.datepicker(this.$('#カレンダーto'));

      clutil.cltypeselector3({
        $select: this.$('#プルダウン単一'),
        list: [
          { id: 1, code: '01', name: 'A' },
          { id: 2, code: '02', name: 'B' },
          { id: 3, code: '03', name: 'C' },
        ],
        unselectedflag: true,
      });

      clutil.cltypeselector3({
        $select: this.$('#プルダウン複数任意'),
        list: [
          { id: 1, code: '01', name: 'A' },
          { id: 2, code: '02', name: 'B' },
          { id: 3, code: '03', name: 'C' },
        ],
      });

      clutil.cltypeselector3({
        $select: this.$('#プルダウン複数必須'),
        list: [
          { id: 1, code: '01', name: 'A' },
          { id: 2, code: '02', name: 'B' },
          { id: 3, code: '03', name: 'C' },
        ],
      });

      // clutil.clbusunitselector(this.$('#業態'), 1);

      // よく分かってないので、まだ使わないで下さい。
      this.fieldRelation = clutil.FieldRelation.create(
        '',
        {
          clbusunitselector: { el: '#業態', initValue: clcom.userInfo.unit_id },
          clorgcode: {
            el: '#店舗',
            addDepends: ['p_org_id'],
            dependSrc: { p_org_id: 'unit_id' },
          },
          AMPAV0010: {
            button: this.$('#店舗参照'),
            view: _.extend(
              new AMPAV0010SelectorView({
                el: $('#AMPAV0010container'),
                $parentView: this.$el,
              }).render(),
              {
                okProc: (data) => {
                  if (data) {
                    mainView.fieldRelation.fields.clorgcode.setValue(
                      _(data)
                        .chain()
                        .map((rec) => {
                          return _.extend(rec, { id: rec.val });
                        })
                        .first()
                        .value()
                    );
                  }
                },
              }
            ),
            showOptions: () => {
              return {
                org_kind_set: [
                  am_pa_store_if.AM_PA_STORE_ORG_KIND_STORE,
                  am_pa_store_if.AM_PA_STORE_ORG_KIND_CENTER,
                  am_pa_store_if.AM_PA_STORE_ORG_KIND_HQ,
                ],
              };
            },
          },
        },
        {
          dataSource: {
            orgfunc_id: Number(
              clcom.getSysparam('PAR_AMMS_DEFAULT_ORG_FUNCID')
            ),
            orglevel_id: Number(clcom.getSysparam('PAR_AMMS_STORE_LEVELID')),
          },
        }
      );
    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new MainView();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
