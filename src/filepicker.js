(function () {

    var dom = require('./dom');
    var helpers = require('./helpers');

    var defaults = {
        filepickerViewAddress: "folderExplorer.html",
        channelMarker: "'E"
    };


    function listen(channel, callback) {
        channel.handler = helpers.createMessageHandler(channel.sourceOrigin, channel.marker, callback);
        dom.addListener(window, "message", channel.handler);
    }

    function destroy(channel, iframe) {
        dom.removeListener(window, "message", channel.handler);
        if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
        }
    }


    function actionsHandler(close, actions) {
        return function (message) {
            var actionResult;
            if (message.action) {

                if (actions.hasOwnProperty(message.action) && actions[message.action].call) {
                    actionResult = actions[message.action](message.data);
                }

                switch (message.action) {
                case "selection":
                    if (actionResult !== false) {
                        close();
                    }
                    break;
                case "cancel":
                    close();
                    break;
                }

            }
        };
    }

    function init(options) {
        var filePicker;
        var ready = false;
        options = helpers.extend(defaults, options);

        filePicker = function (node, callback, cancelCallback) {
            var iframe;
            var channel = {
                marker: options.channelMarker,
                sourceOrigin: options.egnyteDomainURL
            };
            //informs the view to open a certain location
            var sendOpenAt = function () {
                if (options.openAt) {
                    helpers.sendMessage(iframe.contentWindow, channel, "openAt", options.openAt);
                }
            }
            var close = function () {
                destroy(channel, iframe);
            };
            var openAt = function (location) {
                options.openAt = location;
                if (ready) {
                    sendOpenAt();
                }
            };
            
            
            iframe = dom.createFrame(options.egnyteDomainURL + "/" + options.filepickerViewAddress);

            listen(channel,
                actionsHandler(close, {
                    "selection": callback,
                    "cancel": cancelCallback,
                    "ready": function () {
                        ready = true;
                        sendOpenAt();
                    }
                })
            );

            node.appendChild(iframe);

            return {
                close: close,
                openAt: openAt
            };
        };

        return filePicker;

    }

    module.exports = init;


})();