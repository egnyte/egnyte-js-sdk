window.Egnyte || (window.Egnyte = {})
var core = require("./core.js");
var promises = require("../../lib/promises-browser");
var dom = require("../../lib/reusables/dom");
var messages = require("../../lib/reusables/messages");

window.Egnyte.appInit = function appInit(callback) {
    return core(promises, dom, messages, callback);
}
module.exports = window.Egnyte;