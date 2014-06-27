### FAQ

#### I'm setting the `callbackURL` parameter to `https://localhost:3000/#hello` but redirects me to `https://localhost:3000/#access_token=...`. Why?
On redirect mode, when the provider redirects back to the single page application it should send the authentication result. This is done by setting the hash URL with access_token or error. Currently, we are not supporting customization of that URL.

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

### How to obtain delegation tokens?
You can obtain a token to be used in an application different from the current one:
```js
var tokenPromise = auth.getToken(targetClientId, options)
  .then(function(token) {
    // Use the token to do a request to that API and add Authorization = 'Bearer ' + token;
  }, function (err) {
    // Handle error fetching application token here
  });
```

For more information, check the [delegation token](examples/delegation-token) example.


### How to refresh a token?

In order to refresh a token call:
```js
auth.getToken(yourClientId).then(function (newToken) {
// Replace the token with a new one
auth.idToken = newToken;
});
```
