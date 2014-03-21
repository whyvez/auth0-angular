var myApp = angular.module('myApp', [
  'ngCookies', 'ngRoute', 'auth0', 'authInterceptor'
]);

myApp.factory('customInterceptor', function (auth, $rootScope, $q) {
  return {
    request: function (config) {
      var targetClientId = 'vYPeq7LGf1utg2dbDlGKCwGKgy94lPH0'; // Another App
      var options = { scope: 'openid' };
      config.headers = config.headers || {};

      // Is this request for the secondary app?
      if (config.url.indexOf('http://localhost:31337') === 0) {
        // Then fetch the secondary app token
        var tokenPromise = auth.getToken(targetClientId, options)
          .then(function(token) {
            config.headers.Authorization = 'Bearer ' + token;
            return config;
          }, function (err) {
            // Handle error fetching token here
            return err;
          });
        return $q.when(tokenPromise);
      } else {
        if (auth.idToken) {
          config.headers.Authorization = 'Bearer ' + auth.idToken;
        }
        return config;
      }
    },
    responseError: function (response) {
      // handle the case where the user is not authenticated
      if (response.status === 401) {
        $rootScope.$broadcast('auth:forbidden', response);
      }
      return response || $q.when(response);
    }
  };
});

myApp.config(function ($routeProvider, authProvider, $httpProvider) {
  $routeProvider
  .when('/logout',  {
    templateUrl: 'views/logout.html',
    controller: 'LogoutCtrl'
  })
  .when('/login',   {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl',
  })
  .when('/', {
    templateUrl: 'views/root.html',
    controller: 'RootCtrl'
  })
  .otherwise({ redirectTo: '/login' });

  authProvider.init({
    clientID: 'DyG9nCwIEofSy66QM3oo5xU6NFs3TmvT',
    domain: 'contoso.auth0.com',
    callbackURL: document.location.href
  });

  $httpProvider.interceptors.push('customInterceptor');
});
