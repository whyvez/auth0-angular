# Auth0 and AngularJS

This AngularJS module will help you implement client-side and server-side (API) authentication. You can use it together with [Auth0](https://www.auth0.com) to add username/password authentication, support for enterprise identity like Active Directory or SAML and also for social identities like Google, Facebook or Salesforce among others to your web, API and mobile native apps.

[Auth0](https://www.auth0.com) is a cloud service that provides a turn-key solution for authentication, authorization and Single Sign On.

> **NPM / Bower users**: Find this dependecy as `auth0-angular`.

### Usage

```js
function onLoginSuccess () { $location.path('/'); }
function onLoginFailure () { $scope.message = 'invalid credentials'; }

$scope.submit = function () {
  var options = { connection: 'my-connection', username: $scope.username,  password: $scope.password }; 

  auth.signin(options).then(onLoginSuccess, onLoginFailure);
};

$scope.doGoogleAuthWithPopup = function () {
  var options = { popup: true, connection: 'google-oauth2' };
  
  auth.signin(options).then(onLoginSuccess, onLoginFailure);
};
```


## Client Side Authentication

There are two ways of implementing signin/singup. One is using our [JavaScript SDK](https://github.com/auth0/auth0.js) which is just a wrapper to our API so you can build your UI on top or the other one is using [Login Widget](https://docs.auth0.com/login-widget2), which is a complete Login UI ready. You can check the following getting started guides:

 * [User/Password Login](docs/jssdk.md)
    
   
   ![basic_guide](https://cloud.githubusercontent.com/assets/419703/2867713/35ac5914-d23a-11e3-91f9-b6365a10137f.gif)
 * [User/Password + Social Login with Auth0 Widget](docs/widget.md)
    
    
   ![widget_guide](https://cloud.githubusercontent.com/assets/419703/2867712/3580ca60-d23a-11e3-8312-636a309d7af0.gif)

 * [Social Login with Popup](docs/jssdk.md#social-authentication-with-popup)
  
   ![popup_guide](https://cloud.githubusercontent.com/assets/419703/2883025/e09a9158-d495-11e3-814b-32ae41ce1cc6.gif)


Also, we have an [examples](examples) section that contains comprehensive scenarios.

## Documentation
 * [Using Redirect Mode](docs/redirect.md) 
 * [Consuming a protected REST API](docs/backend.md)
 * [Advanced Routing Scenarios](docs/routing.md)
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
