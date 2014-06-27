function executeInConfigBlock(cb, includes) {
  var fakeModule = angular.module('fakeModule', []);
  var modulesToInclude = (includes ? includes : ['auth0']).concat('fakeModule');
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

    it('should allow passing a different constructor', function () {

      var MyAuth0Constructor = function () {
        this.getProfile = function () {};
      };
      executeInConfigBlock(function (authProvider) {
        authProvider.init({
          domain: 'my-domain.auth0.com',
          clientId: 'my-client-id',
          callbackURL: 'http://localhost/callback'
        }, MyAuth0Constructor);
      });

      inject(function (auth, auth0Lib) {
        expect(auth).to.be.ok;
        expect(auth0Lib.constructor).to.be.equal(MyAuth0Constructor);
      });
    });
  });

  describe('auth.profile and getProfile', function () {
    var auth, $rootScope, $timeout;

    beforeEach(initAuth0);
    beforeEach(module(function ($provide) {
      var getProfile = sinon.stub();
      getProfile.onCall(0).callsArgWith(1, null, {foo: 'bar', one: {two: {three: 'baz'}}});
      getProfile.onCall(1).callsArgWith(1, null, {foo: 'bar', one: {two: {three: 'baz'}}});

      $provide.value('auth0Lib', {getProfile: getProfile});
    }));
    beforeEach(inject(function (_auth_, _$rootScope_, _$timeout_) {
      auth = _auth_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    }));

    it('auth.profile should never be null or undefined', function () {
      expect(auth.profile).to.be.ok;
    });
    it('auth.profile and getProfile should return the same reference', function (done) {
      expect(auth.profile).to.be.ok;

      auth.getProfile('id-token').then(function (newProfile) {
        expect(auth.profile).to.be.equal(newProfile);
        expect(auth.profile.foo).to.be.equal('bar');
        expect(auth.profile.one.two.three).to.be.equal('baz');
      })
      .then(done);
      $timeout.flush();
    });
    it('all auth.profile fields should be cleaned on getProfile', function (done) {
      auth.profile.hello = 'yes';
      auth.getProfile('id-token').then(function () {
        expect(auth.profile.hello).not.to.be.ok;
        expect(auth.profile.foo).to.be.equal('bar');
        expect(auth.profile.one.two.three).to.be.equal('baz');
      })
      .then(done);
      $timeout.flush();
    });
  });

  describe('signout', function () {
    var auth, $rootScope, $timeout;

    beforeEach(initAuth0);

    beforeEach(inject(function (_auth_, _$rootScope_, _$timeout_) {
      auth = _auth_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    }));

    it('should clean all the values and flags from profile and delegatedTokens', function () {
      // Pre-checks
      expect(auth.profile).to.be.ok;
      expect(auth.delegatedTokens).to.be.ok;

      expect(auth.isAuthenticated).to.be.equal(false);
      expect(auth.idToken).not.to.exist;
      expect(auth.accessToken).not.to.exist;

      // Arrange
      var profile = auth.profile;
      var delegatedTokens = auth.delegatedTokens;
      auth.profile.name = 'Tim';
      auth.profile.likes = 'Bananas';
      auth.delegatedTokens['some-client-id'] = 'some-superpower-token';
      auth.isAuthenticated = true;
      auth.idToken = 'some-jwt-token';
      auth.accessToken = 'some-access-token';

      // Action signout
      auth.signout();

      // Expect objects to be the same
      expect(profile).to.be.equal(auth.profile);
      expect(delegatedTokens).to.be.equal(auth.delegatedTokens);

      // ... and also to be clean
      expect(Object.keys(auth.profile).length).to.be.equal(0);
      expect(Object.keys(auth.delegatedTokens).length).to.be.equal(0);

      // ... and flags to be reset
      expect(auth.isAuthenticated).to.be.equal(false);
      expect(auth.idToken).not.to.exist;
      expect(auth.accessToken).not.to.exist;

    });
  });

  describe('Interceptor', function () {
    var $http, $httpBackend, $rootScope;

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

        $http({url: '/hello'}).success(function (data) {
          expect(data).to.be.equal('hello');
          done();
        });
        $httpBackend.expectGET('/hello', function (headers) {
          return headers.Authorization === 'Bearer w00t';
        }).respond(200, 'hello');
        $httpBackend.flush();
      });

      it('should intercept requests failing requests', function (done) {
        var AUTH_EVENTS;

        executeInConfigBlock(function($httpProvider, authProvider, $provide) {
          authProvider.init({
            clientID: 'some-client-id',
            callbackURL: 'some-callback-URL',
            domain: 'hello.auth0.com'
          });
          $httpProvider.interceptors.push('authInterceptor');
          $provide.decorator('auth', function () { return {idToken: 'w00t'}; });
        }, ['authInterceptor']);

        inject(function (_$http_, _$httpBackend_, _$rootScope_, _AUTH_EVENTS_) {
          $httpBackend = _$httpBackend_;
          $http = _$http_;
          $rootScope = _$rootScope_;
          AUTH_EVENTS = _AUTH_EVENTS_;
        });

        var forbiddenReceived = false;
        $rootScope.$on(AUTH_EVENTS.forbidden, function () {
          forbiddenReceived = true;
        });

        $http({url: '/hello'}).error(function (data, status) {
          expect(status).to.be.equal(401);
          expect(forbiddenReceived).to.be.equal(true);
          done();
        });
        $httpBackend.expectGET('/hello').respond(401);
        $httpBackend.flush();
      });
    });
  });

  describe('Token store', function () {
    var auth, $rootScope, $timeout, getDelegationToken, hasTokenExpiredOriginal;

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

      $provide.value('auth0Lib', {
        getDelegationToken: getDelegationToken,
        getProfile: function () {}
      });
    }));

    beforeEach(inject(function (_auth_, _$rootScope_, _$timeout_) {
      auth = _auth_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
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

      // Flush the promise and timeout!
      $rootScope.$apply();
      $timeout.flush();
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

      // Flush the promise and timeout!
      $rootScope.$apply();
      $timeout.flush();

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

      // Flush the promise and timeout!
      $rootScope.$apply();
      $timeout.flush();
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

      // Flush the promise and timeout!
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should call reject when token fetch failed', function (done) {
      getDelegationToken.onCall(0).callsArgWith(3, {error: 'An error ocurred'}, null);

      var clientId = 'client-id';

      auth.getToken(clientId).then(null, function (err) {
        expect(err.error).to.be.ok;
      })
      .then(done);

      // Flush the promise and timeout!
      $rootScope.$apply();
      $timeout.flush();
    });
  });

});
