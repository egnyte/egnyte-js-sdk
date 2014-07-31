(function () {
    "use strict";

    var helpers = require("./lib/reusables/helpers");
    var options = require("./defaults.js");

    function init(egnyteDomainURL, opts) {
        options = helpers.extend(options, opts);
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