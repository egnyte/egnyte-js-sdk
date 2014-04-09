var parse_json = (JSON && JSON.parse) ? JSON.parse : require("./json_parse_state");

module.exports = {
    //simple extend function
    extend: function (target) {
        var i, k;
        for (i = 1; i < arguments.length; i++) {
            if (arguments[i]) {
                for (k in arguments[i]) {
                    if (arguments[i].hasOwnProperty(k)) {
                        target[k] = arguments[i][k];
                    }
                }
            }

        }
        return target;
    },
    
    normalizeURL: function(url){
        return (url+"/").replace(/\/\/$/,"/");
    },

    parse_json: parse_json,

    //returns postMessage specific handler
    createMessageHandler: function (sourceOrigin, marker, callback) {
        return function (event) {
            if (!sourceOrigin || event.origin === sourceOrigin) {
                var message = event.data;
                if (message.substr(0, 2) === marker) {
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
    }

}