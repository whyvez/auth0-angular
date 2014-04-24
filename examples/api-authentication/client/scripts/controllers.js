var myApp = angular.module('myApp');

myApp.controller('MenuCtrl', function ($scope, $location) {
  $scope.go = function (target) {
    $location.path(target);
  };
});

myApp.controller('RootCtrl', function (auth, $scope, $location, $http, API_ENDPOINT) {
  $scope.auth = auth;

  $scope.sendProtectedMessage = function () {
    $http({method: 'GET', url: API_ENDPOINT})
      .success(function (data, status, headers, config) {
        $scope.result = 'Protected data was: ' + data;
      });
  };
});

myApp.controller('LoginCtrl', function (auth, $scope) {
  $scope.user = '';
  $scope.pass = '';
      
  $scope.submit = function () {
    auth.signin({
      connection: 'Username-Password-Authentication',
      username: $scope.user,
      password: $scope.pass,
      scope: 'openid profile'
    });
  };

  $scope.doGoogleAuthWithPopup = function () {
    auth.signin({
      popup: true,
      connection: 'google-oauth2',
      scope: 'openid profile'
    });
  };

  $scope.doGoogleAuthWithRedirect = function () {
    return auth.signin({
      connection: 'google-oauth2',
      scope: 'openid profile'
    });
  };
});

myApp.controller('LogoutCtrl', function (auth, $scope, $location) {
  auth.signout();
  $location.path('/login');
});
