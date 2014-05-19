var promises = require('../promises');
var helpers = require('../reusables/helpers');

var api;
var options;

var fsmeta = "/fs";
var fscontent = "/fs-content";


function exists(pathFromRoot) {
    var defer = promises.defer();
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

    api.sendRequest({
        method: "GET",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
    }, function (error, response, body) {
        if (response.statusCode == 200) {
            defer.resolve(true);
        } else {
            defer.resolve(false);
        }
    });
    return defer.promise;
}

function get(pathFromRoot) {
    var defer = promises.defer();
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

    api.sendRequest({
        method: "GET",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
    }, function (error, response, body) {
        defer.resolve(body);
    });
    return defer.promise;
}

function download(pathFromRoot) {
    var defer = promises.defer();
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

    api.sendRequest({
        method: "GET",
        url: api.getEndpoint() + fscontent + "/" + encodeURI(pathFromRoot),
    }, function (error, response, body) {
        defer.resolve(response);
    });
    return defer.promise;
}

function createFolder(pathFromRoot) {
    var defer = promises.defer();
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
    api.sendRequest({
        method: "POST",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
        json: {
            "action": "add_folder"
        }
    }, function (error, response, body) {
        if (response.statusCode == 201) {
            defer.resolve({
                path: pathFromRoot
            });
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}

function move(pathFromRoot, newPath) {
    if (!newPath) {
        throw new Error("Cannot move to empty path");
    }
    var defer = promises.defer();
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
    newPath = helpers.encodeNameSafe(newPath);
    api.sendRequest({
        method: "POST",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
        json: {
            "action": "move",
            "destination": "/" + newPath,
        }
    }, function (error, response, body) {
        if (response.statusCode == 200) {

            defer.resolve({
                oldPath: pathFromRoot,
                path: newPath
            });
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}


function storeFile(pathFromRoot, fileOrBlob) {
    if (!window.FormData) {
        throw new Error("Unsupported browser");
    }
    var defer = promises.defer();
    var file = fileOrBlob;
    var formData = new window.FormData();
    formData.append('file', file);
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

    api.sendRequest({
        method: "POST",
        url: api.getEndpoint() + fscontent + "/" + encodeURI(pathFromRoot),
        body: formData,
    }, function (error, response, body) {
        if (response.statusCode === 200 || response.statusCode === 201) {
            defer.resolve({
                id: response.getResponseHeader("etag"),
                path: pathFromRoot
            });
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}

function remove(pathFromRoot, versionEntryId) {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
    var opts = {
        method: "DELETE",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
    };
    var defer = promises.defer();
    if (versionEntryId) {
        opts.params = {
            "entry_id": versionEntryId
        };
    }
    api.sendRequest(opts, function (error, response, body) {
        if (response.statusCode == 200 /*|| response.statusCode == 404*/ ) {
            defer.resolve();
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}

function removeFileVersion(pathFromRoot, versionEntryId) {
    if (!versionEntryId) {
        throw new Error("Version ID (second argument) is missing");
    }
    return remove(pathFromRoot, versionEntryId)
}


function removeEntry(pathFromRoot) {
    return remove(pathFromRoot);
}

module.exports = function (apihelper, opts) {
    options = opts;
    api = apihelper;
    return {
        exists: exists,
        get: get,
        download: download,
        createFolder: createFolder,
        move: move,
        rename: move,
        remove: removeEntry,

        storeFile: storeFile,
        removeFileVersion: removeFileVersion
    };
};