## Routing

### Redirect to route if user is not authenticated

If you have multiple routes and you want to control what routes are anonymous, what routes need authentication and even do some custom logic to decide whether or not the user can access a route, read below.

#### UI Router

Add a `data` field to the states you want to restrict with some information of the rule you want to apply:

```js
myApp.config(function($stateProvider, $urlRouterProvider, $httpProvider, authProvider) {
  $urlRouterProvider.otherwise('/login');

  $stateProvider
  .state('logout', { url: '/logout', templateUrl: 'views/logout.html', controller: 'LogoutCtrl' })
  .state('login', { url: '/login', templateUrl: 'views/login.html', controller: 'LoginCtrl' })
  .state('root', { url: '/', templateUrl: 'views/root.html', controller: 'RootCtrl', data: { rule: 'authenticated' } });

});
```

Then, register on the `$stateChangeStart` event and check for that property:

```js
  myApp.run(function ($rootScope, $state, auth, AUTH_EVENTS) {
    $rootScope.$on('$stateChangeStart', function(e, to) {
      if ( !to || !to.data ) { return; }
      var rule = to.data.rule;
  
      if (rule === 'authenticated' && !auth.isAuthenticated) {
        // Stop redirect
        e.preventDefault();
  
        // Send user to login state
        $state.go('login', {});
        return;
      }
  
      $state.go(to, {}, {notify: false});
    });
  });
```

#### ngRoute (Angular default routes)

Angular default routes can be restricted using promises.

Let's create a function that returns a promise that wraps `auth.isAuthenticated`:
```js
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
```

Then, add that function to the `resolve` field of the route we want to restrict:

```js
myApp.config(function ($routeProvider) {
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
});
```

Intercept the `$routeChangeError` event and redirect to the otherwise route:

```js
myApp.run(function ($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function () {
    var otherwise = $route.routes && $route.routes.null && $route.routes.null.redirectTo;
    // Access denied to a route, redirect to otherwise
    $timeout(function () {
      $location.path(otherwise);
    });
  });
});
```
