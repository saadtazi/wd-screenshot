/**
an example of compareScreenshotFolders

Assumes that you have images in references/ (generated using utils/auto-save.js)
*/

var WdSrcreenshot;
try {
  WdSrcreenshot = require('wd-screenshot');
} catch( err ) {
  WdSrcreenshot = require('../../../lib/main');
}

var path = require('path'),

    wd = require('wd');

function callbackGenerator(msg, testName) {
  return function(res) {
    console.log(testName, msg, ' - res:', res);
  };
}
var wdSrcreenshot = WdSrcreenshot(wd);


wdSrcreenshot
  .compareScreenshotFolders(path.join(__dirname, './references'), path.join(__dirname, './screenshots'), {tolerance: 0.01})
  .then(callbackGenerator('is equal', 'test1'), callbackGenerator('is NOT equal', 'test1'));

wdSrcreenshot
  .compareScreenshotFolders(
    path.join(__dirname, './references'),
    path.join(__dirname, './wrong-screenshots'),
    { tolerance: 0.01,
      highlightColor: 'magenta',
      saveDiffImagePath: path.join(__dirname, './diffs') })
  .then(callbackGenerator('is equal', 'test1'), callbackGenerator('is NOT equal', 'test1'));

