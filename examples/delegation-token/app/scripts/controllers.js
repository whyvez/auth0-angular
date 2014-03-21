var myApp = angular.module('myApp');

myApp.controller('MenuCtrl', function ($scope, $location) {
  $scope.go = function (target) {
    $location.path(target);
  };
});

myApp.controller('RootCtrl', function (auth, $scope, $location, $http) {
  if (!auth.isAuthenticated) {
    $location.path('/login');
    return;
  }

  $scope.auth = auth;

  $scope.sendProtectedMessage = function () {
    $http({method: 'GET', url: '/api/protected'})
      .success(function (data, status, headers, config) {
        $scope.result = 'Protected data was: ' + data;
      });
  };

  $scope.sendProtectedMessageToSecondaryApp = function () {
    $http({method: 'GET', url: 'http://localhost:31337/api/protected'})
    .success(function (data) {
      $scope.result = 'Protected data from secondary app was: ' + data;
    });
  };
});

myApp.controller('LoginCtrl', function (auth, $scope, $cookies, $location) {
  $scope.user = '';
  $scope.pass = '';
      
  $scope.submit = function () {
    auth.signin({
      connection: 'Username-Password-Authentication',
      username: $scope.user,
      password: $scope.pass,
      scope: 'openid profile'
    })
    .then(function() {
      $location.path('/');
    }, function(err) {
      window.alert(err.message || err.error_description);
    });
  };

  $scope.doGoogleAuthWithPopup = function () {
    auth.signin({
      popup: true,
      connection: 'google-oauth2',
      scope: 'openid profile'
    })
      .then(function() {
        $location.path('/');
      }, function(err) {
        window.alert(err.error || err.message || err.error_description);
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
