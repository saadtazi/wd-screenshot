/*global wdScreenshot:false, _:false*/
var path = require('path');

describe('wd custom functions', function() {
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
        urls = [ { url: 'http://www.radialpoint.com/', name: 'homepage'},
                 { url: 'http://www.radialpoint.com/products/reveal/', name: 'reveal-page'},
                 { url: 'http://www.radialpoint.com/asfwe', name: '404-page'}
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

  it.only('should add compareWithReferenceScreenshot', function() {
    return this.browser.get('http://www.radialpoint.com/')
      .compareWithReferenceScreenshot('./test/wd/screenshots/homepage.png')
      .then(function() {
        console.log(arguments);
      })
  });
});