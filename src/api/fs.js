const ENDPOINTS = require("./ENDPOINTS");

module.exports = {
    init(core) {
        const mkReqFunction = core._.mkReqFunction
        const fsAPI = {
            get: mkReqFunction({
                fsIdentification: true,
                optional: ["versionEntryId"]
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        const opts = {
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
                    .then(result => result.body);
            }),
            exists: mkReqFunction({
                fsIdentification: true
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        const opts = {
                            method: "GET",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.fsmeta + input.pathFromRoot),
                        };

                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(
                        result => (result.response.statusCode == 200), //breaking change
                        result => { //result.error result.response, result.body
                            if (result.response && result.response.statusCode == 404) {
                                return false;
                            } else {
                                throw result;
                            }
                        }
                    );
            }),
            parents: mkReqFunction({
                fsIdentification: true
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        const opts = {
                            method: "GET",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.fsmeta + input.pathFromRoot + "/parents")
                        };

                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => result.body);

            }),
            createFolder: mkReqFunction({
                fsIdentification: true
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        const opts = {
                            method: "POST",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.fsmeta + input.pathFromRoot),
                            json: {
                                "action": "add_folder"
                            }
                        }
                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => result.body); //breaking change

            }),
            //breaking change - no more rename, can be implemented properly later
            move: mkReqFunction({
                fsIdentification: true,
                requires: ["destination"]
            }, transfer.bind(null, "move")),
            copy: mkReqFunction({
                fsIdentification: true,
                requires: ["destination"]
            }, transfer.bind(null, "copy")),
            remove: mkReqFunction({
                fsIdentification: true,
                optional: ["versionEntryId"]
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        const opts = {
                            method: "DELETE",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.fsmeta + input.pathFromRoot),
                        };
                        if (input.versionEntryId) {
                            opts.params = {
                                "entry_id": versionEntryId
                            };
                        }
                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => result.response.statusCode); //backwards commpatibility

            }),
        }

        core.API.storage = fsAPI
        return fsAPI
    }
}


function transfer(action, tools, decorate, input) {
    return Promise.resolve()
        .then(() => {
            const newPath = tools.helpers.encodeNameSafe(input.destination);
            const opts = {
                method: "POST",
                url: tools.requestEngine.getEndpoint(ENDPOINTS.fsmeta + input.pathFromRoot),
                json: {
                    "action": action,
                    "destination": newPath,
                }
            };
            return tools.requestEngine.promiseRequest(decorate(opts));
        })
        .then(result => result.body); //breaking change
    // .then(function (result) { //result.response result.body
    //     if (result.response.statusCode == 200) {
    //         return {
    //             oldPath: pathFromRoot,
    //             path: newPath
    //         };
    //     }
    // });
}
