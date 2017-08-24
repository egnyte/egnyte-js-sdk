const core = require("./core")
const defaults = require("./defaults.js");

module.exports = {
    init(egnyteDomainURL, opts) {
        //TODO: plug in httpRequest depending on env
        const instance = core.instance(Object.assign({httpRequest: require("request")}, defaults, opts))
        instance.setDomain(egnyteDomainURL)
        return instance
    }
}
