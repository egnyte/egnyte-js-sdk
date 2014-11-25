"use strict";

var helpers = require("./lib/reusables/helpers");
var defaults = require("./defaults.js");

module.exports = {
    init: function init(egnyteDomainURL, opts) {
        var options = helpers.extend({}, defaults, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        return {
            domain: options.egnyteDomainURL,
            API: require("./lib/api")(options)
        }

    }

}