var promises = require("q");
var helpers = require('../reusables/helpers');
var decorators = require("./decorators");
var ENDPOINTS = require("../enum/endpoints");

module.exports = function (requestEngine, API) {
    return function (name, pluginClosure) {
        API[name] = pluginClosure({
            requestEngine: requestEngine,
            ENDPOINTS: ENDPOINTS,
            promises: promises,
            helpers: helpers,
            decorators: decorators
        });
    }
}