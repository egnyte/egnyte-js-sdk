var oauthRegex = /access_token=([^&]+)/;

var token;
var options;

var promises = require('../promises');
var xhr = require("xhr");




function reloadForToken() {
    window.location.href = options.egnyteDomainURL + "/puboauth/token?client_id=" + options.key + "&mobile=" + ~~(options.mobile) + "&redirect_uri=" + window.location.href;
}

function checkTokenResponse(success, none) {
    if (!token) {
        var access = oauthRegex.exec(window.location.hash);

        if (access) {
            if (access.length > 1) {

                token = access[1];
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

function requestTokenInplace(callback) {
    checkTokenResponse(callback, reloadForToken);
}

function onTokenReady(callback) {
    checkTokenResponse(callback, function () {});
}

//TODO: implement popup flow
function requestTokenWindow(callback, pingbackURL) {
    //    if (!token) {
    //        var dialog = window.open(options.egnyteDomainURL + "/puboauth/token?client_id=" + options.key + "&mobile=" + ~~(options.mobile) + "&redirect_uri=" + pingbackURL);
    //
    //        //listen for a postmessage from window that gives you a token 
    //    } else {
    //        callback();
    //    }

}

function authorizeXHR(xhr) {
    //assuming token_type was bearer, no use for XHR otherwise, right?
    xhr.setRequestHeader("Authorization", "Bearer " + token);
}

function getHeaders() {
    return {
        "Authorization": "Bearer " + token
    };
}

function getEndpoint() {
    return options.egnyteDomainURL + "/pubapi/v1";
}

function isAuthorized() {
    return !!token;
}

function getToken() {
    return token;
}

function setToken(externalToken) {
    token = externalToken;
}


function dropToken(externalToken) {
    token = null;
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



function sendRequest(opts, callback) {
    if (isAuthorized()) {
        if (opts.params) {
            opts.url += "?" + params(opts.params);
        }
        opts.headers = opts.headers || {};
        opts.headers["Authorization"] = "Bearer " + getToken();
        return xhr(opts, function (error, response, body) {
            try {
                //this shouldn't be required, but server sometimes responds with content-type text/plain
                body = JSON.parse(body);
            } catch (e) {}
            callback.call(this, error, response, body);
        });
    } else {
        callback.call(this, new Error("Not authorized"), {
            statusCode: 0
        }, null);
    }

}

function promiseRequest(opts) {
    var defer = promises.defer();
    try {
        sendRequest(opts, function (error, response, body) {
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
    return defer.promise;
}

module.exports = function (opts) {
    options = opts;

    if (options.token) {
        setToken(options.token);
    }

    return {
        isAuthorized: isAuthorized,
        setToken: setToken,
        requestToken: requestTokenInplace,
        onTokenReady: onTokenReady,
        authorizeXHR: authorizeXHR,
        getHeaders: getHeaders,
        getToken: getToken,
        dropToken: dropToken,
        getEndpoint: getEndpoint,
        sendRequest: sendRequest,
        promiseRequest: promiseRequest
    };
};