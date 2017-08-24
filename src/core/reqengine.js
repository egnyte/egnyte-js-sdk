var errorify = require("./errors/errorify");

var enginePrototypeMethods = {};

function Engine(options) {
    this.authType = "Bearer";
    this.options = options;
    this.token = options.token;

    this.requestHandler = options.httpRequest;

    this.quota = {
        startOfTheSecond: 0,
        calls: 0,
        retrying: 0
    }
    this.queue = [];

    this.queueHandler = _rollQueue.bind(this);
}
Engine.prototype = enginePrototypeMethods;

module.exports = function createEngine(options) {
    return new Engine(options);
}



//======================================================================
// auth


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


//======================================================================
//request handling
function params(obj) {
    var str = [];
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
enginePrototypeMethods.getEndpoint = function (appendice) {
    var endpoint = this.options.egnyteDomainURL + "/pubapi";
    if (appendice) {
        if (appendice.charAt(0) !== "/") {
            appendice = "/" + appendice
        }
        endpoint += appendice
    }
    return endpoint
}

enginePrototypeMethods.sendRequest = function (opts, callback, forceNoAuth) {
    var self = this;
    opts = Object.assign({}, self.options.requestDefaults, opts); //merging in the defaults
    var originalOpts = Object.assign({}, opts); //just copying the object

    if (this.isAuthorized() || forceNoAuth) {
        opts.url += params(opts.params);
        opts.headers = opts.headers || {};
        if (!forceNoAuth) {
            opts.headers["Authorization"] = this.authType + " " + this.getToken();
        }
        if (!callback) {
            return self.requestHandler(opts);
        } else {
            var timer;
            var retry = function () {
                self.sendRequest(originalOpts, self.retryHandler(callback, retry, timer));
            };
            if (self.timerStart) {
                timer = self.timerStart();
            }

            return self.requestHandler(opts, self.retryHandler(callback, retry, timer));
        }
    } else {
        callback.call(this, new Error("Not authorized"), {
            statusCode: 0
        }, null);
    }

}

enginePrototypeMethods.retryHandler = function (callback, retry, timer) {
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
            retryAfter
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
    var self = this;
    return new Promise(function(resolve, reject){
        var requestFunction = function () {

            try {
                var req = self.sendRequest(opts);
                resolve(req);
            } catch (error) {
                reject(errorify({
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
    })
}

enginePrototypeMethods.promiseRequest = function (opts, requestHandler, forceNoAuth) {
    var self = this;
    return new Promise(function(resolve, reject){
        var requestFunction = function () {
            try {
                var req = self.sendRequest(opts, function (error, response, body) {
                    if (error) {
                        reject(errorify({
                            error: error,
                            response: response,
                            body: body
                        }));
                    } else {
                        resolve({
                            response: response,
                            body: body
                        });
                    }
                }, forceNoAuth);
                requestHandler && requestHandler(req);
            } catch (error) {
                reject(errorify({
                    error: error
                }));
            }
        }
        if (!self.options.handleQuota) {
            requestFunction();
        } else {
            //add to queue
            self.queue.push(requestFunction);
            //stop previous queue processing if any
            clearTimeout(self.quota.to);
            //start queue processing
            self.queueHandler();
        }
    })
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
    var now = Date.now();
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
