var promises = require("q");
module.exports = function (interval, func, errorHandler) {
    var pointer, stopped = false,
        repeat = function () {
            stopped = false;
            clearTimeout(pointer);
            pointer = setTimeout(runner, 1);
        },
        runner = function () {
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
                if (!stopped) {
                    pointer = setTimeout(runner, interval);
                }
            });
        }
    runner();
    return {
        stop: function () {
            stopped = true;
            clearTimeout(pointer);
        },
        forceRun: repeat
    }
}