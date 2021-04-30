var promises = require("q");
var helpers = require('../reusables/helpers');
var dom = require('../reusables/dom');
var messages = require('../reusables/messages');
var errorify = require("./errorify");
var request = require("request");



function Engine(auth, options) {
    this.auth = auth;
    this.options = options;

    this.requestHandler = (options.httpRequest) ? options.httpRequest : request;

    this.quota = {
        startOfTheSecond: 0,
        calls: 0,
        retrying: 0
    }
    this.queue = [];

    this.queueHandler = helpers.bindThis(this, _rollQueue);

    auth.addRequestEngine(this);

}

var enginePrototypeMethods = {
    Promise: promises
};



//======================================================================
//request handling
function params(obj) {
    var str = [];
    //cachebuster for IE
    //    if (typeof window !== "undefined" && window.XDomainRequest) {
    //        str.push("random=" + (~~(Math.random() * 9999)));
    //    }
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    }
    if (str.length) {
        return "?" + str.join("&");
    } else {
        return "";
    }
}

enginePrototypeMethods.getEndpoint = function () {
    return this.options.egnyteDomainURL + "/pubapi";
}

enginePrototypeMethods.promise = function (value) {
    return promises(value);
}

enginePrototypeMethods.sendRequest = function (opts, callback, forceNoAuth, forceNoRetry) {
    var self = this;
    opts = helpers.extend({}, self.options.requestDefaults, opts); //merging in the defaults
    var originalOpts = helpers.extend({}, opts); //just copying the object
   
    

    if (this.auth.isAuthorized() || forceNoAuth) {
        opts.url += params(opts.params);
        opts.headers = opts.headers || {};
        if (!forceNoAuth) {
            opts.headers["Authorization"] = this.auth.type + " " + this.auth.getToken();
        }
        if (!callback) {
            return self.requestHandler(opts);
        } else {
            var timer;
            var retry = function () {
                self.sendRequest(originalOpts, self.retryHandler(callback, retry, timer, forceNoRetry));
            };
            if (self.timerStart) {
                timer = self.timerStart();
            }
            
            return self.requestHandler(opts, self.retryHandler(callback, retry, timer, forceNoRetry));
        }
    } else {
        callback.call(this, new Error("Not authorized"), {
            statusCode: 0
        }, null);
    }

}

enginePrototypeMethods.retryHandler = function (callback, retry, timer, forceNoRetry) {
    var self = this;
    return function (error, response, body) {
        //build an error object for http errors
        if (!error && response.statusCode >= 400 && response.statusCode < 600) {
            error = new Error(body);
        }
        try {
            //this shouldn't be required, but server sometimes responds with content-type text/plain
            body = JSON.parse(body);
        } catch (e) {}

        if (response) {
            var retryAfter = response.headers["retry-after"];
            var masheryCode = response.headers["x-mashery-error-code"];
            //in case headers get returned as arrays, we only expect one value
            retryAfter = typeof retryAfter === "array" ? retryAfter[0] : retryAfter;
            masheryCode = typeof masheryCode === "array" ? masheryCode[0] : masheryCode;
        }

        if (
            response &&
            self.options.handleQuota &&
            response.statusCode === 403 &&
            retryAfter &&
            !forceNoRetry
        ) {
            if (masheryCode === "ERR_403_DEVELOPER_OVER_QPS") {
                //retry
                console && console.warn("developer over QPS, retrying");
                self.quota.retrying = 1000 * ~~(retryAfter);
                setTimeout(function () {
                    self.quota.retrying = 0;
                    retry();

                }, self.quota.retrying);

            }
            if (masheryCode === "ERR_403_DEVELOPER_OVER_RATE") {
                error.RATE = true;
                callback.call(this, error, response, body);
            }

        } else {

            if (
                response &&
                //Checking for failed auth responses
                //(ノಠ益ಠ)ノ彡┻━┻
                self.options.onInvalidToken &&
                (
                    response.statusCode === 401 ||
                    (
                        response.statusCode === 403 &&
                        masheryCode === "ERR_403_DEVELOPER_INACTIVE"
                    )
                )
            ) {
                self.auth.dropToken();
                self.options.onInvalidToken();
            }
            if (self.timerEnd) {
                self.timerEnd(timer);
            }
            callback.call(this, error, response, body);
        }
    };
}

enginePrototypeMethods.retrieveStreamFromRequest = function (opts) {
    var defer = promises.defer();
    var self = this;
    var requestFunction = function () {

        try {
            var req = self.sendRequest(opts);
            defer.resolve(req);
        } catch (error) {
            defer.reject(errorify({
                error: error
            }));
        }
    }

    if (!this.options.handleQuota) {
        requestFunction();
    } else {
        //add to queue
        this.queue.push(requestFunction);
        //stop previous queue processing if any
        clearTimeout(this.quota.to);
        //start queue processing
        this.queueHandler();
    }
    return defer.promise;
}

enginePrototypeMethods.promiseRequest = function (opts, requestHandler, forceNoAuth, forceNoRetry) {
    var defer = promises.defer();
    var self = this;
    var requestFunction = function () {
        try {
            var req = self.sendRequest(opts, function (error, response, body) {
                if (error) {
                    defer.reject(errorify({
                        error: error,
                        response: response,
                        body: body
                    }));
                } else {
                    defer.resolve({
                        response: response,
                        body: body
                    });
                }
            }, forceNoAuth, forceNoRetry);
            requestHandler && requestHandler(req);
        } catch (error) {
            defer.reject(errorify({
                error: error
            }));
        }
    }
    if (!this.options.handleQuota) {
        requestFunction();
    } else {
        //add to queue
        this.queue.push(requestFunction);
        //stop previous queue processing if any
        clearTimeout(this.quota.to);
        //start queue processing
        this.queueHandler();
    }
    return defer.promise;
}

enginePrototypeMethods.setupTiming = function (getTimer, timeEnd) {
    this.timerStart = getTimer;
    this.timerEnd = timeEnd;
}

//gets bound to this in the constructor and saved as this.queueHandler
function _rollQueue() {
    if (this.queue.length) {
        var currentWait = _quotaWaitTime(this.quota, this.options.QPS);
        if (currentWait === 0) {
            var requestFunction = this.queue.shift();
            requestFunction();
            this.quota.calls++;
        }
        this.quota.to = setTimeout(this.queueHandler, currentWait);
    }

}

function _quotaWaitTime(quota, QPS) {
    var now = +new Date();
    var diff = now - quota.startOfTheSecond;
    //in the middle of retrying a denied call
    if (quota.retrying) {
        quota.startOfTheSecond = now + quota.retrying;
        return quota.retrying + 1;
    }
    //last call was over a second ago, can start
    if (diff > 1002) {
        quota.startOfTheSecond = now;
        quota.calls = 0;
        return 0;
    }
    //calls limit not reached
    if (quota.calls < QPS) {
        return 0;
    }
    //calls limit reached, delay to the next second
    return 1003 - diff;
}


Engine.prototype = enginePrototypeMethods;

module.exports = Engine;