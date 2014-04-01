var myApp = angular.module('myApp', [
  'ui.router', 'auth0', 'authInterceptor'
]);

myApp.run(function ($rootScope, $state, auth) {
  $rootScope.$on('auth:redirect-success', function () {
    // TODO Handle when login by redirect succeeds
    $state.go('root');
  });
  $rootScope.$on('auth:redirect-fail', function () {
    // TODO Handle when login by redirect fails
    $state.go('login');
  });
  $rootScope.$on('$stateChangeStart', function(e, to) {
    if ( !to || !to.data || !angular.isFunction(to.data.rule)) {
      return;
    }
    var result = to.data.rule(auth);

    if (!result) {
      e.preventDefault();

      // Optionally set option.notify to false if you don't want 
      // to retrigger another $stateChangeStart event
      $state.go('login', {});
      return;
    }

    $state.go(to, {}, {notify: false});
  });
});

function isAuthenticated(auth) { return auth.isAuthenticated; }

myApp.config(function($stateProvider, $urlRouterProvider, $httpProvider, authProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/login');
  //
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
    data: { rule: isAuthenticated }
  });

  authProvider.init({
    domain: 'contoso.auth0.com',
    clientID: 'DyG9nCwIEofSy66QM3oo5xU6NFs3TmvT',
    // TODO Set this to your callbackURL, for instance http://localhost:1337/examples/widget/
    callbackURL: document.location.href
  });
  $httpProvider.interceptors.push('authInterceptor');
});

