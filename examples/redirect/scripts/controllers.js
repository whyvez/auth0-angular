var myApp = angular.module('myApp');

myApp.controller('MenuCtrl', function ($scope, $location) {
  $scope.go = function (target) {
    $location.path(target);
  };
});

myApp.controller('MsgCtrl', function ($scope, auth) {
  $scope.message = 'loading...';
  auth.loaded.then(function () {
    $scope.message = '';
  });
});

myApp.controller('RootCtrl', function (auth, $scope) {
  $scope.$parent.message = 'Welcome ' + auth.profile.name + '!';
  $scope.auth = auth;
});

myApp.controller('LoginCtrl', function (auth, $scope, $location) {
  $scope.user = '';
  $scope.pass = '';

  function onLoginSuccess() {
    $scope.$parent.message = '';
    $location.path('/');
  }

  function onLoginFailed() {
    $scope.$parent.message = 'invalid credentials';
  }

  $scope.submit = function () {
    $scope.$parent.message = 'loading...';
    $scope.loading = true;

    auth.signin({
      connection: 'Username-Password-Authentication',
      username: $scope.user,
      password: $scope.pass
    }).then(onLoginSuccess, onLoginFailed)
    .finally(function () {
      $scope.loading = false;
    });
  };

  $scope.doGoogleAuthWithRedirect = function () {
    return auth.signin({connection: 'google-oauth2'});
  };

});

myApp.controller('LogoutCtrl', function (auth, $scope, $location) {
  auth.signout();
  $scope.$parent.message = '';
  $location.path('/login');
});
