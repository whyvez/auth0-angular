## 0.0.2

 * Removed promises from signin method. Now the way to handle login is by listening to `AUTH_EVENTS.loginSucces`:
 
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

