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
                    id: result.response.headers["etag"],
                    path: pathFromRoot
                });
            });
    });
}

function getFileStream(pathFromRoot, versionEntryId) {
    var requestEngine = this.requestEngine;
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot);

    var opts = {
        method: "GET",
        url: requestEngine.getEndpoint() + fscontent + encodeURI(pathFromRoot),
    }
    if (versionEntryId) {
        opts.params = opts.qs = { //xhr and request differ here
            "entry_id": versionEntryId
        };
    }

    return requestEngine.sendRequest(opts);
}


module.exports = function (Storage) {

    util.inherits(StreamsExtendedStorage, Storage);

    StreamsExtendedStorage.prototype.getFileStream = getFileStream;
    StreamsExtendedStorage.prototype.storeFile = storeFile;


    return StreamsExtendedStorage;

};