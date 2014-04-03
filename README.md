# Auth0 and AngularJS

This AngularJS module will help you implement client-side and server-side (API) authentication. You can use it together with [Auth0](https://www.auth0.com) to add username/password authentication, support for enterprise identity like Active Directory or SAML and also for social identities like Google, Facebook or Salesforce among others to your web, API and mobile native apps.

[Auth0](https://www.auth0.com) is a cloud service that provides a turn-key solution for authentication, authorization and Single Sign On.

# Tutorial

## Client Side Authentication

For this tutorial, you need to create a new account in [Auth0](https://www.auth0.com) and setup a new application. We will then implement client side and server side auth.

1. There are two ways of implementing signin/singup. One is using our [Login Widget](https://docs.auth0.com/login-widget2), which is a complete Login UI ready to use and the other one is using the [JavaScript SDK](https://github.com/auth0/auth0.js) which is just a wrapper to our API so you can build your UI on top.
    ```html
    <!-- login widget -->
    <script src="//cdn.auth0.com/w2/auth0-widget-3.js" type="text/javascript"> </script>
    ```
    _- or -_

    ```html
    <!-- auth0.js and build your own UI -->
    <script src="//cdn.auth0.com/w2/auth0-2.js"></script>
    ```

2.  Add the [Auth0 Angular module](auth0-angular.js):
    ```js
    <script src="https://cdn.auth0.com/w2/auth0-angular-0.js"> </script>
    ```

2. Include the `auth0` and `authInterceptor` modules as dependencies of the app main module:
    ```js
    var app = angular.module('myApp', ['auth0', 'authInterceptor']);
    ```

3. Inject and initiate the `auth` service in the app main config block with your `domain`, `clientID` and `callbackURL` (get them from Auth0 dashboard in the Application settings).
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

4. You can configure three routes for the Authentication flow (or just one and show/hide the login UI, whatever you prefer):
 * `/login`:  The route that will allow the user to input their credentials.
 * `/logout`: The route that the user will follow in order to close its session.
 * `/`:   A route where you are going to display some restricted content.
Add the following router configuration to the `.config` block.

    ```js
    myApp.config(function ($routeProvider, authProvider) {

      ...

      $routeProvider
      .when('/',        { templateUrl: 'views/root.html',     controller: 'RootCtrl'    })
      .when('/logout',  { templateUrl: 'views/logout.html',   controller: 'LogoutCtrl'  })
      .when('/login',   { templateUrl: 'views/login.html',    controller: 'LoginCtrl'   })

      .otherwise({ redirectTo: '/login' });
    });
    ```

  > Note: We are currently using Angular's ngRoute but any other routing library can be used.

5. Inject the `auth` service in your controllers and call the `signin`/`signout` methods.
  ```js
  myApp.controller('LoginCtrl', function ($scope, auth) {
    auth.signin();
  });
  ```

  ```js
  myApp.controller('LogoutCtrl', function ($scope, auth) {
    auth.signout();
  });
  ```

6. Handle the `loginSuccess` and `loginFailed` events from a `run` loop of you module:
```js
  myApp.run(function ($rootScope, $location, $route, AUTH_EVENTS) {
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
      // TODO Handle when login succeeds
      $location.path('/');
    });
    $rootScope.$on(AUTH_EVENTS.loginFailed, function () {
      // TODO Handle when login fails
      $location.path('/login');
    });
  });
```


  > More details about the parameters you can use for the [Auth0 Login Widget](https://docs.auth0.com/login-widget2) and [auth0.js](https://github.com/auth0/auth0.js).

7. Use the `auth.profile` object to show user attributes in the view.
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

## Server Side Authentication

Now that the user was authenticated on the client side, you want to make sure that every time an API is called, the user attributes are sent in a secure way. The `auth` service that you used before also provides a `token` which is a signed [JSON Web Token](http://tools.ietf.org/html/draft-jones-json-web-token). This token can be sent through an HTTP header and the backedn API can validaate it without any extra roundtrip (since the token has been signed with a secret that is shared between the API and Auth0).

1. Add to you application the `authInterceptor` dependency (it's included in the same auth0-angular.js file).

  ```js
  var myApp = angular.module('myApp', [
    'ngCookies', 'ngRoute', 'auth0', 'authInterceptor'
  ]);
  ```

2. Use `$http` from your controller in order to make the request.
  ```js
    $http({method: 'GET', url: '/api/protected'})
      .success(function (data, status, headers, config) {
        // User authenticated, do something with the response
        ...
      })
      .error(function (data, status, headers, config) {
        ...
      });
  ```

  > NOTE: behind the scenes, the `authInterceptor` will add the JSON Web Token to each request. Something like: `config.headers.Authorization = 'Bearer '+ auth.idToken;`


3. If the JSON Web Token (`JWT`) has expired or has been tampered, you can handle that case here:

    ```js
        $rootScope.$on(AUTH_EVENTS.forbidden, function (event, response) {
            // handle the case where the JWT is not valid (401 status code)
            auth.signout();
            $location.path('/login');
        });
    ```
> Note: the JWT expiration can be controlled from the Auth0 dashboard

On the backed you can use any JWT library to validate the token. Here are some:
* [ASP.NET Web API](https://docs.auth0.com/aspnetwebapi-tutorial)
* [Node.js API](https://docs.auth0.com/nodeapi-tutorial)
* [Ruby API](https://docs.auth0.com/rubyapi-tutorial)
* [PHP API](https://docs.auth0.com/phpapi-tutorial)

---

## Bonus tracks

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
      if ( !to || !to.data || !angular.isFunction(to.data.rule)) { return; }
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
    $location.path(otherwise);
  });
});
```


### Custom hash URL prefix
If you are using a custom hash prefix on:

```js
  $locationProvider.hashPrefix('!');
```

You will need to add the following code in order to assure that the callback URL does not break AngularJS `$locationProvider` component:

```js
  yourModule.config(function () {
    // Detect access_token or error in hash URL
    if (window.location.hash.match(/^#access_token/) || window.location.hash.match(/^#error/)) {

      //Append your prefix here
      window.location.hash = '#!' + window.location.hash.substring(1);
    }
  });

```

### Getting delegation tokens
You may want to obtain a token to be used in an application different from the current one:
```js
  var tokenPromise = auth.getToken(targetClientId, options)
    .then(function(token) {
      // Use the token to do a request to that API and add Authorization = 'Bearer ' + token;

    }, function (err) {
      // Handle error fetching application token here

    });
```

### Examples

The following [examples](examples) offer a good starting point for including Auth0 in your AngularJS application:

 * [Custom Login](examples/custom-login): Custom login form that uses Auth0 to authenticate.
 * [Custom Signup](examples/custom-signup): Custom signup plus extra fields added to the user profile on creation.
 * [Widget](examples/widget): A simple angular app doing auth with social and username/password using the Login Widget.
 * [API Authentication](examples/api-authentication): Call your protected API in the technology you want (Java, .NET, [Node.js](examples/api-authentication/nodejs) using Auth0 generated tokens.

Advanced scenarios:
 * [UI Router](examples/ui-router): A full featured example of ui-router with auth0-angular.
 * [Delegation Token](examples/delegation-token): Call two different APIs (with different client ids) from a single Angular App.


![](https://dl.dropboxusercontent.com/u/21665105/angular.gif)

---

## Tests

Install bower dependencies:

```sh
bower i
```

Install karma (test runner):

```sh
npm install -g karma-cli
```

And run by doing:

```sh
karma start
```

By default it runs on PhantomJS but more browsers can be added to the [karma.conf.js](karma.conf.js).

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free account in Auth0

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## License

The MIT License (MIT)

Copyright (c) 2013 AUTH10 LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
