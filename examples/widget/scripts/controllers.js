var myApp = angular.module('myApp');

myApp.controller('MenuCtrl', function ($scope, $location) {
  $scope.go = function (target) {
    $location.path(target);
  };
});

myApp.controller('RootCtrl', function (auth, $scope, $location) {
  if (!auth.isAuthenticated) {
    $location.path('/login');
    return;
  }
  $scope.auth = auth;
});

myApp.controller('LoginCtrl', function (auth) {
  auth.signin();
});

myApp.controller('LogoutCtrl', function (auth, $location) {
  auth.signout();
  $location.path('/login');
});
