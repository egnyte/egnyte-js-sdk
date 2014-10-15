//wrapper for any promises library
var pinkySwear = require('pinkyswear');
var helpers = require('./reusables/helpers');

//for pinkyswear starting versions above 2.10
var createErrorAlias = function (promObj) {
    promObj.fail = function (func) {
        return promObj.then(0, func);
    };
    return promObj;
}

var Promises = function (value) {
    var promise = pinkySwear(createErrorAlias);
    promise(value);
    return promise;
}

Promises.defer = function () {
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
}

Promises.allSettled = function (array) {
    var collectiveDefere = Promises.defer();
    var results = [];
    var counter = array.length;
    var resolver = function (num, item) {
        results[num] = item;
        if (--counter === 0) {
            collectiveDefere.resolve(results);
        }
    }
    helpers.each(array, function (promise, num) {
        promise.then(function (result) {
            resolver(num, {
                state: "fulfilled",
                value: result
            });
        }, function (err) {
            resolver(num, {
                state: "rejected",
                reason: err
            });
        })
    });
    return collectiveDefere.promise;
}

module.exports = Promises;