const ENDPOINTS = require("./endpoints");

module.exports = {
    init(core) {
        const mkReqFunction = core._.mkReqFunction()
        fsAPI = {
            get: mkReqFunction({fsIdentification:true},(tools, decorate, input) => {
                return Promise.resolve()
                    .then(function () {
                        var opts = {
                            method: "GET",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.fsmeta + input.pathFromRoot),
                        };

                        if (input.versionEntryId) {
                            opts.params = {
                                "entry_id": input.versionEntryId
                            };
                        }

                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result=>result.body);
                }
        }

        core.API.fs = fsAPI
        return fsAPI
    }
}
