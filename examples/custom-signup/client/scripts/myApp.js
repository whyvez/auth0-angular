var myApp = angular.module('myApp', [
  'ngCookies', 'ngRoute', 'auth0', 'authInterceptor'
]);

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
    domain: 'contoso.auth0.com',
    clientID: 'DyG9nCwIEofSy66QM3oo5xU6NFs3TmvT',
    // TODO set your own callbackURL, for instance http://localhost:1337/
    callbackURL: document.location.href,
    callbackOnLocationHash: true
  });

  $httpProvider.interceptors.push('authInterceptor');
});
