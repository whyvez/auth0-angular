var myApp = angular.module('myApp', [
  'ngCookies', 'ngRoute', 'auth0', 'authInterceptor'
]);

myApp.run(function ($rootScope, $location, $route, AUTH_EVENTS) {
  $rootScope.$on('$routeChangeError', function () {
    var otherwise = $route.routes && $route.routes.null && $route.routes.null.redirectTo;
    // Access denied to a route, redirect to otherwise
    $location.path(otherwise);
  });

  $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
    // TODO Handle when login succeeds
    $location.path('/');
  });
  $rootScope.$on(AUTH_EVENTS.loginFailed, function () {
    // TODO Handle when login fails
    $location.path('/login');
  });
});

function isAuthenticated($q, $timeout, auth) {
  var deferred = $q.defer();
  $timeout(function () {
    if (auth.isAuthenticated) {
      deferred.resolve();
    } else {
      deferred.reject();
    }
  }, 0);
  return deferred.promise;
}

myApp.config(function ($routeProvider, authProvider, $httpProvider) {
  $routeProvider
  .when('/logout',  {
    templateUrl: 'views/logout.html',
    controller: 'LogoutCtrl'
  })
  .when('/login',   {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  })
  .when('/', {
    templateUrl: 'views/root.html',
    controller: 'RootCtrl',
    /* isAuthenticated will prevent user access to forbidden routes */
    resolve: { isAuthenticated: isAuthenticated }
  })
  .otherwise({ redirectTo: '/login' });

  authProvider.init({
    domain: 'contoso.auth0.com',
    clientID: 'DyG9nCwIEofSy66QM3oo5xU6NFs3TmvT',
    // TODO Set this to your callbackURL, for instance http://localhost:1337/examples/widget/
    callbackURL: document.location.href
  });
  $httpProvider.interceptors.push('authInterceptor');
});
