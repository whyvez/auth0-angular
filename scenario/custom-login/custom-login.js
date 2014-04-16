
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


  describe('ro', function () {

    it('should log in successfully with valid credentials', function() {
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
