function executeInConfigBlock(cb) {
  var fakeModule = angular.module('fakeModule', []);
  fakeModule.config(function(_authProvider_) {
    cb(_authProvider_);
  });

  module('auth0', 'fakeModule');
}

function singleClientAuth0ConfigInit() {
  executeInConfigBlock(function (authProvider) {
    authProvider.init({
      domain: 'my-domain.auth0.com',
      clientID: 'my-client-id',
      callbackURL: 'http://localhost/callback'
    });
  });
}

describe('Auth0 Angular', function () {

  describe('init', function () {

    it('should handle a single client', function () {
      executeInConfigBlock(function (authProvider) {
        authProvider.init({
          domain: 'my-domain.auth0.com',
          clientID: 'my-client-id',
          callbackURL: 'http://localhost/callback'
        });
      });

      inject(function (auth) { expect(auth).not.to.be.equal(undefined); });
    });

    it('should not add authInterceptor to the $httpProvider.interceptors list by default', function (done) {
      var fakeModule = angular.module('fakeModule', []);
      fakeModule.config(function($httpProvider) {
        expect($httpProvider.interceptors).to.be.deep.equal([]);
        done();
      });

      module('auth0', 'fakeModule');

      inject(function ($http) { expect($http).not.to.be.equal(undefined); });

    });

    it.skip('should handle multiple clients', function () {
      // TODO On this mode, user won't be able to get the token from clients
      executeInConfigBlock(function (authProvider) {
        authProvider.init({
          domain: 'my-domain.auth0.com',
          clients: [{
            clientID: 'my-client-id',
            urlPattern: 'http://*.hello.com/bye',
            // Default token to use when pattern does not match the others
            main: true
          },{
            clientID: 'other-client',
            // Interceptor will only add use token when URL matches urlPattern.
            // The urls will be matched in the order on the order of hwo the clients were inserted.
            urlPattern: 'http://*.other.com/client'
          }],
          callbackURL: 'http://localhost/callback'
        });
      });

      inject(function (auth) { expect(auth).not.to.be.equal(undefined); });
    });

  });

  describe('Multiple Clients (runtime)', function () {
    var auth, $httpBackend, $http;
    beforeEach(singleClientAuth0ConfigInit);
    beforeEach(module(function ($provide) {
      $provide.value('Auth0Wrapper', {});
    }));
    inject(function (_auth_, _$httpBackend_, _$http_) {
      $httpBackend = _$httpBackend_;
      auth = _auth_;
      $http = _$http_;
    });

    it.skip('should allow adding a new client on runtime', function () {
      // TODO Shall we name this addClient or addApplication?
      // TODO Should CORS be disabled by default?
      // addClient({clientId}, {urlPattern})
      auth.addClient('other-app-client-id', 'http://other/*');
    });

    it.skip('should add token to request that matches a client url pattern', function (done) {
      auth.addClient('other-app-client-id', 'http://other/*');
      $http.post('http://other/resource', 'foo');

      $httpBackend.expectPOST('http://other/resource', 'foo', function (headers) {
        expect(headers.Authorization).not.to.be.equal(undefined);
        expect(headers.Authorization).to.be.equal('Bearer mytoken');

        done();
      }).respond(200, '');

      $httpBackend.flush();
    });

    it.skip('should allow delegation token to be handled by the user', function () {
      // Add client returns a promise that contains the emitted delegation token
      auth.addClient('other-app-client-id', 'http://other/*').then(function (delegationToken) {
        expect(delegationToken).not.to.be.equal(undefined);
      });
    });
  });
});
