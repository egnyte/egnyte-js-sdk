var promises = require("q");
var helpers = require('../reusables/helpers');

var fsmeta = "/fs";
var fscontent = "/fs-content";


function Storage(requestEngine) {
    this.requestEngine = requestEngine;
}

var storageProto = {};
storageProto.exists = function (pathFromRoot) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);

        return requestEngine.promiseRequest({
            method: "GET",
            url: requestEngine.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
        });
    }).then(function (result) { //result.response result.body
        if (result.response.statusCode == 200) {
            return true;
        } else {
            return false;
        }
    }, function (result) { //result.error result.response, result.body
        if (result.response && result.response.statusCode == 404) {
            return false;
        } else {
            throw result;
        }
    });
}

storageProto.get = function (pathFromRoot) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);

        return requestEngine.promiseRequest({
            method: "GET",
            url: requestEngine.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
        });
    }).then(function (result) { //result.response result.body
        return result.body;
    });
}

storageProto.download = function (pathFromRoot, isBinary) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);

        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + fscontent + encodeURI(pathFromRoot),
        }

        if (isBinary) {
            opts.responseType = "arraybuffer";
        }

        return requestEngine.promiseRequest(opts);
    }).then(function (result) { //result.response result.body
        return result.response;
    });
}

storageProto.createFolder = function (pathFromRoot) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        return requestEngine.promiseRequest({
            method: "POST",
            url: requestEngine.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
            json: {
                "action": "add_folder"
            }
        });
    }).then(function (result) { //result.response result.body
        if (result.response.statusCode == 201) {
            return {
                path: pathFromRoot
            };
        }
    });
}

storageProto.move = function (pathFromRoot, newPath) {
    return transfer(this.requestEngine, pathFromRoot, newPath, "move");
}

storageProto.copy = function (pathFromRoot, newPath) {
    return transfer(this.requestEngine, pathFromRoot, newPath, "copy");
}

function transfer(requestEngine, pathFromRoot, newPath, action) {
    return promises(true).then(function () {
        if (!newPath) {
            throw new Error("Cannot move to empty path");
        }
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        newPath = helpers.encodeNameSafe(newPath);
        return requestEngine.promiseRequest({
            method: "POST",
            url: requestEngine.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
            json: {
                "action": action,
                "destination": "/" + newPath,
            }
        });
    }).then(function (result) { //result.response result.body
        if (result.response.statusCode == 200) {
            return {
                oldPath: pathFromRoot,
                path: newPath
            };
        }
    });
}



storageProto.storeFile = function (pathFromRoot, fileOrBlob) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        var file = fileOrBlob;
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

        return requestEngine.promiseRequest({
            method: "POST",
            url: requestEngine.getEndpoint() + fscontent + encodeURI(pathFromRoot),
            body: file,
        });
    }).then(function (result) { //result.response result.body
        return ({
            id: result.response.headers["etag"],
            path: pathFromRoot
        });
    });
}

//currently not supported by back-end
//function storeFileMultipart(pathFromRoot, fileOrBlob) {
//    return promises(true).then(function () {
//        if (!window.FormData) {
//            throw new Error("Unsupported browser");
//        }
//        var file = fileOrBlob;
//        var formData = new window.FormData();
//        formData.append('file', file);
//        pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
//
//        return api.promiseRequest({
//            method: "POST",
//            url: api.getEndpoint() + fscontent + encodeURI(pathFromRoot),
//            body: formData,
//        });
//    }).then(function (result) { //result.response result.body
//        return ({
//            id: result.response.headers["etag"],
//            path: pathFromRoot
//        });
//    });
//}


//private
function remove(requestEngine, pathFromRoot, versionEntryId) {
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
        var opts = {
            method: "DELETE",
            url: requestEngine.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
        };
        if (versionEntryId) {
            opts.params = {
                "entry_id": versionEntryId
            };
        }
        return requestEngine.promiseRequest(opts);

    }).then(function (result) { //result.response result.body
        return result.response.statusCode;
    });
}

storageProto.removeFileVersion = function (pathFromRoot, versionEntryId) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        if (!versionEntryId) {
            throw new Error("Version ID (second argument) is missing");
        }
        return remove(requestEngine, pathFromRoot, versionEntryId)
    });
}


storageProto.remove = function (pathFromRoot) {
    return remove(this.requestEngine, pathFromRoot);
}

Storage.prototype = storageProto;

module.exports = Storage;