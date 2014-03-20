function executeInConfigBlock(cb, includes) {
  var fakeModule = angular.module('fakeModule', []);
  var modulesToInclude = (includes ? includes : ['auth0-auth']).concat('fakeModule');
  fakeModule.config(cb);

  module.apply(null, modulesToInclude);
}

function initAuth0() {
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
  });

  describe('Interceptor', function () {
    var $http, $httpBackend;

    describe('authInterceptor', function () {

      it('should intercept requests when added to $httpProvider.interceptors', function (done) {
        executeInConfigBlock(function($httpProvider, authProvider, $provide) {
          authProvider.init({
            clientID: 'some-client-id',
            callbackURL: 'some-callback-URL',
            domain: 'hello.auth0.com'
          });
          $httpProvider.interceptors.push('authInterceptor');
          $provide.decorator('auth', function () {
            return {idToken: 'w00t'};
          });
        }, ['authInterceptor']);

        inject(function (_$http_, _$httpBackend_) {
          $httpBackend = _$httpBackend_;
          $http = _$http_;
        });

        $http({url: '/hello'}).then(function (res) {
          expect(res.data).to.be.equal('hello');
          done();
        });
        $httpBackend.expectGET('/hello', function (headers) {
          return headers.Authorization === 'Bearer w00t';
        }).respond(200, 'hello');
        $httpBackend.flush();
      });
    });
  });

  describe('Multiple Clients (runtime)', function () {
    var auth, $httpBackend, $http;
    beforeEach(initAuth0);
    beforeEach(module(function ($provide) {
      $provide.value('Auth0Wrapper', {});
    }));
    inject(function (_auth_, _$httpBackend_, _$http_) {
      $httpBackend = _$httpBackend_;
      auth = _auth_;
      $http = _$http_;
    });

    it.skip('should allow getting a new token on runtime', function () {
      // TODO addToken
      // Change to addToken clientId
      // auth -> tokenManager
      // tokenManger: Token Manager (token store)
    });

    it.skip('should allow delegation token to be handled by the user', function () {
      // Add client returns a promise that contains the emitted delegation token
      // When calling getDelegationToken add it to context
      // Have a cache and check expiration
      auth.getToken('other-app-client-id').then(function (delegationToken) {
        expect(delegationToken).not.to.be.equal(undefined);
        // put token in the interceptor!
      }, function (error) {
        // XXX Token fetch failed!
      });
    });
  });


});
