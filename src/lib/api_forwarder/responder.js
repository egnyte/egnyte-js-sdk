var helpers = require('../reusables/helpers');
var dom = require('../reusables/dom');
var messages = require('../reusables/messages');

function init(options, api) {

    var channel;

    channel = {
        marker: options.channelMarker,
        sourceOrigin: options.egnyteDomainURL
    };

    function actionsHandler(message) {
    debugger;
        if (message.action && message.action === "call") {
            var data = JSON.parse(message.data);
            if (api[data.ns] && api[data.ns][data.name]) {
                api.auth.setToken(data.token);
                api[data.ns][data.name].apply("whatever", data.args).then(function (res) {
                    messages.sendMessage(window.parent, channel, "result", JSON.stringify({
                        status: true,
                        resolution: res,
                        uid: data.uid
                    }));
                }, function (res) {
                    messages.sendMessage(window.parent, channel, "result", JSON.stringify({
                        status: false,
                        resolution: res,
                        uid: data.uid
                    }));
                })

            } else {
                //send something to clean up the caller
                messages.sendMessage(window.parent, channel, "nomethod", JSON.stringify({
                    uid: data.uid
                }));
            }
        }
    }

debugger;
    channel.handler = messages.createMessageHandler(null, channel.marker, actionsHandler);
    channel._evListener = dom.addListener(window, "message", channel.handler);
    dom.addListener(window, "message", function(){
        debugger;
    });

}

module.exports = init;