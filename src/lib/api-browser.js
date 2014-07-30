var RequestEngine = require("./api_elements/reqengine");
var AuthEngine = require("./api_elements/auth");
var StorageFacade = require("./api_elements/storage");
var LinkFacade = require("./api_elements/link");


module.exports = function (options) {
    var auth = new AuthEngine(options);
    var requestEngine = new RequestEngine(auth, options);
    
    var storage = new StorageFacade(requestEngine);
    var link = new LinkFacade(requestEngine);
    var api = {
        auth: auth,
        storage: storage,
        link: link
    };

    if (options.acceptForwarding) {
        //will handle incoming forwards
        var responder = require("./api_forwarder/responder");
        responder(options, api);
    } else {
        //IE 8 and 9
        if (!("withCredentials" in (new window.XMLHttpRequest()))) { 
            var forwarder = require("./api_forwarder/sender");
            forwarder(options, api);
        }
    }
    
    api.manual = requestEngine;
    
    return api;
};