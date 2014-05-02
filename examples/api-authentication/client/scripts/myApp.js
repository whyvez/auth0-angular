var myApp = angular.module('myApp', [
  'ngCookies', 'auth0', 'ngRoute', 'authInterceptor'
]);

angular.module('myApp').constant('API_ENDPOINT', '/api/protected');

myApp.run(function ($rootScope, $location, $route, AUTH_EVENTS, $timeout) {
  $rootScope.$on('$routeChangeError', function () {
    var otherwise = $route.routes && $route.routes.null && $route.routes.null.redirectTo;
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

  // Set the URL to the popup.html file
  var href = document.location.href;
  var hash = document.location.hash;
  var popupUrl = href.substring(0, href.length - (hash.length + 1)) + '/popup.html';

  authProvider.init({
    domain: 'contoso.auth0.com',
    clientID: 'DyG9nCwIEofSy66QM3oo5xU6NFs3TmvT',
    callbackURL: popupUrl
  });

  // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
  // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might 
  // want to check the delegation-token example
  $httpProvider.interceptors.push('authInterceptor');
});
