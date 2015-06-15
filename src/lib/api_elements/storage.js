var promises = require("q");
var helpers = require('../reusables/helpers');
var decorators = require("./decorators");
var notes = require("./notes");
var lock = require("./lock");
var chunkedUpload = require("./chunkedUpload");
var resourceIdSupplier = require("./resourceIdSupplier");

var ENDPOINTS = require("../enum/endpoints");


function Storage(requestEngine) {
    this.requestEngine = requestEngine;
    decorators.install(this);
}

var storageProto = {};
storageProto.exists = function (fullPathOrId) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        fullPathOrId = helpers.encodeNameSafe(fullPathOrId);
        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + encodeURI(fullPathOrId),
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

storageProto.get = function (fullPathOrId, versionEntryId) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        fullPathOrId = helpers.encodeNameSafe(fullPathOrId);
        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + encodeURI(fullPathOrId),
        };

        if (versionEntryId) {
            opts.params = {
                "entry_id": versionEntryId
            };
        }

        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        return resourceIdSupplier.forResource(result.body);
    });
}

storageProto.download = function (fullPathOrId, versionEntryId, isBinary) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        fullPathOrId = helpers.encodeNameSafe(fullPathOrId);

        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + ENDPOINTS.fscontent + encodeURI(fullPathOrId),
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

storageProto.createFolder = function (fullPathOrId) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        fullPathOrId = helpers.encodeNameSafe(fullPathOrId);
        var opts = {
            method: "POST",
            url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + encodeURI(fullPathOrId),
            json: {
                "action": "add_folder"
            }
        };
        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        //TODO: get the API to return a folder object
        if (result.response.statusCode == 201) {
            return {
                path: fullPathOrId
            };
        }
    });
}

storageProto.move = storageProto.rename = function (fullPathOrId, newPath) {
    return transfer(this.requestEngine, this.getDecorator(), fullPathOrId, newPath, "move");
}

storageProto.copy = function (fullPathOrId, newPath) {
    return transfer(this.requestEngine, this.getDecorator(), fullPathOrId, newPath, "copy");
}

function transfer(requestEngine, decorate, fullPathOrId, newPath, action) {
    return promises(true).then(function () {
        if (!newPath) {
            throw new Error("Cannot move to empty path");
        }
        fullPathOrId = helpers.encodeNameSafe(fullPathOrId);
        newPath = helpers.encodeNameSafe(newPath);
        var opts = {
            method: "POST",
            url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + encodeURI(fullPathOrId),
            json: {
                "action": action,
                "destination": newPath,
            }
        };
        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        if (result.response.statusCode == 200) {
            return {
                oldPath: fullPathOrId,
                path: newPath
            };
        }
    });
}

storageProto.storeFile = function (fullPathOrId, fileOrBlob, mimeType /* optional */ ) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        var file = fileOrBlob;
        fullPathOrId = helpers.encodeNameSafe(fullPathOrId) || "";

        var opts = {
            method: "POST",
            url: requestEngine.getEndpoint() + ENDPOINTS.fscontent + encodeURI(fullPathOrId),
            body: file,
        }

        opts.headers = {};
        if (mimeType) {
            opts.headers["Content-Type"] = mimeType;
        }

        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        var resolution = resourceIdSupplier.forResource(result.body);
        resolution.path = fullPathOrId; //backward-compatibility
        resolution.id = result.response.headers["etag"]; //backward-compatibility
        return resolution;
    });
}

//currently not supported by back - end
//
//function storeFileMultipart(fullPathOrId, fileOrBlob) {
//    return promises(true).then(function () {
//        if (!window.FormData) {
//            throw new Error("Unsupported browser");
//        }
//        var file = fileOrBlob;
//        var formData = new window.FormData();
//        formData.append('file', file);
//        fullPathOrId = helpers.encodeNameSafe(fullPathOrId) || "";
//        var opts = {
//            method: "POST",
//            url: api.getEndpoint() + fscontent + encodeURI(fullPathOrId),
//            body: formData,
//        };
//        return api.promiseRequest(decorate(opts));
//    }).then(function (result) { //result.response result.body
//        return ({
//            id: result.response.getResponseHeader("etag"),
//            path: fullPathOrId
//        });
//    });
//}


//private
function remove(requestEngine, decorate, fullPathOrId, versionEntryId) {
    return promises(true).then(function () {
        fullPathOrId = helpers.encodeNameSafe(fullPathOrId) || "";
        var opts = {
            method: "DELETE",
            url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + encodeURI(fullPathOrId),
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

storageProto.removeFileVersion = function (fullPathOrId, versionEntryId) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        if (!versionEntryId) {
            throw new Error("Version ID (second argument) is missing");
        }
        return remove(requestEngine, decorate, fullPathOrId, versionEntryId)
    });
}


storageProto.remove = function (fullPathOrId, versionEntryId) {
    var decorate = this.getDecorator();
    return remove(this.requestEngine, decorate, fullPathOrId, versionEntryId);
}

storageProto = helpers.extend(storageProto, notes);
storageProto = helpers.extend(storageProto, lock);
storageProto = helpers.extend(storageProto, chunkedUpload);

Storage.prototype = storageProto;

module.exports = Storage;