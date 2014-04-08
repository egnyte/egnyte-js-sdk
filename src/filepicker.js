(function () {

    var parse_json;
    if (JSON && JSON.parse) {
        parse_json = JSON.parse;
    } else {
        parse_json = require("./json_parse_state");
    }


    var dom = require('./dom');


    function listen(channel, callback) {
        channel.handler = function (event) {
            if (event.origin === channel.sourceOrigin) {
                var message = event.data;
                if (message.substr(0, 2) === channel.marker) {
                    try {
                        message = parse_json(message.substring(2));
                        if (message) {
                            callback(message);
                        }
                    } catch (e) {
                        //broken? ignore
                    }
                }
            }
        };
        dom.addListener(window, "message", channel.handler);
    }

    function kill(channel) {
        dom.removeListener(window, "message", channel.handler);
    }

    function init(options) {

        var iframe;
        var channel = {};

        function destroy() {
            kill(channel);
            iframe.parentNode.removeChild(iframe);
        }

        function messageHandler(callback, cancelCallback) {
            return function (message) {
                if (message.action) {
                    switch (message.action) {
                    case "selection":
                        if (callback(message.data) !== false) {
                            destroy();
                        }
                        break;
                    case "cancel":
                        destroy();
                        cancelCallback();
                        break;
                    }
                }
            }
        }

        var filePicker = function (node, callback, cancelCallback) {

            iframe = dom.createFrame(options.egnyteDomainURL + "/" + options.filePicker.viewAddress);
            channel = {
                marker: options.filePicker.channelMarker,
                sourceOrigin: options.egnyteDomainURL
            }

            listen(channel, messageHandler(callback, cancelCallback));
            node.appendChild(iframe);
            return {
                close: destroy
            }
        }

        return filePicker;

    }
    
    module.exports = init;
    

})();