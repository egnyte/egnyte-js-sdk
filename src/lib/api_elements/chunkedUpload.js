var promises = require("q");
var helpers = require('../reusables/helpers');
var ENDPOINTS = require("../enum/endpoints");


function genericUpload(requestEngine, decorate, pathFromRoot, headers, file) {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

    var opts = {
        headers: headers,
        method: "POST",
        url: requestEngine.getEndpoint() + ENDPOINTS.fschunked + encodeURI(pathFromRoot),
        body: file,
    }

    return requestEngine.promiseRequest(decorate(opts));
}

function ChunkedUploader(pathFromRoot, id) {
    this.id = id;
    this.path = pathFromRoot;
    this.num = 0;
    this.deferd = promises.defer();
}

var chunkedUploaderProto = {};

chunkedUploaderProto.sendChunk = function (content, num) {
    var self = this;
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        if (num) {
            self.num = num;
        } else {
            num = (++self.num);
        }
        var headers = {
            "X-Egnyte-Upload-Id": self.id,
            "X-Egnyte-Chunk-Num": self.num,

        };
        if (mimeType) {
            opts.headers["Content-Type"] = mimeType;
        }
        return genericUpload(requestEngine, decorate, self.path, headers, content);

    }).fail(function (err) {
        err.num = num;
        self.deferd.reject(err);
        throw err;
    });
};

chunkedUploaderProto.retryChunk = function (content, num) {
    this.deferd = promises.defer();
    return this.sendChunk(content, num);
}

chunkedUploaderProto.sendLastChunk = function (content) {
    var self = this;
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();

    var headers = {
        "X-Egnyte-Upload-Id": self.id,
        "X-Egnyte-Last-Chunk": true,

    };
    if (mimeType) {
        opts.headers["Content-Type"] = mimeType;
    }
    genericUpload(requestEngine, decorate, self.path, headers, content)
        .then(function (result) {
            //operations on result?
            self.deferd.resolve(result);
        }, function (err) {
            self.deferd.reject(err);
        });

    //will autofail if one of the intermediate chunks failed
    return this.deferd;//rethink this magic
}

export.startChunkedUpload = function (pathFromRoot, fileOrBlob, mimeType) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        var file = fileOrBlob;
        var headers = {};
        if (mimeType) {
            headers["Content-Type"] = mimeType;
        }
        return genericUpload(requestEngine, pathFromRoot, headers, fileOrBlob);
    }).then(function (result) { //result.response result.body
        return new ChunkedUploader(pathFromRoot, decorate, result.response.headers["X-Egnyte-Upload-Id"]);
    });

}