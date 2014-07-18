var oauthRegex = /access_token=([^&]+)/;
var oauthDeniedRegex = /\?error=access_denied/;
var quotaRegex = /^<h1>Developer Over Qps/i;


var promises = require('../promises');
var helpers = require('../reusables/helpers');
var dom = require('../reusables/dom');
var messages = require('../reusables/messages');
var errorify = require("./errorify");
var xhr = require("xhr");



function Engine(options) {
    this.options = options;
    if (this.options.token) {
        this.token = this.options.token;
    }
    this.userInfo = null;
    this.quota = {
        startOfTheSecond: 0,
        calls: 0,
        retrying: 0
    }
    this.queue = [];

    this.queueHandler = helpers.bindThis(this, _rollQueue);

}

var enginePrototypeMethods = {};

enginePrototypeMethods._reloadForToken = function () {
    window.location.href = this.options.egnyteDomainURL + "/puboauth/token?client_id=" + this.options.key + "&mobile=" + ~~(this.options.mobile) + "&redirect_uri=" + window.location.href;
}

enginePrototypeMethods._checkTokenResponse = function (success, denied, notoken, overrideWindow) {
    var win = overrideWindow || window;
    if (!this.token) {
        this.userInfo = null;
        var access = oauthRegex.exec(win.location.hash);
        if (access) {
            if (access.length > 1) {
                this.token = access[1];
                //overrideWindow || (window.location.hash = "");
                success && success();
            } else {
                //what now?
            }
        } else {
            if (oauthDeniedRegex.test(win.location.href)) {
                denied && denied();
            } else {
                notoken && notoken();
            }
        }
    } else {
        success && success();
    }
}

enginePrototypeMethods.requestTokenReload = function (callback, denied) {
    this._checkTokenResponse(callback, denied, helpers.bindThis(this, this._reloadForToken));
}

enginePrototypeMethods.requestTokenIframe = function (targetNode, callback, denied, emptyPageURL) {
    if (!this.token) {
        var self = this;
        var locationObject = window.location;
        emptyPageURL = (emptyPageURL) ? locationObject.protocol + "//" + locationObject.host + emptyPageURL : locationObject.href;
        var url = this.options.egnyteDomainURL + "/puboauth/token?client_id=" + this.options.key + "&mobile=" + ~~(this.options.mobile) + "&redirect_uri=" + emptyPageURL;
        var iframe = dom.createFrame(url, !!"scrollbars please");
        iframe.onload = function () {
            try {
                var location = iframe.contentWindow.location;
                var override = {
                    location: {
                        hash: "" + location.hash,
                        href: "" + location.href
                    }
                };

                self._checkTokenResponse(function () {
                    iframe.src = "";
                    targetNode.removeChild(iframe);
                    callback();
                }, function () {
                    iframe.src = "";
                    targetNode.removeChild(iframe);
                    denied();
                }, null, override);
            } catch (e) {}
        }
        targetNode.appendChild(iframe);
    } else {
        callback();
    }

}


enginePrototypeMethods._postTokenUp = function () {
    var self = this;
    if (!this.token && window.name === this.options.channelMarker) {
        var channel = {
            marker: this.options.channelMarker,
            sourceOrigin: this.options.egnyteDomainURL
        };

        this._checkTokenResponse(function () {
            messages.sendMessage(window.opener, channel, "token", self.token);
        }, function () {
            messages.sendMessage(window.opener, channel, "denied", "");
        });

    }
}
enginePrototypeMethods.requestTokenPopup = function (callback, denied, recvrURL) {
    var self = this;
    if (!this.token) {
        var url = this.options.egnyteDomainURL + "/puboauth/token?client_id=" + this.options.key + "&mobile=" + ~~(this.options.mobile) + "&redirect_uri=" + recvrURL;
        var win = window.open(url);
        win.name = this.options.channelMarker;
        var handler = messages.createMessageHandler(null, this.options.channelMarker, function (message) {
            listener.destroy();
            win.close();
            if (message.action === "token") {
                self.token = message.data;
                callback && callback();
            }
            if (message.action === "denied") {
                denied && denied();
            }
        });
        var listener = dom.addListener(window, "message", handler);
    } else {
        callback();
    }

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


//======================================================================
//request handling
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
            if (response.getResponseHeader) {
                var retryAfter = response.getResponseHeader("Retry-After");
                var masheryCode = response.getResponseHeader("X-Mashery-Error-Code")
            }
            if (
                self.options.handleQuota &&
                response.statusCode === 403 &&
                retryAfter
            ) {
                if (masheryCode === "ERR_403_DEVELOPER_OVER_QPS") {
                    //retry
                    console && console.warn("develoer over QPS, retrying");
                    self.quota.retrying = 1000 * ~~(retryAfter);
                    setTimeout(function () {
                        self.quota.retrying = 0;
                        self.sendRequest(originalOpts, callback);
                    }, self.quota.retrying);

                }
                if (masheryCode === "ERR_403_DEVELOPER_OVER_RATE") {
                    error.RATE = true;
                    callback.call(this, error, response, body);
                }

            } else {

                if (
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
                    self.dropToken();
                    self.options.onInvalidToken();
                }

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
    var requestFunction = function () {
        try {
            self.sendRequest(opts, function (error, response, body) {
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
            });
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
    if (diff > 1000) {
        quota.startOfTheSecond = now;
        quota.calls = 0;
        return 0;
    }
    //calls limit not reached
    if (quota.calls < QPS) {
        return 0;
    }
    //calls limit reached, delay to the next second
    return 1001 - diff;
}

//======================================================================
//api facade

enginePrototypeMethods.getUserInfo = function () {
    var self = this;
    if (self.userInfo) {
        return promises.start(true).then(function () {
            return self.userInfo;
        });
    } else {
        return this.promiseRequest({
            method: "GET",
            url: this.getEndpoint() + "/userinfo",
        }).then(function (result) { //result.response result.body
            self.userInfo = result.body;
            return result.body;
        });
    }
}

Engine.prototype = enginePrototypeMethods;

module.exports = function (opts) {
    return new Engine(opts);
};