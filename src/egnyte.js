(function () {
    "use strict";

    var helpers = require('./helpers');

    var options = {};

    function init(egnyteDomainURL, opts) {
        options = helpers.extend(options, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        return {
            filePicker: require("./filepicker")(options)
        }

    }

    window.EgnyteWidget = {
        init: init
    }

})();