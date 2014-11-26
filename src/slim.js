var helpers = require("./lib/reusables/helpers");
var plugins = require("./lib/plugins");
var defaults = require("./defaults.js");

module.exports = {
    init: function init(egnyteDomainURL, opts) {
        var options = helpers.extend({}, defaults, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        var exporting = {
            domain: options.egnyteDomainURL,
            setDomain: function (d) {
                this.domain = options.egnyteDomainURL = d;
            },
            API: require("./lib/api")(options)
        }
        plugins.install(exporting);

        return exporting;

    },
    plugin: plugins.define

}