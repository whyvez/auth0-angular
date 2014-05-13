# Getting Started: Widget Redirect

For this tutorial, you need to create a new account in [Auth0](https://www.auth0.com) and setup a new application. We will then implement client side and server side auth.

1.  Add the following dependencies to your project:
    ```html
    <script src="//code.angularjs.org/1.2.16/angular.min.js"></script>
    <script src="//code.angularjs.org/1.2.16/angular-cookies.min.js"></script>
    <script src="//code.angularjs.org/1.2.16/angular-route.min.js"></script>
    <script src="//cdn.auth0.com/w2/auth0-widget-3.1.js"> </script>
    <script src="//cdn.auth0.com/w2/auth0-angular-0.4.js"> </script>
    ```

2. Add module dependencies:
    ```js
    var app = angular.module('myApp', ['ngRoute', 'auth0-redirect']);
    ```

2. Configure routes for the Authentication flow:
    ```js
    myApp.config(function ($routeProvider, authProvider) {
      ...
      $routeProvider
      //  Here where you are going to display some restricted content.
      .when('/',        { templateUrl: 'views/root.html',     controller: 'RootCtrl'    })
      // Where the user will follow in order to close their session.
      .when('/logout',  { templateUrl: 'views/logout.html',   controller: 'LogoutCtrl'  })
      // Where the user will input their credentials.
      .when('/login',   { templateUrl: 'views/login.html',    controller: 'LoginCtrl'   })

      .otherwise({ redirectTo: '/login' });
    });
    ```

  > Note: Angular's [default routing library](https://docs.angularjs.org/api/ngRoute/service/$route) is used in this example but [ui-router](https://github.com/angular-ui/ui-router) can be used too. Check [auth0-angular ui-router example](https://github.com/auth0/auth0-angular/tree/master/examples/ui-router).

3. Inject and initiate the `auth` service in the app main config block with your `domain`, `clientID` and `callbackURL` (get them from [Auth0](https://app.auth0.com/#/) dashboard in [Application Settings](https://app.auth0.com/#/applications)).
    ```js
    myApp.config(function ($routeProvider, authProvider) {
      ...
      authProvider.init({ domain: 'yourdomain.auth0.com', clientID: 'YOUR_CLIENT_ID', callbackURL: 'http://localhost:1337/'
      });
    });
  ```

4. Inject the `auth` service in your controllers and call the `signin`/`signout` methods.
  ```js
  myApp.controller('LogoutCtrl', function ($scope, auth) {
    auth.signout();
    $location.path('/login');
  });
  ```

  You will need to handle `AUTH_EVENTS.loginSuccess` and `AUTH_EVENTS.loginFailure` events as each time the user logs in the page is reloaded and the state is lost:
    ```js
    myApp.run(function ($rootScope, $location, AUTH_EVENTS, $timeout) {
      $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
        // TODO Handle when login succeeds
        $location.path('/');
      });
      $rootScope.$on(AUTH_EVENTS.loginFailure, function () {
        // TODO Handle when login fails
        window.alert('login failed');
      });
    });
    ```
  ```js
  myApp.controller('LoginCtrl', function (auth, $scope) {
    $scope.auth = auth;
  });
  ```
  ```html
  <!-- Include this on your index.html -->
  <a href="" ng-controller="LoginCtrl" ng-click="auth.signin({scope: 'openid name email'})">click to login</a>
  ```

6. Use the `auth.profile` object to show user attributes in the view.
  ```js
  myApp.controller('RootCtrl', function ($scope, $location, $http, auth) {
    if (!auth.isAuthenticated) {
      // Reject the user
      $location.path('/login');
      return;
    }


    // User is logged in at this point
    ...

    $scope.user = auth.profile;
  };
  ```
  The template of that controller will be:
  ```html
  <div>
    <br />
    <span>Welcome {{user.name}}!</span>
  </div>
  ```

> More details about the parameters you can use for the [Auth0 Login Widget](https://docs.auth0.com/login-widget2) and [auth0.js](https://github.com/auth0/auth0.js).

After that, you may want to send requests to your server side. That can be found in the [Server Side Authentication section](backend.md).

