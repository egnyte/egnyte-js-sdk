var oauthRegex = /access_token=([^&]+)/;
var oauthDeniedRegex = /error=access_denied/;

var promises = require("q");
var helpers = require('../reusables/helpers');
var dom = require('../reusables/dom');
var messages = require('../reusables/messages');
var errorify = require("./errorify");

var ENDPOINTS_userinfo = require("../enum/endpoints").userinfo;
var ENDPOINTS_tokenauth = require("../enum/endpoints").tokenauth;


function Auth(options) {
    this.type = "Bearer";
    this.options = options;
    if (this.options.token) {
        this.token = this.options.token;
    }
    this.userInfo = null;
    this.getUserInfo = helpers.bindThis(this, this.getUserInfo);

}


var authPrototypeMethods = {};

authPrototypeMethods._buildTokenQuery = function(redirect) {
    var url = this.options.egnyteDomainURL + ENDPOINTS_tokenauth + "?client_id=" + this.options.key + "&mobile=" + ~~(this.options.mobile) + "&redirect_uri=" + encodeURIComponent(redirect);
    if (this.options.scope) {
        url += "&scope=" + this.options.scope;
    }
    return url;
}

authPrototypeMethods._reloadForToken = function () {
    window.location.href = this._buildTokenQuery(window.location.href);
}

authPrototypeMethods._checkTokenResponse = function (success, denied, notoken, overrideWindow) {
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

authPrototypeMethods.requestTokenReload = function (callback, denied) {
    this._checkTokenResponse(callback, denied, helpers.bindThis(this, this._reloadForToken));
}

authPrototypeMethods.requestTokenIframe = function (targetNode, callback, denied, emptyPageURL) {
    if (!this.token) {
        var self = this;
        var locationObject = window.location;

        emptyPageURL = (emptyPageURL) ? locationObject.protocol + "//" + locationObject.host + emptyPageURL : locationObject.href;
        var url = self._buildTokenQuery(emptyPageURL);
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


authPrototypeMethods._postTokenUp = function () {
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

authPrototypeMethods.requestTokenPopup = function (callback, denied, recvrURL) {
    var self = this;
    if (!this.token) {
        var url = this._buildTokenQuery(recvrURL);
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

authPrototypeMethods.requestTokenByPassword = function (username, password) {
    var self = this;

    return this.requestEngine.promiseRequest({
        method: "POST",
        url: this.options.egnyteDomainURL + ENDPOINTS_tokenauth + "",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body: [
            "client_id=" + this.options.key,
            "grant_type=password",
            "username=" + username,
            "password=" + password
        ].join("&")
    }, null, !!"forceNoAuth").then(function (result) { //result.response result.body
        self.token = result.body.access_token
        return self.token;
    });
}

authPrototypeMethods.authorizeXHR = function (xhr) {
    //assuming token_type was bearer, no use for XHR otherwise, right?
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);
}

authPrototypeMethods.getHeaders = function () {
    return {
        "Authorization": "Bearer " + this.token
    };
}


authPrototypeMethods.isAuthorized = function () {
    return !!this.token;
}

authPrototypeMethods.getToken = function () {
    return this.token;
}

authPrototypeMethods.setToken = function (externalToken) {
    this.token = externalToken;
}


authPrototypeMethods.dropToken = function (externalToken) {
    this.token = null;
}


//======================================================================
//api facade


authPrototypeMethods.addRequestEngine = function (requestEngine) {
    this.requestEngine = requestEngine;
}

authPrototypeMethods.getUserInfo = function () {
    var self = this;
    if (self.userInfo || !this.requestEngine) {
        return promises(true).then(function () {
            return self.userInfo;
        });
    } else {
        return this.requestEngine.promiseRequest({
            method: "GET",
            url: this.requestEngine.getEndpoint() + ENDPOINTS_userinfo,
        }).then(function (result) { //result.response result.body
            self.userInfo = result.body;
            return result.body;
        });
    }
}

Auth.prototype = authPrototypeMethods;

module.exports = Auth;