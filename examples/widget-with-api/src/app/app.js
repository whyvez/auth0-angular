angular.module( 'sample', [
  'templates-app',
  'auth0',
  'ngRoute',
  'templates-common',
  'sample.home',
  'sample.login'
])

.config( function myAppConfig ( $routeProvider, authProvider, $httpProvider, $locationProvider) {
  $routeProvider
    .when( '/', {
      controller: 'HomeCtrl',
      templateUrl: 'home/home.tpl.html',
      pageTitle: 'Homepage',
      requiresLogin: true
    })
    .when( '/login', {
      controller: 'LoginCtrl',
      templateUrl: 'login/login.tpl.html',
      pageTitle: 'Login'
    });


  authProvider.init({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    callbackURL: lAUTH0_CALLBACK_URL,
    loginUrl: '/login'
  });

  $locationProvider.hashPrefix('!');

  $httpProvider.interceptors.push('authInterceptor');
})
.run(function(auth) {
  auth.hookEvents();
})
.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$routeChangeSuccess', function(e, nextRoute){
    if ( nextRoute.$$route && angular.isDefined( nextRoute.$$route.pageTitle ) ) {
      $scope.pageTitle = nextRoute.$$route.pageTitle + ' | Auth0 Sample' ;
    }
  });
})

;

