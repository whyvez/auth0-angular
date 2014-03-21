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

      inject(function (auth) { expect(auth).to.be.ok; });
    });

    it('should not add authInterceptor to the $httpProvider.interceptors list by default', function (done) {
      var fakeModule = angular.module('fakeModule', []);
      fakeModule.config(function($httpProvider) {
        expect($httpProvider.interceptors).to.be.deep.equal([]);
        done();
      });

      module('auth0', 'fakeModule');

      inject(function ($http) { expect($http).to.be.ok; });
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
          $provide.decorator('auth', function () { return {idToken: 'w00t'}; });
        }, ['authInterceptor']);

        inject(function (_$http_, _$httpBackend_) {
          $httpBackend = _$httpBackend_;
          $http = _$http_;
        });

        $http({url: '/hello'}).then(function (res) {
          expect(res.data).to.be.equal('hello');
        })
        .then(done);
        $httpBackend.expectGET('/hello', function (headers) {
          return headers.Authorization === 'Bearer w00t';
        }).respond(200, 'hello');
        $httpBackend.flush();
      });
    });
  });

  describe('Token store', function () {
    var auth, $rootScope, getDelegationToken, hasTokenExpiredOriginal;

    beforeEach(initAuth0);
    beforeEach(module(function ($provide) {
      var token = [
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9',
        'eyJleHAiOjEzOTQ2OTk4OTIsImlhdCI6MTM5NDY2Mzg5Mn0',
        'X6wKtHdkf06U2XIAUaxx0UXT6EYjNqB3uktJcuxHim4'
      ];
      token = token.join('.');
      getDelegationToken = sinon.stub();
      getDelegationToken.onCall(0).callsArgWith(3, null, {id_token: token});

      $provide.value('auth0Lib', {getDelegationToken: getDelegationToken });
    }));

    beforeEach(inject(function (_auth_, _$rootScope_) {
      auth = _auth_;
      $rootScope = _$rootScope_;
      hasTokenExpiredOriginal = auth.hasTokenExpired;
    }));

    afterEach(function () {
      auth.hasTokenExpired = hasTokenExpiredOriginal;
    });

    it('should get the token using the API on the first time', function (done) {
      auth.getToken('client-id').then(function (token) {
        expect(token).to.be.ok;
      })
      .then(done);

      // Flush the promise!
      $rootScope.$apply();
    });

    it('should retrieve the token from the cache when already loaded', function (done) {
      auth.hasTokenExpired = function () { return false; };
      var oldToken;

      var clientId = 'client-id';

      auth.getToken(clientId)
      .then(function (token) {
        expect(token).to.be.ok;
        oldToken = token;
      })
      .then(function () { return auth.getToken(clientId); })
      .then(function (newToken) {
        expect(newToken).to.be.equal(oldToken);
        expect(getDelegationToken).to.be.ok;
        expect(getDelegationToken.calledOnce).to.be.equal(true);
        expect(getDelegationToken.calledTwice).to.be.equal(false);
      })
      .then(done);

      // Flush the promise!
      $rootScope.$apply();

    });

    it('should refresh the token when the renewal parameter is set', function (done) {
      var oldToken;

      var clientId = 'client-id';

      getDelegationToken.onCall(1).callsArgWith(3, null, {id_token: 'different-token'});

      auth.getToken(clientId).then(function (token) {
        expect(token).to.be.ok;
        oldToken = token;
      })
      .then(function () { return auth.getToken(clientId, undefined, true); })
      .then(function (newToken) {
        expect(newToken).not.to.be.equal(oldToken);
        expect(getDelegationToken).to.be.ok;
        expect(getDelegationToken.calledOnce).to.be.equal(false);
        expect(getDelegationToken.calledTwice).to.be.equal(true);
      })
      .then(done);

      // Flush the promise!
      $rootScope.$apply();
    });

    it('should refresh the token when it has expired', function (done) {
      var expiredToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEzMTQ2OTk4OTIsImlhdCI6MTM5NDY2Mzg5Mn0.edWsCCgMfvWzaio_aa6AHVKTV4vvV1j8v_BrUpDEaLE';
      getDelegationToken.onCall(0).callsArgWith(3, null, {id_token: expiredToken});
      getDelegationToken.onCall(1).callsArgWith(3, null, {id_token: 'different.token.hello'});
      var clientId = 'client-id';
      var oldToken = 'token';

      auth.getToken(clientId).then(function (token) {
        expect(token).to.be.ok;
        oldToken = token;
      })
      .then(function () { return auth.getToken(clientId); })
      .then(function (newToken) {
        expect(newToken).not.to.be.equal(oldToken);
        expect(getDelegationToken).to.be.ok;
        expect(getDelegationToken.calledOnce).to.be.equal(false);
        expect(getDelegationToken.calledTwice).to.be.equal(true);
      })
      .then(done);

      // Flush the promise!
      $rootScope.$apply();
    });

    it('should call reject when token fetch failed', function (done) {
      getDelegationToken.onCall(0).callsArgWith(3, {error: 'An error ocurred'}, null);

      var clientId = 'client-id';

      auth.getToken(clientId).then(null, function (err) {
        expect(err.error).to.be.ok;
      })
      .then(done);

      // Flush the promise!
      $rootScope.$apply();
    });
  });

});
