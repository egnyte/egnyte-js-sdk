function normalizeURL(url) {
    return (url).replace(/\/*$/, "");
}

function encodeNameSafe(name) {
    name.split("/").map(function (e) {
        return e.replace(/[^a-z0-9 ]*/gi, "");
    })
        .join("/")
        .replace(/^\//, "");

    return (name);
}
//simple extend function
function extend(target) {
    var i, k;
    for (i = 1; i < arguments.length; i++) {
        if (arguments[i]) {
            for (k in arguments[i]) {
                if (arguments[i].hasOwnProperty(k)) {
                    target[k] = arguments[i][k];
                }
            }
        }

    }
    return target;
}

module.exports = {
    extend: extend,
    normalizeURL: normalizeURL,
    encodeNameSafe: encodeNameSafe
};