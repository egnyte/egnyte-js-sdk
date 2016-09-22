var promises = require("q");
var helpers = require('../reusables/helpers');
var decorators = require("./decorators");
var notes = require("./notes");
var lock = require("./lock");
var chunkedUpload = require("./chunkedUpload");
var resourceIdentifier = require("./resourceIdentifier");

var ENDPOINTS = require("../enum/endpoints");


function Storage(requestEngine) {
    this.requestEngine = requestEngine;
    decorators.install(this);
}

var storageProto = {};
storageProto.exists = function (pathFromRoot) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + helpers.encodeURIPath(pathFromRoot),
        };

        return requestEngine.promiseRequest(decorate(opts));
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

storageProto.get = function (pathFromRoot, versionEntryId) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + helpers.encodeURIPath(pathFromRoot),
        };

        if (versionEntryId) {
            opts.params = {
                "entry_id": versionEntryId
            };
        }

        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        return result.body;
    });
}

//undocumented, will bo official in v3
storageProto.parents = function (pathFromRoot) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + helpers.encodeURIPath(pathFromRoot) + "/parents",
        };

        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        return result.body;
    });
}

storageProto.download = function (pathFromRoot, versionEntryId, isBinary) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);

        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + ENDPOINTS.fscontent + helpers.encodeURIPath(pathFromRoot),
        }
        if (versionEntryId) {
            opts.params = {
                "entry_id": versionEntryId
            };
        }

        if (isBinary) {
            opts.responseType = "arraybuffer";
        }

        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        return result.response;
    });
}

storageProto.createFolder = function (pathFromRoot) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
            method: "POST",
            url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + helpers.encodeURIPath(pathFromRoot),
            json: {
                "action": "add_folder"
            }
        };
        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        if (result.response.statusCode == 201) {
            return {
                path: pathFromRoot
            };
        }
    });
}

storageProto.move = storageProto.rename = function (pathFromRoot, newPath) {
    return transfer(this.requestEngine, this.getDecorator(), pathFromRoot, newPath, "move");
}

storageProto.copy = function (pathFromRoot, newPath) {
    return transfer(this.requestEngine, this.getDecorator(), pathFromRoot, newPath, "copy");
}

function transfer(requestEngine, decorate, pathFromRoot, newPath, action) {
    return promises(true).then(function () {
        if (!newPath) {
            throw new Error("Cannot move to empty path");
        }
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        newPath = helpers.encodeNameSafe(newPath);
        var opts = {
            method: "POST",
            url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + helpers.encodeURIPath(pathFromRoot),
            json: {
                "action": action,
                "destination": newPath,
            }
        };
        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        if (result.response.statusCode == 200) {
            return {
                oldPath: pathFromRoot,
                path: newPath
            };
        }
    });
}

storageProto.storeFile = function (pathFromRoot, fileOrBlob, mimeType /* optional */ ) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        var file = fileOrBlob;
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

        var opts = {
            method: "POST",
            url: requestEngine.getEndpoint() + ENDPOINTS.fscontent + helpers.encodeURIPath(pathFromRoot),
            body: file,
        }

        opts.headers = {};
        if (mimeType) {
            opts.headers["Content-Type"] = mimeType;
        }

        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        return ({
            id: result.response.headers["etag"],
            group_id: result.body.group_id,
            path: pathFromRoot
        });
    });
}

//currently not supported by back - end
//
//function storeFileMultipart(pathFromRoot, fileOrBlob) {
//    return promises(true).then(function () {
//        if (!window.FormData) {
//            throw new Error("Unsupported browser");
//        }
//        var file = fileOrBlob;
//        var formData = new window.FormData();
//        formData.append('file', file);
//        pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
//        var opts = {
//            method: "POST",
//            url: api.getEndpoint() + fscontent + helpers.encodeURIPath(pathFromRoot),
//            body: formData,
//        };
//        return api.promiseRequest(decorate(opts));
//    }).then(function (result) { //result.response result.body
//        return ({
//            id: result.response.getResponseHeader("etag"),
//            path: pathFromRoot
//        });
//    });
//}


//private
function remove(requestEngine, decorate, pathFromRoot, versionEntryId) {
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
        var opts = {
            method: "DELETE",
            url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + helpers.encodeURIPath(pathFromRoot),
        };
        if (versionEntryId) {
            opts.params = {
                "entry_id": versionEntryId
            };
        }
        return requestEngine.promiseRequest(decorate(opts));

    }).then(function (result) { //result.response result.body
        return result.response.statusCode;
    });
}

storageProto.removeFileVersion = function (pathFromRoot, versionEntryId) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        if (!versionEntryId) {
            throw new Error("Version ID (second argument) is missing");
        }
        return remove(requestEngine, decorate, pathFromRoot, versionEntryId)
    });
}


storageProto.remove = function (pathFromRoot, versionEntryId) {
    var decorate = this.getDecorator();
    return remove(this.requestEngine, decorate, pathFromRoot, versionEntryId);
}

storageProto = helpers.extend(storageProto, lock);
storageProto = helpers.extend(storageProto, chunkedUpload);

Storage.prototype = resourceIdentifier(storageProto);

module.exports = Storage;
