(function () {

    var helpers = require('../reusables/helpers');
    var dom = require('../reusables/dom');
    var messages = require('../reusables/messages');

    var defaults = {
        filepickerViewAddress: "folderExplorer.html",
        channelMarker: "'E"
    };


    function listen(channel, callback) {
        channel.handler = messages.createMessageHandler(channel.sourceOrigin, channel.marker, callback);
        channel._evListener = dom.addListener(window, "message", channel.handler);
    }

    function destroy(channel, iframe) {
        channel._evListener.destroy();
        if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
        }
    }


    function actionsHandler(close, actions) {
        return function (message) {
            var actionResult;
            if (message.action) {

                if (actions.hasOwnProperty(message.action) && actions[message.action] && actions[message.action].call) {
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

        filePicker = function (node, setup) {
            if (!setup) {
                throw new Error("Setup required as a second argument");
            }
            var iframe;
            var channel = {
                marker: options.channelMarker,
                sourceOrigin: options.egnyteDomainURL
            };
            //informs the view to open a certain location
            var sendOpenAt = function () {
                if (setup.path) {
                    messages.sendMessage(iframe.contentWindow, channel, "openAt", setup.path);
                }
            }
            var close = function () {
                destroy(channel, iframe);
            };


            iframe = dom.createFrame(options.egnyteDomainURL + "/" + options.filepickerViewAddress);

            listen(channel,
                actionsHandler(close, {
                    "selection": setup.selection || helpers.noop,
                    "cancel": setup.cancel || helpers.noop,
                    "ready": function () {
                        ready = true;
                        sendOpenAt();
                        setup.ready || setup.ready();
                    }
                })
            );

            node.appendChild(iframe);

            return {
                close: close
            };
        };

        return filePicker;

    }

    module.exports = init;


})();