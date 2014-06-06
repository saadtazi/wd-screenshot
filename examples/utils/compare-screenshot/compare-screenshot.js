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
var wdSrcreenshot = WdSrcreenshot();
wdSrcreenshot
  .compareScreenshot(path.join(__dirname, './reference.png'), path.join(__dirname, './test.png'), {tolerance: 0.4})
  .then(callbackGenerator('is equal', 'test1'), callbackGenerator('is NOT equal', 'test1'));


wdSrcreenshot
  .compareScreenshot(path.join(__dirname, './reference.png'), path.join(__dirname, './test.png'), {tolerance: 0.1})
  .then(callbackGenerator('is equal', 'test2'), callbackGenerator('is NOT equal', 'test2'));

wdSrcreenshot
  .compareScreenshot(
    path.join(__dirname, './reference.png'),
    path.join(__dirname, './test-close-enough.png'),
    {
      tolerance: 0.1,
      highlightStyle: 'Tint',
      file: path.join(__dirname, './diffs/diff-Tint.png')
    }
  )
  .then(callbackGenerator('is equal', 'test3'), callbackGenerator('is NOT equal', 'test3 (with diff)'));
