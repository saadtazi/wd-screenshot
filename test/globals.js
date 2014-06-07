var chai = require('chai');
chai.use(require('chai-fs'));
global.expect = chai.expect;
global._ = require('lodash');

global.mainFunctions = require('../lib/main');
global.wdMethods = require('../lib/wd');