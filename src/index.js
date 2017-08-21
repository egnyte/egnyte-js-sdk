const core = require("./core")
const defaults = require("./defaults.js");

// TODO: expose core in a reasonable and pluggable way

module.exports = {
    init(egnyteDomainURL, opts) {
        const instance = core.instance(Object.assign({}, defaults, opts))
        instance.setDomain(egnyteDomainURL)
        return instance
    }
}
