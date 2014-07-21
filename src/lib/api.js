var APIMain = require("./api_elements/main");
var storageFacade = require("./api_elements/storage");
var linkFacade = require("./api_elements/link");


module.exports = function (options) {
    var main = APIMain(options);
    var storage = storageFacade(main, options);
    var link = linkFacade(main, options);
    var api = {
        auth: main,
        storage: storage,
        link: link
    };

    if (options.acceptForwarding) {
        //will handle incoming forwards
        var responder = require("./api_forwarder/responder");
        responder(options, api);
    } else {
        //IE 8 and 9
        if (window.XDomainRequest) { //true only in IE
            var forwarder = require("./api_forwarder/sender");
            forwarder(options, api);
        }
    }
    
    return api;
};