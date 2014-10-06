var promises = require("q");
var helpers = require('../reusables/helpers');
var decorators = require("./decorators");

var APIROOTS = {
    fsmeta: "/fs",
    fscontent: "/fs-content",
    notes: "/notes"
};


function Storage(requestEngine) {
    this.requestEngine = requestEngine;
    decorators.install(this);
}

var storageProto = {};
storageProto.exists = function (pathFromRoot, versionEntryId) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + APIROOTS.fsmeta + encodeURI(pathFromRoot),
        };

        if (versionEntryId) {
            opts.params = {
                "entry_id": versionEntryId
            };
        }

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
            url: requestEngine.getEndpoint() + APIROOTS.fsmeta + encodeURI(pathFromRoot),
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

storageProto.download = function (pathFromRoot, versionEntryId, isBinary) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);

        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + APIROOTS.fscontent + encodeURI(pathFromRoot),
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
            url: requestEngine.getEndpoint() + APIROOTS.fsmeta + encodeURI(pathFromRoot),
            json: {
                "action": "add_folder"
            }
        };
        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        if (result.response.statusCode == 201) {
            return {
                id: result.response.headers["etag"],
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
            url: requestEngine.getEndpoint() + APIROOTS.fsmeta + encodeURI(pathFromRoot),
            json: {
                "action": action,
                "destination": "/" + newPath,
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
            url: requestEngine.getEndpoint() + APIROOTS.fscontent + encodeURI(pathFromRoot),
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
//            url: api.getEndpoint() + fscontent + encodeURI(pathFromRoot),
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
            url: requestEngine.getEndpoint() + APIROOTS.fsmeta + encodeURI(pathFromRoot),
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


storageProto.remove = function (pathFromRoot) {
    var decorate = this.getDecorator();
    return remove(this.requestEngine, decorate, pathFromRoot);
}

storageProto.addNote = function (pathFromRoot, body) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
            method: "POST",
            url: requestEngine.getEndpoint() + APIROOTS.notes,
            json: {
                "path": pathFromRoot,
                "body": body,
            }
        };
        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        return {
            id: result.response.headers.location.replace(/^.*\/([^/]+)$/, "$1")
        };
    });

}
storageProto.listNotes = function (pathFromRoot, params) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + APIROOTS.notes
        };

        //xhr and request differ here
        opts.params = opts.qs = helpers.extend({
            "file": encodeURI(pathFromRoot)
        }, params);

        return requestEngine.promiseRequest(decorate(opts));
    });

}

storageProto.getNote = function (id) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        var opts = {
            method: "POST",
            url: requestEngine.getEndpoint() + APIROOTS.notes + encodeURI(id)
        };
        return requestEngine.promiseRequest(decorate(opts));
    });

}
storageProto.removeNote = function (id) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        var opts = {
            method: "DELETE",
            url: requestEngine.getEndpoint() + APIROOTS.notes + encodeURI(id)
        };
        return requestEngine.promiseRequest(decorate(opts));
    });

}






Storage.prototype = storageProto;

module.exports = Storage;