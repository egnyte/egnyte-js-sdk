
function normalizeURL(url) {
    return (url).replace(/\/*$/, "");
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
    normalizeURL: normalizeURL
};