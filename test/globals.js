var chai = require('chai');

global.expect = chai.expect;
global._ = require('lodash');

global.mainFunctions = require('../lib/main');
global.wdMethods = require('../lib/wd');