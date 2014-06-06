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
try {
  require('wd-screenshot/wd')(wd);
} catch( err ) {
  require('../../../lib/wd')(wd);
}

var path = require('path'),

    wd = require('wd'),

    screenshotPath = '../references/'
    config = [ { url: 'http://beta.saadtazi.com/', name: 'beta-homepage'},
               { url: 'http://beta.saadtazi.com/projects', name: 'projects-page'},
               { url: 'http://beta.saadtazi.com/lab', name: 'lab-page'},
               { url: 'http://saadtazi.com/', name: 'oldsite-page'}
               // ... add as many as you want
             ],

    browser = wd.promiseChainRemote();


browser.init({browserName:'firefox'})
.noop()
.saveScreenshots(config, path.join(__dirname, screenshotPath))
  .then(function() { return browser.quit(); })
  .done();

