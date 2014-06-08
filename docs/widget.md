# Getting Started: Widget

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
    var app = angular.module('myApp', ['ngRoute', 'auth0']);
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

4. Inject the `auth` service in your controllers and call the `signin`/`signout` methods. Note that `auth.signin` returns a promise:
  ```js
  myApp.controller('LoginCtrl', function ($scope, auth) {
    $scope.user = '';
    $scope.pass = '';

    $scope.login = function () {
    auth.signin({ popup: true, scope: 'openid name email' })
    .then(function () {
        // User logged in successfully
        $location.path('/');
      }, function (err) {
        // Oops something went wrong
        window.alert('Oops, invalid credentials');
        $location.path('/login');
      });
    };
    $scope.logout = function () {
      auth.signout();
      $location.path('/login');
    };
  });
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
  <div ng-controller="RootCtrl">
    <span>Welcome {{user.name}}!</span>
  </div>
  ```
  

> Note: the `scope` parameter specify the attributes that will be included in the token. When you call your API with that token, those attributes will be available on server side.

> More details about the parameters you can use for the [Auth0 Login Widget](https://docs.auth0.com/login-widget2) and [auth0.js](https://github.com/auth0/auth0.js).

After that, you may want to send requests to your server side. That can be found in the [Server Side Authentication section](backend.md).


