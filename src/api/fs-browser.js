const ENDPOINTS = require("./ENDPOINTS");

module.exports = {
    init(core) {
        const mkReqFunction = core._.mkReqFunction
        const fsBrowserAPI = {
            download: mkReqFunction({
                fsIdentification: true,
                optional: ["versionEntryId", "isBinary"]
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        const opts = {
                            method: "GET",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.fscontent + input.pathFromRoot),
                        };
                        if (input.versionEntryId) {
                            opts.params = {
                                "entry_id": input.versionEntryId
                            };
                        }

                        if (input.isBinary) {
                            opts.responseType = "arraybuffer";
                        }

                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => result.response);
            }),
            storeFile: mkReqFunction({
                fsIdentification: true,
                requires: ["file"],
                optional: ["mimeType"]
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {

                        const opts = {
                            method: "POST",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.fscontent + input.pathFromRoot),
                            body: input.file,
                        }

                        opts.headers = {};
                        if (input.mimeType) {
                            opts.headers["Content-Type"] = input.mimeType;
                        }

                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => {
                        result.body.id = result.response.headers["etag"] //for backward compatibility
                        return result.body
                    });
            }),
            //TODO: check if EOS supports this
            storeFileMultipart: mkReqFunction({
                fsIdentification: true,
                requires: ["file"]
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        if (!window.FormData) {
                            throw new Error("Unsupported browser");
                        }
                        var file = fileOrBlob;
                        var formData = new window.FormData();
                        formData.append('file', file);
                        pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
                        var opts = {
                            method: "POST",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.fscontent + input.pathFromRoot),
                            body: formData,
                        };
                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => {
                        result.body.id = result.response.headers["etag"] //for backward compatibility
                        return result.body
                    });
            }),

        }

        core.API.storage = Object.assign(core.API.storage, fsBrowserAPI)
        return fsBrowserAPI
    }
}
