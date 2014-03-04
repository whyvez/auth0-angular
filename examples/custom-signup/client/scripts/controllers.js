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

myApp.controller('LoginCtrl', function (auth, $scope, $location, $http) {
  $scope.login =  {user: '', pass: ''};
  $scope.signup = {user: '', pass: '', favColor: 'red'};
  $scope.doLogin = function () {
    auth.signin({
      connection: 'Username-Password-Authentication',
      username:   $scope.user,
      password:   $scope.pass
    }).then(function() {
        $location.path('/');
      }, function(err) {
        alert(err.message || err.error_description);
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
        }).then(function() {
          $location.path('/');
        }, function(err) {
          alert(err.message || err.error_description);
        });
      }
    })
    .error(function (data, status, headers, config) {
      window.alert('Error creating account for user ' + $scope.signup.user + ': '  + data);
    });

  };

});

myApp.controller('LogoutCtrl', function (auth, $scope, $location) {
  auth.signout();
  $location.path('/login');
});
