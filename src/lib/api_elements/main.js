var oauthRegex = /access_token=([^&]+)/;
var quotaRegex = /^<h1>Developer Over Qps/i;


var promises = require('../promises');
var helpers = require('../reusables/helpers');
var xhr = require("xhr");


function Engine(options) {
    this.options = options;
    this.quota = {
        startOfTheSecond: 0,
        calls: 0,
        retrying: 0
    }
    this.queue = [];

    if (this.options.token) {
        this.token = this.options.token;
    }
    
    this.queueHandler = helpers.bindThis(this, _rollQueue);

}

var enginePrototypeMethods = {};

enginePrototypeMethods.reloadForToken = function () {
    window.location.href = this.options.egnyteDomainURL + "/puboauth/token?client_id=" + this.options.key + "&mobile=" + ~~(this.options.mobile) + "&redirect_uri=" + window.location.href;
}

enginePrototypeMethods.checkTokenResponse = function (success, none) {
    if (!this.token) {
        var access = oauthRegex.exec(window.location.hash);
        if (access) {
            if (access.length > 1) {
                this.token = access[1];
                success && success();
            } else {
                //what now?
            }
        } else {
            none && none();
        }
    } else {
        success && success();
    }
}

enginePrototypeMethods.requestToken = function (callback) {
    this.checkTokenResponse(callback, this.reloadForToken);
}

enginePrototypeMethods.onTokenReady = function (callback) {
    this.checkTokenResponse(callback, function () {});
}

//TODO: implement popup flow
enginePrototypeMethods.requestTokenWindow = function (callback, pingbackURL) {
    //    if (!this.token) {
    //        var dialog = window.open(this.options.egnyteDomainURL + "/puboauth/token?client_id=" + this.options.key + "&mobile=" + ~~(this.options.mobile) + "&redirect_uri=" + pingbackURL);
    //
    //        //listen for a postmessage from window that gives you a token 
    //    } else {
    //        callback();
    //    }

}

enginePrototypeMethods.authorizeXHR = function (xhr) {
    //assuming token_type was bearer, no use for XHR otherwise, right?
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);
}

enginePrototypeMethods.getHeaders = function () {
    return {
        "Authorization": "Bearer " + this.token
    };
}

enginePrototypeMethods.getEndpoint = function () {
    return this.options.egnyteDomainURL + "/pubapi/v1";
}

enginePrototypeMethods.isAuthorized = function () {
    return !!this.token;
}

enginePrototypeMethods.getToken = function () {
    return this.token;
}

enginePrototypeMethods.setToken = function (externalToken) {
    this.token = externalToken;
}


enginePrototypeMethods.dropToken = function (externalToken) {
    this.token = null;
}

function params(obj) {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    }
    return str.join("&");
}



enginePrototypeMethods.sendRequest = function (opts, callback) {
    var self = this;
    var originalOpts = helpers.extend({}, opts);
    if (this.isAuthorized()) {
        if (opts.params) {
            opts.url += "?" + params(opts.params);
        }
        opts.headers = opts.headers || {};
        opts.headers["Authorization"] = "Bearer " + this.getToken();
        return xhr(opts, function (error, response, body) {
            try {
                //this shouldn't be required, but server sometimes responds with content-type text/plain
                body = JSON.parse(body);
            } catch (e) {}
            if (
                self.options.handleQuota &&
                response.statusCode === 403 &&
                response.getResponseHeader("Retry-After")
            ) {
                //retry
                console && console.warn("develoer over QPS, retrying");
                self.quota.retrying = 1000 * ~~(response.getResponseHeader("Retry-After"));
                setTimeout(function () {
                    self.quota.retrying = 0;
                    self.sendRequest(originalOpts, callback);
                }, self.quota.retrying);

            } else {
                callback.call(this, error, response, body);
            }
        });
    } else {
        callback.call(this, new Error("Not authorized"), {
            statusCode: 0
        }, null);
    }

}

enginePrototypeMethods.promiseRequest = function (opts) {
    var defer = promises.defer();
    var self = this;
    var performRequest = function () {
        try {
            self.sendRequest(opts, function (error, response, body) {
                if (error) {
                    defer.reject({
                        error: error,
                        response: response,
                        body: body
                    });
                } else {
                    defer.resolve({
                        response: response,
                        body: body
                    });
                }
            });
        } catch (error) {
            defer.reject({
                error: error
            });
        }
    }
    this.addToQueue(performRequest);
    return defer.promise;
}

enginePrototypeMethods.addToQueue = function (requestFunction) {
    if (!this.options.handleQuota) {
        requestFunction();
    } else {
        this.queue.push(requestFunction);
        //stop previous queue processing if any
        clearTimeout(this.quota.to);
        //start queue processing
        this.queueHandler();
    }
}

//gets bound to this in the constructor and saved as this.queueHandler
function _rollQueue() {
    if (this.queue.length) {
        var currentWait = this.quotaWaitTime();
        if (currentWait === 0) {
            var requestFunction = this.queue.shift();
            requestFunction();
            this.quota.calls++;
        }
        this.quota.to = setTimeout(this.queueHandler, currentWait);
    }

}

enginePrototypeMethods.quotaWaitTime = function () {
    var now = +new Date();
    var diff = now - this.quota.startOfTheSecond;
    //in the middle of retrying a denied call
    if (this.quota.retrying) {
        this.quota.startOfTheSecond = now + this.quota.retrying;
        return this.quota.retrying + 1;
    }
    //last call was over a second ago, can start
    if (diff > 1000) {
        this.quota.startOfTheSecond = now;
        this.quota.calls = 0;
        return 0;
    }
    //calls limit not reached
    if (this.quota.calls < this.options.QPS) {
        return 0;
    }
    //calls limit reached, delay to the next second
    return 1001 - diff;
}


Engine.prototype = enginePrototypeMethods;

module.exports = function (opts) {
    return new Engine(opts);
};