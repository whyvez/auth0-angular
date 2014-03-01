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
});

myApp.controller('LoginCtrl', function (auth, $rootScope, $scope, $cookies, $location) {
  $scope.user = '';
  $scope.pass = '';
  $scope.submit = function () {
    auth.signin({
      connection: 'Username-Password-Authentication',
      username: $scope.user,
      password: $scope.pass
    }, function (err, profile, id_token, access_token) {
      if (err) return $scope.$broadcast('auth:login-error', err);

      $cookies.profile = JSON.stringify(profile);
      $cookies.idToken = id_token;
      $cookies.accessToken = access_token;
      $location.path('/');
    });
  };

  $scope.$on('auth:login-error', function (event, err) {
    alert(err.message);
  });

  $scope.doGoogleAuth = function () {
    auth.signin({popup: true, connection: 'google-oauth2'});
  };
});

myApp.controller('LogoutCtrl', function (auth, $scope, $location) {
  auth.signout();
  $location.path('/login');
});
