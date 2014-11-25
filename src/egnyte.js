var helpers = require("./lib/reusables/helpers");
var defaults = require("./defaults.js");

module.exports = {
    init: function init(egnyteDomainURL, opts) {
        var options = helpers.extend({}, defaults, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        var api = require("./lib/api")(options);

        return {
            domain: options.egnyteDomainURL,
            filePicker: require("./lib/filepicker/byapi")(api),
            API: api
        }

    }

}