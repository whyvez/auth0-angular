# AngularJS + Auth0
This example shows how to add Auth0 to an existing AngularJS Application.

## How to add Auth0 to your AngularJS Application?

First of all, add the following script tag to the index.html of you AngularJS App:
```js
+  <!-- Auth0 Widget dependency -->
+  <script src="//d19p4zemcycm7a.cloudfront.net/w2/auth0-widget-2.3.js" type="text/javascript"> </script>
```

If you haven't done it yet, make sure to set in the app.js you node.js App credentials correctly by using the SECRET and AUDICENCE constants:
```
var SECRET    = 'YOUR_SECRET';
var AUDIENCE  = 'YOUR_AUDIENCE';
```

Then add auth0.js to your poject and include it in your index.html.

You will need to add the ´auth0´ module to your main app:
```js
var myApp = angular.module('myApp', [
  'ngCookies', 'ngRoute', 'auth0'
]);
```

Add the following constants to your app.js file:
```js
.constant('DOMAIN', 'your.domain.com')
.constant('CLIENT_ID','YOUR_CLIENT_ID')
.constant('CALLBACK_URL', 'YOUR_CALLBACK_URL')
```

On your login page view where you want to add Auth0 widget add the `<a0-widget>` tag.

Then, in order to execute the example run:
```
  app.js
```
