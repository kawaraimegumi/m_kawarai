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
};
