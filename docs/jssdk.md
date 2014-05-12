# Getting Started: Javascript SDK

For this tutorial, you need to create a new account in [Auth0](https://www.auth0.com) and setup a new application. We will then implement client side and server side auth.

1.  Add the following files to your project:
    ```html
    <script src="//code.angularjs.org/1.2.16/angular.min.js"></script>
    <script src="//code.angularjs.org/1.2.16/angular-cookies.min.js"></script>
    <script src="//code.angularjs.org/1.2.16/angular-route.min.js"></script>
    <script src="//cdn.auth0.com/w2/auth0-2.1.js"></script>
    <script src="//cdn.auth0.com/w2/auth0-angular-0.4.js"> </script>
    ```

2. Add module dependencies:
    ```js
    var myApp = angular.module('myApp', ['ngCookies', 'ngRoute', 'auth0']);
    ```

3. Configure routes for the Authentication flow:
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

  > Note: Angular's [default routing library](https://docs.angularjs.org/api/ngRoute/service/$route) is used in this example but [ui-router](https://github.com/angular-ui/ui-router) can be used too.


3. Inject and initiate the `auth` service in the app main config block with your `domain`, `clientID` and `callbackURL` (get them from [Auth0](https://app.auth0.com/#/) dashboard in [Application Settings](https://app.auth0.com/#/applications)).
    ```js
    myApp.config(function ($routeProvider, authProvider) {
      ...
      authProvider.init({ domain: 'yourdomain.auth0.com', clientID: 'YOUR_CLIENT_ID',  callbackURL: 'http://localhost:1337/' });
    });
  ```

4. Inject the `auth` service in your controllers and call the `signin`/`signout` methods. Note that `auth.signin` returns a promise:
  ```js
  myApp.controller('LoginCtrl', function ($scope, auth) {
    $scope.user = '';
    $scope.pass = '';

    $scope.login = function () {
    auth.signin({ username: $scope.user, password: $scope.pass, connection: 'Username-Password-Authentication', scope: 'openid name email' })
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

  Bind the controller to a partial:

  ```html
  <div ng-controller="LoginCtrl">
    <a href="" ng-click="logout()">logout</a>
    <form ng-submit="login()">
      <input type="text" name="user" ng-model="user" />
      <input type="password" name="pass" ng-model="pass" />
      <button type="submit" >submit</button>
    </form>
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
  <div ng-controller="RootCtrl">
    <span>Welcome {{user.name}}!</span>
  </div>
  ```
  
## Social Authentication with Popup

1. Add a link to authenticate using a social provider:
  ```html
  <div ng-controller="LoginCtrl">
    ...
    <a href="" ng-click="socialLogin()">Login with Google</a>
  </div>
  ```

2. Add to the `LoginCtrl` a `socialLogin` method. There, we will specify which connection to use. In this case Google connection:
  ```js
  myApp.controller('LoginCtrl', function ($scope, auth) {
    ...
    $scope.socialLogin = function () {
        auth.signin({connection: 'google-oauth2', scope: 'openid name email', popup: true })
            .then(function () {
                // User logged in successfully with the social provider
                $location.path('/');
            }, function () {
                // Oops something went wrong
                $location.path('/login');
            });
    });
  });
  ```

> Note: the `scope` parameter specify the attributes that will be included in the token. When you call your API with that token, those attributes will be available on server side.

After that, you may want to send requests to your server side. That can be found in the [Server Side Authentication section](backend.md).
