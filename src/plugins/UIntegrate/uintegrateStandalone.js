var mainEgnyte = {};
if (typeof Egnyte !== "undefined") {
    mainEgnyte = Egnyte;
}
var core = require("./core.js");
var promises = require("../../lib/promises-browser");
var dom = require("../../lib/reusables/dom");
var messages = require("../../lib/reusables/messages");

mainEgnyte.appInit = function appInit(callback) {
    return core(promises, dom, messages, callback);
}
module.exports = mainEgnyte;