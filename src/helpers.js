var parse_json = (JSON && JSON.parse) ? JSON.parse : require("./json_parse_state");

function normalizeURL(url) {
    return (url).replace(/\/*$/, "");
}

//returns postMessage specific handler
function createMessageHandler(sourceOrigin, marker, callback) {
    return function (event) {
        if (!sourceOrigin || normalizeURL(event.origin) === normalizeURL(sourceOrigin)) {
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
        targetOrigin = targetWindow.location.origin;
    } catch (E) {}

    dataString = dataString.replace(/"/gm, '\\"').replace(/(\r\n|\n|\r)/gm, "");
    targetWindow.postMessage(channel.marker + '{"action":"' + action + '","data":"' + dataString + '"}', targetOrigin);
}

//simple extend function
function extend(target) {
    var i, k;
    for (i = 1; i < arguments.length; i++) {
        if (arguments[i]) {
            for (k in arguments[i]) {
                if (arguments[i].hasOwnProperty(k)) {
                    target[k] = arguments[i][k];
                }
            }
        }

    }
    return target;
}

module.exports = {
    extend: extend,
    normalizeURL: normalizeURL,
    parse_json: parse_json,
    createMessageHandler: createMessageHandler,
    sendMessage: sendMessage
};