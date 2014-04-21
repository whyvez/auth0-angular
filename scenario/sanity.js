/**
 * Auth0 Angular e2e tests:
 *
 * The basic flows to test are:
 *
 *  * Login success
 *  * Login failed
 *  * Reload page and load profile information correctly.
 *  * Logout and reload page and profile information is not shown.
 *
 *  Repeat each step for ro, redirect and popup modes.
 */

function findAnchorByContent(content, cb) {
  element.all(by.css('a')).then(function (anchors) {
    anchors.forEach(function (anchor) {
      anchor.getText().then(function (anchorText) {
        if (anchorText === content) {
          cb(anchor);
        }
      });
    });
  });

}


describe('custom login example', function() {
  var logoutButton; 
  
  beforeEach(function () {
    browser.get('/');
    findAnchorByContent('logout', function (button) {
      logoutButton = button;
    });
  });

  afterEach(function () {
    logoutButton.click();
  });

  describe('when doing auth with "ro"', function () {
    it('should sign in successfully with valid credentials', function() {
      element(by.model('user')).sendKeys('hello@bye.com');
      element(by.model('pass')).sendKeys('hello');

      element(by.css('button')).click();
      browser.wait(function() { return browser.isElementPresent(by.css('span')); }, 5000);

      element(by.binding('auth.profile.name')).getText().then(function (text) {
        expect(text).toEqual('Welcome hello@bye.com!');
      });

      element(by.css('pre > code')).getText().then(function (text) {
        var obj = JSON.parse(text);
        expect(obj).not.toBeFalsy();
      });
    });

    it('should fail with invalid credentials', function() {
      element(by.model('user')).sendKeys('hello@bye.com');
      element(by.model('pass')).sendKeys('hello2');

      element(by.css('button')).click();
      browser.sleep(2000);
      var alertDialog = browser.switchTo().alert();

      expect(alertDialog.getText()).toEqual('login failed');

      alertDialog.accept();
    });

    it('should keep working after reload', function () {
      element(by.model('user')).sendKeys('hello@bye.com');
      element(by.model('pass')).sendKeys('hello');

      element(by.css('button')).click();
      browser.wait(function() { return browser.isElementPresent(by.css('span')); }, 5000);

      element(by.binding('auth.profile.name')).getText().then(function (text) {
        expect(text).toEqual('Welcome hello@bye.com!');
      });

      element(by.css('pre > code')).getText().then(function (text) {
        var obj = JSON.parse(text);
        expect(obj).not.toBeFalsy();
      });

      browser.get('/');
      
      browser.wait(function() { return browser.isElementPresent(by.css('span')); }, 5000);

      // Prevent afterEach from crashing
      findAnchorByContent('logout', function (button) {
        logoutButton = button;
      });

      element(by.binding('auth.profile.name')).getText().then(function (text) {
        expect(text).toEqual('Welcome hello@bye.com!');
      });

      element(by.css('pre > code')).getText().then(function (text) {
        var obj = JSON.parse(text);
        expect(obj).not.toBeFalsy();
      });
    });

    it('should logout correctly', function () {
      element(by.model('user')).sendKeys('hello@bye.com');
      element(by.model('pass')).sendKeys('hello');

      element(by.css('button')).click();
      browser.wait(function() { return browser.isElementPresent(by.css('span')); }, 5000);

      element(by.binding('auth.profile.name')).getText().then(function (text) {
        expect(text).toEqual('Welcome hello@bye.com!');
      });

      element(by.css('pre > code')).getText().then(function (text) {
        var obj = JSON.parse(text);
        expect(obj).not.toBeFalsy();
      });

      logoutButton.click();
      
      expect(element(by.model('user')).getText()).toEqual('');
      expect(element(by.model('pass')).getText()).toEqual('');

    });
  });

  describe('popup', function () {
    xit('should log in successfully with google', function () {
      findAnchorByContent('Login with Google (popup mode)', function (anchor) {
        anchor.click();

        browser.getAllWindowHandles().then(function (handles) {
          var popupHandle = handles[1];

          browser.switchTo().window(popupHandle);

          browser.close();

          // var ptor = protractor.instance();

          // element.all(by.css('button')).then(function (buttons) {

          //   buttons[0].click();
          // });
        });
      });
    });
  });
});
