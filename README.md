# wd-screenshot

[![Dependency Status](https://david-dm.org/saadtazi/wd-screenshot.png)](https://david-dm.org/saadtazi/wd-screenshot)

[![NPM](https://nodei.co/npm/wd-screenshot.png)](https://nodei.co/npm/wd-screenshot/)


Provides methods that adds image comparison using [gm](http://aheckmann.github.io/gm/) node library, a [GraphicsMagick](http://www.graphicsmagick.org/) wrapper.

Also provides [wd.js](https://github.com/admc/wd) methods that can be used when testing using selenium.

# Installation

```
npm install wd-screenshot
```

# Usage

## Main functions

```
// basic usage
var wdScreenshot = require('wd-screenshot')();
wdScreenshot.compareScreenshot('path/to/image1.png', 'path/to/image2.png')
  // returns a promise
  .then(
    // success
    function(equality) {
      // equality is a number between 0 and 1, 0 meaning the images are equal
      console.log('success!');
    },
    // error
    function(error) {
      // error is a JS error containing an explanatory message
      console.log('error');
    });

wdScreenshot.compareScreenshotFolders('path/to/referenceFolder', 'path/to/testedImageFolder')
  // returns a promise that is rejected if any of the image is not "equal" to the reference image
  .then(
    // success
    function(equalities) {
      // equalities is an array of numbers between 0 and 1, 0 meaning the images are equal
      console.log('success!');
    },
    // error
    function(errors) {
      // errors is an array of JS errors, each error containing an explanatory error message
      console.log('error');
    });


/************************
/* more advanced usage
/************************

var Q = require('Q');
// or use this if you have wd installed
// var wd = require('wd'), Q = wd.Q;

var wdScreenshot2 = require('wd-screenshot')({
  // Q: a promise lib. if not provided, wd-screenshot will try to require 'Q', then 'wd' and get `wd.Q`.
  // If nothing is found, it throws an error
  Q: Q,
  // tolerance: a number between 0 and 1, 0 = should be perfectly equal
  tolerance: 0.01,
  // saveDiffImagePath: a path where diff image will be saved by default (diff images are not saved by default)
  // can be overwritten when using `compareScreenshot` with compareOptions (`file` key)
  // when comparing folder, the diff image name will be the compared image name
  saveDiffImagePath: 'path/to/diff-folder/'
  // highlightColor: a gm color that is used to create the diff image. it can be an hex value too
  highlightColor: 'magenta',
  // highlightStyle: one of 'Assign', 'Threshold', 'Tint', or 'XOR'
  // more info at http://www.graphicsmagick.org/GraphicsMagick.html#details-highlight-style
  highlightStyle: 'XOR'
});

wdScreenshot.compareScreenshot(
  'path/to/image1.png',
  'path/to/image2.png',
  // you can overwrites any options passed at initialization time
  {
    // example of overwriting an option:
     highlightStyle: 'Tint',
    // file: a file path where the diff image will be saved
    // overwrites saveDiffImagePath global option
    file: 'path/to/diffImage.png'
  }
).fail(function(error) { console.log('images are not equal', error)});

```

check [this example](./examples/utils/compare-screenshot/compare-screenshot.js) and [this other example](./examples/utils/compare-folders/compare-screenshot-folders.js).


## wd.js methods

### Usage

```
var wd = require('wd'),
    wdScreenshot = require('wd-screenshot')({/*wd-screenshot options*/});

// this is where the magic happens
wdScreenshot.addFunctions(wd);
```

### compareScreenshot and compareScreenshotFolders


```
browser.init({browserName: 'firefox'})
  .get('http://www.google.com')
  //... do some stuff.. like calling takeScreenshot()
  .compareScreenshot('reference.png', 'test.png')
  //...
  .compareScreenshotFolders(path.join(__dirname, './references'), path.join(__dirname, './screenshots'), {tolerance: 0.01})

  .fin(function() { return browser.quit(); })
  .done();

```

### saveScreenshots

Helper wd functions that takes a list of urls and save a screenshot when the url is loaded. Not really helpful with single page apps though...

```
browser.saveScreenshots([ { url: 'http://domain.com/page-1', name: 'page-1'},
                          {url: 'http://domain.com/page-2', name: 'page-2'}], './screenshots')
```

### compareWithReferenceScreenshot

```
// filePath is optional. allows to save the tested image
compareWithReferenceScreenshot(imageRefPath, compareConfig, filePath)
```

# API

Check [here](./api/).

# Recommandations

I strongly recommend that you write a wd.js script that saves the original screenshot (wd `saveScreenshots()` from this library might help). This will saves you a lot of time when refactoring/redesigning your site. See an example [here](./examples/project1/utils/auto-save.js).

The added `saveScreenshots` wd method can help you with that.

For more complex usecases, you can of course also use the native wd `saveScreenshot(savingPath)` method.


# Thank you!

I would like to thank [radialpoint](http://radialpoint.com) for organizing hackatons during office hours that allowed me to start working on this tool.

