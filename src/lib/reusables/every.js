var promises = require("q");
module.exports = function (interval, func) {
    var pointer,
        repeat = function () {
            clearTimeout(pointer);
            pointer = setTimeout(runner,1);
        },
        runner = function () {
            promises({
                interval: interval,
                repeat: repeat
            }).then(func).then(function () {
                pointer = setTimeout(runner, interval);
            }).fail(function (e) {
                console && console.error("Error in scheduled function", e);
            });
        }
    runner();
    return {
        stop: function () {
            clearTimeout(pointer);
        },
        forceRun: repeat
    }
}