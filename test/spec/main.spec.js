/*global wdScreenshot*/

describe('main functions', function() {
  'use strict';

  function init(config) {
    return wdScreenshot(config);
  }
  describe('initialization', function () {
    it('should work without config options', function() {
      var scrnsht = init();
      expect(scrnsht.options).to.have.property('Q');
      expect(scrnsht.options).to.contain.keys(Object.keys(scrnsht.defaultOptions));
    });

    it('should allow to pass config options and merge defaults', function() {
      var config = {
            Q: 'I am not not really a promise library',
            tolerance: 0.6,
            randomKey: 'randomValue'
          },
          scrnsht = init(config);
      expect(scrnsht.options).to.contain(config);
      expect(scrnsht.options).to.include({saveDiffImagePath: scrnsht.defaultOptions.saveDiffImagePath});
    });
  });

  describe('compareScreenshot', function () {
    var scrnsht = init();
    it('should return a fulfilled promise when images are equal', function(done) {
      scrnsht.compareScreenshot('./test/fixtures/folder1/spec100.jpg', './test/fixtures/folder1/spec100.jpg')
        .then(function(equality) {
          expect(equality).to.eql(0);
          done();
        }, function(err) {
          done(err);
        });
    });

    it('should return a fulfilled promise when images are  similar', function(done) {
      scrnsht.compareScreenshot('./test/fixtures/folder1/spec100.jpg', './test/fixtures/folder1/spec1000.jpg', {tolerance: 0.1})
        .then(function(/*equality*/) {
          done();
        }, function(err) {
          done(err);
        });
    });

    it('should return a rejected promise when images are not similar', function(done) {
      scrnsht.compareScreenshot('./test/fixtures/folder1/spec100.jpg', './test/fixtures/folder1/spec1000.jpg', {tolerance: 0.0001})
        .then(function(/*equality*/) {
          done('images should not be considered similar');
        }, function(/*err*/) {
          done();
        });
    });

    it('should generate a diff image when file option is specified', function(done) {
      var diffPath = './test/fixtures/diffs/diff.jpg';
      scrnsht.compareScreenshot('./test/fixtures/folder1/spec100.jpg', './test/fixtures/folder1/spec100.jpg', {file: diffPath})
        .then(function(equality) {
          expect(equality).to.eql(0);
          expect(diffPath).to.be.a.file();
          done();
        }, function(err) {
          done(err);
        });
    });
  });

  describe('compareScreenshotFolders', function () {
    var scrnsht = init({tolerance: 0.1});

    it('should return a fulfilled promise when images are equal', function(done) {
      scrnsht.compareScreenshotFolders('./test/fixtures/folder1/', './test/fixtures/folder1/')
        .then(function(equality) {
          expect(equality).to.eql([0, 0]);
          done();
        }, function(err) {
          done(err);
        });
    });

    it('should return a fulfilled promise when images are  similar', function(done) {
      scrnsht.compareScreenshotFolders('./test/fixtures/folder1/', './test/fixtures/folder2/')
        .then(function(/*equality*/) {
          done();
        }, function(err) {
          done(err);
        });
    });

    it('should return a rejected promise when images are not similar', function(done) {
      scrnsht.compareScreenshotFolders('./test/fixtures/folder1/', './test/fixtures/folder2/', {tolerance: 0.0001})
        .then(function(/*equality*/) {
          done(new Error('images should not be considered similar'));
        }, function(/*err*/) {
          done();
        });
    });

    it('should generate diff images when file option is specified', function(done) {
      var diffPath = './test/fixtures/diffs/';
      scrnsht.compareScreenshotFolders(
        './test/fixtures/folder1/',
        './test/fixtures/folder1/',
        {  saveDiffImagePath: diffPath, highlightColor: 'magenta', highlghtStyle: 'XOR'})
        .then(function(/*equalities*/) {
          expect(diffPath + 'spec100.jpg').to.be.a.file();
          expect(diffPath + 'spec1000.jpg').to.be.a.file();
          done();
        }, function(err) {
          done(err);
        });
    });
  });

});