var chai = require('chai');
chai.use(require('chai-fs'));
global.expect = chai.expect;
global._ = require('lodash');

global.wdScreenshot = require('../lib/main');