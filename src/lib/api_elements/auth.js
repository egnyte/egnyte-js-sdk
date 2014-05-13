var oauthRegex = /access_token=([^&]+)/;

var token;
var options;



function authenticateInplace(callback) {
    if (!token) {
        var access = oauthRegex.exec(window.location.hash);

        if (access) {
            if (access.length > 2) {

                token = access[1];
                callback();

            } else {
                //what now?
            }
        } else {
            window.location.href = options.egnyteDomainURL + "/puboauth/token?client_id=" + options.key + "&mobile=" + ~~(options.mobile) + "&redirect_uri=" + window.location.href;
        }
    } else {
        callback();
    }
}

//TODO: implement popup flow
function authenticateWindow(callback, pingbackURL) {
    if (!token) {
        var dialog = window.open(options.egnyteDomainURL + "/puboauth/token?client_id=" + options.key + "&mobile=" + ~~(options.mobile) + "&redirect_uri=" + pingbackURL);

        //listen for a postmessage from window that gives you a token 
    } else {
        callback();
    }

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

function isAuthenticated() {
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

module.exports = function (opts) {
    options = opts;

    if (options.token) {
        setToken(options.token);
    }

    return {
        isAuthenticated: isAuthenticated,
        setToken: setToken,
        authenticate: authenticateInplace,
        authorizeXHR: authorizeXHR,
        getHeaders: getHeaders,
        getToken: getToken,
        dropToken: dropToken,
        getEndpoint: getEndpoint
    };
};