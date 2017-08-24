const ENDPOINTS = require("./ENDPOINTS");
const chunkingStreams = require('chunking-streams');
const SizeChunker = chunkingStreams.SizeChunker;
const PassThrough = require("stream").PassThrough;

module.exports = {
    init(core) {
        const mkReqFunction = core._.mkReqFunction

        const getFileStream = mkReqFunction({
            fsIdentification: true,
            optional: ["versionEntryId"]
        }, (tools, decorate, input) => {
            return new Promise((resolve,reject) => {

                var opts = {
                    method: "GET",
                    url: tools.requestEngine.getEndpoint(ENDPOINTS.fscontent + input.pathFromRoot),
                }
                if (input.versionEntryId) {
                    opts.params = opts.qs = { //xhr and request differ here
                        "entry_id": input.versionEntryId
                    };
                }

                function handleResponse(error, resp, body) {
                    resolve(resp);
                }

                function oneTry() {
                    tools.requestEngine.retrieveStreamFromRequest(decorate(opts))
                        .then(function (requestObject) {
                            requestObject.pause();
                            requestObject.on('response', function (resp) {
                                tools.requestEngine.retryHandler(handleResponse, function () {
                                    setImmediate(oneTry);
                                })(null, resp, resp.body);
                            });
                        });
                }
                oneTry();
            })

        })

        const fsNodeAPI = {
            getFileStream: getFileStream,
            download: getFileStream,
            storeFile: mkReqFunction({
                fsIdentification: true,
                requires: ["file"],
                optional: ["mimeType", "size"]
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        const opts = {
                            method: "POST",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.fscontent + input.pathFromRoot),
                        }

                        opts.headers = {};
                        if (input.size >= 0) {
                            opts.headers["Content-Length"] = input.size;
                        }
                        if (input.mimeType) {
                            opts.headers["Content-Type"] = input.mimeType;
                        }

                        return tools.requestEngine.promiseRequest(decorate(opts), function (req) {
                                input.file.pipe(req);
                                //for compatibility with streams created with request
                                //request returns a stream that is flowing, so we have to pause manually and then it's hard to unpause at the right moment... so we're accepting a paused stream here too.
                                try {
                                    input.file.resume();
                                } catch (e) {};
                            })

                    })
                    .then(result => {
                        result.body.id = result.response.headers["etag"] //for backward compatibility
                        return result.body
                    });
            }),
            //TODO: bring back chunked upload if we find a way to test it.
        }

        core.API.storage = Object.assign(core.API.storage, fsNodeAPI)
        return fsNodeAPI
    }
}
