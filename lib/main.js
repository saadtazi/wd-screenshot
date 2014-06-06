'use strict';

var path = require('path'),

    gm     = require('gm'),
    _      = require('lodash'),
    wrench = require('wrench');

/*
@params globalOptions POJO with possible keys
    * saveDiffImagePath: if not falsy, it will save the diff image in that folder, using image name
*/

var defaultOptions = {
  // actually, supported formats are MUCH more longer than this: see http://www.graphicsmagick.org/formats.html
  imageRegExp: /\.(jpg|jpeg|png|gif|ico|)$/i,
  saveDiffImagePath: false,
  tolerance: 0.1,
  highlightColor: 'red',  // gm defaults
  highlightStyle: 'Tint'  // gm defaults
}

function getQ(options) {
  var QLib = options.Q;
  if (!QLib) {
    try {
      QLib = require('Q');
    } catch(e) {
      try {
        QLib = require('wd').Q;
      } catch (e) {}
    }

    if (!QLib) {
      throw new Error('Q is required. Pass it through options or install Q or wd via npm.');
    }
    return QLib;
  }
}


module.exports = function(globalOptions) {
  var options = _.extend({}, defaultOptions, globalOptions || {}),
      Q = getQ(options);

  // compare options: see http://aheckmann.github.io/gm/docs.html#compare
  function compareScreenshot(path1, path2, compareOptions) {
    var deferred = Q.defer();
    // console.log('compareScreenshot - compareOptions:', compareOptions);
    gm.compare(path1, path2, compareOptions, function (err, isEqual, equality, raw) {
      // console.log(path2, 'gm compare results:', err, isEqual, equality, raw);
      if (err) throw err;
      isEqual ? deferred.resolve(equality) : deferred.reject([path2, ' is not equal to ', path1, ' (', JSON.stringify(compareOptions), ')'].join(''));
    });
    return deferred.promise;
  }


  // @param pages  an array of {url: 'http://....', name: ''} - name will be used to save screenshot file (name + '.png')
  // @param folderPath the folder where the screenshots will be saved
  // wd.addPromiseChainMethod('saveScreenshots', function(pages, folderPath) {
  //   folderPath = folderPath || globalOptions;
  //   if (!folderPath) {
  //     throw new Error('saveScreenShots: please provide a path value');
  //   }
  //   // http://documentup.com/kriskowal/q/#tutorial/sequences
  //   return config.map(function(page) {
  //     return function() {
  //       return browser
  //         .get(page.url)
  //         .saveScreenshot(path.join(folderPath, page.name + '.png'));
  //     };
  //   }).reduce(Q.when, browser);

  // });


  function compareScreenshotFolders(referencePath, testPath, compareFolderOptions) {
    var compareOptions = _.extend({}, options, compareFolderOptions || {});

    var referenceImages = wrench.readdirSyncRecursive(referencePath),
        testImages      = wrench.readdirSyncRecursive(testPath).filter(function(testImage) {
          if (!testImage.match(compareOptions.imageRegExp)) {
            return false;
          }
          var fileName = path.basename(testImage);
          if (referenceImages.indexOf(fileName) <= -1) {
            console.error(referencePath, 'does not contain', fileName);
            return false;
          }
          return true;

        });


    if (testImages.length === 0) {
      console.error(referencePath, 'nothing to compare in ', testPath);
      // TODO should reject if here?
      return Q.fcall(function() { return 0; });
    }
    return Q.all(testImages.map(function(testImage) {
      var imageOptions = _.extend({}, compareOptions),
          fileName = path.basename(testImage);

      if (imageOptions.saveDiffImagePath) {
        // if we need to save the diff file, imageOptions a diff file path
        imageOptions.file = path.join(compareFolderOptions.saveDiffImagePath, fileName);
      }
      return compareScreenshot(path.join(referencePath, fileName), path.join(testPath, testImage), imageOptions);
    }));
  }


  // addMethods returns some convenient functions
  return {
    compareScreenshot: compareScreenshot,
    compareScreenshotFolders: compareScreenshotFolders
  };
};
