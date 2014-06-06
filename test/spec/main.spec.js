
describe('main functions', function() {
  'use strict';

  function init(config) {
    return mainFunctions(config);
  }
  describe('initialization', function () {
    it('should work without config options', function() {
      var funcs = init();
      expect(funcs.options).to.have.property('Q');
      expect(funcs.options).to.contain.keys(Object.keys(funcs.defaultOptions));
    });

    it('should allow to pass config options', function() {
      var config = {
            Q: 'I am not not really a promise library',
            tolerance: 0.6,
            randomKey: 'randomValue'
          },
          funcs = init(config);
      expect(funcs.options).to.contain(config);
      expect(funcs.options).to.include({saveDiffImagePath: funcs.defaultOptions.saveDiffImagePath});
    });
  });
  describe('compareScreenshot', function () {

  });
});