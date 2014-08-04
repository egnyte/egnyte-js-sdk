var util = require("util");
var helpers = require('../reusables/helpers');
var promises = require("q");

var fscontent = "/fs-content";

function StreamsExtendedStorage() {
    StreamsExtendedStorage.super_.apply(this, arguments);
};


function storeFile(pathFromRoot, stream, size /*optional*/ ) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
            method: "POST",
            uri: requestEngine.getEndpoint() + fscontent + encodeURI(pathFromRoot)
        }
        if (size >= 0) {
            opts.headers = {
                "Content-Length": size
            }
        }

        return requestEngine.promiseRequest(opts, function (req) {
                stream.pipe(req);
            })
            .then(function (result) { //result.response result.body
                return ({
                    id: (result.response.getResponseHeader ? result.response.getResponseHeader("etag") : result.response.headers["etag"]),
                    path: pathFromRoot
                });
            });
        //            .then(function (result) {
        //                if (result.response.statusCode === 200 || result.response.statusCode === 201) { //because our API doc is undecided
        //                    logger.info("file uploaded");
        //                    if (!result.response.headers.etag) {
        //                        throw new Error("Etag header missing");
        //                    }
        //                    console.log(response.headers.etag, response.headers);
        //                    defer.resolve(response.headers.etag);
        //                    //replace this with passing on the returned value once API gets fixed
        //
        //                } else {
        //                    logger.error("problem", response.statusCode, body);
        //                    defer.reject(response.statusCode);
        //                }
        //            });
    });
}

function getFileStream(pathFromRoot, versionEntryId) {
    //TODO
    var queryParams = (versionEntryId) ? {
        "entry_id": versionEntryId
    } : undefined;
    return sendRequest({
        method: "GET",
        qs: queryParams,
        uri: egnyteOptions.contentAddress + egnyteOptions.jiveRoot + encodeURI(pathFromRoot),
    });
}


module.exports = function (Storage) {

    util.inherits(StreamsExtendedStorage, Storage);

    StreamsExtendedStorage.prototype.getFileStream = getFileStream;
    StreamsExtendedStorage.prototype.storeFile = storeFile;


    return StreamsExtendedStorage;

};