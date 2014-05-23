(function () {
    "use strict";

    var helpers = require('./lib/reusables/helpers');
    var options ;

    function init(egnyteDomainURL, opts) {
        options = helpers.extend(options, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        return {
            domain: options.egnyteDomainURL,
            API:  require("./lib/api")(options)
        }

    }

    window.Egnyte = {
        init: init
    }

})();