var auth0 = angular.module('auth0', []);

auth0
.factory('widget', function (DOMAIN, CLIENT_ID, CALLBACK_URL) {
  var auth0Widget = new Auth0Widget({
      domain:                 DOMAIN,
      clientID:               CLIENT_ID,
      callbackURL:            CALLBACK_URL,
      callbackOnLocationHash: true
  });

  return auth0Widget;
})
.directive('a0Widget', function (widget) {
  return {
    restrict: 'AE',
    link: function () {
      widget.signin({container: 'a0-container'});
    },
    template: '<div id="a0-container"></div>'
  };
})
.run(function (widget, $location, $cookies) {
  widget.parseHash(window.location.hash, function (profile, id_token, access_token, state) {
    console.log(access_token);
    $cookies.profile = JSON.stringify(profile);
    $cookies.idToken = id_token;
    $location.path('/main');
  });
})
.factory('auth0RequestInterceptor', function ($cookies) {
  return {
    request: function (config) {
      config.headers = {'Authorization':'Bearer '+ $cookies.idToken};
      return config;
    }
  };
})
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('auth0RequestInterceptor');
});
