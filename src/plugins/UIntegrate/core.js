module.exports = function (promises, dom, messages, callback) {
    var init = promises.defer();
    var remoteDomain, appUID;

    var channel = {
        marker: "-U",
        sourceOrigin: null //initial message only, origin is unknown anyway
    };

    var sendTarget = window.opener || window.parent;

    function actionsHandler(message) {
        if (message.action && message.data && message.action === "init") {
            init.resolve(message.data);
        }
    }

    function sendIdentified(action, body) {
        messages.sendMessage(sendTarget, channel, action, {
            uid: appUID,
            body: body
        }, remoteDomain);
    }

    function complete(body) {
        sendIdentified("complete", body);
    }

    function reload() {
        sendIdentified("reload");
    }

    function error(body) {
        sendIdentified("error", body);
    }
    
    function close() {
        sendIdentified("close");
    }

    channel.handler = messages.createMessageHandler(channel.sourceOrigin, channel.marker, actionsHandler);
    channel._evListener = dom.addListener(window, "message", channel.handler);

    dom.addListener(window, "unload", close);
    dom.addListener(window, "pagehide", reload);

    //init
    messages.sendMessage(sendTarget, channel, "load", null, remoteDomain);

    init.promise.then(function (input) {
        remoteDomain = input.origin;
        appUID = input.uid;
        callback({
            data: input.data,
            reload: reload,
            error: error,
            complete: complete
        });
    });

}