var myApp = angular.module('myApp', [
  'ngCookies', 'ngRoute', 'auth0'
]);


// Auth0 Constants
myApp
.constant('DOMAIN',       'your.domain.com')
.constant('CLIENT_ID',    'YOUR_CLIENT_ID')
.constant('CALLBACK_URL', 'YOUR_CALLBACK_URL');

myApp.config(function ($routeProvider) {

  $routeProvider
  .when('/main',    { templateUrl: 'views/main.html',     controller: 'MainCtrl'    })
  .when('/logout',  { templateUrl: 'views/logout.html',   controller: 'LogoutCtrl'  })
  .when('/login',   { templateUrl: 'views/login.html',    controller: 'LoginCtrl'   })

  .otherwise({ redirectTo: '/login' });

});
