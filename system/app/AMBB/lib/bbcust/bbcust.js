$(function () {
  const _BBcustView = Backbone.View.extend({
    events: {
      'click #search': 'onclickSearch', // [検索]押下
      'click #searchAgain': 'onclickSearchAgain', // [検索条件を再指定]押下
      'click #add': 'onclickAdd', // [チェックしたものを選択内容に追加]押下
      'click #removeAll': 'onclickRemoveAll', // [すべて削除]押下
      'click #ul .remove': 'onclickRemove', // [×]押下
      'click #cancel': 'onclickCancel', // [キャンセル]押下
      'click #commit': 'onclickCommit', // [確定]押下
    },

    initialize: function (options) {
      _.extend(this, { multiple: false }, options);

      clutil.loadHtml(
        ((code) => {
          return [
            clcom.appRoot,
            clcom.pageId.slice(0, 4),
            'lib',
            code,
            code + '.html',
          ].join('/');
        })('bbcust'),
        (html) => {
          this.html = html;
        }
      );
    },

    show: function (options) {
      this.$el.html(this.html);
      this.$main.hide();

      this.validator = clutil.validator(this.$el, {
        echoback: $('.cl_echoback'),
      });

      this.paginationViews = _(
        clutil.View.buildPaginationView(this.cid, this.$el)
      ).map((paginationView) => {
        return paginationView.render();
      });

      const $table = this.multiple ? this.$('#list2') : this.$('#list1');
      this.listView = new clutil.View.RowSelectListView({
        el: $table.show(),
        template: _.template($table.find('script').html()),
        groupid: this.cid,
      })
        .initUIElement()
        .render();

      this.controlSrchArea = clutil.controlSrchArea(
        this.$('#cond'),
        this.$('#search'),
        this.$('#result'),
        this.$('#searchAgain')
      );

      this.addtoSelected = _.extend(
        clutil.addtoSelected(this.$('#add'), this.$('#selected'), this.$el),
        {
          get: () => {
            return _(this.$('#ul').children()).map((li) => {
              return this.$(li).data().rec;
            });
          },
          set: (recs) => {
            const template = _.template(this.$('#recTemplate').html());
            this.$('#ul')
              .empty()
              .append(
                _(recs)
                  .chain()
                  .filter((rec) => {
                    return rec.bbcustId;
                  })
                  .reduce((memo, rec) => {
                    return memo.add($(template(rec)).data({ rec: rec }));
                  }, this.$())
                  .value()
              );
          },
        }
      );
      if (!this.multiple) {
        this.$('#add').hide();
        this.$('#selected').hide();
      }

      clutil.mediator.on('onPageChanged', (groupid, reqPage) => {
        if (groupid != this.cid) {
          return;
        }
        return this.search(_.defaults({ reqPage: reqPage }, this.request));
      });

      this.addtoSelected.set(options.data);
    },

    hide: function () {
      this.$el.html('');
      this.$main.show();
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return {};
    },

    data2view: function (data) {
      clutil.data2view(this.$el, JSON.parse(JSON.stringify(data)), null, true);
    },

    postJSON: function (request, id = clcom.pageId) {
      // return clutil.postJSON(id, request).then(
      //   (response) => {
      //     return response;
      //   },
      //   (response) => {
      //     const rspHead = response.rspHead;
      //     this.validator.setErrorHeader(
      //       clutil.fmtargs(clutil.getclmsg(rspHead.message), rspHead.args)
      //     );
      //   }
      // );

      // モック用
      return Promise.resolve().then(() => {
        clutil.blockUI();
        return {
          rspPage: {
            curr_record: 0,
            total_record: 10,
            page_record: 10,
            page_size: 10,
            page_num: 1,
          },
          getRsp: {
            list: _(10).times((index) => {
              index += 1;
              return {
                bbcustId: index,
                bbcustCode: ('0000000000' + index).slice(-5),
                bbcustName: '法人' + index,
              };
            }),
          },
        };
      });
    },

    validate: function () {
      const validator = this.validator;
      if (!validator.valid()) {
        validator.setErrorHeader(clmsg.cl_echoback);
        return false;
      }
      return true;
    },

    search: function (request) {
      return (
        this.postJSON(request)
          .then((response) => {
            const list = response.getRsp.list;
            if (!list.length) {
              this.validator.setErrorHeader(clmsg.cl_no_data);
              return;
            }
            _.extend(this, { request: request, response: response });
            this.listView.setRecs(list);
            this.controlSrchArea.show_result();
          })
          // モック用
          .then(() => {
            clutil.unblockUI();
          })
      );
    },

    // [検索]押下時の処理
    onclickSearch: function () {
      if (!this.validate()) {
        return;
      }
      return this.search({
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_REL },
        reqPage: _(this.paginationViews).first().buildReqPage0(),
        getReq: this.view2data(),
      });
    },

    // [検索条件を再指定]押下時の処理
    onclickSearchAgain: function () {
      this.controlSrchArea.show_srch();
    },

    // [チェックしたものを選択内容に追加]押下時の処理
    onclickAdd: function () {
      const addtoSelected = this.addtoSelected;
      if (addtoSelected.right_side()) {
        return;
      }
      addtoSelected.set(
        _(addtoSelected.get())
          .chain()
          .union(this.listView.getSelectedRecs())
          .uniq((rec) => {
            return rec.bbcustId;
          })
          .sortBy((rec) => {
            return rec.bbcustCode;
          })
          .value()
      );
    },

    // [すべて削除]押下時の処理
    onclickRemoveAll: function () {
      this.addtoSelected.set();
    },

    // [×]押下時の処理
    onclickRemove: function (e) {
      this.$(e.target.closest('li')).fadeOut(1, function () {
        this.remove();
      });
    },

    // [キャンセル]押下時の処理
    onclickCancel: function () {
      this.hide();
      this.callback(null);
    },

    // [確定]押下時の処理
    onclickCommit: function () {
      if (!this.validate()) {
        return;
      }
      const data = this.multiple
        ? this.addtoSelected.get()
        : this.listView.getSelectedRecs();
      this.hide();
      this.callback(data);
    },
  });

  BBcustView = Backbone.View.extend({
    events: {
      'click button': 'onclickButton', // [参照]]押下
    },

    initialize: function (options) {
      $('#ca_main').append(_.template('<div id="<%= cid %>"></div>')(this));
      this.$el
        .empty()
        .append(
          '' +
            '<div style="display: flex">' +
            '<input type="text" class="form-control cl_valid wt280" disabled />' +
            '<button class="btn btn-default">参照</button>' +
            '</div>'
        )
        .data({
          view: new _BBcustView(
            _.defaults(
              {
                el: '#' + this.cid,
                $main: $('#container'),
                callback: (data) => {
                  if (!data) {
                    return;
                  }
                  this.set(data);
                },
              },
              options
            )
          ),
        });

      this.set([]);
    },

    get: function () {
      return _.deepClone(this.$el.data().data);
    },

    set: function (data) {
      this.$el
        .data({ data: _.deepClone(data) })
        .find('input')
        .val(
          _(data)
            .map((rec) => {
              return rec.bbcustId
                ? [rec.bbcustCode, rec.bbcustName].join(':')
                : '';
            })
            .join(', ')
        );
    },

    // [参照]押下時の処理
    onclickButton: function () {
      this.$el.data().view.show({ data: this.get() });
    },
  });
});
