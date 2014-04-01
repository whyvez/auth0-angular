var myApp = angular.module('myApp');

myApp.controller('MenuCtrl', function ($scope, $location) {
  $scope.go = function (target) {
    $location.path(target);
  };
});

myApp.controller('RootCtrl', function (auth, $scope) {
  $scope.auth = auth;
});

myApp.controller('LoginCtrl', function (auth, $scope, $cookies, $location) {
  $scope.user = '';
  $scope.pass = '';
      
  $scope.submit = function () {
    auth.signin({
      connection: 'Username-Password-Authentication',
      username: $scope.user,
      password: $scope.pass
    })
      .then(function() {
        $location.path('/');
      }, function(err) {
        alert(err.message || err.error_description);
      });
  };

  $scope.doGoogleAuthWithPopup = function () {
    auth.signin({popup: true, connection: 'google-oauth2'})
      .then(function() {
        $location.path('/');
      }, function(err) {
        alert(err.error || err.message || err.error_description);
      });
  };

  $scope.doGoogleAuthWithRedirect = function () {
    return auth.signin({connection: 'google-oauth2'});
  };
});

myApp.controller('LogoutCtrl', function (auth, $scope, $location) {
  auth.signout();
  $location.path('/login');
});
