var myApp = angular.module('myApp', [
  'ngCookies', 'auth0', 'ngRoute', 'authInterceptor'
]);

myApp.run(function ($rootScope, $location, $route, AUTH_EVENTS, $timeout) {
  $rootScope.$on('$routeChangeError', function () {
    var otherwise = $route.routes && $route.routes.null && $route.routes.null.redirectTo;
    // Access denied to a route, redirect to otherwise
    $timeout(function () {
      $location.path(otherwise);
    });
  });
});

function isAuthenticated($q, auth) {
  var deferred = $q.defer();

  auth.loaded.then(function () {
    if (auth.isAuthenticated) {
      deferred.resolve();
    } else {
      deferred.reject();
    }
  });
  return deferred.promise;
}

myApp.factory('customInterceptor', function ($injector, $rootScope, $q) {
  return {
    request: function (config) {
      var auth = $injector.get('auth');
      var targetClientId = 'vYPeq7LGf1utg2dbDlGKCwGKgy94lPH0'; // Another App
      var options = { scope: 'openid' };
      config.headers = config.headers || {};

      // Is this request for the secondary app?
      if (config.url.indexOf('http://localhost:33000') === 0) {
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
    controller: 'RootCtrl',
    /* isAuthenticated will prevent user access to forbidden routes */
    resolve: { isAuthenticated: isAuthenticated }
  })
  .otherwise({ redirectTo: '/login' });

  authProvider.init({
    clientID: 'DyG9nCwIEofSy66QM3oo5xU6NFs3TmvT',
    domain: 'contoso.auth0.com',
    callbackURL: document.location.href
  });

  $httpProvider.interceptors.push('customInterceptor');
});
