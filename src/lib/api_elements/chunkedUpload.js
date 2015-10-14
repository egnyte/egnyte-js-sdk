var promises = require("q");
var helpers = require('../reusables/helpers');
var ENDPOINTS = require("../enum/endpoints");


function genericUpload(requestEngine, decorate, pathFromRoot, headers, file) {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

    var opts = {
        headers: headers,
        method: "POST",
        url: requestEngine.getEndpoint() + ENDPOINTS.fschunked + helpers.encodeURIPath(pathFromRoot),
        body: file,
    }

    return requestEngine.promiseRequest(decorate(opts));
}

function ChunkedUploader(storage, pathFromRoot, mimeType) {
    this.storage = storage;
    this.path = pathFromRoot;
    this.mime = mimeType;
    this.num = 1;
    this.successful = 1;
    this.chunksPromised = [];
}

var chunkedUploaderProto = {};

chunkedUploaderProto.setId = function (id) {
    this.id = id;
};

chunkedUploaderProto.sendChunk = function (content, num, verify) {
    var self = this;
    var requestEngine = this.storage.requestEngine;
    var decorate = this.storage.getDecorator();
    if (num) {
        self.num = num;
    } else {
        num = (++self.num);
    }
    var headers = {
        "x-egnyte-upload-id": self.id,
        "x-egnyte-chunk-num": self.num,

    };
    var promised = genericUpload(requestEngine, decorate, self.path, headers, content)
        .then(function (result) {
            verify && verify(result.response.headers["x-egnyte-chunk-sha512-checksum"]);
            self.successful++;
            return result;
        });
    self.chunksPromised.push(promised);
    return promised;

};


chunkedUploaderProto.sendLastChunk = function (content, verify) {
    var self = this;
    var requestEngine = this.storage.requestEngine;
    var decorate = this.storage.getDecorator();

    var headers = {
        "x-egnyte-upload-id": self.id,
        "x-egnyte-last-chunk": true,
        "x-egnyte-chunk-num": self.num + 1
    };
    if (self.mime) {
        headers["content-type"] = self.mime;
    }

    return promises.allSettled(this.chunksPromised)
        .then(function () {
            if (self.num === self.successful) {
                return genericUpload(requestEngine, decorate, self.path, headers, content)
                    .then(function (result) {
                        verify && verify(result.response.headers["x-egnyte-chunk-sha512-checksum"]);
                        return ({
                            id: result.response.headers["etag"],
                            path: self.path
                        });
                    });
            } else {
                throw new Error("Tried to commit a file with missing chunks (some uploads failed)");
            }
        });

};

ChunkedUploader.prototype = chunkedUploaderProto;

exports.startChunkedUpload = function (pathFromRoot, fileOrBlob, mimeType, verify) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    var chunkedUploader = new ChunkedUploader(this, pathFromRoot, mimeType);
    return promises(true).then(function () {
        var file = fileOrBlob;
        var headers = {};
        if (mimeType) {
            headers["content-type"] = mimeType;
        }
        return genericUpload(requestEngine, decorate, pathFromRoot, headers, fileOrBlob);
    }).then(function (result) { //result.response result.body
        verify && verify(result.response.headers["x-egnyte-chunk-sha512-checksum"]);
        chunkedUploader.setId(result.response.headers["x-egnyte-upload-id"])
        return chunkedUploader;
    });

}