var util = require("util");
var helpers = require('../reusables/helpers');
var promises = require("q");
var pauseStream = require("pause-stream");

var fscontent = "/fs-content";

function StreamsExtendedStorage() {
    StreamsExtendedStorage.super_.apply(this, arguments);
};


function storeFile(pathFromRoot, stream, mimeType /* optional */ , size /*optional*/ ) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
            method: "POST",
            uri: requestEngine.getEndpoint() + fscontent + encodeURI(pathFromRoot)
        }

        opts.headers = {};
        if (size >= 0) {
            opts.headers["Content-Length"] = size;
        }
        if (mimeType) {
            opts.headers["Content-Type"] = mimeType;
        }

        return requestEngine.promiseRequest(opts, function (req) {
                stream.pipe(req);
            })
            .then(function (result) { //result.response result.body
                return ({
                    id: result.response.headers["etag"],
                    path: pathFromRoot
                });
            });
    });
}

function getFileStream(pathFromRoot, versionEntryId) {
    var requestEngine = this.requestEngine;
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
    var defer = promises.defer();

    var opts = {
        method: "GET",
        url: requestEngine.getEndpoint() + fscontent + encodeURI(pathFromRoot),
    }
    if (versionEntryId) {
        opts.params = opts.qs = { //xhr and request differ here
            "entry_id": versionEntryId
        };
    }


    function oneTry() {
        function handleResponse(error, resp, body) {
            defer.resolve({
                statusCode: resp.statusCode,
                headers: resp.headers,
                stream: stream
            });
            stream.resume();

        }
        var stream = new pauseStream();
        requestEngine.retrieveStreamFromRequest(opts)
            .then(function (requestObject) {

                requestObject.on('response', function (resp) {
                    requestEngine.retryHandler(handleResponse, function () {
                        stream.destroy();
                        setImmediate(oneTry);
                    })(null, resp, resp.body);
                });

                requestObject.pipe(stream);

            });
    }
    oneTry();

    return defer.promise;
}


module.exports = function (Storage) {

    util.inherits(StreamsExtendedStorage, Storage);

    StreamsExtendedStorage.prototype.getFileStream = getFileStream;
    StreamsExtendedStorage.prototype.storeFile = storeFile;


    return StreamsExtendedStorage;

};