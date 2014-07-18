var promises = require('../promises');
var helpers = require('../reusables/helpers');
var dom = require('../reusables/dom');
var messages = require('../reusables/messages');



var pending = {};



function actionsHandler(message) {
    var data = JSON.parse(message.data);
    if (message.action) {
        if (message.action === "result") {
            pending[data.uid](data.status, data.resolution);
            pending[data.uid] = null;
        }
        if (message.action === "nomethod") {
            pending[data.uid] = null;
        }
    }
}



function remoteCall(channel, namespaceName, methodName, token, args, callback) {
    var uid = ~~ (Math.random() * 9999999) + "" + ~~(Math.random() * 9999999);
    pending[uid] = callback;
    debugger;
    messages.sendMessage(channel.iframe.contentWindow, channel, "call", JSON.stringify({
        ns: namespaceName,
        name: methodName,
        args: args,
        token: token,
        uid: uid
    }));

}

function forwardMethod(namespaceName, methodName, channel, getToken) {
    return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        var defer = promises.defer();
        channel.ready.promise.then(function () {
            remoteCall(channel, namespaceName, methodName, getToken(), args, function (status, resolution) {
                if (status) {
                    defer.resolve(resolution);
                } else {
                    defer.reject(resolution);
                }

            });
        });
        return defer.promise;
    }

}


function init(options, api) {

    //comm setup
    var iframe;
    var channel;

    channel = {
        marker: options.channelMarker,
        sourceOrigin: options.egnyteDomainURL,
        ready: promises.defer()
    };

    channel.handler = messages.createMessageHandler(channel.sourceOrigin, channel.marker, actionsHandler);
    channel._evListener = dom.addListener(window, "message", channel.handler);

    iframe = dom.createFrame(options.egnyteDomainURL + "/" + options.forwarderAddress);
    iframe.onload = function () {
        debugger;
        setTimeout(function () {
            channel.ready.resolve();
        }, 50);
    };
    var body = document.body || document.getElementsByTagName("body")[0];
    body.appendChild(iframe);

    channel.iframe = iframe;



    //forwarding setup
    helpers.each(api, function (apiNamespace, namespaceName) {
        if (namespaceName !== "auth") {
            for (var method in apiNamespace) {
                apiNamespace[method] = forwardMethod(namespaceName, method, channel, api.auth.getToken);
            }
        }
    });

}

module.exports = init;