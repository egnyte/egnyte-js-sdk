var helpers = require('../reusables/helpers');


//returns postMessage specific handler
function createMessageHandler(sourceOrigin, marker, callback) {
    return function (event) {
        if (!sourceOrigin || helpers.normalizeURL(event.origin) === helpers.normalizeURL(sourceOrigin)) {
            var message = event.data;
            if (typeof message === 'string' && message.substr(0, marker.length) === marker) {
                try {
                    message = JSON.parse(message.substring(marker.length));

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

function sendMessage(targetWindow, channel, action, data, originOverride) {
    var targetOrigin = "*",
        pkg;

    if (typeof action !== "string") {
        throw new TypeError("only string is acceptable as action");
    }

    if (originOverride) {
        targetOrigin = originOverride;
    } else {
        try {
            //the if is needed as some browsers will return undefined when accessing location is forbidden
            if (targetWindow.location.origin || targetWindow.location.protocol) {
                targetOrigin = targetWindow.location.origin || targetWindow.location.protocol + "//" + targetWindow.location.hostname + (targetWindow.location.port ? ":" + targetWindow.location.port : "");
            }
        } catch (E) {}
    }
    pkg = JSON.stringify({
        action: action,
        data: data
    });
    pkg = pkg.replace(/(\r\n|\n|\r)/gm, "");
    targetWindow.postMessage(channel.marker + pkg, targetOrigin);
}

module.exports = {
    sendMessage: sendMessage,
    createMessageHandler: createMessageHandler
}
