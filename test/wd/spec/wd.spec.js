/*global wdScreenshot:false, _:false*/
var path = require('path');

describe('wd custom functions', function() {
  'use strict';
  before(function() {
    wdScreenshot({Q: this.wd.Q}).addFunctions(this.wd);
  });

  it('should add compareScreenshot', function(done) {
    this.browser.compareScreenshot('./test/fixtures/folder1/spec100.jpg', './test/fixtures/folder1/spec100.jpg')
      .then(function(equality) {
        expect(equality).to.eql(0);
        done();
      }, function(err) {
        done(err);
      });
  });

  it('should add compareScreenshotFolders', function(done) {
    this.browser.compareScreenshotFolders('./test/fixtures/folder1/', './test/fixtures/folder1/')
      .then(function(equality) {
        expect(equality).to.eql([0, 0]);
        done();
      }, function(err) {
        done(err);
      });
  });

  it('should add saveScreenshots', function(done) {
    var savedPath = './test/wd/screenshots',
        urls = [ { url: 'http://www.saadtazi.com/', name: 'homepage'},
                 { url: 'http://www.fruitsoftware.com/', name: 'another-page'},
                 { url: 'http://wikipedia.org/fefefe', name: '404-page'}
               ];
    this.browser.saveScreenshots(urls, savedPath)
      .then(function() {
        _.each(urls, function(url) {
          expect(path.join(savedPath, url.name + '.png')).to.be.a.file();
        });
        done();
      }, function(err) {
        done(err);
      });
  });

  it('should add compareWithReferenceScreenshot', function() {
    return this.browser.get('http://www.saadtazi.com/')
      // should be ok
      .compareWithReferenceScreenshot('./test/wd/screenshots/homepage.png');
  });

  it('should add saveCroppedScreenshots', function() {
    return this.browser.get('http://www.saadtazi.com/')
      // should be ok
      .saveScreenshot('./test/wd/screenshots/fullimage.png')
      .saveCroppedScreenshots([ { name: 'topleft', x: 0, y: 0, width: 100, height: 100},
                                { name: 'topleft2', width: 100, height: 100},
                                { name: 'under', x: 100, y: 100, width: 100, height: 100},
                                { name: 'over', width: 200, height: 100, x: 200, y: 0}
      ], './test/wd/screenshots/');
  });
});