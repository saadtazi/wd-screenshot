'use strict';

var path = require('path');

module.exports = function(wd, globalOptions){
  if (globalOptions && !globalOptions.Q) {
    globalOptions.Q = wd.Q;
  }
  var screenshotMain = require('./main')(globalOptions);
  // @param pages  an array of {url: 'http://....', name: ''} - name will be used to save screenshot file (name + '.png')
  // @param folderPath the folder where the screenshots will be saved
  wd.addPromiseChainMethod('saveScreenshots', function(pages, folderPath) {
    folderPath = folderPath || globalOptions;
    var self = this;
    if (!folderPath) {
      throw new Error('saveScreenShots: please provide a path value');
    }
    // http://documentup.com/kriskowal/q/#tutorial/sequences
    return config.map(function(page) {
      return function() {
        return browser
          .get(page.url)
          .saveScreenshot(path.join(folderPath, page.name + '.png'));
      };
    }).reduce(wd.Q.when, browser);
  });

};

