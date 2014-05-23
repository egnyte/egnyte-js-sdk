//wrapper for any promises library
var pinkySwear = require('pinkyswear');

module.exports = {
    "defer": function () {
        var promise = pinkySwear();
        return {
            promise: promise,
            resolve: function (a) {
                promise(true, [a]);
            },
            reject: function (a) {
                promise(false, [a]);
            }
        };
    },
    "start": function (value) {
        var promise = pinkySwear();
        promise(value);
        return promise;
    }

}