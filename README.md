# Auth0 and AngularJS

[Auth0](https://www.auth0.com) is a cloud service that provides a turn-key solution for authentication, authorization and Single Sign On. This [AngularJS](https://angularjs.org/‎) module will help you implement client-side and server-side (API) authentication. You can use it to:

* Authenticate with [multiple identity providers](https://docs.auth0.com/identityproviders) like **Google**, **Facebook**, **Twitter**, **LinkedIn**, **Microsoft Account**,  **GitHub**,  **Box**, **Salesforce**, among others; or enterprise identity systems like **Windows Azure AD**, **Google Apps**, **Active Directory**, **ADFS** or any **SAML Identity Provider**.
* Authenticate through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).


## Client Side Authentication

There are two ways of implementing signin/singup. One is using our [JavaScript SDK](https://github.com/auth0/auth0.js) which is just a wrapper to our API so you can build your UI on top or the other one is using [Login Widget](https://docs.auth0.com/login-widget2), which is a complete Login UI ready. You can check the following getting started guides:

 * [Getting Started: Javascript SDK](docs/jssdk.md)
 * [Getting Started: Login Widget](docs/widget.md)


## Examples

The following [examples](examples) offer a good starting point for including Auth0 in your AngularJS application:

 * [Custom Login](examples/custom-login): Custom login form that uses Auth0 to authenticate.
 * [Custom Signup](examples/custom-signup): Custom signup plus extra fields added to the user profile on creation.
 * [Widget](examples/widget): A simple angular app doing auth with social and username/password using the Login Widget.
 * [API Authentication](examples/api-authentication): Call your protected API in the technology you want (Java, .NET, [Node.js](examples/api-authentication/nodejs) using Auth0 generated tokens.

Advanced scenarios:
 * [UI Router](examples/ui-router): A full featured example of ui-router with auth0-angular.
 * [Delegation Token](examples/delegation-token): Call two different APIs (with different client ids) from a single Angular App.
 * [RequireJS](examples/requirejs): An example of how to integrate auth0-angular with RequireJS.


## Create a free account in Auth0

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.
