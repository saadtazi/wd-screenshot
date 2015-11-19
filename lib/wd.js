'use strict';

var path = require('path'),
    os   = require('os'),
    fs   = require('fs'),
    gm   = undefined;

module.exports = function(globalOptions) {
  return function(wd){
    if (globalOptions.useImageMagick) {
      gm = require('gm').subClass({ imageMagick: true });
    } else {
      gm = require('gm');
    }
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
     * compares the current opened url with a reference image while navigating pages
     *
     * When visiting a page, you can compare with a reference screenshot
     * @params refPath String  the path the the reference screenshot
     * @compareConfig POJO object with compareOptions keys, like highlightColor, highlightStyle, file (to store diff image)
     * @filePath String path where the screenshot will be saved. If no provided the screenshot won't be saved on disk
     * @return a promise that is rejected if the browser window and ref image does not correspond, fulfiled otherwise
     */
    wd.addPromiseChainMethod('compareWithReferenceScreenshot', function(refPath, compareConfig, filePath) {
      var savePath = filePath || path.join(os.tmpdir(), 'wd-screenshot-' + Date.now() + '.png');
      return this.saveScreenshot(savePath)
        .compareScreenshot(refPath, savePath)
        .then(function(equality) {
          if (!filePath) {
            fs.unlinkSync(savePath);
          }
          return equality;
        });
    });

    /**
     * saves cropped screenhots while visiting a page
     *
     * When visiting a page, saves multiple portions of the displayed pages
     * cropOptions example: [{name: 'header', x: 0, y: 0, width: 100, height: 100}]
     * note that:
     * * the default value for x and y is 0
     * * the default value for width is image.width and height is image.height
     * which means that if only name is specified, you will get the same image X number of time (X  = cropOptions.length)
     *
     * @params cropOptions Array  an array that contains information about the portions to capture
     * @savePath String path where the screenshots will be saved.
     */
    wd.addPromiseChainMethod('saveCroppedScreenshots', function(cropOptions, savePath) {
      var tmpPath = path.join(os.tmpdir(), 'tocrop-' + Date.now() + '.png');
      return this.saveScreenshot(tmpPath)
        .then(function() {
          return wd.Q.all(cropOptions.map(function(option) {
            var deferred = wd.Q.defer();
            gm(tmpPath)
            .crop(option.width, option.height, option.x, option.y)
              .write(path.join(savePath, option.name + '.png'), function (err) {
                err? deferred.reject(err) : deferred.resolve();
              });
            return deferred.promise;
          }));
        });
    });
  };
};

