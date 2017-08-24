const ENDPOINTS = require("./ENDPOINTS");

module.exports = {
    init(core) {
        const mkReqFunction = core._.mkReqFunction
        xxAPI = {
            XXX: mkReqFunction({
                fsIdentification: true,
                requires: [""],
                optional: [""]
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        var opts = {
                            method: "GET",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.fsmeta + input.pathFromRoot),
                        };


                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => result.body);
            }),

        }

        core.API.xx = xxAPI
        return xxAPI
    }
}
