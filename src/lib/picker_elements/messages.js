var helpers = require('../helpers');
var parse_json = (JSON && JSON.parse) ? JSON.parse : require("./json_parse_state");


//returns postMessage specific handler
function createMessageHandler(sourceOrigin, marker, callback) {
    return function (event) {
        if (!sourceOrigin || helpers.normalizeURL(event.origin) === helpers.normalizeURL(sourceOrigin)) {
            var message = event.data;
            if (message.substr(0, 2) === marker) {
                try {
                    message = parse_json(message.substring(2));

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
        targetOrigin = targetWindow.location.origin || window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
    } catch (E) {}

    dataString = dataString.replace(/"/gm, '\\"').replace(/(\r\n|\n|\r)/gm, "");
    targetWindow.postMessage(channel.marker + '{"action":"' + action + '","data":"' + dataString + '"}', targetOrigin);
}

module.exports = {
    sendMessage: sendMessage,
    createMessageHandler: createMessageHandler
}