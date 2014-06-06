/*
Project1 - example

This file simplifies the initial screenshot generation
and any refactoring/redesign of the site you're building

This assumes that:
* you have a local selenium server instance running and firefox installed

Note that this is a basic example, that will not work for single page apps that requires inputs...


to run it:

```
$ node examples/project1/utils/auto-save.js
```

*/

var path = require('path'),

    wd = require('wd');

var wdSrcreenshot;
// adds the wd-screenshot methods to wd
try {
  require('wd-screenshot/wd')(wd);
} catch( err ) {
  require('../../../lib/wd')(wd);
}

var screenshotPath = './screenshots/'
    config = [ { url: 'http://www.radialpoint.com/', name: 'homepage'},
               { url: 'http://www.radialpoint.com/products/reveal/', name: 'reveal-page'},
               { url: 'http://www.radialpoint.com/asfwe', name: '404-page'}
             ],

    browser = wd.promiseChainRemote();


browser.init({browserName:'firefox'})
.noop()
.saveScreenshots(config, path.join(__dirname, screenshotPath))
  .then(function() { return browser.quit(); })
  .done();


// browser.init({browserName:'firefox'})
// .then(function() {
//   // http://documentup.com/kriskowal/q/#tutorial/sequences

//   return config.map(function(page) {
//     return function() {
//       console.log('saving to ',path.join(__dirname, screenshotPath, page.name + '.png'));
//       return browser
//         .get(page.url)
//         .saveScreenshot(path.join(__dirname, screenshotPath, page.name + '.png'));
//     };
//   }).reduce(wd.Q.when, browser);
// })
//   .then(function() { return browser.quit(); })
//   .done();
