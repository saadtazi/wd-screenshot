'use strict';

var path = require('path'),
    os   = require('os'),
    fs   = require('fs');

module.exports = function(wd, globalOptions){
  // if we have wd but no Q, we might want to use wd.Q
  if (globalOptions && !globalOptions.Q) {
    globalOptions.Q = wd.Q;
  }
  var screenshotMain = require('./main')(globalOptions);
  // @param pages  an array of {url: 'http://....', name: ''} - name will be used to save screenshot file (name + '.png')
  // @param folderPath the folder where the screenshots will be saved
  wd.addPromiseChainMethod('saveScreenshots', function(pages, folderPath) {
    // this is the wd context (browser)
    var self = this;
    if (!folderPath) {
      throw new Error('saveScreenShots: please provide a path value');
    }
    // http://documentup.com/kriskowal/q/#tutorial/sequences
    return pages.map(function(page) {
      return function() {
        return self
          .get(page.url)
          .saveScreenshot(path.join(folderPath, page.name + '.png'));
      };
    }).reduce(wd.Q.when, self);
  });
  // add the main functions to wd as well... why not?
  wd.addPromiseChainMethod('compareScreenshot', screenshotMain.compareScreenshot);
  wd.addPromiseChainMethod('compareScreenshotFolders', screenshotMain.compareScreenshotFolders);

  /**
   * for comparing while navigating pages
   *
   * When visiting a page, you can compare with a reference screenshot
   * @params refPath String  the path the the reference screenshot
   * @compareConfig POJO object with compareOptions keys, like highlightColor, highlightStyle, file (to store diff image)
   * @filePath String path where the screenshot will be saved. If no provided the screenshot won't be saved on disk
   * @return a promise that is rejected if the browser window and ref image does not correspond, fulfiled otherwise
   */
  wd.addPromiseChainMethod('compareWithReferenceScreenshot', function(refPath, compareConfig, filePath) {
    var savePath = filePath || path.join(os.tmpdir(), 'wd-screenshot-' + Date.now() + '.png');
    return this.takeScreenshot(savePath)
      .compareScreenshot(refPath, savePath)
      .then(function() {
        if (!filePath) {
          fs.unlinkSync(savePath);
        }
      });
  });


};

