//wrapper for any promises library
var pinkySwear = require('pinkyswear');

//for pinkyswear starting versions above 2.10
var createErrorAlias = function (promObj) {
    promObj.error = function (func) {
        return promObj.then(0, func);
    };
    return promObj;
}

module.exports = {
    "defer": function () {
        var promise = pinkySwear(createErrorAlias);
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
        var promise = pinkySwear(createErrorAlias);
        promise(value);
        return promise;
    }

}