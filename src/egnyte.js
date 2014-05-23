(function () {
    "use strict";

    var helpers = require('./lib/reusables/helpers');
    var options = {};

    function init(egnyteDomainURL, opts) {
        options = helpers.extend(options, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        var api = require("./lib/api")(options);

        return {
            domain: options.egnyteDomainURL,
            filePicker: require("./lib/filepicker/byapi")(options, api),
            filePickerRemote: require("./lib/filepicker/bysession")(options),
            API: api
        }

    }

    window.EgnyteWidget = {
        init: init
    }

})();