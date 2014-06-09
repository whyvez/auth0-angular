# Auth0 and AngularJS

This AngularJS module will help you implement client-side and server-side (API) authentication. You can use it together with [Auth0](https://www.auth0.com) to add username/password authentication, support for enterprise identity like Active Directory or SAML and also for social identities like Google, Facebook or Salesforce among others to your web, API and mobile native apps.

[Auth0](https://www.auth0.com) is a cloud service that provides a turn-key solution for authentication, authorization and Single Sign On.

> **NPM / Bower users**: Find this dependecy as `auth0-angular`. Take into account that you will need to include either auth0-widget.js or auth0.js in order to run the examples using Bower or Auth0 Angular (they can be found as dependencies of this module).

### Usage

```js
function onLoginSuccess () { $location.path('/'); }
function onLoginFailure () { $scope.message = 'invalid credentials'; }

$scope.submit = function () {
  var options = { connection: 'my-connection', username: $scope.username,  password: $scope.password, scope: 'openid name email' }; 

  auth.signin(options).then(onLoginSuccess, onLoginFailure);
};

$scope.doGoogleAuthWithPopup = function () {
  var options = { popup: true, connection: 'google-oauth2', scope: 'openid name email' };
  
  auth.signin(options).then(onLoginSuccess, onLoginFailure);
};
```


## Tutorials

There are two ways of implementing signin/singup. One is using our [JavaScript SDK](https://github.com/auth0/auth0.js) which is just a wrapper to our API so you can build your UI on top or the other one is using [Login Widget](https://docs.auth0.com/login-widget2), which is a complete Login UI ready. You can check the following getting started guides:

### With the Login Widget

#### User/Password + Social Login with Auth0 Widget (popup mode)
Authenticate using the [Login Widget](https://docs.auth0.com/login-widget2) and get back a promise. Your angular app won't refresh because it uses `window.open` popup for social providers and an ajax call for user/password auth).
    
   ![widget_popup](https://cloud.githubusercontent.com/assets/419703/2959883/1b7e1d9a-dab7-11e3-8060-bb14b3430e03.gif)

  → [Read the tutorial](docs/widget.md)
    
#### User/Password + Social Login with Auth0 Widget (redirect mode)
Authenticate using the [Login Widget](https://docs.auth0.com/login-widget2) and listen to an event. Your angular app will be refreshed when it comes back from Auth0 as opposed to the __popup mode__.
   
   ![widget_guide](https://cloud.githubusercontent.com/assets/419703/2867712/3580ca60-d23a-11e3-8312-636a309d7af0.gif)
  
   → [Read the tutorial](docs/widget-redirect.md)

### With your own UI

#### User/Password Login
Authenticate user/passwords and get back a promise.
   
   ![basic_guide](https://cloud.githubusercontent.com/assets/419703/2867713/35ac5914-d23a-11e3-91f9-b6365a10137f.gif)

  → [Read the tutorial](docs/jssdk.md)
  
#### Social Login with Popup
Authenticate using social providers and get back a promise.
  
   ![popup_guide](https://cloud.githubusercontent.com/assets/419703/2883025/e09a9158-d495-11e3-814b-32ae41ce1cc6.gif)

  → [Read the tutorial](docs/jssdk.md#social-authentication-with-popup)
  
Also, we have an [examples](examples) section that contains comprehensive scenarios.

## Documentation
 * [Using Redirect Mode](docs/redirect.md) 
 * [Consuming a protected REST API](docs/backend.md)
 * [Advanced Routing Scenarios](docs/routing.md)
 * [Join or Link Accounts](docs/link-accounts.md)
 * [FAQ](docs/faq.md)
 * [jwt.io](http://jwt.io/): Useful for debugging JWT.
 * [Changelog](CHANGELOG.md)


### Development 
 * [How to run auth0-angular tests](docs/testing.md)


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
