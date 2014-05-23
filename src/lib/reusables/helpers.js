
module.exports = {
    //simple extend function
    extend: function extend(target) {
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
    },
    noop: function () {},
    each: function each(collection, fun) {
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
    },
    normalizeURL: function (url) {
        return (url).replace(/\/*$/, "");
    },
    encodeNameSafe: function (name) {
        name.split("/").map(function (e) {
            return e.replace(/[^a-z0-9 ]*/gi, "");
        })
            .join("/")
            .replace(/^\//, "");

        return (name);
    }
};