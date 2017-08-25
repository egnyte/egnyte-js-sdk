var chai = require("chai");
var dirtyChai = require("dirty-chai");
var expect = chai.expect;
chai.use(dirtyChai);
global.expect = expect;
global.Egnyte = require("../src/slim");
global.settings = require("./conf/apiaccess");
