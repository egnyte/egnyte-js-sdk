var promises = require("q");
var helpers = require('../reusables/helpers');
var dom = require('../reusables/dom');
var messages = require('../reusables/messages');



var pending = {};
var origin = "";


function actionsHandler(message) {
    var data = message.data;
    if (message.action && message.data && pending[data.uid]) {
        if (message.action === "result") {
            pending[data.uid](data.status, data.resolution);
            pending[data.uid] = null;
        }
        if (message.action === "nomethod") {
            pending[data.uid] = null;
        }
    }
}

function guid() {
    return ("" + ~~(Math.random() * 9999999) + ~~(Math.random() * 9999999))
}


function remoteCall(channel, namespaceName, methodName, token, args, callback) {
    var uid = guid();
    pending[uid] = callback;
    messages.sendMessage(channel.iframe.contentWindow, channel, "call", {
        ns: namespaceName,
        name: methodName,
        args: args,
        token: token,
        uid: uid
    }, origin);

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

function setupForwarding(api, channel) {

    var mkForwarder = function (namespaceName, method) {
        api[namespaceName][method] = forwardMethod(namespaceName, method, channel, function () {
            return api.auth.getToken()
        });
    }

    //forwarding setup
    helpers.each(api, function (apiNamespace, namespaceName) {
        if (namespaceName !== "auth") {
            for (var method in apiNamespace) {
                mkForwarder(namespaceName, method);
            }
        }
    });
    //manual forwarder, leave other auth methods be
    mkForwarder("auth", "getUserInfo");

    var parentDestroy = api.destroy;
    api.destroy = function () {
        channel._evListener.destroy();
        channel.iframe.parentNode.removeChild(channel.iframe);
        if (parentDestroy) {
            return parentDestroy.apply(api, arguments)
        }
    }

    return api;
}


function init(options, api) {
    origin = options.egnyteDomainURL;
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
    iframe.style.display = "none";

    //give IE time to get the iframe going
    var onIframeLoad = function () {
        setTimeout(function () {
            channel.ready.resolve();
        }, 50);
    }
  
    if (iframe.addEventListener) {
        iframe.addEventListener('load', onIframeLoad, false);
    } else if (iframe.attachEvent) {
        iframe.attachEvent('onload', onIframeLoad);
    }
    var body = document.body || document.getElementsByTagName("body")[0];
    body.appendChild(iframe);

    channel.iframe = iframe;

    return setupForwarding(api, channel);

}

module.exports = init;