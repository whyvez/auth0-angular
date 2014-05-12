var myApp = angular.module('myApp');

myApp.controller('MenuCtrl', function ($scope, $location, auth) {
  $scope.go = function (target) {
    $location.path(target);
  };

  $scope.login = function () {
    auth.signin({popup: true})
      .then(function () {
        // TODO Handle when login succeeds
        $location.path('/');
      }, function () {
        // TODO Handle when login fails
      });
  };
});

myApp.controller('RootCtrl', function (auth, $scope) {
  $scope.auth = auth;
});

myApp.controller('LoginCtrl', function (auth, $scope) {
  $scope.auth = auth;
});

myApp.controller('LogoutCtrl', function (auth, $location) {
  auth.signout();
  $location.path('/login');
});
