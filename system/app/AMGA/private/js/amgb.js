var amgbp_AnaSortKey = {
  AMGBP_ANA_SORTKEY_ORDER_ASCENDING: 1,
  AMGBP_ANA_SORTKEY_ORDER_DESCENDING: -1,
};

var amgbp_AnaAxisElem = {
  AMGBP_ANA_AXISELEM_TYPE_TOTAL: 1,
  AMGBP_ANA_AXISELEM_TYPE_SUBTOTAL: 2,
  AMGBP_ANA_AXISELEM_TYPE_NORMAL: 3,
  AMGBP_ANA_AXISELEM_TYPE_DATA: 9,
};

var amgbp_AnaCellData = {
  AMGBP_ANA_CELLDATA_KIND_UNKNOWN: 0,
  AMGBP_ANA_CELLDATA_KIND_DECIMAL: 1,
  AMGBP_ANA_CELLDATA_KIND_AMOUNT: 2,
  AMGBP_ANA_CELLDATA_KIND_STRING: 3,
  AMGBP_ANA_CELLDATA_KIND_DOUBLE: 4,
  AMGBP_ANA_CELLDATA_KIND_RATIO: 5,
  AMGBP_ANA_CELLDATA_KIND_WEATHER: 6,
  AMGBP_ANA_CELLDATA_KIND_TIME: 7,
  AMGBP_ANA_CELLDATA_KIND_REAL: 8,
  AMGBP_ANA_CELLDATA_KIND_YMD: 10,
  AMGBP_ANA_CELLDATA_KIND_IYMD: 11,
  AMGBP_ANA_CELLDATA_KIND_QYREAL: 12,
  AMGBP_ANA_CELLDATA_KIND_AMREAL: 13,
  AMGBP_ANA_CELLDATA_KIND_YM: 14,
  AMGBP_ANA_CELLDATA_KIND_DECIMAL100: 20,
  AMGBP_ANA_CELLDATA_KIND_AMOUNT100: 21,
  AMGBP_ANA_CELLDATA_KIND_AMOUNT10000: 22,
  AMGBP_ANA_CELLDATA_KIND_REAL0: 23,
};

var amgbp_AnaDefs = {
  AMGBA_DEFS_ANA_OPERATION_REG: 1,
  AMGBA_DEFS_ANA_OPERATION_CSVDL: 2,
  AMGBA_DEFS_ANA_OPERATION_EXCELDL: 3,
  AMGBA_DEFS_ANA_OPERATION_ITEMLIST: 4,
  AMGBA_DEFS_ANA_OPERATION_NEXT: 5,
  AMGBA_DEFS_ANA_OPERATION_DRILLDOWN: 6,
  AMGBA_DEFS_ANA_OPERATION_MEMBLIST: 6,
  AMGBA_DEFS_SPYMD_MAX: 31,
  AMGBA_DEFS_WDAY_MIN: 1,
  AMGBA_DEFS_WDAY_MAX: 7,
  AMGBA_DEFS_KIND_NON: 0,
  AMGBA_DEFS_KIND_ORG_MIN: 100,
  AMGBA_DEFS_KIND_ORG: 101,
  AMGBA_DEFS_KIND_STORE: 102,
  AMGBA_DEFS_KIND_STORELIST: 103,
  AMGBA_DEFS_KIND_NEWSTORE_LOGIC: 104,
  AMGBA_DEFS_KIND_STOREATTR_SMX: 105,
  AMGBA_DEFS_KIND_STORE_SORT: 106,
  AMGBA_DEFS_KIND_NEWSTORE_COND: 107,
  AMGBA_DEFS_KIND_STOREATTR_CLOSED: 108,
  AMGBA_DEFS_KIND_STOREATTR_PREF: 109,
  AMGBA_DEFS_KIND_ORG_MAX: 199,
  AMGBA_DEFS_KIND_ITGRP_MIN: 200,
  AMGBA_DEFS_KIND_ITGRP: 201,
  AMGBA_DEFS_KIND_ITEM: 202,
  AMGBA_DEFS_KIND_COLORSIZEITEM: 203,
  AMGBA_DEFS_KIND_COLORITEM: 204,
  AMGBA_DEFS_KIND_PACKITEM: 205,
  AMGBA_DEFS_KIND_PACKITEM_ITEM: 206,
  AMGBA_DEFS_KIND_RESULTS: 209,
  AMGBA_DEFS_KIND_ITEMATTR_MIN: 210,
  AMGBA_DEFS_KIND_ITEMATTR_SUBCLASS1: 211,
  AMGBA_DEFS_KIND_ITEMATTR_SUBCLASS2: 212,
  AMGBA_DEFS_KIND_ITEMATTR_SEASON: 213,
  AMGBA_DEFS_KIND_ITEMATTR_AGGSEASON: 214,
  AMGBA_DEFS_KIND_ITEMATTR_BRAND: 215,
  AMGBA_DEFS_KIND_ITEMATTR_STYLE: 216,
  AMGBA_DEFS_KIND_ITEMATTR_SUBSTYLE: 217,
  AMGBA_DEFS_KIND_ITEMATTR_MATERIAL: 218,
  AMGBA_DEFS_KIND_ITEMATTR_DESIGN: 219,
  AMGBA_DEFS_KIND_ITEMATTR_SUBDESIGN: 220,
  AMGBA_DEFS_KIND_ITEMATTR_USE: 221,
  AMGBA_DEFS_KIND_ITEMATTR_COLOR: 222,
  AMGBA_DEFS_KIND_ITEMATTR_BASECOLOR: 223,
  AMGBA_DEFS_KIND_ITEMATTR_SIZE: 224,
  AMGBA_DEFS_KIND_ITEMATTR_ITEMTYPE: 225,
  AMGBA_DEFS_KIND_ITEMATTR_KITYPE: 226,
  AMGBA_DEFS_KIND_ITEMATTR_IMPORT: 227,
  AMGBA_DEFS_KIND_ITEMATTR_FACTORY: 228,
  AMGBA_DEFS_KIND_ITEMATTR_ANY: 229,
  AMGBA_DEFS_KIND_ITEMATTR_SUBCLASS1AND2: 230,
  AMGBA_DEFS_KIND_ITEMATTR_SMXKT: 231,
  AMGBA_DEFS_KIND_ITEMATTR_DISPTYPE: 232,
  AMGBA_DEFS_KIND_ITEMATTR_ITEMTASTE: 233,
  AMGBA_DEFS_KIND_ITEMATTR_SUBSEASON: 234,
  AMGBA_DEFS_KIND_ITEMATTR_SKT: 235,
  AMGBA_DEFS_KIND_ITEMATTR_SALE_ST_DATE: 236,
  AMGBA_DEFS_KIND_ITEMATTR_SALE_ED_DATE: 237,
  AMGBA_DEFS_KIND_ITEMATTR_FIRST_DLVDATE: 238,
  AMGBA_DEFS_KIND_ITEMATTR_LAST_DLVDATE: 239,
  AMGBA_DEFS_KIND_ITEMATTR_ALLSTORE: 240,
  AMGBA_DEFS_KIND_ITEMATTR_WDSTORE: 241,
  AMGBA_DEFS_KIND_ITEMATTR_WDPERIOD: 242,
  AMGBA_DEFS_KIND_ITEMATTR_MAX: 249,
  AMGBA_DEFS_KIND_ITEMSPEC: 250,
  AMGBA_DEFS_KIND_ITEMPRICE_LINE: 251,
  AMGBA_DEFS_KIND_ITEMPRICE_INIT: 252,
  AMGBA_DEFS_KIND_ITEMPRICE_CURR: 253,
  AMGBA_DEFS_KIND_ITEMPRICE_POS: 254,
  AMGBA_DEFS_KIND_ITEMPRICE_ORGPOS: 255,
  AMGBA_DEFS_KIND_ITEMDATE_AGE: 261,
  AMGBA_DEFS_KIND_ITEMDATE_YEAR: 262,
  AMGBA_DEFS_KIND_ITEMDATE_FIRST: 263,
  AMGBA_DEFS_KIND_ITEMPRICE_LINE_M: 264,
  AMGBA_DEFS_KIND_ITEMPRICE_LINE_SL: 265,
  AMGBA_DEFS_KIND_ITEMPRICE_LINE_SL_M: 266,
  AMGBA_DEFS_KIND_ITEMLIST: 290,
  AMGBA_DEFS_KIND_ITGRP_MAX: 299,
  AMGBA_DEFS_KIND_ITEMATTR_ANY_BASE: 5000,
  AMGBA_DEFS_KIND_MAKER_MIN: 300,
  AMGBA_DEFS_KIND_MAKER: 301,
  AMGBA_DEFS_KIND_MAKER_MAX: 399,
  AMGBA_DEFS_KIND_WDAY: 601,
  AMGBA_DEFS_KIND_HOLIDAY: 602,
  AMGBA_DEFS_KIND_YMD: 603,
  AMGBA_DEFS_KIND_SPYMD: 604,
  AMGBA_DEFS_KIND_TIMEZONE: 605,
  AMGBA_DEFS_KIND_TIMEPERIOD: 606,
  AMGBA_DEFS_KIND_DOWNYMD: 607,
  AMGBA_DEFS_KIND_MEMB_MIN: 800,
  AMGBA_DEFS_KIND_MEMBGENE: 801,
  AMGBA_DEFS_KIND_MEMBATTR: 802,
  AMGBA_DEFS_KIND_MEMBLIST: 803,
  AMGBA_DEFS_KIND_ADDR: 804,
  AMGBA_DEFS_KIND_ADDRLIST: 805,
  AMGBA_DEFS_KIND_MEMB: 806,
  AMGBA_DEFS_KIND_MEMBBUYING: 807,
  AMGBA_DEFS_KIND_COMINGSPAN: 849,
  AMGBA_DEFS_KIND_MEMBIO: 850,
  AMGBA_DEFS_KIND_LASTSTORE: 851,
  AMGBA_DEFS_KIND_MEMB_MAX: 899,
  AMGBA_DEFS_KIND_STAFF: 901,
  AMGBA_DEFS_KIND_STAFFPOST: 902,
  AMGBA_DEFS_KIND_STAFFGENE: 903,
  AMGBA_DEFS_KIND_STAFFATTR: 904,
  AMGBA_DEFS_KIND_TRANATTR_MARKET: 1001,
  AMGBA_DEFS_KIND_TRANATTR_SEXAGE: 1002,
  AMGBA_DEFS_KIND_TRANATTR_NEWMEMB: 1003,
  AMGBA_DEFS_KIND_TRANATTR_BUSIASS: 1004,
  AMGBA_DEFS_KIND_TRANATTR_UNIV: 1005,
  AMGBA_DEFS_KIND_TRANATTR_F_TIEUP: 1006,
  AMGBA_DEFS_KIND_TRANATTR_F_SCHOOL: 1007,
  AMGBA_DEFS_KIND_TRANATTR_F_SCHOOL_YEAR: 1008,
  AMGBA_DEFS_KIND_TRANATTR_TIEUP: 1009,
  AMGBA_DEFS_KIND_TRANATTR_T_DISC_PROM: 1011,
  AMGBA_DEFS_KIND_TRANATTR_COUPON_STORE: 1012,
  AMGBA_DEFS_KIND_TRANATTR_COUPON_STAFF: 1013,
  AMGBA_DEFS_KIND_TRANATTR_DMPROM: 1014,
  AMGBA_DEFS_KIND_TRANATTR_POSPROM: 1015,
  AMGBA_DEFS_KIND_ACCOUNTITEM: 1020,
  AMGBA_DEFS_KIND_SEGMENTCOND: 1101,
  AMGBA_DEFS_KIND_DISPITEM: 1201,
  AMGBA_DEFS_KIND_GROUPBY_V: 10001,
  AMGBA_DEFS_KIND_GROUPBY_H: 10002,
  AMGBA_DEFS_ATTR_LEVEL_TOP: 1,
  AMGBA_DEFS_ATTR_TIMEZONE_1H: 1,
  AMGBA_DEFS_ATTR_TIMEZONE_2H: 2,
  AMGBA_DEFS_ATTR_TIMEZONE_30M: 3,
  AMGBA_DEFS_ATTR_SPYMD_YMD: 1,
  AMGBA_DEFS_ATTR_SPYMD_ONLYEX: 2,
  AMGBA_DEFS_ATTR_MEMBATTR_SEX: 1,
  AMGBA_DEFS_ATTR_MEMBATTR_AGE: 2,
  AMGBA_DEFS_ATTR_MEMBATTR_BIRTHDAY: 3,
  AMGBA_DEFS_ATTR_MEMBATTR_F_BIRTHDAY: 4,
  AMGBA_DEFS_ATTR_MEMBATTR_R: 5,
  AMGBA_DEFS_ATTR_MEMBATTR_F: 6,
  AMGBA_DEFS_ATTR_MEMBATTR_M: 7,
  AMGBA_DEFS_ATTR_MEMBATTR_KT: 8,
  AMGBA_DEFS_ATTR_MEMBATTR_ADMSN_DATE: 9,
  AMGBA_DEFS_ATTR_MEMBATTR_ADMSN_STORE: 10,
  AMGBA_DEFS_ATTR_MEMBATTR_LAST_DATE: 11,
  AMGBA_DEFS_ATTR_MEMBATTR_DM_STORE: 12,
  AMGBA_DEFS_ATTR_MEMBATTR_DMPOST: 13,
  AMGBA_DEFS_ATTR_MEMBATTR_DMSTAT: 14,
  AMGBA_DEFS_ATTR_MEMBATTR_TELCONN: 15,
  AMGBA_DEFS_ATTR_MEMBATTR_POINT: 16,
  AMGBA_DEFS_ATTR_MEMBATTR_TOTAL_AM: 17,
  AMGBA_DEFS_ATTR_MEMBATTR_TOTAL_CNT: 18,
  AMGBA_DEFS_ATTR_MEMBATTR_GRANT_POINT: 19,
  AMGBA_DEFS_ATTR_MEMBATTR_USE_POINT: 20,
  AMGBA_DEFS_ATTR_MEMBATTR_BASE_BIRTHDATE: 21,
  AMGBA_DEFS_ATTR_MEMBATTR_BIRTH_MONTH: 22,
  AMGBA_DEFS_ATTR_MEMBATTR_BIRTHSTAT: 23,
  AMGBA_DEFS_ATTR_MEMBATTR_EMAIL_EXIST: 24,
  AMGBA_DEFS_ATTR_MEMBATTR_EMAIL_SEND: 25,
  AMGBA_DEFS_ATTR_MEMBATTR_APL_REG: 26,
  AMGBA_DEFS_ATTR_MEMBATTR_EC_REG: 27,
  AMGBA_DEFS_ATTR_MEMBATTR_BUSIASS: 28,
  AMGBA_DEFS_ATTR_MEMBATTR_UNIV: 29,
  AMGBA_DEFS_ATTR_MEMBATTR_F_TIEUP: 30,
  AMGBA_DEFS_ATTR_MEMBATTR_F_SCHOOL: 31,
  AMGBA_DEFS_ATTR_MEMBATTR_F_SCHOOL_YEAR: 32,
  AMGBA_DEFS_ATTR_MEMBATTR_TIEUP: 33,
  AMGBA_DEFS_ATTR_MEMBATTR_YMTDMSTAT: 34,
  AMGBA_DEFS_ATTR_MEMBATTR_RM: 35,
  AMGBA_DEFS_ATTR_MEMBATTR_MEMBKIND: 36,
  AMGBA_DEFS_ATTR_MEMBBUYING_SALE_AM: 1,
  AMGBA_DEFS_ATTR_MEMBBUYING_SALE_QY: 2,
  AMGBA_DEFS_ATTR_MEMBBUYING_PROF_AM: 3,
  AMGBA_DEFS_ATTR_MEMBBUYING_PROF_AM_RT: 4,
  AMGBA_DEFS_ATTR_MEMBBUYING_COMING_CNT: 5,
  AMGBA_DEFS_ATTR_MEMBBUYING_COMING_DAYS: 6,
  AMGBA_DEFS_ATTR_MEMBBUYING_POINT_USE: 7,
  AMGBA_DEFS_ATTR_STAFFATTR_SEX: 1,
  AMGBA_DEFS_ATTR_STAFFATTR_AGE: 2,
  AMGBA_DEFS_WDAY_HOL: 9,
  AMGBA_DEFS_HOLIDAY_INCLUDE: 1,
  AMGBA_DEFS_HOLIDAY_EXCLUDE: 0,
  AMGBA_DEFS_TIMEZONE_MINLT: 8,
  AMGBA_DEFS_TIMEZONE_MIN: 9,
  AMGBA_DEFS_TIMEZONE_MAX: 22,
  AMGBA_DEFS_TIMEZONE_MAXGT: 23,
  AMGBA_DEFS_SPYMD_ONLY: 1,
  AMGBA_DEFS_SPYMD_EXCLUDE: 2,
  AMGBA_DEFS_MEMBATTR_AGE_MIN: 15,
  AMGBA_DEFS_MEMBATTR_AGE_MAX: 80,
  AMGBA_DEFS_CONDBIT_A: 1,
  AMGBA_DEFS_CONDBIT_FULL: 1,
  AMGBA_DEFS_AXISBIT_V1: 1,
  AMGBA_DEFS_AXISBIT_V2: 2,
  AMGBA_DEFS_AXISBIT_V3: 4,
  AMGBA_DEFS_AXISBIT_H1: 8,
  AMGBA_DEFS_AXISBIT_H2: 16,
  AMGBA_DEFS_AXISBIT_FULL: 31,
  AMGBA_DEFS_SUMBIT_VAL: 1,
  AMGBA_DEFS_SUMBIT_PLANRT: 2,
  AMGBA_DEFS_SUMBIT_PLANDF: 4,
  AMGBA_DEFS_SUMBIT_LYVAL: 8,
  AMGBA_DEFS_SUMBIT_LYRT: 16,
  AMGBA_DEFS_SUMBIT_LYDF: 32,
  AMGBA_DEFS_SUMBIT_LY2VAL: 64,
  AMGBA_DEFS_SUMBIT_LY2RT: 128,
  AMGBA_DEFS_SUMBIT_LY2DF: 256,
  AMGBA_DEFS_SUMBIT_LY3VAL: 512,
  AMGBA_DEFS_SUMBIT_LY3RT: 1024,
  AMGBA_DEFS_SUMBIT_LY3DF: 2048,
  AMGBA_DEFS_SUMBIT_VSUMRT: 4096,
  AMGBA_DEFS_SUMBIT_HSUMRT: 8192,
  AMGBA_DEFS_SUMBIT_SUMRT: 16384,
  AMGBA_DEFS_SUMBIT_VACMRT: 32768,
  AMGBA_DEFS_SUMBIT_HACMRT: 65536,
  AMGBA_DEFS_SUMBIT_SALERT: 131072,
  AMGBA_DEFS_SUMBIT_FULL: 1048575,
  AMGBA_DEFS_ATTRBIT_X: 1,
};

var amgbp_AnaDispItemDefs = {
  AMGBA_DI_T_MASK: 1610612736,
  AMGBA_DI_S_MASK: 520093696,
  AMGBA_DI_G_MASK: 16711680,
  AMGBA_DI_X_MASK: 61440,
  AMGBA_DI_C_MASK: 3072,
  AMGBA_DI_I_MASK: 1023,
  AMGBA_DI_T_DISPITEM: 0,
  AMGBA_DI_T_EXPRITEM: 536870912,
  AMGBA_DI_T_MSTITEM: 1073741824,
  AMGBA_DI_S_VAL: 16777216,
  AMGBA_DI_S_PLANRT: 33554432,
  AMGBA_DI_S_PLANDF: 50331648,
  AMGBA_DI_S_LYRT: 67108864,
  AMGBA_DI_S_LYDF: 83886080,
  AMGBA_DI_S_LYVAL: 100663296,
  AMGBA_DI_S_VSUMRT: 117440512,
  AMGBA_DI_S_HSUMRT: 134217728,
  AMGBA_DI_S_SUMRT: 150994944,
  AMGBA_DI_S_VACMRT: 167772160,
  AMGBA_DI_S_HACMRT: 184549376,
  AMGBA_DI_S_YVAL: 201326592,
  AMGBA_DI_S_LY2RT: 218103808,
  AMGBA_DI_S_LY2DF: 234881024,
  AMGBA_DI_S_LY2VAL: 251658240,
  AMGBA_DI_S_LY3RT: 268435456,
  AMGBA_DI_S_LY3DF: 285212672,
  AMGBA_DI_S_LY3VAL: 301989888,
  AMGBA_DI_S_VACM: 318767104,
  AMGBA_DI_S_HACM: 335544320,
  AMGBA_DI_G_SALE: 65536,
  AMGBA_DI_G_PROF: 131072,
  AMGBA_DI_G_STOCK: 196608,
  AMGBA_DI_G_PRICE: 262144,
  AMGBA_DI_G_RESULT: 327680,
  AMGBA_DI_G_ABC: 393216,
  AMGBA_DI_G_BASKET: 458752,
  AMGBA_DI_G_GAIN: 524288,
  AMGBA_DI_G_STAFF: 589824,
  AMGBA_DI_G_DEFECT: 655360,
  AMGBA_DI_G_BACK: 720896,
  AMGBA_DI_G_ORDER: 786432,
  AMGBA_DI_G_DELIV: 851968,
  AMGBA_DI_G_INVENT: 983040,
  AMGBA_DI_G_NOTAKE: 1048576,
  AMGBA_DI_G_CUSTOMER: 1114112,
  AMGBA_DI_G_ITEMATTR: 1179648,
  AMGBA_DI_G_TRANSOUT: 1245184,
  AMGBA_DI_G_TRANSIN: 1310720,
  AMGBA_DI_G_VENDORSTOCK: 1376256,
  AMGBA_DI_G_ITEMORDER: 1441792,
  AMGBA_DI_G_SUPPORT: 1507328,
  AMGBA_DI_G_EWSSALE: 1572864,
  AMGBA_DI_G_ECSALE: 1638400,
  AMGBA_DI_G_EWSPROF: 1703936,
  AMGBA_DI_G_ECSTOCK: 1769472,
  AMGBA_DI_G_EWSPRICE: 1835008,
  AMGBA_DI_G_EWSCUSTOMER: 1900544,
  AMGBA_DI_G_ECPROF: 1966080,
  AMGBA_DI_G_ECPRICE: 2031616,
  AMGBA_DI_G_ECCUSTOMER: 2097152,
  AMGBA_DI_G_SKTSALE: 2162688,
  AMGBA_DI_G_SKTPROF: 2228224,
  AMGBA_DI_G_CPSALE: 2293760,
  AMGBA_DI_G_WRITEDOWN: 2359296,
  AMGBA_DI_G_LEVELUP: 2424832,
  AMGBA_DI_G_MEMB: 2490368,
  AMGBA_DI_G_MEMB_SALE: 2555904,
  AMGBA_DI_G_MEMB_PROF: 2621440,
  AMGBA_DI_G_COMING: 2686976,
  AMGBA_DI_G_POINT: 3145728,
  AMGBA_DI_G_MEMBIO: 3211264,
  AMGBA_DI_G_ACCOUNTITEM: 3276800,
  AMGBA_DI_G_OTHER: 16711680,
  AMGBA_DI_X_AVERAGE: 4096,
  AMGBA_DI_X_MEDIAN: 8192,
  AMGBA_DI_X_MAX: 12288,
  AMGBA_DI_X_MIN: 16384,
  AMGBA_DI_X_VAR_P: 20480,
  AMGBA_DI_X_STDEV_P: 24576,
  AMGBA_DI_C_VALUE1: 0,
  AMGBA_DI_C_VALUE2: 1024,
  AMGBA_DI_C_RATIO: 2048,
  AMGBA_DI_C_DIFF: 3072,
  AMGBA_DI_I_QY: 1,
  AMGBA_DI_I_QY_RANK: 2,
  AMGBA_DI_I_AM: 3,
  AMGBA_DI_I_AM_RANK: 4,
  AMGBA_DI_I_QY_ACM: 5,
  AMGBA_DI_I_AM_ACM: 6,
  AMGBA_DI_I_QY_PI: 7,
  AMGBA_DI_I_AM_PI: 8,
  AMGBA_DI_I_1PRICE: 9,
  AMGBA_DI_I_PLAN_AM: 10,
  AMGBA_DI_I_1P_AM: 16,
  AMGBA_DI_I_1P_AM_TAX: 17,
  AMGBA_DI_I_1P_QY: 18,
  AMGBA_DI_I_KIND_RT: 19,
  AMGBA_DI_I_PLAN_AM_ACM: 20,
  AMGBA_DI_I_AM_TAX: 21,
  AMGBA_DI_I_S_PRICE: 22,
  AMGBA_DI_I_PROFRT: 23,
  AMGBA_DI_I_AM_TAX_RANK: 24,
  AMGBA_DI_I_QY_VACM: 25,
  AMGBA_DI_I_QY_HACM: 26,
  AMGBA_DI_I_AM_VACM: 27,
  AMGBA_DI_I_AM_HACM: 28,
  AMGBA_DI_I_AM_TAX_VACM: 29,
  AMGBA_DI_I_AM_TAX_HACM: 30,
  AMGBA_DI_I_PLAN_AM_VACM: 31,
  AMGBA_DI_I_PLAN_AM_HACM: 32,
  AMGBA_DI_I_OAM: 33,
  AMGBA_DI_I_OAM_RANK: 34,
  AMGBA_DI_I_SAM: 35,
  AMGBA_DI_I_SAM_RANK: 36,
  AMGBA_DI_I_OAM_TAX: 37,
  AMGBA_DI_I_SAM_TAX: 38,
  AMGBA_DI_I_PLAN_QY: 39,
  AMGBA_DI_I_PLAN_AM_TAX: 40,
  AMGBA_DI_I_PLAN_PROFRT: 41,
  AMGBA_DI_I_QY_YACM: 42,
  AMGBA_DI_I_AM_YACM: 43,
  AMGBA_DI_I_AM_TAX_YACM: 44,
  AMGBA_DI_I_PROFRT_YACM: 45,
  AMGBA_DI_I_QY_P1W: 46,
  AMGBA_DI_I_QY_P2W: 47,
  AMGBA_DI_I_QY_P3W: 48,
  AMGBA_DI_I_OAM_YACM: 49,
  AMGBA_DI_I_OAM_VACM: 50,
  AMGBA_DI_I_OAM_HACM: 51,
  AMGBA_DI_I_AM_TAX_P1W: 52,
  AMGBA_DI_I_AM_TAX_P2W: 53,
  AMGBA_DI_I_AM_TAX_P3W: 54,
  AMGBA_DI_I_AM_P1W: 55,
  AMGBA_DI_I_AM_P2W: 56,
  AMGBA_DI_I_AM_P3W: 57,
  AMGBA_DI_I_DAYS: 58,
  AMGBA_DI_I_AVEDAYSALE: 59,
  AMGBA_DI_I_STORENUM: 60,
  AMGBA_DI_I_JANNUM: 61,
  AMGBA_DI_I_CUSTOMER_QY: 64,
  AMGBA_DI_I_CUSTOMER_UQY: 68,
  AMGBA_DI_I_CUSTOMER_UAM: 69,
  AMGBA_DI_I_MANU_CO_QY: 70,
  AMGBA_DI_I_AUTO_CO_QY: 71,
  AMGBA_DI_I_EWS_CO_QY: 72,
  AMGBA_DI_I_1C_AM: 80,
  AMGBA_DI_I_1C_AM_TAX: 81,
  AMGBA_DI_I_1C_QY: 82,
  AMGBA_DI_I_AVE_SALE_QY: 83,
  AMGBA_DI_I_AVE_SALE_AM: 84,
  AMGBA_DI_I_AVE_SALE_AM_TAX: 85,
  AMGBA_DI_I_AVE_PROF_AM: 86,
  AMGBA_DI_I_AVE_COMING_COUNT: 87,
  AMGBA_DI_I_AVE_SALE_QY_RT: 88,
  AMGBA_DI_I_AVE_SALE_AM_RT: 89,
  AMGBA_DI_I_AVE_SALE_AM_TAX_RT: 90,
  AMGBA_DI_I_AVE_PROF_AM_RT: 91,
  AMGBA_DI_I_AVE_COMING_COUNT_RT: 92,
  AMGBA_DI_I_ABC: 93,
  AMGBA_DI_I_SUPPORT_RT: 95,
  AMGBA_DI_I_SUPPORT_RT_CM: 110,
  AMGBA_DI_I_SUPPORT_RT_VACM: 122,
  AMGBA_DI_I_SUPPORT_RT_CM_VACM: 123,
  AMGBA_DI_I_SUPPORT_RT_RANK: 124,
  AMGBA_DI_I_SUPPORT_RT_CM_RANK: 125,
  AMGBA_DI_I_STOCK_ST_QY: 96,
  AMGBA_DI_I_STOCK_ST_OAM: 97,
  AMGBA_DI_I_STOCK_ED_QY: 98,
  AMGBA_DI_I_STOCK_ED_OAM: 99,
  AMGBA_DI_I_STOCK_PLAN_ED_QY: 100,
  AMGBA_DI_I_STOCK_PLAN_ED_OAM: 101,
  AMGBA_DI_I_STOCK_DAYS: 102,
  AMGBA_DI_I_STOCK_TURN_RT: 103,
  AMGBA_DI_I_STOCK_CROSS_RT: 104,
  AMGBA_DI_I_STOCK_TURN_GROW_RT: 105,
  AMGBA_DI_I_VENDORSTOCK_QY: 106,
  AMGBA_DI_I_VENDORSTOCK_UF_SUM: 107,
  AMGBA_DI_I_STOCK_AVE_QY: 108,
  AMGBA_DI_I_STOCK_AVE_OAM: 109,
  AMGBA_DI_I_PRICE_INIT_OAM: 112,
  AMGBA_DI_I_PRICE_CURR_OAM: 113,
  AMGBA_DI_I_PRICE_INIT_SAM: 114,
  AMGBA_DI_I_PRICE_CURR_SAM: 115,
  AMGBA_DI_I_PRICE_AVE_OAM: 116,
  AMGBA_DI_I_PRICE_AVE_SAM: 117,
  AMGBA_DI_I_PRICE_AVE_STOCK_OAM: 118,
  AMGBA_DI_I_PRICE_AVE_OAM_YACM: 119,
  AMGBA_DI_I_PRICE_AVE_SAM_YACM: 120,
  AMGBA_DI_I_GAIN_RT: 128,
  AMGBA_DI_I_GAIN_PLAN_RT: 129,
  AMGBA_DI_I_ITEMATTR_ITEM_NAME: 130,
  AMGBA_DI_I_ITEMATTR_MAKER_NAME: 131,
  AMGBA_DI_I_ITEMATTR_MAKER_CODE: 132,
  AMGBA_DI_I_ITEMATTR_COLOR_NAME: 133,
  AMGBA_DI_I_ITEMATTR_COST_INIT: 134,
  AMGBA_DI_I_ITEMATTR_COST_CURR: 135,
  AMGBA_DI_I_ITEMATTR_PRICE_INIT: 136,
  AMGBA_DI_I_ITEMATTR_PRICE_CURR: 137,
  AMGBA_DI_I_ITEMATTR_VENDOR_CODE: 138,
  AMGBA_DI_I_ITEMATTR_SIZE_NAME: 139,
  AMGBA_DI_I_ITEMATTR_ITEMTYPE_NAME: 140,
  AMGBA_DI_I_ITEMATTR_SUBCLS1_NAME: 141,
  AMGBA_DI_I_ITEMATTR_SUBCLS2_NAME: 142,
  AMGBA_DI_I_ITEMATTR_STYLE_NAME: 143,
  AMGBA_DI_I_ITEMATTR_MATERIAL_NAME: 146,
  AMGBA_DI_I_ITEMATTR_DESIGN_NAME: 147,
  AMGBA_DI_I_ITEMATTR_BASECOLOR_NAME: 148,
  AMGBA_DI_I_ITEMATTR_COMPLETE_DATE: 149,
  AMGBA_DI_I_ITEMATTR_SALESTART_DATE: 150,
  AMGBA_DI_I_ITEMATTR_SALEEND_DATE: 151,
  AMGBA_DI_I_TRANS_IN_QY: 144,
  AMGBA_DI_I_TRANS_OUT_QY: 145,
  AMGBA_DI_I_INVENT_LOSS_QY: 160,
  AMGBA_DI_I_INVENT_LOSS_AM: 161,
  AMGBA_DI_I_INVENT_LOSS_RT: 162,
  AMGBA_DI_I_NOTAKE_STOCK_QY: 176,
  AMGBA_DI_I_NOTAKE_STOCK_OAM: 177,
  AMGBA_DI_I_NOTAKE_GOOD_QY: 178,
  AMGBA_DI_I_NOTAKE_GOOD_OAM: 179,
  AMGBA_DI_I_NOTAKE_DEFECT_QY: 180,
  AMGBA_DI_I_NOTAKE_DEFECT_OAM: 181,
  AMGBA_DI_I_NOTAKE_OWN_QY: 182,
  AMGBA_DI_I_NOTAKE_OWN_AM: 183,
  AMGBA_DI_I_NOTAKE_OTHER_QY: 184,
  AMGBA_DI_I_NOTAKE_OTHER_AM: 185,
  AMGBA_DI_I_NOTAKE_CHECK_QY: 186,
  AMGBA_DI_I_NOTAKE_CHECK_AM: 187,
  AMGBA_DI_I_NOTAKE_XRAY_QY: 188,
  AMGBA_DI_I_NOTAKE_XRAY_AM: 189,
  AMGBA_DI_I_NOTAKE_REPAIR_QY: 190,
  AMGBA_DI_I_NOTAKE_REPAIR_AM: 191,
  AMGBA_DI_I_NOTAKE_UNKNOWN_QY: 202,
  AMGBA_DI_I_NOTAKE_UNKNOWN_AM: 203,
  AMGBA_DI_I_RESULT_SEASON_AW_QY: 192,
  AMGBA_DI_I_RESULT_SEASON_AW_OAM: 193,
  AMGBA_DI_I_RESULT_SEASON_SS_QY: 194,
  AMGBA_DI_I_RESULT_SEASON_SS_OAM: 195,
  AMGBA_DI_I_RESULT_SEASON_SP_QY: 196,
  AMGBA_DI_I_RESULT_SEASON_SP_OAM: 197,
  AMGBA_DI_I_RESULT_SEASON_AL_QY: 198,
  AMGBA_DI_I_RESULT_SEASON_AL_OAM: 199,
  AMGBA_DI_I_RESULT_AGE_1_QY: 208,
  AMGBA_DI_I_RESULT_AGE_1_OAM: 209,
  AMGBA_DI_I_RESULT_AGE_2_QY: 210,
  AMGBA_DI_I_RESULT_AGE_2_OAM: 211,
  AMGBA_DI_I_RESULT_AGE_3_QY: 212,
  AMGBA_DI_I_RESULT_AGE_3_OAM: 213,
  AMGBA_DI_I_RESULT_AGE_4_QY: 214,
  AMGBA_DI_I_RESULT_AGE_4_OAM: 215,
  AMGBA_DI_I_RESULT_AGE_5_QY: 216,
  AMGBA_DI_I_RESULT_AGE_5_OAM: 217,
  AMGBA_DI_I_BASKET_RCPT_NUM: 240,
  AMGBA_DI_I_BASKET_RCPT1_NUM: 241,
  AMGBA_DI_I_BASKET_RCPT2_NUM: 242,
  AMGBA_DI_I_BASKET_RCPT3_NUM: 243,
  AMGBA_DI_I_BASKET_RT: 244,
  AMGBA_DI_I_BASKET_ITEM1: 245,
  AMGBA_DI_I_BASKET_ITEM2: 246,
  AMGBA_DI_I_BASKET_ITEM1_SALE_QY: 247,
  AMGBA_DI_I_BASKET_ITEM1_SALE_AM: 248,
  AMGBA_DI_I_BASKET_ITEM1_PROFIT_AM: 249,
  AMGBA_DI_I_BASKET_ITEM2_SALE_QY: 250,
  AMGBA_DI_I_BASKET_ITEM2_SALE_AM: 251,
  AMGBA_DI_I_BASKET_ITEM2_PROFIT_AM: 252,
  AMGBA_DI_I_Y_QY: 257,
  AMGBA_DI_I_Y_AM: 258,
  AMGBA_DI_I_T_QY: 259,
  AMGBA_DI_I_T_Y_QY: 260,
  AMGBA_DI_I_T_AM: 261,
  AMGBA_DI_I_T_OAM: 262,
  AMGBA_DI_I_T_Y_AM: 263,
  AMGBA_DI_I_AM_RT: 264,
  AMGBA_DI_I_Y_AM_RT: 265,
  AMGBA_DI_I_T_AM_RT: 266,
  AMGBA_DI_I_T_Y_AM_RT: 267,
  AMGBA_DI_I_AVE_PRICE: 268,
  AMGBA_DI_I_AVE_COST: 269,
  AMGBA_DI_I_T_AVE_PRICE: 270,
  AMGBA_DI_I_T_AVE_COST: 271,
  AMGBA_DI_I_IROTATE_QY_RT: 272,
  AMGBA_DI_I_IROTATE_AM_RT: 273,
  AMGBA_DI_I_COMMODITY_QY: 274,
  AMGBA_DI_I_COMMODITY_AM: 275,
  AMGBA_DI_I_DIGESTION_RT: 276,
  AMGBA_DI_I_WRITEDOWN_ICOST: 277,
  AMGBA_DI_I_WRITEDOWN_IAM: 278,
  AMGBA_DI_I_WRITEDOWN_BCOST: 279,
  AMGBA_DI_I_WRITEDOWN_COST: 280,
  AMGBA_DI_I_WRITEDOWN_COST_DF: 281,
  AMGBA_DI_I_WRITEDOWN_SALE_OAM: 282,
  AMGBA_DI_I_WRITEDOWN_QY: 283,
  AMGBA_DI_I_WRITEDOWN_AM: 284,
  AMGBA_DI_I_WRITEDOWN_TGTNUM: 285,
  AMGBA_DI_I_PRICE_COST1: 287,
  AMGBA_DI_I_PRICE_COST2: 288,
  AMGBA_DI_I_PRICE_INITPRICE: 289,
  AMGBA_DI_I_PRICE_CURRPRICE: 290,
  AMGBA_DI_I_BASE_STOCK_QY: 291,
  AMGBA_DI_I_RESULT_VAL: 292,
  AMGBA_DI_I_PLAN_VAL: 293,
  AMGBA_DI_I_MEMB_ACTIVE: 304,
  AMGBA_DI_I_MEMB_REGNUM: 305,
  AMGBA_DI_I_MEMB_OUTNUM: 306,
  AMGBA_DI_I_MEMB_NUMRT: 307,
  AMGBA_DI_I_MEMB_SHARE: 308,
  AMGBA_DI_I_MEMB_ACTRT: 309,
  AMGBA_DI_I_MEMB_ACTIVE_1DAYS: 310,
  AMGBA_DI_I_AM_MEMBRT: 311,
  AMGBA_DI_I_COMING_COUNT: 312,
  AMGBA_DI_I_COMING_DAYS: 313,
  AMGBA_DI_I_COMING_MEMBRT: 314,
  AMGBA_DI_I_POINT_GRANT: 315,
  AMGBA_DI_I_POINT_USE: 316,
  AMGBA_DI_I_POINT_P_GRANT: 317,
  AMGBA_DI_I_POINT_P_USE: 318,
  AMGBA_DI_I_POINT_D_GRANT: 319,
  AMGBA_DI_I_POINT_D_USE: 320,
  AMGBA_DI_I_COMING_SPAN: 321,
  AMGBA_DI_I_COMING_SPANSUM: 322,
  AMGBA_DI_I_COMING_SPANDEN: 323,
  AMGBA_DI_I_1P_DAYS: 324,
  AMGBA_DI_I_1P_COUNT: 325,
  AMGBA_DI_I_LU_CQY_1_1_51_51: 336,
  AMGBA_DI_I_LU_CQY_1_4_51_54: 337,
  AMGBA_DI_I_LU_CQY_1_5_51_55: 338,
  AMGBA_DI_I_LU_CQY_1_7_51_57: 339,
  AMGBA_DI_I_LU_CQY_1_8_51_58: 340,
  AMGBA_DI_I_LU_CQY_1_22_51_72: 341,
  AMGBA_DI_I_LU_CQY_4_4_54_54: 342,
  AMGBA_DI_I_LU_CQY_4_5_54_55: 343,
  AMGBA_DI_I_LU_CQY_4_8_54_58: 344,
  AMGBA_DI_I_LU_CQY_4_22_54_72: 345,
  AMGBA_DI_I_LU_CQY_5_5_55_55: 346,
  AMGBA_DI_I_LU_CQY_5_7_55_57: 347,
  AMGBA_DI_I_LU_CQY_5_8_55_58: 348,
  AMGBA_DI_I_LU_CQY_5_22_55_72: 349,
  AMGBA_DI_I_LU_CQY_7_7_57_57: 350,
  AMGBA_DI_I_LU_CQY_8_8_58_58: 351,
  AMGBA_DI_I_LU_CQY_1_1_1_51_51_51: 352,
  AMGBA_DI_I_LU_CQY_1_1_4_51_51_54: 353,
  AMGBA_DI_I_LU_CQY_1_1_5_51_51_55: 354,
  AMGBA_DI_I_LU_CQY_1_1_8_51_51_58: 355,
  AMGBA_DI_I_LU_CQY_1_4_8_51_54_58: 356,
  AMGBA_DI_I_LU_CQY_1_5_8_51_55_58: 357,
  AMGBA_DI_I_LU_CQY_LSUITS2BOTTOM: 358,
  AMGBA_DI_I_LU_CQY_LSUITS2: 359,
  AMGBA_DI_I_LU_CQY_LSUITS_LCOAT: 360,
  AMGBA_DI_I_LU_CQY_LSUITS_LFORMAL: 361,
  AMGBA_DI_I_LU_CQY_LSUITS_SUITS: 362,
  AMGBA_DI_I_LU_CQY_LSUITS_FORMAL: 363,
  AMGBA_DI_I_LU_CQY_LFORMAL_SUITS: 364,
  AMGBA_DI_I_LU_CQY_LFORMAL_FORMAL: 365,
  AMGBA_DI_I_LU_DR_LSUITS2BOTTOM: 366,
  AMGBA_DI_I_LU_DR_LSUITS2BOTTOM_M: 367,
  AMGBA_DI_I_LU_DR_LSUITS2BOTTOM_D: 368,
  AMGBA_DI_I_LU_RR_LSUITS2: 369,
  AMGBA_DI_I_LU_RR_LSUITS2_M: 370,
  AMGBA_DI_I_LU_RR_LSUITS2_D: 371,
  AMGBA_DI_I_LU_RR_LCOAT: 372,
  AMGBA_DI_I_LU_RR_LCOAT_M: 373,
  AMGBA_DI_I_LU_RR_LCOAT_D: 374,
  AMGBA_DI_I_LU_RR_LFORMAL: 375,
  AMGBA_DI_I_LU_RR_LFORMAL_M: 376,
  AMGBA_DI_I_LU_RR_LFORMAL_D: 377,
  AMGBA_DI_I_LU_CQY_LSUITS: 378,
  AMGBA_DI_I_LU_ACQY_LSUITS: 379,
  AMGBA_DI_I_LU_AR_LSUITS: 380,
  AMGBA_DI_I_LU_AR_LSUITS_M: 381,
  AMGBA_DI_I_LU_AR_LSUITS_D: 382,
  AMGBA_DI_I_LU_RR_LSUITS3: 383,
  AMGBA_DI_I_LU_RR_LSUITS3_M: 384,
  AMGBA_DI_I_LU_RR_LSUITS3_D: 385,
  AMGBA_DI_I_LU_CQY_LFORMAL_LCOAT: 386,
  AMGBA_DI_I_LU_AR_LFORMAL: 387,
  AMGBA_DI_I_LU_AR_LFORMAL_M: 388,
  AMGBA_DI_I_LU_AR_LFORMAL_D: 389,
  AMGBA_DI_I_LU_AR_LINNER: 390,
  AMGBA_DI_I_LU_AR_LINNER_M: 391,
  AMGBA_DI_I_LU_AR_LINNER_D: 392,
  AMGBA_DI_I_LU_CQY_LINNER3: 393,
  AMGBA_DI_I_LU_AR_PUMPS: 394,
  AMGBA_DI_I_LU_AR_PUMPS_M: 395,
  AMGBA_DI_I_LU_AR_PUMPS_D: 396,
  AMGBA_DI_I_LU_RCQY_SUITS: 397,
  AMGBA_DI_I_LU_RCQY_JK: 398,
  AMGBA_DI_I_LU_CQY_JC3: 399,
  AMGBA_DI_I_LU_RCQY_SL: 400,
  AMGBA_DI_I_LU_RCQY_SL3: 401,
  AMGBA_DI_I_LU_AVEQY_BY: 402,
  AMGBA_DI_I_LU_AQY_SUITS: 403,
  AMGBA_DI_I_LU_AQY_FW: 404,
  AMGBA_DI_I_LU_AQY_JK: 405,
  AMGBA_DI_I_LU_RR_SUITS: 406,
  AMGBA_DI_I_LU_RR_SUITS_M: 407,
  AMGBA_DI_I_LU_RR_SUITS_D: 408,
  AMGBA_DI_I_LU_RR_JK: 409,
  AMGBA_DI_I_LU_RR_JK_M: 410,
  AMGBA_DI_I_LU_RR_JK_D: 411,
  AMGBA_DI_I_LU_DR_JC3: 412,
  AMGBA_DI_I_LU_DR_JC3_M: 413,
  AMGBA_DI_I_LU_DR_JC3_D: 414,
  AMGBA_DI_I_LU_RR_SL: 415,
  AMGBA_DI_I_LU_RR_SL_M: 416,
  AMGBA_DI_I_LU_RR_SL_D: 417,
  AMGBA_DI_I_LU_DR_SL3: 418,
  AMGBA_DI_I_LU_DR_SL3_M: 419,
  AMGBA_DI_I_LU_DR_SL3_D: 420,
  AMGBA_DI_I_LU_AR_SL3: 421,
  AMGBA_DI_I_LU_AR_SL3_M: 422,
  AMGBA_DI_I_LU_AR_SL3_D: 423,
  AMGBA_DI_I_LU_AR_FW: 424,
  AMGBA_DI_I_LU_AR_FW_M: 425,
  AMGBA_DI_I_LU_AR_FW_D: 426,
  AMGBA_DI_I_LU_AR_JK: 427,
  AMGBA_DI_I_LU_AR_JK_M: 428,
  AMGBA_DI_I_LU_AR_JK_D: 429,
  AMGBA_DI_I_LU_AQR_SUITS: 430,
  AMGBA_DI_I_LU_AQR_SUITS_M: 431,
  AMGBA_DI_I_LU_AQR_SUITS_D: 432,
  AMGBA_DI_I_LU_AQR_FW: 433,
  AMGBA_DI_I_LU_AQR_FW_M: 434,
  AMGBA_DI_I_LU_AQR_FW_D: 435,
  AMGBA_DI_I_LU_AQR_JK: 436,
  AMGBA_DI_I_LU_AQR_JK_M: 437,
  AMGBA_DI_I_LU_AQR_JK_D: 438,
  AMGBA_DI_I_LU_AR_EIGHT: 439,
  AMGBA_DI_I_LU_AR_EIGHT_M: 440,
  AMGBA_DI_I_LU_AR_EIGHT_D: 441,
  AMGBA_DI_I_LU_AR_HEART: 442,
  AMGBA_DI_I_LU_AR_HEART_M: 443,
  AMGBA_DI_I_LU_AR_HEART_D: 444,
  AMGBA_DI_I_LU_AR_SPC: 445,
  AMGBA_DI_I_LU_AR_SPC_M: 446,
  AMGBA_DI_I_LU_AR_SPC_D: 447,
  AMGBA_DI_I_LU_CQY_BY3: 448,
  AMGBA_DI_I_LU_CQY_BY5: 449,
  AMGBA_DI_I_LU_DR_BY3: 450,
  AMGBA_DI_I_LU_DR_BY3_M: 451,
  AMGBA_DI_I_LU_DR_BY3_D: 452,
  AMGBA_DI_I_LU_DR_BY5: 453,
  AMGBA_DI_I_LU_DR_BY5_M: 454,
  AMGBA_DI_I_LU_DR_BY5_D: 455,
  AMGBA_DI_I_LU_AR_SHOES: 456,
  AMGBA_DI_I_LU_AR_SHOES_M: 457,
  AMGBA_DI_I_LU_AR_SHOES_D: 458,
  AMGBA_DI_I_LU_RR_FORMAL: 459,
  AMGBA_DI_I_LU_RR_FORMAL_M: 460,
  AMGBA_DI_I_LU_RR_FORMAL_D: 461,
  AMGBA_DI_I_LU_QY_TRADEIN: 462,
  AMGBA_DI_I_LU_CQY_41_41: 463,
  AMGBA_DI_I_LU_CQY_41_44: 464,
  AMGBA_DI_I_LU_CQY_41_45: 465,
  AMGBA_DI_I_LU_CQY_41_47_67: 466,
  AMGBA_DI_I_LU_CQY_41_48: 467,
  AMGBA_DI_I_LU_CQY_41_62: 468,
  AMGBA_DI_I_LU_CQY_44_44: 469,
  AMGBA_DI_I_LU_CQY_44_45: 470,
  AMGBA_DI_I_LU_CQY_44_48: 471,
  AMGBA_DI_I_LU_CQY_44_62: 472,
  AMGBA_DI_I_LU_CQY_45_45: 473,
  AMGBA_DI_I_LU_CQY_45_47_67: 474,
  AMGBA_DI_I_LU_CQY_45_48: 475,
  AMGBA_DI_I_LU_CQY_45_62: 476,
  AMGBA_DI_I_LU_CQY_47_47_67_67: 477,
  AMGBA_DI_I_LU_CQY_48_48: 478,
  AMGBA_DI_I_LU_CQY_41_41_41: 479,
  AMGBA_DI_I_LU_CQY_41_41_44: 480,
  AMGBA_DI_I_LU_CQY_41_41_45: 481,
  AMGBA_DI_I_LU_CQY_41_41_48: 482,
  AMGBA_DI_I_LU_CQY_41_44_48: 483,
  AMGBA_DI_I_LU_CQY_41_44_45: 484,
  AMGBA_DI_I_LU_CQY_41_45_48: 485,
  AMGBA_DI_I_LU_AVEQY_BY_M: 486,
  AMGBA_DI_I_LU_AVEQY_BY_D: 487,
  AMGBA_DI_I_LU_CQY_1_4_5: 488,
};

var amgbp_AnaDispRange = {
  AMGBP_ANA_DISPRANGE_F_MODE_DISP_RANGE: 1,
  AMGBP_ANA_DISPRANGE_F_MODE_DISP_VALUE: 2,
  AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_RANGE: 3,
  AMGBP_ANA_DISPRANGE_F_MODE_PICKUP_VALUE: 4,
  AMGBP_ANA_DISPRANGE_DISP_TYPE_LT: 1,
  AMGBP_ANA_DISPRANGE_DISP_TYPE_LE: 2,
  AMGBP_ANA_DISPRANGE_DISP_TYPE_GT: 3,
  AMGBP_ANA_DISPRANGE_DISP_TYPE_GE: 4,
  AMGBP_ANA_DISPRANGE_DISP_TYPE_EQ: 5,
  AMGBP_ANA_DISPRANGE_DISP_TYPE_NE: 6,
  AMGBP_ANA_DISPRANGE_PICKUP_VALUE_TYPE_HIGH: 1,
  AMGBP_ANA_DISPRANGE_PICKUP_VALUE_TYPE_LOW: 2,
};

var amgbp_AnaGraphReq = {
  CHART_2AXIS: 1,
  CHART_3AXIS: 2,
  CHART_PIE: 5,
  CHART_BAR: 6,
  CHART_LINE: 10,
  CHART_BLOCK: 14,
};

var amgbp_AnaHead = {
  AMGBP_ANA_REQ_F_COMP_NONE: 0,
  AMGBP_ANA_REQ_F_COMP_PERIOD: 1,
  AMGBP_ANA_REQ_F_COMP_STORE: 2,
  AMGBP_ANA_REQ_F_COMP_MEMB: 3,
  AMGBP_ANA_REQ_F_COMP_ITEM: 4,
  AMGBP_ANA_REQ_F_ZEROSUPPRESS_V: 1,
  AMGBP_ANA_REQ_F_ZEROSUPPRESS_H: 2,
  AMGBP_ANA_REQ_F_SUBTOTAL_V: 1,
  AMGBP_ANA_REQ_F_SUBTOTAL_H: 2,
  AMGBP_ANA_REQ_DISP_WAY_V: 1,
  AMGBP_ANA_REQ_DISP_WAY_H: 2,
  AMGBP_ANA_REQ_DISP_WAY_H_DIAGG: 3,
  AMGBP_ANA_REQ_DISP_AMUNIT_1: 1,
  AMGBP_ANA_REQ_DISP_AMUNIT_1000: 2,
  AMGBP_ANA_REQ_DISP_AMUNIT_10000: 3,
  AMGBP_ANA_REQ_DISP_LY_SAMEDAY: 1,
  AMGBP_ANA_REQ_DISP_LY_SAMEWEEK: 2,
  AMGBP_ANA_REQ_EXISTSUM_ON: 1,
  AMGBP_ANA_REQ_EXISTSUM_OFF: 2,
  AMGBP_ANA_REQ_F_SRCHIYMD_TYPE_COM: 1,
  AMGBP_ANA_REQ_F_SRCHIYMD_TYPE_SP: 2,
  AMGBP_ANA_REQ_MEMBCOND_ALL: 1,
  AMGBP_ANA_REQ_MEMBCOND_MEMB: 2,
  AMGBP_ANA_REQ_DISP_SIZESUM_ON: 1,
  AMGBP_ANA_REQ_DISP_SIZESUM_OFF: 2,
};

var amgbp_AnaPeriod = {
  AMGBP_ANA_PERIOD_QTYPE_NON: 0,
  AMGBP_ANA_PERIOD_QTYPE_MONTH: 1,
  AMGBP_ANA_PERIOD_QTYPE_WEEK: 2,
  AMGBP_ANA_PERIOD_QTYPE_DAY: 3,
  AMGBP_ANA_PERIOD_QTYPE_PMONTH: 4,
  AMGBP_ANA_PERIOD_QTYPE_PWEEK: 5,
  AMGBP_ANA_PERIOD_QTYPE_PDAY: 6,
  AMGBP_ANA_PERIOD_TYPE_NON: 0,
  AMGBP_ANA_PERIOD_TYPE_YM: 2,
  AMGBP_ANA_PERIOD_TYPE_YMD: 3,
  AMGBP_ANA_PERIOD_TYPE_YW: 9,
  AMGBP_ANA_PERIOD_TYPE_Y2: 10,
  AMGBP_ANA_PERIOD_TYPE_Y4: 11,
  AMGBP_ANA_PERIOD_TYPE_Y1: 12,
};

var gsdb_defs = {
  GSDB_DEFS_F_GENLIST_STORE: 1,
  GSDB_DEFS_F_GENLIST_ITEM: 2,
  GSDB_DEFS_F_GENLIST_MEMB: 3,
  GSDB_DEFS_F_GENLIST_ADDR: 4,
  GSDB_DEFS_F_GENLIST_MEMB_TMP: 13,
  GSDB_DEFS_HALF_PERIOD_FIRST: 1,
  GSDB_DEFS_HALF_PERIOD_SECOND: 2,
  MTTYPETYPE_F_OPEN: 1,
  MTTYPETYPE_F_LISTUSE: 2,
  MTTYPETYPE_F_PROM: 3,
  MTTYPETYPE_F_DISCNT: 4,
  MTTYPETYPE_F_PROC: 5,
  MTTYPETYPE_F_FUNC: 6,
  MTTYPETYPE_F_KANANAME: 7,
  MTTYPETYPE_F_ITEMGRP: 8,
  MTTYPETYPE_F_ORGLVL: 9,
  MTTYPETYPE_F_ITGRPLVL: 10,
  MTTYPETYPE_F_FOLDER: 11,
  MTTYPETYPE_F_KT: 12,
  MTTYPETYPE_F_LADYS: 13,
  MTTYPETYPE_F_ORDER: 14,
  MTTYPETYPE_F_TELCONNECT: 15,
  MTTYPETYPE_F_SOLIDBASE: 16,
  MTTYPETYPE_F_CUST: 17,
  MTTYPETYPE_F_DMSTAT: 18,
  MTTYPETYPE_F_ADDRLVL: 19,
  MTTYPETYPE_F_ANAKIND: 20,
  MTTYPETYPE_F_BIRTHDAY: 21,
  MTTYPETYPE_F_SEX: 22,
  MTTYPETYPE_F_USESTOP: 23,
  MTTYPETYPE_F_CARDTYPE: 24,
  MTTYPETYPE_F_EMAIL: 28,
  MTTYPETYPE_F_EMAIL_RESIGN: 29,
  MTTYPETYPE_F_EMAIL_SEND: 30,
  MTTYPETYPE_F_POINT: 31,
  MTTYPETYPE_F_WDAY: 32,
  MTTYPETYPE_F_CHANNEL: 33,
  MTTYPETYPE_F_UPD: 34,
  MTTYPETYPE_F_DMPOST: 35,
  MTTYPETYPE_F_ORGFUNC: 36,
  MTTYPETYPE_F_ITGRPFUNC: 37,
  MTTYPETYPE_F_TELNO: 38,
  MTTYPETYPE_F_STOREHQ: 39,
  MTTYPETYPE_F_MARKET: 40,
  MTTYPETYPE_F_SEXAGE: 41,
  MTTYPETYPE_F_SZ_SW: 42,
  MTTYPETYPE_F_SZ_NAME: 43,
  MTTYPETYPE_F_CUSTKARTE: 44,
  MTTYPETYPE_F_DELIVERY: 45,
  MTTYPETYPE_F_PREF: 46,
  MTTYPETYPE_F_NEWMEMB: 47,
  MTTYPETYPE_F_ANACOND: 48,
  MTTYPETYPE_F_PERIOD_TYPE: 49,
  MTTYPETYPE_F_DMPROM: 50,
  MTTYPETYPE_F_POSTING_TRADER: 51,
  MTTYPETYPE_F_DMRFM_RM: 52,
  MTTYPETYPE_F_SZ_BOTTOM: 53,
  MTTYPETYPE_F_SZ_SHIRT: 54,
  MTTYPETYPE_F_SZ_WAIST: 55,
  MTTYPETYPE_F_TIEUP: 56,
  MTTYPETYPE_F_SCHOOL: 57,
  MTTYPETYPE_F_SCHOOL_YEAR: 58,
  MTTYPETYPE_F_YMTDMSTAT: 59,
  MTTYPE_F_OPEN_PRIVATE: 1,
  MTTYPE_F_OPEN_PUBORG: 2,
  MTTYPE_F_OPEN_PUBLIC: 3,
  MTTYPE_F_LISTUSE_DM: 1,
  MTTYPE_F_LISTUSE_MAILMAGA: 2,
  MTTYPE_F_LISTUSE_CUSTANA: 3,
  MTTYPE_F_PROM_DM: 1,
  MTTYPE_F_PROM_FIX: 2,
  MTTYPE_F_PROM_TIEUP: 3,
  MTTYPE_F_PROM_CLOSE: 4,
  MTTYPE_F_PROM_5: 5,
  MTTYPE_F_PROM_6: 6,
  MTTYPE_F_PROM_7: 7,
  MTTYPE_F_PROM_8: 8,
  MTTYPE_F_PROM_9: 9,
  MTTYPE_F_PROC_YET: 1,
  MTTYPE_F_PROC_DONE: 2,
  MTTYPE_F_FUNC_CUST: 1,
  MTTYPE_F_FUNC_ANALYZE: 2,
  MTTYPE_F_KANANAME_FIRST: 1,
  MTTYPE_F_KANANAME_SECOND: 2,
  MTTYPE_F_ITEMGRP_PERSONAL: 1,
  MTTYPE_F_ORGLVL_HD: 1,
  MTTYPE_F_ORGLVL_CORP: 2,
  MTTYPE_F_ORGLVL_BU: 3,
  MTTYPE_F_ORGLVL_ZONE: 4,
  MTTYPE_F_ORGLVL_AREA: 5,
  MTTYPE_F_ORGLVL_STORE: 6,
  MTTYPE_F_ORGLVL_OTHER: 9,
  MTTYPE_F_ITGRPLVL_HD: 1,
  MTTYPE_F_ITGRPLVL_CORP: 2,
  MTTYPE_F_ITGRPLVL_BU: 3,
  MTTYPE_F_ITGRPLVL_BUMON: 4,
  MTTYPE_F_ITGRPLVL_VARIETY: 5,
  MTTYPE_F_ITGRPLVL_ITEM: 6,
  MTTYPE_F_ITGRPLVL_SKUCS: 7,
  MTTYPE_F_ITGRPLVL_OTHER: 9,
  MTTYPE_F_FOLDER_SYS: 1,
  MTTYPE_F_FOLDER_USER: 2,
  MTTYPE_F_TELCONNECT_ON: 1,
  MTTYPE_F_TELCONNECT_OFF: 2,
  MTTYPE_F_SOLIDBASE_REGULAR1: 1,
  MTTYPE_F_SOLIDBASE_REGULAR3: 2,
  MTTYPE_F_SOLIDBASE_CANDIDATE: 3,
  MTTYPE_F_DMSTAT_NON: 1,
  MTTYPE_F_DMSTAT_NG: 2,
  MTTYPE_F_ADDRLVL_PREF: 1,
  MTTYPE_F_ADDRLVL_ADDR1: 2,
  MTTYPE_F_ADDRLVL_ADDR2: 3,
  MTTYPE_F_ADDRLVL_ADDR3: 4,
  MTTYPE_F_ANAKIND_CUST_MATRIX: 1,
  MTTYPE_F_ANAKIND_CUST_ABC: 2,
  MTTYPE_F_ANAKIND_CUST_DECIL: 3,
  MTTYPE_F_ANAKIND_CUST_DMPROMGRP: 4,
  MTTYPE_F_ANAKIND_CUST_DMPROM: 5,
  MTTYPE_F_ANAKIND_CUST_RESPONSE: 6,
  MTTYPE_F_ANAKIND_CUST_SALEMTX: 7,
  MTTYPE_F_ANAKIND_CUST_BUYING: 8,
  MTTYPE_F_BIRTHDAY_REGIST: 1,
  MTTYPE_F_BIRTHDAY_NOREG: 2,
  MTTYPE_F_BIRTHDAY_REJCT: 3,
  MTTYPE_F_SEX_MALE: 1,
  MTTYPE_F_SEX_FEMALE: 2,
  MTTYPE_F_SEX_NON: 3,
  MTTYPE_F_USESTOP_NON: 1,
  MTTYPE_F_USESTOP_REISSUE: 2,
  MTTYPE_F_USESTOP_DELETE: 3,
  MTTYPE_F_CARDTYPE_OLD: 1,
  MTTYPE_F_CARDTYPE_NEW: 2,
  MTTYPE_F_EMAIL_PC: 1,
  MTTYPE_F_EMAIL_MOBILE: 2,
  MTTYPE_F_EMAIL_RESIGN_OFF: 1,
  MTTYPE_F_EMAIL_RESIGN_ON: 2,
  MTTYPE_F_EMAIL_RESIGN_SENDSTOP: 3,
  MTTYPE_F_EMAIL_SEND_OK: 1,
  MTTYPE_F_EMAIL_SEND_NG: 2,
  MTTYPE_F_POINT_11: 11,
  MTTYPE_F_POINT_21: 21,
  MTTYPE_F_POINT_31: 31,
  MTTYPE_F_POINT_32: 32,
  MTTYPE_F_POINT_41: 41,
  MTTYPE_F_POINT_42: 42,
  MTTYPE_F_POINT_61: 61,
  MTTYPE_F_POINT_81: 81,
  MTTYPE_F_WDAY_MON: 1,
  MTTYPE_F_WDAY_TUE: 2,
  MTTYPE_F_WDAY_WED: 3,
  MTTYPE_F_WDAY_THU: 4,
  MTTYPE_F_WDAY_FRI: 5,
  MTTYPE_F_WDAY_SAT: 6,
  MTTYPE_F_WDAY_SUN: 7,
  MTTYPE_F_CHANNEL_POINT: 1,
  MTTYPE_F_CHANNEL_EC: 2,
  MTTYPE_F_CHANNEL_MOBILE: 4,
  MTTYPE_F_UPD_NEW: 1,
  MTTYPE_F_UPD_UPD: 2,
  MTTYPE_F_UPD_DEL: 9,
  MTTYPE_F_DMPOST_OK: 1,
  MTTYPE_F_DMPOST_NG: 2,
  MTTYPE_F_ORGFUNC_BASE: 1,
  MTTYPE_F_ORGFUNC_OTHER: 9,
  MTTYPE_F_ITGRPFUNC_BASE: 1,
  MTTYPE_F_ITGRPFUNC_OTHER: 9,
  MTTYPE_F_TELNO_1: 1,
  MTTYPE_F_TELNO_2: 2,
  MTTYPE_F_KT_ON: 1,
  MTTYPE_F_KT_OFF: 2,
  MTTYPE_F_ORDER_ON: 1,
  MTTYPE_F_ORDER_OFF: 2,
  MTTYPE_F_STOREHQ_STORE: 1,
  MTTYPE_F_STOREHQ_HQ: 2,
  MTTYPE_F_STOREHQ_ADMIN: 9,
  MTTYPE_F_SZ_SW_S: 1,
  MTTYPE_F_SZ_SW_W: 2,
  MTTYPE_F_SZ_SW_NON: 9,
  MTTYPE_F_SZ_NAME_KANJI: 1,
  MTTYPE_F_SZ_NAME_ROMA: 2,
  MTTYPE_F_SZ_NAME_INI: 3,
  MTTYPE_F_SZ_NAME_NON: 9,
  MTTYPE_F_SZ_BOTTOM_BOTTOM: 1,
  MTTYPE_F_SZ_BOTTOM_INSEAM: 2,
  MTTYPE_F_SZ_SHIRT_MINUS: 1,
  MTTYPE_F_SZ_SHIRT_PLUS: 2,
  MTTYPE_F_SZ_SHIRT_NON: 9,
  MTTYPE_F_SZ_WAIST_MINUS: 1,
  MTTYPE_F_SZ_WAIST_PLUS: 2,
  MTTYPE_F_SZ_WAIST_NON: 9,
  MTTYPE_F_CUSTKARTE_ON: 1,
  MTTYPE_F_CUSTKARTE_OFF: 2,
  MTTYPE_F_DELIVERY_YAMATO: 1,
  MTTYPE_F_DELIVERY_HUKUYAMA1: 2,
  MTTYPE_F_DELIVERY_HUKUYAMA2: 3,
  MTTYPE_F_DELIVERY_SEINO: 4,
  MTTYPE_F_DELIVERY_SAGAWA: 5,
  MTTYPE_F_DELIVERY_JPPOST1: 6,
  MTTYPE_F_DELIVERY_JPPOST2: 7,
  MTTYPE_F_PREF_01: 1,
  MTTYPE_F_PREF_02: 2,
  MTTYPE_F_PREF_03: 3,
  MTTYPE_F_PREF_04: 4,
  MTTYPE_F_PREF_05: 5,
  MTTYPE_F_PREF_06: 6,
  MTTYPE_F_PREF_07: 7,
  MTTYPE_F_PREF_08: 8,
  MTTYPE_F_PREF_09: 9,
  MTTYPE_F_PREF_10: 10,
  MTTYPE_F_PREF_11: 11,
  MTTYPE_F_PREF_12: 12,
  MTTYPE_F_PREF_13: 13,
  MTTYPE_F_PREF_14: 14,
  MTTYPE_F_PREF_15: 15,
  MTTYPE_F_PREF_16: 16,
  MTTYPE_F_PREF_17: 17,
  MTTYPE_F_PREF_18: 18,
  MTTYPE_F_PREF_19: 19,
  MTTYPE_F_PREF_20: 20,
  MTTYPE_F_PREF_21: 21,
  MTTYPE_F_PREF_22: 22,
  MTTYPE_F_PREF_23: 23,
  MTTYPE_F_PREF_24: 24,
  MTTYPE_F_PREF_25: 25,
  MTTYPE_F_PREF_26: 26,
  MTTYPE_F_PREF_27: 27,
  MTTYPE_F_PREF_28: 28,
  MTTYPE_F_PREF_29: 29,
  MTTYPE_F_PREF_30: 30,
  MTTYPE_F_PREF_31: 31,
  MTTYPE_F_PREF_32: 32,
  MTTYPE_F_PREF_33: 33,
  MTTYPE_F_PREF_34: 34,
  MTTYPE_F_PREF_35: 35,
  MTTYPE_F_PREF_36: 36,
  MTTYPE_F_PREF_37: 37,
  MTTYPE_F_PREF_38: 38,
  MTTYPE_F_PREF_39: 39,
  MTTYPE_F_PREF_40: 40,
  MTTYPE_F_PREF_41: 41,
  MTTYPE_F_PREF_42: 42,
  MTTYPE_F_PREF_43: 43,
  MTTYPE_F_PREF_44: 44,
  MTTYPE_F_PREF_45: 45,
  MTTYPE_F_PREF_46: 46,
  MTTYPE_F_PREF_47: 47,
  MTTYPE_F_PREF_99: 99,
  MTTYPE_F_NEWMEMB_NEW: 1,
  MTTYPE_F_NEWMEMB_MEMB: 2,
  MTTYPE_F_NEWMEMB_OTHER: 3,
  MTTYPE_F_ANACOND_PERIOD: 1,
  MTTYPE_F_ANACOND_AXIS: 2,
  MTTYPE_F_ANACOND_DISP: 4,
  MTTYPE_F_ANACOND_STORE: 8,
  MTTYPE_F_ANACOND_ITEM: 16,
  MTTYPE_F_ANACOND_MEMB: 32,
  MTTYPE_F_ANACOND_STAFF: 64,
  MTTYPE_F_ANACOND_SALE: 128,
  MTTYPE_F_PERIOD_TYPE_ABS: 1,
  MTTYPE_F_PERIOD_TYPE_OPP: 2,
  MTTYPE_F_POSTING_TRADER_TOYO: 1,
  MTTYPE_F_POSTING_TRADER_KOMATU: 2,
  MTTYPE_F_POSTING_TRADER_DNP: 3,
  MTTYPE_F_TIEUP_NON: 1,
  MTTYPE_F_TIEUP_SCHOOL: 2,
  MTTYPE_F_SCHOOL_UNIV: 1,
  MTTYPE_F_SCHOOL_SHORT: 2,
  MTTYPE_F_SCHOOL_OTHER: 3,
  MTTYPE_F_SCHOOL_YEAR_0: 1,
  MTTYPE_F_SCHOOL_YEAR_1: 2,
  MTTYPE_F_SCHOOL_YEAR_2: 3,
  MTTYPE_F_SCHOOL_YEAR_3: 4,
  MTTYPE_F_SCHOOL_YEAR_4: 5,
  MTTYPE_F_SCHOOL_YEAR_5: 6,
  MTTYPE_F_SCHOOL_YEAR_6: 7,
  MTTYPE_F_SCHOOL_YEAR_7: 8,
  MTTYPE_F_SCHOOL_YEAR_8: 9,
  MTTYPE_F_SCHOOL_YEAR_9: 10,
  MTTYPE_F_YMTDMSTAT_NON: 1,
  MTTYPE_F_YMTDMSTAT_NG: 2,
  MTCDNAME_CNTYPE_STORE: 1,
  MTCDNAME_CNTYPE_AREA: 2,
  MTCDNAME_CNTYPE_ZONE: 3,
  MTITEM_CNTYPE_SUBCLASS1: 2,
  MTITEM_CNTYPE_SUBCLASS2: 3,
  MTITEM_CNTYPE_BRAND: 4,
  MTITEM_CNTYPE_STYLE: 5,
  MTITEM_CNTYPE_DESIGN: 6,
  MTITEM_CNTYPE_MATERIAL: 7,
  MTITEM_CNTYPE_COLOR: 8,
  MTITEM_CNTYPE_T_COLOR: 9,
  MTITEM_CNTYPE_K_SIZE: 10,
  MTITEM_CNTYPE_USE: 11,
  MTITEM_CNTYPE_SEASON: 12,
  MTSTAFF_CNTYPE_SEX: 101,
  MTSTAFF_CNTYPE_FAMILYREL: 102,
  MTSTAFF_CNTYPE_FAMILYLIVES: 103,
  MTSTAFF_CNTYPE_FAMILYSUP: 104,
  MTSTAFF_CNTYPE_CERT: 105,
  MTSTAFF_CNTYPE_CERTNAME: 106,
  MTSTAFF_CNTYPE_PRAISEBLAME: 107,
  MTSTAFF_CNTYPE_LICENCE: 108,
  MTSTAFF_CNTYPE_LICENCE_RESULT: 109,
  MTSTAFF_CNTYPE_TASK_EXTEND: 110,
  MTSTAFF_CNTYPE_TRAINING: 111,
  MTSTAFF_CNTYPE_TRAINING_NAME: 112,
  MTSTAFF_CNTYPE_HOPE_TRANS: 113,
  MTSTAFF_CNTYPE_TRAINING_ESTIMATE: 114,
  MTSTAFF_CNTYPE_JOBPOST: 115,
  MTSTAFF_CNTYPE_MARRIAGE: 116,
  MTSTAFF_CNTYPE_HOUSE: 117,
  MTSTAFF_CNTYPE_TRANS: 118,
  MTSTAFF_CNTYPE_STAFF: 119,
  MTSTAFF_CNTYPE_GRADE: 120,
  MTSTAFF_CNTYPE_BLOOD: 121,
  MTSTAFF_CNTYPE_NEWMID: 122,
  MTSTAFF_CNTYPE_JOIN_COMPANY: 123,
  MTSTAFF_CNTYPE_BUSI: 124,
  MTSTAFF_CNTYPE_HOPE_JOBTYPE: 125,
  MTSTAFF_CNTYPE_PREF: 126,
  MTSTAFF_CNTYPE_CIGARETTE: 127,
  MTSTAFF_CNTYPE_SCHOOL_SYS: 128,
  MTSTAFF_CNTYPE_SCHOOL_KIND: 129,
  MTSTAFF_CNTYPE_SCHOOL_TYPE: 130,
  MTSTAFF_CNTYPE_SINGLE_TRANS: 131,
  MTSTAFF_CNTYPE_BEFORE_JOBCLASS: 132,
  MTSTAFF_CNTYPE_XX1: 133,
  MTSTAFF_CNTYPE_XX2: 134,
  MTSTAFF_CNTYPE_XX3: 135,
  MTSTAFF_CNTYPE_TRANS_KIND: 136,
  MTGENLIST_FILETYPE_IDARRAY: 1,
  MTGENLIST_FILETYPE_IDSET: 2,
};

var aman_se_univ_srch_if = {
  AMAN_PROTO_SORT_KEY_CODE: 1,
  AMAN_PROTO_SORT_KEY_NAME: 2,
  AMAN_PROTO_SORT_KEY_KANA: 3,
};
var aman_se_tieup_srch_if = {
  AMAN_PROTO_SORT_KEY_CODE: 1,
  AMAN_PROTO_SORT_KEY_NAME: 2,
  AMAN_PROTO_SORT_KEY_KANA: 3,
};
var aman_se_busiass_srch_if = {
  AMAN_PROTO_SORT_KEY_CODE: 1,
  AMAN_PROTO_SORT_KEY_NAME: 2,
};
var aman_se_dmprom_srch_if = {
  AMAN_PROTO_SORT_KEY_CODE: 1,
  AMAN_PROTO_SORT_KEY_NAME: 2,
  AMAN_PROTO_SORT_KEY_KANA: 3,
};
var aman_se_posprom_srch_if = {
  AMAN_PROTO_SORT_KEY_CODE: 1,
  AMAN_PROTO_SORT_KEY_NAME: 2,
  AMAN_PROTO_SORT_KEY_KANA: 3,
};
