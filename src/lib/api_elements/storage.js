//porting from nodejs app in progress

var promises = require('../promises');
var xhr = require("xhr");


var api;
var options;

var fsmeta = "/fs";
var fscontent = "/fs-content";

var quota = /<h1>Developer Over Qps<\/h1>/gi;

function sendRequest(opts, callback) {
    if (api.isAuthenticated()) {
        opts.headers = opts.headers || {};
        opts.headers["Authorization"] = "Bearer " + api.getToken();
        return xhr(opts, function (error, response, body) {
            if (response.statusCode == 403 && quota.test(response.responseText)) {
                throw new Error(response.responseText);
            } else {
                callback.apply(this, arguments);
            }
        });
    } else {
        throw new Error("Not authenticated");
    }

}

function encodeNameSafe(name) {
    name.split("/").map(function (e) {
        return e.replace(/[^a-z0-9 ]*/gi, "");
    })
        .join("/")
        .replace(/^\//, "");

    return (name);
}

function exists(pathFromRoot) {
    var defer = promises.defer();
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";

    sendRequest({
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
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";

    sendRequest({
        method: "GET",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
    }, function (error, response, body) {
        defer.resolve(body);
    });
    return defer.promise;
}

function createFolder(pathFromRoot) {
    var defer = promises.defer();
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";
    sendRequest({
        method: "POST",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
        json: {
            "action": "add_folder"
        }
    }, function (error, response, body) {
        if (response.statusCode == 201) {

            defer.resolve({
                id: response.headers.etag,
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
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";
    newPath = encodeNameSafe(newPath);
    sendRequest({
        method: "POST",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
        json: {
            "action": "move",
            "destination": "/" + newPath,
        }
    }, function (error, response, body) {
        if (response.statusCode == 200) {

            defer.resolve({
                id: response.headers.etag,
                path: pathFromRoot
            });
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}

function removeFolder(pathFromRoot) {
    var defer = promises.defer();
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";
    sendRequest({
        method: "DELETE",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
    }, function (error, response, body) {
        if (response.statusCode == 200 /*|| response.statusCode == 404*/ ) {
            defer.resolve();
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}



function storeFile(pathFromRoot, fileInput) {
    if (!window.FormData) {
        throw new Error("Unsupported browser");
    }
    var defer = promises.defer();
    var file = fileInput.files[0];
    var formData = new window.FormData();
    formData.append('file', file);
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";

    sendRequest({
        method: "POST",
        url: api.getEndpoint() + fscontent + "/" + encodeURI(pathFromRoot),
        body: formData,
    }, function (error, response, body) {
        if (response.statusCode === 200 || response.statusCode === 201) {
            defer.resolve(response.headers.etag);
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}


function removeVersion(pathFromRoot, versionEntryId) {
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";
    var opts = {
        method: "DELETE",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
    };
    var defer = promises.defer();
    if (versionEntryId) {
        opts.url += "?entry_id=" + versionEntryId;
    }
    sendRequest(opts, function (error, response, body) {
        if (response.statusCode == 200 /*|| response.statusCode == 404*/ ) {
            defer.resolve();
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}

module.exports = function (apihelper, opts) {
    options = opts;
    api = apihelper;
    return {
        exists: exists,
        get: get,
        createFolder: createFolder,
        removeFolder: removeFolder,
        move: move,
        rename: move,

        storeFile: storeFile,
        removeVersion: removeVersion,
        removeFile: removeVersion
    };
};