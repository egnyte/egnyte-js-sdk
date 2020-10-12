var promises = require("q");
var helpers = require('../reusables/helpers');

var ENDPOINTS_fsmeta = require("../enum/endpoints").fsmeta;

exports.lock = function (pathFromRoot, lockTokenOrBody, timeout) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var body = {
            "action": "lock"
        }
        // Old style JS function signature override
        if (typeof lockTokenOrBody === "object" && lockTokenOrBody != null){
            body = Object.assign(body,lockTokenOrBody)
        } else {
            if (lockTokenOrBody) {
                body.lock_token = lockTokenOrBody;
            }
            if (timeout) {
                body.lock_timeout = timeout;
            }
        }
        var opts = {
            method: "POST",
            url: requestEngine.getEndpoint() + ENDPOINTS_fsmeta + helpers.encodeURIPath(pathFromRoot),
            json: body
        };
        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        result.body.path = pathFromRoot;
        return result.body;
    });
}


exports.unlock = function (pathFromRoot, lockToken) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var body = {
            "action": "unlock",
            "lock_token": lockToken
        }
        var opts = {
            method: "POST",
            url: requestEngine.getEndpoint() + ENDPOINTS_fsmeta + helpers.encodeURIPath(pathFromRoot),
            json: body
        };
        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        return {
            path: pathFromRoot
        };
    });
}