var promises = require("q");
module.exports = function (interval, func, errorHandler) {
    var pointer, stopped = false,
        repeat = function () {
            clearTimeout(pointer);
            pointer = setTimeout(runner, 1);
        },
        runner = function () {
            var currentPointer = pointer;
            promises({
                interval: interval,
                repeat: repeat
            }).then(func).fail(function (e) {
                if (errorHandler) {
                    return errorHandler(e);
                } else {
                    console && console.error("Error in scheduled function", e);
                }
            }).then(function () {
                //pointer changes only if repeat was called and there's no need to schedule next run this time
                if (!stopped && currentPointer === pointer) {
                    pointer = setTimeout(runner, interval);
                }
            });
        };

    runner();

    return {
        stop: function () {
            stopped = true;
            clearTimeout(pointer);
        },
        forceRun: function () {
            stopped = false;
            return repeat();
        }
    };
};