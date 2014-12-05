var promises = require("q");
module.exports = function (interval, func) {
    var pointer, runner = function () {
        promises(true).then(func).then(function () {
            pointer = setTimeout(runner, interval);
        }).fail(function (e) {
            console && console.error("Error in scheduled function", e);
        });
    }
    runner();
    return {
        stop: function () {
            clearTimeout(pointer);
        }
    }
}