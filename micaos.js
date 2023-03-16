$(function () {
  var loginURL = 'micaos_login.html';
  var homeURL = 'micaos_home.html';
  var getLoginResponse = function () {
    return JSON.parse(localStorage.getItem('loginResponse'));
  };
  var setLoginResponse = function (response) {
    localStorage.setItem('loginResponse', JSON.stringify(response));
  };
  micaosUtil = {
    loginURL: loginURL,
    homeURL: homeURL,
    logout: function () {
      localStorage.clear();
      clcom.logout(loginURL);
    },
    getLoginResponse: getLoginResponse,
    setLoginResponse: setLoginResponse,
    openableCustAnaMenu: function () {
      var loginResponse = getLoginResponse();
      return Boolean(loginResponse && loginResponse.f_custana);
    },
    openCustAnaMenu: function () {
      var loginResponse = getLoginResponse();
      clcom.pushPage({
        url:
          clcom.getSysparam('PAR_AMGA_CUST_ANA_URL') +
          (loginResponse
            ? '?' +
              'userCd=' +
              clcom.userInfo.user_code +
              '&' +
              'passwd=' +
              loginResponse.hash
            : ''),
        newWindow: true,
      });
    },
  };
});
