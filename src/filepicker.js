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
        iframe.parentNode.removeChild(iframe);
    }

    function actionHandler(close, callback, cancelCallback) {
        return function (message) {
            if (message.action) {
                switch (message.action) {
                case "selection":
                    if (callback(message.data) !== false) {
                        close();
                    }
                    break;
                case "cancel":
                    close();
                    cancelCallback();
                    break;
                }
            }
        }
    }

    function init(options) {

        options = helpers.extend(defaults, options);

        var filePicker = function (node, callback, cancelCallback) {
            var iframe;
            var channel = {
                marker: options.channelMarker,
                sourceOrigin: options.egnyteDomainURL
            }
            var close = function () {
                destroy(channel, iframe);
            };
            iframe = dom.createFrame(options.egnyteDomainURL + "/" + options.filepickerViewAddress);

            listen(channel, actionHandler(close, callback, cancelCallback));
            node.appendChild(iframe);
            
            return {
                close: close
            }
        }

        return filePicker;

    }

    module.exports = init;


})();