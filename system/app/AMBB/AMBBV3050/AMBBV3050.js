useSelectpicker2(); // セレクターをオートコンプリートと合体(funcrion()中に入れるとおかしくなる)

$(function () {
  $.inputlimiter.noTrim = true; //字数制限エラー等の刈取り防止
  clutil.enterFocusMode($('body')); // Enterキーによるフォーカスをする

  const AMBBV3050 = Backbone.View.extend({
    el: $('#container'),
    events: {
      'click #search': 'onclickSearch', // [検索]押下
      'click #excel': 'onclickExcel', // [Excel出力]押下
      'click #searchAgain': 'onclickSearchAgain', // [検索条件を再指定]押下
    },

    initialize: function () {
      this.baseView = new clutil.View.MDBaseView({ title: '受注' })
        .initUIElement()
        .render();

      this.validator = this.baseView.validator;

      this.bbcust = new BBcustView({ el: '#bbcust' });
      clutil.datepicker(this.$('#契約期間from'));
      clutil.datepicker(this.$('#契約期間to'));
      clutil.datepicker(this.$('#受注日from'));
      clutil.datepicker(this.$('#受注日to'));
      clutil.datepicker(this.$('#希望納期from'));
      clutil.datepicker(this.$('#希望納期to'));

      this.paginationViews = _(
        clutil.View.buildPaginationView(this.cid, this.$el)
      ).map((paginationView) => {
        return paginationView.render();
      });

      this.controlSrchArea = clutil.controlSrchArea(
        this.$('#cond'),
        this.$('#search'),
        this.$('#result'),
        this.$('#searchAgain')
      );

      clutil.mediator
        .on('onPageChanged', (groupid, reqPage) => {
          if (groupid != this.cid) {
            return;
          }
          return this.search(_.defaults({ reqPage: reqPage }, this.request));
        })
        .on('onRowSelectChanged', (groupid, arg) => {
          if (groupid != this.cid) {
            return;
          }
          if (!arg.selectedRecsCount || arg.selectedRecsCount > 1) {
            clutil.inputReadonly(this.$('#AMBBV3090'), true);
            clutil.inputReadonly(this.$('#AMBBV3130'), true);
            clutil.inputReadonly(this.$('#AMBBV3150'), true);
            return;
          }
        })
        .on('onOperation', (opeTypeId) => {
          const selectedRecs = this.rowSelectListView.getSelectedRecs();
          clcom.pushPage({
            url: ((code) => {
              return [
                clcom.appRoot,
                code.slice(0, 4),
                code,
                code + '.html',
              ].join('/');
            })('AMBBV3060'),
            args: {
              opeTypeId: opeTypeId,
              recs: _(selectedRecs)
                .uniq((rec) => {
                  return [rec.bbcust.id, rec.bbproj.id].join();
                })
                .map((rec) => {
                  return _.pick(rec, 'bbcust', 'bbproj');
                }),
            },
            saved: { request: this.request, selectedRecs: selectedRecs },
            newWindow: opeTypeId == am_proto_defs.AM_PROTO_COMMON_RTYPE_REL,
          });
        });

      if (clcom.pageData) {
        const pageData = clcom.pageData;
        const request = pageData.request;
        this.data2view(request.getReq);
        return this.search(request).then(() => {
          this.rowSelectListView.setSelectRecs(pageData.selectedRecs, true);
        });
      }
    },

    view2data: function () {
      const data = clutil.view2data(this.$el);
      return { format: Number(data.format) };
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
                bbcust: {
                  id: index,
                  code: ('0000000000' + index).slice(-5),
                  name: '法人' + index,
                },
                bbproj: {
                  id: index,
                  code: ('0000000000' + index).slice(-7),
                  name: '案件' + index,
                },
              };
            }),
          },
        };
      });
    },

    validate: function () {
      const validator = this.validator;
      if (
        !validator.valid() ||
        !validator.validFromToObj([
          { $stval: this.$('#契約期間from'), $edval: this.$('#契約期間to') },
          { $stval: this.$('#受注日from'), $edval: this.$('#受注日to') },
          { $stval: this.$('#希望納期from'), $edval: this.$('#希望納期to') },
        ])
      ) {
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
            let $headerTemplate = null;
            let $rowTemplate = null;
            let uniqueId = null;
            switch (request.getReq.format) {
              case 1:
                $headerTemplate = this.$('#headerTemplate1');
                $rowTemplate = this.$('#rowTemplate1');
                uniqueId = (rec) => {
                  return [rec.bbcust.id, rec.bbproj.id].join();
                };
                break;
              case 2:
                $headerTemplate = this.$('#headerTemplate2');
                $rowTemplate = this.$('#rowTemplate2');
                uniqueId = (rec) => {
                  return [rec.bbcust.id, rec.bbproj.id].join();
                };
                break;
              case 3:
                $headerTemplate = this.$('#headerTemplate3');
                $rowTemplate = this.$('#rowTemplate3');
                uniqueId = (rec) => {
                  return [rec.bbcust.id, rec.bbproj.id].join();
                };
                break;
              default:
                return;
            }
            _.extend(this, {
              rowSelectListView: new clutil.View.RowSelectListView({
                el: this.$('#table')
                  .find('thead')
                  .html($headerTemplate.html())
                  .end(),
                template: _.template($rowTemplate.html()),
                groupid: this.cid,
              })
                .initUIElement()
                .render(),
              request: request,
              response: response,
            });
            this.rowSelectListView.setRecs(
              _(list).map((rec) => {
                return _.extend(rec, { id: uniqueId(rec) });
              })
            );
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

    // [Excel出力]押下時の処理
    onclickExcel: function () {
      return this.postJSON({
        reqHead: { opeTypeId: am_proto_defs.AM_PROTO_COMMON_RTYPE_CSV },
        getReq: this.view2data(),
      }).then((response) => {
        // clutil.download();
      });
    },

    // [検索条件を再指定]押下時の処理
    onclickSearchAgain: function () {
      this.controlSrchArea.show_srch();
    },
  });

  return clutil.getIniJSON().then(
    (response) => {
      mainView = new AMBBV3050();
    },
    (response) => {
      clutil.View.doAbort({
        messages: [clmsg.cl_ini_failed],
        rspHead: response.rspHead,
      });
    }
  );
});
