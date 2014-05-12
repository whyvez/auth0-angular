# 0.4.x

## 0.4.0

  * Adding support for Auth0 Widget with popup mode (only social).

# 0.3.x


## 0.3.3

  * Fixed bug on `authInterceptor`: when `$http` request failed it executed `success` instead of `error` callback.

## 0.3.2

  * Adding event AUTH_EVENTS.loginFailed to replace AUTH_EVENTS.loginFailure. From this version, usage of AUTH_EVENTS.loginFailed is deprecated.

## 0.3.1

  * Fixed redirect mode: fixing exception when reloading a page after authentication.

## 0.3.0

  * The default way of showing social connections is by using popup. If you want to use redirect mode, you may want to check the new redirect example.
  * Renamed module `auth0-auth` to be `auth0`. Old `auth0` module is called now `auth0-redirect`.
  * The `auth.loaded` promise, which allows the user to tell whether or not the page has loaded, was added
  * `AUTH_EVENTS.redirectEnded` now is fired always (even after `AUTH_EVENTS.loginSuccess` and `AUTH_EVENTS.loginFailed`).
  * Now `auth.signin` method returns a promise:
    ```js
      auth.signin({connection: 'my-connection'}).then(function () {
        // When user is authenticated
      }, function () {
        // On invalid credentials
      });
    ```
  * Replaced $safeApply with $timeout.

# 0.2.x

## 0.2.0

 * There is only one instance of `auth.profile`. When doing `getProfile` the promise returns `auth.profile` not a new instance.
 * `auth.profile` by default starts as an empty object that will be later populated when the `getProfile` promise is resolved.
 * `authProvider.init` was changed to `authProvider.init(options, [Auth0Constructor]). `Auth0Constructor` is a constructor (function that can be `new`ed) that could be either Auth0 (found in auth0.js) or Auth0Widget (found in auth0-widget). RequireJS users now are able to parametrize the constructor to be used.

# 0.1.x

## 0.1.2

 * Version 1.2.16 of Angular changed the behavior of how `$cookies` handles `$cookies.hello = undefined`. In the past, it erased `hello` but now serializes `undefined` as `"undefined"`. Replacing `$cookies` with `$cookieStore` (which handle serialization) to avoid further problems.
 * Adding error handling when cookie parsing fails so it does not break the library.
 * Updating Angular version to 1.2.16.

## 0.1.1

 * Profile is no longer saved in cookies as, in some cases, it was bigger than the maximum allowed size. Current policy is to store it in memory and each time page reloads fetch it again.
 * Fixed: when login fails the proper error object is sent in the `AUTH_EVENTS.loginFailed` event.
 * Fixing bug that made `getToken` method fail: As `getToken` is not exposed by the widget it should be accessed using the `getClient` method that returns the auth0.js wrapped instance.

## 0.1.0

 * Added `AUTH_EVENTS.redirectEnded` event that is emitted when the callback URL is parsed but it does not contain neither `access_token` nor `error`. On that way, it can be determined whether the redirect ended to execute an action. For example, this is useful with the `AUTH_EVENTS.loginSuccess` and `AUTH_EVENTS.loginFailed` to show a loading page while being redirected.

# 0.0.x

## 0.0.2

 * Removed promises from `signin` method. Now the way to handle login is by listening to `AUTH_EVENTS.loginSuccess`:

   ```js
       $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
        // TODO Handle when login succeeds
        $location.path('/');
       });
   ```
 * Removed `ngRoute` and `route` from auth0-angular.
 * Created a dictionary with the authentication events:

    ```js
      myApp.run(function ($rootScope, AUTH_EVENTS) {
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
          // TODO Handle login success here!
        });
      });
    ```
 * `authInterceptor` must to be added explicitely on the user code. The idea behind this is to prevent leaking the token in CORS requests.

