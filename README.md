# Auth0 and AngularJS

This AngularJS module will help you implement client-side and server-side (API) authentication. You can use it together with [Auth0](https://www.auth0.com) to add support for username/password authentication, enterprise identity providers like Active Directory or SAML and also for social identity providers like Google, Facebook or Salesforce among others to your web, API and mobile native apps.

[Auth0](https://www.auth0.com) is a cloud service that provides a turn-key solution for authentication, authorization and Single Sign On.

> **NPM / Bower users**: Find this dependecy as `auth0-angular`. Take into account that you will need to include either auth0-widget.js or auth0.js in order to run the examples using Bower or Auth0 Angular (they can be found as dependencies of this module).

## Tutorials

There are two ways of implementing signin/singup. 
 * [Login Widget](https://docs.auth0.com/login-widget2): A complete Login UI ready to go, that can be customized, translated and expanded. You can check the following getting started guides:
 * [JavaScript SDK](https://github.com/auth0/auth0.js): You can write your own UI from scratch in order to provide a more tailored user experience.

### With the Login Widget

The following guides will help you getting started:

#### User/Password + Social Login with Auth0 Widget (redirect mode)

Authenticate using the [Login Widget](https://docs.auth0.com/login-widget2) and listen to an event. Your angular app will be refreshed when it comes back from Auth0 as opposed to the __popup mode__. 

  → [Read the tutorial](docs/widget-redirect.md)
   
   ![widget_guide](https://cloudup.com/ctj4-5kRNFf+)

#### User/Password + Social Login with Auth0 Widget (popup mode)

Authenticate using the [Login Widget](https://docs.auth0.com/login-widget2) and get back a promise. Your angular app won't refresh because it uses `window.open` popup for social providers and an ajax call for user/password auth).
    
  → [Read the tutorial](docs/widget-popup.md)    
    
   ![widget_popup](https://cloudup.com/cg8u9kVV5Vh+)
    

### With your own UI

#### User/Password Login

Authenticate user/passwords and get back a promise.

  → [Read the tutorial](docs/jssdk.md)
   
   ![basic_guide](https://cloudup.com/cmaeJKX7LEM+)
  
#### Social Login

Authenticate using social providers

  → [Read the tutorial](docs/jssdk.md#social-authentication)
  
   ![popup_guide](https://cloudup.com/cKpVNpR4s9y+)
  
Also, we have an [examples](examples) section that contains comprehensive scenarios.

### Using SSO

You can now use `sso`. If you have multiple Angular apps in different domains, you can have your users be automatically logged in to one of your apps if they're logged in to the another one. It's important that you **DON'T** use `popup` mode with this:

````js
// in the config method
authProvider.init({
  clientID: '1234',
  callbackURL: location.href,
  domain: 'gonto.auth0.com',
  sso: true
});

authProvider.on('loginSuccess', function($location) {
  // This will get called after successful login 
  // and also after successful SSO automatic login
  $location.path('/');
})
````

You can [Check out the example here](https://github.com/auth0/auth0-angular/tree/master/examples/sso)

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
