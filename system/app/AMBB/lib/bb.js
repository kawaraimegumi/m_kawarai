bbutil = {
  ymd2y: function (ymd) {
    return Number(String(ymd).slice(0, 4));
  },
  ymd2m: function (ymd) {
    return Number(String(ymd).slice(4, 6));
  },
  ymd2d: function (ymd) {
    return Number(String(ymd).slice(6, 8));
  },
  computeDate: function (ymd, dy = 0, dm = 0, dd = 0) {
    date = clutil.ymd2date(ymd);
    date.setFullYear(date.getFullYear() + dy);
    date.setMonth(date.getMonth() + dm);
    date.setDate(date.getDate() + dd);
    return clutil.dateFormat(date, 'yyyymmdd');
  },
  yearSelector: function (options) {
    clutil.cltypeselector3(
      _.defaults(
        {
          list: _(10).times((index) => {
            const year = this.ymd2y(clcom.getOpeDate()) - index;
            return { id: year, name: year + '年' };
          }),
        },
        options
      )
    );
  },
  monthSelector: function (options) {
    clutil.cltypeselector3(
      _.defaults(
        {
          list: _(12).times((index) => {
            const month = index + 1;
            return { id: month, name: month + '月' };
          }),
        },
        options
      )
    );
  },
};
