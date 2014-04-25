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

myApp.controller('LoginCtrl', function (auth, $scope, $location, $http) {
  $scope.user = '';
  $scope.pass = '';

  function onLoginSuccess() {
    $scope.$parent.message = '';
    $location.path('/');
  }

  function onLoginFailed() {
    $scope.$parent.message = 'invalid credentials';
  }

  $scope.signup = {user: '', pass: '', favColor: 'red'};
  $scope.doLogin = function () {
    $scope.$parent.message = 'loading...';
    $scope.loading = true;

    auth.signin({
      connection: 'Username-Password-Authentication',
      username:   $scope.user,
      password:   $scope.pass
    })
    .then(onLoginSuccess, onLoginFailed)
    .finally(function () {
      $scope.loading = false;
    });
  };

  $scope.doSignup = function () {
    $http({method: 'POST', url: '/custom-signup',
    data: {
      email:    $scope.signup.user,
      password:     $scope.signup.pass,
      favColor: $scope.signup.favColor
    }})
    .success(function (data, status, headers, config) {
      if (status === 200) {
        auth.signin({
          // Make sure that connection matches your server-side connection id
          connection: 'Username-Password-Authentication',
          username:   $scope.signup.user,
          password:   $scope.signup.pass
        })
        .then(onLoginSuccess, onLoginFailed)
        .finally(function () {
          $scope.loading = false;
        });
      }
    })
    .error(function (data, status, headers, config) {
      $scope.$parent.message = 'Error creating account for user ' + $scope.signup.user + ': '  + data;
    });
  };
});

myApp.controller('LogoutCtrl', function (auth, $scope, $location) {
  auth.signout();
  $scope.$parent.message = '';
  $location.path('/login');
});
