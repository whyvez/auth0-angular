var myApp = angular.module('myApp', [
  'ngCookies', 'auth0', 'ui.router',  'authInterceptor'
]);

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

myApp.config(function($stateProvider, $urlRouterProvider, $httpProvider, authProvider) {

  // For any unmatched url, redirect to /login
  $urlRouterProvider.otherwise('/login');

  // Now set up the states
  $stateProvider
  .state('logout', {
    url: '/logout',
    templateUrl: 'views/logout.html',
    controller: 'LogoutCtrl'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  })
  .state('root', {
    url: '/',
    templateUrl: 'views/root.html',
    controller: 'RootCtrl',
    resolve: { isAuthenticated: isAuthenticated }
  });

  authProvider.init({
    domain: 'contoso.auth0.com',
    clientID: 'DyG9nCwIEofSy66QM3oo5xU6NFs3TmvT',
    // TODO Set this to your callbackURL, for instance http://localhost:1337/examples/widget/
    callbackURL: document.location.href
  });
  $httpProvider.interceptors.push('authInterceptor');
});

