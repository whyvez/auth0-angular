exports.config = {

  seleniumPort: 4444,

  allScriptsTimeout: 120000,

  capabilities: {
    'browserName': 'chrome'
  },

  specs: [
    './sanity.js',
  ],

  baseUrl: 'http://localhost:3000/',
  
  rootElement: 'div',

  onPrepare: function() {
  },

  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 120000,
    isVerbose: false,
    includeStackTrace: true
  }
};

