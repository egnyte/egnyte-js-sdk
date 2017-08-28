const chai = require("chai");
const dirtyChai = require("dirty-chai");
const expect = chai.expect;
chai.use(dirtyChai);
global.expect = expect;
global.Egnyte = require("../src/slim");
require("../spec/conf/apiaccess");
