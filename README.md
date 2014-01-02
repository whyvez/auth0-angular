# AngularJS + Express + Auth0 Example
This example shows how to setup a basic AngularJS Application that uses Auth0 and Express. 

## How to add Auth0 to you AngularJS Application

Add the following script tag to the index.html of you AngularJS App:
```js
+  <!-- Auth0 Widget dependency -->
+  <script src="//d19p4zemcycm7a.cloudfront.net/w2/auth0-widget-2.3.js" type="text/javascript"> </script>
```

Then make sure to set in the app.js you node.js App credentials correctly by using the SECRET and AUDICENCE constants:
```
var SECRET    = 'YOUR_SECRET';
var AUDIENCE  = 'YOUR_AUDIENCE';
```

Then open auth0.js and set the following constants to you app values:
```js
.constant('DOMAIN', 'your.domain.com')
.constant('CLIENT_ID','YOUR_CLIENT_ID')
.constant('CALLBACK_URL', 'YOUR_CALLBACK_URL')
```

Then, in order to execute the example run:
```
  app.js
```
