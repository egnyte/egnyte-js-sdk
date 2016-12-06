function each(collection, fun) {
    if (collection) {
        if (collection.length === +collection.length) {
            for (var i = 0; i < collection.length; i++) {
                fun.call(null, collection[i], i, collection);
            }
        } else {
            for (var i in collection) {
                if (collection.hasOwnProperty(i)) {
                    fun.call(null, collection[i], i, collection);
                }
            }
        }
    }
}

function contains(arr, val) {
    var found = false;
    each(arr, function (v) {
        if (v === val) {
            found = true;
        }
    })
    return found;
}
var disallowedChars = /[":<>|?*\\]/;

function normalizeURL(url) {
    return (url).replace(/\/*$/, "");
};

function normalizePath(path) {
    return (path).replace(/\/*$/, "") || "/";
};

function debounce(func, time) {
    var timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(func, time);
    }

}

module.exports = {
    //simple extend function
    extend: function extend(target) {
        var i, k;
        for (i = 1; i < arguments.length; i++) {
            if (arguments[i]) {
                for (k in arguments[i]) {
                    if (arguments[i].hasOwnProperty(k) && (typeof arguments[i][k] !== "undefined")) {
                        target[k] = arguments[i][k];
                    }
                }
            }
        }
        return target;
    },
    noop: function () {},
    id: function (a) {
        return a
    },
    bindThis: function (that, func) {
        return function () {
            return func.apply(that, arguments);
        }
    },
    debounce: debounce,
    contains: contains,
    each: each,
    normalizeURL: normalizeURL,
    normalizePath: normalizePath,
    httpsURL: function (url) {
        return "https://" + (normalizeURL(url).replace(/^https?:\/\//, ""));
    },
    encodeNameSafe: function (name) {
        if (!name) {
            throw new Error("No name given");
        }
        if (disallowedChars.test(name)) {
            throw new Error("Disallowed characters in path");
        }

        name = name.replace(/^\/\//, "/");

        return (name);
    },
    encodeURIPath: function (text){
        return encodeURI(text).replace(/#/g,"%23");
    }
};
