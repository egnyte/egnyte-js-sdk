var helpers = require('../reusables/helpers');
var dom = require('../reusables/dom');
var messages = require('../reusables/messages');

function serializablifyXHR(res) {
    var resClone = {};
    for (var key in res) {
        //purposefully getting items from prototype too
        if (typeof res[key] !== "function" && key !== "headers") {
            resClone[key] = res[key];
        }
    };
    return resClone;
}

function init(options, api) {

    var channel;

    channel = {
        marker: options.channelMarker,
        sourceOrigin: options.egnyteDomainURL
    };

    function actionsHandler(message) {
        if (message.action && message.action === "call") {
            var data = message.data;
            if (api[data.ns] && api[data.ns][data.name]) {
                api.auth.setToken(data.token);
                api[data.ns][data.name].apply(api[data.ns], data.args).then(function (res) {
                    if (res instanceof XMLHttpRequest) {
                        res = serializablifyXHR(res);
                    }
                    messages.sendMessage(window.parent, channel, "result", {
                        status: true,
                        resolution: res,
                        uid: data.uid
                    });
                }, function (res) {
                    messages.sendMessage(window.parent, channel, "result", {
                        status: false,
                        resolution: res,
                        uid: data.uid
                    });
                })

            } else {
                //send something to clean up the caller
                messages.sendMessage(window.parent, channel, "nomethod", {
                    uid: data.uid
                });
            }
        }
    }

    channel.handler = messages.createMessageHandler(null, channel.marker, actionsHandler);
    channel._evListener = dom.addListener(window, "message", channel.handler);

}

module.exports = init;