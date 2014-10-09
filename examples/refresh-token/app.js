angular.module( 'sample', [
  'auth0',
  'ngRoute',
  'sample.home',
  'sample.login',
  'angular-storage',
  'angular-jwt'
])
.config( function myAppConfig ( $routeProvider, authProvider, $httpProvider,
  $locationProvider, jwtInterceptorProvider) {
  $routeProvider
    .when( '/', {
      controller: 'HomeCtrl',
      templateUrl: 'home/home.html',
      pageTitle: 'Homepage',
      requiresLogin: true
    })
    .when( '/login', {
      controller: 'LoginCtrl',
      templateUrl: 'login/login.html',
      pageTitle: 'Login'
    });


  authProvider.init({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    loginUrl: '/login'
  });

  authProvider.on('loginSuccess', function($location, profilePromise, idToken, refreshToken) {
    $location.path('/');
    profilePromise.then(function(profile) {
      store.set('profile', profile);
      store.set('token', idToken);
      store.set('refreshToken', refreshToken);
    });
  });

  authProvider.on('loginFailure', function($log, error) {
    $log('Error logging in', error);
  });

  jwtInterceptorProvider.tokenGetter = function(store, $http, jwtHelper) {
    var idToken = store.get('token');
    var refreshToken = store.get('refreshToken');
    if (jwtHelper.isTokenExpired(idToken)) {
      return auth.refreshIdToken(refreshToken);
    } else {
      return idToken;
    }
  }

  $httpProvider.interceptors.push('jwtInterceptor');
}).run(function($rootScope, auth, store) {
  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        auth.authenticate(store.get('profile'), token);
      }
    }

  });
})
.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$routeChangeSuccess', function(e, nextRoute){
    if ( nextRoute.$$route && angular.isDefined( nextRoute.$$route.pageTitle ) ) {
      $scope.pageTitle = nextRoute.$$route.pageTitle + ' | Auth0 Sample' ;
    }
  });
})

;

