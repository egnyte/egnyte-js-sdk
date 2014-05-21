var subs = {}

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
    subscribe: function (topic, cb) {
        if (!subs[topic]) {
            subs[topic] = [];
        }
        subs[topic].push(cb);
    },
    publish: function (topic, data) {
        if (subs[topic]) {
            setTimeout(function () {
                each(subs[topic], function (cb) {
                    cb(data);
                })
            }, 0);
        }
    },
    each: function each(arr, fun) {
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                if (i in arr)
                    fun.call(null, arr[i], i, arr);
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