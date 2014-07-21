var helpers = require('../reusables/helpers');


//returns postMessage specific handler
function createMessageHandler(sourceOrigin, marker, callback) {
    return function (event) {

        if (!sourceOrigin || helpers.normalizeURL(event.origin) === helpers.normalizeURL(sourceOrigin)) {
            var message = event.data;
            if (message.substr(0, 2) === marker) {
                try {
                    message = JSON.parse(message.substring(2));

                } catch (e) {
                    //broken? ignore
                }
                if (message) {
                    callback(message);
                }
            }
        }
    };
}

function sendMessage(targetWindow, channel, action, dataString) {
    var targetOrigin = "*";

    if (typeof dataString !== "string" || typeof action !== "string") {
        throw new TypeError("only string is acceptable as action and data");
    }

    try {
        targetOrigin = targetWindow.location.origin || targetWindow.location.protocol + "//" + targetWindow.location.hostname + (targetWindow.location.port ? ":" + targetWindow.location.port : "");
    } catch (E) {}


    dataString = dataString.replace(/"/gm, '\\"').replace(/(\r\n|\n|\r)/gm, "");
    targetWindow.postMessage(channel.marker + '{"action":"' + action + '","data":"' + dataString + '"}', targetOrigin);

}

module.exports = {
    sendMessage: sendMessage,
    createMessageHandler: createMessageHandler
}