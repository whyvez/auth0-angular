# Getting Started: Redirect Mode

For this tutorial, you need to create a new account in [Auth0](https://www.auth0.com) and setup a new application. We will then implement client side and server side auth.

1.  Add the following files to your project:
    ```html
    <script src="//code.angularjs.org/1.2.16/angular.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="//code.angularjs.org/1.2.16/angular-cookies.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="//code.angularjs.org/1.2.16/angular-route.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="//cdn.auth0.com/w2/auth0-2.0.js"></script>
    <script src="https://cdn.auth0.com/w2/auth0-angular-0.3.js"> </script>
    ```

1. Configure routes for the Authentication flow:
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

2. Add module dependencies:
    ```js
    var app = angular.module('myApp', ['ngCookies', 'auth0-redirect']);
    ```

3. Inject and initiate the `auth` service in the app main config block with your `domain`, `clientID` and `callbackURL` (get them from [Auth0](https://app.auth0.com/#/) dashboard in [Application Settings](https://app.auth0.com/#/applications)).
    ```js
    myApp.config(function ($routeProvider, authProvider) {
      ...
      authProvider.init({
        domain: 'yourdomain.auth0.com',
        clientID: 'YOUR_CLIENT_ID',
        callbackURL: 'http://localhost:1337/'
      });
    });
  ```


4. Inject the `auth` service in your controllers and call the `signin`/`signout` methods.
  ```js
  myApp.controller('LoginCtrl', function ($scope, auth) {
    $scope.user = '';
    $scope.pass = '';


    $scope.logout = function () {
      auth.signout();
      $location.path('/login');
    };

    $scope.login = function () {
      auth.signin({ connection: 'google-oauth2', 
                    scope: 'openid name email picture nickname' });
    };
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
  ```html
  <!-- Include on your view -->
  <div ng-controller="LoginCtrl">
    <a href="" ng-click="auth.login()">click to login</a>
    <a href="" ng-click="auth.logout()">click to logout</a>
  </div>
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

After that, you may want to send requests to your server side. That can be found in the [Server Side Authentication section](backend.md).

