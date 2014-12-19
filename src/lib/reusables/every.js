var promises = require("q");
module.exports = function (interval, func) {
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
            }).then(func).then(function () {
                if (!stopped) {
                    pointer = setTimeout(runner, interval);
                }
            }).fail(function (e) {
                console && console.error("Error in scheduled function", e);
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