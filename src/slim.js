(function () {
    "use strict";

    var helpers = require("./lib/reusables/helpers");
    var defaults = require("./defaults.js");

    function init(egnyteDomainURL, opts) {
        var options = helpers.extend({},defaults, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        return {
            domain: options.egnyteDomainURL,
            API: require("./lib/api")(options)
        }

    }
    //for commonJS
    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            init: init
        }
    }
    //for browsers. AMD works better with shims anyway
    if (typeof window !== "undefined") {
        window.Egnyte = {
            init: init
        }
    }

})();