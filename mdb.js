$(function () {
  var loginURL = 'mdb_login.html';
  var getLoginResponse = function () {
    return JSON.parse(localStorage.getItem('loginResponse'));
  };
  var setLoginResponse = function (response) {
    localStorage.setItem('loginResponse', JSON.stringify(response));
  };
  mdbUtil = {
    loginURL: loginURL,
    logout: function () {
      localStorage.clear();
      clcom.logout(loginURL);
    },
    getLoginResponse: getLoginResponse,
    setLoginResponse: setLoginResponse,
  };
});
